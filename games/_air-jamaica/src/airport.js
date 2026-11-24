/* The Palisadoes airport of 1969: the terminal that opened in July 1961, its control tower, the apron, the runway beyond, the sea and the
   Blue Mountains behind. Adapted from games/selassie/src/airport-detail.js (the same terminal, three years earlier): the terminal, the
   doors, the tower, the runway, the markings, the planters. Selassie's welcome crowd, roof spectators and police are not part of it.
   Move to engine/ when a third game needs it (owner rule 10, docs/ENGINE.md). What is a general picture: docs/games/air-jamaica.md ("Places").
   Layout (the player's side is +z): the terminal along z 31 to 39, the tower at x -30, the apron from z 30 down to the plane, the runway
   at z -83, the sea beyond it. */
import * as THREE from "three";
import { terminalDoors, serviceDoor } from "./terminal-doors.js";
import { createSea } from "../../../engine/sea.js";
import { grp, box, cyl, mesh, plane, solid, std, T, flat, rng, cv } from "./gfx.js";
import { palm } from "./period-props.js";
import * as P from "./props.js";
const glass = solid(0x486f71, 0.4, 0.15),
  trim = solid(0x376456),
  stone = solid(0xb7b7a1),
  rubber = solid(0x282d2a),
  CREAM = P.CREAM,
  METAL = P.METAL;
