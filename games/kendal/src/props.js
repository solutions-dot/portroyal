import { loftSkin as skin } from '../../../engine/loft.js';
/* games/kendal/src/props.js: plants, hills, houses, animals and the many small things that fill a scene.
   Each builder returns a THREE.Group sitting on y = 0 at its own origin. */
import * as THREE from 'three';
import { T, std, solid, flat, glow, mesh, box, cyl, plane, grp, rng, cv } from './gfx.js';

const M = {
  trunk: solid(0x6a4c33, 1), palmTrunk: solid(0x8a7156, 1), wood: solid(0x7a5a3c, 0.95), woodDark: solid(0x3d2d20, 0.95), iron: solid(0x2b2d31, 0.6, 0.3), steel: solid(0x8c8f93, 0.4, 0.6),
  white: solid(0xece4d0, 0.9), red: solid(0xb9382e, 0.85), green: solid(0x2f6a3f, 0.9), blue: solid(0x2f5f93, 0.85), straw: solid(0xcfb06a, 1), sack: solid(0xb09a6a, 1), basket: solid(0xa8803c, 1),
  lanternGlass: new THREE.MeshBasicMaterial({ color: 0xffd78a }), tin: solid(0x9aa09a, 0.5, 0.5), black: solid(0x17181a, 0.7),
};
export { M as PM };

/* ---------- plants ---------- */
const leafMat = () => new THREE.MeshBasicMaterial({ map: T.leaf(), transparent: true, alphaTest: 0.35, side: THREE.DoubleSide });
let _leaf, _bleaf; const LM = () => (_leaf = _leaf || leafMat()), BLM = () => (_bleaf = _bleaf || new THREE.MeshBasicMaterial({ map: T.bananaLeaf(), transparent: true, alphaTest: 0.35, side: THREE.DoubleSide }));
export function palm(h = 6.5, seed = 1) {
  const r = rng(seed), g = grp(); const lean = (r() - 0.5) * 0.35;
  const trunk = cyl(0.16, 0.26, h, M.palmTrunk, -Math.sin(lean) * h / 2, Math.cos(lean) * h / 2, 0, g, 8); trunk.rotation.z = lean;
  const crown = grp(g, -Math.sin(lean) * h, Math.cos(lean) * h, 0);
  for (let i = 0; i < 9; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3.4, 1, 5), LM()); const p = f.geometry.attributes.position; for (let k = 0; k < p.count; k++) { const y = p.getY(k) + 1.7; p.setZ(k, -(y * y) * 0.12); } f.geometry.computeVertexNormals();
    f.geometry.translate(0, 1.6, 0); f.rotation.order = 'YXZ'; f.rotation.y = i / 9 * Math.PI * 2 + r() * 0.3; f.rotation.x = -0.35 - r() * 0.3; crown.add(f); }
  for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(0.16, 8, 6), solid(0x6b8a2a, 1), (r() - 0.5) * 0.4, -0.15, (r() - 0.5) * 0.4, crown);
  return g;
}
export function tree(h = 5.5, seed = 1, tone = 0) {   /* a broad tree like a mango or a guango: a trunk and lumpy dark-green blobs */
  const r = rng(seed), g = grp(); cyl(0.28, 0.4, h * 0.55, M.trunk, 0, h * 0.275, 0, g, 8);
  const cols = [0x2f6a35, 0x3a7a3a, 0x285d30, 0x3f8040]; if (tone) cols.push(0x5a7a30);
  for (let i = 0; i < 5; i++) { const s = h * (0.22 + r() * 0.16), b = mesh(new THREE.IcosahedronGeometry(s, 1), flat(cols[(r() * cols.length) | 0]), (r() - 0.5) * h * 0.4, h * 0.62 + r() * h * 0.22, (r() - 0.5) * h * 0.4, g); b.scale.y = 0.8; }
  return g;
}
export function banana(seed = 1, fruit = false) {   /* a banana plant; with fruit = true it carries a hanging bunch and the purple flower bud */
  const r = rng(seed), g = grp(); cyl(0.11, 0.17, 2.6, solid(0x6f8f3a, 1), 0, 1.3, 0, g, 8);
  if (fruit) { const h = grp(g, 0, 0, 0); h.rotation.y = r() * 6.28; const fr = bananaBunch(1.15); fr.position.set(0.36, 1.66, 0); h.add(fr); const arm = cyl(0.03, 0.03, 0.4, solid(0x7a8440, 1), 0.18, 2.535, 0, h, 5); arm.rotation.z = -1.82; const bud = mesh(new THREE.SphereGeometry(0.1, 8, 6), solid(0x6a2a58, 0.6), 0.36, 1.56, 0, h); bud.scale.set(0.8, 1.5, 0.8); }
  for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 2.7, 1, 4), BLM()); const p = f.geometry.attributes.position; for (let k = 0; k < p.count; k++) { const y = p.getY(k) + 1.35; p.setZ(k, -(y * y) * 0.09); } f.geometry.translate(0, 1.3, 0); f.position.y = 2.5; f.rotation.order = 'YXZ'; f.rotation.y = i / 6 * Math.PI * 2 + r() * 0.5; f.rotation.x = -0.55 - r() * 0.5; g.add(f); }
  return g;
}
/* a real-looking bunch of green bananas: a curved stalk with six "hands", each hand two rows of five-sided fingers that leave the stalk
   pointing out and down, then curve up. Built once as a single vertex-coloured mesh and shared by every bunch in the game (about 1.7k triangles).
   Bananas are cut green for the ship, so green is right. The stalk runs from y = 0 (the bud end) to y = 0.72 (the cut end). */
