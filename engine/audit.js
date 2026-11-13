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
   Nothing here runs in a public build unless a game imports it into code that is only reached when __DEV__ is true. */
import * as THREE from 'three';

/* a list of the world-space box of every visible mesh under a group (instanced meshes are skipped) */
export function snapMeshes(group) {
  group.updateMatrixWorld(true); const out = [];
  group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o.visible) { const b = new THREE.Box3().setFromObject(o); if (isFinite(b.min.x)) out.push({ b, mat: Array.isArray(o.material) ? 'multi' : (o.material.name || o.material.type), geo: o.geometry.type }); } });
  return out;
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
  for (const p of place.npcs) { const g = p.ground || 0; for (let i = 0; i < n; i++) { const b = L[i].b, sz = size[i]; if (big.includes(i) || sz.y < 0.3 || b.max.y < g + 0.4 || b.min.y > g + 1.3 || (L[i].geo !== 'BoxGeometry' && L[i].geo !== 'CylinderGeometry')) continue; if (p.x > b.min.x + 0.05 && p.x < b.max.x - 0.05 && p.z > b.min.z + 0.05 && p.z < b.max.z - 0.05) { inside.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) inside a ${L[i].geo} ${sz.x.toFixed(1)}x${sz.y.toFixed(1)}x${sz.z.toFixed(1)}, y ${b.min.y.toFixed(1)} to ${b.max.y.toFixed(1)}`); break; } } }
  for (const p of place.npcs) if (!(p.ground > 0) && !/^Sit/.test(p.anim || '')) for (const w of place.walls) if (p.x > w[0] && p.x < w[2] && p.z > w[1] && p.z < w[3]) { inside.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) inside a walking wall`); break; }
  /* walk the floor on a 0.25 m grid from the start, then check that everything the player needs can be reached */
  const bd = place.bounds, st = 0.25, W = Math.round((bd.x1 - bd.x0) / st) + 1, D = Math.round((bd.z1 - bd.z0) / st) + 1, seen = new Uint8Array(W * D);
  const ok = (x, z) => x >= bd.x0 && x <= bd.x1 && z >= bd.z0 && z <= bd.z1 && !place.walls.some((w) => x > w[0] && x < w[2] && z > w[1] && z < w[3]);
  const q = [], sx = Math.round((place.start.x - bd.x0) / st), sz0 = Math.round((place.start.z - bd.z0) / st), startOK = ok(place.start.x, place.start.z); if (startOK) { q.push([sx, sz0]); seen[sz0 * W + sx] = 1; }
  while (q.length) { const [cx, cz] = q.pop(); for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, nz = cz + dz; if (nx < 0 || nz < 0 || nx >= W || nz >= D || seen[nz * W + nx] || !ok(bd.x0 + nx * st, bd.z0 + nz * st)) continue; seen[nz * W + nx] = 1; q.push([nx, nz]); } }
  const reach = (x, z, r) => { for (let cz = 0; cz < D; cz++) for (let cx = 0; cx < W; cx++) if (seen[cz * W + cx] && Math.hypot(bd.x0 + cx * st - x, bd.z0 + cz * st - z) <= r) return true; return false; };
  const stuck = []; if (!startOK) stuck.push('the START is inside a wall or outside the bounds'); for (const a of place.actions) if (!reach(a.x, a.z, a.r * 0.9)) stuck.push('thing to do "' + a.label + '" cannot be reached'); for (const p of place.people) if (!/^Sit/.test(p.anim || '') && !reach(p.x, p.z, 2.3)) stuck.push('person ' + p.id + ' cannot be reached to talk to');
  const overlap = auditPeople(place.npcs, place.start);
  return { id: place.id, floating, inside: inside.concat(overlap), stuck };
}

/* Held items. body: the character's root Object3D, already posed (call the mixer's update first). items: [{ obj, bone, label }] where obj is the carried thing
   (already parented to the bone) and bone is the Mixamo bone name without the "mixamorig" prefix, for example "RightHand" or "Head".
   Reports a problem when the item is more than 12 cm from that bone, when it is tipped far from upright, or when any part of it is inside the torso, a leg or the head. */
export function auditHeld(id, body, items) {
  body.updateMatrixWorld(true); const P = (n) => { const b = body.getObjectByName('mixamorig' + n); return b ? b.getWorldPosition(new THREE.Vector3()) : null; }, sc = body.getWorldScale(new THREE.Vector3()).x || 1, out = [];
  const seg = (a, b, r, name) => { const A = P(a), B = P(b); return A && B ? { A, B, r: r * sc, name } : null; };
  const segs = [seg('Hips', 'Spine2', 0.2, 'torso'), seg('Spine2', 'Neck', 0.18, 'chest'), seg('LeftUpLeg', 'LeftLeg', 0.11, 'left thigh'), seg('RightUpLeg', 'RightLeg', 0.11, 'right thigh'), seg('LeftLeg', 'LeftFoot', 0.08, 'left shin'), seg('RightLeg', 'RightFoot', 0.08, 'right shin'), seg('Neck', 'Head', 0.1, 'neck'), seg('LeftArm', 'LeftForeArm', 0.06, 'left arm'), seg('RightArm', 'RightForeArm', 0.06, 'right arm')].filter(Boolean);
  const dist = (p, A, B) => { const ab = B.clone().sub(A), t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / (ab.lengthSq() || 1))); return p.distanceTo(A.clone().addScaledVector(ab, t)); };
  for (const it of items) {
    const box = new THREE.Box3().setFromObject(it.obj), hand = P(it.bone), name = id + ' ' + (it.label || 'item') + ' at ' + it.bone; if (!hand) continue;
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
  const out = [], sitting = (n) => /^Sit/.test(n.anim || ''), spots = (n) => { if (!n.path || n.path.length < 2) return [[n.x, n.z]]; const pts = []; for (let i = 0; i < n.path.length; i++) { const a = n.path[i], b = n.path[(i + 1) % n.path.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(len / 0.5)); for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } return pts; };
  for (let i = 0; i < npcs.length; i++) for (let j = i + 1; j < npcs.length; j++) { const a = npcs[i], b = npcs[j]; if (Math.abs((a.ground || 0) - (b.ground || 0)) > 0.3) continue; const need = sitting(a) && sitting(b) ? 0.4 : 0.65; const moving = a.path || b.path; let worst = 1e9; if (!moving) worst = Math.hypot(a.x - b.x, a.z - b.z); else { const A = a.path ? spots(a) : [[a.x, a.z]], B = b.path ? spots(b) : [[b.x, b.z]]; if (a.path && b.path) continue; for (const p of A) for (const q of B) worst = Math.min(worst, Math.hypot(p[0] - q[0], p[1] - q[1])); } if (worst < need) out.push(`${a.id} and ${b.id} are ${(worst * 100).toFixed(0)} cm apart${moving ? ' (along a walk)' : ''} at (${a.x.toFixed(1)},${a.z.toFixed(1)})`); }
  if (start) for (const n of npcs) if (!sitting(n)) for (const p of spots(n)) if (Math.hypot(p[0] - start.x, p[1] - start.z) < 1.1 && !(n.ground > 0)) { out.push(`${n.id} stands on the player's start at (${p[0].toFixed(1)},${p[1].toFixed(1)})`); break; }
  return out;
}
