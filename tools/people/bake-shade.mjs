// Bake corner shading into bodies that are already packed (graphics step 1, 24 November 2026), without building them again in Blender (rebuilding is what
// made the suited men worse, docs/HANDOFF.md). Each packed model is opened, shaded by tools/people/shade.mjs and written back, still compressed the same way.
//   node tools/people/bake-shade.mjs games/garvey/site/models/garvey1914.js ...     some files
//   node tools/people/bake-shade.mjs --game garvey                                   every packed body of one game
//   node tools/people/bake-shade.mjs --all                                           every packed body of every game
// A model already shaded is left as it is. Anything that is not a skinned body (a prop, a building) is left alone.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';
import path from 'path';
import { shadeDoc } from './shade.mjs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const A = process.argv.slice(2);
let files = A.filter((a) => a.endsWith('.js'));
const gi = A.indexOf('--game');
const games = A.includes('--all') ? fs.readdirSync('games').filter((g) => !g.startsWith('_')) : gi >= 0 ? [A[gi + 1]] : [];
for (const g of games) { const d = `games/${g}/site/models`; if (fs.existsSync(d)) files.push(...fs.readdirSync(d).filter((f) => f.endsWith('.js')).map((f) => path.join(d, f))); }
let done = 0, skip = 0, other = 0;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8'), m = t.match(/^\(window\.__models=window\.__models\|\|\{\}\)\["([^"]+)"\]="([A-Za-z0-9+/=]+)";$/);
  if (!m) { other++; continue; }
  const bin = Buffer.from(m[2], 'base64'); if (bin.readUInt32LE(0) !== 0x46546c67) { other++; continue; }
  const doc = await io.readBinary(new Uint8Array(bin));
  if (!doc.getRoot().listSkins().length) { other++; continue; }
  const t0 = Date.now(), r = shadeDoc(doc);
  if (r.skipped) { skip++; continue; }
  const out = await io.writeBinary(doc);
  fs.writeFileSync(f, `(window.__models=window.__models||{})["${m[1]}"]="${Buffer.from(out).toString('base64')}";`);
  done++; console.log('SHADED', f, r.shaded, 'pieces', r.tris, 'triangles', ((Date.now() - t0) / 1000).toFixed(1) + ' s', (bin.length / 1024).toFixed(0) + ' -> ' + (out.length / 1024).toFixed(0) + ' KB');
}
console.log(`BAKE SHADE: ${done} shaded, ${skip} already shaded, ${other} not a body`);