let _bunchGeo, _bunchMat;
function bunchGeometry() {
  if (_bunchGeo) return _bunchGeo;
  const r = rng(11), pos = [], col = [], V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), C = (h) => new THREE.Color(h);
  const tri = (a, b, c, ca, cb, cc) => { pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z); col.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b, cc.r, cc.g, cc.b); };
  const tube = (P, rad, colAt, sides, ref) => {   /* a tube along the points P, its radius and colour set along its length, closed at the far end */
    const rings = P.map((p, i) => { const t = V().subVectors(P[Math.min(i + 1, P.length - 1)], P[Math.max(i - 1, 0)]).normalize(), n = V().crossVectors(t, ref).normalize(), sd = V().crossVectors(n, t).normalize(), k = i / (P.length - 1), q = rad(k), ring = [];
      for (let j = 0; j < sides; j++) { const a = j / sides * Math.PI * 2; ring.push(V().copy(p).addScaledVector(sd, Math.cos(a) * q).addScaledVector(n, Math.sin(a) * q * 0.92)); } return { ring, c: colAt(k), p }; });
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < sides; j++) { const j2 = (j + 1) % sides, A = rings[i], B = rings[i + 1]; tri(A.ring[j], B.ring[j], B.ring[j2], A.c, B.c, B.c); tri(A.ring[j], B.ring[j2], A.ring[j2], A.c, B.c, A.c); }
    const E = rings[rings.length - 1]; for (let j = 0; j < sides; j++) tri(E.p, E.ring[j], E.ring[(j + 1) % sides], E.c, E.c, E.c);
  };
  const lerpC = (a, b, k) => a.clone().lerp(b, k);
  const stalkX = (y) => 0.025 * Math.sin(Math.PI * (y / 0.72));
  /* the stalk: pale cut end at the top, a thin dark tail where the flower was, at the bottom */
  const sp = []; for (let i = 0; i <= 6; i++) { const y = 0.72 - i * 0.12; sp.push(V(stalkX(y), y, 0)); }
  const cut = C(0xd6d39a), stalkC = C(0x7a8440), tail = C(0x3a3522);
  tube(sp, (k) => 0.03 - 0.016 * k, (k) => (k < 0.04 ? cut : lerpC(stalkC, tail, Math.max(0, (k - 0.6) / 0.4))), 6, V(0, 0, 1));
  const HANDS = [[6, 0.27, 0.64], [6, 0.26, 0.555], [5, 0.245, 0.47], [5, 0.23, 0.385], [4, 0.2, 0.3], [3, 0.17, 0.225]];
  const stem = C(0xaabd68), tip = C(0x4a4824);
  HANDS.forEach(([m, len, y0], h) => {
    const az = h * 2.2 + 0.4, sx = stalkX(y0);
    for (let row = 0; row < 2; row++) for (let j = 0; j < m; j++) {
      const a = az + (j - (m - 1) / 2) * 0.27 + (row ? 0.13 : 0), L = len * (row ? 1.0 : 0.88) * (0.92 + r() * 0.16), y = y0 + (row ? -0.024 : 0.014) + (r() - 0.5) * 0.008, u = V(Math.cos(a), 0, Math.sin(a));
      const root = V(sx, y, 0).addScaledVector(u, 0.05), th0 = -0.5 + (r() - 0.5) * 0.12, bend = 1.75 + (r() - 0.5) * 0.3, pts = [root.clone()], p = root.clone();
      for (let k = 1; k <= 3; k++) { const th = th0 + bend * (k - 0.5) / 3; p.addScaledVector(u, Math.cos(th) * L / 3); p.y += Math.sin(th) * L / 3; pts.push(p.clone()); }
      const g1 = lerpC(C(0x7aa63a), C(0x93bb4c), r()).multiplyScalar(0.9 + r() * 0.16);
      tube(pts, (k) => (k < 0.3 ? 0.011 + 0.014 * (k / 0.3) : k < 0.78 ? 0.025 : 0.025 - 0.012 * ((k - 0.78) / 0.22)), (k) => (k < 0.12 ? lerpC(stem, g1, k / 0.12) : k > 0.9 ? lerpC(g1, tip, (k - 0.9) / 0.1) : g1), 5, V(-Math.sin(a), 0, Math.cos(a)));
    }
    const arc = []; for (let i = 0; i <= 3; i++) { const aa = az + (i - 1.5) * 0.32; arc.push(V(sx + Math.cos(aa) * 0.05, y0 - 0.006, Math.sin(aa) * 0.05)); }   /* the cushion the hand grows from */
    tube(arc, () => 0.03, () => C(0x6b7a38), 5, V(0, 1, 0));
  });
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();   /* flat faces: the five ridges of each finger show */
  return (_bunchGeo = geo);
}
export function bananaBunch(scale = 1) {
  _bunchMat = _bunchMat || new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
  const g = grp(), m = new THREE.Mesh(bunchGeometry(), _bunchMat); m.scale.setScalar(scale); g.add(m); return g;
}
export function bush(seed = 1, s = 1) { const r = rng(seed), g = grp(); for (let i = 0; i < 3; i++) mesh(new THREE.IcosahedronGeometry(0.5 * s, 1), flat([0x35703a, 0x4a8a3c, 0x2d6035][i]), (r() - 0.5) * 0.6 * s, 0.35 * s, (r() - 0.5) * 0.6 * s, g); return g; }
export function flowers(seed = 1) { const r = rng(seed), g = grp(); for (let i = 0; i < 7; i++) { const c = [0xe8505b, 0xf5c542, 0xffffff, 0xe27ad8][(r() * 4) | 0]; mesh(new THREE.SphereGeometry(0.07, 6, 5), glow(c), (r() - 0.5) * 0.7, 0.14 + r() * 0.1, (r() - 0.5) * 0.7, g); } mesh(new THREE.SphereGeometry(0.4, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), flat(0x3d7a38), 0, 0, 0, g).scale.y = 0.4; return g; }

/* scatter: place items made by make(i) at random spots, skipping any that fall inside the keep-clear boxes */
export function scatter(parent, make, n, area, clear = [], seed = 5) {
  const r = rng(seed); let placed = 0, tries = 0; const out = [];
  while (placed < n && tries++ < n * 30) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3])) continue; const o = make(placed, r); o.position.set(x, 0, z); o.rotation.y = r() * 6.28; parent.add(o); out.push(o); placed++; }
  return out;
}

/* ---------- hills: a ring of rounded green hills around the play area, built as one coloured mesh each ---------- */
const HILLM = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });
export function hillRing(radius = 150, count = 18, hMax = 60, { seed = 3, base = [0.2, 0.42, 0.22], far = 0 } = {}) {
  const r = rng(seed), g = grp();
  for (let i = 0; i < count; i++) { const a = i / count * Math.PI * 2 + r() * 0.2, w = 60 + r() * 60, h = hMax * (0.45 + r() * 0.55), geo = new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2); const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) { const y = pos.getY(k), v = 0.82 + 0.35 * y + (r() - 0.5) * 0.12; col[k * 3] = base[0] * v; col[k * 3 + 1] = base[1] * v; col[k * 3 + 2] = base[2] * v; pos.setY(k, y * (1 + (r() - 0.5) * 0.15)); }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); const m = new THREE.Mesh(geo, HILLM); m.scale.set(w, h, w * (0.7 + r() * 0.4)); m.position.set(Math.cos(a) * radius, -2, Math.sin(a) * radius); m.rotation.y = r() * 3; g.add(m); }
  return g;
}

