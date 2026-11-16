/* games/tivoli/src/vehicles.js: code-built vehicles for the street scene (no model files, so no licences to track). Two everyday Jamaican vehicles, general shapes only
   (a small saloon car like the Toyota Corolla, and a Hiace-style minibus, the common route taxi), not copies of any real vehicle or number plate.
   Each is built from a SIDE PROFILE extruded to the vehicle's width (so it has a real silhouette: sloped bonnet, windscreen, boot, and wheel arches cut into it),
   then the details: wheels (a rounded tyre, a rim, spokes or a steel disc with holes), window frames and pillars, windscreen and wipers, bumpers, grille,
   headlights, indicators, tail lights, door lines and handles, mirrors, number plates, and a plain underside (floor, axles, exhaust) for the ones that lie rolled over.
   A vehicle faces +x, sits on the ground (y = 0) and is centred on x and z; its left side is -z (Jamaica drives on the left, so the minibus's sliding door is there). Metres.
   Every part is a plain mesh on one of a few shared materials, because street.js merges the whole street into one mesh per material (bake.js): a detail costs
   triangles, not draw calls. Keep the outer size as it is (saloon 4.5 x 1.93 x 1.455, minibus 4.86 x 1.96 x 2.035): the cover spots and the audits are set to it.
   Plates carry grey blocks, not letters: private cars white, the minibuses red (the plate colour of a public passenger vehicle in Jamaica).
   overturned(v) lays a vehicle on its side (for the barricade). No police or military vehicles: the sources read did not mention any (docs/games/tivoli.md "Not found"). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const M = (c, r = 0.55, m = 0.15) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const GLASS = M(0x26333d, 0.15, 0.5), TYRE = M(0x151517, 0.95, 0), HUB = M(0xa9adb0, 0.4, 0.7), DARK = M(0x26262a, 0.8, 0.1), CHROME = M(0xc8ccd0, 0.3, 0.8),
  HEAD = new THREE.MeshStandardMaterial({ color: 0xf2eed8, emissive: 0x6a6650, roughness: 0.3 }), TAIL = new THREE.MeshStandardMaterial({ color: 0xa8201c, emissive: 0x3a0806, roughness: 0.4 }),
  AMBER = new THREE.MeshStandardMaterial({ color: 0xe08a1e, emissive: 0x4a2a04, roughness: 0.4 }), LINE = M(0x15151a, 0.9, 0);
const PAINTS = new Map(), paintOf = (c, r, m) => { const k = c + '/' + r + '/' + m; return PAINTS.get(k) || PAINTS.set(k, M(c, r, m)).get(k); };   /* one paint material per colour, shared by every vehicle of that colour */
const PLATES = {};
function plateMat(red) {   /* a number plate: a border and six grey blocks where the letters would be (no real number). White for a private car, red for a public passenger vehicle. */
  const k = red ? 'red' : 'white'; if (PLATES[k]) return PLATES[k];
  const m = M(red ? 0xb3261f : 0xe8e5d8, 0.6, 0); PLATES[k] = m; if (typeof document === 'undefined') return m;
  const c = document.createElement('canvas'); c.width = 64; c.height = 32; const g = c.getContext('2d'); g.fillStyle = red ? '#b3261f' : '#e8e5d8'; g.fillRect(0, 0, 64, 32);
  g.strokeStyle = g.fillStyle = red ? '#f0ece0' : '#22242a'; g.lineWidth = 2; g.strokeRect(2, 2, 60, 28); for (let i = 0; i < 6; i++) g.fillRect(8 + i * 8 + (i > 3 ? 3 : 0), 10, 5, 12);
  m.map = new THREE.CanvasTexture(c); m.map.colorSpace = THREE.SRGBColorSpace; m.color.set(0xffffff); return m;
}

