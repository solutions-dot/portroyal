/* engine/faces.js: no two people with one face side by side (17 November 2026).
   A game has a few bodies and many people, so the same face stood next to itself (the owner's "twins"). The crowd bodies are built in three faces: <base>, <base>_b and
   <base>_c (tools/people/rebuild.mjs, the recipe's "variants"; light copies add _lo). spreadBodies(specs, count) gives each spec a variant so that no two copies of one
   base that come within `near` metres of each other share a face. specs: [{ base, x, z }]; count(base, spec) is how many variants that base has in this game (0 for none).
   People listed in `fixed` (story people, who keep the body's own face, or the variant they name as .variant) are counted but not changed.
   Each spec gets .variant ('' | '_b' | '_c' | '_d'); the game adds it to the body id it loads.

   People who move are measured over everywhere they go, not only where they start: a spec's .life (its engine/ambient.js behaviour: pts, area, from, to, between,
   chase), its .path and its .pts give the box it stays in (reachOf), and two people are `near` when their boxes are.

   When a base has more close copies than faces, opts.alts(spec) may name other bases of the same sex and age (['man_shirt', 'man_work']); the first with a free face is
   taken, spec.base is changed and opts.rebase(spec, base, was) lets the game fix the clothes for the new body. If there is still none, opts.settle(spec) may make
   a walker stay where it stands (the game changes spec.life and returns true), which makes its box a point. If nothing is free the face whose nearest copy is
   furthest away is used. Returns how many could not be told apart.

   The check is faceCheck (below): every game's ?test=audit runs it over the story people and the extras of each place, and engine/ambient.js runs it on the
   background people as they move (ambientCheck: "twins", "lookalike"). */
const SUF = ['', '_b', '_c', '_d'];   /* a body may have a fourth face (a recipe with three variants) where three are not enough */
const COPY = /_(lo|crowd|phone|focus|mid|far)$/;
export const faceOf = (id) => String(id || '').replace(COPY, '');   /* 'man_suit_b_lo' -> 'man_suit_b': every copy of one body has one face */

/* the box a person stays in: [x0, z0, x1, z1] */
export function reachOf(s, seen = new Set()) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity; seen.add(s);
  const pt = (p) => { if (!p || !isFinite(p[0]) || !isFinite(p[1])) return; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); };
  pt([s.x, s.z]); if (s.hx !== undefined) pt([s.hx, s.hz]);
  const L = s.life || (s.amb && s.amb.spec) || null;
  for (const list of [s.pts, s.path, L && L.pts, L && L.between]) if (Array.isArray(list)) for (const p of list) pt(Array.isArray(p) ? p : [p.x, p.z]);
  if (L) { pt(L.from); pt(L.to); if (L.area) { pt([L.area[0], L.area[1]]); pt([L.area[2], L.area[3]]); }
    if (L.chase && typeof L.chase === 'object' && !seen.has(L.chase)) { const c = reachOf(L.chase, seen); pt([c[0], c[1]]); pt([c[2], c[3]]); } }
  return [x0, z0, x1, z1];
}
const gap = (a, b) => Math.hypot(Math.max(0, a[0] - b[2], b[0] - a[2]), Math.max(0, a[1] - b[3], b[1] - a[3]));   /* metres between two boxes (0 when they touch) */

export function spreadBodies(specs, count, { near = 4, fixed = [], alts = null, rebase = null, settle = null } = {}) {
  let left = 0; const done = fixed.map((s) => ({ base: s.base, box: reachOf(s), v: Math.max(0, SUF.indexOf(s.variant || '')) }));
  const boxes = specs.map((s) => reachOf(s)), size = (b) => (b[2] - b[0]) + (b[3] - b[1]);
  /* the people who go furthest choose first: they meet the most others */
  const order = specs.map((_, i) => i).sort((a, b) => size(boxes[b]) - size(boxes[a]) || a - b);
  const free = (base, box, spec) => { const n = 1 + (count(base, spec) || 0), dist = new Array(n).fill(Infinity);
    for (const d of done) if (d.base === base && d.v < n) dist[d.v] = Math.min(dist[d.v], gap(d.box, box));
    let v = dist.findIndex((d) => d >= near); if (v < 0) { v = 0; for (let k = 1; k < n; k++) if (dist[k] > dist[v]) v = k; }
    return { v, d: dist[v] }; };
  for (const i of order) { const s = specs[i], box = boxes[i]; let pick = { ...free(s.base, box, s), base: s.base };
    if (pick.d < near && alts) for (const b of alts(s) || []) { if (b === s.base) continue; const f = free(b, box, s); if (f.d > pick.d) pick = { ...f, base: b }; if (f.d >= near) break; }
    /* still no face: the game may make a walker stay where it is (opts.settle changes the spec and returns true), so it meets fewer people */
    if (pick.d < near && settle && settle(s)) { boxes[i] = reachOf(s); const b2 = boxes[i]; pick = { ...free(s.base, b2, s), base: s.base };
      if (pick.d < near && alts) for (const b of alts(s) || []) { if (b === s.base) continue; const f = free(b, b2, s); if (f.d > pick.d) pick = { ...f, base: b }; if (f.d >= near) break; } }
    if (pick.d < near) { left++; s.faceLeft = true; } else delete s.faceLeft;   /* faceLeft: for a game's own report of who could not be told apart */
    if (pick.base !== s.base) { const was = s.base; s.base = pick.base; if (rebase) rebase(s, pick.base, was); }
    s.variant = SUF[pick.v]; done.push({ base: s.base, box: boxes[i], v: pick.v }); }
  return left;
}

