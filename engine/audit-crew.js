/* engine/audit-crew.js: people seated or kneeling in a boat keep their legs out of its seats and its bottom (owner, 26 November 2026: "cousin feet
   going through bench.. remember these QA checks"). A boat's seat boards are part of one merged mesh, so the furniture checks never saw them.

   auditCrew(Q, { times = [0.1, 0.35, 0.6, 0.85], tol = 0.015 }) -> lines.
   For every crew in Q.crews ({ canoe, list: [{ idx }] }, the people Q.extras[idx]) whose boat has userData.seatBoxes (engine/boats.js dugOut), the
   boat is manned for a moment and the place's tickers run, so each person takes their place and clip; then at each share of the clip the shins and
   feet (and the hips, for a seat a person sits on) are tested against every seat box (as thick as the limb) and against the inside bottom
   (userData.floor). The boat is put back as it was. */
import * as THREE from 'three';

const SEGS = [['Leg', 'Foot', 0.05, 'shin'], ['Foot', 'ToeBase', 0.045, 'foot'], ['UpLeg', 'Leg', 0.07, 'thigh']];

export function auditCrew(Q, { times = [0.1, 0.35, 0.6, 0.85], tol = 0.015 } = {}) {
  const out = [], seen = new Set(), P = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3();
  for (const R of Q.crews || []) {
    const c = R.canoe, boxes = c.userData.seatBoxes;
    if (!boxes) continue;
    const was = [c.userData.manned, c.visible];
    c.userData.manned = true; c.visible = true;
    for (const f of Q.tickers || []) f(0, 1 / 30);
    for (const r of R.list) {
      const n = Q.extras && Q.extras[r.idx];
      if (!n || !n.m || !n.ctl) continue;
      n.ctl.mx.update(0.6);   /* let the boat clip finish fading in: at weight 0 the body still stands, lowered into the boat */
      const act = n.ctl.cur, clip = act && act.getClip && act.getClip();
      for (const share of times) {
        if (clip) { act.time = clip.duration * share; n.ctl.mx.update(0); }
        for (const f of Q.tickers || []) f(0, 0);
        n.m.updateMatrixWorld(true); c.updateMatrixWorld(true);
        const inv = c.matrixWorld.clone().invert();
        for (const s of ['Left', 'Right']) for (const [a, b, rad, what] of SEGS) {
          const ja = n.m.getObjectByName('mixamorig' + s + a), jb = n.m.getObjectByName('mixamorig' + s + b);
          if (!ja || !jb) continue;
          A.setFromMatrixPosition(ja.matrixWorld).applyMatrix4(inv); B.setFromMatrixPosition(jb.matrixWorld).applyMatrix4(inv);
          for (const t of [0.25, 0.5, 0.75, 1]) {
            P.copy(A).lerp(B, t);
            for (const [x0, y0, z0, x1, y1, z1] of boxes) {
              const dx = Math.max(x0 - P.x, 0, P.x - x1), dy = Math.max(y0 - P.y, 0, P.y - y1), dz = Math.max(z0 - P.z, 0, P.z - z1), d = rad - Math.hypot(dx, dy, dz);
              if (what === 'thigh' && P.y > y1) continue;   /* a thigh resting on top of a seat is sitting on it */
              const k = `${n.id || r.idx} ${s} ${what}`;
              if (d > tol && !seen.has(k)) { seen.add(k); out.push(`crew: ${n.id || 'a paddler'}'s ${s.toLowerCase()} ${what} goes ${(d * 100).toFixed(0)} cm into a seat of the boat at ${(share * 100) | 0}% of the clip`); }
            }
            const fl = c.userData.bottom ?? c.userData.floor ?? 0, below = fl - (P.y - rad);
            const k2 = `${n.id || r.idx} ${s} ${what} floor`;
            if (below > 0.05 && !seen.has(k2)) { seen.add(k2); out.push(`crew: ${n.id || 'a paddler'}'s ${s.toLowerCase()} ${what} goes ${(below * 100).toFixed(0)} cm through the bottom of the boat`); }
          }
        }
      }
    }
    c.userData.manned = was[0]; c.visible = was[1];
    for (const f of Q.tickers || []) f(0, 1 / 30);
  }
  return out;
}
