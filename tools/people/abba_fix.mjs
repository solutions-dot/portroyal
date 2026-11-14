// Abba was built by tools/blender/abba.py and then given her Idle clip by hand (games/port-royal/assets/characters/abba_animated.glb), so she cannot be rebuilt by era.py.
// This small fix works on that file instead: it moves her apron a little further out from her skirt, more toward the hem, so the skirt does not come through the apron when she walks or runs.
// node tools/people/abba_fix.mjs   then   node tools/people/pack.mjs --src build/people --out games/port-royal/site/models abba
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import fs from 'fs';
const OUT0 = 0.006, OUT1 = 0.03;   /* metres: at the waist, and extra at the hem */
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read('games/port-royal/assets/characters/abba_animated.glb');
for (const nd of doc.getRoot().listNodes()) { const m = nd.getMesh(); if (!m) continue;
  for (const p of m.listPrimitives()) { const P = p.getAttribute('POSITION'), mn = P.getMin([]), mx = P.getMax([]);
    if (process.argv.includes('--list')) console.log(nd.getName(), p.getMaterial().getName(), 'min', mn.map((v) => v.toFixed(3)), 'max', mx.map((v) => v.toFixed(3)), 'scale', nd.getScale(), 'parent scale', nd.getParentNode() && nd.getParentNode().getScale());
    if (nd.getName() !== 'Apron') continue;
    const v = [0, 0, 0]; for (let i = 0; i < P.getCount(); i++) { P.getElement(i, v); const t = (mx[1] - v[1]) / (mx[1] - mn[1]); v[2] += OUT0 + OUT1 * t * t; P.setElement(i, v); } } }
fs.mkdirSync('build/people', { recursive: true }); await new NodeIO().registerExtensions(ALL_EXTENSIONS).write('build/people/abba.glb', doc); console.log('wrote build/people/abba.glb');
