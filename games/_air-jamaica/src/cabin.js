/* The cabin of a single-aisle Air Jamaica jet in the 2000s, for chapter 3, "The flying chef" (docs/games/air-jamaica.md, "Scene B").
   WHAT IS A GENERAL PICTURE: the sources say the flying chef flew on the airline's flights and cooked Jamaican food on board (JIS, 21 March 2004), but
   no photograph of the cabin of those years has been looked at. The cabin follows the common layout of a single-aisle jet of the time (an Airbus A320
   is 3.7 m wide inside, with three seats each side of one aisle); the seat cloth, the panels and the galley are general, and the aisle is a little
   wider than a real one so the player can pass. Do not call it a copy of Air Jamaica's own cabin.
   Local axes: the nose is toward -z, the floor is y = 0, the aisle runs along x = 0. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv } from "./gfx.js";

export const CABIN = {
  half: 1.85, // the side walls (the cabin is 3.7 m wide)
  aisle: 0.46, // half the aisle's width
  rows: [-2.4, -1.6, -0.8, 0.0, 0.8, 1.6], // each row's seat cushion centre, along z
  seatX: [0.69, 1.15, 1.61], // the three seats of a side, from the aisle out
  seatTop: 0.48,
  front: -4.7, // the front wall of the galley
  back: 2.95, // the curtain at the back
  trolley: { x: 0, z: -4.05 },
  counter: { z0: -4.7, z1: -4.28, top: 1.0 },
};
const M = {
  seat: solid(0x2b4a8c, 0.9),
  seatDark: solid(0x1e3566, 0.9),
  head: solid(0xe9e6dc, 0.9),
  wall: solid(0xdedcd4, 0.8),
  ceiling: solid(0xeceae2, 0.8),
  bin: solid(0xd6d4cc, 0.75),
  floor: solid(0x56607a, 0.95),
  metal: solid(0xb8bcbc, 0.35, 0.7),
  steel: solid(0xc9cdcf, 0.25, 0.85),
  dark: solid(0x2a2d30, 0.7),
  tray: solid(0x9a9c98, 0.7),
  cloth: solid(0xf4f2ec, 0.9),
  plate: solid(0xf7f7f2, 0.4),
  curtain: solid(0x2f4f8f, 0.95),
};
/* the sky outside each window: bright blue going pale at the bottom, with a few clouds below */
function skyTexture() {
  return cv(128, 192, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#5f9fdc");
    g.addColorStop(0.55, "#a9cdee");
    g.addColorStop(0.75, "#f4f6f8");
    g.addColorStop(1, "#dfe8ef");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    x.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(10 + i * 24, 150 + (i % 2) * 10, 22, 8, 0, 0, 7); x.fill(); }
  });
}
/* one seat: a cushion, a back with a pale head cover, arms between, and a fold-down tray on the back */
function seat(g, x, z, trayDown = false) {
  const s = grp(g, x, 0, z);
  box(0.44, 0.12, 0.46, M.seat, 0, CABIN.seatTop - 0.06, 0, s);
  const back = box(0.44, 0.74, 0.1, M.seat, 0, 0.84, 0.25, s);
  back.rotation.x = -0.12;
  const hc = box(0.4, 0.2, 0.012, M.head, 0, 1.08, 0.18, s);
  hc.rotation.x = -0.12;
  box(0.36, 0.42, 0.11, M.seatDark, 0, 0.21, 0.02, s);
  if (trayDown) box(0.38, 0.02, 0.3, M.tray, 0, 0.7, 0.45, s); /* the tray, down, for the passenger behind */
  else { const t = box(0.34, 0.26, 0.02, M.tray, 0, 0.9, 0.31, s); t.rotation.x = -0.12; }
  return s;
}
/* a plate of food: a white plate and the dish on it, made of small soft pieces in the dish's colours */
function dish(kind) {
  const d = grp();
  mesh(new THREE.CylinderGeometry(0.068, 0.058, 0.012, 24), M.plate, 0, 0.006, 0, d);
  const piece = (c, r, x, z, sy = 0.5, y = 0.016) => { const m = mesh(new THREE.SphereGeometry(r, 10, 7), solid(c, 0.75), x, y, z, d); m.scale.y = sy; return m; };
  const R = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  if (kind === "ackee") { /* ackee and saltfish: soft yellow ackee, pale flakes of fish, a few red and green peppers */
    for (let i = 0; i < 9; i++) piece(0xf0c63a, 0.016, (R(i) - 0.5) * 0.07, (R(i + 9) - 0.5) * 0.07, 0.6);
    for (let i = 0; i < 6; i++) piece(0xece2c8, 0.012, (R(i + 20) - 0.5) * 0.08, (R(i + 30) - 0.5) * 0.08, 0.5);
    for (let i = 0; i < 3; i++) piece(i ? 0x3f8a2e : 0xc8322a, 0.007, (R(i + 40) - 0.5) * 0.06, (R(i + 50) - 0.5) * 0.06, 0.6, 0.024);
  } else if (kind === "calaloo") { /* calaloo and saltfish: dark green leaves with flakes of fish */
    for (let i = 0; i < 10; i++) piece(0x2f6a2a, 0.017, (R(i + 3) - 0.5) * 0.08, (R(i + 13) - 0.5) * 0.08, 0.4);
    for (let i = 0; i < 4; i++) piece(0xe8dcc0, 0.011, (R(i + 23) - 0.5) * 0.06, (R(i + 33) - 0.5) * 0.06, 0.5, 0.022);
  } else if (kind === "rundung") { /* run dung: fish cooked down in a creamy coconut sauce */
    const s = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.008, 20), solid(0xe8d6a8, 0.6), 0, 0.016, 0, d); void s;
    for (let i = 0; i < 3; i++) piece(0xd9b98a, 0.02, (i - 1) * 0.03, 0.005, 0.45, 0.022);
    for (let i = 0; i < 4; i++) piece(0xd8452e, 0.006, (R(i + 60) - 0.5) * 0.06, (R(i + 70) - 0.5) * 0.06, 0.6, 0.026);
  } else if (kind === "festival") { /* festival: sweet fried dumplings, long and golden */
    for (let i = 0; i < 3; i++) { const f = piece(0xd49a3c, 0.016, (i - 1) * 0.032, 0, 0.7, 0.02); f.scale.z = 2.4; f.scale.x = 0.9; f.rotation.y = 0.2 * (i - 1); }
  } else if (kind === "jerk") { /* jerk chicken: dark, spiced pieces */
    for (let i = 0; i < 5; i++) { const p = piece(0x5a2e18, 0.019, (R(i + 80) - 0.5) * 0.07, (R(i + 90) - 0.5) * 0.07, 0.6, 0.02); p.scale.x = 1.3; }
    for (let i = 0; i < 4; i++) piece(0x8a3a1c, 0.008, (R(i + 100) - 0.5) * 0.08, (R(i + 110) - 0.5) * 0.08, 0.6, 0.03);
  }
  return d;
}
/* a silver dome that covers a plate */
function cloche() {
  const c = grp();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.074, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.steel);
  dome.material.side = THREE.DoubleSide;
  c.add(dome);
  mesh(new THREE.SphereGeometry(0.012, 8, 6), M.steel, 0, 0.078, 0, c);
  return c;
}
export const DISHES = ["ackee", "calaloo", "rundung", "festival", "jerk"];
export function buildCabin() {
  const g = grp();
  const H = CABIN.half, L = CABIN.front, B = CABIN.back + 0.05, len = B - L, mid = (B + L) / 2;
  box(H * 2, 0.04, len, M.floor, 0, -0.02, mid, g);
  /* the side walls: a lower panel, the window belt, and the curve up to the bins */
  const sky = new THREE.MeshBasicMaterial({ map: skyTexture() });
  sky.userData.noGlow = true;
  for (const s of [-1, 1]) {
    box(0.06, 2.18, len, M.wall, s * H, 1.09, mid, g);
    for (const z of CABIN.rows) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.32), sky);
      w.position.set(s * (H - 0.032), 1.06, z + 0.2);
      w.rotation.y = -s * Math.PI / 2;
      g.add(w);
      const fr = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.16, 24), M.bin);
      fr.scale.y = 1.35;
      fr.position.set(s * (H - 0.034), 1.06, z + 0.2);
      fr.rotation.y = -s * Math.PI / 2;
      g.add(fr);
      box(0.012, 0.1, 0.24, M.bin, s * (H - 0.04), 1.26, z + 0.2, g); /* the blind, pushed up */
    }
    /* the overhead bins: a deep box over the seats with a curved door; a reading-light strip under them */
    box(0.82, 0.42, len - 1.6, M.bin, s * (H - 0.41), 1.83, mid + 0.4, g);
    box(0.5, 0.05, len - 1.6, M.dark, s * (H - 0.62), 1.6, mid + 0.4, g);
    for (const z of CABIN.rows) { box(0.04, 0.02, 0.02, solid(0xfff3c8, 0.5), s * 1.0, 1.575, z, g); }
  }
  box(H * 2, 0.06, len, M.ceiling, 0, 2.18, mid, g);
  /* the seats: six rows, three each side; the tray is down in front of Mr Clarke (row 2, aisle seat on the right), for his plate */
  for (const [r, z] of CABIN.rows.entries())
    for (const s of [-1, 1]) for (const x of CABIN.seatX) seat(g, s * x, z, r === 0 && s === 1 && x === CABIN.seatX[0]);
  /* the front: a bulkhead wall with the galley, a counter and lockers, ovens; the trolley stands in front of it */
  box(H * 2, 2.2, 0.06, M.wall, 0, 1.1, L, g);
  const C = CABIN.counter;
  box(3.2, C.top, C.z1 - C.z0, M.bin, 0, C.top / 2, (C.z0 + C.z1) / 2, g);
  box(3.2, 0.03, C.z1 - C.z0 + 0.02, M.steel, 0, C.top + 0.015, (C.z0 + C.z1) / 2, g);
  box(3.2, 0.6, 0.34, M.bin, 0, 1.75, C.z0 + 0.17, g);
  for (let i = 0; i < 6; i++) { box(0.48, 0.5, 0.01, solid(0xc9c7bf, 0.7), -1.25 + i * 0.5, 1.75, C.z0 + 0.345, g); box(0.1, 0.02, 0.02, M.metal, -1.25 + i * 0.5, 1.6, C.z0 + 0.36, g); }
  for (let i = 0; i < 6; i++) box(0.48, 0.84, 0.01, solid(0xcfcdc5, 0.7), -1.25 + i * 0.5, 0.45, C.z1 + 0.006, g);
  /* a seat row's screen wall behind the galley: a low partition each side, so the galley is its own little room at the front */
  for (const s of [-1, 1]) box(1.3, 1.6, 0.06, M.wall, s * (CABIN.aisle + 0.75), 0.8, -2.98, g);
  /* the back: a curtain across the cabin */
  const ct = box(H * 2, 2.12, 0.03, M.curtain, 0, 1.06, CABIN.back, g);
  void ct;
  /* the chef's trolley: a steel cart with a white cloth on top, the five dishes of the menu, each under a silver dome */
  const T = CABIN.trolley, cart = grp(g, T.x, 0, T.z);
  box(0.82, 0.96, 0.32, M.steel, 0, 0.5, 0, cart);
  box(0.84, 0.02, 0.34, M.cloth, 0, 0.99, 0, cart);
  box(0.84, 0.12, 0.012, M.cloth, 0, 0.93, 0.172, cart); /* the cloth hangs a little over the front */
  for (const x of [-0.36, 0.36]) for (const z of [-0.12, 0.12]) cyl(0.025, 0.025, 0.02, M.dark, x, 0.012, z, cart, 10);
  box(0.06, 0.03, 0.03, M.metal, 0.44, 0.92, 0, cart); /* the handle */
  const plates = {}, lids = {};
  DISHES.forEach((k, i) => {
    const x = -0.32 + i * 0.16;
    const p = dish(k);
    p.position.set(T.x + x, 1.0, T.z);
    g.add(p);
    plates[k] = p;
    const c = cloche();
    c.position.set(T.x + x, 1.012, T.z);
    g.add(c);
    lids[k] = c;
  });
  g.userData.parts = { plates, lids };
  /* soft light from the reading lights and the ceiling */
  const lamp = new THREE.PointLight(0xfff0d8, 0.8, 7, 1.6);
  lamp.position.set(0, 2.0, -3.6);
  g.add(lamp);
  return g;
}
/* where each lid goes when it is lifted: off the plate, up, and set down in a row on the galley counter behind */
export function lidPlace(i, k) {
  const T = CABIN.trolley, C = CABIN.counter;
  const x0 = T.x - 0.32 + i * 0.16, y0 = 1.012, z0 = T.z;
  const x1 = -0.62 + i * 0.31, y1 = C.top + 0.03, z1 = (C.z0 + C.z1) / 2;
  const t = Math.max(0, Math.min(1, k * 1.25 - i * 0.06));
  const e = t * t * (3 - 2 * t);
  return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e + Math.sin(e * Math.PI) * 0.22, z0 + (z1 - z0) * e];
}
