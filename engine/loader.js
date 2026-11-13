/* engine/loader.js: models are packed as base64 inside small .js files (models/<name>.js) so the game
   works on hosts that will not serve .glb. tools/pack_models.py makes them. See docs/PIPELINE.md. */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
export const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
let onFail = () => {}; export function onLoadFail(fn) { onFail = fn; }
function fail(n) { onFail(n); }
export function script(n) { return new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'models/' + n + '.js'; sc.onload = res; sc.onerror = () => { fail(n); rej(n); }; document.head.appendChild(sc); }); }
export function model(n) { return script(n).then(() => new Promise((res, rej) => { const b = atob(window.__models[n]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); delete window.__models[n];
  loader.parse(u.buffer, '', res, () => { fail(n); rej(n); }); })); }
export async function stage(names, onEach) { let done = 0; await Promise.all(names.map((n) => (n.startsWith('tex_') ? script(n) : model(n).then((g) => { window.__got = window.__got || {}; window.__got[n] = g; })).then(() => { done++; if (onEach) onEach(done / names.length); }))); }
