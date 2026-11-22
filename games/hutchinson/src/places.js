/* The five places of the story. Each is a compressed picture of a real kind of place; what is modelled on a source and what is a general
   picture is in docs/games/hutchinson.md ("Places").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, for the castle, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/hutchinson/people). */
import * as THREE from "three";
import { T, std, solid, flat, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { tree, palm, bush, mule, cart, barrel, hillRing, scatter, surveyPole, sack, crate, marketBasket } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import * as S from "./scenery.js";
import { TASKS } from "./steps.js";

const base = (id, bounds, start) => ({
  id,
  group: grp(),
  bounds: { x0: bounds[0], z0: bounds[1], x1: bounds[2], z1: bounds[3] },
  start: { x: start[0], z: start[1], yaw: start[2] || 0 },
  walls: [],
  specs: [],
  ambient: [],
  points: {},
  items: {},
  props: {},
  routes: [],
  tickers: [],
  keepOff: [],
  reveal: {},
  films: {},
  danger: {},
  ground: () => 0,
});
function add(Q, o, x = 0, z = 0, y = 0, ry = 0) {
  o.position.set(x, y, z);
  o.rotation.y = ry;
  Q.group.add(o);
  return o;
}
function wall(Q, x, z, w, d) {
  Q.walls.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2]);
}
/* a solid thing: add it and its walking wall (w along x, d along z before turning; quarter turns swap them) */
function solid1(Q, o, x, z, w, d, ry = 0, y = 0) {
  add(Q, o, x, z, y, ry);
  const q = Math.abs(Math.round(ry / (Math.PI / 2))) % 2 === 1;
  wall(Q, x, z, q ? d : w, q ? w : d);
  return o;
}
/* a story person. life: what they do when not talking (an ambient behaviour). opts: raw (the full body, for a woman who sits), held */
function person(Q, id, cast, x, z, ry = 0, life = null, opts = {}) {
  Q.specs.push({ id, cast, x, z, ry, life, ...opts });
}
/* a background person: look is a body (tools/hutchinson/people); life an ambient behaviour */
function crowd(Q, look, x, z, ry, life, opts = {}) {
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...opts });
}
function point(Q, id, x, z, label) {
  Q.points[id] = { x, z, label };
}
function ground(Q, mat, size = 500, x = 0, z = 0) {
  const p = plane(size, size, mat, x, -0.025, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
/* a strip of ground laid just over the terrain: a road, a yard */
function strip(Q, w, d, mat, x, z, y = 0.012) {
  const p = plane(w, d, mat, x, y, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
/* a field wall from (x0, z) to (x1, z), or along z when x0 === x1, with its walking wall */
function fieldWall(Q, x0, z0, x1, z1, h = 1.2, seed = 3) {
  const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0),
    len = alongX ? Math.abs(x1 - x0) : Math.abs(z1 - z0),
    cx = (x0 + x1) / 2,
    cz = (z0 + z1) / 2;
  add(Q, W.fieldWall(len, h, seed), cx, cz, 0, alongX ? 0 : Math.PI / 2);
  wall(Q, cx, cz, alongX ? len : 0.7, alongX ? 0.7 : len);
}
/* the dry limestone country of the middle of St Ann: karst hills near and far, steep and wooded, with pale crags */
function hills(Q, seed = 3, near = true) {
  const far = hillRing(300, 16, 50, { seed, base: [0.36, 0.42, 0.28] });
  far.traverse((o) => (o.userData.far = true));
  Q.group.add(far);
  if (near)
    for (const [x, z, r, h, s] of [[-95, -70, 46, 34, 1], [70, -110, 60, 42, 2], [120, 20, 50, 34, 3], [-130, 40, 55, 38, 4], [10, 140, 70, 40, 5], [-60, 110, 44, 30, 6], [150, -60, 40, 30, 7], [-20, -150, 66, 46, 8]]) add(Q, S.karstHill(r, h, seed + s), x, z, -1);
}
const DUST = [186, 168, 132],
  DRY = [150, 144, 96],
  GOLD = [1.3, 1.02, 0.6],   /* Guinea grass in a dry month */
  PALE = [1.12, 1.0, 0.7];
const moveTo = (o, x, y, z) => o.position.set(x, y, z);
/* a peg with a red rag: one of the marks along a boundary */
function peg(c = 0xb03a2a) {
  const g = grp();
  cyl(0.03, 0.02, 0.9, W.WM.wood, 0, 0.45, 0, g, 6);
  box(0.22, 0.12, 0.012, solid(c, 1), 0.12, 0.8, 0, g);
  return g;
}

/* ---------- 1. The road by Dr Hutton's pen, a dry afternoon in 1772 ---------- */
function road() {
  const Q = base("road", [-18, -12, 18, 12], [13, 6.2, Math.PI / 2]);
  Q.floor = "sand";
  Q.beds = { wind: 0.05, bird: 0.14 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 520], sun: [0xfff0c8, 2.5, -30, 60, 24], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [15, 2.4, 11], look: [-2, 1.2, 1] };
  ground(Q, std(T.grass([60, 60], DRY)), 700);
  strip(Q, 150, 4.2, std(T.dirt([40, 2], DUST)), 0, 6);
  for (const z of [5.1, 6.9]) strip(Q, 150, 0.34, std(T.dirt([60, 1], [160, 142, 108])), 0, z, 0.016);   /* cart ruts */
  hills(Q, 3);
  /* the castle, two miles off on its rise: you can see the towers from here */
  add(Q, S.karstHill(34, 14, 9, [0.4, 0.42, 0.28], 0.2), -150, -60, -1);
  const far = add(Q, S.farCastle(1.6), -150, -60, 12.6, 0.5);
  far.traverse((o) => (o.userData.far = true));
  /* the pen wall along the north side of the road, its gate standing open */
  fieldWall(Q, -18.5, 2.2, -2.4, 2.2, 1.25, 4);
  fieldWall(Q, 0.6, 2.2, 18.5, 2.2, 1.25, 5);
  for (const x of [-2.115, 0.315]) add(Q, W.stoneBox(0.55, 1.7, 0.7, W.LIME), x, 2.2, 0);
  const gate = grp();
  for (const y of [0.35, 0.75, 1.15]) box(1.9, 0.09, 0.05, W.WM.wood, 0.95, y, 0, gate);
  for (const x of [0.05, 0.95, 1.85]) box(0.09, 1.3, 0.06, W.WM.woodDark, x, 0.7, 0, gate);
  box(2.1, 0.07, 0.04, W.WM.wood, 0.95, 0.75, 0.01, gate).rotation.z = 0.42;
  add(Q, gate, -0.03, 1.8, 0, Math.PI / 2 + 0.25);   /* swung back into the yard */
  wall(Q, 0.0, 1.1, 0.5, 2.0);
  /* inside the pen: the worn yard, a dry stone trough, the pen-keeper's hut, a guango tree */
  strip(Q, 15, 8.6, std(T.dirt([8, 4], [170, 152, 118])), 2, -2.6, 0.008);
  strip(Q, 2.6, 26, std(T.dirt([2, 12], [170, 152, 118])), -1, -19, 0.009);   /* the track up to the house */
  const trough = grp();
  W.stoneBox(2.2, 0.5, 0.8, W.LIME_DARK, 0, 0.25, 0, trough);
  box(1.9, 0.06, 0.52, solid(0x6f6a5c, 1), 0, 0.5, 0, trough);   /* dry: no water, only dust */
  solid1(Q, trough, 6, -1.2, 2.3, 0.9);
  solid1(Q, tree(7.5, 4, 1), -13.5, -2.6, 1.0, 1.0);
  solid1(Q, S.thatchHut(4.2, 3.2, { seed: 2 }), 14.2, -6.2, 4.4, 3.4, -Math.PI / 2);
  solid1(Q, S.cookFire(true), 10.4, -8.2, 0.8, 0.8);
  const cs = add(Q, S.smoke(4, { rise: 2.2, spread: 0.4, size: 0.7 }), 10.4, -8.2, 0.5);
  solid1(Q, S.grassStack(1), 10.6, -3.6, 1.9, 1.5, 0.2);
  solid1(Q, W.bench(1.5), 12.2, -9.6, 1.6, 0.5, 0.3);
  solid1(Q, barrel(), 12.4, -3.9, 0.7, 0.7);
  for (const [x, z] of [[11.9, -7.6], [12.2, -5.0]]) add(Q, sack(0xa8946a), x, z);
  wall(Q, 12.05, -6.3, 0.7, 3.2);
  /* the pond, dry: cracked mud in a pale rim. You test it with a stick. */
  add(Q, S.patch(4.6, 3.1, solid(0xb9ab8a, 1), 3, 0.011), -10, -7.4);
  add(Q, S.patch(3.9, 2.5, std(S.mudTex([3, 2]), 1), 5, 0.017), -10, -7.4);
  for (const [x, z, s] of [[-13.6, -9.2, 0.5], [-6.4, -9.4, 0.4], [-12.8, -5.0, 0.35]]) add(Q, W.rocks(s, x + 40, 2), x, z);
  const stick = cyl(0.014, 0.018, 1.05, W.WM.wood, -8.2, 0.42, -6.6, Q.group, 5);
  stick.rotation.z = 0.2;
  stick.userData.noBatch = true;
  stick.userData.noAudit = true;
  Q.reveal.pond = (seen) => (stick.visible = seen);
  /* the pasture: Guinea grass gone gold, a rail fence, the cattle beyond it and a rack to feed them at */
  for (const [x0, x1] of [[-18.5, -2.4], [0.4, 18.5]]) {
    add(Q, S.postRail(x1 - x0, 1.2), (x0 + x1) / 2, -12.4);
    wall(Q, (x0 + x1) / 2, -12.4, x1 - x0, 0.3);
  }
  const pg = S.postRail(2.6, 1.2);
  add(Q, pg, -1, -12.4);
  wall(Q, -1, -12.4, 2.8, 0.3);
  solid1(Q, S.feedRack(2.6), 5, -11.5, 2.8, 0.9);
  const herd = [[4.2, -13.6, 1.3, 0, "stand"], [6.4, -14.2, 2.2, 3, "stand"], [9.5, -16, 0.4, 1, "graze"], [14, -15, -2.4, 2, "graze"], [1.5, -18.5, 2.9, 4, "graze"], [11, -21, 1.0, 5, "lie"], [17, -22, -0.8, 0, "graze"], [-8, -17, 0.6, 2, "graze"], [-14, -21, 2.5, 3, "stand"], [-11, -26, -1.2, 1, "lie"], [20, -30, 2.0, 4, "graze"]];
  herd.forEach(([x, z, ry, c, pose], i) => add(Q, S.cow(S.COATS[c], pose, i + 1), x, z, 0, ry));
  add(Q, S.tufts(1500, [-70, -75, 70, -12.9], { seed: 4, h: 0.75, tint: GOLD, clear: [[-2.4, -34, 0.4, -12], [-14, -42, 20, -29]] }));
  add(Q, S.tufts(260, [-18, -12, 18, 1.6], { seed: 6, h: 0.42, tint: PALE, clear: [[-5.5, -7, 9.6, 1.8], [-14.6, -10.6, -5.4, -4.2], [8, -10.6, 17, -2], [-2.4, -12.4, 0.4, -6]] }));
  add(Q, S.tufts(520, [-70, 8.6, 70, 60], { seed: 8, h: 0.5, tint: PALE }));
  add(Q, S.tufts(90, [-70, 2.7, 70, 3.8], { seed: 9, h: 0.38, tint: PALE, clear: [[-3, 2, 1.2, 4]] }));
  /* Dr Hutton's house across the pasture, with its kitchen, a line of trees and smoke from the kitchen chimney */
  const house = add(Q, S.penHouse(), -3, -38, 0, 0.06);
  const hs = add(Q, S.smoke(5, { rise: 5, spread: 1.2, size: 2.4 }), -3 + 13.5, -40.4, 4.6);
  Q.tickers.push((t) => {
    hs.userData.tick(t);
    cs.userData.tick(t * 1.6);
  });
  for (const [x, z, h, s] of [[-13, -33, 9, 31], [8, -45, 10, 32], [-10, -46, 8, 33], [20, -37, 9, 34]]) add(Q, tree(h, s, 1), x, z);
  for (const [x, z, s] of [[-5.5, -30, 1], [3.5, -30.5, 2], [-4.6, -22, 3], [2.8, -21, 4]]) add(Q, palm(7 + (s % 2), s), x, z);
  /* the boundary: a survey pole by the wall and a line of pegs, where the two men's land meets. One peg has been pulled up. */
  solid1(Q, surveyPole(0xb03a2a), -13.5, 3.4, 0.3, 0.3);
  add(Q, peg(), -17.6, 3.3);
  add(Q, peg(), -10.8, 3.3).rotation.z = 0.12;
  const hole = mesh(new THREE.CircleGeometry(0.1, 8), solid(0x5a4a38, 1), -16, 0.02, 3.3, Q.group);
  hole.rotation.x = -Math.PI / 2;
  hole.name = "terrain";
  solid1(Q, W.rocks(0.9, 4, 3), -15, 9.9, 1.4, 1.2);
  /* Sampson's cart and mule on the road's south side, water casks on it */
  const c = cart(2.6, 1.4);
  for (const [x, z] of [[-0.6, -0.3], [-0.6, 0.35]]) {
    const b = S.cask();
    b.position.set(x, 0.76, z);
    c.add(b);
  }
  solid1(Q, c, 6.8, 9.4, 3.0, 1.9);
  solid1(Q, mule(0x6a5644), 9.9, 9.4, 2.0, 0.8, Math.PI / 2);
  /* a pack mule that came down the road alone: tied to the wall, its load still on */
  const stray = mule(0x4f4238);
  const pack = grp(stray, 0, 1.38, -0.1);
  box(0.36, 0.3, 0.62, solid(0x6b4a30, 1), 0.3, 0, 0, pack);
  box(0.36, 0.3, 0.62, solid(0x6b4a30, 1), -0.3, 0, 0, pack);
  box(0.7, 0.07, 0.5, solid(0x3d2d20, 1), 0, 0.17, 0, pack);
  const roll = cyl(0.11, 0.11, 0.6, solid(0x8a8068, 1), 0, 0.3, 0, pack, 8);
  roll.rotation.z = Math.PI / 2;
  const flap = box(0.37, 0.05, 0.6, solid(0x7a5a3c, 1), 0.3, 0.18, 0, pack);   /* the bag's flap: lifted when you look inside */
  flap.userData.noBatch = true;
  stray.traverse((o) => (o.userData.noBatch = true));
  solid1(Q, stray, -7, 3.6, 2.0, 0.9, Math.PI / 2);
  Q.reveal.packmule = (seen) => {
    flap.rotation.z = seen ? 1.1 : 0;
    flap.position.y = seen ? 0.36 : 0.18;
    flap.position.x = seen ? 0.52 : 0.3;
  };
  for (const [x, z, s] of [[-16.8, 10.9, 1.2], [3, 11.1, 1], [15.5, 10.6, 1.3], [-4, 10.9, 0.9], [-9, 11.2, 1.1]]) solid1(Q, W.scrub(x * 7 + 3, s), x, z, 0.5, 0.5);
  scatter(Q.group, (i) => W.scrub(i + 30, 0.8 + (i % 3) * 0.3), 36, [-60, 14, 60, 60], [], 7);
  scatter(Q.group, (i) => W.rocks(0.7 + (i % 3) * 0.3, i + 2, 2), 18, [-60, 14, 60, 50], [], 11);
  scatter(Q.group, (i) => S.outcrop(1.6 + (i % 3) * 0.5, 1.2 + (i % 2) * 0.6, i + 3), 7, [-60, 16, 60, 55], [], 12);
  scatter(Q.group, (i) => tree(5 + (i % 3), i + 12, i % 2), 10, [-60, -70, 60, -26], [[-20, -50, 26, -26]], 13);
  scatter(Q.group, (i) => tree(4.5 + (i % 3), i + 52, 1), 6, [-60, 18, 60, 60], [], 15);
  /* people */
  person(Q, "cubba", "cubba", 4.6, -2.6, face(4.6, -2.6, 6, -1.2), { kind: "watch", at: [6, -1.2], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "carter", "carter", 7.2, 7.9, face(7.2, 7.9, 7, 6), { kind: "watch", at: [9.9, 9.4], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "hutton", "hutton", -1, 3.6, 0, { kind: "watch", at: [-150, -60], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "hx_man", -4.4, -3.2, 0, { kind: "work", between: [[-4.4, -3.2], [3.4, -9.6]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "hx_woman", 2.5, -5, 0, { kind: "wander", area: [-3.6, -9.4, 8.6, -3.2], pause: [3, 7] });
  crowd(Q, "hx_penman", 15.4, -11.2, face(15.4, -11.2, 14, -15), { kind: "watch", at: [14, -15], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [4, 8] });
  crowd(Q, "hx_penwoman", 10.2, -7.0, face(10.2, -7.0, 10.4, -8.2), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [10.4, -8.2] });
  point(Q, "boundary", -13.2, 4.6, "the boundary pole");
  Q.keepOff = [{ at: [-6.6, 5.0], r: 1 }, { at: [-13.2, 4.6], r: 1 }, { at: [-8.2, -5.4], r: 1.2 }, { at: [5, -10.4], r: 1.2 }, { at: [10.6, -2.4], r: 1 }, { at: [2.6, 0.4], r: 1 }, { pts: [[13, 6.2], [-1, 5]], w: 1.2 }];
  return Q;
}

/* ---------- 2. Under the towers: Edinburgh Castle on its rise, at dusk and by day ---------- */
const MOUND = { x: 0, z: -13.5, top: 14, foot: 20, k: 0.6, h: 1.3 };
/* how high the castle's rise stands at a spot (the house stands on its flat top) */
function moundY(x, z) {
  const e = Math.hypot(x - MOUND.x, (z - MOUND.z) / MOUND.k);
  return e <= MOUND.top ? MOUND.h : e >= MOUND.foot ? 0 : (MOUND.h * (MOUND.foot - e)) / (MOUND.foot - MOUND.top);
}
function castle() {
  const Q = base("castle", [-24, -1.2, 24, 15], [15, 11.4, Math.PI / 2]);
  Q.floor = "sand";
  Q.beds = { wind: 0.07, owl: 0.5 };
  const DUSK = { top: 0x2c3a5c, hor: 0xd9895a, stars: 0.25, moon: 0, fog: [0x8a6f6a, 40, 300], sun: [0xff9a5a, 1.15, -60, 14, 30], hemi: [0xc9b6c8, 0x5a4a40, 1.75], fill: 2.4 },
    LATE = { top: 0x1c2644, hor: 0xa85e4a, stars: 0.6, moon: 0, fog: [0x5c4c58, 34, 260], sun: [0xe07a4a, 0.7, -70, 8, 30], hemi: [0xa9a0c0, 0x4a3e3c, 1.55], fill: 2.8 },
    DAYL = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 80, 480], sun: [0xfff0d0, 2.2, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.4] };
  Q.light = DUSK;
  Q.view = { pos: [15, 2.2, 14], look: [0, 3.6, -9] };
  const grass = std(T.grass([60, 60], [136, 128, 88]));
  ground(Q, grass, 700);
  strip(Q, 150, 3.8, std(T.dirt([40, 2], DUST)), 0, 12.4);
  strip(Q, 2.4, 12, std(T.dirt([2, 6], DUST)), 3, 4.6, 0.01);   /* the track from the road up to the door */
  hills(Q, 8);
  /* the rise the house stands on, "a rising piece of ground near the main road, which it commands" (Cundall) */
  const mound = mesh(new THREE.CylinderGeometry(MOUND.top, MOUND.foot, MOUND.h, 32, 1), std(T.grass([10, 10], [136, 128, 88])), MOUND.x, MOUND.h / 2 - 0.01, MOUND.z, Q.group);
  mound.scale.z = MOUND.k;
  mound.name = "terrain";
  const C = S.castle();
  add(Q, C, 0, -13, MOUND.h);
  for (const r of C.userData.walls) Q.walls.push([r[0], r[1] - 13, r[2], r[3] - 13]);
  Q.props.castle = C;
  const dx = C.userData.doorX,
    wx = C.userData.windowX;
  /* stone steps up the slope to the front door, and the worn ground before it */
  for (let i = 0; i < 6; i++) add(Q, W.stoneBox(1.7, 0.24, 0.62, W.LIME_DARK), dx + 0.2, -2.0 - i * 0.6, i * 0.22 - 0.02);
  const fore = add(Q, S.patch(3.4, 2.2, std(T.dirt([2, 2], DUST)), 7, MOUND.h + 0.012), dx, -7.6);
  /* smoke from the chimney of the front tower; a lamp behind one lower loophole at dusk */
  const sm = add(Q, S.smoke(6, { rise: 4.2, spread: 0.9, size: 1.5, tint: 0x9a8f8c }), C.userData.smoke[0], C.userData.smoke[2] - 13, MOUND.h + C.userData.smoke[1]);
  Q.tickers.push((t) => sm.userData.tick(t));
  const glowWin = box(0.24, 0.24, 0.04, new THREE.MeshBasicMaterial({ color: 0xffb65a }), 0.4, MOUND.h + 1.5, -13 + 3.5 + 0.38, Q.group);
  glowWin.userData.noBatch = true;
  glowWin.userData.noAudit = true;
  glowWin.visible = false;
  /* the well, in open ground west of the track (the well is this story's own: see the journal) */
  const well = W.well();
  solid1(Q, well, -13.5, 0.4, 2.4, 2.2);
  const wb = grp(Q.group, -13.3, 0, 0.4);   /* the well's own bucket on its rope: down, or wound up dripping */
  cyl(0.012, 0.012, 1.0, W.WM.rope, 0, 1.05, 0, wb, 5);
  cyl(0.16, 0.13, 0.26, W.WM.wood, 0, 0.45, 0, wb, 10);
  wb.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  /* cover between the road and the well: each thing is tall enough to hide a boy, and its road side is counted as cover */
  const cover = [];
  const hide = (x0, z0, x1, z1) => cover.push([x0, z0, x1, z1]);
  fieldWall(Q, 9, 10.2, 17, 10.2, 1.55, 6);
  hide(8.6, 10.4, 17.4, 15);
  solid1(Q, S.outcrop(2.8, 2.2, 5), 5.9, 6.5, 3.0, 1.5);
  hide(4.3, 7.3, 7.5, 9.2);
  solid1(Q, S.cottonTree(13, 3), -0.8, 4.2, 2.8, 2.8);
  hide(-2.4, 5.7, 0.8, 7.5);
  fieldWall(Q, -7.8, 2.2, -3.8, 2.2, 1.5, 7);
  add(Q, W.rocks(0.6, 44, 3), -3.3, 2.3);   /* where the wall has tumbled */
  hide(-8.0, 2.6, -3.6, 4.3);
  hide(-15.0, 1.5, -12.0, 3.1);   /* the well's own stone ring and frame */
  solid1(Q, S.woodpile(2.6, 1.45), -19, 4.6, 2.9, 1.3);
  hide(-20.6, 5.3, -17.4, 7.0);
  fieldWall(Q, -24.5, 10.2, -14, 10.2, 1.5, 8);
  hide(-24, 10.4, -14, 15);
  /* the cattle yard east of the house: dry-stone walls, strayed cattle that are not his, and a grey jackass */
  for (const [x0, z0, x1, z1, s] of [[13, 6.2, 22, 6.2, 11], [13, 0.6, 22, 0.6, 12], [13, 0.6, 13, 6.2, 13], [22, 0.6, 22, 6.2, 14]]) {
    const alongX = z0 === z1,
      len = alongX ? x1 - x0 : z1 - z0;
    add(Q, W.fieldWall(len, 1.45, s), (x0 + x1) / 2, (z0 + z1) / 2, 0, alongX ? 0 : Math.PI / 2);
  }
  wall(Q, 17.5, 3.4, 9.7, 6.3);
  hide(12.6, 6.6, 22.4, 8.2);
  add(Q, S.cow(S.COATS[0], "stand", 21), 19.6, 2.2, 0, 2.6);
  add(Q, S.cow(S.COATS[3], "graze", 22), 15.2, 4.6, 0, -0.5);
  add(Q, S.cow(S.COATS[1], "lie", 23), 20.2, 4.8, 0, 1.2);
  const jack = mule(0x8f8a80);
  jack.scale.setScalar(0.74);
  jack.traverse((o) => (o.userData.noBatch = true));
  add(Q, jack, 15.6, 2.0, 0, -0.6);
  Q.reveal.jackass = (seen) => {
    jack.position.set(seen ? 17.2 : 15.6, 0, seen ? 5.0 : 2.0);
    jack.rotation.y = seen ? Math.PI : -0.6;
  };
  /* a riding hat between the roots of the cotton tree: you find it, and hang it where it can be seen */
  const hat = grp(Q.group, 0.1, 0.06, 5.5);
  cyl(0.19, 0.19, 0.012, solid(0x8a7a66, 1), 0, 0, 0, hat, 12);
  cyl(0.085, 0.095, 0.1, solid(0x8a7a66, 1), 0, 0.055, 0, hat, 10);
  cyl(0.097, 0.097, 0.02, solid(0x3a2f28, 1), 0, 0.02, 0, hat, 10);
  hat.rotation.z = 0.14;
  hat.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  Q.reveal.hat = (seen) => {
    hat.position.set(seen ? 0.56 : 0.1, seen ? 1.34 : 0.06, seen ? 5.36 : 5.5);
    hat.rotation.z = seen ? 0.5 : 0.14;
  };
  /* the quarters of the people he enslaved, to the west (Cundall), with a cooking fire at dusk */
  const quarters = add(Q, S.quarters(true), -44, -4, 0, 0.5);
  const qs = add(Q, S.smoke(4, { rise: 2.6, spread: 0.5, size: 0.9 }), -40.2, -3.2, 0.4);
  Q.tickers.push((t) => qs.userData.tick(t * 1.4));
  for (const [x, z] of [[-34, 3], [-47, 4]]) add(Q, S.postRail(6, 1, 2), x, z, 0, 0.3);
  add(Q, tree(7, 61, 1), -37, -11);
  add(Q, tree(6, 62, 0), -50, -1);
  /* an old cart by the west wall, rocks and scrub outside the watched ground */
  solid1(Q, cart(2.4, 1.3), -19.5, 12.0, 2.9, 1.8, 0.2);
  for (const [x, z] of [[21, 9.0], [-10.5, 8.6]]) add(Q, W.rocks(0.5, x + 20, 3), x, z);
  add(Q, S.tufts(520, [-24, -1, 24, 9.8], { seed: 12, h: 0.36, tint: PALE, clear: [[1.6, -1.2, 4.4, 10.6], [13, 0.6, 22, 6.2]] }));
  add(Q, S.tufts(700, [-70, 14.6, 70, 60], { seed: 13, h: 0.5, tint: PALE }));
  add(Q, S.tufts(500, [-80, -50, 80, -1], { seed: 14, h: 0.5, tint: PALE, clear: [[-24, -26, 24, -1], [-48, -14, -32, 2]] }));
  scatter(Q.group, (i) => W.scrub(i + 60, 0.8 + (i % 3) * 0.3), 30, [-70, 16, 70, 60], [], 17);
  scatter(Q.group, (i) => S.outcrop(1.8 + (i % 3) * 0.5, 1.2 + (i % 2) * 0.8, i + 7), 8, [-70, 18, 70, 60], [], 18);
  scatter(Q.group, (i) => tree(5 + (i % 4), i + 40, i % 2), 16, [-70, -60, 70, -26], [[-16, -30, 16, -24]], 19);
  for (const [x, z, h, s] of [[-22, -20, 8, 71], [20, -22, 9, 72], [30, -8, 7, 73]]) add(Q, tree(h, s, 1), x, z);
  /* Sampson's cart waits on the road, behind the long wall, out of sight of the house */
  const c = cart(2.6, 1.4);
  for (const [x, z] of [[-0.6, -0.3], [-0.6, 0.35], [0.2, 0.3]]) {
    const b = S.cask();
    b.position.set(x, 0.76, z);
    c.add(b);
  }
  solid1(Q, c, 12.4, 13.6, 3.0, 1.9);
  solid1(Q, mule(0x6a5644), 17.1, 13.6, 2.0, 0.8, Math.PI / 2);
  /* where you are in cover (on the road side of each solid thing), and the open ground the upper window looks over */
  const show = (k) => {
    C.userData.shutter.userData.swing(k);
    C.userData.watcher.visible = k > 0.55;
  };
  const cycle = (len, shut, open) => (t) => {
    const u = t % len;
    return u < shut ? 0 : u < shut + 1 ? (u - shut) * 0.99 : u < shut + 1 + open ? 1 : Math.max(0, 1 - (u - shut - 1 - open) / (len - shut - 1 - open)) * 0.99;
  };
  Q.danger.tower = { start: [15, 11.4, Math.PI / 2], zone: [-23.5, -1.2, 23.5, 9.6], cover, grace: 1.7, look: cycle(10, 4.8, 2.8), show, line: "A shot! Dust jumps beside you. You run back to cover." };
  /* later, with the light going: he looks out more often, for a shorter time, and there is a little longer to reach cover */
  Q.danger.late = { start: [-13.5, 2.3, Math.PI], zone: [-23.5, -1.2, 23.5, 9.6], cover, grace: 2.0, look: cycle(8.4, 4.2, 2.2), show, line: "A shot! Dust jumps beside you. You run back to cover." };
  point(Q, "well", -13.5, 2.3, "the well");
  point(Q, "cotton", -0.8, 6.5, "the cotton tree");
  point(Q, "wall", 13, 11.4, "the long wall by the road");
  /* birds in the cotton tree: they go up at the shot (the camera scene) */
  const flock = add(Q, S.birds(18, 4), -0.8, 4.2, 9);
  /* a hat on the track: all that the camera shows afterwards */
  const fallen = grp(Q.group, 3.2, 0.05, 1.7);
  cyl(0.2, 0.2, 0.012, W.WM.dark, 0, 0, 0, fallen, 12);
  cyl(0.09, 0.1, 0.1, W.WM.dark, 0, 0.055, 0, fallen, 10);
  fallen.rotation.z = 0.2;
  fallen.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  fallen.visible = false;
  /* people. Juba draws water at dusk; in the morning John Callendar stands at the long wall with Sampson. */
  person(Q, "juba", "juba", -14.8, 2.3, face(-14.8, 2.3, -13.5, 0.4), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-13.5, 0.4] });
  person(Q, "carter", "carter", 13.2, 12.4, face(13.2, 12.4, 15, 11.4), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "callendar", "callendar", 9.8, 11.6, face(9.8, 11.6, 0, -5), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 8] });
  person(Q, "sick", "sick", 7.2, 11.4, 0, { kind: "watch", at: [0, 12], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  /* the step decides the hour: dusk for the walk to the well, later dusk for the way back, morning for the neighbour */
  Q.enter = (stage) => {
    const day = stage >= 40,
      late = !day && stage >= 36;
    Q.light = day ? DAYL : late ? LATE : DUSK;
    Q.beds = day ? { wind: 0.05, bird: 0.12 } : { wind: 0.07, owl: late ? 0.8 : 0.5 };
    glowWin.visible = !day;
    show(0);
    flock.userData.burst(0);
    fallen.visible = false;
    C.userData.eastDoor.userData.swing(0);
  };
  Q.reveal.draw = (seen) => {
    wb.position.y = seen ? 0.62 : -1.2;
    const pail = Q.items.pail;
    if (pail && pail.parent === Q.group && Math.abs(pail.position.x + 13.5) < 0.1) pail.visible = seen;
  };
  /* the morning of the neighbour, as a camera scene: Callendar walks up the track and calls; the window opens; at the shot the camera
     turns to the birds going up; then a hat on the track, and a sick man slipping out by the east door to tell */
  const along = (path, k) => {
    let total = 0;
    const L = [];
    for (let i = 0; i < path.length - 1; i++) total += L[i] = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]);
    let d = Math.min(1, Math.max(0, k)) * total,
      i = 0;
    while (i < L.length - 1 && d > L[i]) d -= L[i++];
    const u = L[i] ? d / L[i] : 0,
      a = path[i],
      b = path[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[0] - a[0], b[1] - a[1])];
  };
  const CAL = [[9.8, 11.6], [3, 11.6], [3, 2.4]],
    SICK = [[6.9, -12.4], [9.5, -9.5], [12.2, -3.4], [11.4, 3], [10.6, 9.4], [20, 12.4]];
  let home = null;
  const walkOn = (n, on, clip = "Walk") => {
    if (n.walking === on) return;
    n.walking = on;
    n.ctl.play(on ? clip : "IdleM");
  };
  Q.films.warrant = (t, Q) => {
    const cal = Q.people.find((n) => n.id === "callendar"),
      sick = Q.people.find((n) => n.id === "sick");
    if (!cal || !sick) return;
    if (t < 0) {
      if (home)
        for (const [n, h] of [[cal, home.cal], [sick, home.sick]]) {
          n.x = h[0];
          n.z = h[1];
          n.m.position.set(n.x, 0, n.z);
          n.m.rotation.y = h[2];
          n.m.visible = h[3];
          n.walking = undefined;
          n.ctl.rest();
        }
      home = null;
      show(0);
      flock.userData.burst(0);
      fallen.visible = false;
      C.userData.eastDoor.userData.swing(0);
      return;
    }
    if (!home) home = { cal: [cal.x, cal.z, cal.m.rotation.y, cal.m.visible], sick: [sick.x, sick.z, sick.m.rotation.y, sick.m.visible] };
    /* John Callendar: up the road, up the track, and he stops below the steps */
    const k = (t - 2) / 15,
      p = along(CAL, k);
    cal.x = p[0];
    cal.z = p[1];
    cal.m.position.set(p[0], 0, p[1]);
    cal.m.rotation.y = k >= 1 ? Math.PI : p[2];
    cal.m.visible = t < 22.6;   /* the camera has turned away by then: you do not see him fall */
    walkOn(cal, k > 0 && k < 1);
    const open = Math.min(1, Math.max(0, (t - 19.5) / 2));
    show(t < 27 ? open : Math.max(0, 1 - (t - 27) / 1.5));
    flock.userData.burst((t - 22.5) / 5.5);
    fallen.visible = t >= 22.6;
    /* the sick man: the east door opens, and he goes down the far side of the rise and away along the road */
    const s = (t - 33) / 9,
      q = along(SICK, s);
    C.userData.eastDoor.userData.swing(Math.min(1, Math.max(0, (t - 31.5) / 1.5)));
    sick.x = q[0];
    sick.z = q[1];
    sick.m.position.set(q[0], moundY(q[0], q[1]), q[1]);
    sick.m.rotation.y = q[2];
    sick.m.visible = t >= 32.6;
    walkOn(sick, s > 0 && s < 1);
  };
  Q.keepOff = [{ pts: [[15, 11.4], [3, 11.6], [3, 2]], w: 1.4 }, { at: [-13.5, 2.3], r: 1.2 }, { at: [-0.8, 6.5], r: 1.2 }, { at: [16.5, 8.4], r: 1.2 }];
  return Q;
}