export function airport(Q) {
  const g = Q.group;
  const sea = createSea(g, { kind: "caribbean", y: -0.14, at: [0, 0], size: 300, far: 3000, farDrop: 0.15, swell: 0.5 }).near;
  Q.tickers.push((t) => sea?.tick?.(t));
  const land = plane(600, 110, std(T.grass([70, 12], [129, 141, 105])), 0, -0.04, -83, g);
  land.rotation.x = -Math.PI / 2;
  /* the terminal: a shaded colonnade, glazed bays, three pairs of glass doors, concrete fins and a deep roof overhang */
  box(61, 0.15, 3.2, stone, 0, 0.075, 33.5, g);
  box(63, 0.24, 3.8, CREAM, 0, 3.95, 33.2, g);
  box(63, 0.36, 0.14, trim, 0, 3.76, 31.35, g);
  box(62, 4.2, 8, solid(0xd9d0af), 0, 2.1, 38, g);
  box(65, 0.22, 10, solid(0xe4ddc7), 0, 4.3, 38, g);
  Q.walls.push([-31, 31.5, 31, 40]);
  for (let x = -28; x <= 28; x += 3.5) {
    const doorBay = x === -14 || x === 0 || x === 14;
    box(0.18, 3.7, 0.2, CREAM, x, 1.85, 32, g);
    box(2.9, 2.35, 0.055, glass, x + 1.5, 1.75, 34.85, g);
    for (const dx of doorBay ? [0.1, 2.9] : [0.1, 1.5, 2.9]) box(0.04, 2.4, 0.06, trim, x + dx, 1.75, 34.8, g);
    if (doorBay) {
      const d = terminalDoors({ w: 1.9, h: 2.4 });
      d.position.set(x + 1.5, 0.15, 34.82);
      d.rotation.y = Math.PI;
      g.add(d);
    } else box(2.9, 0.04, 0.06, trim, x + 1.5, 1.45, 34.8, g);
    for (let i = 0; i < 4; i++) box(2.8, 0.07, 0.12, stone, x + 1.5, 3.05 + i * 0.13, 34.7, g);
  }
  const name = P.label("PALISADOES", 16, 0.7, "#dfd7bb", "#315c51");
  name.position.set(1, 4.6, 33.7);
  name.rotation.y = Math.PI;
  g.add(name);
  /* the control tower: a glazed cab on a square shaft, rails, aerials and a steel service door facing the apron */
  box(5, 11, 5, solid(0xd5d0b9), -30, 5.5, 30, g);
  box(7, 1.8, 7, solid(0x526a68, 0.5), -30, 11, 30, g);
  box(8, 0.22, 8, CREAM, -30, 12, 30, g);
  Q.walls.push([-32.6, 27.4, -27.4, 32.6]);
  {
    const d = serviceDoor();
    d.position.set(-30, 0, 27.5);
    d.rotation.y = Math.PI;
    g.add(d);
  }
  for (const sx of [-1, 1])
    for (let j = 0; j < 5; j++) {
      box(0.04, 1.65, 0.08, CREAM, -30 + sx * 3.51, 11, 27.2 + j * 1.4, g);
      box(0.08, 1.65, 0.04, CREAM, -32.8 + j * 1.4, 11, 30 + sx * 3.51, g);
    }
  for (let i = 0; i < 7; i++) {
    box(0.05, 0.65, 0.05, METAL, -33.5 + i * 1.17, 12.4, 26.4, g);
    box(0.05, 0.65, 0.05, METAL, -33.5 + i * 1.17, 12.4, 33.6, g);
  }
  box(7, 0.05, 0.05, METAL, -30, 12.7, 26.4, g);
  box(7, 0.05, 0.05, METAL, -30, 12.7, 33.6, g);
  cyl(0.045, 0.065, 4.7, METAL, -30, 14.4, 30, g, 8);
  box(2, 0.045, 0.045, METAL, -30, 15.3, 30, g);
  /* baggage carts with rubber wheels, bags and hand rails, out of the story's way */
  for (const [x, z] of [[21, 27], [25, 27], [-20, 28]]) {
    const cart = grp(g, x, 0, z);
    box(2, 0.12, 1, trim, 0, 0.55, 0, cart);
    for (const xx of [-0.75, 0.75])
      for (const zz of [-0.4, 0.4]) {
        const w = cyl(0.19, 0.19, 0.1, rubber, xx, 0.19, zz, cart, 10);
        w.rotation.x = Math.PI / 2;
        box(0.045, 0.3, 0.045, METAL, xx, 0.37, zz, cart);
      }
    for (const zz of [-0.5, 0.5]) {
      box(2, 0.04, 0.04, METAL, 0, 1, zz, cart);
      for (const xx of [-1, 1]) box(0.04, 0.45, 0.04, METAL, xx, 0.8, zz, cart);
    }
    for (let i = 0; i < 4; i++) {
      const xx = ((i % 2) - 0.5) * 0.75, zz = (Math.floor(i / 2) - 0.5) * 0.4;
      box(0.64, 0.38, 0.36, solid([0x8c6b49, 0x616e62, 0xa88c60, 0x775d46][i]), xx, 0.79, zz, cart);
      box(0.68, 0.025, 0.02, METAL, xx, 0.9, zz + 0.19, cart);
    }
    Q.walls.push([x - 1.15, z - 0.65, x + 1.15, z + 0.65]);
  }
  /* the runway behind the apron: piano keys, centre dashes and edge lights; the taxi line lies flush with the apron */
  box(500, 0.035, 42, solid(0x737a74), 0, -0.005, -83, g);
  for (let x = -230; x < 230; x += 22) box(8, 0.008, 0.25, CREAM, x, 0.018, -83, g);
  for (const x of [-175, 175]) for (let z = -100; z < -66; z += 2.2) box(15, 0.008, 0.8, CREAM, x, 0.02, z, g);
  for (const z of [-104, -62])
    for (let x = -220; x <= 220; x += 22) {
      cyl(0.07, 0.09, 0.2, solid(0x888673), x, 0.1, z, g, 6);
      mesh(new THREE.SphereGeometry(0.07, 6, 4), solid(0xf0d69a), x, 0.23, z, g);
    }
  for (let x = -70; x < 40; x += 8) box(5, 0.008, 0.14, solid(0xd5b44e), x, 0.025, -22, g);
  /* planters with palms, the hills and a line of palms behind the terminal */
  for (const [x, z] of [[32, 25], [36, 19], [-22, 29], [30, 29]]) {
    const tub = grp(g, x, 0, z);
    cyl(0.9, 0.65, 0.65, stone, 0, 0.325, 0, tub, 12);
    cyl(0.79, 0.79, 0.02, solid(0x685e41), 0, 0.64, 0, tub, 12);
    const tree = palm(5.8, Math.round(x * z));
    tree.position.y = 0.64;
    tub.add(tree);
    Q.walls.push([x - 1, z - 1, x + 1, z + 1]);
  }
  for (let i = 0; i < 12; i++) {
    const m = mesh(new THREE.SphereGeometry(1, 14, 8), flat([0x748777, 0x829488, 0x94a396][i % 3]), -240 + i * 28, -3, 160 + (i % 4) * 15, g);
    m.scale.set(37, 15 + (i % 4) * 9, 28);
  }
  for (let i = 0; i < 8; i++) {
    const tree = palm(6.5, i + 91);
    tree.position.set(-54 + i * 16, 0, 51 + (i % 3) * 3);
    g.add(tree);
  }
}
