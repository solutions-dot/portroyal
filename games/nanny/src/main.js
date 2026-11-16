import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/nanny/src/main.js: Nanny Town 1734, The Narrow Path.
   The story of Nanny of the Windward Maroons and her town in the Blue Mountains: the walk to freedom, the town, the watch, a fight on the narrow path,
   the night in 1734 when the town was taken, and the paper of 1740 that names her.
   Built on the shared engine (engine/anim.js, engine/audio.js, engine/loader.js, engine/grip.js, engine/audit.js). Controls, journal, chapters and saving follow Kendal 1957.
   New here: land with real heights (land.js), walking on trails (you slide along their edges), people who lead and follow along a trail,
   hiding from a lantern, the horn game, and the fight as a set piece seen from the watch rock.
   Layout of this file: setup, state and controls, people and places, interface, saving, talking, chapters, the horn, each chapter's scenes, the loop, test views. */
import * as THREE from 'three';
import { headTop as realHeadTop, markAt, NEAR_GAP } from '../../../engine/marks.js';   /* the talk mark sits the same gap over the real head or hat in every game */
import { createGuide } from '../../../engine/guide.js';   /* the gold arrow on the ground that shows the way (every game) */
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, chirp, crackle } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { grip, gripTick, spreadArms } from '../../../engine/grip.js';
import { snapMeshes, auditPlace as auditPlaceE, auditHeld, auditCloth, auditBodies } from '../../../engine/audit.js';
import { walkRoute } from '../../../engine/placement.js';
import { follow, lead, goTo, stop as stopFollow, tick as followTick, isFollowing, pathSpots, pathS as pathSE, watch as followWatch } from '../../../engine/follow.js';   /* people who walk with you: one system for every game */
import { skinProbe } from '../../../engine/skinprobe.js';   /* dev checks only (?test=skin), dropped from the public build */
import { G as GFX, T, makeSky, ease, clamp01, lerp, rng, batchStatic } from './gfx.js';
import { ENV, mixEnv, makeRidges, makeMist, makeSun, makeFireflies, makeSmoke, pathLength, pathAt } from './land.js';
import { buildEstate, buildTown, buildWatch, buildNewTown } from './places.js';
import { CHAPTERS, GOALS, TALK_TARGETS, NEXT_AFTER_TALK, CHAPTER_END, TALK, LATER, JOURNAL, SAY, CARDS, CHOICE_NAMES, CALLS } from './content.js';
import * as SFX from './sfx.js';
import { HATS, LOOKS, KID } from './cast.js';
import { musket, lantern, horn, leafCloak, beads, attach } from './props.js';

const $ = (id) => document.getElementById(id);
const PI = Math.PI;
soundPref('nanny-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });
const QUICK = __DEV__ && /[?&](shot|auto|test)=/.test(location.search);   /* test views skip fades and speed up timed scenes */
const TS = QUICK ? 0.06 : 1;   /* time scale for scripted scenes in tests */

/* ---------- renderer, camera, light, sky, the far ridges and the mist ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; GFX.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(66, 1, 0.1, 900); scene.add(camera);
const hemi = new THREE.HemisphereLight(0xffffff, 0x887766, 2); scene.add(hemi); const sun = new THREE.DirectionalLight(0xfff0d0, 2); sun.position.set(10, 20, 10); scene.add(sun); scene.add(sun.target);
const SHADOWS = !matchMedia('(pointer: coarse)').matches && !(__DEV__ && /[?&]noshadow/.test(location.search));   /* real shadows on computers; phones get soft blob shadows under people instead */
renderer.shadowMap.enabled = SHADOWS; renderer.shadowMap.type = THREE.PCFShadowMap; sun.shadow.mapSize.set(2048, 2048); { const sc = sun.shadow.camera; sc.left = -44; sc.right = 44; sc.top = 44; sc.bottom = -44; sc.near = 1; sc.far = 300; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.08; }
const sunDir = new THREE.Vector3(0.4, 0.8, 0.4);
const sky = makeSky(); for (const o of sky.objects) scene.add(o);
const ridges = makeRidges(); scene.add(ridges.group); const mist = makeMist(); scene.add(mist.group); const sunDisc = makeSun(); scene.add(sunDisc); const flies = makeFireflies(); scene.add(flies.group);
const smoke = makeSmoke(scene, 70);
scene.fog = new THREE.Fog(0xcfe2e6, 60, 240);
const nightFill = new THREE.PointLight(0xc4d2ff, 0, 15, 1.4); camera.add(nightFill);   /* at night a soft light goes with you, as if your eyes had got used to the dark: faces near you can be read (owner rule 9) */
let FOV = 66;
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = (w / h < 0.8 ? 76 : 66) * (FOV / 66); camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
let envNow = ENV.morning; const _tc = new THREE.Color();
function setEnv(e) {   /* the time of day: sky, haze, sun, the far ridges and the mist */
  envNow = e; scene.fog.color.setHex(e.fog); scene.fog.near = e.fogN; scene.fog.far = e.fogF; scene.background = scene.fog.color;
  hemi.color.setHex(e.hemi[0]); hemi.groundColor.setHex(e.hemi[1]); hemi.intensity = e.hemi[2]; sun.color.setHex(e.sun[0]); sun.intensity = e.sun[1]; sunDir.set(...e.sun[2]).normalize(); sun.castShadow = SHADOWS && e.sun[1] > 0.9;
  sky.setSky(e.top, e.hor, e.stars, e.moon, Math.min(1, e.hemi[2] / 1.8)); ridges.tone(e.green, e.haze, e.light);
  const P = PL[cur]; mist.set(P && P.backdrop ? P.backdrop.mist : -200, e.mist[0], e.mist[1]); if (P && P.toned) for (const m of P.toned) m.mat.color.setHex(e.green).multiplyScalar(0.4 + 0.6 * e.light).lerp(_tc.setHex(e.haze), m.k);   /* far land that is not part of the ridge rings takes the same haze */ ridges.group.position.y = P && P.backdrop ? P.backdrop.lift : 0;
  nightFill.intensity = 3.4 * clamp01((e.stars - 0.3) / 0.5);
  sunDisc.material.color.setHex(e.sun[0]); sunDisc.material.opacity = e.stars > 0.5 ? 0 : Math.min(1, e.light * 1.2); sunDisc.visible = sunDisc.material.opacity > 0.02;
}

/* ---------- state and controls ---------- */
const state = { x: 0, z: 0, yaw: 0, pitch: 0, started: false };
let EYE = 1.32; const FX = { shake: 0, roll: 0, low: 0 };   /* EYE: a child's eye height; FX: camera shake, and how far you are crouched (0 to 1) */
const titleMotion = matchMedia('(prefers-reduced-motion: reduce)');
const isTouch = matchMedia('(pointer: coarse)').matches;
const keys = new Set(); let busy = false, fading = false, frozen = false, talkWith = null, near = null, moveLock = false;
const PANELS = ['dialogue', 'journal', 'chapters', 'credits', 'card'];
const panelsOpen = () => PANELS.some((id) => !$(id).hidden);
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); if (!$('card').hidden && CARD.dismiss) CARD.dismiss(); }
  if (HORN.on && !e.repeat) {   /* 1 and 2 (or the left and right arrows) blow the horn even while a horn button has the focus: those keys do not press a button by themselves */
    if (k === '1' || k === 'arrowleft') { $('hshort').click(); return; } if (k === '2' || k === 'arrowright') { $('hlong').click(); return; } }
  useInteractionKey(e, () => { if (!$('dialogue').hidden && !$('next').hidden) { $('next').click(); return; } if (!busy && !frozen && near) { activate(near); return; } return false; });
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy || frozen) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null && !moveLock) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; } if (e.pointerId === look.id) { if (look.moved < 8) { const p = tapPerson(e.clientX, e.clientY); if (p) startTalk(p); } look.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {
  const el = $('stick'); if (!isTouch || !state.started || busy || frozen || DIR.on || moveLock) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest); el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}

/* ---------- people: this game's bodies (tools/nanny/people/), recoloured per person (cast.js); places are built when a chapter needs them ---------- */
const BASES = {}, basePromises = {};
function loadBase(id) { return BASES[id] ? Promise.resolve(BASES[id]) : (basePromises[id] = basePromises[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; })); }
const PROPS = { musket: (s) => musket(!s.fixed && !s.fine), lantern: () => lantern(), horn: () => horn() };   /* people far off carry the plain musket; the ones you can walk up to carry the full one */
/* how each thing is carried (engine/grip.js): scale is its size, lift how far the arm is held out from the body. After changing these run ?test=held. */
const GRIP = { musket: { scale: 1, lift: 0.3, straighten: 0.9 }, lantern: { scale: 1.1, lift: 0.5 }, horn: { scale: 1, lift: 0.32 } };
const SKIN_LIGHT = 1.55;   /* owner rule 9: Skin is built inside Marcus Garvey's range, then lightened here so faces read in every light (as in Kendal). The British soldiers (pale: true) are drawn as built. Check with ?test=skin */
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene);
  const offHats = (HATS[s.base] || []).filter((h) => h !== s.hat);   /* a body carries several hats; show the one this person wears (s.hat), or none */
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hide && s.hide.includes(nm)) || offHats.some((h) => nm === h || nm === h + 'Band')) { o.visible = false; return; }
    o.material = mat.clone(); const t = nm === 'Hair' ? undefined : s.tint && s.tint[nm];   /* hair keeps its own painted colours */
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin') o.material.color.setScalar((s.skin || 1) * (s.pale ? 1 : SKIN_LIGHT)); else if (nm === 'Hair') o.material.color.setScalar(1); });   /* hair keeps its own painted colour; only skin is lightened */
  m.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.06; b.renderOrder = 1; m.add(b);
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; m.userData.held = []; ctl.mx.update(0);   /* pose the body once, so the grips below are measured on the real hand */
  for (const [bone, prop] of s.props || []) { const o = PROPS[prop](s), G = GRIP[prop]; grip(m, bone.replace('Hand', ''), o, { handleY: o.userData.handleY, scale: G.scale, yaw: G.yaw || 0, lift: Math.max(0.3, G.lift || 0), straighten: G.straighten ?? 0.8 }); m.userData.held.push({ obj: o, bone, label: prop }); if (o.userData.flame) m.userData.flame = o.userData.flame; }
  if (s.lampLight) { const L = new THREE.PointLight(0xffc878, 5.5, 15, 1.6); L.position.set(0.35, 0.95, 0.35); m.add(L); m.userData.lamp = L; }
  if (s.cloak) leafCloak(m, (s.x * 7 + s.z * 3) | 0); if (s.beads) attach(m, 'Neck', beads(), [0, 0.0, 0.015]);
  spreadArms(m, /^maroon_(woman|elder_woman|girl|child)/.test(s.base) ? 0.15 : 0.06);   /* arms hang clear of skirts (engine/grip.js) */
  return m;
}
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
const PL = {}; let cur = null;
const BUILD = { estate: buildEstate, town: buildTown, watch: buildWatch, newtown: buildNewTown };
let modelsReady = false; const placeLoading = {};
function buildPlace(id) {   /* the geometry only: quick, and enough for a title backdrop. People come later (ensurePlace). */
  if (PL[id]) return PL[id]; const P = BUILD[id](); P.group.visible = false; scene.add(P.group); P.actions = []; P.bodies = []; P.npcs = []; P.specs = { people: P.people, extras: P.extras }; P.people = []; P.extras = []; P.populated = false; PL[id] = P;
  P.bounds = P.G.bounds; P.solidWalls = P.solids.map(([x, z, r]) => [x - r * 0.7, z - r * 0.7, x + r * 0.7, z + r * 0.7]); P.walls = P.G.walls(0.5).concat(P.solidWalls);
  P.solidBoxes = P.solids.flatMap(([x, z, r]) => { const R = r + 0.05, a = 0.8 * R, b = 0.62 * R; return [[x - a, z - a, x + a, z + a], [x - R, z - b, x + R, z + b], [x - b, z - R, x + b, z + R]]; });   /* three boxes that together hold each round footprint whole and hug it closely: routes round them never cut into one (engine/follow.js goTo) */
  if (__DEV__) P.snap = snapMeshes(P.group); P.batch = batchStatic(P.group);
  P.group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.transparent && !(o.material.alphaTest > 0) && o.name !== 'land' && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
  if (ACTIONS_FOR[id]) P.actions = ACTIONS_FOR[id](P); return P;
}
/* background people placed at random are moved until nobody stands in anybody, in a fire, in a tree's roots or off the ground you can walk on (e.wild: they may stand on open hillside, at the height of the land there) */
function settle(P) {
  const r = rng(77), fixed = P.specs.people.map((p) => [p.x, p.z, p.when]), G = P.G, both = (a, b) => !a || !b || (a[0] <= b[1] && b[0] <= a[1]), keep = [];
  const free = (e) => fixed.every((f) => !both(f[2], e.when) || Math.hypot(f[0] - e.x, f[1] - e.z) >= 0.95) && P.solids.every((s) => Math.hypot(s[0] - e.x, s[1] - e.z) >= s[2] + 0.45) && (e.ground !== undefined || e.wild || G.walkable(e.x, e.z, 0.5)) && Math.hypot(e.x - P.start.x, e.z - P.start.z) > 1.6;
  for (const e of P.specs.extras) { if (e.id || e.column !== undefined || e.fighter !== undefined || e.path || e.fixed) { keep.push(e); fixed.push([e.x, e.z, e.when]); continue; }
    const x0 = e.x, z0 = e.z; let ok = free(e), tries = 0; while (!ok && tries++ < 50) { e.x = x0 + (r() - 0.5) * 2 * (1 + tries * 0.14); e.z = z0 + (r() - 0.5) * 2 * (1 + tries * 0.14); ok = free(e); }
    if (ok) { keep.push(e); fixed.push([e.x, e.z, e.when]); } }
  P.specs.extras = keep;
}
function ensurePlace(id) {   /* the place with its people: loads the bodies it needs */
  const P = buildPlace(id); if (P.populated) return Promise.resolve(P); if (placeLoading[id]) return placeLoading[id];
  return (placeLoading[id] = (async () => {
    settle(P);
    for (const e of P.specs.extras) e.bodyId = e.base + '_lo'; for (const e of P.specs.people) e.bodyId = e.base;   /* people you talk to get the full body; background figures get a light copy */
    const bases = new Set([...P.specs.people, ...P.specs.extras].map((s) => s.bodyId)); await Promise.all([...bases].map(loadBase));
    const mk = (s, talk) => { if (s.ground === undefined) s.ground = P.G.h(s.x, s.z); else s.fixedGround = true; const n = Object.assign(s, { talked: false, heard: 0, hx: s.x, hz: s.z, ry0: s.ry || 0, walking: false, wait: 1 + Math.random() * 2, i: 0, extra: !talk, cue: !!s.hiddenNow }); n.m = makeBody(s); n.m.visible = false; P.group.add(n.m); n.ctl = n.m.userData.anim; P.bodies.push(n.m); P.npcs.push(n); return n; };
    P.people = P.specs.people.map((s) => mk(s, true)); P.extras = P.specs.extras.map((s) => mk(s, false)); P.people.forEach(addMark);
    P.populated = true; delete placeLoading[id]; refreshCast(); return P;
  })());
}
const P_ = () => PL[cur];   /* the place you are in */
const byId = (id) => { for (const k of Object.keys(PL)) { const n = PL[k].npcs.find((p) => p.id === id); if (n) return n; } return null; };
const allPeople = () => Object.values(PL).flatMap((P) => P.people);
const shown = (n) => !n.cue && (!n.when || (stage >= n.when[0] && stage <= n.when[1]));
function refreshCast() { for (const k of Object.keys(PL)) for (const n of PL[k].npcs) { n.hidden = !shown(n); if (n.m) n.m.visible = k === cur && !n.hidden; if (n.hidden && n.mark) n.mark.visible = false; } }
function enterPlace(id, { keepPos = false, env } = {}) {
  cur = id; const P = PL[id];
  for (const k of Object.keys(PL)) PL[k].group.visible = k === id; refreshCast();
  setEnv(env || P.env); near = null; smoke.clear();
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
  EYE = 1.32; FX.roll = 0; FX.low = 0; stick.id = null; stick.dx = stick.dy = 0;
}
function clampPos(x, z) {
  const P = P_(); [x, z] = P.G.clamp(x, z);
  for (const s of P.solids) { const d = Math.hypot(x - s[0], z - s[1]); if (d < s[2]) { x = s[0] + (x - s[0]) / (d || 1) * s[2]; z = s[1] + (z - s[1]) / (d || 1) * s[2]; } }
  for (const n of P.people) { if (!n.m || !n.m.visible || isFollowing(n)) continue; const d = Math.hypot(x - n.x, z - n.z); if (d < 0.5) {   /* someone who comes with you never blocks you: they step aside (engine/follow.js) */ x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  return P.G.clamp(x, z);
}
const groundAt = (x, z) => (P_() ? P_().G.h(x, z) : 0);
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  if (!cur || busy || frozen) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of P_().people) if (n.m && n.m.visible && Math.hypot(state.x - n.x, state.z - n.z) < 6 && ray.intersectObject(n.m, true).length > 0) return n; return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
/* how far along a path (metres from its start) the nearest point to (x, z) is */
function pathS(d, x, z) { let b = 1e9, s = 0, out = 0; for (let i = 1; i < d.length; i++) { const ax = d[i - 1][0], az = d[i - 1][1], dx = d[i][0] - ax, dz = d[i][1] - az, L = Math.hypot(dx, dz) || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (L * L))), k = Math.hypot(x - ax - dx * t, z - az - dz * t); if (k < b) { b = k; out = s + t * L; } s += L; } return out; }
/* put a moving person at (n.x, n.z) on the land. Only the change in the ground's height is added to their height: the foot pinning (groundFeet, every frame)
   has already set how high the body rides in this step of the walk, and resetting that each frame made people bounce. */
