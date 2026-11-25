/* Adapted from games/selassie/src/doors.js (the Palisadoes terminal and tower doors, same 1961 terminal). Only terminalDoors and serviceDoor are used here. Move to engine/ when a third game needs them (owner rule 10).
   (owner, 17 November 2026: "the doors should fit their purpose, not one shared one"). Every builder returns a THREE.Group whose origin is the
   middle of the foot of the opening on the wall's outer face, facing +z.
     louvreDoor     a 1950s and 1960s Kingston concrete house: a painted timber door whose top half is glass louvre blades in clips, like the
                    house's own windows, over two flat panels, with a brass knob; on a lit evening house the room's light shows through the blades
     yardBoardDoor  a yard board house: tongue-and-groove boards painted, as they show from outside (ledges inside), butt hinges, a padlocked hasp
     terminalDoors  the terminal: a pair of aluminium-framed glass doors with push bars and kick plates, under a glass transom
     serviceDoor    the control tower: a painted steel door with a vent low down and a lever handle
   What each is modelled on, and what is still a stand-in, is in docs/games/selassie.md ("Doors"). */
import * as THREE from "three";

const MATS = new Map();
const mat = (name, color, rough = 0.85, metal = 0, emissive = 0) => {
  const k = name + color + rough + metal + emissive;
  if (!MATS.has(k)) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, emissive, emissiveIntensity: emissive ? 1 : 0 });
    m.name = name;
    MATS.set(k, m);
  }
  return MATS.get(k);
};
const B = (g, m, w, h, d, x, y, z) => {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  o.castShadow = o.receiveShadow = true;
  g.add(o);
  return o;
};
const tone = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();
const BRASS = () => mat("DoorMetal", 0xb08a40, 0.35, 0.8);
function frame(g, w, h, col, fw = 0.08, out = 0.045) {
  const m = mat("DoorFrame", col, 0.8);
  for (const s of [-1, 1]) B(g, m, fw, h + fw, out, s * (w / 2 + fw / 2), (h + fw) / 2, out / 2);
  B(g, m, w + 2 * fw + 0.04, fw + 0.01, out + 0.01, 0, h + fw / 2, (out + 0.01) / 2);
}
function knob(g, x, y, z, m = BRASS()) {
  B(g, m, 0.05, 0.13, 0.008, x, y - 0.02, z + 0.004);
  const k = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), m);
  k.position.set(x, y, z + 0.055);
  g.add(k);
  B(g, m, 0.014, 0.014, 0.05, x, y, z + 0.028);
  B(g, mat("DoorFrame", 0x141210, 1), 0.012, 0.022, 0.004, x, y - 0.06, z + 0.01);
}

