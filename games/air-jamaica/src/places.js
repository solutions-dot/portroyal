/* The places of the story. Chapter 1: the apron at Palisadoes Airport, Kingston, on the morning of 1 April 1969, the first day of Air Jamaica's
   own flying (docs/games/air-jamaica.md). The terminal, tower, runway and sea are in airport.js (adapted from Selassie's Palisadoes). The
   DC-8 stands nose west with its door side, the port side, toward the terminal and the player; the boarding steps stand at its forward door;
   a DC-9, another of the first four jets, stands behind it. The crew stand in a line along the plane, as in the photograph of the first crew.
   Story people: person(). Background people: crowd(). Walls: wall(). Every solid thing lists its walking wall; the audits check them. */
import * as THREE from "three";
import { T, std, solid, plane, grp, batchStatic, box, cyl, cv } from "./gfx.js";
import * as P from "./props.js";
import { dc8, dc9, a320, DC8, A320 } from "./planes.js";
import { airport, GALLERY, HANGAR } from "./airport.js";
import { buildCockpit, SEATS } from "./cockpit.js";
import { buildCabin, CABIN, DISHES, lidPlace, buildMagazine, magazineAt } from "./cabin.js";
import { AU, noiseHit } from "../../../engine/audio.js";
import { reachTo } from "../../../engine/grip.js";
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
  stairs: { x: -9.0, z: -4.86 },   /* under the forward door (planes.js DC8.doors: 17.0 along the body) */ // the foot of the platform; the steps run toward +z
  line: { z: -3.2 }, // the crew's line along the fuselage
};

