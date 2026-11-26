import { addSceneWarningOptions, sceneIsCalm, endSceneWarning, centreCard } from '../../../engine/scene-warning.js';
import { showCinematicSkip } from '../../../engine/cine.js';
/* games/tivoli/src/fight.js: the May 2010 street scene (chapter 5, "the days"), a directed scene like the Kendal crash. CLAUDE.md rule 4 allows it for Tivoli only, with these limits,
   all kept here: it starts only from an opt-in card ("Read what happened instead" is the other choice); you watch from a window and never hold or fire a weapon; there is no blood;
   NOBODY IS HIT (dust only lands on walls and ground, never on a person); gunmen are shown only far away behind the barricade and unidentified; there are no numbers and no one is
   shown firing first (both sides open fire together); and straight after, a card says plainly that people died and that people disagree about what happened (docs/games/tivoli.md "The dispute").
   The street is made up (street.js). What the soldiers, police and gunmen do here is general (take cover, fire, duck, move up), not a record of any real event.
   Calm mode turns off flashes' glare, the shake and dust size, and makes the sound much quieter.

   How the people are directed (rewritten 16 November 2026 after the owner saw police aim back at their own men and soldiers "running in place and shooting"):
   - Each person has a plan: walk in, stand ready, react at the first shots, run to a cover spot, fight there until a set time, perhaps run on to a cover further up.
   - Moving and firing never mix. A person moves only in a walking or running clip, at the speed that clip's own stride gives (walk.js pace and strideOf), so the
     feet neither slide nor tread air; when they arrive they stop and change to a still clip. Firing uses still clips only: FireStand over a low wall or a car,
     FireKneel at a car's or van's corner, a kneeling pistol aim (clips.js). ShootRifle, a run-and-shoot clip, is never used here.
   - At cover a person rests crouched, then rises and fires a short burst, then drops back. Every burst first picks a target on the other side with a clear line:
     no one of their own side within CLEAR (13 degrees) of it and nearer than it. If no target is clear (a friend ran forward), they stay down. During a burst, if a
     friend comes within that cone, the burst stops at once.
   - Facing: the clips turn the body inside them (aim.js), so the body is turned by faceFor() until the WEAPON points at the target, not the hips.
   - ?test=scene (scenecheck.js) runs the whole scene several times and checks every armed person every quarter second: aim toward the other side, never at their
     own side, no running clip while standing still, no still clip while moving, and walking or running at the speed the clip's stride gives. */
import * as THREE from 'three';
import { groundFeet } from '../../../engine/anim.js';
import { LOOKS, BODIES, loadBase, makeBody } from './cast.js';
import { arm, disarm, modeOf, PISTOL_CLIPS } from './weapons.js';
import { pose, POSES } from './clips.js';
import { pace, strideOf } from './walk.js';
import { buildStreet } from './street.js';
import { release } from '../../../engine/preload.js';
import { aimDir, faceFor, wrap } from './aim.js';
import { FX, flash, puff, kick, updateFx, shakeOffset } from './fx.js';
import * as SFX from './sfx.js';
import { cue } from '../../../engine/audio.js';
import { finishChapter } from './story.js';
import { makeHelicopter, spinRotors, flyAlong, rotorSound } from '../../../engine/helicopter.js';

export const FIGHT = { on: false, T: 0, contact: false, bodies: [], actors: [], hidden: [], env: null, street: null, cleanup: null };
const END = 46, W = -Math.PI / 2, E = Math.PI / 2;   /* the clock runs from -4 (the quiet start) to 46 s; a body faces +z, so facing west (-x) is -pi/2 */
export const CONTACT = 9, CLEAR = 13 * Math.PI / 180, WALK_V = 1.3, RUN_V = 3.0;
const TINTS = [{ Shirt: 0x3a3a40, Breeches: 0x39486c }, { Shirt: 0x6a2a2a, Breeches: 0x2c2c30 }, { Shirt: 0x2e4a3a, Breeches: 0x3c4660 }, { Shirt: 0x8a8a8e, Breeches: 0x30303a }, { Shirt: 0x24242a, Breeches: 0x4a5a7c }];
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- cover: which clip a person rests in and which they fire in, by the kind of cover ----------
   wall: crouched behind a low wall or a car (CrouchIdle, hidden), standing to fire over it (FireStand).
   kneel: on one knee at the corner of a car or van (KneelReady), firing round it (FireKneel). pistol: crouched, then a kneeling two-handed pistol aim.
   guard: on one knee at the back, watching a side street; never fires. */
