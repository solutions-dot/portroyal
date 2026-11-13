// Keep only some clips of the shared animation library, so a game that plays a handful of clips does not download all of them.
// Used by tools/build.mjs when games/<game>/anim-clips.json exists (a list of clip names). The clips are untouched: the data stays
// quantised and compressed exactly as it was, only the other clips and the data only they used are dropped.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
export async function subsetAnims(file, keep) {
  await MeshoptEncoder.ready; await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
  const src = fs.readFileSync(file, 'utf8'), m = src.match(/\["([^"]+)"\]="([A-Za-z0-9+/=]{200,})"/); if (!m) throw new Error(file + ': no packed model found');
  const doc = await io.readBinary(new Uint8Array(Buffer.from(m[2], 'base64'))), want = new Set(keep), have = doc.getRoot().listAnimations().map((a) => a.getName());
  const missing = keep.filter((n) => !have.includes(n)); if (missing.length) throw new Error('clips not in the library: ' + missing.join(', '));
  for (const a of doc.getRoot().listAnimations()) if (!want.has(a.getName())) { for (const c of a.listChannels()) c.dispose(); for (const sm of a.listSamplers()) sm.dispose(); a.dispose(); }   /* channels and samplers too, or their data stays in the file */
  await doc.transform(prune({ keepLeaves: true }));
  const out = Buffer.from(await io.writeBinary(doc));
  fs.writeFileSync(file, `(window.__models=window.__models||{})["${m[1]}"]="${out.toString('base64')}";`);
  return { before: src.length, after: out.length * 4 / 3, kept: keep.length, of: have.length };
}
