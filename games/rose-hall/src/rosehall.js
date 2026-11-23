/* The things Rose Hall, the church, the archives and the estate are furnished with. Each builder returns a THREE.Group standing on y = 0
   at its own origin, facing +z. What follows a source and what is a general picture is in docs/games/rose-hall.md ("Places").
   Candles: a fixture marks where each flame burns (flameAt); the place gathers the marks of a room into one set of points (flameSet), so a
   room full of candles is one draw call that can be put out and lit again. */
import * as THREE from "three";
import { vessel } from "../../../engine/vessel.js";
import { candleSet } from "../../../engine/flame.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { T, cv, std, solid, flat, mesh, box, cyl, plane, grp, rng } from "./gfx.js";

export const MAHOG = solid(0x4a2418, 0.45),
  MAHOG_DARK = solid(0x321710, 0.5),
  BRASS = solid(0xb8963c, 0.35, 0.8),
  GILT = solid(0xb08a34, 0.4, 0.7),
  SILVER = solid(0xc9c9c2, 0.3, 0.85),
  WAX = solid(0xe9e2cc, 0.6),
  WHITE = solid(0xe8e2d0, 0.9),
  MARBLE = solid(0xf2f0ea, 0.5),
  SLATE = solid(0x3a3d42, 0.7),
  IRON = solid(0x2b2d31, 0.6, 0.3),
  STEEL = solid(0x8f948f, 0.5, 0.4),
  BLACK = new THREE.MeshBasicMaterial({ color: 0x050505 });
const lathe = (pts, m, seg = 14) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), m);
const at = (o, x, y, z) => {
  o.position.set(x, y, z);
  return o;
};
const still = (o) => {
  o.traverse((n) => (n.userData.noBatch = true));
  return o;
};
const quiet = (o) => {
  o.traverse((n) => {
    n.userData.noBatch = true;
  });
  return o;
};

/* ---------- candles ---------- */
export function flameAt(parent, x, y, z, set = "a") {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  o.userData.flame = set;
  parent.add(o);
  return o;
}
/* gather every flame mark under root into one set of glowing points per name. Returns { name: points }, each with userData.on(lit). */
export function flameSets(root) {
  root.updateMatrixWorld(true);
  const by = {},
    v = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.userData.flame) return;
    o.getWorldPosition(v);
    (by[o.userData.flame] ||= []).push(v.x, v.y, v.z);
  });
  const out = {};
  for (const [name, pos] of Object.entries(by)) {
    const set = candleSet(pos);   /* a real candle flame on each (engine/flame.js), still a few draw calls for the room; it was a glowing dot */
    root.add(set);
    out[name] = set;
  }
  return out;
}
let glowTex;
const glowMap = () =>
  glowTex ||
  (glowTex = cv(128, 128, (x) => {
    const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0, "rgba(255,214,150,0.85)");
    g.addColorStop(0.35, "rgba(255,170,80,0.32)");
    g.addColorStop(1, "rgba(255,140,40,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
  }));
/* a pool of candlelight on a wall, a table or the floor: flat, additive, kept out of the merge so a room can go dark */
export function glowPool(r = 1.2, strength = 0.55) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2 * r, 2 * r), new THREE.MeshBasicMaterial({ map: glowMap(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: strength }));
  m.userData.noBatch = true;
  return m;
}
/* a single candle in a brass stick */
export function candlestick(set = "a", tall = 0.22) {
  const g = grp();
  g.add(lathe([[0.06, 0], [0.065, 0.012], [0.02, 0.03], [0.014, 0.1], [0.024, 0.11], [0.012, 0.12]], BRASS, 10));
  cyl(0.012, 0.012, tall, WAX, 0, 0.12 + tall / 2, 0, g, 6);
  flameAt(g, 0, 0.16 + tall, 0, set);
  return g;
}
/* a branched candlestick for a table or a sideboard */
export function candelabrum(set = "a", arms = 3) {
  const g = grp();
  g.add(lathe([[0.09, 0], [0.095, 0.015], [0.03, 0.04], [0.018, 0.2], [0.03, 0.22], [0.014, 0.24], [0.014, 0.4]], SILVER, 10));
  for (let i = 0; i < arms; i++) {
    const a = (i / arms) * Math.PI * 2,
      x = Math.sin(a) * 0.17,
      z = Math.cos(a) * 0.17;
    const arm = cyl(0.008, 0.008, 0.18, SILVER, x / 2, 0.36, z / 2, g, 5);
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = -a + Math.PI / 2;
    cyl(0.022, 0.012, 0.03, SILVER, x, 0.375, z, g, 8);
    cyl(0.01, 0.01, 0.16, WAX, x, 0.47, z, g, 6);
    flameAt(g, x, 0.59, z, set);
  }
  cyl(0.022, 0.012, 0.03, SILVER, 0, 0.415, 0, g, 8);
  cyl(0.01, 0.01, 0.16, WAX, 0, 0.51, 0, g, 6);
  flameAt(g, 0, 0.63, 0, set);
  return g;
}
/* a brass chandelier on a chain: its ring hangs at y = 0, the chain runs up `drop` metres to the ceiling */
export function chandelier(set = "a", n = 8, R = 0.55, drop = 1.2) {
  const g = grp();
  cyl(0.012, 0.012, drop, BRASS, 0, drop / 2 + 0.2, 0, g, 5);
  cyl(0.09, 0.06, 0.05, BRASS, 0, drop + 0.2, 0, g, 10);
  g.add(lathe([[0.001, -0.22], [0.06, -0.18], [0.11, -0.08], [0.05, 0.02], [0.03, 0.12], [0.06, 0.2], [0.02, 0.24]], BRASS, 12));
  const ring = mesh(new THREE.TorusGeometry(R, 0.014, 5, 24), BRASS, 0, 0, 0, g);
  ring.rotation.x = Math.PI / 2;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2,
      x = Math.sin(a) * R,
      z = Math.cos(a) * R;
    const arm = cyl(0.008, 0.008, R, BRASS, x / 2, 0, z / 2, g, 5);
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = -a + Math.PI / 2;
    cyl(0.03, 0.014, 0.03, BRASS, x, 0.03, z, g, 8);
    cyl(0.011, 0.011, 0.15, WAX, x, 0.12, z, g, 6);
    flameAt(g, x, 0.24, z, set);
  }
  return g;
}
/* a wall sconce: a gilt back plate with a little mirror, one arm, one candle. It stands out from the wall along +z. */
export function sconce(set = "a") {
  const g = grp();
  box(0.16, 0.34, 0.02, GILT, 0, 0, 0.01, g);
  box(0.11, 0.22, 0.012, solid(0x9fb0b4, 0.15, 0.9), 0, 0.03, 0.022, g);
  cyl(0.008, 0.008, 0.16, GILT, 0, -0.1, 0.09, g, 5).rotation.x = Math.PI / 2;
  cyl(0.026, 0.014, 0.03, GILT, 0, -0.085, 0.17, g, 8);
  cyl(0.011, 0.011, 0.14, WAX, 0, 0, 0.17, g, 6);
  flameAt(g, 0, 0.11, 0.17, set);
  return g;
}

/* ---------- mahogany furniture of about 1800 to 1820 (a general picture: none copies a piece at Rose Hall) ---------- */
const leg = (g, x, z, h, m = MAHOG, r = 0.028) => g.add(at(lathe([[r * 0.6, 0], [r * 0.75, h * 0.12], [r * 0.55, h * 0.2], [r, h * 0.82], [r * 1.2, h * 0.9], [r * 1.2, h]], m, 8), x, 0, z));
/* a long dining table on two pillars with claw feet */
export function diningTable(L = 4.2, W = 1.25, h = 0.76) {
  const g = grp();
  box(L, 0.045, W, MAHOG, 0, h - 0.022, 0, g);
  box(L - 0.12, 0.07, W - 0.12, MAHOG_DARK, 0, h - 0.08, 0, g);
  for (const px of [-L * 0.28, L * 0.28]) {
    const p = lathe([[0.06, 0.16], [0.11, 0.24], [0.06, 0.34], [0.085, 0.5], [0.07, h - 0.11]], MAHOG_DARK, 10);
    p.position.x = px;
    g.add(p);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4,
        f = box(0.5, 0.06, 0.07, MAHOG_DARK, px + Math.sin(a) * 0.24, 0.12, Math.cos(a) * 0.24, g);
      f.rotation.y = a - Math.PI / 2;
      f.rotation.z = 0.0;
      box(0.08, 0.1, 0.08, BRASS, px + Math.sin(a) * 0.46, 0.05, Math.cos(a) * 0.46, g);
    }
  }
  return g;
}
/* a dining chair: turned front legs, swept back legs, a pierced splat, a pale seat */
export function diningChair(seat = 0xd9cfae) {
  const g = grp();
  for (const x of [-0.2, 0.2]) {
    leg(g, x, 0.2, 0.44);
    box(0.04, 0.95, 0.045, MAHOG, x, 0.475, -0.2, g).rotation.x = -0.06;
  }
  box(0.46, 0.05, 0.44, MAHOG, 0, 0.44, 0, g);
  box(0.42, 0.05, 0.4, solid(seat, 0.9), 0, 0.475, 0.005, g);
  box(0.46, 0.07, 0.035, MAHOG, 0, 0.93, -0.228, g);
  box(0.12, 0.42, 0.02, MAHOG, 0, 0.69, -0.215, g);
  box(0.4, 0.035, 0.03, MAHOG, 0, 0.5, -0.21, g);
  return g;
}
/* a sideboard on six tapered legs, with decanters, a silver tray and a covered dish */
export function sideboard(w = 2.3, set = "a") {
  const g = grp();
  for (const x of [-w / 2 + 0.06, -w / 6, w / 6, w / 2 - 0.06]) for (const z of [-0.24, 0.24]) box(0.05, 0.5, 0.05, MAHOG_DARK, x, 0.25, z, g);
  box(w, 0.42, 0.6, MAHOG, 0, 0.7, 0, g);
  box(w + 0.04, 0.03, 0.64, MAHOG_DARK, 0, 0.925, 0, g);
  for (const x of [-w / 3, 0, w / 3]) {
    box(w / 3 - 0.06, 0.3, 0.01, MAHOG_DARK, x, 0.7, 0.302, g);
    for (const s of [-0.12, 0.12]) mesh(new THREE.SphereGeometry(0.016, 6, 5), BRASS, x + s, 0.7, 0.315, g);
  }
  const top = 0.94;
  const tray = cyl(0.2, 0.2, 0.012, SILVER, -w * 0.28, top + 0.006, 0, g, 16);
  tray.scale.z = 0.7;
  const glass = solid(0x7a2a22, 0.2, 0.1),
    clear = solid(0xcfd8d4, 0.15, 0.2);
  for (const [dx, m] of [[-0.08, glass], [0.08, clear]]) {
    const d = lathe([[0.001, 0], [0.05, 0.005], [0.055, 0.12], [0.02, 0.17], [0.016, 0.22], [0.024, 0.23]], m, 10);
    d.position.set(-w * 0.28 + dx, top + 0.012, 0);
    g.add(d);
    mesh(new THREE.SphereGeometry(0.018, 6, 5), clear, -w * 0.28 + dx, top + 0.26, 0, g);
  }
  /* a silver dish cover on its platter: a dome with a knob, shown whole from every side */
  const dish = grp(g, w * 0.28, top, 0);
  cyl(0.2, 0.2, 0.01, SILVER, 0, 0.005, 0, dish, 20).scale.z = 0.75;
  const dome = lathe([[0.16, 0.01], [0.158, 0.03], [0.14, 0.08], [0.1, 0.12], [0.05, 0.14], [0.001, 0.145]], SILVER, 20);
  dome.scale.z = 0.75;
  dish.add(dome);
  mesh(new THREE.SphereGeometry(0.018, 8, 6), SILVER, 0, 0.16, 0, dish);
  const c = candelabrum(set, 3);
  c.position.set(0, top, -0.05);
  g.add(c);
  return g;
}
/* plates, glasses and a centre bowl laid along a table top of length L at height h */
export function tableSetting(L = 4.2, W = 1.25, h = 0.76, places = 4) {
  const g = grp(),
    china = solid(0xf0ece0, 0.4),
    glass = solid(0xcfd8d4, 0.15, 0.2);
  for (let i = 0; i < places; i++) {
    const x = -L / 2 + (L / places) * (i + 0.5);
    for (const s of [-1, 1]) {
      cyl(0.12, 0.09, 0.012, china, x, h + 0.006, s * (W / 2 - 0.22), g, 14);
      const gl = lathe([[0.03, 0], [0.006, 0.01], [0.006, 0.06], [0.03, 0.09], [0.034, 0.14]], glass, 8);
      gl.position.set(x + 0.17, h, s * (W / 2 - 0.3));
      g.add(gl);
      box(0.012, 0.004, 0.17, SILVER, x - 0.16, h + 0.002, s * (W / 2 - 0.22), g);
    }
  }
  const bowl = lathe([[0.04, 0], [0.05, 0.04], [0.02, 0.06], [0.16, 0.14], [0.18, 0.15]], SILVER, 14);
  bowl.position.y = h;
  g.add(bowl);
  const r = rng(7);
  for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(0.035, 6, 5), solid([0xd9a03a, 0xc85a2a, 0x8aa040][i % 3], 0.7), (r() - 0.5) * 0.2, h + 0.15 + r() * 0.05, (r() - 0.5) * 0.2, g);
  return g;
}
/* a tall case clock */
export function longCaseClock() {
  const g = grp();
  box(0.5, 0.5, 0.3, MAHOG, 0, 0.25, 0, g);
  box(0.38, 1.05, 0.24, MAHOG, 0, 1.02, 0, g);
  box(0.22, 0.7, 0.01, MAHOG_DARK, 0, 1.05, 0.122, g);
  box(0.52, 0.52, 0.3, MAHOG, 0, 1.8, 0, g);
  const face = plane(0.36, 0.36, std(T.clock(), 0.6), 0, 1.8, 0.152, g);
  box(0.56, 0.05, 0.34, MAHOG_DARK, 0, 2.08, 0, g);
  for (const s of [-1, 1]) mesh(new THREE.SphereGeometry(0.035, 8, 6), BRASS, s * 0.22, 2.14, 0, g);
  mesh(new THREE.SphereGeometry(0.04, 8, 6), BRASS, 0, 2.2, 0, g).scale.y = 1.6;
  box(0.06, 0.1, 0.06, MAHOG_DARK, 0, 2.13, 0, g);
  return g;
}
let stripe;
const stripeMat = (a = "#6f8a80", b = "#d9d2b8") =>
  std(
    stripe ||
      (stripe = cv(64, 64, (x) => {
        x.fillStyle = b;
        x.fillRect(0, 0, 64, 64);
        x.fillStyle = a;
        for (let i = 0; i < 4; i++) x.fillRect(i * 16, 0, 8, 64);
      }, [4, 1])),
    0.95,
  );
