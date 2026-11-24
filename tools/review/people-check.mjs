/* The people gate: every body of a game, posed in every clip the game ships (three moments of each), through the shared cloth check and a torn-cloth check, and every hat measured against its wearer's skull (too tall, riding high, too wide).
     node tools/review/people-check.mjs <game|all> [--update] [--list] [only=Kneel,CarryHeadWalk] [ids=maroon_man,maroon_man_lo]
   Serve the repository root first (python3 -m http.server 8765) and build the game (node tools/build.mjs <game> --dev makes models/anims.js).
   It compares each body's numbers with tools/checks/people-baseline.json and fails (exit 1) if any body has more cloth lines or torn edges than recorded there.
   --update writes the numbers found as the new baseline: do that only after looking at the bodies (tools/review/people-sheet.mjs) and judging them right.
   --list prints every line kind per body; --where prints the first lines in full, with the place of the worst point. A new or rebuilt body must be run through this before it is committed (docs/PEOPLE.md, "Before a body is done"). */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const args = process.argv.slice(2), which = args[0], update = args.includes('--update'), list = args.includes('--list'), opts = Object.fromEntries(args.filter((a) => a.includes('=')).map((a) => a.split('=')));
const BASE = 'tools/checks/people-baseline.json', baseline = existsSync(BASE) ? JSON.parse(readFileSync(BASE, 'utf8')) : {};
const games = which === 'all' ? readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/models/anims.js`)) : [which];
mkdirSync('build/review', { recursive: true });
await build({ entryPoints: ['tools/review/people-check.src.js'], bundle: true, format: 'esm', outfile: 'build/review/people-check.js', logLevel: 'error' });
writeFileSync('build/review/check.html', '<!doctype html><meta charset="utf-8"><title>PEOPLE</title><script type="module" src="people-check.js"></script>');
const { chromium } = process.env.PW_MODULE ? await import(process.env.PW_MODULE) : createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let failed = 0;
for (const game of games) {
  const files = readdirSync(`games/${game}/site/models`).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)), clips = files.filter((f) => /^anims/.test(f));
  const ids = (opts.ids ? opts.ids.split(',') : files.filter((f) => !/^(anims|tex_)/.test(f) && readFileSync(`games/${game}/site/models/${f}.js`, 'utf8').length < 900000 && !/_(crowd|phone|focus)$/.test(f)));   /* joined crowd copies are one piece: there are no layers to compare */
  const p = await b.newPage({ viewport: { width: 300, height: 200 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  const R = {}; for (let i = 0; i < ids.length; i += 6) {   /* a few bodies a page, so one page never holds every body of a big game */
    await p.goto(`${process.env.REVIEW_BASE || 'http://localhost:8765'}/build/review/check.html?game=${game}&ids=${ids.slice(i, i + 6).join(',')}&clips=${clips.join(',')}${opts.only ? '&only=' + opts.only : ''}${args.includes('--where') ? '&where' : ''}${opts.posture ? '&posture=' + opts.posture : ''}`);
    await p.waitForFunction(() => /^PEOPLE (done|error)/.test(document.title), null, { timeout: 1200000 });
    const r = await p.evaluate(() => window.__RESULT); if (r.lines) console.log(r.lines.join('\n')); if (r.error) { console.log(game, 'ERROR', r.error); failed++; break; } Object.assign(R, r.bodies); R._clips = r.clips; }
  await p.close();
  const nClips = R._clips; delete R._clips; const old = baseline[game] || {}; let cloth = 0, torn = 0, nhat = 0, worse = [];
  for (const [id, v] of Object.entries(R)) { if (v.error) { console.log(`  ${id}: ${v.error}`); continue; } cloth += v.cloth; torn += v.torn; const o = old[id];
    if (!opts.only && o && (v.cloth > o.cloth || v.torn > o.torn || v.hats.length > (o.hats || 0))) worse.push(`${id}: cloth ${o.cloth} -> ${v.cloth}, torn ${o.torn} -> ${v.torn}, hats ${o.hats || 0} -> ${v.hats.length}`); nhat += v.hats.length; for (const hl of v.hats) console.log(`  HAT ${id}: ${hl}`);
    if (list || v.torn) console.log(`  ${id}: cloth ${v.cloth} lines (${v.points} points), torn ${v.torn}` + (v.torn ? ` (worst ${v.tornWorst} times, ${v.tornAt})` : '')); if (v.tornBy) for (const [k, n] of v.tornBy) console.log(`      torn ${n} x ${k}`); if (list) for (const [k, n] of Object.entries(v.kinds).sort((a, b) => b[1] - a[1])) console.log(`      ${n} x ${k}`); }
  console.log(`PEOPLE ${game}: ${Object.keys(R).length} bodies, ${nClips} clips, cloth ${cloth} lines, torn ${torn}, hat faults ${nhat}` + (worse.length ? `, WORSE than the baseline in ${worse.length}` : old && Object.keys(old).length ? ', no body worse than the baseline' : ', no baseline yet'));
  for (const w of worse) console.log('  WORSE ' + w); if (worse.length) failed++;
  if (update && !opts.only && !opts.ids) baseline[game] = Object.fromEntries(Object.entries(R).filter(([, v]) => !v.error).map(([id, v]) => [id, { cloth: v.cloth, torn: v.torn, hats: v.hats.length }]));
}
await b.close();
if (update) { mkdirSync('tools/checks', { recursive: true }); writeFileSync(BASE, JSON.stringify(baseline, null, 1) + '\n'); console.log('baseline written: ' + BASE); }
process.exit(failed && !update ? 1 : 0);
