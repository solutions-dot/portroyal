/* The nine places, each a compressed reconstruction of a real kind of place (sources in docs/games/windrush.md).
   Every place lists its people with something to do (engine/ambient.js behaviours), its walking walls and its moving things (Q.tickers).
   Story people: person(). Background people: crowd(), each a body made for that year and place (tools/windrush/people). */
import * as THREE from "three";
import { T, cv, std, solid, flat, mesh, box, cyl, plane, grp, batchStatic } from "./gfx.js";
import { palm, tree, crate, lampPost, bench, banana, marketBasket, truck } from "./period-props.js";
import * as P from "./props.js";
import * as S from "./scenery.js";
import { windrush, gangway, SHIP } from "./ship.js";
import { createSea, makeWake, gulls } from "./sea.js";
import { makeDoor } from "../../../engine/door.js";
import { TASKS } from "./steps.js";

const eraOf = (id) => (id.endsWith("18") ? "2018" : id.endsWith("62") ? "1962" : "1948");
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
  tickers: [],
  keepOff: [],
  reveal: {},   /* a look moment's change, k from 0 to 1 (engine/lookshot.js) */
  ground: () => 0,
});
function add(Q, o, x = 0, z = 0, y = 0, ry = 0) {
  o.position.set(x, y, z);
  o.rotation.y = ry;
  Q.group.add(o);
  return o;
}
/* a room's walls, floor and ceiling become the place's own fabric (meshes straight in the place group), like the house round them */
function fabric(Q, g) {
  Q.group.add(g);
  g.updateMatrixWorld(true);
  const ms = [];
  g.traverse((o) => o.isMesh && ms.push(o));
  for (const m of ms) Q.group.attach(m);
  Q.group.remove(g);
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
/* a story person. life: what they do when not talking (an ambient behaviour). opts: raw (full body, for a woman who sits), seat, held, ground */
function person(Q, id, cast, x, z, ry = 0, life = null, opts = {}) {
  Q.specs.push({ id, cast, x, z, ry, life, ...opts });
}
/* a background person: look is a body (tools/windrush/people); life an ambient behaviour; opts: held ('case', 'bag', 'basket'), seat, ground, zone */
function crowd(Q, look, x, z, ry, life, opts = {}) {
  Q.ambient.push({ id: Q.id + "-" + Q.ambient.length, look, x, z, ry, behaviour: life, ...opts });
}
function point(Q, id, x, z, label) {
  Q.points[id] = { x, z, label };
}
function ground(Q, mat, size = 400, x = 0, z = 0) {
  const p = plane(size, size, mat, x, -0.025, z, Q.group);
  p.rotation.x = -Math.PI / 2;
  return p;
}
const face = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
/* far land on the horizon: a ring of hills drawn without fog, open where the sea is (gap: the angle the open water faces, and its width) */
function horizon(Q, { r = 420, h = 60, colour = 0x6f8f86, gap = Math.PI, width = 1.2, seed = 1, y = -2, low = 0 }) {
  const pos = [],
    n = 120;
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI + (2 * Math.PI * i) / n,
      da = Math.abs(Math.atan2(Math.sin(a - gap), Math.cos(a - gap))),
      fade = Math.max(low, Math.min(1, (da - width * 0.5) / 0.6)),
      hh = fade * h * (0.5 + 0.3 * Math.sin(i * 0.21 + seed) + 0.15 * Math.sin(i * 0.63 + seed * 3) + 0.06 * Math.sin(i * 1.7));
    pos.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(a) * r, y + Math.max(0.5, hh), Math.sin(a) * r);
  }
  const idx = [];
  for (let i = 0; i < n; i++) {
    const k = i * 2;
    idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: colour, side: THREE.DoubleSide, fog: false }));
  m.userData.noBatch = true;
  m.userData.far = true;
  Q.group.add(m);
  return m;
}
/* a far line of buildings on a shore (Gravesend across the Thames, Kingston's waterfront): boxes and a spire, drawn without fog */
function farTown(Q, x0, x1, z, y, seed, colour = 0x8a8f8a, spire = true) {
  const g = grp(),
    m = new THREE.MeshBasicMaterial({ color: colour, fog: false }),
    m2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(colour).multiplyScalar(0.85), fog: false });
  let s = seed;
  for (let x = x0; x < x1; ) {
    s = (s * 9301 + 49297) % 233280;
    const w = 6 + (s % 9),
      h = 5 + (s % 11);
    box(w, h, 4, s % 2 ? m : m2, x + w / 2, y + h / 2, z, g);
    x += w + (s % 3);
  }
  if (spire) {
    box(4, 18, 4, m2, (x0 + x1) / 2, y + 9, z, g);
    mesh(new THREE.ConeGeometry(2.6, 14, 4), m2, (x0 + x1) / 2, y + 25, z, g);
  }
  Q.group.add(g);
  return g;
}

