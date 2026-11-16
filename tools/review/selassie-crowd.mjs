/* Capture actual game renders for the crowd beard review. */
import { mkdirSync, writeFileSync } from 'node:fs';
const { chromium } = await import(process.env.PW_MODULE || 'playwright');
const base = process.env.REVIEW_BASE || 'http://localhost:8902';
const out = 'build/integration-review'; mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
const results = [], errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 });
  if (process.env.REVIEW_FONT_HELPER) await (await import(process.env.REVIEW_FONT_HELPER)).installFonts(page.context());
  page.on('pageerror', e => errors.push(e.message));
  for (const [model, tier] of [['sel_rastaman66', '_focus'], ['sel_rastaman66', '_phone'], ['sel_rastaelder66', '_phone'], ['sel_rastatam66', '_phone']]) {
    await page.goto(base + '/games/selassie/site/?shot=likeness&base=' + model + '&tier=' + tier + '&ang=35&dy=-.015&fov=11', { timeout: 120000 });
    await page.waitForFunction(() => window.__SEL?.likeness, null, { timeout: 120000 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: out + '/' + model + tier + '-beard.png' });
    await page.evaluate(() => { const m = window.__SEL.likeness.m, h = m.getObjectByName('mixamorigHead'); h.rotation.y += .55; h.rotation.x += .15; m.updateMatrixWorld(true); });
    await page.waitForTimeout(100);
    await page.screenshot({ path: out + '/' + model + tier + '-beard-turned.png' });
    await page.evaluate(() => {
      const A = window.__SEL, T = A.likeness, h = T.m.getObjectByName('mixamorigHead'); h.rotation.y -= .55; h.rotation.x -= .15; T.m.updateMatrixWorld(true);
      const p = h.getWorldPosition(T.m.position.clone()); A.camera.fov = 22; A.camera.updateProjectionMatrix();
      A.S.view = { pos: [p.x, p.y - .22, p.z + 2.6], look: [p.x, p.y - .22, p.z] };
    });
    await page.waitForTimeout(100);
    await page.screenshot({ path: out + '/' + model + tier + '-upper-body.png' });
    results.push({ model, tier, captured: true });
  }
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto(base + '/games/selassie/site/?shot=poster', { timeout: 120000 });
  await page.waitForFunction(() => window.__SEL?.S.view, null, { timeout: 120000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: out + '/selassie-poster.jpg', type: 'jpeg', quality: 90 });
  writeFileSync(out + '/selassie-crowd.json', JSON.stringify({ results, errors }, null, 2) + '\n');
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('PASS crowd portrait renders and airport poster');
} finally { await browser.close(); }
