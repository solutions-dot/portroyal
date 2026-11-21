/* The Kingston places of 1966 (owner, November 2026: "the scenes at the visit don't make sense and are boring and repetitive. We need more variety
   of location"). Each chapter now has a place of its own:
     downtown  chapter 2: a shopping street downtown, near the Parade, the day before the visit (20 April 1966)
     parade    chapter 3: the Parade bus park, the morning of the arrival (21 April 1966, a public holiday)
     road      chapter 3: the Palisadoes road, walking the last part with the crowd (built in places.js, dressed here)
     lane      chapter 6: the family's lane that evening, neighbours round a radio
   The family yard (places.js) is used only in chapter 1. Every place is a general picture, not a surveyed street plan.
   Each builder takes the place kit from places.js (K) and returns the place. Story tasks that belong to a place live with it:
     Q.act[id](api)   does the task; returns false when it only picked something up (the task is not done yet)
     Q.where(id, S)   where a task is while something is carried (else the action point)
     Q.show(api)      puts finished tasks back in view (a reload or a chapter jump)
     Q.carryTo        tasks whose button reads "Place ..." while carrying
   api = { S, Q, hold(id), place([x, y, z]), give(personId), notice(text), sound(name) } from main.js. */
import * as THREE from "three";
import { createSea } from "../../../engine/sea.js";
import { T, std, solid, flat, glow, box, cyl, plane, grp, mesh, rng } from "./gfx.js";
import { tree, hillRing, crate, bench, marketBasket, yamBasket, hamper, suitcase, flowers, bush, sack, cart as countryCart } from "./period-props.js";
import * as P from "./props.js";
import * as K6 from "./kingston-props.js";

/* ---------- ambient helpers: every background person is doing something ---------- */
const chat = (id, group, x, z, look, extra = {}) => ({ id, x, z, look, behaviour: { kind: "chat", group }, ...extra });
const watch = (id, x, z, look, at, b = {}, extra = {}) => ({
  id,
  x,
  z,
  look,
  behaviour: { kind: "watch", at, react: ["Point", "Clap"], every: [4, 8], idles: ["Idle", "HappyIdle", "LookAround"], ...b },
  ...extra,
});
const stroll = (id, x, z, look, area, extra = {}) => ({ id, x, z, look, behaviour: { kind: "wander", area, min: 1.2, pause: [1.5, 4], idles: ["Idle", "LookAround"] }, ...extra });
const walker = (id, from, to, look, extra = {}) => ({
  id,
  x: from[0],
  z: from[1],
  look,
  behaviour: { kind: "errand", from, to, walk: "Walk", back: "Walk", wait: [2, 5], idles: ["Idle", "LookAround"] },
  ...extra,
});
const child = (id, x, z, look, area, girl = false) => ({
  id,
  x,
  z,
  look,
  base: girl ? "sel_girl66" : "sel_boy66",
  sex: girl ? "f" : "m",
  scale: 0.76 + (look % 5) * 0.025,
  colors: null,
  tint: undefined,
  behaviour: { kind: "play", area },
});
const listen = (id, x, z, look, at) => watch(id, x, z, look, at, { idles: ["ListenMusic", "Idle", "ListenMusic"], react: ["Clap", "Laugh"], every: [5, 9] });
const RASTA = ["sel_rastaman66", "sel_rastaelder66", "sel_rastawoman66", "sel_rastatam66"];
const rasta = (spec, k) => ({ ...spec, base: RASTA[k % 4], sex: k % 4 === 2 ? "f" : "m", rastafari: true, colors: null, tint: undefined });

function put(Q, o, x, z, ry = 0, wall = null, y = 0) {
  o.position.set(x, y, z);
  o.rotation.y = ry;
  Q.group.add(o);
  if (wall) Q.walls.push(wall);
  return o;
}
const rect = (x, z, w, d) => [x - w / 2, z - d / 2, x + w / 2, z + d / 2];
/* the sky beyond the bounds: a strip of low far buildings so no street ends in nothing */
function skyline(Q, x0, x1, z, depth = 8, seed = 3) {
  const r = rng(seed),
    cols = [0xd8cfb4, 0xcfd8cc, 0xe0d2b6, 0xc9cfd6, 0xe4dcc8];
  for (let x = x0; x < x1; ) {
    const w = 6 + r() * 7;
    put(Q, K6.farBlock(w, 5 + r() * 6, depth, cols[(r() * cols.length) | 0]), x + w / 2, z);
    x += w + 0.4;
  }
}

