/* games/melissa/src/houses.js: houses whose roofs can be whole, half gone or off; the wreckage a hurricane leaves; and the things people use to get ready.
   Each builder returns a THREE.Group standing on y = 0 at its own origin. A house faces +z (its door and veranda are on the +z side).
   Roofs are made of separate zinc sheets on rafters, so the storm can lift them one by one and the "after" places can leave some missing. */
import * as THREE from 'three';
import { T, std, solid, flat, mesh, box, cyl, plane, grp, rng } from './gfx.js';
import { PM, pole } from './props.js';
import { saloonCar, lorry } from '../../../engine/roadcars.js';
import { makeDoor } from '../../../engine/door.js';

const PI = Math.PI;
const WOOD = solid(0x7a5a3c, 0.95), WOODD = solid(0x3d2d20, 0.95), RAW = solid(0xc8a874, 0.95), TRIM = solid(0xe8e0cc, 0.8), DARKM = solid(0x1c1a18, 0.9), IRON = solid(0x2b2d31, 0.6, 0.3);
const tex = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rx, ry); return c; };
const zincMat = (rgb, rx = 1, ry = 3) => std(tex(T.zinc(rgb), rx, ry), 0.7, { side: THREE.DoubleSide });

/* ---------- roofs: two slopes of zinc sheets on rafters ---------- */
export function roofOf(w, d, h, { rise = 1.25, rgb = [150, 154, 150], state = 'on', seed = 1, over = 0.35, sheets = true } = {}) {
  const g = grp(), r = rng(seed), run = d / 2 + over, Ls = Math.hypot(run, rise), th = Math.atan2(rise, run), n = Math.ceil((w + 0.7) / 0.82), sm = zincMat(rgb), list = [];
  for (const s of [-1, 1]) {
    const sl = grp(g, 0, h + rise / 2 + 0.04, s * (run / 2 - over / 2 + 0.02)); sl.rotation.x = s * th;
    for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 0.82;
      box(0.07, 0.1, Ls, WOOD, x, -0.07, 0, sl);   /* a rafter under every sheet joint */
      const gone = state === 'off' ? i % 5 !== 2 || s < 0 : state === 'half' ? (s > 0 ? i % 3 !== 0 && i > 1 && i < n - 1 : r() < 0.55) : false;
      if (sheets && !gone) { const sh = box(0.8, 0.035, Ls, sm, x, 0, 0, sl); sh.userData.sheet = true; list.push({ m: sh, side: s, i }); } }
    for (const q of [-0.36, 0.0, 0.36]) box(w + 0.7, 0.06, 0.08, WOODD, 0, -0.14, q * Ls, sl);   /* purlins across the rafters */
  }
  box(w + 0.7, 0.1, 0.22, solid(0x4a4c50, 0.6, 0.3), 0, h + rise + 0.05, 0, g).visible = state !== 'off';   /* ridge cap */
  if (state === 'off' || state === 'half') for (const x of [-w / 2 + 0.02, w / 2 - 0.02]) box(0.09, 0.09, d + 0.9, WOODD, x, h + 0.04, 0, g);   /* wall plates left standing */
  g.userData.sheets = list; g.userData.rise = rise; return g;
}

/* ---------- a house ----------
   style: 'board' (timber walls) or 'block' (painted concrete block, with window grills)
   roof: 'on' | 'half' | 'off'. shutters: 'open' | 'closed' | 'boarded' (plywood nailed across). tank: a black water tank on a stand. tarp: a blue tarpaulin over bare rafters. */
