/* games/_tivoli/src/fight.js: the May 2010 street scene (chapter 5, "the days"), a directed scene like the Kendal crash. CLAUDE.md rule 4 allows it for Tivoli only, with these limits,
   all kept here: it starts only from an opt-in card ("Read what happened instead" is the other choice); you watch from a window and never hold or fire a weapon; there is no blood;
   NOBODY IS HIT (dust only lands on walls and ground, never on a person); gunmen are shown only far away behind the barricade and unidentified; there are no numbers and no one is
   shown firing first (both sides open fire together); and straight after, a card says plainly that people died and that people disagree about what happened (docs/games/tivoli.md "The dispute").
   The street is made up (street.js). What the soldiers, police and gunmen do here is general (take cover, fire, duck, move up), not a record of any real event.
   Calm mode turns off flashes' glare, the shake and dust size, and makes the sound much quieter. */
import * as THREE from 'three';
import { groundFeet } from '../../../engine/anim.js';
import { AU } from '../../../engine/audio.js';
import { LOOKS, BODIES, loadBase, makeBody } from './cast.js';
import { arm, disarm, ARMED } from './weapons.js';
import { pose, POSES } from './clips.js';
import { pace } from './walk.js';
import { buildStreet } from './street.js';
import { FX, flash, puff, kick, updateFx, shakeOffset } from './fx.js';
import * as SFX from './sfx.js';

export const FIGHT = { on: false, T: 0, contact: false, bodies: [], actors: [], hidden: [], env: null, street: null, cleanup: null };
const END = 46, W = -Math.PI / 2, E = Math.PI / 2;   /* the clock runs from -4 (the quiet start) to 46 s; a body faces +z, so facing west (-x) is -pi/2 */
const TINTS = [{ Shirt: 0x3a3a40, Breeches: 0x39486c }, { Shirt: 0x6a2a2a, Breeches: 0x2c2c30 }, { Shirt: 0x2e4a3a, Breeches: 0x3c4660 }, { Shirt: 0x8a8a8e, Breeches: 0x30303a }, { Shirt: 0x24242a, Breeches: 0x4a5a7c }];
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- people: who, where they start, and what they do (steps); a step is { w: wait s } | { until: 'contact' } | { go: [x, z], run } | { act: pose, t: s, fire, face } ---------- */
const fireLoop = (rifle, a = 3, b = 5) => [{ act: rifle ? 'StandFire' : 'PistolFire', t: rnd(a, b), fire: true }, { act: 'DuckDown', t: rnd(1, 1.8) }];
const loopOf = (rifle) => () => [...fireLoop(rifle), ...fireLoop(rifle), { act: 'DuckDown', t: rnd(0.8, 1.4) }];
const SOLDIERS = [
  { look: 'soldier', kind: 'rifle', from: [19, -3.8], steps: [{ w: 0.4 }, { go: [4, -3.8] }, { until: 'contact' }, { go: [-0.7, -3.4], run: 1 }, 'LOOP'] },
  { look: 'policeCamo', kind: 'rifle', from: [21.5, -3.2], steps: [{ w: 1.2 }, { go: [5, -3.3] }, { until: 'contact' }, { go: [-0.7, -2.2], run: 1 }, 'LOOP'] },
  { look: 'soldier', kind: 'rifle', from: [19, 3.6], steps: [{ w: 0.8 }, { go: [8, 3.2] }, { until: 'contact' }, { go: [4.6, 2.9], run: 1 }, 'LOOP'] },
  { look: 'soldier', kind: 'rifle', from: [22, 2.4], steps: [{ w: 1.8 }, { go: [8, 1.8] }, { until: 'contact' }, { go: [4.6, 1.5], run: 1 }, 'LOOP'] },
  { look: 'policeCamo', kind: 'rifle', from: [24.5, -4.1], steps: [{ w: 2.2 }, { go: [8, -3.8] }, { until: 'contact' }, { w: 14 }, { go: [-0.7, -1.2], run: 1 }, 'LOOP'] },
  { look: 'soldier', kind: 'rifle', from: [27, -4.4], steps: [{ w: 3 }, { go: [9, -4.2] }, { until: 'contact' }, { w: 22 }, { go: [-14.3, -3.8], run: 1 }, 'LOOP'] },
  { look: 'police', kind: 'pistol', from: [20, 1.0], steps: [{ w: 1.4 }, { go: [8, 0.8] }, { until: 'contact' }, { go: [4.5, 0.4], run: 1 }, 'LOOP'] },
  { look: 'police', kind: 'pistol', from: [24, 4.5], steps: [{ w: 0.6 }, { go: [9, 4.4] }, { until: 'contact' }, { go: [-9.7, 3.4], run: 1 }, 'LOOP'] },
  { look: 'police', kind: 'rifle', from: [29, -2.2], steps: [{ w: 3.6 }, { go: [10, -2.6] }, { until: 'contact' }, { w: 18 }, { go: [-14.3, -2.6], run: 1 }, 'LOOP'] },
].map((s) => ({ ...s, face: W }));
const GUNMEN = [[-29.2, -3.0, true], [-29.6, -1.2, false], [-29.2, 0.8, true], [-29.8, 2.4, false], [-29.4, 3.8, false]].map(([x, z, rifle], i) => ({
  look: 'gunman', kind: rifle ? 'rifle' : 'pistol', from: [x, z], face: E, lo: true, tint: TINTS[i % TINTS.length],
  steps: [{ until: 'contact' }, { w: i * 0.35 }, 'LOOP'] }));

