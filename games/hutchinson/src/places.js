/* The five places of the story. Each is a compressed picture of a real kind of place; what is modelled on a source and what is a general
   picture is in docs/games/hutchinson.md ("Places").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, for the castle, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/hutchinson/people). */
import * as THREE from "three";
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng, batchStatic } from "./gfx.js";
import { tree, palm, bush, mule, cart, barrel, scatter, surveyPole, sack, crate, marketBasket } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import * as S from "./scenery.js";
import { TASKS } from "./steps.js";
import { flock as roostFlock, fireflies } from "../../../engine/life.js";   /* birds going to roost, fireflies over the grass at dusk */

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
/* the dry limestone country of the middle of St Ann, after Long (1774): "open, level savannahs, environed by rocky eminences, or with little
   cock-pits". A far ring of hills, and near and middle rings of steep, round, tree-covered cockpit hills with pale limestone showing.
   gaps: directions (radians, atan2(z, x)) kept open, such as the road running out of the place, or the castle seen far off. */
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
        tone = [0.25 + r() * 0.05, 0.34 + r() * 0.05, 0.18 + r() * 0.03];
      add(Q, S.cockpitHill(rad, h0 + r() * (h1 - h0), seed * 50 + i + R, { tone, bare: 0.24 + r() * 0.16 }), Math.cos(a) * d, Math.sin(a) * d, -0.6);
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

