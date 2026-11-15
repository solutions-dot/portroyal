import { slideWalls, routeIssues, walkRoute } from '../../../engine/placement.js';
import { follow, stop as stopFollow, tick as followTick, isFollowing, watch as followWatch, drive } from '../../../engine/follow.js';   /* people who walk with you: one system for every game */
import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/melissa/src/main.js: Melissa 2025, The Wind and the Morning After.
   The story of Hurricane Melissa, which struck Jamaica on 28 October 2025, told through a made-up family in a made-up village, with Hurricane Gilbert (1988) as the flashback.
   Built on the shared engine (engine/anim.js, engine/audio.js, engine/loader.js). Controls, journal, chapters, saving, audits and the cinematic layer follow Kendal 1957.
   Layout of this file: setup, state and controls, people and places, interface, saving, chapters and stages, things to do, the storm, the loop, test views. */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, chirp, gullCry } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { grip, gripTick, spreadArms } from '../../../engine/grip.js';
import { G, T, makeSky, ease, clamp01, lerp, rng, batchStatic } from './gfx.js';
import { ENV, mixEnv } from './common.js';
import { lantern, hamper, bucket, attach, hold, PM } from './props.js';
import { buildYard51, buildYard88, buildYard25, buildAfter, buildToday, buildRoom51, buildRoom88, buildHall, buildKingston88 } from './places.js';
import { CHAPTERS, GOALS, TALK_TARGETS, NEXT_AFTER_TALK, CHAPTER_END, TALK, LATER, JOURNAL, CHOICE_NAMES, LINES, KIT, STORMS } from './content.js';
import * as SFX from './sfx.js';
import { HATS, LOOKS } from './cast.js';
import { makeStorm, collectSway, swayTick } from './storm.js';
import * as PRP from './props.js'; import * as HSE from './houses.js';   /* whole modules, for the dev model viewer only */
import { snapMeshes, auditPlace as auditPlaceE, auditHeld, auditSeated, auditBodies } from '../../../engine/audit.js';
import { makeBirds } from './detail.js';

const $ = (id) => document.getElementById(id);
const PI = Math.PI;
soundPref('melissa-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });
const QUICK = __DEV__ && /[?&](shot|auto|test)=/.test(location.search);   /* test views skip fades and speed up timed scenes */
const TS = QUICK ? 0.06 : 1;   /* time scale for scripted scenes in tests */

/* ---------- renderer, camera, light, sky ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; G.aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(66, 1, 0.1, 800); scene.add(camera);
const hemi = new THREE.HemisphereLight(0xffffff, 0x887766, 2); scene.add(hemi); const sun = new THREE.DirectionalLight(0xfff0d0, 2); sun.position.set(10, 20, 10); scene.add(sun); scene.add(sun.target);
const SHADOWS = !matchMedia('(pointer: coarse)').matches && !(__DEV__ && /[?&]noshadow/.test(location.search));   /* real shadows on computers; phones get soft blob shadows under people instead */
renderer.shadowMap.enabled = SHADOWS; renderer.shadowMap.type = THREE.PCFShadowMap; sun.shadow.mapSize.set(2048, 2048); { const sc = sun.shadow.camera; sc.left = -46; sc.right = 46; sc.top = 46; sc.bottom = -46; sc.near = 1; sc.far = 260; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.06; }
const sunDir = new THREE.Vector3(0.4, 0.8, 0.4);
const handLamp = new THREE.PointLight(0xffc878, 0, 16, 1.7); handLamp.position.set(0.25, -0.25, -0.5); camera.add(handLamp);   /* your torch, in your hand (chapters 3 and 4) */
const sky = makeSky(); for (const o of sky.objects) scene.add(o);
scene.fog = new THREE.Fog(0xcfe2e6, 60, 240);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 76 : 66; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
let envNow = ENV.morning;
function setEnv(e) {   /* the time of day: sky, haze, sun and ambient light */
  envNow = e; sky.setSky(e.top, e.hor, e.stars, e.moon); scene.fog.color.setHex(e.fog); scene.fog.near = e.fogN; scene.fog.far = e.fogF; scene.background = scene.fog.color;
  hemi.color.setHex(e.hemi[0]); hemi.groundColor.setHex(e.hemi[1]); hemi.intensity = e.hemi[2]; sun.color.setHex(e.sun[0]); sun.intensity = e.sun[1]; sunDir.set(...e.sun[2]).normalize(); sun.castShadow = SHADOWS && e.sun[1] > 0.9 && !(PL[cur] && PL[cur].ride);
  sky.setSky(e.top, e.hor, e.stars, e.moon, Math.min(1, e.hemi[2] / 1.8));
}

/* ---------- state and controls ---------- */
const state = { x: 0, z: 0, yaw: 0, pitch: 0, started: false };
let EYE = 1.32; const FX = { shake: 0, roll: 0, bob: 0, tilt: 0 };   /* EYE: a child's eye height; FX: camera shake and sway */
const isTouch = matchMedia('(pointer: coarse)').matches;
const STORM = makeStorm(scene, camera, { count: isTouch ? 900 : 1700, leaves: isTouch ? 140 : 260 });   /* rain, blown leaves and flying zinc (storm.js) */
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
const endPointer = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; } if (e.pointerId === look.id) { if (look.moved < 8) { const p = tapPerson(e.clientX, e.clientY); if (p) startTalk(p); } look.id = null; } };
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {
  const el = $('stick'); if (!isTouch || !state.started || busy || frozen || DIR.on) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest); el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}

/* ---------- people: a dozen bodies, recoloured per person; places are built when a chapter needs them ---------- */
const BASES = {}, basePromises = {};
function loadBase(id) { return BASES[id] ? Promise.resolve(BASES[id]) : (basePromises[id] = basePromises[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; })); }
const PROPS = { basket: () => { const h = hamper(0xb08a48); return h; }, hamper: () => hamper(), lantern: () => lantern(), bucket: () => bucket() };
/* how each thing is carried (see hold() in props.js): handleY is the height of its handle, out is how far the hand's item sits from the body. After changing these run ?test=held. */
const SIT_HIPS = 0.12;   /* metres from the seat to the hip joint of a seated person at full size (the audit checks it) */
/* scale: the item's size. lift: how far (radians) the arm is held out from the body, so the item clears the hip, thigh and skirt. The handle height comes from each prop (userData.handleY). */
let GRIP = { hamper: { handleY: 0.52, scale: 0.5, lift: 0.46 }, lantern: { handleY: 0.32, scale: 0.85, lift: 0.26 }, bucket: { handleY: 0.49, scale: 0.9, lift: 0.34 }, basket: { dy: 0.12, scale: 0.8 } };
const SKIN_LIGHT = 1.55;   /* the bodies' skin is built dark, so we lighten it a little (as in Marcus Garvey) so faces read in every light */
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene);
  const offHats = (HATS[s.base] || []).filter((h) => h !== s.hat); if (/^man_(work|shirt|elder|suit)$/.test(s.base) && !(s.hide || []).includes('Waistcoat')) offHats.push('Belt', 'Buckle');   /* a waistcoat covers the belt */   /* a body carries several hats; show the one this person wears (s.hat), or none */
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hide && (s.hide.includes(nm) || (nm === 'WaistcoatButtons' && s.hide.includes('Waistcoat')))) || offHats.some((h) => nm === h || nm === h + 'Band')) { o.visible = false; return; }
    o.material = mat.clone(); const t = nm === 'Hair' ? undefined : s.tint && s.tint[nm];   /* hair keeps its own painted colours: they fade into the skin at the hairline */
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin' || nm === 'Hair') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); });
  m.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  if (!/^Sit/.test(s.anim || '')) { const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.05; b.renderOrder = 1; m.add(b); }
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl;
  m.userData.held = []; ctl.mx.update(0);   /* pose the body once, so the grips below are measured on the real hand */
  if (/^Sit/.test(s.anim || '')) m.userData.noGround = true;   /* a seated body is placed on its seat, so the per-frame foot grounding must leave it alone */
  if (s.seat !== undefined && /^Sit/.test(s.anim || '')) { m.userData.seatAnchor={top:s.seat}; m.updateMatrixWorld(true); const hb = m.getObjectByName('mixamorigHips'); if (hb) { m.position.y += s.seat + SIT_HIPS * (s.scale || 1) - hb.getWorldPosition(new THREE.Vector3()).y;
      m.updateMatrixWorld(true); const soles = ['LeftToeBase', 'RightToeBase'].map((n) => m.getObjectByName('mixamorig' + n)).filter(Boolean).map((b) => b.getWorldPosition(new THREE.Vector3()).y - 0.04 * (s.scale || 1)), under = (s.ground || 0) - Math.min(...soles);
      if (soles.length && under > 0.005) m.position.y += Math.min(0.1, under); } }   /* sit on the seat (its top is s.seat): the hip joint rides 12 cm above it, whatever the body's size */
  const carry = (bone, o, G) => { if (/Hand$/.test(bone)) grip(m, bone.replace('Hand', ''), o, { handleY: o.userData.handleY || G.handleY, scale: G.scale, yaw: G.yaw || 0, lift: Math.max(0.4, G.lift || 0), straighten: G.straighten ?? 0.8 }); else hold(m, bone, o, G); };   /* in a hand: a real grip (engine/grip.js); on the head: balanced there */
  for (const [bone, prop] of s.props || []) { const o = PROPS[prop](); carry(bone, o, GRIP[prop]); m.userData.held.push({ obj: o, bone, label: prop }); if (o.userData.flame) s._flame = o.userData.flame; }
  if (s.lamp) { const o = lantern(); carry('RightHand', o, GRIP.lantern); m.userData.held.push({ obj: o, bone: 'RightHand', label: 'lamp' }); s._flame = o.userData.flame; }
  if (!/^Sit/.test(s.anim || '')) spreadArms(m, /^(woman|girl|guide)/.test(s.base) ? 0.15 : s.base === 'man_suit' ? 0.11 : 0.05);   /* arms hang clear of skirts and jackets (engine/grip.js) */
  return m;
}
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
const PL = {}; let cur = null;
setEnv(ENV.morning);
const BUILD = { yard51: buildYard51, room51: buildRoom51, yard88: buildYard88, room88: buildRoom88, kingston88: buildKingston88, yard25: buildYard25, hall: buildHall, after: buildAfter, today: buildToday };
let modelsReady = false; const placeLoading = {};
function buildPlace(id) {   /* the geometry only: quick, and enough for a title backdrop. People come later (populate). */
  if (PL[id]) return PL[id]; const P = BUILD[id](); P.group.visible = false; scene.add(P.group); P.actions = []; P.bodies = []; P.npcs = []; P.specs = { people: P.people, extras: P.extras }; P.people = []; P.extras = []; P.populated = false; PL[id] = P; P.keepOut = [];
  P.sway = collectSway(P.group); const roof = P.group.userData.roof; if (roof) for (const s of roof.userData.sheets) { s.m.userData.p0 = s.m.position.clone(); s.m.userData.r0 = s.m.rotation.clone(); }   /* each roof sheet remembers its place, so a storm can tear it off and a chapter can be played again */
  if (__DEV__) P.snap = snapMeshes(P.group); if (!P.group.userData.noBatch) P.batch = batchStatic(P.group);
  P.group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.transparent && !(o.material.alphaTest > 0)) { o.castShadow = o.receiveShadow = true; } else if (o.isMesh && Array.isArray(o.material)) { o.castShadow = o.receiveShadow = true; } });
  if (ACTIONS_FOR[id]) P.actions = ACTIONS_FOR[id](P); return P;
}
/* spreadOut: nobody stands inside anybody. Background figures that are too close to someone are moved to a free spot nearby (a walker's whole loop moves with them);
   a figure that cannot be placed, or a walk that would pass through someone standing still, is dropped. The audit (?test=audit) then checks the result. */
