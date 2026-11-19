// Headless checks of the built pages: node tools/checks_browser.mjs <what> [games...] [--auto] [--secs 20] [--size 390x800]
//   menu      click through menu/index.html to every game, check each loads with no errors, then its "Main Menu" link back (and the journal's)
//   errors    load each game (with --auto, run ?auto=1&one) and list script errors, console errors and files that fail to load
//   a11y      each game's title screen and the menu at a phone size: tap targets under 44 px, text contrast under WCAG AA, Tab order (engine/ui-audit.js)
//   size      what each game downloads before it can start, against the budget in tools/checks/<game>.json (budget.bytes)
//   harness   bog-walk only for now: run engine/checks.js checkAll on the live dev build through a test adapter (tools/checks/adapters/bog-walk.js)
//   fixtures  tests/checks.html: the accessibility checks catch planted faults
//   all       menu, errors, a11y and size
// It serves the repository the way dist/ is laid out (the menu at /, games at /games/<game>/site/), so nothing needs building except the games
// (node tools/build.mjs <game> --dev for the harness). Chrome: CHROME=/path, else google-chrome, else Playwright's own (npx playwright install chromium).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, writeFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { build } from 'esbuild';

const ROOT = process.cwd(), argv = process.argv.slice(2), what = argv[0] || 'all';
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const GAMES = readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/index.html`)).sort();
const chosen = argv.slice(1).filter((a) => GAMES.includes(a)); const games = chosen.length ? chosen : GAMES;
const [W, H] = opt('--size', '390x800').split('x').map(Number), SECS = +opt('--secs', 12);

/* ---------- a static server laid out like dist/ ---------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
function serve() {
  return new Promise((ok) => {
    const s = createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = /^\/(games|engine|build|tests|shared|menu|tools)\//.test(p) ? join(ROOT, p) : join(ROOT, 'menu', p);
      let f = normalize(file); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      if (existsSync(f) && statSync(f).isDirectory()) { if (!p.endsWith('/')) { res.writeHead(301, { location: p + '/' }); return res.end(); } f = join(f, 'index.html'); }
      if (!existsSync(f) && existsSync(f + '.html')) f += '.html';   /* vercel cleanUrls */
      if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
    });
    s.listen(0, '127.0.0.1', () => ok({ s, base: `http://127.0.0.1:${s.address().port}` }));
  });
}

