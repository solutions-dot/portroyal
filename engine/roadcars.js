import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* engine/roadcars.js: road vehicles built in code, with a detailed look at a low cost.

   Each vehicle is drawn from its side outline (a Shape with the wheel arches cut out), pushed out to its width with rounded edges,
   and leaned in above the waist the way a real car body is. Wheels have a tyre, a rim and a hub cap. Then come glass, bumpers, lamps,
   door lines, handles and mirrors. Everything painted is ONE mesh with vertex colours and all the glass is a second mesh, so a vehicle
   costs two draw calls however much detail it has. The two materials are shared by every vehicle, so a game's batchStatic merges all
   the parked ones in a place into the same two meshes.

   Nothing carries a maker's badge, a name, a number or a livery: the caller gives the colours and adds any sign it has a source for.
   Number plates are blank. Vehicles face +x, stand on y = 0 and are centred on x and z. Jamaica and Britain drive on the left, so the
   driver sits on the right (+z) and a bus's door is on the left (-z).

     saloonCar({ colour, era })     era: '1960s' (small and round), '1970s' (three boxes, chrome bumpers), '1980s' (the same, dark bumpers), 'modern'
     bus({ colour, band, L })        a single-deck town bus with a front door, 1960s to 1980s
     van({ colour, stripe, L })      a small forward-control panel van
     lorry({ colour, body, bodyColour, L })   a forward-control lorry; body: 'tank' (water or fuel), 'fire' (a fire engine: lockers, ladder, hose reel) or 'flat'

   Each returns a Group; userData.size = [length, height, width]. */

export const PAINT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.12 }); PAINT.name = 'vehiclePaint';
export const GLASS = new THREE.MeshStandardMaterial({ color: 0x18242c, roughness: 0.16, metalness: 0.45, side: THREE.DoubleSide }); GLASS.name = 'vehicleGlass';
const TYRE = 0x151617, DARK = 0x1c1d20, CHROME = 0xc9ccd0, STEEL = 0x8f9499, LAMP = 0xf6f0d4, AMBER = 0xe08a1a, RED = 0xb01c16, PLATE = 0xe9e6da;

/* a kit collects coloured shapes and glass and merges them at the end */
function kit() {
  const paint = [], glass = [], tint = new THREE.Color();
  const plain = (g) => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') n.deleteAttribute(k); return n; };
  const K = {
    add(g, hex) { const n = plain(g); if (!n.attributes.color) { tint.set(hex); const a = new Float32Array(n.attributes.position.count * 3); for (let i = 0; i < a.length; i += 3) { a[i] = tint.r; a[i + 1] = tint.g; a[i + 2] = tint.b; } n.setAttribute('color', new THREE.BufferAttribute(a, 3)); } paint.push(n); return n; },
    glass(g) { const n = plain(g); n.deleteAttribute('color'); glass.push(n); return n; },
    box(w, h, d, x, y, z, hex, rz = 0, ry = 0) { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); if (ry) g.rotateY(ry); g.translate(x, y, z); return K.add(g, hex); },
    gbox(w, h, d, x, y, z, rz = 0) { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); g.translate(x, y, z); return K.glass(g); },
    cylX(r, len, x, y, z, hex, seg = 12, r2 = r) { const g = new THREE.CylinderGeometry(r2, r, len, seg); g.rotateZ(-Math.PI / 2); g.translate(x, y, z); return K.add(g, hex); },
    cylY(r, len, x, y, z, hex, seg = 10) { const g = new THREE.CylinderGeometry(r, r, len, seg); g.translate(x, y, z); return K.add(g, hex); },
    cylZ(r, len, x, y, z, hex, seg = 12) { const g = new THREE.CylinderGeometry(r, r, len, seg); g.rotateX(Math.PI / 2); g.translate(x, y, z); return K.add(g, hex); },
    /* a flat four-cornered pane from corner points [x, y, z], counter-clockwise seen from outside */
    pane(a, b, c, d, hex) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3)); g.computeVertexNormals(); return hex === undefined ? K.glass(g) : K.add(g, hex); },
    /* a road wheel on the ground at (x, z): side 1 faces +z, -1 faces -z. hub is the colour of the rim and hub cap */
    wheel(r, w, x, z, side, hub = STEEL, cap = CHROME) {
      const P = [[0.45, -w / 2], [0.93, -w / 2], [1, -w / 2 + 0.035], [1, w / 2 - 0.035], [0.93, w / 2], [0.7, w / 2 + 0.006], [0.66, w / 2 - 0.012], [0.6, w / 2 - 0.05], [0.4, w / 2 - 0.045], [0.3, w / 2 - 0.005], [0.12, w / 2 + 0.012], [0, w / 2 + 0.014]];
      const g = new THREE.LatheGeometry(P.map(([k, a]) => new THREE.Vector2(k * r, a)), 16), n = g.attributes.position.count, c = new Float32Array(n * 3), cs = [TYRE, TYRE, 0x222326, 0x222326, TYRE, TYRE, hub, hub, hub, cap, cap, cap].map((h) => new THREE.Color(h));
      for (let i = 0; i < n; i++) { const k = cs[i % P.length]; c[i * 3] = k.r; c[i * 3 + 1] = k.g; c[i * 3 + 2] = k.b; } g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      g.rotateX(side > 0 ? Math.PI / 2 : -Math.PI / 2); g.translate(x, r, z); return K.add(g); },
    done(L, H, W) { const g = new THREE.Group(); if (paint.length) { const m = new THREE.Mesh(mergeGeometries(paint), PAINT); m.name = 'vehicleBody'; g.add(m); } if (glass.length) { const m = new THREE.Mesh(mergeGeometries(glass), GLASS); m.name = 'vehicleGlass'; g.add(m); }
      for (const p of paint) p.dispose(); for (const p of glass) p.dispose(); g.userData.size = [L, H, W]; return g; },
  };
  return K;
}

