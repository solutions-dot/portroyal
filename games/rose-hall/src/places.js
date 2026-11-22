/* The four places of the story (six chapters). What follows a source, and what is a general picture, is in docs/games/rose-hall.md ("Places").
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls, what the story changes in it
   (Q.reveal, Q.enter) and its part in a camera scene (Q.films).
   Story people: person(). Background people: crowd(), each a body made for the year and the place (tools/rose-hall/people). */
import * as THREE from "three";
import { T, cv, std, solid, flat, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { tree, mule, cart, barrel, scatter, surveyPole } from "./period-props.js";
import * as P from "./props.js";
import * as W from "./world.js";
import * as R from "./rosehall.js";
import { palm, bush, flowers } from "./period-props.js";
import { follow, goTo } from "../../../engine/follow.js";
import { createSea } from "../../../engine/sea.js";
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
const DUST = [186, 168, 132],
  DRY = [150, 144, 96];

/* ---------- shared by the places ---------- */
/* the trim of a room along one wall face: a white wainscot with its rail and skirting (broken at doorways: holes, as [from, to] along the
   wall) and a cornice under the ceiling. The wall runs along x at z = c (axis "z"), or along z at x = c (axis "x"); `into` (+1 or -1) is
   the side the room is on. */
function lining(G, a, b, c, axis, into, H, holes = []) {
  const seg = (s, e, y, h, t, m) => {
    if (e - s < 0.02) return;
    const off = c + (into * t) / 2;
    axis === "z" ? box(e - s, h, t, m, (s + e) / 2, y, off, G) : box(t, h, e - s, m, off, y, (s + e) / 2, G);
  };
  let s = a;
  const parts = (s, e) => {
    seg(s, e, 0.52, 0.86, 0.03, R.WHITE);
    seg(s, e, 0.975, 0.06, 0.07, R.WHITE);
    seg(s, e, 0.09, 0.18, 0.05, R.WHITE);
  };
  for (const [h0, h1] of holes.slice().sort((p, q) => p[0] - q[0])) {
    parts(s, h0);
    s = h1;
  }
  parts(s, b);
  seg(a, b, H - 0.1, 0.2, 0.14, R.WHITE);
  seg(a, b, H - 0.27, 0.08, 0.06, R.WHITE);
}
/* Where the story people stand in each step, and who walks with you. spots: { id: { stage: [x, z, lookAtX, lookAtZ] } } (the spot holds
   from that step until a later one); with: { id: [first, last] } the steps in which that person follows you (engine/follow.js).
   Coming from the step before, a person walks to the new spot (goTo); arriving any other way (a chapter chosen, a saved game) they are
   simply there. */
function staging(Q, spots, withYou = {}) {
  let last = null;
  const put = (n, x, z, ry) => {
    n.x = x;
    n.z = z;
    n.m.position.set(x, n.ground || 0, z);
    n.m.rotation.y = ry;
  };
  return (stage) => {
    const stepped = last !== null && stage > last && stage - last <= 1;
    last = stage;
    for (const n of Q.people) {
      const w = withYou[n.id];
      if (w && stage >= w[0] && stage <= w[1] && n.m.visible) {
        Q.storyLife.hold(n, true);
        follow(n, { gap: 1.4, space: 0.85, side: 0.6, far: 9 });
        continue;
      }
      const tbl = spots[n.id];
      if (!tbl) continue;
      const key = Math.max(...Object.keys(tbl).map(Number).filter((k) => k <= stage), -1);
      if (key < 0) continue;
      const [x, z, lx, lz] = tbl[key],
        ry = face(x, z, lx, lz);
      if (Math.hypot(n.x - x, n.z - z) < 0.3) continue;
      if (stepped && n.m.visible) {
        Q.storyLife.hold(n, true);
        goTo(n, x, z, { face: ry, speed: 1.25, done: () => Q.storyLife.hold(n, false) });
      } else put(n, x, z, ry);
    }
  };
}
/* a small card set beside a thing once you have looked at it: LEGEND or RECORD */
function tagAt(Q, kind, x, y, z, ry = 0, s = 1) {
  const t = R.tag(kind, s);
  t.position.set(x, y, z);
  t.rotation.y = ry;
  Q.group.add(t);
  return t;
}
/* Looks are close-up actions (owner rule 13, engine/lookshot.js): Q.reveal[id](k) takes k from 0 (as found) to 1 (changed) and is called
   every frame while the camera watches; true and false still mean 1 and 0 (restoring a place, engine/audit-reveal.js). */
const kOf = (v) => (v === true ? 1 : v === false || v == null ? 0 : Math.max(0, Math.min(1, +v || 0))),
  smooth = (k) => k * k * (3 - 2 * k);
/* the LEGEND or RECORD card is set down in its place */
function drop(t, v) {
  const k = kOf(v);
  if (t.userData.y0 === undefined) t.userData.y0 = t.position.y;
  t.visible = k > 0;
  t.position.y = t.userData.y0 + (1 - smooth(k)) * 0.35;
}
/* a candle's light carried across something: it shows only while the thing is being looked at, gone at both ends */
function sweep(g, v, a, b, peak = 0.6) {
  const k = kOf(v);
  g.visible = k > 0 && k < 1;
  g.position.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
  g.material.opacity = peak * Math.sin(k * Math.PI);
}
function glowAt(Q, r, ry = 0, flatDown = false) {
  const g = R.glowPool(r, 0);
  if (flatDown) g.rotation.x = -Math.PI / 2;
  else g.rotation.y = ry;
  g.visible = false;
  Q.group.add(g);
  return g;
}
/* the guide points at the thing, once, while you look (not when a place is put back as found) */
function guidePoints(Q, v, mem) {
  const k = kOf(v);
  if (k <= 0 || k >= 1) {
    if (k <= 0) mem.done = false;
    return;
  }
  if (mem.done) return;
  mem.done = true;
  const n = Q.people.find((p) => p.id === "guide" && p.m.visible);
  if (n) n.ctl.play("Point", true);
}

/* a flat tiled floor drawn in code: two colours of square */
const TILES = {};
function tiles(a, b, repeat) {
  const k = a + b + repeat;
  return (
    TILES[k] ||
    (TILES[k] = std(
      cv(64, 64, (x) => {
        x.fillStyle = a;
        x.fillRect(0, 0, 64, 64);
        x.fillStyle = b;
        x.fillRect(0, 0, 32, 32);
        x.fillRect(32, 32, 32, 32);
        x.strokeStyle = "rgba(40,40,36,0.25)";
        x.strokeRect(0.5, 0.5, 32, 32);
        x.strokeRect(32.5, 32.5, 32, 32);
        const d = x.getImageData(0, 0, 64, 64);
        for (let i = 0; i < d.data.length; i += 4) {
          const n = (Math.random() - 0.5) * 12;
          d.data[i] += n;
          d.data[i + 1] += n;
          d.data[i + 2] += n;
        }
        x.putImageData(d, 0, 0);
      }, repeat),
      0.7,
    ))
  );
}

/* ---------- 1 and 2. Rose Hall great house on the night tour: the entrance hall, the eating-room and the drawing-room ----------
   Hakewill, 1825: "A double flight of stone steps leads to an open portico, giving access to the entrance hall; on the left of which is
   the eating-room, and on the right the drawing-room"; "The principal staircase, in the body of the house, is a specimen of joinery in
   mahogany". You come in from the portico on the sea side (north, -z) and face the stair: the eating-room is on your left (+x), the
   drawing-room on your right (-x). The furniture is a general picture of a planter's house of about 1820. */
function house({ phone } = {}) {
  const Q = base("house", [-14.6, -4.6, 14.6, 4.6], [0, -3.3, Math.PI]);
  Q.floor = "wood";
  Q.indoor = true;
  Q.beds = { room: 0.05, wind: 0.04, owl: 0.3, sea: 0.02 };
  const LIT = { top: 0x10131c, hor: 0x2a2630, stars: 0.3, fog: [0x0c0b10, 22, 80], sun: [0xffd9a0, 0.22, 6, 10, 6], hemi: [0xffdcae, 0x3a2e30, 1.0], fill: 2.2 },
    DARK = { ...LIT, hemi: [0xffcf9a, 0x241c20, 0.42], fill: 1.0, sun: [0xffd9a0, 0.08, 6, 10, 6] };
  Q.light = { ...LIT };
  Q.view = { pos: [2.9, 1.7, -4.2], look: [-1.2, 1.5, 2.5] };
  const G = Q.group,
    H = 4.4,
    mH = solid(0xd6cba8, 1),
    mE = solid(0x8aa290, 1),
    mD = solid(0xc2cdc6, 1),
    floor = std(T.plank([104, 58, 38], 10, [10, 4]), 0.55);
  box(30.6, 0.06, 10.6, floor, 0, -0.03, 0, G).name = "terrain";
  box(30.6, 0.1, 10.6, solid(0xe6dfcc, 1), 0, H + 0.05, 0, G);
  const WIN = { w: 1.3, h: 2.6, sill: 0.95 };
  /* the outer walls, each room in its own colour */
  W.wallRun(G, [-15.2, -5, -4, -5], H, mD, [2.7, 5.7, 8.7].map((at) => ({ at, ...WIN })), 0.4);
  W.wallRun(G, [-4, -5, 4, -5], H, mH, [1.3, 6.7].map((at) => ({ at, w: 0.9, h: 2.6, sill: 0.95 })), 0.4);
  W.wallRun(G, [4, -5, 15.2, -5], H, mE, [2.5, 5.5, 8.5].map((at) => ({ at, ...WIN })), 0.4);
  W.wallRun(G, [-15.2, 5, -4, 5], H, mD, [], 0.4);
  W.wallRun(G, [-4, 5, 4, 5], H, mH, [], 0.4);
  W.wallRun(G, [4, 5, 15.2, 5], H, mE, [3.5, 8].map((at) => ({ at, ...WIN })), 0.4);
  W.wallRun(G, [-15, -5.2, -15, 5.2], H, mD, [], 0.4);
  W.wallRun(G, [15, -5.2, 15, 5.2], H, mE, [], 0.4);
  /* the two inner walls, a wide doorway in each */
  const DOOR = [{ at: 5, w: 2.2, h: 3.0 }];
  W.wallRun(G, [-3.9, -5, -3.9, 5], H, mH, DOOR, 0.2);
  W.wallRun(G, [-4.1, -5, -4.1, 5], H, mD, DOOR, 0.2);
  W.wallRun(G, [3.9, -5, 3.9, 5], H, mH, DOOR, 0.2);
  W.wallRun(G, [4.1, -5, 4.1, 5], H, mE, DOOR, 0.2);
  for (const x of [-4, 4]) {
    for (const s of [-1, 1]) box(0.5, 3.0, 0.14, R.MAHOG, x, 1.5, s * 1.17, G);
    box(0.5, 0.16, 2.48, R.MAHOG, x, 3.08, 0, G);
    box(0.56, 0.06, 2.6, R.MAHOG_DARK, x, 3.19, 0, G);
    Q.walls.push([x - 0.3, -5, x + 0.3, -1.1], [x - 0.3, 1.1, x + 0.3, 5]);
  }
  /* windows: the sea and the moon to the north, dark hills to the south */
  for (const x of [-12.5, -9.5, -6.5, 6.5, 9.5, 12.5]) add(Q, R.sashWindow(1.3, 2.6, R.nightPane(true), { curtain: x < 0 ? 0x4f6a78 : 0x7a2f2a }), x, -4.8, 0.95);
  for (const x of [-2.7, 2.7]) add(Q, R.sashWindow(0.9, 2.6, R.nightPane(true), { drapes: false }), x, -4.8, 0.95);
  for (const x of [7.5, 12]) add(Q, R.sashWindow(1.3, 2.6, R.nightPane(false), { curtain: 0x7a2f2a }), x, 4.8, 0.95, Math.PI);
  /* wainscot, rails and cornices, room by room */
  lining(G, -3.8, 3.8, -4.8, "z", 1, H, [[-1.15, 1.15]]);
  lining(G, -3.8, 3.8, 4.8, "z", -1, H);
  lining(G, -4.8, 4.8, -3.8, "x", 1, H, [[-1.24, 1.24]]);
  lining(G, -4.8, 4.8, 3.8, "x", -1, H, [[-1.24, 1.24]]);
  lining(G, 4.2, 14.8, -4.8, "z", 1, H);
  lining(G, 4.2, 14.8, 4.8, "z", -1, H);
  lining(G, -4.8, 4.8, 4.2, "x", 1, H, [[-1.24, 1.24]]);
  lining(G, -4.8, 4.8, 14.8, "x", -1, H);
  lining(G, -14.8, -4.2, -4.8, "z", 1, H);
  box(10.6, 0.2, 0.14, R.WHITE, -9.5, H - 0.1, 4.73, G);   /* the south wall is left bare for the shadows: a cornice and a skirting only */
  box(10.6, 0.18, 0.05, R.WHITE, -9.5, 0.09, 4.775, G);
  lining(G, -4.8, 4.8, -4.2, "x", -1, H, [[-1.24, 1.24]]);
  lining(G, -4.8, 4.8, -14.8, "x", 1, H);

  /* --- the entrance hall --- */
  add(Q, W.makeDoor({ w: 1.9, h: 2.9, kind: "six", leaves: 2, color: 0x4a2418, frame: 0xe8e2d0, handle: "knob" }), 0, -4.79, 0, 0);
  const fan = mesh(new THREE.CircleGeometry(0.95, 14, 0, Math.PI), R.nightPane(true), 0, 3.0, -4.77, G);
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * Math.PI,
      bar = box(0.03, 0.95, 0.03, R.WHITE, Math.cos(a) * 0.47, 3.0 + Math.sin(a) * 0.47, -4.76, G);
    bar.rotation.z = a - Math.PI / 2;
  }
  box(2.1, 0.07, 0.08, R.WHITE, 0, 2.97, -4.76, G);
  /* the staircase: foot at z = 0.6, the landing against the south wall */
  const stair = R.grandStair({ W: 2.2, rise: 0.17, tread: 0.28, steps: 10, H });
  add(Q, stair, 0, 0.6);
  Q.walls.push([-2.5, 0.5, 2.5, 5]);
  for (const s of [-1, 1]) {
    const hole = plane(1.24, 3.2, flat(0x1c1612), s * 1.8, H - 0.004, 2.0, G);   /* where the upper flights go up out of sight */
    hole.rotation.x = Math.PI / 2;
  }
  const lw = plane(1.3, 1.9, R.nightPane(false), 0, 3.15, 4.79, G);
  lw.rotation.y = Math.PI;
  for (const s of [-1, 1]) box(0.07, 2.0, 0.06, R.WHITE, s * 0.68, 3.15, 4.77, G);
  box(1.5, 0.07, 0.06, R.WHITE, 0, 4.16, 4.77, G);
  box(1.56, 0.08, 0.12, R.WHITE, 0, 2.16, 4.75, G);
  add(Q, R.rug(3.4, 2.6, "#5a2428", "#c8b078"), 0, -2.2);
  add(Q, R.chandelier("h", 8, 0.55, 1.1), 0, -1.9, 3.1);
  cyl(0.5, 0.5, 0.03, R.WHITE, 0, H - 0.015, -1.9, G, 20);
  solid1(Q, R.longCaseClock(), -3.5, -2.9, 0.6, 0.5, Math.PI / 2);
  solid1(Q, R.roundTable(0.42, 0.74), 3.2, -3.9, 0.9, 0.9);
  add(Q, R.candelabrum("h", 3), 3.2, -3.9, 0.74);
  for (const z of [-2.4, 2.6]) solid1(Q, R.diningChair(0x7a2f2a), 3.42, z, 0.5, 0.5, -Math.PI / 2);
  solid1(Q, R.diningChair(0x7a2f2a), -3.42, 2.6, 0.5, 0.5, Math.PI / 2);
  for (const [x, z, ry] of [[-3.77, -1.7, Math.PI / 2], [3.77, 1.7, -Math.PI / 2], [-3.77, 1.7, Math.PI / 2], [3.77, -1.7, -Math.PI / 2]]) {
    add(Q, R.sconce("h"), x, z, 2.2, ry);
    const p = add(Q, R.glowPool(0.9, 0.5), x + Math.sign(-x) * 0.012, z, 2.3, ry);
    p.userData.set = "h";
  }
  /* today's tour: a rope across the foot of the stair, and a card that points upstairs */
  add(Q, R.ropeBarrier(2.5), 0, 0.3);
  wall(Q, 0, 0.3, 2.9, 0.34);
  solid1(Q, R.tourSign(["UPSTAIRS", "Annie's Bedroom"], 0.5, 0.3), 3.0, 0.75, 0.4, 0.4, Math.PI);
  const tStair = tagAt(Q, "RECORD", -0.8, 0.2, 0.74, Math.PI),
    tBed = tagAt(Q, "LEGEND", 3.0, 0.0, 0.3, Math.PI);   /* on the floor in front of the stand: a card on its top edge would float */
  const gStair = glowAt(Q, 0.8, Math.PI);
  Q.reveal.stair = (v) => {   /* a candle carried up the stair, its light climbing the wall at the landing */
    sweep(gStair, v, [0, 1.0, 4.74], [0, 3.6, 4.74]);
    drop(tStair, v);
  };
  Q.reveal.bedroom = (v) => {   /* the light goes on up the stair the card points to */
    sweep(gStair, v, [1.2, 2.2, 4.74], [1.8, 3.9, 4.74], 0.5);
    drop(tBed, v);
  };

  /* --- the eating-room, on the left of the hall --- */
  add(Q, R.rug(6.6, 3.6, "#3a4a3a", "#c8b078"), 9.5, 0.4);
  solid1(Q, R.diningTable(4.4, 1.25), 9.5, 0.4, 4.5, 1.35);
  add(Q, R.tableSetting(4.4, 1.25, 0.76, 4), 9.5, 0.4);
  for (const dx of [-1.25, 1.25]) add(Q, R.candelabrum("e", 3), 9.5 + dx, 0.4, 0.76);
  for (let i = 0; i < 4; i++) {
    const x = 7.85 + i * 1.1;
    add(Q, R.diningChair(), x, -0.65, 0, 0);
    add(Q, R.diningChair(), x, 1.45, 0, Math.PI);
  }
  add(Q, R.diningChair(), 12.25, 0.4, 0, -Math.PI / 2);
  Q.walls.push([7.5, -1.0, 11.5, 1.8], [11.6, 0.1, 12.6, 0.7]);
  add(Q, R.chandelier("e", 8, 0.6, 1.1), 9.5, 0.4, 3.1);
  cyl(0.5, 0.5, 0.03, R.WHITE, 9.5, H - 0.015, 0.4, G, 20);
  const tp = add(Q, R.glowPool(1.7, 0.4), 9.5, 0.4, 0.79);
  tp.rotation.x = -Math.PI / 2;
  tp.userData.set = "e";
  solid1(Q, R.sideboard(2.4, "e"), 9.75, 4.42, 2.5, 0.7, Math.PI);
  add(Q, R.giltMirror(1.3, 1.9), 14.78, 0, 2.3, -Math.PI / 2);
  for (const z of [-1.5, 1.5]) {
    add(Q, R.sconce("e"), 14.77, z, 2.1, -Math.PI / 2);
    const p = add(Q, R.glowPool(0.9, 0.5), 14.76, z, 2.2, -Math.PI / 2);
    p.userData.set = "e";
  }
  for (const x of [8, 11]) add(Q, R.sconce("e"), x, -4.77, 2.2);
  solid1(Q, R.roundTable(0.4, 0.72), 13.9, -3.7, 0.9, 0.9);
  add(Q, R.candlestick("e"), 13.9, -3.7, 0.72);
  solid1(Q, R.diningChair(), 5.0, 4.3, 0.5, 0.5, Math.PI);
  /* the cup the tour points at: a coffee cup and saucer at the head of the table, and the tour's card beside it */
  const cup = grp();
  cyl(0.07, 0.05, 0.012, solid(0xf0ece0, 0.4), 0, 0.006, 0, cup, 12);
  cup.add(R.at(R.lathe([[0.02, 0], [0.035, 0.01], [0.042, 0.055], [0.045, 0.06]], solid(0xf0ece0, 0.4), 10), 0, 0.012, 0));
  cyl(0.036, 0.036, 0.004, solid(0x2a1a10, 0.3), 0, 0.062, 0, cup, 10);
  add(Q, cup, 7.55, 0.4, 0.762);
  solid1(Q, R.tourSign(["THE COFFEE CUP", "of the first husband"], 0.5, 0.3), 6.7, -0.75, 0.4, 0.4, -Math.PI / 2);
  const tCup = tagAt(Q, "LEGEND", 7.7, 0.762, 0.72, -Math.PI / 2);
  Q.reveal.coffee = (v) => {   /* the cup is lifted a little, turned on its saucer and set down */
    const k = kOf(v);
    cup.position.y = 0.762 + Math.sin(k * Math.PI) * 0.06;
    cup.rotation.y = smooth(k) * Math.PI * 0.8;
    drop(tCup, v);
  };

  /* --- the drawing-room, on the right of the hall --- */
  add(Q, R.rug(6.4, 4.2, "#3a4a5a", "#d8c9a0"), -9.5, -0.9);
  add(Q, R.chandelier("d", 8, 0.6, 1.1), -9.5, -0.9, 3.1);
  cyl(0.5, 0.5, 0.03, R.WHITE, -9.5, H - 0.015, -0.9, G, 20);
  solid1(Q, R.sofa(2.0), -9.5, -4.2, 2.1, 0.8);
  solid1(Q, R.armchair(), -12.6, -3.9, 0.9, 0.9, 0.5);
  solid1(Q, R.armchair(), -6.3, -3.9, 0.9, 0.9, -0.5);
  solid1(Q, R.pianoforte(), -4.62, 3.0, 1.8, 0.75, -Math.PI / 2);
  wall(Q, -5.47, 2.7, 0.5, 0.5);
  add(Q, R.candlestick("d"), -4.6, 3.55, 0.85);
  add(Q, R.giltMirror(1.2, 1.9), -4.22, -2.9, 2.3, -Math.PI / 2);
  for (const z of [-4.0, -1.8]) add(Q, R.sconce("d"), -4.23, z, 2.1, -Math.PI / 2);
  solid1(Q, R.roundTable(0.36, 0.7), -13.9, -3.0, 0.8, 0.8);
  add(Q, R.candelabrum("d", 3), -13.9, -3.0, 0.7);
  /* the west wall: three tall paintings of men. Hope Waddell saw "three or four full-size pictures" in the empty house in 1830. */
  const pics = [];
  [[-2.7, "#2f3a4a", 1], [0, "#4a2a24", 2], [2.7, "#3a3a2a", 3]].forEach(([z, coat, seed]) => pics.push(add(Q, R.portrait(1.2, 2.1, coat, seed), -14.78, z, 2.2, Math.PI / 2)));
  const picGlow = [];
  for (const z of [-1.35, 1.35]) {
    add(Q, R.sconce("p"), -14.77, z, 2.0, Math.PI / 2);
    const p = add(Q, R.glowPool(1.3, 0.5), -14.76, z, 2.2, Math.PI / 2);
    picGlow.push(p);
  }
  const tPic = tagAt(Q, "RECORD", -14.5, 0.0, 0, Math.PI / 2, 1.6);
  /* the bare south wall, a small table and one candle: the tour's shadow theatre */
  solid1(Q, R.roundTable(0.4, 0.74), -9.5, 3.1, 0.9, 0.9);
  add(Q, R.candlestick("t", 0.2), -9.5, 3.1, 0.74);
  const tTheatre = tagAt(Q, "LEGEND", -9.2, 0.74, 3.0, Math.PI);
  const WALLZ = 4.795,
    shade = (kind, x, h, aspect, dz) => {
      const s = R.shadowShape(kind, h, aspect);
      s.position.set(x, 0, WALLZ - dz);
      s.rotation.y = Math.PI;
      G.add(s);
      return s;
    },
    SH = { lady: shade("lady", -12.2, 2.9, 0.5, 0.004), cup: shade("cup", -9.3, 2.5, 0.9, 0.008), bed: shade("bed", -9.0, 2.6, 1.15, 0.012), hat: shade("hat", -7.4, 3.0, 0.5, 0.016), tall: shade("tall", -9.6, 4.3, 0.62, 0.02) };
  const sets = R.flameSets(G);
  const pools = [];
  G.traverse((o) => o.userData.set && pools.push(o));
  let lamp = null;
  if (!phone) {
    lamp = new THREE.PointLight(0xffb060, 0, 11, 1.6);
    lamp.position.set(-9.5, 1.25, 3.0);
    G.add(lamp);
  }
  let snuffed = false,
    relit = false,
    picsSeen = false,
    filming = false;
  let picK = 0,
    snuffK = 0;
  const mix = (a, b, k) => a + (b - a) * k;
  const dress = () => {
    const dark = (snuffed && !relit) || filming,
      dim = dark ? 1 : relit ? 0 : snuffK;   /* part way through putting the candles out */
    sets.d.userData.on(dim < 0.6);
    sets.p.userData.on(picsSeen && dim < 0.3);
    for (const p of picGlow) {
      p.visible = picsSeen && !dark;
      p.material.opacity = 0.5 * picK;
    }
    for (const p of pics) {
      p.userData.show(picsSeen && !dark);
      p.userData.light?.(dark ? 0 : picK);
    }
    Object.assign(Q.light, dim >= 1 ? DARK : dim <= 0 ? LIT : { ...LIT, hemi: [LIT.hemi[0], LIT.hemi[1], mix(LIT.hemi[2], DARK.hemi[2], dim)], fill: mix(LIT.fill, DARK.fill, dim), sun: [LIT.sun[0], mix(LIT.sun[1], DARK.sun[1], dim), ...LIT.sun.slice(2)] });
    if (lamp) lamp.intensity = 9 * dim;
    Q.relight?.();
  };
  /* the hall window (Hakewill's sea view) and the drawing-room mirror the modern tours talk about */
  const tWin = tagAt(Q, "RECORD", -2.0, 0.0, -4.5, 0, 1.2),
    tMirror = tagAt(Q, "LEGEND", -4.4, 0.0, -2.0, -Math.PI / 2, 1.2);
  const gWin = glowAt(Q, 0.9, 0, true),
    gMirror = glowAt(Q, 0.45, -Math.PI / 2);
  Q.reveal.window = (v) => {   /* moonlight from the sea window slides across the floor as a cloud passes */
    sweep(gWin, v, [-3.6, 0.02, -3.6], [-1.8, 0.02, -3.4], 0.35);
    drop(tWin, v);
  };
  Q.reveal.mirror = (v) => {   /* your candle passes across the glass: only your own light looks back */
    sweep(gMirror, v, [-4.2, 2.3, -3.4], [-4.2, 2.3, -2.4], 0.7);
    drop(tMirror, v);
  };
  Q.reveal.portraits = (v) => {   /* the candle is held up and the three men come out of the dark */
    picK = kOf(v);
    picsSeen = picK > 0;
    drop(tPic, v);
    dress();
  };
  Q.reveal.snuff = (v) => {   /* the candles go out one set after another and the room falls dark */
    snuffK = kOf(v);
    snuffed = snuffK >= 1;
    dress();
  };
  dress();
  const ramp = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a))),
    span = (t, a, b, c, d) => ramp(t, a, b) * (1 - ramp(t, c, d));
  Q.films.legend = (t) => {
    if (t < 0) {
      for (const s of Object.values(SH)) s.userData.set(0);
      SH.tall.position.x = -9.6;
      tTheatre.visible = true;
      filming = false;
      dress();
      return;
    }
    if (!filming) {
      filming = true;
      dress();
    }
    const fl = Math.sin(t * 13.1) * 0.5 + Math.sin(t * 7.3 + 1) * 0.35 + Math.sin(t * 23.7 + 2) * 0.15;
    SH.lady.userData.set(span(t, 1, 3.5, 30.5, 32.5), fl);
    SH.lady.position.x = -12.2 + Math.sin(t * 0.5) * 0.12;
    SH.cup.userData.set(span(t, 8.5, 10.5, 13.5, 15.6), fl);
    SH.bed.userData.set(span(t, 16.5, 18.5, 21.5, 23.6), fl);
    SH.hat.userData.set(span(t, 24.5, 26.5, 29, 31), fl);
    SH.tall.userData.set(span(t, 33, 37, 45, 47.5), fl * 1.4);
    SH.tall.position.x = -10.6 + ramp(t, 39, 45) * 2.6;
    if (lamp) lamp.intensity = 9 + fl * 2.2;
  };
  Q.tickers.push((t) => {
    const k = 0.3 + Math.sin(t * 11) * 0.012 + Math.sin(t * 5.3) * 0.01;
    for (const s of Object.values(sets)) s.material.size = k;
    if (lamp && lamp.intensity && !filming) lamp.intensity = 9 + Math.sin(t * 9.1) * 0.8 + Math.sin(t * 4.7) * 0.6;
  });

  /* the people of the tour. Miss Bryan leads from room to room; Tia comes with you. */
  person(Q, "guide", "guide", -1.9, -1.2, face(-1.9, -1.2, 0, -3.3), { kind: "watch", at: [0, -3.3], idles: ["Idle"], react: ["HeadTurn", "Point"], every: [5, 9] }, { held: "lantern" });
  person(Q, "cousin", "cousin", 1.3, -2.6, face(1.3, -2.6, 0, 1), { kind: "watch", at: [0, 2], idles: ["Idle"], react: ["HeadTurn"], every: [4, 7] });
  crowd(Q, "rh_man", 2.0, -3.5, face(2.0, -3.5, 2.7, -4.8), { kind: "watch", at: [2.7, -4.8], react: ["HeadTurn", "Nod"], every: [5, 9] });
  crowd(Q, "rh_elder", 8.4, 3.2, face(8.4, 3.2, 9.75, 4.4), { kind: "watch", at: [9.75, 4.4], react: ["HeadTurn", "Nod"], every: [5, 9] });
  crowd(Q, "rh_woman", -12.3, -1.9, 0, { kind: "chat", group: "a", at: [-12.0, -1.6] });
  crowd(Q, "rh_youth", -11.5, -1.2, 0, { kind: "chat", group: "a" });
  Q.keepOff = [{ at: [0, -0.5], r: 1 }, { at: [3.0, -0.3], r: 0.9 }, { at: [6.6, 0.4], r: 0.9 }, { at: [-13.2, 0], r: 1 }, { at: [-9.5, 1.9], r: 1 }, { at: [-9.5, -1.4], r: 1 }, { at: [-2.7, -3.7], r: 0.8 }, { at: [-5.3, -2.9], r: 0.8 }];
  const stage = staging(
    Q,
    {
      guide: { 10: [-1.9, -1.2, 0, -3.3], 13: [5.6, 2.1, 7, 0.4], 15: [-12.4, 1.9, -9, 0], 20: [-6.9, 2.3, -9.5, -1] },
      cousin: { 10: [1.3, -2.6, 0, 1], 20: [-10.9, -0.6, -9.5, 4.8] },
    },
    { cousin: [10, 16] },
  );
  /* after the shadow show the guide lights the room again */
  Q.enter = (st) => {
    stage(st);
    relit = st >= 25;
    dress();
  };
  return Q;
}

