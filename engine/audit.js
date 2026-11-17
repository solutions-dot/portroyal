import { routeIssues, furnitureRouteIssues, anchorSeat } from './placement.js';
/* engine/audit.js: automatic checks of a built place, for every game. Rule (CLAUDE.md): run it, and fix everything it reports, before calling a place done.
   It finds three kinds of mistake that are easy to miss by eye and tedious to find one at a time:
     float   an object (a sign, a lamp, a roof) that touches nothing connected to the ground, so it hangs in the air
     inside  a person standing inside a solid box or cylinder (a wall, an embankment, a table), or inside a walking wall
     stuck   a spot the player needs (the start, a thing to do, a person to talk to) that cannot be reached by walking
   How to use it in a game (see games/kendal/src/main.js, "the place audit"):
     1. When a place is built, before any merging of meshes: place.snap = snapMeshes(place.group)
     2. When it is populated: report = auditPlace({ id, snap, npcs, walls, bounds, start, actions, people })
     3. Show report.floating, report.inside and report.stuck in a dev-only test view (?test=audit) and expect 0 issues.
     held    something carried (a basket, a lamp, a case) that is not at the hand, hangs the wrong way up, or cuts into the carrier's body
     overlap two people standing in the same spot (or walking through someone who stands still), or someone on top of the player's start
     seated  a person sitting who cuts into a seat or its back, floats above the seat, sits on nothing, or faces the back of the seat
     through a bush, tree or other leafy shape that pokes through a wall and shows on both sides of it (call auditThrough(snap) and report its lines with the rest)
     vehicle a bus, cart, truck or train whose path passes through or close to a person, the player's spot or a walking wall (auditVehicles)
     hang    a loose clump of leaves or flowers high up that touches nothing: no stem, no wall, no ground (auditHanging)
     garment a small piece of clothing (buttons, a hat band, a buckle) that shows while its garment is hidden, or floats clear of every other piece (auditGarments)
     head    a head turned further from the chest than a person can, or turning faster than a person turns it: a spin (headWatch, sampled over time)
   Nothing here runs in a public build unless a game imports it into code that is only reached when __DEV__ is true. */
import * as THREE from 'three';
import { groundFeet, strideOf, isSeated } from './anim.js';

/* a list of the world-space box of every visible mesh under a group (instanced meshes are skipped). The mesh's own shape and place are kept aside (SHAPE) for checks that need real contact. */
const SHAPE = new WeakMap();
export function snapMeshes(group) {
  group.updateMatrixWorld(true); const out = [], inst = [];
  group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o.visible) { const b = new THREE.Box3().setFromObject(o); if (!isFinite(b.min.x)) return; const e = { b, mat: Array.isArray(o.material) ? 'multi' : (o.material.name || o.material.type), geo: o.geometry.type, unlit: [].concat(o.material).every((m) => m.isMeshBasicMaterial), flame: [].concat(o.material).every((m) => m.isMeshBasicMaterial && (o.geometry.type === 'ConeGeometry' || m.transparent || m.blending === THREE.AdditiveBlending)), col: [].concat(o.material)[0].color ? '#' + [].concat(o.material)[0].color.getHexString() : '' }; SHAPE.set(e, { geo: o.geometry, mw: o.matrixWorld.clone() }); let top = o; while (top.parent && top.parent !== group) top = top.parent; e.top = top.uuid; e.loose = o.parent === group; e.skinned = !!o.isSkinnedMesh; e.veg = !!(o.userData.veg || top.userData.veg); e.card = isCard(o.material); e.name = o.name || (top !== o ? top.name : '') || ''; for (let a = o; a && a !== group; a = a.parent) if (a.userData.hollow) e.hollow = true;   /* hollow: a vehicle or room people stand inside on purpose (a cab, a carriage): no outline test (auditBodies) */   /* top: the object it belongs to (the child of the place's group that holds it) */
    if (o.geometry.type === 'BoxGeometry') { o.geometry.computeBoundingBox(); e.lb = o.geometry.boundingBox.clone(); e.inv = o.matrixWorld.clone().invert(); e.sc = Math.cbrt(Math.abs(o.matrixWorld.determinant())) || 1; }   /* the exact box, for seats */
    out.push(e); }
    if (o.isInstancedMesh && o.visible && !o.isSkinnedMesh && (SOLID.has(o.geometry.type) || !isCard(o.material))) {   /* each drawn copy of an instanced shape (tree trunks, huts, whole trees, rocks) is kept aside, for the overlap check (solid shapes only) and the bodies check (auditBodies) */
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const m4 = new THREE.Matrix4(), mat = [].concat(o.material)[0];
      for (let k = 0; k < o.count; k++) { o.getMatrixAt(k, m4); const mw = o.matrixWorld.clone().multiply(m4), b = o.geometry.boundingBox.clone().applyMatrix4(mw); if (!isFinite(b.min.x)) continue;
        const e = { b, mat: mat.name || mat.type, geo: o.geometry.type, unlit: !!mat.isMeshBasicMaterial, flame: false, col: mat.color ? '#' + mat.color.getHexString() : '', top: o.uuid + '#' + k, inst: true, card: isCard(o.material), name: o.name || '' }; SHAPE.set(e, { geo: o.geometry, mw }); inst.push(e); } } });
  out.inst = inst; return out;
}

// A rotated bench's world AABB includes empty corners beside its backrest.
export function insideBoxFootprint(mesh, x, y, z) {
  if (!mesh.inv) return true;
  const p = new THREE.Vector3(x, y, z).applyMatrix4(mesh.inv), inset = 0.05 / mesh.sc;
  return p.x > mesh.lb.min.x + inset && p.x < mesh.lb.max.x - inset && p.z > mesh.lb.min.z + inset && p.z < mesh.lb.max.z - inset;
}

/* place: { id, snap, npcs: [{id, x, z, anim, ground}], walls: [[x0, z0, x1, z1]], bounds: {x0, x1, z0, z1}, start: {x, z}, actions: [{label, x, z, r}], people: [{id, x, z, anim}] } */
export function auditPlace(place) {
  const L = place.snap, n = L.length, par = Array.from({ length: n }, (_, i) => i), find = (i) => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; }, uni = (a, b) => { par[find(a)] = find(b); };
  const E = 0.1, ex = L.map((m) => m.b.clone().expandByScalar(E)), big = [], cell = new Map(), key = (x, z) => ((x | 0) + 5000) * 20000 + ((z | 0) + 5000), size = L.map((m) => m.b.getSize(new THREE.Vector3()));
  /* connect every pair of meshes that touch (within 0.1 m). Very large meshes (ground, hills, the sea) are the ground itself. */
  L.forEach((m, i) => { if (size[i].x > 40 || size[i].z > 40) { big.push(i); return; } for (let x = Math.floor(ex[i].min.x / 3); x <= Math.floor(ex[i].max.x / 3); x++) for (let z = Math.floor(ex[i].min.z / 3); z <= Math.floor(ex[i].max.z / 3); z++) { const k = key(x, z); (cell.get(k) || cell.set(k, []).get(k)).push(i); } });
  for (const [, list] of cell) for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) if (ex[list[a]].intersectsBox(ex[list[b]])) uni(list[a], list[b]);
  const grounded = new Set(); for (const g of big) { grounded.add(find(g)); for (let i = 0; i < n; i++) if (i !== g && ex[g].intersectsBox(ex[i])) uni(g, i); }
  for (let i = 0; i < n; i++) if (L[i].b.min.y <= 0.15) grounded.add(find(i));
  const roots = new Set([...grounded].map(find)), comps = new Map(); for (let i = 0; i < n; i++) { const r = find(i); if (!roots.has(r)) (comps.get(r) || comps.set(r, []).get(r)).push(i); }
  const floating = []; for (const idx of comps.values()) { const b = new THREE.Box3(); idx.forEach((i) => b.union(L[i].b)); const sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3()); if (Math.max(sz.x, sz.y, sz.z) < 0.1) continue; floating.push(`float@(${c.x.toFixed(1)},${c.y.toFixed(1)},${c.z.toFixed(1)}) ${sz.x.toFixed(1)}x${sz.y.toFixed(1)}x${sz.z.toFixed(1)} ${idx.length} meshes, first is ${L[idx[0]].geo} ${L[idx[0]].mat}`); }
  /* people inside a solid box or cylinder, or inside a walking wall */
  const inside = [];
  for (const p of place.npcs) { const g = p.ground || 0; for (let i = 0; i < n; i++) { const b = L[i].b, sz = size[i]; if (big.includes(i) || sz.y < 0.3 || b.max.y < g + (isSeated(p.anim) ? 0.62 : 0.3) || b.min.y > g + 1.3 || (L[i].geo !== 'BoxGeometry' && L[i].geo !== 'CylinderGeometry')) continue; const exact = insideBoxFootprint(L[i], p.x, Math.max(g + 0.7, b.min.y + 0.05), p.z); if (exact && p.x > b.min.x + 0.05 && p.x < b.max.x - 0.05 && p.z > b.min.z + 0.05 && p.z < b.max.z - 0.05) { inside.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) inside a ${L[i].geo} ${sz.x.toFixed(1)}x${sz.y.toFixed(1)}x${sz.z.toFixed(1)}, y ${b.min.y.toFixed(1)} to ${b.max.y.toFixed(1)}`); break; } } }
  for (const p of place.npcs) if (!(p.ground > 0) && !isSeated(p.anim) && !p.offWall) for (const w of place.walls) if (p.x > w[0] && p.x < w[2] && p.z > w[1] && p.z < w[3]) { inside.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) inside a walking wall`); break; }
  /* walk the floor on a 0.25 m grid from the start, then check that everything the player needs can be reached */
  const bd = place.bounds, st = 0.25, W = Math.round((bd.x1 - bd.x0) / st) + 1, D = Math.round((bd.z1 - bd.z0) / st) + 1, seen = new Uint8Array(W * D);
  const ok = (x, z) => x >= bd.x0 && x <= bd.x1 && z >= bd.z0 && z <= bd.z1 && !place.walls.some((w) => x > w[0] && x < w[2] && z > w[1] && z < w[3]);
  const q = [], sx = Math.round((place.start.x - bd.x0) / st), sz0 = Math.round((place.start.z - bd.z0) / st), startOK = ok(place.start.x, place.start.z); if (startOK) { q.push([sx, sz0]); seen[sz0 * W + sx] = 1; }
  while (q.length) { const [cx, cz] = q.pop(); for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, nz = cz + dz; if (nx < 0 || nz < 0 || nx >= W || nz >= D || seen[nz * W + nx] || !ok(bd.x0 + nx * st, bd.z0 + nz * st)) continue; seen[nz * W + nx] = 1; q.push([nx, nz]); } }
  const reach = (x, z, r) => { for (let cz = 0; cz < D; cz++) for (let cx = 0; cx < W; cx++) if (seen[cz * W + cx] && Math.hypot(bd.x0 + cx * st - x, bd.z0 + cz * st - z) <= r) return true; return false; };
  const stuck = []; if (!startOK) stuck.push('the START is inside a wall or outside the bounds'); for (const a of place.actions) if (!reach(a.x, a.z, a.r * 0.9)) stuck.push('thing to do "' + a.label + '" cannot be reached'); for (const p of place.people) if (!isSeated(p.anim) && !reach(p.x, p.z, 2.3)) stuck.push('person ' + p.id + ' cannot be reached to talk to');
  for(const p of place.npcs)if(!isSeated(p.anim))inside.push(...furnitureRouteIssues(p.id,[[p.x,p.z]],L,p.ground||0,.16));
  const overlap = auditPeople(place.npcs, place.start);
  for(const p of place.npcs) if(p.path && !(p.ground>0)) { inside.push(...routeIssues(p.id,p.path,place.walls,.22)); inside.push(...furnitureRouteIssues(p.id,p.path,L,p.ground||0)); }
  floating.push(...auditRest(L, place.groundAt));
  const cut = auditOverlap(L.concat(L.inst || []));
  inside.push(...auditBodies(L.concat(L.inst || []), bodySpots(place), { skip: place.bodySkip }));   /* people inside any solid shape, where they stand, along a walker's loop and along the routes a game gives (followers, leaders) */
  return { id: place.id, floating, inside: inside.concat(overlap, cut), stuck };
}

/* overlap: two separate solid things that cut into each other (a stool through a basket, a fence through a hut, a log through a rock, a pot sunk into a table).
   How it decides:
   - "Separate" means two different objects: the meshes hang under two different children of the place's group. The pieces of one thing (a hut's walls and roof,
     a pot and its lid, the sticks of a wood pile, a pestle in its mortar) are built to meet and are never compared.
     Meshes added straight to the place's group, not inside an object of their own, are the place's own fabric (walls, beams, floors, steps, built in place to
     meet each other); two of those are not compared either, but each is compared with every object (a crate, a bench, a tree, a rock) that cuts into it.
   - Each drawn copy of an instanced shape (tree trunks, huts drawn many times at once) counts as its own object.
   - Only shapes with a real inside are judged: boxes, cylinders, spheres, lathe shapes and rocks. Flat shapes (planes, signs, paper), leafy shapes (cones,
     icosahedra: tree crowns, bushes), unlit ones (flames, glows), people (skinned meshes) and anything over 40 m (the ground) are left out.
   - Things that sit on or lean against each other touch only at the surface. A fault is a cut deeper than 4 cm: at least 3 points of one shape lie more than
     4 cm inside the other, tested with the other's own shape (a box exactly, a cylinder by its radius, anything else as the ball that fits inside its box,
     which never over-reports). A pot standing on a fire's stones, or a basket on the ground, is never that deep. */
