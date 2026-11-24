/* Palisadoes Airport, Kingston, about 1969: the terminal block with its eight-sided control cab, the long sawtooth canopy along the departure area,
   the waving gallery and its outside staircase, the apron, the runway beyond, the sea and the Blue Mountains behind.
   The terminal follows the National Library of Jamaica photographs (D0002830, D0002829, D0002802: docs/games/air-jamaica.md, "The real Palisadoes
   terminal"): a four-storey central block with ribbon windows and white floor slabs, a recessed ground floor, flagpoles on the roof edge and an
   eight-sided glazed cab on top; in front, a low canopy with a row of pointed (sawtooth) roofs on slim columns; at the canopy's end the waving
   gallery, an open deck with a steel rail on a low building, reached by an outside staircase. Sizes are estimates from the photographs, not a survey.
   The runway, taxi lines and planters are adapted from games/selassie/src/airport-detail.js. Move the shared parts to engine/ when a third game
   needs them (owner rule 10, docs/ENGINE.md).
   Layout (the player's side is +z): the block along z 36 to 48, the canopies in front of it (z 30.8 to 36), the gallery at x 34 to 44, the apron from
   z 30 down to the plane, the runway at z -83, the sea beyond it. */
import * as THREE from "three";
import { terminalDoors } from "./terminal-doors.js";
import { createSea } from "../../../engine/sea.js";
import { grp, box, cyl, mesh, plane, solid, std, T, flat } from "./gfx.js";
import { palm } from "./period-props.js";
import * as P from "./props.js";
const CREAM = P.CREAM,
  METAL = P.METAL,
  rubber = solid(0x282d2a),
  slab = solid(0xe9e6dc, 0.7),
  concrete = solid(0xcfcabd, 0.85),
  dark = solid(0x1f2a2d, 0.3, 0.2),
  glass = solid(0x3a5258, 0.2, 0.2),
  rail = solid(0x6b7370, 0.45, 0.6),
  blue = solid(0x2f6b8f, 0.6);
