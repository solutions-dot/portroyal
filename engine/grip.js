/* engine/grip.js: a hand that really holds something.
   grip(model, 'Right', item, opts) closes the fingers of that hand into a fist, hangs the item from the middle of the fist by its handle,
   and lifts the arm a little away from the body so the item clears the hip and thigh. The item stays upright however the hand swings.
   Call gripTick(model) every frame AFTER the animation mixer has updated: the mixer resets the bones, and gripTick puts the grip back.
   The character must already be posed (its mixer updated once). The item's origin is its bottom centre; handleY is the height of its handle above that.
   engine/audit.js (auditHeld) checks the result: at the hand, upright, clear of the body. */
import * as THREE from 'three';

const wp = (b) => b.getWorldPosition(new THREE.Vector3()), wq = (o) => o.getWorldQuaternion(new THREE.Quaternion());
function turnWorld(bone, axis, angle) {   /* turn a bone about an axis given in world space */
  const pq = wq(bone.parent), r = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  bone.quaternion.premultiply(pq.clone().invert().multiply(r).multiply(pq)); bone.updateMatrixWorld(true);
}
function bindQuaternion(model, bone) {
  let result = null;
  model.traverse((o) => {
    if (result || !o.isSkinnedMesh) return;
    const s = o.skeleton, i = s.bones.indexOf(bone), pi = s.bones.indexOf(bone.parent);
    if (i < 0 || pi < 0) return;
    const local = s.boneInverses[pi].clone().multiply(s.boneInverses[i].clone().invert());
    const p = new THREE.Vector3(), q = new THREE.Quaternion(), scale = new THREE.Vector3();
    local.decompose(p, q, scale); result = q;
  });
  return result;
}
export function grip(model, side, obj, { handleY = 0.4, scale = 1, yaw = 0, lift = 0.2, curl = 1, straighten = 0 } = {}) {
  const B = (n) => model.getObjectByName('mixamorig' + side + n), hand = B('Hand'), arm = B('Arm'); if (!hand) return null;
  model.updateMatrixWorld(true);
  const idx = B('HandIndex1'), mid = B('HandMiddle1'), pky = B('HandPinky1'), th = B('HandThumb2') || B('HandThumb1'), g = { side, hand, arm, lift: 0, fingers: [], wrap: null, armQ: new THREE.Quaternion(10, 0, 0, 0) };
  // A heavy case hangs below the hand. Idle's bent elbow can pull it into the
  // upper arm; keep some of the straight bind pose while retaining its motion.
  g.elbow = B('ForeArm'); g.straighten = straighten;
  g.elbowRest = straighten && g.elbow ? bindQuaternion(model, g.elbow) : null;
  if (g.elbowRest) g.elbow.quaternion.slerp(g.elbowRest, straighten);
  g.elbowQ = g.elbow ? g.elbow.quaternion.clone() : null;
  model.updateMatrixWorld(true);
  if (idx && mid && pky) {
    const M = wp(mid), f = M.clone().sub(wp(hand)).normalize(), w = wp(idx).sub(wp(pky)).normalize(), n = new THREE.Vector3().crossVectors(w, f).normalize();
    if (th && n.dot(wp(th).sub(M)) < 0) n.negate();   /* n points out of the palm */
    const axis = new THREE.Vector3().crossVectors(f, n).normalize();
    for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) [1.0, 1.35, 0.9].forEach((a, j) => { const b = B('Hand' + fn + (j + 1)); if (!b) return; turnWorld(b, axis, a * curl); g.fingers.push({ b, q: b.quaternion.clone() }); });
    const t1 = B('HandThumb1'), t2 = B('HandThumb2'), t3 = B('HandThumb3'), i2 = B('HandIndex2');
    if (t1 && t3 && i2) { const td = wp(t3).sub(wp(t1)).normalize(), want = wp(i2).sub(wp(t1)).normalize(), ax = new THREE.Vector3().crossVectors(td, want); if (ax.lengthSq() > 1e-6) { const ang = Math.min(0.7, td.angleTo(want) * 0.8); turnWorld(t1, ax.normalize(), ang); for (const b of [t1, t2, t3]) if (b) g.fingers.push({ b, q: b.quaternion.clone() }); } }
  }
  /* which way lifts the arm away from the body? try both and keep the one that moves the hand out from the hips */
  const hips = model.getObjectByName('mixamorigHips'), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(wq(model)).normalize();
  if (arm && hips && lift) { const H = wp(hips), far = (s) => { const q0 = arm.quaternion.clone(); turnWorld(arm, fwd, s * lift); const p = wp(hand); arm.quaternion.copy(q0); arm.updateMatrixWorld(true); return Math.hypot(p.x - H.x, p.z - H.z); }; g.lift = far(1) > far(-1) ? lift : -lift; g.fwdLocal = new THREE.Vector3(0, 0, 1); }
  if (g.lift) turnWorld(arm, fwd, g.lift);
  /* the handle sits inside the closed fingers: half way between the knuckle and the fingertip of the middle finger */
  const tip = B('HandMiddle3'), gp = mid && tip ? wp(mid).lerp(wp(tip), 0.5) : wp(hand), bs = hand.getWorldScale(new THREE.Vector3()).x || 1;
  const wrap = new THREE.Group(); hand.add(wrap); wrap.position.copy(hand.worldToLocal(gp.clone())); wrap.scale.setScalar(scale / bs); wrap.quaternion.copy(wq(hand)).invert().multiply(wq(model));
  obj.position.set(0, -handleY, 0); obj.rotation.y = yaw; wrap.add(obj); g.wrap = wrap; g.armQ.copy(arm ? arm.quaternion : g.armQ);
  (model.userData.grips = model.userData.grips || []).push(g); model.updateMatrixWorld(true); return wrap;
}
/* spreadArms(model, angle): hold both arms a little further from the body than the animation does, so hands do not sink into a wide skirt or a jacket.
   Uses the same per-frame gripTick. */
