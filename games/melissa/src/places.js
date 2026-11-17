/* games/melissa/src/places.js: the places of the game. Coordinates are metres; yaw 0 looks toward -z, and +x is east.
   The village of Breadnut Corner (made up) is built four times from one function, so it is the same place in each telling:
     yard88    1988, the day before Gilbert (chapter 1)
     yard25    October 2025, the days before Melissa (chapter 2)
     after     the morning after Melissa, and the days that follow (chapters 4 and 5)
     today     the village rebuilding (chapter 6)
   plus two rooms: room88 (Mass Clifford's block house, where the family shelters from Gilbert) and hall (the church hall used as a shelter in 2025).
   Each builder returns the group, walking bounds, walls, people, background figures and the spots the game's actions use. */
import * as THREE from 'three';
import { T, std, solid, mesh, box, cyl, plane, grp, rng } from './gfx.js';
import { palm, tree, banana, bush, hillRing, scatter, pole, lantern, bucket, crate, barrel, sack } from './props.js';
import { house, shop, shopGoods, zincSheet, plank, branch, mattress, bareTree, snappedPalm, fallenTree, cutLogs, leaningPole, tarpOnGround, clothes, kerosene, tankOnStand, waterDrum, jug, standpipeTap, plywood, goBag, radio, roofOf, bread, tarpMesh, bigDish, waterTruck, car, zincFence } from './houses.js';
import { mangoTree, flameTree, hibiscus, croton, stump, grassField, flowerField, rockField, blotches, fence, bamboo, dugOut } from './detail.js';
import { swayable } from './storm.js';
import { ENV, groundPlane } from './common.js';
import { person, extra, folk, walkers } from './cast.js';

const PI = Math.PI;
const WOOD = solid(0x7a5a3c, 0.95), WOODD = solid(0x3d2d20, 0.95), IRON = solid(0x2b2d31, 0.6, 0.3);
/* where things are in the village, the same in every telling */
export const SPOT = { home: [-26, -8.5], hyacinth: [-4, 8.5], raymond: [16, -8.8], shop: [30, 8.8], church: [44, -10], standpipe: [8, 3.6], mango: [-12, -0.5] };
const lane = (g, x0, x1, z, w, kind) => { const t = T.dirt([1, Math.abs(x1 - x0) / 5], kind === 'tar' ? [86, 88, 90] : [150, 98, 62]); const m = mesh(new THREE.PlaneGeometry(w, Math.abs(x1 - x0)), std(t, 1), 0, 0, 0); m.rotation.x = -PI / 2; const h = grp(g, (x0 + x1) / 2, 0.02, z); h.rotation.y = PI / 2; h.add(m); return h; };

