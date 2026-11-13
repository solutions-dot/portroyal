/* games/eventide/src/places.js: the places of Eventide 1980, built in code (see docs/games/eventide.md).
   Each builder fills a group and returns what the game and the audit need: walls (boxes you cannot walk into), bounds, the start,
   groundAt(x, z) for raised floors such as the veranda, and spots (named points for people and things to do).
   What is real and what is an impression:
     - Real: Slipe Pen Road; the Home was "fenced-in" (AP, 21 May 1980); the Myers Ward was an old two-storey wooden building;
       the men's and children's wards were partly concrete (George Pinto, Jamaica Observer, 2011); the No. 43 bus stopped across from the entrance.
     - Impression (no photograph found): the ward's size, colours, windows and verandas, the fence type, the shops and the gatehouse.
     - The monument follows a 2025 photograph (Jamaica Observer): a white concrete triangle on a low tiled base in a round brick circle,
       with a black triangular plaque. The plaque's small emblem is not shown because it cannot be made out. */
import * as THREE from 'three';
import { T, cv, std, solid, box, cyl, plane, grp, rng } from './gfx.js';

const DS = { side: THREE.DoubleSide };
const CREAM = [232, 222, 196], TRIM = 0x3c6a48, ZINC = [150, 152, 146];

/* a hip roof over a W by D footprint centred on (0, 0, 0): eaves at y = 0, ridge along x at height H. Double-sided, so it also reads from under a veranda. */
function hipRoof(W, D, H, mat) {
  const hw = W / 2, hd = D / 2, r = Math.max(0, hw - hd), A = [-hw, 0, -hd], B = [hw, 0, -hd], C = [hw, 0, hd], Dd = [-hw, 0, hd], E = [-r, H, 0], F = [r, H, 0];
  const tris = [[A, B, F], [A, F, E], [C, Dd, E], [C, E, F], [Dd, A, E], [B, C, F]], pos = [], uv = [];
  tris.forEach((t, i) => t.forEach((p) => { pos.push(...p); uv.push(i < 4 ? p[0] * 0.5 : p[2] * 0.5, p[1] * 0.8 + (i < 4 ? Math.abs(p[2]) : Math.abs(p[0])) * 0.8); }));
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}
/* window and door panels, drawn once */
const louvre = () => cv(64, 96, (x, w, h) => { x.fillStyle = '#2f5a3e'; x.fillRect(0, 0, w, h); for (let y = 8; y < h - 6; y += 6) { x.fillStyle = '#4f8a62'; x.fillRect(6, y, w - 12, 3); x.fillStyle = '#1e3a28'; x.fillRect(6, y + 3, w - 12, 2); } x.strokeStyle = '#e8e0cc'; x.lineWidth = 5; x.strokeRect(2, 2, w - 4, h - 4); x.beginPath(); x.moveTo(w / 2, 4); x.lineTo(w / 2, h - 4); x.stroke(); });
const doorTex = () => cv(64, 128, (x, w, h) => { x.fillStyle = '#356246'; x.fillRect(0, 0, w, h); x.strokeStyle = '#24452f'; x.lineWidth = 3; for (const [px, py, pw, ph] of [[6, 8, 22, 50], [36, 8, 22, 50], [6, 66, 22, 54], [36, 66, 22, 54]]) x.strokeRect(px, py, pw, ph); x.strokeStyle = '#e8e0cc'; x.lineWidth = 5; x.strokeRect(2, 2, w - 4, h - 4); });
const slats = () => cv(128, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#eae2cc'; for (let i = 0; i < 8; i++) x.fillRect(i * 16 + 5, 0, 6, h); });   /* veranda balusters, on a see-through card */
const chain = () => cv(64, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(170,176,176,0.95)'; x.lineWidth = 2; for (let i = -64; i < 128; i += 12) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 64, 64); x.stroke(); x.beginPath(); x.moveTo(i + 64, 0); x.lineTo(i, 64); x.stroke(); } });
const brick = () => cv(256, 256, (x, w, h) => { x.fillStyle = '#9a8a7a'; x.fillRect(0, 0, w, h); const r = rng(5); for (let row = 0; row < 16; row++) for (let c = 0; c < 9; c++) { const v = r() * 30 - 15; x.fillStyle = `rgb(${186 + v | 0},${92 + v * 0.6 | 0},${70 + v * 0.5 | 0})`; x.fillRect(c * 32 - (row % 2) * 16 + 1, row * 16 + 1, 30, 14); } });
const tiles = () => cv(128, 128, (x, w, h) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = (r + c) % 2 ? 236 : 222; x.fillStyle = `rgb(${v},${v - 2},${v - 6})`; x.fillRect(c * 32, r * 32, 32, 32); } x.strokeStyle = 'rgba(120,116,108,0.6)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, h); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); } });
const wrap = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; };

/* ---------- Slipe Pen Road and the Eventide Home compound, May 1980 ---------- */
export function buildSlipe(g) {
  const walls = [], wall = (x0, z0, x1, z1) => walls.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
  const r = rng(11);
  /* ground: the yard and verges (one big mesh, so the audit counts it as the ground) and the road */
  const earth = plane(200, 200, std(T.grass([70, 70], [138, 132, 84])), 0, 0, -20, g); earth.rotation.x = -Math.PI / 2;   /* dry, patchy grass: May is near the end of the dry season */
  const road = plane(130, 8, std(T.concrete([40, 3], [72, 72, 70]), 0.95), 0, 0.01, 0, g); road.rotation.x = -Math.PI / 2;
  for (const z of [-4.9, 4.9]) box(130, 0.15, 1.8, std(T.concrete([40, 1], [176, 172, 160])), 0, 0.075, z, g);   /* pavements */
  /* power poles and wires on the Home side of the road */
  const pole = std(T.plank([92, 70, 50], 3), 0.95);
  for (const x of [-50, -25, 0, 25, 50]) { cyl(0.12, 0.15, 9, pole, x, 4.5, -5.6, g); box(1.8, 0.12, 0.12, pole, x, 8.6, -5.6, g); wall(x - 0.3, -5.9, x + 0.3, -5.3); }
  for (let i = 0; i < 4; i++) for (const dx of [-0.8, 0, 0.8]) { const w = cyl(0.012, 0.012, 25, solid(0x1a1a1a), -37.5 + i * 25, 8.7, -5.6 + dx * 0.06, g); w.rotation.z = Math.PI / 2; }
  /* the bus stop, about 30 m along from the Home's gate (Gleaner, 2020: the No. 43 stopped across from the entrance) */
  cyl(0.04, 0.04, 2.6, solid(0x8a8a86, 0.5, 0.5), -26, 1.3, 5.5, g);
  box(0.62, 0.36, 0.03, std(T.sign('BUS STOP', 256, 128, '#f2c230', '#1a1a1a', '700 52px Arial, sans-serif')), -26, 2.45, 5.47, g);
  wall(-26.2, 5.3, -25.8, 5.7);
  /* shops across the road: plaster fronts, a zinc piazza roof on posts (impressions, not real shops) */
  const shop = (x, w, col, name) => {
    box(w, 4.2, 6, std(T.plaster(col, [w / 4, 1])), x, 2.1, 10.6, g); wall(x - w / 2, 7.6, x + w / 2, 13.6);
    box(w + 0.6, 0.08, 2.2, std(T.zinc(ZINC, [w / 2, 1])), x, 3.3, 6.5, g);
    for (const px of [x - w / 2 + 0.2, x + w / 2 - 0.2]) { cyl(0.07, 0.07, 3.3, solid(0x6a5a46), px, 1.65, 5.6, g); wall(px - 0.2, 5.4, px + 0.2, 5.8); }
    box(w * 0.7, 0.6, 0.06, std(T.sign(name, 512, 96, '#f3ecd8', '#3a2a1e', '700 58px Georgia, serif')), x, 3.85, 7.57, g);
    box(1.4, 2.4, 0.06, std(doorTex()), x, 1.2, 7.57, g);
  };
  shop(-38, 9, [214, 196, 160], 'GROCERY'); shop(-14, 11, [196, 214, 200], 'DRY GOODS'); shop(10, 10, [222, 200, 176], 'HARDWARE');
  /* the fence round the Home, with the gate opposite the path to the Myers Ward */
  const post = std(T.concrete([1, 2], [188, 184, 172]));
  const mesh = new THREE.MeshStandardMaterial({ map: chain(), transparent: true, alphaTest: 0.4, ...DS, roughness: 0.6, metalness: 0.4 });
  for (let x = -48; x <= 48; x += 2.5) {
    if (Math.abs(x) < 2.4) continue;
    box(0.16, 1.9, 0.16, post, x, 0.95, -7, g);
    if (x + 2.5 <= 48 && !(x < 2.4 && x + 2.5 > -2.4)) { const p = plane(2.34, 1.6, mesh, x + 1.25, 0.95, -7, g); p.material.map.repeat.set(5, 3.4); }
  }
  wall(-48.3, -7.25, -2.2, -6.75); wall(2.2, -7.25, 48.3, -6.75);
  for (const sx of [-1, 1]) {   /* gate posts and the two gate leaves, open inward */
    box(0.32, 2.3, 0.32, post, sx * 2.1, 1.15, -7, g); wall(sx * 2.1 - 0.25, -7.25, sx * 2.1 + 0.25, -6.75);
    const leaf = grp(g, sx * 2.0, 0, -7.1); leaf.rotation.y = sx * 1.25;
    const lf = new THREE.MeshStandardMaterial({ map: chain(), transparent: true, alphaTest: 0.4, ...DS, roughness: 0.6, metalness: 0.4 });
    box(1.9, 0.06, 0.06, solid(0x5a5e5c, 0.5, 0.6), -sx * 0.95, 1.85, 0, leaf); box(1.9, 0.06, 0.06, solid(0x5a5e5c, 0.5, 0.6), -sx * 0.95, 0.12, 0, leaf);
    box(0.06, 1.8, 0.06, solid(0x5a5e5c, 0.5, 0.6), -sx * 1.88, 0.98, 0, leaf); box(0.06, 1.8, 0.06, solid(0x5a5e5c, 0.5, 0.6), -sx * 0.02, 0.98, 0, leaf);
    plane(1.8, 1.7, lf, -sx * 0.95, 0.98, 0, leaf);
  }
  /* the gatehouse just inside */
  box(2.2, 2.5, 2.2, std(T.plaster([226, 222, 206], [1, 1])), 4.6, 1.25, -9.6, g); box(2.6, 0.1, 2.6, std(T.zinc(ZINC, [1, 1])), 4.6, 2.55, -9.6, g);
  box(0.9, 0.8, 0.05, std(louvre()), 4.6, 1.5, -8.47, g); wall(3.4, -10.8, 5.8, -8.4);
  /* the path from the gate to the ward's steps */
  const path = plane(2.2, 9.2, std(T.concrete([1, 4], [190, 186, 174])), 0, 0.02, -12.2, g); path.rotation.x = -Math.PI / 2;
  /* the Myers Ward: an old two-storey wooden building with a two-storey veranda along the front (size and colours are an impression) */
  const L = 36, Z0 = -20.4, Z1 = -29.4, F1 = 0.6, F2 = 3.9, EAVE = 7.1, VZ = -18.0;
  const plank = (w, h) => std(T.plank(CREAM, 5, [w / 1.0, h / 1.0], true));
  box(L, F1, Z0 - Z1, std(T.concrete([12, 1], [120, 116, 108])), 0, F1 / 2, (Z0 + Z1) / 2, g);   /* foundation */
  box(L, EAVE - F1, 0.12, plank(L, EAVE - F1), 0, (F1 + EAVE) / 2, Z0 - 0.06, g);   /* front wall */
  box(L, EAVE - F1, 0.12, plank(L, EAVE - F1), 0, (F1 + EAVE) / 2, Z1 + 0.06, g);   /* back wall */
  for (const sx of [-1, 1]) box(0.12, EAVE - F1, Z0 - Z1, plank(Z0 - Z1, EAVE - F1), sx * (L / 2 - 0.06), (F1 + EAVE) / 2, (Z0 + Z1) / 2, g);
  box(L - 0.3, 0.1, Z0 - Z1 - 0.3, solid(0x6a5a46), 0, EAVE - 0.05, (Z0 + Z1) / 2, g);   /* ceiling under the roof, so the roof never looks hollow */
  wall(-L / 2 - 0.1, Z1 - 0.1, L / 2 + 0.1, Z0 + 0.05);
  const win = std(louvre(), 0.8), door = std(doorTex(), 0.8);
  for (let k = 0; k < 12; k++) {
    const x = -L / 2 + 1.5 + k * 3;
    for (const fy of [F1, F2]) {
      if ((k === 5 || k === 6) && fy === F1) continue;
      box(1.0, 1.5, 0.05, win, x, fy + 1.55, Z0 + 0.03, g);   /* front windows, on the outside of the wall */
      box(1.0, 1.5, 0.05, win, x, fy + 1.55, Z1 - 0.03, g);   /* back windows */
    }
  }
  box(1.8, 2.3, 0.05, door, 0, F1 + 1.15, Z0 + 0.03, g); box(1.8, 2.3, 0.05, door, 0, F2 + 1.15, Z0 + 0.03, g);
  for (const sx of [-1, 1]) for (const fy of [F1, F2]) for (const zz of [Z0 - 2.4, Z1 + 2.4]) box(0.05, 1.5, 1.0, win, sx * (L / 2 + 0.025), fy + 1.55, zz, g);
  /* the veranda: a raised floor, posts up to the roof, an upper floor and see-through balustrades */
  box(L, F1, Z0 - VZ, std(T.plank([150, 120, 90], 6, [L / 1.2, 2], true)), 0, F1 / 2, (Z0 + VZ) / 2, g);
  box(L, 0.16, Z0 - VZ, std(T.plank([150, 120, 90], 6, [L / 1.2, 2], true)), 0, F2 - 0.08, (Z0 + VZ) / 2, g);
  const postM = solid(0xeae2cc, 0.8), rail = solid(TRIM, 0.7), bal = new THREE.MeshStandardMaterial({ map: slats(), transparent: true, alphaTest: 0.4, ...DS, roughness: 0.8 });
  for (let k = 0; k <= 12; k++) { const x = -L / 2 + 0.08 + k * (L - 0.16) / 12; box(0.16, EAVE - F1, 0.16, postM, x, (F1 + EAVE) / 2, VZ - 0.1, g); }
  for (const fy of [F1, F2]) for (let k = 0; k < 12; k++) {
    const x0 = -L / 2 + 0.16 + k * (L - 0.16) / 12, x1 = x0 + (L - 0.16) / 12 - 0.16, cx = (x0 + x1) / 2, w = x1 - x0;
    if (fy === F1 && (k === 5 || k === 6) && Math.abs(cx) < 2.2) { continue; }
    box(w + 0.02, 0.08, 0.1, rail, cx, fy + 0.95, VZ - 0.1, g);
    const b = plane(w, 0.86, bal, cx, fy + 0.5, VZ - 0.1, g); b.material.map.repeat.set(w / 1.0, 1);
  }
  /* steps up to the veranda in the middle */
  for (let i = 0; i < 3; i++) box(3.0, (i + 1) * 0.2, 0.4, std(T.concrete([2, 1], [176, 172, 160])), 0, (i + 1) * 0.1, VZ + 1.0 - i * 0.4, g);
  /* veranda walls: you can only get on by the steps */
  wall(-L / 2 - 0.1, VZ - 0.25, -1.5, VZ + 0.05); wall(1.5, VZ - 0.25, L / 2 + 0.1, VZ + 0.05);
  /* the roof over the ward and its veranda */
  const roof = hipRoof(L + 1.0, Z0 - Z1 + 2.4 + 1.0, 2.3, new THREE.MeshStandardMaterial({ map: wrap(T.zinc(ZINC, [1, 1]), 1, 1), roughness: 0.7, metalness: 0.3, ...DS }));
  roof.position.set(0, EAVE, (VZ + Z1) / 2 - 0.05); g.add(roof);
  /* the children's building beside it: partly concrete (George Pinto, 2011), one storey (an impression) */
  box(18, 3.4, 9, std(T.plaster([214, 210, 196], [4, 1])), 34, 1.7, -20.5, g); wall(24.8, -25.2, 43.2, -15.8);
  const r2 = hipRoof(19, 10, 1.6, new THREE.MeshStandardMaterial({ map: wrap(T.zinc(ZINC, [1, 1]), 1, 1), roughness: 0.7, metalness: 0.3, ...DS })); r2.position.set(34, 3.4, -20.5); g.add(r2);
  for (let k = 0; k < 5; k++) box(1.0, 1.3, 0.05, win, 27 + k * 3.5, 1.9, -15.97, g);
  box(1.6, 2.3, 0.05, door, 40.5, 1.15, -15.97, g);
  /* shade trees in the yard */
  const leaf = solid(0x3f6a2e, 0.95), bark = solid(0x5a4632, 0.95);
  for (const [x, z, s] of [[-12, -11.5, 1], [13, -12, 1.15], [22, -10.5, 0.9], [-26, -12.5, 1.1], [-40, -14, 1]]) {
    cyl(0.22 * s, 0.3 * s, 3.2 * s, bark, x, 1.6 * s, z, g); wall(x - 0.35, z - 0.35, x + 0.35, z + 0.35);
    for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 * s, 1), leaf); c.position.set(x + (r() - 0.5) * 1.6 * s, 3.4 * s + r() * 1.2 * s, z + (r() - 0.5) * 1.6 * s); g.add(c); }
  }
  const groundAt = (x, z) => {
    if (Math.abs(x) < L / 2 && z < VZ && z > Z0) return F1;   /* on the veranda */
    if (Math.abs(x) < 1.5 && z <= VZ + 1.2 && z >= VZ) return F1 * (1 - (z - VZ) / 1.2);   /* the steps */
    return 0;
  };
  return { walls, bounds: { x0: -47.5, x1: 47.5, z0: -34, z1: 7.2 }, start: { x: -26, z: 4.6, yaw: 0 }, groundAt,
    spots: { iris: { x: -4.5, z: -19.2, ry: 0, ground: F1 }, gate: { x: 0, z: -7 }, busstop: { x: -26, z: 5.5 } } };
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
