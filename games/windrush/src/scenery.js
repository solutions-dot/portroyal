/* Lived-in scenery for Windrush, built in code (no image files). Each builder returns a group standing on y = 0 at its own origin,
   facing +z unless it says otherwise. Shapes are reconstructions from period photographs and descriptions (docs/games/windrush.md). */
import * as THREE from "three";
import { T, cv, std, solid, flat, mesh, box, cyl, plane, grp, rng } from "./gfx.js";
import { saloonCar } from "../../../engine/roadcars.js";
import { shipLifeboat, paintKit } from "../../../engine/boats.js";

const M = {
  zinc: () => std(T.zinc([150, 152, 146], [1, 1]), 0.6),
  rust: () => std(T.zinc([140, 106, 80], [1, 1]), 0.7),
  wood: solid(0x7a5a3c, 0.95),
  woodDark: solid(0x4a3424, 0.95),
  woodPale: solid(0xa98c66, 0.9),
  iron: solid(0x2b2d31, 0.6, 0.3),
  steel: solid(0x8c8f93, 0.4, 0.5),
  white: solid(0xe8e4d8, 0.85),
  cream: solid(0xd9cfb4, 0.9),
  red: solid(0xa8322c, 0.7),
  black: solid(0x1c1d1f, 0.7),
  glass: solid(0x6d8488, 0.25, 0.1),
  brickTrim: solid(0xcfc6b0, 0.9),
  slate: solid(0x4f5354, 0.8),
  rope: solid(0xb59a6a, 1),
  canvas: solid(0xbdb39a, 1),
  tar: solid(0x2e3236, 0.9),
};
export { M as SM };
export function textPlane(text, w, h, bg = "#e7dcc2", fg = "#263e45", font = "bold") {
  const tex = cv(512, Math.max(32, Math.round((512 * h) / w)), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = font + " " + Math.round(H * 0.56) + "px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2 + 1, W * 0.92);
  });
  return plane(w, h, std(tex, 0.85));
}
/* a sheet of writing on a wall: a title and some lines (no real words needed at reading distance) */
export function notice(title, w = 0.42, h = 0.56, bg = "#efe6cf", fg = "#2c3a3e") {
  const tex = cv(256, Math.round((256 * h) / w), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = "bold " + Math.round(W * 0.09) + "px sans-serif";
    x.textAlign = "center";
    x.fillText(title, W / 2, W * 0.14, W * 0.9);
    x.fillStyle = "rgba(40,50,55,.45)";
    for (let y = W * 0.24; y < H - 12; y += W * 0.07) x.fillRect(W * 0.1, y, W * (0.55 + ((y * 7) % 30) / 100), W * 0.025);
  });
  return plane(w, h, std(tex, 0.9));
}

/* ---------- Kingston ---------- */
/* a fence of corrugated zinc sheets on posts, running along x from 0 to len; a gap from gate[0] to gate[1] */
export function zincFence(len, h = 1.9, seed = 3, gate = null) {
  const g = grp(),
    r = rng(seed),
    sheets = [M.zinc(), M.rust()];
  for (let x = 0; x < len - 0.1; x += 0.9) {
    if (gate && x + 0.9 > gate[0] && x < gate[1]) continue;
    const s = box(0.92, h * (0.94 + r() * 0.08), 0.02, sheets[r() < 0.3 ? 1 : 0], x + 0.45, h / 2, 0, g);
    s.rotation.z = (r() - 0.5) * 0.02;
  }
  for (let x = 0; x <= len; x += 2.7) if (!gate || x < gate[0] - 0.1 || x > gate[1] + 0.1) box(0.09, h + 0.1, 0.09, M.woodDark, x, (h + 0.1) / 2, -0.06, g);
  if (gate) for (const x of gate) box(0.1, h + 0.2, 0.1, M.woodDark, x, (h + 0.2) / 2, -0.06, g);
  for (const y of [0.35, h - 0.3]) box(len, 0.06, 0.05, M.woodDark, len / 2, y, -0.05, g);
  return g;
}
/* an outdoor kitchen: four posts, a zinc lean-to roof, a coal pot on a low stone stand with a pot on it, and a shelf of tins */
export function kitchenShed(w = 3, d = 2.2) {
  const g = grp(),
    h = 2.3;
  for (const [x, z] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) box(0.1, h + (z < 0 ? 0.3 : 0), 0.1, M.woodDark, x, (h + (z < 0 ? 0.3 : 0)) / 2, z, g);
  const roof = box(w + 0.5, 0.05, d + 0.6, M.zinc(), 0, h + 0.17, 0, g);
  roof.rotation.x = 0.14;
  box(w, 1.6, 0.03, M.rust(), 0, 0.8 + 0.4, -d / 2 - 0.03, g);
  box(1.1, 0.42, 0.8, solid(0x8a8478, 1), -0.6, 0.21, -0.35, g);
  coalPot(g, -0.6, 0.42, -0.35);
  box(1.2, 0.04, 0.3, M.wood, 0.7, 1.25, -d / 2 + 0.2, g);
  for (const [x, c] of [[0.3, 0xb8362c], [0.55, 0xd9c070], [0.8, 0x6c8a5a], [1.05, 0x9aa09a]]) cyl(0.06, 0.06, 0.15, solid(c, 0.5, 0.3), x, 1.345, -d / 2 + 0.2, g, 10);
  return g;
}
export function coalPot(parent, x, y, z) {
  const g = grp(parent, x, y, z);
  cyl(0.18, 0.12, 0.2, M.iron, 0, 0.1, 0, g, 10);
  cyl(0.2, 0.2, 0.03, M.iron, 0, 0.21, 0, g, 10);
  const pot = mesh(new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.65), M.black, 0, 0.36, 0, g);
  pot.material.side = THREE.DoubleSide;
  cyl(0.16, 0.16, 0.02, M.black, 0, 0.36, 0, g, 12);
  for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(0.035, 0), glowCoal(), Math.cos(i * 1.7) * 0.07, 0.235, Math.sin(i * 1.7) * 0.07, g);
  return g;
}
let _coal;
const glowCoal = () => (_coal = _coal || new THREE.MeshBasicMaterial({ color: 0xc8542a }));
/* a clothes line between two posts with things hanging on it; cloth colours vary */
export function washLine(len = 4, h = 1.75, seed = 2, items = 6) {
  const g = grp(),
    r = rng(seed);
  for (const x of [0, len]) {
    box(0.08, h + 0.05, 0.08, M.woodDark, x, (h + 0.05) / 2, 0, g);
    box(0.4, 0.05, 0.05, M.woodDark, x, h, 0, g);
  }
  const line = cyl(0.006, 0.006, len, M.rope, len / 2, h - 0.02, 0, g, 4);
  line.rotation.z = Math.PI / 2;
  const cols = [0xf0ece0, 0xc9dbe0, 0xe2b04a, 0xb85a48, 0x7a9a6a, 0xf2e6c8, 0x5a6e9a];
  for (let i = 0; i < items; i++) {
    const w = 0.3 + r() * 0.35,
      hh = 0.35 + r() * 0.45,
      x = 0.35 + (i + 0.5) * ((len - 0.7) / items);
    box(w, hh, 0.012, solid(cols[(r() * cols.length) | 0], 1), x, h - 0.03 - hh / 2, 0, g);
    for (const s of [-1, 1]) box(0.015, 0.06, 0.03, M.woodPale, x + (s * w) / 2.6, h - 0.02, 0, g);
  }
  return g;
}
/* a low wash bench with a zinc tub and a scrubbing board */
export function washBench() {
  const g = grp();
  for (const x of [-0.55, 0.55]) box(0.07, 0.5, 0.42, M.woodDark, x, 0.25, 0, g);
  box(1.4, 0.06, 0.5, M.wood, 0, 0.53, 0, g);
  cyl(0.32, 0.26, 0.26, solid(0x9aa3a0, 0.45, 0.4), -0.25, 0.69, 0, g, 18);
  cyl(0.3, 0.3, 0.012, solid(0x8fb2bb, 0.2), -0.25, 0.79, 0, g, 18);
  const sb = box(0.32, 0.5, 0.03, M.woodPale, 0.35, 0.78, 0.05, g);
  sb.rotation.x = -0.35;
  return g;
}
/* a hen: a round body, a head with a red comb, a tail; pecks now and then (Q.tickers) */
export function hen(seed = 1) {
  const g = grp(),
    r = rng(seed),
    c = [0x8a5a34, 0xe8e0cc, 0x2e2a26][(r() * 3) | 0];
  const b = mesh(new THREE.SphereGeometry(0.11, 8, 6), flat(c), 0, 0.17, 0, g);
  b.scale.set(0.85, 0.85, 1.2);
  const head = grp(g, 0, 0.3, 0.12);
  mesh(new THREE.SphereGeometry(0.055, 6, 5), flat(c), 0, 0, 0, head);
  box(0.018, 0.04, 0.05, flat(0xc0302a), 0, 0.05, 0, head);
  mesh(new THREE.ConeGeometry(0.02, 0.05, 4), flat(0xd9a030), 0, -0.005, 0.06, head).rotation.x = Math.PI / 2;
  const tail = mesh(new THREE.ConeGeometry(0.07, 0.16, 5), flat(c), 0, 0.27, -0.14, g);
  tail.rotation.x = -0.9;
  for (const s of [-1, 1]) box(0.012, 0.11, 0.012, flat(0xd9a030), s * 0.04, 0.055, 0, g);
  g.scale.setScalar(0.88); // about 0.35 m to the top of the comb
  g.userData.noBatch = true;
  g.userData.tick = (t) => {
    const k = Math.max(0, Math.sin(t * 1.3 + seed * 2.1)) ** 6;
    head.position.set(0, 0.3 - k * 0.2, 0.12 + k * 0.08);
    g.rotation.y += Math.sin(t * 0.21 + seed) * 0.002;
  };
  return g;
}
/* a stone-edged bed of plants by a wall */
export function bed(len = 2, seed = 4, flowersOn = true) {
  const g = grp(),
    r = rng(seed);
  for (let x = 0; x < len; x += 0.3) box(0.26, 0.12, 0.14, solid(0xc9c2ae, 1), x + 0.15, 0.06, 0.35, g);
  for (let i = 0; i < len * 2; i++) {
    const s = 0.18 + r() * 0.16;
    mesh(new THREE.IcosahedronGeometry(s, 0), flat([0x3d7a38, 0x2f6a35, 0x4f8a40][i % 3]), 0.2 + r() * (len - 0.4), s * 0.8, 0.05 + r() * 0.22, g);
    if (flowersOn && r() < 0.5) mesh(new THREE.SphereGeometry(0.05, 5, 4), flat([0xe8505b, 0xf5c542, 0xffffff][i % 3]), 0.2 + r() * (len - 0.4), s * 1.5, 0.1 + r() * 0.2, g);
  }
  return g;
}
export function oilDrum(c = 0x5a6e7a) {
  const g = grp();
  cyl(0.29, 0.29, 0.88, solid(c, 0.6, 0.3), 0, 0.44, 0, g, 14);
  for (const y of [0.3, 0.6]) cyl(0.3, 0.3, 0.03, solid(c, 0.6, 0.3), 0, y, 0, g, 14);
  cyl(0.27, 0.27, 0.01, solid(0x4a6a74, 0.15), 0, 0.85, 0, g, 14);
  return g;
}
export function stool(h = 0.45) {
  const g = grp();
  for (const [x, z] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]]) box(0.04, h, 0.04, M.woodDark, x, h / 2, z, g);
  box(0.36, 0.04, 0.36, M.wood, 0, h, 0, g);
  return g;
}

