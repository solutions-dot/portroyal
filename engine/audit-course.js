/* engine/audit-course.js: boats in a camera scene point the way they go (owner, 26 November 2026: "the canoe direction to the boat to trade is
   completely off.. and so is the rowing out to east.. boats point in wrong direction"). Xaymaca's canoes slid sideways along the coast and the
   trading canoe crossed the bay turned 70 degrees off its course; nothing checked it.

   auditCourse(Q, { films, from = 0, to = 40, step = 1, tol = 25 }) -> lines.
   Every object in the place marked userData.bow ('x', '-x', 'z' or '-z': the local axis its bow points along; engine/boats.js dugOut sets 'x')
   is followed through each of the place's camera scenes (Q.films[id](t, Q), t from `from` to `to`). Whenever it moves more than 8 cm in half a second
   its bow must point within `tol` degrees of the way it moves. A boat that only drifts or bobs is not judged. Each scene is reset with t = -1 after.
   Boats hidden at the audit's story step are shown while the scenes run, then hidden again (the scene itself may not show them). */
import * as THREE from 'three';

const AXIS = { x: [1, 0, 0], '-x': [-1, 0, 0], z: [0, 0, 1], '-z': [0, 0, -1] };

export function auditCourse(Q, { films = null, from = 0, to = 40, step = 1, tol = 25 } = {}) {
  const out = [], F = films || Q.films || {}, boats = [];
  Q.group.traverse((o) => { if (o.userData && AXIS[o.userData.bow]) boats.push(o); });
  if (!boats.length) return out;
  const p = new THREE.Vector3(), f = new THREE.Vector3(), frozen = new Set();
  /* straight from position and rotation: a built place may have stopped updating its matrices (matrixAutoUpdate off), and stale matrices
     showed no movement at all */
  const M = new THREE.Matrix4(), L = new THREE.Matrix4();
  const world = (o) => { const chain = []; for (let q = o; q; q = q.parent) chain.unshift(q); M.identity(); for (const q of chain) { L.compose(q.position, q.quaternion, q.scale); M.multiply(L); } return M; };
  const state = () => boats.map((o) => { const m = world(o); p.setFromMatrixPosition(m); f.fromArray(AXIS[o.userData.bow]).transformDirection(m); return [p.x, p.z, f.x, f.z, visible(o, Q.group), !!o.userData.backing]; });
  /* a boat may be hidden at the story step the audit runs in (the place shows it only in its own chapter): show every boat while its scenes run */
  const hidden = [];
  for (const o of boats) for (let q = o; q && q !== Q.group; q = q.parent) if (!q.visible) { hidden.push(q); q.visible = true; }
  for (const [id, film] of Object.entries(F)) {
    if (typeof film !== 'function') continue;
    const seen = new Set();
    for (let t = from; t <= to; t += step) {
      film(t, Q); const a = state();   /* films take the place as their second argument, as the directors call them (Morant Bay's riot reads Q.extras) */
      film(t + 0.5, Q); const b = state();
      boats.forEach((o, i) => {
        if (!a[i][4] || seen.has(i)) return;
        const dx = b[i][0] - a[i][0], dz = b[i][1] - a[i][1], d = Math.hypot(dx, dz), fl = Math.hypot(a[i][2], a[i][3]);
        if (d < 0.08 || fl < 0.1) return;
        if (!frozen.has(i) && !isDynamic(o)) { frozen.add(i); out.push(`frozen: ${o.name || 'a boat'} moves in the scene "${id}" but is not marked noBatch, so the place's merge (batchStatic) baked it in where it first stood and only its crew moves (mark it dynamic)`); }
        const sign = a[i][5] ? -1 : 1;   /* userData.backing: moving stern first (back-paddling), so the bow should point the opposite way */
        const err = Math.acos(Math.max(-1, Math.min(1, sign * (a[i][2] * dx + a[i][3] * dz) / (d * fl)))) * 180 / Math.PI;
        if (err > tol) { seen.add(i); out.push(`course: in the scene "${id}" at ${t} s, ${o.name || 'a boat'} at (${a[i][0].toFixed(1)}, ${a[i][1].toFixed(1)}) moves ${err.toFixed(0)} degrees off the way its bow points`); }
      });
    }
    film(-1, Q);
  }
  for (const q of hidden) q.visible = false;
  return out;
}
/* dynamic: the boat or something above it is marked userData.noBatch, so the merge left it alone */
function isDynamic(o) { for (let q = o; q; q = q.parent) if (q.userData && q.userData.noBatch) return true; return false; }
function visible(o, root) { for (let q = o; q && q !== root; q = q.parent) if (!q.visible) return false; return true; }   /* up to the place: the audit shows one place at a time */