const SOLID = new Set(['BoxGeometry', 'CylinderGeometry', 'SphereGeometry', 'LatheGeometry', 'DodecahedronGeometry', 'CapsuleGeometry', 'ExtrudeGeometry']);
function depthIn(e, p, v) {   /* how far point p lies inside e's shape, in metres (negative: outside) */
  const s = shapeOf(e), bb = s.geo.boundingBox, el = s.mw.elements; v.copy(p).applyMatrix4(s.inv);
  const kx = Math.hypot(el[0], el[1], el[2]), ky = Math.hypot(el[4], el[5], el[6]), kz = Math.hypot(el[8], el[9], el[10]);
  const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2, hx = (bb.max.x - bb.min.x) / 2, hy = (bb.max.y - bb.min.y) / 2, hz = (bb.max.z - bb.min.z) / 2;
  const dx = (v.x - cx) * kx, dy = (v.y - cy) * ky, dz = (v.z - cz) * kz, Hx = hx * kx, Hy = hy * ky, Hz = hz * kz;
  if (e.geo === 'BoxGeometry') return Math.min(Hx - Math.abs(dx), Hy - Math.abs(dy), Hz - Math.abs(dz));
  if (e.geo === 'CylinderGeometry' || e.geo === 'LatheGeometry' || e.geo === 'CapsuleGeometry') { const pr = s.geo.parameters || {}, t = Math.max(0, Math.min(1, (v.y - bb.min.y) / ((bb.max.y - bb.min.y) || 1))), r = e.geo === 'CylinderGeometry' ? ((pr.radiusBottom ?? hx) * (1 - t) + (pr.radiusTop ?? hx) * t) : Math.min(hx, hz); const rr = Math.hypot((v.x - cx) / (r || 1e-6), (v.z - cz) / (r || 1e-6)); return Math.min(Hy - Math.abs(dy), (1 - rr) * r * Math.min(kx, kz)); }
  const q = Math.hypot(dx / (Hx || 1e-6), dy / (Hy || 1e-6), dz / (Hz || 1e-6)); return (1 - q) * Math.min(Hx, Hy, Hz);   /* the ball (ellipsoid) inside its box */
}
export function auditOverlap(snap, { deep = 0.04 } = {}) {
  const out = [], v = new THREE.Vector3(), sz = snap.map((m) => m.b.getSize(new THREE.Vector3()));
  const ok = snap.map((m, i) => SOLID.has(m.geo) && !m.unlit && !m.skinned && m.top && SHAPE.has(m) && sz[i].x < 40 && sz[i].z < 40 && Math.min(sz[i].x, sz[i].y, sz[i].z) > deep);
  const cell = new Map(), key = (x, z) => ((x | 0) + 5000) * 20000 + ((z | 0) + 5000), seen = new Set();
  snap.forEach((m, i) => { if (!ok[i]) return; for (let x = Math.floor(m.b.min.x / 2); x <= Math.floor(m.b.max.x / 2); x++) for (let z = Math.floor(m.b.min.z / 2); z <= Math.floor(m.b.max.z / 2); z++) { const k = key(x, z); (cell.get(k) || cell.set(k, []).get(k)).push(i); } });
  const pairs = new Set(); for (const [, l] of cell) for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) { const i = l[a], j = l[b]; if (snap[i].top === snap[j].top || (snap[i].loose && snap[j].loose)) continue; const ib = snap[i].b.clone().intersect(snap[j].b), d = ib.isEmpty() ? null : ib.getSize(v); if (!d || d.x < deep || d.y < deep || d.z < deep) continue; pairs.add(i < j ? i * 1e6 + j : j * 1e6 + i); }
  for (const k of pairs) { const i = Math.floor(k / 1e6), j = k % 1e6, A = snap[i], B = snap[j], key2 = A.top + B.top; if (seen.has(key2)) continue;
    let worst = 0, n = 0, at = null; for (const [P, Q] of [[A, B], [B, A]]) for (const p of worldPoints(P, 400)) { if (!Q.b.containsPoint(p)) continue; const d = depthIn(Q, p, v); if (d > deep) { n++; if (d > worst) { worst = d; at = p; } } }
    if (n >= 3) { seen.add(key2); out.push(`overlap@(${at.x.toFixed(2)},${at.y.toFixed(2)},${at.z.toFixed(2)}) a ${A.geo} ${A.col || ''} and a ${B.geo} ${B.col || ''} cut ${(worst * 100).toFixed(0)} cm into each other (${n} points)`); } }
  return out;
}

/* bodies: a person inside a solid thing (a girl inside the roots of a tree, a man inside a hut wall, a child inside a rock, a guide walking through a trunk).
   The inside check above sees only plain boxes and cylinders that were not merged or instanced. Here every solid shape counts, whatever it is made of: merged shapes
   (a whole tree, a hut drawn as one shape), each drawn copy of an instanced shape (a forest of trees, rocks, far huts), spheres, lathes and rocks.
   A person is an upright cylinder from the ground to about their height (radius r, 18 cm for a grown-up). It is cut by flat slices every 12 cm, and in each slice
   the real triangles of every shape near it are cut too. The person is inside a shape where a cut line of its surface passes closer than r to their middle (the
   surface goes through the body), or where they are enclosed by it (counted along four rays, which must agree, so an open strip never counts). A fault is two or
   more slices more than 3 cm deep. Flat things you can see through or walk through are left out: leaf cards (anything drawn with alphaTest or see-through), planes,
   unlit glows and flames, people, thin small plants (under 12 cm across and 1.2 m tall: flower stalks, grass), and anything wider than 40 m (the ground). skip(entry) leaves out more (bushes that hide someone on purpose).
   people: [{ id, x, z, ground, h, r, what }] (what: "stands", "walks", "follows", put in the line). Lines name the thing and where it is. */
const FLAT = new Set(['PlaneGeometry', 'CircleGeometry', 'RingGeometry', 'ShapeGeometry']);
function isCard(material) { return [].concat(material).some((m) => m && (m.alphaTest > 0 || m.transparent || m.isMeshBasicMaterial || m.isSpriteMaterial)); }
const TRIS = new WeakMap();
function worldTris(e) {   /* the shape's triangles in world space: 9 numbers each, then its y range, its x and z range and the x and z of its normal */
  let t = TRIS.get(e); if (t) return t; const s = SHAPE.get(e); if (!s || !s.geo.attributes.position) return null; const P = s.geo.attributes.position, I = s.geo.index, n = I ? I.count / 3 : P.count / 3;
  t = new Float32Array(n * 17); const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), u = new THREE.Vector3(), w = new THREE.Vector3();
  for (let i = 0; i < n; i++) { const ia = I ? I.getX(i * 3) : i * 3, ib = I ? I.getX(i * 3 + 1) : i * 3 + 1, ic = I ? I.getX(i * 3 + 2) : i * 3 + 2;
    a.fromBufferAttribute(P, ia).applyMatrix4(s.mw); b.fromBufferAttribute(P, ib).applyMatrix4(s.mw); c.fromBufferAttribute(P, ic).applyMatrix4(s.mw); u.subVectors(b, a).cross(w.subVectors(c, a));
    t.set([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, Math.min(a.y, b.y, c.y), Math.max(a.y, b.y, c.y), Math.min(a.x, b.x, c.x), Math.max(a.x, b.x, c.x), Math.min(a.z, b.z, c.z), Math.max(a.z, b.z, c.z), u.x, u.z], i * 17); }
  TRIS.set(e, t); return t;
}
const segDist = (px, pz, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz, k = L > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / L)) : 0; return Math.hypot(px - ax - dx * k, pz - az - dz * k); };
function bodyDepth(t, px, pz, y0, y1, r) {   /* how many slices of the cylinder at (px, pz) from y0 to y1 a shape's triangles cut more than 3 cm into, and the worst depth */
  const keep = []; for (let i = 0; i < t.length; i += 17) { if (t[i + 10] < y0 || t[i + 9] > y1) continue; const nearX = t[i + 11] <= px + r && t[i + 12] >= px - r, nearZ = t[i + 13] <= pz + r && t[i + 14] >= pz - r; if ((nearX && nearZ) || (t[i + 13] <= pz && t[i + 14] >= pz) || (t[i + 11] <= px && t[i + 12] >= px)) keep.push(i); }
  if (!keep.length) return { hits: 0, worst: 0, inside: false }; let hits = 0, worst = 0, enclosed = false; const q = [0, 0, 0, 0];
  for (let y = y0; y <= y1 + 1e-6; y += 0.12) { let near = 1e9; const W = [0, 0, 0, 0];
    for (const i of keep) { if (t[i + 9] > y || t[i + 10] < y) continue; let m = 0;
      for (const [j, k] of [[0, 3], [3, 6], [6, 0]]) { const ay = t[i + j + 1], by = t[i + k + 1]; if ((ay > y) === (by > y)) continue; const f = (y - ay) / (by - ay); q[m * 2] = t[i + j] + (t[i + k] - t[i + j]) * f; q[m * 2 + 1] = t[i + j + 2] + (t[i + k + 2] - t[i + j + 2]) * f; if (++m === 2) break; }
      if (m < 2) continue; const [ax, az, bx, bz] = q, nx = t[i + 15], nz = t[i + 16]; near = Math.min(near, segDist(px, pz, ax, az, bx, bz));
      if ((az > pz) !== (bz > pz)) { const xi = ax + (pz - az) / (bz - az) * (bx - ax); if (xi > px) W[0] += Math.sign(nx); else W[1] -= Math.sign(nx); }
      if ((ax > px) !== (bx > px)) { const zi = az + (px - ax) / (bx - ax) * (bz - az); if (zi > pz) W[2] += Math.sign(nz); else W[3] -= Math.sign(nz); } }
    const inside = W[0] !== 0 && W.every((v) => v === W[0]), d = inside ? r + (near < 1e8 ? near : 0) : r - near; if (inside) enclosed = true;
    if (d > 0.03) { hits++; worst = Math.max(worst, d); } }
  return { hits, worst, inside: enclosed };
}
/* standing inside a shape's outline at shin height (y): between the buttress roots of a big tree, among the legs of a stool or a frame. Nothing cuts the body,
   but from almost every side the person looks as if they are inside the thing (found by eye in Nanny Town: a girl standing between the cotton tree's roots).
   The outline is the convex hull of the shape's own cut line at that height; the person's middle must be more than `margin` inside it.
   A vehicle or room drawn as one shape, that people stand inside on purpose (a locomotive's cab), sets userData.hollow on its group and is left out of this test. */