/* ---------- ships, docks and stations ---------- */
export function bollard() {
  const g = grp();
  cyl(0.22, 0.26, 0.6, M.iron, 0, 0.3, 0, g, 12);
  cyl(0.3, 0.3, 0.08, M.iron, 0, 0.62, 0, g, 12);
  return g;
}
export function ropeCoil(r = 0.35) {
  const g = grp();
  for (let i = 0; i < 4; i++) {
    const t = mesh(new THREE.TorusGeometry(r - i * 0.03, 0.035, 5, 16), M.rope, 0, 0.035 + i * 0.06, 0, g);
    t.rotation.x = Math.PI / 2;
  }
  return g;
}
export function lifeRing() {
  const g = grp();
  const t = mesh(new THREE.TorusGeometry(0.3, 0.07, 6, 16), solid(0xe8e2d4, 0.8), 0, 0, 0, g);
  for (let i = 0; i < 4; i++) {
    const b = mesh(new THREE.TorusGeometry(0.3, 0.073, 6, 3, 0.35), M.red, 0, 0, 0, g);
    b.rotation.z = (i * Math.PI) / 2;
  }
  return g;
}
/* a deck ventilator: a round trunk and a cowl mouth turned to face the wind (+z) */
export function ventilator(h = 1.6, r = 0.3, c = 0xe8e4d8) {
  const g = grp(),
    m = solid(c, 0.7);
  cyl(r, r, h, m, 0, h / 2, 0, g, 14);
  const cowl = mesh(new THREE.TorusGeometry(r * 1.05, r * 0.95, 8, 14, Math.PI / 2), m, 0, h, r * 0.05, g);
  cowl.rotation.set(0, Math.PI / 2, 0);
  const mouth = mesh(new THREE.CircleGeometry(r * 1.6, 16), M.black, 0, h + r * 1.05, r * 1.02 + 0.02, g);
  mouth.scale.set(0.62, 0.62, 1);
  return g;
}
/* a hatch: a raised wooden coaming covered in tarpaulin, with battens round its edge. Top at y = 0.62 (people sit on its edge). */
export function hatch(w = 3, d = 2.4) {
  const g = grp();
  box(w, 0.58, d, M.woodDark, 0, 0.29, 0, g);
  box(w + 0.06, 0.04, d + 0.06, solid(0x5d6b5a, 1), 0, 0.6, 0, g);
  for (const s of [-1, 1]) box(w + 0.1, 0.07, 0.06, M.wood, 0, 0.46, s * (d / 2 + 0.03), g);
  return g;
}
/* a lifeboat hung from two davits; the boat's keel is `y` above the deck, outboard toward +x (engine/boats.js shipLifeboat: one mesh) */
export function lifeboat(L = 6.5, y = 2.4) {
  const g = grp(),
    b = shipLifeboat({ L, beam: 1.9, depth: 0.75, deck: -y, davitX: [-L * 0.36, L * 0.36], side: 1 });
  b.rotation.y = Math.PI / 2; /* the boat runs along z, its ship's side toward +x */
  b.position.y = y;
  g.add(b);
  return g;
}
export function deckChair(c = 0x3a6a7a) {
  const g = grp();
  for (const s of [-1, 1]) {
    const a = box(0.04, 0.04, 1.1, M.woodPale, s * 0.27, 0.42, 0, g);
    a.rotation.x = 0.55;
    const b = box(0.04, 0.6, 0.04, M.woodPale, s * 0.27, 0.3, 0.28, g);
    b.rotation.x = -0.2;
  }
  const seat = box(0.5, 0.01, 1.05, solid(c, 1), 0, 0.44, -0.02, g);
  seat.rotation.x = 0.55;
  return g;
}
/* a porter's barrow: two wooden rails with iron fittings bending back into handles, cross bars, an iron nose plate, two spoked wheels with
   rubber tyres under iron guards, and cases stacked on it (one strapped, all with handles and corner caps). One mesh (engine/boats.js paintKit). */
export function barrow(cases = 2) {
  const K = paintKit(),
    V = (x, y, z) => new THREE.Vector3(x, y, z),
    WOOD = 0x7a5a3a,
    IRON = 0x2b2d31,
    TYRE = 0x161616;
  for (const s of [-1, 1]) {
    const x = s * 0.22;
    K.tube([V(x, 0.06, 0.04), V(x, 0.7, -0.03), V(x, 1.22, -0.1), V(x * 0.95, 1.36, -0.17), V(x * 0.9, 1.41, -0.23)], 0.024, WOOD, 10, 5);
    K.cyl(0.03, 0.03, 0.1, x * 0.9, 1.42, -0.25, 0x5a4028, 6, Math.PI / 2 - 0.4); /* the grip */
    /* the wheel: a rubber tyre on an iron rim, six spokes, a hub; an iron guard over it */
    const wx = s * 0.3, wy = 0.2, wz = -0.02;
    const tyre = new THREE.TorusGeometry(0.18, 0.028, 6, 18);
    tyre.rotateY(Math.PI / 2);
    tyre.translate(wx, wy, wz);
    K.add(tyre, TYRE);
    const rim = new THREE.TorusGeometry(0.155, 0.012, 4, 18);
    rim.rotateY(Math.PI / 2);
    rim.translate(wx, wy, wz);
    K.add(rim, IRON);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI;
      const sp = new THREE.BoxGeometry(0.014, 0.3, 0.02);
      sp.rotateX(a);
      sp.translate(wx, wy, wz);
      K.add(sp, IRON);
    }
    K.cyl(0.035, 0.035, 0.07, wx, wy, wz, IRON, 8, 0, Math.PI / 2);
    K.tube([V(wx - s * 0.02, 0.1, 0.14), V(wx, 0.36, 0.09), V(wx, 0.42, -0.07), V(wx - s * 0.03, 0.3, -0.18)], 0.008, IRON, 8, 3);
    K.box(0.03, 0.18, 0.03, x, 0.12, 0.0, IRON); /* the iron foot of the rail */
  }
  K.cyl(0.014, 0.014, 0.64, 0, 0.2, -0.02, IRON, 6, 0, Math.PI / 2); /* the axle */
  for (const [y, z] of [[0.45, 0.0], [0.85, -0.05], [1.2, -0.11]]) K.box(0.44, 0.04, 0.03, 0, y, z, WOOD);
  K.box(0.52, 0.02, 0.24, 0, 0.06, 0.13, IRON);
  K.box(0.52, 0.04, 0.02, 0, 0.08, 0.245, IRON); /* the nose plate and its lip */
  for (const s of [-1, 1]) K.box(0.03, 0.06, 0.18, s * 0.2, 0.09, 0.07, IRON);
  const cols = [0x6b4a30, 0x3e4a56, 0x8a6a44];
  for (let i = 0; i < cases; i++) {
    const c = cols[i % 3],
      y = 0.2 + i * 0.19,
      z = 0.05 - i * 0.025;
    K.box(0.5, 0.18, 0.34, 0, y, z, c);
    K.box(0.505, 0.012, 0.345, 0, y + 0.005, z, 0x2a2420); /* the lid line */
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) K.box(0.04, 0.04, 0.35, sx * 0.235, y + sy * 0.075, z, 0x2a2420); /* leather corner caps */
    K.tube([V(-0.06, y + 0.09, z + 0.17), V(0, y + 0.13, z + 0.18), V(0.06, y + 0.09, z + 0.17)], 0.01, 0x2a2420, 6, 3); /* the handle */
    if (i % 2 === 1) K.box(0.03, 0.185, 0.35, 0.12, y, z, 0x5a4632); /* a strap round it */
  }
  const g = grp();
  g.add(K.mesh("barrow"));
  return g;
}
/* a long trestle table with a cloth, for papers on the landing stage or an advice centre */
export function trestle(w = 2.2, d = 0.8, h = 0.76, c = 0x6f5136) {
  const g = grp(),
    m = solid(c, 0.9);
  for (const x of [-w / 2 + 0.2, w / 2 - 0.2]) {
    for (const s of [-1, 1]) {
      const l = box(0.05, h, 0.05, m, x, h / 2, (s * d) / 3, g);
      l.rotation.x = s * 0.12;
    }
  }
  box(w, 0.04, d, m, 0, h, 0, g);
  return g;
}
export function crateStack(seed = 1) {
  const g = grp(),
    r = rng(seed);
  const cols = [0x8a6a42, 0x9a7a4c, 0x76583a];
  let n = 0;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++) {
      if (r() < 0.25 && i + j > 0) continue;
      box(0.9, 0.7, 0.9, solid(cols[n++ % 3], 0.95), (i - 1) * 0.92, 0.35, (j - 0.5) * 0.92, g);
    }
  box(0.9, 0.7, 0.9, solid(cols[1], 0.95), -0.46, 1.05, -0.46, g);
  return g;
}
/* a dockside shed: a long corrugated building with big doorways on its front (+z) */
export function dockShed(w = 24, d = 10, h = 6, c = [148, 150, 144], door = 0x2d3436) {
  const g = grp(),
    z = T.zinc(c, [w / 3, h / 3]).clone();
  z.needsUpdate = true;
  z.repeat.set(w / 3, h / 3);
  box(w, h, d, std(z, 0.6), 0, h / 2, 0, g);
  const roof = box(w + 0.6, 0.2, d + 0.6, M.slate, 0, h + 0.1, 0, g);
  for (let x = -w / 2 + 3; x < w / 2 - 1; x += 6) box(3.4, 3.6, 0.06, solid(door, 0.8), x, 1.8, d / 2 + 0.03, g);
  return g;
}

