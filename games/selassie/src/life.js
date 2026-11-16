/* More life in every place (owner's note, November 2026: "the environment needs to be richer, more populous").
   Period detail and more background people, each doing something: neighbours chatting, children playing, people waiting and watching.
   Everything here keeps clear of the player's paths and story spots (keepOff and routes are tested by ?test=audit and ?test=ambient),
   and stands on the ground (the float check). Clothes, ages and heights come from crowdLook (cast.js). */
import * as THREE from "three";
import { grp, box, cyl, solid, mesh } from "./gfx.js";
import { crate, sack, bucket, barrel, standpipe, bench, cart, marketBasket, yamBasket, bananaBunch, bush, flowers, banana } from "./period-props.js";
const WOOD = solid(0x6b4f35, 0.9),
  IRON = solid(0x5b5f5c, 0.6, 0.4);
function put(Q, o, x, z, ry = 0, solidW = 0, solidD = solidW) {
  o.position.set(x, 0, z);
  o.rotation.y = ry;
  Q.group.add(o);
  if (solidW) Q.walls.push([x - solidW / 2, z - solidD / 2, x + solidW / 2, z + solidD / 2]);
  return o;
}
/* a washing line between two posts, with clothes pegged on it */
function washingLine(len = 6) {
  const g = grp();
  for (const x of [-len / 2, len / 2]) {
    cyl(0.045, 0.05, 2.0, WOOD, x, 1.0, 0, g, 6);
    box(0.25, 0.25, 0.25, solid(0x8a8070, 0.95), x, 0.06, 0, g);
  }
  box(len, 0.012, 0.012, solid(0xd8d2c0), 0, 1.92, 0, g);
  const cloths = [0xe9e4d6, 0x5d7fa0, 0xb6493d, 0xd9c26a, 0x7fa27a, 0xf0ece2, 0x8a6aa0];
  for (let i = 0; i < 7; i++) {
    const w = 0.35 + (i % 3) * 0.12,
      h = 0.45 + ((i * 7) % 4) * 0.08;
    box(w, h, 0.012, solid(cloths[i], 0.95), -len / 2 + 0.6 + i * ((len - 1.2) / 6), 1.92 - h / 2, 0, g);
  }
  return g;
}
/* a zinc washtub on a low stand, and a coal pot */
function washtub() {
  const g = grp();
  for (const [x, z] of [
    [-0.3, -0.25],
    [0.3, -0.25],
    [-0.3, 0.25],
    [0.3, 0.25],
  ])
    box(0.05, 0.4, 0.05, WOOD, x, 0.2, z, g);
  box(0.75, 0.04, 0.65, WOOD, 0, 0.42, 0, g);
  cyl(0.36, 0.3, 0.28, solid(0x9aa09c, 0.45, 0.5), 0, 0.58, 0, g, 16);
  cyl(0.33, 0.33, 0.02, solid(0x8fb0b8, 0.2), 0, 0.7, 0, g, 16);
  return g;
}
function coalPot() {
  const g = grp();
  cyl(0.16, 0.12, 0.28, IRON, 0, 0.14, 0, g, 10);
  cyl(0.17, 0.17, 0.03, solid(0x2a2522), 0, 0.29, 0, g, 10);
  cyl(0.13, 0.13, 0.02, solid(0xb5562e, 0.6), 0, 0.305, 0, g, 10);
  return g;
}
/* a roadside stall: a table under a canvas awning, baskets of fruit */
function stall() {
  const g = grp();
  for (const [x, z] of [
    [-0.9, -0.45],
    [0.9, -0.45],
    [-0.9, 0.45],
    [0.9, 0.45],
  ]) {
    box(0.06, 0.8, 0.06, WOOD, x, 0.4, z, g);
    box(0.05, 2.1, 0.05, WOOD, x, 1.05, z, g);
  }
  box(2.0, 0.06, 1.0, WOOD, 0, 0.82, 0, g);
  const roof = box(2.3, 0.03, 1.4, solid(0xc9b27a, 0.95), 0, 2.12, 0, g);
  roof.rotation.x = 0.1;
  for (const [x, c] of [
    [-0.55, 0xd9a43a],
    [0.05, 0x6f9a3e],
    [0.6, 0xc4562e],
  ]) {
    cyl(0.2, 0.15, 0.16, solid(0xa8803c, 0.95), x, 0.93, 0, g, 10);
    mesh(new THREE.SphereGeometry(0.17, 10, 6), solid(c, 0.8), x, 1.02, 0, g).scale.y = 0.45;
  }
  return g;
}
/* What each background person does (owner's note, November 2026: "ensure persons have varied actions and no standing zombies").
   Nobody stands in the plain Idle: every standing clip below moves (weight shifts, a look round, a cheerful sway,
   an old man's stoop; WipeSweat and HeadTurn turned heads faster than the head check allows, so only the police turn their heads), the shared ambient system starts each one at its own moment and speed, and the reactions fit the
   day (waving, a slow wave, clapping, cheering, pointing at the aircraft). Listeners in a chat nod and agree. Elders move like elders,
   children like children, and the ceremonial police stand at ease and only turn their heads. */
