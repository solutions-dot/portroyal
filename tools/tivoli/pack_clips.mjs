// Tivoli's own animation clips (the shooting and cover clips the owner supplied), kept apart from the shared library so other games are not changed.
//   mv build/anims.glb build/anims_shared.glb                                     # keep the shared library's retarget if you still need it
//   ~/venv/bin/python3 tools/anims/retarget_clips.py tools/tivoli/clips.json     # writes build/anims.glb (or ANIMS_OUT=...)
//   node tools/tivoli/pack_clips.mjs [in.glb]                                     # writes games/tivoli/site/models/anims_tivoli.js
// The same clean-up as the shared library (tools/anims/clean_clips.mjs), without the body mesh.
// The game loads it after the shared library and adds its clips to CL (games/tivoli/src/main.js). Sources: tools/tivoli/anim-sources/ (Mixamo FBX).
import fs from 'node:fs';
import { cleanClips, packJs } from '../anims/clean_clips.mjs';
const inp = process.argv[2] || 'build/anims.glb', out = 'games/tivoli/site/models/anims_tivoli.js';
const want = Object.keys(JSON.parse(fs.readFileSync('tools/tivoli/clips.json', 'utf8')));
const { bin, names } = await cleanClips(inp, { meshes: false });
const missing = want.filter((n) => !names.includes(n)); if (missing.length) console.warn('MISSING from anims_tivoli:', missing.join(', '));
fs.writeFileSync(out, packJs('anims_tivoli', bin));
console.log('anims_tivoli.js:', names.join(', '), (bin.length * 4 / 3 / 1024 | 0) + ' KB');
