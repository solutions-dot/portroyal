/* The five places of the story. Each is a compressed picture of a real kind of place; what is modelled on a source and what is a general
   picture is in docs/games/hutchinson.md ("Places").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter), its part in a camera scene (Q.films) and, for the castle, where you can be seen and where you are in cover (Q.danger).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/hutchinson/people). */
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

/* ---------- 1. The road by Dr Hutton's pen, a dry afternoon in 1772 ---------- */
function road() {
  const Q = base("road", [-18, -7, 18, 12], [13, 6.2, Math.PI / 2]);
  Q.floor = "sand";
  Q.beds = { wind: 0.05, bird: 0.12 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 520], sun: [0xfff0c8, 2.5, -30, 60, 24], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [15, 2.4, 11], look: [-2, 1.2, 1] };
  ground(Q, std(T.grass([60, 60], DRY)), 700);
  strip(Q, 150, 4.2, std(T.dirt([40, 2], DUST)), 0, 6);
  hills(Q, 3);
  /* the castle, two miles off on its rise: you can see the towers from here */
  add(Q, W.cockpitHill(34, 14, 9, [0.4, 0.42, 0.28]), -150, -60, -1);
  const far = add(Q, W.farCastle(1.6), -150, -60, 12.2, 0.5);
  far.traverse((o) => (o.userData.far = true));
  /* the pen wall along the north side of the road, its gate standing open */
  fieldWall(Q, -18.5, 2.2, -2.4, 2.2, 1.25, 4);
  fieldWall(Q, 0.6, 2.2, 18.5, 2.2, 1.25, 5);
  for (const x of [-2.115, 0.315]) {
    add(Q, mesh(new THREE.BoxGeometry(0.55, 1.7, 0.7), std(T.stone(W.LIME, [1, 2]), 1)), x, 2.2, 0.85);
  }
  const gate = grp();
  for (const y of [0.35, 0.75, 1.15]) box(1.9, 0.09, 0.05, W.WM.wood, 0.95, y, 0, gate);
  for (const x of [0.05, 0.95, 1.85]) box(0.09, 1.3, 0.06, W.WM.woodDark, x, 0.7, 0, gate);
  add(Q, gate, -0.03, 1.8, 0, Math.PI / 2 + 0.25);   /* swung back into the yard */
  wall(Q, 0.0, 1.1, 0.5, 2.0);
  /* inside the pen: the yard, a dry stone trough, a guango tree, the house far back */
  strip(Q, 20, 8.6, std(T.dirt([8, 4], [170, 152, 118])), -1, -2.6, 0.008);
  const trough = grp();
  W.stoneBox(2.2, 0.5, 0.8, W.LIME_DARK, 0, 0.25, 0, trough);
  box(1.9, 0.06, 0.52, solid(0x6f6a5c, 1), 0, 0.5, 0, trough);   /* dry: no water, only dust */
  solid1(Q, trough, 6, -1.2, 2.3, 0.9);
  solid1(Q, tree(7.5, 4, 1), -9, -3.4, 1.0, 1.0);
  solid1(Q, tree(6, 9), 12.5, -4.6, 0.9, 0.9);
  const house = grp();
  W.stoneBox(12, 1.2, 7, W.LIME_DARK, 0, 0.6, 0, house);
  box(12, 2.8, 7, std(T.plank([196, 182, 150], 8, [3, 1]), 0.95), 0, 2.6, 0, house);
  const hr = W.hipRoof(12, 7, 2.2, 0.6);
  hr.position.y = 4.0;
  house.add(hr);
  add(Q, house, -3, -26, 0, 0.1);
  /* the boundary: a survey pole by the wall, where the two men's land meets */
  solid1(Q, surveyPole(0xb03a2a), -13.5, 3.4, 0.3, 0.3);
  solid1(Q, W.rocks(0.9, 4, 3), -15, 9.6, 1.4, 1.2);
  /* Sampson's cart and mule on the road's south side, water casks on it */
  const c = cart(2.6, 1.4);
  for (const [x, z] of [[-0.6, -0.3], [0.2, 0.3], [-0.6, 0.35]]) {
    const b = barrel();
    b.scale.setScalar(0.72);
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
  const flap = box(0.37, 0.05, 0.6, solid(0x7a5a3c, 1), 0.3, 0.18, 0, pack);   /* the bag's flap: lifted when you look inside */
  flap.userData.noBatch = true;
  stray.traverse((o) => (o.userData.noBatch = true));
  solid1(Q, stray, -7, 3.6, 2.0, 0.9, Math.PI / 2);
  Q.reveal.packmule = (seen) => {
    flap.rotation.z = seen ? 1.1 : 0;
    flap.position.y = seen ? 0.36 : 0.18;
    flap.position.x = seen ? 0.52 : 0.3;
  };
  for (const [x, z, s] of [[-16, 10.5, 1.2], [3, 10.8, 1], [15.5, 10.2, 1.3], [-4, 10.4, 0.9]]) solid1(Q, W.scrub(x * 7 + 3, s), x, z, 0.5, 0.5);
  scatter(Q.group, (i) => W.scrub(i + 30, 0.8 + (i % 3) * 0.3), 30, [-60, 14, 60, 60], [], 7);
  scatter(Q.group, (i) => W.rocks(0.7 + (i % 3) * 0.3, i + 2, 2), 14, [-60, 14, 60, 50], [], 11);
  scatter(Q.group, (i) => tree(5 + (i % 3), i + 12, i % 2), 9, [-50, -40, 50, -12], [[-12, -34, 6, -18]], 13);
  /* people */
  person(Q, "cubba", "cubba", 4.6, -2.6, face(4.6, -2.6, 6, -1.2), { kind: "watch", at: [6, -1.2], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "carter", "carter", 7.2, 7.9, face(7.2, 7.9, 7, 6), { kind: "watch", at: [9.9, 9.4], idles: ["IdleM"], react: ["HeadTurn", "WipeSweat"], every: [5, 9] });
  person(Q, "hutton", "hutton", -1, 3.6, 0, { kind: "watch", at: [-150, -60], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "hx_man", -6, -4.6, 0, { kind: "work", between: [[-6, -4.6], [2.5, -5.2]], walk: "Walk", idle: "IdleM" });
  crowd(Q, "hx_woman", 9.5, -3, face(9.5, -3, 6, -1.2), { kind: "wander", area: [7.5, -5.6, 14, -1.4], pause: [3, 7] });
  point(Q, "boundary", -13.2, 4.6, "the boundary pole");
  Q.keepOff = [{ at: [-6.6, 5.0], r: 1 }, { at: [-13.2, 4.6], r: 1 }, { pts: [[13, 6.2], [-1, 5]], w: 1.2 }];
  return Q;
}

/* ---------- 2. Under the towers: Edinburgh Castle, with its well, at dusk and by day ---------- */
function castle() {
  const Q = base("castle", [-22, -3.4, 22, 15], [17, 12.6, Math.PI / 2]);
  Q.floor = "sand";
  Q.beds = { wind: 0.07, owl: 0.5 };
  const DUSK = { top: 0x2c3a5c, hor: 0xd9895a, stars: 0.25, moon: 0, fog: [0x8a6f6a, 40, 300], sun: [0xff9a5a, 1.15, -60, 14, 30], hemi: [0xc9b6c8, 0x5a4a40, 1.75], fill: 2.4 },
    DAYL = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 80, 480], sun: [0xfff0d0, 2.2, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.4] };
  Q.light = DUSK;
  Q.view = { pos: [15, 2.2, 14], look: [0, 3, -8] };
  ground(Q, std(T.grass([60, 60], [136, 128, 88])), 700);
  strip(Q, 150, 3.8, std(T.dirt([40, 2], DUST)), 0, 12.4);
  strip(Q, 3, 14, std(T.dirt([2, 6], DUST)), -6.5, 6, 0.01);   /* the track from the road up to the well and the door */
  hills(Q, 8);
  /* the castle on its rise, front to the road */
  const C = W.castle();
  add(Q, C, 0, -9);
  for (const r of C.userData.walls) Q.walls.push([r[0], r[1] - 9, r[2], r[3] - 9]);
  Q.props.castle = C;
  /* the well: people say it is the only water for miles in a dry season */
  solid1(Q, W.well(), -6.5, 0.2, 2.4, 2.2);
  /* cover between the road and the well: field walls, rock, the cotton tree, an old cart */
  fieldWall(Q, 9, 10.2, 16, 10.2, 1.55, 6);
  solid1(Q, W.rocks(2.2, 5, 5), 6.2, 6.6, 2.6, 1.8);
  const cotton = grp();
  cyl(0.75, 1.15, 5.5, solid(0x8a8272, 1), 0, 2.75, 0, cotton, 10);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2,
      root = box(0.2, 1.5, 1.5, solid(0x857d6d, 1), Math.sin(a) * 1.1, 0.7, Math.cos(a) * 1.1, cotton);
    root.rotation.y = a;
    root.rotation.x = -0.25;
  }
  for (const [x, y, z, s] of [[0, 8.2, 0, 3.4], [2.6, 7.2, 1, 2.4], [-2.4, 7.4, -1.2, 2.6], [0.6, 7, -2.6, 2.2]]) mesh(new THREE.IcosahedronGeometry(s, 1), flat(0x4f6a3a), x, y, z, cotton).scale.y = 0.6;
  solid1(Q, cotton, 0.8, 4.2, 2.6, 2.6);
  fieldWall(Q, -4.6, 3.4, -1.6, 3.4, 1.5, 7);
  const oldCart = cart(2.4, 1.3);
  solid1(Q, oldCart, -11.5, 6.4, 2.9, 1.8, 0.3);
  fieldWall(Q, -22.5, 10.2, -12, 10.2, 1.4, 8);
  for (const [x, z, s] of [[19, 5, 1.2], [14, 1.5, 1], [-17, 2.2, 1.3], [-19.5, 7.2, 1], [10.5, -1.6, 1.1]]) solid1(Q, W.scrub(x * 3 + 5, s), x, z, 0.5, 0.5);
  for (const [x, z] of [[17, -1.5], [-14.5, -1.8]]) solid1(Q, W.rocks(1.1, x + 20, 3), x, z, 1.5, 1.3);
  scatter(Q.group, (i) => W.scrub(i + 60, 0.8 + (i % 3) * 0.3), 26, [-70, 16, 70, 60], [], 17);
  scatter(Q.group, (i) => tree(5 + (i % 4), i + 40, i % 2), 12, [-60, -50, 60, -18], [[-12, -22, 12, -16]], 19);
  /* Sampson's cart waits on the road, behind the long wall, out of sight of the house */
  const c = cart(2.6, 1.4);
  for (const [x, z] of [[-0.6, -0.3], [0.2, 0.3]]) {
    const b = barrel();
    b.scale.setScalar(0.72);
    b.position.set(x, 0.76, z);
    c.add(b);
  }
  solid1(Q, c, 12.4, 13.6, 3.0, 1.9);
  solid1(Q, mule(0x6a5644), 17.1, 13.6, 2.0, 0.8, Math.PI / 2);
  /* where you are in cover (on the road side of each solid thing), and the open ground the upper window looks over */
  Q.danger.tower = {
    start: [15, 11.4, Math.PI / 2],
    zone: [-21, -3.2, 21, 9.6],
    cover: [[8.6, 10.4, 16.4, 15], [4.9, 7.4, 7.5, 9.2], [-0.5, 5.4, 2.1, 7.0], [-4.9, 3.7, -1.3, 5.2], [-7.9, 1.2, -5.1, 2.6], [-12.9, 7.2, -10.1, 8.6], [-22, 10.4, -12, 15]],
    grace: 1.7,
    look: (t) => {
      const u = t % 10;
      return u < 4.8 ? 0 : u < 5.8 ? (u - 4.8) * 0.99 : u < 8.6 ? 1 : Math.max(0, 1 - (u - 8.6) / 1.2) * 0.99;
    },
    show: (k) => {
      C.userData.shutter.userData.swing(k);
      C.userData.watcher.visible = k > 0.55;
    },
    line: "A shot! Dust jumps beside you. You run back to cover.",
  };
  point(Q, "well", -6.5, 1.9, "the well");
  point(Q, "wall", 13, 11.4, "the long wall by the road");
  /* a lamp in the hall window: lit at dusk */
  const glowWin = box(0.7, 0.9, 0.04, new THREE.MeshBasicMaterial({ color: 0xffb65a }), -3, 1.6 - 0, -5.2 + 0.0, Q.group);
  glowWin.userData.noBatch = true;
  glowWin.userData.noAudit = true;
  glowWin.visible = false;
  /* people. Juba draws water at dusk; in the morning John Callendar stands at the long wall with Sampson. */
  person(Q, "juba", "juba", -8.2, 1.7, face(-8.2, 1.7, -6.5, 0.2), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-6.5, 0.2] });
  person(Q, "carter", "carter", 13.2, 12.4, face(13.2, 12.4, 15, 11.4), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "callendar", "callendar", 9.8, 11.6, face(9.8, 11.6, 0, -5), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [5, 8] });
  /* the step decides the hour: dusk for the walk to the well, morning for the warrant */
  Q.enter = (stage) => {
    const day = stage >= 40;
    Q.light = day ? DAYL : DUSK;
    Q.beds = day ? { wind: 0.05, bird: 0.1 } : { wind: 0.07, owl: 0.5 };
    glowWin.visible = !day;
    C.userData.shutter.userData.swing(0);
    C.userData.watcher.visible = false;
  };
  /* the morning of the warrant, as a camera scene: Callendar walks up the track; the window opens; the camera turns to the hills at the shot */
  let cal = null,
    home = null;
  Q.films.warrant = (t, Q) => {
    cal = cal || Q.people.find((n) => n.id === "callendar");
    if (!cal) return;
    if (t < 0) {
      if (home) {
        cal.x = home[0];
        cal.z = home[1];
        cal.m.position.set(cal.x, 0, cal.z);
        cal.m.rotation.y = home[2];
        cal.m.visible = home[3];
        cal.ctl.rest();
      }
      home = null;
      C.userData.shutter.userData.swing(0);
      C.userData.watcher.visible = false;
      return;
    }
    if (!home) {
      home = [cal.x, cal.z, cal.m.rotation.y, cal.m.visible];
      cal.m.visible = true;
      cal.ctl.play("Walk");
    }
    const path = [[9.8, 11.6], [-6.5, 11.6], [-6.5, 4.2]],
      k = Math.min(1, Math.max(0, (t - 2) / 16)),
      L = [16.3, 7.4],
      d = k * (L[0] + L[1]),
      a = d < L[0] ? 0 : 1,
      u = a ? (d - L[0]) / L[1] : d / L[0],
      x = path[a][0] + (path[a + 1][0] - path[a][0]) * u,
      z = path[a][1] + (path[a + 1][1] - path[a][1]) * u;
    cal.x = x;
    cal.z = z;
    cal.m.position.set(x, 0, z);
    cal.m.rotation.y = a ? Math.PI : -Math.PI / 2;
    if (k >= 1 && cal.walking !== false) {
      cal.walking = false;
      cal.ctl.play("IdleM");
    } else if (k < 1) cal.walking = true;
    const open = Math.min(1, Math.max(0, (t - 19) / 2));
    C.userData.shutter.userData.swing(open);
    C.userData.watcher.visible = open > 0.55;
  };
  Q.keepOff = [{ pts: [[15, 11.4], [-6.5, 11.6], [-6.5, 1.9]], w: 1.4 }];
  return Q;
}