/* The body shell, in two pieces so the sides stay flat: the lower body up to the waist, and the house above it (the cab or glasshouse), which leans in.
   top(sh) draws the lower outline from the rear bottom corner (x1, yb), up, along the waist and down to the front bottom corner (x0, yb); the bottom
   edge is closed here, with an arch cut for each wheel [x, tyre radius]. house(sh) draws the upper outline, starting and ending on the waist.
   lean(y) is how far the sides lean in at that height (1 = none): it must be a straight slope above the waist. */
function shell(K, o) {
  const { x0, x1, yb, W, hex } = o, bev = o.bevel || 0.035, ext = (sh) => { const g = new THREE.ExtrudeGeometry(sh, { depth: W - 2 * bev, bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 2, curveSegments: 8 }); g.translate(0, 0, -(W - 2 * bev) / 2); return g; };
  const sh = new THREE.Shape(); sh.moveTo(x1, yb); o.top(sh); sh.lineTo(x0, yb);
  for (const [x, r] of [...o.arches].sort((a, b) => b[0] - a[0])) { const R = r + (o.archGap || 0.07), dy = Math.max(0, r - yb), phi = Math.asin(Math.min(0.99, dy / R)); sh.lineTo(x + R * Math.cos(phi), yb); sh.absarc(x, r, R, -phi, Math.PI + phi, false); }
  sh.lineTo(x1, yb); const lower = ext(sh); lower.computeVertexNormals(); K.add(lower, hex);
  if (o.house) { const s2 = new THREE.Shape(); o.house(s2); s2.closePath(); const g = ext(s2), p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) * o.lean(p.getY(i))); g.computeVertexNormals(); K.add(g, o.houseHex !== undefined ? o.houseHex : hex); }
}

