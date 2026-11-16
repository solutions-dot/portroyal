/* General pictures of a Kingston yard and street, a road, and the airport.
   Airport massing, propeller aircraft and period clothes follow the sources in the game doc. */
import * as THREE from "three";
import {
  T,
  std,
  solid,
  flat,
  mesh,
  box,
  cyl,
  plane,
  grp,
  rng,
  batchStatic,
} from "./gfx.js";
import { palm, tree, boardHouse, marketBasket } from "./period-props.js";
import * as P from "./props.js";
import { airportDetail } from "./airport-detail.js";
import { enrichYard, enrichMemory, enrichRoad } from "./life.js";
const palette = {
  yard: 0xd9cbae,
  memory: 0xc5ac83,
  road: 0x99b6ad,
  airport: 0xb8c0b7,
};
function base(id, bounds, start) {
  return {
    id,
    group: grp(),
    bounds,
    start: { x: start[0], z: start[1], yaw: start[2] || 0 },
    walls: [],
    specs: [],
    ambient: [],
    points: {},
    items: {},
    props: {},
    routes: [],
    ground: () => 0,
    light: palette[id],
    ready: false,
  };
}
function wall(Q, x, z, w, d) {
  Q.walls.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2]);
}
function add(Q, o, x = 0, z = 0, y = 0) {
  o.position.set(x, y, z);
  Q.group.add(o);
  return o;
}
function house(Q, x, z, w = 8, d = 5, colour = [193, 174, 130]) {
  add(
    Q,
    boardHouse(w, d, 2.8, { wall: colour, seed: Math.round(x * z) + 41 }),
    x,
    z,
  );
  wall(Q, x, z, w + 0.2, d + 0.2);
}
function person(Q, id, x, z, ry = 0, extra = {}) {
  Q.specs.push({ id, x, z, ry, ...extra });
}
function plant(Q, x, z, type = "palm", seed = 1) {
  add(Q, type === "palm" ? palm(5.5, seed) : tree(6, seed), x, z);
  wall(Q, x, z, 0.8, 0.8);
}
function action(Q, id, x, z, label, item = null) {
  Q.points[id] = { x, z, label, item };
}
function item(Q, id, obj, x, z, y = 0) {
  P.dynamic(obj);
  Q.items[id] = add(Q, obj, x, z, y);
  return obj;
}
function worktable(Q, x, z, w = 2, d = 1) {
  add(Q, P.table(w, d), x, z);
  wall(Q, x, z, w, d);
}
function sign(Q, text, x, z, w = 2) {
  const g = grp();
  for (const dx of [-w * 0.4, w * 0.4])
    box(0.08, 1.7, 0.08, P.WOOD, dx, 0.85, 0, g);
  const s = P.label(text, w, 0.38);
  s.position.y = 1.4;
  g.add(s);
  add(Q, g, x, z);
  wall(Q, x, z, w, 0.15);
  return g;
}
function ground(Q, mat) {
  if (Q.id !== "airport" && Q.id !== "road") {
    for (let i = 0; i < 9; i++) {
      const hill = mesh(
        new THREE.SphereGeometry(1, 12, 8),
        flat(0x74876b),
        -100 + i * 27,
        -4,
        -100 - (i % 3) * 15,
        Q.group,
      );
      hill.scale.set(33, 14 + (i % 4) * 4, 23);
    }
  }
  const p = plane(
    Q.id === "airport" ? 140 : 500,
    Q.id === "airport" ? 220 : 500,
    mat,
    0,
    -0.025,
    0,
    Q.group,
  );
  p.rotation.x = -Math.PI / 2;
  p.receiveShadow = true;
}
function yard() {
  const Q = base("yard", [-17, -14, 17, 19], [0, 13, 0]);
  ground(Q, std(T.dirt([12, 12], [171, 140, 94])));
  house(Q, -12, -7, 8, 6, [175, 197, 174]);
  house(Q, 11, -8, 9, 5, [222, 195, 143]);
  house(Q, -12, 15, 8, 5, [192, 159, 124]);
  for (let x = -18; x <= 18; x += 1.2) {
    box(0.11, 1.1, 0.1, P.WOOD, x, 0.55, -14, Q.group);
    box(0.11, 1.1, 0.1, P.WOOD, x, 0.55, 19.5, Q.group);
  }
  for (const z of [-14, 19.5])
    for (const y of [0.45, 0.9]) box(37, 0.08, 0.08, P.WOOD, 0, y, z, Q.group);
  plant(Q, -13, 5, "tree", 23);
  plant(Q, 13, 12, "palm", 8);
  plant(Q, 15, -2, "palm", 11);
  worktable(Q, -5, -2);
  worktable(Q, 6, -3);
  worktable(Q, 0, -5, 2.5, 1.15);
  const sewing = add(Q, P.sewingMachine(), 6, -3, 0.83);
  Q.props.sewing = sewing;
  Q.props.chair = add(Q, P.chair(), 8, 4);
  wall(Q, 8, 4, 0.6, 0.65);
  item(Q, "tin", P.tin(), -6, -2, 0.83);
  item(Q, "thread", P.thread(), 6.7, -3, 0.83);
  item(Q, "bottle", P.bottle(), -0.75, -5, 0.83);
  item(Q, "lunch", P.lunch(), -0.4, -5, 0.83);
  item(Q, "photo", P.card("photo"), 0.7, -5, 0.83);
  item(Q, "ticket", P.card("ticket"), -4.4, -2, 0.83);
  Q.props.bag = item(Q, "bag", P.bag(), 0.35, -5, 0.83);
  person(Q, "adina", -3, 0, 0.2);
  person(Q, "mum", 5, 0, -0.3);
  person(Q, "levi", 9, 5, -1.4);
  person(Q, "boy", -8, 9, 0.3);
  action(Q, "tin", -6, 0, "Pick up the tin", "tin");
  action(Q, "openTin", -5, 0, "Open the tin");
  action(Q, "thread", 6.7, -1, "Pick up the thread", "thread");
  action(Q, "sewing", 6, -1, "Set down the thread");
  action(Q, "chair", 8, 5.2, "Fit the wooden slat");
  action(Q, "water", -0.75, -3.6, "Pack the water", "bottle");
  action(Q, "lunch", 0, -3.6, "Pack the lunch", "lunch");
  action(Q, "photo", 0.75, -3.6, "Pack the picture", "photo");
  action(Q, "ticket", -4.4, 0, "Put the ticket in the tin", "ticket");
  for (let i = 0; i < 8; i++) {
    const x = i % 2 ? -7 : 12,
      z = 2 + i * 1.8;
    Q.ambient.push({
      id: "yard" + i,
      x,
      z,
      look: i,
      behaviour: {
        kind: i % 3 === 0 ? "wander" : "watch",
        area: i % 2 ? [-9, 2, -6, 10] : [10, 2, 12, 10],
        at: [0, 0],
        react: ["Point", "Wave"],
        radius: 1.2,
      },
    });
  }
  Q.keepOff = [
    {
      pts: [
        [0, 13],
        [0, 0],
        [-5, 0],
      ],
      w: 1.3,
    },
    {
      pts: [
        [0, 0],
        [6, 0],
        [9, 5],
      ],
      w: 1.25,
    },
    { at: [-3, 0], r: 1.2 },
  ];
  Q.routes = [
    {
      id: "family yard",
      pts: [
        [0, 13],
        [0, 0],
        [-5, 0],
      ],
      what: "player",
      h: 1.3,
      r: 0.22,
    },
  ];
  enrichYard(Q);
  return Q;
}
function memory() {
  const Q = base("memory", [-12, -18, 12, 22], [0, 15, 0]);
  ground(Q, std(T.dirt([10, 10], [155, 127, 89])));
  for (let i = 0; i < 4; i++) {
    house(Q, -9, -13 + i * 10, 5, 7, [181 + i * 9, 160 + i * 5, 113]);
    house(Q, 9, -13 + i * 10, 5, 7, [203, 190, 150]);
  }
  worktable(Q, -2, -3, 2.6, 1.1);
  worktable(Q, 3, -8, 2, 1.2);
  sign(Q, "KINGSTON", -5, -13, 2);
  item(Q, "paper", P.card("paper"), -2, -3, 0.83);
  person(Q, "vendor", -3, -5, 2.2, { look: "vendor" });
  const map = grp();
  box(1.5, 0.03, 1.15, P.PAPER, 0, 0.01, 0, map);
  const Africa = new THREE.Shape();
  Africa.moveTo(-0.4, 0.4);
  Africa.lineTo(0.22, 0.38);
  Africa.lineTo(0.35, 0.1);
  Africa.lineTo(0.07, -0.45);
  Africa.lineTo(-0.16, -0.2);
  Africa.lineTo(-0.34, 0.15);
  const continent = mesh(
    new THREE.ShapeGeometry(Africa),
    solid(0x8c8955),
    0,
    0.035,
    0,
    map,
  );
  continent.rotation.x = -Math.PI / 2;
  const pin = mesh(
    new THREE.SphereGeometry(0.035, 8, 6),
    solid(0xad4f39),
    0.22,
    0.06,
    -0.03,
    map,
  );
  Q.props.map = add(Q, map, 3, -8, 0.84);
  action(Q, "paper", -2, -1, "Pick up the newspaper", "paper");
  action(Q, "map", 3, -6, "Place the paper beside the map");
  for (let i = 0; i < 8; i++)
    Q.ambient.push({
      id: "memory" + i,
      x: i % 2 ? -4.5 : 4.5,
      z: -13 + i * 3.5,
      base: "sel_vendor30",
      look: i,
      behaviour: {
        kind: "wander",
        area: i % 2 ? [-5.5, -14, -3.7, 12] : [4, -14, 5.5, 12],
        pause: [1, 3],
      },
    });
  Q.keepOff = [
    {
      pts: [
        [0, 15],
        [0, -1],
        [3, -6],
      ],
      w: 1.25,
    },
    { at: [-3, -5], r: 1.2 },
  ];
  enrichMemory(Q);
  return Q;
}
function road() {
  const Q = base("road", [-5, -45, 5, 27], [0, 23, 0]);
  const shore = plane(18, 150, std(T.sand([2, 20])), 0, -0.025, -15, Q.group);
  shore.rotation.x = -Math.PI / 2;
  const sea = plane(
    600,
    700,
    std(T.water([40, 40]), 0.25, 0.15),
    0,
    -0.12,
    -50,
    Q.group,
  );
  sea.rotation.x = -Math.PI / 2;
  Q.props.sea = sea;
  box(10, 0.05, 110, solid(0x9f9e8c), 0, 0.01, -15, Q.group);
  box(0.12, 0.1, 110, P.CREAM, -4.8, 0.05, -15, Q.group);
  box(0.12, 0.1, 110, P.CREAM, 4.8, 0.05, -15, Q.group);
  for (let i = 0; i < 12; i++)
    box(0.1, 0.01, 2.3, P.CREAM, 0, 0.04, 24 - i * 7, Q.group);
  for (let i = 0; i < 6; i++) {
    plant(Q, 9, -20 + i * 12, "palm", i + 1);
    plant(Q, -9, -24 + i * 13, "palm", i + 23);
  }
  Q.props.bus = add(Q, P.bus(), 2, -28);
  wall(Q, 2, -28, 2.6, 8.1);
  sign(Q, "BUS STOP", -4, -17, 1.1);
  person(Q, "mum", 0, 18, Math.PI);
  person(Q, "adina", -2, -15, 1);
  person(Q, "boy", 2, -10, -1);
  item(Q, "bottle", P.bottle(), -2, -14, 0);
  action(Q, "busStop", 0, -12, "The bus stop");
  action(Q, "roadWater", -2, -13, "Give Grandma some water", "bottle");
  action(Q, "lookout", -4, -5, "Look over the harbour");
  action(Q, "bus", -0.1, -26, "Join the family on the bus");
  Q.leadPath = [
    [0, 18],
    [0, 8],
    [0, -3],
    [0, -12],
  ];
  Q.routes = [
    {
      id: "Mum leads to the bus",
      pts: Q.leadPath,
      what: "guide",
      h: 1.7,
      r: 0.25,
    },
  ];
  Q.keepOff = [
    { pts: Q.leadPath, w: 1.15 },
    { at: [-2, -15], r: 1.1 },
  ];
  for (let i = 0; i < 6; i++)
    Q.ambient.push({
      id: "road" + i,
      x: i % 2 ? -3.7 : 3.8,
      z: 4 + i * 3,
      look: i,
      behaviour: { kind: "watch", at: [2, -28], react: ["Point", "Wave"] },
    });
  enrichRoad(Q);
  return Q;
}
function airport() {
  const Q = base("airport", [-36, -17, 42, 39], [-8, 29, 0]);
  ground(Q, std(T.concrete([75, 75], [166, 170, 161])));
  // Long low terminal, roof spectators, a control tower and open apron: a general reconstruction.
  box(62, 4.2, 8, solid(0xd9d0af), 0, 2.1, 39, Q.group);
  box(65, 0.22, 10, solid(0xe4ddc7), 0, 4.3, 39, Q.group);
  wall(Q, 0, 39, 65, 10);
  for (let x = -27; x <= 27; x += 4) {
    box(2.3, 1.4, 0.05, solid(0x637a77, 0.4), x, 2.4, 34.97, Q.group);
    box(0.12, 3.8, 0.12, P.CREAM, x, 1.9, 34, Q.group);
  }
  const sign = P.label("PALISADOES AIRPORT", 19, 1.1, "#dfd8bc", "#345951");
  sign.position.set(3, 3.6, 34.9);
  sign.rotation.y = Math.PI;
  Q.group.add(sign);
  box(5, 11, 5, solid(0xd5d0b9), -30, 5.5, 30, Q.group);
  box(7, 1.8, 7, solid(0x526a68, 0.5), -30, 11, 30, Q.group);
  box(8, 0.22, 8, P.CREAM, -30, 12, 30, Q.group);
  wall(Q, -30, 30, 8, 8);
  // The DC-6 stands nose west with its port side, and the rear passenger door, towards the crowd and the terminal.
  Q.props.plane = add(Q, P.aircraft(), -4.7, -32);
  Q.props.plane.rotation.y = Math.PI;
  // The boarding steps stand at the rear door (world x 4.3, the door face at z -30.35); their treads are fitted to the descent (descend.js).
  Q.props.stairs = add(Q, P.stairs(), STAIRS_TOP.x, STAIRS_TOP.z);
  P.dynamic(Q.props.stairs);
  Q.props.stairs.visible = false;
  // Keep the playable path clear of the taxiing aircraft and the historically crowded apron.
  // The player bounds stop at the apron edge; background greeters use their own physical footprints.
  const meeting = grp();
  cyl(0.09, 0.09, 2.2, P.WOOD, 0, 1.1, 0, meeting, 8);
  for (let i = 0; i < 5; i++)
    cyl(
      0.1,
      0.1,
      0.2,
      solid(i % 2 ? 0xe9d9a2 : 0x3e7564),
      0,
      0.6 + i * 0.25,
      0,
      meeting,
      8,
    );
  add(Q, meeting, -8, 20);
  wall(Q, -8, 20, 0.25, 0.25);
  person(Q, "mum", -6, 19, 0.3);
  person(Q, "adina", -4, 17, -0.1);
  person(Q, "levi", -10, 14, 0.6);
  person(Q, "boy", -10, 21, 0.4);
  person(Q, "visitor", 2, 16, -0.3);
  person(Q, "emperor", STAIRS_TOP.x, STAIRS_TOP.z, 0, {
    ground: STAIRS_TOP.y,
    historical: true,
  });
  person(Q, "planno", 2.75, -26.0, 0.35, { historical: true });
  worktable(Q, -2, 19, 1.5, 0.7);
  item(Q, "bottle", P.bottle(), -2, 19, 0.83);
  Q.props.mat = box(1.6, 0.016, 1.2, solid(0xb99b65), -5, 0.02, 20, Q.group);
  P.dynamic(Q.props.mat);
  Q.props.mat.visible = false;
  action(Q, "meeting", -8, 22, "The family meeting place");
  action(Q, "mat", -5, 21, "Spread the waiting cloth");
  action(Q, "airportWater", -2, 20.3, "Pick up the water", "bottle");
  action(Q, "share", 2, 17.5, "Share some water");
  action(Q, "horizon", -3, 8, "Look toward the runway");
  let i = 0;
  for (let row = 0; row < 7; row++)
    for (let col = 0; col < 16; col++) {
      const x = -31 + col * 4.4 + (row % 2) * 0.5 + Math.sin(i * 7.1) * 0.65,
        z = -12 + row * 4 + Math.cos(i * 3.7) * 0.6; // clear of the wing tip's line (z -14) as the aircraft taxis in
      if (x > -13 && x < 6 && z > 6) continue;
      const chat = i % 7 === 0 || i % 7 === 1;
      Q.ambient.push({
        id: "crowd" + i,
        x,
        z,
        look: i,
        behaviour: chat
          ? { kind: "chat", group: "airport" + Math.floor(i / 7) }
          : {
              kind: i % 5 === 0 ? "wander" : "watch",
              area: [x - 1.35, z - 1.35, x + 1.35, z + 1.35],
              min: 0.75,
              at: [4.3, -29],
              react: ["Wave", "Clap", "Point"],
              every: [2, 4],
              pause: [1, 3],
            },
      });
      i++;
    }
  airportDetail(Q);
  Q.keepOff = [
    {
      pts: [
        [-8, 29],
        [-8, 22],
        [-6, 19],
        [-3, 8],
      ],
      w: 1.4,
    },
    { at: [-4, 17], r: 1.5 },
    { at: [-10, 14], r: 1.5 },
    { at: [2, 16], r: 1.3 },
  ];
  Q.routes = [
    {
      id: "family meeting path",
      pts: [
        [-8, 29],
        [-8, 22],
        [-6, 19],
        [-3, 8],
      ],
      what: "player",
      h: 1.3,
      r: 0.22,
    },
  ];
  return Q;
}
export const BUILDERS = { yard, memory, road, airport };
/* the top of the boarding steps, where Haile Selassie stands: just in front of the DC-6's rear door, level with its sill */
export const STAIRS_TOP = { x: 4.3, z: -29.72, y: 2.56 };
export function buildPlace(id) {
  const Q = BUILDERS[id]();
  Q.group.name = id;
  return Q;
}
export function mergePlace(Q) {
  return batchStatic(Q.group);
}