/* a sofa with scroll ends and striped cloth */
export function sofa(L = 1.9) {
  const g = grp(),
    up = stripeMat();
  for (const x of [-L / 2 + 0.08, L / 2 - 0.08]) for (const z of [-0.26, 0.26]) leg(g, x, z, 0.2, MAHOG_DARK, 0.03);
  box(L, 0.1, 0.66, MAHOG, 0, 0.25, 0, g);
  box(L - 0.16, 0.14, 0.58, up, 0, 0.37, 0.02, g);
  box(L, 0.55, 0.1, up, 0, 0.66, -0.28, g).rotation.x = -0.12;
  box(L + 0.02, 0.05, 0.12, MAHOG, 0, 0.95, -0.315, g);
  for (const s of [-1, 1]) {
    box(0.1, 0.3, 0.6, up, s * (L / 2 - 0.05), 0.5, 0, g);
    const scroll = cyl(0.09, 0.09, 0.6, MAHOG, s * (L / 2 - 0.02), 0.68, 0, g, 10);
    scroll.rotation.x = Math.PI / 2;
  }
  return g;
}
export function armchair() {
  const g = sofa(0.72);
  return g;
}
/* a square pianoforte of about 1815: a long shallow case on six legs, the keys at one end of the front, a music desk */
export function pianoforte() {
  const g = grp();
  for (const x of [-0.78, 0, 0.78]) for (const z of [-0.26, 0.26]) leg(g, x, z, 0.58, MAHOG_DARK, 0.032);
  box(1.72, 0.24, 0.66, MAHOG, 0, 0.7, 0, g);
  box(1.76, 0.03, 0.7, MAHOG_DARK, 0, 0.835, 0, g);
  box(0.9, 0.02, 0.12, solid(0xeee6cc, 0.5), -0.3, 0.72, 0.36, g);
  box(0.94, 0.05, 0.14, MAHOG_DARK, -0.3, 0.685, 0.36, g);
  for (let i = 0; i < 12; i++) box(0.022, 0.012, 0.07, BLACK, -0.71 + i * 0.075, 0.736, 0.34, g);
  const desk = box(0.5, 0.26, 0.015, MAHOG, -0.3, 0.98, 0.08, g);
  desk.rotation.x = -0.25;
  box(0.34, 0.2, 0.004, solid(0xe7dcc2, 0.9), -0.3, 0.985, 0.092, g).rotation.x = -0.25;
  box(0.03, 0.13, 0.03, MAHOG_DARK, -0.3, 0.9, 0.03, g);
  const st = grp(g, -0.3, 0, 0.85);
  for (const x of [-0.14, 0.14]) for (const z of [-0.14, 0.14]) leg(st, x, z, 0.44, MAHOG_DARK, 0.022);
  cyl(0.2, 0.2, 0.07, stripeMat(), 0, 0.475, 0, st, 14);
  return g;
}
/* a round table on a pillar and three feet */
export function roundTable(r = 0.45, h = 0.72) {
  const g = grp();
  cyl(r, r, 0.03, MAHOG, 0, h - 0.015, 0, g, 20);
  g.add(lathe([[0.03, 0.14], [0.07, 0.2], [0.035, 0.3], [0.05, h - 0.08], [0.09, h - 0.03]], MAHOG_DARK, 10));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2,
      f = box(0.36, 0.05, 0.05, MAHOG_DARK, Math.sin(a) * 0.17, 0.1, Math.cos(a) * 0.17, g);
    f.rotation.y = a - Math.PI / 2;
    box(0.05, 0.08, 0.05, MAHOG_DARK, Math.sin(a) * 0.33, 0.04, Math.cos(a) * 0.33, g);
  }
  return g;
}
/* a looking glass in a gilt frame with a crest. It hangs flat on a wall, facing +z; origin at its middle. */
export function giltMirror(w = 1.1, h = 1.7) {
  const g = grp();
  box(w, h, 0.05, GILT, 0, 0, 0.025, g);
  box(w - 0.16, h - 0.16, 0.012, solid(0x93a4a8, 0.12, 0.95), 0, 0, 0.052, g);
  box(w * 0.6, 0.16, 0.05, GILT, 0, h / 2 + 0.08, 0.025, g);
  mesh(new THREE.SphereGeometry(0.09, 8, 6), GILT, 0, h / 2 + 0.2, 0.03, g).scale.z = 0.4;
  return g;
}
/* a carpet drawn in code: a border, a field and a middle medallion */
export function rug(w = 3, d = 2, field = "#6a2a26", border = "#c8b078") {
  const tex = cv(256, 256, (x) => {
    x.fillStyle = border;
    x.fillRect(0, 0, 256, 256);
    x.fillStyle = "#2f2a3a";
    x.fillRect(10, 10, 236, 236);
    x.fillStyle = field;
    x.fillRect(22, 22, 212, 212);
    x.strokeStyle = border;
    x.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      x.beginPath();
      x.ellipse(128, 128, 30 + i * 26, 30 + i * 26, 0, 0, 7);
      x.stroke();
    }
    x.fillStyle = border;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * 6.283;
      x.beginPath();
      x.arc(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96, 5, 0, 7);
      x.fill();
    }
    const dd = x.getImageData(0, 0, 256, 256);
    for (let i = 0; i < dd.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 18;
      dd.data[i] += n;
      dd.data[i + 1] += n;
      dd.data[i + 2] += n;
    }
    x.putImageData(dd, 0, 0);
  });
  const p = plane(w, d, std(tex, 1), 0, 0.008, 0);
  p.rotation.x = -Math.PI / 2;
  p.name = "terrain";
  return p;
}
/* a tall sash window in a deep wall, seen from inside and facing +z (into the room): the frame, the glazing bars over the pane, a sill,
   folded shutters and a pair of curtains under a pelmet. pane: the material behind the bars (night sea, night sky, bright day). */
export function sashWindow(w = 1.3, h = 2.6, pane, { curtain = 0x7a2f2a, drapes = true } = {}) {
  const g = grp();
  plane(w, h, pane, 0, h / 2, -0.2, g);
  for (const s of [-1, 1]) {
    box(0.07, h - 0.002, 0.3, WHITE, s * (w / 2 - 0.036), h / 2, -0.06, g);
    box(0.02, h - 0.16, 0.24, solid(0xd2cab4, 0.9), s * (w / 2 - 0.085), h / 2, -0.07, g);   /* shutters folded into the reveal */
  }
  box(w - 0.15, 0.07, 0.3, WHITE, 0, h - 0.036, -0.06, g);
  box(w + 0.24, 0.06, 0.16, WHITE, 0, -0.03, 0.081, g);
  for (const s of [-1, 1]) box(0.03, h, 0.03, WHITE, s * (w / 6), h / 2, -0.18, g);
  for (let i = 1; i < 4; i++) box(w, i === 2 ? 0.06 : 0.03, 0.03, WHITE, 0, (h * i) / 4, -0.18, g);
  if (drapes) {
    const cm = solid(curtain, 1);
    box(w + 0.6, 0.22, 0.12, cm, 0, h + 0.2, 0.12, g);
    box(w + 0.66, 0.04, 0.14, GILT, 0, h + 0.33, 0.12, g);
    for (const s of [-1, 1]) {
      const d = box(0.3, h + 0.1, 0.1, cm, s * (w / 2 + 0.2), h / 2 + 0.05, 0.12, g);
      d.scale.x = 1;
      box(0.34, 0.05, 0.12, GILT, s * (w / 2 + 0.2), h * 0.42, 0.12, g);
    }
  }
  return g;
}
/* the night seen from a lit room: stars, a low moon, its path on the sea (sea = true) or dark hills (sea = false) */
const NIGHT = {};
export function nightPane(sea = true) {
  return (
    NIGHT[sea] ||
    (NIGHT[sea] = new THREE.MeshBasicMaterial({
      map: cv(128, 256, (x, w, h) => {
        const g = x.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#0a1024");
        g.addColorStop(0.62, "#1c2a4a");
        g.addColorStop(0.63, sea ? "#0e1a30" : "#0a120e");
        g.addColorStop(1, sea ? "#060c18" : "#050806");
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
        const r = rng(sea ? 5 : 9);
        x.fillStyle = "#dfe6ff";
        for (let i = 0; i < 46; i++) x.fillRect(r() * w, r() * h * 0.6, 1.4, 1.4);
        if (sea) {
          x.fillStyle = "#f2edd2";
          x.beginPath();
          x.arc(84, 96, 9, 0, 7);
          x.fill();
          for (let i = 0; i < 30; i++) {
            const y = h * 0.635 + i * 3;
            x.fillStyle = `rgba(230,225,190,${0.5 - i * 0.015})`;
            x.fillRect(84 - 4 - i * 0.9 + (r() - 0.5) * 8, y, 8 + i * 1.8, 1.4);
          }
        } else {
          x.fillStyle = "#070c09";
          x.beginPath();
          x.moveTo(0, h * 0.63);
          for (let i = 0; i <= 8; i++) x.lineTo((i / 8) * w, h * (0.63 - 0.05 - r() * 0.07));
          x.lineTo(w, h * 0.63);
          x.fill();
        }
      }),
    }))
  );
}
/* daylight in a window: a bright sky, the tops of trees */
let dayM;
export function dayPane() {
  return (
    dayM ||
    (dayM = new THREE.MeshBasicMaterial({
      map: cv(128, 256, (x, w, h) => {
        const g = x.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#bfe0f2");
        g.addColorStop(0.7, "#eef4ee");
        g.addColorStop(1, "#dfe8d8");
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
        const r = rng(4);
        for (let i = 0; i < 26; i++) {
          x.fillStyle = ["#6f9a5a", "#88ad68", "#5d8a52"][i % 3];
          x.beginPath();
          x.arc(r() * w, h * (0.86 + r() * 0.16), 14 + r() * 16, 0, 7);
          x.fill();
        }
      }),
    }))
  );
}
/* A full-length portrait in oils of about 1770 to 1800, as hung in a Jamaican great house: an unnamed gentleman in the dress of the time
   (a skirted coat with deep cuffs, a waistcoat, breeches, white stockings, buckled shoes, a white stock, his own hair powdered and tied
   back), a curtain and a column behind him and a low landscape; the paint darkened by old varnish, with fine cracks. Nobody real is
   copied: Waddell (1830) saw "three or four full-size pictures" in the empty house and the game does not say whose they are.
   pose 1, 2 or 3 changes the stance and what he holds (a hat under the arm, a hand on a cane, a letter). A gilt frame with a moulding; flat on a wall, facing +z.
   The paintings Waddell saw are not known to survive. userData.show(lit) and userData.light(k) lift the gloom from it. */