/* ---------- England ---------- */
const brickTex = (tone) =>
  cv(
    256,
    256,
    (x, W, H) => {
      x.fillStyle = "#a69b86";
      x.fillRect(0, 0, W, H);
      const pal = tone === "yellow" ? ["#b59a6a", "#a8895c", "#c0a676", "#9c7f54"] : ["#8e5a45", "#9d6a50", "#7f5040", "#a5735a"];
      for (let row = 0; row < 16; row++)
        for (let col = -1; col < 9; col++) {
          x.fillStyle = pal[(row * 7 + col * 3 + ((row * col) % 5)) % 4];
          x.fillRect(col * 32 + (row % 2) * 16 + 1, row * 16 + 1, 30, 14);
        }
    },
    [1, 1],
  );
const _bricks = {};
export function brickMat(tone = "red", rep = [2, 2]) {
  const k = tone + rep;
  if (_bricks[k]) return _bricks[k];
  const t = brickTex(tone).clone();
  t.needsUpdate = true;
  t.repeat.set(...rep);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return (_bricks[k] = std(t, 0.95));
}
/* one Victorian terrace house front, 5 m wide, 2 storeys, its front face at z = 0 (facing +z), with a bay window, a door up a step, sash windows and a chimney.
   opts: door colour, shop (a shopfront in place of the bay: { name, bg, fg }), open (leave a doorway hole and no door), tone */
export function terraceHouse(opts = {}) {
  const g = grp(),
    W = 5,
    D = 6,
    H = 6.4,
    br = brickMat(opts.tone || "yellow", [2.5, 3]),
    trim = M.brickTrim;
  // the front wall, built round the door hole and the bay (or shop) opening, which its own glass fills
  const dx = 1.55;
  box(W, H - 2.3, 0.3, br, 0, 2.3 + (H - 2.3) / 2, -0.15, g);
  for (const [a, b] of [[-W / 2, -2.2], [0.2, dx - 0.55], [dx + 0.55, W / 2]]) box(b - a, 2.3, 0.3, br, (a + b) / 2, 1.15, -0.15, g);
  // the body of the house behind (left open when the player goes inside)
  if (!opts.interior) box(W, H, D - 0.3, br, 0, H / 2, -0.3 - (D - 0.3) / 2, g);
  else {
    box(W, H - 2.9, D - 0.3, br, 0, 2.9 + (H - 2.9) / 2, -0.3 - (D - 0.3) / 2, g);
    box(2.4, 0.06, 0.06, M.brickTrim, -1.0, 0.02, -0.15, g);
  }
  const roof = box(W + 0.1, 0.25, D + 0.3, M.slate, 0, H + 0.1, -D / 2 + 0.1, g);
  box(0.7, 1.2, 0.6, br, W / 2 - 0.4, H + 0.8, -D / 2, g);
  for (const x of [-0.18, 0, 0.18]) cyl(0.07, 0.07, 0.35, solid(0x9a5a3a, 0.9), W / 2 - 0.4 + x, H + 1.55, -D / 2, g, 6);
  box(W + 0.05, 0.22, 0.12, trim, 0, H - 0.2, 0.06, g);
  // door, step and fanlight
  if (!opts.open) box(1.0, 2.1, 0.06, solid(opts.door || 0x2f4f46, 0.6), dx, 1.12, -0.2, g);
  box(1.3, 0.12, 0.5, trim, dx, 0.06, 0.25, g);
  box(1.2, 0.12, 0.08, trim, dx, 2.3, 0.04, g);
  plane(0.9, 0.18, M.glass, dx, 2.1, 0.02, g);
  // upstairs sash windows
  for (const x of [-1.2, dx]) sash(g, x, 4.4);
  if (opts.shop) {
    const s = opts.shop;
    box(3.4, 2.6, 0.2, solid(s.frame || 0x37473f, 0.6), -1.0, 1.3, 0.1, g);
    plane(3.0, 1.7, M.glass, -1.0, 1.45, 0.21, g);
    box(3.0, 0.1, 0.12, solid(s.frame || 0x37473f, 0.6), -1.0, 0.55, 0.25, g);
    const fascia = textPlane(s.name, 3.6, 0.5, s.bg || "#26372f", s.fg || "#e8dcb4");
    fascia.position.set(-1.0, 2.85, 0.22);
    g.add(fascia);
    box(3.7, 0.6, 0.1, solid(s.frame || 0x37473f, 0.6), -1.0, 2.85, 0.15, g);
    if (s.awning) {
      const a = box(3.6, 0.04, 1.3, solid(s.awning, 1), -1.0, 2.5, 0.75, g);
      a.rotation.x = 0.35;
      for (const sx of [-2.7, 0.7]) box(0.03, 0.03, 1.2, M.iron, sx, 2.48, 0.7, g).rotation.x = 0.35;
    }
  } else {
    // a bay window: three faces on a low wall, with a lead roof
    box(2.3, 0.7, 0.75, br, -1.0, 0.35, 0.37, g);
    box(2.1, 1.5, 0.06, M.glass, -1.0, 1.5, 0.72, g);
    for (const s of [-1, 1]) {
      const p = box(0.06, 1.5, 0.66, M.glass, -1.0 + s * 1.12, 1.5, 0.38, g);
      p.rotation.y = s * 0.0;
    }
    for (const x of [-2.12, -1.35, -0.65, 0.12]) box(0.08, 1.6, 0.08, trim, x, 1.5, 0.73, g);
    box(2.4, 0.12, 0.85, trim, -1.0, 0.72, 0.38, g);
    box(2.4, 0.14, 0.85, M.slate, -1.0, 2.32, 0.38, g);
    // net curtains
    plane(1.95, 1.2, solid(0xe8e4d6, 1), -1.0, 1.55, 0.68, g);
  }
  return g;
}
function sash(g, x, y) {
  box(1.1, 1.6, 0.08, M.brickTrim, x, y, 0.0, g);
  plane(0.92, 1.4, M.glass, x, y, 0.05, g);
  box(0.94, 0.05, 0.05, M.brickTrim, x, y, 0.07, g);
  box(1.25, 0.1, 0.18, M.brickTrim, x, y - 0.83, 0.07, g);
  plane(0.88, 0.62, solid(0xe8e4d6, 1), x, y + 0.32, 0.03, g);
}
/* a row of terrace houses along x, starting at x = 0 (each house 5 m); specs[i] are the opts for house i, null for a bomb-site gap */
export function terraceRow(specs) {
  const g = grp();
  specs.forEach((s, i) => {
    if (s === null) return;
    const h = terraceHouse(s);
    h.position.x = i * 5 + 2.5;
    g.add(h);
  });
  return g;
}
/* a gap in the terrace from wartime bombing: a hoarding with posters, rubble and weeds behind it (1948 London had many) */
export function bombSite(w = 5, seed = 9) {
  const g = grp(),
    r = rng(seed);
  for (let x = 0; x < w; x += 1.2) box(1.22, 2.2, 0.05, solid(0x6a5a44, 1), x + 0.6, 1.1, 0, g);
  for (const x of [0.1, w / 2, w - 0.1]) box(0.1, 2.3, 0.1, M.woodDark, x, 1.15, -0.08, g);
  const posters = [["SAVINGS", "#c9b26a"], ["BUY BRITISH", "#7a9aa6"], ["DANCE", "#c46a52"]];
  posters.forEach(([t, c], i) => {
    const p = notice(t, 0.8, 1.05, c, "#202a2c");
    p.position.set(0.8 + i * 1.5, 1.35, 0.035);
    g.add(p);
  });
  for (let i = 0; i < 9; i++) mesh(new THREE.IcosahedronGeometry(0.3 + r() * 0.4, 0), flat([0x8e6a52, 0x9a8a72, 0x6e5e4e][i % 3]), 0.4 + r() * (w - 0.8), 0.1, -1 - r() * 3, g).scale.y = 0.5;
  for (let i = 0; i < 6; i++) mesh(new THREE.IcosahedronGeometry(0.22, 0), flat(0x5a7a3a), 0.4 + r() * (w - 0.8), 0.18, -0.6 - r() * 3.6, g);
  return g;
}
/* a K6 telephone kiosk (1936 design), red with a domed roof and a crown sign */
export function phoneBox() {
  const g = grp(),
    red = solid(0xb0302a, 0.55);
  box(0.95, 2.45, 0.95, red, 0, 1.225, 0, g);
  for (const s of [-1, 1]) {
    plane(0.66, 1.6, M.glass, 0, 1.25, s * 0.48, g).rotation.y = s > 0 ? 0 : Math.PI;
    plane(0.66, 1.6, M.glass, s * 0.48, 1.25, 0, g).rotation.y = (s * Math.PI) / 2;
  }
  const dome = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.95, 12, 1, false, 0, Math.PI), red, 0, 2.45, 0, g);
  dome.rotation.z = Math.PI / 2;
  dome.scale.set(0.3, 1, 1);
  const sign = textPlane("TELEPHONE", 0.7, 0.13, "#f2efe2", "#1c1c1c");
  sign.position.set(0, 2.3, 0.481);
  g.add(sign);
  return g;
}
export function busStop(text = "BUS STOP") {
  const g = grp();
  cyl(0.04, 0.05, 2.6, M.iron, 0, 1.3, 0, g, 8);
  const disc = mesh(new THREE.CircleGeometry(0.28, 20), solid(0xb0302a, 0.6), 0, 2.45, 0.03, g);
  const bar = textPlane(text, 0.5, 0.11, "#1f3a6a", "#f2efe2");
  bar.position.set(0, 2.45, 0.04);
  g.add(bar);
  mesh(new THREE.CircleGeometry(0.28, 20), solid(0xb0302a, 0.6), 0, 2.45, -0.03, g).rotation.y = Math.PI;
  return g;
}
/* a small family car (period shape picked by `era`: rounded for the 1940s to 1960s, modern for the 2010s), facing +x.
   No make, no badge and a blank plate: tyres, hub caps, windows, door lines, lamps and bumpers come from engine/roadcars.js */
