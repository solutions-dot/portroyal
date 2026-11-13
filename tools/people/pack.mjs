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
    }
    const t1 = tris(doc); await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    return { bin: await io().writeBinary(doc), t0, t1 };
  };
  const full = await make((t) => Math.min(1, MAX / t)); pack(n, full.bin);
  let msg = `${n}: ${full.t0} -> ${full.t1} tris, ${(full.bin.length * 4 / 3 / 1024) | 0} KB`;
  if (LO) { const lo = await make((t) => Math.min(1, 5200 / t), true); pack(n + '_lo', lo.bin); msg += `; lo ${lo.t1} tris, ${(lo.bin.length * 4 / 3 / 1024) | 0} KB`; }
  console.log(msg);
}
