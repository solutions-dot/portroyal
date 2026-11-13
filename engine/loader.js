/* engine/loader.js: models are packed as base64 inside small .js files (models/<name>.js) so the game
   works on hosts that will not serve .glb. tools/pack_models.py makes them. See docs/PIPELINE.md. */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { repairLegacyVertexColours } from './colours.js';
export const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
let onFail = () => {}; export function onLoadFail(fn) { onFail = fn; }
function fail(n) { onFail(n); }
const MV = typeof __MODELV__ !== 'undefined' ? __MODELV__ : {};   /* set by tools/build.mjs: a fingerprint per model file, so a model is fetched again only when it has changed and can be cached for a long time */
export const modelUrl = (n) => 'models/' + n + '.js' + (MV[n] ? '?v=' + MV[n] : '');
/* Ask the browser to fetch these models in the background, so they are already here when the next part of the game needs them. */
export function prefetch(names) { const c = navigator.connection; if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;   /* not on a slow or data-saving connection */
  for (const n of names) { if (document.querySelector('link[data-pf="' + n + '"]')) continue; const l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'script'; l.href = modelUrl(n); l.dataset.pf = n; document.head.appendChild(l); } }
export function script(n, plain) { return new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = plain ? 'models/' + n + '.js' : modelUrl(n); sc.onload = res;
  sc.onerror = () => { sc.remove(); if (!plain && MV[n]) script(n, true).then(res, rej); else { fail(n); rej(n); } };   /* a host that refuses "?v=..." still gets the plain file */
  document.head.appendChild(sc); }); }
export function model(n) { return script(n).then(() => new Promise((res, rej) => { const b = atob(window.__models[n]); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); delete window.__models[n];
  loader.parse(u.buffer, '', (g) => res(repairLegacyVertexColours(g)), () => { fail(n); rej(n); }); })); }
export async function stage(names, onEach) { let done = 0; await Promise.all(names.map((n) => (n.startsWith('tex_') ? script(n) : model(n).then((g) => { window.__got = window.__got || {}; window.__got[n] = g; })).then(() => { done++; if (onEach) onEach(done / names.length); }))); }
