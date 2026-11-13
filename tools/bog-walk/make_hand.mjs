// Make the first-person hand for Bog Walk: node tools/bog-walk/make_hand.mjs [model] [key=value ...]
//   Takes one of the shared character models (default hl_worker, from games/kendal/site/models/), which has a fully modelled hand with finger bones,
//   closes the right hand round a torch handle, and writes the posed hand and forearm as a small still mesh to games/bog-walk/src/handmesh.js.
//   The game (games/bog-walk/src/hand.js) puts a torch in it. Nothing here runs in the game: this is a build tool, like tools/kendal/make_lo.mjs.
// How the grip is made (no hand-set positions, so it works for any of the shared bodies):
//   1. Each finger joint is bent by a base angle times one "closure" number. The closure is searched for, so that the largest circle that fits inside the
//      closed fingers is exactly as big as the handle. Then every finger joint is nudged until its own skin just touches the handle.
//   2. The thumb is laid up along the handle (its tip as high above the index finger as its length allows) and pressed onto it.
//   3. The wrist is turned so that the forearm leaves toward the lower right of the screen, as your own arm does.
//   The mesh is written in "grip space": the handle is the y axis through (0, y, 0), +y is toward the thumb (the flame end), +z is toward the wrist (toward you),
//   +x is toward the back of the hand, and the middle of the fist is at the origin.
// Options (all optional): rh=0.0148 handle radius, mcp= pip= dip= extra degrees for all fingers, roll= thumb roll in degrees, lift= thumb tip height above the
//   index finger in metres, fx= fy= fz= the direction of the forearm in grip space, out= output file.
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

const args = process.argv.slice(2), model = args.find((a) => !a.includes('=')) || 'hl_worker', opt = Object.fromEntries(args.filter((a) => a.includes('=')).map((a) => a.split('=')));
const num = (k, d) => (k in opt ? parseFloat(opt[k]) : d), RH = num('rh', 0.0148), DEG = Math.PI / 180;
const src = readFileSync(`games/kendal/site/models/${model}.js`, 'utf8'), buf = Buffer.from(src.match(/"([A-Za-z0-9+/=]+)"/)[1], 'base64');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.readBinary(new Uint8Array(buf)), root = doc.getRoot();

/* ---------- the skeleton, as plain three.js objects ---------- */
const objs = new Map();
for (const n of root.listNodes()) { const o = new THREE.Object3D(); o.name = n.getName().replace('mixamorig:', ''); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); objs.set(n, o); }
for (const n of root.listNodes()) for (const c of n.listChildren()) objs.get(n).add(objs.get(c));
const top = new THREE.Object3D(); for (const s of root.listScenes()) for (const c of s.listChildren()) top.add(objs.get(c));
const J = (name) => { const o = [...objs.values()].find((x) => x.name === name); if (!o) throw new Error('no joint ' + name); return o; };
const wp = (name) => { top.updateMatrixWorld(true); return J(name).getWorldPosition(new THREE.Vector3()); };
function turn(name, axis, angle) {   /* turn a joint about an axis given in world space (its children follow) */
  if (!angle) return; top.updateMatrixWorld(true); const o = J(name), pq = o.parent.getWorldQuaternion(new THREE.Quaternion()), q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  o.quaternion.premultiply(pq.clone().invert().multiply(q).multiply(pq));
}
function turnQ(name, q) { top.updateMatrixWorld(true); const o = J(name), pq = o.parent.getWorldQuaternion(new THREE.Quaternion()); o.quaternion.premultiply(pq.clone().invert().multiply(q).multiply(pq)); }