/* ---------- a saloon car ---------- */
const ERAS = {
  '1960s': { L: 3.8, W: 1.52, H: 1.4, r: 0.29, belt: 0.86, chrome: true, round: true },
  '1970s': { L: 4.2, W: 1.64, H: 1.37, r: 0.31, belt: 0.86, chrome: true },
  '1980s': { L: 4.3, W: 1.68, H: 1.37, r: 0.31, belt: 0.87 },
  modern: { L: 4.3, W: 1.74, H: 1.46, r: 0.33, belt: 0.96, modern: true },
};
export function saloonCar(o = {}) {
  const E = { ...(ERAS[o.era] || ERAS['1970s']), ...o }, { L, W, H, r, belt } = E, K = kit(), c = o.colour !== undefined ? o.colour : 0x8a2a2a, bev = 0.035, F = L / 2, h = F - bev, yb = 0.21, roof = H - bev;
  const trim = E.chrome ? CHROME : DARK, xf = h - (E.modern ? 0.82 : 0.76), xr = -h + (E.modern ? 0.8 : 0.9);
  /* the glasshouse: where the windscreen and the back window meet the waist and the roof */
  const G = E.modern ? { w0: h - 1.1, w1: h - 1.95, r1: -h + 1.0, r0: -h + 0.4 } : E.round ? { w0: h - 1.15, w1: h - 1.58, r1: -h + 1.3, r0: -h + 0.8 } : { w0: h - 1.2, w1: h - 1.66, r1: -h + 1.42, r0: -h + 0.98 };
  const lean = (y) => y > belt ? 1 - 0.13 * (y - belt) / (roof - belt) : 1, zs = (y) => W / 2 * lean(y);
  shell(K, { x0: h - 0.08, x1: -h + 0.08, yb, W, hex: c, bevel: bev, arches: [[xf, r], [xr, r]], lean,
    top(s) {
      if (E.modern) { s.lineTo(-h + 0.02, 0.42); s.quadraticCurveTo(-h - 0.02, 0.8, -h + 0.06, belt); s.lineTo(G.w0, belt); s.quadraticCurveTo(h - 0.5, belt - 0.06, h - 0.1, 0.74); s.quadraticCurveTo(h + 0.02, 0.66, h - 0.01, 0.4); }
      else if (E.round) { s.lineTo(-h + 0.01, 0.4); s.quadraticCurveTo(-h - 0.02, 0.62, -h + 0.14, 0.76); s.quadraticCurveTo(-h + 0.5, belt, G.r0, belt); s.lineTo(G.w0, belt); s.quadraticCurveTo(h - 0.5, belt, h - 0.16, 0.78); s.quadraticCurveTo(h + 0.03, 0.7, h - 0.01, 0.42); }
      else { s.lineTo(-h + 0.01, 0.42); s.lineTo(-h + 0.03, belt - 0.07); s.lineTo(-h + 0.1, belt - 0.03); s.lineTo(G.r0, belt); s.lineTo(G.w0, belt); s.lineTo(h - 0.1, belt - 0.08); s.quadraticCurveTo(h, belt - 0.11, h - 0.005, belt - 0.22); s.lineTo(h - 0.01, 0.42); }
      s.lineTo(h - 0.08, yb); },
    house(s) { s.moveTo(G.r0, belt);
      if (E.modern) { s.quadraticCurveTo(G.r0 + 0.2, roof - 0.12, G.r1, roof); s.quadraticCurveTo(0, roof + 0.03, G.w1, roof - 0.01); }
      else if (E.round) { s.quadraticCurveTo(G.r0 + 0.08, roof - 0.06, G.r1, roof); s.quadraticCurveTo((G.r1 + G.w1) / 2, roof + 0.04, G.w1, roof - 0.01); }
      else { s.lineTo(G.r1 - 0.06, roof - 0.03); s.quadraticCurveTo(G.r1, roof, G.r1 + 0.1, roof); s.lineTo(G.w1 - 0.1, roof); s.quadraticCurveTo(G.w1, roof, G.w1 + 0.06, roof - 0.04); }
      s.lineTo(G.w0, belt); } });
  /* glass: two windows a side, the windscreen and the back window */
  const yb0 = belt + 0.085, yb1 = roof - 0.07, fx = (y) => G.w0 + (G.w1 - G.w0) * (y - belt) / (roof - belt), rx = (y) => G.r0 + (G.r1 - G.r0) * (y - belt) / (roof - belt), xb = (G.w1 + G.r1) / 2 + 0.12;
  for (const s of [1, -1]) { const z0 = s * (zs(yb0) + 0.004), z1 = s * (zs(yb1) + 0.004);
    K.pane([xb + 0.04, yb0, z0], [fx(yb0) - 0.11, yb0, z0], [fx(yb1) - 0.11, yb1, z1], [xb + 0.04, yb1, z1]); K.pane([rx(yb0) + (E.round ? 0.2 : 0.12), yb0, z0], [xb - 0.04, yb0, z0], [xb - 0.04, yb1, z1], [rx(yb1) + (E.round ? 0.16 : 0.12), yb1, z1]);
    /* door lines, handles, a strip along the side, the sill */
    for (const x of [xb, fx(belt) - 0.02, Math.max(xr + r + 0.16, rx(belt) + 0.02)]) K.box(0.014, belt - 0.36, 0.012, x, (belt + 0.36) / 2 + 0.02, s * (W / 2 + 0.002), 0x101114);
    for (const x of [xb + 0.16, Math.max(xr + r + 0.3, rx(belt) + 0.16)]) K.box(0.13, 0.026, 0.03, x, belt - 0.1, s * (W / 2 + 0.01), E.modern ? c : trim);
    if (E.chrome) K.box(L - 0.5, 0.022, 0.014, 0, belt - 0.24, s * (W / 2 + 0.004), CHROME); else if (!E.modern) K.box(L - 0.5, 0.05, 0.012, 0, 0.52, s * (W / 2 + 0.004), DARK);
    K.box(xf - xr - 2 * r - 0.2, 0.05, 0.03, (xf + xr) / 2, yb + 0.03, s * (W / 2 - 0.01), DARK);
    for (const x of [xf, xr]) K.wheel(r, 0.19, x, s * (W / 2 - 0.115), s, E.modern ? 0xb9bdc2 : STEEL, E.modern ? 0x8d9196 : CHROME); }
  { const n = [roof - belt, G.w0 - G.w1], nl = Math.hypot(n[0], n[1]), ox = n[0] / nl * (bev + 0.005), oy = n[1] / nl * (bev + 0.005), y0 = belt + 0.07, y1 = roof - 0.07;   /* the windscreen */
    K.pane([fx(y0) + ox, y0 + oy, zs(y0) - 0.09], [fx(y0) + ox, y0 + oy, -zs(y0) + 0.09], [fx(y1) + ox, y1 + oy, -zs(y1) + 0.1], [fx(y1) + ox, y1 + oy, zs(y1) - 0.1]);
    for (const s of [1, -1]) K.box(0.34, 0.012, 0.02, fx(y0) + ox + 0.025, y0 + oy + 0.01, s * 0.3 - 0.1, 0x101114);   /* wipers */
    const m = [-(roof - belt), G.r1 - G.r0], ml = Math.hypot(m[0], m[1]), px = m[0] / ml * (bev + 0.005), py = m[1] / ml * (bev + 0.005);   /* the back window */
    if (!E.round) K.pane([rx(y0) + px, y0 + py, -zs(y0) + 0.1], [rx(y0) + px, y0 + py, zs(y0) - 0.1], [rx(y1) + px, y1 + py, zs(y1) - 0.11], [rx(y1) + px, y1 + py, -zs(y1) + 0.11]);
    else { const ya = belt + 0.2, yc = roof - 0.12, bx = (y) => G.r0 + 0.01 + (G.r1 - G.r0) * Math.pow((y - belt) / (roof - belt), 1.5) - 0.045; K.pane([bx(ya), ya, -zs(ya) + 0.14], [bx(ya), ya, zs(ya) - 0.14], [bx(yc), yc, zs(yc) - 0.16], [bx(yc), yc, -zs(yc) + 0.16]); } }
  /* bumpers, grille, lamps, blank plates, mirrors, exhaust */
  const bump = E.chrome ? CHROME : E.modern ? c : DARK, by = E.modern ? 0.46 : 0.44, nose = E.round ? F - 0.03 : F;
  if (E.modern) { for (const s of [1, -1]) K.box(0.03, 0.12, W * 0.6, s * (F - 0.012), 0.36, 0, DARK); }
  else for (const s of [1, -1]) { K.box(0.09, 0.1, W * 0.96, s * (F + 0.03), by, 0, bump); for (const z of [1, -1]) K.box(0.2, 0.1, 0.045, s * (F - 0.06), by, z * (W / 2 + 0.005), bump); }
  K.box(0.02, E.modern ? 0.09 : 0.17, W * (E.modern ? 0.42 : 0.5), nose + 0.003, E.modern ? 0.62 : 0.63, 0, 0x0e0f11);
  if (!E.modern) for (let i = 0; i < 4; i++) K.box(0.024, 0.012, W * 0.48, nose + 0.006, 0.57 + i * 0.04, 0, E.chrome ? CHROME : 0x3a3d40);
  for (const z of [1, -1]) { const zz = z * (W / 2 - 0.2);
    if (E.modern) { K.box(0.04, 0.075, 0.32, F - 0.03, 0.69, z * (W / 2 - 0.22), LAMP, 0, -z * 0.28); K.box(0.04, 0.1, 0.28, -F + 0.02, 0.8, z * (W / 2 - 0.2), RED, 0, z * 0.22); }
    else { K.cylX(0.082, 0.04, nose + 0.004, 0.64, zz, LAMP, 12); K.cylX(0.097, 0.03, nose - 0.004, 0.64, zz, trim, 12); K.box(0.02, 0.04, 0.1, nose + 0.004, 0.535, zz, AMBER);
      K.box(0.03, E.round ? 0.13 : 0.09, E.round ? 0.08 : 0.24, -F + (E.round ? 0.05 : 0.0), E.round ? 0.66 : 0.72, z * (W / 2 - (E.round ? 0.12 : 0.2)), RED); if (!E.round) K.box(0.03, 0.09, 0.07, -F + 0.0, 0.72, z * (W / 2 - 0.37), AMBER); } }
  K.box(0.016, 0.1, 0.34, F + (E.modern ? 0.004 : 0.078), E.modern ? 0.47 : by, 0, PLATE); K.box(0.016, 0.1, 0.34, -F - (E.modern ? 0.004 : 0.078), E.modern ? 0.56 : by, 0, PLATE);
  for (const s of E.modern || !E.chrome ? [1, -1] : [1]) { K.box(0.07, 0.065, 0.1, fx(belt) - 0.14, belt + 0.1, s * (W / 2 + 0.055), E.modern ? c : trim); K.box(0.03, 0.02, 0.06, fx(belt) - 0.14, belt + 0.07, s * (W / 2 + 0.01), E.modern ? DARK : trim); }
  K.cylX(0.022, 0.16, -F + 0.02, 0.25, -W / 2 + 0.3, STEEL, 8);
  return K.done(L, H, W);
}

