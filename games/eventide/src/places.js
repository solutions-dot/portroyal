/* games/eventide/src/places.js: the places of Eventide 1980, built in code (see docs/games/eventide.md).
   Each builder fills a group and returns what the game and the audit need: walls (boxes you cannot walk into), bounds, the start,
   groundAt(x, z) for raised floors such as the veranda, and spots (named points for people and things to do).
   What is real and what is an impression:
     - Real: Slipe Pen Road; the Home was "fenced-in" (AP, 21 May 1980) and was a three-building facility; the Myers Ward was an old
       two-storey wooden building; the men's and children's wards were partly concrete (George Pinto, Jamaica Observer, 2011).
     - From photographs the owner supplied (reference only, never textures): the entrance (a whitewashed wall, two tall pillars, an iron
       arch with the words EVENTIDE HOME and a lamp, iron gates, a long dusty avenue of tall trees); a two-storey building with a plastered
       lower storey, arches, a gabled porch and outside stairs (used here for the men's ward); a burnt one-storey building with a front
       overhang on square pillars (used for the children's ward). Which building each photo shows is our assumption.
     - Impression: the layout, sizes and colours, the Myers Ward's verandas, the street, the shops.
     - The monument follows a 2025 photograph (Jamaica Observer): a white concrete triangle on a low tiled base in a round brick circle,
       with a black triangular plaque. The plaque's small emblem is not shown because it cannot be made out. */
import * as THREE from 'three';
import { T, cv, std, solid, flat, box, cyl, plane, grp, rng, mesh } from './gfx.js';
import { palm, tree, bench, standpipe, waterTower, truck, boardHouse, hillRing } from './props.js';
import { grassField, flowerField, flameTree, mangoTree, hibiscus, croton } from './detail.js';

const DS = { side: THREE.DoubleSide };
const CREAM = [232, 222, 196], TRIM = 0x3c6a48, ZINC = [150, 152, 146], LIME = [238, 234, 222];

/* a hip roof over a W by D footprint centred on (0, 0, 0): eaves at y = 0, ridge along x at height H. Double-sided, so it also reads from under a veranda. */
function hipRoof(W, D, H, mat) {
  const hw = W / 2, hd = D / 2, r = Math.max(0, hw - hd), A = [-hw, 0, -hd], B = [hw, 0, -hd], C = [hw, 0, hd], Dd = [-hw, 0, hd], E = [-r, H, 0], F = [r, H, 0];
  const tris = [[A, B, F], [A, F, E], [C, Dd, E], [C, E, F], [Dd, A, E], [B, C, F]], pos = [], uv = [];
  tris.forEach((t, i) => t.forEach((p) => { pos.push(...p); uv.push(i < 4 ? p[0] * 0.5 : p[2] * 0.5, p[1] * 0.8 + (i < 4 ? Math.abs(p[2]) : Math.abs(p[0])) * 0.8); }));
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}
/* textures drawn once */
const louvre = () => cv(64, 96, (x, w, h) => { x.fillStyle = '#2f5a3e'; x.fillRect(0, 0, w, h); for (let y = 8; y < h - 6; y += 6) { x.fillStyle = '#4f8a62'; x.fillRect(6, y, w - 12, 3); x.fillStyle = '#1e3a28'; x.fillRect(6, y + 3, w - 12, 2); } x.strokeStyle = '#e8e0cc'; x.lineWidth = 5; x.strokeRect(2, 2, w - 4, h - 4); x.beginPath(); x.moveTo(w / 2, 4); x.lineTo(w / 2, h - 4); x.stroke(); });
const doorTex = () => cv(64, 128, (x, w, h) => { x.fillStyle = '#356246'; x.fillRect(0, 0, w, h); x.strokeStyle = '#24452f'; x.lineWidth = 3; for (const [px, py, pw, ph] of [[6, 8, 22, 50], [36, 8, 22, 50], [6, 66, 22, 54], [36, 66, 22, 54]]) x.strokeRect(px, py, pw, ph); x.strokeStyle = '#e8e0cc'; x.lineWidth = 5; x.strokeRect(2, 2, w - 4, h - 4); });
const slats = () => cv(128, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#eae2cc'; for (let i = 0; i < 8; i++) x.fillRect(i * 16 + 5, 0, 6, h); });   /* veranda balusters, on a see-through card */
const bars = () => cv(128, 96, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#26282a'; for (let i = 0; i < 10; i++) x.fillRect(i * 13 + 4, 0, 4, h); for (const y of [4, 46, 88]) x.fillRect(0, y, w, 5); });   /* iron gate bars */
const archOpening = () => cv(64, 96, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#2a2622'; x.beginPath(); x.moveTo(6, h); x.lineTo(6, 32); x.arc(w / 2, 32, w / 2 - 6, Math.PI, 0); x.lineTo(w - 6, h); x.closePath(); x.fill(); });
const brick = () => cv(256, 256, (x, w, h) => { x.fillStyle = '#9a8a7a'; x.fillRect(0, 0, w, h); const r = rng(5); for (let row = 0; row < 16; row++) for (let c = 0; c < 9; c++) { const v = r() * 30 - 15; x.fillStyle = `rgb(${186 + v | 0},${92 + v * 0.6 | 0},${70 + v * 0.5 | 0})`; x.fillRect(c * 32 - (row % 2) * 16 + 1, row * 16 + 1, 30, 14); } });
const tiles = () => cv(128, 128, (x, w, h) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = (r + c) % 2 ? 236 : 222; x.fillStyle = `rgb(${v},${v - 2},${v - 6})`; x.fillRect(c * 32, r * 32, 32, 32); } x.strokeStyle = 'rgba(120,116,108,0.6)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, h); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); } });
const wrap = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; };
const lime = (rx = 1, ry = 1) => std(wrap(T.plaster(LIME, [1, 1], '#c8bea6'), rx, ry), 0.95);   /* whitewashed plaster, dirtier along the bottom */
const zincRoof = () => new THREE.MeshStandardMaterial({ map: wrap(T.zinc(ZINC, [1, 1]), 1, 1), roughness: 0.7, metalness: 0.3, ...DS });

/* ---------- putting a building in place: each one is built facing +z at its own origin, then turned and moved; its walls and floors go with it ---------- */
const toW = (x, z, rot, lx, lz) => [x + lx * Math.cos(rot) + lz * Math.sin(rot), z - lx * Math.sin(rot) + lz * Math.cos(rot)];
const toL = (x, z, rot, wx, wz) => [Math.cos(rot) * (wx - x) - Math.sin(rot) * (wz - z), Math.sin(rot) * (wx - x) + Math.cos(rot) * (wz - z)];
function put(g, b, x, z, rot, out) {   /* out: { walls, floors, clear } of the place */
  b.group.position.set(x, 0, z); b.group.rotation.y = rot; g.add(b.group);
  const rect = ([a, c, d, e]) => { const p = toW(x, z, rot, a, c), q = toW(x, z, rot, d, e); return [Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1])]; };
  for (const w of b.walls) out.walls.push(rect(w)); if (b.foot) out.clear.push(rect(b.foot));
  if (b.groundAt) out.floors.push((wx, wz) => { const [lx, lz] = toL(x, z, rot, wx, wz); return b.groundAt(lx, lz); });
  return (lx, lz) => toW(x, z, rot, lx, lz);
}