const COVER = {
  wall: { rest: 'CrouchIdle', fire: 'StandFire' },
  kneel: { rest: 'KneelReady', fire: 'CrouchFire' },
  pistol: { rest: 'CrouchIdle', fire: 'PistolKneelFire' },
  guard: { rest: 'KneelReady', fire: null },
  gunman: { rest: 'CrouchIdle', fire: 'StandFire' },
  gunmanPistol: { rest: 'CrouchIdle', fire: 'PistolFire' },
};
/* cover spots (east, the soldiers' side, of each thing; street.js): the low wall A (x -2, z -4.5 to -0.3), the green car (x -0.2 to 4.2, z 1.05 to 2.75),
   the low wall B (x -11, z 0.8 to 4.4), the blue van (x -19.4 to -14.6, z -3.45 to -1.75), and the parked yellow minibus at the back (x 15.2 to 20, north kerb) */
const AROUND_A = [[-1.0, 0.3], [-2.8, 0.3]];   /* round the south end of wall A, which runs across the north half of the street */

/* ---------- people: who, where they start, and their plan ----------
   steps: { walk: [[x, z], ...] } | { ready: true } (stand until the shooting starts) | { react: true } (a moment's start at the first shots)
        | { burst: s } (fire from where they stand, at the first shots) | { run: [[x, z], ...], cover: kind } | { fight: untilT } (rest and fire at this cover until the scene clock reaches untilT) */
const FORCES = [
  { look: 'soldier', kind: 'rifle', from: [19, -3.6], plan: [{ walk: [[7.6, -3.6]] }, { ready: true }, { burst: 1.4 }, { run: [[-0.81, -3.7]], cover: 'wall' }, { fight: 21 }, { run: [...AROUND_A, [-14.0, -1.35]], cover: 'kneel' }, { fight: 99 }] },
  { look: 'policeCamo', kind: 'rifle', from: [21.5, -3.0], plan: [{ walk: [[9.2, -3.0]] }, { ready: true }, { react: true }, { run: [[-0.81, -2.6]], cover: 'wall' }, { fight: 99 }] },
  { look: 'soldier', kind: 'rifle', from: [24.5, -3.9], plan: [{ walk: [[11.0, -3.9]] }, { ready: true }, { react: true }, { run: [[-0.81, -1.5]], cover: 'wall' }, { fight: 25 }, { run: [...AROUND_A, [-13.6, -3.95]], cover: 'kneel' }, { fight: 99 }] },
  { look: 'police', kind: 'rifle', from: [27.5, -2.4], plan: [{ walk: [[13.6, -2.4]] }, { ready: true }, { react: true }, { run: [[-0.81, -0.65]], cover: 'wall' }, { fight: 99 }] },
  { look: 'soldier', kind: 'rifle', from: [19.5, 3.3], plan: [{ walk: [[8.0, 3.3]] }, { ready: true }, { burst: 1.2 }, { run: [[4.6, 3.2]], cover: 'kneel' }, { fight: 27 }, { run: [[-9.77, 3.7]], cover: 'wall' }, { fight: 99 }] },
  { look: 'soldier', kind: 'rifle', from: [22.5, 2.3], plan: [{ walk: [[9.8, 2.3]] }, { ready: true }, { react: true }, { run: [[5.09, 1.9]], cover: 'wall' }, { fight: 99 }] },
  { look: 'police', kind: 'pistol', from: [20.8, 0.9], plan: [{ walk: [[8.8, 0.9]] }, { ready: true }, { react: true }, { run: [[4.55, 0.6]], cover: 'pistol' }, { fight: 99 }] },
  { look: 'police', kind: 'pistol', from: [25.5, 1.2], plan: [{ walk: [[16.2, -1.6]] }, { ready: true }, { react: true }, { run: [[14.65, -3.8]], cover: 'pistol' }, { fight: 27.6 }, { run: [[-9.77, 2.5]], cover: 'pistol' }, { fight: 99 }] },
  { look: 'policeCamo', kind: 'rifle', from: [29.5, 3.6], plan: [{ walk: [[15.2, 3.6]] }, { ready: true }, { react: true }, { run: [[14.3, -2.3]], cover: 'guard', face: W + 0.75 }, { fight: 99 }] },
].map((s) => ({ ...s, side: 'forces' }));
const GUNMEN = [[-29.2, -3.0, true], [-29.6, -1.2, false], [-29.2, 0.8, true], [-29.8, 2.4, false], [-29.4, 3.8, true]].map(([x, z, rifle], i) => ({
  look: 'gunman', kind: rifle ? 'rifle' : 'pistol', from: [x, z], lo: true, tint: TINTS[i % TINTS.length], side: 'gunmen',
  plan: [{ hidden: true }, { cover: rifle ? 'gunman' : 'gunmanPistol' }, { fight: 99 }] }));
