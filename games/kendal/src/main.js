/* games/kendal/src/main.js: Kendal 1957, The Excursion Train.
   The story of the Jamaica Railway, from the slow road before it to the Kendal train crash of 1 September 1957 and how it is remembered.
   Built on the shared engine (engine/anim.js, engine/audio.js, engine/loader.js). Controls, journal, chapters and saving follow Port Royal and Marcus Garvey.
   Layout of this file: setup, state and controls, people and places, interface, saving, chapters and goals, trains and rides, the crash, the other chapters' actions, the loop, test views. */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, setG, gullCry, chirp } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { G, T, makeSky, ease, clamp01, lerp, rng, batchStatic } from './gfx.js';
import { ENV, mixEnv, makeRig, TRACK_Y } from './common.js';
import { makeSmoke, spin } from './trains.js';
import { lantern, hamper, bucket, bananaBunch, flowers, attach, hold, suitcase, PM } from './props.js';
import { buildRoad, buildStation45, buildRide45, buildHill } from './places1.js';
import { buildKingston57, buildCoach, buildBeach, buildCrash, buildMemorial } from './places2.js';
import { CHAPTERS, GOALS, TALK_TARGETS, NEXT_AFTER_TALK, CHAPTER_END, TALK, LATER, JOURNAL } from './content.js';
import * as SFX from './sfx.js';
import { DECOR } from './decor.js';
import { snapMeshes, auditPlace as auditPlaceE, auditHeld } from '../../../engine/audit.js';
import { makeBirds } from './detail.js';

const $ = (id) => document.getElementById(id);
const PI = Math.PI;
soundPref('kendal-sound');
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
const handLamp = new THREE.PointLight(0xffc878, 0, 16, 1.7); handLamp.position.set(0.25, -0.25, -0.5); camera.add(handLamp);   /* Mass Ezra's lamp, in your hand */
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
const keys = new Set(); let busy = false, fading = false, frozen = false, talkWith = null, near = null;
const PANELS = ['dialogue', 'journal', 'chapters', 'credits', 'card'];
const panelsOpen = () => PANELS.some((id) => !$(id).hidden);
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); if (!$('card').hidden && CARD.dismiss) CARD.dismiss(); }
  if ((k === 'e' || k === 'enter') && !busy && !frozen && near) activate(near);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
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
const PROPS = { suitcase: () => suitcase(), basket: () => { const h = hamper(0xb08a48); return h; }, hamper: () => hamper(), lantern: () => lantern(), bucket: () => bucket() };
/* how each thing is carried (see hold() in props.js): handleY is the height of its handle, out is how far the hand's item sits from the body. After changing these run ?test=held. */
let GRIP = { hamper: { handleY: 0.52, scale: 0.5, out: 0.16 }, suitcase: { handleY: 0.5, scale: 0.8, out: 0.16 }, lantern: { handleY: 0.31, scale: 0.85, out: 0.14 }, bucket: { handleY: 0.34, scale: 0.9, out: 0.15 }, basket: { dy: 0.12, scale: 0.8 } };
const SKIN_LIGHT = 1.55;   /* the bodies' skin is built dark, so we lighten it a little (as in Marcus Garvey) so faces read in every light */
function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene);
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const mat = o.material, nm = mat.name || '';
    if ((s.hide && s.hide.includes(nm)) || (s.hat === false && nm === 'Hat')) { o.visible = false; return; }
    o.material = mat.clone(); const t = s.tint && s.tint[nm]; if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); });
  m.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x, s.ground || 0, s.z); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  if (!/^Sit/.test(s.anim || '')) { const b = new THREE.Mesh(BLOB_GEO, BLOB_MAT); b.rotation.x = -PI / 2; b.position.y = 0.05; b.renderOrder = 1; m.add(b); }
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl;
  m.userData.held = []; ctl.mx.update(0);   /* pose the body once, so the grips below are measured on the real hand */
  for (const [bone, prop] of s.props || []) { const o = PROPS[prop](); hold(m, bone, o, GRIP[prop]); m.userData.held.push({ obj: o, bone, label: prop }); if (o.userData.flame) s._flame = o.userData.flame; }
  if (s.lamp) { const o = lantern(); hold(m, 'RightHand', o, GRIP.lantern); m.userData.held.push({ obj: o, bone: 'RightHand', label: 'lamp' }); s._flame = o.userData.flame; }
  return m;
}
const BLOB_GEO = new THREE.PlaneGeometry(1.0, 1.0), BLOB_MAT = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, 'rgba(0,0,0,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
const PL = {}; let cur = null;
setEnv(ENV.morning);
const BUILD = { road: buildRoad, station45: buildStation45, ride45: buildRide45, hill: buildHill, kingston57: buildKingston57, coach: buildCoach, beach: buildBeach, crash: buildCrash, memorial: buildMemorial };
let modelsReady = false; const placeLoading = {};
function buildPlace(id) {   /* the geometry only: quick, and enough for a title backdrop. People come later (populate). */
  if (PL[id]) return PL[id]; const P = BUILD[id](); P.group.visible = false; scene.add(P.group); P.actions = []; P.bodies = []; P.npcs = []; P.specs = { people: P.people, extras: P.extras }; P.people = []; P.extras = []; P.populated = false; PL[id] = P; P.keepOut = []; if (DECOR[id]) DECOR[id](P.group, P); if (__DEV__) P.snap = snapMeshes(P.group); if (!P.group.userData.noBatch) P.batch = batchStatic(P.group);
  P.group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && !o.material.transparent && !(o.material.alphaTest > 0)) { o.castShadow = o.receiveShadow = true; } else if (o.isMesh && Array.isArray(o.material)) { o.castShadow = o.receiveShadow = true; } });
  if (ACTIONS_FOR[id]) P.actions = ACTIONS_FOR[id](P); return P;
}
/* spreadOut: nobody stands inside anybody. Background figures that are too close to someone are moved to a free spot nearby (a walker's whole loop moves with them);
   a figure that cannot be placed, or a walk that would pass through someone standing still, is dropped. The audit (?test=audit) then checks the result. */
