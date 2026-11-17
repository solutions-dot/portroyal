/* Kingston, 1966: the buildings, vehicles and street things of the new chapter places (downtown street, Parade bus park, the evening lane).
   General pictures, not surveyed copies: downtown shops with covered sidewalks (piazzas) on columns, plastered houses with louvre windows,
   zinc fences, a single-deck bus in grey and dark green (the colours a Gleaner feature gives for JOS buses), 1960s cars, flags of Jamaica
   (1962) and of Ethiopia. Every builder returns a group standing on y = 0. Shop names are made up; no real business or brand is shown. */
import * as THREE from "three";
import { louvreDoor } from "./doors.js";
import { T, cv, std, solid, flat, glow, mesh, box, cyl, plane, grp, rng } from "./gfx.js";

const IRON = solid(0x2b2d31, 0.6, 0.3),
  WOOD = solid(0x7a5a3c, 0.95),
  WOOD_DK = solid(0x3d2d20, 0.95),
  WHITE = solid(0xece4d0, 0.9),
  RUBBER = solid(0x1d1f1e, 0.9),
  CHROME = solid(0xc4c8cb, 0.3, 0.8),
  GLASS = solid(0x2b3f48, 0.25, 0.2),
  CONCRETE = solid(0xb9b4a6, 0.95);
const memo = {};
const once = (k, f) => memo[k] || (memo[k] = f());

/* ---------- cloth: flags and a painted shop sign ---------- */
export function flagTexture(kind) {
  return once("flag" + kind, () =>
    cv(192, 96, (x, W, H) => {
      if (kind === "jamaica") {
        // black, green and gold: a gold saltire, green above and below, black at the hoist and the fly (adopted 1962)
        x.fillStyle = "#0f6b38";
        x.fillRect(0, 0, W, H);
        x.fillStyle = "#151515";
        for (const s of [0, 1]) {
          x.beginPath();
          x.moveTo(s * W, 0);
          x.lineTo(W / 2, H / 2);
          x.lineTo(s * W, H);
          x.fill();
        }
        x.strokeStyle = "#f1bf2a";
        x.lineWidth = 14;
        x.beginPath();
        x.moveTo(0, 0);
        x.lineTo(W, H);
        x.moveTo(W, 0);
        x.lineTo(0, H);
        x.stroke();
      } else {
        // green, gold and red bands (the colours the crowd waved; the Gleaner calls them red, green and gold)
        ["#2f7f43", "#f0c231", "#c23a2e"].forEach((c, i) => {
          x.fillStyle = c;
          x.fillRect(0, (i * H) / 3, W, H / 3 + 1);
        });
      }
    }),
  );
}
const clothMat = (kind) =>
  once("cloth" + kind, () => new THREE.MeshStandardMaterial({ map: flagTexture(kind), roughness: 0.9, side: THREE.DoubleSide }));
