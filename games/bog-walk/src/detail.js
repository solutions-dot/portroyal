/* games/bog-walk/src/detail.js (copied from games/kendal/src/detail.js): the small things that make a place feel lived in. Grass, flowers and stones are instanced (one draw call each);
   trees, fences and bushes are ordinary meshes that batchStatic merges. Everything is cheap on a phone. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng, cv } from './wgfx.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const inClear = (x, z, clear) => clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3]);
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color();

/* grass tufts: three crossed cards of thin blades, lit like the ground, in many shades of green and straw. Real size: a tuft is ankle to shin high.
   Every instanced plant is marked userData.veg, so the place audit can check that none grows inside a building (P.indoor). */
let _tuftGeo, _tuftMat;
export function grassField(parent, area, n, { seed = 1, clear = [], h = 0.34, w = 0.5, tint = 0xc4cc9a, vary = 0.22, y = 0 } = {}) {
  if (!_tuftGeo) { const pos = [], nor = [], uv = [], idx = []; let off = 0;
    for (let k = 0; k < 3; k++) { const a = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); a.rotateY(k * Math.PI / 3); for (let i = 0; i < a.attributes.position.count; i++) { pos.push(a.attributes.position.getX(i), a.attributes.position.getY(i), a.attributes.position.getZ(i)); nor.push(0, 1, 0); uv.push(a.attributes.uv.getX(i), a.attributes.uv.getY(i)); } for (const i of a.index.array) idx.push(i + off); off += a.attributes.position.count; }
    _tuftGeo = new THREE.BufferGeometry(); _tuftGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); _tuftGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); _tuftGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); _tuftGeo.setIndex(idx);
    _tuftMat = new THREE.MeshLambertMaterial({ map: T.tuft(), alphaTest: 0.5, side: THREE.DoubleSide }); _tuftMat.map.generateMipmaps = true; }
  const r = rng(seed), im = new THREE.InstancedMesh(_tuftGeo, _tuftMat, n); let k = 0, tries = 0;
  while (k < n && tries++ < n * 6) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (inClear(x, z, clear)) continue; const sc = 0.6 + r() * 0.8; M4.compose(V.set(x, y, z), Q.setFromEuler(E.set(0, r() * 6.28, 0)), S.set(w * sc * (0.8 + r() * 0.5), h * sc, w * sc)); im.setMatrixAt(k, M4); C.set(tint).offsetHSL((r() - 0.5) * 0.05, (r() - 0.5) * 0.16, (r() - 0.5) * vary); im.setColorAt(k, C); k++; }
  im.count = k; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.userData.noBatch = true; im.userData.veg = true; im.frustumCulled = false; parent.add(im); return im;
}
/* wildflowers: a thin green stalk and a bright head, instanced */
let _stalk, _head;
export function flowerField(parent, area, n, { seed = 2, clear = [], colors = [0xe8505b, 0xf5c542, 0xffffff, 0xe27ad8, 0xff8a3a], y = 0 } = {}) {
  _stalk = _stalk || new THREE.ConeGeometry(0.008, 0.3, 3).translate(0, 0.15, 0); _head = _head || new THREE.IcosahedronGeometry(0.035, 0).translate(0, 0.31, 0);
  const r = rng(seed), a = new THREE.InstancedMesh(_stalk, new THREE.MeshLambertMaterial({ color: 0x4a7a30 }), n), b = new THREE.InstancedMesh(_head, new THREE.MeshLambertMaterial({ color: 0xffffff }), n); let k = 0, tries = 0;
  while (k < n && tries++ < n * 6) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (inClear(x, z, clear)) continue; const sc = 0.7 + r() * 0.9; M4.compose(V.set(x, y, z), Q.identity(), S.set(sc, sc, sc)); a.setMatrixAt(k, M4); b.setMatrixAt(k, M4); b.setColorAt(k, C.set(colors[(r() * colors.length) | 0])); k++; }
  a.count = b.count = k; for (const o of [a, b]) { o.userData.noBatch = true; o.userData.veg = true; o.frustumCulled = false; parent.add(o); } return [a, b];
}
/* stones and boulders: lumpy rocks of a few greys */
let _rock;
export function rockField(parent, area, n, { seed = 3, clear = [], size = 0.5, tone = 0x8a867a, y = 0 } = {}) {
  _rock = _rock || new THREE.DodecahedronGeometry(1, 0); const r = rng(seed), im = new THREE.InstancedMesh(_rock, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), n); let k = 0, tries = 0;
  while (k < n && tries++ < n * 6) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (inClear(x, z, clear)) continue; const sc = size * (0.3 + r() * r() * 1.6); M4.compose(V.set(x, y + sc * 0.35, z), Q.setFromEuler(E.set(r() * 3, r() * 6, r() * 3)), S.set(sc * (1 + r() * 0.6), sc * (0.5 + r() * 0.4), sc * (1 + r() * 0.5))); im.setMatrixAt(k, M4); im.setColorAt(k, C.set(tone).offsetHSL(0, 0, (r() - 0.5) * 0.18)); k++; }
  im.count = k; im.userData.noBatch = true; im.frustumCulled = false; parent.add(im); return im;
}
/* big soft patches of lighter and darker ground, to break up the repeating texture */
export function blotches(parent, area, n, { seed = 4, colors = [0x4a6a30, 0x6a8a3c, 0x7a6a40, 0x3a5a2a] } = {}) {
  const r = rng(seed), tx = cv(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 4, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); }, null, true); const g0 = grp(parent);
  for (let i = 0; i < n; i++) { const sz = 6 + r() * 16; const m = mesh(new THREE.PlaneGeometry(sz, sz * (0.5 + r() * 0.5)), new THREE.MeshBasicMaterial({ map: tx, color: colors[i % colors.length], transparent: true, opacity: 0.35, depthWrite: false, fog: true }), area[0] + r() * (area[2] - area[0]), 0.015 + i * 0.0004, area[1] + r() * (area[3] - area[1]), g0); m.rotation.set(-Math.PI / 2, 0, r() * 3); }
  g0.userData.noBatch = false; return g0;
}
/* a wooden fence: posts every couple of metres and two rails */
export function fence(parent, x0, z0, x1, z1, { h = 1.1, post = 0x6a5238, gap = 2.2, wire = false } = {}) {
  const g = grp(parent), len = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(-(z1 - z0), x1 - x0), n = Math.max(1, Math.round(len / gap)); const m = solid(post, 0.95);
  for (let i = 0; i <= n; i++) { const t = i / n; box(0.1, h, 0.1, m, x0 + (x1 - x0) * t, h / 2, z0 + (z1 - z0) * t, g); }
  for (const y of [h * 0.35, h * 0.85]) { const r = box(len, wire ? 0.015 : 0.07, wire ? 0.015 : 0.05, wire ? solid(0xaaaaaa, 0.5, 0.5) : m, (x0 + x1) / 2, y, (z0 + z1) / 2, g); r.rotation.y = ang; }
  return g;
}
/* trees of the island. Each crown is a few soft, lumpy blobs (a noisy sphere with smooth normals) coloured darker underneath and lighter on top,
   all with one shared vertex-coloured material, so batchStatic merges every crown in a place into a single draw call. */
