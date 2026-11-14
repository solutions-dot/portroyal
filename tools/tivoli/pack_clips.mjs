// Tivoli's own animation clips (the shooting clips the owner supplied), kept apart from the shared library so other games are not changed.
//   ~/venv/bin/python3 tools/anims/retarget_clips.py tools/tivoli/clips.json     # writes build/anims.glb, replacing the shared one there (move it aside first if you need it)
//   node tools/tivoli/pack_clips.mjs                                               # writes games/tivoli/site/models/anims_tivoli.js
// The same clean-up as tools/anims/optimize_clips.mjs: no scale tracks, no moving roots except the hips, no finger joints 2 to 4, resampled and compressed.
// The game loads it after the shared library and adds its clips to CL (games/tivoli/src/main.js). Sources: tools/tivoli/anim-sources/ (Mixamo FBX).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read('build/anims.glb');
for (const a of doc.getRoot().listAnimations()) for (const c of a.listChannels()) {
  const p = c.getTargetPath(), n = c.getTargetNode()?.getName() || '';
  if (p === 'scale' || (p === 'translation' && !/Hips/.test(n)) || /Hand(Thumb|Index|Middle|Ring|Pinky)[234]/.test(n)) { const sm = c.getSampler(); c.dispose(); sm.dispose(); }
}
for (const m of doc.getRoot().listMeshes()) m.dispose();   // the clips only; the game's bodies carry the meshes
await doc.transform(resample({ tolerance: 1e-3 }), prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
const bin = await io.writeBinary(doc);
fs.writeFileSync('games/tivoli/site/models/anims_tivoli.js', `(window.__models=window.__models||{})["anims_tivoli"]="${Buffer.from(bin).toString('base64')}";`);
console.log('anims_tivoli.js:', doc.getRoot().listAnimations().map((a) => a.getName()).join(', '), (bin.length * 4 / 3 / 1024 | 0) + ' KB');
