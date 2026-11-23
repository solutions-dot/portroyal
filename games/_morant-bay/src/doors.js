/* games/windrush/src/doors.js: the doors of Windrush, each made for its own building, place and year (owner, 17 November 2026: "the doors should
   fit their purpose, not one shared one"). Every builder returns a THREE.Group whose origin is the middle of the foot of the opening on the wall's
   outer face, facing +z.
     fretDoor       a Jamaican board house on posts (1948, 1962): a painted door of upright boards under a fretwork vent board, butt hinges, a latch
     shopDoors      the district shop: a pair of wide board doors with an iron drop bar standing in its keeper, and a hasp for the padlock at night
     terraceDoor    a Victorian London terrace (1948 to 2018): a painted four-panel door with a brass letter plate in the lock rail, a knocker on the
                    middle muntin, a knob and a night latch, under a glass fanlight; set back in its door hole behind plain linings
     upvcDoor       a 2018 replacement front door in the same terrace: white uPVC with a frosted glass top, a chrome lever and letter plate
     shedDoors      a Kingston transit shed (1948): sliding doors of corrugated iron on a steel frame, hung from a track over the opening
   What each is modelled on, and what is still a stand-in, is in docs/games/windrush.md ("Doors"). */
import * as THREE from "three";

const MATS = new Map();
const mat = (name, color, rough = 0.85, metal = 0) => {
  const k = name + color + rough + metal;
  if (!MATS.has(k)) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
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
const BRASS = () => mat("DoorMetal", 0xc09a48, 0.3, 0.85),
  IRON = () => mat("DoorMetal", 0x26272a, 0.55, 0.5),
  DARK = () => mat("DoorFrame", 0x121110, 1);
function boards(g, x0, x1, y0, y1, z, col, n) {
  const bw = (x1 - x0) / n,
    ms = [mat("Door", col), mat("Door", tone(col, 0.88)), mat("Door", tone(col, 1.08))];
  B(g, mat("Door", tone(col, 0.3), 1), x1 - x0, y1 - y0, 0.01, (x0 + x1) / 2, (y0 + y1) / 2, z - 0.026);
  for (let i = 0; i < n; i++) B(g, ms[i % 3], bw - 0.011, y1 - y0, 0.028, x0 + bw * (i + 0.5), (y0 + y1) / 2, z - 0.014);
}
function casing(g, w, h, col, fw = 0.08, out = 0.04) {
  const m = mat("DoorFrame", col, 0.85);
  for (const s of [-1, 1]) B(g, m, fw, h + fw, out, s * (w / 2 + fw / 2), (h + fw) / 2, out / 2);
  B(g, m, w + 2 * fw + 0.04, fw, out + 0.01, 0, h + fw / 2, (out + 0.01) / 2);
}

export function fretDoor({ w = 0.95, h = 2.0, color = 0x5a3a26, trim = 0xe8e0cc } = {}) {
  const g = new THREE.Group(),
    y0 = 0.03,
    dh = h - 0.34;
  g.name = "Door";
  casing(g, w, h, trim);
  B(g, mat("DoorFrame", tone(trim, 0.8), 0.9), w + 0.06, 0.03, 0.1, 0, 0.015, 0.02);
  boards(g, -w / 2, w / 2, y0, dh, 0.03, color, 6);
  // the fretwork vent over the door: a painted board cut through with a row of crosses and holes, dark behind
  const fm = mat("DoorFrame", trim, 0.85);
  B(g, DARK(), w, h - dh - 0.04, 0.01, 0, (dh + h) / 2, 0.005);
  B(g, fm, w, 0.04, 0.03, 0, dh + 0.02, 0.02);
  for (const y of [h - 0.03]) B(g, fm, w, 0.04, 0.03, 0, y, 0.02);
  const n = 6,
    cw = w / n;
  for (let i = 0; i < n; i++) {
    const cx = -w / 2 + cw * (i + 0.5),
      cy = (dh + h) / 2;
    for (const s of [-1, 1]) B(g, fm, 0.025, h - dh - 0.08, 0.025, cx + s * (cw / 2 - 0.0125), cy, 0.02);
    const a = B(g, fm, 0.025, 0.22, 0.02, cx, cy, 0.022);
    a.rotation.z = 0.75;
    const b = B(g, fm, 0.025, 0.22, 0.02, cx, cy, 0.022);
    b.rotation.z = -0.75;
  }
  B(g, mat("Door", tone(color, 0.8)), w - 0.04, 0.05, 0.02, 0, dh - 0.03, 0.04);
  for (const y of [y0 + 0.25, dh - 0.25]) B(g, IRON(), 0.03, 0.1, 0.008, -w / 2 + 0.012, y, 0.034);
  // a thumb latch: a bar on a keeper and a handle below
  B(g, IRON(), 0.18, 0.025, 0.012, w / 2 - 0.12, y0 + 1.0, 0.038);
  B(g, IRON(), 0.03, 0.05, 0.03, w / 2 - 0.04, y0 + 1.0, 0.04);
  B(g, IRON(), 0.025, 0.16, 0.025, w / 2 - 0.16, y0 + 0.9, 0.05);
  return g;
}

export function shopDoors({ w = 1.3, h = 2.0, color = 0x2f4a5a, trim = 0xe8dcb4 } = {}) {
  const g = new THREE.Group(),
    y0 = 0.03,
    lw = w / 2 - 0.004;
  g.name = "Door";
  casing(g, w, h, trim, 0.09, 0.045);
  B(g, mat("DoorFrame", tone(trim, 0.7), 0.9), w + 0.06, 0.03, 0.1, 0, 0.015, 0.02);
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -w / 2 : 0.004;
    boards(g, x0, x0 + lw, y0, h - 0.005, 0.03, color, 4);
    for (const y of [y0 + 0.2, h - 0.25]) B(g, IRON(), lw * 0.6, 0.04, 0.008, s * (w / 2 - lw * 0.3 - 0.01), y, 0.034);
  }
  // the drop bar's keepers on both leaves; the bar itself stands on end against the wall by the door, the shop being open
  for (const x of [-0.25, 0.25]) B(g, IRON(), 0.06, 0.12, 0.08, x, y0 + 1.05, 0.06);
  const bar = B(g, mat("Door", 0x6a5038, 0.9), 0.08, 1.4, 0.06, w / 2 + 0.2, 0.7, 0.05);
  bar.rotation.z = -0.06;
  B(g, IRON(), 0.14, 0.035, 0.012, 0.06, y0 + 1.3, 0.036);
  B(g, IRON(), 0.03, 0.05, 0.03, -0.03, y0 + 1.3, 0.045);
  return g;
}

