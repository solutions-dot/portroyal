// Pack the shared animals from the Quaternius "Ultimate Animated Animal Pack" (CC0, quaternius.com): the donkey (our mule), the cow,
// the bull and the horse, from shared/sources/animals/quaternius-<name>.glb into shared/models/<model>.js, which tools/build.mjs copies
// into every game. Each keeps only the clips a farm animal plays (Walk, Idle, Idle_2, Idle_Headlow, Eating), drops the pack's second copy
// of a clip ("AnimalArmature|..."), and is resampled, welded, pruned and meshopt-compressed. engine/beasts.js smooths, colours and drives them.
// Run: node tools/animals/pack_animals.mjs
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune, resample } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const KEEP = new Set(['Walk', 'Idle', 'Idle_2', 'Idle_Headlow', 'Eating']);
const LIST = { mule: 'donkey', cow: 'cow', bull: 'bull', horse: 'horse' };   /* model name: source name */
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
for (const [name, src] of Object.entries(LIST)) {
  const doc = await io.read(`shared/sources/animals/quaternius-${src}.glb`);
  for (const a of doc.getRoot().listAnimations()) if (!KEEP.has(a.getName())) { for (const c of a.listChannels()) c.dispose(); for (const s of a.listSamplers()) s.dispose(); a.dispose(); }
  await doc.transform(resample(), weld(), prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const bytes = await io.writeBinary(doc);
  fs.writeFileSync(`shared/models/${name}.js`, `(window.__models=window.__models||{})["${name}"]="${Buffer.from(bytes).toString('base64')}";`);
  console.log(name, bytes.length, 'bytes,', doc.getRoot().listAnimations().map((a) => a.getName()).join(' '));
}
