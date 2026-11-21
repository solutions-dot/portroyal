// Compress character bodies and pack them for a game: node tools/people/pack.mjs --out games/kendal/site/models [--max 32000] [--lo] name1 name2 ...
// Reads build/people/<name>.glb (from tools/garvey/era.py), gives it the small eye texture, drops what is unused, trims it to at most --max triangles,
// compresses it (meshopt) and writes <out>/<name>.js. With --lo it also writes <name>_lo.js, a light copy (about 5,900 triangles) for crowds.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = () => new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const OUT = opt('--out', 'games/kendal/site/models'), MAX = +opt('--max', 32000), SMALL = 1300, WHOLE = /Collar|Lapels|Apron|Tie|Belt|Hat|Cap|Band|Sole|Wrap|Bonnet|Moustache|Puffs|Ribbons|Bun|Knot/   /* pieces that are never simplified */, LO = A.includes('--lo'), SRC = opt('--src', 'build/people'), CLOTH = /^(Shirt|Waistcoat|Jacket|JacketSkirt|Breeches|Skirt|Apron|Coat|CoatSkirt)$/, CLOTH_KEEP = +opt('--cloth', 0.36);   /* in a light copy the clothes keep this share of their triangles */
const names = A.filter((a, i) => !a.startsWith('--') && !['--out', '--max', '--src', '--cloth', '--lomax'].includes(A[i - 1]));
const eye = fs.readFileSync('shared/rig/eye_small.jpg');
const tris = (doc) => { let t = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3; return t | 0; };
const pack = (name, bin) => fs.writeFileSync(`${OUT}/${name}.js`, `(window.__models=window.__models||{})["${name}"]="${Buffer.from(bin).toString('base64')}";`);
/* Light copies only. Simplifying each garment on its own lets a waistcoat or a jacket dip under the shirt it lies on, so specks of shirt show on the dark cloth.
   After simplifying, lift the outer garment clear again: every point of it must sit at least GAP above the cloth beneath, and nothing beneath may come through one of its faces.
   Only the outer garment moves, and only outwards, so a shirt worn without its waistcoat (the game can hide it) is untouched and never sinks into the skin. */
