// Compress models for the web: weld, drop what is unused, then meshopt (quantised, compressed geometry and animation).
// Characters (--chars) also lose texture coordinates they never use and get a small eye texture.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const chars = process.argv.includes('--chars'), eye = fs.existsSync('eye_small.jpg') ? fs.readFileSync('eye_small.jpg') : null;
for (const n of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const doc = await io.read(`site/models/${n}.glb`);
  if (chars) {
    for (const t of doc.getRoot().listTextures()) if (eye) { t.setImage(new Uint8Array(eye)); t.setMimeType('image/jpeg'); }
    for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) { const mat = p.getMaterial(); if (!mat || !mat.getBaseColorTexture()) p.setAttribute('TEXCOORD_0', null); }
  }
  await doc.transform(weld(), prune({ keepAttributes: !chars, keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(`site/models/${n}.m.glb`, doc);
  console.log(n, fs.statSync(`site/models/${n}.m.glb`).size);
}
