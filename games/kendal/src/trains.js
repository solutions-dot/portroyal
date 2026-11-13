/* games/kendal/src/trains.js: track, locomotives, carriages and wagons, built from boxes and cylinders.
   Trains run along x and face -x (their front is toward negative x). Every vehicle sits with its floor at y = 0,
   which is also the height of a platform, so rail tops are at y = -1.1 (see RAIL_TOP). Colours and shapes are our best guess:
   we have not found photographs to copy (see docs/games/kendal.md). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { T, cv, grain, std, solid, mesh, box, cyl, plane, grp, rng, batchStatic } from './gfx.js';

export const RAIL_TOP = -1.1;      /* height of the top of the rails under a vehicle whose floor is at y = 0 */
const GAUGE = 1.435;               /* standard gauge, in metres */
const PI = Math.PI;
const M = {
  iron: solid(0x2b2d31, 0.55, 0.35), black: solid(0x16171a, 0.7, 0.1), steel: solid(0x8c8f93, 0.4, 0.65), brass: solid(0xc29a45, 0.4, 0.55), rust: solid(0x6a3f2a, 0.9),
  wheel: solid(0x202226, 0.55, 0.4), sleeper: solid(0x3a2c20, 0.95), glass: solid(0x1c2a35, 0.2, 0.2),
  cream: solid(0xe8dcb8, 0.8), dgreen: solid(0x1f4d2e, 0.6, 0.15), loco57: solid(0x24392f, 0.55, 0.2), stripe: solid(0xe4d6a8, 0.7), roof57: solid(0xb6b3a6, 0.85),
  wood: solid(0x6b4a30, 0.9), woodDark: solid(0x3a2a1d, 0.95), maroon: solid(0x6e2c24, 0.8), headlamp: new THREE.MeshBasicMaterial({ color: 0xfff1c0 }),
  under: solid(0x1d1e21, 0.8, 0.15), red: solid(0x9a2c24, 0.6, 0.15), copper: solid(0xb5673a, 0.35, 0.6), coal: solid(0x111214, 0.95), tail: new THREE.MeshBasicMaterial({ color: 0xc8261e }),
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

/* ---------- wheels: each pair of wheels and its axle is one mesh (one draw), turned from a real wheel profile: a tread, a flange on the inside, a thin web or spokes, a hub ---------- */
const WM = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.45 });
function paint(geo, hex) { const c = new THREE.Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo; }
const lathe = (pts, seg) => { const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); g.rotateX(PI / 2); return g; };   /* turned round the z axis: the second number of each point runs along the axle, + is the outside face */
const _wheelGeo = {};
function wheelGeo(r, spokes) {   /* one wheel, its axle along z, outside face toward +z */
  const key = r + '|' + spokes; if (_wheelGeo[key]) return _wheelGeo[key]; const parts = [], seg = r > 0.7 ? 28 : spokes ? 20 : 14, dark = 0x26282c, tread = 0x8a8d91;
  const tyre = lathe([[r * 0.84, 0.05], [r, 0.062], [r, -0.04], [r * 1.065, -0.05], [r * 1.065, -0.066], [r * 0.84, -0.066], [r * 0.84, 0.05]], seg); paint(tyre, dark);
  const tc = tyre.attributes.color, tp = tyre.attributes.position; for (let i = 0; i < tp.count; i++) if (Math.hypot(tp.getX(i), tp.getY(i)) > r * 0.985) tc.setXYZ(i, 0.5, 0.51, 0.53);   /* the running surface is polished by the rail */
  parts.push(tyre);
  if (spokes) {
    const n = r > 0.7 ? 14 : 10; parts.push(paint(lathe([[0, 0.085], [r * 0.13, 0.085], [r * 0.2, 0.06], [r * 0.2, -0.07], [0, -0.07]], 12), dark));
    for (let i = 0; i < n; i++) { const s = new THREE.BoxGeometry(r * 0.68, r * 0.075, 0.045); s.translate(r * 0.52, 0, 0); s.rotateZ(i / n * PI * 2); parts.push(paint(s, dark)); }
    parts.push(paint(lathe([[r * 0.045, 0.1], [r * 0.085, 0.1], [r * 0.085, 0.085], [r * 0.045, 0.085]], 8), tread));   /* the bright axle end */
  } else parts.push(paint(lathe([[0, 0.075], [r * 0.2, 0.075], [r * 0.26, 0.03], [r * 0.8, 0.012], [r * 0.84, 0.05], [r * 0.84, -0.066], [r * 0.24, -0.05], [0, -0.05]], seg), dark));
  return (_wheelGeo[key] = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false));
}
const _setGeo = {};
function wheelsetGeo(r, spokes) {
  const key = r + '|' + spokes; if (_setGeo[key]) return _setGeo[key]; const z = GAUGE / 2 + 0.035, a = wheelGeo(r, spokes).clone().translate(0, 0, z), b = wheelGeo(r, spokes).clone().rotateY(PI).translate(0, 0, -z);
  const ax = new THREE.CylinderGeometry(0.065, 0.065, GAUGE, 8); ax.rotateX(PI / 2);
  return (_setGeo[key] = mergeGeometries([a, b, paint(ax.toNonIndexed(), 0x2a2c30)], false));
}
export function wheel(r, spokes = false) { const g = grp(); g.add(new THREE.Mesh(wheelGeo(r, spokes), WM)); return g; }   /* its axle runs along z; spin it by turning rotation.z */
function wheelset(r, x, y, parent, wheels, spokes = false) {   /* a pair of wheels on an axle across the track, at x */
  const w = new THREE.Mesh(wheelsetGeo(r, spokes), WM); w.userData.noBatch = true; w.position.set(x, y, 0); parent.add(w); if (wheels) wheels.push({ w, r }); return w;
}
export function spin(train, dx) { for (const o of train.userData.wheels || []) o.w.rotation.z -= dx / o.r; }   /* roll the wheels as the train moves dx metres toward -x */

/* ---------- shared pieces ---------- */
function arcRoof(len, w, rise, th = 0.05, p = 2.5, seg = 12) {   /* a curved roof along x, centred, its eaves' underside at y = 0: flat across the middle and turned down at the edges */
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); for (let i = 0; i <= seg; i++) { const u = -1 + 2 * i / seg; s.lineTo(u * w / 2, th + rise * Math.pow(1 - Math.pow(Math.abs(u), p), 1 / p)); } s.lineTo(w / 2, 0); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, steps: 1 }); g.translate(0, 0, -len / 2); g.rotateY(PI / 2); return g;
}
function flipU(geo) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); return geo; }
function sidePlane(w, h, m, x, y, z, parent, face = 1, flip = false) {   /* a painted panel on a side that faces +z (face 1) or -z (face -1); flip mirrors the picture so its front stays at the front */
  const g = new THREE.PlaneGeometry(w, h); if (flip) flipU(g); const o = mesh(g, m, x, y, z, parent); if (face < 0) o.rotation.y = PI; return o;
}
function endPlane(w, h, m, x, y, z, parent, face = 1) { const o = mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, parent); o.rotation.y = face * PI / 2; return o; }   /* a painted panel that faces +x (face 1) or -x (face -1) */
function buffer(g, x, y, z, s, m = M.iron, len = 0.34) { const st = cyl(0.07, 0.09, len - 0.04, m, x + s * (len - 0.04) / 2, y, z, g, 8); st.rotation.z = s * PI / 2; const hd = cyl(0.17, 0.17, 0.045, M.steel, x + s * (len - 0.022), y, z, g, 14); hd.rotation.z = PI / 2; }   /* a round buffer that sticks out len from x, toward s */
function hook(g, x, y, s) { box(0.22, 0.09, 0.07, M.iron, x + s * 0.11, y, 0, g); const l = mesh(new THREE.TorusGeometry(0.07, 0.016, 5, 10), M.iron, x + s * 0.26, y - 0.05, 0, g); l.rotation.x = 0.5; }   /* a draw hook with a link hanging from it */
function bogie(g, x, wheels, r = 0.45, wb = 1.9, m = M.under) {   /* a two-axle truck: side frames with axle boxes and springs, a bolster across, and two pairs of wheels */
  const b = grp(g, x, 0, 0), y = RAIL_TOP + r, Z = GAUGE / 2 + 0.24;
  for (const s of [-1, 1]) {
    box(wb + 0.9, 0.12, 0.07, m, 0, y + 0.2, s * Z, b); box(wb - 0.5, 0.08, 0.06, m, 0, y - 0.16, s * Z, b);
    for (const e of [-1, 1]) { box(0.3, 0.3, 0.14, M.iron, e * wb / 2, y, s * (Z + 0.02), b); box(0.07, 0.34, 0.06, m, e * (wb / 2 - 0.2), y + 0.02, s * Z, b); box(0.07, 0.34, 0.06, m, e * (wb / 2 + 0.2), y + 0.02, s * Z, b); cyl(0.045, 0.045, 0.03, M.steel, e * wb / 2, y, s * (Z + 0.1), b, 8).rotation.x = PI / 2; }
    for (const dx of [-0.2, 0.2]) cyl(0.07, 0.07, 0.3, M.iron, dx, y + 0.0, s * Z, b, 8);   /* the coil springs under the bolster */
  }
  box(0.5, 0.16, GAUGE + 0.6, m, 0, y + 0.22, 0, b); cyl(0.2, 0.2, 0.12, M.iron, 0, y + 0.34, 0, b, 10);
  wheelset(r, -wb / 2, y, b, wheels); wheelset(r, wb / 2, y, b, wheels); return b;
}
function hrail(g, x0, x1, y, z, m = M.steel, post = 1.6, drop = 0.14) { const c = cyl(0.022, 0.022, Math.abs(x1 - x0), m, (x0 + x1) / 2, y, z, g, 6); c.rotation.z = PI / 2; const n = Math.max(1, Math.round(Math.abs(x1 - x0) / post)); for (let i = 0; i <= n; i++) box(0.03, drop, 0.03, m, Math.min(x0, x1) + Math.abs(x1 - x0) * i / n, y - drop / 2, z, g); }   /* a rail along x on short posts */

