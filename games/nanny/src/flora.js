/* games/nanny/src/flora.js: the forest of the Blue Mountains, made in code.
   Trees, tree ferns, plantains, bushes, ground ferns, grass, sugar cane and rocks are each one shape drawn many times (instanced), so a whole hillside costs a few draws.
   spotsOn() picks places on the land; plant() and plantCards() put a shape at every spot. cottonTree() is the one big hero tree.
   Which plants grew at Old Nanny Town is not recorded: this is a general picture of moist hill forest, and docs/games/nanny.md says so. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { cv, rng, T } from './gfx.js';
import { vnoise } from './land.js';

const M4 = new THREE.Matrix4(), V = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), C = new THREE.Color();

/* paint a geometry with one colour per vertex: fn(yFraction 0..1, vertexIndex) gives [r, g, b] */
function paint(geo, fn) { geo.computeBoundingBox(); const p = geo.attributes.position, b = geo.boundingBox, hgt = (b.max.y - b.min.y) || 1, col = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { const c = fn((p.getY(i) - b.min.y) / hgt, i); col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; } geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); return geo; }
const flatGeo = (parts) => { const g = mergeGeometries(parts.map((p) => { const q = p.index ? p.toNonIndexed() : p; q.deleteAttribute('uv'); return q; }), false); g.computeVertexNormals(); return g; };
const GREENS = [[0.11, 0.27, 0.12], [0.14, 0.32, 0.13], [0.09, 0.24, 0.12], [0.17, 0.35, 0.14], [0.12, 0.29, 0.17]];   /* deep greens: the sun and sky light are strong, and paler leaves wash out */
const BARK = [0.26, 0.20, 0.15];
let _treeMat = null; const treeMat = () => _treeMat || (_treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));

/* a lump of leaves: a ball with its points pushed in and out, darker underneath */
function blob(r, s, x, y, z, green, squash = 0.78) {
  const g = new THREE.IcosahedronGeometry(s, 1), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const k = 0.84 + vnoise(p.getX(i) * 1.7 + x, p.getY(i) * 1.7 + z + p.getZ(i), 7) * 0.34; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * squash, p.getZ(i) * k); }
  paint(g, (t) => green.map((c) => c * (0.5 + 0.6 * t))); g.translate(x, y, z); return g;
}
/* tree shapes. kind: 'broad' (a wide dark crown), 'tall' (a long trunk with a small high crown), 'bush' (no trunk) */
export function treeGeo(kind = 'broad', seed = 1) {
  const r = rng(seed), parts = [], pick = () => GREENS[(r() * GREENS.length) | 0];
  if (kind === 'bush') { for (let i = 0; i < 4; i++) parts.push(blob(r, 0.45 + r() * 0.35, (r() - 0.5) * 1.1, 0.35 + r() * 0.3, (r() - 0.5) * 1.1, pick(), 0.7)); return flatGeo(parts); }
  const h = kind === 'tall' ? 15 : 8.5, tr = new THREE.CylinderGeometry(kind === 'tall' ? 0.2 : 0.2, kind === 'tall' ? 0.42 : 0.4, h * (kind === 'tall' ? 0.78 : 0.6), 7, 3); const tp = tr.attributes.position;
  for (let i = 0; i < tp.count; i++) tp.setX(i, tp.getX(i) + Math.sin(tp.getY(i) * 0.5 + seed) * 0.12);
  tr.translate(0, h * (kind === 'tall' ? 0.39 : 0.3), 0); paint(tr, (t) => BARK.map((c) => c * (0.8 + 0.3 * t))); parts.push(tr);
  const n = kind === 'tall' ? 4 : 6, sp = kind === 'tall' ? 0.22 : 0.5;
  for (let i = 0; i < n; i++) parts.push(blob(r, h * (kind === 'tall' ? 0.13 + r() * 0.07 : 0.2 + r() * 0.13), (r() - 0.5) * h * sp, h * (kind === 'tall' ? 0.78 + r() * 0.2 : 0.62 + r() * 0.26), (r() - 0.5) * h * sp, pick()));
  return flatGeo(parts);
}
/* a rock: a lumpy grey stone with a little moss on top */
export function rockGeo(seed = 1) { const g = new THREE.DodecahedronGeometry(1, 1), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const k = 0.78 + vnoise(p.getX(i) * 2.2 + seed, p.getZ(i) * 2.2 + p.getY(i), 5) * 0.5; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.72, p.getZ(i) * k); }
  const q = g.index ? g.toNonIndexed() : g; q.deleteAttribute('uv'); paint(q, (t, i) => { const m = t > 0.72 ? 0.5 : 0; return [0.44 - m * 0.2, 0.43 + m * 0.02, 0.40 - m * 0.22].map((c) => c * (0.8 + vnoise(i * 0.37, seed, 2) * 0.4)); }); q.computeVertexNormals(); return q; }