/* ---------- 3. St James Parish Church, Montego Bay: the white monument ----------
   Begun in 1774 and built of dressed white limestone (ashlar); its chancel has a Venetian window, a tall round-headed light between two
   lower square-headed ones. Rosa Palmer's monument by John Bacon (1794) stands to the left of the altar. The nave, the roof, the pews
   and the other tablets are a general picture of a Georgian parish church (docs/games/rose-hall.md, "Places"). */
function church() {
  const Q = base("church", [-6.1, -10.6, 6.1, 8.6], [0, 7.2, 0]);
  Q.floor = "stone";
  Q.indoor = true;
  Q.beds = { room: 0.06, bird: 0.08, wind: 0.02 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.5, -10, 30, 6], hemi: [0xfff4dc, 0xa89c86, 2.4], fill: 1.2 };
  Q.view = { pos: [3.6, 2.0, 6.6], look: [-3.5, 2.4, -5] };
  const G = Q.group,
    H = 6.4,
    stone = R.ashlar(),
    WINS = [-5.6, -1.4, 2.8, 7.0].map((z) => ({ at: z + 11.2, w: 1.5, h: 3.4, sill: 1.7 }));
  box(13.4, 0.06, 20.6, tiles("#d8d2c0", "#8f8f8a", [9, 14]), 0, -0.03, -1, G).name = "terrain";
  W.wallRun(G, [-6.7, -11, 6.7, -11], H, stone, [{ at: 6.7, w: 1.8, h: 4.2, sill: 1.6 }, { at: 5.15, w: 0.9, h: 2.9, sill: 1.6 }, { at: 8.25, w: 0.9, h: 2.9, sill: 1.6 }], 0.4);
  W.wallRun(G, [-6.7, 9, 6.7, 9], H, stone, [], 0.4);
  W.wallRun(G, [-6.5, -11.2, -6.5, 9.2], H, stone, WINS, 0.4);
  W.wallRun(G, [6.5, -11.2, 6.5, 9.2], H, stone, WINS, 0.4);
  for (const w of WINS) {
    const z = w.at - 11.2;
    add(Q, R.archWindow(1.5, 3.4), 6.3, z, 1.7, -Math.PI / 2);
    add(Q, R.archWindow(1.5, 3.4), -6.3, z, 1.7, Math.PI / 2);
  }
  /* the Venetian window over the altar: a round-headed light between two square-headed ones, a cornice over the side lights */
  add(Q, R.archWindow(1.8, 4.2), 0, -10.8, 1.6);
  for (const s of [-1, 1]) {
    add(Q, R.sashWindow(0.9, 2.9, R.dayPane(), { drapes: false }), s * 1.55, -10.8, 1.6);
    box(1.2, 0.14, 0.16, solid(0xd8d0bc, 1), s * 1.55, 4.57, -10.72, G);
  }
  /* the roof: tie beams and trusses of dark timber, boards above */
  for (let z = -9; z <= 8; z += 3.4) add(Q, R.truss(12.56, 2.6), 0, z, H);
  for (const s of [-1, 1]) {
    const b = box(7.2, 0.08, 20.6, solid(0x6a4a34, 1), s * 3.3, H + 1.3, -1, G);
    b.rotation.z = -s * Math.atan2(2.6, 6.5);
  }
  for (const z of [-11, 9]) {
    const gable = new THREE.Shape();
    gable.moveTo(-6.7, 0);
    gable.lineTo(6.7, 0);
    gable.lineTo(0, 2.7);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(gable, { depth: 0.3, bevelEnabled: false }), solid(0xd6ceba, 1));
    m.position.set(0, H, z - 0.15);
    G.add(m);
  }
  add(Q, W.makeDoor({ w: 1.9, h: 3.0, kind: "panel", leaves: 2, color: 0x4a2418, frame: 0xd8d0bc, handle: "ring" }), 0, 8.79, 0, Math.PI);
  /* a red runner up the middle, dark pews either side */
  const run = plane(1.5, 14.6, solid(0x7a2226, 1), 0, 0.006, 0.4, G);
  run.rotation.x = -Math.PI / 2;
  run.name = "terrain";
  for (let i = 0; i < 9; i++) {
    const z = -4.6 + i * 1.3;
    for (const x of [-2.75, 2.75]) solid1(Q, R.pew(3.2), x, z, 3.3, 0.62, Math.PI);
  }
  /* the chancel: a rail, the holy table under the east window, flowers, the pulpit and the reading desk */
  for (const s of [-1, 1]) box(5.4, 0.07, 0.1, R.MAHOG, s * 3.5, 0.86, -7.6, G);   /* the rail, open in the middle */
  for (let i = 0; i < 31; i++) {
    if (Math.abs(-6 + i * 0.4) < 0.8) continue;
    const b = R.lathe([[0.03, 0], [0.04, 0.2], [0.02, 0.45], [0.035, 0.7], [0.03, 0.83]], R.MAHOG, 6);
    b.position.set(-6 + i * 0.4, 0, -7.6);
    G.add(b);
  }
  add(Q, R.altar("c"), 0, -10.1);
  for (const s of [-1, 1]) add(Q, R.flowerStand(s + 3), s * 2.2, -9.9);
  const carpet = plane(5, 2.6, solid(0x7a2226, 1), 0, 0.007, -9.2, G);
  carpet.rotation.x = -Math.PI / 2;
  carpet.name = "terrain";
  solid1(Q, R.pulpit(), 4.3, -6.3, 1.6, 2.2);
  solid1(Q, R.lectern(), -3.6, -6.4, 0.6, 0.6);
  box(0.36, 0.04, 0.28, solid(0x1a1512, 0.7), -3.6, 1.2, -6.36, G).rotation.x = 0.45;
  add(Q, R.hymnBoard(), 4.4, -10.78, 3.0);
  solid1(Q, R.font(), -4.6, 7.4, 1.0, 1.0);
  for (const [z, seed] of [[0.7, 1], [4.9, 2], [-3.5, 3]]) add(Q, R.tablet(0.8, 1.0, seed), 6.28, z, 2.6, -Math.PI / 2);
  for (const [z, seed] of [[0.7, 4], [4.9, 5], [-3.5, 6]]) add(Q, R.tablet(0.7, 0.9, seed), -6.28, z, 2.6, Math.PI / 2);
  const fans = [];
  for (const z of [-2.2, 4.6]) fans.push(add(Q, R.ceilingFan(0.5), 0, z, H - 0.1));
  Q.tickers.push((t) => fans.forEach((f) => f.userData.spin(t)));
  /* the monument, on the east wall to the left of the altar, and the church's own note about it on a small desk */
  add(Q, R.rosaMonument(), -4.0, -10.78, 0);
  wall(Q, -4.0, -10.4, 2.2, 0.5);
  const lampGlow = add(Q, R.glowPool(1.3, 0.35), -4.0, -10.77, 2.2);
  solid1(Q, R.lectern(solid(0x6e5238, 0.7)), -5.7, -8.6, 0.6, 0.6, Math.PI / 2);
  const note = add(Q, P.sheet("ROSA PALMER", 0.34, 0.26), -5.69, -8.6, 1.165, Math.PI / 2);
  note.rotation.order = "YXZ";
  note.rotation.x = 0.45;
  const tMon = tagAt(Q, "RECORD", -2.75, 0.0, -10.5, 0, 1.6),
    tNote = tagAt(Q, "RECORD", -5.25, 0.0, -8.6, Math.PI / 2);
  Q.reveal.monument = (v) => {   /* the lamp over the monument is turned up, and its light comes onto the marble */
    const k = kOf(v);
    lampGlow.visible = k > 0;
    lampGlow.material.opacity = 0.35 * smooth(k);
    drop(tMon, v);
  };
  Q.reveal.husbands = (v) => {   /* the note is lifted off the desk to read, then laid back */
    const k = kOf(v);
    note.position.y = 1.165 + Math.sin(k * Math.PI) * 0.12;
    note.rotation.x = 0.45 - Math.sin(k * Math.PI) * 0.35;
    drop(tNote, v);
  };
  const tWin = tagAt(Q, "RECORD", 1.3, 0.0, -9.4, 0, 1.4);
  Q.reveal.eastwin = (seen) => (tWin.visible = seen);
  R.flameSets(G);
  person(Q, "warden", "warden", -1.5, -8.5, face(-1.5, -8.5, 0, 0), { kind: "watch", at: [-4.0, -10.8], idles: ["Idle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "cousin", "cousin", 1.4, 7.0, face(1.4, 7.0, 0, 0), { kind: "watch", at: [0, -10], idles: ["Idle"], react: ["HeadTurn"], every: [4, 7] });
  crowd(Q, "rh_elder", 5.4, 3.0, face(5.4, 3, 6.3, 4.9), { kind: "wander", pts: [[5.4, 3.0], [5.5, 4.9], [5.4, 0.7], [5.5, -3.5]], pause: [4, 8] });
  crowd(Q, "rh_woman", 2.6, -8.9, face(2.6, -8.9, 2.2, -9.9), { kind: "work", clips: ["Idle", "PickUp", "HeadTurn"], work: [5, 9], face: [2.2, -9.9] });
  crowd(Q, "rh_man", -5.3, 5.6, face(-5.3, 5.6, -6.3, 4.9), { kind: "watch", at: [-6.3, 4.9], react: ["HeadTurn", "Nod"], every: [5, 9] });
  Q.walls.push([-6.2, -7.8, -0.8, -7.4], [0.8, -7.8, 6.2, -7.4]);
  Q.keepOff = [{ at: [-4.0, -9.5], r: 1.0 }, { at: [-4.9, -8.6], r: 0.8 }, { at: [0, -7.6], r: 0.9 }, { at: [0.9, -8.7], r: 0.8 }];
  R.ashlarFit(G);
  /* the walk up the church to the monument (FILMS.aisle): the camera goes up the aisle between the pews and over the open middle of the
     rail; the monument's lamp glow comes up as you reach it, and goes back to what you have read when the scene ends */
  Q.films.aisle = (t) => {
    if (t < 0) {
      lampGlow.visible = tMon.visible;
      lampGlow.material.opacity = 0.35;
      return;
    }
    lampGlow.visible = t > 18;
    lampGlow.material.opacity = 0.35 * Math.min(1, Math.max(0, (t - 18) / 3));
  };
  Q.enter = staging(Q, {}, { cousin: [30, 39] });
  return Q;
}

/* ---------- 4. The reading room of the Jamaica Archives, Spanish Town (built 1962) ----------
   A general picture of a public reading room of the 1960s: louvre windows, strip lights, a counter with the stacks behind it, a card
   catalogue, long tables with grey rests for the papers. */
function archive() {
  const Q = base("archive", [-7.6, -5.1, 7.6, 5.1], [5.6, 4.0, Math.PI / 5]);
  Q.floor = "stone";
  Q.indoor = true;
  Q.beds = { room: 0.07, bird: 0.03 };
  Q.light = { top: 0x8fb4c6, hor: 0xe6dcc0, fog: [0xd6d2c0, 40, 200], sun: [0xfff0d0, 1.2, 10, 30, -10], hemi: [0xffffff, 0x9a968a, 2.6], fill: 1.4 };
  Q.view = { pos: [6.6, 2.0, 4.4], look: [-2, 0.9, -1.2] };
  const G = Q.group,
    H = 3.2,
    wallM = solid(0xe8e4d6, 1),
    dado = solid(0xa9bdb0, 1);
  box(16.4, 0.06, 11.4, tiles("#b9b6a6", "#a9a898", [10, 7]), 0, -0.03, 0, G).name = "terrain";
  box(16.4, 0.1, 11.4, solid(0xf0ede4, 1), 0, H + 0.05, 0, G);
  const WINS = [-5.5, -2, 1.5, 5];
  W.wallRun(G, [-8.2, -5.5, 8.2, -5.5], H, wallM, WINS.map((x) => ({ at: x + 8.2, w: 1.8, h: 1.5, sill: 1.05 })), 0.3);
  W.wallRun(G, [-8.2, 5.5, 8.2, 5.5], H, wallM, [], 0.3);
  W.wallRun(G, [-8, -5.6, -8, 5.6], H, wallM, [], 0.3);
  W.wallRun(G, [8, -5.6, 8, 5.6], H, wallM, [], 0.3);
  for (const x of WINS) add(Q, R.louvreWindow(1.8, 1.5), x, -5.35, 1.05);
  for (const s of [-1, 1]) {
    box(16, 0.9, 0.02, dado, 0, 0.45, s * 5.34, G);
    box(16, 0.05, 0.035, solid(0x8aa092, 1), 0, 0.92, s * 5.335, G);
    box(0.02, 0.9, 10.7, dado, s * 7.84, 0.45, 0, G);
    box(0.035, 0.05, 10.7, solid(0x8aa092, 1), s * 7.835, 0.92, 0, G);
  }
  add(Q, W.makeDoor({ w: 0.95, h: 2.1, kind: "flush", color: 0x486573, frame: 0xe6e2d6, handle: "lever" }), 6.2, 5.34, 0, Math.PI);
  add(Q, R.notice(["JAMAICA ARCHIVES", "Reading Room"], 1.3, 0.42, "#26332b", "#f2ead2"), 3.4, 5.33, 2.3, Math.PI);
  add(Q, R.notice(["PENCILS ONLY", "No pens near the records"], 0.7, 0.42), 1.6, 5.33, 1.6, Math.PI);
  add(Q, R.notice(["QUIET PLEASE", "People are reading"], 0.7, 0.42), 4.6, 5.33, 1.6, Math.PI);
  for (const [x, z] of [[-4.6, -2], [0, -2], [4.6, -2], [-4.6, 2.2], [0, 2.2], [4.6, 2.2]]) add(Q, R.tubeLight(1.5), x, z, H);
  const fans = [];
  for (const x of [-2.3, 2.3]) fans.push(add(Q, R.ceilingFan(0.4), x, 0.1, H));
  Q.tickers.push((t) => fans.forEach((f) => f.userData.spin(t * 0.8)));
  /* the counter, with the stacks behind it */
  const cm = solid(0x7a5a3c, 0.6);
  box(0.6, 1.02, 5.6, cm, -6.3, 0.51, -1.2, G);
  box(0.74, 0.05, 5.7, solid(0x5a4030, 0.5), -6.3, 1.045, -1.2, G);
  box(0.03, 0.9, 5.4, solid(0x8a6a48, 0.6), -5.99, 0.5, -1.2, G);
  wall(Q, -6.9, -1.2, 1.9, 5.8);
  for (let i = 0; i < 3; i++) add(Q, R.shelfBay(1.8, 2.5, i + 2), -7.62, -3.1 + i * 1.9, 0, Math.PI / 2);
  add(Q, R.wallClock(), -7.84, 3.4, 2.5, Math.PI / 2);
  add(Q, P.ledger(), -6.3, 0.6, 1.07, 0.3);
  add(Q, R.archiveBox(""), -6.3, -2.6, 1.07, Math.PI / 2);
  cyl(0.05, 0.06, 0.1, solid(0x486573, 0.6), -6.3, 1.12, -0.6, G, 10);
  for (let i = 0; i < 4; i++) cyl(0.006, 0.006, 0.17, solid([0xd9a03a, 0x8a1f24][i % 2], 0.6), -6.3 + (i - 1.5) * 0.015, 1.2, -0.6 + (i % 2) * 0.015, G, 5);
  for (let i = 0; i < 3; i++) solid1(Q, R.shelfBay(1.8, 2.5, i + 7), -5.0 + i * 1.9, 5.12, 1.9, 0.5, Math.PI);
  /* table A: Annie Palmer's four papers, each on its rest under a sheet of tissue until you read it */
  solid1(Q, R.readingTable(6.2, 1.1), -1.7, -0.6, 6.3, 1.2);
  solid1(Q, R.readingTable(2.8, 1.1), 5.0, -0.6, 2.9, 1.2);
  const papers = {
    marriage: [-4.1, 0x4a2f24, "MARRIAGES|St James 1820", "RECORD"],
    obituary: [-2.8, 0xb9b094, "DIED|November 1827", "RECORD"],
    deed: [-1.5, 0x6a5a3a, "DEED|1830", "RECORD"],
    burial: [-0.2, 0x3a2a24, "BURIALS|July 1846", "RECORD"],
    pamphlet: [4.4, 0xb9a57a, "LEGEND OF|ROSE HALL|1868", "LEGEND"],
    novel: [5.6, 0x7a2f2a, "THE WHITE|WITCH OF|ROSEHALL|1929", "LEGEND"],
  };
  for (const [id, [x, cover, title, kind]] of Object.entries(papers)) {
    add(Q, R.bookRest(cover, title), x, -0.6, 0.765, Math.PI);
    const tissue = box(0.5, 0.012, 0.36, solid(0xf8f6ee, 1), x, 0.9, -0.6, G);
    tissue.userData.noBatch = true;
    const t = tagAt(Q, kind, x, 0.765, -0.28, Math.PI);
    Q.reveal[id] = (v) => {   /* the tissue is drawn back off the paper */
      const k = kOf(v);
      tissue.visible = k < 1;
      tissue.position.set(x + smooth(k) * 0.42, 0.9 + Math.sin(k * Math.PI) * 0.05, -0.6 + smooth(k) * 0.1);
      drop(t, v);
    };
  }
  for (const x of [-4.1, -2.8, -1.5, -0.2, 4.4, 5.6]) add(Q, R.officeChair(), x, -1.5, 0, 0);
  /* a pad and a pencil at each place: pencils only, near the records */
  for (const x of [-4.1, -2.8, -1.5, -0.2, 4.4, 5.6]) {
    add(Q, P.sheet("", 0.15, 0.21), x + 0.38, -0.2, 0.762, 0.12);
    const pen = cyl(0.004, 0.004, 0.17, solid(0xd9a03a, 0.6), x + 0.5, 0.768, -0.22, G, 6);
    pen.rotation.x = Math.PI / 2;
    pen.rotation.z = 0.4;
  }
  wall(Q, -2.15, -1.5, 4.5, 0.5);
  wall(Q, 5.0, -1.5, 1.8, 0.5);
  /* the box from the stacks: it waits on a trolley by the counter; on table A it is opened, and the estate's own book lies beside it */
  solid1(Q, R.trolley(), -4.4, 2.6, 0.9, 0.6);
  add(Q, R.archiveBox(""), -4.5, 2.6, 0.2125, 0.1);
  const jr = add(Q, R.bookRest(0x5a3a24, "ROSE HALL|JOURNAL"), 0.5, -0.7, 0.765, Math.PI);
  R.still(jr);
  const tJr = tagAt(Q, "RECORD", 0.5, 0.765, -0.36, Math.PI);
  Q.reveal.journal = (seen) => {
    jr.visible = seen;
    tJr.visible = seen;
  };
  /* the book opened, page by page (FILMS.pages). Each page gives only what the Rose Hall Journal gives (Naylor 2022; docs/games/rose-hall.md):
     a name and the words the book puts beside it. null is a row of writing too small to read: the other names. */
  const ledger = add(
    Q,
    R.openLedger([
      [[null, null, null, null, null, null, null, null, null, null, null, null, null, null], [["Celia", "Grasscutter"], "weakly", null, ["Cecelia", "Attending Young Children"], null, ["Mary James", "G.H. Attendant"], null, null, null, null, null]],
      [[["Dorinda", "Hospital Attendant and Midwife"], null, ["George Stennet", "Head Driver"], ["Aaron", "Head Penkeeper"], ["Adonis", "Head Cooper"], null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
      [["21 April 1830", "Dorrinda the midwife being", "orderd to the field for general", "neglect in the performance of", "her duty thot proper to abscond.", null, null, null, null, null, null, null], [["1823", "Archey"], "sent to Falmouth Workhouse", "for punishment", null, ["1826", "Archey"], "transported", null, null, null, null, null]],
      [[["Hercules"], null, null, ["Doshy"], null, null, ["Hercules"], null, null, null, ["Doshy"], null, null, null], [["Osnaburg"], null, null, ["Peniston"], null, null, null, null, null, null, null, null, null, null]],
      [[null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    ]),
    0.5,
    -0.72,
    0.766,
  );
  ledger.visible = false;
  const TURNS = [14.5, 24.5, 35, 44];
  let jrWas = null;
  Q.films.pages = (t) => {
    if (t < 0) {
      ledger.visible = false;
      if (jrWas !== null) jr.visible = tJr.visible = jrWas;
      jrWas = null;
      return;
    }
    if (jrWas === null) jrWas = jr.visible;
    ledger.visible = true;
    jr.visible = tJr.visible = false;
    let k = 0;
    for (const at of TURNS) k += Math.max(0, Math.min(1, (t - at) / 1.4));
    ledger.userData.turn(k);
  };
  /* the card catalogue, a case of maps, plants */
  solid1(Q, R.catalogue(6, 7), 7.52, -2.9, 1.3, 0.6, -Math.PI / 2);
  solid1(Q, R.catalogue(6, 7), 7.52, -1.5, 1.3, 0.6, -Math.PI / 2);
  solid1(Q, R.displayCase(1.5, 0.7), 7.3, 1.6, 1.5, 0.75, Math.PI / 2);
  add(Q, P.sheet("SLAVE REGISTER", 0.5, 0.4), 7.3, 1.6, 0.91, Math.PI / 2);   /* the register in the case: Annie Palmer held four people in 1829 */
  const tReg = tagAt(Q, "RECORD", 6.85, 0.0, 2.3, Math.PI / 2, 1.2);
  const gReg = glowAt(Q, 0.4, 0, true);
  Q.reveal.register = (v) => {   /* the case light is switched on over the page, then off */
    sweep(gReg, v, [7.3, 0.93, 1.3], [7.3, 0.93, 1.9], 0.5);
    drop(tReg, v);
  };
  solid1(Q, R.potPlant(3, 1.1), -7.2, 4.6, 0.6, 0.6);
  solid1(Q, R.potPlant(5, 1.0), 7.3, 4.6, 0.6, 0.6);
  solid1(Q, R.potPlant(8, 1.0), 7.3, -4.7, 0.6, 0.6);
  person(Q, "archivist", "archivist", -5.2, 1.6, face(-5.2, 1.6, 2, 3), { kind: "watch", at: [-1.7, -0.6], idles: ["Idle"], react: ["HeadTurn", "Nod"], every: [5, 9] });
  person(Q, "cousin", "cousin", 6.3, 2.3, face(6.3, 2.3, 7.3, 1.6), { kind: "watch", at: [7.3, 1.6], idles: ["Idle"], react: ["HeadTurn"], every: [4, 7] });
  crowd(Q, "rh_man", 6.7, -2.2, face(6.7, -2.2, 7.5, -2.2), { kind: "work", clips: ["IdleM", "PickUp", "HeadTurn", "Nod"], work: [5, 9], face: [7.5, -2.2] });
  crowd(Q, "rh_elder", 2.6, 3.6, face(2.6, 3.6, 2.5, 5.1), { kind: "wander", pts: [[2.6, 3.6], [-0.6, 3.9], [-2.4, 3.8], [3.6, 3.4]], pause: [5, 9] });
  crowd(Q, "rh_woman", -3.4, -3.6, face(-3.4, -3.6, -2, -5.4), { kind: "watch", at: [-2, -5.4], react: ["HeadTurn", "Nod"], every: [5, 9] });
  Q.keepOff = [-4.1, -2.8, -1.5, -0.2, 0.85, 4.4, 5.6].map((x) => ({ at: [x, 0.5], r: 0.7 })).concat([{ at: [-4.4, 3.5], r: 0.9 }, { at: [6.5, 1.6], r: 0.7 }]);
  return Q;
}

/* ---------- 5 and 6. The old estate by day ----------
   The gateway follows Hakewill's plate of Rose Hall (1825): white piers with a ball on each, low white walls with iron rails that sweep in
   to the gate, coconut palms, the house far up on its hill and blue hills behind. The house is the restored block of today with
   Hakewill's "double flight of stone steps" and "open portico". The ruined works wall, the markers and the board are a general
   picture: the layout of the works and the village could not be confirmed. The sea is to the north, behind you as you face the house. */
function estate() {
  const Q = base("estate", [-23, -12, 23, 15], [1.5, 11.5, 0]);
  Q.floor = "grass";
  Q.beds = { wind: 0.06, bird: 0.14, sea: 0.05 };
  Q.light = { top: 0x5fa0cc, hor: 0xe8e4cc, fog: [0xd4e0dc, 120, 700], sun: [0xfff2d0, 2.4, 30, 55, 30], hemi: [0xfff4dc, 0x86a070, 2.5] };
  Q.view = { pos: [6, 2.6, 13.5], look: [-2, 5, -40] };
  const G = Q.group,
    grass = std(T.grass([70, 36], [98, 134, 70]));
  /* the land: a level lawn, then a long fall to the coast and the sea */
  const lawn = plane(700, 330, grass, 0, -0.025, -145, G);
  lawn.rotation.x = -Math.PI / 2;
  lawn.name = "terrain";
  const fallGeo = new THREE.BufferGeometry();
  fallGeo.setAttribute("position", new THREE.Float32BufferAttribute([-350, -0.025, 20, 350, -0.025, 20, 350, -14.5, 88, -350, -14.5, 88], 3));
  fallGeo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 70, 0, 70, 7, 0, 7], 2));
  fallGeo.setIndex([0, 2, 1, 0, 3, 2]);
  fallGeo.computeVertexNormals();
  const fall = mesh(fallGeo, grass, 0, 0, 0, G);
  fall.name = "terrain";
  const shore = plane(700, 60, std(T.sand([40, 4])), 0, -14.5, 117, G);
  shore.rotation.x = -Math.PI / 2;
  shore.name = "terrain";
  createSea(G, { kind: "caribbean", y: -14.9, at: [0, 290], size: 320, swell: 0.6 });
  /* the far hills are the engine's ridges (engine/ridges.js, made in main.js): they go pale into the haze inland and leave the sea view clear */
  /* the great house on its hill, a stone terrace under it */
  const hillH = (x, z) => {
      const k = Math.max(0, Math.min(1, (Math.hypot(x, z + 88) - 27) / 40));
      return 11 * (1 - k * k * (3 - 2 * k));
    },
    hg = new THREE.PlaneGeometry(140, 140, 28, 28);
  hg.rotateX(-Math.PI / 2);
  hg.translate(0, 0, -88);
  {
    const pos = hg.attributes.position,
      col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        z = pos.getZ(i),
        road = Math.abs(x) < 2.6 && z > -74,
        v = 0.9 + ((i * 7919) % 13) / 60;
      pos.setY(i, hillH(x, z) - 0.03);
      col.set(road ? [0.82 * v, 0.78 * v, 0.66 * v] : [0.36 * v, 0.52 * v, 0.27 * v], i * 3);
    }
    hg.setAttribute("color", new THREE.BufferAttribute(col, 3));
    hg.computeVertexNormals();
  }
  const hill = mesh(hg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), 0, 0, 0, G);
  hill.name = "terrain";
  hill.userData.far = true;
  const terrace = W.stoneBox(46, 3.6, 26, W.LIME, 0, 1.8, 0);
  terrace.userData.far = true;
  add(Q, terrace, 0, -85, 9.8);   /* its top at 11.6, under the house (add() sets the centre: at 8 the house stood 1.8 m over it) */
  const greatHouse = add(Q, R.greatHouse(), 0, -87, 11.6);
  for (const [x, z, h, s] of [[-30, -78, 9, 71], [31, -80, 10, 72], [-38, -66, 8, 73], [40, -64, 8, 74]]) add(Q, tree(h, s, 1), x, z, hillH(x, z) - 0.2);
  for (const [x, z, s] of [[-26, -70, 81], [27, -72, 82], [-20, -60, 83], [22, -58, 84]]) add(Q, palm(9, s), x, z, hillH(x, z) - 0.2);
  /* the drive: pale marl from the gate up toward the house */
  strip(Q, 3.6, 34, std(T.dirt([1, 9], [214, 204, 176])), 0, 2.5);
  strip(Q, 3.2, 12, std(T.dirt([1, 3], [214, 204, 176])), 0, -20, 0.014);
  /* the gateway, after Hakewill's plate */
  for (const x of [-2.3, 2.3]) solid1(Q, R.gatePier(3.3, 0.85), x, 17.3, 1.0, 1.0);
  for (const s of [-1, 1]) {
    add(Q, R.railWall(5.13, 1.0), s * 5.27, 16.52, 0, s * 0.257);
    solid1(Q, R.gatePier(2.5, 0.7), s * 8.2, 15.75, 0.9, 0.9);
    add(Q, R.railWall(15.25, 1.0), s * 16.375, 15.75);
    /* an iron gate leaf, standing open */
    const leaf = grp(G, s * 1.74, 0, 17.3);
    leaf.rotation.y = s * 1.25;
    for (let i = 0; i < 8; i++) cyl(0.016, 0.016, 2.3, R.IRON, s * -(0.1 + i * 0.22), 1.2, 0, leaf, 5);
    box(1.75, 0.05, 0.04, R.IRON, s * -0.9, 0.2, 0, leaf);
    box(1.75, 0.05, 0.04, R.IRON, s * -0.9, 2.2, 0, leaf);
  }
  Q.walls.push([-25, 15.2, -2.6, 18], [2.6, 15.2, 25, 18], [-2.8, 14.6, -1.2, 17], [1.2, 14.6, 2.8, 17]);
  for (const [x, z, h, s] of [[-6.4, 13.2, 8.5, 1], [6.8, 13.6, 9.5, 2], [-13, 13.4, 8, 3], [13.6, 13.0, 9, 4], [-19.5, 13.6, 9.5, 5], [19.8, 13.4, 8.4, 6]]) solid1(Q, palm(h, s), x, z, 0.7, 0.7);
  for (const [x, z, h, s] of [[-9, 26, 10, 11], [8, 30, 11, 12], [-24, 34, 10, 13], [26, 28, 10, 14], [0.5, 44, 12, 15], [-40, 30, 11, 16], [42, 34, 11, 17], [-15, 48, 12, 18], [18, 52, 12, 19]]) add(Q, palm(h, s), x, z, -(z - 20) * 0.213);
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) add(Q, i % 2 ? flowers(i + 3) : bush(i + 9, 0.8), s * (4.4 + i * 2.6), 14.6 - (i < 2 ? -0.5 + i * 0.4 : 0.1), 0);
  add(Q, R.fingerPost(["GREAT HOUSE", "OLD WORKS"]), 3.8, 12.8, 0, 0.5);
  wall(Q, 3.8, 12.8, 0.3, 0.3);
  /* the old works: broken walls of cut stone, an arch, a great iron pan */
  solid1(Q, R.ruinWall(11, 3.6, 4, 1.5), 15, -8.5, 11.2, 1.0);
  solid1(Q, R.ruinWall(6, 3.0, 9), 20.6, -5.0, 6.2, 1.0, Math.PI / 2);
  solid1(Q, R.ruinWall(5, 1.6, 12), 11, -4.6, 5.2, 1.0, 0.0);
  solid1(Q, R.copper(), 16.4, -4.4, 2.1, 2.1);
  solid1(Q, W.rocks(1.1, 7, 4), 8.6, -9.4, 1.8, 1.4);
  /* cane on both sides, and old trees */
  add(Q, R.caneField(40, 44, 3), -52, -22);
  add(Q, R.caneField(44, 36, 5), 54, -30);
  add(Q, R.caneField(30, 16, 7), -40, 4);
  for (const [x, z, h, s] of [[-19.5, -3.5, 8.5, 51], [20.2, 7.6, 8, 52], [-10.5, 9.6, 7, 53], [7.6, -10.4, 7.5, 54]]) solid1(Q, tree(h, s, 1), x, z, 1.0, 1.0);
  for (const o of scatter(G, (i) => tree(6 + (i % 4), i + 60, 1), 22, [-110, -60, 110, -16], [[-27, -100, 27, -14], [-74, -46, -30, 2], [30, -50, 78, -10]], 31)) o.position.y = hillH(o.position.x, o.position.z) - 0.2;
  scatter(G, (i) => bush(i + 20, 0.9 + (i % 3) * 0.2), 16, [-23, -14, 23, 13], [[-21, -11, 21, 12], [-2.6, -27, 2.6, 20]], 5);   /* none on the drive */
  /* the board of names, by the drive */
  solid1(Q, R.nameBoard("ROSE HALL  1817 TO 1832", ["CELIA", "DORINDA", "CECELIA", "MARY JAMES", "GEORGE STENNET", "AARON", "ADONIS", "HERCULES", "DOSHY", "ARCHEY"], "and 198 more. 208 names in all."), -5.6, -5.6, 3.5, 0.5, 0.25);
  const tNames = tagAt(Q, "RECORD", -4.2, 0.0, -4.4, 0.25, 2);
  const pointed = {};
  Q.reveal.names = (v) => {
    guidePoints(Q, v, (pointed.names ||= {}));
    drop(tNames, v);
  };
  /* six markers on the lawn, each with a name or two from the estate's book */
  const MARK = { celia: [-13.5, -6.4, "CELIA", 0.5], dorinda: [-16.5, 1.2, "DORINDA", 1.0], cecelia: [-12.6, 7.4, "CECELIA|MARY JAMES", 2.2], heads: [9.4, 8.2, "GEORGE STENNET|AARON|ADONIS", -2.3], runaways: [15.8, 3.0, "HERCULES|DOSHY", -1.3], archey: [9.6, -0.9, "ARCHEY", -0.5] };
  Q.markSpots = {};
  for (const [id, [x, z, text, ry]] of Object.entries(MARK)) {
    solid1(Q, R.marker(text), x, z, 0.9, 0.9, ry);
    const pad = mesh(new THREE.CircleGeometry(1.5, 14), std(T.dirt([1, 1], [214, 204, 176])), x + Math.sin(ry) * 0.9, 0.012, z + Math.cos(ry) * 0.9, G);
    pad.rotation.x = -Math.PI / 2;
    pad.name = "terrain";
    const t = tagAt(Q, "RECORD", x + Math.sin(ry) * 0.5, 0.0, z + Math.cos(ry) * 0.5, ry, 1.6);
    /* you lay a flower from the basket at the foot of the stone */
    const bloom = add(Q, flowers(id.length + 40), x + Math.sin(ry) * 0.6 + Math.cos(ry) * 0.38, z + Math.cos(ry) * 0.6 - Math.sin(ry) * 0.38);   /* beside the card, not on it */
    bloom.scale.setScalar(0.7);
    R.still(bloom);
    Q.reveal[id] = (v) => {
      const k = kOf(v);
      bloom.visible = k > 0;
      bloom.position.y = (1 - smooth(k)) * 0.35;
      drop(t, v);
    };
    Q.markSpots[id] = [+(x + Math.sin(ry) * 1.35).toFixed(2), +(z + Math.cos(ry) * 1.35).toFixed(2)];
  }
  /* what the tour shows as a tomb, a card about who built the house, a basket of flowers, seats */
  solid1(Q, R.boxTomb(), -19, 8.4, 2.6, 1.5, 0.3);
  solid1(Q, R.tourSign(["THE TOMB", "of Annie Palmer"], 0.5, 0.3), -17.0, 9.6, 0.4, 0.4, 1.1);
  const tTomb = tagAt(Q, "LEGEND", -16.6, 0.0, 9.8, 1.1);
  Q.reveal.tomb = (v) => {
    guidePoints(Q, v, (pointed.tomb ||= {}));
    drop(tTomb, v);
  };
  solid1(Q, R.tourSign(["ROSE HALL", "Who built it?"], 0.5, 0.3), 3.2, -8.6, 0.4, 0.4, 0.2);
  const tBuilt = tagAt(Q, "RECORD", 3.29, 0.0, -8.16, 0.2);
  Q.reveal.built = (v) => {
    guidePoints(Q, v, (pointed.built ||= {}));
    drop(tBuilt, v);
  };
  /* two more cards on stands: the clothing lists of the estate book, by the board; rebellion and freedom, by the works */
  solid1(Q, R.tourSign(["CLOTHING", "from the estate book"], 0.5, 0.3), -8.2, -4.5, 0.4, 0.4, 0.2);
  const tCloth = tagAt(Q, "RECORD", -8.11, 0.0, -4.06, 0.2);
  Q.reveal.clothes = (v) => {
    guidePoints(Q, v, (pointed.clothes ||= {}));
    drop(tCloth, v);
  };
  solid1(Q, R.tourSign(["FREEDOM", "1831 to 1838"], 0.5, 0.3), 5.9, -8.4, 0.4, 0.4, 0.0);
  const tFree = tagAt(Q, "RECORD", 5.9, 0.0, -7.95, 0.0);
  Q.reveal.freedom = (v) => {
    guidePoints(Q, v, (pointed.freedom ||= {}));
    drop(tFree, v);
  };
  solid1(Q, R.flowerBasket(), -2.9, 3.4, 0.7, 0.6, 0.3);
  solid1(Q, W.bench(2), 4.6, 4.4, 2.1, 0.5, -0.6);
  solid1(Q, W.bench(2), -8.4, -9.6, 2.1, 0.5, 0.2);
  person(Q, "guide", "guide", -3.4, -3.2, face(-3.4, -3.2, 1, 6), { kind: "watch", at: [-5.6, -5.6], idles: ["Idle"], react: ["HeadTurn", "Point"], every: [5, 9] });
  person(Q, "cousin", "cousin", 2.6, 9.6, face(2.6, 9.6, 0, -40), { kind: "watch", at: [0, -40], idles: ["Idle"], react: ["HeadTurn"], every: [4, 8] });
  crowd(Q, "rh_elder", 6.2, 3.6, 0, { kind: "wander", area: [3, 1.4, 12, 6.4], pause: [3, 7] });
  crowd(Q, "rh_man", 14.2, -6.4, face(14.2, -6.4, 16.5, -8.5), { kind: "watch", at: [16.5, -8.5], react: ["HeadTurn", "Nod"], every: [5, 9] });
  crowd(Q, "rh_woman", -6.6, 11.2, 0, { kind: "chat", group: "g", at: [-6.2, 11.4] });
  crowd(Q, "rh_youth", -5.6, 11.9, 0, { kind: "chat", group: "g" });
  crowd(Q, "rh_youth", 18.4, -1.6, 0, { kind: "wander", pts: [[18.4, -1.6], [13.2, -2.6], [12.6, 5.6], [18.6, 5.2]], pause: [3, 6] });
  Q.keepOff = [{ at: [-5.1, -3.6], r: 1.2 }, { at: [-15.8, 10.1], r: 1 }, { at: [3.5, -7.2], r: 1 }, { at: [-2.6, 4.6], r: 1 }, { at: [-8.0, -3.3], r: 1 }, { at: [5.8, -7.1], r: 1 }, ...Object.values(Q.markSpots).map((at) => ({ at, r: 1 }))];
  Q.enter = staging(Q, { guide: { 50: [-3.4, -3.2, -5.6, -5.6], 60: [-15.0, 6.2, -19, 8.4], 62: [1.6, -6.0, 3.2, -8.6] } }, { cousin: [50, 69] });
  /* the night tour's walk up the drive (FILMS.arrive): the same estate under the moon, the house lit from inside, nobody about; the
     day comes back when the scene ends */
  const DAYLIGHT = { ...Q.light },
    NIGHT = { top: 0x0a0f1e, hor: 0x262b3e, stars: 0.6, moon: 1, fog: [0x0b0e18, 60, 520], sun: [0xa8bce0, 0.5, -40, 70, 50], hemi: [0x8090c4, 0x1a1e18, 0.7], fill: 0.7 };
  let night = false;
  Q.films.arrive = (t) => {
    if (t < 0) {
      if (!night) return;
      night = false;
      Q.light = { ...DAYLIGHT };
      greatHouse.userData.night(false);
      for (const n of Q.extras) n.m.visible = true;
      Q.relight?.();
      return;
    }
    if (night) return;
    night = true;
    Q.light = { ...NIGHT };
    greatHouse.userData.night(true);
    for (const n of Q.extras) n.m.visible = false;
    Q.relight?.();
  };
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
