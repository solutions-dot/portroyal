/* games/tivoli/src/clips.js: the gunfight poses, with stand-ins until the real clips are added.

   The game asks for a pose by its REAL clip name, always through pose(). If the shared animation library has that clip,
   it plays. If not, the stand-in listed below plays instead. So scenes can be built and timed now, and look right later
   with no change to the game code: add the clip to the library (docs/PIPELINE.md, section 2), add its name to
   games/tivoli/anim-clips.json, rebuild, and the stand-in drops out by itself.

   Every stand-in is an existing clip, so nothing here needs new art. They will look wrong (standing, not crouching).
   That is expected. Do not ship with any stand-in left: ?test=clips (dev build) lists the ones still in use. */
import * as THREE from 'three';
import { CL } from '../../../engine/anim.js';

/* real clip name: [stand-in now, what the real clip must show]
   Look for these on Mixamo (all "In Place", FBX without skin): the rifle and crouch packs. */
export const POSES = {
  CrouchIdle:   ['Block',  'Crouched or kneeling behind cover, weapon held low, small breathing. Loops.'],
  DuckDown:     ['Block',  'Drop quickly from standing to a crouch at a shot. Plays once, ends in CrouchIdle.', ['Ducking']],
  CrouchAim:    ['Point',  'Crouched, weapon raised, aiming over the cover. Loops.', ['FireKneel']],
  CrouchFire:   ['Point',  'Crouched (on one knee), firing round the cover with a small recoil. Short loop.', ['FireKneel']],
  StandAim:     ['Point',  'Standing, rifle raised, aiming. Loops.', ['FireStand']],
  StandFire:    ['Point',  'Standing still, firing a rifle with a small recoil. Short loop.', ['FireStand']],
  KneelReady:   ['Block',  'On one knee behind cover, weapon ready. Loops.', ['PistolKneelIdle']],
  RiseFromKneel: ['Idle',  'Stand up from one knee with the rifle. Plays once.', ['RifleKneelToStand']],
  ReadyIdle:    ['Idle',   'Standing still with the rifle held ready, looking about. Loops.', ['RifleIdle']],
  PeekAround:   ['Idle',   'Lean out from a wall corner, look, pull back. Plays once.', ['PeekCorner']],
  AimCorner:    ['Point',  'Lean out from a corner and aim a pistol, then pull back (police).', ['PeekAim']],
  PistolFire:   ['Point',  'Standing, firing a pistol with the arm out, feet still. Not ShootPistol: it swings the pistol 83 degrees round inside the clip (?test=clipinfo).', ['PistolStand', 'Gunplay']],
  PistolKneelFire: ['Point', 'On one knee, a pistol held out in both hands, aiming and firing (police).', ['PistolKneelIdle']],
  ProneFire:    ['Block',  'Lying flat, firing a rifle.', ['ProneFire']],
  ProneTurn:    ['Block',  'Lying flat, turning to the right.', ['ProneTurnR']],
  RunLow:       ['Run',    'Run bent over from one cover to the next. Loops, in place.'],
  CrouchToStand:   ['Idle', 'Rise from a crouch to standing. Plays once.'],
  CrouchTurnStand: ['Idle', 'Turn and rise from a crouch. Plays once.'],
  WalkCrouchR:     ['Walk', 'Walk crouching, moving to the right. Loops, in place.'],
  AdvanceReady: ['Walk',   'Walk with the weapon at the ready, slow and steady. Loops, in place.', ['RifleWalk']],
};
/* The owner's Mixamo clips (tools/tivoli/anim-sources/, packed into site/models/anims_tivoli.js by tools/tivoli/pack_clips.mjs):
   ShootRifle, Gunplay, ShootPistol, ProneFire, ProneTurnR, PeekAim, PeekCorner. A pose lists the real clips it may use, best first (third column);
   without a list it waits for a clip with its own name. */

/* the clip name to play now: the real one if the library has it, otherwise its stand-in */
export function pose(name) {
  const p = POSES[name];
  if (!p) throw new Error('tivoli clips: no pose called ' + name);
  for (const c of [name, ...(p[2] || [])]) if (CL[c]) return c;
  return p[0];
}

