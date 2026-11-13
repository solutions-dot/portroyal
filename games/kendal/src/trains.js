/* games/kendal/src/trains.js: track, locomotives, carriages and wagons, built from boxes and cylinders.
   Trains run along x and face -x (their front is toward negative x). Every vehicle sits with its floor at y = 0,
   which is also the height of a platform, so rail tops are at y = -1.1 (see RAIL_TOP). Colours and shapes are our best guess:
   we have not found photographs to copy (see docs/games/kendal.md). */
import * as THREE from 'three';
import { T, cv, grain, std, solid, mesh, box, cyl, plane, grp, rng } from './gfx.js';

export const RAIL_TOP = -1.1;      /* height of the top of the rails under a vehicle whose floor is at y = 0 */
const GAUGE = 1.435;               /* standard gauge, in metres */
const M = {
  iron: solid(0x2b2d31, 0.55, 0.35), black: solid(0x16171a, 0.7, 0.1), steel: solid(0x8c8f93, 0.4, 0.65), brass: solid(0xc29a45, 0.4, 0.55), rust: solid(0x6a3f2a, 0.9),
  wheel: solid(0x202226, 0.55, 0.4), sleeper: solid(0x3a2c20, 0.95), glass: solid(0x1c2a35, 0.2, 0.2),
  cream: solid(0xe8dcb8, 0.8), dgreen: solid(0x1f4d2e, 0.6, 0.15), loco57: solid(0x24392f, 0.55, 0.2), stripe: solid(0xe4d6a8, 0.7), roof57: solid(0xb6b3a6, 0.85),
  wood: solid(0x6b4a30, 0.9), woodDark: solid(0x3a2a1d, 0.95), maroon: solid(0x6e2c24, 0.8), headlamp: new THREE.MeshBasicMaterial({ color: 0xfff1c0 }),
};
export { M as TM };

/* ---------- track ---------- */
export function rails(len, { bedW = 3.6, bedH = 0.3, sleepers = true } = {}) {   /* along x, centred; the ground it sits on is y = 0, rail tops are at y = 0.59 */
  const g = grp(); const bt = T.ballast().clone(); bt.needsUpdate = true; bt.repeat.set(len / 3, 1);
  box(len, bedH, bedW, std(bt, 1), 0, bedH / 2, 0, g);
  if (sleepers) { const n = Math.floor(len / 0.72), im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.24, 0.14, 2.7), M.sleeper, n), m4 = new THREE.Matrix4(); for (let i = 0; i < n; i++) { m4.setPosition(-len / 2 + 0.4 + i * 0.72, bedH + 0.07, 0); im.setMatrixAt(i, m4); } g.add(im); }
  for (const s of [-1, 1]) { box(len, 0.15, 0.07, M.steel, 0, bedH + 0.215, s * GAUGE / 2, g); box(len, 0.06, 0.2, M.rust, 0, bedH + 0.15, s * GAUGE / 2, g); }
  return g;
}
export function railsCurve(R, a0, a1, segs = 18, opts) {   /* a gentle bend, built from straight pieces, centre of the curve at (0, 0, R) */
  const g = grp(); const L = Math.abs(a1 - a0) * R / segs;
  for (let i = 0; i < segs; i++) { const a = a0 + (a1 - a0) * (i + 0.5) / segs, piece = rails(L * 1.04, opts); piece.position.set(Math.sin(a) * R, 0, R - Math.cos(a) * R); piece.rotation.y = -a; g.add(piece); }
  return g;
}