/* a flag on a short pole, sticking out from a wall at 40 degrees (the bracket touches the wall at x = 0, the pole points along +x) */
export function wallFlag(kind = "jamaica", L = 1.6) {
  const g = grp();
  box(0.06, 0.24, 0.16, IRON, 0.03, 0, 0, g);
  const arm = grp(g, 0.05, 0, 0);
  arm.rotation.z = -0.7;
  cyl(0.022, 0.022, L, WOOD_DK, 0, L / 2, 0, arm, 6);
  // the cloth hangs from the outer part of the pole, in the plane across the street
  plane(0.9, 0.45, clothMat(kind), 0.46, L - 0.3, 0, arm);
  return g;
}
/* a tall flagpole in a concrete base, with its flag */
export function flagPole(kind = "jamaica", h = 5) {
  const g = grp();
  box(0.5, 0.25, 0.5, CONCRETE, 0, 0.125, 0, g);
  cyl(0.04, 0.05, h, WHITE, 0, h / 2 + 0.2, 0, g, 8);
  mesh(new THREE.SphereGeometry(0.07, 8, 6), solid(0xc9a43a, 0.4, 0.5), 0, h + 0.24, 0, g);
  const f = plane(1.3, 0.65, clothMat(kind), 0.67, h - 0.2, 0, g);
  return g;
}
/* a small hand flag (for bundles and for children) */
export function handFlag(kind = "ethiopia", s = 1) {
  const g = grp();
  cyl(0.008 * s, 0.008 * s, 0.55 * s, WOOD, 0, 0.275 * s, 0, g, 5);
  plane(0.3 * s, 0.15 * s, clothMat(kind), 0.15 * s, 0.47 * s, 0, g);
  return g;
}
/* a bundle of hand flags tied with string, lying on its side, about 40 cm long (carried by the player) */
export function flagBundle() {
  const g = grp();
  for (let i = 0; i < 7; i++) {
    const f = handFlag(i % 3 === 2 ? "jamaica" : "ethiopia", 0.75);
    f.rotation.z = Math.PI / 2;
    f.rotation.x = (i - 3) * 0.12;
    f.position.set(0.2, 0.025 + (i % 2) * 0.012, (i - 3) * 0.02);
    g.add(f);
  }
  box(0.03, 0.06, 0.14, solid(0xd8cfb4), 0.08, 0.03, 0, g);
  return g;
}
/* string of little pennants in red, gold and green, and in black, green and gold, between two points (local x from 0 to L, sagging) */
export function pennants(L = 6, sag = 0.4) {
  const g = grp(),
    n = Math.max(4, Math.round(L / 0.45)),
    cols = [0xc23a2e, 0xf0c231, 0x2f7f43, 0x151515, 0x0f6b38, 0xf1bf2a];
  const line = new THREE.MeshBasicMaterial({ color: 0x2a2a2a });
  for (let i = 0; i < n; i++) {
    const t0 = i / n,
      t1 = (i + 1) / n,
      y0 = -sag * 4 * t0 * (1 - t0),
      y1 = -sag * 4 * t1 * (1 - t1);
    const seg = box(Math.hypot(L / n, y1 - y0), 0.012, 0.012, line, ((t0 + t1) / 2) * L, (y0 + y1) / 2, 0, g);
    seg.rotation.z = Math.atan2(y1 - y0, L / n);
    const tri = new THREE.Shape([new THREE.Vector2(-0.12, 0), new THREE.Vector2(0.12, 0), new THREE.Vector2(0, -0.26)]);
    const p = mesh(new THREE.ShapeGeometry(tri), solid(cols[i % cols.length], 0.9, 0, { side: THREE.DoubleSide }), ((t0 + t1) / 2) * L, (y0 + y1) / 2, 0, g);
    p.material = once("pen" + (i % cols.length), () => new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.9, side: THREE.DoubleSide }));
  }
  return g;
}
/* a painted fascia sign (both faces drawn, so it reads from the street either way) */
export function shopSign(text, w = 4, h = 0.55, bg = "#efe6c8", fg = "#24302b") {
  const t = cv(1024, Math.round((1024 * h) / w), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = fg;
    x.lineWidth = 8;
    x.strokeRect(10, 10, W - 20, H - 20);
    x.fillStyle = fg;
    x.font = "700 " + Math.round(H * 0.56) + "px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2 + 3, W * 0.9);
  });
  const g = grp(),
    m = std(t, 0.85);
  box(w + 0.08, h + 0.08, 0.05, WOOD_DK, 0, 0, 0, g);
  plane(w, h, m, 0, 0, 0.03, g);
  plane(w, h, m, 0, 0, -0.03, g).rotation.y = Math.PI;
  return g;
}

/* ---------- downtown buildings ---------- */
/* A downtown building with a piazza: the shop wall stands at local x = 0 (the street is towards +x), the covered sidewalk runs from x = 0 to
   x = P on columns, and an upper floor (when two storeys) spans over it. The building runs `len` along z. opts: { colour, trim, storeys, sign,
   signBg, signFg, depth, flag, seed }. Returns the group; g.userData.cols lists the column centres (local x, z) for walking walls. */
