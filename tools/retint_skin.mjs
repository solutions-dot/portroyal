// Change the skin tone of packed characters without rebuilding them: only the skin's vertex colours change.
// Use it when a character's other geometry (clothes, hat) must stay exactly as it is.
//   node tools/retint_skin.mjs --dir games/port-royal/site/models --from 122,80,56 --to 159,107,77 kofi
// --from is the Skin colour the character was built with (tools/people/*.json), --to is the new one, both sRGB 0 to 255.
// Also update that character's JSON so a future rebuild gives the same tone.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const DIR = arg('--dir'), from = (arg('--from') || '').split(',').map(Number), to = (arg('--to') || '').split(',').map(Number);
const names = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !['--dir', '--from', '--to'].includes(all[i - 1]));
if (!DIR || from.length !== 3 || to.length !== 3 || !names.length) { console.error('usage: node tools/retint_skin.mjs --dir <models dir> --from r,g,b --to r,g,b name [name...]'); process.exit(1); }
// npc.py writes each colour as (sRGB / 255) ^ 2.2 into a byte colour layer, and Blender treats those bytes as already sRGB-encoded,
// so the exported linear value is raised to 2.2 again: stored = (sRGB / 255) ^ 4.84. The scale below gives the same result as rebuilding from the JSON.
const k = from.map((f, i) => Math.pow(to[i] / f, 2.2 * 2.2));
for (const n of names) {
  const file = `${DIR}/${n}.js`, src = fs.readFileSync(file, 'utf8'), m = src.match(/"([A-Za-z0-9+/=]{200,})"/);
  if (!m) { console.error(n + ': no packed model found in ' + file); process.exit(1); }
  const doc = await io.readBinary(new Uint8Array(Buffer.from(m[1], 'base64')));
  let verts = 0;
  for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
    if (p.getMaterial()?.getName() !== 'Skin') continue;
    const col = p.getAttribute('COLOR_0'); if (!col) continue; const e = new Array(col.getElementSize()).fill(1);
    for (let i = 0; i < col.getCount(); i++) { col.getElement(i, e); for (let c = 0; c < 3; c++) e[c] = Math.min(1, e[c] * k[c]); col.setElement(i, e); verts++; }
  }
  if (!verts) { console.error(n + ': no Skin vertices found, nothing changed'); process.exit(1); }
  const out = Buffer.from(await io.writeBinary(doc));
  fs.writeFileSync(file, `(window.__models=window.__models||{})["${n}"]="${out.toString('base64')}";`);
  console.log(n + ': recoloured ' + verts + ' skin vertices, ' + from.join(',') + ' -> ' + to.join(',') + ', ' + out.length + ' bytes');
}