/* ---------- wheels ---------- */
export function wheel(r, spokes = false, thick = 0.13) {   /* its axle runs along z; spin it by turning rotation.z */
  const g = grp(); const t = cyl(r, r, thick, M.wheel, 0, 0, 0, g, 22); t.rotation.x = Math.PI / 2;
  const hub = cyl(r * 0.22, r * 0.22, thick + 0.06, M.brass, 0, 0, 0, g, 10); hub.rotation.x = Math.PI / 2;
  const fl = cyl(r * 1.06, r * 1.06, 0.03, M.iron, 0, 0, thick / 2 - 0.02, g, 22); fl.rotation.x = Math.PI / 2;
  if (spokes) for (let i = 0; i < 4; i++) { const s = box(r * 1.8, 0.07, thick + 0.04, M.iron, 0, 0, 0, g); s.rotation.z = i * Math.PI / 4; }
  else box(r * 1.7, 0.05, thick + 0.02, M.iron, 0, 0, 0, g);
  return g;
}
function wheelset(r, x, y, parent, wheels, spokes) {   /* a pair of wheels on an axle across the track, at x */
  for (const s of [-1, 1]) { const w = wheel(r, spokes); w.position.set(x, y, s * (GAUGE / 2 + 0.02)); parent.add(w); if (wheels) wheels.push({ w, r }); }
  const ax = cyl(0.07, 0.07, GAUGE + 0.1, M.iron, x, y, 0, parent, 8); ax.rotation.x = Math.PI / 2;
}
export function spin(train, dx) { for (const o of train.userData.wheels || []) o.w.rotation.z -= dx / o.r; }   /* roll the wheels as the train moves dx metres toward -x */

