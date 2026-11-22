/* The things Rose Hall, the church, the archives and the estate are furnished with. Each builder returns a THREE.Group standing on y = 0
   at its own origin, facing +z. What follows a source and what is a general picture is in docs/games/rose-hall.md ("Places").
   Candles: a fixture marks where each flame burns (flameAt); the place gathers the marks of a room into one set of points (flameSet), so a
   room full of candles is one draw call that can be put out and lit again. */
import * as THREE from "three";
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
    n.userData.noAudit = true;
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
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: T.flame(), size: 0.3, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    pts.frustumCulled = false;
    pts.userData.noBatch = true;
    pts.userData.on = (lit) => (pts.visible = lit);
    root.add(pts);
    out[name] = pts;
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
  m.userData.noAudit = true;
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
  const dish = lathe([[0.001, 0.14], [0.03, 0.135], [0.02, 0.12], [0.12, 0.08], [0.16, 0.02], [0.17, 0]], SILVER, 14);
  dish.position.set(w * 0.28, top, 0);
  g.add(dish);
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
  face.userData.noAudit = true;
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
  plane(w, h, pane, 0, h / 2, -0.2, g).userData.noAudit = true;
  for (const s of [-1, 1]) {
    box(0.07, h, 0.3, WHITE, s * (w / 2 + 0.035), h / 2, -0.06, g);
    box(0.02, h - 0.1, 0.24, solid(0xd2cab4, 0.9), s * (w / 2 - 0.012), h / 2, -0.07, g);   /* shutters folded into the reveal */
  }
  box(w + 0.14, 0.07, 0.3, WHITE, 0, h + 0.035, -0.06, g);
  box(w + 0.24, 0.06, 0.36, WHITE, 0, -0.03, -0.04, g);
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
/* a full-length portrait in a gilt frame, flat on a wall and facing +z. The painting is drawn in code: a dark room, a standing man in a
   coat, no face that could be anyone's (a general picture: the paintings Waddell saw in 1830 are not known to survive).
   userData.show(lit) lifts the gloom from it. */
