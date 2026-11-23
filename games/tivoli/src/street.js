/* games/tivoli/src/street.js: the street for the May 2010 scene. It is MADE UP: no real street or address (the Commission's evidence about where things happened is
   disputed, docs/games/tivoli.md "The dispute"). It is meant to feel like West Kingston at midday: walk-up flats of four storeys in faded pastel render, with balconies,
   burglar bars, louvred windows, laundry, black water tanks and rebar on the roofs; shops with zinc roofs, roll-down shutters and painted signs;
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
    fence: W(TX.fenceBlock(), TX.TILE.fence, 0.9, 1.1), wallw: W(TX.block(0xe4e0d2, 9), TX.TILE.block), zinc: W(TX.zinc(), TX.TILE.zinc, 0.6), roofc: W(TX.stucco(0x8c8c88, 10), TX.TILE.stucco),
    win: M(0x364049, 0.5), frame: M(0xe6e2d6), slat: M(0x3a444c, 0.5), bar: M(0x2a2a2e, 0.6, 0.3), gate: M(0xf0eee6, 0.6, 0.2), door: M(0x4a3a2c), kerb: M(0xb4b0a4), drain: M(0x1a1a1c), mark: M(0xdad6c4),
    tank: M(0x1d1d20, 0.7), ac: M(0xc4c6c6, 0.6), rebar: M(0x7a4a30, 0.8, 0.3), pole: M(0x6a5e50), insul: M(0x2d6a60, 0.4), lamp: new THREE.MeshStandardMaterial({ color: 0xeeeedd, emissive: 0x555544 }),
    trunk: M(0x5d4a35), leaf1: M(0x4d7a39), leaf2: M(0x628a45), leaf3: M(0x3f6a35), frond: M(0x5a8a3a), tyre: M(0x1b1b1d), wood: M(0x8c6b45), plank: M(0xa88a5c), rust: M(0x8a5a3c, 0.8, 0.3), junk: M(0x6a6a68),
    glass: M(0x2a3640, 0.2, 0.4), laundry1: M(0xd04a3a), laundry2: M(0x3a6ac0), laundry3: M(0xf0ece0), laundry4: M(0xe0c030),
    litter1: M(0xd8d8d0), litter2: M(0x3a7a4a), litter3: M(0xc8a040), litter4: M(0x4a6aa8), hill: M(0x5d7a5a, 1),
  };
}

export function buildStreet(opts = {}) {
  const inc = opts.incursion !== false;   /* the barricade and the two vehicles left across the lanes belong to 24 May 2010 only (owner, 22 November 2026); chapter 4 has a clear road with traffic */
  const rnd = rngOf(20100524), g = new THREE.Group(), spots = {}, lines = [], X = materials();
  const solids = [], SO = (kind, x0, x1, z0, z1, y0, y1, name = kind) => solids.push({ kind, name, x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), y0, y1 });   /* the solid things, as boxes, for the overlap check (?test=audit) */
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

  /* ---- walk-up flats: render, plinth, balconies with railings and burglar bars, louvred windows, laundry, rooftop tanks and rebar ---- */
  function flats(x, z, w, d, floors, mat, facing = 1) {
    const h = floors * 3.1, fz = z + facing * (d / 2 + 0.02), cols = Math.floor(w / 3.2), tall = floors > 2;
    SO('building', x - w / 2 - 0.15, x + w / 2 + 0.15, z - d / 2 - 0.15, z + d / 2 + 0.15, 0, h + 0.9, 'flats@' + x + ',' + z); if (floors > 1) SO('building', x - w / 2, x + w / 2, facing > 0 ? z + d / 2 : z - d / 2 - 1.4, facing > 0 ? z + d / 2 + 1.4 : z - d / 2, 3, h, 'balconies@' + x + ',' + z);
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
        if (f) rnd();   /* keeps the random draws in step, so the street looks the same (there are no satellite dishes in this game) */
      }
    }
    box(X.door, 1.3, 2.2, 0.1, x - w / 2 + 1.6, 0.02, fz); box(X.frame, 1.5, 0.12, 0.14, x - w / 2 + 1.6, 2.25, fz);
    for (let t = 0; t < 1 + ((rnd() * 2) | 0); t++) { const tx = x - w / 2 + 2 + rnd() * (w - 4), tz = z + (rnd() - 0.5) * (d - 3); cyl(X.tank, 0.7, 1.3, tx, h + 0.3, tz, 14); box(X.bar, 0.9, 0.5, 0.9, tx, h + 0.3, tz); }   /* black plastic water tanks */
    for (let r = 0; r < 8; r++) box(X.rebar, 0.025, 1.3 + rnd() * 0.6, 0.025, x + w / 2 - 1 - (r % 4) * 0.3, h + 0.3, z - d / 2 + 0.8 + ((r / 4) | 0) * 0.3);   /* rebar left standing for a floor not yet built */
  }
  function shop(x, z, w, d, mat, signText, signBg) {   /* a low shop on the south side (front faces -z) with a zinc roof, a roll-down shutter and a painted sign */
    SO('building', x - w / 2 - 0.35, x + w / 2 + 0.35, z - d / 2 - 0.35, z + d / 2 + 0.35, 0, 3.6, 'shop@' + x); SO('building', x - w / 2 - 0.2, x + w / 2 + 0.2, z - d / 2 - 1.95, z - d / 2, 3.2, 3.45, 'walkway@' + x); for (const cx of [-w / 2 + 0.15, 0, w / 2 - 0.15]) SO('post', x + cx - 0.12, x + cx + 0.12, z - d / 2 - 1.95, z - d / 2 - 1.7, 0, 3.2, 'post@' + x);
    box(mat, w, 3.4, d, x, 0, z); box(X.rawblock, w + 0.05, 0.7, d + 0.05, x, 0, z); const r = box(X.zinc, w + 0.7, 0.14, d + 0.7, x, 3.4, z); r.rotation.z = 0.05;
    const fz = z - (d / 2 + 0.04); box(X.zinc, w * 0.72, 2.3, 0.08, x, 0.1, fz); for (let k = 0; k < 14; k++) box(X.bar, 0.02, 2.3, 0.02, x - w * 0.34 + k * (w * 0.68 / 13), 0.1, fz - 0.05);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, 0.9), new THREE.MeshStandardMaterial({ map: TX.sign(signText, signBg), roughness: 0.7 })); sg.position.set(x, 2.95, fz - 0.06); sg.rotation.y = Math.PI; lines.push(sg);
    box(X.roofc, w + 0.4, 0.18, 1.9, x, 3.22, fz - 1.0); for (const cx of [-w / 2 + 0.15, 0, w / 2 - 0.15]) box(X.wallw, 0.24, 3.22, 0.24, x + cx, 0, fz - 1.8);   /* a covered walkway: a concrete slab on square posts over the pavement (Coronation Market street, Gleaner, 26 May 2010) */
  }

  /* north side: tall flats; south side: shops and lower flats (the child's window is on the x = 22 block, second floor, at the east end) */
  flats(-2, -13, 16, 9, 4, X.cream); flats(20, -13, 14, 9, 4, X.blue); flats(-24, -13, 14, 9, 4, X.pink); flats(-44, -13, 16, 9, 4, X.green); flats(38, -13, 14, 9, 4, X.yellow);
  shop(-14, 12, 8, 7, X.wallw, 'GROCERY', 0xd8c02a); shop(-30, 12, 9, 7, X.pink, 'BAR & LOUNGE', 0x2f6a8a); flats(-8, 14, 14, 8, 2, X.blue, -1); flats(22, 14, 14, 8, 2, X.cream, -1);
  for (let x = 2; x < 15; x += 1.2) box(X.zinc, 1.22, 2.1, 0.06, x + 0.6, 0, 9.9, 0.02 * ((x * 7) % 3 - 1));   /* a vacant lot behind a zinc-sheet fence, between the flats */ flats(-46, 14, 12, 8, 2, X.yellow, -1);

  /* ---- white block fences and gates along the lanes, with bushy shrubs behind (Gleaner photographs, 24 to 27 May 2010: white cast-block fences with round openings, iron gates, thick greenery) ---- */
  function fenceRun(x0, x1, z, gate) {
    SO('fence', x0 - 0.15, x1 + 0.15, z - 0.17, z + 0.17, 0, 1.6, 'fence@' + x0);
    const n = Math.round((x1 - x0) / 1.3), step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const cx = x0 + (i + 0.5) * step; if (Math.abs(cx - gate) < 0.9) continue; box(X.fence, step - 0.22, 1.3, 0.16, cx, 0.0, z); box(X.wallw, step - 0.1, 0.1, 0.22, cx, 1.3, z); }
    for (let i = 0; i <= n; i++) { const px = x0 + i * step; if (Math.abs(px - gate) < 0.5 || Math.abs(px - gate) < 1.05) { box(X.wallw, 0.3, 1.6, 0.3, px, 0, z); box(X.wallw, 0.38, 0.1, 0.38, px, 1.6, z); } else if (i % 2 === 0) { box(X.wallw, 0.26, 1.45, 0.26, px, 0, z); } }
    box(X.wallw, 0.3, 1.6, 0.3, gate - 0.95, 0, z); box(X.wallw, 0.3, 1.6, 0.3, gate + 0.95, 0, z);
    for (let b = 0; b < 9; b++) box(X.gate, 0.03, 1.3, 0.03, gate - 0.64 + b * 0.16, 0.05, z); box(X.gate, 1.4, 0.04, 0.04, gate, 0.35, z); box(X.gate, 1.4, 0.04, 0.04, gate, 1.1, z);   /* the white iron gate */
  }
  fenceRun(-9.2, -1.6, 8.5, -5.7); fenceRun(15.4, 24.2, 8.5, 19.8);
  function bush(x, z, s = 1) { SO('bush', x - 1.5 * s, x + 1.5 * s, z - 1.1 * s, z + 1.1 * s, 0, 2.3 * s, 'bush@' + x + ',' + z); for (const [dx, dy, dz, r, mm] of [[0, 1.1, 0, 0.9, X.leaf1], [0.7, 0.8, 0.2, 0.7, X.leaf2], [-0.6, 0.9, -0.2, 0.75, X.leaf3], [0.1, 1.7, 0, 0.6, X.leaf2]]) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mm); l.position.set(x + dx * s, dy * s, z + dz * s); g.add(l); } }
  for (const [x, z, sc] of [[-8.6, 9.2, 0.5], [-3.0, 9.2, 0.5], [16.8, 9.2, 0.5], [22.6, 9.2, 0.5], [4, 12, 1.1], [13, 12, 0.9]]) bush(x, z, sc);

  /* ---- cover and vehicles ---- */
  if (inc) { SO('cover', -2.65, -1.55, -4.5, -0.3, 0, 1.18, 'wallA'); SO('cover', -11.65, -10.55, 0.8, 4.4, 0, 1.2, 'wallB'); }
  if (inc) {   /* cover for the operation scene only: street junk dragged into the road, not concrete walls (owner, 23 November 2026: "concrete walls in the
     road dont make sense ... like an overturned table, or a fridge"). Reports of the barricades in West Kingston in May 2010 name old vehicles, appliances and
     debris. Each heap stands about 1.15 m, so a soldier crouches behind it and fires over it, as at the walls it replaces. */
    const enamel = new THREE.MeshStandardMaterial({ color: 0xe8e6de, roughness: 0.45, metalness: 0.1 }), chrome = new THREE.MeshStandardMaterial({ color: 0x9a9ea2, roughness: 0.3, metalness: 0.8 });
    const table = (x, z0, len) => {   /* a big wooden table turned onto its long edge: the top stands up as a screen, the legs stick out behind (west) */
      box(X.wood, 0.05, 1.15, len, x + 0.15, 0, z0 + len / 2); box(X.plank, 0.06, 0.06, len, x + 0.15, 1.12, z0 + len / 2);
      for (const dz of [0.12, len - 0.12]) for (const y of [0.12, 1.0]) box(X.wood, 0.7, 0.07, 0.07, x - 0.2, y, z0 + dz);   /* the four legs, level with the ground now */
      box(X.wood, 0.05, 0.1, len - 0.3, x + 0.1, 0.5, z0 + len / 2);   /* the rail under the top */
    };
    /* east heap (x -2): an overturned table, and an old fridge on its side with a door leaned on it */
    table(-2.05, -4.45, 2.0);
    box(enamel, 0.66, 0.68, 1.6, -2.0, 0, -1.45); box(chrome, 0.04, 0.05, 0.35, -1.66, 0.45, -1.8); box(X.junk, 0.02, 0.02, 1.55, -1.665, 0.34, -1.45);   /* the fridge, its handle and door seam */
    box(X.plank, 0.05, 1.18, 0.8, -1.72, 0, -0.75, 0, 0.12); box(X.wood, 0.02, 0.9, 0.04, -1.7, 0.1, -0.75, 0, 0.12);   /* a door leaned against it */
    spots.wallA = [[-0.7, -3.4], [-0.7, -2.2], [-0.7, -1.2]];
    /* west heap (x -11): two oil drums with a sheet of zinc propped across them, and a second table on its edge */
    for (const z of [1.25, 2.0]) cyl(X.rust, 0.29, 0.88, -11.05, 0, z, 14);
    box(X.zinc, 0.03, 1.2, 1.8, -10.66, 0, 1.6, 0, 0.1);   /* its top rests on the drums */
    table(-11.05, 2.5, 1.9);
    spots.wallB = [[-9.7, 3.4], [-9.7, 2.2]];
  }
  let car = null, van = null;
  if (inc) { car = sedan(0x4c6a5c); car.position.set(2, 0, 1.9); car.rotation.y = 0.04; g.add(car); spots.car = [[4.7, 2.9], [5.9, 1.7], [4.6, 0.5]];
    van = minibus(0xb9d0de, 0xb9d0de); van.position.set(-17, 0, -2.6); van.rotation.y = 0.1; g.add(van); spots.van = [[-14.3, -2.6], [-14.4, -3.8]]; }
  const parked = sedan(0xb1b6ba); parked.position.set(-6, 0, 5.2); parked.rotation.y = Math.PI; g.add(parked);                       /* parked at the south kerb */
  const parked2 = minibus(0xe2cf7a, 0xe2cf7a); parked2.position.set(17.6, 0, -5.4); parked2.rotation.y = Math.PI; g.add(parked2);         /* a second minibus at the north kerb */
  const parked3 = sedan(0x8a2d2a); parked3.position.set(-34, 0, 5.4); parked3.rotation.y = Math.PI + 0.05; g.add(parked3);
  SO('shelter', -26, -22, 2.3, 4.2, 0, 2.7, 'busstop');
  box(X.zinc, 3.6, 0.1, 1.6, -24, 2.4, 3.2); for (const dx of [-1.7, 1.7]) box(X.pole, 0.1, 2.4, 0.1, -24 + dx, 0, 3.2); box(X.pole, 0.08, 2.7, 0.08, -24 + 2.2, 0, 3.2); box(X.frame, 0.06, 0.6, 0.5, -24 + 2.2, 2.1, 3.2);   /* bus shelter and a bus stop sign on its post */

  if (inc) {
  /* ---- the barricade at x = -27: an overturned minibus and a car pushed across the road, tyres, pallets, planks and rubble ---- */
  const bx = -27, ov = overturned(minibus(0xe4e8e4, 0xe4e8e4), 1, 1.7); ov.position.set(bx, 0, -1.4); ov.rotation.y = 1.32; g.add(ov);
  const pushed = sedan(0x707880); pushed.position.set(bx + 0.3, 0.1, 3.5); pushed.rotation.set(0.05, 1.45, 0.06); g.add(pushed);
  /* the junk piled in front (east) of the two vehicles, kept clear of them (x from -24.9): two straight stacks of tyres, two stacks of pallets, leaning planks and rubble */
  for (let i = 0; i < 5; i++) cyl(X.tyre, 0.42, 0.24, bx + 3.0, i * 0.24, 3.9, 14); for (let i = 0; i < 4; i++) cyl(X.tyre, 0.42, 0.24, bx + 3.0, i * 0.24, -3.9, 14);
  for (const [pz, n] of [[1.5, 4], [-1.7, 3]]) for (let i = 0; i < n; i++) { const y = i * 0.17; box(X.wood, 1.2, 0.14, 1, bx + 2.9, y, pz); for (let k = 0; k < 3; k++) box(X.plank, 1.2, 0.03, 0.08, bx + 2.9, y + 0.14, pz - 0.3 + k * 0.3); }
  for (let i = 0; i < 6; i++) box(X.plank, 0.12, 2.6, 0.2, bx + 3.9, 0, -4 + i * 1.6, 0.3, 0.5);
  for (let i = 0; i < 30; i++) box(i % 3 ? X.rust : X.junk, 0.25 + (i % 5) * 0.12, 0.2 + (i % 3) * 0.16, 0.3 + (i % 4) * 0.08, bx + 2.5 + ((i * 37) % 13) / 10, 0, -3.2 + ((i * 53) % 64) / 10, i);
  spots.barricade = [[bx - 2.2, -3], [bx - 2.4, -1.2], [bx - 2.2, 0.8], [bx - 2.5, 2.4], [bx - 2.3, 3.8]];
  }

  /* ---- poles, wires, street lamps, trees, hills ---- */
  const poles = [30, 14, -2, -18, -34, -50].map((x) => [x, -5.5]);
  for (const [x, z] of poles) { SO('pole', x - 0.15, x + 0.15, z - 0.15, z + 0.15, 0, 8.4, 'pole@' + x); SO('pole', x - 1.1, x + 1.1, z - 0.1, z + 1.7, 6.2, 7.7, 'crossarm@' + x); box(X.pole, 0.24, 8.4, 0.24, x, 0, z); box(X.pole, 2.2, 0.14, 0.14, x, 7.4, z); for (const o of [-0.9, 0, 0.9]) cyl(X.insul, 0.06, 0.22, x + o, 7.5, z, 6); box(X.frame, 0.3, 0.5, 0.06, x, 3.2, z + 0.15); }
  const wireMat = new THREE.LineBasicMaterial({ color: 0x1a1a1c });
  for (let i = 0; i < poles.length - 1; i++) for (const o of [-0.9, 0, 0.9]) { const a = poles[i], b = poles[i + 1], pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * u + o, 7.7 - Math.sin(u * Math.PI) * 0.7, a[1])); } lines.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat)); }
  for (const [x, z] of poles) { box(X.pole, 0.08, 0.08, 1.6, x, 6.4, z + 0.8); box(X.lamp, 0.28, 0.14, 0.5, x, 6.26, z + 1.5); }   /* street lamps on arms from the utility poles */
  function mango(x, z, s = 1) { SO('tree', x - 3.3 * s, x + 3.3 * s, z - 2.6 * s, z + 2.6 * s, 1.9 * s, 7.2 * s, 'mango@' + x + ',' + z); SO('tree', x - 0.4, x + 0.4, z - 0.4, z + 0.4, 0, 3 * s, 'trunk@' + x); cyl(X.trunk, 0.28 * s, 3 * s, x, 0, z, 8); [[0, 4.4, 0, 2.6, X.leaf1], [1.6, 4.0, 0.6, 1.9, X.leaf2], [-1.5, 3.9, -0.5, 2.0, X.leaf3], [0.2, 5.4, -0.3, 1.8, X.leaf2]].forEach(([dx, dy, dz, r, mm]) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mm); l.position.set(x + dx * s, dy * s, z + dz * s); g.add(l); }); }
  function palm(x, z, s = 1, lean = 0.08) {   /* a coconut palm: a tapering, slightly leaning trunk and nine drooping fronds round the crown */
    const hgt = 7 * s; SO('tree', x - 3.2 * s, x + 3.2 * s, z - 3.2 * s, z + 3.2 * s, 0, hgt + 0.2, 'palm@' + x + ',' + z); cyl(X.trunk, 0.2 * s, hgt, x, 0, z, 8, 0, lean, 0.14 * s); const cx = x - Math.sin(lean) * hgt * 0.5;
    for (let i = 0; i < 9; i++) { const a = i * 0.698, f = box(X.frond, 0.8 * s, 0.04, 3.0 * s, cx + Math.cos(a) * 1.3 * s, hgt - 0.1, z + Math.sin(a) * 1.3 * s); f.rotation.order = 'YXZ'; f.rotation.set(0.7, Math.PI / 2 - a, 0); }
  }
  /* trees stand only in the gaps between buildings (the overlap check in ?test=audit keeps them out of walls): south gaps x -24.8 to -18.7, -39.8 to -35.2 and past 29; the vacant lot x -0.8 to 14.8; north gaps x -16.8 to -10.2, -35.8 to -31.2 and 6.2 to 12.8 */
  mango(-21.75, 9.6, 0.8); mango(-13.5, -10, 0.8); mango(-33.5, -10.4, 0.65); mango(40, 8.5, 1.3); palm(32.5, 9.5, 1, 0.1); palm(-37.5, 9.6, 0.7, 0.09); palm(3, 13.6, 0.8, 0.05); palm(11, 13.8, 0.9, -0.06); palm(9.5, -10, 0.9, -0.06);
  for (const [x, z, r, hh, c] of [[-170, -20, 70, 40, 0], [-150, 70, 60, 34, 0], [-120, -90, 80, 50, 0], [-40, -150, 90, 46, 0], [60, -160, 100, 52, 0], [150, -60, 80, 40, 0], [-200, 30, 90, 56, 0]]) { const h = new THREE.Mesh(new THREE.ConeGeometry(r, hh, 9), X.hill); h.position.set(x, hh / 2 - 2, z); g.add(h); }   /* the hills round Kingston, hazy in the distance */

  /* dust spots: the walls and ground where the fighting kicks up dust, away from where anyone stands (x, y, z) */
  spots.dust = [[-2.2, 0.8, -1.6], [-2.2, 1.0, -3.9], [-9.5, 1.1, 1.0], [-11.3, 0.9, 3.8], [1.6, 0.3, 3.4], [-15.2, 0.9, -1.2], [-6, 0.1, 0.5], [2, 0.1, -0.5], [-13, 0.1, 1.4], [-20, 0.1, 0.5]];
  spots.dustFar = [[-25.5, 1.4, -2.2], [-25.8, 0.8, 2.6], [-24.9, 1.9, 0.4], [-25.2, 2.2, -3.0], [-26.2, 0.4, 3.9]];

  /* ---- merge everything static: one mesh per material, textures mapped by world position (bake.js) ---- */
  const out = bake(g, [X.asphalt, X.grass]);
  for (const l of lines) out.add(l);

  const sun = addSky(out, rnd, { shadows: opts.shadows });
  /* vehicles: boxes from their real bounds, found after they are placed */
  for (const [nm, v] of [['car', car], ['van', van], ['parked', parked], ['parked2', parked2], ['parked3', parked3]].filter(([, v]) => v)) { v.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(v); solids.push({ kind: 'vehicle', name: nm, x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z, y0: b.min.y, y1: b.max.y }); }
  return { group: out, spots, sun, raw: g, solids };   /* raw: the unmerged parts, for the place audit (?test=audit) */
}

