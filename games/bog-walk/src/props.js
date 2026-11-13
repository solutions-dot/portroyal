/* games/bog-walk/src/props.js (copied from games/kendal/src/props.js): plants, hills, houses, animals and the many small things that fill a scene.
   Each builder returns a THREE.Group sitting on y = 0 at its own origin. */
import * as THREE from 'three';
import { T, std, solid, flat, glow, mesh, box, cyl, plane, grp, rng, cv } from './wgfx.js';

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
export function crate(s = 0.6, c = 0x8a6a42) { return box(s, s * 0.8, s, solid(c, 0.95), 0, s * 0.4, 0, grp()); }
export function sack(c = 0xb09a6a) { const g = grp(), m = solid(c, 1); cyl(0.2, 0.25, 0.46, m, 0, 0.23, 0, g, 10); mesh(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), m, 0, 0.46, 0, g).scale.y = 0.7; cyl(0.04, 0.12, 0.14, solid(0x8a7648, 1), 0, 0.66, 0, g, 8); mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 10), solid(0x5a4228, 1), 0, 0.6, 0, g).rotation.x = Math.PI / 2; return g; }   /* a sack: a body, a rounded top, a tied neck */
export function hamper(c = 0xa8803c) { const g = grp(); cyl(0.3, 0.26, 0.34, solid(c, 1), 0, 0.17, 0, g, 12); const lid = mesh(new THREE.SphereGeometry(0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), solid(c, 1), 0, 0.34, 0, g); lid.scale.y = 0.6; mesh(new THREE.TorusGeometry(0.22, 0.02, 5, 12, Math.PI), solid(0x7a5a2a, 1), 0, 0.4, 0, g); return g; }
export function suitcase(c = 0x6b4a30) { const g = grp(); box(0.7, 0.45, 0.25, solid(c, 0.8), 0, 0.225, 0, g); box(0.2, 0.05, 0.06, M.steel, 0, 0.47, 0, g); return g; }
export function bucket(c = 0x9aa09a) { const g = grp(); cyl(0.2, 0.15, 0.3, solid(c, 0.4, 0.5), 0, 0.15, 0, g, 12); mesh(new THREE.TorusGeometry(0.2, 0.012, 5, 12, Math.PI), M.iron, 0, 0.3, 0, g); return g; }
export function lantern() {   /* a hand lamp: a metal frame, a glowing glass, a handle */
  const g = grp(); cyl(0.07, 0.09, 0.05, M.iron, 0, 0.03, 0, g, 8); cyl(0.065, 0.065, 0.2, M.lanternGlass, 0, 0.15, 0, g, 8); cyl(0.04, 0.09, 0.05, M.iron, 0, 0.27, 0, g, 8); mesh(new THREE.TorusGeometry(0.08, 0.008, 4, 10, Math.PI), M.iron, 0, 0.29, 0, g);
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flame.scale.set(0.5, 0.5, 1); flame.position.y = 0.2; g.add(flame); g.userData.flame = flame; return g;
}
export function torch() { const g = grp(); cyl(0.03, 0.04, 1.1, M.woodDark, 0, 0.55, 0, g, 6); const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); f.scale.set(0.9, 1.1, 1); f.position.y = 1.2; g.add(f); g.userData.flame = f; return g; }
export function bench(L = 2, c = 0x6b4a30) { const g = grp(), m = solid(c, 0.95); box(L, 0.07, 0.5, m, 0, 0.45, 0, g); box(L, 0.5, 0.06, m, 0, 0.75, -0.24, g); for (const x of [-L / 2 + 0.1, L / 2 - 0.1]) box(0.08, 0.45, 0.44, M.woodDark, x, 0.22, 0, g); return g; }
export function pole(h = 7) { const g = grp(); cyl(0.09, 0.12, h, M.woodDark, 0, h / 2, 0, g, 6); box(1.6, 0.08, 0.08, M.woodDark, 0, h - 0.4, 0, g); for (const x of [-0.7, -0.25, 0.25, 0.7]) cyl(0.03, 0.03, 0.16, solid(0xc9d6d0, 0.4), x, h - 0.3, 0, g, 6); return g; }
export function lampPost(h = 3.6, lit = true) { const g = grp(); cyl(0.06, 0.09, h, M.iron, 0, h / 2, 0, g, 8); box(0.34, 0.34, 0.34, lit ? M.lanternGlass : M.iron, 0, h + 0.1, 0, g); box(0.46, 0.06, 0.46, M.iron, 0, h + 0.32, 0, g); return g; }
export function signBoard(text, w = 2.2, h = 0.6, opts = {}) { const g = grp(); const tx = T.sign(text, 512, Math.round(512 * h / w), opts.bg, opts.fg, opts.font); plane(w, h, std(tx, 0.8), 0, 0, 0.04, g); plane(w, h, std(tx, 0.8), 0, 0, -0.04, g).rotation.y = Math.PI; box(w + 0.1, h + 0.1, 0.06, M.woodDark, 0, 0, 0, g); return g; }
export function milestone(text) { const g = grp(); const m = mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.9, 3), solid(0xcfc9b6, 0.9), 0, 0.45, 0, g); m.rotation.y = 0.3; plane(0.5, 0.5, std(T.sign(text, 256, 256, '#cfc9b6', '#2a2a2a', '700 54px Georgia, serif', false), 0.9), 0, 0.5, 0.2, g); return g; }
export function standpipe() { const g = grp(); cyl(0.1, 0.12, 1.1, M.iron, 0, 0.55, 0, g, 8); box(0.3, 0.1, 0.1, M.iron, 0.12, 1.0, 0, g); cyl(0.04, 0.04, 0.3, M.iron, 0.26, 0.9, 0, g, 6); box(0.7, 0.14, 0.7, solid(0x888274, 0.9), 0, 0.07, 0, g); return g; }
export function waterTower() { const g = grp(); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const l = cyl(0.08, 0.1, 5, M.woodDark, x, 2.5, z, g, 6); l.rotation.set(z * 0.04, 0, -x * 0.04); } cyl(1.6, 1.6, 2.2, solid(0x7a5a3c, 0.9), 0, 5.4, 0, g, 18); cyl(0.0, 1.7, 0.7, solid(0x3d3d3a, 0.8), 0, 6.85, 0, g, 18); box(0.18, 3.4, 0.18, M.iron, 1.4, 3.4, 0, g); const sp = box(0.2, 0.2, 2.2, M.iron, 1.4, 4.8, 1.1, g); return g; }
export function barrel() { const g = grp(); cyl(0.3, 0.3, 0.8, solid(0x7a5a3c, 0.9), 0, 0.4, 0, g, 12); for (const y of [0.15, 0.65]) cyl(0.315, 0.315, 0.04, M.iron, 0, y, 0, g, 12); return g; }