/* where a person may not stand: off the ground you can walk on, or in the footprint of a solid thing (a hut, a fire, a rock, a tree's trunk and roots: P.solids) */
function blockedAt(P, x, z, r = 0.25) { if (!P.G.walkable(x, z, Math.min(0.15, r * 0.5))) return true; for (const s of P.solids) if (Math.hypot(s[0] - x, s[1] - z) < s[2] + r * 0.4) return true; return false; }
/* what engine/follow.js needs to know each frame: where you are, what is solid, who else is about, and how a person stands on the land */
function followWorld() { const P = P_(); return { px: state.x, pz: state.z, blocked: (x, z, r) => blockedAt(P, x, z, r), walls: P.solidBoxes, bounds: P.bounds, others: P.npcs.filter((o) => o.m && o.m.visible), talking: talkWith, view: { x: state.x, z: state.z, yaw: state.yaw }, place: (n) => stand(n, P.G) }; }
function stand(n, G) { const m = n.m, g = G.h(n.x, n.z); m.position.x = n.x; m.position.z = n.z; m.position.y += g - (m.userData.ground || 0); m.userData.ground = g; }
const setWalk = (n, on, clip = 'Walk') => { if (on && (!n.walking || n.clip !== clip)) { n.walking = true; n.clip = clip; n.ctl.play(clip); } else if (!on && n.walking) { n.walking = false; n.ctl.play(null); } };
function npcTick(n, dt) {
  const m = n.m; if (!m || !m.visible) return; if (POSTER) { m.rotation.y = n.ry0; return; } if (n.scripted) return;
  const G = P_().G, d = Math.hypot(state.x - n.x, state.z - n.z), isNear = !n.extra && (d < 3.2 || talkWith === n);
  if (n.fol) { followTick(n, dt, followWorld()); return; }   /* someone who leads you, follows you or was sent somewhere (engine/follow.js) */
  if (!n.path) { if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else if (!n.extra) faceTo(m, n.ry0, dt, 2); return; }
  if (n.wait > 0) { setWalk(n, false); n.wait -= dt; return; }
  setWalk(n, true); const to = n.path[(n.i + 1) % n.path.length], dx = to[0] - n.x, dz = to[1] - n.z, dist = Math.hypot(dx, dz), sp = (n.speed || 1.1) * dt; faceTo(m, Math.atan2(dx, dz), dt);
  if (dist <= sp) { n.x = to[0]; n.z = to[1]; n.i = (n.i + 1) % n.path.length; n.wait = 1.5 + Math.random() * 1.5; } else { n.x += dx / dist * sp; n.z += dz / dist * sp; }
  stand(n, G);
}

/* ---------- a glowing speech mark over each person, and a bubble on the nearest ---------- */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#f6c45c'; x.strokeStyle = 'rgba(70,45,10,0.85)'; x.lineWidth = 3; x.beginPath(); x.arc(64, 64, 15, 0, PI * 2); x.fill(); x.stroke(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(59, 59, 5, 0, PI * 2); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
const headTop = (n) => { const y = n.m ? realHeadTop(n.m) : null; return y !== null ? y : (n.m.userData.ground || 0) + (n.h || 1.8) - 0.03; };   /* the real top of the head or hat (engine/marks.js), or the old guess */
const POSTER = __DEV__ && /[?&]shot=poster/.test(location.search);   /* the menu poster is rendered from this view with no marks or bubbles */
function bubbleTick(now) {
  const show = state.started && !busy && !frozen && $('card').hidden && !POSTER && !DIR.on && !HORN.on;
  for (const n of P_() ? P_().people : []) { const m = n.mark; if (!m) continue; if (!show || !n.m || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, markAt(headTop(n), k) + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n && d < 40; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, headTop(near) + NEAR_GAP, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== near.who) { TB.el.dataset.label = near.who; TB.el.innerHTML = TALK_SVG + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- interface: toast, the journal, cards, the cinematic layer ---------- */
let toastTimer = 0, EP = 0;   /* EP: the "epoch": starting a chapter bumps it, so timed scenes from an earlier chapter stop themselves */
function toast(msg, ms = 2600) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms); }
const unlocked = [], story = {}, ctr = {};   /* story: what you chose. ctr: counters for the stage you are in (yams planted, doors knocked...) */
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function refreshJourney() { const p = JOURNAL.find((q) => q.id === 'journey'), lines = ['job', 'why'].map((k) => (story[k] ? CHOICE_NAMES[k][story[k]] : null)).filter(Boolean); p.simple = lines.length ? ['You finished the story.', ...lines] : ['You finished the story.']; }
function renderJournal(sel) {
  refreshJourney(); const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || unlocked[unlocked.length - 1];
  JOURNAL.filter((p) => unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((q) => q.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h); for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'); const s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s); for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal(sel) { if (busy && $('journal').hidden && !$('title').hidden) return; if (!$('journal').hidden) return; busy = true; keys.clear(); renderJournal(typeof sel === 'string' ? sel : undefined); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; busy = panelsOpen(); }
$('jbtn').onclick = () => openJournal(); $('jclose').onclick = closeJournal;
const MENU = { ok: true, url: '../../../menu/' };   /* Always available on the game collection, even if a menu fetch would fail. */
function toMenu() { saveGame(); location.href = MENU.url; }

const CARD = { dismiss: null };
function card(title, paras, btns, { col = false, dismiss } = {}) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); bb.classList.toggle('col', col); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; bb.appendChild(el); });
  CARD.dismiss = dismiss === undefined ? null : dismiss; $('card').hidden = false; busy = true; keys.clear(); $('talk').hidden = true; const f = bb.querySelector('button'); if (f) f.focus();
}
function hideCard() { $('card').hidden = true; CARD.dismiss = null; busy = panelsOpen(); }
const infoCard = (c, go) => new Promise((res) => card(c.title, c.paras, [{ t: c.go || 'Go on', go: () => { hideCard(); if (go) go(); res(true); } }], { col: true }));
function chapterFade(title, sub, fn) {   /* fade to a black title card, change the scene while it is dark, fade back */
  if (QUICK) { fn(); return; } if (fading) return; fading = true; const f = $('fade'); $('fadeT').textContent = title; $('fadeS').textContent = sub; $('card').hidden = true; $('dialogue').hidden = true;
  f.hidden = false; requestAnimationFrame(() => f.classList.add('on')); setTimeout(() => { fn(); f.classList.add('txt'); }, 800);
  setTimeout(() => f.classList.remove('txt'), 3200); setTimeout(() => f.classList.remove('on'), 3700); setTimeout(() => { f.hidden = true; fading = false; }, 4600);
}
function fadeBlack(on, ms = 900) { const f = $('fade'); f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease'; if (on) { f.hidden = false; $('fadeT').textContent = ''; $('fadeS').textContent = ''; f.classList.remove('txt'); requestAnimationFrame(() => f.classList.add('on')); } else { f.classList.remove('on'); setTimeout(() => { f.hidden = true; f.style.transition = ''; }, QUICK ? 0 : ms + 50); } }
const bars = (on) => document.body.classList.toggle('cine', on);
let subTimer = 0;
function say(text, ms = 3800) { const el = $('sub'); el.textContent = text; el.classList.toggle('dim', !text); document.body.classList.toggle('subbing', !!text); clearTimeout(subTimer); subTimer = setTimeout(() => { el.classList.add('dim'); document.body.classList.remove('subbing'); }, Math.max(500, ms * TS)); }
function flash(op, ms = 0, color = '#fff') { const f = $('flash'); f.style.background = color; f.style.transition = 'opacity ' + (QUICK ? 0 : ms) + 'ms ease-out'; f.style.opacity = op; }
const wait = (ms) => new Promise((r) => setTimeout(r, ms * TS));
async function run(steps) { const ep = EP; for (const [ms, fn] of steps) { await wait(ms); if (ep !== EP) return false; fn(); } return true; }   /* timed steps: [wait in ms, then do this]. Stops if the chapter changes. */

/* ---------- the camera director: a move from one view to another, for cutscenes. zoom: field of view to ease to (66 is normal). ---------- */
const DIR = { on: false, t: 0, dur: 1, a: null, b: null, la: null, lb: null, resolve: null, f0: 66, f1: 66 }, _v = new THREE.Vector3();
function cut(a, b, la, lb, dur, zoom = 66) { return new Promise((res) => { Object.assign(DIR, { on: true, t: 0, dur: Math.max(0.05, dur * TS), a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), la: new THREE.Vector3(...la), lb: new THREE.Vector3(...lb), resolve: res, f0: FOV, f1: zoom }); }); }
function endCut() { DIR.on = false; if (FOV !== 66) { FOV = 66; resize(); } }
const eyeNow = () => [state.x, groundAt(state.x, state.z) + EYE, state.z];

/* ---------- goal, hint, sound ---------- */
let stage = 0, best = 0, goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer); goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500); if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
function refreshGoal(quiet) { const g = GOALS[stage]; goalText = ctr.goal || (g ? g(ctr) : ''); if (quiet) { $('goal').textContent = goalText; return; } showGoal(true); }
$('goal').onclick = () => showGoal(true);
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'nanny-save-v1'; let hasSave = false, erasing = false;
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, unlocked, stage, best, story, talked: allPeople().filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story); stage = Number.isInteger(d.stage) && d.stage in GOALS ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it.
   A question whose answers carry `ok` is a quiz: a wrong pick goes grey and you try again. ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
const ALIAS = () => ({ quamin: stage === 14 ? 'quaminTop' : 'quamin', mimba: stage === 24 ? 'mimbaWork' : 'mimba', cubbenah3: stage === 40 ? 'cub4' : stage === 43 ? 'cub4b' : 'cubbenah3', beneba6: stage === 62 ? 'sort' : 'beneba6' });
const wantsTalk = (n) => !n.extra && !n.talked && !n.hidden && (TALK_TARGETS[stage] || []).includes(n.id);
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  if (busy || frozen || HORN.on) return; talkFull = wantsTalk(n); const id = ALIAS()[n.id] || n.id;
  if (talkFull) lines = [...TALK[id](story)]; else { const later = (LATER[id] || LATER[n.id] || (() => ['...']))(story); lines = [{ who: n.who, text: later[n.heard++ % later.length] }]; }
  convoForced = false; openConvo(lines, null, n);
}
function convo(ls, onEnd, who) { if (busy && !$('card').hidden) hideCard(); talkFull = false; convoForced = true; openConvo([...ls], onEnd, who || null); }
function openConvo(ls, onEnd, n) { document.body.classList.add('talking'); busy = true; talkWith = n || null; lines = ls; convoEnd = onEnd; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true; showLine(); }
function showLine() {
  const s = lines[step], me = s.who === 'You'; if (s.unlock) unlock(s.unlock); if (s.give === 'cloak') { story.cloak = true; saveGame(); toast(SAY.cloak, 3200); SFX.rustle(); }
  $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(s, c, b); box.appendChild(b); }); box.firstChild.focus(); } else $('next').focus();
  const ac = talkWith && talkWith.ctl; if (ac) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(s, c, btn) {
  const quiz = s.choices.some((k) => k.ok); if (quiz && !c.ok) { uiSound('tap'); btn.disabled = true; toast('Not that one. Try again.', 1800); const nx = [...$('choices').children].find((b) => !b.disabled); if (nx) nx.focus(); return; }
  uiSound(quiz ? 'goal' : 'tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || [])); step++; if (step >= lines.length) endTalk(true); else showLine();
}
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
const CH_PLACE = ['estate', 'town', 'watch', 'watch', 'town', 'newtown'], CH_FIRST = [10, 20, 30, 40, 50, 60], DONE = [15, 25, 35, 44, 56, 64];
const CH_ENV = [ENV.night, ENV.morning, ENV.haze, ENV.day, ENV.firenight, ENV.morning];
const SAFE = { 12: 11, 13: 11, 14: 11, 31: 30, 32: 30, 41: 40, 42: 40 };   /* a saved game never resumes in the middle of a scripted scene */
const chapterOf = (s) => Math.max(0, Math.min(5, Math.floor(s / 10) - 1));
const ON = {}, TICKS = [];   /* ON[stage]: what happens when a stage begins. TICKS: per-frame jobs from tween(). */
function setStage(s) {
  stage = s; best = Math.max(best, s); for (const k of Object.keys(ctr)) delete ctr[k]; for (const n of allPeople()) n.talked = false; saveGame(); refreshCast(); refreshGoal(); if (ON[s]) ON[s]();
  if (!QUICK && s in CHAPTER_END) setTimeout(() => nextCard(CHAPTER_END[s], s), 900);
}
function nextCard(i, s, tries = 0) {
  if (stage !== s) return; if ((panelsOpen() || fading || DIR.on) && tries < 14) { setTimeout(() => nextCard(i, s, tries + 1), 800); return; }
  const nx = CHAPTERS[i + 1]; if (!nx) return; uiSound('goal'); card('Chapter ' + (i + 1) + ' is finished!', ['Well done. Next is ' + nx.name + ' (' + nx.year + ').'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(i + 1); } }, { t: 'Stay here', go: hideCard }]);
}
function showPlace(text) { const el = $('place'); el.textContent = text || CHAPTERS[chapterOf(stage)].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(showPlace.t); showPlace.t = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetTransient() {   /* leave anything running: scripted scenes, the horn, the fight, the camera director */
  EP++; endCut(); frozen = false; moveLock = false; bars(false); $('sub').classList.add('dim'); document.body.classList.remove('subbing'); $('holdwrap').hidden = true; hornClose(); flash(0, 0); $('vig').style.opacity = 0; $('glow').style.opacity = 0; FX.shake = 0; FX.roll = 0; FX.low = 0; FIGHT.on = false; GUNS.on = false;
  SFX.setBeds({}, 0.1); TICKS.length = 0; smoke.clear(); for (const k of Object.keys(PL)) for (const n of PL[k].npcs) { n.fol = null; n.scripted = false; n.cue = !!n.hiddenNow; if (n.walking) { n.walking = false; n.ctl.play(null); } n.x = n.hx; n.z = n.hz; if (n.m) { n.m.rotation.y = n.ry0; if (!n.fixedGround) n.m.userData.ground = PL[k].G.h(n.x, n.z); n.m.position.set(n.x, n.m.userData.ground, n.z); } }
}
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i]; hideCard(); closeJournal(); closeChapters(); $('dialogue').hidden = true; busy = false; talkWith = null;
  if (!PL[CH_PLACE[i]] || !PL[CH_PLACE[i]].populated) toast('Loading', 4000); await ensurePlace(CH_PLACE[i]);
  chapterFade(C.title, C.sub, () => startScene(i, st));
}
function startScene(i, st) {
  const id = CH_PLACE[i], P = PL[id]; enterPlace(id, { env: CH_ENV[i] }); state.started = true; resetScenery(P, i, st); setStage(st); showPlace(); leavesUI();
}
/* put the place's moving things as they should be when a chapter (or a saved stage) starts */
function resetScenery(P, i, st) {
  const S = P.spots;
  if (id0(P) === 'town') { S.yams.forEach((y, k) => { y.userData.vine.visible = i !== 1 || st > 22; y.userData.vine.scale.y = 1; }); S.guns.forEach((g) => { g.visible = false; }); S.burn.forEach((b) => { b.visible = false; }); S.fireLight.intensity = 0; S.hearth.intensity = i === 4 ? 2.4 : 0; if (P.fire.userData.flame) P.fire.userData.flame.visible = true;
    if (i === 1 && st >= 21) { state.x = 3.4; state.z = 8.4; state.yaw = 0.5; } if (i === 4) { state.x = -4.6; state.z = 8.8; state.yaw = 1.0; } if (i === 4 && st >= 55) arriveRidge(true); }
  if (id0(P) === 'watch') { S.trenches.forEach((t) => { t.t.userData.stick.visible = i === 3 || st > 33; }); S.cover.forEach((c) => { c.visible = true; c.scale.set(1, 1, 1); c.rotation.z = 0; }); S.redline.visible = false; S.sticks.visible = !(i === 3 || st > 33); if (i === 3) { state.x = -1.6; state.z = -1.4; state.yaw = PI; } }
  if (id0(P) === 'newtown') S.hearth.intensity = 0;
}
const id0 = (P) => P.id;
function chaptersOpen(i) { return i === 0 || best >= DONE[i - 1]; }
let teacherMode = false; try { teacherMode = localStorage.getItem('nanny-teacher') === '1'; } catch { /* storage may be blocked */ }
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
$('chteacher').onclick = () => { teacherMode = !teacherMode; try { localStorage.setItem('nanny-teacher', teacherMode ? '1' : '0'); } catch { /* ignore */ } renderChapters(); $('chteacher').focus(); };
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
$('reset').onclick = () => { if (fading || FIGHT.on || HORN.on) return; closeJournal(); const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart “' + CHAPTERS[i].name + '”', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : [])]); };

/* ---------- waiting for things, and moving things over time ---------- */
const waitFor = (fn) => new Promise((res) => { const ep = EP, iv = setInterval(() => { if (EP !== ep) { clearInterval(iv); res(false); } else if (fn()) { clearInterval(iv); res(true); } }, 100); });
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.05, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); fn(k, dt / d); if (k >= 1) { res(true); return true; } return false; }); }); }
const envTo = (b, sec) => { const a = envNow; return tween(sec, (k) => setEnv(mixEnv(a, b, ease(k)))); };

