// Morant Bay's own animation clip: the fall backwards the owner supplied (shared/anim-sources/Dying_Backwards.fbx, 23 November 2026), kept out of
// the shared library: only this game may show people falling at the volley (docs/games/morant-bay.md, "The Mature 13+ line"), far off, behind the
// opt-in card, and cut away before anyone lies still.
//   ANIMS_OUT=build/anims_mb.glb ~/venv/bin/python3 tools/anims/retarget_clips.py tools/morant-bay/clips.json   # about 30 seconds
//   node tools/morant-bay/pack_clips.mjs [build/anims_mb.glb]                                                  # writes games/morant-bay/site/models/anims_mb.js
// The same clean-up as the shared library (tools/anims/clean_clips.mjs), without the body mesh. The game loads it after the shared library.
import fs from 'node:fs';
import { cleanClips, packJs } from '../anims/clean_clips.mjs';
const inp = process.argv[2] || 'build/anims_mb.glb', out = 'games/morant-bay/site/models/anims_mb.js';
const want = Object.keys(JSON.parse(fs.readFileSync('tools/morant-bay/clips.json', 'utf8')));
const { bin, names } = await cleanClips(inp, { meshes: false });
const missing = want.filter((n) => !names.includes(n)); if (missing.length) console.warn('MISSING from anims_mb:', missing.join(', '));
fs.writeFileSync(out, packJs('anims_mb', bin));
console.log('anims_mb.js:', names.join(', '), (bin.length * 4 / 3 / 1024 | 0) + ' KB');