export function louvreDoor({ w = 0.95, h = 2.05, color = 0x6a3e26, frameCol = 0xf0ece2, lit = false } = {}) {
  const g = new THREE.Group(),
    y0 = 0.03,
    st = 0.1,
    lf = mat("Door", color, 0.55),
    sh = mat("Door", tone(color, 0.6), 0.7),
    gy = y0 + (h - y0) * 0.5;
  g.name = "Door";
  frame(g, w, h, frameCol);
  B(g, mat("DoorFrame", frameCol, 0.9), w + 0.06, 0.03, 0.1, 0, 0.015, 0.02);
  // stiles and rails, and the two flat panels below the lock rail
  for (const s of [-1, 1]) B(g, lf, st, h - y0, 0.045, s * (w / 2 - st / 2), (y0 + h) / 2, 0.0225);
  for (const [y, t] of [[y0 + 0.1, 0.2], [gy, 0.14], [h - 0.06, 0.12]]) B(g, lf, w - 2 * st, t, 0.045, 0, y, 0.0225);
  const pw = w - 2 * st;
  for (const [a, b] of [[y0 + 0.2, y0 + 0.62], [y0 + 0.68, gy - 0.07]]) {
    B(g, sh, pw, b - a, 0.03, 0, (a + b) / 2, 0.015);
    B(g, lf, pw - 0.05, b - a - 0.05, 0.035, 0, (a + b) / 2, 0.02);
  }
  // the glass louvre blades in their aluminium clips; behind them the room (dark, or lamplit)
  const top = h - 0.12,
    bot = gy + 0.07,
    n = Math.round((top - bot) / 0.1);
  B(g, lit ? mat("DoorGlass", 0xf4c77a, 1, 0, 0xf4c77a) : mat("DoorGlass", 0x1a2024, 0.6), pw, top - bot, 0.01, 0, (top + bot) / 2, 0.005);
  for (let i = 0; i < n; i++) {
    const y = bot + (i + 0.5) * ((top - bot) / n),
      b = B(g, mat("DoorGlass", 0xa8c0c4, 0.15, 0.2), pw - 0.02, 0.095, 0.006, 0, y, 0.03);
    b.rotation.x = -0.45;
    for (const s of [-1, 1]) B(g, mat("DoorMetal", 0xb8bcbc, 0.4, 0.8), 0.02, 0.06, 0.02, s * (pw / 2 - 0.01), y, 0.03);
  }
  knob(g, w / 2 - 0.07, gy, 0.045);
  for (const y of [y0 + 0.25, h - 0.25]) B(g, BRASS(), 0.02, 0.09, 0.006, -w / 2 + 0.008, y, 0.047);
  return g;
}

export function yardBoardDoor({ w = 0.9, h = 1.95, color = 0x4f6e4e, frameCol = 0xe8e0cc } = {}) {
  const g = new THREE.Group(),
    y0 = 0.03,
    n = 6,
    bw = w / n;
  g.name = "Door";
  frame(g, w, h, frameCol, 0.08, 0.04);
  B(g, mat("DoorFrame", tone(frameCol, 0.85), 0.9), w + 0.06, 0.03, 0.1, 0, 0.015, 0.02);
  B(g, mat("Door", tone(color, 0.3), 1), w, h - y0, 0.01, 0, (y0 + h) / 2, 0.005);
  const ms = [mat("Door", color, 0.8), mat("Door", tone(color, 0.9), 0.8), mat("Door", tone(color, 1.07), 0.8)];
  for (let i = 0; i < n; i++) B(g, ms[i % 3], bw - 0.012, h - y0 - 0.01, 0.03, -w / 2 + bw * (i + 0.5), (y0 + h) / 2, 0.025);
  // butt hinges on the hinge side, a hasp and staple with a padlock, a little wooden pull
  const iron = mat("DoorMetal", 0x2a2b2c, 0.55, 0.5);
  for (const y of [y0 + 0.25, h - 0.25]) B(g, iron, 0.03, 0.1, 0.008, -w / 2 + 0.01, y, 0.044);
  B(g, iron, 0.16, 0.035, 0.01, w / 2 - 0.12, y0 + 1.0, 0.045);
  B(g, iron, 0.03, 0.05, 0.03, w / 2 + 0.0, y0 + 1.0, 0.03);
  B(g, mat("DoorMetal", 0x6a6a64, 0.4, 0.8), 0.05, 0.055, 0.022, w / 2 + 0.0, y0 + 0.94, 0.05);
  B(g, mat("Door", tone(color, 0.6), 0.8), 0.05, 0.12, 0.04, w / 2 - 0.1, y0 + 0.8, 0.06);
  return g;
}

