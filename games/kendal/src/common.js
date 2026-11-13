/* games/kendal/src/common.js: pieces shared by the places: times of day, the station base (a sunk track beside a raised platform),
   and the scrolling scenery that passes the windows of a moving train. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng, clamp01 } from './gfx.js';
import { rails, RAIL_TOP } from './trains.js';
import { palm, tree, banana, bush, boardHouse, pole, hillRing, scatter, lampPost } from './props.js';

/* ---------- times of day ---------- */
export const ENV = {
  morning: { top: 0x6fb0e2, hor: 0xf1dcb8, fog: 0xe4d6bd, fogN: 70, fogF: 260, hemi: [0xfff1d8, 0x7a6a50, 1.9], sun: [0xffdca8, 2.1, [-30, 20, -14]], stars: 0, moon: 0 },
  day: { top: 0x58a6e4, hor: 0xd6eaf0, fog: 0xcfe2e6, fogN: 80, fogF: 280, hemi: [0xeaf4ff, 0x8a7a5a, 2.1], sun: [0xfff2dc, 2.4, [20, 30, 10]], stars: 0, moon: 0 },
  gold: { top: 0x4c7cc0, hor: 0xf6c27c, fog: 0xe2b98a, fogN: 50, fogF: 230, hemi: [0xffe0b4, 0x6a5444, 1.7], sun: [0xffb464, 2.0, [-36, 10, 6]], stars: 0, moon: 0 },
  dusk: { top: 0x26356a, hor: 0xe08a62, fog: 0x8a6a6a, fogN: 30, fogF: 170, hemi: [0xe9b8a0, 0x3a3040, 1.1], sun: [0xff8a4a, 1.0, [-40, 5, 12]], stars: 0.35, moon: 0 },
  night: { top: 0x03050e, hor: 0x1b2744, fog: 0x0c1322, fogN: 4, fogF: 80, hemi: [0x5a6ca0, 0x161a24, 0.62], sun: [0x8ea8ff, 0.55, [30, 40, -20]], stars: 1, moon: 1 },
  dawn: { top: 0x44568a, hor: 0xf1b186, fog: 0xcfa790, fogN: 14, fogF: 170, hemi: [0xffdcc0, 0x54464a, 1.2], sun: [0xffa860, 1.1, [-40, 6, 0]], stars: 0.15, moon: 0 },
  hazy: { top: 0x7fa6c8, hor: 0xe6e2d2, fog: 0xdcd8c6, fogN: 50, fogF: 200, hemi: [0xf4f0e0, 0x8a7a5a, 1.9], sun: [0xfff0d0, 2.0, [14, 26, 12]], stars: 0, moon: 0 },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
export function mixEnv(a, b, k) {   /* between two times of day: used for dusk, dawn and sunrise */
  const lc = (x, y) => _c1.set(x).lerp(_c2.set(y), k).getHex(), ln = (x, y) => x + (y - x) * k;
  return { top: lc(a.top, b.top), hor: lc(a.hor, b.hor), fog: lc(a.fog, b.fog), fogN: ln(a.fogN, b.fogN), fogF: ln(a.fogF, b.fogF),
    hemi: [lc(a.hemi[0], b.hemi[0]), lc(a.hemi[1], b.hemi[1]), ln(a.hemi[2], b.hemi[2])], sun: [lc(a.sun[0], b.sun[0]), ln(a.sun[1], b.sun[1]), a.sun[2].map((v, i) => ln(v, b.sun[2][i]))], stars: ln(a.stars, b.stars), moon: ln(a.moon, b.moon) };
}

/* ---------- a station: a big ground plane at track level, a raised platform north of the track, and the track itself ---------- */
export const TRACK_Y = RAIL_TOP - 0.59;   /* ballast bottom, so rail tops sit at RAIL_TOP and a vehicle's floor is y = 0 */
export function groundPlane(parent, y, size = 900, tex = T.grass([180, 180]), tint) {
  const m = mesh(new THREE.PlaneGeometry(size, size), std(tex, 1, tint ? { color: tint } : undefined), 0, y, 0, parent); m.rotation.x = -Math.PI / 2; return m;
}
export function stationBase(g, { x0 = -60, x1 = 60, zc = -3, zEdge = 1.75, zBack = 14, wood = false, trackLen = 500, ground = [74, 112, 52] } = {}) {
  groundPlane(g, TRACK_Y - 0.01, 900, T.grass([200, 200], ground));
  const tr = rails(trackLen); tr.position.set((x0 + x1) / 2, TRACK_Y, zc); g.add(tr);
  const L = x1 - x0, W = zBack - (zc + zEdge), cx = (x0 + x1) / 2, cz = (zc + zEdge + zBack) / 2, depth = -TRACK_Y;
  const t = wood ? T.plank([128, 98, 66], 12, [L / 3, 1], true).clone() : T.concrete().clone(); t.needsUpdate = true; t.repeat.set(L / 3, W / 3);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(L, depth, W), [solid(0x5a5a50, 1), solid(0x5a5a50, 1), std(t, 0.95), solid(0x3a3a34, 1), solid(0x6a6a5e, 1), solid(0x6a6a5e, 1)]); slab.position.set(cx, -depth / 2, cz); g.add(slab);
  const edge = box(L, 0.02, 0.35, solid(0xe2c34a, 0.8), cx, 0.015, zc + zEdge + 0.25, g);
  return { top: 0, zc };
}

