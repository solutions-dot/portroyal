/* General 1960s airport detail, built as static batches. No claim of an exact
   surveyed terminal plan. Repeated frames and paving add detail cheaply. */
import * as THREE from "three";
import {
  grp,
  box,
  cyl,
  mesh,
  plane,
  solid,
  std,
  T,
  flat,
  rng,
  cv,
} from "./gfx.js";
import { label, WOOD, METAL, CREAM } from "./props.js";
import { palm } from "./period-props.js";
const glass = solid(0x486f71, 0.4, 0.15),
  trim = solid(0x376456),
  stone = solid(0xb7b7a1),
  rubber = solid(0x282d2a);
export function airportDetail(Q) {
  const g = Q.group,
    r = rng(1966);
  const sheen = cv(128, 128, (x) => {
    const grad = x.createRadialGradient(64, 64, 3, 64, 64, 64);
    grad.addColorStop(0, "rgba(75,104,115,.42)");
    grad.addColorStop(0.7, "rgba(96,124,131,.24)");
    grad.addColorStop(1, "rgba(96,124,131,0)");
    x.fillStyle = grad;
    x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 10; i++) {
      x.fillStyle = "rgba(211,218,203,.11)";
      x.fillRect(20 + i * 7, 27 + i * 5, 45, 2);
    }
  });
  const wet = new THREE.MeshBasicMaterial({
    map: sheen,
    transparent: true,
    depthWrite: false,
  });
  for (let i = 0; i < 20; i++) {
    const puddle = plane(
      3 + r() * 7,
      2 + r() * 3,
      wet,
      -26 + r() * 51,
      0.018,
      -23 + r() * 53,
      g,
    );
    puddle.rotation.x = -Math.PI / 2;
    puddle.rotation.z = r() * 3;
  }
  const sea = plane(
    1500,
    1500,
    std(T.water([85, 85]), 0.35, 0.15),
    0,
    -0.14,
    0,
    g,
  );
  sea.rotation.x = -Math.PI / 2;
  const land = plane(
    600,
    110,
    std(T.grass([70, 12], [129, 141, 105])),
    0,
    -0.04,
    -83,
    g,
  );
  land.rotation.x = -Math.PI / 2;
  // A shaded colonnade, glazed doors, concrete fins and a deep roof overhang.
  box(61, 0.15, 3.2, stone, 0, 0.075, 33.5, g);
  box(63, 0.24, 3.8, CREAM, 0, 3.95, 33.2, g);
  box(63, 0.36, 0.14, trim, 0, 3.76, 31.35, g);
  Q.walls.push([-31, 32.5, 31, 34.1]);
  for (let x = -28; x <= 28; x += 3.5) {
    box(0.18, 3.7, 0.2, CREAM, x, 1.85, 32, g);
    box(2.9, 2.35, 0.055, glass, x + 1.5, 1.75, 34.85, g);
    for (const dx of [0.1, 1.5, 2.9])
      box(0.04, 2.4, 0.06, trim, x + dx, 1.75, 34.8, g);
    box(2.9, 0.04, 0.06, trim, x + 1.5, 1.45, 34.8, g);
    for (let i = 0; i < 4; i++)
      box(2.8, 0.07, 0.12, stone, x + 1.5, 3.05 + i * 0.13, 34.7, g);
  }
  const name = label("PALISADOES", 16, 0.7, "#dfd7bb", "#315c51");
  name.position.set(1, 4.6, 33.7);
  name.rotation.y = Math.PI;
  g.add(name);
  // Control tower glazing, roof rails, instrument aerials and a service door.
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
  box(0.04, 0.6, 0.04, METAL, -31, 15.3, 30, g);
  box(0.04, 0.6, 0.04, METAL, -29, 15.3, 30, g);
  // Service carts with rubber wheels, baggage and hand rails, outside story paths.
  for (const [x, z] of [
    [21, 28],
    [25, 28],
    [-20, 29],
  ]) {
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
      const xx = ((i % 2) - 0.5) * 0.75,
        zz = (Math.floor(i / 2) - 0.5) * 0.4;
      box(
        0.64,
        0.38,
        0.36,
        solid([0x8c6b49, 0x616e62, 0xa88c60, 0x775d46][i]),
        xx,
        0.79,
        zz,
        cart,
      );
      box(0.68, 0.025, 0.02, METAL, xx, 0.9, zz + 0.19, cart);
    }
    Q.walls.push([x - 1.15, z - 0.65, x + 1.15, z + 0.65]);
  }
  // Runway behind the apron. White piano-key markings, centre dashes and edge lights.
  box(500, 0.035, 42, solid(0x737a74), 0, -0.005, -83, g);
  for (let x = -230; x < 230; x += 22)
    box(8, 0.008, 0.25, CREAM, x, 0.018, -83, g);
  for (const x of [-175, 175])
    for (let z = -100; z < -66; z += 2.2)
      box(15, 0.008, 0.8, CREAM, x, 0.02, z, g);
  for (const z of [-104, -62])
    for (let x = -220; x <= 220; x += 22) {
      cyl(0.07, 0.09, 0.2, solid(0x888673), x, 0.1, z, g, 6);
      mesh(
        new THREE.SphereGeometry(0.07, 6, 4),
        solid(0xf0d69a),
        x,
        0.23,
        z,
        g,
      );
    }
  // Taxi and parking guides lie flush with the apron, clear of the player.
  for (let x = -70; x < 24; x += 8)
    box(5, 0.008, 0.14, solid(0xd5b44e), x, 0.025, -32, g);
  // the stop bar under the nose wheels (the aircraft stands nose west)
  box(0.18, 0.008, 3, solid(0xd5b44e), -17.4, 0.03, -32, g);
  // Tropical borders, low planters and a coastal skyline.
  for (const [x, z] of [
    [32, 25],
    [36, 19],
    [-22, 30],
    [30, 31],
  ]) {
    const tub = grp(g, x, 0, z);
    cyl(0.9, 0.65, 0.65, stone, 0, 0.325, 0, tub, 12);
    cyl(0.79, 0.79, 0.02, solid(0x685e41), 0, 0.64, 0, tub, 12);
    const tree = palm(5.8, Math.round(x * z));
    tree.position.y = 0.64;
    tub.add(tree);
    Q.walls.push([x - 1, z - 1, x + 1, z + 1]);
  }
  for (let i = 0; i < 12; i++) {
    const mountain = mesh(
      new THREE.SphereGeometry(1, 14, 8),
      flat([0x748777, 0x829488, 0x94a396][i % 3]),
      -240 + i * 28,
      -3,
      160 + (i % 4) * 15,
      g,
    );
    mountain.scale.set(37, 15 + (i % 4) * 9, 28);
  }
  for (let i = 0; i < 8; i++) {
    const tree = palm(6.5, i + 91);
    tree.position.set(-54 + i * 16, 0, 51 + (i % 3) * 3);
    g.add(tree);
  }
  // Period roof spectators are animated by a separate ambient system at roof height.
  Q.roofAmbient = [];
  for (let i = 0; i < 20; i++)
    Q.roofAmbient.push({
      id: "roof" + i,
      x: -24 + i * 2.45,
      z: 36.3 + (i % 2) * 1.2,
      ground: 4.42,
      look: i + 100,
      rastafari: true,
      behaviour: {
        kind: "watch",
        at: [4, -28],
        react: ["Wave", "Clap", "Point"],
        every: [2, 4],
      },
    });
  /* The welcome on the apron: a loose crowd, not rows. Points are thrown at random (a fixed seed) and kept only when at least 0.8 m from
     everyone already placed, so nobody stands inside anyone and no line of copies forms. They keep clear of the wing and the turning
     propellers (x -11 to 0.6), the boarding steps and a space at their foot where Mortimo Planno stands. Denser near the steps. */
  Q.arrivalAmbient = [];
  let seed = 6604;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const clear = (x, z) =>
    !(x > -11 && x < 0.6) &&
    !(x > 3.1 && x < 5.5 && z < -25.3) &&
    Math.hypot(x - 2.75, z + 26.0) > 1.3 &&
    !Q.arrivalAmbient.some((p) => Math.hypot(p.x - x, p.z - z) < 0.8);
  for (let tries = 0, count = 0; tries < 6000 && count < 132; tries++) {
    const near = rnd() < 0.45,
      x = near ? 0.8 + rnd() * 13 : -24 + rnd() * 40,
      z = -25.6 + rnd() * (near ? 7.5 : 6.5);
    if (!clear(x, z)) continue;
    Q.arrivalAmbient.push({
      id: "welcome" + count,
      x,
      z,
      look: count + 301,
      behaviour: {
        kind: "watch",
        at: [4.3, -29.3],
        react: ["Wave", "Clap", "Cheer", "Point"],
        every: [2.2, 4.4],
      },
    });
    count++;
  }
  Q.policeAmbient = [];
  for (let i = 0; i < 8; i++)
    Q.policeAmbient.push({
      id: "police" + i,
      x: i < 4 ? -21 + i * 6 : [1.6, 6.6, 18, 23][i - 4],
      z: i < 4 ? -12.9 : i < 6 ? -26.2 : -24.8, // the front line stands clear of the wing's sweep (z -13.5)
      base: "sel_police66",
      police: true,
      behaviour: { kind: "watch", at: [0, -9], every: [3, 5] },
    });
}