export function house({ w = 6, d = 4.4, h = 2.7, style = 'board', wall = [188, 160, 110], roofRgb = [150, 154, 150], roof = 'on', shutters = 'open', porch = true, seed = 1, tank = false, tarp = false, shutCol = 0x2f6a3f, doorCol = 0x5a3c26, damaged = 0, door = null, grille = false } = {}) {
  const g = grp(), r = rng(seed), block = style === 'block';
  const wt = block ? tex(T.plaster(wall, [1, 1], 'rgba(120,100,80,0.18)'), w / 3, 1) : tex(T.plank(wall, 8, [w / 2, 1]), w / 2, 1), dt = block ? tex(T.plaster(wall, [1, 1], 'rgba(120,100,80,0.18)'), d / 3, 1) : tex(T.plank(wall, 8, [d / 2, 1]), d / 2, 1);
  const wm = std(wt, 0.92), dm = std(dt, 0.92);
  box(w, h, d, [dm, dm, wm, wm, wm, wm], 0, h / 2, 0, g);   /* +x, -x, top, bottom, +z (front), -z (back) */
  const rise = 1.25, sh = [-1, 1];
  for (const s of sh) { const gb = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, rise)])), dm, s * (w / 2 + 0.005), h, 0, g); gb.rotation.y = s * PI / 2; gb.material = gb.material.clone(); gb.material.side = THREE.DoubleSide; }
  const roofG = roofOf(w, d, h, { rise, rgb: roofRgb, state: roof, seed }); g.add(roofG); g.userData.roof = roofG;
  /* windows and a door on the front, one window on each end */
  const fr = TRIM, win = (x, y, z, ry) => { const wg = grp(g, x, y, z); wg.rotation.y = ry;
    box(0.96, 0.96, 0.05, DARKM, 0, 0, 0, wg);
    if (shutters === 'boarded') { for (const dy of [-0.3, 0, 0.3]) box(1.2, 0.26, 0.05, RAW, 0, dy, 0.07, wg); for (const a of [0.7, -0.7]) { const b = box(1.5, 0.07, 0.04, WOOD, 0, 0, 0.11, wg); b.rotation.z = a; } }
    else if (shutters === 'closed') { for (const sx of [-0.25, 0.25]) box(0.5, 0.98, 0.06, solid(shutCol, 0.9), sx, 0, 0.05, wg); }
    else { for (const sx of [-1, 1]) { const o = box(0.46, 0.92, 0.05, solid(shutCol, 0.9), sx * 0.74, 0, 0.1, wg); o.rotation.y = sx * -0.9; o.position.z = 0.12; o.position.x = sx * 0.72; } for (const sx of [-0.3, 0, 0.3]) box(0.04, 0.9, 0.04, DARKM, sx, 0, 0.04, wg); if (block) for (const sx of [-0.36, -0.12, 0.12, 0.36]) box(0.03, 0.96, 0.03, IRON, sx, 0, 0.08, wg); }
    box(1.1, 0.06, 0.07, fr, 0, 0.52, 0.04, wg); box(1.1, 0.06, 0.07, fr, 0, -0.52, 0.04, wg); box(1.2, 0.05, 0.12, fr, 0, -0.56, 0.08, wg); return wg; };
  const wy = h * 0.6;
  for (const x of [-w * 0.3, w * 0.3]) win(x, wy, d / 2 + 0.02, 0);
  win(0, wy, -d / 2 - 0.02, PI); win(w / 2 + 0.02, wy, 0, PI / 2); win(-w / 2 - 0.02, wy, 0, -PI / 2);
  /* the front door (engine/door.js): framed, with boards, louvres or panels and a handle. door: { kind, w, h, leaves } (default: boards on a board house, panels on a block one).
     It stands on the veranda floor (0.27 m up) or, with no veranda, on a step at the foot of the wall. grille: a burglar-bar gate in front of it, as many block houses have now. */
  { const o = { kind: block ? 'panel' : 'plank', w: 0.95, h: 1.95, leaves: 1, ...(door || {}) }, fy = porch ? 0.27 : 0;
    const dr = makeDoor({ w: o.w, h: o.h, kind: o.kind, leaves: o.leaves, color: doorCol, frame: 0xe8e0cc, step: o.step ?? (porch ? 0 : 0.16), handle: o.handle, metal: 0x8a8070 }); dr.position.set(0, fy, d / 2); g.add(dr);
    if (grille) { const gw = o.w + 0.1, gz = d / 2 + 0.16, y0 = fy + (o.step ?? (porch ? 0 : 0.16)) + 0.03, y1 = fy + o.h + 0.02;
      for (let x = -gw / 2; x <= gw / 2 + 0.001; x += gw / 9) box(0.018, y1 - y0, 0.018, IRON, x, (y0 + y1) / 2, gz, g);
      for (const y of [y0 + 0.02, (y0 + y1) / 2, y1 - 0.02]) box(gw + 0.03, 0.03, 0.02, IRON, 0, y, gz, g);
      for (const s of [-1, 1]) for (const y of [y0 + 0.3, y1 - 0.3]) box(0.03, 0.03, 0.14, IRON, s * (gw / 2 + 0.01), y, d / 2 + 0.09, g); } }   /* lugs that hold the gate to the wall */
  for (const [x, z] of [[-w / 2 + 0.2, -d / 2 + 0.2], [w / 2 - 0.2, -d / 2 + 0.2], [-w / 2 + 0.2, d / 2 - 0.2], [w / 2 - 0.2, d / 2 - 0.2]]) cyl(0.13, 0.16, 0.3, solid(0x9a968a, 1), x, 0.1, z, g, 8);   /* concrete piers */
  if (block) box(w + 0.06, 0.1, d + 0.06, solid(0xb6b2a6, 0.9), 0, 0.05, 0, g);
  if (porch) {
    box(w + 0.4, 0.14, 1.6, WOODD, 0, 0.2, d / 2 + 0.8, g); for (const x of [-w / 2, 0, w / 2]) box(0.12, 2.4, 0.12, WOOD, x, 1.4, d / 2 + 1.5, g);
    box(1.2, 0.18, 0.4, WOODD, 0, 0.09, d / 2 + 1.7, g);
    if (roof === 'on') { const pz = box(w + 0.6, 0.05, 1.9, zincMat(roofRgb), 0, 2.66, d / 2 + 0.9, g); pz.rotation.x = 0.1; }
    else { box(w + 0.5, 0.08, 0.1, WOODD, 0, 2.62, d / 2 + 1.5, g); box(w + 0.5, 0.08, 0.1, WOODD, 0, 2.62, d / 2 + 0.1, g); for (const x of [-w / 2, 0, w / 2]) { const rf = box(0.07, 0.1, 1.9, WOOD, x, 2.64, d / 2 + 0.8, g); rf.rotation.x = 0.1; } }
  }
  if (tank) { const t = tankOnStand(); t.position.set(w / 2 + 1.3, 0, -d / 2 + 0.2); g.add(t); }
  if (tarp) g.add(tarpMesh(w, d, h, rise));
  if (damaged > 0) { const sg = grp(g); for (let i = 0; i < 3; i++) { const p = box(0.9, 0.05, 0.16, RAW, (r() - 0.5) * w * 0.8, h * 0.45 + r() * h * 0.2, d / 2 + 0.07, sg); p.rotation.z = (r() - 0.5) * 0.5; } }
  g.userData.w = w; g.userData.d = d; g.userData.h = h; return g;
}