export const PEOPLE = [...FORCES, ...GUNMEN];

/* ---------- cards (the HTML is in index.html) ---------- */
const $ = (id) => document.getElementById(id);
let titleTimer, endTimer, hideSkip;
export function openCard() {
  $('fightcard').hidden = false; $('title').hidden = true;
  addSceneWarningOptions($('fightoptions'), $('fbegin'), $('fread'), begin, () => {
    show('readcard'); centreCard($('readcard')); finishChapter(5); $('freadnext').focus();   /* the standard What happened card: short paragraphs, Go on (engine/scene-warning.js) */
  });
}
function show(id) { for (const c of ['fightcard', 'readcard', 'aftercard']) $(c).hidden = c !== id; }

/* ---------- running it ---------- */
async function load() { await Promise.all([...BODIES, 'civilian2010'].flatMap((b) => [loadBase(b), loadBase(b + '_lo')])); }
export function wire(env) {
  FIGHT.env = env;
  $('fback').onclick = () => { show('fightcard'); openCard(); };
  $('fdone').onclick = () => finish();
  $('freadexit').onclick = () => { $('readcard').hidden = true; $('title').hidden = false; };
  $('fnext').onclick = () => { finish(); if (env.next) env.next(); };   /* Next chapter, as at the end of every other chapter */
  $('freadnext').onclick = () => { $('readcard').hidden = true; if (env.next) env.next(); };
}
export async function begin() {
  const { scene, audioInit, renderer, camera } = FIGHT.env; const previousFov = camera.fov; audioInit(); show('none'); $('title').hidden = true; $('fightcard').hidden = true; $('fightload').hidden = false; await load(); $('fightload').hidden = true;
  FX.calm = sceneIsCalm(); FX.shake = 0;
  FIGHT.hidden = scene.children.filter((c) => c.visible && !c.isLight); FIGHT.hidden.forEach((c) => (c.visible = false));
  FIGHT.fog = scene.fog; FIGHT.bg = scene.background; scene.background = new THREE.Color(0xdbe6ea); scene.fog = new THREE.Fog(0xcfdde4, 70, 270);
  const shadows = !matchMedia('(pointer: coarse)').matches, st = buildStreet({ shadows }); FIGHT.street = st; scene.add(st.group, FX.group); const H = FIGHT.heli || (FIGHT.heli = makeHelicopter()); H.visible = false; scene.add(H); FIGHT.rotor = rotorSound();   /* a helicopter overhead (heli() below) */
  FIGHT.lights = scene.children.filter((c) => c.isLight && c !== st.sun).map((l) => [l, l.intensity]); FIGHT.lights.forEach(([l]) => (l.intensity = l.isDirectionalLight ? 0 : 1.9));   /* the street has its own sun */
  FIGHT.shadowWas = renderer.shadowMap.enabled; if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  FIGHT.actors = []; FIGHT.bodies = []; FIGHT.contact = false; FIGHT.T = -4; FIGHT.shot = -1; FIGHT.ended = false;
  for (const s of PEOPLE) {
    const look = LOOKS[s.look], bodyId = (s.look === 'gunman' ? 'civilian2010' : look.base) + (s.lo ? '_lo' : ''), b = makeBody({ ...look, bodyId, tint: s.tint, x: s.from[0], z: s.from[1], ry: s.side === 'gunmen' ? E : W, anim: s.side === 'gunmen' ? pose('CrouchIdle') : pose('AdvanceReady') });
    if (s.look !== 'gunman') b.traverse((o) => { if (o.isMesh && o.material.name === 'ArmBandText' && s.look !== 'policeCamo') o.visible = false; });
    b.traverse((o) => { if (o.isMesh) o.castShadow = true; }); scene.add(b); arm(b, s.kind, scene); b.userData.weapon.carry = 'ready'; FIGHT.bodies.push(b);
    b.visible = s.side !== 'gunmen';   /* the gunmen are not seen until the shooting starts; the soldiers and police walk in from behind the camera */
    FIGHT.actors.push({ s, b, bodyId, side: s.side, kind: s.kind, plan: s.plan, i: 0, t: 0, cur: null, cover: null, st: 'rest', stT: rnd(0.4, 2.2), shotT: rnd(0.15, 0.6), target: null, react: rnd(0.05, 0.7), speed: 0, wp: 0 });
  }
  FIGHT.on = true; SFX.ambience(true, FX.calm); $('windowframe').hidden = false;
  const fade = $('fade'); fade.style.transition = 'none'; fade.style.opacity = 1; fade.hidden = false;
  fade.getBoundingClientRect();
  requestAnimationFrame(() => { if (FIGHT.on && !FIGHT.ended) { fade.style.transition = 'opacity 1.5s'; fade.style.opacity = 0; } });
  $('fighttitle').hidden = false; hideSkip = showCinematicSkip(complete, { bed: 'event' }); $('hud').hidden = true;
  clearTimeout(titleTimer); titleTimer = setTimeout(() => { $('fighttitle').hidden = true; }, 4200);
  FIGHT.cleanup = () => { hideSkip?.(); scene.remove(st.group, FX.group); for (const b of FIGHT.bodies) { disarm(b); scene.remove(b); } FIGHT.hidden.forEach((c) => (c.visible = true)); FIGHT.lights.forEach(([l, v]) => (l.intensity = v)); renderer.shadowMap.enabled = FIGHT.shadowWas; scene.fog = FIGHT.fog; scene.background = FIGHT.bg; camera.fov = previousFov; camera.updateProjectionMatrix(); FX.items.length = 0; FX.group.clear(); };
}
function finish(showTitle = true) {
  clearTimeout(titleTimer); clearTimeout(endTimer);
  SFX.ambience(false); endSceneWarning();
  if (FIGHT.heli) { FIGHT.heli.visible = false; FIGHT.heli.removeFromParent(); } if (FIGHT.rotor) { FIGHT.rotor.stop(); FIGHT.rotor = null; }
  const gone = FIGHT.cleanup ? [FIGHT.street.group, ...FIGHT.bodies] : [];
  if (FIGHT.cleanup) FIGHT.cleanup(); FIGHT.cleanup = null; for (const o of gone) release(o, FIGHT.env.scene);   /* engine/preload.js: the street and its people are built afresh next time, so their graphics memory is let go */ FIGHT.on = false;
  for (const id of ['aftercard', 'windowframe', 'fighttitle', 'fade']) $(id).hidden = true;
  $('title').hidden = !showTitle;
}
function complete() {
  if (!FIGHT.on) return;
  FIGHT.ended = true;
  finish(false);
  show('aftercard'); finishChapter(5); cue('sad');   /* a soft, sad phrase under the after card (about 70 civilians and one soldier died) */
  $('fnext').focus();
}