function spreadOut(P) {
  const r = rng(77), seated = (e) => /^Sit/.test(e.anim || ''), loop = (e) => { if (!e.path) return [[e.x, e.z]]; const pts = []; for (let i = 0; i < e.path.length; i++) { const a = e.path[i], b = e.path[(i + 1) % e.path.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5)); for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return pts; };
  const fixed = [], paths = []; for (const p of P.specs.people) { if (p.path) loop(p).forEach((q) => paths.push([q[0], q[1], 0.7])); else fixed.push([p.x, p.z, seated(p) ? 0.4 : 0.7]); } for (const k of P.keepOut || []) fixed.push(k);
  const b = P.bounds, inWall = (x, z) => P.walls.some((w) => x > w[0] - 0.3 && x < w[2] + 0.3 && z > w[1] - 0.3 && z < w[3] + 0.3), keep = [];
  const free = (pts, walker) => (!walker||!routeIssues('crowd',pts,P.walls,.22).length)&&pts.every(([x, z]) => !inWall(x, z) && fixed.every((f) => Math.hypot(f[0] - x, f[1] - z) >= (f[2] < 0.6 ? Math.min(f[2] + 0.2, 0.72) : 0.72)) && (walker || paths.every((f) => Math.hypot(f[0] - x, f[1] - z) >= 0.72)) && Math.hypot(x - P.start.x, z - P.start.z) > 1.4);
  for (const e of P.specs.extras) {
    if (e.ground > 0 || seated(e)) { keep.push(e); fixed.push([e.x, e.z, 0.5]); continue; }
    let ok = free(loop(e), !!e.path), tries = 0; const x0 = e.x, z0 = e.z, path0 = e.path ? e.path.map((p) => [p[0], p[1]]) : null;
    while (!ok && tries++ < 40) { const dx = (r() - 0.5) * 2 * (1 + tries * 0.12), dz = (r() - 0.5) * 2 * (1 + tries * 0.12); e.x = Math.max(b.x0, Math.min(b.x1, x0 + dx)); e.z = Math.max(b.z0, Math.min(b.z1, z0 + dz)); if (path0) e.path = path0.map((p) => [p[0] + (e.x - x0), p[1] + (e.z - z0)]); ok = free(loop(e), !!e.path); }
    if (!ok && e.path) { e.path = null; e.walker = false; e.x = x0; e.z = z0; ok = free([[e.x, e.z]], false); }   /* a walk that cannot be made safe becomes a person standing still */
    if (ok) { keep.push(e); if (e.path) loop(e).forEach((q) => paths.push([q[0], q[1], 0.7])); else fixed.push([e.x, e.z, 0.7]); }
  }
  P.specs.extras = keep;
}
function ensurePlace(id) {   /* the place with its people: loads the bodies it needs */
  const P = buildPlace(id); if (P.populated) return Promise.resolve(P); if (placeLoading[id]) return placeLoading[id];
  return (placeLoading[id] = (async () => {
    P.specs.extras = P.specs.extras.filter((e) => Math.hypot(e.x - P.start.x, e.z - P.start.z) > 2.6 || e.seated);
    spreadOut(P);
    for (const e of P.specs.extras) e.bodyId = e.base + '_lo'; for (const e of P.specs.people) e.bodyId = e.base;   /* people you talk to get the full body; background figures get a light copy */
    const bases = new Set([...P.specs.people, ...P.specs.extras].map((s) => s.bodyId)); await Promise.all([...bases].map(loadBase));
    const mk = (s, talk) => { const n = Object.assign(s, { talked: false, heard: 0, hx: s.x, hz: s.z, ry0: s.ry || 0, walking: false, wait: 1 + Math.random() * 2, i: 0, extra: !talk }); n.m = makeBody(s); n.m.visible = false; P.group.add(n.m); n.ctl = n.m.userData.anim; P.bodies.push(n.m); P.npcs.push(n); return n; };
    P.people = P.specs.people.map((s) => mk(s, true)); P.extras = P.specs.extras.map((s) => mk(s, false)); P.people.forEach(addMark);
    if (P.group.visible) for (const n of P.npcs) n.m.visible = !n.hidden;
    P.populated = true; delete placeLoading[id]; return P;
  })());
}
const P_ = () => PL[cur];   /* the place you are in */
const byId = (id) => { for (const k of Object.keys(PL)) { const n = PL[k].people.find((p) => p.id === id); if (n) return n; } return null; };
const allPeople = () => Object.values(PL).flatMap((P) => P.people);
function enterPlace(id, { keepPos = false, env } = {}) {
  cur = id; const P = PL[id];
  for (const k of Object.keys(PL)) { const Q = PL[k]; Q.group.visible = k === id; for (const n of Q.npcs) { if (n.mark) n.mark.visible = false; n.m.visible = k === id && !n.hidden; } }
  setEnv(env || P.env); near = null; STORM.clear(); STORM.mask(0, 0, 1e5); P.group.rotation.set(0, 0, 0);
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
  EYE = P.eye || 1.32; FX.roll = 0; FX.tilt = 0; stick.id = null; stick.dx = stick.dy = 0; sitting = false;
}
const birds = makeBirds(scene, 7);
function clampPos(x, z) {
  const P = P_(), b = P.bounds; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  for (const [x0, z0, x1, z1] of P.walls) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  for (const n of P.people) { if (!n.m || !n.m.visible || n.m.userData.sits || isFollowing(n)) continue; const d = Math.hypot(x - n.x, z - n.z); if (d < 0.5) {   /* someone who comes with you never blocks you: they step aside (engine/follow.js) */ x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  return [x, z];
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  if (!cur || busy || frozen) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of P_().people) if (n.m && n.m.visible && Math.hypot(state.x - n.x, state.z - n.z) < 6 && ray.intersectObject(n.m, true).length > 0) return n; return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
/* what engine/follow.js needs each frame: where you are, what is solid (the place's walls and furniture), who else is about, and the camera (a follower who is left far behind reappears out of view) */
const inWallR = (W, x, z, r) => W.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r);
function followWorld() { const P = P_(), b = P.bounds; return { px: state.x, pz: state.z, blocked: (x, z, r = 0.22) => x < b.x0 + r || x > b.x1 - r || z < b.z0 + r || z > b.z1 - r || inWallR(P.walls, x, z, r * 0.8), walls: P.walls, bounds: b, others: P.npcs.filter((o) => o.m && o.m.visible), talking: talkWith, view: { x: state.x, z: state.z, yaw: state.yaw } }; }
function npcTick(n, dt) {
  const m = n.m; if (!m || !m.visible) return; if (POSTER) { m.rotation.y = n.ry0; return; }
  const ac = n.ctl, d = Math.hypot(state.x - n.x, state.z - n.z), seated = /^Sit/.test(n.anim || ''), isNear = !n.extra && !seated && ((d < 3.2 && !DEV_NOSTOP) || talkWith === n);
  if (n.fol) { followTick(n, dt, followWorld()); return; }   /* someone who comes with you (engine/follow.js): behind you and to one side, never in your way; the height belongs to groundFeet */
  if (!n.path) { if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else if (!n.extra) faceTo(m, n.ry0, dt, 2); return; }
  if (isNear || n.wait > 0) { if (n.walking) { n.walking = false; ac.play(null); } if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else { n.wait -= dt; if (n.wait <= 0) { n.walking = true; ac.play('Walk'); } } return; }
  if (!n.walking) { n.walking = true; ac.play('Walk'); }
  const to = n.path[(n.i + 1) % n.path.length], dx = to[0] - n.x, dz = to[1] - n.z, dist = Math.hypot(dx, dz), sp = 1.1 * dt; faceTo(m, Math.atan2(dx, dz), dt);
  if (dist <= sp) { n.x = to[0]; n.z = to[1]; n.i = (n.i + 1) % n.path.length; n.wait = 2 + Math.random() * 3; n.walking = false; ac.play(null); } else { [n.x,n.z]=slideWalls([n.x,n.z],[n.x+dx/dist*sp,n.z+dz/dist*sp],PL[cur].walls,.22); }
  m.position.set(n.x, m.userData.ground, n.z);
}

/* ---------- a glowing speech mark over each person, and a bubble on the nearest ---------- */
const BUBBLE = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.fillStyle = '#f6c45c'; x.strokeStyle = 'rgba(70,45,10,0.85)'; x.lineWidth = 3; x.beginPath(); x.arc(64, 64, 15, 0, PI * 2); x.fill(); x.stroke(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(59, 59, 5, 0, PI * 2); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
const headTop = (n) => (n.m.userData.ground || 0) + (n.h || 1.8) - 0.03;
const POSTER = __DEV__ && /[?&]shot=poster/.test(location.search); let DEV_NOSTOP = false;   /* the menu poster is rendered from this view with no marks or bubbles */
function bubbleTick(now) {
  const show = state.started && !busy && !frozen && $('card').hidden && !POSTER && !DIR.on && !sitting;
  for (const n of P_() ? P_().people : []) { const m = n.mark; if (!m) continue; if (!show || !n.m || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, headTop(n) + 0.17 + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n && d < 40; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, headTop(near) + 0.08, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== near.who) { TB.el.dataset.label = near.who; TB.el.innerHTML = TALK_SVG + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- interface: toast, the journal, cards, the cinematic layer ---------- */
let toastTimer = 0, EP = 0;   /* EP: the "epoch": starting a chapter bumps it, so timed scenes from an earlier chapter stop themselves */
function toast(msg, ms = 2600) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, ms); }
const unlocked = [], story = {}, ctr = {};   /* story: what you chose. ctr: counters for the stage you are in (bunches carried, brakes checked...) */
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function refreshJourney() { const p = JOURNAL.find((q) => q.id === 'journey'); const lines = ['first', 'why'].map((k) => (story[k] ? CHOICE_NAMES[k][story[k]] : null)).filter(Boolean); p.simple = lines.length ? ['You finished the story.', ...lines] : ['You finished the story.']; }
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
const MENU = { ok: false, url: '../../../menu/' };
{ const links = ['allgames', 'jhome'].map((id) => document.getElementById(id)).filter(Boolean); for (const a of links) a.hidden = true;
  fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }
function toMenu() { saveGame(); location.href = MENU.url; }

const CARD = { dismiss: null };
function card(title, paras, btns, { col = false, dismiss } = {}) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); bb.classList.toggle('col', col); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; bb.appendChild(el); });
  CARD.dismiss = dismiss === undefined ? null : dismiss; $('card').hidden = false; busy = true; keys.clear(); $('talk').hidden = true; const f = bb.querySelector('button'); if (f) f.focus();
}
function hideCard() { $('card').hidden = true; CARD.dismiss = null; busy = panelsOpen(); }
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

/* ---------- the camera director: a move from one view to another, for cutscenes ---------- */
const DIR = { on: false, t: 0, dur: 1, a: null, b: null, la: null, lb: null, resolve: null }, _v = new THREE.Vector3();
function cut(a, b, la, lb, dur, onEnd) { return new Promise((res) => { Object.assign(DIR, { on: true, t: 0, dur: Math.max(0.05, dur * TS), a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), la: new THREE.Vector3(...la), lb: new THREE.Vector3(...lb), resolve: res }); }); }
function endCut() { DIR.on = false; }
let sitting = false;

/* ---------- goal, hint, sound ---------- */
let stage = 0, best = 0, goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) { const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer); goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500); if (withControls) showHint(); }
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
function refreshGoal(quiet) { const g = GOALS[stage]; goalText = g ? g(ctr) : ''; if (quiet) { $('goal').textContent = goalText; return; } showGoal(true); }
$('goal').onclick = () => showGoal(true);
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- saving: kept in this browser only ---------- */
const SAVE_KEY = 'melissa-save-v1'; let hasSave = false, erasing = false;
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, unlocked, stage, best, story, talked: allPeople().filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
/* Saves are versioned. Version 1 (before the Charlie chapter was added at the front) numbered its stages ten lower: Gilbert was 10 to 16, Today was 60 to 64. Moving a version 1 save up by ten keeps the player where they were. 0 (no progress) stays 0. */
const migrateStage = (n, v) => (v === 2 || !Number.isInteger(n) || n < 10 ? n : n + 10);
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; const v = d.v === 2 ? 2 : 1; d = { ...d, stage: migrateStage(d.stage, v), best: migrateStage(d.best, v) };
  for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story); stage = Number.isInteger(d.stage) && d.stage in GOALS ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false;   /* convoForced: a conversation that finishes something you already did (carrying the last bucket), so closing it early must not undo that */ const TALKS = ['Talk1', 'Talk2', 'Talk3'];
const ALIAS = () => ({ pearlH: stage === 44 ? 'pearlH2' : 'pearlH', pastor: stage === 44 ? 'pastor2' : 'pastor', dadR: stage === 25 ? 'dadR2' : 'dadR', pearlA: stage === 53 ? 'pearlA2' : 'pearlA' });
const wantsTalk = (n) => !n.extra && !n.talked && (TALK_TARGETS[stage] || []).includes(n.id);
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  if (busy || frozen) return; talkFull = wantsTalk(n); const id = ALIAS()[n.id] || n.id;
  if (talkFull) lines = [...TALK[id](story)]; else { const later = (LATER[id] || LATER[n.id] || (() => ['...']))(story); lines = [{ who: n.who, text: later[n.heard++ % later.length] }]; }
  convoForced = false; openConvo(lines, null, n);
}
function convo(ls, onEnd, who) { if (busy && !$('card').hidden) hideCard(); talkFull = false; convoForced = true; openConvo([...ls], onEnd, who || null); }
function openConvo(ls, onEnd, n) { document.body.classList.add('talking'); busy = true; talkWith = n || null; lines = ls; convoEnd = onEnd; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true; showLine(); }
function showLine() {
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock); if (s.give === 'torch') { story.torch = true; saveGame(); toast('Mum gives you a torch.'); }
  $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(s, c); box.appendChild(b); }); box.firstChild.focus(); } else $('next').focus();
  const ac = talkWith && talkWith.ctl; if (ac && !/^Sit/.test(talkWith.anim || '')) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(s, c) { uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || [])); step++; if (step >= lines.length) endTalk(true); else showLine(); }
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  document.body.classList.remove('talking'); const n = talkWith, cb = convoEnd; talkWith = null; convoEnd = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.ctl && !/^Sit/.test(n.anim || '')) n.ctl.play(null);
  const forced = convoForced; convoForced = false;
  if (finished && n && talkFull) { n.talked = true; saveGame(); onTalked(); } if (cb && (finished || forced)) cb();
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) activate(near); };
function onTalked() { const t = TALK_TARGETS[stage]; if (t && t.every((id) => { const n = byId(id); return n && n.talked; })) setStage(NEXT_AFTER_TALK[stage]); }
const lampMesh = (() => { const g = new THREE.Group(), b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.26, 10), new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.5 })), l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.05, 10), new THREE.MeshBasicMaterial({ color: 0xfff0c0 })); b.rotation.x = l.rotation.x = Math.PI / 2; l.position.z = -0.15; g.add(b, l); g.position.set(0.3, -0.3, -0.55); g.visible = false; camera.add(g); return g; })();

/* ---------- chapters, stages and the story machine ---------- */
const CH_PLACE = ['yard51', 'yard88', 'yard25', 'hall', 'after', 'after', 'today'], CH_FIRST = [10, 20, 30, 40, 50, 60, 70], DONE = [16, 26, 36, 45, 55, 65, 74];
const PRELOAD = { 0: ['room51'], 1: ['room88', 'kingston88'], 2: ['hall'], 3: ['after'], 4: [], 5: [] };
const SAFE = { 42: 41, 63: 62 };   /* a saved game never resumes in the middle of a scripted scene */
const chapterOf = (s) => Math.max(0, Math.min(6, Math.floor(s / 10) - 1));
/* the two flashback chapters (Charlie 1951 and Gilbert 1988) have one shape: talk (base), three jobs (base+1), talk to the neighbour with the strong house (base+2),
   go inside (base+3), the storm night (base+4), the morning (base+5), done (base+6). */