export function spreadArms(model, angle = 0.1) {
  model.updateMatrixWorld(true); const hips = model.getObjectByName('mixamorigHips'), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(wq(model)).normalize(); if (!hips) return;
  for (const side of ['Left', 'Right']) { const arm = model.getObjectByName('mixamorig' + side + 'Arm'), hand = model.getObjectByName('mixamorig' + side + 'Hand'); if (!arm || !hand) continue;
    if ((model.userData.grips || []).some((g) => g.arm === arm)) continue;   /* a hand that carries something already has its own lift */
    const H = wp(hips), far = (s) => { const q0 = arm.quaternion.clone(); turnWorld(arm, fwd, s * angle); const p = wp(hand); arm.quaternion.copy(q0); arm.updateMatrixWorld(true); return Math.hypot(p.x - H.x, p.z - H.z); };
    const g = { side, hand, arm, lift: far(1) > far(-1) ? angle : -angle, fingers: [], wrap: null, armQ: new THREE.Quaternion(10, 0, 0, 0) }; (model.userData.grips = model.userData.grips || []).push(g); }
}
const _f = new THREE.Vector3();
export function gripTick(model) {
  const gs = model.userData.grips; if (!gs) return; const mq = wq(model);
  for (const g of gs) {
    if (g.elbowRest && !g.elbow.quaternion.equals(g.elbowQ)) {
      g.elbow.quaternion.slerp(g.elbowRest, g.straighten); g.elbowQ.copy(g.elbow.quaternion);
    }
    if (g.lift && g.arm && !g.arm.quaternion.equals(g.armQ)) { _f.set(0, 0, 1).applyQuaternion(mq).normalize(); g.arm.parent.updateWorldMatrix(true, false); turnWorld(g.arm, _f, g.lift); g.armQ.copy(g.arm.quaternion); }   /* only once per animation step */
    for (const f of g.fingers) f.b.quaternion.copy(f.q);
    if (g.wrap) { g.hand.updateWorldMatrix(true, false); g.wrap.quaternion.copy(wq(g.hand)).invert().multiply(mq); }
  }
}