function shape(pts) { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; }
function extrude(pts, width, mat, bevel = 0.035) {   /* a side profile (x along the vehicle, y up) pushed out to the vehicle's width (z) */
  const g = new THREE.ExtrudeGeometry(shape(pts), { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 1 });
  g.translate(0, 0, -(width - bevel * 2) / 2); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
}
function panel(g, mat, pts, holes, z0, z1) {   /* a flat cut-out sheet standing along the vehicle's side, from z0 to z1 (a window frame with its pillars, or a pane of an odd shape) */
  const s = shape(pts); for (const h of holes) s.holes.push(shape(h)); const ge = new THREE.ExtrudeGeometry(s, { depth: Math.abs(z1 - z0), bevelEnabled: false, curveSegments: 1 });
  ge.translate(0, 0, Math.min(z0, z1)); const m = new THREE.Mesh(ge, mat); m.castShadow = true; g.add(m); return m;
}
function box(g, mat, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; g.add(m); return m; }
function rod(g, mat, r, len, x, y, z, axis = 'x', seg = 8) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat); if (axis === 'x') m.rotation.z = Math.PI / 2; else if (axis === 'z') m.rotation.x = Math.PI / 2; m.position.set(x, y, z); g.add(m); return m; }
/* a strip lying on a sloped line of the profile (a windscreen, a wiper, a bonnet line, a roof rib). The line runs from (x0, y0) to (x1, y1) with x1 > x0;
   the strip is `wz` wide across the vehicle, `th` thick, centred at z, covers the part t0 to t1 of the line and sits `lift` off it (the body's bevel is 0.035). */
function along(g, mat, x0, y0, x1, y1, wz, th, z = 0, lift = 0.035, t0 = 0, t1 = 1) {
  const dx = x1 - x0, dy = y1 - y0, a = Math.atan2(dy, dx), tm = (t0 + t1) / 2, off = lift + th / 2 - 0.002;
  return box(g, mat, Math.hypot(dx, dy) * (t1 - t0), th, wz, x0 + dx * tm - Math.sin(a) * off, y0 + dy * tm + Math.cos(a) * off, z, 0, 0, a);
}
const arch = (cx, R, n = 8) => Array.from({ length: n + 1 }, (_, i) => [cx + R * Math.cos(Math.PI * i / n), 0.3 + R * Math.sin(Math.PI * i / n)]);   /* a wheel arch cut up into the bottom edge of a profile, front to back */

/* ---------- wheels: the shapes are made once for each size and kind, and every wheel shares them ---------- */
const WHEELS = {}, TW = 0.2;   /* TW: tyre width */
function wheelParts(r, kind) {
  const k = r + kind; if (WHEELS[k]) return WHEELS[k];
  const h = TW / 2, turn = (ge, z, ry = 0) => { if (ry) ge.rotateY(ry); ge.translate(0, 0, z); return ge; };
  const tyre = new THREE.LatheGeometry([[0.6, -h + 0.012], [0.9, -h], [0.975, -h + 0.02], [1, -h + 0.05], [1, h - 0.05], [0.975, h - 0.02], [0.9, h], [0.62, h - 0.012]].map(([rr, y]) => new THREE.Vector2(rr * r, y)), 20);
  tyre.rotateX(Math.PI / 2);   /* the lathe's axis becomes the axle (z); +z is the outer face */
  const bright = [], dark = [turn(new THREE.CircleGeometry(r * 0.62, 16), -h + 0.012, Math.PI)];   /* the plain inner face */
  const cap = (r0, r1, d, z) => { const c = new THREE.CylinderGeometry(r0, r1, d, 10); c.rotateX(Math.PI / 2); return turn(c, z); };
  if (kind === 'alloy') {   /* a car's wheel: a bright rim, five spokes and a centre cap over a dark well */
    dark.push(turn(new THREE.CircleGeometry(r * 0.62, 16), h - 0.045)); bright.push(turn(new THREE.RingGeometry(r * 0.5, r * 0.64, 20), h - 0.012), cap(r * 0.14, r * 0.16, 0.03, h - 0.02));
    for (let i = 0; i < 5; i++) { const s = new THREE.BoxGeometry(r * 0.5, r * 0.15, 0.02); s.translate(r * 0.3, 0, 0); s.rotateZ(i * Math.PI * 0.4 + 0.3); bright.push(turn(s, h - 0.03)); }
  } else {   /* a minibus's wheel: a pressed steel disc with a ring of holes and a dark centre */
    bright.push(turn(new THREE.CircleGeometry(r * 0.63, 16), h - 0.03), cap(r * 0.26, r * 0.3, 0.03, h - 0.02)); dark.push(cap(r * 0.12, r * 0.12, 0.034, h - 0.02));
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; dark.push(turn(new THREE.CircleGeometry(r * 0.075, 6), h - 0.028).translate(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, 0)); }
  }
  return (WHEELS[k] = { tyre, bright: mergeGeometries(bright), dark: mergeGeometries(dark) });
}
function wheel(g, r, x, z, kind) {   /* tyre, rim and the dark parts: three meshes, the outer face away from the vehicle */
  const p = wheelParts(r, kind), w = new THREE.Group(); w.position.set(x, r, z); if (z < 0) w.rotation.y = Math.PI;
  for (const [ge, mat] of [[p.tyre, TYRE], [p.bright, HUB], [p.dark, DARK]]) { const m = new THREE.Mesh(ge, mat); m.castShadow = true; w.add(m); }
  g.add(w);
}