/* the poses still using a stand-in (for the dev check and the doc) */
export function standIns() { return Object.keys(POSES).filter((n) => pose(n) === POSES[n][0]); }

/* ---------- firing clips that stand still (built once the clips have loaded: deriveClips(), called from main.js) ----------
   The owner's Shoot_Rifle (ShootRifle) is a run-and-shoot clip: its feet step 3.7 m a second (?test=clipinfo), so a soldier "firing" from
   behind cover looked like he was running on the spot (owner, 16 November 2026). There is no standing or kneeling rifle-firing clip among
   the owner's downloads, so two are made here from his clips, with no new art:
   - FireStand: the upper body of ShootRifle (aim, recoil, cheek to the stock) on the still legs and hips of RifleIdle's first moment.
   - FireKneel: the same upper body on the legs and hips of PistolKneelIdle (on one knee), for firing round the end of a car or a wall.
   - PistolStand: the arm-out pistol aim of PistolKneelIdle on the same still standing legs (the gunmen's pistols).
   The spine is turned so the chest keeps the angle to the ground it had in ShootRifle (the run's average lean, not each step's bob).
   The legs never move, so the feet cannot slide. weapons.js treats the first two as rifle clips (both hands on the rifle) and PistolStand as a pistol clip. */
const LOWER = /^mixamorig(Hips|LeftUpLeg|LeftLeg|LeftFoot|LeftToeBase|LeftToe_End|RightUpLeg|RightLeg|RightFoot|RightToeBase|RightToe_End)\.quaternion$/;
function qAt(track, t, out) { const tm = track.times, v = track.values; let i = 1; while (i < tm.length - 1 && tm[i] < t) i++; const a = Math.max(0, Math.min(1, (t - tm[i - 1]) / ((tm[i] - tm[i - 1]) || 1))); const b = new THREE.Quaternion().fromArray(v, i * 4); return out.fromArray(v, (i - 1) * 4).slerp(b, a); }
function meanQ(track) { const v = track.values, m = new THREE.Quaternion().fromArray(v, 0), q = new THREE.Quaternion(); let n = 1; for (let i = 4; i < v.length; i += 4) { q.fromArray(v, i); if (q.dot(m) < 0) q.set(-q.x, -q.y, -q.z, -q.w); n++; m.slerp(q, 1 / n); } return m.normalize(); }
function upperOnLegs(name, upper, legs, legT = 0) {
  if (!upper || !legs || CL[name]) return; const D = upper.duration, T = (c, n) => c.tracks.find((t) => t.name === 'mixamorig' + n + '.quaternion');
  const hU = meanQ(T(upper, 'Hips')), hL = qAt(T(legs, 'Hips'), legT, new THREE.Quaternion()), fix = hL.clone().invert().multiply(hU);   /* Spine(local) = inverse(new hips) * old hips * Spine */
  const tracks = [];
  for (const t of upper.tracks) {
    if (t.name.endsWith('.position') || t.name.endsWith('.scale')) continue;
    if (LOWER.test(t.name)) { const lt = legs.tracks.find((x) => x.name === t.name); if (!lt) continue; const q = qAt(lt, legT, new THREE.Quaternion()); tracks.push(new THREE.QuaternionKeyframeTrack(t.name, [0, D], [...q.toArray(), ...q.toArray()])); continue; }
    if (t.name === 'mixamorigSpine.quaternion') { const v = t.values.slice(), q = new THREE.Quaternion(); for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i).premultiply(fix).normalize(); q.toArray(v, i); } tracks.push(new THREE.QuaternionKeyframeTrack(t.name, t.times.slice(), v)); continue; }
    tracks.push(t.clone());
  }
  CL[name] = new THREE.AnimationClip(name, D, tracks);
}
export function deriveClips() {
  upperOnLegs('FireStand', CL.ShootRifle, CL.RifleIdle || CL.Idle);
  upperOnLegs('FireKneel', CL.ShootRifle, CL.PistolKneelIdle);
  upperOnLegs('PistolStand', CL.PistolKneelIdle, CL.RifleIdle || CL.Idle);
}