/* a set of fronds leaving one point: each is a strip that rises at angle a0 and droops to a1. Used for tree ferns, plantains, palms and ground ferns. */
export function frondGeo(n, L, W, a0, a1, seed = 1, y0 = 0, segs = 4) {
  const r = rng(seed), pos = [], uv = [], idx = [], nor = [];
  for (let f = 0; f < n; f++) { const ang = f / n * Math.PI * 2 + r() * 0.5, len = L * (0.8 + r() * 0.4), ca = Math.cos(ang), sa = Math.sin(ang), base = pos.length / 3; let d = 0, y = y0;
    for (let s = 0; s <= segs; s++) { const t = s / segs, el = a0 + (a1 - a0) * t + (r() - 0.5) * 0.08; if (s) { d += Math.cos(el) * len / segs; y += Math.sin(el) * len / segs; }
      for (const k of [-1, 1]) { pos.push(ca * d - sa * k * W / 2, y, sa * d + ca * k * W / 2); uv.push(k < 0 ? 0 : 1, 1 - t); nor.push(0, 1, 0); }
      if (s < segs) { const q = base + s * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); } } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx); return bothFaces(g);
}
/* leaf cards are seen from both sides. Drawing the back with the material's double side turns the normal over, and the back goes black under a sky light.
   So each triangle is added twice, wound both ways, with the same upward normal: both faces take the same light. */
function bothFaces(g) { const i = g.index.array, out = new (i.constructor)(i.length * 2); out.set(i); for (let k = 0; k < i.length; k += 3) { out[i.length + k] = i[k]; out[i.length + k + 1] = i[k + 2]; out[i.length + k + 2] = i[k + 1]; } g.setIndex(new THREE.BufferAttribute(out, 1)); return g; }
const cardMats = {};
export const cardMat = (kind) => cardMats[kind] || (cardMats[kind] = new THREE.MeshLambertMaterial({ map: kind === 'banana' ? T.bananaLeaf() : kind === 'cane' ? caneTex() : kind === 'tuft' ? T.tuft() : T.leaf(), alphaTest: 0.35 }));
const caneTex = () => cv(128, 256, (x, w, h) => { x.clearRect(0, 0, w, h); for (let i = 0; i < 7; i++) { const bx = 14 + i * 16 + Math.random() * 6; x.strokeStyle = ['#b8b060', '#a8a458', '#c4b868'][i % 3]; x.lineWidth = 5; x.beginPath(); x.moveTo(bx, h); x.lineTo(bx + (Math.random() - 0.5) * 10, h * 0.32); x.stroke();
  for (let j = 0; j < 5; j++) { const y = h * (0.1 + j * 0.13), dir = (j % 2 ? 1 : -1) * (14 + Math.random() * 22); x.strokeStyle = j % 2 ? '#6a9a3a' : '#7fae42'; x.lineWidth = 4; x.beginPath(); x.moveTo(bx, y + h * 0.22); x.quadraticCurveTo(bx + dir * 0.6, y, bx + dir, y + 12 + Math.random() * 26); x.stroke(); } } }, [1, 1], true);
/* two upright cards crossed at right angles: grass, cane */
export function crossGeo() { const a = new THREE.PlaneGeometry(1, 1), b = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); b.translate(0, 0.5, 0); b.rotateY(Math.PI / 2); const g = mergeGeometries([a, b], false); const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); return bothFaces(g); }

