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
/* Every published page carries the build's id, asks for app.js by that id (so no cache can hand back an old copy) and keeps itself up to date (engine/freshen.js).
   One place for every game and the menu: nothing to remember in a game's own files. */
{ let sha=process.env.VERCEL_GIT_COMMIT_SHA||'';if(!sha)try{sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch(e){sha='local';}
  const id=sha.slice(0,10)+'-'+Date.now().toString(36),fresh=readFileSync('engine/freshen.js','utf8'),rate=readFileSync('engine/rate.js','utf8'),head=`<script>window.__BUILD=${JSON.stringify(id)};</script><script>${fresh}</script>`;
  const pages=[`${out}/index.html`,`${out}/menu/index.html`,...readdirSync(`${out}/games`).map((g)=>`${out}/games/${g}/site/index.html`)];let n=0;
  for(const file of pages){if(!existsSync(file))continue;let h=readFileSync(file,'utf8');h=h.replace('</head>',head+(file.includes('/games/')?`<script>${rate}</script>`:'')+'</head>')   /* every game page also gets "Rate this story" on its title screen (engine/rate.js) */.replace(/<script src="app\.js"><\/script>/,`<script src="app.js?v=${id}"></script>`);writeFileSync(file,h);n++;}
  writeFileSync(`${out}/version.json`,JSON.stringify({id})+'\n');console.log('build id '+id+' in '+n+' pages');}
console.log(out+'/ ready: '+readdirSync(`${out}/games`).join(', '));