export function piazzaBuilding(len = 9, opts = {}) {
  const o = { colour: [228, 214, 180], trim: 0x2f5e4e, storeys: 2, depth: 6, P: 2.45, seed: 1, ...opts },
    g = grp(),
    r = rng(o.seed),
    H1 = 3.3,
    H2 = 2.9,
    P = o.P;
  const wallT = T.plaster(o.colour, [len / 4, 1]).clone();
  wallT.needsUpdate = true;
  wallT.repeat.set(len / 4, 1);
  const wallM = std(wallT, 0.92),
    trimM = solid(o.trim, 0.8);
  // the shop block, its front at x = 0
  box(o.depth, H1, len - 0.06, wallM, -o.depth / 2, H1 / 2, 0, g);
  // shop front: a wide opening (dark inside), two display windows with frames and a stall riser
  const open = Math.min(2.6, len * 0.3);
  box(0.04, 2.5, open, o.lit ? glow(0xe9b870) : solid(0x1f1a16, 0.95), 0.02, 1.25, 0, g);
  for (const s of [-1, 1]) {
    const zc = s * (open / 2 + 1.0);
    box(0.06, 1.5, 1.7, GLASS, 0.03, 1.55, zc, g);
    box(0.08, 0.75, 1.9, trimM, 0.04, 0.38, zc, g);
    box(0.09, 0.08, 1.9, trimM, 0.05, 2.33, zc, g);
    for (const dz of [-0.85, 0, 0.85]) box(0.09, 1.5, 0.05, trimM, 0.05, 1.55, zc + dz, g);
  }
  for (const s of [-1, 1]) box(0.1, 2.6, 0.12, trimM, 0.05, 1.3, s * (open / 2 + 0.06), g);
  box(0.1, 0.12, open + 0.2, trimM, 0.05, 2.56, 0, g);
  // the piazza: columns at the kerb, a beam along their tops, a sidewalk slab
  const cols = [];
  const nC = Math.max(2, Math.round(len / 3));
  for (let i = 0; i <= nC; i++) {
    const z = -len / 2 + 0.25 + (i * (len - 0.5)) / nC;
    box(0.28, H1, 0.28, solid(0xe8e1cc, 0.9), P - 0.16, H1 / 2, z, g);
    box(0.4, 0.2, 0.4, solid(0xe8e1cc, 0.9), P - 0.16, 0.1, z, g);
    cols.push([P - 0.16, z]);
  }
  box(0.32, 0.44, len, trimM, P - 0.16, H1 - 0.22, 0, g);
  if (o.storeys === 2) {
    // the upper floor over the piazza, its windows with louvred shutters, a cornice and a parapet
    box(o.depth + P, H2, len - 0.06, wallM, (P - o.depth) / 2, H1 + H2 / 2, 0, g);
    box(0.36, 0.22, len, solid(0xe8e1cc, 0.9), P + 0.05, H1 + H2 - 0.05, 0, g);
    box(o.depth + P, 0.5, len - 0.06, wallM, (P - o.depth) / 2, H1 + H2 + 0.25, 0, g);
    const nW = Math.max(2, Math.floor(len / 2.6));
    for (let i = 0; i < nW; i++) {
      const z = -len / 2 + (len / nW) * (i + 0.5);
      box(0.05, 1.45, 0.95, GLASS, P + 0.01, H1 + 1.35, z, g);
      box(0.07, 0.07, 1.05, WHITE, P + 0.03, H1 + 2.1, z, g);
      box(0.07, 0.07, 1.05, WHITE, P + 0.03, H1 + 0.6, z, g);
      box(0.07, 1.5, 0.06, WHITE, P + 0.03, H1 + 1.35, z, g);
      // jalousie shutters, one each side, a little open
      for (const s of [-1, 1]) {
        const sh = grp(g, P + 0.04, H1 + 1.35, z + s * 0.5);
        sh.rotation.y = s * 0.35;
        box(0.05, 1.45, 0.48, trimM, 0, 0, s * 0.24, sh);
        for (let k = 0; k < 9; k++) box(0.07, 0.03, 0.44, solid(0x1e3a30, 0.8), 0.02, -0.62 + k * 0.155, s * 0.24, sh);
      }
    }
  } else {
    // one storey: a zinc awning roof over the piazza and a stepped false front
    const zt = T.zinc([150, 150, 146]).clone();
    zt.needsUpdate = true;
    zt.repeat.set(len / 2, 1);
    const roof = box(P + 0.3, 0.06, len, std(zt, 0.7), P / 2, H1 + 0.08, 0, g);
    roof.rotation.z = -0.08;
    box(0.3, 1.0 + r() * 0.4, len - 0.06, wallM, -0.15, H1 + 0.5, 0, g);
    box(o.depth, 0.3, len - 0.06, wallM, -o.depth / 2, H1 + 0.15, 0, g);
  }
  if (o.sign) {
    const s = shopSign(o.sign, Math.min(len - 1.4, 5.2), 0.5, o.signBg, o.signFg);
    s.position.set(P + 0.03, H1 - 0.22, 0);
    s.rotation.y = Math.PI / 2;
    g.add(s);
  }
  if (o.flag && o.storeys === 2) {
    const f = wallFlag(o.flag);
    f.position.set(P + 0.06, H1 + 2.45, len * 0.32);
    g.add(f);
  }
  g.userData.cols = cols;
  return g;
}
/* a far building for the skyline (no detail; outside the bounds) */
export function farBlock(w, h, d, colour = 0xd8cfb4) {
  const g = grp();
  box(w, h, d, flat(colour), 0, h / 2, 0, g);
  box(w + 0.2, 0.3, d + 0.2, flat(0xece4d0), 0, h, 0, g);
  return g;
}
/* a church tower with a clock face, for the view down the street towards the Parade (general, not a copy of a building) */
export function churchTower(h = 18) {
  const g = grp(),
    m = flat(0xd6cdb4);
  box(5, h, 5, m, 0, h / 2, 0, g);
  box(5.6, 0.5, 5.6, flat(0xe6dec8), 0, h, 0, g);
  const roof = mesh(new THREE.ConeGeometry(3.6, 4.5, 4), flat(0x6d6f6a), 0, h + 2.5, 0, g);
  roof.rotation.y = Math.PI / 4;
  const face = plane(1.8, 1.8, std(T.clock(), 0.8), 0, h - 2.2, 2.52, g);
  return g;
}