/* ---------- placing things on the land ---------- */
/* pick up to n spots in area [x0, z0, x1, z1] where ok(x, z, y) is true. Each spot: { x, y, z, s (size 0.7 to 1.4), ry } */
export function spotsOn(G, n, area, seed, ok = () => true, { smin = 0.7, smax = 1.4, tries = 14 } = {}) {
  const r = rng(seed), out = []; let t = 0;
  while (out.length < n && t++ < n * tries) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), y = G.h(x, z); if (!ok(x, z, y, r)) continue; out.push({ x, y, z, s: smin + r() * (smax - smin), ry: r() * 6.283, k: r() }); }
  return out;
}
/* keep trees off trails and clearings, and off very steep ground */
export const offTrail = (G, margin = 0.02, maxSlope = 1.1) => (x, z, y) => G.trailness(x, z) <= margin && Math.abs(G.h(x + 1.2, z) - y) < maxSlope * 1.2 && Math.abs(G.h(x, z + 1.2) - y) < maxSlope * 1.2;
/* draw `geo` at every spot. vary: how much each one's colour differs. sink: metres pushed into the ground. */
export function plant(parent, geo, mat, spots, { vary = 0.14, sink = 0.15, sy = 1, shadow = true, tint } = {}) {
  if (!spots.length) return null; const im = new THREE.InstancedMesh(geo, mat, spots.length);
  spots.forEach((p, i) => { M4.compose(V.set(p.x, p.y - sink * p.s, p.z), Q.setFromEuler(E.set(0, p.ry, 0)), S.set(p.s, p.s * sy * (0.9 + p.k * 0.25), p.s)); im.setMatrixAt(i, M4); C.set(tint || 0xffffff).offsetHSL((p.k - 0.5) * 0.05, 0, (p.k - 0.5) * vary * 2); im.setColorAt(i, C); });
  im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.userData.noBatch = true; im.frustumCulled = false; im.castShadow = shadow; im.receiveShadow = false; parent.add(im); return im;
}
let _trunkMat = null; const trunkMat = () => _trunkMat || (_trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 1 }));
let _stemMat = null; const stemMat = () => _stemMat || (_stemMat = new THREE.MeshStandardMaterial({ color: 0x7a9a48, roughness: 0.9 }));
/* tree ferns: a dark trunk and a crown of drooping fronds */
export function plantTreeFerns(parent, spots, seed = 3) {
  const tr = new THREE.CylinderGeometry(0.09, 0.13, 2.6, 6); tr.translate(0, 1.3, 0); plant(parent, tr, trunkMat(), spots, { vary: 0.05, sy: 1 });
  plant(parent, frondGeo(11, 1.9, 0.62, 0.75, -0.75, seed, 2.55), cardMat('leaf'), spots, { vary: 0.1, sink: 0.15, tint: 0xdcf0c8 });
}
/* plantains: a soft green stem and wide torn leaves */
export function plantPlantains(parent, spots, seed = 5) {
  const st = new THREE.CylinderGeometry(0.07, 0.12, 1.9, 6); st.translate(0, 0.95, 0); plant(parent, st, stemMat(), spots, { vary: 0.05 });
  plant(parent, frondGeo(7, 1.7, 0.62, 1.15, -0.5, seed, 1.8, 3), cardMat('banana'), spots, { vary: 0.08 });
}
/* coconut palms, for the low land by the estate */
export function plantPalms(parent, spots, seed = 9) {
  const tr = new THREE.CylinderGeometry(0.12, 0.2, 7, 6, 4); const p = tr.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + Math.pow((p.getY(i) + 3.5) / 7, 2) * 0.9); tr.translate(0, 3.5, 0); plant(parent, tr, trunkMat(), spots, { vary: 0.05 });
  const fr = frondGeo(12, 3.1, 0.9, 0.55, -0.9, seed, 6.9); fr.translate(0.9, 0, 0); plant(parent, fr, cardMat('leaf'), spots, { vary: 0.08 });
}
export const plantGroundFerns = (parent, spots, seed = 7) => plant(parent, frondGeo(7, 0.75, 0.26, 0.85, -0.35, seed, 0.02, 3), cardMat('leaf'), spots, { vary: 0.12, sink: 0, shadow: false, tint: 0xcfe8b8 });
export const plantGrass = (parent, spots, { h = 0.5, w = 0.8, tint = 0x5e7a48 } = {}) => { const g = crossGeo(); g.scale(w, h, w); return plant(parent, g, cardMat('tuft'), spots, { vary: 0.16, sink: 0.02, shadow: false, tint }); };
export const plantCane = (parent, spots) => { const g = crossGeo(); g.scale(1.5, 2.9, 1.5); return plant(parent, g, cardMat('cane'), spots, { vary: 0.1, sink: 0.05, shadow: false }); };

/* the usual forest for a place: big trees, tall trees, bushes, tree ferns, ground ferns, grass and rocks, kept off the trails.
   opts.keep(x, z): extra places to leave clear. Returns the tree spots (so a place can make them solid). */