function outlineHas(t, px, pz, y, margin) {
  const pts = [], q = [0, 0, 0, 0]; for (let i = 0; i < t.length; i += 17) { if (t[i + 9] > y || t[i + 10] < y) continue; let m = 0;
    for (const [j, k] of [[0, 3], [3, 6], [6, 0]]) { const ay = t[i + j + 1], by = t[i + k + 1]; if ((ay > y) === (by > y)) continue; const f = (y - ay) / (by - ay); q[m * 2] = t[i + j] + (t[i + k] - t[i + j]) * f; q[m * 2 + 1] = t[i + j + 2] + (t[i + k + 2] - t[i + j + 2]) * f; if (++m === 2) break; }
    if (m === 2) pts.push([q[0], q[1]], [q[2], q[3]]); }
  if (pts.length < 6) return false; pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], hi = [];
  for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length > 1 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const H = lo.slice(0, -1).concat(hi.slice(0, -1)); if (H.length < 3) return false;
  for (let i = 0; i < H.length; i++) { const a = H[i], b = H[(i + 1) % H.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; if (((b[0] - a[0]) * (pz - a[1]) - (b[1] - a[1]) * (px - a[0])) / L < margin) return false; }   /* counter-clockwise hull: inside is to the left of every edge */
  return true;
}
export function auditBodies(snap, people, { skip = null } = {}) {
  const out = [], sz = new THREE.Vector3(), cell = new Map(), key = (x, z) => ((x | 0) + 5000) * 20000 + ((z | 0) + 5000), C = 2, seen = new Set();
  snap.forEach((e, i) => { if (e.skinned || e.unlit || e.flame || e.card || FLAT.has(e.geo) || !SHAPE.has(e)) return; e.b.getSize(sz); if (sz.x > 40 || sz.z > 40 || Math.max(sz.x, sz.y, sz.z) < 0.08 || (Math.max(sz.x, sz.z) < 0.12 && sz.y < 1.2)) return; if (skip && skip(e)) return;   /* flower stalks and grass blades (under 12 cm across and 1.2 m tall) are walked through */
    for (let x = Math.floor(e.b.min.x / C); x <= Math.floor(e.b.max.x / C); x++) for (let z = Math.floor(e.b.min.z / C); z <= Math.floor(e.b.max.z / C); z++) { const k = key(x, z); (cell.get(k) || cell.set(k, []).get(k)).push(i); } });
  for (const p of people) { const g = p.ground || 0, h = p.h || 1.6, r = p.r || 0.18, y0 = g + 0.1, y1 = g + h * 0.92, list = cell.get(key(Math.floor(p.x / C), Math.floor(p.z / C))); if (!list) continue;
    for (const i of list) { const e = snap[i], tag = (p.key || p.id) + '|' + e.top; if (seen.has(tag) || e.b.max.y < y0 || e.b.min.y > y1 || e.b.max.x < p.x - r || e.b.min.x > p.x + r || e.b.max.z < p.z - r || e.b.min.z > p.z + r) continue;
      const t = worldTris(e); if (!t) continue; const d = bodyDepth(t, p.x, p.z, y0, y1, r); if (d.hits < 2) { if (!e.hollow && outlineHas(t, p.x, p.z, g + 0.25, 0.05)) d.among = true; else continue; } seen.add(tag);
      const c = e.b.getCenter(sz), what = (e.name || e.geo.replace('Geometry', '').toLowerCase()) + (e.col ? ' ' + e.col : '') + (e.inst ? ' (one of many drawn at once)' : '');
      out.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) ${p.what || 'stands'} ` + (d.among ? `inside the outline of a ${what} at (${c.x.toFixed(1)},${c.z.toFixed(1)}), between its roots or legs` : `${d.inside ? 'inside' : 'cut by'} a ${what} at (${c.x.toFixed(1)},${c.z.toFixed(1)}), ${(d.worst * 100).toFixed(0)} cm deep`)); } }
  return out;
}
/* the spots auditPlace checks for bodies: where each standing person stands (not people who sit: auditSeated judges them), every 30 cm along a walker's loop,
   and every 30 cm along each route in place.routes ([{ id, pts, loop, what, h, r }]: followers, leaders, people sent somewhere). Heights come from place.groundAt where given. */
export function routeSpots(id, pts, { loop = false, step = 0.3, ground = null, h, r, what = 'walks' } = {}) {
  const out = []; for (let i = 0; i < pts.length - (loop ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step));
    for (let k = 0; k < n; k++) { const x = a[0] + (b[0] - a[0]) * k / n, z = a[1] + (b[1] - a[1]) * k / n; out.push({ id, x, z, ground: ground ? ground(x, z) : 0, h, r, what }); } }
  if (!loop && pts.length) { const e = pts[pts.length - 1]; out.push({ id, x: e[0], z: e[1], ground: ground ? ground(e[0], e[1]) : 0, h, r, what }); }
  return out;
}
function bodySpots(place) {
  const gAt = place.groundAt || null, out = [];
  for (const p of place.npcs) { if (isSeated(p.anim)) continue; out.push({ id: p.id, key: p.id + '@' + p.x.toFixed(1) + ',' + p.z.toFixed(1), x: p.x, z: p.z, ground: p.ground || 0, h: p.h, r: p.r });   /* key: two people with the same body name are reported apart */
    if (p.path && p.path.length > 1) out.push(...routeSpots(p.id, p.path, { loop: true, ground: gAt && !p.fixedGround ? gAt : () => p.ground || 0, h: p.h, r: p.r })); }
  for (const R of place.routes || []) out.push(...routeSpots(R.id, R.pts, { loop: !!R.loop, ground: gAt || (() => R.ground || 0), h: R.h, r: R.r, what: R.what || 'walks' }));
  return out;
}

/* rest: a small round thing that should stand on something (a pot, a jar, a bowl, a bucket, a gourd, a plant pot, a barrel, a lamp globe) but touches nothing that holds it.
   The float check above cannot see this: it joins two meshes whose boxes come within 10 cm, and anything whose box overlaps the ground's box, so a pot in the air
   just past the edge of a stage, or over a fire between two poles, counts as touching them. Here each such thing must sit on the ground, or really touch something
   solid that reaches down to its lower part (a table, a stool, a shelf, the stones of a fire), be fixed at its top to a bar or bracket, or hang from a thin hook,
   chain or rope that comes down into its top. Only things that stand are checked: upright cylinders and lathe shapes, and squashed balls (an iron pot, a gourd). Touching is tested with each mesh's own box turned with the mesh, not the world box, so a leaning pole does not count
   for the space beside it. groundAt(x, z) gives the ground height for land with hills (default 0). Flames and see-through glows hold nothing up. */
const VESSEL = new Set(['CylinderGeometry', 'LatheGeometry', 'SphereGeometry']);
function shapeOf(e) { const s = SHAPE.get(e); if (!s) return null; if (!s.inv) { if (!s.geo.boundingBox) s.geo.computeBoundingBox(); s.inv = s.mw.clone().invert(); s.k = Math.cbrt(Math.abs(s.mw.determinant())) || 1; } return s; }
function worldPoints(e, max = 300) { const s = shapeOf(e), out = []; if (!s || !s.geo.attributes.position) return out; const p = s.geo.attributes.position, step = Math.max(1, Math.floor(p.count / max)); for (let i = 0; i < p.count; i += step) out.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(s.mw)); return out; }
const inShape = (e, pts, tol) => { const s = shapeOf(e); if (!s) return false; const bb = s.geo.boundingBox, t = tol / s.k, v = new THREE.Vector3(); return pts.some((p) => { v.copy(p).applyMatrix4(s.inv); return v.x >= bb.min.x - t && v.x <= bb.max.x + t && v.y >= bb.min.y - t && v.y <= bb.max.y + t && v.z >= bb.min.z - t && v.z <= bb.max.z + t; }); };
export function auditRest(snap, groundAt = null) {
  const out = [], sz = snap.map((m) => m.b.getSize(new THREE.Vector3()));
  snap.forEach((m, i) => {
    const s = sz[i], w = Math.max(s.x, s.z), sh = shapeOf(m); if (!VESSEL.has(m.geo) || m.unlit || !sh) return;
    const e = sh.mw.elements, bb = sh.geo.boundingBox, lx = (bb.max.x - bb.min.x) * Math.hypot(e[0], e[1], e[2]), ly = (bb.max.y - bb.min.y) * Math.hypot(e[4], e[5], e[6]), lz = (bb.max.z - bb.min.z) * Math.hypot(e[8], e[9], e[10]);
    if (Math.min(lx, lz) < 0.06 || Math.max(lx, lz) > 1.0 || ly < 0.03 || ly > 1.2) return;   /* its own size, not its box in the world: thin sticks and poles are not things that stand on a foot */
    if (m.geo === 'SphereGeometry' ? ly > 0.97 * Math.max(lx, lz) : Math.abs(e[5]) / Math.hypot(e[4], e[5], e[6]) < 0.9) return;   /* a pot stands upright; a ball (fruit, a knob) or a lying wheel or log is another matter: only squashed balls (pots, gourds) and upright cylinders are checked */
    const cx = (m.b.min.x + m.b.max.x) / 2, cz = (m.b.min.z + m.b.max.z) / 2, y0 = m.b.min.y, g = groundAt ? groundAt(cx, cz) : 0;
    if (y0 <= g + 0.03 || y0 < g - 0.3) return;   /* on the ground (or sunk well into it) */
    const near = m.b.clone().expandByScalar(0.02), mine = worldPoints(m);
    /* touched by something solid that reaches down to its lower part */
    const touches = (o) => o.b.intersectsBox(near) && (inShape(o, mine, 0.01) || inShape(m, worldPoints(o, 400), 0.01));
    if (snap.some((o, j) => j !== i && !o.flame && sz[j].x <= 40 && sz[j].z <= 40 && o.b.min.y < y0 + s.y * 0.3 && touches(o))) return;
    /* fixed at its top to a bar or a bracket (a tap's spout under its arm, a lamp under its bracket) */
    if (snap.some((o, j) => j !== i && !o.flame && (o.geo === 'BoxGeometry' || o.geo === 'CylinderGeometry') && sz[j].x <= 40 && sz[j].z <= 40 && o.b.min.y >= y0 + s.y * 0.3 && touches(o))) return;
    /* hung: a thin piece (a hook, a chain, a rope) that ends inside its top part, near its middle */
    if (snap.some((o, j) => j !== i && Math.min(sz[j].x, sz[j].z) < 0.05 && o.b.min.y <= m.b.max.y + 0.02 && o.b.min.y >= y0 + s.y * 0.3 && o.b.max.y > m.b.max.y && Math.abs((o.b.min.x + o.b.max.x) / 2 - cx) < s.x * 0.3 && Math.abs((o.b.min.z + o.b.max.z) / 2 - cz) < s.z * 0.3)) return;
    out.push(`rest@(${cx.toFixed(2)},${y0.toFixed(2)},${cz.toFixed(2)}) a ${m.geo} ${w.toFixed(2)} wide touches nothing that holds it up (${(y0 - g).toFixed(2)} m above the ground), ${m.mat} ${m.col || ''} ${s.y.toFixed(2)} tall`);
  });
  return out;
}

/* Leafy shapes (bushes, tree crowns, flowers: icosahedra, spheres, dodecahedra, cones) that cross a wall and show on both sides of it.
   A wall here is a straight box at least 1 m tall standing on the ground, under 0.5 m thick and over 1.5 m long, lined up with the x or z axis. */
const LEAFY = new Set(['IcosahedronGeometry', 'SphereGeometry', 'DodecahedronGeometry', 'OctahedronGeometry', 'ConeGeometry']);
export function auditThrough(snap) {
  const V = new THREE.Vector3(), walls = [], plants = [], out = [];
  for (const m of snap) { const s = m.b.getSize(V); if (m.geo === 'BoxGeometry' && s.y >= 1 && m.b.min.y <= 0.3) { const thinX = s.x < 0.5 && s.z > 1.5, thinZ = s.z < 0.5 && s.x > 1.5; if (thinX || thinZ) walls.push({ b: m.b, ax: thinX ? 'x' : 'z' }); } else if (LEAFY.has(m.geo) && Math.max(s.x, s.y, s.z) < 8) plants.push(m); }
  for (const p of plants) for (const w of walls) { const a = w.ax, o = a === 'x' ? 'z' : 'x', pb = p.b, wb = w.b;
    if (pb.min[a] < wb.min[a] - 0.02 && pb.max[a] > wb.max[a] + 0.02 && pb.max[o] > wb.min[o] && pb.min[o] < wb.max[o] && pb.min.y < wb.max.y - 0.05 && pb.max.y > wb.min.y) {
      const c = pb.getCenter(V); out.push(`a ${p.geo.replace('Geometry', '').toLowerCase()} at (${c.x.toFixed(1)}, ${c.y.toFixed(1)}, ${c.z.toFixed(1)}) pokes through a wall`); break; } }
  return out;
}

/* Held items. body: the character's root Object3D, already posed (call the mixer's update first). items: [{ obj, bone, label }] where obj is the carried thing
   (already parented to the bone) and bone is the Mixamo bone name without the "mixamorig" prefix, for example "RightHand" or "Head".
   Reports a problem when the item is more than 12 cm from that bone, when it is tipped far from upright, or when any part of it is inside the torso, a leg or the head. */
export function auditHeld(id, body, items) {
  body.updateMatrixWorld(true); const P = (n) => { const b = body.getObjectByName('mixamorig' + n); return b ? b.getWorldPosition(new THREE.Vector3()) : null; }, sc = body.getWorldScale(new THREE.Vector3()).x || 1, out = [];
  const seg = (a, b, r, name) => { const A = P(a), B = P(b); return A && B ? { A, B, r: r * sc, name } : null; };
  const segs = [seg('Hips', 'Spine2', 0.2, 'torso'), seg('Spine2', 'Neck', 0.18, 'chest'), seg('LeftUpLeg', 'LeftLeg', 0.11, 'left thigh'), seg('RightUpLeg', 'RightLeg', 0.11, 'right thigh'), seg('LeftLeg', 'LeftFoot', 0.08, 'left shin'), seg('RightLeg', 'RightFoot', 0.08, 'right shin'), seg('Neck', 'Head', 0.1, 'neck'), seg('LeftArm', 'LeftForeArm', 0.06, 'left arm'), seg('RightArm', 'RightForeArm', 0.06, 'right arm')].filter(Boolean);
  let wide = false; body.traverse((o) => { if (o.isMesh && o.visible && /^(CoatSkirt|Skirt|SkirtSeat|JacketSkirt|Apron)/.test(o.name)) wide = true; });   /* a coat skirt or a skirt stands well out from the legs: held things must clear it too */
  if (wide) { const H = P('Hips'), LK = P('LeftLeg'), RK = P('RightLeg'); if (H && LK && RK) segs.push({ A: H, B: LK.clone().add(RK).multiplyScalar(0.5), r: 0.27 * sc, name: 'coat skirt' }); }
  const dist = (p, A, B) => { const ab = B.clone().sub(A), t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / (ab.lengthSq() || 1))); return p.distanceTo(A.clone().addScaledVector(ab, t)); };
  for (const it of items) {
    const box = new THREE.Box3().setFromObject(it.obj), hand = P(it.bone), name = id + ' ' + (it.label || 'item') + ' at ' + it.bone; if (!hand) continue;
    if(it.obj.userData.gripHandle){const handle=new THREE.Vector3().fromArray(it.obj.userData.gripHandle);it.obj.localToWorld(handle);const side=it.bone.startsWith('Left')?'Left':'Right',knuckle=P(side+'HandMiddle1'),tip=P(side+'HandMiddle3'),palm=knuckle&&tip?knuckle.lerp(tip,.5):hand;if(handle.distanceTo(palm)>.035*sc)out.push(name+' handle is separated from the closed fingers');}
    const near = box.clampPoint(hand, new THREE.Vector3()).distanceTo(hand); if (near > 0.12) out.push(name + ' is ' + (near * 100).toFixed(0) + ' cm from the hand');
    const up = new THREE.Vector3(0, 1, 0).transformDirection(it.obj.matrixWorld); if (it.bone !== 'Head' || true) { if (up.y < 0.6) out.push(name + ' is tipped (up is ' + up.y.toFixed(2) + ')'); }
    const pts = []; it.obj.updateMatrixWorld(true); it.obj.traverse((o) => { if (!o.isMesh || !o.geometry.attributes.position) return; const a = o.geometry.attributes.position, step = Math.max(1, Math.floor(a.count / 120)); for (let i = 0; i < a.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld)); });   /* the item's real surface, not its box */
    const hit = new Set(); for (const p of pts) for (const sg of segs) { if (it.bone === 'Head' && (sg.name === 'neck' || sg.name === 'chest')) continue; if (dist(p, sg.A, sg.B) < sg.r) hit.add(sg.name); }
    if (hit.size) out.push(name + ' cuts into the ' + [...hit].join(', '));
  }
  return out;
}

/* People: npcs [{ id, x, z, ground, anim, path }]. Standing people need 0.65 m between them, seated people 0.4 m. A walking person's loop (path) is sampled
   every half metre and checked against everyone who stands still. start {x, z} is where the player appears. */
export function auditPeople(npcs, start) {
  const out = [], sitting = (n) => isSeated(n.anim), spots = (n) => { if (!n.path || n.path.length < 2) return [[n.x, n.z]]; const pts = []; for (let i = 0; i < n.path.length; i++) { const a = n.path[i], b = n.path[(i + 1) % n.path.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(len / 0.5)); for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return pts; };
  for (let i = 0; i < npcs.length; i++) for (let j = i + 1; j < npcs.length; j++) { const a = npcs[i], b = npcs[j]; if (Math.abs((a.ground || 0) - (b.ground || 0)) > 0.3) continue; if ((a.with && a.with === b.id) || (b.with && b.with === a.id)) continue;   /* a pair placed together on purpose (an arm round a shoulder, a hand in a hand: n.with names the other) */ const need = sitting(a) && sitting(b) ? 0.4 : 0.65; const moving = a.path || b.path; let worst = 1e9; if (!moving) worst = Math.hypot(a.x - b.x, a.z - b.z); else { const A = a.path ? spots(a) : [[a.x, a.z]], B = b.path ? spots(b) : [[b.x, b.z]]; if (a.path && b.path) continue; for (const p of A) for (const q of B) worst = Math.min(worst, Math.hypot(p[0] - q[0], p[1] - q[1])); } if (worst < need) out.push(`${a.id} and ${b.id} are ${(worst * 100).toFixed(0)} cm apart${moving ? ' (along a walk)' : ''} at (${a.x.toFixed(1)},${a.z.toFixed(1)})`); }
  if (start) for (const n of npcs) if (!sitting(n)) for (const p of spots(n)) if (Math.hypot(p[0] - start.x, p[1] - start.z) < 1.1 && !(n.ground > 0)) { out.push(`${n.id} stands on the player's start at (${p[0].toFixed(1)},${p[1].toFixed(1)})`); break; }
  return out;
}



/* Hanging plants: a clump of leaves or flowers (a loose leafy shape: bougainvillea over a wall, a bush top, a hanging basket) high above the ground that touches
   nothing. The float check above forgives gaps of up to 20 cm, which is right for buildings but not for a bush: Eventide's bougainvillea hung 13 to 38 cm behind
   its wall, in the air, with nothing under it (November 2026). Clumps that touch each other (within 3 cm) count as one plant; a plant is held up when one of its
   clumps reaches the ground or touches a solid (a wall, a stem, a trellis) within 3 cm. Returns lines in words; expect none. */
export function auditHanging(snap, groundAt = null) {
  const leaf = snap.filter((m) => m.loose && !m.inst && LEAFY.has(m.geo) && !m.unlit && !m.card), out = []; if (!leaf.length) return out;
  const par = leaf.map((_, i) => i), find = (i) => { while (par[i] !== i) i = par[i] = par[par[i]]; return i; }, ex = leaf.map((m) => m.b.clone().expandByScalar(0.03));
  for (let a = 0; a < leaf.length; a++) for (let b = a + 1; b < leaf.length; b++) if (ex[a].intersectsBox(leaf[b].b)) par[find(a)] = find(b);
  const held = new Set(), solids = snap.filter((m) => !LEAFY.has(m.geo) && !m.unlit && !m.card && !m.flame && m.b.getSize(new THREE.Vector3()).y > 0.05);
  leaf.forEach((m, i) => { const c = m.b.getCenter(new THREE.Vector3()), g = groundAt ? groundAt(c.x, c.z) : 0; if (m.b.min.y <= g + 0.05 || solids.some((o) => o.b.intersectsBox(ex[i]))) held.add(find(i)); });
  const seen = new Set(); leaf.forEach((m, i) => { const r = find(i); if (held.has(r) || seen.has(r)) return; seen.add(r); const c = m.b.getCenter(new THREE.Vector3()); out.push(`hang@(${c.x.toFixed(1)},${c.y.toFixed(1)},${c.z.toFixed(1)}) a clump of leaves (${m.geo.replace('Geometry', '').toLowerCase()} ${m.col}) ${(m.b.min.y).toFixed(2)} m up touches nothing that holds it`); });
  return out;
}

/* Vehicles: a bus, a cart, a truck or a train that moves must never pass through a person or the player (Eventide, November 2026: "a bus drove through granny
   on the street"). Every vehicle's body is swept along its whole path, as a box of half width `half` and half length `len` (metres) that turns with the path.
   vehicles: [{ id, path: [[x, z], ...], half, len, loop }]   people: [{ id, x, z, path }] who are there while it moves (a walker's whole route counts)
   start: the player's spot while it moves.   walls: walking walls [x0, z0, x1, z1] it must not drive through (a parked car, a wall).
   A fault is a person or the start within `safe` metres of the side of the swept body (1 m by default: a grown-up stands well back from a passing bus), or a
   walking wall the body passes through. A vehicle that stops and waits for people (as Eventide's bus does) still has to have a clear road here: the audit
   checks where people stand, not whether the driver is kind. Returns lines in words; expect none. */
export function auditVehicles(vehicles, people, { start = null, walls = [], safe = 1.0 } = {}) {
  const out = [];
  for (const V of vehicles || []) { const P = V.path, half = V.half || 1, len = V.len || 2; if (!P || P.length < 2) continue; const segs = [];
    for (let i = 0; i < P.length - (V.loop ? 0 : 1); i++) { const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6, ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, first = i === 0 && !V.loop, last = i === P.length - 2 && !V.loop;
      segs.push({ ax: a[0] - (first ? ux * len : 0), az: a[1] - (first ? uz * len : 0), L: L + (first ? len : 0) + (last ? len : 0), ux, uz }); }   /* the body reaches half its length past each end of the path */
    const gap = (x, z) => { let best = 1e9; for (const s of segs) { const dx = x - s.ax, dz = z - s.az, along = dx * s.ux + dz * s.uz, side = Math.abs(dx * s.uz - dz * s.ux), o = along < 0 ? -along : along > s.L ? along - s.L : 0; best = Math.min(best, Math.hypot(o, Math.max(0, side - half))); } return best; };   /* metres from the side of the swept body (0: inside it) */
    const spotsOf = (p) => { if (!p.path || p.path.length < 2) return [[p.x, p.z]]; const pts = []; for (let i = 0; i < p.path.length - 1; i++) { const a = p.path[i], b = p.path[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.3)); for (let k = 0; k <= n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return pts; };
    for (const p of people || []) { let worst = 1e9, at = null; for (const [x, z] of spotsOf(p)) { const d = gap(x, z); if (d < worst) { worst = d; at = [x, z]; } } if (worst < safe) out.push(`${V.id} passes ${worst <= 0 ? 'through' : (worst * 100).toFixed(0) + ' cm from'} ${p.id}${p.path ? ' (along a walk)' : ''} at (${at[0].toFixed(1)},${at[1].toFixed(1)}): people must stand at least ${(safe * 100).toFixed(0)} cm from its side`); }
    if (start) { const d = gap(start.x, start.z); if (d < safe) out.push(`${V.id} passes ${d <= 0 ? 'through' : (d * 100).toFixed(0) + ' cm from'} the player's spot at (${start.x.toFixed(1)},${start.z.toFixed(1)})`); }
    for (const w of walls) { let hit = false; for (const s of segs) { for (let t = 0; t <= s.L && !hit; t += 0.25) for (let q = -half; q <= half + 1e-6 && !hit; q += half / 3) { const x = s.ax + s.ux * t + s.uz * q, z = s.az + s.uz * t - s.ux * q; if (x > w[0] + 0.02 && x < w[2] - 0.02 && z > w[1] + 0.02 && z < w[3] - 0.02) hit = true; } if (hit) break; }
      if (hit) out.push(`${V.id} drives through a walking wall at (${((w[0] + w[2]) / 2).toFixed(1)},${((w[1] + w[3]) / 2).toFixed(1)}), ${(w[2] - w[0]).toFixed(1)} by ${(w[3] - w[1]).toFixed(1)} m`); }
  }
  return out;
}

/* Garments: a small piece of clothing left showing when the garment it belongs to is hidden floats in the air (Eventide, November 2026: waistcoat buttons,
   a hat band or a belt buckle with no waistcoat, hat or belt under it). auditGarments(id, body) checks a body as it will be drawn:
     - by name: a piece whose garment is in the body but hidden (WaistcoatButtons and Waistcoat, HatBand and Hat, CapBand and Cap, TopHatBand and TopHat,
       JButtons and Lapels and Jacket, Buckle and Belt, WrapKnot and Wrap, Placket, Pocket, Buttons and Collar and Shirt);
     - by shape: a small visible piece (under 45 cm across) that hardly touches any other visible piece (under 3 in 100 of its points within 1.5 cm), in the pose it stands in.
   Returns lines in words; expect none. */
const PIECE_OF = [[/^WaistcoatButtons$/, 'Waistcoat'], [/^(Hat)Band$/, 'Hat'], [/^CapBand$/, 'Cap'], [/^TopHatBand$/, 'TopHat'], [/^(JButtons|Lapels)$/, 'Jacket'], [/^Buckle$/, 'Belt'], [/^WrapKnot$/, 'Wrap'], [/^(Placket|Pocket|Buttons|Collar)$/, 'Shirt']];
export function auditGarments(id, body) {
  const out = [], all = [], shown = (o) => { for (let q = o; q && q !== body.parent; q = q.parent) if (!q.visible) return false; return true; };
  body.updateMatrixWorld(true); body.traverse((o) => { if (o.isMesh && (o.isSkinnedMesh || o.userData.garment)) all.push({ o, mesh: o.name, mat: (o.material && o.material.name) || '', on: shown(o) }); });
  const isPiece = (n) => PIECE_OF.some(([r]) => r.test(n));
  for (const p of all) { if (!p.on) continue; const nm = isPiece(p.mesh) ? p.mesh : isPiece(p.mat) ? p.mat : null; if (!nm) continue; const g = PIECE_OF.find(([r]) => r.test(nm))[1];
    const owners = all.filter((q) => q !== p && q.mat === g && !isPiece(q.mesh)); if (owners.length && owners.every((q) => !q.on)) out.push(`${id}: ${nm} shows but its ${g} is hidden`); }
  /* by shape: every visible piece is posed (skinned on the CPU) into the body's own frame; a small piece floats when hardly any of it (under 3 in 100 of its points: a cap touches only at its rim, a stray button strip not at all) lies within 1.5 cm of the surface of another piece */
  const v = new THREE.Vector3(), inv = new THREE.Matrix4().copy(body.matrixWorld).invert(), sc = body.getWorldScale(new THREE.Vector3()).x || 1;
  const on = all.filter((p) => p.on && p.o.geometry.index && !/low-poly|Eye|Teeth|Tongue|Lash|Brow/i.test(p.mesh + ' ' + p.mat));
  for (const p of on) { const o = p.o, n = o.geometry.attributes.position.count, pos = new Float32Array(n * 3); if (o.isSkinnedMesh) o.skeleton.update(); for (let i = 0; i < n; i++) { if (o.isSkinnedMesh) o.getVertexPosition(i, v); else v.fromBufferAttribute(o.geometry.attributes.position, i); v.applyMatrix4(o.matrixWorld).applyMatrix4(inv); pos.set([v.x, v.y, v.z], i * 3); } p.pos = pos; p.idx = o.geometry.index.array; }
  const lim = 0.015 / sc, q = [0, 0, 0];
  for (const p of on) { const n = p.pos.length / 3; let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p.pos[i * 3 + k]); hi[k] = Math.max(hi[k], p.pos[i * 3 + k]); }
    if (Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) * sc > 0.45 || n < 4) continue;
    const grids = on.filter((r) => r !== p).map((r) => [r, r.grid || (r.grid = clGrid(r.pos, r.idx, 0.03 / sc))]); let close = 0;
    for (let i = 0; i < n; i++) { q[0] = p.pos[i * 3]; q[1] = p.pos[i * 3 + 1]; q[2] = p.pos[i * 3 + 2]; for (const [r, G] of grids) { const h = clNear(q, r.pos, r.idx, G); if (h && Math.hypot(h.along, h.side) < lim) { close++; break; } } }
    if (close < Math.max(3, n * 0.03)) out.push(`${id}: ${p.mesh || p.mat} floats: only ${close} of its ${n} points are within 1.5 cm of another piece`); }
  return out;
}