/* what both places share: the airport, the DC-8 at the steps, the DC-9 behind it, the ground gear. Returns the parts the first-flight scene moves. */
function scene(Q, { deck = false, later = false } = {}) {
  Q.beds = { wind: 0.04, crowd: 0.03 };
  Q.light = { top: 0x4f9ed6, hor: 0xe6eee4, fog: [0xd8e6e6, 260, 1400], sun: [0xfff2d0, 2.8, -40, 60, 40], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  /* the concrete apron: a large pale slab, with the grass and sea set round it by airport() */
  const ap = plane(150, 130, std(T.concrete([60, 52], [168, 165, 154])), 0, 0.001, 8, Q.group);
  ap.rotation.x = -Math.PI / 2;
  ap.name = "terrain";
  airport(Q, { deck, later });
  /* the jet, nose west, the port side (the door side) toward the terminal: in 1969 the DC-8 with its door open at the steps; in the later chapters an
     Airbus A320 in the blue-tail look, its doors shut */
  const S = later ? A320 : DC8;
  const jet = later ? a320({}) : dc8({ doorOpen: true });
  add(Q, jet, APRON.plane.x, APRON.plane.z, 0, Math.PI);
  P.dynamic(jet);
  Q.props.plane = jet;
  /* for the first flight the door is shut before she moves: a copy with the door closed takes over once the steps have rolled away (the open door
     and its slab stayed out while she taxied: owner, 25 November 2026) */
  const shut = later ? null : dc8({});
  if (shut) { P.dynamic(shut); shut.visible = false; }   /* kept out of the place until she moves (the audit saw it inside the other copy) */
  /* its shadow: a long soft patch under the fuselage, and a smaller one under each set of wheels */
  const half = S.profile[S.profile.length - 1][0], G0 = S.gear, mainWX = APRON.plane.x - G0.mainX;
  const shadows = [groundShadow(Q, half * 2 + 6, 15, APRON.plane.x, APRON.plane.z, 0, 0.5)];
  const wheelShadows = [[APRON.plane.x - G0.noseX, APRON.plane.z], [mainWX, APRON.plane.z + G0.mainZ], [mainWX, APRON.plane.z - G0.mainZ]].map(([x, z]) => groundShadow(Q, 3, 3, x, z, 0, 0.7));
  Q.props.shadows = { shadows, wheelShadows };
  /* its walls: the fuselage, the port engines, the port main gear (the nose gear is inside the fuselage footprint) */
  wall(Q, APRON.plane.x - half - 0.1, APRON.plane.z - 2.0, APRON.plane.x + half + 0.2, APRON.plane.z + 2.0);
  const wg = S.wing, lead = (z) => wg.root[0] + (wg.tip[0] - wg.root[0]) * (z / wg.span);
  for (const lz of S.engines.z) {
    const ex = APRON.plane.x - (lead(lz) + 0.5 + (S.engines.fwd || 0)), ez = APRON.plane.z + lz, hl = S.engines.len / 2 + 0.3, hw = S.engines.r + 0.15;
    wall(Q, ex - hl, ez - hw, ex + hl, ez + hw);
  }
  wall(Q, mainWX - 1.0, APRON.plane.z + G0.mainZ - 0.45, mainWX + 1.0, APRON.plane.z + G0.mainZ + 0.45);
  /* 1969: the DC-9 east of it, another of the airline's first four jets, parked nose west, and the boarding steps at the DC-8's forward door */
  let steps = null;
  if (!later) {
    const small = dc9();
    add(Q, small, 66, -12, 0, Math.PI);
    P.dynamic(small);
    Q.props.plane2 = small;
    steps = P.airstairs({ top: DC8.doors[0].sill, run: 3.9, w: 1.25, treads: 10 });
    add(Q, steps, APRON.stairs.x, APRON.stairs.z, 0, 0);
    P.dynamic(steps);
    Q.props.stairs = steps;
    wall(Q, APRON.stairs.x - 0.75, APRON.plane.z + 1.9, APRON.stairs.x + 0.75, APRON.stairs.z + 4.0);
  }
  /* ground gear: a power cart at the nose, chocks at the main wheels, cones */
  const cart = P.powerCart();
  add(Q, cart, -17.5, -2.5, 0, 0.2);
  wall(Q, -18.4, -3.0, -16.6, -2.0);
  for (const dx of [-0.5, 0.5]) add(Q, P.chock(), mainWX + dx * 1.3, APRON.plane.z + G0.mainZ + 0.9, 0, 0);
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
    if (shut) { const closed = t >= 5.5; if (closed && !shut.parent) Q.group.add(shut); if (!closed && shut.parent) shut.parent.remove(shut); shut.position.copy(jet.position); shut.rotation.copy(jet.rotation); shut.visible = closed; jet.visible = !closed; }
    for (const sh of [...shadows, ...wheelShadows]) sh.visible = t < 0 || y < 0.3 || false;
    if (t >= 0) { shadows[0].position.set(x, 0.02, z); shadows[0].rotation.z = yaw; shadows[0].scale.setScalar(Math.max(0.05, 1 - y / 14)); wheelShadows.forEach((w) => (w.visible = false)); }
    if (steps) {
      /* the steps are rolled back from the door, well clear of the wing, and left standing there while she taxis away (they used to vanish at 5 s,
         after moving only 3 m, so she seemed to leave with them still at the door) */
      steps.visible = true;
      steps.position.z = APRON.stairs.z + (t < 0 ? 0 : 7 * smooth(Math.max(0, Math.min(1, (t - 2) / 4))));
    }
  };
  Q.jetPose = (x, z, yaw, y, pitch) => {   /* for a place's own camera scene: put the jet and its shadow somewhere */
    jet.position.set(x, y, z);
    jet.rotation.set(0, yaw, pitch, "YXZ");
    shadows[0].visible = y < 14; shadows[0].position.set(x, 0.02, z); shadows[0].rotation.z = yaw; shadows[0].scale.setScalar(Math.max(0.05, 1 - y / 14));
    wheelShadows.forEach((w) => (w.visible = false));
  };
  Q.jetKeys = (KEYS) => (t) => { let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++; const a = KEYS[i], b = KEYS[i + 1], k = smooth(Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])))); return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k); };
  return { jet, steps };
}

/* 1. The apron: the crew stand in a line along the plane, facing the terminal, as in the photograph of the first crew; Aunt Marcia is the one nearest
   the steps. Captain Ross stands by the nose wheel; Mr Hines is at the foot of the steps with his loading sheet. */
