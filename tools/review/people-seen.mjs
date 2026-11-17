/* What the eye sees: every body of a game, in every clip the game ships, drawn from six sides with each piece in one flat colour. A small patch of an under layer
   wholly inside the piece that should cover it (skin in a shirt, a shirt in a waistcoat, trousers in a belt) is a fault you can see.
     node tools/review/people-seen.mjs <game|all> [--list] [--shots] [--update] [ids=boy,boy_lo] [only=Idle,Walk]
   Serve the repository root first (python3 -m http.server 8765) and build the game with --dev (it makes models/anims.js).
   --list prints the kinds of fault for each body and its first lines; --shots saves pictures of the first faults to build/review/seen/ (the patch is drawn magenta);
   --update records the numbers in tools/checks/people-seen.json. Without --update it fails (exit 1) when a body shows more than is recorded there.
   The cloth check (people-check.mjs) measures surfaces and also reports what is hidden; this one is the list of what shows. See docs/TESTING.md. */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const args = process.argv.slice(2), which = args[0], update = args.includes('--update'), list = args.includes('--list'), opts = Object.fromEntries(args.filter((a) => a.includes('=')).map((a) => a.split('=')));
const BASE = 'tools/checks/people-seen.json', baseline = existsSync(BASE) ? JSON.parse(readFileSync(BASE, 'utf8')) : {};
const games = which === 'all' ? readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/models/anims.js`)) : [which];
mkdirSync('build/review/seen', { recursive: true });
await build({ entryPoints: ['tools/review/people-seen.src.js'], bundle: true, format: 'esm', outfile: 'build/review/people-seen.js', logLevel: 'error' });
writeFileSync('build/review/seen.html', '<!doctype html><meta charset="utf-8"><title>SEEN</title><script type="module" src="people-seen.js"></script>');
const { chromium } = process.env.PW_MODULE ? await import(process.env.PW_MODULE) : createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let failed = 0; const total = {};
for (const game of games) {
  const files = readdirSync(`games/${game}/site/models`).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)), clips = files.filter((f) => /^anims/.test(f));
  const ids = (opts.ids ? opts.ids.split(',') : files.filter((f) => !/^(anims|tex_)/.test(f) && readFileSync(`games/${game}/site/models/${f}.js`, 'utf8').length < 900000 && !/_(crowd|phone|focus)$/.test(f)));
  const p = await b.newPage({ viewport: { width: 300, height: 200 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  const R = {}; let nClips = 0;
  for (let i = 0; i < ids.length; i += 6) {
    await p.goto(`${process.env.REVIEW_BASE || 'http://localhost:8765'}/build/review/seen.html?game=${game}&ids=${ids.slice(i, i + 6).join(',')}&clips=${clips.join(',')}${opts.only ? '&only=' + opts.only : ''}${args.includes('--shots') ? '&shots' : ''}`);
    await p.waitForFunction(() => /^SEEN (done|error)/.test(document.title), null, { timeout: 1200000 });
    const r = await p.evaluate(() => window.__RESULT); if (r.error) { console.log(game, 'ERROR', r.error); failed++; break; } Object.assign(R, r.bodies); nClips = r.clips;
    for (const [nm, url] of r.shots || []) writeFileSync(`build/review/seen/${game}_${nm}.png`, Buffer.from(url.split(',')[1], 'base64')); }
  await p.close();
  const old = baseline[game] || {}; let seen = 0; const worse = [];
  for (const [id, v] of Object.entries(R)) { if (v.error) { console.log(`  ${id}: ${v.error}`); continue; } seen += v.seen; const o = old[id]; if (!opts.only && o !== undefined && v.seen > o) worse.push(`${id}: ${o} -> ${v.seen}`);
    for (const [k, n] of Object.entries(v.kinds)) { const kk = k.replace(/^[^:]*: /, ''); total[kk] = (total[kk] || 0) + n; }
    if (list && v.seen) { console.log(`  ${id}: ${v.seen} seen`); for (const [k, n] of Object.entries(v.kinds).sort((a, c) => c[1] - a[1]).slice(0, 8)) console.log(`      ${n} x ${k}`); } }
  console.log(`SEEN ${game}: ${Object.keys(R).length} bodies, ${nClips} clips, ${seen} patches seen` + (worse.length ? `, WORSE than recorded in ${worse.length}` : Object.keys(old).length ? ', no body worse than recorded' : ', nothing recorded yet'));
  for (const w of worse) console.log('  WORSE ' + w); if (worse.length) failed++;
  if (update && !opts.only && !opts.ids) baseline[game] = Object.fromEntries(Object.entries(R).filter(([, v]) => !v.error).map(([id, v]) => [id, v.seen]));
}
await b.close();
console.log('kinds: ' + Object.entries(total).sort((a, c) => c[1] - a[1]).slice(0, 14).map(([k, n]) => `${n} ${k}`).join('; '));
if (update) { mkdirSync('tools/checks', { recursive: true }); writeFileSync(BASE, JSON.stringify(baseline, null, 1) + '\n'); console.log('recorded: ' + BASE); }
process.exit(failed && !update ? 1 : 0);
