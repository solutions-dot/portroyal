// Makes a lighter copy of each character body, for crowd figures: node tools/kendal/make_lo.mjs hl_worker nb_youth ...
// Reads games/kendal/site/models/<name>.js (the packed full body), cuts its triangles to about a fifth, and writes <name>_lo.js next to it.
// Bones, skin weights and materials are untouched, so the same animations and recolouring work on the light copy.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, weld, simplify, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import { readFileSync, writeFileSync } from 'node:fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const DIR = 'games/kendal/site/models', RATIO = +(process.env.RATIO || 0.2);
for (const n of process.argv.slice(2)) {
  const t = readFileSync(`${DIR}/${n}.js`, 'utf8'), b64 = t.match(/="([A-Za-z0-9+/=]+)"/)[1];
  const doc = await io.readBinary(new Uint8Array(Buffer.from(b64, 'base64')));
  await doc.transform(dequantize(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.02 }), prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const out = await io.writeBinary(doc); let tris = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) tris += (p.getIndices() ? p.getIndices().getCount() : 0) / 3;
  writeFileSync(`${DIR}/${n}_lo.js`, `(window.__models=window.__models||{})["${n}_lo"]="${Buffer.from(out).toString('base64')}";`);
  console.log(n + '_lo', (tris | 0) + ' tris', (out.length / 1024 | 0) + ' KB');
}
