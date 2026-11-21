/* Writes engine/rig-rest.js: the rest pose of the skeleton every clip was made on (shared/rig/char.blend, read from the packed clip
   library shared/models/anims.js, which carries that skeleton). engine/anim.js fitRig() uses it so each body moves from the shape it was
   built in (docs/ENGINE.md, "Every body keeps its own shape"). Run again only if the clip library is retargeted onto a different skeleton:
     node tools/anims/rig_rest.mjs            writes the file
     node tools/anims/rig_rest.mjs --check    exits 1 if the file does not match the clip library (run by npm test) */
import { readFileSync, writeFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
const src = readFileSync('shared/models/anims.js', 'utf8'), buf = Buffer.from(src.match(/\]="([^"]+)"/)[1], 'base64');
await MeshoptDecoder.ready;
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder }).readBinary(new Uint8Array(buf));
const mul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const world = (n) => { const p = n.getParentNode(); return p ? mul(world(p), n.getRotation()) : n.getRotation(); };
const out = {};
for (const n of doc.getRoot().listNodes()) { const m = n.getName().match(/^mixamorig:?(\w+)$/); if (!m) continue; const q = world(n), s = q[3] < 0 ? -1 : 1; out[m[1]] = q.map((x) => +(x * s).toFixed(5)); }
const names = Object.keys(out).sort();
const text = `/* The rest pose of the skeleton every clip was made on: each bone's rotation in the skeleton's own space (x, y, z, w), by bone name without
   the mixamorig prefix. Written by tools/anims/rig_rest.mjs from shared/models/anims.js. Do not edit by hand. Used by fitRig() in engine/anim.js. */
export const RIG_REST = {
${names.map((k) => `  ${k}: [${out[k].join(', ')}],`).join('\n')}
};
`;
if (process.argv.includes('--check')) { const have = (() => { try { return readFileSync('engine/rig-rest.js', 'utf8'); } catch { return ''; } })(); if (have !== text) { console.error('engine/rig-rest.js does not match shared/models/anims.js: run node tools/anims/rig_rest.mjs'); process.exit(1); } console.log('rig-rest ok,', names.length, 'bones'); }
else { writeFileSync('engine/rig-rest.js', text); console.log('wrote engine/rig-rest.js,', names.length, 'bones'); }
