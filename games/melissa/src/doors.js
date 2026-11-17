/* games/melissa/src/doors.js: the front doors of Hurricane Melissa's houses, each made for its own building and year (owner, 17 November 2026: "the doors
   should fit their purpose, not one shared one"). Every builder returns a THREE.Group whose origin is the middle of the foot of the opening, on the
   wall's outer face, facing +z, so a house turns it with the rest of its front. Nothing stands more than 0.2 m off the wall (a grille gate's lugs).
     boardDoor51     a 1951 board house: a door of upright boards, plain outside (ledges and braces inside), butt hinges, a hasp and staple
     pairBoard       an old board house: a pair of narrow board leaves, the top third a fixed wooden jalousie to let air in, painted
     jalousieBoard88 a board house in 1988: the old board door with a wooden jalousie put in its top half, painted, and a cheap knob set
     jalousiePair51  a 1951 block house: a pair of full-height wooden jalousie doors with a middle rail, painted green, brass knob
     panelGrille88   a 1988 block house: a varnished hardwood door of raised panels behind a flat-bar burglar-bar gate with a padlock
     scrollGrille25  a 2025 block house: a painted door with a small half-moon light, behind a scrolled iron grille gate painted white or black
     churchDoors     a village church: a pair of tall board doors under a pointed arch, ring handles and strap hinges
     shopDoor        a small shop: a board door with a heavy hasp and padlock, behind the counter
     villaDoors      an uptown house of the 1980s: a pair of carved hardwood doors with brass levers behind a white decorative grille
   What each is modelled on, and what is still a stand-in, is in docs/games/melissa.md ("Doors"). */
import * as THREE from 'three';

const MATS = new Map();
const mat = (name, color, rough = 0.85, metal = 0) => { const k = name + color + rough + metal; if (!MATS.has(k)) { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }); m.name = name; MATS.set(k, m); } return MATS.get(k); };
const B = (g, m, w, h, d, x, y, z, rz = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.z = rz; o.castShadow = o.receiveShadow = true; g.add(o); return o; };
const C = (g, m, r, l, x, y, z, ax = 'z', seg = 10) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, seg), m); o.position.set(x, y, z); if (ax === 'z') o.rotation.x = Math.PI / 2; else if (ax === 'x') o.rotation.z = Math.PI / 2; o.castShadow = true; g.add(o); return o; };
const tone = (hex, k) => new THREE.Color(hex).multiplyScalar(k).getHex();
const IRON = () => mat('DoorMetal', 0x1e1f21, 0.55, 0.5), BRASS = () => mat('DoorMetal', 0xb08a40, 0.35, 0.8), DARK = () => mat('DoorFrame', 0x141210, 1);

/* the plain board casing nailed round a board-house door: two jambs and a head, standing out from the wall */
function casing(g, w, h, col, fw = 0.08, out = 0.04) { const m = mat('DoorFrame', col, 0.85); B(g, m, fw, h + fw, out, -w / 2 - fw / 2, (h + fw) / 2, out / 2); B(g, m, fw, h + fw, out, w / 2 + fw / 2, (h + fw) / 2, out / 2); B(g, m, w + 2 * fw + 0.04, fw, out + 0.01, 0, h + fw / 2, (out + 0.01) / 2); }
/* upright boards across [x0, x1], y0 to y1, with a dark gap between each and a little colour change board to board */
function boards(g, x0, x1, y0, y1, z, col, n, t = 0.03) { const bw = (x1 - x0) / n, a = mat('Door', col), b = mat('Door', tone(col, 0.86)), c = mat('Door', tone(col, 1.08));
  B(g, mat('Door', tone(col, 0.35), 1), x1 - x0, y1 - y0, 0.01, (x0 + x1) / 2, (y0 + y1) / 2, z - t + 0.004);   /* the dark seen through the joints */
  for (let i = 0; i < n; i++) B(g, [a, b, c][i % 3], bw - 0.01, y1 - y0, t, x0 + bw * (i + 0.5), (y0 + y1) / 2, z - t / 2); }
