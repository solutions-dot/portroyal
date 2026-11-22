/* engine/grip.js: a hand that really holds something.
   grip(model, 'Right', item, opts) closes the fingers of that hand into a fist, hangs the item from the middle of the fist by its handle,
   and lifts the arm a little away from the body so the item clears the hip and thigh. The item stays upright however the hand swings.
   Call gripTick(model) every frame AFTER the animation mixer has updated: the mixer resets the bones, and gripTick puts the grip back.
   The character must already be posed (its mixer updated once). The item's origin is its bottom centre; handleY is the height of its handle above that.
   engine/audit.js (auditHeld) checks the result: at the hand, upright, clear of the body. */
import * as THREE from 'three';
import { calmHands, fitRig } from './anim.js';
import { beginPoseCorrection, clearPoseCorrection, endPoseCorrection, jointTurnLimiter } from './bone-pose.js';

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
export function grip(model, side, obj, { handleY = 0.4, scale = 1, yaw = 0, lift = 0.2, curl = 1, straighten = 0, hangs = null } = {}) {
  fitRig(model);   /* the rest pose read from the bind matrices below must be the fitted one (engine/anim.js) */
  const B = (n) => model.getObjectByName('mixamorig' + side + n), hand = B('Hand'), arm = B('Arm'); if (!hand) return null;
  model.updateMatrixWorld(true);
  const idx = B('HandIndex1'), mid = B('HandMiddle1'), pky = B('HandPinky1'), th = B('HandThumb2') || B('HandThumb1'), g = { side, hand, arm, lift: 0, fingers: [], wrap: null };
  // A heavy case hangs below the hand. Idle's bent elbow can pull it into the
  // upper arm; keep some of the straight bind pose while retaining its motion.
  g.elbow = B('ForeArm'); g.straighten = straighten;
  g.elbowRest = straighten && g.elbow ? bindQuaternion(model, g.elbow) : null;
  const bones = [arm, g.elbowRest && g.elbow].filter(Boolean);
  beginPoseCorrection(bones);
  if (g.elbowRest) g.elbow.quaternion.slerp(g.elbowRest, straighten);
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
  if (arm && hips && lift) { const H = wp(hips), far = (s) => { const q0 = arm.quaternion.clone(); turnWorld(arm, fwd, s * lift); const p = wp(hand); arm.quaternion.copy(q0); arm.updateMatrixWorld(true); return Math.hypot(p.x - H.x, p.z - H.z); }; g.lift = far(1) > far(-1) ? lift : -lift; }
  if (g.lift) turnWorld(arm, fwd, g.lift);
  /* the handle sits inside the closed fingers: half way between the knuckle and the fingertip of the middle finger */
  const tip = B('HandMiddle3'), gp = mid && tip ? wp(mid).lerp(wp(tip), 0.5) : wp(hand), bs = hand.getWorldScale(new THREE.Vector3()).x || 1;
  const wrap = new THREE.Group(); hand.add(wrap); wrap.position.copy(hand.worldToLocal(gp.clone())); wrap.scale.setScalar(scale / bs); wrap.quaternion.copy(wq(hand)).invert().multiply(wq(model));
  { const bx = new THREE.Box3().setFromObject(obj); g.hangs = hangs !== null ? !!hangs : (bx.isEmpty() ? false : handleY - bx.min.y > bx.max.y - handleY); }   /* more of it below the handle than above: it hangs from the hand */
  obj.userData.gripHandle=[0,handleY,0]; obj.position.set(0, -handleY, 0); obj.rotation.y = yaw; wrap.add(obj); g.wrap = wrap;
  endPoseCorrection(bones);
  (model.userData.grips = model.userData.grips || []).push(g); model.updateMatrixWorld(true);
  calmHands(model);   /* someone who stood on a talking clip stands on the Idle now: the hand that holds this does not gesture (engine/anim.js) */
  return wrap;
}
/* spreadArms(model, angle): hold both arms a little further from the body than the animation does, so hands do not sink into a wide skirt or a jacket.
   Uses the same per-frame gripTick. */