export function portrait(w = 1.15, h = 2.0, coat = "#2f3a4a", seed = 1) {
  const g = grp(),
    r = rng(seed),
    pose = ((seed - 1) % 3) + 1;
  /* the frame: an outer gilt moulding, a dark inner step and a narrow gilt lip round the canvas */
  box(w, h, 0.06, GILT, 0, 0, 0.03, g);
  box(w + 0.05, 0.05, 0.08, GILT, 0, h / 2 + 0.005, 0.04, g);
  box(w + 0.05, 0.05, 0.08, GILT, 0, -h / 2 - 0.005, 0.04, g);
  for (const s of [-1, 1]) box(0.05, h + 0.05, 0.08, GILT, s * (w / 2 + 0.005), 0, 0.04, g);
  box(w - 0.08, h - 0.08, 0.02, solid(0x3a2a14, 0.6, 0.3), 0, 0, 0.062, g);
  box(w - 0.13, h - 0.13, 0.012, GILT, 0, 0, 0.07, g);
  const tex = cv(320, 560, (x, W, H) => {
    /* ground: warm umber going to near black, lighter behind the head */
    const bg = x.createRadialGradient(W * 0.45, H * 0.22, 10, W * 0.5, H * 0.45, H * 0.7);
    bg.addColorStop(0, "#4a3a24");
    bg.addColorStop(0.5, "#241a10");
    bg.addColorStop(1, "#0c0806");
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    /* a heavy curtain swept to one side, in folds */
    const side = pose === 2 ? -1 : 1,
      cx0 = side > 0 ? W * 0.62 : 0,
      cw = W * 0.38,
      drape = ["#5a1a14", "#2a3a22", "#4a3018"][(seed - 1) % 3];
    for (let i = 0; i < 9; i++) {
      const fx = cx0 + (i / 9) * cw,
        gr = x.createLinearGradient(fx, 0, fx + cw / 9, 0);
      gr.addColorStop(0, "rgba(0,0,0,0.55)");
      gr.addColorStop(0.5, drape);
      gr.addColorStop(1, "rgba(0,0,0,0.5)");
      x.fillStyle = gr;
      x.beginPath();
      x.moveTo(fx, 0);
      x.lineTo(fx + cw / 9, 0);
      x.lineTo(fx + cw / 9 + side * (i * 2), H * 0.62);
      x.lineTo(fx + side * (i * 2), H * 0.62);
      x.fill();
    }
    /* a column base on the other side, and a low landscape with a pale sky behind the figure */
    x.fillStyle = "rgba(120,100,70,0.35)";
    x.fillRect(side > 0 ? W * 0.04 : W * 0.78, H * 0.18, W * 0.16, H * 0.55);
    const sky = x.createLinearGradient(0, H * 0.5, 0, H * 0.68);
    sky.addColorStop(0, "rgba(150,140,100,0)");
    sky.addColorStop(0.6, "rgba(150,140,100,0.35)");
    sky.addColorStop(1, "rgba(60,70,40,0.5)");
    x.fillStyle = sky;
    x.fillRect(W * 0.18, H * 0.5, W * 0.5, H * 0.18);
    /* the floor */
    x.fillStyle = "#1a120a";
    x.fillRect(0, H * 0.86, W, H * 0.14);
    const cx = W * (0.47 + (r() - 0.5) * 0.04),
      leg = pose === 3 ? 0.035 : 0.05;
    /* stockings and shoes, one foot turned out */
    x.fillStyle = "#ddd6c4";
    for (const s of [-1, 1]) {
      x.beginPath();
      x.moveTo(cx + s * W * leg - W * 0.028, H * 0.66);
      x.lineTo(cx + s * W * leg + W * 0.028, H * 0.66);
      x.lineTo(cx + s * W * (leg + 0.012) + W * 0.016, H * 0.85);
      x.lineTo(cx + s * W * (leg + 0.012) - W * 0.016, H * 0.85);
      x.fill();
    }
    x.fillStyle = "#120c08";
    for (const s of [-1, 1]) x.fillRect(cx + s * W * (leg + 0.012) - W * 0.03 + (s > 0 ? W * 0.01 : 0), H * 0.848, W * 0.06, H * 0.016);
    x.fillStyle = "#c8b060";
    for (const s of [-1, 1]) x.fillRect(cx + s * W * (leg + 0.012) - W * 0.008, H * 0.849, W * 0.016, H * 0.007);   /* buckles */
    /* breeches */
    x.fillStyle = ["#cbb88e", "#2a2420", "#b8a27a"][(seed - 1) % 3];
    x.fillRect(cx - W * 0.09, H * 0.56, W * 0.18, H * 0.11);
    /* the coat: shoulders, a long body flaring to skirts, open over the waistcoat */
    const coatG = x.createLinearGradient(cx - W * 0.2, 0, cx + W * 0.2, 0);
    coatG.addColorStop(0, "#050404");
    coatG.addColorStop(0.35, coat);
    coatG.addColorStop(0.6, coat);
    coatG.addColorStop(1, "#060505");
    x.fillStyle = coatG;
    x.beginPath();
    x.moveTo(cx - W * 0.14, H * 0.25);
    x.quadraticCurveTo(cx, H * 0.235, cx + W * 0.14, H * 0.25);
    x.lineTo(cx + W * 0.17, H * 0.44);
    x.lineTo(cx + W * 0.21, H * 0.7);
    x.lineTo(cx + W * 0.02, H * 0.69);
    x.lineTo(cx, H * 0.5);
    x.lineTo(cx - W * 0.02, H * 0.69);
    x.lineTo(cx - W * 0.21, H * 0.7);
    x.lineTo(cx - W * 0.17, H * 0.44);
    x.closePath();
    x.fill();
    /* the waistcoat, buttoned, lighter, its skirts showing */
    x.fillStyle = ["#a8884a", "#d8d0b8", "#6a4a2a"][(seed - 1) % 3];
    x.beginPath();
    x.moveTo(cx - W * 0.045, H * 0.27);
    x.lineTo(cx + W * 0.045, H * 0.27);
    x.lineTo(cx + W * 0.06, H * 0.56);
    x.lineTo(cx, H * 0.6);
    x.lineTo(cx - W * 0.06, H * 0.56);
    x.fill();
    x.fillStyle = "rgba(220,200,140,0.7)";
    for (let i = 0; i < 8; i++) x.fillRect(cx - 2, H * (0.29 + i * 0.033), 4, 4);
    /* the arms: one to the hip or holding something, the other down; deep turned-back cuffs and a lace ruffle at each wrist */
    const arm = (sx, ex, ey) => {
      x.strokeStyle = coat;
      x.lineWidth = W * 0.065;
      x.lineCap = "round";
      x.beginPath();
      x.moveTo(cx + sx * W * 0.14, H * 0.28);
      x.lineTo(cx + ex * W, ey * H);
      x.stroke();
      x.fillStyle = "rgba(0,0,0,0.45)";
      x.fillRect(cx + ex * W - W * 0.04, ey * H - H * 0.03, W * 0.08, H * 0.035);
      x.fillStyle = "#e8e2d2";
      x.fillRect(cx + ex * W - W * 0.025, ey * H + H * 0.004, W * 0.05, H * 0.012);
      x.fillStyle = "#c49a7a";
      x.beginPath();
      x.arc(cx + ex * W, ey * H + H * 0.026, W * 0.022, 0, 7);
      x.fill();
    };
    if (pose === 1) {
      arm(-1, -0.2, 0.47);
      arm(1, 0.16, 0.42);
      x.fillStyle = "#0a0806";   /* a cocked hat held under the arm */
      x.beginPath();
      x.moveTo(cx - W * 0.28, H * 0.43);
      x.lineTo(cx - W * 0.13, H * 0.4);
      x.lineTo(cx - W * 0.17, H * 0.49);
      x.fill();
    } else if (pose === 2) {
      arm(-1, -0.17, 0.5);
      arm(1, 0.24, 0.5);
      x.strokeStyle = "#2a1a0e";   /* a cane to the floor */
      x.lineWidth = 4;
      x.beginPath();
      x.moveTo(cx + W * 0.25, H * 0.52);
      x.lineTo(cx + W * 0.3, H * 0.86);
      x.stroke();
      x.fillStyle = "#c8a850";
      x.beginPath();
      x.arc(cx + W * 0.25, H * 0.515, 5, 0, 7);
      x.fill();
    } else {
      arm(-1, -0.16, 0.55);
      arm(1, 0.1, 0.4);
      x.fillStyle = "#e6dcc0";   /* a folded letter in his hand */
      x.fillRect(cx + W * 0.1, H * 0.405, W * 0.08, H * 0.03);
    }
    /* the stock and the frill at the throat */
    x.fillStyle = "#ece6d6";
    x.fillRect(cx - W * 0.035, H * 0.225, W * 0.07, H * 0.035);
    x.beginPath();
    x.moveTo(cx - W * 0.025, H * 0.26);
    x.lineTo(cx + W * 0.025, H * 0.26);
    x.lineTo(cx, H * 0.31);
    x.fill();
    /* the head, lit from the upper left, turned a little; powdered hair rolled over the ears and tied back */
    const hx = cx + W * 0.005,
      hy = H * 0.18,
      face = x.createRadialGradient(hx - W * 0.03, hy - H * 0.01, 2, hx, hy, W * 0.085);
    face.addColorStop(0, "#e2c4a4");
    face.addColorStop(0.6, "#c09474");
    face.addColorStop(1, "#5a3c28");
    x.fillStyle = face;
    x.beginPath();
    x.ellipse(hx, hy, W * 0.062, H * 0.046, 0, 0, 7);
    x.fill();
    x.fillStyle = "rgba(60,36,24,0.45)";   /* the shadowed side of the face, and the eyes and mouth only as soft shadow */
    x.beginPath();
    x.ellipse(hx + W * 0.03, hy + H * 0.004, W * 0.03, H * 0.04, 0, 0, 7);
    x.fill();
    x.fillStyle = "rgba(50,30,20,0.5)";
    x.fillRect(hx - W * 0.032, hy - H * 0.008, W * 0.022, 3);
    x.fillRect(hx + W * 0.008, hy - H * 0.008, W * 0.022, 3);
    x.fillRect(hx - W * 0.014, hy + H * 0.024, W * 0.028, 2);
    const hair = x.createLinearGradient(hx - W * 0.07, 0, hx + W * 0.07, 0);
    hair.addColorStop(0, "#efeae0");
    hair.addColorStop(1, "#9a958a");
    x.fillStyle = hair;
    x.beginPath();
    x.ellipse(hx, hy - H * 0.03, W * 0.066, H * 0.025, 0, Math.PI, 0);
    x.fill();
    for (const s of [-1, 1]) {
      x.beginPath();
      x.ellipse(hx + s * W * 0.06, hy - H * 0.005, W * 0.016, H * 0.016, 0, 0, 7);
      x.fill();
    }
    /* old varnish: a warm yellow-brown glaze, a dark edge, fine cracks and grain */
    x.globalCompositeOperation = "multiply";
    x.fillStyle = "rgba(200,160,90,0.55)";
    x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = "source-over";
    const vig = x.createRadialGradient(W / 2, H * 0.4, H * 0.2, W / 2, H * 0.45, H * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.6)");
    x.fillStyle = vig;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(10,6,2,0.28)";
    x.lineWidth = 1;
    for (let i = 0; i < 140; i++) {
      let px = r() * W,
        py = r() * H;
      x.beginPath();
      x.moveTo(px, py);
      for (let k = 0; k < 3; k++) x.lineTo((px += (r() - 0.5) * 22), (py += (r() - 0.5) * 22));
      x.stroke();
    }
    const dd = x.getImageData(0, 0, W, H);
    for (let i = 0; i < dd.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 10;
      dd.data[i] += n;
      dd.data[i + 1] += n;
      dd.data[i + 2] += n;
    }
    x.putImageData(dd, 0, 0);
  });
  plane(w - 0.15, h - 0.15, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0 }), 0, 0, 0.078, g);   /* varnish has a soft shine */
  const gloom = plane(w - 0.15, h - 0.15, new THREE.MeshBasicMaterial({ color: 0x050403, transparent: true, opacity: 0.72 }), 0, 0, 0.082, g);
  quiet(gloom);
  g.userData.show = (lit) => (gloom.visible = !lit);
  g.userData.light = (k) => {   /* a candle raised to the painting: the dark lifts off it as k goes from 0 to 1 */
    gloom.visible = k < 1;
    gloom.material.opacity = 0.72 * (1 - k);
  };
  return g;
}
/* a brass post with a card on it, as a tour puts beside a thing it wants you to look at (today's, not the house's) */
export function tourSign(lines = ["THIS WAY"], w = 0.5, h = 0.34) {
  const g = grp();
  cyl(0.15, 0.17, 0.03, BRASS, 0, 0.015, 0, g, 14);
  cyl(0.018, 0.018, 1.05, BRASS, 0, 0.55, 0, g, 8);
  const b = box(w + 0.04, h + 0.04, 0.02, MAHOG_DARK, 0, 1.2, 0, g);
  b.rotation.x = -0.3;
  const tex = cv(384, Math.round((384 * h) / w), (x, W, H) => {
    x.fillStyle = "#efe6cc";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#2b2620";
    x.textAlign = "center";
    x.textBaseline = "middle";
    lines.forEach((t, i) => {
      x.font = (i ? "" : "bold ") + Math.round(H / (lines.length + 1.2)) + "px Georgia, serif";
      x.fillText(t, W / 2, (H * (i + 0.75)) / (lines.length + 0.5), W * 0.92);
    });
  });
  const p = plane(w, h, std(tex, 0.9), 0, 1.2, 0.012, g);
  p.rotation.x = -0.3;
  p.position.z = 0.012 * Math.cos(0.3);
  p.position.y = 1.2 + 0.012 * Math.sin(0.3);
  return g;
}
/* a red rope between two brass posts, L apart along x */
export function ropeBarrier(L = 2.2) {
  const g = grp();
  for (const s of [-1, 1]) {
    cyl(0.14, 0.16, 0.03, BRASS, (s * L) / 2, 0.015, 0, g, 12);
    cyl(0.02, 0.02, 0.95, BRASS, (s * L) / 2, 0.49, 0, g, 8);
    mesh(new THREE.SphereGeometry(0.04, 8, 6), BRASS, (s * L) / 2, 0.98, 0, g);
  }
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = -L / 2 + (L * i) / n,
      b = -L / 2 + (L * (i + 1)) / n,
      sag = (x) => 0.9 - 0.16 * (1 - (2 * x / L) ** 2),
      ya = sag(a),
      yb = sag(b),
      c = cyl(0.018, 0.018, Math.hypot(b - a, yb - ya), solid(0x8a1f24, 0.9), (a + b) / 2, (ya + yb) / 2, 0, g, 6);
    c.rotation.z = Math.PI / 2 + Math.atan2(yb - ya, b - a);
  }
  return g;
}
/* a small folded card that the player sets beside a thing: LEGEND (red) or RECORD (green). Hidden until the thing is looked at. */
const TAGS = {};
export function tag(kind = "LEGEND", s = 1) {
  const col = kind === "LEGEND" ? "#8a1f24" : "#1f5a3a",
    tex =
      TAGS[kind] ||
      (TAGS[kind] = cv(256, 96, (x, W, H) => {
        x.fillStyle = "#f4efdc";
        x.fillRect(0, 0, W, H);
        x.strokeStyle = col;
        x.lineWidth = 8;
        x.strokeRect(4, 4, W - 8, H - 8);
        x.fillStyle = col;
        x.font = "bold 54px Georgia, serif";
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillText(kind, W / 2, H / 2 + 3, W * 0.86);
      })),
    g = grp(),
    m = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  for (const d of [1, -1]) {
    const p = plane(0.3 * s, 0.11 * s, m, 0, 0.052 * s, d * 0.022 * s, g);
    p.rotation.x = -d * 0.4;
    if (d < 0) p.rotation.y = Math.PI;
  }
  g.visible = false;
  return quiet(g);
}

/* ---------- the mahogany staircase (Hakewill, 1825: "a specimen of joinery in mahogany and other costly woods seldom excelled") ----------
   A middle flight rises to a landing against the back wall, where it parts left and right and goes on up out of sight. Origin: the middle
   of the foot of the first step; the flight rises toward -z... here toward +z (the back wall). W: the flight's width. */
export function grandStair({ W = 2.2, rise = 0.17, tread = 0.3, steps = 12, H = 4.4 } = {}) {
  const g = grp(),
    top = steps * rise,
    run = steps * tread;
  for (let i = 0; i < steps; i++) {
    box(W, rise * (i + 1), tread, MAHOG_DARK, 0, (rise * (i + 1)) / 2, tread * (i + 0.5), g);
    box(W + 0.04, 0.035, tread + 0.03, MAHOG, 0, rise * (i + 1) + 0.005, tread * (i + 0.5) - 0.01, g);
    box(W * 0.42, 0.012, tread + 0.031, solid(0x7a2226, 1), 0, rise * (i + 1) + 0.026, tread * (i + 0.5) - 0.01, g);   /* a runner */
  }
  const lw = W + 2.6,
    ld = 1.3;
  box(lw, top, ld, MAHOG_DARK, 0, top / 2, run + ld / 2, g);
  box(lw + 0.04, 0.04, ld + 0.02, MAHOG, 0, top + 0.01, run + ld / 2, g);
  /* the landing is closed in underneath with raised mahogany panels (it was one flat dark face) */
  for (const sd of [-1, 1]) {
    const x0 = W / 2, x1 = lw / 2, pw = x1 - x0;
    for (const [py, ph] of [[0.25, 0.55], [0.95, 0.6]]) {
      box(pw - 0.16, ph, 0.03, MAHOG, sd * (x0 + pw / 2), py + ph / 2, run - 0.015, g);   /* facing you, beside the foot of the upper flight */
      box(0.03, ph, ld - 0.2, MAHOG, sd * (x1 + 0.015), py + ph / 2, run + ld / 2, g);   /* on the outer side */
    }
    box(pw, 0.1, 0.04, MAHOG, sd * (x0 + pw / 2), 0.05, run - 0.02, g);   /* a skirting */
  }
  /* the two upper flights return toward the front of the hall on either side of the lower one and go on up through the stairwell to the floor
     above (22 November 2026, owner: "these stair case is all wrong": each tread had a post down to the floor, which read as a dark slab, and the
     flights ran into black patches on the ceiling). Each is a real flight now: treads and risers between two closed strings, boarded underneath,
     with balusters and a handrail on both sides. g.userData.wells gives the openings the ceiling must leave over them. */
  const rail = (x0, y0, z0, x1, y1, z1) => {
    const L = Math.hypot(x1 - x0, y1 - y0, z1 - z0),
      b = box(0.07, 0.06, L, MAHOG, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, g);
    b.lookAt(g.localToWorld(new THREE.Vector3(x1, y1, z1)));
    return b;
  };
  const up = Math.ceil((H - top) / rise), fw = 1.2, zEnd = run - tread * up;
  const slab = (w, h, x, y0, z0, y1, z1, mat) => {   /* a board along the slope from (y0, z0) to (y1, z1) */
    const L = Math.hypot(y1 - y0, z1 - z0), b = box(w, h, L, mat, x, (y0 + y1) / 2, (z0 + z1) / 2, g);
    b.lookAt(g.localToWorld(new THREE.Vector3(x, y1, z1))); return b;
  };
  g.userData.wells = [];
  for (const s of [-1, 1]) {
    const xc = s * (W / 2 + 0.1 + fw / 2);
    for (let i = 0; i < up; i++) {
      const y = top + rise * (i + 1), z = run - tread * (i + 0.5);
      box(fw, 0.05, tread + 0.03, MAHOG, xc, y - 0.025, z - 0.01, g);
      box(fw, rise, 0.03, MAHOG_DARK, xc, y - rise / 2, z + tread / 2, g);
      box(W * 0.42 * 0.8, 0.012, tread + 0.031, solid(0x7a2226, 1), xc, y + 0.006, z - 0.01, g);   /* the runner goes on up */
    }
    for (const e of [-1, 1]) {   /* the closed strings, deep enough to hide the step ends */
      const xs = xc + e * (fw / 2 + 0.03);
      slab(0.06, 0.42, xs, top - 0.02, run + 0.05, top + rise * up - 0.02, zEnd + 0.05, MAHOG_DARK);
      for (let i = 0; i < up; i += 1) {
        const b = lathe([[0.014, 0], [0.022, 0.12], [0.011, 0.3], [0.019, 0.6], [0.012, 0.82]], MAHOG, 6);
        b.position.set(xs, top + rise * (i + 1) + 0.18, run - tread * (i + 0.5)); g.add(b);
      }
      rail(xs, top + 0.18 + rise + 0.82, run - tread * 0.5, xs, top + 0.18 + rise * up + 0.82, zEnd + tread * 0.5);
    }
    slab(fw + 0.12, 0.03, xc, top + rise - 0.26, run - tread, top + rise * up - 0.3, zEnd, MAHOG_DARK);   /* boarded underneath, from the first step up (below that the landing is solid) */
    /* where the flight passes through the ceiling, it needs about 2 m of head room: the well runs from there to its top */
    const zIn = run - tread * Math.max(0, Math.ceil((H - 2.0 - top) / rise));
    g.userData.wells.push({ x0: xc - fw / 2 - 0.1, x1: xc + fw / 2 + 0.1, z0: zEnd - 0.05, z1: zIn });
  }
  /* balusters and rails on the middle flight and the landing */
  for (const s of [-1, 1]) {
    const x = s * (W / 2 - 0.05);
    for (let i = 0; i < steps; i++) {
      const b = lathe([[0.016, 0], [0.026, 0.12], [0.012, 0.3], [0.022, 0.6], [0.014, 0.82]], MAHOG, 6);
      b.position.set(x, rise * (i + 1), tread * (i + 0.5));
      g.add(b);
    }
    rail(x, rise + 0.85, tread * 0.5, x, top + 0.85, run - tread * 0.5);
    const newel = lathe([[0.07, 0], [0.075, 0.1], [0.045, 0.2], [0.06, 0.8], [0.08, 0.95], [0.05, 1.0], [0.07, 1.08], [0.001, 1.14]], MAHOG_DARK, 10);
    newel.position.set(x, 0, -0.06);
    g.add(newel);
    const post = lathe([[0.06, 0], [0.06, 0.9], [0.075, 0.98], [0.001, 1.06]], MAHOG_DARK, 8);
    post.position.set(x, top, run + 0.05);
    g.add(post);
    /* the landing's front rail, from the top of the flight out to the side flight */
    for (let k = 0; k < 4; k++) {
      const b = lathe([[0.016, 0], [0.026, 0.12], [0.012, 0.3], [0.022, 0.6], [0.014, 0.82]], MAHOG, 6);
      b.position.set(s * (W / 2 + 0.02 + k * 0.03) , top, run + 0.06);
      b.visible = false;
      g.add(b);
    }
  }
  /* a tall round-headed window over the landing, dark with night */
  return g;
}