/* ---------- Jamaica: the family's home in a country district ---------- */
function yard(id) {
  /* the family's home: a country district in the hills of Jamaica (a general picture, not one surveyed place), the house raised on posts,
     breadfruit and ackee trees, a dry-stone bank holding up the hillside, a croton hedge along the road, the district shop and its piazza.
     In 1962 time has passed: the house is painted, the wires have come, a radio plays, and it is late afternoon. */
  const is48 = id === "yard48",
    Q = base(id, [-14.6, -10.2, 14.6, 15.0], [0, 11.6, 0]);
  Q.tod = is48 ? "morning" : "afternoon";
  ground(Q, std(T.dirt([25, 25], is48 ? [164, 132, 92] : [156, 126, 88])), 700).name = "terrain";
  // the hill behind and to the sides, the road and the valley below
  add(Q, S.hillside(80, 60, 22, 6), 0, -10.9);
  add(Q, S.hillside(50, 40, 14, 9), 15.6, 2, 0, -Math.PI / 2);
  add(Q, S.hillside(50, 40, 12, 3), -15.6, 2, 0, Math.PI / 2);
  add(Q, S.stoneBank(31, 0.75, 4), -15.5, -10.6);
  const road = plane(155, 4.2, std(T.dirt([38, 2], [136, 112, 82])), 0, 0.012, 17.2, Q.group);
  road.rotation.x = -Math.PI / 2;
  horizon(Q, { r: 320, h: 55, colour: is48 ? 0x84a39a : 0x9aa48a, gap: Math.PI / 2, width: 0.01, low: 0.5, seed: 4 });
  // Settled land across the road. The house pads lie beyond the toes of both side slopes.
  const grass = plane(200, 110, std(T.grass([28, 14], [103, 128, 71])), 0, -0.006, 74.4, Q.group);
  grass.name = "terrain";
  grass.rotation.x = -Math.PI / 2;
  add(Q, S.hillside(185, 62, 19, 15), 0, 52, 0, Math.PI);
  for (let i = 0; i < 7; i++) {
    const h = S.stiltHouse(5, 3.6, { wall: [[190, 170, 140], [170, 190, 170], [200, 180, 150]][i % 3], seed: 300 + i });
    const x = (i - 3) * 11 + (i % 2) * 3, z = 33 + (i % 3) * 3;
    add(Q, h, x, z, 0, Math.PI + (i % 2) * 0.12).name = "yard building";
    add(Q, S.crotonHedge(4.4, i + 15), x + 1.4, z - 4.7);
  }
  // Plant in the wider gaps and along the back of the plots, clear of neighbouring eaves.
  for (const [x, z, height] of [
    [-42, 33, 6.8], [-26, 35, 5.5], [-4, 42, 5.5], [18, 44, 5.7], [43, 34, 6.8],
    [-34, 48, 6.4], [-17, 49, 6.8], [8, 48, 6.2], [30, 49, 6.6],
  ]) add(Q, tree(height, 180 + x), x, z).name = "yard tree";
  // the house on its posts, the outdoor kitchen, the drum of water
  const house = S.stiltHouse(7, 4.5, is48 ? { wall: [190, 172, 138], trim: 0xd8d0bc, shut: 0x3f6a4a, roof: [140, 132, 120], interior: true, year: 1948 } : { wall: [226, 178, 164], trim: 0xf2eee4, shut: 0x2f5a7a, roof: [176, 180, 176], interior: true, year: 1962 });
  add(Q, house, -7.5, -6.6).name = "yard building";
  Q.tickers.push(house.userData.tick);   /* the curtains in the breeze */
  wall(Q, -7.5, -5.85, 7.4, 6.3);
  wall(Q, -7.5, -2.3, 1.3, 0.9);
  solid1(Q, S.kitchenShed(3, 2.2), 8.8, -6.5, 3.6, 2.8, -Math.PI / 2).name = "yard building";
  solid1(Q, S.oilDrum(is48 ? 0x5a6e7a : 0x4a6a5a), 10.9, -3.6, 0.7, 0.7);
  // the wash bench and the clothes line
  solid1(Q, S.washBench(), 3.6, 2, 1.5, 0.6);
  add(Q, S.washLine(4.2, 1.75, is48 ? 2 : 8, 5), 4.4, -2);
  for (const x of [4.4, 8.6]) wall(Q, x, -2, 0.3, 0.3);
  // Samuel's crate repair, and the yard tables
  solid1(Q, crate(0.62), -6, -1.4, 0.7, 0.7);
  solid1(Q, P.table(2, 1, 0.8), -4, 3.5, 2.1, 1.1);
  add(Q, S.mugs(2), -4.6, 3.75, 0.835);
  solid1(Q, P.table(2.4, 1, 0.8), 0, -4.5, 2.5, 1.1);
  add(Q, is48 ? P.openCase() : P.schoolbag(), 0, -4.5, 0.835);
  solid1(Q, P.table(2, 1, 0.8), 7, 3.5, 2.1, 1.1);
  if (is48) add(Q, marketBasket(), 7.5, 3.5, 0.835);
  else add(Q, P.radio(), 7.5, 3.5, 0.835);
  // trees and plants: breadfruit, ackee, a coconut palm, bananas; a hedge of crotons along the road with a gap for the path
  solid1(Q, S.breadfruit(is48 ? 8 : 9, 3), -12.3, 4.5, 1.0, 1.0).name = "yard tree";
  solid1(Q, S.ackee(is48 ? 6 : 6.8, 5), 12.6, 1.2, 0.8, 0.8).name = "yard tree";
  solid1(Q, palm(8.5, 33), 3.5, -9.3, 0.6, 0.6).name = "yard tree";
  for (const [x, z, s] of [[0.8, -8.8, 1], [13.8, -8.4, 2], [-14.2, 1.5, 3]]) solid1(Q, banana(s, s === 2), x, z, 0.8, 0.8).name = "yard tree";
  add(Q, S.crotonHedge(13.4, 2), -15, 14.3);
  wall(Q, -8.3, 14.3, 13.4, 0.7);
  add(Q, S.crotonHedge(5.4, 7), 1.6, 14.3);
  wall(Q, 4.3, 14.3, 5.4, 0.7);
  add(Q, S.bed(3, 3), -3.4, -2.6);
  wall(Q, -1.9, -2.3, 3.2, 0.6);
  solid1(Q, standpipe(), 2.6, 13.4, 0.7, 0.7);
  // the district shop and its piazza, where two men play dominoes
  add(Q, S.districtShop("DISTRICT SHOP", is48 ? {} : { wall: [236, 214, 160], roof: [170, 172, 168] }), 10.2, 8.5).name = "yard building";
  wall(Q, 10.2, 8.5, 6.2, 4.2);
  for (const x of [7.3, 10.2, 13.1]) wall(Q, x, 12.95, 0.4, 0.4);
  solid1(Q, S.dominoTable(), 9.0, 11.6, 0.85, 0.85);
  const dominoSeats = [8.13, 9.87];
  for (const x of dominoSeats) add(Q, S.stool(0.45), x, 11.6, 0.15);
  for (const [x, z, s] of [[-2, 9.5, 1], [-1.2, 10.4, 2], [5.2, 9, 3], [6.2, 9.6, 4]]) {
    const h = S.hen(s);
    add(Q, h, x, z, 0, s * 1.3);
    Q.tickers.push(h.userData.tick);
  }
  solid1(Q, bench(1.8), -11.5, 6.6, 1.9, 0.7, Math.PI / 2);
  if (!is48) {
    for (const x of [-1.8, 12.4]) solid1(Q, S.powerPole(7), x, 13.7, 0.4, 0.4);
    P.line(Q.group, [-2.35, 6.84, 13.7], [-6.0, 4.0, -4.25], S.SM.black, 0.012);
    P.line(Q.group, [-1.25, 6.84, 13.7], [11.85, 6.84, 13.7], S.SM.black, 0.012);
  }
  const lorry = truck(is48 ? 0x46604a : 0x7a3a2a);
  add(Q, lorry, -7.5, 17.4, 0, 0.02);
  // story people
  if (is48) {
    person(Q, "may", "may48", 3.6, 3.05, Math.PI, { kind: "work", clips: ["PickUp", "HappyIdle"], work: [5, 9], rest: [2, 4], face: [3.6, 2], react: ["WipeSweat"] });
    person(Q, "sam", "sam48", -6.9, -0.6, face(-6.9, -0.6, -6, -1.4), { kind: "work", clips: ["Kneel"], work: [8, 14], rest: [2.5, 4], face: [-6, -1.4] });
    person(Q, "pearl", "pearl48", 8.2, 5.2, face(8.2, 5.2, 7.5, 3.5), { kind: "watch", at: [7.5, 3.5], idles: ["Idle", "HappyIdle"], react: ["Laugh", "Nod"], every: [5, 9] });
  } else {
    person(Q, "pearl", "pearl62", 7.9, 5.4, face(7.9, 5.4, 7.5, 3.5), { kind: "watch", at: [5, 7], idles: ["HappyIdle", "Idle", "ListenMusic"], react: ["Laugh", "Nod"], every: [5, 9] });
    /* the letter from London on an upturned crate by Pearl: it opens out, and the postal order slides from inside (the look before the talk) */
    solid1(Q, crate(0.55), 9.0, 4.3, 0.6, 0.6, 0.3);
    const letter = P.foldedLetter("Dear Pearl and Naomi", "#e8ddc4", "London is home now. We miss you.");
    add(Q, letter, 8.98, 4.3, 0.442, 0.2);
    const order = P.paper("Postal order", "#d9c9a0");
    order.scale.set(0.55, 1, 0.55);
    add(Q, order, 8.98, 4.3, 0.452, 0.2);
    order.visible = false;
    Q.reveal.letter62 = (k) => {
      const u = Math.max(0, Math.min(1, (+k - 0.05) / 0.55)),
        v = Math.max(0, Math.min(1, (+k - 0.55) / 0.35));
      letter.userData.open(u * u * (3 - 2 * u));
      order.visible = +k > 0.5;
      order.position.set(8.98 + 0.2 * v, 0.452, 4.3 + 0.17 * v);
    };
  }
  // neighbours: a woman bringing a basket in on her head, an old woman resting under the breadfruit tree, dominoes on the piazza, children at play
  crowd(Q, "wr_kwoman48", 14.0, 14.0, Math.PI, { kind: "errand", from: [14.0, 14.0], to: [13.6, -3.2], walk: "CarryHeadWalk", idle: "CarryHeadIdle", wait: [5, 9] }, { held: "headload" });
  crowd(Q, "wr_kelder48", -11.5, 6.6, Math.PI / 2, { kind: "sit", seat: { top: 0.485, x: -11.5, z: 6.6, ry: Math.PI / 2 }, clips: ["SitIdle", "SitIdle2"] }, { raw: true });
  dominoSeats.forEach((x, i) => {
    const ry = i ? -Math.PI / 2 : Math.PI / 2;
    crowd(Q, i ? "wr_tman48b" : "wr_kman48", x, 11.6, ry, { kind: "sit", seat: { top: 0.60, floor: 0.15, x, z: 11.6, ry, feetForward: true }, clips: ["SitIdle", "SitIdle2"] });
  });
  crowd(Q, "wr_kboy48", -4, 11, 0, { kind: "play", area: [-7.5, 7.5, 0.5, 12.5], run: "Run", joy: ["Cheer", "Clap"] }, { kid: true });
  crowd(Q, "wr_kgirl48", -2, 12, 0, { kind: "play", area: [-7.5, 7.5, 0.5, 12.5], run: "Run", joy: ["Cheer", "Clap"] }, { kid: true });
  Q.ambient[Q.ambient.length - 1].behaviour.chase = Q.ambient[Q.ambient.length - 2].id;
  Q.keepOff = [{ at: [-4, 5], r: 1.2 }, { at: [3, 4], r: 1 }, { at: [7, 5], r: 1 }, { at: [0, -3], r: 1 }, { at: [-6, -2], r: 1 }];
  if (__DEV__) Q.yardIssues = checkYard(Q.group);
  return Q;
}
// Check the planted trees and the house foundations before static scenery is merged.
function checkYard(group) {
  group.updateMatrixWorld(true);
  const land = group.getObjectsByProperty("name", "terrain");
  const issues = [], ray = new THREE.Raycaster(), p = new THREE.Vector3();
  ray.ray.direction.set(0, -1, 0);
  for (const stone of group.getObjectsByProperty("name", "house footing")) {
    stone.geometry.computeBoundingBox();
    stone.localToWorld(p.set(0, stone.geometry.boundingBox.min.y, 0));
    ray.ray.origin.set(p.x, 40, p.z);
    const ground = ray.intersectObjects(land, false)[0];
    if (!ground || Math.abs(ground.point.y - p.y) > 0.03) issues.push("House footing off terrain at " + [p.x.toFixed(1), p.z.toFixed(1)]);
  }
  const buildings = group.getObjectsByProperty("name", "yard building").map(building => ({
    position: building.position,
    bounds: new THREE.Box3().setFromObject(building, true).expandByScalar(0.2),
  }));
  for (const tree of group.getObjectsByProperty("name", "yard tree")) {
    const bounds = new THREE.Box3().setFromObject(tree, true);
    for (const building of buildings) {
      if (bounds.intersectsBox(building.bounds)) issues.push(
        `Tree at ${tree.position.x},${tree.position.z} too close to building at ${building.position.x},${building.position.z}`,
      );
    }
  }
  return issues;
}
function standpipe() {
  const g = grp();
  cyl(0.06, 0.07, 1.0, solid(0x2b2d31, 0.6, 0.3), 0, 0.5, 0, g, 8);
  box(0.28, 0.07, 0.07, solid(0x2b2d31, 0.6, 0.3), 0.1, 0.94, 0, g);
  box(0.6, 0.1, 0.6, solid(0x888274, 0.9), 0, 0.05, 0, g);
  return g;
}

/* ---------- the harbours: Kingston (departure) and Tilbury (arrival) ---------- */
const WATER_Y = -2.1,
  SHIP_Z = -16;