/* ---------- the scenery that scrolls past a train window. Strips repeat every S metres; far hills move slowly. ---------- */
const S = 100;
function stripSide(theme, side, seed) {   /* one strip of roadside things, on one side of the track, S metres long */
  const r = rng(seed), g = grp(); const z = (a, b) => side * (a + r() * (b - a)), x = () => (r() - 0.5) * S;
  const put = (o, a, b, s = 1) => { o.position.set(x(), 0, z(a, b)); o.rotation.y = r() * 6.28; o.scale.setScalar(s * (0.8 + r() * 0.5)); g.add(o); return o; };
  if (theme === 'coast') { for (let i = 0; i < 14; i++) put(palm(5 + r() * 3, seed + i), 5, 26); for (let i = 0; i < 6; i++) put(bush(i), 4, 12); }
  else if (theme === 'plains') { for (let i = 0; i < 10; i++) put(tree(4 + r() * 3, seed + i), 6, 36); for (let i = 0; i < 6; i++) put(boardHouse(4 + r() * 2, 3.5, 2.6, { wall: [[190, 164, 110], [170, 190, 170], [200, 180, 150]][i % 3], seed: i }), 10, 30); for (let i = 0; i < 12; i++) put(bush(i + 9, 1.4), 4, 18); }
  else if (theme === 'cane') { for (let i = 0; i < 8; i++) put(tree(5 + r() * 3, seed + i), 8, 30); for (let i = 0; i < 18; i++) { const c = cyl(0.04, 0.05, 2.6, solid(0x8aa84a, 1), 0, 1.3, 0, null, 5); c.position.set(x(), 1.3, z(4, 22)); g.add(c); } }
  else if (theme === 'hills') { for (let i = 0; i < 12; i++) put(tree(5 + r() * 4, seed + i), 5, 40); for (let i = 0; i < 5; i++) put(banana(i), 6, 18); for (let i = 0; i < 8; i++) put(bush(i + 3, 1.6), 3, 12); }
  else if (theme === 'morass') { for (let i = 0; i < 12; i++) put(palm(5 + r() * 3, seed + i), 8, 30); for (let i = 0; i < 24; i++) { const c = cyl(0.025, 0.035, 1.6, solid(0x6f8f48, 1), 0, 0.8, 0, null, 4); c.position.set(x(), 0.8, z(3.5, 12)); c.rotation.z = (r() - 0.5) * 0.3; g.add(c); } }
  else if (theme === 'night') { for (let i = 0; i < 10; i++) put(tree(5 + r() * 4, seed + i), 5, 40); for (let i = 0; i < 4; i++) { const h = boardHouse(4.5, 3.5, 2.6, { seed: i }); put(h, 12, 34); const lp = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xffd78a })); lp.position.set(h.position.x + 0.3, 1.6, h.position.z + (side > 0 ? -2.05 : 2.05)); lp.rotation.y = side > 0 ? Math.PI : 0; g.add(lp); } }
  for (let i = 0; i < 3; i++) { const p = pole(7); p.position.set(-S / 2 + i * (S / 3), 0, side * 5.4); g.add(p); }   /* telegraph poles, a few seconds apart */
  return g;
}
export function makeRig(theme, { far = 0x3e6a44, farTop = 0x5d8a58 } = {}) {   /* returns { group, update(dt, speed) } to place under the train, at the track's ground level */
  const group = grp(), strips = [];
  for (const side of [-1, 1]) for (let k = 0; k < 2; k++) { const s = stripSide(theme, side, 11 + side * 3); s.position.x = -k * S; group.add(s); strips.push(s); }
  const gt = T.grass([60, 8], theme === 'night' ? [34, 52, 36] : theme === 'coast' ? [96, 130, 62] : [74, 112, 52]).clone(); gt.needsUpdate = true; const ground = mesh(new THREE.PlaneGeometry(S * 3, 120), std(gt, 1), 0, 0, 0, group); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02;
  const farG = hillRing(210, 14, 70, { seed: 9, base: theme === 'night' ? [0.07, 0.11, 0.1] : [0.2, 0.42, 0.22] }); group.add(farG);
  const track = rails(S * 3); group.add(track);
  const light = theme === 'night' ? 0.3 : 1;
  return { group, theme, tex: gt, track, far: farG, update(dt, v) { for (const s of strips) { s.position.x += v * dt; if (s.position.x > S) s.position.x -= 2 * S; } track.position.x = (track.userData.pos = ((track.userData.pos || 0) + v * dt) % 0.72); gt.offset.x -= v * dt / (S * 3) * 60; farG.rotation.y += v * dt * 0.0005; } };
}
export function lamps(parent, xs, z, h = 3.6) { for (const x of xs) { const l = lampPost(h, true); l.position.set(x, 0, z); parent.add(l); } }