/* ============ the village ============ */
function village({ id, year, phase }) {
  const g = grp(), walls = [], people = [], extras = [], y88 = year === 88, y51 = year === 51, old = y88 || y51, after = phase === 'after', today = phase === 'today', r = rng(y51 ? 51 : y88 ? 88 : after ? 7 : today ? 9 : 25);
  const wall = (x0, z0, x1, z1) => walls.push([x0, z0, x1, z1]), trunk = (x, z, rr = 0.55) => wall(x - rr, z - rr, x + rr, z + rr), swayAmp = after ? 0 : 1;
  groundPlane(g, 0, 900, T.grass([200, 200], after ? [100, 108, 62] : today ? [84, 122, 56] : [78, 116, 54]));
  lane(g, -70, 70, 0, 5.2, old ? 'dirt' : 'tar');
  if (after) { blotches(g, [-46, -13, 52, 13], 46, { seed: 3, colors: [0x6a5a3a, 0x7a6a44, 0x5a4a30, 0x6a6040] }); for (const [x, z, s] of [[-18, 0.6, 3], [22, -1.2, 2.6], [36, 1.4, 3.2], [-34, -0.4, 2.4]]) { const m = mesh(new THREE.CircleGeometry(s * 0.6, 16), solid(0x6a5036, 0.4, 0, { transparent: true, opacity: 0.8 }), x, 0.03, z, g); m.rotation.x = -PI / 2; m.scale.y = 0.55; } }
  else { grassField(g, [-46, -13, 52, 13], 1600, { seed: 2, clear: [[-70, -2.8, 70, 2.8], [-29.8, -11, -22, -4.5], [13, -11, 19, -4.5], [-6.8, 4.8, -1.2, 10.7]], h: today ? 0.35 : 0.6 }); flowerField(g, [-44, -12, 50, 12], today ? 120 : 220, { seed: 5, clear: [[-70, -2.8, 70, 2.8]] }); }
  rockField(g, [-46, -13, 52, 13], 22, { seed: 6, clear: [[-70, -2.4, 70, 2.4], [34, -12, 54, -6], [24.8, -4.8, 27.2, -2.6]], size: 0.3 });   /* no stones in the road, in the houses along the far side or at the post (the audit found stones inside them) */
  { const hr = hillRing(150, 16, 52, { seed: 4, base: after ? [0.27, 0.34, 0.2] : [0.2, 0.42, 0.22] }); if (y51) hr.children.filter((c) => c.position.z > -20).forEach((c) => hr.remove(c)); g.add(hr); }
  if (y51) {   /* the sea to the south: a strip of sand, then water */
    const sand = mesh(new THREE.PlaneGeometry(160, 5.5), std(T.sand([32, 1]), 1), 3, 0.015, 14.6, g); sand.rotation.x = -PI / 2;
    const sea = mesh(new THREE.PlaneGeometry(500, 300), std(T.water([70, 40]), 0.35), 0, 0.03, 17.4 + 150, g); sea.rotation.x = -PI / 2; }
  const sw = (o, a) => swayable(o, a * 0.018), put = (o, x, z, ry = 0) => { o.position.set(x, 0, z); o.rotation.y = ry; g.add(o); return o; };
  const tone = [[226, 196, 150], [200, 228, 214], [244, 226, 176], [212, 182, 206]];

  /* ---- the family's house: a board house in 1988, painted block in 2025 ---- */
  const home = house({ w: 6.4, d: 4.4, style: old ? 'board' : 'block', wall: old ? [186, 152, 104] : tone[0], roofRgb: old ? [150, 124, 108] : today ? [196, 200, 198] : [150, 154, 150], roof: after ? 'half' : 'on', shutters: after ? 'boarded' : 'open', seed: 11, tarp: false });
  put(home, SPOT.home[0], SPOT.home[1]); wall(-29.8, -10.8, -22.2, -4.55); g.userData.home = home;
  /* ---- Miss Hyacinth's old board house ---- */
  const hy = house({ w: 5.2, d: 4, style: 'board', wall: [198, 176, 130], roofRgb: after ? [140, 140, 136] : [144, 120, 104], roof: after ? 'off' : 'on', shutters: after ? 'closed' : 'open', seed: 12, shutCol: 0x3a6a8a, damaged: after ? 1 : 0 });
  put(hy, SPOT.hyacinth[0], SPOT.hyacinth[1], PI); wall(-6.8, 4.75, -1.2, 10.7);
  /* ---- the block house of the neighbour (Mass Clifford in 1988, his son Raymond in 2025) ---- */
  const bl = house({ w: 6, d: 4.4, style: 'block', wall: old ? [236, 224, 196] : tone[2], roofRgb: after ? [150, 154, 150] : [150, 154, 150], roof: after ? 'half' : 'on', shutters: after ? 'boarded' : 'open', seed: 13, tank: !old, tarp: after, shutCol: 0x2a5a8a });
  put(bl, SPOT.raymond[0], SPOT.raymond[1]); wall(12.8, -11.1, 19.2, -4.55); if (!old) wall(20.6, -9.9, 22.3, -8.4);   /* the tank stand */
  /* ---- the shop ---- */
  const sh = shop({ name: y51 ? "MISS ADA'S SHOP" : y88 ? "DORRIT'S SHOP" : "BEV'S SHOP", roof: after ? 'off' : 'on', seed: 14 }); put(sh, SPOT.shop[0], SPOT.shop[1], PI); wall(27.2, 5.7, 32.8, 10.9);
  if (!after) { const gd = shopGoods(); gd.position.set(SPOT.shop[0], 0, SPOT.shop[1]); gd.rotation.y = PI; g.add(gd); }
  /* ---- the church and its hall, at the east end ---- */
  const ch = house({ w: 11, d: 7, h: 3.5, style: 'block', wall: [238, 232, 214], roofRgb: after ? [140, 146, 148] : today ? [196, 200, 198] : [138, 146, 150], roof: after ? 'half' : 'on', shutters: after ? 'closed' : 'open', seed: 15, porch: true, shutCol: 0x3a5a7a });
  put(ch, SPOT.church[0], SPOT.church[1]); wall(38.3, -13.7, 49.7, -4.3);
  { const bt = grp(g, 40.2, 0, -5.5); box(1.2, 3.2, 1.2, std(T.plaster([236, 230, 214], [1, 1]), 0.9), 0, 1.6, 0, bt); const rf = box(1.5, 0.12, 1.5, solid(0x8a8e90, 0.6, 0.3), 0, 3.3, 0, bt); box(0.1, 0.8, 0.1, WOODD, 0, 3.8, 0, bt); box(0.5, 0.1, 0.1, WOODD, 0, 3.95, 0, bt); wall(39.5, -6.3, 40.9, -4.7); }
  { const s = plane(2.4, 0.5, std(T.sign(y51 ? 'BAY CHURCH' : 'BREADNUT CORNER COMMUNITY CHURCH', 1024, 160, '#f3ecd8', '#1c2a40', '700 70px Georgia, serif'), 0.9), 44, 3.9, -6.45, g); s.rotation.y = 0; s.material = s.material.clone(); s.material.side = THREE.DoubleSide; box(0.06, 0.4, 0.06, WOODD, 43, 3.6, -6.5, g); box(0.06, 0.4, 0.06, WOODD, 45, 3.6, -6.5, g); }

  /* ---- the standpipe at the lane's edge, and the poles with wires ---- */
  { const sp = standpipeTap(); put(sp, SPOT.standpipe[0], SPOT.standpipe[1], 0); wall(SPOT.standpipe[0] - 0.4, SPOT.standpipe[1] - 0.35, SPOT.standpipe[0] + 0.4, SPOT.standpipe[1] + 0.35); }
  const poleXs = y51 ? [] : [-44, -30, -16, -2, 12, 26, 40];   /* no poles or wires by the sea in 1951 */ poleXs.forEach((x, i) => { if (after && (i === 3 || i === 4)) return; const p = pole(7.2); put(p, x, -3.6, 0.1); p.rotation.y = PI / 2; wall(x - 0.2, -3.8, x + 0.2, -3.4); });
  const wireM = solid(0x1a1a1c, 0.6);
  for (let i = 0; i < poleXs.length - 1; i++) { if (after && (i >= 2 && i <= 4)) continue; for (const dz of [-0.45, 0, 0.45]) { const L = poleXs[i + 1] - poleXs[i], w = box(L, 0.02, 0.02, wireM, (poleXs[i] + poleXs[i + 1]) / 2, 6.75, -3.6 + dz, g); } }

  /* ---- trees and plants ---- */
  const mango = after ? fallenTree({ len: 8.5, seed: 4 }) : mangoTree(6.6, 3);
  if (after) { mango.rotation.y = PI / 2; mango.position.set(SPOT.mango[0], 0, SPOT.mango[1] + 1.0); mango.userData.noBatch = true; g.add(mango); wall(-13.2, -5.3, -10.8, 4.4); g.userData.fallen = mango; g.userData.treeWall = walls[walls.length - 1]; const lg = cutLogs({ seed: 3 }); lg.position.set(-12, 0, 4.6); lg.visible = false; lg.userData.noBatch = true; lg.userData.soft = true;   /* the logs take the fallen tree's place: the two are never seen together (engine/audit.js) */ g.add(lg); g.userData.logs = lg; }
  else { sw(put(mango, SPOT.mango[0], SPOT.mango[1] - 3.2), swayAmp); trunk(SPOT.mango[0], SPOT.mango[1] - 3.2, 0.5); }
  if (today && !after) { const st = stump(); put(st, -12, -0.5); }
  const veg = [[-34, -9, 'palm'], [-33, 9, 'palm'], [8, -9, 'tree'], [22, 10, 'palm'], [-14, 10, 'tree'], [26, -9, 'palm'], [-40, 4, 'tree'], [35, -4.8, 'palm'], [47, 7, 'palm'], [2, 11, 'banana'], [3, -9, 'banana'], [-18, -9, 'banana'], [-20, 8, 'banana'], [11, 10, 'banana'], [-37, -8.5, 'banana'], [-38, -6.5, 'banana'], [34, -9, 'banana'], [49, -2, 'tree']];
  veg.forEach(([x, z, k], i) => {
    if (after) {
      if (k === 'palm') { const o = i % 2 ? snappedPalm(6, i) : bareTree(5, i); put(o, x, z, r() * 6); if (i % 2) wall(x - 0.4, z - 0.4, x + 0.4, z + 0.4); else trunk(x, z, 0.45); }
      else if (k === 'tree') { put(bareTree(5.5, i), x, z, r() * 6); trunk(x, z, 0.5); }
      else { const b = banana(i, false); b.rotation.z = (i % 2 ? 1 : -1) * (1.2 + r() * 0.3); b.position.set(x, 0.3, z); b.rotation.y = r() * 6; g.add(b); }
    } else {
      const o = k === 'palm' ? palm(6 + r() * 3, i) : k === 'tree' ? tree(5 + r() * 3, i) : banana(i, i % 3 === 0 && !today);
      if (today && k === 'banana') o.scale.setScalar(0.65); if (today && k === 'palm') o.scale.setScalar(0.85);
      put(sw(o, k === 'banana' ? 2.2 : 1), x, z, r() * 6); if (k !== 'banana') trunk(x, z, 0.4); }
  });
  const bushKeep = [];
  scatter(g, (i) => { const b = bush(i, 1.0); return b; }, after ? 6 : 28, [-46, -13, 52, 13], [[-70, -3.4, 70, 3.4], [-30, -11, -22, -4], [12, -11, 20, -4], [-7, 4, -1, 11], [26, 5, 33, 11], [37, -14, 51, -4], [-14, -6, -10, 4]], 9).forEach((b) => bushKeep.push([b.position.x, b.position.z, 0.85]));   /* each bush is about 0.8 m round: its footprint keeps the crowd and anyone following you out of it (P.keepOut; ?test=audit, auditBodies) */
  if (!after) for (const [x, z, s] of [[-16.5, -11.5, 1], [24, 11.5, 2], [-1.5, -10, 3]]) put(hibiscus(s), x, z);
  if (!after && !today) put(flameTree(6.5, 5), 4, -11.5);
  if (!old || after) for (let i = 0; i < 2; i++) put(croton(i + 1), -31 + i * 1.5, -4.6 + i * 0.2);
  /* yard fences: the sides of the family yard and Miss Hyacinth's */
  if (!after) { fence(g, -33.5, -12.4, -33.5, -4.8); fence(g, -21.5, -12.4, -21.5, -4.8); fence(g, -7.5, 5.4, -7.5, 12); fence(g, -0.5, 5.4, -0.5, 12); wall(-7.6, 5.3, -7.4, 12); wall(-0.6, 5.3, -0.4, 12); }   /* the two yard fences north of the lane are solid: nobody walks through them */
  else { fence(g, -33.5, -12.4, -33.5, -4.8); }

  /* ---- things people do or find, by chapter ---- */
  if (!after) {
    /* the standpipe's drums and the plywood for the windows: shown in the 'before' places only */
    const drum = waterDrum(); drum.userData.noBatch = true; put(drum, SPOT.standpipe[0] + 1.0, SPOT.standpipe[1] + 0.1); wall(SPOT.standpipe[0] + 0.62, SPOT.standpipe[1] - 0.2, SPOT.standpipe[0] + 1.38, SPOT.standpipe[1] + 0.4); g.userData.drum = drum;
    const ply = grp(g); const pw = [-27.9, -24.1].map((x) => { const pg = grp(ply, x, 0, SPOT.home[1] + 2.28); pg.visible = false; pg.userData.noBatch = true; const p = plywood(1.25, 1.05); p.position.set(0, 0.77, 0); pg.add(p); box(1.3, 0.06, 0.04, WOOD, 0, 0.82, 0.03, pg); return pg; });
    ply.userData.noBatch = true; g.userData.boards = pw; const lean = plywood(1.2, 2.2); lean.position.set(-31.2, 0, -5.6); lean.rotation.set(-0.3, 0.5, 0); g.add(lean); wall(-31.9, -6.0, -30.5, -5.0);
    if (!old) {
    const ladder = grp(g, SPOT.raymond[0] - 1.3, 0, SPOT.raymond[1] + 2.3); for (const s of [-0.22, 0.22]) { const rl = box(0.05, 3.4, 0.05, WOOD, s, 1.55, 0.7, ladder); rl.rotation.x = -0.28; } for (let k = 0; k < 7; k++) box(0.44, 0.04, 0.04, WOOD, 0, 0.35 + k * 0.42, 0.7 - (0.35 + k * 0.42) * 0.28 + 0.06, ladder);
    wall(SPOT.raymond[0] - 1.6, SPOT.raymond[1] + 2.4, SPOT.raymond[0] - 1.0, SPOT.raymond[1] + 3.1);
    const bag = goBag(); bag.userData.noBatch = true; put(bag, -22.7, -4.35); g.userData.bag = bag; { const rd = radio(); rd.position.set(-25.2, 0.28, -5.4); rd.rotation.y = 0.3; g.add(rd); }
    }
    if (y51) { const cn = dugOut(); cn.userData.noBatch = true; put(cn, 10, 13.4, 0); g.userData.canoe = cn; }   /* a canoe on the sand, to be hauled up the beach */
    if (y88) { const cl = grp(g, -20, 0, -9); for (const x of [-1.6, 1.6]) box(0.08, 2.0, 0.08, WOOD, x, 1.0, 0, cl); box(3.2, 0.02, 0.02, solid(0xd8d0b8, 1), 0, 1.9, 0, cl); const rag = grp(cl); rag.userData.noBatch = true; for (let k = 0; k < 4; k++) box(0.5, 0.6, 0.03, solid([0xe8505b, 0x3ba0a0, 0xf0c040, 0xf0ece0][k], 1), -1.2 + k * 0.8, 1.55, 0, rag); g.userData.washing = rag; wall(-21.8, -9.3, -18.2, -8.7); }
  }
  if (after) {
    /* wreckage: loose zinc, planks, branches, clothes, a mattress, a leaning pole with wires down */
    const keep = [[-30, -11, -22, -4.5], [-7, 4.7, -1, 10.8], [12.8, -11, 19.4, -4.5], [27, 5.6, 33, 11], [38, -14, 50, -4], [-13.4, -5.4, -10.6, 4.5], [-4.5, -4.2, 3.6, 3.2]];
    const free = (x, z) => !keep.some((k) => x > k[0] - 0.8 && x < k[2] + 0.8 && z > k[1] - 0.8 && z < k[3] + 0.8) && !walls.some((w) => x > w[0] - 0.7 && x < w[2] + 0.7 && z > w[1] - 0.7 && z < w[3] + 0.7);
    let n = 0, tries = 0; while (n < 38 && tries++ < 400) { const x = -44 + r() * 94, z = -12.5 + r() * 25; if (!free(x, z)) continue; const k = r(); const o = k < 0.5 ? zincSheet({ len: 1.8 + r() * 1.6, curl: 0.1 + r() * 0.6, seed: n + 1, rgb: r() < 0.5 ? [150, 154, 150] : [160, 120, 100] }) : k < 0.78 ? plank(1 + r() * 1.5, n) : branch(1.6 + r() * 1.6, n); put(o, x, z, r() * 6); n++; }
    for (const [x, z] of [[-26.8, -3.0], [-31.8, -1.2], [35, 3.4], [-2.8, 5.5]]) { if (free(x, z) || true) put(clothes(), x, z, r() * 6); }
    put(mattress(0xd8c8a0), -31.4, -2.4, 0.4); put(mattress(0xc8d8d0), 15, 4.2, -0.5);
    { const lp = leaningPole({ lean: 0.38, seed: 3 }); put(lp, -2, -3.6, 0); lp.rotation.y = 0; wall(-9.4, -4.0, 0.4, -3.0); }   /* the wire's side of the lane edge: it lies along the north verge */
    put(tarpOnGround(), 24.5, -6.7, 0.3);
    { const tm = tarpMesh(6.4, 4.4, 2.7, 1.25); tm.position.set(SPOT.home[0], 0, SPOT.home[1]); tm.visible = false; tm.userData.noBatch = true; g.add(tm); g.userData.tarpHome = tm; }
    { const hl = new THREE.PointLight(0xffd08a, 0, 9, 1.7); hl.position.set(SPOT.home[0], 2.0, SPOT.home[1] + 3.6); hl.visible = false; g.add(hl); g.userData.homeLamp = hl; }
    { const tk = waterTruck(); tk.position.set(26, 0, 1.1); g.add(tk); wall(22.5, -0.1, 29.5, 2.3); }
  }
  if (today) { const bd = grp(g, 36, 0, 3.4); box(0.12, 1.6, 0.12, WOODD, -0.9, 0.8, 0, bd); box(0.12, 1.6, 0.12, WOODD, 0.9, 0.8, 0, bd); const s = plane(1.9, 1.0, std(T.sign('BREADNUT CORNER READY PLAN', 512, 270, '#f3ecd8', '#1c2a40', '700 44px Georgia, serif', true), 0.9), 0, 1.35, 0.08, bd); s.material = s.material.clone(); s.material.side = THREE.DoubleSide; wall(34.9, 3.0, 37.1, 3.9); g.userData.planBoard = [36, 3.4]; for (const [x, z] of [[-31, -1.5], [30, -1]]) { const lg = cutLogs({ seed: x }); put(lg, x, z, 0.3); } }

  /* ---- people ---- */
  const A = { people, extras };
  if (y51) {
    people.push(person('papa51', 'papa51', 'Papa', -27.6, -3.3, 0.1, { h: 1.8 }), person('mama51', 'mama51', 'Mama', -23.3, -3.2, -0.2, { h: 1.7 }), person('cyril', 'cyril', 'Mass Cyril', 7.6, 9.6, -0.6, { h: 1.75 }), person('ivy', 'ivy51', 'Miss Ivy', 14.6, -3.4, 0.2, { h: 1.6 }));
    extras.push(extra('mama51', 4.4, 6.6, PI, 'Talk1', { skin: 1.1 }), extra('papa51', 31, 4.4, PI, 'Talk2', { skin: 0.95 }));
    const fl = folk(4, 51, [-8, 4.2, 40, 5.2], { kids: 0.25, modern: false }); extras.push(...walkers(fl, 5, [-40, 3.8, 46, 6.2], 0.5, 6));
  } else if (y88) {
    people.push(person('dad', 'dad88', 'Dad', -27.6, -3.3, 0.1, { h: 1.85 }), person('mama', 'mama88', 'Mama', -23.3, -3.2, -0.2, { h: 1.75 }), person('delroy', 'delroy88', 'Delroy', -30.4, -1.6, 0.5, { h: 1.2 }), person('clifford', 'clifford88', 'Mass Clifford', 14.6, -3.4, 0.2, { h: 1.75 }));
    extras.push(extra('mama88', 4.4, 6.6, PI, 'Talk1', { skin: 1.1 }), extra('dad88', 31, 4.4, PI, 'Talk2', { skin: 0.95 }));
    const fl = folk(5, 31, [-8, 4.2, 40, 5.2], { kids: 0.25, modern: false }); extras.push(...walkers(fl, 5, [-40, 3.8, 46, 6.2], 0.5, 6));
  } else if (!after && !today) {
    people.push(person('pearl', 'pearl', 'Mum', -27.6, -3.3, 0.1, { h: 1.75 }), person('winston', 'winston', 'Grandpa', -23.2, -3.0, -0.3, { h: 1.7 }), person('bev', 'bev', 'Miss Bev', 30, 4.9, PI, { h: 1.78 }), person('raymond', 'raymond', 'Mr. Raymond', 14.2, -3.2, 0.1, { h: 1.84 }), person('hyacinth', 'hyacinth', 'Miss Hyacinth', -3.8, 4.2, PI, { h: 1.6 }));
    extras.push(extra('marlon', -30.4, -1.6, 0.5, 'Idle', { skin: 1.05 }), extra('youth', 8.2, 5.4, PI * 0.8, 'Talk1', { skin: 1.0 }));
    const fl = folk(5, 41, [-8, 4.2, 40, 5.4], { kids: 0.2 }); extras.push(...walkers(fl, 6, [-40, 3.8, 46, 6.4], 0.55, 6));
  } else if (after) {
    people.push(person('pearlA', 'pearl', 'Mum', 33.6, -1.4, PI * 0.5, { h: 1.75 }), person('winstonA', 'winston', 'Grandpa', 38.4, 1.4, -PI * 0.5, { h: 1.7 }), person('hyacinthA', 'hyacinth', 'Miss Hyacinth', -3.8, 4.2, PI, { h: 1.6 }), person('raymondA', 'raymond', 'Mr. Raymond', 17.5, -3.4, 0.3, { h: 1.84 }),
      person('soldier', 'soldier', 'The soldier', 27.8, -2.2, 0.3, { h: 1.8, hidden: true, stage5: true }), person('youth', 'youth', 'Jordan', 41.4, 2.6, -0.4, { h: 1.65, hidden: true, stage5: true }));
    extras.push(...walkers(folk(6, 51, [-10, 4.2, 46, 6.2], { kids: 0.15, anims: ['Idle', 'Talk1', 'Sad1', 'Idle'] }), 8, [-8, 3.9, 46, 6.4], 0.5, 5));
    extras.push(extra('sawman', -14.6, 5.2, 0.2, 'Idle'), extra('lineman', 4.8, -2.4, PI * 0.5, 'Idle'), extra('soldier', 25.6, 3.4, PI, 'Talk2', { skin: 1.1 }));
  } else {
    people.push(person('teacher', 'teacher', 'Miss Campbell', 33.4, 4.4, PI, { h: 1.7 }), person('student', 'student', 'Andre', 38.6, 4.3, PI * 1.2, { h: 1.55 }), person('winstonT', 'winston', 'Grandpa', -23.2, -3.0, -0.3, { h: 1.7 }));
    extras.push(...walkers(folk(6, 61, [-10, 4.2, 40, 6.2], { kids: 0.25 }), 9, [-8, 3.9, 40, 6.4], 0.55, 6));
  }
  const env = after ? ENV.after : today ? ENV.day : y88 ? ENV.calm : ENV.calm;
  return { id, keepOut: bushKeep, group: g, tarpHome: g.userData.tarpHome, homeLamp: g.userData.homeLamp, walls, bounds: { x0: -46, x1: 51, z0: -12.6, z1: 12.4 }, start: { x: !after ? -35 : 36, z: 0.4, yaw: -PI / 2 }, people, extras, env, eye: 1.32,
    spots: { standpipe: [SPOT.standpipe[0], SPOT.standpipe[1] - 1.1], shop: [SPOT.shop[0], SPOT.shop[1] - 3.2], boards: [-26, -3.7], bag: [-22.7, -3.6], ladder: [SPOT.raymond[0] - 1.3, SPOT.raymond[1] + 3.6], washing: [-20, -7.6], home: [-26, -3.4], hyacinth: [-4, 4.4], clifford: [SPOT.raymond[0], -3.6], church: [44, -3.8], wire: [-4, -2.0], tree: [-12, 5.0], tarp: [-26, -3.6], truck: [24, 2.2], plan: [36, 2.2], canoe: [10, 10.4] },
    titleView: { x: -33, y: 1.5, z: 3, pitch: 0.02, yaw: -PI / 2 + 0.15 }, tick: () => {} };
}
export const buildYard51 = () => village({ id: 'yard51', year: 51, phase: 'before' });
export const buildYard88 = () => village({ id: 'yard88', year: 88, phase: 'before' });
export const buildYard25 = () => village({ id: 'yard25', year: 25, phase: 'before' });
export const buildAfter = () => village({ id: 'after', year: 25, phase: 'after' });
export const buildToday = () => village({ id: 'today', year: 25, phase: 'today' });