export function car(c = 0x3c5a6a, era = 1962) {
  return saloonCar({ era: era < 2000 ? "1960s" : "modern", colour: c, L: era < 2000 ? 3.8 : 4.1, W: 1.55 });
}
/* a London plane tree for a street: a mottled trunk and a rounded crown */
export function planeTree(h = 7, seed = 2) {
  const g = grp(),
    r = rng(seed);
  cyl(0.18, 0.26, h * 0.55, solid(0x8a8066, 1), 0, h * 0.275, 0, g, 8);
  for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(h * (0.2 + r() * 0.08), 1), flat([0x5a7a3e, 0x4f7038, 0x66843f][i % 3]), (r() - 0.5) * h * 0.3, h * 0.7 + r() * h * 0.15, (r() - 0.5) * h * 0.3, g);
  box(1.1, 0.06, 1.1, M.iron, 0, 0.03, 0, g);
  return g;
}
export function pavement(Q, x0, z0, x1, z1, kerbSide) {
  const g = grp();
  const t = T.concrete([Math.max(1, (x1 - x0) / 1.2), Math.max(1, (z1 - z0) / 1.2)], [170, 168, 160]);
  box(x1 - x0, 0.03, z1 - z0, std(t, 0.95), (x0 + x1) / 2, 0.015, (z0 + z1) / 2, g);
  if (kerbSide) {
    const kz = kerbSide > 0 ? z1 : z0;
    box(x1 - x0, 0.05, 0.22, solid(0xb5b2a8, 0.9), (x0 + x1) / 2, 0.025, kz - Math.sign(kerbSide) * 0.11, g);
  }
  return g;
}
/* a low front-garden wall with railings and a gate gap */
export function frontWall(len, gateAt = null) {
  const g = grp(),
    br = brickMat("red", [Math.max(1, len / 2), 0.5]);
  for (const [a, b] of gateAt === null ? [[0, len]] : [[0, gateAt - 0.5], [gateAt + 0.5, len]]) {
    if (b - a < 0.05) continue;
    box(b - a, 0.55, 0.25, br, (a + b) / 2, 0.275, 0, g);
    box(b - a + 0.04, 0.06, 0.3, M.brickTrim, (a + b) / 2, 0.58, 0, g);
    for (let x = a + 0.1; x < b; x += 0.14) box(0.02, 0.45, 0.02, M.black, x, 0.83, 0, g);
    box(b - a, 0.03, 0.03, M.black, (a + b) / 2, 1.05, 0, g);
  }
  if (gateAt !== null) for (const s of [-1, 1]) box(0.16, 0.9, 0.16, M.brickTrim, gateAt + s * 0.55, 0.45, 0, g);
  return g;
}
/* a garden gate, standing open at an angle (hinge at its origin) */
export function gate(w = 0.9, open = 1.2) {
  const g = grp();
  const leaf = grp(g);
  for (let x = 0.05; x < w; x += 0.12) box(0.025, 0.8, 0.025, M.black, x, 0.5, 0, leaf);
  for (const y of [0.15, 0.85]) box(w, 0.03, 0.03, M.black, w / 2, y, 0, leaf);
  leaf.rotation.y = open;
  return g;
}

/* ---------- inside ---------- */
/* a room: floor, walls with door gaps and windows, a ceiling. Walls are listed as [x0, z0, x1, z1] lines along the room's edge, with gaps
   { at: along metres, w, h, kind: 'door' | 'window' }. Returns the group; the caller adds walking walls for each wall run. */