/* ---------- houses and sheds ---------- */
const TM2 = solid(0x4a4c50, 0.6, 0.3);
export function boardHouse(w = 5, d = 4, h = 2.8, { wall = [188, 160, 110], roof = [140, 90, 70], porch = true, seed = 1 } = {}) {   /* a Jamaican board house: walls of boards, a zinc roof, a front veranda */
  const g = grp(), r = rng(seed); const wt = T.plank(wall, 8, [w / 2, 1]).clone(); wt.needsUpdate = true; wt.repeat.set(w / 2, 1);
  box(w, h, d, std(wt, 0.9), 0, h / 2, 0, g);
  const zt = T.zinc(roof).clone(); zt.needsUpdate = true; zt.repeat.set(2, d / 2);
  const rise = 1.3, Ls = Math.hypot(d / 2 + 0.4, rise), th = Math.atan2(rise, d / 2 + 0.4);
  for (const s of [-1, 1]) { const p = box(w + 0.7, 0.08, Ls, std(zt, 0.75), 0, h + rise / 2 + 0.04, s * (d / 4 + 0.2), g); p.rotation.x = s * th; }
  for (const s of [-1, 1]) { const gable = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, rise)])), std(wt, 0.9), s * (w / 2 + 0.005), h, 0, g); gable.rotation.y = s * Math.PI / 2; gable.material.side = THREE.DoubleSide; }
  const shut = solid(0x2f6a3f, 0.9); for (const x of [-w * 0.28, w * 0.28]) { box(0.9, 0.9, 0.06, M.woodDark, x, h * 0.62, d / 2 + 0.02, g); box(0.4, 0.8, 0.07, shut, x - 0.62, h * 0.62, d / 2 + 0.04, g); box(0.4, 0.8, 0.07, shut, x + 0.62, h * 0.62, d / 2 + 0.04, g); }
  box(0.9, 1.9, 0.07, solid(0x4a2f1e, 0.9), 0, 0.95, d / 2 + 0.03, g);
  const wf = solid(0xe8e0cc, 0.8); for (const x of [-w * 0.28, w * 0.28]) { box(1.14, 0.06, 0.07, wf, x, h * 0.62 + 0.47, d / 2 + 0.05, g); box(1.14, 0.06, 0.07, wf, x, h * 0.62 - 0.47, d / 2 + 0.05, g); box(1.2, 0.05, 0.14, wf, x, h * 0.62 - 0.52, d / 2 + 0.1, g); for (const s of [-0.54, 0, 0.54]) box(0.05, 0.94, 0.07, wf, x + s, h * 0.62, d / 2 + 0.05, g); }
  box(1.06, 0.06, 0.08, wf, 0, 1.94, d / 2 + 0.05, g); for (const s of [-0.5, 0.5]) box(0.06, 1.9, 0.08, wf, s, 0.95, d / 2 + 0.05, g);
  for (const [x, z] of [[-w / 2 + 0.2, -d / 2 + 0.2], [w / 2 - 0.2, -d / 2 + 0.2], [-w / 2 + 0.2, d / 2 - 0.2], [w / 2 - 0.2, d / 2 - 0.2], [0, d / 2 - 0.2], [0, -d / 2 + 0.2]]) cyl(0.13, 0.16, 0.3, solid(0x9a968a, 1), x, 0.1, z, g, 8);
  box(w + 0.8, 0.1, 0.2, TM2, 0, h + rise + 0.04, 0, g); box(0.5, 0.16, 0.12, wf, 0, h + 0.5, d / 2 + 0.02, g);
  if (porch) { box(1.5, 0.18, 0.5, M.woodDark, 0, 0.09, d / 2 + 1.85, g); box(1.2, 0.18, 0.4, M.woodDark, 0, 0.24, d / 2 + 1.6, g); for (let x = -w / 2 + 0.2; x < w / 2; x += 0.28) box(0.04, 0.22, 0.04, wf, x, 2.44, d / 2 + 1.5, g); }
  if (porch) { box(w + 0.4, 0.14, 1.6, M.woodDark, 0, 0.2, d / 2 + 0.8, g); for (const x of [-w / 2, 0, w / 2]) box(0.12, 2.4, 0.12, M.wood, x, 1.4, d / 2 + 1.5, g); const pz = box(w + 0.6, 0.06, 1.9, std(zt, 0.75), 0, 2.65, d / 2 + 0.9, g); pz.rotation.x = 0.12; }
  return g;
}
export function shed(w = 6, d = 3, h = 2.6, wall = [150, 120, 84]) { return boardHouse(w, d, h, { wall, porch: true }); }

/* ---------- small things ---------- */
/* skin(): a smooth skin over a row of rings, for bodies, legs, necks and handles. Each ring is [x, y, z, w, h, colour, colour underneath]:
   w is the half width sideways and h the half height (for a limb that runs up and down, h is front to back). `ref` is the direction that h follows. Both ends are closed. */
const SKIN = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 });
/* a handle a hand can close round: a bar on two posts (the origin is the middle of the bar) */
function barHandle(parent, y, len, m, across = false, drop = 0.1) { const g = grp(parent, 0, y, 0); const b = cyl(0.0125, 0.0125, len, m, 0, 0, 0, g, 8); b.rotation.z = Math.PI / 2; for (const s of [-1, 1]) cyl(0.009, 0.009, drop, m, s * (len / 2 - 0.006), -drop / 2, 0, g, 6); if (across) g.rotation.y = Math.PI / 2; return g; }
/* a bail: a wire hoop over the top, from one side of a rim to the other, with a grip in the middle. r is the rim's radius, top the height of the grip above the rim. */
function bail(parent, y, r, top, m, grip) { const g = grp(parent, 0, y, 0), t = mesh(new THREE.TorusGeometry(1, 0.011 / r, 5, 14, Math.PI), m, 0, 0, 0, g); t.scale.set(r, top, r); if (grip) { const k = cyl(0.016, 0.016, 0.1, grip, 0, top, 0, g, 8); k.rotation.z = Math.PI / 2; } return g; }