const BYGONE = { c51: { base: 10, ch: 0, yard: 'yard51', room: 'room51' }, g88: { base: 20, ch: 1, yard: 'yard88', room: 'room88' } };
const bygoneOf = (i) => (i === 0 ? BYGONE.c51 : i === 1 ? BYGONE.g88 : null);
const ON = {}, TICKS = [];   /* ON[stage]: what happens when a stage begins. TICKS: per-frame jobs from tween(). */
let hasLoaded = false;
function setStage(s) {
  stage = s; best = Math.max(best, s); for (const k of Object.keys(ctr)) delete ctr[k]; for (const n of allPeople()) n.talked = false; saveGame(); refreshGoal(); if (ON[s]) ON[s]();
  if (!QUICK && s in CHAPTER_END) setTimeout(() => nextCard(CHAPTER_END[s], s), 900);
}
function nextCard(i, s, tries = 0) {
  if (stage !== s) return; if ((panelsOpen() || fading) && tries < 10) { setTimeout(() => nextCard(i, s, tries + 1), 800); return; }
  const nx = CHAPTERS[i + 1]; if (!nx) return; uiSound('goal'); card('Chapter ' + (i + 1) + ' is finished!', ['Well done. Next is ' + nx.name + ' (' + nx.year + ').'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(i + 1); } }, { t: 'Stay here', go: hideCard }]);
}
function showPlace(text) { const el = $('place'); el.textContent = text || CHAPTERS[chapterOf(stage)].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(showPlace.t); showPlace.t = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetTransient() {   /* leave anything running: scripted scenes, the storm, the camera director */
  for (const k of Object.keys(PL)) for (const n of PL[k].npcs || []) if (n.fol) stopFollow(n);   /* nobody keeps following you into another chapter */
  EP++; endCut(); frozen = false; moveLock = false; ST.on = false; SB = null; bars(false); $('sub').classList.add('dim'); document.body.classList.remove('subbing'); $('holdwrap').hidden = true; flash(0, 0); $('vig').style.opacity = 0; FX.shake = 0; FX.roll = 0; FX.tilt = 0;
  SFX.setBeds({}, 0.1); TICKS.length = 0; STORM.clear(); STORM.mask(0, 0, 1e5); WIND.k = 0.06; torch(false); if (cur && PL[cur]) PL[cur].group.rotation.set(0, 0, 0); sitting = false; document.body.classList.remove('flashing');
}
let moveLock = false;
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i]; hideCard(); closeJournal(); closeChapters(); $('dialogue').hidden = true; busy = false; talkWith = null;
  const B = bygoneOf(i), first = B && st >= B.base + 4 ? B.room : CH_PLACE[i]; if (!PL[first] || !PL[first].populated) toast('Loading', 4000); await ensurePlace(first); for (const id of PRELOAD[i] || []) ensurePlace(id);
  chapterFade(C.title, C.sub, () => startScene(i, st));
}
function startScene(i, st) {
  const ep = EP, B = bygoneOf(i), id = B && st >= B.base + 4 ? B.room : CH_PLACE[i], P = PL[id], torn = (B && st >= B.base + 5) || (id === 'hall' && st >= 44);
  if ((B && id === B.room) || id === 'hall') { restoreRoof(P, torn); for (const l of id === 'hall' ? P.lights : [P.lampLight]) l.userData.k = torn ? 0 : 1; }
  const JOBS_AT = { yard51: 12, yard88: 22, yard25: 32 };
  if (JOBS_AT[id]) { const done = st >= JOBS_AT[id], ud = P.group.userData; for (const b of ud.boards) b.visible = done; if (ud.washing) ud.washing.visible = !done; if (ud.canoe) ud.canoe.position.z = done ? 11.6 : 13.4; }   /* a chapter started again, or resumed, shows its jobs as done or not done */
  if (id === 'after') { for (const n of P.people) if (n.stage5) n.hidden = i !== 5;   /* chapter 6's people are there from its first stage, even in a saved game resumed half way */
    P.group.userData.homeLamp.visible = false; const fallen = P.group.userData.fallen, logs = P.group.userData.logs; if (fallen) { fallen.visible = true; logs.visible = false; const tw = P.group.userData.treeWall; if (tw && !P.walls.includes(tw)) P.walls.push(tw); } if (i === 5 && st >= 62) clearTree(P, true); P.tarpHome.visible = i === 5 && st >= 62; }
  enterPlace(id); state.started = true; setStage(st); showPlace();
  if (torn) setEnv(mixEnv(ENV.after, ENV.room, 0.5));
}
function chaptersOpen(i) { return i === 0 || best >= DONE[i - 1]; }
let teacherMode=false;try{teacherMode=localStorage.getItem('melissa-teacher')==='1';}catch{}
function renderChapters() {
  $('chteacher').setAttribute('aria-pressed',String(teacherMode));$('chteacher').textContent=teacherMode?'Teacher unlock: on':'Teacher unlock';$('chteachernote').hidden=!teacherMode;
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = teacherMode || chaptersOpen(i), dn = best >= DONE[i], li = document.createElement('li'), b = document.createElement('button'); b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !modelsReady ? 'Loading' : dn ? 'Done' : 'Play']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => { $('chapters').hidden = true; busy = false; if (!state.started) startGame(true); beginChapter(i); }; li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = panelsOpen(); if (state.started) canvas.focus(); }
$('chteacher').onclick=()=>{teacherMode=!teacherMode;try{localStorage.setItem('melissa-teacher',teacherMode?'1':'0');}catch{}renderChapters();$('chteacher').focus();};
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('dev').onclick = openCredits; $('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
$('reset').onclick = () => { if (fading || ST.on) return; closeJournal(); const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart “' + CHAPTERS[i].name + '”', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : [])]); };

/* ---------- waiting for things, and moving things over time ---------- */
const waitFor = (fn) => new Promise((res) => { const ep = EP, iv = setInterval(() => { if (EP !== ep) { clearInterval(iv); res(false); } else if (fn()) { clearInterval(iv); res(true); } }, 100); });
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.05, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); fn(k, dt / d); if (k >= 1) { res(true); return true; } return false; }); }); }
async function transition(id, opts = {}) {   /* fade to black, change place, fade back in */
  const ep = EP; fadeBlack(true, 700); await wait(900); if (ep !== EP) return false; enterPlace(id, opts); if (opts.after) opts.after(); fadeBlack(false, 900); await wait(500); return ep === EP;
}

/* ---------- things to do: ACTIONS_FOR[place](P) makes the list of that place. A thing shows as a button when you stand at it. ---------- */
/* a job with several taps: counts the taps, shows a short line each time, and counts one job done after the last tap */
function tapJob(key, n, msgs, total) {
  const c = ctr[key] = (ctr[key] || 0) + 1; toast(msgs[Math.min(c - 1, msgs.length - 1)], 3000);
  if (c >= n) { ctr[key + 'Done'] = true; ctr.jobs = (ctr.jobs || 0) + 1; }
  refreshGoal(true); return c >= n;
}
const jobsDone = (total, next) => { if ((ctr.jobs || 0) >= total) { uiSound('goal'); setStage(next); return true; } return false; };
const ACTIONS_FOR = {
  yard51: (P) => bygoneYard(P, 'c51'), yard88: (P) => bygoneYard(P, 'g88'), room51: (P) => bygoneRoom(P, 'c51'), room88: (P) => bygoneRoom(P, 'g88'),
  yard25: (P) => [
    { label: 'Buy water and tins', x: P.spots.shop[0], z: P.spots.shop[1], r: 2.6, on: () => stage === 31 && !ctr.shopDone, go: () => { SFX.clink(); tapJob('shop', 2, ['Six bottles of water. Good.', 'Tins of food and bread. Good.']); jobsDone(4, 32); } },
    { label: 'Fill the buckets', x: P.spots.standpipe[0], z: P.spots.standpipe[1], r: 2.6, on: () => stage === 31 && !ctr.stdDone, go: () => { SFX.pourWater(); tapJob('std', 3, ['The first bucket is full.', 'The second bucket is full.', 'Three full buckets. Water for washing and flushing.']); jobsDone(4, 32); } },
    { label: 'Board up the window', x: P.spots.boards[0], z: P.spots.boards[1], r: 3.0, on: () => stage === 31 && !ctr.boardDone, go: () => { SFX.hammerTap(3); const b = P.group.userData.boards[ctr.board || 0]; if (b) b.visible = true; tapJob('board', 2, ['One window is covered.', 'Both windows are covered. Glass can break in the wind.']); jobsDone(4, 32); } },
    { label: 'Pack the go-bag', x: P.spots.bag[0], z: P.spots.bag[1], r: 2.4, on: () => stage === 31 && !ctr.bagDone, go: () => { SFX.bag(); tapJob('bag', 3, ['Papers go in a plastic bag, to keep them dry.', 'A torch and spare batteries.', 'The phone and its charger. The radio too.']); jobsDone(4, 32); } },
    { label: 'Hand up the nails', x: P.spots.ladder[0], z: P.spots.ladder[1], r: 2.8, on: () => stage === 33 && !ctr.nailDone, go: () => { SFX.hammerTap(3); tapJob('nail', 3, ['Mr. Raymond nails a sheet down. Tap, tap, tap.', 'Another sheet is fixed to its rafter.', 'The last sheet is tight.']); if (ctr.nailDone) setStage(34); } },
    { label: 'Listen to the radio', x: P.spots.home[0], z: P.spots.home[1], r: 3.0, on: () => stage === 34, go: () => radioCard() },
    { label: 'Walk to the church hall', x: P.spots.church[0], z: P.spots.church[1], r: 3.2, on: () => stage === 35, go: () => setStage(36) } ],
  hall: (P) => [
    { label: 'Hand out a blanket', x: P.spots.blankets[0], z: P.spots.blankets[1], r: 2.6, on: () => stage === 41 && !ctr.blkDone, go: () => { SFX.bag(); tapJob('blk', 2, ['A blanket for a little girl.', 'A blanket for Miss Hyacinth.']); jobsDone(2, 42); } },
    { label: 'Pour water for people', x: P.spots.table[0], z: P.spots.table[1], r: 2.4, on: () => stage === 41 && !ctr.watDone, go: () => { SFX.pourWater(); tapJob('wat', 2, ['A cup for Gran.', 'A cup for the nurse.']); jobsDone(2, 42); } },
    { label: 'Sit down with Mum and Gran', x: P.spots.seat[0], z: P.spots.seat[1], r: 3.2, on: () => stage === 43 && !ST.on, go: () => stormIntro('m25') } ],
  after: (P) => [
    { label: 'Look at the fallen tree', x: P.spots.tree[0], z: P.spots.tree[1], r: 3.0, on: () => (stage === 51 || stage === 53) && !unlocked.includes('trees'), go: () => { ctr.tree = 1; unlock('trees'); card('A fallen tree', ['A big mango tree fell across the lane. Its roots came up out of the soil.', 'After lots of rain, the ground is soft. Strong wind can push a tree right over.'], [{ t: 'Go on', go: hideCard }]); } },
    { label: 'Keep away from the wire', x: P.spots.wire[0], z: P.spots.wire[1], r: 3.4, on: () => (stage === 51 || stage === 53 || stage === 54) && !unlocked.includes('wires'), go: () => { ctr.wire = 1; unlock('wires'); card('Fallen wires', ['A pole fell, and its wires are on the ground.', 'Never touch a fallen wire. It might still carry power, even if the lights are out.', 'Keep away. Tell a grown-up, and call the light company.'], [{ t: 'I will keep away', go: hideCard }]); } },
    { label: 'Look at the house', x: P.spots.home[0], z: P.spots.home[1], r: 3.2, on: () => stage === 52, go: () => houseLook() },
    { label: 'Help move the logs', x: P.spots.tree[0], z: P.spots.tree[1], r: 3.0, on: () => stage === 61 && !ctr.logDone, go: () => { SFX.thump(0.2); tapJob('log', 3, ['Mr. Raymond cuts the trunk. You roll a log.', 'Another log rolls to the side.', 'The lane is open again.']); if (ctr.logDone) clearTree(P); refreshGoal(true); jobsDone(4, 62); } },
    { label: 'Fill a bucket at the truck', x: P.spots.truck[0], z: P.spots.truck[1], r: 3.0, on: () => stage === 61 && !ctr.truckDone, go: () => { SFX.pourWater(); tapJob('truck', 2, ['A full bucket for home.', 'A full bucket for Miss Hyacinth.']); jobsDone(4, 62); } },
    { label: 'Hold the tarp rope', x: P.spots.tarp[0], z: P.spots.tarp[1], r: 3.0, on: () => stage === 61 && !ctr.tarpDone, go: () => { SFX.bag(); tapJob('tarp', 3, ['You hold the rope. Mum pulls.', 'The blue tarp goes over the bare roof.', 'Tied down. Rain cannot get in now.']); if (ctr.tarpDone) P.tarpHome.visible = true; jobsDone(4, 62); } },
    { label: 'Take a plate of food', x: P.spots.church[0], z: P.spots.church[1], r: 3.2, on: () => stage === 61 && !ctr.plate && !ctr.foodDone, go: () => { ctr.plate = 1; SFX.clink(); toast('A hot plate from the church kitchen. Take it to Miss Hyacinth.'); } },
    { label: 'Give food to Miss Hyacinth', x: P.spots.hyacinth[0], z: P.spots.hyacinth[1], r: 3.0, on: () => stage === 61 && ctr.plate && !ctr.foodDone, go: () => { SFX.clink(); ctr.foodDone = true; ctr.jobs = (ctr.jobs || 0) + 1; toast('Miss Hyacinth smiles. "Bless you, child."'); refreshGoal(true); jobsDone(4, 62); } },
    { label: 'Switch on the light', x: P.spots.home[0], z: P.spots.home[1], r: 3.2, on: () => stage === 64, go: () => lightsBack() } ],
  today: (P) => [
    { label: 'Read the Ready Plan', x: P.spots.plan[0], z: P.spots.plan[1], r: 2.8, on: () => stage === 71 && !ctr.plan, go: () => { ctr.plan = 1; unlock('plan'); card('Breadnut Corner Ready Plan', ['1. Know your risk. Is your home safe in a hurricane? Is it near water?', '2. Make a family plan. Where will we go? Who will we call?', '3. Keep a kit. Water, food, a torch, a radio, medicine and papers.', '4. Fix the roof early. Strong straps and nails help it stay on.', '5. Listen to the official warnings, and leave early if you are told to.'], [{ t: 'Good!', go: () => { hideCard(); setStage(72); } }], { col: true }); } },
    { label: 'Pack the family kit', x: P.spots.plan[0] - 5, z: P.spots.plan[1], r: 2.8, on: () => stage === 72, go: () => kitQuiz(0) } ],
};

