// Build one game: node tools/build.mjs <game> [--dev]
//   1. copies shared runtime files (shared/models/*.js, e.g. the animation library) into games/<game>/site/models/
//   2. bundles games/<game>/src/main.js (which imports from engine/) into games/<game>/site/app.js
// --dev keeps the test views (?shot=...) and the autoplayer (?auto=N). See docs/TESTING.md.
import { build } from 'esbuild';
import { cpSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
const game = process.argv[2], dev = process.argv.includes('--dev');
if (!game || !existsSync(`games/${game}/src/main.js`)) { console.error('usage: node tools/build.mjs <game> [--dev]   (games: ' + readdirSync('games').join(', ') + ')'); process.exit(1); }
const out = `games/${game}/site`; mkdirSync(`${out}/models`, { recursive: true });
for (const f of readdirSync('shared/models')) cpSync(`shared/models/${f}`, `${out}/models/${f}`);
await build({ entryPoints: [`games/${game}/src/main.js`], bundle: true, minify: true, format: 'iife', target: 'es2020', define: { __DEV__: dev ? 'true' : 'false' }, outfile: `${out}/app.js`, logLevel: 'warning' });
console.log(`built ${out}/app.js${dev ? ' (dev)' : ''}`);
