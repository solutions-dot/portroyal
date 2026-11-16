/* games/tivoli/src/aim.js: which way an armed person really points, and the turn a clip builds in.

   Why this exists (owner, 16 November 2026: "at one time the police turn to shoot at their own men"): the owner's Mixamo firing clips turn the
   hips and shoulders inside the clip. ShootPistol, for one, stands side-on, so a body turned to face the gunmen pointed its pistol well off to
   one side, back up the street at its own side. The game sets a body's turn (rotation.y), the clip adds its own, and the weapon follows the hands.

   aimDir(body) is where the weapon points now (flat on the ground): along the weapon while it is in the hands, otherwise the way the chest faces
   (the low-ready carry points the rifle that way too). clipTurn(bodyId, kind, clip) measures, once per clip, body and weapon, how far that clip
   turns the aim away from the body's own facing, so faceFor() can turn the body by the difference and the WEAPON, not the hips, points at the target.
   Used by fight.js every time a person aims, and by the dev check ?test=scene (scenecheck.js), which looks at the real weapon every half second. */
import * as THREE from 'three';
import { mixers } from '../../../engine/anim.js';
import { modeOf, weaponTick, arm, disarm } from './weapons.js';
import { makeBody } from './cast.js';

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3();
const bone = (b, n) => b.getObjectByName('mixamorig' + n);
/* where this person points now, as a flat unit vector { x, z } in the world, and whether that is the weapon or the chest */
export function aimDir(body) {
  const w = body.userData.weapon, mode = w ? modeOf(body) : 'none';
  if (w && mode === 'hands') { w.mesh.updateMatrixWorld(true); _a.set(0, 0, 1).transformDirection(w.mesh.matrixWorld); }
  else {
    body.updateMatrixWorld(true); const sR = bone(body, 'RightArm').getWorldPosition(_b), sL = bone(body, 'LeftArm').getWorldPosition(_c), up = bone(body, 'Neck').getWorldPosition(_d).sub(bone(body, 'Spine').getWorldPosition(_a));
    _a.crossVectors(sL.sub(sR), up);
  }
  const l = Math.hypot(_a.x, _a.z) || 1; return { x: _a.x / l, z: _a.z / l, by: mode === 'hands' ? 'weapon' : 'chest' };
}
export const yawOf = (d) => Math.atan2(d.x, d.z);   /* a body at rotation.y = a faces (sin a, cos a) */
export const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

/* how far a clip turns the aim from the body's facing (radians, the mean over the clip), measured once per clip, body and weapon on a spare copy
   of the body standing at the origin, so nobody in the scene is disturbed */
const TURN = new Map();
export function clipTurn(bodyId, kind, clip) {
  const key = clip + '|' + bodyId + '|' + kind; if (TURN.has(key)) return TURN.get(key);
  const b = makeBody({ bodyId, base: bodyId, anim: clip }); if (kind) { arm(b, kind, null); b.userData.weapon.carry = 'ready'; }
  const ctl = b.userData.anim, act = ctl.cur, D = act.getClip().duration, N = 16; let sx = 0, sz = 0;
  for (let i = 0; i < N; i++) { act.time = D * (i + 0.5) / N; ctl.mx.update(0); b.updateMatrixWorld(true); if (kind) weaponTick(b); const d = aimDir(b); sx += d.x; sz += d.z; }
  if (kind) disarm(b); const k = mixers.indexOf(ctl.mx); if (k >= 0) mixers.splice(k, 1);
  const turn = act.getClip().name === clip ? Math.atan2(sx, sz) : 0; TURN.set(key, turn); return turn;
}
/* the body's turn so that, in this clip, the weapon (not the hips) points along yaw */
export const faceFor = (bodyId, kind, clip, yaw) => wrap(yaw - clipTurn(bodyId, kind, clip));