export function spreadArms(model, angle = 0.1) {
  model.updateMatrixWorld(true); const hips = model.getObjectByName('mixamorigHips'), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(wq(model)).normalize(); if (!hips) return;
  for (const side of ['Left', 'Right']) { const arm = model.getObjectByName('mixamorig' + side + 'Arm'), hand = model.getObjectByName('mixamorig' + side + 'Hand'); if (!arm || !hand) continue;
    if ((model.userData.grips || []).some((g) => g.arm === arm)) continue;   /* a hand that carries something already has its own lift */
    const H = wp(hips), far = (s) => { const q0 = arm.quaternion.clone(); turnWorld(arm, fwd, s * angle); const p = wp(hand); arm.quaternion.copy(q0); arm.updateMatrixWorld(true); return Math.hypot(p.x - H.x, p.z - H.z); };
    const g = { side, hand, arm, lift: far(1) > far(-1) ? angle : -angle, fingers: [], wrap: null }; (model.userData.grips = model.userData.grips || []).push(g); }
}
const _f = new THREE.Vector3(), GRIP_BONES = new WeakMap();
export function gripTick(model) {
  const gs = model.userData.grips || [], last = GRIP_BONES.get(model);
  if (!gs.length && !last) return;
  const active = new Map(), bones = new Set();
  for (const g of gs) {
    if (g.steady) { for (const bone of g.bones) bones.add(bone); }
    else if (!g.wrap || g.wrap.parent) {
      // Holding an item takes over from the arm's standing posture correction.
      if (!active.has(g.hand) || g.wrap) active.set(g.hand, g);
      if (g.arm) bones.add(g.arm);
      if (g.elbowRest) bones.add(g.elbow);
    }
  }
  if (last) clearPoseCorrection([...last].filter(bone => !bones.has(bone)));
  if (bones.size) GRIP_BONES.set(model, bones);
  else GRIP_BONES.delete(model);
  beginPoseCorrection(bones);
  const mq = wq(model);
  for (const g of active.values()) {
    if (g.elbowRest) g.elbow.quaternion.slerp(g.elbowRest, g.straighten);
    if (g.lift && g.arm) { _f.set(0, 0, 1).applyQuaternion(mq).normalize(); turnWorld(g.arm, _f, g.lift); }
    for (const f of g.fingers) f.b.quaternion.copy(f.q);
    if (g.wrap) { g.hand.updateWorldMatrix(true, false); g.wrap.quaternion.copy(wq(g.hand)).invert().multiply(mq); }
  }
  for (const g of gs) if (g.steady) steadyTick(model, g);
  endPoseCorrection(bones);
}

/* steadyLoad(model, item): a hand that steadies a load carried on the head (owner, 18 November 2026: "her hand is not touching the basket", Miss Cleo in Kendal).
   The carry-on-the-head clips (CarryHeadIdle, CarryHeadWalk) raise one hand to where their own load was; our baskets sit lower and nearer, so the hand
   waved in the air beside the basket. Each frame (gripTick), when a hand is up near the load, the arm is bent and turned (two bones, like a knee on a slope)
   so the palm rests on the load's rim on that side, a little below the top. A hand that is down (walking back empty, talking) is left alone.
   engine/audit.js (auditHeld) checks it: on a head-carry clip a raised hand must touch the load. */
