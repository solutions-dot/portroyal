/* The places of the story. Chapter 1: the apron at Palisadoes Airport, Kingston, on the morning of 1 April 1969, the first day of Air Jamaica's
   own flying (docs/games/air-jamaica.md). The terminal, tower, runway and sea are in airport.js (adapted from Selassie's Palisadoes). The
   DC-8 stands nose west with its door side, the port side, toward the terminal and the player; the boarding steps stand at its forward door;
   a DC-9, another of the first four jets, stands behind it. The crew stand in a line along the plane, as in the photograph of the first crew.
   Story people: person(). Background people: crowd(). Walls: wall(). Every solid thing lists its walking wall; the audits check them. */
import * as THREE from "three";
import { T, std, solid, plane, grp, batchStatic } from "./gfx.js";
import * as P from "./props.js";
import { dc8, dc9, DC8 } from "./planes.js";
import { airport, GALLERY } from "./airport.js";
import { buildCockpit, SEATS } from "./cockpit.js";
import { AU, noiseHit } from "../../../engine/audio.js";
/* a soft dark patch on the ground under something, so it sits on the ground and does not seem to hover; follow(o) keeps it under a moving thing */
function groundShadow(Q, w, d, x, z, ry = 0, alpha = 0.55) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: P.shadowTexture(), transparent: true, depthWrite: false, opacity: alpha, polygonOffset: true, polygonOffsetFactor: -1 }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.02, z);
  m.rotation.z = ry;
  m.userData.noBatch = true;
  Q.group.add(m);
  return m;
}

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
function wall(Q, x0, z0, x1, z1) {
  Q.walls.push([x0, z0, x1, z1]);
}
/* a story person. life: what they do when not talking (an ambient behaviour). opts: held, hat, raw */
function person(Q, id, cast, x, z, ry = 0, life = null, opts = {}) {
  Q.specs.push({ id, cast, x, z, ry, life, ...opts });
}
/* a background person: look is a body; life an ambient behaviour */
function crowd(Q, look, x, z, ry, life, opts = {}) {
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...opts });
}
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);

/* where everything stands (world metres; +z is toward the terminal): the plane's origin and the door it opens */
export const APRON = {
  plane: { x: 8, z: -8 },
  stairs: { x: -6.2, z: -4.8 }, // the foot of the platform; the steps run toward +z
  line: { z: -3.2 }, // the crew's line along the fuselage
};