/* the yard of a flashback chapter (Charlie or Gilbert): three jobs in any order, then the neighbour's strong house */
function bygoneYard(P, k) {
  const B = BYGONE[k], b = B.base, j = b + 1, sp = P.spots, c51 = k === 'c51', finish = () => jobsDone(3, b + 2);
  const acts = [
    { label: 'Fill the water drum', x: sp.standpipe[0], z: sp.standpipe[1], r: 2.6, on: () => stage === j && !ctr.drumDone, go: () => { SFX.pourWater(); tapJob('drum', 3, ['The drum is a third full.', 'Two thirds full.', 'The drum is full. We will need water.']); finish(); } },
    { label: 'Nail a board over the window', x: sp.boards[0], z: sp.boards[1], r: 3.0, on: () => stage === j && !ctr.boardDone, go: () => { SFX.hammerTap(3); const bd = P.group.userData.boards[ctr.board || 0]; if (bd) bd.visible = true; tapJob('board', 2, ['One window is covered. Bang, bang, bang.', 'Both windows are covered.']); finish(); } } ];
  if (c51) acts.push({ label: 'Haul the canoe up the beach', x: sp.canoe[0], z: sp.canoe[1], r: 2.8, on: () => stage === j && !ctr.canoeDone, go: () => { SFX.thump(0.2); P.group.userData.canoe.position.z = 13.4 - 0.6 * ((ctr.canoe || 0) + 1); tapJob('canoe', 3, ['The canoe slides up the sand.', 'Higher, away from the waves.', 'Tied to a palm. It is safe.']); finish(); } });
  else acts.push({ label: 'Take in the washing', x: sp.washing[0], z: sp.washing[1], r: 2.8, on: () => stage === j && !ctr.washDone, go: () => { SFX.bag(); P.group.userData.washing.visible = false; ctr.washDone = true; ctr.jobs = (ctr.jobs || 0) + 1; toast('The washing is in. The wind would take it.'); refreshGoal(true); finish(); } });
  acts.push({ label: 'Go inside with your family', x: sp.clifford[0], z: sp.clifford[1], r: 3.0, on: () => stage === b + 3, go: () => { setStage(b + 4); transition(B.room, { env: ENV.room, after: () => { WIND.k = 0.45; setBedsFor('room'); showPlace(CHAPTERS[B.ch].caption2); } }); } });
  return acts;
}
function bygoneRoom(P, k) { const b = BYGONE[k].base; return [{ label: 'Sit down with your family', x: P.spots.lamp[0], z: P.spots.lamp[1] + 0.9, r: 3.0, on: () => stage === b + 4 && !ST.on, go: () => stormIntro(k) }]; }

/* ---------- weather in a scene, and the storm's sounds ---------- */
const WIND = { k: 0.06, dir: [0.6, 0.2] }; let SB = null;   /* WIND.k is how hard the wind blows (0 still, 1 a hurricane); SB: the storm's sound levels while a storm scene runs */
const ST = { on: false };
const BEDS_BY = { calm: { wind: 0.12 }, rising: { wind: 0.35, howl: 0.15 }, gale: { wind: 0.6, howl: 0.35, rain: 0.25 }, room: { wind: 0.55, howl: 0.25, roar: 0.1, rain: 0.2, rattle: 0.1 }, after: { wind: 0.08 }, saw: { wind: 0.06, saw: 0.9 }, heli: { wind: 0.06, heli: 1 }, quiet: {} };
/* the storm night's sound levels, from first groans to the peak (the sound test plays these same ones) */
const SB_GROAN = { wind: 0.7, howl: 0.35, roar: 0.3, rattle: 0.3, rain: 0.3 }, SB_LIGHT = { wind: 0.9, howl: 0.5, roar: 0.5, rattle: 0.5, rain: 0.45 }, SB_PEAK = { wind: 1.5, howl: 0.95, roar: 0.8, rattle: 0.7, rain: 0.85 };
let bedsKey = 'calm'; const setBedsFor = (k) => { bedsKey = k; };
function weather(k, rain, env) { WIND.k = k; STORM.set({ rain: rain || 0, wind: WIND.dir, leaves: Math.min(1, k * 1.4), dens: 1 }); if (env) setEnv(env); }
function ease2(env, to, sec) { const a = env; return tween(sec, (k) => setEnv(mixEnv(a, to, ease(k)))); }

/* ---------- chapters 1 and 2: Charlie, 1951 and Gilbert, 1988 (one shape, see BYGONE) ---------- */
for (const k of Object.keys(BYGONE)) { const b = BYGONE[k].base;
  ON[b] = () => { weather(0.07, 0, ENV.calm); setBedsFor('calm'); };
  ON[b + 1] = () => { const a = envNow; ease2(a, ENV.hazy, 25); weather(0.16, 0, null); setBedsFor('rising'); };
  ON[b + 2] = () => { weather(0.3, 0.12, null); ease2(envNow, ENV.overcast, 12); };
  ON[b + 3] = () => { weather(0.45, 0.3, null); ease2(envNow, ENV.gale, 10); setBedsFor('gale'); };
  ON[b + 4] = () => { setBedsFor('room'); };
  ON[b + 5] = () => { /* morning in the room, the roof torn */ };
  ON[b + 6] = () => { unlock(LINES[k].page); unlock(LINES[k].page2); };
}

/* ---------- chapter 2: Melissa is coming ---------- */
ON[30] = () => { weather(0.07, 0, ENV.calm); setBedsFor('calm'); };
ON[31] = () => { weather(0.1, 0, null); ease2(envNow, ENV.hazy, 20); };
ON[32] = () => { weather(0.18, 0, null); };
ON[33] = () => { weather(0.3, 0.1, null); ease2(envNow, ENV.overcast, 10); setBedsFor('rising'); };
ON[34] = () => { weather(0.4, 0.2, null); ease2(envNow, ENV.gale, 10); setBedsFor('gale'); showPlace('Breadnut Corner, Monday 27 October 2025'); };
ON[35] = () => { };
ON[36] = () => { unlock('shelter'); };
function radioCard() {
  SFX.radioTune(); unlock('warnings');
  card('The radio', ['It is Monday morning. A radio voice reads the news.', 'Melissa is now a Category 5 hurricane, the strongest kind. It is still moving very slowly.', 'Listen for the warnings. Go to a shelter early if your home is not strong.', 'Mum looks at Grandpa. "We will go to the church hall," she says.'], [{ t: 'Go on', go: () => { hideCard(); setStage(35); } }], { col: true });
}

/* ---------- chapter 3: the storm ---------- */
ON[40] = () => { weather(0, 0, ENV.room); setBedsFor('room'); const P = P_(); P.lights.forEach((l) => { l.userData.k = 1; }); };
ON[41] = () => { };
ON[42] = async () => {
  const P = P_(), ep = EP; frozen = true; busy = false; bars(true); goalText = ''; say('The evening goes by. People talk softly. The wind grows.', 4200); await wait(4400); if (ep !== EP) return;
  say('Night. The hall is full of sleeping people, and a baby cries.', 4200); BEDS_BY.room = { wind: 0.7, howl: 0.35, roar: 0.2, rain: 0.35, rattle: 0.2 }; await wait(4400); if (ep !== EP) return;
  fadeBlack(true, 1600); await wait(1800); if (ep !== EP) return; $('fadeT').textContent = 'Tuesday morning'; $('fadeS').textContent = '28 October 2025'; $('fade').classList.add('txt'); await wait(3000); if (ep !== EP) return;
  $('fade').classList.remove('txt'); fadeBlack(false, 1600); await wait(1500); if (ep !== EP) return; bars(false); frozen = false; setStage(43);
};
ON[44] = () => { };
ON[45] = () => { unlock('melissa'); unlock('wind'); };

