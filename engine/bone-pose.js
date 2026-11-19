import { Quaternion } from 'three';

const corrected = new WeakMap();

// An unchanged mixer track may leave a post-animation correction on the bone.
// Restore only corrections still present, so a fresh animation sample wins.
function restore(bone, pose) {
  if (bone.quaternion.equals(pose.after)) bone.quaternion.copy(pose.base);
}

export function beginPoseCorrection(bones) {
  for (const bone of bones) {
    if (!bone?.isObject3D) continue; // A cloned userData bone reference may be plain JSON.
    let pose = corrected.get(bone);
    if (!pose) {
      pose = { base: new Quaternion(), after: new Quaternion(), applied: false };
      corrected.set(bone, pose);
    }
    if (pose.applied) restore(bone, pose);
    pose.base.copy(bone.quaternion);
  }
}

export function endPoseCorrection(bones) {
  for (const bone of bones) {
    const pose = corrected.get(bone);
    if (!pose) continue;
    pose.after.copy(bone.quaternion);
    pose.applied = true;
  }
}

export function clearPoseCorrection(bones) {
  for (const bone of bones) {
    const pose = corrected.get(bone);
    if (!pose) continue;
    if (pose.applied) restore(bone, pose);
    corrected.delete(bone);
  }
}

// Limit the posed rotation in the body's or chest's frame. Moving the whole model
// should carry its joints along immediately. Start a new pose after a long gap.
export function jointTurnLimiter(bone, reference, radiansPerSecond) {
  const last = new Quaternion(), frame = new Quaternion(), target = new Quaternion();
  let ready = false;
  return (dt) => {
    reference.getWorldQuaternion(frame);
    bone.getWorldQuaternion(target).premultiply(frame.invert()).normalize();
    const step = radiansPerSecond * dt;
    if (ready && dt >= 0 && dt < 0.25 && last.angleTo(target) > step) {
      last.rotateTowards(target, step);
      bone.parent.getWorldQuaternion(target).invert();
      bone.quaternion.copy(target.multiply(frame.invert()).multiply(last)).normalize();
    } else {
      last.copy(target);
      ready = true;
    }
  };
}
