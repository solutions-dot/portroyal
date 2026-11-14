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

/* phones draw fewer plants: the same forest, thinned */
export const LOW = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
/* a lump of leaves: a ball with its points pushed in and out. Darker underneath and inside, lighter on top and on the side the sun reaches, and dappled, so a crown reads as leaves and not as one smooth shape. */
function blob(r, s, x, y, z, green, squash = 0.78, detail = 1) {
  const g = new THREE.IcosahedronGeometry(s, detail), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const k = 0.8 + vnoise(p.getX(i) * 2.3 + x, p.getY(i) * 2.3 + z + p.getZ(i) * 1.7, 7) * 0.42; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * squash, p.getZ(i) * k); }
  paint(g, (t, i) => { const d = 0.86 + vnoise(p.getX(i) * 4.1 + x * 3, p.getZ(i) * 4.1 + p.getY(i) * 2.9 + z, 11) * 0.3, sun = 0.94 + 0.1 * Math.max(0, (p.getX(i) - p.getZ(i)) / (s * 1.4)), k = (0.42 + 0.7 * t) * d * sun; return [green[0] * k + 0.035 * t * t, green[1] * k + 0.05 * t * t, green[2] * k]; });
  g.translate(x, y, z); return g;
}
/* a limb: a tapered piece of trunk or branch from one point to another, in bark colours */
const _up = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3(), _q = new THREE.Quaternion();
function limb(a, b, r0, r1, seg = 6, bark = BARK) {
  _d.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const len = _d.length(), g = new THREE.CylinderGeometry(r1, r0, len, seg, 2), p = g.attributes.position; g.translate(0, len / 2, 0);
  paint(g, (t, i) => { const k = 0.72 + vnoise(p.getX(i) * 9 + a[0], p.getY(i) * 2.2 + a[2], 4) * 0.5; return [bark[0] * k, bark[1] * k, bark[2] * k * (0.9 + 0.2 * t)]; });
  g.applyQuaternion(_q.setFromUnitVectors(_up, _d.normalize())); g.translate(a[0], a[1], a[2]); return g;
}
/* the foot of a trunk: it widens into the ground, with a few low roots */
function foot(r0, hgt, seed, bark = BARK) { const g = new THREE.CylinderGeometry(r0, r0 * 1.9, hgt, 8, 2), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), low = 1 - (p.getY(i) + hgt / 2) / hgt, k = 1 + low * 0.45 * Math.max(0, Math.sin(a * 3 + seed)); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
  g.translate(0, hgt / 2 - 0.12, 0); paint(g, (t) => bark.map((c) => c * (0.6 + 0.35 * t))); return g; }