/* ---------- the storm sequence (chapter 1's night and chapter 3's morning): an opt-in card, then a scripted scene ---------- */
function stormIntro(kind) {
  if (ST.on) return; const L = LINES[kind];
  card(L.cardTitle, ['The next part is loud, and it may be scary.', 'Nobody is hurt on the screen. Everyone in this story stays together.'], [{ t: 'Begin', go: () => { hideCard(); stormRun(kind); } }, { t: 'Read what happened instead', go: () => { hideCard(); stormSkip(kind); } }], { col: true });
}
function stormSkip(kind) { const L = LINES[kind]; unlock(L.page); card('What happened', L.skip, [{ t: 'Go on', go: () => { hideCard(); stormAfter(kind); } }], { col: true }); }
const HOLD = { on: false, v: 0 };
for (const ev of ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel']) $('hold').addEventListener(ev, (e) => { HOLD.on = ev === 'pointerdown'; $('hold').classList.toggle('on', HOLD.on); e.preventDefault(); });
addEventListener('keydown', (e) => { if ($('holdwrap').hidden) return; if (e.key === ' ' || e.key === 'Enter') HOLD.on = true; }); addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') HOLD.on = false; });
/* the roof lifts: a few sheets over the middle of the room come off one by one and sail away. Each sheet remembers where it began (p0, r0, set when the place is built), so a chapter can be played again. */
const roofSheets = (P) => (P.group.userData.roof ? P.group.userData.roof.userData.sheets : []);
const tornSet = (P, n) => { const sh = roofSheets(P), mid = sh.reduce((a, s) => a + s.i, 0) / (sh.length || 1); return sh.filter((s) => Math.abs(s.i - mid) <= n / 2).sort((a, b) => Math.abs(a.i - mid) - Math.abs(b.i - mid)); };
function tearRoof(P, n = 5) {
  P.tornN = n; tornSet(P, n).forEach((s, j) => { const m = s.m, p0 = m.userData.p0, r0 = m.userData.r0, d = new THREE.Vector3((Math.random() - 0.2) * 4, 4 + Math.random() * 3, s.side * (2 + Math.random() * 4)), sp = (Math.random() - 0.5) * 3;
    setTimeout(() => { if (!ST.on) { m.visible = false; return; } SFX.zincBang(0.8); tween(1.8, (k) => { m.position.set(p0.x + d.x * k, p0.y + d.y * k * k, p0.z + d.z * k); m.rotation.set(r0.x + sp * k * 1.5, r0.y + sp * k, r0.z + sp * k * 2); }).then(() => { m.visible = false; }); }, j * 300 * TS); });
}
function restoreRoof(P, torn, n = P.tornN || 5) { const hide = torn ? new Set(tornSet(P, n).map((s) => s.m)) : new Set(); for (const s of roofSheets(P)) { s.m.position.copy(s.m.userData.p0); s.m.rotation.copy(s.m.userData.r0); s.m.visible = !hide.has(s.m); } }
/* what the wind throws across the gap in the roof: zinc sheets, and in 1988 the big satellite dishes torn off their posts */
function skyDebris(kind) {
  const o = new THREE.Vector3(state.x, 0, state.z), v = (x, y, z) => o.clone().add(new THREE.Vector3(x, y, z));
  STORM.throwSheet(v(-9, 5, 4), v(9, 6, -5), 2.2); setTimeout(() => STORM.throwSheet(v(8, 4, 5), v(-8, 7, -4), 2.2), 1500 * TS);
}
/* the one dish's flight, shared by the cutaway and the dev view: k runs 0 to 1 from its post, over the wall, toward the crowded yards */
const dishAt = (d, p0, r0, k) => { d.position.set(p0.x + 9 * k, p0.y + 2.2 * k + Math.sin(k * PI) * 3.4, p0.z + 11 * k); d.rotation.set(r0.x + k * 6.5, r0.y + k * 4.1, r0.z + k * 8.2); };
/* Gilbert's storm scene begins in Kingston at midday, when the eye passed over: an uptown house behind a high wall, and crowded zinc-roofed yards across the street.
   A cutaway with the camera director. The one satellite dish is torn from its post here. Skipped with the rest of the scene by "Read what happened instead". */
async function kingstonCutaway() {
  const ep = EP, K = LINES.kingston, live = () => ep === EP && ST.on, P = PL.kingston88; if (!P) return true;
  const d = P.dish, p0 = d.position.clone(), r0 = d.rotation.clone(); d.visible = true; d.position.copy(p0); d.rotation.copy(r0);
  fadeBlack(true, 800); await wait(900); if (!live()) return false;
  enterPlace('kingston88', { env: ENV.gale }); frozen = true; WIND.k = 0.85; STORM.set({ rain: 0.7, wind: [1.2, 0.4], leaves: 0.8 }); SB = { wind: 0.7, howl: 0.35, roar: 0.25, rain: 0.4, rattle: 0.2 };
  $('fadeT').textContent = K.title; $('fadeS').textContent = K.sub; $('fade').classList.add('txt'); await wait(2600); if (!live()) return false; $('fade').classList.remove('txt'); fadeBlack(false, 900);
  say(K.b[0], 3800); cut([-8, 5.6, 3.4], [2, 5.8, 3.4], [-12, 2.6, -10], [6, 2.4, 8], 4.0); await wait(4100); if (!live()) return false;
  say(K.b[1], 3600); cut([-4, 4.6, 2.6], [-12, 4.8, 2.0], [-14, 2.8, -14], [-14, 3.0, -14], 3.8); await wait(3900); if (!live()) return false;
  say(K.b[2], 4800); cut([-27, 4.4, 0.6], [-26, 4.0, -0.6], [-24.5, 2.2, -10.2], [-23, 3.2, -10.2], 4.4); await wait(1500); if (!live()) return false;
  SFX.zincBang(0.9); SFX.gust(1, 2.4); FX.shake = 0.3; tween(2.9, (k) => dishAt(d, p0, r0, k)); await wait(3000); if (!live()) return false;
  d.visible = false; FX.shake = 0.15; say(K.b[3], 4200);
  STORM.throwSheet(new THREE.Vector3(4, 0.2, 9), new THREE.Vector3(14, 3, 1), 2.4); STORM.throwSheet(new THREE.Vector3(-9, 0.5, 14), new THREE.Vector3(1, 2.6, 6), 2.6); setTimeout(() => STORM.throwSheet(new THREE.Vector3(21, 0.2, 8), new THREE.Vector3(8, 3, 0), 2.2), 900 * TS);
  cut([-5, 3.0, 1.8], [3, 3.2, 1.6], [2, 2.6, 9], [9, 3.4, 9], 4.2); await wait(4300); if (!live()) return false;
  say(K.b[4], 3800); cut([-33, 5.5, 0.5], [-24, 5.2, 0.5], [10, 2.5, 0], [4, 2.5, 0], 4.0); await wait(4100); if (!live()) return false;
  fadeBlack(true, 900); await wait(1000); if (!live()) return false;
  endCut(); frozen = false; FX.shake = 0; STORM.clear(); d.position.copy(p0); d.rotation.copy(r0); d.visible = true;
  enterPlace(BYGONE.g88.room, { env: ENV.room }); WIND.k = 0.6; fadeBlack(false, 900); await wait(800); return live();
}
async function stormRun(kind) {
  const ep = EP, P = P_(), L = LINES[kind], hall = kind === 'm25', live = () => ep === EP && ST.on, lights = hall ? P.lights : [P.lampLight];
  ST.on = true; moveLock = true; busy = false; frozen = false; talkWith = null; keys.clear(); stick.id = null; bars(true); goalText = ''; $('goal').textContent = ''; $('hint').hidden = true;
  const step = async (ms, fn) => { await wait(ms); if (!live()) return false; fn(); return true; };
  const lightK = (k) => { for (const l of lights) { l.userData.k = k; } };
  if (kind === 'g88') { await ensurePlace('kingston88'); if (!(await kingstonCutaway())) return; }   /* the storm begins in Kingston */
  SB = { wind: 0.5, howl: 0.2, roar: 0.15, rattle: 0.15 }; WIND.k = 0.6; FX.shake = 0.05;
  say(L.b[0], 4200); await wait(4400); if (!live()) return;
  if (!(await step(100, () => { say(L.b[1], 4000); SB = SB_GROAN; FX.shake = 0.12; SFX.roofGroan(); }))) return;
  if (!(await step(3800, () => { say(L.b[2], 3800); lightK(0.2); setTimeout(() => lightK(1), 160); setTimeout(() => lightK(0), 420); SFX.zincBang(0.9); FX.shake = 0.25; torch(true); }))) return;
  if (!(await step(3800, () => { say(L.b[3], 4000); SB = SB_LIGHT; FX.shake = 0.4; SFX.gust(1, 3); ease2(envNow, ENV.roomStorm, 3); }))) return;
  /* hold on: press and hold to keep steady while the wind builds */
  $('holdwrap').hidden = false; HOLD.v = 0; goalText = 'Hold on!'; showGoal();
  const gust = tween(4.6, (k, dk) => { const held = HOLD.on ? 1 : 0; HOLD.v = clamp01(HOLD.v + (held ? 0.9 : -0.5) * dk * 4); $('holdbar').firstElementChild.style.width = (HOLD.v * 100) + '%'; FX.shake = 0.45 + k * 0.5 - HOLD.v * 0.25; FX.roll = Math.sin(k * 40) * 0.008; if (Math.random() < 0.04) SFX.zincBang(0.4); });
  if (!(await gust)) return; if (!live()) return; $('holdwrap').hidden = true; goalText = ''; $('goal').textContent = '';
  /* the roof lifts */
  SFX.treeCrack(1.2); FX.shake = 0.9; SB = SB_PEAK; flash(0.6, 40, '#ffffff'); setTimeout(() => flash(0, 260, '#ffffff'), 80);
  tearRoof(P, kind === 'm25' ? 6 : 5); WIND.k = 1; skyDebris(kind); STORM.mask(P.group.position.x + 0, P.group.position.z + 0, kind === 'm25' ? 5 : 3); STORM.set({ rain: 0.9, wind: [1.2, 0.5], leaves: 0.9 }); say(L.b[4], 4200);
  const camA = [state.x, EYE, state.z]; cut(camA, camA, [state.x + 1, EYE + 0.3, state.z], [state.x + 0.4, EYE + 5, state.z - 0.4], 2.6).then(() => {});
  await wait(3600); if (!live()) return; endCut(); FX.shake = 0.5; say(L.b[5], 4200); 
  if (hall) { SB.hymn = 0.8; } await wait(4400); if (!live()) return; say(L.b[6], 4200); FX.shake = 0.3; await wait(4400); if (!live()) return;
  say(L.b[7], 3600); SB = { wind: 0.7, howl: 0.3, roar: 0.4, rain: 0.6, hymn: hall ? 0.6 : 0 }; FX.shake = 0.15; await wait(3800); if (!live()) return;
  fadeBlack(true, 1800); await wait(2000); if (!live()) return;
  $('fadeT').textContent = L.title; $('fadeS').textContent = L.sub; $('fade').classList.add('txt'); unlock(L.page); unlock(L.page2); await wait(5400); if (!live()) return; $('fade').classList.remove('txt'); await wait(700); if (!live()) return;
  ST.on = false; stormAfter(kind, true);
}
function stormAfter(kind, fromRun) {
  const P = P_(), hall = kind === 'm25'; ST.on = false; moveLock = false; SB = null; endCut(); FX.shake = 0; FX.roll = 0; $('holdwrap').hidden = true; STORM.mask(0, 0, 1e5); STORM.clear(); weather(0.1, 0, null); setBedsFor('after'); torch(false);
  for (const l of hall ? P.lights : [P.lampLight]) l.userData.k = 0; restoreRoof(P, true); setEnv(mixEnv(ENV.after, ENV.room, 0.5));
  bars(false); fadeBlack(false, fromRun ? 3200 : 700); frozen = false; busy = false;
  const st = hall ? 44 : BYGONE[kind].base + 5; setStage(st); say(LINES[kind].morning, 5200);
}
/* the torch in your hand: a small light that follows the view, used in the dark */
function torch(on) { handLamp.intensity = on ? 3.4 : 0; lampMesh.visible = on; }

/* ---------- chapter 4: the morning after ---------- */
ON[50] = () => { weather(0.04, 0, ENV.after); setBedsFor('after'); const P = P_(); P.tarpHome.visible = false; };
const FOLLOW = { pearlA: { gap: 1.6, side: 0.6, space: 0.9 } };   /* Mum walks home with you, a step behind and to one side (engine/follow.js) */
ON[51] = () => { const m = byId('pearlA'); if (m) { m.ctl.play(null); follow(m, FOLLOW.pearlA); } };
ON[52] = () => { };
function houseLook() {
  const P = P_(); unlock('afterhouse'); ctr.look = 1;
  card('Home', ['Half the roof is gone. The sky shows where the zinc used to be.', 'The window boards held, and the walls are standing.', 'Mum holds your hand. "Things can be mended," she says. "We are together."'], [{ t: 'Go on', go: () => { hideCard(); const m = byId('pearlA'); if (m) stopFollow(m); setStage(53); } }], { col: true });
}
ON[53] = () => { };
ON[55] = () => { unlock('neighbours'); unlock('afterhouse'); };

/* ---------- chapter 5: the days after ---------- */
function clearTree(P, quiet) { const tw = P.group.userData.treeWall; if (tw) { const i = P.walls.indexOf(tw); if (i >= 0) P.walls.splice(i, 1); } if (P.group.userData.fallen) P.group.userData.fallen.visible = false; if (P.group.userData.logs) P.group.userData.logs.visible = true; if (!quiet) SFX.sawStart(); }
ON[60] = () => { weather(0.05, 0, ENV.overcast); setBedsFor('after'); const P = P_(); P.tarpHome.visible = false; for (const n of P.people) { if (n.stage5) n.hidden = false; n.m.visible = !n.hidden && cur === 'after'; } };
ON[61] = () => { setBedsFor('saw'); };
ON[62] = () => { setBedsFor('after'); };
ON[63] = async () => {
  const ep = EP; frozen = true; busy = false; bars(true); say('A helicopter flies over, low and loud. It is carrying food and water.', 4200); setBedsFor('heli'); await wait(4400); if (ep !== EP) return; say('The soldiers and the volunteers come from many places.', 4000); await wait(4200); if (ep !== EP) return;
  setBedsFor('after'); endCut(); frozen = false; bars(false); setStage(64);
};
async function lightsBack() {
  const P = P_(), ep = EP; frozen = true; ctr.on = 1; SFX.chime(520); say('Click. The light comes on. Everyone cheers!', 3800); P.homeLamp.intensity = 7; P.homeLamp.visible = true; await wait(3800); if (ep !== EP) return; frozen = false; setStage(65);
}
ON[65] = () => { unlock('recovery'); unlock('help'); unlock('compare'); };

/* ---------- chapter 6: today ---------- */
ON[70] = () => { weather(0.05, 0, ENV.day); setBedsFor('after'); };
function quiz(list, round, done) {   /* a few questions on cards: a wrong answer says why and lets you try again; the right one moves on */
  const R = list[round]; if (!R) { done(); return; }
  card(R.q, [R.note], R.opts.map((o) => ({ t: o.t, go: () => { if (o.ok) { uiSound('goal'); toast(o.say, 3000); quiz(list, round + 1, done); } else { toast(o.say, 3000); } } })), { col: true });
}
function kitQuiz(round) {
  quiz(KIT, round, () => { unlock('kit'); card('A good kit', ['You packed well: water, food that keeps, a torch, a radio, a charged phone, medicine and papers in a bag.', 'A kit is small, but it helps a lot.'], [{ t: 'Next', go: () => { hideCard(); quiz(STORMS, 0, () => { unlock('storms'); card('Jamaica\'s storms', ['Hurricanes are not new to Jamaica. They come, and people get ready and rebuild.', 'Read about the earlier storms in your Journal.'], [{ t: 'Done', go: () => { hideCard(); setStage(73); } }], { col: true }); }); } }], { col: true }); });
}
ON[74] = () => { unlock('journey'); setTimeout(() => card('The end', LINES.end, [{ t: 'Read your journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }, ...(MENU.ok ? [{ t: 'Main Menu', go: toMenu }] : []), { t: 'Stay here', go: hideCard }], { col: true }), 1200 * TS); };

/* ---------- the helper arrow: stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
const NUDGE_EXTRA = { 51: () => [-26, -3.4] };
function nudgeTarget() {
  const P = P_(); if (!P) return null; if (NUDGE_EXTRA[stage]) return NUDGE_EXTRA[stage](); const a = P.actions.find((x) => x.on()); if (a) return [a.x, a.z];
  let bestT = null, bd = 1e9; for (const n of P.people) if (n.m && n.m.visible && wantsTalk(n)) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; bestT = [n.x, n.z]; } } return bestT;
}
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return; const quiet = state.started && !busy && !frozen && !DIR.on && !ST.on && $('holdwrap').hidden && $('dialogue').hidden && $('card').hidden && $('place').style.opacity !== '1' && !document.body.classList.contains('subbing') && goalText && !fading;
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz) > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = Math.max(NUDGE.since, now - 30000); NUDGE.still = now; }
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && (now - NUDGE.still > 15000 || now - NUDGE.since > 50000)) { NUDGE.on = true; showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); }
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 2.2) { NUDGE.on = false; NUDGE.since = NUDGE.still = now; }
  if (!NUDGE.on || !tgt) { el.hidden = true; return; } el.hidden = false;
  const W = innerWidth, H = innerHeight, dx = tgt[0] - state.x, dz = tgt[1] - state.z, rel = Math.atan2(-dx, -dz) - state.yaw, a = Math.atan2(Math.sin(rel), Math.cos(rel));
  _nv.set(tgt[0], 2.0, tgt[1]).project(camera); const lab = el.querySelector('span');
  if (Math.abs(a) < 0.55 && _nv.z < 1) { el.style.left = Math.max(60, Math.min(W - 60, (_nv.x + 1) / 2 * W)) + 'px'; el.style.top = Math.max(110, Math.min(H * 0.62, (1 - _nv.y) / 2 * H)) + 'px'; el.className = 'down'; const sy = (1 - _nv.y) / 2 * H; lab.textContent = sy > H * 0.75 ? 'Look down' : sy < 90 ? 'Look up' : 'Here!'; }
  else { const left = a > 0; el.style.left = (left ? 58 : W - 58) + 'px'; el.style.top = (H * 0.45) + 'px'; el.className = left ? 'left' : 'right'; lab.textContent = 'This way'; }
}

/* ---------- sound: each place has its own mix, and now and then one small sound ---------- */
let auNext = 0, onceAt = 6; const AMB = 0.4;
const SOUNDSCAPE = { yard51: { sea: 0.12, surf: 0.05, once: () => (Math.random() < 0.5 ? gullCry() : chirp()) }, room51: { room: 0.1, sea: 0.03 }, kingston88: {}, yard88: { once: chirp }, yard25: { once: chirp }, hall: { crowd: 0.2 }, room88: { room: 0.1 }, after: {}, today: { once: chirp } };
const FOOT = { yard51: 'sand', room51: 'wood', kingston88: 'stone', yard88: 'grass', yard25: 'grass', after: 'grass', today: 'grass', room88: 'wood', hall: 'stone' };
function audioTick(t, now) {
  if (!AU.ctx) return; SFX.hymnTick(t); if (t < auNext) return; auNext = t + 0.1; const S = SOUNDSCAPE[cur] || {};
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], SB ? 0 : (S[k] || 0) * AMB, 0.4);
  const B = SB || BEDS_BY[bedsKey] || {}, indoor = cur === 'hall' || cur === 'room88' || cur === 'room51', wk = SB ? 1 : indoor ? 0.6 : 1;
  SFX.setBeds({ wind: (B.wind || 0) * wk, howl: B.howl, roar: B.roar, rain: B.rain, rattle: B.rattle, hymn: B.hymn, saw: B.saw, heli: B.heli, gen: B.gen, cricket: B.cricket }, 0.4);
  if (t > onceAt) { onceAt = t + 6 + Math.random() * 6; if (S.once && AU.on && state.started && !SB && WIND.k < 0.25) S.once(); }
}

/* ---------- loading and starting ---------- */
applySave(loadGame());
{ let done = 0; const total = 3; const tick = () => { done++; $('bar').style.width = (done / total * 100) + '%'; };
  buildPlace('yard25'); enterPlace('yard25');   /* the village in the calm before the storm, as a backdrop for the title card */
  const first = CH_PLACE[hasSave && stage >= 10 ? chapterOf(stage) : 0];
  model('anims').then((an) => { loadClips(an); tick(); return ensurePlace(first); }).then(() => { tick(); modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; tick();
    if (__DEV__) devViews(); else setTimeout(backgroundLoad, 2500); }); }
async function backgroundLoad() { for (const id of ['yard25', 'hall', 'after', 'today', 'yard88', 'room88']) { await ensurePlace(id); await wait(400); } }
function startGame(quiet) {
  if (state.started) return; audioInit(); SFX.initBeds(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk or use.'; showHint(); canvas.focus(); if (!quiet) cue('begin');
}
$('start').onclick = () => { startGame(); const st = stage >= 10 ? (SAFE[stage] || stage) : 10; beginChapter(hasSave && stage >= 10 ? chapterOf(stage) : 0, hasSave && stage >= 10 ? st : 10); setTimeout(backgroundLoad, 4000); };

/* ---------- the frame loop ---------- */
let stepT = 0, frameN = 0;
function update(dt, now) {
  const P = P_(); if (!P) return;
  if (DIR.on) { DIR.t += dt; if (DIR.t >= DIR.dur && DIR.resolve) { const r = DIR.resolve; DIR.resolve = null; r(true); } }
  if (state.started && !busy && !frozen && !DIR.on) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    if (!moveLock) { let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
      if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1; const len = Math.hypot(f, r);
      if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.3) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw); sitting = false;
        [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt); stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; stepSound(FOOT[cur]); } } }
  }
  if ((frameN & 7) === 0) for (const n of P.extras) { const d = Math.hypot(state.x - n.x, state.z - n.z); n.m.visible = d < 75 && !n.hidden; }
  for (const n of P.npcs) npcTick(n, dt);
  near = null; if (state.started && !busy && !frozen && !DIR.on) { let b = 2.6; for (const n of P.people) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && n.m.visible && d < b) { b = d; near = n; } } for (const a of P.actions) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }
  const tb = $('talk'); tb.hidden = !(near && near.go); if (near && near.go) tb.textContent = near.label;
  for (const n of P.npcs) if (n.m.visible && n.ctl) { n.ctl.mx.update(dt); n.ctl.tick(dt); if (n.m.userData.grips) gripTick(n.m); }
  if ((frameN++ & 1) === 0) for (const m of P.bodies) if (m.visible && !m.userData.noGround) groundFeet(m);
  if (P.tick) P.tick(dt, (now || 0) / 1000); lightTick(P, dt, (now || 0) / 1000); STORM.tick(dt, (now || 0) / 1000); if (P.sway) swayTick(P.sway, (now || 0) / 1000, WIND.k, WIND.dir);
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](dt)) TICKS.splice(i, 1);
  if (cur === 'after' && stage === 51 && Math.hypot(state.x - P.spots.home[0], state.z - P.spots.home[1]) < 6.5) setStage(52);
  if (now !== undefined) { audioTick(now / 1000, now); bubbleTick(now / 1000); stickUI(); nudgeTick(now); }
}
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  if (DIR.on) { const k = ease(Math.min(1, DIR.t / DIR.dur)); camera.position.lerpVectors(DIR.a, DIR.b, k); _v.lerpVectors(DIR.la, DIR.lb, k); camera.lookAt(_v); }
  else if (!state.started && P_() && P_().titleView) { const tv = P_().titleView, s = t / 1000; camera.position.set(tv.x - Math.sin(s * 0.08) * 3, tv.y, tv.z); camera.rotation.set(tv.pitch, tv.yaw + Math.sin(s * 0.05) * 0.04, 0, 'YXZ'); }
  else { camera.position.set(state.x, EYE - (sitting ? 0.35 : 0) + FX.bob, state.z); camera.rotation.set(state.pitch, state.yaw, FX.roll + FX.tilt, 'YXZ'); }
  if (FX.shake > 0) { const k = FX.shake; camera.position.x += (Math.random() - 0.5) * k * 0.07; camera.position.y += (Math.random() - 0.5) * k * 0.07; camera.position.z += (Math.random() - 0.5) * k * 0.07; camera.rotation.z += (Math.random() - 0.5) * k * 0.035; }
  sun.target.position.set(camera.position.x, 0, camera.position.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 110); birds.tick(t / 1000, !!(P_() && envNow.stars < 0.3 && cur !== 'hall' && cur !== 'room88' && !ST.on && WIND.k < 0.3), camera.position.x, camera.position.z);
  sky.dome.position.copy(camera.position); sky.stars.position.copy(camera.position); sky.moon.position.set(camera.position.x - 190, camera.position.y + 230, camera.position.z - 380);
  if (__DEV__ && MV) { MV(); return; }
  if (!NORENDER) renderer.render(scene, camera);
}
let MV = null;   /* dev only: the model viewer (?shot=model) draws the picture itself */
const NORENDER = __DEV__ && /[?&]auto=/.test(location.search);   /* the scripted playthrough does not need pictures, and software drawing is slow */
requestAnimationFrame(frame);
/* the lights of a room: a base brightness, k (0 off to 1 on) and a little flicker. userData.k is set by the story (the storm switches them off). */
function lightTick(P, dt, t) { const Ls = P.lights || (P.lampLight ? [P.lampLight] : null); if (!Ls) return; Ls.forEach((l, i) => { if (l.userData.base === undefined) l.userData.base = l.intensity || 6; const k = l.userData.k === undefined ? 1 : l.userData.k; l.intensity = l.userData.base * k * (1 + Math.sin(t * 7 + i * 2) * 0.03 + (ST.on && k > 0 ? Math.sin(t * 31 + i) * 0.07 : 0)); }); }

