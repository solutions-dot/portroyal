/* HMT Empire Windrush as she looked in June 1948, reconstructed in code (no archive image is used as a texture).
   Built 1930 by Blohm & Voss as the motor ship Monte Rosa: 152.5 m long, 20 m beam, 8 m draught, 14,414 tons after her 1947 refit.
   Shape: a straight stem raked forward, a cruiser stern, sheer rising to bow and stern, a raised forecastle and poop with well decks,
   a long midships superstructure of three tiers, two raked funnels close together amidships, a foremast and a mainmast with cargo derricks.
   Colours: the Ministry of Transport troopship livery (white hull, broad blue band at the sheer, buff funnels, red boot-topping).
   What could not be confirmed from a 1948 colour photograph is listed in docs/games/windrush.md.
   Frame: the bow points to +x, the starboard side is +z, the still waterline is y = 0. The main deck amidships is 7 m above it. */
import * as THREE from "three";
import { cv, std, solid, mesh, box, cyl, plane, grp } from "./gfx.js";

export const SHIP = { L: 152.5, B: 20, keel: -8, deck: 7 };
const C = {
  white: new THREE.Color(0xe9e7de),
  blue: new THREE.Color(0x2c4f7c),
  boot: new THREE.Color(0x7a2e26),
  below: new THREE.Color(0x5a2a24),
};
const halfBeam = (s) => {
  // s: 0 at the stern, 1 at the bow. Full amidships, fine at the bow, rounded at the stern.
  if (s > 0.62) return 1 - Math.pow((s - 0.62) / 0.38, 1.9);
  if (s < 0.2) return 0.35 + 0.65 * Math.sin(((s / 0.2) * Math.PI) / 2);
  return 1;
};
const sheer = (s) => SHIP.deck + 2.4 * Math.pow(Math.max(0, s - 0.55) / 0.45, 2) + 1.3 * Math.pow(Math.max(0, 0.3 - s) / 0.3, 2);
/* the hull: rings of points from the keel to the deck edge, coloured by height (boot-topping, white, blue band) */
function hull() {
  const { L, B } = SHIP,
    N = 44,
    pos = [],
    col = [],
    idx = [];
  // heights of the rings up the side: pairs a hair apart make the colour changes crisp (red below the water, the boot-topping, white, the blue band)
  const levels = (top) => [
    [SHIP.keel, C.below], [-6, C.below], [-4, C.below], [-2, C.below], [-0.42, C.below], [-0.4, C.boot], [0.55, C.boot], [0.57, C.white], [2.5, C.white],
    [top - 2.02, C.white], [top - 2.0, C.blue], [top - 0.62, C.blue], [top - 0.6, C.white], [top, C.white]];
  const K = levels(7).length - 1;
  for (let i = 0; i <= N; i++) {
    const s = i / N,
      x = -L / 2 + s * L,
      top = sheer(s),
      hb = (B / 2) * halfBeam(s),
      bowRake = s > 0.92 ? (s - 0.92) / 0.08 : 0;
    for (const [y, c] of levels(top)) {
      // below the waterline the sides curve in to the keel (bilge); at the bow and stern the lower hull is finer still
      const fine = Math.min(1, 0.5 + 0.5 * halfBeam(Math.min(1, s * 1.05)));
      let w = hb * (y < -1 ? Math.pow(Math.max(0, (y - SHIP.keel) / (-1 - SHIP.keel)), 0.35) * (0.72 + 0.28 * fine) : 1);
      if (s > 0.62) w *= y > 0 ? 1 + 0.12 * ((s - 0.62) / 0.38) * (y / top) : 1; // flare at the bow
      const xx = x - bowRake * (top - y) * 0.35; // the stem rakes forward toward the deck
      pos.push(xx, y, w);
      col.push(c.r, c.g, c.b);
    }
  }
  const ring = K + 1,
    side = (pos.length / 3) | 0;
  // mirror to port
  for (let i = 0; i < side; i++) {
    pos.push(pos[i * 3], pos[i * 3 + 1], -pos[i * 3 + 2]);
    col.push(col[i * 3], col[i * 3 + 1], col[i * 3 + 2]);
  }
  for (let i = 0; i < N; i++)
    for (let k = 0; k < K; k++) {
      const a = i * ring + k,
        b = (i + 1) * ring + k;
      idx.push(a, b, b + 1, a, b + 1, a + 1);
      idx.push(side + a, side + b + 1, side + b, side + a, side + a + 1, side + b + 1);
    }
  // the transom at the stern and the keel strip
  for (let k = 0; k < K; k++) idx.push(k, side + k, side + k + 1, k, side + k + 1, k + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide }));
  return m;
}
/* a deck surface following the hull's plan at height y, between s0 and s1 */
function deckPlate(s0, s1, y, mat, inset = 0.25) {
  const pts = [],
    N = 24,
    { L, B } = SHIP;
  for (let i = 0; i <= N; i++) {
    const s = s0 + ((s1 - s0) * i) / N;
    pts.push(new THREE.Vector2(-L / 2 + s * L, (B / 2) * halfBeam(s) - inset));
  }
  for (let i = N; i >= 0; i--) {
    const s = s0 + ((s1 - s0) * i) / N;
    pts.push(new THREE.Vector2(-L / 2 + s * L, -(B / 2) * halfBeam(s) + inset));
  }
  const geo = new THREE.ShapeGeometry(new THREE.Shape(pts));
  geo.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(geo, mat);
  m.position.y = y;
  m.material.side = THREE.DoubleSide;
  return m;
}
/* a band of windows or portholes drawn on a canvas, repeated along a side */
const winTex = (kind) =>
  cv(
    256,
    64,
    (x, W, H) => {
      x.fillStyle = "#e9e7de";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#26343a";
      if (kind === "port") for (let i = 0; i < 8; i++) {
        x.beginPath();
        x.arc(16 + i * 32, H / 2, 6, 0, 7);
        x.fill();
      }
      else for (let i = 0; i < 4; i++) x.fillRect(10 + i * 64, H * 0.22, 44, H * 0.5);
    },
    [1, 1],
  );