/* ---------- 3. The hall of the castle, after he ran: what the house held ---------- */
function hall() {
  const Q = base("hall", [-5.2, -3.4, 5.2, 3.4], [2.9, 0.2, -Math.PI / 2]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.mood = "sad";
  Q.beds = { room: 0.06, wind: 0.02, fire: 0.25 };
  Q.light = { top: 0x30343a, hor: 0x5a5448, fog: [0x1c1a18, 30, 90], sun: [0xffe6c0, 0.5, 10, 20, 10], hemi: [0xffe9cc, 0x4a3e34, 1.5], fill: 3.2 };
  Q.view = { pos: [-3.6, 1.9, 2.6], look: [2.6, 1.0, -0.6] };
  const stone = W.rubbleMat([196, 188, 166], 5, 2),
    floor = std(T.plank([104, 80, 56], 8, [3, 2]), 0.95),
    sky = new THREE.MeshBasicMaterial({ color: 0xcfd8d2 });
  Q.group.add(W.room({ x0: -5.5, z0: -3.7, x1: 5.5, z1: 3.7, h: 3, floor }));
  W.wallRun(Q.group, [-5.5, -3.7, 5.5, -3.7], 3, stone, [], 0.5);
  W.wallRun(Q.group, [5.5, 3.7, -5.5, 3.7], 3, stone, [], 0.5);
  W.wallRun(Q.group, [-5.5, 3.7, -5.5, -3.7], 3, stone, [], 0.5);
  W.wallRun(Q.group, [5.5, -3.7, 5.5, 3.7], 3, stone, [], 0.5);
  Q.walls.push([-5.6, -4, 5.6, -3.4], [-5.6, 3.4, 5.6, 4], [-5.6, -4, -5.2, 4], [5.2, -4, 5.6, 4]);
  /* loopholes from inside: a small square of daylight in a plastered splay. face: the way the wall looks into the room. */
  const loop = (x, y, z, ry) => {
    const g = grp(Q.group, x, y, z);
    g.rotation.y = ry;
    box(0.7, 0.7, 0.04, S.SM.plaster, 0, 0, 0, g);
    box(0.3, 0.3, 0.05, sky, 0, 0, 0.005, g).userData.noAudit = true;
    return g;
  };
  loop(-2.6, 1.6, -3.43, 0);
  loop(0.6, 1.6, -3.43, 0);
  loop(-5.23, 1.6, -0.9, Math.PI / 2);
  loop(5.23, 1.6, -1.2, -Math.PI / 2);
  /* the loophole over the road has a board across it until you take the board down */
  loop(-1.2, 1.6, 3.43, Math.PI);
  const board = box(0.5, 0.5, 0.04, W.WM.wood, -1.2, 1.6, 3.39, Q.group);
  board.userData.noBatch = true;
  const beam = mesh(new THREE.PlaneGeometry(0.34, 3.2), new THREE.MeshBasicMaterial({ color: 0xfff2cc, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }), -1.2, 0.84, 2.2, Q.group);
  beam.rotation.x = -1.0;
  beam.userData.noBatch = true;
  beam.userData.noAudit = true;
  Q.reveal.loophole = (seen) => {
    board.position.set(seen ? -0.5 : -1.2, seen ? 0.26 : 1.6, seen ? 3.36 : 3.39);
    board.rotation.z = seen ? 0.3 : 0;
    beam.visible = seen;
  };
  /* the two doors, shut: the front one beside the front tower, the east one to the yard (Cundall) */
  add(Q, W.makeDoor({ w: 1.1, h: 2.1, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "ring" }), 2.6, 3.44, 0, Math.PI);
  add(Q, W.makeDoor({ w: 1.0, h: 2.0, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "latch" }), 5.24, 0.4, 0, -Math.PI / 2);
  /* the hearth in the wall of the front tower, across the south-east corner, with a low fire the searchers lit */
  add(Q, S.cornerHearth(3), 4.55, 2.75, 0, (-3 * Math.PI) / 4);
  wall(Q, 4.5, 2.7, 2.1, 2.1);
  const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  fl.scale.set(0.5, 0.5, 1);
  fl.position.set(4.2, 0.5, 2.4);
  fl.userData.noBatch = true;
  fl.userData.noAudit = true;
  Q.group.add(fl);
  Q.tickers.push((t) => fl.scale.set(0.46 + Math.sin(t * 9) * 0.05, 0.5 + Math.sin(t * 13) * 0.08, 1));
  /* the foot of the spiral steps in the back tower, across the north-west corner */
  add(Q, S.spiralFoot(3), -4.5, -2.7, 0, Math.PI / 4);
  wall(Q, -4.6, -2.8, 2.0, 2.0);
  /* the long table, with a candle, the searchers' list and the strongbox */
  solid1(Q, P.table(2.6, 1.0, 0.78), -0.6, -1.5, 2.7, 1.1);
  const cd = add(Q, W.candle(true), 0.4, -1.7, 0.81);
  add(Q, S.writing(), -0.2, -1.3, 0.81, 0.2);
  const box1 = W.chest(0.7, 0.4, 0.36);
  add(Q, box1, -1.2, -1.5, 0.81);
  /* the watches in the box: forty-three were found in the house */
  const watches = grp();
  for (let i = 0; i < 43; i++) {
    const w = P.watch(i % 3 === 0);
    w.position.set(-0.27 + (i % 9) * 0.068, 0.02 + Math.floor(i / 9) * 0.004, -0.13 + Math.floor(i / 9) * 0.062);
    w.rotation.y = (i * 2.4) % 6.28;
    watches.add(w);
  }
  watches.position.set(-1.2, 0.81 + 0.2, -1.5);
  watches.traverse((o) => (o.userData.noBatch = true));
  watches.visible = false;
  Q.group.add(watches);
  Q.reveal.watches = (seen) => {
    box1.userData.open(seen ? 1 : 0);
    watches.visible = seen;
  };
  for (const [x, z, ry] of [[-1.4, -2.45, 0], [0.2, -2.45, 0.2]]) add(Q, W.chair(), x, z, 0, ry);
  wall(Q, -0.6, -2.45, 2.4, 0.5);
  /* the west wall: coats on pegs, far too many for one man; a cloth hangs over them until you draw it back */
  const coats = [0x5a3a2a, 0x2f3a4a, 0x6a5a3a, 0x3a2a2a, 0x4a5a3a, 0x7a2f2a];
  coats.forEach((c, i) => add(Q, W.hungCoat(c), -5.22, -0.9 + i * 0.8, 0, Math.PI / 2));
  const sheet = box(0.06, 1.7, 4.8, W.WM.linen, -5.08, 1.05, 1.1, Q.group);
  sheet.userData.noBatch = true;
  box(0.05, 0.05, 5.0, W.WM.woodDark, -5.1, 1.93, 1.1, Q.group);
  Q.reveal.coats = (seen) => {
    sheet.scale.z = seen ? 0.1 : 1;
    sheet.position.z = seen ? 3.2 : 1.1;
  };
  /* the east wall: a rack of long guns. The north wall: the cot where a sick man lay, a shelf. */
  const rack = grp();
  box(0.08, 1.5, 1.5, W.WM.woodDark, 0, 1.2, 0, rack);
  for (let i = 0; i < 4; i++) {
    const g = P.musket();
    g.rotation.x = -Math.PI / 2;
    g.position.set(-0.08, 0.72, -0.5 + i * 0.34);
    rack.add(g);
  }
  add(Q, rack, 5.2, -2.3);
  solid1(Q, S.cot(), 3.0, -2.9, 2.0, 0.9);
  const cup = cyl(0.04, 0.035, 0.08, solid(0x9a9a94, 0.4, 0.6), 4.3, 0.04, -2.7, Q.group, 8);
  add(Q, S.shelf(1.7), -1.0, -3.44, 1.75);
  /* by the south wall: a trunk of folded clothes, a barrel, sacks */
  solid1(Q, S.clothesTrunk(), -3.4, 3.0, 1.2, 0.7, Math.PI);
  solid1(Q, barrel(), -4.7, 2.9, 0.7, 0.7);
  add(Q, sack(0xa8946a), 0.5, 3.05);
  add(Q, sack(0x9a8660), 1.05, 3.0);
  wall(Q, 0.8, 3.05, 1.2, 0.6);
  /* a lantern hung from a beam */
  const lan = P.lantern();
  lan.position.set(1.0, 2.2, 0.4);
  lan.userData.noAudit = true;
  lan.traverse((o) => (o.userData.noAudit = true));
  Q.group.add(lan);
  cyl(0.006, 0.006, 0.34, W.WM.iron, 1.0, 2.72, 0.4, Q.group, 4);
  /* people: the captain at the table, his men at work; Juba and Cudjoe wait by the door; Hector stands apart */
  person(Q, "officer", "officer", 0.9, -0.4, face(0.9, -0.4, -1.2, -1.5), { kind: "watch", at: [-1.2, -1.5], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "juba", "juba", 0.6, 2.2, face(0.6, 2.2, 0, 0), { kind: "watch", at: [0, 0], idles: ["Idle"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cudjoe", "cudjoe", 1.8, 1.9, face(1.8, 1.9, 0, 0), { kind: "watch", at: [0, 0], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [6, 10] });
  person(Q, "hector", "hector", -3.3, -0.9, face(-3.3, -0.9, 0, 0), { kind: "watch", at: [-1.2, -1.5], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11] });
  crowd(Q, "hx_townman", -2.6, -1.6, face(-2.6, -1.6, -1.2, -1.5), { kind: "work", clips: ["IdleM", "Nod", "HeadTurn"], work: [4, 8], face: [-1.2, -1.5] });
  crowd(Q, "hx_townman", 4.0, -1.5, face(4.0, -1.5, 5.2, -2.3), { kind: "work", clips: ["IdleM", "HeadTurn", "PickUp"], work: [5, 9], face: [5.2, -2.3] });
  Q.props.candle = cd;
  Q.keepOff = [{ at: [-1.2, -0.4], r: 0.9 }, { at: [-4.2, 1.0], r: 0.9 }, { at: [-1.2, 2.6], r: 0.9 }, { at: [2.9, 0.2], r: 0.8 }];
  return Q;
}

/* ---------- 4. The sinkhole: a small valley ringed by rock, the mouth at its foot ---------- */
function hole() {
  const Q = base("hole", [-11, -3.2, 11, 13], [7.5, 11, Math.PI / 5]);
  Q.floor = "grass";
  Q.mood = "sad";
  Q.beds = { wind: 0.09, bird: 0.03 };
  Q.light = { top: 0x6f7f86, hor: 0xb9b8a8, fog: [0xa4a79a, 30, 260], sun: [0xe8e0cc, 1.3, 20, 40, 20], hemi: [0xdfe4dc, 0x6a6a54, 2.3] };
  Q.view = { pos: [8.5, 3.0, 11.5], look: [-1, 1.4, -6] };
  const MX = 0,
    MZ = -6,
    RX = 2.5,
    RZ = 1.5;
  Q.group.add(S.holedGround(700, RX, RZ, std(T.grass([0.09, 0.09], [110, 116, 80])), MX, MZ));
  hills(Q, 14, false);
  /* the ring of rock about ten metres high, open on the side you come in by */
  const ring = S.cliffRing(16, 10, { seed: 5, gap: [0.62, 1.2] });
  add(Q, ring, 0, 2);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + 0.1;
    if (a > 0.5 && a < 1.32) continue;
    const top = ring.userData.top(a),
      tr = tree(5 + (i % 4), 80 + i, i % 2);
    tr.position.set(Math.cos(a) * 22.5, top[1] - 0.6, 2 + Math.sin(a) * 22.5);
    tr.traverse((o) => (o.userData.noAudit = true));
    Q.group.add(tr);
    if (i % 2) {
      /* vines and roots hanging down the rock */
      const v = box(0.1, 3 + (i % 3), 0.06, flat(0x3e5a34), Math.cos(a) * 18.2, top[1] - 2.6, 2 + Math.sin(a) * 18.2, Q.group);
      v.rotation.y = -a;
      v.userData.noAudit = true;
    }
  }
  for (const [x, z, r, h, s] of [[-40, -30, 26, 22, 1], [34, -36, 30, 26, 2], [0, -60, 40, 30, 3], [-50, 30, 30, 24, 4], [48, 20, 28, 22, 5], [10, 60, 36, 24, 6]]) add(Q, S.karstHill(r, h, 20 + s, [0.28, 0.38, 0.24]), x, z, -1);
  /* the walls nobody walks through: the foot of the rock all round, as short straight pieces */
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    if (a > 0.62 && a < 1.2) continue;
    wall(Q, Math.cos(a) * 17.4, 2 + Math.sin(a) * 17.4, 4.2, 4.2);
  }
  /* the mouth: about three metres by five, jagged rock at its lip, and the shaft going down out of sight */
  add(Q, S.shaft(RX, RZ, 4), MX, MZ);
  wall(Q, MX, MZ, 2 * RX + 2.6, 2 * RZ + 2.2);
  /* the ground falls toward the mouth: bare rock and scree round it */
  add(Q, S.patch(6.4, 4.6, std(S.cragTex([2, 2]), 1), 9, 0.012), MX, MZ + 0.4);
  for (const [x, z, s] of [[-7, 3.2, 1.2], [6.8, 5.6, 1.0], [-3.6, 9.5, 0.9], [9.6, 1.5, 1.1], [-9.4, -2.2, 1.3], [7.4, -2.6, 1.0]]) solid1(Q, W.rocks(s, x * 5 + 9, 3), x, z, s * 1.5, s * 1.3);
  solid1(Q, S.outcrop(2.4, 2.4, 3), -8.6, 8.4, 2.6, 1.5);
  for (const [x, z, s] of [[-10, 4.6, 1.1], [2, 7.4, 0.8], [-6.4, 12, 1], [10, 9.4, 1.2], [5, 12.4, 0.9]]) solid1(Q, bush(x * 3 + 11, s), x, z, 0.6, 0.6);
  add(Q, S.tufts(520, [-16, -12, 16, 16], { seed: 21, h: 0.5, tint: [0.9, 1.0, 0.7], round: [0, 2, 15], clear: [[-6, -10.5, 6, -1.6]] }));
  add(Q, S.tufts(300, [10, 12, 40, 50], { seed: 22, h: 0.5, tint: [0.9, 1.0, 0.7] }));
  scatter(Q.group, (i) => tree(6 + (i % 4), i + 70, 1), 12, [14, 18, 60, 70], [], 23);
  /* the searchers' rope: a stake, a coil, the line over the lip, and a lantern on its end that goes down when you watch */
  solid1(Q, S.ropeStake(), 3.6, -2.4, 1.4, 0.8);
  const line = cyl(0.012, 0.012, 3.0, W.WM.rope, 2.55, 0.36, -3.55, Q.group, 5);
  line.rotation.set(0, 0, 0);
  line.lookAt(1.5, 0.25, -4.7);
  line.rotateX(Math.PI / 2);
  line.userData.noAudit = true;
  const drop = grp(Q.group, 1.4, 0, -5.0);
  const dl = P.lantern();
  dl.position.y = -0.4;
  drop.add(dl);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc070, fog: false }));
  glow.position.y = -0.2;
  drop.add(glow);
  const rope2 = cyl(0.012, 0.012, 1, W.WM.rope, 0, 0, 0, drop, 5);
  drop.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  let lower = 0,
    lowering = false;
  const setDrop = (k) => {
    const y = -0.2 - k * 34;
    dl.position.y = y - 0.3;
    glow.position.y = y - 0.1;
    glow.scale.setScalar(0.9 + k * 2.2);
    glow.material.opacity = 1 - k * 0.55;
    rope2.scale.y = Math.max(0.1, -y);
    rope2.position.y = y / 2;
  };
  setDrop(0);
  Q.reveal.rope = (seen) => {
    if (seen && !lowering) lower = 0;
    lowering = seen;
    if (!seen) setDrop(0);
  };
  Q.tickers.push((t, dt) => {
    if (!lowering || lower >= 1) return;
    lower = Math.min(1, lower + dt / 9);
    setDrop(lower * lower * (3 - 2 * lower));
  });
  /* loose stones by the path: one to drop */
  solid1(Q, W.rocks(0.5, 31, 4), 5.2, 8.6, 0.9, 0.8);
  point(Q, "edge", 0, -3.0, "the edge");
  person(Q, "cudjoe", "cudjoe", -2.6, -1.7, face(-2.6, -1.7, MX, MZ), { kind: "watch", at: [MX, MZ], idles: ["OldIdle"], react: ["HeadTurn"], every: [8, 12], stay: true });
  person(Q, "officer", "officer", 5.6, -0.6, face(5.6, -0.6, MX, MZ), { kind: "watch", at: [MX, MZ], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11], stay: true });
  person(Q, "hector", "hector", -1.5, -3.0, face(-1.5, -3.0, MX, MZ), { kind: "work", clips: ["Point", "IdleM", "IdleM"], work: [5, 8], face: [MX, MZ], stay: true });
  crowd(Q, "hx_townman", 2.6, -2.2, face(2.6, -2.2, 1.6, -4.4), { kind: "work", clips: ["IdleM", "PickUp", "HeadTurn"], work: [5, 9], face: [1.6, -4.6], stay: true });
  crowd(Q, "hx_townman", 4.6, -3.0, face(4.6, -3.0, 3.6, -2.4), { kind: "watch", at: [MX, MZ], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9], stay: true });
  Q.keepOff = [{ at: [0, -3.0], r: 1.1 }, { at: [5.2, 7.4], r: 1 }, { at: [1.2, -2.8], r: 0.9 }, { pts: [[7.5, 11], [0, -3]], w: 1.2 }];
  return Q;
}

