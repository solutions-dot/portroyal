/* games/_tivoli/src/checks.js: dev-only checks for Tivoli's people, COPIED from branch claude/affectionate-pasteur-xvhvlq
   (engine/audit.js auditCloth and auditWalk, engine/anim.js strideOf, engine/skinprobe.js skinProbe), because main's engine/ does not have
   them yet and engine/ must not be edited here (another branch is changing it). When that branch is merged, delete this file and import
   the engine versions instead (docs/PEOPLE.md). Two Tivoli changes: the cloth layer order knows the 2010 kit pieces (vest, harness, pouches,
   helmet, boots, armband, letters), and walkers are paced with a local pace() because main's animate() has no ctl.pace. */
import * as THREE from 'three';
import { groundFeet } from '../../../engine/anim.js';
import { auditHeld } from '../../../engine/audit.js';

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
const WALKS = /^(Walk|WalkM|Run|Carry|SadWalk)$/;
function pace(m, ctl, v, lo = 0.55, hi = 1.9) { const a = ctl.cur, c = a.getClip(); if (!WALKS.test(c.name)) return 1; const s = strideOf(m, c); if (s > 0.05) a.timeScale = Math.max(lo, Math.min(hi, v * c.duration / s)); return a.timeScale; }
export function auditWalk(id, body, v, { after = null, paced = true, loops = 2, ground = body.userData.ground || 0, heldItems = null } = {}) {
  const ctl = body.userData.anim, out = { stride: 0, pace: 1, slide: 0, sink: 0, float: 0, pop: 0, lines: [] }; if (!ctl) return out;
  const act = ctl.cur, clip = act.getClip(), B = (n) => body.getObjectByName('mixamorig' + n), feet = [B('LeftFoot'), B('RightFoot')], P = new THREE.Vector3(); if (feet.some((f) => !f)) return out;
  out.stride = strideOf(body, clip); act.timeScale = 1; out.pace = paced ? pace(body, ctl, v) : 1; act.time = 0; ctl.mx.update(0);
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
    parts.push({ o, name: /^(Skin|Sock)$/.test(o.material.name || '') ? (o.material.name === 'Skin' ? 'Body' : 'Sock') : (o.name || o.material.name),   /* the skin and the socks are named by their material: a body mesh with two materials loads as two meshes with the mesh's own name */ mat: o.material.name || o.name, g, idx, samples, rest, pos: new Float32Array(n * 3) }); }); return parts; }
/* which piece lies over which, innermost first. A piece is only tested as the under layer of a piece that comes later. Names not listed are judged from the rest shape alone. */
const CL_ORDER = [/^(Body|Skin)$/, /^(Hair|Bun|Puffs|Plaits|Moustache)/, /^Sock/, /^Shirt$/, /^(Placket|Pocket)/, /^(Collar|Tie|Buttons)/, /^(Breeches|Skirt)$/, /^(Belt|Buckle|Sash)$/, /^Waistcoat/, /^Apron/, /^(Jacket|JacketSkirt|Lapels|JButtons|Coat|CoatSkirt)/, /^(Shoes|Sole)/, /^(Ribbon|Hat|Cap|TopHat|Bonnet|Wrap|Scarf)/, /^(Boots|Cargo)$/, /^Vest$/, /^(ArmBand|Epaulette|Chevrons)$/, /^(BeltStraps|BeltPouch|BeltCanister|VestPouch|VestText|ArmBandText)$/, /^(Helmet|HelmetStrap)$/];   /* Tivoli: the 2010 kit, worn in this order (exact names, so BeltPouch is not taken for the belt) */
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
  for (let i = 0; i < n; i++) { let w = 0; for (let k = 0; k < 4; k++) { const b = bones[si.getComponent(i, k)]; if (b && (upper === 'leg' ? /Hand|Arm|(Left|Right)Leg|Foot|Toe/ : upper ? /Hand|Arm/ : /Hand|ForeArm/).test(b.name)) w += sw.getComponent(i, k); } if (w > 0.5) out[i] = 1; }
  return (A.g.userData[key] = out); }