export function crate(s = 0.6, c = 0x8a6a42) {   /* a slatted crate: boards with gaps, and a batten at each corner */
  const g = grp(), m = solid(c, 0.95), dk = solid(0x5a4228, 0.95), h = s * 0.8; box(s * 0.94, h * 0.94, s * 0.94, dk, 0, h / 2, 0, g);
  for (let i = 0; i < 3; i++) { const y = h * (0.17 + i * 0.33); for (const sg of [-1, 1]) { box(s, h * 0.27, 0.02, m, 0, y, sg * s / 2, g); box(0.02, h * 0.27, s, m, sg * s / 2, y, 0, g); } }
  for (const x of [-1, 1]) for (const z of [-1, 1]) box(0.05, h, 0.05, m, x * (s / 2 - 0.01), h / 2, z * (s / 2 - 0.01), g); box(s, 0.02, s, m, 0, h, 0, g); return g;
}
export function sack(c = 0xb09a6a) { const g = grp(), m = solid(c, 1); cyl(0.2, 0.25, 0.46, m, 0, 0.23, 0, g, 10); mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), m, 0, 0.46, 0, g).scale.y = 0.7; cyl(0.04, 0.12, 0.14, solid(0x8a7648, 1), 0, 0.66, 0, g, 8); mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 10), solid(0x5a4228, 1), 0, 0.6, 0, g).rotation.x = Math.PI / 2; return g; }   /* a sack: a body, a rounded top, a tied neck */
/* a picnic hamper: a woven basket wider than it is deep, a flat woven lid with a strap, and a bail handle over the top. Its handle is 0.52 above the ground. */
export function hamper(c = 0xa8803c) {
  const g = grp(), wv = std(T.weave([3, 1]), 0.95, { color: new THREE.Color(c).multiplyScalar(1.5) }), rim = solid(new THREE.Color(c).multiplyScalar(0.7).getHex(), 1), b = cyl(0.3, 0.26, 0.3, wv, 0, 0.15, 0, g, 14); b.scale.z = 0.72;
  const r1 = mesh(new THREE.TorusGeometry(0.3, 0.016, 5, 16), rim, 0, 0.3, 0, g); r1.rotation.x = Math.PI / 2; r1.scale.y = 0.72; const lid = cyl(0.3, 0.305, 0.05, wv, 0, 0.325, 0, g, 14); lid.scale.z = 0.72; box(0.04, 0.012, 0.44, solid(0x5a3a22, 0.9), 0, 0.354, 0, g);
  bail(g, 0.3, 0.3, 0.22, rim, solid(0x5a3a22, 0.9)); g.userData.handleY = 0.52; return g;
}
/* a suitcase of the 1950s: a box with a lid seam, leather corners, two straps and clasps, and a bar handle on top. Its handle is 0.5 above the ground. */
export function suitcase(c = 0x6b4a30) {
  const g = grp(), m = solid(c, 0.75), dk = solid(new THREE.Color(c).multiplyScalar(0.55).getHex(), 0.8), W = 0.62, Hh = 0.4, D = 0.19; box(W, Hh, D, m, 0, Hh / 2, 0, g); box(W + 0.006, 0.012, D + 0.006, dk, 0, Hh * 0.72, 0, g);
  for (const x of [-0.17, 0.17]) { box(0.035, Hh + 0.006, D + 0.008, dk, x, Hh / 2, 0, g); box(0.03, 0.035, 0.01, M.steel, x, Hh * 0.72, D / 2 + 0.006, g); }
  for (const x of [-1, 1]) for (const y of [0, 1]) for (const z of [-1, 1]) box(0.05, 0.05, 0.05, dk, x * (W / 2 - 0.02), 0.022 + y * (Hh - 0.044), z * (D / 2 - 0.02), g);
  barHandle(g, 0.5, 0.15, dk); g.userData.handleY = 0.5; return g;
}
/* a tin bucket: sides that open upward, a rolled rim, an ear each side and a wire bail that stands up, with a wooden grip. Its handle is 0.49 above the ground. */
export function bucket(c = 0x9aa09a) {
  const g = grp(), m = solid(c, 0.4, 0.5, { side: THREE.DoubleSide }); mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 14, 1, true), m, 0, 0.15, 0, g); cyl(0.15, 0.15, 0.012, solid(c, 0.4, 0.5), 0, 0.006, 0, g, 14);
  const rim = mesh(new THREE.TorusGeometry(0.2, 0.01, 5, 16), solid(c, 0.4, 0.5), 0, 0.3, 0, g); rim.rotation.x = Math.PI / 2; const wl = mesh(new THREE.CircleGeometry(0.19, 14), solid(0x4a6a78, 0.2, 0.1), 0, 0.25, 0, g); wl.rotation.x = -Math.PI / 2;   /* water near the top */
  for (const s of [-1, 1]) box(0.012, 0.05, 0.04, M.iron, s * 0.205, 0.28, 0, g); bail(g, 0.29, 0.205, 0.2, M.iron, M.wood); g.userData.handleY = 0.49; return g;
}
/* a hurricane lamp: a tank for the oil, a burner, a glass globe in a wire guard, a cap with a chimney, two side tubes and a wire bail to carry it by.
   Its handle is 0.32 above the ground. userData.flame is the glow. */
export function lantern() {
  const o = grp(), g = grp(o); g.scale.setScalar(0.8); cyl(0.075, 0.085, 0.05, M.tin, 0, 0.025, 0, g, 10); cyl(0.04, 0.07, 0.03, M.tin, 0, 0.065, 0, g, 10); cyl(0.045, 0.045, 0.02, M.iron, 0, 0.09, 0, g, 8);
  const gl = mesh(new THREE.SphereGeometry(0.058, 10, 8), M.lanternGlass, 0, 0.16, 0, g); gl.scale.y = 1.25; cyl(0.03, 0.05, 0.03, M.tin, 0, 0.235, 0, g, 8); cyl(0.022, 0.03, 0.04, M.tin, 0, 0.27, 0, g, 8); cyl(0.04, 0.04, 0.008, M.tin, 0, 0.292, 0, g, 8);
  for (const s of [-1, 1]) { cyl(0.008, 0.008, 0.22, M.tin, s * 0.075, 0.16, 0, g, 5); box(0.05, 0.012, 0.012, M.tin, s * 0.052, 0.262, 0, g); }   /* the side tubes */
  for (const y of [0.13, 0.19]) { const w = mesh(new THREE.TorusGeometry(0.066, 0.003, 4, 12), M.iron, 0, y, 0, g); w.rotation.x = Math.PI / 2; }
  bail(g, 0.27, 0.078, 0.13, M.iron); o.userData.handleY = 0.32;
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flame.scale.set(0.5, 0.5, 1); flame.position.y = 0.14; o.add(flame); o.userData.flame = flame; return o;
}
export function torch() { const g = grp(); cyl(0.03, 0.04, 1.1, M.woodDark, 0, 0.55, 0, g, 6); mesh(new THREE.SphereGeometry(0.06, 8, 6), solid(0x2a1c12, 1), 0, 1.12, 0, g).scale.y = 1.5; const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); f.scale.set(0.9, 1.1, 1); f.position.y = 1.2; g.add(f); g.userData.flame = f; return g; }
/* a bench: three seat slats and two back slats on iron ends with arm rests. The seat top is 0.485 high and the back is at z = -0.24 (seated people rely on both). */
export function bench(L = 2, c = 0x6b4a30) {
  const g = grp(), m = solid(c, 0.95); for (const z of [-0.17, 0, 0.17]) box(L, 0.07, 0.15, m, 0, 0.45, z, g); for (const y of [0.64, 0.86]) box(L, 0.17, 0.045, m, 0, y, -0.245, g);
  for (const x of [-L / 2 + 0.1, L / 2 - 0.1]) { box(0.06, 0.42, 0.06, M.iron, x, 0.21, 0.19, g); box(0.06, 0.96, 0.06, M.iron, x, 0.48, -0.25, g); box(0.06, 0.05, 0.5, M.iron, x, 0.4, -0.02, g); box(0.06, 0.05, 0.48, M.iron, x, 0.66, 0.0, g); box(0.06, 0.24, 0.05, M.iron, x, 0.54, 0.2, g); }
  return g;
}
export function pole(h = 7) { const g = grp(); cyl(0.09, 0.12, h, M.woodDark, 0, h / 2, 0, g, 6); box(1.6, 0.08, 0.08, M.woodDark, 0, h - 0.4, 0, g); for (const x of [-0.7, -0.25, 0.25, 0.7]) cyl(0.03, 0.03, 0.16, solid(0xc9d6d0, 0.4), x, h - 0.3, 0, g, 6); return g; }
export function lampPost(h = 3.6, lit = true) { const g = grp(); cyl(0.06, 0.09, h, M.iron, 0, h / 2, 0, g, 8); box(0.34, 0.34, 0.34, lit ? M.lanternGlass : M.iron, 0, h + 0.1, 0, g); box(0.46, 0.06, 0.46, M.iron, 0, h + 0.32, 0, g); return g; }
export function signBoard(text, w = 2.2, h = 0.6, opts = {}) { const g = grp(); const tx = T.sign(text, 512, Math.round(512 * h / w), opts.bg, opts.fg, opts.font); plane(w, h, std(tx, 0.8), 0, 0, 0.04, g); plane(w, h, std(tx, 0.8), 0, 0, -0.04, g).rotation.y = Math.PI; box(w + 0.1, h + 0.1, 0.06, M.woodDark, 0, 0, 0, g); return g; }
export function milestone(text) { const g = grp(); const m = mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.9, 3), solid(0xcfc9b6, 0.9), 0, 0.45, 0, g); m.rotation.y = 0.3; plane(0.5, 0.5, std(T.sign(text, 256, 256, '#cfc9b6', '#2a2a2a', '700 54px Georgia, serif', false), 0.9), 0, 0.5, 0.2, g); return g; }
export function standpipe() { const g = grp(); cyl(0.1, 0.12, 1.1, M.iron, 0, 0.55, 0, g, 8); box(0.3, 0.1, 0.1, M.iron, 0.12, 1.0, 0, g); cyl(0.04, 0.04, 0.3, M.iron, 0.26, 0.9, 0, g, 6); box(0.7, 0.14, 0.7, solid(0x888274, 0.9), 0, 0.07, 0, g); return g; }
export function waterTower() { const g = grp(); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = cyl(0.08, 0.1, 5, M.woodDark, x, 2.5, z, g, 6); l.rotation.set(z * 0.04, 0, -x * 0.04); } cyl(1.6, 1.6, 2.2, solid(0x7a5a3c, 0.9), 0, 5.4, 0, g, 18); cyl(0.0, 1.7, 0.7, solid(0x3d3d3a, 0.8), 0, 6.85, 0, g, 18); box(0.18, 3.4, 0.18, M.iron, 1.4, 3.4, 0, g); const sp = box(0.2, 0.2, 2.2, M.iron, 1.4, 4.8, 1.1, g); return g; }
export function barrel() { const g = grp(); cyl(0.3, 0.3, 0.8, solid(0x7a5a3c, 0.9), 0, 0.4, 0, g, 12); for (const y of [0.15, 0.65]) cyl(0.315, 0.315, 0.04, M.iron, 0, y, 0, g, 12); return g; }