/* ---------- chapter 2: downtown, the day before ---------- */
export function downtown(K) {
  const Q = K.base("downtown", [-6.1, -36.4, 6.1, 21.4], [0, 19.4, 0]);
  Q.surface = "stone";
  // the road, the sidewalks under the piazzas, kerbs, and the cross street at the Parade end
  const road = box(7.2, 0.02, 90, std(T.concrete([3, 40], [92, 92, 88])), 0, 0.0, -8, Q.group);
  for (const s of [-1, 1]) {
    box(2.7, 0.03, 54, std(T.concrete([2, 20], [176, 170, 156])), s * 4.95, 0.015, -5.75, Q.group);
    box(0.14, 0.08, 54, solid(0xb3ad9e), s * 3.6, 0.04, -5.75, Q.group);
  }
  for (let z = 18; z > -34; z -= 6) box(0.12, 0.012, 2.4, solid(0xe2dccb), 0, 0.016, z, Q.group);
  box(60, 0.02, 5, std(T.concrete([20, 2], [92, 92, 88])), 0, 0.001, -35, Q.group);
  // two rows of shops with piazzas: names are made up, the kind of shops a 1960s downtown street had
  const LOTS = [
    [16.5, 9, "DRY GOODS", [226, 214, 182], 0x2f5e4e, 2, "jamaica"],
    [7.5, 9, "IVY'S DRESSMAKING", [222, 196, 196], 0x6a3b4a, 2, null],
    [-1.5, 9, "PHARMACY", [214, 226, 214], 0x2f5e4e, 2, "jamaica"],
    [-10.5, 9, "HARDWARE", [232, 222, 196], 0x5b4632, 1, null],
    [-19.5, 9, "BAKERY", [236, 214, 170], 0x7a3b2a, 2, "ethiopia"],
    [-28.25, 8.5, "BARBER", [206, 218, 228], 0x2b4b6b, 1, null],
  ];
  const EAST = [
    [16.5, 9, "SHOES", [214, 222, 232], 0x2b4b6b, 2, null],
    [7.5, 9, "NEWS AND BOOKS", [232, 226, 206], 0x2f5e4e, 1, null],
    [-1.5, 9, "RECORD SHOP", [236, 204, 168], 0x6a3b2a, 2, "jamaica"],
    [-10.5, 9, "FURNITURE", [214, 206, 186], 0x4a4032, 2, null],
    [-19.5, 9, "HABERDASHERY", [224, 210, 224], 0x5a3b6a, 2, "ethiopia"],
    [-28.25, 8.5, "GROCERY", [220, 228, 200], 0x2f5e4e, 1, null],
  ];
  for (const [side, lots] of [
    [-1, LOTS],
    [1, EAST],
  ])
    lots.forEach(([zc, len, sign, colour, trim, storeys, flag], i) => {
      const b = K6.piazzaBuilding(len, { colour, trim, storeys, sign, flag, seed: i + (side > 0 ? 20 : 1) });
      put(Q, b, side * 6.3, zc, side > 0 ? Math.PI : 0);
      Q.walls.push(side < 0 ? [-12.3, zc - len / 2, -6.3, zc + len / 2] : [6.3, zc - len / 2, 12.3, zc + len / 2]);
      for (const [cx, cz] of b.userData.cols) {
        const wx = side * (6.3 - cx),
          wz = zc + (side > 0 ? -cz : cz);
        Q.walls.push(rect(wx, wz, 0.4, 0.4));
      }
    });
  // the view: far buildings behind the start, the Parade's railings, trees and a church tower at the far end
  skyline(Q, -30, 30, 30, 8, 5);
  put(Q, K6.railing(36), 0, -38.2);
  const r = rng(11);
  for (let i = 0; i < 12; i++) put(Q, tree(7 + r() * 3, 40 + i), -26 + i * 4.6 + r(), -43 - r() * 10);
  put(Q, K6.churchTower(19), 9, -68);
  skyline(Q, -40, -12, -62, 8, 9);
  skyline(Q, 12, 40, -62, 8, 10);
  for (const s of [-1, 1]) put(Q, K6.farBlock(15, 7, 4, 0xd8cfb4), s * 20.6, -35);

  // the dressmaker's: Mum's table of finished flags in the piazza, a rail of sewn clothes, a string of pennants between the columns
  put(Q, K6.trestle(1.4, 0.6), -5.85, 6.9, Math.PI / 2, rect(-5.85, 6.9, 0.65, 1.45));
  for (let i = 0; i < 3; i++) {
    const f = K6.handFlag(i === 1 ? "jamaica" : "ethiopia", 0.75);
    f.rotation.z = Math.PI / 2;
    put(Q, f, -6.05, 6.3 + i * 0.16, Math.PI / 2, null, 0.835);
  }
  put(Q, K6.clothRail(1.5), -5.95, 10.6, Math.PI / 2, rect(-5.95, 10.6, 0.55, 1.6));
  const pen = K6.pennants(8.5, 0.3);
  put(Q, pen, -4.0, 3.25, -Math.PI / 2, null, 2.84);
  const flags = K6.flagBundle();
  K.item(Q, "flags", flags, -5.75, 7.2, 0.83);
  // Uncle Levi's handcart, loaded with palm fronds for the welcome
  put(Q, countryCart(2.2, 1.2), 2.35, -8.9, Math.PI / 2, [1.55, -12.3, 3.15, -7.6]);
  for (let i = 0; i < 4; i++) {
    const f = P.frond();
    f.rotation.set(Math.PI / 2, 0, 0.3 * (i - 1.5));
    f.position.set(2.0 + i * 0.22, 0.81, -9.6);
    Q.group.add(f);
  }
  // the newsboy's pitch
  put(Q, K6.newsStand(), 5.55, 12.4, Math.PI / 2, rect(5.55, 12.4, 0.5, 0.65));
  K.item(Q, "gleaner", K6.gleaner(), 5.05, 12.0, 0.49);
  // the bakery's table, the higgler's oranges, and the standpipe at the Parade end
  put(Q, K6.breadTable(1.8), -5.8, -19.5, Math.PI / 2, rect(-5.8, -19.5, 0.65, 1.85));
  K.item(Q, "lunch", K6.loaf(), -5.8, -20.18, 0.836);
  put(Q, K6.orangeBasket(), 5.6, -21.0, 0, rect(5.6, -21.0, 0.65, 0.65));
  put(Q, marketBasket(), 5.7, -19.9, 0.4, rect(5.7, -19.9, 0.55, 0.55));
  put(Q, crate(0.5), 5.6, -22.2, 0.1, rect(5.6, -22.2, 0.55, 0.55));
  K.item(Q, "fruit", K6.oranges(), 5.6, -22.2, 0.5);
  put(Q, K6.standpipe2(), 1.4, -33.0, 0, rect(1.4, -33.0, 0.75, 0.75));
  K.item(Q, "bottle", P.bottle(), 1.62, -32.85, 0.08);
  // Grandma's bench at the edge of the Parade, and the family's bag on it
  put(Q, bench(2), -3.0, -34.6, 0, rect(-3.0, -34.6, 2.05, 0.6));
  Q.props.bag = K.item(Q, "bag", P.bag(), -3.0, -34.55, 0.485);
  // parked cars, a bicycle against a column, crates and sacks outside the shops
  put(Q, K6.car(0x6e2b28, "P 2318"), -2.6, -12.8, Math.PI / 2, rect(-2.6, -12.8, 2.0, 4.8));
  put(Q, K6.car(0x2f4f6a, "P 5106"), 2.6, 3.4, -Math.PI / 2, rect(2.6, 3.4, 2.0, 4.8));
  put(Q, K6.car(0xd8d2bc, "P 1784"), -2.6, 16.2, Math.PI / 2, rect(-2.6, 16.2, 2.0, 4.8));
  put(Q, K6.bicycle(0x1f3f5f), 3.3, 15.4, Math.PI / 2, rect(3.3, 15.4, 0.4, 1.3));
  put(Q, crate(0.55), -5.9, -9.2, 0.2, rect(-5.9, -9.2, 0.6, 0.6));
  put(Q, crate(0.5, 0x7a5c3a), -5.95, -11.6, -0.3, rect(-5.95, -11.6, 0.55, 0.55));
  put(Q, sack(), 5.85, -27.6, 0.2, rect(5.85, -27.6, 0.55, 0.55));
  put(Q, sack(0xa08a5a), 5.85, -28.4, -0.4, rect(5.85, -28.4, 0.55, 0.55));
  put(Q, yamBasket(), 5.85, -29.4, 0.3, rect(5.85, -29.4, 0.55, 0.55));
  put(Q, K6.tinPlant(3), -5.95, 0.9, 0, rect(-5.95, 0.9, 0.35, 0.35));
  put(Q, K6.tinPlant(4), -5.95, -3.9, 0, rect(-5.95, -3.9, 0.35, 0.35));
  put(Q, K6.streetLamp(4.4, false), -3.75, -24.0, 0, rect(-3.75, -24.0, 0.25, 0.25));
  put(Q, K6.streetLamp(4.4, false), 3.75, -6.6, Math.PI, rect(3.75, -6.6, 0.25, 0.25));

  K.person(Q, "mum", -4.9, 9.6, Math.PI / 2);
  K.person(Q, "levi", 3.25, -5.7, -Math.PI / 2 - 0.3);
  K.person(Q, "adina", -1.5, -32.6, 0.2);
  K.person(Q, "boy", 4.5, 14.6, -2.4);
  K.action(Q, "flags", -5.0, 7.3, "Pick up the flags", "flags");
  K.action(Q, "gleaner", 4.5, 12.2, "Buy a newspaper", "gleaner");
  K.action(Q, "lunch", -4.9, -20.0, "Pick up the bread", "lunch");
  K.action(Q, "fruit", 4.6, -22.0, "Pick up the oranges", "fruit");
  K.action(Q, "water", 1.4, -31.7, "Fill the water bottle", "bottle");
  K.action(Q, "paperGran", -2.6, -33.0, "Give Grandma the paper");

  const BAG = [-2.7, -33.2],
    LEVI = [3.7, -7.1];
  Q.carryTo = ["flags", "paperGran", "water", "lunch", "fruit"];
  Q.where = (id, S) => {
    if (id === "flags" && S.hand === "flags") return LEVI;
    if (["water", "lunch", "fruit"].includes(id) && S.hand) return BAG;
    return null;
  };
  const packSpot = (k) => [-2.5 + k * 0.22, 0.49, -34.5];
  Q.act = {
    flags(api) {
      if (api.S.hand !== "flags") {
        api.hold("flags");
        api.notice("Take the flags to Uncle Levi's cart.");
        return false;
      }
      api.place([2.3, 0.79, -8.0]);
      api.notice("The flags are in the cart.");
    },
    gleaner(api) {
      api.hold("gleaner");
      api.notice("Take the paper to Grandma at the Parade.");
    },
    paperGran(api) {
      api.place([-3.6, 0.49, -34.55]);
      api.notice("Grandma has the paper.");
    },
    water: (api) => pack(api, "water", "bottle"),
    lunch: (api) => pack(api, "lunch", "lunch"),
    fruit: (api) => pack(api, "fruit", "fruit"),
  };
  function pack(api, key, item) {
    if (api.S.hand !== item) {
      api.hold(item);
      api.notice("Put it by the bag on Grandma's bench.");
      return false;
    }
    api.place(packSpot(api.S.packed.length));
    api.S.packed.push(key);
  }
  Q.show = (api) => {
    const { S } = api,
      I = Q.items;
    const at = (o, p) => {
      if (o.parent !== Q.group) Q.group.add(o);
      o.position.set(...p);
      o.visible = true;
    };
    if (S.stage > 21 && S.hand !== "flags") at(I.flags, [2.3, 0.79, -8.0]);
    if (S.stage > 23 && S.hand !== "gleaner") at(I.gleaner, [-3.6, 0.49, -34.55]);
    for (const [key, item] of [
      ["water", "bottle"],
      ["lunch", "lunch"],
      ["fruit", "fruit"],
    ])
      if ((S.packed.includes(key) || S.stage > 25) && S.hand !== item) at(I[item], packSpot(Math.max(0, S.packed.indexOf(key)) + (S.packed.includes(key) ? 0 : ["water", "lunch", "fruit"].indexOf(key))));
  };
  Q.keepOff = [
    { pts: [[0, 19.4], [0, -31]], w: 0.9 },
    { pts: [[0, 12], [-4.6, 8.4]], w: 0.8 },
    { pts: [[0, 2], [3.5, -6.4]], w: 0.8 },
    { pts: [[0, 14], [4.4, 12.3]], w: 0.8 },
    { pts: [[0, -19.5], [-4.8, -20]], w: 0.8 },
    { pts: [[0, -21.5], [4.5, -22]], w: 0.8 },
    { at: [-1.5, -32.6], r: 1.3 },
    { at: [1.4, -31.7], r: 1.0 },
    { at: [-4.9, 9.6], r: 1.1 },
    { at: [3.25, -5.7], r: 1.1 },
  ];
  Q.routes = [{ id: "down the street", pts: [[0, 19.4], [0, -31]], what: "player", h: 1.3, r: 0.22 }];
  Q.thin = 2;
  Q.ambient.push(
    // shoppers in the piazzas, and people walking up and down the street
    stroll("dtW0", -5.2, 14.5, 101, [-6.0, 12.6, -4.4, 18.5]),
    stroll("dtW1", -5.1, -6.5, 102, [-6.0, -17, -4.4, 2.5]),
    stroll("dtW2", -5.3, -26.5, 103, [-6.0, -30, -4.4, -22.5]),
    stroll("dtE0", 5.2, 18.0, 104, [4.4, 13.8, 6.0, 20.6]), // north of the news stand: the way past it is the newspaper buyer's path
    stroll("dtE1", 5.0, -12.5, 105, [4.4, -30, 6.0, 10.8]),
    stroll("dtE2", 5.3, -25.5, 106, [4.4, -30, 6.0, 19]),
    walker("dtR0", [-2.0, 16.5], [-2.0, -8.5], 107),
    walker("dtR1", [1.6, -27.5], [1.6, -14.5], 108),
    walker("dtR2", [-1.7, -16.5], [-1.7, -30.5], 109),
    // talk at the shop doors
    chat("dtA0", "dtA", -5.4, 15.4, 110),
    chat("dtA1", "dtA", -4.7, 16.0, 111),
    chat("dtB0", "dtB", 5.3, 6.0, 112),
    chat("dtB1", "dtB", 4.6, 6.6, 113),
    watch("dtB2", 5.5, 7.4, 114, [4.9, 6.3], { react: ["Laugh", "Point"] }),
    chat("dtC0", "dtC", -5.3, -13.6, 115),
    chat("dtC1", "dtC", -4.6, -13.1, 116),
    rasta(chat("dtD0", "dtD", 5.2, -9.4, 117), 0),
    rasta(chat("dtD1", "dtD", 4.6, -10.1, 118), 3),
    // the record shop: people stop to listen at the door
    listen("dtM0", 5.4, -0.2, 119, [6.3, -1.5]),
    listen("dtM1", 4.7, -2.7, 120, [6.3, -1.5]),
    listen("dtM2", 5.5, -3.4, 121, [6.3, -1.5]),
    // people at work: the newsboy, the baker, the higgler, the pharmacist at his door
    watch("dtN0", 5.7, 13.5, 122, [0, 12], { react: ["Point", "Wave"], idles: ["Idle", "LookAround"] }),
    watch("dtK0", -6.0, -21.8, 123, [0, -20], { react: ["Wave"] }),
    watch("dtH0", 5.75, -19.0, 124, [0, -21], { react: ["Point", "Wave"] }),
    watch("dtP0", -5.7, -0.7, 125, [0, -1], { react: ["Wave"] }),
    watch("dtS0", -5.8, 18.6, 126, [0, 18]),
    // children by the Parade
    child("dtK1", 2.4, -27.0, 127, [0.9, -30, 3.3, -24.5]),
    child("dtK2", 3.0, -25.5, 128, [0.9, -30, 3.3, -24.5], true),
  );
  return Q;
}

