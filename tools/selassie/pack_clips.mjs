// This game's own animation clips (the owner's salute and descending-stairs clips for Haile Selassie), kept apart from the shared library so other games are not changed.
//   ANIMS_OUT=build/anims_selassie.glb ~/venv/bin/python3 tools/anims/retarget_clips.py tools/selassie/clips.json   # about 20 seconds
//   node tools/selassie/pack_clips.mjs [build/anims_selassie.glb]                                                   # writes games/selassie/site/models/anims_selassie.js
// The same clean-up as the shared library (tools/anims/clean_clips.mjs), without the body mesh. The game loads it after the shared
// library and adds its clips to CL (games/selassie/src/main.js). Sources: shared/anim-sources/owner/ (Mixamo FBX supplied by the owner).
import fs from 'node:fs';
import { cleanClips, packJs } from '../anims/clean_clips.mjs';
const inp = process.argv[2] || 'build/anims_selassie.glb', out = 'games/selassie/site/models/anims_selassie.js';
const want = Object.keys(JSON.parse(fs.readFileSync('tools/selassie/clips.json', 'utf8')));
const { bin, names } = await cleanClips(inp, { meshes: false });
const missing = want.filter((n) => !names.includes(n));
if (missing.length) console.warn('MISSING from anims_selassie:', missing.join(', '));
fs.writeFileSync(out, packJs('anims_selassie', bin));
console.log('anims_selassie.js:', names.join(', '), ((bin.length * 4) / 3 / 1024) | 0, 'KB');