export const IDLES = {
  man: ["IdleM", "LookAround", "HappyIdle"],
  woman: ["HappyIdle", "LookAround", "IdleM"],
  elder: ["OldIdle", "IdleM"],
  kid: ["HappyIdle", "LookAround"],
  police: ["IdleM", "HeadTurn"],
};
export const LISTEN = ["Agree", "Nod", "HappyIdle", "IdleM"];
export const WELCOME = ["Wave", "WaveSlow", "Clap", "Cheer", "Point"];
export function kindOf(n) {
  if (n.police || /police/.test(n.base || "")) return "police";
  if ((n.scale || 1) < 0.88 || /girl|boy/.test(n.base || "")) return "kid";
  if (/elder|adina/.test(n.base || "")) return "elder";
  return n.sex === "f" ? "woman" : "man";
}
/* fill in a behaviour's clips for this person (a spec's own lists are kept) */
export function actions(n, spec, { welcome = false } = {}) {
  const k = kindOf(n),
    out = { walk: "Walk", ...spec };
  const mine = out.kind === "chat" ? (k === "kid" ? IDLES.kid : LISTEN) : IDLES[k];
  // a place's own list keeps its special clips (ListenMusic by a radio, an old man's stoop) but the plain Idle becomes this person's own
  out.idles = out.idles ? [...new Set(out.idles.flatMap((c) => (c === "Idle" ? mine : [c])))] : mine;
  if (out.sadIdles) out.sadIdles = out.sadIdles.filter((c) => c !== "Idle").concat("OldIdle");
  if (k === "police") out.react = [];
  else if (welcome) out.react = [...new Set([...(out.react || []), ...(k === "elder" ? ["WaveSlow", "Clap", "Agree"] : k === "kid" ? ["Cheer", "Clap", "Wave"] : WELCOME)])];
  else if (out.react) out.react = [...new Set([...out.react, k === "elder" ? "Nod" : "Clap"])];
  return out;
}
const chat = (id, group, x, z, look, extra = {}) => ({ id, x, z, look, behaviour: { kind: "chat", group }, ...extra });
const watcher = (id, x, z, look, at, extra = {}) => ({ id, x, z, look, behaviour: { kind: "watch", at, react: ["Wave", "Point", "Clap"], every: [3, 6] }, ...extra });
// children at play: a real child's body (not whatever the crowd hash gives), running between spots, stopping to cheer or clap, chasing a friend
const play = (id, x, z, look, area, girl, chaseId) => ({ id, x, z, look, base: girl ? "sel_girl66" : "sel_boy66", sex: girl ? "f" : "m", scale: 0.8 * (0.92 + (look % 5) * 0.03), behaviour: { kind: "play", area, chaseId, min: 0.8, pause: [0.5, 1.5] } });

