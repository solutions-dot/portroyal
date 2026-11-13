// Make the deployable site in dist/: node tools/dist.mjs
//   builds every game in games/ (public build, no test code; _template is skipped),
//   then copies menu/ to the site root and each game's site/ folder to /games/<game>/site/.
// Vercel runs this (see vercel.json and docs/PUBLISHING.md). Open dist/ with any static server to check it.
import { execFileSync } from 'node:child_process';
import { cpSync, readdirSync, rmSync, mkdirSync, existsSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true }); mkdirSync('dist/games', { recursive: true });
for (const g of readdirSync('games')) {
  if (g.startsWith('_') || !existsSync(`games/${g}/src/main.js`)) continue;
  execFileSync(process.execPath, ['tools/build.mjs', g], { stdio: 'inherit' });
  cpSync(`games/${g}/site`, `dist/games/${g}/site`, { recursive: true, filter: (src) => !/\.(glb|blend)$/.test(src) });   /* the game loads only the packed .js models */
}
cpSync('menu', 'dist', { recursive: true }); cpSync('menu', 'dist/menu', { recursive: true });   /* the home page, and /menu/ too so the games' "All games" link works here and in the repo */
console.log('dist/ ready: ' + readdirSync('dist/games').join(', '));