function quay(Q, x0, x1, z, tex, depth = 40) {
  // the paved apron, the quay wall's face going down into the water with its coping, timber fenders, bollards and ladders
  const ap = box(x1 - x0, 0.3, depth, std(tex, 0.95), (x0 + x1) / 2, -0.15, z + depth / 2, Q.group);
  // Continue the quay wall and its ground past the last working berth.
  for (const sign of [-1, 1]) {
    const centre = (sign < 0 ? x0 : x1) + sign * 120;
    box(240, 3, depth, solid(0x999789, 0.95), centre, -1.5, z + depth / 2, Q.group);
  }
  // the land behind the quay, out to the horizon
  const land = plane(1400, 700, solid(0x8a8a78, 1), 0, -0.32, z + depth + 349, Q.group);
  land.rotation.x = -Math.PI / 2;
  const stone = std(T.stone([132, 128, 118], [(x1 - x0) / 4, 1.4]), 0.95);
  box(x1 - x0, 5, 0.6, stone, (x0 + x1) / 2, -2.6, z + 0.3, Q.group);
  box(x1 - x0, 0.22, 0.9, solid(0xb9b4a6, 0.9), (x0 + x1) / 2, 0.0, z + 0.45, Q.group);
  for (let x = x0 + 2; x < x1; x += 4) {
    box(0.32, 3.6, 0.3, solid(0x4e3e2e, 1), x, -1.6, z - 0.12, Q.group);
  }
  for (let x = x0 + 6; x < x1 - 2; x += 12) {
    const b = S.bollard();
    b.position.set(x, 0.1, z + 1.0);
    Q.group.add(b);
    wall(Q, x, z + 1.0, 0.7, 0.7);
  }
  for (let x = x0 + 9; x < x1; x += 24) {
    for (const s of [-0.25, 0.25]) box(0.05, 3.2, 0.05, solid(0x2b2d31, 0.6, 0.3), x + s, -1.5, z - 0.03, Q.group);
    for (let y = -3; y < 0; y += 0.3) box(0.5, 0.04, 0.04, solid(0x2b2d31, 0.6, 0.3), x, y, z - 0.03, Q.group);
  }
  // rails set in the quay for the cranes and the wagons
  for (const rz of [z + 4.2, z + 9.2, z + 10.6]) box(x1 - x0, 0.03, 0.08, solid(0x55524c, 0.5, 0.5), (x0 + x1) / 2, 0.015, rz, Q.group);
}
function portalCrane(Q, x, z, ry = 0) {
  const g = S.portalCrane();
  add(Q, g, x, z, 0, ry);
  for (const dx of [-2.6, 2.6]) for (const dz of [-2.5, 2.5]) wall(Q, x + dx, z + dz, 0.8, 1.4);
  return g;
}
function shipOnWater(Q, kind, phone, reduced) {
  const ship = windrush();
  batchStatic(ship);
  ship.traverse((o) => (o.userData.noBatch = true));
  ship.position.set(0, WATER_Y, SHIP_Z);
  ship.rotation.y = Math.PI; // the bow points west (-x): her port side, with the gangway, faces the quay
  Q.group.add(ship);
  Q.props.ship = ship;
  Q.props.shipHome = { x: 0, z: SHIP_Z, ry: Math.PI };
  const wake = makeWake(SHIP.L, SHIP.B);
  ship.add(wake);
  Q.props.wake = wake;
  wake.visible = false;
  Q.sea = createSea(Q.group, { kind, y: WATER_Y, at: [0, -60], phone, reduced, edges: [[-80, 1, 80, 1]] });
  return ship;
}
/* passengers lining the ship's rail: they stand on the ship, so they ride and sail with her (Q.shipLife, in the ship's own frame) */
function railCrowd(Q, looks, n, deckY, z, x0, x1, react) {
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
    Q.ambient.push({ id: Q.id + "-rail" + i, look: looks[i % looks.length], x, z, ry: 0, zone: "ship", deckY, behaviour: { kind: "watch", at: [x, z - 12], react: /tman48[ac]/.test(looks[i % looks.length]) ? ["LookAround", "HeadTurn", "Nod"] : react, every: [3, 6], idles: ["Idle", "HappyIdle"] } });
  }
}
function harbour(id, { phone = false, reduced = false } = {}) {
  const k = id === "harbour48",
    Q = base(id, [-24, 2.2, 24, 30], k ? [9, 13, 0] : [9, 13, 0], k ? "jamaica" : "england");
  quay(Q, -90, 90, 1, T.concrete([30, 14], k ? [176, 170, 152] : [150, 152, 146]), 60);
  const ship = shipOnWater(Q, k ? "caribbean" : "thames", phone, reduced);
  // the gangway from the ship's side (starboard, now facing the quay) down to the quay
  const deckY = WATER_Y + SHIP.deck + 0.05,
    side = SHIP_Z + SHIP.B / 2 + 0.2;
  const gw = gangway([10.8, deckY, side], [10.8, 0.05, 6.2]);
  gw.traverse((o) => (o.userData.noBatch = true));
  Q.group.add(gw);
  Q.props.gangway = gw;
  wall(Q, 10.8, 4.2, 2.2, 4.4);
  portalCrane(Q, -16, 7.7);
  portalCrane(Q, 30, 7.7);
  // Working docks continue on either side of the passenger landing.
  for (const x of [-61, -39, 46, 70]) {
    add(Q, S.dockShed(18, 10, 5.4, k ? [164, 151, 123] : [144, 147, 142], 0x56605a), x, 35, 0, Math.PI);
  }
  for (const sign of [-1, 1]) {
    add(Q, S.dockShed(20, 9, 5, [148, 144, 132]), sign * 85, 15, 0, -sign * Math.PI / 2);
    add(Q, S.cargoStack(5, ["CARGO"]), sign * 44, 14);
    add(Q, S.cargoStack(6, ["CARGO"]), sign * 48, 13);
  }
  if (k) kingstonQuay(Q);
  else tilburyStage(Q);
  // luggage and cargo waiting on the quay
  for (const [x, z, s] of [[-12, 12, 1], [-6.5, 18.5, 2], [16, 20, 3], [20, 11.8, 4]]) solid1(Q, S.cargoStack(s, k ? ["KINGSTON", "JAMAICA", "CARGO"] : ["LONDON", "TILBURY", "CARGO"]), x, z, 2.9, 2.1);
  for (const [x, z] of [[-18.5, 14.5], [3.5, 19.5], [18, 16]]) solid1(Q, P.caseStack(), x, z, 1.6, 0.8);
  for (const [x, z, r] of [[-2, 5.6, 0.3], [21.5, 5.6, -0.4]]) solid1(Q, S.barrow(2), x, z, 0.8, 0.6, r);
  for (const [x, z] of [[-22, 3.5], [14.5, 4.0]]) add(Q, S.ropeCoil(0.4), x, z);
  Q.tickers.push(gulls(Q.group, 5, [0, -4], 14, 22, k ? 2 : 5));
  return Q;
}
function kingstonQuay(Q) {
  // the transit shed behind the quay, palms at its ends, the passenger sign, the town and the Blue Mountains beyond, the Palisadoes across the water
  const shed = S.dockShed(44, 10, 6.5, [176, 170, 150], 0x3d4a48);
  add(Q, shed, 0, 36, 0, Math.PI);
  wall(Q, 0, 36, 44, 10);
  for (const x of [-25, 25]) {
    add(Q, palm(8.5, 41 + x), x, 28);
    wall(Q, x, 28, 0.6, 0.6);
  }
  const sign = S.textPlane("KINGSTON  ·  PASSENGERS", 6, 0.8, "#efe6cf", "#22383e");
  sign.position.set(0, 5.4, 30.95);
  sign.rotation.y = Math.PI;
  Q.group.add(sign);
  horizon(Q, { r: 600, h: 70, colour: 0x8aa3a8, gap: -Math.PI / 2, width: 1.6, seed: 2 });
  horizon(Q, { r: 560, h: 32, colour: 0x7b9a92, gap: -Math.PI / 2, width: 2.0, seed: 7 });
  horizon(Q, { r: 480, h: 4, colour: 0x8aa094, gap: Math.PI / 2, width: 0.0, low: 1, seed: 6, y: -1.5 });
  farTown(Q, -260, 260, 190, 0, 3, 0xa8a898, false);
  const lorry = truck(0x46604a);
  add(Q, lorry, -8, 26, 0, Math.PI);
  wall(Q, -8, 26, 6, 2.6);
  // people: the family and Pearl at the foot of the gangway; Kingston well-wishers waving; passengers with their cases; a vendor with a basket
  person(Q, "pearl", "pearl48", 8.4, 8.2, face(8.4, 8.2, 0, SHIP_Z), { kind: "watch", at: [4, SHIP_Z], idles: ["Idle"], react: ["WaveSlow", "Wave"], every: [3, 6] });
  const wave = ["Wave", "WaveSlow", "Wave", "Clap"];
  for (const [look, x, z] of [["wr_kwoman48", -4, 5], ["wr_kelder48", -1.5, 4.8], ["wr_kman48", 1.2, 5.3], ["wr_kgirl48", 3.4, 4.8], ["wr_kboy48", 5.4, 5.1]])
    crowd(Q, look, x, z, face(x, z, x, SHIP_Z), { kind: "watch", at: [x * 0.6, SHIP_Z], react: wave, every: [2.5, 5], idles: look === "wr_kboy48" || look === "wr_kgirl48" ? ["HappyIdle", "Idle"] : ["Idle", "HappyIdle"] }, { kid: /boy|girl/.test(look) });
  for (const [look, x, z] of [["wr_tman48a", 14.2, 11.6], ["wr_twoman48", 15, 12.8], ["wr_tman48c", 16.2, 11.9]])
    crowd(Q, look, x, z, face(x, z, 10.8, 6.5), { kind: "watch", at: [10.8, 6.5], idles: ["BriefcaseIdle"], react: ["HeadTurn", "Nod"], every: [4, 8] }, { held: "case" });
  crowd(Q, "wr_tman48b", -9, 9.5, 0, { kind: "chat", group: "k1", at: [-8.4, 10.2] });
  crowd(Q, "wr_lman48", -7.8, 10.7, 0, { kind: "chat", group: "k1" });
  railCrowd(Q, ["wr_tman48a", "wr_twoman48", "wr_tman48c", "wr_tman48b"], 9, SHIP.deck + 3.02, -(SHIP.B / 2 - 1.4), -30, 22, ["Wave", "LookAround", "HeadTurn", "Clap"]);
  // May and Samuel have gone aboard: they wave to Pearl from the rail above the gangway
  for (const [look, x] of [["wr_may48t", -10.0], ["wr_sam48t", -11.0]]) Q.ambient.push({ id: Q.id + "-" + look, look, x, z: -(SHIP.B / 2 - 1.4), ry: 0, zone: "ship", deckY: SHIP.deck + 3.02, behaviour: { kind: "watch", at: [x + 2, -20], react: look === "wr_may48t" ? ["WaveSlow"] : ["Nod", "LookAround"], every: look === "wr_may48t" ? [2.5, 4] : [3.5, 6], idles: ["Idle"] } });
}
function tilburyStage(Q) {
  // Tilbury Riverside: the landing stage (a timber deck with white railings and a long canopy), the station and baggage hall behind,
  // the Thames, and Gravesend on the Kent shore across the river
  box(180, 0.04, 14, std(T.plank([150, 132, 104], 14, [40, 4]), 0.95), 0, 0.02, 8.2, Q.group);
  const canopy = grp();
  for (let x = -22; x <= 22; x += 5.5) for (const z of [17, 24]) box(0.2, 3.4, 0.2, solid(0x3c4a4e, 0.7, 0.2), x, 1.7, z, canopy);
  box(48, 0.2, 9, solid(0x6a7570, 0.7), 0, 3.5, 20.5, canopy);
  const r = box(48, 0.1, 9.6, solid(0x56605c, 0.8), 0, 3.85, 20.5, canopy);
  r.rotation.x = -0.05;
  add(Q, canopy, 0, 0);
  for (let x = -22; x <= 22; x += 5.5) for (const z of [17, 24]) wall(Q, x, z, 0.4, 0.4);
  const br = S.brickMat("red", [8, 3]);
  const st = grp();
  box(34, 8, 10, br, 0, 4, 0, st);
  box(34.4, 0.5, 10.4, solid(0x4f5354, 0.8), 0, 8.2, 0, st);
  for (let x = -14; x <= 14; x += 4) {
    box(2.2, 3, 0.1, solid(0x3a4a4e, 0.4), x, 4.6, -5.02, st);
    mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.1, 12, 1, false, 0, Math.PI), solid(0x3a4a4e, 0.4), x, 6.1, -5.02, st).rotation.set(Math.PI / 2, 0, Math.PI / 2);
  }
  for (const x of [-5, 0, 5]) box(3.2, 3, 0.12, solid(0x2e3a3c, 0.5), x, 1.5, -5.05, st);
  const nm = S.textPlane("TILBURY RIVERSIDE", 12, 1.1, "#e9e2cc", "#2a2a28");
  nm.position.set(0, 7.1, -5.06);
  nm.rotation.y = Math.PI;
  st.add(nm);
  const clock = mesh(new THREE.CircleGeometry(0.9, 24), solid(0xf2eee0, 0.6), 0, 9.6, -5.061, st);
  clock.rotation.y = Math.PI;
  box(2.6, 2.6, 0.5, br, 0, 9.6, -4.8, st);
  add(Q, st, 0, 36);
  wall(Q, 0, 36, 34, 10);
  // waiting for the boat train: a bench, a barrow, the queue; Gravesend across the water
  solid1(Q, bench(2.2), -12, 27.2, 2.3, 0.7, Math.PI);
  solid1(Q, bench(2.2), 12, 27.2, 2.3, 0.7, Math.PI);
  for (const x of [-18, 18]) {
    add(Q, lampPost(3.6, false), x, 26);
    wall(Q, x, 26, 0.3, 0.3);
  }
  horizon(Q, { r: 460, h: 20, colour: 0x8a9a92, gap: Math.PI / 2, width: 0.0, low: 1, seed: 8, y: -1.8 });
  horizon(Q, { r: 360, h: 12, colour: 0x7f918a, gap: Math.PI / 2, width: 3.2, low: 0, seed: 3, y: -1.8 });
  farTown(Q, -180, 120, -340, -1.5, 5, 0x8c928c, true);
  const taxi = S.car(0x1d1f22, 1948);
  add(Q, taxi, 20, 30.5, 0, Math.PI);
  wall(Q, 20, 30.5, 4.2, 1.8);
  // people: the family, a porter, a queue of passengers with their cases, Colonial Office welfare officers at a table, rail passengers watching
  person(Q, "may", "may48t", -7, 9, face(-7, 9, 0, 12), { kind: "watch", at: [0, 30], idles: ["Idle"], react: ["LookAround", "HeadTurn"], every: [4, 7] });
  person(Q, "sam", "sam48t", -5.6, 10.3, face(-5.6, 10.3, 0, 30), { kind: "watch", at: [0, 30], idles: ["BriefcaseIdle"], react: [], every: [5, 9] }, { held: "case" });
  person(Q, "porter", "porter48", 7, 13.2, face(7, 13.2, 9, 15), { kind: "watch", at: [0, 30], idles: ["IdleM"], react: ["Point", "Nod"], every: [5, 9] });
  solid1(Q, S.trestle(2.4, 0.8), -1, 14.6, 2.5, 0.9);
  add(Q, P.paper("PASSENGERS"), -1.4, 14.6, 0.78);
  crowd(Q, "wr_lman48", -1, 15.6, Math.PI, { kind: "work", clips: ["IdleM", "Nod", "TalkM2"], work: [4, 7], face: [-1, 12] });
  const queue = [["wr_tman48b", -1.2, 12.9], ["wr_twoman48", -1.5, 11.6], ["wr_tman48a", -1.1, 10.3], ["wr_tman48c", -1.6, 9.0], ["wr_kboy48", -2.4, 9.3]];
  for (const [look, x, z] of queue) crowd(Q, look, x, z, 0, { kind: "watch", at: [-1, 15.6], idles: look === "wr_kboy48" ? ["HappyIdle"] : ["BriefcaseIdle"], react: ["HeadTurn", "LookAround"], every: [4, 8] }, look === "wr_kboy48" ? { kid: true } : { held: "case" });
  crowd(Q, "wr_lwoman48", 14, 25.5, Math.PI, { kind: "wander", area: [6, 21, 22, 27.5], pause: [3, 7] });
  railCrowd(Q, ["wr_tman48a", "wr_twoman48", "wr_tman48c", "wr_tman48b"], 9, SHIP.deck + 3.02, -(SHIP.B / 2 - 1.4), -30, 22, ["Wave", "LookAround", "HeadTurn"]);
  point(Q, "station", 0, 29.6, "Walk to the station");
}

