/* games/eventide/src/main.js: Eventide 1980, The Home on Slipe Pen Road (the plan is docs/games/eventide.md).
   Seven chapters, from a visit to the Eventide Home in May 1980, through the night of the fire of 20 May, to the monument today.
   Built on the shared engine. Controls, journal, chapters, saving and tests follow Kendal 1957 (games/kendal/src/main.js), which this file is modelled on.
   Layout: setup, state and controls, people, places and scenes, interface, saving, talking, chapters and stages, things to do, the night, the helper arrow, sound, loading, the loop, tests.
   Rules that shape the code: the fire is only ever seen from behind the rope and nobody is shown in it or hurt (docs/games/eventide.md, "How the fire is told");
   nothing the player does changes what happened; skin is lightened so faces read in every light (owner rule 9). */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, chirp, tone, crackle } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { slideWalls } from '../../../engine/placement.js';
import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
import { grip, gripTick, spreadArms } from '../../../engine/grip.js';
import { snapMeshes, auditPlace as auditPlaceE, auditHeld, auditThrough } from '../../../engine/audit.js';
import { G, makeSky, ease, rng, batchStatic } from './gfx.js';
import { hamper, bucket, suitcase } from './props.js';
import { buildSlipe, buildWard, buildPark80, buildGolden, buildMonument } from './places.js';
import { CHAPTERS, GOALS, TALK_TARGETS, NEXT_AFTER_TALK, CHAPTER_END, TALK, LATER, JOURNAL, LETTER, TIDY, RADIO, SORT, SORT_KINDS, TIMELINE, PLAQUE, CHOICE_NAMES } from './content.js';

const $ = (id) => document.getElementById(id);
const PI = Math.PI;
soundPref('eventide-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });
const QUICK = __DEV__ && /[?&](shot|auto|test)=/.test(location.search);   /* test views skip fades and speed up timed scenes */
const TS = QUICK ? 0.06 : 1;

/* ---------- renderer, camera, light, sky ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(66, 1, 0.1, 800); scene.add(camera);
const hemi = new THREE.HemisphereLight(0xffffff, 0x887766, 2); scene.add(hemi); const sun = new THREE.DirectionalLight(0xfff0d0, 2); scene.add(sun); scene.add(sun.target);
const SHADOWS = !matchMedia('(pointer: coarse)').matches && !(__DEV__ && /[?&]noshadow/.test(location.search));   /* real shadows on computers; phones get soft blob shadows under people */
renderer.shadowMap.enabled = SHADOWS; renderer.shadowMap.type = THREE.PCFShadowMap; sun.shadow.mapSize.set(2048, 2048); { const sc = sun.shadow.camera; sc.left = -46; sc.right = 46; sc.top = 46; sc.bottom = -46; sc.near = 1; sc.far = 260; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06; }
const sunDir = new THREE.Vector3(0.4, 0.8, 0.4);
const faceFill = new THREE.PointLight(0xffdcb8, 0, 8, 2); camera.add(faceFill);   /* owner rule 9: in the dark, a soft warm light from where you stand, so the face of anyone you talk to shows */
const sky = makeSky(); for (const o of sky.objects) scene.add(o);
scene.fog = new THREE.Fog(0xcfe2e6, 60, 240);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 76 : 66; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const ENV = {   /* times of day: sky top and horizon, haze, ambient light, sun, stars, moon, and the fill light for faces */
  day: { top: 0x58a6e4, hor: 0xd6eaf0, fog: 0xcfe2e6, fogN: 80, fogF: 280, hemi: [0xeaf4ff, 0x8a7a5a, 2.1], sun: [0xfff2dc, 2.4, [20, 30, 10]], stars: 0, moon: 0, fill: 0 },
  hazy: { top: 0x7fa6c8, hor: 0xe6e2d2, fog: 0xdcd8c6, fogN: 50, fogF: 220, hemi: [0xf4f0e0, 0x8a7a5a, 1.9], sun: [0xfff0d0, 2.0, [14, 26, 12]], stars: 0, moon: 0, fill: 0 },
  dusk: { top: 0x26356a, hor: 0xe08a62, fog: 0x8a6a6a, fogN: 30, fogF: 190, hemi: [0xe9b8a0, 0x4a3c48, 1.25], sun: [0xff8a4a, 1.0, [-40, 6, 12]], stars: 0.35, moon: 0, fill: 0.9 },
  night: { top: 0x03050e, hor: 0x2a1c1a, fog: 0x120f12, fogN: 10, fogF: 130, hemi: [0x5a6488, 0x3a2414, 0.85], sun: [0x8ea8ff, 0.35, [30, 40, -20]], stars: 0.8, moon: 1, fill: 2.2 },
  dawn: { top: 0x44568a, hor: 0xf1b186, fog: 0xbfa594, fogN: 14, fogF: 150, hemi: [0xffdcc0, 0x54464a, 1.3], sun: [0xffa860, 1.1, [-40, 6, 0]], stars: 0.1, moon: 0, fill: 0.6 },
  indoor: { top: 0xd8ceb4, hor: 0xd8ceb4, fog: 0xd8ceb4, fogN: 60, fogF: 200, hemi: [0xfff4dc, 0x9a8468, 2.0], sun: [0xfff0d0, 0.9, [4, 10, 6]], stars: 0, moon: 0, fill: 0.8 },
};
let envNow = ENV.day;
function setEnv(e) {
  envNow = e; scene.fog.color.setHex(e.fog); scene.fog.near = e.fogN; scene.fog.far = e.fogF; scene.background = scene.fog.color;
  hemi.color.setHex(e.hemi[0]); hemi.groundColor.setHex(e.hemi[1]); hemi.intensity = e.hemi[2]; sun.color.setHex(e.sun[0]); sun.intensity = e.sun[1]; sunDir.set(...e.sun[2]).normalize(); sun.castShadow = SHADOWS && e.sun[1] > 0.9 && e !== ENV.indoor;
  sky.setSky(e.top, e.hor, e.stars, e.moon, Math.min(1, e.hemi[2] / 1.8)); for (const o of sky.objects) o.visible = e !== ENV.indoor; faceFill.intensity = e.fill;
}

/* ---------- state and controls ---------- */
const state = { x: 0, z: 0, yaw: 0, pitch: 0, started: false };
const EYE = 1.32, EYE_ADULT = 1.6;   /* a child's eye height; in the last chapter you are grown */
const FX = { shake: 0 };
const isTouch = matchMedia('(pointer: coarse)').matches;
const keys = new Set(); let busy = false, fading = false, frozen = false, talkWith = null, near = null;
const PANELS = ['dialogue', 'journal', 'chapters', 'credits', 'card'];
const panelsOpen = () => PANELS.some((id) => !$(id).hidden);
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); if (!$('card').hidden && CARD.dismiss) CARD.dismiss(); }
  useInteractionKey(e, () => { if (!$('dialogue').hidden && !$('next').hidden) { $('next').click(); return; } if (!busy && !frozen && near) { activate(near); return; } return false; });
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy || frozen) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) { const S = SC; if (!S) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); let best = null, bd = 1e9; for (const n of S.people) { if (n.kid || !n.m.visible || Math.hypot(state.x - n.x, state.z - n.z) > 6) continue; const h = ray.intersectObject(n.m, true)[0]; if (h && h.distance < bd) { bd = h.distance; best = n; } } return best; }
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; } if (e.pointerId === look.id) { if (look.moved < 8) { const p = tapPerson(e.clientX, e.clientY); if (p) startTalk(p); } look.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {
  const el = $('stick'); if (!isTouch || !state.started || busy || frozen || DIR.on) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest); el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}
const wallsNow = () => (SC && SC.walls ? PL[cur].walls.concat(SC.walls) : PL[cur].walls);
function clampPos(x, z) {
  const b = PL[cur].bounds, W = wallsNow(); x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  [x, z] = slideWalls([state.x, state.z], [x, z], W, 0.22);
  for (const [x0, z0, x1, z1] of W) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  if (SC) for (const n of SC.npcs) if (n.m.visible && !n.walking) { const dx = x - n.x, dz = z - n.z, d = Math.hypot(dx, dz); if (d < 0.5 && d > 0.001) { x = n.x + dx / d * 0.5; z = n.z + dz / d * 0.5; } }   /* people are solid */
  return [x, z];
}

/* ---------- people. The bodies already exist: Miss Iris, a girl and a boy made for this game, and bodies shared with Kendal 1957.
   A look is a body plus a colour per garment (and which of the body's hats shows). The clothes themselves are not changed here. ---------- */