function apron() {
  const Q = base("apron", [-34, -5.5, 36, 27.2], [-3, 24, 0]);
  scene(Q);
  const lineZ = APRON.line.z;
  person(Q, "marcia", "marcia", -7.4, lineZ, 0, { kind: "idle" });   /* nearest the steps, which stand under the door at x -9 */
  person(Q, "hines", "hines", -7.4, 0.6, face(-7.4, 0.6, -9.0, 0.0), { kind: "idle" }, { held: "clipboard" });   /* at the foot of the steps */
  person(Q, "ross", "ross", -12.4, 0.0, face(-12.4, 0.0, -2, 6), { kind: "idle" }, { held: "bag" });
  const looks = ["aj_crew1", "aj_crew2", "aj_crew3", "aj_crew4", "aj_crew5"];
  const left = [-15.8, -14.7, -13.6, -12.5, -11.4], right = [-6.3, -5.2, -4.1, -3.0, -1.9, -0.8, 0.3, 1.4];   /* a gap for the steps at x -9 */
  [...left, ...right].forEach((x, i) =>
    crowd(Q, looks[i % looks.length], x, lineZ + (i % 2) * 0.12, 0, { kind: "watch", at: [0, 14], react: ["Wave"], every: [5, 9] }, { line: true }),
  );
  /* a white flight bag at each crew member's feet, beside her (the 1969 advertisement), Aunt Marcia's too */
  for (const [i, x] of [...left, -7.4, ...right].entries()) {
    const z = lineZ + (x === -7.4 ? 0 : ([...left, ...right].indexOf(x) % 2) * 0.12);
    add(Q, P.flightBag(), x + 0.37, z + 0.05, 0, 0);
    wall(Q, x + 0.3, z - 0.14, x + 0.44, z + 0.24);
    void i;
  }
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
  const Q = base("cockpit", [-1.15, 0.6, 0.95, 2.05], [-0.1, 1.55, 0]);   /* the room runs 0.9 m further back so you can step away from the seats and see all three crew (owner, 25 November 2026) */
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
  const sit = (look, S, ry, clips = ["SitIdle"]) => crowd(Q, look, S.x, S.z, ry, { kind: "sit", seat: { top: S.top, x: S.x, z: S.z, ry }, clips });
  sit("aj_ross", SEATS.captain, Math.PI);
  sit("aj_first", SEATS.first, Math.PI);
  sit("aj_engineer", SEATS.engineer, Math.PI / 2, ["SitSwitches"]);   /* at his panel, setting switches (the owner's Mixamo "Pilot Flips Switches") */
  /* the walls: the seats, the pedestal, the columns, the front wall, the engineer's panel, the jump seat */
  wall(Q, -1.0, -0.8, -0.4, -0.2);   /* the pilots' seats, slid forward */
  wall(Q, 0.4, -0.8, 1.0, -0.2);
  wall(Q, -0.27, -1.6, 0.27, -0.4);
  wall(Q, 0.4, 0.3, 1.3, 0.85);
  wall(Q, -1.2, 1.9, -0.6, 2.3);   /* the jump seat, folded against the back wall */
  wall(Q, 1.1, 0.3, 1.45, 1.5);   /* the engineer's desk under his longer panel */
  Q.view = { pos: [0.05, 1.5, 0.75], look: [0.0, 1.05, -2.2] };
  Q.lookViews = {
    panel: { p: [-0.6, 1.26, -0.85], look: [-0.62, 0.72, -1.82], fov: 40 },
    levers: { p: [0.3, 1.18, -0.62], look: [0.0, 0.78, -1.36], fov: 42 },
  };
  /* the landing (content.js FILMS.landing): the aircraft's place on the approach in the airport's own coordinates, [time, x along the runway, height of
     the wheels, pitch]. The airport is moved the opposite way past the windscreen. Touchdown is at x -440. */
  /* on a 3 degree glide path (a usual approach angle) to the aiming point at x -560, coming in over the sea at about 75 m a second (roughly 145 knots),
     the flare over the threshold (x -900) and touchdown at 28.5 s, with the caption "Bump!". It started 850 m short of the runway at 66 m, so it looked as
     if the plane was already on the ground (owner, 25 November 2026). A slight nose-down pitch keeps the runway in view over the glareshield. */
  const KEYS = [
    [0, -2700, 113, -0.075],
    [10, -1950, 74, -0.07],
    [18, -1350, 42, -0.065],
    [24, -900, 18, -0.05],
    [27, -680, 5, -0.01],
    [28.5, -570, 0.0, 0.045],
    [30.5, -430, 0.0, 0.02],
    [38, -120, 0.0, 0.0],
    [46, 40, 0.0, 0.0],
  ];
  const at = (t) => {
    let i = 0;
    while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], k = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
    return a.slice(1).map((v, j) => v + (b[j + 1] - v) * k);
  };
  /* the two pilots fly it: both hands on their control wheel's grips through the landing (owner, 25 November 2026: "they are not holding the controls").
     The engine's two-bone reach (engine/grip.js reachTo) sets each arm after the body's own clip has played this frame (the people tick before the film). */
  const _g = new THREE.Vector3();
  const hold = () => {
    for (const [look, sx] of [["aj_ross", -0.7], ["aj_first", 0.7]]) {
      const n = Q.extras.find((e) => e.look === look);
      if (!n) continue;
      for (const [side, dx] of [["Left", -0.17], ["Right", 0.17]]) reachTo(n.m, side, room.localToWorld(_g.set(sx + dx, 0.95, -1.08)));
    }
  };
  Q.films.landing = (t) => {
    const [ax, ay, pitch] = t < 0 ? [-250, 0, 0] : at(t);
    const az = -83; /* the runway's centre line */
    ext.position.set(-az, -(ay + 3.8), ax);
    pivot.rotation.x = -pitch;
    if (t >= 0 && t < 44) hold();
  };
  Q.films.landing(-1);
  Q.enter = () => {};
  return Q;
}
/* 4. The cabin of a jet in the 2000s, on a flight from Jamaica to Toronto (chapter 3, "The flying chef"; cabin.js says what is a general picture).
   Mum waits at the back; the flying chef stands by his trolley in the galley at the front; Mr Clarke sits in row 2 on the aisle, his tray down. */
