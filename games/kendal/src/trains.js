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
    for (const z of [-1.2, 1.2]) { box(0.4, 0.05, 0.3, M.woodDark, ex - s * 0.1, -0.62, z, g); box(0.05, 0.5, 0.05, M.iron, ex - s * 0.1, -0.38, z * 0.97, g); }   /* a step under each end of the platform, on an iron strap */
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

/* ---------- steam engines: 'early' is the 1845 Projector (a 2-2-2 with one big pair of driving wheels, a brass dome and a tall chimney);
   'late' is a 4-4-0 of the 1890s with a cab. Every height is measured from the rails (H), so the wheels, frame, boiler and footplate line up. ---------- */
const H = (h) => RAIL_TOP + h;
export function steamLoco(kind = 'early') {
  const g = grp(); g.userData.wheels = []; const early = kind === 'early', W = g.userData.wheels;
  const green = early ? solid(0x1f4d2e, 0.45, 0.2) : solid(0x1b1c20, 0.6, 0.25), casing = early ? solid(0x2a5a38, 0.5, 0.2) : solid(0x202126, 0.65, 0.2), line = solid(0xb08a3a, 0.5, 0.4);
  const br = early ? 0.5 : 0.62, by = H(early ? 1.82 : 2.05), bx0 = early ? -2.3 : -3.0, bx1 = early ? 0.9 : 1.0;   /* boiler from bx0 to bx1, centre height by */
  /* the frame, buffer beam and coupling */
  box(early ? 6.2 : 7.4, 0.16, 1.2, M.black, early ? 0.2 : 0.2, H(1.0), 0, g); box(0.22, 0.42, 1.9, M.black, early ? -3.2 : -3.7, H(1.0), 0, g);
  for (const z of [-0.7, 0.7]) { const bf = cyl(0.09, 0.12, 0.38, M.iron, early ? -3.4 : -3.9, H(1.0), z, g, 8); bf.rotation.z = Math.PI / 2; mesh(new THREE.SphereGeometry(0.12, 8, 6), M.steel, early ? -3.6 : -4.1, H(1.0), z, g); }
  /* the boiler, its bands, the smokebox, a door on its front, the chimney, dome and whistle */
  const boiler = cyl(br, br, bx1 - bx0, green, (bx0 + bx1) / 2, by, 0, g, 24); boiler.rotation.z = Math.PI / 2;
  for (let i = 1; i <= 3; i++) { const bd = cyl(br + 0.022, br + 0.022, 0.09, line, bx0 + (bx1 - bx0) * i / 4, by, 0, g, 24); bd.rotation.z = Math.PI / 2; }
  const sbx = bx0 + 0.3, sb = cyl(br + 0.05, br + 0.05, 0.62, M.black, sbx, by, 0, g, 24); sb.rotation.z = Math.PI / 2; const door = cyl(br * 0.9, br * 0.9, 0.05, M.iron, bx0 - 0.02, by, 0, g, 24); door.rotation.z = Math.PI / 2; const dr = cyl(br * 0.93, br * 0.93, 0.04, line, bx0 - 0.045, by, 0, g, 24); dr.rotation.z = Math.PI / 2; box(0.04, 0.34, 0.06, line, bx0 - 0.07, by, 0, g);
  const chh = early ? 1.55 : 1.15; cyl(early ? 0.13 : 0.19, early ? 0.15 : 0.19, chh, M.black, sbx, by + br + chh / 2 - 0.1, 0, g, 12); cyl(early ? 0.27 : 0.3, early ? 0.15 : 0.2, 0.3, early ? M.brass : M.black, sbx, by + br + chh - 0.05, 0, g, 12);
  const chim = new THREE.Object3D(); chim.position.set(sbx, by + br + chh + 0.12, 0); g.add(chim); g.userData.chimney = chim;
  mesh(new THREE.SphereGeometry(early ? 0.3 : 0.36, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.brass, bx1 - 0.7, by + br - 0.05, 0, g); cyl(0.05, 0.07, 0.34, M.brass, bx1 - 0.7, by + br + 0.45, 0, g, 8);   /* the dome, and the whistle on it */
  for (const dx of [0.0, 0.3]) cyl(0.04, 0.05, 0.22, M.brass, bx1 - 1.2 + dx, by + br + 0.1, 0, g, 6);   /* safety valves */
  if (!early) { mesh(new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.black, bx0 + 1.4, by + br - 0.03, 0, g); }
  for (const s of [-1, 1]) { hrail(g, bx0 + 0.4, bx1 - 0.2, by + br * 0.55, s * (br + 0.07), M.brass, 1.0); const pipe = cyl(0.05, 0.05, bx1 - bx0 - 0.6, M.iron, (bx0 + bx1) / 2, by - br * 0.5, s * (br + 0.06), g, 6); pipe.rotation.z = Math.PI / 2; }
  /* the firebox (early: a brass-topped casing behind the boiler; late: the cab) and the footplate */
  if (early) { box(1.25, 1.3, 1.3, casing, bx1 + 0.62, by + 0.1, 0, g); const top = cyl(0.66, 0.66, 1.25, M.brass, bx1 + 0.62, by + 0.76, 0, g, 16); top.rotation.x = Math.PI / 2; top.scale.set(1, 0.34, 1);
    box(1.9, 0.07, 1.7, M.woodDark, bx1 + 1.6, H(1.2), 0, g); box(0.06, 0.7, 1.7, M.woodDark, bx1 + 2.0, H(1.58), 0, g); for (const z of [-0.83, 0.83]) { box(0.05, 0.9, 0.05, M.iron, bx1 + 2.5, H(1.6), z, g); } box(0.05, 0.05, 1.7, M.iron, bx1 + 2.5, H(2.05), 0, g); }
  else { const cx = bx1 + 1.2; box(0.07, 1.7, 1.9, casing, bx1 + 0.12, H(2.15), 0, g); for (const z of [-0.95, 0.95]) { box(2.2, 1.55, 0.06, casing, cx, H(2.07), z, g); box(0.9, 0.62, 0.02, new THREE.MeshBasicMaterial({ color: 0x1a2630 }), cx - 0.25, H(2.35), z * 1.02, g); }
    box(2.5, 0.1, 2.3, M.black, cx + 0.05, H(3.0), 0, g); box(0.07, 1.2, 1.9, casing, cx + 1.1, H(1.85), 0, g); box(2.3, 0.07, 1.9, M.woodDark, cx, H(1.2), 0, g); box(0.5, 0.2, 0.04, line, cx - 0.4, H(2.6), 0.97, g); }
  /* steps, a lamp at the front, the outside rods */
  for (const s of [-1, 1]) { box(0.45, 0.04, 0.3, M.woodDark, bx1 + (early ? 1.6 : 1.2), H(0.78), s * 0.95, g); box(0.45, 0.04, 0.3, M.woodDark, bx1 + (early ? 1.6 : 1.2), H(0.42), s * 0.98, g); }
  const lamp = cyl(0.17, 0.17, 0.2, M.headlamp, bx0 - 0.15, by + br + 0.12, 0, g, 10); lamp.rotation.z = Math.PI / 2;
  /* wheels */
  const R = early ? 0.82 : 0.86;
  if (early) { wheelset(0.45, -1.9, H(0.45), g, W, true); wheelset(R, 0.8, H(R), g, W, true); wheelset(0.45, 2.3, H(0.45), g, W, true); for (const s of [-1, 1]) box(1.5, 0.07, 0.07, M.steel, 0.8, H(R), s * (GAUGE / 2 + 0.17), g); }
  else { for (const dx of [-2.3, -1.4]) wheelset(0.45, dx, H(0.45), g, W, true); for (const dx of [0.4, 1.9]) wheelset(R, dx, H(R), g, W, true); for (const s of [-1, 1]) { box(1.6, 0.08, 0.07, M.steel, 1.15, H(R), s * (GAUGE / 2 + 0.17), g); cyl(0.14, 0.14, 0.8, M.iron, -1.3, H(1.0), s * 0.82, g, 10).rotation.z = Math.PI / 2; } }
  /* the tender: a low frame, a green tank, coal heaped on top, a filler cap and a toolbox */
  const tx = early ? 5.5 : 5.4, tl = early ? 2.5 : 3.1; box(tl + 0.3, 0.12, 1.2, M.black, tx, H(0.95), 0, g); box(tl, 0.85, 1.5, early ? solid(0x1f4d2e, 0.6) : solid(0x1b1c20, 0.7), tx, H(1.5), 0, g); box(tl + 0.06, 0.08, 1.56, line, tx, H(1.94), 0, g);
  for (let i = 0; i < 11; i++) mesh(new THREE.DodecahedronGeometry(0.26 + (i % 3) * 0.05, 0), solid(0x131313, 1), tx - tl * 0.35 + (i % 4) * tl * 0.24, H(2.15 + (i % 2) * 0.1), -0.4 + Math.floor(i / 4) * 0.4 + (i % 3) * 0.06, g);
  cyl(0.14, 0.14, 0.06, M.brass, tx - tl * 0.3, H(1.96), 0.5, g, 10); box(0.5, 0.22, 0.34, M.woodDark, tx + tl * 0.3, H(2.05), -0.5, g);
  wheelset(0.45, tx - tl * 0.32, H(0.45), g, W, true); wheelset(0.45, tx + tl * 0.32, H(0.45), g, W, true); box(0.7, 0.12, 0.12, M.black, tx - tl / 2 - 0.5, H(0.95), 0, g);
  return g;
}

/* ---------- 1845 carriages: a closed first-class coach, and an open third-class one with benches ---------- */
export function carriage1845(kind = 'third', L = 5.2, W = 2.4, layout = 'rows') {
  const g = grp(); g.userData.wheels = [];
  if (kind === 'first') {
    const tex = cv(512, 192, (x, w, h) => { x.fillStyle = '#c9a23a'; x.fillRect(0, 0, w, h); x.fillStyle = '#243a62'; x.fillRect(0, h * 0.45, w, h * 0.55); for (let i = 0; i < 3; i++) { const cx = 90 + i * 165; x.fillStyle = '#f2e6bd'; x.fillRect(cx - 52, 18, 104, 66); x.fillStyle = '#26394d'; x.fillRect(cx - 46, 24, 92, 54); x.fillStyle = 'rgba(255,255,255,0.14)'; x.fillRect(cx - 40, 28, 18, 46); }
      x.fillStyle = '#f2e6bd'; x.font = '700 22px Georgia, serif'; x.textAlign = 'center'; x.fillText('FIRST CLASS', w / 2, h - 28); grain(x, w, h, 12); });
    const side = std(tex, 0.8), cap = solid(0x24324a, 0.8); const body = new THREE.Mesh(new THREE.BoxGeometry(L, 2.0, W), [cap, cap, cap, cap, side, side]); body.position.y = 0.85; g.add(body); box(L + 0.2, 0.12, W + 0.2, solid(0x2b2b30, 0.8), 0, 1.9, 0, g);
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
    for (const e of [-1, 1]) { box(0.5, 0.05, 0.22, M.woodDark, e * (L / 2 - 0.4), -0.42, s * (W / 2 + 0.1), g); box(0.5, 0.05, 0.22, M.woodDark, e * (L / 2 - 0.4), -0.74, s * (W / 2 + 0.12), g); for (const dx of [-0.22, 0.22]) box(0.04, 0.72, 0.04, M.iron, e * (L / 2 - 0.4) + dx, -0.4, s * (W / 2 + 0.07), g); }   /* the steps, hung from the body on two iron straps */ }
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