/* ---------- the legend's shadows: flat shapes thrown on a wall. Each is drawn in code as a plain black outline. ---------- */
const SHAPES = {
  /* a lady in a high-waisted gown and a bonnet */
  lady(x, W, H) {
    x.beginPath();
    x.ellipse(W * 0.5, H * 0.1, W * 0.13, H * 0.07, 0, 0, 7);
    x.fill();
    x.beginPath();
    x.moveTo(W * 0.3, H * 0.06);
    x.quadraticCurveTo(W * 0.5, -H * 0.03, W * 0.72, H * 0.1);
    x.lineTo(W * 0.5, H * 0.14);
    x.fill();
    x.beginPath();
    x.moveTo(W * 0.4, H * 0.17);
    x.lineTo(W * 0.6, H * 0.17);
    x.lineTo(W * 0.66, H * 0.3);
    x.quadraticCurveTo(W * 0.86, H * 0.7, W * 0.9, H);
    x.lineTo(W * 0.1, H);
    x.quadraticCurveTo(W * 0.14, H * 0.7, W * 0.34, H * 0.3);
    x.fill();
    x.fillRect(W * 0.26, H * 0.2, W * 0.1, H * 0.3);
    x.fillRect(W * 0.64, H * 0.2, W * 0.1, H * 0.3);
  },
  /* a man seated at a small table with a cup */
  cup(x, W, H) {
    x.beginPath();
    x.ellipse(W * 0.3, H * 0.2, W * 0.1, H * 0.09, 0, 0, 7);
    x.fill();
    x.fillRect(W * 0.18, H * 0.3, W * 0.24, H * 0.36);
    x.fillRect(W * 0.18, H * 0.6, W * 0.4, H * 0.1);
    x.fillRect(W * 0.5, H * 0.6, W * 0.08, H * 0.4);
    x.fillRect(W * 0.1, H * 0.26, W * 0.06, H * 0.74);
    x.fillRect(W * 0.1, H * 0.62, W * 0.14, H * 0.06);
    x.fillRect(W * 0.14, H * 0.62, W * 0.06, H * 0.38);
    x.fillRect(W * 0.36, H * 0.38, W * 0.26, H * 0.07);   /* an arm to the cup */
    x.fillRect(W * 0.56, H * 0.52, W * 0.42, H * 0.05);   /* the table */
    x.fillRect(W * 0.74, H * 0.56, W * 0.06, H * 0.44);
    x.fillRect(W * 0.62, H * 0.42, W * 0.1, H * 0.1);   /* the cup */
    x.fillRect(W * 0.72, H * 0.44, W * 0.03, H * 0.04);
  },
  /* a four-post bed with a sleeper */
  bed(x, W, H) {
    x.fillRect(W * 0.04, H * 0.08, W * 0.05, H * 0.92);
    x.fillRect(W * 0.91, H * 0.08, W * 0.05, H * 0.92);
    x.fillRect(W * 0.04, H * 0.08, W * 0.92, H * 0.06);
    x.beginPath();
    x.moveTo(W * 0.09, H * 0.14);
    x.quadraticCurveTo(W * 0.2, H * 0.34, W * 0.09, H * 0.5);
    x.fill();
    x.beginPath();
    x.moveTo(W * 0.91, H * 0.14);
    x.quadraticCurveTo(W * 0.8, H * 0.34, W * 0.91, H * 0.5);
    x.fill();
    x.fillRect(W * 0.06, H * 0.66, W * 0.88, H * 0.14);
    x.beginPath();
    x.ellipse(W * 0.5, H * 0.66, W * 0.3, H * 0.07, 0, Math.PI, 0);   /* the sleeper under the cover */
    x.fill();
    x.beginPath();
    x.ellipse(W * 0.2, H * 0.62, W * 0.06, H * 0.05, 0, 0, 7);
    x.fill();
  },
  /* a man standing in a tall hat with a cane */
  hat(x, W, H) {
    x.fillRect(W * 0.38, H * 0.0, W * 0.24, H * 0.12);
    x.fillRect(W * 0.3, H * 0.11, W * 0.4, H * 0.02);
    x.beginPath();
    x.ellipse(W * 0.5, H * 0.18, W * 0.11, H * 0.06, 0, 0, 7);
    x.fill();
    x.beginPath();
    x.moveTo(W * 0.3, H * 0.26);
    x.lineTo(W * 0.7, H * 0.26);
    x.lineTo(W * 0.74, H * 0.62);
    x.lineTo(W * 0.26, H * 0.62);
    x.fill();
    x.fillRect(W * 0.34, H * 0.6, W * 0.12, H * 0.4);
    x.fillRect(W * 0.54, H * 0.6, W * 0.12, H * 0.4);
    x.fillRect(W * 0.86, H * 0.42, W * 0.03, H * 0.58);
    x.fillRect(W * 0.68, H * 0.32, W * 0.2, H * 0.06);
  },
  /* the lady again, an arm held out */
  tall(x, W, H) {
    SHAPES.lady(x, W, H);
    x.fillRect(W * 0.6, H * 0.2, W * 0.4, H * 0.045);
  },
};
/* a shadow of height h on a wall, facing +z, its foot at y = 0. userData.set(k, flick): k from 0 (sunk away) to 1 (standing). */
export function shadowShape(kind, h = 2.6, aspect = 0.6) {
  const tex = cv(128, 256, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#000";
    x.filter = "blur(2px)";
    SHAPES[kind](x, W, H);
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;   /* no thin line from the far edge along the top */
  tex.needsUpdate = true;
  const geo = new THREE.PlaneGeometry(h * aspect, h);
  geo.translate(0, h / 2, 0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, color: 0x0a0806 }));
  quiet(m);
  m.visible = false;
  m.userData.set = (k, flick = 0) => {
    m.visible = k > 0.01;
    m.material.opacity = Math.min(1, k * 1.6) * (0.78 + flick * 0.1);
    m.scale.set(1 + flick * 0.035, Math.max(0.04, k) * (1 + flick * 0.02), 1);
    m.rotation.z = flick * 0.012;
  };
  return m;
}

/* ---------- St James Parish Church ---------- */
/* a box pew end and bench, L long: a panelled end with a rounded top, a seat, a back, a book ledge */
export function pew(L = 3.2) {
  const g = grp();
  box(L, 0.05, 0.4, MAHOG, 0, 0.45, 0, g);
  box(L, 0.9, 0.05, MAHOG, 0, 0.5, -0.22, g);
  box(L, 0.03, 0.14, MAHOG_DARK, 0, 0.93, -0.3, g);
  for (const s of [-1, 1]) {
    box(0.06, 1.0, 0.56, MAHOG_DARK, s * (L / 2), 0.5, -0.03, g);
    const c = cyl(0.28, 0.28, 0.06, MAHOG_DARK, s * (L / 2), 1.0, -0.03, g, 12);
    c.rotation.z = Math.PI / 2;
    c.scale.set(1, 1, 1);
    c.scale.y = 1;
    c.scale.x = 0.35;
  }
  box(L, 0.45, 0.04, MAHOG_DARK, 0, 0.225, 0.18, g);
  return g;
}
/* a tall round-headed church window from inside, facing +z: clear glass in small panes, a stone surround */
let archTex;
export function archWindow(w = 1.5, h = 3.4) {
  const g = grp();
  archTex ||= new THREE.MeshBasicMaterial({
    map: cv(128, 320, (x, W, H) => {
      x.fillStyle = "#cfc8b4";
      x.fillRect(0, 0, W, H);
      x.save();
      x.beginPath();
      x.moveTo(6, H);
      x.lineTo(6, W / 2);
      x.arc(W / 2, W / 2, W / 2 - 6, Math.PI, 0);
      x.lineTo(W - 6, H);
      x.clip();
      const sky = x.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#cfe6f4");
      sky.addColorStop(0.75, "#f4f6ee");
      sky.addColorStop(1, "#cfe0c4");
      x.fillStyle = sky;
      x.fillRect(0, 0, W, H);
      const r = rng(11);
      for (let i = 0; i < 16; i++) {
        x.fillStyle = ["#7fa868", "#94b878", "#6a9658"][i % 3];
        x.beginPath();
        x.arc(r() * W, H * (0.9 + r() * 0.12), 12 + r() * 14, 0, 7);
        x.fill();
      }
      x.strokeStyle = "#f4f1e6";
      x.lineWidth = 3;
      for (let i = 1; i < 4; i++) {
        x.beginPath();
        x.moveTo((W * i) / 4, 0);
        x.lineTo((W * i) / 4, H);
        x.stroke();
      }
      for (let y = W / 2; y < H; y += 34) {
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
      }
      for (let i = 1; i < 6; i++) {
        const a = Math.PI + (i / 6) * Math.PI;
        x.beginPath();
        x.moveTo(W / 2, W / 2);
        x.lineTo(W / 2 + Math.cos(a) * W, W / 2 + Math.sin(a) * W);
        x.stroke();
      }
      x.restore();
    }),
  });
  plane(w, h, archTex, 0, h / 2, -0.12, g);
  box(w + 0.3, 0.08, 0.16, solid(0xd8d0bc, 1), 0, -0.04, 0.08, g);
  return g;
}
/* a plain wall tablet of white marble on a dark ground, as line the walls of every old parish church (no words: a general picture) */
export function tablet(w = 0.8, h = 1.0, seed = 1) {
  const g = grp(),
    r = rng(seed);
  box(w + 0.16, h + 0.16, 0.04, SLATE, 0, 0, 0.02, g);
  box(w, h, 0.04, MARBLE, 0, 0, 0.05, g);
  box(w + 0.2, 0.06, 0.1, MARBLE, 0, -h / 2 - 0.05, 0.05, g);
  if (r() > 0.4) {
    const u = lathe([[0.001, 0.26], [0.03, 0.25], [0.02, 0.21], [0.08, 0.14], [0.06, 0.05], [0.025, 0.03], [0.05, 0]], MARBLE, 10);
    u.position.set(0, h / 2 + 0.08, 0.05);
    u.scale.z = 0.5;
    g.add(u);
  } else {
    const p = mesh(new THREE.ConeGeometry(w * 0.5, 0.3, 4), MARBLE, 0, h / 2 + 0.2, 0.04, g);
    p.rotation.y = Math.PI / 4;
    p.scale.z = 0.12;
  }
  return g;
}
/* The monument to Rosa Palmer, by John Bacon the elder, 1794, in St James Parish Church, Montego Bay. Modelled on Tim Willasey-Wilsey's
   photograph (Victorian Web, sculpture/baconsenior/4.html) and Frank Cundall's note quoted there (docs/games/rose-hall.md, "The monument").
   From the floor up: a plinth; the inscription panel of warm veined marble between two plain pilasters; a moulded shelf; a low slab with
   a rounded front on which the figures stand. Behind them a tall pointed ground of dark blue-grey marble, and on it a tapering panel of
   white veined marble with a covered classical lamp on its flat top. The figures: a draped mourning woman, her head bowed, leans to her
   left over a tall vase on a square pedestal and lays a garland on it; on the vase a round medallion with a head (Cundall: "in all
   probability the head on the vase represents the features of Rosa Palmer"); a small ewer at her right, a little basket at her left.
   The words on the panel are the monument's own first lines. Origin on the floor at the middle of its foot, against a wall, facing +z. */