/* the waving gallery: its deck, in world metres. The staircase climbs along the front, from x 25 up to x 34. */
export const GALLERY = { x0: 34.5, x1: 44, z0: 28.9, z1: 35, top: 4.6, stairX0: 24.5, stairX1: 34.5, stairZ: 29.7, stairW: 1.5 };
export function airport(Q, { deck = false } = {}) {
  const g = Q.group;
  const sea = createSea(g, { kind: "caribbean", y: -0.14, at: [0, 0], size: 300, far: 3000, farDrop: 0.15, swell: 0.5 }).near;
  Q.tickers.push((t) => sea?.tick?.(t));
  const land = plane(2600, 110, std(T.grass([260, 12], [129, 141, 105])), 0, -0.04, -83, g);
  land.rotation.x = -Math.PI / 2;
  /* ---- the terminal block: a recessed ground floor, three upper floors on white slabs with ribbon windows, a roof parapet, the cab ---- */
  box(32, 3.4, 9, dark, 0, 1.7, 42.5, g); /* the recessed ground floor, glazed and dark */
  for (let x = -15; x <= 15; x += 3) box(0.4, 3.4, 0.4, concrete, x, 1.7, 37.6, g);
  box(35, 9.8, 11.4, CREAM, 0, 8.3, 42, g); /* the block's core, behind the glass: the floors stand on it */
  for (const [y0, y1] of [[3.4, 3.7], [6.5, 6.8], [9.6, 9.9], [12.7, 13.0]]) box(36.4, y1 - y0, 12.6, slab, 0, (y0 + y1) / 2, 42, g);
  for (const y of [5.05, 8.15, 11.25]) {
    box(35.6, 1.5, 11.8, glass, 0, y, 42, g); /* a floor's ribbon of glass wraps the block */
    for (let x = -17.6; x <= 17.6; x += 2.2) for (const z of [36.0, 48.0]) box(0.08, 1.55, 0.12, CREAM, x, y, z, g); /* mullions on both faces */
  }
  box(36.4, 0.5, 12.6, concrete, 0, 13.25, 42, g); /* the parapet */
  /* flagpoles along the roof's front edge, each with a small flag (the photographs show several) */
  for (const x of [-15, -9, -3, 3]) {
    cyl(0.05, 0.05, 6.2, METAL, x, 16.3, 36.4, g, 6);
    box(1.0, 0.6, 0.02, solid([0x1a8a3a, 0xf2c62c, 0x1a8a3a, 0x111111][((x + 15) / 6) | 0], 0.7), x + 0.55, 18.9, 36.4, g);
  }
  /* the control cab: an eight-sided glazed room on a short plinth with a deep roof overhang, and aerials */
  const cab = grp(g, 7, 13.5, 42);
  const oct = (r, h, m, y) => {
    const o = mesh(new THREE.CylinderGeometry(r, r, h, 8), m, 0, y, 0, cab);
    o.rotation.y = Math.PI / 8;
    return o;
  };
  oct(3.2, 1.0, slab, 0.5);
  oct(3.0, 2.6, glass, 2.3);
  oct(3.3, 0.18, slab, 3.7);
  oct(3.9, 0.3, slab, 3.95);
  cyl(0.05, 0.05, 3.2, METAL, 0.5, 5.6, 0.2, cab, 6);
  box(1.6, 0.04, 0.04, METAL, 0.5, 6.9, 0.2, cab);
  cyl(0.04, 0.04, 2.2, METAL, -1.2, 5.2, -0.8, cab, 6);
  Q.walls.push([-18.2, 35.8, 18.2, 48.3]);
  /* the terminal's name over the canopy */
  const name = P.label("PALISADOES AIRPORT", 12, 0.8, "#e9e6dc", "#2f6b8f");
  name.position.set(-7, 5.0, 35.88);
  name.rotation.y = Math.PI;
  g.add(name);
  /* three pairs of glass doors on the ground floor, under the canopy */
  for (const x of [-7.5, -1.5, 4.5]) {
    const d = terminalDoors({ w: 1.9, h: 2.4 });
    d.position.set(x, 0.0, 37.55);
    d.rotation.y = Math.PI;
    g.add(d);
  }
  /* ---- the canopies: slim columns, a dark glazed back wall and a row of pointed (sawtooth) roofs with white edges ---- */
  const canopy = (x0, x1) => {
    const z0 = 30.8, z1 = 36;
    box(x1 - x0, 0.1, z1 - z0, concrete, (x0 + x1) / 2, 0.05, (z0 + z1) / 2, g);
    box(x1 - x0, 2.8, 0.15, glass, (x0 + x1) / 2, 1.5, z1 - 0.1, g);
    for (let x = x0; x <= x1 + 0.01; x += 3) {
      box(0.35, 3.6, 0.35, CREAM, x, 1.8, z0 + 0.2, g);
      box(0.35, 3.6, 0.35, CREAM, x, 1.8, z1 - 0.3, g);
    }
    /* the sawtooth: each bay a triangular roof, ridge running front to back, 3 m wide and 0.9 m high */
    for (let x = x0; x < x1 - 0.01; x += 3) {
      const sh = new THREE.Shape();
      sh.moveTo(-1.5, 0); sh.lineTo(0, 0.9); sh.lineTo(1.5, 0); sh.closePath();
      const r = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: z1 - z0 + 0.6, bevelEnabled: false }), slab);
      r.position.set(x + 1.5, 3.6, z0 - 0.3);
      g.add(r);
    }
    box(x1 - x0, 0.22, 0.2, slab, (x0 + x1) / 2, 3.58, z0 - 0.25, g);
    Q.walls.push([x0, z1 - 0.7, x1, z1 + 0.2]);
  };
  canopy(-46, -18);
  canopy(18, 34.5);
  /* ---- the waving gallery: a low building with a deck on its roof, a steel rail, and the outside staircase ---- */
  const G = GALLERY, gw = G.x1 - G.x0, gd = G.z1 - G.z0;
  /* the building under the deck, made as four walls (hollow), so people on the deck never stand inside a solid block */
  const hb = G.top - 0.2, cx = (G.x0 + G.x1) / 2, cz = (G.z0 + G.z1) / 2;
  box(gw, hb, 0.3, concrete, cx, hb / 2, G.z0 + 0.15, g);
  box(gw, hb, 0.3, concrete, cx, hb / 2, G.z1 - 0.15, g);
  box(0.3, hb, gd - 0.6, concrete, G.x0 + 0.15, hb / 2, cz, g);
  box(0.3, hb, gd - 0.6, concrete, G.x1 - 0.15, hb / 2, cz, g);
  box(gw + 0.3, 0.2, gd + 0.3, solid(0xaaa597, 0.9), (G.x0 + G.x1) / 2, G.top - 0.1, (G.z0 + G.z1) / 2, g); /* the deck's floor: a plain mid-grey concrete */
  const post = (x, z, h = 1.05) => cyl(0.03, 0.03, h, rail, x, G.top + h / 2, z, g, 6);
  const run = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    for (const h of [1.05, 0.55]) {
      const r = box(len, 0.04, 0.04, rail, (x0 + x1) / 2, G.top + h, (z0 + z1) / 2, g);
      r.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    }
    for (let k = 0; k <= len; k += 1.2) post(x0 + ((x1 - x0) * k) / len, z0 + ((z1 - z0) * k) / len);
  };
  run(G.x0 + 0.1, G.z0 + 0.01, G.x1 - 0.1, G.z0 + 0.01); /* the front, toward the apron: in line with the staircase's outer rail */
  run(G.x0 + 0.1, G.z0 + 1.7, G.x0 + 0.1, G.z1 - 0.1); /* the left side, open at the front corner where the staircase arrives */
  run(G.x1 - 0.1, G.z0 + 0.1, G.x1 - 0.1, G.z1 - 0.1);
  run(G.x0 + 0.1, G.z1 - 0.1, G.x1 - 0.1, G.z1 - 0.1);
  /* a lamp standard on the deck, as the photograph shows, with a white globe */
  cyl(0.05, 0.06, 2.6, METAL, G.x1 - 1.0, G.top + 1.3, G.z1 - 0.8, g, 6);
  mesh(new THREE.SphereGeometry(0.22, 10, 8), solid(0xf4f0e0, 0.4), G.x1 - 1.0, G.top + 2.7, G.z1 - 0.8, g);
  /* the staircase: it climbs straight onto the deck's open left side, beside the front rail. Each tread is a solid block from the ground to its own
     top. The handrail runs parallel to the line of the nosings, 1.05 m over the deck at the top so that it meets the deck's own rail, and each post
     stands on a tread. */
  const run_ = G.stairX1 - G.stairX0, n = 14, rise = G.top / n, step = run_ / n;
  for (let i = 0; i < n; i++) box(step * 1.02, rise * (i + 1), G.stairW, concrete, G.stairX0 + (i + 0.5) * step, (rise * (i + 1)) / 2, G.stairZ, g);
  const ang = Math.atan2(G.top, run_), len = Math.hypot(run_, G.top), off = 1.05 - rise; /* the rail's height over the nosing line */
  const pitch = (x) => (G.top * (x - G.stairX0)) / run_ + rise; /* the nosing line, extended */
  for (const dz of [-G.stairW / 2 - 0.04, G.stairW / 2 + 0.04]) {
    const xm = (G.stairX0 + G.stairX1) / 2;
    const r = box(len, 0.04, 0.04, rail, xm, pitch(xm) + off, G.stairZ + dz, g);
    r.rotation.z = ang;
    r.scale.x = 1;
    for (const i of [0, 3, 6, 9, 12, 13]) {
      const x = G.stairX0 + (i + 0.5) * step, base = rise * (i + 1), top = pitch(x) + off + 0.02;
      cyl(0.03, 0.03, top - base, rail, x, base + (top - base) / 2, G.stairZ + dz, g, 6);
    }
  }
  Q.walls.push([G.stairX0, G.stairZ - G.stairW / 2 - 0.1, G.stairX1, G.stairZ + G.stairW / 2 + 0.1]);
  if (!deck) Q.walls.push([G.x0, G.z0, G.x1, G.z1]); /* on the apron the gallery's building is solid; up on the deck it is the floor */
  /* ---- baggage carts, the runway, planters, hills and palms (adapted from Selassie's Palisadoes) ---- */
  for (const [x, z] of [[-24, 27], [-28, 27], [-12, 28]]) {
    const cart = grp(g, x, 0, z);
    box(2, 0.12, 1, blue, 0, 0.55, 0, cart);
    for (const xx of [-0.75, 0.75])
      for (const zz of [-0.4, 0.4]) {
        const w = cyl(0.19, 0.19, 0.1, rubber, xx, 0.19, zz, cart, 10);
        w.rotation.x = Math.PI / 2;
        box(0.045, 0.3, 0.045, METAL, xx, 0.37, zz, cart);
      }
    for (const zz of [-0.5, 0.5]) {
      box(2, 0.04, 0.04, METAL, 0, 1, zz, cart);
      for (const xx of [-1, 1]) box(0.04, 0.45, 0.04, METAL, xx, 0.8, zz, cart);
    }
    for (let i = 0; i < 4; i++) {
      const xx = ((i % 2) - 0.5) * 0.75, zz = (Math.floor(i / 2) - 0.5) * 0.4;
      box(0.64, 0.38, 0.36, solid([0x8c6b49, 0x616e62, 0xa88c60, 0x775d46][i]), xx, 0.79, zz, cart);
    }
    Q.walls.push([x - 1.15, z - 0.65, x + 1.15, z + 0.65]);
  }
  /* the runway: black asphalt (Wikipedia gives the surface as asphalt), 1,800 m long here, with white centre dashes, piano keys at each end, edge lights */
  box(1800, 0.035, 42, solid(0x2b2d2e, 0.95), 0, -0.005, -83, g);
  for (let x = -860; x < 860; x += 22) box(8, 0.008, 0.25, solid(0xeceae0), x, 0.018, -83, g);
  for (const x of [-840, 840]) for (let z = -100; z < -66; z += 2.2) box(15, 0.008, 0.8, solid(0xeceae0), x, 0.02, z, g);
  for (const z of [-104, -62])
    for (let x = -880; x <= 880; x += 22) {
      cyl(0.07, 0.09, 0.2, solid(0x888673), x, 0.1, z, g, 6);
      mesh(new THREE.SphereGeometry(0.07, 6, 4), solid(0xf0d69a), x, 0.23, z, g);
    }
  for (let x = -70; x < 40; x += 8) box(5, 0.008, 0.14, solid(0xd5b44e), x, 0.025, -22, g);
  for (const [x, z] of [[48, 28], [52, 22], [-52, 28]]) {
    const tub = grp(g, x, 0, z);
    cyl(0.9, 0.65, 0.65, concrete, 0, 0.325, 0, tub, 12);
    cyl(0.79, 0.79, 0.02, solid(0x685e41), 0, 0.64, 0, tub, 12);
    const tree = palm(5.8, Math.round(x * z));
    tree.position.y = 0.64;
    tub.add(tree);
    Q.walls.push([x - 1, z - 1, x + 1, z + 1]);
  }
  for (let i = 0; i < 12; i++) {
    const m = mesh(new THREE.SphereGeometry(1, 14, 8), flat([0x748777, 0x829488, 0x94a396][i % 3]), -240 + i * 28, -3, 160 + (i % 4) * 15, g);
    m.scale.set(37, 15 + (i % 4) * 9, 28);
  }
  for (let i = 0; i < 8; i++) {
    const tree = palm(6.5, i + 91);
    tree.position.set(-54 + i * 16, 0, 56 + (i % 3) * 3);
    g.add(tree);
  }
}