/* ---------- a small saloon car, about 4.4 m long ---------- */
export function sedan(color = 0x8a9aa0) {
  const g = new THREE.Group(), paint = paintOf(color, 0.4, 0.35), plate = plateMat(false);
  g.add(extrude([[-2.18, 0.3], [-2.2, 0.56], [-2.16, 0.8], [-1.25, 0.87], [1.05, 0.84], [1.9, 0.72], [2.17, 0.65], [2.2, 0.46], [2.18, 0.3], ...arch(1.4, 0.39), ...arch(-1.35, 0.39)], 1.7, paint));
  for (const x of [1.4, -1.35]) box(g, DARK, 0.84, 0.4, 1.3, x, 0.5, 0);                    /* the dark inside of the wheel arches */
  box(g, DARK, 4.3, 0.03, 1.26, 0, 0.262, 0); rod(g, CHROME, 0.028, 0.5, -1.99, 0.25, -0.45);   /* the floor underneath and the exhaust pipe */

  /* the cabin: dark glass, a painted frame each side with its three pillars and two window openings, pillars beside the windscreen and rear screen, the roof */
  g.add(extrude([[-1.32, 0.84], [-1.02, 1.4], [0.3, 1.42], [1.02, 0.84]], 1.5, GLASS, 0.02));
  box(g, paint, 1.4, 0.05, 1.56, -0.36, 1.43, 0);
  const side = [[-1.37, 0.82], [-1.05, 1.44], [0.33, 1.45], [1.08, 0.82]], win = [[[-1.17, 0.9], [-0.92, 1.37], [-0.39, 1.37], [-0.39, 0.9]], [[-0.29, 0.9], [-0.29, 1.37], [0.29, 1.37], [0.85, 0.9]]];
  for (const s of [-1, 1]) {
    panel(g, paint, side, win, s * 0.745, s * 0.785);
    along(g, paint, 0.3, 1.42, 1.02, 0.84, 0.06, 0.012, s * 0.73, 0.02); along(g, paint, -1.32, 0.84, -1.02, 1.4, 0.06, 0.012, s * 0.73, 0.02);
    along(g, LINE, 1.05, 0.84, 1.9, 0.72, 0.012, 0.006, s * 0.62, 0.035, 0.08, 1); along(g, LINE, 1.9, 0.72, 2.17, 0.65, 0.012, 0.006, s * 0.62);   /* bonnet lines */
    along(g, LINE, -2.16, 0.8, -1.25, 0.87, 0.012, 0.006, s * 0.66, 0.035, 0.02, 0.97);                                                              /* boot lid lines */
  }
  along(g, DARK, 1.05, 0.84, 1.9, 0.72, 1.4, 0.006, 0, 0.035, 0, 0.07);                                                          /* the vent strip under the windscreen */
  along(g, DARK, 0.3, 1.42, 1.02, 0.84, 0.52, 0.012, -0.36, 0.02, 0.87, 0.91); along(g, DARK, 0.3, 1.42, 1.02, 0.84, 0.52, 0.012, 0.2, 0.02, 0.87, 0.91);   /* wipers */
  along(g, LINE, -2.16, 0.8, -1.25, 0.87, 1.33, 0.006, 0, 0.035, 0.95, 0.97);                                                    /* the boot lid's front edge */

  /* front: a painted bumper with a dark air intake and fog lamps, a grille with bright bars, headlights with amber indicators at the corners, a plate */
  box(g, paint, 0.1, 0.24, 1.68, 2.2, 0.42, 0); box(g, DARK, 0.02, 0.09, 0.8, 2.245, 0.36, 0); box(g, plate, 0.014, 0.11, 0.3, 2.248, 0.47, 0);
  box(g, DARK, 0.04, 0.1, 0.84, 2.205, 0.58, 0); box(g, CHROME, 0.012, 0.018, 0.8, 2.228, 0.58, 0); box(g, CHROME, 0.012, 0.012, 0.84, 2.228, 0.635, 0);
  for (const s of [-1, 1]) { box(g, HEAD, 0.06, 0.12, 0.32, 2.2, 0.58, s * 0.6); box(g, AMBER, 0.06, 0.12, 0.08, 2.2, 0.58, s * 0.8); box(g, HEAD, 0.02, 0.05, 0.1, 2.245, 0.36, s * 0.62); }
  /* back: a painted bumper with a dark lower strip, tail lights (red, amber at the corner, a white reversing light), a bright strip over the plate */
  box(g, paint, 0.1, 0.24, 1.68, -2.2, 0.42, 0); box(g, DARK, 0.02, 0.06, 1.5, -2.24, 0.34, 0); box(g, plate, 0.014, 0.11, 0.34, -2.228, 0.63, 0); box(g, CHROME, 0.015, 0.03, 0.5, -2.216, 0.72, 0);
  for (const s of [-1, 1]) { box(g, TAIL, 0.05, 0.13, 0.3, -2.2, 0.7, s * 0.62); box(g, AMBER, 0.05, 0.13, 0.08, -2.2, 0.7, s * 0.81); box(g, HEAD, 0.05, 0.07, 0.08, -2.2, 0.67, s * 0.43); }

  /* each side: three door lines and the sill, a dark rubbing strip, door handles, an indicator on the wing, a mirror on a short stalk */
  for (const s of [-1, 1]) {
    const z = s * 0.853;
    box(g, LINE, 0.012, 0.42, 0.012, 0.96, 0.63, z); box(g, LINE, 0.012, 0.44, 0.012, -0.34, 0.64, z); box(g, LINE, 0.012, 0.44, 0.012, -0.93, 0.64, z); box(g, LINE, 1.89, 0.012, 0.012, 0.015, 0.42, z);
    box(g, DARK, 1.85, 0.035, 0.014, 0.015, 0.6, z); box(g, DARK, 0.13, 0.035, 0.03, -0.16, 0.79, s * 0.86); box(g, DARK, 0.13, 0.035, 0.03, -0.76, 0.79, s * 0.86); box(g, AMBER, 0.07, 0.03, 0.012, 0.99, 0.76, z);
    box(g, paint, 0.1, 0.09, 0.12, 0.9, 1.0, s * 0.9048); box(g, paint, 0.06, 0.03, 0.12, 0.9, 0.965, s * 0.8); box(g, CHROME, 0.008, 0.065, 0.09, 0.847, 1.0, s * 0.9048);
  }
  for (const [x, z] of [[1.4, 0.74], [1.4, -0.74], [-1.35, 0.74], [-1.35, -0.74]]) wheel(g, 0.31, x, z, 'alloy');
  return g;
}