function cabin() {
  const Q = base("cabin", [-1.85, -4.24, 1.85, 3.6], [0.35, 3.0, 0]);
  Q.light = { top: 0x8fbce6, hor: 0xeef2f4, fog: [0xe6edf2, 40, 400], sun: [0xfff4e0, 1.4, -20, 40, 30], hemi: [0xffffff, 0xb8b4a8, 2.6], fill: 1.4 };
  Q.indoor = true;
  Q.beds = { wind: 0.0 };
  const room = buildCabin();
  P.dynamic(room);
  Q.group.add(room);
  const { plates, lids } = room.userData.parts;
  /* the plate the player carries is a thing of the place, not of the trolley */
  Q.group.add(plates.ackee);
  P.dynamic(plates.ackee);
  Q.items.plate = plates.ackee;
  /* SkyWritings in the pocket of the seat in front of Tia's seat (row 5, aisle, left) */
  const mag = buildMagazine();
  Q.group.add(mag);
  P.dynamic(mag);
  magazineAt(mag, 0);
  Q.reveal = {
    magazine: (k) => magazineAt(mag, Number(k)),
    trolley: (k) => {
      k = Number(k);
      DISHES.forEach((d, i) => lids[d].position.set(...lidPlace(i, k)));
    },
  };
  const R = CABIN.rows, X = CABIN.seatX, top = CABIN.seatTop;
  const seatAt = (x, z, clips = ["SitIdle"]) => ({ kind: "sit", seat: { top, x, z, ry: Math.PI }, clips });
  /* Mum in her seat near the back, beside Tia's empty aisle seat (row 4 on the left); she stood behind the seats with her head in the bins (owner, 25 November 2026) */
  person(Q, "dee2", "dee2", -X[1], R[3], Math.PI, seatAt(-X[1], R[3], ["SitIdle", "SitTalk"]));
  person(Q, "chef", "chef", 0.92, -3.86, face(0.92, -3.86, 0.1, -3.0), { kind: "idle" });
  person(Q, "clarke", "clarke", X[0], R[1], Math.PI, seatAt(X[0], R[1]));
  crowd(Q, "aj_pass04", X[2], R[2], Math.PI, seatAt(X[2], R[2]));   /* moved across the aisle: Mum has his old seat */
  /* the walls: the two blocks of seats with the galley's side screens, the counter, the trolley */
  for (const sg of [-1, 1]) wall(Q, sg < 0 ? -CABIN.half : CABIN.aisle, CABIN.rows[0] - 0.65, sg < 0 ? -CABIN.aisle : CABIN.half, CABIN.rows[CABIN.rows.length - 1] + 0.35);
  wall(Q, -1.6, CABIN.counter.z0, 1.6, CABIN.counter.z1);
  wall(Q, -0.42, CABIN.trolley.z - 0.17, 0.42, CABIN.trolley.z + 0.17);
  Q.view = { pos: [0, 1.5, 2.6], look: [0, 1.1, -3] };
  Q.keepOff = [];
  Q.lookViews = {
    trolley: { p: [0.3, 1.42, -3.4], look: [0.0, 1.0, -4.1], fov: 42 },
    magazine: { p: [-(CABIN.seatX[0] - 0.07), 1.45, CABIN.rows[3] + 0.97], look: [-CABIN.seatX[0], 0.84, CABIN.rows[3] + 0.41], fov: 44 },
  };
  Q.enter = () => {};
  return Q;
}
/* 5. New colours (December 1994): the apron at Norman Manley Airport, the new-look Airbus outside the hangar before its first flight in the new
   colours. Aunt Marcia (off duty) and Mr Hines, now an engineer, stand by it; guests and staff look on. The A320 and the hangar: planes.js and
   airport.js say what is a general picture. */