export function room({ x0, z0, x1, z1, h = 2.7, floor, wall, ceiling = true, walls }) {
  const g = grp(),
    t = 0.12;
  const fl = box(x1 - x0 - 0.14, 0.04, z1 - z0 - 0.14, floor, (x0 + x1) / 2, -0.01, (z0 + z1) / 2, g);
  if (ceiling) box(x1 - x0 - 0.14, 0.1, z1 - z0 - 0.14, solid(0xeeeae0, 1), (x0 + x1) / 2, h + 0.05, (z0 + z1) / 2, g);
  for (const w of walls) {
    const [ax, az, bx, bz] = w.line,
      len = Math.hypot(bx - ax, bz - az),
      dir = [(bx - ax) / len, (bz - az) / len];
    const seg = grp(g, ax, 0, az);
    seg.rotation.y = -Math.atan2(dir[1], dir[0]);
    const gaps = (w.gaps || []).slice().sort((a, b) => a.at - b.at);
    let s = 0;
    const piece = (a, b, y0, y1) => b - a > 0.01 && y1 - y0 > 0.01 && box(b - a, y1 - y0, t, wall, (a + b) / 2, (y0 + y1) / 2, 0, seg);
    for (const gp of gaps) {
      const a = gp.at - gp.w / 2,
        b = gp.at + gp.w / 2;
      piece(s, a, 0, h);
      if (gp.kind === "window") {
        piece(a, b, 0, gp.sill || 0.9);
        piece(a, b, (gp.sill || 0.9) + gp.h, h);
        plane(gp.w, gp.h, M.glass, (a + b) / 2, (gp.sill || 0.9) + gp.h / 2, 0, seg);
        box(gp.w + 0.1, 0.06, 0.2, M.white, (a + b) / 2, gp.sill || 0.9, 0.04, seg);
        box(0.05, gp.h, 0.06, M.white, (a + b) / 2, (gp.sill || 0.9) + gp.h / 2, 0.0, seg);
      } else {
        piece(a, b, gp.h || 2.1, h);
        for (const e of [a, b]) box(0.06, gp.h || 2.1, t + 0.04, M.white, e, (gp.h || 2.1) / 2, 0, seg);
      }
      s = b;
    }
    piece(s, len, 0, h);
    box(len, 0.1, t + 0.03, M.white, len / 2, 0.05, 0, seg);
  }
  return g;
}
export function sofa(w = 2, c = 0x6a7a5a) {
  const g = grp(),
    m = solid(c, 1);
  box(w, 0.42, 0.85, m, 0, 0.21, 0, g);
  box(w, 0.5, 0.22, m, 0, 0.62, -0.32, g);
  for (const s of [-1, 1]) box(0.2, 0.62, 0.85, m, s * (w / 2 - 0.1), 0.31, 0, g);
  for (let i = 0; i < Math.round(w / 0.7); i++) box(w / Math.round(w / 0.7) - 0.06, 0.08, 0.6, solid(new THREE.Color(c).multiplyScalar(1.12).getHex(), 1), -w / 2 + 0.2 + (i + 0.5) * ((w - 0.4) / Math.round(w / 0.7)), 0.46, 0.08, g);
  return g;
}
/* an armchair: the seat top is 0.46 high and the back is at z = -0.3 */
export function armchair(c = 0x8a5a44) {
  const g = grp(),
    m = solid(c, 1);
  box(0.8, 0.4, 0.8, m, 0, 0.2, 0, g);
  box(0.8, 0.6, 0.2, m, 0, 0.7, -0.34, g);
  for (const s of [-1, 1]) box(0.14, 0.62, 0.8, m, s * 0.33, 0.31, 0, g);
  box(0.52, 0.06, 0.56, solid(new THREE.Color(c).multiplyScalar(1.15).getHex(), 1), 0, 0.43, 0.06, g);
  return g;
}
export function lowTable(w = 1.0, d = 0.55, h = 0.45, c = 0x5a3e2a) {
  const g = grp(),
    m = solid(c, 0.7);
  box(w, 0.04, d, m, 0, h - 0.02, 0, g);
  for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) for (const z of [-d / 2 + 0.06, d / 2 - 0.06]) box(0.04, h - 0.04, 0.04, m, x, (h - 0.04) / 2, z, g);
  return g;
}
export function chair(c = 0x6a4a32) {
  const g = grp(),
    m = solid(c, 0.85);
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) box(0.04, 0.45, 0.04, m, x, 0.225, z, g);
  box(0.46, 0.04, 0.46, m, 0, 0.47, 0, g);
  for (const x of [-0.2, 0.2]) box(0.04, 0.5, 0.04, m, x, 0.72, -0.21, g);
  box(0.44, 0.14, 0.03, m, 0, 0.88, -0.21, g);
  return g;
}
/* a moulded plastic stacking chair (2018): seat top 0.46 */
export function plasticChair(c = 0x2f5a7a) {
  const g = grp(),
    m = solid(c, 0.5);
  for (const [x, z] of [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.2], [0.2, 0.2]]) box(0.025, 0.44, 0.025, M.steel, x, 0.22, z, g);
  box(0.46, 0.035, 0.44, m, 0, 0.455, 0, g);
  const b = box(0.44, 0.38, 0.03, m, 0, 0.7, -0.22, g);
  b.rotation.x = -0.12;
  return g;
}
export function sideboard(w = 1.6, c = 0x5e4230) {
  const g = grp(),
    m = solid(c, 0.7);
  box(w, 0.8, 0.45, m, 0, 0.4, 0, g);
  for (let i = 0; i < 3; i++) box(w / 3 - 0.06, 0.6, 0.01, solid(new THREE.Color(c).multiplyScalar(1.15).getHex(), 0.7), -w / 3 + (i * w) / 3, 0.42, 0.23, g);
  return g;
}
export function bookcase(w = 1, h = 1.8, seed = 3) {
  const g = grp(),
    r = rng(seed),
    m = solid(0x6a4c34, 0.8);
  for (const s of [-1, 1]) box(0.03, h, 0.3, m, (s * w) / 2, h / 2, 0, g);
  box(w, h, 0.02, m, 0, h / 2, -0.14, g);
  for (let y = 0.05; y < h; y += h / 4) {
    box(w, 0.025, 0.3, m, 0, y, 0, g);
    if (y + 0.3 > h) continue;
    let x = -w / 2 + 0.05;
    while (x < w / 2 - 0.08) {
      const bw = 0.03 + r() * 0.04,
        bh = 0.2 + r() * 0.1;
      box(bw, bh, 0.2, solid([0x7a3a32, 0x3a5a6a, 0x5a6a3a, 0xc9b27a, 0x2a3a4a][(r() * 5) | 0], 0.9), x + bw / 2, y + 0.0125 + bh / 2, 0.02, g);
      x += bw + 0.004;
    }
  }
  return g;
}
export function rug(w = 2.4, d = 1.6, c1 = "#8a3a32", c2 = "#d9c08a") {
  const tex = cv(256, 192, (x, W, H) => {
    x.fillStyle = c1;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = c2;
    x.lineWidth = 10;
    x.strokeRect(14, 14, W - 28, H - 28);
    x.lineWidth = 4;
    x.strokeRect(36, 36, W - 72, H - 72);
    x.beginPath();
    x.ellipse(W / 2, H / 2, 40, 28, 0, 0, 7);
    x.stroke();
  });
  const p = plane(w, d, std(tex, 1));
  p.rotation.x = -Math.PI / 2;
  p.position.y = 0.012;
  const g = grp();
  g.add(p);
  return g;
}
/* a framed picture on a wall, facing +z: a family photograph, a map or a painting drawn in code */
export function picture(w = 0.5, h = 0.4, kind = 0) {
  const g = grp();
  box(w + 0.06, h + 0.06, 0.03, solid(0x4a3424, 0.6), 0, 0, 0, g);
  const tex = cv(128, Math.round((128 * h) / w), (x, W, H) => {
    if (kind === 0) {
      x.fillStyle = "#d8ccb0";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#7b6a55";
      for (const [cx, r] of [[W * 0.3, H * 0.16], [W * 0.55, H * 0.15], [W * 0.75, H * 0.12]]) {
        x.beginPath();
        x.arc(cx, H * 0.42, r, 0, 7);
        x.fill();
        x.fillRect(cx - r, H * 0.42 + r, r * 2, H);
      }
    } else if (kind === 1) {
      x.fillStyle = "#7ab0c8";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#4f8a4a";
      x.beginPath();
      x.ellipse(W * 0.5, H * 0.55, W * 0.32, H * 0.13, -0.1, 0, 7);
      x.fill();
    } else {
      x.fillStyle = "#e6c87a";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#3f7a4a";
      x.fillRect(0, H * 0.6, W, H * 0.4);
      x.fillStyle = "#8a5a3a";
      x.fillRect(W * 0.6, H * 0.3, W * 0.05, H * 0.35);
    }
  });
  plane(w, h, std(tex, 0.8), 0, 0, 0.017, g);
  return g;
}
export function radiator(w = 1) {
  const g = grp();
  for (let x = -w / 2 + 0.04; x < w / 2; x += 0.06) box(0.04, 0.55, 0.08, M.white, x, 0.4, 0, g);
  for (const s of [-1, 1]) box(0.03, 0.15, 0.03, M.white, s * (w / 2 - 0.05), 0.07, 0, g);
  return g;
}
export function flatTv() {
  const g = grp();
  box(0.95, 0.56, 0.05, M.black, 0, 0.62, 0, g);
  plane(0.9, 0.5, solid(0x1d2a33, 0.2), 0, 0.62, 0.026, g);
  box(0.3, 0.03, 0.18, M.black, 0, 0.015, 0, g);
  box(0.05, 0.32, 0.03, M.black, 0, 0.18, -0.01, g);
  return g;
}
export function lamp(h = 1.5) {
  const g = grp();
  cyl(0.15, 0.15, 0.03, M.black, 0, 0.015, 0, g, 12);
  cyl(0.015, 0.015, h, M.steel, 0, h / 2, 0, g, 6);
  cyl(0.13, 0.2, 0.25, solid(0xf0e2bc, 1), 0, h + 0.05, 0, g, 14);
  return g;
}
export function pottedPlant(s = 1, seed = 1) {
  const g = grp(),
    r = rng(seed);
  cyl(0.14 * s, 0.11 * s, 0.25 * s, solid(0xa45a3a, 0.9), 0, 0.125 * s, 0, g, 10);
  for (let i = 0; i < 6; i++) {
    const l = mesh(new THREE.ConeGeometry(0.05 * s, 0.5 * s, 4), flat(0x3d7a38), 0, 0.42 * s, 0, g);
    l.rotation.set((r() - 0.5) * 0.9, r() * 6, (r() - 0.5) * 0.9);
  }
  return g;
}
export function bed1948() {
  const g = grp();
  for (const z of [-0.95, 0.95]) for (const x of [-0.45, 0.45]) cyl(0.025, 0.025, z < 0 ? 1.0 : 0.7, M.iron, x, z < 0 ? 0.5 : 0.35, z, g, 6);
  for (const z of [-0.95, 0.95]) box(0.92, 0.03, 0.03, M.iron, 0, z < 0 ? 0.98 : 0.68, z, g);
  box(0.9, 0.18, 1.9, solid(0xe8e2d0, 1), 0, 0.5, 0, g);
  box(0.92, 0.04, 1.3, solid(0x7a4a52, 1), 0, 0.6, 0.28, g);
  box(0.6, 0.1, 0.32, solid(0xf2eee2, 1), 0, 0.64, -0.7, g);
  return g;
}
export function wardrobe() {
  const g = grp(),
    m = solid(0x5a3e2c, 0.7);
  box(1.0, 1.9, 0.55, m, 0, 0.95, 0, g);
  box(0.02, 1.7, 0.01, solid(0x3a2a1e, 0.7), 0, 1.0, 0.28, g);
  for (const s of [-1, 1]) cyl(0.015, 0.015, 0.04, M.steel, s * 0.06, 1.0, 0.29, g, 6).rotation.x = Math.PI / 2;
  return g;
}
/* a paraffin heater, round and black with a red-glowing window (rooms in 1948 London were often heated this way) */
export function paraffinHeater() {
  const g = grp();
  cyl(0.18, 0.2, 0.55, M.black, 0, 0.275, 0, g, 14);
  cyl(0.2, 0.18, 0.06, M.steel, 0, 0.58, 0, g, 14);
  plane(0.12, 0.1, new THREE.MeshBasicMaterial({ color: 0xd8632f }), 0, 0.2, 0.201, g);
  return g;
}
export function gasRing() {
  const g = grp();
  box(0.5, 0.08, 0.36, M.black, 0, 0.04, 0, g);
  for (const x of [-0.12, 0.12]) mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 12), M.steel, x, 0.085, 0, g).rotation.x = Math.PI / 2;
  const k = grp(g, 0.12, 0.09, 0);
  cyl(0.08, 0.1, 0.16, solid(0xc0c4c0, 0.3, 0.6), 0, 0.08, 0, k, 12);
  return g;
}
export function teaUrn() {
  const g = grp();
  cyl(0.16, 0.16, 0.4, solid(0xc4c8c4, 0.3, 0.7), 0, 0.2, 0, g, 14);
  cyl(0.1, 0.16, 0.05, M.black, 0, 0.42, 0, g, 14);
  box(0.04, 0.04, 0.08, M.black, 0, 0.08, 0.18, g);
  return g;
}
export function noticeBoard(w = 1.4, h = 0.9, titles = ["NOTICE"]) {
  const g = grp();
  box(w, h, 0.03, solid(0xb08a5a, 1), 0, 0, 0, g);
  titles.forEach((t, i) => {
    const p = notice(t, 0.32, 0.42, ["#efe6cf", "#f2e48a", "#cfe0ef", "#f2cfc0"][i % 4]);
    p.position.set(-w / 2 + 0.25 + (i % 4) * ((w - 0.3) / 4), (i < 4 ? 0.2 : -0.22), 0.02);
    p.rotation.z = ((i * 37) % 7) / 100 - 0.03;
    g.add(p);
  });
  return g;
}
export function desk(w = 1.4, d = 0.7) {
  const g = grp(),
    m = solid(0xb8a888, 0.6);
  box(w, 0.04, d, m, 0, 0.74, 0, g);
  box(0.42, 0.7, d - 0.04, solid(0x9a8a6a, 0.6), w / 2 - 0.23, 0.36, 0, g);
  for (const z of [-d / 2 + 0.04, d / 2 - 0.04]) box(0.04, 0.72, 0.04, M.steel, -w / 2 + 0.04, 0.36, z, g);
  return g;
}
export function laptop() {
  const g = grp();
  box(0.34, 0.015, 0.24, solid(0x6a6e72, 0.4, 0.5), 0, 0.0075, 0, g);
  const s = box(0.34, 0.22, 0.012, solid(0x6a6e72, 0.4, 0.5), 0, 0.12, -0.12, g);
  s.rotation.x = -0.25;
  return g;
}
export function kettle() {
  const g = grp();
  cyl(0.08, 0.1, 0.2, solid(0xe8e4dc, 0.4), 0, 0.1, 0, g, 12);
  box(0.03, 0.12, 0.08, solid(0xe8e4dc, 0.4), -0.1, 0.13, 0, g);
  return g;
}
export function mugs(n = 2) {
  const g = grp();
  for (let i = 0; i < n; i++) cyl(0.04, 0.04, 0.09, solid([0xc9483a, 0x3a6a8a, 0xe8d8a0][i % 3], 0.5), i * 0.12, 0.045, (i % 2) * 0.06, g, 10);
  return g;
}
export function fruitBox(c = 0xd9a030, seed = 1) {
  const g = grp(),
    r = rng(seed);
  box(0.6, 0.25, 0.4, solid(0x9a7a4c, 1), 0, 0.125, 0, g);
  for (let i = 0; i < 10; i++) mesh(new THREE.SphereGeometry(0.06 + r() * 0.03, 6, 5), flat(c), (r() - 0.5) * 0.48, 0.27 + r() * 0.05, (r() - 0.5) * 0.3, g);
  return g;
}
export function tyreStack(n = 3) {
  const g = grp();
  for (let i = 0; i < n; i++) {
    const t = mesh(new THREE.TorusGeometry(0.28, 0.1, 6, 14), M.black, 0, 0.1 + i * 0.2, 0, g);
    t.rotation.x = Math.PI / 2;
  }
  return g;
}
export function workbench() {
  const g = grp();
  box(1.8, 0.06, 0.7, M.wood, 0, 0.9, 0, g);
  for (const x of [-0.8, 0.8]) for (const z of [-0.28, 0.28]) box(0.06, 0.9, 0.06, M.woodDark, x, 0.45, z, g);
  box(1.8, 0.04, 0.6, M.woodDark, 0, 0.25, 0, g);
  box(0.2, 0.14, 0.12, M.iron, -0.6, 1.0, 0.1, g);
  for (const [x, c] of [[0.2, 0x8a3a2a], [0.45, 0x3a5a3a]]) cyl(0.08, 0.08, 0.22, solid(c, 0.5, 0.3), x, 1.04, -0.1, g, 10);
  box(1.8, 0.9, 0.03, solid(0x7a6a52, 1), 0, 1.4, -0.36, g);
  return g;
}
/* a shopping bag of the 1940s to 60s, held by two loop handles; its handle is handleY above its base */
export function shoppingBag(c = 0x6a4a3a) {
  const g = grp();
  box(0.3, 0.26, 0.12, solid(c, 0.9), 0, 0.13, 0, g);
  const h = mesh(new THREE.TorusGeometry(0.07, 0.008, 4, 10, Math.PI), solid(0x3a2a20, 0.9), 0, 0.26, 0, g);
  g.userData.handleY = 0.33;
  return g;
}
/* a round basket carried on the head (Kingston, 1948), with a cloth pad under it and fruit and yams in it */
export function headBasket() {
  const g = grp();
  mesh(new THREE.TorusGeometry(0.1, 0.03, 5, 10), solid(0xd8c8a0, 1), 0, 0.01, 0, g).rotation.x = Math.PI / 2;
  cyl(0.3, 0.2, 0.18, solid(0xb08a48, 1), 0, 0.12, 0, g, 14);
  const heap = mesh(new THREE.SphereGeometry(0.27, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), solid(0x7a8a3a, 1), 0, 0.18, 0, g);
  heap.scale.y = 0.4;
  for (const [x, z, c] of [[0.1, 0.05, 0xe0a030], [-0.08, 0.1, 0xd8662a], [0, -0.12, 0x8a5a34]]) mesh(new THREE.SphereGeometry(0.06, 6, 5), solid(c, 1), x, 0.27, z, g);
  return g;
}