/* ---------- the skin and the shirt: vertices, weights, and which joint each vertex mostly follows ---------- */
const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'], HANDJ = new Set(['RightHand', ...['Index', 'Middle', 'Ring', 'Pinky', 'Thumb'].flatMap((f) => [1, 2, 3].map((i) => 'RightHand' + f + i))]);
function readPrim(matName) {
  for (const n of root.listNodes()) { const mesh = n.getMesh(), skin = n.getSkin(); if (!mesh || !skin) continue;
    for (const p of mesh.listPrimitives()) { if (p.getMaterial().getName() !== matName) continue;
      const joints = skin.listJoints().map((j) => objs.get(j)), ibmA = skin.getInverseBindMatrices(), ibm = joints.map((_, i) => new THREE.Matrix4().fromArray(ibmA.getElement(i, [])));
      const P = p.getAttribute('POSITION'), JN = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'), C = p.getAttribute('COLOR_0'), n0 = P.getCount(), I = p.getIndices();
      const pos = [], jn = [], wt = [], col = [], dom = [];
      for (let i = 0; i < n0; i++) { pos.push(P.getElement(i, [])); const a = JN.getElement(i, []), b = W.getElement(i, []); jn.push(a); wt.push(b); col.push(C ? C.getElement(i, []) : [1, 1, 1, 1]); let k = 0; for (let q = 1; q < 4; q++) if (b[q] > b[k]) k = q; dom.push(joints[a[k]].name); }
      const idx = []; for (let i = 0; i < I.getCount(); i++) idx.push(I.getScalar(i));
      return { joints, ibm, pos, jn, wt, col, dom, idx, rough: p.getMaterial().getRoughnessFactor() }; } }
  return null;
}
const skin = readPrim('Skin'), shirt = readPrim('Shirt');
const v = new THREE.Vector3(), m = new THREE.Matrix4(), acc = new THREE.Vector3();
function skinned(prim, list) {   /* the positions of some vertices of a mesh, in the pose the skeleton is in now */
  top.updateMatrixWorld(true); const mats = prim.joints.map((j, i) => new THREE.Matrix4().multiplyMatrices(j.matrixWorld, prim.ibm[i])), out = [];
  for (const i of list) { acc.set(0, 0, 0); const w = prim.wt[i], a = prim.jn[i]; let s = 0; for (let q = 0; q < 4; q++) { if (!w[q]) continue; v.fromArray(prim.pos[i]).applyMatrix4(mats[a[q]]); acc.addScaledVector(v, w[q]); s += w[q]; } out.push(acc.clone().multiplyScalar(1 / (s || 1))); }
  return out;
}
const vertsOf = (pred) => skin.dom.map((d, i) => (pred(d) ? i : -1)).filter((i) => i >= 0);

/* ---------- the hand's own directions, from where its joints are: along the fingers, across the knuckles (toward the index finger), and out of the palm ---------- */
function axes() { const f = wp('RightHandMiddle2').sub(wp('RightHandMiddle1')).normalize(), k = wp('RightHandIndex1').sub(wp('RightHandPinky1')).normalize(); k.addScaledVector(f, -k.dot(f)).normalize(); return { f, k, p: new THREE.Vector3().crossVectors(k, f).normalize() }; }
const REST = Object.fromEntries([...objs.values()].map((o) => [o.name, o.quaternion.clone()]));
const BASE = { Index: [56, 82, 44], Middle: [60, 86, 46], Ring: [64, 86, 46], Pinky: [70, 84, 44] };   /* knuckle, middle joint, end joint, in degrees, before the closure is applied */
const extra = [num('mcp', 0), num('pip', 0), num('dip', 0)], nudge = Object.fromEntries(FINGERS.map((f) => [f, [0, 0, 0]]));
function poseFingers(c) {
  for (const f of ['Index', 'Middle', 'Ring', 'Pinky', 'Thumb']) for (const i of [1, 2, 3]) J('RightHand' + f + i).quaternion.copy(REST['RightHand' + f + i]);
  const A = axes();
  for (const f of FINGERS) for (const i of [0, 1, 2]) turn('RightHand' + f + (i + 1), A.k, (BASE[f][i] * c + extra[i] + nudge[f][i]) * DEG);
  for (const [f, a] of [['Index', -4], ['Ring', 3], ['Pinky', 7]]) turn('RightHand' + f + 1, A.p, a * DEG * num('close', 1));   /* bring the fingers together, side by side */
}