function newlook() {
  const Q = base("newlook", [-34, -5.5, 36, 33.4], [-3, 24, 0]);
  scene(Q, { later: true });
  Q.light = { top: 0x4f9ed6, hor: 0xe6eee4, fog: [0xd8e6e6, 260, 1400], sun: [0xfff2d0, 2.8, -40, 60, 40], hemi: [0xffffff, 0x8aa0a0, 2.6] };
  person(Q, "marcia94", "marcia94", -2.5, 2.2, face(-2.5, 2.2, 4, -4), { kind: "idle" });
  person(Q, "hines94", "hines94", -12.6, 1.4, face(-12.6, 1.4, -9, -6), { kind: "idle" });
  const guests = [[-7, 6, "aj_guest94a"], [-5.8, 6.6, "aj_guest94b"], [4, 6.2, "aj_guest94c"], [5.4, 5.6, "aj_guest94b"], [12, 7, "aj_guest94a"], [-18, 9, "aj_guest94c"]];
  guests.forEach(([x, z, look]) => crowd(Q, look, x, z, face(x, z, 6, -8), { kind: "watch", at: [6, -8], react: ["Wave", "Nod"], every: [5, 9] }));
  Q.keepOff = [{ pts: [[-3, 24], [-3, 12], [-3, 4]], w: 1.4 }];
  Q.lookViews = {
    tail: { p: [24.5, 2.6, 6.5], look: [24.0, 3.75 + 5.6, -8.0], fov: 38 },
    nose: { p: [-9.5, 1.7, 3.2], look: [-3.4, 4.4, -6.1], fov: 46 },
  };
  /* the new look's first flight (FILMS.newflight): the same way out as in 1969, watched from the apron by the hangar */
  Q.films.newflight = Q.films.takeoff;
  Q.films.reveal = () => {};   /* the plane stands still; the camera does the work (content.js FILMS.reveal) */
  Q.view = { pos: [-3, 1.6, 20], look: [6, 3.2, -8] };
  Q.enter = () => Q.films.takeoff(-1);
  return Q;
}
/* 6. Aunt Marcia's front room in Kingston, April 2010, in the evening: tiled floor, painted walls, a louvre window with a grille, a sofa, a low table
   with her old box on it, a television, pictures. A general picture of a Kingston home of the time, made for the game. */