/* tree shapes. kind: 'broad' (a spreading crown on branching limbs), 'tall' (a long straight trunk with a small high crown), 'bush' (no trunk) */
export function treeGeo(kind = 'broad', seed = 1) {
  const r = rng(seed), parts = [], pick = () => GREENS[(r() * GREENS.length) | 0];
  if (kind === 'bush') { for (let i = 0; i < 5; i++) parts.push(blob(r, 0.38 + r() * 0.34, (r() - 0.5) * 1.2, 0.32 + r() * 0.34, (r() - 0.5) * 1.2, pick(), 0.72, i < 3 ? 1 : 0)); return flatGeo(parts); }
  const tall = kind === 'tall', h = tall ? 15.5 : 8.6, fork = h * (tall ? 0.7 : 0.4), lean = [(r() - 0.5) * 0.7, fork, (r() - 0.5) * 0.7], bark = tall ? [0.33, 0.29, 0.24] : BARK;
  parts.push(foot(tall ? 0.36 : 0.4, 1.1, seed, bark)); parts.push(limb([0, 0.7, 0], lean, tall ? 0.34 : 0.38, tall ? 0.2 : 0.26, 7, bark));
  const n = tall ? 3 : 4 + ((r() * 2) | 0), a0 = r() * 6.28;
  for (let i = 0; i < n; i++) {   /* each main limb ends in a clump of leaves */
    const a = a0 + i / n * 6.283 + (r() - 0.5) * 0.5, reach = h * (tall ? 0.12 + r() * 0.06 : 0.26 + r() * 0.14), rise = h * (tall ? 0.13 + r() * 0.08 : 0.2 + r() * 0.16), e = [lean[0] + Math.cos(a) * reach, fork + rise, lean[2] + Math.sin(a) * reach];
    parts.push(limb(lean, e, tall ? 0.14 : 0.17, 0.06, 5, bark)); const s = h * (tall ? 0.105 : 0.15) * (0.85 + r() * 0.4), g = pick();
    parts.push(blob(r, s, e[0], e[1] + s * 0.25, e[2], g)); parts.push(blob(r, s * 0.62, e[0] + Math.cos(a) * s * 0.75, e[1] - s * 0.05 + r() * s * 0.3, e[2] + Math.sin(a) * s * 0.75, pick(), 0.74, 0));
    if (!tall) parts.push(blob(r, s * 0.55, e[0] + Math.cos(a + 1.7) * s * 0.7, e[1] + s * 0.35, e[2] + Math.sin(a + 1.7) * s * 0.7, g, 0.7, 0)); }
  const top = h * (tall ? 0.12 : 0.17); parts.push(blob(r, top, lean[0], h * (tall ? 0.93 : 0.8), lean[2], pick())); parts.push(blob(r, top * 0.7, lean[0] + top * 0.5, h * (tall ? 0.99 : 0.9), lean[2] - top * 0.3, pick(), 0.74, 0));
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
export const plantGrass = (parent, spots, { h = 0.5, w = 0.8, tint = 0x6c8a52 } = {}) => { const g = crossGeo(); g.scale(w, h, w); return plant(parent, g, cardMat('tuft'), spots, { vary: 0.05, sink: 0.02, shadow: false, tint }); };
export const plantCane = (parent, spots) => { const g = crossGeo(); g.scale(1.5, 2.9, 1.5); return plant(parent, g, cardMat('cane'), spots, { vary: 0.1, sink: 0.05, shadow: false }); };

/* the usual forest for a place: big trees, tall trees, bushes, tree ferns, ground ferns, grass and rocks, kept off the trails.
   opts.keep(x, z): extra places to leave clear. Returns the tree spots (so a place can make them solid). */
export function forest(parent, G, area, { seed = 11, trees = 120, tall = 40, bushes = 120, ferns = 40, ground = 240, grass = 900, rocks = 60, keep = () => true, keepTrees = () => true, near = null } = {}) {
  const ok = offTrail(G), okk = (x, z, y) => ok(x, z, y) && keep(x, z) && keepTrees(x, z), okNear = (x, z, y) => G.trailness(x, z) < 0.02 && keep(x, z);
  const K = LOW ? 0.6 : 1; trees = Math.round(trees * K); tall = Math.round(tall * K); bushes = Math.round(bushes * K); ferns = Math.round(ferns * K); ground = Math.round(ground * K); grass = Math.round(grass * K);
  const A = spotsOn(G, trees, area, seed, okk, { smin: 0.75, smax: 1.5 }), B = spotsOn(G, tall, area, seed + 1, okk, { smin: 0.8, smax: 1.3 });
  for (let v = 0; v < 3; v++) plant(parent, treeGeo('broad', seed + v * 5), treeMat(), A.filter((_, i) => i % 3 === v)); plant(parent, treeGeo('tall', seed + 9), treeMat(), B.filter((_, i) => i % 2 === 0)); plant(parent, treeGeo('tall', seed + 13), treeMat(), B.filter((_, i) => i % 2 === 1));
  plant(parent, treeGeo('bush', seed + 3), treeMat(), spotsOn(G, bushes, area, seed + 2, okNear, { smin: 0.7, smax: 1.7 }), { sink: 0.1, shadow: false });
  plantTreeFerns(parent, spotsOn(G, ferns, area, seed + 3, okk, { smin: 0.7, smax: 1.3 }), seed);
  const nearArea = near || area; plantGroundFerns(parent, spotsOn(G, ground, nearArea, seed + 4, okNear, { smin: 0.7, smax: 1.5 }), seed);
  plantGrass(parent, spotsOn(G, grass, nearArea, seed + 5, (x, z) => G.trailness(x, z) < 0.5 && keep(x, z), { smin: 0.6, smax: 1.5 }));
  plant(parent, rockGeo(seed), treeMat(), spotsOn(G, rocks, nearArea, seed + 6, (x, z) => G.trailness(x, z) < 0.3 && keep(x, z), { smin: 0.25, smax: 1.1 }), { sink: 0.25, vary: 0.1 });
  return A.concat(B);
}

/* the great cotton tree (a ceiba). The trunk is one smooth skin: near the ground it swells into tall wing-like roots that fade into the round trunk higher up.
   Thick limbs leave the top in curves and carry a wide, flat crown. Smooth bark (its own material), leafy clumps like the other trees. */
let _barkMat = null; const barkMat = () => _barkMat || (_barkMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
function curveLimb(pts, r0, r1, seed, grey) {   /* a smooth tapering limb along a curve */
  const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), N = 10, R = 9, fr = c.computeFrenetFrames(N, false), pos = [], col = [], idx = [], P = new THREE.Vector3();
  for (let i = 0; i <= N; i++) { const t = i / N, r = r0 + (r1 - r0) * Math.pow(t, 0.8); c.getPointAt(t, P); for (let k = 0; k < R; k++) { const a = k / R * Math.PI * 2, nx = Math.cos(a), ny = Math.sin(a), n = fr.normals[i], b = fr.binormals[i]; pos.push(P.x + (n.x * nx + b.x * ny) * r, P.y + (n.y * nx + b.y * ny) * r, P.z + (n.z * nx + b.z * ny) * r); const k2 = 0.82 + vnoise(a * 2 + seed, t * 6, 5) * 0.3; col.push(grey[0] * k2, grey[1] * k2, grey[2] * k2); }
    if (i < N) for (let k = 0; k < R; k++) { const q = i * R + k, q2 = i * R + (k + 1) % R; idx.push(q, q + R, q2, q2, q + R, q2 + R); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); return g;
}
export function cottonTree(h = 24, seed = 2) {
  const r = rng(seed), grey = [0.47, 0.43, 0.37], grp = new THREE.Group(), TH = h * 0.6, RAD = 40, ROWS = 22, wings = 6, w0 = r() * 6.28, pos = [], col = [], idx = [];
  const wingAt = Array.from({ length: wings }, (_, i) => ({ a: w0 + i / wings * 6.283 + (r() - 0.5) * 0.35, out: 2.0 + r() * 1.5, up: 3.6 + r() * 2.2 }));
  for (let j = 0; j <= ROWS; j++) { const t = Math.pow(j / ROWS, 1.6), y = t * TH, core = 1.25 - 0.5 * Math.pow(t, 0.7) + 0.22 * Math.exp(-y / 1.2);
    for (let k = 0; k < RAD; k++) { const a = k / RAD * 6.2832; let wing = 0; for (const w of wingAt) { let d = Math.abs(a - (w.a % 6.2832)); d = Math.min(d, 6.2832 - d); const reach = w.out * Math.pow(Math.max(0, 1 - y / w.up), 1.7), width = 0.2 + 0.16 * (y / w.up); wing = Math.max(wing, reach * Math.exp(-(d * d) / (width * width))); }
      const rr = core + wing + vnoise(a * 3 + seed, y * 0.7, 9) * 0.07; pos.push(Math.cos(a) * rr, y - 0.25, Math.sin(a) * rr);
      const k2 = (0.7 + 0.3 * Math.min(1, y / 5)) * (0.86 + vnoise(a * 5 + seed, y * 1.4, 3) * 0.26) * (1 - 0.16 * Math.min(1, wing / 1.5)), moss = Math.max(0, 0.5 - y / 4) * vnoise(a * 2, y * 2 + seed, 6); col.push(grey[0] * k2 * (1 - moss * 0.5), grey[1] * k2 * (1 + moss * 0.15), grey[2] * k2 * (1 - moss * 0.5)); }
    if (j < ROWS) for (let k = 0; k < RAD; k++) { const q = j * RAD + k, q2 = j * RAD + (k + 1) % RAD; idx.push(q, q + RAD, q2, q2, q + RAD, q2 + RAD); } }
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); tg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); tg.setIndex(idx);
  const wood = [tg], leaves = [], n = 7, a0 = r() * 6.28;
  { const cap = new THREE.SphereGeometry(0.78, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).toNonIndexed(); cap.scale(1, 0.7, 1); cap.translate(0, TH - 0.3, 0); cap.deleteAttribute('uv'); cap.deleteAttribute('normal'); paint(cap, () => grey.map((c) => c * 0.95)); const ci = []; for (let i = 0; i < cap.attributes.position.count; i++) ci.push(i); cap.setIndex(ci); wood.push(cap); }
  for (let i = 0; i < n; i++) {   /* the great limbs: out, then up, each ending in clumps of leaves */
    const a = a0 + i / n * 6.283 + (r() - 0.5) * 0.4, reach = h * (0.3 + r() * 0.12), rise = h * (0.14 + r() * 0.1), ca = Math.cos(a), sa = Math.sin(a), y0 = TH - 1.2 - r() * 1.6, e = [ca * reach, y0 + rise, sa * reach];
    wood.push(curveLimb([[ca * 0.3, y0 - 0.6, sa * 0.3], [ca * reach * 0.36, y0 + rise * 0.16, sa * reach * 0.36], [ca * reach * 0.74, y0 + rise * 0.56, sa * reach * 0.74], e], 0.46, 0.1, seed + i, grey));
    const s = h * (0.085 + r() * 0.035), g = GREENS[(r() * GREENS.length) | 0]; leaves.push(blob(r, s, e[0], e[1] + s * 0.3, e[2], g, 0.6)); leaves.push(blob(r, s * 0.8, e[0] * 0.72 + sa * s * 0.6, e[1] + s * 0.1, e[2] * 0.72 - ca * s * 0.6, GREENS[(r() * GREENS.length) | 0], 0.6));
    leaves.push(blob(r, s * 0.7, e[0] * 1.12 - sa * s * 0.5, e[1] - s * 0.1, e[2] * 1.12 + ca * s * 0.5, g, 0.6, 0)); leaves.push(blob(r, s * 0.6, e[0] * 0.9, e[1] + s * 0.75, e[2] * 0.9, g, 0.62, 0)); }
  for (let i = 0; i < 4; i++) { const a = r() * 6.28, d = h * 0.12 * r(); leaves.push(blob(r, h * 0.1, Math.cos(a) * d, TH + h * (0.2 + r() * 0.08), Math.sin(a) * d, GREENS[(r() * GREENS.length) | 0], 0.6)); }
  wood.push(curveLimb([[0, TH - 1.5, 0], [0.3, TH + h * 0.1, 0.2], [0.1, TH + h * 0.2, -0.1]], 0.5, 0.12, seed + 31, grey));
  const wg = mergeGeometries(wood, false); wg.computeVertexNormals(); const wm = new THREE.Mesh(wg, barkMat()); wm.castShadow = true; wm.userData.noBatch = true; grp.add(wm);
  const lm = new THREE.Mesh(flatGeo(leaves), treeMat()); lm.castShadow = true; lm.userData.noBatch = true; grp.add(lm); grp.userData.noBatch = true; grp.name = 'cottonTree'; return grp;
}
