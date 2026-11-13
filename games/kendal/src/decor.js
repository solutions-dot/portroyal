/* games/kendal/src/decor.js: the extra detail of each place (grass, flowers, stones, fences, rich trees, luggage). Run once per place when it is built,
   before batchStatic merges it all, so it adds only a handful of draw calls. DECOR[id](group, place). */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng } from './gfx.js';
import { grassField, flowerField, rockField, blotches, fence, flameTree, mangoTree, bamboo, hibiscus, croton, stump, dugOut, drift } from './detail.js';
import { palm, tree, banana, bush, boardHouse, hamper, suitcase, sack, bucket, bench, pole, crate, barrel, lantern } from './props.js';
import { TRACK_Y } from './common.js';

const PI = Math.PI;
const mix = (r) => { const k = r(); return k < 0.3 ? 'palm' : k < 0.55 ? 'mango' : k < 0.7 ? 'flame' : 'tree'; };
const mkTree = (kind, i, r) => (kind === 'palm' ? palm(6 + r() * 3, i) : kind === 'mango' ? mangoTree(5.5 + r() * 2.5, i) : kind === 'flame' ? flameTree(6 + r() * 2, i) : tree(5 + r() * 3, i));
function grove(parent, n, area, clear, seed, y = 0) { const r = rng(seed); let k = 0, tries = 0; while (k < n && tries++ < n * 20) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3])) continue; const o = mkTree(mix(r), k + seed, r); o.position.set(x, y, z); o.rotation.y = r() * 6.28; o.scale.setScalar(0.8 + r() * 0.6); parent.add(o); k++; } }
function village(parent, n, area, seed, y = 0) { const r = rng(seed); for (let i = 0; i < n; i++) { const h = boardHouse(4 + r() * 3, 3.4 + r() * 1.4, 2.5 + r() * 0.6, { wall: [[190, 164, 110], [176, 200, 176], [214, 190, 150], [190, 150, 120], [220, 210, 190]][i % 5], roof: [[140, 90, 70], [150, 150, 146], [120, 80, 64]][i % 3], seed: i + seed }); h.position.set(area[0] + r() * (area[2] - area[0]), y, area[1] + r() * (area[3] - area[1])); h.rotation.y = r() < 0.5 ? 0 : PI; parent.add(h); } }
function wires(parent, x0, x1, z, y, n = 6) {   /* telegraph poles with sagging wires between them */
  const g = grp(parent), st = (x1 - x0) / n; for (let i = 0; i <= n; i++) { const p = pole(7.4); p.position.set(x0 + i * st, y, z); g.add(p); }
  for (const dz of [-0.55, -0.18, 0.18, 0.55]) for (let i = 0; i < n; i++) { const seg = box(st, 0.012, 0.012, solid(0x222222, 0.6), x0 + (i + 0.5) * st, y + 6.8 - Math.sin(Math.PI * 0.5) * 0.4, z + dz, g); seg.rotation.z = 0; }
  return g;
}
function luggage(parent, n, area, seed, clear = [], y = 0) { const r = rng(seed); let k = 0, tries = 0; while (k < n && tries++ < n * 20) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); if (clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3])) continue; const t = r(), o = t < 0.4 ? hamper([0xa8803c, 0xb89050, 0x8a6a30][k % 3]) : t < 0.7 ? suitcase([0x6b4a30, 0x4a3a2a, 0x5a4a38][k % 3]) : sack(); o.position.set(x, y, z); o.rotation.y = r() * 6.28; if (r() < 0.25) o.rotation.z = (r() - 0.5) * 1.2; parent.add(o); k++; } }
function dustPuffs(parent, spots, opacity = 0.16) { const t = T.puff(); for (const [x, y, z, s] of spots) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity, color: 0xb8aa94 })); sp.position.set(x, y, z); sp.scale.set(s, s * 0.6, 1); parent.add(sp); } }