/* Chapter 4 walks this same street on Sunday 23 May 2010, the day before the operation: no soldiers yet, three neighbours, and ordinary traffic on a clear road.
   The barricades that day were at the entrances to Tivoli (content.js); this street's barricade is built for the operation scene only (owner, 22 November 2026).
   The walls are made from the solid boxes (buildings, fences, vehicles, cover, posts, tree trunks), so the overlap check and the walking agree. */
export function streetPlace(opts = {}) {
  const st = buildStreet({ ...opts, incursion: false }), walls = [];
  for (const s of st.solids) {
    if (s.y0 > 1) continue;                                            /* canopies, balconies, crossarms, walkway roofs: overhead, not in the way */
    if (s.kind === 'tree') { if (/^palm/.test(s.name)) { const cx = (s.x0 + s.x1) / 2, cz = (s.z0 + s.z1) / 2; walls.push([cx - 0.35, cz - 0.35, cx + 0.35, cz + 0.35]); } else if (/^trunk/.test(s.name)) walls.push([s.x0, s.z0, s.x1, s.z1]); continue; }
    walls.push([s.x0 - 0.2, s.z0 - 0.2, s.x1 + 0.2, s.z1 + 0.2]);
  }
  const npcs = [
    { id: 'gran', name: 'Gran Ivy', look: 'ivyGran', x: 18.4, z: 7.2, ry: -Math.PI / 2, anim: 'Idle' },
    { id: 'dawn', name: 'Miss Dawn', look: 'dawn', x: -12.4, z: 5.4, ry: 0.2, anim: 'Idle' },
    { id: 'brown', name: 'Mr Brown', look: 'brown', x: -20.2, z: 6.0, ry: -Math.PI / 2, anim: 'Idle' },
  ];
  for (const n of npcs) st.solids.push({ kind: 'person', name: n.id, x0: n.x - 0.3, x1: n.x + 0.3, z0: n.z - 0.3, z1: n.z + 0.3, y0: 0, y1: 1.7 });
  const start = { x: 8, z: 6.4, yaw: Math.atan2(-(18.4 - 8), -(7.2 - 6.4)) };   /* facing Gran Ivy */
  st.solids.push({ kind: 'person', name: 'start', x0: start.x - 0.3, x1: start.x + 0.3, z0: start.z - 0.3, z1: start.z + 0.3, y0: 0, y1: 1.7 });
  const groundAt = (x, z) => (Math.abs(z) > 4.64 && Math.abs(z) <= 8.1 ? 0.16 : Math.abs(z) >= 4.36 && Math.abs(z) <= 4.64 ? 0.2 : 0);   /* pavements 16 cm, kerbs 20 cm, road and grass 0 */
  const traffic = addTraffic(st.group);
  return { ...st, groundAt, walls, npcs, start, traffic, endSpot: { x: 19.8, z: 7.9, r: 0.9 }, bounds: { x0: -44, x1: 40, z0: -8.2, z1: 8.3 } };
}

