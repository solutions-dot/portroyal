/* The places of the story. Chapter 1: the apron at Palisadoes Airport, Kingston, on the morning of 1 April 1969, the first day of Air Jamaica's
   own flying (docs/games/air-jamaica.md). The terminal, tower, runway and sea are in airport.js (adapted from Selassie's Palisadoes). The
   DC-8 stands nose west with its door side, the port side, toward the terminal and the player; the boarding steps stand at its forward door;
   a DC-9, another of the first four jets, stands behind it. The crew stand in a line along the plane, as in the photograph of the first crew.
   Story people: person(). Background people: crowd(). Walls: wall(). Every solid thing lists its walking wall; the audits check them. */
import * as THREE from "three";
import { T, std, solid, plane, grp, batchStatic } from "./gfx.js";
import * as P from "./props.js";
import { dc8, dc9, DC8 } from "./planes.js";
import { airport } from "./airport.js";
import { AU, noiseHit } from "../../../engine/audio.js";

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

function apron() {
  const Q = base("apron", [-34, -5.5, 36, 30], [-3, 25, 0]);
  Q.beds = { wind: 0.04, crowd: 0.03 };
  Q.light = { top: 0x4f9ed6, hor: 0xe6eee4, fog: [0xd8e6e6, 260, 1400], sun: [0xfff2d0, 2.8, -40, 60, 40], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  /* the concrete apron, a large pale slab, with the grass and sea set round it by airport() */
  const ap = plane(150, 130, std(T.concrete([60, 52], [168, 165, 154])), 0, 0.001, 8, Q.group);
  ap.rotation.x = -Math.PI / 2;
  ap.name = "terrain";
  airport(Q);
  /* the DC-8, nose west, the port side (the door side) toward the terminal */
  const jet = dc8();
  add(Q, jet, APRON.plane.x, APRON.plane.z, 0, Math.PI);
  P.dynamic(jet);
  Q.props.plane = jet;
  Q.props.jetHome = { x: APRON.plane.x, z: APRON.plane.z, ry: Math.PI };
  /* its walls: the fuselage, the two port engines, the nose gear is inside the fuselage footprint, the port main gear */
  wall(Q, APRON.plane.x - 22.9, APRON.plane.z - 1.9, APRON.plane.x + 23.0, APRON.plane.z + 1.9);
  for (const [lz, lx] of [[7.4, -0.69], [13.2, -4.0]]) {
    const ex = APRON.plane.x - lx, ez = APRON.plane.z + lz;
    wall(Q, ex - 2.3, ez - 0.75, ex + 2.3, ez + 0.75);
  }
  wall(Q, APRON.plane.x + 3 - 1.0, APRON.plane.z + 3.6 - 0.45, APRON.plane.x + 3 + 1.0, APRON.plane.z + 3.6 + 0.45);
  /* the DC-9 behind it, another of the airline's first four jets, parked nose west, well off to the side */
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
  /* ground gear: a power cart at the nose, chocks at the main wheels, cones at the wing tip */
  const cart = P.powerCart();
  add(Q, cart, -17.5, -2.5, 0, 0.2);
  wall(Q, -18.4, -3.0, -16.6, -2.0);
  for (const dx of [-0.5, 0.5]) add(Q, P.chock(), APRON.plane.x + 3 + dx * 1.3, APRON.plane.z + 3.6 + 0.9, 0, 0);
  for (const [x, z] of [[6.0, 14.5], [17.0, 14.5], [-14.5, -1.4], [3.5, -2.2]]) add(Q, P.cone(), x, z, 0, 0);
  /* the people. The crew stand in a line along the plane, facing the terminal, as in the photograph; Aunt Marcia is the one nearest the
     steps. Captain Ross stands by the nose wheel; Mr Hines is at the foot of the steps with his loading sheet. */
  const lineZ = APRON.line.z;
  person(Q, "marcia", "marcia", -8.0, lineZ, 0, { kind: "idle" });
  person(Q, "hines", "hines", -4.4, 0.5, face(-4.4, 0.5, -6.2, 0.0), { kind: "idle" }, { held: "clipboard", raw: true });
  person(Q, "ross", "ross", -12.4, 0.0, face(-12.4, 0.0, -2, 6), { kind: "idle" }, { held: "bag", raw: true });
  const looks = ["wr_lwoman62", "wr_bwoman62", "wr_may62", "wr_pearl62"];
  const left = [-13.6, -12.5, -11.4, -10.3, -9.2], right = [-4.4, -3.3, -2.2, -1.1, 0.0, 1.1, 2.2, 3.3];
  [...left, ...right].forEach((x, i) =>
    crowd(Q, looks[i % looks.length], x, lineZ + (i % 2) * 0.12, 0, { kind: "watch", at: [0, 14], react: ["Wave"], every: [5, 9] }, { line: true }),
  );
  /* a few passengers in the terminal forecourt, and the families who came to see the first flight */
  const fam = [[-20, 20, "wr_bman62"], [-18.4, 20.6, "wr_bwoman62"], [-19.2, 19.2, "wr_bboy62"], [18, 22, "wr_sam62"], [19.4, 22.4, "wr_lwoman62"], [24, 17, "wr_may62"], [25.2, 17.8, "wr_bman62"], [-6, 21, "wr_pearl62"]];
  fam.forEach(([x, z, look], i) =>
    crowd(Q, look, x, z, face(x, z, -6, -2), { kind: "watch", at: [-6, -2], react: ["Wave", "Clap"], every: [4, 8] }),
  );
  /* keep the way clear from the player's start to the steps and the crew */
  Q.keepOff = [{ pts: [[-3, 25], [-3, 12], [-5, 2]], w: 1.4 }];
  /* looks: where the camera goes for each thing the player is sent to see (steps.js LOOKS names them) */
  const sockY = DC8.Y0;
  void sockY;
  Q.lookViews = {
    tail: { p: [23.5, 2.4, 5.5], look: [24.0, sockY + 6.8, -7.9], fov: 38 },
    crew: { p: [-15.6, 1.45, 2.2], look: [-2.2, 1.35, lineZ], fov: 46 },
    steps: { p: [-3.2, 1.7, 3.4], look: [-6.2, 2.4, -4.6], fov: 44 },
    nose: { p: [-19.0, 1.7, 1.8], look: [-14.4, 3.1, -8.0], fov: 44 },
  };
  /* the first flight (content.js FILMS.takeoff): the crew wave, the steps are pulled away, the DC-8 taxis west, turns out to the runway at z -83, rolls
     east and lifts off. keys: [time, x, z, yaw, height, pitch]; the plane's yaw is its heading (west is pi, north is pi/2, east is 0). */
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
    steps.visible = t < 0 || t < 5;
    if (steps.visible) steps.position.z = APRON.stairs.z + (t > 3 && t < 5 ? (t - 3) * 3 : 0);
    if (t < 0) steps.position.z = APRON.stairs.z;
  };
  Q.enter = () => {};
  return Q;
}
const builders = { apron };
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  Q.itemStarts = {};
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