/* a blue tarpaulin tied over the bare rafters of the front slope (the same slope as roofOf's s = +1) */
export function tarpMesh(w, d, h, rise = 1.25) {
  const g = grp(), over = 0.35, run = d / 2 + over, Ls = Math.hypot(run, rise), th = Math.atan2(rise, run), sl = grp(g, 0, h + rise / 2 + 0.04, run / 2 - over / 2 + 0.02); sl.rotation.x = th;
  box(w * 0.82, 0.03, Ls * 0.96, solid(0x2a6ab0, 0.7), 0, 0.09, 0, sl); for (const x of [-w * 0.3, 0, w * 0.3]) box(0.05, 0.05, Ls * 0.98, solid(0x6a5a40, 0.9), x, 0.12, 0, sl); return g;
}

/* a big backyard satellite dish of the 1980s: a pale bowl about 2 m across on a post, tilted up toward the sky, with its arm and receiver. Only Gilbert (1988) has them in this game. */
export function bigDish(r = 1.15) {
  const g = grp(), m = solid(0xd8d8d2, 0.6), dk = solid(0x2b2d31, 0.6, 0.3), R = r * 1.25; cyl(0.07, 0.09, 1.7, dk, 0, 0.85, 0, g, 8);
  const tilt = grp(g, 0, 1.7, 0); tilt.rotation.x = 0.95;   /* faces south and up: in Jamaica the satellites are to the south */
  const geo = new THREE.SphereGeometry(R, 28, 10, 0, PI * 2, PI - 0.78, 0.78); geo.translate(0, R, 0); const bowl = new THREE.Mesh(geo, m.clone()); bowl.material.side = THREE.DoubleSide; tilt.add(bowl);   /* the bowl opens up, its middle on the post */
  cyl(0.02, 0.02, R * 0.5, dk, 0, R * 0.25, 0, tilt, 6); mesh(new THREE.SphereGeometry(0.07, 8, 6), dk, 0, R * 0.52, 0, tilt);
  for (const a of [0, 2.1, 4.2]) { const sx = Math.cos(a) * R * 0.7, sz = Math.sin(a) * R * 0.7, st = cyl(0.012, 0.012, R * 0.62, dk, sx / 2, R * 0.33, sz / 2, tilt, 4); st.rotation.set(sz / (R * 0.62) * -1, 0, sx / (R * 0.62)); }
  return g;
}
/* a family car of the 1980s: a boxy saloon (front toward +x) */
/* a 1980s saloon car, front toward +x: no make, no badge, a blank plate (engine/roadcars.js) */
export function car(c = 0x8a2a2a) { return saloonCar({ era: '1980s', colour: c }); }
/* a fence of zinc sheets standing on end, from (x0, z0) to (x1, z1) along x or z */
export function zincFence(x0, z0, x1, z1, h = 1.9, seed = 1) {
  const g = grp(), r = rng(seed), alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0), L = alongX ? Math.abs(x1 - x0) : Math.abs(z1 - z0), n = Math.ceil(L / 0.8), m = zincMat([150, 150, 146]), m2 = zincMat([150, 110, 90]);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t, hh = h * (0.9 + r() * 0.15), sh = box(alongX ? 0.8 : 0.04, hh, alongX ? 0.04 : 0.8, r() < 0.3 ? m2 : m, x, hh / 2, z, g); }
  for (let i = 0; i <= Math.ceil(L / 2.4); i++) { const t = Math.min(1, i * 2.4 / L), x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t; box(0.1, h + 0.1, 0.1, WOOD, x, (h + 0.1) / 2, z, g); }
  box(alongX ? L : 0.1, 0.08, alongX ? 0.1 : L, WOOD, (x0 + x1) / 2, h * 0.85, (z0 + z1) / 2, g);
  return g;
}