/* Traffic for chapter 4 (owner, 22 November 2026: "the cars driving (without obstructing persons etc)"). A few saloons and route-taxi minibuses drive both ways,
   on the left as in Jamaica (eastbound, +x, in the lane at z -2.2; westbound at z +2.2), at a slow street speed. They turn round far out in the fog, beyond
   x +-170. Each one brakes and waits for anyone in its lane ahead (you, the story people, the neighbours) and keeps its distance from the car in front, so
   nobody is driven through. tick(dt, people) takes a list of { x, z }. */
export function addTraffic(group) {
  const LANE = 2.2, END = 170, V = 7, cars = [];
  const kinds = [[sedan, 0x2f4f7a], [minibus, 0xe8e2d0, 0x2c5aa0], [sedan, 0xb4b8bc], [sedan, 0x6a2a2a], [minibus, 0xd9d3a4, 0xa02c2c], [sedan, 0x2e3a30]];
  kinds.forEach(([make, c1, c2], i) => {
    const m = make === minibus ? minibus(c1, c2) : sedan(c1), dir = i % 2 ? -1 : 1, z = dir > 0 ? -LANE : LANE;
    m.rotation.y = dir > 0 ? 0 : Math.PI; m.position.set([-38, 30, 6, -14, 70, -75][i], 0, z);   /* spread along the street, two in view at the start */ m.userData.noBatch = true; group.add(m);
    cars.push({ m, dir, z, v: V * 0.7, len: make === minibus ? 4.86 : 4.5 });
  });
  const solids = () => cars.map((c) => { const p = c.m.position; return { kind: 'vehicle', name: 'traffic', x0: p.x - c.len / 2, x1: p.x + c.len / 2, z0: p.z - 1, z1: p.z + 1, y0: 0, y1: 2 }; });
  function tick(dt, people = []) {
    if (!(dt > 0)) return; dt = Math.min(dt, 0.1);
    for (const c of cars) {
      const p = c.m.position; let room = 1e9;
      for (const q of people) { if (Math.abs(q.z - c.z) > 1.9) continue; const ahead = (q.x - p.x) * c.dir - c.len / 2; if (ahead > -(c.len + 0.6) && ahead < room) room = Math.max(0, ahead); }   /* a person in the lane ahead, or alongside: wait */
      for (const o of cars) { if (o === c || o.dir !== c.dir) continue; const ahead = (o.m.position.x - p.x) * c.dir - (c.len + o.len) / 2; if (ahead > 0 && ahead < room) room = ahead; }
      const want = room < 2.5 ? 0 : room < 9 ? V * (room - 2.5) / 6.5 : V;   /* stop 2.5 m short, slow over the 6.5 m before that */
      c.v += Math.max(-9 * dt, Math.min(2.2 * dt, want - c.v)); if (c.v < 0) c.v = 0;
      p.x += c.v * c.dir * dt;
      if (p.x * c.dir > END) { p.x = -END * c.dir; }   /* round again, out in the fog */
    }
  }
  return { cars, tick, solids };
}