/* ---------- where the handle goes: the largest circle that fits inside the closed fingers, looking along the knuckles ---------- */
const fingerVerts = vertsOf((d) => HANDJ.has(d) && !/Thumb/.test(d));
function tunnel() {
  const A = axes(), o = wp('RightHandMiddle1'), pts = skinned(skin, fingerVerts).map((q) => { q.sub(o); return [q.dot(A.f), q.dot(A.p), q.dot(A.k)]; });
  const k0 = wp('RightHandPinky1').sub(o).dot(A.k) - 0.012, k1 = wp('RightHandIndex1').sub(o).dot(A.k) + 0.012, P2 = pts.filter((q) => q[2] > k0 && q[2] < k1);
  let best = null;
  for (let a = -0.03; a <= 0.07; a += 0.001) for (let b = -0.005; b <= 0.07; b += 0.001) {
    let d = 1e9; const seen = new Uint8Array(12);
    for (const q of P2) { const dx = q[0] - a, dy = q[1] - b, r = Math.hypot(dx, dy); if (r < d) d = r; if (r < 0.055) seen[Math.floor((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2) * 12) % 12] = 1; }
    if (seen.reduce((s, x) => s + x, 0) < 10) continue;   /* it must be closed in on nearly every side, or it is not inside the fist */
    if (!best || d > best.r) best = { a, b, r: d };
  }
  if (!best) return null;
  return { r: best.r, C: o.clone().addScaledVector(A.f, best.a).addScaledVector(A.p, best.b), A, kMid: (k0 + k1) / 2, o };
}
let lo = 0.55, hi = 1.3, c = 1, T = null;
for (let it = 0; it < 18; it++) { c = (lo + hi) / 2; poseFingers(c); T = tunnel(); const r = T ? T.r : 1; if (r > RH + 0.0006) lo = c; else hi = c; }
poseFingers(c); T = tunnel(); if (!T) throw new Error('the fingers never closed round the handle');
const radial = (q, C, k) => { const d = q.clone().sub(C); d.addScaledVector(k, -d.dot(k)); return d; };
/* every finger joint is nudged until its own part of the finger just touches the handle (and never goes into it) */
for (let pass = 0; pass < 3; pass++) for (const f of FINGERS) for (const i of [0, 1, 2]) {
  const list = vertsOf((d) => d === 'RightHand' + f + (i + 1)), gap = () => Math.min(...skinned(skin, list).map((q) => radial(q, T.C, T.A.k).length())) - RH;
  let g = gap(), n = 0; while (g > 0.0009 && n++ < 14) { nudge[f][i] += 1; poseFingers(c); g = gap(); } n = 0; while (g < -0.0004 && n++ < 14) { nudge[f][i] -= 1; poseFingers(c); g = gap(); }
}
poseFingers(c);

