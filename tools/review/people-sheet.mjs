/* A character sheet for any game's packed bodies: node tools/review/people-sheet.mjs <game> <id,id,...> [out.png] [key=value ...]
   Serve the repository root first (python3 -m http.server 8765). Options: anim=Idle, hide=Hat,Cap (material names), skin=1.55,
   views=front,side,back,face,face34,faceside (also torso, torso34, torsoside, torsoback for a closer look at the clothes), w=300, h=420, at=0.4 (seconds into the clip). An id may be a path to a packed file's folder
   and name (build/exp/a reads build/exp/a.js). Writes build/review/<game>-<ids>.png unless out is given. See docs/TESTING.md. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const [game, ids, ...rest] = process.argv.slice(2), opts = rest.filter((a) => a.includes('=')), out = rest.find((a) => !a.includes('=')) || `build/review/${game}-${ids.replace(/[^\w,]/g, '_').slice(0, 80)}.png`;
mkdirSync('build/review', { recursive: true });
await build({ entryPoints: ['tools/review/people-sheet.src.js'], bundle: true, format: 'esm', outfile: 'build/review/people-sheet.js', logLevel: 'error' });
writeFileSync('build/review/sheet.html', '<!doctype html><meta charset="utf-8"><title>SHEET</title><script type="module" src="people-sheet.js"></script>');
const { chromium } = process.env.PW_MODULE ? await import(process.env.PW_MODULE) : createRequire(import.meta.url)('playwright');   /* a project or a machine-wide install */
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const n = ids.split(',').length, o = Object.fromEntries(opts.map((a) => a.split('='))), nv = (o.views || 'a,b,c,d,e,f').split(',').length;
const p = await b.newPage({ viewport: { width: +(o.w || 300) * nv, height: +(o.h || 420) * n }, deviceScaleFactor: 1 });
p.on('pageerror', (e) => console.log('ERR', e.message));
const fix = (id) => id.includes('/') ? '../../' + id : id;
await p.goto(`${process.env.REVIEW_BASE || 'http://localhost:8765'}/build/review/sheet.html?game=${game}&ids=${ids.split(',').map(fix).join(',')}&${opts.join('&')}`);
await p.waitForFunction(() => /^SHEET (done|error)/.test(document.title), null, { timeout: 300000 });
console.log(await p.title(), '->', out);
await p.screenshot({ path: out });
await b.close();