/* ---------- houses and yards ---------- */
/* a plastered house of the 1950s and 60s: concrete walls in a pale colour, glass louvre windows, a hipped zinc roof and a front veranda on
   square posts with a low patterned rail. The front faces +z. opts: { colour, trim, veranda, lit } (lit: the windows glow, for the evening). */
export function louvreHouse(w = 8, d = 6, opts = {}) {
  const o = { colour: [214, 228, 214], trim: 0x3f6f62, veranda: 2.2, lit: false, ...opts },
    g = grp(),
    h = 2.9;
  const wt = T.plaster(o.colour, [w / 3, 1], "rgba(120,104,84,0.55)").clone();
  wt.needsUpdate = true;
  wt.repeat.set(w / 3, 1);
  const wm = std(wt, 0.92),
    tm = solid(o.trim, 0.8);
  box(w, h, d, wm, 0, h / 2, 0, g);
  // hipped zinc roof
  const zt = T.zinc([152, 150, 142]).clone();
  zt.needsUpdate = true;
  zt.repeat.set(2, 2);
  const zm = std(zt, 0.72),
    rise = 1.2,
    W = w + 0.6,
    D = d + o.veranda + 0.6;
  const roof = new THREE.BufferGeometry(),
    ridge = Math.max(0.2, (W - D) / 2);
  const v = [
    [-W / 2, 0, -D / 2],
    [W / 2, 0, -D / 2],
    [W / 2, 0, D / 2],
    [-W / 2, 0, D / 2],
    [-ridge, rise, 0],
    [ridge, rise, 0],
  ];
  const f = [
    [0, 4, 5, 0, 5, 1],
    [1, 5, 2],
    [2, 5, 4, 2, 4, 3],
    [3, 4, 0],
  ].flat();
  roof.setAttribute("position", new THREE.Float32BufferAttribute(f.map((i) => v[i]).flat(), 3));
  roof.setAttribute("uv", new THREE.Float32BufferAttribute(f.map((i) => [v[i][0] / 2, v[i][2] / 2]).flat(), 2));
  roof.computeVertexNormals();
  const rm = mesh(roof, zm, 0, h + 0.02, o.veranda / 2, g);
  rm.material = once("zincDS", () => new THREE.MeshStandardMaterial({ map: zt, roughness: 0.72, side: THREE.DoubleSide }));
  box(W, 0.16, D, solid(0x5d5a52, 0.9), 0, h + 0.02, o.veranda / 2, g);
  // windows: a frame, glass louvre blades, a sill
  const lit = o.lit ? glow(0xf4c77a) : GLASS;
  const win = (x, z, ry) => {
    const wg = grp(g, x, 0, z);
    wg.rotation.y = ry;
    box(1.2, 1.25, 0.05, lit, 0, 1.6, 0.01, wg);
    box(1.3, 0.07, 0.09, WHITE, 0, 2.26, 0.04, wg);
    box(1.36, 0.06, 0.16, WHITE, 0, 0.95, 0.07, wg);
    for (const s of [-0.62, 0, 0.62]) box(0.06, 1.3, 0.08, WHITE, s, 1.6, 0.04, wg);
    for (let k = 0; k < 8; k++) {
      const b = box(1.16, 0.012, 0.11, solid(0xa8c0c4, 0.2, 0.2), 0, 1.06 + k * 0.155, 0.08, wg);
      b.rotation.x = 0.5;
    }
  };
  for (const x of [-w * 0.3, w * 0.3]) win(x, d / 2, 0);
  win(-w / 2, 0, -Math.PI / 2);
  win(w / 2, 0, Math.PI / 2);
  // the front door (doors.js), on the veranda floor: glass louvre blades over two panels, like the windows; painted in the house's trim colour
  const door = louvreDoor({ color: o.door ?? o.trim, lit: o.lit });
  door.position.set(0, o.veranda ? 0.06 : 0, d / 2);
  g.add(door);
  // veranda: a tiled floor slab, square posts, a low rail of patterned blocks either side of the steps
  if (o.veranda) {
    const V = o.veranda;
    box(w, 0.06, V, solid(0xa45a4a, 0.75), 0, 0.03, d / 2 + V / 2, g);
    for (const x of [-w / 2 + 0.12, -1, 1, w / 2 - 0.12]) box(0.18, h, 0.18, WHITE, x, h / 2, d / 2 + V - 0.12, g);
    for (const s of [-1, 1]) {
      const x0 = s > 0 ? 1 : -w / 2 + 0.12,
        x1 = s > 0 ? w / 2 - 0.12 : -1,
        L = x1 - x0;
      box(L, 0.08, 0.16, WHITE, (x0 + x1) / 2, 0.85, d / 2 + V - 0.12, g);
      const nb = Math.floor(L / 0.32);
      for (let k = 0; k < nb; k++) {
        const bx = x0 + 0.16 + k * (L / nb);
        box(0.26, 0.74, 0.12, solid(0xd8d2c0, 0.95), bx, 0.43, d / 2 + V - 0.12, g);
        box(0.12, 0.3, 0.13, solid(0x6d6a60, 0.95), bx, 0.5, d / 2 + V - 0.12, g);
      }
    }
    box(w, 0.2, 0.2, WHITE, 0, h - 0.1, d / 2 + V - 0.12, g);
  }
  return g;
}
/* a run of zinc fence: corrugated sheets nailed to posts and two rails, along local x from -L/2 to L/2, about 1.9 m high */
export function zincFence(L = 6, h = 1.9, seed = 1) {
  const g = grp(),
    r = rng(seed),
    tones = [
      [150, 154, 150],
      [138, 128, 116],
      [160, 150, 132],
    ];
  const n = Math.max(1, Math.round(L / 0.9));
  for (let i = 0; i < n; i++) {
    const t = T.zinc(tones[(i + seed) % 3], [1, 1]);
    const sh = box(L / n + 0.03, h - r() * 0.15, 0.03, std(t, 0.7), -L / 2 + (i + 0.5) * (L / n), (h - 0.08) / 2 + 0.02, 0, g);
    sh.rotation.z = (r() - 0.5) * 0.02;
  }
  for (let x = -L / 2; x <= L / 2 + 1e-3; x += Math.max(1.8, L / Math.round(L / 2))) box(0.09, h + 0.1, 0.09, WOOD_DK, x, (h + 0.1) / 2, -0.07, g);
  for (const y of [0.4, h - 0.3]) box(L, 0.07, 0.05, WOOD_DK, 0, y, -0.06, g);
  return g;
}
/* a 1960s table radio: a wooden case, a cloth speaker grille and a dial */
export function radio() {
  const g = grp();
  box(0.42, 0.24, 0.2, solid(0x5e3b22, 0.6), 0, 0.12, 0, g);
  box(0.2, 0.17, 0.01, solid(0xcbb88f, 1), -0.08, 0.13, 0.101, g);
  box(0.12, 0.06, 0.01, glow(0xf2d38a), 0.11, 0.16, 0.101, g);
  for (const x of [0.07, 0.15]) cyl(0.018, 0.018, 0.02, solid(0xd8d0bb, 0.5), x, 0.07, 0.11, g, 8).rotation.x = Math.PI / 2;
  return g;
}
/* a lamp on a pole with a glowing bulb under a shade (lit for the evening) */
export function streetLamp(h = 4.2, lit = true) {
  const g = grp();
  cyl(0.07, 0.1, h, IRON, 0, h / 2, 0, g, 8);
  const arm = box(0.9, 0.06, 0.06, IRON, 0.42, h - 0.05, 0, g);
  mesh(new THREE.ConeGeometry(0.26, 0.2, 10, 1, true), solid(0x2b3a34, 0.6, 0, { side: THREE.DoubleSide }), 0.85, h - 0.15, 0, g);
  mesh(new THREE.SphereGeometry(0.09, 10, 8), lit ? glow(0xffe0a0) : solid(0xdedad0, 0.3), 0.85, h - 0.25, 0, g);
  return g;
}