/* ---------- each person ---------- */
function play(a, name) { const clip = POSES[name] ? pose(name) : name; if (a.cur === clip) return clip; a.cur = clip; a.b.userData.anim.play(clip); return clip; }
function next(a) { a.i = Math.min(a.i + 1, a.plan.length - 1); a.t = 0; a.wp = 0; }
const others = (a, side) => FIGHT.actors.filter((o) => o !== a && o.b.visible && (side ? o.side === side : o.side !== a.side));
function turnTo(a, yaw, dt, rate = 5) { const b = a.b; let e = wrap(yaw - b.rotation.y); const m = rate * dt; b.rotation.y = wrap(b.rotation.y + Math.max(-m, Math.min(m, e))); return Math.abs(e); }
/* the targets for this side: the other side's people (the gunmen behind the barricade are targets even while crouched out of sight; their spot is known) */
function targets(a) { return a.side === 'forces' ? FIGHT.actors.filter((o) => o.side === 'gunmen') : FIGHT.actors.filter((o) => o.side === 'forces' && o.b.visible); }
/* how close a line from a to the point (x, z) passes a person of a's own side who is nearer than that point (radians; Infinity if no one is in front) */
function clearance(a, x, z) {
  const p = a.b.position, dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz); let best = Infinity;
  for (const o of others(a, a.side)) { const ox = o.b.position.x - p.x, oz = o.b.position.z - p.z, od = Math.hypot(ox, oz); if (od < 0.01 || od > d) continue; if (ox * dx + oz * dz <= 0) continue; best = Math.min(best, Math.abs(wrap(Math.atan2(ox, oz) - yaw))); }
  return best;
}
function pickTarget(a) {
  const ok = targets(a).map((o) => ({ o, c: clearance(a, o.b.position.x, o.b.position.z) })).filter((t) => t.c > CLEAR);
  return ok.length ? ok[(Math.random() * ok.length) | 0].o : null;
}
/* the way a person at cover looks between bursts: toward the target on the other side with the clearest line (kept while it stays clear), or the guard's side street */
function restYaw(a) {
  if (a.face !== undefined && a.cover === 'guard') return a.face;
  const p = a.b.position, opp = FIGHT.actors.filter((o) => o.side !== a.side); let mx = 0, mz = 0; for (const o of opp) { mx += o.b.position.x; mz += o.b.position.z; } mx /= opp.length || 1; mz /= opp.length || 1;
  const mid = Math.atan2(mx - p.x, mz - p.z), dirTo = (o) => Math.atan2(o.b.position.x - p.x, o.b.position.z - p.z), inArc = (o) => Math.abs(wrap(dirTo(o) - mid)) < 60 / 57.3, clear = (o) => clearance(a, o.b.position.x, o.b.position.z) > CLEAR;
  /* the target: kept while its line stays clear and it stays within 60 degrees of the middle of the other side (people move up and the middle moves);
     otherwise the clearest line among those in that arc, or among all if none there is clear */
  let best = a.next && clear(a.next) && inArc(a.next) ? a.next : null;
  if (!best) { const all = targets(a), near = all.filter((o) => inArc(o) && clear(o)); let bc = -1; for (const o of near.length ? near : all) { const c = clearance(a, o.b.position.x, o.b.position.z); if (c > bc) { bc = c; best = o; } } a.next = best; }
  if (!best) return mid;
  const off = wrap(dirTo(best) - mid); return wrap(mid + Math.max(-60 / 57.3, Math.min(60 / 57.3, off)));   /* at rest, never more than 60 degrees off the middle */
}
function moveAlong(a, pts, clipName, v, dt, camera) {
  const b = a.b, tgt = pts[a.wp]; if (!tgt) return true;
  const dx = tgt[0] - b.position.x, dz = tgt[1] - b.position.z, dist = Math.hypot(dx, dz);
  if (dist < 0.05) { a.wp++; return a.wp >= pts.length; }
  const clip = play(a, clipName), ctl = b.userData.anim, ts = pace(b, ctl, v), c = ctl.cur.getClip(), stride = strideOf(b, c), sp = stride > 0.05 ? ts * stride / c.duration : v;   /* the ground speed the clip's own stride gives at the pace it can play */
  a.speed = sp; const step = Math.min(dist, sp * dt); b.position.x += dx / dist * step; b.position.z += dz / dist * step;
  turnTo(a, Math.atan2(dx, dz), dt, 5.5);   /* at most 315 degrees a second while moving (Kendal's turn limit; it was 516, a spin at a corner: ?test=heads) */
  a.stepT = (a.stepT || 0) - dt; if (a.stepT <= 0 && camera) { a.stepT = clip === pose('AdvanceReady') ? 0.5 : 0.22; const dc = b.position.distanceTo(camera.position); if (dc < 40) SFX.step(Math.max(-0.9, Math.min(0.9, (b.position.clone().project(camera).x) * 0.8)), 0.16 * (1 - dc / 40), FX.calm); }   /* footsteps, louder when near */
  return false;
}
function muzzle(a) {
  const w = a.b.userData.weapon; w.mesh.updateWorldMatrix(true, false); return new THREE.Vector3(0, w.kind === 'rifle' ? 0.062 : 0.045, w.kind === 'rifle' ? 0.69 : 0.18).applyMatrix4(w.mesh.matrixWorld);
}
function fire(a, camera) {
  const p = muzzle(a), d = p.distanceTo(camera.position), ndc = p.clone().project(camera), rifle = a.kind === 'rifle';
  flash(p, rifle ? 0.55 : 0.4); SFX.shot(Math.max(-0.9, Math.min(0.9, ndc.x * 0.8)), Math.min(1, d / 55), FX.calm, rifle ? 'rifle' : 'pistol'); kick(d < 25 ? 1 : 0.4);
  if (Math.random() < 0.45) { const sp = FIGHT.street.spots, set = a.side === 'gunmen' ? sp.dust : sp.dustFar, q = set[(Math.random() * set.length) | 0]; puff(new THREE.Vector3(q[0] + rnd(-0.3, 0.3), q[1], q[2] + rnd(-0.3, 0.3)), rnd(0.7, 1.3)); }
}
/* turn so that what the check and the eye see (the weapon in the hands, or the chest) points along yaw: measured from the body itself, not
   worked out from the clip, so a pose's own twist never leaves the aim a few degrees off */
