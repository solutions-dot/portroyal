/* Which big surfaces engine/surfaces.js dressed in a game, and why others were left: node tools/review/surf-report.mjs <game> [query]
   (a dev build, served at localhost:8765). Prints the counts by kind and shape, the reasons for leaving surfaces alone, and 40 examples with size, colour and place. */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [game, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 900, height: 500 } });
await p.goto(`http://localhost:8765/games/${game}/site/index.html?intro=0&${q}`, { timeout: 180000 });
try { if (!q.includes('shot=')) { await p.waitForFunction(() => { const s = document.getElementById('start'); return s && !s.disabled; }, null, { timeout: 120000 }); await p.click('#start'); } } catch {}
await p.waitForTimeout(15000);
const r = await p.evaluate(() => window.__SURF); const sk = Object.entries(r.skip).sort((a, b) => b[1] - a[1]).slice(0, 14);
console.log(game, 'calls', r.calls, 'dressed', r.dressed, JSON.stringify(sk)); console.log(JSON.stringify(r.kinds)); console.log(r.sample.join('\n'));
await b.close();
