/* Kingston's vehicles in 1966, built in code (owner, November 2026: "Can the buses and car look a little more realistic").
   General pictures of the kinds of vehicles on Kingston's streets then, not copies of one make or of a real number plate:
     cityBus   a British-built single-deck city bus of the 1950s (the JOS fleet was Leyland Royal Tigers and Olympics: a flat front with a slightly
               raked split windscreen, a domed roof, a front entrance on the left, seats in pairs either side of an aisle), grey above, dark green below
     car       a rounded British family saloon of the late 1950s (the shape of a Morris Oxford, Austin Cambridge or Hillman Minx)
     truck     a bonneted lorry of the 1950s (the shape of a Bedford) with a wooden stake body
   Bodies are side profiles extruded to the vehicle's width with rounded (bevelled) edges and real wheel arches, a separate rounded cabin or roof,
   framed glass that reflects the sky, chrome bumpers, grilles, headlamps, door lines and handles, number plates and a little road dirt low down.
   Every vehicle faces +x, sits on the ground (y = 0) and is centred on x and z. Static: the place batches it by material, so it costs a few draws. */
import * as THREE from "three";
import { cv, solid, glow, std } from "./gfx.js";

const memo = {};
const once = (k, f) => memo[k] || (memo[k] = f());
const CHROME = solid(0xd2d5d8, 0.22, 0.9),
  TYRE = solid(0x18191a, 0.92),
  DARK = solid(0x1b1c1e, 0.8),
  SEAT = solid(0x6a2e26, 0.7),
  FLOOR = solid(0x3a3631, 0.9),
  TAIL = glow(0xb3261e),
  LENS = glow(0xf7efcf);
/* glass that reads as glass: dark, smooth, reflecting the sky; the bus glass lets the seats show through */
const glass = (see) =>
  once("glass" + see, () => new THREE.MeshStandardMaterial({ color: 0x2c3c45, roughness: 0.04, metalness: 0.75, envMapIntensity: 2.2, transparent: true, opacity: see ? 0.42 : 0.88, depthWrite: !see, side: THREE.DoubleSide }));
