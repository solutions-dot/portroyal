/* Stone, timber and rock: the builders the places are made from. Each returns a THREE.Group standing on y = 0 at its own origin.
   What each is modelled on, and what is a general picture, is in docs/games/hutchinson.md ("Places"). */
import * as THREE from "three";
import { T, cv, std, solid, flat, mesh, box, cyl, plane, grp, rng } from "./gfx.js";
import { makeDoor } from "../../../engine/door.js";

export const LIME = [176, 168, 148],   /* cut white limestone, weathered */
  LIME_DARK = [128, 122, 108];
const stoneMat = (rgb, rx, ry) => std(T.stone(rgb, [Math.max(1, Math.round(rx)), Math.max(1, Math.round(ry))]), 1);
export const WM = {
  wood: solid(0x6e5238, 0.95),
  woodDark: solid(0x3b2a1e, 0.95),
  shingle: solid(0x5d5347, 1),
  iron: solid(0x2b2d31, 0.6, 0.3),
  dark: new THREE.MeshBasicMaterial({ color: 0x050505 }),
  pit: new THREE.MeshBasicMaterial({ color: 0x020202, side: THREE.BackSide }),
  rope: solid(0xb59a6a, 1),
  plaster: solid(0xd8cfb8, 1),
  cloth: solid(0x7a2f2a, 1),
  linen: solid(0xd9d0b8, 1),
  glass: solid(0x4f6468, 0.25, 0.1),
};
/* a block of masonry: the stone texture repeats about every 1.4 m, whatever the size */
export function stoneBox(w, h, d, rgb = LIME, x = 0, y = h / 2, z = 0, parent) {
  return box(w, h, d, stoneMat(rgb, Math.max(w, d) / 1.4, h / 1.4), x, y, z, parent);
}
/* a dry-stone field wall, as round every pen in the limestone hills: len along x, a row of rough capstones on top */
export function fieldWall(len, h = 1.1, seed = 3) {
  const g = grp(),
    r = rng(seed);
  stoneBox(len, h, 0.55, LIME_DARK, 0, h / 2, 0, g);
  for (let x = -len / 2 + 0.25; x < len / 2 - 0.1; x += 0.46) {
    const s = mesh(new THREE.IcosahedronGeometry(0.2, 0), flat([0x8f897c, 0x9a9486, 0x857f73][(r() * 3) | 0]), x + (r() - 0.5) * 0.06, h + 0.04, (r() - 0.5) * 0.06, g);
    s.scale.set(1.15, 0.5, 1.2);
  }
  return g;
}
/* a round tower with loopholes: narrow slits to shoot through, wide enough inside to swing a gun */
export function roundTower(r = 2, h = 7.2, { slits = 6, rows = [1.6, 4.3], roof = true, seed = 1 } = {}) {
  const g = grp();
  const body = mesh(new THREE.CylinderGeometry(r, r * 1.04, h, 22, 1, false), stoneMat(LIME, (2 * Math.PI * r) / 1.4, h / 1.4), 0, h / 2, 0, g);
  body.name = "tower";
  for (const y of rows)
    for (let i = 0; i < slits; i++) {
      const a = (i / slits) * Math.PI * 2 + seed,
        s = box(0.09, 0.62, 0.1, WM.dark, Math.sin(a) * (r + 0.005), y, Math.cos(a) * (r + 0.005), g);
      s.rotation.y = a;
      const sill = box(0.3, 0.07, 0.12, stoneMat(LIME_DARK, 1, 1), Math.sin(a) * (r + 0.01), y - 0.36, Math.cos(a) * (r + 0.01), g);
      sill.rotation.y = a;
    }
  mesh(new THREE.CylinderGeometry(r + 0.12, r + 0.12, 0.16, 22), stoneMat(LIME_DARK, 6, 1), 0, h + 0.08, 0, g);
  if (roof) mesh(new THREE.ConeGeometry(r + 0.28, 1.7, 22), WM.shingle, 0, h + 0.16 + 0.85, 0, g);
  return g;
}
/* a small shuttered window in a thick stone wall, facing +z: a dark opening, a timber frame, two board shutters (open or shut) */
export function shutterWindow(w = 0.8, h = 1.0, open = 0) {
  const g = grp();
  box(w, h, 0.06, WM.dark, 0, 0, 0.0, g);
  for (const [fw, fh, fx, fy] of [[w + 0.16, 0.08, 0, h / 2 + 0.04], [w + 0.16, 0.08, 0, -h / 2 - 0.04], [0.08, h, -w / 2 - 0.04, 0], [0.08, h, w / 2 + 0.04, 0]]) box(fw, fh, 0.09, WM.woodDark, fx, fy, 0.015, g);
  g.userData.leaves = [];
  for (const s of [-1, 1]) {
    const hinge = grp(g, (s * w) / 2, 0, 0.05);
    box(w / 2 - 0.01, h - 0.02, 0.035, WM.wood, (-s * w) / 4, 0, 0, hinge);
    hinge.rotation.y = s * open * 2.2;
    hinge.userData.side = s;
    g.userData.leaves.push(hinge);
  }
  g.userData.swing = (k) => {
    for (const l of g.userData.leaves) l.rotation.y = l.userData.side * k * 2.2;
  };
  return g;
}
/* a hipped roof of wooden shingles over a w by d block, its eaves a little wider than the walls */
export function hipRoof(w, d, rise = 1.9, over = 0.35) {
  const g = grp(),
    W = w / 2 + over,
    D = d / 2 + over,
    ridge = Math.max(0.4, W - D),
    v = [-W, 0, -D, W, 0, -D, W, 0, D, -W, 0, D, -ridge, rise, 0, ridge, rise, 0],
    idx = [0, 4, 5, 0, 5, 1, 2, 5, 4, 2, 4, 3, 3, 4, 0, 1, 5, 2];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo.toNonIndexed(), new THREE.MeshStandardMaterial({ color: 0x5d5347, roughness: 1, side: THREE.DoubleSide, flatShading: true }));
  g.add(m);
  box(2 * W, 0.08, 2 * D, WM.woodDark, 0, -0.04, 0, g);
  return g;
}
/* a stone well: a ring of cut stone, a timber frame, a windlass with its rope, and a pail on the rim */
export function well() {
  const g = grp();
  const ring = mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.85, 18, 1, true), stoneMat(LIME, 4, 1), 0, 0.425, 0, g);
  ring.material = ring.material.clone();
  ring.material.side = THREE.DoubleSide;
  const top = mesh(new THREE.RingGeometry(0.72, 1.0, 18), stoneMat(LIME_DARK, 3, 1), 0, 0.85, 0, g);
  top.rotation.x = -Math.PI / 2;
  const water = mesh(new THREE.CircleGeometry(0.74, 18), solid(0x10202a, 0.2), 0, 0.3, 0, g);
  water.rotation.x = -Math.PI / 2;
  for (const s of [-1, 1]) box(0.14, 2.1, 0.14, WM.woodDark, s * 1.0, 1.05, 0, g);
  box(2.3, 0.14, 0.14, WM.woodDark, 0, 2.1, 0, g);
  const roller = cyl(0.09, 0.09, 1.9, WM.wood, 0, 1.55, 0, g, 10);
  roller.rotation.z = Math.PI / 2;
  cyl(0.012, 0.012, 0.75, WM.rope, 0.2, 1.17, 0, g, 5);
  box(0.05, 0.36, 0.05, WM.iron, 1.12, 1.55, 0.0, g);
  box(0.05, 0.05, 0.3, WM.iron, 1.12, 1.71, 0.15, g);
  return g;
}
/* a sea chest or strongbox with a lid that lifts (userData.open(k)) */
export function chest(w = 0.95, d = 0.5, h = 0.5) {
  const g = grp();
  box(w, h * 0.68, d, WM.woodDark, 0, h * 0.34, 0, g);
  for (const x of [-w * 0.32, w * 0.32]) box(0.05, h * 0.7, d + 0.02, WM.iron, x, h * 0.34, 0, g);
  const hinge = grp(g, 0, h * 0.68, -d / 2);
  box(w, h * 0.3, d, WM.woodDark, 0, h * 0.15, d / 2, hinge);
  for (const x of [-w * 0.32, w * 0.32]) box(0.05, h * 0.31, d + 0.02, WM.iron, x, h * 0.15, d / 2, hinge);
  hinge.traverse((o) => (o.userData.noBatch = true));
  g.userData.open = (k) => (hinge.rotation.x = -k * 1.25);
  return g;
}
export function chair(c = WM.woodDark) {
  const g = grp();
  for (const x of [-0.2, 0.2]) for (const z of [-0.2, 0.2]) box(0.045, 0.45, 0.045, c, x, 0.225, z, g);
  box(0.46, 0.04, 0.46, c, 0, 0.47, 0, g);
  for (const x of [-0.2, 0.2]) box(0.045, 0.55, 0.045, c, x, 0.76, -0.2, g);
  box(0.44, 0.16, 0.035, c, 0, 0.92, -0.2, g);
  return g;
}
/* a bench: L long, the seat 0.45 m high */
export function bench(L = 2, c = WM.woodDark) {
  const g = grp();
  box(L, 0.05, 0.36, c, 0, 0.45, 0, g);
  for (const x of [-L / 2 + 0.15, L / 2 - 0.15]) box(0.06, 0.45, 0.32, c, x, 0.225, 0, g);
  return g;
}
/* a candle in a brass stick; userData.light(on) lights or snuffs it */
export function candle(lit = true) {
  const g = grp();
  cyl(0.05, 0.065, 0.02, solid(0xb8963c, 0.35, 0.8), 0, 0.01, 0, g, 10);
  cyl(0.012, 0.014, 0.1, solid(0xb8963c, 0.35, 0.8), 0, 0.07, 0, g, 8);
  cyl(0.014, 0.014, 0.14, solid(0xe9e2cc, 0.6), 0, 0.19, 0, g, 8);
  const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  f.scale.set(0.16, 0.2, 1);
  f.position.y = 0.32;
  f.visible = lit;
  f.userData.noBatch = true;
  g.add(f);
  g.userData.light = (on) => (f.visible = on);
  return g;
}
/* a coat on a wall peg, or folded: a traveller's coat with no traveller in it */
export function hungCoat(c = 0x5a3a2a) {
  const g = grp(),
    m = solid(c, 1);
  box(0.5, 0.05, 0.06, WM.woodDark, 0, 1.62, 0.03, g);
  cyl(0.012, 0.012, 0.1, WM.iron, 0, 1.6, 0.08, g, 6).rotation.x = Math.PI / 2;
  box(0.42, 0.85, 0.07, m, 0, 1.16, 0.09, g);
  for (const s of [-1, 1]) box(0.12, 0.62, 0.07, m, s * 0.27, 1.22, 0.085, g).rotation.z = s * 0.1;
  return g;
}
/* a plain room: floor, four walls with openings, a boarded ceiling on beams. walls: [{ line: [ax, az, bx, bz], gaps: [{ at, w, h, sill }] }] */
export function room({ x0, z0, x1, z1, h = 3, floor, wall, beams = true, t = 0.5, ceiling = WM.woodDark }) {
  const g = grp();
  box(x1 - x0, 0.06, z1 - z0, floor, (x0 + x1) / 2, -0.03, (z0 + z1) / 2, g).name = "terrain";
  if (ceiling) box(x1 - x0, 0.1, z1 - z0, ceiling, (x0 + x1) / 2, h + 0.05, (z0 + z1) / 2, g);
  if (beams) for (let x = x0 + 1; x < x1 - 0.6; x += 1.4) box(0.16, 0.2, z1 - z0 - 0.52, WM.woodDark, x, h - 0.1, (z0 + z1) / 2, g);
  return g;
}
/* a wall with openings, from (ax, az) to (bx, bz): solid pieces round each gap (a door from the floor, a window above its sill) */
export function wallRun(parent, [ax, az, bx, bz], h, mat, gaps = [], t = 0.5) {
  const len = Math.hypot(bx - ax, bz - az),
    seg = grp(parent, ax, 0, az);
  seg.rotation.y = -Math.atan2(bz - az, bx - ax);
  let s = 0;
  const piece = (a, b, y0, y1) => b - a > 0.01 && y1 - y0 > 0.01 && box(b - a, y1 - y0, t, mat, (a + b) / 2, (y0 + y1) / 2, 0, seg);
  for (const gp of gaps.slice().sort((a, b) => a.at - b.at)) {
    const a = gp.at - gp.w / 2,
      b = gp.at + gp.w / 2,
      sill = gp.sill || 0,
      top = sill + (gp.h || 2.1);
    piece(s, a, 0, h);
    piece(a, b, 0, sill);
    piece(a, b, top, h);
    s = b;
  }
  piece(s, len, 0, h);
  return seg;
}
/* limestone rocks: karst boulders, pale and pitted. n lumps in a rough pile about s across */
export function rocks(s = 1, seed = 1, n = 3) {
  const g = grp(),
    r = rng(seed),
    cols = [0xa8a294, 0x8f897c, 0xb5b0a2, 0x7f7a6e];
  for (let i = 0; i < n; i++) {
    const k = s * (0.45 + r() * 0.4),
      o = mesh(new THREE.IcosahedronGeometry(k, 0), flat(cols[(r() * cols.length) | 0]), (r() - 0.5) * s * 0.9, k * 0.42, (r() - 0.5) * s * 0.9, g);
    o.scale.set(1, 0.62 + r() * 0.3, 0.8 + r() * 0.4);
    o.rotation.y = r() * 6;
  }
  return g;
}
/* dry scrub: logwood and thorn, grey-green, low */
export function scrub(seed = 1, s = 1) {
  const g = grp(),
    r = rng(seed),
    cols = [0x5d6b3a, 0x6f7748, 0x4f5d33, 0x7a7a4a];
  cyl(0.035, 0.06, 0.5 * s, solid(0x4a3a2a, 1), 0, 0.25 * s, 0, g, 5);
  for (let i = 0; i < 4; i++) {
    const k = s * (0.34 + r() * 0.22),
      o = mesh(new THREE.IcosahedronGeometry(k, 0), flat(cols[(r() * cols.length) | 0]), (r() - 0.5) * s * 0.6, 0.5 * s + r() * 0.35 * s, (r() - 0.5) * s * 0.6, g);
    o.scale.y = 0.7;
  }
  return g;
}
/* a rounded limestone hill, wooded: the "cockpit" hills of the middle of the island, seen across a valley */
export function cockpitHill(r = 30, h = 26, seed = 1, base = [0.3, 0.4, 0.24]) {
  const rr = rng(seed),
    geo = new THREE.SphereGeometry(1, 16, 9, 0, Math.PI * 2, 0, Math.PI / 2),
    pos = geo.attributes.position,
    col = new Float32Array(pos.count * 3);
  for (let k = 0; k < pos.count; k++) {
    const y = pos.getY(k),
      v = 0.78 + 0.4 * y + (rr() - 0.5) * 0.14;
    col[k * 3] = base[0] * v;
    col[k * 3 + 1] = base[1] * v;
    col[k * 3 + 2] = base[2] * v;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
  m.scale.set(r, h, r * (0.8 + rr() * 0.35));
  m.rotation.y = rr() * 3;
  m.name = "terrain";
  return m;
}
export { makeDoor, cv, plane };