function clRelation(A, B) {   /* which sample points of piece A are meant to lie beneath piece B (from the rest shape). Cached per pair of shapes. */
  let m = CL_REL.get(A.g); if (!m) CL_REL.set(A.g, m = new WeakMap()); let r = m.get(B.g); if (r !== undefined) return r;
  const G = B.g.userData.clGrid || (B.g.userData.clGrid = clGrid(B.rest, B.idx, 0.03)), p = [0, 0, 0], near = [], under = [], thin = []; let below = 0;
  const lowB = /^(Breeches|Skirt|Apron|JacketSkirt|CoatSkirt|Jacket|Waistcoat)$/.test(B.name), hand = /^(Body|Skin)$/.test(A.name) ? clHands(A, /^Breeches$/.test(B.name) ? 'leg' : lowB) : (lowB && /^(Shirt|Collar|Jacket|Waistcoat)$/.test(A.name) ? clHands(A, true) : null);   /* an arm or a cuff that hangs against a skirt, trousers or a jacket's hem is not under them: the game spreads the arms clear (spreadArms), so arm and cuff points are left out of these pairs */
  let edge = null, arm = null;   /* an arm that comes out of a short sleeve: skin within 3 cm of a sleeve's hem is the arm itself, not skin showing through */
  const bodyA = /^(Body|Skin)$/.test(A.name); if (bodyA && /^(Shirt|Jacket|Coat)$/.test(B.name)) arm = clHands(A, true); if (/^Shirt$/.test(A.name) && /^(Collar|Placket|Pocket|Buttons|Tie)$/.test(B.name)) { m.set(B.g, null); return null; }
  if (/^(Hair|Bun|Puffs|Plaits)/.test(A.name) && /Band$/.test(B.name)) { m.set(B.g, null); return null; }
  if (/^(Body|Sock)$/.test(A.name) && /^(Body|Sock)$/.test(B.name)) { m.set(B.g, null); return null; }   /* socks are a part of the skin's own mesh: the two meet edge to edge */   /* a hat band is a ribbon on the crown: hair cannot reach it except through the crown, which is tested */
  if (bodyA && /^(Tie|Buttons|Placket|Pocket|Collar)/.test(B.name)) { m.set(B.g, null); return null; }   /* a tie, a front band, a pocket or a collar lies on the shirt, never on bare skin */   /* a shirt seen through its own collar, front band or pocket is the same cloth */
  edge = clEdge(B);
  const neck = /^(Shirt|Collar)$/.test(A.name) && /^(Jacket|Waistcoat|JacketSkirt)$/.test(B.name) ? clNeck(A) : null;
  for (let i = 0; i < A.samples.length / 3; i++) { if ((hand && hand[A.samples[i * 3]]) || (neck && neck[A.samples[i * 3]])) continue; clPoint(A.rest, A.samples, i, p);
    if (edge) { const lim = arm ? (arm[A.samples[i * 3]] ? 0.0009 : 0) : (/^(Shirt|Collar)$/.test(A.name) && /^(Jacket)$/.test(B.name) ? 0.0004 : 0.000144); if (lim && edge.some((e) => (e[0] - p[0]) ** 2 + (e[1] - p[1]) ** 2 + (e[2] - p[2]) ** 2 < lim)) continue; }   /* a point within 12 mm of a cover's open edge (a neckline, a lapel, a hem) is at the opening, where the eye sees the layer beneath anyway */ const h = clNear(p, B.rest, B.idx, G); if (!h || h.side > 0.004 || Math.abs(h.along) > 0.03) continue; near.push(i); if (h.along < 0.003) thin.push(i);   /* a point that already pokes out up to 3 mm in the rest shape is held to the cover too: a speck through the cloth is a fault from the start */ if (h.along < 0) { below++; if (h.along < -0.001) under.push(i); } }
  const ra = clRank(A.name), rb = clRank(B.name), known = ra >= 0 && rb >= 0; if (known && (ra >= rb || (ra === 0 && rb === 1))) { m.set(B.g, null); return null; }   /* skin under hair is not tested: the hair is painted to fade into the skin at its edge */
  r = near.length < 8 ? null : known ? (below >= near.length * 0.5 && !(bodyA && /^(Tie|Buttons|Placket|Pocket|Belt|Buckle|Sash|Collar|Apron)/.test(B.name)) ? thin : under) : below >= near.length * 0.9 ? near : below <= near.length * 0.3 ? null : under;   /* two pieces whose order is known: every point of the under one that lies beneath a face of the cover is held to it, so a speck that is already through in the rest shape is caught too */ if (r && !r.length) r = null; m.set(B.g, r); return r; }