/* ---------- a Jamaican country district (Windrush's own home place, not shared with any other game) ---------- */
/* a board house raised on posts and stones, as country houses were (air under the floor, off the wet ground), with a veranda along its
   front, a rail, steps down to the yard, shutters, and a zinc roof. Its front faces +z; it stands from z = -d/2 to the foot of its steps at
   z = d/2 + 2.45. wall and trim are colours [r, g, b]. */
export function stiltHouse(w = 7, d = 4.5, { wall = [196, 176, 140], trim = 0xe8e0cc, shut = 0x2f6a3f, roof = [150, 154, 150], seed = 1 } = {}) {
  const g = grp(),
    lift = 0.85,
    h = 2.6,
    wt = T.plank(wall, 9, [w / 2, 1]).clone();
  wt.needsUpdate = true;
  wt.repeat.set(w / 2, 1);
  const wm = std(wt, 0.9),
    tm = solid(trim, 0.8),
    sm = solid(shut, 0.85);
  // posts on stones under the floor and the veranda
  for (let x = -w / 2 + 0.2; x <= w / 2 - 0.1; x += (w - 0.4) / 4)
    for (const z of [-d / 2 + 0.2, 0, d / 2 - 0.2, d / 2 + 1.45]) {
      box(0.16, lift, 0.16, M.woodDark, x, lift / 2, z, g);
      box(0.34, 0.16, 0.34, solid(0x9a968a, 1), x, 0.08, z, g);
    }
  box(w, 0.12, d, M.woodDark, 0, lift + 0.06, 0, g);
  box(w, h, d, wm, 0, lift + 0.12 + h / 2, 0, g);
  // the veranda floor, its rail and posts, and the steps down
  box(w + 0.1, 0.1, 1.6, std(T.plank([120, 92, 64], 8, [3, 1]), 0.95), 0, lift + 0.05, d / 2 + 0.8, g);
  for (let x = -w / 2; x <= w / 2 + 0.01; x += w / 3) box(0.11, h + 0.1, 0.11, tm, x, lift + (h + 0.1) / 2, d / 2 + 1.55, g);
  for (const [a, b] of [[-w / 2, -0.6], [0.6, w / 2]]) {
    box(b - a, 0.06, 0.06, tm, (a + b) / 2, lift + 0.9, d / 2 + 1.55, g);
    for (let x = a + 0.1; x < b; x += 0.16) box(0.035, 0.85, 0.035, tm, x, lift + 0.45, d / 2 + 1.55, g);
  }
  for (let i = 0; i < 4; i++) box(1.1, 0.06, 0.3, M.wood, 0, lift - 0.21 * (i + 1) + 0.03, d / 2 + 1.75 + i * 0.25, g);
  for (const s of [-1, 1]) {
    const st = box(0.06, 0.06, 1.15, M.woodDark, s * 0.55, lift / 2, d / 2 + 2.05, g);
    st.rotation.x = Math.atan2(lift, 1.1);
  }
  // the front: a door and two windows with board shutters swung open
  box(0.95, 2.0, 0.06, solid(0x5a3a26, 0.9), 0, lift + 1.12, d / 2 + 0.03, g);
  for (const x of [-w * 0.3, w * 0.3]) {
    box(0.95, 1.0, 0.05, M.black, x, lift + 1.5, d / 2 + 0.02, g);
    for (const s of [-1, 1]) box(0.45, 1.0, 0.05, sm, x + s * 0.72, lift + 1.5, d / 2 + 0.05, g);
    box(1.1, 0.07, 0.08, tm, x, lift + 2.05, d / 2 + 0.06, g);
    box(1.1, 0.07, 0.14, tm, x, lift + 0.97, d / 2 + 0.08, g);
  }
  // a hipped zinc roof, and the veranda's own lean-to roof
  const zt = T.zinc(roof).clone();
  zt.needsUpdate = true;
  zt.repeat.set(2, 2);
  const zm = std(zt, 0.7),
    top = lift + 0.12 + h;
  for (const s of [-1, 1]) {
    const p = box(w + 0.6, 0.06, d / 2 + 0.6, zm, 0, top + 0.55, s * (d / 4 + 0.12), g);
    p.rotation.x = s * 0.48;
  }
  for (const s of [-1, 1]) {
    const p = mesh(new THREE.ConeGeometry(d / 2 + 0.45, 1.2, 4, 1, true), zm, s * (w / 2 - 0.2), top + 0.6, 0, g);
    p.rotation.y = Math.PI / 4;
    p.scale.set(0.5, 1, 1.0);
  }
  const vr = box(w + 0.4, 0.05, 1.9, zm, 0, top - 0.15, d / 2 + 0.95, g);
  vr.rotation.x = 0.16;
  box(w + 0.2, 0.18, 0.08, tm, 0, top - 0.05, d / 2 + 0.03, g);
  return g;
}
/* a breadfruit tree: a tall trunk, big glossy dark crowns and green fruit hanging under them */
export function breadfruit(h = 8, seed = 3) {
  const g = grp(),
    r = rng(seed);
  cyl(0.25, 0.42, h * 0.5, solid(0x7a6a5a, 1), 0, h * 0.25, 0, g, 9);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + r();
    const br = box(0.12, 0.12, h * 0.3, solid(0x6a5a4a, 1), Math.cos(a) * h * 0.08, h * 0.48, Math.sin(a) * h * 0.08, g);
    br.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
  }
  for (let i = 0; i < 6; i++) {
    const s = h * (0.18 + r() * 0.08),
      b = mesh(new THREE.IcosahedronGeometry(s, 1), flat([0x1f5228, 0x2a6230, 0x24582a][i % 3]), (r() - 0.5) * h * 0.45, h * 0.62 + r() * h * 0.25, (r() - 0.5) * h * 0.45, g);
    b.scale.y = 0.75;
  }
  for (let i = 0; i < 7; i++) mesh(new THREE.SphereGeometry(0.13, 7, 5), flat(0x9ab04a), (r() - 0.5) * h * 0.4, h * 0.55 + r() * 0.4, (r() - 0.5) * h * 0.4, g);
  return g;
}
/* an ackee tree: rounded crown with red pods */
export function ackee(h = 6, seed = 5) {
  const g = grp(),
    r = rng(seed);
  cyl(0.18, 0.28, h * 0.45, solid(0x6a5444, 1), 0, h * 0.225, 0, g, 8);
  for (let i = 0; i < 5; i++) {
    const s = h * (0.2 + r() * 0.08);
    mesh(new THREE.IcosahedronGeometry(s, 1), flat([0x3a6e30, 0x2f6228, 0x447a34][i % 3]), (r() - 0.5) * h * 0.4, h * 0.62 + r() * h * 0.2, (r() - 0.5) * h * 0.4, g).scale.y = 0.8;
  }
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2,
      rr = h * (0.3 + r() * 0.12);
    mesh(new THREE.SphereGeometry(0.07, 5, 4), flat(0xc8402a), Math.cos(a) * rr, h * 0.55 + r() * h * 0.3, Math.sin(a) * rr, g);
  }
  return g;
}
/* a hedge of crotons along a boundary, red, yellow and green leaves (a Jamaican yard's border), running along x from 0 to len */
export function crotonHedge(len, seed = 2) {
  const g = grp(),
    r = rng(seed),
    cols = [0x8a2a22, 0xc8a030, 0x3a6a2a, 0xa84a22, 0x4a7a2a];
  for (let x = 0.3; x < len; x += 0.55) {
    const s = 0.35 + r() * 0.15;
    mesh(new THREE.IcosahedronGeometry(s, 0), flat(cols[(r() * cols.length) | 0]), x, s * 1.1, (r() - 0.5) * 0.15, g).scale.y = 1.4;
  }
  return g;
}
/* a dry-stone bank holding up the hillside behind the yard, along x from 0 to len */
export function stoneBank(len, h = 0.7, seed = 4) {
  const g = grp(),
    r = rng(seed),
    m = [flat(0x9a948a), flat(0x8a857a), flat(0xa8a296)];
  for (let x = 0.2; x < len; x += 0.42)
    for (let y = 0.15; y < h; y += 0.28) mesh(new THREE.IcosahedronGeometry(0.2 + r() * 0.06, 0), m[(r() * 3) | 0], x + (r() - 0.5) * 0.1, y, (r() - 0.5) * 0.1, g).scale.set(1.1, 0.7, 0.8);
  return g;
}
/* the district shop: a small board shop with its piazza, a zinc roof on posts over the front where people sit out of the sun. Front faces +z. */
export function districtShop(name = "DISTRICT SHOP", { wall = [214, 196, 150], roof = [140, 112, 88] } = {}) {
  const g = grp(),
    wt = T.plank(wall, 8, [3, 1]).clone();
  wt.needsUpdate = true;
  wt.repeat.set(3, 1);
  const wm = std(wt, 0.9);
  box(6, 3, 4, wm, 0, 1.5, 0, g);
  box(6.2, 0.15, 2.6, solid(0x8a8478, 1), 0, 0.075, 3.3, g);
  for (const x of [-2.9, 0, 2.9]) box(0.12, 2.8, 0.12, M.woodDark, x, 1.4, 4.45, g);
  const zt = T.zinc(roof).clone();
  zt.needsUpdate = true;
  zt.repeat.set(3, 1);
  const pr = box(6.6, 0.06, 2.9, std(zt, 0.7), 0, 2.95, 3.2, g);
  pr.rotation.x = 0.14;
  const rf = box(6.6, 0.06, 4.6, std(zt, 0.7), 0, 3.35, 0, g);
  rf.rotation.x = 0.1;
  box(2.2, 1.6, 0.06, M.black, -1.3, 1.6, 2.02, g);
  box(1.0, 2.1, 0.06, solid(0x2f4a5a, 0.8), 1.6, 1.05, 2.02, g);
  box(2.4, 0.1, 0.4, M.woodPale, -1.3, 0.9, 2.2, g);
  const sign = textPlane(name, 3.6, 0.45, "#e8dcb4", "#2a3a2a");
  sign.position.set(0, 2.55, 2.06);
  g.add(sign);
  for (const [x, c] of [[-2.0, 0xc8a030], [-1.6, 0x8a5a34], [-1.2, 0x6a8a3a]]) mesh(new THREE.SphereGeometry(0.06, 6, 5), flat(c), x, 1.0, 2.25, g);
  return g;
}
/* a small square table for dominoes, with the tiles laid out on it (men played dominoes on shop piazzas across Jamaica) */
export function dominoTable() {
  const g = grp(),
    m = solid(0x6a4a32, 0.85);
  for (const [x, z] of [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]]) box(0.05, 0.72, 0.05, m, x, 0.36, z, g);
  box(0.8, 0.04, 0.8, m, 0, 0.74, 0, g);
  const r = rng(9);
  for (let i = 0; i < 9; i++) {
    const t = box(0.05, 0.012, 0.1, solid(0xf2eee2, 0.5), -0.25 + i * 0.06, 0.766, (r() - 0.5) * 0.3, g);
    t.rotation.y = r() < 0.5 ? 0 : Math.PI / 2;
  }
  return g;
}
/* a wooden electricity pole with a cross-arm and white insulators (country districts were brought onto the electricity supply over the 1950s and 60s) */
export function powerPole(h = 7) {
  const g = grp();
  cyl(0.11, 0.14, h, M.woodDark, 0, h / 2, 0, g, 7);
  box(1.4, 0.09, 0.09, M.woodDark, 0, h - 0.4, 0, g);
  for (const x of [-0.55, 0, 0.55]) cyl(0.035, 0.035, 0.14, solid(0xe8e8e0, 0.4), x, h - 0.3, 0, g, 6);
  return g;
}
/* the hillside rising behind a place: a curved slope of earth and grass with clumps of bush on it. It starts at z = 0 and rises toward -z. */
export function hillside(w = 70, depth = 50, rise = 18, seed = 6) {
  const g = grp(),
    r = rng(seed),
    geo = new THREE.PlaneGeometry(w, depth, 28, 14);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      z = p.getZ(i) - depth / 2,
      k = Math.min(1, -z / depth);
    p.setZ(i, z);
    p.setY(i, Math.pow(k, 0.8) * rise + Math.sin(x * 0.21 + seed) * 1.2 * k + Math.sin(x * 0.07) * 2.5 * k);
  }
  geo.computeVertexNormals();
  mesh(geo, std(T.grass([10, 8], [86, 118, 60]), 1), 0, -0.05, 0, g);
  for (let i = 0; i < 40; i++) {
    const x = (r() - 0.5) * w,
      z = -2 - r() * (depth - 4),
      k = -z / depth,
      y = Math.pow(k, 0.8) * rise + Math.sin(x * 0.21 + seed) * 1.2 * k + Math.sin(x * 0.07) * 2.5 * k,
      s = 0.8 + r() * 1.6;
    mesh(new THREE.IcosahedronGeometry(s, 0), flat([0x2f6a35, 0x3a7a3a, 0x285d30, 0x4a7a3a][i % 4]), x, y + s * 0.5, z, g);
  }
  return g;
}

