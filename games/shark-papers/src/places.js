/* The three places of the story. Each is a general picture of a real kind of place; what follows a source is in docs/games/shark-papers.md.
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, for the castle, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/shark-papers/people). */
import * as THREE from "three";
import { T, std, solid, flat, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { tree, mule, cart, barrel, hillRing, scatter, surveyPole } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import { TASKS } from "./steps.js";
import { createSea } from "../../../engine/sea.js";

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
/* a background person: look is a body (tools/shark-papers/people); life an ambient behaviour */
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
/* the dry limestone country of the middle of St Ann: pale hills near and far, scrub and rock */
function hills(Q, seed = 3, near = true) {
  const far = hillRing(300, 16, 50, { seed, base: [0.36, 0.42, 0.28] });
  far.traverse((o) => (o.userData.far = true));
  Q.group.add(far);
  if (near)
    for (const [x, z, r, h, s] of [[-95, -70, 46, 30, 1], [70, -110, 60, 38, 2], [120, 20, 50, 30, 3], [-130, 40, 55, 34, 4], [10, 140, 70, 36, 5], [-60, 110, 44, 26, 6]]) add(Q, W.cockpitHill(r, h, seed + s), x, z, -1);
}
const DUST = [186, 168, 132],
  DRY = [150, 144, 96];

const PLANK = () => std(T.plank([150, 118, 82], 10, [1, 6]), 0.9);
/* a mast with a boom or yards: a tapered pole standing on the deck */
function mast(h, yards = [], boom = 0) {
  const g = grp();
  cyl(0.11, 0.17, h, W.WM.wood, 0, h / 2, 0, g, 10);
  for (const [y, len] of yards) {
    const yd = cyl(0.05, 0.05, len, W.WM.wood, 0, y, 0.12, g, 8);
    yd.rotation.z = Math.PI / 2;
    box(len * 0.92, 0.22, 0.12, W.WM.linen, 0, y - 0.16, 0.12, g);   /* the sail, furled along its yard */
  }
  if (boom) {
    const bm = cyl(0.06, 0.07, boom, W.WM.wood, 0, 2.2, boom / 2, g, 8);
    bm.rotation.x = Math.PI / 2;
    box(0.14, 0.3, boom * 0.9, W.WM.linen, 0, 2.42, boom / 2, g);
  }
  return g;
}
/* a small deck gun on its wooden carriage */
function gun() {
  const g = grp();
  box(0.5, 0.22, 0.8, W.WM.woodDark, 0, 0.2, 0, g);
  for (const x of [-0.27, 0.27]) for (const z of [-0.25, 0.25]) cyl(0.1, 0.1, 0.06, W.WM.woodDark, x, 0.1, z, g, 8).rotation.z = Math.PI / 2;
  cyl(0.07, 0.1, 1.0, W.WM.iron, 0, 0.4, 0.1, g, 10).rotation.x = Math.PI / 2;
  return g;
}
/* a hull seen from the quay or from another deck: a long dark box with a pale stripe, bulwarks, masts */
function hull(L, B, { stripe = 0xd9c48a, masts = [], h = 2.6 } = {}) {
  const g = grp();
  box(L, h, B, solid(0x2a2622, 0.9), 0, h / 2 - 1.0, 0, g);
  box(L + 0.02, 0.3, B + 0.02, solid(stripe, 0.9), 0, h - 1.5, 0, g);
  box(L * 0.2, h * 0.5, B * 0.8, solid(0x2a2622, 0.9), L / 2 + L * 0.06, h - 1.2, 0, g).rotation.z = -0.3;   /* the bow rises */
  const bs = cyl(0.07, 0.1, L * 0.3, W.WM.wood, L / 2 + L * 0.22, h - 0.6, 0, g, 8);
  bs.rotation.z = -Math.PI / 2 + 0.25;
  for (const [x, mh, yards] of masts) {
    const m = mast(mh, yards);
    m.position.set(x, h - 1.0, 0);
    m.rotation.y = Math.PI / 2;
    g.add(m);
  }
  return g;
}

/* ---------- 1. The deck of the schooner Ferret, off Jacmel, 30 August 1799 ---------- */
function deck() {
  const Q = base("deck", [-2.6, -7.2, 2.6, 7.2], [1.4, 6.2, 0.2]);
  Q.floor = "wood";
  Q.beds = { sea: 0.16, wind: 0.08 };
  Q.light = { top: 0x4f9fd0, hor: 0xd9ecf0, fog: [0xcfe4ea, 120, 700], sun: [0xfff4d8, 2.5, 30, 50, 20], hemi: [0xffffff, 0x6f9aa8, 2.6] };
  Q.view = { pos: [2.2, 2.6, 8.6], look: [-0.6, 1.2, -3] };
  /* the deck: planks on a dark hull, low bulwarks all round, the sea 1.5 m below */
  ground(Q, PLANK(), 1).scale.set(6, 15.4, 1);
  box(6.2, 1.6, 15.6, solid(0x2a2622, 0.9), 0, -0.83, 0, Q.group);
  for (const s of [-1, 1]) {
    box(0.16, 0.8, 15.4, W.WM.woodDark, s * 3.0, 0.4, 0, Q.group);
    box(0.24, 0.07, 15.4, W.WM.wood, s * 3.0, 0.83, 0, Q.group);
    box(6.16, 0.8, 0.16, W.WM.woodDark, 0, 0.4, s * 7.7, Q.group);
  }
  Q.walls.push([-3.2, -7.9, -2.86, 7.9], [2.86, -7.9, 3.2, 7.9]);
  const sea = createSea(Q.group, { kind: "caribbean", y: -1.5, at: [0, 0] });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  const far = hillRing(420, 9, 30, { seed: 5, base: [0.3, 0.44, 0.34] });   /* the hills of the south coast of Saint-Domingue, far to the north */
  far.traverse((o) => (o.userData.far = true));
  far.position.z = -260;
  Q.group.add(far);
  /* masts, the main hatch, the wheel, six small guns, a water cask and the galley stove's box */
  const fore = mast(11, [[8.2, 5]], 0),
    main = mast(12.5, [], 6);
  solid1(Q, fore, 0, -3.6, 0.5, 0.5);
  solid1(Q, main, 0, 2.9, 0.5, 0.5, Math.PI);
  const hatch = grp();
  box(1.6, 0.42, 1.3, W.WM.woodDark, 0, 0.21, 0, hatch);
  box(1.5, 0.05, 1.2, W.WM.wood, 0, 0.445, 0, hatch);
  solid1(Q, hatch, 0, 1.0, 1.7, 1.4);
  const wheel = grp();
  box(0.5, 0.9, 0.3, W.WM.woodDark, 0, 0.45, 0, wheel);
  mesh(new THREE.TorusGeometry(0.42, 0.035, 6, 16), W.WM.wood, 0, 1.0, 0.2, wheel);
  for (let i = 0; i < 4; i++) box(0.9, 0.04, 0.04, W.WM.wood, 0, 1.0, 0.2, wheel).rotation.z = (i * Math.PI) / 4;
  solid1(Q, wheel, 0, 6.6, 0.9, 0.5, Math.PI);
  for (const z of [-5.6, -1.4, 4.4]) for (const s of [-1, 1]) solid1(Q, gun(), s * 2.1, z, 0.9, 0.6, (s * Math.PI) / 2);
  solid1(Q, barrel(), 2.3, 1.6, 0.7, 0.7);
  /* the mess table by the wheel where breakfast waits, with the pork on it */
  solid1(Q, P.table(1.2, 0.7, 0.8), 1.2, 5.5, 1.3, 0.8);
  /* the fishing line over the port side by the fore mast: a stout line made fast to a cleat, tight once the shark has the hook */
  box(0.3, 0.12, 0.12, W.WM.iron, -2.86, 0.92, -4.9, Q.group);
  const line = cyl(0.012, 0.012, 2.6, W.WM.rope, -3.5, -0.1, -4.9, Q.group, 5);
  line.rotation.z = 0.5;
  line.userData.noBatch = true;
  line.userData.noAudit = true;
  /* the shark, hauled on to the deck: long, grey, pale underneath. No kind is recorded, so it is a plain large shark. */
  const shark = grp();
  const body = mesh(new THREE.SphereGeometry(0.42, 14, 10), solid(0x6f7a84, 0.6), 0, 0.36, 0, shark);
  body.scale.set(0.85, 0.75, 3.6);
  mesh(new THREE.SphereGeometry(0.4, 12, 8), solid(0xd8dcd8, 0.7), 0, 0.26, 0, shark).scale.set(0.8, 0.5, 3.4);
  const fin = mesh(new THREE.ConeGeometry(0.2, 0.5, 4), solid(0x5f6a74, 0.6), 0, 0.82, -0.1, shark);
  fin.scale.z = 2;
  const tail = mesh(new THREE.ConeGeometry(0.24, 0.9, 4), solid(0x5f6a74, 0.6), 0, 0.5, 1.75, shark);
  tail.rotation.x = Math.PI / 2 + 0.6;
  tail.scale.x = 0.25;
  for (const s of [-1, 1]) mesh(new THREE.ConeGeometry(0.14, 0.5, 4), solid(0x5f6a74, 0.6), s * 0.4, 0.22, -0.4, shark).rotation.z = s * 1.9;
  shark.traverse((o) => (o.userData.noBatch = true));
  shark.visible = false;
  add(Q, shark, -0.9, -2.4, 0, 0.5);
  wall(Q, -0.9, -2.4, 1.3, 2.9);
  Q.reveal.haul = (seen) => {
    shark.visible = seen;
    line.visible = !seen;
  };
  Q.reveal.bundle = () => {};   /* the bundle itself is the thing you pick up next (steps.js TASKS.papers) */
  Q.enter = (stage) => {
    const o = Q.items.bundle;
    if (o && o.parent === Q.group && stage < 20) o.visible = false;   /* nothing lies by the shark until it has been opened */
    else if (o && stage >= 20) o.visible = true;
  };
  /* people */
  person(Q, "cato", "cato", -1.6, 3.6, face(-1.6, 3.6, 1.4, 6.2), { kind: "watch", at: [-30, -10], idles: ["IdleM"], react: ["HeadTurn", "Point"], every: [5, 9] });
  person(Q, "fitton", "fitton", 1.7, -0.6, face(1.7, -0.6, 0, 4), { kind: "watch", at: [-30, -6], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "wylie", "wylie", 2.0, 3.4, face(2.0, 3.4, 0, 0), { kind: "watch", at: [-0.9, -2.4], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "sp_seaman", -0.8, -6.6, face(-0.8, -6.6, -30, -6), { kind: "watch", at: [-30, -6], react: ["HeadTurn", "Point"], every: [5, 9] });
  crowd(Q, "sp_seaman2", 1.9, -5.0, face(1.9, -5.0, 0, -3.6), { kind: "work", clips: ["IdleM", "PickUp", "WipeSweat"], work: [5, 9], face: [0, -3.6] });
  Q.keepOff = [{ at: [-1.4, -4.6], r: 0.9 }, { at: [1.3, -1.6], r: 0.8 }, { at: [0, 2.4], r: 0.8 }, { at: [1.2, 4.2], r: 0.8 }];
  return Q;
}

/* ---------- 2. The quay at Port Royal, September 1799 ---------- */
function quay() {
  const Q = base("quay", [-14, -1.6, 14, 9], [9, 6, Math.PI / 3]);
  Q.floor = "stone";
  Q.beds = { sea: 0.1, surf: 0.04, crowd: 0.05, wind: 0.04 };
  Q.light = { top: 0x5fa8d4, hor: 0xe4eee8, fog: [0xd4e4e4, 120, 650], sun: [0xfff2d0, 2.5, -20, 50, 24], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  Q.view = { pos: [11, 2.6, 8.4], look: [-2, 3, -8] };
  ground(Q, std(T.sand([40, 40])), 600, 0, 302.5);
  strip(Q, 60, 13, std(T.stone([168, 160, 144], [20, 4]), 1), 0, 4.2, 0.012);
  W.stoneBox(60, 1.8, 0.6, W.LIME_DARK, 0, -0.9 + 0.0, -2.3, Q.group);   /* the quay wall, down to the water */
  const sea = createSea(Q.group, { kind: "caribbean", y: -0.9, at: [0, -150] });
  Q.tickers.push((t) => sea.tick && sea.tick(t));
  Q.walls.push([-30, -3, 30, -1.9]);
  for (const x of [-9, -3, 3, 9]) solid1(Q, cyl(0.16, 0.2, 0.7, W.WM.iron, 0, 0.35, 0, grp(), 8).parent, x, -1.5, 0.5, 0.5);   /* bollards */
  /* the brig Nancy alongside: two masts with yards (a general picture of a merchant brig of her time) */
  const nancy = hull(24, 6.4, { masts: [[5.5, 17, [[8, 9], [12.5, 7]]], [-4.5, 19, [[8.5, 10], [13.5, 8]]]] });
  add(Q, nancy, 0, -6.4, 0.9);
  const seal = box(0.5, 0.36, 0.03, solid(0xe8ddc4, 1), 0.6, 1.5, -2.02, Q.group);   /* the court's notice on the quay wall once you have looked: she is held for the court */
  seal.userData.noBatch = true;
  seal.visible = false;
  Q.reveal.nancy = (seen) => (seal.visible = seen);
  /* HMS Abergavenny, the guard ship, far out in the harbour */
  const ab = hull(52, 13, { stripe: 0xd8b860, h: 7, masts: [[14, 30, [[12, 20], [20, 15]]], [0, 34, [[13, 22], [22, 16]]], [-15, 26, [[11, 16]]]] });
  ab.traverse((o) => (o.userData.far = true));
  add(Q, ab, -70, -120, -0.6, 0.4);
  /* a storehouse of brick behind the quay, cargo, a cart */
  const store = grp();
  box(18, 6, 8, std(T.stone([156, 84, 62], [8, 3]), 1), 0, 3, 0, store);
  const rf = W.hipRoof(18, 8, 2.2, 0.4);
  rf.position.y = 6;
  store.add(rf);
  for (const x of [-5, 0, 5]) box(1.6, 2.6, 0.06, W.WM.woodDark, x, 1.3, -4.02, store);
  add(Q, store, -2, 15.5);
  wall(Q, -2, 15.5, 18.6, 8.6);
  for (const [x, z] of [[-10.5, 2.2], [-9.6, 2.6], [-10.2, 3.3], [6.4, 0.6], [7.2, 0.9]]) solid1(Q, barrel(), x, z, 0.7, 0.7);
  solid1(Q, cart(2.6, 1.4), 11.4, 2.2, 3.0, 1.9, 0.2);
  for (const [x, z] of [[-12.4, 7.6], [4.6, 8]]) solid1(Q, W.chest(1.0, 0.6, 0.6), x, z, 1.1, 0.7);
  person(Q, "ben", "ben", 3.4, 2.2, face(3.4, 2.2, 9, 6), { kind: "watch", at: [0, -6], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  crowd(Q, "sp_seaman2", -8.6, 4.4, 0, { kind: "work", between: [[-8.6, 4.4], [-4.4, 8.2]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "sp_seaman", 10.9, 6.9, 0, { kind: "chat", group: "q", at: [10.5, 7.4] });
  crowd(Q, "sp_briggs", 10.1, 7.9, 0, { kind: "chat", group: "q" });
  Q.keepOff = [{ at: [0, -1.4], r: 1 }, { pts: [[9, 6], [3.4, 3.4]], w: 1.2 }];
  return Q;
}

/* ---------- 3. The Court of Vice-Admiralty, Kingston, November 1799 ---------- */
function court() {
  const Q = base("court", [-5.6, -3.6, 5.6, 3.6], [3.8, 2.4, Math.PI / 4]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.beds = { room: 0.06, crowd: 0.03 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.2, 10, 30, 10], hemi: [0xffffff, 0x9a968a, 2.6], fill: 1.4 };
  Q.view = { pos: [4.4, 1.9, 2.9], look: [-1, 1.2, -2] };
  const wallM = solid(0xe2dcc8, 1);
  Q.group.add(W.room({ x0: -6, z0: -4, x1: 6, z1: 4, h: 3.4, floor: std(T.plank([120, 92, 64], 9, [3, 2]), 0.9), ceiling: solid(0xe8e2d0, 1) }));
  W.wallRun(Q.group, [-6, -4, 6, -4], 3.4, wallM, [{ at: 2.5, w: 1.2, h: 1.7, sill: 1.0 }, { at: 9.5, w: 1.2, h: 1.7, sill: 1.0 }], 0.4);
  W.wallRun(Q.group, [6, 4, -6, 4], 3.4, wallM, [], 0.4);
  W.wallRun(Q.group, [-6, 4, -6, -4], 3.4, wallM, [], 0.4);
  W.wallRun(Q.group, [6, -4, 6, 4], 3.4, wallM, [], 0.4);
  for (const x of [-3.5, 3.5]) box(1.2, 1.7, 0.04, new THREE.MeshBasicMaterial({ color: 0xdfe8ee }), x, 1.85, -4.18, Q.group);
  Q.walls.push([-6.2, -4.2, 6.2, -3.6], [-6.2, 3.6, 6.2, 4.2], [-6.2, -4.2, -5.6, 4.2], [5.6, -4.2, 6.2, 4.2]);
  add(Q, W.makeDoor({ w: 1.4, h: 2.3, kind: "six", leaves: 2, color: 0x2f3b33, frame: 0xe2d9c2, handle: "knob" }), 0, 3.79, 0, Math.PI);
  /* the judge's bench on its step, empty: the judge is not named in any source found, so nobody sits there */
  const bench = grp();
  box(4.4, 0.3, 1.4, W.WM.woodDark, 0, 0.15, 0, bench);
  box(3.6, 1.1, 0.5, W.WM.woodDark, 0, 0.85, 0.3, bench);
  box(0.8, 1.6, 0.12, W.WM.woodDark, 0, 1.1, -0.5, bench);
  solid1(Q, bench, 0, -2.8, 4.5, 1.5);
  /* the table with the two sets of papers: the sealed ones, and the stained ones from the shark */
  solid1(Q, P.table(3.6, 0.9, 0.78), 0, -0.9, 3.7, 1.0);
  const sealed = grp();
  box(0.3, 0.05, 0.22, solid(0xe8ddc4, 1), 0, 0.025, 0, sealed);
  cyl(0.03, 0.03, 0.012, solid(0x9a1f1a, 0.5), 0, 0.056, 0, sealed, 10);
  add(Q, sealed, -1.4, -0.9, 0.81);
  const open1 = P.sheet("AMERICAN BRIG NANCY", 0.3, 0.22);
  open1.position.set(-1.0, 0.815, -0.9);
  open1.visible = false;
  Q.group.add(open1);
  Q.reveal.false = (seen) => (open1.visible = seen);
  const wet = grp();
  for (let i = 0; i < 4; i++) box(0.27, 0.012, 0.2, solid(0xcabf96, 1), 0, 0.006 + i * 0.012, 0, wet).rotation.y = i * 0.1;
  add(Q, wet, 1.4, -0.9, 0.81);
  const open2 = P.sheet("Mr. Christopher Shultz", 0.3, 0.22);
  open2.position.set(1.0, 0.815, -0.9);
  open2.visible = false;
  Q.group.add(open2);
  Q.reveal.real = (seen) => (open2.visible = seen);
  /* the jaws, on a stand by the wall */
  const jaws = grp();
  box(0.5, 1.0, 0.4, W.WM.woodDark, 0, 0.5, 0, jaws);
  const j = mesh(new THREE.TorusGeometry(0.26, 0.05, 6, 16), solid(0xe8e2d0, 0.6), 0, 1.3, 0, jaws);
  j.scale.y = 1.2;
  solid1(Q, jaws, -4.9, 1.6, 0.6, 0.5, Math.PI / 2);
  for (const z of [1.6, 2.6]) for (const x of [-2.2, 2.2]) solid1(Q, W.bench(2.6), x, z, 2.7, 0.5);
  person(Q, "clerk", "clerk", -3.2, -1.2, face(-3.2, -1.2, 2, 2), { kind: "watch", at: [0, -0.9], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] }, { held: "ledger" });
  person(Q, "fitton", "fitton", 3.4, -0.4, face(3.4, -0.4, 0, 1), { kind: "watch", at: [0, -0.9], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "sp_briggs", -4.2, -0.2, face(-4.2, -0.2, 0, -0.9), { kind: "watch", at: [0, -0.9], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "sp_seaman", 4.9, 0.8, face(4.9, 0.8, 0, -2), { kind: "watch", at: [0, -2.8], react: ["HeadTurn"], every: [6, 10] });
  Q.keepOff = [{ at: [-1.4, 0.3], r: 0.8 }, { at: [1.4, 0.3], r: 0.8 }];
  return Q;
}

const builders = { deck, quay, court };
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