/* ---------- the horn: the call is shown as dots (short) and bars (long). Listen, then tap Short and Long in the same order.
   A wrong tap just starts that call again. hornGame(list of call ids, { far }) resolves when every call has been blown. ---------- */
const HORN = { on: false, notes: '', pos: 0, ready: false, resolve: null, far: 0 };
function hornDots(notes) { const d = $('horndots'); d.replaceChildren(); for (const n of notes) { const i = document.createElement('i'); i.className = n === 'L' ? 'l' : 's'; d.appendChild(i); } }
function hornClose() { HORN.on = false; HORN.ready = false; $('hornwrap').hidden = true; if (HORN.resolve) { const r = HORN.resolve; HORN.resolve = null; r(false); } }
async function hornGame(ids, { far = 0, who = 'Cubbenah' } = {}) {
  const ep = EP; HORN.on = true; $('hornwrap').hidden = false; $('hint').hidden = true;
  for (const id of ids) {
    const c = CALLS[id]; HORN.notes = c.notes; HORN.pos = 0; HORN.ready = false; hornDots(c.notes); $('hornname').textContent = '“' + c.name + '”'; $('horntip').textContent = far ? 'Listen to the far horn.' : 'Listen to ' + who + '.'; $('hshort').disabled = $('hlong').disabled = true;
    await wait(500); if (ep !== EP) return false;
    let t = 0; const dots = [...$('horndots').children]; for (let i = 0; i < c.notes.length; i++) { const n = c.notes[i], len = SFX.NOTE[n]; setTimeout(() => { if (ep !== EP || !HORN.on) return; SFX.hornNote(len, { far: far || 0.15, pan: far ? 0.5 : 0.2, pitch: far ? 300 : 330 }); dots[i].classList.add('lit'); setTimeout(() => dots[i].classList.remove('lit'), len * 1000 * TS); }, t * 1000 * TS); t += len + SFX.NOTE.GAP; }
    const hm = byId(cur === 'town' ? 'cubbenah' : 'cubbenah3'); if (!far && hm && hm.ctl && CL.Drink) hm.ctl.play('Drink', true);
    await wait(t * 1000 + 250); if (ep !== EP) return false;
    $('horntip').textContent = isTouch ? 'Your turn. Tap Short and Long.' : 'Your turn. Tap the buttons, or press 1 and 2.'; $('hshort').disabled = $('hlong').disabled = false; HORN.ready = true; $(c.notes[0] === 'L' ? 'hlong' : 'hshort').focus();
    const ok = await new Promise((res) => { HORN.resolve = res; }); if (!ok || ep !== EP) return false;
    HORN.ready = false; $('hshort').disabled = $('hlong').disabled = true; $('horntip').textContent = 'Well blown!'; uiSound('goal'); await wait(900); if (ep !== EP) return false;
  }
  HORN.on = false; $('hornwrap').hidden = true; return true;
}
function hornTap(n) {
  if (!HORN.on || !HORN.ready) return; SFX.hornNote(SFX.NOTE[n], { far: 0, pitch: 392, vol: 0.34 }); const dots = [...$('horndots').children];
  if (HORN.notes[HORN.pos] === n) { dots[HORN.pos].classList.add('done'); HORN.pos++; if (HORN.pos >= HORN.notes.length) { const r = HORN.resolve; HORN.resolve = null; HORN.ready = false; if (r) r(true); } else $(HORN.notes[HORN.pos] === 'L' ? 'hlong' : 'hshort').focus(); }
  else { HORN.pos = 0; dots.forEach((d) => d.classList.remove('done')); const w = $('horndots'); w.classList.remove('bad'); void w.offsetWidth; w.classList.add('bad'); $('horntip').textContent = 'Not quite. Start the call again.'; }
}
$('hshort').onclick = () => hornTap('S'); $('hlong').onclick = () => hornTap('L');

