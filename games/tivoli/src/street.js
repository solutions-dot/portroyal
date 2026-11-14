/* games/tivoli/src/street.js: the street for the May 2010 scene. It is MADE UP: no real street or address (the Commission's evidence about where things happened is
   disputed, docs/games/tivoli.md "The dispute"). It is meant to feel like West Kingston at midday: walk-up flats of four storeys in faded pastel render, with balconies,
   burglar bars, louvred windows, laundry, satellite dishes, black water tanks and rebar on the roofs; shops with zinc roofs, roll-down shutters and painted signs;
   a worn road with patches and cracks, concrete kerbs, drains, litter; wooden poles with sagging wires, street lamps; mango trees and palms; a hazy sky with distant
   hills. Vehicles are code-built (vehicles.js). At the far end a barricade of debris and an overturned minibus lies across the road (barricades at the vehicle entrances
   are agreed by every source). Metres. The street runs along x (east is +x, where the soldiers come from; west is -x, the barricade) and is 9 m wide (z -4.5 to 4.5).
   Everything static is merged into one mesh per material, and textures are mapped by world position (one repeat = a few metres), so walls never stretch. */
import * as THREE from 'three';
import { bake } from './bake.js';
import * as TX from './textures.js';
import { addSky } from './sky.js';
import { sedan, minibus, overturned } from './vehicles.js';

