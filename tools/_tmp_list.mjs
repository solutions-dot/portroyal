import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const f = process.argv[2]; let doc;
if (f.endsWith('.js')) { const m = fs.readFileSync(f,'utf8').match(/\["([^"]+)"\]="([A-Za-z0-9+/=]{200,})"/); doc = await io.readBinary(new Uint8Array(Buffer.from(m[2],'base64'))); }
else doc = await io.read(f);
const out = doc.getRoot().listAnimations().map(a => { let t1=0,t0=1e9; for (const s of a.listSamplers()) { const i=s.getInput().getArray(); t0=Math.min(t0,i[0]); t1=Math.max(t1,i[i.length-1]); } return `${a.getName()} ${t0.toFixed(3)}-${t1.toFixed(3)} ch=${a.listChannels().length}`; });
console.log(out.length+' clips'); console.log(out.join('\n'));