export function auditCloth(id, body, { poses = [['Idle', 0.3]], after = null, skip = null, where = false, marks = null } = {}) {
  const ctl = body.userData.anim, out = { lines: [], points: 0, worst: 0 }, parts = clParts(body), sc = body.getWorldScale(new THREE.Vector3()).x || 1, v = new THREE.Vector3(), p = [0, 0, 0]; if (!ctl || parts.length < 2) return out;
  for (const [clipName, at] of poses) { const act = ctl.get(clipName); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); if (after) after(body); body.updateMatrixWorld(true);
    for (const P of parts) { P.o.skeleton.update(); const n = P.pos.length / 3; for (let i = 0; i < n; i++) { P.o.getVertexPosition(i, v).applyMatrix4(P.o.matrixWorld); P.pos[i * 3] = v.x; P.pos[i * 3 + 1] = v.y; P.pos[i * 3 + 2] = v.z; } P.grid = null; }
    const grid = (X) => X.grid || (X.grid = clGrid(X.pos, X.idx, 0.03 * sc));
    for (const A of parts) for (const B of parts) { if (A === B || /^(Body|Skin)$/.test(B.name) || A.mat === B.mat || (/Sole|Shoes/.test(A.name) && /Sole|Shoes/.test(B.name)) || (skip && skip(A.name, B.name))) continue;   /* cloth outside the skin is always right; two pieces of one cloth (jacket and lapels) cannot show through each other; a sole wraps its shoe on purpose */
      const rel = clRelation(A, B); if (!rel) continue; const G = grid(B); let n = 0, worst = 0, wi = 0;
      for (const i of rel) { clPoint(A.pos, A.samples, i, p); const h = clNear(p, B.pos, B.idx, G); if (!h || h.side > 0.004 * sc || h.along <= 0.0005 * sc) continue; const al = h.along; let hid = false;
        for (const C of parts) { if (C === A || C === B || C.mat === A.mat) continue; const hc = clNear(p, C.pos, C.idx, grid(C)); if (hc && hc.side < 0.004 * sc && (hc.along < -0.0005 * sc || (/^(Belt|Buckle|Sash)/.test(C.name) && Math.abs(hc.along) < 0.012 * sc))) { hid = true; break; }   /* a belt is an open band whose faces may point either way: anything just under or inside it is hidden */ } if (hid) continue;   /* still under a third piece (a shirt through a waistcoat, under a jacket): nobody can see it */
        n++; if (marks) marks.push([p[0], p[1], p[2], A.name, B.name]); if (al > worst) { worst = al; wi = i; } }
      if (n) { clPoint(A.pos, A.samples, wi, p); const rp = [0, 0, 0]; clPoint(A.rest, A.samples, wi, rp); out.points += n; out.worst = Math.max(out.worst, worst / sc * 1000); out.lines.push(`${id} ${clipName}@${at}: ${A.name} shows through ${B.name}: ${n} points, worst ${(worst / sc * 1000).toFixed(1)} mm` + (where ? ` at x ${p[0].toFixed(3)} y ${p[1].toFixed(3)} z ${p[2].toFixed(3)} (rest ${rp.map((x) => x.toFixed(3)).join(' ')})` : '')); } } }
  ctl.mx.stopAllAction(); ctl.base.reset().play(); ctl.cur = ctl.base; ctl.mx.update(0); if (after) after(body);
  return out;
}
/* engine/skinprobe.js: measure how dark a face really looks in a game (dev only; see docs/PIPELINE.md, "Skin").
   skinProbe(renderer, scene, body) turns the person to four headings and for each puts a camera 70 cm in front of the face, renders the game's own scene and lights, finds the forehead and both cheeks
   by casting rays at the head (only hits on the Skin material count), and reads back the drawn pixels there. It returns { rgb, lo, hi, each }: colours 0 to 255 as drawn on screen (the mean, the darkest and lightest heading).
   The body must already be in the scene and posed. The camera and the drawing size are put back afterwards. */