const HATS = { man_work: ['Hat', 'Cap'], man_suit: ['Hat', 'TopHat', 'Cap'], man_shirt: ['Hat', 'Cap'], man_elder: ['Cap', 'Hat'], woman57: ['Hat', 'Cap'], woman_elder: ['Hat', 'Wrap'], boy: ['Hat'] };
const KID = { boy: 0.8, girl: 0.8 };
const L = (base, tint, o = {}) => ({ base, tint, ...(KID[base] ? { scale: KID[base] } : {}), ...o });
const NAVY = 0x1a2540, WHITE = 0xf2f0ea;
const LOOKS = {
  gran: L('woman_elder', { Hat: 0x4a3a6a, HatBand: 0xe6e0ee, Shirt: 0xf2eee6, Skirt: 0x2a3a5a, Shoes: 0x1c1816 }, { hat: 'Hat' }),
  granNight: L('woman_elder', { Wrap: 0xd8d0e0, Shirt: 0xd8c8d0, Skirt: 0x4a4458, Shoes: 0x1c1816 }, { hat: 'Wrap' }),
  granBlack: L('woman_elder', { Hat: 0x1c1c22, HatBand: 0x3a3a44, Shirt: 0x26262c, Skirt: 0x1c1c22, Shoes: 0x121212 }, { hat: 'Hat' }),
  iris: L('iris1980', {}),
  hyacinth: L('woman_elder', { Wrap: 0xe0a030, Shirt: 0xe8dcc0, Skirt: 0x7a4a2a, Shoes: 0x2a2018 }, { hat: 'Wrap' }),
  maude: L('woman_elder', { Wrap: 0x3a4a7a, Shirt: 0xf2f0ea, Skirt: 0x3a3a48, Shoes: 0x1c1816 }, { hat: 'Wrap', skin: 1.08 }),
  dora: L('woman_elder', { Wrap: 0xf0e8ec, Shirt: 0xe6b8c8, Skirt: 0x8a5a78, Shoes: 0x2a2018 }, { hat: 'Wrap', skin: 0.94 }),
  nurse: L('woman57', { Shirt: WHITE, Skirt: 0xe8e8ea, Cap: 0xf6f6f4, Belt: 0xe8e8ea, Shoes: 0xe8e4dc }, { hat: 'Cap' }),
  gateman: L('man_elder', { Cap: 0x3a4a3a, Shirt: 0xd8d4c0, Waistcoat: 0x4a5a4a, Breeches: 0x3a3a34, Shoes: 0x1c1816 }, { hat: 'Cap', hide: ['Waistcoat'] }),
  fireman: L('man_work', { Shirt: NAVY, Breeches: NAVY, Waistcoat: NAVY, Cap: 0xd8b020, Shoes: 0x121212 }, { hat: 'Cap' }),
  police: L('man_shirt', { Shirt: 0xb8a878, Breeches: 0x1c2030, Cap: 0x1c2030, Tie: 0x1c2030, Shoes: 0x121212 }, { hat: 'Cap', hide: ['Waistcoat'] }),   /* a policeman "in khaki" (Gleaner, 2020) */
  mournerNurse: L('woman_elder', { Hat: 0x2a2a30, HatBand: 0x4a4a52, Shirt: 0xe8e4dc, Skirt: 0x2a2a30, Shoes: 0x121212 }, { hat: 'Hat' }),
  neighbour: L('woman57', { Shirt: 0xd8d0c4, Skirt: 0x3a3440, Belt: 0x2a2630, Hat: 0x3a3440, HatBand: 0x1c1c22 }, { hat: 'Hat' }),
  nephew: L('man_suit', { Jacket: 0x1e1e24, Waistcoat: 0x1e1e24, Breeches: 0x1e1e24, Shirt: 0xf0ece0, Tie: 0x101014, Shoes: 0x121212 }, { hat: false }),
  official: L('man_suit', { Jacket: 0x23232a, Waistcoat: 0x23232a, Breeches: 0x23232a, Shirt: 0xf0ece0, Tie: 0x16161a, Shoes: 0x121212 }, { hat: false }),
  kayla: L('girl', { Shirt: 0xf4f0e6, Skirt: 0x2a4a8a, Belt: 0x2a4a8a, Ribbon: 0xf4f0e6, Shoes: 0x1c1816 }, { scale: 0.86 }),
  guard: L('woman57', { Shirt: NAVY, Skirt: NAVY, Belt: 0x101826, Cap: NAVY, Shoes: 0x121212 }, { hat: 'Cap' }),   /* the Fire Brigade's guard of honour of forty women, 20 May 2026 (JIS) */
  kidA: L('girl', { Shirt: 0xe8c8d4, Skirt: 0xe8c8d4, Belt: 0x8a4a5a, Ribbon: 0xf0ece0, Shoes: 0x1c1816 }, { scale: 0.72 }),
  kidB: L('boy', { Shirt: 0xd8e8c8, Breeches: 0x4a4a4a, Shoes: 0x1c1816 }, { hat: false, scale: 0.78 }),
  kidC: L('girl1980', {}, { scale: 0.92 }),
};
const DRESS = [0xf2eee6, 0xe8c8d4, 0xc8d8e8, 0xd8e8c8, 0xf0dca0, 0xd4b8e0, 0xe8a8a0, 0x9ac8c0], DARK = [0x2a3a5a, 0x4a2a3a, 0x2a4a3a, 0x3a3a3a, 0x5a3a2a], BLACKS = [0x1c1c22, 0x26262c, 0x2a2a34, 0x1e2430, 0x33303a], TROUS = [0x2a3040, 0x4a4a4a, 0xb5a07a, 0x6a6458, 0x2e2a28];
const lady = (i, at) => ({ base: 'woman_elder', hat: 'Wrap', tint: { Wrap: DRESS[(i + 3) % 8], Shirt: DRESS[i % 8], Skirt: DARK[i % 5], Shoes: 0x1c1816 }, x: at[0], z: at[1], ry: at[2] || 0, ground: at[3] || 0, anim: 'Idle', skin: 0.92 + (i % 3) * 0.08 });
/* background people: mood 'day' (bright), 'night' (plain night clothes) or 'black' (mourning). areas: [[x0, z0, x1, z1], ...] */
function crowd(n, seed, areas, { mood = 'day', face = null, carry = 0 } = {}) {
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) { const a = areas[i % areas.length], x = a[0] + r() * (a[2] - a[0]), z = a[1] + r() * (a[3] - a[1]), ry = face ? Math.atan2(face[0] - x, face[1] - z) + (r() - 0.5) * 0.5 : r() * 6.28, k = r(), dark = mood === 'black', c = dark ? pick(BLACKS) : pick(DRESS);
    const at = { x, z, ry, anim: mood === 'day' ? pick(['Idle', 'Talk1', 'Idle', 'Talk2']) : pick(['Idle', 'Idle', 'Sad1', 'Sad2']), skin: 0.9 + r() * 0.3 };
    if (k < 0.45) { const elder = r() < 0.4; out.push({ base: elder ? 'woman_elder' : 'woman57', hat: mood === 'night' ? (elder ? 'Wrap' : false) : (r() < 0.6 ? 'Hat' : false), props: r() < carry ? [['RightHand', 'basket']] : undefined, tint: { Shirt: dark ? pick([0xe8e4dc, c]) : c, Skirt: dark ? c : pick([c, ...DARK]), Hat: dark ? pick(BLACKS) : pick([0xf0e8d8, 0x2a3a5a, 0x8a4a5a]), HatBand: pick(DARK), Wrap: pick(DRESS), Belt: pick(DARK), Shoes: 0x1c1816 }, ...at }); }
    else if (k < 0.8) { const suit = dark && r() < 0.6, tr = dark ? pick(BLACKS) : pick(TROUS); out.push(suit ? { base: 'man_suit', hat: false, tint: { Shirt: 0xf0ece0, Jacket: c, Waistcoat: c, Breeches: c, Tie: 0x16161a, Shoes: 0x15110e }, ...at } : { base: pick(['man_shirt', 'man_work', 'man_elder']), hat: false, hide: ['Waistcoat'], props: r() < carry ? [['RightHand', 'case']] : undefined, tint: { Shirt: dark ? 0xf0ece0 : pick([0xf4f0e6, 0xc8d8e8, 0xd8d0b8]), Breeches: tr, Tie: 0x16161a, Shoes: 0x15110e }, ...at }); }
    else { const girl = r() < 0.5, s = 0.68 + r() * 0.16; out.push(girl ? { base: 'girl', scale: s, tint: { Shirt: dark ? 0xf0ece0 : c, Skirt: dark ? pick(BLACKS) : c, Belt: pick(DARK), Ribbon: 0xf0ece0, Shoes: 0x1c1816 }, ...at } : { base: 'boy', hat: false, scale: s, tint: { Shirt: 0xf4f0e6, Breeches: dark ? pick(BLACKS) : pick(TROUS), Shoes: 0x1c1816 }, ...at }); }
  }
  return out;
}
const BASES = {}, basePromises = {};
function loadBase(id) { return BASES[id] ? Promise.resolve(BASES[id]) : (basePromises[id] = basePromises[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; })); }
const SKIN_LIGHT = 1.55;   /* owner rule 9 (as Kendal and Marcus Garvey): lighten the skin so faces read in every light */
/* things carried in a hand. The grip comes from engine/grip.js: the fingers close on the handle and the arm is held clear of the body. After changing these run ?test=held. */
const PROPS = { basket: () => hamper(0xb08a48), bucket: () => bucket(), case: () => suitcase(0x5a4030) };
const GRIP = { basket: { handleY: 0.52, scale: 0.5, lift: 0.46 }, bucket: { handleY: 0.49, scale: 0.9, lift: 0.34 }, case: { handleY: 0.5, scale: 0.7, lift: 0.4, straighten: 0.8, yaw: PI / 2 } };
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene), offHats = (HATS[s.base] || []).filter((h) => h !== s.hat); if (/^man_(work|shirt|elder|suit)$/.test(s.base) && !(s.hide || []).includes('Waistcoat')) offHats.push('Belt', 'Buckle');
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hide && s.hide.includes(nm)) || offHats.some((h) => nm === h || nm === h + 'Band')) { o.visible = false; return; }
    o.material = mat.clone(); const t = nm === 'Hair' ? undefined : s.tint && s.tint[nm];
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; } else if (nm === 'Skin' || nm === 'Hair') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT);
    o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.05; b.renderOrder = 1; m.add(b);
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; m.userData.held = []; ctl.mx.update(0);
  for (const [bone, prop] of s.props || []) { const o = PROPS[prop](), Gp = GRIP[prop]; grip(m, bone.replace('Hand', ''), o, { handleY: o.userData.handleY || Gp.handleY, scale: Gp.scale, yaw: Gp.yaw || 0, lift: Math.max(0.4, Gp.lift || 0), straighten: Gp.straighten ?? 0.8 }); m.userData.held.push({ obj: o, bone, label: prop }); }
  spreadArms(m, /^(woman|girl|iris)/.test(s.base) ? 0.15 : s.base === 'man_suit' ? 0.11 : 0.05);   /* arms hang clear of skirts and jackets */
  return m;
}
/* a blanket round the shoulders: a soft cape that stands a little off the body (chapter 4) */
function addBlanket(n, color = 0xb8a890) { if (n.blanket) return; const k = 1 / (n.scale || 1), h = n.h * k, c = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * (n.kid ? 0.8 : 1), 0.33 * (n.kid ? 0.8 : 1), h * 0.4, 14, 1, true), new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide })); c.position.y = h * 0.62; n.m.add(c); n.blanket = c; }