function spreadOut(P) {
  const r = rng(77), seated = (e) => /^Sit/.test(e.anim || ''), loop = (e) => { if (!e.path) return [[e.x, e.z]]; const pts = []; for (let i = 0; i < e.path.length; i++) { const a = e.path[i], b = e.path[(i + 1) % e.path.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5)); for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return pts; };
  const fixed = [], paths = []; for (const p of P.specs.people) { if (p.path) loop(p).forEach((q) => paths.push([q[0], q[1], 0.7])); else fixed.push([p.x, p.z, seated(p) ? 0.4 : 0.7]); } for (const k of P.keepOut || []) fixed.push(k);
  const b = P.bounds, inWall = (x, z) => P.walls.some((w) => x > w[0] - 0.3 && x < w[2] + 0.3 && z > w[1] - 0.3 && z < w[3] + 0.3), keep = [];
  const free = (pts, walker) => pts.every(([x, z]) => !inWall(x, z) && fixed.every((f) => Math.hypot(f[0] - x, f[1] - z) >= (f[2] < 0.6 ? Math.min(f[2] + 0.2, 0.72) : 0.72)) && (walker || paths.every((f) => Math.hypot(f[0] - x, f[1] - z) >= 0.72)) && Math.hypot(x - P.start.x, z - P.start.z) > 1.4);
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
  setEnv(env || P.env); near = null; smoke.clear(); P.group.rotation.set(0, 0, 0);
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
  EYE = P.eye || 1.32; FX.roll = 0; FX.tilt = 0; stick.id = null; stick.dx = stick.dy = 0; sitting = false;
}
const smoke = makeSmoke(scene); const birds = makeBirds(scene, 7);
function clampPos(x, z) {
  const P = P_(), b = P.bounds; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  for (const [x0, z0, x1, z1] of P.walls) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  for (const n of P.people) { if (!n.m || !n.m.visible || n.m.userData.sits) continue; const d = Math.hypot(x - n.x, z - n.z); if (d < 0.5) { x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  return [x, z];
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  if (!cur || busy || frozen) return null; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of P_().people) if (n.m && n.m.visible && Math.hypot(state.x - n.x, state.z - n.z) < 6 && ray.intersectObject(n.m, true).length > 0) return n; return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
function npcTick(n, dt) {
  const m = n.m; if (!m || !m.visible) return; if (POSTER) { m.rotation.y = n.ry0; return; }
  const ac = n.ctl, d = Math.hypot(state.x - n.x, state.z - n.z), seated = /^Sit/.test(n.anim || ''), isNear = !n.extra && !seated && ((d < 3.2 && !DEV_NOSTOP) || talkWith === n);
  if (n.follow && talkWith !== n) { const dx = state.x - n.x, dz = state.z - n.z, dist = Math.hypot(dx, dz); if (dist > 1.5) { const sp = Math.min(2.2, 0.8 + dist * 0.35) * dt; n.x += dx / dist * sp; n.z += dz / dist * sp; if (!n.walking) { n.walking = true; ac.play('Walk'); } faceTo(m, Math.atan2(dx, dz), dt); } else if (n.walking) { n.walking = false; ac.play(null); } m.position.set(n.x, m.userData.ground, n.z); return; }
  if (!n.path) { if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else if (!n.extra) faceTo(m, n.ry0, dt, 2); return; }
  if (isNear || n.wait > 0) { if (n.walking) { n.walking = false; ac.play(null); } if (isNear) faceTo(m, Math.atan2(state.x - n.x, state.z - n.z), dt); else { n.wait -= dt; if (n.wait <= 0) { n.walking = true; ac.play('Walk'); } } return; }
  if (!n.walking) { n.walking = true; ac.play('Walk'); }
  const to = n.path[(n.i + 1) % n.path.length], dx = to[0] - n.x, dz = to[1] - n.z, dist = Math.hypot(dx, dz), sp = 1.1 * dt; faceTo(m, Math.atan2(dx, dz), dt);
  if (dist <= sp) { n.x = to[0]; n.z = to[1]; n.i = (n.i + 1) % n.path.length; n.wait = 2 + Math.random() * 3; n.walking = false; ac.play(null); } else { n.x += dx / dist * sp; n.z += dz / dist * sp; }
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
const CHOICE_NAMES = { road: { help: 'You thought the railway would help people.', worry: 'You worried it might take Mass Dudley\'s work.', ask: 'You were not sure yet.' }, beach: { splash: 'At the beach you splashed in the sea.', castle: 'At the beach you built a sandcastle.', band: 'At the beach you listened to the mento band.' }, why: { safe: 'You said we remember Kendal so people stay safe.', honour: 'You said we remember Kendal to honour those who died.', thank: 'You said we remember Kendal to thank the helpers.' } };
function refreshJourney() { const p = JOURNAL.find((q) => q.id === 'journey'); const lines = [story.road, story.beach, story.why].map((v, i) => (v ? CHOICE_NAMES[['road', 'beach', 'why'][i]][v] : null)).filter(Boolean); p.simple = lines.length ? ['You finished the story.', ...lines] : ['You finished the story.']; }
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
const SAVE_KEY = 'kendal-save-v1'; let hasSave = false, erasing = false;
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, unlocked, stage, best, story, talked: allPeople().filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return; for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story); stage = Number.isInteger(d.stage) && d.stage in GOALS ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false, convoEnd = null, convoForced = false;   /* convoForced: a conversation that finishes something you already did (carrying the last bucket), so closing it early must not undo that */ const TALKS = ['Talk1', 'Talk2', 'Talk3'];
const ALIAS = () => ({ abel: stage === 33 ? 'abel2' : 'abel', gran5: stage === 42 ? 'granCoach' : 'gran5', lloyd5: stage === 42 ? 'lloydCoach' : 'lloyd5', gran6: stage === 66 ? 'gran66' : 'gran6', clive: stage === 66 ? 'clive2' : 'clive' });
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
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock); if (s.give === 'lamp') { story.lamp = true; saveGame(); toast('Mass Ezra gives you his lamp.'); updateLamp(); }
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
function updateLamp() { const on = !!story.lamp && cur === 'crash' && stage < 66; handLamp.intensity = on ? 3.6 : 0; lampMesh.visible = on; }
const lampMesh = lantern(); lampMesh.scale.setScalar(1.0); lampMesh.position.set(0.36, -0.42, -0.62); lampMesh.visible = false; camera.add(lampMesh);

/* ---------- chapters, stages and the story machine ---------- */
const CH_PLACE = ['road', 'station45', 'hill', 'kingston57', 'coach', 'crash', 'memorial'], CH_FIRST = [10, 20, 30, 40, 50, 60, 70], DONE = [14, 25, 35, 45, 53, 67, 74];
const PRELOAD = { 1: ['ride45'], 3: ['coach', 'beach'], 4: ['crash'], 5: [] };
const SAFE = { 23: 22, 24: 22, 32: 31, 42: 41, 51: 50, 52: 50, 53: 50, 63: 62, 64: 62, 65: 62, 67: 66 };   /* a saved game never resumes in the middle of a scripted scene */
const chapterOf = (s) => Math.max(0, Math.min(6, Math.floor(s / 10) - 1));
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
function resetTransient() {   /* leave anything running: scripted scenes, a ride, the crash, the camera director */
  EP++; RIDE.on = false; RIDE.v = RIDE.target = 0; endCut(); frozen = false; moveLock = false; bars(false); $('sub').classList.add('dim'); document.body.classList.remove('subbing'); $('holdwrap').hidden = true; flash(0, 0); $('vig').style.opacity = 0; FX.shake = 0; FX.roll = 0; FX.tilt = 0; RING = 0; HUSH = false; CRBEDS = {};
  SFX.mento(false); SFX.setBeds({}, 0.1); TICKS.length = 0; smoke.clear(); if (cur && PL[cur]) PL[cur].group.rotation.set(0, 0, 0); sitting = false; document.body.classList.remove('flashing');
}
let moveLock = false, RING = 0, HUSH = false, CRBEDS = {};
async function beginChapter(i, st) {
  if (fading) return; resetTransient(); st = st || CH_FIRST[i]; const C = CHAPTERS[i]; hideCard(); closeJournal(); closeChapters(); $('dialogue').hidden = true; busy = false; talkWith = null;
  if (!PL[CH_PLACE[i]] || !PL[CH_PLACE[i]].populated) toast('Loading', 4000); await ensurePlace(CH_PLACE[i]); if (i === 3 && st >= 43) await ensurePlace('beach'); for (const id of PRELOAD[i] || []) ensurePlace(id);
  chapterFade(C.title, C.sub, () => startScene(i, st));
}
function startScene(i, st) {
  const ep = EP; const id = CH_PLACE[i]; const P = PL[id];
  if (i === 4) { enterPlace('coach', { env: ENV.dusk }); setRigTheme(P, 'night'); RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'diesel'; P.lamp.intensity = 9; }
  else if (i === 5) { enterPlace('crash'); story.lamp = true; }
  else if (i === 3 && st >= 43) enterPlace('beach', { env: st >= 44 ? ENV.gold : ENV.day });   /* a saved game from the beach resumes on the beach */
  else enterPlace(id);
  state.started = true; setStage(st); updateLamp(); showPlace();
  if (i === 1) setTimeout(() => { if (ep === EP) { SFX.fanfare(); SFX.stationGong(); } }, 900 * TS);
  if (i === 2) { const late = st >= 33; P.train.visible = late; P.train.position.x = late ? 0 : 90; if (st >= 32) { P.bunches.forEach((b) => { b.visible = false; }); P.inWagon.forEach((b) => { b.visible = true; }); } }   /* resuming after the train came in */
  if (i === 5 && st >= 66) { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; P.torches.forEach((t) => { t.visible = false; }); P.flame.visible = false; }   /* resuming after the night */
  if (i === 3) { SFX.mento(false); }
}
function chaptersOpen(i) { return i === 0 || best >= DONE[i - 1]; }
function renderChapters() {
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = chaptersOpen(i), dn = best >= DONE[i], li = document.createElement('li'), b = document.createElement('button'); b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !modelsReady ? 'Loading' : dn ? 'Done' : 'Play']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => { $('chapters').hidden = true; busy = false; if (!state.started) startGame(true); beginChapter(i); }; li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = panelsOpen(); if (state.started) canvas.focus(); }
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('dev').onclick = openCredits; $('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
$('reset').onclick = () => { if (fading || RIDE.on && stage === 53) return; closeJournal(); const i = chapterOf(stage);
  card('Reset', ['Start this chapter again, or start the whole story again.'], [{ t: 'Restart “' + CHAPTERS[i].name + '”', go: () => { hideCard(); beginChapter(i); } }, { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) }, { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'All games', go: toMenu }] : [])]); };