/* paint with a little road dirt: darker and dustier towards the bottom of the body (uv v runs with height in metres / H) */
function paint(hex, H) {
  return once("paint" + hex + H, () => {
    const c = { r: ((hex >> 16) & 255) / 255, g: ((hex >> 8) & 255) / 255, b: (hex & 255) / 255 }; // sRGB bytes, as the canvas expects
    const t = cv(16, 256, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h);
      const css = (k, a = 1) => `rgba(${(c.r * 255 * k) | 0},${(c.g * 255 * k) | 0},${(c.b * 255 * k) | 0},${a})`;
      g.addColorStop(0, css(1.04));
      g.addColorStop(0.55, css(1));
      g.addColorStop(0.82, css(0.86));
      g.addColorStop(1, css(0.62));
      x.fillStyle = g;
      x.fillRect(0, 0, w, h);
      x.fillStyle = "rgba(120,100,70,0.18)";
      for (let i = 0; i < 40; i++) x.fillRect(Math.random() * w, h * (0.8 + Math.random() * 0.2), 1 + Math.random() * 2, 1 + Math.random() * 3);
    });
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(1, 1 / H);
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.45, metalness: 0.04, envMapIntensity: 1.0 });
  });
}
function shapeOf(pts) {
  const s = new THREE.Shape();
  pts.forEach((p, i) => {
    if (p.arc) s.absarc(p.arc[0], p.arc[1], p.arc[2], p.arc[3], p.arc[4], false);
    else if (p.q) s.quadraticCurveTo(p.q[0], p.q[1], p.q[2], p.q[3]);
    else i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1]);
  });
  s.closePath();
  return s;
}
/* a side profile pushed out to `width` along z, with rounded edges (bevel) */
function slab(g, pts, width, mat, bevel = 0.06, z = 0) {
  const d = Math.max(0.01, width - bevel * 2);
  const geo = new THREE.ExtrudeGeometry(shapeOf(pts), { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.7, bevelSegments: 3, curveSegments: 10 });
  geo.translate(0, 0, -d / 2 + z);
  const m = new THREE.Mesh(geo, mat);
  g.add(m);
  return m;
}
function bx(g, mat, w, h, d, x, y, z, rz = 0, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.userData.trim = true;
  m.position.set(x, y, z);
  m.rotation.set(0, ry, rz);
  g.add(m);
  return m;
}
function cyl(g, mat, r0, r1, h, x, y, z, axis = "z", seg = 14) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
  if (axis === "z") m.rotation.x = Math.PI / 2;
  if (axis === "x") m.rotation.z = Math.PI / 2;
  m.position.set(x, y, z);
  g.add(m);
  return m;
}
/* a wheel: a rounded tyre, a dark wheel, a chrome hubcap; axle along z, outer face toward side s */
function wheel(g, r, x, z, s, wide = 0.2, cap = 0.55) {
  (g.userData.wheels = g.userData.wheels || []).push({ x, y: r, z, r, w: wide * 1.2 });
  const t = new THREE.Mesh(new THREE.TorusGeometry(r - wide * 0.45, wide * 0.5, 8, 20), TYRE);
  t.scale.z = 1.2;
  t.position.set(x, r, z);
  g.add(t);
  cyl(g, DARK, r - wide * 0.55, r - wide * 0.55, wide * 1.05, x, r, z);
  cyl(g, CHROME, r * cap, r * cap * 0.85, 0.04, x, r, z + s * wide * 0.5, "z", 14);
  cyl(g, DARK, r * 0.12, r * 0.12, 0.05, x, r, z + s * (wide * 0.5 + 0.01), "z", 8);
}
/* a number plate: dark with pale raised characters (made-up characters, not a real registration) */
function plate(g, text, x, y, z, face = 1, w = 0.42, h = 0.12) {
  const t = once("plate" + text, () =>
    cv(256, 72, (c, W, H) => {
      c.fillStyle = "#151515";
      c.fillRect(0, 0, W, H);
      c.strokeStyle = "#cfcfc4";
      c.lineWidth = 4;
      c.strokeRect(5, 5, W - 10, H - 10);
      c.fillStyle = "#e4e2d6";
      c.font = "700 46px sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, W / 2, H / 2 + 2);
    }),
  );
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), std(t, 0.6));
  p.position.set(x, y, z);
  p.rotation.y = (face * Math.PI) / 2;
  g.add(p);
  bx(g, DARK, 0.02, h + 0.02, w + 0.02, x - face * 0.012, y, z);
}
function strip(g, mat, x0, x1, y, z, arches, h = 0.03, d = 0.012) {
  let cuts = arches
    .filter(([cx, ar, cy = 0.36]) => Math.abs(y - cy) < ar)
    .map(([cx, ar, cy = 0.36]) => {
      const half = Math.sqrt(ar * ar - (y - cy) ** 2) + 0.04;
      return [cx - half, cx + half];
    })
    .sort((a, b) => a[0] - b[0]);
  let a = x0;
  for (const [c0, c1] of [...cuts, [x1, x1]]) {
    const b = Math.min(c0, x1);
    if (b - a > 0.05) bx(g, mat, b - a, h, d, (a + b) / 2, y, z);
    a = Math.max(a, c1);
  }
}
/* dev: every trim piece (strips, lines, bumpers, steps, rails) that cuts into a wheel. Returns lines like "car: a trim piece crosses a wheel at (1.4, 0.7)". */
export function vehicleTrimCheck() {
  const out = [],
    v = new THREE.Vector3(),
    b = new THREE.Box3();
  for (const [name, g] of [
    ["bus", cityBus()],
    ["car", car()],
    ["truck", truck()],
  ]) {
    g.updateMatrixWorld(true);
    g.traverse((m) => {
      if (!m.isMesh || !m.userData.trim) return;
      b.setFromObject(m);
      for (const w of g.userData.wheels || []) {
        const inX = b.max.x > w.x - w.r * 0.92 && b.min.x < w.x + w.r * 0.92,
          inY = b.max.y > 0.04 && b.min.y < w.y + w.r * 0.92,
          inZ = b.max.z > w.z - w.w / 2 && b.min.z < w.z + w.w / 2;
        if (inX && inY && inZ) {
          b.getCenter(v);
          out.push(`${name}: a trim piece crosses a wheel at (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
          break;
        }
      }
    });
  }
  return out;
}
/* a flat pane along a sloped line of the profile (windscreen, rear window), `w` wide, a hair outside it */
function slopePane(g, mat, x0, y0, x1, y1, w, off = 0.015) {
  const L = Math.hypot(x1 - x0, y1 - y0),
    a = Math.atan2(y1 - y0, x1 - x0),
    p = new THREE.Mesh(new THREE.BoxGeometry(L, 0.012, w), mat);
  p.position.set((x0 + x1) / 2 - Math.sin(a) * off, (y0 + y1) / 2 + Math.cos(a) * off, 0);
  p.rotation.z = a;
  g.add(p);
  return p;
}

/* ---------- the city bus: 9.6 m long, 2.5 m wide, about 2.9 m high ---------- */
export function cityBus(dest = "PALISADOES", route = "SP", reg = "J 4127") {
  const g = new THREE.Group(),
    L = 9.6,
    W = 2.5,
    X = L / 2,
    fa = 3.05,
    ra = -2.55,
    r = 0.52,
    sill = 1.42,
    eave = 2.4;
  const green = paint(0x23473a, 1.5),
    grey = paint(0x9ba2a4, 3.0),
    see = glass(true);
  // the lower body, dark green, with wheel arches and rounded front and back
  slab(g, [[-X + 0.15, 0.36], [-X, 0.55], [-X, sill], [X - 0.05, sill], [X, 1.2], [X, 0.55], [X - 0.15, 0.36], [fa + r + 0.1, 0.36], { arc: [fa, 0.5, r + 0.1, 0, Math.PI] }, [ra + r + 0.1, 0.36], { arc: [ra, 0.5, r + 0.1, 0, Math.PI] }], W, green, 0.08);
  // a chrome strip at the waist, and a moulding along the skirt
  bx(g, CHROME, L - 0.1, 0.05, W + 0.02, 0, sill + 0.02, 0);
  for (const s of [-1, 1]) strip(g, CHROME, -X + 0.2, X - 0.2, 0.62, s * (W / 2 + 0.005), [[fa, r + 0.1, 0.5], [ra, r + 0.1, 0.5]]);
  // the roof: rounded edges, a gentle dome at the front
  slab(g, [[-X + 0.02, eave], [X - 0.02, eave], [X - 0.05, eave + 0.22], { q: [X - 0.3, eave + 0.48, X - 1.0, eave + 0.5] }, [-X + 0.7, eave + 0.5], { q: [-X + 0.05, eave + 0.46, -X + 0.02, eave + 0.2] }], W, grey, 0.14);
  bx(g, DARK, L - 0.3, 0.03, W + 0.03, 0, eave + 0.06, 0); // rain gutters along the eaves
  // the window band: grey pillars between the windows, glass set just inside them, the entrance on the left at the front
  const bay = (L - 1.3) / 8;
  for (const s of [-1, 1]) {
    for (let i = 0; i <= 8; i++) {
      const x = -X + 0.45 + i * bay;
      if (s < 0 && x > X - 1.2 && x < X - 0.15) continue; // the entrance
      bx(g, grey, 0.11, eave - sill, 0.1, x, (sill + eave) / 2, s * (W / 2 - 0.05));
    }
    for (let i = 0; i < 8; i++) {
      const x = -X + 0.45 + (i + 0.5) * bay;
      if (s < 0 && x + bay / 2 > X - 1.12) continue;
      bx(g, see, bay - 0.1, eave - sill - 0.08, 0.012, x, (sill + eave) / 2, s * (W / 2 - 0.06));
      bx(g, DARK, bay - 0.1, 0.03, 0.015, x, eave - 0.32, s * (W / 2 - 0.055)); // the sliding vent's frame
    }
  }
  // on the left, a narrow window between the last full window and the entrance, and the pillar behind the door
  {
    const x0 = -X + 0.45 + 7 * bay + 0.05,
      x1 = X - 1.16;
    bx(g, see, x1 - x0, eave - sill - 0.08, 0.012, (x0 + x1) / 2, (sill + eave) / 2, -(W / 2 - 0.06));
    bx(g, grey, 0.1, eave - sill, 0.1, x1 + 0.03, (sill + eave) / 2, -(W / 2 - 0.05));
  }
  // the entrance: a two-leaf glazed folding door, its frame and a step (front, left side)
  const dx = X - 0.68; // the entrance is ahead of the front wheel, as on underfloor-engined buses
  for (const k of [-0.22, 0.22]) {
    bx(g, see, 0.4, eave - 0.58, 0.012, dx + k, (eave + 0.5) / 2 + 0.04, -W / 2 - 0.012);
    bx(g, CHROME, 0.03, eave - 0.5, 0.02, dx + k + 0.2, (eave + 0.5) / 2 + 0.04, -W / 2 - 0.015);
  }
  bx(g, DARK, 0.92, 0.06, 0.04, dx, eave - 0.02, -W / 2 - 0.01);
  bx(g, DARK, 0.92, 0.12, 0.3, dx, 0.42, -W / 2 + 0.1);
  bx(g, solid(0x4a4a46, 0.8), 0.86, 0.04, 0.32, dx, 0.49, -W / 2 + 0.1);
  // the front: a split windscreen with a slight rake, a destination box with its blind and route number, lamps, grille, bumper, plate
  for (const s of [-1, 1]) {
    const p = slopePane(g, glass(false), X - 0.02, sill + 0.06, X - 0.14, eave - 0.05, W / 2 - 0.12, 0.02);
    p.position.z = s * (W / 4 + 0.02);
  }
  bx(g, grey, 0.08, eave - sill, 0.08, X - 0.06, (sill + eave) / 2, 0, -0.1);
  const F = X + 0.07; // the front face, outside the rounded edges
  bx(g, DARK, 0.14, 0.36, 1.9, F, eave + 0.17, 0);
  const blind = once("blind" + dest + route, () =>
    cv(512, 80, (c, w, h) => {
      c.fillStyle = "#0d0d0d";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#f2ead2";
      c.font = "700 50px sans-serif";
      c.textBaseline = "middle";
      c.textAlign = "center";
      c.fillText(dest, w * 0.42, h / 2 + 2, w * 0.74);
      c.fillStyle = "#1f1f1f";
      c.fillRect(w * 0.82, 6, w * 0.17, h - 12);
      c.fillStyle = "#f2ead2";
      c.fillText(route, w * 0.905, h / 2 + 2, w * 0.15);
    }),
  );
  const bl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.28), new THREE.MeshBasicMaterial({ map: blind }));
  bl.position.set(F + 0.075, eave + 0.17, 0);
  bl.rotation.y = Math.PI / 2;
  g.add(bl);
  for (const s of [-1, 1]) {
    cyl(g, CHROME, 0.13, 0.13, 0.05, F, 0.82, s * 0.92, "x");
    cyl(g, LENS, 0.105, 0.105, 0.06, F + 0.01, 0.82, s * 0.92, "x");
    cyl(g, TAIL, 0.07, 0.07, 0.04, -F, 0.75, s * 0.95, "x");
    // a mirror on an arm by each front corner
    bx(g, DARK, 0.04, 0.04, 0.3, X - 0.1, eave - 0.2, s * (W / 2 + 0.13));
    bx(g, CHROME, 0.04, 0.22, 0.14, X - 0.08, eave - 0.3, s * (W / 2 + 0.28));
  }
  bx(g, CHROME, 0.04, 0.3, 1.05, F, 0.85, 0);
  for (let i = 0; i < 5; i++) bx(g, DARK, 0.03, 0.03, 0.98, F + 0.02, 0.73 + i * 0.055, 0);
  for (const x of [F + 0.04, -F - 0.04]) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, W - 0.25, 4, 8), CHROME);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, 0.48, 0);
    g.add(b);
  }
  plate(g, reg, F + 0.12, 0.48, 0, 1);
  plate(g, reg, -F - 0.03, 0.66, 0, -1);
  // the back: a panel with a small window
  bx(g, grey, 0.06, eave - sill, W - 0.16, -X + 0.02, (sill + eave) / 2, 0);
  bx(g, glass(false), 0.012, 0.55, 1.2, -X - 0.05, sill + 0.55, 0);
  // inside, seen through the glass: a floor and pairs of seats either side of the aisle
  bx(g, FLOOR, L - 0.5, 0.04, W - 0.2, 0, sill - 0.02, 0);
  for (let i = 0; i < 7; i++) {
    const x = -X + 1.0 + i * 1.0;
    for (const s of [-1, 1]) {
      if (s < 0 && x > X - 1.6) continue;
      bx(g, SEAT, 0.12, 0.62, 0.86, x - 0.2, sill + 0.28, s * 0.66);
      bx(g, CHROME, 0.04, 0.04, 0.86, x - 0.2, sill + 0.6, s * 0.66);
    }
  }
  // wheels: single at the front, twin at the back
  for (const s of [-1, 1]) {
    wheel(g, r, fa, s * (W / 2 - 0.2), s, 0.24);
    wheel(g, r, ra, s * (W / 2 - 0.2), s, 0.24);
    wheel(g, r, ra, s * (W / 2 - 0.46), s, 0.24, 0.3);
  }
  return g;
}

/* ---------- a family saloon: about 4.4 m long, 1.65 m wide ---------- */
export function car(colour = 0x7d2f2a, reg = "P 2318") {
  const g = new THREE.Group(),
    W = 1.65,
    fa = 1.38,
    ra = -1.32,
    r = 0.36,
    body = paint(colour, 1.0),
    roof = colour === 0xd8d2bc ? paint(0x6e2b28, 1.5) : paint(colour, 1.5);
  // the body: a long bonnet, a rounded boot, wheel arches with a skirt over the back wheels
  slab(g, [[-2.15, 0.3], [-2.22, 0.5], [-2.2, 0.72], { q: [-2.1, 0.9, -1.75, 0.92] }, [-1.2, 0.94], [1.0, 0.95], { q: [1.85, 0.93, 2.12, 0.8] }, [2.2, 0.6], [2.18, 0.3], [fa + 0.44, 0.3], { arc: [fa, 0.36, 0.44, 0, Math.PI] }, [ra + 0.44, 0.3], { arc: [ra, 0.36, 0.44, 0, Math.PI * 0.62] }, [ra - 0.3, 0.62], [-2.15, 0.3]], W, body, 0.09);
  // the cabin: a raked windscreen, a curved roof, a sloping back
  const cab = [[-1.3, 0.94], { q: [-1.12, 1.36, -0.8, 1.44] }, [0.3, 1.46], { q: [0.55, 1.45, 0.98, 0.95] }];
  slab(g, cab, W - 0.22, roof, 0.07);
  // windscreen, rear window and side windows (glass a hair outside the cabin), the middle pillar, chrome window frames
  slopePane(g, glass(false), 0.98, 0.98, 0.5, 1.42, W - 0.42, 0.04);
  slopePane(g, glass(false), -1.27, 0.98, -0.85, 1.4, W - 0.46, 0.04);
  for (const s of [-1, 1]) {
    const zz = s * ((W - 0.22) / 2 + 0.012);
    const front = new THREE.Shape([new THREE.Vector2(-0.24, 1.0), new THREE.Vector2(0.86, 1.0), new THREE.Vector2(0.48, 1.38), new THREE.Vector2(-0.24, 1.39)]);
    const back = new THREE.Shape([new THREE.Vector2(-1.16, 1.0), new THREE.Vector2(-0.34, 1.0), new THREE.Vector2(-0.34, 1.39), new THREE.Vector2(-0.82, 1.38)]);
    for (const sh of [front, back]) {
      const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), glass(false));
      m.position.z = zz;
      g.add(m);
    }
    bx(g, CHROME, 2.1, 0.025, 0.02, -0.15, 0.985, s * ((W - 0.22) / 2 + 0.02));
    // door lines, handles, a chrome side strip
    for (const x of [0.86, -0.29, -0.82]) bx(g, DARK, 0.012, 0.52, 0.01, x, 0.68, s * (W / 2 + 0.003));
    for (const x of [0.62, -0.5]) bx(g, CHROME, 0.12, 0.025, 0.03, x, 0.86, s * (W / 2 + 0.01));
    strip(g, CHROME, -2.0, 2.0, 0.72, s * (W / 2 + 0.004), [[fa, 0.44], [ra, 0.44]], 0.025);
    // a mirror on the front wing
    cyl(g, CHROME, 0.012, 0.012, 0.12, 1.7, 0.98, s * 0.6, "y", 6);
    cyl(g, CHROME, 0.045, 0.045, 0.02, 1.7, 1.06, s * 0.6, "x", 10);
  }
  // the front: a chrome grille with bars, round headlamps in chrome rings, sidelamps, a bumper with overriders and a plate
  bx(g, CHROME, 0.05, 0.3, 0.7, 2.2, 0.56, 0);
  for (let i = 0; i < 7; i++) bx(g, DARK, 0.02, 0.26, 0.04, 2.22, 0.56, -0.27 + i * 0.09);
  for (const s of [-1, 1]) {
    cyl(g, CHROME, 0.1, 0.1, 0.05, 2.16, 0.7, s * 0.6, "x");
    cyl(g, LENS, 0.082, 0.082, 0.06, 2.18, 0.7, s * 0.6, "x");
    cyl(g, LENS, 0.03, 0.03, 0.04, 2.2, 0.5, s * 0.6, "x", 8);
    bx(g, TAIL, 0.04, 0.16, 0.1, -2.2, 0.72, s * 0.66);
    bx(g, CHROME, 0.08, 0.16, 0.06, 2.3, 0.38, s * 0.38);
    bx(g, CHROME, 0.08, 0.16, 0.06, -2.3, 0.38, s * 0.38);
  }
  for (const x of [2.27, -2.27]) {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, W - 0.15, 4, 8), CHROME);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, 0.33, 0);
    g.add(b);
  }
  plate(g, reg, 2.34, 0.33, 0, 1, 0.36, 0.1);
  plate(g, reg, -2.34, 0.5, 0, -1, 0.36, 0.1);
  for (const s of [-1, 1]) {
    wheel(g, r, fa, s * (W / 2 - 0.12), s, 0.17, 0.6);
    wheel(g, r, ra, s * (W / 2 - 0.12), s, 0.17, 0.6);
  }
  return g;
}

/* ---------- a 1950s lorry with a wooden stake body: about 5.2 m long, 2.1 m wide ---------- */
export function truck(colour = 0x5a3f2a, reg = "M 7752") {
  const g = new THREE.Group(),
    W = 2.1,
    fa = 1.85,
    ra = -1.55,
    r = 0.48,
    body = paint(colour, 2.4),
    wood = solid(0x86643f, 0.95),
    woodDk = solid(0x5d4127, 0.95);
  // chassis rails
  for (const s of [-1, 1]) bx(g, DARK, 4.9, 0.18, 0.12, -0.2, 0.62, s * 0.34);
  // the cab: rounded roof and back, a flat windscreen in two panes
  slab(g, [[0.35, 0.95], [0.35, 2.15], { q: [0.38, 2.32, 0.6, 2.33] }, [1.45, 2.33], { q: [1.6, 2.32, 1.62, 2.2] }, [1.66, 1.5], [1.66, 0.95]], 1.9, body, 0.1);
  for (const s of [-1, 1]) {
    bx(g, glass(false), 0.012, 0.55, 0.76, 1.66, 1.88, s * 0.43).rotation.z = 0.04;
    bx(g, glass(false), 0.62, 0.5, 0.012, 1.08, 1.86, s * 0.965);
    bx(g, DARK, 0.012, 0.85, 0.012, 0.66, 1.4, s * 0.962);
    bx(g, CHROME, 0.1, 0.025, 0.03, 0.78, 1.4, s * 0.975);
  }
  bx(g, body, 0.06, 0.6, 0.06, 1.69, 1.88, 0);
  // the bonnet with a rounded top, a tall grille, headlamps on the wings, front wings over the wheels
  slab(g, [[1.6, 0.95], [1.6, 1.58], { q: [1.62, 1.68, 1.8, 1.68] }, [2.45, 1.62], { q: [2.62, 1.6, 2.62, 1.45] }, [2.62, 0.95]], 1.2, body, 0.08);
  bx(g, CHROME, 0.06, 0.62, 0.9, 2.64, 1.24, 0);
  for (let i = 0; i < 6; i++) bx(g, DARK, 0.02, 0.58, 0.05, 2.67, 1.24, -0.35 + i * 0.14);
  for (const s of [-1, 1]) {
    slab(g, [[1.15, 0.9], [1.25, 1.08], { q: [fa, 1.28, 2.55, 1.06] }, [2.65, 0.82], [2.4, 0.82], { q: [fa, 1.12, 1.35, 0.85] }], 0.42, body, 0.04, s * 0.83);
    cyl(g, CHROME, 0.12, 0.12, 0.08, 2.5, 1.18, s * 0.78, "x");
    cyl(g, LENS, 0.1, 0.1, 0.09, 2.52, 1.18, s * 0.78, "x");
    bx(g, DARK, 0.5, 0.06, 0.32, 0.9, 0.6, s * 0.86); // the running board
  }
  const fb = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, W - 0.2, 4, 8), CHROME);
  fb.rotation.x = Math.PI / 2;
  fb.position.set(2.72, 0.62, 0);
  g.add(fb);
  plate(g, reg, 2.8, 0.62, 0, 1, 0.38, 0.11);
  // the body: a plank deck on cross-bearers, stake sides with three rails, a tailboard
  bx(g, wood, 3.3, 0.1, W, -1.25, 1.02, 0);
  for (let i = 0; i < 5; i++) bx(g, woodDk, 0.1, 0.26, 0.8, -2.75 + i * 0.75, 0.84, 0); // cross-bearers on the chassis, between the rear wheels
  bx(g, DARK, 0.1, 0.16, W - 0.04, -2.84, 0.85, 0); // the rear crossmember that carries the lamps and the plate
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) bx(g, woodDk, 0.08, 0.9, 0.08, -2.82 + i * 0.78, 1.5, s * (W / 2 - 0.04));
    for (const y of [1.25, 1.55, 1.85]) bx(g, wood, 3.3, 0.12, 0.04, -1.25, y, s * (W / 2 - 0.01));
  }
  for (const y of [1.25, 1.55, 1.85]) bx(g, wood, 0.04, 0.12, W, -2.89, y, 0);
  bx(g, wood, 0.04, 0.9, W - 0.2, 0.37, 1.5, 0);
  plate(g, reg, -2.92, 0.83, 0, -1, 0.34, 0.1);
  for (const s of [-1, 1]) {
    cyl(g, TAIL, 0.06, 0.06, 0.04, -2.9, 0.85, s * 0.8, "x");
    wheel(g, r, fa, s * (W / 2 - 0.2), s, 0.22);
    wheel(g, r, ra, s * (W / 2 - 0.2), s, 0.22);
    wheel(g, r, ra, s * (W / 2 - 0.44), s, 0.22, 0.3);
    // a rear wing over the back wheels
    bx(g, DARK, 1.2, 0.04, 0.5, ra, 1.03, s * (W / 2 - 0.3));
  }
  return g;
}