/* ---------- the Myers Ward: an old two-storey wooden building with a two-storey veranda along its front (size, colours and veranda are an impression) ---------- */
function myersWard() {
  const g = grp(), walls = [], wall = (a, b, c, d) => walls.push([a, b, c, d]);
  const L = 36, Z0 = -20.4, Z1 = -29.4, F1 = 0.6, F2 = 3.9, EAVE = 7.1, VZ = -18.0;
  const plank = (w, h) => std(T.plank(CREAM, 5, [w / 1.0, h / 1.0], true));
  box(L, F1, Z0 - Z1, std(T.concrete([12, 1], [120, 116, 108])), 0, F1 / 2, (Z0 + Z1) / 2, g);   /* foundation */
  box(L, EAVE - F1, 0.12, plank(L, EAVE - F1), 0, (F1 + EAVE) / 2, Z0 - 0.06, g);
  box(L, EAVE - F1, 0.12, plank(L, EAVE - F1), 0, (F1 + EAVE) / 2, Z1 + 0.06, g);
  for (const sx of [-1, 1]) box(0.12, EAVE - F1, Z0 - Z1, plank(Z0 - Z1, EAVE - F1), sx * (L / 2 - 0.06), (F1 + EAVE) / 2, (Z0 + Z1) / 2, g);
  box(L - 0.3, 0.1, Z0 - Z1 - 0.3, solid(0x6a5a46), 0, EAVE - 0.05, (Z0 + Z1) / 2, g);   /* ceiling under the roof */
  wall(-L / 2 - 0.1, Z1 - 0.1, L / 2 + 0.1, Z0 + 0.05);
  const win = std(louvre(), 0.8), door = std(doorTex(), 0.8);
  for (let k = 0; k < 12; k++) { const x = -L / 2 + 1.5 + k * 3; for (const fy of [F1, F2]) { if ((k === 5 || k === 6) && fy === F1) continue; box(1.0, 1.5, 0.05, win, x, fy + 1.55, Z0 + 0.03, g); box(1.0, 1.5, 0.05, win, x, fy + 1.55, Z1 - 0.03, g); } }
  box(1.8, 2.3, 0.05, door, 0, F1 + 1.15, Z0 + 0.03, g); box(1.8, 2.3, 0.05, door, 0, F2 + 1.15, Z0 + 0.03, g);
  for (const sx of [-1, 1]) for (const fy of [F1, F2]) for (const zz of [Z0 - 2.4, Z1 + 2.4]) box(0.05, 1.5, 1.0, win, sx * (L / 2 + 0.025), fy + 1.55, zz, g);
  /* the veranda: a raised floor, posts up to the roof, an upper floor and see-through balustrades */
  box(L, F1, Z0 - VZ, std(T.plank([150, 120, 90], 6, [L / 1.2, 2], true)), 0, F1 / 2, (Z0 + VZ) / 2, g);
  box(L, 0.16, Z0 - VZ, std(T.plank([150, 120, 90], 6, [L / 1.2, 2], true)), 0, F2 - 0.08, (Z0 + VZ) / 2, g);
  const postM = solid(0xeae2cc, 0.8), rail = solid(TRIM, 0.7), bal = new THREE.MeshStandardMaterial({ map: slats(), transparent: true, alphaTest: 0.4, ...DS, roughness: 0.8 });
  for (let k = 0; k <= 12; k++) box(0.16, EAVE - F1, 0.16, postM, -L / 2 + 0.08 + k * (L - 0.16) / 12, (F1 + EAVE) / 2, VZ - 0.1, g);
  for (const fy of [F1, F2]) for (let k = 0; k < 12; k++) {
    const x0 = -L / 2 + 0.16 + k * (L - 0.16) / 12, x1 = x0 + (L - 0.16) / 12 - 0.16, cx = (x0 + x1) / 2, w = x1 - x0;
    if (fy === F1 && (k === 5 || k === 6) && Math.abs(cx) < 2.2) continue;
    box(w + 0.02, 0.08, 0.1, rail, cx, fy + 0.95, VZ - 0.1, g);
    const b = plane(w, 0.86, bal, cx, fy + 0.5, VZ - 0.1, g); b.material.map.repeat.set(w / 1.0, 1);
  }
  for (let i = 0; i < 3; i++) box(3.0, (i + 1) * 0.2, 0.4, std(T.concrete([2, 1], [176, 172, 160])), 0, (i + 1) * 0.1, VZ + 1.0 - i * 0.4, g);
  wall(-L / 2 - 0.1, VZ - 0.25, -1.5, VZ + 0.05); wall(1.5, VZ - 0.25, L / 2 + 0.1, VZ + 0.05);
  const roof = hipRoof(L + 1.0, Z0 - Z1 + 2.4 + 1.0, 2.3, zincRoof()); roof.position.set(0, EAVE, (VZ + Z1) / 2 - 0.05); g.add(roof);
  /* beds of croton and hibiscus along the front of the veranda */
  for (const [x0, x1] of [[-17.2, -2.2], [2.2, 17.2]]) {
    box(x1 - x0, 0.08, 1.0, solid(0x4a3426, 1), (x0 + x1) / 2, 0.04, -17.05, g); wall(x0, -17.6, x1, -16.5);
    for (let x = x0 + 0.7, i = 0; x < x1 - 0.3; x += 1.5, i++) { const p = (i % 2 ? hibiscus : croton)(i + (x0 < 0 ? 0 : 50)); p.position.set(x, 0.08, -17.05); g.add(p); }
  }
  const groundAt = (x, z) => {
    if (Math.abs(x) < L / 2 && z < VZ && z > Z0) return F1;   /* on the veranda */
    if (Math.abs(x) < 1.5 && z <= VZ + 1.2 && z >= VZ) return F1 * (1 - (z - VZ) / 1.2);   /* the steps */
    return 0;
  };
  return { group: g, walls, groundAt, foot: [-L / 2 - 0.6, Z1 - 0.6, L / 2 + 0.6, VZ + 1.5], iris: [-4.5, -19.2], F1 };
}

