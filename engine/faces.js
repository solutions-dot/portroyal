/* engine/faces.js: no two people with one face side by side (17 November 2026).
   A game has a few bodies and many people, so the same face stood next to itself (the owner's "twins"). The crowd bodies are built in three faces: <base>, <base>_b and
   <base>_c (tools/people/rebuild.mjs, the recipe's "variants"; light copies add _lo). spreadBodies(specs, count) gives each spec a variant so that no two copies of one
   base within `near` metres share a face. specs: [{ base, x, z }]; count(base) is how many variants that base has in this game (0 for none). People listed in `fixed`
   (story people, who keep the body's own face) are counted but not changed. Each spec gets .variant ('' | '_b' | '_c'); the game adds it to the body id it loads.
   Returns how many could not be told apart (more close copies than faces). The check is in engine/ambient.js (ambientCheck: "twins", "lookalike"). */
const SUF = ['', '_b', '_c'];
export function spreadBodies(specs, count, { near = 4, fixed = [] } = {}) {
  let left = 0; const done = fixed.map((s) => ({ base: s.base, x: s.x, z: s.z, v: 0 }));
  for (const s of specs) { const n = 1 + (count(s.base) || 0), used = new Set();
    for (const d of done) if (d.base === s.base && Math.hypot(d.x - s.x, d.z - s.z) < near) used.add(d.v);
    let v = 0; while (v < n && used.has(v)) v++; if (v >= n) { v = done.filter((d) => d.base === s.base).length % n; left++; }
    s.variant = SUF[v]; done.push({ base: s.base, x: s.x, z: s.z, v }); }
  return left;
}