/* the hole is `hw` wide and `hh` high above the origin and `depth` deep; the door stands set back `set` from the face */
function linings(g, hw, hh, depth, col) {
  const m = mat("DoorFrame", col, 0.85);
  for (const s of [-1, 1]) B(g, m, 0.03, hh, depth, s * (hw / 2 - 0.015), hh / 2, -depth / 2);
  B(g, m, hw, 0.03, depth, 0, hh - 0.015, -depth / 2);
  B(g, DARK(), hw, hh, 0.01, 0, hh / 2, -depth + 0.005);
}
function fanlight(g, w, y0, y1, z, frameCol, glassCol = 0x3c4a50) {
  const fm = mat("DoorFrame", frameCol, 0.8);
  B(g, fm, w, 0.06, 0.07, 0, y0 + 0.03, z);
  B(g, mat("DoorGlass", glassCol, 0.15, 0.3), w, y1 - y0 - 0.06, 0.01, 0, (y0 + 0.06 + y1) / 2, z - 0.01);
  for (const x of [-w / 6, w / 6]) B(g, fm, 0.025, y1 - y0 - 0.06, 0.03, x, (y0 + 0.06 + y1) / 2, z);
}
export function terraceLeaf({ w = 0.9, h = 1.9, color = 0x2f4f46 } = {}) {
  // a Victorian four-panel door leaf: two long panels above the lock rail, two short below, a muntin between; hinge side at x = -w / 2, face at z = 0
  const g = new THREE.Group(),
    lf = mat("Door", color, 0.45),
    sh = mat("Door", tone(color, 0.55), 0.55),
    hi = mat("Door", tone(color, 1.15), 0.45),
    st = 0.12,
    mr = h * 0.42;
  B(g, lf, w, h, 0.05, 0, h / 2, -0.025);
  const pw = (w - 2 * st - 0.09) / 2;
  for (const [a, b] of [[0.2, mr - 0.09], [mr + 0.09, h - 0.12]])
    for (const s of [-1, 1]) {
      const x = s * (pw / 2 + 0.045);
      B(g, sh, pw, b - a, 0.004, x, (a + b) / 2, 0.002);
      B(g, hi, pw - 0.04, b - a - 0.04, 0.008, x, (a + b) / 2, 0.006);
      B(g, lf, pw - 0.1, b - a - 0.1, 0.012, x, (a + b) / 2, 0.01);
    }
  // the brass furniture: a letter plate in the lock rail, a knocker on the muntin, a knob and a night latch on the lock side
  const br = BRASS();
  B(g, br, 0.27, 0.075, 0.01, 0, mr, 0.006);
  B(g, DARK(), 0.22, 0.03, 0.006, 0, mr, 0.012);
  B(g, br, 0.06, 0.1, 0.012, 0, 1.45, 0.007);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.009, 6, 16), br);
  ring.position.set(0, 1.39, 0.02);
  g.add(ring);
  const kn = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 8), br);
  kn.position.set(w / 2 - 0.08, mr + 0.12, 0.055);
  g.add(kn);
  B(g, br, 0.014, 0.014, 0.05, w / 2 - 0.08, mr + 0.12, 0.028);
  B(g, br, 0.055, 0.055, 0.008, w / 2 - 0.08, mr + 0.12, 0.004);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 12), br);
  cyl.rotation.x = Math.PI / 2;
  cyl.position.set(w / 2 - 0.08, mr + 0.42, 0.008);
  g.add(cyl);
  return g;
}
export function terraceDoor({ color = 0x2f4f46, hw = 1.1, hh = 2.18, depth = 0.3, set = 0.2, lining = 0xe6e0d0 } = {}) {
  const g = new THREE.Group(),
    lw = 0.9,
    lh = 1.88;
  g.name = "Door";
  linings(g, hw, hh, depth, lining);
  // the door frame in the hole, the leaf in it, the fanlight above
  const fm = mat("DoorFrame", lining, 0.8);
  for (const s of [-1, 1]) B(g, fm, (hw - lw) / 2, lh, 0.08, s * (lw / 2 + (hw - lw) / 4), lh / 2, -set - 0.01);
  const L = terraceLeaf({ w: lw, h: lh - 0.005, color });
  L.position.set(0, 0.005, -set + 0.02);
  g.add(L);
  fanlight(g, hw - 0.06, lh, hh - 0.04, -set + 0.0, lining);
  B(g, mat("DoorFrame", 0xd8d2c0, 0.9), hw, 0.02, set + 0.02, 0, 0.0, -set / 2);
  return g;
}
export function upvcDoor({ hw = 1.1, hh = 2.18, depth = 0.3, set = 0.12 } = {}) {
  const g = new THREE.Group(),
    wh = mat("Door", 0xf2f2ee, 0.35),
    wf = mat("DoorFrame", 0xf2f2ee, 0.35),
    lw = 0.92,
    lh = 2.0;
  g.name = "Door";
  linings(g, hw, hh, depth, 0xf0eee6);
  for (const s of [-1, 1]) B(g, wf, (hw - lw) / 2, hh, 0.07, s * (lw / 2 + (hw - lw) / 4), hh / 2, -set);
  B(g, wf, hw, hh - lh, 0.07, 0, (lh + hh) / 2, -set);
  B(g, mat("DoorGlass", 0x5a6a70, 0.15, 0.3), hw - 0.1, hh - lh - 0.06, 0.01, 0, (lh + hh) / 2, -set + 0.04);
  const z = -set + 0.04;
  B(g, wh, lw, lh, 0.06, 0, lh / 2, z - 0.03);
  // a frosted glass panel in the top half, in a moulded bead, and a raised panel below
  B(g, wh, 0.56, 0.86, 0.01, 0, 1.4, z + 0.005);
  B(g, mat("DoorGlass", 0xc8d2d4, 0.35, 0.1), 0.5, 0.8, 0.01, 0, 1.4, z + 0.008);
  B(g, mat("Door", 0xdcdcd6, 0.4), 0.58, 0.62, 0.006, 0, 0.45, z + 0.004);
  B(g, wh, 0.52, 0.56, 0.01, 0, 0.45, z + 0.008);
  const ch = mat("DoorMetal", 0xc8ccd0, 0.2, 0.9);
  B(g, ch, 0.32, 0.08, 0.012, 0, 0.88, z + 0.008);
  B(g, DARK(), 0.26, 0.03, 0.006, 0, 0.88, z + 0.015);
  B(g, ch, 0.04, 0.24, 0.012, lw / 2 - 0.09, 1.02, z + 0.008);
  B(g, ch, 0.13, 0.022, 0.022, lw / 2 - 0.145, 1.07, z + 0.05);
  B(g, ch, 0.014, 0.014, 0.04, lw / 2 - 0.09, 1.07, z + 0.03);
  return g;
}