/* ============ a room with a zinc roof (Mass Clifford's block house, 1988) ============ */
export function buildRoom88(year = 88) {
  const g = grp(), walls = [], people = [], extras = [], W = 5.8, D = 4.2, H = 2.6, t = 0.16;
  const wm = std(T.plaster([228, 214, 176], [1, 1], 'rgba(120,100,80,0.2)').clone(), 0.92), fl = std(T.plank([120, 84, 56], 8, [3, 2]), 0.9), dark = solid(0x1c1a18, 0.9);
  const floor = box(W + 0.6, 0.1, D + 0.6, fl, 0, -0.05, 0, g);
  box(W, H, t, wm, 0, H / 2, -D / 2, g); box(t, H, D, wm, -W / 2, H / 2, 0, g); box(t, H, D, wm, W / 2, H / 2, 0, g);
  box(W / 2 - 0.55, H, t, wm, -(W / 4 + 0.275), H / 2, D / 2, g); box(W / 2 - 0.55, H, t, wm, (W / 4 + 0.275), H / 2, D / 2, g); box(1.1, H - 2.05, t, wm, 0, 2.05 + (H - 2.05) / 2, D / 2, g);   /* the doorway is in the middle of the front wall */
  for (const s of [-1, 1]) { const gb = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-D / 2, 0), new THREE.Vector2(D / 2, 0), new THREE.Vector2(0, 1.1)])), wm.clone(), s * (W / 2), H, 0, g); gb.rotation.y = -s * PI / 2; gb.material.side = THREE.DoubleSide; }
  const roof = roofOf(W, D, H, { rise: 1.1, rgb: [150, 140, 128], over: 0.25 }); g.add(roof); g.userData.roof = roof; roof.userData.noBatch = true;
  walls.push([-W / 2 - 0.1, -D / 2 - 0.2, W / 2 + 0.1, -D / 2 + 0.1], [-W / 2 - 0.1, -D / 2, -W / 2 + 0.1, D / 2], [W / 2 - 0.1, -D / 2, W / 2 + 0.1, D / 2], [-W / 2, D / 2 - 0.1, -0.55, D / 2 + 0.2], [0.55, D / 2 - 0.1, W / 2, D / 2 + 0.2]);
  /* a back window with its shutters closed and a plank across */
  box(0.9, 1.0, 0.04, dark, -1.2, 1.5, -D / 2 + t / 2 + 0.01, g); for (const s of [-0.22, 0.22]) box(0.44, 1.0, 0.05, solid(0x3a5a8a, 0.9), -1.2 + s, 1.5, -D / 2 + t / 2 + 0.05, g); box(1.1, 0.1, 0.05, WOOD, -1.2, 1.5, -D / 2 + t / 2 + 0.1, g);
  /* a table with a kerosene lamp and a radio, chairs, a bed with a mattress and a blanket, a cupboard */
  const table = grp(g, 1.0, 0, -0.6); box(1.5, 0.07, 0.9, WOOD, 0, 0.74, 0, table); for (const [x, z] of [[-0.65, -0.38], [0.65, -0.38], [-0.65, 0.38], [0.65, 0.38]]) box(0.07, 0.72, 0.07, WOODD, x, 0.36, z, table); const lamp = kerosene(); lamp.position.set(0.3, 0.775, 0); table.add(lamp); if (year === 88) { const rd = radio(); rd.position.set(-0.35, 0.775, 0.05); table.add(rd); } walls.push([0.1, -1.1, 1.9, -0.1]);
  for (const [x, z, ry] of [[-0.2, 0.3, 0.8], [2.0, 0.4, -0.7]]) { const c = grp(g, x, 0, z); c.rotation.y = ry; box(0.45, 0.05, 0.45, WOOD, 0, 0.45, 0, c); box(0.45, 0.5, 0.05, WOOD, 0, 0.72, -0.2, c); for (const [a, b] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) box(0.05, 0.43, 0.05, WOODD, a, 0.21, b, c); }
  const bed = grp(g, -2.15, 0, -0.5); box(1.1, 0.34, 2.0, WOODD, 0, 0.17, 0, bed); box(1.0, 0.16, 1.9, solid(0xd8c8a0, 1), 0, 0.42, 0, bed); box(0.95, 0.08, 1.0, solid(0x3ba0a0, 1), 0, 0.54, 0.4, bed); box(0.5, 0.1, 0.3, solid(0xf0ece0, 1), 0, 0.55, -0.8, bed); walls.push([-2.75, -1.55, -1.55, 0.55]);
  const cup = grp(g, -2.3, 0, -D / 2 + 0.4); box(0.9, 1.7, 0.45, WOOD, 0, 0.85, 0, cup); walls.push([-2.8, -D / 2 + 0.05, -1.85, -D / 2 + 0.7]);
  for (const x of [-2.2, 2.2]) { const lm = lantern(); lm.position.set(x, 0, D / 2 - 0.5); }
  const lampL = new THREE.PointLight(0xffc878, 5, 9, 1.6); lampL.position.set(1.3, 1.2, -0.6); g.add(lampL);
  const inside = [[-2.4, 0.5, 0.6, 'dad'], [0, 0.3, 0.8, 'mama']];
  if (year === 51) people.push(person('papaR51', 'papa51', 'Papa', -1.7, 1.1, PI * 0.5, { h: 1.8 }), person('mamaR51', 'mama51', 'Mama', -0.8, 0.1, -0.5, { h: 1.7 }), person('ivyR51', 'ivy51', 'Miss Ivy', 2.2, 0.9, -1.2, { h: 1.6 }));
  else people.push(person('dadR', 'dad88', 'Dad', -1.7, 1.1, PI * 0.5, { h: 1.85 }), person('mamaR', 'mama88', 'Mama', -0.8, 0.1, -0.5, { h: 1.75 }), person('delroyR', 'delroy88', 'Delroy', -1.3, -1.3, 0.6, { h: 1.2 }), person('cliffordR', 'clifford88', 'Mass Clifford', 2.2, 0.9, -1.2, { h: 1.75 }));
  return { id: year === 51 ? 'room51' : 'room88', group: g, walls, bounds: { x0: -W / 2 + 0.4, x1: W / 2 - 0.4, z0: -D / 2 + 0.4, z1: D / 2 - 0.1 }, start: { x: 0, z: D / 2 - 0.5, yaw: 0.0 }, people, extras, env: ENV.room, eye: 1.2,
    spots: { door: [0, D / 2 - 0.4], radio: [1.0, 0.5], lamp: [1.3, 0.3], window: [-1.2, -D / 2 + 0.8] }, lampLight: lampL, titleView: null, tick: () => {} };
}