/* Seated people. body: the character's root Object3D, already posed (call the mixer's update first). snap: the list from snapMeshes (taken before merging).
   ground: the floor height under the person. Reports a person who
     - sits too low (the hip joint should be about 12 cm above the seat, scaled by body size; 7 cm lower than that and the seat passes through the thighs),
     - cuts into any other box, such as the back of the seat or an arm (real skinned vertices against the exact box),
     - hangs in the air (hips more than 30 cm above the seat under them, or above the floor with no seat at all),
     - faces the back of a seat (a thin, tall board close in front of them).
   stats (optional array) collects one line per person, for tuning. */
export function auditSeated(id, body, snap, ground = 0, stats) {
  anchorSeat(body); body.updateMatrixWorld(true); const out = [], pts = [], v = new THREE.Vector3(), hb = body.getObjectByName('mixamorigHips'); if (!hb) return out;
  body.traverse((o) => { if (!o.isSkinnedMesh || !o.visible || !o.geometry.attributes.position) return; o.skeleton.update(); const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 500)); for (let i = 0; i < n; i += step) { o.getVertexPosition(i, v); pts.push(v.clone().applyMatrix4(o.matrixWorld)); } });
  if (!pts.length) return out;
  const hips = hb.getWorldPosition(new THREE.Vector3()), box = new THREE.Box3().setFromPoints(pts).expandByScalar(0.1), fwd = new THREE.Vector3(0, 0, 1).transformDirection(body.matrixWorld), seats = snap.filter((m) => m.lb && m.b.intersectsBox(box));
  const flatBox = (m, sz) => sz.y < 0.2 && sz.x > 0.3 && sz.z > 0.3 && sz.x < 8 && sz.z < 8 && m.b.max.y > ground + 0.2, over = (m) => hips.x > m.b.min.x - 0.1 && hips.x < m.b.max.x + 0.1 && hips.z > m.b.min.z - 0.1 && hips.z < m.b.max.z + 0.1;
  const near = snap.filter((m) => m.b.intersectsBox(box)); let under = null;   /* the seat: any solid under the hips whose top is below them (a bench plank, a stool, a rock): the highest one */
  for (const m of near) { const sz = m.b.getSize(new THREE.Vector3()); if (sz.x > 8 || sz.z > 8 || m.b.max.y <= ground + 0.2 || m.b.max.y > hips.y + 0.05 || m.b.max.y < hips.y - 0.6 || !over(m)) continue; if (sz.y > 0.2 && Math.min(sz.x, sz.z) < 0.14) continue; if (!under || m.b.max.y > under.b.max.y) under = m; }
  const q = new THREE.Vector3();
  for (const m of seats) {
    const sz = m.b.getSize(new THREE.Vector3()), upright = Math.min(sz.x, sz.z) < 0.14 && sz.y > 0.35;
    if (m !== under && !(flatBox(m, sz) && sz.y < 0.12 && m.b.max.y < 0.2)) {   /* the seat itself is judged below; a bare floor is not a hazard */
      let n = 0, deep = 0; const thr = Math.min(0.05, 0.4 * Math.min(sz.x, sz.y, sz.z));
      for (const p of pts) { q.copy(p).applyMatrix4(m.inv); const lb = m.lb; if (q.x > lb.min.x && q.x < lb.max.x && q.y > lb.min.y && q.y < lb.max.y && q.z > lb.min.z && q.z < lb.max.z) { const d = Math.min(q.x - lb.min.x, lb.max.x - q.x, q.y - lb.min.y, lb.max.y - q.y, q.z - lb.min.z, lb.max.z - q.z) * m.sc; if (d > thr) { n++; deep = Math.max(deep, d); } } }
      if (n >= Math.max(3, pts.length * 0.01)) out.push(`${id} cuts into a ${sz.x.toFixed(2)}x${sz.y.toFixed(2)}x${sz.z.toFixed(2)} box at y ${m.b.min.y.toFixed(2)} to ${m.b.max.y.toFixed(2)} (up to ${(deep * 100).toFixed(0)} cm deep, ${n} points)`);
    }
    if (upright && (!under || m.b.intersectsBox(under.b.clone().expandByScalar(.09)))) { const c = m.b.getCenter(new THREE.Vector3()), dx = c.x - hips.x, dz = c.z - hips.z, ahead = dx * fwd.x + dz * fwd.z, side = Math.abs(dx * fwd.z - dz * fwd.x); if (ahead > 0.2 && ahead < 0.9 && side < 0.6 && m.b.min.y < hips.y + 0.3 && m.b.max.y > hips.y + 0.2) out.push(`${id} faces the back of a seat (a board ${(ahead * 100).toFixed(0)} cm ahead at ${c.x.toFixed(2)},${c.z.toFixed(2)})`); }
  }
  /* the seat under the hips: the lowest part of the pelvis may sink a little into a cushion, but not far, and the person must not hover */
  let lowBack = 1e9, lowThigh = 1e9; for (const p of pts) { const dx = p.x - hips.x, dz = p.z - hips.z, ahead = dx * fwd.x + dz * fwd.z, side = Math.abs(dx * fwd.z - dz * fwd.x); if (side > 0.3 || p.y < hips.y - 0.45) continue; if (ahead > -0.25 && ahead < 0.05) lowBack = Math.min(lowBack, p.y); else if (ahead >= 0.05 && ahead < 0.35) lowThigh = Math.min(lowThigh, p.y); }
  const lift = hips.y - (under ? under.b.max.y : ground); if (stats) stats.push(`${id}: hips ${(lift * 100).toFixed(0)} cm above ${under ? 'its seat' : 'the floor'}, lowest behind ${((hips.y - lowBack) * 100).toFixed(0)} and thigh ${((hips.y - lowThigh) * 100).toFixed(0)} cm under the hips, scale ${body.scale.x.toFixed(2)}, feet ${((Math.min(...pts.map((p) => p.y)) - ground) * 100).toFixed(0)} cm above the floor`);
  const want = 0.12 * (body.scale.x || 1);   /* the hip joint of a seated person is about 12 cm above the seat (the pelvis is below it) */
  if (under && lift < want - 0.07) out.push(`${id} sits ${((want - lift) * 100).toFixed(0)} cm too low: the seat passes through the pelvis and thighs`);
  else if (under && lift > 0.3) out.push(`${id} hangs ${(lift * 100).toFixed(0)} cm above its seat`);
  else if (!under && lift > 0.3 && lift < 0.7) out.push(`${id} sits on nothing (hips ${(lift * 100).toFixed(0)} cm above the floor)`);
  return out;
}