export function terminalDoors({ w = 1.9, h = 2.4, frameCol = 0xb8bcb8, glass = 0x3a4a52 } = {}) {
  const g = new THREE.Group(),
    al = mat("DoorMetal", frameCol, 0.35, 0.8),
    gl = mat("DoorGlass", glass, 0.1, 0.3),
    y0 = 0.02,
    dh = 2.1,
    lw = w / 2 - 0.01;
  g.name = "Door";
  // the outer aluminium frame, and a glass transom above the doors
  for (const s of [-1, 1]) B(g, al, 0.07, h, 0.08, s * (w / 2 + 0.035), h / 2, 0.04);
  B(g, al, w + 0.14, 0.07, 0.08, 0, h + 0.035, 0.04);
  B(g, al, w, 0.06, 0.08, 0, dh + 0.03, 0.04);
  B(g, gl, w, h - dh - 0.06, 0.01, 0, (dh + 0.06 + h) / 2, 0.03);
  for (const s of [-1, 1]) {
    const cx = s * (lw / 2 + 0.01);
    // narrow stiles, a top rail, a deep bottom rail with a kick plate, full glass between
    for (const x of [cx - lw / 2 + 0.03, cx + lw / 2 - 0.03]) B(g, al, 0.06, dh - y0, 0.045, x, (y0 + dh) / 2, 0.035);
    B(g, al, lw, 0.06, 0.045, cx, dh - 0.03, 0.035);
    B(g, al, lw, 0.2, 0.045, cx, y0 + 0.1, 0.035);
    B(g, mat("DoorMetal", 0x9a9a92, 0.25, 0.9), lw - 0.08, 0.16, 0.004, cx, y0 + 0.1, 0.06);
    B(g, gl, lw - 0.1, dh - y0 - 0.26, 0.01, cx, (y0 + 0.2 + dh - 0.06) / 2, 0.03);
    // a push bar across the glass on stand-offs
    B(g, al, lw - 0.16, 0.035, 0.035, cx, 1.05, 0.1);
    for (const x of [cx - lw / 2 + 0.1, cx + lw / 2 - 0.1]) B(g, al, 0.025, 0.025, 0.07, x, 1.05, 0.065);
  }
  B(g, mat("DoorFrame", 0x8a8a84, 0.6), w + 0.1, 0.02, 0.14, 0, 0.01, 0.06);
  return g;
}

export function serviceDoor({ w = 0.9, h = 2.05, color = 0x5f6f6a, frameCol = 0x9a9e98, step = 0.15 } = {}) {
  const g = new THREE.Group(),
    lf = mat("Door", color, 0.45, 0.4),
    y0 = step;
  g.name = "Door";
  B(g, mat("DoorFrame", 0xc8c2ae, 0.95), w + 0.5, step, 0.4, 0, step / 2, 0.18);
  frame(g, w, h, frameCol, 0.06, 0.04);
  B(g, lf, w - 0.01, h - y0, 0.045, 0, (y0 + h) / 2, 0.0225);
  B(g, mat("Door", tone(color, 0.7), 0.5, 0.4), w - 0.1, h - y0 - 0.1, 0.004, 0, (y0 + h) / 2, 0.046);
  B(g, lf, w - 0.12, h - y0 - 0.12, 0.004, 0, (y0 + h) / 2, 0.048);
  // a vent of pressed slats low in the door
  const vy = y0 + 0.28;
  B(g, mat("Door", 0x1a1c1c, 1), 0.42, 0.24, 0.004, 0, vy, 0.05);
  for (let i = 0; i < 5; i++) {
    const s = B(g, lf, 0.4, 0.035, 0.01, 0, vy - 0.09 + i * 0.045, 0.054);
    s.rotation.x = -0.6;
  }
  const m = mat("DoorMetal", 0xa8a8a0, 0.35, 0.8);
  B(g, m, 0.045, 0.2, 0.008, w / 2 - 0.09, y0 + 0.97, 0.05);
  B(g, m, 0.13, 0.02, 0.02, w / 2 - 0.145, y0 + 1.0, 0.075);
  B(g, m, 0.012, 0.012, 0.04, w / 2 - 0.09, y0 + 1.0, 0.065);
  for (const y of [y0 + 0.25, h - 0.25]) B(g, m, 0.02, 0.1, 0.01, -w / 2 + 0.006, y, 0.05);
  return g;
}