export function forest(parent, G, area, { seed = 11, trees = 120, tall = 40, bushes = 120, ferns = 40, ground = 240, grass = 900, rocks = 60, keep = () => true, keepTrees = () => true, near = null } = {}) {
  const ok = offTrail(G), okk = (x, z, y) => ok(x, z, y) && keep(x, z) && keepTrees(x, z), okNear = (x, z, y) => G.trailness(x, z) < 0.02 && keep(x, z);
  const A = spotsOn(G, trees, area, seed, okk, { smin: 0.75, smax: 1.5 }), B = spotsOn(G, tall, area, seed + 1, okk, { smin: 0.8, smax: 1.3 });
  plant(parent, treeGeo('broad', seed), treeMat(), A.filter((_, i) => i % 2 === 0)); plant(parent, treeGeo('broad', seed + 5), treeMat(), A.filter((_, i) => i % 2 === 1)); plant(parent, treeGeo('tall', seed + 9), treeMat(), B);
  plant(parent, treeGeo('bush', seed + 3), treeMat(), spotsOn(G, bushes, area, seed + 2, okNear, { smin: 0.7, smax: 1.7 }), { sink: 0.1, shadow: false });
  plantTreeFerns(parent, spotsOn(G, ferns, area, seed + 3, okk, { smin: 0.7, smax: 1.3 }), seed);
  const nearArea = near || area; plantGroundFerns(parent, spotsOn(G, ground, nearArea, seed + 4, okNear, { smin: 0.7, smax: 1.5 }), seed);
  plantGrass(parent, spotsOn(G, grass, nearArea, seed + 5, (x, z) => G.trailness(x, z) < 0.5 && keep(x, z), { smin: 0.6, smax: 1.5 }));
  plant(parent, rockGeo(seed), treeMat(), spotsOn(G, rocks, nearArea, seed + 6, (x, z) => G.trailness(x, z) < 0.3 && keep(x, z), { smin: 0.25, smax: 1.1 }), { sink: 0.25, vary: 0.1 });
  return A.concat(B);
}

/* the great cotton tree (a ceiba): a huge grey trunk with wing-like roots and a wide flat crown. One mesh. */
export function cottonTree(h = 24, seed = 2) {
  const r = rng(seed), parts = [], grey = [0.44, 0.40, 0.35];
  const tr = new THREE.CylinderGeometry(0.75, 1.35, h * 0.62, 10, 4); tr.translate(0, h * 0.31, 0); paint(tr, (t) => grey.map((c) => c * (0.8 + 0.25 * t))); parts.push(tr);
  for (let i = 0; i < 7; i++) {   /* a root like a thin wall: wide at the ground, running up the trunk */
    const a = i / 7 * Math.PI * 2 + r() * 0.3, out = 2.6 + r() * 1.6, up = 3.2 + r() * 2, w = 0.16, ca = Math.cos(a), sa = Math.sin(a), g = new THREE.BufferGeometry();
    const P = (d, y, s) => [ca * d - sa * s * w, y, sa * d + ca * s * w], v = [P(0.9, 0, -1), P(out, 0, -1), P(0.8, up, -1), P(0.9, 0, 1), P(out, 0, 1), P(0.8, up, 1)], f = [0, 2, 1, 3, 4, 5, 1, 2, 5, 1, 5, 4, 0, 1, 4, 0, 4, 3];
    g.setAttribute('position', new THREE.Float32BufferAttribute(f.flatMap((k) => v[k]), 3)); g.computeVertexNormals(); paint(g, (t) => grey.map((c) => c * (0.7 + 0.3 * t))); parts.push(g); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + r() * 0.4, len = h * (0.26 + r() * 0.1), b = new THREE.CylinderGeometry(0.16, 0.38, len, 6); b.translate(0, len / 2, 0); b.rotateZ(-1.05 - r() * 0.2); b.rotateY(a); b.translate(0, h * 0.58, 0); paint(b, () => grey.map((c) => c * 0.9)); parts.push(b); }
  for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, d = h * (0.1 + r() * 0.34); parts.push(blob(r, h * (0.11 + r() * 0.07), Math.cos(a) * d, h * (0.74 + r() * 0.16), Math.sin(a) * d, GREENS[(r() * GREENS.length) | 0], 0.62)); }
  const m = new THREE.Mesh(flatGeo(parts), treeMat()); m.castShadow = true; m.userData.noBatch = true; m.name = 'cottonTree'; return m;
}