/* ---------- the men's ward, after the owner's photograph of a two-storey building: a plastered lower storey with arches, a row of upper windows,
   a hip roof, a gabled porch at one end of the front, wide stairs up the outside and a narrow stair at the far end ---------- */
function mensWard() {
  const g = grp(), walls = [], L = 20, D = 10, H1 = 3.4, H2 = 3.2, win = std(louvre(), 0.8), arch = new THREE.MeshStandardMaterial({ map: archOpening(), transparent: true, alphaTest: 0.4, roughness: 0.9 });
  box(L, H1, D, lime(L / 4, 1), 0, H1 / 2, 0, g);
  box(L, H2, D, lime(L / 4, 1), 0, H1 + H2 / 2, 0, g);
  box(L + 0.12, 0.16, D + 0.12, solid(0xf2efe6, 0.9), 0, H1 + 0.02, 0, g);   /* the band between the storeys */
  const roof = hipRoof(L + 1.8, D + 1.8, 2.6, zincRoof()); roof.position.set(0, H1 + H2, 0); g.add(roof);
  for (let k = 0; k < 6; k++) { const x = -1 + k * 1.95; box(1.3, 2.4, 0.04, arch, x, 1.22, D / 2 + 0.025, g); box(0.95, 1.4, 0.05, win, x, H1 + 1.6, D / 2 + 0.03, g); }
  for (let k = 0; k < 4; k++) { const z = -3.6 + k * 2.4; box(0.05, 1.4, 0.95, win, L / 2 + 0.03, H1 + 1.6, z, g); box(0.05, 1.4, 0.95, win, -L / 2 - 0.03, H1 + 1.6, z, g); box(1.0, 1.4, 0.05, win, -8 + k * 5, H1 + 1.6, -D / 2 - 0.03, g); }
  /* the gabled porch: two storeys, standing out from the front at the left */
  const PX = -6.5, PW = 6, PD = 2.2;
  box(PW, H1 + H2, PD, lime(1.5, 1.5), PX, (H1 + H2) / 2, D / 2 + PD / 2, g);
  box(1.6, 2.6, 0.04, arch, PX, 1.3, D / 2 + PD + 0.025, g); box(1.2, 2.2, 0.05, std(doorTex(), 0.8), PX + 1.2, H1 + 1.1, D / 2 + PD + 0.03, g); box(1.0, 1.4, 0.05, win, PX - 1.4, H1 + 1.6, D / 2 + PD + 0.03, g);
  const ped = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-PW / 2 - 0.3, 0), new THREE.Vector2(PW / 2 + 0.3, 0), new THREE.Vector2(0, 1.7)])), solid(0xf0ece2, 0.9, 0, DS), PX, H1 + H2, D / 2 + PD + 0.01, g);
  box(PW + 0.6, 0.12, PD + 0.6, solid(0xf0ece2, 0.9), PX, H1 + H2 + 0.06, D / 2 + PD / 2, g);
  const pr = hipRoof(PW + 0.8, PD + 2.4, 1.6, zincRoof()); pr.position.set(PX, H1 + H2 + 0.12, D / 2 + PD / 2 - 0.4); g.add(pr); void ped;
  /* wide outside stairs rising to the porch's upper door, with a solid whitewashed side wall */
  const SW = 1.6, steps = 17, run = 0.3, x0 = PX + PW / 2 + 0.2 + steps * run, zf = D / 2 + PD + 0.15;
  for (let i = 0; i < steps; i++) box(run + 0.01, (i + 1) * (H1 / steps), SW, lime(0.3, 1), x0 - i * run - run / 2, (i + 1) * (H1 / steps) / 2, zf + SW / 2, g);
  box(1.6, H1, SW, lime(0.5, 1), PX + PW / 2 - 0.6, H1 / 2, zf + SW / 2, g);   /* the landing in front of the upper door */
  const sl = Math.hypot(steps * run, H1), side = box(sl, 0.9, 0.18, lime(sl / 3, 0.3), x0 - steps * run / 2, H1 / 2 + 0.45, zf + SW + 0.09, g); side.rotation.z = Math.atan2(H1, steps * run);
  /* a narrow stair with a rail up the far end */
  for (let i = 0; i < 14; i++) box(1.0, (i + 1) * (H1 / 14), 0.28, solid(0xd8d2c4, 0.9), L / 2 + 0.6, (i + 1) * (H1 / 14) / 2, D / 2 - 0.4 - i * 0.28, g);
  const rr = box(0.05, 0.05, Math.hypot(14 * 0.28, H1), solid(0x26282a, 0.6, 0.4), L / 2 + 1.08, H1 / 2 + 0.95, D / 2 - 0.4 - 7 * 0.28, g); rr.rotation.x = Math.atan2(H1, 14 * 0.28);
  for (const zz of [D / 2 - 0.3, D / 2 - 4.2]) box(0.05, 1.0, 0.05, solid(0x26282a, 0.6, 0.4), L / 2 + 1.08, (zz === D / 2 - 0.3 ? 0.5 : H1 + 0.5), zz, g);
  walls.push([-L / 2 - 0.2, -D / 2 - 0.2, L / 2 + 1.3, D / 2 + 0.2], [PX - PW / 2 - 0.2, D / 2, x0 + 0.2, zf + SW + 0.3]);
  return { group: g, walls, foot: [-L / 2 - 1, -D / 2 - 1, L / 2 + 1.5, zf + SW + 0.5] };
}

