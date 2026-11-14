/* games/nanny/src/props.js: the things in the world, made in code: thatched huts, cook fires, garden mounds, trenches and forked sticks,
   muskets, the small cannon called swivel guns, the horn (abeng), baskets, the lantern, the stone with the paper on it.
   No drawing or description of Old Nanny Town's houses survives, so the huts are our own picture (woven-stick walls, thatch). docs/games/nanny.md says so. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { cv, grain, rng, T, std, solid, flat, mesh, box, cyl, grp } from './gfx.js';
import { rockGeo } from './flora.js';

const PI = Math.PI;
const memo = {}, once = (k, fn) => memo[k] || (memo[k] = fn());
export const TX = {
  thatch: () => once('thatch', () => cv(256, 256, (x, w, h) => { x.fillStyle = '#9a8552'; x.fillRect(0, 0, w, h); for (let i = 0; i < 1500; i++) { const v = (Math.random() - 0.5) * 70, px = Math.random() * w, py = Math.random() * h; x.strokeStyle = `rgb(${154 + v | 0},${133 + v | 0},${82 + v * 0.7 | 0})`; x.lineWidth = 1 + Math.random(); x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 5, py + 10 + Math.random() * 22); x.stroke(); }
    for (let r = 0; r < 5; r++) { x.fillStyle = 'rgba(60,44,20,0.28)'; x.fillRect(0, r * 52 + 44, w, 5); } grain(x, w, h, 12); }, [2, 1])),
  wattle: () => once('wattle', () => cv(256, 256, (x, w, h) => { x.fillStyle = '#8a6a48'; x.fillRect(0, 0, w, h); for (let r = 0; r < 22; r++) { const y = r * 12 + 4; x.strokeStyle = r % 2 ? '#6a4c30' : '#7a5a3a'; x.lineWidth = 7; x.beginPath(); for (let px = 0; px <= w; px += 16) x.lineTo(px, y + ((px / 16 + r) % 2 ? 3 : -3)); x.stroke(); }
    for (let c = 0; c < 9; c++) { x.fillStyle = 'rgba(52,34,20,0.75)'; x.fillRect(c * 30 + 8, 0, 5, h); }
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${176 + Math.random() * 30 | 0},${138 + Math.random() * 24 | 0},${96 + Math.random() * 20 | 0},0.82)`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 14 + Math.random() * 36, 9 + Math.random() * 22, Math.random() * 3, 0, 7); x.fill(); } grain(x, w, h, 16); }, [1, 1])),
  bark: () => once('bark', () => cv(128, 256, (x, w, h) => { x.fillStyle = '#5a4634'; x.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { x.strokeStyle = `rgba(${30 + Math.random() * 40 | 0},${22 + Math.random() * 26 | 0},14,0.5)`; x.lineWidth = 1 + Math.random() * 2; const px = Math.random() * w; x.beginPath(); x.moveTo(px, 0); x.bezierCurveTo(px + 6, h * 0.3, px - 6, h * 0.6, px + 3, h); x.stroke(); } grain(x, w, h, 14); }, [1, 1])),
  mat: () => once('mat', () => T.weave([3, 3])),
  /* the paper: the real words of the 1740 patent docket (UK National Archives CO 137/28, entry 55), set out as a clerk's hand. Only these words are shown. */
  paper: () => once('paper', () => cv(512, 384, (x, w, h) => { x.fillStyle = '#e9dcb8'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(150,120,70,${0.03 + Math.random() * 0.06})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 70, 12 + Math.random() * 40, Math.random() * 3, 0, 7); x.fill(); }
    x.fillStyle = '#2a1c10'; x.font = 'italic 25px "IM Fell English", Georgia, serif'; const L = ['granted unto Nanny a free Negroe', 'and the people under command her', '& their heirs & Assigns for ever', 'a parcell of land containing', '500 acres in the parish of Portland.']; L.forEach((t, i) => x.fillText(t, 34, 92 + i * 46));
    x.font = 'italic 21px "IM Fell English", Georgia, serif'; x.fillText('Letters patent dated 5 August 1740', 34, 46); x.strokeStyle = 'rgba(42,28,16,0.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(34, 58); x.lineTo(w - 34, 58); x.stroke(); grain(x, w, h, 8); })),
};
export const PM = { wood: solid(0x7a5a3a, 0.95), woodDark: solid(0x4a3524, 0.95), woodPale: solid(0xa88a5c, 0.95), green: solid(0x5a7a3a, 0.95), iron: solid(0x2c2c30, 0.6, 0.6), steel: solid(0x6a6c72, 0.45, 0.8), brass: solid(0x9a7a3a, 0.5, 0.7), stone: flat(0x7c7a70), stoneDark: flat(0x5c5a54), earth: flat(0x7a4e30), ash: flat(0x3a3430), dark: solid(0x120e0a, 1), clay: solid(0x9a5a3a, 0.9), straw: solid(0xc4a85c, 0.95), cloth: solid(0xd8ccae, 0.95), horn: solid(0xd8caa4, 0.55), hornTip: solid(0x3a2c20, 0.5), meat: solid(0x6a3a26, 0.8), ember: new THREE.MeshBasicMaterial({ color: 0xff7a2a }) };