/* ---------- small effects: a gun flash with its puff of smoke, the leaf frame, the "Stay low" button ---------- */
const FLASH = []; for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), color: 0xfff0c0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); s.visible = false; s.renderOrder = 7; scene.add(s); FLASH.push({ s, t: 0 }); }
const gunLight = new THREE.PointLight(0xffd090, 0, 40, 1.4); scene.add(gunLight); let flashN = 0; const _p = new THREE.Vector3();
function gunFlash(x, y, z, size = 1.6, smokeAmt = 1) {
  const f = FLASH[flashN++ % FLASH.length]; f.s.position.set(x, y, z); f.s.scale.set(size, size, 1); f.s.visible = true; f.t = 0.11; gunLight.position.set(x, y + 0.4, z); gunLight.intensity = 30 * size;
  for (let i = 0; i < 2 * smokeAmt; i++) smoke.emit(_p.set(x, y, z), new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.5 + Math.random() * 0.5, (Math.random() - 0.5) * 0.8), { size: 0.7 * size, grow: 3.2 * size, life: 4.5, color: 0xdcdcd4, opacity: 0.5 });
}
function fxTick(dt) { for (const f of FLASH) if (f.s.visible) { f.t -= dt; if (f.t <= 0) f.s.visible = false; } if (gunLight.intensity > 0) gunLight.intensity = Math.max(0, gunLight.intensity - dt * 260); if (FX.shake > 0 && !FIGHT.hold) FX.shake = Math.max(0, FX.shake - dt * 0.9); }
{ const c = document.createElement('canvas'); c.width = 640; c.height = 400; const x = c.getContext('2d'), r = rng(9), leaf = (px, py, a, s, col) => { x.save(); x.translate(px, py); x.rotate(a); x.fillStyle = col; x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(s * 0.5, -s * 0.34, s * 0.9, -s * 0.2, s, 0); x.bezierCurveTo(s * 0.9, s * 0.2, s * 0.5, s * 0.34, 0, 0); x.fill(); x.strokeStyle = 'rgba(10,30,10,0.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, 0); x.lineTo(s, 0); x.stroke(); x.restore(); };
  for (let i = 0; i < 84; i++) { const e = (i % 4), t = r() < 0.5 ? r() * 0.3 : 1 - r() * 0.3, px = e === 0 ? t * 640 : e === 1 ? t * 640 : e === 2 ? r() * 52 : 640 - r() * 52, py = e === 0 ? r() * 40 : e === 1 ? 400 - r() * 36 : t * 400, a = e === 0 ? PI / 2 + (r() - 0.5) * 1.4 : e === 1 ? -PI / 2 + (r() - 0.5) * 1.4 : e === 2 ? (r() - 0.5) * 1.4 : PI + (r() - 0.5) * 1.4; leaf(px, py, a, 44 + r() * 50, ['#1f4a22', '#2a5e2a', '#35702f', '#18401c', '#40803a'][(r() * 5) | 0]); }
  $('leaves').style.backgroundImage = 'url(' + c.toDataURL() + ')'; }
function leavesUI() { const on = !!story.cloak && cur === 'watch' && stage >= 34 && stage <= 42; $('leaves').classList.toggle('on', on); $('leaves').classList.toggle('low', on && FX.low > 0.5); }
const HOLD = { on: false };
for (const ev of ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel']) $('hold').addEventListener(ev, (e) => { HOLD.on = ev === 'pointerdown'; $('hold').classList.toggle('on', HOLD.on); e.preventDefault(); });
addEventListener('keydown', (e) => { if ($('holdwrap').hidden) return; if (e.key === ' ' || e.key === 'Enter') HOLD.on = true; }); addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') HOLD.on = false; });

/* ---------- things to do: ACTIONS_FOR[place](P) makes the list of that place. A thing shows as a button when you stand at it. ---------- */
const ACTIONS_FOR = {
  estate: () => [],
  town: (P) => [
    ...P.spots.yams.map((y, i) => ({ label: 'Plant a yam', x: y.position.x + 1.1, z: y.position.z + 0.4, r: 2.1, on: () => stage === 22 && !ctr['y' + i], go: () => { ctr['y' + i] = 1; const n = ctr.yam = (ctr.yam || 0) + 1; y.userData.vine.visible = true; y.userData.vine.scale.y = 0.35; SFX.dig(); toast(SAY.yam[n - 1], 3000); refreshGoal(true); const mi = byId('mimba'); if (mi && mi.ctl) mi.ctl.play('Clap', true); if (n >= 3) convo(TALK.mimbaYam(story), () => setStage(23), byId('mimba')); } })),
    { label: 'Learn the horn', x: P.spots.horn[0] - 1.2, z: P.spots.horn[1] + 0.6, r: 2.6, on: () => stage === 23 && !HORN.on, go: () => hornLesson() },
    ...P.spots.doors.map((d, i) => ({ label: 'Knock on the door', x: d[0], z: d[1], r: 2.3, on: () => stage === 51 && !ctr['d' + i], go: () => { ctr['d' + i] = 1; const n = ctr.door = (ctr.door || 0) + 1; SFX.knock(); toast(SAY.door[n - 1], 3000); refreshGoal(true); if (n >= 3) setStage(52); } })),
    { label: 'Go up the back trail', x: P.spots.backGate[0] + 1.4, z: P.spots.backGate[1] + 1.4, r: 3.0, on: () => stage === 54 && !GUNS.on && !ctr.climb, go: () => gunsIntro() },
  ],
  watch: (P) => [
    { label: 'Look out over the valley', x: P.spots.look[0], z: P.spots.look[1], r: 2.0, on: () => stage === 31, go: () => lookOut() },
    ...P.spots.trenches.map((t, i) => ({ label: 'Set a forked stick', x: t.ax, z: t.az, r: 2.2, on: () => stage === 33 && !ctr['f' + i], go: () => { ctr['f' + i] = 1; const n = ctr.fork = (ctr.fork || 0) + 1; t.t.userData.stick.visible = true; P.spots.sticks.visible = n < 3; SFX.dig(0.14); toast(SAY.fork[n - 1], 3000); refreshGoal(true); if (n >= 3) setStage(34); } })),
    { label: 'Take your place', x: P.spots.place[0], z: P.spots.place[1], r: 2.0, on: () => stage === 41 && !FIGHT.on, go: () => fightIntro() },
  ],
  newtown: (P) => [
    { label: 'Look at the paper', x: P.spots.paper[0] - 0.9, z: P.spots.paper[1] + 1.1, r: 2.4, on: () => stage === 61, go: () => { unlock('patent'); const c = CARDS.paper; card(c.title, c.paras, [{ t: c.go, go: () => { hideCard(); setStage(62); } }], { col: true }); } },
  ],
};

/* ---------- chapter 1: the night road. Quamin leads, Mama follows; a watchman with a lantern walks the cart road. ---------- */
ON[10] = () => { if (cur === 'estate') { say(SAY.start, 4200); SFX.owl(); } };
/* how each person walks with you (engine/follow.js): a guide keeps `ahead` metres in front along the trail and waits if you fall behind; a follower keeps `gap` metres
   behind (on the trail, or in your footsteps), never closer than `space`. The scenes and the place audit both read these numbers. */
const FOLLOW = { quamin: { ahead: 4.6, side: 0.45 }, mama: { gap: 2.4, side: 0.5 }, quaminT: { ahead: 4.4 }, mamaT: { gap: 2.2, side: 0.5 }, mama5: { ahead: 3.6, side: 0.3 }, flee: (i) => ({ ahead: 7 + i * 3.2, side: i % 2 ? 0.3 : -0.3, wait: Infinity, wave: false }), phibba: { gap: 1.4, side: 0.55, space: 0.8 } };
ON[11] = () => { const P = PL.estate, S = P.spots, q = byId('quamin'), m = byId('mama'); lead(q, S.trail.dense, { ...FOLLOW.quamin, max: S.sRoadS - 1.2 }); follow(m, FOLLOW.mama); say(SAY.follow, 3800); SFX.owl(); };
ON[12] = () => { say(SAY.road, 3600); ctr.t = 0; };
ON[13] = () => { const S = PL.estate.spots, q = byId('quamin'); if (q && q.fol) { q.fol.max = S.top - 2.2; q.fol.min = 0; } say(SAY.roadDone, 3200); $('glow').style.opacity = 0; SFX.whistle(); };
function estateTick(dt) {
  const P = P_(), S = P.spots, sP = pathS(S.trail.dense, state.x, state.z), w = byId('watchman'); if (w && w.m.userData.flame) w.m.userData.flame.scale.setScalar(0.6 + Math.random() * 0.2);
  /* you cannot run on ahead of the story: before you have talked, and before the road, the trail stops you */
  const cap = stage === 10 ? 12 : stage === 11 ? S.sRoadS - 1.4 : 1e9; if (sP > cap + 0.4) { const [x, z] = pathAt(S.trail.dense, cap); state.x = x; state.z = z; if (stage === 10 && !ctr.capHint) { ctr.capHint = 1; toast(SAY.notYet, 3000); } }
  if (stage === 11 && sP >= S.sRoadS - 2.2) setStage(12);
  else if (stage === 12 && w) {
    const dW = Math.hypot(state.x - w.x, state.z - w.z), onRoad = state.z < S.roadZ[1] - 0.2 && state.z > S.roadZ[0]; $('glow').style.opacity = clamp01((19 - dW) / 11) * (onRoad ? 0.95 : 0.6);
    const q = byId('quamin'); if (q && q.fol && !ctr.qAcross && Math.hypot(S.crossX - w.x, 8 - w.z) > 21) { ctr.qAcross = 1; q.fol.max = S.sRoadN + 3.4; q.fol.min = S.sRoadN + 2.6; }   /* Quamin goes first: when the light is far he slips across and waits for you on the other side */
    ctr.t = (ctr.t || 0) + dt; if (ctr.t > 4) { if (dW > 20 && !onRoad && ctr.hint !== 'go') { ctr.hint = 'go'; say(SAY.roadGo, 3000); } else if (dW < 15 && !onRoad && ctr.hint !== 'wait') { ctr.hint = 'wait'; say(SAY.roadWait, 3000); } }
    if (onRoad && dW < 8.5 && !frozen) { frozen = true; say(SAY.roadSeen, 2600); flash(0.5, 60, '#ffb060'); setTimeout(() => flash(0, 500, '#ffb060'), 120); const [x, z] = pathAt(S.trail.dense, S.sRoadS - 4); const ep = EP; setTimeout(() => { if (ep !== EP) return; state.x = x; state.z = z; frozen = false; ctr.hint = ''; }, 900 * TS); }
    else if (sP >= S.sRoadN + 0.8) setStage(13);
  }
  else if (stage === 13) { if (!ctr.s1 && state.z < -9.5) { ctr.s1 = 1; say(SAY.stream, 3400); } if (!ctr.s2 && state.z < -24) { ctr.s2 = 1; say(SAY.climb, 3800); SFX.whistle(); } if (sP >= S.top - 4.6) setStage(14); }
}
ON[14] = async () => {
  const ep = EP, P = PL.estate; if (cur !== 'estate') return; frozen = true; bars(true); const q = byId('quamin'), m = byId('mama'); if (q && q.fol) q.fol.max = P.spots.top - 1.0; if (m && m.fol) m.fol.gap = 1.9;
  say(SAY.dawn1, 4200); const e1 = envTo(ENV.predawn, 5); const a = eyeNow(), h = a[1];
  await cut(a, [a[0] - 0.4, h + 0.5, a[2] - 1.5], [a[0] - 30, h + 6, a[2] - 60], [a[0] - 60, h + 16, a[2] - 90], 6); if (ep !== EP) return; await e1;
  say(SAY.dawn2, 4600); const e2 = envTo(ENV.dawn, 7); await cut([a[0] - 0.4, h + 0.5, a[2] - 1.5], [a[0] + 2.5, h + 2.2, a[2] - 4], [a[0] - 60, h + 16, a[2] - 90], [a[0] + 70, h + 18, a[2] - 90], 8); if (ep !== EP) return; await e2;
  say(SAY.dawn3, 3600); SFX.hornCall('LL', { far: 0.8, pan: -0.4, pitch: 310 }); await wait(3400); if (ep !== EP) return;
  endCut(); frozen = false; bars(false); state.yaw = 0.4; state.pitch = 0.08; showGoal(true);
};

/* ---------- chapter 2: the hill town ---------- */
ON[20] = () => { const P = PL.town, S = P.spots, q = byId('quaminT'), m = byId('mamaT'); if (!q || !m) return; const [qx, qz] = pathAt(S.pathIn.dense, 5); q.x = qx; q.z = qz; m.x = P.start.x + 0.7; m.z = P.start.z + 1.3; lead(q, S.pathIn.dense, FOLLOW.quaminT); follow(m, FOLLOW.mamaT);   /* Quamin starts ahead of you, Mama behind you */ say(SAY.pathUp, 4200); };
ON[21] = () => { const q = byId('quaminT'), m = byId('mamaT'); for (const n of [q, m]) if (n && n.fol) goTo(n, n.hx, n.hz, { face: n.ry0 });   /* home round the fire and the stools, not through them */ if (cur === 'town') say(SAY.townIn, 4200); };
function townTick(dt, t) {
  const P = P_(), S = P.spots; if (P.fire.userData.flame) P.fire.userData.flame.scale.set(0.9 + Math.sin(t * 11) * 0.08, 1.1 + Math.sin(t * 7.3) * 0.14, 1); if (S.hearth.intensity > 0) S.hearth.intensity = 2.2 + Math.sin(t * 13) * 0.3 + Math.sin(t * 5.1) * 0.3;
  if (stage === 20 && pathS(S.pathIn.dense, state.x, state.z) >= S.sIn - 1.2) setStage(21);
  if (stage >= 55 && stage <= 59) for (const b of S.burn) if (b.visible && Math.random() < dt * 0.5) smoke.emit(b.position, new THREE.Vector3(0.5, 1.8 + Math.random(), 0.2), { size: 2.2, grow: 8, life: 8, color: 0x5a524c, opacity: 0.42 });
  if (stage >= 50 && stage <= 54 && !GUNS.on) { const sB = pathS(S.back.dense, state.x, state.z); if (sB > 9 && Math.hypot(state.x, state.z) > 15) { const [x, z] = pathAt(S.back.dense, 8.6); state.x = x; state.z = z; if (!ctr.stayHint) { ctr.stayHint = 1; toast(stage === 54 ? 'Go up the back trail from its start.' : SAY.stay, 3000); } } }   /* the back trail waits until everyone is ready */
  if (GUNS.on) gunsTick(dt, t);
}
async function hornLesson() {
  const ep = EP; frozen = true; busy = false; const ok = await hornGame(['well', 'come']); if (ep !== EP) return; frozen = false; if (!ok) return;
  convo(TALK.cubHorn(story), () => nannyScene(), byId('cubbenah'));
}
async function nannyScene() {   /* Nanny is seen once, far off on the high rock, against the sky. She does not speak. */
  const ep = EP, P = PL.town, S = P.spots, n = byId('nanny'); stage = 24; best = Math.max(best, 24); refreshCast(); frozen = true; bars(true); goalText = ''; $('goal').textContent = '';
  for (const e of P.extras) if (!e.hidden && !e.far && e.m) e.ry0 = Math.atan2(S.rock[0] - e.x, S.rock[2] - e.z); for (const e of P.npcs) if (e.m && !e.far) e.m.rotation.y = Math.atan2(S.rock[0] - e.x, S.rock[2] - e.z);
  say(SAY.nanny1, 3600); const a = eyeNow(), rk = [S.rock[0], S.rock[1] + 1.2, S.rock[2]];
  await cut(a, [1, 1.5, 9], [0, 2, 0], rk, 3.5); if (ep !== EP) return; say(SAY.nanny2, 4200);
  await cut([1, 1.5, 9], [-1.5, 1.7, 6.5], rk, rk, 5, 40); if (ep !== EP) return; say(SAY.nanny3, 4600); await wait(4200); if (ep !== EP) return;
  endCut(); frozen = false; bars(false); state.x = 0.5; state.z = 6.5; state.yaw = 0; state.pitch = 0.12; setStage(24);
}

/* ---------- chapter 3: the watchers ---------- */
async function lookOut() {
  const ep = EP, P = P_(), S = P.spots; frozen = true; busy = false; bars(true); goalText = ''; $('goal').textContent = ''; S.redline.visible = true; say(SAY.look1, 4200);
  const a = eyeNow(), h = a[1], fs = S.far; await cut(a, [0.2, h + 0.5, 4.3], [-70, h - 34, 90], [30, h - 30, 120], 6); if (ep !== EP) return;
  say(SAY.look2, 4400); await cut([0.2, h + 0.5, 4.3], [0.4, h + 0.6, 4.5], [30, h - 30, 120], [fs[0], fs[1] - 3, fs[2]], 5, 21); if (ep !== EP) return;
  say(SAY.look3, 4200); SFX.hornCall(CALLS.danger.notes, { far: 0.85, pan: 0.5, pitch: 300 }); await wait(4200); if (ep !== EP) return;
  endCut(); bars(false); state.yaw = PI - 0.3; state.pitch = -0.25; setStage(32);
}
ON[32] = async () => {
  const ep = EP; if (cur !== 'watch') return; frozen = true; say(SAY.relay, 3200); await wait(2600); if (ep !== EP) return;
  const ok = await hornGame(['danger', 'ready'], { far: 0.7 }); if (ep !== EP) return; frozen = false; if (!ok) return;
  say(SAY.answer, 3600); SFX.hornsAnswer(CALLS.ready.notes, 5); unlock('horn'); await wait(3400); if (ep !== EP) return;
  PL.watch.spots.redline.visible = false; convo(TALK.cubRelay(story), () => setStage(33), byId('cubbenah3'));
};
ON[35] = () => { leavesUI(); };

/* ---------- chapter 4: the narrow path. The fight is a set piece seen from the watch rock: horns, smoke and noise, then the hillside full of people.
   Nobody is shown hurt and nobody falls. The soldiers turn and go back down. This fight is fictional (the journal says so): it shows the methods
   written down in 1739 for a Windward town (horns answering unseen, trenches with forked sticks, the bush cut away to show the hillside full of people). ---------- */
const FIGHT = { on: false, hold: false, sHead: 118, mode: 'idle', t: 0, next: 0, firing: 0 }, HALT = 40;   /* HALT: how far down the path (metres from its top) the first soldier stops, in plain view below the rock */
function fightIntro() { const c = CARDS.fight; card(c.title, c.paras, [{ t: c.go, go: () => { hideCard(); fightRun(); } }, { t: c.skip, go: () => { hideCard(); fightSkip(); } }], { col: true }); }
async function fightSkip() { const c = CARDS.fightRead; unlock('trenches'); unlock('attacks'); await infoCard(c); fightAfter(); }
function columnPlace(P, sHead, up, clip) {   /* the soldiers stand in single file on the path: the first at sHead, the others behind, 2.3 m apart */
  const S = P.spots; for (const n of P.extras) { if (n.column === undefined) continue; const s = sHead + n.column * 2.3, vis = s < S.sClimb - 1; n.scripted = true; n.cue = !vis; n.m.visible = vis && cur === 'watch'; if (!vis) continue;
    const [x, z, a] = pathAt(S.climb.dense, s); n.x = x; n.z = z; stand(n, P.G); n.m.rotation.y = up ? a + PI : a; if (n.clip !== clip) { n.clip = clip; n.ctl.play(clip === 'Idle' ? null : clip); } }
}
function fightTick(dt, t) {
  const P = PL.watch, S = P.spots, F = FIGHT; F.t += dt;
  if (F.mode === 'march') { F.sHead = Math.max(HALT, F.sHead - 2.6 * dt); columnPlace(P, F.sHead, true, F.sHead > HALT + 0.01 ? 'Walk' : 'Idle'); }
  else if (F.mode === 'halt') columnPlace(P, F.sHead, true, 'Idle');
  else if (F.mode === 'flee') { F.sHead += 3.4 * dt; columnPlace(P, F.sHead, false, 'Run'); }
  if (F.firing > 0 && F.t > F.next) {   /* guns from the bush (the Maroons stay unseen), and the soldiers firing back blind */
    F.next = F.t + 0.25 + Math.random() * 0.7 / F.firing; const fromBush = Math.random() < 0.6;
    if (fromBush) { const p = S.posts[(Math.random() * S.posts.length) | 0]; gunFlash(p[0], P.G.h(p[0], p[1]) + 1.3, p[1], 1.5); SFX.musket(0.35 + Math.random() * 0.3, clamp01(p[0] / 30) * 2 - 1); }
    else { const col = P.extras.filter((n) => n.column !== undefined && n.m.visible); if (col.length) { const n = col[(Math.random() * col.length) | 0]; gunFlash(n.x, n.m.userData.ground + 1.6, n.z, 1.3); SFX.musket(0.55 + Math.random() * 0.25, 0.3); } }
    FX.shake = Math.max(FX.shake, 0.12);
  }
  F.hold = !$('holdwrap').hidden; if (F.hold) { FX.low += ((HOLD.on ? 1 : 0) - FX.low) * Math.min(1, dt * 6); $('holdbar').firstElementChild.style.width = (FX.low * 100) + '%'; leavesUI(); }
}
async function fightRun() {
  const ep = EP, P = PL.watch, S = P.spots, F = FIGHT, live = () => ep === EP && F.on; setStage(42); F.on = true; F.sHead = 118; F.mode = 'march'; F.firing = 0; F.t = 0; F.next = 0; frozen = false; moveLock = true; busy = false; talkWith = null; bars(true); goalText = ''; $('goal').textContent = ''; $('hint').hidden = true;
  const VIEW = () => { state.yaw = PI - 0.3; state.pitch = -0.62; }; state.x = S.place[0]; state.z = S.place[1]; VIEW(); unlock('trenches');
  say(SAY.f1, 4200); const eye = eyeNow(), h = eye[1]; await wait(3600); if (!live()) return;
  /* shot 1: down the path, as the red coats come out of the mist in single file */
  say(SAY.f2, 4600); SFX.drumMarch(4, 0.1, 0.3); await cut([3, h + 2.2, 5.4], [4.6, h + 1.3, 6.2], [14, -41, 76], [8, -33, 56], 10, 30); if (!live()) return;
  say(SAY.f3, 4200); SFX.trumpet(0.12, 0.3); SFX.drumMarch(3, 0.13, 0.3); await cut([4.6, h + 1.3, 6.2], eye, [8, -33, 56], [12, -26, 40], 5); if (!live()) return; endCut(); VIEW();
  if (!(await waitFor(() => F.sHead <= HALT + 0.01))) return; F.mode = 'halt';
  /* the first call: horns answer from every side, and nobody can be seen (Thicknesse, 1788: "not a man of them was to be seen") */
  say(SAY.f4, 2800); const cb = byId('cubbenah3'); if (cb && cb.ctl) cb.ctl.play('Point', true); await wait(2400); if (!live()) return;
  frozen = true; if (!(await hornGame(['now']))) return; frozen = false; if (!live()) return;
  say(SAY.f5, 5200); SFX.hornsAnswer(CALLS.now.notes, 6); await wait(4600); if (!live()) return;
  say(SAY.f6, 3800); for (const n of P.extras) if (n.column !== undefined && n.m.visible && n.column % 3 === 1 && CL.Terrified) { n.clip = 'Terrified'; n.ctl.play('Terrified'); } await wait(3400); if (!live()) return;
  /* smoke and thunder: guns from the bush, the soldiers fire back at nothing. You may stay low behind the rock. */
  say(SAY.f7, 4600); F.firing = 1; $('holdwrap').hidden = false; $('hold').textContent = 'Stay low!'; ctr.goal = 'Stay low behind the rock.'; refreshGoal(); await wait(5200); if (!live()) return;
  F.firing = 1.8; SFX.rustle(0.14, -0.4); await cut(eyeNow(), [10, h + 3.5, 7], [8, -22, 32], [18, -26, 40], 7, 50); if (!live()) return; endCut(); VIEW();
  await wait(2600); if (!live()) return; F.firing = 0.5; $('holdwrap').hidden = true; FX.low = 0; leavesUI();
  /* the second call: the bush is cut away, and the hillside is full of people (Thicknesse and Dallas, on Quao's town in 1739) */
  say(SAY.f8, 2800); if (cb && cb.ctl) cb.ctl.play('Point', true); await wait(2400); if (!live()) return;
  frozen = true; F.firing = 0; if (!(await hornGame(['all']))) return; frozen = false; if (!live()) return;
  SFX.chop(); say(SAY.f9, 5200); SFX.hornsAnswer(CALLS.all.notes, 4);
  tween(1.1, (k) => { for (const c of S.cover) { c.scale.y = 1 - 0.94 * ease(k); c.rotation.z = 0.5 * ease(k); } }).then(() => { for (const c of S.cover) c.visible = false; });
  for (const n of P.extras) if (n.fighter !== undefined) { n.cue = false; n.hidden = false; n.m.visible = true; } await wait(700); if (!live()) return;
  for (const n of P.extras) if (n.fighter !== undefined && CL.Cheer) n.ctl.play(n.fighter % 2 ? 'Cheer' : 'Wave'); SFX.cheer(0.16);
  await cut([16, h + 6, 5], [26, h + 2, 12], [6, -22, 34], [14, -27, 42], 8, 52); if (!live()) return;
  /* the soldiers turn and go back down the mountain */
  say(SAY.f10, 4800); F.mode = 'flee'; SFX.cheer(0.2); SFX.drumTap(0.1, 0.3); await cut([26, h + 2, 12], [8, h + 2, 7], [14, -27, 42], [6, -37, 66], 8, 44); if (!live()) return;
  await cut([8, h + 2, 7], eye, [6, -37, 66], [10, -30, 50], 3.5); if (!live()) return; endCut(); VIEW();
  say(SAY.f11, 4200); chirp(); await wait(2200); if (!live()) return; chirp(); for (const n of P.extras) if (n.fighter !== undefined) n.ctl.play(null);
  await wait(2200); if (!live()) return; F.on = false; F.mode = 'idle'; moveLock = false; bars(false); for (const n of P.extras) if (n.column !== undefined) { n.cue = true; n.m.visible = false; }
  await infoCard(CARDS.fightEnd); if (ep !== EP) return; fightAfter();
}
function fightAfter() { FIGHT.on = false; moveLock = false; frozen = false; bars(false); delete ctr.goal; unlock('attacks'); const P = PL.watch; for (const n of P.extras) if (n.column !== undefined) { n.cue = true; if (n.m) n.m.visible = false; } setStage(43); state.x = -0.6; state.z = 0.6; state.yaw = PI * 0.75; }

/* ---------- chapter 5: 1734, the guns in the night. You wake the row, find Phibba, and climb the back trail while the small cannon fire far behind you. ---------- */
const GUNS = { on: false, t: 0, next: 0, n: 0 };
ON[50] = () => { if (cur !== 'town') return; say(SAY.n1, 3600); SFX.hornCall('SSS', { far: 0.35, pan: -0.3, pitch: 330 }); setTimeout(() => SFX.hornCall('SSS', { far: 0.6, pan: 0.5, pitch: 300 }), 2200 * TS); };
ON[54] = () => { const p = byId('phibba'); if (!p) return; p.ctl.base = p.ctl.get('Idle') || p.ctl.base; p.ctl.play(null); follow(p, FOLLOW.phibba); };   /* she stops crying and comes with you: a step behind and to one side, never pressed against you (engine/follow.js) */
function gunsIntro() { const c = CARDS.guns; card(c.title, c.paras, [{ t: c.go, go: () => { hideCard(); gunsRun(); } }, { t: c.skip, go: () => { hideCard(); infoCard(CARDS.gunsRead).then(() => ridgeDawn(true)); } }], { col: true }); }
function gunsRun() {
  const P = PL.town, S = P.spots; GUNS.on = true; GUNS.t = 0; GUNS.next = 1.2; GUNS.n = 0; ctr.climb = 1; ctr.goal = 'Climb the back trail. Do not stop.'; refreshGoal(); unlock('fall'); S.guns.forEach((g) => { g.visible = true; }); say(SAY.n2, 3800);
  P.extras.filter((e) => e.flee && e.m).forEach((e, i) => { const [x, z] = pathAt(S.back.dense, 2 + i * 2.6); e.x = x; e.z = z; lead(e, S.back.dense, FOLLOW.flee(i)); });
  const m = byId('mama5'); if (m) lead(m, S.back.dense, FOLLOW.mama5);
}
function gunsTick(dt, t) {
  const P = PL.town, S = P.spots, sP = pathS(S.back.dense, state.x, state.z); GUNS.t += dt;
  if (GUNS.t > GUNS.next) { GUNS.next = GUNS.t + 2.6 + Math.random() * 1.6; const g = S.guns[GUNS.n % 2], mz = g.userData.muzzle, w = g.localToWorld(new THREE.Vector3(...mz)); gunFlash(w.x, w.y, w.z, 3.2, 3); SFX.swivelBoom(clamp01(Math.hypot(state.x - w.x, state.z - w.z) / 120), 0.4); FX.shake = 0.5; flash(0.22, 40, '#ffb060'); setTimeout(() => flash(0, 260, '#ffb060'), 70);
    if (GUNS.n < S.burn.length) S.burn[GUNS.n].visible = true; GUNS.n++; if (GUNS.n === 1) say(SAY.n3, 3200); }
  S.fireLight.intensity = Math.min(260, GUNS.n * 34) * (0.8 + Math.sin(t * 9) * 0.1 + Math.sin(t * 23) * 0.08);
  for (const b of S.burn) if (b.visible) { b.scale.set(4.2 + Math.sin(t * 9 + b.position.x) * 0.6, 5.4 + Math.sin(t * 6.3 + b.position.z) * 0.9, 1); if (Math.random() < dt * 1.6) smoke.emit(b.position, new THREE.Vector3(0.6, 2.2 + Math.random(), 0.3), { size: 2.4, grow: 9, life: 7, color: 0x4a403c, opacity: 0.5 }); }
  if (!ctr.n4 && sP > S.sBack * 0.3) { ctr.n4 = 1; say(SAY.n4, 3800); } if (!ctr.n5 && sP > S.sBack * 0.6) { ctr.n5 = 1; say(SAY.n5, 3800); }
  if (sP >= S.sBack - 2.4 && !ctr.top) { ctr.top = 1; ridgeDawn(false); }
}
async function ridgeDawn(skipped) {   /* the top of the back trail: the sun comes up, and you look back once */
  const ep = EP, P = PL.town, S = P.spots; frozen = true; busy = false; bars(true); goalText = ''; $('goal').textContent = ''; unlock('fall');
  if (skipped) { fadeBlack(true, 500); await wait(700); if (ep !== EP) return; S.burn.forEach((b) => { b.visible = true; }); }
  GUNS.on = false; S.guns.forEach((g) => { g.visible = false; }); const p = byId('phibba'); if (p) stopFollow(p);
  stage = 55; best = Math.max(best, 55); refreshCast(); arriveRidge(false); if (skipped) fadeBlack(false, 900);
  say(SAY.n6, 4600); const e1 = envTo(ENV.dawn, 9), a = eyeNow(), h = a[1];
  await cut(a, [a[0] + 1.5, h + 1.2, a[2] + 1], [a[0] - 40, h + 20, a[2] - 40], [a[0] + 30, h - 6, a[2] + 20], 7); if (ep !== EP) return;
  say(SAY.n7, 5000); await cut([a[0] + 1.5, h + 1.2, a[2] + 1], [a[0] + 4, h + 2.4, a[2] + 3.5], [a[0] + 30, h - 6, a[2] + 20], [0, 2, 0], 7, 34); if (ep !== EP) return; await e1; await wait(1200); if (ep !== EP) return;
  endCut(); bars(false); S.fireLight.intensity = 0; await infoCard(CARDS.real1734); if (ep !== EP) return; frozen = false; setStage(55);
}
function arriveRidge(quiet) { const P = PL.town, S = P.spots; state.x = S.ridge[0] + 1.6; state.z = S.ridge[2] + 1.4; state.yaw = -2.2; state.pitch = -0.12; S.burn.forEach((b) => { b.visible = true; }); S.hearth.intensity = 0; if (P.fire.userData.flame) P.fire.userData.flame.visible = false; if (quiet) { setEnv(ENV.dawn); S.fireLight.intensity = 0; } }

/* ---------- chapter 6: the paper, and today ---------- */
ON[60] = () => { if (cur === 'newtown') say(SAY.t1, 4200); };
ON[63] = async () => {
  const ep = EP; if (cur !== 'newtown') return; frozen = true; busy = false; bars(true); say(SAY.t2, 4600); const e1 = envTo(ENV.gold, 6), a = eyeNow(), h = a[1];
  await cut(a, [4, h + 5, 14], [0, 1, 0], [-9, 6, -37], 7); if (ep !== EP) return; await e1; endCut(); bars(false);
  unlock('hero'); unlock('mooretown'); await infoCard(CARDS.today); if (ep !== EP) return;
  const c = CARDS.why; card(c.title, c.paras, c.choices.map(([k, t]) => ({ t, go: () => { story.why = k; saveGame(); hideCard(); frozen = false; setStage(64); } })), { col: true });
};
ON[64] = () => { unlock('hero'); unlock('mooretown'); unlock('journey'); const c = CARDS.end; setTimeout(() => card(c.title, c.paras, [{ t: 'Read your journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : []), { t: 'Stay here', go: hideCard }], { col: true }), 1200 * TS); cue('end'); };

/* ---------- the helper arrow: stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
const ahead = (dense, d = 9) => { const [x, z] = pathAt(dense, Math.min(pathLength(dense), pathS(dense, state.x, state.z) + d)); return [x, z]; };
const NUDGE_EXTRA = { 11: () => ahead(PL.estate.spots.trail.dense), 12: () => ahead(PL.estate.spots.trail.dense), 13: () => ahead(PL.estate.spots.trail.dense), 20: () => ahead(PL.town.spots.pathIn.dense), 53: () => [PL.town.spots.tree[0] + 2, PL.town.spots.tree[1] - 1.4] };
function nudgeTarget() {
  const P = P_(); if (!P) return null; if (ctr.climb && cur === 'town') return ahead(P.spots.back.dense); if (NUDGE_EXTRA[stage]) return NUDGE_EXTRA[stage](); const a = P.actions.find((x) => x.on()); if (a) return [a.x, a.z];
  let bestT = null, bd = 1e9; for (const n of P.people) if (n.m && n.m.visible && wantsTalk(n)) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; bestT = [n.x, n.z]; } } return bestT;
}
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return; const quiet = state.started && !busy && !frozen && !DIR.on && !FIGHT.on && !HORN.on && $('holdwrap').hidden && $('dialogue').hidden && $('card').hidden && $('place').style.opacity !== '1' && !document.body.classList.contains('subbing') && goalText && !fading;
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz) > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = now; NUDGE.on = false; } /* Never display guidance over a panel or dialogue. */
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && tgt && now - NUDGE.since >= 2500) { NUDGE.on = true; showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); }
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 2.2) { NUDGE.on = false; /* Nearby interaction takes over; do not restart the hint delay. */ }
  el.hidden = true; if (!GUIDE) GUIDE = createGuide({ scene, camera, ground: (x, z) => groundAt(x, z) });
  if (!NUDGE.on || !tgt) { GUIDE.hide(now); return; }
  GUIDE.point(now, { x: tgt[0], z: tgt[1] });   /* a gold arrow on the ground points the way, a gold ring marks the place */
}
let GUIDE = null;

/* ---------- sound: each place has its own mix, and now and then one small sound ---------- */
let auNext = 0, onceAt = 6; const AMB = 0.42;
const SOUNDSCAPE = { estate: { wind: 0.05, cricket: 0.2, once: () => (Math.random() < 0.5 ? SFX.frog(0.05, Math.random() - 0.5) : SFX.owl(0.08, Math.random() - 0.5)) }, town: { wind: 0.1, crowd: 0.06, once: chirp }, watch: { wind: 0.16, once: chirp }, newtown: { wind: 0.06, crowd: 0.07, stream: 0.1, once: chirp } };
function audioTick(t) {
  if (!AU.ctx || t < auNext) return; auNext = t + 0.1; const S = SOUNDSCAPE[cur] || {}, night = envNow.stars > 0.5, P = P_();
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], (k === 'crowd' && night ? 0.02 : S[k] || 0) * AMB);
  let stream = S.stream || 0, fire = 0; if (cur === 'estate') stream = 0.3 * clamp01(1 - Math.abs(state.z + 13.5) / 16); if (cur === 'newtown') stream = 0.08 + 0.25 * clamp01(1 - Math.abs(state.x - 27) / 18);
  if (cur === 'town') fire = 0.2 * clamp01(1 - Math.hypot(state.x + 3, state.z - 3) / 9) + (GUNS.on ? 0.12 : 0); if (cur === 'newtown') fire = 0.2 * clamp01(1 - Math.hypot(state.x + 5, state.z - 5.4) / 9);
  SFX.setBeds({ stream: stream * 0.5, fire: fire * 0.6, cricket: (night ? (S.cricket || 0.14) : 0) * 0.45, rumble: GUNS.on ? 0.25 : FIGHT.firing > 0 ? 0.12 : 0 });
  if (fire > 0.05 && Math.random() < 0.25) crackle();
  if (t > onceAt) { onceAt = t + 6 + Math.random() * 6; if (AU.on && state.started && !FIGHT.on && !HORN.on) { if (night && cur === 'town') SFX.frog(0.04, Math.random() - 0.5); else if (S.once) S.once(); } }
}

/* ---------- loading and starting ---------- */
applySave(loadGame());
{ let done = 0; const total = 3, tick = () => { done++; $('bar').style.width = (done / total * 100) + '%'; };
  buildPlace('watch'); enterPlace('watch', { env: ENV.dawn });   /* the watch rock at dawn, as the picture behind the title */
  const first = CH_PLACE[hasSave && stage >= 10 ? chapterOf(stage) : 0];
  model('anims').then((an) => { loadClips(an); tick(); return Promise.all([ensurePlace(first), ensurePlace('watch')]); }).then(() => { prepareTitleScene(); tick(); modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; tick();
    if (__DEV__) devViews(); }); }
/* The title borrows the watch scene without starting a chapter or changing the save. */
function prepareTitleScene() {
  const P = PL.watch; enterPlace('watch', { keepPos: true, env: ENV.haze });
  columnPlace(P, 86, true, 'Idle');
  camera.position.set(4, groundAt(0.2, 2.3) + EYE + 1.6, 6); camera.lookAt(9, -39, 65); camera.rotation.reorder('YXZ');
  P.titleView = { x: camera.position.x, y: camera.position.y, z: camera.position.z, pitch: camera.rotation.x, yaw: camera.rotation.y };
  FOV = 20; resize();
  // On touch devices the static title image avoids iOS WebGL sky artifacts.
  if (!isTouch) $('title').classList.add('live-scene');
}
async function backgroundLoad() { for (const id of ['town', 'watch', 'newtown', 'estate']) { await ensurePlace(id); await wait(500); } }
function startGame(quiet) {
  if (state.started) return; FOV = 66; resize(); audioInit(); SFX.initBeds(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk or use.'; showHint(); canvas.focus(); if (!quiet) cue('begin');
}
$('start').onclick = () => { startGame(); const st = stage >= 10 ? (SAFE[stage] || stage) : 10; beginChapter(hasSave && stage >= 10 ? chapterOf(stage) : 0, hasSave && stage >= 10 ? st : 10); setTimeout(backgroundLoad, 5000); };

/* ---------- the frame loop ---------- */
let stepT = 0, frameN = 0, camY = 0;
function update(dt, now) {
  if (!state.started && titleMotion.matches) dt = 0;
  const P = P_(); if (!P) return; const t = (now || 0) / 1000;
  if (DIR.on) { DIR.t += dt; if (DIR.t >= DIR.dur && DIR.resolve) { const r = DIR.resolve; DIR.resolve = null; r(true); } }
  if (state.started && !busy && !frozen && !DIR.on) {
    if (keys.has('arrowleft') && !HORN.on) state.yaw += 1.8 * dt; if (keys.has('arrowright') && !HORN.on) state.yaw -= 1.8 * dt;
    if (!moveLock) { let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
      if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1; const len = Math.hypot(f, r);
      if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.3) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
        [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt); stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; stepSound(cur === 'estate' && state.z < -11.2 && state.z > -15.9 ? 'water' : 'grass'); } } }
  }
  if ((frameN & 7) === 0) for (const n of P.extras) { if (n.scripted) continue; const d = Math.hypot(state.x - n.x, state.z - n.z); n.m.visible = (n.far || d < 70) && !n.hidden && !n.cue; }
  for (const n of P.npcs) npcTick(n, dt);
  near = null; if (state.started && !busy && !frozen && !DIR.on && !HORN.on) { let b = 2.6; for (const n of P.people) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && n.m.visible && d < b) { b = d; near = n; } } for (const a of P.actions) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }
  const tb = $('talk'); tb.hidden = !(near && near.go); if (near && near.go) tb.textContent = near.label;
  for (const n of P.npcs) if (n.m.visible && n.ctl) { n.ctl.mx.update(dt); n.ctl.tick(dt); if (n.m.userData.grips) gripTick(n.m); }
  frameN++; for (const m of P.bodies) if (m.visible) groundFeet(m);   /* every frame: on a slope, every other frame shows as a bounce */
  if (P.tick) P.tick(dt, t); if (P.waters) for (const w of P.waters) w.userData.flow(dt); mist.tick(dt); smoke.tick(dt); fxTick(dt);
  if (P.smokers && (frameN & 15) === 0 && !envNow.stars) for (const s of P.smokers) if (Math.random() < s.rate * 0.3) smoke.emit(_p.set(s.x, groundAt(s.x, s.z) + s.y, s.z), new THREE.Vector3(0.25 + Math.random() * 0.2, s.mist ? 0.4 : 0.9, 0.1), { size: s.mist ? 2.2 : 0.5, grow: s.mist ? 5 : 2.6, life: s.mist ? 4 : 5, color: s.mist ? 0xffffff : 0xcfcfc8, opacity: s.mist ? 0.3 : 0.32 });
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](dt)) TICKS.splice(i, 1);
  if (cur === 'estate' && state.started) estateTick(dt); if (cur === 'town') townTick(dt, t); if (FIGHT.on) fightTick(dt, t);
  if (now !== undefined) { audioTick(t); bubbleTick(t); stickUI(); nudgeTick(now); }
}
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t); const P = P_(), s = t / 1000;
  if (DIR.on) { const k = ease(Math.min(1, DIR.t / DIR.dur)); camera.position.lerpVectors(DIR.a, DIR.b, k); _v.lerpVectors(DIR.la, DIR.lb, k); camera.lookAt(_v); const f = lerp(DIR.f0, DIR.f1, k); if (Math.abs(f - FOV) > 0.05) { FOV = f; resize(); } }
  else if (!state.started && P && P.titleView) { const tv = P.titleView, time = titleMotion.matches ? 0 : s; camera.position.set(tv.x - Math.sin(time * 0.08) * 1.6, tv.y, tv.z); camera.rotation.set(tv.pitch, tv.yaw + Math.sin(time * 0.05) * 0.05, 0, 'YXZ'); }
  else { const gy = groundAt(state.x, state.z); camY += (gy - camY) * Math.min(1, dt * 14); if (Math.abs(gy - camY) > 1.5) camY = gy; camera.position.set(state.x, camY + EYE - FX.low * 0.55, state.z); camera.rotation.set(state.pitch, state.yaw, FX.roll, 'YXZ'); }
  if (FX.shake > 0) { const k = FX.shake; camera.position.x += (Math.random() - 0.5) * k * 0.07; camera.position.y += (Math.random() - 0.5) * k * 0.07; camera.position.z += (Math.random() - 0.5) * k * 0.07; camera.rotation.z += (Math.random() - 0.5) * k * 0.03; }
  const cp = camera.position; sun.target.position.set(cp.x, cp.y - 1.3, cp.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 120);
  sky.dome.position.copy(cp); sky.stars.position.copy(cp); sky.clouds.position.copy(cp); sky.moon.position.set(cp.x - 190, cp.y + 230, cp.z - 380); sunDisc.position.copy(cp).addScaledVector(sunDir, 430);
  ridges.group.position.x = cp.x; ridges.group.position.z = cp.z; mist.group.position.x = cp.x; mist.group.position.z = cp.z; flies.tick(s, envNow.stars > 0.5 && !!P && !!P.night, cp.x, cp.y - 1.4, cp.z);
  if (__DEV__ && MV) { MV(); return; }
  // Leave the phone title on its stable image until gameplay begins.
  if (!NORENDER && (state.started || !isTouch)) renderer.render(scene, camera);
}
let MV = null;   /* dev only: the model viewer (?shot=model) draws the picture itself */
const NORENDER = __DEV__ && /[?&]auto=/.test(location.search);   /* the scripted playthrough does not need pictures, and software drawing is slow */
requestAnimationFrame(frame);