/* ---------- a single-deck town bus ---------- */
export function bus(o = {}) {
  const L = o.L || 9, W = o.W || 2.4, H = o.H || 3.0, K = kit(), c = o.colour !== undefined ? o.colour : 0xe8e4d6, band = o.band !== undefined ? o.band : 0x2f6a4a, bev = 0.08, F = L / 2, h = F - bev, r = 0.47, yb = 0.42, xf = h - 2.45, xr = -h + 2.5, waist = 1.7, top = 2.6, rt = H - bev;
  const lean = (y) => y > waist ? 1 - 0.05 * (y - waist) / (rt - waist) : 1, zs = (y) => W / 2 * lean(y);
  shell(K, { x0: h - 0.1, x1: -h + 0.1, yb, W, hex: c, bevel: bev, arches: [[xf, r], [xr, r]], archGap: 0.09, lean,
    top(s) { s.lineTo(-h, 0.62); s.lineTo(-h, waist); s.lineTo(h, waist); s.lineTo(h, 0.62); s.lineTo(h - 0.1, yb); },
    house(s) { s.moveTo(-h, waist); s.lineTo(-h, rt - 0.45); s.quadraticCurveTo(-h + 0.02, rt, -h + 0.5, rt); s.lineTo(h - 0.7, rt); s.quadraticCurveTo(h - 0.1, rt, h - 0.07, rt - 0.5); s.lineTo(h, waist); } });
  /* the coloured band below the windows, all the way round, a rail at the waist and the gutter */
  for (const s of [1, -1]) { K.box(L - 0.3, 0.5, 0.016, 0, 1.0, s * (W / 2 + 0.003), band); K.box(0.016, 0.5, W - 0.24, s * (F + 0.003), 1.0, 0, band); K.box(L - 0.24, 0.035, 0.03, 0, waist - 0.05, s * (W / 2 + 0.008), STEEL); K.box(L - 0.7, 0.035, 0.04, 0, H - 0.3, s * (zs(H - 0.3) - 0.0), STEEL); }
  /* windows: bays along each side, each with a sliding top light; the door takes the front bay on the left */
  const x0 = -h + 0.5, x1 = h - 0.62, n = Math.max(5, Math.round((x1 - x0) / 1.18)), bay = (x1 - x0) / n, y0 = waist + 0.1, y1 = top, doorW = 0.98, dx = x1 - 0.1 - doorW / 2;
  for (const s of [1, -1]) for (let i = 0; i < n; i++) { const a = x0 + i * bay + 0.055, b = x0 + (i + 1) * bay - 0.055; if (s < 0 && b > dx - doorW / 2 - 0.05) continue;
    const zA = s * (zs(y0) + 0.006), zB = s * (zs(y1) + 0.006); K.pane([a, y0, zA], [b, y0, zA], [b, y1, zB], [a, y1, zB]); K.box(b - a, 0.026, 0.02, (a + b) / 2, y1 - 0.27, s * (zs(y1 - 0.27) + 0.01), STEEL); }
  { /* the door: two leaves with long glass, a dark rubber edge between them and a step below */
    const z = -(W / 2 + 0.004); K.box(doorW + 0.08, top - 0.52, 0.012, dx, (top + 0.52) / 2, z, 0x2c2f32); for (const k of [-1, 1]) { K.box(doorW / 2 - 0.03, top - 0.6, 0.016, dx + k * doorW / 4, (top + 0.56) / 2, z - 0.006, c); K.gbox(doorW / 2 - 0.15, 1.3, 0.01, dx + k * doorW / 4, 1.83, z - 0.016); K.box(0.03, 0.3, 0.03, dx + k * 0.07, 1.08, z - 0.03, STEEL); }
    K.box(doorW, 0.06, 0.1, dx, yb + 0.05, z + 0.03, DARK); }
  /* the front: a two-pane windscreen, the box for the route sign above it, lamps, a small grille, a bumper */
  const rake = 0.07 / (rt - 0.5 - waist);   /* how far the front leans back for each metre up */
  { const xw = (y) => F + 0.006 - (y - waist) * rake, wy0 = waist + 0.1, wy1 = 2.42;
    for (const s of [1, -1]) { K.pane([xw(wy0), wy0, s * 0.035], [xw(wy0), wy0, s * (zs(wy0) - 0.16)], [xw(wy1), wy1, s * (zs(wy1) - 0.2)], [xw(wy1), wy1, s * 0.035]); K.box(0.4, 0.016, 0.02, xw(wy0) + 0.012, wy0 + 0.02, s * 0.55, 0x101114, 0, Math.PI / 2 - 0.25); }
    K.box(0.03, 0.3, 1.5, xw(2.72) - 0.02, 2.7, 0, 0x101114, rake); K.box(0.02, 0.34, 0.9, F + 0.004, 0.6, 0, 0x101114); for (let i = 0; i < 5; i++) K.box(0.026, 0.016, 0.86, F + 0.008, 0.48 + i * 0.06, 0, STEEL);
    for (const z of [1, -1]) { K.cylX(0.11, 0.04, F + 0.004, 0.94, z * (W / 2 - 0.34), LAMP, 12); K.cylX(0.13, 0.03, F - 0.004, 0.94, z * (W / 2 - 0.34), STEEL, 12); K.box(0.02, 0.07, 0.13, F + 0.004, 1.34, z * (W / 2 - 0.3), AMBER);
      K.box(0.04, 0.04, 0.34, F - 0.12, 2.3, z * (W / 2 + 0.12), DARK); K.box(0.03, 0.28, 0.15, F - 0.1, 2.14, z * (W / 2 + 0.3), DARK); }
    K.box(0.016, 0.11, 0.36, F + 0.078, 0.56, 0, PLATE); for (const s of [1, -1]) K.box(0.14, 0.2, W * 0.98, s * (F + 0.0), 0.5, 0, DARK); }
  /* the back: a window, an engine cover, lamps */
  { const xw = -F - 0.006; K.pane([xw, 1.85, -W / 2 + 0.36], [xw, 1.85, W / 2 - 0.36], [xw, 2.45, W / 2 - 0.4], [xw, 2.45, -W / 2 + 0.4]); for (let i = 0; i < 4; i++) K.box(0.02, 0.02, 1.0, -F - 0.012, 1.34 + i * 0.07, 0, 0x3a3d40);
    for (const z of [1, -1]) { K.box(0.03, 0.2, 0.12, -F - 0.004, 1.42, z * (W / 2 - 0.2), RED); K.box(0.03, 0.08, 0.12, -F - 0.004, 1.58, z * (W / 2 - 0.2), AMBER); } K.box(0.016, 0.11, 0.36, -F - 0.078, 0.56, 0, PLATE); }
  for (const x of [-L * 0.28, 0, L * 0.28]) K.box(0.7, 0.06, 0.9, x, H - 0.0, 0, STEEL);   /* roof ventilators */
  for (const s of [1, -1]) { K.wheel(r, 0.26, xf, s * (W / 2 - 0.16), s, 0x9a9d9f, 0x8a8d8f); K.wheel(r, 0.26, xr, s * (W / 2 - 0.16), s, 0x9a9d9f, 0x8a8d8f); }
  const g = K.done(L, H, W); g.userData.sign = { front: [F + 0.01 - (2.7 - waist) * rake, 2.7, 0], rake, side: [dx - 1.5, top + 0.2, -(zs(top + 0.2) + 0.012)] }; return g;   /* where a game may put its own route sign: on the box over the windscreen, and on the left side */
}