/* ---------- vehicles ---------- */
export { cityBus, car, truck } from "./kingston-vehicles.js";
/* a bicycle standing on its kickstand. Faces +x. */
export function bicycle(colour = 0x1f3f5f) {
  const g = grp(),
    m = solid(colour, 0.5, 0.3);
  for (const x of [-0.52, 0.52]) {
    const w = mesh(new THREE.TorusGeometry(0.33, 0.022, 6, 20), RUBBER, x, 0.35, 0, g);
    cyl(0.008, 0.008, 0.62, CHROME, x, 0.35, 0, g, 4).rotation.z = 0.8;
    cyl(0.008, 0.008, 0.62, CHROME, x, 0.35, 0, g, 4).rotation.z = -0.8;
  }
  const bar = (x0, y0, x1, y1) => {
    const L = Math.hypot(x1 - x0, y1 - y0),
      c = cyl(0.018, 0.018, L, m, (x0 + x1) / 2, (y0 + y1) / 2, 0, g, 6);
    c.rotation.z = Math.atan2(x0 - x1, y1 - y0);
  };
  bar(-0.52, 0.35, -0.1, 0.38);
  bar(-0.1, 0.38, 0.38, 0.78);
  bar(-0.1, 0.38, -0.2, 0.8);
  bar(-0.2, 0.8, 0.38, 0.78);
  bar(0.38, 0.78, 0.52, 0.35);
  bar(-0.52, 0.35, -0.2, 0.8);
  box(0.22, 0.05, 0.1, solid(0x2a1e16, 0.8), -0.22, 0.85, 0, g);
  box(0.06, 0.04, 0.46, CHROME, 0.4, 0.92, 0, g);
  const k = cyl(0.008, 0.008, 0.36, CHROME, -0.12, 0.2, 0.09, g, 4);
  k.rotation.x = 0.3;
  return g;
}