/* Walking: step one person through whole loops of the walk they are playing (their controller's current clip) while moving them at ground speed v, the way a game does,
   and measure what the eye would see. Give `after(body)` if the game does something after each animation step (gripTick). paced=false leaves the clip speed alone, to measure "before".
   Returns { stride, pace, slide, sink, float, pop, bob, rise, lines } (bob: the most the body rises or falls in one step, rise: how far it goes up and down in all, both in cm):
     stride  metres of ground one loop covers on this body          pace   the clip speed that was used
     slide   how far the feet slip over the ground in one loop (cm): the planted foot's net travel. A good walk is under 3 cm (or 3 in every 100 of a long running stride).
     sink / float  the lowest and highest that the lowest point of the shoes gets, against the ground (cm). The sole rests 1 cm into the ground on purpose; a heel may dip to 3 cm for a frame or two as it lands, because the body is eased up, not jerked.
     pop     the biggest jump of a foot in one step, as a multiple of a usual step: a loop that does not join, or a body that jerks up and down, shows here
   lines lists the faults in words; an empty list means the walk is clean. */
export function auditWalk(id, body, v, { after = null, paced = true, loops = 2, ground = body.userData.ground || 0, heldItems = null } = {}) {
  const ctl = body.userData.anim, out = { stride: 0, pace: 1, slide: 0, sink: 0, float: 0, pop: 0, lines: [] }; if (!ctl) return out;
  const act = ctl.cur, clip = act.getClip(), B = (n) => body.getObjectByName('mixamorig' + n), feet = [B('LeftFoot'), B('RightFoot')], P = new THREE.Vector3(); if (feet.some((f) => !f)) return out;
  out.stride = strideOf(body, clip); act.timeScale = 1; out.pace = paced ? ctl.pace(v) : 1; act.time = 0; ctl.mx.update(0);
  const N = 96, dt = clip.duration / out.pace / N, fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(body.quaternion), x0 = body.position.x, z0 = body.position.z, y0 = body.position.y;
  const shoes = []; body.traverse((o) => { if (o.isSkinnedMesh && o.visible && /Shoes|Sole/.test(o.material.name || '')) shoes.push(o); }); if (!shoes.length) body.traverse((o) => { if (o.isSkinnedMesh && o.visible && /Skin/.test(o.material.name || '')) shoes.push(o); });
  const read = () => { body.updateMatrixWorld(true); return feet.map((f) => { f.getWorldPosition(P); return [P.x * fwd.x + P.z * fwd.z, P.y, P.x * fwd.z - P.z * fwd.x]; }); };
  for (let i = 0; i < 20; i++) groundFeet(body);   /* settle on the ground first */
  const run = /Run/.test(clip.name), hs = []; let prev = read(), slide = 0, lo = 1e9, hi = -1e9, steps = [], prevY = body.position.y, bob = 0, yLo = 1e9, yHi = -1e9; const held = new Set(), log = [];
  for (let i = 0; i < N * loops; i++) {
    body.position.x += fwd.x * v * dt; body.position.z += fwd.z * v * dt; ctl.mx.update(dt); if (after) after(body); groundFeet(body); const now = read();
    const k = prev[0][1] + now[0][1] < prev[1][1] + now[1][1] ? 0 : 1; log.push([now[k][0] - prev[k][0], Math.max(prev[k][1], now[k][1]) - body.position.y]); hs.push(now[0][1] - body.position.y, now[1][1] - body.position.y); yLo = Math.min(yLo, body.position.y); yHi = Math.max(yHi, body.position.y);
    for (const j of [0, 1]) steps.push(Math.hypot(now[j][0] - prev[j][0] - v * dt, now[j][1] - prev[j][1], now[j][2] - prev[j][2]));
    bob = Math.max(bob, Math.abs(body.position.y - prevY)); prevY = body.position.y; prev = now;
    if (i % 8 === 0) { let low = 1e9; for (const o of shoes) { o.skeleton.update(); const n = o.geometry.attributes.position.count; for (let j = 0; j < n; j++) { o.getVertexPosition(j, P).applyMatrix4(o.matrixWorld); if (P.y < low) low = P.y; } } lo = Math.min(lo, low - ground); hi = Math.max(hi, low - ground);
      if (heldItems && heldItems.length) for (const l of auditHeld(id, body, heldItems)) held.add(l.replace(/ is \d+ cm from/, ' is far from')); }
  }
  const hMin = Math.min(...hs), hMax = Math.max(...hs), band = run ? hMin + (hMax - hMin) * 0.2 : 1e9; for (const [d, h] of log) if (h <= band) slide += d;   /* in a run, only a foot that is down can slide */
  out.rise = (yHi - yLo) * 100;
  const sorted = steps.slice().sort((a, b) => a - b), usual = sorted[sorted.length >> 1] || 1e-6;
  out.slide = Math.abs(slide) / loops * 100; out.sink = lo * 100; out.float = hi * 100; out.pop = sorted[sorted.length - 1] / usual; out.bob = bob * 100;
  body.position.set(x0, y0, z0);
  if (out.stride < 0.05) out.lines.push(`${id}: no stride could be measured for ${clip.name}`);
  if (out.slide > Math.max(3, out.stride * 3)) out.lines.push(`${id}: feet slide ${out.slide.toFixed(1)} cm in each loop of ${clip.name} at ${v.toFixed(2)} m/s (stride ${(out.stride * 100).toFixed(0)} cm, clip speed ${out.pace.toFixed(2)})`);
  if (out.sink < -3) out.lines.push(`${id}: shoes sink ${(-out.sink).toFixed(1)} cm into the ground while walking`);
  if (out.float > 2.5) out.lines.push(`${id}: the lower shoe floats ${out.float.toFixed(1)} cm above the ground while walking`);
  if (out.pop > 6) out.lines.push(`${id}: a foot jumps ${out.pop.toFixed(1)} times a usual step (a loop that does not join, or a jerk)`);
  for (const l of held) out.lines.push(l + ' while walking');
  return out;
}

/* Cloth: does an under layer show through the layer that should cover it? (skin through a shirt, a shirt through a waistcoat, hair through a hat, a collar cut by a jacket...)
   auditCloth(id, body, { poses, after }) poses the body ([clip name, how far through the clip 0..1]), works out where every vertex really is (skinning on the CPU), and tests each
   visible piece against each other visible piece. Which piece is the under layer is read from the body itself in its rest shape: a point that starts out just beneath a face
   of another piece is meant to stay beneath it. If most of a piece's nearby points start beneath the other, every nearby point is held to that (so a speck that is already
   through in the rest shape is caught as well). Points tested: each vertex, the middle of each triangle and a point on each edge. A fault is a point more than half a millimetre outside.
   Returns { lines, points, worst }: one line per pose and pair of pieces, with how many points and the worst depth in millimetres. Hidden pieces (another hat, a hidden waistcoat) are ignored. */
const CL_SKIP = /low-poly|Eye|Teeth|Tongue|Lash|Brow/i, CL_REL = new WeakMap();
function clTri(p, P, a, b, c, o) {   /* nearest point of a triangle (corner indices a, b, c into P) to p, written to o */
  const ax = P[a], ay = P[a + 1], az = P[a + 2], abx = P[b] - ax, aby = P[b + 1] - ay, abz = P[b + 2] - az, acx = P[c] - ax, acy = P[c + 1] - ay, acz = P[c + 2] - az, apx = p[0] - ax, apy = p[1] - ay, apz = p[2] - az;
  const d1 = abx * apx + aby * apy + abz * apz, d2 = acx * apx + acy * apy + acz * apz; if (d1 <= 0 && d2 <= 0) { o[0] = ax; o[1] = ay; o[2] = az; return; }
  const bpx = p[0] - P[b], bpy = p[1] - P[b + 1], bpz = p[2] - P[b + 2], d3 = abx * bpx + aby * bpy + abz * bpz, d4 = acx * bpx + acy * bpy + acz * bpz; if (d3 >= 0 && d4 <= d3) { o[0] = P[b]; o[1] = P[b + 1]; o[2] = P[b + 2]; return; }
  const vc = d1 * d4 - d3 * d2; if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); o[0] = ax + abx * v; o[1] = ay + aby * v; o[2] = az + abz * v; return; }
  const cpx = p[0] - P[c], cpy = p[1] - P[c + 1], cpz = p[2] - P[c + 2], d5 = abx * cpx + aby * cpy + abz * cpz, d6 = acx * cpx + acy * cpy + acz * cpz; if (d6 >= 0 && d5 <= d6) { o[0] = P[c]; o[1] = P[c + 1]; o[2] = P[c + 2]; return; }
  const vb = d5 * d2 - d1 * d6; if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); o[0] = ax + acx * w; o[1] = ay + acy * w; o[2] = az + acz * w; return; }
  const va = d3 * d6 - d5 * d4; if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); o[0] = P[b] + (P[c] - P[b]) * w; o[1] = P[b + 1] + (P[c + 1] - P[b + 1]) * w; o[2] = P[b + 2] + (P[c + 2] - P[b + 2]) * w; return; }
  const dn = 1 / (va + vb + vc), v = vb * dn, w = vc * dn; o[0] = ax + abx * v + acx * w; o[1] = ay + aby * v + acy * w; o[2] = az + abz * v + acz * w; }