/* ---------- chapter 3: the Parade bus park, the morning of the arrival ---------- */
export function parade(K) {
  const Q = K.base("parade", [-14, 3.3, 14, 20.6], [0.4, 18.0, 0]);
  Q.surface = "stone";
  Q.mixed = true; // travellers to Palisadoes: many Rastafari visitors among them
  box(60, 0.02, 9.2, std(T.concrete([20, 3], [92, 92, 88])), 0, 0.0, 12.2, Q.group);
  box(60, 0.03, 4.4, std(T.concrete([20, 2], [176, 170, 156])), 0, 0.015, 18.9, Q.group);
  box(60, 0.03, 4.6, std(T.concrete([20, 2], [182, 176, 160])), 0, 0.015, 5.3, Q.group);
  for (const z of [7.6, 16.7]) box(60, 0.08, 0.14, solid(0xb3ad9e), 0, 0.04, z, Q.group);
  for (let x = -26; x < 28; x += 6) box(2.4, 0.012, 0.12, solid(0xe2dccb), x, 0.016, 12.2, Q.group);
  // shops along the south side, their piazza where the morning starts
  [
    [-9.5, "TAILOR AND OUTFITTER", [214, 222, 206], 0x2f5e4e, 2, "jamaica"],
    [0, "DRUG STORE", [236, 222, 196], 0x6a3b2a, 2, "ethiopia"],
    [9.5, "RESTAURANT", [222, 206, 214], 0x5a3b4a, 1, null],
  ].forEach(([xc, sign, colour, trim, storeys, flag], i) => {
    const b = K6.piazzaBuilding(9.5, { colour, trim, storeys, sign, flag, seed: 30 + i });
    put(Q, b, xc, 21.0, Math.PI / 2);
    Q.walls.push([xc - 4.75, 21.0, xc + 4.75, 27]);
    for (const [cx, cz] of b.userData.cols) Q.walls.push(rect(xc + cz, 21.0 - cx, 0.4, 0.4));
  });
  for (const s of [-1, 1]) put(Q, K6.farBlock(10, 7, 9, 0xd8cfb4), s * 19.5, 21.5);
  // the buses: the family's bus at the front, another loading behind; a hired truck and a car on the street
  const bus = put(Q, K6.cityBus("PALISADOES"), 4.6, 9.1, 0, [-0.3, 7.75, 9.5, 10.45]);
  put(Q, K6.cityBus("SPECIAL", "SP", "J 4093"), -8.6, 9.1, 0, [-13.5, 7.75, -3.7, 10.45]);
  put(Q, K6.truck(0x5a3f2a, "M 7752"), 11.6, 14.1, Math.PI, [8.7, 13.0, 14.6, 15.2]);
  put(Q, K6.car(0x3a5a3a, "P 6620"), -10.4, 14.4, Math.PI, rect(-10.4, 14.4, 4.8, 2.0));
  // the bus bay: queue rails, the conductor's ticket rack, the family's hamper and a suitcase
  put(Q, K6.queueRail(4.5), -8.6, 6.3, 0, rect(-8.6, 6.3, 4.6, 0.15));
  put(Q, K6.ticketRack(), 9.4, 5.25, 0, rect(9.4, 5.25, 0.45, 0.45));
  K.item(Q, "ticket", P.card("ticket"), 9.4, 5.05, 0.665);
  Q.items.ticket.rotation.y = Math.PI / 2;
  put(Q, hamper(), 6.5, 4.35, 0.2, rect(6.5, 4.35, 0.6, 0.45));
  put(Q, suitcase(), 7.3, 4.2, -0.2, rect(7.3, 4.2, 0.7, 0.3));
  // Rastafari visitors with their banner and drums at the far end of the bay
  put(Q, K6.banner(2.4), -11.6, 4.1, 0, rect(-11.6, 4.1, 2.9, 0.45));
  put(Q, K6.drums(), -9.0, 4.0, 0, rect(-8.75, 4.0, 1.0, 0.7));
  put(Q, K6.flagPole("jamaica", 5.5), 12.6, 4.2, 0, rect(12.6, 4.2, 0.55, 0.55));
  put(Q, marketBasket(), -4.6, 19.6, 0, rect(-4.6, 19.6, 0.55, 0.55));
  put(Q, K6.orangeBasket(), -3.8, 19.9, 0, rect(-3.8, 19.9, 0.65, 0.65));
  put(Q, bench(2), 13.0, 19.8, Math.PI, rect(13.0, 19.8, 2.05, 0.6));
  put(Q, K6.streetLamp(4.4, false), -1.0, 3.8, Math.PI / 2, rect(-1.0, 3.8, 0.25, 0.25));
  put(Q, K6.streetLamp(4.4, false), -6.2, 17.0, -Math.PI / 2, rect(-6.2, 17.0, 0.25, 0.25));
  // the Parade gardens behind the railing: tall trees, lamps and benches; buildings beyond
  put(Q, K6.railing(56), 0, 3.0);
  const r = rng(21);
  for (let i = 0; i < 11; i++) put(Q, tree(8 + r() * 3, 60 + i, 1), -25 + i * 5 + r() * 1.5, -4 - r() * 12);
  for (let i = 0; i < 4; i++) put(Q, bench(2), -15 + i * 10, -1.0, 0);
  put(Q, K6.churchTower(20), -22, -26);
  skyline(Q, -40, 40, -34, 9, 14);

  K.person(Q, "mum", 0.4, 16.6, Math.PI);
  K.person(Q, "adina", 3.6, 3.9, 0.4);
  K.person(Q, "boy", 2.4, 4.0, 0.9);
  K.person(Q, "levi", 0.6, 4.1, -0.5);
  K.action(Q, "busStop", 5.4, 5.6, "The bus bay");
  K.action(Q, "buyTicket", 8.6, 4.7, "Buy the tickets", "ticket");
  K.action(Q, "giveTicket", 6.0, 5.3, "Give Mum the tickets");
  K.action(Q, "bus", 8.1, 6.7, "Climb on the bus");
  Q.lead = { stage: 30, path: [[0.4, 16.6], [-2.0, 14.0], [-2.0, 6.0], [5.4, 5.5]] };
  Q.leadPath = Q.lead.path;
  Q.carryTo = ["giveTicket"];
  Q.where = (id, S) => (id === "giveTicket" ? [6.0, 5.3] : null);
  Q.act = {
    buyTicket(api) {
      api.hold("ticket");
      api.notice("Give the tickets to Mum.");
    },
    giveTicket(api) {
      api.place([6.5, 0.36, 4.35]);
      api.notice("Mum puts the tickets on the hamper.");
    },
    bus(api) {
      api.sound("goal");
    },
  };
  Q.show = (api) => {
    const { S } = api,
      o = Q.items.ticket;
    if (S.stage > 32 && S.hand !== "ticket") {
      if (o.parent !== Q.group) Q.group.add(o);
      o.position.set(6.5, 0.36, 4.35);
      o.visible = true;
    }
  };
  Q.routes = [{ id: "Mum leads to the bus", pts: Q.lead.path, what: "guide", h: 1.7, r: 0.25 }];
  Q.keepOff = [
    { pts: Q.lead.path, w: 1.15 },
    { pts: [[5.4, 5.5], [9.0, 5.2]], w: 0.9 },
    { at: [3.6, 3.9], r: 1.0 },
    { at: [0.6, 4.1], r: 1.0 },
    { at: [8.1, 6.7], r: 1.0 },
  ];
  Q.ambient.push(
    // the queue for the other bus, facing its door
    ...[-11.6, -10.6, -9.6, -8.6, -7.6, -6.6].map((x, i) => watch("pq" + i, x, 6.95 - (i % 2) * 0.12, 201 + i, [-5.1, 8.2], { react: ["Point", "Wave"], every: [5, 10] })),
    ...[-9.9, -8.4, -7.0].map((x, i) => watch("pr" + i, x, 5.6, 207 + i, [-5.1, 8.2], { react: ["Wave"], every: [5, 10] })),
    // the conductor at his rack, and people waiting by the family's bus
    watch("pcon", 9.9, 6.3, 212, [6, 5], { react: ["Point", "Wave"], idles: ["Idle", "LookAround"] }, { base: "sel_crowdman66", sex: "m", colors: { shirt: 0x9b9d97, legs: 0x39425c }, tint: { Shirt: 0x9b9d97, Collar: 0x9b9d97, Breeches: 0x39425c } }),
    chat("pA0", "pA", 11.4, 5.4, 213),
    chat("pA1", "pA", 12.0, 6.1, 214),
    // Rastafari visitors with drums and the banner
    rasta(chat("pB0", "pB", -13.3, 5.2, 215), 0),
    rasta(chat("pB1", "pB", -12.6, 5.6, 216), 1),
    rasta(watch("pB2", -13.1, 6.3, 217, [-12.9, 5.4], { react: ["Clap", "Laugh"] }), 2),
    rasta(watch("pB3", -8.0, 4.3, 218, [-9, 4], { react: ["Clap", "Cheer"] }), 3),
    // the south sidewalk: higglers, friends meeting, people hurrying to the buses
    watch("pH0", -4.2, 20.2, 220, [-2, 16], { react: ["Wave", "Point"] }),
    chat("pC0", "pC", 6.0, 18.0, 221),
    chat("pC1", "pC", 6.7, 17.6, 222),
    chat("pD0", "pD", -10.6, 19.3, 223),
    chat("pD1", "pD", -11.2, 18.6, 224),
    watch("pD2", -10.0, 18.3, 225, [-10.9, 19.0], { react: ["Laugh", "Wave"] }),
    walker("pW0", [-12.5, 19.9], [-6.5, 19.9], 226),
    walker("pW1", [13.0, 17.4], [8.0, 17.4], 227),
    walker("pW2", [-12.8, 12.0], [-4.0, 12.0], 228),
    stroll("pS0", 11.5, 11.8, 229, [9.8, 10.9, 13.6, 12.7]),
    child("pK0", 1.8, 17.4, 230, [1.0, 16.8, 2.6, 18.35]),
    child("pK1", 4.2, 17.6, 231, [3.4, 16.8, 5.0, 18.35], true),
    watch("pT0", 13.65, 16.35, 232, [11.6, 14.1], { react: ["Wave", "Point"] }),
  );
  return Q;
}