const veins = (base, line, seed, n) =>
  cv(512, 512, (x, W, H) => {
    const r = rng(seed);
    x.fillStyle = base;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = line;
    for (let i = 0; i < n; i++) {
      let px = r() * W,
        py = r() * H;
      const a = r() * 6.28;
      x.lineWidth = 0.6 + r() * 1.6;
      x.globalAlpha = 0.25 + r() * 0.45;
      for (const [ox, oy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) {
        let qx = px + ox,
          qy = py + oy,
          b = a;
        const rr = rng(seed * 100 + i);
        x.beginPath();
        x.moveTo(qx, qy);
        for (let k = 0; k < 9; k++) {
          b += (rr() - 0.5) * 0.9;
          qx += Math.cos(b) * 26;
          qy += Math.sin(b) * 26;
          x.lineTo(qx, qy);
        }
        x.stroke();
      }
    }
    x.globalAlpha = 1;
  });
export function rosaMonument() {
  const g = grp(),
    PALE = std(veins("#f1efe9", "#7d8288", 21, 46), 0.45),
    WARM = solid(0xe6dccb, 0.5),
    GROUND = solid(0x2c3446, 0.35);
  PALE.map.repeat.set(0.62, 0.62);
  /* the plinth, the panel between its pilasters, the shelf and the slab the figures stand on */
  box(1.36, 0.22, 0.5, MARBLE, 0, 0.11, 0.25, g);
  box(1.42, 0.05, 0.54, MARBLE, 0, 0.245, 0.27, g);
  box(1.3, 0.08, 0.48, MARBLE, 0, 0.31, 0.24, g);
  box(1.2, 0.8, 0.38, WARM, 0, 0.75, 0.19, g);
  for (const s of [-1, 1]) {
    box(0.13, 0.82, 0.44, MARBLE, s * 0.665, 0.76, 0.22, g);
    box(0.17, 0.05, 0.47, MARBLE, s * 0.665, 1.15, 0.235, g);
  }
  box(1.52, 0.06, 0.5, MARBLE, 0, 1.2, 0.25, g);
  box(1.46, 0.05, 0.46, MARBLE, 0, 1.15, 0.23, g);
  box(1.24, 0.1, 0.3, MARBLE, 0, 1.28, 0.15, g);
  const lip = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 24, 1, false, -Math.PI / 2, Math.PI), MARBLE, 0, 1.28, 0.3, g);
  lip.scale.z = 0.26;
  const tex = cv(768, 512, (x, W, H) => {
    x.fillStyle = "#efe6d6";
    x.fillRect(0, 0, W, H);
    const r = rng(5);
    x.strokeStyle = "#b9a184";
    for (let i = 0; i < 22; i++) {
      x.globalAlpha = 0.18 + r() * 0.2;
      x.lineWidth = 1 + r() * 2;
      x.beginPath();
      let px = r() * W,
        py = r() * H;
      x.moveTo(px, py);
      for (let k = 0; k < 6; k++) x.lineTo((px += (r() - 0.3) * 120), (py += (r() - 0.5) * 60));
      x.stroke();
    }
    x.globalAlpha = 1;
    x.fillStyle = "#2b2620";
    x.textAlign = "center";
    x.textBaseline = "middle";
    const rows = ["Near this place", "are deposited the Remains of", "Mrs ROSA PALMER,", "who died on the first day of May 1790.", "Her manners were open,", "cheerful and agreeable"];
    rows.forEach((t, i) => {
      x.font = (i === 2 ? "bold 52px" : "italic 40px") + " Georgia, serif";
      x.fillText(t, W / 2, 60 + i * 78, W * 0.92);
    });
  });
  plane(1.12, 0.74, std(tex, 0.6), 0, 0.75, 0.382, g);
  /* the pointed dark ground (sides straight to 2.5 m, then two arcs to a point) and the tapering white panel on it */
  const a = 0.83,
    y0 = 2.5,
    h = 1.83,
    d = (h * h - a * a) / (2 * a),
    r = a + d,
    th = Math.acos(d / r);
  const arch = new THREE.Shape();
  arch.moveTo(-a, 1.2);
  arch.lineTo(a, 1.2);
  arch.lineTo(a, y0);
  arch.absarc(-d, y0, r, 0, th, false);
  arch.absarc(d, y0, r, Math.PI - th, Math.PI, false);
  arch.lineTo(-a, 1.2);
  g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.05, bevelEnabled: false, curveSegments: 16 }), GROUND));
  const pan = new THREE.Shape();
  pan.moveTo(-0.76, 1.3);
  pan.lineTo(0.76, 1.3);
  pan.lineTo(0.33, 3.92);
  pan.lineTo(-0.33, 3.92);
  pan.lineTo(-0.76, 1.3);
  const pm = new THREE.Mesh(new THREE.ExtrudeGeometry(pan, { depth: 0.04, bevelEnabled: false }), PALE);
  pm.position.z = 0.05;
  g.add(pm);
  /* the covered lamp on the panel's flat top */
  const lamp = grp(g, 0, 3.92, 0.12);
  box(0.7, 0.04, 0.14, MARBLE, 0, 0.0, -0.02, g).position.set(0, 3.94, 0.1);
  lamp.position.y = 3.96;
  lamp.add(lathe([[0.05, 0], [0.06, 0.02], [0.025, 0.04], [0.03, 0.06], [0.14, 0.1], [0.16, 0.13], [0.12, 0.16], [0.05, 0.17], [0.03, 0.2], [0.035, 0.23], [0.001, 0.25]], MARBLE, 14));
  const spout = cyl(0.025, 0.04, 0.2, MARBLE, 0.2, 0.135, 0, lamp, 8);
  spout.rotation.z = Math.PI / 2 - 0.25;
  const handle = mesh(new THREE.TorusGeometry(0.045, 0.012, 5, 10, Math.PI * 1.3), MARBLE, -0.17, 0.14, 0, lamp);
  handle.rotation.z = Math.PI * 0.35;
  lamp.scale.z = 0.6;
  /* the pedestal and the tall vase with its medallion head and garland */
  const F = grp(g, 0, 1.33, 0.26);
  box(0.42, 0.42, 0.34, MARBLE, 0.2, 0.21, 0, F);
  box(0.46, 0.04, 0.38, MARBLE, 0.2, 0.44, 0, F);
  box(0.3, 0.26, 0.01, solid(0xe6e3dc, 0.55), 0.2, 0.21, 0.172, F);
  const vase = lathe([[0.001, 0], [0.09, 0], [0.09, 0.03], [0.05, 0.06], [0.035, 0.12], [0.06, 0.16], [0.13, 0.24], [0.19, 0.36], [0.2, 0.46], [0.16, 0.6], [0.1, 0.68], [0.09, 0.72], [0.13, 0.76], [0.13, 0.79], [0.001, 0.8]], MARBLE, 18);
  vase.position.set(0.2, 0.46, 0);
  vase.scale.z = 0.8;
  F.add(vase);
  const medal = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 18), solid(0xf6f4ef, 0.5), 0.2, 0.88, 0.172, F);
  medal.rotation.x = Math.PI / 2;
  const face = mesh(new THREE.SphereGeometry(0.055, 10, 8), MARBLE, 0.2, 0.89, 0.185, F);
  face.scale.set(0.85, 1.1, 0.45);
  for (const s of [-1, 1]) {
    const fest = mesh(new THREE.TorusGeometry(0.11, 0.022, 5, 10, Math.PI), solid(0xeceae2, 0.6), 0.2 + s * 0.12, 1.0, 0.13, F);
    fest.rotation.z = Math.PI;
    fest.rotation.y = s * 0.5;
  }
  /* the mourning woman: she stands at the left, leans to her left over the vase, head bowed, a mantle falling behind her */
  const W2 = grp(F, -0.24, 0, 0.02);
  const skirt = lathe([[0.001, 0], [0.24, 0], [0.25, 0.04], [0.21, 0.3], [0.17, 0.6], [0.15, 0.86], [0.001, 0.92]], MARBLE, 16);
  skirt.scale.z = 0.7;
  skirt.rotation.z = -0.05;
  W2.add(skirt);
  const foot = mesh(new THREE.SphereGeometry(0.05, 8, 6), MARBLE, 0.04, 0.03, 0.18, W2);
  foot.scale.set(1, 0.6, 1.6);
  const torso = grp(W2, 0.02, 0.84, 0);
  torso.rotation.z = -0.5;
  torso.rotation.x = 0.15;
  const chest = lathe([[0.15, 0], [0.13, 0.12], [0.13, 0.3], [0.15, 0.42], [0.08, 0.5], [0.001, 0.52]], MARBLE, 14);
  chest.scale.z = 0.72;
  torso.add(chest);
  cyl(0.04, 0.045, 0.1, MARBLE, 0, 0.55, 0.01, torso, 8);
  const headG = grp(torso, 0.03, 0.64, 0.04);
  headG.rotation.z = -0.55;
  headG.rotation.x = 0.45;
  const head = mesh(new THREE.SphereGeometry(0.09, 12, 10), MARBLE, 0, 0, 0, headG);
  head.scale.set(0.9, 1.12, 0.95);
  const hair = mesh(new THREE.SphereGeometry(0.1, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), solid(0xe6e2d8, 0.6), 0, 0.02, -0.015, headG);
  hair.rotation.x = -0.3;
  const veil = mesh(new THREE.SphereGeometry(0.11, 10, 8, Math.PI * 0.5, Math.PI, 0, Math.PI * 0.6), MARBLE, 0, 0.01, -0.02, headG);
  veil.scale.set(1, 1.15, 1);
  /* arms, in the frame of the pedestal: both reach to the vase's lip and hold the garland */
  const limb = (p, q, r0, r1) => {
    const a = new THREE.Vector3(...p),
      v = new THREE.Vector3(...q).sub(a),
      c = cyl(r1, r0, v.length(), MARBLE, a.x + v.x / 2, a.y + v.y / 2, a.z + v.z / 2, F, 8);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
    mesh(new THREE.SphereGeometry(r1, 8, 6), MARBLE, q[0], q[1], q[2], F);
  };
  limb([-0.16, 1.22, 0.06], [-0.04, 1.02, 0.2], 0.045, 0.036);
  limb([-0.04, 1.02, 0.2], [0.11, 1.18, 0.17], 0.036, 0.03);
  limb([0.0, 1.3, 0.1], [0.17, 1.12, 0.2], 0.042, 0.034);
  limb([0.17, 1.12, 0.2], [0.27, 1.22, 0.15], 0.034, 0.03);
  /* the mantle: a fold from the shoulders down her back and her left side to the ground */
  const mantle = lathe([[0.001, 0], [0.19, 0.02], [0.26, 0.42], [0.21, 0.78], [0.11, 1.06], [0.001, 1.12]], solid(0xe9e6de, 0.55), 14);
  mantle.position.set(-0.14, 0.01, -0.05);
  mantle.rotation.z = -0.14;
  mantle.scale.z = 0.55;
  W2.add(mantle);
  /* the small ewer at her right and the little basket of flowers at her left */
  const ewer = lathe([[0.001, 0], [0.05, 0], [0.06, 0.05], [0.045, 0.12], [0.03, 0.16], [0.05, 0.2], [0.001, 0.2]], MARBLE, 10);
  ewer.position.set(0.52, 0, 0.06);
  ewer.rotation.z = 0.25;
  F.add(ewer);
  mesh(new THREE.TorusGeometry(0.04, 0.01, 4, 8, Math.PI), MARBLE, 0.47, 0.13, 0.06, F).rotation.z = 1.9;
  const basket = lathe([[0.001, 0], [0.06, 0], [0.09, 0.06], [0.1, 0.09], [0.001, 0.09]], MARBLE, 10);
  basket.position.set(-0.6, 0, 0.04);
  F.add(basket);
  const rb = rng(9);
  for (let i = 0; i < 6; i++) mesh(new THREE.IcosahedronGeometry(0.03, 0), MARBLE, -0.6 + (rb() - 0.5) * 0.15, 0.1 + rb() * 0.04, 0.04 + (rb() - 0.5) * 0.1, F);
  return g;
}
/* a pulpit: an eight-sided tub on a stem, a short stair, a sounding board is left off */
export function pulpit() {
  const g = grp();
  g.add(lathe([[0.3, 0], [0.32, 0.08], [0.12, 0.2], [0.1, 0.9], [0.5, 1.15], [0.52, 1.2]], MAHOG_DARK, 8));
  const tub = mesh(new THREE.CylinderGeometry(0.62, 0.55, 1.0, 8, 1, true), MAHOG, 0, 1.7, 0, g);
  tub.material = solid(0x4a2418, 0.45, 0, { side: THREE.DoubleSide });
  cyl(0.55, 0.55, 0.05, MAHOG_DARK, 0, 1.22, 0, g, 8);
  mesh(new THREE.TorusGeometry(0.62, 0.035, 5, 8), MAHOG_DARK, 0, 2.2, 0, g).rotation.x = Math.PI / 2;
  box(0.4, 0.03, 0.3, MAHOG_DARK, 0, 2.3, 0.5, g).rotation.x = 0.4;
  box(0.06, 0.12, 0.06, MAHOG_DARK, 0, 2.22, 0.55, g);
  for (let i = 0; i < 6; i++) box(0.7, 0.2 * (i + 1), 0.26, MAHOG_DARK, -0.95 - i * 0.0, 0.1 * (i + 1), -0.2 - i * 0.26 + 0.9, g).position.set(-0.75, 0.1 * (i + 1), 1.75 - i * 0.26);
  return g;
}
/* a stone font on a stem with a wooden cover */
export function font() {
  const g = grp();
  g.add(lathe([[0.34, 0], [0.34, 0.1], [0.16, 0.2], [0.14, 0.7], [0.36, 0.86], [0.42, 1.0], [0.42, 1.06]], MARBLE, 8));
  g.add(at(lathe([[0.4, 0], [0.3, 0.06], [0.05, 0.16], [0.04, 0.24], [0.001, 0.27]], MAHOG_DARK, 8), 0, 1.06, 0));
  return g;
}
/* the holy table with a white cloth, a cross, two candlesticks and flowers, behind a low rail */
export function altar(set = "c") {
  const g = grp();
  box(2.2, 0.95, 0.8, MAHOG_DARK, 0, 0.475, 0, g);
  box(2.3, 0.03, 0.9, solid(0xf2f0ea, 1), 0, 0.965, 0, g);
  box(2.3, 0.5, 0.02, solid(0xf2f0ea, 1), 0, 0.72, 0.455, g);
  box(0.9, 0.5, 0.022, solid(0x2f6a3a, 1), 0, 0.72, 0.46, g);
  box(0.05, 0.6, 0.05, BRASS, 0, 1.28, -0.15, g);
  box(0.34, 0.05, 0.05, BRASS, 0, 1.42, -0.15, g);
  box(0.2, 0.04, 0.16, BRASS, 0, 1.0, -0.15, g);
  for (const s of [-1, 1]) {
    const c = candlestick(set, 0.3);
    c.position.set(s * 0.7, 0.98, -0.1);
    c.scale.setScalar(1.6);
    g.add(c);
  }
  return g;
}
export function flowerStand(seed = 1) {
  const g = grp(),
    r = rng(seed);
  g.add(lathe([[0.16, 0], [0.17, 0.04], [0.04, 0.1], [0.03, 0.9], [0.12, 1.0]], BRASS, 10));
  g.add(at(lathe([[0.06, 0], [0.12, 0.1], [0.1, 0.24], [0.13, 0.28]], MARBLE, 10), 0, 1.0, 0));
  for (let i = 0; i < 14; i++) {
    const a = r() * 6.28,
      k = r() * 0.2;
    mesh(new THREE.IcosahedronGeometry(0.07 + r() * 0.04, 0), flat([0xf2f0ea, 0xe8c040, 0xd94a6a, 0x4f8a48, 0x3f7a40][i % 5]), Math.cos(a) * k, 1.3 + r() * 0.3, Math.sin(a) * k, g);
  }
  return g;
}
/* a roof truss of dark timber spanning `span`, its tie beam at y = 0 */
export function truss(span = 12, rise = 2.4) {
  const g = grp();
  box(span, 0.22, 0.2, MAHOG_DARK, 0, 0, 0, g);
  const L = Math.hypot(span / 2, rise);
  for (const s of [-1, 1]) {
    const r = box(L, 0.2, 0.18, MAHOG_DARK, (s * span) / 4, rise / 2, 0, g);
    r.rotation.z = -s * Math.atan2(rise, span / 2);
    const st = box(Math.hypot(span / 4, rise / 2), 0.14, 0.14, MAHOG_DARK, (s * span) / 8, rise / 4, 0, g);
    st.rotation.z = s * Math.atan2(rise / 2, span / 4);
  }
  box(0.2, rise, 0.18, MAHOG_DARK, 0, rise / 2, 0, g);
  return g;
}
/* a ceiling fan on a rod (today's); userData.spin(t) turns it */
export function ceilingFan(drop = 0.8, col = 0xe8e4d8) {
  const g = grp();
  cyl(0.02, 0.02, drop, STEEL, 0, -drop / 2, 0, g, 6);
  cyl(0.1, 0.12, 0.14, solid(col, 0.6), 0, -drop - 0.07, 0, g, 12);
  const hub = grp(g, 0, -drop - 0.1, 0);
  for (let i = 0; i < 3; i++) {
    const b = grp(hub);
    b.rotation.y = (i / 3) * Math.PI * 2;
    box(0.7, 0.012, 0.13, solid(col, 0.7), 0.45, 0, 0, b).rotation.x = 0.12;
  }
  quiet(hub);
  g.userData.spin = (t) => (hub.rotation.y = t * 5);
  return g;
}
/* a board with the numbers of the day's hymns */
export function hymnBoard() {
  const g = grp();
  box(0.5, 0.8, 0.04, MAHOG_DARK, 0, 0, 0.02, g);
  const tex = cv(128, 200, (x, W, H) => {
    x.fillStyle = "#3a2418";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#f2ead2";
    x.font = "bold 22px Georgia, serif";
    x.textAlign = "center";
    x.fillText("HYMNS", W / 2, 30);
    x.font = "bold 34px Georgia, serif";
    ["7", "3", "5"].forEach((t, i) => {
      x.fillStyle = "#f2ead2";
      x.fillRect(24, 48 + i * 48, 80, 38);
      x.fillStyle = "#1a1512";
      x.fillText(t, W / 2, 78 + i * 48);
    });
  });
  plane(0.44, 0.72, std(tex, 0.9), 0, 0, 0.045, g);
  return g;
}
/* a brass eagle is left off: a plain reading desk on a stem, with the church's own note about the monument lying on it */
export function lectern(m = MAHOG_DARK) {
  const g = grp();
  g.add(lathe([[0.2, 0], [0.21, 0.05], [0.05, 0.12], [0.04, 1.0], [0.08, 1.06]], m, 10));
  const top = box(0.5, 0.03, 0.4, m, 0, 1.14, 0.02, g);
  top.rotation.x = 0.45;
  box(0.5, 0.04, 0.03, m, 0, 1.06, 0.2, g);
  return g;
}

