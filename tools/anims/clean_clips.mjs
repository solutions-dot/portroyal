// The clean-up every packed animation library gets (tools/anims/optimize_clips.mjs for the shared one, tools/tivoli/pack_clips.mjs for Tivoli's).
//   - drops scale tracks, moving roots (every translation except the hips) and finger joints 2 to 4;
//   - keeps every other frame (the retarget exports every frame at 30 a second), always keeping the first and the last,
//     so a clip starts at time 0 and a looping clip ends exactly on its first pose (no pause and no jump at the loop point);
//   - resamples (drops keys a straight line between their neighbours already gives), prunes, and compresses with meshopt.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { resample, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

export async function cleanClips(file, { drop = new Set(), meshes = true, thin = true } = {}) {
  await MeshoptEncoder.ready; await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
  const doc = await io.read(file), root = doc.getRoot();
  for (const a of root.listAnimations()) if (drop.has(a.getName())) { for (const c of a.listChannels()) c.dispose(); for (const sm of a.listSamplers()) sm.dispose(); a.dispose(); }
  for (const a of root.listAnimations()) for (const c of a.listChannels()) {
    const p = c.getTargetPath(), n = c.getTargetNode()?.getName() || '';
    if (p === 'scale' || (p === 'translation' && !/Hips/.test(n)) || /Hand(Thumb|Index|Middle|Ring|Pinky)[234]/.test(n)) { const sm = c.getSampler(); c.dispose(); sm.dispose(); }
  }
  if (thin) for (const a of root.listAnimations()) for (const sm of a.listSamplers()) {
    const inp = sm.getInput(), out = sm.getOutput();
    const t = inp.getArray(), v = out.getArray(), n = t.length, k = v.length / n; if (n < 3) continue;
    const keep = []; for (let i = 0; i < n; i += 2) keep.push(i); if (keep[keep.length - 1] !== n - 1) keep.push(n - 1);
    const t2 = new t.constructor(keep.length), v2 = new v.constructor(keep.length * k);
    keep.forEach((i, j) => { t2[j] = t[i]; for (let q = 0; q < k; q++) v2[j * k + q] = v[i * k + q]; });
    // new accessors, so one shared between samplers is never thinned twice
    sm.setInput(doc.createAccessor().setType(inp.getType()).setArray(t2).setBuffer(inp.getBuffer()));
    sm.setOutput(doc.createAccessor().setType(out.getType()).setArray(v2).setBuffer(out.getBuffer()));
  }
  if (!meshes) for (const m of root.listMeshes()) m.dispose();   // the clips only; the game's bodies carry the meshes
  await doc.transform(resample({ tolerance: 1e-3 }), prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
  return { doc, bin: await io.writeBinary(doc), names: root.listAnimations().map((a) => a.getName()) };
}

export function packJs(name, bin) { return `(window.__models=window.__models||{})["${name}"]="${Buffer.from(bin).toString('base64')}";`; }