/* ---------- 3. The hall of the castle, after he ran: what the house held ---------- */
function hall() {
  const Q = base("hall", [-5.2, -3.4, 5.2, 3.4], [3.6, 2.2, Math.PI / 4]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.mood = "sad";
  Q.beds = { room: 0.06, wind: 0.02 };
  Q.light = { top: 0x30343a, hor: 0x5a5448, fog: [0x1c1a18, 30, 90], sun: [0xffe6c0, 0.5, 10, 20, 10], hemi: [0xffe9cc, 0x4a3e34, 1.5], fill: 3.2 };
  Q.view = { pos: [4.4, 1.9, 2.8], look: [-2, 1.0, -1.5] };
  const stone = std(T.stone(W.LIME, [5, 2]), 1),
    floor = std(T.plank([104, 80, 56], 8, [3, 2]), 0.95);
  const rm = W.room({ x0: -5.5, z0: -3.7, x1: 5.5, z1: 3.7, h: 3, floor });
  Q.group.add(rm);
  W.wallRun(Q.group, [-5.5, -3.7, 5.5, -3.7], 3, stone, [{ at: 2.5, w: 0.5, h: 0.9, sill: 1.2 }, { at: 8.5, w: 0.5, h: 0.9, sill: 1.2 }], 0.5);
  W.wallRun(Q.group, [5.5, 3.7, -5.5, 3.7], 3, stone, [], 0.5);
  W.wallRun(Q.group, [-5.5, 3.7, -5.5, -3.7], 3, stone, [], 0.5);
  W.wallRun(Q.group, [5.5, -3.7, 5.5, 3.7], 3, stone, [], 0.5);
  for (const x of [-3, 3]) box(0.5, 0.9, 0.04, new THREE.MeshBasicMaterial({ color: 0xbfc8c4 }), x, 1.65, -3.93, Q.group);   /* daylight in the two slit windows */
  Q.walls.push([-5.6, -4, 5.6, -3.4], [-5.6, 3.4, 5.6, 4], [-5.6, -4, -5.2, 4], [5.2, -4, 5.6, 4]);
  /* the front door, shut: you are inside with the searchers */
  add(Q, W.makeDoor({ w: 1.15, h: 2.15, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "ring" }), 0, 3.44, 0, Math.PI);
  /* the long table, with a candle; the strongbox on it */
  solid1(Q, P.table(2.6, 1.0, 0.78), -1.2, -1.4, 2.7, 1.1);
  const cd = add(Q, W.candle(true), -0.3, -1.6, 0.81);
  const box1 = W.chest(0.7, 0.4, 0.36);
  add(Q, box1, -1.7, -1.4, 0.81);
  /* the watches in the box: forty-three were found in the house */
  const watches = grp();
  for (let i = 0; i < 43; i++) {
    const w = P.watch(i % 3 === 0);
    w.position.set(-0.27 + (i % 9) * 0.068, 0.02 + Math.floor(i / 9) * 0.004, -0.13 + Math.floor(i / 9) * 0.062);
    w.rotation.y = (i * 2.4) % 6.28;
    watches.add(w);
  }
  watches.position.set(-1.7, 0.81 + 0.2, -1.4);
  watches.traverse((o) => (o.userData.noBatch = true));
  watches.visible = false;
  Q.group.add(watches);
  Q.reveal.watches = (seen) => {
    box1.userData.open(seen ? 1 : 0);
    watches.visible = seen;
  };
  for (const [x, z, ry] of [[-2.2, -0.5, Math.PI], [-0.2, -0.5, Math.PI], [-1.2, -2.3, 0]]) add(Q, W.chair(), x, z, 0, ry);
  wall(Q, -1.2, -0.5, 2.6, 0.5);
  wall(Q, -1.2, -2.3, 0.6, 0.5);
  /* the west wall: coats on pegs, far too many for one man; a cloth hangs over them until you draw it back */
  const coats = [0x5a3a2a, 0x2f3a4a, 0x6a5a3a, 0x3a2a2a, 0x4a5a3a, 0x7a2f2a];
  coats.forEach((c, i) => {
    const hc = W.hungCoat(c);
    add(Q, hc, -5.22, -2.4 + i * 0.95, 0, Math.PI / 2);
  });
  const sheet = box(0.06, 1.7, 5.6, W.WM.linen, -5.08, 1.05, 0, Q.group);
  sheet.userData.noBatch = true;
  const rail = box(0.05, 0.05, 5.8, W.WM.woodDark, -5.1, 1.93, 0, Q.group);
  Q.reveal.coats = (seen) => {
    sheet.scale.z = seen ? 0.12 : 1;
    sheet.position.z = seen ? 2.5 : 0;
  };
  /* the east wall: a gun rack with long guns, and a shelf */
  const rack = grp();
  box(0.08, 1.5, 1.5, W.WM.woodDark, 0, 1.2, 0, rack);
  for (let i = 0; i < 4; i++) {
    const g = P.musket();
    g.rotation.x = -Math.PI / 2;
    g.position.set(-0.08, 0.72, -0.5 + i * 0.34);
    rack.add(g);
  }
  add(Q, rack, 5.2, -1.6);
  solid1(Q, W.chest(1.1, 0.55, 0.55), 4.5, 1.6, 1.2, 0.7, -Math.PI / 2);
  solid1(Q, barrel(), -4.5, 2.7, 0.7, 0.7);
  /* the stair to the upper floor, against the north wall (you do not go up) */
  for (let i = 0; i < 8; i++) box(0.9, 0.2, 0.3, W.WM.woodDark, 3.6 + 0, 0.1 + i * 0.36, -3.3 + 0.0 - 0, Q.group).position.set(1.6 + i * 0.32, 0.1 + i * 0.36, -3.0);
  box(2.9, 0.2, 0.08, W.WM.woodDark, 2.75, 1.3, -3.4, Q.group).rotation.z = 0.845;   /* the stair's string, fixed to the wall */
  wall(Q, 2.9, -3.0, 3.0, 0.9);
  /* people: the captain at the table, his man counting; Juba and Cudjoe wait by the door */
  person(Q, "officer", "officer", 0.9, -0.4, face(0.9, -0.4, -1.2, -1.4), { kind: "watch", at: [-1.7, -1.4], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "juba", "juba", 2.4, 2.4, face(2.4, 2.4, 0, 0), { kind: "watch", at: [0, 0], idles: ["Idle"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cudjoe", "cudjoe", 3.6, 0.6, face(3.6, 0.6, 0, 0), { kind: "watch", at: [0, 0], idles: ["OldIdle"], react: ["HeadTurn", "Nod"], every: [6, 10] });
  crowd(Q, "hx_townman", -3.4, 0.9, face(-3.4, 0.9, -5.2, 0), { kind: "work", clips: ["IdleM", "Nod", "HeadTurn"], work: [4, 8], face: [-5.2, 0.5] });
  Q.props.candle = cd;
  Q.keepOff = [{ at: [-1.7, -0.2], r: 0.9 }, { at: [-4.2, 0], r: 0.9 }];
  return Q;
}

/* ---------- 4. The sinkhole in the hills behind the castle ---------- */
function hole() {
  const Q = base("hole", [-13, -3, 13, 13], [9, 10.5, Math.PI / 4]);
  Q.floor = "grass";
  Q.mood = "sad";
  Q.beds = { wind: 0.09, bird: 0.03 };
  Q.light = { top: 0x6f7f86, hor: 0xb9b8a8, fog: [0xa4a79a, 30, 260], sun: [0xe8e0cc, 1.3, 20, 40, 20], hemi: [0xdfe4dc, 0x6a6a54, 2.3] };
  Q.view = { pos: [10, 3.2, 12], look: [0, 0, -6] };
  ground(Q, std(T.grass([60, 60], [110, 116, 80])), 700);
  hills(Q, 14);
  /* the mouth of the hole: nobody walks nearer than its rim of rock */
  const R = 5;
  /* the ground is cut away over the hole with a dark disc just above the grass, and the shaft below it */
  const hole = W.sinkhole(R, 4);
  add(Q, hole, 0, -9);
  const mouth = mesh(new THREE.CircleGeometry(R, 28), new THREE.MeshBasicMaterial({ color: 0x030403 }), 0, 0.03, -9, Q.group);
  mouth.rotation.x = -Math.PI / 2;
  mouth.name = "terrain";
  wall(Q, 0, -9, 2 * R + 2.6, 2 * R + 2.6);
  for (const [x, z, h, s] of [[-9.5, -1, 8, 21], [9.8, 0.5, 7, 22], [-11, 8, 6.5, 23], [3.5, 12.4, 6, 24]]) solid1(Q, tree(h, s, 1), x, z, 0.9, 0.9);
  for (const [x, z, s] of [[-6, 3.2, 1.2], [6.8, 5.6, 1.0], [-3, 9.5, 0.9], [11.5, 7.5, 1.1]]) solid1(Q, W.rocks(s, x * 5 + 9, 3), x, z, s * 1.5, s * 1.3);
  for (const [x, z, s] of [[-12, 3, 1.1], [1, 6.8, 0.8], [12, 11.5, 1.2], [-7.5, 11.5, 1]]) solid1(Q, W.scrub(x * 3 + 11, s), x, z, 0.5, 0.5);
  scatter(Q.group, (i) => tree(6 + (i % 4), i + 70, 1), 22, [-60, -60, 60, -18], [], 23);
  scatter(Q.group, (i) => W.rocks(0.8 + (i % 3) * 0.4, i + 80, 3), 16, [-50, 15, 50, 50], [], 29);
  /* loose stones by the path: one to drop */
  const pile = W.rocks(0.5, 31, 4);
  solid1(Q, pile, 5.2, 8.6, 0.9, 0.8);
  point(Q, "edge", 0, -1.2, "the edge");
  person(Q, "cudjoe", "cudjoe", -2.6, -1.4, face(-2.6, -1.4, 0, -9), { kind: "watch", at: [0, -9], idles: ["OldIdle"], react: ["HeadTurn"], every: [8, 12], stay: true });
  person(Q, "officer", "officer", 3.4, 0.4, face(3.4, 0.4, 0, -9), { kind: "watch", at: [0, -9], idles: ["IdleM"], react: ["HeadTurn"], every: [7, 11], stay: true });
  Q.keepOff = [{ at: [0, -1.2], r: 1.2 }, { at: [5.2, 7.4], r: 1 }];
  return Q;
}

/* ---------- 5. Spanish Town, the capital, March 1773 ---------- */
function town() {
  const Q = base("town", [-17, -4.2, 17, 12], [12, 9, Math.PI / 3]);
  Q.floor = "stone";
  Q.beds = { crowd: 0.07, wind: 0.02, bird: 0.06 };
  Q.light = { top: 0x7fb0c8, hor: 0xeadbb4, fog: [0xdcd6bd, 90, 480], sun: [0xfff0c8, 2.3, 30, 50, 30], hemi: [0xfff4dc, 0x9a8e6a, 2.5] };
  Q.view = { pos: [13, 2.6, 11], look: [-2, 3, -6] };
  ground(Q, std(T.dirt([40, 40], [188, 172, 140])), 500);
  const far = hillRing(320, 14, 34, { seed: 21, base: [0.36, 0.42, 0.3] });
  far.traverse((o) => (o.userData.far = true));
  Q.group.add(far);
  /* the public building on the square: red brick, an arcade of round arches below, a long timber gallery above (see the game's doc) */
  const brick = std(T.stone([156, 84, 62], [12, 4]), 1),
    bld = grp();
  box(40, 8.4, 9, brick, 0, 4.2, -4.5, bld);
  for (let i = 0; i < 9; i++) {
    const x = -18 + i * 4.5;
    box(0.8, 3.6, 0.8, std(T.stone([170, 96, 72], [1, 3]), 1), x, 1.8, 0.4, bld);
    if (i < 8) {
      const arch = mesh(new THREE.TorusGeometry(1.85, 0.4, 6, 14, Math.PI), std(T.stone([170, 96, 72], [3, 1]), 1), x + 2.25, 3.2, 0.4, bld);
      box(3.7, 0.9, 0.8, brick, x + 2.25, 4.7, 0.4, bld);
    }
  }
  box(40, 0.3, 2.2, W.WM.plaster, 0, 5.3, 0.3, bld);   /* the gallery floor */
  for (let i = 0; i < 17; i++) box(0.14, 2.6, 0.14, W.WM.plaster, -19.6 + i * 2.45, 6.7, 1.2, bld);
  box(40, 0.1, 0.1, W.WM.plaster, 0, 6.35, 1.2, bld);
  box(41, 0.3, 11.6, W.WM.shingle, 0, 8.5, -3.6, bld);
  const rf = W.hipRoof(41, 11.6, 2.4, 0.2);
  rf.position.set(0, 8.65, -3.6);
  bld.add(rf);
  box(40, 0.1, 9, W.WM.dark, 0, 0.06, -4.4, bld);
  add(Q, bld, 0, -5.4);
  wall(Q, 0, -5.4, 40.6, 2.2);
  for (let i = 0; i < 9; i++) wall(Q, -18 + i * 4.5, -5.0, 0.9, 0.9);
  /* the court door under the arcade, and the notice nailed beside it */
  add(Q, W.makeDoor({ w: 1.5, h: 2.5, kind: "six", leaves: 2, color: 0x2f3b33, frame: 0xe2d9c2, handle: "knob" }), -2.25, -5.39, 0, 0);
  const board = grp();
  box(1.0, 1.2, 0.05, W.WM.woodDark, 0, 0, 0, board);
  const paper = P.label("THE KING against LEWIS HUTCHINSON", 0.84, 0.3, "#e8ddc4");
  paper.position.set(0, 0.3, 0.03);
  board.add(paper);
  const paper2 = plane(0.84, 0.62, solid(0xe8ddc4, 1), 0, -0.2, 0.03, board);
  board.traverse((o) => (o.userData.noBatch = true));
  add(Q, board, 2.25, -5.37, 1.6);
  const seal = cyl(0.05, 0.05, 0.012, solid(0x9a1f1a, 0.5), 2.25 + 0.3, 1.2, -5.33, Q.group, 10);
  seal.rotation.x = Math.PI / 2;
  seal.userData.noBatch = true;
  seal.visible = false;
  Q.reveal.notice = (seen) => (seal.visible = seen);   /* the clerk's seal goes on once it has been read out */
  /* the square: a paved walk before the arcade, shade trees, benches, a water cart */
  strip(Q, 44, 3.2, std(T.stone([170, 164, 150], [14, 1]), 1), 0, -3.2, 0.014);
  for (const [x, z, h, s] of [[-12, 4.5, 7, 41], [11.5, 3.2, 7.5, 42], [-3, 9.6, 6, 43]]) solid1(Q, tree(h, s, 1), x, z, 0.9, 0.9);
  for (const [x, z, ry] of [[-10.6, 2.4, 0.3], [9.6, 1.2, -0.3]]) solid1(Q, W.bench(2), x, z, 2.1, 0.5, ry);
  solid1(Q, cart(2.6, 1.4), -14, 8.6, 3.0, 1.9, 0.4);
  solid1(Q, barrel(), 15.6, 6.4, 0.7, 0.7);
  solid1(Q, barrel(), 15.8, 7.3, 0.7, 0.7);
  /* houses on the other sides of the square, far enough to be scenery */
  for (const [x, z, w, c, ry] of [[-34, 6, 14, [196, 170, 130], Math.PI / 2], [34, 4, 16, [176, 150, 120], -Math.PI / 2], [-10, 30, 18, [200, 184, 150], Math.PI], [14, 31, 14, [182, 150, 128], Math.PI]]) {
    const h = grp();
    box(w, 6.4, 8, std(T.plaster(c, [3, 1]), 1), 0, 3.2, 0, h);
    const r = W.hipRoof(w, 8, 2, 0.4);
    r.position.y = 6.4;
    h.add(r);
    for (let i = 0; i < Math.floor(w / 3.2); i++) for (const y of [1.6, 4.4]) box(0.9, 1.4, 0.06, W.WM.dark, -w / 2 + 1.8 + i * 3.2, y, 4.02, h);
    add(Q, h, x, z, 0, ry);
  }
  /* the gallows, far across the square, seen only in the last scene and only as a shape against the dawn */
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
  add(Q, gal, 26, 22, 0, -0.7);
  const DAWN = { top: 0x39486a, hor: 0xe7a36a, stars: 0.12, fog: [0xb89a86, 50, 420], sun: [0xffb070, 1.3, 60, 12, 40], hemi: [0xd9c4c8, 0x6a5a4c, 1.9], fill: 1.6 };
  const DAYL = Q.light;
  Q.props.gallows = gal;
  Q.props.dawn = DAWN;
  Q.props.day = DAYL;
  let dawn = false;
  Q.films.morning = (t) => {
    if (t >= 0 === dawn) return;
    dawn = t >= 0;
    gal.visible = dawn;
    Q.light = dawn ? DAWN : DAYL;
    Q.relight?.();
  };
  /* people */
  person(Q, "clerk", "clerk", -1.2, -2.6, face(-1.2, -2.6, 2, 2), { kind: "watch", at: [2.25, -5], idles: ["IdleM"], react: ["HeadTurn", "Nod"], every: [5, 9] }, { held: "ledger" });
  person(Q, "hutton", "hutton", 9.4, 2.4, face(9.4, 2.4, 0, 0), { kind: "watch", at: [0, -5], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
  person(Q, "cubba", "cubba", 5.4, 7.2, face(5.4, 7.2, 0, -5), { kind: "watch", at: [0, -5], idles: ["OldIdle"], react: ["HeadTurn"], every: [6, 10] });
  crowd(Q, "hx_townman", -6.4, 3.2, 0, { kind: "chat", group: "a", at: [-6, 3.6] });
  crowd(Q, "hx_townwoman", -5.4, 4.2, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_man", -6.9, 4.4, 0, { kind: "chat", group: "a" });
  crowd(Q, "hx_woman", 2.6, 5.2, 0, { kind: "wander", area: [-2, 3, 8, 10.5], pause: [3, 7] });
  crowd(Q, "hx_townman", 13.5, -0.2, 0, { kind: "wander", pts: [[13.5, -0.2], [8, -0.6], [-9, 0.2], [-14, 1.2]], pause: [2, 5] });
  crowd(Q, "hx_townwoman", -13.4, 6.2, face(-13.4, 6.2, -14, 8.6), { kind: "work", clips: ["Idle", "PickUp", "WipeSweat"], work: [5, 9], face: [-14, 8.6] });
  crowd(Q, "hx_man", 14.4, 5.6, face(14.4, 5.6, 15.7, 6.8), { kind: "work", clips: ["IdleM", "PickUp", "WipeSweat"], work: [5, 9], face: [15.7, 6.8] });
  point(Q, "notice", 2.25, -3.4, "the notice");
  Q.keepOff = [{ at: [2.25, -3.4], r: 1.1 }, { at: [-1.2, -1.2], r: 1 }, { pts: [[12, 9], [2, -2.6]], w: 1.2 }];
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