/* ---------- places (geometry, built once) and scenes (who is there in each chapter) ---------- */
const BUILD = { slipe: buildSlipe, ward: buildWard, park80: buildPark80, golden: buildGolden, monument: buildMonument };
const PL = {}; let cur = null, SC = null, modelsReady = false;
function buildPlace(id) {
  if (PL[id]) return PL[id]; const group = new THREE.Group(); group.visible = false; scene.add(group); const P = { id, group, ...BUILD[id](group) };
  if (__DEV__) { const off = []; group.traverse((o) => { if (o !== group && !o.visible) o.traverse((c) => { if (c.isMesh && c.visible) { c.visible = false; off.push(c); } }); }); P.snap = snapMeshes(group); for (const c of off) c.visible = true; }   /* the audit looks at what is there by day: things kept hidden for one chapter (the rope, the ruin) are left out */
  batchStatic(group);
  group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.transparent && !(o.material.alphaTest > 0) && o.material.type !== 'MeshBasicMaterial') o.castShadow = o.receiveShadow = true; });
  PL[id] = P; return P;
}
const person = (id, who, look, at, o = {}) => ({ id, who, label: 'Talk to ' + who, ...LOOKS[look], x: at[0], z: at[1], ry: at[2] || 0, ground: at[3] || 0, ...o });
const extra = (look, at, o = {}) => ({ ...LOOKS[look], x: at[0], z: at[1], ry: at[2] || 0, ground: at[3] || 0, ...o });
const ver = (P, lx) => { const s = P.spots.ver(lx); return [s.x, s.z, s.ry, s.ground]; };
/* one scene per chapter: the place, the light, the people you talk to, the background people, and extra walls for that chapter only */
const SCENES = [
  { place: 'slipe', env: ENV.day, start: { x: -27.6, z: 4.3, yaw: -PI / 2 }, people: (P) => [person('gran1', 'Gran', 'gran', [-25.2, 4.7, -PI / 2], { props: [['RightHand', 'basket']] }), person('gateman', 'the gateman', 'gateman', [1.2, -10.6, 0.2]), person('iris1', 'Miss Iris', 'iris', [P.spots.iris.x, P.spots.iris.z, P.spots.iris.ry, P.spots.iris.ground])],
    extras: (P) => [...crowd(6, 3, [[-40, 4.3, -30, 5.4], [-18, 4.3, 14, 5.4], [20, 4.3, 44, 5.4]], { carry: 0.5 }), ...walkers(10, 13, [[-46, 4.55, 46, 4.55], [46, 5.3, -46, 5.3], [-46, -4.6, 46, -4.6], [46, -5.3, -46, -5.3]]), ...walkers(5, 17, [[-1.5, -14, -1.5, -62], [1.5, -62, 1.5, -14]], { slow: true }), lady(0, [-5.2, -30, PI / 2]), lady(1, [-5.4, -31.3, 0.6]), extra('nurse', [-5.0, -47, PI / 2]), lady(2, ver(P, 9)), lady(3, ver(P, 12.5)), lady(4, ver(P, -13))] },
  { place: 'ward', env: ENV.indoor, people: () => [person('hyacinth2', 'Miss Hyacinth', 'hyacinth', [-5.4, -1.2, 0.5]), person('maude2', 'Miss Maude', 'maude', [1.6, 1.2, PI - 0.5]), person('dora2', 'Miss Dora', 'dora', [7.8, -1.2, 0.4]), person('nurse2', 'Nurse Bell', 'nurse', [-10.2, -1.0, 0.8])],
    extras: () => [extra('iris', [11.6, 1.25, PI + 0.6]), lady(2, [-1.5, -1.3, 0.2]), lady(5, [5.2, 1.3, PI]), lady(6, [11.5, -1.3, -0.4]), lady(7, [-7.6, 1.3, PI + 0.4])] },
  { place: 'slipe', env: ENV.dusk, start: { x: 0, z: -22, yaw: -0.5 }, people: (P) => [person('nurse3', 'Nurse Bell', 'nurse', [3.7, -35.6, -PI / 2]), person('iris3', 'Miss Iris', 'iris', ver(P, -4.5)), person('hyacinth3', 'Miss Hyacinth', 'hyacinth', ver(P, -7.4)), person('maude3', 'Miss Maude', 'maude', ver(P, 4)), person('dora3', 'Miss Dora', 'dora', ver(P, 7.4))],
    extras: (P) => [extra('gran', [1.6, -24.5, 2.6], { props: [['RightHand', 'basket']] }), ...walkers(4, 23, [[-1.6, -28, -1.6, -62], [1.4, -62, 1.4, -40]], { slow: true }), lady(3, ver(P, -14)), lady(4, ver(P, 11)), lady(5, ver(P, 14.5))] },
  { place: 'slipe', env: ENV.night, start: { x: -9, z: -2.5, yaw: -1.1 }, walls: [[-3.2, -9.9, 3.2, -8.9]],
    people: () => [person('gran4', 'Gran', 'granNight', [-7.4, -3.4, 2.2]), person('fireman', 'the firefighter', 'fireman', [1.9, -8.1, 0.2]), person('nurse4', 'Nurse Bell', 'nurse', [8.2, -4.9, -0.4], { hidden: true }), person('hyacinth4', 'Miss Hyacinth', 'hyacinth', [10.2, -5.3, 0], { hidden: true }), person('maude4', 'Miss Maude', 'maude', [11.6, -5.0, -0.3], { hidden: true }),
      ...['kidA', 'kidB', 'kidC'].map((k, i) => ({ id: 'kid' + i, who: 'a child', label: 'A child', kid: true, ...LOOKS[k], x: -13.5 + i * 0.4, z: -44 - i, ry: 0, hidden: true, anim: 'Idle' }))],
    extras: () => [extra('police', [-3.6, -4.4, PI]), extra('fireman', [-1.9, -19.5, PI], { props: [['RightHand', 'bucket']] }), extra('fireman', [1.5, -21.5, PI - 0.5]), extra('fireman', [3.0, -26, PI - 0.9]), ...crowd(18, 9, [[-22, -5.3, -11, 3], [13.5, -5.3, 24, 3], [-10, 0.5, 9, 3.2]], { mood: 'night', face: [6, -30] })] },
  { place: 'park80', env: ENV.hazy, people: () => [person('gran5', 'Gran', 'granBlack', [1.4, 14.6, 2.6]), person('mourner1', 'a retired nurse', 'mournerNurse', [-7, 5.2, 0.2]), person('mourner2', 'a neighbour', 'neighbour', [0.6, 6.4, -0.2]), person('mourner3', 'a man in a dark suit', 'nephew', [7.4, 5.0, -0.3]), person('nurse5', 'Nurse Bell', 'nurse', [10.6, 9.4, -0.8])],
    extras: (P) => [...[-2.4, -0.8, 0.8, 2.4].map((x, i) => extra(i === 3 ? 'neighbour' : 'official', [x, -8.6, 0])), ...crowd(40, 21, P.crowd, { mood: 'black', face: [0, -2] })] },
  { place: 'golden', env: ENV.day, people: () => [person('hyacinth6', 'Miss Hyacinth', 'hyacinth', [-4.4, -4.6, 0.4]), person('maude6', 'Miss Maude', 'maude', [7.2, 4.2, -0.9])],
    extras: () => [extra('nurse', [3.5, -8.4, 0.3]), lady(4, [-11.6, 3.5, PI / 2]), lady(6, [11.6, -0.5, -PI / 2]), lady(1, [-7.4, 9.2, 2.4]), extra('gateman', [-8.6, 9.6, -2.2])] },
  { place: 'monument', env: ENV.day, adult: true, people: () => [person('kayla', 'Kayla', 'kayla', [-2.9, 15.2, 2.4])],
    extras: (P) => [...P.spots.guard.flatMap(([x, z0, z1]) => { const o = []; for (let z = z0; z <= z1; z += 1.6) o.push(extra('guard', [x, z, x < 0 ? PI / 2 : -PI / 2])); return o; }), ...crowd(14, 31, [[-12, 3, -5, 12], [8, 7, 13, 14]], { face: [0, 0] })] },
];
/* people who walk up and down a pavement: each gets two ends to stroll between. lanes: [[x0, x1, z], ...] */
function walkers(n, seed, lanes, { slow = false } = {}) { return crowd(n, seed, lanes.map(([x0, z0, x1, z1]) => [Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1) + 0.01, Math.max(z0, z1) + 0.01])).map((e, i) => { const [x0, z0, x1, z1] = lanes[i % lanes.length], r = rng(seed + i), L = Math.hypot(x1 - x0, z1 - z0), ux = (x1 - x0) / L, uz = (z1 - z0) / L, a = r() * 0.3 * L, b = L - r() * 0.3 * L, t = a + r() * (b - a);
  e.props = undefined; e.x = x0 + ux * t; e.z = z0 + uz * t; e.path = [[x0 + ux * a, z0 + uz * a], [x0 + ux * b, z0 + uz * b]]; e.walker = true; e.speed = slow || e.base === 'woman_elder' || e.base === 'man_elder' ? 0.6 : 1.1; e.anim = 'Idle'; e.wait = r() * 3; e.leg = r() < 0.5 ? 0 : 1; return e; }); }
/* nobody stands inside anybody or inside a wall: background people too close to someone, a wall or the start are moved to a free spot nearby, or dropped */
function spreadOut(specs, P, S) {
  const r = rng(77), W = P.walls.concat(S.walls || []), st = S.start || P.start, taken = specs.people.filter((p) => !p.hidden).map((p) => [p.x, p.z]), keep = [], b = P.bounds;
  const free = (x, z) => !W.some((w) => x > w[0] - 0.35 && x < w[2] + 0.35 && z > w[1] - 0.35 && z < w[3] + 0.35) && taken.every((t) => Math.hypot(t[0] - x, t[1] - z) >= 0.85) && Math.hypot(x - st.x, z - st.z) > 1.8;
  for (const e of specs.extras) { if (e.ground > 0 || e.walker) { keep.push(e); taken.push([e.x, e.z]); continue; } let ok = free(e.x, e.z), tries = 0; const x0 = e.x, z0 = e.z;
    while (!ok && tries++ < 40) { e.x = Math.max(b.x0, Math.min(b.x1, x0 + (r() - 0.5) * 2 * (1 + tries * 0.1))); e.z = z0 + (r() - 0.5) * 2 * (1 + tries * 0.1); ok = free(e.x, e.z); }
    if (ok) { keep.push(e); taken.push([e.x, e.z]); } }
  specs.extras = keep;
}
function clearScene() { if (!SC) return; for (const n of SC.npcs) { if (n.mark) scene.remove(n.mark); if (n.m.parent) n.m.parent.remove(n.m); } SC = null; }
async function loadScene(i) {   /* build the place and load the bodies this chapter needs */
  const S = SCENES[i], P = buildPlace(S.place), specs = { people: S.people(P), extras: S.extras ? S.extras(P) : [] }; spreadOut(specs, P, S);
  for (const e of specs.extras) e.bodyId = /^(woman_|man_|girl$|boy$)/.test(e.base) && !e.props ? e.base + '_lo' : e.base; for (const e of specs.people) e.bodyId = e.base;   /* background figures get a light copy */
  await Promise.all([...new Set([...specs.people, ...specs.extras].map((s) => s.bodyId))].map(loadBase)); return specs;
}
let EYE_NOW = EYE;
function enterScene(i, specs) {
  clearScene(); for (const k in PL) PL[k].group.visible = false; const S = SCENES[i], P = PL[S.place]; cur = S.place; P.group.visible = true; setEnv(S.env);
  const st = S.start || P.start, mk = (s, talk) => { if (!s.ground) s.ground = P.groundAt(s.x, s.z); const n = Object.assign(s, { talked: false, heard: 0, extra: !talk }); n.m = makeBody(s); n.m.visible = !s.hidden; P.group.add(n.m); n.ctl = n.m.userData.anim; n.m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(n.m); n.h = Math.max(0.9, Math.min(2.1, bb.max.y - (s.ground || 0))); return n; };
  SC = { i, P, walls: S.walls || null, people: specs.people.map((s) => mk(s, true)), extras: specs.extras.map((s) => mk(s, false)), actions: [] }; SC.npcs = SC.people.concat(SC.extras); SC.people.filter((n) => !n.kid).forEach(addMark);
  SC.actions = ACTIONS[i] ? ACTIONS[i](P) : []; state.x = st.x; state.z = st.z; state.yaw = st.yaw || 0; state.pitch = 0; EYE_NOW = S.adult ? EYE_ADULT : EYE;
}
const byId = (id) => (SC ? SC.people.find((n) => n.id === id) : null);