/* ---------- a Hiace-style minibus, about 4.7 m long ---------- */
export function minibus(color = 0xe9ecee, stripe = 0x2c5aa0) {
  const g = new THREE.Group(), paint = paintOf(color, 0.45, 0.25), plate = plateMat(true);
  g.add(extrude([[-2.35, 0.3], [-2.37, 1.7], [-2.25, 1.96], [1.2, 2.0], [1.42, 1.9], [1.98, 1.1], [2.3, 1.0], [2.37, 0.92], [2.38, 0.6], [2.36, 0.3], ...arch(1.45, 0.41), ...arch(-1.4, 0.41)], 1.7, paint));
  for (const x of [1.45, -1.4]) box(g, DARK, 0.88, 0.32, 1.3, x, 0.58, 0);                 /* the dark inside of the wheel arches */
  /* underneath (seen on the one rolled over at the barricade): the floor, both axles, the drive shaft, the exhaust and its silencer, the fuel tank, the spare wheel */
  box(g, DARK, 4.5, 0.03, 1.26, 0, 0.262, 0); rod(g, HUB, 0.045, 1.4, -1.4, 0.33, 0, 'z'); rod(g, HUB, 0.04, 1.4, 1.45, 0.33, 0, 'z'); rod(g, HUB, 0.11, 0.2, -1.4, 0.33, 0, 'z', 10);
  rod(g, HUB, 0.03, 2.0, -0.4, 0.3, 0); rod(g, HUB, 0.028, 1.95, -1.4, 0.225, 0.4); rod(g, HUB, 0.07, 0.5, -0.6, 0.2, 0.4, 'x', 10); box(g, DARK, 0.7, 0.14, 0.4, -0.5, 0.2, -0.36);
  rod(g, TYRE, 0.28, 0.16, -1.98, 0.17, 0, 'y', 14);

  /* front: the windscreen in a rubber seal, wipers, a vent strip, the grille with bright bars, headlights and amber indicators, bumper and plate */
  along(g, LINE, 1.42, 1.9, 1.98, 1.1, 1.58, 0.006, 0, 0.033, 0.02, 0.98); along(g, GLASS, 1.42, 1.9, 1.98, 1.1, 1.5, 0.01, 0, 0.035, 0.06, 0.94);
  along(g, DARK, 1.42, 1.9, 1.98, 1.1, 0.56, 0.012, -0.38, 0.045, 0.87, 0.9); along(g, DARK, 1.42, 1.9, 1.98, 1.1, 0.56, 0.012, 0.22, 0.045, 0.87, 0.9);
  along(g, LINE, 1.98, 1.1, 2.3, 1.0, 1.2, 0.006, 0, 0.035, 0.25, 0.45);
  box(g, DARK, 0.1, 0.22, 1.7, 2.38, 0.46, 0); box(g, plate, 0.012, 0.1, 0.32, 2.424, 0.46, 0);
  box(g, DARK, 0.03, 0.16, 0.66, 2.405, 0.8, 0); box(g, CHROME, 0.01, 0.02, 0.62, 2.423, 0.84, 0); box(g, CHROME, 0.01, 0.02, 0.62, 2.423, 0.77, 0);
  for (const s of [-1, 1]) { box(g, HEAD, 0.04, 0.16, 0.3, 2.405, 0.8, s * 0.6); box(g, AMBER, 0.04, 0.16, 0.1, 2.405, 0.8, s * 0.8); }
  /* back: the tailgate's window in its seal, the gate's outline, tall tail lights (amber, red, white), a bright strip over the plate, the bumper */
  box(g, LINE, 0.008, 0.46, 1.22, -2.4, 1.48, 0); box(g, GLASS, 0.012, 0.4, 1.16, -2.406, 1.48, 0);
  for (const s of [-1, 1]) { box(g, LINE, 0.02, 1.1, 0.012, -2.396, 1.15, s * 0.62); box(g, AMBER, 0.05, 0.12, 0.14, -2.385, 1.23, s * 0.74); box(g, TAIL, 0.05, 0.3, 0.14, -2.385, 1.02, s * 0.74); box(g, HEAD, 0.05, 0.08, 0.14, -2.385, 0.83, s * 0.74); }
  box(g, LINE, 0.02, 0.012, 1.24, -2.385, 0.6, 0); box(g, CHROME, 0.015, 0.05, 0.5, -2.398, 0.79, 0); box(g, plate, 0.012, 0.11, 0.36, -2.396, 0.68, 0);
  box(g, DARK, 0.1, 0.22, 1.7, -2.38, 0.46, 0);

  /* each side: three sliding windows in rubber seals with a bright bar down the middle, the cab window, the front door's line and handle, the sill, the rain gutter,
     a tall mirror, mud flaps. The left side (-z) has the sliding door: its two edges, its handle and the rail it runs back along. */
  const cabWin = [[0.88, 1.22], [0.88, 1.8], [1.38, 1.8], [1.78, 1.22]], cabSeal = [[0.85, 1.19], [0.85, 1.83], [1.4, 1.83], [1.83, 1.19]];
  const band = stripe === color ? null : paintOf(stripe, 0.5, 0.2);
  for (const s of [-1, 1]) {
    const z = s * 0.853;
    for (const [x0, x1] of [[-1.95, -1.1], [-0.98, -0.2], [-0.08, 0.7]]) { const xm = (x0 + x1) / 2; box(g, LINE, x1 - x0 + 0.06, 0.66, 0.008, xm, 1.5, z); box(g, GLASS, x1 - x0, 0.6, 0.012, xm, 1.5, s * 0.857); box(g, CHROME, 0.02, 0.6, 0.014, xm, 1.5, s * 0.858); }
    panel(g, LINE, cabSeal, [], s * 0.849, s * 0.857); panel(g, GLASS, cabWin, [], s * 0.851, s * 0.863);
    if (band) box(g, band, 4.6, 0.14, 0.014, 0, 0.92, s * 0.857);
    box(g, LINE, 0.015, 1.45, 0.012, 0.78, 1.175, z); box(g, DARK, 0.14, 0.04, 0.03, 0.92, 1.08, s * 0.862); box(g, LINE, 1.95, 0.012, 0.012, 0.025, 0.46, z); box(g, LINE, 3.5, 0.02, 0.014, -0.45, 1.9, z);
    if (s < 0) { box(g, LINE, 0.015, 1.45, 0.012, -1.04, 1.175, z); box(g, LINE, 0.015, 1.45, 0.012, -0.14, 1.175, z); box(g, LINE, 1.1, 0.025, 0.014, -1.6, 1.1, z); box(g, DARK, 0.14, 0.04, 0.03, -0.3, 1.08, s * 0.862); }
    box(g, DARK, 0.06, 0.2, 0.14, 1.7, 1.5, s * 0.9084); box(g, CHROME, 0.008, 0.16, 0.1, 1.668, 1.5, s * 0.915);
    for (const x of [1.45, -1.4]) box(g, DARK, 0.02, 0.22, 0.22, x - 0.47, 0.2, s * 0.74);
  }
  for (const z of [-0.45, 0, 0.45]) along(g, paint, -2.25, 1.96, 1.2, 2.0, 0.14, 0.01, z, 0.035, 0.08, 0.62);   /* the ribs pressed into the roof */
  for (const [x, z] of [[1.45, 0.74], [1.45, -0.74], [-1.4, 0.74], [-1.4, -0.74]]) wheel(g, 0.33, x, z, 'steel');
  return g;
}

/* lay a vehicle on its side (rolled about its length) so the wheels face along the street; `side` is +1 or -1. Wrap it so its position and turn still work. */
export function overturned(v, side = 1, height = 1.7) {
  const w = new THREE.Group(); v.rotation.x = side * Math.PI / 2; v.position.y = height / 2 + 0.02; w.add(v); return w;
}
