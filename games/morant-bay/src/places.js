/* The three places of the story: Stony Gut, Morant Bay and Spanish Town. What is modelled on a source and what is a general picture is in
   docs/games/morant-bay.md ("Places and looks").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, at Stony Gut in chapter 5, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/morant-bay/people). */
import * as THREE from "three";
import { makeDoor } from "../../../engine/door.js";
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng, batchStatic } from "./gfx.js";
import { tree, palm, bush, mule, cart, barrel, scatter, surveyPole, sack, crate, marketBasket, banana } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import * as S from "./scenery.js";
import { TASKS } from "./steps.js";
import { flock as roostFlock, fireflies } from "../../../engine/life.js";   /* birds going to roost, fireflies over the grass at dusk */
import { blaze } from "../../../engine/blaze.js";
import { hen } from "../../../engine/animals.js";   /* a building on fire (engine/blaze.js) */
import { createSea } from "../../../engine/sea.js";
import { wattleHouse, bushChapel, caneField, yamHills, plantain, guinep, courthouse, schoolhouse, marketShed, louvreHouse, courtShed, boardwalk, flagpole, farGallows, caveMouth, rodneyMemorial, canoe, beachBoat, sandTex, tinLantern } from "./mbscenery.js";

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
/* a thing the story shows or hides by step: kept out of the merge (mergePlace), so hiding it works */
const dyn = (o) => (o.traverse((c) => (c.userData.noBatch = true)), o);
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
/* a background person: look is a body (tools/morant-bay/people); life an ambient behaviour */
function crowd(Q, look, x, z, ry, life, opts = {}) {
  /* the story's own marks (when they are on stage, a part in a camera scene, a thing in the hand) belong to the person, not the behaviour */
  const own = {};
  for (const k of ["when", "watcher", "riot", "vol", "held", "uniform", "march", "lead", "police", "rise"]) if (life && k in life) {
    own[k] = life[k];
    delete life[k];
  }
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...own, ...opts });
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
/* the hills of St Thomas-in-the-East: steep, wooded right to the top, ridge behind ridge (the 1865 engravings show them so behind Morant Bay).
   A far ring from the engine, and near and middle rings of steep round wooded hills with only a little rock showing.
   gaps: directions (radians, atan2(z, x)) kept open, such as the track running out of the place. */
function hills(Q, seed = 3, near = true, gaps = [0, Math.PI]) {
  /* the far hills are the engine's ridges (engine/ridges.js, made in main.js), going blue into the haze */
  if (!near) return;
  const r = rng(seed * 7 + 1),
    open = (a) => gaps.some((g) => Math.abs(Math.atan2(Math.sin(a - g), Math.cos(a - g))) < 0.2);
  for (const [R, n, r0, r1, h0, h1] of [[66, 15, 11, 17, 14, 22], [98, 19, 15, 22, 19, 28], [140, 21, 20, 30, 24, 34]])
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.25 + R * 0.01;
      if (open(a)) continue;
      const d = R + (r() - 0.5) * R * 0.2,
        rad = r0 + r() * (r1 - r0),
        tone = [0.2 + r() * 0.05, 0.36 + r() * 0.06, 0.17 + r() * 0.03];
      add(Q, S.cockpitHill(rad, h0 + r() * (h1 - h0), seed * 50 + i + R, { tone, bare: 0.05 + r() * 0.06 }), Math.cos(a) * d, Math.sin(a) * d, -0.6);
    }
}
const DUST = [186, 168, 132],
  DRY = [150, 144, 96],
  GOLD = [1.3, 1.02, 0.6],   /* Guinea grass in a dry month */
  PALE = [1.12, 1.0, 0.7];
/* a point along a path of [x, z] at k from 0 to 1, with the heading there: [x, z, ry] (a body that faces +z) */
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
const moveTo = (o, x, y, z) => o.position.set(x, y, z);
/* Q.reveal[id](k): a thing to look at, from 0 (as you find it) to 1 (changed). The look moment (engine/lookshot.js) calls it every frame with
   k rising over two or three seconds, so the thing moves while you watch; on arrival it is called with true or false (1 or 0). */
const K = (seen) => Math.max(0, Math.min(1, +seen)),
  span = (k, a, b) => {
    const u = Math.max(0, Math.min(1, (k - a) / (b - a)));
    return u * u * (3 - 2 * u);
  },
  mix = (a, b, u) => a + (b - a) * u;
/* a peg with a red rag: one of the marks along a boundary */
function peg(c = 0xb03a2a) {
  const g = grp();
  cyl(0.03, 0.02, 0.9, W.WM.wood, 0, 0.45, 0, g, 6);
  box(0.22, 0.12, 0.012, solid(c, 1), 0.12, 0.8, 0, g);
  return g;
}

/* ---------- 1. Stony Gut, St Thomas-in-the-East, 1865 ----------
   A village in the hills about five or six miles from Morant Bay (Report p.11). No picture of it in 1865 is known: the houses, the chapel,
   the yards and the cane here are a general picture (docs/games/morant-bay.md). North is -z. The track runs up through the village to the
   chapel; Hannah's house is on its west side, with the family's provision ground behind it; Paul Bogle's yard is on the east; the cane is to
   the south-west and the cave is in the limestone to the north-west. */
const H = { x: -7, z: 4 },   /* Hannah's house */
  CHAPEL = { x: 6, z: -9 },
  BOGLE = { x: 14, z: -3 },
  CAVE = { x: -18, z: -13.5 };