/* a wooden jalousie: fixed slats tilted down and out, in a light frame */
function jalousie(g, x0, x1, y0, y1, z, col, pitch = 0.075) { const m = mat('Door', col), d = mat('Door', tone(col, 0.4), 1), n = Math.max(2, Math.round((y1 - y0) / pitch));
  B(g, d, x1 - x0, y1 - y0, 0.01, (x0 + x1) / 2, (y0 + y1) / 2, z - 0.035);
  for (let i = 0; i < n; i++) { const s = B(g, m, x1 - x0, 0.065, 0.012, (x0 + x1) / 2, y0 + (i + 0.5) * (y1 - y0) / n, z - 0.015); s.rotation.x = -0.75; } }
/* a black iron strap hinge, from the hinge edge across the face of the leaf, tapering */
function strap(g, xh, y, len, side, z) { const m = IRON(); B(g, m, len, 0.045, 0.008, xh + side * len / 2, y, z + 0.004); B(g, m, len * 0.35, 0.06, 0.008, xh + side * len * 0.18, y, z + 0.006); C(g, m, 0.014, 0.12, xh, y, z + 0.01, 'y', 8); for (let k = 1; k <= 3; k++) C(g, m, 0.008, 0.01, xh + side * len * k / 4, y, z + 0.01, 'z', 6); }
/* a hasp and staple with a padlock hanging in it */
function hasp(g, x, y, z, lock = true) { const m = IRON(); B(g, m, 0.16, 0.035, 0.01, x - 0.06, y, z + 0.005); B(g, m, 0.03, 0.05, 0.03, x + 0.04, y, z + 0.015);
  if (lock) { const p = mat('DoorMetal', 0x6a6a64, 0.4, 0.8); B(g, p, 0.05, 0.055, 0.022, x + 0.04, y - 0.06, z + 0.03); const sh = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 6, 10, Math.PI), p); sh.position.set(x + 0.04, y - 0.033, z + 0.03); g.add(sh); } }
function knob(g, x, y, z, m = BRASS()) { B(g, m, 0.05, 0.13, 0.008, x, y - 0.02, z + 0.004); C(g, m, 0.01, 0.05, x, y, z + 0.03, 'z', 8); const k = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), m); k.position.set(x, y, z + 0.06); g.add(k); B(g, DARK(), 0.012, 0.022, 0.004, x, y - 0.06, z + 0.01); }
function lever(g, x, y, z, side, m = BRASS()) { B(g, m, 0.045, 0.2, 0.008, x, y - 0.03, z + 0.004); C(g, m, 0.01, 0.05, x, y, z + 0.03, 'z', 8); B(g, m, 0.13, 0.02, 0.02, x - side * 0.055, y, z + 0.06); B(g, DARK(), 0.012, 0.022, 0.004, x, y - 0.09, z + 0.01); }
/* a sill board at the foot, or a step */
function sill(g, w, col, step = 0) { const m = mat('DoorFrame', col, 0.9); if (step > 0) B(g, m, w + 0.4, step, 0.34, 0, step / 2, 0.15); else B(g, m, w + 0.1, 0.035, 0.12, 0, 0.0175, 0.02); }
/* a burglar-bar gate: a frame of flat bar in front of the door, `kind` 'bars' (plain uprights and three rails) or 'scroll' (uprights with C scrolls
   along a band and a row of spears at the top), held off the wall on lugs at z = gz */
