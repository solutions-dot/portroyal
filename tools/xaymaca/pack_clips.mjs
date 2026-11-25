// Xaymaca's own animation clip: Paddle, the canoe paddling stroke the owner supplied (shared/anim-sources/Paddling.fbx, 25 November 2026), kept out of the
// shared library for now (to check for Port Royal's rescue boat later; if it is used there too, move it into the shared library, tools/anims/clips.json).
//   ANIMS_OUT=build/anims_xa.glb /tmp/venv/bin/python3 tools/anims/retarget_clips.py tools/xaymaca/clips.json
//   node tools/xaymaca/pack_clips.mjs [build/anims_xa.glb]      # writes games/xaymaca/site/models/anims_xa.js; the game loads it after the shared library
import fs from 'node:fs';
import { cleanClips, packJs } from '../anims/clean_clips.mjs';
const inp = process.argv[2] || 'build/anims_xa.glb', out = 'games/xaymaca/site/models/anims_xa.js';
const want = Object.keys(JSON.parse(fs.readFileSync('tools/xaymaca/clips.json', 'utf8')));
const { bin, names } = await cleanClips(inp, { meshes: false });
const missing = want.filter((n) => !names.includes(n)); if (missing.length) console.warn('MISSING from anims_xa:', missing.join(', '));
fs.writeFileSync(out, packJs('anims_xa', bin));
console.log('anims_xa.js:', names.join(', '), (bin.length * 4 / 3 / 1024 | 0) + ' KB');
