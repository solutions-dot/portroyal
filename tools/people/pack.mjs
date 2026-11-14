// Compress character bodies and pack them for a game: node tools/people/pack.mjs --out games/kendal/site/models [--max 32000] [--lo] name1 name2 ...
// Reads build/people/<name>.glb (from tools/garvey/era.py), gives it the small eye texture, drops what is unused, trims it to at most --max triangles,
// compresses it (meshopt) and writes <out>/<name>.js. With --lo it also writes <name>_lo.js, a light copy (about a fifth of the triangles) for crowds.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = () => new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const OUT = opt('--out', 'games/kendal/site/models'), MAX = +opt('--max', 32000), SMALL = 1300, WHOLE = /Collar|Tie|Belt|Hat|Cap|Band|Sole|Wrap|Bonnet|Moustache|Puffs|Ribbons|Bun|Knot/   /* pieces that are never simplified */, LO = A.includes('--lo'), SRC = opt('--src', 'build/people');
const names = A.filter((a, i) => !a.startsWith('--') && !['--out', '--max', '--src'].includes(A[i - 1]));
const eye = fs.readFileSync('shared/rig/eye_small.jpg');
const tris = (doc) => { let t = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3; return t | 0; };
const pack = (name, bin) => fs.writeFileSync(`${OUT}/${name}.js`, `(window.__models=window.__models||{})["${name}"]="${Buffer.from(bin).toString('base64')}";`);
/* Light copies only. Simplifying each garment on its own lets a waistcoat or a jacket dip under the shirt it lies on, so specks of shirt show on the dark cloth.
   After simplifying, lift the outer garment clear again: every point of it must sit at least GAP above the cloth beneath, and nothing beneath may come through one of its faces.
   Only the outer garment moves, and only outwards, so a shirt worn without its waistcoat (the game can hide it) is untouched and never sinks into the skin. */
const LAYERS = [['Shirt', 'Waistcoat'], ['Shirt', 'Jacket'], ['Waistcoat', 'Jacket'], ['Shirt', 'JacketSkirt'], ['Waistcoat', 'JacketSkirt'], ['Breeches', 'JacketSkirt'], ['Breeches', 'Waistcoat']], GAP = 0.007, REACH = 0.03;
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
        const along = h.d[0] * h.n[0] + h.d[1] * h.n[1] + h.d[2] * h.n[2], side = Math.hypot(h.d[0] - h.n[0] * along, h.d[1] - h.n[1] * along, h.d[2] - h.n[2] * along); if (side > 0.004 || along >= GAP) continue;   /* off the edge of the cloth beneath: nothing is under it there */
        for (const i of g) for (let k = 0; k < 3; k++) s.pos[i * 3 + k] += h.n[k] * (GAP - along); moved++; }
      for (const s of In) for (const g of s.groups) { const p = V(s.pos, g[0]), h = nearest(p, Out); if (!h) continue;   /* a point of the cloth beneath that comes through, or nearly through, a face of the outer garment: lift that face */
        const along = h.d[0] * h.n[0] + h.d[1] * h.n[1] + h.d[2] * h.n[2], side = Math.hypot(h.d[0] - h.n[0] * along, h.d[1] - h.n[1] * along, h.d[2] - h.n[2] * along); if (side > 0.004 || along <= -GAP) continue;
        const push = along + GAP, o = h.s, done = new Set(); for (let c = 0; c < 3; c++) { const vi = o.idx[h.t * 3 + c], grp = o.groups.find((x) => x.includes(vi)) || [vi]; for (const i of grp) { if (done.has(i)) continue; done.add(i); for (let k = 0; k < 3; k++) o.pos[i * 3 + k] += h.n[k] * push; } } moved++; }
    }
    for (const s of Out) s.P.setArray(s.pos); }
  return moved;
}
for (const n of names) {
  const make = async (ratioOf, light) => {
    const doc = await io().read(`${SRC}/${n}.glb`);
    if (light) for (const nd of doc.getRoot().listNodes()) if (/^(Buttons|JButtons|Placket|Buckle|Lapels)/.test(nd.getName())) { nd.setMesh(null); nd.setSkin(null); }   /* too small to see in a crowd */
    for (const t of doc.getRoot().listTextures()) { t.setImage(new Uint8Array(eye)); t.setMimeType('image/jpeg'); }
    for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const mat = p.getMaterial(); if (!mat || !mat.getBaseColorTexture()) p.setAttribute('TEXCOORD_0', null); }
    await doc.transform(weld(), prune({ keepAttributes: false, keepLeaves: true }));
    const t0 = tris(doc), ratio = ratioOf(t0);
    if (ratio < 0.98) {   /* trim only the big pieces (skin, shirt, trousers, skirt): small ones such as a collar, a belt or a hat band fall apart if they are simplified, so they are kept whole */
      const keep = []; let small = 0; const whole = new Set(doc.getRoot().listNodes().filter((nd) => nd.getMesh() && WHOLE.test(nd.getName())).map((nd) => nd.getMesh()));
      for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const n = p.getIndices().getCount() / 3; if (whole.has(m) || n < (light ? 260 : SMALL)) { small += n; keep.push({ p, idx: p.getIndices().clone(), at: p.listSemantics().map((k) => [k, p.getAttribute(k).clone()]) }); } }
      const r2 = Math.max(0.05, (t0 * ratio - small) / (t0 - small));
      await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: r2, error: light ? 0.012 : 0.02, lockBorder: true }));   /* edges of cloth (hems, cuffs, necklines) are never moved, so they stay clean */
      for (const k of keep) { k.p.setIndices(k.idx); for (const [n, a] of k.at) k.p.setAttribute(n, a); }
      await doc.transform(prune({ keepAttributes: false, keepLeaves: true }));
      if (light) liftLayers(doc);
    }
    const t1 = tris(doc); await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    return { bin: await io().writeBinary(doc), t0, t1 };
  };
  const full = await make((t) => Math.min(1, MAX / t)); pack(n, full.bin);
  let msg = `${n}: ${full.t0} -> ${full.t1} tris, ${(full.bin.length * 4 / 3 / 1024) | 0} KB`;
  if (LO) { const lo = await make((t) => Math.min(1, 5200 / t), true); pack(n + '_lo', lo.bin); msg += `; lo ${lo.t1} tris, ${(lo.bin.length * 4 / 3 / 1024) | 0} KB`; }
  console.log(msg);
}