/* ---------- a wooden coach of the 1950s: maroon boards, a row of windows, an arched roof, open end platforms ---------- */
function coachSideTex(n, label) {
  return cv(1024, 256, (x, w, h) => {
    x.fillStyle = '#6a2b24'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 14) { x.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.08})`; x.fillRect(i, 0, 2, h); }
    x.fillStyle = '#e1d2a2'; x.fillRect(0, 22, w, 8); x.fillRect(0, h - 40, w, 8);
    for (let i = 0; i < 9; i++) { const cx = 90 + i * 98; x.fillStyle = '#e1d2a2'; x.fillRect(cx - 44, 48, 88, 118); x.fillStyle = '#1d2a34'; x.fillRect(cx - 38, 54, 76, 106); x.fillStyle = 'rgba(255,255,255,0.1)'; x.fillRect(cx - 32, 58, 20, 98); x.fillStyle = '#e1d2a2'; x.fillRect(cx - 2, 54, 4, 106); }
    x.fillStyle = '#e8dcb8'; x.font = '700 22px Georgia, serif'; x.textAlign = 'center'; x.fillText('J.G.R.', 512, h - 12); x.font = '700 20px Georgia, serif'; x.textAlign = 'left'; x.fillText(String(label), 14, h - 12);
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(30,12,8,${0.04 + Math.random() * 0.08})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 30, 4 + Math.random() * 16, 0, 0, 7); x.fill(); } grain(x, w, h, 10);
  });
}
export function woodCoach(n = 1, L = 11, W = 2.7) {
  const g = grp(); g.userData.wheels = []; const side = std(coachSideTex(n, n), 0.85), end = solid(0x5a241d, 0.9);
  const body = new THREE.Mesh(new THREE.BoxGeometry(L, 2.55, W), [end, end, M.roof57, solid(0x2a2220), side, side]); body.position.set(0, 1.175, 0); g.add(body);   /* faces: +x -x +y -y +z -z */
  body.material[5] = side.clone(); body.material[5].map = body.material[4].map;
  const roofG = new THREE.CylinderGeometry(W / 2 + 0.06, W / 2 + 0.06, L + 0.3, 22, 1, true, 0, Math.PI); roofG.rotateZ(Math.PI / 2); const roof = new THREE.Mesh(roofG, new THREE.MeshStandardMaterial({ color: 0xbdb9aa, roughness: 0.85, side: THREE.DoubleSide })); roof.scale.set(1, 0.3, 1); roof.position.set(0, 2.45, 0); g.add(roof);
  box(L + 0.9, 0.3, 1.5, M.black, 0, -0.5, 0, g);   /* the frame under the floor */
  for (const s of [-1, 1]) { const bg = grp(g, s * (L / 2 - 2.1), 0, 0); box(3.0, 0.2, 1.7, M.iron, 0, -0.7, 0, bg); wheelset(0.45, -0.95, -0.65, bg, g.userData.wheels); wheelset(0.45, 0.95, -0.65, bg, g.userData.wheels); }
  for (const s of [-1, 1]) {   /* open end platforms with a rail, and a step each side */
    const ex = s * (L / 2 + 0.5); box(1.0, 0.12, 2.3, M.woodDark, ex, -0.14, 0, g);
    for (const z of [-1.05, 1.05]) { box(0.06, 0.95, 0.06, M.iron, s * (L / 2 + 0.95), 0.4, z, g); box(1.0, 0.05, 0.05, M.iron, ex, 0.88, z, g); }
    box(0.05, 0.05, 2.1, M.iron, s * (L / 2 + 0.95), 0.88, 0, g); box(0.05, 0.05, 2.1, M.iron, s * (L / 2 + 0.95), 0.45, 0, g);
    for (const z of [-1.2, 1.2]) box(0.4, 0.05, 0.3, M.woodDark, ex - s * 0.1, -0.62, z, g);
    box(0.5, 0.3, 0.3, M.iron, s * (L / 2 + 1.15), -0.4, 0.5, g); box(0.5, 0.3, 0.3, M.iron, s * (L / 2 + 1.15), -0.4, -0.5, g);   /* buffers */
    box(0.08, 2.0, 0.9, solid(0x44190f, 0.9), s * (L / 2 + 0.01), 1.0, 0, g);   /* the end door */
  }
  coachDetail(g, L, W);
  return g;
}

/* ---------- a diesel engine of the 1950s: a long green hood, a tall cab, a cream stripe, a head lamp ---------- */
export function dieselLoco(L = 13.4) {
  const g = grp(); g.userData.wheels = []; const W = 2.9;
  box(L, 0.55, 2.6, M.black, 0, -0.3, 0, g);
  const hood = box(L * 0.58, 2.3, W - 0.2, M.loco57, -L * 0.2, 1.35, 0, g);
  const cab = box(L * 0.27, 3.3, W, M.loco57, L * 0.31, 1.7, 0, g);
  box(L * 0.27 + 0.3, 0.14, W + 0.3, M.roof57, L * 0.31, 3.4, 0, g);
  const wt = new THREE.MeshBasicMaterial({ color: 0x15202a }); for (const s of [-1, 1]) { box(L * 0.17, 0.95, 0.04, wt, L * 0.31, 2.4, s * (W / 2 + 0.02), g); }
  box(0.04, 0.95, 2.0, wt, L * 0.31 + L * 0.135 + 0.02, 2.4, 0, g); box(0.04, 0.95, 2.0, wt, L * 0.31 - L * 0.135 - 0.02, 2.4, 0, g);
  for (const s of [-1, 1]) { box(L * 0.95, 0.24, 0.04, M.stripe, 0, 1.1, s * (W / 2 - 0.08), g); for (let i = 0; i < 5; i++) box(0.9, 1.0, 0.04, solid(0x1a2a22, 0.6), -L * 0.2 - 2.3 + i * 1.15, 1.5, s * (W / 2 - 0.08), g); }
  for (let i = 0; i < 2; i++) { cyl(0.75, 0.75, 0.25, M.black, -L * 0.28 + i * 2.3, 2.62, 0, g, 18); }
  cyl(0.2, 0.2, 0.6, M.steel, -L * 0.12, 2.75, 0.5, g, 10);
  const lamp = cyl(0.26, 0.26, 0.2, M.headlamp, -L / 2 - 0.05, 1.9, 0, g, 14); lamp.rotation.z = Math.PI / 2; g.userData.headlamp = lamp;
  box(0.2, 0.5, 2.6, M.stripe, -L / 2, 0.7, 0, g); box(0.9, 0.3, 0.3, M.iron, -L / 2 - 0.4, -0.3, 0.6, g); box(0.9, 0.3, 0.3, M.iron, -L / 2 - 0.4, -0.3, -0.6, g);
  box(0.9, 0.3, 0.3, M.iron, L / 2 + 0.4, -0.3, 0.6, g); box(0.9, 0.3, 0.3, M.iron, L / 2 + 0.4, -0.3, -0.6, g);
  for (const s of [-1, 1]) { const bg = grp(g, s * L * 0.3, 0, 0); box(3.6, 0.25, 1.9, M.iron, 0, -0.75, 0, bg); for (const dx of [-1.4, 0, 1.4]) wheelset(0.5, dx, -0.6, bg, g.userData.wheels); }
  dieselDetail(g, L, W);
  return g;
}

/* ---------- steam engines: 'early' is 1845 (the Projector); 'late' is the 1890s ---------- */
export function steamLoco(kind = 'early') {
  const g = grp(); g.userData.wheels = []; const early = kind === 'early';
  const bc = early ? 0x1f4d2e : 0x17181a, br = early ? 0.5 : 0.66, bl = early ? 3.4 : 4.4, by = early ? 1.62 : 1.9, bx = early ? -0.5 : -0.9;
  const boiler = cyl(br, br, bl, solid(bc, 0.45, 0.25), bx, by, 0, g, 22); boiler.rotation.z = Math.PI / 2;
  for (const dx of [-1.0, 0.5, 1.6]) { const band = cyl(br + 0.025, br + 0.025, 0.1, M.brass, bx + dx * (bl / 3.4) * 0.9, by, 0, g, 22); band.rotation.z = Math.PI / 2; }
  const sbx = bx - bl / 2 + 0.3; const smoke = cyl(br + 0.06, br + 0.06, 0.7, M.black, sbx, by, 0, g, 22); smoke.rotation.z = Math.PI / 2;
  const chh = early ? 1.5 : 1.0; cyl(early ? 0.14 : 0.2, early ? 0.15 : 0.2, chh, M.black, sbx, by + br + chh / 2 - 0.1, 0, g, 12); if (early) cyl(0.26, 0.15, 0.3, M.brass, sbx, by + br + chh - 0.12, 0, g, 12); else cyl(0.3, 0.2, 0.28, M.black, sbx, by + br + chh - 0.1, 0, g, 12);
  const chim = new THREE.Object3D(); chim.position.set(sbx, by + br + chh + 0.1, 0); g.add(chim); g.userData.chimney = chim;
  mesh(new THREE.SphereGeometry(0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.brass, bx + 0.3, by + br - 0.02, 0, g);
  if (early) { box(1.3, 1.5, 1.3, solid(0x2a4a33, 0.5, 0.2), bx + bl / 2 + 0.3, by + 0.05, 0, g); box(1.5, 0.08, 1.5, M.brass, bx + bl / 2 + 0.3, by + 0.82, 0, g); box(2.4, 0.1, 1.5, M.woodDark, bx + bl / 2 + 0.7, 0.95, 0, g);
    for (const z of [-0.65, 0.65]) box(0.05, 1.0, 0.05, M.iron, bx + bl / 2 + 1.85, 1.45, z, g); box(0.06, 0.06, 1.4, M.iron, bx + bl / 2 + 1.85, 1.95, 0, g); }
  else { box(1.9, 2.3, 1.9, solid(0x1d1e22, 0.7), bx + bl / 2 + 0.8, by + 0.4, 0, g); box(2.3, 0.1, 2.4, M.black, bx + bl / 2 + 0.8, by + 1.6, 0, g); const wt = new THREE.MeshBasicMaterial({ color: 0x1a2630 }); for (const s of [-1, 1]) box(0.9, 0.7, 0.03, wt, bx + bl / 2 + 0.8, by + 0.7, s * 0.96, g); box(2.4, 0.1, 2.0, M.woodDark, bx + bl / 2 + 1.0, 0.95, 0, g); }
  box(early ? 5.4 : 7.0, 0.2, 1.4, M.black, early ? 0.2 : 0.4, 0.78, 0, g);
  for (const s of [-1, 1]) { box(0.7, 0.45, 0.4, M.iron, sbx + 0.5, 0.95, s * 0.75, g); box(1.6, 0.06, 0.06, M.steel, early ? 0.4 : 0.2, 0.9, s * (GAUGE / 2 + 0.2), g); }
  const R = early ? 0.9 : 0.78, ws = g.userData.wheels;
  if (early) { wheelset(0.5, -1.7, RAIL_TOP + 0.5, g, ws, true); wheelset(R, 0.9, RAIL_TOP + R, g, ws, true); wheelset(0.5, 2.3, RAIL_TOP + 0.5, g, ws, true); }
  else { for (const dx of [-2.4, -1.6]) wheelset(0.5, dx, RAIL_TOP + 0.5, g, ws, true); for (const dx of [0.3, 1.5, 2.7]) wheelset(R, dx, RAIL_TOP + R, g, ws, true); }
  box(0.3, 0.5, 1.9, M.black, bx - bl / 2 - 0.45, 0.8, 0, g); for (const z of [-0.65, 0.65]) cyl(0.1, 0.1, 0.3, M.iron, bx - bl / 2 - 0.65, 0.8, z, g, 8).rotation.z = Math.PI / 2;
  const lamp = cyl(0.17, 0.17, 0.2, M.headlamp, sbx - 0.4, by + br + 0.1, 0, g, 10); lamp.rotation.z = Math.PI / 2;
  /* the tender: a small truck of coal or wood behind the engine */
  const tx = early ? 3.9 : 5.2; box(early ? 2.4 : 3.0, 0.9, 1.6, solid(early ? 0x1f4d2e : 0x1d1e22, 0.6), tx, 1.45, 0, g); box(early ? 2.2 : 2.8, 0.7, 1.4, solid(0x1c1b1b, 1), tx, 1.9, 0, g);
  wheelset(0.5, tx - 0.8, RAIL_TOP + 0.5, g, g.userData.wheels, true); wheelset(0.5, tx + 0.8, RAIL_TOP + 0.5, g, g.userData.wheels, true); box(early ? 2.4 : 3.0, 0.2, 1.4, M.black, tx, 0.78, 0, g);
  steamDetail(g, early, { bx, by, br, bl, sbx, tx, chh });
  return g;
}

/* ---------- 1845 carriages: a closed first-class coach, and an open third-class one with benches ---------- */
export function carriage1845(kind = 'third', L = 5.2, W = 2.4, layout = 'rows') {
  const g = grp(); g.userData.wheels = [];
  if (kind === 'first') {
    const tex = cv(512, 192, (x, w, h) => { x.fillStyle = '#c9a23a'; x.fillRect(0, 0, w, h); x.fillStyle = '#243a62'; x.fillRect(0, h * 0.45, w, h * 0.55); for (let i = 0; i < 3; i++) { const cx = 90 + i * 165; x.fillStyle = '#f2e6bd'; x.fillRect(cx - 52, 18, 104, 66); x.fillStyle = '#26394d'; x.fillRect(cx - 46, 24, 92, 54); x.fillStyle = 'rgba(255,255,255,0.14)'; x.fillRect(cx - 40, 28, 18, 46); }
      x.fillStyle = '#f2e6bd'; x.font = '700 22px Georgia, serif'; x.textAlign = 'center'; x.fillText('FIRST CLASS', w / 2, h - 28); grain(x, w, h, 12); });
    const side = std(tex, 0.8), cap = solid(0x24324a, 0.8); const body = new THREE.Mesh(new THREE.BoxGeometry(L, 1.9, W), [cap, cap, cap, cap, side, side]); body.position.y = 1.1; g.add(body); box(L + 0.2, 0.12, W + 0.2, solid(0x2b2b30, 0.8), 0, 2.1, 0, g);
  } else {
    box(L, 0.14, W, M.woodDark, 0, 0.1, 0, g); for (const s of [-1, 1]) { box(L, 0.55, 0.08, M.wood, 0, 0.5, s * (W / 2 - 0.04), g); } box(0.08, 0.55, W, M.wood, -L / 2 + 0.04, 0.5, 0, g); box(0.08, 0.55, W, M.wood, L / 2 - 0.04, 0.5, 0, g);
    if (layout === 'sides') for (const s of [-1, 1]) { box(L - 1.0, 0.06, 0.45, M.wood, 0, 0.45, s * (W / 2 - 0.32), g); box(L - 1.0, 0.45, 0.06, M.wood, 0, 0.75, s * (W / 2 - 0.08), g); for (const x of [-L / 2 + 0.8, L / 2 - 0.8]) box(0.08, 0.35, 0.4, M.woodDark, x, 0.27, s * (W / 2 - 0.32), g); }
    else for (let i = 0; i < 3; i++) { box(0.5, 0.06, W - 0.4, M.wood, -L / 2 + 1.0 + i * 1.5, 0.45, 0, g); box(0.06, 0.5, W - 0.4, M.wood, -L / 2 + 1.25 + i * 1.5, 0.75, 0, g); }
    for (const x0 of [-L / 2 + 0.05, L / 2 - 0.05]) for (const z of [-W / 2 + 0.05, W / 2 - 0.05]) box(0.07, 1.9, 0.07, M.woodDark, x0, 1.0, z, g);
  }
  box(L + 0.6, 0.3, 1.3, M.black, 0, -0.35, 0, g); box(0.5, 0.25, 0.3, M.iron, L / 2 + 0.4, -0.2, 0.4, g); box(0.5, 0.25, 0.3, M.iron, -L / 2 - 0.4, -0.2, 0.4, g); box(0.5, 0.25, 0.3, M.iron, L / 2 + 0.4, -0.2, -0.4, g); box(0.5, 0.25, 0.3, M.iron, -L / 2 - 0.4, -0.2, -0.4, g);
  for (const dx of [-L / 3, L / 3]) wheelset(0.45, dx, -0.65, g, g.userData.wheels, true);
  return g;
}

/* ---------- a goods wagon for bananas: low slatted sides ---------- */
export function wagon(L = 6.2, W = 2.5) {
  const g = grp(); g.userData.wheels = []; box(L, 0.16, W, M.woodDark, 0, 0.1, 0, g);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) box(L, 0.2, 0.06, M.wood, 0, 0.3 + i * 0.25, s * (W / 2 - 0.03), g);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) box(0.06, 0.2, W, M.wood, s * (L / 2 - 0.03), 0.3 + i * 0.25, 0, g);
  box(L + 0.6, 0.3, 1.3, M.black, 0, -0.35, 0, g); for (const dx of [-L / 3, L / 3]) wheelset(0.45, dx, -0.65, g, g.userData.wheels, true);
  for (const x of [-L / 2 - 0.3, L / 2 + 0.3]) for (const z of [-0.5, 0.5]) box(0.5, 0.25, 0.3, M.iron, x, -0.2, z, g);
  return g;
}

/* ---------- a platform edge with a canopy; the slab's top is y = 0 ---------- */
export function platform(x0, x1, z0, z1, { canopy = true, roofRgb = [128, 134, 130], depth = 1.7 } = {}) {
  const g = grp(), L = x1 - x0, W = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const ct = T.concrete().clone(); ct.needsUpdate = true; ct.repeat.set(L / 3, W / 3);
  box(L, depth, W, std(ct, 0.95), cx, -depth / 2, cz, g);
  box(L, 0.02, 0.3, solid(0xe2c34a, 0.8), cx, 0.012, z0 + 0.25, g);   /* the yellow edge */
  if (canopy) {
    const zt = T.zinc(roofRgb).clone(); zt.needsUpdate = true; zt.repeat.set(L / 3, 1);
    const roof = box(L, 0.1, W * 0.8, std(zt, 0.8), cx, 3.7, cz + W * 0.08, g); roof.rotation.x = 0.06;
    for (let x = x0 + 3; x < x1; x += 8) { box(0.22, 3.7, 0.22, solid(0x2f3a34, 0.8), x, 1.85, z0 + 1.2, g); box(0.2, 0.2, W * 0.8, solid(0x2f3a34, 0.8), x, 3.55, cz + W * 0.08, g); }
  }
  return g;
}

/* ---------- a puff of steam or smoke: pooled sprites, grown and faded by tick() ---------- */
export function makeSmoke(scene, n = 36) {
  const pool = [], tex = T.puff(); for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 })); s.visible = false; scene.add(s); pool.push({ s, age: 1, life: 1, v: new THREE.Vector3() }); }
  let i = 0;
  return {
    emit(pos, vel, { life = 3, size = 1.2, grow = 3.2, color = 0xe9e9e6, opacity = 0.55 } = {}) { const p = pool[i++ % n]; p.age = 0; p.life = life; p.size = size; p.grow = grow; p.op = opacity; p.s.position.copy(pos); p.v.copy(vel); p.s.material.color.set(color); p.s.visible = true; },
    tick(dt) { for (const p of pool) { if (p.age >= p.life) { p.s.visible = false; continue; } p.age += dt; const k = p.age / p.life; p.s.position.addScaledVector(p.v, dt); const sz = p.size + p.grow * k; p.s.scale.set(sz, sz, sz); p.s.material.opacity = p.op * Math.min(1, p.age * 4) * (1 - k); } },
    clear() { for (const p of pool) { p.age = p.life; p.s.visible = false; } },
  };
}

/* ---------- finer detail: rails to hold, pipes, vents, lamps, rods and the little things that make a vehicle look used ---------- */
function hrail(g, x0, x1, y, z, m = M.steel, post = 1.6) { const c = cyl(0.025, 0.025, Math.abs(x1 - x0), m, (x0 + x1) / 2, y, z, g, 6); c.rotation.z = Math.PI / 2; for (let x = Math.min(x0, x1); x <= Math.max(x0, x1) + 0.01; x += post) box(0.03, 0.14, 0.03, m, x, y - 0.07, z, g); }
function coachDetail(g, L, W) {
  for (const x of [-L * 0.3, 0, L * 0.3]) { const v = cyl(0.14, 0.17, 0.2, M.iron, x, 2.62, 0.2, g, 8); box(0.34, 0.04, 0.34, M.black, x, 2.72, 0.2, g); }   /* roof ventilators */
  for (const s of [-1, 1]) { for (const e of [-1, 1]) { box(0.05, 1.6, 0.05, M.steel, e * (L / 2 - 0.35), 1.05, s * (W / 2 + 0.05), g); box(0.07, 0.3, 0.12, M.brass, e * (L / 2 - 0.55), 0.9, s * (W / 2 + 0.04), g); }
    hrail(g, -L / 2 + 0.5, L / 2 - 0.5, 2.42, s * (W / 2 + 0.03), M.steel, 2.8);   /* the rain gutter along the roof edge */
    for (const e of [-1, 1]) { box(0.5, 0.05, 0.22, M.woodDark, e * (L / 2 - 0.4), -0.42, s * (W / 2 + 0.1), g); box(0.5, 0.05, 0.22, M.woodDark, e * (L / 2 - 0.4), -0.74, s * (W / 2 + 0.12), g); }   /* the steps */ }
  for (const z of [-0.5, 0.5]) { const t = cyl(0.02, 0.02, L - 2.4, M.iron, 0, -0.36, z, g, 5); t.rotation.z = Math.PI / 2; }   /* truss rods under the floor */
  cyl(0.2, 0.2, 0.9, M.iron, 1.2, -0.65, 0.35, g, 10).rotation.x = Math.PI / 2; box(0.7, 0.3, 0.5, M.iron, -1.6, -0.62, -0.5, g);   /* a brake cylinder and a battery box */
  for (const e of [-1, 1]) { const w = cyl(0.17, 0.17, 0.06, M.iron, e * (L / 2 + 0.95), 0.9, 0.7, g, 12); w.rotation.x = Math.PI / 2; cyl(0.02, 0.02, 0.9, M.iron, e * (L / 2 + 0.95), 0.45, 0.7, g, 5); }   /* a hand brake wheel on each end platform */
  for (const e of [-1, 1]) { box(0.14, 0.14, 0.14, M.headlamp, e * (L / 2 + 0.3), 2.2, 0.8, g); }   /* a lamp on each end */
}
function dieselDetail(g, L, W) {
  for (const s of [-1, 1]) { hrail(g, -L / 2 + 0.6, L * 0.17, 1.55, s * (W / 2 + 0.2), M.steel, 2.2); hrail(g, L * 0.17, L * 0.45, 2.6, s * (W / 2 + 0.06), M.steel, 1.4);
    for (let i = 0; i < 6; i++) box(0.9, 0.04, 0.04, solid(0x161a18, 0.7), -L * 0.28 + i * 1.2, 2.44, s * (W / 2 - 0.1), g);
    box(1.4, 0.5, 0.5, M.black, -L * 0.1, -0.2, s * 1.35, g); box(0.9, 0.35, 0.5, M.iron, L * 0.2, -0.2, s * 1.35, g);   /* fuel tank and batteries */
    const r = box(0.12, 0.12, 0.05, solid(0xd22a2a, 0.5), -L / 2 - 0.02, 1.2, s * 0.9, g); }
  cyl(0.25, 0.3, 0.7, M.black, L * 0.02, 2.95, 0.4, g, 10); const horn = cyl(0.11, 0.18, 0.5, M.brass, L * 0.1, 2.75, -0.4, g, 8); horn.rotation.x = 0.3; horn.rotation.z = 0.2;
  const np = new THREE.MeshBasicMaterial({ map: T_num() }); plane(0.9, 0.35, np, 0, 1.6, -L / 2 - 0.12, g).rotation.y = Math.PI;
  for (const s of [-1, 1]) { box(0.7, 0.6, 0.03, solid(0x19231f, 0.6), L * 0.31, 1.4, s * (W / 2 + 0.01), g); box(0.1, 0.05, 0.22, M.iron, L * 0.31 + 0.3, 1.5, s * (W / 2 + 0.1), g); }
  for (const e of [-1, 1]) for (const z of [-0.5, 0.5]) { const h = cyl(0.04, 0.04, 0.4, M.black, e * (L / 2 + 0.25), 0.4, z, g, 5); }
}
let _num; function T_num() { return _num || (_num = cv(128, 48, (x, w, h) => { x.fillStyle = '#16202a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#e8dcb0'; x.lineWidth = 3; x.strokeRect(3, 3, w - 6, h - 6); x.fillStyle = '#e8dcb0'; x.font = '700 28px Georgia, serif'; x.textAlign = 'center'; x.fillText('J.G.R. 12', w / 2, 34); })); }
function steamDetail(g, early, d) {
  const { bx, by, br, bl, sbx, tx } = d;
  const sd = cyl(br * 0.92, br * 0.92, 0.06, M.iron, sbx - 0.37, by, 0, g, 22); sd.rotation.z = Math.PI / 2; const ring = cyl(br * 0.95, br * 0.95, 0.04, M.brass, sbx - 0.4, by, 0, g, 22); ring.rotation.z = Math.PI / 2; box(0.05, 0.3, 0.05, M.brass, sbx - 0.42, by, 0, g);
  for (const s of [-1, 1]) { hrail(g, bx - bl / 2 + 0.4, bx + bl / 2 - 0.2, by + br * 0.45, s * (br + 0.06), M.brass, 1.0); const pipe = cyl(0.05, 0.05, bl * 0.7, M.iron, bx, by - br * 0.45, s * (br + 0.05), g, 6); pipe.rotation.z = Math.PI / 2;
    box(1.0, 0.5, 0.45, M.iron, sbx + 0.5, 0.95, s * 0.8, g); const pr = cyl(0.04, 0.04, 1.1, M.steel, sbx - 0.1, 0.95, s * 0.8, g, 6); pr.rotation.z = Math.PI / 2;   /* cylinders and piston rods */
    box(early ? 2.0 : 3.2, 0.07, 0.07, M.steel, early ? 0.9 : 1.5, early ? -0.2 : -0.3, s * (GAUGE / 2 + 0.25), g);   /* the side rods */
    box(0.4, 0.04, 0.3, M.woodDark, bx + bl / 2 - 0.4, 0.55, s * 0.95, g); box(0.4, 0.04, 0.3, M.woodDark, bx + bl / 2 - 0.4, 0.2, s * 0.98, g); }   /* footsteps */
  cyl(0.05, 0.07, 0.35, M.brass, bx + 0.3, by + br + 0.45, 0, g, 8); for (const dx of [-0.2, 0.2]) cyl(0.04, 0.05, 0.2, M.brass, bx + bl / 2 + 0.1 + dx, by + br + 0.15, 0, g, 6);   /* whistle and safety valves */
  for (let i = 0; i < 9; i++) mesh(new THREE.DodecahedronGeometry(0.3 + (i % 3) * 0.05, 0), solid(0x141414, 1), tx - 0.8 + (i % 4) * 0.5, early ? 2.35 + (i % 2) * 0.1 : 2.45 + (i % 2) * 0.1, -0.4 + Math.floor(i / 4) * 0.4 + (i % 3) * 0.05, g);   /* coal in the tender */
  box(0.5, 0.2, 0.3, M.woodDark, tx + 0.8, early ? 2.1 : 2.2, 0.5, g); cyl(0.14, 0.14, 0.06, M.brass, tx - 0.5, early ? 2.12 : 2.22, -0.5, g, 10);
  if (!early) { for (const s of [-1, 1]) { box(1.2, 0.08, 0.04, M.brass, bx + bl / 2 + 0.8, by + 1.15, s * 0.97, g); box(0.1, 0.8, 0.04, M.steel, bx + bl / 2 + 0.3, by + 0.7, s * 0.97, g); } const dome = mesh(new THREE.SphereGeometry(0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.black, bx - 0.8, by + br, 0, g); }
}