/* ---------- small things ---------- */
/* a folded newspaper, about 30 by 40 cm, lying flat: THE DAILY GLEANER masthead and a date, columns as grey lines (no invented headline) */
export function gleaner(date = "WEDNESDAY, APRIL 20, 1966") {
  const g = grp();
  box(0.3, 0.012, 0.4, solid(0xe6dfcb, 1), 0, 0.006, 0, g);
  const t = cv(300, 400, (x, W, H) => {
    x.fillStyle = "#ece6d4";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#1c1c1c";
    x.textAlign = "center";
    x.font = "700 30px Georgia, serif";
    x.fillText("THE DAILY GLEANER", W / 2, 40, W - 16);
    x.fillRect(10, 52, W - 20, 2);
    x.font = "11px sans-serif";
    x.fillText(date + "  ·  KINGSTON, JAMAICA", W / 2, 66, W - 16);
    x.fillRect(10, 72, W - 20, 1);
    x.fillStyle = "#7a7468";
    x.fillRect(16, 84, 160, 120);
    for (let c = 0; c < 3; c++) for (let i = 0; i < 26; i++) if (!(c === 0 && i < 10)) x.fillRect(16 + c * 92 + (c === 0 && i >= 10 ? 0 : 0), 84 + i * 11 + (c === 0 && i >= 10 ? 14 : 0), 84, 3);
  });
  const p = plane(0.29, 0.39, std(t, 1), 0, 0.0125, 0, g);
  p.rotation.x = -Math.PI / 2;
  return g;
}
/* a stack of newspapers on a crate, with a weight on top: the newsboy's pitch */
export function newsStand() {
  const g = grp();
  box(0.6, 0.5, 0.45, WOOD, 0, 0.25, 0, g);
  for (let i = 0; i < 6; i++) box(0.3, 0.025, 0.4, solid(i % 2 ? 0xe6dfcb : 0xdcd4bf, 1), (i % 2) * 0.01 - 0.12, 0.515 + i * 0.026, 0, g);
  const top = gleaner();
  top.position.set(0.15, 0.5, 0);
  top.rotation.y = 0.2;
  g.add(top);
  box(0.08, 0.06, 0.08, solid(0x6d6d68, 0.6, 0.3), -0.12, 0.69, 0, g);
  return g;
}
/* a loaf of bread in paper */
export function loaf() {
  const g = grp();
  const b = mesh(new THREE.SphereGeometry(0.1, 12, 8), solid(0xc58a4a, 0.8), 0, 0.075, 0, g);
  b.scale.set(1.5, 0.75, 0.9);
  box(0.16, 0.13, 0.17, solid(0xe8dcc0, 1), -0.06, 0.065, 0, g);
  return g;
}
/* a paper bag of oranges */
export function oranges() {
  const g = grp();
  box(0.18, 0.16, 0.14, solid(0xb08a5a, 1), 0, 0.08, 0, g);
  for (const [x, z] of [
    [-0.04, -0.02],
    [0.04, 0.02],
    [0.0, 0.0],
  ])
    mesh(new THREE.SphereGeometry(0.045, 10, 8), solid(0xe0872a, 0.6), x, 0.19, z, g);
  return g;
}
/* a basket of oranges for the higgler's pitch */
export function orangeBasket() {
  const g = grp();
  cyl(0.3, 0.22, 0.3, solid(0xa8803c, 1), 0, 0.15, 0, g, 12);
  const r = rng(7);
  for (let i = 0; i < 9; i++) {
    const a = r() * 6.28,
      d = r() * 0.17;
    mesh(new THREE.SphereGeometry(0.05, 8, 6), solid(0xe0872a, 0.6), Math.cos(a) * d, 0.33 + r() * 0.03, Math.sin(a) * d, g);
  }
  return g;
}
/* bread on a trestle table outside the bakery */
export function breadTable(L = 1.6) {
  const g = grp();
  for (const x of [-L / 2 + 0.1, L / 2 - 0.1]) for (const z of [-0.22, 0.22]) box(0.06, 0.78, 0.06, WOOD, x, 0.39, z, g);
  box(L, 0.05, 0.6, WOOD, 0, 0.8, 0, g);
  box(L - 0.1, 0.012, 0.52, solid(0xece4cf, 1), 0, 0.83, 0, g);
  for (let i = 0; i < 4; i++) {
    const l = loaf();
    l.position.set(-L / 2 + 0.3 + i * 0.32, 0.836, -0.1 + (i % 2) * 0.16);
    g.add(l);
  }
  return g;
}
/* a dressmaker's rail of sewn clothes and flags outside the shop */
export function clothRail(L = 1.6) {
  const g = grp();
  for (const x of [-L / 2, L / 2]) {
    box(0.05, 1.7, 0.05, IRON, x, 0.85, 0, g);
    box(0.06, 0.04, 0.5, IRON, x, 0.02, 0, g);
  }
  box(L, 0.03, 0.03, IRON, 0, 1.68, 0, g);
  const cols = [0xc23a2e, 0xf0c231, 0x2f7f43, 0xe9e4d6, 0x3f5f7a, 0xf2efe6];
  for (let i = 0; i < 6; i++) {
    const x = -L / 2 + 0.2 + i * ((L - 0.4) / 5);
    box(0.32, 0.9 + (i % 2) * 0.15, 0.04, solid(cols[i], 0.95), x, 1.2 - (i % 2) * 0.07, 0, g);
  }
  return g;
}
/* a trestle table (shop counters and the dressmaker's table in the piazza) */
export function trestle(L = 1.4, D = 0.6) {
  const g = grp();
  for (const x of [-L / 2 + 0.08, L / 2 - 0.08]) for (const z of [-D / 2 + 0.06, D / 2 - 0.06]) box(0.05, 0.78, 0.05, WOOD, x, 0.39, z, g);
  box(L, 0.05, D, WOOD, 0, 0.805, 0, g);
  return g;
}
/* an iron railing on low posts, along local x */
export function railing(L = 10, h = 1.1) {
  const g = grp();
  for (const y of [0.15, h - 0.05]) box(L, 0.05, 0.05, IRON, 0, y, 0, g);
  const n = Math.round(L / 0.16);
  for (let i = 0; i <= n; i++) box(0.022, h, 0.022, IRON, -L / 2 + (i * L) / n, h / 2, 0, g);
  for (let x = -L / 2; x <= L / 2 + 1e-3; x += 2.5) box(0.08, h + 0.1, 0.08, IRON, x, (h + 0.1) / 2, 0, g);
  return g;
}
/* a pipe rail for a bus queue */
export function queueRail(L = 4) {
  const g = grp();
  box(L, 0.05, 0.05, CHROME, 0, 0.95, 0, g);
  for (let x = -L / 2; x <= L / 2 + 1e-3; x += L / 2) box(0.05, 0.95, 0.05, CHROME, x, 0.475, 0, g);
  return g;
}
/* Rastafari hand drums: a tall bass drum and a smaller repeater, skins on top (the Gleaner and other accounts mention drumming at the arrival) */
export function drums() {
  const g = grp();
  cyl(0.3, 0.27, 0.62, solid(0x6a4228, 0.8), 0, 0.31, 0, g, 14);
  cyl(0.3, 0.3, 0.02, solid(0xe2d3ae, 0.9), 0, 0.63, 0, g, 14);
  for (const [i, c] of [0xc23a2e, 0xf0c231, 0x2f7f43].entries()) cyl(0.305, 0.3, 0.05, solid(c, 0.9), 0, 0.15 + i * 0.06, 0, g, 14);
  cyl(0.15, 0.13, 0.5, solid(0x5a3a22, 0.8), 0.5, 0.25, 0.05, g, 12);
  cyl(0.15, 0.15, 0.02, solid(0xe2d3ae, 0.9), 0.5, 0.51, 0.05, g, 12);
  return g;
}
/* a plain cloth banner in red, gold and green between two poles in weighted stands (no words: none is recorded for this picture) */
export function banner(w = 2.4) {
  const g = grp();
  for (const x of [-w / 2, w / 2]) {
    box(0.4, 0.18, 0.4, CONCRETE, x, 0.09, 0, g);
    cyl(0.03, 0.03, 2.6, WOOD_DK, x, 1.4, 0, g, 6);
  }
  ["#c23a2e", "#f0c231", "#2f7f43"].forEach((c, i) => box(w, 0.28, 0.02, solid(new THREE.Color(c).getHex(), 0.95), 0, 2.45 - i * 0.28, 0, g));
  return g;
}
/* a conductor's wooden ticket rack on a stool (a former conductor remembered "plucking those tickets from those wooden racks") */
export function ticketRack() {
  const g = grp();
  for (const [x, z] of [
    [-0.15, -0.15],
    [0.15, -0.15],
    [-0.15, 0.15],
    [0.15, 0.15],
  ])
    box(0.04, 0.62, 0.04, WOOD, x, 0.31, z, g);
  box(0.4, 0.04, 0.4, WOOD, 0, 0.64, 0, g);
  box(0.3, 0.16, 0.12, solid(0x5e3b22, 0.8), 0, 0.74, 0, g);
  const cols = [0xdcc69a, 0xc8d6b0, 0xe0b8a8, 0xb8c8dc, 0xe6dca8];
  for (let i = 0; i < 5; i++) box(0.045, 0.08, 0.1, solid(cols[i], 1), -0.11 + i * 0.055, 0.86, 0, g);
  return g;
}
/* a standpipe on a concrete pad */
export function standpipe2() {
  const g = grp();
  box(0.7, 0.08, 0.7, CONCRETE, 0, 0.04, 0, g);
  cyl(0.04, 0.04, 0.9, solid(0x6a6f6c, 0.5, 0.4), 0, 0.53, 0, g, 8);
  box(0.24, 0.05, 0.05, solid(0x6a6f6c, 0.5, 0.4), 0.1, 0.95, 0, g);
  return g;
}
/* a plain potted plant in a kerosene tin painted white (common yard and veranda pots) */
export function tinPlant(seed = 1) {
  const g = grp(),
    r = rng(seed);
  cyl(0.16, 0.16, 0.34, solid(0xe6e0d0, 0.6, 0.2), 0, 0.17, 0, g, 4).rotation.y = Math.PI / 4;
  for (let i = 0; i < 5; i++) {
    const b = mesh(new THREE.IcosahedronGeometry(0.16 + r() * 0.06, 0), flat([0x3f7a3a, 0x2f6a35, 0x5a8a3a][i % 3]), (r() - 0.5) * 0.2, 0.46 + r() * 0.18, (r() - 0.5) * 0.2, g);
  }
  return g;
}