/* ---------- waiting for things, and moving things over time ---------- */
const waitFor = (fn) => new Promise((res) => { const ep = EP, iv = setInterval(() => { if (EP !== ep) { clearInterval(iv); res(false); } else if (fn()) { clearInterval(iv); res(true); } }, 100); });
function tween(sec, fn) { const ep = EP; return new Promise((res) => { let t = 0; const d = Math.max(0.05, sec * TS); TICKS.push((dt) => { if (ep !== EP) { res(false); return true; } t += dt; const k = Math.min(1, t / d); fn(k, dt / d); if (k >= 1) { res(true); return true; } return false; }); }); }
async function transition(id, opts = {}) {   /* fade to black, change place, fade back in */
  const ep = EP; fadeBlack(true, 700); await wait(900); if (ep !== EP) return false; enterPlace(id, opts); if (opts.after) opts.after(); updateLamp(); fadeBlack(false, 900); await wait(500); return ep === EP;
}

/* ---------- trains: rides (scenery scrolls past the windows), smoke, sound ---------- */
const RIDE = { on: false, v: 0, target: 0, accel: 0.6, kind: 'diesel', dist: 0, clackT: 0, chuffT: 0 };
function setRigTheme(P, theme) { if (!P.rig || P.rig.theme === theme) return; const old = P.rig.group; const r = makeRig(theme); r.group.position.copy(old.position); P.group.remove(old); P.group.add(r.group); P.rig = r; }
function rideTick(dt, t) {
  if (!RIDE.on) return; const P = P_(); if (!P || !P.rig) return; const v = (RIDE.v += (RIDE.target - RIDE.v) * Math.min(1, dt * RIDE.accel)); if (Math.abs(RIDE.target - v) < 0.03) RIDE.v = RIDE.target;
  RIDE.dist += v * dt; P.rig.update(dt, v); if (P.wheels) for (const o of P.wheels) o.w.rotation.z -= v * dt / o.r;
  const k = Math.min(1, v / 12); if (!CR.on || CR.phase < 3) { FX.bob = Math.sin(t * 9.3) * 0.004 * k; FX.roll = Math.sin(t * 1.7) * 0.004 * k + Math.sin(t * 5.1) * 0.0025 * k; }
  if (v > 1.5) { RIDE.clackT -= dt; if (RIDE.clackT <= 0) { RIDE.clackT = Math.max(0.3, 11 / v); SFX.clack(v); } }
  if (RIDE.kind === 'steam' && v > 0.5) { RIDE.chuffT -= dt; if (RIDE.chuffT <= 0) { RIDE.chuffT = Math.max(0.17, 0.95 / (v + 1)); SFX.chuff(0.16); } }
}
function smokeTick(dt) {
  const P = P_(); if (P && P.smokers) for (const s of P.smokers) { if (s.needsTrain && !P.train.visible) continue; s.acc = (s.acc || 0) + dt; if (s.acc >= 1 / s.rate) { s.acc = 0; s.obj.getWorldPosition(_v); smoke.emit(_v, new THREE.Vector3(P.ride ? RIDE.v * 0.8 + 0.8 : 0.5, 1.2 + Math.random() * 0.6, (Math.random() - 0.5) * 0.3), { size: 0.7, grow: 3.4, life: 3.4, opacity: 0.5 }); } }
  smoke.tick(dt);
}

/* ---------- things to do: ACTIONS_FOR[place](P) makes the list of that place. A thing shows as a button when you stand at it. ---------- */
const ACTIONS_FOR = {
  road: (P) => [
    { label: 'Load the mule', x: P.spots.mule[0], z: P.spots.mule[1], r: 3.0, on: () => stage === 11 && !P.loading, go: () => {
      const n = ctr.mule || 0; const item = P.goods[n]; P.loading = true; ctr.mule = n + 1; refreshGoal(true); toast(P.goodsText[n], 3400); const d = byId('dudley'); if (d && d.ctl) d.ctl.play('Talk2', true);
      loadItem(P, item, n).then(() => { P.loading = false; if (ctr.mule >= 3) { SFX.snort(); convo(TALK.muleDone(story), () => setStage(12), byId('dudley')); } }); }, } ],
  station45: (P) => [
    { label: 'Look at the engine', x: P.spots.engine[0], z: P.spots.engine[1], r: 3.4, on: () => stage === 21, go: () => { unlock('projector'); card('The Projector', ['This steam engine was built in Manchester, England, in 1844.', 'Boiling water makes steam. The steam pushes pistons, and the pistons turn the big wheels.', 'She can pull a whole train at up to 30 miles an hour. That is very fast for 1845!'], [{ t: 'Good!', go: () => { hideCard(); setStage(22); } }]); } },
    { label: 'Climb aboard', x: P.spots.board[0], z: P.spots.board[1], r: 3.2, on: () => stage === 22, go: () => setStage(23) } ],
  ride45: (P) => [{ label: 'Pass the water bucket', x: P.spots.water[0], z: P.spots.water[1], r: 2.6, on: () => RIDE45.water && ctr.water < 3, go: () => { ctr.water = (ctr.water || 0) + 1; uiSound('goal'); stepSound('water'); toast('Passed ' + ctr.water + ' of 3'); } }],
  hill: (P) => [
    { label: 'Carry a bunch to the wagon', x: P.spots.pile[0], z: P.spots.pile[1], r: 2.8, on: () => stage === 31, go: () => { const n = ctr.bun = (ctr.bun || 0) + 1; P.bunches[n - 1].visible = false; P.inWagon[n - 1].visible = true; uiSound('goal'); toast('Carried ' + n + ' of 4'); refreshGoal(true); if (n >= 4) setStage(32); } },
    ...P.spots.brakes.map((b, i) => ({ label: 'Check the brake', x: b[0], z: b[1], r: 2.3, on: () => stage === 34 && !(ctr['b' + i]), go: () => { ctr['b' + i] = 1; ctr.brk = (ctr.brk || 0) + 1; uiSound('goal'); toast(['The tender brake is tight. Good.', 'The carriage brake handle holds. Good.', 'The wagon brake block is firm. Good.'][i]); refreshGoal(true); if (ctr.brk >= 3) convo(TALK.abel3(story), () => setStage(35), byId('abel')); } })) ],
  kingston57: (P) => [{ label: 'Climb aboard the last coach', x: P.spots.board[0], z: P.spots.board[1], r: 3.2, on: () => stage === 41, go: () => setStage(42) }],
  coach: (P) => [
    ...P.spots.windows.map((w, i) => ({ label: 'Look out of the window', x: w[0], z: w[1], r: 1.6, on: () => stage === 51 && !(ctr['w' + i]), go: () => { ctr['w' + i] = 1; ctr.win = (ctr.win || 0) + 1; state.yaw = w[2] > 0 ? PI : 0; state.pitch = 0; say(i === 0 ? 'A little station slips by. A lamp, a bell, a dog barking.' : 'Stars over the dark hills. Somewhere, a lamp in a window.', 4200); refreshGoal(true); if (ctr.win >= 2) setStage(52); } })),
    { label: 'Sit down with Gran', x: P.spots.seat[0], z: P.spots.seat[1], r: 1.5, on: () => stage === 52 && !CR.on, go: () => crashIntro() } ],
  beach: (P) => {
    const done = () => { P.done = P.done || {}; return P.done; }, fun = (k) => { done()[k] = true; uiSound('goal'); ctr.fun = (ctr.fun || 0) + 1; story.beach = story.beach || k; saveGame(); refreshGoal(true); if (ctr.fun >= 2) setStage(44); };
    return [
      { label: 'Splash in the sea', x: P.spots.sea[0], z: P.spots.sea[1], r: 2.6, on: () => stage === 43 && !done().sea, go: () => { stepSound('water'); setTimeout(() => stepSound('water'), 300); toast('Splash! The water is warm.'); fun('sea'); story.beach = story.beach === 'sea' ? 'splash' : story.beach; } },
      { label: 'Build a sandcastle', x: P.spots.castle[0], z: P.spots.castle[1], r: 2.6, on: () => stage === 43 && !done().castle, go: () => { ctr.cp = (ctr.cp || 0) + 1; const m = P.castle.userData.mound; m.scale.setScalar(0.01 + ctr.cp / 3); uiSound('tap'); toast(ctr.cp < 3 ? 'Pat the sand... ' + ctr.cp + ' of 3' : 'A sandcastle!'); if (ctr.cp >= 3) fun('castle'); } },
      { label: 'Listen to the band', x: P.spots.band[0], z: P.spots.band[1], r: 3.4, on: () => stage === 43 && !done().band, go: () => { unlock('mento'); toast('A mento band! Banjo, guitar and a rumba box.'); fun('band'); } } ];
  },
  crash: (P) => [
    { label: 'Fill the bucket', x: P.spots.pipe[0], z: P.spots.pipe[1], r: 2.4, on: () => stage === 61 && !ctr.has && (ctr.water || 0) < 2, go: () => { ctr.has = 1; stepSound('water'); toast('The bucket is full. Take it to the nurse.'); } },
    { label: 'Give the water to the nurse', x: P.spots.nurse[0], z: P.spots.nurse[1], r: 2.6, on: () => stage === 61 && ctr.has, go: () => { ctr.has = 0; ctr.water = (ctr.water || 0) + 1; refreshGoal(true); if (ctr.water >= 2) convo(TALK.nurse(story), () => setStage(62), byId('nurse')); else toast('She drinks, and thanks you. One more trip.'); } },
    { label: 'Take Dawn to the calling place', x: P.spots.calling[0], z: P.spots.calling[1], r: 3.2, on: () => stage === 63, go: () => { const d = byId('dawn'); d.follow = false; d.walking = false; d.ctl.play(null); d.x = P.spots.calling[0] + 1.2; d.z = P.spots.calling[1] + 0.6; d.m.position.set(d.x, 0, d.z); convo(TALK.louise(story), () => setStage(64), byId('louise')); } },
    { label: 'Hold your lamp up', x: P.spots.lamp[0], z: P.spots.lamp[1], r: 3.4, on: () => stage === 64, go: () => holdLamp() } ],
  memorial: (P) => [
    { label: 'Read the storyboard', x: P.spots.board[0], z: P.spots.board[1], r: 2.8, on: () => stage === 71 && !ctr.sb, go: () => { ctr.sb = 1; ctr.look = (ctr.look || 0) + 1; refreshGoal(true); card('The storyboard', ['A church excursion train came home from the sea.', 'It ran downhill and left the rails here, near Kendal.', 'Hundreds of people from Kendal came to help.', 'Close to 200 people died.'], [{ t: 'Close', go: () => { hideCard(); if (ctr.look >= 2) setStage(72); } }]); } },
    { label: 'Read the monument', x: P.spots.wall[0], z: P.spots.wall[1], r: 3.0, on: () => stage === 71 && !ctr.mn, go: () => { ctr.mn = 1; ctr.look = (ctr.look || 0) + 1; refreshGoal(true); card('The monument', ['Our plaque says: Kendal, 1 September 1957. We remember them.', 'The real monument has the names of 177 people. It also thanks the helpers and remembers the survivors.', 'We do not know the real words, so these are our own.'], [{ t: 'Close', go: () => { hideCard(); if (ctr.look >= 2) setStage(72); } }]); } },
    { label: 'Leave a flower', x: P.spots.flower[0], z: P.spots.flower[1], r: 2.8, on: () => stage === 72, go: () => leaveFlower() } ],
};
const RIDE45 = { water: false };