/* ---------- a glowing speech mark over each person, and a bubble on the nearest ---------- */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#f6c45c'; x.strokeStyle = 'rgba(70,45,10,0.85)'; x.lineWidth = 3; x.beginPath(); x.arc(64, 64, 15, 0, PI * 2); x.fill(); x.stroke(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(59, 59, 5, 0, PI * 2); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
const headTop = (n) => (n.ground || 0) + n.h - 0.03;
function bubbleTick(now) {
  const show = state.started && !busy && !frozen && !DIR.on && $('card').hidden;
  for (const n of SC ? SC.people : []) { const m = n.mark; if (!m) continue; if (!show || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, headTop(n) + 0.17 + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n && d < 40; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, headTop(near) + 0.08, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== near.who) { TB.el.dataset.label = near.who; TB.el.innerHTML = TALK_SVG + '<span class="who"></span>'; TB.el.querySelector('.who').textContent = near.who; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- interface: toast, the journal, cards, fades, narration, the camera director ---------- */
let toastTimer = 0, EP = 0;   /* EP: starting a chapter bumps it, so timed scenes from an earlier chapter stop themselves */
function toast(msg, ms = 2800) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms); }
const unlocked = [], story = {}, ctr = {};   /* story: what you chose. ctr: counters for the stage you are in */
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function refreshJourney() { const p = JOURNAL.find((q) => q.id === 'journey'); p.simple = ['You finished the story.', ...Object.keys(CHOICE_NAMES).map((k) => story[k] && CHOICE_NAMES[k][story[k]]).filter(Boolean)]; }
function renderJournal(sel) {
  refreshJourney(); const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || unlocked[unlocked.length - 1];
  JOURNAL.filter((p) => unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((q) => q.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h); for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'), s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s); for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal(sel) { if (!$('journal').hidden) return; busy = true; keys.clear(); renderJournal(typeof sel === 'string' ? sel : undefined); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; busy = panelsOpen(); }
$('jbtn').onclick = () => openJournal(); $('jclose').onclick = closeJournal;
const MENU = { ok: false, url: '../../../menu/' };
{ const links = ['allgames', 'jhome'].map((id) => $(id)).filter(Boolean); for (const a of links) a.hidden = true;
  fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }
function toMenu() { saveGame(); location.href = MENU.url; }
const CARD = { dismiss: null };
function card(title, paras, btns, { col = false, dismiss } = {}) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); bb.classList.toggle('col', col); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; if (x.ok) el.dataset.ok = '1'; bb.appendChild(el); });
  CARD.dismiss = dismiss === undefined ? null : dismiss; $('card').hidden = false; busy = true; keys.clear(); $('talk').hidden = true; const f = bb.querySelector('button'); if (f) f.focus();
}
function hideCard() { $('card').hidden = true; CARD.dismiss = null; busy = panelsOpen(); }
function chapterFade(title, sub, fn) {   /* fade to a black title card, change the scene while it is dark, fade back */
  if (QUICK) { fn(); return; } if (fading) return; fading = true; const f = $('fade'); $('fadeT').textContent = title; $('fadeS').textContent = sub; $('card').hidden = true; $('dialogue').hidden = true;
  f.hidden = false; requestAnimationFrame(() => f.classList.add('on')); setTimeout(() => { fn(); f.classList.add('txt'); }, 800);
  setTimeout(() => f.classList.remove('txt'), 3200); setTimeout(() => f.classList.remove('on'), 3700); setTimeout(() => { f.hidden = true; fading = false; }, 4600);
}
function fadeBlack(on, ms = 900) { const f = $('fade'); f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease'; if (on) { f.hidden = false; $('fadeT').textContent = ''; $('fadeS').textContent = ''; f.classList.remove('txt'); requestAnimationFrame(() => f.classList.add('on')); } else { f.classList.remove('on'); setTimeout(() => { f.hidden = true; f.style.transition = ''; }, QUICK ? 0 : ms + 50); } }
const bars = (on) => document.body.classList.toggle('cine', on);   /* black bars top and bottom, for the scripted moments */
let subTimer = 0;
function say(text, ms = 4200) { const el = $('sub'); el.textContent = text; el.classList.toggle('dim', !text); document.body.classList.toggle('subbing', !!text); clearTimeout(subTimer); subTimer = setTimeout(() => { el.classList.add('dim'); document.body.classList.remove('subbing'); }, Math.max(500, ms * TS)); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms * TS));
const TICKS = [];
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.05, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); fn(k); if (k >= 1) { res(true); return true; } return false; }); }); }
async function run(steps) { const ep = EP; for (const [ms, fn] of steps) { await wait(ms); if (ep !== EP) return false; fn(); } return true; }
/* the camera director: a slow move from one view to another, for the scripted moments. a, b: camera positions; la, lb: what it looks at. */
const DIR = { on: false, t: 0, dur: 1, a: null, b: null, la: null, lb: null, resolve: null }, _v = new THREE.Vector3();
function cut(a, b, la, lb, dur) { return new Promise((res) => { Object.assign(DIR, { on: true, t: 0, dur: Math.max(0.05, dur * TS), a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), la: new THREE.Vector3(...la), lb: new THREE.Vector3(...lb), resolve: res }); }); }
function endCut() { DIR.on = false; bars(false); }

/* ---------- goal, hint, sound button ---------- */
let stage = 0, best = 0, goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer); goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500); if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
function refreshGoal(quiet) { const g = GOALS[stage]; goalText = g ? g(ctr) : ''; if (quiet) { $('goal').textContent = goalText; return; } showGoal(true); }
$('goal').onclick = () => showGoal(true);
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'eventide-save-v1'; let hasSave = false, erasing = false;
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, unlocked, stage, best, story })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story); stage = Number.isInteger(d.stage) && d.stage in GOALS ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
const wantsTalk = (n) => !n.extra && !n.kid && !n.talked && n.m.visible && (TALK_TARGETS[stage] || []).includes(n.id);
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  if (busy || frozen || n.kid) return; talkFull = wantsTalk(n);
  if (talkFull) lines = [...TALK[n.id](story, stage)]; else { const later = (LATER[n.id] || (() => ['...']))(story, stage); lines = [{ who: n.who[0].toUpperCase() + n.who.slice(1), text: later[n.heard++ % later.length] }]; }
  convoForced = false; openConvo(lines, null, n);
}
function convo(ls, onEnd, who) { if (busy && !$('card').hidden) hideCard(); talkFull = false; convoForced = true; openConvo([...ls], onEnd, who || null); }
function openConvo(ls, onEnd, n) { document.body.classList.add('talking'); busy = true; talkWith = n || null; lines = ls; convoEnd = onEnd; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true; showLine(); }
function showLine() {
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock);
  $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(c); box.appendChild(b); }); box.firstChild.focus(); } else $('next').focus();
  const ac = talkWith && talkWith.ctl; if (ac && !(talkWith.m.userData.held || []).length) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(c) { uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || [])); step++; if (step >= lines.length) endTalk(true); else showLine(); }
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  document.body.classList.remove('talking'); const n = talkWith, cb = convoEnd; talkWith = null; convoEnd = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.ctl) n.ctl.play(null);
  const forced = convoForced; convoForced = false;
  if (finished && n && talkFull) { n.talked = true; saveGame(); onTalked(); } if (cb && (finished || forced)) cb();
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) activate(near); };
function onTalked() { const t = TALK_TARGETS[stage]; if (t && t.every((id) => { const n = byId(id); return n && n.talked; })) setStage(NEXT_AFTER_TALK[stage]); }