/* ---------- on board, mid-Atlantic: the boat deck ---------- */
// The passenger promenade sits inboard of the suspended lifeboats.
function deckRail(Q, x0, z0, x1, z1) {
  const dx = x1 - x0, dz = z1 - z0;
  const length = Math.hypot(dx, dz), spans = Math.ceil(length / 1.55);
  const rail = grp(Q.group, (x0 + x1) / 2, 0, (z0 + z1) / 2);
  rail.rotation.y = -Math.atan2(dz, dx);
  for (let i = 0; i < spans; i++) {
    box(0.055, 1.12, 0.055, S.SM.steel, length * (i / spans - 0.5), 0.56, 0, rail);
  }
  for (const y of [0.34, 0.71, 1.12]) {
    box(length, 0.055, 0.065, y === 1.12 ? S.SM.woodDark : S.SM.steel, 0, y, 0, rail);
  }
  wall(Q, rail.position.x, rail.position.z, Math.abs(dx) + 0.065, Math.abs(dz) + 0.065);
}
function deck({ phone = false, reduced = false } = {}) {
  const Q = base("deck48", [-6.6, -18, 6.6, 20], [0, 18.4, 0], "sea");
  const ship = windrush();
  batchStatic(ship);
  ship.traverse((o) => (o.userData.noBatch = true));
  // the boat deck top is 12.82 m above the waterline in the ship's frame: put it at y = 0, bow ahead (-z)
  const top = SHIP.boatDeck;
  ship.position.set(0, -top, -10);
  ship.rotation.y = Math.PI / 2;
  Q.group.add(ship);
  Q.props.ship = ship;
  const wake = makeWake(SHIP.L, SHIP.B);
  ship.add(wake);
  Q.props.wake = wake;
  Q.sea = createSea(Q.group, { kind: "atlantic", y: -top, at: [0, 0], phone, reduced });
  Q.seaLevel = -top;
  // the ship's frame to this place: local (x, z) -> world (z, -x - 10)
  const W = (lx, lz) => [lz, -lx - 10];
  for (const lx of [0.43, 0.52].map(f => (f - 0.5) * SHIP.L)) {
    const [x, z] = W(lx, 0);
    wall(Q, x, z, 5.6, 7.6);
  }
  for (const sx of [0.33, 0.39, 0.46, 0.53, 0.6]) for (const s of [-1, 1]) {
    const [x, z] = W(-SHIP.L / 2 + sx * SHIP.L, s * 7.6);
    wall(Q, x, z, 2.4, 7.4);
  }
  // the boat deck's planking, laid fore and aft, over the plating
  const planks = plane(14.4, 40, std(T.plank([168, 140, 100], 14, [3, 10]), 0.95), 0, 0.012, 1, Q.group);
  planks.rotation.x = -Math.PI / 2;
  const sideRail = 6.30, aftRail = 20, forwardRail = -18;
  deckRail(Q, -sideRail, forwardRail, sideRail, forwardRail);
  deckRail(Q, sideRail, forwardRail, sideRail, aftRail);
  deckRail(Q, sideRail, aftRail, -sideRail, aftRail);
  deckRail(Q, -sideRail, aftRail, -sideRail, forwardRail);
  // deck furniture: benches, ventilators,   (no deck chairs: she sailed as a troopship, and no source shows deck chairs on the 1948 voyage; the photographs show people standing along the rails. Owner, 17 November 2026)
  // life rings on the rail, coils of rope, the tables for water and the crossing map
  for (const [x, z, ry] of [[-4.6, 14, Math.PI / 2], [4.6, -6, -Math.PI / 2], [-4.6, -6.5, Math.PI / 2]]) solid1(Q, bench(1.8), x, z, 1.9, 0.7, ry);
  for (const [x, z] of [[-2.2, -15.6], [2.2, -15.6], [0, 6]]) solid1(Q, S.ventilator(1.5, 0.32), x, z, 0.9, 0.9);
  for (const [x, z] of [[-1.9, 16.4], [2.6, 9.3]]) add(Q, S.ropeCoil(0.35), x, z);
  solid1(Q, P.table(1.6, 0.8, 0.8), -3.6, 9, 1.7, 0.9);
  solid1(Q, P.table(1.6, 0.8, 0.8), 3.6, -10.6, 1.7, 0.9);
  const map = P.paper("THE ATLANTIC");
  add(Q, map, 3.4, -10.6, 0.835);
  for (const z of [17.5, -2]) for (const s of [-1, 1]) {
    const lr = S.lifeRing();
    lr.position.set(s * (sideRail - 0.09), 0.82, z);
    lr.rotation.y = Math.PI / 2;
    Q.group.add(lr);
  }
  // story people: Lionel at the rail, May on a bench, Samuel at the rail looking ahead
  person(Q, "lionel", "lionel48", -5.6, 3, Math.PI / 2 + 0.6, { kind: "watch", at: [-12, 0], idles: ["IdleM"], react: ["LookAround", "HeadTurn"], every: [5, 9] });
  person(Q, "may", "may48t", 4.6, -6, -Math.PI / 2, { kind: "sit", seat: { top: 0.485, x: 4.6, z: -6, ry: -Math.PI / 2 }, clips: ["SitIdle", "SitIdle2"] }, { raw: true });
  person(Q, "sam", "sam48t", 5.6, -14, -Math.PI / 2 - 0.3, { kind: "watch", at: [14, -20], idles: ["IdleM"], react: ["LookAround"], every: [5, 9] });
  // passengers: a chat at the rail, people sitting out, children at play, a man reading, a couple looking at the sea
  crowd(Q, "wr_tman48a", -4.8, -1.2, 0, { kind: "chat", group: "d1", at: [-4.2, -0.4] });
  crowd(Q, "wr_tman48c", -3.6, 0.2, 0, { kind: "chat", group: "d1" });
  crowd(Q, "wr_twoman48", -4.6, 14, Math.PI / 2, { kind: "sit", seat: { top: 0.485, x: -4.6, z: 14, ry: Math.PI / 2 }, clips: ["SitIdle", "SitIdle2"] }, { raw: true });
  crowd(Q, "wr_tman48b", -4.6, -6.5, Math.PI / 2, { kind: "sit", seat: { top: 0.485, x: -4.6, z: -6.5, ry: Math.PI / 2 }, clips: ["SitIdle2", "SitPoseM"] });
  crowd(Q, "wr_kboy48", 1, 10, 0, { kind: "play", area: [-2.6, 7.5, 2.6, 17], run: "Run", joy: ["Cheer", "Clap"] }, { kid: true });
  crowd(Q, "wr_kgirl48", -1, 12, 0, { kind: "play", area: [-2.6, 7.5, 2.6, 17], run: "Run", joy: ["Cheer", "Clap"] }, { kid: true });
  Q.ambient[Q.ambient.length - 1].behaviour.chase = Q.ambient[Q.ambient.length - 2].id;
  crowd(Q, "wr_kman48", 5.6, 4, -Math.PI / 2, { kind: "watch", at: [16, 4], idles: ["IdleM", "ListenMusic"], react: ["LookAround", "WipeSweat"], every: [5, 9] });
  crowd(Q, "wr_kwoman48", 5.4, 2.6, -Math.PI / 2, { kind: "watch", at: [16, 2], idles: ["Idle", "HappyIdle"], react: ["Point", "Laugh"], every: [5, 9] });
  Q.keepOff = [{ at: [-3.6, 10.4], r: 1 }, { at: [3.6, -9.2], r: 1 }];
  return Q;
}