export function enrichYard(Q) {
  put(Q, washingLine(6), 6, 12.5, 0, 6.2, 0.3);
  put(Q, standpipe(), -4.2, 10.2, 0, 0.7, 0.7);
  put(Q, bucket(), -3.4, 10.7, 0, 0.35, 0.35);
  put(Q, washtub(), 4.4, 8.6, 0.3, 0.8, 0.7);
  put(Q, bucket(0x7d8a8f), 5.4, 8.9, 0, 0.35, 0.35);
  put(Q, coalPot(), -9.0, -2.4, 0, 0.4, 0.4);
  put(Q, crate(0.55), 14.2, 4.6, 0.2, 0.6, 0.6);
  put(Q, crate(0.5, 0x7a5c3a), 14.3, 5.3, -0.3, 0.55, 0.55);
  put(Q, barrel(), -15.2, 0.4, 0, 0.65, 0.65);
  put(Q, bench(1.8), -4.6, 17.7, 0, 1.9, 0.45);
  put(Q, bush(3, 1), 15.6, 16.5);
  put(Q, flowers(4), -15.5, 9.5);
  put(Q, flowers(9), 15.4, 9.0);
  // the back of the yard, by the fence: banana plants, a bench and a bucket, and neighbours talking
  put(Q, banana(5, true), -4.6, -12.7, 0, 0.9, 0.9);
  put(Q, banana(8), 4.7, -12.8, 0, 0.9, 0.9);
  put(Q, bench(1.8), 2.0, -12.9, 0, 1.9, 0.45);
  put(Q, bucket(0x8a9490), 3.4, -11.7, 0, 0.35, 0.35);
  Q.ambient.push(
    chat("yardA0", "yardA", 12.4, -2.8, 21),
    chat("yardA1", "yardA", 13.3, -2.1, 22),
    watcher("yardA2", 12.3, -1.5, 23, [0, 0]),
    chat("yardB0", "yardB", -6.4, 13.4, 24),
    chat("yardB1", "yardB", -5.6, 14.1, 25),
    play("yardK0", 2.6, 6.2, 26, [1.6, 5.2, 7.4, 7.6], true, "yardK1"),
    play("yardK1", 6.8, 6.6, 39, [1.6, 5.2, 7.4, 7.6], false, "yardK0"),
    watcher("yardW0", -15.0, 12.0, 27, [0, 0]),
    chat("yardC0", "yardC", -2.2, -10.6, 28),
    chat("yardC1", "yardC", -1.3, -11.2, 29),
    watcher("yardC2", -2.8, -11.9, 30, [0, 0]),
  );
}
export function enrichMemory(Q) {
  // the 1930 street: half the passers-by keep the period recipe, the rest vary
  for (const s of Q.ambient) if (Number(s.id.replace("memory", "")) % 2) delete s.base;
  put(Q, cart(2.2, 1.2), -2.6, 19.4, Math.PI, 3.4, 1.4);
  put(Q, marketBasket(), -5.55, 1.3, 0, 0.5, 0.5);
  put(Q, yamBasket(), -5.55, 2.1, 0.4, 0.55, 0.55);
  put(Q, marketBasket(0x9a7a40), -5.5, 2.9, 0.7, 0.5, 0.5);
  put(Q, sack(), -2.0, 17.9, 0.2, 0.55, 0.55);
  put(Q, sack(0xa08a5a), -2.7, 17.8, -0.4, 0.55, 0.55);
  put(Q, crate(0.55), -3.5, 17.9, 0.1, 0.6, 0.6);
  put(Q, bench(1.6), -6.2, -9.0, Math.PI / 2, 0.45, 1.7);
  const bunch = bananaBunch(0.8);
  bunch.position.y = 0.83;
  put(Q, grp(), 3.6, -7.6).add(bunch);
  Q.ambient.push(
    chat("memA0", "memA", -5.6, 6.0, 41),
    chat("memA1", "memA", -4.8, 6.6, 42),
    chat("memB0", "memB", 5.1, -12.2, 43),
    chat("memB1", "memB", 5.8, -11.5, 44),
    watcher("memB2", 5.0, -10.9, 45, [0, 0]),
  );
}
export function enrichRoad(Q) {
  put(Q, stall(), 4.0, 12.5, -Math.PI / 2, 1.1, 2.1);
  put(Q, crate(0.5), -4.3, 9.6, 0.3, 0.55, 0.55);
  put(Q, sack(), -4.2, 10.4, 0, 0.55, 0.55);
  put(Q, bench(1.6), -4.3, -20.2, Math.PI / 2, 0.45, 1.7);
  Q.ambient.push(
    chat("roadA0", "roadA", -3.9, -17.6, 51),
    chat("roadA1", "roadA", -3.2, -18.3, 52),
    watcher("roadA2", -3.9, -19.0, 53, [0, -12]),
    watcher("roadW0", 3.9, -15.2, 54, [2, -28]),
    watcher("roadW1", 3.6, -20.6, 55, [2, -28]),
    watcher("roadW2", 3.9, 15.0, 56, [0, 12]),
    play("roadK0", -3.6, 0.5, 57, [-4.6, -2.5, -2.6, 3.5], false),
    // the fruit seller beside her stall, calling to the people going by and pointing at her fruit
    { id: "roadSeller", x: 4.3, z: 14.1, look: 58, base: "sel_crowdwoman66", sex: "f", behaviour: { kind: "work", clips: ["Talk1", "Point", "Wave", "Talk3"], work: [3, 6], rest: [1, 2.5], face: -Math.PI / 2 } },
  );
}