/* ---------- a small forward-control panel van ---------- */
export function van(o = {}) {
  const L = o.L || 3.5, W = o.W || 1.6, H = o.H || 1.82, K = kit(), c = o.colour !== undefined ? o.colour : 0xe6e2d4, bev = 0.045, F = L / 2, h = F - bev, r = 0.29, yb = 0.24, xf = h - 0.6, xr = -h + 0.8, waist = 1.02, roof = H - bev;
  const lean = (y) => y > waist ? 1 - 0.07 * (y - waist) / (roof - waist) : 1, zs = (y) => W / 2 * lean(y), w0 = h - 0.04, w1 = h - 0.5, wy = roof - 0.1;
  shell(K, { x0: h - 0.1, x1: -h + 0.06, yb, W, hex: c, bevel: bev, arches: [[xf, r], [xr, r]], lean,
    top(s) { s.lineTo(-h, 0.45); s.lineTo(-h, waist); s.lineTo(h, waist); s.lineTo(h, waist - 0.2); s.lineTo(h - 0.02, 0.45); s.lineTo(h - 0.1, yb); },
    house(s) { s.moveTo(-h, waist); s.lineTo(-h, roof - 0.12); s.quadraticCurveTo(-h, roof, -h + 0.14, roof); s.lineTo(w1 - 0.25, roof); s.quadraticCurveTo(w1 - 0.06, roof, w1, wy); s.lineTo(w0, waist); } });
  const fx = (y) => w0 + (w1 - w0) * (y - waist) / (wy - waist), y0 = waist + 0.09, y1 = wy - 0.06, nl = Math.hypot(wy - waist, w0 - w1), ox = (wy - waist) / nl * (bev + 0.005), oy = (w0 - w1) / nl * (bev + 0.005);
  K.pane([fx(y0) + ox, y0 + oy, zs(y0) - 0.1], [fx(y0) + ox, y0 + oy, -zs(y0) + 0.1], [fx(y1) + ox, y1 + oy, -zs(y1) + 0.12], [fx(y1) + ox, y1 + oy, zs(y1) - 0.12]);   /* windscreen */
  for (const s of [1, -1]) { const zA = s * (zs(y0) + 0.005), zB = s * (zs(y1) + 0.005), b = h - 1.2; K.pane([b, y0, zA], [fx(y0) - 0.12, y0, zA], [fx(y1) - 0.12, y1, zB], [b, y1, zB]);   /* cab door window */
    for (const x of [h - 1.27, h - 0.3]) K.box(0.014, 0.74, 0.012, x, 0.68, s * (W / 2 + 0.002), 0x101114); K.box(0.12, 0.026, 0.03, h - 1.13, waist - 0.12, s * (W / 2 + 0.012), DARK);
    for (const x of [-h + 0.2, h - 1.42]) K.box(0.012, 1.3, 0.01, x, 1.02, s * (zs(1.3) + 0.002), 0x2a2c2e, 0, 0);   /* the panel seams of the load space */
    if (o.stripe !== undefined) K.box(L - 0.2, 0.12, 0.012, 0, waist - 0.08, s * (W / 2 + 0.003), o.stripe);
    K.box(0.07, 0.1, 0.1, fx(waist) - 0.2, waist + 0.2, s * (W / 2 + 0.05), DARK);
    for (const x of [xf, xr]) K.wheel(r, 0.18, x, s * (W / 2 - 0.11), s, 0xd9d6cc, CHROME); }
  for (const s of [1, -1]) K.box(0.08, 0.1, W * 0.97, s * (F + 0.02), 0.42, 0, STEEL);
  for (const z of [1, -1]) { K.cylX(0.08, 0.04, F + 0.004, 0.76, z * (W / 2 - 0.26), LAMP, 12); K.cylX(0.095, 0.03, F - 0.006, 0.76, z * (W / 2 - 0.26), CHROME, 12); K.box(0.02, 0.045, 0.09, F + 0.004, 0.6, z * (W / 2 - 0.26), AMBER); K.box(0.02, 0.16, 0.08, -F - 0.004, 0.72, z * (W / 2 - 0.12), RED); }
  K.box(0.02, 0.08, 0.5, F + 0.004, 0.76, 0, 0x101114); K.box(0.016, 0.1, 0.32, F + 0.064, 0.42, 0, PLATE); K.box(0.016, 0.1, 0.32, -F - 0.064, 0.42, 0, PLATE);
  K.box(0.012, 1.25, 0.012, -F - 0.004, 1.0, 0, 0x101114); for (const z of [0.36, -0.36]) K.gbox(0.012, 0.36, 0.5, -F - 0.006, 1.4, z); K.box(0.03, 0.1, 0.03, -F - 0.012, 0.98, 0.05, DARK);   /* two back doors */
  return K.done(L, H, W);
}