export const buildRoom51 = () => buildRoom88(51);

/* ============ the church hall, used as a shelter in 2025 ============ */
export function buildHall() {
  const g = grp(), walls = [], people = [], extras = [], W = 14, D = 8, H = 3.4, t = 0.2, seat = 0.42;
  const wm = std(T.plaster([232, 226, 206], [1, 1], 'rgba(110,100,80,0.25)').clone(), 0.92), fl = std(T.concrete([6, 3], [150, 146, 136]), 0.95), dark = solid(0x1c1a18, 0.9), blue = solid(0x3a5a8a, 0.9);
  box(W + 0.8, 0.1, D + 0.8, fl, 0, -0.05, 0, g);
  box(W, H, t, wm, 0, H / 2, -D / 2, g); box(W, H, t, wm, 0, H / 2, D / 2, g); box(t, H, D, wm, W / 2, H / 2, 0, g);
  box(t, H - 2.3, D, wm, -W / 2, 2.3 + (H - 2.3) / 2, 0, g);   /* the west wall: the double doors are in it */
  box(t, 2.3, 2.2, wm, -W / 2, 1.15, -D / 2 + 1.1, g); box(t, 2.3, 2.2, wm, -W / 2, 1.15, D / 2 - 1.1, g);
  walls.push([-W / 2 - 0.1, -D / 2 - 0.2, W / 2 + 0.2, -D / 2 + 0.1], [-W / 2 - 0.1, D / 2 - 0.1, W / 2 + 0.2, D / 2 + 0.2], [W / 2 - 0.1, -D / 2, W / 2 + 0.2, D / 2], [-W / 2 - 0.2, -D / 2, -W / 2 + 0.1, -D / 2 + 2.2], [-W / 2 - 0.2, D / 2 - 2.2, -W / 2 + 0.1, D / 2]);
  for (const s of [-1, 1]) { const gb = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-D / 2, 0), new THREE.Vector2(D / 2, 0), new THREE.Vector2(0, 1.5)])), wm.clone(), s * (W / 2), H, 0, g); gb.rotation.y = -s * PI / 2; gb.material.side = THREE.DoubleSide; }
  const roof = roofOf(W, D, H, { rise: 1.5, rgb: [140, 146, 150], over: 0.3 }); g.add(roof); g.userData.roof = roof; roof.userData.noBatch = true;
  /* windows on the long walls, shutters closed with a bar across */
  for (const s of [-1, 1]) for (const x of [-4.6, -1.5, 1.6, 4.6]) { box(1.1, 1.1, 0.05, dark, x, 1.8, s * (D / 2 - t / 2 - 0.0), g); for (const q of [-0.27, 0.27]) box(0.54, 1.12, 0.06, blue, x + q, 1.8, s * (D / 2 - t / 2 - 0.04), g); box(1.3, 0.1, 0.06, WOOD, x, 1.8, s * (D / 2 - t / 2 - 0.09), g); }
  /* a platform with a lectern at the east end, a cross on the wall, a table with food and water at the side */
  box(2.2, 0.35, D - 1.2, WOOD, W / 2 - 1.4, 0.175, 0, g); walls.push([W / 2 - 2.5, -D / 2 + 0.6, W / 2, D / 2 - 0.6]);
  const lec = grp(g, W / 2 - 1.0, 0.35, 0); box(0.7, 1.0, 0.5, WOODD, 0, 0.5, 0, lec); const cross = grp(g, W / 2 - 0.12, 2.3, 0); box(0.1, 1.2, 0.5, WOODD, 0, 0, 0, cross); box(0.1, 0.5, 1.0, WOODD, 0, 0.2, 0, cross);
  const tbl = grp(g, 0.5, 0, -D / 2 + 0.9); box(2.6, 0.07, 0.8, WOOD, 0, 0.78, 0, tbl); for (const x of [-1.2, 1.2]) for (const z of [-0.32, 0.32]) box(0.07, 0.76, 0.07, WOODD, x, 0.38, z, tbl); const brd = bread(); brd.position.set(-0.8, 0.815, 0); tbl.add(brd); for (let i = 0; i < 3; i++) { const j = jug(); j.position.set(0.1 + i * 0.3, 0.815, 0.05); tbl.add(j); } const kt = grp(tbl, 1.0, 0.815, 0); cyl(0.14, 0.17, 0.26, solid(0xc8c8c0, 0.4, 0.5), 0, 0.13, 0, kt, 10); walls.push([-0.9, -D / 2 + 0.4, 1.9, -D / 2 + 1.4]);
  const dr = waterDrum(); dr.position.set(3.8, 0, -D / 2 + 0.7); g.add(dr); walls.push([3.45, -D / 2 + 0.35, 4.15, -D / 2 + 1.05]);
  /* the pews: rows of benches facing the platform. Each pew is a bench with a back; people sit on it at the heights the audit expects. */
  const pew = (x, z, n) => { const p = grp(g, x, 0, z); p.rotation.y = PI / 2; const L = n * 0.78 + 0.2; for (const zz of [-0.17, 0, 0.17]) box(L, 0.06, 0.16, WOOD, 0, seat - 0.03, zz, p); box(L, 0.4, 0.05, WOOD, 0, seat + 0.3, -0.25, p); for (const sx of [-L / 2 + 0.1, L / 2 - 0.1]) { box(0.07, seat, 0.5, WOODD, sx, seat / 2, 0, p); box(0.07, 0.62, 0.06, WOODD, sx, seat + 0.2, -0.26, p); } return { x, z, n }; };
  const rows = [[-3.2, -2.45], [-3.2, 2.45], [-0.8, -2.45], [-0.8, 2.45], [1.6, -2.45], [1.6, 2.45]], seats = [];
  rows.forEach(([x, z]) => { const p = pew(x, z, 3); walls.push([x - 0.4, z - 1.3, x + 0.4, z + 1.3]); for (let k = 0; k < 3; k++) seats.push({ x, z: z - (k - 1) * 0.78, taken: false }); });
  /* mattresses, blankets and bags on the floor between the rows */
  for (const [x, z, c] of [[-5.9, -2.7, 0xd8c8a0], [-5.9, 2.7, 0xc8d8d0], [-5.9, 1.5, 0xd8c0b0]]) { const m = mattress(c); m.position.set(x, 0, z); m.rotation.y = PI / 2; g.add(m); }
  for (const [x, z] of [[-5.2, -1.8], [-1.6, 1.8], [2.8, -0.4], [3.4, 2.4], [-5.6, 2.6]]) { const b = goBag([0x3a5a8a, 0x8a3a3a, 0x3a6a4a, 0x6a5a3a, 0x4a4a6a][(Math.abs(x * 3 | 0)) % 5]); b.position.set(x, 0, z); b.rotation.y = x; g.add(b); }
  /* lamps: two real lights, a few glowing bulbs */
  const lights = []; for (const x of [-3.5, 3.5]) { const l = new THREE.PointLight(0xffd8a0, 7, 13, 1.5); l.position.set(x, 2.8, 0); g.add(l); lights.push(l); box(0.18, 0.18, 0.18, new THREE.MeshBasicMaterial({ color: 0xffeac0 }), x, 3.0, 0, g); cyl(0.01, 0.01, 0.3, dark, x, 3.2, 0, g, 4); box(0.05, 0.5, 0.05, dark, x, 3.35, 0, g); box(0.5, 0.06, 0.06, WOODD, x, 3.4, 0, g); }
  g.userData.noBatchLights = true;
  const place = (who, look, label, x, z, extra2 = {}) => person(who, look, label, x, z, PI / 2, { h: 1.7, ...extra2 });
  const sat = (i, who, look, label, o = {}) => { const s = seats[i]; s.taken = true; return person(who, look, label, s.x, s.z, PI / 2, { anim: 'SitIdle', seat, h: 1.35, ...o }); };
  people.push(sat(2, 'gloria', 'gloria', 'Gran', { h: 1.4 }), sat(4, 'winstonH', 'winston', 'Grandpa', { h: 1.4 }), sat(7, 'hyacinthH', 'hyacinth', 'Miss Hyacinth', { h: 1.3 }),
    person('pearlH', 'pearl', 'Mum', -3.2, 0.3, PI / 2, { h: 1.75 }), person('pastor', 'pastor', 'Pastor Gayle', W / 2 - 3.2, 1.4, -PI / 2, { h: 1.85 }), person('simone', 'simone', 'Nurse Simone', 3.4, 3.1, PI, { h: 1.72 }),
    person('keisha', 'keisha', 'Keisha', -4.6, 0.4, PI / 2, { h: 1.0, anim: 'Idle' }), person('marlonH', 'marlon', 'Marlon', -4.4, -0.7, PI * 0.5, { h: 1.45 }));
  const crowd = folk(26, 77, [0, 0, 1, 1], { anims: ['SitIdle', 'SitTalk'], kids: 0, elders: 0.28 }); let ci = 0;
  for (let i = 0; i < seats.length && ci < crowd.length; i++) { if (seats[i].taken || i % 4 === 1) continue; const e = crowd[ci++]; Object.assign(e, { x: seats[i].x, z: seats[i].z, ry: PI / 2, anim: ['SitIdle', 'SitTalk'][i % 2], seated: true, seat, props: undefined }); extras.push(e); }
  const st = folk(6, 78, [-4.2, -0.9, 3.4, 0.9], { anims: ['Idle', 'Talk1', 'Talk2'], kids: 0.35 }); extras.push(...st);
  return { id: 'hall', group: g, walls, bounds: { x0: -W / 2 + 0.5, x1: W / 2 - 2.6, z0: -D / 2 + 0.5, z1: D / 2 - 0.5 }, start: { x: -6.2, z: 0.2, yaw: -PI / 2 }, people, extras, env: ENV.room, eye: 1.32, lights,
    spots: { table: [0.5, -D / 2 + 1.7], blankets: [-4.6, 0.3], drum: [3.8, -D / 2 + 1.5], seat: [-0.8, 1.0], door: [-W / 2 + 1.0, 0], window: [4.6, D / 2 - 0.8] }, roofG: roof, titleView: null, tick: () => {} };
}