/* ---------- chapters, stages and the story machine ---------- */
const CH_FIRST = [10, 20, 30, 40, 50, 60, 70], DONE = [14, 23, 33, 46, 54, 63, 75];
const SAFE = { 42: 41, 43: 41 };   /* a saved game never resumes in the middle of a scripted scene */
const chapterOf = (s) => Math.max(0, Math.min(6, Math.floor(s / 10) - 1));
const ON = {};   /* ON[stage]: what happens when a stage begins */
function setStage(s) {
  stage = s; best = Math.max(best, s); for (const k of Object.keys(ctr)) delete ctr[k]; if (SC) for (const n of SC.people) n.talked = false; saveGame(); refreshGoal(); if (ON[s]) ON[s]();
  if (!QUICK && s in CHAPTER_END) setTimeout(() => nextCard(CHAPTER_END[s], s), 2600);
}
function nextCard(i, s, tries = 0) {
  if (stage !== s) return; if ((panelsOpen() || fading || frozen || DIR.on) && tries < 20) { setTimeout(() => nextCard(i, s, tries + 1), 800); return; }
  const nx = CHAPTERS[i + 1]; if (!nx) return; uiSound('goal'); card('Chapter ' + (i + 1) + ' is finished', ['Next is "' + nx.name + '" (' + nx.year + ').'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(i + 1); } }, { t: 'Stay here', go: hideCard }]);
}
function showPlace(text) { const el = $('place'); el.textContent = text || CHAPTERS[chapterOf(stage)].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(showPlace.t); showPlace.t = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetTransient() { EP++; frozen = false; endCut(); FX.shake = 0; $('sub').classList.add('dim'); document.body.classList.remove('subbing'); TICKS.length = 0; SIREN = 0; }
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i]; hideCard(); closeJournal(); closeChapters(); $('dialogue').hidden = true; busy = false; talkWith = null;
  if (!modelsReady || !PL[SCENES[i].place]) toast('Loading', 4000); const specs = await loadScene(i);
  const go = () => chapterFade(C.title, C.sub, () => startScene(i, st, specs));
  if (i === 3 && st === 40 && !QUICK) card('This chapter is sad', ['It tells about the night of the fire.', 'You watch from the road, far back. Nobody is shown hurt.', 'You can skip to the morning if you like.'], [{ t: 'Continue', go: () => { hideCard(); go(); } }, { t: 'Skip to the morning', go: () => { hideCard(); st = 45; go(); } }], { col: true });
  else go();
}
function startScene(i, st, specs) {
  enterScene(i, specs); state.started = true; const P = SC.P;
  if (P.id === 'slipe') { P.night.visible = i === 3; P.ruin.visible = false; P.bus2.visible = false; P.myers.group.visible = true; P.myers.group.scale.y = 1; P.fire.setLevel(0); P.lamps.forEach((l) => { l.visible = i === 2 || i === 3; }); }
  if (i === 1) { P.things.forEach((t, k) => { t.visible = true; t.position.set(-13.2 + k * 0.4, 0.81, 2.9); }); if (st >= 22) P.things.forEach((t, k) => placeThing(P, k)); }
  if (i === 3) nightSetup(P, st);
  if (i === 4) P.spray.visible = st >= 54 && story.part === 'flower';
  if (i === 6) P.laid.forEach((o) => { o.visible = st >= 73; });
  setStage(st); showPlace(); unlock('you', true);
}
function chaptersOpen(i) { return i === 0 || best >= DONE[i - 1]; }
let teacherMode = false; try { teacherMode = localStorage.getItem('eventide-teacher') === '1'; } catch (e) { /* ignore */ }
function renderChapters() {
  $('chteacher').setAttribute('aria-pressed', String(teacherMode)); $('chteacher').textContent = teacherMode ? 'Teacher unlock: on' : 'Teacher unlock'; $('chteachernote').hidden = !teacherMode;
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = teacherMode || chaptersOpen(i), dn = best >= DONE[i], li = document.createElement('li'), b = document.createElement('button'); b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !modelsReady ? 'Loading' : dn ? 'Done' : 'Play']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => { $('chapters').hidden = true; busy = false; if (!state.started) startGame(true); beginChapter(i); }; li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = panelsOpen(); if (state.started) canvas.focus(); }
$('chteacher').onclick = () => { teacherMode = !teacherMode; try { localStorage.setItem('eventide-teacher', teacherMode ? '1' : '0'); } catch (e) { /* ignore */ } renderChapters(); $('chteacher').focus(); };
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('dev').onclick = openCredits; $('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
function resetCard() { const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart "' + CHAPTERS[i].name + '"', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : [])], { col: true }); }
$('reset').onclick = () => { if (fading || frozen) return; closeJournal(); resetCard(); };

/* ---------- things to do. ACTIONS[chapter](P) makes that chapter's list. A thing shows as a button when you stand at it. ---------- */
function placeThing(P, k) { const [x, z] = P.beds[TIDY[k].where]; P.things[k].position.set(x, 0.64, z); }
function sortCards(k = 0) {   /* chapter 6: fact, opinion or rumour, one card at a time */
  if (k >= SORT.length) { hideCard(); unlock('facts'); setStage(62); return; } const c = SORT[k];
  card('Card ' + (k + 1) + ' of ' + SORT.length, [c.text, 'Is this a fact, an opinion or a rumour?'], SORT_KINDS.map((t, j) => ({ t, ok: j === c.kind, go: () => { if (j === c.kind) { uiSound('goal'); toast(c.why, 4200); sortCards(k + 1); } else { uiSound('tap'); toast('Not quite. Think again.'); } } })), { dismiss: hideCard });
}
function timeline(k = 0) {   /* chapter 7: which came next? Three choices at a time. */
  if (k >= TIMELINE.length) { hideCard(); setStage(72); return; }
  const opts = [k, k + 1, k + 2].filter((j) => j < TIMELINE.length), order = k % 2 ? opts.slice().reverse() : opts.length > 2 ? [opts[1], opts[0], opts[2]] : opts;
  card(k ? 'What came next?' : 'What came first?', k ? ['So far: ' + TIMELINE[k - 1].year + '. ' + TIMELINE[k - 1].text] : ['Tap the thing that happened first.'], order.map((j) => ({ t: TIMELINE[j].text, ok: j === k, go: () => { if (j === k) { uiSound('goal'); toast(TIMELINE[k].year, 2200); timeline(k + 1); } else { uiSound('tap'); toast('That came later. Try again.'); } } })), { col: true, dismiss: hideCard });
}
const ACTIONS = {
  0: (P) => [{ label: 'Read the letter to Miss Iris', x: P.spots.iris.x - 0.9, z: P.spots.iris.z, r: 2.4, on: () => stage === 13, go: () => card('A letter for Miss Iris', LETTER, [{ t: 'Finish reading', go: () => { hideCard(); convo([{ who: 'Miss Iris', text: 'Pauline! I made that dress in 1961.' }, { who: 'Miss Iris', text: 'Thank you, child. You read it beautifully.' }], () => setStage(14), byId('iris1')); } }]) }],
  1: (P) => [
    { label: 'Pick up the next thing', x: P.spots.table[0], z: P.spots.table[1], r: 1.9, on: () => stage === 21 && !ctr.holding, go: () => { const k = ctr.tidy || 0; ctr.holding = true; P.things[k].visible = false; uiSound('tap'); toast(TIDY[k].text, 4000); } },
    ...TIDY.map((t, k) => ({ label: t.label, x: P.spots[t.where][0], z: P.spots[t.where][1], r: 1.9, on: () => stage === 21 && ctr.holding && (ctr.tidy || 0) === k, go: () => { ctr.holding = false; ctr.tidy = k + 1; P.things[k].visible = true; placeThing(P, k); uiSound('goal'); unlock(t.page); refreshGoal(true); if (ctr.tidy >= 4) setStage(22); else toast('Put back: ' + ctr.tidy + ' of 4'); } }))],
  2: (P) => [{ label: 'Listen to the radio', x: P.spots.radio[0], z: P.spots.radio[1], r: 2.0, on: () => stage === 30, go: () => convo(RADIO.map((text) => ({ who: 'The radio', text })).concat([{ who: 'Miss Iris', text: 'Trouble, trouble. Turn it down, child.' }]), () => setStage(31)) }],
  3: (P) => [
    { label: 'Hold the gate open', x: -1.9, z: -7.7, r: 2.3, on: () => stage === 42, go: () => holdGate(P) },
    ...[0, 1, 2].map((i) => ({ label: 'Wrap the child in a blanket', get x() { return byId('kid' + i).x; }, get z() { return byId('kid' + i).z + 0.75; }, r: 1.5, on: () => stage === 43 && !byId('kid' + i).blanket, go: () => { addBlanket(byId('kid' + i), [0xb8a890, 0x8a9ab0, 0xb09a9a][i]); ctr.blanket = (ctr.blanket || 0) + 1; uiSound('goal'); refreshGoal(true); if (ctr.blanket >= 3) roofFalls(P); } }))],
  4: (P) => [{ label: 'Stand at the rail', x: P.spots.rail[0], z: P.spots.rail[1], r: 2.6, on: () => stage === 53, go: () => card('At the grave', ['The grave is closed now, with concrete and steel.', 'How will you say goodbye?'], [
    { t: 'Lay a flower', go: () => { story.part = 'flower'; P.spray.visible = true; hideCard(); say('You lay a flower by the rail, for Miss Iris and Miss Dora.'); setStage(54); } },
    { t: 'Sing with the crowd', go: () => { story.part = 'sing'; hideCard(); say('The crowd sings a hymn. You sing too, as Miss Dora taught you.'); setStage(54); } },
    { t: 'Stand quietly', go: () => { story.part = 'quiet'; hideCard(); say('You stand quietly and hold Gran\'s hand.'); setStage(54); } }], { col: true, dismiss: hideCard }) }],
  5: (P) => [{ label: 'Sort the news cards', x: P.spots.table[0], z: P.spots.table[1], r: 2.0, on: () => stage === 61, go: () => sortCards(0) }],
  6: (P) => [
    { label: 'Look at the story board', x: P.spots.board[0], z: P.spots.board[1], r: 2.2, on: () => stage === 71, go: () => timeline(0) },
    { label: 'Lay a flower', x: P.spots.plaque[0], z: P.spots.plaque[1], r: 2.4, on: () => stage === 72, go: () => { const k = ctr.flower || 0; P.laid[k].visible = true; ctr.flower = k + 1; uiSound('goal'); say(k ? 'A flower for Miss Dora, who sang.' : 'A flower for Miss Iris, the dressmaker.'); refreshGoal(true); if (ctr.flower >= 2) setStage(73); } },
    { label: 'Read the words', x: P.spots.plaque[0], z: P.spots.plaque[1], r: 2.4, on: () => stage === 73, go: () => card('The plaque says', [PLAQUE.slice(0, 4).join(' '), PLAQUE.slice(4).join(' ')], [{ t: 'Close', go: () => { hideCard(); setStage(74); } }]) }],
};
ON[75] = () => { refreshJourney(); if (!QUICK) setTimeout(() => { if (stage === 75) { cue('end'); card('The end', ['For years the Eventide fire was a line at the bottom of the page.', 'You have read past it. The women of Eventide were people, each with a name and a life.', 'Your journal has a page about your journey.'], [{ t: 'Open my journal', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Stay here', go: hideCard }], { col: true }); } }, 1800); };

/* ---------- chapter 4: the night. Seen from behind the rope, with slow camera moves for the big moments. Nothing you do changes what happened. ---------- */
let SIREN = 0;
function nightSetup(P, st) {
  const after = st >= 44, dawn = st >= 45; P.fire.setLevel(dawn ? 0.08 : after ? 0.4 : 1); P.myers.group.visible = !after; P.myers.group.scale.y = 1; P.ruin.visible = after; SIREN = dawn ? 0 : after ? 0.3 : 1;
  for (const id of ['nurse4', 'hyacinth4', 'maude4']) { const n = byId(id); n.m.visible = after && !dawn; if (after && id !== 'nurse4') addBlanket(n, 0x9aa0a8); }
  [0, 1, 2].forEach((i) => { const n = byId('kid' + i); if (st >= 43) { kidTo(n, -5 - i * 1.25, -5.2); n.m.visible = !dawn; if (after) addBlanket(n); } });
  P.lamps.forEach((l) => { l.visible = !dawn; });
  if (dawn) { setEnv(ENV.dawn); busPass(P); }
  else if (st === 40) (async () => { const ep = EP; frozen = true; bars(true); say('Sirens wake you. The sky over the Home is orange.', 6500);   /* an opening shot: from the dark road, up to the burning ward behind the wall */
    await cut([-16, 1.5, 3.2], [-9, 1.4, -2.5], [-6, 3, -8], [6, 7, -34], 7); if (ep !== EP) return; endCut(); frozen = false; })();
}
function kidTo(n, x, z) { n.x = x; n.z = z; n.m.position.set(x, 0, z); n.m.rotation.y = 0; }
async function holdGate(P) {
  if (frozen) return; frozen = true; const ep = EP, kids = [0, 1, 2].map((i) => byId('kid' + i)), path = [[-3, -44], [0, -34], [0, -12], [-1.2, -7.4]];
  bars(true); say('You hold the gate. Firefighters lead the children out, one by one.', 7000);
  cut([-2.3, 1.3, -7.2], [-3.4, 1.35, -5.4], [0, 1.2, -20], [-0.5, 1.0, -12], 9);   /* from the gate: the children come down the avenue, the fire behind them */
  await Promise.all(kids.map((n, i) => (async () => { await wait(i * 1100); if (ep !== EP) return; n.m.visible = true; n.walking = true; walkOn(n, 1.7); const end = [-5 - i * 1.25, -5.2], pts = path.concat([end]);
    for (let s = 0; s < pts.length - 1; s++) { const a = pts[s], b = pts[s + 1]; n.m.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]); await tween(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.7,   /* a quick walk, holding hands, not a run */ (k) => { n.x = a[0] + (b[0] - a[0]) * k; n.z = a[1] + (b[1] - a[1]) * k; n.m.position.set(n.x, 0, n.z); }); if (ep !== EP) return; }
    n.ctl.play(null); n.walking = false; kidTo(n, end[0], end[1]); })()));
  if (ep !== EP) return; endCut(); state.x = -3.4; state.z = -5.6; state.yaw = 1.2; state.pitch = 0; frozen = false; setStage(43);
}
async function roofFalls(P) {
  frozen = true; const ep = EP; bars(true); SIREN = 0.3; say('The old ward cannot stand. The roof falls in.', 6000);
  cut([-1.0, 1.4, -8.6], [-1.6, 1.5, -8.2], [8, 6, -34], [10, 3, -36], 8);   /* from the rope: one long look up the avenue */
  await wait(1500); if (ep !== EP) return; FX.shake = 0.5;
  await tween(3.6, (k) => { P.myers.group.scale.y = 1 - 0.9 * ease(k); P.fire.setLevel(1 - 0.6 * k); P.fire.burst(k); FX.shake = 0.5 * (1 - k); }); if (ep !== EP) return;
  P.myers.group.visible = false; P.ruin.visible = true; FX.shake = 0; say('Sparks fly up. The crowd goes quiet.', 5000); await wait(3600); if (ep !== EP) return;
  for (const id of ['nurse4', 'hyacinth4', 'maude4']) { const n = byId(id); n.m.visible = true; if (id !== 'nurse4') addBlanket(n, 0x9aa0a8); }
  await cut([4, 1.4, -2.2], [5.5, 1.35, -3.0], [10, 1.1, -5.2], [10.4, 1.1, -5.2], 4.5); if (ep !== EP) return;   /* then down to the road: two of your friends, safe */
  endCut(); state.x = 4.5; state.z = -2.6; state.yaw = -1.15; state.pitch = 0; say('Some of the ladies got out. They wait by the road in blankets.', 5200); frozen = false; setStage(44);
}
ON[45] = () => { const P = SC.P; if (envNow === ENV.dawn) return; (async () => { const ep = EP; frozen = true; fadeBlack(true, 900); await wait(1300); if (ep !== EP) return; nightSetup(P, 45); state.x = -9; state.z = -2.5; state.yaw = -1.1; fadeBlack(false, 1400); bars(true); say('Morning. Smoke hangs over Slipe Pen Road.', 6000);
  await cut([-14, 1.6, 2.5], [-9, 1.4, -2.5], [20, 2, -1], [4, 3, -30], 7); if (ep !== EP) return; endCut(); frozen = false; })(); };   /* the bus goes by, as it did that morning (Gleaner, 2020) */
function busPass(P) { P.bus2.visible = true; P.bus2.position.x = -70; tween(18, (k) => { P.bus2.position.x = -70 + 140 * k; }).then((ok) => { if (ok) P.bus2.visible = false; }); }
ON[54] = () => { if (QUICK || !SC || SC.i !== 4) return; (async () => { const ep = EP; frozen = true; bars(true); await cut([state.x, EYE, state.z], [0, 4.5, 9], [0, 0.6, -2], [0, 0.6, -2], 6); if (ep !== EP) return; await wait(1200); if (ep !== EP) return; endCut(); frozen = false; })(); };   /* a slow rise over the grave and the crowd */

/* ---------- the helper arrow: stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
function nudgeTarget() {
  if (!SC) return null; const a = SC.actions.find((x) => x.on()); let t = a ? [a.x, a.z] : null;
  if (!t) { let bd = 1e9; for (const n of SC.people) if (wantsTalk(n)) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; t = [n.x, n.z]; } } }
  if (t && cur === 'slipe' && SC.i !== 3) { if (state.z > -6.4 && t[1] < -7.6) return [0, -7.4];   /* from the road, the way in is through the gate */
    if (t[0] > 5.9 && SC.P.groundAt(state.x, state.z) < 0.3) return [4.2, -38]; }   /* and the way onto the veranda is up the steps */
  return t;
}
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return; const quiet = state.started && !busy && !frozen && !DIR.on && $('dialogue').hidden && $('card').hidden && $('place').style.opacity !== '1' && !document.body.classList.contains('subbing') && goalText && !fading;
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz) > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = Math.max(NUDGE.since, now - 30000); NUDGE.still = now; }
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && (now - NUDGE.still > 15000 || now - NUDGE.since > 50000)) { NUDGE.on = true; showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); }
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 1.6) { NUDGE.on = false; NUDGE.since = NUDGE.still = now; }
  if (!NUDGE.on || !tgt) { el.hidden = true; return; } el.hidden = false;
  const W = innerWidth, H = innerHeight, dx = tgt[0] - state.x, dz = tgt[1] - state.z, rel = Math.atan2(-dx, -dz) - state.yaw, a = Math.atan2(Math.sin(rel), Math.cos(rel));
  _nv.set(tgt[0], 2.0, tgt[1]).project(camera); const lab = el.querySelector('span');
  if (Math.abs(a) < 0.55 && _nv.z < 1) { el.style.left = Math.max(60, Math.min(W - 60, (_nv.x + 1) / 2 * W)) + 'px'; el.style.top = Math.max(110, Math.min(H * 0.62, (1 - _nv.y) / 2 * H)) + 'px'; el.className = 'down'; const sy = (1 - _nv.y) / 2 * H; lab.textContent = sy > H * 0.75 ? 'Look down' : sy < 90 ? 'Look up' : 'Here!'; }
  else { const left = a > 0; el.style.left = (left ? 58 : W - 58) + 'px'; el.style.top = (H * 0.45) + 'px'; el.className = left ? 'left' : 'right'; lab.textContent = 'This way'; }
}

