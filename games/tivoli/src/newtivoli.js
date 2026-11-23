/* games/tivoli/src/newtivoli.js: the place for chapter 2, the new Tivoli Gardens in the 1960s, through Ivy's memory.
   What is sourced (docs/games/tivoli.md, Research, "Tivoli Gardens was built in the 1960s"): new homes were built where Back-o-Wall had stood, by the Ministry of Housing,
   and the West Kingston Trust paid for a clinic, a creche, schools and a community centre (with drama, singing and a steel band).
   What is NOT sourced: how the 1960s estate looked. This is a GENERAL PICTURE (new blocks of flats round open courts, paths, young trees, a community centre and a clinic),
   not a copy of the real streets, and the journal says so. Metres. The courtyard runs along x; the community centre is at the east end (+x), the clinic at the west end. */
import * as THREE from 'three';
import * as TX from './textures.js';
import { bake } from './bake.js';
import { addSky } from './sky.js';
import { makeDoor } from '../../../engine/door.js';

const rngOf = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const M = (c, r = 0.9, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const W = (map, tile, r = 0.95, bright = 1.15) => { const m = new THREE.MeshStandardMaterial({ map, roughness: r }); m.color.setScalar(bright); m.userData.tile = tile; return m; };

export function buildNewTivoli(opts = {}) {
  const year = opts.year || 1965, old = year >= 1980 && year < 2016;   /* the same courtyard in later chapters: about 1980 (chapter 3) and 2010 (6) with older paint; 2016 (7) and today (8) are cared-for paint, grown trees and murals today.
     The walls of 2016 and today are never shown stained or cracked (owner, 22 November 2026: "in modern tivoli today, dont make the buildings look so weathered, the residents may find that offensive"; "fix 2016 as well") */
  const rnd = rngOf(19650101), g = new THREE.Group(), walls = [];
  const solids = [], SO = (kind, name, x0, x1, z0, z1, y0, y1) => solids.push({ kind, name, x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), y0, y1 });
  const X = {
    grass: W(TX.grass(), TX.TILE.grass), paving: W(TX.paving(), TX.TILE.paving, 0.95, 1.2),
    cream: old ? W(TX.stucco(0xe2d4b0, 61), TX.TILE.stucco, 0.95, 1.15) : W(TX.fresh(0xeee0bc, 61), TX.TILE.stucco, 0.9, 1.05), green: old ? W(TX.stucco(0xbccca8, 62), TX.TILE.stucco, 0.95, 1.15) : W(TX.fresh(0xc8dcb6, 62), TX.TILE.stucco, 0.9, 1.05), blue: old ? W(TX.stucco(0xb4c6d0, 63), TX.TILE.stucco, 0.95, 1.15) : W(TX.fresh(0xc0d6e2, 63), TX.TILE.stucco, 0.9, 1.05),
    white: old ? W(TX.stucco(0xe8e4d8, 64), TX.TILE.stucco, 0.95, 1.15) : W(TX.fresh(0xf4f0e6, 64), TX.TILE.stucco, 0.9, 1.05), band: M(0xfaf8f0, 0.8), pipe: M(0x8a8a84, 0.5, 0.3), bed: M(0x6a5038, 1), croton: [M(0xc8502a), M(0xd8b030), M(0x3e7e3a)], lamp: new THREE.MeshStandardMaterial({ color: 0xf4f0dc, emissive: 0x3a3a30 }), roofc: W(TX.stucco(0x9a9a94, 65), TX.TILE.stucco), plinth: W(TX.block(0xb4b0a4, 66), TX.TILE.block),
    frame: M(0xf0ece2), win: M(0x3a4650, 0.5), slat: M(0x9aaab4, 0.35, 0.1), rail: M(0x2e3a44, 0.6, 0.3), door: M(0x6a4a30), kerb: M(0xc0bcb0),
    trunk: M(0x5d4a35), leaf1: M(0x5a8a40), leaf2: M(0x6c9a48), leaf3: M(0x4a7a3a), hill: M(0x5d7a5a, 1), bench: M(0x7a5a3a), post: M(0x5a5a5a, 0.6, 0.4), rope: M(0x2a2a2a),
    cloth: [M(0xd04a3a), M(0x3a6ac0), M(0xf0ece0), M(0xe0c030)],
  };
  const door = (o, x, z, ry) => { const d = makeDoor(o); d.position.set(x, 0.05, z); d.rotation.y = ry; g.add(d); return d; };   /* engine/door.js: framed, panelled, with a handle */
  const box = (mat, w, h, d, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.rotation.y = ry; g.add(m); return m; };
  const cyl = (mat, r, h, x, y, z, seg = 10, r2 = r) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, seg), mat); m.position.set(x, y + h / 2, z); g.add(m); return m; };
  const wall = (x0, z0, x1, z1) => walls.push([x0, z0, x1, z1]);
  const sign = (text, w, x, y, z, ry, bg = 0xf0ece2) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.8), new THREE.MeshStandardMaterial({ map: TX.sign(text, bg, '#1d3a5a'), roughness: 0.7 })); s.position.set(x, y, z); s.rotation.y = ry; g.add(s); };

  /* ground: grass, with paved paths along the courtyard and to each door */
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 260), X.grass); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.03; g.add(grass);
  box(X.paving, 78, 0.06, 3.2, 0, 0, 0); box(X.paving, 3.2, 0.06, 15, 0, 0, 0);                                           /* the main path, east to west, and one across */
  for (const sz of [-1, 1]) box(X.kerb, 78, 0.1, 0.14, 0, 0, sz * 1.67);

  /* blocks of flats: three storeys, open balconies with rails, louvred windows, a door at the foot of the stair. facing +1: the front is on +z. */
  function block(x, z, w, d, mat, facing) {
    const floors = 3, h = floors * 3, fz = z + facing * (d / 2 + 0.02), cols = Math.floor(w / 3);
    box(mat, w, h, d, x, 0, z); box(X.plinth, w + 0.05, 0.6, d + 0.05, x, 0, z); box(X.roofc, w + 0.3, 0.25, d + 0.3, x, h, z);
    for (let f = 1; f < floors; f++) box(X.band, w + 0.06, 0.18, d + 0.06, x, f * 3 - 0.2, z);   /* a white band at each floor */
    for (const sx of [-1, 1]) box(X.pipe, 0.1, h, 0.1, x + sx * (w / 2 - 0.25), 0, fz + facing * 0.06);   /* downpipes at the corners */
    for (let k = 0; k < Math.floor(w / 2.2); k++) { const bx = x - w / 2 + 1.1 + k * 2.2; if (Math.abs(bx - x) < 1.3) continue; box(X.bed, 1.8, 0.25, 0.7, bx, 0, fz + facing * 0.37); for (let p = 0; p < 6; p++) { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17 + rnd() * 0.06, 1), p % 3 === 2 ? X.croton[(k + p) % 2] : X.croton[2]); l.position.set(bx - 0.65 + p * 0.26, 0.36 + (p % 2) * 0.1, fz + facing * (0.25 + (p % 2) * 0.2)); l.scale.y = 1.3; g.add(l); } }   /* flower beds with crotons along the front */
    for (let f = 0; f < floors; f++) {
      const y0 = f * 3;
      if (f) { box(X.frame, w, 0.16, 1.3, x, y0 - 0.08, fz + facing * 0.65); box(X.rail, w, 0.05, 0.05, x, y0 + 0.9, fz + facing * 1.26); for (let b = 0; b <= w / 1.5; b++) box(X.rail, 0.04, 0.9, 0.04, x - w / 2 + 0.05 + b * 1.5, y0, fz + facing * 1.26); }
      for (let c = 0; c < cols; c++) {
        const wx = x - w / 2 + (c + 0.5) * (w / cols), wy = y0 + 1.0;
        box(X.frame, 1.4, 1.5, 0.08, wx, wy - 0.1, fz); box(X.win, 1.2, 1.3, 0.1, wx, wy, fz + facing * 0.01);
        for (let s = 0; s < 4; s++) box(X.slat, 1.15, 0.05, 0.05, wx, wy + 0.15 + s * 0.28, fz + facing * 0.07);
        if (f && rnd() < 0.25) for (let k = 0; k < 3; k++) box(X.cloth[(rnd() * 4) | 0], 0.4, 0.5, 0.02, wx - 0.5 + k * 0.5, y0 + 0.3, fz + facing * 1.25);   /* washing on the balcony rail */
      }
    }
    door({ w: 1.0, h: 2.15, kind: 'flush', color: 0x6a4a30, frame: 0xf0ece2, handle: 'lever' }, x, z + facing * d / 2, facing > 0 ? 0 : Math.PI);   /* the door at the foot of a block's stair: a plain flush timber door (a stand-in: docs/games/tivoli.md) */
    { const zEnd = facing > 0 ? -1.6 : 1.6, len = Math.abs(zEnd - fz); box(X.paving, 1.6, 0.05, len, x, 0, (zEnd + fz) / 2); }   /* a paved path from the door to the main path */
    SO('building', 'block@' + x + ',' + z, x - w / 2 - 0.15, x + w / 2 + 0.15, z - d / 2 - 0.15, z + d / 2 + 0.15, 0, h + 0.3); SO('building', 'balconies@' + x + ',' + z, x - w / 2, x + w / 2, facing > 0 ? z + d / 2 : z - d / 2 - 1.35, facing > 0 ? z + d / 2 + 1.35 : z - d / 2, 2.8, h);
    wall(x - w / 2 - 0.3, z - d / 2 - 0.3, x + w / 2 + 0.3, z + d / 2 + 0.3);
  }
  /* north row faces the courtyard (south, +z); south row faces north (-z); a gap in the middle for the cross path */
  block(-24, -13, 16, 8, X.cream, 1); block(-6, -13, 14, 8, X.green, 1); block(12, -13, 16, 8, X.blue, 1);
  block(-24, 13, 16, 8, X.green, -1); block(-6, 13, 8, 8, X.blue, -1); block(12, 13, 16, 8, X.cream, -1);

  /* the community centre at the east end: a wide hall with a flat roof, open louvres, a covered porch on posts, and a sign. The door faces west (-x). */
  const cx = 38, cw = 10, cd = 16;
  box(X.white, cw, 5.4, cd, cx, 0, 0); box(X.plinth, cw + 0.05, 0.6, cd + 0.05, cx, 0, 0); box(X.roofc, cw + 0.6, 0.3, cd + 0.6, cx, 5.4, 0); box(X.band, cw + 0.06, 0.2, cd + 0.06, cx, 3.6, 0);
  const fx = cx - cw / 2 - 0.02; door({ w: 2.0, h: 2.4, kind: 'louvre', leaves: 2, color: 0x6a5038, frame: 0xf0ece2, handle: 'pull' }, cx - cw / 2, 0, -Math.PI / 2);   /* a public hall: a wide pair of louvred timber doors that let the air through, matching its open louvres (a stand-in: docs/games/tivoli.md) */
  for (const zz of [-5.5, -3, 3, 5.5]) { box(X.frame, 0.08, 1.6, 1.8, fx, 1.2, zz); for (let s = 0; s < 5; s++) box(X.slat, 0.06, 0.05, 1.7, fx - 0.04, 1.35 + s * 0.28, zz); }
  box(X.roofc, 2.4, 0.2, 6, fx - 1.2, 3.2, 0); for (const zz of [-2.85, 2.85]) box(X.frame, 0.22, 3.2, 0.22, fx - 2.25, 0, zz);   /* the porch roof on two posts */
  sign('COMMUNITY CENTRE', 6.4, fx - 0.01, 4.55, 0, -Math.PI / 2);
  SO('building', 'centre', cx - cw / 2 - 0.3, cx + cw / 2 + 0.3, -cd / 2 - 0.3, cd / 2 + 0.3, 0, 5.7); SO('building', 'porch', fx - 2.45, fx, -3, 3, 3.2, 3.45);
  for (const zz of [-2.85, 2.85]) SO('post', 'porchpost', fx - 2.36, fx - 2.14, zz - 0.11, zz + 0.11, 0, 3.2);
  wall(cx - cw / 2 - 0.3, -cd / 2 - 0.3, cx + cw / 2 + 0.3, cd / 2 + 0.3); for (const zz of [-2.85, 2.85]) wall(fx - 2.5, zz - 0.25, fx - 2.0, zz + 0.25);

  /* the clinic at the west end: a smaller building with a sign. The door faces east (+x). */
  const kx = -40, kw = 7, kd = 10;
  box(X.white, kw, 3.6, kd, kx, 0, 0); box(X.plinth, kw + 0.05, 0.6, kd + 0.05, kx, 0, 0); box(X.roofc, kw + 0.5, 0.25, kd + 0.5, kx, 3.6, 0);
  const kf = kx + kw / 2 + 0.02; door({ w: 0.95, h: 2.1, kind: 'glazed', leaves: 1, color: 0xe8e4da, frame: 0xd8d4ca, glass: 0x34424c, metal: 0x9a9a96, handle: 'lever', step: 0.12 }, kx + kw / 2, 0, Math.PI / 2);   /* a clinic: one white half-glazed door, so staff can see who is waiting, up one step (a stand-in: docs/games/tivoli.md) */ for (const zz of [-3, 3]) { box(X.frame, 0.08, 1.4, 1.6, kf, 1.1, zz); box(X.win, 0.1, 1.2, 1.4, kf + 0.01, 1.2, zz); }
  sign('CLINIC', 3, kf + 0.01, 2.9, 0, Math.PI / 2);
  SO('building', 'clinic', kx - kw / 2 - 0.25, kx + kw / 2 + 0.25, -kd / 2 - 0.25, kd / 2 + 0.25, 0, 3.9); wall(kx - kw / 2 - 0.3, -kd / 2 - 0.3, kx + kw / 2 + 0.3, kd / 2 + 0.3);

  /* young trees in the courtyard (the estate is new) and benches, with a washing line between two posts by the south row */
  const tree = (x, z, s) => { cyl(X.trunk, 0.12 * s, 2.4 * s, x, 0, z, 8, 0.15 * s); [[0, 3.0, 0, 1.3, X.leaf1], [0.7, 2.7, 0.3, 0.9, X.leaf2], [-0.7, 2.7, -0.2, 1.0, X.leaf3]].forEach(([dx, dy, dz, r, mm]) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mm); l.position.set(x + dx * s, dy * s, z + dz * s); g.add(l); });
    wall(x - 0.3, z - 0.3, x + 0.3, z + 0.3); SO('tree', 'tree@' + x + ',' + z, x - 1.8 * s, x + 1.8 * s, z - 1.6 * s, z + 1.6 * s, 1.6 * s, 4.4 * s); SO('tree', 'trunk@' + x + ',' + z, x - 0.25, x + 0.25, z - 0.25, z + 0.25, 0, 2.4 * s); };
  for (const [x, z, s] of [[-28, -5.5, 1], [-17, 5.5, 0.9], [-12, -5.6, 1], [6, 5.6, 1.1], [18, -5.5, 0.9], [24, 5.6, 1]]) tree(x, z, year >= 2010 ? Math.min(s * 1.3, 1.25) : old ? s * 1.15 : s);   /* young trees in the 1960s, grown by 2010 */
  const bench = (x, z) => { box(X.bench, 1.8, 0.08, 0.45, x, 0.37, z); for (const dx of [-0.75, 0.75]) box(X.bench, 0.08, 0.37, 0.4, x + dx, 0, z);   /* seat 45 cm high, as a park bench is (at 50 cm older people's feet hung off the ground) */ wall(x - 1, z - 0.3, x + 1, z + 0.3); SO('prop', 'bench@' + x, x - 0.95, x + 0.95, z - 0.25, z + 0.25, 0, 0.45); };
  bench(-20, -3.4); bench(2, 3.4); bench(20, -3.4);
  for (const x of [-30, -22]) box(X.post, 0.08, 2.2, 0.08, x, 0, 6.5); box(X.rope, 8, 0.02, 0.02, -26, 2.0, 6.5); for (let k = 0; k < 6; k++) box(X.cloth[k % 4], 0.45, 0.65, 0.02, -29.2 + k * 1.2, 1.35, 6.5);
  SO('prop', 'line', -30.1, -21.9, 6.4, 6.6, 1.3, 2.2); wall(-30.2, 6.3, -29.8, 6.7); wall(-22.2, 6.3, -21.8, 6.7);

  /* lamp posts along the main path: a pole, an arm and a lamp under it */
  for (const lx of [-34, -16, 4, 22]) { cyl(X.post, 0.07, 4.2, lx, 0, -2.1, 8); box(X.post, 0.06, 0.06, 0.9, lx, 4.1, -1.7); box(X.lamp, 0.3, 0.14, 0.4, lx, 3.96, -1.35); wall(lx - 0.25, -2.35, lx + 0.25, -1.85); SO('post', 'lamp@' + lx, lx - 0.1, lx + 0.1, -2.2, -2.0, 0, 4.2); }

  /* murals, today only: on the end walls of the two north blocks that face each other across the gap, and on both long sides of the community centre (our own designs) */
  if (year >= 2022) {
    const wall2 = (kind, w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: TX.mural(kind), roughness: 0.85 })); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); };
    wall2('sunrise', 7, 7, 1 + 0.03, 4.6, -13, Math.PI / 2); wall2('bloom', 7, 7, 4 - 0.03, 4.6, -13, -Math.PI / 2);
    for (const [k, dx, sz] of [['play', -2.4, 1], ['bloom', 2.4, 1], ['sunrise', -2.4, -1], ['play', 2.4, -1]]) wall2(k, 4.4, 4.4, cx + dx, 2.8, sz * (cd / 2 + 0.07), sz > 0 ? 0 : Math.PI);   /* two square panels on each 10 m end of the hall, 7 cm off the wall (in front of the white band) */
  }

  /* a low block wall round the estate: the edge you cannot pass */
  const edge = (x0, z0, x1, z1) => { const w = Math.abs(x1 - x0) || 0.3, d = Math.abs(z1 - z0) || 0.3; box(X.plinth, w, 1.0, d, (x0 + x1) / 2, 0, (z0 + z1) / 2); wall(Math.min(x0, x1) - 0.3, Math.min(z0, z1) - 0.3, Math.max(x0, x1) + 0.3, Math.max(z0, z1) + 0.3); };
  edge(-46, -20, 46, -20); edge(-46, 20, 46, 20); edge(-46, -20, -46, 20); edge(46, -20, 46, 20);
  for (const [x, z, r, hh] of [[-170, -20, 70, 40], [-120, -90, 80, 50], [150, -60, 80, 40], [60, -160, 100, 52], [-150, 70, 60, 34]]) { const h = new THREE.Mesh(new THREE.ConeGeometry(r, hh, 9), X.hill); h.position.set(x, hh / 2 - 2, z); g.add(h); }

  const npcs = opts.cast || [
    { id: 'ivy', name: 'Ivy', look: 'ivyGirl', x: -4.5, z: -2.6, ry: 0.4, anim: 'Idle' },
    { id: 'pearl', name: 'Miss Pearl', look: 'pearl', x: 12, z: 7.6, ry: Math.PI, anim: 'Idle' },
    { id: 'clarke', name: 'Mr Clarke', look: 'clarke', x: 29.2, z: 3.8, ry: -Math.PI / 2, anim: 'Idle' },
  ];
  for (const n of npcs) SO('person', n.id, n.x - 0.3, n.x + 0.3, n.z - 0.3, n.z + 0.3, 0, 1.7);
  const f0 = npcs[0], start = { x: f0.x - 3.5, z: 1.2, yaw: Math.atan2(-3.5, -(f0.z - 1.2)) };   /* facing the first person in the cast */
  SO('person', 'start', start.x - 0.3, start.x + 0.3, start.z - 0.3, start.z + 0.3, 0, 1.7);

  const out = bake(g, [X.grass]);
  const sun = addSky(out, rnd, { shadows: opts.shadows, target: [0, 0, 0], extent: [48, 22] });
  const DOORS = [-24, -6, 12];   /* door paths run from each block door to the main path */
  const groundAt = (x, z) => ((Math.abs(z) <= 1.6 && Math.abs(x) <= 39) || (Math.abs(x) <= 1.6 && Math.abs(z) <= 7.5) || (DOORS.some((d) => Math.abs(x - d) <= 0.8) && Math.abs(z) > 1.6 && Math.abs(z) < 8.5) ? 0.06 : 0);   /* paths 6 cm, grass 0 */
  return { group: out, walls, sun, raw: g, groundAt, solids, start, npcs, endSpot: { x: fx - 1.6, z: 0, r: 1.6 }, bounds: { x0: -46, x1: 46, z0: -20, z1: 20 } };
}
