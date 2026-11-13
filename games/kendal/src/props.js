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
export function banana(seed = 1) {
  const r = rng(seed), g = grp(); cyl(0.11, 0.17, 2.6, solid(0x6f8f3a, 1), 0, 1.3, 0, g, 8);
  for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 2.7, 1, 4), BLM()); const p = f.geometry.attributes.position; for (let k = 0; k < p.count; k++) { const y = p.getY(k) + 1.35; p.setZ(k, -(y * y) * 0.09); } f.geometry.translate(0, 1.3, 0); f.position.y = 2.5; f.rotation.order = 'YXZ'; f.rotation.y = i / 6 * Math.PI * 2 + r() * 0.5; f.rotation.x = -0.55 - r() * 0.5; g.add(f); }
  return g;
}
export function bananaBunch(scale = 1) {   /* a hand of green bananas on a stem, for carrying and loading */
  const g = grp(); cyl(0.04, 0.05, 0.7 * scale, M.trunk, 0, 0.35 * scale, 0, g, 6);
  for (let i = 0; i < 7; i++) { const h = mesh(new THREE.CylinderGeometry(0.07 * scale, 0.05 * scale, 0.5 * scale, 6), solid(0x7fa83a, 0.9), Math.cos(i * 0.9) * 0.1 * scale, (0.45 - i * 0.045) * scale, Math.sin(i * 0.9) * 0.1 * scale, g); h.rotation.z = 0.3; h.rotation.y = i; }
  return g;
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
export function hillRing(radius = 150, count = 18, hMax = 60, { seed = 3, base = [0.2, 0.42, 0.22], far = 0 } = {}) {
  const r = rng(seed), g = grp();
  for (let i = 0; i < count; i++) { const a = i / count * Math.PI * 2 + r() * 0.2, w = 60 + r() * 60, h = hMax * (0.45 + r() * 0.55), geo = new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2); const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) { const y = pos.getY(k), v = 0.82 + 0.35 * y + (r() - 0.5) * 0.12; col[k * 3] = base[0] * v; col[k * 3 + 1] = base[1] * v; col[k * 3 + 2] = base[2] * v; pos.setY(k, y * (1 + (r() - 0.5) * 0.15)); }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true })); m.scale.set(w, h, w * (0.7 + r() * 0.4)); m.position.set(Math.cos(a) * radius, -2, Math.sin(a) * radius); m.rotation.y = r() * 3; g.add(m); }
  return g;
}

/* ---------- houses and sheds ---------- */
export function boardHouse(w = 5, d = 4, h = 2.8, { wall = [188, 160, 110], roof = [140, 90, 70], porch = true, seed = 1 } = {}) {   /* a Jamaican board house: walls of boards, a zinc roof, a front veranda */
  const g = grp(), r = rng(seed); const wt = T.plank(wall, 8, [w / 2, 1]).clone(); wt.needsUpdate = true; wt.repeat.set(w / 2, 1);
  box(w, h, d, std(wt, 0.9), 0, h / 2, 0, g);
  const zt = T.zinc(roof).clone(); zt.needsUpdate = true; zt.repeat.set(2, d / 2);
  const rise = 1.3, Ls = Math.hypot(d / 2 + 0.4, rise), th = Math.atan2(rise, d / 2 + 0.4);
  for (const s of [-1, 1]) { const p = box(w + 0.7, 0.08, Ls, std(zt, 0.75), 0, h + rise / 2 + 0.04, s * (d / 4 + 0.2), g); p.rotation.x = s * th; }
  for (const s of [-1, 1]) { const gable = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, rise)])), std(wt, 0.9), s * (w / 2 + 0.005), h, 0, g); gable.rotation.y = s * Math.PI / 2; gable.material.side = THREE.DoubleSide; }
  const shut = solid(0x2f6a3f, 0.9); for (const x of [-w * 0.28, w * 0.28]) { box(0.9, 0.9, 0.06, M.woodDark, x, h * 0.62, d / 2 + 0.02, g); box(0.4, 0.8, 0.07, shut, x - 0.62, h * 0.62, d / 2 + 0.04, g); box(0.4, 0.8, 0.07, shut, x + 0.62, h * 0.62, d / 2 + 0.04, g); }
  box(0.9, 1.9, 0.07, solid(0x4a2f1e, 0.9), 0, 0.95, d / 2 + 0.03, g);
  if (porch) { box(w + 0.4, 0.14, 1.6, M.woodDark, 0, 0.2, d / 2 + 0.8, g); for (const x of [-w / 2, 0, w / 2]) box(0.12, 2.4, 0.12, M.wood, x, 1.4, d / 2 + 1.5, g); const pz = box(w + 0.6, 0.06, 1.9, std(zt, 0.75), 0, 2.65, d / 2 + 0.9, g); pz.rotation.x = 0.12; }
  return g;
}
export function shed(w = 6, d = 3, h = 2.6, wall = [150, 120, 84]) { return boardHouse(w, d, h, { wall, porch: true }); }