/* ---------- 1. The road by Dr Hutton's pen, a dry afternoon in 1772 ---------- */
function road() {
  const Q = base("road", [-18, -12, 18, 12], [13, 6.2, Math.PI / 2]);
  Q.floor = "sand";
  Q.beds = { wind: 0.05, bird: 0.14 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 520], sun: [0xfff0c8, 2.5, -30, 60, 24], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [15, 2.4, 11], look: [-2, 1.2, 1] };
  ground(Q, std(T.grass([60, 60], DRY)), 700);
  strip(Q, 4.2, 150, std(T.dirt([1, 40], DUST)), 0, 6).rotation.z = Math.PI / 2;   /* turned so the texture's wheel ruts run along the road */
  for (const z of [5.1, 6.9]) strip(Q, 150, 0.34, std(T.dirt([60, 1], [160, 142, 108])), 0, z, 0.016);   /* cart ruts */
  hills(Q, 3, true, [0, Math.PI, Math.atan2(-60, -150)]);
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
  /* a hand comes down with the stick and pushes it into the cracked mud: it goes in a hand deep, then a puff of dry dust */
  const dust = add(Q, S.smoke(3, { rise: 0.5, spread: 0.3, size: 0.35, tint: 0xb9ab8a }), -8.2, -6.6, 0.02);
  dust.visible = false;
  dust.traverse((o) => (o.userData.noAudit = true));   /* smoke puffs: a see-through glow, nothing to rest */
  Q.tickers.push((t) => dust.visible && dust.userData.tick(t));
  Q.reveal.pond = (seen) => {
    const k = K(seen);
    stick.visible = k > 0;
    stick.position.y = 0.42 + 0.55 * (1 - span(k, 0, 0.55)) - 0.06 * span(k, 0.6, 0.95);
    stick.rotation.z = 0.2 + 0.08 * (1 - span(k, 0, 0.55));
    dust.visible = k > 0.5 && k < 1;
  };
  /* the pasture: Guinea grass gone gold, a rail fence, the cattle beyond it and a rack to feed them at */
  for (const [x0, x1] of [[-18.5, -2.4], [0.4, 18.5]]) {
    add(Q, S.postRail(x1 - x0, 1.2), (x0 + x1) / 2, -12.4);
    wall(Q, (x0 + x1) / 2, -12.4, x1 - x0, 0.3);
  }
  const pg = S.postRail(2.6, 1.2);
  add(Q, pg, -1, -12.4);
  wall(Q, -1, -12.4, 2.8, 0.3);
  solid1(Q, S.feedRack(2.6), 5, -11.5, 2.8, 0.9);
  const herd = [[4.2, -13.6, 1.3, 0, "stand"], [6.4, -14.2, 2.2, 3, "stand"], [9.5, -16, 0.4, 1, "graze"], [14, -15, -2.4, 2, "graze"], [1.5, -18.5, 2.9, 4, "graze"], [11, -21, 1.0, 5, "lie"], [17, -22, -0.8, 0, "graze"], [-8, -17, 0.6, 2, "graze"], [-14, -21, 2.5, 3, "stand"], [-11.6, -22.2, -1.2, 1, "lie"], [20, -30, 2.0, 4, "graze"]];
  herd.forEach(([x, z, ry, c, pose], i) => add(Q, S.cow(S.COATS[c], pose, i + 1), x, z, 0, ry));
  /* the pound: a square of dry-laid limestone where the cattle are penned at night and for counting */
  add(Q, S.stonePound(7, 6, 1.3, 6), -13, -20.5);
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
  /* a blanket rolled tight and strapped across the saddle */
  const roll = cyl(0.1, 0.1, 0.62, solid(0x7a6a52, 1), 0, 0.28, 0, pack, 16);
  roll.rotation.z = Math.PI / 2;
  for (const x of [-0.2, 0.2]) {
    const st = mesh(new THREE.TorusGeometry(0.104, 0.008, 4, 16), solid(0x3a2a1c, 0.8), x, 0.28, 0, pack);
    st.rotation.y = Math.PI / 2;
  }
  const flap = box(0.37, 0.05, 0.6, solid(0x7a5a3c, 1), 0.3, 0.18, 0, pack);   /* the bag's flap: lifted when you look inside */
  flap.userData.noBatch = true;
  /* what is in the bag: a tin cup and a shirt folded small, seen as the flap comes up */
  const inside = grp(pack, 0.3, 0.12, 0);
  add({ group: inside }, P.tinCup(), 0, 0.14, 0);
  const shirt = box(0.2, 0.05, 0.16, solid(0xd8d0bc, 1), 0, 0.025, -0.08, inside);   /* a linen shirt folded small, its collar on top */
  box(0.12, 0.012, 0.03, solid(0xc8c0ac, 1), 0, 0.055, -0.13, inside);
  shirt.userData.noBatch = true;
  inside.visible = false;
  stray.traverse((o) => (o.userData.noBatch = true));
  solid1(Q, stray, -7, 3.6, 2.0, 0.9, Math.PI / 2);
  Q.reveal.packmule = (seen) => {
    const u = span(K(seen), 0.05, 0.6);
    flap.rotation.z = 1.1 * u;
    flap.position.y = mix(0.18, 0.36, u);
    flap.position.x = mix(0.3, 0.52, u);
    inside.visible = u > 0.3;
    inside.position.y = mix(0.06, 0.16, span(K(seen), 0.4, 0.9));
  };
  /* the opening camera scene: the pack mule comes down the road from the castle alone, and stops by the wall where Sampson will tie it */
  const MULEWAY = [[-46, 5.8], [-11, 5.8], [-8.6, 3.7], [-7, 3.6]];
  Q.films.opening = (t) => {
    const k = t < 0 ? 1 : (t - 14) / 18,
      p = along(MULEWAY, k),
      step = k > 0 && k < 1 ? Math.sin(t * 9) : 0;
    stray.position.set(p[0], Math.abs(step) * 0.02, p[1]);
    stray.rotation.y = k >= 1 ? Math.PI / 2 : p[2];
    stray.rotation.x = step * 0.015;
    stray.visible = k >= 0;   /* round the far bend, out of sight, until it comes */
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
  const DUSK = { top: 0x2c3a5c, hor: 0xd9895a, stars: 0.25, moon: 0, fog: [0x8a6f6a, 40, 300], sun: [0xff9a5a, 1.15, -60, 14, 30], hemi: [0xc9b6c8, 0x5a4a40, 1.75], fill: 2.4, haze: 0x9a7a78, glow: 0.62 },
    LATE = { top: 0x1c2644, hor: 0xa85e4a, stars: 0.6, moon: 0, fog: [0x5c4c58, 34, 260], sun: [0xe07a4a, 0.7, -70, 8, 30], hemi: [0xa9a0c0, 0x4a3e3c, 1.55], fill: 2.8, haze: 0x5e5068, glow: 0.4 },
    DAYL = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 80, 480], sun: [0xfff0d0, 2.2, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.4] };
  Q.light = DUSK;
  Q.view = { pos: [15, 2.2, 14], look: [0, 3.6, -9] };
  const grass = std(T.grass([60, 60], [136, 128, 88]));
  ground(Q, grass, 700);
  strip(Q, 3.8, 150, std(T.dirt([1, 40], DUST)), 0, 12.4).rotation.z = Math.PI / 2;
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
  /* small life at dusk: crows wheel over the house before they roost, and fireflies come up out of the grass along the road (by day they
     do not show) */
  const birds = roostFlock(Q.group, { n: 9, at: [0, -16], h: 16, r: 15, color: 0x15110e, size: 0.45, seed: 4 });
  const flies = fireflies(Q.group, { n: 70, area: [-22, 2, 22, 15], y: [0.25, 1.4], size: 0.22, seed: 9, on: () => !!Q.light.stars });
  /* the lamp behind the loophole throws a warm haze on the wall round it, flickering */
  const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), color: 0xffa050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 }));
  haze.scale.set(1.6, 1.6, 1);
  haze.position.set(0.4, MOUND.h + 1.5, -13 + 3.5 + 0.5);   /* at the lit loophole (glowWin, below) */
  haze.userData.noBatch = true;
  Q.group.add(haze);
  Q.tickers.push((t) => {
    birds(t);
    flies(t);
    haze.visible = glowWin.visible;
    haze.material.opacity = 0.42 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1) * 0.04;
  });
  const glowWin = box(0.24, 0.24, 0.04, new THREE.MeshBasicMaterial({ color: 0xffb65a }), 0.4, MOUND.h + 1.5, -13 + 3.5 + 0.38, Q.group);
  glowWin.userData.noBatch = true;
  glowWin.userData.noAudit = true;   /* a lamp glow behind a loophole: light, not a thing */
  glowWin.visible = false;
  /* the well, in open ground west of the track (the well is this story's own: see the journal) */
  const well = W.well();
  solid1(Q, well, -13.5, 0.4, 2.4, 2.2);
  Q.props.well = well;
  const wb = grp(Q.group, -13.3, -1.2, 0.4);   /* the well's own bucket on its rope: down, or wound up dripping */
  cyl(0.012, 0.012, 0.85, W.WM.rope, 0, 1.15, 0, wb, 5);
  add({ group: wb }, P.woodBucket(), 0, 0, 0.32);   /* staves, hoops, a bail, water inside */
  wb.traverse((o) => {
    o.userData.noBatch = true;
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
  /* it hears you, turns, and walks over to the wall, nodding as it comes */
  Q.reveal.jackass = (seen) => {
    const k = K(seen),
      turn = span(k, 0, 0.35),
      walk = span(k, 0.25, 1);
    jack.position.set(mix(15.6, 17.2, walk), Math.abs(Math.sin(walk * Math.PI * 5)) * 0.025 * (k < 1 ? 1 : 0), mix(2.0, 5.0, walk));
    jack.rotation.y = mix(-0.6, Math.PI, turn);
    jack.rotation.x = Math.sin(walk * Math.PI * 5) * 0.03 * (k < 1 ? 1 : 0);
  };
  /* a riding hat between the roots of the cotton tree: you find it, and hang it where it can be seen */
  const hat = add(Q, P.feltHat(), 0.1, 5.5, 0.025);
  hat.rotation.z = 0.14;
  hat.traverse((o) => {
    o.userData.noBatch = true;
  });
  /* a broken branch stub on the trunk, at head height, on the side that faces the road: where you hang the hat. The trunk is about 0.9 m
     across here (scenery.js cottonTree); the stub runs out of the bark into the hat's crown, as a hat hangs on a peg. */
  const TX = -0.8,
    TZ = 4.2,
    hd = new THREE.Vector3(0.447, 0, 0.894),
    stub = cyl(0.03, 0.045, 0.46, solid(0x7c7466, 1), TX + hd.x * 1.03, 1.5, TZ + hd.z * 1.03, Q.group, 6);
  stub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hd);
  const hatUp = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), hd),
    hatDown = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.14)),
    hatFrom = new THREE.Vector3(0.1, 0.025, 5.5),
    hatTo = new THREE.Vector3(TX + hd.x * 1.17, 1.45, TZ + hd.z * 1.17);   /* the crown's inside rests on the stub */
  /* lifted out of the roots, turned over in the hand, and hung on the stub, its crown over the end */
  Q.reveal.hat = (seen) => {
    const u = span(K(seen), 0.05, 0.85);
    hat.position.lerpVectors(hatFrom, hatTo, u);
    hat.position.y += Math.sin(u * Math.PI) * 0.3;
    hat.quaternion.slerpQuaternions(hatDown, hatUp, u);
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
  const c = cart(2.6, 1.4),
    casks = [];
  for (const [x, z] of [[-0.6, -0.3], [-0.6, 0.35], [0.2, 0.3]]) {
    const b = S.cask();
    b.position.set(x, 0.76, z);
    c.add(b);
    casks.push(b);
  }
  /* the search scene: John Callendar carried home on the cart, a long shape under a sheet, seen only from the road (the game's picture) */
  const covered = grp(c, 0, 0.72, 0);
  const sheetShape = cyl(0.23, 0.2, 1.5, W.WM.linen, 0.05, 0.11, 0, covered, 10);
  sheetShape.rotation.z = Math.PI / 2;
  sheetShape.scale.set(0.5, 1, 1);
  mesh(new THREE.SphereGeometry(0.15, 10, 8), W.WM.linen, -0.78, 0.12, 0, covered).scale.set(1, 0.7, 1);   /* the head end */
  for (const z of [-0.09, 0.09]) mesh(new THREE.SphereGeometry(0.07, 8, 6), W.WM.linen, 0.84, 0.13, z, covered);   /* the feet */
  box(1.95, 0.02, 0.62, W.WM.linen, 0, 0.012, 0, covered);   /* the sheet's edge, lying on the cart bed */
  const stain = mesh(new THREE.CircleGeometry(0.06, 9), solid(0x5e3a2c, 1), -0.35, 0.235, 0.04, covered);
  stain.rotation.x = -Math.PI / 2;   /* one small stain on the cloth, as the Mature 13+ line allows */
  covered.visible = false;
  c.traverse((o) => (o.userData.noBatch = true));
  const cartMule = mule(0x6a5644);
  cartMule.traverse((o) => (o.userData.noBatch = true));
  solid1(Q, c, 12.4, 13.6, 3.0, 1.9);
  solid1(Q, cartMule, 17.1, 13.6, 2.0, 0.8, Math.PI / 2);
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
  point(Q, "tumbled", -5.8, 3.4, "the tumbled wall");
  /* birds in the cotton tree: they go up at the shot (the camera scene) */
  const flock = add(Q, S.birds(18, 4), -0.8, 4.2, 9);
  /* a hat on the track: all that the camera shows afterwards */
  const fallen = add(Q, P.feltHat(0x2c2622, 0x161210), 3.2, 1.7, 0.03);
  fallen.rotation.z = 0.2;
  fallen.traverse((o) => {
    o.userData.noBatch = true;
  });
  fallen.visible = false;
  /* people. Juba draws water at dusk; in the morning John Callendar stands at the long wall with Sampson. */
  person(Q, "juba", "juba", -14.8, 2.3, face(-14.8, 2.3, -13.5, 0.4), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-13.5, 0.4] });
  person(Q, "carter", "carter", 13.2, 12.4, face(13.2, 12.4, 15, 11.4), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "callendar", "callendar", 9.8, 11.6, face(9.8, 11.6, 0, -5), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 8] });
  person(Q, "sick", "sick", 7.2, 11.4, 0, { kind: "watch", at: [0, 12], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  /* the search scene (chapter 4's end): the captain who comes up the road, and Hector, who goes down to meet him */
  person(Q, "officer", "officer", 20.6, 12.4, face(20.6, 12.4, 0, -9), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "hector", "hector", 1.0, 8.6, face(1.0, 8.6, 20, 12), { kind: "watch", at: [20, 12], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11] });
  /* the step decides the hour: dusk for the walk to the well, later dusk for the way back, morning for the neighbour */
  Q.enter = (stage) => {
    const day = stage >= 40,
      late = !day && stage >= 37;
    Q.light = day ? DAYL : late ? LATE : DUSK;
    Q.beds = day ? { wind: 0.05, bird: 0.12 } : { wind: 0.07, owl: late ? 0.8 : 0.5 };
    glowWin.visible = !day;
    show(0);
    flock.userData.burst(0);
    fallen.visible = false;
    C.userData.eastDoor.userData.swing(0);
    cartBack();
    covered.visible = false;
    for (const b of casks) b.visible = true;
  };
  /* the windlass creaks round and the bucket comes up out of the dark, heavy and dripping */
  Q.reveal.draw = (seen) => {
    const k = K(seen),
      u = span(k, 0.05, 0.85);
    wb.position.y = mix(-1.2, 0.62, u);
    well.userData.turn?.(u * Math.PI * 6);
    const pail = Q.items.pail;
    if (pail && pail.parent === Q.group && Math.abs(pail.position.x + 13.5) < 0.1) pail.visible = k >= 0.9;   /* Juba fills your pail once the bucket is up */
  };
  /* the morning of the neighbour, as a camera scene: Callendar walks up the track and calls; the window opens; at the shot the camera
     turns to the birds going up; then a hat on the track, and a sick man slipping out by the east door to tell */
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
  /* the first sight of the house, as a camera scene: from Sampson's cart coming up the road at dusk. The place does nothing of its own:
     Juba works at the well, the chimney smokes and the lamp shows behind a loophole, as at any dusk; the shutter stays shut. */
  Q.films.towers = (t) => {
    if (t < 0) show(0);
  };
  /* the morning after, as a camera scene: Sampson's cart takes John Callendar home under a sheet and goes away east; then, days later, the
     captain comes up the road, Hector goes down to meet him, and the east door stands open on an empty house */
  const CART0 = [12.4, 13.6],
    MULE0 = [17.1, 13.6];
  function cartBack(dx = 0, on = true, hitched = false) {
    c.position.set(CART0[0] + dx, 0, CART0[1]);
    cartMule.position.set((hitched ? CART0[0] + 2.7 : MULE0[0]) + dx, 0, MULE0[1]);   /* in the shafts while it pulls */
    c.visible = cartMule.visible = on;
  }
  let searchHome = null;
  const OFF = [[15, 12.8], [10, 12.4], [3.5, 11.9], [3.4, -0.6]],
    HEC = [[1.0, 8.6], [2.4, 10.8]],
    HEC2 = [[2.4, 10.8], [2.3, -0.4]],
    SAM = [[13.2, 12.4], [16.4, 12.8]];
  Q.films.search = (t, Q) => {
    const by = (id) => Q.people.find((n) => n.id === id),
      sam = by("carter"),
      off = by("officer"),
      hec = by("hector");
    if (!sam || !off || !hec) return;
    const list = [sam, off, hec];
    if (t < 0) {
      if (searchHome)
        list.forEach((n, i) => {
          const h = searchHome[i];
          n.x = h[0];
          n.z = h[1];
          n.m.position.set(n.x, 0, n.z);
          n.m.rotation.y = h[2];
          n.m.visible = h[3];
          n.walking = undefined;
          n.ctl.rest();
        });
      searchHome = null;
      covered.visible = false;
      for (const b of casks) b.visible = true;
      cartBack();
      C.userData.eastDoor.userData.swing(0);
      return;
    }
    if (!searchHome) searchHome = list.map((n) => [n.x, n.z, n.m.rotation.y, n.m.visible]);
    const put = (n, p, y = 0) => {
      n.x = p[0];
      n.z = p[1];
      n.m.position.set(p[0], y, p[1]);
      n.m.rotation.y = p[2];
    };
    /* part one: the cart. Sampson goes to the mule's head at 8 s and leads it away east at a walk (1.3 m/s) from 11 s */
    for (const b of casks) b.visible = false;
    covered.visible = true;
    const roll = Math.max(0, t - 11) * 1.3;
    cartBack(roll, t < 22.4, true);
    if (t < 11) {
      const k = (t - 8) / 3,
        p = along(SAM, k);
      put(sam, k >= 1 ? [p[0], p[1], Math.PI / 2] : p);
      walkOn(sam, k > 0 && k < 1);
    } else {
      put(sam, [SAM[1][0] + roll, SAM[1][1], Math.PI / 2]);
      walkOn(sam, true);
    }
    sam.m.visible = t < 22.4;
    /* part two, days later: the captain up the road and the track; Hector down to meet him, then up beside him */
    const ko = (t - 22.6) / 15,   /* about 1.6 m/s, a steady walk */
      po = along(OFF, ko);
    put(off, ko >= 1 ? [po[0], po[1], Math.PI] : po, moundY(po[0], po[1]));
    off.m.visible = t >= 22.4;
    walkOn(off, ko > 0 && ko < 1);
    /* Hector: down to the foot of the track to meet him (26.5 to 30 s), then up beside him to the steps (30 to 37.6 s) */
    const kh = (t - 26.5) / 3.5,
      kh2 = (t - 30) / 7.6,
      ph = kh2 > 0 ? along(HEC2, kh2) : along(HEC, kh);
    put(hec, kh2 >= 1 ? [ph[0], ph[1], Math.PI] : kh <= 0 ? [ph[0], ph[1], face(1.0, 8.6, 20, 12)] : kh >= 1 && kh2 <= 0 ? [ph[0], ph[1], face(2.4, 10.8, 10, 12.4)] : ph, moundY(ph[0], ph[1]));
    hec.m.visible = t >= 22.4;
    walkOn(hec, (kh > 0 && kh < 1) || (kh2 > 0 && kh2 < 1));
    C.userData.eastDoor.userData.swing(t >= 31 ? 1 : 0);   /* found standing open */
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
    box(0.3, 0.3, 0.05, sky, 0, 0, 0.005, g);
    return g;
  };
  loop(-2.6, 1.6, -3.43, 0);
  loop(0.6, 1.6, -3.43, 0);
  loop(-5.23, 1.6, -0.9, Math.PI / 2);
  loop(5.23, 1.6, -1.2, -Math.PI / 2);
  /* the loophole over the road has a board across it until you take the board down */
  loop(-1.2, 1.6, 3.43, Math.PI);
  const board = box(0.5, 0.5, 0.04, W.WM.wood, -1.2, 1.6, 3.39, Q.group);
  board.userData.fixed = true;   /* nailed across the loophole, then leaned on the wall below it */
  board.userData.noBatch = true;
  const beam = mesh(new THREE.PlaneGeometry(0.34, 3.2), new THREE.MeshBasicMaterial({ color: 0xfff2cc, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }), -1.2, 0.84, 2.2, Q.group);
  beam.rotation.x = -1.0;
  beam.userData.noBatch = true;
  beam.userData.noAudit = true;   /* a shaft of light, not a thing */
  /* the board comes away from the hole and is leaned on the wall below; the daylight falls in through the loophole */
  beam.material.opacity = 0;
  Q.reveal.loophole = (seen) => {
    const k = K(seen),
      off = span(k, 0.05, 0.35),
      down = span(k, 0.3, 0.75);
    board.position.set(mix(-1.2, -0.5, down), mix(1.6, 0.26, down), mix(3.39, 3.36, down) - off * 0.14 * (1 - down));
    board.rotation.z = 0.3 * down;
    beam.visible = k > 0.3;
    beam.material.opacity = 0.16 * span(k, 0.3, 0.8);
  };
  /* the two doors, shut: the front one beside the front tower, the east one to the yard (Cundall) */
  add(Q, W.makeDoor({ w: 1.1, h: 2.1, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "ring" }), 2.6, 3.44, 0, Math.PI);
  add(Q, W.makeDoor({ w: 1.0, h: 2.0, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "latch" }), 5.24, 0.4, 0, -Math.PI / 2);
  /* the hearth in the wall of the front tower, across the south-east corner, with a low fire the searchers lit */
  add(Q, S.cornerHearth(2.78), 4.1, 2.3, 0, (-3 * Math.PI) / 4);
  wall(Q, 4.4, 2.6, 2.4, 2.4);
  const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  fl.scale.set(0.5, 0.5, 1);
  fl.position.set(3.75, 0.5, 1.95);
  fl.userData.noBatch = true;
  fl.userData.noAudit = true;   /* a flame sprite */
  Q.group.add(fl);
  Q.tickers.push((t) => fl.scale.set(0.46 + Math.sin(t * 9) * 0.05, 0.5 + Math.sin(t * 13) * 0.08, 1));
  /* the foot of the spiral steps in the back tower, across the north-west corner */
  add(Q, S.spiralFoot(2.78), -4.04, -2.24, 0, Math.PI / 4);
  wall(Q, -4.6, -2.8, 2.0, 2.0);
  /* the long table, with a candle, the searchers' list and the strongbox */
  solid1(Q, P.table(2.6, 1.0, 0.78), -0.6, -1.5, 2.7, 1.1);
  const cd = add(Q, W.candle(true), 0.4, -1.7, 0.81);
  add(Q, S.writing(), -0.2, -1.3, 0.81, 0.2);
  const box1 = W.chest(0.7, 0.4, 0.36, 0.88);   /* packed: the watches lie on a dark cloth */
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
  /* the lid swings up; the watches catch the candle light one after another */
  const glints = [];
  for (const [x, z] of [[-0.18, -0.06], [0.05, 0.08], [0.2, -0.1], [-0.05, 0.12], [0.14, 0.02]]) {
    const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xfff0c0, opacity: 0 }));
    g.scale.setScalar(0.07);
    g.position.set(x, 0.05, z);
    g.userData.noAudit = true;   /* a glint of light */
    watches.add(g);
    glints.push(g);
  }
  Q.reveal.watches = (seen) => {
    const k = K(seen);
    box1.userData.open(span(k, 0.05, 0.5));
    watches.visible = k > 0.15;
    glints.forEach((g, i) => (g.material.opacity = k < 1 ? Math.max(0, Math.sin((k - 0.45 - i * 0.09) * Math.PI * 4)) * 0.9 : 0));
  };
  for (const [x, z, ry] of [[-1.4, -2.45, 0], [0.2, -2.45, 0.2]]) add(Q, W.chair(), x, z, 0, ry);
  wall(Q, -0.6, -2.45, 2.4, 0.5);
  /* the west wall: coats on pegs, far too many for one man; a cloth hangs over them until you draw it back */
  const coats = [0x5a3a2a, 0x2f3a4a, 0x6a5a3a, 0x3a2a2a, 0x4a5a3a, 0x7a2f2a];
  coats.forEach((c, i) => add(Q, W.hungCoat(c), -5.22, -0.9 + i * 0.8, 0, Math.PI / 2));
  const sheet = box(0.05, 1.7, 4.4, W.WM.linen, -4.96, 1.05, 1.1, Q.group);   /* clear of the coats' fronts */
  sheet.userData.noBatch = true;
  box(0.05, 0.05, 4.5, W.WM.woodDark, -4.96, 1.93, 1.15, Q.group);   /* stops short of the spiral steps' wall */
  for (const z of [-1.05, 3.35]) box(0.22, 0.05, 0.05, W.WM.woodDark, -5.11, 1.93, z, Q.group);   /* the rail's brackets into the wall */
  /* the cloth is drawn along its rail, and the coats come into view one by one */
  Q.reveal.coats = (seen) => {
    const u = span(K(seen), 0.05, 0.9);
    sheet.scale.z = mix(1, 0.1, u);
    sheet.position.z = mix(1.1, 3.1, u);
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
  /* a tin cup knocked to the floor by the cot: you set it back where a sick man could reach it */
  const cup = add(Q, P.tinCup(), 4.3, -2.7, 0.04);   /* lying on its side, its open mouth toward the room */
  cup.rotation.z = Math.PI / 2;
  cup.traverse((o) => (o.userData.noBatch = true));
  /* the tin cup is picked up off the floor and set back on the cot, where a sick man could reach it */
  Q.reveal.cot = (seen) => {
    const u = span(K(seen), 0.1, 0.85);
    cup.position.set(mix(4.3, 3.5, u), mix(0.04, 0.535, u) + Math.sin(u * Math.PI) * 0.3, mix(-2.7, -2.75, u));
    cup.rotation.z = mix(Math.PI / 2, 0, span(u, 0, 0.5));
  };
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
  Q.group.add(lan);
  cyl(0.006, 0.006, 0.34, W.WM.iron, 1.0, 2.72, 0.4, Q.group, 4);
  /* people: the captain at the table, his men at work; Juba and Cudjoe wait by the door; Hector stands apart */
  person(Q, "officer", "officer", 0.9, -0.4, face(0.9, -0.4, -1.2, -1.5), { kind: "watch", at: [-1.2, -1.5], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "juba", "juba", 0.6, 2.2, face(0.6, 2.2, 0, 0), { kind: "watch", at: [0, 0], idles: ["Idle"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cudjoe", "cudjoe", 1.8, 1.9, face(1.8, 1.9, 0, 0), { kind: "watch", at: [0, 0], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [6, 10] });
  person(Q, "hector", "hector", -3.8, -0.6, face(-3.8, -0.6, -1.2, -1.5), { kind: "watch", at: [-1.2, -1.5], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11] });
  crowd(Q, "hx_townman", -2.8, -2.0, face(-2.8, -2.0, -1.2, -1.5), { kind: "work", clips: ["IdleM", "Nod", "HeadTurn"], work: [4, 8], face: [-1.2, -1.5] });
  crowd(Q, "hx_townman", 4.6, -1.0, face(4.6, -1.0, 5.2, -2.3), { kind: "work", clips: ["IdleM", "HeadTurn", "PickUp"], work: [5, 9], face: [5.2, -2.3] });
  Q.props.candle = cd;
  Q.keepOff = [{ at: [-1.2, -0.4], r: 0.9 }, { at: [-4.2, 1.0], r: 0.9 }, { at: [-1.2, 2.6], r: 0.9 }, { at: [2.9, 0.2], r: 0.8 }, { at: [3.0, -1.9], r: 0.8 }];
  return Q;
}

/* ---------- 4. The sinkhole: a small valley ringed by rock, the mouth at its foot ---------- */
function hole() {
  const Q = base("hole", [-11, -3.8, 11, 13], [7.5, 11, Math.PI / 5]);
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
    Q.group.add(tr);
    if (i % 2) {
      /* vines and roots hanging down the rock */
      const v = box(0.1, 3 + (i % 3), 0.06, flat(0x3e5a34), Math.cos(a) * 18.2, top[1] - 2.6, 2 + Math.sin(a) * 18.2, Q.group);
      v.rotation.y = -a;
    }
  }
  /* the rock is not bare: ferns and moss on its ledges and along its foot, and roots hanging down the face from the trees on top */
  {
    const fr = rng(41),
      onFace = (a, t, out = 0.12) => {
        const p = ring.userData.face(a, t),
          d = Math.hypot(p[0], p[2]) || 1;
        return [p[0] * (1 + out / d), p[1], p[2] * (1 + out / d) + 2];
      };
    for (let i = 0; i < 150; i++) {
      const a = fr() * Math.PI * 2;
      if (a > 0.3 && a < 1.6) continue;   /* not where the rock is low by the way in */
      const foot = i < 45,
        t = foot ? 0.02 : 0.1 + fr() * 0.8,
        p = onFace(a, t, foot ? -0.5 : 0.3),
        kind = i % 4,
        o = kind === 3 ? S.moss(0.7 + fr() * 0.8, i) : S.fern(1.5 + fr() * 1.1, i);
      add(Q, o, p[0], p[2], p[1] - (kind === 3 ? 0.08 : 0.05), fr() * 6);
      if (kind === 1) add(Q, S.fern(0.9 + fr() * 0.5, i + 500), p[0] + (fr() - 0.5) * 0.9, p[2] + (fr() - 0.5) * 0.9, p[1] - 0.1, fr() * 6);   /* ferns grow in clumps */
    }
    for (let i = 0; i < 24; i++) {
      const a = fr() * Math.PI * 2;
      if (a > 0.3 && a < 1.6) continue;
      /* a root down the face: a thin strand from near the rim to partway down, lying on the rock */
      const t0 = 0.97,
        t1 = 0.45 + fr() * 0.35,
        A = new THREE.Vector3(...onFace(a, t0, 0.04)),
        B = new THREE.Vector3(...onFace(a + (fr() - 0.5) * 0.02, t1, 0.04)),
        len = A.distanceTo(B),
        root = cyl(0.025, 0.055, len, solid(0x5a4632, 1), (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2, Q.group, 5);
      root.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize().negate());
    }
  }
  for (const [x, z, r, h, s] of [[-40, -30, 26, 22, 1], [34, -36, 30, 26, 2], [0, -60, 40, 30, 3], [-50, 30, 30, 24, 4], [48, 20, 28, 22, 5], [10, 60, 36, 24, 6]]) add(Q, S.cockpitHill(r * 0.8, h, 20 + s, { tone: [0.26, 0.37, 0.21] }), x, z, -0.6);
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
  add(Q, S.patch(6.4, 4.6, std(S.cragTex([2, 2]), 1), 9, 0.012, [RX * 1.02, RZ * 1.02, 0, -0.4]), MX, MZ + 0.4);
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
  });
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
  /* the lantern goes down the shaft on its rope, hand over hand, until it is a small point of light; then the rope runs out */
  Q.reveal.rope = (seen) => {
    const k = K(seen);
    setDrop(k * k * (3 - 2 * k));
  };
  /* loose stones by the path: one to drop */
  solid1(Q, W.rocks(0.5, 31, 4), 5.2, 8.6, 0.9, 0.8);
  point(Q, "edge", 0, -3.0, "the edge");
  person(Q, "cudjoe", "cudjoe", -2.6, -1.7, face(-2.6, -1.7, MX, MZ), { kind: "watch", at: [MX, MZ], idles: ["OldIdle"], react: ["HeadTurn"], every: [8, 12], stay: true });
  person(Q, "officer", "officer", 5.6, -0.6, face(5.6, -0.6, MX, MZ), { kind: "watch", at: [MX, MZ], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11], stay: true });
  person(Q, "hector", "hector", -1.5, -3.0, face(-1.5, -3.0, MX, MZ), { kind: "work", clips: ["Point", "IdleM", "IdleM"], work: [5, 8], face: [MX, MZ], stay: true });
  crowd(Q, "hx_townman", 2.6, -2.2, face(2.6, -2.2, 1.6, -4.4), { kind: "work", clips: ["IdleM", "PickUp", "HeadTurn"], work: [5, 9], face: [1.6, -4.6], stay: true });
  crowd(Q, "hx_penman", 4.6, -3.0, face(4.6, -3.0, 3.6, -2.4), { kind: "watch", at: [MX, MZ], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9], stay: true });
  Q.keepOff = [{ at: [0, -3.0], r: 1.1 }, { at: [5.2, 7.4], r: 1 }, { at: [1.2, -2.8], r: 0.9 }, { pts: [[7.5, 11], [0, -3]], w: 1.2 }];
  return Q;
}

