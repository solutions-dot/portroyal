/* games/_tivoli/src/vehicles.js: code-built vehicles for the street scene (no model files, so no licences to track). Two everyday Jamaican vehicles, general shapes only
   (a small saloon car like the Toyota Corolla, and a Hiace-style minibus, the common route taxi), not copies of any real vehicle or number plate.
   Each is built from a SIDE PROFILE extruded to the vehicle's width (so it has a real silhouette: sloped bonnet, windscreen, boot), then wheels with hubs,
   dark glass, lights, bumpers, mirrors and door lines. A vehicle faces +x, sits on the ground (y = 0) and is centred on x and z. Metres.
   overturned(v) lays a vehicle on its side (for the barricade). No military vehicles: the sources read did not mention any (docs/games/tivoli.md "Not found"). */
import * as THREE from 'three';

const M = (c, r = 0.55, m = 0.15) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const GLASS = M(0x1f2a33, 0.15, 0.5), TYRE = M(0x151517, 0.95, 0), HUB = M(0xa9adb0, 0.4, 0.7), DARK = M(0x26262a, 0.8, 0.1), CHROME = M(0xc8ccd0, 0.3, 0.8),
  HEAD = new THREE.MeshStandardMaterial({ color: 0xf2eed8, emissive: 0x6a6650, roughness: 0.3 }), TAIL = new THREE.MeshStandardMaterial({ color: 0xa8201c, emissive: 0x3a0806, roughness: 0.4 }),
  PLATE = M(0xe4e0c8, 0.6, 0), LINE = M(0x15151a, 0.9, 0);

function shape(pts) { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; }
function extrude(pts, width, mat, bevel = 0.035) {   /* a side profile (x along the vehicle, y up) pushed out to the vehicle's width (z) */
  const g = new THREE.ExtrudeGeometry(shape(pts), { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 1 });
  g.translate(0, 0, -(width - bevel * 2) / 2); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
}
function box(g, mat, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = true; g.add(m); return m; }
function wheel(g, r, x, z, side) {   /* tyre, bright hub and a dark centre, axle along z */
  const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.24, 18), TYRE); t.rotation.x = Math.PI / 2; t.position.set(x, r, z); t.castShadow = true; g.add(t);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.6, r * 0.6, 0.26, 12), HUB); h.rotation.x = Math.PI / 2; h.position.set(x, r, z + side * 0.005); g.add(h);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.18, r * 0.18, 0.28, 8), DARK); c.rotation.x = Math.PI / 2; c.position.set(x, r, z); g.add(c);
}
function slopePane(g, mat, x0, y0, x1, y1, width, off = 0.012) {   /* a flat pane lying along a sloped line of the profile (a windscreen), a hair outside it */
  const len = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0), p = new THREE.Mesh(new THREE.PlaneGeometry(len, width), mat);
  p.rotation.set(-Math.PI / 2, 0, 0); p.rotation.order = 'ZXY'; p.rotation.z = a; p.rotation.x = -Math.PI / 2; p.position.set((x0 + x1) / 2 - Math.sin(a) * off, (y0 + y1) / 2 + Math.cos(a) * off, 0); g.add(p);
}

