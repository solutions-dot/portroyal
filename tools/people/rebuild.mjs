/* Rebuild every game's people with the shared builder, and put each body wherever a game uses it (16 November 2026).
     node tools/people/rebuild.mjs [recipe ...] [--jobs 3] [--skip garvey1914,garvey1916]
   With no recipe names it rebuilds them all. A body is written to every games/<game>/site/models/ that already has <name>.js, with a light copy
   (<name>_lo.js) where that game has one. Recipes from tools/people (Port Royal), garvey, kendal, nanny and tivoli go through tools/garvey/era.py and
   tools/people/pack.mjs (Tivoli's uniformed recipes also through tools/tivoli/kit.py). The Emperor's Arrival and Windrush have their own build scripts
   (tools/selassie/build-people.mjs, tools/windrush/build-people.mjs), which this runs too. Then run tools/review/people-check.mjs all and look at the sheets. */
import { readdirSync, existsSync, readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const JOBS = +opt('--jobs', 3), skip = new Set((opt('--skip', '') || '').split(',').filter(Boolean)), wanted = args.filter((a, i) => !a.startsWith('--') && !['--jobs', '--skip'].includes(args[i - 1]));
const FULL_VARIANTS = { tivoli: ['woman_elder', 'girl', 'man_elder', 'civilian2010', 'guide2020'], garvey: ['guide2020'] };   /* games whose background people use full bodies */
const PY = process.env.PYTHON || 'python3', OUT = 'build/people-all/', REPACK = process.argv.includes('--repack');   /* --repack: pack again from the bodies already built in build/people-all (after a change to tools/people/pack.mjs), with no Blender */
mkdirSync(OUT, { recursive: true });
const DIRS = ['tools/people', 'tools/garvey/people', 'tools/kendal/people', 'tools/nanny/people', 'tools/tivoli/people'];
const games = readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/models`));
const recipes = [];
for (const d of DIRS) for (const f of readdirSync(d)) { if (!f.endsWith('.json') || f === 'faces.json') continue; const P = JSON.parse(readFileSync(`${d}/${f}`, 'utf8')); if (!P.name || !P.body) continue;
  if ((wanted.length && !wanted.includes(P.name)) || skip.has(P.name)) continue; const uses = games.filter((g) => existsSync(`games/${g}/site/models/${P.name}.js`) || existsSync(`games/${g}/site/models/${P.name}_lo.js`)); if (uses.length) recipes.push({ P, file: `${d}/${f}`, uses, kit: d.includes('tivoli') && P.kit }); }
const run = (cmd, a, env) => new Promise((res) => { const p = spawn(cmd, a, { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] }); let log = ''; p.stdout.on('data', (b) => (log += b)); p.stderr.on('data', (b) => (log += b)); p.on('close', (c) => res({ c, log })); });
let i = 0, failed = [];
async function worker() { while (i < recipes.length) { const r = recipes[i++], env = { NPC_OUT: OUT, MAKEHUMAN: process.env.MAKEHUMAN || '/tmp/mh/makehuman' };
  let x = REPACK && existsSync(OUT + r.P.name + '.glb') ? { c: 0, log: '' } : await run(PY, ['tools/garvey/era.py', JSON.stringify(r.P)], env); if (x.c === 0 && r.kit && !REPACK) x = await run(PY, ['tools/tivoli/kit.py', JSON.stringify(r.P)], env);
  if (x.c !== 0) { failed.push(r.P.name); console.log('FAILED', r.P.name, x.log.slice(-800)); continue; }
  /* "variants": ["broad", "lean"] in a recipe builds two more copies with those faces (and a slightly different build and hair), <name>_b and <name>_c (and <name>_d for a third), so a crowd
     need not put one face side by side (engine/faces.js). Light copies go wherever the game has <name>_lo.js; full copies only where FULL_VARIANTS lists them. */
  for (const [vi, face] of (r.P.variants || []).entries()) { const suf = ['_b', '_c', '_d'][vi], V = JSON.parse(JSON.stringify(r.P)); V.name = r.P.name + suf; V.face = face; delete V.variants;
    const sg = [1, -1, 0.4][vi]; V.body.weight = Math.max(0.2, Math.min(0.85, (V.body.weight ?? 0.5) + 0.07 * sg)); V.body.age = Math.max(0.2, Math.min(0.9, (V.body.age ?? 0.4) + 0.05 * sg)); V.body.height = Math.max(0.3, Math.min(0.7, (V.body.height ?? 0.5) - 0.03 * sg));
    if (V.garments.hairvol !== undefined) V.garments.hairvol = +(V.garments.hairvol * [1.5, 0.6, 1.2][vi]).toFixed(2);
    let y = REPACK && existsSync(OUT + V.name + '.glb') ? { c: 0, log: '' } : await run(PY, ['tools/garvey/era.py', JSON.stringify(V)], env); if (y.c === 0 && r.kit && !REPACK) y = await run(PY, ['tools/tivoli/kit.py', JSON.stringify(V)], env);
    if (y.c !== 0) { failed.push(V.name); console.log('FAILED', V.name, y.log.slice(-600)); continue; }
    mkdirSync(OUT + 'v', { recursive: true }); const p = spawnSync(process.execPath, ['tools/people/pack.mjs', '--src', OUT, '--out', OUT + 'v', '--lo', V.name], { encoding: 'utf8' }); if (p.status) { failed.push(V.name + ' pack'); continue; }
    for (const g of r.uses) { if (existsSync(`games/${g}/site/models/${r.P.name}_lo.js`)) copyFileSync(`${OUT}v/${V.name}_lo.js`, `games/${g}/site/models/${V.name}_lo.js`); if ((FULL_VARIANTS[g] || []).includes(r.P.name)) copyFileSync(`${OUT}v/${V.name}.js`, `games/${g}/site/models/${V.name}.js`); }
    console.log(`${V.name} (${face}) -> ${r.uses.join(', ')}`); }
  for (const g of r.uses) { const lo = existsSync(`games/${g}/site/models/${r.P.name}_lo.js`), full = existsSync(`games/${g}/site/models/${r.P.name}.js`);
    const p = spawnSync(process.execPath, ['tools/people/pack.mjs', '--src', OUT, '--out', `games/${g}/site/models`, ...(lo ? ['--lo'] : []), r.P.name], { encoding: 'utf8' });
    if (p.status) { failed.push(r.P.name + '@' + g); console.log(p.stderr.slice(-400)); continue; }
    if (!full) spawnSync('rm', ['-f', `games/${g}/site/models/${r.P.name}.js`]);   /* this game ships only the light copy */
    console.log(`${r.P.name} -> ${g}${lo ? ' (+lo)' : ''}${full ? '' : ' (light copy only)'}`); } } }
await Promise.all(Array.from({ length: JOBS }, worker));
if (!wanted.length || wanted.some((n) => n.startsWith('sel_'))) { const s = spawnSync(process.execPath, ['tools/selassie/build-people.mjs', ...wanted.filter((n) => n.startsWith('sel_'))], { encoding: 'utf8', env: process.env }); console.log('selassie:', s.status === 0 ? 'built' : 'FAILED ' + (s.stderr || '').slice(-400)); if (s.status) failed.push('selassie'); }
if (!wanted.length || wanted.some((n) => n.startsWith('wr_'))) { const s = spawnSync(process.execPath, ['tools/windrush/build-people.mjs', ...wanted.filter((n) => n.startsWith('wr_'))], { encoding: 'utf8', env: process.env }); console.log('windrush:', s.status === 0 ? 'built' : 'FAILED ' + (s.stderr || '').slice(-400)); if (s.status) failed.push('windrush'); }
console.log(`REBUILT ${recipes.length} recipes` + (failed.length ? `, FAILED: ${failed.join(', ')}` : ''));
process.exit(failed.length ? 1 : 0);
