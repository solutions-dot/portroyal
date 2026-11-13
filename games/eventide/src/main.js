/* games/eventide/src/main.js: Eventide 1980 (the plan is docs/games/eventide.md).
   Early local build: the walking and talking shell from games/_template, the first characters made with tools/eventide/people.py,
   and dev views to check them under the game's own light. Owner rule 9: skin must read clearly in every light, so the Skin
   material is lightened here as Kendal does (SKIN_LIGHT), and the views show day, night firelight and faces close up.
   The places are built in places.js. The place audit (CLAUDE.md rule 8) is wired: ?test=audit must report 0 issues in every place.
   Still to wire before the first PR: ?test=held and ?test=layout (docs/TESTING.md section 5). */
import * as THREE from 'three';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { CL, mixers, loadClips, animate } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, AU } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';
import { snapMeshes, auditPlace } from '../../../engine/audit.js';
import { batchStatic } from './gfx.js';
import { buildSlipe, buildMonument } from './places.js';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
soundPref('eventide-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light: day (Kingston in May) or night (the fire, chapter 4) ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
const hemi = new THREE.HemisphereLight(0xeaf4ff, 0x8a7a5a, 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2dc, 2.2); sun.position.set(20, 30, 10); scene.add(sun);
const fire = new THREE.PointLight(0xff8a3a, 0, 0, 2); fire.position.set(-5, 2.6, -9); scene.add(fire);   /* the burning ward, seen from the rope: only on at night */
const faceFill = new THREE.PointLight(0xffdcb8, 0, 7, 2); camera.add(faceFill); scene.add(camera);   /* owner rule 9: at night a soft warm light from where you stand, so the face of anyone you talk to shows */
function setLight(mood) {
  const night = mood === 'night';
  scene.background = new THREE.Color(night ? 0x0b1020 : 0xbcd6e0); scene.fog = new THREE.Fog(scene.background, night ? 12 : 30, night ? 45 : 90);
  hemi.color.setHex(night ? 0x4a5677 : 0xeaf4ff); hemi.groundColor.setHex(night ? 0x3a2414 : 0x8a7a5a); hemi.intensity = night ? 0.9 : 1.6;   /* night: moonlight above, the fire's glow bouncing up from the road */
  sun.color.setHex(night ? 0x9fb4e0 : 0xfff2dc); sun.intensity = night ? 0.3 : 2.2;
  fire.intensity = night ? 260 : 0; faceFill.intensity = night ? 2.2 : 0;
}
setLight(q.get('night') ? 'night' : 'day');
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- places: built when first needed, one visible at a time ---------- */
const BUILD = { slipe: buildSlipe, monument: buildMonument };
const PLACES = {}; let place = null, WALLS = [];   // WALLS: [x0, z0, x1, z1] boxes the player cannot enter
function ensurePlace(id) {
  if (PLACES[id]) return PLACES[id];
  const group = new THREE.Group(); group.visible = false; scene.add(group);
  const P = { id, group, ...BUILD[id](group) };
  if (__DEV__) P.snap = snapMeshes(group);   /* for the audit, before the meshes are merged */
  batchStatic(group); PLACES[id] = P; return P;
}
function enterPlace(id) {
  for (const k in PLACES) PLACES[k].group.visible = false;
  place = ensurePlace(id); place.group.visible = true; WALLS = place.walls;
  state.x = place.start.x; state.z = place.start.z; state.yaw = place.start.yaw || 0; state.pitch = 0;
  return place;
}
const groundAt = (x, z) => (place ? place.groundAt(x, z) : 0);

/* ---------- people: one of the Eventide bodies, with the skin lightened (owner rule 9) ---------- */
const SKIN_LIGHT = 1.55;   /* as Kendal: bodies are built with Skin in the Marcus Garvey range, then lightened here so faces read at night, indoors and by firelight */
const BASES = {};
function makeBody(base, o = {}) {
  const m = skClone(BASES[base].scene);
  m.traverse((n) => { if (!n.isMesh) return; n.frustumCulled = false; n.material = n.material.clone();
    if ((n.material.name || '') === 'Skin') n.material.color.setScalar((o.skin || 1) * SKIN_LIGHT); });
  m.position.set(o.x || 0, o.ground || 0, o.z || 0); m.rotation.y = o.ry || 0; scene.add(m); animate(m, o.anim || 'Idle'); return m;
}

/* ---------- player state and movement (as the template) ---------- */
const state = { x: 0, z: 4, yaw: 0, pitch: 0, started: false };   // yaw 0 looks toward -z
const keys = new Set(); let busy = false;
addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); keys.add(k); if (k === 'escape') leaveTalk(); if ((k === 'e' || k === 'enter') && !busy && near) startTalk(); });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {
  const b = place ? place.bounds : { x0: -35, x1: 35, z0: -35, z1: 35 }; x = Math.max(b.x0, Math.min(b.x1, x)); z = Math.max(b.z0, Math.min(b.z1, z));
  for (const [x0, z0, x1, z1] of WALLS) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (busy) { leaveTalk(); return; }
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; }
  if (e.pointerId === look.id) { if (look.moved < 8 && tapPerson(e.clientX, e.clientY)) startTalk(); look.id = null; }
};
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);