/* ---------- small things ---------- */
export function crate(s = 0.6, c = 0x8a6a42) { return box(s, s * 0.8, s, solid(c, 0.95), 0, s * 0.4, 0, grp()); }
export function sack(c = 0xb09a6a) { const m = mesh(new THREE.SphereGeometry(0.32, 10, 8), solid(c, 1), 0, 0.25, 0, grp()); m.scale.set(1, 0.8, 0.8); return m.parent; }
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

/* ---------- a mule and a cart (boxes only; tick(t) swishes the tail and nods the head) ---------- */
export function mule(c = 0x6e5a48) {
  const g = grp(), m = solid(c, 1), dk = solid(0x3a2f26, 1);
  const body = box(1.5, 0.62, 0.5, m, 0, 1.0, 0, g); const neck = box(0.28, 0.62, 0.3, m, 0.85, 1.32, 0, g); neck.rotation.z = -0.5;
  const head = grp(g, 1.12, 1.52, 0); box(0.55, 0.24, 0.22, m, 0.18, -0.06, 0, head); box(0.14, 0.2, 0.2, dk, 0.48, -0.1, 0, head); for (const z of [-0.07, 0.07]) box(0.08, 0.28, 0.06, m, -0.02, 0.2, z, head).rotation.z = 0.15;
  for (const [x, z] of [[-0.6, -0.17], [-0.6, 0.17], [0.6, -0.17], [0.6, 0.17]]) { box(0.13, 0.78, 0.13, m, x, 0.4, z, g); box(0.15, 0.08, 0.15, dk, x, 0.04, z, g); }
  const tail = grp(g, -0.78, 1.15, 0); box(0.06, 0.55, 0.06, dk, 0, -0.25, 0, tail);
  g.userData.tick = (t) => { head.rotation.z = Math.sin(t * 1.3) * 0.1 - 0.05; tail.rotation.x = Math.sin(t * 2.4) * 0.25; };
  return g;
}
export function loadedMule(n = 0) {   /* a mule with panniers (baskets either side), more full as n goes up to 3 */
  const g = mule(); const bs = solid(0xa8803c, 1); for (const z of [-0.42, 0.42]) { box(0.5, 0.45, 0.3, bs, 0, 1.0, z, g); }
  g.userData.loads = []; for (let i = 0; i < 3; i++) { const s = mesh(new THREE.SphereGeometry(0.2, 8, 6), solid([0xc27a2a, 0x7f9a3a, 0xb0502e][i], 1), -0.28 + i * 0.28, 1.45, (i % 2 ? 1 : -1) * 0.16, g); s.visible = i < n; g.userData.loads.push(s); }
  return g;
}
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
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); beam.rotation.z = -Math.PI / 2; beam.position.set(6.2, 1.0, 0); g.add(beam);
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