/* ---------- the place audit (dev builds): the checks live in engine/audit.js. Run ?test=audit and expect 0 issues in every place.
   A place holds different people in different chapters, so it is checked once for each set of people who are there together.
   Two checks are added for land with heights: everyone must stand on the ground (not above or below it), and nobody may stand in a tree, a hut or a fire.
   People inside solid things are checked against the real shapes (engine/audit.js, auditBodies): where each person stands, at their own height (a child is small),
   along every route a guide, a follower or a runner takes (auditRoutes), and over all the ground you can walk on, because a follower such as Phibba goes wherever you go. ---------- */
const tallOf = (n) => { if (n.tall) return n.tall; const hd = n.m.getObjectByName('mixamorigHead'); n.m.updateMatrixWorld(true); const y = hd ? hd.getWorldPosition(new THREE.Vector3()).y - (n.m.userData.ground || 0) + 0.14 : 1.65 * n.m.scale.y; return (n.tall = Math.max(0.8, Math.min(2.0, y))); };
const bodyR = (n) => Math.max(0.11, Math.min(0.2, 0.18 * tallOf(n) / 1.7));
function auditRoutes(P) {   /* the routes people walk in each place, with the stages when they walk them. The numbers are the scenes' own (FOLLOW, HALT). */
  const S = P.spots, out = [], who = (id) => P.npcs.find((n) => n.id === id), sOf = (path, n) => pathSE(path, n.hx, n.hz), R = (n, what, pts, when) => { if (n) out.push({ id: n.id || n.base, what, pts, when, h: tallOf(n), r: bodyR(n) }); };
  if (P.id === 'estate') { const q = who('quamin'), m = who('mama'); R(q, 'leads you', pathSpots(S.trail.dense, sOf(S.trail.dense, q), S.top - 1, FOLLOW.quamin.side), [11, 14]); R(m, 'follows you', pathSpots(S.trail.dense, sOf(S.trail.dense, m), S.top - 1.9, FOLLOW.mama.side), [11, 14]); }
  if (P.id === 'town') { const end = S.pathIn.dense[S.pathIn.dense.length - 1];
    R(who('quaminT'), 'leads you', pathSpots(S.pathIn.dense, 5, S.sIn), [20, 21]); R(who('mamaT'), 'follows you', pathSpots(S.pathIn.dense, 0.4, S.sIn), [20, 21]);
    for (const n of [who('quaminT'), who('mamaT')]) { const r = walkRoute([end[0], end[1]], [n.hx, n.hz], P.solidBoxes, 0.22, P.bounds); R(n, 'walks home', [[end[0], end[1]], ...(r.length ? r : [[n.hx, n.hz]])], [21, 21]); }
    const m5 = who('mama5'); R(m5, 'leads you', pathSpots(S.back.dense, sOf(S.back.dense, m5), S.sBack, FOLLOW.mama5.side), [54, 54]);
    P.extras.filter((e) => e.flee).forEach((e, i) => { R(e, 'runs up the trail', pathSpots(S.back.dense, 2 + i * 2.6, S.sBack, FOLLOW.flee(i).side), [54, 54]); out[out.length - 1].id += '#' + i; }); }
  if (P.id === 'watch') { const n = P.extras.find((e) => e.column === 3); R(n, 'marches', pathSpots(S.climb.dense, HALT, S.sClimb), [41, 42]); }
  return out;
}
function auditPlace(P) {
  const marks = [...new Set(P.npcs.filter((n) => n.when).map((n) => n.when[0]).concat(auditRoutes(P).map((r) => r.when[0])))].sort((a, b) => a - b), phases = marks.length ? marks : [0], out = { floating: [], inside: [], stuck: [] }, seen = new Set(), add = (k, l) => { if (!seen.has(l)) { seen.add(l); out[k].push(l); } };
  const hides = new Set(((P.spots && P.spots.cover) || []).map((c) => c.uuid)), bodySkip = (e) => hides.has(e.top);   /* the bushes the Maroons hide in on purpose (chapter 4) */
  for (const st of phases) { const here = P.npcs.filter((n) => !n.when || (st >= n.when[0] && st <= n.when[1])), routes = auditRoutes(P).filter((r) => st >= r.when[0] && st <= r.when[1]);
    const r = auditPlaceE({ id: P.id, snap: P.snap, groundAt: (x, z) => P.G.h(x, z), npcs: here.map((n) => ({ id: n.id || n.base, x: n.column !== undefined ? n.x : n.hx, z: n.column !== undefined ? n.z : n.hz, anim: n.anim, ground: n.m.userData.ground || 0, path: n.path, fixedGround: n.fixedGround, h: tallOf(n), r: bodyR(n) })), routes, bodySkip, walls: P.walls, bounds: P.bounds, start: P.start, actions: P.actions, people: here.filter((n) => !n.extra).map((n) => ({ id: n.id, x: n.hx, z: n.hz, anim: n.anim })) });
    /* The engine calls everywhere you may not walk a "walking wall". Here that is open hillside, and background figures stand on it on purpose (the Maroons beside the path).
       So that one line is kept only for people you talk to; they are also checked just below against the ground you can walk on. */
    const bg = new Set(here.filter((n) => n.extra).map((n) => n.id || n.base));
    for (const k of ['floating', 'inside', 'stuck']) for (const l of r[k]) if (!(/inside a walking wall/.test(l) && bg.has(l.split('@')[0]))) add(k, l);
    for (const n of here) { const id = n.id || n.base, sx = n.column !== undefined ? n.x : n.hx, sz = n.column !== undefined ? n.z : n.hz, gy = P.G.h(sx, sz); if (!n.fixedGround && Math.abs((n.m.userData.ground || 0) - gy) > 0.06) add('inside', `${id}@(${sx.toFixed(1)},${sz.toFixed(1)}) is ${(((n.m.userData.ground || 0) - gy) * 100).toFixed(0)} cm off the ground`);   /* the soldiers in the column are always placed by the scene (columnPlace, and the title's march): judge them where they stand */
      for (const s of P.solids) if (Math.hypot(s[0] - n.hx, s[1] - n.hz) < s[2] * 0.8) add('inside', `${id}@(${n.hx.toFixed(1)},${n.hz.toFixed(1)}) stands in a solid thing at (${s[0].toFixed(1)},${s[1].toFixed(1)})`);
      if (!n.extra && !P.G.walkable(n.hx, n.hz, -0.3)) add('stuck', `person ${id} stands off the ground you can walk on`);
      for (const o of here) if (o !== n && here.indexOf(o) > here.indexOf(n) && Math.abs((o.m.userData.ground || 0) - (n.m.userData.ground || 0)) >= 0.3 && Math.hypot(o.hx - n.hx, o.hz - n.hz) < 0.65) add('inside', `${id} and ${o.id || o.base} are ${(Math.hypot(o.hx - n.hx, o.hz - n.hz) * 100).toFixed(0)} cm apart on a slope`); } }
  /* all the ground you can walk on, every 50 cm, outside the footprints that keep you (and anyone following you) out of huts, fires, rocks and trees: nothing solid may stand there */
  const B = P.bounds, open = []; for (let x = B.x0; x <= B.x1; x += 0.5) for (let z = B.z0; z <= B.z1; z += 0.5) if (P.G.walkable(x, z, 0.1) && !P.solids.some((s) => Math.hypot(s[0] - x, s[1] - z) < s[2])) open.push({ id: 'open ground', x, z, ground: P.G.h(x, z), h: 1.6, r: 0.14, what: 'is' });
  for (const l of auditBodies(P.snap.concat(P.snap.inst || []), open, { skip: bodySkip })) add('inside', l);
  if (P.id === 'town' && 8 + P.spots.farHuts <= 140) add('stuck', `the town shows ${8 + P.spots.farHuts} houses: the story says over 140 (Jamaica National Heritage Trust)`);
  return { id: P.id, ...out };
}