/* ---------- the reading room of the Jamaica Archives, Spanish Town (built 1962): a general picture of a public reading room of that time ---------- */
export function readingTable(L = 3.2, W = 1.1) {
  const g = grp(),
    m = solid(0x8a6a48, 0.6);
  box(L, 0.05, W, m, 0, 0.74, 0, g);
  box(L - 0.2, 0.1, W - 0.2, solid(0x6e5238, 0.7), 0, 0.67, 0, g);
  for (const x of [-L / 2 + 0.1, L / 2 - 0.1]) for (const z of [-W / 2 + 0.1, W / 2 - 0.1]) box(0.07, 0.72, 0.07, solid(0x6e5238, 0.7), x, 0.36, z, g);
  return g;
}
export function officeChair(c = 0x3f5a52) {
  const g = grp();
  for (const x of [-0.19, 0.19]) for (const z of [-0.19, 0.19]) cyl(0.014, 0.014, 0.44, STEEL, x, 0.22, z, g, 6);
  box(0.44, 0.05, 0.44, solid(c, 0.95), 0, 0.46, 0, g);
  for (const x of [-0.19, 0.19]) cyl(0.014, 0.014, 0.44, STEEL, x, 0.68, -0.2, g, 6);
  box(0.42, 0.26, 0.04, solid(c, 0.95), 0, 0.78, -0.2, g);
  return g;
}
/* a grey archive box with a label; open = its lid stands beside it */
export function archiveBox(text = "1B/26", w = 0.4, h = 0.28, d = 0.3) {
  const g = grp(),
    m = solid(0x8f948c, 0.95);
  box(w, h, d, m, 0, h / 2, 0, g);
  box(w + 0.012, 0.06, d + 0.012, solid(0x7c8179, 0.95), 0, h - 0.03, 0, g);
  const tex = cv(128, 64, (x, W, H) => {
    x.fillStyle = "#f4f1e6";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#1a1512";
    x.font = "bold 30px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2 + 2, W * 0.9);
  });
  plane(w * 0.5, w * 0.25, std(tex, 0.9), 0, h * 0.45, d / 2 + 0.004, g);
  return g;
}
/* a steel shelf bay of archive boxes */
export function shelfBay(w = 1.8, h = 2.3, seed = 1) {
  const g = grp(),
    r = rng(seed),
    cols = [solid(0x8f948c, 0.95), solid(0xa39a80, 0.95), solid(0x7c8179, 0.95), solid(0x6a5a48, 0.9)];
  for (const s of [-1, 1]) box(0.04, h, 0.42, STEEL, s * (w / 2), h / 2, 0, g);
  for (let k = 0; k < 5; k++) {
    const y = 0.12 + k * ((h - 0.2) / 4.6);
    box(w, 0.03, 0.42, STEEL, 0, y, 0, g);
    if (k === 4) break;
    for (let x = -w / 2 + 0.2; x < w / 2 - 0.15; ) {
      const bw = 0.22 + r() * 0.16,
        bh = 0.3 + r() * 0.1;
      box(bw, bh, 0.34, cols[(r() * cols.length) | 0], x + bw / 2 - 0.1, y + 0.015 + bh / 2, 0.01, g);
      box(bw * 0.5, 0.07, 0.005, solid(0xf4f1e6, 0.9), x + bw / 2 - 0.1, y + 0.015 + bh * 0.45, 0.183, g);
      x += bw + 0.03;
    }
  }
  return g;
}
/* a card catalogue: a cabinet of small drawers with brass pulls */
export function catalogue(cols = 6, rows = 7) {
  const g = grp(),
    m = solid(0x7a5a3c, 0.6),
    w = cols * 0.19 + 0.06,
    h = rows * 0.15 + 0.06;
  for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) for (const z of [-0.2, 0.2]) box(0.06, 0.5, 0.06, m, x, 0.25, z, g);
  box(w, h, 0.5, m, 0, 0.5 + h / 2, 0, g);
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const x = -w / 2 + 0.03 + 0.095 + i * 0.19,
        y = 0.53 + 0.075 + j * 0.15;
      box(0.17, 0.13, 0.012, solid(0x8a6a48, 0.6), x, y, 0.253, g);
      box(0.07, 0.035, 0.008, solid(0xf4f1e6, 0.9), x, y + 0.025, 0.262, g);
      box(0.05, 0.012, 0.014, BRASS, x, y - 0.03, 0.264, g);
    }
  return g;
}
/* a two-shelf steel trolley */
export function trolley() {
  const g = grp();
  for (const x of [-0.36, 0.36]) for (const z of [-0.22, 0.22]) {
    cyl(0.012, 0.012, 0.86, STEEL, x, 0.47, z, g, 6);
    mesh(new THREE.SphereGeometry(0.04, 8, 6), IRON, x, 0.04, z, g);
  }
  for (const y of [0.2, 0.84]) box(0.78, 0.025, 0.5, STEEL, 0, y, 0, g);
  box(0.03, 0.03, 0.5, STEEL, 0.4, 0.98, 0, g);
  for (const z of [-0.22, 0.22]) cyl(0.012, 0.012, 0.14, STEEL, 0.38, 0.91, z, g, 6);
  return g;
}
/* a strip light on the ceiling (hangs down from y = 0) */
export function tubeLight(L = 1.4) {
  const g = grp();
  box(L, 0.06, 0.16, solid(0xdcdcd4, 0.7), 0, -0.03, 0, g);
  box(L - 0.08, 0.03, 0.1, new THREE.MeshBasicMaterial({ color: 0xfdfdf2 }), 0, -0.075, 0, g);
  return g;
}
/* a window of glass louvres with a view of trees, facing +z, as public buildings of the 1960s had */
let louvreM;
export function louvreWindow(w = 1.6, h = 1.4) {
  const g = grp();
  louvreM ||= new THREE.MeshBasicMaterial({
    map: cv(128, 128, (x, W, H) => {
      const sky = x.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#bfe0f2");
      sky.addColorStop(1, "#eef4e6");
      x.fillStyle = sky;
      x.fillRect(0, 0, W, H);
      const r = rng(21);
      for (let i = 0; i < 18; i++) {
        x.fillStyle = ["#6f9a5a", "#88ad68", "#5d8a52"][i % 3];
        x.beginPath();
        x.arc(r() * W, H * (0.66 + r() * 0.4), 14 + r() * 16, 0, 7);
        x.fill();
      }
      for (let y = 0; y < H; y += 13) {
        x.fillStyle = "rgba(255,255,255,0.5)";
        x.fillRect(0, y, W, 3);
        x.fillStyle = "rgba(60,80,90,0.3)";
        x.fillRect(0, y + 3, W, 1.5);
      }
    }),
  });
  plane(w, h, louvreM, 0, h / 2, -0.1, g);
  const fm = solid(0x9aa09a, 0.5, 0.4);
  box(w - 0.11, 0.05, 0.12, fm, 0, h - 0.026, -0.06, g);
  box(w + 0.1, 0.05, 0.14, fm, 0, -0.025, 0.071, g);
  for (const x of [-w / 2 + 0.026, 0, w / 2 - 0.026]) box(0.05, h - 0.002, 0.12, fm, x, h / 2, -0.06, g);
  return g;
}
/* a printed notice in a frame on a wall, facing +z */
export function notice(lines, w = 0.6, h = 0.4, bg = "#f4f1e6", fg = "#1a2a3a") {
  const g = grp();
  box(w + 0.05, h + 0.05, 0.02, solid(0x5a4a3a, 0.8), 0, 0, 0.01, g);
  const tex = cv(384, Math.round((384 * h) / w), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.textAlign = "center";
    x.textBaseline = "middle";
    lines.forEach((t, i) => {
      x.font = (i ? "" : "bold ") + Math.round((H / (lines.length + 0.6)) * (i ? 0.62 : 0.78)) + "px Georgia, serif";
      x.fillText(t, W / 2, (H * (i + 0.6)) / (lines.length + 0.2), W * 0.92);
    });
  });
  plane(w, h, std(tex, 0.9), 0, 0, 0.022, g);
  return g;
}
/* an open book or paper on a grey foam rest, as a reading room gives you. cover: its colour; text: what its open page says at the top */
export function bookRest(cover = 0x4a2f24, text = "", thick = 0.05) {
  const g = grp();
  for (const s of [-1, 1]) {
    const w = box(0.26, 0.03, 0.34, solid(0x6a6e6a, 1), s * 0.14, 0.045, 0, g);
    w.rotation.z = s * 0.22;
    const c = box(0.25, thick * 0.5, 0.32, solid(cover, 0.8), s * 0.135, 0.07, 0, g);
    c.rotation.z = s * 0.22;
    const p = box(0.23, thick * 0.4, 0.3, solid(0xe7dcc2, 0.95), s * 0.13, 0.07 + thick * 0.45, 0, g);
    p.rotation.z = s * 0.22;
  }
  box(0.52, 0.02, 0.36, solid(0x6a6e6a, 1), 0, 0.01, 0, g);
  if (text) {
    const tex = cv(256, 320, (x, W, H) => {
      x.fillStyle = "#e7dcc2";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#2b2620";
      x.font = "bold 26px Georgia, serif";
      x.textAlign = "center";
      const parts = text.split("|");
      parts.forEach((t, i) => x.fillText(t, W / 2, 44 + i * 34, W * 0.9));
      x.strokeStyle = "rgba(60,44,30,0.55)";
      x.lineWidth = 2;
      const r = rng(text.length);
      for (let y = 60 + parts.length * 34; y < H - 20; y += 20) {
        x.beginPath();
        x.moveTo(18, y);
        for (let k = 18; k < W - 18 - r() * 60; k += 7) x.lineTo(k, y + (r() - 0.5) * 5);
        x.stroke();
      }
    });
    const p = plane(0.22, 0.29, std(tex, 0.95), 0.13, 0.075 + thick * 0.66, 0, g);
    p.rotation.x = -Math.PI / 2;
    p.rotation.y = 0;
    p.rotation.order = "ZXY";
    p.rotation.z = 0.22;
  }
  return g;
}
/* a glass-topped display case on legs */
export function displayCase(w = 1.4, d = 0.7) {
  const g = grp(),
    m = solid(0x6e5238, 0.6);
  for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) for (const z of [-d / 2 + 0.06, d / 2 - 0.06]) box(0.06, 0.8, 0.06, m, x, 0.4, z, g);
  box(w, 0.12, d, m, 0, 0.84, 0, g);
  box(w - 0.08, 0.01, d - 0.08, solid(0x3f5a52, 1), 0, 0.905, 0, g);
  const gl = box(w - 0.04, 0.16, d - 0.04, new THREE.MeshStandardMaterial({ color: 0xcfe0e0, transparent: true, opacity: 0.22, roughness: 0.1 }), 0, 0.98, 0, g);
  gl.userData.noBatch = true;
  for (const x of [-w / 2 + 0.03, w / 2 - 0.03]) for (const z of [-d / 2 + 0.03, d / 2 - 0.03]) box(0.025, 0.16, 0.025, m, x, 0.98, z, g);
  box(w, 0.025, d, m, 0, 1.07, 0, g).visible = false;
  return g;
}
export function potPlant(seed = 1, s = 1) {
  const g = grp(),
    r = rng(seed);
  g.add(lathe([[0.14, 0], [0.2, 0.34], [0.22, 0.36]], solid(0xa8603a, 0.9), 10));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * 6.28 + r(),
      l = mesh(new THREE.ConeGeometry(0.07, 0.8 + r() * 0.3, 4), flat([0x3f7a40, 0x4f8a48, 0x2f6a3a][i % 3]), Math.cos(a) * 0.14, 0.72, Math.sin(a) * 0.14, g);
    l.rotation.z = -Math.cos(a) * 0.5;
    l.rotation.x = Math.sin(a) * 0.5;
    l.scale.z = 0.3;
  }
  g.scale.setScalar(s);
  return g;
}
/* a potted palm in a glazed jardiniere, for the stair hall (owner, 22 November 2026: a plant each side of the steps). A tall glazed pot on a
   short foot, dark soil, and about ten arching fronds, each a curved stalk with paired leaflets that droop toward the tip. All the leaves are
   one merged mesh. About 1.5 m tall at s = 1. */