const PI2 = Math.PI / 2;
/* things to load: a basket of yams, a sack of provisions, a bunch of bananas bound with rope */
export function yamBasket() { const g = grp(); cyl(0.26, 0.2, 0.34, std(T.weave([3, 1]), 0.95), 0, 0.17, 0, g, 14); for (let i = 0; i < 7; i++) { const y = mesh(new THREE.SphereGeometry(0.1, 8, 6), solid([0x8a5a30, 0x9a6a3a, 0x7a4a28][i % 3], 1), Math.cos(i * 1.1) * 0.12, 0.4 + (i > 4 ? 0.07 : 0), Math.sin(i * 1.1) * 0.12, g); y.scale.set(1.5, 0.8, 0.9); y.rotation.y = i; } return g; }
export function provisionSack() { const g = grp(); const b = mesh(new THREE.SphereGeometry(0.28, 12, 9), solid(0xc2ad78, 1), 0, 0.28, 0, g); b.scale.set(1, 1.15, 0.85); const neck = cyl(0.07, 0.1, 0.1, solid(0xa89258, 1), 0, 0.6, 0, g, 8); mesh(new THREE.TorusGeometry(0.075, 0.014, 5, 10), solid(0x6a4a28, 1), 0, 0.58, 0, g).rotation.x = PI2; return g; }
export function bananaLoad() {   /* three bunches lying across the mule's back, tied round with rope */
  const g = grp(); [[-0.13, 0.17], [0.13, 0.17], [0, 0.36]].forEach(([x, y], i) => { const b = bananaBunch(0.66); b.rotation.order = 'ZXY'; b.rotation.set(PI2, i * 1.5, 0); b.position.set(x, y, -0.22); g.add(b); });
  const rope = mesh(new THREE.TorusGeometry(0.26, 0.012, 5, 18), solid(0xb8a070, 1), 0, 0.2, 0.0, g); rope.scale.y = 0.85; return g; }
/* a wide round market basket for carrying on the head, heaped with produce and covered at one side by a cloth. Its origin is the middle of its bottom. */
export function marketBasket(c = 0xb08a48) {
  const g = grp(), wv = std(T.weave([4, 1]), 0.95, { color: new THREE.Color(c).multiplyScalar(1.5) }); cyl(0.3, 0.2, 0.17, wv, 0, 0.085, 0, g, 16); const rim = mesh(new THREE.TorusGeometry(0.3, 0.018, 5, 18), solid(0x7a5a2a, 1), 0, 0.17, 0, g); rim.rotation.x = Math.PI / 2;
  const heap = mesh(new THREE.SphereGeometry(0.27, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), solid(0x6a8a3a, 1), 0, 0.15, 0, g); heap.scale.y = 0.35;
  [[0.1, 0.05, 0xe0a030], [-0.08, 0.1, 0xd8662a], [0.0, -0.12, 0xe8c040], [-0.14, -0.05, 0x8ab040], [0.15, -0.08, 0xd8662a], [0.03, 0.15, 0x8ab040]].forEach(([x, z, col], i) => mesh(new THREE.SphereGeometry(0.06, 8, 6), solid(col, 0.8), x, 0.23 + (i % 2) * 0.012, z, g));
  return g;
}

/* ---------- a mule (Mass Dudley's Bess) with a pack saddle, two panniers and a halter. She faces +x. Her body, neck, head, legs, ears and tail are smooth skins
   (see skin() above) coloured like a bay mule: a dark brown coat, a pale belly, a pale muzzle and rings round the eyes, dark legs, mane and tail.
   userData.slots are the three places a load goes (in each pannier, and on top between the cross pieces); userData.dip (0 to 1) is how loaded she is;
   userData.tick(t) breathes, nods, flicks an ear, swishes the tail and sometimes paws the ground. ---------- */
