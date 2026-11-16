/* games/tivoli/src/walk.js: how far one loop of a walking clip carries a body (strideOf) and the clip speed that stops the feet sliding at a given ground speed (pace).
   COPIED from branch claude/affectionate-pasteur-xvhvlq (engine/anim.js strideOf, ctl.pace) because main's engine/ does not have them and must not be edited here.
   Delete this file and use the engine's versions when that branch is merged (docs/PEOPLE.md). */
import * as THREE from 'three';

/* strideOf(model, clip): how many metres of ground one loop of a walking clip covers on THIS body (its leg length and its scale are included).
   Worked out from the clip itself: the foot that is lower is the one on the ground, and how far it travels backwards under the hips is how far the body goes forwards.
   A walker whose ground speed is v must play the clip at v * duration / stride, or the feet slide. pace() below does that. */
const STRIDES = new WeakMap(), _q = [0, 1, 2, 3].map(() => new THREE.Quaternion()), _qb = new THREE.Quaternion(), _p = new THREE.Vector3(), _m3 = new THREE.Matrix3(), _fw = new THREE.Vector3(), _wq = new THREE.Quaternion();
function sampleQ(track, t, out) { const tm = track.times, v = track.values; let i = 1; while (i < tm.length - 1 && tm[i] < t) i++; const a = (t - tm[i - 1]) / ((tm[i] - tm[i - 1]) || 1); out.fromArray(v, (i - 1) * 4); _qb.fromArray(v, i * 4); return out.slerp(_qb, Math.max(0, Math.min(1, a))); }
export function strideOf(m, clip) {
  let per = STRIDES.get(m); if (!per) STRIDES.set(m, per = {}); const key = clip.name + '|' + m.scale.y.toFixed(3); if (per[key] !== undefined) return per[key];
  const B = (n) => m.getObjectByName('mixamorig' + n), T = (n) => clip.tracks.find((t) => t.name === 'mixamorig' + n + '.quaternion'), hips = B('Hips'), tH = T('Hips'); if (!hips || !tH) return (per[key] = 0);
  m.updateMatrixWorld(true); _m3.setFromMatrix4(hips.parent.matrixWorld); _fw.set(0, 0, 1).applyQuaternion(m.getWorldQuaternion(_wq)).normalize();
  const legs = ['Left', 'Right'].map((s) => ({ b: [B(s + 'UpLeg'), B(s + 'Leg'), B(s + 'Foot')], t: [T(s + 'UpLeg'), T(s + 'Leg')] })); if (legs.some((l) => l.b.some((b) => !b) || l.t.some((t) => !t))) return (per[key] = 0);
  const N = 64, D = clip.duration, pos = legs.map(() => []);
  for (let i = 0; i <= N; i++) { const t = D * i / N; sampleQ(tH, t, _q[0]);
    legs.forEach((l, k) => { sampleQ(l.t[0], t, _q[1]); sampleQ(l.t[1], t, _q[2]); _p.copy(l.b[2].position).applyQuaternion(_q[2]).add(l.b[1].position).applyQuaternion(_q[1]).add(l.b[0].position).applyQuaternion(_q[0]).applyMatrix3(_m3); pos[k].push([_p.dot(_fw), _p.y]); }); }
  let dist = 0, on = 0, lo = 1e9, hi = -1e9; for (const l of pos) for (const q of l) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); } const band = /Run/.test(clip.name) ? lo + (hi - lo) * 0.2 : 1e9;   /* a run has moments with both feet in the air: count a foot only while it is down */
  for (let i = 0; i < N; i++) { const k = (pos[0][i][1] + pos[0][i + 1][1] < pos[1][i][1] + pos[1][i + 1][1]) ? 0 : 1; if (pos[k][i][1] > band || pos[k][i + 1][1] > band) continue; dist += Math.max(0, pos[k][i][0] - pos[k][i + 1][0]); on++; }
  return (per[key] = on ? dist * N / on : 0); }
export const WALKS = /^(Walk|WalkM|Run|RunLow|RunLow2|RunForward|RunBackward|RunLeft|RunRight|WalkCrouchR|Carry|SadWalk|RifleWalk|RifleWalk2|RifleCrouchWalk|CarryBagWalk|CarryHeadWalk|CarryHeadWalk2|HoldWalk)$/;
export function pace(m, ctl, v, lo = 0.55, hi = 1.9) { const a = ctl.cur, c = a.getClip(); if (!WALKS.test(c.name)) return 1; const s = strideOf(m, c); if (s > 0.05) a.timeScale = Math.max(lo, Math.min(hi, v * c.duration / s)); return a.timeScale; }