async function browser() {
  let pw; try { pw = await import('playwright'); } catch (e) { const root = execSync('npm root -g').toString().trim(); for (const d of [root, '/opt/node-tools/node_modules']) { try { pw = createRequire(join(d, 'x.js'))('playwright'); break; } catch (e2) { /* next */ } } }
  if (!pw) throw new Error('Playwright is not installed: npm i -g playwright (or npx playwright install chromium)');
  const exe = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
  return (pw.chromium || pw.default.chromium).launch({ executablePath: exe, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
}

/* a page that records every error and every file that fails */
async function openPage(B, url, { w = W, h = H } = {}) {
  const page = await B.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 700, isMobile: false }), errors = [], bytes = { n: 0 };
  page.on('pageerror', (e) => errors.push('error: ' + String(e.message).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console.error: ' + m.text().slice(0, 200)); });
  page.on('requestfailed', (r) => { if (!/fonts\.(googleapis|gstatic)|instagram/.test(r.url())) errors.push(`failed to load ${r.url().replace(/^https?:\/\/[^/]+/, '')} (${r.failure() && r.failure().errorText})`); });
  page.on('response', async (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} for ${r.url().replace(/^https?:\/\/[^/]+/, '')}`); else if (r.url().startsWith('http://127.')) { const l = +(r.headers()['content-length'] || 0); bytes.n += l; } });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  return { page, errors, bytes };
}
const uiBundle = async () => { await build({ entryPoints: ['engine/checks.js'], bundle: true, format: 'iife', globalName: 'Checks', outfile: 'build/checks.iife.js', logLevel: 'warning' }); return readFileSync('build/checks.iife.js', 'utf8'); };
const uiAudit = async () => { await build({ stdin: { contents: "export * from './engine/ui-audit.js';", resolveDir: ROOT }, bundle: true, format: 'iife', globalName: 'UIA', outfile: 'build/ui-audit.iife.js', logLevel: 'warning' }); return readFileSync('build/ui-audit.iife.js', 'utf8'); };
const config = (g) => (existsSync(`tools/checks/${g}.json`) ? JSON.parse(readFileSync(`tools/checks/${g}.json`, 'utf8')) : {});

/* ---------- the checks ---------- */
async function menuCheck(B, base) {
  const out = [], { page, errors } = await openPage(B, base + '/?intro=0', { w: 1280, h: 800 });
  const links = await page.$$eval('a[href*="games/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  for (const g of GAMES) if (!links.some((l) => l.includes(`games/${g}/`))) out.push(`menu: no link to ${g}`);
  for (const href of links) {
    const name = (href.match(/games\/([^/]+)/) || [])[1];
    await page.goto(base + '/?intro=0', { waitUntil: 'load' });
    const a = await page.$(`a[href="${href}"]`); if (!a) { out.push(`menu: link ${href} disappeared`); continue; }
    const n0 = errors.length;
    try { await Promise.all([page.waitForURL((u) => u.pathname.includes(`/games/${name}/site`), { timeout: 30000 }), a.evaluate((el) => el.click())]); } catch (e) { out.push(`menu: clicking ${name} does not open its game (${e.message.split('\n')[0]})`); continue; }
    await page.waitForTimeout(SECS * 250);
    if (!(await page.$('#exitbtn'))) out.push(`${name}: no Exit button beside the Journal button (engine/exit.js)`);
    for (const id of ['allgames']) {
      const back = await page.$('#' + id);
      if (!back) { out.push(`${name}: no #${id} link back to the menu`); continue; }
      const u = new URL(await back.getAttribute('href'), page.url());
      if (!/^\/(menu\/?)?$/.test(u.pathname)) out.push(`${name}: #${id} goes to ${u.pathname}, not the menu`);
      const r = await page.request.get(u.href); if (!r.ok()) out.push(`${name}: #${id} (${u.pathname}) gives HTTP ${r.status()}`);
    }
    try { const back = await page.$('#allgames'); if (back) { await Promise.all([page.waitForURL((u) => /^\/(menu\/?)?$/.test(u.pathname), { timeout: 20000 }), back.evaluate((el) => el.click())]); if (!(await page.$('a[href*="games/"]'))) out.push(`${name}: "Main Menu" opens a page with no games on it`); } } catch (e) { out.push(`${name}: "Main Menu" does not go back (${e.message.split('\n')[0]})`); }
    for (const e of errors.slice(n0)) out.push(`${name}: ${e}`);
  }
  for (const href of await page.$$eval('a[href$=".html"], a[href*=".html#"]', (as) => as.map((a) => a.href))) { const r = await page.request.get(href); if (!r.ok()) out.push(`menu: ${href} gives HTTP ${r.status()}`); }
  await page.close(); return out;
}

async function errorCheck(B, base, g) {
  const auto = argv.includes('--auto'), url = `${base}/games/${g}/site/index.html${auto ? '?auto=1&one' : ''}`;
  const { page, errors } = await openPage(B, url); await page.waitForTimeout((auto ? SECS * 4 : SECS) * 1000);
  const log = auto ? await page.$eval('#autolog', (e) => e.textContent).catch(() => '') : '';
  if (auto && /STALL/.test(log)) errors.push('autoplayer: ' + (log.match(/.*STALL.*/) || [''])[0].slice(0, 160));
  await page.close(); return [...new Set(errors)];
}

async function a11yCheck(B, base, g, js) {
  const url = g === 'menu' ? base + '/' : `${base}/games/${g}/site/index.html`, { page } = await openPage(B, url);
  await page.waitForTimeout(g === 'menu' ? 1500 : SECS * 500); await page.addScriptTag({ content: js });
  const r = await page.evaluate(() => { const unknown = []; return { tap: UIA.tapTargetIssues(document, 44), contrast: UIA.contrastIssues(document, { unknown }), focus: UIA.focusOrderIssues(document), unknown: unknown.length }; });
  await page.close(); return r;
}

async function sizeCheck(B, base, g) {
  const { page, bytes } = await openPage(B, `${base}/games/${g}/site/index.html`); await page.waitForTimeout(SECS * 1000);
  const timing = await page.evaluate(() => performance.getEntriesByType('resource').reduce((a, e) => a + (e.encodedBodySize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.encodedBodySize || 0));
  const ready = await page.evaluate(() => { const s = document.getElementById('start'); return s ? !s.disabled : null; });
  await page.close(); const n = Math.max(bytes.n, timing), budget = (config(g).budget || {}).bytes || 30e6;
  return { bytes: n, ready, lines: n > budget ? [`downloads ${(n / 1e6).toFixed(1)} MB before play (budget ${(budget / 1e6).toFixed(0)} MB)`] : [] };
}

async function harness(B, base, g) {
  const adapter = `tools/checks/adapters/${g}.js`; if (!existsSync(adapter)) throw new Error('no adapter ' + adapter);
  const js = await uiBundle(), { page, errors } = await openPage(B, `${base}/games/${g}/site/index.html?nosave`, { w: 667, h: 375 });
  await page.waitForFunction(() => window.__bw && window.__bw.modelsReady, null, { timeout: 180000 });
  /* the journal check needs what the code unlocks and who speaks: read them the way the content lint does, and hand them to the page */
  const L = await import('./lint_content.mjs'), G = await L.readGame(g), cfg = config(g);
  const tables = { journal: { unlocks: G.unlocks, refs: G.refs, speakers: G.lines.map((l) => l.who) }, real: cfg.real || [], budget: cfg.budget || {} };
  await page.evaluate((t) => { window.__tables = t; }, tables);
  await page.addScriptTag({ content: js }); await page.addScriptTag({ content: readFileSync(adapter, 'utf8') });
  const only = opt('--checks', null);
  const r = await page.evaluate(async (only) => { const res = await Checks.checkAll(window.__adapter, window.__tables, only ? { only: only.split(',') } : {}); return res.text; }, only);
  await page.close(); return { text: r, errors };
}

async function fixtures(B, base) {
  const { page } = await openPage(B, base + '/tests/checks.html', { w: 800, h: 600 }); await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.title), null, { timeout: 30000 });
  const t = await page.title(); await page.close(); return t;
}

