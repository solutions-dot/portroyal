// Pack the DC-8 parts (build/planes/dc8_parts.glb, from tools/air-jamaica/dc8_from_model.py) for the game: weld, drop unused, meshopt, then base64 in
// games/air-jamaica/site/models/dc8_parts.js. node tools/air-jamaica/pack_dc8.mjs
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, prune, meshopt, simplify } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read('build/planes/dc8_parts.glb');
await doc.transform(weld({ tolerance: 0.0005 }), simplify({ simplifier: MeshoptSimplifier, ratio: 0.6, error: 0.0008 }), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
const bin = await io.writeBinary(doc);
fs.writeFileSync('games/air-jamaica/site/models/dc8_parts.js', `(window.__models=window.__models||{})["dc8_parts"]="${Buffer.from(bin).toString('base64')}";`);
console.log('dc8_parts.js', Math.round(bin.length / 1024), 'KB');