const _tex = {};
function band(kind, len) {
  const t = (_tex[kind] = _tex[kind] || winTex(kind)).clone();
  t.needsUpdate = true;
  t.repeat.set(len / (kind === "port" ? 9 : 8), 1);
  return std(t, 0.6);
}
function superTier(g, x0, x1, y, h, w, kind, white) {
  box(x1 - x0, h, w, white, (x0 + x1) / 2, y + h / 2, 0, g);
  for (const s of [-1, 1]) {
    const p = plane(x1 - x0 - 0.6, h * 0.55, band(kind, x1 - x0), (x0 + x1) / 2, y + h * 0.55, s * (w / 2 + 0.02), g);
    if (s < 0) p.rotation.y = Math.PI;
  }
  box(x1 - x0 + 1.2, 0.22, w + 1.4, solid(0xd8d4c8, 0.8), (x0 + x1) / 2, y + h + 0.11, 0, g);
}
function rail(g, x0, x1, y, z, m) {
  box(x1 - x0, 0.05, 0.05, m, (x0 + x1) / 2, y + 1.05, z, g);
  box(x1 - x0, 0.03, 0.03, m, (x0 + x1) / 2, y + 0.55, z, g);
  for (let x = x0; x <= x1; x += 2) box(0.04, 1.05, 0.04, m, x, y + 0.53, z, g);
}
function funnel(g, x, buff, black) {
  const f = grp(g, x, SHIP.deck + 5.7, 0);
  const body = cyl(2.2, 2.55, 12, buff, 0, 6, 0, f, 20);
  body.scale.set(1.45, 1, 1);
  const top = cyl(2.22, 2.22, 1.6, black, 0, 12.2, 0, f, 20);
  top.scale.set(1.46, 1, 1);
  f.rotation.z = 0.1; // raked aft
  return f;
}
function mast(g, x, h, m, rig) {
  cyl(0.28, 0.4, h, m, x, h / 2, 0, g, 10);
  box(0.25, 0.25, 4.6, m, x, h * 0.72, 0, g);
  for (const s of [-1, 1]) {
    line(g, [x, h - 0.5, 0], [x - 9, 9, s * 9.3], rig, 0.03);
    line(g, [x, h - 0.5, 0], [x + 4, 9, s * 9.3], rig, 0.03);
  }
}
export function line(parent, a, b, material, r = 0.03) {
  const p = new THREE.Vector3(...a),
    q = new THREE.Vector3(...b),
    d = q.clone().sub(p);
  const o = cyl(r, r, d.length(), material, ...p.clone().add(q).multiplyScalar(0.5).toArray(), parent, 5);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return o;
}
function derrick(g, x, y, toward, m) {
  // a kingpost pair with a derrick boom leaning over the hatch
  for (const s of [-1, 1]) cyl(0.22, 0.26, 9, m, x, y + 4.5, s * 3.2, g, 8);
  box(0.3, 0.3, 6.6, m, x, y + 8.6, 0, g);
  for (const s of [-1, 1]) line(g, [x, y + 1.2, s * 3.2], [x + toward * 8, y + 5.5, s * 1.4], m, 0.12);
}
function lifeboat(g, x, y, z, white, wood, steel) {
  const b = grp(g, x, y, z);
  const hull = mesh(new THREE.SphereGeometry(1, 14, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), white, 0, 0.75, 0, b);
  hull.scale.set(3.6, 0.8, 1.05);
  box(7, 0.08, 2, wood, 0, 0.76, 0, b);
  const s = Math.sign(z);
  for (const dx of [-2.9, 2.9]) {
    box(0.16, 2.8, 0.16, steel, dx, 1.4 - 0.4, -s * 0.9, b);
    const arm = box(0.14, 0.14, 1.5, steel, dx, 2.5, -s * 0.25, b);
    line(b, [dx, 2.5, s * 0.4], [dx, 1.3, 0], solid(0xb59a6a, 1), 0.015);
  }
}
function nameplate(text, w, h) {
  const t = cv(1024, Math.round((1024 * h) / w), (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#1f2b30";
    x.font = "bold " + Math.round(H * 0.72) + "px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2, W * 0.96);
  });
  return new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
}
export function windrush() {
  const g = grp(),
    white = solid(0xece9df, 0.7),
    deckWood = solid(0xa58e68, 0.95),
    buff = solid(0xc9a45e, 0.6),
    black = solid(0x26292b, 0.7),
    steel = solid(0x9a9c98, 0.5, 0.4),
    rig = solid(0x3a3a38, 0.8),
    wood = solid(0x8a6a44, 0.9),
    glass = solid(0x2b3a40, 0.25, 0.2);
  const { L, B } = SHIP,
    X = (s) => -L / 2 + s * L;
  g.add(hull());
  // decks: the main deck (well decks fore and aft), the raised forecastle and poop
  g.add(deckPlate(0.0, 1.0, SHIP.deck + 0.02, deckWood, 0.3));
  g.add(deckPlate(0.8, 0.985, sheer(0.9) - 0.1, deckWood, 0.35));
  g.add(deckPlate(0.015, 0.16, sheer(0.06) - 0.1, deckWood, 0.35));
  // bulwarks round the forecastle and poop (solid, white), rails along the well decks
  for (const s of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      const a = 0.8 + (i * 0.185) / 12,
        b = 0.8 + ((i + 1) * 0.185) / 12,
        za = s * ((B / 2) * halfBeam(a) - 0.1),
        zb = s * ((B / 2) * halfBeam(b) - 0.1),
        p = box(Math.hypot(X(b) - X(a), zb - za) + 0.05, 1.1, 0.15, white, (X(a) + X(b)) / 2, sheer((a + b) / 2) + 0.45, (za + zb) / 2, g);
      p.rotation.y = -Math.atan2(zb - za, X(b) - X(a));
    }
    rail(g, X(0.16), X(0.8), SHIP.deck, s * (B / 2 - 0.15), steel);
  }
  // the long midships superstructure: promenade deck, boat deck, then the bridge house forward
  superTier(g, X(0.24), X(0.72), SHIP.deck, 2.8, 16.8, "win", white);
  superTier(g, X(0.3), X(0.66), SHIP.deck + 3.0, 2.6, 14.6, "win", white);
  superTier(g, X(0.56), X(0.68), SHIP.deck + 5.8, 2.6, 11.5, "win", white);
  // the wheelhouse front, its windows, and the bridge wings out to the ship's side
  box(1.2, 1.1, 11.5, white, X(0.68) + 0.7, SHIP.deck + 8.45, 0, g);
  const wh = plane(10.5, 0.7, band("win", 10.5), X(0.68) + 1.31, SHIP.deck + 8.6, 0, g);
  wh.rotation.y = Math.PI / 2;
  box(3, 0.25, B - 1, solid(0xd8d4c8, 0.8), X(0.66), SHIP.deck + 8.45, 0, g);
  for (const s of [-1, 1]) box(2.8, 1.0, 0.1, white, X(0.66), SHIP.deck + 9.05, s * (B / 2 - 0.5), g);
  // rails round the boat deck and promenade
  for (const s of [-1, 1]) {
    rail(g, X(0.24), X(0.72), SHIP.deck + 2.92, s * 8.9, steel);
    rail(g, X(0.3), X(0.66), SHIP.deck + 5.72, s * 7.9, steel);
  }
  // portholes along the hull below the main deck, two rows
  const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.21, 10), black, 2 * 2 * 46);
  let n = 0;
  const o = new THREE.Object3D();
  for (const s of [-1, 1])
    for (const y of [2.2, 4.6])
      for (let i = 0; i < 46; i++) {
        const sx = 0.14 + (i / 45) * 0.7,
          z = s * ((B / 2) * halfBeam(sx) + 0.03);
        o.position.set(X(sx), y, z);
        o.rotation.set(0, s > 0 ? 0 : Math.PI, 0);
        o.updateMatrix();
        holes.setMatrixAt(n++, o.matrix);
      }
  holes.count = n;
  g.add(holes);
  // two funnels, close together amidships, buff with black tops
  funnel(g, X(0.43), buff, black);
  funnel(g, X(0.52), buff, black);
  // masts and derricks over the forward and after hatches
  mast(g, X(0.84), 34, steel, rig);
  mast(g, X(0.12), 30, steel, rig);
  line(g, [X(0.84), 33, 0], [X(0.12), 29, 0], rig, 0.025);
  derrick(g, X(0.76), SHIP.deck, 1, steel);
  derrick(g, X(0.2), SHIP.deck, -1, steel);
  for (const s of [0.78, 0.2]) box(6, 0.7, 5, solid(0x55624f, 1), X(s) + (s > 0.5 ? 4 : -4), SHIP.deck + 0.35, 0, g);
  // lifeboats on davits along the boat deck, both sides
  for (const s of [-1, 1]) for (const sx of [0.33, 0.39, 0.46, 0.53, 0.6]) lifeboat(g, X(sx), SHIP.deck + 5.8, s * 7.6, white, wood, steel);
  // anchors at the hawse pipes, and the name on the bow and the stern
  for (const s of [-1, 1]) {
    const z = s * ((B / 2) * halfBeam(0.95) + 0.06);
    cyl(0.5, 0.5, 0.1, black, X(0.95), sheer(0.95) - 2.4, z, g, 10).rotation.x = Math.PI / 2;
    box(0.3, 1.8, 0.12, black, X(0.95), sheer(0.95) - 3.4, z, g);
    box(1.4, 0.3, 0.12, black, X(0.95), sheer(0.95) - 4.3, z, g);
    const name = plane(13, 1.15, nameplate("EMPIRE WINDRUSH", 13, 1.15), X(0.83), sheer(0.83) - 0.95, s * ((B / 2) * halfBeam(0.83) * (1 + 0.12 * 0.55 * 0.9) + 0.25), g);
    name.rotation.y = s > 0 ? -0.1 : Math.PI + 0.1;
  }
  const stern = plane(11, 1.0, nameplate("EMPIRE WINDRUSH", 11, 1.0), X(0) - 0.12, sheer(0) - 1.4, 0, g);
  stern.rotation.y = -Math.PI / 2;
  const port = plane(5, 0.7, nameplate("LONDON", 5, 0.7), X(0) - 0.12, sheer(0) - 2.4, 0, g);
  port.rotation.y = -Math.PI / 2;
  // a flagstaff at the stern with the Red Ensign's staff left bare (no flag shown) and a jackstaff at the bow
  cyl(0.05, 0.07, 6, steel, X(0.02), sheer(0.02) + 3, 0, g, 6);
  cyl(0.04, 0.06, 4, steel, X(0.985), sheer(0.985) + 2, 0, g, 6);
  return g;
}
/* the gangway from the ship's side down to the quay: from (x, deckY, shipZ) to (x, quayY, quayZ) */
export function gangway(from, to, w = 1.6) {
  const g = grp(),
    steel = solid(0x8a8c88, 0.5, 0.3),
    tread = solid(0xa2a799, 0.9),
    n = Math.round(Math.hypot(to[1] - from[1], to[2] - from[2]) / 0.45);
  for (let i = 0; i <= n; i++) {
    const t = i / n,
      y = from[1] + (to[1] - from[1]) * t,
      z = from[2] + (to[2] - from[2]) * t;
    box(w, 0.06, 0.42, tread, from[0], y, z, g);
    for (const s of [-1, 1]) box(0.035, 1, 0.035, steel, from[0] + (s * w) / 2, y + 0.5, z, g);
  }
  for (const s of [-1, 1]) for (const dy of [0, 1]) line(g, [from[0] + (s * w) / 2, from[1] + dy, from[2]], [to[0] + (s * w) / 2, to[1] + dy, to[2]], steel, 0.03);
  return g;
}