/* ---------- sound: each chapter has its own quiet mix. All sound is made in code (engine/audio.js). No cries are ever played. ---------- */
let auNext = 0, onceAt = 6, sirenAt = 0;
const SOUNDSCAPE = [{ wind: 0.05, crowd: 0.05, once: chirp }, { room: 0.1, crowd: 0.03 }, { wind: 0.05, crowd: 0.02, once: chirp }, { wind: 0.06, crowd: 0.07 }, { wind: 0.05, crowd: 0.1 }, { wind: 0.05, once: chirp }, { wind: 0.06, crowd: 0.04, once: chirp }];
const FOOT = { slipe: 'stone', ward: 'wood', park80: 'grass', golden: 'grass', monument: 'stone' };
function audioTick(t) {
  if (!AU.ctx || t < auNext || !SC) return; auNext = t + 0.1; const S = SOUNDSCAPE[SC.i] || {};
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], (S[k] || 0) * 0.4);
  if (!AU.on || !state.started || AU.ctx.state !== 'running') return;
  const fl = SC.i === 3 && SC.P.fire ? SC.P.fire.level : 0;
  if (fl > 0.2 && Math.random() < fl * 0.5 && AU.crack) { try { crackle(); } catch (e) { /* no crackle sound yet */ } }
  if (SC.i === 3 && SIREN > 0 && t > sirenAt) { sirenAt = t + 2.4; tone(620, 880, 1.1, 'sine', 0.035 * SIREN, -0.4); tone(880, 620, 1.1, 'sine', 0.035 * SIREN, -0.4, 1.15); }   /* a far-off siren */
  if (t > onceAt) { onceAt = t + 6 + Math.random() * 6; if (S.once) S.once(); }
}

/* ---------- loading and starting ---------- */
applySave(loadGame());
{ let done = 0; const tick = () => { done++; $('bar').style.width = (done / 3 * 100) + '%'; };
  const P = buildPlace('slipe'); P.group.visible = true; cur = 'slipe'; setEnv(ENV.day); tick();   /* the gate and the avenue, as a backdrop for the title card */
  const first = hasSave && stage >= 10 ? chapterOf(stage) : 0;
  model('anims').then((an) => { loadClips(an); tick(); return loadScene(first); }).then(() => { modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; tick(); if (__DEV__) devViews(); }); }
function startGame(quiet) {
  if (GO) return; GO = true; audioInit(); $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk or use.'; showHint(); canvas.focus(); if (!quiet) cue('begin');
}
let GO = false;
$('start').onclick = () => { const res = hasSave && stage >= 10; startGame(); beginChapter(res ? chapterOf(stage) : 0, res ? (SAFE[stage] || stage) : 10); };

