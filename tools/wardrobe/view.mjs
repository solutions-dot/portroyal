/* Draw try-on .glb files from several sides: node tools/wardrobe/view.mjs out.png a.glb,b.glb [views=front,q34,side,back] [zoom=body|top|neck|legs] [w=300] [h=520]
   Serve the repository root first (python3 -m http.server 8765). Paths are relative to the repository root. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const [out, files, ...opts] = process.argv.slice(2);
mkdirSync('build/review', { recursive: true });
await build({ entryPoints: ['tools/wardrobe/view.src.js'], bundle: true, format: 'esm', outfile: 'build/review/wardrobe-view.js', logLevel: 'error' });
writeFileSync('build/review/wardrobe.html', '<!doctype html><meta charset="utf-8"><title>VIEW</title><script type="module" src="wardrobe-view.js"></script>');
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const o = Object.fromEntries(opts.map((a) => a.split('='))), nv = (o.views || 'front,q34,side,back').split(',').length, n = files.split(',').length;
const p = await b.newPage({ viewport: { width: +(o.w || 300) * nv, height: +(o.h || 520) * n }, deviceScaleFactor: 1 }); p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto(`http://localhost:8765/build/review/wardrobe.html?files=${files.split(',').map((f) => '../../' + f).join(',')}&${opts.join('&')}`);
await p.waitForFunction(() => /^VIEW (done|error)/.test(document.title), null, { timeout: 300000 });
console.log(await p.title(), '->', out); await p.screenshot({ path: out }); await b.close();
