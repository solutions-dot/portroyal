/* games/_tivoli/src/backowall.js: the place for chapter 1, Ivy's memory of Back-o-Wall. IMPORTANT: this place is IMAGINED. We have no photographs or oral histories of Back-o-Wall yet
   (docs/games/tivoli.md "Back-o-Wall and the clearance": daily life there is "Not found"), so it shows only general things: houses of board and zinc built close together
   (the journal says families built their own homes of zinc and board), a lane, a yard, laundry, buckets, a mango tree. No claim is made about particular objects or customs,
   and the journal page says the scenes are our own imagining. Metres. The lane runs along x (west is -x, where the lane ends); the yard is on the south side (+z).
   Everything static is merged by material (bake.js) and textured by world position, like the street. */
import * as THREE from 'three';
import * as TX from './textures.js';
import { bake } from './bake.js';
import { addSky } from './sky.js';

const rngOf = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const M = (c, r = 0.9, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const W = (map, tile, r = 0.95, bright = 1.15) => { const m = new THREE.MeshStandardMaterial({ map, roughness: r }); m.color.setScalar(bright); m.userData.tile = tile; return m; };

export function buildBackOWall(opts = {}) {
  const rnd = rngOf(19630101), g = new THREE.Group(), walls = [];
  const X = {
    dirt: W(TX.dirt(), TX.TILE.dirt), grass: W(TX.grass(), TX.TILE.grass), zinc: W(TX.zinc(), TX.TILE.zinc, 0.6, 1.2), zinc2: W(TX.zinc(31), TX.TILE.zinc, 0.6, 0.9),
    boards: [0x7a9ab0, 0x8aa88a, 0xc8a85a, 0xc88a7a, 0x9a8a6a, 0xd8d0b8, 0x6a8a98].map((c, i) => W(TX.boards(c, 40 + i), TX.TILE.boards)),
    door: M(0x4a3a2c), dark: M(0x211c18, 0.7), trunk: M(0x5d4a35), leaf1: M(0x4d7a39), leaf2: M(0x628a45), leaf3: M(0x3f6a35), post: M(0x7a6244), rope: M(0x2a2a2a),
    bucket: M(0x9a9ea2, 0.5, 0.5), basin: M(0xb8b8b0, 0.5, 0.4), drum: M(0x2f5f8f, 0.6, 0.4), stone: M(0x8a8680), pot: M(0x1d1d1f, 0.5, 0.3), crate: M(0xa88a5c), cloth: [M(0xd04a3a), M(0x3a6ac0), M(0xf0ece0), M(0xe0c030), M(0x4a9a5a), M(0xe08ab0)],
    hill: M(0x5d7a5a, 1), wheel: M(0x1b1b1d),
  };
  const box = (mat, w, h, d, x, y, z, ry = 0, rz = 0, rx = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.rotation.set(rx, ry, rz); g.add(m); return m; };
  const cyl = (mat, r, h, x, y, z, seg = 12, r2 = r) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, seg), mat); m.position.set(x, y + h / 2, z); g.add(m); return m; };
  const wall = (x0, z0, x1, z1) => walls.push([x0, z0, x1, z1]);

  /* ground: packed earth everywhere, dry grass beyond the houses */
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(400, 260), X.grass); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.05; g.add(grass);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(52, 34), X.dirt); ground.rotation.x = -Math.PI / 2; ground.position.set(-2, 0, 2); g.add(ground);

  /* a house of boards with a patched zinc roof. facing +1: the door is on the +z side (towards a lane to the south); -1: on the -z side */
  function house(x, z, w, d, h, facing, ci) {
    const mat = X.boards[ci % X.boards.length];
    box(mat, w, h, d, x, 0, z); const rf = box(rnd() < 0.5 ? X.zinc : X.zinc2, w + 0.9, 0.09, d + 0.9, x, h + 0.05, z, 0, 0, 0); rf.rotation.x = facing * 0.13;   /* the roof, tilted, with an overhang */
    for (let k = 0; k < 2; k++) box(rnd() < 0.5 ? X.zinc : X.zinc2, 0.7 + rnd() * 0.5, 0.06, 0.9 + rnd() * 0.5, x + (rnd() - 0.5) * w, h + 0.11, z + (rnd() - 0.5) * d, 0, 0, facing * 0.13);   /* patches on the roof */
    const fz = z + facing * (d / 2 + 0.03); box(X.door, 0.9, 1.9, 0.08, x + (rnd() - 0.5) * (w - 1.4), 0, fz); box(X.dark, 0.6, 0.55, 0.08, x + w * 0.28, 1.3, fz);   /* a door and a shuttered window */
    for (let k = 0; k < 4; k++) box(X.zinc2, 0.7 + rnd() * 0.6, 0.8 + rnd() * 0.8, 0.04, x - w / 2 + rnd() * w, 0.3 + rnd() * 1, fz + facing * 0.02);   /* zinc patches on the wall */
    for (const sx of [-1, 1]) box(X.post, 0.12, h + 0.3, 0.12, x + sx * w / 2, 0, z - facing * d / 2);                                              /* corner posts */
    wall(x - w / 2 - 0.35, z - d / 2 - 0.35, x + w / 2 + 0.35, z + d / 2 + 0.35);
  }
  /* north row (doors face the lane, south): close together, with gaps closed by zinc fences */
  [[-17, 3.6], [-12.5, 3.8], [-8, 4.4], [-3.2, 3.4], [1.4, 4.0], [6.4, 3.8], [11.4, 4.2]].forEach(([x, w], i) => { house(x, -4.3 - (i % 2) * 0.3, w, 3.4, 2.5 + rnd() * 0.6, 1, i + 1); });
  for (const x of [-14.6, -10.2, -5.2, -0.9, 3.9, 9]) { box(X.zinc, 0.9, 1.9, 0.06, x, 0, -3.6, rnd() * 0.3); }
  /* second row behind, with a lane between */
  [[-18, 4.4], [-12.6, 3.8], [-6.4, 4.8], [-0.2, 3.6], [5.6, 4.4], [11.8, 4]].forEach(([x, w], i) => { house(x, -10.4, w, 3.6, 2.7 + rnd() * 0.5, 1, i + 3); });
  /* south side: three houses west of the yard, the open yard, and the yard's own houses (Ivy's is at x 6.5) */
  [[-17, 3.6], [-12.5, 4.0], [-8, 3.8]].forEach(([x, w], i) => { house(x, 5.0 + (i % 2) * 0.3, w, 3.6, 2.5 + rnd() * 0.5, -1, i + 2); });
  house(-2.4, 8.5, 3.4, 3.4, 2.6, -1, 5);      /* west of the yard */
  house(6.5, 11.2, 4.6, 3.6, 2.8, -1, 0);      /* Ivy's house, door facing the yard */
  house(12.6, 7.0, 3.6, 3.4, 2.5, -1, 4);      /* east of the yard */
  /* fences round the whole place (they are also the walls you cannot pass) */
  const fence = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(len / 1.2), ry = Math.abs(x1 - x0) >= Math.abs(z1 - z0) ? 0 : Math.PI / 2; for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; box(rnd() < 0.5 ? X.zinc : X.zinc2, 1.25, 1.8 + rnd() * 0.3, 0.05, x0 + (x1 - x0) * t, 0, z0 + (z1 - z0) * t, ry); } wall(Math.min(x0, x1) - 0.3, Math.min(z0, z1) - 0.3, Math.max(x0, x1) + 0.3, Math.max(z0, z1) + 0.3); };
  fence(-22.5, -13.6, 17, -13.6); fence(-22.5, 14.2, 17, 14.2); fence(17.4, -13.6, 17.4, 14.2); fence(-22.9, -13.6, -22.9, -2); fence(-22.9, 2, -22.9, 14.2);
  /* the lane's western end is open (the end of the lane, where the chapter finishes) */

  /* yard and lane details: laundry lines, buckets, basins, a drum, a pot on three stones, crates, a handcart, a mango tree */
  const post = (x, z) => box(X.post, 0.1, 2.3, 0.1, x, 0, z);
  post(0, 3.2); post(5, 3.2); box(X.rope, 5, 0.02, 0.02, 2.5, 2.1, 3.2); for (let k = 0; k < 6; k++) box(X.cloth[k % 6], 0.45, 0.7, 0.02, 0.5 + k * 0.8, 1.4, 3.2);
  post(-14, 1.9); post(-6, 1.9); box(X.rope, 8, 0.02, 0.02, -10, 2.2, 1.9); for (let k = 0; k < 7; k++) box(X.cloth[(k + 2) % 6], 0.4, 0.75, 0.02, -13.4 + k * 1.1, 1.45, 1.9);
  for (const [x, z] of [[8.6, 8.6], [4.2, 8.9], [-1.4, -2.4], [-15.6, 2.8], [10.4, 4.6]]) { cyl(X.bucket, 0.17, 0.3, x, 0, z, 10, 0.22); }
  for (const [x, z] of [[2.1, 9.4], [-9.6, 3.0]]) cyl(X.basin, 0.4, 0.14, x, 0, z, 14, 0.46);
  cyl(X.drum, 0.3, 0.9, 9.4, 0, 9.3, 14); cyl(X.drum, 0.3, 0.9, -4.8, 0, -2.4, 14);
  for (let k = 0; k < 3; k++) cyl(X.stone, 0.13, 0.2, 3.2 + Math.cos(k * 2.1) * 0.25, 0, 10.2 + Math.sin(k * 2.1) * 0.25, 7); cyl(X.pot, 0.22, 0.28, 3.2, 0.2, 10.2, 12);
  for (const [x, z, r] of [[8.9, 3.2, 0.2], [-5.4, 3.4, 0.5], [13.6, 2.6, 1]]) { box(X.crate, 0.6, 0.5, 0.5, x, 0, z, r); box(X.crate, 0.5, 0.4, 0.45, x + 0.1, 0.5, z, r + 0.4); }
  box(X.crate, 1.0, 0.12, 0.6, 10.5, 0.45, 1.6, 0.3); for (const dz of [-0.35, 0.35]) cyl(X.wheel, 0.28, 0.08, 10.5, 0.0, 1.6 + dz, 14).rotation.x = Math.PI / 2; box(X.post, 0.9, 0.05, 0.05, 11.1, 0.7, 1.6, 0.3);   /* a handcart */
  const tree = (x, z, s = 1) => { cyl(X.trunk, 0.26 * s, 3 * s, x, 0, z, 8, 0.32 * s); [[0, 4.4, 0, 2.6, X.leaf1], [1.6, 4.0, 0.6, 1.9, X.leaf2], [-1.5, 3.9, -0.5, 2.0, X.leaf3], [0.2, 5.4, -0.3, 1.8, X.leaf2]].forEach(([dx, dy, dz, r, mm]) => { const l = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mm); l.position.set(x + dx * s, dy * s, z + dz * s); g.add(l); }); wall(x - 0.5, z - 0.5, x + 0.5, z + 0.5); };
  tree(-0.2, 7.2, 1.0); tree(14.2, -8.2, 0.9);
  for (const [x, z, s, lean] of [[-26, 6, 1, 0.1], [20, 10, 1.1, -0.07]]) { const hgt = 7 * s; cyl(X.trunk, 0.14 * s, hgt, x, 0, z, 8, 0.2 * s); for (let i = 0; i < 9; i++) { const a = i * 0.698, f = box(M(0x5a8a3a), 0.8 * s, 0.04, 3.0 * s, x + Math.cos(a) * 1.3 * s, hgt - 0.1, z + Math.sin(a) * 1.3 * s); f.rotation.order = 'YXZ'; f.rotation.set(0.7, Math.PI / 2 - a, 0); } }
  for (const [x, z, r, hh] of [[-170, -20, 70, 40], [-120, -90, 80, 50], [150, -60, 80, 40], [60, -160, 100, 52], [-150, 70, 60, 34]]) { const h = new THREE.Mesh(new THREE.ConeGeometry(r, hh, 9), X.hill); h.position.set(x, hh / 2 - 2, z); g.add(h); }

  const out = bake(g, [X.dirt, X.grass]);
  const sun = addSky(out, rnd, { shadows: opts.shadows, target: [-2, 0, 2], extent: [34, 26] });
  return { group: out, walls, sun, raw: g,
    start: { x: 2.2, z: 1.0, yaw: Math.atan2(-(3.4 - 2.2), -(5.6 - 1.0)) },   /* facing Ivy in her yard */
    npcs: [
      { id: 'ivy', name: 'Ivy', look: 'ivyGirl', x: 3.4, z: 5.6, ry: Math.PI, anim: 'Idle' },
      { id: 'pearl', name: 'Miss Pearl', look: 'pearl', x: 6.5, z: 8.7, ry: Math.PI, anim: 'Idle' },
      { id: 'roy', name: 'Mass Roy', look: 'roy', x: -8.6, z: 0.9, ry: Math.PI / 2, anim: 'Idle' },
    ],
    endSpot: { x: -20.6, z: 0, r: 1.8 },
  };
}