/* ---------- cards (the HTML is in index.html) ---------- */
const $ = (id) => document.getElementById(id);
let calmPref = false; try { calmPref = localStorage.getItem('tivoli-calm') === '1'; } catch (e) { /* default off */ }
export function openCard() { $('fcalm').checked = calmPref; $('fightcard').hidden = false; $('title').hidden = true; }
function show(id) { for (const c of ['fightcard', 'readcard', 'aftercard']) $(c).hidden = c !== id; }

/* ---------- running it ---------- */
async function load() { await Promise.all([...BODIES, 'civilian2010'].flatMap((b) => [loadBase(b), loadBase(b + '_lo')])); }
export function wire(env) {
  FIGHT.env = env;
  $('fightbtn').onclick = openCard;
  $('fbegin').onclick = () => { calmPref = $('fcalm').checked; try { localStorage.setItem('tivoli-calm', calmPref ? '1' : '0'); } catch (e) { /* ignore */ } begin(); };
  $('fread').onclick = () => show('readcard');
  $('fback').onclick = () => show('fightcard');
  $('fcancel').onclick = () => { $('fightcard').hidden = true; $('title').hidden = false; };
  $('fdone').onclick = finish;
  $('freadexit').onclick = () => { $('readcard').hidden = true; $('title').hidden = false; };
}
export async function begin() {
  const { scene, audioInit, renderer } = FIGHT.env; audioInit(); show('none'); $('title').hidden = true; $('fightcard').hidden = true; $('fightload').hidden = false; await load(); $('fightload').hidden = true;
  FX.calm = calmPref; FX.shake = 0;
  FIGHT.hidden = scene.children.filter((c) => c.visible && !c.isLight); FIGHT.hidden.forEach((c) => (c.visible = false));
  FIGHT.fog = scene.fog; FIGHT.bg = scene.background; scene.background = new THREE.Color(0xdbe6ea); scene.fog = new THREE.Fog(0xcfdde4, 70, 270);
  const shadows = !matchMedia('(pointer: coarse)').matches, st = buildStreet({ shadows }); FIGHT.street = st; scene.add(st.group, FX.group);
  FIGHT.lights = scene.children.filter((c) => c.isLight && c !== st.sun).map((l) => [l, l.intensity]); FIGHT.lights.forEach(([l]) => (l.intensity = l.isDirectionalLight ? 0 : 1.9));   /* the street has its own sun */
  FIGHT.shadowWas = renderer.shadowMap.enabled; if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  FIGHT.actors = []; FIGHT.bodies = []; FIGHT.contact = false; FIGHT.T = -4; FIGHT.shot = -1; FIGHT.ended = false;
  for (const s of [...SOLDIERS, ...GUNMEN]) {
    const look = LOOKS[s.look], bodyId = (s.look === 'gunman' ? 'civilian2010' : look.base) + (s.lo ? '_lo' : ''), b = makeBody({ ...look, bodyId, tint: s.tint, x: s.from[0], z: s.from[1], ry: s.face, anim: 'Idle' });
    if (s.look !== 'gunman') b.traverse((o) => { if (o.isMesh && o.material.name === 'ArmBandText' && s.look !== 'policeCamo') o.visible = false; });
    b.visible = false; b.traverse((o) => { if (o.isMesh) o.castShadow = true; }); scene.add(b); arm(b, s.kind, scene); FIGHT.bodies.push(b);
    const steps = s.steps.flatMap((x) => (x === 'LOOP' ? [{ loopStart: true }] : [x]));
    FIGHT.actors.push({ s, b, steps, i: 0, t: 0, started: false, shotT: rnd(0.2, 0.9), rifle: s.kind === 'rifle', loopFrom: steps.findIndex((x) => x.loopStart), cur: null });
  }
  FIGHT.on = true; $('windowframe').hidden = false; $('fade').style.opacity = 1; $('fade').hidden = false; requestAnimationFrame(() => { $('fade').style.transition = 'opacity 1.5s'; $('fade').style.opacity = 0; });
  $('scenetitle').hidden = false; $('hud').hidden = true;
  setTimeout(() => { $('scenetitle').hidden = true; }, 4200);
  FIGHT.cleanup = () => { scene.remove(st.group, FX.group); for (const b of FIGHT.bodies) { disarm(b); scene.remove(b); } FIGHT.hidden.forEach((c) => (c.visible = true)); FIGHT.lights.forEach(([l, v]) => (l.intensity = v)); renderer.shadowMap.enabled = FIGHT.shadowWas; scene.fog = FIGHT.fog; scene.background = FIGHT.bg; FX.items.length = 0; FX.group.clear(); };
}
function finish() {
  if (FIGHT.cleanup) FIGHT.cleanup(); FIGHT.cleanup = null; FIGHT.on = false; $('aftercard').hidden = true; $('windowframe').hidden = true; $('fade').hidden = true; $('title').hidden = false;
}

