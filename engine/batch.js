/* engine/batch.js: still scenery drawn in as few pieces as its look allows (18 November 2026). Moved here from seven games' own gfx.js
   (bog-walk, eventide, kendal, melissa, nanny, selassie, windrush), which each carried the same copy.
   batchStatic(root) merges every still mesh under root into one mesh per material. Things that move, or are switched on and off one by one,
   are marked userData.noBatch = true and are left alone, with everything inside them.
   New: meshes whose materials differ only in colour (a game makes a new material for each wall, post and plank) are merged too, each piece's
   colour baked into the points of one mesh (the same picture, a fraction of the draw calls). Such a group is watched every frame: if the game
   later changes one of its materials (a window lit at night, a fade, a material made see-through), that group splits back into one mesh per
   material on the spot, and those keep the game's own materials, so they follow every later change as before. Turn the colour step off with
   batchStatic(root, { bake: false }) or ?nobake (dev). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const BAKE = !(typeof location !== 'undefined' && /[?&]nobake\b/.test(location.search));
export const BATCH_STATS = { meshes: 0, merged: 0, groups: 0, splits: 0 };
const TEX = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap', 'bumpMap', 'displacementMap', 'lightMap', 'envMap', 'specularMap', 'gradientMap', 'matcap', 'clearcoatMap', 'clearcoatNormalMap'];
const NUM = ['roughness', 'metalness', 'emissiveIntensity', 'opacity', 'alphaTest', 'side', 'blending', 'envMapIntensity', 'shininess', 'reflectivity', 'clearcoat', 'clearcoatRoughness', 'sheen', 'transmission', 'ior', 'polygonOffsetFactor', 'polygonOffsetUnits', 'bumpScale', 'aoMapIntensity', 'lightMapIntensity', 'normalMapType'];
const BOOL = ['transparent', 'flatShading', 'fog', 'toneMapped', 'depthTest', 'depthWrite', 'colorWrite', 'polygonOffset', 'wireframe', 'visible', 'premultipliedAlpha', 'alphaToCoverage', 'dithering', 'vertexColors'];
/* everything about a material except its colour; null when it must keep its own mesh (a custom shader) */
function look(m) {
  if (!m.color || Object.prototype.hasOwnProperty.call(m, 'onBeforeCompile') || m.isShaderMaterial) return null;
  let s = m.type; for (const k of TEX) s += '|' + (m[k] ? m[k].uuid : ''); for (const k of NUM) if (m[k] !== undefined) s += '|' + m[k]; for (const k of BOOL) if (m[k] !== undefined) s += m[k] ? 1 : 0;
  if (m.emissive) s += '|e' + m.emissive.getHexString(); if (m.specular) s += '|s' + m.specular.getHexString(); if (m.normalScale) s += '|n' + m.normalScale.x + ',' + m.normalScale.y;
  return s;
}
/* what a watched material is now: if any of it changes, its group splits */
const state = (m) => m.color.r + '|' + m.color.g + '|' + m.color.b + '|' + look(m);

export function batchStatic(root, { bake = BAKE } = {}) {
  root.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), rel = new THREE.Matrix4(), buckets = new Map(), dead = [], keep = ['position', 'normal', 'uv', 'color'];
  (function walk(o, skip) {
    if (o.userData.noBatch || skip) skip = true;
    if (!skip && o.isMesh && !o.isSkinnedMesh && !o.isInstancedMesh && !Array.isArray(o.material) && o.visible && o.geometry.attributes.position && o.geometry.attributes.normal) {
      rel.multiplyMatrices(inv, o.matrixWorld); if (rel.determinant() > 0) {
        const g = o.geometry.clone(); for (const k of Object.keys(g.attributes)) if (!keep.includes(k)) g.deleteAttribute(k); else plain(g, k); if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
        g.applyMatrix4(rel); const ni = g.index ? g.toNonIndexed() : g; const key = o.material.uuid + (ni.attributes.color ? 'c' : ''); let b = buckets.get(key); if (!b) buckets.set(key, (b = { mat: o.material, geos: [] })); b.geos.push(ni); dead.push(o);
      }
    }
    for (const c of [...o.children]) walk(c, skip);
  })(root, false);
  for (const o of dead) { o.parent.remove(o); }
  /* one mesh per material, as before; then materials that differ only in colour share one mesh */
  const parts = []; for (const b of buckets.values()) { const g = mergeGeometries(b.geos, false); if (g) parts.push({ mat: b.mat, g }); }
  const looks = new Map(); for (const p of parts) { const k = bake ? look(p.mat) : null; const key = k === null ? p.mat.uuid + ':' + parts.indexOf(p) : k + (p.g.attributes.color && p.mat.vertexColors ? 'v' : '') ; if (!looks.has(key)) looks.set(key, []); looks.get(key).push(p); }
  let made = 0;
  for (const group of looks.values()) {
    if (group.length === 1 || !bake) { for (const p of group) addMesh(root, p.g, p.mat); made += group.length; continue; }
    made++; joinColours(root, group);
  }
  BATCH_STATS.meshes += dead.length; BATCH_STATS.merged += made;
  return { merged: made, removed: dead.length };
}
/* a packed model keeps its points as small whole numbers (quantized, often interleaved); moving them in place broke them (Port Royal: a house vanished). Plain numbers first, the same values. */
function plain(g, k) { const a = g.attributes[k]; if (!a.isInterleavedBufferAttribute && a.array instanceof Float32Array && !a.normalized) return;
  const n = a.count, s = a.itemSize, f = new Float32Array(n * s); for (let i = 0; i < n; i++) for (let c = 0; c < s; c++) f[i * s + c] = a.getComponent(i, c); g.setAttribute(k, new THREE.BufferAttribute(f, s)); }