/* ---------- a hut: woven-stick walls, a thatched roof with four slopes, a doorway. The door faces +z. ---------- */
export function hut(w = 4, d = 3.2, h = 2.1, seed = 1) {
  const g = grp(), r = rng(seed), wt = TX.wattle().clone(); wt.needsUpdate = true; wt.repeat.set(w / 2.4, 1);
  box(w, h, d, std(wt, 1), 0, h / 2, 0, g);
  const rh = 1.5 + r() * 0.4, roof = mesh(new THREE.ConeGeometry(1, rh, 4, 1), std(TX.thatch(), 1), 0, h + rh / 2 - 0.04, 0, g); roof.rotation.y = PI / 4; roof.scale.set((w / 2 + 0.55) * Math.SQRT2, 1, (d / 2 + 0.55) * Math.SQRT2);
  box(w + 0.9, 0.1, d + 0.9, std(TX.thatch(), 1), 0, h + 0.02, 0, g);   /* the eaves */
  box(0.86, 1.62, 0.1, PM.dark, 0, 0.81, d / 2 + 0.001, g); for (const s of [-1, 1]) cyl(0.06, 0.07, 1.75, PM.woodDark, s * 0.5, 0.875, d / 2 + 0.05, g, 6); box(1.16, 0.1, 0.12, PM.woodDark, 0, 1.72, d / 2 + 0.05, g);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) cyl(0.07, 0.08, h, PM.woodDark, x * (w / 2 - 0.02), h / 2, z * (d / 2 - 0.02), g, 6);
  g.userData.foot = Math.max(w, d) / 2 + 0.5; return g;
}
/* the same hut as one plain shape, for the many houses seen across the hillside */
export function hutGeo() {
  const paintAll = (geo, c) => { const n = geo.attributes.position.count, col = new Float32Array(n * 3); for (let i = 0; i < n; i++) col.set(c, i * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); return geo; };
  const wall = new THREE.BoxGeometry(4, 2.1, 3.2).toNonIndexed(); wall.translate(0, 1.05, 0); paintAll(wall, [0.50, 0.38, 0.26]);
  const roof = new THREE.ConeGeometry(1, 1.7, 4, 1).toNonIndexed(); roof.rotateY(PI / 4); roof.scale(2.55 * Math.SQRT2, 1, 2.15 * Math.SQRT2); roof.translate(0, 2.9, 0); paintAll(roof, [0.58, 0.50, 0.30]);
  const door = new THREE.BoxGeometry(0.86, 1.6, 0.06).toNonIndexed(); door.translate(0, 0.8, 1.61); paintAll(door, [0.06, 0.05, 0.04]);
  for (const q of [wall, roof, door]) q.deleteAttribute('uv'); const geo = mergeGeometries([wall, roof, door], false); geo.computeVertexNormals(); return geo;
}

