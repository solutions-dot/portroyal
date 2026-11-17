// tools/checks/stray-points.mjs: finds points of a body piece that lie far (over 10 cm) from every other point of that piece.
// One such point stretches a long thin spike out of the cloth (a Tivoli police vest had one 1.5 m out: it looked like a sword in his hand).
// Usage: node tools/checks/stray-points.mjs build/people-all/*.glb build/windrush-people/*.glb build/selassie-people/*.glb  (the unpacked bodies: packed files are quantized and read wrongly here). Exit 1 if any.
import fs from 'fs'; import path from 'path'; import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const files = process.argv.slice(2); let bad = 0;
for (const file of files) {
  let bin; if (file.endsWith('.js')) { const s = fs.readFileSync(file, 'utf8'); const mm = s.match(/\]="([^"]+)"/); if (!mm) continue; bin = Buffer.from(mm[1], 'base64'); } else bin = fs.readFileSync(file);
  let doc; try { doc = await io.readBinary(new Uint8Array(bin)); } catch { continue; }
  for (const node of doc.getRoot().listNodes()) { const m = node.getMesh(); if (!m) continue; const M = node.getWorldMatrix();
    for (const p of m.listPrimitives()) { const P = p.getAttribute('POSITION'); const pts = []; for (let i = 0; i < P.getCount(); i++) { const v = P.getElement(i, []); pts.push([M[0]*v[0]+M[4]*v[1]+M[8]*v[2]+M[12], M[1]*v[0]+M[5]*v[1]+M[9]*v[2]+M[13], M[2]*v[0]+M[6]*v[1]+M[10]*v[2]+M[14]]); }
      // a point is a spike if it is far from every other point of its piece
      const n = pts.length; if (n < 8) continue; const out = [];
      const key = (p) => p.map(c => Math.floor(c / 0.1)).join(','); const grid = new Map(); pts.forEach((p, i) => { const k = key(p); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
      pts.forEach((p, i) => { const g = p.map(c => Math.floor(c / 0.1)); let near = 0;
        for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) for (const j of grid.get([g[0]+a, g[1]+b, g[2]+c].join(',')) || []) if (j !== i && Math.hypot(pts[j][0]-p[0], pts[j][1]-p[1], pts[j][2]-p[2]) < 0.1) near++;
        if (!near) out.push(p.map(v => v.toFixed(2)).join(','));
      });
      if (out.length) { bad++; console.log(path.relative('.', file), m.getName(), out.length, out.slice(0, 3).join(' | ')); }
    } }
}
console.log('pieces with stray points:', bad); process.exitCode = bad ? 1 : 0;
