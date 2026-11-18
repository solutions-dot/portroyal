/* tools/trailer/record.mjs: record a clip from a game's dev build for the platform trailer.
   The page's clock is replaced, so each frame is drawn at an exact 1/fps step however slow software drawing is.

     node tools/trailer/record.mjs <clip.json>      (the repo root served on :8765)

   clip.json: { url, out, w, h, fps, warm, secs, wait, css, js, ready }
     url    page under http://localhost:8765/
     out    folder for the frames (f00001.jpg ...)
     warm   seconds of game time stepped before frames are kept
     secs   seconds recorded
     wait   real seconds to let the page load before stepping by hand (or ready: a JS expression to wait for)
     clean  hide everything but the 3D picture (captions, buttons, bars)
     css    style added to the page (hide a caption or the interface)
     js     JS run in the page after loading, before warm
     seekCss  move CSS animations on the page's clock too
     pump   false: no frames are drawn while the page loads (a scene that starts at once waits for the first kept frame)
     storage  { key: value } put in localStorage before the page loads (a saved game to start from)
     phone  a phone held upright (touch, twice the pixels): w and h are the phone's size in CSS pixels
     keys   keys held down while recording (['KeyW'] walks forward)
     every  keep one frame in this many (a contact sheet to choose moments from) */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
const C = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const fps = C.fps || 30, W = C.w || 1280, H = C.h || 720;
fs.mkdirSync(C.out, { recursive: true });
for (const f of fs.readdirSync(C.out)) if (f.endsWith('.jpg')) fs.unlinkSync(`${C.out}/${f}`);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage(C.phone ? { viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 200)); });
await page.addInitScript(() => {
  let vt = 0, q = [], pump = null;
  performance.now = () => vt;
  const d0 = Date.now(); Date.now = () => d0 + vt;
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length; };
  window.cancelAnimationFrame = () => {};
  const seen = new Map();   /* CSS animations and transitions, held and moved on with the same clock (a menu or a title screen) */
  window.__seekCss = false;
  /* wait for the graphics process to finish what has been drawn (read one pixel back), so steps never pile up ahead of the screenshot */
  window.__sync = () => { for (const c of document.querySelectorAll('canvas')) { const g = c.getContext('webgl2') || c.getContext('webgl'); if (g) g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array(4)); } };
  window.__step = (ms) => {
    vt += ms; const c = q; q = []; for (const f of c) { try { f(vt); } catch (e) { console.error(e); } }
    if (window.__seekCss) for (const a of document.getAnimations()) {
      if (!seen.has(a)) { seen.set(a, vt - ms); a.pause(); }
      try { a.currentTime = vt - seen.get(a); } catch (e) { /* finished and removed */ }
    }
  };
  if (!/[?&]nopump/.test(location.hash)) pump = setInterval(() => window.__step(33), 40);   /* the game runs while it loads, unless the clip asks it to wait */
  window.__manual = () => clearInterval(pump);
});
if (C.storage) await page.addInitScript((st) => { for (const k in st) localStorage.setItem(k, JSON.stringify(st[k])); }, C.storage);
await page.goto('http://localhost:8765/' + C.url + (C.pump === false ? '#nopump' : ''));
if (C.ready) await page.waitForFunction(C.ready, null, { timeout: 240000, polling: 500 });
await page.waitForTimeout((C.wait || 5) * 1000);
const CLEAN = 'body *:not(canvas){visibility:hidden!important} canvas{visibility:visible!important}';
if (C.css || C.clean) await page.addStyleTag({ content: (C.clean ? CLEAN : '') + (C.css || '') });
await page.evaluate(() => window.__manual());
if (C.seekCss) await page.evaluate(() => { window.__seekCss = true; });
if (C.js) await page.evaluate(C.js);
const dt = 1000 / fps;
for (const k of C.keys || []) await page.keyboard.down(k);   /* held for the whole clip: a walk */
for (let i = 0; i < (C.warm || 0) * fps; i++) await page.evaluate((d) => { window.__step(d); window.__sync(); }, dt);
const t0 = Date.now(), every = C.every || 1, n = Math.round(((C.secs || 4) * fps) / every);
for (let i = 0; i < n; i++) {
  await page.evaluate(([d, k]) => { for (let j = 0; j < k; j++) { window.__step(d); window.__sync(); } }, [dt, every]);
  await page.screenshot({ path: `${C.out}/f${String(i + 1).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92, timeout: 300000 });
  if (i % 30 === 0) process.stdout.write(`${i}/${n} ${((Date.now() - t0) / (i + 1)).toFixed(0)}ms/f\n`);
}
await browser.close();