/* ---------- 5. Spanish Town, the capital, March 1773: the square as Bonnor drew it for Edward Long (1774) ---------- */
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
  const Q = base("town", [-20, -7.6, 20, 23], [12, 21, 0.9]);
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
  /* the long gallery over the arcade: its jalousies stand shut until you listen under them */
  const jal = [],
    jx = [-4.667, 0, 4.667];
  for (const x of jx) {
    const j = box(1.2, 2.3, 0.05, S.SM.green, x, 6.35, -5.4 - 2.5, Q.group);
    j.userData.noBatch = true;
    j.userData.fixed = true;   /* hung on the gallery front */
    jal.push(j);
  }
  /* the jalousies fold back one after another along the gallery, and the voices come down */
  Q.reveal.gallery = (seen) =>
    jal.forEach((j, i) => {
      const u = span(K(seen), 0.1 + i * 0.22, 0.45 + i * 0.22);
      j.scale.x = mix(1, 0.16, u);
      j.position.x = jx[i] + 0.52 * u;
    });
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
  add(Q, S.lowHouse(8.6, { h: 4.8, d: 8, rgb: [164, 96, 74], brickWall: true, door: 1, seed: 1 }), -27, -2.4, 0, N);
  add(Q, S.lowHouse(8.4, { h: 4.0, d: 7.4, rgb: [226, 216, 190], door: 1, seed: 2, piazza: true }), -27, 6.1, 0, N);
  add(Q, S.townHouse(9, { rgb: [210, 196, 166], piazza: true, seed: 3 }), -27, 14.8, 0, N);
  add(Q, S.lowHouse(6.4, { h: 3.8, d: 6.6, rgb: [214, 200, 170], door: 1, seed: 4 }), -27, 22.5, 0, N);
  for (const [z, text, w, y] of [[6.1, "TAVERN", 2.0, 3.0], [14.8, "LODGINGS", 2.2, 2.7], [22.5, "BARBER", 1.8, 3.0]]) {
    /* the boards hang on the wall over the doors; their exact words are a general picture */
    const sg = S.wallSign(text, w, 0.46);
    add(Q, sg, -27 + 0.02, z, y, N);
  }
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
  solid1(Q, mule(0x5a4a3c), -16.9, 12.6, 0.9, 2.0, 0.4);
  solid1(Q, barrel(), 16.6, 7.4, 0.7, 0.7);
  solid1(Q, barrel(), 16.9, 8.3, 0.7, 0.7);
  solid1(Q, S.groundStall(1), 14.8, 15.4, 1.9, 1.3, -0.4);
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
  });
  gal.visible = false;
  add(Q, gal, 56, 9, 0, -1.3);
  const fc = add(Q, S.farCrowd(34, 9, 3), 48, 9, 0, Math.PI / 2);
  fc.visible = false;
  /* at dawn the street out of the square is full too: people far off, against the light */
  const fc2 = add(Q, S.farCrowd(30, 8, 6), 37, 9, 0, Math.PI / 2);
  const fc3 = add(Q, S.farCrowd(24, 7, 7), 42, 9, 0, Math.PI / 2);
  fc2.visible = fc3.visible = false;
  const DAWN = { top: 0x39486a, hor: 0xe7a36a, stars: 0.12, fog: [0xb89a86, 50, 420], sun: [0xffb070, 1.3, 60, 12, 40], hemi: [0xd9c4c8, 0x6a5a4c, 1.9], fill: 1.6, haze: 0xa89090, glow: 0.55 };
  const DAYL = Q.light;
  Q.props.gallows = gal;
  let dawn = false;
  Q.films.morning = (t) => {
    if (t >= 0 === dawn) return;
    dawn = t >= 0;
    gal.visible = fc.visible = fc2.visible = fc3.visible = dawn;
    Q.light = dawn ? DAWN : DAYL;
    Q.relight?.();
  };
  /* people */
  person(Q, "clerk", "clerk", -1.3, -3.6, face(-1.3, -3.6, 2, 2), { kind: "watch", at: [2.3, -5], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] }, { held: "ledger" });
  person(Q, "hutton", "hutton", 0.9, -6.5, face(0.9, -6.5, 0, 0), { kind: "watch", at: [0, 0], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cubba", "cubba", 4.6, 1.6, face(4.6, 1.6, 0, -5), { kind: "watch", at: [0, -8], idles: ["OldIdle"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "hx_townman", -9.5, 4.6, 0, { kind: "chat", group: "a", at: [-9.3, 5.3] });
  crowd(Q, "hx_townwoman", -8.6, 5.5, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_man", -10.0, 5.9, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_woman", 8, 16, 0, { kind: "wander", area: [7.5, 13, 13, 18], pause: [3, 7] });
  crowd(Q, "hx_penman", 15, -1, 0, { kind: "wander", pts: [[15, -1], [8, -1.6], [-9, -1.2], [-15, 0.4]], pause: [2, 5] });
  crowd(Q, "hx_townwoman", -14.4, 7.6, face(-14.4, 7.6, -16, 9.6), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-16, 9.6] });
  crowd(Q, "hx_man", 15.4, 6.9, face(15.4, 6.9, 16.7, 7.8), { kind: "work", clips: ["IdleM", "PickUp", "WipeSweat"], work: [5, 9], face: [16.7, 7.8] });
  crowd(Q, "hx_penwoman", 15.3, 16.9, face(15.3, 16.9, 14.8, 15.4), { kind: "work", clips: ["Idle", "PickUp", "Idle"], work: [5, 9], face: [14.8, 15.4] });
  crowd(Q, "hx_woman", 5.2, 21.2, face(5.2, 21.2, 6.6, 20.4), { kind: "watch", at: [0, 9], idles: ["Idle"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  crowd(Q, "hx_penman", -8.6, 19.6, 0, { kind: "work", between: [[-8.6, 19.6], [-13.6, 21.2]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "hx_townwoman", 11, 6, 0, { kind: "chat", group: "b", at: [11.4, 6.4] });
  crowd(Q, "hx_townman", 12, 7, 0, { kind: "chat", group: "b" });
  point(Q, "green", 0, 17.6, "the railed green");
  Q.keepOff = [{ at: [2.33, -3.4], r: 1.1 }, { at: [-4.67, -6.4], r: 1 }, { at: [-1.3, -2.2], r: 1 }, { at: [0, 17.6], r: 1.2 }, { pts: [[12, 21], [0, 17.6], [-8, 9.6], [-1.3, -2.4]], w: 1.2 }];
  Q.group = outer;
  turnPlace(Q);
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