const rngOf = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const M = (c, r = 0.9, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const W = (map, tile, r = 0.95, bright = 1.2) => { const m = new THREE.MeshStandardMaterial({ map, roughness: r }); m.color.setScalar(bright); m.userData.tile = tile; return m; };   /* world-mapped; bright lifts the weathered texture a little */

function materials() {
  const st = (c, seed) => W(TX.stucco(c, seed), TX.TILE.stucco);
  return {
    asphalt: W(TX.asphalt(), TX.TILE.asphalt, 0.95, 1.1), paving: W(TX.paving(), TX.TILE.paving), grass: W(TX.grass(), TX.TILE.grass),
    cream: st(0xdccfae, 3), blue: st(0xa6bfcb, 4), pink: st(0xdcb7a6, 5), green: st(0xb0c4a2, 6), yellow: st(0xe2d28a, 7), white: st(0xe8e4d8, 8), rawblock: W(TX.block(0x9a968c), TX.TILE.block),
    wallw: W(TX.block(0xe4e0d2, 9), TX.TILE.block), zinc: W(TX.zinc(), TX.TILE.zinc, 0.6), roofc: W(TX.stucco(0x8c8c88, 10), TX.TILE.stucco),
    win: M(0x364049, 0.5), frame: M(0xe6e2d6), slat: M(0x3a444c, 0.5), bar: M(0x2a2a2e, 0.6, 0.3), door: M(0x4a3a2c), kerb: M(0xb4b0a4), drain: M(0x1a1a1c), mark: M(0xdad6c4),
    tank: M(0x1d1d20, 0.7), dish: M(0xe0e0e0, 0.5, 0.2), ac: M(0xc4c6c6, 0.6), rebar: M(0x7a4a30, 0.8, 0.3), pole: M(0x6a5e50), insul: M(0x2d6a60, 0.4), lamp: new THREE.MeshStandardMaterial({ color: 0xeeeedd, emissive: 0x555544 }),
    trunk: M(0x5d4a35), leaf1: M(0x4d7a39), leaf2: M(0x628a45), leaf3: M(0x3f6a35), frond: M(0x5a8a3a), tyre: M(0x1b1b1d), wood: M(0x8c6b45), plank: M(0xa88a5c), rust: M(0x8a5a3c, 0.8, 0.3), junk: M(0x6a6a68),
    glass: M(0x2a3640, 0.2, 0.4), laundry1: M(0xd04a3a), laundry2: M(0x3a6ac0), laundry3: M(0xf0ece0), laundry4: M(0xe0c030),
    litter1: M(0xd8d8d0), litter2: M(0x3a7a4a), litter3: M(0xc8a040), litter4: M(0x4a6aa8), hill: M(0x5d7a5a, 1),
  };
}

export function buildStreet(opts = {}) {
  const rnd = rngOf(20100524), g = new THREE.Group(), spots = {}, lines = [], X = materials();
  const box = (mat, w, h, d, x, y, z, ry = 0, rz = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.rotation.set(0, ry, rz); g.add(m); return m; };
  const cyl = (mat, r, h, x, y, z, seg = 12, rx = 0, rz = 0, r2 = r) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, seg), mat); m.position.set(x, y + h / 2, z); m.rotation.set(rx, 0, rz); g.add(m); return m; };

  /* ---- ground, pavements, kerbs, markings ---- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 260), X.grass); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.04; g.add(ground);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(400, 9.2), X.asphalt); road.rotation.x = -Math.PI / 2; road.position.y = 0.0; g.add(road);
  for (const sz of [-1, 1]) { box(X.paving, 400, 0.16, 3.6, 0, 0, sz * 6.3); box(X.kerb, 400, 0.2, 0.28, 0, 0, sz * 4.5); }
  for (let x = -60; x < 60; x += 5) box(X.mark, 2.4, 0.012, 0.16, x, 0.005, 0);                                    /* the dashed middle line */
  for (const sz of [-1, 1]) box(X.mark, 400, 0.012, 0.1, 0, 0.005, sz * 4.2);                                      /* faded edge lines */
  for (let z = -3.6; z <= 3.7; z += 0.9) box(X.mark, 3.2, 0.012, 0.42, 12, 0.006, z);                               /* a faded zebra crossing */
  for (const [x, z] of [[-6, 1.2], [8, -1.6], [-21, 0.4]]) cyl(X.drain, 0.45, 0.03, x, 0.002, z, 14);             /* manholes */
  for (let x = -40; x < 40; x += 9) for (const sz of [-1, 1]) { box(X.drain, 0.9, 0.04, 0.35, x + 2 * sz, 0.0, sz * 4.2); for (let k = 0; k < 4; k++) box(X.kerb, 0.04, 0.045, 0.3, x + 2 * sz - 0.3 + k * 0.2, 0.005, sz * 4.2); }   /* storm drains with grates */
  const bits = [X.litter1, X.litter2, X.litter3, X.litter4]; for (let i = 0; i < 90; i++) { const sz = rnd() < 0.5 ? -1 : 1, x = -45 + rnd() * 90, z = rnd() < 0.6 ? sz * (4.0 + rnd() * 0.4) : sz * (4.8 + rnd() * 2.6); box(bits[(rnd() * 4) | 0], 0.1 + rnd() * 0.25, 0.04 + rnd() * 0.08, 0.08 + rnd() * 0.2, x, 0.0, z, rnd() * 3); }   /* litter */

  /* ---- walk-up flats: render, plinth, balconies with railings and burglar bars, louvred windows, laundry, dishes, rooftop tanks and rebar ---- */
  function flats(x, z, w, d, floors, mat, facing = 1) {
    const h = floors * 3.1, fz = z + facing * (d / 2 + 0.02), cols = Math.floor(w / 3.2), tall = floors > 2;
    box(mat, w, h, d, x, 0, z); box(X.rawblock, w + 0.05, 0.9, d + 0.05, x, 0, z);                                  /* the body and a darker plinth */
    box(X.roofc, w + 0.3, 0.3, d + 0.3, x, h, z); box(mat, w + 0.3, 0.55, 0.2, x, h + 0.3, z + facing * (d / 2 + 0.05));   /* roof slab and a parapet on the street side */
    for (let f = 0; f < floors; f++) {
      const y0 = f * 3.1;
      if (f) { box(X.frame, w + 0.2, 0.18, 1.4, x, y0 - 0.1, fz + facing * 0.6); box(X.bar, w + 0.2, 0.9, 0.04, x, y0 + 0.1, fz + facing * 1.28); for (let b = 0; b < w * 2.5; b++) box(X.bar, 0.025, 0.9, 0.025, x - w / 2 + 0.1 + b * 0.4, y0 + 0.1, fz + facing * 1.28); }   /* balcony slab, rail and balusters */
      for (let c = 0; c < cols; c++) {
        const wx = x - w / 2 + (c + 0.5) * (w / cols), wy = y0 + 0.95;
        box(X.frame, 1.55, 1.75, 0.1, wx, wy - 0.12, fz); box(X.win, 1.35, 1.55, 0.12, wx, wy - 0.02, fz + facing * 0.01);
        for (let s = 0; s < 4; s++) box(X.slat, 1.3, 0.05, 0.05, wx, wy + 0.18 + s * 0.3, fz + facing * 0.08);   /* louvres */
        if (f < 2 && tall) { for (let b = 0; b < 6; b++) box(X.bar, 0.025, 1.6, 0.025, wx - 0.6 + b * 0.24, wy - 0.1, fz + facing * 0.16); box(X.bar, 1.4, 0.03, 0.03, wx, wy + 0.4, fz + facing * 0.16); box(X.bar, 1.4, 0.03, 0.03, wx, wy - 0.4, fz + facing * 0.16); }   /* burglar bars */
        if (rnd() < 0.22) box(X.ac, 0.7, 0.45, 0.4, wx + 0.5, wy - 0.5, fz + facing * 0.3);                          /* a window air conditioner */
        if (f && rnd() < 0.2) { const lm = [X.laundry1, X.laundry2, X.laundry3, X.laundry4]; for (let k = 0; k < 3; k++) box(lm[(rnd() * 4) | 0], 0.4, 0.55, 0.02, wx - 0.5 + k * 0.5, y0 + 0.2, fz + facing * 1.25); }   /* laundry on the balcony rail */
        if (f && rnd() < 0.16) { const dd = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 5, 0, Math.PI * 2, 0, 1.2), X.dish); dd.position.set(wx + 0.3, y0 + 1.5, fz + facing * 1.0); dd.rotation.set(facing * -0.9, 0, 0); g.add(dd); box(X.bar, 0.05, 1.4, 0.05, wx + 0.3, y0, fz + facing * 1.0); }   /* a satellite dish on a post standing on the balcony slab */
      }
    }
    box(X.door, 1.3, 2.2, 0.1, x - w / 2 + 1.6, 0.02, fz); box(X.frame, 1.5, 0.12, 0.14, x - w / 2 + 1.6, 2.25, fz);
    for (let t = 0; t < 1 + ((rnd() * 2) | 0); t++) { const tx = x - w / 2 + 2 + rnd() * (w - 4), tz = z + (rnd() - 0.5) * (d - 3); cyl(X.tank, 0.7, 1.3, tx, h + 0.3, tz, 14); box(X.bar, 0.9, 0.5, 0.9, tx, h + 0.3, tz); }   /* black plastic water tanks */
    for (let r = 0; r < 8; r++) box(X.rebar, 0.025, 1.3 + rnd() * 0.6, 0.025, x + w / 2 - 1 - (r % 4) * 0.3, h + 0.3, z - d / 2 + 0.8 + ((r / 4) | 0) * 0.3);   /* rebar left standing for a floor not yet built */
  }
  function shop(x, z, w, d, mat, signText, signBg) {   /* a low shop on the south side (front faces -z) with a zinc roof, a roll-down shutter and a painted sign */
    box(mat, w, 3.4, d, x, 0, z); box(X.rawblock, w + 0.05, 0.7, d + 0.05, x, 0, z); const r = box(X.zinc, w + 0.7, 0.14, d + 0.7, x, 3.4, z); r.rotation.z = 0.05;
    const fz = z - (d / 2 + 0.04); box(X.zinc, w * 0.72, 2.3, 0.08, x, 0.1, fz); for (let k = 0; k < 14; k++) box(X.bar, 0.02, 2.3, 0.02, x - w * 0.34 + k * (w * 0.68 / 13), 0.1, fz - 0.05);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, 0.9), new THREE.MeshStandardMaterial({ map: TX.sign(signText, signBg), roughness: 0.7 })); sg.position.set(x, 2.95, fz - 0.06); sg.rotation.y = Math.PI; lines.push(sg);
  }

  /* north side: tall flats; south side: shops and lower flats (the child's window is on the x = 22 block, second floor, at the east end) */
  flats(-2, -13, 16, 9, 4, X.cream); flats(20, -13, 14, 9, 4, X.blue); flats(-24, -13, 14, 9, 4, X.pink); flats(-44, -13, 16, 9, 4, X.green); flats(38, -13, 14, 9, 4, X.yellow);
  shop(-14, 12, 8, 7, X.wallw, 'GROCERY', 0xd8c02a); shop(-30, 12, 9, 7, X.pink, 'BAR & LOUNGE', 0x2f6a8a); flats(-8, 14, 14, 8, 2, X.blue, -1); flats(22, 14, 14, 8, 2, X.cream, -1);
  for (let x = 2; x < 15; x += 1.2) box(X.zinc, 1.22, 2.1, 0.06, x + 0.6, 0, 9.9, 0.02 * ((x * 7) % 3 - 1));   /* a vacant lot behind a zinc-sheet fence, between the flats */ flats(-46, 14, 12, 8, 2, X.yellow, -1);

  /* ---- cover and vehicles ---- */
  box(X.wallw, 0.35, 1.15, 4.2, -2, 0, -2.4); spots.wallA = [[-0.7, -3.4], [-0.7, -2.2], [-0.7, -1.2]];
  box(X.wallw, 0.35, 1.15, 3.6, -11, 0, 2.6); spots.wallB = [[-9.7, 3.4], [-9.7, 2.2]];
  const car = sedan(0x4c6a5c); car.position.set(2, 0, 1.9); car.rotation.y = 0.04; g.add(car); spots.car = [[4.7, 2.9], [5.9, 1.7], [4.6, 0.5]];
  const van = minibus(0xb9d0de, 0xb9d0de); van.position.set(-17, 0, -2.6); van.rotation.y = 0.1; g.add(van); spots.van = [[-14.3, -2.6], [-14.4, -3.8]];
  const parked = sedan(0xb1b6ba); parked.position.set(-6, 0, 5.2); parked.rotation.y = Math.PI; g.add(parked);                       /* parked at the south kerb */
  const parked2 = minibus(0xe2cf7a, 0xe2cf7a); parked2.position.set(14, 0, -5.4); parked2.rotation.y = Math.PI; g.add(parked2);         /* a second minibus at the north kerb */
  const parked3 = sedan(0x8a2d2a); parked3.position.set(-34, 0, 5.4); parked3.rotation.y = Math.PI + 0.05; g.add(parked3);
  box(X.zinc, 3.6, 0.1, 1.6, -24, 2.4, 3.2); for (const dx of [-1.7, 1.7]) box(X.pole, 0.1, 2.4, 0.1, -24 + dx, 0, 3.2); box(X.pole, 0.08, 2.7, 0.08, -24 + 2.2, 0, 3.2); box(X.frame, 0.06, 0.6, 0.5, -24 + 2.2, 2.1, 3.2);   /* bus shelter and a bus stop sign on its post */

  /* ---- the barricade at x = -27: an overturned minibus and a car pushed across the road, tyres, pallets, planks and rubble ---- */
  const bx = -27, ov = overturned(minibus(0xe4e8e4, 0xe4e8e4), 1, 1.7); ov.position.set(bx, 0, -1.4); ov.rotation.y = 1.32; g.add(ov);
  const pushed = sedan(0x707880); pushed.position.set(bx + 0.3, 0.1, 2.6); pushed.rotation.set(0.05, 1.45, 0.06); g.add(pushed);
  for (let i = 0; i < 5; i++) { cyl(X.tyre, 0.42, 0.24, bx + 0.9 + (i % 2) * 0.35, i * 0.25, 3.7, 14); cyl(X.tyre, 0.42, 0.24, bx - 0.6, i * 0.25, -3.8 + (i % 3) * 0.3, 14); }
  for (let i = 0; i < 7; i++) { const p = box(X.wood, 1.2, 0.14, 1, bx + 1.1 + (i % 3) * 0.55, 0.15 + (i % 4) * 0.15, 0.4 + (i % 2) * 1.5, i * 0.5); for (let s = 0; s < 3; s++) box(X.plank, 1.2, 0.03, 0.08, bx + 1.1 + (i % 3) * 0.55, 0.23 + (i % 4) * 0.15, 0.1 + (i % 2) * 1.5 + s * 0.3, i * 0.5); }
  for (let i = 0; i < 6; i++) box(X.plank, 0.12, 2.6, 0.2, bx + 1.8, 0, -4 + i * 1.6, 0.3, 0.5);
  for (let i = 0; i < 40; i++) box(i % 3 ? X.rust : X.junk, 0.3 + (i % 5) * 0.18, 0.25 + (i % 3) * 0.22, 0.4 + (i % 4) * 0.1, bx - 1.3 + ((i * 37) % 36) / 10, 0, -4.3 + ((i * 53) % 86) / 10, i);
  spots.barricade = [[bx - 2.2, -3], [bx - 2.4, -1.2], [bx - 2.2, 0.8], [bx - 2.5, 2.4], [bx - 2.3, 3.8]];

  /* ---- poles, wires, street lamps, trees, hills ---- */
  const poles = [30, 14, -2, -18, -34, -50].map((x) => [x, -5.5]);
  for (const [x, z] of poles) { box(X.pole, 0.24, 8.4, 0.24, x, 0, z); box(X.pole, 2.2, 0.14, 0.14, x, 7.4, z); for (const o of [-0.9, 0, 0.9]) cyl(X.insul, 0.06, 0.22, x + o, 7.5, z, 6); box(X.frame, 0.3, 0.5, 0.06, x, 3.2, z + 0.15); }
  const wireMat = new THREE.LineBasicMaterial({ color: 0x1a1a1c });
  for (let i = 0; i < poles.length - 1; i++) for (const o of [-0.9, 0, 0.9]) { const a = poles[i], b = poles[i + 1], pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * u + o, 7.7 - Math.sin(u * Math.PI) * 0.7, a[1])); } lines.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat)); }
  for (const [x, z] of poles) { box(X.pole, 0.08, 0.08, 1.6, x, 6.4, z + 0.8); box(X.lamp, 0.28, 0.14, 0.5, x, 6.26, z + 1.5); }   /* street lamps on arms from the utility poles */
  function mango(x, z, s = 1) { cyl(X.trunk, 0.28 * s, 3 * s, x, 0, z, 8); [[0, 4.4, 0, 2.6, X.leaf1], [1.6, 4.0, 0.6, 1.9, X.leaf2], [-1.5, 3.9, -0.5, 2.0, X.leaf3], [0.2, 5.4, -0.3, 1.8, X.leaf2]].forEach(([dx, dy, dz, r, mm]) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mm); l.position.set(x + dx * s, dy * s, z + dz * s); g.add(l); }); }
  function palm(x, z, s = 1, lean = 0.08) {   /* a coconut palm: a tapering, slightly leaning trunk and nine drooping fronds round the crown */
    const hgt = 7 * s; cyl(X.trunk, 0.2 * s, hgt, x, 0, z, 8, 0, lean, 0.14 * s); const cx = x - Math.sin(lean) * hgt * 0.5;
    for (let i = 0; i < 9; i++) { const a = i * 0.698, f = box(X.frond, 0.8 * s, 0.04, 3.0 * s, cx + Math.cos(a) * 1.3 * s, hgt - 0.1, z + Math.sin(a) * 1.3 * s); f.rotation.order = 'YXZ'; f.rotation.set(0.7, Math.PI / 2 - a, 0); }
  }
  mango(26, 9, 1); mango(-22, 9.6, 1.2); mango(-34, -9.2, 1); mango(40, 8.5, 1.3); palm(30, 8.4, 1, 0.1); palm(-20, 9.8, 1.1, -0.07); palm(1, 13.2, 0.8, 0.05); palm(-40, 9.4, 1, 0.09); palm(14, -9.4, 1.2, -0.06);
  for (const [x, z, r, hh, c] of [[-170, -20, 70, 40, 0], [-150, 70, 60, 34, 0], [-120, -90, 80, 50, 0], [-40, -150, 90, 46, 0], [60, -160, 100, 52, 0], [150, -60, 80, 40, 0], [-200, 30, 90, 56, 0]]) { const h = new THREE.Mesh(new THREE.ConeGeometry(r, hh, 9), X.hill); h.position.set(x, hh / 2 - 2, z); g.add(h); }   /* the hills round Kingston, hazy in the distance */

  /* dust spots: the walls and ground where the fighting kicks up dust, away from where anyone stands (x, y, z) */
  spots.dust = [[-2.2, 0.8, -1.6], [-2.2, 1.0, -3.9], [-9.5, 1.1, 1.0], [-11.3, 0.9, 3.8], [1.6, 0.3, 3.4], [-15.2, 0.9, -1.2], [-6, 0.1, 0.5], [2, 0.1, -0.5], [-13, 0.1, 1.4], [-20, 0.1, 0.5]];
  spots.dustFar = [[-25.5, 1.4, -2.2], [-25.8, 0.8, 2.6], [-24.9, 1.9, 0.4], [-25.2, 2.2, -3.0], [-26.2, 0.4, 3.9]];

  /* ---- merge everything static: one mesh per material, textures mapped by world position (bake.js) ---- */
  const out = bake(g, [X.asphalt, X.grass]);
  for (const l of lines) out.add(l);

  const sun = addSky(out, rnd, { shadows: opts.shadows });
  return { group: out, spots, sun, raw: g };   /* raw: the unmerged parts, for the place audit (?test=audit) */
}