/* ---------- a one-storey block building with a front overhang on square pillars, after the owner's photograph of the burnt building ---------- */
function oneStorey(L, D, { overhang = 2.2, H = 3.2 } = {}) {
  const g = grp(), walls = [], win = std(louvre(), 0.8), door = std(doorTex(), 0.8);
  box(L, H, D, lime(L / 4, 1), 0, H / 2, 0, g);
  const n = Math.max(2, Math.round(L / 3.2));
  for (let k = 0; k < n; k++) { const x = -L / 2 + (k + 0.5) * L / n; if (k === (n >> 1)) box(1.3, 2.3, 0.05, door, x, 1.15, D / 2 + 0.03, g); else box(1.1, 1.4, 0.05, win, x, 1.8, D / 2 + 0.03, g); box(1.1, 1.4, 0.05, win, x, 1.8, -D / 2 - 0.03, g); }
  if (overhang) {
    box(L, 0.12, overhang, std(T.concrete([L / 3, 1], [170, 166, 156])), 0, 0.06, D / 2 + overhang / 2, g);
    for (let k = 0; k <= n; k++) box(0.34, H, 0.34, lime(0.2, 1), -L / 2 + 0.17 + k * (L - 0.34) / n, H / 2, D / 2 + overhang - 0.17, g);
    box(L + 0.2, 0.3, 0.36, lime(L / 4, 0.2), 0, H - 0.15, D / 2 + overhang - 0.17, g);   /* the beam over the pillars */
  }
  const roof = hipRoof(L + 1.0, D + overhang + 1.0, 1.3, zincRoof()); roof.position.set(0, H, overhang / 2); g.add(roof);
  walls.push([-L / 2 - 0.2, -D / 2 - 0.2, L / 2 + 0.2, D / 2 + 0.2]);
  if (overhang) for (let k = 0; k <= n; k++) { const x = -L / 2 + 0.17 + k * (L - 0.34) / n; walls.push([x - 0.3, D / 2 + overhang - 0.47, x + 0.3, D / 2 + overhang + 0.13]); }
  return { group: g, walls, foot: [-L / 2 - 0.6, -D / 2 - 0.6, L / 2 + 0.6, D / 2 + overhang + 0.6] };
}

/* ---------- small builders for the street and the grounds ---------- */
function car(col) {   /* a 1970s saloon car, front toward +x */
  const g = grp(), m = solid(col, 0.5, 0.2), glass = solid(0x22303a, 0.3, 0.1), tyre = solid(0x161616, 0.9), chrome = solid(0xcfd2d4, 0.3, 0.8);
  box(4.2, 0.62, 1.66, m, 0, 0.62, 0, g); box(2.1, 0.55, 1.5, m, -0.25, 1.2, 0, g); box(1.9, 0.4, 1.53, glass, -0.25, 1.22, 0, g);
  for (const x of [-2.12, 2.12]) box(0.06, 0.16, 1.5, chrome, x, 0.55, 0, g);
  for (const z of [-0.55, 0.55]) box(0.04, 0.14, 0.26, solid(0xf4f0dc, 0.3), 2.11, 0.74, z, g);
  for (const x of [-1.35, 1.35]) for (const z of [-0.78, 0.78]) { const w = cyl(0.32, 0.32, 0.22, tyre, x, 0.32, z, g, 12); w.rotation.x = Math.PI / 2; }
  return g;
}
function streetLamp(h = 5) {   /* an electric lamp on a pole with a short arm toward +x */
  const g = grp(), m = solid(0x6e7072, 0.5, 0.5); cyl(0.07, 0.1, h, m, 0, h / 2, 0, g, 8); box(0.9, 0.06, 0.06, m, 0.45, h - 0.1, 0, g); box(0.4, 0.12, 0.22, solid(0xf2efe6, 0.4), 0.95, h - 0.16, 0, g); return g;
}
function zincFence(g, x0, x1, z, h = 2.2) {   /* sheets of zinc on posts, the way many Kingston yards are closed in */
  const t = T.zinc([128, 118, 104], [1, 1]).clone(); t.needsUpdate = true; t.repeat.set((x1 - x0) / 0.9, 1);
  box(x1 - x0, h, 0.04, std(t, 0.75), (x0 + x1) / 2, h / 2, z, g);
  for (let x = x0; x <= x1 + 0.01; x += 2.4) box(0.1, h + 0.1, 0.1, solid(0x5a4632, 0.95), x, (h + 0.1) / 2, z + 0.06, g);
}
function limeWall(g, wall, x0, z0, x1, z1, h = 2.2) {   /* a whitewashed boundary wall with a coping along the top */
  const len = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(-(z1 - z0), x1 - x0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  box(len, h, 0.3, lime(len / 4, 1), cx, h / 2, cz, g).rotation.y = ang;
  box(len + 0.1, 0.1, 0.42, solid(0xe8e4d8, 0.9), cx, h + 0.05, cz, g).rotation.y = ang;
  wall(Math.min(x0, x1) - 0.25, Math.min(z0, z1) - 0.25, Math.max(x0, x1) + 0.25, Math.max(z0, z1) + 0.25);
}
function casuarina(h = 13, seed = 1) {   /* a tall, wispy casuarina, like the one by the gate in the photograph */
  const r = rng(seed), g = grp(); cyl(0.16, 0.3, h * 0.8, solid(0x5e5246, 1), 0, h * 0.4, 0, g, 7);
  for (let i = 0; i < 5; i++) { const c = mesh(new THREE.ConeGeometry(1.0 + r() * 0.9, 2.6 + r() * 1.4, 7), flat([0x3e5236, 0x4a5e3e, 0x36482f][i % 3]), (r() - 0.5) * 1.4, h * 0.5 + i * h * 0.11, (r() - 0.5) * 1.4, g); c.rotation.z = (r() - 0.5) * 0.3; }
  return g;
}
/* the iron arch over the gate, with the words EVENTIDE HOME in cut-out letters (from the photograph), drawn on a see-through card */
function gateArch(span, rise) {
  const W = span + 0.4, H = rise + 0.35, px = 142, cw = Math.round(W * px), ch = Math.round(H * px);
  const R = (span * span / 4 + rise * rise) / (2 * rise), cy = ch - (rise - R) * px * -1;   /* circle centre, below the card */
  const tex = cv(cw, ch, (x) => {
    x.clearRect(0, 0, cw, ch); const ox = cw / 2, oy = ch + (R - rise) * px;
    x.strokeStyle = '#25272a'; x.lineWidth = 8;
    for (const rr of [R, R - 0.46]) { x.beginPath(); x.arc(ox, oy, rr * px, Math.PI + 0.42, Math.PI * 2 - 0.42); x.stroke(); }
    x.lineWidth = 5; for (let a = Math.PI + 0.5; a < Math.PI * 2 - 0.45; a += 0.11) { x.beginPath(); x.moveTo(ox + Math.cos(a) * (R - 0.46) * px, oy + Math.sin(a) * (R - 0.46) * px); x.lineTo(ox + Math.cos(a) * (R - 0.4) * px, oy + Math.sin(a) * (R - 0.4) * px); x.stroke(); }
    const put = (ch2, a) => { x.save(); x.translate(ox + Math.cos(a) * (R - 0.23) * px, oy + Math.sin(a) * (R - 0.23) * px); x.rotate(a + Math.PI / 2); x.font = '700 44px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 5; x.strokeStyle = '#25272a'; x.strokeText(ch2, 0, 0); x.fillStyle = '#f2efe6'; x.fillText(ch2, 0, 0); x.restore(); };
    'EVENTIDE'.split('').forEach((c, i) => put(c, Math.PI * 1.215 + i * 0.066));
    'HOME'.split('').forEach((c, i) => put(c, Math.PI * 1.6 + i * 0.07));
  });
  void cy; const m = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.35, ...DS, roughness: 0.6 });
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(W, H), m), W, H };
}