export function hallPalm(seed = 1, s = 1) {
  const g = grp(), r = rng(seed);
  g.add(lathe([[0.15, 0], [0.17, 0.05], [0.13, 0.08], [0.2, 0.2], [0.25, 0.4], [0.24, 0.5], [0.27, 0.53], [0.25, 0.55]], solid(0x2f4a5a, 0.35, 0.05), 16));   /* the glazed pot */
  cyl(0.235, 0.235, 0.02, solid(0x2a1c14, 1), 0, 0.52, 0, g, 14);   /* the soil */
  const leaves = [], stalks = [], v = new THREE.Vector3();
  const N = 10;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + r() * 0.5, up = 0.95 + r() * 0.45, L = 0.85 + r() * 0.4, ca = Math.cos(a), sa = Math.sin(a);
    const at = (t) => { const reach = L * t, h = 0.54 + Math.sin(up) * L * t - 0.6 * L * t * t * t; return new THREE.Vector3(ca * reach * Math.cos(up * 0.4), h, sa * reach * Math.cos(up * 0.4)); };
    const pts = []; for (let k = 0; k <= 6; k++) pts.push(at(k / 6));
    stalks.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.008, 4));
    for (let k = 1; k <= 9; k++) {
      const t = 0.15 + (k / 9) * 0.8, p0 = at(t), p1 = at(t + 0.03), dir = v.copy(p1).sub(p0).normalize(), side = new THREE.Vector3(-sa, 0, ca), ll = 0.2 * (1 - t * 0.5);
      for (const sd of [-1, 1]) {
        const tip = p0.clone().addScaledVector(side, sd * ll).add(new THREE.Vector3(0, -ll * 0.45, 0)).addScaledVector(dir, ll * 0.4);
        const gq = new THREE.BufferGeometry(), w = 0.022;
        gq.setAttribute("position", new THREE.Float32BufferAttribute([...p0.toArray(), ...tip.toArray(), ...p0.clone().addScaledVector(dir, w * 2).toArray(), ...tip.clone().addScaledVector(dir, w * 0.5).toArray()], 3));
        gq.setIndex([0, 1, 2, 2, 1, 3]); gq.computeVertexNormals(); leaves.push(gq);
      }
    }
  }
  const lm = new THREE.MeshStandardMaterial({ color: 0x3f7a3c, roughness: 0.7, side: THREE.DoubleSide });
  g.add(new THREE.Mesh(mergeGeometries(leaves), lm), new THREE.Mesh(mergeGeometries(stalks), solid(0x5a6a34, 0.8)));
  g.scale.setScalar(s);
  return g;
}
/* a round wall clock, facing +z */
export function wallClock() {
  const g = grp();
  cyl(0.2, 0.2, 0.05, solid(0x2b2d31, 0.6), 0, 0, 0.025, g, 20).rotation.x = Math.PI / 2;
  const f = mesh(new THREE.CircleGeometry(0.18, 20), std(T.clock(), 0.6), 0, 0, 0.052, g);
  return g;
}

/* ---------- the estate by day ---------- */
/* Rose Hall great house as it stands today, restored: a tall block of cut stone, the ground storey of arches, two storeys of sash windows
   above, a hipped shingle roof, and in the middle of the front "a double flight of stone steps" to "an open portico" (Hakewill, 1825).
   The wings Hakewill saw are gone. Seen from far below: windows are dark panes, no inside. Front faces +z. */
export function greatHouse() {
  const g = grp(),
    W = 30,
    D = 13,
    stone = std(T.stone([196, 186, 160], [10, 2]), 1),
    stoneUp = std(T.stone([208, 198, 172], [10, 3]), 1),
    dark = new THREE.MeshBasicMaterial({ color: 0x1c2228 }),
    win = new THREE.MeshBasicMaterial({ color: 0x1c2228 }),   /* the sash panes: lit from inside for the night tour (userData.night) */
    trim = solid(0xe8e2d0, 0.9);
  g.userData.night = (on) => win.color.set(on ? 0xe8a65a : 0x1c2228);
  box(W, 4.2, D, stone, 0, 2.1, 0, g);
  box(W + 0.3, 0.3, D + 0.3, trim, 0, 4.3, 0, g);
  box(W, 8.2, D, stoneUp, 0, 8.5, 0, g);
  box(W + 0.5, 0.35, D + 0.5, trim, 0, 12.7, 0, g);
  /* the roof: hipped, of shingles */
  const hw = W / 2 + 0.6,
    hd = D / 2 + 0.6,
    rg = hw - hd,
    v = [-hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd, -rg, 4.2, 0, rg, 4.2, 0],
    geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  geo.setIndex([0, 4, 5, 0, 5, 1, 2, 5, 4, 2, 4, 3, 3, 4, 0, 1, 5, 2]);
  const roof = new THREE.Mesh(geo.toNonIndexed(), new THREE.MeshStandardMaterial({ color: 0x6a5c4c, roughness: 1, side: THREE.DoubleSide, flatShading: true }));
  roof.geometry.computeVertexNormals();
  roof.position.y = 12.87;
  g.add(roof);
  /* nine bays: arches below, two rows of sashes above */
  for (let i = 0; i < 9; i++) {
    const x = -W / 2 + 1.9 + i * ((W - 3.8) / 8),
      mid = i >= 3 && i <= 5;
    if (!mid) {
      box(1.5, 2.2, 0.1, dark, x, 1.5, D / 2 + 0.01, g);
      const a = mesh(new THREE.CircleGeometry(0.75, 12, 0, Math.PI), dark, x, 2.6, D / 2 + 0.06, g);
    }
    for (const [y, h] of [[6.6, 2.6], [10.6, 2.2]]) {
      if (mid && y < 8) continue;
      box(1.3, h, 0.1, win, x, y, D / 2 + 0.01, g);
      box(1.5, 0.12, 0.2, trim, x, y - h / 2 - 0.06, D / 2 + 0.06, g);
      box(0.05, h, 0.12, trim, x, y, D / 2 + 0.03, g);
      box(1.3, 0.05, 0.12, trim, x, y, D / 2 + 0.03, g);
    }
  }
  for (const s of [-1, 1])
    for (let k = 0; k < 4; k++) for (const [y, h] of [[1.9, 2.2], [6.6, 2.6], [10.6, 2.2]]) box(0.1, h, 1.3, dark, s * (W / 2 + 0.01), y, -D / 2 + 1.9 + k * 3.05, g);
  /* the portico: a stone platform on arches at the height of the first floor, three arches under a small roof */
  const P0 = D / 2;
  box(10, 4.3, 3.2, stone, 0, 2.15, P0 + 1.6, g);
  for (const x of [-3, 0, 3]) {
    box(1.6, 2.4, 0.1, dark, x, 1.5, P0 + 3.21, g);
    const a = mesh(new THREE.CircleGeometry(0.8, 12, 0, Math.PI), dark, x, 2.7, P0 + 3.26, g);
  }
  box(10.3, 0.2, 3.5, trim, 0, 4.4, P0 + 1.6, g);
  for (const x of [-4.7, -1.6, 1.6, 4.7]) box(0.5, 3.6, 0.5, stoneUp, x, 6.3, P0 + 2.9, g);
  box(10.3, 0.5, 3.5, stoneUp, 0, 8.35, P0 + 1.6, g);
  box(10.6, 0.2, 3.8, trim, 0, 8.7, P0 + 1.6, g);
  for (const x of [-3.15, 0, 3.15]) {
    const a = mesh(new THREE.RingGeometry(1.1, 1.35, 12, 1, 0, Math.PI), trim, x, 7.0, P0 + 3.16, g);
    box(1.6, 3.0, 0.1, win, x, 6.0, P0 + 0.06, g);
  }
  for (let i = 0; i < 24; i++) cyl(0.07, 0.07, 0.8, trim, -4.4 + i * 0.383, 4.9, P0 + 3.1, g, 6);
  box(9.2, 0.12, 0.2, trim, 0, 5.34, P0 + 3.1, g);
  /* the double flight: two stairs that rise along the front from left and right to the platform */
  for (const s of [-1, 1]) {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const y = ((i + 1) / n) * 4.4;
      box(0.62, y, 2.2, stone, s * (5.3 + (n - 1 - i) * 0.62), y / 2, P0 + 1.1, g);
    }
    const L = Math.hypot(n * 0.62, 4.4),
      r = box(L, 0.14, 0.2, trim, s * (5 + (n * 0.62) / 2), 2.2 + 1.0, P0 + 2.1, g);
    r.rotation.z = s * -Math.atan2(4.4, n * 0.62);
    for (let i = 0; i < n; i += 1) cyl(0.06, 0.06, 0.95, trim, s * (5.3 + (n - 1 - i) * 0.62), ((i + 1) / n) * 4.4 + 0.47, P0 + 2.1, g, 6);
  }
  g.traverse((o) => (o.userData.far = true));
  return g;
}
/* a gate pier with a ball on top, as in Hakewill's plate of Rose Hall (1825): white, square, a moulded cap */
export function gatePier(h = 3.2, w = 0.8) {
  const g = grp(),
    m = solid(0xe8e2d0, 0.95);
  box(w + 0.16, 0.3, w + 0.16, m, 0, 0.15, 0, g);
  box(w, h, w, m, 0, h / 2, 0, g);
  box(w + 0.24, 0.14, w + 0.24, m, 0, h + 0.07, 0, g);
  box(w + 0.1, 0.12, w + 0.1, m, 0, h + 0.2, 0, g);
  cyl(0.1, 0.14, 0.14, m, 0, h + 0.33, 0, g, 8);
  mesh(new THREE.SphereGeometry(0.24, 12, 10), m, 0, h + 0.6, 0, g);
  return g;
}
/* a low white wall with an iron railing on it, L long along x */
export function railWall(L = 5, h = 1.1) {
  const g = grp();
  box(L, h, 0.4, solid(0xe8e2d0, 0.95), 0, h / 2, 0, g);
  box(L + 0.04, 0.08, 0.5, solid(0xd8d0bc, 0.95), 0, h + 0.04, 0, g);
  for (let x = -L / 2 + 0.15; x <= L / 2 - 0.1; x += 0.22) cyl(0.014, 0.014, 1.0, IRON, x, h + 0.58, 0, g, 5);
  box(L, 0.04, 0.04, IRON, 0, h + 1.0, 0, g);
  box(L, 0.04, 0.04, IRON, 0, h + 0.3, 0, g);
  return g;
}
/* a ruined wall of cut stone, L long: a ragged top, an arched opening if arch is given (its x), grass on the top */
export function ruinWall(L = 9, h = 3, seed = 1, arch = null) {
  const g = grp(),
    r = rng(seed),
    m = std(T.stone([150, 142, 124], [2, 2]), 1),
    md = std(T.stone([128, 122, 108], [1, 1]), 1);
  const n = Math.ceil(L / 1.1);
  for (let i = 0; i < n; i++) {
    const x = -L / 2 + (i + 0.5) * (L / n),
      inArch = arch !== null && Math.abs(x - arch) < 1.0,
      hh = h * (0.55 + r() * 0.45) * (i === 0 || i === n - 1 ? 0.6 : 1);
    if (inArch) {
      box(L / n + 0.02, Math.max(0.4, hh - 2.3), 0.75, m, x, 2.3 + Math.max(0.4, hh - 2.3) / 2, 0, g);
    } else box(L / n + 0.02, hh, 0.75, i % 3 ? m : md, x, hh / 2, 0, g);
    if (!inArch && r() > 0.3) {
      const t = mesh(new THREE.IcosahedronGeometry(0.2, 0), flat([0x5f8a48, 0x6f9a58, 0x4f7a40][(r() * 3) | 0]), x + (r() - 0.5) * 0.3, hh + 0.04, (r() - 0.5) * 0.3, g);
      t.scale.y = 0.6;
    }
  }
  if (arch !== null) {
    const a = mesh(new THREE.TorusGeometry(1.0, 0.14, 5, 12, Math.PI), md, arch, 2.2, 0, g);
    a.scale.z = 4;
  }
  for (let i = 0; i < 5; i++) {
    const s = mesh(new THREE.IcosahedronGeometry(0.22 + r() * 0.2, 0), flat([0xa8a294, 0x8f897c, 0xb5b0a2][i % 3]), -L / 2 + r() * L, 0.12, (r() > 0.5 ? 1 : -1) * (0.6 + r() * 0.6), g);
    s.scale.y = 0.6;
  }
  return g;
}
/* a painted board on two posts: a title and rows of names, facing +z */
export function nameBoard(title, names, foot, w = 3.4, h = 2.0) {
  const g = grp(),
    post = solid(0x4a3626, 0.9);
  for (const s of [-1, 1]) box(0.12, h + 1.0, 0.12, post, s * (w / 2 - 0.2), (h + 1.0) / 2, -0.08, g);
  box(w, h, 0.07, solid(0x26332b, 0.9), 0, 0.9 + h / 2, 0, g);
  box(w + 0.16, 0.08, 0.2, post, 0, 0.9 + h + 0.04, 0, g);
  const tex = cv(1024, Math.round((1024 * h) / w), (x, W, H) => {
    x.fillStyle = "#26332b";
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "#d8c98a";
    x.lineWidth = 5;
    x.strokeRect(14, 14, W - 28, H - 28);
    x.fillStyle = "#f2ead2";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = "bold 50px Georgia, serif";
    x.fillText(title, W / 2, 70, W * 0.9);
    x.font = "44px Georgia, serif";
    const rows = Math.ceil(names.length / 2);
    names.forEach((n, i) => x.fillText(n, i % 2 ? W * 0.72 : W * 0.28, 150 + Math.floor(i / 2) * ((H - 250) / rows) + 24, W * 0.42));
    x.font = "italic 36px Georgia, serif";
    x.fillStyle = "#d8c98a";
    x.fillText(foot, W / 2, H - 56, W * 0.9);
  });
  plane(w - 0.06, h - 0.06, std(tex, 0.9), 0, 0.9 + h / 2, 0.04, g);
  return g;
}
/* a marker on the grass: a low sloped stone with a plate that carries a name. Facing +z. */
export function marker(name) {
  const g = grp(),
    m = std(T.stone([170, 164, 148], [1, 1]), 1);
  box(0.8, 0.5, 0.5, m, 0, 0.25, 0, g);
  const top = box(0.8, 0.08, 0.62, m, 0, 0.56, 0.02, g);
  top.rotation.x = 0.5;
  const tex = cv(384, 256, (x, W, H) => {
    x.fillStyle = "#3a3024";
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "#c8a85a";
    x.lineWidth = 6;
    x.strokeRect(8, 8, W - 16, H - 16);
    x.fillStyle = "#f2e4b8";
    x.textAlign = "center";
    x.textBaseline = "middle";
    const rows = name.split("|");
    rows.forEach((t, i) => {
      x.font = "bold " + (rows.length > 2 ? 52 : 66) + "px Georgia, serif";
      x.fillText(t, W / 2, H / 2 + (i - (rows.length - 1) / 2) * (rows.length > 2 ? 62 : 78), W * 0.88);
    });
  });
  const p = plane(0.66, 0.46, std(tex, 0.8), 0, 0.61, 0.045, g);
  p.rotation.x = -Math.PI / 2 + 0.5;
  return g;
}
/* flowers laid down: a small bunch tied with a ribbon */
export function bunch(seed = 1) {
  const g = grp(),
    r = rng(seed);
  for (let i = 0; i < 8; i++) {
    const s = cyl(0.006, 0.006, 0.3, solid(0x3f7a40, 0.9), (r() - 0.5) * 0.06, 0.03 + r() * 0.02, 0, g, 4);
    s.rotation.x = Math.PI / 2;
    mesh(new THREE.IcosahedronGeometry(0.04, 0), flat([0xd94a4a, 0xf0c040, 0xf2f0ea, 0xe07aa0][i % 4]), s.position.x * 1.6, 0.05 + r() * 0.03, 0.14 + r() * 0.06, g);
  }
  box(0.07, 0.03, 0.03, solid(0xe8e2d0, 0.9), 0, 0.045, -0.03, g);
  return g;
}
/* a basket of cut flowers on a low stand */
export function flowerBasket() {
  /* a crate of rough boards, and on it a round basket woven of split cane with a bent handle, full of flowers to lay at the stones */
  const g = grp(),
    board = std(T.plank([118, 88, 60], 4, [1, 1]), 0.95);
  box(0.6, 0.5, 0.5, board, 0, 0.25, 0, g);
  box(0.64, 0.04, 0.54, solid(0x5a4030, 0.95), 0, 0.5, 0, g);
  const weave = cv(128, 64, (x, W, H) => {
    x.fillStyle = "#9a7438";
    x.fillRect(0, 0, W, H);
    for (let row = 0; row < 8; row++)
      for (let c = 0; c < 16; c++) {
        x.fillStyle = (row + c) % 2 ? "#c49a52" : "#7a5a2a";
        x.fillRect(c * 8, row * 8 + 1, 8, 6);
      }
    x.fillStyle = "rgba(60,40,15,0.6)";
    for (let c = 0; c < 16; c++) x.fillRect(c * 8, 0, 1, H);
  });
  weave.repeat.set(3, 1);
  const cane = std(weave, 0.95),
    basket = vessel([[0.001, 0], [0.15, 0], [0.17, 0.02], [0.23, 0.18], [0.24, 0.2]], { mat: cane, wall: 0.012, segments: 18 });
  basket.position.y = 0.52;
  g.add(basket);
  const rim = mesh(new THREE.TorusGeometry(0.236, 0.014, 6, 24), solid(0x7a5a2a, 0.95), 0, 0.72, 0, g);
  rim.rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 20, Math.PI), solid(0x8a6a34, 0.95), 0, 0.72, 0, g);   /* the handle, over the top */
  const r = rng(3);
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2,
      d = r() * 0.15;
    mesh(new THREE.IcosahedronGeometry(0.045, 0), flat([0xd94a4a, 0xf0c040, 0xf2f0ea, 0xe07aa0][i % 4]), Math.cos(a) * d, 0.7 + r() * 0.05, Math.sin(a) * d, g);
  }
  return g;
}
/* the stone box in the garden that the tour calls a tomb: plain, with a flat top (a general picture) */
export function boxTomb() {
  const g = grp(),
    m = std(T.stone([186, 180, 164], [2, 1]), 1);
  box(2.5, 0.2, 1.4, m, 0, 0.1, 0, g);
  box(2.2, 0.75, 1.1, m, 0, 0.57, 0, g);
  box(2.4, 0.14, 1.3, m, 0, 1.01, 0, g);
  return g;
}
/* a great iron pan from an old boiling house, set on stones as a garden piece */
export function copper() {
  const g = grp();
  const pan = lathe([[0.001, 0.2], [0.5, 0.26], [0.85, 0.5], [0.95, 0.8], [1.0, 0.82], [0.9, 0.5], [0.52, 0.2], [0.001, 0.14]], solid(0x4a3a30, 0.8, 0.3), 16);
  pan.material = solid(0x4a3a30, 0.8, 0.3, { side: THREE.DoubleSide });
  g.add(pan);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * 6.28;
    mesh(new THREE.IcosahedronGeometry(0.22, 0), flat(0x8f897c), Math.cos(a) * 0.5, 0.12, Math.sin(a) * 0.5, g).scale.y = 0.8;
  }
  return g;
}
/* a field of sugar cane: rows of tall leaning blades, as one merged shape. w by d, rows along x. */
let caneM;
export function caneField(w = 30, d = 20, seed = 1) {
  /* cane in rows: each stool is a few pale stalks with long blades that arch out and droop, one merged mesh for the whole field */
  const r = rng(seed),
    pos = [],
    col = [],
    put = (p, c) => {
      pos.push(p[0], p[1], p[2]);
      col.push(c.r, c.g, c.b);
    },
    tri = (a, b, c, k) => {
      put(a, k[0]);
      put(b, k[1]);
      put(c, k[2]);
    };
  caneM ||= new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide });
  for (let z = -d / 2; z <= d / 2; z += 1.2)
    for (let x = -w / 2; x <= w / 2; x += 0.75 + r() * 0.4) {
      const cx = x + (r() - 0.5) * 0.3,
        cz = z + (r() - 0.5) * 0.3,
        H = 2.0 + r() * 0.9,
        g = new THREE.Color().setHSL(0.22 + r() * 0.06, 0.5, 0.3 + r() * 0.1),
        dark = g.clone().multiplyScalar(0.55),
        tip = g.clone().offsetHSL(0.01, 0, 0.1),
        stalk = new THREE.Color(0.62, 0.6, 0.4);
      /* two stalks: thin upright blades of pale yellow-green */
      for (let k = 0; k < 2; k++) {
        const sx = cx + (k - 0.5) * 0.12,
          a = r() * 6;
        const dx = Math.cos(a) * 0.04,
          dz = Math.sin(a) * 0.04;
        tri([sx - dx, 0, cz - dz], [sx + dx, 0, cz + dz], [sx, H * 0.8, cz], [stalk, stalk, stalk]);
      }
      /* five blades from near the top: up, out, then down */
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + r() * 1.2,
          ux = Math.cos(a),
          uz = Math.sin(a),
          L = 1.1 + r() * 0.6,
          y0 = H * (0.45 + r() * 0.4),
          wx = -uz * 0.09,
          wz = ux * 0.09,
          p0 = [cx, y0, cz],
          p1 = [cx + ux * L * 0.5, y0 + 0.45, cz + uz * L * 0.5],
          p2 = [cx + ux * L, y0 - 0.15 - r() * 0.3, cz + uz * L];
        tri([p0[0] - wx, p0[1], p0[2] - wz], [p0[0] + wx, p0[1], p0[2] + wz], [p1[0] + wx, p1[1], p1[2] + wz], [dark, dark, g]);
        tri([p0[0] - wx, p0[1], p0[2] - wz], [p1[0] + wx, p1[1], p1[2] + wz], [p1[0] - wx, p1[1], p1[2] - wz], [dark, g, g]);
        tri([p1[0] - wx, p1[1], p1[2] - wz], [p1[0] + wx, p1[1], p1[2] + wz], p2, [g, g, tip]);
      }
    }
  /* the shade inside the rows, so no bare ground shows between the stools */
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, caneM);
  const under = new THREE.Mesh(new THREE.BoxGeometry(w - 1.0, 0.8, d - 1.0), solid(0x7a9a44, 1));
  under.position.y = 0.4;
  m.add(under);
  m.userData.far = true;
  m.traverse((o) => {
    o.userData.noBatch = true;
    o.name = "terrain";
  });
  return m;
}
/* a wooden finger post with one or two arms */
export function fingerPost(arms = ["GREAT HOUSE"]) {
  const g = grp();
  box(0.1, 2.3, 0.1, solid(0x4a3626, 0.9), 0, 1.15, 0, g);
  arms.forEach((t, i) => {
    const tex = cv(256, 56, (x, W, H) => {
      x.fillStyle = "#efe6cc";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#2b2620";
      x.font = "bold 30px Georgia, serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(t, W / 2, H / 2 + 2, W * 0.9);
    });
    const b = box(1.0, 0.2, 0.04, solid(0xefe6cc, 0.9), 0.45 * (i % 2 ? -1 : 1), 2.05 - i * 0.28, 0, g);
    for (const s of [1, -1]) {
      const p = plane(0.96, 0.18, std(tex, 0.9), b.position.x, b.position.y, s * 0.022, g);
      if (s < 0) p.rotation.y = Math.PI;
    }
  });
  return g;
}
/* The Rose Hall Journal opened on the reading table for the camera scene: two pages either side of the spine and one leaf that turns.
   spreads: [[left, right], ...], each page a list of rows: a string, or [name, words] for a name and the words the book gives it, or
   null for a row of faint writing nobody can read from here. The layout of the real book is not known: the pages are the game's picture,
   the words on them are only the book's own (docs/games/rose-hall.md). userData.turn(k): k = 1.5 is halfway from the second spread to the third. */
