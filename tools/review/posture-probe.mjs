/* How far a clip bends a body away from the shape it was built in: node tools/review/posture-probe.mjs <game> <id,id,...> [anims=Idle,Walk,Talk1]
   Serve the repository root first (python3 -m http.server 8765) and build the game (node tools/build.mjs <game> --dev), as for people-sheet.mjs.
   Prints, for each body and clip, the pitch of each trunk bone against the body's own rest pose (degrees, + is forward) and the trunk's shape
   (the lean of each bone and how far the head is ahead of the hips, in cm) at rest and in the clip. An id may be a path (build/exp/a). See docs/TESTING.md. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const [game, ids, ...rest] = process.argv.slice(2), opts = rest.filter((a) => a.includes('=')), json = rest.includes('--json');
mkdirSync('build/review', { recursive: true });
await build({ entryPoints: ['tools/review/posture-probe.src.js'], bundle: true, format: 'esm', outfile: 'build/review/posture-probe.js', logLevel: 'error' });
writeFileSync('build/review/posture.html', '<!doctype html><meta charset="utf-8"><title>POSTURE</title><script type="module" src="posture-probe.js"></script>');
const { chromium } = process.env.PW_MODULE ? await import(process.env.PW_MODULE) : createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); p.on('pageerror', (e) => console.log('ERR', e.message));
const fix = (id) => id.includes('/') ? '../../' + id : id;
await p.goto(`${process.env.REVIEW_BASE || 'http://localhost:8765'}/build/review/posture.html?game=${game}&ids=${ids.split(',').map(fix).join(',')}&${opts.join('&')}`);
await p.waitForFunction(() => /^POSTURE (done|error)/.test(document.title), null, { timeout: 300000 });
const out = await p.evaluate(() => window.__POSTURE); await b.close();
if (json) console.log(JSON.stringify(out)); else for (const [id, r] of Object.entries(out || {})) {
  console.log(`${id}\n  rest  lean: Spine ${r.rest.Spine} Spine1 ${r.rest.Spine1} Spine2 ${r.rest.Spine2} Neck ${r.rest.Neck} Head ${r.rest.Head}; neck ${r.rest.neckFwd} cm and head ${r.rest.headFwd} cm ahead of the hips`);
  for (const [an, c] of Object.entries(r.clips)) { if (c === 'missing') { console.log(`  ${an}: missing`); continue; }
    console.log(`  ${an.padEnd(10)} lean: Spine ${c.shape.Spine} Spine1 ${c.shape.Spine1} Spine2 ${c.shape.Spine2} Neck ${c.shape.Neck} Head ${c.shape.Head}; neck ${c.shape.neckFwd} cm, head ${c.shape.headFwd} cm ahead`);
    console.log(`  ${''.padEnd(10)} pitch against rest: ` + Object.entries(c.pitch).map(([k, v]) => `${k} ${v}`).join(', ')); } }