/* a 1940s electric portal crane on a quay, as at Kingston and Tilbury: four legs braced into a portal that straddles the quay rails on
   wheeled bogies, a slewing house with a cab and its windows, a counterweight at the back, and a lattice jib out over the water (-z) with
   its cable and hook. Legs stand at x = +-2.6, z = +-2.5. */
function strut(parent, a, b, m, r) {
  const p = new THREE.Vector3(...a),
    q = new THREE.Vector3(...b),
    d = q.clone().sub(p),
    o = box(r, d.length(), r, m, ...p.clone().add(q).multiplyScalar(0.5).toArray(), parent);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return o;
}
export function portalCrane() {
  const g = grp(),
    steel = solid(0x4e4a44, 0.7, 0.3),
    paint = solid(0x6a5a46, 0.75),
    glassM = solid(0x2b3a40, 0.25, 0.2),
    H = 8.6;
  // the portal: legs, bogies with wheels on the rails, top girders, cross bracing in each frame
  for (const dx of [-2.6, 2.6])
    for (const dz of [-2.5, 2.5]) {
      strut(g, [dx, 0.55, dz], [dx * 0.9, H, dz * 0.9], steel, 0.32);
      box(0.6, 0.45, 1.2, steel, dx, 0.32, dz, g);
      for (const w of [-0.38, 0.38]) cyl(0.22, 0.22, 0.16, M.black, dx, 0.22, dz + w, g, 12).rotation.z = Math.PI / 2;
    }
  for (const dz of [-2.25, 2.25]) box(5.2, 0.5, 0.4, steel, 0, H, dz, g);
  for (const dx of [-2.35, 2.35]) box(0.4, 0.5, 4.9, steel, dx, H, 0, g);
  for (const dx of [-2.5, 2.5]) {
    strut(g, [dx, 1.2, -2.4], [dx * 0.92, H - 0.4, 2.3], steel, 0.12);
    strut(g, [dx, 1.2, 2.4], [dx * 0.92, H - 0.4, -2.3], steel, 0.12);
  }
  for (const dz of [-2.45, 2.45]) {
    strut(g, [-2.5, H - 2.6, dz], [0, H - 0.3, dz], steel, 0.12);
    strut(g, [2.5, H - 2.6, dz], [0, H - 0.3, dz], steel, 0.12);
  }
  // the slewing house: a turntable, the machinery house, the cab at the front with windows, the counterweight behind
  cyl(1.6, 1.6, 0.4, steel, 0, H + 0.45, 0, g, 18);
  box(3.0, 2.4, 3.6, paint, 0, H + 1.85, 0.6, g);
  const roof = box(3.2, 0.15, 3.8, M.slate, 0, H + 3.12, 0.6, g);
  box(2.2, 2.0, 1.4, paint, 0, H + 1.65, -1.75, g);
  box(2.0, 0.8, 0.06, glassM, 0, H + 2.0, -2.46, g);
  for (const s of [-1, 1]) box(0.06, 0.8, 1.0, glassM, s * 1.11, H + 2.0, -1.75, g);
  box(2.4, 1.6, 1.1, solid(0x3a3834, 0.8), 0, H + 1.6, 2.95, g);
  // the lattice jib: two top chords and a bottom chord, laced, from a heel by the cab out over the water
  const heel = [0, H + 1.2, -2.2],
    len = 12,
    ang = 0.75,
    tip = [0, heel[1] + Math.sin(ang) * len, heel[2] - Math.cos(ang) * len];
  const at = (u, dx, dy) => [dx * (1 - u * 0.75), heel[1] + (tip[1] - heel[1]) * u + dy * (1 - u * 0.6), heel[2] + (tip[2] - heel[2]) * u];
  for (const dx of [-0.55, 0.55]) strut(g, at(0, dx, 0.5), at(1, dx, 0.5), steel, 0.12);
  strut(g, at(0, 0, -0.4), at(1, 0, -0.4), steel, 0.12);
  for (let i = 0; i < 12; i++) {
    const u0 = i / 12,
      u1 = (i + 1) / 12;
    for (const dx of [-0.55, 0.55]) strut(g, at(u0, dx, 0.5), at(u1, 0, -0.4), steel, 0.05);
    strut(g, at(u1, -0.55, 0.5), at(u1, 0.55, 0.5), steel, 0.05);
  }
  // the jib's luffing rope from the house top to the tip, the hoist cable down, the hook block and hook
  const rope = solid(0x2b2d31, 0.6);
  strut(g, [0, H + 3.2, 0.2], tip, rope, 0.035);
  const hookY = 3.2;
  strut(g, tip, [0, hookY + 0.5, tip[2]], rope, 0.025);
  box(0.35, 0.5, 0.25, solid(0xb0872a, 0.6), 0, hookY + 0.25, tip[2], g);
  const hook = mesh(new THREE.TorusGeometry(0.14, 0.03, 5, 10, Math.PI * 1.4), steel, 0, hookY - 0.1, tip[2], g);
  hook.rotation.z = Math.PI * 0.8;
  return g;
}
/* a stack of cargo on a quay (about 2.8 by 2 m): slatted crates with stencilled marks, rope-bound bales and sacks */
export function cargoStack(seed = 1, marks = ["KINGSTON", "JAMAICA", "LONDON"]) {
  const g = grp(),
    r = rng(seed),
    wood = [0x8a6a42, 0x9a7a4c, 0x7a5c3a];
  const crate = (x, y, z, s, k) => {
    const c = grp(g, x, y, z),
      m = solid(wood[k % 3], 0.95),
      dk = solid(0x5a4228, 0.95);
    box(s * 0.96, s * 0.96, s * 0.96, dk, 0, s / 2, 0, c);
    for (let i = 0; i < 4; i++) {
      const yy = s * (0.12 + i * 0.25);
      for (const sg of [-1, 1]) {
        box(s, s * 0.18, 0.025, m, 0, yy, (sg * s) / 2, c);
        box(0.025, s * 0.18, s, m, (sg * s) / 2, yy, 0, c);
      }
    }
    for (const a of [-1, 1]) for (const b of [-1, 1]) box(0.06, s, 0.06, m, (a * s) / 2, s / 2, (b * s) / 2, c);
    box(s, 0.025, s, m, 0, s, 0, c);
    const lab = textPlane(marks[k % marks.length], s * 0.7, s * 0.16, "#b28a58", "#2a2018");
    lab.position.set(0, s * 0.55, s / 2 + 0.02);
    c.add(lab);
  };
  const bale = (x, y, z, k) => {
    const b = grp(g, x, y, z);
    box(0.9, 0.55, 0.6, solid([0xc8b48a, 0xb8a47a][k % 2], 1), 0, 0.275, 0, b);
    for (const dx of [-0.28, 0.28]) box(0.035, 0.57, 0.62, M.rope, dx, 0.275, 0, b);
  };
  const sack = (x, z, k) => {
    const s = mesh(new THREE.SphereGeometry(0.3, 10, 7), solid([0xb09a6a, 0xa48e60][k % 2], 1), x, 0.16, z, g);
    s.scale.set(1.25, 0.55, 0.85);
    s.rotation.y = r() * 2;
  };
  crate(-0.75, 0, -0.45, 0.9, seed);
  crate(0.25, 0, -0.45, 0.9, seed + 1);
  crate(-0.3, 0.9, -0.45, 0.8, seed + 2);
  bale(0.95, 0, 0.45, seed);
  bale(0.95, 0.55, 0.45, seed + 1);
  for (let i = 0; i < 2; i++) sack(-0.9 + i * 0.62, 0.55, i + seed);
  return g;
}