/* ---------- the place audit (dev builds): the checks live in engine/audit.js. Run ?test=audit and expect 0 issues in every place. ---------- */
const auditPlace = (P) => { const r = auditPlaceBase(P); for (const n of P.npcs) if (/^Sit/.test(n.anim || '') && n.m.userData.anim) { n.m.userData.anim.mx.update(0.1); if (!n.m.userData.noGround) groundFeet(n.m);   /* the same step the game runs every other frame */
       for (const l of auditSeated(n.id || n.base, n.m, P.snap, n.m.userData.ground || 0, SEATLOG)) r.inside.push(l); } return r; };
const SEATLOG = [];   /* ?test=audit&seats=1 also prints how high each seated person's hips are above the seat */
const auditPlaceBase = (P) => auditPlaceE({ id: P.id, snap: P.snap, npcs: P.npcs.map((n) => ({ id: n.id || n.base, x: n.hx, z: n.hz, anim: n.anim, ground: n.m.userData.ground || 0, path: n.path })), walls: P.walls, bounds: P.bounds, start: P.start,
  actions: P.actions, people: P.people.map((n) => ({ id: n.id, x: n.x, z: n.z, anim: n.anim })) });

/* ---------- test views and scripted playthroughs: dev builds only (node tools/build.mjs melissa --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), errs = [];
  addEventListener('error', (e) => { errs.push(e.message + ' @ ' + String((e.error && e.error.stack) || '').split('\n').slice(1, 3).join(' <- ').replace(/https?:[^ )]*\//g, '')); document.title = 'ERROR ' + errs.join(' | '); const el = $('autolog'); if (el) el.textContent += '\n' + errs[errs.length - 1]; });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.title = 'ERROR ' + errs.join(' | '); });
  const go = async (id, st, x, z, yaw, pitch, env) => { const P = await ensurePlace(id); $('title').hidden = true; $('hud').hidden = false; state.started = true; enterPlace(id, { env }); stage = st; best = Math.max(best, st); state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); refreshGoal(); return P; };
  /* views: [place, stage, x, z, yaw, pitch, env]. yaw 0 looks toward -z, -PI/2 toward +x (east). */
  const V = {
    y88a: ['yard88', 20, -35, 0.4, -PI / 2, 0], y88b: ['yard88', 21, -22, 1.6, -PI / 2 + 0.7, 0], y88c: ['yard88', 22, 8, 1.2, -PI / 2, 0.02], y88d: ['yard88', 23, 14, -0.8, -PI / 2 + 0.2, 0],
    y25a: ['yard25', 30, -35, 0.4, -PI / 2, 0], y25b: ['yard25', 31, -24, 1.6, -0.3, 0.03], y25c: ['yard25', 31, 24, 2.4, -PI / 2 - 0.6, 0.02], y25d: ['yard25', 33, 10, -0.6, -PI / 2 + 0.5, 0.1], y25e: ['yard25', 35, 38, 0.2, -PI / 2 + 0.2, 0],
    aft1: ['after', 50, 36, 0.4, PI / 2, 0], aft2: ['after', 51, -6, 3.4, PI / 2 + 0.4, 0], aft3: ['after', 52, -26, -1.8, 0, 0.12], aft4: ['after', 53, -14, 5.5, -PI / 2 - 0.3, 0.02], aft5: ['after', 54, 4, 3, PI / 2 - 0.2, 0.05], aft6: ['after', 61, 20, 2.2, -PI / 2 - 0.4, 0],
    tdy1: ['today', 70, -30, 0.4, -PI / 2, 0], tdy2: ['today', 71, 30, 1.8, -PI / 2 + 0.3, 0], tdy3: ['today', 70, -10, 3.6, PI / 2, 0.02],
    room1: ['room88', 24, 0, 1.4, 0, 0], room2: ['room88', 24, 1.8, 1.6, 0.9, 0], room3: ['room88', 24, -1.5, -1.0, 2.5, 0.35],
    aftA: ['after', 52, -8, 3.5, 0.95, 0.03], aftB: ['after', 51, 36, -1.4, PI / 2 + 0.12, 0.03], c51a: ['yard51', 10, -35, 0.4, -PI / 2, 0], c51b: ['yard51', 11, 8.5, 7.8, PI, 0.03], c51c: ['yard51', 12, 4, 1.4, -PI / 2 - 0.9, 0.02], r51: ['room51', 14, 0, 1.4, 0, 0], aftC: ['after', 54, -9.5, 2.0, -PI / 2, 0.05],
    hall1: ['hall', 40, -6.2, 0.2, -PI / 2, 0], hall2: ['hall', 40, 0, 0.0, PI / 2, 0.02], hall3: ['hall', 41, 0.5, -2.2, 0.3, 0.02], hall4: ['hall', 43, -6, 0, -PI / 2 + 0.5, 0.0],
  };
  /* ?shot=model&m=people&ids=pearl,winston&one : people lined up for a close look. m=house|shop|fallen|props|roof show code-built things from four sides. */
  if (shot === 'model') go('yard25', 30, 0, 0, 0, 0).then(async (P) => {
    const pids = (q.get('ids') || '').split(',').filter(Boolean), plo = q.has('lo'); if (pids.length) await Promise.all(pids.map((id) => loadBase(LOOKS[id].base + (plo ? '_lo' : ''))));
    P.group.visible = false; $('hud').hidden = true; const m = q.get('m') || 'people', num = (k, d) => (q.has(k) ? +q.get(k) : d), root = new THREE.Group(); scene.add(root);
    const MODELS = { house: [() => HSE.house({ style: q.get('style') || 'block', roof: q.get('roof') || 'on', shutters: q.get('sh') || 'open', tank: true }), 9, 4, 1.6], shop: [() => HSE.shop({ roof: q.get('roof') || 'on' }), 9, 4, 1.6], fallen: [() => HSE.fallenTree(), 11, 4, 1.2], props: [() => { const g = new THREE.Group(); [HSE.waterDrum(), HSE.jug(), HSE.goBag(), HSE.radio(), HSE.tins(), HSE.bread(), HSE.candle(), HSE.kerosene(), HSE.zincSheet({ len: 2.2, curl: 0.4 }), HSE.plank(1.5, 2), HSE.mattress(), HSE.standpipeTap(), HSE.clothes()].forEach((o, i) => { o.position.x = (i - 6) * 0.95; g.add(o); }); return g; }, 4.6, 1.4, 0.4], wreck: [() => { const g = new THREE.Group(); [HSE.bareTree(5, 2), HSE.snappedPalm(6, 1), HSE.leaningPole({ lean: 0.38 }), HSE.cutLogs()].forEach((o, i) => { o.position.x = (i - 1.5) * 4.2; g.add(o); }); return g; }, 15, 5, 1.8], tank: [() => HSE.tankOnStand(), 7, 3, 1.5],
      people: [() => { const g = new THREE.Group(); pids.forEach((id, i) => { const b = makeBody({ ...LOOKS[id], bodyId: LOOKS[id].base + (plo ? '_lo' : ''), x: (i - (pids.length - 1) / 2) * 0.75, z: 0, ry: 0, anim: q.get('anim') || 'Idle' }); b.userData.anim.mx.update(+(q.get('at') || 0.4)); g.add(b); }); return g; }, 3.2, 1.3, 1.0] };
    const [make, d0, h0, t0] = MODELS[m] || MODELS.people, obj = make(); root.add(obj);
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x9a9c8c, roughness: 1 })); gr.rotation.x = -PI / 2; gr.position.y = -0.005; gr.receiveShadow = true; root.add(gr);
    root.traverse((o) => { if (o.isMesh && o !== gr) o.castShadow = o.receiveShadow = true; });
    const a0 = num('a', 0.5), d = num('d', d0), h = num('h', h0), ty = num('t', t0), one = q.has('one'); let n = 0;
    MV = () => { const W = renderer.domElement.width, Hh = renderer.domElement.height, angs = one ? [a0] : [a0, a0 + 1.35, a0 + PI, a0 + PI + 1.1]; renderer.setScissorTest(true);
      angs.forEach((a, i) => { const w = one ? W : W / 2, hh = one ? Hh : Hh / 2, x = one ? 0 : (i % 2) * w, y = one ? 0 : (1 - (i >> 1)) * hh, pr = renderer.getPixelRatio(); renderer.setViewport(x / pr, y / pr, w / pr, hh / pr); renderer.setScissor(x / pr, y / pr, w / pr, hh / pr);
        camera.aspect = w / hh; camera.fov = 40; camera.updateProjectionMatrix(); camera.position.set(-Math.cos(a) * d, h, Math.sin(a) * d); camera.lookAt(0, ty, 0); sun.target.position.set(0, 0, 0); sun.position.copy(sunDir).multiplyScalar(110); sun.target.updateMatrixWorld(); renderer.render(scene, camera); });
      if (++n === 3) { let tris = 0, calls = 0; obj.traverse((o) => { if (o.isMesh) { calls += Array.isArray(o.material) ? o.material.length : 1; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1); } }); document.title = 'MODEL ' + m + ' meshes=' + calls + ' tris=' + Math.round(tris); } };
  });
  /* ?shot=cam&p=kingston88&c=x,y,z&l=x,y,z : the camera director's view, frozen. &dishk=0.4 puts the dish part way through its flight, &rain=1 adds weather. */
  if (shot === 'cam') go(q.get('p') || 'kingston88', 20, 0, 0, 0, 0).then((P) => {
    const n = (k, d) => (q.get(k) || d).split(',').map(Number); $('hud').hidden = true; DIR.on = true; DIR.t = 0; DIR.dur = 1e6; DIR.resolve = null; DIR.a = new THREE.Vector3(...n('c', '0,3,6')); DIR.b = DIR.a.clone(); DIR.la = new THREE.Vector3(...n('l', '0,2,0')); DIR.lb = DIR.la.clone();
    if (q.has('rain')) { WIND.k = 0.85; STORM.set({ rain: +q.get('rain'), wind: [1.2, 0.4], leaves: 0.8 }); setEnv(ENV[q.get('sky') || 'gale']); }
    if (q.has('dishk') && P.dish) dishAt(P.dish, P.dish.position.clone(), P.dish.rotation.clone(), +q.get('dishk'));
    if (q.has('sheets')) { STORM.throwSheet(new THREE.Vector3(4, 0.2, 9), new THREE.Vector3(14, 3, 1), 2.4); STORM.throwSheet(new THREE.Vector3(-9, 0.5, 14), new THREE.Vector3(1, 2.6, 6), 2.6); STORM.tick(1.1, 3); for (const f of [...STORM.sheets, ...STORM.dishes]) f.dur = 1e6; }
    for (let i = 0; i < 4; i++) update(0.05); P.sway && swayTick(P.sway, 2, WIND.k, [1.2, 0.4]); });
  /* ?shot=follow : Mum comes home with you. You walk a few metres, stop, and turn round to look at her (engine/follow.js). &wait= frames after you stop */
  if (shot === 'follow') go('after', 51, 32, -0.4, PI / 2, 0).then((P) => { ON[51](); const route = [[27, 0], [22, 0.2]], n = byId('pearlA'); for (const [tx, tz] of route) for (let i = 0; i < 900 && Math.hypot(tx - state.x, tz - state.z) > 0.05; i++) { const d = Math.hypot(tx - state.x, tz - state.z), k = Math.min(1, 2.3 / 30 / d); [state.x, state.z] = clampPos(state.x + (tx - state.x) * k, state.z + (tz - state.z) * k); update(1 / 30); } for (let i = 0; i < +(q.get('wait') || 60); i++) update(1 / 30); state.yaw = Math.atan2(-(n.x - state.x), -(n.z - state.z)) + (+(q.get('turn') || 0)); state.pitch = -0.12; document.title = 'FOLLOW ' + n.id + ' ' + Math.hypot(n.x - state.x, n.z - state.z).toFixed(2) + ' m'; });
  if (shot === 'talk1') go('yard25', 30, -27, 0.4, -0.2, 0).then(() => { startTalk(byId('pearl')); });
  if (shot === 'talk2') go('hall', 40, -2.4, 0.3, PI / 2, 0).then(() => { startTalk(byId('pearlH')); });
  if (shot === 'card1') go('hall', 43, -1.0, 1.0, PI / 2, 0).then(() => { stormIntro('m25'); });
  if (shot === 'journal1') go('yard25', 30, -27, 0.4, 0, 0).then(() => { for (const id of ['gilbert', 'hurricanes', 'warnings', 'wires']) unlock(id, true); openJournal('gilbert'); });
  if (shot === 'chap1') go('yard25', 30, -27, 0.4, 0, 0).then(() => { best = 45; modelsReady = true; openChapters(); });
  /* the storm, frozen at its worst: ?shot=stormhall, stormroom, stormyard (add &k=1 for wind strength, &rain=0.9) */
  if (shot === 'stormhall' || shot === 'stormroom' || shot === 'stormyard') go(shot === 'stormhall' ? 'hall' : shot === 'stormroom' ? 'room88' : q.get('y') === '88' ? 'yard88' : 'yard25', shot === 'stormhall' ? 43 : shot === 'stormroom' ? 24 : 34, shot === 'stormyard' ? -6 : shot === 'stormhall' ? 0.4 : 0.4, shot === 'stormyard' ? 2.2 : 0.8, shot === 'stormyard' ? -PI / 2 + 0.2 : shot === 'stormroom' ? 0.6 : PI / 2 + 0.3, shot === 'stormhall' || shot === 'stormroom' ? 0.35 : 0.0).then((P) => {
    const kk = +(q.get('k') || 1); ST.on = true; WIND.k = kk; if (shot !== 'stormyard') { restoreRoof(P, true, shot === 'stormhall' ? 6 : 5); for (const l of shot === 'stormhall' ? P.lights : [P.lampLight]) l.userData.k = +(q.get('lamp') || 0.15); setEnv(ENV.roomStorm); STORM.mask(0, 0, shot === 'stormhall' ? 5 : 3); torch(true); } else setEnv(ENV[q.get('sky') || 'gale']);
    STORM.set({ rain: +(q.get('rain') || 0.9), wind: [1.2, 0.5], leaves: 0.9 }); for (let i = 0; i < 6; i++) update(0.05, 100 * i);
    if (q.has('pitch')) state.pitch = +q.get('pitch');
    if (q.has('fly') && shot !== 'stormyard') { const c = new THREE.Vector3(state.x - Math.sin(state.yaw) * 2.6, 0, state.z - Math.cos(state.yaw) * 2.6), v = (x, y, z) => c.clone().add(new THREE.Vector3(x, y, z));   /* things crossing the sky above the gap in the roof, frozen mid-flight */
      STORM.throwSheet(v(-5, 1, 3), v(5, 2, -3), 2.4); if (q.get('fly') === 'dish') { STORM.throwDish(v(-4, 1.6, 1), v(4, 2.2, -1), 2.6); STORM.throwDish(v(3, 1.4, 4), v(-3, 2.0, -3), 2.6); } STORM.tick(1.15, 3); for (const f of [...STORM.sheets, ...STORM.dishes]) f.dur = 1e6; }
    if (shot === 'stormyard' && q.has('sheets')) { const o = new THREE.Vector3(state.x, 0, state.z), v = (x, y, z) => o.clone().add(new THREE.Vector3(x, y, z));
      STORM.throwSheet(v(9, -1.6, 4), v(4, -1.2, -4), 2.4); STORM.throwSheet(v(13, -1.5, -3), v(7, -1.0, 4), 2.2);
      if (q.get('y') === '88') { STORM.throwDish(v(12, -0.4, 3), v(5, -0.2, -3), 2.4); STORM.throwDish(v(8, -0.6, -4), v(3, -0.2, 3), 2.2); }
      STORM.tick(1.1, 3); for (const f of [...STORM.sheets, ...STORM.dishes]) f.dur = 1e6; }
  });
  if (V[shot]) go(...V[shot]).then((P) => {
    if (q.has('k')) { WIND.k = +q.get('k'); STORM.set({ rain: +(q.get('rain') || 0), wind: [1.2, 0.5], leaves: Math.min(1, WIND.k * 1.2) }); if (q.has('env')) setEnv(ENV[q.get('env')]); }
    if (q.has('sky')) setEnv(ENV[q.get('sky')]);
    if (/^hall4/.test(shot)) restoreRoof(P, false);
    if (shot === 'aft6') { P.tarpHome.visible = true; for (const n of P.people) if (n.stage5) { n.hidden = false; n.m.visible = true; } }
    if (shot === 'room3' || shot === 'hall4') torch(true);
    for (let i = 0; i < 6; i++) update(0.05);
    if (P.sway) swayTick(P.sway, 2, WIND.k, WIND.dir);
    if (q.has('stats')) setTimeout(() => { renderer.info.reset(); renderer.render(scene, camera); const i = renderer.info; const t = 'STATS calls=' + i.render.calls + ' tris=' + i.render.triangles + ' geo=' + i.memory.geometries + ' tex=' + i.memory.textures; document.title = t; console.log(t); }, 1500);
  });
  if (q.get('shot') === 'poster') go('yard25', 30, -30, 0.5, -PI / 2 + 0.05, 0.03, ENV.gold).then((P) => { $('hud').hidden = true; for (let i = 0; i < 4; i++) update(0.05); });
  if (q.get('test') === 'layout') {   /* ?test=layout : open each UI state and check that no two visible things overlap, nothing is cut off, and nothing is off the screen. Run at several window sizes. */
    (async () => { const out = [], W = innerWidth, Hh = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
      await ensurePlace('yard25'); startGame(true); enterPlace('yard25'); $('hud').hidden = false; $('title').hidden = true; stage = 31; refreshGoal(); if (W < 700) $('hint').textContent = 'Left thumb walks. Drag to look. Tap a person to talk.';   /* phones show the touch hint */
      const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'sub', 'dialogue', 'cinner', 'place', 'hold', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
      const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${Hh} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0}`); } };
      const reset = () => { for (const id of ['talk', 'toast', 'dialogue', 'card', 'holdwrap', 'nudge']) $(id).hidden = true; $('hint').hidden = true; bars(false); document.body.classList.remove('subbing', 'talking'); $('sub').classList.add('dim'); $('place').hidden = true; $('place').style.opacity = 0; };
      const settle = () => new Promise((r) => setTimeout(r, 700));
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Nail a board over the window'; showHint(); toast('Loaded 2 of 3'); showPlace('Breadnut Corner, Saturday 25 October 2025'); await settle(); check('play: goal, talk, hint, toast, place');
      reset(); showGoal(true); say('Night. The hall is full of sleeping people, and the wind grows louder and louder outside.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Mum and Gran'; showHint(); toast('Loaded 2 of 3'); await settle(); check('narration without bars');
      reset(); bars(true); say('Night. The hall is full of sleeping people, and the wind grows louder and louder outside.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Mum and Gran'; showHint(); await settle(); await new Promise((r) => setTimeout(r, 1100)); check('narration inside the bars');
      reset(); showGoal(true); document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Mr. Raymond'; $('line').textContent = 'The roof is the first thing to go. Will you hand up the nails while I fix the sheets down?'; $('choices').innerHTML = '<button class="btn ghost">Yes, I can help.</button><button class="btn ghost">Is it safe up there?</button><button class="btn ghost">I do not know how.</button>'; $('next').hidden = true; await settle(); check('dialogue with three choices');
      reset(); bars(true); say('Hold on!', 1e6); $('holdwrap').hidden = false; $('talk').hidden = true; await settle(); await new Promise((r) => setTimeout(r, 1100)); check('hold on button in the bars');
      reset(); card('Tuesday morning', ['The next part is loud, and it may be scary.', 'Nobody is hurt on the screen. Everyone in this story stays together.'], [{ t: 'Begin', go: () => {} }, { t: 'Read what happened instead', go: () => {} }], { col: true }); await settle(); check('card');
      reset(); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (Hh * 0.45 | 0) + 'px'; showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Nail a board over the window'; await settle(); check('helper arrow with talk button');
      const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) out.push(`${W}x${Hh} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Sit down with Mum and Gran'; await settle();
      openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); closeChapters();
      openJournal(); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); closeJournal();
      openCredits(); await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); closeCredits();
      document.title = 'LAYOUT ' + out.length; const el = $('autolog'); if (el) el.textContent = (out.length ? out : [W + 'x' + Hh + ': no layout problems']).join('\n'); })();
  }
  if (q.get('test') === 'held') {   /* ?test=held : every carried thing, in every place: at the hand, upright, clear of the body */
    (async () => { const out = []; startGame(true); for (const id of Object.keys(BUILD)) { const P = await ensurePlace(id); for (const n of P.npcs) if (n.m.userData.held && n.m.userData.held.length) { const ac = n.m.userData.anim, found = new Set(); for (let pose = 0; pose < 12; pose++) { ac.mx.update(ac.cur.getClip().duration / 12); gripTick(n.m); for (const l of auditHeld(n.id || n.base, n.m, n.m.userData.held)) found.add(l); } for (const l of found) out.push(id + ': ' + l); } }
      const count = out.length; out.unshift('held items: ' + count + ' issues'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'HELD ' + count; })();
  }
  if (['audit', 'collision', 'seating'].includes(q.get('test'))) {   /* ?test=audit&p=hall,after : floating objects, people inside solids, unreachable spots, seated people */
    (async () => { const ids = (q.get('p') || Object.keys(BUILD).join(',')).split(','), out = []; let count = 0; startGame(true); for (const id of ids) { const P = await ensurePlace(id); const r = auditPlace(P); count += r.floating.length + r.inside.length + r.stuck.length; out.push(id + ': ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues'); for (const l of [...r.floating, ...r.inside, ...r.stuck]) out.push('  ' + l); }
      if (q.get('seats')) out.push(...SEATLOG); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'AUDIT ' + count; })();
  }
  if (q.get('test') === 'follow') {   /* ?test=follow : you walk the real route with Mum, with stops and a turn back into her, and her is watched (engine/follow.js, watch): too close (inside the
       personal space), inside a wall or a solid shape (engine/audit.js auditBodies), or left far behind. Expect 0. */
    (async () => { const out = []; let bad = 0; const dt = 1 / 30; startGame(true); await beginChapter(4, 50); 
      const P = PL.after, n = byId('pearlA'), w = followWatch({ space: FOLLOW.pearlA.space, behind: 6 }), Wl = () => P.walls, blocked = (x, z) => inWallR(Wl(), x, z, 0), move = (x, z) => { const r = clampPos(x, z); state.x = r[0]; state.z = r[1]; return r; }, step = (t) => update(t);
      state.x = n.x + 1.0; state.z = n.z + 0.6; update(dt); setStage(51);
      const leg = (to, stops = []) => { const r = walkRoute([state.x, state.z], to, Wl(), 0.3, P.bounds); drive({ from: [state.x, state.z], route: r.length ? r : [to], stops, move, step, people: [n], w, blocked }); };
      leg([24, 0.4], [0]); leg([28, 0.2]); leg([8, 0.6], [0]); leg([-18, -1.6]);
      const lines = w.lines(n, 'Mum walks home with you').concat(auditBodies(P.snap.concat(P.snap.inst || []), w.spots(n).map(([x, z]) => ({ id: 'Mum walks home with you', x, z, ground: n.m.userData.ground || 0, h: 1.65, r: 0.18, what: 'walks' }))));
      out.push('Mum walks home with you: ' + w.stats(n) + (lines.length ? '' : ', ok')); for (const l of lines) out.push('  ' + l); bad += lines.length;
      out.unshift('follow: ' + bad + ' problems'); document.title = 'FOLLOW ' + bad; const el = $('autolog'); if (el) el.textContent = out.join('\n'); })();
  }
  if (q.get('test') === 'resume') {   /* saved games resume in the right place, and closing a finishing conversation still moves the story on */
    (async () => { const out = []; startGame(true); const roofs = () => roofSheets(P_()), whole = () => roofs().every((s) => s.m.visible), torn = () => roofs().some((s) => !s.m.visible), youth = () => P_().people.find((p) => p.id === 'youth');
      await beginChapter(0, 14); out.push('c1@14 place=' + cur + ' stage=' + stage + ' roofWhole=' + whole()); await beginChapter(0, 15); out.push('c1@15 place=' + cur + ' torn=' + torn()); await beginChapter(0, 12); out.push('c1@12 place=' + cur + ' canoeUp=' + (P_().group.userData.canoe.position.z < 12.5));
      await beginChapter(1, 24); out.push('c2@24 place=' + cur + ' roofWhole=' + whole()); await beginChapter(1, 25); out.push('c2@25 place=' + cur + ' torn=' + torn()); await beginChapter(1, 21); out.push('c2@21 place=' + cur);
      await beginChapter(3, 43); out.push('c4@43 place=' + cur + ' roofWhole=' + whole()); await beginChapter(3, 44); out.push('c4@44 place=' + cur + ' torn=' + torn());
      await beginChapter(4, 51); out.push('c5@51 place=' + cur + ' youthHidden=' + !youth().m.visible); await beginChapter(5, 61); out.push('c6@61 place=' + cur + ' fallen=' + P_().group.userData.fallen.visible + ' youthVisible=' + youth().m.visible); await beginChapter(5, 62); out.push('c6@62 youthVisible=' + youth().m.visible + ' fallen=' + P_().group.userData.fallen.visible + ' tarp=' + P_().tarpHome.visible);
      await beginChapter(2, 31); { const bo = P_().actions.find((a) => a.label === 'Board up the window'), nb = () => P_().group.userData.boards.filter((b) => b.visible).length; bo.go(); const a1 = (ctr.boardDone ? 'done' : 'open') + nb(); bo.go(); out.push('boards: after 1 tap ' + a1 + ', after 2 taps ' + (ctr.boardDone ? 'done' : 'open') + nb()); }
      await beginChapter(6, 71); out.push('c7@71 place=' + cur);
      { const keep = [stage, best, hasSave]; const check = (d) => { stage = 0; best = 0; applySave(d); return stage + '/' + best; };
        out.push('saves: v1 60/64 -> ' + check({ v: 1, unlocked: ['you'], stage: 60, best: 64, story: {} }) + ', v1 0 -> ' + check({ v: 1, unlocked: ['you'], stage: 0, best: 0, story: {} }) + ', v1 64/64 -> ' + check({ v: 1, unlocked: ['you'], stage: 64, best: 64, story: {} }) + ', v2 74/74 -> ' + check({ v: 2, unlocked: ['you'], stage: 74, best: 74, story: {} })); [stage, best, hasSave] = keep; }
      let ran = 0; convo([{ who: 'x', text: 'y' }, { who: 'x', text: 'z' }], () => { ran++; }); leaveTalk(); out.push('convo closed early, callback ran=' + ran);
      startTalk(P_().people[0]); leaveTalk(); out.push('ordinary talk closed early: talked=' + !!P_().people[0].talked);
      document.title = 'RESUME ' + out.join(' | '); })();
  }
  if (q.get('test') === 'sound') {   /* ?test=sound : plays the game's own mixes into an offline recorder (no speakers needed) and reports, for each place and storm moment, the peak, the loudness and the low, middle and high balance; each one-shot is played over the bed it meets in the story and must stand out from it. Run it with Playwright: the offline recorder is not tied to a headless page's virtual time. */
    (async () => {
      const SR = 22050, Q = 128, rq = (t) => Math.round(t * SR / Q) * Q / SR, segs = [], out = [], DB = (x) => (x > 1e-9 ? 20 * Math.log10(x) : -99), BEDS = {};
      const bed = (name, where, key, sb) => { BEDS[name] = { where, key, sb }; segs.push({ name, len: 4, bed: true, ...BEDS[name] }); };
      const shot = (name, fn, over, len = 4, min = 6) => segs.push({ name, len, shot: true, over, fn, min, ...BEDS[over] });   /* min: how many dB the sound must rise above its bed (bangs and cracks 5; a groan or a gust is a swell inside the storm, 3) */
      bed('silence', 'after', 'quiet'); bed('yard51 calm (sea)', 'yard51', 'calm'); bed('room51 night', 'room51', 'room'); bed('yard88 calm', 'yard88', 'calm'); bed('yard88 rising', 'yard88', 'rising'); bed('yard88 gale', 'yard88', 'gale'); bed('room88 night', 'room88', 'room');
      bed('storm: kingston', 'kingston88', 'quiet', { wind: 0.7, howl: 0.35, roar: 0.25, rain: 0.4, rattle: 0.2 }); bed('storm: first gusts', 'yard88', 'quiet', { wind: 0.5, howl: 0.2, roar: 0.15, rattle: 0.15 });
      bed('storm: roof groans', 'yard88', 'quiet', SB_GROAN); bed('storm: the light goes', 'yard88', 'quiet', SB_LIGHT); bed('storm: the peak', 'yard88', 'quiet', SB_PEAK); bed('storm: the hall hymn', 'hall', 'quiet', { wind: 0.7, howl: 0.3, roar: 0.4, rain: 0.6, hymn: 0.6 });
      bed('after the storm', 'after', 'after'); bed('chainsaw', 'after', 'saw'); bed('helicopter', 'after', 'heli'); bed('today', 'today', 'after');
      shot('zinc bang (0.9)', () => SFX.zincBang(0.9), 'storm: roof groans', 4, 5); shot('roof groan', () => SFX.roofGroan(), 'storm: roof groans', 4, 3); shot('dish bang + gust', () => { SFX.zincBang(0.9); SFX.gust(1, 2.4); }, 'storm: kingston', 4, 5);
      shot('tree crack (1.2)', () => SFX.treeCrack(1.2), 'storm: the light goes', 4, 5); shot('gust', () => SFX.gust(1, 3), 'storm: the light goes', 4, 3); shot('worst case: crack + bang + gust on the peak', () => { SFX.treeCrack(1.2); SFX.zincBang(0.9); SFX.gust(1, 3); }, 'storm: the peak', 4, 0);
      for (const [n, f, l] of [['hammering', () => SFX.hammerTap(3)], ['pouring water', () => SFX.pourWater()], ['scoop', () => SFX.scoop()], ['bag', () => SFX.bag()], ['radio', () => SFX.radioTune()], ['church bell', () => SFX.churchBell(2), 8], ['thump', () => SFX.thump()], ['chime', () => SFX.chime()]]) shot(n, f, 'yard88 calm', l);
      const total = segs.reduce((a, g) => a + g.len, 0) + 1; let t0 = 0; for (const g of segs) { g.t0 = rq(t0); t0 += g.len; }
      const RealAC = window.AudioContext; AU.ctx = null; let ctx;
      window.AudioContext = function () { ctx = new OfflineAudioContext(2, Math.round(SR * total), SR); Object.defineProperty(ctx, 'state', { get: () => 'running' }); ctx.resumeReal = ctx.resume.bind(ctx); ctx.resume = () => Promise.resolve(); return ctx; };
      audioInit(); SFX.initBeds(); window.AudioContext = RealAC; AU.on = true;
      let tick = 1e6; const run = (g) => { cur = g.where; bedsKey = g.key; SB = g.sb || null; onceAt = 1e12; for (let i = 0; i < 3; i++) { tick += 1; audioTick(tick, 0); } if (g.fn) g.fn(); };
      segs.forEach((g, i) => { if (i === 0) run(g); else ctx.suspend(g.t0).then(() => { run(g); ctx.resumeReal(); }); });
      const buf = await ctx.startRendering(), L = buf.getChannelData(0), R = buf.getChannelData(1);
      const fft = (re, im) => { const n = re.length; for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
        for (let len = 2; len <= n; len <<= 1) { const a = -2 * PI / len; for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) { const c = Math.cos(a * k), s = Math.sin(a * k), xr = re[i + k + len / 2] * c - im[i + k + len / 2] * s, xi = re[i + k + len / 2] * s + im[i + k + len / 2] * c; re[i + k + len / 2] = re[i + k] - xr; im[i + k + len / 2] = im[i + k] - xi; re[i + k] += xr; im[i + k] += xi; } } };
      const bands = (x, a, b) => { const N = 2048, P = [0, 0, 0]; let n = 0; for (let s = a; s + N <= b; s += N) { const re = new Float64Array(N), im = new Float64Array(N); for (let i = 0; i < N; i++) re[i] = x[s + i] * (0.5 - 0.5 * Math.cos(2 * PI * i / N)); fft(re, im); for (let k = 1; k < N / 2; k++) { const f = k * SR / N, p = re[k] * re[k] + im[k] * im[k]; P[f < 250 ? 0 : f < 2000 ? 1 : 2] += p; } n++; } return P.map((v) => DB(Math.sqrt(v / Math.max(1, n)) / N * 2)); };
      const burst = (a, b, sec) => { const W = Math.round(SR * sec); let m = 0; for (let s = a; s + W <= b; s += W >> 1) { let q2 = 0; for (let i = s; i < s + W; i++) q2 += (L[i] * L[i] + R[i] * R[i]) / 2; m = Math.max(m, Math.sqrt(q2 / W)); } return m; };
      let problems = 0; const res = {}; out.push('segment | peak dBFS | loudness dBFS | low / mid / high dB | loudest 20 or 100 ms over its bed');
      for (const g of segs) { const a = Math.round(g.t0 * SR), b = Math.min(buf.length, Math.round((g.t0 + g.len) * SR)), from = g.bed ? a + Math.round((b - a) * 0.5) : a; let pk = 0, sq = 0, bad = 0;
        for (let i = from; i < b; i++) { const v = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (!Number.isFinite(v)) bad++; else { if (v > pk) pk = v; sq += (L[i] * L[i] + R[i] * R[i]) / 2; } }
        const rms = Math.sqrt(sq / (b - from)), bd = bands(L, from, b); res[g.name] = { pk, rms, bd }; const flags = []; let lift = '';
        if (g.shot) { const over = res[g.over], l = Math.max(DB(burst(a, b, 0.02)), DB(burst(a, b, 0.1))) - DB(over.rms); lift = ' | ' + (l >= 0 ? '+' : '') + l.toFixed(1) + ' dB over "' + g.over + '"'; if (l < g.min) flags.push('LOST UNDER ITS BED'); }
        if (bad) flags.push('NOT A NUMBER'); if (pk > 0.98) flags.push('CLIPS'); if (g.bed && g.name !== 'silence' && DB(rms) < -56) flags.push('TOO QUIET'); if (g.name === 'silence' && DB(rms) > -70) flags.push('NOT SILENT');
        problems += flags.length; out.push(g.name + ' | ' + DB(pk).toFixed(1) + ' | ' + DB(rms).toFixed(1) + ' | ' + bd.map((v) => v.toFixed(0)).join(' / ') + lift + (flags.length ? '  <-- ' + flags.join(', ') : '')); }
      const chain = ['yard88 calm', 'yard88 rising', 'yard88 gale', 'storm: roof groans', 'storm: the light goes', 'storm: the peak'];
      for (let i = 1; i < chain.length; i++) for (const [k, nm] of [[1, 'middle'], [2, 'high']]) { const d = DB(Math.pow(10, res[chain[i]].bd[k] / 20)) - DB(Math.pow(10, res[chain[i - 1]].bd[k] / 20)); if (k === 1 && d < 1.5) { problems++; out.push('ORDER: the ' + nm + ' of "' + chain[i] + '" is not louder than "' + chain[i - 1] + '" (' + d.toFixed(1) + ' dB), so on a phone speaker the storm would not seem to grow'); } }
      for (let i = 1; i < chain.length; i++) if (DB(res[chain[i]].rms) <= DB(res[chain[i - 1]].rms) + 1) { problems++; out.push('ORDER: "' + chain[i] + '" is not louder than "' + chain[i - 1] + '"'); }
      const range = DB(res['storm: the peak'].rms) - DB(res['yard88 calm'].rms); if (range < 20) { problems++; out.push('RANGE: calm to the peak is only ' + range.toFixed(1) + ' dB'); }
      out.unshift('sound check: ' + problems + ' problems'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'SOUND ' + problems; })();
  }
  if (q.has('clickstart')) setTimeout(() => $('start').click(), 300);   /* the real start, with real fades (the other test views skip them) */
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 6) and the ones after it; add &one to stop after N. It logs every change to the page title and #autolog, and says STALL if nothing changes for a while. */
    const N = +q.get('auto'), one = q.has('one'), log = [], sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const L = (m) => { log.push(m); document.title = log.join(' | '); const el = $('autolog'); if (el) el.textContent = log.join('\n'); };
    (async () => {
      await waitFor(() => modelsReady); startGame(true); let ch = N - 1; L('start ch' + (ch + 1)); await beginChapter(ch); const finished = () => stage >= DONE[ch];
      let qi = 0, lastKey = '', lastT = performance.now(); const nap = () => { for (let i = 0; i < 8; i++) update(0.05); };
      for (;;) {
        await sleep(120); nap(); const now = performance.now();
        const key = stage + '|' + cur + '|' + unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + (DIR.on ? 'cut' : '') + (ST.on ? 'storm' : '');
        if (key !== lastKey) { lastKey = key; lastT = now; L('s' + stage + ' ' + cur + ' pages=' + unlocked.length + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + $('goal').textContent + '"'); }
        if (now - lastT > 30000) { L('STALL at stage ' + stage + ' in ' + cur + ' busy=' + busy + ' frozen=' + frozen + ' fading=' + fading); break; }
        if (!$('card').hidden) { const bs = $('cbtns').querySelectorAll('button'); if (bs.length) bs[(qi++) % bs.length].click(); continue; }
        if (!$('dialogue').hidden) { const c = $('choices').firstChild; if (c) c.click(); else $('next').click(); continue; }
        if (!$('holdwrap').hidden) { HOLD.on = true; continue; }
        if (finished()) { L('chapter ' + (ch + 1) + ' DONE at stage ' + stage); if (one || ch >= 6) { L('ALLDONE'); break; } ch++; L('next ch' + (ch + 1)); await beginChapter(ch); lastT = performance.now(); continue; }
        if (busy || frozen || DIR.on || fading || ST.on) continue;
        const P = P_(); if (!P) continue; const a = P.actions.find((x) => x.on());
        if (a) { state.x = a.x; state.z = a.z; update(0.016); a.go(); continue; }
        const n = P.people.find((p) => wantsTalk(p)); if (n) { state.x = n.x + 1.1; state.z = n.z + 0.4; update(0.016); startTalk(n); continue; }
        if (cur === 'after' && stage === 51) { state.x = P.spots.home[0]; state.z = P.spots.home[1]; update(0.016); }
      }
    })();
  }
}

