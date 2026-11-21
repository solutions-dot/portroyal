/* Run a game's dev test views headless and print each result: node tools/review/run-test.mjs <game|all> <test,test,...> [key=value ...] [--secs 600] [--size 1280x720]
     node tools/review/run-test.mjs kendal audit,held,cloth,walkers
     node tools/review/run-test.mjs all audit,held --secs 900
   Serve the repository root first (python3 -m http.server 8765) and build each game with test views (node tools/build.mjs <game> --dev).
   It opens games/<game>/site/?test=<test>, waits until the page title is "<WORD> <number>" (AUDIT 0, HELD 3, CLOTH 12 ...) or starts with ERROR, and prints
   the title and the #autolog text (the issue list). Exit code 1 if any result is not 0. A game that does not wire a test never sets the title: it is
   reported as "no result" after --secs. See docs/TESTING.md, section 5. */
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const pos = args.filter((a, i) => !a.startsWith('--') && !['--secs', '--size'].includes(args[i - 1])), [gameArg, tests, ...extra] = pos;
const GAMES = readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/index.html`)).sort(), games = gameArg === 'all' ? GAMES : gameArg.split(',');
const SECS = +opt('--secs', 600), [W, H] = opt('--size', '1280x720').split('x').map(Number);
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
mkdirSync('build/logs', { recursive: true }); let bad = 0;
for (const g of games) for (const t of tests.split(',')) {
  const p = await b.newPage({ viewport: { width: W, height: H } }), errs = []; p.on('pageerror', (e) => errs.push(e.message));
  let title = 'no result', log = '';
  try {
    await p.goto(`${process.env.REVIEW_BASE || 'http://localhost:8765'}/games/${g}/site/?test=${t}${extra.length ? '&' + extra.join('&') : ''}`);
    await p.waitForFunction(() => /^[A-Z]+ -?\d+|^ERROR/.test(document.title), null, { timeout: SECS * 1000 }); title = await p.title();
    log = await p.evaluate(() => { const e = document.getElementById('autolog'); return e ? e.textContent : ''; });
  } catch (e) { title = 'no result after ' + SECS + ' s (' + (await p.title().catch(() => '?')) + ')'; }
  await p.close(); const n = (title.match(/^[A-Z]+ (-?\d+)/) || [])[1];
  if (n !== '0') bad++;
  writeFileSync(`build/logs/test-${g}-${t}.txt`, title + '\n' + log + (errs.length ? '\nPAGE ERRORS\n' + errs.join('\n') : ''));
  console.log(`${g.padEnd(11)} ${t.padEnd(9)} ${title}${errs.length ? '  (' + errs.length + ' page errors)' : ''}`); if (n !== '0' && log) console.log(log.split('\n').slice(0, 14).map((l) => '    ' + l.slice(0, 220)).join('\n'));
}
await b.close(); process.exit(bad ? 1 : 0);
