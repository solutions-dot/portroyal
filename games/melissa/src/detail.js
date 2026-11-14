/* games/kendal/src/detail.js: the small things that make a place feel lived in. Grass, flowers and stones are instanced (one draw call each);
   trees, fences and bushes are ordinary meshes that batchStatic merges. Everything is cheap on a phone. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng, cv } from './gfx.js';

const inClear = (x, z, clear) => clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3]);
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color();

/* grass tufts: two crossed cards, lit like the ground, in many shades of green */
let _tuftGeo, _tuftMat;
export function grassField(parent, area, n, { seed = 1, clear = [], h = 0.55, w = 0.8, tint = 0xb0cc88, vary = 0.3, y = 0 } = {}) {
  if (!_tuftGeo) { const a = new THREE.PlaneGeometry(1, 1), b = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); b.translate(0, 0.5, 0); b.rotateY(Math.PI / 2); _tuftGeo = new THREE.BufferGeometry(); const pa = a.attributes.position.array, pb = b.attributes.position.array; _tuftGeo = a.clone(); const m = [a, b]; const pos = [], nor = [], uv = [], idx = []; let off = 0; for (const g of m) { for (let i = 0; i < g.attributes.position.count; i++) { pos.push(g.attributes.position.getX(i), g.attributes.position.getY(i), g.attributes.position.getZ(i)); nor.push(0, 1, 0); uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i)); } for (const i of g.index.array) idx.push(i + off); off += g.attributes.position.count; } _tuftGeo = new THREE.BufferGeometry(); _tuftGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); _tuftGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); _tuftGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); _tuftGeo.setIndex(idx); _tuftMat = new THREE.MeshLambertMaterial({ map: T.tuft(), alphaTest: 0.4, side: THREE.DoubleSide }); }
  const r = rng(seed), im = new THREE.InstancedMesh(_tuftGeo, _tuftMat, n); let k = 0, tries = 0;
  while (k < n && tries++ < n * 6) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (inClear(x, z, clear)) continue; const sc = 0.6 + r() * 0.9; M4.compose(V.set(x, y, z), Q.setFromEuler(E.set(0, r() * 6.28, 0)), S.set(w * sc, h * sc, w * sc)); im.setMatrixAt(k, M4); C.set(tint).offsetHSL((r() - 0.5) * 0.06, (r() - 0.5) * 0.2, (r() - 0.5) * vary); im.setColorAt(k, C); k++; }
  im.count = k; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.userData.noBatch = true; im.frustumCulled = false; parent.add(im); return im;
}
/* wildflowers: a thin green stalk and a bright head, instanced */
let _stalk, _head;
export function flowerField(parent, area, n, { seed = 2, clear = [], colors = [0xe8505b, 0xf5c542, 0xffffff, 0xe27ad8, 0xff8a3a], y = 0 } = {}) {
  _stalk = _stalk || new THREE.ConeGeometry(0.012, 0.4, 3).translate(0, 0.2, 0); _head = _head || new THREE.IcosahedronGeometry(0.055, 0).translate(0, 0.42, 0);
  const r = rng(seed), a = new THREE.InstancedMesh(_stalk, new THREE.MeshLambertMaterial({ color: 0x4a7a30 }), n), b = new THREE.InstancedMesh(_head, new THREE.MeshLambertMaterial({ color: 0xffffff }), n); let k = 0, tries = 0;
  while (k < n && tries++ < n * 6) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (inClear(x, z, clear)) continue; const sc = 0.7 + r() * 0.9; M4.compose(V.set(x, y, z), Q.identity(), S.set(sc, sc, sc)); a.setMatrixAt(k, M4); b.setMatrixAt(k, M4); b.setColorAt(k, C.set(colors[(r() * colors.length) | 0])); k++; }
  a.count = b.count = k; for (const o of [a, b]) { o.userData.noBatch = true; o.frustumCulled = false; parent.add(o); } return [a, b];
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
/* trees of the island */
export function flameTree(h = 7, seed = 1) {   /* poinciana: a wide umbrella of red-orange flowers on a short grey trunk */
  const r = rng(seed), g = grp(); cyl(0.25, 0.42, h * 0.5, solid(0x6a5a48, 1), 0, h * 0.25, 0, g, 8); for (let i = 0; i < 3; i++) { const b = cyl(0.1, 0.16, h * 0.4, solid(0x6a5a48, 1), (i - 1) * 0.8, h * 0.62, (r() - 0.5) * 0.8, g, 6); b.rotation.z = (i - 1) * -0.7; }
  const cols = [0xd9442a, 0xe8602a, 0xc83a2a, 0xe87a30, 0x4a8a38]; for (let i = 0; i < 7; i++) { const s = h * (0.2 + r() * 0.14), b = mesh(new THREE.IcosahedronGeometry(s, 1), flat(cols[i < 5 ? (r() * 4 | 0) : 4]), (r() - 0.5) * h * 0.9, h * 0.72 + r() * h * 0.12, (r() - 0.5) * h * 0.9, g); b.scale.y = 0.55; }
  return g;
}
export function mangoTree(h = 6.5, seed = 1) {   /* a dark, dense tree with a few orange mangoes */
  const r = rng(seed), g = grp(); cyl(0.3, 0.45, h * 0.5, solid(0x5a4630, 1), 0, h * 0.25, 0, g, 8); const cols = [0x1f5a2c, 0x2a6a32, 0x1a4e28, 0x316e36];
  for (let i = 0; i < 7; i++) { const s = h * (0.2 + r() * 0.15); const b = mesh(new THREE.IcosahedronGeometry(s, 1), flat(cols[(r() * cols.length) | 0]), (r() - 0.5) * h * 0.6, h * 0.58 + r() * h * 0.3, (r() - 0.5) * h * 0.6, g); b.scale.y = 0.85; }
  for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(0.1, 6, 5), flat(0xe8962a), (r() - 0.5) * h * 0.7, h * 0.5 + r() * h * 0.2, (r() - 0.5) * h * 0.7, g);
  return g;
}
export function bamboo(seed = 1) { const r = rng(seed), g = grp(), m = solid(0x8aa84a, 0.8), nm = solid(0x5a7a30, 0.9); for (let i = 0; i < 12; i++) { const hh = 6 + r() * 5, a = r() * 6.28, d = r() * 0.7, c = cyl(0.045, 0.06, hh, m, Math.cos(a) * d, hh / 2, Math.sin(a) * d, g, 5); c.rotation.set((r() - 0.5) * 0.28, 0, (r() - 0.5) * 0.28); for (let k = 1; k < 6; k++) { const n = cyl(0.065, 0.065, 0.05, nm, 0, -hh / 2 + k * hh / 6, 0, c, 5); } const lf = mesh(new THREE.SphereGeometry(0.5, 6, 4), flat(0x5a9a34), 0, hh / 2, 0, c); lf.scale.set(1, 1.6, 1); } return g; }
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
