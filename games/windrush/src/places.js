/* Compressed reconstructions, with each era and country kept separate. */
import * as THREE from "three";
import {
  T,
  cv,
  std,
  solid,
  flat,
  mesh,
  box,
  cyl,
  plane,
  grp,
  batchStatic,
} from "./gfx.js";
import {
  palm,
  tree,
  boardHouse,
  crate,
  lampPost,
  bench,
} from "./period-props.js";
import * as P from "./props.js";
import { TASKS } from "./steps.js";
const eraOf = (id) =>
  id.endsWith("18") ? "2018" : id.endsWith("62") ? "1962" : "1948";
const base = (id, bounds, start, weather = "jamaica") => ({
  id,
  group: grp(),
  bounds: { x0: bounds[0], z0: bounds[1], x1: bounds[2], z1: bounds[3] },
  start: { x: start[0], z: start[1], yaw: start[2] || 0 },
  weather,
  era: eraOf(id),
  walls: [],
  specs: [],
  ambient: [],
  points: {},
  items: {},
  props: {},
  routes: [],
  ground: () => 0,
});
function add(Q, o, x = 0, z = 0, y = 0) {
  o.position.set(x, y, z);
  Q.group.add(o);
  return o;
}
function wall(Q, x, z, w, d) {
  Q.walls.push([x - w / 2, z - d / 2, x + w / 2, z + d / 2]);
}
function person(Q, id, cast, x, z, ry = 0) {
  Q.specs.push({ id, cast, x, z, ry });
}
function ground(Q, mat, size = 400) {
  const p = plane(size, size, mat, 0, -0.025, 0, Q.group);
  p.rotation.x = -Math.PI / 2;
}
function table(Q, x, z, w = 2, h = 0.8) {
  add(Q, P.table(w, 1, h), x, z);
  wall(Q, x, z, w, 1);
}
function plant(Q, x, z, tropical = true) {
  add(
    Q,
    tropical
      ? palm(6, 31 + Math.round(x * z))
      : tree(6, 42 + Math.round(x * z)),
    x,
    z,
  );
  wall(Q, x, z, 0.65, 0.65);
}
function point(Q, id, x, z, label) {
  Q.points[id] = { x, z, label };
}
function sign(Q, text, x, z, w = 2.5) {
  const g = grp();
  for (const s of [-1, 1])
    box(0.07, 1.65, 0.07, P.WOOD, s * w * 0.4, 0.825, 0, g);
  const p = P.label(text, w, 0.36);
  p.position.y = 1.4;
  g.add(p);
  add(Q, g, x, z);
  wall(Q, x, z, w, 0.12);
}
function house(Q, x, z, w, d, colour) {
  add(
    Q,
    boardHouse(w, d, 2.8, { wall: colour, seed: Math.round(x * z) + 78 }),
    x,
    z,
  );
  wall(Q, x, z, w + 0.2, d + 0.2);
}
function extras(Q, n, area, mode = "watch") {
  for (let i = 0; i < n; i++) {
    const x = area[0] + (i % 3) * 2.1,
      z = area[1] + Math.floor(i / 3) * 2.2;
    Q.ambient.push({
      id: Q.id + "-extra" + i,
      x,
      z,
      look: i,
      behaviour:
        mode === "wander"
          ? {
              kind: "wander",
              area: [area[0] - 0.6, area[1] - 0.6, area[2], area[3]],
              walk: "Walk",
              pause: [3, 6],
            }
          : {
              kind: "watch",
              at: [0, 0],
              react: ["HeadTurn", "Nod", "LookAround"],
              every: [4, 8],
            },
    });
  }
}
function jamaicaBackdrop(Q) {
  const hill = solid(0x5b766b);
  for (let i = 0; i < 9; i++) {
    const h = 10 + (i % 3) * 5,
      o = mesh(
        new THREE.SphereGeometry(1, 12, 8),
        hill,
        (i - 4) * 30,
        -h * 0.65,
        -85 - (i % 2) * 22,
        Q.group,
      );
    o.scale.set(30, h, 28);
  }
  for (let i = 0; i < 14; i++) {
    const x = (i - 7) * 6,
      z = -20 - (i % 3) * 5;
    add(Q, tree(6 + (i % 3), i + 130), x, z);
  }
  for (const x of [-23, 23])
    for (let i = 0; i < 5; i++)
      add(Q, tree(6 + (i % 2), i + 180), x, i * 8 - 12);
}
function londonBackdrop(Q) {
  const br = brick(),
    trim = solid(0xb9b5a8),
    glass = solid(0x59676c);
  for (const x of [-25, 25]) {
    box(5, 7, 58, br, x, 3.5, 5, Q.group);
    box(5.3, 0.35, 58.3, solid(0x555959), x, 7.1, 5, Q.group);
    for (let z = -20; z <= 30; z += 5) {
      box(0.6, 1, 0.65, br, x, 7.7, z, Q.group);
      for (const y of [1.8, 4.8]) {
        box(0.08, 1.6, 1.2, trim, x - Math.sign(x) * 2.55, y, z, Q.group);
        box(0.09, 1.3, 0.9, glass, x - Math.sign(x) * 2.61, y, z, Q.group);
      }
    }
  }
  for (const z of [25, -28])
    box(45, 0.02, 7, solid(0x626765), 0, -0.01, z, Q.group);
  for (let i = 0; i < 6; i++) add(Q, tree(6.5, i + 290), -18 + i * 7, -23);
}
function yard(id) {
  const Q = base(id, [-16, -12, 16, 18], [0, 13, 0]);
  jamaicaBackdrop(Q);
  ground(Q, std(T.dirt([12, 12], [169, 143, 102])));
  house(Q, -11, -7, 8, 6, [176, 199, 177]);
  house(Q, 11, -7, 8, 6, [213, 187, 137]);
  house(Q, -11, 15, 8, 5, [191, 168, 133]);
  for (const z of [-12, 19]) {
    for (let x = -16; x <= 16; x += 1.3)
      box(0.08, 1, 0.08, P.WOOD, x, 0.5, z, Q.group);
    for (const y of [0.4, 0.8]) box(33, 0.06, 0.06, P.WOOD, 0, y, z, Q.group);
  }
  plant(Q, -13, 4);
  plant(Q, 13, 13);
  plant(Q, 14, -1);
  table(Q, -4, 3.5);
  table(Q, 3, 2);
  table(Q, 0, -4.5, 2.4);
  table(Q, 7, 3.5);
  add(Q, crate(0.62), -6, -3.4);
  wall(Q, -6, -3.4, 0.62, 0.62);
  add(Q, id === "yard48" ? P.openCase() : P.schoolbag(), 0, -4.5, 0.84);
  add(Q, P.radio(), 7, 3.5, 0.84);
  for (const x of [4.3, 7.7]) box(0.08, 1.8, 0.08, P.WOOD, x, 0.9, -2, Q.group);
  P.line(Q.group, [4.3, 1.65, -2], [7.7, 1.65, -2], P.WOOD, 0.01);
  const tub = grp();
  cyl(0.34, 0.27, 0.25, solid(0x8c9d9b), 0, 0.13, 0, tub, 16);
  add(Q, tub, 3, 2, 0.84);
  if (id === "yard48") {
    person(Q, "may", "may48", 4, 5, -0.5);
    person(Q, "sam", "sam48", -7, 0, 0.6);
    person(Q, "pearl", "pearl48", 8, 6, -0.5);
  } else {
    person(Q, "pearl", "pearl62", 7, 5, -0.6);
  }
  extras(Q, 4, [-10, 6, -7, 11]);
  return Q;
}
const brick = () =>
  std(
    cv(
      256,
      256,
      (x, W, H) => {
        x.fillStyle = "#aaa18c";
        x.fillRect(0, 0, W, H);
        for (let row = 0; row < 8; row++)
          for (let col = -1; col < 5; col++) {
            x.fillStyle = ["#8e6651", "#a0785c", "#916f5a"][
              (row + col + 6) % 3
            ];
            x.fillRect(col * 64 + (row % 2) * 32 + 2, row * 32 + 2, 60, 28);
          }
      },
      [3, 2],
    ),
  );