/* ---------- Slipe Pen Road and the Eventide Home, May 1980 ---------- */
export function buildSlipe(g) {
  const walls = [], wall = (x0, z0, x1, z1) => walls.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
  const out = { walls, floors: [], clear: [] }, r = rng(11), white = solid(0xf2efe6, 0.9);
  /* ground, the road and pavements */
  const earth = plane(220, 220, std(T.grass([75, 75], [138, 132, 84])), 0, 0, -30, g); earth.rotation.x = -Math.PI / 2;   /* dry, patchy grass: May is near the end of the dry season */
  const road = plane(130, 8, std(T.concrete([40, 3], [72, 72, 70]), 0.95), 0, 0.01, 0, g); road.rotation.x = -Math.PI / 2;
  for (const z of [-4.9, 4.9]) box(130, 0.15, 1.8, std(T.concrete([40, 1], [176, 172, 160])), 0, 0.075, z, g);
  box(130, 0.03, 0.55, std(T.concrete([60, 1], [96, 94, 88])), 0, 0.015, -6.15, g);   /* an open gutter */
  /* power poles with street lamps, and wires */
  const pole = std(T.plank([92, 70, 50], 3), 0.95);
  for (const x of [-50, -25, 0, 25, 50]) {
    if (x === 0) continue;   /* keep the view through the gate clear */
    cyl(0.12, 0.15, 9, pole, x, 4.5, -5.6, g); box(1.8, 0.12, 0.12, pole, x, 8.6, -5.6, g); wall(x - 0.3, -5.9, x + 0.3, -5.3);
    box(0.08, 0.08, 1.4, solid(0x6e7072, 0.5, 0.5), x, 7.6, -4.95, g); box(0.4, 0.12, 0.24, solid(0xf2efe6, 0.4), x, 7.52, -4.2, g);
  }
  for (const [a, b] of [[-50, -25], [-25, 25], [25, 50]]) for (const dz of [-0.05, 0, 0.05]) { const w = cyl(0.012, 0.012, b - a, solid(0x1a1a1a), (a + b) / 2, 8.7, -5.6 + dz, g); w.rotation.z = Math.PI / 2; }
  /* the bus stop, about 30 m along from the entrance (Gleaner, 2020) */
  cyl(0.04, 0.04, 2.6, solid(0x8a8a86, 0.5, 0.5), -26, 1.3, 5.5, g);
  box(0.62, 0.36, 0.03, std(T.sign('BUS STOP', 256, 128, '#f2c230', '#1a1a1a', '700 52px Arial, sans-serif')), -26, 2.45, 5.47, g); wall(-26.2, 5.3, -25.8, 5.7);
  /* shops across the road (impressions, not real shops), zinc fences in the gaps, board houses behind */
  const shop = (x, w, col, name) => {
    box(w, 4.2, 6, std(T.plaster(col, [w / 4, 1])), x, 2.1, 10.6, g); wall(x - w / 2, 7.6, x + w / 2, 13.6);
    box(w + 0.6, 0.08, 2.2, std(T.zinc(ZINC, [w / 2, 1])), x, 3.3, 6.5, g);
    for (const px of [x - w / 2 + 0.2, x + w / 2 - 0.2]) { cyl(0.07, 0.07, 3.3, solid(0x6a5a46), px, 1.65, 5.6, g); wall(px - 0.2, 5.4, px + 0.2, 5.8); }
    box(w * 0.7, 0.6, 0.06, std(T.sign(name, 512, 96, '#f3ecd8', '#3a2a1e', '700 58px Georgia, serif')), x, 3.85, 7.57, g);
    box(1.4, 2.4, 0.06, std(doorTex()), x, 1.2, 7.57, g);
  };
  shop(-38, 9, [214, 196, 160], 'GROCERY'); shop(-26, 8, [222, 214, 196], 'FURNITURE'); shop(-14, 11, [196, 214, 200], 'DRY GOODS'); shop(10, 10, [222, 200, 176], 'HARDWARE');
  shop(27, 9, [200, 206, 226], 'BAR'); shop(40, 7, [226, 210, 190], 'BARBER');
  for (const [x0, x1] of [[-33.5, -30], [-22, -19.5], [-8.5, -4.5], [1.5, 5], [15, 22.5], [31.5, 36.5]]) zincFence(g, x0, x1, 8.2);
  const bh = boardHouse(5, 4, 2.8, { wall: [196, 168, 120], seed: 3 }); bh.position.set(-1.5, 0, 11.6); bh.rotation.y = Math.PI; g.add(bh);
  [[-35, 21, [176, 196, 170]], [-12, 20, [206, 176, 140]], [8, 22, [190, 160, 120]], [25, 20, [200, 190, 160]], [40, 21, [170, 180, 196]]].forEach(([x, z, c], i) => { const h = boardHouse(5 + r() * 2, 4, 2.8, { wall: c, seed: 10 + i, porch: false }); h.position.set(x, 0, z); h.rotation.y = Math.PI; g.add(h); });
  for (const [x, z, ry, c] of [[18, 2.6, 0, 0x9a3a2e], [-44, 2.6, Math.PI, 0xe8e2d0], [33, -2.6, Math.PI, 0x6a8a7a]]) { const c0 = car(c); c0.position.set(x, 0, z); c0.rotation.y = ry; g.add(c0); wall(x - 2.3, z - 1.0, x + 2.3, z + 1.0); }
  /* Calvary Cemetery along the road to the west (smoke rose over it that morning: Gleaner, 2020; its layout is an impression) */
  box(30, 2.0, 0.3, lime(8, 1), -62, 1.0, 6.9, g); for (const x of [-56, -52]) box(0.5, 2.6, 0.5, lime(), x, 1.3, 6.9, g);
  for (let i = 0; i < 36; i++) { const x = -76 + (i % 9) * 3.2 + r() * 0.6, z = 9.5 + ((i / 9) | 0) * 3 + r() * 0.5, tomb = solid(r() < 0.6 ? 0xeeeae0 : 0xb8b4aa, 0.9);
    box(1.0, 0.5 + r() * 0.4, 2.0, tomb, x, 0.4, z, g); if (r() < 0.45) { box(0.12, 1.1, 0.12, tomb, x, 1.3, z - 0.8, g); box(0.6, 0.12, 0.12, tomb, x, 1.6, z - 0.8, g); } }

  /* ---- the entrance, from the photograph: whitewashed walls, two tall pillars, the iron arch and lamp, iron gates open inward ---- */
  const GX = 3.4, PIL = 0.8, PH = 3.5;
  limeWall(g, wall, -48, -7, -GX - PIL / 2, -7); limeWall(g, wall, GX + PIL / 2, -7, 48, -7);
  limeWall(g, wall, -48, -66, 48, -66, 2.0); limeWall(g, wall, -48, -66, -48, -7, 2.0); limeWall(g, wall, 48, -66, 48, -7, 2.0);
  for (const sx of [-1, 1]) { box(PIL, PH, PIL, lime(0.3, 1.2), sx * GX, PH / 2, -7, g); box(PIL + 0.14, 0.14, PIL + 0.14, solid(0xece8dc, 0.9), sx * GX, PH + 0.07, -7, g); wall(sx * GX - 0.5, -7.5, sx * GX + 0.5, -6.5); }
  const arch = gateArch(2 * GX, 2.0); arch.mesh.position.set(0, PH + 0.14 + arch.H / 2 - 0.12, -7); g.add(arch.mesh);
  cyl(0.015, 0.015, 0.5, solid(0x25272a, 0.6), 0, PH + 0.14 + 2.0 - 0.45, -7, g);   /* the lamp hangs from the top of the arch */
  box(0.26, 0.34, 0.26, solid(0xf4ecd0, 0.4), 0, PH + 0.14 + 2.0 - 0.85, -7, g); box(0.34, 0.06, 0.34, solid(0x25272a, 0.6), 0, PH + 0.14 + 2.0 - 0.66, -7, g);
  const gateM = new THREE.MeshStandardMaterial({ map: bars(), transparent: true, alphaTest: 0.4, ...DS, roughness: 0.6, metalness: 0.4 });
  for (const sx of [-1, 1]) {
    const leaf = grp(g, sx * (GX - PIL / 2 - 0.02), 0, -7.15); leaf.rotation.y = sx > 0 ? -1.32 : 1.32;
    const lw = GX - PIL / 2 - 0.1; plane(lw, 2.1, gateM, -sx * lw / 2, 1.1, 0, leaf).material.map.repeat.set(lw / 1.2, 1);
    box(lw, 0.07, 0.07, solid(0x26282a, 0.6, 0.4), -sx * lw / 2, 2.15, 0, leaf); box(0.08, 2.15, 0.08, solid(0x26282a, 0.6, 0.4), 0, 1.075, 0, leaf); box(0.08, 2.15, 0.08, solid(0x26282a, 0.6, 0.4), -sx * lw, 1.075, 0, leaf);
    const [hx, hz] = [sx * (GX - PIL / 2), -7.15], ex = hx - sx * Math.cos(1.32) * lw, ez = hz - Math.sin(1.32) * lw; wall(Math.min(hx, ex) - 0.15, Math.min(hz, ez) - 0.1, Math.max(hx, ex) + 0.15, Math.max(hz, ez) + 0.1);
  }
  /* ---- the avenue: a long, dusty drive between tall trees, as in the photograph ---- */
  const AV0 = -7, AV1 = -64, AW = 6;
  const av = plane(AW, AV0 - AV1, std(T.dirt([2, 18], [178, 152, 112]))); av.rotation.x = -Math.PI / 2; av.position.set(0, 0.02, (AV0 + AV1) / 2); g.add(av);
  const fore = plane(12, 7, std(T.dirt([4, 2], [178, 152, 112]))); fore.rotation.x = -Math.PI / 2; fore.position.set(0, 0.018, -10.5); g.add(fore);
  out.clear.push([-AW / 2 - 0.4, AV1, AW / 2 + 0.4, AV0], [-6, -14, 6, -7]);
  /* ---- the three buildings: the Myers Ward on the east of the avenue, the men's ward and the children's ward on the west ---- */
  const myers = myersWard(), toMy = put(g, myers, -12, -38, -Math.PI / 2, out);
  put(g, mensWard(), -15.5, -21, Math.PI / 2, out);
  put(g, oneStorey(16, 8), -13.5, -46, Math.PI / 2, out);
  /* the kitchen and laundry at the far end, with a water tank on a stand, a standpipe and the meal van (the Home had a meal van: JNHT) */
  put(g, oneStorey(11, 5, { overhang: 0, H: 3.0 }), 12.5, -61.5, -Math.PI / 2, out);
  const tw = waterTower(); tw.position.set(21, 0, -61); g.add(tw); wall(19.1, -62.9, 22.9, -59.1); out.clear.push([18.8, -63.2, 23.2, -58.8]);
  const sp = standpipe(); sp.position.set(8.8, 0, -57.6); g.add(sp); wall(8.4, -58, 9.2, -57.2);
  const van = truck(0xe6e2d4); van.traverse((o) => { if (o.isMesh && o.geometry.type === 'ConeGeometry') o.visible = false; }); van.position.set(5.2, 0, -58.5); van.rotation.y = -Math.PI / 2; g.add(van);
  box(1.92, 0.05, 2.4, solid(0x2f6a3f, 0.7), 5.2, 1.385, -58.1, g); wall(4.1, -60.4, 6.3, -56.8); out.clear.push([3.8, -60.8, 6.6, -56.4]);
  /* clotheslines on the east side, with sheets drying */
  for (const x of [24, 29, 34, 39]) { cyl(0.05, 0.05, 2.0, solid(0x8a8a86, 0.5, 0.4), x, 1.0, -30, g); wall(x - 0.2, -30.2, x + 0.2, -29.8); }
  const line = cyl(0.01, 0.01, 15, solid(0x6a6a66), 31.5, 1.95, -30, g); line.rotation.z = Math.PI / 2;
  const sheets = [0xf4f2ec, 0xe8eef4, 0xf2e4e4, 0xf4f2ec, 0xe4ecdc, 0xf4f2ec, 0xeae4f2];
  for (let i = 0; i < 7; i++) { const sh = plane(1.4, 1.0, solid(sheets[i], 0.95, 0, DS), 25 + i * 2.1, 1.44, -30 + (r() - 0.5) * 0.04, g); sh.rotation.y = (r() - 0.5) * 0.12; }
  /* trees: tall shade trees along both sides of the avenue with whitewashed trunks, a casuarina by the gate, flame trees in bloom (May), palms */
  const trunkBand = (x, z, br) => { cyl(br, br + 0.03, 1.0, white, x, 0.5, z, g); wall(x - br - 0.15, z - br - 0.15, x + br + 0.15, z + br + 0.15); };
  for (let z = -11, i = 0; z > AV1 + 2; z -= 7, i++) for (const sx of [-1, 1]) {
    const x = sx * 4.4;
    if (sx > 0 && z < -17 && z > -59) continue;   /* the Myers Ward's veranda and beds are there */
    if (sx < 0 && z > -12 && i === 0) { const c = casuarina(14, 3); c.position.set(-4.6, 0, -9.6); g.add(c); wall(-4.95, -9.95, -4.25, -9.25); continue; }
    const t = (i + (sx > 0 ? 1 : 0)) % 3 === 0 ? mangoTree(9 + r() * 2, 40 + i) : tree(10 + r() * 3, 70 + i); t.position.set(x, 0, z); g.add(t); trunkBand(x, z, 0.46);
  }
  for (const [x, z, h] of [[24, -14, 7.5], [-30, -36, 7], [30, -48, 7.5]]) { const t = flameTree(h, (x * 7) | 0); t.position.set(x, 0, z); g.add(t); trunkBand(x, z, 0.44); }
  for (const [x, z] of [[36, -12], [-40, -56], [40, -58], [-36, -12]]) { const t = mangoTree(7, (z * 3) | 0); t.position.set(x, 0, z); g.add(t); trunkBand(x, z, 0.47); }
  for (const [x, z] of [[-44, -10], [-44, -30], [44, -10], [44, -40]]) { const p = palm(8 + r() * 2, (z * 5) | 0); p.position.set(x, 0, z); g.add(p); wall(x - 0.35, z - 0.35, x + 0.35, z + 0.35); }
  /* benches under the trees, facing the avenue; lamps along it */
  for (const [x, z, ry] of [[-5.6, -15, Math.PI / 2], [-5.6, -36, Math.PI / 2], [-5.6, -54, Math.PI / 2], [5.6, -13, -Math.PI / 2], [5.6, -62, -Math.PI / 2]]) { const b = bench(2.2, 0x5a4632); b.position.set(x, 0, z); b.rotation.y = ry; g.add(b); wall(x - 0.35, z - 1.2, x + 0.35, z + 1.2); }
  for (const z of [-17, -31, -45, -59]) { const l = streetLamp(4.8); l.position.set(-3.5, 0, z); g.add(l); wall(-3.7, z - 0.2, -3.3, z + 0.2); }
  /* bougainvillea spilling over the front wall */
  for (const x of [-40, -28, -16, -9, 9, 16, 28, 40]) for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(0.45 + r() * 0.15, 1), flat(i % 3 === 2 ? 0x3f7a32 : (i % 2 ? 0xd23a8a : 0xe0559e)), x + (r() - 0.5) * 1.4, 1.7 + r() * 0.7, -7.25 - r() * 0.2, g);
  /* grass, kept off the avenue and the buildings; a few flowers */
  grassField(g, [-47.6, -65.6, 47.6, -7.4], 2200, { seed: 9, clear: out.clear, h: 0.32, w: 0.55, tint: 0xc4c07c, vary: 0.35 });
  flowerField(g, [-47, -65, 47, -8], 220, { seed: 4, clear: out.clear, colors: [0xe2232a, 0xf5c542, 0xffffff, 0xe27ad8] });
  /* beyond: trees past the back wall, and the hills round Kingston */
  for (let i = 0; i < 26; i++) { const x = -70 + r() * 140, z = -72 - r() * 30, t = r() < 0.35 ? palm(7 + r() * 3, i) : tree(6 + r() * 3, 60 + i); t.position.set(x, 0, z); g.add(t); }
  g.add(hillRing(190, 18, 80, { seed: 5, base: [0.24, 0.42, 0.24] }));

  const groundAt = (x, z) => { for (const f of out.floors) { const y = f(x, z); if (y) return y; } return 0; };
  const [ix, iz] = toMy(...myers.iris);
  return { walls, bounds: { x0: -47.5, x1: 47.5, z0: -65.5, z1: 7.2 }, start: { x: -26, z: 4.6, yaw: -0.6 }, groundAt,
    spots: { iris: { x: ix, z: iz, ry: -Math.PI / 2, ground: myers.F1 }, gate: { x: 0, z: -7 }, busstop: { x: -26, z: 5.5 } } };
}

