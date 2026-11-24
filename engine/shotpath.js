/* engine/shotpath.js: the camera path of a film's shot list, with real cuts (owner, 23 November 2026, Morant Bay: the camera swooped through
   a roof between two shots 0.8 s apart, because the path was one smooth curve through every shot). For any game's director (rule 10).
     const path = shotPath(shots)      shots: [{ t, p: [x,y,z], look: [x,y,z], cut? }]
     path.at(t, reduced)               -> { p: Vector3, look: Vector3 } at film time t
   A shot with `cut: true` starts a new run: the camera holds the last framing of the run before it until that shot's time, then jumps.
   Within a run the camera follows a smooth Catmull-Rom curve (centripetal) through the shots, the shot times mapped to equal steps along
   it, eased at the start and the end of the run. A run of one shot holds still. `reduced` (reduced motion) holds the first framing of
   each run. */
import * as THREE from 'three';

export function shotPath(shots) {
  const runs = [];
  for (const s of shots) {
    if (!runs.length || s.cut) runs.push([]);
    runs[runs.length - 1].push(s);
  }
  for (const r of runs) {
    r.P = r.map((s) => new THREE.Vector3(...s.p));
    r.L = r.map((s) => new THREE.Vector3(...s.look));
    if (r.length > 1) {
      r.curve = new THREE.CatmullRomCurve3(r.P, false, 'centripetal');
      r.lookCurve = new THREE.CatmullRomCurve3(r.L, false, 'centripetal');
    }
  }
  const along = (S, t) => {
    const n = S.length - 1;
    if (t <= S[0].t) return 0;
    if (t >= S[n].t) return 1;
    let i = 0;
    while (i < n - 1 && t >= S[i + 1].t) i++;
    let k = (t - S[i].t) / (S[i + 1].t - S[i].t);
    if (i === 0) k = k * k * (2 - k) * 0.5 + k * 0.5; // ease in
    if (i === n - 1) k = 1 - (1 - k) * (1 - k) * 0.5 - (1 - k) * 0.5; // ease out
    return (i + k) / n;
  };
  return {
    runs,
    at(t, reduced = false) {
      let r = runs[0];
      for (const x of runs) if (t >= x[0].t) r = x;
      if (r.length === 1 || reduced) return { p: r.P[0].clone(), look: r.L[0].clone() };
      const k = along(r, t);
      return { p: r.curve.getPoint(k), look: r.lookCurve.getPoint(k) };
    },
  };
}