/* ---------- a person to talk to: Miss Iris (fictional; placeholder lines until chapter 1 is written) ---------- */
let person = null, near = false;
let PERSON = { x: 0, z: -2, who: 'Miss Iris' };
const TALK = [
  { who: 'Miss Iris', text: 'I cannot see you, child. But I know your footsteps.' },
  { who: 'You', text: 'Good afternoon, Miss Iris.' },
  { who: 'Miss Iris', text: 'Come sit with me a while.' }];
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) { if (!person) return false; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); return ray.intersectObject(person, true).length > 0 && Math.hypot(state.x - PERSON.x, state.z - PERSON.z) < 6; }

/* ---------- talking ---------- */
let step = 0;
function startTalk() { busy = true; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; if (person && CL.Talk1) person.userData.anim.play('Talk1'); showLine(); }
function showLine() { const s = TALK[step], me = s.who === 'You'; $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); }
function nextLine() { uiSound('tap'); step++; if (step >= TALK.length) { endTalk(); return; } showLine(); }
function endTalk() { busy = false; $('dialogue').hidden = true; if (person) person.userData.anim.rest(); }
function leaveTalk() { if (!$('dialogue').hidden) endTalk(); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = startTalk;
function setGoal(t) { $('goal').textContent = t; }

/* ---------- loading ---------- */
const CAST = ['iris1980', 'girl1980', 'boy1980'];
Promise.all([model('anims'), ...CAST.map((n) => model(n))]).then(([anims, ...bodies]) => {
  loadClips(anims); CAST.forEach((n, i) => { BASES[n] = bodies[i]; });
  if (__DEV__ && q.has('shot')) { devView(q.get('shot')); return; }
  if (__DEV__ && q.get('test') === 'audit') { runAudit(); return; }
  enterPlace('slipe'); const sp = place.spots.iris; PERSON = { ...PERSON, x: sp.x, z: sp.z };
  person = makeBody('iris1980', { x: sp.x, z: sp.z, ry: sp.ry, ground: sp.ground });
  $('start').disabled = false; $('start').textContent = 'Start'; $('loadnote').textContent = '';
});
$('start').onclick = () => { audioInit(); $('title').hidden = true; $('hud').hidden = false; state.started = true; setGoal('Walk to the Home. Miss Iris is on the veranda.'); canvas.focus(); };
$('sound').onclick = () => { setSound(!AU.on); $('sound').textContent = AU.on ? 'Sound on' : 'Sound off'; };

/* ---------- dev views (dev builds only): the cast under the game's light ---------- */
let fixedCam = null;
const VIEWS = {   /* place, x, z, yaw, pitch, light */
  road1: ['slipe', -26, 4.6, -0.55, 0.05], road2: ['slipe', -6, 3.0, 0.15, 0.12], gate1: ['slipe', 0, -5.5, 0, 0.1], ward1: ['slipe', -9, -10, -0.35, 0.16],
  ward2: ['slipe', 14, -9, 0.75, 0.12], veranda1: ['slipe', 0.6, -19.2, -1.5, 0.02], wardnight: ['slipe', -8, 3.5, -0.2, 0.12, 'night'], kids1: ['slipe', 20, -10.5, -0.7, 0.05],
  mon1: ['monument', 0, 7.5, 0, 0.12], mon2: ['monument', 0.0, 2.3, 0, 0.32], mon3: ['monument', 4.5, 3.5, 0.8, 0.15],
};
function devView(v) {
  $('title').hidden = true; $('hud').hidden = true;
  if (VIEWS[v]) { const [id, x, z, yaw, pitch, light] = VIEWS[v]; enterPlace(id); state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch; setLight(light || 'day');
    if (id === 'slipe') { const sp = place.spots.iris; makeBody('iris1980', { x: sp.x, z: sp.z, ry: sp.ry, ground: sp.ground }); }
    for (const mx of mixers) mx.update(0.5); document.title = 'view ' + v + ' ready'; return; }
  const line = [['iris1980', -1.0], ['girl1980', 0], ['boy1980', 1.0]];
  for (const [n, x] of line) makeBody(n, { x, z: -3, ry: /night/.test(v) ? -0.5 : 0 });
  if (v === 'cast' || v === 'castnight') fixedCam = { p: [0, 1.25, 0.9], t: [0, 0.85, -3] };
  if (v === 'castclose' || v === 'castnightclose') fixedCam = { p: [-0.55, 1.42, -2.0], t: [-0.55, 1.28, -3] };   /* Miss Iris and the girl, faces */
  if (/night/.test(v) && !q.get('night')) setLight('night');
  for (const mx of mixers) mx.update(0.5);
  document.title = 'view ' + v + ' ready';
}

/* ---------- the place audit (dev builds): engine/audit.js. ?test=audit must report 0 issues in every place (CLAUDE.md rule 8) ---------- */
function runAudit() {
  $('title').hidden = true; $('hud').hidden = true; const out = [], ids = q.get('p') ? q.get('p').split(',') : Object.keys(BUILD); let total = 0;
  for (const id of ids) {
    const P = ensurePlace(id), sp = P.spots || {};
    const npcs = id === 'slipe' ? [{ id: 'iris', x: sp.iris.x, z: sp.iris.z, anim: 'Idle', ground: sp.iris.ground }] : [];
    const r = auditPlace({ id, snap: P.snap, npcs, walls: P.walls, bounds: P.bounds, start: P.start, actions: [], people: npcs });
    const n = r.floating.length + r.inside.length + r.stuck.length; total += n;
    out.push(id + ': ' + n + ' issues', ...r.floating.map((l) => '  ' + l), ...r.inside.map((l) => '  ' + l), ...r.stuck.map((l) => '  ' + l));
  }
  const pre = document.createElement('pre'); pre.id = 'autolog'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
  document.title = 'audit ' + total + ' issues';
}

/* ---------- the frame loop ---------- */
let last = performance.now(), stepT = 0;
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  if (state.started && !busy) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
    if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
    const len = Math.hypot(f, r);
    if (len > 0.05) { const sp = (keys.has('shift') ? 4.2 : 2.6) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
      [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt);
      stepT -= dt * sp; if (stepT <= 0) { stepT = 1.4; stepSound('sand'); } }
  }
  near = state.started && !busy && Math.hypot(state.x - PERSON.x, state.z - PERSON.z) < 2.6; $('talk').hidden = !near;
  if (person) { const want = Math.atan2(state.x - PERSON.x, state.z - PERSON.z); let e = want - person.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); if (near || busy) person.rotation.y += e * Math.min(1, dt * 5); }
  for (const mx of mixers) mx.update(dt); if (person && person.userData.anim) person.userData.anim.tick(dt);
  if (fixedCam) { camera.position.set(...fixedCam.p); camera.lookAt(...fixedCam.t); }
  else { camera.position.set(state.x, groundAt(state.x, state.z) + 1.32, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ'); }   /* a child's eye height, as Kendal */
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
