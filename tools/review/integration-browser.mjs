/* Review the combined branch against a local dev build served from the repository root. No deployment.
   PW_MODULE=/path/to/playwright-core/index.mjs node tools/review/integration-browser.mjs core
   REVIEW_BASE, REVIEW_OUT, CHROME and REVIEW_FONT_HELPER optionally select the test environment. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const { chromium } = await import(process.env.PW_MODULE || 'playwright');
const installFonts = process.env.REVIEW_FONT_HELPER ? (await import(process.env.REVIEW_FONT_HELPER)).installFonts : async () => {};
const mode = process.argv[2] || 'core';
const chosen = process.argv.slice(3);
const base = process.env.REVIEW_BASE || 'http://localhost:8902';
const out = process.env.REVIEW_OUT || 'build/integration-review';
mkdirSync(out, { recursive: true });
const core = ['garvey', 'kendal', 'nanny', 'port-royal', 'selassie', 'windrush'];
const all = ['bog-walk', 'eventide', 'garvey', 'kendal', 'melissa', 'nanny', 'port-royal', 'selassie', 'tivoli', 'windrush'];
const games = chosen.length ? chosen : mode === 'tivoli' ? ['tivoli'] : mode === 'menu' ? ['desktop', 'mobile'] : mode === 'legacy' ? ['bog-walk', 'eventide', 'melissa'] : ['core', 'play'].includes(mode) ? core : all;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
let failures = 0;
try {
  for (const game of games) {
    const context = await browser.newContext({ viewport: { width: game === 'desktop' ? 1440 : Number(process.env.REVIEW_WIDTH || 390), height: 800 }, deviceScaleFactor: .5, hasTouch: game !== 'desktop', isMobile: game !== 'desktop' });
    await installFonts(context);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.stack || e.message));
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base) && !r.url().endsWith('favicon.ico')) errors.push(r.status() + ' ' + r.url()); });
    const report = { game, mode, errors };
    try {
      const checks = mode === 'core' ? 'journal,links,a11y,keys,chapters,steps,map,sound,continuity,errors' : 'autoplay,camera,rule4,errors';
      const suffix = mode === 'legacy' ? '?auto=' + (game === 'bog-walk' ? 'all' : '1') : ['core', 'play'].includes(mode) ? '?test=all&checks=' + checks : '';
      await page.goto(mode === 'menu' ? base + '/menu/' : base + '/games/' + game + '/site/' + suffix, { timeout: 120000 });
      if (mode === 'menu') {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('#contactopen').waitFor({ state: 'visible' });
        const cards = page.locator('a.game');
        if (await cards.count() !== 10) throw new Error('menu must have ten game cards');
        report.links = await cards.evaluateAll(es => es.map(e => ({ game: e.dataset.game, url: e.href })));
        for (const link of report.links) { const response = await context.request.get(link.url); if (!response.ok()) throw new Error('broken card: ' + link.game); }
        report.pills = await page.locator('nav.links > *').evaluateAll(es => es.map(e => ({ label: e.textContent.trim(), rect: e.getBoundingClientRect().toJSON() })));
        if (!report.pills.at(-1).label.includes('Created by Kellz 5.0')) throw new Error('creator pill is not last');
        if (game === 'desktop' && report.pills.some(e => Math.abs(e.rect.top - report.pills[0].rect.top) > 2)) throw new Error('desktop pills are not on one line');
        await page.locator('#contactopen').hover();
        report.hover = await page.locator('#contactopen').evaluate(e => ({ text: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor }));
        await page.screenshot({ path: resolve(out, 'menu-' + game + '.png') });
        await page.locator('#contactopen').click();
        await page.locator('#contactpanel').waitFor({ state: 'visible' });
        if (await page.locator('#contactform select').count() !== 2) throw new Error('contact enquiry/role fields missing');
        const bounds = await page.locator('#contactpanel').boundingBox();
        if (bounds.x < 0 || bounds.x + bounds.width > page.viewportSize().width) throw new Error('contact form exceeds viewport');
        await page.screenshot({ path: resolve(out, 'contact-' + game + '.png') });
        await page.locator('#contactclose').click();
        report.ok = !errors.length;
      } else if (mode === 'tivoli') {
        await page.waitForFunction(() => window.__T, null, { timeout: 120000 });
        report.chapters = [];
        for (const chapter of [1, 2, 3, 4, 5, 6, 7, 8, 1]) {
          if (await page.locator('#title').isVisible()) await page.locator('#chbtn').click();
          else { await page.locator('#jhud').click(); await page.locator('#jchap').click(); }
          await page.locator('#chlist .chrow button').nth(chapter - 1).click();
          if (chapter === 5) {
            await page.locator('#fightcard').waitFor({ state: 'visible' });
            await page.locator('#fread').click();
            await page.locator('#readcard').waitFor({ state: 'visible' });
            if (await page.evaluate(() => window.__T.CH.on)) throw new Error('old walking chapter remains active in read-instead scene');
            await page.locator('#freadexit').click();
            report.chapters.push({ chapter, route: 'read instead' });
            continue;
          }
          await page.waitForFunction(id => window.__T.CH.on && window.__T.CH.id === id && document.getElementById('fightload').hidden, chapter, { timeout: 120000 });
          const count = await page.evaluate(() => window.__T.Talk.npcs.length);
          if (count !== 3) throw new Error('chapter ' + chapter + ' retained old story people: ' + count);
          if (report.chapters.length === 0) { report.chapters.push({ chapter, switchedWhilePlaying: true }); continue; }
          for (let person = 0; person < 3; person++) {
            await page.evaluate(i => { const T = window.__T, n = T.Talk.npcs[i]; T.state.x = n.x + .8; T.state.z = n.z + .3; T.talkStart(n); }, person);
            for (let line = 0; line < 40 && await page.locator('#dialogue').isVisible(); line++) await page.locator('#next').click();
            if (await page.locator('#dialogue').isVisible()) throw new Error('dialogue did not finish');
          }
          await page.evaluate(() => { const T = window.__T, e = T.CH.place.endSpot; T.state.x = e.x; T.state.z = e.z; });
          await page.locator('#chcard').waitFor({ state: 'visible', timeout: 30000 });
          await page.locator('#chdone').click();
          report.chapters.push({ chapter, completed: true });
        }
        report.ok = !errors.length;
      } else if (mode === 'legacy') {
        await page.waitForFunction(() => /ALLDONE|AUTO OK|AUTO FAIL|STALL/.test(document.title), null, { timeout: 900000 });
        report.title = await page.title();
        report.log = await page.locator('#autolog').textContent();
        report.ok = /ALLDONE|AUTO OK/.test(report.title) && !errors.length;
      } else if (['core', 'play'].includes(mode)) {
        await page.waitForFunction(() => window.__checks, null, { timeout: mode === 'play' ? 900000 : 240000 });
        report.checks = await page.evaluate(() => window.__checks);
        report.ok = report.checks.n === 0 && !errors.length && report.checks.rows.every(r => r.status !== 'error');
      } else {
        await page.waitForFunction(() => document.getElementById('start') && !document.getElementById('start').disabled, null, { timeout: 120000 });
        const chapters = page.getByRole('button', { name: 'Chapters', exact: true }).first();
        await chapters.click();
        await page.locator('#chapters').waitFor({ state: 'visible' });
        const footer = await page.locator('#chapters button').evaluateAll(bs => bs.filter(b => /^(Unlock All|Credits|Restart)$/.test(b.textContent.trim())).map(b => ({ label: b.textContent.trim(), rect: b.getBoundingClientRect().toJSON() })));
        report.footer = footer;
        if (footer.length !== 3 || footer.some(b => b.rect.left < 0 || b.rect.right > page.viewportSize().width || b.rect.height < 44 || Math.abs(b.rect.top - footer[0].rect.top) > 3)) throw new Error('chapter footer does not fit');
        await page.locator('#chapters').getByRole('button', { name: /close/i }).first().click();
        await page.locator('#start').click();
        for (let i = 0; i < 8; i++) {
          const buttons = page.locator('#cbtns button:visible');
          if (await buttons.count()) await buttons.first().click();
          else await page.waitForTimeout(250);
        }
        const journal = page.locator('#jbtn:visible, #jhud:visible').first();
        await journal.waitFor({ state: 'visible', timeout: 30000 });
        await journal.click();
        await page.locator('#journal').waitFor({ state: 'visible' });
        const menu = page.locator('#journal a').filter({ hasText: /Main Menu/i }).first();
        if (!(await menu.count())) throw new Error('journal lacks Main Menu link');
        await page.screenshot({ path: resolve(out, game + '-journal.png') });
        await menu.click();
        await page.waitForURL('**/menu/');
        report.ok = !errors.length;
      }
    } catch (e) {
      report.ok = false;
      report.failure = e.message;
      report.visibleReport = await page.locator('#autolog').textContent().catch(() => null);
      await page.screenshot({ path: resolve(out, mode + '-' + game + '-failure.png') }).catch(() => {});
    }
    if (!report.ok) failures++;
    writeFileSync(resolve(out, mode + '-' + game + '.json'), JSON.stringify(report, null, 2) + '\n');
    console.log((report.ok ? 'PASS ' : 'FAIL ') + mode + ' ' + game + (report.checks ? ' ALL ' + report.checks.n : '') + (report.failure ? ': ' + report.failure.split('\n')[0] : ''));
    await context.close();
  }
} finally { await browser.close(); }
if (failures) process.exitCode = 1;
