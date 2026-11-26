// Make the deployable site in dist/: node tools/dist.mjs
//   builds the games (public build, no test code; templates are skipped),
//   then copies menu/ to the site root and each game's site/ folder to /games/<game>/site/.
// Vercel runs this (see vercel.json and docs/PUBLISHING.md). Open dist/ with any static server to check it.
import { execFileSync } from 'node:child_process';
import { writeSeo } from './seo.mjs';
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
if(!testing)writeSeo(out);   /* titles, descriptions, link previews, schema.org data, robots.txt and sitemap.xml (tools/seo.mjs) */
console.log(out+'/ ready: '+readdirSync(`${out}/games`).join(', '));

/* The HTML still runs on a static server. Only hosted builds use the private dashboard and live access settings. */
if (!testing && process.env.VERCEL === '1') {
  cpSync('admin', `${out}/admin`, { recursive: true });
  for (const f of ['playtest.js', 'playtest.css']) cpSync(`engine/${f}`, `${out}/${f}`);
  const menu = readFileSync(`${out}/index.html`, 'utf8');
  const catalog = [...menu.matchAll(/<a\b[^>]*\bdata-game="([a-z0-9-]+)"[^>]*>[\s\S]*?<\/a>/g)].map(([card, id]) => ({
    id,
    title: (card.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] || id).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    category: /\bdata-age="13"/.test(card) ? 'teen' : 'kids'
  }));
  writeFileSync(`${out}/playtest-catalog.json`, JSON.stringify(catalog));
  const gamePages = readdirSync(`${out}/games`).map((game) => ({
    path: `${out}/games/${game}/site/index.html`, game,
    age: catalog.find((entry) => entry.id === game)?.category === 'teen' ? 13 : 6
  }));
  for (const { path, game = '', age = 6, page = '' } of [{ path: `${out}/index.html` }, { path: `${out}/menu/index.html` },
    { path: `${out}/about.html`, page: 'about' }, { path: `${out}/menu/about.html`, page: 'about' }, ...gamePages]) {
    if (!existsSync(path)) continue;
    let html = readFileSync(path, 'utf8');
    const feature = `<link rel="stylesheet" href="/playtest.css"><script src="/playtest.js" data-game="${game}" data-age="${age}" data-page="${page}"></script>`;
    html = html.replace('</head>', feature + '</head>');
    if (game) html = html.replace(/<script src="(app\.js[^"]*)"><\/script>/, '<script type="application/json" data-pastport-app="$1"></script>');
    writeFileSync(path, html);
  }
}