/* ---------- chapter 1: carrying a load to the mule. The item flies in an arc to the mule's pack, the mule sinks a little under the weight. ---------- */
function loadItem(P, item, n) {
  const mu = P.mule, slot = mu.userData.slots[n], from = item.position.clone(), to = new THREE.Vector3(...slot); mu.localToWorld(to); P.group.worldToLocal(to); const ep = EP;
  uiSound('tap'); const done = tween(0.9, (k) => { const e = ease(k); item.position.lerpVectors(from, to, e); item.position.y += Math.sin(k * PI) * 1.1; item.rotation.y += 0.04; });
  return done.then((ok) => { if (!ok || ep !== EP) return; mu.attach(item); item.position.set(...slot); item.rotation.set(0, n * 1.4, 0); item.scale.setScalar(n === 2 ? 0.9 : 0.8); mu.userData.dip = (n + 1) / 3; SFX.settle(); setTimeout(() => SFX.snort(), 350 * TS);
    for (let i = 0; i < 5; i++) { const w = new THREE.Vector3(mu.position.x + (Math.random() - 0.5) * 1.4, 0.15, mu.position.z + (Math.random() - 0.5) * 1.0); smoke.emit(w, new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.3, (Math.random() - 0.5) * 0.4), { size: 0.5, grow: 1.4, life: 1.4, color: 0xc9a878, opacity: 0.35 }); } });
}
function resetMule(P) { const mu = P.mule; for (const it of P.goods) { if (it.parent !== P.group) P.group.attach(it); it.position.copy(it.userData.home); it.scale.setScalar(1); } mu.userData.dip = 0; P.loading = false; }

/* ---------- chapter 2: the first train ---------- */
ON[23] = async () => {
  const ep = EP; await ensurePlace('ride45'); if (!(await transition('ride45', { after: () => { RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'steam'; bars(true); frozen = false; } }))) return;
  const P = P_(); RIDE45.water = false; ctr.water = 0;
  const ok = await run([[200, () => { say('The Governor takes his seat. The whistle blows!', 3200); SFX.whistleSteam(1.0); SFX.hiss(1.4); }], [3200, () => { RIDE.target = 4; say('The train jerks forward. The crowd cheers!', 3400); }], [3600, () => { RIDE.target = 8; say('Slowly at first, past the houses.', 3200); }], [4200, () => { RIDE.target = 10; say('Out across wet, marshy land, on a raised bank.', 3600); }], [5500, () => { RIDE.target = 0; say('At the new bridge over the Rio Cobre, the engine stops for water.', 4200); SFX.hiss(2.0); }]]);
  if (!ok) return; bars(false); goalText = 'Help the water boy. Pass the bucket: 0 of 3.'; showGoal(); RIDE45.water = true; GOALS[23] = () => `Help the water boy. Pass the bucket: ${ctr.water || 0} of 3.`;
  if (!(await waitFor(() => ctr.water >= 3))) return; RIDE45.water = false; GOALS[23] = () => 'Ride to Spanish Town. Look at the crowds!'; bars(true);
  await run([[300, () => { say('Off again! Spanish Town is not far.', 3200); SFX.whistleSteam(0.7); RIDE.target = 9; }], [4200, () => { RIDE.target = 12; say('Cheers all along the line.', 3000); SFX.fanfare(); }], [5000, () => { RIDE.target = 0; say('Spanish Town, about an hour after leaving Kingston.', 4200); unlock('first-train'); }], [4600, () => { stage = 24; refreshGoal(); RIDE.target = 18; SFX.whistleSteam(0.6); say('The ride back is fast. About 30 miles an hour!', 4000); }], [4800, () => { RIDE.target = 20; say('Faster than any mule. Faster than any horse.', 3800); }], [4500, () => { RIDE.target = 0; say('Back in Kingston in about forty minutes.', 3600); }]]);
  if (!(await transition('station45', { after: () => { RIDE.on = false; bars(false); state.x = 8; state.z = 5; state.yaw = 0.3; } }))) return; setStage(25);
};
ON[21] = () => { /* nothing: the engine card is an action */ };

/* ---------- chapter 3: a train comes up the hill, and the brake check ---------- */
ON[31] = () => { const P = PL.hill; if (!P) return; P.bunches.forEach((b) => { b.visible = true; }); P.inWagon.forEach((b) => { b.visible = false; }); };
ON[32] = async () => {
  const P = P_(); if (cur !== 'hill') return; frozen = true; busy = false; bars(true); say('Listen! A train is coming up the hill.', 3600); const tr = P.train; tr.visible = true; tr.position.x = 100;
  const cam = [3, 1.6, 6.5]; await cut(cam, cam, [60, 2.4, -3], [20, 2.4, -3], 3);
  let px = tr.position.x; SFX.whistleSteam(1.2); const ok = await tween(18, (k, dk) => { const e = 1 - Math.pow(1 - k, 2.1); const nx = 100 * (1 - e) - 0.0; const dx = px - nx; px = nx; tr.position.x = Math.max(0, nx); spin(tr, dx); DIR.lb.set(lerp(20, -4, k), 2.4, -3); if (RIDE.on === false && k > 0.3 && !tween.said) { tween.said = true; say('The engine works hard on the steep slope.', 3600); } if (k > 0.8 && !tween.s2) { tween.s2 = true; SFX.hiss(2.6, 0.14); } });
  tween.said = tween.s2 = false; if (!ok) return; tr.position.x = 0; await wait(900); say('The fireman waves. The train has arrived.', 3200); SFX.whistleSteam(0.7); await wait(2600); endCut(); frozen = false; bars(false); setStage(33);
};

