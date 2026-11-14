import { releaseOnBlur, useInteractionKey } from '../../../engine/input.js';
/* games/_template/src/main.js: the smallest working game on the shared engine.
   Copy this folder to games/<your-game>/ and grow it (see docs/NEW_GAME.md).
   It shows: a scene, first-person movement (keys, touch joystick, drag to look, gamepad-free),
   simple collisions, one person who plays shared animations, talking with a dialogue box,
   a goal line, footsteps and UI sounds, and a link back to the game menu.
   RULE for every game (CLAUDE.md rule 8): before the first PR, wire the automatic audits from engine/audit.js (floating objects, people in solids,
   unreachable spots, held items, overlapping people) and a layout test into the dev build, and fix everything they report.
   See docs/TESTING.md section 5 and games/kendal/src/main.js ("the place audit"). */
import * as THREE from 'three';
import { CL, mixers, loadClips, animate } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, AU } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';

const $ = (id) => document.getElementById(id);
soundPref('template-sound');   // change the key for your game so each game remembers its own sound setting
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xbcd6e0); scene.fog = new THREE.Fog(0xbcd6e0, 30, 90);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x8a7a5a, 1.6));
const sun = new THREE.DirectionalLight(0xfff2dc, 2.2); sun.position.set(20, 30, 10); scene.add(sun);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- the world: ground and a few buildings (each building is also a wall you cannot walk through) ---------- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);
const WALLS = [];   // [x0, z0, x1, z1] boxes the player cannot enter
function building(x, z, w, d, h, color) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.9 })); b.position.set(x, h / 2, z); scene.add(b);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0x8a4a32 })); roof.position.set(x, h + 0.8, z); roof.rotation.y = Math.PI / 4; roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); scene.add(roof);
  WALLS.push([x - w / 2 - 0.3, z - d / 2 - 0.3, x + w / 2 + 0.3, z + d / 2 + 0.3]);
}
building(-6, -8, 5, 4, 4, 0xb86a4a); building(1, -8, 5, 4, 5, 0xe0d4b8); building(8, -8, 5, 4, 4, 0x9a6a4a); building(-6, 8, 5, 4, 4, 0xe0d4b8); building(6, 8, 6, 4, 4.5, 0xb86a4a);

/* ---------- player state and movement ---------- */
const state = { x: 0, z: 4, yaw: 0, pitch: 0, started: false };   // yaw 0 looks toward -z
const keys = new Set(); let busy = false;   // busy: a talk is open, so do not move
addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); keys.add(k); if (k === 'escape') leaveTalk(); useInteractionKey(e, () => { if (!$('dialogue').hidden) { $('next').click(); return; } if (state.started && !busy && near) { startTalk(); return; } return false; }); });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   // keep inside the map and out of buildings (slide along walls)
  x = Math.max(-35, Math.min(35, x)); z = Math.max(-35, Math.min(35, z));
  for (const [x0, z0, x1, z1] of WALLS) if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; }
  return [x, z];
}
/* touch: left half of the screen is a joystick, right half drags to look; mouse drags to look */
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0 };
releaseOnBlur(keys, [stick, look]);
canvas.addEventListener('pointerdown', (e) => {
  if (busy) { leaveTalk(); return; }   // tapping the world while talking ends the talk
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
  if (e.pointerId === look.id) { if (look.moved < 8 && tapPerson(e.clientX, e.clientY)) startTalk(); look.id = null; }   // a tap (not a drag) on a person starts a talk
};
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);

/* ---------- a person to talk to ---------- */
let person = null, near = false;
const PERSON = { x: 3, z: -2, who: 'Sam the sailor' };
const TALK = [
  { who: 'Sam the sailor', text: 'Hello! Welcome to town.' },
  { who: 'You', text: 'Thank you. What is this place?' },
  { who: 'Sam the sailor', text: 'This is your new game. Make it your own!' }];
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) { if (!person) return false; ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); return ray.intersectObject(person, true).length > 0 && Math.hypot(state.x - PERSON.x, state.z - PERSON.z) < 6; }

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, goalDone = false;
function startTalk() { busy = true; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; if (person && CL.Talk1) person.userData.anim.play('Talk1'); showLine(); }
function showLine() { const s = TALK[step], me = s.who === 'You'; $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus(); }
function nextLine() { uiSound('tap'); step++; if (step >= TALK.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) { busy = false; $('dialogue').hidden = true; if (person) person.userData.anim.rest(); if (finished && !goalDone) { goalDone = true; setGoal('Well done! Now build your own story.'); uiSound('goal'); } }
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = startTalk;
function setGoal(t) { $('goal').textContent = t; }

/* ---------- loading ---------- */
Promise.all([model('anims'), model('sailor')]).then(([anims, sailor]) => {
  loadClips(anims);
  person = sailor.scene; person.position.set(PERSON.x, 0, PERSON.z); scene.add(person); animate(person, 'Idle');
  $('start').disabled = false; $('start').textContent = 'Start'; $('loadnote').textContent = '';
});
$('start').onclick = () => { audioInit(); $('title').hidden = true; $('hud').hidden = false; state.started = true; setGoal('Walk to the sailor and talk to him.'); canvas.focus(); };
$('sound').onclick = () => { setSound(!AU.on); $('sound').textContent = AU.on ? 'Sound on' : 'Sound off'; };

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
  if (person) { const want = Math.atan2(state.x - PERSON.x, state.z - PERSON.z); let e = want - person.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); if (near || busy) person.rotation.y += e * Math.min(1, dt * 5); }   // turn to face you
  for (const mx of mixers) mx.update(dt); if (person && person.userData.anim) person.userData.anim.tick(dt);
  camera.position.set(state.x, 1.6, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
