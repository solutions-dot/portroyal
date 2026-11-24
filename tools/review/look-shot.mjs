/* A before-and-after picture of a game for engine/look.js: node tools/review/look-shot.mjs <game> <out.png> [query] [wait ms] [WxH]
   With shot=... in the query (a dev build's test view) it waits and takes the picture as the view shows it; otherwise it presses Start first.
   Every button and panel is hidden, so only the picture is compared. Add nosky&noao for the look before engine/look.js. */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [game, out, extra = '', wait = '9000', size = '1280x720'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(`http://localhost:8765/games/${game}/site/index.html?intro=0&${extra}`, { timeout: 180000 });
if (!/(^|&)shot=/.test(extra)) { try { await p.waitForFunction(() => { const s = document.getElementById('start'); return s && !s.disabled; }, null, { timeout: 180000 }); await p.click('#start'); } catch (e) { errs.push('no start: ' + e.message); } }
await p.waitForTimeout(+wait);
for (let i = 0; i < 6; i++) { try { await p.keyboard.press('Escape'); } catch {} }
await p.addStyleTag({ content: 'body > *:not(canvas):not(#stage){visibility:hidden!important} #stage *:not(canvas){visibility:hidden!important}' });
await p.waitForTimeout(1500);
const look = await p.evaluate(() => (window.__LOOK ? JSON.stringify(window.__LOOK) : ''));
await p.screenshot({ path: out });
console.log(game, out, look, errs.slice(0, 4).join(' | '));
await b.close();
