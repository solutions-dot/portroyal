// Make the deployable site in dist/: node tools/dist.mjs
//   builds the games (public build, no test code; templates are skipped),
//   then copies menu/ to the site root and each game's site/ folder to /games/<game>/site/.
// Vercel runs this (see vercel.json and docs/PUBLISHING.md). Open dist/ with any static server to check it.
import { execFileSync } from 'node:child_process';
import { cpSync, readdirSync, rmSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
const testing=process.argv.includes('--testing'),out=testing?'dist-testing':'dist';
rmSync(out,{recursive:true,force:true});mkdirSync(`${out}/games`,{recursive:true});
for (const g of readdirSync('games')) {
  if (g.startsWith('_') || !existsSync(`games/${g}/src/main.js`)) continue;
  execFileSync(process.execPath, ['tools/build.mjs',g,...(testing?['--dev']:[])], { stdio: 'inherit' });
  cpSync(`games/${g}/site`, `${out}/games/${g}/site`, { recursive: true, filter: (src) => !/\.(glb|blend)$/.test(src) });   /* the game loads only the packed .js models */
}
cpSync('menu',out,{recursive:true});cpSync('menu',`${out}/menu`,{recursive:true});
if(testing)for(const file of [`${out}/index.html`,`${out}/menu/index.html`])writeFileSync(file,readFileSync(file,'utf8').replace('</head>','<meta name="testing-build" content="true"></head>'));   /* the home page, and /menu/ too so the games' "All games" link works here and in the repo */
console.log(out+'/ ready: '+readdirSync(`${out}/games`).join(', '));