/* ---------- a wooden coach of the 1950s. What the sources say: the Kendal train had twelve wooden coaches, built to carry 80 people each.
   We found no photograph or drawing of them, so the shape here is a plain guess at a wooden coach of that time: boarded sides, a row of drop windows
   with louvres above, a curved roof that runs out over open end platforms, and two four-wheel trucks. The maroon and cream paint is a guess too.
   L is the length over the end platforms; the buffers reach a little further, so coaches 11.8 m apart just touch. ---------- */
let _coachSide, _coachEnd, _coachNum;
function coachSideTex() {   /* one picture shared by every coach: 9.6 m by 2.55 m of side */
  return _coachSide || (_coachSide = cv(2048, 512, (x, w, h) => {
    const X = (m) => (m + 4.8) / 9.6 * w, Y = (y) => (2.45 - y) / 2.55 * h, S = w / 9.6, r = rng(7);
    x.fillStyle = '#6b2b23'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 19) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,220,200'},${0.03 + r() * 0.07})`; x.fillRect(i, 0, 19, h); x.fillStyle = 'rgba(20,6,4,0.45)'; x.fillRect(i, 0, 2, h); x.fillStyle = 'rgba(255,200,180,0.10)'; x.fillRect(i + 2, 0, 1, h); }   /* upright boards, each a little different */
    const band = (y0, y1, c) => { x.fillStyle = c; x.fillRect(0, Y(y1), w, Y(y0) - Y(y1)); }, line = (y, c, t = 3) => { x.fillStyle = c; x.fillRect(0, Y(y) - t / 2, w, t); };
    band(2.2, 2.45, '#5a221c'); line(2.2, '#e1d2a2', 4); line(2.4, 'rgba(0,0,0,0.5)', 10);   /* the letter board under the roof */
    band(0.8, 0.93, '#5a221c'); line(0.93, '#e1d2a2', 3); line(0.8, '#e1d2a2', 3); line(0.865, 'rgba(255,255,255,0.08)', 8);   /* the waist rail */
    band(-0.1, 0.02, '#2a1512'); line(0.04, '#e1d2a2', 3);
    for (let i = 0; i < 9; i++) {   /* nine drop windows; a louvre panel above each lets air in */
      const cx = X(-4.0 + i * 1.0), ww = 0.74 * S, y0 = Y(1.86), y1 = Y(1.0), hh = y1 - y0;
      x.fillStyle = '#3a1712'; x.fillRect(cx - ww / 2 - 14, Y(2.14) - 6, ww + 28, y1 - Y(2.14) + 16);
      x.fillStyle = '#d9c996'; x.fillRect(cx - ww / 2 - 9, Y(2.14) - 2, ww + 18, y1 - Y(2.14) + 9);
      const gl = x.createLinearGradient(0, y0, 0, y1); gl.addColorStop(0, '#31434e'); gl.addColorStop(0.5, '#17232b'); gl.addColorStop(1, '#0f171d'); x.fillStyle = gl; x.fillRect(cx - ww / 2, y0, ww, hh);
      x.fillStyle = 'rgba(190,215,225,0.16)'; x.beginPath(); x.moveTo(cx - ww / 2 + 8, y1); x.lineTo(cx - ww / 2 + 46, y0); x.lineTo(cx - ww / 2 + 78, y0); x.lineTo(cx - ww / 2 + 40, y1); x.fill();
      const drop = [0, 0.32, 0, 0.55, 0.2, 0, 0.4, 0, 0.3][i] * hh; if (drop) { x.fillStyle = '#080c10'; x.fillRect(cx - ww / 2, y0, ww, drop); x.fillStyle = '#b7a676'; x.fillRect(cx - ww / 2, y0 + drop - 5, ww, 8); }   /* some windows are let down */
      x.strokeStyle = '#8f7f58'; x.lineWidth = 4; x.strokeRect(cx - ww / 2 + 2, y0 + 2, ww - 4, hh - 4);
      x.fillStyle = '#4a1e18'; x.fillRect(cx - ww / 2, Y(2.12), ww, Y(1.92) - Y(2.12)); for (let k = 0; k < 6; k++) { const ly = Y(2.12) + k * (Y(1.92) - Y(2.12)) / 6; x.fillStyle = 'rgba(0,0,0,0.5)'; x.fillRect(cx - ww / 2, ly, ww, 3); x.fillStyle = 'rgba(255,210,190,0.16)'; x.fillRect(cx - ww / 2, ly + 3, ww, 2); }
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(cx - ww / 2 - 9, y1 + 7, ww + 18, 5);
      for (const sx of [-1, 1]) { const g2 = x.createLinearGradient(0, y1 + 10, 0, y1 + 90); g2.addColorStop(0, 'rgba(20,8,6,0.3)'); g2.addColorStop(1, 'rgba(20,8,6,0)'); x.fillStyle = g2; x.fillRect(cx + sx * (ww / 2 + 4) - 4, y1 + 10, 8, 80); }   /* rain streaks from the sill corners */
    }
    x.fillStyle = '#e8dcb8'; x.font = '700 30px Georgia, serif'; x.textAlign = 'center'; x.fillText('J. G. R.', w / 2, Y(0.38));
    const d = x.createLinearGradient(0, Y(0.5), 0, h); d.addColorStop(0, 'rgba(120,100,80,0)'); d.addColorStop(1, 'rgba(120,100,80,0.32)'); x.fillStyle = d; x.fillRect(0, Y(0.5), w, h - Y(0.5));   /* road dust low down */
    for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(30,12,8,${0.03 + r() * 0.06})`; x.beginPath(); x.ellipse(r() * w, r() * h, 10 + r() * 40, 5 + r() * 18, 0, 0, 7); x.fill(); } grain(x, w, h, 9);
  }));
}
function coachEndTex() {   /* the end wall: boards, a door with a window, a small window each side */
  return _coachEnd || (_coachEnd = cv(512, 512, (x, w, h) => {
    const r = rng(9); x.fillStyle = '#5e251e'; x.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 18) { x.fillStyle = 'rgba(20,6,4,0.45)'; x.fillRect(i, 0, 2, h); x.fillStyle = `rgba(0,0,0,${r() * 0.08})`; x.fillRect(i, 0, 18, h); }
    x.fillStyle = '#d9c996'; x.fillRect(178, 60, 156, 440); x.fillStyle = '#4a1c16'; x.fillRect(186, 68, 140, 432); x.fillStyle = '#16222a'; x.fillRect(206, 96, 100, 150); x.fillStyle = 'rgba(190,215,225,0.15)'; x.fillRect(214, 100, 22, 142);
    x.strokeStyle = 'rgba(0,0,0,0.4)'; x.lineWidth = 3; x.strokeRect(206, 280, 100, 180); x.fillStyle = '#c29a45'; x.fillRect(300, 268, 18, 8);
    for (const cx of [90, 422]) { x.fillStyle = '#d9c996'; x.fillRect(cx - 48, 96, 96, 150); x.fillStyle = '#16222a'; x.fillRect(cx - 40, 104, 80, 134); }
    x.fillStyle = '#e1d2a2'; x.fillRect(0, 44, w, 4); grain(x, w, h, 9);
  }));
}
function coachNumTex() { return _coachNum || (_coachNum = cv(512, 192, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#e8dcb8'; x.font = '700 50px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; for (let n = 1; n <= 12; n++) x.fillText(String(n), ((n - 1) % 4 + 0.5) * 128, (Math.floor((n - 1) / 4) + 0.5) * 64); })); }   /* the numbers 1 to 12 on one sheet */
let _numMat;
function coachNumber(n, parent, x, y, z, face) {
  _numMat = _numMat || new THREE.MeshStandardMaterial({ map: coachNumTex(), transparent: true, alphaTest: 0.4, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 });
  const g = new THREE.PlaneGeometry(0.4, 0.2), k = Math.max(1, Math.min(12, n | 0)) - 1, u0 = (k % 4) / 4, v1 = 1 - Math.floor(k / 4) / 3, uv = g.attributes.uv; for (let i = 0; i < 4; i++) uv.setXY(i, u0 + uv.getX(i) / 4, v1 - (1 - uv.getY(i)) / 3);
  const o = mesh(g, _numMat, x, y, z, parent); if (face < 0) o.rotation.y = PI; return o;
}
export function woodCoach(n = 1, L = 11, W = 2.7) {
  const g = grp(); g.userData.wheels = []; const Lb = L - 1.4, hb = Lb / 2, side = std(coachSideTex(), 0.8), endM = std(coachEndTex(), 0.85), inner = solid(0x3a1712, 0.9), roofM = solid(0xb9b5a6, 0.9), postM = solid(0x4a1e18, 0.85);
  box(Lb - 0.01, 2.55, W - 0.01, inner, 0, 1.175, 0, g);
  for (const s of [-1, 1]) { sidePlane(Lb, 2.55, side, 0, 1.175, s * W / 2, g, s); coachNumber(n, g, s * (-hb + 0.55), 0.38, s * (W / 2 + 0.004), s); coachNumber(n, g, s * (hb - 0.55), 0.38, s * (W / 2 + 0.004), s); endPlane(W, 2.55, endM, s * hb, 1.175, 0, g, s); }
  /* the roof: one curved sheet over the body and both end platforms, with rain strips and four ventilators */
  mesh(arcRoof(L + 0.2, W + 0.22, 0.4, 0.05, 2.6), roofM, 0, 2.43, 0, g);
  for (const s of [-1, 1]) { const st = box(L - 0.6, 0.03, 0.04, M.roof57, 0, 2.66, s * (W / 2 - 0.32), g); st.rotation.x = s * 0.5; box(L + 0.2, 0.06, 0.05, postM, 0, 2.43, s * (W / 2 + 0.085), g); }
  for (const x of [-3.3, -1.1, 1.1, 3.3]) { cyl(0.07, 0.07, 0.12, M.iron, x, 2.92, 0, g, 8); const v = cyl(0.11, 0.11, 0.36, M.iron, x, 3.02, 0, g, 10); v.rotation.z = PI / 2; }
  /* the underframe: two long beams, the cross beams at the ends, truss rods on posts, a brake cylinder and a battery box */
  for (const s of [-1, 1]) { box(L, 0.24, 0.1, M.under, 0, -0.22, s * 1.12, g); for (const x of [-1.5, 1.5]) box(0.07, 0.42, 0.07, M.under, x, -0.55, s * 0.8, g); const tr = cyl(0.02, 0.02, 3.0, M.iron, 0, -0.76, s * 0.8, g, 5); tr.rotation.z = PI / 2;
    for (const e of [-1, 1]) { const d = cyl(0.02, 0.02, 1.62, M.iron, e * 2.27, -0.55, s * 0.8, g, 5); d.rotation.z = PI / 2 + e * 0.262; } }
  box(L - 0.2, 0.14, 2.2, M.under, 0, -0.17, 0, g);
  cyl(0.19, 0.19, 0.8, M.iron, 0.6, -0.55, 0.3, g, 10).rotation.z = PI / 2; box(0.8, 0.34, 0.5, M.under, -0.7, -0.5, -0.45, g);
  for (const s of [-1, 1]) bogie(g, s * (hb - 1.7), g.userData.wheels);
  for (const s of [-1, 1]) {   /* the open end platforms: a deck, a rail with a gap in the middle, steps down each side, a hand brake */
    const ex = s * (hb + 0.35), ox = s * (L / 2 - 0.04);
    box(0.7, 0.1, W - 0.1, M.woodDark, ex, -0.05, 0, g); box(0.12, 0.26, 2.3, M.under, s * (L / 2 - 0.06), -0.22, 0, g);
    for (const z of [-1.27, -0.42, 0.42, 1.27]) box(0.05, 2.46, 0.05, Math.abs(z) > 1 ? postM : M.iron, ox, Math.abs(z) > 1 ? 1.22 : 0.5, z, g).scale.y = Math.abs(z) > 1 ? 1 : 0.42;   /* corner posts hold the roof; two shorter posts make the gateway */
    for (const z of [-0.845, 0.845]) { for (const y of [0.55, 1.0]) box(0.04, 0.04, 0.85, M.iron, ox, y, z, g); for (const dz of [-0.2, 0.2]) box(0.025, 0.45, 0.025, M.iron, ox, 0.78, z + dz, g); }
    for (const z of [-1.27, 1.27]) { for (const [yy, zz] of [[-0.4, 0.06], [-0.74, 0.1]]) box(0.56, 0.04, 0.24, M.woodDark, ex, yy, z + Math.sign(z) * zz, g); for (const dx of [-0.26, 0.26]) box(0.03, 0.78, 0.03, M.iron, ex + dx, -0.38, z + Math.sign(z) * 0.14, g); cyl(0.018, 0.018, 0.9, M.steel, s * (hb + 0.06), 1.1, z * 0.985, g, 5); }
    const hw = cyl(0.16, 0.16, 0.03, M.iron, ox - s * 0.12, 1.08, s * 0.845, g, 12); hw.rotation.z = PI / 2; const hs = cyl(0.016, 0.016, 0.24, M.iron, ox - s * 0.06, 1.08, s * 0.845, g, 5); hs.rotation.z = PI / 2;
    for (const z of [-0.86, 0.86]) buffer(g, s * (L / 2 - 0.02), -0.22, z, s); hook(g, s * (L / 2), -0.26, s);
    box(0.1, 0.12, 0.1, M.tail, s * (L / 2 - 0.02), 0.2, s * 1.2, g);   /* a red tail lamp */
  }
  return g;
}

/* ---------- a diesel engine of the 1950s. What the sources say: two diesel engines pulled the Kendal train. The railway had a series of English Electric
   750 horse power engines with two four-wheel trucks, and a National Library of Jamaica photograph shows one of the railway's hood engines: a long hood with a
   round head lamp on top of its end, a cab near the other end, walkways with handrails, a slatted pilot, a pale band along the side that meets a pale diamond on the nose.
   We could not find which engines pulled the train that night, or their colours (the photograph is black and white), so the dark green and cream are a guess. ---------- */
let _hoodTex, _cabTex, _noseTex, _cabEndTex;
const G57 = '#24392f', G57D = '#1a2a22', CREAM = '#e4d6a8';
function steelPaint(x, w, h, r) { x.fillStyle = G57; x.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '160,190,170'},${0.02 + r() * 0.04})`; x.beginPath(); x.ellipse(r() * w, r() * h, 20 + r() * 80, 8 + r() * 30, 0, 0, 7); x.fill(); } }
function hoodTex() {   /* the side of the long hood: 7.9 m by 2 m. The front (the radiator) is on the left. Doors with louvres, handles, the cream band. */
  return _hoodTex || (_hoodTex = cv(1024, 256, (x, w, h) => {
    const r = rng(3), S = w / 7.9; steelPaint(x, w, h, r);
    x.fillStyle = '#10171a'; x.fillRect(0.25 * S, 30, 1.05 * S, 150); for (let y = 34; y < 178; y += 7) { x.fillStyle = 'rgba(150,170,160,0.28)'; x.fillRect(0.25 * S, y, 1.05 * S, 2); } x.strokeStyle = G57D; x.lineWidth = 5; x.strokeRect(0.25 * S, 30, 1.05 * S, 150);   /* the radiator grille */
    for (let i = 0; i < 8; i++) { const x0 = (1.5 + i * 0.78) * S, dw = 0.74 * S; x.strokeStyle = 'rgba(0,0,0,0.55)'; x.lineWidth = 3; x.strokeRect(x0, 22, dw, 214); x.strokeStyle = 'rgba(170,200,180,0.12)'; x.lineWidth = 1; x.strokeRect(x0 + 3, 25, dw - 6, 208);
      if (i % 2 === 0) { for (let y = 40; y < 108; y += 8) { x.fillStyle = 'rgba(0,0,0,0.55)'; x.fillRect(x0 + 12, y, dw - 24, 4); x.fillStyle = 'rgba(170,200,180,0.18)'; x.fillRect(x0 + 12, y + 4, dw - 24, 2); } }
      x.fillStyle = '#9a9c98'; x.fillRect(x0 + dw - 16, 150, 8, 20); x.fillStyle = 'rgba(0,0,0,0.5)'; for (const y of [34, 222]) x.fillRect(x0 + 4, y, 10, 5); }
    x.fillStyle = CREAM; x.fillRect(0, 108, w, 26); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(0, 134, w, 2);
    const d = x.createLinearGradient(0, 180, 0, h); d.addColorStop(0, 'rgba(110,100,84,0)'); d.addColorStop(1, 'rgba(110,100,84,0.3)'); x.fillStyle = d; x.fillRect(0, 180, w, h - 180); grain(x, w, h, 8);
  }));
}
function cabTex() {   /* the cab side: 2.4 m by 2.75 m: two windows, a door, the band and the railway's letters */
  return _cabTex || (_cabTex = cv(256, 320, (x, w, h) => {
    const r = rng(5), Y = (y) => (2.75 - y) / 2.75 * h; steelPaint(x, w, h, r);
    x.fillStyle = CREAM; x.fillRect(0, Y(1.155), w, Y(0.955) - Y(1.155));
    for (const [x0, x1] of [[24, 112], [144, 232]]) { x.fillStyle = '#b8b39c'; x.fillRect(x0 - 6, Y(2.42) - 6, x1 - x0 + 12, Y(1.62) - Y(2.42) + 12); const gl = x.createLinearGradient(0, Y(2.42), 0, Y(1.62)); gl.addColorStop(0, '#34464f'); gl.addColorStop(1, '#10181d'); x.fillStyle = gl; x.fillRect(x0, Y(2.42), x1 - x0, Y(1.62) - Y(2.42)); x.fillStyle = 'rgba(200,220,230,0.16)'; x.fillRect(x0 + 8, Y(2.42), 16, Y(1.62) - Y(2.42)); }
    x.strokeStyle = 'rgba(0,0,0,0.55)'; x.lineWidth = 3; x.strokeRect(134, Y(2.56), 108, Y(0.04) - Y(2.56)); x.fillStyle = '#9a9c98'; x.fillRect(140, Y(1.42), 8, 22);
    x.fillStyle = CREAM; x.font = '700 22px Georgia, serif'; x.textAlign = 'center'; x.fillText('J. G. R.', 68, Y(0.6)); grain(x, w, h, 8);
  }));
}
function noseTex() {   /* the end of the long hood: the band from each side sweeps in to a diamond */
  return _noseTex || (_noseTex = cv(256, 256, (x, w, h) => {
    const r = rng(8); steelPaint(x, w, h, r); x.strokeStyle = CREAM; x.lineWidth = 15; x.lineJoin = 'miter'; x.fillStyle = CREAM; x.fillRect(0, 108, 50, 26); x.fillRect(206, 108, 50, 26);
    x.beginPath(); x.moveTo(44, 121); x.lineTo(128, 50); x.lineTo(212, 121); x.lineTo(128, 192); x.closePath(); x.stroke();
    x.beginPath(); x.moveTo(128, 90); x.lineTo(164, 121); x.lineTo(128, 152); x.lineTo(92, 121); x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 3; x.strokeRect(70, 206, 116, 44); grain(x, w, h, 8);
  }));
}
function cabEndTex() {   /* the cab's end walls, 2.8 m wide: a narrow window each side of the hood */
  return _cabEndTex || (_cabEndTex = cv(256, 256, (x, w, h) => { const r = rng(6); steelPaint(x, w, h, r); for (const x0 of [8, 204]) { x.fillStyle = '#b8b39c'; x.fillRect(x0 - 4, 26, 52, 84); x.fillStyle = '#16222a'; x.fillRect(x0, 30, 44, 76); x.fillStyle = 'rgba(200,220,230,0.16)'; x.fillRect(x0 + 5, 30, 9, 76); } grain(x, w, h, 8); }));
}
export function dieselLoco(L = 13.4) {
  const g = grp(); g.userData.wheels = []; const W = 2.8, HW = 1.96, x0 = -L / 2 + 0.75, xc0 = L * 0.142, xc1 = xc0 + 2.4, x1 = L / 2 - 0.75, body = M.loco57, hoodM = std(hoodTex(), 0.55, { metalness: 0.2 }), cabM = std(cabTex(), 0.55, { metalness: 0.2 }), dark = solid(0x1a2a22, 0.6, 0.2);
  /* the frame and its walkway, the buffer beams, the slatted pilots, the buffers and hooks */
  box(L, 0.12, W, M.under, 0, -0.06, 0, g); box(L - 0.3, 0.34, 2.3, M.under, 0, -0.29, 0, g); for (const s of [-1, 1]) box(L, 0.07, 0.03, M.stripe, 0, -0.06, s * (W / 2 + 0.005), g);
  for (const s of [-1, 1]) { box(0.14, 0.5, W, M.red, s * (L / 2 - 0.07), -0.3, 0, g); for (let i = 0; i < 9; i++) { const sl = box(0.05, 0.5, 0.09, M.under, s * (L / 2 + 0.1), -0.72, -1.0 + i * 0.25, g); sl.rotation.z = -s * 0.35; } box(0.1, 0.07, 2.2, M.under, s * (L / 2 + 0.18), -0.95, 0, g); box(0.1, 0.07, 2.2, M.under, s * (L / 2 + 0.03), -0.52, 0, g);
    for (const z of [-0.86, 0.86]) buffer(g, s * (L / 2), -0.3, z, s); hook(g, s * (L / 2), -0.3, s);
    for (const z of [-1.2, 1.2]) { for (const y of [-0.42, -0.74]) box(0.5, 0.04, 0.3, M.under, s * (L / 2 - 0.38), y, z, g); for (const dx of [-0.24, 0.24]) box(0.03, 0.72, 0.03, M.under, s * (L / 2 - 0.38) + dx, -0.42, z + Math.sign(z) * 0.14, g); } }   /* steps at the four corners */
  /* the long hood (the front), its rounded top, the nose with the diamond and the head lamp above it */
  const hl = xc0 - x0, hx = (x0 + xc0) / 2; box(hl, 2.0, HW - 0.01, body, hx, 1.0, 0, g); for (const s of [-1, 1]) sidePlane(hl, 2.0, hoodM, hx, 1.0, s * HW / 2, g, s, s < 0);
  mesh(arcRoof(hl, HW, 0.26, 0.0, 3.2), body, hx, 2.0, 0, g); endPlane(HW, 2.0, std(noseTex(), 0.55, { metalness: 0.2 }), x0 - 0.004, 1.0, 0, g, -1);
  box(0.3, 0.42, 0.5, dark, x0 + 0.13, 2.36, 0, g); const lamp = cyl(0.16, 0.16, 0.05, M.headlamp, x0 - 0.035, 2.36, 0, g, 16); lamp.rotation.z = PI / 2; g.userData.headlamp = lamp; const rim = mesh(new THREE.TorusGeometry(0.17, 0.02, 6, 18), M.steel, x0 - 0.04, 2.36, 0, g); rim.rotation.y = PI / 2;
  for (const dx of [0.75, 1.75]) { cyl(0.52, 0.52, 0.08, dark, x0 + dx, 2.27, 0, g, 18); cyl(0.44, 0.44, 0.02, M.black, x0 + dx, 2.32, 0, g, 18); }   /* the radiator fans */
  box(0.5, 0.24, 0.3, dark, hx + 0.6, 2.36, 0, g); cyl(0.11, 0.13, 0.2, M.black, hx + 0.6, 2.54, 0, g, 10);   /* the exhaust */
  for (const dx of [2.9, 5.4]) box(0.7, 0.07, 0.9, dark, x0 + dx, 2.28, 0, g);
  /* the cab: full width, windows all round, a curved roof with a lip over the windows */
  const cx = (xc0 + xc1) / 2; box(2.4, 2.75, W - 0.01, body, cx, 1.375, 0, g); for (const s of [-1, 1]) sidePlane(2.4, 2.75, cabM, cx, 1.375, s * W / 2, g, s);
  const ce = std(cabEndTex(), 0.55, { metalness: 0.2 }); for (const s of [-1, 1]) endPlane(W, 1.75, ce, cx + s * 1.204, 1.875, 0, g, s);
  mesh(arcRoof(2.9, W + 0.16, 0.2, 0.05, 2.6), M.roof57, cx, 2.75, 0, g);
  const horn = cyl(0.05, 0.1, 0.4, M.brass, cx - 0.9, 3.08, 0.5, g, 8); horn.rotation.z = PI / 2; box(0.05, 0.14, 0.05, M.iron, cx - 0.8, 3.0, 0.5, g);
  for (const s of [-1, 1]) { for (const dx of [0.1, 1.2]) cyl(0.018, 0.018, 1.3, M.steel, cx + dx, 1.3, s * (W / 2 + 0.05), g, 5); }   /* grab rails by the cab doors */
  /* the short hood behind the cab */
  const sl = x1 - xc1, sx = (xc1 + x1) / 2; box(sl, 1.75, HW, body, sx, 0.875, 0, g); mesh(arcRoof(sl, HW, 0.22, 0.0, 3.2), body, sx, 1.75, 0, g);
  for (const s of [-1, 1]) { box(sl, 0.2, 0.02, M.stripe, sx, 1.055, s * (HW / 2 + 0.006), g); for (const dx of [-0.42, 0.42]) box(0.72, 1.5, 0.015, dark, sx + dx, 0.86, s * (HW / 2 + 0.002), g); }
  box(0.02, 0.2, HW, M.stripe, x1 + 0.006, 1.055, 0, g); box(0.24, 0.3, 0.4, dark, x1 - 0.1, 1.86, 0, g); const rl = cyl(0.12, 0.12, 0.04, M.headlamp, x1 + 0.03, 1.86, 0, g, 12); rl.rotation.z = PI / 2;
  /* handrails along both walkways and across the ends */
  for (const s of [-1, 1]) { hrail(g, x0 - 0.5, xc0 - 0.15, 1.0, s * (W / 2 - 0.04), M.steel, 1.3, 1.0); hrail(g, xc1 + 0.15, x1 + 0.5, 1.0, s * (W / 2 - 0.04), M.steel, 1.1, 1.0);
    for (const e of [-1, 1]) { const ex = e * (L / 2 - 0.1); box(0.03, 1.0, 0.03, M.steel, ex, 0.5, s * 0.5, g); const c = cyl(0.022, 0.022, 0.86, M.steel, ex, 1.0, s * 0.93, g, 5); c.rotation.x = PI / 2; } }
  /* under the frame: the fuel tank, two air tanks, the battery boxes; then the two trucks */
  const ft = cyl(0.36, 0.36, 2.3, M.under, 0, -0.6, 0, g, 14); ft.rotation.z = PI / 2; ft.scale.z = 2.3;
  for (const s of [-1, 1]) { const at = cyl(0.14, 0.14, 1.5, M.iron, -1.9, -0.52, s * 1.05, g, 10); at.rotation.z = PI / 2; box(0.9, 0.4, 0.4, M.under, 1.9, -0.6, s * 1.1, g); }
  for (const s of [-1, 1]) bogie(g, s * L * 0.3, g.userData.wheels, 0.5, 2.4);
  return g;
}

/* ---------- steam engines: 'early' is the 1845 Projector (a 2-2-2 with one big pair of driving wheels, a brass dome and a tall chimney);
   'late' is a 4-4-0 of the 1890s with a cab. Every height is measured from the rails (H), so the wheels, frame, boiler and footplate line up. ---------- */
const H = (h) => RAIL_TOP + h;
/* ---------- the 1890s engine: a green 4-4-0 with a flared chimney, a brass dome, running boards, outside cylinders, a roofed cab and a coal tender.
   Every height is measured from the rails (H), so the wheels, frame, boiler, boards and cab all sit on each other. Colours are our best guess. ---------- */
function lateLoco() {
  const g = grp(), Wl = []; g.userData.wheels = Wl;
  const green = solid(0x27503a, 0.45, 0.2), dark = solid(0x1b1c20, 0.6, 0.3), lining = solid(0xd9c78c, 0.5, 0.3), red = solid(0x9a2c24, 0.6, 0.15), roof = solid(0x3a3d41, 0.7, 0.2), glassM = new THREE.MeshBasicMaterial({ color: 0x1a2630 }), fire = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
  const R = 0.86, by = H(2.1), br = 0.62, tx = 5.4, tl = 3.1, Z = GAUGE / 2;
  /* the frame, the buffer beam with its buffers, and the drawbar to the tender */
  box(7.2, 0.2, 1.3, dark, 0, H(1.05), 0, g); box(0.2, 0.5, 2.0, red, -3.7, H(1.15), 0, g);
  for (const z of [-0.72, 0.72]) { const bf = cyl(0.08, 0.1, 0.38, M.iron, -3.9, H(1.15), z, g, 8); bf.rotation.z = Math.PI / 2; mesh(new THREE.SphereGeometry(0.12, 8, 6), M.steel, -4.08, H(1.15), z, g); }
  box(0.5, 0.1, 0.12, M.iron, -3.95, H(0.95), 0, g); box(0.36, 0.08, 0.2, M.iron, 3.78, H(0.98), 0, g);
  /* the boiler on its saddle, the firebox on its foundation, the smokebox and its door */
  box(0.9, 0.45, 1.0, dark, -2.55, H(1.37), 0, g); box(1.3, 0.62, 1.1, dark, 0.65, H(1.46), 0, g);
  const barrel = cyl(br, br, 2.4, green, -0.9, by, 0, g, 24); barrel.rotation.z = Math.PI / 2;
  for (const x of [-1.8, -1.0, -0.2]) { const bd = cyl(br + 0.02, br + 0.02, 0.08, lining, x, by, 0, g, 24); bd.rotation.z = Math.PI / 2; }
  const sbox = cyl(br + 0.04, br + 0.04, 0.95, dark, -2.575, by, 0, g, 24); sbox.rotation.z = Math.PI / 2;
  const door = cyl(br * 0.92, br * 0.92, 0.05, M.iron, -3.07, by, 0, g, 24); door.rotation.z = Math.PI / 2; const dring = mesh(new THREE.TorusGeometry(br * 0.88, 0.022, 6, 24), M.brass, -3.1, by, 0, g); dring.rotation.y = Math.PI / 2; box(0.04, 0.34, 0.06, M.brass, -3.12, by, 0, g);
  box(1.0, 1.4, 1.3, green, 0.6, H(2.45), 0, g);   /* the firebox casing */
  /* the chimney with its flared cap, the dome and the whistle, the sand dome, the safety valves */
  cyl(0.17, 0.2, 1.0, dark, -2.6, H(3.15), 0, g, 12); cyl(0.34, 0.17, 0.3, dark, -2.6, H(3.75), 0, g, 14); cyl(0.345, 0.345, 0.04, M.brass, -2.6, H(3.91), 0, g, 14);
  const chim = new THREE.Object3D(); chim.position.set(-2.6, H(3.98), 0); g.add(chim); g.userData.chimney = chim;
  cyl(0.34, 0.34, 0.14, M.brass, -0.9, H(2.7), 0, g, 14); mesh(new THREE.SphereGeometry(0.33, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.brass, -0.9, H(2.77), 0, g); cyl(0.04, 0.06, 0.34, M.brass, -0.9, H(3.27), 0, g, 8);
  cyl(0.26, 0.26, 0.1, dark, -1.8, H(2.7), 0, g, 12); mesh(new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dark, -1.8, H(2.75), 0, g);
  for (const dx of [0, 0.32]) cyl(0.045, 0.06, 0.22, M.brass, 0.4 + dx, H(3.26), 0, g, 6); cyl(0.04, 0.05, 0.3, M.brass, 0.85, H(3.3), 0, g, 6);
  for (const s of [-1, 1]) { const rail = cyl(0.025, 0.025, 2.9, M.brass, -1.55, by + 0.31, s * 0.63, g, 6); rail.rotation.z = Math.PI / 2; for (const x of [-2.8, -1.8, -0.8, 0.0]) box(0.03, 0.03, 0.1, M.brass, x, by + 0.31, s * 0.585, g); }   /* the handrails, each held to the boiler by short stays */
  /* the headlamp on its bracket and the brass number plate */
  box(0.12, 0.1, 0.12, dark, -3.0, H(2.82), 0, g); box(0.3, 0.3, 0.28, dark, -3.0, H(3.0), 0, g); const lamp = cyl(0.12, 0.12, 0.04, M.headlamp, -3.17, H(3.0), 0, g, 10); lamp.rotation.z = Math.PI / 2; g.userData.headlamp = lamp;
  cyl(0.16, 0.16, 0.02, M.brass, -3.13, by + 0.32, 0, g, 12).rotation.z = Math.PI / 2;
  /* running boards: low at the front, stepping up over the big wheels; each held by brackets to the frame */
  for (const s of [-1, 1]) {
    box(2.9, 0.05, 0.5, dark, -2.05, H(1.5), s * 0.87, g); box(2.9, 0.025, 0.03, lining, -2.05, H(1.53), s * 1.1, g);
    for (const x of [-3.2, -2.2, -1.2]) box(0.04, 0.35, 0.3, dark, x, H(1.33), s * 0.72, g);
    box(0.05, 0.45, 0.5, dark, -0.55, H(1.72), s * 0.87, g);
    box(1.6, 0.05, 0.45, dark, 0.25, H(1.95), s * 0.82, g); box(1.6, 0.12, 0.03, green, 0.25, H(1.87), s * 1.04, g);
    for (const x of [-0.2, 0.7]) box(0.04, 0.4, 0.3, dark, x, H(1.75), s * 0.66, g);
  }
  /* the cab: a floor, two sides with windows, a front wall, the roof on top, and the steps down */
  box(2.9, 0.1, 2.0, M.woodDark, 2.45, H(1.9), 0, g);
  for (const s of [-1, 1]) {
    box(2.3, 1.45, 0.06, green, 2.25, H(2.7), s * 0.97, g); box(2.3, 0.025, 0.012, lining, 2.25, H(3.36), s * 1.005, g); box(2.3, 0.025, 0.012, lining, 2.25, H(2.06), s * 1.005, g);
    for (const x of [1.85, 2.85]) { box(0.72, 0.6, 0.02, glassM, x, H(2.85), s * 1.005, g); box(0.78, 0.04, 0.03, lining, x, H(3.17), s * 1.012, g); box(0.78, 0.04, 0.03, lining, x, H(2.53), s * 1.012, g); }
    box(0.07, 1.45, 0.07, green, 3.38, H(2.7), s * 0.93, g);
    for (const x of [2.95, 3.45]) box(0.05, 1.0, 0.04, M.iron, x, H(1.45), s * 1.0, g);   /* iron straps hold the two steps */
    box(0.5, 0.04, 0.3, M.woodDark, 3.2, H(1.45), s * 1.0, g); box(0.5, 0.04, 0.3, M.woodDark, 3.2, H(0.97), s * 1.0, g);
  }
  box(0.07, 1.45, 1.94, green, 1.14, H(2.7), 0, g);
  box(2.9, 0.07, 2.2, roof, 2.3, H(3.46), 0, g); box(2.4, 0.06, 1.2, roof, 2.3, H(3.52), 0, g);
  box(0.03, 0.4, 0.42, M.iron, 1.19, H(2.2), 0, g); box(0.02, 0.2, 0.3, fire, 1.21, H(2.2), 0, g);   /* the fire door, seen through the cab window */
  for (const z of [-0.4, 0.4]) { const gg = cyl(0.07, 0.07, 0.03, M.brass, 1.19, H(2.95), z, g, 10); gg.rotation.z = Math.PI / 2; }
  /* the wheels: a pair of small ones in front of the cylinders and two big driving pairs, linked by rods */
  for (const dx of [-2.3, -1.4]) wheelset(0.45, dx, H(0.45), g, Wl, true); box(1.4, 0.12, 1.0, dark, -1.85, H(0.8), 0, g);
  for (const dx of [0.4, 1.9]) wheelset(R, dx, H(R), g, Wl, true);
  for (const s of [-1, 1]) {
    const zr = s * (Z + 0.17), zc = s * 0.95;
    box(1.5, 0.08, 0.06, M.steel, 1.15, H(R), zr, g); for (const x of [0.4, 1.9]) { const bs = cyl(0.07, 0.07, 0.1, M.brass, x, H(R), zr, g, 10); bs.rotation.x = Math.PI / 2; }
    const mr = box(1.05, 0.08, 0.06, M.steel, -0.08, H(1.03), zr, g); mr.rotation.z = -0.343;   /* the main rod, from the crosshead down to the first driving wheel */
    const cyl1 = cyl(0.16, 0.16, 0.7, dark, -1.85, H(1.2), zc, g, 12); cyl1.rotation.z = Math.PI / 2; const cap = cyl(0.17, 0.17, 0.04, M.brass, -2.22, H(1.2), zc, g, 12); cap.rotation.z = Math.PI / 2;
    const pr = cyl(0.03, 0.03, 0.9, M.steel, -1.05, H(1.2), zc, g, 6); pr.rotation.z = Math.PI / 2; box(0.2, 0.14, 0.1, M.iron, -0.58, H(1.2), zc, g); box(0.6, 0.04, 0.08, M.steel, -0.8, H(1.2), zc, g);
    box(0.1, 0.12, 0.34, dark, -1.85, H(1.38), s * 0.82, g);   /* the pipe that carries steam out to the cylinder */
  }
  /* the tender: frame, a green tank with cream lining, a coal bunker heaped with coal, a hand brake, the rear buffer beam */
  box(tl + 0.3, 0.14, 1.3, dark, tx, H(0.98), 0, g); box(tl, 0.9, 1.6, green, tx, H(1.52), 0, g); box(tl + 0.02, 0.03, 1.62, lining, tx, H(1.94), 0, g);
  for (const s of [-1, 1]) { for (const y of [1.2, 1.84]) box(tl - 0.3, 0.02, 0.012, lining, tx, H(y), s * 0.806, g); for (const dx of [-1, 1]) box(0.02, 0.64, 0.012, lining, tx + dx * (tl / 2 - 0.15), H(1.52), s * 0.806, g); box(tl - 0.3, 0.3, 0.05, green, tx - 0.15, H(2.1), s * 0.77, g); }
  box(0.05, 0.55, 1.6, green, tx - tl / 2 + 0.1, H(2.2), 0, g); box(0.05, 0.55, 1.6, green, tx + tl / 2 - 0.05, H(2.2), 0, g);
  const coal = solid(0x111214, 0.95), mound = mesh(new THREE.SphereGeometry(1, 12, 8), coal, tx - 0.05, H(1.97), 0, g); mound.scale.set(1.3, 0.5, 0.74);
  for (let i = 0; i < 9; i++) mesh(new THREE.DodecahedronGeometry(0.16 + (i % 3) * 0.04, 0), coal, tx - 0.95 + (i % 5) * 0.45, H(2.38 - Math.abs((i % 5) - 2) * 0.1), -0.25 + Math.floor(i / 5) * 0.4 + (i % 2) * 0.05, g);
  cyl(0.025, 0.025, 0.8, M.iron, tx + tl / 2 - 0.2, H(2.45), 0.6, g, 6); cyl(0.12, 0.12, 0.03, M.iron, tx + tl / 2 - 0.2, H(2.86), 0.6, g, 10);
  box(0.18, 0.46, 1.9, red, tx + tl / 2 + 0.12, H(1.1), 0, g); for (const z of [-0.7, 0.7]) { const bf = cyl(0.07, 0.09, 0.3, M.iron, tx + tl / 2 + 0.34, H(1.1), z, g, 8); bf.rotation.z = Math.PI / 2; }
  wheelset(0.45, tx - tl * 0.32, H(0.45), g, Wl, true); wheelset(0.45, tx + tl * 0.32, H(0.45), g, Wl, true);
  batchStatic(g);   /* everything that does not move becomes a handful of meshes; the wheels (marked noBatch) still spin */
  return g;
}

/* ---------- the 1845 engine. The Projector was built by Sharp Brothers of Manchester; we found no drawing of her, so this is a general picture of a
   Sharp passenger engine of the 1840s: one big pair of driving wheels between two small pairs, a tall chimney with a copper cap, a brass dome,
   a raised firebox with a brass safety-valve cover, brass-edged splashers over the big wheels, an open footplate with no cab, and a small tender. Colours are a guess. ---------- */
function earlyLoco() {
  const g = grp(), Wl = []; g.userData.wheels = Wl;
  const green = solid(0x1f4d2e, 0.45, 0.2), dark = solid(0x1b1c20, 0.6, 0.3), lining = solid(0xb08a3a, 0.5, 0.4), frameM = solid(0x5a2a22, 0.7, 0.1), fire = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
  const R = 0.84, by = H(1.95), br = 0.52, Z = GAUGE / 2, tx = 5.075, tl = 3.05;
  /* the frames outside the small wheels, the wooden buffer beam and its buffers */
  for (const s of [-1, 1]) { box(6.0, 0.3, 0.06, frameM, -0.1, H(1.02), s * 0.98, g); for (const x of [-1.9, 2.3]) { box(0.5, 0.42, 0.07, frameM, x, H(0.72), s * 0.98, g); box(0.2, 0.2, 0.1, M.iron, x, H(0.5), s * 1.0, g); const sp = box(0.8, 0.045, 0.06, M.iron, x, H(1.24), s * 1.0, g); box(0.1, 0.1, 0.06, M.iron, x, H(1.18), s * 1.0, g); } }
  box(6.0, 0.14, 1.2, dark, -0.1, H(1.05), 0, g); box(0.2, 0.42, 2.1, M.red, -3.2, H(1.02), 0, g); for (const z of [-0.86, 0.86]) buffer(g, -3.28, H(1.02), z, -1); hook(g, -3.3, H(0.92), -1);
  for (const s of [-1, 1]) { const gi = box(0.05, 0.5, 0.05, M.iron, -3.1, H(0.55), s * Z, g); gi.rotation.z = 0.25; }   /* guard irons in front of the wheels */
  /* the boiler with its brass bands, the smokebox and door, the tall chimney with its copper cap */
  const barrel = cyl(br, br, 3.0, green, -0.9, by, 0, g, 24); barrel.rotation.z = PI / 2;
  for (const x of [-2.2, -1.5, -0.8, -0.1, 0.55]) { const bd = cyl(br + 0.012, br + 0.012, 0.05, M.brass, x, by, 0, g, 24); bd.rotation.z = PI / 2; }
  const sb = cyl(br + 0.05, br + 0.05, 0.6, dark, -2.7, by, 0, g, 24); sb.rotation.z = PI / 2; box(0.6, 0.6, 0.9, dark, -2.7, H(1.4), 0, g);
  const door = cyl(br * 0.86, br * 0.86, 0.04, M.iron, -3.02, by, 0, g, 24); door.rotation.z = PI / 2; const ring = mesh(new THREE.TorusGeometry(br * 0.86, 0.02, 6, 24), M.brass, -3.03, by, 0, g); ring.rotation.y = PI / 2;
  box(0.03, 0.05, br * 1.5, M.iron, -3.05, by + 0.14, 0, g); box(0.03, 0.05, br * 1.5, M.iron, -3.05, by - 0.14, 0, g); cyl(0.035, 0.035, 0.08, M.brass, -3.07, by, 0, g, 8).rotation.z = PI / 2;
  cyl(0.2, 0.24, 0.12, dark, -2.7, by + br + 0.08, 0, g, 14); cyl(0.14, 0.16, 1.3, dark, -2.7, by + br + 0.75, 0, g, 14); cyl(0.26, 0.15, 0.24, M.copper, -2.7, by + br + 1.5, 0, g, 14); cyl(0.27, 0.27, 0.03, M.copper, -2.7, by + br + 1.63, 0, g, 14);
  const chim = new THREE.Object3D(); chim.position.set(-2.7, by + br + 1.72, 0); g.add(chim); g.userData.chimney = chim;
  /* the brass dome on the boiler, the raised firebox with its square brass cover, the whistle */
  cyl(0.27, 0.3, 0.1, M.brass, -0.9, by + br + 0.03, 0, g, 16); cyl(0.25, 0.27, 0.3, M.brass, -0.9, by + br + 0.22, 0, g, 16); mesh(new THREE.SphereGeometry(0.25, 16, 8, 0, PI * 2, 0, PI / 2), M.brass, -0.9, by + br + 0.37, 0, g);
  box(1.15, 1.2, 1.26, green, 1.15, H(1.75), 0, g); const ft = cyl(0.63, 0.63, 1.15, green, 1.15, H(2.35), 0, g, 20); ft.rotation.z = PI / 2;
  for (const x of [0.61, 1.69]) { const bd = mesh(new THREE.TorusGeometry(0.634, 0.014, 5, 20, PI), M.brass, x, H(2.35), 0, g); bd.rotation.y = PI / 2; }
  cyl(0.2, 0.24, 0.1, M.brass, 1.15, H(3.0), 0, g, 14); cyl(0.13, 0.17, 0.4, M.brass, 1.15, H(3.24), 0, g, 14); cyl(0.17, 0.13, 0.06, M.brass, 1.15, H(3.47), 0, g, 14); cyl(0.03, 0.04, 0.3, M.brass, 1.55, H(3.1), 0.2, g, 6); cyl(0.045, 0.045, 0.1, M.brass, 1.55, H(3.28), 0.2, g, 8);
  for (const s of [-1, 1]) { const rail = cyl(0.02, 0.02, 3.3, M.brass, -0.95, by + 0.3, s * (br + 0.07), g, 6); rail.rotation.z = PI / 2; for (const x of [-2.5, -1.7, -0.9, -0.1, 0.6]) box(0.025, 0.025, 0.12, M.brass, x, by + 0.3, s * (br + 0.02), g); }
  /* the lamp on its bracket */
  box(0.1, 0.24, 0.1, dark, -2.95, by + br + 0.14, 0, g); box(0.24, 0.26, 0.24, dark, -2.98, by + br + 0.36, 0, g); const lamp = cyl(0.09, 0.09, 0.04, M.headlamp, -3.11, by + br + 0.36, 0, g, 10); lamp.rotation.z = PI / 2; g.userData.headlamp = lamp;
  /* the wheels: small, big, small. A brass-edged splasher covers the top of each big wheel, and a spring sits over its axle box */
  wheelset(0.5, -1.9, H(0.5), g, Wl, true); wheelset(R, 0.3, H(R), g, Wl, true); wheelset(0.5, 2.3, H(0.5), g, Wl, true);
  for (const s of [-1, 1]) {
    const sp = new THREE.CylinderGeometry(R + 0.07, R + 0.07, 0.24, 20, 1, false, PI - 1.0, 2.0); sp.rotateX(PI / 2); mesh(sp, green, 0.3, H(R), s * (Z + 0.04), g);
    const ed = mesh(new THREE.TorusGeometry(R + 0.07, 0.018, 5, 20, 2.0), M.brass, 0.3, H(R), s * (Z + 0.165), g); ed.rotation.z = PI / 2 - 1.0;
    box(1.9, 0.05, 0.3, dark, 0.3, H(1.2), s * 0.84, g); box(0.28, 0.3, 0.1, M.iron, 0.3, H(R), s * 0.98, g);
  }
  /* the open footplate: a wooden floor, low side sheets, handrails, the fire door and the driver's levers */
  box(1.3, 0.08, 1.9, M.woodDark, 2.35, H(1.2), 0, g); for (const s of [-1, 1]) { box(1.1, 0.55, 0.04, green, 2.3, H(1.5), s * 0.93, g); box(1.1, 0.03, 0.05, M.brass, 2.3, H(1.785), s * 0.93, g); cyl(0.02, 0.02, 1.0, M.brass, 2.92, H(1.72), s * 0.93, g, 6);
    for (const y of [0.78, 0.4]) box(0.42, 0.04, 0.26, M.woodDark, 2.7, H(y), s * 1.02, g); for (const dx of [-0.2, 0.2]) box(0.03, 0.85, 0.03, M.iron, 2.7 + dx, H(0.8), s * 1.13, g); }
  box(0.03, 0.4, 0.44, M.iron, 1.74, H(1.6), 0, g); box(0.02, 0.18, 0.28, fire, 1.76, H(1.6), 0, g); const reg = box(0.04, 0.04, 0.5, M.brass, 1.78, H(2.2), 0.1, g); reg.rotation.x = 0.4; const lev = box(0.04, 0.8, 0.04, M.steel, 2.1, H(1.6), 0.7, g); lev.rotation.z = -0.2;
  for (const z of [-0.3, 0.3]) { const gg = cyl(0.06, 0.06, 0.03, M.brass, 1.76, H(2.45), z, g, 10); gg.rotation.z = PI / 2; }
  /* the tender: a frame on four wheels, a green water tank with a flared top, coal, a tool box, a brake handle, the rear buffers */
  box(0.7, 0.08, 0.14, M.iron, 3.2, H(0.95), 0, g); box(tl + 0.3, 0.2, 1.9, frameM, tx, H(1.0), 0, g); for (const s of [-1, 1]) for (const dx of [-0.9, 0.9]) { box(0.5, 0.4, 0.07, frameM, tx + dx, H(0.72), s * 0.98, g); box(0.2, 0.2, 0.1, M.iron, tx + dx, H(0.5), s * 1.0, g); box(0.8, 0.045, 0.06, M.iron, tx + dx, H(1.16), s * 1.0, g); }
  box(tl, 0.85, 1.7, green, tx, H(1.52), 0, g); for (const s of [-1, 1]) { const fl = box(tl, 0.2, 0.04, green, tx, H(2.02), s * 0.89, g); fl.rotation.x = s * 0.45; box(tl, 0.03, 0.04, M.brass, tx, H(2.115), s * 0.935, g); for (const y of [1.2, 1.84]) box(tl - 0.3, 0.02, 0.012, lining, tx, H(y), s * 0.856, g); for (const dx of [-1, 1]) box(0.02, 0.64, 0.012, lining, tx + dx * (tl / 2 - 0.15), H(1.52), s * 0.856, g); }
  box(0.05, 0.2, 1.7, green, tx + tl / 2 - 0.025, H(2.03), 0, g); box(0.05, 0.2, 1.7, green, tx - tl / 2 + 0.025, H(2.03), 0, g);
  const mound = mesh(new THREE.SphereGeometry(1, 12, 8), M.coal, tx - 0.25, H(1.93), 0, g); mound.scale.set(1.05, 0.42, 0.72);
  for (let i = 0; i < 9; i++) mesh(new THREE.DodecahedronGeometry(0.14 + (i % 3) * 0.04, 0), M.coal, tx - 1.1 + (i % 5) * 0.4, H(2.26 - Math.abs((i % 5) - 2) * 0.08), -0.25 + Math.floor(i / 5) * 0.4 + (i % 2) * 0.05, g);
  box(0.5, 0.24, 0.9, M.woodDark, tx + tl / 2 - 0.35, H(2.07), 0, g); cyl(0.022, 0.022, 0.7, M.iron, tx + tl / 2 - 0.12, H(2.3), 0.62, g, 6); const bh = box(0.26, 0.03, 0.03, M.iron, tx + tl / 2 - 0.12, H(2.65), 0.62, g);
  box(0.16, 0.4, 2.0, M.red, tx + tl / 2 + 0.2, H(1.02), 0, g); for (const z of [-0.86, 0.86]) buffer(g, tx + tl / 2 + 0.28, H(1.02), z, 1); hook(g, tx + tl / 2 + 0.28, H(0.92), 1);
  wheelset(0.5, tx - 0.9, H(0.5), g, Wl, true); wheelset(0.5, tx + 0.9, H(0.5), g, Wl, true);
  batchStatic(g);   /* the parts that never move become a handful of meshes; the wheels still spin */
  return g;
}
export function steamLoco(kind = 'early') { return kind === 'early' ? earlyLoco() : lateLoco(); }

/* ---------- four-wheel stock of the 1840s to 1890s: one underframe for carriages and wagons (beams, buffers, hooks, axle guards, springs, spoked wheels) ---------- */
function underframe4(g, L, wheels, ax = L / 3) {
  for (const s of [-1, 1]) { box(L, 0.22, 0.1, M.under, 0, -0.2, s * 0.98, g); box(0.14, 0.26, 2.2, M.woodDark, s * (L / 2 - 0.07), -0.2, 0, g); for (const z of [-0.86, 0.86]) buffer(g, s * L / 2, -0.2, z, s, M.under, 0.38); hook(g, s * (L / 2), -0.3, s); }
  box(L - 0.3, 0.1, 1.9, M.under, 0, -0.14, 0, g);
  for (const dx of [-ax, ax]) { wheelset(0.45, dx, -0.65, g, wheels, true);
    for (const s of [-1, 1]) { for (const e of [-1, 1]) { const w = box(0.05, 0.46, 0.04, M.iron, dx + e * 0.15, -0.5, s * 1.0, g); w.rotation.z = e * 0.22; } box(0.2, 0.2, 0.12, M.iron, dx, -0.65, s * 1.02, g); for (let k = 0; k < 3; k++) box(0.9 - k * 0.2, 0.03, 0.07, M.iron, dx, -0.5 + k * 0.03, s * 1.02, g); for (const e of [-1, 1]) box(0.04, 0.16, 0.04, M.iron, dx + e * 0.45, -0.4, s * 1.02, g); } }
}

/* ---------- 1845 carriages: a closed first-class coach, and an open third-class one with benches. General pictures of carriages of that time, not copies. ---------- */
let _firstTex;
function firstTex() {   /* three compartments, each a door with a drop window between two small windows, like three stage coaches joined together */
  return _firstTex || (_firstTex = cv(1024, 384, (x, w, h) => {
    const r = rng(4); x.fillStyle = '#c9a23a'; x.fillRect(0, 0, w, h); x.fillStyle = '#22355a'; x.fillRect(0, h * 0.5, w, h * 0.5); x.fillStyle = '#16203a'; x.fillRect(0, 0, w, 22);
    for (let c = 0; c < 3; c++) { const cx = w / 6 + c * w / 3;
      x.strokeStyle = 'rgba(20,14,6,0.7)'; x.lineWidth = 3; x.strokeRect(cx - 62, 30, 124, h - 44);
      for (const [dx, ww] of [[-118, 70], [0, 92], [118, 70]]) { x.fillStyle = '#f2e6bd'; x.fillRect(cx + dx - ww / 2 - 6, 40, ww + 12, 128); const gl = x.createLinearGradient(0, 46, 0, 162); gl.addColorStop(0, '#3a4c5e'); gl.addColorStop(1, '#141e28'); x.fillStyle = gl; x.fillRect(cx + dx - ww / 2, 46, ww, 116); x.fillStyle = 'rgba(255,255,255,0.14)'; x.fillRect(cx + dx - ww / 2 + 6, 50, 12, 108); x.fillStyle = '#7a2a2a'; x.fillRect(cx + dx - ww / 2, 46, ww, 20); }
      x.strokeStyle = '#f2e6bd'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx - 160, h * 0.5 + 16); x.quadraticCurveTo(cx, h + 40, cx + 160, h * 0.5 + 16); x.stroke();   /* the curved line that recalls a road coach */
      x.fillStyle = '#c29a45'; x.fillRect(cx + 44, 196, 10, 26); }
    x.fillStyle = '#f2e6bd'; x.fillRect(0, h * 0.5 - 3, w, 5); x.font = '700 24px Georgia, serif'; x.textAlign = 'center'; x.fillText('FIRST CLASS', w / 2, h * 0.5 + 44); grain(x, w, h, 10);
  }));
}
export function carriage1845(kind = 'third', L = 5.2, W = 2.4, layout = 'rows') {
  const g = grp(), st = grp(g); g.userData.wheels = []; st.userData.noBatch = true;   /* the benches stay as plain boxes, so the seat check can still find them */
  if (kind === 'first') {
    const side = std(firstTex(), 0.7), cap = solid(0x22355a, 0.8), roofM = solid(0x2b2b30, 0.85); box(L - 0.01, 2.0, W - 0.01, cap, 0, 0.9, 0, g); for (const s of [-1, 1]) sidePlane(L, 2.0, side, 0, 0.9, s * W / 2, g, s);
    mesh(arcRoof(L + 0.24, W + 0.2, 0.2, 0.05, 2.4), roofM, 0, 1.9, 0, g);
    for (const s of [-1, 1]) { hrail(g, -L / 2 + 0.5, L / 2 - 0.5, 2.32, s * 0.8, M.brass, 1.4, 0.16); for (let c = 0; c < 3; c++) { const cx = -L / 3 + c * L / 3; box(0.5, 0.04, 0.24, M.woodDark, cx, -0.42, s * (W / 2 + 0.06), g); for (const dx of [-0.22, 0.22]) box(0.03, 0.36, 0.03, M.iron, cx + dx, -0.26, s * (W / 2 + 0.02), g); cyl(0.014, 0.014, 0.5, M.brass, cx + 0.3, 0.9, s * (W / 2 + 0.03), g, 5); } }
  } else {
    const pl = std(T.plank([120, 84, 56], 5, [1, 1], true), 0.9);
    box(L, 0.14, W, M.woodDark, 0, 0.1, 0, g); for (const s of [-1, 1]) { box(L, 0.55, 0.08, pl, 0, 0.5, s * (W / 2 - 0.04), g); box(L, 0.05, 0.12, M.woodDark, 0, 0.79, s * (W / 2 - 0.04), g); for (let x = -L / 2 + 0.7; x < L / 2 - 0.3; x += 1.1) box(0.06, 0.6, 0.03, M.iron, x, 0.48, s * (W / 2 + 0.012), g); }
    for (const s of [-1, 1]) { box(0.08, 0.55, W, pl, s * (L / 2 - 0.04), 0.5, 0, g); box(0.12, 0.05, W, M.woodDark, s * (L / 2 - 0.04), 0.79, 0, g); }
    if (layout === 'sides') for (const s of [-1, 1]) { box(L - 1.0, 0.06, 0.45, M.wood, 0, 0.45, s * (W / 2 - 0.32), st); box(L - 1.0, 0.45, 0.06, M.wood, 0, 0.75, s * (W / 2 - 0.08), st); for (const x of [-L / 2 + 0.8, L / 2 - 0.8]) box(0.08, 0.35, 0.4, M.woodDark, x, 0.27, s * (W / 2 - 0.32), st); }
    else for (let i = 0; i < 3; i++) { box(0.5, 0.06, W - 0.4, M.wood, -L / 2 + 1.0 + i * 1.5, 0.45, 0, st); box(0.06, 0.5, W - 0.4, M.wood, -L / 2 + 1.25 + i * 1.5, 0.75, 0, st); for (const z of [-W / 2 + 0.3, W / 2 - 0.3]) box(0.4, 0.3, 0.06, M.woodDark, -L / 2 + 1.0 + i * 1.5, 0.3, z, st); }
    for (const x0 of [-L / 2 + 0.05, L / 2 - 0.05]) for (const z of [-W / 2 + 0.05, W / 2 - 0.05]) { box(0.07, 1.9, 0.07, M.woodDark, x0, 1.0, z, g); mesh(new THREE.SphereGeometry(0.06, 8, 6), M.brass, x0, 1.98, z, g); }
  }
  underframe4(g, L, g.userData.wheels); batchStatic(g);   /* one carriage is a handful of meshes, even in a train that moves */ st.userData.noBatch = false;
  return g;
}

/* ---------- a goods wagon for bananas: slatted sides between iron-strapped posts, a hand brake lever ---------- */
export function wagon(L = 6.2, W = 2.5) {
  const g = grp(); g.userData.wheels = []; box(L, 0.16, W, M.woodDark, 0, 0.1, 0, g);
  for (const s of [-1, 1]) { for (let i = 0; i < 4; i++) box(L, 0.2, 0.06, M.wood, 0, 0.3 + i * 0.25, s * (W / 2 - 0.03), g); for (let x = -L / 2 + 0.05; x <= L / 2; x += (L - 0.1) / 4) { box(0.1, 1.0, 0.05, M.woodDark, x, 0.66, s * (W / 2 + 0.02), g); box(0.06, 0.04, 0.02, M.iron, x, 1.1, s * (W / 2 + 0.05), g); } }
  for (const s of [-1, 1]) { for (let i = 0; i < 4; i++) box(0.06, 0.2, W, M.wood, s * (L / 2 - 0.03), 0.3 + i * 0.25, 0, g); for (const z of [-0.6, 0.6]) box(0.05, 1.0, 0.1, M.woodDark, s * (L / 2 + 0.02), 0.66, z, g); }
  underframe4(g, L, g.userData.wheels);
  const bl = box(1.5, 0.05, 0.04, M.iron, 0.3, -0.5, 1.1, g); bl.rotation.z = 0.2; box(0.06, 0.5, 0.04, M.iron, 1.0, -0.42, 1.1, g);   /* the brake lever and its guide */
  batchStatic(g);
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