/* ============ Kingston, about midday on 12 September 1988: uptown and downtown across one street ============
   North of the street (z < 0): a walled compound, a big concrete house with a tile roof, a lawn, a car and the ONE big satellite dish of the game (on its post in the garden).
   South of the street (z > 0): a zinc fence and rows of small board houses with zinc roofs, packed close together.
   Nobody walks here: the storm scene uses it as a cutaway (stormRun's kingstonCutaway), with the camera director. */
export function buildKingston88() {
  const g = grp(), walls = [], people = [], extras = [], r = rng(1988), wall = (x0, z0, x1, z1) => walls.push([x0, z0, x1, z1]);
  const put = (o, x, z, ry = 0) => { o.position.set(x, 0, z); o.rotation.y = ry; g.add(o); return o; };
  groundPlane(g, 0, 900, T.grass([200, 200], [92, 124, 58]));
  lane(g, -80, 80, 0, 6.4, 'tar');
  g.add(hillRing(160, 16, 60, { seed: 7, base: [0.2, 0.42, 0.22] }));
  /* ---- uptown ---- */
  const lawn = mesh(new THREE.PlaneGeometry(33, 15), std(T.grass([14, 6], [112, 150, 70]), 1), -14, 0.03, -12.3, g); lawn.rotation.x = -PI / 2;
  const drive = box(4.2, 0.05, 6.0, std(T.concrete([2, 3]), 0.95), -14, 0.03, -7.6, g);   /* the drive stops at the front of the house (it ran 1.3 m under it) */
  const WL = std(T.plaster([240, 236, 224], [1, 1]), 0.9);
  for (const [cx, w] of [[-24.4, 13.4], [-3.6, 13.4]]) { box(w, 2.3, 0.35, WL, cx, 1.15, -4.6, g); wall(cx - w / 2, -4.8, cx + w / 2, -4.4); }
  for (const x of [-17.5, -10.5]) { box(0.75, 2.9, 0.75, WL, x, 1.45, -4.6, g); box(0.95, 0.12, 0.95, WL, x, 2.95, -4.6, g); }
  box(0.35, 2.3, 15.4, WL, -31.1, 1.15, -12.3, g); wall(-31.3, -20, -30.9, -4.6); box(0.35, 2.3, 15.4, WL, 3.1, 1.15, -12.3, g); wall(2.9, -20, 3.3, -4.6); box(34.2, 2.3, 0.35, WL, -14, 1.15, -19.9, g); wall(-31.2, -20.1, 3.2, -19.7);
  const villa = house({ w: 12, d: 7, h: 3.4, style: 'block', wall: [244, 236, 214], roofRgb: [176, 84, 64], roof: 'on', shutters: 'open', seed: 21, shutCol: 0x2a5a8a }); put(villa, -14, -14.2); wall(-20.2, -17.9, -7.8, -10.3);
  const cr = car(); cr.userData.noBatch = false; put(cr, -9.3, -7.0, 0.25); wall(-11.8, -8.3, -6.8, -5.7);
  for (const [x, z, s] of [[-27, -9, 1], [-27.5, -16, 2], [-1.5, -10, 3], [-1, -16.5, 4]]) { const o = palm(6.5 + s * 0.3, s); o.userData.noBatch = true; swayable(o, 0.02); put(o, x, z); wall(x - 0.4, z - 0.4, x + 0.4, z + 0.4); }
  for (const [x, z, s] of [[-22.5, -7.2, 1], [-5.8, -8.2, 2], [-17.2, -9.6, 3]]) put(hibiscus(s), x, z);   /* the third bush stands beside the drive, not on it */
  const dish = bigDish(); dish.userData.noBatch = true; put(dish, -24.5, -10.2, 0); wall(-25.5, -11.2, -23.5, -9.2); g.userData.dish = dish;   /* the one dish */
  /* ---- downtown ---- */
  g.add(Object.assign(zincFence(-34, 4.6, 30, 4.6, 1.9, 5), {}));
  const tones = [[186, 152, 104], [198, 176, 130], [170, 150, 120], [200, 170, 140], [176, 160, 110]], roofs = [[150, 110, 90], [144, 142, 138], [160, 120, 96], [138, 112, 98]];
  [[8.4, [-26, -18.5, -11, -3.5, 4, 11.5, 19, 26]], [14.8, [-22, -14, -6, 2, 10, 18, 25]]].forEach(([z, xs], row) => xs.forEach((x, i) => {
    const h = house({ w: 4.2, d: 3.2, h: 2.4, style: 'board', wall: tones[(i + row) % 5], roofRgb: roofs[(i * 3 + row) % 4], roof: 'on', shutters: i % 2 ? 'closed' : 'open', porch: false, seed: 40 + i + row * 9 }); put(h, x, z, PI); wall(x - 2.2, z - 1.8, x + 2.2, z + 1.8); }));
  put(standpipeTap(), -1.6, 5.4); wall(-2.0, 5.0, -1.2, 5.8);
  const cl = grp(g, 12.5, 0, 5.8); for (const x of [-2, 2]) box(0.08, 1.9, 0.08, WOOD, x, 0.95, 0, cl); box(4, 0.02, 0.02, solid(0xd8d0b8, 1), 0, 1.8, 0, cl); for (let k = 0; k < 4; k++) box(0.5, 0.6, 0.03, solid([0xe8505b, 0x3ba0a0, 0xf0c040, 0xf0ece0][k], 1), -1.4 + k * 0.9, 1.45, 0, cl); wall(10.4, 5.6, 14.6, 6.0);
  return { id: 'kingston88', group: g, walls, bounds: { x0: -34, x1: 30, z0: -3.6, z1: 3.6 }, start: { x: 0, z: 0, yaw: 0 }, people, extras, env: ENV.gale, eye: 1.5, spots: {}, dish, tick: () => {} };
}