/* ---------- chapter 4: the excursion day ---------- */
ON[41] = () => { const P = PL.kingston57; SFX.stationGong(); };
ON[42] = async () => {
  const ep = EP; await ensurePlace('coach'); if (!(await transition('coach', { env: ENV.day, after: () => { const P = P_(); setRigTheme(P, 'plains'); RIDE.on = true; RIDE.v = RIDE.target = 0; RIDE.kind = 'diesel'; P.lamp.intensity = 0.8; } }))) return;
  const P = P_(); bars(true);
  const ok = await run([[300, () => { say('The doors close. A whistle blows. Gran squeezes your hand.', 3600); SFX.hornDiesel(1.2); }], [3600, () => { RIDE.target = 8; say('Off we go! The platform slides away.', 3400); }], [3800, () => { RIDE.target = 15; say('Spanish Town, Old Harbour, May Pen. The towns roll by.', 3800); bars(false); }]]);
  if (!ok) return; goalText = 'Enjoy the ride. Talk to Gran and Lloyd, or look about.'; showGoal();
  await run([[7000, () => { setRigTheme(P, 'hills'); say('Now the hills. The engines work hard.', 3600); RIDE.target = 9; }], [7000, () => { say('Greenvale, the highest station on the line.', 3600); unlock('greenvale'); }], [6500, () => { setRigTheme(P, 'coast'); RIDE.target = 14; say('Down toward the sea, in the bright afternoon.', 3600); }], [6500, () => { RIDE.target = 4; say('Montego Bay! The sea!', 3200); SFX.hornDiesel(1.0); }]]);
  bars(true); await wait(1600); await ensurePlace('beach'); if (!(await transition('beach', { env: ENV.day, after: () => { RIDE.on = false; bars(false); } }))) return; story.beach = null; showPlace('Montego Bay, afternoon'); setStage(43);
};
ON[43] = () => { const P = PL.beach; if (P) { P.done = {}; P.castle.userData.mound.scale.setScalar(0.01); } };
ON[44] = () => { if (cur !== 'beach') return; const a = envNow; tween(6, (k) => setEnv(mixEnv(a, ENV.gold, k))); say('The sun is going down over the sea.', 3600); };
ON[45] = () => { /* the chapter's end card comes from setStage */ };

/* ---------- chapter 5: the night train and the crash ---------- */
const CR = { on: false, phase: 0 };
ON[50] = () => { if (cur === 'coach') { const P = P_(); setRigTheme(P, 'night'); RIDE.on = true; RIDE.v = RIDE.target = 0; P.lamp.intensity = 9; setEnv(ENV.dusk); tween(10, (k) => setEnv(mixEnv(ENV.dusk, ENV.night, k))); say('Montego Bay railway station. Evening, and the sky is going dark.', 4200); } };
ON[51] = async () => { SFX.hornDiesel(1.2); say('The train pulls out of Montego Bay. Stars fill the windows.', 4200); RIDE.target = 12; };
ON[52] = () => { if (cur !== 'coach') return; say('The train climbs into the hills, slowly and steadily.', 4200); RIDE.target = 9; };
function crashIntro() {
  if (CR.on) return; card('About half past eleven', ['The next part is loud, and it may be scary.', 'It shows the crash gently. Nobody is hurt on the screen.'], [{ t: 'Begin', go: () => { hideCard(); crashRun(); } }, { t: 'Read what happened instead', go: () => { hideCard(); crashSkip(); } }], { col: true });
}
function crashSkip() {
  unlock('crash'); unlock('greenvale'); card('What happened', ['The train climbed to Greenvale, the highest station on the line. Then it ran downhill toward Kendal.', 'Three whistle blasts sounded. The train went faster, and left the rails on a curve.', 'Eight of the twelve coaches were wrecked. The last two coaches stayed on the track.'], [{ t: 'Go on', go: () => { hideCard(); setStage(53); arriveKendal(); } }], { col: true });
}
const HOLD = { on: false, v: 0 };
for (const ev of ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel']) $('hold').addEventListener(ev, (e) => { HOLD.on = ev === 'pointerdown'; $('hold').classList.toggle('on', HOLD.on); e.preventDefault(); });
addEventListener('keydown', (e) => { if ($('holdwrap').hidden) return; if (e.key === ' ' || e.key === 'Enter') HOLD.on = true; }); addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') HOLD.on = false; });
async function crashRun() {
  const ep = EP, P = P_(); CR.on = true; CR.phase = 0; unlock('greenvale'); setStage(53); frozen = false; moveLock = false; busy = false; talkWith = null; state.x = 2.6; state.z = 0; state.yaw = PI / 2; state.pitch = 0; bars(true); goalText = ''; $('goal').textContent = ''; $('hint').hidden = true;
  const live = () => ep === EP && CR.on, lamp = P.lamp;
  const step = async (ms, fn) => { await wait(ms); if (!live()) return false; fn(); return true; };
  SFX.mento(false); say('Greenvale. The highest station on the line.', 3600); RIDE.target = 8; await wait(3600);
  if (!(await step(300, () => { say('The train starts the long way down.', 3400); RIDE.target = 16; CR.phase = 1; })) ) return;
  if (!(await step(3500, () => { say('Lloyd: “We are going so fast!”', 3200); RIDE.target = 22; FX.shake = 0.08; }))) return;
  if (!(await step(3500, () => { say('Gran takes your hand. “Hold on, my dear.”', 3400); RIDE.target = 27; FX.shake = 0.16; CR.phase = 2; moveLock = true; HUSH = true; CRBEDS = { rumble: 0.7, rush: 0.3 }; }))) return;
  if (!(await step(3500, () => { say('Three long whistle blasts.', 3600); SFX.threeBlasts(); FX.shake = 0.2; }))) return;
  if (!(await step(3100, () => { say('The brakes scream.', 3000); SFX.screech(3.4); FX.shake = 0.5; CR.phase = 3; flash(0.35, 60, '#ff9a40'); setTimeout(() => flash(0, 220, '#ff9a40'), 90); $('holdwrap').hidden = false; HOLD.v = 0; goalText = 'Hold on!'; showGoal(); }))) return;
  const t0 = performance.now(); let tilt = 0;
  const lurch = tween(4.2, (k, dk) => { const held = HOLD.on ? 1 : 0; HOLD.v = clamp01(HOLD.v + (held ? 0.9 : -0.5) * dk * 4); $('holdbar').firstElementChild.style.width = (HOLD.v * 100) + '%'; FX.shake = 0.5 + k * 0.5 - HOLD.v * 0.25; tilt = ease(k) * 0.16; P.group.rotation.x = tilt; FX.roll = Math.sin(k * 44) * 0.01; lamp.intensity = Math.random() < k * 0.7 ? 0.5 : 9; if (Math.random() < 0.12) { flash(0.28, 40, '#ff8a30'); setTimeout(() => flash(0, 160, '#ff8a30'), 60); } RIDE.target = Math.max(0, 27 - k * 14); });
  if (!(await lurch)) return; if (!live()) return;
  $('holdwrap').hidden = true; CR.phase = 4; SFX.crashBang(); flash(1, 0, '#fff'); lamp.intensity = 0; P.group.rotation.x = 0.3; FX.shake = 1.6; RIDE.target = 0; RIDE.v = 6; say('', 100);
  await wait(450); if (!live()) return; flash(1, 0, '#000'); fadeBlack(true, 0); $('flash').style.opacity = 0; FX.shake = 0; RIDE.on = false; CRBEDS = {}; RING = 0.05;
  await wait(2600); if (!live()) return; $('fadeT').textContent = 'Kendal, Manchester'; $('fadeS').textContent = 'Sunday night, 1 September 1957. About half past eleven.'; $('fade').classList.add('txt'); unlock('crash'); unlock('greenvale');
  await wait(5200); if (!live()) return; $('fade').classList.remove('txt'); await wait(900); if (!live()) return; CR.on = false; bars(false); arriveKendal(true);
}
async function arriveKendal(fromCrash) {
  const ep = EP; resetTransient(); EP = ep + 1; const ep2 = EP; await ensurePlace('crash'); story.lamp = true; enterPlace('crash'); state.started = true; updateLamp(); setStage(60); showPlace('Kendal, Manchester. About half past eleven.');
  HUSH = false; RING = 0.05; const lr = tween(6, (k) => { RING = 0.05 * (1 - k); }); fadeBlack(false, fromCrash ? 3500 : 900); bars(!QUICK); say('Slowly, the ringing fades. You hear voices in the dark.', 4200);
  await wait(4600); if (ep2 !== EP) return; bars(false); showGoal(true);
}

/* ---------- chapter 6: the long night ---------- */
ON[61] = () => { ctr.water = 0; ctr.has = 0; };
ON[63] = () => { const d = byId('dawn'); if (d) { d.follow = true; d.ctl.play(null); } };
async function holdLamp() {
  frozen = true; busy = false; const P = P_(), ep = EP; say('You hold the lamp high.', 2600); const l = handLamp, base = l.intensity; l.intensity = 7; lampMesh.position.y = -0.18; await wait(2800); if (ep !== EP) return;
  say('Helpers carry people up the path, safe in your light.', 3800); await wait(3800); if (ep !== EP) return; l.intensity = base; lampMesh.position.y = -0.42; frozen = false; setStage(65);
}
ON[65] = async () => {
  const P = P_(), ep = EP; if (cur !== 'crash') return; frozen = true; busy = false; bars(true); goalText = ''; say('The night is long. The helpers work and work.', 4200);
  await wait(4200); if (ep !== EP) return; say('Slowly, the sky turns from black to blue.', 3800); const a = envNow;
  const t1 = tween(14, (k) => { setEnv(mixEnv(a, ENV.dawn, ease(k))); const f = 1 - 0.7 * k; for (const L of P.lights) L.userData.k = f; handLamp.intensity = 3.6 * (1 - k * 0.8); });
  await wait(4500); if (ep !== EP) return; say('Birds start to sing. It is nearly morning.', 3600); chirp();
  if (!(await t1)) return; say('In the morning light, you see all of it.', 3800);
  const t2 = tween(12, (k) => { setEnv(mixEnv(ENV.dawn, ENV.morning, ease(k))); for (const L of P.lights) L.userData.k = 0.3 * (1 - k); const x0 = state.x, z0 = state.z; }); P.torches.forEach((t) => { t.visible = false; }); P.flame.visible = false;
  const camA = [state.x, EYE, state.z]; await cut(camA, [state.x - 6, 3.2, state.z - 2], [state.x - 8, 1.4, state.z - 10], [-12, 1.2, -9], 8); if (ep !== EP) return;
  await t2; await wait(1200); if (ep !== EP) return; endCut(); frozen = false; bars(false); handLamp.intensity = 0; lampMesh.visible = false; setStage(66);
};
function finishCh6() {
  unlock('cause'); unlock('helpers'); unlock('toll'); unlock('mourning');
  card('The morning after', ['By morning, close to 200 people had died, and about 700 were hurt.', 'Hundreds of people from Kendal and nearby helped through the night.', 'Friday 8 September was a National Day of Mourning. The railway later replaced all its wooden coaches with metal ones.', 'Four new pages are in your journal.'], [{ t: 'Next chapter', go: () => { hideCard(); beginChapter(6); } }, { t: 'Stay here', go: hideCard }], { col: true });
}
ON[67] = finishCh6;

/* ---------- chapter 7: Kendal today ---------- */
ON[70] = () => { setTimeout(() => SFX.churchBell(2), 1200 * TS); };
async function leaveFlower() {
  const P = P_(), ep = EP; frozen = true; const f = flowers(7); f.position.set(P.spots.wall[0] + 1.0, 0, P.spots.wall[1] + 1.0); P.group.add(f); say('You leave a flower. For a moment, everything is quiet.', 4200); SFX.churchBell(2); await wait(4800); if (ep !== EP) return; frozen = false; setStage(73);
}
ON[74] = () => { unlock('remember'); unlock('railend'); unlock('journey'); setTimeout(() => card('The end', ['The Kendal train crash was a very sad day for Jamaica.', 'It was also a day when many people helped.', 'Thank you for remembering. You can read your journey in the Journal.'], [{ t: 'Read your journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Chapters', go: () => { hideCard(); openChapters(); } }, ...(MENU.ok ? [{ t: 'All games', go: toMenu }] : []), { t: 'Stay here', go: hideCard }], { col: true }), 1200 * TS); };

/* ---------- the helper arrow: stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
const NUDGE_EXTRA = { 12: () => [30, 0] };
function nudgeTarget() {
  const P = P_(); if (!P) return null; if (NUDGE_EXTRA[stage]) return NUDGE_EXTRA[stage](); const a = P.actions.find((x) => x.on()); if (a) return [a.x, a.z];
  let bestT = null, bd = 1e9; for (const n of P.people) if (n.m && n.m.visible && wantsTalk(n)) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; bestT = [n.x, n.z]; } } return bestT;
}
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return; const quiet = state.started && !busy && !frozen && !DIR.on && !CR.on && $('holdwrap').hidden && $('dialogue').hidden && $('card').hidden && goalText && !fading;
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
let auNext = 0, onceAt = 6; const AMB = 0.4;   /* the ambient beds are kept low so voices, whistles and the story stay clear */
const SOUNDSCAPE = { road: { wind: 0.07, crowd: 0.01, once: chirp }, station45: { crowd: 0.16, wind: 0.04, once: () => SFX.hiss(1.4, 0.06) }, ride45: { wind: 0.05 }, hill: { wind: 0.12, crowd: 0.02, once: chirp }, kingston57: { crowd: 0.2, wind: 0.03, idle: 0.1, once: () => SFX.stationGong() }, coach: { room: 0.1, crowd: 0.05 }, beach: { sea: 0.24, surf: 0.1, wind: 0.05, crowd: 0.05, once: gullCry }, crash: { cricket: 0.14, crowd: 0.05, wind: 0.03 }, memorial: { wind: 0.06, once: chirp } };
const FOOT = { road: 'grass', station45: 'wood', ride45: 'wood', hill: 'wood', kingston57: 'stone', coach: 'wood', beach: 'sand', crash: 'grass', memorial: 'grass' };
function audioTick(t, now) {
  if (!AU.ctx) return; SFX.mentoTick(t); if (t < auNext) return; auNext = t + 0.1; const S = SOUNDSCAPE[cur] || {};
  SFX.mento(cur === 'beach' && Math.hypot(state.x - 14, state.z - 4) < 24 && stage >= 43 && stage <= 44);
  if (HUSH) { for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], 0, 0.2); SFX.setBeds({ ...CRBEDS, ring: RING }, 0.3); return; }
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], (S[k] || 0) * AMB);
  const v = RIDE.on ? RIDE.v : 0; SFX.setBeds({ rumble: Math.min(0.5, v / 28) * 0.6, rush: Math.min(0.2, v / 70) * 0.5, idle: ((S.idle || 0) + (RIDE.on && RIDE.kind === 'diesel' ? 0.06 : 0)) * 0.6, cricket: (S.cricket || 0) * 0.5, ring: RING });
  if (t > onceAt) { onceAt = t + 6 + Math.random() * 6; if (S.once && AU.on && state.started) S.once(); }
}