const LAYERS = [['Body', 'Shirt'], ['Body', 'Breeches'], ['Body', 'Skirt'], ['Shirt', 'Breeches'], ['Shirt', 'Skirt'], ['Shirt', 'Waistcoat'], ['Shirt', 'Jacket'], ['Waistcoat', 'Jacket'], ['Shirt', 'JacketSkirt'], ['Waistcoat', 'JacketSkirt'], ['Breeches', 'JacketSkirt'], ['Breeches', 'Waistcoat'], ['Jacket', 'JacketSkirt']], GAP = 0.007, REACH = 0.03;
function closest(p, a, b, c) {   /* the nearest point of triangle abc to p (Ericson); returns [x, y, z] */
  const sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]], dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2], at = (u, v, t) => [u[0] + v[0] * t, u[1] + v[1] * t, u[2] + v[2] * t];
  const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a), d1 = dot(ab, ap), d2 = dot(ac, ap); if (d1 <= 0 && d2 <= 0) return a;
  const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp); if (d3 >= 0 && d4 <= d3) return b;
  const vc = d1 * d4 - d3 * d2; if (vc <= 0 && d1 >= 0 && d3 <= 0) return at(a, ab, d1 / (d1 - d3));
  const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp); if (d6 >= 0 && d5 <= d6) return c;
  const vb = d5 * d2 - d1 * d6; if (vb <= 0 && d2 >= 0 && d6 <= 0) return at(a, ac, d2 / (d2 - d6));
  const va = d3 * d6 - d5 * d4; if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) return at(b, sub(c, b), (d4 - d3) / ((d4 - d3) + (d5 - d6)));
  const dn = 1 / (va + vb + vc), v = vb * dn, w = vc * dn; return [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w];
}
function soup(doc, name) {   /* the triangles of one garment: positions (edited in place), indices, a face normal each, and which vertices share a spot */
  const nd = doc.getRoot().listNodes().find((x) => x.getName() === name && x.getMesh()); if (!nd) return null; const out = [];
  for (const p of nd.getMesh().listPrimitives()) { const P = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), I = p.getIndices(); if (!P || !I) continue; const pos = P.getArray(), nor = N ? N.getArray() : null, idx = I.getArray(), same = new Map();
    for (let i = 0; i < pos.length / 3; i++) { const k = pos[i * 3].toFixed(5) + ',' + pos[i * 3 + 1].toFixed(5) + ',' + pos[i * 3 + 2].toFixed(5); if (!same.has(k)) same.set(k, []); same.get(k).push(i); }
    out.push({ P, pos, nor, idx, groups: [...same.values()] }); }
  return out.length ? out : null;
}
const V = (pos, i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
function faceN(s, t) { const a = V(s.pos, s.idx[t * 3]), b = V(s.pos, s.idx[t * 3 + 1]), c = V(s.pos, s.idx[t * 3 + 2]), u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const l = Math.hypot(...n) || 1; n = n.map((x) => x / l);
  if (s.nor) { const i = s.idx[t * 3]; if (n[0] * s.nor[i * 3] + n[1] * s.nor[i * 3 + 1] + n[2] * s.nor[i * 3 + 2] < 0) n = n.map((x) => -x); } return { a, b, c, n }; }
function nearest(p, surf) {   /* the nearest point of a garment to p: { d: [p - point], n: that face's normal, s, t } or null if nothing is within REACH */
  let best = null, bd = REACH * REACH; for (const s of surf) for (let t = 0; t < s.idx.length / 3; t++) { const f = faceN(s, t), q = closest(p, f.a, f.b, f.c), d = [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2]; if (dd < bd) { bd = dd; best = { d, n: f.n, s, t }; } } return best; }
function liftLayers(doc) {
  let moved = 0;
  for (const [inner, outer] of LAYERS) { const In = soup(doc, inner), Out = soup(doc, outer); if (!In || !Out) continue;
    for (let pass = 0; pass < 3; pass++) {
      for (const s of Out) for (const g of s.groups) { const p = V(s.pos, g[0]), h = nearest(p, In); if (!h) continue;   /* a point of the outer garment that is under, or too close to, the cloth beneath */
        const along = h.d[0] * h.n[0] + h.d[1] * h.n[1] + h.d[2] * h.n[2], side = Math.hypot(h.d[0] - h.n[0] * along, h.d[1] - h.n[1] * along, h.d[2] - h.n[2] * along); if (side > 0.004 || along >= GAP || along < -0.012) continue;   /* off the edge of the cloth beneath: nothing is under it there. A point far beneath is on the other side of a thin limb, not a dip: leave it */
        for (const i of g) for (let k = 0; k < 3; k++) s.pos[i * 3 + k] += h.n[k] * (GAP - along); moved++; }
      for (const s of In) for (const g of s.groups) { const p = V(s.pos, g[0]), h = nearest(p, Out); if (!h) continue;   /* a point of the cloth beneath that comes through, or nearly through, a face of the outer garment: lift that face */
        const along = h.d[0] * h.n[0] + h.d[1] * h.n[1] + h.d[2] * h.n[2], side = Math.hypot(h.d[0] - h.n[0] * along, h.d[1] - h.n[1] * along, h.d[2] - h.n[2] * along); if (side > 0.004 || along <= -GAP || along > (/^(Waistcoat|Shirt)$/.test(inner) && /^Jacket/.test(outer) ? 0.03 : 0.012)) continue;   /* a jacket simplified to large faces can sag well inside the waistcoat: lift it even then */
        const push = along + GAP, o = h.s, done = new Set(); for (let c = 0; c < 3; c++) { const vi = o.idx[h.t * 3 + c], grp = o.groups.find((x) => x.includes(vi)) || [vi]; for (const i of grp) { if (done.has(i)) continue; done.add(i); for (let k = 0; k < 3; k++) o.pos[i * 3 + k] += h.n[k] * push; } } moved++; }
    }
    for (const s of Out) s.P.setArray(s.pos); }
  return moved;
}
function simplifyHead(p, indices, count, error, colorWeight) {
  const input = Uint32Array.from(indices);
  if (count * 3 >= input.length) return input;
  const positions = Float32Array.from(p.getAttribute('POSITION').getArray());
  const color = p.getAttribute('COLOR_0'), normal = p.getAttribute('NORMAL'), attributes = new Float32Array(positions.length * 2);
  for (let i = 0, c = [], n = []; i < positions.length / 3; i++) {
    if (color) { color.getElement(i, c); attributes.set(c.slice(0, 3), i * 6); }
    if (normal) { normal.getElement(i, n); attributes.set(n, i * 6 + 3); }
  }
  const weights = [colorWeight, colorWeight, colorWeight, 0.05, 0.05, 0.05];
  return MeshoptSimplifier.simplifyWithAttributes(input, positions, 3, attributes, 6, weights, null, count * 3, error, ['LockBorder', 'ErrorAbsolute'])[0];
}

/* Keep the brow, lids and lips marked by era.py, and simplify the crown and hairline separately from the torso.
   Joined crowd bodies still have Head weights on the crown. Keep short hair there without reserving the same detail
   for locs that hang below the head. Locked borders keep the pieces joined to the surrounding skin. */
function splitFaces(doc, goal) {
  const made = [];
  const compact = goal < 10000;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(), skin = node.getSkin();
    if (!mesh || !skin) continue;
    const head = skin.listJoints().findIndex((bone) => /(?:^|:)Head$/.test(bone.getName()));
    for (const p of mesh.listPrimitives()) {
      const marks = p.getAttribute('_FACE');
      if (!marks) continue;
      const f = marks.getArray(), idx = p.getIndices().getArray(), inF = [], crown = [], rest = [];
      let low = Infinity, high = -Infinity;
      const positions = p.getAttribute('POSITION').getArray();
      for (let i = 0; i < f.length; i++) if (f[i] > 0.5) {
        low = Math.min(low, positions[3 * i + 1]);
        high = Math.max(high, positions[3 * i + 1]);
      }
      p.setAttribute('_FACE', null);
      if (!Number.isFinite(low)) continue;
      const upperHead = new Uint8Array(f.length);
      const joints = p.getAttribute('JOINTS_0'), weights = p.getAttribute('WEIGHTS_0');
      const hairline = low + (high - low) * 0.45;
      if (compact && p.getMaterial()?.getName() === 'Crowd' && head >= 0 && joints && weights) {
        for (let i = 0, j = [], w = []; i < f.length; i++) {
          if (positions[3 * i + 1] < hairline) continue;
          joints.getElement(i, j); weights.getElement(i, w);
          upperHead[i] = j.some((bone, k) => bone === head && w[k] > 0.75) ? 1 : 0;
        }
      }
      for (let i = 0; i < idx.length; i += 3) {
        const a = idx[i], b = idx[i + 1], c = idx[i + 2];
        const target = f[a] > 0.5 && f[b] > 0.5 && f[c] > 0.5 ? inF :
          upperHead[a] && upperHead[b] && upperHead[c] ? crown : rest;
        target.push(a, b, c);
      }
      if (inF.length < 300 || !rest.length) continue;
      const face = goal > 20000 ? inF : simplifyHead(p, inF, Math.max(1050, Math.floor(goal * 0.18)), 0.012, 1);
      const top = simplifyHead(p, crown, 475, 0.004, 0.4);
      const out = [...face, ...top];
      const used = new Map(); for (const i of out) if (!used.has(i)) used.set(i, used.size);
      const q = doc.createPrimitive().setMaterial(p.getMaterial()).setMode(p.getMode());
      for (const sem of p.listSemantics()) { const A = p.getAttribute(sem), B = A.clone(), size = A.getElementSize(), src = A.getArray(), dst = new src.constructor(used.size * size);
        for (const [i, k] of used) for (let c = 0; c < size; c++) dst[k * size + c] = src[i * size + c]; q.setAttribute(sem, B.setArray(dst)); }
      q.setIndices(doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from(out, (i) => used.get(i))).setBuffer(p.getIndices().getBuffer()));
      p.setIndices(p.getIndices().clone().setArray(Uint32Array.from(rest))); mesh.addPrimitive(q); made.push(q);
    }
  }
  return made;
}
/* the hands, like the face, are kept out of the general simplification (owner, 17 November 2026: "fingers ... we did it before ... this regression"). Since the face
   got its own share of triangles (splitFaces), the rest of the skin was cut harder and every finger collapsed into a long spike. Triangles bound wholly to hand and finger
   bones become their own piece, simplified gently (keep(n) triangles, never below 60 per cent on a full body), so fingers keep their shape in every game. */