/* a modern water tanker: a white cab on a dark chassis with a blue tank, the front toward +x */
export function waterTruck() { return lorry({ body: 'tank', colour: 0xe8e8e4, bodyColour: 0x2a6ab0, L: 6.8, W: 2.2 }); }   /* a white cab and a blue tank with bands, a hatch, a ladder, an outlet and a hose. It carries no name (engine/roadcars.js) */

/* ---------- water: a black tank on a stand, a drum with a tap, a standpipe with a bucket under it ---------- */
export function tankOnStand() {
  const g = grp(), m = solid(0x1e2226, 0.55); for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) { box(0.2, 1.45, 0.2, solid(0xa8a49a, 0.95), x, 0.72, z, g); }
  box(1.4, 0.12, 1.4, solid(0x8a8a82, 0.9), 0, 1.5, 0, g);
  cyl(0.62, 0.62, 1.15, m, 0, 2.15, 0, g, 18); cyl(0.5, 0.58, 0.12, m, 0, 2.78, 0, g, 18); cyl(0.14, 0.14, 0.08, solid(0x1a1c20, 0.5), 0, 2.88, 0, g, 10);
  cyl(0.04, 0.04, 0.5, solid(0x4a6a8a, 0.5), 0.62, 1.72, 0, g, 6).rotation.z = PI / 2; return g;
}
export function waterDrum(c = 0x2a6ab0) { const g = grp(); cyl(0.3, 0.3, 0.88, solid(c, 0.55), 0, 0.44, 0, g, 14); cyl(0.31, 0.31, 0.06, solid(0x1a2a4a, 0.6), 0, 0.9, 0, g, 14); cyl(0.31, 0.31, 0.05, solid(0x1a2a4a, 0.6), 0, 0.05, 0, g, 14); for (const y of [0.3, 0.6]) cyl(0.31, 0.31, 0.03, solid(0x1a2a4a, 0.6), 0, y, 0, g, 14); cyl(0.025, 0.025, 0.14, solid(0xb0b0b0, 0.4, 0.6), 0.34, 0.2, 0, g, 6).rotation.z = PI / 2; return g; }
export function jug(c = 0x6ab4e8) { const g = grp(); box(0.22, 0.3, 0.16, solid(c, 0.4, 0, { transparent: true, opacity: 0.85 }), 0, 0.15, 0, g); cyl(0.04, 0.04, 0.05, solid(0x2a6ab0, 0.5), 0, 0.325, 0, g, 8); return g; }
export function standpipeTap() { const g = grp(); cyl(0.06, 0.07, 0.95, solid(0x3a4a5a, 0.5, 0.4), 0, 0.48, 0, g, 8); box(0.2, 0.07, 0.07, solid(0x3a4a5a, 0.5, 0.4), 0.06, 0.92, 0, g); cyl(0.02, 0.02, 0.14, solid(0xb8b8b8, 0.4, 0.6), 0.14, 0.82, 0, g, 6); box(0.7, 0.1, 0.6, solid(0x8a8a82, 0.95), 0, 0.05, 0, g); return g; }