/* ---------- the check ----------
   faceCheck(people, opts) -> lines. people: [{ id, face (or bodyId), x, z, m (or scale and cols), who, life, path, pts, still, story }]
     face   the body's id ('man_suit', 'man_suit_b_lo'); copies of one body count as one face. Without it the body's skin shape is used.
     m      the body in the scene (for the clothes' colours, and its size: a body shown small as a child is not its grown-up's twin)
     scale, cols   without m: the body's size and its clothes' colours (numbers), e.g. from the look table
     hidden true to count a person whose body is not shown just now (a place that is built but not entered)
     uniform  a squad's name ('soldiers'): two people of one squad, in one uniform and helmet, are not reported
     who    the person, when one person is in the list twice (the same named person at two ages or in two outfits): never reported
     life / path / pts   where a mover goes (reachOf); pass still: true to measure only where the person stands now
   Reports "lookalike:" (same face and nearly the same clothes) and "twins:" (same face) for any two within opts.near metres (2.5). opts.dist(a, b) may give the
   real nearest distance two people came (engine/ambient.js measures it as they move). */
export function skinShape(m) { let g = null; m && m.traverse((o) => { if (!g && o.isSkinnedMesh && /^(Skin|Body|Crowd)$/.test(o.material && o.material.name)) { const p = o.geometry.attributes.position; g = p.count + ':' + [0, 1, 2].map((k) => p.array[Math.floor(p.count / 2) * 3 + k].toFixed(4)).join(','); } }); return g; }
function clothes(m) { const c = []; m && m.traverse((o) => { if (o.isMesh && o.visible !== false && o.material && o.material.color && !/^(Skin|Body|Hair|Human|Eye|Brow|Lash|Teeth|Tongue)/.test(o.material.name)) c.push(o.material.color.getHex()); }); return c.sort(); }
function alike(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) { const x = a[i], y = b[i], d = Math.abs((x >> 16) - (y >> 16)) + Math.abs(((x >> 8) & 255) - ((y >> 8) & 255)) + Math.abs((x & 255) - (y & 255)); if (d > 60) return false; } return true; }
export function faceCheck(people, { near = 2.5, dist = null } = {}) {
  const lines = [], ps = people.filter((n) => n && (n.face || n.bodyId || n.m) && !(n.m && n.m.visible === false && !n.hidden));
  const F = ps.map((n) => (n.face || n.bodyId ? faceOf(n.face || n.bodyId) : skinShape(n.m))), C = ps.map((n) => n.cols || clothes(n.m)), B = ps.map((n) => (n.still ? [n.x, n.z, n.x, n.z] : reachOf(n))), H = ps.map((n) => n.scale || (n.m ? n.m.scale.y : 1) || 1);
  const name = (n) => n.id || n.base || n.face || '?';
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    if (!F[i] || F[i] !== F[j]) continue; if (ps[i].who && ps[i].who === ps[j].who) continue;
    if (Math.max(H[i], H[j]) / Math.min(H[i], H[j]) > 1.12) continue;   /* a grown-up and a child */
    if (ps[i].uniform && ps[i].uniform === ps[j].uniform) continue;   /* a squad in one uniform and helmet is meant to look alike */
    const d = dist ? dist(ps[i], ps[j]) : gap(B[i], B[j]); if (!(d <= near)) continue;
    const both = ps[i].story && ps[j].story ? ' (two story people on one body)' : '';
    lines.push(C[i].length && alike(C[i], C[j]) ? `lookalike: ${name(ps[i])} and ${name(ps[j])} look like the same person, ${d.toFixed(1)} m apart (same face and nearly the same clothes)${both}`
      : `twins: ${name(ps[i])} and ${name(ps[j])} have the same face, ${d.toFixed(1)} m apart${both}`); }
  return lines;
}
/* the same check for games whose people are { id, base, bodyId, x, z, hx, hz, m, life, path, extra } (Kendal, Bog Walk, Melissa, Eventide, Nanny Town): story people and
   extras together, each measured from its home spot over everywhere it walks */
export function placeFaces(npcs, opts) {
  return faceCheck(npcs.filter((n) => n.m && !n.hidden).map((n) => { const x = n.hx !== undefined ? n.hx : n.x, z = n.hz !== undefined ? n.hz : n.z; return { id: n.id || n.name || `${n.base}@(${x.toFixed(1)},${z.toFixed(1)})`, face: n.bodyId || n.base, m: n.m, hidden: true, x, z, life: n.life || (n.amb && n.amb.spec), path: n.path, who: n.who, uniform: n.uniform, story: !n.extra }; }), opts);
}
