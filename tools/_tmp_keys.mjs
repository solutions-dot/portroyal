import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [f, clip, bone] = process.argv.slice(2); let doc;
if (f.endsWith('.js')) { const m = fs.readFileSync(f,'utf8').match(/\["([^"]+)"\]="([A-Za-z0-9+/=]{200,})"/); doc = await io.readBinary(new Uint8Array(Buffer.from(m[2],'base64'))); } else doc = await io.read(f);
const a = doc.getRoot().listAnimations().find(a=>a.getName()===clip);
for (const c of a.listChannels()) { if (!c.getTargetNode().getName().endsWith(bone) || c.getTargetPath()!=='rotation') continue; const s=c.getSampler(), t=s.getInput().getArray(), v=s.getOutput().getArray();
  const norm = s.getOutput().getNormalized(); const sc = norm ? 1/32767 : 1;
  console.log(c.getTargetNode().getName(), 'n', t.length, 'interp', s.getInterpolation());
  for (let i=0;i<t.length;i++) console.log(t[i].toFixed(4), [0,1,2,3].map(k=>(v[i*4+k]*sc).toFixed(4)).join(' ')); }
