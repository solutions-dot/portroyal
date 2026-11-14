// Unpack one of the shared character models to a plain .glb that Blender can import (no meshopt compression):
//   node tools/bog-walk/unpack_model.mjs [model] [out.glb]
//   The models are packed as window.__models[name] = "<base64 glb>" in games/<game>/site/models/<model>.js (the first game that has it, Bog Walk first).
//   Default: hl_worker, to build/bog-walk/hl_worker.glb.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { dequantize } from '@gltf-transform/functions';

const model = process.argv[2] || 'hl_worker', out = process.argv[3] || `build/bog-walk/${model}.glb`;
const file = ['bog-walk', 'garvey', 'kendal'].map((g) => `games/${g}/site/models/${model}.js`).find(existsSync);
if (!file) throw new Error('no packed model ' + model + ' in games/*/site/models');
const src = readFileSync(file, 'utf8'), buf = Buffer.from(src.match(/"([A-Za-z0-9+/=]+)"/)[1], 'base64');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.readBinary(new Uint8Array(buf));
await doc.transform(dequantize());   /* plain float positions, normals and texture coordinates */
for (const e of doc.getRoot().listExtensionsUsed()) if (/meshopt|quantization/.test(e.extensionName)) e.dispose();   /* the data is decoded on read; drop the compression extensions */
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, await io.writeBinary(doc));
console.log('wrote', out);