export function portrait(w = 1.15, h = 2.0, coat = "#2f3a4a", seed = 1) {
  const g = grp(),
    r = rng(seed);
  box(w, h, 0.07, GILT, 0, 0, 0.035, g);
  box(w - 0.1, h - 0.1, 0.02, solid(0x6a5020, 0.5, 0.5), 0, 0, 0.065, g);
  const tex = cv(128, 224, (x, W, H) => {
    const bg = x.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#3a2c1e");
    bg.addColorStop(1, "#15100c");
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = "rgba(120,90,50,0.35)";
    x.fillRect(W * (0.62 + r() * 0.1), H * 0.1, W * 0.3, H * 0.55);   /* a column or a curtain behind */
    x.fillStyle = "#1a1512";
    x.fillRect(W * 0.38, H * 0.62, W * 0.1, H * 0.3);   /* legs */
    x.fillRect(W * 0.52, H * 0.62, W * 0.1, H * 0.3);
    x.fillStyle = "#d9d2c0";
    x.fillRect(W * 0.39, H * 0.6, W * 0.22, H * 0.06);   /* breeches top */
    x.fillStyle = coat;
    x.beginPath();
    x.moveTo(W * 0.3, H * 0.3);
    x.lineTo(W * 0.7, H * 0.3);
    x.lineTo(W * 0.74, H * 0.64);
    x.lineTo(W * 0.26, H * 0.64);
    x.fill();
    x.fillStyle = "#e8e2d0";
    x.fillRect(W * 0.46, H * 0.3, W * 0.08, H * 0.12);   /* neckcloth */
    x.fillStyle = "#b98f6c";
    x.beginPath();
    x.ellipse(W * 0.5, H * 0.23, W * 0.09, H * 0.065, 0, 0, 7);   /* a head, turned to shadow */
    x.fill();
    x.fillStyle = "rgba(20,14,10,0.45)";
    x.fillRect(W * 0.5, H * 0.16, W * 0.1, H * 0.14);
    x.fillStyle = "#2a2018";
    x.beginPath();
    x.ellipse(W * 0.5, H * 0.185, W * 0.095, H * 0.035, 0, Math.PI, 0);   /* hair */
    x.fill();
    const dd = x.getImageData(0, 0, W, H);
    for (let i = 0; i < dd.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      dd.data[i] += n;
      dd.data[i + 1] += n;
      dd.data[i + 2] += n;
    }
    x.putImageData(dd, 0, 0);
  });
  plane(w - 0.2, h - 0.2, new THREE.MeshBasicMaterial({ map: tex, color: 0xb0a898 }), 0, 0, 0.078, g).userData.noAudit = true;
  const gloom = plane(w - 0.2, h - 0.2, new THREE.MeshBasicMaterial({ color: 0x050403, transparent: true, opacity: 0.72 }), 0, 0, 0.082, g);
  quiet(gloom);
  g.userData.show = (lit) => (gloom.visible = !lit);
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
  /* the two upper flights, back toward the front of the hall along the side, rising out of sight through the ceiling */
  const up = Math.ceil((H - top) / rise);
  for (const s of [-1, 1])
    for (let i = 0; i < up; i++) {
      const y = top + rise * (i + 1),
        z = run - tread * (i + 0.5);
      if (z < -0.2) break;
      box(1.2, 0.06, tread + 0.02, MAHOG, s * (W / 2 + 0.7), y, z, g);
      box(1.2, rise, 0.03, MAHOG_DARK, s * (W / 2 + 0.7), y - rise / 2, z + tread / 2, g);
      box(0.06, y, 0.08, MAHOG_DARK, s * (W / 2 + 1.27), y / 2, z, g);   /* the string against the wall carries each tread */
    }
  /* balusters and rails on the middle flight and the landing */
  const rail = (x0, y0, z0, x1, y1, z1) => {
    const L = Math.hypot(x1 - x0, y1 - y0, z1 - z0),
      b = box(0.07, 0.06, L, MAHOG, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, g);
    b.lookAt(g.localToWorld(new THREE.Vector3(x1, y1, z1)));
    return b;
  };
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
  plane(w, h, archTex, 0, h / 2, -0.12, g).userData.noAudit = true;
  box(w + 0.3, 0.1, 0.36, solid(0xd8d0bc, 1), 0, -0.05, -0.02, g);
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
/* The monument to Rosa Palmer, by John Bacon, 1794: white marble on a dark ground. A general picture in the manner of Bacon's wall
   monuments (a mourning woman who leans on an urn, above the words): it was not modelled from a photograph, and the doc says so.
   The words on the tablet are the monument's own first lines. Flat on a wall, facing +z; origin at the middle of the tablet's foot. */
export function rosaMonument() {
  const g = grp();
  /* the dark ground: a tall pointed slab */
  const slab = new THREE.Shape();
  slab.moveTo(-1.05, 0.1);
  slab.lineTo(1.05, 0.1);
  slab.lineTo(1.05, 1.5);
  slab.lineTo(0, 4.1);
  slab.lineTo(-1.05, 1.5);
  g.add(new THREE.Mesh(new THREE.ExtrudeGeometry(slab, { depth: 0.06, bevelEnabled: false }), SLATE));
  /* the tablet and its mouldings */
  box(1.7, 1.05, 0.1, MARBLE, 0, 0.72, 0.1, g);
  box(1.9, 0.09, 0.2, MARBLE, 0, 1.29, 0.12, g);
  box(1.84, 0.05, 0.16, MARBLE, 0, 1.36, 0.11, g);
  box(1.9, 0.1, 0.2, MARBLE, 0, 0.15, 0.12, g);
  const apron = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16, 1, false, Math.PI / 2, Math.PI), MARBLE, 0, 0.1, 0.1, g);
  apron.rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) box(0.12, 0.26, 0.14, MARBLE, s * 0.84, -0.03, 0.1, g);
  const tex = cv(768, 474, (x, W, H) => {
    x.fillStyle = "#f2f0ea";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#2b2620";
    x.textAlign = "center";
    x.textBaseline = "middle";
    const rows = ["Near this place", "are deposited the Remains of", "Mrs ROSA PALMER,", "who died on the first day of May 1790.", "Her manners were open,", "cheerful and agreeable"];
    rows.forEach((t, i) => {
      x.font = (i === 2 ? "bold 50px" : "italic 36px") + " Georgia, serif";
      x.fillText(t, W / 2, 56 + i * 72, W * 0.92);
    });
  });
  plane(1.56, 0.96, std(tex, 0.6), 0, 0.72, 0.152, g);
  /* the pedestal, the urn and the mourning woman, in the round but shallow */
  const fig = grp(g, 0, 1.38, 0.12);
  box(0.5, 0.62, 0.3, MARBLE, 0.3, 0.31, 0.06, fig);
  box(0.58, 0.05, 0.36, MARBLE, 0.3, 0.645, 0.06, fig);
  const urn = lathe([[0.05, 0], [0.09, 0.03], [0.04, 0.07], [0.05, 0.1], [0.19, 0.24], [0.21, 0.36], [0.14, 0.45], [0.09, 0.47], [0.12, 0.5], [0.06, 0.56], [0.03, 0.6], [0.045, 0.63], [0.001, 0.66]], MARBLE, 16);
  urn.position.set(0.3, 0.67, 0.06);
  urn.scale.z = 0.7;
  fig.add(urn);
  const robe = lathe([[0.27, 0], [0.25, 0.3], [0.2, 0.75], [0.17, 1.0], [0.19, 1.2], [0.15, 1.34], [0.07, 1.4]], MARBLE, 14);
  robe.position.set(-0.3, 0, 0.06);
  robe.scale.z = 0.62;
  robe.rotation.z = -0.07;
  fig.add(robe);
  const head = mesh(new THREE.SphereGeometry(0.105, 12, 10), MARBLE, -0.2, 1.47, 0.08, fig);
  head.scale.set(0.9, 1.1, 0.9);
  const veil = mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), MARBLE, -0.21, 1.48, 0.06, fig);
  veil.rotation.z = -0.4;
  const arm = cyl(0.045, 0.04, 0.52, MARBLE, -0.02, 1.2, 0.1, fig, 8);
  arm.rotation.z = -1.15;   /* the arm that rests on the urn */
  const drape = box(0.34, 0.5, 0.1, MARBLE, 0.12, 0.93, 0.1, fig);
  drape.rotation.z = 0.2;
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
  plane(w, h, louvreM, 0, h / 2, -0.1, g).userData.noAudit = true;
  const fm = solid(0x9aa09a, 0.5, 0.4);
  box(w + 0.1, 0.05, 0.12, fm, 0, h + 0.025, -0.06, g);
  box(w + 0.1, 0.05, 0.16, fm, 0, -0.025, -0.05, g);
  for (const x of [-w / 2, 0, w / 2]) box(0.05, h, 0.12, fm, x, h / 2, -0.06, g);
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
/* a round wall clock, facing +z */
export function wallClock() {
  const g = grp();
  cyl(0.2, 0.2, 0.05, solid(0x2b2d31, 0.6), 0, 0, 0.025, g, 20).rotation.x = Math.PI / 2;
  const f = mesh(new THREE.CircleGeometry(0.18, 20), std(T.clock(), 0.6), 0, 0, 0.052, g);
  f.userData.noAudit = true;
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
    trim = solid(0xe8e2d0, 0.9);
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
      a.userData.noAudit = true;
    }
    for (const [y, h] of [[6.6, 2.6], [10.6, 2.2]]) {
      if (mid && y < 8) continue;
      box(1.3, h, 0.1, dark, x, y, D / 2 + 0.01, g);
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
    a.userData.noAudit = true;
  }
  box(10.3, 0.2, 3.5, trim, 0, 4.4, P0 + 1.6, g);
  for (const x of [-4.7, -1.6, 1.6, 4.7]) box(0.5, 3.6, 0.5, stoneUp, x, 6.3, P0 + 2.9, g);
  box(10.3, 0.5, 3.5, stoneUp, 0, 8.35, P0 + 1.6, g);
  box(10.6, 0.2, 3.8, trim, 0, 8.7, P0 + 1.6, g);
  for (const x of [-3.15, 0, 3.15]) {
    const a = mesh(new THREE.RingGeometry(1.1, 1.35, 12, 1, 0, Math.PI), trim, x, 7.0, P0 + 3.16, g);
    a.userData.noAudit = true;
    box(1.6, 3.0, 0.1, dark, x, 6.0, P0 + 0.06, g);
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
  const g = grp();
  box(0.6, 0.5, 0.5, solid(0x6e5238, 0.9), 0, 0.25, 0, g);
  g.add(at(lathe([[0.16, 0], [0.24, 0.2], [0.25, 0.22]], solid(0xb08a48, 0.95), 10), 0, 0.5, 0));
  const r = rng(3);
  for (let i = 0; i < 16; i++) mesh(new THREE.IcosahedronGeometry(0.05, 0), flat([0xd94a4a, 0xf0c040, 0xf2f0ea, 0xe07aa0][i % 4]), (r() - 0.5) * 0.34, 0.74 + r() * 0.08, (r() - 0.5) * 0.34, g);
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
  const r = rng(seed),
    geos = [];
  caneM ||= new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide, flatShading: true });
  for (let z = -d / 2; z <= d / 2; z += 1.5)
    for (let x = -w / 2; x <= w / 2; x += 0.9 + r() * 0.5) {
      const h = 2.2 + r() * 1.1,
        geo = new THREE.ConeGeometry(0.45 + r() * 0.2, h, 4, 1, true),
        c = new THREE.Color().setHSL(0.24 + r() * 0.05, 0.45, 0.3 + r() * 0.14),
        col = new Float32Array(geo.attributes.position.count * 3);
      for (let i = 0; i < col.length; i += 3) {
        const top = geo.attributes.position.getY(i / 3) > 0 ? 1.25 : 0.8;
        col[i] = c.r * top;
        col[i + 1] = c.g * top;
        col[i + 2] = c.b * top;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.rotateX(Math.PI);   /* point down: a spray of blades opening upward */
      geo.rotateZ((r() - 0.5) * 0.3);
      geo.translate(x + (r() - 0.5) * 0.4, h / 2, z + (r() - 0.5) * 0.5);
      geos.push(geo);
    }
  const m = new THREE.Mesh(mergeGeometries(geos), caneM);
  m.userData.far = true;
  m.userData.noBatch = true;
  m.name = "terrain";
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
export { lathe, still, quiet, at };