function aimAt(a, yaw, dt, rate = 3) { const b = a.b, d = aimDir(b); return turnTo(a, wrap(b.rotation.y + wrap(yaw - Math.atan2(d.x, d.z))), dt, rate); }
/* resting and firing at a cover spot: rest (crouched, facing the clearest target) -> rise (turn the last bit until the weapon will point at it) -> fire (a burst) -> rest */
function atCover(a, st, T, dt, camera) {
  const C = COVER[a.cover], endSoft = T > 40 ? Math.max(0, 1 - (T - 40) / 4) : 1, b = a.b, p = b.position; a.speed = 0; a.stT -= dt;
  const fireClip = C.fire ? pose(C.fire) : null, restClip = pose(C.rest);
  if (a.st === 'rest') {
    const y = restYaw(a), yr = faceFor(a.bodyId, a.kind, restClip, y), yf = fireClip ? faceFor(a.bodyId, a.kind, fireClip, y) : yr;
    if (a.kind === 'pistol' && PISTOL_CLIPS.test(restClip)) {   /* a rest that holds the pistol up: lower it to turn to a new target, raise it once facing it */
      const e = Math.abs(wrap(faceFor(a.bodyId, a.kind, restClip, a.next ? Math.atan2(a.next.b.position.x - p.x, a.next.b.position.z - p.z) : y) - b.rotation.y)); a.low = a.low ? e > 0.08 : e > 0.25;
      const ya = a.next ? Math.atan2(a.next.b.position.x - p.x, a.next.b.position.z - p.z) : y;   /* a raised pistol aims at the target itself */
      if (a.low) { play(a, 'CrouchIdle'); turnTo(a, faceFor(a.bodyId, a.kind, restClip, ya), dt, 3); } else { play(a, C.rest); aimAt(a, ya, dt); }
    } else { play(a, C.rest); aimAt(a, y, dt); }   /* the chest faces where they look, measured (it was half way to the fire clip's facing, which could leave it 75 degrees off) */   /* a rest that holds the weapon up (the kneeling pistol) points it straight at the target; otherwise half way between the rest clip's facing and the fire clip's, so the chest faces the other side and the feet swivel little when they rise */
    if (a.stT > 0) return;
    if (a.low) return;   /* still turning with the pistol down */
    if (T >= st.fight) { next(a); return; }   /* time to move on: only from a rest, never in the middle of a burst */
    if (!fireClip || endSoft <= 0.05) { a.stT = rnd(1, 2); return; }
    const t = a.next; if (!t || clearance(a, t.b.position.x, t.b.position.z) <= CLEAR) { a.stT = rnd(0.8, 1.6); return; }   /* no clear line: stay down a little longer */
    a.target = t; a.st = 'rise'; a.stT = 1; return;
  }
  const tp = a.target.b.position, yaw = Math.atan2(tp.x - p.x, tp.z - p.z), blocked = clearance(a, tp.x, tp.z) <= CLEAR;
  if (a.st === 'rise') {   /* still crouched: turn until the fire clip will point at the target, then stand and fire */
    play(a, C.rest); const err = aimAt(a, yaw, dt);   /* by the weapon if the rest holds it up, else by the chest: measured, not estimated from the fire clip */
    if (blocked) { a.st = 'rest'; a.stT = rnd(1, 2); return; }
    if (err < 0.1 || a.stT <= 0) { a.st = 'fire'; a.stT = rnd(1.6, 3.4); a.fireT = 0; a.shotT = rnd(0.35, 0.7); }
    return;
  }
  /* firing */
  if (blocked) { a.st = 'rest'; a.stT = rnd(1.2, 2); play(a, C.rest); return; }   /* a friend in the way: lower at once, before this frame's raise */
  play(a, C.fire); a.fireT += dt; const err = a.fireT > 0.35 ? aimAt(a, yaw, dt) : turnTo(a, faceFor(a.bodyId, a.kind, fireClip, yaw), dt, 3);   /* once the weapon is up, aim by the weapon itself */
  if (blocked || a.stT <= 0) { a.st = 'rest'; a.stT = blocked ? rnd(1.2, 2) : rnd(1.4, 3.8); return; }   /* a friend in the way: stop at once */
  if (err < 0.08 && a.fireT > 0.45 && endSoft > 0) { a.shotT -= dt; if (a.shotT <= 0) { fire(a, camera); a.shotT = rnd(0.25, 0.75) / Math.max(0.35, endSoft); } }
}
export function tick(dt) {
  if (!FIGHT.on || FIGHT.freeze || FIGHT.ended) return; const { camera } = FIGHT.env; FIGHT.T += dt; const T = FIGHT.T;
  if (!FIGHT.contact) SFX.quietLife(dt, FX.calm);
  if (!FIGHT.contact && T >= CONTACT) { FIGHT.contact = true; SFX.ambience(false); }   /* both sides open fire together: no one is shown firing first; the street's ordinary sounds stop */
  for (const a of FIGHT.actors) {
    const st = a.plan[a.i]; a.t += dt; const b = a.b;
    if (st.hidden) { b.visible = false; if (FIGHT.contact && a.t > 0) next(a); continue; }
    if (st.walk) { if (moveAlong(a, st.walk, 'AdvanceReady', WALK_V, dt, camera)) next(a); continue; }
    if (st.ready) { a.speed = 0; play(a, 'ReadyIdle'); turnTo(a, faceFor(a.bodyId, a.kind, pose('ReadyIdle'), W), dt, 2); if (FIGHT.contact) next(a); continue; }
    if (st.react) { a.speed = 0; if (a.t > a.react) next(a); continue; }   /* a moment's start before running (they keep the clip they had) */
    if (st.run) { if (moveAlong(a, st.run, 'RunLow', RUN_V, dt, camera)) { a.cover = st.cover; a.face = st.face; a.st = 'rest'; a.stT = rnd(0.8, 2.2); next(a); } continue; }
    if (st.burst) { a.speed = 0; if (!a.target) a.target = pickTarget(a); if (!a.target || a.t > st.burst) { next(a); continue; } const fc = pose('StandFire'), p = b.position, tp = a.target.b.position; if (clearance(a, tp.x, tp.z) <= CLEAR) { play(a, 'ReadyIdle'); next(a); continue; } const err = turnTo(a, faceFor(a.bodyId, a.kind, fc, Math.atan2(tp.x - p.x, tp.z - p.z)), dt, 4); play(a, err < 0.15 ? 'StandFire' : 'ReadyIdle'); if (a.cur === pose('StandFire') && a.t > 0.75) aimAt(a, Math.atan2(tp.x - p.x, tp.z - p.z), dt, 4);   /* the rifle comes up only once he faces the target (it used to rise while he was still turning) */ if (clearance(a, tp.x, tp.z) <= CLEAR) { next(a); continue; } if (err < 0.08 && a.t > 0.4) { a.shotT -= dt; if (a.shotT <= 0) { fire(a, camera); a.shotT = rnd(0.25, 0.5); } } continue; }   /* the first shots, from where they stand, then they run for cover */
    if (st.cover) { b.visible = true; a.cover = st.cover; a.st = 'rest'; a.stT = rnd(0.2, 1.6); next(a); continue; }
    if (st.fight !== undefined) atCover(a, st, T, dt, camera);
  }
  updateFx(dt);
  heli(dt, T);
  if (T > 12 && T < 38 && Math.random() < dt * 0.35) SFX.rattle(rnd(-0.8, 0.8), FX.calm);   /* more fighting, further off */
  if (T >= END - 2) { FIGHT.ended = true; SFX.ambience(false); $('fade').style.transition = 'opacity 2s'; $('fade').style.opacity = 1; SFX.ring(FX.calm); endTimer = setTimeout(complete, 2600); }
}
/* A helicopter overhead (22 November 2026, owner's request). The Security Minister said the troops that took the area were "backed by helicopters"
   (Voice of America, 25 May 2010; docs/games/tivoli.md). No source says how many, of what kind, or what they did, so the scene shows only one,
   high up, passing over: it never fires and nothing comes from it. The model is the shared stand-in shape (engine/helicopter.js). It crosses the
   sky as the soldiers walk in, and again far off at the end, where the wide shots can see it. Its sound grows as it comes nearer. */