/* ---------- chapter 3, second part: the Palisadoes road. The road from places.js is redressed here: the family's bus has stopped in the
   traffic and everyone walks the last part with the crowd (the Gleaner lists people coming on foot, in cars, drays, carts, trucks, hired
   buses and on bicycles). The harbour is to the west, with Kingston and the mountains across it. ---------- */
export function road(K) {
  const Q = K.base("road", [-5.5, -42, 5.5, 22], [-4.5, 12.6, 0]);
  Q.surface = "stone";
  Q.mixed = true;
  const shore = plane(30, 200, std(T.sand([3, 24])), 0, -0.025, -20, Q.group);
  shore.rotation.x = -Math.PI / 2;
  const sea = createSea(Q.group, { kind: "caribbean", y: -0.12, at: [-60, -50], size: 300, far: 2000, farAt: [0, -50], farDrop: 0.1, swell: 0.5 }).near;   /* the harbour to the west (engine/sea.js), with a low swell: the shore lies only 10 cm above it */
  Q.props.sea = sea;
  box(10, 0.04, 120, solid(0x8f8e80), 0, 0.01, -18, Q.group);
  for (const s of [-1, 1]) box(0.12, 0.08, 120, P.CREAM, s * 4.85, 0.04, -18, Q.group);
  for (let i = 0; i < 16; i++) box(0.1, 0.012, 2.3, P.CREAM, 0, 0.035, 22 - i * 7, Q.group);
  // a low sea wall on the harbour side
  box(0.5, 0.55, 120, solid(0xa8a294), -6.0, 0.27, -18, Q.group);
  Q.walls.push([-6.3, -80, -5.75, 40]);
  // across the harbour: Kingston's low buildings and the mountains behind
  const r = rng(31);
  for (let i = 0; i < 28; i++) put(Q, K6.farBlock(10 + r() * 14, 4 + r() * 9, 7.5, [0xd8cfb4, 0xcfd8cc, 0xe0d2b6][i % 3]), -170 - r() * 30, -120 + i * 9);
  for (let i = 0; i < 7; i++) {
    const h = mesh(new THREE.SphereGeometry(1, 14, 8), flat(0x5f7a66), -330 - (i % 2) * 60, -10, -180 + i * 60, Q.group);
    h.scale.set(90, 60 + (i % 3) * 30, 70);
  }
  // the ships at anchor in the harbour
  for (const [x, z] of [
    [-60, -40],
    [-95, 10],
  ]) {
    box(28, 3, 6, solid(0x4a4f52), x, 1.2, z, Q.group);
    box(8, 4, 5, solid(0xe6e0d0), x + 6, 4.5, z, Q.group);
  }
  // the open-sea side: sea grape bushes, cactus and a few palms on the sand
  for (let i = 0; i < 8; i++) {
    put(Q, bush(i + 3, 1.2), 8 + (i % 3) * 3, 16 - i * 8);
    if (i % 2) K.plant(Q, 9.5, 12 - i * 9, "palm", i + 4);
  }
  for (let i = 0; i < 5; i++) {
    const c = grp();
    cyl(0.12, 0.14, 1.6, flat(0x4f7a3a), 0, 0.8, 0, c, 6);
    cyl(0.08, 0.09, 0.8, flat(0x4f7a3a), 0.25, 1.2, 0, c, 6).rotation.z = -0.6;
    put(Q, c, 7.0 + (i % 2) * 2, 4 - i * 10);
  }
  // far ahead: the airport, its tower, and the road sign
  box(60, 4, 10, flat(0xd9d0af), 14, 2, -175, Q.group);
  box(5, 11, 5, flat(0xd5d0b9), -12, 5.5, -170, Q.group);
  box(7, 1.8, 7, flat(0x526a68), -12, 11, -170, Q.group);
  const s = grp();
  for (const dx of [-0.7, 0.7]) box(0.08, 1.9, 0.08, P.WOOD, dx, 0.95, 0, s);
  const tx = K6.shopSign("AIRPORT", 1.8, 0.45, "#f1ede0", "#1f3a33");
  tx.position.y = 1.65;
  s.add(tx);
  put(Q, s, 5.2, -22, 0);
  // the traffic: the family's bus has stopped, with a truck, cars and a dray ahead of it in the line
  put(Q, K6.cityBus("PALISADOES"), -2.6, 17.4, Math.PI / 2, [-3.9, 12.5, -1.3, 22.3]);
  put(Q, K6.truck(0x2f5f6a, "M 3069"), -2.6, 5.8, Math.PI / 2, [-3.75, 2.95, -1.45, 8.85]);
  put(Q, K6.car(0x7d2f2a, "P 3051"), -2.6, -5.4, Math.PI / 2, rect(-2.6, -5.4, 2.0, 4.8));
  put(Q, K6.car(0xd8d2bc, "P 4427"), -2.6, -12.6, Math.PI / 2, rect(-2.6, -12.6, 2.0, 4.8));
  put(Q, countryCart(2.2, 1.2), -2.6, -21.0, -Math.PI / 2, [-3.4, -22.3, -1.8, -17.6]);
  put(Q, K6.car(0x2f4f6a, "P 7193"), -2.6, -30.4, Math.PI / 2, rect(-2.6, -30.4, 2.0, 4.8));
  put(Q, K6.bicycle(0x6a2a2a), 4.4, -16.0, Math.PI / 2, rect(4.4, -16.0, 0.4, 1.3));
  put(Q, bench(1.8), -5.25, 0.6, Math.PI / 2, rect(-5.25, 0.6, 0.6, 1.85));
  K.item(Q, "bottle", P.bottle(), -4.85, 13.6, 0);

  K.person(Q, "mum", -4.3, 9.2, Math.PI);
  K.person(Q, "adina", -4.4, 2.4, 0.4);
  K.person(Q, "boy", -4.6, -1.0, 0.3);
  K.person(Q, "levi", -3.9, -8.5, 0.6);
  K.action(Q, "roadWater", -4.6, 13.9, "Pick up the water", "bottle");
  K.action(Q, "lookout", -4.7, -14.5, "Look over the harbour");
  K.action(Q, "roadEnd", -0.6, -38, "On to the airport");
  Q.carryTo = ["roadWater"];
  Q.where = (id, S) => (id === "roadWater" && S.hand === "bottle" ? [-4.0, 3.6] : null);
  Q.act = {
    roadWater(api) {
      if (api.S.hand !== "bottle") {
        api.hold("bottle");
        api.notice("Bring the water to Grandma.");
        return false;
      }
      api.place([-5.3, 0.48, 1.2]);
      Q.props.cupGiven = api.give("adina");
      api.notice("Grandma has some water.");
    },
  };
  Q.show = (api) => {
    if (api.S.stage > 34 && api.S.hand !== "bottle") {
      const o = Q.items.bottle;
      if (o.parent !== Q.group) Q.group.add(o);
      o.position.set(-5.3, 0.48, 1.2);
      if (!Q.props.cupGiven) Q.props.cupGiven = api.give("adina");
    }
  };
  const path = [
    [-4.5, 12.6],
    [-4.3, 3.6],
    [-4.6, -14.5],
    [-4.6, -24],
    [-0.6, -27],
    [-0.6, -38],
  ];
  Q.routes = [{ id: "along the road", pts: path, what: "player", h: 1.3, r: 0.22 }];
  Q.keepOff = [
    { pts: path, w: 0.9 },
    { at: [-4.4, 2.4], r: 1.1 },
    { at: [-4.3, 9.2], r: 1.0 },
    { at: [-3.9, -8.5], r: 1.0 },
  ];
  // the crowd walking to Palisadoes: some with flags and palm fronds, families together, friends talking as they go
  const go = [
    [[1.0, 19], [1.0, -36]],
    [[3.6, 16], [3.6, -37]],
    [[2.3, 8], [2.3, -34]],
    [[0.2, 2], [0.2, -18]],
    [[4.3, 0], [4.3, -12]],
    [[1.6, -6], [1.6, -38]],
    [[3.0, -20], [3.0, -39]],
    [[-0.6, 12], [-0.6, -2]],
  ];
  go.forEach(([a, b], i) => Q.ambient.push(walker("rw" + i, a, b, 301 + i, { behaviour: { kind: "errand", from: a, to: b, walk: "Walk", back: "Walk", wait: [1, 3], idles: ["Idle", "LookAround"] } })));
  Q.ambient.push(
    chat("rA0", "rA", 3.2, 12.2, 311),
    chat("rA1", "rA", 3.9, 12.8, 312),
    chat("rB0", "rB", 2.8, -26.5, 313),
    chat("rB1", "rB", 3.6, -27.0, 314),
    watch("rB2", 3.2, -27.9, 315, [3.2, -26.7], { react: ["Laugh", "Point"] }),
    watch("rC0", 4.6, 6.0, 316, [0, -40], { react: ["Point", "Wave", "Cheer"] }),
    watch("rC1", 4.7, -30.5, 317, [0, -40], { react: ["Point", "Wave", "Cheer"] }),
    child("rK0", 4.0, 3.0, 318, [3.0, 1.0, 5.0, 4.5], true),
    watch("rD0", -1.0, 9.6, 319, [-2.6, 5.8], { react: ["Wave"] }),
  );
  return Q;
}

