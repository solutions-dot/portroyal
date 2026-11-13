// Compress character bodies and pack them for a game: node tools/people/pack.mjs --out games/kendal/site/models [--max 26000] [--lo] name1 name2 ...
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
const OUT = opt('--out', 'games/kendal/site/models'), MAX = +opt('--max', 26000), LO = A.includes('--lo'), SRC = opt('--src', 'build/people');
const names = A.filter((a, i) => !a.startsWith('--') && !['--out', '--max', '--src'].includes(A[i - 1]));
const eye = fs.readFileSync('shared/rig/eye_small.jpg');
const tris = (doc) => { let t = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3; return t | 0; };
const pack = (name, bin) => fs.writeFileSync(`${OUT}/${name}.js`, `(window.__models=window.__models||{})["${name}"]="${Buffer.from(bin).toString('base64')}";`);
for (const n of names) {
  const make = async (ratioOf) => {
    const doc = await io().read(`${SRC}/${n}.glb`);
    for (const t of doc.getRoot().listTextures()) { t.setImage(new Uint8Array(eye)); t.setMimeType('image/jpeg'); }
    for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const mat = p.getMaterial(); if (!mat || !mat.getBaseColorTexture()) p.setAttribute('TEXCOORD_0', null); }
    await doc.transform(weld(), prune({ keepAttributes: false, keepLeaves: true }));
    const t0 = tris(doc), ratio = ratioOf(t0);
    if (ratio < 0.98) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.02 }), prune({ keepAttributes: false, keepLeaves: true }));
    const t1 = tris(doc); await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    return { bin: await io().writeBinary(doc), t0, t1 };
  };
  const full = await make((t) => Math.min(1, MAX / t)); pack(n, full.bin);
  let msg = `${n}: ${full.t0} -> ${full.t1} tris, ${(full.bin.length * 4 / 3 / 1024) | 0} KB`;
  if (LO) { const lo = await make((t) => Math.min(1, 5200 / t)); pack(n + '_lo', lo.bin); msg += `; lo ${lo.t1} tris, ${(lo.bin.length * 4 / 3 / 1024) | 0} KB`; }
  console.log(msg);
}