/* ---------- the thumb: laid up along the handle, its tip as high above the index finger as it will reach, then pressed onto the handle ---------- */
const Yh = T.A.k.clone(), C = T.C.clone();
const thumbV = [1, 2, 3].map((i) => vertsOf((d) => d === 'RightHandThumb' + i)), thumbAll = thumbV.flat();
const tipOf = () => { const b = wp('RightHandThumb3'), dir = b.clone().sub(wp('RightHandThumb2')).normalize(); let best = null, bd = -1e9; for (const q of skinned(skin, thumbV[2])) { const d = q.clone().sub(b).dot(dir); if (d > bd) { bd = d; best = q; } } return best; };
{ const B = wp('RightHandThumb1'), tip = tipOf(), L = tip.distanceTo(B), rB = radial(B, C, Yh), hB = B.clone().sub(C).dot(Yh), ang = num('tang', 14) * DEG;
  const dirB = rB.clone().normalize(), side = new THREE.Vector3().crossVectors(Yh, dirB), dirT = dirB.clone().multiplyScalar(Math.cos(ang)).addScaledVector(side, Math.sin(ang)), rhoT = RH + 0.0098;
  const planar = dirT.clone().multiplyScalar(rhoT).sub(rB).length(), rise = Math.sqrt(Math.max(1e-6, L * L - planar * planar)), target = C.clone().addScaledVector(Yh, hB + rise).addScaledVector(dirT, rhoT);
  turnQ('RightHandThumb1', new THREE.Quaternion().setFromUnitVectors(tip.clone().sub(B).normalize(), target.clone().sub(B).normalize()));
  const dirNow = () => tipOf().sub(wp('RightHandThumb1')).normalize();
  turn('RightHandThumb1', dirNow(), num('roll', 0) * DEG);
  for (const i of [1, 2, 3]) {   /* press each part of the thumb onto the handle, base first */
    const name = 'RightHandThumb' + i, list = thumbV.slice(i - 1).flat(), gap = () => Math.min(...skinned(skin, list).map((q) => radial(q, C, Yh).length())) - RH;
    const axisIn = () => { const b = wp(name), d = dirNow(), inw = radial(b, C, Yh).multiplyScalar(-1).normalize(); return new THREE.Vector3().crossVectors(d, inw).normalize(); };
    let g = gap(), n = 0; while (g > 0.0008 && n++ < (i === 1 ? 30 : 22)) { turn(name, axisIn(), 1 * DEG); g = gap(); } n = 0; while (g < -0.0003 && n++ < 40) { turn(name, axisIn(), -1 * DEG); g = gap(); }
  } }

/* ---------- the wrist: turn the hand on the forearm so the forearm leaves toward the lower right, toward you ---------- */
function frame() {   /* grip space: x toward the back of the hand, y up the handle, z toward the wrist */
  const y = Yh.clone().normalize(), w = wp('RightHand').sub(C), z = w.addScaledVector(y, -w.dot(y)).normalize(), x = new THREE.Vector3().crossVectors(y, z).normalize();
  const hI = wp('RightHandIndex2').sub(C).dot(y), hP = wp('RightHandPinky2').sub(C).dot(y), O = C.clone().addScaledVector(y, (hI + hP) / 2);
  return { x, y, z, O, M: new THREE.Matrix4().makeBasis(x, y, z).setPosition(O) };
}
{ const G = frame(), want = new THREE.Vector3(num('fx', 0.18), num('fy', -0.46), num('fz', 0.87)).normalize().applyMatrix4(new THREE.Matrix4().extractRotation(G.M)), have = wp('RightForeArm').sub(wp('RightHand')).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(want, have); turnQ('RightHand', q);
  /* the handle axis and its middle are fixed to the hand, so they turn with it */
  const piv = wp('RightHand'); C.sub(piv).applyQuaternion(q).add(piv); Yh.applyQuaternion(q);
  console.log('wrist turned', (2 * Math.acos(Math.min(1, Math.abs(q.w))) / DEG).toFixed(0), 'degrees'); }
const G = frame(), inv = G.M.clone().invert();

/* ---------- cut out the hand and forearm (and the shirt sleeve over the forearm), in grip space ---------- */
function cut(prim, keep, tint) {
  const use = new Map(), tris = [];
  for (let t = 0; t < prim.idx.length; t += 3) { const a = prim.idx[t], b = prim.idx[t + 1], d = prim.idx[t + 2]; if (!(keep(prim.dom[a]) && keep(prim.dom[b]) && keep(prim.dom[d]))) continue; for (const i of [a, b, d]) if (!use.has(i)) use.set(i, use.size); tris.push(use.get(a), use.get(b), use.get(d)); }
  const list = [...use.keys()], pos = skinned(prim, list).map((q) => q.applyMatrix4(inv)), col = list.map((i) => prim.col[i].slice(0, 3).map((x, j) => x * (tint ? tint[j] : 1)));
  return { pos, col, tris, dom: list.map((i) => prim.dom[i]) };
}
const handPart = cut(skin, (d) => HANDJ.has(d) || d === 'RightForeArm'), sleevePart = shirt ? cut(shirt, (d) => d === 'RightForeArm') : { pos: [], col: [], tris: [], dom: [] };
const all = handPart.pos.concat(sleevePart.pos), box = new THREE.Box3().setFromPoints(all), S = Math.max(...box.min.toArray().map(Math.abs), ...box.max.toArray()) / 32767;
const b64 = (ta) => Buffer.from(ta.buffer, ta.byteOffset, ta.byteLength).toString('base64');
const pack = (part) => ({ n: part.pos.length, pos: b64(new Int16Array(part.pos.flatMap((q) => [Math.round(q.x / S), Math.round(q.y / S), Math.round(q.z / S)]))), col: b64(new Uint8Array(part.col.flatMap((q) => q.map((x) => Math.max(0, Math.min(255, Math.round(x * 255))))))), idx: b64(new Uint16Array(part.tris)) });

