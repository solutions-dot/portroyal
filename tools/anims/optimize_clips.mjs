// Pack the shared animation library: node tools/anims/optimize_clips.mjs [in.glb] [out.js]
//   in:  build/anims.glb (written by tools/anims/retarget_clips.py tools/anims/clips.json)
//   out: shared/models/anims.js (every game copies it; tools/build.mjs trims each game's copy to games/<game>/anim-clips.json)
// The clean-up is in tools/anims/clean_clips.mjs. Every clip in tools/anims/clips.json is kept: a game that does not play a clip
// does not download it, because its anim-clips.json leaves it out.
import fs from 'node:fs';
import { cleanClips, packJs } from './clean_clips.mjs';
const [inp = 'build/anims.glb', out = 'shared/models/anims.js'] = process.argv.slice(2);
const want = Object.keys(JSON.parse(fs.readFileSync('tools/anims/clips.json', 'utf8')));
const { bin, names } = await cleanClips(inp);
const missing = want.filter((n) => !names.includes(n)); if (missing.length) console.warn('MISSING from the library:', missing.join(', '));
fs.writeFileSync(out, packJs('anims', bin));
console.log(`${out}: ${names.length} clips, ${(bin.length * 4 / 3 / 1024) | 0} KB`);