/* ---------- the Eventide monument, National Heroes Park, today (from a 2025 photograph) ---------- */
export function buildMonument(g) {
  const walls = [];
  const grass = plane(160, 160, std(T.grass([50, 50])), 0, 0, 0, g); grass.rotation.x = -Math.PI / 2;
  const circle = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), std(wrap(brick(), 6, 6))); circle.rotation.x = -Math.PI / 2; circle.position.y = 0.015; g.add(circle);
  const path = plane(2.2, 22, std(wrap(brick(), 1, 10)), 0, 0.012, 15.5, g); path.rotation.x = -Math.PI / 2;
  /* the tiled base, then the triangle: a front face that leans back a little, and sloping sides back to the base's rear edge. The front faces +z, toward the path. */
  const W = 2.7, H = 3.1, D = 1.0, BH = 0.2, LEAN = 0.12;
  box(W + 0.6, BH, D + 0.5, std(wrap(tiles(), 4, 2)), 0, BH / 2, 0, g);
  const v = [[-W / 2, 0, D / 2], [W / 2, 0, D / 2], [W / 2, 0, -D / 2], [-W / 2, 0, -D / 2], [0, H, D / 2 - LEAN]];
  const faces = [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 3, 2], [0, 2, 1]], pos = [];
  for (const f of faces) for (const i of f) pos.push(...v[i]);
  const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); tg.computeVertexNormals();
  const tri = new THREE.Mesh(tg, std(T.concrete([2, 2], [242, 240, 234]), 0.95, DS)); tri.position.y = BH; g.add(tri);
  /* the plaque: a black triangle with the real words (read from the photograph), lying on the front face just in front of it */
  const words = cv(512, 600, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#16191c'; x.beginPath(); x.moveTo(w / 2, 6); x.lineTo(w - 6, h - 6); x.lineTo(6, h - 6); x.closePath(); x.fill();
    x.fillStyle = '#e9e4d6'; x.textAlign = 'center'; const lines = [['DEDICATED', 270, 24], ['TO THE VICTIMS', 312, 24], ['OF', 352, 24], ['THE EVENTIDE HOME FIRE', 394, 24], ['MAY THEIR SOULS', 470, 26], ['REST IN PEACE', 512, 26]];
    for (const [t, y, s] of lines) { x.font = `700 ${s}px Georgia, serif`; x.fillText(t, w / 2, y); } });
  const bot = new THREE.Vector3(0, BH, D / 2), apex = new THREE.Vector3(0, BH + H, D / 2 - LEAN), up = apex.clone().sub(bot), len = up.length(); up.normalize();
  const n = new THREE.Vector3(1, 0, 0).cross(up).normalize(), right = up.clone().cross(n).normalize();
  const t0 = 0.40, t1 = 0.82, qw = 1.25, c0 = bot.clone().addScaledVector(up, len * t0).addScaledVector(n, 0.012), c1 = bot.clone().addScaledVector(up, len * t1).addScaledVector(n, 0.012);
  const qp = [c0.clone().addScaledVector(right, -qw / 2), c0.clone().addScaledVector(right, qw / 2), c1.clone().addScaledVector(right, qw / 2), c1.clone().addScaledVector(right, -qw / 2)];
  const qg = new THREE.BufferGeometry(); qg.setAttribute('position', new THREE.Float32BufferAttribute([...qp[0].toArray(), ...qp[1].toArray(), ...qp[2].toArray(), ...qp[0].toArray(), ...qp[2].toArray(), ...qp[3].toArray()], 3));
  qg.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2)); qg.computeVertexNormals();
  g.add(new THREE.Mesh(qg, new THREE.MeshStandardMaterial({ map: words, transparent: true, alphaTest: 0.3, roughness: 0.4 })));
  walls.push([-W / 2 - 0.4, -D / 2 - 0.35, W / 2 + 0.4, D / 2 + 0.35]);
  /* shrubs round the circle */
  const shrub = solid(0x5a8a2a, 0.95), r = rng(3);
  for (let i = 0; i < 10; i++) { const a = 0.6 + i * 0.5 + r() * 0.2; if (Math.sin(a) > 0.55) continue;   /* leave the path to the plaque clear */ const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 + r() * 0.3, 1), shrub); s.position.set(Math.cos(a) * 6.2, 0.45, Math.sin(a) * 6.2 - 1); g.add(s); }
  return { walls, bounds: { x0: -30, x1: 30, z0: -30, z1: 28 }, start: { x: 0, z: 6, yaw: 0 }, groundAt: () => 0, spots: { plaque: { x: 0, z: 1.6 } } };
}