/* ---------- a cook fire: a ring of stones, crossed logs, embers and a flame. userData.flame is the flame sprite; userData.top is where smoke rises from. ---------- */
export function cookFire(lit = true) {
  const g = grp(); for (let i = 0; i < 7; i++) { const a = i / 7 * PI * 2, s = mesh(rockGeo(i + 3), PM.stone, Math.cos(a) * 0.42, 0.07, Math.sin(a) * 0.42, g); s.scale.setScalar(0.15); }
  for (let i = 0; i < 3; i++) { const l = cyl(0.05, 0.06, 0.74, PM.woodDark, 0, 0.1, 0, g, 6); l.rotation.set(PI / 2 - 0.12, 0, i * 2.1); l.rotation.order = 'ZXY'; }
  cyl(0.3, 0.34, 0.05, PM.ash, 0, 0.03, 0, g, 10);
  if (lit) { mesh(new THREE.SphereGeometry(0.13, 8, 6), PM.ember, 0, 0.1, 0, g).scale.y = 0.5; const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); f.scale.set(0.95, 1.15, 1); f.position.y = 0.5; g.add(f); g.userData.flame = f; }
  g.userData.top = 0.9; g.userData.foot = 0.75; g.userData.noBatch = true; return g;
}
/* a low frame of green sticks over the coals, with meat on it: Dallas (1803) wrote of "jerked hog broiling" at a Maroon camp */
export function jerkFrame() {
  const g = grp(); for (const [x, z] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) cyl(0.03, 0.035, 0.5, PM.green, x, 0.25, z, g, 5);
  for (const z of [-0.3, 0.3]) { const b = cyl(0.025, 0.025, 1.1, PM.green, 0, 0.5, z, g, 5); b.rotation.z = PI / 2; } for (let i = 0; i < 6; i++) { const b = cyl(0.018, 0.018, 0.68, PM.green, -0.45 + i * 0.18, 0.525, 0, g, 5); b.rotation.x = PI / 2; }
  box(0.42, 0.07, 0.3, PM.meat, -0.18, 0.575, 0, g); box(0.34, 0.06, 0.26, PM.meat, 0.26, 0.57, 0.02, g); cyl(0.36, 0.4, 0.05, PM.ash, 0, 0.03, 0, g, 10); mesh(new THREE.SphereGeometry(0.16, 8, 6), PM.ember, 0, 0.07, 0, g).scale.y = 0.35;
  g.userData.top = 0.7; g.userData.foot = 0.8; return g;
}
/* a yam hill: a mound of earth with a pole and a vine climbing it. grown: 0 (bare mound) to 1 */
export function yamHill(grown = 1, seed = 1) {
  const g = grp(), m = mesh(new THREE.SphereGeometry(0.5, 10, 6, 0, PI * 2, 0, PI / 2), PM.earth, 0, 0, 0, g); m.scale.set(1, 0.6, 1);
  const vine = grp(g); cyl(0.022, 0.028, 1.9, PM.woodDark, 0, 0.95, 0, vine, 5);
  const r = rng(seed); for (let i = 0; i < 7; i++) { const b = mesh(new THREE.IcosahedronGeometry(0.13 + r() * 0.07, 0), flat([0x3f7a34, 0x4c8a3a, 0x356a30][i % 3]), (r() - 0.5) * 0.26, 0.35 + i * 0.22, (r() - 0.5) * 0.26, vine); b.scale.y = 0.7; }
  vine.visible = grown > 0; vine.scale.y = 0.4 + 0.6 * grown; g.userData.vine = vine; g.userData.noBatch = true; return g;
}
/* a stick with a fork at the top. Thicknesse (1788) and Dallas (1803) wrote of "crutch sticks" set by trenches on a Windward path, to rest a gun on. */
export function forkStick(h = 1.15) {
  const g = grp(); cyl(0.022, 0.03, h, PM.woodPale, 0, h / 2, 0, g, 5); for (const s of [-1, 1]) { const b = cyl(0.016, 0.02, 0.26, PM.woodPale, s * 0.07, h + 0.09, 0, g, 5); b.rotation.z = -s * 0.6; } g.userData.handleY = h * 0.62; return g;
}
/* a trench beside the path: a dark hole about four feet deep with a rim of dug earth. stick: show the forked stick in front (toward +z). */
export function trench(stick = false) {
  const g = grp(), hole = mesh(new THREE.CircleGeometry(0.62, 14), PM.dark, 0, 0.035, 0, g); hole.rotation.x = -PI / 2; hole.scale.set(1.25, 0.8, 1);
  for (let i = 0; i < 9; i++) { const a = i / 9 * PI * 2, s = mesh(new THREE.SphereGeometry(0.2, 7, 5, 0, PI * 2, 0, PI / 2), PM.earth, Math.cos(a) * 0.85, 0, Math.sin(a) * 0.58, g); s.scale.set(1.2, 0.55 + (i % 3) * 0.2, 1); }
  const fs = forkStick(1.0); fs.position.set(0, 0, 0.72); fs.visible = stick; g.add(fs); g.userData.stick = fs; g.userData.noBatch = true; return g;
}
/* a long gun of the 1730s (a flintlock musket). It stands on its butt; userData.handleY is where a hand holds it; userData.muzzle is the far end. */
export function musket() {
  const g = grp(); box(0.045, 0.34, 0.11, PM.wood, 0, 0.17, -0.02, g); box(0.04, 0.72, 0.05, PM.wood, 0, 0.66, 0, g); cyl(0.014, 0.017, 1.08, PM.steel, 0, 0.9, 0.012, g, 6); box(0.03, 0.07, 0.05, PM.iron, 0.02, 0.4, 0.03, g);
  g.userData.handleY = 0.8; g.userData.muzzle = 1.44; return g;
}
/* a swivel gun: a small cannon on a fork, here set on a wooden post so it can be carried. Edwards (1793) wrote that Captain Stoddart brought "portable swivel guns" in 1734. */
export function swivelGun() {
  const g = grp(); cyl(0.07, 0.1, 0.95, PM.woodDark, 0, 0.475, 0, g, 8); for (let i = 0; i < 3; i++) { const l = cyl(0.03, 0.04, 0.9, PM.woodDark, 0, 0.38, 0, g, 5); l.rotation.set(0.62, i * 2.094, 0, 'YXZ'); l.position.set(Math.sin(i * 2.094) * 0.24, 0.38, Math.cos(i * 2.094) * 0.24); }
  for (const s of [-1, 1]) box(0.02, 0.2, 0.05, PM.iron, s * 0.085, 1.03, 0, g); box(0.19, 0.03, 0.05, PM.iron, 0, 0.945, 0, g);
  const b = grp(g, 0, 1.08, 0); const tube = cyl(0.05, 0.068, 0.86, PM.brass, 0, 0, 0.12, b, 10); tube.rotation.x = PI / 2; const mz = cyl(0.062, 0.062, 0.05, PM.brass, 0, 0, 0.55, b, 10); mz.rotation.x = PI / 2; mesh(new THREE.SphereGeometry(0.05, 8, 6), PM.brass, 0, 0, -0.34, b); const tl = cyl(0.012, 0.012, 0.34, PM.iron, 0, -0.03, -0.5, b, 5); tl.rotation.x = PI / 2 + 0.3;
  b.rotation.x = -0.16; g.userData.barrel = b; g.userData.muzzle = [0, 1.17, 0.6]; g.userData.noBatch = true; g.userData.foot = 0.6; return g;
}
/* the horn: a cow's horn, blown from a hole near the tip. Maroons today call it the abeng. It hangs tip up; the hand holds it near the top. */
export function horn(len = 0.42) {
  const g = grp(), n = 7; for (let i = 0; i < n; i++) { const t = i / n, r0 = 0.045 * (1 - t) + 0.012, r1 = 0.045 * (1 - (i + 1) / n) + 0.012, s = cyl(r1, r0, len / n * 1.08, i > n - 3 ? PM.hornTip : PM.horn, Math.sin(t * 1.25) * 0.11, t * len + len / n / 2, 0, g, 8); s.rotation.z = -t * 0.62; }
  g.userData.handleY = len * 0.7; return g;
}
/* small things */
export function basket(c = 0xb08a48, rr = 0.26, hh = 0.26) { const g = grp(), wv = TX.mat().clone(); wv.needsUpdate = true; wv.repeat.set(3, 1); cyl(rr, rr * 0.72, hh, std(wv, 0.95, { color: c }), 0, hh / 2, 0, g, 12); const rim = mesh(new THREE.TorusGeometry(rr, 0.018, 5, 14), PM.wood, 0, hh, 0, g); rim.rotation.x = PI / 2; g.userData.handleY = hh; return g; }
export function basketOf(kind = 'yam') { const g = basket(), r = rng(kind.length); for (let i = 0; i < 6; i++) { const m = kind === 'yam' ? mesh(new THREE.SphereGeometry(0.08, 7, 5), solid(0x6a4a30, 1), (r() - 0.5) * 0.26, 0.27 + r() * 0.05, (r() - 0.5) * 0.26, g) : mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.2, 6), solid(i % 2 ? 0x8aa83a : 0xb8b040, 0.8), (r() - 0.5) * 0.24, 0.29 + r() * 0.04, (r() - 0.5) * 0.2, g); m.scale.set(1.5, 0.8, 1); m.rotation.y = r() * 3; if (kind !== 'yam') m.rotation.z = PI / 2; } return g; }
export function gourd() { const g = grp(); mesh(new THREE.SphereGeometry(0.15, 10, 8), solid(0xb8924a, 0.7), 0, 0.14, 0, g).scale.y = 0.95; cyl(0.03, 0.05, 0.12, solid(0xb8924a, 0.7), 0, 0.31, 0, g, 8); return g; }
export function mortar() { const g = grp(); cyl(0.2, 0.16, 0.5, PM.wood, 0, 0.25, 0, g, 10); cyl(0.15, 0.15, 0.02, PM.dark, 0, 0.5, 0, g, 10); const p = cyl(0.04, 0.05, 1.1, PM.woodPale, 0.1, 0.72, 0.02, g, 6); p.rotation.z = -0.22; return g; }
export function woodPile(n = 7) { const g = grp(); for (let i = 0; i < n; i++) { const l = cyl(0.06, 0.07, 0.9, i % 2 ? PM.wood : PM.woodDark, 0, 0.07 + Math.floor(i / 3) * 0.13, (i % 3 - 1) * 0.15 + (Math.floor(i / 3) % 2) * 0.07, g, 6); l.rotation.z = PI / 2; } g.userData.foot = 0.6; return g; }
export function stool(h = 0.4) { const g = grp(); cyl(0.2, 0.2, 0.05, PM.wood, 0, h - 0.025, 0, g, 10); for (let i = 0; i < 3; i++) cyl(0.025, 0.03, h - 0.05, PM.woodDark, Math.cos(i * 2.094) * 0.13, (h - 0.05) / 2, Math.sin(i * 2.094) * 0.13, g, 5); return g; }
/* a low fence of woven sticks between two points on level ground */
export function wattleFence(parent, x0, z0, x1, z1, y = 0, h = 0.8) {
  const L = Math.hypot(x1 - x0, z1 - z0), g = grp(parent, (x0 + x1) / 2, y, (z0 + z1) / 2); g.rotation.y = -Math.atan2(z1 - z0, x1 - x0); const wt = TX.wattle().clone(); wt.needsUpdate = true; wt.repeat.set(L / 1.6, 0.5);
  box(L, h, 0.06, std(wt, 1), 0, h / 2, 0, g); for (let i = 0; i <= Math.round(L / 1.4); i++) cyl(0.035, 0.04, h + 0.16, PM.woodDark, -L / 2 + i * (L / Math.round(L / 1.4)), (h + 0.16) / 2, 0, g, 5); return g;
}
/* a boulder; flatTop makes a slab you could stand on */
export function boulder(s = 1, seed = 1, flatTop = false) { const m = mesh(rockGeo(seed), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 })); m.scale.set(s, s * (flatTop ? 0.45 : 0.9), s); m.userData.foot = s * 0.9; return m; }
/* a flat stone with the paper laid on it, held down by two pebbles */
export function paperStone() {
  const g = grp(), st = boulder(0.75, 4, true); st.position.y = 0.2; g.add(st); const top = 0.5;
  const p = mesh(new THREE.PlaneGeometry(0.62, 0.46), std(TX.paper(), 0.9), 0, top + 0.012, 0, g); p.rotation.x = -PI / 2; p.rotation.z = 0.08; box(0.66, 0.012, 0.5, PM.cloth, 0, top + 0.002, 0, g).rotation.y = -0.08;
  for (const [x, z] of [[-0.27, -0.18], [0.27, 0.19]]) mesh(rockGeo(7), PM.stoneDark, x, top + 0.04, z, g).scale.setScalar(0.045); g.userData.foot = 0.85; return g;
}
/* the watchman's lantern: a candle in a tin and horn case, hung from a ring. userData.flame is the glow. */
export function lantern() {
  const g = grp(); cyl(0.07, 0.075, 0.03, PM.iron, 0, 0.015, 0, g, 8); const gl = cyl(0.058, 0.058, 0.17, new THREE.MeshBasicMaterial({ color: 0xffd98a }), 0, 0.115, 0, g, 8); cyl(0.02, 0.075, 0.07, PM.iron, 0, 0.235, 0, g, 8);
  for (let i = 0; i < 4; i++) cyl(0.006, 0.006, 0.17, PM.iron, Math.cos(i * PI / 2) * 0.06, 0.115, Math.sin(i * PI / 2) * 0.06, g, 4);
  const ring = mesh(new THREE.TorusGeometry(0.03, 0.006, 4, 10), PM.iron, 0, 0.295, 0, g); g.userData.handleY = 0.31;
  const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); f.scale.set(0.7, 0.7, 1); f.position.y = 0.12; g.add(f); g.userData.flame = f; gl.userData.keep = true; return g;
}
/* a cloak of leafy branches. Maroon tradition says fighters dressed in leaves and stood as still as trees. Worn on the back and head. */
export function leafCloak(model, seed = 1) {
  const r = rng(seed), add = (bone, n, spread, y0) => { const b = model.getObjectByName('mixamorig' + bone); if (!b) return; model.updateMatrixWorld(true); const k = b.getWorldScale(new THREE.Vector3()).x || 1, w = new THREE.Group(); w.scale.setScalar(1 / k); b.add(w);
    for (let i = 0; i < n; i++) { const m = mesh(new THREE.IcosahedronGeometry(0.1 + r() * 0.07, 0), flat([0x2f6a35, 0x3a7a3a, 0x285d30, 0x4a8a3c][i % 4]), (r() - 0.5) * spread, y0 + (r() - 0.5) * spread, -0.1 - r() * 0.1, w); m.scale.set(1.3, 0.8, 0.7); m.rotation.set(r() * 3, r() * 3, r() * 3); } };
  add('Spine2', 9, 0.5, 0.05); add('Spine', 6, 0.42, 0); add('Head', 5, 0.3, 0.12);
}
/* stepping stones across a stream: flat stones along a path. Returns the group. */
export function steppingStones(dense, y, from = 0, to = 1) {
  const g = grp(), n = dense.length; for (let i = Math.floor(from * n); i < Math.floor(to * n); i++) { const p = dense[i], s = mesh(rockGeo(i + 2), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }), p[0] + ((i * 7) % 5 - 2) * 0.06, y - 0.16, p[1] + ((i * 3) % 5 - 2) * 0.06, g); s.scale.set(0.62, 0.3, 0.62); s.rotation.y = i; } g.userData.noBatch = true; return g;
}
/* put a thing on a bone so it moves with the body: pos in metres in the bone's own directions */
export function attach(model, boneName, obj, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1) {
  const b = model.getObjectByName('mixamorig' + boneName); if (!b) return null; model.updateMatrixWorld(true); const k = b.getWorldScale(new THREE.Vector3()).x || 1, wrap = new THREE.Group();
  wrap.position.set(pos[0] / k, pos[1] / k, pos[2] / k); wrap.rotation.set(...rot); wrap.scale.setScalar(scale / k); wrap.add(obj); b.add(wrap); return wrap;
}