const HELI = [
  { t0: -3, t1: 10, A: new THREE.Vector3(90, 34, -46), B: new THREE.Vector3(-170, 30, -22) },
  { t0: 36, t1: 47, A: new THREE.Vector3(-190, 30, 60), B: new THREE.Vector3(-80, 26, -70) },
];
const EAR = new THREE.Vector3(16.5, 4.8, 8.9);
function heli(dt, T) {
  const H = FIGHT.heli; if (!H) return; const p = HELI.find((h) => T >= h.t0 && T <= h.t1);
  H.visible = !!p; let near = 0;
  if (p) { flyAlong(H, p.A, p.B, (T - p.t0) / (p.t1 - p.t0)); spinRotors(H, dt); near = Math.max(0, 1 - H.position.distanceTo(EAR) / 220); }
  if (FIGHT.rotor) FIGHT.rotor.level(near * near * (FX.calm ? 0.35 : 1), 0.4);
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
export function skip(to) { while (FIGHT.on && !FIGHT.freeze && !FIGHT.ended && FIGHT.T < to) { tick(0.05); for (const b of FIGHT.bodies) b.userData.anim.mx.update(0.05); } }

/* for the place audit: every spot a person stands at (their start and the end of each walk or run, where they stop or take cover), and every walk and run as a route
   (auditPlace checks a body every 30 cm along each route, so nobody runs through a car or a wall) */
export function positions() {
  const out = []; PEOPLE.forEach((a, n) => { out.push({ id: a.look + n + ' start', x: a.from[0], z: a.from[1], anim: 'Idle' }); a.plan.forEach((st, i) => { const pts = st.walk || st.run; if (pts) { const q = pts[pts.length - 1]; out.push({ id: a.look + n + ' step ' + i, x: q[0], z: q[1], anim: 'Idle' }); } }); });
  return out;
}
export function routes() {
  const out = []; PEOPLE.forEach((a, n) => { let at = a.from; a.plan.forEach((st, i) => { const pts = st.walk || st.run; if (!pts) return; out.push({ id: a.look + n + (st.run ? ' runs' : ' walks') + ' (step ' + i + ')', pts: [at, ...pts], what: st.run ? 'runs' : 'walks' }); at = pts[pts.length - 1]; }); });
  return out;
}
