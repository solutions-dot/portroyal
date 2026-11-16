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
  /* thatch that has seen many rains: layers of straw, grey streaks running down, dark damp patches and a little moss */
  thatch: () => once('thatch', () => cv(512, 512, (x, w, h) => { x.fillStyle = '#8f7a4a'; x.fillRect(0, 0, w, h);
    for (let r = 0; r < 9; r++) { const y0 = r * 58; for (let i = 0; i < 520; i++) { const v = (Math.random() - 0.5) * 80, px = Math.random() * w, py = y0 + Math.random() * 62; x.strokeStyle = `rgb(${150 + v | 0},${128 + v | 0},${78 + v * 0.7 | 0})`; x.lineWidth = 1 + Math.random() * 1.4; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 7, py + 14 + Math.random() * 30); x.stroke(); }
      const g = x.createLinearGradient(0, y0 + 46, 0, y0 + 62); g.addColorStop(0, 'rgba(40,28,12,0)'); g.addColorStop(1, 'rgba(40,28,12,0.5)'); x.fillStyle = g; x.fillRect(0, y0 + 46, w, 16); }
    for (let i = 0; i < 46; i++) { const px = Math.random() * w, g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(70,66,60,0.34)'); g.addColorStop(1, 'rgba(70,66,60,0)'); x.fillStyle = g; x.fillRect(px, 0, 4 + Math.random() * 16, h * (0.4 + Math.random() * 0.6)); }
    for (let i = 0; i < 22; i++) { x.fillStyle = `rgba(${44 + Math.random() * 20 | 0},${40 + Math.random() * 16 | 0},30,${0.12 + Math.random() * 0.2})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 16 + Math.random() * 50, 10 + Math.random() * 30, Math.random() * 3, 0, 7); x.fill(); }
    for (let i = 0; i < 16; i++) { x.fillStyle = `rgba(74,104,44,${0.14 + Math.random() * 0.2})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 28, 5 + Math.random() * 14, Math.random() * 3, 0, 7); x.fill(); } grain(x, w, h, 14); }, [2, 1])),
  /* woven sticks daubed with clay: the daub has cracked and fallen off in places, rain has run down from the eaves, and splashed mud darkens the foot of the wall */
  wattle: () => once('wattle', () => cv(512, 512, (x, w, h) => { x.fillStyle = '#6e5238'; x.fillRect(0, 0, w, h);
    for (let r = 0; r < 44; r++) { const y = r * 12 + 4; x.strokeStyle = r % 2 ? '#5a4028' : '#7a5c3a'; x.lineWidth = 7; x.beginPath(); for (let px = 0; px <= w; px += 16) x.lineTo(px, y + ((px / 16 + r) % 2 ? 3 : -3)); x.stroke(); }
    for (let c = 0; c < 17; c++) { x.fillStyle = 'rgba(46,30,18,0.8)'; x.fillRect(c * 31 + 8, 0, 5, h); }
    for (let i = 0; i < 120; i++) { const v = Math.random() * 34; x.fillStyle = `rgba(${168 + v | 0},${128 + v * 0.8 | 0},${88 + v * 0.6 | 0},0.9)`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 18 + Math.random() * 46, 12 + Math.random() * 30, Math.random() * 3, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(52,34,20,0.7)'; for (let i = 0; i < 46; i++) { let px = Math.random() * w, py = Math.random() * h; x.lineWidth = 0.8 + Math.random(); x.beginPath(); x.moveTo(px, py); for (let k = 0; k < 5; k++) { px += (Math.random() - 0.5) * 22; py += 6 + Math.random() * 14; x.lineTo(px, py); } x.stroke(); }
    for (let i = 0; i < 30; i++) { const px = Math.random() * w, g = x.createLinearGradient(0, 0, 0, h * 0.7); g.addColorStop(0, 'rgba(48,36,26,0.4)'); g.addColorStop(1, 'rgba(48,36,26,0)'); x.fillStyle = g; x.fillRect(px, 0, 5 + Math.random() * 14, h * 0.7); }
    const g = x.createLinearGradient(0, h * 0.78, 0, h); g.addColorStop(0, 'rgba(70,40,24,0)'); g.addColorStop(1, 'rgba(70,40,24,0.75)'); x.fillStyle = g; x.fillRect(0, h * 0.78, w, h * 0.22);
    for (let i = 0; i < 10; i++) { x.fillStyle = 'rgba(70,98,46,0.22)'; x.beginPath(); x.ellipse(Math.random() * w, h - Math.random() * 60, 14 + Math.random() * 30, 6 + Math.random() * 12, 0, 0, 7); x.fill(); } grain(x, w, h, 16); }, [1, 1])),
  planks: () => once('planks', () => cv(128, 256, (x, w, h) => { for (let p = 0; p < 4; p++) { const v = (Math.random() - 0.5) * 30; x.fillStyle = `rgb(${96 + v | 0},${72 + v | 0},${48 + v * 0.7 | 0})`; x.fillRect(p * 32, 0, 32, h); x.fillStyle = 'rgba(20,12,6,0.7)'; x.fillRect(p * 32, 0, 2, h); for (let k = 0; k < 5; k++) { x.strokeStyle = 'rgba(30,18,10,0.3)'; const gx = p * 32 + 4 + Math.random() * 24; x.beginPath(); x.moveTo(gx, 0); x.bezierCurveTo(gx + 3, h * 0.3, gx - 3, h * 0.6, gx + 1, h); x.stroke(); } } for (const y of [40, 210]) { x.fillStyle = 'rgba(40,26,14,0.9)'; x.fillRect(0, y, w, 12); } grain(x, w, h, 16); })),
  bark: () => once('bark', () => cv(128, 256, (x, w, h) => { x.fillStyle = '#5a4634'; x.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { x.strokeStyle = `rgba(${30 + Math.random() * 40 | 0},${22 + Math.random() * 26 | 0},14,0.5)`; x.lineWidth = 1 + Math.random() * 2; const px = Math.random() * w; x.beginPath(); x.moveTo(px, 0); x.bezierCurveTo(px + 6, h * 0.3, px - 6, h * 0.6, px + 3, h); x.stroke(); } grain(x, w, h, 14); }, [1, 1])),
  mat: () => once('mat', () => T.weave([3, 3])),
  /* the paper: the real words of the 1740 patent docket (UK National Archives CO 137/28, entry 55), set out as a clerk's hand. Only these words are shown. */
  paper: () => once('paper', () => cv(512, 384, (x, w, h) => { x.fillStyle = '#e9dcb8'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(150,120,70,${0.03 + Math.random() * 0.06})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 70, 12 + Math.random() * 40, Math.random() * 3, 0, 7); x.fill(); }
    x.fillStyle = '#2a1c10'; x.font = 'italic 25px "IM Fell English", Georgia, serif'; const L = ['granted unto Nanny a free Negroe', 'and the people under command her', '& their heirs & Assigns for ever', 'a parcell of land containing', '500 acres in the parish of Portland.']; L.forEach((t, i) => x.fillText(t, 34, 92 + i * 46));
    x.font = 'italic 21px "IM Fell English", Georgia, serif'; x.fillText('Letters patent dated 5 August 1740', 34, 46); x.strokeStyle = 'rgba(42,28,16,0.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(34, 58); x.lineTo(w - 34, 58); x.stroke(); grain(x, w, h, 8); })),
};
export const PM = { wood: solid(0x7a5a3a, 0.95), woodDark: solid(0x4a3524, 0.95), woodPale: solid(0xa88a5c, 0.95), green: solid(0x5a7a3a, 0.95), iron: solid(0x2c2c30, 0.6, 0.6), steel: solid(0x6a6c72, 0.45, 0.8), brass: solid(0x9a7a3a, 0.5, 0.7), stone: flat(0x7c7a70), stoneDark: flat(0x5c5a54), earth: flat(0x7a4e30), ash: flat(0x3a3430), dark: solid(0x120e0a, 1), clay: solid(0x9a5a3a, 0.9), straw: solid(0xc4a85c, 0.95), cloth: solid(0xd8ccae, 0.95), horn: solid(0xd8caa4, 0.55), hornTip: solid(0x3a2c20, 0.5), meat: solid(0x6a3a26, 0.8), ember: new THREE.MeshBasicMaterial({ color: 0xff7a2a }) };

/* ---------- a hut: woven-stick walls daubed with clay, a thatched roof in two layers with ragged eaves, a plank door standing ajar. The door faces +z.
   Each hut is a little different (seed): the age of its thatch, how far the door stands open, a shuttered window, a lean on the roof. ---------- */
const THATCH_TINT = [0xffffff, 0xd9d2c4, 0xc4bca8, 0xe8dcc0];
export function hut(w = 4, d = 3.2, h = 2.1, seed = 1) {
  const g = grp(), r = rng(seed * 7 + 3), wt = TX.wattle().clone(); wt.needsUpdate = true; wt.repeat.set(w / 3.4, 1); const wall = std(wt, 1), tm = std(TX.thatch(), 1, { color: THATCH_TINT[seed % 4] });
  box(w, h, d, wall, 0, h / 2, 0, g); box(w + 0.16, 0.34, d + 0.16, flat(0x5e4430), 0, 0.17, 0, g);   /* the wall, and its foot of packed clay */
  const rh = 1.25 + r() * 0.3, lo = mesh(new THREE.ConeGeometry(1, rh, 4, 1), tm, 0, h + rh / 2 - 0.05, 0, g); lo.rotation.y = PI / 4; lo.scale.set((w / 2 + 0.7) * Math.SQRT2, 1, (d / 2 + 0.7) * Math.SQRT2);
  const uh = 1.0 + r() * 0.25, up = mesh(new THREE.ConeGeometry(1, uh, 4, 1), tm, 0, h + rh * 0.62 + uh / 2, 0, g); up.rotation.y = PI / 4; up.scale.set((w / 2 + 0.1) * 0.74 * Math.SQRT2, 1, (d / 2 + 0.1) * 0.74 * Math.SQRT2);
  cyl(0.11, 0.17, 0.3, PM.straw, 0, h + rh * 0.62 + uh + 0.08, 0, g, 6); cyl(0.19, 0.19, 0.05, PM.woodDark, 0, h + rh * 0.62 + uh - 0.04, 0, g, 6);   /* the tied bundle at the peak */
  const ed = solid(0x5a4a2c, 1); for (const [x, z, lx, lz] of [[0, d / 2 + 0.66, w + 1.36, 0.1], [0, -d / 2 - 0.66, w + 1.36, 0.1], [w / 2 + 0.66, 0, 0.1, d + 1.36], [-w / 2 - 0.66, 0, 0.1, d + 1.36]]) box(lx, 0.2, lz, ed, x, h - 0.04, z, g);   /* the dark ragged edge of the eaves */
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { cyl(0.075, 0.09, h + 0.1, PM.woodDark, x * (w / 2 - 0.02), h / 2, z * (d / 2 - 0.02), g, 6); const rf = cyl(0.035, 0.045, 1.5, PM.wood, x * (w / 2 + 0.2), h + 0.2, z * (d / 2 + 0.2), g, 5); rf.rotation.set(z * 0.95, 0, -x * 0.95); }   /* corner posts, and the rafter ends under the eaves */
  box(0.9, 1.66, 0.12, PM.dark, 0, 0.83, d / 2 - 0.02, g); for (const sx of [-1, 1]) cyl(0.06, 0.07, 1.8, PM.woodDark, sx * 0.52, 0.9, d / 2 + 0.06, g, 6); box(1.24, 0.11, 0.14, PM.woodDark, 0, 1.76, d / 2 + 0.06, g);
  const dg = grp(g, -0.45, 0, d / 2 + 0.1); dg.rotation.y = -0.5 - r() * 0.9; box(0.84, 1.6, 0.045, std(TX.planks(), 0.95), 0.42, 0.82, 0, dg);   /* the door, standing ajar */
  mesh(rockGeo(seed + 4), PM.stone, 0, 0.02, d / 2 + 0.5, g).scale.set(0.5, 0.08, 0.3);   /* a flat stone at the threshold */
  if (seed % 2) { const sx = seed % 4 === 1 ? 1 : -1; box(0.06, 0.5, 0.56, PM.dark, sx * (w / 2 + 0.005), 1.3, -0.2, g); const sh = box(0.04, 0.5, 0.56, std(TX.planks(), 0.95), sx * (w / 2 + 0.2), 1.52, -0.2, g); sh.rotation.z = sx * 0.9; const st = cyl(0.012, 0.012, 0.42, PM.woodPale, sx * (w / 2 + 0.2), 1.22, -0.2, g, 4); st.rotation.z = -sx * 0.5; }   /* a small window with its shutter propped open */
  lo.rotation.z = (r() - 0.5) * 0.04; g.userData.foot = Math.max(w, d) / 2 + 0.5; return g;
}
/* the same hut as one plain shape, for the many houses seen across the hillside: wall, clay foot, two layers of thatch, door */
export function hutGeo() {
  const col = (geo, fn) => { const p = geo.attributes.position, n = p.count, c = new Float32Array(n * 3); for (let i = 0; i < n; i++) c.set(fn(p.getX(i), p.getY(i), p.getZ(i)), i * 3); geo.setAttribute('color', new THREE.BufferAttribute(c, 3)); geo.deleteAttribute('uv'); return geo; }, nz = (x, y, z) => 0.82 + ((Math.sin(x * 7.1 + z * 3.3 + y * 5.7) + 1) * 0.5) * 0.3;
  const wall = col(new THREE.BoxGeometry(4, 2.1, 3.2).toNonIndexed().translate(0, 1.05, 0), (x, y, z) => { const k = nz(x, y, z) * (y < 0.4 ? 0.62 : 1); return [0.52 * k, 0.39 * k, 0.26 * k]; });
  const r1 = new THREE.ConeGeometry(1, 1.35, 4, 1).toNonIndexed(); r1.rotateY(PI / 4); r1.scale(2.7 * Math.SQRT2, 1, 2.3 * Math.SQRT2); r1.translate(0, 2.72, 0); col(r1, (x, y, z) => { const k = nz(x, y, z) * (0.72 + (y - 2) * 0.22); return [0.56 * k, 0.48 * k, 0.29 * k]; });
  const r2 = new THREE.ConeGeometry(1, 1.15, 4, 1).toNonIndexed(); r2.rotateY(PI / 4); r2.scale(1.55 * Math.SQRT2, 1, 1.3 * Math.SQRT2); r2.translate(0, 3.42, 0); col(r2, (x, y, z) => { const k = nz(x, y, z) * 0.95; return [0.6 * k, 0.52 * k, 0.32 * k]; });
  const door = col(new THREE.BoxGeometry(0.86, 1.6, 0.06).toNonIndexed().translate(0, 0.8, 1.61), () => [0.05, 0.04, 0.03]);
  const geo = mergeGeometries([wall, r1, r2, door], false); geo.computeVertexNormals(); return geo;
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
/* a long gun of the 1730s (a flintlock musket). It stands on its butt; userData.handleY is where a hand holds it; userData.muzzle is the far end.
   Walnut stock with a shaped butt and a brass butt plate, a slim wrist, the lock (plate, cock with its flint, pan and steel), a brass trigger guard,
   an iron barrel pinned to the fore-stock, three brass pipes that hold the ramrod, and a leather sling. About 60 small pieces; background figures get the light one. */
const GUN = { walnut: solid(0x5a3a22, 0.7), walnutD: solid(0x3e2716, 0.75), iron: solid(0x3a3c42, 0.42, 0.45), ironL: solid(0x70747c, 0.38, 0.5), brass: solid(0xb08a3c, 0.42, 0.4), bronze: solid(0x8a6a34, 0.5, 0.35), bronzeD: solid(0x5e4a2a, 0.6, 0.3), leather: solid(0x4a3020, 0.9), flint: solid(0x2a2a2c, 0.5), bore: solid(0x0a0a0a, 1) };
export function musket(light = false) {
  const g = grp(), M = GUN;
  const butt = box(0.042, 0.3, 0.125, M.walnut, 0, 0.16, -0.035, g); butt.rotation.x = 0.16; box(0.046, 0.016, 0.13, M.brass, 0, 0.012, -0.058, g).rotation.x = 0.16;   /* the butt and its brass plate */
  const wr = cyl(0.021, 0.027, 0.2, M.walnut, 0, 0.385, 0.004, g, 8); wr.rotation.x = 0.1;   /* the wrist, where the hand closes */
  box(0.04, 0.2, 0.052, M.walnut, 0, 0.555, 0.006, g); box(0.034, 0.74, 0.036, M.walnut, 0, 0.99, 0, g); box(0.036, 0.03, 0.04, M.brass, 0, 1.365, 0, g);   /* the lock stock, the fore-stock and its brass cap */
  const br = cyl(0.0125, 0.017, 1.02, M.iron, 0, 0.96, 0.024, g, 8); cyl(0.0185, 0.0185, 0.05, M.iron, 0, 0.475, 0.024, g, 8); cyl(0.014, 0.0135, 0.014, M.ironL, 0, 1.468, 0.024, g, 8); cyl(0.008, 0.008, 0.004, M.bore, 0, 1.4755, 0.024, g, 8); box(0.004, 0.012, 0.004, M.ironL, 0, 1.43, 0.039, g);   /* the barrel, breech, muzzle and front sight */
  g.userData.handleY = 0.8; g.userData.muzzle = 1.47; if (light) return g;
  box(0.006, 0.15, 0.036, M.ironL, 0.0235, 0.555, 0.012, g);   /* the lock plate */
  const ck = grp(g, 0.028, 0.515, 0.022); ck.rotation.x = -0.5; box(0.008, 0.072, 0.014, M.iron, 0, 0.036, 0, ck); box(0.01, 0.014, 0.03, M.iron, 0, 0.074, 0.008, ck); box(0.008, 0.008, 0.02, M.flint, 0, 0.066, 0.026, ck);   /* the cock, its jaws and the flint */
  box(0.014, 0.01, 0.026, M.iron, 0.028, 0.6, 0.03, g); const fz = box(0.006, 0.044, 0.02, M.ironL, 0.028, 0.622, 0.044, g); fz.rotation.x = 0.35;   /* the pan and the steel */
  const tg = mesh(new THREE.TorusGeometry(0.03, 0.0035, 5, 10, PI), M.brass, 0, 0.5, -0.024, g); tg.rotation.set(0, PI / 2, PI / 2); box(0.004, 0.03, 0.006, M.iron, 0, 0.5, -0.03, g);   /* the trigger guard and the trigger */
  cyl(0.0042, 0.0042, 0.86, M.walnutD, 0, 0.98, -0.024, g, 5); for (const y of [0.66, 0.95, 1.24]) cyl(0.008, 0.008, 0.04, M.brass, 0, y, -0.024, g, 6);   /* the ramrod in its three pipes */
  for (const y of [0.74, 1.08, 1.32]) cyl(0.004, 0.004, 0.05, M.iron, 0, y, 0.006, g, 4).rotation.z = PI / 2;   /* the pins that hold barrel and stock together */
  const sl = box(0.022, 0.84, 0.004, M.leather, 0, 0.78, -0.05, g); sl.rotation.x = -0.035; box(0.024, 0.012, 0.012, M.iron, 0, 1.2, -0.034, g); box(0.024, 0.012, 0.012, M.iron, 0, 0.36, -0.062, g);   /* the sling and its swivels */
  return g;
}
/* a swivel gun: a small bronze cannon turning in an iron fork, set here on a stout post with three legs so that it can be carried up a mountain.
   Edwards (1793) wrote that Captain Stoddart brought "portable swivel guns" in 1734. The barrel is turned as one shape: knob, base ring, reinforce, bands, chase, muzzle swell. */
export function swivelGun() {
  const g = grp(), M = GUN;
  const post = cyl(0.075, 0.11, 0.98, GUN.walnutD, 0, 0.49, 0, g, 9); for (const y of [0.12, 0.52, 0.9]) cyl(0.115 - y * 0.03, 0.115 - y * 0.03, 0.035, M.iron, 0, y, 0, g, 10);   /* the post and its iron bands */
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5, l = grp(g, Math.sin(a) * 0.06, 0.62, Math.cos(a) * 0.06); l.rotation.set(0, a, 0); const leg = cyl(0.028, 0.036, 0.98, GUN.walnut, 0, -0.33, 0.33, l, 6); leg.rotation.x = -0.78; cyl(0.04, 0.03, 0.05, M.iron, 0, -0.66, 0.67, l, 6); }   /* three legs with iron feet */
  mesh(new THREE.TorusGeometry(0.1, 0.012, 5, 12), M.leather, 0, 0.66, 0, g).rotation.x = PI / 2;   /* a rope lashing where the legs meet the post */
  const yk = grp(g, 0, 0.98, 0); cyl(0.022, 0.022, 0.1, M.iron, 0, 0.05, 0, yk, 8); cyl(0.045, 0.05, 0.02, M.iron, 0, 0.01, 0, yk, 10); box(0.21, 0.022, 0.03, M.iron, 0, 0.105, 0, yk); for (const sx of [-1, 1]) { box(0.02, 0.15, 0.036, M.iron, sx * 0.097, 0.17, 0, yk); cyl(0.022, 0.022, 0.024, M.ironL, sx * 0.097, 0.24, 0, yk, 8).rotation.z = PI / 2; }   /* the fork */
  const b = grp(yk, 0, 0.24, 0), prof = [[0, -0.5], [0.02, -0.5], [0.032, -0.485], [0.034, -0.465], [0.022, -0.45], [0.03, -0.432], [0.074, -0.42], [0.078, -0.4], [0.07, -0.392], [0.068, -0.2], [0.074, -0.196], [0.074, -0.18], [0.064, -0.176], [0.06, 0.02], [0.066, 0.024], [0.066, 0.04], [0.055, 0.044], [0.047, 0.4], [0.05, 0.43], [0.062, 0.47], [0.064, 0.49], [0.056, 0.5], [0.03, 0.5], [0.03, 0.44]];
  const tube = mesh(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 14), M.bronze, 0, 0, 0.06, b); tube.rotation.x = PI / 2; const bore = mesh(new THREE.CircleGeometry(0.03, 12), M.bore, 0, 0, 0.5, b);
  cyl(0.019, 0.019, 0.2, M.bronzeD, 0, 0, 0.06, b, 8).rotation.z = PI / 2; box(0.012, 0.012, 0.02, M.iron, 0, 0.07, -0.3, b);   /* the trunnions the barrel turns on, and the touch hole */
  const tl = cyl(0.009, 0.011, 0.3, M.iron, 0, -0.035, -0.58, b, 6); tl.rotation.x = PI / 2 - 0.22; cyl(0.018, 0.016, 0.11, GUN.walnut, 0, -0.075, -0.75, b, 7).rotation.x = PI / 2 - 0.22;   /* the tiller the gunner aims with, and its wooden grip */
  b.rotation.x = -0.14; bore.userData.keep = true; g.userData.barrel = b; g.userData.muzzle = [0, 1.31, 0.56]; g.userData.noBatch = true; g.userData.foot = 0.7; return g;
}
/* the abeng: a cow's horn, blown through a hole cut in its side near the tip. The word is not in the 1739 accounts, which say "horn"; it is what Maroons call it today.
   The horn is one curved, tapering tube: pale and ridged with growth rings at the wide mouth, darkening to a near-black tip that is cut off flat.
   It has the oval blow hole on the inside of the curve, a dark hollow mouth, and a plaited cord tied round it at two places to sling it from the shoulder. It hangs tip up. */