function grille(g, w, h, y0, gz, col, kind) { const m = mat('DoorMetal', col, 0.5, 0.4), t = 0.022;
  for (const x of [-w / 2, w / 2]) B(g, m, 0.035, h, 0.03, x, y0 + h / 2, gz);
  for (const y of [y0 + 0.03, y0 + h - 0.03]) B(g, m, w + 0.035, 0.035, 0.03, 0, y, gz);
  const n = Math.round(w / 0.11); for (let i = 1; i < n; i++) B(g, m, t, h - 0.06, t, -w / 2 + (i * w) / n, y0 + h / 2, gz);
  if (kind === 'bars') for (const y of [y0 + h * 0.35, y0 + h * 0.68]) B(g, m, w, 0.03, 0.02, 0, y, gz);
  else { for (const y of [y0 + h * 0.3, y0 + h * 0.42]) B(g, m, w, 0.025, 0.02, 0, y, gz);
    for (let i = 0; i < n; i++) { const cx = -w / 2 + ((i + 0.5) * w) / n; for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.006, 5, 10, Math.PI * 1.4), m); c.position.set(cx + s * 0.022, y0 + h * 0.36, gz); c.rotation.z = s > 0 ? 0.2 : Math.PI - 1.4; g.add(c); } }
    const arch = y0 + h - 0.2; B(g, m, w, 0.025, 0.02, 0, arch, gz); for (let i = 0; i < n; i++) { const cx = -w / 2 + ((i + 0.5) * w) / n; const r = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.006, 5, 12), m); r.position.set(cx, arch + 0.09, gz); g.add(r); } }
  for (const s of [-1, 1]) for (const y of [y0 + 0.35, y0 + h - 0.35]) B(g, m, 0.03, 0.03, gz - 0.02, s * (w / 2 + 0.03), y, (gz - 0.02) / 2 + 0.01);   /* lugs into the wall */
  hasp(g, w / 2 - 0.05, y0 + h * 0.5, gz + 0.01); }

/* ---- the doors ---- */
/* boardDoor51: photographs of Jamaican board houses (NLJ, 1940s to 1988; docs/games/melissa.md, "Doors") show the outer face of a closed board door
   as plain upright boards: the ledges and braces are on the inside, where the door swings, and only small hinge leaves show at the jamb. `ledgesOut`
   puts the ledges, Z braces and strap hinges on the outer face again (no photograph of the kind has been found yet). */