export const DECOR = {
  road(g) {
    const road = [-70, -3.2, 70, 3.2], keep = [road, [-27, -12, -18, -7], [9, 8, 15, 14]];
    blotches(g, [-60, -40, 60, 40], 34, { seed: 3 }); grassField(g, [-60, -34, 60, 34], 3200, { seed: 2, clear: [road], h: 0.7 }); grassField(g, [-60, -4.6, 60, 4.6], 700, { seed: 12, clear: [road], h: 0.45 });
    flowerField(g, [-55, -22, 55, 22], 320, { seed: 5, clear: [road] }); rockField(g, [-55, -16, 55, 16], 50, { seed: 6, clear: [road], size: 0.55 }); rockField(g, [-60, -4, 60, 4], 30, { seed: 7, clear: [[-60, -2.8, 60, 2.8]], size: 0.18 });
    fence(g, -32, -6.6, -10, -6.6); fence(g, 4, 6.4, 22, 6.4); fence(g, -32, -6.6, -32, -14); fence(g, 4, 6.4, 4, 14);
    grove(g, 22, [-60, -45, 60, 50], keep.concat([[-60, -9, 60, 9]]), 11);
    for (const [x, z, s] of [[-14, 8.4, 1], [-3, -8.2, 2], [28, 9.4, 3], [18, -14, 4]]) { const o = flameTree(7, s); o.position.set(x, 0, z); g.add(o); }
    for (const [x, z] of [[38, 12], [41, 13.6]]) { const o = bamboo(x); o.position.set(x, 0, z); g.add(o); }
    for (const [x, z, k] of [[-17.5, -6.3, 0], [-26.4, -6.4, 1], [9.4, 7.6, 2], [14.6, 7.8, 3]]) { const o = k % 2 ? hibiscus(k) : croton(k); o.position.set(x, 0, z); g.add(o); }
    for (const [x, z] of [[-20, -6.4], [-26, -6.8]]) { const b = barrel(); b.position.set(x, 0, z); g.add(b); } const st = stump(); st.position.set(6, 0, -5); g.add(st);
    const pud = new THREE.MeshStandardMaterial({ color: 0x6a5444, roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.5 }); for (const [x, z, s] of [[-12, 1.2, 1.4], [8, -1.4, 1.0], [-30, -1.6, 1.2], [20, 1.6, 0.9]]) { const p = mesh(new THREE.CircleGeometry(s, 14), pud, x, 0.035, z, g); p.rotation.x = -PI / 2; p.scale.y = 0.45; }
  },
  station45(g) {
    const f = grp(g, 0, TRACK_Y, 0); grassField(f, [-120, -90, 120, -5.4], 3600, { seed: 9, y: 0.02, h: 0.6 }); flowerField(f, [-90, -50, 90, -6], 220, { seed: 8, y: 0.02 }); rockField(f, [-90, -60, 90, -6], 30, { seed: 3 }); blotches(f, [-100, -80, 100, -6], 26, { seed: 7 });
    grove(f, 34, [-110, -80, 110, -12], [[-110, -9, 110, -4.2]], 5); village(f, 9, [-90, -70, 90, -30], 3);
    grassField(g, [-60, 17.6, 80, 60], 2400, { seed: 3, h: 0.6 }); flowerField(g, [-50, 18, 70, 50], 200, { seed: 4 }); grove(g, 16, [-70, 20, 90, 70], [[-10, 17, 30, 30]], 7);
    wires(g, -50, 70, 26, 0, 8); for (const [x, z] of [[-18, 11], [26, 12], [4, 12]]) { const l = lantern(); l.position.set(x, 3.1, z); l.scale.setScalar(2); g.add(l); }
    luggage(g, 8, [-16, 3, 30, 12], 4, [[-8, 7, -1, 11]]);
  },
  hill(g) {
    const f = grp(g, 0, TRACK_Y, 0); grassField(f, [-100, -90, 100, -5.4], 2600, { seed: 4, y: 0.02, h: 0.7, tint: 0x9cbc78 }); rockField(f, [-60, -40, 60, -6], 70, { seed: 5, size: 0.9 });
    grassField(g, [-40, 15.4, 50, 80], 3400, { seed: 6, h: 0.7, tint: 0x9cbc78 }); flowerField(g, [-34, 15.4, 44, 50], 260, { seed: 7 }); rockField(g, [-34, 16, 44, 60], 40, { seed: 8, size: 0.6 }); grove(g, 24, [-50, 20, 60, 90], [[-8, 15, 12, 24]], 9);
    for (const [x, z, s] of [[-26, 16.5, 1], [14, 17.2, 2], [40, 16, 3]]) { const o = flameTree(7, s); o.position.set(x, 0, z); g.add(o); }
    fence(g, -34, 14.8, -4, 14.8); fence(g, 8, 14.8, 44, 14.8); for (const [x, z] of [[-30, 14], [12, 14], [-20, 14.2]]) { const o = hibiscus(x); o.position.set(x, 0, z); g.add(o); }
    wires(g, -40, 60, -9, TRACK_Y, 8); luggage(g, 6, [-4, 5, 22, 9], 3, [[-2, 7, 7, 11]]);
  },
  kingston57(g) {
    const f = grp(g, 0, TRACK_Y, 0); grassField(f, [-180, -90, 120, -5.4], 3600, { seed: 3, y: 0.02, h: 0.6 }); blotches(f, [-180, -80, 120, -6], 26, { seed: 2 }); grove(f, 40, [-180, -80, 120, -14], [[-180, -9, 120, -4.4]], 13); village(f, 14, [-150, -90, 110, -30], 5);
    wires(g, -100, 80, -10, TRACK_Y, 10); grassField(g, [-60, 24, 80, 70], 1800, { seed: 4 }); grove(g, 14, [-80, 26, 90, 80], [[-50, 23, 50, 40]], 2);
    for (const x of [-34, -14, 12, 34]) { const t = hibiscus(x); t.position.set(x, 0, 12.6); g.add(t); box(1.2, 0.4, 0.8, solid(0x6a5a46, 0.9), x, 0.2, 12.6, g); }
    for (const [x, z] of [[-6, 11.4], [20, 11.2], [-38, 11]]) luggage(g, 3, [x - 1.5, z - 0.5, x + 1.5, z + 0.5], x, []);
    for (const x of [-30, -10, 10, 28]) { const p = plane(1.2, 1.6, std(T.sign('TRAINS', 128, 170, '#f1ead8', '#7a1e1e', '700 26px Georgia, serif'), 0.9), x, 2.4, 13.88, g); }
    const sig = grp(g, -22, TRACK_Y, -9); cyl(0.12, 0.14, 9, solid(0x8a8a86, 0.7), 0, 4.5, 0, sig, 8); const arm = box(1.6, 0.18, 0.06, solid(0xc03a2a, 0.8), 0.7, 8.6, 0.1, sig); arm.rotation.z = -0.3; box(0.3, 0.3, 0.1, solid(0xe8d8a0, 0.8), 0, 7.8, 0.1, sig);
  },
  beach(g) {
    grassField(g, [-80, 12, 80, 40], 2600, { seed: 3, tint: 0xaecb88, h: 0.7 }); flowerField(g, [-60, 12, 60, 30], 220, { seed: 5 }); rockField(g, [-70, -23, 70, -19], 60, { seed: 4, size: 0.7, tone: 0x8a8070 }); rockField(g, [-60, -14, 60, 12], 26, { seed: 9, size: 0.2, tone: 0xb8a888 });
    for (const [x, z, s] of [[-40, 15, 1], [-10, 16, 2], [20, 15.6, 3], [46, 15, 4]]) { const o = bush(s, 2.2); o.position.set(x, 0, z); g.add(o); }
    const c = dugOut(); c.position.set(-20, 0, -9); c.rotation.y = 0.5; g.add(c); const d = drift(); d.position.set(26, 0, -7); g.add(d); const d2 = drift(); d2.position.set(-30, 0, -3); d2.rotation.y = 2; g.add(d2);
    for (let i = 0; i < 4; i++) { const b = grp(g, -90 + i * 55, 0.0, -90 - i * 22); box(5.5, 0.6, 1.8, solid(0xe8e0d0, 0.8), 0, 0.3, 0, b); const sl = plane(3.4, 4.6, std(T.sign('', 8, 8, '#f4f0e4', '#f4f0e4', '10px serif', false), 0.8, { side: THREE.DoubleSide }), 0.3, 3, 0, b); box(0.06, 5, 0.06, solid(0x6a5238, 0.9), 0, 3, 0, b); }
    luggage(g, 6, [-30, 2, 30, 10], 3, [[-10, 6, -6, 11], [8, 4, 12, 9]]);
  },
  crash(g) {
    const trackBed = [-14, -3.6, 72, 3.6], road = [-92, 26.6, 92, 33.4], wreck = [-48, -26, 8, -3.5];
    blotches(g, [-60, -30, 70, 60], 34, { seed: 5, colors: [0x2a4228, 0x3a5230, 0x4a4030, 0x1e3222] }); grassField(g, [-70, -40, 80, 62], 4200, { seed: 6, clear: [trackBed, road], tint: 0x6a9058, h: 0.7 }); rockField(g, [-60, -30, 70, 40], 70, { seed: 7, clear: [trackBed, road, [4, 2, 34, 14]], size: 0.5 });
    flowerField(g, [-40, 6, 60, 24], 160, { seed: 8 }); grove(g, 40, [-80, -60, 90, 70], [trackBed, road, wreck, [-20, -4, 40, 26], [-14, 22, 16, 34]], 21);
    fence(g, -36, 22.5, 36, 22.5, { wire: true }); fence(g, 30, 2.8, 70, 2.8, { wire: true });
    luggage(g, 26, [-12, 2.8, 36, 16], 5, [[-8, 12, -3, 17], [24, 7, 27, 10]]); luggage(g, 16, [-40, -22, 6, -4], 9);
    for (const [x, z, c] of [[-1, 10.5, 0xb86a3c], [-3.6, 11.4, 0x4a6a8a], [2, 7.4, 0x8a3a3a], [-7, 6.4, 0x8a7a3a]]) { const b = mesh(new THREE.CircleGeometry(0.8, 10), solid(c, 1), x, 0.03, z, g); b.rotation.x = -PI / 2; b.scale.y = 1.4; }
    dustPuffs(g, [[-14, 3.2, -9, 12], [-24, 4.5, -12, 14], [-6, 3, -7, 10], [-32, 4, -10, 12], [-18, 6, -6, 16]], 0.2);
  },
  memorial(g) {
    const ok = [[-60, -3, 60, 12], [-3, -14, 20, -3]];
    blotches(g, [-60, -40, 60, 30], 26, { seed: 2 }); grassField(g, [-60, -34, 60, 34], 3400, { seed: 3, clear: [[-60, 6.4, 60, 9.6], [-4, -12, 18, -2], [-60, 18, 60, 23]], tint: 0xb4d090 }); flowerField(g, [-40, -30, 40, 16], 420, { seed: 4, clear: [[-4, -12, 18, -2]] }); rockField(g, [-50, -24, 50, 14], 30, { seed: 5, clear: [[-4, -12, 18, -2]], size: 0.5 });
    fence(g, -12, -12.8, -4, -12.8); fence(g, 14, -12.8, 22, -12.8); fence(g, -12, -12.8, -12, -4); fence(g, 22, -12.8, 22, -4);
    for (const [x, z] of [[-3.4, -7.6], [11.6, -7.6], [-3.4, -4.4], [11.6, -4.4]]) { const t = hibiscus(x); t.position.set(x, 0.06, z); g.add(t); }
    for (const [x, z, s] of [[-18, -14, 1], [24, -14, 2], [-22, 8, 3]]) { const o = flameTree(7, s); o.position.set(x, 0, z); g.add(o); }
    grove(g, 22, [-70, -50, 70, 50], [[-30, -18, 30, 12], [-90, 18, 90, 23]], 17);
    for (const [x, z] of [[-2, -9.8], [10, -9.8]]) { const p = cyl(0.3, 0.22, 0.4, solid(0x8a6a4a, 0.9), x, 0.26, z, g, 10); }
  },
};