function gut() {
  const Q = base("gut", [-21, -16, 21, 15], [0.6, 13.2, Math.PI]);
  Q.floor = "sand";
  Q.beds = { wind: 0.05, bird: 0.12 };
  const DRY = { top: 0x86b4cc, hor: 0xe8dcb8, fog: [0xdcd8c0, 80, 460], sun: [0xfff0c8, 2.5, -30, 60, 24], hemi: [0xfff4dc, 0x8a8a62, 2.5], ridge: 0x3f6a36 },
    MORN = { top: 0x7aa8c8, hor: 0xf0dcb0, fog: [0xe2dac0, 70, 420], sun: [0xffe6b0, 2.2, 40, 30, -20], hemi: [0xfff0d8, 0x7a8462, 2.3], ridge: 0x3a6434 },
    NIGHT = { top: 0x0c1220, hor: 0x2a3040, stars: 1, fog: [0x141a24, 30, 220], sun: [0x8aa0c8, 0.35, -20, 60, 30], hemi: [0x4a5878, 0x1a1a1e, 0.9], fill: 1.6, ridge: 0x10161c, haze: 0x1a2030, glow: 0.4 },
    SMOKE = { top: 0x5a5a62, hor: 0xc89068, fog: [0x8a7a6a, 40, 300], sun: [0xffb080, 1.4, 50, 14, 30], hemi: [0xe0c8b0, 0x5a4a3c, 1.8], ridge: 0x3a4a34, haze: 0x8a7a6a, glow: 0.7 };
  Q.light = DRY;
  Q.view = { pos: [3, 2.6, 13], look: [-2, 1.4, 0] };
  ground(Q, std(T.grass([60, 60], [140, 134, 88])), 700);
  strip(Q, 2.8, 34, std(T.dirt([1, 12], DUST)), 0.4, -1);   /* the track up through the village */
  strip(Q, 9, 7, std(T.dirt([3, 2], [168, 150, 116])), -5.2, 4.6, 0.009);   /* the swept yard before the house */
  strip(Q, 9, 8, std(T.dirt([3, 3], [170, 152, 118])), BOGLE.x - 1, BOGLE.z, 0.009);   /* Bogle's yard */
  strip(Q, 7, 4, std(T.dirt([2, 1], [170, 152, 118])), CHAPEL.x, CHAPEL.z + 6.5, 0.008);
  hills(Q, 5, true, [Math.atan2(40, 0)]);
  /* the family's house: wattle and daub, thatch, its door to the track */
  const home = dyn(wattleHouse(4.8, 3.6, { seed: 2 }));
  solid1(Q, home, H.x, H.z, 4.8, 3.6, Math.PI / 2);
  const homeBurnt = add(Q, dyn(wattleHouse(4.8, 3.6, { seed: 2, burnt: true })), H.x, H.z, 0, Math.PI / 2);
  homeBurnt.visible = false;
  solid1(Q, S.cookFire(true), -3.8, 6.6, 0.8, 0.8);
  const smk = add(Q, dyn(S.smoke(4, { rise: 2.2, spread: 0.4, size: 0.7 })), -3.8, 6.6, 0.5);
  Q.tickers.push((t) => smk.userData.tick(t));
  solid1(Q, W.bench(1.6), -4.4, 8.4, 1.7, 0.5, 0.1);
  for (const [x, z] of [[-9.6, 6.2], [-9.4, 5.4]]) add(Q, sack(0xa8946a), x, z);
  solid1(Q, barrel(), -9.4, 1.4, 0.7, 0.7);   /* the water barrel, near empty in the dry year */
  /* the provision ground behind the house: yam hills gone dry, a few plantains, a breadfruit */
  add(Q, yamHills(28, [-19, -8, -11, 1], { seed: 3, dry: true }));
  for (const [x, z, s] of [[-19.5, 2.6, 1], [-11, 2.8, 2], [-20.4, -2, 4]]) solid1(Q, plantain(3.0 + (s % 2) * 0.4, s, true), x, z, 0.5, 0.5);
  solid1(Q, tree(7.5, 8, 1), -13, 9.4, 0.9, 0.9);
  /* the spring below the cane, low in the drought: a pool in the rocks */
  add(Q, S.patch(2.4, 1.6, solid(0x55606a, 0.3), 4, 0.015), -16.5, 12.2);
  add(Q, S.patch(3.1, 2.2, solid(0x9a8a6c, 1), 5, 0.012), -16.5, 12.2);
  for (const [x, z, s] of [[-18.4, 11.4, 0.6], [-15, 13.2, 0.5], [-17.6, 13.6, 0.7]]) solid1(Q, W.rocks(s, x * 3, 2), x, z, s * 1.2, s * 1.2);
  point(Q, "spring", -15.4, 11.2, "the spring");
  /* the yards: hens pecking, banana clumps and coconut palms by the houses, bushes along the edges of the village */
  for (const [x, z, sd] of [[-3.0, 4.2, 1], [-2.2, 9.6, 2], [-5.6, 9.8, 3], [10.6, 5.2, 4], [12.8, -0.6, 5], [3.4, 6.4, 6]]) {
    const h = add(Q, hen(sd), x, z, 0, sd * 1.7);
    Q.tickers.push((t) => h.userData.tick(t));
  }
  for (const [x, z, sd] of [[-10.6, 8.2, 11], [-2.6, 10.8, 12], [5.8, 12.8, 13], [19.8, 6.0, 14], [19.6, -8.6, 16]]) solid1(Q, banana(sd, sd % 2 === 0), x, z, 0.6, 0.6);
  /* the clump below the cave is cover on the way up (chapter 5); the cave-mouth camera looks out past it, so the film leaves it out of the frame */
  const caveBanana = dyn(banana(15, false));
  solid1(Q, caveBanana, -13.4, -10.6, 0.6, 0.6);
  for (const [x, z, sd] of [[-11.6, 12.4, 21], [11.4, 12.0, 22], [2.6, -13.6, 23], [19.4, 1.8, 24], [-19.6, 4.0, 25], [9.8, -14.6, 26]]) solid1(Q, palm(8 + (sd % 3), sd), x, z, 0.5, 0.5);
  scatter(Q.group, (i) => bush(i + 40, 0.9 + (i % 3) * 0.3), 26, [-24, -18, 24, 18], [[-21.5, -16.5, 21.5, 15.5]], 31);
  scatter(Q.group, (i) => tree(6 + (i % 3), i + 70, i % 2), 14, [-40, -40, 40, 40], [[-24, -18, 24, 18]], 37);
  /* the cane, south-west of the house: tall enough to hide in */
  const CANE = [-21, 5.6, -11.5, 10.4];
  add(Q, caneField(CANE, { seed: 7, clear: [[-17.6, 9.6, -15.6, 11], [-14.2, 8.2, -11.8, 10.6]] }));
  /* neighbours' houses (soldiers burned about eight cottages at Stony Gut on 19 October: Report p.20; here three of these and the family's) */
  const houses = [];
  for (const [x, z, ry, s, w, d] of [[-8, -6, Math.PI / 2, 4, 4.2, 3.2], [9, 8.6, -Math.PI / 2, 5, 4.4, 3.4], [15.6, 9.4, -Math.PI / 2 + 0.2, 6, 4.0, 3.2], [-10.4, -13.8, 0.3, 7, 4.0, 3.0], [16, -12, -0.2, 8, 4.4, 3.2]]) {
    const wh = solid1(Q, dyn(wattleHouse(w, d, { seed: s })), x, z, w, d, ry);
    const b = add(Q, dyn(wattleHouse(w, d, { seed: s, burnt: true })), x, z, 0, ry);
    b.visible = false;
    houses.push([wh, b]);
  }
  /* Paul Bogle's yard: his house and a fence of posts and rails round the yard */
  const bh = dyn(wattleHouse(6, 4.2, { seed: 9, h: 2.3 }));
  solid1(Q, bh, BOGLE.x + 2.6, BOGLE.z, 6, 4.2, -Math.PI / 2);
  const bhB = add(Q, dyn(wattleHouse(6, 4.2, { seed: 9, burnt: true, h: 2.3 })), BOGLE.x + 2.6, BOGLE.z, 0, -Math.PI / 2);
  bhB.visible = false;
  for (const [x0, z0, x1, z1] of [[8.6, -7.4, 19, -7.4], [8.6, 1.4, 19, 1.4]]) {
    add(Q, S.postRail(x1 - x0, 1.15), (x0 + x1) / 2, z0);
    wall(Q, (x0 + x1) / 2, z0, x1 - x0, 0.3);
  }
  /* the west side of the yard: a fence with one narrow gap between two posts (owner, 23 November 2026: the watching place was out in the open,
     in a wide gateway), and bushes either side of it to hide behind */
  for (const [z0, z1] of [[-7.4, -2.3], [-1.3, 1.4]]) {
    add(Q, S.postRail(z1 - z0, 1.15), 8.6, (z0 + z1) / 2).rotation.y = Math.PI / 2;
    wall(Q, 8.6, (z0 + z1) / 2, 0.3, z1 - z0);
  }
  for (const [x, z, sz] of [[7.6, -3.1, 1.25], [7.5, -0.3, 1.15]]) solid1(Q, bush(x * 13 | 0, sz), x, z, 1.0, 1.0);
  point(Q, "yard", 7.5, -1.8, "the gap in Bogle's fence");
  /* the chapel: a long thatched house, its door to the south */
  const ch = add(Q, dyn(bushChapel(5.4, 10)), CHAPEL.x, CHAPEL.z);
  for (const [x, z, w, d] of [[CHAPEL.x, CHAPEL.z - 5, 5.6, 0.4], [CHAPEL.x - 2.7, CHAPEL.z, 0.4, 10], [CHAPEL.x + 2.7, CHAPEL.z, 0.4, 10], [CHAPEL.x - 2.0, CHAPEL.z + 5, 1.6, 0.4], [CHAPEL.x + 2.0, CHAPEL.z + 5, 1.6, 0.4]]) wall(Q, x, z, w, d);
  const chB = add(Q, dyn(bushChapel(5.4, 10, { burnt: true })), CHAPEL.x, CHAPEL.z);
  chB.visible = false;
  const fires = [blaze({ w: 5.4, d: 10, eave: 2.5, ridge: 4.6, seed: 3 }), blaze({ w: 4.8, d: 3.6, eave: 2.1, ridge: 3.8, seed: 5 }), blaze({ w: 6, d: 4.2, eave: 2.3, ridge: 4.0, seed: 8 })];
  add(Q, fires[0], CHAPEL.x, CHAPEL.z);
  add(Q, fires[1], H.x, H.z, 0, Math.PI / 2);
  add(Q, fires[2], BOGLE.x + 2.6, BOGLE.z, 0, -Math.PI / 2);
  for (const f of fires) f.userData.light.distance = 70;
  solid1(Q, S.cottonTree(14, 5), -2.6, -12.6, 1.2, 1.2);
  /* the placard: the Queen's Advice, nailed to a post by the chapel path (10,000 were printed and posted; Report p.32 records the meeting about it) */
  const post = grp();
  box(0.14, 2.0, 0.14, W.WM.woodDark, 0, 1.0, 0, post);
  const plac = grp(post, 0, 1.5, 0.08);
  plane(0.56, 0.74, solid(0xeee4cc, 1), 0, 0, 0, plac);
  const head = P.label("THE QUEEN'S ADVICE", 0.5, 0.09, "#eee4cc", "#221c18");
  head.position.set(0, 0.28, 0.004);
  plac.add(head);
  for (let i = 0; i < 9; i++) box(0.42 - (i % 3) * 0.06, 0.011, 0.002, solid(0x4a4034, 1), -0.03 * (i % 3), 0.16 - i * 0.05, 0.005, plac);   /* the lines of print, too small to read here */
  plac.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.fixed = true;   /* nailed to the post */
  });
  solid1(Q, post, 2.4, -2.6, 0.3, 0.3);
  Q.reveal.placard = (seen) => {
    const k = span(K(seen), 0.05, 0.6);
    plac.rotation.x = -0.25 * (1 - k);   /* a corner had curled down: you smooth it flat to read */
    plac.position.z = 0.08 + 0.1 * (1 - k);   /* stood off the post far enough that the tilted sheet never goes behind its face (owner: the post came through the paper) */
  };
  point(Q, "placard", 2.4, -1.4, "the placard");
  /* the old list, kept in the house in a tin box: lifted out and unfolded (chapter 1) */
  const tin = grp();
  box(0.3, 0.1, 0.22, solid(0x6a6a68, 0.5, 0.4), 0, 0.05, 0, tin);
  const lid = box(0.3, 0.02, 0.22, solid(0x7a7a76, 0.5, 0.4), 0, 0.11, 0, tin);
  lid.geometry.translate(0, 0, 0.11);
  lid.position.z = -0.11;
  const paper = plane(0.22, 0.16, solid(0xe6dcc0, 1, 0, { side: THREE.DoubleSide }), 0, 0.105, 0, tin);   /* folded small: it lies inside the box (it was wider than the box and stuck out through the lid) */
  paper.rotation.x = -Math.PI / 2;
  const lines = grp(); paper.add(lines); lines.rotation.x = Math.PI / 2;   /* the writing moves with the paper */
  for (let i = 0; i < 5; i++) box(0.14 - (i % 2) * 0.03, 0.002, 0.008, solid(0x2e2822, 1), -0.02, 0.002, -0.06 + i * 0.03, lines);
  tin.traverse((o) => (o.userData.noBatch = true));
  add(Q, tin, -4.4, 8.4, 0.46, 0.2);
  Q.reveal.list = (seen, stage) => {
    const k = K(seen),
      u = span(k, 0.05, 0.5);
    lid.rotation.x = -1.9 * u;
    paper.position.y = mix(0.105, 0.2, span(k, 0.5, 0.9));
    if (stage !== undefined) tin.visible = stage < 20;   /* put away indoors after chapter 1: it is not on the bench in later chapters */
  };
  point(Q, "bench", -4.4, 9.4, "the bench");
  /* the yam hill you dig in (chapter 1): the fork goes in and turns up dry earth and a yam no bigger than a fist */
  const fork = cyl(0.016, 0.02, 1.2, W.WM.wood, -12.6, 0.55, -2.2, Q.group, 5);
  fork.rotation.z = 0.35;
  fork.userData.noBatch = true;
  const yam = mesh(new THREE.SphereGeometry(0.07, 8, 6), solid(0x7a5a3a, 1), -12.4, 0.08, -2.4, Q.group);
  yam.scale.set(1.6, 0.8, 0.9);
  yam.userData.noBatch = true;
  yam.userData.fixed = true;   /* lifted on the fork */
  fork.userData.fixed = true;
  yam.visible = false;
  const dust = add(Q, S.smoke(3, { rise: 0.4, spread: 0.3, size: 0.32, tint: 0xa89070 }), -12.4, -2.3, 0.02);
  dust.visible = false;
  dust.traverse((o) => (o.userData.noAudit = true));
  Q.tickers.push((t) => dust.visible && dust.userData.tick(t));
  Q.reveal.yams = (seen) => {
    const k = K(seen);
    fork.rotation.z = 0.35 + 0.5 * span(k, 0.45, 0.75);
    fork.position.y = 0.6 * Math.cos(fork.rotation.z) - 0.04 - 0.16 * span(k, 0.05, 0.4) * (1 - span(k, 0.5, 0.8));   /* pushed into the earth, then levered over: its foot stays in the ground */
    yam.visible = k > 0.55;
    yam.position.y = 0.04 + 0.12 * span(k, 0.55, 0.75) - 0.1 * span(k, 0.8, 1);   /* turned up on the fork, then rolled out onto the earth */
    dust.visible = k > 0.4 && k < 1;
  };
  /* the night meeting (chapter 3): a lantern on the leader's table in the chapel, a sheet of paper and a pen */
  const lamp = add(Q, tinLantern(), CHAPEL.x + 0.3, CHAPEL.z - 4.1, 0.95);
  lamp.traverse((o) => (o.userData.noBatch = true));
  const lampLight = new THREE.PointLight(0xffc070, 0, 9, 1.6);
  lampLight.position.set(CHAPEL.x + 0.3, 1.5, CHAPEL.z - 4.1);
  Q.group.add(lampLight);
  const sheet = plane(0.3, 0.4, solid(0xe8e0c8, 1, 0, { side: THREE.DoubleSide }), CHAPEL.x - 0.2, 0.96, CHAPEL.z - 4.0, Q.group);
  sheet.rotation.x = -Math.PI / 2;
  sheet.userData.noBatch = true;
  const names = [], X0 = CHAPEL.x - 0.32;   /* X0: the margin each name starts from */
  for (let i = 0; i < 10; i++) {   /* a name in ink, line under line, each starting at the same margin */
    const len = 0.1 + ((i * 37) % 7) * 0.012,
      n = box(len, 0.0015, 0.0045, solid(0x1e1a16, 1), X0 + len / 2, 0.962, CHAPEL.z - 4.16 + i * 0.03, Q.group);
    n.userData.noBatch = true;
    n.userData.len = len;
    n.visible = false;
    names.push(n);
  }
  /* a dip pen held as you write (owner, 23 November 2026: it lay flat on the paper): a wooden holder with a steel nib, the nib on the paper and the
     holder leaning back toward Hannah and a little to her right, about 50 degrees up from the table. The group's origin is the nib's point. */
  const pen = new THREE.Group(), penTilt = new THREE.Group();
  pen.add(penTilt);
  penTilt.rotation.set(0.62, 0, -0.42);   /* the holder's top back toward the writer (+z) and to her right (+x) */
  cyl(0.0045, 0.0035, 0.15, solid(0x5a3a22, 0.8), 0, 0.087, 0, penTilt, 6);   /* the holder */
  cyl(0.0035, 0.0012, 0.014, solid(0x8a8a90, 0.4, 0.8), 0, 0.007, 0, penTilt, 6);   /* the steel nib */
  pen.position.set(X0, 0.963, CHAPEL.z - 4.16);
  Q.group.add(pen);
  pen.traverse((o) => (o.userData.noBatch = true));
  Q.reveal.names = (seen) => {
    const k = K(seen);
    let at = null;
    names.forEach((n, i) => {
      const f = Math.max(0, Math.min(1, (k - 0.1 - i * 0.08) / 0.08)), L = n.userData.len;   /* each name is written out from the margin, the nib at its end */
      n.visible = f > 0;
      n.scale.x = Math.max(0.001, f);
      n.position.x = X0 + (L * f) / 2;
      if (f > 0) at = [X0 + L * f, n.position.z, f];
    });
    if (at) pen.position.set(at[0], 0.963 + (at[2] >= 1 ? 0.012 : 0.004 * Math.abs(Math.sin(k * 90))), at[1]);   /* the nib moves along the stroke, lifted off between names */
    else pen.position.set(X0, 0.975, CHAPEL.z - 4.16);
  };
  point(Q, "table", CHAPEL.x + 0.2, CHAPEL.z - 2.8, "the table");
  /* the drill in Bogle's yard (chapter 3): men in lines, sticks on their shoulders. Watched from the gap in the fence. */
  Q.reveal.drill = () => {};
  point(Q, "drill", 7.5, -1.8, "the fence");
  /* the cave in the limestone, north-west */
  wall(Q, CAVE.x, CAVE.z - 2.6, 6.4, 1.6);
  /* the limestone the cave runs into: a low face of grey rock behind the mouth, and woods on the slope beyond (a smooth hill stood here and read
     as a green blob behind the village, owner 23 November 2026) */
  const rockFace = grp();   /* one formation: the cave mouth and the rock round it (its stones lie into each other, as rock does) */
  const cm = caveMouth(4);
  cm.position.set(0, 0, -1.2);
  rockFace.add(cm);
  for (const [dx, dz, sz, h, sd] of [[-3.6, -5.6, 4.2, 3.4, 41], [0.4, -6.4, 4.8, 4.2, 42], [4.2, -5.4, 3.6, 2.8, 43]]) {
    const o = S.outcrop(sz, h, sd);
    o.position.set(dx, 0, dz);
    rockFace.add(o);
  }
  add(Q, rockFace, CAVE.x, CAVE.z);
  wall(Q, CAVE.x + 0.3, CAVE.z - 5.8, 11, 2.6);
  for (const [dx, dz, h, sd] of [[-6, -9, 8, 51], [-1, -10.5, 9, 52], [4, -9.4, 7.5, 53], [8, -11, 8.5, 54], [-9, -12.5, 9, 55]]) add(Q, tree(h, sd, 1), CAVE.x + dx, CAVE.z + dz);
  point(Q, "cave", CAVE.x + 0.2, CAVE.z + 0.6, "the cave");
  point(Q, "cane", -12.6, 7.4, "the cane");
  /* chapter 5: soldiers in the yard, one of them looking out over the open ground to the west. While he looks, be in cover. */
  /* two clumps of bush between the cane and the rocks below the cave: from the cane to the next cover was about 15 m of open ground, more than a
     walk can cross while the soldier looks away (owner, 23 November 2026: "not sure it can be completed") */
  for (const [x, z] of [[-13.4, 1.6], [-12.8, -3.8]]) {
    for (const [dx, dz, sz] of [[-0.6, 0, 1.3], [0.5, 0.2, 1.15], [0, -0.4, 1.0]]) add(Q, bush((x * 7 + dx * 13) | 0, sz), x + dx, z + dz);
    wall(Q, x, z, 1.8, 1.0);
  }
  const cover = [[-14.6, 0.6, -12.2, 2.6], [-14.0, -4.8, -11.6, -2.8], CANE.slice(), [H.x - 2.8, H.z - 2.4, H.x - 1.8, H.z + 2.4], [-14.4, -11, -12.0, -8.6], [CAVE.x - 3.6, CAVE.z - 1, CAVE.x + 3.6, CAVE.z + 2.0], [-20.5, -6.6, -18.3, -5.4], [-12, -9.8, -10.4, -8.6]];
  const cycle = (len, still, look) => (t) => {
    const u = t % len;
    return u < still ? 0 : u < still + 0.8 ? (u - still) * 1.2 : u < still + 0.8 + look ? 1 : Math.max(0, 1 - (u - still - 0.8 - look) / 0.8) * 0.99;
  };
  const show = (k) => {
    const w = Q.extras?.find((n) => n.watcher);
    if (!w) return;
    w.m.rotation.y = mix(Math.PI / 2 + 0.4, -Math.PI / 2, span(k, 0, 1));   /* he turns from the yard to look west over the provision ground */
  };
  Q.danger.yard = { start: [H.x - 2.3, H.z, -Math.PI / 2], zone: [-21, -14, -2, 15], cover, grace: 2.2, look: cycle(9, 5.2, 2.2), show, shout: true, line: ["A soldier shouts. You drop down and crawl back to cover.", "He turns your way. You freeze, then slip back.", "Too soon! Wait until he looks away.", "Watch him. Move when his back is turned."] };
  /* the burning (chapter 5): the chapel and the houses catch one after another */
  /* each building burns hard for a while, then its roof gives way: the building slumps and leans over two seconds (with a burst of sparks), then
     only the burnt shell stands, still smoking, as the ward does in Eventide Home (owner, 23 November 2026: "look at the fire from eventide home
     and the collapse of the building.. that is what we need to see in Morant Bay") */
  const falls = [[ch, chB, fires[0], 1], [home, homeBurnt, fires[1], 11], [bh, bhB, fires[2], 7]];   /* the chapel is alight as the scene opens */
  for (const [w] of falls) w.userData.baseY = w.position.y;
  Q.films.burning = (t) => {
    const on = t >= 0;
    caveBanana.visible = !on;   /* out of the cave-mouth frame (?test=lens: its leaves filled the view) */
    for (const [w, b, f, a] of falls) {
      if (!on) { w.scale.y = 1; w.rotation.z = 0; continue; }
      const lit = Math.max(0, Math.min(1, (t - a) / 3)), u = Math.max(0, Math.min(1, (t - a - 7) / 2)), fell = t >= a + 9;
      f.userData.setLevel(fell ? 0.42 : u > 0 ? 1 - 0.3 * u : lit);
      w.visible = !fell; b.visible = fell;
      w.scale.y = 1 - 0.5 * u * u;   /* the roof and walls sink as the roof gives way */
      w.rotation.z = 0.08 * u * u;
    }
    /* night comes; lanterns on the track; soldiers lead men away south, toward the Bay */
    const want = on && t >= 22.5 ? NIGHT : SMOKE;   /* night falls at the cut to the path */
    if (Q.light !== want) {
      Q.light = want;
      Q.relight?.();
    }
    const lead = (Q.extras || []).filter((n) => n.lead !== undefined);
    for (const n of lead) {
      if (!on) {
        n.amb.held = false;
        continue;
      }
      const k = Math.max(0, Math.min(1, (t - 23) / 9)),
        x = n.lead % 2 ? -11.4 : -10.0,   /* down the path past the provision ground, below the cave */
        z = -11 + Math.floor(n.lead / 2) * 1.5 + k * 18;
      walkTo(n, x, z, 0, k > 0 && k < 1);
      n.m.visible = t >= 22.5;
    }
    nightLamp.intensity = on && t >= 22.5 ? 5 : 0;
    const l0 = lead.find((n) => n.lead === 0);
    if (l0) nightLamp.position.set(l0.x + 0.3, 1.2, l0.z);
  };
  /* the soldiers come up the track (the scene of 18 October), and at night lead men away down it with a lantern (19 October) */
  for (let i = 0; i < 4; i++) crowd(Q, "mb_soldier", 4.0 + (i % 2) * 1.2, 11.8 + Math.floor(i / 2) * 1.6, Math.PI, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [51, 51], march: true, uniform: "soldiers" });
  crowd(Q, "mb_soldier", -10.0, -11.0, 0, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [57, 57], lead: 0, uniform: "soldiers" });
  crowd(Q, "mb_man", -11.4, -11.0, 0, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [57, 57], lead: 1 });
  crowd(Q, "mb_man2", -10.0, -9.5, 0, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [57, 57], lead: 2 });
  crowd(Q, "mb_soldier", -11.4, -9.5, 0, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [57, 57], lead: 3, uniform: "soldiers" });
  const nightLamp = new THREE.PointLight(0xffc070, 0, 10, 1.6);
  Q.group.add(nightLamp);
  const walkTo = (n, x, z, ry, on) => {
    n.amb.held = true;
    n.x = x;
    n.z = z;
    n.m.position.set(x, 0, z);
    n.m.rotation.y = ry;
    const clip = on ? "Walk" : "IdleM";
    if (n.clipNow !== clip) {
      n.clipNow = clip;
      n.ctl.play(clip);
    }
  };
  Q.films.soldiers = (t) => {
    for (const n of (Q.extras || []).filter((n) => n.march)) {
      if (t < 0) {
        n.amb.held = false;
        continue;
      }
      const i = Q.extras.filter((m) => m.march).indexOf(n),
        k = Math.max(0, Math.min(1, (t - 2) / 12)),
        x = -0.6 + (i % 2) * 1.2,
        z = 14.6 + Math.floor(i / 2) * 1.6 - k * 13;
      walkTo(n, x, z, Math.PI, k > 0 && k < 1);
    }
  };
  /* the warrant (10 October): a party of police comes up the track to Bogle's gate; at the shell and the drum the men come out of the chapel
     and stand round them (owner, 23 November 2026: "dont see the police marching"). The report says police went with a warrant and were
     held by some hundreds of men; here a few stand for them. */
  for (let i = 0; i < 3; i++) crowd(Q, "mb_constable", 2.2 + (i % 2) * 0.9, 11.0 + i * 0.8, Math.PI, { kind: "watch", at: [8, 0], idles: ["IdleM"], react: [], every: [8, 12], when: [35, 36], police: i, uniform: "police" });   /* only for the scene: after it the police are let go down the hill */
  Q.films.warrant = (t) => {
    const all = Q.extras || [];
    for (const n of all.filter((n) => n.police !== undefined)) {
      if (t < 0) { n.amb.held = false; continue; }
      const i = n.police, k = Math.max(0, Math.min(1, (t - 4) / 9)),
        x0 = -0.6 + (i % 2) * 1.1, z0 = 13.4 + i * 0.5, x1 = 5.4 + i * 0.9, z1 = 2.4 + (i % 2) * 1.0;
      walkTo(n, x0 + (x1 - x0) * k, z0 + (z1 - z0) * k, k < 1 ? Math.atan2(x1 - x0, z1 - z0) : face(x1, z1, 10, -3), k > 0 && k < 1);
    }
    const con = Q.people?.find((p) => p.id === "constable");
    if (con && t >= 0) { const k = Math.max(0, Math.min(1, (t - 3) / 9)); con.x = 1.2 + 3.2 * k; con.z = 13 - 10 * k; con.m.position.set(con.x, 0, con.z); con.m.rotation.y = k < 1 ? Math.atan2(3.2, -10) : face(con.x, con.z, 12, -2); if (con.walkNow !== (k > 0 && k < 1)) { con.walkNow = k > 0 && k < 1; con.ctl.play(con.walkNow ? "Walk" : "IdleM"); } }
    for (const n of all.filter((n) => n.rise !== undefined)) {
      if (t < 0) { n.amb.held = false; n.m.visible = true; continue; }
      if (n.home === undefined) n.home = [n.x, n.z];
      const k = Math.max(0, Math.min(1, (t - 21 - n.rise * 0.5) / 5)), x0 = CHAPEL.x + (n.rise % 3) * 0.8 - 0.8, z0 = CHAPEL.z + 5.4;
      n.m.visible = t >= 21 + n.rise * 0.5;
      walkTo(n, x0 + (n.home[0] - x0) * k, z0 + (n.home[1] - z0) * k, k < 1 ? Math.atan2(n.home[0] - x0, n.home[1] - z0) : -Math.PI / 2, k > 0 && k < 1);
    }
  };
  /* the hour and what stands or has burned, by step */
  Q.enter = (stage) => {
    const night = (stage >= 30 && stage <= 34) || stage === 58 || stage === 59,   /* 58 too: the cave film ends at night, and day came back for one step before night again */
      morn = stage >= 35 && stage < 40,
      martial = stage >= 50,
      burnt = stage >= 58;
    Q.light = night ? NIGHT : martial ? SMOKE : morn ? MORN : DRY;
    Q.beds = night ? { wind: 0.04, cricket: 0.16 } : martial ? { wind: 0.06 } : { wind: 0.05, bird: 0.12 };
    home.visible = !burnt;
    homeBurnt.visible = burnt;
    ch.visible = !burnt;
    chB.visible = burnt;
    bh.visible = !burnt;
    bhB.visible = burnt;
    houses.forEach(([w, b], i) => {
      w.visible = !burnt || i % 2 === 1;
      b.visible = !w.visible;
    });
    for (const f of fires) f.userData.setLevel(burnt && night ? 0.12 : 0);
    lampLight.intensity = stage >= 30 && stage <= 34 ? 6 : 0;
    lamp.visible = stage >= 30 && stage <= 34;
    sheet.visible = stage >= 30 && stage <= 34;
    pen.visible = sheet.visible;
    smk.visible = stage < 50;
    for (const n of Q.extras || []) Q.life?.hide(n, !(!n.when || (stage >= n.when[0] && stage <= n.when[1])));
    /* where the family stands at each step: in the chapel at night, by the fence on the tenth, in the cave in chapter 5 */
    const at = (id, x, z, tx, tz) => {
      const n = Q.people?.find((p) => p.id === id);
      if (!n) return;
      n.x = x;
      n.z = z;
      n.m.position.set(x, 0, z);
      n.m.rotation.y = face(x, z, tx, tz);
      if (n.amb?.spec) n.amb.spec.at = [tx, tz];
    };
    const meeting = stage >= 30 && stage <= 34;
    if (meeting) {
      at("deacon", CHAPEL.x + 0.9, CHAPEL.z - 3.4, CHAPEL.x, CHAPEL.z - 4);
      at("father", CHAPEL.x - 1.2, CHAPEL.z - 0.6, CHAPEL.x, CHAPEL.z - 4.5);   /* on a bench inside, with the other men */
    } else if (stage >= 35 && stage < 40) {
      at("father", 13.4, -6.4, 14, -9);   /* in the yard, in the line of men (clear of the gap in the fence the player looks through) */
      at("mother", H.x + 4.4, H.z + 0.6, 4, 2);   /* out from the wall, clear of the cook fire at (-3.8, 6.6), and a step from Sammy */
      at("brother", H.x + 5.6, H.z + 2.2, 4, 2);
      at("gran", H.x + 3.4, H.z - 1.5, 4, 2);   /* clear of the door leaf as it swings out (owner: she stood in the door) */
    }
    if (meeting || (stage >= 35 && stage < 40)) {
      /* placed above */
    } else if (stage >= 50 && stage < 55) {
      at("gran", H.x - 3.4, H.z + 0.6, -12, 8);
      at("brother", H.x - 3.2, H.z - 0.6, -12, 8);
    } else if (stage >= 55) {
      at("gran", CAVE.x - 1.0, CAVE.z + 0.2, 0, 0);
      at("brother", CAVE.x + 1.1, CAVE.z + 0.1, 0, 0);
    } else {
      at("deacon", 1.4, -4.7, 2.4, -2.6);
      at("father", -10.2, -0.4, -14, -4);   /* behind and beside the dig close-up's camera, not in it (his legs filled it) */
      at("mother", -2.4, 7.4, -3.8, 6.6);   /* out of the tin-box close-up (bent at her work, she filled half of it) */
      at("gran", -4.2, 2.6, -3.8, 6.6);
      at("brother", -2.4, 5.0, -3.6, 7);
    }
    /* while the family hides (chapter 5) Sammy keeps by Gran: left wandering, he walked off to the front yard through the house and
       out of the cave (owner, 23 November 2026: "Sammy walks through walls and people in chapter 5"). Otherwise he plays about the yard. */
    const sammy = Q.people?.find((p) => p.id === "brother");
    if (sammy?.amb) Q.storyLife?.respec(sammy, stage >= 50 ? { kind: "watch", idles: ["Idle", "HeadTurn"], react: ["HeadTurn"], every: [5, 9] } : { kind: "wander" });
  };
  /* people. Story people (person) by the house, the chapel and the yard; the village (crowd) by the step that brings them. */
  person(Q, "gran", "gran", -4.2, 2.6, face(-4.2, 2.6, -3.8, 6.6), { kind: "watch", at: [-3.8, 6.6], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "mother", "mother", -2.4, 7.4, face(-2.4, 7.4, -3.8, 6.6), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-3.8, 6.6] });
  person(Q, "father", "father", -10.2, -0.4, face(-10.2, -0.4, -14, -4), { kind: "watch", at: [-14, -4], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "brother", "brother", -2.4, 5.0, 0, { kind: "wander", area: [-5.6, 3.2, -1.6, 8.4], pause: [2, 5] });
  person(Q, "deacon", "deacon", 1.4, -4.7, face(1.4, -4.7, 2.4, -2.6), { kind: "watch", at: [2.4, -2.6], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "bogle", "bogle", 13.2, -2.4, face(13.2, -2.4, 9, -2), { kind: "watch", at: [9, -2], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "constable", "constable", 4.4, 3.0, face(4.4, 3.0, 12, -2), { kind: "watch", at: [12, -2], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 9] });
  /* the village: neighbours at their work, children */
  crowd(Q, "mb_woman", -19.7, -4.0, 0, { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-15, -3.4], when: [8, 49] });   /* at the far side of the yam hills, working toward you (owner, 23 November 2026: move her further back, behind the yam hills) */
  crowd(Q, "mb_man", 5.6, 4.6, 0, { kind: "work", between: [[5.6, 4.6], [2.4, 3.2]], walk: "Walk", idle: "IdleM", when: [8, 29] });
  crowd(Q, "mb_oldman", 11.4, 7.0, face(11.4, 7, 9, 8.6), { kind: "watch", at: [9, 8.6], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [5, 9], when: [8, 49] });
  crowd(Q, "mb_woman", -2.0, -7.0, 0, { kind: "chat", group: "c", at: [-1.6, -7.4], when: [8, 29] });
  crowd(Q, "mb_man", -1.2, -7.8, 0, { kind: "chat", group: "c", when: [8, 29] });
  /* the men drilled in Bogle's yard (chapter 3, morning): lines of men with sticks */
  for (let i = 0; i < 6; i++) crowd(Q, ["mb_man", "mb_man2", "mb_oldman", "mb_oldman", "mb_townman", "mb_man"][i], 11.2 + (i % 3) * 1.5, -6.2 + Math.floor(i / 3) * 2.2, -Math.PI / 2, { kind: "watch", at: [14, -9], idles: ["IdleM"], react: ["Nod"], every: [6, 10], when: [35, 39], rise: i });   /* drilling toward Bogle's house, side-on to the fence */
  /* chapter 5: soldiers in the yard; one is the watcher */
  crowd(Q, "mb_soldier", 4.2, 0.6, -Math.PI / 2, { kind: "watch", at: [-10, 0], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 8], when: [51, 55], watcher: true, uniform: "soldiers" });
  crowd(Q, "mb_soldier", 5.6, -1.8, Math.PI, { kind: "watch", at: [5.6, -6], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 8], when: [51, 55], uniform: "soldiers" });
  Q.keepOff = [{ at: [2.4, -1.4], r: 1 }, { at: [-4.4, 9.4], r: 1 }, { at: [-12.4, -1.4], r: 1 }, { at: [-15.4, 11.2], r: 1 }, { at: [7.4, -1.1], r: 1 }, { at: [CAVE.x + 0.2, CAVE.z + 0.6], r: 1.2 }, { pts: [[0.6, 13.2], [0.4, -4]], w: 1.2 }];
  return Q;
}