/* ---------- 5. Spanish Town, the capital, March 1773: the square as Bonnor drew it for Edward Long (1774) ---------- */
function town() {
  const Q = base("town", [-20, -7.6, 20, 23], [13, 19, 2.6]);
  Q.floor = "stone";
  Q.beds = { crowd: 0.08, wind: 0.02, bird: 0.06 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 480], sun: [0xfff0c8, 2.3, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [15, 2.6, 21], look: [-3, 3.4, -5] };
  ground(Q, std(T.dirt([40, 40], [188, 172, 140])), 500);
  const far = hillRing(320, 14, 34, { seed: 21, base: [0.36, 0.42, 0.3] });
  far.traverse((o) => (o.userData.far = true));
  Q.group.add(far);
  /* the public building (in this game's square it stands to the north; in the town it is the east side, facing King's House) */
  const PB = S.publicBuilding(42);
  add(Q, PB, 0, -5.4);
  wall(Q, 0, -12.6, 42.4, 9.2);
  for (let i = 0; i <= 9; i++) wall(Q, -21 + (i * 42) / 9, -5.4, 0.95, 0.95);
  wall(Q, -22.6, -6.6, 3, 4);
  wall(Q, 22.6, -6.6, 3, 4);
  strip(Q, 46, 2.4, std(T.stone([170, 164, 150], [14, 1]), 1), 0, -3.7, 0.014);
  /* the notice of the day's trial, on the pier beside the court door */
  const board = grp();
  box(0.86, 1.2, 0.05, W.WM.woodDark, 0, 0, 0, board);
  const paper = P.label("THE KING against LEWIS HUTCHINSON", 0.74, 0.28, "#e8ddc4");
  paper.position.set(0, 0.3, 0.03);
  board.add(paper);
  plane(0.74, 0.62, solid(0xe8ddc4, 1), 0, -0.2, 0.03, board);
  for (let i = 0; i < 6; i++) box(0.6 - (i % 3) * 0.08, 0.012, 0.002, solid(0x4a4034, 1), -0.04 * (i % 3), 0.02 - i * 0.08, 0.034, board);
  board.traverse((o) => (o.userData.noBatch = true));
  add(Q, board, 2.333, -4.92, 1.6);
  const seal = cyl(0.05, 0.05, 0.012, solid(0x9a1f1a, 0.5), 2.333 + 0.24, 1.14, -4.88, Q.group, 10);
  seal.rotation.x = Math.PI / 2;
  seal.userData.noBatch = true;
  seal.visible = false;
  Q.reveal.notice = (seen) => (seal.visible = seen);   /* the clerk's seal goes on once it has been read out */
  /* the long gallery over the arcade: its jalousies stand shut until you listen under them */
  const jal = [],
    jx = [-4.667, 0, 4.667];
  for (const x of jx) {
    const j = box(1.2, 2.3, 0.05, S.SM.green, x, 6.35, -5.4 - 2.5, Q.group);
    j.userData.noBatch = true;
    jal.push(j);
  }
  Q.reveal.gallery = (seen) =>
    jal.forEach((j, i) => {
      j.scale.x = seen ? 0.16 : 1;
      j.position.x = jx[i] + (seen ? 0.52 : 0);
    });
  /* the railed green in the middle of the square */
  add(Q, S.octagon(5.2), 0, 9);
  Q.walls.push([-4.9, 6.9, 4.9, 11.1], [-2.1, 4.1, 2.1, 13.9], [-3.6, 5.4, 3.6, 12.6]);
  /* King's House across the square, with palms before it */
  add(Q, S.kingsHouse(46), 0, 33, 0, Math.PI);
  wall(Q, 0, 31, 60, 12);
  for (const x of [-17, -9, 9, 17]) add(Q, palm(8 + (Math.abs(x) % 2), x + 30), x, 25.4);
  wall(Q, 0, 25.4, 40, 0.6);
  /* the other two sides: town houses, garden walls, the streets running out between them */
  const sides = [
    [-27, -3, 12, { rgb: [206, 192, 160], piazza: true, seed: 1 }, Math.PI / 2],
    [-27, 12, 13, { rgb: [170, 104, 82], seed: 2, brickWall: true }, Math.PI / 2],
    [-27, 27, 11, { rgb: [214, 204, 178], seed: 3 }, Math.PI / 2],
    [27, -4, 11, { rgb: [196, 176, 140], seed: 4 }, -Math.PI / 2],
    [27, 20, 14, { rgb: [210, 196, 166], piazza: true, seed: 5 }, -Math.PI / 2],
    [-44, 4, 12, { rgb: [200, 184, 150], seed: 6 }, Math.PI / 2],
    [46, 30, 12, { rgb: [200, 184, 150], seed: 7 }, -Math.PI / 2],
    [-38, -22, 14, { rgb: [190, 170, 136], seed: 8 }, 0],
    [38, -24, 14, { rgb: [204, 190, 160], seed: 9 }, 0],
  ];
  for (const [x, z, w, o, ry] of sides) add(Q, S.townHouse(w, o), x, z, 0, ry);
  for (const [x, z, len, ry] of [[-27.4, 4.6, 3.4, Math.PI / 2], [-27.4, 20.2, 3.6, Math.PI / 2], [27.4, 2.6, 2.4, Math.PI / 2], [27.4, 4.2, 0.1, 0]]) if (len > 1) add(Q, S.gardenWall(len), x, z, 0, ry);
  wall(Q, -27.5, 12, 3, 46);
  wall(Q, 27.5, -4, 3, 13);
  wall(Q, 27.5, 20, 3, 15);
  for (const [x, z, h, s] of [[-13, 3.4, 7, 41], [13.5, 2.6, 7.5, 42], [-14, 18.5, 8, 43], [14.5, 15.5, 7, 44]]) solid1(Q, tree(h, s, 1), x, z, 0.9, 0.9);
  for (const [x, z, h, s] of [[-36, 16, 9, 45], [-34, -10, 8, 46], [36, 6, 9, 47], [40, -10, 8, 48], [-20, 44, 9, 49], [24, 46, 8, 50]]) add(Q, tree(h, s, 1), x, z);
  /* the life of the square: benches, a water cart, market women's goods on the ground */
  for (const [x, z, ry] of [[-11.2, 1.6, 0.3], [11.4, 0.6, -0.3], [-12.4, 16.6, 1.2]]) solid1(Q, W.bench(2), x, z, 2.1, 0.5, ry);
  const wc = cart(2.6, 1.4);
  for (const [x, z] of [[-0.5, 0], [0.4, 0.1]]) {
    const b = barrel();
    b.scale.setScalar(0.8);
    b.position.set(x, 0.76, z);
    wc.add(b);
  }
  solid1(Q, wc, -16, 9.6, 3.0, 1.9, 0.4);
  solid1(Q, mule(0x5a4a3c), -16.9, 12.6, 0.9, 2.0, 0.4);
  solid1(Q, barrel(), 16.6, 7.4, 0.7, 0.7);
  solid1(Q, barrel(), 16.9, 8.3, 0.7, 0.7);
  solid1(Q, S.groundStall(1), 9.6, 18.4, 1.9, 1.3, -0.4);
  solid1(Q, S.groundStall(2), 6.6, 20.4, 1.9, 1.3, -0.1);
  solid1(Q, crate(0.6), 17.4, 6.2, 0.7, 0.7);
  /* the gallows, far down the street that leaves the square, seen only in the last scene and only as a shape against the dawn */
  const gal = grp();
  box(3.4, 0.25, 2.2, W.WM.dark, 0, 1.6, 0, gal);
  for (const [x, z] of [[-1.6, -1], [1.6, -1], [-1.6, 1], [1.6, 1]]) box(0.16, 1.6, 0.16, W.WM.dark, x, 0.8, z, gal);
  box(0.2, 3.6, 0.2, W.WM.dark, -1.3, 3.5, 0, gal);
  box(2.0, 0.18, 0.18, W.WM.dark, -0.4, 5.2, 0, gal);
  box(0.9, 0.12, 0.12, W.WM.dark, -0.95, 4.75, 0, gal).rotation.z = Math.PI / 4;
  cyl(0.015, 0.015, 0.9, W.WM.dark, 0.5, 4.7, 0, gal, 5);
  gal.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.noAudit = true;
  });
  gal.visible = false;
  add(Q, gal, 56, 9, 0, -1.3);
  const fc = add(Q, S.farCrowd(34, 9, 3), 48, 9, 0, Math.PI / 2);
  fc.visible = false;
  const DAWN = { top: 0x39486a, hor: 0xe7a36a, stars: 0.12, fog: [0xb89a86, 50, 420], sun: [0xffb070, 1.3, 60, 12, 40], hemi: [0xd9c4c8, 0x6a5a4c, 1.9], fill: 1.6 };
  const DAYL = Q.light;
  Q.props.gallows = gal;
  let dawn = false;
  Q.films.morning = (t) => {
    if (t >= 0 === dawn) return;
    dawn = t >= 0;
    gal.visible = fc.visible = dawn;
    Q.light = dawn ? DAWN : DAYL;
    Q.relight?.();
  };
  /* people */
  person(Q, "clerk", "clerk", -1.3, -3.6, face(-1.3, -3.6, 2, 2), { kind: "watch", at: [2.3, -5], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] }, { held: "ledger" });
  person(Q, "hutton", "hutton", 0.9, -6.5, face(0.9, -6.5, 0, 0), { kind: "watch", at: [0, 0], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cubba", "cubba", 4.6, 1.6, face(4.6, 1.6, 0, -5), { kind: "watch", at: [0, -8], idles: ["OldIdle"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "hx_townman", -7.4, 1.2, 0, { kind: "chat", group: "a", at: [-7, 1.6] });
  crowd(Q, "hx_townwoman", -6.4, 2.2, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_man", -7.9, 2.4, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_woman", 8, 16, 0, { kind: "wander", area: [6, 13, 13, 17.4], pause: [3, 7] });
  crowd(Q, "hx_townman", 15, -1, 0, { kind: "wander", pts: [[15, -1], [8, -1.6], [-9, -1.2], [-15, 0.4]], pause: [2, 5] });
  crowd(Q, "hx_townwoman", -14.4, 7.6, face(-14.4, 7.6, -16, 9.6), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-16, 9.6] });
  crowd(Q, "hx_man", 15.4, 6.9, face(15.4, 6.9, 16.7, 7.8), { kind: "work", clips: ["IdleM", "PickUp", "WipeSweat"], work: [5, 9], face: [16.7, 7.8] });
  crowd(Q, "hx_penwoman", 9.9, 19.9, face(9.9, 19.9, 9.6, 18.4), { kind: "work", clips: ["Idle", "PickUp", "Idle"], work: [5, 9], face: [9.6, 18.4] });
  crowd(Q, "hx_woman", 5.2, 21.2, face(5.2, 21.2, 6.6, 20.4), { kind: "watch", at: [0, 9], idles: ["Idle"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  crowd(Q, "hx_penman", -9, 19, 0, { kind: "work", between: [[-9, 19], [-15, 14.4]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "hx_townwoman", 11, 6, 0, { kind: "chat", group: "b", at: [11.4, 6.4] });
  crowd(Q, "hx_townman", 12, 7, 0, { kind: "chat", group: "b" });
  point(Q, "green", 0, 15.6, "the railed green");
  Q.keepOff = [{ at: [2.33, -3.4], r: 1.1 }, { at: [-4.67, -6.4], r: 1 }, { at: [-1.3, -2.2], r: 1 }, { at: [0, 15.6], r: 1.2 }, { pts: [[13, 19], [0, 15.6], [-7, 3], [-1.3, -2.4]], w: 1.2 }];
  return Q;
}

const builders = { road, castle, hall, hole, town };
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  for (const [, t] of Object.entries(TASKS).filter(([, t]) => t.place === id)) {
    if (Q.items[t.item]) continue;
    const o = P.item(t.item),
      at = t.start;
    add(Q, o, at[0], at[2], at[1], at[3] || 0);
    Q.items[t.item] = o;
  }
  Q.itemStarts = Object.fromEntries(Object.entries(Q.items).map(([id, o]) => [id, { at: o.position.toArray(), scale: o.scale.toArray(), ry: o.rotation.y }]));
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