/* ---------- the frame loop ---------- */
let stepT = 0, frameN = 0;
function update(dt, now) {
  if (DIR.on) { DIR.t += dt; if (DIR.t >= DIR.dur && DIR.resolve) { const r = DIR.resolve; DIR.resolve = null; r(true); } }
  if (!SC) return; const P = SC.P;
  if (state.started && !busy && !frozen && !DIR.on) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
    if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1; const len = Math.hypot(f, r);
    if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.3) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
      [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt); stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; stepSound(P.groundAt(state.x, state.z) > 0.3 ? 'wood' : FOOT[cur]); } }
  }
  for (const n of SC.extras) if (n.walker && n.m.visible) walkTick(n, dt);
  const gran = SC.i === 0 && byId('gran1'); if (gran) followTick(gran, dt);
  for (const n of SC.people) if (!n.kid && n.m.visible && !n.walking) { const d = Math.hypot(state.x - n.x, state.z - n.z); if ((d < 3.4 && !DIR.on) || talkWith === n) { const want = Math.atan2(state.x - n.x, state.z - n.z); let e = want - n.m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); n.m.rotation.y += e * Math.min(1, dt * 4); } }
  near = null; if (state.started && !busy && !frozen && !DIR.on) { let b = 2.6; for (const n of SC.people) { if (n.kid || !n.m.visible) continue; const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < b) { b = d; near = n; } } for (const a of SC.actions) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }
  const tb = $('talk'); tb.hidden = !(near && near.go); if (near && near.go) tb.textContent = near.label;
  for (const n of SC.npcs) if (n.m.visible && n.ctl) { n.ctl.mx.update(dt); n.ctl.tick(dt); if (n.m.userData.grips) gripTick(n.m); }
  if ((frameN++ & 1) === 0) for (const n of SC.npcs) if (n.m.visible) groundFeet(n.m);
  if (P.fire && P.night.visible) P.fire.tick(dt, (now || 0) / 1000);
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](dt)) TICKS.splice(i, 1);
  if (now !== undefined) { audioTick(now / 1000); bubbleTick(now / 1000); stickUI(); nudgeTick(now); }
}
/* start the looping walk, with the legs paced to the walking speed so the feet do not slide (the clip covers about 1.3 m a second) */
function walkOn(n, sp) { const a = n.ctl.get('Walk'); if (!a) return; a.timeScale = Math.max(0.55, Math.min(1.8, (sp || n.speed || 1.1) / (1.3 * (n.scale || 1))));   /* a smaller body takes shorter steps */ if (n.ctl.cur !== a) n.ctl.play('Walk'); }
/* a stroller: walk to one end of the path, wait a moment, walk back */
function walkTick(n, dt) {
  if (n.wait > 0) { n.wait -= dt; if (n.wait <= 0) walkOn(n); return; } const [tx, tz] = n.path[n.leg], dx = tx - n.x, dz = tz - n.z, d = Math.hypot(dx, dz);
  const px = state.x - n.x, pz = state.z - n.z; if (Math.hypot(px, pz) < 1.2 && px * dx + pz * dz > 0) { if (n.ctl.cur === n.ctl.get('Walk')) n.ctl.play(null); return; }   /* the player is in the way: stop and let them pass */
  if (d < 0.2) { n.leg = 1 - n.leg; n.wait = 2 + Math.random() * 4; n.ctl.play(null); return; } const sp = (n.speed || 1.1) * (n.scale || 1); if (n.ctl.cur !== n.ctl.get('Walk')) walkOn(n, sp); n.x += dx / d * sp * dt; n.z += dz / d * sp * dt; n.m.position.set(n.x, n.ground, n.z); n.m.rotation.y = Math.atan2(dx, dz);
}
/* Gran walks with you once she has told you where you are going: she follows your footsteps, so she comes through the gate the way you did */
const TRAIL = [];
function followTick(n, dt) {
  if (stage < 11 || stage > 13 || DIR.on) { TRAIL.length = 0; return; } const lp = TRAIL[TRAIL.length - 1]; if (!lp || Math.hypot(lp[0] - state.x, lp[1] - state.z) > 0.4) TRAIL.push([state.x, state.z]);
  const dp = Math.hypot(state.x - n.x, state.z - n.z); n.walking = dp > 1.9;
  if (n.walking) { while (TRAIL.length > 1 && Math.hypot(TRAIL[0][0] - n.x, TRAIL[0][1] - n.z) < 0.3) TRAIL.shift(); const [tx, tz] = TRAIL[0] || [state.x, state.z], dx = tx - n.x, dz = tz - n.z, d = Math.hypot(dx, dz) || 1, sp = Math.min(2.8, 1.2 + (dp - 1.9) * 1.2);
    n.x += dx / d * Math.min(d, sp * dt); n.z += dz / d * Math.min(d, sp * dt); n.ground = PL[cur].groundAt(n.x, n.z); n.m.position.set(n.x, n.ground, n.z); n.m.rotation.y = Math.atan2(dx, dz); walkOn(n, sp); }
  else if (n.ctl.cur === n.ctl.get('Walk')) n.ctl.play(null);
}
let last = performance.now(), fixedCam = null;
function frame(t) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  if (fixedCam) { camera.position.set(...fixedCam.p); camera.lookAt(...fixedCam.t); }
  else if (DIR.on) { const k = ease(Math.min(1, DIR.t / DIR.dur)); camera.position.lerpVectors(DIR.a, DIR.b, k); _v.lerpVectors(DIR.la, DIR.lb, k); camera.lookAt(_v); }
  else if (!SC) { const s = t / 1000; camera.position.set(0.3 + Math.sin(s * 0.1) * 0.8, 1.7, 2.6); camera.rotation.set(0.16, Math.sin(s * 0.07) * 0.05, 0, 'YXZ'); }
  else { const P = PL[cur]; camera.position.set(state.x, (P ? P.groundAt(state.x, state.z) : 0) + EYE_NOW, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ'); }
  if (FX.shake > 0) { const k = FX.shake; camera.position.x += (Math.random() - 0.5) * k * 0.06; camera.position.y += (Math.random() - 0.5) * k * 0.06; camera.rotation.z += (Math.random() - 0.5) * k * 0.02; }
  sun.target.position.set(camera.position.x, 0, camera.position.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 110);
  sky.dome.position.copy(camera.position); sky.stars.position.copy(camera.position); sky.moon.position.set(camera.position.x - 190, camera.position.y + 230, camera.position.z - 380);
  if (!NORENDER) renderer.render(scene, camera);
}
const NORENDER = __DEV__ && /[?&]auto=/.test(location.search);   /* the scripted playthrough does not need pictures */
requestAnimationFrame(frame);

/* ---------- tests: dev builds only (node tools/build.mjs eventide --dev). See docs/TESTING.md and docs/games/eventide.md. ---------- */
function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), errs = [], out = (title, linesOut) => { const el = $('autolog'); if (el) el.textContent = linesOut.join('\n'); document.title = title; };
  addEventListener('error', (e) => { errs.push(e.message); document.title = 'ERROR ' + errs.join(' | '); });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.title = 'ERROR ' + errs.join(' | '); });
  const go = async (ch, st, x, z, yaw, pitch = 0) => { startGame(true); await beginChapter(ch, st); resetTransient(); if (x !== undefined) { state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch; } $('place').hidden = true; $('hint').hidden = true; $('toast').hidden = true; for (let i = 0; i < 8; i++) update(0.1, 1000 + i * 100); return SC.P; };
  const V = {   /* chapter (0 to 6), stage, x, z, yaw, pitch */
    road1: [0, 10, -27.6, 4.3, -PI / 2, 0.02], wall1: [0, 10, -13, 3.2, 0.35, 0.1], follow1: [0, 11, 0.3, -2.5, PI - 0.6, 0.1], road2: [0, 10, -20, 3.4, 0.9, 0.08], gate1: [0, 11, 0.3, -1.5, 0, 0.14], avenue1: [0, 12, 0, -12, 0, 0.06], ward1: [0, 12, -1.5, -32, -1.25, 0.12], iris1: [0, 13, 5.2, -41.2, -2.2, 0.05], men1: [0, 12, 1.5, -16, 1.75, 0.14], kids1: [0, 12, 1.5, -40, 1.9, 0.08],
    in1: [1, 20, -13.4, 0, -PI / 2, -0.05], in2: [1, 21, -3, 0.6, -PI / 2 - 0.5, -0.1], in3: [1, 21, -11.6, 1.2, PI + 0.5, -0.4],
    dusk1: [2, 30, 0, -22, -0.5, 0.06], dusk2: [2, 32, 4.2, -40, -PI / 2, 0.1],
    night1: [3, 41, -9, -2.5, -1.1, 0.12], night2: [3, 41, 0, -6.2, 0, 0.14], night3: [3, 43, -1.5, -2.6, 0.6, -0.05], night4: [3, 44, 4.5, -2.6, -1.15, 0.0], ruin1: [3, 44, -1.6, -8.2, -0.5, 0.06], dawn1: [3, 45, -9, -2.5, -1.1, 0.1],
    park1: [4, 50, 0, 17, 0, 0.04], park2: [4, 53, 0, 4.2, 0, -0.12], park3: [4, 51, -3, 9, 0.5, 0.0],
    gold1: [5, 60, 0, 14, 0, 0.03], gold2: [5, 61, 5, 5.2, 0.2, -0.3], gold3: [5, 60, -1, -1, 0.6, 0.0],
    mon1: [6, 70, 0, 19, 0, 0.05], mon2: [6, 73, 0, 3.1, 0, 0.22], mon3: [6, 71, 5.2, 8.6, 0, 0.05],
  };
  if (V[shot]) go(...V[shot]).then(() => { document.title = 'view ' + shot + ' ready'; });
  if (shot === 'talk1') go(0, 10, -27.6, 4.3, -PI / 2).then(() => startTalk(byId('gran1')));
  if (shot === 'journal1') go(0, 12).then(() => { for (const id of ['home', 'who', 'iris']) unlock(id, true); openJournal('home'); });
  if (shot === 'chap1') go(0, 12).then(() => { best = 33; openChapters(); });
  if (shot === 'sort1') go(5, 61, 5, 5.2, 0.2, -0.3).then(() => sortCards(0));
  if (shot === 'time1') go(6, 71, 5.2, 8.2, 0).then(() => timeline(2));
  if (shot === 'title') { /* the title screen as it is */ }
  if (shot === 'fall') go(3, 43, -1.6, -8.2, -0.5, 0.1).then((P) => { fixedCam = { p: [-1.3, 1.45, -8.4], t: [9, 5, -35] }; P.myers.group.scale.y = 0.45; P.fire.setLevel(0.75); P.fire.burst(0.5); for (let i = 0; i < 20; i++) update(0.1, 3000 + i * 100); document.title = 'view fall ready'; });
  if (shot === 'cast') (async () => { await go(0, 10); const ids = Object.keys(LOOKS); await Promise.all(ids.map((k) => loadBase(LOOKS[k].base))); ids.forEach((k, i) => { const m = makeBody({ ...LOOKS[k], x: -40 + (i % 11) * 1.0, z: -3.6 + ((i / 11) | 0) * 1.6, ry: 0 }); SC.P.group.add(m); }); fixedCam = { p: [-35, 1.5, 3.4], t: [-35, 0.9, -3] }; if (q.get('night')) setEnv(ENV.night); document.title = 'view cast ready'; })();

  if (['audit', 'collision', 'seating'].includes(q.get('test'))) (async () => {   /* every chapter's scene: floating things, people in solids, unreachable spots, people inside each other */
    const linesOut = []; let total = 0; startGame(true);
    for (let i = 0; i < SCENES.length; i++) { await beginChapter(i); resetTransient(); const P = SC.P, S = SCENES[i], st = S.start || P.start, vis = SC.npcs.filter((n) => !n.hidden);
      const r = auditPlaceE({ id: P.id, snap: P.snap, npcs: vis.map((n) => ({ id: n.id || n.base, x: n.x, z: n.z, anim: n.anim, ground: n.ground || 0 })), walls: P.walls.concat(S.walls || []), bounds: P.bounds, start: st,
        actions: SC.actions.filter((a) => !('get' in (Object.getOwnPropertyDescriptor(a, 'x') || {}))).map((a) => ({ label: a.label, x: a.x, z: a.z, r: a.r })), people: SC.people.filter((n) => !n.hidden && !n.kid).map((n) => ({ id: n.id, x: n.x, z: n.z, anim: n.anim })) });
      const all = [...r.floating, ...r.inside, ...r.stuck, ...auditThrough(P.snap)]; total += all.length; linesOut.push('chapter ' + (i + 1) + ' (' + P.id + '): ' + all.length + ' issues, ' + vis.length + ' people', ...all.map((l) => '  ' + l)); }
    out('AUDIT ' + total, linesOut); })();
  if (q.get('test') === 'held') (async () => {   /* every carried thing, in every chapter: at the hand, upright, clear of the body, in twelve poses */
    const o = []; let n0 = 0; startGame(true);
    for (let i = 0; i < SCENES.length; i++) { await beginChapter(i); resetTransient(); for (const n of SC.npcs) if (n.m.userData.held && n.m.userData.held.length) { n0++; const ac = n.m.userData.anim, found = new Set(); for (let pose = 0; pose < 12; pose++) { ac.mx.update(ac.cur.getClip().duration / 12); gripTick(n.m); for (const l of auditHeld(n.id || n.base, n.m, n.m.userData.held)) found.add(l); } for (const l of found) o.push('chapter ' + (i + 1) + ': ' + l); } }
    const c = o.length; o.unshift('held items: ' + c + ' issues, ' + n0 + ' people carry something'); out('HELD ' + c, o); })();
  if (q.get('test') === 'resume') (async () => {   /* saved games resume in the right place; closing a talk early does not finish it */
    const o = []; startGame(true);
    await beginChapter(3, 44); resetTransient(); o.push('ch4@44 ruin=' + SC.P.ruin.visible + ' ward=' + SC.P.myers.group.visible + ' ladies=' + byId('maude4').m.visible);
    await beginChapter(3, 45); resetTransient(); o.push('ch4@45 dawn=' + (envNow === ENV.dawn) + ' fire=' + SC.P.fire.level);
    await beginChapter(3, SAFE[43]); resetTransient(); o.push('ch4@43 resumes at ' + stage + ' ward=' + SC.P.myers.group.visible);
    await beginChapter(1, 22); o.push('ch2@22 things placed=' + (Math.abs(SC.P.things[0].position.z) < 2.8));
    await beginChapter(6, 73); o.push('ch7@73 flowers=' + SC.P.laid.every((f) => f.visible));
    await beginChapter(0, 10); startTalk(byId('gran1')); leaveTalk(); o.push('talk closed early: talked=' + byId('gran1').talked + ' stage=' + stage);
    let ran = 0; convo([{ who: 'x', text: 'y' }], () => { ran++; }); leaveTalk(); o.push('finishing talk closed early: callback ran=' + ran);
    out('RESUME ' + o.join(' | '), o); })();
  if (q.get('test') === 'layout') (async () => {   /* open each UI state and check that nothing overlaps, is cut off or is off the screen. Run at 390x800, 667x375, 800x500 and 1280x720. */
    const o = [], W = innerWidth, Hh = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
    await go(0, 13);
    const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'sub', 'dialogue', 'cinner', 'place', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
    const check = (name) => { const Lr = IDS.map(rect).filter(Boolean); for (const a of Lr) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) o.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') o.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
      for (let i = 0; i < Lr.length; i++) for (let j = i + 1; j < Lr.length; j++) { const a = Lr[i].r, b = Lr[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) o.push(`${W}x${Hh} ${name}: ${Lr[i].id} overlaps ${Lr[j].id} by ${ox | 0}x${oy | 0}`); } };
    const reset = () => { for (const id of ['talk', 'toast', 'dialogue', 'card', 'nudge']) $(id).hidden = true; $('hint').hidden = true; bars(false); document.body.classList.remove('subbing', 'talking'); $('sub').classList.add('dim'); $('place').hidden = true; $('place').style.opacity = 0; busy = false; };
    const settle = () => new Promise((r) => setTimeout(r, 700)), LONG = 'Take the photograph to Miss Hyacinth';
    reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = LONG; showHint(); toast('Journal: The people who cared'); showPlace('Slipe Pen Road, Kingston, May 1980'); await settle(); check('play: goal, talk, hint, toast, place');
    reset(); showGoal(true); say('You hold the gate. Firefighters lead the children out, one by one.', 1e6); $('talk').hidden = false; $('talk').textContent = LONG; showHint(); toast('Put back: 2 of 4'); await settle(); check('narration');
    reset(); bars(true); say('Some of the ladies got out. They wait by the road in blankets.', 1e6); await settle(); await settle(); check('narration inside the bars');
    reset(); showGoal(true); document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Nurse Bell'; $('line').textContent = 'Whose story will you sit and hear before you go?'; for (const t of ['Miss Iris, the dressmaker', 'Miss Hyacinth, from the market', 'Miss Maude, the teacher', 'Miss Dora, who sings']) { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = t; $('choices').appendChild(b); } $('next').hidden = true; await settle(); check('dialogue with four choices'); $('choices').replaceChildren(); $('next').hidden = false;
    reset(); card('This chapter is sad', ['It tells about the night of the fire.', 'You watch from the road, far back. Nobody is shown hurt.', 'You can skip to the morning if you like.'], [{ t: 'Continue', go: () => {} }, { t: 'Skip to the morning', go: () => {} }], { col: true }); await settle(); check('sad card');
    reset(); sortCards(2); await settle(); check('sort card');
    reset(); timeline(3); await settle(); check('timeline card');
    reset(); card('A letter for Miss Iris', LETTER, [{ t: 'Finish reading', go: () => {} }]); await settle(); check('letter card');
    reset(); resetCard(); await settle(); check('reset card');
    reset(); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (Hh * 0.45 | 0) + 'px'; showGoal(true); $('talk').hidden = false; $('talk').textContent = LONG; await settle(); check('helper arrow with talk button');
    const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) o.push(`${W}x${Hh} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
    const fits = (name, sel) => { const e = document.querySelector(sel), r = e.getBoundingClientRect(); if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > Hh + 1) o.push(`${W}x${Hh} ${name}: the panel is off the screen (${r.left | 0},${r.top | 0},${r.right | 0},${r.bottom | 0})`); };
    reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = LONG; await settle();
    openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); fits('chapters', '#chapters .book'); closeChapters();
    for (const p of JOURNAL) unlock(p.id, true); openJournal('night'); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); fits('journal', '#journal .book'); closeJournal();
    openCredits(); await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); fits('credits', '#credits .book'); closeCredits();
    out('LAYOUT ' + o.length, o.length ? o : [W + 'x' + Hh + ': no layout problems']); })();
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 7) and the ones after it; add &one to stop after N. It logs every change, and says STALL if nothing changes for a while. */
    const N = +q.get('auto') || 1, one = q.has('one'), log = [], sleep = (ms) => new Promise((r) => setTimeout(r, ms)), Lg = (m) => { log.push(m); out(log.join(' | '), log); };
    (async () => {
      startGame(true); let ch = N - 1; Lg('start ch' + (ch + 1)); await beginChapter(ch); let lastKey = '', lastT = performance.now();
      for (;;) {
        await sleep(100); for (let i = 0; i < 8; i++) update(0.05); const now = performance.now();
        const key = stage + '|' + cur + '|' + unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + JSON.stringify(ctr) + (DIR.on ? 'cut' : '');
        if (key !== lastKey) { lastKey = key; lastT = now; Lg('s' + stage + ' ' + cur + ' pages=' + unlocked.length + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + goalText + '"'); }
        if (now - lastT > 25000) { Lg('STALL at stage ' + stage + ' in ' + cur + ' busy=' + busy + ' frozen=' + frozen + ' cut=' + DIR.on); break; }
        if (!$('card').hidden) { const b = $('cbtns').querySelector('button[data-ok]') || $('cbtns').querySelector('button'); if (b) b.click(); continue; }
        if (!$('dialogue').hidden) { const c = $('choices').firstChild; if (c) c.click(); else $('next').click(); continue; }
        if (stage >= DONE[ch]) { Lg('chapter ' + (ch + 1) + ' DONE at stage ' + stage); if (one || ch >= 6) { Lg('ALLDONE errors=' + errs.length + ' pages=' + unlocked.length + '/' + JOURNAL.length + ' choices=' + JSON.stringify(story)); break; } ch++; Lg('next ch' + (ch + 1)); await beginChapter(ch); lastT = performance.now(); continue; }
        if (busy || frozen || fading || DIR.on) continue;
        const a = SC.actions.find((x) => x.on()); if (a) { state.x = a.x; state.z = a.z; update(0.016); a.go(); continue; }
        const n = SC.people.find((p) => wantsTalk(p)); if (n) { state.x = n.x + 0.9; state.z = n.z + 0.5; update(0.016); startTalk(n); continue; }
      }
    })();
  }
}