function clGrid(P, idx, cell) { const g = new Map(), K = (x, y, z) => (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);   /* which triangles pass through each small cube of space (each triangle's box is widened by one cell) */
  for (let t = 0; t < idx.length; t += 3) { const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3, lo = [0, 0, 0], hi = [0, 0, 0]; for (let k = 0; k < 3; k++) { lo[k] = Math.floor(Math.min(P[a + k], P[b + k], P[c + k]) / cell) - 1; hi[k] = Math.floor(Math.max(P[a + k], P[b + k], P[c + k]) / cell) + 1; }
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = K(x, y, z); let l = g.get(k); if (!l) g.set(k, l = []); l.push(t); } }
  return { g, K, cell }; }
const _cq = [0, 0, 0], _cr = { along: 0, side: 0 };
function clNear(p, P, idx, G) {   /* the nearest face of a piece to p: how far p is outside it (along, negative when beneath) and how far off its edge (side). null when nothing is within a cell */
  const l = G.g.get(G.K(Math.floor(p[0] / G.cell), Math.floor(p[1] / G.cell), Math.floor(p[2] / G.cell))); if (!l) return null; let bd = G.cell * G.cell, hit = false;
  for (const t of l) { const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3; clTri(p, P, a, b, c, _cq); const dx = p[0] - _cq[0], dy = p[1] - _cq[1], dz = p[2] - _cq[2], dd = dx * dx + dy * dy + dz * dz; if (dd >= bd) continue;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2]; let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const nl = Math.hypot(nx, ny, nz); if (nl < 1e-12) continue; nx /= nl; ny /= nl; nz /= nl;
    bd = dd; hit = true; _cr.along = dx * nx + dy * ny + dz * nz; _cr.side = Math.hypot(dx - nx * _cr.along, dy - ny * _cr.along, dz - nz * _cr.along); }
  return hit ? _cr : null; }
function clPoint(P, s, i, o) { const a = s[i * 3] * 3, b = s[i * 3 + 1] * 3, c = s[i * 3 + 2] * 3; o[0] = (P[a] + P[b] + P[c]) / 3; o[1] = (P[a + 1] + P[b + 1] + P[c + 1]) / 3; o[2] = (P[a + 2] + P[b + 2] + P[c + 2]) / 3; }
function clParts(body) { const parts = []; body.traverse((o) => { if (!o.isSkinnedMesh || !o.geometry.index || CL_SKIP.test(o.name) || CL_SKIP.test(o.material.name || '')) return; let vis = true; for (let q = o; q && q !== body.parent; q = q.parent) if (!q.visible) vis = false; if (!vis) return;
    const g = o.geometry, n = g.attributes.position.count, idx = g.index.array; let samples = g.userData.clSamples; if (!samples) { samples = new Uint32Array(n * 3 + idx.length * 4); for (let i = 0; i < n; i++) samples[i * 3] = samples[i * 3 + 1] = samples[i * 3 + 2] = i; samples.set(idx, n * 3); let w = n * 3 + idx.length; for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) { const u = idx[t + e], v2 = idx[t + (e + 1) % 3]; samples[w++] = u; samples[w++] = u; samples[w++] = v2; } g.userData.clSamples = samples; }   /* each vertex, the middle of each triangle, and a point a third of the way along each edge */
    let rest = g.userData.clRest; if (!rest) { rest = new Float32Array(n * 3); const v = new THREE.Vector3(), inv = new THREE.Matrix4().copy(body.matrixWorld).invert(), keep = o.skeleton.bones.map((b) => [b.position.clone(), b.quaternion.clone(), b.scale.clone()]); o.skeleton.pose(); body.updateMatrixWorld(true); o.skeleton.update();   /* the rest shape: every bone in the pose the body was built in, in the body's own space; the bones go back to what they were afterwards */
      for (let i = 0; i < n; i++) { o.getVertexPosition(i, v).applyMatrix4(o.matrixWorld).applyMatrix4(inv); rest[i * 3] = v.x; rest[i * 3 + 1] = v.y; rest[i * 3 + 2] = v.z; }
      o.skeleton.bones.forEach((b, k) => { b.position.copy(keep[k][0]); b.quaternion.copy(keep[k][1]); b.scale.copy(keep[k][2]); }); body.updateMatrixWorld(true); g.userData.clRest = rest; }
    parts.push({ o, name: /^(Skin|Sock)$/.test(o.material.name || '') ? (o.material.name === 'Skin' ? 'Body' : 'Sock') : (o.parent && o.parent.name === 'Lining' ? 'Lining' : (o.name || o.material.name)),   /* a Lining in two colours (under the shirt and under the breeches) loads as a group of two meshes */   /* the skin and the socks are named by their material: a body mesh with two materials loads as two meshes with the mesh's own name */ mat: o.material.name || o.name, g, idx, samples, rest, pos: new Float32Array(n * 3) }); }); return parts; }
/* which piece lies over which, innermost first. A piece is only tested as the under layer of a piece that comes later. Names not listed are judged from the rest shape alone. */
/* layers from the skin out. A body-armour vest is worn over the shirt like a waistcoat, and boots are shoes (17 November 2026: 'Vest shows through Shirt' and 'Boots shows through Shoes' were the check reading the layers the wrong way round) */
const CL_ORDER = [/^(Body|Skin)$/, /^(Hair|Bun|Puffs|Plaits|Moustache)/, /^Sock/, /^Shirt$/, /^(Placket|Pocket)/, /^(Collar|Tie|Buttons)/, /^(Breeches|Skirt|SkirtSeat)$/, /^(Belt|Buckle|Sash|Waistband)/, /^(Waistcoat|Vest)/, /^Apron/, /^(Jacket|JacketSkirt|Lapels|JButtons|Coat|CoatSkirt)/, /^(Shoes|Sole|Boots)/, /^(Ribbon|Hat|Cap|TopHat|Bonnet|Wrap|Scarf)/];
const clRank = (n) => CL_ORDER.findIndex((r) => r.test(n));
function clEdge(B) {   /* the rest positions of the vertices on the open edges of a piece (hems, cuffs, necklines) */
  if (B.g.userData.clEdge) return B.g.userData.clEdge; const cnt = new Map(), idx = B.idx, R = B.rest, key = (a, b) => (a < b ? a * 1e6 + b : b * 1e6 + a); for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) { const k = key(idx[t + e], idx[t + (e + 1) % 3]); cnt.set(k, (cnt.get(k) || 0) + 1); }
  const out = [], seen = new Set(); for (const [k, c] of cnt) if (c === 1) for (const v of [Math.floor(k / 1e6), k % 1e6]) if (!seen.has(v)) { seen.add(v); out.push([R[v * 3], R[v * 3 + 1], R[v * 3 + 2]]); }
  return (B.g.userData.clEdge = out); }
function clNeck(A) {   /* vertices of a piece that follow the neck or head bone at all (a shirt's neck ring, a collar): the cloth there is meant to rise out of the jacket */
  if (A.g.userData.clNeck) return A.g.userData.clNeck; const n = A.g.attributes.position.count, si = A.g.attributes.skinIndex, sw = A.g.attributes.skinWeight, bones = A.o.skeleton.bones, out = new Uint8Array(n);
  for (let i = 0; i < n; i++) { let w = 0; for (let k = 0; k < 4; k++) { const b = bones[si.getComponent(i, k)]; if (b && /Neck|Head/.test(b.name)) w += sw.getComponent(i, k); } if (w > 0.2) out[i] = 1; }
  return (A.g.userData.clNeck = out); }
function clHands(A, upper) {   /* which vertices of a skinned piece are mostly weighted to an arm, forearm or hand bone */
  const key = 'clHands' + upper; if (A.g.userData[key]) return A.g.userData[key]; const n = A.g.attributes.position.count, si = A.g.attributes.skinIndex, sw = A.g.attributes.skinWeight, bones = A.o.skeleton.bones, out = new Uint8Array(n);
  for (let i = 0; i < n; i++) { let w = 0; for (let k = 0; k < 4; k++) { const b = bones[si.getComponent(i, k)]; if (b && (upper === 'leg' ? /Hand|Arm|(Left|Right)Leg|Foot|Toe/ : upper === 'hand' ? /Hand/ : upper ? /Hand|Arm/ : /Hand|ForeArm/).test(b.name)) w += sw.getComponent(i, k); } if (w > 0.5) out[i] = 1; }
  return (A.g.userData[key] = out); }
function clRelation(A, B) {   /* which sample points of piece A are meant to lie beneath piece B (from the rest shape). Cached per pair of shapes. */
  let m = CL_REL.get(A.g); if (!m) CL_REL.set(A.g, m = new WeakMap()); let r = m.get(B.g); if (r !== undefined) return r;
  const G = B.g.userData.clGrid || (B.g.userData.clGrid = clGrid(B.rest, B.idx, 0.03)), p = [0, 0, 0], near = [], under = [], thin = []; let below = 0;
  const lowB = /^(Breeches|Skirt|SkirtSeat|Apron|JacketSkirt|CoatSkirt|Jacket|Waistcoat)$/.test(B.name), hand = /^(Body|Skin)$/.test(A.name) ? clHands(A, /^Breeches$/.test(B.name) ? 'leg' : lowB) : (lowB && /^(Shirt|Collar|Jacket|Waistcoat)$/.test(A.name) ? clHands(A, true) : null);   /* an arm or a cuff that hangs against a skirt, trousers or a jacket's hem is not under them: the game spreads the arms clear (spreadArms), so arm and cuff points are left out of these pairs */
  let edge = null, arm = null;   /* an arm that comes out of a short sleeve: skin within 3 cm of a sleeve's hem is the arm itself, not skin showing through (and a knee or shin within 4 cm of a skirt's hem is the leg coming out of it) */
  const bodyA = /^(Body|Skin)$/.test(A.name); if (bodyA && /^(Shirt|Jacket|Coat)$/.test(B.name)) arm = clHands(A, true); if (/^Shirt$/.test(A.name) && /^(Collar|Placket|Pocket|Buttons|Tie)$/.test(B.name)) { m.set(B.g, null); return null; }
  if (/^(Hair|Bun|Puffs|Plaits)/.test(A.name) && /Band$/.test(B.name)) { m.set(B.g, null); return null; }
  if (A.name === 'Shirt' && B.name === 'Breeches') { let lo = 1e9, top = -1e9; for (let i = 1; i < A.rest.length; i += 3) lo = Math.min(lo, A.rest[i]); for (let i = 1; i < B.rest.length; i += 3) top = Math.max(top, B.rest[i]); if (lo < top - 0.08) { m.set(B.g, null); return null; } }   /* an untucked shirt (its hem well below the waistband) is worn over the trousers, not under them (Tivoli's 2010 T-shirts, 17 November 2026) */
  if (/^(Hair|Bun|Puffs|Plaits|Locks)/.test(A.name) && /^(Shirt|Collar|Jacket|Coat)$/.test(B.name)) { m.set(B.g, null); return null; }   /* long hair, plaits and locs hang over a shirt or a jacket, never under it: locs lying 3 cm off the back were reported as 'Hair shows through Shirt' (checked by eye from behind and the side, standing and waving, 16 November 2026). Hair under a hat is still tested */
  if (/^(Body|Sock)$/.test(A.name) && /^(Body|Sock)$/.test(B.name)) { m.set(B.g, null); return null; }   /* socks are a part of the skin's own mesh: the two meet edge to edge */   /* a hat band is a ribbon on the crown: hair cannot reach it except through the crown, which is tested */
  if (bodyA && /^(Tie|Buttons|Placket|Pocket|Collar)/.test(B.name)) { m.set(B.g, null); return null; }
  if (/^(Belt|Buckle)$/.test(A.name) && /^(Vest|Waistcoat)$/.test(B.name)) { m.set(B.g, null); return null; }   /* a body-armour vest or waistcoat ending above the belt meets it edge to edge; the belt is never under it */   /* a tie, a front band, a pocket or a collar lies on the shirt, never on bare skin */   /* a shirt seen through its own collar, front band or pocket is the same cloth */
  edge = clEdge(B);
  const neck = /^(Shirt|Collar)$/.test(A.name) && /^(Jacket|Waistcoat|JacketSkirt)$/.test(B.name) ? clNeck(A) : null;
  for (let i = 0; i < A.samples.length / 3; i++) { if ((hand && hand[A.samples[i * 3]]) || (neck && neck[A.samples[i * 3]])) continue; clPoint(A.rest, A.samples, i, p);
    if (edge) { const lim = arm ? (arm[A.samples[i * 3]] ? 0.0009 : 0) : /^(Body|Sock)$/.test(A.name) && /^SkirtSeat$/.test(B.name) ? 0.0049 : /^(Body|Sock)$/.test(A.name) && /^Skirt$/.test(B.name) ? 0.0016 :   /* the seated skirt's last rows lie on a bent knee: skin within 7 cm of its hem is the knee coming out (checked by eye seated and kneeling, 15 November 2026) */ (/^(Shirt|Collar)$/.test(A.name) && /^(Jacket)$/.test(B.name) ? 0.0004 : 0.000144); if (lim && edge.some((e) => (e[0] - p[0]) ** 2 + (e[1] - p[1]) ** 2 + (e[2] - p[2]) ** 2 < lim)) continue; }   /* a point within 12 mm of a cover's open edge (a neckline, a lapel, a hem) is at the opening, where the eye sees the layer beneath anyway */ const h = clNear(p, B.rest, B.idx, G); if (!h || h.side > 0.004 || Math.abs(h.along) > 0.03) continue; near.push(i); if (h.along < 0.003) thin.push(i);   /* a point that already pokes out up to 3 mm in the rest shape is held to the cover too: a speck through the cloth is a fault from the start */ if (h.along < 0) { below++; if (h.along < -0.001) under.push(i); } }
  const ra = clRank(A.name), rb = clRank(B.name), known = ra >= 0 && rb >= 0; if (known && (ra >= rb || (ra === 0 && rb === 1))) { m.set(B.g, null); return null; }   /* skin under hair is not tested: the hair is painted to fade into the skin at its edge */
  r = near.length < 8 ? null : known ? (below >= near.length * 0.5 && !(bodyA && /^(Tie|Buttons|Placket|Pocket|Belt|Buckle|Sash|Collar|Apron)/.test(B.name)) ? thin : under) : below >= near.length * 0.9 ? near : below <= near.length * 0.3 ? null : under;   /* two pieces whose order is known: every point of the under one that lies beneath a face of the cover is held to it, so a speck that is already through in the rest shape is caught too */ if (r && !r.length) r = null; m.set(B.g, r); return r; }