function stepOf(a) {   /* the actor's current step; a new one resets its timer */
  return a.steps[a.i];
}
function play(a, name, speed) {
  const clip = POSES[name] ? pose(name) : name; if (a.cur === clip && !speed) return; a.cur = clip; a.b.userData.anim.play(clip); if (speed) pace(a.b, a.b.userData.anim, speed);
}
function nextStep(a) {
  a.i++; a.t = 0; if (a.i >= a.steps.length) { a.i = Math.max(a.loopFrom, 0); a.steps = [...a.steps.slice(0, a.loopFrom + 1), ...loopOf(a.rifle)()]; a.i = a.loopFrom + 1; }
}
function muzzle(a) {
  const w = a.b.userData.weapon; w.mesh.updateWorldMatrix(true, false); return new THREE.Vector3(0, w.kind === 'rifle' ? 0.062 : 0.045, w.kind === 'rifle' ? 0.69 : 0.18).applyMatrix4(w.mesh.matrixWorld);
}
function fire(a, camera) {
  const p = muzzle(a), d = p.distanceTo(camera.position), ndc = p.clone().project(camera);
  flash(p, a.rifle ? 0.55 : 0.4); SFX.shot(Math.max(-0.9, Math.min(0.9, ndc.x * 0.8)), Math.min(1, d / 55), FX.calm, a.rifle ? 'rifle' : 'pistol'); kick(d < 25 ? 1 : 0.4);
  if (Math.random() < 0.45) { const sp = FIGHT.street.spots, set = a.s.look === 'gunman' ? sp.dust : sp.dustFar, q = set[(Math.random() * set.length) | 0]; puff(new THREE.Vector3(q[0] + rnd(-0.3, 0.3), q[1], q[2] + rnd(-0.3, 0.3)), rnd(0.7, 1.3)); }
}
export function tick(dt) {
  if (!FIGHT.on || FIGHT.freeze) return; const { camera } = FIGHT.env; FIGHT.T += dt; const T = FIGHT.T;
  if (!FIGHT.contact && T >= 9) FIGHT.contact = true;   /* both sides open fire together: no one is shown firing first */
  for (const a of FIGHT.actors) {
    const st = stepOf(a); if (!st) continue; a.t += dt; const b = a.b, endSoft = T > 40 ? Math.max(0, 1 - (T - 40) / 5) : 1;
    if (st.loopStart) { nextStep(a); continue; }
    if (st.w !== undefined) { b.visible = a.started; if (a.started) play(a, FIGHT.contact ? 'DuckDown' : 'Idle'); if (a.t >= st.w) nextStep(a); continue; }
    if (st.until) { if (FIGHT.contact) nextStep(a); else { b.visible = a.started; if (a.started) play(a, 'Idle'); } continue; }
    if (st.go) {
      a.started = true; b.visible = true; const dx = st.go[0] - b.position.x, dz = st.go[1] - b.position.z, dist = Math.hypot(dx, dz), v = st.run ? 3.4 : 1.4;
      if (dist < 0.12) { nextStep(a); continue; } play(a, st.run ? 'RunLow' : 'AdvanceReady', v); const step = Math.min(dist, v * dt); b.position.x += dx / dist * step; b.position.z += dz / dist * step;
      let e = Math.atan2(dx, dz) - b.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); b.rotation.y += e * Math.min(1, dt * 8); continue;
    }
    if (st.act) {
      a.started = true; b.visible = true; play(a, st.act); let e = a.s.face - b.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); b.rotation.y += e * Math.min(1, dt * 6);
      if (st.fire && endSoft > 0) { a.shotT -= dt; if (a.shotT <= 0) { fire(a, camera); a.shotT = rnd(0.22, 0.7) / Math.max(0.35, endSoft); } }
      if (a.t >= st.t) nextStep(a);
    }
  }
  updateFx(dt);
  if (T > 12 && T < 38 && Math.random() < dt * 0.35) SFX.rattle(rnd(-0.8, 0.8), FX.calm);   /* more fighting, further off */
  if (T >= END - 2 && !FIGHT.ended) { FIGHT.ended = true; $('fade').style.transition = 'opacity 2s'; $('fade').hidden = false; $('fade').style.opacity = 1; SFX.ring(FX.calm); setTimeout(() => { $('windowframe').hidden = true; show('aftercard'); $('aftercard').hidden = false; }, 2600); }
}
/* what runs after the mixers: feet on the ground, and the camera */
const SHOTS = [   /* all from the child's window: the balcony of the second floor of the south flats (x 16.5, y 4.8, z 8.9), looking west along the street */
  { t: -4, pos: [16.5, 4.8, 8.9], look: [-12, 1.3, -0.6], fov: 58, drift: [-0.3, 0, -0.05] },
  { t: 12, pos: [16.5, 4.8, 8.9], look: [2, 0.9, -0.6], fov: 34, drift: [-0.2, 0.02, 0] },
  { t: 24, pos: [16.5, 4.8, 8.9], look: [-8, 1.1, -0.4], fov: 26, drift: [-0.3, 0, -0.05] },
  { t: 35, pos: [16.5, 4.8, 8.9], look: [-26, 1.5, 0], fov: 16, drift: [-0.3, 0, 0] },
  { t: 42, pos: [16.5, 4.9, 9.0], look: [-12, 1.4, -0.5], fov: 60, drift: [0, 0, 0] },
];
export function after(now) {
  if (!FIGHT.on) return; const { camera } = FIGHT.env; for (const b of FIGHT.bodies) if (b.visible) groundFeet(b);
  let k = 0; for (let i = 0; i < SHOTS.length; i++) if (FIGHT.T >= SHOTS[i].t) k = i; const sh = SHOTS[k], u = FIGHT.T - sh.t;
  if (FIGHT.shot !== k) { FIGHT.shot = k; camera.fov = sh.fov; camera.updateProjectionMatrix(); }
  const so = shakeOffset(now);
  camera.position.set(sh.pos[0] + sh.drift[0] * u * 0.4 + so[0], sh.pos[1] + sh.drift[1] * u + so[1], sh.pos[2] + sh.drift[2] * u * 0.4 + so[2]); camera.lookAt(sh.look[0], sh.look[1], sh.look[2]);
}

/* dev only (?scene=fight&at=22): jump the scene forward to a moment, playing it quickly, so a picture can be taken there */
export function skip(to) { while (FIGHT.on && FIGHT.T < to) { tick(0.05); for (const b of FIGHT.bodies) b.userData.anim.mx.update(0.05); } }

/* every spot a person stands at or runs to, for the place audit: starts, route points and where they take cover (and a few that pass between) */
export function positions() {
  const out = []; [...SOLDIERS, ...GUNMEN].forEach((a, n) => { out.push({ id: a.look + n + ' start', x: a.from[0], z: a.from[1], anim: 'Idle' }); a.steps.forEach((st, i) => { if (st.go) out.push({ id: a.look + n + ' step ' + i, x: st.go[0], z: st.go[1], anim: 'Idle' }); }); });
  return out;
}