/* what both places share: the airport, the DC-8 at the steps, the DC-9 behind it, the ground gear. Returns the parts the first-flight scene moves. */
function scene(Q, { deck = false } = {}) {
  Q.beds = { wind: 0.04, crowd: 0.03 };
  Q.light = { top: 0x4f9ed6, hor: 0xe6eee4, fog: [0xd8e6e6, 260, 1400], sun: [0xfff2d0, 2.8, -40, 60, 40], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  /* the concrete apron: a large pale slab, with the grass and sea set round it by airport() */
  const ap = plane(150, 130, std(T.concrete([60, 52], [168, 165, 154])), 0, 0.001, 8, Q.group);
  ap.rotation.x = -Math.PI / 2;
  ap.name = "terrain";
  airport(Q, { deck });
  /* the DC-8, nose west, the port side (the door side) toward the terminal */
  const jet = dc8();
  add(Q, jet, APRON.plane.x, APRON.plane.z, 0, Math.PI);
  P.dynamic(jet);
  Q.props.plane = jet;
  /* its shadow: a long soft patch under the fuselage, and a smaller one under each pair of wheels */
  const shadows = [groundShadow(Q, 52, 15, APRON.plane.x, APRON.plane.z, 0, 0.5)];
  const wheelShadows = [[APRON.plane.x - 17, APRON.plane.z], [APRON.plane.x + 3, APRON.plane.z + 3.6], [APRON.plane.x + 3, APRON.plane.z - 3.6]].map(([x, z]) => groundShadow(Q, 3, 3, x, z, 0, 0.7));
  Q.props.shadows = { shadows, wheelShadows };
  /* its walls: the fuselage, the two port engines, the port main gear (the nose gear is inside the fuselage footprint) */
  wall(Q, APRON.plane.x - 22.9, APRON.plane.z - 1.9, APRON.plane.x + 23.0, APRON.plane.z + 1.9);
  for (const [lz, lx] of [[7.4, -0.69], [13.2, -4.0]]) {
    const ex = APRON.plane.x - lx, ez = APRON.plane.z + lz;
    wall(Q, ex - 2.3, ez - 0.75, ex + 2.3, ez + 0.75);
  }
  wall(Q, APRON.plane.x + 3 - 1.0, APRON.plane.z + 3.6 - 0.45, APRON.plane.x + 3 + 1.0, APRON.plane.z + 3.6 + 0.45);
  /* the DC-9 east of it, another of the airline's first four jets, parked nose west */
  const small = dc9();
  add(Q, small, 66, -12, 0, Math.PI);
  P.dynamic(small);
  Q.props.plane2 = small;
  /* the boarding steps at the forward door: blue and white, the platform against the fuselage */
  const steps = P.airstairs({ top: DC8.doors[0].sill, run: 4.6, w: 1.25, treads: 12 });
  add(Q, steps, APRON.stairs.x, APRON.stairs.z, 0, 0);
  P.dynamic(steps);
  Q.props.stairs = steps;
  wall(Q, APRON.stairs.x - 0.75, APRON.plane.z + 1.9, APRON.stairs.x + 0.75, APRON.stairs.z + 4.7);
  /* ground gear: a power cart at the nose, chocks at the main wheels, cones */
  const cart = P.powerCart();
  add(Q, cart, -17.5, -2.5, 0, 0.2);
  wall(Q, -18.4, -3.0, -16.6, -2.0);
  for (const dx of [-0.5, 0.5]) add(Q, P.chock(), APRON.plane.x + 3 + dx * 1.3, APRON.plane.z + 3.6 + 0.9, 0, 0);
  for (const [x, z] of [[6.0, 14.5], [17.0, 14.5], [-14.5, -1.4], [3.5, -2.2]]) add(Q, P.cone(), x, z, 0, 0);
  /* the first flight (content.js FILMS.takeoff): the crew wave, the steps are pulled away, the DC-8 taxis west, turns out to the runway at
     z -83, rolls east and lifts off. keys: [time, x, z, yaw, height, pitch]; the plane's yaw is its heading (west is pi, north is pi/2, east is 0). */
  const smooth = (k) => k * k * (3 - 2 * k);
  const KEYS = [
    [0, 8, -8, Math.PI, 0, 0],
    [7, 8, -8, Math.PI, 0, 0],
    [14, -30, -8, Math.PI, 0, 0],
    [18, -42, -16, Math.PI * 0.72, 0, 0],
    [21, -46, -28, Math.PI * 0.5, 0, 0],
    [27, -46, -68, Math.PI * 0.5, 0, 0],
    [30, -40, -80, Math.PI * 0.2, 0, 0],
    [32, -34, -83, 0, 0, 0],
    [34, -34, -83, 0, 0, 0],
    [40, 110, -83, 0, 0, 0],
    [42, 170, -83, 0, 0.5, 0.14],
    [46, 330, -83, 0, 38, 0.2],
  ];
  const jetAt = (t) => {
    let i = 0;
    while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], k = smooth(Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))));
    return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k);
  };
  Q.films.takeoff = (t) => {
    const [x, z, yaw, y, pitch] = t < 0 ? [APRON.plane.x, APRON.plane.z, Math.PI, 0, 0] : jetAt(t);
    jet.position.set(x, y, z);
    jet.rotation.set(0, yaw, pitch, "YXZ");
    for (const sh of [...shadows, ...wheelShadows]) sh.visible = t < 0 || y < 0.3 || false;
    if (t >= 0) { shadows[0].position.set(x, 0.02, z); shadows[0].rotation.z = yaw; shadows[0].scale.setScalar(Math.max(0.05, 1 - y / 14)); wheelShadows.forEach((w) => (w.visible = false)); }
    steps.visible = t < 0 || t < 5;
    steps.position.z = APRON.stairs.z + (t > 3 && t < 5 ? (t - 3) * 3 : 0);
    if (t < 0) steps.position.z = APRON.stairs.z;
  };
  return { jet, steps };
}