/* ---------- a mule with a pack saddle, panniers and a bridle; tick(t) breathes, nods, flicks an ear, swishes the tail and sometimes paws ---------- */
export function mule(c = 0x6a5644, pack = true) {   /* pack = false: a mule in harness with no pack saddle (Bog Walk's mule car) */
  const g = grp(), body = solid(c, 0.95), belly = solid(0x9c8870, 0.95), dk = solid(0x2d241d, 1), muz = solid(0xb8a58c, 1), hoof = solid(0x1f1a16, 0.8), leather = solid(0x4a3020, 0.9), cloth = solid(0x9a3a2a, 1), wood = solid(0x7a5a3c, 0.95);
  const torso = mesh(new THREE.CylinderGeometry(0.34, 0.33, 1.15, 16), body, 0, 1.02, 0, g); torso.rotation.z = PI2; torso.scale.set(1, 1, 0.9);
  const chest = mesh(new THREE.SphereGeometry(0.36, 14, 10), body, 0.58, 1.05, 0, g); chest.scale.set(0.95, 1.05, 0.88); const rump = mesh(new THREE.SphereGeometry(0.36, 14, 10), body, -0.58, 1.06, 0, g); rump.scale.set(1, 1.02, 0.9);
  const under = mesh(new THREE.CylinderGeometry(0.26, 0.26, 1.0, 12), belly, 0, 0.84, 0, g); under.rotation.z = PI2; under.scale.set(1, 1, 0.9);
  const neck = mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.7, 10), body, 0.9, 1.38, 0, g); neck.rotation.z = -0.62;
  for (let i = 0; i < 7; i++) { const m = box(0.05, 0.12, 0.03, dk, 0.78 + i * 0.045, 1.58 + i * 0.065 - 0.04, 0, g); m.rotation.z = -0.62; }   /* the mane */
  const head = grp(g, 1.16, 1.66, 0), hd = mesh(new THREE.SphereGeometry(0.15, 12, 9), body, 0.1, -0.02, 0, head); hd.scale.set(1.35, 1.05, 0.85);
  const mz = mesh(new THREE.SphereGeometry(0.105, 10, 8), muz, 0.33, -0.1, 0, head); mz.scale.set(1.35, 0.9, 0.82); for (const z of [-0.04, 0.04]) mesh(new THREE.SphereGeometry(0.018, 6, 5), dk, 0.45, -0.1, z, head);
  for (const z of [-0.115, 0.115]) mesh(new THREE.SphereGeometry(0.027, 8, 6), glow(0x0a0806), 0.2, 0.03, z, head);
  const ears = []; for (const z of [-0.075, 0.075]) { const e = mesh(new THREE.ConeGeometry(0.045, 0.3, 6), body, -0.04, 0.2, z, head); e.rotation.x = z > 0 ? -0.22 : 0.22; e.rotation.z = 0.1; ears.push(e); mesh(new THREE.ConeGeometry(0.022, 0.2, 5), dk, -0.04, 0.2, z * 1.02, head).rotation.copy(e.rotation); }
  box(0.04, 0.05, 0.27, leather, 0.3, -0.07, 0, head); box(0.18, 0.025, 0.27, leather, 0.0, 0.08, 0, head); for (const z of [-0.12, 0.12]) box(0.22, 0.02, 0.02, leather, 0.1, -0.03, z, head);   /* the bridle */
  const rope = cyl(0.012, 0.012, 0.6, solid(0xb8a070, 1), 0.28, -0.4, 0.12, head, 5); rope.rotation.x = 0.1;   /* the lead rope */
  const legs = []; for (const [x, z, f] of [[0.56, -0.17, 1], [0.56, 0.17, 1], [-0.56, -0.17, 0], [-0.56, 0.17, 0]]) { const lg = grp(g, x, 0.74, z); mesh(new THREE.CylinderGeometry(0.095, 0.065, 0.46, 8), body, 0, -0.18, 0, lg); mesh(new THREE.SphereGeometry(0.065, 7, 6), dk, 0, -0.42, 0, lg); mesh(new THREE.CylinderGeometry(0.052, 0.05, 0.36, 7), dk, 0, -0.55, 0, lg); mesh(new THREE.CylinderGeometry(0.072, 0.082, 0.08, 8), hoof, 0, -0.7, 0, lg); legs.push(lg); }
  const tail = grp(g, -0.92, 1.14, 0); cyl(0.03, 0.02, 0.5, dk, 0, -0.25, 0, tail, 6); mesh(new THREE.SphereGeometry(0.06, 7, 6), dk, 0, -0.55, 0, tail).scale.set(1, 2.2, 1);
  if (pack) {
  /* the pack: a cloth pad, crossed wooden frames, a girth strap and two woven panniers on ropes */
  box(0.8, 0.05, 0.5, cloth, 0, 1.38, 0, g); for (const x of [-0.25, 0.25]) for (const s of [-1, 1]) { const bk = box(0.05, 0.5, 0.05, wood, x, 1.5, s * 0.0, g); bk.rotation.x = s * 0.5; }
  box(0.7, 0.05, 0.05, wood, 0, 1.72, 0, g); const girth = mesh(new THREE.TorusGeometry(0.345, 0.014, 5, 20), leather, 0.12, 1.02, 0, g); girth.rotation.y = PI2; girth.scale.set(1, 1, 0.92);
  const panniers = []; for (const s of [-1, 1]) { const pn = cyl(0.27, 0.21, 0.46, std(T.weave([3, 1]), 0.95), -0.02, 1.0, s * 0.5, g, 14); const rim = mesh(new THREE.TorusGeometry(0.27, 0.025, 5, 16), solid(0x8a6428, 1), -0.02, 1.23, s * 0.5, g); rim.rotation.x = PI2; panniers.push(pn); for (const dx of [-0.16, 0.16]) { box(0.02, 0.02, 0.5, solid(0xb8a070, 1), dx, 1.3, s * 0.27, g); } }
  }
  g.userData.slots = [[-0.02, 1.27, -0.5], [-0.02, 1.27, 0.5], [-0.04, 1.78, 0]];   /* where the three loads go */
  g.userData.dip = 0; const base = { torso: torso.position.y };
  g.userData.tick = (t) => { const k = Math.sin(t * 1.6) * 0.012; torso.scale.y = 1 + k; head.rotation.z = Math.sin(t * 1.1) * 0.06 - 0.06 - g.userData.dip * 0.6; ears[0].rotation.z = 0.1 + (Math.sin(t * 0.7) > 0.93 ? Math.sin(t * 40) * 0.25 : 0); tail.rotation.x = Math.sin(t * 2.2) * 0.2; tail.rotation.z = Math.sin(t * 1.3) * 0.08;
    const paw = Math.sin(t * 0.35) > 0.96 ? Math.sin(t * 14) * 0.35 : 0; legs[0].rotation.z = paw; g.position.y = -g.userData.dip * 0.05; };
  return g;
}
const PI2 = Math.PI / 2;
/* things to load: a basket of yams, a sack of provisions, a bunch of bananas bound with rope */
export function yamBasket() { const g = grp(); cyl(0.26, 0.2, 0.34, std(T.weave([3, 1]), 0.95), 0, 0.17, 0, g, 14); for (let i = 0; i < 7; i++) { const y = mesh(new THREE.SphereGeometry(0.1, 8, 6), solid([0x8a5a30, 0x9a6a3a, 0x7a4a28][i % 3], 1), Math.cos(i * 1.1) * 0.12, 0.4 + (i > 4 ? 0.07 : 0), Math.sin(i * 1.1) * 0.12, g); y.scale.set(1.5, 0.8, 0.9); y.rotation.y = i; } return g; }
export function provisionSack() { const g = grp(); const b = mesh(new THREE.SphereGeometry(0.28, 12, 9), solid(0xc2ad78, 1), 0, 0.28, 0, g); b.scale.set(1, 1.15, 0.85); const neck = cyl(0.07, 0.1, 0.1, solid(0xa89258, 1), 0, 0.6, 0, g, 8); mesh(new THREE.TorusGeometry(0.075, 0.014, 5, 10), solid(0x6a4a28, 1), 0, 0.58, 0, g).rotation.x = PI2; return g; }
export function bananaLoad() {   /* three bunches lying across the mule's back, tied round with rope */
  const g = grp(); [[-0.13, 0.17], [0.13, 0.17], [0, 0.36]].forEach(([x, y], i) => { const b = bananaBunch(0.66); b.rotation.order = 'ZXY'; b.rotation.set(PI2, i * 1.5, 0); b.position.set(x, y, -0.22); g.add(b); });
  const rope = mesh(new THREE.TorusGeometry(0.26, 0.012, 5, 18), solid(0xb8a070, 1), 0, 0.2, 0.0, g); rope.scale.y = 0.85; return g; }
