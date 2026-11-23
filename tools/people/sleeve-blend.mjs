/* Smooth the hand-over from upper arm to forearm in a packed body's sleeves (23 November 2026). The owner saw "choppy" sleeves in The Shark
   Papers: with the elbow bent, thin slivers of the sleeve hem stuck out under the arm. The builder ties the lower ring of an elbow-length
   sleeve wholly to the forearm and the part above wholly to the upper arm, with one narrow shared band, which folds inside out when the arm
   bends, and ties the sleeve's underside partly to the chest, so it stretches when the forearm swings in. This blends the two arm bones
   smoothly over about 16 cm round the elbow (from 7 cm above it to 9 cm below), measured from the skeleton's own rest pose, and gives a
   point plainly on the arm (12 cm or more down from the shoulder, within 8.5 cm of the arm's line) to the arm bones alone. Skin is left alone.
     node tools/people/sleeve-blend.mjs <game> [id,id,...] [--dry]
   With no ids it does every packed body of the game (<id>.js and its _lo, _crowd, _focus, _phone copies). It rewrites the .js files in place;
   run it again after a body is rebuilt (tools/people/pack.mjs does not do it yet: see docs/PIPELINE.md). */
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [game, idArg] = process.argv.slice(2).filter((a) => !a.startsWith('--')), dry = process.argv.includes('--dry');
const dir = `games/${game}/site/models/`, ids = idArg ? idArg.split(',') : null;
const files = readdirSync(dir).filter((f) => f.endsWith('.js') && (!ids || ids.some((i) => f === i + '.js' || f.startsWith(i + '_'))));
const SKIN = /^(skin|body|Body|Skin)/, sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const worldOf = (node) => { const m = new THREE.Matrix4(); let n = node; const chain = []; while (n) { chain.unshift(n); n = n.listParents().find((p) => p.propertyType === 'Node'); } for (const c of chain) m.multiply(new THREE.Matrix4().fromArray(c.getMatrix())); return m; };
for (const f of files) {
  const src = readFileSync(dir + f, 'utf8'), mm = src.match(/^(\(window\.__models=window\.__models\|\|\{\}\)\["[^"]+"\]=")([^"]+)(";?\s*)$/s); if (!mm) continue;
  const doc = await io.readBinary(new Uint8Array(Buffer.from(mm[2], 'base64')));
  let changed = 0;
  /* each garment has its own skin: its points are stored squeezed into their own box, and that skin's inverse bind matrices carry the true size */
  for (const node of doc.getRoot().listNodes().filter((n) => n.getMesh() && n.getSkin())) {
    const sk = node.getSkin(), joints = sk.listJoints(), names = joints.map((j) => j.getName()), ibm = sk.getInverseBindMatrices(), NW = worldOf(node), mesh = node.getMesh();
    const J = (s) => names.findIndex((n) => n.endsWith(':' + s) || n === s), G = joints.map(worldOf), M = joints.map((j, i) => G[i].clone().multiply(new THREE.Matrix4().fromArray(ibm.getElement(i, []))));
    for (const side of ['Left', 'Right']) {
      const ia = J(side + 'Arm'), ifo = J(side + 'ForeArm'); if (ia < 0 || ifo < 0) continue;
      const sh = new THREE.Vector3().setFromMatrixPosition(G[ia]), el = new THREE.Vector3().setFromMatrixPosition(G[ifo]), dir = el.clone().sub(sh).normalize();
      for (const p of mesh.listPrimitives()) {
        const mat = p.getMaterial()?.getName() || ''; if (SKIN.test(mat) || /Eye|Hair|Brow|Teeth/i.test(mat)) continue;
        const JA = p.getAttribute('JOINTS_0'), WA = p.getAttribute('WEIGHTS_0'), PA = p.getAttribute('POSITION'); if (!JA || !WA) continue;
        const j = [], w = [], v = new THREE.Vector3(), pos = [];
        for (let i = 0; i < JA.getCount(); i++) {
          JA.getElement(i, j); WA.getElement(i, w); let arm = 0, other = 0; for (let k = 0; k < 4; k++) { if (w[k] <= 0.001) continue; if (j[k] === ia || j[k] === ifo) arm += w[k]; else other += w[k]; }
          if (arm < 0.001) continue;   /* the arm must move it at least a little (else trousers by a hanging hand would be caught) */
          const dom = w.indexOf(Math.max(...w)); PA.getElement(i, pos); v.fromArray(pos).applyMatrix4(NW).applyMatrix4(M[j[dom]]);   /* its place at rest */
          const ts = v.clone().sub(sh).dot(dir), off = v.clone().sub(sh).addScaledVector(dir, -ts).length();   /* how far down the arm from the shoulder, and how far out from its line */
          if (other > 0.001 && !(ts > 0.12 && off < 0.085)) continue;   /* shared with the body: only where it is plainly on the arm (the sleeve's underside), not the armhole */
          const t = v.clone().sub(el).dot(dir); if (t < -0.08 && other <= 0.001) continue;   /* the sleeve above the elbow, moved by the upper arm alone, is left as it is */
          const wf = sm(-0.07, 0.09, t);
          JA.setElement(i, [ia, ifo, 0, 0]); WA.setElement(i, [1 - wf, wf, 0, 0]); changed++;
        }
      }
    }
  }
  console.log(f, changed ? changed + ' sleeve points blended' : 'no sleeve points');
  if (changed && !dry) { const out = await io.writeBinary(doc); writeFileSync(dir + f, mm[1] + Buffer.from(out).toString('base64') + mm[3]); }
}