function probeOnce(renderer, scene, body, dist, size) {
  body.updateMatrixWorld(true);
  const head = body.getObjectByName('mixamorigHead'); if (!head) return { rgb: [0, 0, 0], n: 0 };
  const sc = body.getWorldScale(new THREE.Vector3()).x || 1, H = head.getWorldPosition(new THREE.Vector3());
  const F = new THREE.Vector3(0, 0, 1).applyQuaternion(body.getWorldQuaternion(new THREE.Quaternion())).setY(0).normalize(), U = new THREE.Vector3(0, 1, 0), R = new THREE.Vector3().crossVectors(U, F).normalize();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 50); cam.position.copy(H).addScaledVector(F, dist * sc).addScaledVector(U, 0.06 * sc); cam.lookAt(H.clone().addScaledVector(U, 0.06 * sc)); cam.updateMatrixWorld(true);
  const old = renderer.getSize(new THREE.Vector2()), oldPR = renderer.getPixelRatio(); renderer.setPixelRatio(1); renderer.setSize(size, size, false);
  renderer.render(scene, cam);
  const gl = renderer.getContext(), ray = new THREE.Raycaster(), meshes = []; body.traverse((o) => { if (o.isMesh && o.visible) meshes.push(o); });
  const spots = [[0, 0.115], [0.038, 0.035], [-0.038, 0.035], [0, 0.09]], px = new Uint8Array(4), acc = [0, 0, 0]; let n = 0;
  for (const [dx, dy] of spots) {   /* forehead, the two cheeks, the brow */
    const target = H.clone().addScaledVector(R, dx * sc).addScaledVector(U, dy * sc), dir = target.clone().sub(cam.position).normalize(); ray.set(cam.position, dir);
    const hit = ray.intersectObjects(meshes, false)[0]; if (!hit || !/^Skin$/.test(hit.object.material.name || '')) continue;
    const p = hit.point.clone().project(cam), x = Math.round((p.x * 0.5 + 0.5) * size), y = Math.round((p.y * 0.5 + 0.5) * size);
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { gl.readPixels(x + ox, y + oy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); acc[0] += px[0]; acc[1] += px[1]; acc[2] += px[2]; n++; }
  }
  renderer.setPixelRatio(oldPR); renderer.setSize(old.x, old.y, false);
  return { rgb: n ? acc.map((v) => Math.round(v / n)) : [0, 0, 0], n };
}

/* the same, with the person turned to four headings (the sun is fixed, so a face can be lit, side-lit or in shade): returns { rgb: the mean, lo, hi: the darkest and lightest heading, each } */
export function skinProbe(renderer, scene, body, { dist = 0.7, size = 256, yaws = [0, Math.PI / 2, Math.PI, -Math.PI / 2] } = {}) {
  const ry = body.rotation.y, all = [];
  for (const y of yaws) { body.rotation.y = y; const r = probeOnce(renderer, scene, body, dist, size); if (r.n) all.push(r.rgb); }
  body.rotation.y = ry; if (!all.length) return { rgb: [0, 0, 0], lo: [0, 0, 0], hi: [0, 0, 0], each: [] };
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], srt = all.slice().sort((a, b) => lum(a) - lum(b));
  return { rgb: [0, 1, 2].map((k) => Math.round(all.reduce((a, c) => a + c[k], 0) / all.length)), lo: srt[0], hi: srt[srt.length - 1], each: all };
}