/* ---------- Brixton: one street, 1948 and 1962 ---------- */
function distantTerrace(Q, x, z, ry, homes) {
  const row = grp(), width = homes * 5, brick = S.brickMat("red", [homes * 2, 3]);
  box(width, 6.2, 6, brick, 0, 3.1, -3, row);
  for (const side of [-1, 1]) {
    const roof = box(width + 0.18, 0.16, 3.48, S.SM.slate, 0, 6.95, -3 + side * 1.5, row);
    roof.rotation.x = side * 0.46;
  }
  for (let i = 0; i < homes; i++) {
    const cx = (i + 0.5) * 5 - width / 2;
    box(0.8, 1.35, 0.65, brick, cx - 1.8, 7.6, -3, row);
    box(0.95, 2.15, 0.09, S.SM.woodDark, cx + 1.3, 1.075, 0, row);
    for (const [wx, wy] of [[-1, 1.5], [-1, 4.5], [1.3, 4.5]]) {
      box(1.25, 1.6, 0.08, S.SM.brickTrim, cx + wx, wy, 0.02, row);
      box(1.07, 1.42, 0.06, S.SM.glass, cx + wx, wy, 0.075, row);
      box(1.09, 0.07, 0.04, S.SM.brickTrim, cx + wx, wy, 0.11, row);
    }
  }
  add(Q, row, x, z, 0, ry);
}
function streetBase(Q, era) {
  // road and pavements; north terrace (front at z = -6), south terrace (front at z = 8, facing north)
  const road = box(120, 0.02, 8, std(T.concrete([40, 3], era === 1962 ? [92, 94, 92] : [104, 104, 100]), 0.95), 0, 0.0, 1, Q.group);
  for (const [z0, z1, k] of [[-6, -3, 1], [5, 8, -1]]) {
    const pv = S.pavement(Q, -60, z0, 60, z1, k);
    Q.group.add(pv);
  }
  for (let x = -55; x < 56; x += 6) box(2.5, 0.025, 0.12, solid(0xd8d4c4, 0.9), x, 0.02, 1, Q.group);
  for (const x of [-42.15, 23.15]) add(Q, S.terraceRow([{}, {}, {}, {}]), x, -6.3);
  for (const x of [-18.15, 42.15]) add(Q, S.terraceRow([{}, {}, {}, {}]), x, 8.3, 0, Math.PI);
  for (const sign of [-1, 1]) {
    distantTerrace(Q, sign * 58, 1, -sign * Math.PI / 2, 8);
    distantTerrace(Q, sign * 49, -6.3, 0, 2);
    distantTerrace(Q, sign * 49, 8.3, Math.PI, 2);
  }
  horizon(Q, { r: 260, h: 20, colour: 0x9aa4a4, gap: 0, width: 0, low: 1, seed: 9, y: 0 });
}
function brixton48() {
  const Q = base("brixton48", [-17.6, -11.4, 17.6, 7.6], [15.5, 3.5, Math.PI / 2], "england");
  ground(Q, std(T.concrete([20, 20], [120, 120, 114])), 300);
  streetBase(Q, 1948);
  // north side: houses from x = -22, one gap from the bombing; Celia's (open, with her room inside); Mr Gray's with a card in the window
  const north = [{ door: 0x5a3a2c }, { open: true, interior: true, door: 0x3f6a4e }, { door: 0x2f4f46 }, null, { door: 0x6a2a2a }, { door: 0x2f3f5a }, { door: 0x4a4a3a }, { door: 0x5a3a2c }, { door: 0x2f4f46 }];
  north.forEach((s, i) => {
    const cx = -22 + 2.5 + i * 5;
    if (s === null) {
      add(Q, S.bombSite(5, 11), cx - 2.5, -6.2);
      wall(Q, cx, -9, 5, 6);
      return;
    }
    const h = S.terraceHouse(s);
    add(Q, h, cx, -6);
    if (s.interior) {
      // Celia's front room, inside the house: walls, floor, a window (the bay), and her things
      /* papered walls with a picture rail, bare boards, a fireplace with a wireless on its mantel, a light on a flex: a let room of 1948 */
      const rm = S.room({ x0: cx - 2.4, z0: -11.6, x1: cx + 2.4, z1: -6.3, h: 2.8, floor: S.buildingMat("wood", { tint: 0xa88a68 }), floorTile: 1.2, wall: S.wallpaper({ ground: [214, 204, 172], ink: [168, 92, 84], kind: "stripe", seed: 2 }), tile: 0.5, rail: true, cornice: true, walls: [
        { line: [cx - 2.4, -11.6, cx + 2.4, -11.6] }, { line: [cx - 2.4, -6.3, cx - 2.4, -11.6] }, { line: [cx + 2.4, -11.6, cx + 2.4, -6.3] }] });
      fabric(Q, rm);
      for (const w of [[cx - 2.5, -11.7, cx + 2.5, -11.5], [cx - 2.55, -11.7, cx - 2.35, -6.2], [cx + 2.35, -11.7, cx + 2.55, -6.2]]) Q.walls.push(w);
      Q.walls.push([cx - 2.6, -6.45, cx + 0.95, -5.95], [cx + 2.15, -6.45, cx + 2.6, -5.95]);
      solid1(Q, P.table(1.4, 0.9, 0.76), cx - 0.6, -9, 1.5, 1.0);
      add(Q, S.mugs(3), cx - 0.9, -9.1, 0.795);
      for (const [x, z, r] of [[cx - 0.6, -9.85, 0], [cx - 1.55, -9, Math.PI / 2], [cx + 0.35, -9, -Math.PI / 2]]) add(Q, S.chair(), x, z, 0, r);
      wall(Q, cx - 0.6, -9, 2.4, 2);
      solid1(Q, S.bed1948(), cx + 1.75, -10.4, 1.0, 2.0);
      solid1(Q, S.wardrobe(), cx - 1.75, -11.1, 1.0, 0.6);
      solid1(Q, S.paraffinHeater(), cx + 1.9, -7.4, 0.45, 0.45);
      solid1(Q, P.table(0.9, 0.5, 0.75), cx - 1.95, -7.3, 0.6, 1.0, Math.PI / 2);
      add(Q, S.gasRing(), cx - 1.95, -7.3, 0.785);
      const pic = S.picture(0.5, 0.36, 2);
      pic.position.set(cx - 0.25, 1.85, -11.53);
      Q.group.add(pic);
      const fp = S.fireplace(0x6a7a5a);
      fp.position.set(cx - 0.25, 0, -11.54);
      Q.group.add(fp);
      wall(Q, cx - 0.25, -11.2, 1.5, 0.7);
      const wl = S.wireless(true);
      wl.position.set(cx - 0.55, 1.195, -11.46);
      Q.group.add(wl);
      cyl(0.04, 0.05, 0.16, solid(0x3a6a8a, 0.3), cx + 0.2, 1.275, -11.45, Q.group, 10);   /* a vase on the mantel */
      add(Q, S.rug(1.8, 1.3, "#5a3a3a", "#c8b080"), cx - 0.6, -9, 0.005);
      const cal = S.calendar(1948);
      cal.position.set(cx - 2.33, 1.5, -8.2);
      cal.rotation.y = Math.PI / 2;
      Q.group.add(cal);
      add(Q, S.pendant(2.8, { power: 2.4 }), cx - 0.3, -9);
      Q.props.celiaTable = [cx - 0.6, -9];
      point(Q, "celiaDoor", cx + 1.55, -5.2, "Find Celia");
      person(Q, "celia", "celia48", cx + 0.9, -7.5, face(cx + 0.9, -7.5, cx + 1.5, -6.3), { kind: "watch", at: [cx + 1.5, -6], idles: ["HappyIdle", "Idle"], react: ["Nod"], every: [5, 9] });
    } else wall(Q, cx, -9.2, 5, 6.4);
    wall(Q, cx - 1, -5.6, 2.5, 0.9);
    if (i === 5) {
      const card = S.textPlane("ROOM TO LET", 0.62, 0.2, "#f2ecdc", "#2a2a2a");
      card.position.set(cx - 1.0, 1.25, -5.24);
      Q.group.add(card);
      person(Q, "gray", "gray48", cx + 1.55, -5.35, 0, { kind: "watch", at: [cx + 1.55, 0], idles: ["IdleM"], react: ["HeadTurn"], every: [6, 10] });
    }
  });
  // south side, facing the north: houses and a corner shop
  const south = [{ door: 0x2f4f46 }, { door: 0x6a2a2a }, { shop: { name: "GROCER", awning: 0x2f5a3e } }, { door: 0x4a4a3a }, { door: 0x2f3f5a }, { door: 0x5a3a2c }, { door: 0x6a2a2a }, { door: 0x2f4f46 }];
  const srow = S.terraceRow(south);
  add(Q, srow, 22, 8, 0, Math.PI);
  wall(Q, 0, 11.4, 44, 6.8);
  // street furniture
  for (const x of [-11, 9]) solid1(Q, lampPost(4.2, false), x, -3.5, 0.3, 0.3);
  solid1(Q, S.phoneBox(), -14.2, 5.9, 1.0, 1.0, Math.PI);
  solid1(Q, P.postbox(), 13.4, -3.6, 0.8, 0.8);
  const old = S.car(0x2a2c2e, 1948);
  add(Q, old, -6, 4.0, 0, Math.PI);
  wall(Q, -6, 4.0, 4.2, 1.8);
  for (const [x, s] of [[15.8, 1], [-12.9, 2]]) {
    add(Q, S.planeTree(7, s), x, 6.2);
    wall(Q, x, 6.2, 0.6, 0.6);
  }
  // the family, just arrived: May looking at the houses, Samuel with their other case
  person(Q, "may", "may48t", 12.2, 2.4, face(12.2, 2.4, 0, -6), { kind: "watch", at: [2, -6], idles: ["Idle"], react: ["LookAround", "HeadTurn"], every: [4, 8] });
  person(Q, "sam", "sam48t", 8.2, 1.6, face(8.2, 1.6, 0, -6), { kind: "watch", at: [0, -6], idles: ["BriefcaseIdle"], react: [], every: [5, 9] }, { held: "case" });
  // Londoners going about their day
  crowd(Q, "wr_lwoman48", -10, 5.6, Math.PI / 2, { kind: "errand", from: [-11, 5.4], to: [12, 5.4], walk: "CarryBagWalk", idle: "Idle", wait: [4, 8] }, { held: "bag" });
  crowd(Q, "wr_lman48", 1, 6.5, -Math.PI / 2, { kind: "wander", pts: [[-11, 6.5], [1, 6.5], [11, 6.6]], pause: [3, 6] });
  crowd(Q, "wr_tman48c", -13.25, 4.8, 0, { kind: "watch", at: [-14.2, 6], idles: ["IdleM"], react: ["LookAround", "HeadTurn"], every: [4, 8] });
  Q.keepOff = [{ at: [7.05, -4.6], r: 1.2 }, { at: [-12.95, -4.8], r: 1.2 }, { at: [10.8, 3.6], r: 1 }];
  return Q;
}
function brixton62() {
  const Q = base("brixton62", [-17.6, -5.6, 17.6, 7.6], [15.5, 3.5, Math.PI / 2], "england");
  ground(Q, std(T.concrete([20, 20], [120, 120, 114])), 300);
  streetBase(Q, 1962);
  const north = [{ door: 0x5a3a2c }, { shop: { name: "BARBER", awning: 0x7a2a2a } }, { shop: { name: "RECORDS", awning: 0x2a4a6a } }, { garage: true }, { door: 0x2f3f5a }, { shop: { name: "CAFE", awning: 0x3a5a3a } }, { door: 0x4a4a3a }, { door: 0x5a3a2c }, { door: 0x2f4f46 }];
  north.forEach((s, i) => {
    const cx = -22 + 2.5 + i * 5;
    if (s.garage) {
      garage(Q, cx);
      return;
    }
    add(Q, S.terraceHouse(s), cx, -6);
    wall(Q, cx, -9.2, 5, 6.4);
    wall(Q, cx - 1, -5.6, 2.5, s.shop ? 0.5 : 0.9);
  });
  const south = [{ door: 0x2f4f46 }, { shop: { name: "GROCER · FRUIT AND VEG", awning: 0x2f5a3e } }, { shop: { name: "BAKER", awning: 0x8a6a3a } }, { door: 0x4a4a3a }, { door: 0x2f3f5a }, { shop: { name: "HARDWARE", awning: 0x4a4a5a } }, { door: 0x6a2a2a }, { door: 0x2f4f46 }];
  add(Q, S.terraceRow(south), 22, 8, 0, Math.PI);
  wall(Q, 0, 11.4, 44, 6.8);
  // the grocer's boxes of fruit and vegetables out on the pavement (yams, mangoes, plantains: Caribbean food for sale in Brixton by the 1960s)
  for (const [x, c, s] of [[13.4, 0xd9a030, 1], [12.6, 0x8a5a34, 2], [11.8, 0x7a9a3a, 3]]) solid1(Q, S.fruitBox(c, s), x, 7.0, 0.7, 0.5);
  // the cafe's table outside, where Iris writes her letter
  solid1(Q, P.table(1.2, 0.8, 0.76), -5, 1.5 - 4.9, 1.3, 0.9);
  for (const x of [-5.7, -4.3]) add(Q, S.chair(0x3a5a3a), x, -4.1, 0, Math.PI);
  solid1(Q, P.postbox(), 8, -3.7, 0.8, 0.8);
  solid1(Q, S.phoneBox(), -14.2, 5.9, 1.0, 1.0, Math.PI);
  solid1(Q, S.busStop("BRIXTON"), -9, 5.6, 0.3, 0.3);
  for (const x of [-11, 12]) solid1(Q, lampPost(4.2, false), x, -3.5, 0.3, 0.3);
  for (const [x, c] of [[-1, 0x7a8a6a], [4.5, 0x8a3a32]]) {
    add(Q, S.car(c, 1962), x, 4.1, 0, Math.PI);
    wall(Q, x, 4.1, 4.2, 1.8);
  }
  const bus = P.doubleDecker();
  bus.rotation.y = -Math.PI / 2;
  add(Q, bus, -22, 1.6, 0, -Math.PI / 2);
  Q.props.bus = bus;
  wall(Q, -22, 1.6, 8.4, 2.6);
  for (const [x, s] of [[15.8, 1], [-12.9, 2]]) {
    add(Q, S.planeTree(7, s), x, 6.2);
    wall(Q, x, 6.2, 0.6, 0.6);
  }
  // May and Samuel on their street; neighbours, a conductor by his bus, a boy with his ball, a woman with shopping
  person(Q, "may", "may62", 1.5, -3.9, face(1.5, -3.9, 3, -4.9), { kind: "watch", at: [3, -4.9], idles: ["HappyIdle", "Idle"], react: ["Laugh", "Nod"], every: [4, 8] });
  crowd(Q, "wr_bwoman62", 3.0, -4.9, face(3, -4.9, 1.5, -3.9), { kind: "watch", at: [1.5, -3.9], idles: ["Idle"], react: ["Talk1", "Laugh"], every: [3, 6] });
  person(Q, "sam", "sam62", -6.4, -4.4, face(-6.4, -4.4, -6.4, -6.5), { kind: "work", clips: ["PickUp", "IdleM", "WipeSweat"], work: [5, 9], face: [-6.6, -6.4] });
  crowd(Q, "wr_conductor62", -16.6, 4.6, Math.PI / 2, { kind: "watch", at: [-10, 4.6], idles: ["IdleM"], react: ["LookAround", "HeadTurn"], every: [5, 9] });
  crowd(Q, "wr_bman62", 9, 6.4, -Math.PI / 2, { kind: "wander", pts: [[14, 6.5], [6, 6.4], [-4, 6.5]], pause: [3, 6] });
  crowd(Q, "wr_lwoman62", -2, 6.4, Math.PI / 2, { kind: "errand", from: [-12, 6.4], to: [10.8, 6.3], walk: "CarryBagWalk", idle: "Idle", wait: [4, 8] }, { held: "bag" });
  crowd(Q, "wr_bboy62", -12, -4.5, 0, { kind: "play", area: [-16, -5.2, -8, -3.6], run: "Run", joy: ["Cheer", "Clap"] }, { kid: true });
  Q.keepOff = [{ at: [-5, -2.3], r: 1 }, { at: [8, -2.6], r: 1 }];
  return Q;
}
/* Samuel's workplace: a garage with its doors open, a car inside with the bonnet up, tyres and a bench (1962) */
function garage(Q, cx) {
  const br = S.brickMat("yellow", [2.5, 3]),
    g = grp();
  box(5, 2.6, 0.3, br, 0, 5.1, -0.15, g);
  box(5, 6.4, 6, br, 0, 3.2, -9.15, g);
  for (const s of [-1, 1]) box(0.4, 3.8, 6, br, s * 2.3, 1.9, -3, g);
  box(4.2, 0.05, 5.9, solid(0x4a4a46, 1), 0, -0.015, -3.05, g);
  box(4.2, 0.1, 6, solid(0x3a3a36, 1), 0, 3.85, -3, g);
  box(4.2, 0.4, 0.05, solid(0x6a6a62, 0.6, 0.3), 0, 3.6, 0.02, g);
  const sign = S.textPlane("GARAGE  ·  REPAIRS", 4.4, 0.55, "#1f2f3a", "#efe2b8");
  sign.position.set(0, 4.3, 0.02);
  g.add(sign);
  const pic = S.textPlane("HONEST WORK", 1.4, 0.3, "#efe2b8", "#1f2f3a");
  add(Q, g, cx, -6);
  for (const s of [-1, 1]) wall(Q, cx + s * 2.3, -9, 0.5, 6);
  wall(Q, cx, -11.2, 5, 2);
  const c = S.car(0x5a6a7a, 1962);
  add(Q, c, cx, -9.2, 0, Math.PI / 2);
  wall(Q, cx, -9.2, 1.8, 4.2);
  solid1(Q, S.workbench(), cx - 1.3, -7.0, 0.6, 1.8, Math.PI / 2);
  solid1(Q, S.tyreStack(3), cx + 1.65, -6.9, 0.7, 0.7);
  Q.props.garage = cx;
  return pic;
}

