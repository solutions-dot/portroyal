import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read('site/models/anims.glb');
const UNUSED = new Set(['StartWalk', 'StopWalk', 'SadWalk', 'Injured', 'CarryTurn', 'BoxTurn', 'BoxIdle', 'Defeated', 'SlashIn', 'SlashOut', 'Draw']);
for (const a of doc.getRoot().listAnimations()) if (UNUSED.has(a.getName())) { for (const c of a.listChannels()) c.dispose(); for (const sm of a.listSamplers()) sm.dispose(); a.dispose(); }
for (const a of doc.getRoot().listAnimations()) for (const c of a.listChannels()) { const p = c.getTargetPath(), n = c.getTargetNode()?.getName() || ''; if (p === 'scale' || (p === 'translation' && !/Hips/.test(n)) || /Hand(Thumb|Index|Middle|Ring|Pinky)[234]/.test(n)) { const sm = c.getSampler(); c.dispose(); sm.dispose(); } }
await doc.transform(resample({ tolerance: 1e-3 }), prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
await io.write('site/models/anims.m.glb', doc);