/* ---------- loading and starting ---------- */
applySave(loadGame());
{ let done = 0; const total = 3; const tick = () => { done++; $('bar').style.width = (done / total * 100) + '%'; };
  buildPlace('kingston57'); enterPlace('kingston57');   /* the long platform and the train, as a backdrop for the title card */
  const first = CH_PLACE[hasSave && stage >= 10 ? chapterOf(stage) : 0];
  model('anims').then((an) => { loadClips(an); tick(); return ensurePlace(first); }).then(() => { tick(); modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave; tick();
    if (__DEV__) devViews(); else setTimeout(backgroundLoad, 2500); }); }
async function backgroundLoad() { for (const id of ['station45', 'hill', 'kingston57', 'ride45', 'coach', 'beach', 'crash', 'memorial']) { await ensurePlace(id); await wait(400); } }
function startGame(quiet) {
  if (state.started) return; audioInit(); SFX.initBeds(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. E to use.'; showHint(); canvas.focus(); if (!quiet) cue('begin');
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
        [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt); stepT -= dt * sp; if (stepT <= 0) { stepT = 1.35; if (!RIDE.on || RIDE.v < 12) stepSound(FOOT[cur]); } } }
  }
  if ((frameN & 7) === 0) for (const n of P.extras) { const d = Math.hypot(state.x - n.x, state.z - n.z); n.m.visible = d < 75 && !n.hidden; }
  for (const n of P.npcs) npcTick(n, dt);
  near = null; if (state.started && !busy && !frozen && !DIR.on) { let b = 2.6; for (const n of P.people) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && n.m.visible && d < b) { b = d; near = n; } } for (const a of P.actions) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }
  const tb = $('talk'); tb.hidden = !(near && near.go); if (near && near.go) tb.textContent = near.label;
  for (const n of P.npcs) if (n.m.visible && n.ctl) { n.ctl.mx.update(dt); n.ctl.tick(dt); }
  if ((frameN++ & 1) === 0) for (const m of P.bodies) if (m.visible) groundFeet(m);
  if (P.tick) P.tick(dt, (now || 0) / 1000); rideTick(dt, (now || 0) / 1000); smokeTick(dt);
  for (let i = TICKS.length - 1; i >= 0; i--) if (TICKS[i](dt)) TICKS.splice(i, 1);
  if (cur === 'road' && stage === 12 && state.x > 24) setStage(13);
  if (cur === 'hill' && P.train.visible) { for (const o of P.train.userData.wheels || []) o.w.rotation.z += 0; }
  if (now !== undefined) { audioTick(now / 1000, now); bubbleTick(now / 1000); stickUI(); nudgeTick(now); }
}
let last = performance.now();
function frame(t) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  if (DIR.on) { const k = ease(Math.min(1, DIR.t / DIR.dur)); camera.position.lerpVectors(DIR.a, DIR.b, k); _v.lerpVectors(DIR.la, DIR.lb, k); camera.lookAt(_v); }
  else if (!state.started && P_() && P_().titleView) { const tv = P_().titleView, s = t / 1000; camera.position.set(tv.x - Math.sin(s * 0.08) * 3, tv.y, tv.z); camera.rotation.set(tv.pitch, tv.yaw + Math.sin(s * 0.05) * 0.04, 0, 'YXZ'); }
  else { camera.position.set(state.x, EYE - (sitting ? 0.35 : 0) + FX.bob, state.z); camera.rotation.set(state.pitch, state.yaw, FX.roll + FX.tilt, 'YXZ'); }
  if (FX.shake > 0) { const k = FX.shake; camera.position.x += (Math.random() - 0.5) * k * 0.07; camera.position.y += (Math.random() - 0.5) * k * 0.07; camera.position.z += (Math.random() - 0.5) * k * 0.07; camera.rotation.z += (Math.random() - 0.5) * k * 0.035; }
  sun.target.position.set(camera.position.x, 0, camera.position.z); sun.position.copy(sun.target.position).addScaledVector(sunDir, 110); birds.tick(t / 1000, !!(P_() && envNow.stars < 0.3 && !P_().ride && P_().id !== 'crash'), camera.position.x, camera.position.z);
  sky.dome.position.copy(camera.position); sky.stars.position.copy(camera.position); sky.moon.position.set(camera.position.x - 190, camera.position.y + 230, camera.position.z - 380);
  if (!NORENDER) renderer.render(scene, camera);
}
const NORENDER = __DEV__ && /[?&]auto=/.test(location.search);   /* the scripted playthrough does not need pictures, and software drawing is slow */
requestAnimationFrame(frame);

