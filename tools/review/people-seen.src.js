/* tools/review/people-seen.src.js: what the eye sees. Every body of a game, in every clip the game ships, is drawn from six sides with each piece in one flat colour.
   A small patch of an under layer (skin, a shirt, trousers) wholly inside the piece that should cover it is a fault you can see: skin through a shirt, a shirt
   through a waistcoat, trousers through a belt. The cloth check (engine/audit.js auditCloth) measures surfaces and reports much that is hidden (an armpit, a point
   under a fold); this one reports only what shows. Bundled and driven by people-seen.mjs. One page checks one game. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { repairLegacyVertexColours } from '../../engine/colours.js';
import { loadClips, animate, CL } from '../../engine/anim.js';
import { clothParts, clothRank } from '../../engine/audit.js';

const q = new URLSearchParams(location.search), game = q.get('game'), ids = q.get('ids').split(','), clipFiles = (q.get('clips') || 'anims').split(','), only = q.get('only') ? q.get('only').split(',') : null;
const W = 208, H = 384, MIN = +(q.get('min') || 3), MAX = +(q.get('max') || 150), SHARE = 0.75;
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const script = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('missing ' + src)); document.head.appendChild(s); });
const dir = `../../games/${game}/site/models/`;
async function model(n) { await script(dir + n + '.js'); const b = atob(window.__models[n]), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); delete window.__models[n];
  return new Promise((res, rej) => loader.parse(u.buffer, '', (g) => res(repairLegacyVertexColours(g)), rej)); }
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false }); renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping; renderer.setClearColor(0x000000, 1);
const rt = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true }), px = new Uint8Array(W * H * 4);
const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-0.62, 0.62, 1.15, -1.15, 0.1, 20);
const VIEWS = [['front', 0, 0], ['right', 90, 0], ['back', 180, 0], ['left', 270, 0], ['front, from above', 0, 35], ['back, from above', 180, 35]];
/* one flat colour for each piece: red carries the piece's number; on the skin, green marks hands (255) and arms (128), which pass in front of the clothes all the time */
function dress(m) {
  const parts = clothParts(m), names = ['', ...parts.map((P) => P.name)], undo = [];
  const partOf = new Map(parts.map((P, i) => [P.o, i + 1]));
  m.traverse((o) => { if (!o.isMesh || !o.visible) return; const id = partOf.get(o) || 250, nm = id < 250 ? names[id] : '', mat = new THREE.MeshBasicMaterial({ side: o.material.side, toneMapped: false, fog: false });
    if (id < 250 && clothRank(nm) === 12) { undo.push(() => { o.visible = true; }); o.visible = false; return; }   /* hats are measured by people-check; a body carries several at once here */
    if (/^(Body|Skin)$/.test(nm) && o.isSkinnedMesh) { const g = o.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = o.skeleton.bones, n = si.count, col = new Float32Array(n * 3), old = g.attributes.color;
      for (let i = 0; i < n; i++) { let k = 0; for (let c = 1; c < 4; c++) if (sw.getComponent(i, c) > sw.getComponent(i, k)) k = c; const bn = (bones[si.getComponent(i, k)] || {}).name || ''; col[i * 3] = id / 255; col[i * 3 + 1] = /Hand/.test(bn) ? 1 : /(Arm|ForeArm)$/.test(bn) ? 0.5 : 0; }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); mat.vertexColors = true; undo.push(() => { if (old) g.setAttribute('color', old); else g.deleteAttribute('color'); }); }
    else mat.color.setRGB(id / 255, 0, 0);
    const keep = o.material; o.material = mat; undo.push(() => { o.material = keep; mat.dispose(); }); });
  return { names, undo: () => { for (const f of undo.reverse()) f(); } };
}
const SAME = (a, b) => (a === 'Shirt' && /^(Collar|Placket|Pocket|Buttons|Tie)/.test(b)) || (/^(Hair|Bun|Puffs|Plaits|Locks)/.test(a) && /^(Shirt|Collar|Jacket|Coat)$/.test(b)) || (/^(Body|Sock)$/.test(a) && /^(Body|Sock)$/.test(b));
function look(names, lines, tag, shots) {
  const id = new Uint8Array(W * H), fl = new Uint8Array(W * H), seen = new Uint8Array(W * H), stack = new Int32Array(W * H);
  for (const [vn, az, el] of VIEWS) { const a = az * Math.PI / 180, e = el * Math.PI / 180; cam.position.set(Math.sin(a) * Math.cos(e) * 6, 1.0 + Math.sin(e) * 6, Math.cos(a) * Math.cos(e) * 6); cam.lookAt(0, 1.0, 0); cam.updateMatrixWorld(true);
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, cam); renderer.readRenderTargetPixels(rt, 0, 0, W, H, px); renderer.setRenderTarget(null);
    for (let i = 0; i < W * H; i++) { id[i] = px[i * 4]; fl[i] = px[i * 4 + 1]; } seen.fill(0);
    for (let s0 = 0; s0 < W * H; s0++) { const c = id[s0]; if (!c || c >= 250 || seen[s0]) continue; let top = 0, n = 0, area = 0, flag = 0, edge = 0; const nb = new Map(); stack[top++] = s0; seen[s0] = 1; const cells = [];
      while (top) { const p = stack[--top], x = p % W, y = (p / W) | 0; area++; flag += fl[p]; if (cells.length < MAX + 2) cells.push(p);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) { edge++; nb.set(0, (nb.get(0) || 0) + 1); continue; } const o = Y * W + X, d = id[o]; if (d === c) { if (!seen[o]) { seen[o] = 1; stack[top++] = o; } } else { edge++; nb.set(d, (nb.get(d) || 0) + 1); } } }
      if (area < MIN || area > MAX) continue; let bi = 0, bn = 0; for (const [k, v] of nb) if (v > bn) { bn = v; bi = k; } if (!bi || bi >= 250 || bn < edge * SHARE) continue;
      const A = names[c], B = names[bi], ra = clothRank(A), rb = clothRank(B); if (ra < 0 || rb < 0 || ra >= rb || (ra === 0 && rb === 1) || SAME(A, B)) continue;   /* only an under layer inside its cover; skin under hair fades into it by design */
      if (ra === 0) { const f = flag / area; if (f > 190) continue; if (f > 60 && !/^(Shirt|Jacket|Coat)$/.test(B)) continue; }   /* a hand, or an arm in front of the body */
      lines.push(`${tag}: ${A} seen through ${B}: ${area} px (${vn})`); if (shots && shots.length < 12) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x2 = cv.getContext('2d'), im = x2.createImageData(W, H); for (let i = 0; i < W * H; i++) { const y = H - 1 - ((i / W) | 0), o = (y * W + (i % W)) * 4, v = id[i]; im.data[o] = v ? (v * 67) % 200 + 40 : 235; im.data[o + 1] = v ? (v * 131) % 200 + 40 : 235; im.data[o + 2] = v ? (v * 29) % 200 + 40 : 235; im.data[o + 3] = 255; } for (const p of cells) { const y = H - 1 - ((p / W) | 0), o = (y * W + (p % W)) * 4; im.data[o] = 255; im.data[o + 1] = 0; im.data[o + 2] = 255; } x2.putImageData(im, 0, 0); shots.push([`${tag} ${A} through ${B} ${vn}`.replace(/[^\w]+/g, '_'), cv.toDataURL('image/png')]); } } }
}
(async () => {
  for (const f of clipFiles) loadClips(await model(f));
  const names = Object.keys(CL).filter((n) => !n.startsWith('_') && (!only || only.includes(n))).sort(), poses = names.flatMap((n) => (/^(Idle|Walk)$/.test(n) ? [0.2, 0.5, 0.8] : [0.5]).map((t) => [n, t])), out = { game, clips: names.length, bodies: {} }, shots = q.has('shots') ? [] : null;
  for (const id of ids) { let g; try { g = await model(id); } catch (e) { out.bodies[id] = { error: String(e.message || e) }; continue; }
    const m = g.scene; let skinned = false; m.traverse((o) => { if (o.isSkinnedMesh) { skinned = true; o.frustumCulled = false; if (o.userData.measureOnly || /Measure$/.test(o.name)) o.visible = false; } }); if (!skinned) continue;
    const ctl = animate(m, 'Idle'); if (!ctl) { out.bodies[id] = { error: 'no clip' }; continue; } scene.add(m); m.updateMatrixWorld(true);
    const D = dress(m), lines = [], kinds = {};
    for (const [cn, at] of poses) { const act = ctl.get(cn); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); m.updateMatrixWorld(true);
      let hips = null; m.traverse((o) => { if (o.isBone && /Hips$/.test(o.name)) hips = hips || o; }); if (hips) { const hp = hips.getWorldPosition(new THREE.Vector3()); m.position.x -= hp.x; m.position.z -= hp.z; m.updateMatrixWorld(true); }   /* keep the body in the middle of the picture */
      look(D.names, lines, `${id} ${cn}@${at}`, shots); m.position.set(0, 0, 0); }
    D.undo(); scene.remove(m);
    for (const l of lines) { const k = l.replace(/^\S+ /, '').replace(/@[\d.]+:/, ':').replace(/: \d+ px \(.*$/, ''); kinds[k] = (kinds[k] || 0) + 1; }
    out.bodies[id] = { seen: lines.length, kinds, first: lines.slice(0, 6) };
    await new Promise((res) => setTimeout(res, 0)); }
  out.shots = shots; window.__RESULT = out; document.title = 'SEEN done';
})().catch((e) => { window.__RESULT = { error: String(e && e.stack || e) }; document.title = 'SEEN error'; });