/* ---------- ready-to-go things ---------- */
export function plywood(w = 1.2, h = 2.4) { return box(w, h, 0.02, RAW, 0, h / 2, 0); }
export function goBag(c = 0x3a5a8a) { const g = grp(); box(0.3, 0.38, 0.16, solid(c, 0.8), 0, 0.19, 0, g); box(0.26, 0.12, 0.04, solid(0x2a2e3a, 0.8), 0, 0.28, 0.1, g); box(0.04, 0.2, 0.02, solid(0xd8d0b8, 0.8), 0, 0.14, 0.09, g); return g; }
export function radio() { const g = grp(); box(0.34, 0.2, 0.1, solid(0x2a2a2e, 0.6), 0, 0.1, 0, g); const gr = box(0.18, 0.12, 0.02, solid(0x8a8a82, 0.8), -0.05, 0.1, 0.055, g); cyl(0.045, 0.045, 0.02, solid(0xc8c0a8, 0.7), 0.11, 0.1, 0.06, g, 10).rotation.x = PI / 2; cyl(0.008, 0.008, 0.38, solid(0xb8b8b8, 0.4, 0.6), 0.14, 0.38, 0, g, 4); return g; }
export function tins(n = 6, seed = 3) { const g = grp(), r = rng(seed), cols = [0xc84a3a, 0x3a7a4a, 0xd8b030, 0x4a6aa8]; for (let i = 0; i < n; i++) cyl(0.045, 0.045, 0.1, solid(cols[i % 4], 0.5, 0.3), (i % 3) * 0.1 - 0.1, 0.05 + Math.floor(i / 3) * 0.1, (r() - 0.5) * 0.04, g, 8); return g; }
export function bread() { const g = grp(); for (let i = 0; i < 3; i++) box(0.26, 0.14, 0.14, solid(0xd0a060, 0.95), 0, 0.07 + i * 0.145, 0, g).rotation.y = i * 0.2; return g; }
export function candle() { const g = grp(); cyl(0.02, 0.02, 0.14, solid(0xf0e8d0, 0.9), 0, 0.07, 0, g, 6); mesh(new THREE.SphereGeometry(0.018, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffc060 }), 0, 0.16, 0, g); return g; }

/* ---------- the shop: a small block building with a counter hatch, goods and a sign ---------- */
export function shop({ name = "BEV'S SHOP", roof = 'on', seed = 5 } = {}) {
  const g = house({ w: 5.4, d: 4, h: 2.7, style: 'block', wall: [236, 214, 150], roofRgb: [160, 80, 70], roof, shutters: roof === 'on' ? 'open' : 'closed', seed, porch: false, doorCol: 0x3a5a6a, door: { kind: 'plank', step: 0 } });   /* a board door behind the counter: no step, the counter stands in front of it */
  box(5.0, 0.1, 1.0, solid(0x5a4a3a, 0.9), 0, 1.06, 2.5, g); for (const x of [-2.3, 0, 2.3]) box(0.1, 1.0, 0.9, WOOD, x, 0.5, 2.5, g);   /* the counter on the street side */
  const sg = plane(2.6, 0.62, std(T.sign(name, 512, 128, '#f2c43a', '#3a1a10', '700 78px Georgia, serif'), 0.9), 0, 2.4, 2.05, g); sg.material = sg.material.clone(); sg.material.side = THREE.DoubleSide;
  for (const x of [-1.2, 1.2]) box(0.07, 0.4, 0.07, WOODD, x, 2.2, 2.05, g);   /* the sign's two posts, standing on the counter's front */
  box(0.07, 1.4, 0.07, WOODD, -1.2, 1.7, 2.05, g); box(0.07, 1.4, 0.07, WOODD, 1.2, 1.7, 2.05, g);
  return g;
}
export function shopGoods() { const g = grp(); for (let i = 0; i < 5; i++) { const t = tins(6, i + 1); t.position.set(-2 + i * 0.42, 1.11, 2.5); g.add(t); } const b = bread(); b.position.set(1.0, 1.11, 2.4); g.add(b); for (let i = 0; i < 4; i++) { const j = jug(); j.position.set(0.3 + i * 0.26, 1.11, 2.7); g.add(j); } return g; }