export const ROOM = { x0: -2.6, x1: 2.6, z0: -2.2, z1: 2.4, h: 2.7, box: [0.35, 0.47, -0.55] };
function home() {
  const R = ROOM, Q = base("home", [R.x0 + 0.1, R.z0 + 0.1, R.x1 - 0.1, R.z1 - 0.1], [0.4, 1.9, 0.4]); /* clear of Mum by the door (the audit had her on the start) */
  Q.indoor = true;
  Q.light = { top: 0x2a3550, hor: 0x7a6a7a, stars: 0, fog: [0x2a2a30, 30, 120], sun: [0xffd8a8, 0.6, -10, 20, 10], hemi: [0xfff0dc, 0x8a7a6a, 2.2], fill: 1.2 };
  Q.beds = { room: 0.03 };
  const g = Q.group, W = R.x1 - R.x0, D = R.z1 - R.z0, cx = (R.x0 + R.x1) / 2, cz = (R.z0 + R.z1) / 2;
  const tiles = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.5 });
  box(W, 0.04, D, tiles, cx, -0.02, cz, g);
  for (let x = R.x0 + 0.5; x < R.x1; x += 0.5) box(0.01, 0.002, D, solid(0xb8b0a0, 0.6), x, 0.001, cz, g);
  for (let z = R.z0 + 0.5; z < R.z1; z += 0.5) box(W, 0.002, 0.01, solid(0xb8b0a0, 0.6), cx, 0.001, z, g);
  const paint = solid(0xcfe0c8, 0.9), trim = solid(0xf2efe6, 0.7), wood = solid(0x6a4630, 0.6), dark = solid(0x2a2522, 0.6);
  box(W, R.h, 0.1, paint, cx, R.h / 2, R.z0 - 0.05, g);
  box(W, R.h, 0.1, paint, cx, R.h / 2, R.z1 + 0.05, g);
  box(0.1, R.h, D, paint, R.x0 - 0.05, R.h / 2, cz, g);
  box(0.1, R.h, D, paint, R.x1 + 0.05, R.h / 2, cz, g);
  box(W, 0.06, D, trim, cx, R.h, cz, g);
  for (const [x, z, w, d] of [[cx, R.z0, W, 0.02], [cx, R.z1, W, 0.02], [R.x0, cz, 0.02, D], [R.x1, cz, 0.02, D]]) box(w, 0.1, d, trim, x, 0.05, z, g);
  /* the window on the left wall: glass louvres, half open, with a white grille in front and the evening outside */
  const ev = new THREE.MeshBasicMaterial({ color: 0x5a4a78 }); ev.userData.noGlow = true;
  box(0.02, 1.1, 1.3, ev, R.x0 + 0.01, 1.55, 0.2, g);
  for (let i = 0; i < 9; i++) { const l = box(0.1, 0.012, 1.24, solid(0xb8c8cc, 0.15, 0.2), R.x0 + 0.06, 1.06 + i * 0.12, 0.2, g); l.rotation.z = 0.5; }
  for (let i = 0; i <= 6; i++) box(0.02, 1.12, 0.02, trim, R.x0 + 0.13, 1.55, 0.2 - 0.65 + i * (1.3 / 6), g);
  for (let i = 0; i <= 4; i++) box(0.02, 0.02, 1.32, trim, R.x0 + 0.13, 1.0 + i * 0.275, 0.2, g);
  /* the sofa against the back wall, the low table, the television on its stand, a lamp, pictures */
  const sofa = grp(g, 0.2, 0, -1.75), cloth = solid(0x7a3a3a, 0.95);
  box(2.0, 0.42, 0.8, cloth, 0, 0.21, 0, sofa); box(2.0, 0.5, 0.18, cloth, 0, 0.62, -0.31, sofa);
  for (const x of [-0.92, 0.92]) box(0.18, 0.6, 0.8, cloth, x, 0.3, 0, sofa);
  wall(Q, -0.85, -2.2, 1.25, -1.33);
  const table = grp(g, 0.35, 0, -0.55);
  box(1.1, 0.04, 0.6, wood, 0, 0.43, 0, table);
  for (const [x, z] of [[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]]) box(0.04, 0.42, 0.04, wood, x, 0.21, z, table);
  wall(Q, -0.25, -0.88, 0.95, -0.22);
  const tv = grp(g, 2.2, 0, 0.3);
  box(0.45, 0.55, 1.3, wood, 0, 0.275, 0, tv); box(0.08, 0.5, 0.85, dark, -0.05, 0.84, 0, tv);
  const screen = new THREE.MeshBasicMaterial({ color: 0x334455 }); box(0.01, 0.42, 0.76, screen, -0.1, 0.84, 0, tv);
  wall(Q, 1.95, -0.4, 2.55, 1.0);
  const lampL = new THREE.PointLight(0xffd8a0, 2.2, 7, 1.4); lampL.position.set(-1.6, 2.0, -1.4); g.add(lampL);
  cyl(0.12, 0.16, 0.25, solid(0xf2e6c8, 0.8), -1.6, 2.45, -1.4, g, 12); /* the ceiling light's shade */
  cyl(0.012, 0.012, 0.12, solid(0x2a2a2a, 0.6), -1.6, 2.63, -1.4, g, 6); /* the flex it hangs from, up to the ceiling */
  for (const [x, w, c] of [[-0.6, 0.5, 0x3a6a9a], [0.4, 0.35, 0x8a4a3a], [1.2, 0.45, 0x4a7a4a]]) { box(w + 0.06, w * 0.75 + 0.06, 0.02, wood, x, 1.75, R.z0 + 0.01, g); box(w, w * 0.75, 0.01, solid(c, 0.8), x, 1.75, R.z0 + 0.025, g); }
  /* Aunt Marcia's old box on the table: a wooden box with a lid on hinges at the back. Inside: her yellow dress from 1969, folded; her white gloves; a
     photograph of the first crew in a line */
  const bx = grp(g, ...R.box);
  const boxW = 0.44, boxD = 0.3, boxH = 0.12;
  box(boxW, 0.01, boxD, wood, 0, 0.005, 0, bx);
  for (const [x, z, w, d] of [[0, -boxD / 2, boxW, 0.015], [0, boxD / 2, boxW, 0.015], [-boxW / 2, 0, 0.015, boxD], [boxW / 2, 0, 0.015, boxD]]) box(w, boxH, d, wood, x, boxH / 2, z, bx);
  box(0.3, 0.05, 0.2, solid(0xf2c230, 0.95), -0.04, 0.035, 0.0, bx); /* the yellow dress, folded */
  box(0.3, 0.012, 0.2, solid(0xe0aa20, 0.95), -0.04, 0.062, 0.0, bx);
  for (const dx of [0.13, 0.155]) { const gl = box(0.05, 0.016, 0.11, solid(0xf6f4ee, 0.9), dx + 0.03, 0.072, -0.02, bx); gl.rotation.y = 0.3; }
  const photo = new THREE.MeshStandardMaterial({ roughness: 0.6, map: cv(256, 180, (x, W, H) => {
    x.fillStyle = "#f2efe6"; x.fillRect(0, 0, W, H); x.fillStyle = "#9cc4dc"; x.fillRect(10, 10, W - 20, 90); x.fillStyle = "#b8b4a8"; x.fillRect(10, 100, W - 20, H - 110);
    x.fillStyle = "#f1efe8"; x.fillRect(20, 52, 220, 26); x.fillStyle = "#e86a1c"; x.fillRect(20, 64, 220, 6);
    ["#f3d23a", "#e0457f", "#a8d04a", "#f3d23a", "#e0457f", "#a8d04a", "#f3d23a", "#e0457f", "#a8d04a", "#f3d23a"].forEach((c, i) => { x.fillStyle = "#7a5038"; x.beginPath(); x.arc(32 + i * 21, 102, 4, 0, 7); x.fill(); x.fillStyle = c; x.fillRect(27 + i * 21, 107, 10, 24); x.fillStyle = "#f6f4ee"; x.fillRect(36 + i * 21, 128, 5, 5); });
  }) });
  const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.09), photo); ph.rotation.x = -Math.PI / 2; ph.rotation.z = -0.2; ph.position.set(0.07, 0.083, 0.07); bx.add(ph);
  const lid = grp(bx, 0, boxH, -boxD / 2);
  lid.userData.fixed = true;   /* held on its hinges (audit-reveal) */
  box(boxW + 0.01, 0.018, boxD + 0.01, wood, 0, 0.009, boxD / 2, lid);
  box(0.06, 0.012, 0.03, solid(0xc8a860, 0.3, 0.7), 0, 0.012, boxD - 0.005, lid); /* a little brass clasp */
  P.dynamic(bx);   /* the box and its lid move with the look: left unmarked, the place's merge froze the lid shut (owner, 25 November 2026: "the lid never lift") */
  box(boxW, 0.008, 0.04, solid(0xb08a40, 0.4, 0.6), 0, boxH + 0.004, -boxD / 2, bx);   /* the brass hinge strip along the back edge, that the open lid stands on */
  Q.reveal.box = (k) => { k = Number(k); lid.rotation.x = -1.62 * k; };   /* opens to just past upright, resting on its hinges */
  person(Q, "marcia10", "marcia10", -1.0, -0.2, face(-1.0, -0.2, 0.6, 0.9), { kind: "idle" });
  person(Q, "dee10", "dee10", 1.5, 1.6, face(1.5, 1.6, 0.2, 0.6), { kind: "idle" });
  Q.lookViews = { box: { p: [0.75, 1.15, -0.05], look: [0.35, 0.5, -0.58], fov: 40 } };
  Q.view = { pos: [0.3, 1.5, 2.2], look: [-0.4, 0.9, -1.2] };   /* from the doorway, not right behind Mum */
  Q.enter = () => {};
  return Q;
}
/* 7. The last flight home, 30 April 2010: the cabin of the A320 from Fort Lauderdale, in the evening, coming down toward Kingston (cabin.js says
   what is a general picture). No chef and no trolley on this flight. Mum sits by the window seat beside Tia's; Mr Grant across the aisle. */
