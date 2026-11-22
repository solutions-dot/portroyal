/* The four places of the story. Each is a general picture of a real kind of place; what follows a source is in docs/games/rose-hall.md.
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, for the castle, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/rose-hall/people). */
import * as THREE from "three";
import { T, std, solid, flat, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { tree, mule, cart, barrel, hillRing, scatter, surveyPole } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
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
/* a background person: look is a body (tools/rose-hall/people); life an ambient behaviour */
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

/* ---------- 1. The great hall of Rose Hall, on the night tour ---------- */
function house() {
  const Q = base("house", [-5.6, -3.6, 5.6, 3.6], [4.2, 2.4, Math.PI / 3]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.beds = { room: 0.05, wind: 0.03, owl: 0.3 };
  Q.light = { top: 0x10131c, hor: 0x2a2630, stars: 0.3, fog: [0x0c0b10, 20, 70], sun: [0xffd9a0, 0.25, 6, 10, 6], hemi: [0xffe2b8, 0x3a3038, 0.8], fill: 2.3 };
  Q.view = { pos: [4.6, 1.8, 3.0], look: [-3, 1.5, -2] };
  const wallM = solid(0xcfc4a8, 1),
    floor = std(T.plank([120, 78, 52], 9, [3, 2]), 0.8);
  Q.group.add(W.room({ x0: -6, z0: -4, x1: 6, z1: 4, h: 3.6, floor, ceiling: solid(0xd8d0bc, 1) }));
  W.wallRun(Q.group, [-6, -4, 6, -4], 3.6, wallM, [{ at: 3, w: 1.2, h: 1.9, sill: 0.8 }, { at: 9, w: 1.2, h: 1.9, sill: 0.8 }], 0.4);
  W.wallRun(Q.group, [6, 4, -6, 4], 3.6, wallM, [], 0.4);
  W.wallRun(Q.group, [-6, 4, -6, -4], 3.6, wallM, [], 0.4);
  W.wallRun(Q.group, [6, -4, 6, 4], 3.6, wallM, [], 0.4);
  for (const x of [-3, 3]) box(1.2, 1.9, 0.04, new THREE.MeshBasicMaterial({ color: 0x1a2238 }), x, 1.75, -4.18, Q.group);   /* night in the tall windows */
  Q.walls.push([-6.2, -4.2, 6.2, -3.6], [-6.2, 3.6, 6.2, 4.2], [-6.2, -4.2, -5.6, 4.2], [5.6, -4.2, 6.2, 4.2]);
  add(Q, W.makeDoor({ w: 1.6, h: 2.4, kind: "six", leaves: 2, color: 0x4a2f22, frame: 0xe2d9c2, handle: "knob" }), 0, 3.79, 0, Math.PI);
  /* the west wall: three tall portraits of men, dark until the candle is held up */
  const frames = [];
  for (const [z, c] of [[-2.2, 0x2f3a4a], [0, 0x4a2f2a], [2.2, 0x3a3a2a]]) {
    const g = grp();
    box(0.08, 1.9, 1.15, solid(0x8a6a2c, 0.5, 0.6), 0, 0, 0, g);
    box(0.02, 1.7, 0.95, solid(0x14110f, 1), 0.05, 0, 0, g);
    const fig = grp(g, 0.07, 0, 0);
    box(0.01, 0.75, 0.42, solid(c, 1), 0, -0.3, 0, fig);
    mesh(new THREE.SphereGeometry(0.15, 10, 8), solid(0xc9a184, 1), 0, 0.32, 0, fig).scale.x = 0.08;
    fig.visible = false;
    fig.traverse((o) => (o.userData.noBatch = true));
    add(Q, g, -5.76, z, 1.95);
    frames.push(fig);
  }
  const sconce = add(Q, W.candle(false), -5.5, -1.1, 1.2);
  box(0.16, 0.03, 0.2, W.WM.woodDark, -5.62, 1.19, -1.1, Q.group);
  Q.reveal.portraits = (seen) => {
    for (const f of frames) f.visible = seen;
    sconce.userData.light(seen);
  };
  /* a long table with candles, chairs, a tall mirror */
  solid1(Q, P.table(3.0, 1.1, 0.78), 0.4, -1.6, 3.1, 1.2);
  for (const x of [-0.6, 1.4]) add(Q, W.candle(true), x, -1.6, 0.81);
  for (const [x, z, ry] of [[-0.6, -0.7, Math.PI], [1.4, -0.7, Math.PI], [0.4, -2.5, 0]]) add(Q, W.chair(), x, z, 0, ry);
  wall(Q, 0.4, -0.7, 2.8, 0.5);
  wall(Q, 0.4, -2.5, 0.6, 0.5);
  const mirror = grp();
  box(1.0, 1.8, 0.06, solid(0x8a6a2c, 0.5, 0.6), 0, 0, 0, mirror);
  box(0.84, 1.62, 0.02, solid(0x9fb0b4, 0.15, 0.9), 0, 0, 0.035, mirror);
  add(Q, mirror, 5.76, 0.6, 1.7, -Math.PI / 2);
  solid1(Q, W.chest(1.1, 0.55, 0.55), 4.9, -2.9, 1.2, 0.7);
  /* the legend's shadows: three tall dark shapes on the wall, shown one after another in the camera scene only */
  const shades = [];
  for (const z of [-2.2, 0, 2.2]) {
    const sh = grp(Q.group, -5.74, 0, z);
    box(0.012, 1.5, 0.5, W.WM.dark, 0, 0.85, 0, sh);
    mesh(new THREE.SphereGeometry(0.17, 10, 8), W.WM.dark, 0, 1.78, 0, sh).scale.x = 0.07;
    sh.visible = false;
    sh.traverse((o) => {
      o.userData.noBatch = true;
      o.userData.noAudit = true;
    });
    shades.push(sh);
  }
  Q.films.legend = (t) => {
    shades.forEach((sh, i) => {
      const a = 7 + i * 7;
      sh.visible = t >= a && t < a + 6;
      sh.scale.y = t >= a + 4.5 ? Math.max(0.05, 1 - (t - a - 4.5) / 1.5) : 1;   /* each one sinks away */
    });
  };
  person(Q, "guide", "guide", -2.4, 1.4, face(-2.4, 1.4, 2, 2), { kind: "watch", at: [-5.7, 0], idles: ["Idle"], react: ["HeadTurn", "Point"], every: [5, 9] }, { held: "lantern" });
  person(Q, "cousin", "cousin", 2.6, 0.9, face(2.6, 0.9, -5.7, 0), { kind: "watch", at: [-5.7, 0], idles: ["Idle"], react: ["HeadTurn"], every: [4, 7] });
  crowd(Q, "rh_man", 3.6, -0.6, face(3.6, -0.6, 5.7, 0.6), { kind: "watch", at: [5.7, 0.6], react: ["HeadTurn"], every: [5, 9] });
  crowd(Q, "rh_elder", -1.2, 2.6, face(-1.2, 2.6, -5.7, 2.2), { kind: "watch", at: [-5.7, 2.2], react: ["HeadTurn", "Nod"], every: [5, 9] });
  Q.keepOff = [{ at: [-3.2, -2.2], r: 1 }];
  return Q;
}

/* ---------- 2. St James Parish Church, Montego Bay: the white monument ---------- */
function church() {
  const Q = base("church", [-5.6, -4.6, 5.6, 5.6], [0, 4.6, 0]);
  Q.floor = "stone";
  Q.indoor = true;
  Q.beds = { room: 0.05, bird: 0.05 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.4, 10, 30, 10], hemi: [0xfff4dc, 0x9a8e7a, 2.5], fill: 1.2 };
  Q.view = { pos: [3.4, 1.9, 4.8], look: [0, 2, -5] };
  const stone = std(T.stone([206, 198, 178], [5, 3]), 1);
  Q.group.add(W.room({ x0: -6, z0: -5, x1: 6, z1: 6, h: 5, floor: std(T.stone([150, 146, 136], [6, 6]), 1), ceiling: solid(0x6e5238, 1) }));
  W.wallRun(Q.group, [-6, -5, 6, -5], 5, stone, [], 0.4);
  W.wallRun(Q.group, [6, 6, -6, 6], 5, stone, [], 0.4);
  W.wallRun(Q.group, [-6, 6, -6, -5], 5, stone, [{ at: 3, w: 1, h: 2.4, sill: 1.4 }, { at: 8, w: 1, h: 2.4, sill: 1.4 }], 0.4);
  W.wallRun(Q.group, [6, -5, 6, 6], 5, stone, [{ at: 3, w: 1, h: 2.4, sill: 1.4 }, { at: 8, w: 1, h: 2.4, sill: 1.4 }], 0.4);
  for (const x of [-6.18, 6.18]) for (const z of [-2, 3]) box(0.04, 2.4, 1, new THREE.MeshBasicMaterial({ color: 0xdfe8ee }), x, 2.6, x < 0 ? (z === -2 ? 3 : -2) : z, Q.group);
  Q.walls.push([-6.2, -5.2, 6.2, -4.6], [-6.2, 5.6, 6.2, 6.2], [-6.2, -5.2, -5.6, 6.2], [5.6, -5.2, 6.2, 6.2]);
  add(Q, W.makeDoor({ w: 1.6, h: 2.6, kind: "panel", leaves: 2, color: 0x4a2f22, frame: 0xd8d0bc, handle: "ring" }), 0, 5.79, 0, Math.PI);
  /* the monument on the north wall: white marble, a mourning figure by an urn, the words below (a general picture of John Bacon's work) */
  const mon = grp();
  const marble = solid(0xf2f0ea, 0.5);
  box(1.9, 2.6, 0.12, solid(0x3a3d42, 0.7), 0, 0, 0, mon);
  box(1.5, 0.9, 0.1, marble, 0, -0.7, 0.08, mon);
  cyl(0.2, 0.14, 0.5, marble, 0.3, 0.3, 0.14, mon, 12);
  mesh(new THREE.SphereGeometry(0.2, 12, 8), marble, 0.3, 0.6, 0.14, mon).scale.y = 0.7;
  box(0.34, 0.8, 0.12, marble, -0.3, 0.2, 0.12, mon);
  mesh(new THREE.SphereGeometry(0.13, 10, 8), marble, -0.26, 0.72, 0.12, mon);
  const words = P.label("MRS ROSA PALMER  1790", 1.36, 0.22, "#f2f0ea", "#2b2620");
  words.position.set(0, -0.42, 0.14);
  mon.add(words);
  const lines = P.label("Her manners were open, cheerful and agreeable", 1.36, 0.14, "#f2f0ea", "#3a3530", "italic");
  lines.position.set(0, -0.72, 0.14);
  mon.add(lines);
  add(Q, mon, 0, -4.74, 2.3);
  /* a brass lamp under it, lit when you have read it */
  const lamp = add(Q, W.candle(false), 0, -4.5, 0.86);
  solid1(Q, P.table(0.9, 0.4, 0.84, W.WM.woodDark), 0, -4.4, 1.0, 0.5);
  Q.reveal.monument = (seen) => lamp.userData.light(seen);
  for (const z of [-0.6, 0.8, 2.2, 3.6]) for (const x of [-2.9, 2.9]) solid1(Q, W.bench(3.2), x, z, 3.3, 0.5);
  person(Q, "warden", "warden", 1.5, -2.9, face(1.5, -2.9, 0, 2), { kind: "watch", at: [0, -4.7], idles: ["Idle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  crowd(Q, "rh_elder", -2.9, 1.5, Math.PI, { kind: "watch", at: [0, -4.7], react: ["HeadTurn"], every: [6, 10] });
  Q.keepOff = [{ at: [0, -2.6], r: 1 }];
  return Q;
}

/* ---------- 3. The reading room of the archives, Spanish Town ---------- */
function archive() {
  const Q = base("archive", [-5.6, -3.6, 5.6, 3.6], [3.8, 2.4, Math.PI / 4]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.beds = { room: 0.07 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.2, 10, 30, 10], hemi: [0xffffff, 0x9a968a, 2.7], fill: 1.4 };
  Q.view = { pos: [4.4, 1.9, 2.9], look: [-1, 1, -1] };
  const wallM = solid(0xe6e2d6, 1);
  Q.group.add(W.room({ x0: -6, z0: -4, x1: 6, z1: 4, h: 3, floor: solid(0x8a7a62, 0.8), ceiling: solid(0xf0ede4, 1), beams: false }));
  W.wallRun(Q.group, [-6, -4, 6, -4], 3, wallM, [{ at: 3, w: 1.6, h: 1.3, sill: 1.1 }, { at: 9, w: 1.6, h: 1.3, sill: 1.1 }], 0.3);
  W.wallRun(Q.group, [6, 4, -6, 4], 3, wallM, [], 0.3);
  W.wallRun(Q.group, [-6, 4, -6, -4], 3, wallM, [], 0.3);
  W.wallRun(Q.group, [6, -4, 6, 4], 3, wallM, [], 0.3);
  for (const x of [-3, 3]) box(1.6, 1.3, 0.04, new THREE.MeshBasicMaterial({ color: 0xdfe8ee }), x, 1.75, -4.13, Q.group);
  Q.walls.push([-6.2, -4.2, 6.2, -3.6], [-6.2, 3.6, 6.2, 4.2], [-6.2, -4.2, -5.6, 4.2], [5.6, -4.2, 6.2, 4.2]);
  add(Q, W.makeDoor({ w: 0.95, h: 2.1, kind: "flush", color: 0x486573, frame: 0xe6e2d6, handle: "lever" }), 4.4, 3.84, 0, Math.PI);
  /* the long reading desk with the three papers, each under a sheet of tissue until you read it */
  solid1(Q, P.table(4.6, 0.9, 0.76, solid(0x7a5a3c, 0.8)), 0, -0.6, 4.7, 1.0);
  const papers = { register: [-1.6, "BURIALS 1846", 0x4a2f24], pamphlet: [0, "LEGEND OF ROSE HALL 1868", 0xb9b094], novel: [1.6, "THE WHITE WITCH 1929", 0x7a2f2a] };
  for (const [id, [x, title, c]] of Object.entries(papers)) {
    box(0.34, 0.04, 0.26, solid(c, 0.8), x, 0.78 + 0.02, -0.6, Q.group);
    const page = P.sheet(title, 0.32, 0.24);
    page.position.set(x, 0.825, -0.6);
    page.visible = false;
    Q.group.add(page);
    const tissue = box(0.36, 0.006, 0.28, solid(0xf4f1e6, 1), x, 0.826, -0.6, Q.group);
    tissue.userData.noBatch = true;
    Q.reveal[id] = (seen) => {
      page.visible = seen;
      tissue.visible = !seen;
    };
  }
  /* shelves of boxed records along the back wall, and the archivist's desk */
  for (let i = 0; i < 5; i++) {
    const sh = grp();
    box(1.8, 2.2, 0.4, solid(0x8f8f88, 0.6, 0.3), 0, 1.1, 0, sh);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) box(0.3, 0.38, 0.05, solid([0xb9a57a, 0x9a8a62, 0xc4b48a][(r + k + i) % 3], 1), -0.66 + k * 0.33, 0.35 + r * 0.5, 0.2, sh);
    solid1(Q, sh, -4.4 + i * 2.2, 3.3, 1.9, 0.5, Math.PI);
  }
  solid1(Q, P.table(1.4, 0.7, 0.76, solid(0x7a5a3c, 0.8)), -4.3, -2.4, 1.5, 0.8);
  add(Q, P.ledger(), -4.3, -2.4, 0.79);
  for (const x of [-1.6, 0, 1.6]) add(Q, W.chair(solid(0x5a4a3a, 0.9)), x, -1.5, 0, 0);
  wall(Q, 0, -1.5, 3.8, 0.5);
  person(Q, "archivist", "archivist", -3.1, -1.6, face(-3.1, -1.6, 0, 1), { kind: "watch", at: [0, -0.6], idles: ["Idle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  crowd(Q, "rh_man", 3.9, -2.6, face(3.9, -2.6, 3, -4), { kind: "watch", at: [3, -4], react: ["HeadTurn"], every: [6, 10] });
  Q.keepOff = [{ at: [-1.6, 0.4], r: 0.8 }, { at: [0, 0.4], r: 0.8 }, { at: [1.6, 0.4], r: 0.8 }];
  return Q;
}

/* ---------- 4. The old estate by day: the great house on its hill, the old works wall, the board of names ---------- */
function estate() {
  const Q = base("estate", [-12, -4, 12, 10], [7, 7.5, Math.PI / 4]);
  Q.floor = "grass";
  Q.beds = { wind: 0.05, bird: 0.14, sea: 0.03 };
  Q.light = { top: 0x6fa8c8, hor: 0xe8e0c4, fog: [0xd4dcd0, 90, 520], sun: [0xfff2d0, 2.4, -20, 50, 24], hemi: [0xfff4dc, 0x86a070, 2.5] };
  Q.view = { pos: [8, 2.4, 9], look: [-2, 2, -6] };
  ground(Q, std(T.grass([60, 60], [96, 130, 70])), 700);
  const far = hillRing(300, 14, 44, { seed: 31, base: [0.26, 0.42, 0.26] });
  far.traverse((o) => (o.userData.far = true));
  Q.group.add(far);
  /* the great house, far up the slope: a stone base, a plastered upper storey, a double stair to the door (after Hakewill's plate, about 1820) */
  add(Q, W.cockpitHill(60, 9, 3, [0.3, 0.46, 0.26]), 0, -70, -1);
  const gh = grp();
  W.stoneBox(26, 4, 12, W.LIME, 0, 2, 0, gh);
  box(26, 4.4, 12, W.WM.plaster, 0, 6.2, 0, gh);
  const rf = W.hipRoof(26, 12, 3, 0.6);
  rf.position.y = 8.4;
  gh.add(rf);
  for (let i = 0; i < 7; i++) for (const y of [2.2, 6.2]) box(1.2, 2, 0.1, W.WM.dark, -10.8 + i * 3.6, y, 6.02, gh);
  for (const s of [-1, 1]) {
    const st = W.stoneBox(7, 0.5, 2, W.LIME_DARK, s * 4, 2, 7, gh);
    st.rotation.z = s * 0.5;
  }
  gh.traverse((o) => (o.userData.far = true));
  add(Q, gh, 0, -70, 7.5);
  /* an old works wall of cut stone, broken at one end, with the board of names fixed to it */
  solid1(Q, W.stoneBox(9, 2.4, 0.7, W.LIME_DARK), -1, -1.2, 9.1, 0.8);
  solid1(Q, W.rocks(1.2, 7, 4), 4.6, -1.0, 1.8, 1.4);
  const board = grp();
  box(2.6, 1.5, 0.06, solid(0x2f3b33, 0.9), 0, 0, 0, board);
  const names = ["CELIA", "DORINDA", "CECELIA", "MARY JAMES", "HERCULES", "DOSHY", "ARCHEY", "AARON"];
  names.forEach((n, i) => {
    const l = P.label(n, 1.1, 0.24, "#2f3b33", "#f2ead2");
    l.position.set(i % 2 ? 0.62 : -0.62, 0.5 - Math.floor(i / 2) * 0.32, 0.035);
    board.add(l);
  });
  add(Q, board, 0, -0.82, 1.45);
  /* flowers laid at the foot of the wall once the names are read */
  const fl = grp();
  for (let i = 0; i < 7; i++) mesh(new THREE.SphereGeometry(0.06, 6, 5), solid([0xd94a4a, 0xf0c040, 0xf2f0ea][i % 3], 1), -0.3 + i * 0.1, 0.08, (i % 2) * 0.08, fl);
  fl.traverse((o) => (o.userData.noBatch = true));
  fl.visible = false;
  add(Q, fl, 0, -0.5);
  Q.reveal.names = (seen) => (fl.visible = seen);
  for (const [x, z, h, s] of [[-9, 2, 7, 51], [9.5, 0.5, 6.5, 52], [-6, 8.6, 6, 53]]) solid1(Q, tree(h, s, 1), x, z, 0.9, 0.9);
  solid1(Q, W.bench(2), 5.4, 4.2, 2.1, 0.5, -0.5);
  scatter(Q.group, (i) => tree(6 + (i % 4), i + 60, 1), 16, [-70, -50, 70, -14], [[-18, -80, 18, -50]], 31);
  person(Q, "guide", "guide", -2.6, 1.3, face(-2.6, 1.3, 2, 4), { kind: "watch", at: [0, -0.8], idles: ["Idle"], react: ["HeadTurn"], every: [5, 9] });
  person(Q, "cousin", "cousin", 2.4, 1.6, face(2.4, 1.6, 0, -0.8), { kind: "watch", at: [0, -0.8], idles: ["Idle"], react: ["HeadTurn"], every: [4, 8] });
  crowd(Q, "rh_elder", 6.6, 3.2, face(6.6, 3.2, 0, 0), { kind: "wander", area: [3, 2.4, 10, 8], pause: [3, 7] });
  Q.keepOff = [{ at: [0, 0.6], r: 1.1 }];
  return Q;
}

const builders = { house, church, archive, estate };
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