/* ---------- a small saloon car, about 4.4 m long ---------- */
export function sedan(color = 0x8a9aa0) {
  const g = new THREE.Group(), paint = M(color, 0.4, 0.35);
  g.add(extrude([[-2.18, 0.3], [-2.2, 0.56], [-2.02, 0.8], [-1.1, 0.86], [1.05, 0.84], [1.78, 0.7], [2.14, 0.6], [2.2, 0.46], [2.18, 0.3]], 1.7, paint));
  const cab = extrude([[-1.32, 0.84], [-1.02, 1.4], [0.3, 1.42], [1.02, 0.84]], 1.5, GLASS, 0.02); g.add(cab);
  box(g, paint, 1.4, 0.05, 1.56, -0.36, 1.43, 0);                       /* the roof panel */
  box(g, paint, 0.07, 0.56, 1.52, -0.34, 1.12, 0);                      /* the middle pillar */
  for (const z of [-0.75, 0.75]) { box(g, paint, 0.07, 0.5, 0.05, -1.14, 1.12, z, 0, 0, 0.5); box(g, paint, 0.07, 0.5, 0.05, 0.64, 1.12, z, 0, 0, -0.8); }   /* rear and front pillars */
  box(g, DARK, 0.1, 0.2, 1.68, 2.2, 0.42, 0); box(g, DARK, 0.1, 0.2, 1.68, -2.2, 0.42, 0);   /* bumpers */
  box(g, DARK, 0.05, 0.1, 0.8, 2.22, 0.62, 0);                                               /* grille */
  for (const z of [-0.6, 0.6]) { box(g, HEAD, 0.06, 0.12, 0.3, 2.19, 0.62, z); box(g, TAIL, 0.06, 0.12, 0.34, -2.19, 0.7, z); }
  box(g, PLATE, 0.03, 0.12, 0.34, -2.23, 0.52, 0); box(g, PLATE, 0.03, 0.1, 0.3, 2.24, 0.42, 0);
  for (const z of [-0.87, 0.87]) { box(g, LINE, 0.02, 0.5, 0.012, -0.34, 0.97, z); box(g, LINE, 1.6, 0.012, 0.012, -0.34, 0.74, z); box(g, paint, 0.1, 0.07, 0.12, 0.92, 1.0, z * 1.04); }   /* door lines, sill, mirrors */
  for (const [x, z] of [[1.4, 0.78], [1.4, -0.78], [-1.35, 0.78], [-1.35, -0.78]]) wheel(g, 0.31, x, z, Math.sign(z));
  return g;
}

/* ---------- a Hiace-style minibus, about 4.7 m long ---------- */
export function minibus(color = 0xe9ecee, stripe = 0x2c5aa0) {
  const g = new THREE.Group(), paint = M(color, 0.45, 0.25), band = M(stripe, 0.5, 0.2);
  g.add(extrude([[-2.35, 0.3], [-2.37, 1.7], [-2.22, 1.96], [0.9, 2.0], [1.52, 1.62], [1.9, 1.02], [2.3, 0.9], [2.38, 0.6], [2.36, 0.3]], 1.7, paint));
  slopePane(g, GLASS, 0.95, 1.96, 1.5, 1.64, 1.46);                              /* the windscreen */
  for (const z of [-0.857, 0.857]) {
    for (const [x0, x1] of [[-1.95, -1.1], [-0.98, -0.2], [-0.08, 0.7]]) box(g, GLASS, x1 - x0, 0.6, 0.012, (x0 + x1) / 2, 1.5, z);   /* side windows */
    box(g, GLASS, 0.5, 0.55, 0.012, 1.1, 1.55, z * 0.99);                                                                                /* the cab window */
    box(g, band, 4.6, 0.14, 0.014, 0, 0.92, z); box(g, LINE, 0.015, 1.1, 0.012, 0.78, 1.25, z); box(g, LINE, 0.015, 1.1, 0.012, -1.05, 1.25, z);   /* stripe, door and sliding door lines */
    box(g, paint, 0.12, 0.08, 0.14, 1.52, 1.45, z * 1.06);                       /* mirror */
  }
  box(g, DARK, 0.1, 0.22, 1.7, 2.38, 0.46, 0); box(g, DARK, 0.1, 0.22, 1.7, -2.38, 0.46, 0); box(g, DARK, 0.05, 0.14, 0.8, 2.37, 0.74, 0);
  for (const z of [-0.62, 0.62]) { box(g, HEAD, 0.06, 0.14, 0.3, 2.34, 0.8, z); box(g, TAIL, 0.05, 0.4, 0.14, -2.37, 1.1, z * 1.15); }
  box(g, PLATE, 0.03, 0.12, 0.36, -2.4, 0.6, 0); box(g, PLATE, 0.03, 0.1, 0.32, 2.4, 0.46, 0);
  for (const [x, z] of [[1.45, 0.8], [1.45, -0.8], [-1.4, 0.8], [-1.4, -0.8]]) wheel(g, 0.33, x, z, Math.sign(z));
  return g;
}

/* lay a vehicle on its side (rolled about its length) so the wheels face along the street; `side` is +1 or -1. Wrap it so its position and turn still work. */
export function overturned(v, side = 1, height = 1.7) {
  const w = new THREE.Group(); v.rotation.x = side * Math.PI / 2; v.position.y = height / 2 + 0.02; w.add(v); return w;
}