/* 1. The apron: the crew stand in a line along the plane, facing the terminal, as in the photograph of the first crew; Aunt Marcia is the one nearest
   the steps. Captain Ross stands by the nose wheel; Mr Hines is at the foot of the steps with his loading sheet. */
function apron() {
  const Q = base("apron", [-34, -5.5, 36, 27.2], [-3, 24, 0]);
  scene(Q);
  const lineZ = APRON.line.z;
  person(Q, "marcia", "marcia", -8.0, lineZ, 0, { kind: "idle" });
  person(Q, "hines", "hines", -4.4, 0.5, face(-4.4, 0.5, -6.2, 0.0), { kind: "idle" }, { held: "clipboard", raw: true });
  person(Q, "ross", "ross", -12.4, 0.0, face(-12.4, 0.0, -2, 6), { kind: "idle" }, { held: "bag", raw: true });
  const looks = ["wr_lwoman62", "wr_bwoman62", "wr_may62"];
  const left = [-13.6, -12.5, -11.4, -10.3, -9.2], right = [-4.4, -3.3, -2.2, -1.1, 0.0, 1.1, 2.2, 3.3];
  [...left, ...right].forEach((x, i) =>
    crowd(Q, looks[i % looks.length], x, lineZ + (i % 2) * 0.12, 0, { kind: "watch", at: [0, 14], react: ["Wave"], every: [5, 9] }, { line: true }),
  );
  /* families who came to see the first flight, waiting on the apron on this special morning (docs/games/air-jamaica.md: how close the public could get) */
  const fam = [[-20, 20, "wr_bman62"], [-18.4, 20.6, "wr_bwoman62"], [-19.2, 19.2, "wr_bboy62"], [18, 22, "wr_sam62"], [19.4, 22.4, "wr_lwoman62"], [-6, 21, "wr_may62"]];
  fam.forEach(([x, z, look]) => crowd(Q, look, x, z, face(x, z, -6, -2), { kind: "watch", at: [-6, -2], react: ["Wave"], every: [4, 8] }));
  Q.keepOff = [{ pts: [[-3, 24], [-3, 12], [-5, 2]], w: 1.4 }];
  Q.lookViews = {
    tail: { p: [23.5, 2.4, 5.5], look: [23.6, DC8_Y0() + 6.8, -7.9], fov: 38 },
    crew: { p: [-15.6, 1.45, 2.2], look: [-2.2, 1.35, lineZ], fov: 46 },
  };
  Q.enter = () => {};
  return Q;
}
const DC8_Y0 = () => 3.2;

/* 2. The waving gallery: an open deck on the roof of a low building at the end of the terminal canopy, reached by a staircase outside. Families stand
   at its rail to wave and to watch the planes leave. Mum is there; Aunt Marcia is aboard. The first flight is watched from here. */
function gallery() {
  const G = GALLERY;
  const Q = base("gallery", [G.x0 + 0.5, G.z0 + 0.55, G.x1 - 0.5, G.z1 - 0.5], [G.x1 - 2.2, G.z1 - 1.2, 0]);
  scene(Q, { deck: true });
  Q.deck = G.top; /* the player's eye and the guide arrow stand on the deck (main.js deckY) */
  Q.ground = () => G.top; /* the audits and the people stand on it too */
  Q.groundAt = Q.ground;
  /* Mum and the other families stand along the front rail, looking out over the apron */
  person(Q, "mum", "mum", G.x1 - 3.9, G.z0 + 1.0, face(G.x1 - 3.9, G.z0 + 1.0, 8, -8), { kind: "idle" }, { ground: G.top });
  const spots = [[G.x0 + 1.4, G.z0 + 0.9, "wr_bman62"], [G.x0 + 2.8, G.z0 + 0.9, "wr_bwoman62"], [G.x1 - 7.1, G.z0 + 1.6, "wr_bboy62"], [G.x1 - 1.6, G.z0 + 1.0, "wr_lwoman62"]];
  spots.forEach(([x, z, look]) => crowd(Q, look, x, z, face(x, z, 8, -8), { kind: "watch", at: [8, -8], react: ["Wave"], every: [3, 6] }, { ground: G.top }));
  Q.keepOff = [];
  Q.lookViews = {};
  Q.enter = () => {};
  return Q;
}
/* 3. The flight deck of the DC-8, coming in to land at Kingston. The cockpit is built in its own small room; the airport is built outside its
   windows (the same airport as the apron, rotated so the runway lies ahead) and moved past the windscreen for the landing. The crew of three sit in
   their seats; Dee stands behind them. Chapter 2 (docs/games/air-jamaica.md, "Cockpit"). */