/* ---------- wreckage ---------- */
export function zincSheet({ len = 2.4, curl = 0.4, seed = 1, rgb = [150, 154, 150] } = {}) {   /* a loose sheet, bent and curled. Lies on the ground, or leans on something. */
  const r = rng(seed), geo = new THREE.PlaneGeometry(0.8, len, 3, 10), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const t = (p.getY(i) / len + 0.5), u = p.getX(i) / 0.8; p.setZ(i, curl * t * t * (1.2 + u * 0.5) + Math.sin(t * 9 + seed) * 0.03); }
  geo.computeVertexNormals(); const m = new THREE.Mesh(geo, zincMat(rgb, 1, len / 0.9)); m.rotation.x = -PI / 2; const g = grp(); g.add(m); m.position.y = 0.06 + curl * 0.35; m.position.z = 0; m.rotation.z = (r() - 0.5) * 0.3;
  const sk = mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), solid(0x6a5a4a, 1), 0, 0.06, -len * 0.3, g); sk.visible = true; return g;
}
export function plank(len = 1.6, seed = 1) { const r = rng(seed), g = grp(); const b = box(0.14, 0.04, len, RAW, 0, 0.04, 0, g); b.rotation.y = (r() - 0.5) * 3; b.rotation.z = (r() - 0.5) * 0.1; return g; }
export function branch(len = 2.2, seed = 1) { const r = rng(seed), g = grp(); const c = cyl(0.05, 0.08, len, solid(0x6a4c33, 1), 0, 0.14, 0, g, 6); c.rotation.z = PI / 2; c.rotation.y = r() * 3; for (let i = 0; i < 3; i++) { const l = mesh(new THREE.IcosahedronGeometry(0.28 + r() * 0.18, 0), flat(0x5a6a38), (r() - 0.5) * len * 0.6, 0.2, (r() - 0.5) * 0.7, g); l.scale.y = 0.4; } return g; }
export function mattress(c = 0xd8c8a0) { const g = grp(), m = box(1.9, 0.18, 0.95, solid(c, 1), 0, 0.12, 0, g); m.rotation.y = 0; box(1.9, 0.02, 0.95, solid(0x6a5a4a, 1), 0, 0.02, 0, g); return g; }
export function bareTree(h = 5.5, seed = 1) {   /* a tree stripped of its leaves by the wind: a trunk and bare limbs with a few torn twigs */
  const r = rng(seed), g = grp(), M = solid(0x6a4c33, 1); cyl(0.26, 0.4, h * 0.55, M, 0, h * 0.275, 0, g, 8);
  for (let i = 0; i < 5; i++) { const L = h * (0.28 + r() * 0.2), a = i / 5 * PI * 2 + r(), c = cyl(0.04, 0.12, L, M, Math.cos(a) * L * 0.3, h * 0.55 + L * 0.28, Math.sin(a) * L * 0.3, g, 6); c.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); }
  for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(0.3 + r() * 0.2, 0), flat(0x6a7a3a), (r() - 0.5) * 2.4, h * 0.7 + r() * h * 0.2, (r() - 0.5) * 2.4, g).scale.y = 0.6;
  return g;
}
export function snappedPalm(h = 6, seed = 1) {   /* a palm broken half way: a jagged stump and the top lying where it fell */
  const r = rng(seed), g = grp(), M = solid(0x8a7156, 1); const s = cyl(0.17, 0.26, h * 0.5, M, 0, h * 0.25, 0, g, 8); mesh(new THREE.ConeGeometry(0.2, 0.5, 5), solid(0xb89a70, 1), 0.05, h * 0.5 + 0.15, 0, g).rotation.z = 0.2;
  const top = grp(g, 0.8, 0.28, 0.3); top.rotation.y = r() * 6; const t = cyl(0.15, 0.17, h * 0.5, M, h * 0.25, 0, 0, top, 8); t.rotation.z = PI / 2;
  for (let i = 0; i < 6; i++) { const f = box(1.5 + r(), 0.02, 0.5, solid(0x5a6a2a, 1), h * 0.5 + 0.8, 0.12, (r() - 0.5) * 1.6, top); f.rotation.y = (r() - 0.5) * 1.4; } return g;
}
export function fallenTree({ len = 7.5, seed = 1 } = {}) {   /* a big tree on its side with the root plate standing up at one end. Its centre is the middle of the trunk; it lies along x. */
  const r = rng(seed), g = grp(), M = solid(0x6a4c33, 1); const T0 = cyl(0.55, 0.8, len, M, 0, 0.62, 0, g, 10); T0.rotation.z = PI / 2;
  const root = cyl(1.5, 1.4, 0.45, solid(0x6a4a30, 1), -len / 2 - 0.2, 1.5, 0, g, 12); root.rotation.z = PI / 2; mesh(new THREE.SphereGeometry(1.2, 8, 6), solid(0x5a3c28, 1), -len / 2 - 0.5, 1.4, 0, g).scale.set(0.35, 1, 1);
  for (let i = 0; i < 9; i++) { const a = r() * PI * 2, rr = cyl(0.06, 0.12, 1.3, solid(0x5a3c28, 1), -len / 2 - 0.5, 1.5 + Math.cos(a) * 1.0, Math.sin(a) * 1.0, g, 5); rr.rotation.set(Math.sin(a) * 1.2, 0, PI / 2 + Math.cos(a) * 0.6); }
  for (let i = 0; i < 4; i++) { const b = cyl(0.08, 0.16, 2.8, M, len * (0.1 + i * 0.1), 1.1, (i % 2 ? 1 : -1) * 0.5, g, 6); b.rotation.set(((i % 2) ? 1 : -1) * 0.7, 0, 0.5); }
  for (let i = 0; i < 6; i++) mesh(new THREE.IcosahedronGeometry(0.6 + r() * 0.4, 0), flat(i % 2 ? 0x6a7a3a : 0x5a6a30), len * (0.2 + r() * 0.3), 0.7 + r() * 0.8, (r() - 0.5) * 2.6, g).scale.y = 0.6;
  return g;
}
export function cutLogs({ seed = 1 } = {}) { const r = rng(seed), g = grp(), M = solid(0x6a4c33, 1), E = solid(0xc8a070, 1); for (let i = 0; i < 6; i++) { const L = 0.7 + r() * 0.5, c = cyl(0.5 - i * 0.03, 0.52 - i * 0.03, L, M, (r() - 0.5) * 2, 0.45, i * 0.8 - 2, g, 10); c.rotation.z = PI / 2; c.rotation.y = r() * 0.6; mesh(new THREE.CircleGeometry(0.48, 10), E, c.position.x + L / 2 + 0.01, 0.45, c.position.z, g).rotation.y = PI / 2; } return g; }
/* a leaning pole with its wires down: the wires lie on the ground (never touch fallen wires, the game says) */
export function leaningPole({ lean = 0.35, seed = 1, wires = true } = {}) {
  const r = rng(seed), g = grp(); const p = pole(7.2); p.rotation.z = lean; g.add(p);
  if (wires) for (const dz of [-0.4, 0.4]) { const tx = -Math.sin(lean) * 7, ty = Math.cos(lean) * 7, L = 8 + r() * 3, w = box(L, 0.025, 0.025, solid(0x1a1a1c, 0.6), tx - L / 2 - 0.1, 0.03, dz, g); w.rotation.y = (r() - 0.5) * 0.15; const hang = cyl(0.012, 0.012, ty - 0.1, solid(0x1a1a1c, 0.6), tx, ty / 2, dz, g, 4); hang.rotation.z = Math.atan2(0.3, 1) * 0.1; }
  return g;
}
export function tarpOnGround() { const g = grp(); const t = box(2.4, 0.04, 1.8, solid(0x2a6ab0, 0.7), 0, 0.03, 0, g); t.rotation.y = 0.3; return g; }
export function clothes() { const g = grp(), cols = [0xe8505b, 0x3ba0a0, 0xf0c040, 0xf0ece0]; for (let i = 0; i < 4; i++) { const c = box(0.4, 0.02, 0.3, solid(cols[i], 1), (i - 1.5) * 0.35, 0.03 + i * 0.01, (i % 2) * 0.2, g); c.rotation.y = i * 0.9; } return g; }
export function kerosene() { const g = grp(); cyl(0.07, 0.09, 0.12, solid(0x7a8088, 0.5, 0.5), 0, 0.06, 0, g, 10); cyl(0.05, 0.065, 0.2, solid(0xe8e0c8, 0.2, 0, { transparent: true, opacity: 0.55 }), 0, 0.22, 0, g, 10); mesh(new THREE.SphereGeometry(0.03, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffd078 }), 0, 0.2, 0, g); return g; }