function splitHands(doc, keepFrac) {
  const made = [];
  for (const node of doc.getRoot().listNodes()) { const mesh = node.getMesh(), skin = node.getSkin(); if (!mesh || !skin) continue; const names = skin.listJoints().map((j) => j.getName());
    const isHand = names.map((nm) => /Hand(Thumb|Index|Middle|Ring|Pinky)?\d?$/.test(nm || '') && /Hand/.test(nm || ''));
    for (const p of mesh.listPrimitives()) { const mat = p.getMaterial(); if (!mat || !/^(Skin|Body)$/.test(mat.getName() || '')) continue; const J = p.getAttribute('JOINTS_0'), Wt = p.getAttribute('WEIGHTS_0'); if (!J || !Wt) continue;
      const nV = J.getCount(), hand = new Uint8Array(nV), ej = [0, 0, 0, 0], ew = [0, 0, 0, 0];
      for (let i = 0; i < nV; i++) { J.getElement(i, ej); Wt.getElement(i, ew); let w = 0; for (let k = 0; k < 4; k++) if (isHand[ej[k]]) w += ew[k]; hand[i] = w > 0.5 ? 1 : 0; }
      const idx = p.getIndices().getArray(), inH = [], rest = []; for (let i = 0; i < idx.length; i += 3) (hand[idx[i]] && hand[idx[i + 1]] && hand[idx[i + 2]] ? inH : rest).push(idx[i], idx[i + 1], idx[i + 2]);
      if (inH.length < 60 || !rest.length) continue;
      let out = Uint32Array.from(inH); const target = Math.max(240, Math.floor(inH.length / 3 * keepFrac)) * 3;
      if (target < out.length) { const pos = p.getAttribute('POSITION').getArray(); out = MeshoptSimplifier.simplify(out, pos instanceof Float32Array ? pos : Float32Array.from(pos), 3, target, 0.01, ['LockBorder'])[0]; }
      const used = new Map(); for (const i of out) if (!used.has(i)) used.set(i, used.size);
      const q = doc.createPrimitive().setMaterial(mat).setMode(p.getMode());
      for (const sem of p.listSemantics()) { const A = p.getAttribute(sem), B = A.clone(), size = A.getElementSize(), src = A.getArray(), dst = new src.constructor(used.size * size); for (const [i, k] of used) for (let c = 0; c < size; c++) dst[k * size + c] = src[i * size + c]; q.setAttribute(sem, B.setArray(dst)); }
      q.setIndices(doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from(out, (i) => used.get(i))).setBuffer(p.getIndices().getBuffer()));
      p.setIndices(p.getIndices().clone().setArray(Uint32Array.from(rest))); mesh.addPrimitive(q); made.push(q); } }
  return made;
}
for (const n of names) {
  const make = async (ratioOf, light) => {
    const doc = await io().read(`${SRC}/${n}.glb`);
    if (light) for (const nd of doc.getRoot().listNodes()) if (/^(Buttons|JButtons|WaistcoatButtons|Placket|Buckle)/.test(nd.getName())) { nd.setMesh(null); nd.setSkin(null); }   /* too small to see in a crowd (lapels stay: they cover the edge of the jacket's opening) */
    for (const t of doc.getRoot().listTextures()) { t.setImage(new Uint8Array(eye)); t.setMimeType('image/jpeg'); }
    for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const mat = p.getMaterial(); if (!mat || !mat.getBaseColorTexture()) p.setAttribute('TEXCOORD_0', null); else for (const k of p.listSemantics()) if (/^COLOR_/.test(k)) p.setAttribute(k, null); }   /* the eyes are drawn from their picture alone: joined into a crowd body they were given black, clear vertex colours, and every eye in the crowd vanished */
    await doc.transform(weld(), prune({ keepAttributes: true, keepLeaves: true }));
    const t0 = tris(doc), ratio = ratioOf(t0), goal = t0 * ratio;
    const faces = new Set(ratio < 0.98 ? [...splitFaces(doc, goal), ...splitHands(doc, goal > 20000 ? 0.8 : 0.35)] : []);
    for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) p.setAttribute('_FACE', null);
    await doc.transform(prune({ keepAttributes: false, keepLeaves: true }));
    if (ratio < 0.98) {   /* trim only the big pieces (skin, shirt, trousers, skirt): small ones such as a collar, a belt or a hat band fall apart if they are simplified, so they are kept whole */
      const whole = new Set(doc.getRoot().listNodes().filter((nd) => nd.getMesh() && WHOLE.test(nd.getName())).map((nd) => nd.getMesh())), cloth = new Set(doc.getRoot().listNodes().filter((nd) => nd.getMesh() && CLOTH.test(nd.getName())).map((nd) => nd.getMesh()));
      const prims = []; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const n = p.getIndices().getCount() / 3; prims.push({ p, n, kind: faces.has(p) || (p.getMaterial() && p.getMaterial().getBaseColorTexture()) || whole.has(m) || n < (light ? 260 : SMALL) ? 'keep' : (light && cloth.has(m)) ? 'cloth' : 'rest' }); }   /* the face (already trimmed above) and the eyes are kept as they are */
      const sum = (k) => prims.filter((x) => x.kind === k).reduce((a, x) => a + x.n, 0);
      const only = async (kind, r, error) => {   /* simplify the pieces of one kind and put every other piece back as it was; edges of cloth (hems, cuffs, necklines) are never moved, so they stay clean */
        if (r >= 1) return;
        const save = prims.filter((x) => x.kind !== kind).map((x) => ({ p: x.p, idx: x.p.getIndices().clone(), at: x.p.listSemantics().map((k) => [k, x.p.getAttribute(k).clone()]) }));
        await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: r, error, lockBorder: true })); for (const k of save) { k.p.setIndices(k.idx); for (const [nm, at] of k.at) k.p.setAttribute(nm, at); } };
      if (light) {   /* a light copy: the clothes keep more of their shape than the skin does (a shirt cut to a tenth crumples, and specks of it show through the waistcoat), and the body pays for it */
        const cl = sum('cloth'); if (cl) await only('cloth', Math.min(CLOTH_KEEP, 1900 / cl), 0.004);   /* at most about 1,900 triangles of cloth, so the face keeps its share and a body with a long full skirt stays light */
        const clNow = prims.filter((x) => x.kind === 'cloth').reduce((a, x) => a + x.p.getIndices().getCount() / 3, 0);
        await only('rest', Math.max(0.05, (t0 * ratio - sum('keep') - clNow) / sum('rest')), +opt('--lomax', 5900) < 5900 ? 0.03 : 0.012);
      } else await only('rest', Math.max(0.05, (t0 * ratio - sum('keep')) / sum('rest')), 0.02);
      await doc.transform(prune({ keepAttributes: false, keepLeaves: true }));
      if (light) liftLayers(doc);
    }
    const t1 = tris(doc); await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    return { bin: await io().writeBinary(doc), t0, t1 };
  };
  const full = await make((t) => Math.min(1, MAX / t)); pack(n, full.bin);
  let msg = `${n}: ${full.t0} -> ${full.t1} tris, ${(full.bin.length * 4 / 3 / 1024) | 0} KB`;
  if (LO) { const lo = await make((t) => Math.min(1, +opt('--lomax', 5900) / t), true); pack(n + '_lo', lo.bin); msg += `; lo ${lo.t1} tris, ${(lo.bin.length * 4 / 3 / 1024) | 0} KB`; }
  console.log(msg);
}