export const CROWN_M = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 });
const _cA = new THREE.Color(), _cB = new THREE.Color(), _cC = new THREE.Color();
export function blob(parent, x, y, z, rad, seed, dark, light, { squash = 0.8, bump = 0.22, speck = 0 , specks = 0xd9442a } = {}) {
  const r = rng(seed * 7 + 3), s1 = r() * 9, s2 = r() * 9, s3 = r() * 9; let geo = new THREE.IcosahedronGeometry(1, 2); geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); geo = mergeVertices(geo);
  const p = geo.attributes.position, col = new Float32Array(p.count * 3); _cA.set(dark); _cB.set(light);
  for (let i = 0; i < p.count; i++) { V.fromBufferAttribute(p, i);
    const n = 1 + bump * (Math.sin(V.x * 3.1 + s1) * Math.sin(V.y * 2.9 + s2) * Math.sin(V.z * 3.3 + s3)) + bump * 0.5 * Math.sin(V.x * 7.3 + V.z * 5.1 + s2) * Math.sin(V.y * 6.7 + s1);
    const yy = V.y; V.multiplyScalar(rad * n); V.y *= squash; if (yy < -0.4) V.y = Math.max(V.y, -rad * squash * 0.55);   /* a flatter underside */
    p.setXYZ(i, V.x, V.y, V.z); const k = Math.min(1, Math.max(0, (yy + 0.7) / 1.5)) * (0.85 + 0.3 * r());
    _cC.copy(_cA).lerp(_cB, k); if (speck && r() < speck && yy > -0.2) _cC.set(specks).offsetHSL(0, 0, (r() - 0.5) * 0.1); col[i * 3] = _cC.r; col[i * 3 + 1] = _cC.g; col[i * 3 + 2] = _cC.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals(); return mesh(geo, CROWN_M, x, y, z, parent);
}
function trunkWithBranches(g, h, r, bark, n = 4, spread = 0.9) {   /* a tapering trunk that splits into a few branches reaching up into the crown */
  cyl(0.2 * spread + 0.08, 0.38 * spread + 0.06, h * 0.5, bark, 0, h * 0.25, 0, g, 9); const tips = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + r() * 0.8, L = h * (0.32 + r() * 0.12), tilt = 0.45 + r() * 0.35, b = grp(g, 0, h * 0.46, 0); b.rotation.set(0, a, tilt); cyl(0.05, 0.13 * spread + 0.03, L, bark, 0, L / 2, 0, b, 6);
    tips.push([-Math.sin(tilt) * L * Math.cos(a), h * 0.46 + Math.cos(tilt) * L, Math.sin(tilt) * L * Math.sin(a)]); }
  return tips;
}
export function flameTree(h = 7, seed = 1) {   /* poinciana: a wide flat umbrella of red-orange flowers on a short grey trunk */
  const r = rng(seed), g = grp(), tips = trunkWithBranches(g, h * 0.95, r, solid(0x6e6252, 1), 5, 1.0);
  for (const [x, y, z] of tips) blob(g, x * 1.25, y + 0.2, z * 1.25, h * (0.2 + r() * 0.06), seed * 13 + x * 5 | 0, 0x2e5a26, 0x6a9a3a, { squash: 0.5, speck: 0.55, specks: [0xd9442a, 0xe8602a, 0xc8382a][(r() * 3) | 0] });
  blob(g, 0, h * 0.86, 0, h * 0.24, seed * 17, 0x2e5a26, 0x5a8a34, { squash: 0.45, speck: 0.6 });
  return g;
}
export function mangoTree(h = 6.5, seed = 1) {   /* a dark, dense, rounded tree with a few orange mangoes */
  const r = rng(seed), g = grp(), tips = trunkWithBranches(g, h * 0.9, r, solid(0x5a4630, 1), 4, 1.05);
  blob(g, 0, h * 0.72, 0, h * 0.34, seed * 3 + 1, 0x163f20, 0x3d7a38, { squash: 0.85 });
  for (const [x, y, z] of tips) { const rad = h * (0.2 + r() * 0.06), bx = x * 1.1, by = y + h * 0.05, bz = z * 1.1; blob(g, bx, by, bz, rad, (seed * 31 + x * 7) | 0, 0x163f20, 0x467f3a, { squash: 0.85 });
    for (let i = 0; i < 2; i++) { const a = r() * 6.28; mesh(new THREE.SphereGeometry(0.08, 6, 5), flat(0xe8962a), bx + Math.cos(a) * rad * 0.4, by - rad * 0.85 * 0.5, bz + Math.sin(a) * rad * 0.4, g).scale.y = 1.3; } }   /* mangoes hanging just under the leaves */
  return g;
}
let _bl; const BAMBOO_LEAF = () => (_bl = _bl || new THREE.MeshLambertMaterial({ map: T.leaf(), alphaTest: 0.4, side: THREE.DoubleSide, color: 0xd8f0a0 }));
export function bamboo(seed = 1) { const r = rng(seed), g = grp(), m = solid(0x8aa84a, 0.8), nm = solid(0x5a7a30, 0.9); for (let i = 0; i < 12; i++) { const hh = 6 + r() * 5, a = r() * 6.28, d = r() * 0.7, c = cyl(0.045, 0.06, hh, m, Math.cos(a) * d, hh / 2, Math.sin(a) * d, g, 5); c.rotation.set((r() - 0.5) * 0.28, 0, (r() - 0.5) * 0.28); for (let k = 1; k < 6; k++) { const n = cyl(0.065, 0.065, 0.05, nm, 0, -hh / 2 + k * hh / 6, 0, c, 5); } for (let k = 0; k < 4; k++) { const lf = mesh(new THREE.PlaneGeometry(0.7, 1.5), BAMBOO_LEAF(), 0, hh / 2 - 0.5 - k * 0.6, 0, c); lf.rotation.set(0.5 + r() * 0.4, k * 1.7 + r(), 0); lf.geometry.translate(0, 0.6, 0); } } return g; }   /* sprays of leaves near the top of each cane */
export function hibiscus(seed = 1) { const r = rng(seed), g = grp(); for (let i = 0; i < 3; i++) mesh(new THREE.IcosahedronGeometry(0.55, 1), flat(0x2f6f36), (r() - 0.5) * 0.7, 0.55, (r() - 0.5) * 0.7, g); for (let i = 0; i < 6; i++) mesh(new THREE.SphereGeometry(0.1, 6, 5), flat(i % 2 ? 0xe2232a : 0xf2a0b0), (r() - 0.5) * 1.0, 0.5 + r() * 0.5, (r() - 0.5) * 1.0, g); return g; }
export function croton(seed = 1) { const r = rng(seed), g = grp(), cs = [0xd8a020, 0xc8402a, 0x5a8a30, 0xe8c040]; for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(0.35, 0), flat(cs[(r() * 4) | 0]), (r() - 0.5) * 0.5, 0.35 + r() * 0.2, (r() - 0.5) * 0.5, g); return g; }
export function stump() { const g = grp(); cyl(0.3, 0.36, 0.5, solid(0x6a5238, 1), 0, 0.25, 0, g, 8); return g; }
export function dugOut() { const g = grp(); const h = mesh(new THREE.CylinderGeometry(0.35, 0.28, 4.4, 8, 1, true, 0, Math.PI), solid(0x7a5a38, 0.95, 0, { side: THREE.DoubleSide }), 0, 0.3, 0, g); h.rotation.z = Math.PI / 2; h.rotation.x = Math.PI / 2; h.rotation.y = 0; return g; }
export function drift() { const g = grp(); const r = rng(5); for (let i = 0; i < 3; i++) { const c = cyl(0.07, 0.09, 1.2 + r(), solid(0xb8a888, 1), 0, 0.08, i * 0.4, g, 6); c.rotation.z = Math.PI / 2; c.rotation.y = r(); } return g; }

/* a flock of birds, far up: little dark Vs that flap. tick(t, on) */
export function makeBirds(scene, n = 7) {
  const tx = cv(64, 32, (x) => { x.strokeStyle = '#1a1a1a'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(4, 8); x.quadraticCurveTo(18, 4, 32, 20); x.quadraticCurveTo(46, 4, 60, 8); x.stroke(); }, null, true), list = [];
  for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, fog: true })); s.scale.set(2.2, 1.1, 1); scene.add(s); list.push({ s, a: i * 0.9, r: 60 + (i % 4) * 14, y: 30 + (i % 3) * 8, v: 0.06 + i * 0.008 }); }
  return { tick(t, on, cx, cz) { for (const b of list) { b.s.visible = on; if (!on) continue; const a = b.a + t * b.v; b.s.position.set(cx + Math.cos(a) * b.r, b.y + Math.sin(t * 0.7 + b.a) * 2, cz + Math.sin(a) * b.r); b.s.scale.y = 0.6 + Math.abs(Math.sin(t * 5 + b.a * 3)) * 0.7; } } };
}