/* ---------- chapter 6: that evening, the family's lane ---------- */
export function lane(K) {
  const Q = K.base("lane", [-9.2, -15.5, 7.4, 17], [0.4, 14.6, 0]);
  Q.surface = "sand";
  Q.evening = true;
  // The lane meets cross streets in both directions. Keep the land visible
  // behind the yards covered as the player turns or looks past a fence.
  const land = plane(180, 180, std(T.grass([64, 64], [113, 120, 74])), 0, -0.003, 0, Q.group);
  land.rotation.x = -Math.PI / 2;
  const dirt = std(T.dirt([5, 7], [166, 138, 98]));
  box(5.5, 0.02, 50, std(T.dirt([3, 25], [146, 128, 102])), 0, 0, 0, Q.group);
  const asphalt = std(T.concrete([2, 24], [104, 102, 96]));
  box(3.0, 0.012, 50, asphalt, 0.2, 0.015, 0, Q.group);
  const gutter = std(T.concrete([1, 24], [140, 130, 108]));
  for (const side of [-1, 1]) {
    box(0.26, 0.025, 44, gutter, side * 2.1, 0.005, 0, Q.group);
    box(0.14, 0.055, 44, gutter, side * 2.28, 0.02, 0, Q.group);
  }
  for (const z of [-24.5, 24.5]) {
    box(70, 0.02, 5.1, std(T.dirt([35, 3], [146, 128, 102])), 0, -0.007, z, Q.group);
    box(70, 0.012, 4.1, std(T.concrete([35, 2], [104, 102, 96])), 0, 0.012, z, Q.group);
  }
  box(7, 0.015, 12, dirt, -5.7, 0.008, -3, Q.group);
  box(5.8, 0.012, 8.1, dirt, 5.5, 0, 12.4, Q.group);
  box(5.5, 0.012, 7.6, dirt, -5.45, 0, 9.5, Q.group);
  // the family's house: its lit veranda faces the lane
  put(Q, K6.louvreHouse(8, 6, { colour: [214, 228, 214], trim: 0x3f6f62, veranda: 2.4, lit: true }), -11.4, -3, Math.PI / 2);
  Q.walls.push([-14.4, -7, -8.4, 1], [-6.25, -7.05, -5.95, -4.0], [-6.25, -2.0, -5.95, 1.05]);
  const bulb = grp();
  cyl(0.012, 0.012, 0.3, solid(0x2a2a2a), 0, -0.15, 0, bulb, 4);
  mesh(new THREE.SphereGeometry(0.08, 10, 8), glow(0xffe2a8), 0, -0.34, 0, bulb);
  put(Q, bulb, -7.2, -3.0, 0, null, 2.82);
  // the veranda table: Grandma's tin and the picture, and the radio
  put(Q, P.table(1.2, 0.7), -7.5, -5.7, Math.PI / 2, rect(-7.5, -5.7, 0.75, 1.25));
  const tin = P.tin();
  tin.userData.lid.rotation.x = -1.9;
  put(Q, tin, -7.55, -5.95, Math.PI / 2, null, 0.83);
  P.dynamic(tin);
  const photo = P.card("photo");
  put(Q, photo, -7.3, -5.51, Math.PI / 2, null, 0.825);
  put(Q, K6.radio(), -7.7, -5.25, Math.PI / 2, null, 0.83);
  put(Q, P.table(0.6, 0.52), -5.75, -0.65, 0, rect(-5.75, -0.65, 0.62, 0.54));
  K.item(Q, "ticket", P.card("ticket"), -5.75, -0.65, 0.825);
  // the front wall of the yard with its open gate, pots, flowers and a lime tree
  for (const [z0, z1] of [
    [-9, -4.6],
    [-1.4, 1.6],
  ]) {
    box(0.22, 0.95, z1 - z0, std(T.plaster([214, 206, 188], [2, 1])), -2.7, 0.475, (z0 + z1) / 2, Q.group);
    Q.walls.push([-2.85, z0, -2.55, z1]);
  }
  for (const z of [-4.5, -1.5]) box(0.3, 1.25, 0.3, solid(0xe6dfcd), -2.7, 0.625, z, Q.group);
  put(Q, K6.tinPlant(5), -5.5, 0.6, 0, rect(-5.5, 0.6, 0.35, 0.35));
  put(Q, K6.tinPlant(6), -3.3, -8.3, 0, rect(-3.3, -8.3, 0.35, 0.35));
  put(Q, flowers(12), -4.0, 1.1);
  put(Q, tree(4.2, 77), -6.0, -9.3, 0, rect(-6.0, -9.3, 0.8, 0.8));
  // up and down the lane: zinc fences, the neighbours' houses with lit windows, a corner shop with its radio, street lamps
  for (const [x, z0, z1, seed] of [
    [-2.7, 1.8, 17, 2],
    [-2.7, -16, -9.2, 3],
    [2.75, -16, -4.0, 4],
    [2.75, -1.6, 8.2, 5],
  ]) {
    const f = K6.zincFence(z1 - z0, 1.9, seed);
    put(Q, f, x, (z0 + z1) / 2, x > 0 ? -Math.PI / 2 : Math.PI / 2); // posts and rails on the far side of the lane
    Q.walls.push([x - 0.15, z0, x + 0.15, z1]);
  }
  put(Q, K6.louvreHouse(7, 5, { colour: [236, 222, 196], trim: 0x6a3b2a, veranda: 2, lit: true }), -9.6, 9.5, Math.PI / 2);
  put(Q, K6.louvreHouse(7, 5, { colour: [206, 218, 230], trim: 0x2b4b6b, veranda: 2, lit: true }), 9.4, -8.5, -Math.PI / 2);
  put(Q, K6.louvreHouse(7, 5, { colour: [230, 214, 214], trim: 0x5a3b4a, veranda: 2, lit: false }), 9.4, 3.0, -Math.PI / 2);

  const shop = K6.piazzaBuilding(7, { colour: [232, 216, 168], trim: 0x7a3b2a, storeys: 1, sign: "GROCERY", P: 1.6, depth: 5, lit: true, seed: 50 });
  put(Q, shop, 6.0, 12.4, Math.PI);
  Q.walls.push([6.0, 8.9, 11, 15.9]);
  for (const [cx, cz] of shop.userData.cols) Q.walls.push(rect(6.0 - cx, 12.4 - cz, 0.4, 0.4));
  put(Q, K6.trestle(1.3, 0.55), 5.6, 12.6, Math.PI / 2, rect(5.6, 12.6, 0.6, 1.35));
  put(Q, K6.radio(), 5.6, 12.3, -Math.PI / 2, null, 0.83);
  put(Q, K6.streetLamp(4.2, true), 2.3, 1.0, Math.PI, rect(2.3, 1.0, 0.25, 0.25));
  put(Q, K6.streetLamp(4.2, true), -2.25, 12.0, 0, rect(-2.25, 12.0, 0.25, 0.25));
  put(Q, K6.bicycle(0x2a5a3a), 2.3, 6.0, Math.PI / 2, rect(2.3, 6.0, 0.4, 1.3));
  // The nearest backdrop is another row of homes with its fronts toward
  // the street. Beyond it are trees and several more roofs.
  const houseColours = [
    { colour: [218, 208, 184], trim: 0x6a493c },
    { colour: [195, 212, 195], trim: 0x506954 },
    { colour: [207, 214, 222], trim: 0x425c71 },
  ];
  const neighbours = [
    [-9.3, -17, Math.PI / 2], [9.6, -18.5, -Math.PI / 2],
    [-9.6, 19.5, Math.PI / 2], [9.8, 19.8, -Math.PI / 2],
    [-11.2, -32.5, 0], [6.3, -33.1, 0], [19, -31.5, 0],
    [-18.2, 33.9, Math.PI], [-3.9, 31.8, Math.PI], [13.1, 33.2, Math.PI],
  ];
  neighbours.forEach(([x, z, yaw], i) => {
    const house = K6.louvreHouse(6.8, 5, { ...houseColours[i % houseColours.length], veranda: 1.35, lit: i % 3 !== 0 });
    put(Q, house, x, z, yaw);
  });
  const foothills = hillRing(190, 18, 32, { seed: 66, base: [0.20, 0.31, 0.25] });
  for (const hill of [...foothills.children]) if (hill.position.z > -105) hill.removeFromParent();
  Q.group.add(foothills);
  for (const [x, z, height] of [
    [-20, -19, 8], [17, -16, 7], [-22, 8, 6], [19, 3, 8],
    [-20, 20, 8], [22, 20, 7], [-26, -37, 8], [0, -43, 9],
    [28, -39, 8], [-25, 37, 8], [5, 44, 9], [26, 38, 7],
    [-22, 50, 9], [-10, 57, 10], [3, 66, 8], [15, 51, 9], [26, 56, 8],
  ]) put(Q, tree(height, 120 + x), x, z);
  for (const [x, z, s] of [[-5.6, -12.6, .85], [-4.9, 4.5, .7], [3.65, -8, .8], [4.1, 1.6, .9], [4.4, 7.8, .75]]) {
    put(Q, bush(19 + x, s), x, z);
  }
  for (const [x, z] of [[-2.3, -20.2], [2.3, 20.3]]) put(Q, K6.streetLamp(4.2, true), x, z);

  K.person(Q, "adina", -7.6, -1.3, 1.2);
  K.person(Q, "mum", -4.6, -2.4, 1.1);
  K.person(Q, "levi", -4.3, -6.3, 0.6);
  K.person(Q, "boy", -3.7, 1.0, 1.9);
  K.person(Q, "visitor", 1.4, -8.2, -0.8);
  K.action(Q, "ticket", -5.25, -1.4, "Pick up the bus ticket", "ticket");
  Q.carryTo = ["ticket"];
  Q.where = (id, S) => (id === "ticket" && S.hand === "ticket" ? [-7.0, -4.2] : null);
  Q.act = {
    ticket(api) {
      if (api.S.hand !== "ticket") {
        api.hold("ticket");
        api.notice("Put it beside the picture on the table.");
        return false;
      }
      api.place([-7.3, 0.825, -5.24]);
    },
  };
  Q.show = (api) => {
    if (api.S.stage > 61 && api.S.hand !== "ticket") {
      const o = Q.items.ticket;
      if (o.parent !== Q.group) Q.group.add(o);
      o.position.set(-7.3, 0.825, -5.24);
      o.visible = true;
    }
  };
  const path = [
    [0.4, 14.6],
    [0.0, 2.0],
    [-2.0, -3.0],
    [-7.0, -3.4],
  ];
  Q.routes = [{ id: "home up the lane", pts: path, what: "player", h: 1.3, r: 0.22 }];
  Q.keepOff = [
    { pts: path, w: 0.9 },
    { pts: [[-2.0, -3.0], [-5.25, -1.4]], w: 0.8 },
    { at: [-4.6, -2.4], r: 1.0 },
    { at: [-4.3, -6.3], r: 1.0 },
    { at: [1.4, -8.2], r: 1.1 },
  ];
  Q.ambient.push(
    // neighbours round the shop's radio
    listen("lR0", 3.6, 11.0, 401, [5.6, 12.3]),
    listen("lR1", 3.4, 12.9, 402, [5.6, 12.3]),
    listen("lR2", 4.2, 14.2, 403, [5.6, 12.3]),
    listen("lR3", 2.6, 10.0, 404, [5.6, 12.3]),
    // talk in the lane about the day
    chat("lA0", "lA", 1.6, 5.2, 405),
    chat("lA1", "lA", 1.0, 4.5, 406),
    rasta(watch("lA2", 2.0, 4.1, 407, [1.3, 4.9], { react: ["Laugh", "Clap"] }), 1),
    chat("lB0", "lB", 1.8, -12.2, 408),
    chat("lB1", "lB", 1.1, -12.8, 409),
    walker("lW0", [1.8, -14.8], [1.8, -1.0], 410),
    child("lK0", -0.8, 8.5, 411, [-1.9, 6.0, 1.4, 10.5]),
    child("lK1", 0.6, 9.4, 412, [-1.9, 6.0, 1.4, 10.5], true),
    child("lK2", -1.2, 7.0, 413, [-1.9, 6.0, 1.4, 10.5]),
    watch("lE0", -1.9, -11.0, 414, [0, -5], { react: ["Wave"], idles: ["OldIdle", "Idle"] }),
  );
  return Q;
}