export function mule(c = 0x6a5644) {
  const g = grp(), C = new THREE.Color(c), hx = (k) => C.clone().multiplyScalar(k).getHex(), coat = hx(1), coatD = hx(0.78), bellyC = 0xa8947a, leg = hx(0.42), hoofC = 0x1c1714, muz = 0xc4b49c, mane = 0x241c16;
  const dk = solid(0x2d241d, 1), leather = solid(0x4a3020, 0.9), cloth = solid(0x9a3a2a, 1), wood = solid(0x7a5a3c, 0.95), rope = solid(0xb8a070, 1), eyeM = solid(0x0a0806, 0.25), part = (geo, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, SKIN); m.position.set(x, y, z); parent.add(m); return m; };
  /* the barrel: rump, flank, belly, shoulder, chest. The back dips a little behind the withers. */
  const torso = part(skin([
    [-0.8, 1.13, 0, 0.04, 0.06, coatD], [-0.68, 1.07, 0, 0.25, 0.28, coat],
    [-0.42, 1.04, 0, 0.3, 0.31, coat, bellyC], [-0.15, 1.01, 0, 0.315, 0.32, coat, bellyC],
    [0.12, 1.0, 0, 0.32, 0.325, coat, bellyC], [0.34, 1.03, 0, 0.3, 0.31, coat, bellyC],
    [0.5, 1.1, 0, 0.255, 0.29, coat], [0.61, 1.3, 0, 0.16, 0.21, coat],
    [0.73, 1.47, 0, 0.125, 0.17, coat], [0.85, 1.6, 0, 0.105, 0.135, coat],
    [0.93, 1.69, 0, 0.08, 0.1, coat]
  ], 20), g);
  /* A short upright mane follows the neck's crest. */
  part(skin([[0.4, 1.38, 0, 0.012, 0.03, mane], [0.48, 1.45, 0, 0.016, 0.055, mane], [0.61, 1.59, 0, 0.016, 0.06, mane], [0.75, 1.705, 0, 0.016, 0.055, mane], [0.86, 1.77, 0, 0.012, 0.035, mane]], 6, [-0.7, 0.7, 0]), g);
  /* the head: a long face from the poll down to a pale muzzle; it nods about the poll */
  const head = grp(g, 0.93, 1.69, 0);
  part(skin([[-0.07, 0.03, 0, 0.06, 0.07, coat], [-0.01, 0.0, 0, 0.095, 0.105, coat], [0.09, -0.07, 0, 0.105, 0.125, coat, coatD], [0.2, -0.17, 0, 0.09, 0.105, coat], [0.31, -0.27, 0, 0.07, 0.082, coatD, muz], [0.4, -0.35, 0, 0.062, 0.07, muz], [0.455, -0.4, 0, 0.058, 0.064, muz], [0.49, -0.43, 0, 0.035, 0.04, 0x8a7a68]], 12, [0.66, 0.75, 0]), head);
  for (const s of [-1, 1]) { const ring = mesh(new THREE.SphereGeometry(0.03, 8, 6), solid(0x8f7d66, 1), 0.105, -0.035, s * 0.088, head); ring.scale.set(1.25, 0.95, 0.45); const ey = mesh(new THREE.SphereGeometry(0.02, 8, 6), eyeM, 0.108, -0.036, s * 0.09, head); ey.scale.set(1.15, 0.9, 0.6); mesh(new THREE.SphereGeometry(0.014, 6, 5), dk, 0.47, -0.395, s * 0.03, head); }
  const ears = []; for (const s of [-1, 1]) { const e = grp(head, -0.03, 0.08, s * 0.065); part(skin([[0, 0, 0, 0.03, 0.022, coat], [-0.01, 0.08, 0, 0.045, 0.02, coat, mane], [-0.02, 0.19, 0, 0.04, 0.016, coat, mane], [-0.03, 0.27, 0, 0.024, 0.012, coatD], [-0.035, 0.31, 0, 0.008, 0.006, mane]], 8, [1, 0, 0]), e); e.rotation.set(s * 0.32, 0, 0.25); ears.push(e); }
  /* the halter: a noseband, a strap behind the ears, a cheek strap each side, and the lead rope hanging from under the chin */
  const nb = mesh(new THREE.TorusGeometry(0.083, 0.011, 5, 16), leather, 0.3, -0.262, 0, head); nb.rotation.set(0, Math.PI / 2, 0); nb.rotation.z = -0.84; nb.rotation.order = 'ZYX';
  const hs = mesh(new THREE.TorusGeometry(0.1, 0.01, 5, 14, Math.PI), leather, -0.035, -0.02, 0, head); hs.rotation.order = 'ZYX'; hs.rotation.set(0, Math.PI / 2, 0.25);
  for (const s of [-1, 1]) { const ck = box(0.37, 0.018, 0.012, leather, 0.135, -0.14, s * 0.097, head); ck.rotation.z = -0.76; ck.rotation.y = s * 0.07; }
  const lead = grp(head, 0.3, -0.345, 0); cyl(0.011, 0.011, 0.55, rope, 0, -0.28, 0, lead, 5); mesh(new THREE.TorusGeometry(0.02, 0.006, 4, 8), M.steel, 0, 0, 0, lead);   /* the lead rope hangs straight down however she holds her head */
  /* the legs: the front ones have a knee, the back ones a hock that points backward; each ends in a fetlock and a dark hoof */
  const legs = [];
  for (const s of [-1, 1]) { const lg = grp(g, 0.5, 0.86, s * 0.16); part(skin([[0, 0.14, 0, 0.085, 0.12, coat], [0, -0.08, 0, 0.075, 0.095, coat], [0.0, -0.3, 0, 0.052, 0.06, coatD], [0.005, -0.4, 0, 0.05, 0.056, leg], [0.008, -0.45, 0, 0.052, 0.058, leg], [0.004, -0.5, 0, 0.037, 0.042, leg], [0, -0.68, 0, 0.034, 0.039, leg], [0.0, -0.735, 0, 0.044, 0.05, leg], [0.02, -0.79, 0, 0.04, 0.045, leg], [0.026, -0.8, 0, 0.05, 0.055, hoofC], [0.04, -0.855, 0, 0.056, 0.066, hoofC]], 8, [1, 0, 0]), lg); legs.push(lg); }
  for (const s of [-1, 1]) { const lg = grp(g, -0.56, 0.9, s * 0.17); part(skin([[0.03, 0.14, 0, 0.1, 0.18, coat], [0.02, -0.06, 0, 0.09, 0.15, coat], [-0.01, -0.26, 0, 0.062, 0.09, coatD], [-0.07, -0.42, 0, 0.048, 0.064, leg], [-0.085, -0.47, 0, 0.046, 0.06, leg], [-0.075, -0.54, 0, 0.036, 0.044, leg], [-0.06, -0.73, 0, 0.034, 0.04, leg], [-0.055, -0.78, 0, 0.044, 0.05, leg], [-0.03, -0.835, 0, 0.04, 0.045, leg], [-0.024, -0.845, 0, 0.05, 0.055, hoofC], [-0.01, -0.895, 0, 0.056, 0.066, hoofC]], 8, [1, 0, 0]), lg); legs.push(lg); }
  /* the tail: thin at the dock, a dark tuft below */
  const tail = grp(g, -0.79, 1.15, 0); part(skin([[0.02, 0.02, 0, 0.03, 0.03, coatD], [-0.05, -0.08, 0, 0.026, 0.026, coatD], [-0.08, -0.3, 0, 0.024, 0.024, mane], [-0.09, -0.5, 0, 0.045, 0.04, mane], [-0.09, -0.72, 0, 0.05, 0.045, mane], [-0.085, -0.88, 0, 0.012, 0.012, mane]], 7, [1, 0, 0]), tail);
  /* the pack saddle: a blanket and a pad that follow her back, two crossed wooden frames joined by side bars, a girth, a breast strap and a strap behind */
  const pack = grp(g, 0, 0, 0);
  const shell = (r, len, arc, m, x, y, sy = 1) => { const ge = new THREE.CylinderGeometry(r, r, len, 14, 1, true, Math.PI / 2 - arc, arc * 2); ge.rotateZ(Math.PI / 2); ge.rotateX(Math.PI / 2); const o = mesh(ge, m, x, y, 0, pack); o.scale.set(1, sy, 0.96); return o; };
  const blanket = solid(0x9a3a2a, 1, 0, { side: THREE.DoubleSide }), pad = solid(0xb8a070, 1, 0, { side: THREE.DoubleSide }); shell(0.335, 0.84, 1.25, blanket, -0.02, 1.01); shell(0.348, 0.62, 0.95, pad, -0.02, 1.01);
  for (const x of [-0.27, 0.23]) { for (const s of [-1, 1]) { const bk = box(0.05, 0.46, 0.045, wood, x, 1.44, s * 0.06, pack); bk.rotation.x = -s * 0.62; } }
  for (const s of [-1, 1]) { box(0.6, 0.035, 0.09, wood, -0.02, 1.3, s * 0.2, pack).rotation.x = -s * 0.62; }
  const girth = mesh(new THREE.TorusGeometry(0.34, 0.013, 5, 22), leather, 0.06, 1.0, 0, pack); girth.rotation.y = PI2; girth.scale.set(1.0, 1.0, 1);
  const strap = (points) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), 28, 0.014, 6, false), leather, 0, 0, 0, pack);
  strap([[0.12,1.13,-0.32],[0.43,1.13,-0.29],[0.65,1.23,-0.15],[0.77,1.2,0],[0.65,1.23,0.15],[0.43,1.13,0.29],[0.12,1.13,0.32]]);
  strap([[0.12,1.13,-0.32],[-0.45,1.1,-0.3],[-0.7,1.08,-0.18],[-0.78,1.1,0],[-0.7,1.08,0.18],[-0.45,1.1,0.3],[0.12,1.13,0.32]]);
  /* two woven panniers, each hung from both cross pieces by rope and held off her side by the pad */
  const wv = std(T.weave([3, 1]), 0.95), dark = solid(0x3a2a16, 1);
  for (const s of [-1, 1]) { const z = s * 0.58; mesh(new THREE.CylinderGeometry(0.23, 0.18, 0.44, 14, 1, false), wv, -0.02, 0.98, z, pack); const rim = mesh(new THREE.TorusGeometry(0.23, 0.02, 5, 16), solid(0x8a6428, 1), -0.02, 1.2, z, pack); rim.rotation.x = PI2; const ins = mesh(new THREE.CircleGeometry(0.22, 14), dark, -0.02, 1.185, z, pack); ins.rotation.x = -PI2;
    for (const x of [-0.27, 0.23]) { const top = new THREE.Vector3(x, 1.58, -s * 0.1), bot = new THREE.Vector3(x < 0 ? -0.2 : 0.16, 1.2, s * 0.43), d = new THREE.Vector3().subVectors(top, bot), rp = cyl(0.009, 0.009, d.length(), rope, (top.x + bot.x) / 2, (top.y + bot.y) / 2, (top.z + bot.z) / 2, pack, 5); rp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); } }
  g.userData.slots = [[-0.02, 1.0, -0.58], [-0.02, 1.0, 0.58], [-0.02, 1.46, 0]];   /* where the three loads go: in each pannier, and on top between the cross pieces */
  g.userData.dip = 0;
  g.userData.tick = (t) => { const k = Math.sin(t * 1.6) * 0.012, dip = g.userData.dip; torso.scale.set(1, 1 + k, 1 + k * 1.5); torso.position.y = -1.03 * k; head.rotation.z = Math.sin(t * 1.1) * 0.05 - 0.04 - dip * 0.22; lead.rotation.z = -head.rotation.z;
    const fl = Math.sin(t * 0.7) > 0.93 ? Math.sin(t * 40) * 0.3 : 0; ears[0].rotation.z = 0.25 + fl - dip * 0.15; ears[1].rotation.z = 0.25 - dip * 0.15 + (Math.sin(t * 0.43 + 2) > 0.95 ? Math.sin(t * 36) * 0.25 : 0);
    tail.rotation.x = Math.sin(t * 2.2) * 0.22; tail.rotation.z = Math.sin(t * 1.3) * 0.08 + 0.05; legs[0].rotation.z = Math.sin(t * 0.35) > 0.96 ? Math.abs(Math.sin(t * 7)) * 0.3 : 0; };
  return g;
}
export function loadedMule() { return mule(); }
/* a spoked cart wheel in the x-y plane: a wooden rim with an iron tyre, a hub and spokes */
function cartWheel(r = 0.62, n = 10) {
  const g = grp(); const rim = mesh(new THREE.TorusGeometry(r - 0.04, 0.04, 6, 22), M.wood, 0, 0, 0, g); rim.scale.z = 0.8; const ty = mesh(new THREE.TorusGeometry(r, 0.014, 4, 22), M.iron, 0, 0, 0, g); ty.scale.z = 2.6;
  cyl(0.08, 0.08, 0.2, M.woodDark, 0, 0, 0, g, 10).rotation.x = Math.PI / 2; cyl(0.03, 0.03, 0.26, M.iron, 0, 0, 0, g, 6).rotation.x = Math.PI / 2;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, sp = box(r - 0.1, 0.045, 0.035, M.wood, Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, 0, g); sp.rotation.z = a; } return g;
}
/* a two-wheeled country cart: a boarded bed with side rails on stakes, an axle, two shafts for the mule and a prop leg so it stands level when nobody pulls it */
export function cart(L = 2.6, W = 1.4) {
  const g = grp(), pl = std(T.plank([122, 90, 60], 5, [1, 1], true), 0.95); box(L, 0.08, W, pl, 0, 0.72, 0, g);
  for (const s of [-1, 1]) { box(L, 0.06, 0.08, M.woodDark, 0, 0.66, s * (W / 2 - 0.2), g); for (const y of [0.9, 1.08]) box(L, 0.1, 0.035, M.wood, 0, y, s * (W / 2 - 0.02), g); for (let x = -L / 2 + 0.1; x <= L / 2; x += (L - 0.2) / 3) box(0.06, 0.44, 0.05, M.woodDark, x, 0.95, s * (W / 2 + 0.01), g); }
  for (const y of [0.9, 1.08]) box(0.035, 0.1, W, M.wood, -L / 2 + 0.02, y, 0, g);
  for (const s of [-1, 1]) { const w = cartWheel(); w.position.set(-0.2, 0.63, s * (W / 2 + 0.14)); g.add(w); }
  cyl(0.035, 0.035, W + 0.36, M.iron, -0.2, 0.63, 0, g, 8).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) { const sh = box(2.3, 0.06, 0.06, M.wood, L / 2 + 1.05, 0.72, s * 0.42, g); cyl(0.03, 0.03, 0.72, M.woodDark, L / 2 - 0.1, 0.36, s * 0.42, g, 6); }   /* the shafts, and a prop leg under the front of the bed on each side */
  return g;
}
export function surveyPole(c = 0xc03a2a) { const g = grp(); for (let i = 0; i < 6; i++) cyl(0.035, 0.035, 0.34, i % 2 ? M.white : solid(c, 0.8), 0, 0.17 + i * 0.34, 0, g, 6); return g; }