/* ---------- London, 2018: Iris's house, and the advice centre ---------- */
function home18() {
  const Q = base("home18", [-5.4, -8.6, 5.4, 9.4], [2.3, 0.6, 0], "england");
  /* the letter Maya laid beside Iris opens out on the low table (the look before the talk) */
  Q.reveal.letter18 = (k) => {
    const u = Math.max(0, Math.min(1, (+k - 0.05) / 0.6));
    Q.items.brownLetter?.userData.open?.(u * u * (3 - 2 * u));
  };
  ground(Q, std(T.concrete([20, 20], [126, 126, 120])), 200);
  // the street and the houses opposite
  const road = box(80, 0.02, 7, std(T.concrete([30, 3], [70, 72, 74]), 0.95), 0, 0.0, 14.5, Q.group);
  Q.group.add(S.pavement(Q, -40, 9.6, 40, 11, 1));
  add(Q, S.terraceRow([{}, {}, {}, {}, {}, {}, {}, {}]), 20, 21, 0, Math.PI);
  for (const [x, c] of [[-6, 0x8a9aa6], [5.5, 0x2a2c30]]) {
    add(Q, S.car(c, 2018), x, 12.6);
    wall(Q, x, 12.6, 4.4, 1.8);
  }
  for (const sign of [-1, 1]) {
    distantTerrace(Q, sign * 30.25, 21, Math.PI, 4);
    distantTerrace(Q, sign * 23, 2, 0, 4);
    distantTerrace(Q, sign * 43, 13, -sign * Math.PI / 2, 4);
  }
  horizon(Q, { r: 240, h: 22, colour: 0x9aa4a4, gap: 0, width: 0, low: 1, seed: 12, y: 0 });
  // Iris's terrace house and her neighbours': front walls at z = 2, front gardens to the low wall at z = 7.6
  for (const x of [-10, 10]) {
    add(Q, S.terraceHouse(x < 0 ? { door: 0x2f3f5a } : { upvc: true }), x, 2);   /* by 2018 one neighbour keeps a painted Victorian door, the other has a white uPVC one */
  }
  const br = S.brickMat("yellow", [2.5, 3]),
    trim = solid(0xcfc6b0, 0.9);
  // the front of Iris's house (x -7.5 to 7.5, meeting her neighbours'): a window into the front room, the front door into the hall, sash windows upstairs
  const fw = 2.15;
  for (const [a, b] of [[-7.5, -4.9], [-1.9, 2.0], [3.0, 7.5]]) box(b - a, 2.6, 0.3, br, (a + b) / 2, 1.3, fw, Q.group);
  box(3.0, 0.75, 0.3, br, -3.4, 0.375, fw, Q.group);
  box(3.0, 0.15, 0.3, br, -3.4, 2.525, fw, Q.group);
  box(1.0, 0.5, 0.3, br, 2.5, 2.35, fw, Q.group);
  box(15, 3.8, 0.3, br, 0, 4.5, fw, Q.group);
  for (const x of [-3.4, 2.5]) {
    box(1.15, 1.45, 0.06, trim, x, 4.3, fw + 0.16, Q.group);
    plane(0.95, 1.25, S.SM.glass, x, 4.3, fw + 0.2, Q.group);
  }
  // Iris's front door (doors.js): her painted Victorian four-panel door, standing open into the hall, hinged on the east side of the doorway
  {
    const leaf = S.DR.terraceLeaf({ w: 0.9, h: 2.0, color: 0x2f4f6a });
    leaf.position.set(2.96, 0, fw - 0.16);
    leaf.rotation.y = Math.PI / 2 + 0.06;
    leaf.children.forEach((c) => (c.position.x += 0.45));
    Q.group.add(leaf);
  }
  box(15.2, 0.25, 12, solid(0x4f5354, 0.8), 0, 6.5, -3.7, Q.group);
  box(15, 6.4, 0.3, br, 0, 3.2, -9.75, Q.group);
  for (const x of [-7.65, 7.65]) box(0.3, 6.4, 12, br, x, 3.2, -3.75, Q.group);
  // inside: the front room (west), the hall with the front door (east), the kitchen behind
  /* the front room in warm painted plaster with a cornice, a stripe paper in the hall, a board floor (engine/building-tex.js surfaces) */
  const fl = S.buildingMat("wood", { tint: 0xc09a74 }),
    paint = S.wallpaper({ ground: [238, 226, 204], ink: [0, 0, 0], kind: "woodchip", seed: 6 });   /* painted woodchip paper, as many London front rooms had */
  const rm = S.room({ x0: -5.6, z0: -6, x1: 1.4, z1: 2.0, h: 2.7, floor: fl, floorTile: 1.4, wall: paint, tile: 0.6, cornice: true, walls: [
    { line: [-5.6, -6, 1.4, -6], gaps: [] }, { line: [1.4, -6, 1.4, 2.0], gaps: [{ at: 5.3, w: 1.18, kind: "door" }] },
    { line: [-5.6, 1.93, -5.6, -6] }, { line: [1.4, 1.93, -5.6, 1.93], gaps: [{ at: 4.8, w: 2.8, h: 1.7, sill: 0.75, kind: "window" }] }] });
  fabric(Q, rm);
  const hall = S.room({ x0: 1.4, z0: -6, x1: 3.8, z1: 2.0, h: 2.7, ceiling: false, floor: fl, floorTile: 1.4, wall: S.wallpaper({ ground: [214, 222, 208], ink: [90, 120, 110], kind: "stripe", seed: 5 }), tile: 0.5, rail: true, walls: [
    { line: [3.8, -6, 3.8, 2.0] }, { line: [1.4, -6, 3.8, -6], gaps: [{ at: 1.1, w: 0.9, kind: "door" }] }, { line: [3.8, 1.93, 1.4, 1.93], gaps: [{ at: 1.3, w: 1.0, kind: "door" }] }] });
  fabric(Q, hall);
  const kit = S.room({ x0: -5.6, z0: -9.4, x1: 3.8, z1: -6, h: 2.7, floor: solid(0xb8b2a2, 0.8), wall: solid(0xe8ecdf, 1), walls: [{ line: [-5.6, -9.4, 3.8, -9.4] }, { line: [3.8, -6, 3.8, -9.4] }] });
  fabric(Q, kit);
  box(0.3, 2.7, 3.6, solid(0xe6dcc4, 1), -5.75, 1.35, -7.7, Q.group);
  // walking walls: the outside of the house, the front-room wall with its door, the hall's back wall with the kitchen door, the stairs
  Q.walls.push([-6.2, 1.85, -1.9, 2.3], [-1.9, 1.85, 2.0, 2.3], [3.0, 1.85, 6.2, 2.3]);
  Q.walls.push([1.3, -6.1, 1.5, -1.29], [1.3, -0.11, 1.5, 2.1]);
  Q.walls.push([-5.7, -6.1, 2.0, -5.9], [2.9, -6.1, 3.9, -5.9]);
  Q.walls.push([-5.8, -9.6, 4.0, -9.4], [-5.8, -9.6, -5.6, 2.2], [3.8, -9.6, 4.0, 2.2]);
  Q.walls.push([4.0, -9.6, 5.6, 1.85]);   /* beyond the hall's east wall is the neighbour's house, not open ground (the passage audit found it) */
  const stairs = grp();
  for (let i = 0; i < 12; i++) box(0.9, 0.22 * (i + 1), 0.25, solid(0x7a5a3e, 0.8), 0, (0.22 * (i + 1)) / 2, -i * 0.25, stairs);
  /* the banister (owner, 22 November 2026: "rails for the steps"): a newel post, spindles and a handrail along the open side, rising with the steps */
  const wood = solid(0x5a3e2a, 0.7), rise = 0.22 * 11, run = 0.25 * 11, railLen = Math.hypot(rise, run);
  box(0.09, 1.05, 0.09, wood, -0.45, 0.22 + 0.52, 0.06, stairs);
  for (let i = 0; i < 12; i += 2) box(0.035, 0.86, 0.035, wood, -0.45, 0.22 * (i + 1) + 0.43, -i * 0.25, stairs);
  const rail = box(0.07, 0.06, railLen + 0.2, wood, -0.45, 0.22 + 0.88 + rise / 2, -run / 2, stairs); rail.rotation.x = Math.atan2(rise, run);
  add(Q, stairs, 3.3, -1.4);
  /* the stairs lead up through an opening in the hall ceiling (owner, 22 November 2026), into a short stairwell to the floor above */
  const ceil = solid(0xeeeae0, 1), well = solid(0xd8e0d4, 1), hx0 = 2.8, hx1 = 3.73, hz0 = -4.45, hz1 = -2.05;
  box(hx0 - 1.47, 0.1, 7.86, ceil, (1.47 + hx0) / 2, 2.75, -2.0, Q.group);   /* the hall ceiling, west of the opening */
  box(hx1 - hx0, 0.1, hz0 + 5.93, ceil, (hx0 + hx1) / 2, 2.75, (-5.93 + hz0) / 2, Q.group);   /* north of it */
  box(hx1 - hx0, 0.1, 1.93 - hz1, ceil, (hx0 + hx1) / 2, 2.75, (hz1 + 1.93) / 2, Q.group);   /* south of it */
  box(0.08, 2.6, hz1 - hz0, well, hx0 - 0.04, 4.0, (hz0 + hz1) / 2, Q.group); box(0.08, 2.6, hz1 - hz0, well, hx1 + 0.04, 4.0, (hz0 + hz1) / 2, Q.group);   /* the stairwell's sides */
  box(hx1 - hx0, 2.6, 0.08, well, (hx0 + hx1) / 2, 4.0, hz1 + 0.04, Q.group); box(hx1 - hx0, 2.6, 0.08, well, (hx0 + hx1) / 2, 4.0, hz0 - 0.04, Q.group);
  box(hx1 - hx0, 0.08, hz1 - hz0, ceil, (hx0 + hx1) / 2, 5.3, (hz0 + hz1) / 2, Q.group);   /* the upstairs ceiling */
  box(hx1 - hx0, 0.05, 0.6, fl, (hx0 + hx1) / 2, 2.7, hz0 + 0.3, Q.group);   /* the landing at the top step */
  wall(Q, 3.3, -2.8, 1.0, 3.2);
  // the front room's things
  const rugM = S.rug(2.6, 1.8, "#7a3a3a", "#d8c08a");
  add(Q, rugM, -2.6, -2.2);
  const ch = S.armchair(0x7a4a3c);
  solid1(Q, ch, -4.6, -1.2, 0.9, 0.9, Math.PI / 2);
  solid1(Q, S.sofa(2.2, 0x5a6a52), -2.4, -5.4, 2.3, 0.95);
  solid1(Q, S.lowTable(1.1, 0.6, 0.45), -2.9, -1.6, 1.2, 0.7);
  solid1(Q, S.sideboard(1.7), 0.9, -3.2, 1.8, 0.5, -Math.PI / 2);
  for (const [x, z, k] of [[0.88, -3.8, 0], [0.88, -2.7, 1]]) {
    const p = S.picture(0.22, 0.17, k);
    p.position.set(x, 0.8 + (0.17 + 0.06) / 2, z);
    p.rotation.y = -Math.PI / 2 + 0.25;
    Q.group.add(p);
  }
  solid1(Q, S.bookcase(1.0, 1.8, 7), -5.35, -4.2, 1.0, 0.35, Math.PI / 2);
  add(Q, S.flatTv(), -5.3, -2.7, 0.0, Math.PI / 2);
  wall(Q, -5.3, -2.7, 0.4, 1.0);
  solid1(Q, S.lamp(1.45), -5.1, 0.6, 0.35, 0.35);
  solid1(Q, S.radiator(1.2), -3.4, 1.85, 1.2, 0.2);
  solid1(Q, S.pottedPlant(1.2, 3), 0.9, 1.5, 0.4, 0.4);
  for (const [x, y, z, k, ry] of [[-2.4, 1.7, -5.92, 1, 0], [-0.4, 1.6, -5.92, 0, 0], [-5.52, 1.7, -0.6, 2, Math.PI / 2]]) {
    const p = S.picture(k === 1 ? 0.7 : 0.45, k === 1 ? 0.5 : 0.36, k);
    p.position.set(x, y, z);
    p.rotation.y = ry;
    Q.group.add(p);
  }
  add(Q, P.folder(), -2.95, -1.6, 0.45);
  // hall: a coat stand, a small table with a telephone, the mat inside the front door
  solid1(Q, P.table(0.5, 0.35, 0.8), 3.5, -4.6, 0.4, 0.6, Math.PI / 2);
  // the kitchen beyond its door: fitted units with a worktop, a sink under the window, tiles, wall cupboards, a fridge, the kettle
  const kitchen = S.fittedKitchen(4.2);
  add(Q, kitchen, -1.2, -9.33);
  wall(Q, -1.2, -9.1, 4.3, 0.65);
  add(Q, S.kettle(), -2.4, -9.15, 0.92);
  solid1(Q, S.fridge(), 1.6, -9.0, 0.65, 0.65);
  const kcal = S.calendar(2018);
  kcal.position.set(2.6, 1.55, -9.33);
  Q.group.add(kcal);
  add(Q, S.pendant(2.7, { shade: 0xf2f0ea, warm: 0xfff0d8, power: 1.6 }), -1, -7.7);
  // the front room's light, curtains at the window, cushions and a throw, the Bible on the side table, a clock
  add(Q, S.pendant(2.7, { shade: 0xd8c8a8, power: 2.2 }), -2.2, -2.2);
  for (const x of [-5.15, -1.65]) {
    const cu = S.drape(0.8, 2.2, x < -3 ? 0 : 1);
    cu.position.set(x, 0.3, 1.82);
    Q.group.add(cu);
  }
  box(3.9, 0.04, 0.04, S.SM.iron, -3.4, 2.52, 1.83, Q.group);
  for (const [x, c] of [[-3.1, 0x8a3a3a], [-1.7, 0xd8a838]]) {
    const cs = box(0.42, 0.38, 0.14, solid(c, 1), x, 0.68, -5.6, Q.group);
    cs.rotation.x = -0.25;
  }
  add(Q, S.throwRug(), -4.62, -1.2, 0.0, Math.PI / 2);
  box(0.16, 0.045, 0.23, solid(0x1a1612, 0.6), -2.5, 0.4725, -1.78, Q.group).rotation.y = 0.2;   /* her Bible on the low table */
  const clk = S.wallClock();
  clk.position.set(-5.5, 2.05, -2.7);
  clk.rotation.y = Math.PI / 2;
  Q.group.add(clk);
  // the front garden: a path, beds, the low wall and the gate onto the pavement
  box(1.2, 0.03, 5.6, solid(0xa8a294, 0.9), 2.5, 0.015, 4.8, Q.group);
  add(Q, S.bed(3.2, 4), -5, 2.3);
  add(Q, S.bed(2.2, 5), 3.2, 2.3);
  add(Q, S.frontWall(11.4, 7.95), -5.45, 7.6);
  add(Q, S.gate(0.9, 1.4), 2.05, 7.6);
  Q.walls.push([-6, 7.4, 1.9, 7.8], [3.1, 7.4, 6, 7.8]);
  Q.walls.push([-6, 2.3, 1.9, 3.3], [3.1, 2.3, 6, 3.3]);
  solid1(Q, S.oilDrum(0x2a4a3a), 4.6, 6.6, 0.7, 0.7);
  const mat = plane(1.0, 0.6, std(cv(128, 64, (x) => { x.fillStyle = "#8a6d4d"; x.fillRect(0, 0, 128, 64); x.fillStyle = "#3a2d22"; x.font = "bold 19px serif"; x.textAlign = "center"; x.fillText("WELCOME", 64, 39); })), 2.5, 0.016, 1.3, Q.group);
  mat.rotation.x = -Math.PI / 2;
  // people: Iris in her chair, Anita in the hall; outside, a neighbour going by
  person(Q, "iris", "iris79", -4.44, -1.2, Math.PI / 2, { kind: "sit", seat: { top: 0.46, x: -4.44, z: -1.2, ry: Math.PI / 2, feetForward: true }, clips: ["SitIdle", "SitIdle2"] }, { raw: true, seatStill: true });
  person(Q, "anita", "anita18", 2.3, -4.9, Math.PI, { kind: "watch", at: [2.5, 0], idles: ["Idle", "HappyIdle"], react: ["Nod", "HeadTurn"], every: [5, 9] });
  crowd(Q, "wr_man18", -3, 8.9, Math.PI / 2, { kind: "errand", from: [-4.8, 8.9], to: [4.8, 8.9], walk: "Walk", idle: "IdleM", wait: [3, 6] });
  Q.leadPath = [[-3.7, -0.4], [-1.5, -0.7], [0.45, -0.7], [2.35, -0.7], [2.55, 0.6], [2.5, 3.6], [2.5, 6.6]];
  Q.routes = [{ id: "Iris walks to the gate", pts: Q.leadPath, r: 0.28, h: 1.7 }];
  point(Q, "frontGate", 2.5, 6.8, "Walk to the front gate");
  Q.keepOff = [{ pts: Q.leadPath, w: 1 }];
  return Q;
}
function centre18() {
  const Q = base("centre18", [-7.6, -6.6, 7.6, 7.6], [0, 6.6, 0], "england");
  ground(Q, std(T.concrete([20, 20], [126, 126, 120])), 200);
  const rm = S.room({ x0: -7.8, z0: -6.8, x1: 7.8, z1: 7.8, h: 3.2, floor: solid(0x9aa6a0, 0.7), wall: solid(0xe9e4d4, 1), walls: [
    { line: [-7.8, -6.8, 7.8, -6.8], gaps: [{ at: 3, w: 2, h: 1.4, kind: "window", sill: 1.0 }, { at: 8, w: 2, h: 1.4, kind: "window", sill: 1.0 }, { at: 13, w: 2, h: 1.4, kind: "window", sill: 1.0 }] },
    { line: [-7.8, 7.8, -7.8, -6.8] }, { line: [7.8, -6.8, 7.8, 7.8] }, { line: [7.8, 7.8, -7.8, 7.8], gaps: [{ at: 7.8, w: 1.8, kind: "door" }] }] });
  fabric(Q, rm);
  add(Q, makeDoor({ w: 1.8, h: 2.1, leaves: 2, kind: "flush", handle: "pull", color: 0x486573, frame: 0xe9e4d4, recess: 0.045 }), 0, 7.72, 0, Math.PI);
  Q.walls.push([-8, -7, 8, -6.7], [-8, -7, -7.7, 8], [7.7, -7, 8, 8], [-8, 7.7, 8, 8]);
  for (let x = -6; x <= 6; x += 6) {
    const l = box(1.2, 0.05, 0.3, solid(0xf4f2ea, 0.5), x, 3.15, 0, Q.group);
  }
  // reception, notices and the tea table by the door
  solid1(Q, S.desk(1.6, 0.7), -5.2, 5.4, 1.7, 0.8, Math.PI);
  add(Q, S.laptop(), -5.3, 5.4, 0.76, Math.PI);
  const sign = S.textPlane("COMMUNITY ADVICE CENTRE", 5, 0.5, "#2f5a6a", "#f2efe2");
  sign.position.set(0, 2.6, -6.72);
  Q.group.add(sign);
  for (const [x, z, ry, titles] of [[-7.7, 0, Math.PI / 2, ["ADVICE TODAY", "LUNCH CLUB", "WINDRUSH HELP", "LEGAL AID", "COMPUTER CLASS", "CHOIR", "FOOD BANK", "ESOL"]], [7.7, -1, -Math.PI / 2, ["DOMINOES", "HOUSING", "BENEFITS", "YOUTH CLUB"]]]) {
    const nb = S.noticeBoard(2, 1.1, titles);
    nb.position.set(x, 1.6, z);
    nb.rotation.y = ry;
    Q.group.add(nb);
  }
  solid1(Q, P.table(1.6, 0.7, 0.76), 5.6, 5.6, 1.7, 0.8);
  add(Q, S.teaUrn(), 5.2, 5.6, 0.795);
  add(Q, S.mugs(3), 5.8, 5.5, 0.795);
  for (const [x, z] of [[-6.9, -5.9], [6.9, -5.9], [6.9, 2.6]]) solid1(Q, S.pottedPlant(1.4, x * 3), x, z, 0.4, 0.4);
  for (const x of [-4.8, 0.2, 5.2]) solid1(Q, S.radiator(1.4), x, -6.55, 1.4, 0.2);
  // a lived-in community room of 2018: posters, leaflet racks, a water cooler, a clock, more chairs and a children's corner
  for (const [x, z, ry, t, bg] of [[-2.4, -6.72, 0, "FREE ADVICE HERE", "#2f5a6a"], [2.7, -6.72, 0, "KNOW YOUR RIGHTS", "#a8423a"], [-4.2, 7.72, Math.PI, "COMMUNITY LUNCH", "#3a7a4a"], [4.0, 7.72, Math.PI, "CHOIR PRACTICE", "#6a4a8a"]]) {
    const p = S.poster(t, 0.6, 0.85, bg);
    p.position.set(x, 1.6, z);
    p.rotation.y = ry;
    Q.group.add(p);
  }
  for (const [x, z, ry, s] of [[7.72, 1.2, -Math.PI / 2, 1], [-7.72, -2.6, Math.PI / 2, 2]]) {
    const rk = S.leafletRack(s);
    rk.position.set(x, 1.35, z);
    rk.rotation.y = ry;
    Q.group.add(rk);
  }
  solid1(Q, S.waterCooler(), 7.3, 4.2, 0.4, 0.4);
  const clock = S.wallClock();
  clock.position.set(0, 2.6, 7.72);
  clock.rotation.y = Math.PI;
  Q.group.add(clock);
  solid1(Q, S.lowTable(1.0, 0.6, 0.5, 0xd8a040), 5.2, -4.4, 1.1, 0.7);
  add(Q, S.mugs(1), 5.0, -4.4, 0.5);
  for (const x of [4.5, 5.9]) add(Q, S.plasticChair(0xe0603a), x, -3.6, 0, Math.PI);
  wall(Q, 5.2, -3.6, 2.0, 0.6);
  for (let i = 0; i < 3; i++) add(Q, S.plasticChair(0x3a6a5a), 2.4 + i * 0.6, 7.1, 0, Math.PI);
  wall(Q, 3.0, 7.1, 1.9, 0.6);
  solid1(Q, S.pottedPlant(1.6, 9), -6.9, 6.9, 0.45, 0.45);
  // the advice table with Asha, Iris and Anita
  solid1(Q, S.desk(1.8, 0.8), 2, -2.5, 1.9, 0.9);
  add(Q, S.laptop(), 2.5, -2.6, 0.76);
  for (const [x, z, r] of [[2.2, -3.4, 0], [1.4, -1.6, Math.PI], [2.8, -1.6, Math.PI]]) add(Q, S.plasticChair(), x, z, 0, r);
  // the memory table: an exhibition the centre has made of local families' photographs
  const floorY = 0.01, tableHeight = 0.78;
  solid1(Q, S.trestle(2.2, 0.8, tableHeight, 0x5a6a6a), -5, -4.5, 2.3, 0.9, 0, floorY);
  const board = S.noticeBoard(2.2, 1.2, ["OUR STORIES", "1948", "FAMILIES", "PHOTOS"]);
  board.position.set(-5, 1.9, -6.7);
  Q.group.add(board);
  add(Q, P.paper("A LIFE IS MORE THAN PAPERS"), -5.6, -4.5, floorY + tableHeight);
  // the waiting chairs along the west wall, and a table where the family's folder waits
  const waitingSeats = [3.8, 3.2, 2.6, 2.0];
  for (const z of waitingSeats) add(Q, S.plasticChair(0x3a6a5a), -7.1, z, 0, Math.PI / 2);
  wall(Q, -7.1, 2.9, 0.6, 2.6);
  solid1(Q, P.table(1.2, 0.7, 0.76), -2.5, 5.8, 1.3, 0.8);
  // people
  person(Q, "asha", "asha18", 2.2, -3.4, 0, { kind: "sit", seat: { top: 0.455, x: 2.2, z: -3.4, ry: 0 }, clips: ["SitIdle2", "SitIdle"] }, { raw: true });
  person(Q, "iris", "iris79", 1.4, -1.6, Math.PI, { kind: "sit", seat: { top: 0.455, x: 1.4, z: -1.6, ry: Math.PI }, clips: ["SitIdle", "SitIdle2"] }, { raw: true });
  person(Q, "anita", "anita18", 3.3, -0.7, face(3.3, -0.7, 1.4, -1.6), { kind: "watch", at: [1.6, -2.4], idles: ["Idle"], react: ["Nod", "Agree"], every: [4, 8] });
  for (const [look, z, clips] of [
    ["wr_elder18", waitingSeats[0], ["SitIdle", "SitIdle2"]],
    ["wr_man18", waitingSeats[2], ["SitIdle2", "SitIdle"]],
  ]) {
    crowd(Q, look, -7.1, z, Math.PI / 2, { kind: "sit", seat: { top: 0.455, x: -7.1, z, ry: Math.PI / 2 }, clips });
  }
  crowd(Q, "wr_woman18", -5.2, 6.45, Math.PI, { kind: "work", clips: ["Idle", "LookAround", "Nod"], work: [4, 8], face: [-5.2, 3] });
  crowd(Q, "wr_wman18", 4.8, 4.2, face(4.8, 4.2, 5.4, 5.6), { kind: "chat", group: "t1", at: [5.2, 3.8] });
  crowd(Q, "wr_girl18", 5.8, 3.6, 0, { kind: "chat", group: "t1" }, { kid: true });
  Q.keepOff = [{ at: [-2.6, 4.8], r: 1 }, { at: [2.1, -0.9], r: 1 }, { at: [-5, -3.4], r: 1 }];
  return Q;
}

const builders = {
  yard48: () => yard("yard48"),
  yard62: () => yard("yard62"),
  harbour48: (o) => harbour("harbour48", o),
  deck48: (o) => deck(o),
  tilbury48: (o) => harbour("tilbury48", o),
  brixton48,
  brixton62,
  home18,
  centre18,
};
export const PLACE_IDS = Object.keys(builders);
export function buildPlace(id, opts = {}) {
  const Q = builders[id](opts);
  for (const [task, t] of Object.entries(TASKS).filter(([, t]) => t.place === id)) {
    if (Q.items[t.item]) continue;
    const o = P.item(t.item),
      at = t.start || [t.from[0], 0.84, t.from[1] - 1.5];
    add(Q, o, at[0], at[2], at[1], at[3] || 0);
    Q.items[t.item] = o;
  }
  Q.itemStarts = Object.fromEntries(Object.entries(Q.items).map(([id, o]) => [id, { at: o.position.toArray(), scale: o.scale.toArray(), ry: o.rotation.y }]));
  return Q;
}
export function mergePlace(Q) {
  batchStatic(Q.group);
}