/* Jagged edges (part of auditCloth): every open edge of a garment (a collar's rim, a hem, a skirt's top, a neckline) should stay a smooth line in every pose.
   A point that juts out from its two neighbours by more than 4 mm more than it does at rest is a tooth (weights that send one point after the head and the next after the chest);
   an edge of cloth stretched to more than 1.7 times its rest length is a tear. Seams split by the file format are joined first, so only real openings count. */
function clBind(P) { const g = P.o.geometry; if (g.userData.clBind) return g.userData.clBind;   /* the unposed shape in true units: packed meshes store their positions squeezed, with the scale in the bind matrix */
  const a = g.attributes.position, n = a.count, out = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { v.fromBufferAttribute(a, i).applyMatrix4(P.o.bindMatrix); out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z; }
  return (g.userData.clBind = out); }
function clEdges(P) { const g = P.o.geometry; if (g.userData.clEdges) return g.userData.clEdges;
  const R = clBind(P), n = R.length / 3, key = new Map(), canon = new Int32Array(n);
  for (let i = 0; i < n; i++) { const k = Math.round(R[i * 3] * 1e4) + ',' + Math.round(R[i * 3 + 1] * 1e4) + ',' + Math.round(R[i * 3 + 2] * 1e4); if (!key.has(k)) key.set(k, i); canon[i] = key.get(k); }
  const ec = new Map(), idx = P.idx, add = (a, b) => { a = canon[a]; b = canon[b]; if (a === b) return; const k = a < b ? a + ',' + b : b + ',' + a; ec.set(k, (ec.get(k) || 0) + 1); };
  for (let t = 0; t < idx.length; t += 3) { add(idx[t], idx[t + 1]); add(idx[t + 1], idx[t + 2]); add(idx[t + 2], idx[t]); }
  const nb = new Map(), all = [];
  for (const [k, c] of ec) { const [a, b] = k.split(',').map(Number); all.push(a, b); if (c !== 1) continue; (nb.get(a) || nb.set(a, []).get(a)).push(b); (nb.get(b) || nb.set(b, []).get(b)).push(a); }
  const rim = []; for (const [v, l] of nb) if (l.length === 2) rim.push(v, l[0], l[1]);
  return (g.userData.clEdges = { rim: Int32Array.from(rim), all: Int32Array.from(all) }); }
/* Folds (part of auditCloth): cloth drawn from one side only shows a hole where it folds over on itself (you see the leg behind it). A triangle whose facing turns
   against its neighbours' in a pose, when it agreed with them standing in Idle, is a fold. */
function clAdj(P) { const g = P.o.geometry; if (g.userData.clAdj) return g.userData.clAdj; const E = clEdges(P), R = clBind(P), idx = P.idx, nt = idx.length / 3, canon = new Int32Array(R.length / 3), key = new Map();
  for (let i = 0; i < canon.length; i++) { const k = Math.round(R[i * 3] * 1e4) + ',' + Math.round(R[i * 3 + 1] * 1e4) + ',' + Math.round(R[i * 3 + 2] * 1e4); if (!key.has(k)) key.set(k, i); canon[i] = key.get(k); }
  const em = new Map(), nb = Array.from({ length: nt }, () => []);
  for (let t = 0; t < nt; t++) for (let e = 0; e < 3; e++) { const a = canon[idx[t * 3 + e]], b = canon[idx[t * 3 + (e + 1) % 3]], k = a < b ? a + ',' + b : b + ',' + a; if (em.has(k)) { const o = em.get(k); nb[t].push(o); nb[o].push(t); } else em.set(k, t); }
  return (g.userData.clAdj = nb); }
