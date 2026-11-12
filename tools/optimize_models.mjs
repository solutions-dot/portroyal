import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, quantize, dedup, prune } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const n of process.argv.slice(2)) {
  const doc = await io.read(`site/models/${n}.glb`);
  await doc.transform(weld(), quantize({ quantizePosition: 14, quantizeNormal: 8, quantizeTexcoord: 12, quantizeColor: 8 }), prune({ keepAttributes: true, keepLeaves: true }));
  await io.write(`site/models/${n}.q.glb`, doc);
}