/* ---------- chapter 1: the family yard, made a Kingston yard of 1966 ---------- */
/* zinc fences round the yard, the family's plastered house with louvre windows and a Jamaican flag (Independence was in 1962), a calendar-free
   but clearly modern yard: a radio on the veranda rail, a standpipe, pots in kerosene tins. Called by yard() in places.js. */
export function dressYard(Q) {
  for (const [x, z, L, ry, seed] of [
    [-11.5, -14, 11, 0, 1],
    [0, -14, 12, 0, 2],
    [11.5, -14, 11, 0, 3],
    [-11.5, 19.5, 11, 0, 4],
    [0, 19.5, 12, 0, 5],
    [11.5, 19.5, 11, 0, 6],
  ]) {
    put(Q, K6.zincFence(L - 0.05, 1.9, seed), x, z, ry);
    Q.walls.push([x - L / 2, z - 0.15, x + L / 2, z + 0.15]);
  }
  for (const [x, z0, z1, seed] of [
    [-17.2, -14, 2, 7],
    [-17.2, 6, 19.5, 8],
    [17.2, -14, 19.5, 9],
  ]) {
    put(Q, K6.zincFence(z1 - z0, 1.9, seed), x, (z0 + z1) / 2, Math.PI / 2);
    Q.walls.push([x - 0.15, z0, x + 0.15, z1]);
  }
  put(Q, K6.wallFlag("jamaica", 1.5), -7.97, -8.5, 0, null, 2.0);
  put(Q, K6.radio(), -9.4, -2.72, 0, null, 0.89);
  put(Q, K6.tinPlant(1), -7.4, -3.6, 0, rect(-7.4, -3.6, 0.35, 0.35));
  put(Q, K6.tinPlant(2), -16.3, -2.2, 0, rect(-16.3, -2.2, 0.35, 0.35));
  put(Q, K6.bicycle(0x2f2f5f), 16.4, 1.8, Math.PI / 2, rect(16.4, 1.8, 0.4, 1.3));
}