function addMesh(root, g, mat) { const m = new THREE.Mesh(g, mat); m.userData.batched = true; m.matrixAutoUpdate = false; root.add(m); return m; }
/* several materials alike but for colour: one mesh, colours in its points, watched */
function joinColours(root, group) {
  const geos = [], parts = []; let v = 0; const c = new THREE.Color();
  for (const p of group) { const g = p.g, n = g.attributes.position.count, col = new Float32Array(n * 3), vc = p.mat.vertexColors && g.attributes.color, mc = p.mat.color;
    for (let i = 0; i < n; i++) { if (vc) c.fromBufferAttribute(vc, i); else c.setRGB(1, 1, 1); col[i * 3] = c.r * mc.r; col[i * 3 + 1] = c.g * mc.g; col[i * 3 + 2] = c.b * mc.b; }
    if (g.attributes.color) g.deleteAttribute('color'); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); geos.push(g);
    parts.push({ mat: p.mat, v0: v, n, vc: !!vc, baked: mc.clone(), snap: state(p.mat) }); v += n; }
  const g = mergeGeometries(geos, false); if (!g) return;
  for (const x of geos) x.dispose();
  const mat = group[0].mat.clone(); mat.color.setRGB(1, 1, 1); mat.vertexColors = true; mat.name = (group[0].mat.name || 'batch') + '_colours';
  const mesh = addMesh(root, g, mat); BATCH_STATS.groups++;
  WATCHED.push({ root, mesh, parts }); if (!ticking) { ticking = true; requestAnimationFrame(tick); }
}
/* one material's points back out of a joined mesh, with its own vertex colours again (the baked colour divided out) */
function partOf(g, p) {
  const out = new THREE.BufferGeometry(), a = p.v0, n = p.n;
  for (const k of ['position', 'normal', 'uv']) { const at = g.attributes[k]; if (at) out.setAttribute(k, new THREE.BufferAttribute(at.array.slice(a * at.itemSize, (a + n) * at.itemSize), at.itemSize)); }
  if (p.vc) { const src = g.attributes.color.array, col = new Float32Array(n * 3), b = p.baked; for (let i = 0; i < n; i++) { const k = (a + i) * 3; col[i * 3] = b.r ? src[k] / b.r : 1; col[i * 3 + 1] = b.g ? src[k + 1] / b.g : 1; col[i * 3 + 2] = b.b ? src[k + 2] / b.b : 1; } out.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  return out;
}
const WATCHED = []; let ticking = false;
function tick() {
  requestAnimationFrame(tick);
  for (let i = WATCHED.length - 1; i >= 0; i--) { const w = WATCHED[i]; if (!w.parts.some((p) => state(p.mat) !== p.snap)) continue;
    WATCHED.splice(i, 1); BATCH_STATS.splits++;   /* the game changed a material: back to one mesh per material, each with the game's own */
    const at = w.mesh.parent || w.root; for (const p of w.parts) { const m = addMesh(at, partOf(w.mesh.geometry, p), p.mat); m.visible = w.mesh.visible; } at.remove(w.mesh); w.mesh.geometry.dispose(); w.mesh.material.dispose(); }
}
if (typeof window !== 'undefined') window.__batch = BATCH_STATS;