/* ---------- a country truck of the early 1950s, for the road above the crash site: a rounded bonnet, a cab with a split windscreen, mudguards,
   round head lamps and a wooden stake bed. It faces +x. A general picture of trucks of that time, not a copy of one make. ---------- */
export function truck(c = 0x2f5f6a) {
  const g = grp(), m = solid(c, 0.5, 0.25), dk = solid(0x17181a, 0.8), glassM = new THREE.MeshBasicMaterial({ color: 0x1a2630 }), chrome = solid(0xb8bcc0, 0.3, 0.8), pl = std(T.plank([118, 88, 60], 5, [1, 1], true), 0.95);
  box(4.6, 0.16, 0.9, dk, -0.1, 0.62, 0, g);   /* the chassis */
  /* the bonnet: a rounded top over the engine, a grille, a bumper */
  box(1.15, 0.5, 1.2, m, 1.55, 1.0, 0, g); const arch = (r, len, alongX) => { const ge = alongX ? new THREE.CylinderGeometry(r, r, len, 14, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(r, r, len, 14, 1, false, Math.PI / 2, Math.PI); if (alongX) ge.rotateZ(Math.PI / 2); else ge.rotateX(Math.PI / 2); return ge; };   /* half a drum, round side up */
  mesh(arch(0.6, 1.15, true), m, 1.55, 1.24, 0, g).scale.y = 0.5;
  box(0.05, 0.56, 0.8, dk, 2.13, 1.02, 0, g); for (let i = 0; i < 6; i++) box(0.03, 0.5, 0.03, chrome, 2.16, 1.02, -0.3 + i * 0.12, g); box(0.1, 0.12, 1.9, chrome, 2.3, 0.62, 0, g); for (const z of [-0.4, 0.4]) box(0.2, 0.08, 0.06, dk, 2.2, 0.62, z, g);
  for (const s of [-1, 1]) {   /* front mudguards with the head lamps on them */
    mesh(arch(0.54, 0.34, false), m, 1.5, 0.5, s * 0.82, g).scale.y = 0.95; box(0.5, 0.04, 0.34, m, 0.82, 0.56, s * 0.82, g).rotation.z = 0.2;
    const hl = cyl(0.11, 0.09, 0.14, chrome, 1.98, 1.02, s * 0.74, g, 12); hl.rotation.z = -Math.PI / 2; const ln = cyl(0.095, 0.095, 0.02, M.lanternGlass, 2.06, 1.02, s * 0.74, g, 12); ln.rotation.z = Math.PI / 2; box(0.06, 0.2, 0.06, m, 1.95, 0.9, s * 0.74, g);
  }
  /* the cab: doors, a split windscreen, side windows, a rounded roof */
  box(1.15, 0.75, 1.75, m, 0.42, 1.08, 0, g); box(1.0, 0.62, 1.7, m, 0.38, 1.76, 0, g); mesh(arch(0.87, 1.04, true), m, 0.38, 2.06, 0, g).scale.y = 0.16;
  for (const z of [-0.41, 0.41]) box(0.02, 0.44, 0.74, glassM, 0.89, 1.76, z, g); box(0.03, 0.5, 0.05, m, 0.895, 1.76, 0, g);
  for (const s of [-1, 1]) { box(0.6, 0.42, 0.02, glassM, 0.42, 1.77, s * 0.855, g); box(0.1, 0.03, 0.03, chrome, 0.05, 1.28, s * 0.885, g); box(0.5, 0.05, 0.3, dk, 0.42, 0.6, s * 0.95, g); }
  box(0.02, 0.36, 0.9, glassM, -0.125, 1.8, 0, g);
  /* the bed: a boarded floor on cross beams, stake sides, a tail board */
  box(2.7, 0.08, 1.9, pl, -1.55, 0.98, 0, g); for (const x of [-2.6, -1.55, -0.5]) box(0.1, 0.16, 1.8, dk, x, 0.86, 0, g);
  for (const s of [-1, 1]) { for (const y of [1.2, 1.46, 1.72]) box(2.7, 0.16, 0.035, pl, -1.55, y, s * 0.93, g); for (const x of [-2.8, -1.95, -1.1, -0.28]) box(0.07, 0.9, 0.05, dk, x, 1.44, s * 0.96, g); }
  for (const y of [1.2, 1.46, 1.72]) { box(0.035, 0.16, 1.9, pl, -0.22, y, 0, g); } for (const y of [1.2, 1.46]) box(0.035, 0.16, 1.9, pl, -2.88, y, 0, g);
  /* wheels with pale hubs; two at the front, two at the back; rear mudflaps and a red tail lamp */
  for (const [x, z] of [[1.5, -0.84], [1.5, 0.84], [-1.75, -0.8], [-1.75, 0.8]]) { const w = cyl(0.42, 0.42, 0.26, M.black, x, 0.42, z, g, 14); w.rotation.x = Math.PI / 2; const hb = cyl(0.2, 0.2, 0.28, solid(0x8a8c88, 0.5, 0.4), x, 0.42, z, g, 10); hb.rotation.x = Math.PI / 2; }
  for (const s of [-1, 1]) box(0.03, 0.34, 0.3, dk, -2.3, 0.72, s * 0.8, g); box(0.04, 0.08, 0.1, new THREE.MeshBasicMaterial({ color: 0xc8261e }), -2.9, 0.86, -0.7, g);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); beam.rotation.z = -Math.PI / 2; beam.position.set(6.6, 1.0, 0); g.add(beam);
  return g;
}