/* ---------- test views and scripted playthroughs: dev builds only (node tools/build.mjs nanny --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), errs = [];
  addEventListener('error', (e) => { errs.push(e.message); document.title = 'ERROR ' + errs.join(' | '); });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.title = 'ERROR ' + errs.join(' | '); });
  const go = async (id, st, x, z, yaw, pitch, env) => { const P = await ensurePlace(id); $('title').hidden = true; $('hud').hidden = false; state.started = true; stage = st; best = Math.max(best, st); enterPlace(id, { env: env || CH_ENV[chapterOf(st)] }); resetScenery(P, chapterOf(st), st); state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); refreshGoal(); leavesUI(); return P; };
  const V = {
    est1: ['estate', 10, 2, 38.4, 0.4, 0], est2: ['estate', 12, -2.4, 15.5, 0.1, 0], est3: ['estate', 13, 4, -9, 0.1, -0.05], est4: ['estate', 13, -5, -40, -0.3, 0.1], est5: ['estate', 14, 6, -63.5, 0.4, 0.06, ENV.dawn], est6: ['estate', 10, 6, 36, 2.6, 0.05],
    town1: ['town', 20, 37, 58, 0.3, 0.25], town2: ['town', 20, 44, 28, 1.2, 0.2], town3: ['town', 21, 5, 9.5, 0.6, 0.05], town4: ['town', 21, -8, 9, -0.9, 0.05], town5: ['town', 22, -15.5, 3, 1.3, -0.1], town6: ['town', 24, 0.5, 8, 0, 0.3], town7: ['town', 21, 10, -11, 2.3, 0.1], town8: ['town', 21, 0, -12, 3.14, -0.05], hut1: ['town', 21, 11.6, 4.6, -1.35, 0.08],
    night1: ['town', 50, -4.6, 8.8, 1.0, 0], night2: ['town', 53, 4, -2, -2.2, 0.05], night3: ['town', 54, -30, -27, -2.3, 0.3], ridge1: ['town', 55, -62.4, -59.6, -2.2, -0.2, ENV.dawn], ridge2: ['town', 55, -62.4, -59.6, -0.9, 0.0, ENV.dawn],
    watch1: ['watch', 30, -1.2, -2.6, PI, -0.1], watch2: ['watch', 30, 0.2, 4.0, PI - 0.3, -0.6], watch3: ['watch', 33, -27, 9, 2.6, -0.25], watch4: ['watch', 34, -10.4, 1.6, 1.3, 0], watch7: ['watch', 30, 0.2, 4.0, PI - 0.3, -0.2], watch5: ['watch', 43, -1.5, -2.5, PI, -0.05], watch6: ['watch', 30, -3, -4, PI - 0.5, 0.05, ENV.dawn],
    new1: ['newtown', 60, 0.5, 9.5, 0.1, 0], new2: ['newtown', 61, 2.6, -2.2, -0.35, -0.5], new3: ['newtown', 60, 8, 0, 1.2, 0.05], new4: ['newtown', 60, 0, -11, 0.2, 0.08], new5: ['newtown', 60, 20, 6, -1.6, 0],
  };
  /* ?shot=model&ids=mama,quamin : people lined up for a close look. &lo for light copies, &hold=musket, &anim=Walk, &a= turns them, &d= camera distance */
  if (shot === 'model') go('newtown', 60, 0, 0, 0, 0).then(async (P) => {
    const pids = (q.get('ids') || 'mama,quamin').split(','), plo = q.has('lo'); await Promise.all(pids.map((id) => loadBase(LOOKS[id].base + (plo ? '_lo' : '')))); P.group.visible = false; $('hud').hidden = true; mist.group.visible = false; ridges.group.visible = false;
    const num = (k, d) => (q.has(k) ? +q.get(k) : d), root = new THREE.Group(); scene.add(root); const gr = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x8a9a7c, roughness: 1 })); gr.rotation.x = -PI / 2; gr.receiveShadow = true; root.add(gr);
    pids.forEach((id, i) => { const b = makeBody({ ...LOOKS[id], bodyId: LOOKS[id].base + (plo ? '_lo' : ''), x: (i - (pids.length - 1) / 2) * 0.8, z: 0, ry: 0, ground: 0, anim: q.get('anim') || 'Idle', props: q.get('hold') ? [['RightHand', q.get('hold')]] : LOOKS[id].props, cloak: q.has('cloak'), fine: !q.has('plain') }); b.userData.anim.mx.update(+(q.get('at') || 0.4)); gripTick(b); groundFeet(b); root.add(b); });
    const a0 = num('a', 0.5), d = num('d', 3.4), hh = num('h', 1.3), ty = num('t', 1.0), one = q.has('one');
    MV = () => { const W = renderer.domElement.width, Hh = renderer.domElement.height, angs = one ? [a0] : [a0, a0 + 1.35, a0 + PI, a0 + PI + 1.1], pr = renderer.getPixelRatio(); renderer.setScissorTest(true);
      angs.forEach((a, i) => { const w = one ? W : W / 2, h2 = one ? Hh : Hh / 2, x = one ? 0 : (i % 2) * w, y = one ? 0 : (1 - (i >> 1)) * h2; renderer.setViewport(x / pr, y / pr, w / pr, h2 / pr); renderer.setScissor(x / pr, y / pr, w / pr, h2 / pr);
        camera.aspect = w / h2; camera.fov = 40; camera.updateProjectionMatrix(); camera.position.set(-Math.cos(a) * d, hh, Math.sin(a) * d); camera.lookAt(0, ty, 0); sun.target.position.set(0, 0, 0); sun.position.copy(sunDir).multiplyScalar(110); sun.target.updateMatrixWorld(); renderer.render(scene, camera); }); document.title = 'MODEL ' + pids.join(','); };
  });
  if (shot === 'title') { /* the title screen as it loads */ }
  if (shot === 'talk1') go('estate', 10, 2, 40.2, 0.6, 0).then(() => { startTalk(byId('mama')); });
  if (shot === 'talk2') go('newtown', 62, 0.6, -1.4, -0.4, 0).then(() => { startTalk(byId('beneba6')); nextLine(); });
  if (shot === 'card1') go('watch', 41, 0.2, 2.3, PI, -0.3).then(() => { fightIntro(); });
  if (shot === 'paper') go('newtown', 61, 2.6, -2.2, -0.35, -0.5).then((P) => { P.actions[0].go(); });
  if (shot === 'journal1') go('town', 21, 5, 9.5, 0.6, 0).then(() => { for (const id of ['town', 'path', 'nanny', 'patent']) unlock(id, true); openJournal('patent'); });
  if (shot === 'chap1') go('town', 21, 5, 9.5, 0.6, 0).then(() => { best = 35; modelsReady = true; openChapters(); });
  if (shot === 'horn') go('town', 23, 8, 2.6, 1.2, 0).then(() => { hornLesson(); });
  if (shot === 'nanny') go('town', 23, 8, 2.6, 1.2, 0).then(async () => { nannyScene(); for (let i = 0; i < 400; i++) { update(0.05); await new Promise((r) => setTimeout(r, 5)); if (DIR.t > DIR.dur * 0.9 && SAY.nanny2 === $('sub').textContent) break; } });
  /* ?shot=fight&at=N : the fight frozen at a moment. at: 1 the march, 2 smoke and thunder, 3 the hillside full of people, 4 the soldiers go back */
  if (shot === 'fight') go('watch', 42, 0.2, 4.0, PI - 0.3, -0.62).then((P) => { const at = +(q.get('at') || 1), S = P.spots, F = FIGHT, h = groundAt(0.2, 2.3) + EYE; story.cloak = true; F.on = true; F.t = 0; bars(true); moveLock = true;
    if (at === 1) { F.mode = 'march'; F.sHead = 86; columnPlace(P, F.sHead, true, 'Walk'); say(SAY.f2, 1e6); DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.a = new THREE.Vector3(4, h + 1.6, 6); DIR.b = DIR.a; DIR.la = new THREE.Vector3(10, -36, 64); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 30; FOV = 30; resize(); F.mode = 'halt'; }
    if (at === 2) { F.mode = 'halt'; F.sHead = HALT; columnPlace(P, HALT, true, 'Idle'); state.pitch = -0.62; F.firing = 3; say(SAY.f7, 1e6); $('holdwrap').hidden = false; for (let i = 0; i < 50; i++) update(0.05); F.firing = 0; const p = S.posts[2]; gunFlash(p[0], P.G.h(p[0], p[1]) + 1.3, p[1], 1.6); const p2 = S.posts[8]; gunFlash(p2[0], P.G.h(p2[0], p2[1]) + 1.3, p2[1], 1.6); }
    if (at >= 3) { F.mode = 'halt'; F.sHead = at === 4 ? 62 : HALT; columnPlace(P, F.sHead, at !== 4, at === 4 ? 'Run' : 'Idle'); for (const c of S.cover) c.visible = false; for (const n of P.extras) if (n.fighter !== undefined) { n.cue = false; n.hidden = false; n.m.visible = true; n.ctl.play(n.fighter % 2 ? 'Cheer' : 'Wave'); } say(at === 4 ? SAY.f10 : SAY.f9, 1e6);
      DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.a = new THREE.Vector3(at === 4 ? 10 : 22, h + (at === 4 ? 2 : 4), at === 4 ? 7 : 9); DIR.b = DIR.a; DIR.la = new THREE.Vector3(at === 4 ? 8 : 11, at === 4 ? -34 : -25, at === 4 ? 60 : 39); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 50; FOV = 50; resize(); for (let i = 0; i < 14; i++) update(0.05); }
  });
  if (shot === 'guns') go('town', 54, -22, -20.5, -2.3 + PI, 0.1).then((P) => { gunsRun(); for (let i = 0; i < 260; i++) update(0.05); state.x = -24; state.z = -22; state.yaw = 0.95; state.pitch = -0.1; const g = P.spots.guns[0], w = g.localToWorld(new THREE.Vector3(...g.userData.muzzle)); gunFlash(w.x, w.y, w.z, 3.2, 3); say(SAY.n4, 1e6); });
  if (shot === 'gun') go('town', 54, -22, -20.5, 0, 0).then((P) => {   /* ?shot=gun&a=0.6: one swivel gun close up, from heading a (radians) round it, to check its legs and feet on the ground */
    const g = P.spots.guns[0], a = +(q.get('a') || 0.6), c = g.position; for (const s of P.spots.guns) s.visible = true; DIR.on = true; DIR.t = 0; DIR.dur = 1e6;
    DIR.a = new THREE.Vector3(c.x + Math.sin(a) * 2.6, c.y + 1.0, c.z + Math.cos(a) * 2.6); DIR.b = DIR.a; DIR.la = new THREE.Vector3(c.x, c.y + 0.5, c.z); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 50; FOV = 50; resize(); for (let i = 0; i < 6; i++) update(0.05, 6000); });
  if (shot === 'look') go('watch', 31, 0, 3.5, PI, -0.2).then((P) => { P.spots.redline.visible = true; const h = groundAt(0, 3.5) + EYE, fs = P.spots.far; DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.a = new THREE.Vector3(0.4, h + 0.6, 4.5); DIR.b = DIR.a; DIR.la = new THREE.Vector3(fs[0], fs[1] - 3, fs[2]); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 21; FOV = 21; resize(); bars(true); say(SAY.look2, 1e6); for (let i = 0; i < 6; i++) update(0.05, 6000); });
  /* the paths the autoplayer never takes: "Read what happened instead" for both set pieces, and being seen by the watchman */
  if (shot === 'skipfight') go('watch', 41, 0.2, 4.0, PI, -0.3).then(() => { fightIntro(); });
  if (shot === 'skipguns') go('town', 54, -7.6, -8.1, 0.8, 0).then(() => { gunsIntro(); });
  if (shot === 'seen') go('estate', 12, -2, 10, 0, 0).then((P) => { const w = byId('watchman'); w.x = 1; w.z = 8.2; w.wait = 99; w.m.position.set(1, groundAt(1, 8.2), 8.2); for (let i = 0; i < 40; i++) update(0.05); setTimeout(() => { for (let i = 0; i < 10; i++) update(0.05); document.title = 'SEEN back=' + (state.z > 12.6) + ' z=' + state.z.toFixed(1) + ' sub=' + $('sub').textContent; }, 400); });
  /* ?shot=cam&p=town&st=54&c=13,1.6,-10&l=9.9,0.8,-7.6 : a camera anywhere, for close checks of one spot. c and l are x, height above the ground there, z. &env=day lights it, &fov=50, &me=x,z puts you (the player) there */
  if (shot === 'cam') { const P3 = (k, d) => (q.get(k) || d).split(',').map(Number), c = P3('c', '0,2,6'), l = P3('l', '0,1,0'), me = q.has('me') ? P3('me', '0,0') : [c[0], c[2]];
    go(q.get('p') || 'town', +(q.get('st') || 21), me[0], me[1], 0, 0, q.has('env') ? ENV[q.get('env')] : undefined).then(() => { for (let i = 0; i < 6; i++) update(0.05); DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.a = new THREE.Vector3(c[0], groundAt(c[0], c[2]) + c[1], c[2]); DIR.b = DIR.a; DIR.la = new THREE.Vector3(l[0], groundAt(l[0], l[2]) + l[1], l[2]); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = +(q.get('fov') || 50); FOV = DIR.f0; resize(); $('hud').hidden = true; document.title = 'CAM ready'; }); }
  /* ?shot=follow : little Phibba comes with you (stage 54). You walk a few metres, stop, and turn round to look at her. &wait= frames after you stop, &env=morning to see clearly */
  if (shot === 'follow') go('town', 53, 0, 0, 0, 0, q.has('env') ? ENV[q.get('env')] : undefined).then((P) => { const n = byId('phibba'); state.x = n.x + 1.0; state.z = n.z + 0.8; update(0.05); setStage(54); const route = [[n.x + 1.0, n.z - 3.5], [n.x - 2.5, n.z - 5.5]]; for (const [tx, tz] of route) for (let i = 0; i < 900 && Math.hypot(tx - state.x, tz - state.z) > 0.05; i++) { const d = Math.hypot(tx - state.x, tz - state.z), k = Math.min(1, 2.3 / 30 / d); [state.x, state.z] = clampPos(state.x + (tx - state.x) * k, state.z + (tz - state.z) * k); update(1 / 30); } for (let i = 0; i < +(q.get('wait') || 60); i++) update(1 / 30); state.yaw = Math.atan2(-(n.x - state.x), -(n.z - state.z)); state.pitch = -0.2; $('hud').hidden = true; document.title = 'FOLLOW phibba ' + Math.hypot(n.x - state.x, n.z - state.z).toFixed(2) + ' m'; });
  if (shot === 'swivel') go('town', 54, 0, 0, 0, 0, ENV.morning).then((P) => { const S = P.spots, k = S.knoll, gy = groundAt(k[0], k[1]); S.guns.forEach((g) => { g.visible = true; }); DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.a = new THREE.Vector3(k[0] + 1.9, gy + 1.5, k[1] - 0.6); DIR.b = DIR.a; DIR.la = new THREE.Vector3(k[0] - 0.9, gy + 1.0, k[1] - 0.5); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 50; FOV = 50; resize(); $('hud').hidden = true; });
  /* A quiet, reusable poster frame from the soldiers' approach, before the fighting. */
  if (shot === 'soldiers') go('watch', 42, 0.2, 4, PI, 0).then((P) => {
    FIGHT.on = true; FIGHT.mode = 'halt'; FIGHT.sHead = 86; columnPlace(P, 86, true, 'Idle'); moveLock = true;
    DIR.on = true; DIR.t = 0; DIR.dur = 1e6;
    DIR.a = new THREE.Vector3(4, groundAt(0.2, 2.3) + EYE + 1.6, 6); DIR.b = DIR.a;
    DIR.la = new THREE.Vector3(9, -39, 65); DIR.lb = DIR.la; DIR.f0 = DIR.f1 = 20; FOV = 20; resize();
    $('hud').hidden = true; document.title = 'SOLDIERS READY';
  });
  if (shot === 'poster') go('watch', 30, -0.4, -3.9, PI + 0.06, -0.03, ENV.dawn).then((P) => { $('hud').hidden = true; EYE = 1.75; P.spots.sticks.visible = false; });
  if (V[shot]) go(...V[shot]).then((P) => {
    if (shot === 'est2' || shot === 'est3' || shot === 'est4') { const S = P.spots, qn = byId('quamin'), m = byId('mama'); lead(qn, S.trail.dense, FOLLOW.quamin); follow(m, FOLLOW.mama); for (let i = 0; i < 200; i++) update(0.05); state.yaw = V[shot][4]; }
    if (shot === 'est2') { const w = byId('watchman'); w.x = 9; w.z = 8.2; w.m.position.set(9, groundAt(9, 8.2), 8.2); w.wait = 99; $('glow').style.opacity = 0.5; say(SAY.roadWait, 1e6); }
    if (shot === 'town6') { byId('nanny').cue = false; refreshCast(); }
    if (/^night|^ridge/.test(shot)) { /* the night scenes */ }
    if (shot === 'night3') { gunsRun(); for (let i = 0; i < 200; i++) update(0.05); state.x = -30; state.z = -27; state.yaw = -2.3 + PI; state.pitch = -0.05; }
    if (shot === 'watch4') { story.cloak = true; leavesUI(); }
    for (let i = 0; i < 6; i++) update(0.05);
    if (q.has('stats')) setTimeout(() => { renderer.info.reset(); renderer.render(scene, camera); const i = renderer.info, t = 'STATS calls=' + i.render.calls + ' tris=' + i.render.triangles + ' geo=' + i.memory.geometries + ' tex=' + i.memory.textures; document.title = t; console.log(t); }, 1500);
  });
  if (q.get('test') === 'layout') {   /* ?test=layout : open each UI state and check that no two visible things overlap, nothing is cut off, and nothing is off the screen. Run at several window sizes. */
    (async () => { const out = [], W = innerWidth, Hh = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
      await ensurePlace('town'); startGame(true); stage = 22; enterPlace('town'); $('hud').hidden = false; $('title').hidden = true; refreshGoal();
      const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'sub', 'dialogue', 'cinner', 'place', 'hold', 'nudge', 'horncol'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden || (e.closest('[hidden]'))) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
      const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${Hh} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0}`); } };
      const reset = () => { for (const id of ['talk', 'toast', 'dialogue', 'card', 'holdwrap', 'nudge', 'hornwrap']) $(id).hidden = true; $('hint').hidden = true; bars(false); document.body.classList.remove('subbing', 'talking'); $('sub').classList.add('dim'); $('place').hidden = true; $('place').style.opacity = 0; HORN.on = false; };
      const settleUI = () => new Promise((r) => setTimeout(r, 700)), LONG = 'The soldiers stop on the narrow path, and they look up into the trees all around them.';
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Look out over the valley'; showHint(); toast('Two planted. One more.'); showPlace('A sugar estate in eastern Jamaica, about 1730'); await settleUI(); check('play: goal, talk, hint, toast, place');
      reset(); showGoal(true); say(LONG, 1e6); $('talk').hidden = false; $('talk').textContent = 'Look out over the valley'; showHint(); toast('Two planted. One more.'); await settleUI(); check('narration without bars');
      reset(); bars(true); say(LONG, 1e6); $('talk').hidden = false; $('talk').textContent = 'Look out over the valley'; showHint(); await settleUI(); await new Promise((r) => setTimeout(r, 1100)); check('narration inside the bars');
      reset(); showGoal(true); document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Beneba'; $('line').textContent = 'Pumpkin seeds fed the town in a week. How do we know?'; $('choices').innerHTML = '<button class="btn ghost">It was written down.</button><button class="btn ghost">Maroon families tell it.</button><button class="btn ghost">It is fictional, for this game.</button>'; $('next').hidden = true; await settleUI(); check('dialogue with three choices');
      reset(); bars(true); say(SAY.f7, 1e6); $('holdwrap').hidden = false; await settleUI(); await new Promise((r) => setTimeout(r, 1100)); check('stay low button in the bars');
      reset(); showGoal(true); HORN.on = true; $('hornwrap').hidden = false; hornDots('LSS'); $('hornname').textContent = '“Soldiers on the trail”'; $('horntip').textContent = 'Your turn. Tap the buttons, or press 1 and 2.'; await settleUI(); check('the horn in play');
      reset(); bars(true); say(SAY.f4, 1e6); HORN.on = true; $('hornwrap').hidden = false; hornDots('SSS'); $('hornname').textContent = '“Now!”'; $('horntip').textContent = 'Listen to Cubbenah.'; await settleUI(); await new Promise((r) => setTimeout(r, 1100)); check('the horn inside the bars');
      reset(); { const c = CARDS.fight; card(c.title, c.paras, [{ t: c.go, go: () => {} }, { t: c.skip, go: () => {} }], { col: true }); } await settleUI(); check('card');
      reset(); hideCard(); { const c = CARDS.real1734; card(c.title, c.paras, [{ t: c.go, go: () => {} }], { col: true }); } await settleUI(); check('long card'); hideCard();
      reset(); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (Hh * 0.45 | 0) + 'px'; showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Go up the back trail'; await settleUI(); check('helper arrow with talk button');
      const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) out.push(`${W}x${Hh} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Plant a yam'; await settleUI();
      openChapters(); await settleUI(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); closeChapters();
      for (const p of JOURNAL) unlock(p.id, true); openJournal('patent'); await settleUI(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); closeJournal();
      openCredits(); await settleUI(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); closeCredits();
      document.title = 'LAYOUT ' + out.length; const el = $('autolog'); if (el) el.textContent = (out.length ? out : [W + 'x' + Hh + ': no layout problems']).join('\n'); })();
  }
  if (q.get('test') === 'held') {   /* ?test=held : every carried thing, in every place: at the hand, upright, clear of the body */
    (async () => { const out = []; startGame(true); for (const id of Object.keys(BUILD)) { const P = await ensurePlace(id); for (const n of P.npcs) if (n.m.userData.held && n.m.userData.held.length) { const ac = n.m.userData.anim, found = new Set(); for (const clip of [null, 'Walk']) { if (clip && !n.path && n.column === undefined) continue; ac.play(clip); for (let pose = 0; pose < 12; pose++) { ac.mx.update(ac.cur.getClip().duration / 12); gripTick(n.m); for (const l of auditHeld(n.id || n.base, n.m, n.m.userData.held)) found.add(l + (clip ? ' (walking)' : '')); } } ac.play(null); for (const l of found) out.push(id + ': ' + l); } }
      const count = out.length; out.unshift('held items: ' + count + ' issues'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'HELD ' + count; })();
  }
  if (['audit', 'collision', 'seating'].includes(q.get('test'))) {   /* ?test=audit&p=town,watch : floating objects, people inside solids or off the ground, unreachable spots */
    (async () => { const ids = (q.get('p') || Object.keys(BUILD).join(',')).split(','), out = []; let count = 0; startGame(true); for (const id of ids) { const P = await ensurePlace(id); const r = auditPlace(P); count += r.floating.length + r.inside.length + r.stuck.length; out.push(id + ': ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues (' + P.npcs.length + ' people, ' + P.walls.length + ' wall pieces)'); for (const l of [...r.floating, ...r.inside, ...r.stuck]) out.push('  ' + l); }
      const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'AUDIT ' + count; })();
  }
  /* pairs the cloth check does not judge, as in Port Royal (the same 1690 tailoring): a Lining is the hidden body kept in the colour of the cloth over it (tools/garvey/era.py), so it is never
     a cover itself; and the Body beside knee breeches is the shin coming out of the hem, which is how they are worn. A Lining in the shirt's colour that pokes through the breeches IS judged. */
  const CLOTH_SKIP = (a, b) => /^Lining/.test(b) || (/^Body/.test(a) && /^Breeches/.test(b));
  if (q.get('test') === 'cloth') {   /* ?test=cloth : does an under layer show through its cover (skin through a shirt, a shirt through breeches or a coat, hair through a hat)? Every body, full and light copy, with and without its hat, standing, mid-stride, talking and sitting (as Kendal). &b=maroon_man,redcoat picks bodies, &full or &lo one kind, &where says where. */
    go('newtown', 60, 0, 0, 0, 0).then(async (P) => { const out = []; let bad = 0, pts = 0; P.group.visible = false;
      const POSES = [['Idle', 0.3], ['Walk', 0.25], ['Walk', 0.75], ['Talk1', 0.4], ['SitIdle', 0.3]], bases = (q.get('b') || 'maroon_man,maroon_scout,maroon_elder,maroon_woman,maroon_elder_woman,maroon_girl,maroon_child,maroon_boy,redcoat,militia').split(',');
      for (const base of bases) for (const lo of [false, true]) { if ((lo && q.has('full')) || (!lo && q.has('lo'))) continue; const bodyId = base + (lo ? '_lo' : ''); await loadBase(bodyId);
        for (const [i, hat] of [...(HATS[base] || []), false].entries()) { const b = makeBody({ base, bodyId, tint: {}, scale: KID[base] || 1, x: 0, z: 0, ry: 0, anim: 'Idle', hat }), name = bodyId + (hat ? ' +' + hat : ''); scene.add(b);
          const r = auditCloth(name, b, { poses: i ? [['Idle', 0.3], ['Walk', 0.25]] : POSES, after: gripTick, where: q.has('where'), skip: CLOTH_SKIP }); out.push(name + ': ' + r.lines.length + ' faults, ' + r.points + ' points, worst ' + r.worst.toFixed(1) + ' mm'); for (const l of r.lines) out.push('  ' + l); bad += r.lines.length; pts += r.points; scene.remove(b); await new Promise((res) => setTimeout(res, 0)); } }
      out.unshift('cloth: ' + bad + ' issues (' + pts + ' points)'); const el = $('autolog'); el.textContent = out.join('\n'); document.title = 'CLOTH ' + bad; });
  }
  if (q.get('test') === 'skin') {   /* ?test=skin : how each face is drawn in the game's own light (engine/skinprobe.js), every look plus crowd people at the ends of their skin range. &env=day picks the light (day, morning, dawn, night, firenight). Compare with docs/PIPELINE.md, "Skin". */
    go('newtown', 60, 0, 0, 0, 0).then(async (P) => { const out = []; setEnv(ENV[q.get('env') || 'day']);
      const list = Object.keys(LOOKS).map((k) => [k, LOOKS[k]]); for (const sk of [0.9, 1.15]) list.push(['crowd maroon_woman skin ' + sk, { base: 'maroon_woman', tint: {}, skin: sk }], ['crowd maroon_man skin ' + sk, { base: 'maroon_man', tint: {}, skin: sk }]);
      for (const [name, look] of list) { await loadBase(look.base); const b = makeBody({ ...look, x: 4000, z: 4000, ry: 0, anim: 'Idle', hat: false, props: [], cloak: false, beads: false }); scene.add(b); b.userData.anim.mx.update(0.3); const r = skinProbe(renderer, scene, b); scene.remove(b);
        out.push(name + ' (' + look.base + ', skin ' + (look.skin || 1) + '): mean ' + r.rgb.join(',') + '  darkest ' + r.lo.join(',') + '  lightest ' + r.hi.join(',')); }
      const el = $('autolog'); el.textContent = out.join('\n'); document.title = 'SKIN ' + out.length; });
  }
  if (q.get('test') === 'walkers') {   /* ?test=walkers : people who walk must not bounce, float or sink. Quamin and Mama are led up the estate trail and the soldiers up the path, 30 steps a second;
       each step the lowest point of the feet must be on the ground (within 3 cm; groundFeet sets it 8 mm in) and the body must not jump more than 2.5 cm against the ground from one step to the next. */
    (async () => { const out = [], toe = new THREE.Vector3(), feet = new WeakMap(), footPts = (m) => { let f = feet.get(m); if (f) return f; f = []; m.traverse((o) => { if (!o.isSkinnedMesh || !o.visible || !/Skin|Shoes|Sole/.test(o.material.name || '')) return; const SI = o.geometry.attributes.skinIndex, SW = o.geometry.attributes.skinWeight, bones = o.skeleton.bones, idx = [];
        for (let i = 0; i < SI.count; i++) { let k = 0; for (let c = 1; c < 4; c++) if (SW.getComponent(i, c) > SW.getComponent(i, k)) k = c; if (/mixamorig(Left|Right)(Foot|ToeBase|Toe_End)$/.test((bones[SI.getComponent(i, k)] || {}).name || '')) idx.push(i); } if (idx.length) f.push([o, idx]); }); feet.set(m, f); return f; },
      probe = (n, tag, st) => { const m = n.m; m.updateMatrixWorld(true); let low = 1e9; for (const [o, idx] of footPts(m)) { o.skeleton.update(); for (let i = 0; i < idx.length; i += 3) low = Math.min(low, o.getVertexPosition(idx[i], toe).applyMatrix4(o.matrixWorld).y); }   /* the lowest point of the foot (bare or shod), not the toe bone: a bare foot has no shoe sole under the bone */
        const g = m.userData.ground || 0, off = low - g + 0.008, ride = m.position.y - g;
        if (n.clip !== st.clip) { st.clip = n.clip; st.skip = 14; st.last = null; } if (st.skip > 0) { st.skip--; return; }   /* a change of step (standing to walking, walking to running) blends two poses for a third of a second: that is not judged */
        if (Math.abs(off) > 0.03) st.float = Math.max(st.float, Math.abs(off)); if (st.last !== null && Math.abs(ride - st.last) > (n.clip === 'Run' ? 0.08 : 0.025)   /* a run really does rise and fall */) st.jump = Math.max(st.jump, Math.abs(ride - st.last)); st.last = ride; st.n++; };
      let behind = 0; let starts = 0, was = false; const report = (name, st) => { out.push(name + ': ' + st.n + ' steps, worst toe gap ' + (st.float * 100).toFixed(1) + ' cm, worst jump ' + (st.jump * 100).toFixed(1) + ' cm' + (st.float || st.jump ? '  PROBLEM' : '')); return st.float || st.jump ? 1 : 0; }; let bad = 0;
      startGame(true); await beginChapter(0, 11); { const P = PL.estate, S = P.spots, qn = byId('quamin'), ma = byId('mama'), a = { float: 0, jump: 0, last: null, n: 0 }, b = { float: 0, jump: 0, last: null, n: 0 }; qn.fol.max = S.top - 2; stage = 13;
        for (let i = 0; i < 900; i++) { const [x, z] = pathAt(S.trail.dense, Math.min(S.top - 5, 6 + i * 0.075)); state.x = x; state.z = z; update(1 / 30); if (i > 20) { if (qn.walking) probe(qn, 'q', a); else { a.last = null; a.clip = null; } if (ma.walking) probe(ma, 'm', b); else { b.last = null; b.clip = null; } } if (i > 60 && qn.fol.s < pathS(S.trail.dense, state.x, state.z) - 0.5) behind++; if (ma.walking && !was) starts++; was = ma.walking; } bad += report('Quamin leading on the estate trail', a) + report('Mama following on the estate trail', b); out.push('Quamin behind you: ' + behind + ' steps' + (behind ? '  PROBLEM' : '')); out.push('Mama set off ' + starts + ' times in 30 seconds of steady walking' + (starts > 12 ? '  PROBLEM (stop-start shuffle)' : '')); bad += (behind ? 1 : 0) + (starts > 12 ? 1 : 0); }
      await beginChapter(3, 41); { const P = PL.watch, st = { float: 0, jump: 0, last: null, n: 0 }, n = P.extras.find((e) => e.column === 3); FIGHT.on = true; FIGHT.mode = 'march'; FIGHT.sHead = 100; for (let i = 0; i < 500; i++) { update(1 / 30); if (i > 20 && n.m.visible) probe(n, 's', st); } FIGHT.on = false; bad += report('a soldier climbing the path', st); }
      document.title = 'WALKERS ' + bad; const el = $('autolog'); if (el) el.textContent = out.join('\n'); })();
  }
  if (q.get('test') === 'follow') {   /* ?test=follow : you walk the real routes, with stops and a turn back into the person behind you, and every guide and follower is watched (engine/follow.js, watch):
       too close (inside the personal space), inside something (a footprint, or the real shapes: engine/audit.js auditBodies), left far behind, or a guide stuck. Expect 0. */
    (async () => { const out = []; let bad = 0; startGame(true); const dt = 1 / 30;
      const drive = (P, route, people, w, { speed = 2.3, stops = [] } = {}) => { for (let i = 1; i < route.length; i++) { const [tx, tz] = route[i]; let guard = 0;
          while (Math.hypot(tx - state.x, tz - state.z) > 0.05 && guard++ < 4000) { const d = Math.hypot(tx - state.x, tz - state.z), k = Math.min(1, speed * dt / d); [state.x, state.z] = clampPos(state.x + (tx - state.x) * k, state.z + (tz - state.z) * k); update(dt); for (const n of people) w.sample(n, state.x, state.z, (x, z) => blockedAt(P, x, z, 0), dt); if (guard > 3000) break; }
          if (stops.includes(i)) for (let f = 0; f < 75; f++) { update(dt); for (const n of people) w.sample(n, state.x, state.z, (x, z) => blockedAt(P, x, z, 0), dt); } } };
      const report = (P, w, list) => { for (const [n, label] of list) { const lines = w.lines(n, label).concat(auditBodies(P.snap.concat(P.snap.inst || []), w.spots(n).map(([x, z]) => ({ id: label, x, z, ground: P.G.h(x, z), h: tallOf(n), r: bodyR(n), what: 'walks' })), { skip: (e) => ((P.spots && P.spots.cover) || []).some((c) => c.uuid === e.top) }));
          out.push(label + ': ' + w.stats(n) + (lines.length ? '' : ', ok')); for (const l of lines) out.push('  ' + l); bad += lines.length; } };
      /* chapter 1: Quamin leads you up the estate trail, Mama follows you */
      await beginChapter(0, 11); { const P = PL.estate, S = P.spots, qn = byId('quamin'), ma = byId('mama'), w = followWatch({ space: FOLLOW.mama.space || 0.9, behind: 9 }); stage = 13; qn.fol.max = S.top - 2.2;
        const s0 = pathSE(S.trail.dense, state.x, state.z), route = pathSpots(S.trail.dense, s0, S.top - 4, 0, 1.0); drive(P, route, [qn, ma], w, { stops: [12, 40, 70] });
        const back = pathSpots(S.trail.dense, S.top - 9, S.top - 4, 0, 1.0).reverse(); drive(P, back, [qn, ma], w); report(P, w, [[qn, 'Quamin leads you up the estate trail'], [ma, 'Mama follows you up the estate trail']]); }
      /* chapter 2: Quamin leads you up the narrow path, Mama follows; in the town they walk home */
      await beginChapter(1, 20); { const P = PL.town, S = P.spots, qn = byId('quaminT'), ma = byId('mamaT'), w = followWatch({ space: 0.9, behind: 9 });
        drive(P, pathSpots(S.pathIn.dense, pathSE(S.pathIn.dense, state.x, state.z), S.sIn, 0, 1.0).concat([[2.5, 7.5], [0.5, 6.5]]), [qn, ma], w, { stops: [15, 45] }); for (let f = 0; f < 900; f++) { update(dt); for (const n of [qn, ma]) w.sample(n, state.x, state.z, (x, z) => blockedAt(P, x, z, 0), dt); }
        report(P, w, [[qn, 'Quamin leads you up the narrow path, then walks home'], [ma, 'Mama follows you up the narrow path, then walks home']]); if (qn.fol || Math.hypot(qn.x - qn.hx, qn.z - qn.hz) > 0.3) { out.push('  Quamin did not get home'); bad++; } }
      /* chapter 5: little Phibba comes with you round the clearing (you stop, you turn back into her), to the back trail and up it; Mama leads, the neighbours run ahead */
      await beginChapter(4, 53); { const P = PL.town, S = P.spots, ph = byId('phibba'); state.x = ph.x + 1.0; state.z = ph.z + 0.9; update(dt); setStage(54); const m5 = byId('mama5'), w = followWatch({ space: FOLLOW.phibba.space, behind: 6 });
        drive(P, [[state.x, state.z], [2, -3], [-2, 2], [-5, 4.6], [-6.5, 1.5]], [ph], w, { stops: [2, 4] }); drive(P, [[state.x, state.z], [-3.5, 2.4]], [ph], w, { speed: 2.3 }); drive(P, [[state.x, state.z], [-5.5, -4.5], [-8.2, -8.4]], [ph], w, { stops: [2] });
        gunsRun(); drive(P, pathSpots(S.back.dense, pathSE(S.back.dense, state.x, state.z), S.sBack - 3, 0, 1.0), [ph, m5], w, { speed: 2.6, stops: [20] });
        report(P, w, [[ph, 'Phibba comes with you round the town and up the back trail'], [m5, 'Mama leads you up the back trail']]); GUNS.on = false; }
      out.unshift('follow and lead: ' + bad + ' problems'); document.title = 'FOLLOW ' + bad; const el = $('autolog'); if (el) el.textContent = out.join('\n'); })();
  }
  if (q.get('test') === 'resume') {   /* saved games resume in the right place, and closing a finishing conversation still moves the story on */
    (async () => { const out = []; startGame(true); const at = () => 'place=' + cur + ' stage=' + stage + ' at ' + state.x.toFixed(0) + ',' + state.z.toFixed(0);
      await beginChapter(0, 11); out.push('ch1@11 ' + at() + ' lead=' + !!byId('quamin').fol); await beginChapter(1, 23); out.push('ch2@23 ' + at() + ' vines=' + PL.town.spots.yams[0].userData.vine.visible);
      await beginChapter(2, 34); out.push('ch3@34 ' + at() + ' sticks=' + PL.watch.spots.trenches[0].t.userData.stick.visible + ' mama3=' + byId('mama3').m.visible); await beginChapter(3, 43); out.push('ch4@43 ' + at() + ' mama4=' + byId('mama4').m.visible + ' column=' + PL.watch.extras.filter((n) => n.column !== undefined && n.m.visible).length);
      await beginChapter(4, 55); out.push('ch5@55 ' + at() + ' mama5b=' + byId('mama5b').m.visible + ' env=' + (envNow === ENV.dawn ? 'dawn' : 'other')); await beginChapter(4, 51); out.push('ch5@51 ' + at() + ' mama5=' + byId('mama5').m.visible);
      await beginChapter(5, 62); out.push('ch6@62 ' + at());
      let ran = 0; convo([{ who: 'x', text: 'y' }, { who: 'x', text: 'z' }], () => { ran++; }); leaveTalk(); out.push('convo closed early, callback ran=' + ran);
      startTalk(P_().people[0]); leaveTalk(); out.push('ordinary talk closed early: talked=' + !!P_().people[0].talked);
      document.title = 'RESUME ' + out.join(' | '); const el = $('autolog'); if (el) el.textContent = out.join('\n'); })();
  }
  if (q.has('clickstart')) setTimeout(() => $('start').click(), 300);   /* the real start, with real fades (the other test views skip them) */
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 6) and the ones after it; add &one to stop after N. It logs every change to the page title and #autolog, and says STALL if nothing changes for a while. */
    const N = +q.get('auto'), one = q.has('one'), log = [], sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const L = (m) => { log.push(m); document.title = log.join(' | '); const el = $('autolog'); if (el) el.textContent = log.join('\n'); };
    (async () => {
      await waitFor(() => modelsReady); startGame(true); let ch = N - 1; L('start ch' + (ch + 1)); await beginChapter(ch); const finished = () => stage >= DONE[ch];
      let lastKey = '', lastT = performance.now(); const nap = () => { for (let i = 0; i < 8; i++) update(0.05); }, walkTo = (dense, d = 5) => { const [x, z] = ahead(dense, d); state.x = x; state.z = z; };
      for (;;) {
        await sleep(120); nap(); const now = performance.now();
        const key = stage + '|' + cur + '|' + unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + (DIR.on ? 'cut' : '') + (HORN.on ? 'horn' + HORN.notes + HORN.pos : '') + (FIGHT.on ? FIGHT.mode : '') + (GUNS.on ? 'guns' + GUNS.n : '') + '|' + Math.round(state.x / 4) + ',' + Math.round(state.z / 4);
        if (key !== lastKey) { lastKey = key; lastT = now; L('s' + stage + ' ' + cur + ' pages=' + unlocked.length + (HORN.on ? ' horn' : '') + (FIGHT.on ? ' fight:' + FIGHT.mode : '') + (GUNS.on ? ' guns' : '') + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + $('goal').textContent + '"'); }
        if (now - lastT > 30000) { L('STALL at stage ' + stage + ' in ' + cur + ' busy=' + busy + ' frozen=' + frozen + ' fading=' + fading + ' horn=' + HORN.on + ' fight=' + FIGHT.on); break; }
        if (!$('card').hidden) { const b = $('cbtns').querySelector('button'); if (b) b.click(); continue; }
        if (!$('dialogue').hidden) { const c = [...$('choices').children].find((b) => !b.disabled); if (c) c.click(); else $('next').click(); continue; }
        if (HORN.on) { if (HORN.ready) hornTap(HORN.notes[HORN.pos]); continue; }
        if (!$('holdwrap').hidden) HOLD.on = true;
        if (finished()) { L('chapter ' + (ch + 1) + ' DONE at stage ' + stage); if (one || ch >= 5) { L('ALLDONE'); break; } ch++; L('next ch' + (ch + 1)); await beginChapter(ch); lastT = performance.now(); continue; }
        if (busy || frozen || DIR.on || fading || FIGHT.on) continue;
        const P = P_(); if (!P) continue;
        if (cur === 'estate' && (stage === 11 || stage === 13)) { walkTo(P.spots.trail.dense, 5); continue; }
        if (cur === 'estate' && stage === 12) { const w = byId('watchman'), S = P.spots; if (Math.hypot(S.crossX - w.x, 8 - w.z) > 20) { const [x, z] = pathAt(S.trail.dense, S.sRoadN + 1.5); state.x = x; state.z = z; } continue; }
        if (cur === 'town' && stage === 20) { walkTo(P.spots.pathIn.dense, 6); continue; }
        if (cur === 'town' && GUNS.on) { walkTo(P.spots.back.dense, 5); continue; }
        const a = P.actions.find((x) => x.on());
        if (a) { state.x = a.x; state.z = a.z; update(0.016); a.go(); continue; }
        const n = P.people.find((p) => wantsTalk(p) && p.m.visible); if (n) { const [x, z] = P.G.clamp(n.x + 1.1, n.z + 0.4); state.x = x; state.z = z; update(0.016); startTalk(n); continue; }
      }
    })();
  }
}
