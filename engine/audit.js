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
   Nothing here runs in a public build unless a game imports it into code that is only reached when __DEV__ is true. */
import * as THREE from 'three';
import { groundFeet, strideOf } from './anim.js';

/* a list of the world-space box of every visible mesh under a group (instanced meshes are skipped) */
export function snapMeshes(group) {
  group.updateMatrixWorld(true); const out = [];
  group.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && o.visible) { const b = new THREE.Box3().setFromObject(o); if (!isFinite(b.min.x)) return; const e = { b, mat: Array.isArray(o.material) ? 'multi' : (o.material.name || o.material.type), geo: o.geometry.type };
    if (o.geometry.type === 'BoxGeometry') { o.geometry.computeBoundingBox(); e.lb = o.geometry.boundingBox.clone(); e.inv = o.matrixWorld.clone().invert(); e.sc = Math.cbrt(Math.abs(o.matrixWorld.determinant())) || 1; }   /* the exact box, for seats */
    out.push(e); } });
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
  for (const p of place.npcs) { const g = p.ground || 0; for (let i = 0; i < n; i++) { const b = L[i].b, sz = size[i]; if (big.includes(i) || sz.y < 0.3 || b.max.y < g + (/^Sit/.test(p.anim || '') ? 0.62 : 0.3) || b.min.y > g + 1.3 || (L[i].geo !== 'BoxGeometry' && L[i].geo !== 'CylinderGeometry')) continue; if (p.x > b.min.x + 0.05 && p.x < b.max.x - 0.05 && p.z > b.min.z + 0.05 && p.z < b.max.z - 0.05) { inside.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) inside a ${L[i].geo} ${sz.x.toFixed(1)}x${sz.y.toFixed(1)}x${sz.z.toFixed(1)}, y ${b.min.y.toFixed(1)} to ${b.max.y.toFixed(1)}`); break; } } }
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


/* Seated people. body: the character's root Object3D, already posed (call the mixer's update first). snap: the list from snapMeshes (taken before merging).
   ground: the floor height under the person. Reports a person who
     - sits too low (the hip joint should be about 12 cm above the seat, scaled by body size; 7 cm lower than that and the seat passes through the thighs),
     - cuts into any other box, such as the back of the seat or an arm (real skinned vertices against the exact box),
     - hangs in the air (hips more than 30 cm above the seat under them, or above the floor with no seat at all),
     - faces the back of a seat (a thin, tall board close in front of them).
   stats (optional array) collects one line per person, for tuning. */
export function auditSeated(id, body, snap, ground = 0, stats) {
  body.updateMatrixWorld(true); const out = [], pts = [], v = new THREE.Vector3(), hb = body.getObjectByName('mixamorigHips'); if (!hb) return out;
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
    if (upright) { const c = m.b.getCenter(new THREE.Vector3()), dx = c.x - hips.x, dz = c.z - hips.z, ahead = dx * fwd.x + dz * fwd.z, side = Math.abs(dx * fwd.z - dz * fwd.x); if (ahead > 0.2 && ahead < 0.9 && side < 0.6 && m.b.min.y < hips.y + 0.3 && m.b.max.y > hips.y + 0.2) out.push(`${id} faces the back of a seat (a board ${(ahead * 100).toFixed(0)} cm ahead)`); }
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
   through in the rest shape is caught as well). Points tested: each vertex and the middle of each triangle. A fault is a point more than half a millimetre outside.
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
    const g = o.geometry, n = g.attributes.position.count, idx = g.index.array; let samples = g.userData.clSamples; if (!samples) { samples = new Uint32Array(n * 3 + idx.length); for (let i = 0; i < n; i++) samples[i * 3] = samples[i * 3 + 1] = samples[i * 3 + 2] = i; samples.set(idx, n * 3); g.userData.clSamples = samples; }
    let rest = g.userData.clRest; if (!rest) { rest = new Float32Array(n * 3); const v = new THREE.Vector3(); for (let i = 0; i < n; i++) { v.fromBufferAttribute(g.attributes.position, i).applyMatrix4(o.bindMatrix); rest[i * 3] = v.x; rest[i * 3 + 1] = v.y; rest[i * 3 + 2] = v.z; } g.userData.clRest = rest; }
    parts.push({ o, name: o.name || o.material.name, mat: o.material.name || o.name, g, idx, samples, rest, pos: new Float32Array(n * 3) }); }); return parts; }
function clRelation(A, B) {   /* which sample points of piece A are meant to lie beneath piece B (from the rest shape). Cached per pair of shapes. */
  let m = CL_REL.get(A.g); if (!m) CL_REL.set(A.g, m = new WeakMap()); let r = m.get(B.g); if (r !== undefined) return r;
  const G = B.g.userData.clGrid || (B.g.userData.clGrid = clGrid(B.rest, B.idx, 0.03)), p = [0, 0, 0], near = [], under = []; let below = 0;
  for (let i = 0; i < A.samples.length / 3; i++) { clPoint(A.rest, A.samples, i, p); const h = clNear(p, B.rest, B.idx, G); if (!h || h.side > 0.004 || Math.abs(h.along) > 0.03) continue; near.push(i); if (h.along < 0) { below++; if (h.along < -0.003) under.push(i); } }
  r = near.length < 8 ? null : below >= near.length * 0.7 ? near : below <= near.length * 0.3 ? null : under; if (r && !r.length) r = null; m.set(B.g, r); return r; }
export function auditCloth(id, body, { poses = [['Idle', 0.3]], after = null, skip = null } = {}) {
  const ctl = body.userData.anim, out = { lines: [], points: 0, worst: 0 }, parts = clParts(body), sc = body.getWorldScale(new THREE.Vector3()).x || 1, v = new THREE.Vector3(), p = [0, 0, 0]; if (!ctl || parts.length < 2) return out;
  for (const [clipName, at] of poses) { const act = ctl.get(clipName); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); if (after) after(body); body.updateMatrixWorld(true);
    for (const P of parts) { P.o.skeleton.update(); const n = P.pos.length / 3; for (let i = 0; i < n; i++) { P.o.getVertexPosition(i, v).applyMatrix4(P.o.matrixWorld); P.pos[i * 3] = v.x; P.pos[i * 3 + 1] = v.y; P.pos[i * 3 + 2] = v.z; } P.grid = null; }
    const grid = (X) => X.grid || (X.grid = clGrid(X.pos, X.idx, 0.03 * sc));
    for (const A of parts) for (const B of parts) { if (A === B || /^(Body|Skin)$/.test(B.name) || A.mat === B.mat || (/Sole|Shoes/.test(A.name) && /Sole|Shoes/.test(B.name)) || (skip && skip(A.name, B.name))) continue;   /* cloth outside the skin is always right; two pieces of one cloth (jacket and lapels) cannot show through each other; a sole wraps its shoe on purpose */
      const rel = clRelation(A, B); if (!rel) continue; const G = grid(B); let n = 0, worst = 0;
      for (const i of rel) { clPoint(A.pos, A.samples, i, p); const h = clNear(p, B.pos, B.idx, G); if (!h || h.side > 0.004 * sc || h.along <= 0.0005 * sc) continue; const al = h.along; let hid = false;
        for (const C of parts) { if (C === A || C === B || C.mat === A.mat) continue; const hc = clNear(p, C.pos, C.idx, grid(C)); if (hc && hc.side < 0.004 * sc && hc.along < -0.0005 * sc) { hid = true; break; } } if (hid) continue;   /* still under a third piece (a shirt through a waistcoat, under a jacket): nobody can see it */
        n++; if (al > worst) worst = al; }
      if (n) { out.points += n; out.worst = Math.max(out.worst, worst / sc * 1000); out.lines.push(`${id} ${clipName}@${at}: ${A.name} shows through ${B.name}: ${n} points, worst ${(worst / sc * 1000).toFixed(1)} mm`); } } }
  ctl.mx.stopAllAction(); ctl.base.reset().play(); ctl.cur = ctl.base; ctl.mx.update(0); if (after) after(body);
  return out;
}