/* corrugated sheet: a row of thin ridges on a flat back */
function corrugated(g, w, h, x, y, z, col) {
  const m = mat("Door", col, 0.6, 0.35),
    r = mat("Door", tone(col, 1.15), 0.5, 0.35);
  B(g, m, w, h, 0.01, x, y, z);
  for (let k = -w / 2 + 0.04; k < w / 2; k += 0.076) B(g, r, 0.03, h, 0.018, x + k, y, z + 0.008);
}
export function shedDoors({ w = 3.4, h = 3.6, color = 0x3d4a48, open = 0.6 } = {}) {
  const g = new THREE.Group(),
    steel = mat("DoorMetal", 0x3a3c3c, 0.6, 0.5),
    lw = w / 2 + 0.05;
  g.name = "Door";
  // the opening: a dark shed inside where a leaf has been slid aside, a steel channel round it
  B(g, DARK(), w, h, 0.01, 0, h / 2, 0.005);
  for (const s of [-1, 1]) B(g, steel, 0.08, h + 0.08, 0.05, s * (w / 2 + 0.04), (h + 0.08) / 2, 0.025);
  // the track over the opening, on brackets, wider than the opening so a leaf can slide clear
  B(g, steel, w * 1.6 + 0.2, 0.1, 0.06, 0, h + 0.2, 0.09);
  for (const x of [-w * 0.78, -w * 0.4, 0, w * 0.4, w * 0.78]) B(g, steel, 0.06, 0.16, 0.12, x, h + 0.2, 0.06);
  // two leaves of corrugated iron on a steel frame, each hung from two rollers; the left one slid open by `open` of its width
  for (const [s, slide] of [[-1, -open * lw], [1, 0]]) {
    const cx = s * (lw / 2 - 0.05) + slide,
      z = 0.12;
    corrugated(g, lw, h, cx, h / 2, z, color);
    for (const y of [0.06, h / 2, h - 0.06]) B(g, steel, lw, 0.07, 0.04, cx, y, z + 0.03);
    for (const x of [cx - lw / 2 + 0.04, cx + lw / 2 - 0.04]) B(g, steel, 0.07, h, 0.04, x, h / 2, z + 0.03);
    const br = B(g, steel, 0.05, Math.hypot(lw - 0.1, h - 0.1), 0.03, cx, h / 2, z + 0.035);
    br.rotation.z = s * Math.atan2(lw - 0.1, h - 0.1);
    for (const x of [cx - lw / 3, cx + lw / 3]) {
      B(g, steel, 0.04, 0.2, 0.03, x, h + 0.08, z);
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), steel);
      wh.rotation.x = Math.PI / 2;
      wh.position.set(x, h + 0.2, 0.13);
      g.add(wh);
    }
    B(g, steel, 0.04, 0.4, 0.06, cx + s * (lw / 2 - 0.15), 1.1, z + 0.05);
  }
  return g;
}