function lastflight() {
  const Q = base("lastflight", [-1.85, -2.9, 1.85, 3.6], [0.0, 1.0, 0]);
  Q.light = { top: 0x34406a, hor: 0xe0a080, fog: [0x3a3a4a, 40, 400], sun: [0xffb070, 1.0, -20, 10, 30], hemi: [0xffe8d8, 0x8a7a70, 2.4], fill: 1.4 };
  Q.indoor = true;
  Q.beds = { wind: 0.0, room: 0.02 };
  const room = buildCabin({ dusk: true, trolley: false });
  P.dynamic(room);
  Q.group.add(room);
  const { blinds } = room.userData.parts, R = CABIN.rows, X = CABIN.seatX, top = CABIN.seatTop;
  const blind = blinds["-1:3"]; /* the window beside Tia's seat (row 4 on the left) */
  Q.reveal.window = (k) => { k = Number(k); blind.position.y = 1.18 + 0.2 * k; blind.scale.y = 3.4 - 2.4 * k; };   /* the blind slides up off the window (cabin.js: windows at 1.18 m) */
  const seatAt = (x, z) => ({ kind: "sit", seat: { top, x, z, ry: Math.PI }, clips: ["SitIdle"] });
  person(Q, "dee10s", "dee10", -X[1], R[3], Math.PI, seatAt(-X[1], R[3]));
  person(Q, "grant", "grant", X[0], R[3], Math.PI, seatAt(X[0], R[3]));
  crowd(Q, "aj_pass10", -X[0], R[1], Math.PI, seatAt(-X[0], R[1]));
  crowd(Q, "aj_pass10w", X[1], R[2], Math.PI, seatAt(X[1], R[2]));
  crowd(Q, "aj_pass04", X[2], R[0], Math.PI, seatAt(X[2], R[0]));
  for (const sg of [-1, 1]) wall(Q, sg < 0 ? -CABIN.half : CABIN.aisle, CABIN.rows[0] - 0.65, sg < 0 ? -CABIN.aisle : CABIN.half, CABIN.rows[CABIN.rows.length - 1] + 0.35);
  wall(Q, -1.6, CABIN.counter.z0, 1.6, CABIN.counter.z1);
  Q.view = { pos: [0, 1.5, 2.6], look: [0, 1.1, -3] };
  Q.lookViews = { window: { p: [-1.3, 1.22, 0.78], look: [-1.93, 1.18, CABIN.rows[3] - 0.08], fov: 44 } };
  Q.enter = () => {};
  return Q;
}
/* 8. The arrival at Kingston at evening, 30 April 2010 (FILMS.lastlanding): the A320 comes in over the sea, lands, taxis back and stops by the hangar;
   the camera rises to the bird on its tail. The time of day of the real landing is not known: the evening light is the game's choice. */