function cockpit() {
  const Q = base("cockpit", [-0.55, 0.55, 0.7, 1.1], [0.1, 0.9, 0]);
  Q.light = { top: 0x6fa8dc, hor: 0xe3eef2, fog: [0xdce8ee, 900, 9000], sun: [0xfff2d0, 2.6, -30, 60, 40], hemi: [0xffffff, 0x9aa8a8, 2.5], fill: 1.35 };
  Q.beds = { wind: 0.02 };
  const room = buildCockpit();
  P.dynamic(room);
  Q.group.add(room);
  /* the world outside: the airport, rotated so that its runway (along +x) runs ahead of the nose (-z), held on a pivot at the pilots' eyes */
  const X = base("outside", [-1, -1, 1, 1], [0, 0, 0]);
  scene(X);
  X.films = {};
  const pivot = grp(Q.group, 0, 1.35, 0);
  const ext = grp(pivot);
  ext.rotation.y = Math.PI / 2;
  ext.add(X.group);
  Q.tickers.push(...X.tickers);
  Q.props.pivot = pivot;
  Q.props.ext = ext;
  /* the crew of three, seated: the captain on the left, the first officer on the right, the flight engineer behind him, turned to his panel */
  const sit = (look, S, ry) => crowd(Q, look, S.x, S.z, ry, { kind: "sit", seat: { top: S.top, x: S.x, z: S.z, ry }, clips: ["SitIdle"] });
  sit("wr_conductor62", SEATS.captain, Math.PI);
  sit("wr_sam62", SEATS.first, Math.PI);
  sit("wr_bman62", SEATS.engineer, Math.PI / 2);
  /* the walls: the seats, the pedestal, the columns, the front wall, the engineer's panel, the jump seat */
  wall(Q, -1.0, -0.45, -0.4, 0.15);
  wall(Q, 0.4, -0.45, 1.0, 0.15);
  wall(Q, -0.27, -1.6, 0.27, -0.4);
  wall(Q, 0.75, 0.3, 1.3, 0.85);
  wall(Q, -1.2, 1.0, -0.6, 1.4);
  Q.lookViews = {
    panel: { p: [-0.45, 1.12, -0.55], look: [-0.7, 0.75, -1.8], fov: 34 },
    levers: { p: [0.05, 1.05, -0.35], look: [0.0, 0.55, -1.1], fov: 36 },
  };
  /* the landing (content.js FILMS.landing): the aircraft's place on the approach in the airport's own coordinates, [time, x along the runway, height of
     the wheels, pitch]. The airport is moved the opposite way past the windscreen. Touchdown is at x -440. */
  const KEYS = [
    [0, -1750, 66, -0.03],
    [12, -1150, 36, -0.035],
    [22, -600, 11, -0.035],
    [26, -490, 2.6, 0.0],
    [28, -440, 0.0, 0.05],
    [30, -400, 0.0, 0.02],
    [38, -180, 0.0, 0.0],
    [46, 40, 0.0, 0.0],
  ];
  const at = (t) => {
    let i = 0;
    while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], k = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
    return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k);
  };
  Q.films.landing = (t) => {
    const [ax, ay, pitch] = t < 0 ? [-250, 0, 0] : at(t);
    const az = -83; /* the runway's centre line */
    ext.position.set(-az, -(ay + 3.8), ax);
    pivot.rotation.x = -pitch;
  };
  Q.films.landing(-1);
  Q.enter = () => {};
  return Q;
}
const builders = { apron, gallery, cockpit };
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  Q.itemStarts = {};
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
