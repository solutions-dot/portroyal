// tools/people/fix_colours.mjs: bring packed bodies built before the colour fix up to date, without rebuilding them in Blender.
// Bodies built by tools/garvey/era.py between the two colour fixes wrote Skin as its recipe says but every other colour made linear twice
// (far too dark). This undoes that second step on every piece except Skin, rescales Skin to a new recipe colour when one is given, and marks the
// body vertexColorSpace: linear so engine/colours.js leaves it alone. A body that is already marked is skipped.
// node tools/people/fix_colours.mjs games/kendal/site/models/boy.js [--skin old=r,g,b new=r,g,b]
import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const undo = (v) => v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
const lin = (c) => Math.pow(c / 255, 2.2);   // what srgb() in era.py does
const args = process.argv.slice(2), file = args[0], skin = {};
for (const a of args.slice(1)) { const m = a.match(/^(old|new)=(\d+),(\d+),(\d+)$/); if (m) skin[m[1]] = [+m[2], +m[3], +m[4]]; }
const src = fs.readFileSync(file, 'utf8'), m = src.match(/^\(window\.__models=window\.__models\|\|\{\}\)\["([^"]+)"\]="([^"]+)";$/);
if (!m) throw new Error('not a packed model: ' + file);
const doc = await io.readBinary(Buffer.from(m[2], 'base64')), scene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
if ((scene.getExtras() || {}).vertexColorSpace === 'linear') { console.log(file, 'already marked, skipped'); process.exit(0); }
const k = skin.old && skin.new ? [0, 1, 2].map((i) => lin(skin.new[i]) / lin(skin.old[i])) : null;
let pieces = 0;
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const c = p.getAttribute('COLOR_0'); if (!c) continue; const isSkin = /^Skin/.test(p.getMaterial()?.getName() || '');
  if (isSkin && !k) continue;
  const arr = new Float32Array(c.getCount() * c.getElementSize()), e = [];
  for (let i = 0; i < c.getCount(); i++) { c.getElement(i, e); for (let j = 0; j < 3; j++) e[j] = isSkin ? Math.min(1, e[j] * k[j]) : undo(e[j]); arr.set(e, i * e.length); }
  const a = doc.createAccessor().setType(c.getType()).setArray(arr).setBuffer(doc.getRoot().listBuffers()[0]);
  p.setAttribute('COLOR_0', a); pieces++; }
scene.setExtras({ ...(scene.getExtras() || {}), vertexColorSpace: 'linear' });
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
fs.writeFileSync(file, `(window.__models=window.__models||{})["${m[1]}"]="${Buffer.from(await io.writeBinary(doc)).toString('base64')}";`);
console.log(file, pieces, 'pieces fixed', k ? 'skin x ' + k.map((x) => x.toFixed(3)).join(',') : '');