export function openLedger(spreads, w = 0.31, d = 0.42) {
  const g = still(grp()),
    page = (rows, seed) =>
      cv(512, 694, (x, W, H) => {
        x.fillStyle = "#e9ddc0";
        x.fillRect(0, 0, W, H);
        const r = rng(seed);
        for (let i = 0; i < 9; i++) {
          x.fillStyle = "rgba(150,110,60," + (0.03 + r() * 0.05) + ")";
          x.beginPath();
          x.arc(r() * W, r() * H, 30 + r() * 90, 0, Math.PI * 2);
          x.fill();
        }
        x.strokeStyle = "rgba(120,96,70,0.35)";
        x.lineWidth = 1;
        for (let y = 70; y < H - 20; y += 44) {
          x.beginPath();
          x.moveTo(24, y + 10);
          x.lineTo(W - 24, y + 10);
          x.stroke();
        }
        x.fillStyle = "#3a2a1c";
        x.strokeStyle = "rgba(58,42,28,0.5)";
        x.textBaseline = "alphabetic";
        let y = 70;
        for (const row of rows) {
          if (row === null) {
            x.lineWidth = 2;
            x.beginPath();
            x.moveTo(34, y);
            for (let k = 34; k < W - 40 - r() * 120; k += 6) x.lineTo(k, y - 4 - r() * 8);
            x.stroke();
            y += 44;
          } else if (Array.isArray(row)) {
            x.font = "bold italic 34px Georgia, serif";
            x.fillText(row[0], 34, y, W - 60);
            y += 44;
            if (row[1]) {
              x.font = "italic 30px Georgia, serif";
              x.fillText(row[1], 70, y, W - 96);
              y += 44;
            }
          } else {
            x.font = "italic 30px Georgia, serif";
            x.fillText(row, 34, y, W - 60);
            y += 44;
          }
        }
      }),
    tex = spreads.map(([a, b], i) => [page(a, i * 2 + 3), page(b, i * 2 + 4)]),
    mat = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.95 }),
    leafPlane = (m, x, y) => {
      const geo = new THREE.PlaneGeometry(w, d);
      geo.rotateX(-Math.PI / 2);
      return mesh(geo, m, x, y, 0);
    };
  /* the boards, the block of pages under each side, the spine */
  box(w * 2 + 0.05, 0.012, d + 0.03, solid(0x5a3a24, 0.8), 0, 0.006, 0, g);
  for (const s of [-1, 1]) box(w - 0.01, 0.022, d - 0.01, solid(0xd8cbaa, 0.95), s * (w / 2 + 0.002), 0.023, 0, g);
  const left = mat(tex[0][0]),
    right = mat(tex[0][1]),
    L = leafPlane(left, -w / 2 - 0.002, 0.0345),
    Rt = leafPlane(right, w / 2 + 0.002, 0.0345);
  g.add(L, Rt);
  const pivot = grp(g, 0, 0.036, 0),
    front = mat(tex[0][1]),
    back = mat(tex[0][0]),
    F = leafPlane(front, w / 2, 0.0006),
    B = leafPlane(back, w / 2, -0.0006);
  B.rotation.z = Math.PI;
  pivot.add(F, B);
  g.userData.turn = (k) => {
    const n = tex.length - 1,
      i = Math.max(0, Math.min(n, Math.floor(k))),
      f = i >= n ? 0 : Math.max(0, Math.min(1, k - i));
    left.map = tex[i][0];
    right.map = tex[f > 0 ? i + 1 : i][1];
    pivot.visible = f > 0;
    if (f > 0) {
      front.map = tex[i][1];
      back.map = tex[i + 1][0];
      const e = f * f * (3 - 2 * f);
      pivot.rotation.z = e * Math.PI;
      pivot.position.y = 0.036 + Math.sin(e * Math.PI) * 0.004;
    }
  };
  g.userData.turn(0);
  return g;
}
export { lathe, still, quiet, at };
/* Dressed white limestone (ashlar), as St James Parish Church is built: pale blocks in level courses with fine joints. One tile is
   3 blocks wide and 4 courses high; ashlarFit() maps it by real size onto every box that uses it, so courses run level across a wall. */
let ashlarM = null;
export function ashlar() {
  ashlarM ||= std(
    cv(256, 256, (x, W, H) => {
      x.fillStyle = "#e6dfcd";
      x.fillRect(0, 0, W, H);
      const r = rng(7),
        ch = H / 4;
      for (let row = 0; row < 4; row++) {
        const off = row % 2 ? W / 6 : 0;
        for (let i = -1; i < 4; i++) {
          const x0 = off + (i * W) / 3,
            t = 0.93 + r() * 0.1;
          x.fillStyle = `rgb(${(228 * t) | 0},${(221 * t) | 0},${(204 * t) | 0})`;
          x.fillRect(x0 + 2, row * ch + 2, W / 3 - 4, ch - 4);
          for (let k = 0; k < 6; k++) {
            x.fillStyle = `rgba(150,140,118,${0.05 + r() * 0.06})`;
            x.beginPath();
            x.ellipse(x0 + r() * (W / 3), row * ch + r() * ch, 4 + r() * 14, 2 + r() * 6, r() * 3, 0, 7);
            x.fill();
          }
        }
      }
      x.fillStyle = "rgba(120,110,92,0.55)";
      for (let row = 0; row <= 4; row++) x.fillRect(0, row * ch - 1, W, 2);
      for (let row = 0; row < 4; row++) for (let i = 0; i <= 3; i++) x.fillRect((row % 2 ? W / 6 : 0) + (i * W) / 3 - 1, row * ch, 2, ch);
    }),
    0.9,
  );
  return ashlarM;
}
export function ashlarFit(root, tile = [1.8, 1.2]) {
  root.traverse((o) => {
    if (!o.isMesh || o.material !== ashlarM || !o.geometry.parameters?.width || o.userData.fitted) return;
    o.userData.fitted = true;
    const { width: w, height: h, depth: d } = o.geometry.parameters,
      uv = o.geometry.attributes.uv,
      x0 = o.position.x - w / 2,
      y0 = o.position.y - h / 2;
    for (let f = 0; f < 6; f++) {
      const [su, sv, ou, ov] = f < 2 ? [d, h, 0, y0] : f < 4 ? [w, d, x0, 0] : [w, h, x0, y0];
      for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        uv.setXY(i, (uv.getX(i) * su + ou) / tile[0], (uv.getY(i) * sv + ov) / tile[1]);
      }
    }
    uv.needsUpdate = true;
  });
}
