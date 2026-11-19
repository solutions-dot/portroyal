import { Quaternion } from 'three';

const SIDES = ['Left', 'Right'];
const DEG = 180 / Math.PI;

// Sample at 30 Hz, after the mixer's pose and the game's ground and seat corrections.
// Compare in the body's frame so turning a character or moving a ship does not count as a foot spin.
export function footWatch() {
  const bodies = new WeakMap(), worst = new Map();
  const root = new Quaternion(), current = new Quaternion(), delta = new Quaternion();
  let samples = 0, people = 0;
  return {
    sample(t, { id, m, clip }) {
      let feet = bodies.get(m);
      if (!feet) {
        feet = SIDES.map(side => {
          const bone = m.getObjectByName('mixamorig' + side + 'Foot');
          return bone && { side, bone, previous: new Quaternion(), t: -Infinity, mixTime: undefined, history: [], twist: [0, 0, 0] };
        }).filter(Boolean);
        bodies.set(m, feet);
        if (feet.length) people++;
      }
      if (!feet.length) return;
      m.getWorldQuaternion(root).invert();
      const mixTime = m.userData.anim?.mx.time;
      for (const foot of feet) {
        foot.bone.getWorldQuaternion(current).premultiply(root).normalize();
        const dt = t - foot.t;
        const mixerStep = mixTime - foot.mixTime;
        // Distance throttling can deliver several frames of clip motion in one pose sample.
        const step = Number.isFinite(mixerStep) ? Math.max(dt, mixerStep) : dt;
        samples++;
        if (dt <= 0 || dt > 0.12) {
          foot.history.length = 0;
          foot.twist.fill(0);
        } else {
          delta.copy(current).multiply(foot.previous.invert());
          const sign = delta.w < 0 ? -1 : 1;
          const angle = 2 * Math.acos(Math.min(1, Math.abs(delta.w))) * DEG;
          const magnitude = Math.hypot(delta.x, delta.y, delta.z);
          const scale = magnitude > 1e-6 ? sign * angle / magnitude : 0;
          const rotation = [delta.x * scale, delta.y * scale, delta.z * scale];
          foot.history.push({ t, rotation });
          for (let axis = 0; axis < 3; axis++) foot.twist[axis] += rotation[axis];
          while (foot.history[0].t < t - 0.25) {
            const old = foot.history.shift().rotation;
            for (let axis = 0; axis < 3; axis++) foot.twist[axis] -= old[axis];
          }
          const spin = Math.hypot(...foot.twist);
          const issue = (kind, value, detail) => {
            const key = id + ':' + foot.side + ':' + kind;
            if (!worst.has(key) || worst.get(key).value < value) {
              worst.set(key, { value, line: `foot: ${id}'s ${foot.side.toLowerCase()} foot ${detail} (${clip || 'unknown clip'} at ${t.toFixed(2)} s)` });
            }
          };
          if (angle > 45 && angle / step > 1350) {
            issue('snap', angle, `snaps ${angle.toFixed(0)} degrees in ${Math.round(step * 1000)} ms`);
          }
          if (spin > 180) issue('spin', spin, `turns ${spin.toFixed(0)} degrees in a quarter second`);
        }
        foot.previous.copy(current);
        foot.t = t;
        foot.mixTime = mixTime;
      }
    },
    lines: () => [...worst.values()].map(entry => entry.line),
    stats: () => ({ people, samples }),
  };
}