export function horn(len = 0.46) {
  const g = grp(), R = len / 1.1, RN = 16, RAD = 12, pos = [], col = [], idx = [], at = (t) => { const a = t * 1.1; return [R * (1 - Math.cos(a)), R * Math.sin(a), a]; }, rad = (t) => 0.043 * Math.pow(1 - t, 1.25) + 0.0075 + 0.007 * Math.exp(-t * 26);
  for (let i = 0; i <= RN; i++) { const t = i / RN, [cx, cy, a] = at(t), r = rad(t) * (1 + 0.035 * Math.sin(t * 74) * (1 - t));   /* faint growth rings, strongest near the mouth */
    for (let k = 0; k < RAD; k++) { const b = k / RAD * PI * 2, ox = Math.cos(b) * r, oz = Math.sin(b) * r * 0.9; pos.push(cx + ox * Math.cos(a), cy - ox * Math.sin(a), oz);   /* the ring stands across the horn: out along the curve's own normal, and sideways */
        const dark = Math.max(0, (t - 0.55) / 0.45), streak = 0.86 + 0.2 * Math.sin(b * 3 + t * 5) * Math.sin(b * 7 + 1.3), k2 = (1 - dark * dark * 0.86) * streak; col.push(0.84 * k2 + 0.03, 0.76 * k2 + 0.02, 0.58 * k2 * (1 - dark * 0.3) + 0.02); }
    if (i < RN) for (let k = 0; k < RAD; k++) { const q = i * RAD + k, q2 = i * RAD + (k + 1) % RAD; idx.push(q, q2, q + RAD, q2, q2 + RAD, q + RAD); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), 0, 0, 0, g);
  const m0 = mesh(new THREE.CircleGeometry(rad(0) * 0.9, 12), PM.dark, 0, 0.012, 0, g); m0.rotation.x = PI / 2; m0.scale.y = 0.9;   /* the hollow of the mouth */
  const [tx, ty, ta] = at(1), tip = mesh(new THREE.CircleGeometry(rad(1), 8), PM.hornTip, tx, ty, 0, g); tip.rotation.set(-PI / 2, 0, 0); tip.rotation.z = -ta; tip.rotation.order = 'ZXY';
  const [hx, hy, ha] = at(0.8), hole = mesh(new THREE.CircleGeometry(0.0075, 10), PM.dark, hx + Math.cos(ha) * (rad(0.8) + 0.0006), hy - Math.sin(ha) * (rad(0.8) + 0.0006), 0, g); hole.rotation.set(0, PI / 2, 0); hole.rotation.z = -ha; hole.rotation.order = 'ZYX'; hole.scale.set(1, 1.5, 1);   /* the blow hole, on the inside of the curve */
  const ties = [0.2, 0.68].map((t) => { const [x, y, a] = at(t), ring = mesh(new THREE.TorusGeometry(rad(t) + 0.003, 0.0035, 5, 12), GUN.leather, x, y, 0, g); ring.rotation.set(PI / 2, 0, 0); ring.rotation.z = -a; ring.rotation.order = 'ZXY'; return [x - Math.cos(a) * (rad(t) + 0.004), y + Math.sin(a) * (rad(t) + 0.004), 0]; });
  const mid = [(ties[0][0] + ties[1][0]) / 2 - 0.07, (ties[0][1] + ties[1][1]) / 2, 0.012]; mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([ties[0], mid, ties[1]].map((p) => new THREE.Vector3(...p))), 10, 0.003, 5), GUN.leather, 0, 0, 0, g);   /* the plaited cord */
  g.userData.handleY = at(0.5)[1]; return g;
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
/* a string of beads for the neck. The best known picture of Nanny shows her in a head wrap with beads like these. It was drawn long after her time. */
export function beads() {
  const g = grp(), cols = [solid(0x8a5a2a, 0.5), solid(0xd8c8a0, 0.5), solid(0x5a3a22, 0.5), solid(0xc08a3a, 0.45)];
  for (let i = 0; i < 20; i++) { const a = i / 20 * PI * 2, front = (1 - Math.cos(a)) / 2, b = mesh(new THREE.SphereGeometry(0.0125 + (i % 3) * 0.003, 7, 5), cols[i % 4], Math.sin(a) * 0.088, -front * 0.085, -Math.cos(a) * 0.07 + 0.02, g); b.scale.y = 1.25; }
  box(0.014, 0.05, 0.008, cols[1], 0, -0.125, 0.092, g); return g;
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
/* a cocked hat (three-cornered), as British soldiers and militia wore in the 1730s. The character builder only makes a round felt hat, so the game makes this one
   and hides the felt hat. It is sized from the body's own felt hat in the head bone's space (crown and brim), so it covers the hair just as that hat did:
   a felt crown, and a brim turned up on three sides, with its corners at the front and the two back sides, edged with a narrow light tape. */
const _tv = new THREE.Vector3();
export function cockedHat(model, color = 0x16141a, lace = 0xd8d0b8) {
  let felt = null; model.traverse((o) => { if (o.isSkinnedMesh && (o.material.name || '') === 'Hat') felt = o; });
  const head = model.getObjectByName('mixamorigHead'); if (!felt || !head) return null;
  const sk = felt.skeleton, bi = sk.bones.findIndex((b) => b.name === 'mixamorigHead'); if (bi < 0) return null;
  const P = felt.geometry.attributes.position, pts = []; let y0 = 1e9, y1 = -1e9, cx = 0, cz = 0;
  for (let i = 0; i < P.count; i++) { _tv.fromBufferAttribute(P, i).applyMatrix4(felt.bindMatrix).applyMatrix4(sk.boneInverses[bi]); pts.push(_tv.clone()); y0 = Math.min(y0, _tv.y); y1 = Math.max(y1, _tv.y); cx += _tv.x; cz += _tv.z; }
  cx /= pts.length; cz /= pts.length; const H = y1 - y0; let rc = 0, R = 0;
  for (const p of pts) { const d = Math.hypot(p.x - cx, p.z - cz); if (p.y > y0 + H * 0.45) rc = Math.max(rc, d); R = Math.max(R, d); }
  const g = new THREE.Group(), felt2 = new THREE.MeshStandardMaterial({ color, roughness: 0.95, side: THREE.DoubleSide }), tape = new THREE.MeshStandardMaterial({ color: lace, roughness: 0.8, side: THREE.DoubleSide });
  g.position.set(cx, 0, cz);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(rc * 0.94, rc * 1.03, H * 0.95, 18, 1), felt2); crown.position.y = y0 + H * 0.5; g.add(crown);
  const top = new THREE.Mesh(new THREE.CircleGeometry(rc * 0.94, 18), felt2); top.rotation.x = -PI / 2; top.position.y = y0 + H * 0.975; g.add(top);
  /* the brim: rings from the crown out to the edge; the outer part is turned up, least at the three corners, and the corners reach further out */
  const N = 48, M = 6, Rb = Math.max(R * 1.05, rc * 1.9), up = H * 0.9, pos = [], idx = [], edge = [];
  for (let j = 0; j <= M; j++) for (let i = 0; i <= N; i++) { const a = i / N * PI * 2, t = j / M, c = Math.pow((Math.cos(3 * a) + 1) / 2, 2), rr = rc * 0.98 + (Rb * (0.78 + 0.3 * c) - rc * 0.98) * t, y = y0 + 0.004 + Math.pow(t, 1.6) * up * (1 - 0.7 * c);
    pos.push(Math.sin(a) * rr, y, Math.cos(a) * rr); if (j === M && i < N) edge.push(new THREE.Vector3(Math.sin(a) * rr, y, Math.cos(a) * rr)); }
  for (let j = 0; j < M; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
  const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); bg.setIndex(idx); bg.computeVertexNormals(); g.add(new THREE.Mesh(bg, felt2));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge, true), N, 0.0045, 4, true), tape));
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } }); head.add(g); return g;
}