const _s = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], _sq = new THREE.Quaternion(), _sb = new THREE.Box3();
function rotW(bone, q) { const pq = wq(bone.parent); bone.quaternion.premultiply(pq.clone().invert().multiply(q).multiply(pq)); bone.updateMatrixWorld(true); }
export function reachTo(model, side, T) {   /* two-bone reach: shoulder, elbow, wrist; bends the elbow so the wrist can reach T, then swings the upper arm onto it */
  const B = (n) => model.getObjectByName('mixamorig' + side + n), up = B('Arm'), el = B('ForeArm'), wr = B('Hand'); if (!up || !el || !wr) return false;
  model.updateMatrixWorld(true); const S = up.getWorldPosition(_s[0]), E = el.getWorldPosition(_s[1]), W = wr.getWorldPosition(_s[2]), a = S.distanceTo(E), b = E.distanceTo(W), c0 = S.distanceTo(W), c1 = Math.min(a + b - 1e-3, Math.max(Math.abs(a - b) + 1e-3, S.distanceTo(T)));
  const ang = (c) => Math.acos(Math.min(1, Math.max(-1, (a * a + b * b - c * c) / (2 * a * b))));
  const ax = _s[3].copy(E).sub(S).cross(_s[4].copy(W).sub(E)); if (ax.lengthSq() > 1e-10) { ax.normalize(); rotW(el, _sq.setFromAxisAngle(ax, -(ang(c1) - ang(c0)))); }
  const W2 = wr.getWorldPosition(_s[2]); rotW(up, _sq.setFromUnitVectors(W2.sub(S).normalize(), _s[4].copy(T).sub(S).normalize())); return true;
}
export function steadyLoad(model, item) {
  const limbs = ['Left', 'Right'].map(side => {
    const arm = model.getObjectByName('mixamorig' + side + 'Arm');
    const elbow = model.getObjectByName('mixamorig' + side + 'ForeArm');
    return { side, arm, elbow, turn: arm ? jointTurnLimiter(arm, model, 14) : null };
  });
  const bones = limbs.flatMap(({ arm, elbow }) => [arm, elbow]).filter(Boolean);
  (model.userData.grips = model.userData.grips || []).push({ steady: item, limbs, bones, fingers: [], wrap: null });
}
function steadyTick(model, g) {
  const c = model.userData.anim, time = c?.mx.time, dt = time - g.time;
  const action = c?.cur, phase = action?.time;
  const seek = dt === 0 && (action !== g.action || phase !== g.phase);
  g.time = time;
  g.action = action;
  g.phase = phase;
  let weight = 0;
  if (c && g.steady.parent && g.steady.visible) for (const a of c.mx._actions) {
    if (a.isScheduled() && /^CarryHead/.test(a.getClip().name)) weight += a.getEffectiveWeight();
  }
  if (weight > 0) {
    model.updateMatrixWorld(true);
    _sb.setFromObject(g.steady);
    if (!_sb.isEmpty()) steadyContact(model, g.limbs, Math.min(1, weight), g.steady.userData.steadyAt);
  }
  for (const { turn } of g.limbs) turn?.(seek ? Infinity : dt);
}

function steadyContact(model, limbs, weight, at) {   /* at { r, dy }: for a load that is not a tub (a bunch of bananas is a stalk with fruit round it, and its outer box reaches far past the fruit), the hand rests r from the load's middle, dy above or below it */
  const ctr = _sb.getCenter(new THREE.Vector3()), size = _sb.getSize(new THREE.Vector3());
  const head = model.getObjectByName('mixamorigHead'); if (!head) return;
  const headY = wp(head).y;
  for (const { side, arm, elbow } of limbs) {
    const h = model.getObjectByName('mixamorig' + side + 'Hand'); if (!h || !arm || !elbow) continue;
    const hp = wp(h);
    const blend = weight * THREE.MathUtils.smoothstep(hp.y - headY, -0.10, -0.025);
    if (blend <= 0) continue;
    const d = new THREE.Vector3(hp.x - ctr.x, 0, hp.z - ctr.z); if (d.lengthSq() < 1e-6) continue; d.normalize();
    const r = at ? at.r : Math.max(size.x, size.z) / 2, P = ctr.clone().addScaledVector(d, r + 0.03); P.y = at ? ctr.y + (at.dy || 0) : _sb.max.y - Math.min(0.05, size.y * 0.25);   /* where the palm goes: on the rim, just below the top */
    const k = model.getObjectByName('mixamorig' + side + 'HandMiddle1');
    const armBefore = arm.quaternion.clone(), elbowBefore = elbow.quaternion.clone();
    for (let it = 0; it < 2; it++) { const w = wp(h), pm = k ? w.clone().lerp(wp(k), 0.6) : w; reachTo(model, side, P.clone().sub(pm.sub(w))); }
    arm.quaternion.slerp(armBefore, 1 - blend);
    elbow.quaternion.slerp(elbowBefore, 1 - blend);
  }
}