/* ---------- facts the game and its checks need: where each finger and the thumb are, and how well they hold the handle ---------- */
const gp = (name) => wp(name).applyMatrix4(inv), report = { model, handleRadius: RH, closure: +c.toFixed(3), scale: S, fingers: {}, thumb: {} };
const cyl = (q) => Math.hypot(q.x, q.z);
for (const f of FINGERS) { const list = handPart.dom.map((d, i) => (d.startsWith('RightHand' + f) ? i : -1)).filter((i) => i >= 0), pts = list.map((i) => handPart.pos[i]);
  const angs = pts.map((q) => Math.atan2(q.z, q.x)), seen = new Uint8Array(36); for (const a of angs) seen[Math.floor((a + Math.PI) / (Math.PI * 2) * 36) % 36] = 1;
  report.fingers[f] = { y: +(pts.reduce((s, q) => s + q.y, 0) / pts.length).toFixed(4), minGap: +(Math.min(...pts.map(cyl)) - RH).toFixed(4), wrapDegrees: seen.reduce((s, x) => s + x, 0) * 10, verts: pts.length }; }
{ const list = handPart.dom.map((d, i) => (/Thumb/.test(d) ? i : -1)).filter((i) => i >= 0), pts = list.map((i) => handPart.pos[i]); report.thumb = { topY: +Math.max(...pts.map((q) => q.y)).toFixed(4), minGap: +(Math.min(...pts.map(cyl)) - RH).toFixed(4), tip: gp('RightHandThumb3').toArray().map((x) => +x.toFixed(4)) }; }
report.forearm = wp('RightForeArm').sub(wp('RightHand')).normalize().applyMatrix4(new THREE.Matrix4().extractRotation(inv)).toArray().map((x) => +x.toFixed(3));
report.wrist = gp('RightHand').toArray().map((x) => +x.toFixed(4)); report.elbow = gp('RightForeArm').toArray().map((x) => +x.toFixed(4));
report.box = [box.min.toArray().map((x) => +x.toFixed(3)), box.max.toArray().map((x) => +x.toFixed(3))];
report.skinColour = handPart.col.reduce((s, q) => s.map((x, j) => x + q[j] / handPart.col.length), [0, 0, 0]).map((x) => +x.toFixed(3));
const outFile = opt.out || 'games/bog-walk/src/handmesh.js';
writeFileSync(outFile, `/* Made by tools/bog-walk/make_hand.mjs from the shared character model "${model}". Do not edit by hand: run the tool again.\n   A right hand closed round a handle of radius ${RH} m, with its forearm and sleeve, in grip space (the handle is the y axis, +y toward the thumb,\n   +z toward the wrist, the middle of the fist at the origin). Positions are 16-bit numbers times "scale"; colours are 8-bit, per vertex. */\nexport const HANDMESH = ${JSON.stringify({ info: report, skin: pack(handPart), sleeve: pack(sleevePart) })};\n`);
console.log(JSON.stringify(report, null, 1)); console.log('wrote', outFile, 'hand verts', handPart.pos.length, 'tris', handPart.tris.length / 3, '| sleeve verts', sleevePart.pos.length, 'tris', sleevePart.tris.length / 3);