function arrival() {
  const Q = base("arrival", [-34, -5.5, 36, 33.4], [-3, 24, 0]);
  scene(Q, { later: true });
  Q.light = { top: 0x2e3f6e, hor: 0xf0a070, fog: [0xd09078, 300, 1600], sun: [0xffa860, 1.6, 80, 14, -60], hemi: [0x9aa0c8, 0x5a4a44, 1.8], fill: 0.5 };
  Q.beds = { wind: 0.04 };
  const pose = Q.jetKeys([
    [0, 760, -83, Math.PI, 46, -0.05], [10, 420, -83, Math.PI, 18, -0.05], [16, 230, -83, Math.PI, 2.2, 0.04], [17.5, 195, -83, Math.PI, 0, 0.05],
    [19, 160, -83, Math.PI, 0, 0], [27, -30, -83, Math.PI, 0, 0], [30, -44, -79, Math.PI * 1.25, 0, 0], [33, -46, -62, Math.PI * 1.5, 0, 0],
    [40, -46, -28, Math.PI * 1.5, 0, 0], [44, -40, -14, Math.PI * 1.75, 0, 0], [48, -26, -8, Math.PI * 2, 0, 0], [55, 8, -8, Math.PI * 2, 0, 0], [70, 8, -8, Math.PI * 2, 0, 0],
  ]);
  Q.films.lastlanding = (t) => { const [x, z, yaw, y, pitch] = t < 0 ? [8, -8, Math.PI * 2, 0, 0] : pose(t); Q.jetPose(x, z, yaw, y, pitch); };
  Q.films.lastlanding(-1);
  Q.view = { pos: [-3, 1.6, 20], look: [6, 3.2, -8] };
  Q.enter = () => {};
  return Q;
}
const builders = { apron, gallery, cockpit, cabin, newlook, home, lastflight, arrival };
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  Q.itemStarts = Object.fromEntries(Object.entries(Q.items).map(([k, o]) => [k, { at: o.position.toArray(), scale: o.scale.toArray(), ry: o.rotation.y }]));
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