export function boardDoor51({ w = 0.9, h = 1.95, color = 0x6e5236, casingCol = 0xd8ccb0, step = 0, braced = true, lock = false, ledgesOut = false } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol);
  boards(g, -w / 2, w / 2, y0, h, 0.03, color, Math.max(5, Math.round(w / 0.15)));
  const L = mat('Door', tone(color, 0.8)); const ys = [y0 + 0.18, y0 + (h - y0) / 2, h - 0.2];
  if (ledgesOut) {
    for (const y of ys) B(g, L, w - 0.08, 0.11, 0.025, 0, y, 0.0425);   /* ledges */
    if (braced) for (let i = 0; i < 2; i++) { const a = ys[i], b = ys[i + 1], len = Math.hypot(w - 0.2, b - a); B(g, L, 0.1, len, 0.022, 0, (a + b) / 2, 0.041, Math.atan2(w - 0.2, b - a)); }   /* Z braces, rising away from the hinges */
    for (const y of [ys[0], ys[2]]) strap(g, -w / 2 + 0.03, y, w * 0.6, 1, 0.055);
  } else for (const y of [ys[0], ys[2]]) { B(g, IRON(), 0.035, 0.1, 0.006, -w / 2 + 0.012, y, 0.034); C(g, IRON(), 0.009, 0.1, -w / 2, y, 0.034, 'y', 8); }   /* butt hinges: a leaf and the knuckle at the jamb */
  const zf = ledgesOut ? 0.055 : 0.03;
  hasp(g, w / 2 - 0.1, ys[1] + 0.12, zf, lock); B(g, mat('Door', tone(color, 0.7)), 0.035, 0.09, 0.02, w / 2 - 0.08, ys[1] - 0.05, zf + 0.005);   /* the hasp, and a wooden turn button below it */
  return g;
}
export function pairBoard({ w = 1.1, h = 1.95, color = 0x4e7a8a, casingCol = 0xe0d8c0, step = 0 } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035, lw = w / 2 - 0.005; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol);
  const jy = h - (h - y0) * 0.32, fr = mat('Door', color);
  for (const s of [-1, 1]) { const x0 = s < 0 ? -w / 2 : 0.005, x1 = x0 + lw; boards(g, x0, x1, y0, jy - 0.05, 0.03, color, 3);
    B(g, fr, lw, 0.07, 0.03, (x0 + x1) / 2, jy - 0.02, 0.025); B(g, fr, lw, 0.06, 0.03, (x0 + x1) / 2, h - 0.03, 0.025); for (const x of [x0 + 0.03, x1 - 0.03]) B(g, fr, 0.06, h - jy, 0.03, x, (jy + h) / 2, 0.025);
    jalousie(g, x0 + 0.06, x1 - 0.06, jy + 0.01, h - 0.06, 0.03, tone(color, 1.1), 0.07);
    B(g, mat('Door', tone(color, 0.8)), lw - 0.06, 0.1, 0.02, (x0 + x1) / 2, y0 + 0.2, 0.04);
    strap(g, s * (w / 2 - 0.02), y0 + 0.2, lw * 0.55, -s, 0.05); strap(g, s * (w / 2 - 0.02), jy - 0.15, lw * 0.55, -s, 0.05); }
  B(g, IRON(), 0.03, 0.2, 0.015, 0.035, (y0 + jy) / 2, 0.045); B(g, IRON(), 0.08, 0.02, 0.02, 0.0, (y0 + jy) / 2 + 0.05, 0.05);   /* a barrel bolt across the meeting stiles */
  return g;
}
export function jalousieBoard88({ w = 0.9, h = 1.95, color = 0x6a8a5a, casingCol = 0xe8e0cc, step = 0 } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035, jy = y0 + (h - y0) * 0.5; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol);
  const fr = mat('Door', color); boards(g, -w / 2 + 0.08, w / 2 - 0.08, y0 + 0.08, jy - 0.04, 0.025, color, 4);
  for (const x of [-w / 2 + 0.04, w / 2 - 0.04]) B(g, fr, 0.08, h - y0, 0.04, x, (y0 + h) / 2, 0.02);
  for (const y of [y0 + 0.05, jy, h - 0.05]) B(g, fr, w, y === jy ? 0.1 : 0.1, 0.04, 0, y, 0.02);
  jalousie(g, -w / 2 + 0.08, w / 2 - 0.08, jy + 0.05, h - 0.1, 0.035, tone(color, 1.12), 0.07);
  knob(g, w / 2 - 0.1, y0 + 0.95, 0.04, mat('DoorMetal', 0xc0b070, 0.3, 0.8));
  for (const y of [y0 + 0.25, h - 0.25]) B(g, IRON(), 0.02, 0.09, 0.006, -w / 2 + 0.01, y, 0.042);   /* butt hinges, painted over */
  return g;
}
export function jalousiePair51({ w = 1.2, h = 2.05, color = 0x3f6e4a, casingCol = 0xf0eadc, step = 0 } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035, lw = w / 2 - 0.005, my = y0 + (h - y0) * 0.45; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol, 0.1, 0.05);
  const fr = mat('Door', color);
  for (const s of [-1, 1]) { const x0 = s < 0 ? -w / 2 : 0.005, x1 = x0 + lw;
    for (const x of [x0 + 0.04, x1 - 0.04]) B(g, fr, 0.08, h - y0, 0.04, x, (y0 + h) / 2, 0.02);
    for (const y of [y0 + 0.07, my, h - 0.05]) B(g, fr, lw, y === my ? 0.12 : 0.1, 0.04, (x0 + x1) / 2, y, 0.02);
    jalousie(g, x0 + 0.08, x1 - 0.08, y0 + 0.12, my - 0.06, 0.03, tone(color, 1.1), 0.065); jalousie(g, x0 + 0.08, x1 - 0.08, my + 0.06, h - 0.1, 0.03, tone(color, 1.1), 0.065); }
  knob(g, 0.07, my, 0.04); knob(g, -0.07, my, 0.04);
  return g;
}
export function panelGrille88({ w = 0.95, h = 2.05, color = 0x5a3220, casingCol = 0xe8e0cc, step = 0, grilleCol = 0x1e1f21 } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol, 0.09, 0.05);
  const lf = mat('Door', color, 0.45), sh = mat('Door', tone(color, 0.6), 0.6); B(g, lf, w - 0.01, h - y0, 0.045, 0, (y0 + h) / 2, 0.0225);
  /* six raised panels with a bevel line round each (a 1970s and 1980s Caribbean hardwood door) */
  const cols = 2, rows = [[0.08, 0.36], [0.4, 0.62], [0.66, 0.94]], st = 0.1, pw = (w - 2 * st - 0.08) / cols;
  for (const [a, b] of rows) for (let c = 0; c < cols; c++) { const x = -w / 2 + st + pw / 2 + c * (pw + 0.08), y = y0 + (h - y0) * (a + b) / 2, ph = (h - y0) * (b - a);
    B(g, sh, pw, ph, 0.004, x, y, 0.047); B(g, lf, pw - 0.06, ph - 0.06, 0.014, x, y, 0.052); }
  lever(g, w / 2 - 0.09, y0 + 0.98, 0.045, 1); for (const y of [y0 + 0.25, h - 0.25]) B(g, BRASS(), 0.02, 0.09, 0.006, -w / 2 + 0.008, y, 0.047);
  grille(g, w + 0.1, h - y0 + 0.02, y0, 0.17, grilleCol, 'bars');
  return g;
}
export function scrollGrille25({ w = 0.95, h = 2.1, color = 0x7a4a30, casingCol = 0xf2eee4, step = 0, grilleCol = 0xf0eee8 } = {}) {
  const g = new THREE.Group(), y0 = step > 0 ? step : 0.035; g.name = 'Door'; sill(g, w, casingCol, step); casing(g, w, h, casingCol, 0.1, 0.05);
  const lf = mat('Door', color, 0.5), sh = mat('Door', tone(color, 0.62), 0.6); B(g, lf, w - 0.01, h - y0, 0.045, 0, (y0 + h) / 2, 0.0225);
  /* a half-moon light at the top over two long panels and a short one: the moulded door sold in Jamaican hardware stores now */
  const r = 0.24, hy = h - 0.36; const half = new THREE.Mesh(new THREE.CircleGeometry(r, 20, 0, Math.PI), mat('DoorGlass', 0x3c4a54, 0.15)); half.position.set(0, hy, 0.047); g.add(half);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 6, 20, Math.PI), sh); rim.position.set(0, hy, 0.048); g.add(rim); B(g, sh, 2 * r + 0.03, 0.03, 0.01, 0, hy, 0.048);
  for (const s of [-1, 1]) { const x = s * 0.17; B(g, sh, 0.27, 0.95, 0.004, x, y0 + 0.86, 0.047); B(g, lf, 0.22, 0.9, 0.012, x, y0 + 0.86, 0.052); }
  B(g, sh, w - 0.2, 0.22, 0.004, 0, y0 + 0.2, 0.047); B(g, lf, w - 0.25, 0.17, 0.012, 0, y0 + 0.2, 0.052);
  lever(g, w / 2 - 0.09, y0 + 1.0, 0.045, 1, mat('DoorMetal', 0xb8b8b4, 0.3, 0.9));
  grille(g, w + 0.12, h - y0 + 0.03, y0, 0.17, grilleCol, 'scroll');
  return g;
}
export function churchDoors({ w = 1.5, h = 2.2, color = 0x5a3a24, casingCol = 0xf0ece0, step = 0.15 } = {}) {
  const g = new THREE.Group(), y0 = step, lw = w / 2 - 0.005, rise = w * 0.42; g.name = 'Door'; sill(g, w, 0xb8b4aa, step);
  const cm = mat('DoorFrame', casingCol, 0.9); for (const s of [-1, 1]) B(g, cm, 0.12, h, 0.06, s * (w / 2 + 0.06), h / 2, 0.03);
  const L = Math.hypot(w / 2 + 0.12, rise); for (const s of [-1, 1]) B(g, cm, L, 0.12, 0.06, s * (w / 4 + 0.03), h + rise / 2, 0.03, s * -Math.atan2(rise, w / 2 + 0.12));   /* the pointed arch */
  /* the arch over the doors: boards under the point */
  const tri = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, rise - 0.05)]); const tm = new THREE.Mesh(new THREE.ShapeGeometry(tri), mat('Door', tone(color, 0.85))); tm.position.set(0, h, 0.012); g.add(tm);
  B(g, mat('Door', tone(color, 0.7)), w, 0.06, 0.03, 0, h, 0.02);
  for (const s of [-1, 1]) { const x0 = s < 0 ? -w / 2 : 0.005, x1 = x0 + lw; boards(g, x0, x1, y0, h - 0.03, 0.035, color, 4);
    for (const y of [y0 + 0.25, h - 0.3]) { B(g, mat('Door', tone(color, 0.8)), lw - 0.06, 0.1, 0.022, (x0 + x1) / 2, y, 0.046); strap(g, s * (w / 2 - 0.02), y, lw * 0.75, -s, 0.057); }
    const rg = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.009, 6, 16), IRON()); rg.position.set(s * 0.12, y0 + 0.95, 0.07); g.add(rg); B(g, IRON(), 0.06, 0.06, 0.01, s * 0.12, y0 + 1.0, 0.06); }
  return g;
}
export function shopDoor({ w = 0.95, h = 1.95, color = 0x3a5a6a, casingCol = 0xe8dcb4 } = {}) {
  const g = boardDoor51({ w, h, color, casingCol, braced: false, lock: true });
  B(g, IRON(), w + 0.12, 0.05, 0.03, 0, 1.0, 0.075); for (const s of [-1, 1]) B(g, IRON(), 0.05, 0.12, 0.06, s * (w / 2 + 0.06), 1.0, 0.04);   /* an iron bar across in staples, for the night */
  return g;
}
export function villaDoors({ w = 1.5, h = 2.2, color = 0x6a3a22, casingCol = 0xf4f0e6, step = 0.15 } = {}) {
  const g = new THREE.Group(), y0 = step, lw = w / 2 - 0.005; g.name = 'Door'; sill(g, w, 0xd8d4c8, step); casing(g, w, h, casingCol, 0.12, 0.06);
  const lf = mat('Door', color, 0.4), sh = mat('Door', tone(color, 0.55), 0.6);
  for (const s of [-1, 1]) { const x0 = s < 0 ? -w / 2 : 0.005, x1 = x0 + lw, cx = (x0 + x1) / 2; B(g, lf, lw - 0.004, h - y0, 0.05, cx, (y0 + h) / 2, 0.025);
    /* a tall panel with a carved diamond, and a short one below */
    B(g, sh, lw - 0.16, (h - y0) * 0.58, 0.004, cx, y0 + (h - y0) * 0.6, 0.052); B(g, lf, lw - 0.22, (h - y0) * 0.58 - 0.06, 0.014, cx, y0 + (h - y0) * 0.6, 0.057);
    const dm = B(g, sh, 0.16, 0.16, 0.01, cx, y0 + (h - y0) * 0.6, 0.066); dm.rotation.z = Math.PI / 4;
    B(g, sh, lw - 0.16, (h - y0) * 0.2, 0.004, cx, y0 + (h - y0) * 0.16, 0.052); B(g, lf, lw - 0.22, (h - y0) * 0.2 - 0.06, 0.014, cx, y0 + (h - y0) * 0.16, 0.057);
    lever(g, s * 0.07, y0 + 1.0, 0.05, -s); }
  grille(g, w + 0.14, h - y0 + 0.04, y0, 0.18, 0xf2f0ea, 'scroll');
  return g;
}