/* ---------- the place audit (dev builds): the checks live in engine/audit.js. Run ?test=audit and expect 0 issues in every place. ---------- */
const auditPlace = (P) => auditPlaceE({ id: P.id, snap: P.snap, npcs: P.npcs.map((n) => ({ id: n.id || n.base, x: n.hx, z: n.hz, anim: n.anim, ground: n.m.userData.ground || 0, path: n.path })), walls: P.walls, bounds: P.bounds, start: P.start,
  actions: P.actions, people: P.people.map((n) => ({ id: n.id, x: n.x, z: n.z, anim: n.anim })) });

/* ---------- test views and scripted playthroughs: dev builds only (node tools/build.mjs kendal --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search), shot = q.get('shot'), errs = [];
  addEventListener('error', (e) => { errs.push(e.message); document.title = 'ERROR ' + errs.join(' | '); });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.title = 'ERROR ' + errs.join(' | '); });
  const go = async (id, st, x, z, yaw, pitch, env) => { const P = await ensurePlace(id); $('title').hidden = true; $('hud').hidden = false; state.started = true; enterPlace(id, { env }); stage = st; best = Math.max(best, st); state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); refreshGoal(); return P; };
  const V = {
    mule1: ['road', 11, -29.5, 6.4, -0.35, -0.05], mule2: ['road', 11, -25.4, 6.6, 0.15, -0.02], road1: ['road', 10, -33, 0.6, -1.35, 0], road2: ['road', 12, 22, 0.8, -1.5, 0.02], road3: ['road', 10, -22, 2.2, -0.1, 0],
    st1: ['station45', 20, -2, 6.5, 0.15, 0], st2: ['station45', 20, -7, 4.2, 0.9, 0.02], st3: ['station45', 20, 14, 5, 0.25, 0.05],
    hill1: ['hill', 30, -24, 5.5, -1.5, 0], hill2: ['hill', 30, -10, 4, -0.3, 0.05],
    k1: ['kingston57', 40, -22, 5, PI / 2 - 0.2, 0], k2: ['kingston57', 40, -22, 5, -PI / 2 + 0.4, 0], k3: ['kingston57', 40, -9, 6.2, 0.35, 0], k4: ['kingston57', 41, 28, 4, -PI / 2, 0],
    ride1: ['ride45', 23, 0.2, 0, PI / 2 + 0.25, 0], ride2: ['ride45', 23, 0.2, 0, 0.3, 0.05], poster: ['kingston57', 40, 47, -9.0, PI / 2 + 0.5, 0.03, ENV.gold], lurch: ['coach', 53, 1.5, 0, PI / 2 + 0.5, 0], coach1: ['coach', 51, 4.3, 0, PI / 2, 0], coach2: ['coach', 51, 0, 0, 1.2, 0], coach3: ['coach', 51, 3.2, 0.2, PI / 2 - 0.5, 0],
    beach1: ['beach', 43, 0, 9, 0.1, 0], beach2: ['beach', 43, 8, 3, -1.2, 0],
    crash4: ['crash', 61, 8, 4.4, 0.9, 0.04], crash1: ['crash', 60, 17, 5.8, 1.7, 0], crash2: ['crash', 60, 8, 6, 2.2, 0.05], crash3: ['crash', 61, -4, 9, 3.14, 0.02], crash5: ['crash', 66, 9, 5, 0.75, 0.0],
    mem1: ['memorial', 70, 0, 4.6, 0, 0.02], mem2: ['memorial', 71, 4, -4, 0.0, 0.1],
  };
  if (shot === 'talk1') go('road', 10, -27, 4.2, -0.7, 0).then((P) => { startTalk(byId('dudley')); });
  if (shot === 'talk2') go('crash', 62, 9, 8, PI, 0).then((P) => { story.lamp = true; updateLamp(); startTalk(byId('dawn')); });
  if (shot === 'card1') go('coach', 52, 2, 0, -PI / 2, 0).then(() => { crashIntro(); });
  if (shot === 'journal1') go('road', 10, -27, 4.2, 0, 0).then(() => { for (const id of ['slowroad', 'higglers', 'free', 'cause']) unlock(id, true); openJournal('cause'); });
  if (shot === 'chap1') go('road', 10, -27, 4.2, 0, 0).then(() => { best = 35; modelsReady = true; openChapters(); });
  if (V[shot]) go(...V[shot]).then((P) => {
    if (shot === 'st3') { /* the governor's end */ }
    if (shot === 'hill2') { P.train.visible = true; P.train.position.x = 0; }
    if (shot === 'mule2') { (async () => { for (let i = 0; i < 3; i++) { loadItem(P, P.goods[i], i); for (let k = 0; k < 30; k++) update(0.05); } for (let k = 0; k < 10; k++) update(0.05); })(); }
    if (/^ride/.test(shot)) { RIDE.on = true; RIDE.kind = 'steam'; RIDE.v = RIDE.target = 9; for (let i = 0; i < 40; i++) update(0.05); }
    if (shot === 'poster') { $('hud').hidden = true; for (let i = 0; i < 4; i++) update(0.05); }
    if (shot === 'lurch') { setRigTheme(P, 'night'); setEnv(ENV.night); RIDE.on = true; RIDE.kind = 'diesel'; RIDE.v = RIDE.target = 24; P.lamp.intensity = 3; for (let i = 0; i < 30; i++) update(0.05); P.group.rotation.x = 0.17; FX.shake = 0.5; bars(true); say('The brakes scream.', 99999); }
    if (/^coach/.test(shot)) { RIDE.on = true; RIDE.kind = 'diesel'; RIDE.v = RIDE.target = 12; for (let i = 0; i < 30; i++) update(0.05); }
    if (shot === 'coach3') { setRigTheme(P, 'night'); setEnv(ENV.night); }
    if (/^crash/.test(shot)) { story.lamp = true; updateLamp(); if (shot === 'crash2') { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; handLamp.intensity = 0; P.torches.forEach((t) => { t.visible = false; }); } }
    if (shot === 'crash3') { setEnv(ENV.dawn); }
    if (shot === 'crash5') { setEnv(ENV.morning); for (const L of P.lights) L.userData.k = 0.1; handLamp.intensity = 0; lampMesh.visible = false; P.torches.forEach((t) => { t.visible = false; }); }
    if (/^k\d/.test(shot)) SFX.initBeds;
    for (let i = 0; i < 6; i++) update(0.05);
    if (q.has('stats')) setTimeout(() => { renderer.info.reset(); renderer.render(scene, camera); const i = renderer.info; const t = 'STATS calls=' + i.render.calls + ' tris=' + i.render.triangles + ' geo=' + i.memory.geometries + ' tex=' + i.memory.textures; document.title = t; console.log(t); }, 1500);
  });
  if (q.get('test') === 'layout') {   /* ?test=layout : open each UI state and check that no two visible things overlap, nothing is cut off, and nothing is off the screen. Run at several window sizes. */
    (async () => { const out = [], W = innerWidth, Hh = innerHeight; await ensurePlace('road'); startGame(true); enterPlace('road'); $('hud').hidden = false; $('title').hidden = true; stage = 11; refreshGoal();
      const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'sub', 'dialogue', 'cinner', 'place', 'hold', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
      const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${Hh} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0}`); } };
      const reset = () => { for (const id of ['talk', 'toast', 'dialogue', 'card', 'holdwrap', 'nudge']) $(id).hidden = true; $('hint').hidden = true; bars(false); document.body.classList.remove('subbing', 'talking'); $('sub').classList.add('dim'); $('place').hidden = true; };
      const settle = () => new Promise((r) => setTimeout(r, 700));
      reset(); showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); toast('Loaded 2 of 3'); showPlace('The Spanish Town road, about 1844'); await settle(); check('play: goal, talk, hint, toast, place');
      reset(); showGoal(true); say('The train climbs into the hills, slowly and steadily, and the engines work very hard indeed.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); toast('Loaded 2 of 3'); await settle(); check('narration without bars');
      reset(); bars(true); say('The train climbs into the hills, slowly and steadily, and the engines work very hard indeed.', 1e6); $('talk').hidden = false; $('talk').textContent = 'Sit down with Gran'; showHint(); await settle(); await new Promise((r) => setTimeout(r, 1100)); check('narration inside the bars');
      reset(); showGoal(true); document.body.classList.add('talking'); $('dialogue').hidden = false; $('who').textContent = 'Mass Dudley'; $('line').textContent = 'Some say a railway will help us. Some say it will take our work. What do you think about that, child?'; $('choices').innerHTML = '<button class="btn ghost">It will help people.</button><button class="btn ghost">It might take your work.</button><button class="btn ghost">I do not know yet.</button>'; $('next').hidden = true; await settle(); check('dialogue with three choices');
      reset(); bars(true); say('Hold on!', 1e6); $('holdwrap').hidden = false; $('talk').hidden = true; await settle(); await new Promise((r) => setTimeout(r, 1100)); check('hold on button in the bars');
      reset(); card('About half past eleven', ['The next part is loud, and it may be scary.', 'It shows the crash gently. Nobody is hurt on the screen.'], [{ t: 'Begin', go: () => {} }, { t: 'Read what happened instead', go: () => {} }], { col: true }); await settle(); check('card');
      reset(); $('nudge').hidden = false; showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Give the water to the nurse'; await settle(); check('helper arrow with talk button');
      document.title = 'LAYOUT ' + out.length; const el = $('autolog'); if (el) el.textContent = (out.length ? out : [W + 'x' + Hh + ': no layout problems']).join('\n'); })();
  }
  if (q.get('test') === 'held') {
    if (q.get('hs')) for (const k of ['hamper', 'suitcase', 'bucket']) { GRIP[k] = { ...GRIP[k], scale: +q.get('hs') * (k === 'suitcase' ? 1.4 : 1), out: +q.get('ho') }; } if (q.get('ls')) GRIP.lantern = { ...GRIP.lantern, scale: +q.get('ls'), out: +q.get('lo') };   /* ?test=held : every carried thing, in every place: at the hand, upright, clear of the body */
    (async () => { const out = []; startGame(true); for (const id of Object.keys(BUILD)) { const P = await ensurePlace(id); for (const n of P.npcs) if (n.m.userData.held && n.m.userData.held.length) { n.m.userData.anim.mx.update(0.1); for (const l of auditHeld(n.id || n.base, n.m, n.m.userData.held)) out.push(id + ': ' + l); } }
      out.unshift('held items: ' + (out.length) + ' issues'); const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'HELD ' + out.length; })();
  }
  if (q.get('test') === 'audit') {   /* ?test=audit&p=road,hill : floating objects, people inside solids, unreachable spots */
    (async () => { const ids = (q.get('p') || Object.keys(BUILD).join(',')).split(','), out = []; startGame(true); for (const id of ids) { const P = await ensurePlace(id); const r = auditPlace(P); out.push(id + ': ' + (r.floating.length + r.inside.length + r.stuck.length) + ' issues'); for (const l of [...r.floating, ...r.inside, ...r.stuck]) out.push('  ' + l); }
      const el = $('autolog'); if (el) el.textContent = out.join('\n'); document.title = 'AUDIT ' + out.length; })();
  }
  if (q.get('test') === 'resume') {   /* saved games resume in the right place, and closing a finishing conversation still moves the story on */
    (async () => { const out = []; startGame(true);
      await beginChapter(3, 44); out.push('ch4@44 place=' + cur + ' stage=' + stage); await beginChapter(3, 43); out.push('ch4@43 place=' + cur);
      await beginChapter(2, 34); const H = PL.hill; out.push('ch3@34 place=' + cur + ' train=' + H.train.visible + '@' + H.train.position.x);
      await beginChapter(5, 66); out.push('ch6@66 place=' + cur + ' lamp=' + (handLamp.intensity > 0) + ' sun=' + envNow.sun[1].toFixed(1));
      await beginChapter(5, 61); out.push('ch6@61 lamp=' + (handLamp.intensity > 0));
      let ran = 0; convo([{ who: 'x', text: 'y' }, { who: 'x', text: 'z' }], () => { ran++; }); leaveTalk(); out.push('convo closed early, callback ran=' + ran);
      let ran2 = 0; startTalk(P_().people[0]); leaveTalk(); out.push('ordinary talk closed early: talked=' + !!P_().people[0].talked);
      document.title = 'RESUME ' + out.join(' | '); })();
  }
  if (q.has('clickstart')) setTimeout(() => $('start').click(), 300);   /* the real start, with real fades (the other test views skip them) */
  if (q.has('auto')) {   /* ?auto=N plays chapter N (1 to 7) and the ones after it; add &one to stop after N. It logs every change to the page title and #autolog, and says STALL if nothing changes for a while. */
    const N = +q.get('auto'), one = q.has('one'), log = [], sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const L = (m) => { log.push(m); document.title = log.join(' | '); const el = $('autolog'); if (el) el.textContent = log.join('\n'); };
    (async () => {
      await waitFor(() => modelsReady); startGame(true); let ch = N - 1; L('start ch' + (ch + 1)); await beginChapter(ch); const finished = () => (ch === 4 ? stage >= 60 : stage >= DONE[ch]);
      let lastKey = '', lastT = performance.now(), ticks = 0; const nap = () => { for (let i = 0; i < 8; i++) update(0.05); };
      for (;;) {
        await sleep(120); nap(); ticks++; const now = performance.now();
        const key = stage + '|' + cur + '|' + unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + (DIR.on ? 'cut' : '') + (RIDE.on ? 'ride' : '');
        if (key !== lastKey) { lastKey = key; lastT = now; L('s' + stage + ' ' + cur + ' pages=' + unlocked.length + (RIDE.on ? ' ride' : '') + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + $('goal').textContent + '"'); }
        if (now - lastT > 30000) { L('STALL at stage ' + stage + ' in ' + cur + ' busy=' + busy + ' frozen=' + frozen + ' fading=' + fading); break; }
        if (!$('card').hidden) { if (finished() && /Chapter|morning|The end/.test($('ctitle').textContent)) { /* a chapter-end card */ } const b = $('cbtns').querySelector('button'); if (b) b.click(); continue; }
        if (!$('dialogue').hidden) { const c = $('choices').firstChild; if (c) c.click(); else $('next').click(); continue; }
        if (!$('holdwrap').hidden) { HOLD.on = true; continue; }
        if (finished()) { L('chapter ' + (ch + 1) + ' DONE at stage ' + stage); if (one || ch >= 6) { L(ch >= 6 || one ? 'ALLDONE' : ''); break; } ch++; L('next ch' + (ch + 1)); await beginChapter(ch); lastT = performance.now(); continue; }
        if (busy || frozen || DIR.on || fading || CR.on) continue;
        const P = P_(); if (!P) continue; const a = P.actions.find((x) => x.on());
        if (a) { state.x = a.x; state.z = a.z; update(0.016); a.go(); continue; }
        const n = P.people.find((p) => wantsTalk(p)); if (n) { state.x = n.x + 1.1; state.z = n.z + 0.4; update(0.016); startTalk(n); continue; }
        if (cur === 'road' && stage === 12) { state.x = 26; state.z = 0; update(0.016); }
      }
    })();
  }
}