/* ---------- run ---------- */
const t0 = Date.now(), { s, base } = await serve(), B = await browser(), report = [], timing = {};
const step = async (name, fn) => { const t = Date.now(); const r = await fn(); timing[name] = ((Date.now() - t) / 1000).toFixed(1) + ' s'; return r; };
try {
  if (what === 'menu' || what === 'all') { const l = await step('menu', () => menuCheck(B, base)); report.push(`MENU ${l.length}`, ...l, ''); }
  if (what === 'errors' || what === 'all') { let n = 0; const rows = []; for (const g of games) { const l = await step('errors ' + g, () => errorCheck(B, base, g)); n += l.length; rows.push(`${g}: ${l.length}`, ...l.map((x) => '  ' + x)); } report.push(`ERRORS ${n}`, ...rows, ''); }
  if (what === 'a11y' || what === 'all') { const js = await uiAudit(); let n = 0; const rows = []; for (const g of ['menu', ...games]) { const r = await step('a11y ' + g, () => a11yCheck(B, base, g, js)); const l = [...r.tap, ...r.contrast, ...r.focus]; n += l.length; rows.push(`${g}: ${l.length} (tap ${r.tap.length}, contrast ${r.contrast.length}, focus ${r.focus.length}; ${r.unknown} texts over the 3D view not judged)`, ...l.map((x) => '  ' + x)); } report.push(`A11Y ${n} (${W}x${H})`, ...rows, ''); }
  if (what === 'size' || what === 'all') { let n = 0; const rows = []; for (const g of games) { const r = await step('size ' + g, () => sizeCheck(B, base, g)); n += r.lines.length; rows.push(`${g}: ${(r.bytes / 1e6).toFixed(1)} MB${r.ready === false ? ' (still loading)' : ''}`, ...r.lines.map((x) => '  ' + x)); } report.push(`SIZE ${n}`, ...rows, ''); }
  if (what === 'harness') for (const g of games) { const r = await step('harness ' + g, () => harness(B, base, g)); report.push(`HARNESS ${g}`, r.text, ...(r.errors.length ? ['page errors:', ...r.errors] : []), ''); }
  if (what === 'fixtures') report.push(await step('fixtures', () => fixtures(B, base)));
} finally { await B.close(); s.close(); }
console.log(report.join('\n')); console.log('timings: ' + JSON.stringify(timing) + ` total ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (opt('--out', null)) writeFileSync(opt('--out'), report.join('\n'));