/* ---------- a forward-control lorry ---------- */
export function lorry(o = {}) {
  const L = o.L || 6.6, W = o.W || 2.2, K = kit(), c = o.colour !== undefined ? o.colour : 0xe8e8e4, bc = o.bodyColour !== undefined ? o.bodyColour : 0x2a6ab0, bev = 0.06, F = L / 2, h = F - bev, r = o.r || 0.5, body = o.body || 'flat';
  const cabL = 1.75, cx0 = h - cabL, H = o.H || 2.55, floor = 0.92, waist = 1.6, roof = H - bev, xf = h - 0.92, rear = o.axles === 1 || L < 5.6 ? [-F + 1.5] : [-F + 1.05, -F + 2.25];
  const lean = (y) => y > waist ? 1 - 0.06 * (y - waist) / (roof - waist) : 1, zs = (y) => W / 2 * lean(y), w0 = h - 0.02, w1 = h - 0.22, wy = roof - 0.12;
  /* the cab */
  shell(K, { x0: h - 0.08, x1: cx0, yb: 0.62, W, hex: c, bevel: bev, arches: [[xf, r]], archGap: 0.1, lean,
    top(s) { s.lineTo(cx0, waist); s.lineTo(h, waist); s.lineTo(h, 0.8); s.lineTo(h - 0.08, 0.62); },
    house(s) { s.moveTo(cx0, waist); s.lineTo(cx0, roof - 0.1); s.quadraticCurveTo(cx0, roof, cx0 + 0.12, roof); s.lineTo(w1 - 0.26, roof); s.quadraticCurveTo(w1 - 0.06, roof, w1, wy); s.lineTo(w0, waist); } });
  const fx = (y) => w0 + (w1 - w0) * (y - waist) / (wy - waist), y0 = waist + 0.1, y1 = wy - 0.08, nl = Math.hypot(wy - waist, w0 - w1), ox = (wy - waist) / nl * (bev + 0.005), oy = (w0 - w1) / nl * (bev + 0.005);
  for (const s of [1, -1]) K.pane([fx(y0) + ox, y0 + oy, s * 0.03], [fx(y0) + ox, y0 + oy, s * (zs(y0) - 0.12)], [fx(y1) + ox, y1 + oy, s * (zs(y1) - 0.14)], [fx(y1) + ox, y1 + oy, s * 0.03]);   /* a two-pane windscreen */
  for (const s of [1, -1]) { const zA = s * (zs(y0) + 0.006), zB = s * (zs(y1) + 0.006), b = cx0 + 0.3; K.pane([b, y0, zA], [fx(y0) - 0.2, y0, zA], [fx(y1) - 0.2, y1, zB], [b, y1, zB]);
    for (const x of [cx0 + 0.2, h - 0.4]) K.box(0.014, 0.8, 0.012, x, 1.18, s * (W / 2 + 0.002), 0x101114); K.box(0.13, 0.03, 0.03, cx0 + 0.36, waist - 0.14, s * (W / 2 + 0.014), DARK);
    K.box(0.3, 0.05, 0.3, cx0 + 0.55, 0.56, s * (W / 2 - 0.16), DARK); K.box(0.04, 0.04, 0.3, F - 0.2, 2.0, s * (W / 2 + 0.1), DARK); K.box(0.03, 0.3, 0.16, F - 0.18, 1.9, s * (W / 2 + 0.26), DARK);   /* step and mirror */
    K.wheel(r, 0.28, xf, s * (W / 2 - 0.17), s, 0xb4b7ba, 0x8a8d8f); for (const x of rear) { K.wheel(r, 0.5, x, s * (W / 2 - 0.27), s, 0xb4b7ba, 0x8a8d8f); K.box(1.25, 0.04, 0.56, x, 2 * r + 0.12, s * (W / 2 - 0.28), DARK); } }
  K.box(0.02, 0.36, 1.1, F + 0.004, 1.12, 0, 0x101114); for (let i = 0; i < 5; i++) K.box(0.026, 0.018, 1.04, F + 0.008, 0.98 + i * 0.07, 0, STEEL);
  for (const z of [1, -1]) { K.cylX(0.1, 0.04, F + 0.004, 1.1, z * (W / 2 - 0.26), LAMP, 12); K.cylX(0.12, 0.03, F - 0.006, 1.1, z * (W / 2 - 0.26), STEEL, 12); K.box(0.02, 0.06, 0.12, F + 0.004, 1.32, z * (W / 2 - 0.26), AMBER); }
  K.box(0.16, 0.22, W * 0.98, F + 0.0, 0.72, 0, STEEL); K.box(0.016, 0.11, 0.36, F + 0.086, 0.72, 0, PLATE);
  /* the chassis, a fuel tank, the back lamps */
  for (const z of [1, -1]) K.box(L - cabL + 0.5, 0.2, 0.1, -cabL / 2 + 0.2, 0.78, z * 0.42, DARK); for (const x of rear) K.cylZ(0.07, W - 0.6, x, r, 0, DARK, 8);
  K.cylX(0.24, 0.8, cx0 - 0.75, 0.62, W / 2 - 0.3, STEEL, 12); K.box(0.1, 0.16, W * 0.9, -F + 0.05, 0.72, 0, DARK); for (const z of [1, -1]) K.box(0.04, 0.1, 0.2, -F + 0.0, 0.74, z * (W / 2 - 0.3), RED); K.box(0.016, 0.11, 0.36, -F - 0.006, 0.74, 0, PLATE);
  const bx0 = cx0 - 0.2, bx1 = -F + 0.02, bl = bx0 - bx1, bcx = (bx0 + bx1) / 2;
  if (body === 'tank') { const R = Math.min(0.95, W / 2 - 0.12), cy = floor + 0.1 + R, tl = bl - 0.7;
    K.cylX(R, tl, bcx, cy, 0, bc, 20); for (const s of [1, -1]) { const d = new THREE.SphereGeometry(R, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2); d.scale(1, 0.32, 1); d.rotateZ(s > 0 ? -Math.PI / 2 : Math.PI / 2); d.translate(bcx + s * tl / 2, cy, 0); K.add(d, bc); }
    const dk = new THREE.Color(bc).multiplyScalar(0.62).getHex(); for (const k of [-0.36, 0, 0.36]) K.cylX(R + 0.018, 0.09, bcx + k * tl, cy, 0, dk, 20);
    for (const k of [-0.3, 0.3]) K.box(0.22, 0.34, W * 0.72, bcx + k * tl, floor + 0.07, 0, DARK);   /* the saddles the tank sits in */
    K.cylY(0.26, 0.12, bcx + 0.4, cy + R + 0.03, 0, dk, 14); K.cylY(0.29, 0.03, bcx + 0.4, cy + R + 0.1, 0, STEEL, 14); K.box(tl * 0.8, 0.03, 0.5, bcx, cy + R + 0.0, 0, STEEL);   /* the filler hatch and the walkway on top */
    for (const z of [-0.16, 0.16]) K.box(0.04, 2 * R + 0.2, 0.04, bx1 + 0.12, cy, z + 0.5, STEEL); for (let i = 0; i < 6; i++) K.box(0.03, 0.03, 0.36, bx1 + 0.12, cy - R + 0.12 + i * 0.32, 0.5, STEEL);   /* a ladder at the back */
    K.cylX(0.06, 0.3, bx1 + 0.2, floor + 0.3, -0.3, STEEL, 10); K.cylX(0.1, 0.05, bx1 + 0.04, floor + 0.3, -0.3, 0xa02a20, 10);   /* the outlet pipe and its valve wheel */
    { const hose = new THREE.TorusGeometry(0.3, 0.045, 6, 16); hose.translate(bcx - 0.2, floor + 0.36, -(W / 2 - 0.06)); K.add(hose, 0x2b2d30); K.box(0.5, 0.05, 0.12, bcx - 0.2, floor + 0.02, -(W / 2 - 0.08), DARK); } }
  else if (body === 'fire') { const bh = 1.5, by = floor + bh / 2 - 0.1, bw = W;   /* lockers with roller shutters, a pump panel, a ladder on the roof, a hose reel, a red lamp on the cab */
    K.box(bl, bh, bw, bcx, by, 0, bc); const n = Math.max(2, Math.round(bl / 1.3)), lw = (bl - 0.3) / n;
    for (const s of [1, -1]) for (let i = 0; i < n; i++) { const x = bx1 + 0.15 + (i + 0.5) * lw; if (i === 0) { K.box(lw - 0.14, 0.9, 0.02, x, by + 0.12, s * (bw / 2 + 0.006), 0x3a3d40); for (const k of [-1, 1]) { K.cylZ(0.07, 0.05, x + k * 0.2, by + 0.3, s * (bw / 2 + 0.03), 0xc8a030, 10); K.cylZ(0.05, 0.04, x + k * 0.2, by - 0.05, s * (bw / 2 + 0.03), STEEL, 8); } }
      else { K.box(lw - 0.14, 1.0, 0.02, x, by + 0.1, s * (bw / 2 + 0.006), 0xb9bdc1); for (let j = 0; j < 7; j++) K.box(lw - 0.16, 0.012, 0.024, x, by - 0.32 + j * 0.14, s * (bw / 2 + 0.008), 0x7e8388); K.box(0.2, 0.03, 0.04, x, by - 0.36, s * (bw / 2 + 0.02), DARK); } }
    for (const z of [-0.3, 0.3]) { K.box(bl + 0.5, 0.05, 0.05, bcx + 0.2, by + bh / 2 + 0.2, z, 0xc9b88a); for (const x of [bx1 + 0.4, bx0 - 0.3]) K.box(0.05, 0.2, 0.05, x, by + bh / 2 + 0.1, z, STEEL); } for (let i = 0; i < Math.round((bl + 0.5) / 0.32); i++) K.box(0.035, 0.035, 0.6, bx1 + 0.05 + i * 0.32, by + bh / 2 + 0.2, 0, 0xc9b88a);
    K.cylZ(0.28, 0.44, bx1 + 0.5, by + bh / 2 + 0.31, 0.72, 0x8a2a20, 14); for (const z of [0.48, 0.96]) K.cylZ(0.32, 0.04, bx1 + 0.5, by + bh / 2 + 0.33, z, STEEL, 14);
    K.cylY(0.09, 0.14, h - 0.9, H + 0.07, 0, 0xc0241c, 10); K.cylY(0.11, 0.03, h - 0.9, H + 0.0, 0, STEEL, 10); K.box(0.02, 1.1, 0.9, bx1 - 0.004, by, 0, 0xb9bdc1); }
  else { K.box(bl, 0.1, W, bcx, floor + 0.05, 0, 0x8a6a48); for (const s of [1, -1]) K.box(bl, 0.4, 0.05, bcx, floor + 0.3, s * (W / 2 - 0.025), bc); K.box(0.05, 0.4, W, bx1 + 0.025, floor + 0.3, 0, bc); K.box(0.06, 0.9, W, bx0 - 0.03, floor + 0.55, 0, bc); }
  return K.done(L, body === 'tank' ? floor + 2.2 : H, W);
}