/* ---------- 2. Morant Bay, the Parade, 1865 ----------
   After the Illustrated London News engravings of 9 December 1865 (from naval officers' sketches): the court-house a long low building with
   a row of round arches, a school-house beside it, a two-storey house with a louvred upper floor on the rise, steep wooded hills behind,
   a beach and small boats. The market was held on the Parade in front of the court-house; the meeting of 12 August was "under a gynnep tree"
   there (Report p.32). The layout is a general picture. North (the hills) is -z, the sea is +z. */
function bay() {
  const Q = base("bay", [-23, -6, 23, 11], [-15.2, 9.2, Math.PI * 0.85]);
  Q.floor = "sand";
  Q.beds = { sea: 0.12, crowd: 0.06, wind: 0.04 };
  const DAY = { top: 0x80b4d4, hor: 0xeadcb8, fog: [0xdcdcc8, 80, 520], sun: [0xfff0c8, 2.4, 40, 50, 30], hemi: [0xfff4dc, 0x8a8a6a, 2.5], ridge: 0x2f5a30 },
    LATE = { top: 0x6a94b8, hor: 0xf0c890, fog: [0xd8c8a8, 70, 460], sun: [0xffd090, 2.0, 60, 18, 20], hemi: [0xffe8cc, 0x7a7460, 2.2], ridge: 0x2a4a2c, glow: 0.85 },
    DUSK = { top: 0x1a2236, hor: 0x9a5a40, stars: 0.4, fog: [0x3a3030, 40, 300], sun: [0xff9060, 0.7, 60, 6, 20], hemi: [0x8a7a8a, 0x2a221e, 1.3], fill: 1.4, ridge: 0x181e1e, haze: 0x4a3a34, glow: 0.5 },
    DAWN = { top: 0x39486a, hor: 0xe7a36a, stars: 0.12, fog: [0xb89a86, 50, 420], sun: [0xffb070, 1.3, 60, 12, 40], hemi: [0xd9c4c8, 0x6a5a4c, 1.9], fill: 1.6, ridge: 0x2a3a30, haze: 0xa89090, glow: 0.55 },
    NOW = { top: 0x7cb4e0, hor: 0xe4e8e0, fog: [0xdce4e4, 90, 560], sun: [0xfff4dc, 2.6, 30, 60, 30], hemi: [0xf8f8f0, 0x8a9070, 2.6], ridge: 0x2f6a36 };
  Q.light = DAY;
  Q.view = { pos: [-14, 2.6, 10], look: [0, 2.6, -8] };
  /* the land stops at the shore: the ground runs north from the beach (it covered the sea until 23 November 2026), and the beach slopes down into the water */
  const land = plane(600, 316, std(T.dirt([50, 26], [176, 160, 126])), 0, -0.025, -142, Q.group);
  land.rotation.x = -Math.PI / 2;
  land.name = "terrain";
  strip(Q, 48, 16, std(sandTex([12, 4], [184, 166, 130])), 0, 1, 0.008);   /* the Parade: beaten earth, no wheel ruts on an open square */
  strip(Q, 300, 6, std(sandTex([90, 2])), 0, 13, 0.009);   /* the beach */
  const shore = plane(300, 9, std(sandTex([90, 3], [190, 176, 140])), 0, -0.3, 20.2, Q.group);   /* wet sand, going down under the water */
  shore.rotation.x = -Math.PI / 2 + 0.075;
  shore.name = "terrain";
  createSea(Q.group, { y: -0.35, at: [0, 70], size: 120, edges: [[-60, 17.4, 60, 17.4]] });
  for (const [x, z, ry] of [[-8, 13.6, 0.3], [14, 13.4, 0.1]]) solid1(Q, canoe(4.2, x | 0), x, z, 4.2, 0.9, ry);
  solid1(Q, beachBoat(3), 5, 14.2, 4.8, 1.6, -0.4);
  Q.ridges = "bay";
  for (const [x, z, r, h, s] of [[-40, -45, 30, 22, 1], [0, -52, 36, 28, 2], [40, -46, 30, 24, 3], [-70, -40, 26, 18, 4], [70, -42, 28, 20, 5]]) add(Q, S.karstHill(r, h, s, [0.22, 0.36, 0.2], 0.08), x, z, -1);
  for (let i = 0; i < 18; i++) add(Q, palm(7 + (i % 4), 40 + i), -36 + i * 4.2 + (i % 3), -26 - (i % 5) * 3);
  /* the court-house on the north side of the Parade */
  const CH = { x: 0, z: -11 };
  const court = add(Q, dyn(courthouse({})), CH.x, CH.z),
    courtB = add(Q, dyn(courthouse({ state: "burnt" })), CH.x, CH.z);
  courtB.visible = false;
  wall(Q, CH.x, CH.z - 0.6, 22.8, 8.4);
  const schoolW = add(Q, dyn(schoolhouse()), -18, -9),
    schoolB = add(Q, dyn(schoolhouse(9, 6, { burnt: true })), -18, -9);
  schoolB.visible = false;
  wall(Q, -18, -9, 9.4, 6.4);
  const police = add(Q, dyn(S.lowHouse(7, { h: 3.6, d: 6, rgb: [220, 210, 184], door: 1, seed: 4 })), 17.5, -9.6);
  wall(Q, 17.5, -12.4, 7.2, 6.2);
  const fireS = add(Q, blaze({ w: 9, d: 6, eave: 3.9, ridge: 5.9, seed: 2 }), -18, -9),
    fireC = add(Q, blaze({ w: 22, d: 9, eave: 5.0, ridge: 7.5, seed: 4, flames: 46 }), CH.x, CH.z);
  for (const f of [fireS, fireC]) f.userData.light.distance = 90;
  add(Q, louvreHouse(), 9, -30);
  add(Q, S.lowHouse(8, { h: 3.8, d: 6.4, rgb: [214, 200, 170], door: 1, seed: 6 }), -9, -27);
  add(Q, S.townHouse(10, { rgb: [204, 188, 158], piazza: true, seed: 7 }), 30, -2, 0, -Math.PI / 2);
  wall(Q, 30, -2, 8.4, 11);
  add(Q, S.lowHouse(7, { h: 3.6, d: 6, rgb: [210, 196, 166], door: 1, seed: 8 }), -30, 2, 0, Math.PI / 2);
  wall(Q, -30, 2, 6.4, 7.4);
  /* the guinep tree on the Parade */
  solid1(Q, guinep(8.5, 3), -5.6, -1.6, 1.0, 1.0);
  /* the market: two sheds of stalls on the west side of the Parade, baskets and goods on the boards */
  const shed = add(Q, dyn(marketShed(10, 4, { stalls: 4 })), -14.5, 3.6);
  for (let i = 0; i <= 4; i++) for (const s of [-1, 1]) wall(Q, -19.5 + i * 2.5, 3.6 + s * 2, 0.3, 0.3);
  for (let i = 0; i < 4; i++) wall(Q, -18.25 + i * 2.5, 3.2, 1.9, 1.4);   /* the stall boards (under them, out of the way) */
  for (const [x, c] of [[-18.2, 0xb08a48], [-15.6, 0xa07a40], [-13.1, 0xb8924e], [-10.6, 0x9a7440]]) {
    const bk = add(Q, marketBasket(c), x, 3.2, 0.94);
    bk.traverse((o) => (o.userData.noBatch = true));
  }
  add(Q, marketShed(8, 4, { stalls: 3 }), -16, -2.4);
  for (let i = 0; i <= 3; i++) for (const s of [-1, 1]) wall(Q, -20 + i * 2.667, -2.4 + s * 2, 0.3, 0.3);
  for (let i = 0; i < 3; i++) wall(Q, -18.67 + i * 2.667, -2.8, 2.1, 1.4);
  point(Q, "stall", -11.6, 6.0, "the stall");
  /* the temporary court-house of the engraving (chapter 6), on the east of the Parade, with its flagpole and boardwalk */
  const tc = add(Q, dyn(courtShed()), 11, 3.4),
    fp = add(Q, dyn(flagpole(12)), 17, -1),
    bw = add(Q, dyn(boardwalk(8)), 12, 7.6);
  tc.visible = fp.visible = bw.visible = false;   /* chapter 6 only (Q.enter) */
  const gal = add(Q, farGallows(), 44, 14, 0, 0.4);   /* far along the shore */
  gal.visible = false;
  /* 2026: the court-house rebuilt after 1865 in limestone and brick, burned in 2007, its walls standing */
  const now = grp();
  const shell = grp(now);
  box(20, 7.2, 0.5, std(T.stone([196, 186, 160], [6, 2]), 1), 0, 3.6, 4, shell);
  const sky = solid(0x2a2a2c, 1);   /* the burnt-out rooms behind the window openings */
  for (let i = 0; i < 7; i++)
    for (const y of [1.9, 5.2]) {
      box(1.3, 1.9, 0.06, sky, -8.4 + i * 2.8, y - 0.15, 4.28, shell);
      const top = mesh(new THREE.CircleGeometry(0.65, 12, 0, Math.PI), sky, -8.4 + i * 2.8, y + 0.8, 4.29, shell);
      top.userData.flat = true;
      box(1.6, 0.12, 0.2, std(T.stone([226, 218, 200], [1, 1]), 1), -8.4 + i * 2.8, y - 1.15, 4.35, shell);   /* a stone sill */
    }
  for (const s of [-1, 1]) box(0.5, 7.2, 8, std(T.stone([196, 186, 160], [3, 2]), 1), s * 10, 3.6, 0, shell);
  box(20.6, 0.3, 0.7, std(T.stone([214, 206, 188], [6, 1]), 1), 0, 7.35, 4, shell);   /* the cornice along the top of the walls, the roof gone */
  /* no statue: Edna Manley's Paul Bogle (1965) was taken off its base for repair after the 2007 fire, and no report was found of it going back (docs/games/morant-bay.md) */
  now.traverse((o) => (o.userData.noBatch = true));
  add(Q, now, CH.x, CH.z - 2);
  now.visible = false;
  /* the hour and what stands, by step */
  const old = [court, schoolW, police, shed];
  Q.enter = (stage) => {
    const dusk = stage === 48 || stage === 49,
      late = stage >= 40 && stage < 48,
      after = stage >= 60,
      today = stage >= 69;
    Q.light = today ? NOW : dusk ? DUSK : late ? LATE : DAY;
    Q.beds = dusk ? { sea: 0.1, wind: 0.05 } : after ? { sea: 0.12, wind: 0.04 } : { sea: 0.12, crowd: 0.08, wind: 0.04 };
    const burnt = stage >= 48;
    court.visible = !burnt && !today;
    courtB.visible = burnt && !today;
    schoolW.visible = !burnt && !today;
    schoolB.visible = burnt && !today;
    fireS.userData.setLevel(dusk ? 0.9 : 0);
    fireC.userData.setLevel(dusk ? 1 : 0);
    tc.visible = fp.visible = bw.visible = note.visible = after && !today;
    now.visible = today;
    police.visible = !today;
    gal.visible = false;
    for (const n of Q.extras || []) Q.life?.hide(n, !(!n.when || (stage >= n.when[0] && stage <= n.when[1])));
  };
  /* the eleventh of October, as a camera scene: the crowd comes in from the east road with shells and drums, fills the Parade, the volunteers
     line the court-house steps, stones, the volley, the rush, the school-house set alight and the fire spreading to the court-house as it gets dark */
  const along2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  let saved = null;
  const volley = add(Q, S.smoke(8, { rise: 1.2, spread: 3.2, size: 1.6, tint: 0xd8d4cc }), 0.3, -5.2, 1.4);   /* the white smoke of the volley along the steps */
  volley.visible = false;
  volley.traverse((o) => (o.userData.noAudit = true));
  /* who falls at the volley: two at the front of the crowd, nearest the steps, about 12 m from Hannah with nobody between, never close
     (docs/games/morant-bay.md: people fall at a distance, behind the opt-in card, and the camera cuts away before anyone lies still) */
  const falls = (i, row, col) => col === 4 && (row === 0 || row === 1);
  Q.films.riot = (t, Q) => {
    const crowdN = (Q.extras || []).filter((n) => n.riot),
      vol = (Q.extras || []).filter((n) => n.vol);
    if (t < 0) {
      if (saved) for (const [n, x, z, ry] of saved) {
        n.x = x;
        n.z = z;
        n.m.position.set(x, 0, z);
        n.m.rotation.y = ry;
        n.amb.held = false;
        n.ctl.rest?.();
      }
      saved = null;
      fireS.userData.setLevel(0);
      fireC.userData.setLevel(0);
      Q.light = LATE;
      Q.relight?.();
      return;
    }
    if (!saved) saved = [...crowdN, ...vol].map((n) => [n, n.x, n.z, n.m.rotation.y]);
    for (const [n] of saved) n.amb.held = true;
    crowdN.forEach((n, i) => {
      const row = i % 4,
        col = Math.floor(i / 4),
        home = falls(i, row, col) ? [1.2 + row * 1.4, -3.0 - row * 0.3] : [-2 + col * 2.2 + (row % 2) * 0.9, -1.4 + row * 1.5],   /* the two who fall stand out in front, nearest the steps */
        start = [30 + col * 1.6, -0.4 + row * 1.1];
      let p, clip;
      if (t < 18) {
        const k = Math.max(0, Math.min(1, (t - 3 - i * 0.2) / 11));
        p = along2(start, home, k);
        clip = k > 0 && k < 1 ? "Walk" : i % 3 === 0 ? "Yell" : "Argue";
        n.m.rotation.y = k < 1 ? -Math.PI / 2 : Math.PI;
      } else if (t < 31) {
        p = home;
        clip = t > 27.2 && t < 30 ? "Duck2" : i % 2 ? "Yell" : "Angry";
        if (falls(i, row, col) && t > 27.6) clip = "FallBack";   /* the owner's fall (anims_mb): far off, in the smoke; the camera cuts away at 29.9 s, before they reach the ground */
        n.m.rotation.y = Math.PI;
      } else {
        const k = Math.min(1, (t - 31) / 5),
          tgt = [-4 + col * 2 + (row % 2) * 0.6, -4.6 - row * 0.25];
        p = along2(home, tgt, k);
        clip = k < 1 ? "Run" : "Yell";
        n.m.rotation.y = Math.PI;
      }
      n.x = p[0];
      n.z = p[1];
      n.m.position.set(p[0], 0, p[1]);
      n.m.visible = t > 2 && !(falls(i, row, col) && t >= 29.9);   /* after the cut nobody is left lying on the Parade (the line for this game: never a body) */
      if (n.clipNow !== clip) {
        n.clipNow = clip;
        if (clip === "FallBack") n.ctl.cue(clip, true);   /* asked for by the film on purpose (engine/anim.js NOT_IDLE) */
        else n.ctl.play(clip);
      }
    });
    vol.forEach((n, i) => {
      const x = -3 + i * 2.2,
        z = -6.1 + (t > 33 ? -(t - 33) * 1.4 : 0);
      n.x = x;
      n.z = Math.max(-8.4, z);
      n.m.position.set(n.x, 0.45, n.z);
      n.m.rotation.y = 0;
      n.m.visible = t > 6 && t < 37;
      const clip = t > 33 ? "Walk" : t > 20 && t < 27 ? "Yell" : "IdleM";
      if (n.clipNow !== clip) {
        n.clipNow = clip;
        n.ctl.play(clip);
      }
    });
    volley.visible = t > 27.4 && t < 34;
    if (volley.visible) volley.userData.tick(t * 0.6);
    volley.position.y = 1.4 + Math.max(0, t - 27.4) * 0.15;
    fireS.userData.setLevel(t > 37 ? Math.min(0.9, (t - 37) / 3) : 0);
    fireC.userData.setLevel(t > 43.5 ? Math.min(1, (t - 43.5) / 4) : 0);   /* already catching as its caption comes */
    const want = t > 40 ? DUSK : LATE;
    if (Q.light !== want) {
      Q.light = want;
      Q.relight?.();
    }
  };
  /* chapter 6, the last morning: dawn over the bay and, far along the shore, a dark frame. Nobody is on it. */
  let dawnOn = false;
  Q.films.dawn = (t) => {
    if (t >= 0 === dawnOn) return;
    dawnOn = t >= 0;
    gal.visible = dawnOn;
    Q.light = dawnOn ? DAWN : DAY;
    Q.relight?.();
  };
  Q.films.today = (t) => {
    const on = t >= 0;
    now.visible = on;
    court.visible = false;
    courtB.visible = !on;
    tc.visible = fp.visible = bw.visible = !on;
    police.visible = !on;
    schoolB.visible = !on;
    Q.light = on ? NOW : DAY;
    Q.relight?.();
  };
  /* listening for the shells (chapter 4): the camera looks east up the road, a far line of people appears in the dust */
  const far = add(Q, S.farCrowd(30, 10, 4), 60, 6.4, 0, Math.PI / 2);
  far.visible = false;
  /* the dust they raise on the road (the look's own words: "Dust over the road from the east") */
  const dust = add(Q, S.smoke(14, { rise: 1.2, spread: 7, size: 5.5, tint: 0xa88a62, opacity: 0.7 }), 62, 6.4, 1.2);
  dust.visible = false;
  dust.traverse((o) => (o.userData.noAudit = true));
  Q.reveal.shells = (seen) => {
    const k = K(seen);
    far.visible = k > 0.2 && k < 1;
    far.position.x = mix(80, 58, span(k, 0.2, 1));
    dust.visible = far.visible;
    dust.position.x = far.position.x + 2.5;
    if (dust.visible) dust.userData.tick(k * 9);
  };
  point(Q, "road", 19, 4.6, "the east road");
  /* the notice nailed to the shed post (chapter 6) */
  const note = grp();
  plane(0.5, 0.66, solid(0xeee4cc, 1), 0, 0, 0, note);
  const nh = P.label("MARTIAL LAW", 0.46, 0.08, "#eee4cc", "#221c18");
  nh.position.set(0, 0.25, 0.004);
  note.add(nh);
  for (let i = 0; i < 8; i++) box(0.38 - (i % 3) * 0.05, 0.01, 0.002, solid(0x4a4034, 1), -0.02 * (i % 3), 0.13 - i * 0.045, 0.005, note);
  note.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.fixed = true;   /* nailed to the flagpole */
  });
  add(Q, note, 16.95, -0.903, 1.6);
  note.visible = false;   /* nailed up under martial law (chapter 6) */
  const noteParent = note;
  Q.reveal.notice = (seen) => {
    const k = span(K(seen), 0.05, 0.6);
    noteParent.rotation.z = 0.2 * (1 - k);
  };
  point(Q, "notice", 16.6, 0.4, "the notice");
  /* people */
  person(Q, "mother", "mother", -14.4, 6.2, face(-14.4, 6.2, -15.6, 3.2), { kind: "work", clips: ["Idle", "PickUp", "Idle"], work: [5, 9], face: [-13, 3.2] });
  person(Q, "ada", "ada", -10.2, 6.2, face(-10.2, 6.2, -10.6, 3.2), { kind: "watch", at: [-16, 3.2], idles: ["Idle"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "gran", "gran", 8.4, 8.4, face(8.4, 8.4, 11, 3.4), { kind: "watch", at: [11, 3.4], idles: ["OldIdle"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "deacon", "deacon", 5, 7.6, face(5, 7.6, 11, 3.4), { kind: "watch", at: [11, 3.4], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [6, 10] });
  /* the market day (chapter 4 before the crowd): sellers and buyers */
  crowd(Q, "mb_woman", -17.2, 6.0, face(-17.2, 6.0, -18.2, 3.2), { kind: "work", clips: ["Idle", "PickUp", "Idle"], work: [5, 9], face: [-18.2, 3.2], when: [40, 45] });
  crowd(Q, "mb_woman2", -6, 6, 0, { kind: "wander", area: [-9, 4.6, 4, 9], pause: [3, 7], when: [40, 45] });
  crowd(Q, "mb_townman", 2, 2, 0, { kind: "wander", pts: [[2, 2], [-4, 6], [8, 4.2], [14, 1]], pause: [2, 5], when: [40, 45] });
  crowd(Q, "mb_oldman", -8.8, -1.4, face(-8.8, -1.4, -5.6, -1.6), { kind: "watch", at: [-5.6, -1.6], idles: ["OldIdle"], react: ["HeadTurn"], every: [5, 9], when: [40, 45] });
  crowd(Q, "mb_man", 4, 9.2, 0, { kind: "work", between: [[4, 9.2], [12, 9.6]], walk: "Walk", idle: "IdleM", when: [40, 45] });
  /* the crowd of the eleventh (held at the east end until the camera scene brings them) */
  const KINDS = ["mb_man", "mb_woman", "mb_oldman", "mb_man2", "mb_woman2", "mb_townman"];
  for (let i = 0; i < 20; i++) crowd(Q, KINDS[((i % 4) + 2 * Math.floor(i / 4)) % 6], 15.5 + Math.floor(i / 4) * 1.5, 6.4 + (i % 4) * 1.3, -Math.PI / 2, { kind: "watch", at: [0, 0], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [46, 47], riot: true });
  /* the volunteers on the court-house steps */
  for (let i = 0; i < 4; i++) crowd(Q, i % 2 === 0 ? "mb_vestryman" : "mb_townman", -3 + i * 2.2, -5.6, 0, { kind: "watch", at: [0, 4], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [42, 47], vol: true, uniform: "volunteers", ...(i ? { held: "musket" } : {}) });
  /* chapter 6: soldiers at the temporary court-house, prisoners on its benches */
  crowd(Q, "mb_soldier", 6.2, 6.2, face(6.2, 6.2, 11, 3), { kind: "watch", at: [11, 3], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_soldier", 16.2, 6.4, face(16.2, 6.4, 11, 3), { kind: "watch", at: [11, 3], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_soldier", 13.6, 0.0, Math.PI, { kind: "watch", at: [13, 8], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_vestryman", 11, 0.4, 0, { kind: "watch", at: [11, 6], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_woman", 13.6, 9.2, face(13.6, 9.2, 11, 3), { kind: "watch", at: [11, 3], idles: ["Sad1", "Idle"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_woman2", 14.9, 9.8, face(14.9, 9.8, 11, 3), { kind: "watch", at: [11, 3], idles: ["Sad2", "Idle"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  crowd(Q, "mb_man", -1, 9.0, face(-1, 9, 11, 3), { kind: "watch", at: [11, 3], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10], when: [60, 67], uniform: "soldiers" });
  Q.keepOff = [{ at: [-11.6, 6.0], r: 1.1 }, { at: [16.6, 0.4], r: 1 }, { at: [19, 4.6], r: 1.2 }, { pts: [[-15.2, 9.2], [-11.6, 6.4]], w: 1.2 }];
  return Q;
}

/* The square is laid out after Long (1774) and the plate in his history: King's House fills the west side, the public building with the
   Assembly chamber and, upstairs, the court house and jury room fills the east side facing it, the railed green stands between them, the old
   court-house with a tavern, a lodging-house and a barber's shop make the north side, and the chapel and the guard-house are on the south side
   near King's House. It is built below in its own frame, with the court building along the top of the picture, and then turned a quarter so
   that the court stands on the east (north is -z in this game): TURN() moves every spot, wall and walk into the place's frame. */
const TURN = (x, z) => [-z, x];
function turnPlace(Q) {
  const P = (a) => (Array.isArray(a) && a.length === 2 && typeof a[0] === "number" ? TURN(a[0], a[1]) : a),
    R = (ry) => (ry || 0) - Math.PI / 2,
    keys = ["at", "face", "work"];
  const life = (o) => {
    if (!o) return o;
    for (const k of keys) if (Array.isArray(o[k]) && typeof o[k][0] === "number" && o[k].length === 2 && k !== "work") o[k] = P(o[k]);
    if (o.area) {
      const [x0, z0, x1, z1] = o.area,
        a0 = TURN(x0, z0),
        a1 = TURN(x1, z1);
      o.area = [Math.min(a0[0], a1[0]), Math.min(a0[1], a1[1]), Math.max(a0[0], a1[0]), Math.max(a0[1], a1[1])];
    }
    for (const k of ["pts", "between"]) if (o[k]) o[k] = o[k].map(P);
    return o;
  };
  Q.walls = Q.walls.map(([x0, z0, x1, z1]) => [-z1, x0, -z0, x1]);
  for (const sp of Q.specs) {
    [sp.x, sp.z] = TURN(sp.x, sp.z);
    sp.ry = R(sp.ry);
    life(sp.life);
  }
  for (const am of Q.ambient) {
    [am.x, am.z] = TURN(am.x, am.z);
    am.ry = R(am.ry);
    life(am.behaviour);
    life(am);
  }
  for (const pt of Object.values(Q.points)) [pt.x, pt.z] = TURN(pt.x, pt.z);
  Q.keepOff = Q.keepOff.map((k) => (k.at ? { ...k, at: P(k.at) } : { ...k, pts: k.pts.map(P) }));
  const b = Q.bounds;
  Q.bounds = { x0: -b.z1, z0: b.x0, x1: -b.z0, z1: b.x1 };
  [Q.start.x, Q.start.z] = TURN(Q.start.x, Q.start.z);
  Q.start.yaw = R(Q.start.yaw);
  for (const v of [Q.view.pos, Q.view.look]) [v[0], v[2]] = TURN(v[0], v[2]);
}
function town() {
  const Q = base("town", [-20, -7.6, 20, 26.2], [12, 21, 0.9]);
  Q.ridges = "town";
  const outer = Q.group;
  Q.group = grp();
  Q.group.rotation.y = -Math.PI / 2;
  outer.add(Q.group);
  Q.floor = "stone";
  Q.beds = { crowd: 0.08, wind: 0.02, bird: 0.06 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 480], sun: [0xfff0c8, 2.3, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [15, 2.6, 21], look: [-3, 3.4, -5] };
  ground(Q, std(T.dirt([40, 40], [188, 172, 140])), 500);
  Q.ridges = "town";   /* the hills of St Catherine to the north, from the engine (main.js) */
  /* the public building on the east side (the top of this frame), facing King's House across the square */
  const PB = S.publicBuilding(42);
  add(Q, PB, 0, -5.4);
  wall(Q, 0, -12.6, 42.4, 9.2);
  for (let i = 0; i <= 9; i++) wall(Q, -21 + (i * 42) / 9, -5.4, 0.95, 0.95);
  wall(Q, -22.6, -6.6, 3, 4);
  wall(Q, 22.6, -6.6, 3, 4);
  strip(Q, 46, 2.4, std(T.stone([170, 164, 150], [14, 1]), 1), 0, -3.7, 0.014);
  /* the railed green in the middle of the square: on Long's plate one long straight rail on square white piers between the two buildings, so
     a rectangle (it was drawn as an octagon until 22 November 2026, which no source supports). It sits inside the octagon's old outline, so
     no walk or spot moved. The square itself has no trees */
  add(Q, S.railedGreen(9.2, 13.6), 0, 9.6);
  Q.walls.push([-4.8, 9.6 - 7, 4.8, 9.6 + 7]);
  /* King's House fills the west side (the bottom of this frame): a long brick front, its portico of twelve columns facing the court */
  add(Q, S.kingsHouse(54), 0, 33, 0, Math.PI);
  wall(Q, 0, 38, 54.6, 10.6);
  wall(Q, 0, 30, 12, 6.2);
  /* the north side (the left of this frame): Long's "small building, called the old court-house", then the range with the tavern (an old
     Spanish building), the lodging-house and the barber's shop. The south side (the right): a town house, the street out of the square, the
     guard-house and the chapel near King's House. Behind them, more town. */
  const N = Math.PI / 2,
    So = -Math.PI / 2;
  add(Q, rodneyMemorial(), -27, 10, 0, N);   /* the Rodney Memorial (1783 to 1789) on the north side, where in 1773 the old court-house and the tavern stood */
  add(Q, S.townHouse(11, { rgb: [196, 176, 140], seed: 5 }), 27, -4, 0, So);
  add(Q, S.lowHouse(6, { h: 3.8, d: 6.4, rgb: [160, 98, 76], brickWall: true, door: 1, seed: 6 }), 27, 16.6, 0, So);
  add(Q, S.chapel(12.6), 27, 26.2, 0, So);
  for (const [x, z, w, o, ry] of [
    [-44, 4, 12, { rgb: [200, 184, 150], seed: 6 }, N],
    [-42, 22, 10, { rgb: [190, 172, 140], seed: 10 }, N],
    [46, 30, 12, { rgb: [200, 184, 150], seed: 7 }, So],
    [44, -6, 10, { rgb: [206, 190, 158], seed: 11 }, So],
    [-38, -22, 14, { rgb: [190, 170, 136], seed: 8 }, 0],
    [38, -24, 14, { rgb: [204, 190, 160], seed: 9 }, 0],
  ])
    add(Q, S.townHouse(w, o), x, z, 0, ry);
  wall(Q, -27.5, 12, 3, 46);
  wall(Q, 27.5, -4, 3, 13);
  wall(Q, 27.5, 23.1, 3, 19.4);
  for (const [x, z, h, s] of [[-36, 16, 9, 45], [-34, -10, 8, 46], [37, -3, 9, 47], [40, -14, 8, 48], [-20, 44, 9, 49], [24, 46, 8, 50]]) add(Q, tree(h, s, 1), x, z);
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
  solid1(Q, mule(0x5a4a3c), -16.9, 12.6, 2.0, 0.9, 0.4);   /* the mule faces +x: its footprint is long in x */
  solid1(Q, barrel(), 16.6, 7.4, 0.7, 0.7);
  solid1(Q, barrel(), 16.9, 8.3, 0.7, 0.7);
  solid1(Q, S.groundStall(1), 14.8, 15.4, 1.9, 1.3, -0.4);
  solid1(Q, S.groundStall(2), 6.6, 20.4, 1.9, 1.3, -0.1);
  solid1(Q, crate(0.6), 17.4, 6.2, 0.7, 0.7);
  /* the great door of King's House: a six-panelled double door like the house's own, standing open into a dark hall, and shutting on the
     people from St Thomas (chapter 2). It sits just in front of the model's own door, with the dark of the open doorway behind it. */
  const door = grp();
  plane(1.8, 3.0, W.WM.dark, 0, 2.3, 0.14, door);   /* the hall beyond the open door (in front of the model's own shut door and its knobs) */
  const dleaves = makeDoor({ w: 1.8, h: 3.0, kind: "six", leaves: 2, color: 0x2c3a30, frame: 0xe2d9c2, handle: "knob" });
  dleaves.position.set(0, 0.8, 0.16);
  door.add(dleaves);
  const leaves = dleaves.children.filter((c) => c.isGroup);
  door.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.fixed = true;   /* hung in the doorway */
  });
  add(Q, door, 0, 32.9, 0, Math.PI);   /* the house faces the square (toward -z here) */
  const setDoor = (k) => leaves.forEach((L, i) => (L.rotation.y = (i === 0 ? 1 : -1) * 1.45 * (1 - k)));   /* open (k 0) the leaves stand swung back into the hall; shut (k 1) */
  setDoor(0);
  Q.reveal.door = (seen) => setDoor(span(K(seen), 0.15, 0.75));
  Q.enter = () => setDoor(0);
  /* people */
  person(Q, "father", "father", 3.2, 21.4, face(3.2, 21.4, 0, 27), { kind: "watch", at: [0, 27], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "secretary", "secretary", -2.4, 25.6, face(-2.4, 25.6, 3, 21), { kind: "watch", at: [3, 21], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  for (const [x, z, look] of [[6.8, 18.6, "mb_man"], [5.0, 17.6, "mb_oldman"], [8.4, 17.4, "mb_man2"], [3.4, 17.2, "mb_townman"]]) crowd(Q, look, x, z, face(x, z, 0, 27), { kind: "watch", at: [0, 27], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  crowd(Q, "mb_townman", -9.5, 4.6, 0, { kind: "chat", group: "a", at: [-9.3, 5.3] });
  crowd(Q, "mb_woman", -8.6, 5.5, 0, { kind: "chat", group: "a" });
  crowd(Q, "mb_townman", 15, -1, 0, { kind: "wander", pts: [[15, -1], [8, -1.6], [-9, -1.2], [-15, 0.4]], pause: [2, 5] });
  crowd(Q, "mb_woman", -14.4, 7.6, face(-14.4, 7.6, -16, 9.6), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-16, 9.6] });
  crowd(Q, "mb_soldier", 7.6, 25.4, face(7.6, 25.4, 0, 18), { kind: "watch", at: [0, 18], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  point(Q, "gate", 1.2, 24.4, "the door of King's House");
    Q.keepOff = [{ at: [1.2, 24.4], r: 1.1 }, { pts: [[12, 21], [1.2, 24.4]], w: 1.2 }];
  Q.group = outer;
  turnPlace(Q);
  return Q;
}

const builders = { gut, bay, town };
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
