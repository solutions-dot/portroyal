/* engine/audit-passage.js: can the player get everywhere, and is there room to pass (22 November 2026). The owner, on The Shark Papers'
   deck: "the ship deck is a bit crowded here and cant allow me to pass over to the other side". The place audit checked that each spot
   to talk or look has a way out, but not that the open parts of a place join up with room to spare.

   auditPassage({ walls, bounds, start, r, wide, cell, minArea, spots })
     walls    the place's walking walls [[x0, z0, x1, z1]]; bounds { x0, z0, x1, z1 }; start { x, z } where the player begins
     r        the player's radius (most games slide the player against walls at 0.23 m)
     wide     the narrowest way that counts as room to pass (0.9 m: the player is about 0.5 m across, with room to spare)
     spots    [{ label, x, z }] things to talk to or look at, each of which must be reachable
   Lines start "pass ":
     - "pass cut off": open ground (over minArea, 0.5 m²) the player cannot reach from the start;
     - "pass narrow": the open ground splits into big parts (each over 1.5 m²) when the way must be `wide` across: each such part is
       reached from the rest only through a gap under 0.9 m, and the line names the narrowest gap found and where it is;
     - "pass spot": a talk or look spot with no open ground within 1.3 m that the player can reach. */

export function auditPassage({ walls = [], bounds, start, r = 0.23, wide = 0.9, cell = 0.1, minArea = 0.5, spots = [] } = {}) {
  const out = [], x0 = bounds.x0, z0 = bounds.z0, nx = Math.max(1, Math.ceil((bounds.x1 - x0) / cell)), nz = Math.max(1, Math.ceil((bounds.z1 - z0) / cell));
  const cx = (i) => x0 + (i + 0.5) * cell, cz = (j) => z0 + (j + 0.5) * cell;
  /* clearance of each cell centre: the distance to the nearest wall or the edge of the bounds (capped at 1 m) */
  const clear = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const x = cx(i), z = cz(j); let d = Math.min(1, x - bounds.x0, bounds.x1 - x, z - bounds.z0, bounds.z1 - z);
    for (const w of walls) { const dx = Math.max(w[0] - x, 0, x - w[2]), dz = Math.max(w[1] - z, 0, z - w[3]); const e = dx === 0 && dz === 0 ? -Math.min(x - w[0], w[2] - x, z - w[1], w[3] - z) : Math.hypot(dx, dz); if (e < d) d = e; if (d < 0) break; }
    clear[j * nx + i] = d;
  }
  const flood = (min, seeds) => {
    const lab = new Int32Array(nx * nz).fill(-1), parts = [];
    for (const s of seeds) {
      if (s < 0 || lab[s] >= 0 || clear[s] < min) continue;
      const id = parts.length, q = [s]; lab[s] = id; let n = 0, sx = 0, sz = 0;
      while (q.length) { const k = q.pop(), i = k % nx, j = (k / nx) | 0; n++; sx += cx(i); sz += cz(j);
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= nx || b >= nz) continue; const m = b * nx + a; if (lab[m] < 0 && clear[m] >= min) { lab[m] = id; q.push(m); } } }
      parts.push({ id, area: n * cell * cell, x: sx / n, z: sz / n });
    }
    return { lab, parts };
  };
  const at = (x, z) => { const i = Math.floor((x - x0) / cell), j = Math.floor((z - z0) / cell); return i < 0 || j < 0 || i >= nx || j >= nz ? -1 : j * nx + i; };
  /* the start may sit a little inside a wall's margin: begin from the clearest cell near it */
  let s0 = -1, best = -1;
  for (let dj = -5; dj <= 5; dj++) for (let di = -5; di <= 5; di++) { const k = at(start.x + di * cell, start.z + dj * cell); if (k >= 0 && clear[k] > best) { best = clear[k]; s0 = k; } }
  const all = [...Array(nx * nz).keys()];
  const reach = flood(r, [s0]), every = flood(r, all);
  for (const p of every.parts) if (p.area >= minArea && reach.lab[at(p.x, p.z)] !== 0 && !reachIn(reach.lab, every.lab, p.id)) out.push(`pass cut off: ${p.area.toFixed(1)} m² of open ground around (${p.x.toFixed(1)}, ${p.z.toFixed(1)}) cannot be reached from the start`);
  /* room to pass: flood again needing a gap `wide` across; big parts that only join through narrower ground are pinched */
  const roomy = flood(wide / 2, all), big = roomy.parts.filter((p) => p.area >= 1.5 && reach.lab[at(p.x, p.z)] === 0);
  if (big.length > 1) {
    big.sort((a, b) => b.area - a.area);
    const main = big[0].id;
    for (const p of big.slice(1)) {
      /* the widest way from this part to the biggest one: a search that always grows the path with the most clearance (a bucket queue),
         so the narrowest point on the best way is the real pinch */
      const best = new Float32Array(nx * nz).fill(-1), pinchAt = new Int32Array(nx * nz).fill(-1), B = Array.from({ length: 101 }, () => []);
      const push = (k, v, pk) => { if (v <= best[k]) return; best[k] = v; pinchAt[k] = pk; B[Math.max(0, Math.min(100, Math.round(v * 100)))].push(k); };
      for (let k = 0; k < nx * nz; k++) if (roomy.lab[k] === p.id) push(k, 1, k);
      let found = -1;
      for (let lv = 100; lv >= 0 && found < 0; lv--) while (B[lv].length && found < 0) {
        const k = B[lv].pop(), v = best[k]; if (Math.round(v * 100) !== lv) continue;
        if (roomy.lab[k] === main) { found = k; break; }
        const i = k % nx, j = (k / nx) | 0;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= nx || b >= nz) continue; const m = b * nx + a; if (clear[m] < r) continue; const nv = Math.min(v, clear[m]); push(m, nv, nv < v ? m : pinchAt[k]); }
      }
      if (found < 0) continue;
      const gap = best[found] * 2, pk = pinchAt[found], px = cx(pk % nx), pz = cz((pk / nx) | 0);
      out.push(`pass narrow: ${p.area.toFixed(1)} m² around (${p.x.toFixed(1)}, ${p.z.toFixed(1)}) joins the rest only through a way about ${gap.toFixed(2)} m wide, near (${px.toFixed(1)}, ${pz.toFixed(1)}); keep ${wide} m`);
    }
  }
  /* ?passmap (dev): a picture of the walking ground, one letter per cell: # wall or edge, . room to pass, : open but under the wide gap, x cut off */
  if (typeof location !== 'undefined' && /[?&]passmap\b/.test(location.search))
    for (let j = 0; j < nz; j += 2) { let row = ''; for (let i = 0; i < nx; i += 2) { const k = j * nx + i; row += clear[k] < r ? '#' : reach.lab[k] !== 0 ? 'x' : clear[k] >= wide / 2 ? '.' : ':'; } out.push('pass map ' + cz(j).toFixed(1).padStart(5) + ' ' + row); }
  for (const s of spots) {
    let ok = false;
    for (let dj = -13; dj <= 13 && !ok; dj++) for (let di = -13; di <= 13 && !ok; di++) { if (Math.hypot(di, dj) * cell > 1.3) continue; const k = at(s.x + di * cell, s.z + dj * cell); if (k >= 0 && reach.lab[k] === 0) ok = true; }
    if (!ok) out.push(`pass spot: ${s.label} at (${s.x.toFixed(1)}, ${s.z.toFixed(1)}) has no reachable ground within 1.3 m`);
  }
  return out;
}
/* is any cell of part id in the full flood also in the start's flood */
function reachIn(reachLab, everyLab, id) { for (let k = 0; k < everyLab.length; k++) if (everyLab[k] === id && reachLab[k] === 0) return true; return false; }