function clNormals(X, idx) { const nt = idx.length / 3, N = new Float32Array(nt * 3);
  for (let t = 0; t < nt; t++) { const a = idx[t * 3] * 3, b = idx[t * 3 + 1] * 3, c = idx[t * 3 + 2] * 3, ux = X[b] - X[a], uy = X[b + 1] - X[a + 1], uz = X[b + 2] - X[a + 2], vx = X[c] - X[a], vy = X[c + 1] - X[a + 1], vz = X[c + 2] - X[a + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; N[t * 3] = nx / l; N[t * 3 + 1] = ny / l; N[t * 3 + 2] = nz / l; } return N; }
function clFolds(id, clipName, at, P, out, where) { if (!/^(CoatSkirt|JacketSkirt|Skirt|SkirtSeat|Apron)$/.test(P.name) || !P.ref) return;   /* outer hanging cloth, where a fold opens a hole onto the legs; breeches and shirts crease at the fork and the armpit as real cloth does */
  const nb = clAdj(P), N = clNormals(P.pos, P.idx), N0 = P.o.geometry.userData.clRefN || (P.o.geometry.userData.clRefN = clNormals(P.ref, P.idx)); let n = 0, wt = -1;
  const agree = (M, t) => { let x = 0, y = 0, z = 0; for (const o of nb[t]) { x += M[o * 3]; y += M[o * 3 + 1]; z += M[o * 3 + 2]; } return M[t * 3] * x + M[t * 3 + 1] * y + M[t * 3 + 2] * z; };
  for (let t = 0; t < nb.length; t++) { if (nb[t].length < 2) continue; if (agree(N, t) < -0.5 * nb[t].length && agree(N0, t) > 0) { n++; wt = t; } }
  if (n >= 3) { const v = P.idx[wt * 3] * 3; out.lines.push(`${id} ${clipName}@${at}: ${P.name} folds over itself: ${n} faces` + (where ? ` at x ${P.pos[v].toFixed(3)} y ${P.pos[v + 1].toFixed(3)} z ${P.pos[v + 2].toFixed(3)}` : '')); out.points += n; } }
function clJagged(id, clipName, at, P, sc, out, where, covers) { if (/^(Body|Skin|Sock|Lining)$/.test(P.name) || /Hair|Eye|Brow|Lash|Teeth|Tongue|Bun|Puff|Sole/.test(P.name)) return;
  const E = clEdges(P), A = P.pos, L = (X, i, j) => Math.hypot(X[i * 3] - X[j * 3], X[i * 3 + 1] - X[j * 3 + 1], X[i * 3 + 2] - X[j * 3 + 2]);
  let n = 0, worst = 0, wi = -1;
  for (let t = 0; t < E.rim.length; t += 3) { const i = E.rim[t], j = E.rim[t + 1], k = E.rim[t + 2];
    const x = A[i * 3] - (A[j * 3] + A[k * 3]) / 2, y = A[i * 3 + 1] - (A[j * 3 + 1] + A[k * 3 + 1]) / 2, z = A[i * 3 + 2] - (A[j * 3 + 2] + A[k * 3 + 2]) / 2, e = Math.hypot(x, y, z);
    const R = P.ref; let e0 = 0; if (R) { const x0 = R[i * 3] - (R[j * 3] + R[k * 3]) / 2, y0 = R[i * 3 + 1] - (R[j * 3 + 1] + R[k * 3 + 1]) / 2, z0 = R[i * 3 + 2] - (R[j * 3 + 2] + R[k * 3 + 2]) / 2; e0 = Math.hypot(x0, y0, z0); } else continue;   /* measured against the same edge standing in Idle: corners built in (a collar's ends) are not teeth */
    if (e - e0 > 0.004 * sc && e > 0.6 * L(A, j, k) && !covers(A, i)) { n++; if (e - e0 > worst) { worst = e - e0; wi = i; } } }   /* a smooth edge passes close to the line between a point's neighbours; a tooth stands out by more than half the gap between them */
  if (n) { out.lines.push(`${id} ${clipName}@${at}: ${P.name} edge is jagged: ${n} points, worst ${(worst / sc * 1000).toFixed(1)} mm` + (where ? ` at x ${A[wi * 3].toFixed(3)} y ${A[wi * 3 + 1].toFixed(3)} z ${A[wi * 3 + 2].toFixed(3)}` : '')); out.points += n; out.worst = Math.max(out.worst, worst / sc * 1000); }
}
export function auditCloth(id, body, { poses = [['Idle', 0.3]], after = null, skip = null, where = false, marks = null, played = null } = {}) {   /* played: the clips the game really plays on this body; the extra seated, kneeling and walk poses added below are only checked when listed (null: all) */
  const given = poses;
  if (['Skirt', 'CoatSkirt', 'JacketSkirt', 'Apron'].some((n) => body.getObjectByName(n))) poses = [...poses, ...[0.125, 0.375, 0.625, 0.875].map((f) => ['Walk', f]).filter((p) => !poses.some((q) => q[0] === p[0] && q[1] === p[1]))];   /* a coat skirt, skirt or apron is checked through the whole stride, not only at two moments: a leg came through at a third of the way */
  if (body.getObjectByName('Skirt')) poses = [...poses, ...[['SitTalk', 0.4], ['Kneel', 0.5], ['PlayPiano', 0.4], ['TalkM3', 0.4], ['AskQuestion', 0.4]].filter((p) => !poses.some((q) => q[0] === p[0]))];   /* a skirt is also checked seated and kneeling (when the game has those clips), where knees push through and hems flip */
  if (played) { const ok = new Set(played); poses = poses.filter((q) => given.includes(q) || ok.has(q[0])); }
  const ctl = body.userData.anim, out = { lines: [], points: 0, worst: 0 }, parts0 = clParts(body), sc = body.getWorldScale(new THREE.Vector3()).x || 1, v = new THREE.Vector3(), p = [0, 0, 0]; if (!ctl || parts0.length < 2) return out;
  for (const [clipName, at] of poses) { const act = ctl.get(clipName); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); if (after) after(body); body.updateMatrixWorld(true);
    const parts = clParts(body);   /* per pose: a seated skirt shows only while seated, and the standing one is hidden then */
    for (const P of parts) { P.o.skeleton.update(); const n = P.pos.length / 3; for (let i = 0; i < n; i++) { P.o.getVertexPosition(i, v).applyMatrix4(P.o.matrixWorld); P.pos[i * 3] = v.x; P.pos[i * 3 + 1] = v.y; P.pos[i * 3 + 2] = v.z; } P.grid = null; }
    const grid = (X) => X.grid || (X.grid = clGrid(X.pos, X.idx, 0.03 * sc));
    const belts = parts.filter((X) => /^(Belt|Buckle|Sash|Waistband|Apron)/.test(X.name)), q3 = [0, 0, 0];
    const covers = (X, i) => { q3[0] = X[i * 3]; q3[1] = X[i * 3 + 1]; q3[2] = X[i * 3 + 2]; for (const C of belts) { const h = clNear(q3, C.pos, C.idx, grid(C)); if (h && h.side < 0.004 * sc && Math.abs(h.along) < 0.015 * sc) return true; }
      for (const C of parts) { if (C.pos === X || /^(Body|Skin)$/.test(C.name)) continue; const h = clNear(q3, C.pos, C.idx, grid(C)); if (h && h.side < 0.004 * sc && h.along < -0.002 * sc) return true; } return false; };   /* and an edge tucked inside another garment (a blouse's tail under the skirt) is never seen */   /* under a belt, a sash or an apron an edge is never seen */
    if (clipName === 'Idle') for (const P of parts) { const g = P.o.geometry; if (!g.userData.clRef) g.userData.clRef = P.pos.slice(); }
    for (const P of parts) P.ref = P.o.geometry.userData.clRef || null;
    for (const P of parts) if (!belts.includes(P)) clJagged(id, clipName, at, P, sc, out, where, covers);
    for (const P of parts) clFolds(id, clipName, at, P, out, where);
    { const skin = parts.find((X) => /^(Body|Skin)$/.test(X.name)); if (skin && skin.ref) { const hands = clHands(skin, 'hand'), E = clEdges(skin), A = skin.pos, R = skin.ref; let n = 0, ws = 1, wi = 0, wb = 0;   /* malformed hands: an edge of skin bound wholly to one hand bone (over 4 mm) stretched past 1.5 times or squashed under 0.67 times (creases over joints are left out), its length standing in Idle (weights torn between bones, a finger bent through itself) */
      const L = (X, i, j) => Math.hypot(X[i * 3] - X[j * 3], X[i * 3 + 1] - X[j * 3 + 1], X[i * 3 + 2] - X[j * 3 + 2]);
      const si = skin.g.attributes.skinIndex, sw = skin.g.attributes.skinWeight, bones = skin.o.skeleton.bones, rigid1 = (i) => { for (let k = 0; k < 4; k++) if (sw.getComponent(i, k) > 0.85) return si.getComponent(i, k) + 1; return 0; }, thumb = (i) => { let w = 0; for (let k = 0; k < 4; k++) { const bb = bones[si.getComponent(i, k)]; if (bb && /Thumb/.test(bb.name)) w += sw.getComponent(i, k); } return w; };
      for (let t = 0; t < E.all.length; t += 2) { const a = E.all[t], b = E.all[t + 1]; if (!hands[a] || !hands[b]) continue; if (Math.abs(thumb(a) - thumb(b)) > 0.3) continue; const ra = rigid1(a), rb = rigid1(b); if (!ra || ra !== rb) continue;   /* only skin bound wholly to one bone (the middle of a finger bone or of the palm) must keep its shape; a crease over a joint squeezes and stretches in any real hand */   /* the web between thumb and palm stretches in any real hand: edges that cross from the thumb to the palm are left out */ const r = L(R, a, b); if (r < 0.004 * sc) continue; const f = L(A, a, b) / r; if (f > 1.5 || f < 0.67) { n++; const bad = f > 1 ? f : 1 / f; if (bad > ws) { ws = bad; wi = a; wb = b; } } }
      if (clipName === 'Idle') { const g = skin.o.geometry; let holes = g.userData.clHoles; if (holes === undefined) { const si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = skin.o.skeleton.bones, fin = (i) => { let w = 0; for (let k = 0; k < 4; k++) { const b = bones[si.getComponent(i, k)]; if (b && /Hand(Thumb|Index|Middle|Ring|Pinky)/.test(b.name)) w += sw.getComponent(i, k); } return w > 0.5; }; holes = 0; for (let t = 0; t < E.rim.length; t += 3) if (fin(E.rim[t])) holes++; g.userData.clHoles = holes; }   /* a finger is a closed shape: an open edge on one means faces are missing (the builder once deleted the fingers' inner faces as "hidden by the skirt") */
        if (holes) { out.lines.push(`${id} ${clipName}@${at}: fingers have holes: ${holes} open edge points`); out.points += holes; } }
      if (n) { const dom = (i) => { let bn = '', bw = 0; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bn = (bones[si.getComponent(i, k)] || {}).name || ''; } } return bn.replace('mixamorig', ''); }; out.lines.push(`${id} ${clipName}@${at}: hand is malformed: ${n} edges, worst ${ws.toFixed(1)} times` + (where ? ` [${dom(wi)}-${dom(wb)} rest ${(L(R, wi, wb) * 1000).toFixed(1)} mm now ${(L(A, wi, wb) * 1000).toFixed(1)} mm]` +` at x ${A[wi * 3].toFixed(3)} y ${A[wi * 3 + 1].toFixed(3)} z ${A[wi * 3 + 2].toFixed(3)}` : '')); out.points += n; } } }
    { const skin = parts.find((X) => /^(Body|Skin)$/.test(X.name)); if (skin) { const hands = clHands(skin, false), fp = [0, 0, 0];   /* fingers in the cloth: hand points more than 3 mm inside a skirt, an apron or trousers (the arm test above leaves hands out, so this is their own check) */
      for (const B of parts) { if (!/^(Skirt|SkirtSeat|Apron|Breeches|JacketSkirt|CoatSkirt)$/.test(B.name)) continue; const G = grid(B); let n = 0, worst = 0, wi = -1;
        for (let i = 0; i < hands.length; i++) { if (!hands[i]) continue; fp[0] = skin.pos[i * 3]; fp[1] = skin.pos[i * 3 + 1]; fp[2] = skin.pos[i * 3 + 2]; const h = clNear(fp, B.pos, B.idx, G); if (h && h.side < 0.003 * sc && h.along < -0.003 * sc && h.along > -0.04 * sc) { n++; if (-h.along > worst) { worst = -h.along; wi = i; } } }
        if (n) { out.lines.push(`${id} ${clipName}@${at}: fingers go into ${B.name}: ${n} points, worst ${(worst / sc * 1000).toFixed(1)} mm` + (where ? ` at x ${skin.pos[wi * 3].toFixed(3)} y ${skin.pos[wi * 3 + 1].toFixed(3)} z ${skin.pos[wi * 3 + 2].toFixed(3)}` : '')); out.points += n; } } } }
    for (const A of parts) for (const B of parts) { if (A === B || /^(Body|Skin)$/.test(B.name) || A.mat === B.mat || (/Sole|Shoes/.test(A.name) && /Sole|Shoes/.test(B.name)) || (skip && skip(A.name, B.name))) continue;   /* cloth outside the skin is always right; two pieces of one cloth (jacket and lapels) cannot show through each other; a sole wraps its shoe on purpose */
      const rel = clRelation(A, B); if (!rel) continue; const G = grid(B); let n = 0, worst = 0, wi = 0;
      let sleeveP = null; if (/^(Breeches|Skirt|SkirtSeat|Apron)$/.test(A.name) && /^(Jacket|Coat|Shirt)$/.test(B.name)) { const arm = clHands(B, true); sleeveP = []; for (let q = 0; q < arm.length; q++) if (arm[q]) sleeveP.push(B.pos[q * 3], B.pos[q * 3 + 1], B.pos[q * 3 + 2]); }   /* a sleeve resting on a seated thigh touches the trousers: that is contact, not the trousers through the coat */
      let hemP = null; if (/^(Body|Sock)$/.test(A.name) && B.name === 'SkirtSeat') { const E2 = clEdges(B), seen = new Set(); hemP = []; for (let t = 0; t < E2.rim.length; t += 3) { const r = E2.rim[t]; if (seen.has(r)) continue; seen.add(r); hemP.push(B.pos[r * 3], B.pos[r * 3 + 1], B.pos[r * 3 + 2]); } }   /* the seated skirt's hem, where it is now: a knee bent out below it is the leg coming out, not skin through the cloth */
      for (const i of rel) { clPoint(A.pos, A.samples, i, p); const h = clNear(p, B.pos, B.idx, G); if (!h || h.side > 0.004 * sc || h.along <= 0.0005 * sc) continue; if (sleeveP) { let near = false; const lim2 = (0.06 * sc) ** 2; for (let q = 0; q < sleeveP.length; q += 3) if ((sleeveP[q] - p[0]) ** 2 + (sleeveP[q + 1] - p[1]) ** 2 + (sleeveP[q + 2] - p[2]) ** 2 < lim2) { near = true; break; } if (near) continue; } if (hemP) { let near = false; const lim = (0.07 * sc) ** 2; for (let q = 0; q < hemP.length; q += 3) if ((hemP[q] - p[0]) ** 2 + (hemP[q + 1] - p[1]) ** 2 + (hemP[q + 2] - p[2]) ** 2 < lim) { near = true; break; } if (near) continue; } const al = h.along; let hid = false;
        for (const C of parts) { if (C === A || C === B || C.mat === A.mat) continue; const hc = clNear(p, C.pos, C.idx, grid(C)); if (hc && hc.side < 0.004 * sc && (hc.along < -0.0005 * sc || (/^(Belt|Buckle|Sash|Waistband)/.test(C.name) && Math.abs(hc.along) < 0.012 * sc))) { hid = true; break; }   /* a belt (or the waistband of 1690 breeches) is an open band whose faces may point either way: anything just under or inside it is hidden */ } if (hid) continue;   /* still under a third piece (a shirt through a waistcoat, under a jacket): nobody can see it */
        n++; if (marks) marks.push([p[0], p[1], p[2], A.name, B.name]); if (al > worst) { worst = al; wi = i; } }
      if (n) { clPoint(A.pos, A.samples, wi, p); const rp = [0, 0, 0]; clPoint(A.rest, A.samples, wi, rp); out.points += n; out.worst = Math.max(out.worst, worst / sc * 1000); out.lines.push(`${id} ${clipName}@${at}: ${A.name} shows through ${B.name}: ${n} points, worst ${(worst / sc * 1000).toFixed(1)} mm` + (where ? ` at x ${p[0].toFixed(3)} y ${p[1].toFixed(3)} z ${p[2].toFixed(3)} (rest ${rp.map((x) => x.toFixed(3)).join(' ')})` : '')); } } }
  ctl.mx.stopAllAction(); ctl.base.reset().play(); ctl.cur = ctl.base; ctl.mx.update(0); if (after) after(body);
  return out;
}

/* ---------- heads: a head turned further or faster than a person can (every game; first wired in Tivoli, 17 November 2026) ----------
   A head turn added after the mixer piles up when the clip writes the neck and head only once (a still Idle track), and the head goes round
   and round (Selassie, Tivoli). The angles are measured as games/selassie/src/headcheck.js and games/kendal/src/motioncheck.js do: the head's
   forward against the chest's own forward, up and side, from the bind pose. headAngles(body) gives { yaw, pitch } in degrees.
   const w = headWatch({ own });   own(person, clip) -> how fast that clip turns the head on its own, degrees a second (optional)
   every frame (after the head turns): w.sample(t, [{ id, m, clip, blend }])   t in seconds; blend: true while one clip fades into the next
   w.lines() -> one line per person and kind of fault, with the worst value; w.stats() -> how many people and samples. */
export const HEAD_LIMIT = { yaw: 80, pitch: 60, speed: 320, over: 0.1 };
const HEAD_AXES = new WeakMap();
function headAxes(m) {
  let a = HEAD_AXES.get(m); if (a !== undefined) return a; let s = null; m.traverse((o) => { if (!s && o.isSkinnedMesh) s = o.skeleton; });
  const get = (name) => { if (!s) return null; const i = s.bones.findIndex((b) => b.name === 'mixamorig' + name); if (i < 0) return null; const q = new THREE.Quaternion(); new THREE.Matrix4().copy(s.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); q.invert(); return { bone: s.bones[i], f: new THREE.Vector3(0, 0, 1).applyQuaternion(q), u: new THREE.Vector3(0, 1, 0).applyQuaternion(q) }; };
  a = { chest: get('Spine2'), head: get('Head') }; if (!a.chest || !a.head) a = null; HEAD_AXES.set(m, a); return a;
}
const _hq = new THREE.Quaternion(), _hf = new THREE.Vector3(), _hu = new THREE.Vector3(), _hr = new THREE.Vector3(), _hh = new THREE.Vector3();
export function headAngles(m) {
  const a = m && headAxes(m); if (!a) return null; m.updateMatrixWorld(true);
  a.chest.bone.getWorldQuaternion(_hq); _hf.copy(a.chest.f).applyQuaternion(_hq); _hu.copy(a.chest.u).applyQuaternion(_hq); _hr.crossVectors(_hu, _hf);
  a.head.bone.getWorldQuaternion(_hq); _hh.copy(a.head.f).applyQuaternion(_hq);
  return { yaw: Math.atan2(_hh.dot(_hr), _hh.dot(_hf)) * 180 / Math.PI, pitch: Math.asin(Math.max(-1, Math.min(1, _hh.dot(_hu)))) * 180 / Math.PI };
}
export function headWatch({ limit = HEAD_LIMIT, own = null } = {}) {
  const L = { ...HEAD_LIMIT, ...limit }, S = new Map(), worst = new Map(); let samples = 0;
  const add = (key, val, text) => { const w = worst.get(key); if (!w || val > w.val) worst.set(key, { val, text }); };
  const wrapD = (d) => ((d + 540) % 360) - 180;
  return {
    sample(t, people) {
      for (const p of people) {
        if (!p.m || p.m.visible === false) continue; const g = headAngles(p.m); if (!g || !Number.isFinite(g.yaw)) continue; samples++;
        const id = p.id, clip = p.clip || '';
        if (Math.abs(g.yaw) > L.yaw) add('y' + id, Math.abs(g.yaw), `head: ${id} turns the head ${g.yaw.toFixed(0)} degrees from the chest on ${clip} (limit ${L.yaw})`);
        if (Math.abs(g.pitch) > L.pitch) add('p' + id, Math.abs(g.pitch), `head: ${id} tips the head ${g.pitch.toFixed(0)} degrees on ${clip} (limit ${L.pitch})`);
        let s = S.get(id); if (!s || s.clip !== clip || t < s.t) { S.set(id, { t, g, clip, spin: 0, last: g.yaw }); continue; }
        s.spin += wrapD(g.yaw - s.last); s.last = g.yaw; if (Math.abs(s.spin) > 360) add('s' + id, Math.abs(s.spin), `head: ${id}'s head goes right round (${Math.abs(s.spin).toFixed(0)} degrees one way) on ${clip}`);
        const dt = t - s.t; if (dt < L.over) continue;
        const sp = Math.hypot(wrapD(g.yaw - s.g.yaw), wrapD(g.pitch - s.g.pitch)) / dt;
        if (sp > L.speed && !p.blend) { const o = own ? own(p, clip) : 0; if (sp > o * 1.25 + 60) add('v' + id, sp, `head: ${id}'s head turns ${sp.toFixed(0)} degrees a second on ${clip} (the clip alone: ${o.toFixed(0)}; limit ${L.speed})`); }
        s.t = t; s.g = g;
      }
    },
    lines: () => [...worst.values()].map((w) => w.text),
    stats: () => ({ people: S.size, samples }),
  };
}