export function loadedMule() { return mule(); }
export function cart(L = 2.6, W = 1.4) {
  const g = grp(); box(L, 0.1, W, M.wood, 0, 0.7, 0, g); for (const s of [-1, 1]) box(L, 0.4, 0.07, M.wood, 0, 0.95, s * W / 2, g); box(0.07, 0.4, W, M.wood, -L / 2, 0.95, 0, g);
  for (const s of [-1, 1]) { const w = cyl(0.62, 0.62, 0.07, M.woodDark, -0.2, 0.62, s * (W / 2 + 0.08), g, 14); w.rotation.x = Math.PI / 2; for (let i = 0; i < 3; i++) { const sp = box(1.2, 0.06, 0.05, M.wood, -0.2, 0.62, s * (W / 2 + 0.12), g); sp.rotation.z = i * Math.PI / 3; } }
  box(2.2, 0.05, 0.07, M.wood, L / 2 + 1.0, 0.8, 0.4, g); box(2.2, 0.05, 0.07, M.wood, L / 2 + 1.0, 0.8, -0.4, g);
  return g;
}
export function surveyPole(c = 0xc03a2a) { const g = grp(); for (let i = 0; i < 6; i++) cyl(0.035, 0.035, 0.34, i % 2 ? M.white : solid(c, 0.8), 0, 0.17 + i * 0.34, 0, g, 6); return g; }

/* ---------- a truck with headlights, for the road above the crash site ---------- */
export function truck(c = 0x2f5f6a) {
  const g = grp(), m = solid(c, 0.6, 0.2); box(2.6, 0.9, 1.9, m, 0, 0.9, 0, g); box(1.3, 0.9, 1.8, m, 1.05, 1.6, 0, g); box(0.04, 0.5, 1.4, new THREE.MeshBasicMaterial({ color: 0x1a2630 }), 1.72, 1.65, 0, g); box(1.4, 0.4, 1.9, solid(0x4a4640, 0.9), -0.4, 1.55, 0, g).visible = false;
  for (const x of [-0.9, 1.0]) for (const z of [-0.9, 0.9]) { const w = cyl(0.42, 0.42, 0.3, M.black, x, 0.42, z, g, 12); w.rotation.x = Math.PI / 2; }
  for (const z of [-0.6, 0.6]) { box(0.08, 0.2, 0.3, M.lanternGlass, 1.76, 1.0, z, g); }
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); beam.rotation.z = -Math.PI / 2; beam.position.set(6.2, 1.0, 0); g.add(beam);
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