/* ---------- a 2018 community centre ---------- */
const coolerBlue = () => new THREE.MeshStandardMaterial({ color: 0x6aa0d0, roughness: 0.15, transparent: true, opacity: 0.75 });
/* a water cooler: a white stand with a blue bottle upside down on top */
export function waterCooler() {
  const g = grp(),
    b = coolerBlue();
  box(0.32, 0.95, 0.32, solid(0xe8e8e4, 0.5), 0, 0.475, 0, g);
  box(0.26, 0.04, 0.05, M.steel, 0, 0.62, 0.17, g);
  cyl(0.13, 0.13, 0.36, b, 0, 1.17, 0, g, 14);
  cyl(0.05, 0.13, 0.04, b, 0, 0.97, 0, g, 14);
  return g;
}
/* a wall rack of leaflets: three tiers of pockets, each with bright leaflets; it hangs on a wall, facing +z */
export function leafletRack(seed = 1) {
  const g = grp(),
    r = rng(seed);
  box(0.9, 0.95, 0.04, solid(0xd8dcd8, 0.4), 0, 0, 0, g);
  const cols = ["#d8423a", "#f2c14a", "#3a8ac8", "#5aa860", "#e88ab0", "#f2efe2"],
    words = ["HELP", "RIGHTS", "HOUSING", "BENEFITS", "HEALTH", "CLUBS"];
  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 3; i++) {
      const p = notice(words[(row * 3 + i + seed) % 6], 0.24, 0.3, cols[(r() * cols.length) | 0], "#1f2a2e");
      p.position.set(-0.29 + i * 0.29, 0.28 - row * 0.3, 0.04);
      g.add(p);
      box(0.27, 0.12, 0.03, solid(0xc8d4d4, 0.2), -0.29 + i * 0.29, 0.18 - row * 0.3, 0.06, g);
    }
  return g;
}
/* a printed poster in a clip frame, facing +z */
export function poster(title, w = 0.6, h = 0.85, bg = "#2f5a6a", fg = "#f2efe2") {
  const g = grp();
  box(w + 0.03, h + 0.03, 0.015, solid(0xc8ccc8, 0.3, 0.4), 0, 0, 0, g);
  const p = notice(title, w, h, bg, fg);
  p.position.z = 0.01;
  g.add(p);
  return g;
}
export function wallClock() {
  const g = grp();
  cyl(0.18, 0.18, 0.05, M.black, 0, 0, 0, g, 20).rotation.x = Math.PI / 2;
  mesh(new THREE.CircleGeometry(0.16, 20), solid(0xf2efe2, 0.6), 0, 0, 0.027, g);
  box(0.012, 0.11, 0.005, M.black, 0, 0.045, 0.032, g);
  box(0.012, 0.08, 0.005, M.black, 0.03, -0.01, 0.033, g).rotation.z = -1.2;
  return g;
}