/* ---------- a stretcher: a door or board with a blanket, carried by two people (no one lies on it, and nothing is shown) ---------- */
export function board(len = 1.9) { const g = grp(); box(len, 0.06, 0.62, M.wood, 0, 0.9, 0, g); box(len * 0.8, 0.05, 0.5, solid(0xb86a3c, 1), 0, 0.96, 0, g); return g; }

/* ---------- people's accessories: props held or worn, parented to a character's bones ---------- */
export function attach(model, boneName, obj, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1) {   /* pos in metres, in the bone's own directions; scale is the size you want in the world */
  const b = model.getObjectByName('mixamorig' + boneName); if (!b) return null; model.updateMatrixWorld(true);
  const sw = new THREE.Vector3(); b.getWorldScale(sw); const k = sw.x || 1; const wrap = new THREE.Group();
  wrap.position.set(pos[0] / k, pos[1] / k, pos[2] / k); wrap.rotation.set(...rot); wrap.scale.setScalar(scale / k); wrap.add(obj); b.add(wrap); return wrap;
}

/* hold(): carry an item in a hand (or on the head) so it hangs upright whatever the body's own hand axes are.
   The character must already be posed (its mixer updated once). The item's origin is its bottom centre; handleY is the height of its handle above that origin.
   For a hand: the handle goes at the hand, pushed `out` metres away from the body so the item clears the hip and thigh. For the head: the item rests `dy` above the head bone.
   (engine/audit.js, auditHeld, checks the result: at the hand, upright, clear of the body.) */
export function hold(model, boneName, obj, { handleY = 0.4, scale = 1, out = 0.14, dy = null, yaw = 0 } = {}) {
  const bone = model.getObjectByName('mixamorig' + boneName); if (!bone) return null; model.updateMatrixWorld(true);
  const bp = bone.getWorldPosition(new THREE.Vector3()), bq = bone.getWorldQuaternion(new THREE.Quaternion()), bs = bone.getWorldScale(new THREE.Vector3()).x || 1, mq = model.getWorldQuaternion(new THREE.Quaternion());
  const hips = model.getObjectByName('mixamorigHips'), hp = hips ? hips.getWorldPosition(new THREE.Vector3()) : bp.clone(); const away = new THREE.Vector3(bp.x - hp.x, 0, bp.z - hp.z); if (away.lengthSq() < 1e-4) away.set(1, 0, 0).applyQuaternion(mq); away.normalize();
  const world = bp.clone().addScaledVector(away, dy === null ? out : 0); world.y += dy === null ? -handleY * scale : dy;   /* where the item's origin goes */
  const wrap = new THREE.Group(); bone.add(wrap); wrap.position.copy(bone.worldToLocal(world.clone())); wrap.quaternion.copy(bq).invert().multiply(mq); wrap.scale.setScalar(scale / bs); obj.rotation.y = yaw; wrap.add(obj); return wrap;
}