function terrace(Q, x, z, n = 4, modern = false) {
  const g = grp(),
    br = brick(),
    slate = solid(0x585b5a),
    trim = solid(0xd5cbb4),
    glass = solid(0x708485, 0.45);
  for (let i = 0; i < n; i++) {
    const a = i * 5;
    box(4.95, 6, 5, br, a, 3, 0, g);
    box(5.2, 0.28, 5.3, slate, a, 6.1, 0, g);
    box(0.6, 1.3, 0.7, br, a + 1.1, 6.75, 0, g);
    for (const y of [1.8, 4.5])
      for (const dx of [-1.35, 1.2]) {
        box(1.15, 1.4, 0.06, trim, a + dx, y, 2.54, g);
        box(0.92, 1.2, 0.07, glass, a + dx, y, 2.59, g);
        box(0.04, 1.22, 0.035, trim, a + dx, y, 2.64, g);
        box(0.94, 0.045, 0.04, trim, a + dx, y, 2.65, g);
      }
    box(0.95, 2.1, 0.07, solid(i % 2 ? 0x527a68 : 0x6f4a3b), a, 1.05, 2.57, g);
    box(0.9, 0.06, 0.7, trim, a, 0.03, 2.95, g);
  }
  add(Q, g, x, z);
  wall(Q, x + (n - 1) * 2.5, z, n * 5, 5);
  return g;
}
function street(id) {
  const Q = base(id, [-17, -8, 17, 20], [0, 15, 0], "england");
  ground(Q, std(T.concrete([18, 18], [151, 155, 149])));
  londonBackdrop(Q);
  terrace(Q, -12, -11, 6);
  for (const x of [-17, 17])
    box(0.12, 0.15, 40, solid(0xc5c5b9), x, 0.08, 4, Q.group);
  for (const x of [-11, 12]) {
    add(Q, lampPost(3.5, false), x, 12);
    wall(Q, x, 12, 0.25, 0.25);
  }
  add(Q, bench(2), 12, 3);
  wall(Q, 12, 3, 2, 0.65);
  table(Q, -5, -2.5, 2.3);
  add(Q, P.radio(), -5, -2.5, 0.84);
  sign(Q, "BRIXTON", 0, 19, 3);
  plant(Q, 15, 18, false);
  if (id === "brixton48") {
    const notice = P.label("ROOM TO LET", 1.1, 0.25);
    notice.position.set(-12, 1.8, -8.43);
    Q.group.add(notice);
    person(Q, "gray", "gray48", -12, -5, 0);
    person(Q, "may", "may48", -2, 8, 0.4);
    person(Q, "sam", "sam48", 3, 10, -0.4);
    person(Q, "celia", "celia48", -7, -1, 0.6);
    point(Q, "celiaDoor", -6, 0, "Find Celia");
  } else {
    person(Q, "may", "may62", -8, 3, 0.6);
    person(Q, "sam", "sam62", 8, 3, -0.4);
    table(Q, -5, 0.5);
    table(Q, 0, -2.5);
    add(Q, P.postbox(), 8, 5.5);
    wall(Q, 8, 5.5, 0.8, 0.8);
    const bus = P.doubleDecker();
    bus.rotation.y = Math.PI / 2;
    add(Q, bus, 0, 27);
    Q.props.bus = bus;
  }
  extras(Q, 6, [5, 14, 11, 19]);
  return Q;
}
function harbour(id) {
  const Q = base(
    id,
    [-27, 2, 27, 30],
    [9, 13, 0],
    id === "harbour48" ? "jamaica" : "england",
  );
  const quay = plane(
    80,
    65,
    std(T.concrete([15, 15], [157, 160, 147])),
    0,
    -0.025,
    34,
    Q.group,
  );
  quay.rotation.x = -Math.PI / 2;
  box(80, 4, 2, solid(0x7d8175), 0, -2, 0.7, Q.group);
  const water = plane(
    600,
    600,
    std(T.water ? T.water([10, 10]) : T.concrete([50, 50], [65, 106, 118])),
    0,
    -2.1,
    -160,
    Q.group,
  );
  water.rotation.x = -Math.PI / 2;
  const ship = P.ship();
  add(Q, ship, 0, -29);
  Q.props.ship = ship;
  for (let x = -35; x <= 35; x += 10) {
    const b = cyl(0.25, 0.35, 0.55, P.METAL, x, 0.28, 0, Q.group, 12);
    box(0.8, 0.1, 0.3, P.METAL, x, 0.62, 0, Q.group);
  }
  for (let x = -24; x < 24; x += 4)
    box(3.6, 0.08, 1.4, solid(0x9d987e), x, 0.03, 1, Q.group);
  const gang = grp();
  P.line(gang, [10, 5.3, -18], [10, 0, 3], P.METAL, 0.09);
  P.line(gang, [11.6, 5.3, -18], [11.6, 0, 3], P.METAL, 0.09);
  for (let i = 0; i < 45; i++) {
    const t = i / 44,
      y = 5.3 * (1 - t),
      z = -18 + 21 * t;
    box(1.7, 0.06, 0.5, solid(0xa2a799), 10.8, y, z, gang);
    for (const dx of [10, 11.6])
      box(0.035, 1, 0.035, P.METAL, dx, y + 0.5, z, gang);
  }
  P.line(gang, [10, 6.3, -18], [10, 1, 3], P.METAL, 0.025);
  P.line(gang, [11.6, 6.3, -18], [11.6, 1, 3], P.METAL, 0.025);
  Q.group.add(gang);
  wall(Q, 10.8, -4, 2, 13);
  for (const x of [-22, 24]) {
    const crane = grp();
    box(0.5, 18, 0.5, P.METAL, 0, 9, 0, crane);
    P.line(crane, [0, 17, 0], [9, 22, -8], P.METAL, 0.18);
    P.line(crane, [9, 22, -8], [9, 5, -8], P.METAL, 0.025);
    for (const dx of [-1, 1])
      P.line(crane, [0, 0, 0], [dx * 3, 0, 2], P.METAL, 0.14);
    add(Q, crane, x, 9);
    wall(Q, x, 9, 0.8, 0.8);
  }
  if (id === "harbour48") {
    person(Q, "pearl", "pearl48", -3, 8, 0.2);
    person(Q, "may", "may48", -1, 5, 0.4);
    person(Q, "sam", "sam48", 3, 7, -0.2);
    sign(Q, "KINGSTON · PASSENGERS", -9, 20, 5);
    plant(Q, -30, 20);
  } else {
    person(Q, "may", "may48", -7, 9, 0.5);
    person(Q, "sam", "sam48", 0, 12, -0.3);
    person(Q, "porter", "lionel48", 7, 13, -0.5);
    sign(Q, "TILBURY RIVERSIDE", -11, 25, 6);
    box(16, 7, 7, brick(), 0, 3.5, 37, Q.group);
    for (const x of [-5, 0, 5])
      box(3.5, 3, 0.08, solid(0x43585a), x, 1.5, 33.45, Q.group);
    point(Q, "station", 0, 27, "Walk to the station");
  }
  for (let i = 0; i < 8; i++) {
    const luggage = P.caseStack();
    add(Q, luggage, -18 + (i % 4) * 5, 5 + Math.floor(i / 4) * 12);
    wall(Q, -18 + (i % 4) * 5 + 0.35, 5 + Math.floor(i / 4) * 12, 1.6, 0.7);
  }
  extras(Q, 8, [-13, 9, -7, 17]);
  return Q;
}
function deck() {
  const Q = base("deck48", [-8, -16, 8, 19], [0, 14, 0], "sea");
  const p = plane(
    18.5,
    55,
    std(T.plank([152, 130, 95], 12, [3, 12])),
    0,
    -0.02,
    0,
    Q.group,
  );
  p.rotation.x = -Math.PI / 2;
  const sea = plane(
    1000,
    1000,
    std(T.concrete([70, 70], [66, 103, 117])),
    0,
    -7.5,
    0,
    Q.group,
  );
  sea.rotation.x = -Math.PI / 2;
  for (const x of [-9, 9]) {
    for (let z = -25; z < 26; z += 2)
      box(0.04, 1.1, 0.04, P.METAL, x, 0.55, z, Q.group);
    for (const y of [0.5, 1]) box(0.035, 0.035, 52, P.METAL, x, y, 0, Q.group);
  }
  box(5, 4, 10, solid(0xe1dfd0), 0, 2, -24, Q.group);
  cyl(1.7, 2, 6, solid(0xc6a765), 0, 7, -25, Q.group, 18);
  cyl(1.72, 1.72, 0.8, solid(0x293839), 0, 10.4, -25, Q.group, 18);
  wall(Q, 0, -24, 5, 10);
  for (const x of [-10, 10])
    for (const z of [-12, 4, 17]) {
      const boat = grp();
      const hull = mesh(
        new THREE.SphereGeometry(1, 14, 8),
        solid(0xd9d5c1),
        0,
        1.4,
        0,
        boat,
      );
      hull.scale.set(0.85, 0.5, 2.4);
      for (const dz of [-1.7, 1.7]) {
        P.line(
          boat,
          [x > 0 ? -1.3 : 1.3, 0, dz],
          [x > 0 ? -1.3 : 1.3, 2.6, dz],
          P.METAL,
          0.045,
        );
        P.line(
          boat,
          [x > 0 ? -1.3 : 1.3, 2.6, dz],
          [0, 2.6, dz],
          P.METAL,
          0.045,
        );
        P.line(boat, [0, 2.6, dz], [0, 1.6, dz], P.METAL, 0.012);
      }
      add(Q, boat, x, z);
    }
  for (const x of [-6.7, 6.7])
    for (const z of [-17, 15]) {
      add(Q, bench(1.6), x, z);
      wall(Q, x, z, 1.6, 0.7);
    }
  for (const x of [-6, 6]) {
    cyl(0.3, 0.3, 1.2, solid(0xe1dfd0), x, 0.6, -21, Q.group, 12);
    const cap = cyl(0.38, 0.3, 0.35, P.METAL, x, 1.35, -21, Q.group, 12);
    wall(Q, x, -21, 0.8, 0.8);
  }
  table(Q, -4, 6.5);
  table(Q, 4, -4.5);
  table(Q, -4, -6.5);
  const map = P.paper("THE ATLANTIC");
  add(Q, map, -4, -6.5, 0.84);
  person(Q, "may", "may48", 5, -2, -0.3);
  person(Q, "sam", "sam48", 6, -10, -0.7);
  person(Q, "lionel", "lionel48", -5, 0, 0.5);
  extras(Q, 4, [-6, -12, -2, -8]);
  return Q;
}
function home(id) {
  const isCentre = id === "centre18";
  const Q = base(id, [-12, -9, 12, 15], [0, 11, 0], "england");
  ground(Q, std(T.concrete([12, 12], [166, 163, 146])), 80);
  londonBackdrop(Q);
  terrace(Q, -10, -12, 5, true);
  plant(Q, 10, 12, false);
  add(Q, bench(2), 8, 3);
  wall(Q, 8, 3, 2, 0.7);
  if (isCentre) {
    table(Q, 2, -2.5, 3);
    table(Q, -5, 3.5, 2);
    table(Q, -5, -4.5, 2.4);
    sign(Q, "COMMUNITY ADVICE", 2, -7, 5);
    person(Q, "asha", "asha18", 4, -1, -0.6);
    person(Q, "iris", "iris79", -1, 1, 0.4);
    person(Q, "anita", "anita18", -7, 7, 0.4);
    const papers = P.paper("A LIFE IS MORE THAN PAPERS");
    add(Q, papers, -5, -4.5, 0.84);
  } else {
    table(Q, -4, -0.5, 2.4, 0.6);
    table(Q, 5, -0.5);
    add(Q, P.folder(), -4, -0.5, 0.64);
    person(Q, "iris", "iris79", -4, 2, 0.7);
    person(Q, "anita", "anita18", 4, 5, -0.5);
    const mat = plane(
      1.3,
      0.7,
      std(
        cv(128, 64, (x) => {
          x.fillStyle = "#9c8d6d";
          x.fillRect(0, 0, 128, 64);
          x.fillStyle = "#37494d";
          x.font = "18px serif";
          x.fillText("HOME", 30, 40);
        }),
      ),
      0,
      0.015,
      7,
      Q.group,
    );
    mat.rotation.x = -Math.PI / 2;
    add(Q, P.radio(), 5, -0.5, 0.84);
    point(Q, "frontGate", 0, -6, "Walk to the front gate");
    Q.leadPath = [
      [-4, 2],
      [-1, 2],
      [0, -2],
      [0, -5],
    ];
    Q.routes = [
      { id: "Iris walks to the gate", pts: Q.leadPath, r: 0.3, h: 1.8 },
    ];
  }
  extras(Q, 3, [7, 10, 10, 14]);
  return Q;
}
const builders = {
  yard48: () => yard("yard48"),
  yard62: () => yard("yard62"),
  harbour48: () => harbour("harbour48"),
  deck48: deck,
  tilbury48: () => harbour("tilbury48"),
  brixton48: () => street("brixton48"),
  brixton62: () => street("brixton62"),
  home18: () => home("home18"),
  centre18: () => home("centre18"),
};
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id) {
  const Q = builders[id]();
  for (const [task, t] of Object.entries(TASKS).filter(
    ([, t]) => t.place === id,
  )) {
    if (Q.items[t.item]) continue;
    const o = P.item(t.item),
      from = t.from;
    const siblings = [
      ...new Set(
        Object.values(TASKS)
          .filter(
            (v) =>
              v.place === id && v.from[0] === from[0] && v.from[1] === from[1],
          )
          .map((v) => v.item),
      ),
    ];
    const offset =
      (siblings.indexOf(t.item) - (siblings.length - 1) / 2) * 0.28;
    let at = [from[0] + offset, 0.84, from[1] - 1.5];
    if (id === "tilbury48" && t.item === "case") at = [12, 0, 3.6];
    if (id === "brixton48" && t.item === "case") at = [0, 0, 12];
    if (id === "home18" && t.item === "brownLetter") at = [0, 0.03, 7];
    add(Q, o, at[0], at[2], at[1]);
    Q.items[t.item] = o;
  }
  Q.itemStarts = Object.fromEntries(
    Object.entries(Q.items).map(([id, o]) => [
      id,
      { at: o.position.toArray(), scale: o.scale.toArray(), ry: o.rotation.y },
    ]),
  );
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
