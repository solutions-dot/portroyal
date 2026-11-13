// Build one game: node tools/build.mjs <game> [--dev]
//   1. copies shared runtime files (shared/models/*.js, e.g. the animation library) into games/<game>/site/models/
//      then, if games/<game>/anim-clips.json lists clip names, trims that game's copy of the animation library to those clips (tools/anim_subset.mjs)
//   2. bundles games/<game>/src/main.js (which imports from engine/) into games/<game>/site/app.js, with a fingerprint for each model file
//      (models are cached for a year and asked for as models/<name>.js?v=<fingerprint>, so a changed model is fetched again)
// --dev keeps the test views (?shot=...) and the autoplayer (?auto=N). See docs/TESTING.md.
import { build } from 'esbuild';
import { cpSync, readdirSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const game = process.argv[2], dev = process.argv.includes('--dev');
if (!game || !existsSync(`games/${game}/src/main.js`)) { console.error('usage: node tools/build.mjs <game> [--dev]   (games: ' + readdirSync('games').join(', ') + ')'); process.exit(1); }
const out = `games/${game}/site`; mkdirSync(`${out}/models`, { recursive: true });
for (const f of readdirSync('shared/models')) cpSync(`shared/models/${f}`, `${out}/models/${f}`);
if (existsSync(`games/${game}/anim-clips.json`)) {
  const { subsetAnims } = await import('./anim_subset.mjs'), r = await subsetAnims(`${out}/models/anims.js`, JSON.parse(readFileSync(`games/${game}/anim-clips.json`, 'utf8')));
  console.log(`anims.js for ${game}: ${r.kept} of ${r.of} clips, ${Math.round(r.before / 1024)} KB -> ${Math.round(r.after / 1024)} KB`);
}
const modelV = {};   /* a short fingerprint per model file: the game asks for models/<name>.js?v=<fingerprint>, so a changed model is fetched again and an unchanged one stays cached */
for (const f of readdirSync(`${out}/models`).sort()) if (f.endsWith('.js')) modelV[f.slice(0, -3)] = createHash('sha1').update(readFileSync(`${out}/models/${f}`)).digest('hex').slice(0, 10);
await build({ entryPoints: [`games/${game}/src/main.js`], bundle: true, minify: true, format: 'iife', target: 'es2020', define: { __DEV__: dev ? 'true' : 'false', __MODELV__: JSON.stringify(modelV) }, outfile: `${out}/app.js`, logLevel: 'warning' });
console.log(`built ${out}/app.js${dev ? ' (dev)' : ''}`);
