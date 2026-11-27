/* The larger scenery of the five places: the limestone country, the cattle pen, Edinburgh Castle, the hall, the sinkhole and the square at
   Spanish Town. Each builder returns a THREE.Group standing on y = 0 at its own origin. What each is modelled on, and what is still a general
   picture, is in docs/games/hutchinson.md ("Places"). Everything here is still scenery: it is merged into a few meshes when the place is built. */
import * as THREE from "three";
import { vessel } from "../../../engine/vessel.js";
import { writtenPage } from "../../../engine/page.js";
import { T, cv, grain, std, solid, flat, mesh, box, cyl, plane, grp, rng } from "./gfx.js";
import { loftSkin } from "../../../engine/loft.js";
import { vnoise, fbm } from "../../../engine/ridges.js";
import * as W from "./world.js";
import { makeDoor } from "../../../engine/door.js";
import { hearthFire } from "../../../engine/flame.js";   /* the shared fire (Port Royal's tavern hearth) */

const once = new Map();
const keep = (k, make) => (once.has(k) ? once.get(k) : (once.set(k, make()), once.get(k)));
const noAudit = (o) => (o.traverse((n) => (n.userData.noAudit = true)), o);
const dynamic = (o) => (o.traverse((n) => (n.userData.noBatch = true)), o);

/* ---------- textures drawn in code ---------- */
/* thatch: dry Guinea grass or palm laid in courses */
export const thatchTex = (repeat = [3, 2]) =>
  keep("thatch" + repeat, () =>
    cv(
      128,
      128,
      (x, w, h) => {
        x.fillStyle = "#a08a58";
        x.fillRect(0, 0, w, h);
        for (let i = 0; i < 700; i++) {
          const g = 110 + Math.random() * 90;
          x.strokeStyle = `rgba(${g | 0},${(g * 0.86) | 0},${(g * 0.52) | 0},0.7)`;
          const px = Math.random() * w,
            py = Math.random() * h;
          x.beginPath();
          x.moveTo(px, py);
          x.lineTo(px + (Math.random() - 0.5) * 5, py + 8 + Math.random() * 14);
          x.stroke();
        }
        for (let y = 0; y < h; y += 32) {
          x.fillStyle = "rgba(50,38,20,0.35)";
          x.fillRect(0, y, w, 3);
        }
      },
      repeat,
    ),
  );
/* wattle and daub: clay over woven sticks, cracked and patched */
export const daubTex = (repeat = [2, 1]) =>
  keep("daub" + repeat, () =>
    cv(
      128,
      128,
      (x, w, h) => {
        x.fillStyle = "#b39a72";
        x.fillRect(0, 0, w, h);
        for (let i = 0; i < 26; i++) {
          x.fillStyle = `rgba(${(120 + Math.random() * 70) | 0},${(100 + Math.random() * 50) | 0},${(70 + Math.random() * 40) | 0},0.25)`;
          x.beginPath();
          x.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 22, 5 + Math.random() * 12, Math.random() * 3, 0, 7);
          x.fill();
        }
        x.strokeStyle = "rgba(70,52,34,0.5)";
        for (let i = 0; i < 9; i++) {
          let px = Math.random() * w,
            py = Math.random() * h;
          x.beginPath();
          x.moveTo(px, py);
          for (let k = 0; k < 4; k++) x.lineTo((px += (Math.random() - 0.5) * 16), (py += 4 + Math.random() * 10));
          x.stroke();
        }
        grain(x, w, h, 14);
      },
      repeat,
    ),
  );
/* brick in lime mortar, for the public buildings of Spanish Town */
export const brickTex = (rgb = [156, 84, 62], repeat = [4, 4]) =>
  keep("brick" + rgb + repeat, () =>
    cv(
      256,
      256,
      (x, w, h) => {
        x.fillStyle = "#cdbfa6";
        x.fillRect(0, 0, w, h);
        const bh = 16,
          bw = 42;
        for (let row = 0; row * bh < h; row++)
          for (let i = -1; i * bw < w; i++) {
            const k = 0.84 + Math.random() * 0.3;
            x.fillStyle = `rgb(${(rgb[0] * k) | 0},${(rgb[1] * k) | 0},${(rgb[2] * k) | 0})`;
            x.fillRect(i * bw + (row % 2 ? bw / 2 : 0) + 1, row * bh + 1, bw - 2, bh - 2);
          }
        grain(x, w, h, 12);
      },
      repeat,
    ),
  );
/* wooden shingles in courses */
export const shingleTex = (repeat = [6, 4]) =>
  keep("shingle" + repeat, () =>
    cv(
      128,
      128,
      (x, w, h) => {
        x.fillStyle = "#5d5347";
        x.fillRect(0, 0, w, h);
        for (let row = 0; row < 8; row++)
          for (let i = -1; i < 9; i++) {
            const k = 0.8 + Math.random() * 0.35;
            x.fillStyle = `rgb(${(96 * k) | 0},${(86 * k) | 0},${(72 * k) | 0})`;
            x.fillRect(i * 16 + (row % 2 ? 8 : 0) + 0.5, row * 16 + 2, 15, 14);
          }
        for (let row = 0; row < 8; row++) {
          x.fillStyle = "rgba(20,16,12,0.45)";
          x.fillRect(0, row * 16, w, 2);
        }
      },
      repeat,
    ),
  );
/* weathered rock face: grey limestone, streaked dark where the rain runs */
export const cragTex = (repeat = [3, 1]) =>
  keep("crag" + repeat, () =>
    cv(
      256,
      256,
      (x, w, h) => {
        x.fillStyle = "#9c978a";
        x.fillRect(0, 0, w, h);
        for (let i = 0; i < 60; i++) {
          const px = Math.random() * w,
            g = 60 + Math.random() * 60;
          x.fillStyle = `rgba(${g | 0},${g | 0},${(g * 0.92) | 0},${0.1 + Math.random() * 0.22})`;
          x.fillRect(px, Math.random() * h * 0.5, 3 + Math.random() * 12, h * (0.3 + Math.random() * 0.7));
        }
        for (let i = 0; i < 40; i++) {
          x.fillStyle = `rgba(214,210,198,${0.1 + Math.random() * 0.25})`;
          x.beginPath();
          x.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 24, 4 + Math.random() * 10, Math.random() * 3, 0, 7);
          x.fill();
        }
        x.strokeStyle = "rgba(40,40,36,0.5)";
        for (let i = 0; i < 16; i++) {
          let px = Math.random() * w,
            py = Math.random() * h;
          x.beginPath();
          x.moveTo(px, py);
          for (let k = 0; k < 5; k++) x.lineTo((px += (Math.random() - 0.5) * 22), (py += 6 + Math.random() * 20));
          x.stroke();
        }
        grain(x, w, h, 18);
      },
      repeat,
    ),
  );
export const M = {
  thatch: () => keep("m-thatch", () => std(thatchTex(), 1)),
  daub: () => keep("m-daub", () => std(daubTex(), 1)),
  shingle: () => keep("m-shingle", () => std(shingleTex(), 1, { side: THREE.DoubleSide })),
  plaster: solid(0xe4dcc6, 1),
  white: solid(0xece6d6, 0.9),
  green: solid(0x2f4a38, 0.8),
  mud: solid(0x8a765a, 1),
};

/* ---------- the land ---------- */
/* a karst hill: steep-sided and round-topped, wooded, with pale crags where the limestone shows. One coloured mesh. */
/* hills are smooth-shaded (as Nanny Town's land), coloured by soft noise: a forest canopy of darker and lighter greens, and here and there a
   small patch of warm grey limestone among the trees, as in the photographs of the country round the castle. No speckle, no white. */
const HILL = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
const CANOPY_DARK = [0.19, 0.3, 0.14],
  CANOPY_LIGHT = [0.34, 0.44, 0.21],
  LIMESTONE = [0.5, 0.47, 0.39];
/* the colour of a wooded limestone hillside at a point: u, v are smooth coordinates on the hill, y its height (0 to 1), rock 0 to 1 */
function forest(col, k, u, v, y, rock, seed, tone = null) {
  const n = fbm(u, v, 3, seed),
    fine = vnoise(u * 4.1, v * 4.1, seed + 5),
    shade = (0.78 + 0.34 * y) * (0.9 + 0.2 * fine),
    t = tone ? [tone[0] / 0.27, tone[1] / 0.36, tone[2] / 0.19] : [1, 1, 1];
  for (let j = 0; j < 3; j++) {
    const g = (CANOPY_DARK[j] + (CANOPY_LIGHT[j] - CANOPY_DARK[j]) * n) * t[j] * shade;
    col[k * 3 + j] = g + (LIMESTONE[j] * (0.85 + 0.25 * fine) - g) * rock;
  }
}
export function karstHill(r = 30, h = 26, seed = 1, base = [0.3, 0.4, 0.24], crag = 0.3) {
  const rr = rng(seed),
    geo = new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    pos = geo.attributes.position,
    col = new Float32Array(pos.count * 3),
    p1 = rr() * 6,
    p2 = rr() * 6;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k),
      y = pos.getY(k),
      z = pos.getZ(k),
      a = Math.atan2(z, x),
      bump = 1 + 0.1 * Math.sin(a * 3 + p1) + 0.06 * Math.sin(a * 7 + p2) + 0.05 * Math.sin(a * 5 + y * 6 + p1),
      yy = Math.pow(Math.max(0, y), 0.72) * (1 + 0.07 * Math.sin(a * 4 + p2));
    pos.setXYZ(k, x * bump, yy, z * bump);
    const cx = Math.cos(a) * 3 + p1 + y * 2,
      cz = Math.sin(a) * 3 + p2,
      stone = y > 0.1 && y < 0.72 ? Math.max(0, (vnoise(cx * 2, cz * 2, seed + 3) - (1 - crag * 0.5)) / (crag * 0.5)) : 0;
    forest(col, k, cx, cz, y, Math.min(0.6, stone * 1.2), seed);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, HILL);
  m.scale.set(r, h, r * (0.8 + rr() * 0.35));
  m.rotation.y = rr() * 3;
  m.name = "terrain";
  m.userData.soft = true;   /* a hill is ground: the trees, scrub and rocks scattered on its slopes stand into it, as they would on a real hillside (engine/audit.js auditOverlap) */
  return m;
}
/* a cockpit hill of the Pedro district: Long (1774) speaks of "open, level savannahs, environed by rocky eminences, or with little cock-pits".
   Steep round-shouldered sides on a narrow foot, a domed top, a lumpy cover of trees (each bump a crown, dark and light in turn), and pale
   limestone showing in bare faces and ledges low on the steep sides. One coloured mesh. */
export function cockpitHill(r = 18, h = 22, seed = 1, { bare = 0.32, tone = [0.27, 0.36, 0.19] } = {}) {
  const rr = rng(seed),
    geo = new THREE.SphereGeometry(1, 44, 18, 0, Math.PI * 2, 0, Math.PI / 2),
    pos = geo.attributes.position,
    col = new Float32Array(pos.count * 3),
    p1 = rr() * 6,
    p2 = rr() * 6,
    p3 = rr() * 6;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k),
      z = pos.getZ(k),
      a = Math.atan2(z, x),
      rho = Math.min(1, Math.hypot(x, z)),
      lobe = 1 + 0.12 * Math.sin(a * 2 + p1) + 0.07 * Math.sin(a * 5 + p2),
      prof = Math.pow(Math.max(0, 1 - Math.pow(rho, 2.6)), 0.62),   /* steep sides, a rounded top */
      crown = 0.035 * Math.sin(a * 31 + p3 + rho * 9) * Math.sin(rho * 23 + a * 7 + p1) + 0.02 * Math.sin(a * 57 + rho * 31),
      steep = rho > 0.55 && rho < 0.97,
      rock = steep && Math.sin(a * 7 + p2 * 3 + rho * 5) * Math.sin(a * 3 + p1 + rho * 11) > 1 - bare * 1.6,
      y = Math.max(0, prof + (rock ? -0.015 : crown) * (rho < 0.99 ? 1 : 0)),
      rad = rho * lobe * (rock ? 0.985 : 1);
    pos.setXYZ(k, Math.cos(a) * rad, y, Math.sin(a) * rad);
    /* small patches of bare stone only on the steep sides, half hidden by the trees */
    const cx = Math.cos(a) * rho * 3 + p1,
      cz = Math.sin(a) * rho * 3 + p2,
      stone = steep ? Math.max(0, (vnoise(cx * 2.2, cz * 2.2, seed + 3) - (1 - bare * 0.55)) / (bare * 0.55)) : 0;
    forest(col, k, cx, cz, y, Math.min(0.7, stone * 1.4), seed, tone);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, HILL);
  m.scale.set(r, h, r * (0.85 + rr() * 0.3));
  m.rotation.y = rr() * 3;
  m.name = "terrain";
  m.userData.soft = true;   /* a hill is ground: the trees, scrub and rocks scattered on its slopes stand into it, as they would on a real hillside (engine/audit.js auditOverlap) */
  return m;
}
/* a cattle pound of dry-laid limestone: a square of rough wall, chest high, with one gap for a gate of rails. w along x, d along z. */
export function stonePound(w = 7, d = 6, h = 1.3, seed = 2) {
  const g = grp(),
    gap = 1.8;
  const side = (len, x, z, along) => {
    const o = W.fieldWall(len, h, seed + x * 3 + z);
    o.position.set(x, 0, z);
    o.rotation.y = along ? 0 : Math.PI / 2;
    g.add(o);
  };
  side(w, 0, -d / 2, true);
  side(w, 0, d / 2, true);
  side(d, -w / 2, 0, false);
  side((d - gap) / 2, w / 2, -(d + gap) / 4, false);
  side((d - gap) / 2, w / 2, (d + gap) / 4, false);
  /* the gate: rails slid across the gap */
  for (const y of [0.4, 0.8, 1.15]) box(0.06, 0.07, gap + 0.3, W.WM.wood, w / 2 + 0.05, y, 0, g);
  return g;
}
/* grass in tufts: n clumps over an area as one mesh of crossed cards. tint multiplies the green (dry Guinea grass is gold). */
const TUFT = () => keep("m-tuft", () => new THREE.MeshStandardMaterial({ map: T.tuft(), alphaTest: 0.4, side: THREE.DoubleSide, vertexColors: true, roughness: 1 }));
export function tufts(n, area, { seed = 1, clear = [], h = 0.6, tint = [1.25, 0.98, 0.6], round = null } = {}) {
  const r = rng(seed),
    P = [],
    U = [],
    C = [],
    N = [];
  let placed = 0,
    tries = 0;
  while (placed < n && tries++ < n * 20) {
    const x = area[0] + r() * (area[2] - area[0]),
      z = area[1] + r() * (area[3] - area[1]);
    if (clear.some((c) => x > c[0] && x < c[2] && z > c[1] && z < c[3])) continue;
    if (round && Math.hypot(x - round[0], z - round[1]) > round[2]) continue;
    placed++;
    const s = h * (0.7 + r() * 0.7),
      w = s * (0.8 + r() * 0.5),
      a = r() * Math.PI,
      k = 0.8 + r() * 0.4,
      c = [tint[0] * k * 1.1, tint[1] * k * 0.72, tint[2] * (0.85 + r() * 0.3) * 1.2];   /* the card is a bright green: this takes it toward the dull olive and straw of St Ann grass */
    for (const b of [a, a + Math.PI / 2]) {
      const dx = (Math.cos(b) * w) / 2,
        dz = (Math.sin(b) * w) / 2,
        q = [x - dx, 0, z - dz, x + dx, 0, z + dz, x + dx, s, z + dz, x - dx, s, z - dz],
        uv = [0, 0, 1, 0, 1, 1, 0, 1];
      for (const i of [0, 1, 2, 0, 2, 3]) {
        P.push(q[i * 3], q[i * 3 + 1], q[i * 3 + 2]);
        U.push(uv[i * 2], uv[i * 2 + 1]);
        C.push(c[0], c[1], c[2]);
        N.push(0, 1, 0);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
  g.setAttribute("color", new THREE.Float32BufferAttribute(C, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
  const m = new THREE.Mesh(g, TUFT());
  m.userData.noAudit = true;   /* grass tufts: ground cover that stands into everything, as real grass does */
  m.name = "grass";
  return m;
}
/* a patch of ground that is not the rest: a dry pond's cracked mud, a worn yard. A flat disc with a ragged edge, just over the terrain. */
export function patch(rx, rz, mat, seed = 1, y = 0.014, hole = null) {
  const r = rng(seed),
    sh = new THREE.Shape(),
    n = 22;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2,
      k = i === n ? 1 : 0.86 + r() * 0.2,
      first = i === 0 || i === n;
    const px = Math.cos(a) * rx * (first ? 0.95 : k),
      pz = Math.sin(a) * rz * (first ? 0.95 : k);
    if (i === 0) sh.moveTo(px, pz);
    else sh.lineTo(px, pz);
  }
  if (hole) {
    /* hole: [rx, rz, x, z], an opening left in the patch (the sinkhole's mouth) */
    const h = new THREE.Path();
    h.absellipse(hole[2], hole[3], hole[0], hole[1], 0, Math.PI * 2, true);
    sh.holes.push(h);
  }
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 16), mat);
  m.rotation.x = Math.PI / 2;
  m.scale.z = -1;
  m.position.y = y;
  m.name = "terrain";
  const g = grp();
  g.add(m);
  return g;
}
export const mudTex = (repeat = [3, 3]) =>
  keep("mud" + repeat, () =>
    cv(
      256,
      256,
      (x, w, h) => {
        x.fillStyle = "#a8956f";
        x.fillRect(0, 0, w, h);
        grain(x, w, h, 16);
        x.strokeStyle = "rgba(66,52,36,0.75)";
        x.lineWidth = 1.6;
        const r = rng(5);
        for (let i = 0; i < 46; i++) {
          let px = r() * w,
            py = r() * h;
          x.beginPath();
          x.moveTo(px, py);
          for (let k = 0; k < 4; k++) x.lineTo((px += (r() - 0.5) * 44), (py += (r() - 0.5) * 44));
          x.stroke();
        }
      },
      repeat,
    ),
  );

/* ---------- cattle: the shared rigged cow (engine/beasts.js; owner, 27 November 2026: "we need a cow to match") ---------- */
export { cow, COATS } from "../../../engine/beasts.js";
const HIDE = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 });   /* vertex-coloured loft shapes (the cotton tree) */

/* ---------- the pen ---------- */
/* a post-and-rail fence of split logwood, len along x */
export function postRail(len, h = 1.15, rails = 3) {
  const g = grp(),
    n = Math.max(1, Math.round(len / 2.2));
  for (let i = 0; i <= n; i++) cyl(0.06, 0.07, h + 0.1, W.WM.woodDark, -len / 2 + (i * len) / n, (h + 0.1) / 2, 0, g, 6);
  for (let k = 0; k < rails; k++) box(len, 0.07, 0.04, W.WM.wood, 0, h - 0.1 - k * (h / (rails + 0.4)), 0, g);
  return g;
}
/* a thatched hut of wattle and daub: the pen-keeper's house, or one of a row of quarters. w along x, the door in the +z wall. */
export function thatchHut(w = 4.2, d = 3.2, { h = 1.9, door = true, seed = 1 } = {}) {
  const g = grp(),
    r = rng(seed);
  box(w, h, d, M.daub(), 0, h / 2, 0, g);
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) cyl(0.08, 0.09, h + 0.1, W.WM.woodDark, x, h / 2 + 0.05, z, g, 6);
  const roof = mesh(new THREE.ConeGeometry(1, 1, 4, 1), M.thatch(), 0, h + 0.75, 0, g);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set((w / 2 + 0.55) * 1.414, 1.5, (d / 2 + 0.55) * 1.414);
  if (door) {
    box(0.8, 1.6, 0.06, W.WM.dark, w * 0.16, 0.8, d / 2 + 0.01, g);
    const leaf = box(0.78, 1.56, 0.04, W.WM.wood, w * 0.16 + 0.62, 0.8, d / 2 + 0.3, g);
    leaf.rotation.y = 1.15;
    box(0.36, 0.36, 0.06, W.WM.dark, -w * 0.26, 1.2, d / 2 + 0.01, g);
    box(0.4, 0.4, 0.04, W.WM.wood, -w * 0.26, 1.2, d / 2 + 0.035, g).scale.x = 0.14 + r() * 0.1;
  }
  return g;
}
/* a cooking place: three stones, charred wood, an iron pot. lit: embers that glow. */
export function cookFire(lit = false) {
  const g = grp();
  for (let i = 0; i < 3; i++) mesh(new THREE.IcosahedronGeometry(0.16, 0), flat(0x77736a), Math.cos(i * 2.1) * 0.3, 0.09, Math.sin(i * 2.1) * 0.3, g).scale.y = 0.7;
  for (let i = 0; i < 3; i++) cyl(0.03, 0.035, 0.5, solid(0x1c1512, 1), 0, 0.05, 0, g, 5).rotation.set(Math.PI / 2, 0, i * 1.1);
  const pot = mesh(new THREE.SphereGeometry(0.19, 10, 7, 0, 7, 0, 2.1), W.WM.iron, 0, 0.36, 0, g);
  pot.rotation.x = Math.PI;
  cyl(0.17, 0.17, 0.02, solid(0x1a1a1c, 0.5), 0, 0.44, 0, g, 10);
  if (lit) {
    const e = mesh(new THREE.CircleGeometry(0.22, 10), new THREE.MeshBasicMaterial({ color: 0xff7a2a }), 0, 0.07, 0, g);
    e.rotation.x = -Math.PI / 2;
    e.userData.noAudit = true;   /* the glow of embers */
    const f = hearthFire({ s: 0.55, bed: false }); f.position.y = 0.05; g.add(f);   /* flames under the pot (engine/flame.js) */
  }
  return g;
}
/* a stack of cut Guinea grass on a low frame of poles: fodder for a dry month */
export function grassStack(s = 1) {
  const g = grp();
  for (const [x, z] of [[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]]) cyl(0.05, 0.05, 0.3, W.WM.woodDark, x * s, 0.15, z * s, g, 5);
  box(1.5 * s, 0.06, 1.1 * s, W.WM.wood, 0, 0.32, 0, g);
  const hay = mesh(new THREE.SphereGeometry(1, 9, 6, 0, 7, 0, Math.PI / 2), M.thatch(), 0, 0.34, 0, g);
  hay.scale.set(0.95 * s, 1.5 * s, 0.75 * s);
  return g;
}
/* a bundle of cut grass, tied: what a boy carries to the cattle */
export function fodder() {
  const g = grp(),
    b = cyl(0.17, 0.2, 0.62, M.thatch(), 0, 0.2, 0, g, 8);
  b.rotation.z = Math.PI / 2;
  const tie = cyl(0.19, 0.19, 0.04, solid(0x6b4a30, 1), 0, 0.2, 0, g, 8);
  tie.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) mesh(new THREE.ConeGeometry(0.2, 0.22, 7), solid(0xb7a25e, 1), s * 0.4, 0.2, 0, g).rotation.z = (s * Math.PI) / 2;
  return g;
}
/* a feeding rack: two rails on posts with a board trough under */
export function feedRack(len = 2.6) {
  const g = grp();
  for (const x of [-len / 2, len / 2]) for (const z of [-0.3, 0.3]) cyl(0.05, 0.05, 0.9, W.WM.woodDark, x, 0.45, z, g, 5);
  box(len, 0.06, 0.7, W.WM.wood, 0, 0.42, 0, g);
  for (const z of [-0.34, 0.34]) box(len, 0.22, 0.04, W.WM.wood, 0, 0.55, z, g);
  return g;
}
/* a water cask on its side in a cradle, or standing empty */
export function cask(up = true) {
  const g = grp(),
    st = solid(0x7a5a3c, 0.9),
    b = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.56, 12), st, 0, 0.28, 0, g);
  const pos = b.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 0.28,
      k = Math.abs(y) < 0.5 ? 1.16 : 1;
    pos.setX(i, pos.getX(i) * k);
    pos.setZ(i, pos.getZ(i) * k);
  }
  for (const y of [0.08, 0.48]) cyl(0.215, 0.215, 0.03, W.WM.iron, 0, y, 0, g, 12);
  if (!up) g.rotation.z = Math.PI / 2;
  return g;
}
/* Dr Hutton's house, seen across the pasture: a planter's house of the time, stone below and timber above, shingled, with a front stair.
   A general picture of a pen house (no drawing of Hutton Bonvil was found). The front faces +z. */
export function penHouse() {
  const g = grp(),
    w = 14,
    d = 8;
  W.stoneBox(w, 1.6, d, W.LIME_DARK, 0, 0.8, 0, g);
  for (const x of [-4.5, -1.5, 1.5, 4.5]) {
    box(1.2, 1.0, 0.08, W.WM.dark, x, 0.75, d / 2 + 0.01, g);
    mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 10, 1, false, 0, Math.PI), W.WM.dark, x, 1.25, d / 2 + 0.01, g).rotation.set(Math.PI / 2, Math.PI / 2, 0);
  }
  box(w, 3.0, d, std(T.plank([206, 196, 168], 9, [4, 1], true), 0.95), 0, 3.1, 0, g);
  box(w + 0.3, 0.14, d + 0.3, M.white, 0, 1.65, 0, g);
  for (let i = 0; i < 6; i++) {
    const x = -5.6 + i * 2.24 + (i > 2 ? 0 : 0);
    if (i === 2 || i === 3) continue;
    box(0.9, 1.5, 0.06, W.WM.dark, x, 3.2, d / 2 + 0.01, g);
    box(1.06, 0.08, 0.1, M.white, x, 4.0, d / 2 + 0.03, g);
    for (const s of [-1, 1]) box(0.44, 1.5, 0.05, M.green, x + s * 0.7, 3.2, d / 2 + 0.04, g);
  }
  for (const s of [-1, 1])
    for (const z of [-2, 2]) {
      box(0.06, 1.5, 0.9, W.WM.dark, (s * w) / 2 + s * 0.01, 3.2, z, g);
      for (const k of [-1, 1]) box(0.05, 1.5, 0.44, M.green, (s * w) / 2 + s * 0.04, 3.2, z + k * 0.7, g);
    }
  /* the front door at the head of a double stair, under a small shingled porch */
  const dr = makeDoor({ w: 1.2, h: 2.2, kind: "six", leaves: 2, color: 0x3d4a3c, frame: 0xe2d9c2, handle: "knob" });
  dr.position.set(0, 1.72, d / 2 + 0.01);
  g.add(dr);
  box(3.4, 0.14, 1.8, W.WM.wood, 0, 1.65, d / 2 + 0.9, g);
  for (const s of [-1, 1]) {
    for (let i = 0; i < 6; i++) box(1.1, 0.27, 0.36, W.rubbleMat(W.LIME, 1, 1), s * (2.2 + i * 0.34), 1.44 - i * 0.27, d / 2 + 0.9, g);
    cyl(0.07, 0.07, 2.4, M.white, s * 1.55, 2.9, d / 2 + 1.7, g, 8);
    box(0.06, 0.06, 1.7, M.white, s * 1.62, 2.6, d / 2 + 0.9, g);
  }
  box(3.4, 0.06, 0.06, M.white, 0, 2.6, d / 2 + 1.74, g);
  const pr = mesh(new THREE.BoxGeometry(3.8, 0.12, 2.1), M.shingle(), 0, 4.2, d / 2 + 0.9, g);
  pr.rotation.x = 0.16;
  const rf = roof(w, d, 2.6, 0.5);
  rf.position.y = 4.6;
  g.add(rf);
  /* the kitchen, apart from the house as kitchens were, with its chimney */
  const k = grp(g, w / 2 + 5, 0, -1);
  W.stoneBox(4.4, 2.4, 3.6, W.LIME_DARK, 0, 1.2, 0, k);
  const kr = roof(4.4, 3.6, 1.4, 0.3);
  kr.position.y = 2.4;
  k.add(kr);
  W.stoneBox(0.9, 4.4, 0.9, W.LIME_DARK, 1.6, 2.2, -1.2, k);
  box(0.8, 1.7, 0.06, W.WM.dark, -0.6, 0.85, 1.81, k);
  return g;
}
/* a hipped, shingled roof with real shingle courses (uv along each slope) */
export function roof(w, d, rise = 1.9, over = 0.35) {
  const g = grp(),
    X = w / 2 + over,
    Z = d / 2 + over,
    ridge = Math.max(0.3, X - Z),
    A = [-X, 0, -Z],
    B = [X, 0, -Z],
    C = [X, 0, Z],
    D = [-X, 0, Z],
    E = [-ridge, rise, 0],
    F = [ridge, rise, 0],
    P = [],
    U = [];
  const tri = (a, b, c, ua, ub, uc) => {
    P.push(...a, ...b, ...c);
    U.push(...ua, ...ub, ...uc);
  };
  const k = 0.5;
  /* front and back slopes (trapezia), the two hip ends (triangles) */
  tri(D, C, F, [-X * k, 0], [X * k, 0], [ridge * k, 1.4]);
  tri(D, F, E, [-X * k, 0], [ridge * k, 1.4], [-ridge * k, 1.4]);
  tri(B, A, E, [-X * k, 0], [X * k, 0], [ridge * k, 1.4]);
  tri(B, E, F, [-X * k, 0], [ridge * k, 1.4], [-ridge * k, 1.4]);
  tri(A, D, E, [-Z * k, 0], [Z * k, 0], [0, 1.4]);
  tri(C, B, F, [-Z * k, 0], [Z * k, 0], [0, 1.4]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, M.shingle()));
  box(2 * X, 0.1, 2 * Z, W.WM.woodDark, 0, -0.05, 0, g);
  return g;
}
/* a silk cotton tree: a great grey trunk on buttress roots, wide limbs, a high crown. The biggest thing between the road and the house. */
export function cottonTree(h = 13, seed = 3) {
  const g = grp(),
    r = rng(seed),
    bark = 0x8f8778;
  const trunk = new THREE.Mesh(
    loftSkin(
      [
        [0, -0.1, 0, 1.25, 1.25, 0x7c7466],
        [0, 0.9, 0, 0.95, 0.95, bark],
        [0, 2.4, 0, 0.78, 0.78, bark],
        [0.05, h * 0.42, 0, 0.7, 0.7, bark],
        [0.12, h * 0.6, 0.05, 0.55, 0.55, 0x9a9282],
      ],
      12,
      [1, 0, 0],
    ),
    HIDE,
  );
  g.add(trunk);
  const fin = new THREE.Shape();
  fin.moveTo(0, 0);
  fin.lineTo(2.1, 0);
  fin.quadraticCurveTo(0.7, 0.5, 0.25, 2.6);
  fin.lineTo(0, 2.6);
  const fg = new THREE.ExtrudeGeometry(fin, { depth: 0.16, bevelEnabled: false });
  fg.translate(0.55, 0, -0.08);
  for (let i = 0; i < 6; i++) {
    const f = mesh(fg, solid(i % 2 ? 0x857d6d : 0x8f8778, 1), 0, 0, 0, g);
    f.rotation.y = (i / 6) * Math.PI * 2 + 0.3;
    f.scale.set(0.8 + r() * 0.3, 0.8 + r() * 0.35, 1);
  }
  const leaves = [0x3f5a30, 0x4a6a36, 0x36502c, 0x567a3c];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + r(),
      L = h * (0.32 + r() * 0.12),
      limb = cyl(0.12, 0.26, L, solid(bark, 1), Math.cos(a) * L * 0.36, h * 0.58 + L * 0.3, Math.sin(a) * L * 0.36, g, 6);
    limb.rotation.set(Math.sin(a) * 0.95, 0, -Math.cos(a) * 0.95);
    for (let k = 0; k < 2; k++) {
      const s = h * (0.16 + r() * 0.07),
        b = mesh(new THREE.IcosahedronGeometry(s, 1), flat(leaves[(r() * 4) | 0]), Math.cos(a) * L * (0.62 + k * 0.2) + (r() - 0.5), h * 0.58 + L * 0.62 + r() * 1.2, Math.sin(a) * L * (0.62 + k * 0.2) + (r() - 0.5), g);
      b.scale.y = 0.55;
    }
  }
  mesh(new THREE.IcosahedronGeometry(h * 0.2, 1), flat(leaves[1]), 0.2, h * 0.92, 0, g).scale.y = 0.6;
  return g;
}
/* a stack of cut logwood, cord high */
export function woodpile(len = 2.4, h = 1.25) {
  const g = grp(),
    r = rng(len * 10);
  for (let row = 0; row < Math.round(h / 0.2); row++)
    for (let i = 0; i < 4; i++) {
      const l = cyl(0.09 + r() * 0.03, 0.1, len * (0.9 + r() * 0.1), solid([0x6a4e36, 0x7a5a3c, 0x5a4230][(r() * 3) | 0], 1), 0, 0.1 + row * 0.2, -0.33 + i * 0.22 + (row % 2) * 0.08, g, 6);
      l.rotation.z = Math.PI / 2;
    }
  for (const x of [-len / 2 - 0.08, len / 2 + 0.08]) for (const z of [-0.5, 0.5]) cyl(0.05, 0.05, h + 0.25, W.WM.woodDark, x, (h + 0.25) / 2, z, g, 5);
  return g;
}
/* a karst outcrop big enough to hide behind: weathered limestone, taller than a boy */
export function outcrop(s = 2.4, h = 2.0, seed = 1) {
  const g = grp(),
    r = rng(seed),
    cols = [0xa8a294, 0x9a9486, 0xb5b0a2, 0x8a8478];
  for (let i = 0; i < 5; i++) {
    const k = s * (0.34 + r() * 0.2),
      o = mesh(new THREE.DodecahedronGeometry(k, 0), flat(cols[(r() * 4) | 0]), (r() - 0.5) * s * 0.75, (h * (0.3 + r() * 0.2)) / 1, (r() - 0.5) * s * 0.4, g);
    o.scale.set(1.1, (h / k) * (0.5 + r() * 0.16), 0.8);
    o.rotation.y = r() * 6;
  }
  return g;
}

/* ---------- Edinburgh Castle ---------- */
/* a square loophole as the ruin has: a small dark opening in a plastered surround, on a wall facing +z */
function loophole(parent, x, y, z, ry = 0) {
  const g = grp(parent, x, y, z);
  g.rotation.y = ry;
  box(0.56, 0.56, 0.05, M.plaster, 0, 0, 0.0, g);
  box(0.26, 0.26, 0.07, W.WM.dark, 0, 0, 0.0, g);
  return g;
}
/* a round tower with two rows of square loopholes and a shingled cone (the cone is a stand-in: the ruin has no roof) */
export function roundTower(r = 2.05, h = 7.8, { slits = 7, rows = [1.5, 4.5], seed = 1, chimney = false } = {}) {
  const g = grp();
  const body = mesh(new THREE.CylinderGeometry(r, r * 1.05, h, 24, 1, false), W.rubbleMat(W.LIME, (2 * Math.PI * r) / 1.5, h / 1.5), 0, h / 2, 0, g);
  body.name = "tower";
  mesh(new THREE.CylinderGeometry(r * 1.09, r * 1.12, 0.5, 24), W.rubbleMat(W.LIME_DARK, 8, 1), 0, 0.25, 0, g);
  for (const y of rows)
    for (let i = 0; i < slits; i++) {
      const a = (i / slits) * Math.PI * 2 + seed;
      loophole(g, Math.sin(a) * (r + 0.01 + (y < 2 ? 0.03 : 0)), y, Math.cos(a) * (r + 0.01 + (y < 2 ? 0.03 : 0)), a);
    }
  mesh(new THREE.CylinderGeometry(r + 0.14, r + 0.14, 0.18, 24), W.rubbleMat(W.LIME_DARK, 6, 1), 0, h + 0.09, 0, g);
  const cone = mesh(new THREE.ConeGeometry(r + 0.34, 1.9, 24), M.shingle(), 0, h + 0.18 + 0.95, 0, g);
  cone.material = keep("m-cone", () => std(shingleTex([10, 3]), 1));
  if (chimney) {
    W.stoneBox(0.7, h + 2.6, 0.7, W.LIME_DARK, -r * 0.62, (h + 2.6) / 2, -r * 0.62, g);
    box(0.84, 0.14, 0.84, W.rubbleMat(W.LIME_DARK, 1, 1), -r * 0.62, h + 2.6, -r * 0.62, g);
  }
  return g;
}
/* Edinburgh Castle, from Cundall's description of the ruin (Historic Jamaica, 1915, p. 301): "a small two-storeyed rectangular building with
   two loopholed towers, circular in plan, at diagonally opposite corners. A doorway was at one side of the front angle, and another at the
   side to the east near the front tower", a fireplace on each storey of the front tower, spiral steps in the back tower.
   The front faces +z and the road; east is +x. So the front tower stands at the front east corner and the back tower at the back west one.
   Stand-ins, said in the game's doc: the roofs (the ruin has none), the chimney, the one shuttered upper window he watches from.
   userData: walls (nobody walks through), shutter (the watched window: swing(k)), watcher (a dark shape with a gun, hidden until shown),
   eastDoor (swing(k) opens it), smoke (where the chimney's smoke starts). */
export function castle({ w = 11, d = 7, h = 6.6, r = 2.05 } = {}) {
  const g = grp(),
    m = W.rubbleMat(W.LIME, w / 1.5, h / 1.5),
    dx = w / 2 - r - 0.85,   /* the front door, beside the front tower */
    wx = -1.7,   /* the watched window */
    dz = d / 2 - r - 0.85;   /* the east door */
  W.wallRun(g, [-w / 2, d / 2, w / 2, d / 2], h, m, [{ at: w / 2 + dx, w: 1.1, h: 2.1 }, { at: w / 2 + wx, w: 0.8, h: 1.0, sill: 4.0 }], 0.65);
  W.stoneBox(w, h, 0.65, W.LIME, 0, h / 2, -d / 2, g);
  W.stoneBox(0.65, h, d, W.LIME, -w / 2, h / 2, 0, g);
  W.wallRun(g, [w / 2, d / 2, w / 2, -d / 2], h, m, [{ at: d / 2 - dz, w: 1.0, h: 2.0 }], 0.65);
  W.stoneBox(w + 0.3, 0.45, d + 0.3, W.LIME_DARK, 0, 0.225, 0, g);
  box(w - 0.7, 0.2, d - 0.7, W.WM.dark, 0, 0.5, 0, g);
  box(w - 0.75, h - 0.3, 0.05, W.WM.dark, 0, h / 2, d / 2 - 0.36, g);
  box(0.05, h - 0.3, d - 0.75, W.WM.dark, w / 2 - 0.36, h / 2, 0, g);
  box(w + 0.5, 0.2, d + 0.5, W.rubbleMat(W.LIME_DARK, 8, 1), 0, h + 0.1, 0, g);
  const rf = roof(w, d, 2.2, 0.45);
  rf.position.y = h + 0.2;
  g.add(rf);
  /* loopholes: two rows on every wall */
  for (const y of [1.5, 4.5]) {
    for (const x of [-4.2, -2.9, 0.4]) if (!(y > 4 && Math.abs(x - wx) < 1.3)) loophole(g, x, y, d / 2 + 0.33, 0);
    for (const x of [-3.6, -0.6, 2.4]) loophole(g, x, y, -d / 2 - 0.33, Math.PI);
    for (const z of [-2.2, -0.4]) loophole(g, w / 2 + 0.33, y, z, Math.PI / 2);
    for (const z of [-1.2, 1.4]) loophole(g, -w / 2 - 0.33, y, z, -Math.PI / 2);
  }
  loophole(g, -4.2, 4.5, d / 2 + 0.33, 0);
  loophole(g, dx, 4.5, d / 2 + 0.33, 0);
  /* the two towers */
  const front = roundTower(r, h + 1.3, { seed: 0.4, chimney: true });
  front.position.set(w / 2, 0, d / 2);
  g.add(front);
  const back = roundTower(r, h + 1.3, { seed: 1.3 });
  back.position.set(-w / 2, 0, -d / 2);
  g.add(back);
  /* the front door: heavy boards and an iron ring, plastered jambs, a timber lintel, two stone steps */
  const door = makeDoor({ w: 1.1, h: 2.1, kind: "plank", color: 0x3b2a1e, frame: 0x5a5347, handle: "ring", recess: 0.3, step: 0.14 });
  door.position.set(dx, 0, d / 2 + 0.33);
  g.add(door);
  for (const s of [-1, 1]) box(0.16, 2.2, 0.06, M.plaster, dx + s * 0.66, 1.1, d / 2 + 0.34, g);
  box(1.6, 0.2, 0.1, W.WM.woodDark, dx, 2.22, d / 2 + 0.36, g);
  W.stoneBox(1.9, 0.14, 0.7, W.LIME_DARK, dx, 0.07, d / 2 + 0.75, g);
  /* the east door: narrower, the way out to the yard. It can open (the camera scene). */
  const east = grp(g, w / 2 + 0.3, 0, dz);
  box(0.06, 2.0, 1.0, W.WM.dark, -0.2, 1.0, 0, east);
  const hinge = grp(east, 0.04, 0, -0.5);
  box(0.06, 1.96, 0.98, W.WM.woodDark, 0, 1.0, 0.5, hinge);
  for (const y of [0.45, 1.55]) box(0.075, 0.08, 0.98, W.WM.iron, 0.005, y, 0.5, hinge);
  dynamic(hinge);
  for (const s of [-1, 1]) box(0.06, 2.1, 0.16, M.plaster, 0.04, 1.05, s * 0.6, east);
  box(0.1, 0.2, 1.5, W.WM.woodDark, 0.06, 2.1, 0, east);
  W.stoneBox(0.7, 0.14, 1.6, W.LIME_DARK, w / 2 + 0.7, 0.07, dz, g);
  east.userData.swing = (k) => (hinge.rotation.y = -k * 1.2);
  /* the watched window: the one upper window with shutters */
  const sw = W.shutterWindow(0.8, 1.0, 0);
  sw.position.set(wx, 4.5, d / 2 + 0.34);
  dynamic(sw);
  g.add(sw);
  const watcher = grp(g, wx, 4.5, d / 2 + 0.1);
  box(0.36, 0.5, 0.1, W.WM.dark, 0, -0.2, 0, watcher);
  mesh(new THREE.SphereGeometry(0.13, 10, 8), W.WM.dark, 0, 0.18, 0, watcher);
  const barrel = cyl(0.014, 0.016, 0.9, W.WM.iron, 0.12, -0.05, 0.45, watcher, 6);
  barrel.rotation.x = Math.PI / 2 - 0.12;
  watcher.visible = false;
  dynamic(watcher);
  g.userData = {
    walls: [[-w / 2 - 0.35, -d / 2 - 0.35, w / 2 + 0.35, d / 2 + 0.35], [w / 2 - r, d / 2 - r, w / 2 + r, d / 2 + r], [-w / 2 - r, -d / 2 - r, -w / 2 + r, -d / 2 + r]],
    shutter: sw,
    watcher,
    door,
    doorX: dx,
    windowX: wx,
    eastDoor: east,
    eastZ: dz,
    smoke: [w / 2 - r * 0.62, h + 1.3 + 2.7, d / 2 - r * 0.62],
  };
  return g;
}
/* a far, small copy of the castle for another place's horizon: plain blocks, no detail */
export function farCastle(s = 1) {
  const g = grp(),
    m = solid(0xb0a894, 1);
  box(11 * s, 6.6 * s, 7 * s, m, 0, 3.3 * s, 0, g);
  for (const [x, z] of [[5.5, 3.5], [-5.5, -3.5]]) {
    cyl(2.05 * s, 2.1 * s, 7.9 * s, m, x * s, 3.95 * s, z * s, g, 12);
    mesh(new THREE.ConeGeometry(2.4 * s, 1.9 * s, 12), solid(0x5d5347, 1), x * s, 8.85 * s, z * s, g);
  }
  const rf = W.hipRoof(11 * s, 7 * s, 2.2 * s, 0.45 * s);
  rf.position.y = 6.6 * s;
  g.add(rf);
  return g;
}
/* smoke from a chimney or a cook fire: a few soft puffs that rise and thin. tick(t) moves them; nothing is made per frame. */
export function smoke(n = 6, { rise = 3.4, spread = 0.7, size = 1.2, tint = 0xb8b0a8, opacity = 0.34 } = {}) {
  const g = grp(),
    puffs = [];
  for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.puff(), transparent: true, depthWrite: false, color: tint, opacity: 0 }));
    g.add(s);
    puffs.push(s);
  }
  dynamic(noAudit(g));   /* smoke puffs, see-through */
  g.userData.tick = (t) => {
    for (let i = 0; i < n; i++) {
      const k = (t * 0.12 + i / n) % 1,
        s = puffs[i];
      s.position.set(Math.sin(i * 2.3 + k * 2) * spread * k + k * spread * 1.4, k * rise, Math.cos(i * 1.7) * spread * k * 0.6);
      s.scale.setScalar(size * (0.5 + k * 1.3));
      s.material.opacity = opacity * Math.sin(k * Math.PI);
    }
  };
  g.userData.tick(0);
  return g;
}
/* a flock of small birds that bursts up out of a tree (the camera scene, after the shot). burst(k): 0 hidden, 0..1 rising and scattering. */
export function birds(n = 16, seed = 4) {
  const g = grp(),
    r = rng(seed),
    geo = new THREE.BufferGeometry(),
    list = [];
  geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.22, 0.06, 0, 0, 0, 0.05, 0, 0, -0.05, 0.22, 0.06, 0, 0, 0, -0.05, 0, 0, 0.05], 3));
  geo.computeVertexNormals();
  const m = new THREE.MeshBasicMaterial({ color: 0x18181a, side: THREE.DoubleSide });
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(geo, m);
    b.userData.d = [r() * 6.28, 0.5 + r() * 0.8, 3 + r() * 5, r() * 6.28];
    g.add(b);
    list.push(b);
  }
  dynamic(noAudit(g));   /* birds in flight: in the air on purpose */
  g.visible = false;
  g.userData.burst = (k) => {
    g.visible = k > 0 && k < 1;
    if (!g.visible) return;
    for (const b of list) {
      const [a, up, out, ph] = b.userData.d,
        e = 1 - (1 - k) * (1 - k);
      b.position.set(Math.cos(a + k) * out * e * 2.4, up * 9 * e + Math.sin(k * 20 + ph) * 0.2, Math.sin(a + k) * out * e * 2.4);
      b.rotation.y = -a - k;
      b.scale.set(1, 1 + Math.sin(k * 60 + ph) * 2.5, 1);
    }
  };
  return g;
}
/* the quarters of the people he enslaved, west of the house (Cundall: "the adjacent ruins to the west are said to mark the site of the slave
   quarters"). A row of small thatched houses with a yard and a cooking place: their form is a general picture of such houses in 1772. */
export function quarters(lit = false) {
  const g = grp();
  for (const [x, z, ry, s] of [[0, 0, 0.1, 1], [5.4, -0.8, -0.12, 2], [10.6, 0.4, 0.2, 3], [3, -7, 0.05, 4], [8.6, -7.6, -0.2, 5]]) {
    const hut = thatchHut(3.8, 3, { seed: s });
    hut.position.set(x, 0, z);
    hut.rotation.y = ry;
    g.add(hut);
  }
  const f = cookFire(lit);
  f.position.set(4.6, 0, 3.4);
  g.add(f);
  const b = W.bench(1.6);
  b.position.set(6.6, 0, 3.8);
  b.rotation.y = -0.5;
  g.add(b);
  for (const [x, z] of [[1.6, 3], [9, 3.4]]) {
    const p = postRail(3.2, 0.9, 2);
    p.position.set(x, 0, z + 2.4);
    g.add(p);
  }
  return g;
}

/* ---------- the hall ---------- */
/* a hearth across a corner, in the wall of the front tower (Cundall: "evidences of there having been a fireplace on each story of the front
   tower"). The opening faces the room along the diagonal. glow: embers. */
export function cornerHearth(h = 3) {
  const g = grp();
  W.stoneBox(2.5, h, 0.7, W.LIME, 0, h / 2, 0, g);
  box(1.3, 1.15, 0.5, W.WM.dark, 0, 0.6, 0.14, g);
  const arch = mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.5, 12, 1, false, 0, Math.PI), W.WM.dark, 0, 1.17, 0.14, g);
  arch.rotation.set(Math.PI / 2, Math.PI / 2, 0);
  box(2.0, 0.12, 0.3, W.WM.woodDark, 0, 2.0, 0.44, g);
  W.stoneBox(1.9, 0.1, 0.7, W.LIME_DARK, 0, 0.05, 0.62, g);
  for (const s of [-1, 1]) {
    box(0.05, 0.3, 0.45, W.WM.iron, s * 0.3, 0.2, 0.3, g);
    const l = cyl(0.05, 0.06, 0.8, solid(0x2a1c14, 1), 0, 0.3 + (s + 1) * 0.04, 0.3, g, 6);
    l.rotation.set(0, s * 0.3, Math.PI / 2);
  }
  const ember = box(0.7, 0.05, 0.3, new THREE.MeshBasicMaterial({ color: 0xff6a22 }), 0, 0.24, 0.32, g);
  ember.userData.noAudit = true;   /* the glow of embers */
  { const f = hearthFire({ s: 0.48, bed: false }); f.position.set(0, 0.25, 0.32); g.add(f); }   /* the low fire the searchers lit (engine/flame.js) */
  const pot = mesh(new THREE.SphereGeometry(0.17, 10, 7, 0, 7, 0, 2.1), W.WM.iron, 0.1, 0.72, 0.3, g);
  pot.rotation.x = Math.PI;
  cyl(0.012, 0.012, 0.42, W.WM.iron, 0.1, 1.0, 0.3, g, 5);
  box(0.9, 0.04, 0.04, W.WM.iron, 0, 1.2, 0.3, g);
  /* on the mantel: a pewter plate, a jug */
  cyl(0.13, 0.1, 0.02, solid(0x9a9a94, 0.4, 0.6), -0.6, 2.07, 0.44, g, 12);
  cyl(0.07, 0.09, 0.2, solid(0x7a5a3c, 0.7), 0.55, 2.16, 0.44, g, 10);
  return g;
}
/* the foot of the spiral steps in the back tower, seen through an arched doorway across the corner (Cundall: "a series of spiral steps in
   the back tower") */
export function spiralFoot(h = 3) {
  const g = grp();
  W.stoneBox(0.7, h, 0.7, W.LIME, -0.95, h / 2, 0, g);
  W.stoneBox(0.7, h, 0.7, W.LIME, 0.95, h / 2, 0, g);
  W.stoneBox(2.6, h - 2.3, 0.7, W.LIME, 0, 2.3 + (h - 2.3) / 2, 0, g);
  box(1.3, 2.3, 0.1, W.WM.dark, 0, 1.15, -0.5, g);
  box(0.06, 2.3, 0.6, W.WM.dark, -0.62, 1.15, -0.25, g);
  box(0.06, 2.3, 0.6, W.WM.dark, 0.62, 1.15, -0.25, g);
  for (let i = 0; i < 5; i++) {
    const s = W.stoneBox(1.0 - i * 0.12, 0.2, 0.34, W.LIME_DARK, -0.1 + i * 0.1, 0.1 + i * 0.2, 0.1 - i * 0.12, g);
    s.rotation.y = -i * 0.22;
  }
  return g;
}
/* a plain cot with a thin mattress and a blanket thrown back: where a sick man lay */
export function cot() {
  const g = grp();
  for (const x of [-0.9, 0.9]) for (const z of [-0.36, 0.36]) box(0.06, 0.42, 0.06, W.WM.woodDark, x, 0.21, z, g);
  box(1.9, 0.07, 0.8, W.WM.wood, 0, 0.4, 0, g);
  box(1.84, 0.1, 0.74, solid(0xbcb29a, 1), 0, 0.48, 0, g);
  /* a soft bolster at the head, and the blanket thrown back in rolls toward the foot */
  const pillow = mesh(new THREE.CapsuleGeometry(0.075, 0.38, 4, 10), solid(0xd6ceb8, 1), -0.66, 0.585, 0, g);
  pillow.rotation.x = Math.PI / 2;
  pillow.scale.set(1.2, 1, 0.7);
  const wool = solid(0x6a5a4a, 1);
  box(0.62, 0.03, 0.76, wool, 0.58, 0.545, 0.02, g);
  for (const [x, r] of [[0.22, 0.06], [0.33, 0.05]]) {
    const fold = mesh(new THREE.CapsuleGeometry(r, 0.64, 4, 10), wool, x, 0.53 + r * 0.8, 0.02, g);
    fold.rotation.x = Math.PI / 2;
    fold.scale.set(1, 0.8, 1);
  }
  return g;
}
/* a wall shelf with bottles, a pewter mug and a small keg */
export function shelf(len = 1.6) {
  const g = grp();
  box(len, 0.04, 0.26, W.WM.woodDark, 0, 0, 0.13, g);
  for (const x of [-len / 2 + 0.1, len / 2 - 0.1]) box(0.04, 0.22, 0.22, W.WM.woodDark, x, -0.12, 0.11, g);
  const r = rng(len * 7);
  for (let i = 0; i < 5; i++) {
    const x = -len / 2 + 0.25 + i * ((len - 0.5) / 4);
    if (i % 2) cyl(0.04, 0.045, 0.2, solid([0x2f4030, 0x3a2a1a][i % 3 ? 0 : 1], 0.3), x, 0.12, 0.13, g, 8);
    else cyl(0.045, 0.04, 0.1 + r() * 0.04, solid(0x9a9a94, 0.4, 0.6), x, 0.07, 0.13, g, 8);
  }
  return g;
}
/* papers, an inkwell and a quill: the searchers' list */
export function writing() {
  const g = grp();
  /* two written sheets (old paper, lines of ink too small to read: engine/page.js), an open inkpot with ink in it and the quill standing in it */
  for (const [w, d, x, y, z, ry, seed] of [[0.32, 0.22, 0, 0.004, 0, 0.2, 3], [0.3, 0.2, 0.12, 0.01, 0.06, -0.3, 4]]) {
    const sh = box(w, 0.008, d, solid(0xe7dcc2, 1), x, y, z, g);
    sh.rotation.y = ry;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.98, d * 0.98), new THREE.MeshStandardMaterial({ map: writtenPage("", { w, d, seed }), roughness: 0.95 }));
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.0045;
    sh.add(face);
  }
  const pot = vessel([[0.001, 0], [0.035, 0], [0.035, 0.008], [0.03, 0.04], [0.02, 0.05]], { mat: solid(0x1a1a22, 0.3), fill: { y: 0.04, mat: solid(0x050508, 0.15) }, wall: 0.004 });
  pot.position.set(-0.26, 0, -0.05);
  g.add(pot);
  const q = cyl(0.004, 0.012, 0.26, solid(0xe8e4d8, 1), -0.24, 0.14, -0.05, g, 4);
  q.rotation.z = -0.45;
  return g;
}
/* clothes folded in an open trunk */
export function clothesTrunk() {
  const g = W.chest(1.1, 0.55, 0.55);
  g.userData.open(1);
  const cols = [0x5a3a2a, 0x2f3a4a, 0x8a8068, 0x3a2a2a, 0x6a5a3a];
  cols.forEach((c, i) => box(0.44, 0.07, 0.4, solid(c, 1), -0.26 + (i % 2) * 0.5, 0.34 + Math.floor(i / 2) * 0.07, 0, g));
  return g;
}

/* ---------- the sinkhole ---------- */
/* the ring of inclined rock about ten metres high that stands round the hole's mouth (the cavers' account), with a way in on one side.
   R: the ring's inner radius at the foot; gap: [from, to] angles left open. One mesh; trees and scrub along the top are added by the place. */
export function cliffRing(R = 15, H = 10, { seed = 3, gap = [0.9, 1.6], seg = 44 } = {}) {
  const r = rng(seed),
    P = [],
    U = [],
    C = [],
    rows = 5,
    ring = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2,
      inGap = a > gap[0] && a < gap[1],
      edge = Math.min(Math.abs(a - gap[0]), Math.abs(a - gap[1])),
      hh = inGap ? 0 : H * (0.72 + r() * 0.4) * Math.min(1, 0.25 + edge * 1.6),
      col = [];
    for (let k = 0; k <= rows; k++) {
      const t = k / rows,
        lean = R + t * 3.6 + (k ? (r() - 0.5) * 1.5 : (r() - 0.5) * 0.5) + (k === rows ? 3.4 : 0),
        y = k === rows ? hh * 0.94 : hh * t;
      col.push([Math.cos(a) * lean, y, Math.sin(a) * lean, 0.74 + r() * 0.3]);
    }
    ring.push(col);
  }
  ring[seg] = ring[0];
  for (let i = 0; i < seg; i++)
    for (let k = 0; k < rows; k++) {
      const a = ring[i][k],
        b = ring[i + 1][k],
        c = ring[i + 1][k + 1],
        d = ring[i][k + 1],
        top = k === rows - 1;
      for (const [p, u] of [[a, [i / 3, k / rows]], [d, [i / 3, (k + 1) / rows]], [b, [(i + 1) / 3, k / rows]], [b, [(i + 1) / 3, k / rows]], [d, [i / 3, (k + 1) / rows]], [c, [(i + 1) / 3, (k + 1) / rows]]]) {
        P.push(p[0], p[1], p[2]);
        U.push(u[0], u[1]);
        /* warm grey limestone, with ferns and moss gathering toward the wooded top and in streaks down the face */
        const v = p[3],
          up = (k + (p === c || p === d ? 1 : 0)) / rows,
          moss = Math.min(0.9, Math.max(0, (up - 0.3) / 0.7) * 0.75 + Math.max(0, vnoise(i * 0.6, up * 2.5, 4) - 0.35) * 1.8);
        if (top) C.push(0.36 * v, 0.46 * v, 0.28 * v);
        else C.push((0.84 + (0.42 - 0.84) * moss) * v, (0.79 + (0.5 - 0.79) * moss) * v, (0.68 + (0.3 - 0.68) * moss) * v);
      }
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(C, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, keep("m-crag", () => new THREE.MeshStandardMaterial({ map: cragTex(), vertexColors: true, roughness: 1, flatShading: true, side: THREE.DoubleSide })));
  m.name = "terrain";
  const g = grp();
  g.add(m);
  g.userData.top = (a) => {
    const col = ring[Math.round((((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / ((Math.PI * 2) / seg)) % seg][rows];
    return col;
  };
  /* a point on the rock face at angle a and height t (0 at the foot, 1 at the rim): for ferns and moss on its ledges */
  g.userData.face = (a, t) => {
    const col = ring[Math.round((((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / ((Math.PI * 2) / seg)) % seg],
      k = Math.min(rows - 1 - 1e-6, Math.max(0, t * (rows - 1))),
      i = Math.floor(k),
      u = k - i;
    return [0, 1, 2].map((j) => col[i][j] + (col[i + 1][j] - col[i][j]) * u);
  };
  return g;
}
/* a fern: a crown of arching fronds, each a strip bent down at its tip. size: the frond length in metres */
const FROND = () =>
  keep("g-frond", () => {
    const geo = new THREE.PlaneGeometry(0.11, 1, 1, 4),
      p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i) + 0.5,
        w = Math.sin(Math.max(0.05, y) * Math.PI) * (1 - y * 0.35);
      p.setXYZ(i, p.getX(i) * w * 2, y * 0.8, -y * y * 0.55);
    }
    geo.computeVertexNormals();
    return geo;
  });
const FERN_M = [0x4f7f36, 0x5f8e3e, 0x467232].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, side: THREE.DoubleSide }));
export function fern(size = 0.7, seed = 1) {
  const g = grp(),
    r = rng(seed),
    n = 7 + Math.floor(r() * 5);
  for (let i = 0; i < n; i++) {
    const f = new THREE.Mesh(FROND(), FERN_M[i % 3]);
    f.scale.setScalar(size * (0.7 + r() * 0.45));
    f.rotation.set(0, (i / n) * Math.PI * 2 + r() * 0.4, 0, "YXZ");
    f.rotateX(-0.35 - r() * 0.4);
    g.add(f);
  }
  return g;
}
/* a cushion of moss on a ledge */
export function moss(w = 0.8, seed = 1) {
  const r = rng(seed),
    m = mesh(new THREE.SphereGeometry(0.5, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), solid([0x4a6a30, 0x56753a, 0x3e5e2a][Math.floor(r() * 3)], 1));
  m.scale.set(w, 0.12 + r() * 0.1, w * (0.6 + r() * 0.5));
  return m;
}
/* the mouth of the hole and the shaft under it. The mouth is about 3 by 5 metres with jagged rock at its lip; the shaft keeps that size for
   some 15 metres and then widens (the cavers' survey). rx, rz: the mouth's half sizes. */
export function shaft(rx = 2.5, rz = 1.5, seed = 2) {
  const g = grp(),
    r = rng(seed),
    P = [],
    seg = 20,
    levels = [[0.05, 1, 0.34], [-1.2, 1.04, 0.2], [-4, 0.98, 0.08], [-9, 1.05, 0.025], [-15, 1.1, 0.006], [-24, 1.9, 0], [-40, 3.2, 0]],
    rings = levels.map(([y, k, v]) => {
      const out = [];
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2,
          j = y > 0 ? 1 : 0.9 + r() * 0.2;
        out.push([Math.cos(a) * rx * k * j, y, Math.sin(a) * rz * k * j, v * (0.8 + r() * 0.4)]);
      }
      return out;
    });
  const geo = new THREE.BufferGeometry(),
    BAND = [0x5a554b, 0x2c2a25, 0x121110, 0x060605, 0x000000, 0x000000];   /* each band of the shaft darker than the one above */
  for (let l = 0; l < rings.length - 1; l++) {
    geo.addGroup(l * seg * 6, seg * 6, l);
    for (let i = 0; i < seg; i++) {
      const a = rings[l][i],
        b = rings[l][(i + 1) % seg],
        c = rings[l + 1][(i + 1) % seg],
        d = rings[l + 1][i];
      for (const p of [a, b, d, b, c, d]) {
        P.push(p[0], p[1], p[2]);
      }
    }
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, BAND.map((color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: false })));
  m.userData.noBatch = true;
  g.add(m);
  /* the dark at the bottom: the shaft is closed far down, so no daylight shows through it */
  const cap = mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }), 0, -40, 0, g);
  cap.rotation.x = -Math.PI / 2;
  cap.scale.set(rx * 3.3, rz * 3.3, 1);
  cap.userData.noAudit = true;   /* the dark far down the shaft: a backdrop, not a thing */
  cap.userData.noBatch = true;
  /* the lip: jagged outcrops round the mouth, lower on the side you come to */
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + r() * 0.2,
      near = Math.sin(a) > 0.5,
      k = (near ? 0.3 : 0.55) + r() * (near ? 0.25 : 0.7),
      o = mesh(new THREE.DodecahedronGeometry(k, 0), flat([0xa8a294, 0x8f897c, 0x77736a, 0x9a9486][(r() * 4) | 0]), Math.cos(a) * (rx + 0.25 + k * 0.6), k * 0.25, Math.sin(a) * (rz + 0.25 + k * 0.6), g);
    o.scale.set(1.1, near ? 0.6 : 0.9 + r() * 0.8, 1);
    o.rotation.y = r() * 6;
  }
  return g;
}
/* the ground of the hole's valley: one sheet with the mouth cut out of it, so you look down a real shaft */
export function holedGround(size, rx, rz, mat, cx = 0, cz = 0) {
  const sh = new THREE.Shape();
  sh.moveTo(-size / 2, -size / 2);
  sh.lineTo(size / 2, -size / 2);
  sh.lineTo(size / 2, size / 2);
  sh.lineTo(-size / 2, size / 2);
  const hole = new THREE.Path();
  hole.absellipse(cx, -cz, rx, rz, 0, Math.PI * 2, true);
  sh.holes.push(hole);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 20), mat);
  m.rotation.x = -Math.PI / 2;
  m.position.y = -0.025;
  m.name = "terrain";
  m.userData.soft = true;   /* a hill is ground: the trees, scrub and rocks scattered on its slopes stand into it, as they would on a real hillside (engine/audit.js auditOverlap) */
  return m;
}
/* a coil of rope and a stake driven into the ground */
export function ropeStake() {
  const g = grp();
  cyl(0.05, 0.03, 0.7, W.WM.woodDark, 0, 0.3, 0, g, 6).rotation.z = 0.2;
  for (let i = 0; i < 4; i++) mesh(new THREE.TorusGeometry(0.26 - i * 0.02, 0.03, 5, 14), W.WM.rope, 0.6, 0.04 + i * 0.05, 0.2, g).rotation.x = Math.PI / 2;
  return g;
}

/* ---------- Spanish Town, 1773 ---------- */
const brick = (rx, ry, rgb = [156, 84, 62]) => std(brickTex(rgb, [Math.max(1, Math.round(rx)), Math.max(1, Math.round(ry))]), 1);
/* a sash window with a white surround, on a wall facing +z; shut: jalousie shutters closed across it */
function sash(parent, x, y, z, w = 1.1, h = 1.9, shut = false) {
  box(w + 0.24, h + 0.24, 0.06, M.white, x, y, z, parent);
  box(w, h, 0.07, shut ? M.green : W.WM.glass, x, y, z + 0.01, parent);
  if (!shut) {
    box(w, 0.05, 0.08, M.white, x, y, z + 0.012, parent);
    box(0.05, h, 0.08, M.white, x, y, z + 0.012, parent);
  }
  box(w + 0.4, 0.08, 0.16, M.white, x, y - h / 2 - 0.14, z + 0.04, parent);
}
/* the public building on the east side of the square (the House of Assembly, where Long says the court sat upstairs): red brick, an arcade
   of round brick arches below, a long timber gallery above, a hipped shingled roof. Length L along x, the front to +z. userData.doorX: the
   court door under the arcade. */
export function publicBuilding(L = 42) {
  const g = grp(),
    H1 = 4.6,
    H2 = 4.0,
    D = 9,
    bays = 9,
    bw = L / bays,
    bm = brick(L / 3, 3),
    pier = brick(1, 3, [164, 92, 68]);
  box(L, H1 + H2, D, bm, 0, (H1 + H2) / 2, -D / 2 - 2.6, g);   /* the body, set back behind the arcade walk */
  box(L, 0.12, 2.9, std(T.stone([170, 164, 150], [14, 1]), 1), 0, 0.06, -1.35, g).name = "terrain";
  for (let i = 0; i <= bays; i++) {
    const x = -L / 2 + i * bw;
    box(0.9, 3.0, 0.9, pier, x, 1.5, 0, g);
    box(1.06, 0.16, 1.06, M.white, x, 3.0, 0, g);
    box(1.0, 0.3, 1.0, std(T.stone([170, 164, 150], [1, 1]), 1), x, 0.15, 0, g);
    if (i < bays) {
      /* Long: sixteen round arches and one elliptical arch in the centre. Here eight round and the elliptical one over the court door. */
      const mid = i === (bays - 1) / 2,
        R = mid ? bw / 2 - 0.25 : bw / 2 - 0.45,
        Ry = mid ? Math.min(R * 0.62, H1 - 3.05 - 0.25) : R,
        arch = mesh(new THREE.TorusGeometry(R + 0.2, 0.22, 4, 14, Math.PI), pier, x + bw / 2, 3.05, 0, g);
      arch.scale.z = 2;
      arch.scale.y = (Ry + 0.2) / (R + 0.2);
      /* the wall over each arch: a brick spandrel cut to the curve */
      const sp = new THREE.Shape();
      sp.moveTo(-bw / 2, 0);
      sp.lineTo(-R, 0);
      sp.absellipse(0, 0, R, Ry, Math.PI, 0, true);
      sp.lineTo(bw / 2, 0);
      sp.lineTo(bw / 2, H1 - 3.05);
      sp.lineTo(-bw / 2, H1 - 3.05);
      const sg = new THREE.ExtrudeGeometry(sp, { depth: 0.8, bevelEnabled: false, curveSegments: 8 });
      sg.translate(0, 0, -0.4);
      const uv = sg.attributes.uv;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 0.3, uv.getY(k) * 0.3);
      mesh(sg, keep("m-spandrel", () => std(brickTex([156, 84, 62], [1, 1]), 1)), x + bw / 2, 3.05, 0, g);
      /* inside the arcade: the wall of the ground floor with its doors and windows */
      if (i !== 4) sash(g, x + bw / 2, 1.9, -2.58, 1.2, 2.0, i % 3 === 1);
    }
  }
  box(L + 0.6, 0.3, 3.4, M.white, 0, H1 + 0.15, -1.1, g);   /* the gallery floor and its cornice */
  /* the upper gallery: turned posts, a rail with balusters, the wall behind with its doors */
  for (let i = 0; i <= bays * 2; i++) {
    const x = -L / 2 + (i * bw) / 2;
    cyl(0.09, 0.11, H2 - 0.5, M.white, x, H1 + 0.3 + (H2 - 0.5) / 2, 0.3, g, 8);
  }
  box(L, 0.08, 0.1, M.white, 0, H1 + 1.3, 0.3, g);
  box(L, 0.06, 0.08, M.white, 0, H1 + 0.42, 0.3, g);
  for (let x = -L / 2 + 0.25; x < L / 2; x += 0.42) box(0.05, 0.86, 0.05, M.white, x, H1 + 0.86, 0.3, g);
  for (let i = 0; i < bays; i++) sash(g, -L / 2 + (i + 0.5) * bw, H1 + 1.75, -2.58, 1.2, 2.3, i % 2 === 0);
  box(L + 0.8, 0.26, 3.6, M.white, 0, H1 + H2 - 0.1, -1.0, g);
  /* Long: over the centre of the arcade, "a lofty pediment raised upon four Doric columns" */
  const cx = [-1.5, -0.5, 0.5, 1.5].map((k) => k * bw);
  for (const x of cx) {
    cyl(0.26, 0.3, H2 - 0.55, M.white, x, H1 + 0.3 + (H2 - 0.55) / 2, 0.3, g, 12);
    box(0.74, 0.18, 0.74, M.white, x, H1 + 0.39, 0.3, g);
    box(0.7, 0.2, 0.7, M.white, x, H1 + H2 - 0.33, 0.3, g);
  }
  const pw2 = 3 * bw + 1.6;
  box(pw2, 0.5, 1.2, M.white, 0, H1 + H2 + 0.12, 0.3, g);
  const tp = new THREE.Shape();
  tp.moveTo(-pw2 / 2, 0);
  tp.lineTo(pw2 / 2, 0);
  tp.lineTo(0, 2.4);
  const tg = new THREE.ExtrudeGeometry(tp, { depth: 5.6, bevelEnabled: false });
  mesh(tg, M.white, 0, H1 + H2 + 0.37, 0.9 - 5.6, g);
  const rf = roof(L + 0.4, D + 3.4, 2.6, 0.4);
  rf.position.set(0, H1 + H2 + 0.03, -D / 2 - 1.0);
  g.add(rf);
  const dr = makeDoor({ w: 1.6, h: 2.6, kind: "six", leaves: 2, color: 0x2f3b33, frame: 0xe2d9c2, handle: "knob" });
  dr.position.set(0, 0.12, -2.59);
  g.add(dr);
  g.userData.doorX = 0;
  return g;
}
/* King's House on the west side of the square: a long two-storey front of brick with a white portico of columns and a pediment in the
   middle, and a parapet with a balustrade (the building of 1762 that Long describes and Bonnor's plate of 1774 shows). The front faces +z. */
export function kingsHouse(L = 46) {
  const g = grp(),
    H = 9.4,
    D = 10,
    bm = brick(L / 3, 3, [150, 88, 70]);
  box(L, H, D, bm, 0, H / 2, -D / 2, g);
  box(L + 0.3, 0.7, D + 0.3, std(T.stone([196, 190, 174], [16, 1]), 1), 0, 0.35, -D / 2, g);
  box(L + 0.4, 0.22, 0.3, M.white, 0, 4.9, 0.05, g);
  box(L + 0.6, 0.4, D + 0.6, M.white, 0, H + 0.2, -D / 2, g);
  /* the parapet: a balustrade between plain blocks */
  for (let i = 0; i <= 12; i++) box(0.5, 0.9, 0.4, M.white, -L / 2 + 0.25 + (i * (L - 0.5)) / 12, H + 0.85, -0.1, g);
  box(L, 0.1, 0.3, M.white, 0, H + 1.3, -0.1, g);
  for (let x = -L / 2 + 0.6; x < L / 2; x += 0.5) box(0.1, 0.8, 0.1, M.white, x, H + 0.8, -0.1, g);
  for (let i = 0; i < 13; i++) {
    const x = -L / 2 + 2.3 + i * ((L - 4.6) / 12);
    if (Math.abs(x) < 4.6) continue;
    sash(g, x, 2.8, 0.02, 1.2, 2.3);
    sash(g, x, 7.0, 0.02, 1.2, 2.1);
  }
  for (const s of [-1, 1]) for (let k = 0; k < 9; k++) box(0.6, 0.5, 0.12, M.white, s * (L / 2 - 0.3), 1.0 + k * 1.0, 0.03, g).scale.x = k % 2 ? 1 : 0.7;
  /* the portico: a flight of steps, six columns, an entablature and a pediment */
  const P = grp(g, 0, 0, 0),
    pw = 9.4,
    pd = 4.4;
  for (let i = 0; i < 4; i++) box(pw + 1.6 - i * 0.4, 0.2, pd + 1.4 - i * 0.36, std(T.stone([206, 200, 186], [4, 1]), 1), 0, 0.1 + i * 0.2, pd / 2 + 0.1 - i * 0.04, P);
  /* Long: "supported by twelve columns of Portland-stone, of the Ionic order": here two rows of six. The middle opening is the widest, as on
     a Georgian portico, so the great door stands clear between the columns (owner, 23 November 2026: "too many columns blocking the door") */
  for (const z of [pd, pd - 2.1])
    for (const x of [-4.3, -3.0, -1.7, 1.7, 3.0, 4.3]) {
      cyl(0.32, 0.38, 6.6, M.white, x, 0.8 + 3.3, z, P, 14);
      box(0.9, 0.2, 0.9, M.white, x, 0.9, z, P);
      box(0.86, 0.26, 0.86, M.white, x, 7.5, z, P);
      for (const s of [-1, 1]) cyl(0.11, 0.11, 0.86, M.white, x, 7.36, z + s * 0.36, P, 8).rotation.x = Math.PI / 2;   /* the volutes of the Ionic capital */
    }
  box(pw + 0.4, 0.8, pd + 0.6, M.white, 0, 8.0, pd / 2 + 0.1, P);
  const ped = new THREE.Shape();
  ped.moveTo(-pw / 2 - 0.4, 0);
  ped.lineTo(pw / 2 + 0.4, 0);
  ped.lineTo(0, 2.0);
  const pg = new THREE.ExtrudeGeometry(ped, { depth: pd + 0.6, bevelEnabled: false });
  mesh(pg, M.white, 0, 8.4, -0.2, P);
  const dr = makeDoor({ w: 1.8, h: 3.0, kind: "six", leaves: 2, color: 0x2c3a30, frame: 0xe2d9c2, handle: "knob" });
  dr.position.set(0, 0.8, 0.02);
  g.add(dr);
  for (const s of [-1, 1]) sash(g, s * 3.1, 3.0, 0.02, 1.1, 2.2);
  for (const x of [-3.1, 0, 3.1]) sash(g, x, 7.0, 0.02, 1.1, 2.0);
  const rf = roof(L - 2, D - 2, 1.6, 0);
  rf.position.set(0, H + 0.4, -D / 2);
  g.add(rf);
  return g;
}
/* the railed enclosure in the middle of the square: eight sides, a low stone kerb, a rail on posts. What stood inside it in 1773 is not
   known to us, so it holds only grass. R: the distance from the centre to a corner. */
/* the railed green in the middle of the square, after the 1774 plate in Long's history (T. Bonnor, sculp.): one long straight side
   with about ten square white piers, a low kerb and a rail between them, running the length of the gap between King's House and the
   public building. No source found says it was an octagon, so it is a rectangle, W wide and L long (L along z, between the buildings). */
export function railedGreen(W = 9.2, L = 13.6) {
  const g = grp(),
    kerb = std(T.stone([190, 184, 168], [3, 1]), 1),
    rail = solid(0x2c2e30, 0.6, 0.3);
  const gr = mesh(new THREE.PlaneGeometry(W - 0.3, L - 0.3), std(T.grass([4, 6], [112, 128, 76])), 0, 0.03, 0, g);
  gr.rotation.x = -Math.PI / 2;
  gr.name = "terrain";
  const side = (len, x, z, ry) => {
    const seg = grp(g, x, 0, z);
    seg.rotation.y = ry;
    box(len + 0.34, 0.36, 0.34, kerb, 0, 0.18, 0, seg);
    for (const y of [0.62, 1.22]) box(len, 0.045, 0.045, rail, 0, y, 0, seg);
    const bays = Math.max(2, Math.round(len / 1.55));
    for (let k = 0; k < bays; k++) for (let j = 1; j < 6; j++) box(0.03, 0.9, 0.03, rail, -len / 2 + ((k + j / 6) * len) / bays, 0.8, 0, seg);
    /* square white piers, evenly spaced: about ten along each long side, as on the plate */
    for (let k = 0; k <= bays; k++) {
      const px = -len / 2 + (k * len) / bays;
      box(0.42, 1.5, 0.42, M.white, px, 0.75, 0, seg);
      box(0.54, 0.12, 0.54, M.white, px, 1.56, 0, seg);
    }
  };
  side(L, -W / 2, 0, Math.PI / 2);
  side(L, W / 2, 0, Math.PI / 2);
  side(W, 0, -L / 2, 0);
  side(W, 0, L / 2, 0);
  return g;
}
/* a town house of the 1770s: two storeys, plastered or brick, sash windows with jalousies, a shingled hip roof, sometimes a timber piazza
   over the footway. A general picture of Spanish Town's houses. The front faces +z. */
export function townHouse(w = 12, { h = 6.6, d = 8, rgb = [206, 192, 160], piazza = false, seed = 1, brickWall = false } = {}) {
  const g = grp(),
    r = rng(seed),
    n = Math.max(2, Math.floor(w / 2.8)),
    doorAt = (r() * n) | 0;
  box(w, h, d, brickWall ? brick(w / 3, 2, rgb) : std(T.plaster(rgb, [2, 1]), 1), 0, h / 2, -d / 2, g);
  box(w + 0.2, 0.5, d + 0.2, std(T.stone([150, 144, 130], [4, 1]), 1), 0, 0.25, -d / 2, g);
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (i + 0.5) * (w / n);
    if (i === doorAt) {
      const dr = makeDoor({ w: 1.1, h: 2.3, kind: "six", color: [0x3d2c22, 0x2f3b33, 0x4a3a2a][seed % 3], frame: 0xe2d9c2, handle: "knob" });
      dr.position.set(x, 0.3, 0.01);
      g.add(dr);
      box(1.7, 0.3, 0.6, std(T.stone([170, 164, 150], [1, 1]), 1), x, 0.15, 0.3, g);
    } else sash(g, x, 1.9, 0.02, 1.0, 1.7, r() < 0.4);
    sash(g, x, 4.8, 0.02, 1.0, 1.6, r() < 0.5);
  }
  if (piazza) {
    box(w, 0.14, 2.2, W.WM.wood, 0, 3.3, 1.1, g);
    for (let i = 0; i <= n; i++) cyl(0.08, 0.09, 3.2, M.white, -w / 2 + 0.1 + (i * (w - 0.2)) / n, 1.6, 2.1, g, 6);
    for (let i = 0; i <= n; i++) cyl(0.06, 0.07, 2.5, M.white, -w / 2 + 0.1 + (i * (w - 0.2)) / n, 4.6, 2.1, g, 6);
    box(w, 0.06, 0.06, M.white, 0, 4.3, 2.1, g);
    const pr = mesh(new THREE.BoxGeometry(w + 0.4, 0.1, 2.6), M.shingle(), 0, 5.95, 1.1, g);
    pr.rotation.x = 0.14;
  }
  const rf = roof(w, d, 2.0, 0.35);
  rf.position.set(0, h, -d / 2);
  g.add(rf);
  return g;
}
/* a garden wall of brick with a coping, len along x */
export function gardenWall(len, h = 2.1) {
  const g = grp();
  box(len, h, 0.4, brick(len / 3, 1, [164, 110, 86]), 0, h / 2, 0, g);
  box(len + 0.1, 0.12, 0.54, M.white, 0, h + 0.06, 0, g);
  return g;
}
/* a market woman's ground: a mat with heaps of yams, plantains and a basket */
export function groundStall(seed = 1) {
  const g = grp(),
    r = rng(seed);
  box(1.8, 0.02, 1.2, solid(0xb39a62, 1), 0, 0.01, 0, g);
  for (let i = 0; i < 7; i++) mesh(new THREE.IcosahedronGeometry(0.09 + r() * 0.04, 0), flat([0x7a5a3a, 0x8a6a40, 0x6a4a30][(r() * 3) | 0]), -0.5 + r() * 0.5, 0.08, -0.3 + r() * 0.5, g).scale.set(1.6, 0.8, 0.9);
  for (let i = 0; i < 6; i++) {
    const p = cyl(0.035, 0.03, 0.26, flat(0x7a8a3a), 0.4 + r() * 0.3, 0.05, -0.2 + i * 0.07, g, 5);
    p.rotation.z = Math.PI / 2;
    p.rotation.y = r() * 0.4;
  }
  const b = cyl(0.26, 0.2, 0.26, std(T.weave([2, 1]), 1), 0.1, 0.15, 0.36, g, 10);
  for (let i = 0; i < 5; i++) mesh(new THREE.SphereGeometry(0.07, 6, 5), flat([0xd08a2a, 0xc86a22, 0xd8a43a][(r() * 3) | 0]), 0.1 + (r() - 0.5) * 0.26, 0.3, 0.36 + (r() - 0.5) * 0.26, g);
  return g;
}
/* a far crowd, as dark shapes only: people standing with their backs to us, for the dawn scene. No faces, no detail. */
export function farCrowd(n = 26, w = 12, seed = 2) {
  const g = grp(),
    r = rng(seed),
    m = new THREE.MeshBasicMaterial({ color: 0x1c1a1c });
  for (let i = 0; i < n; i++) {
    const x = (r() - 0.5) * w,
      z = (r() - 0.5) * 3,
      h = 1.5 + r() * 0.25;
    mesh(new THREE.CylinderGeometry(0.17, 0.24, h - 0.25, 6), m, x, (h - 0.25) / 2, z, g);
    mesh(new THREE.SphereGeometry(0.12, 6, 5), m, x, h - 0.1, z, g);
    if (r() < 0.5) mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 8), m, x, h + 0.02, z, g);
  }
  dynamic(g);
  return g;
}
/* a low house of one storey: thick plastered walls (the old Spanish houses Long mentions) or brick, small sash windows, a door, a hip roof.
   For the north side of the square (the old court-house, the tavern, the barber's shop) and the guard-house. The front faces +z. */
export function lowHouse(w = 8, { h = 4.2, d = 7, rgb = [222, 212, 188], brickWall = false, door = 0, doors = 1, seed = 1, piazza = false } = {}) {
  const g = grp(),
    r = rng(seed),
    n = Math.max(2, Math.floor(w / 2.4));
  box(w, h, d, brickWall ? brick(w / 3, 2, rgb) : std(T.plaster(rgb, [2, 1]), 1), 0, h / 2, -d / 2, g);
  box(w + 0.2, 0.45, d + 0.2, std(T.stone([150, 144, 130], [4, 1]), 1), 0, 0.22, -d / 2, g);
  box(w + 0.3, 0.22, d + 0.3, M.white, 0, h - 0.11, -d / 2, g);
  const at = (i) => -w / 2 + (i + 0.5) * (w / n),
    doorIs = new Set(Array.from({ length: doors }, (_, k) => Math.min(n - 1, door + k * 2)));
  for (let i = 0; i < n; i++) {
    if (doorIs.has(i)) {
      const dr = makeDoor({ w: 1.15, h: 2.3, kind: "plank", leaves: 2, color: [0x4a3a2a, 0x2f3b33, 0x5a3e2a][seed % 3], frame: 0xe2d9c2 });
      dr.position.set(at(i), 0.3, 0.01);
      g.add(dr);
      box(1.7, 0.3, 0.6, std(T.stone([170, 164, 150], [1, 1]), 1), at(i), 0.15, 0.3, g);
    } else sash(g, at(i), 1.9, 0.02, 0.9, 1.5, r() < 0.4);
  }
  if (piazza) {
    for (let i = 0; i <= n; i++) cyl(0.08, 0.09, h - 0.6, W.WM.wood, -w / 2 + 0.1 + (i * (w - 0.2)) / n, (h - 0.6) / 2, 2.0, g, 6);
    const pr = mesh(new THREE.BoxGeometry(w + 0.4, 0.1, 2.5), M.shingle(), 0, h - 0.45, 1.0, g);
    pr.rotation.x = 0.16;
  }
  const rf = roof(w, d, 1.7, 0.4);
  rf.position.set(0, h, -d / 2);
  g.add(rf);
  return g;
}
/* a painted board fixed flat to a wall over a door: the words, on a framed board. The front faces +z; stand it on the wall face. */
export function wallSign(text, w = 2.2, h = 0.5) {
  const g = grp();
  box(w + 0.12, h + 0.12, 0.05, W.WM.woodDark, 0, 0, 0.025, g);
  const lb = plane(w, h, label(text, w, h, "#2f3b33", "#e8ddc4"), 0, 0, 0.056, g);
  return g;
}
function label(text, w, h, bg, fg) {
  const tex = cv(512, Math.max(64, Math.round((512 * h) / w)), (x, Wd, Ht) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, Wd, Ht);
    x.fillStyle = fg;
    x.font = "bold " + Math.round(Ht * 0.52) + "px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, Wd / 2, Ht / 2, Wd * 0.9);
  });
  return std(tex, 1);
}
/* the chapel on the south side of the square, near King's House. Long (1774): "built much in the style of the common-halls belonging to the
   inns of court in London: the walls are crowned with battlements; and on the centre of the roof is a cupola and clock". By 1774 it held
   arms. The windows and the door are a general picture. The front faces +z. */
export function chapel(w = 13, { d = 8, h = 7 } = {}) {
  const g = grp(),
    wallM = std(T.plaster([214, 206, 186], [3, 1]), 1),
    stone = std(T.stone([190, 184, 168], [2, 1]), 1);
  box(w, h, d, wallM, 0, h / 2, -d / 2, g);
  box(w + 0.24, 0.5, d + 0.24, stone, 0, 0.25, -d / 2, g);
  /* tall windows and a central door with a stone surround */
  const n = 5;
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (i + 0.5) * (w / n);
    if (i === 2) {
      const dr = makeDoor({ w: 1.5, h: 2.9, kind: "plank", leaves: 2, color: 0x3d2c22, frame: 0xd8d0bc });
      dr.position.set(x, 0.5, 0.01);
      g.add(dr);
      box(2.2, 0.3, 0.8, stone, x, 0.15, 0.4, g);
      sash(g, x, 5.2, 0.02, 1.1, 1.6, true);
    } else sash(g, x, 3.6, 0.02, 1.1, 3.4, i % 2 === 0);
  }
  /* the battlements: a coping and merlons all round the top */
  box(w + 0.3, 0.24, d + 0.3, stone, 0, h + 0.12, -d / 2, g);
  for (const [len, z, rot] of [[w, 0.0, 0], [w, -d, 0], [d, -d / 2, 1]])
    for (const sx of rot ? [-w / 2, w / 2] : [0]) {
      const k = Math.floor(len / 0.9);
      for (let i = 0; i <= k; i += 2) {
        const t = -len / 2 + 0.2 + (i * (len - 0.4)) / k;
        if (rot) box(0.34, 0.6, 0.5, stone, sx + (sx < 0 ? 0.02 : -0.02), h + 0.54, z + t, g);
        else box(0.5, 0.6, 0.34, stone, t, h + 0.54, z + (z === 0 ? -0.02 : 0.02), g);
      }
    }
  const rf = roof(w - 0.8, d - 0.8, 1.6, 0);
  rf.position.set(0, h + 0.24, -d / 2);
  g.add(rf);
  /* the cupola and clock on the middle of the roof */
  const cz = -d / 2;
  box(1.8, 2.2, 1.8, wallM, 0, h + 1.9, cz, g);
  box(2.0, 0.16, 2.0, M.white, 0, h + 3.05, cz, g);
  const face = cyl(0.56, 0.56, 0.05, M.white, 0, h + 2.25, cz + 0.92, g, 20);
  face.rotation.x = Math.PI / 2;
  const ink = solid(0x1e1c1a, 0.8);
  box(0.04, 0.4, 0.02, ink, 0, h + 2.4, cz + 0.955, g);
  box(0.3, 0.04, 0.02, ink, 0.13, h + 2.25, cz + 0.955, g);
  for (let i = 0; i < 8; i++) cyl(0.07, 0.07, 1.3, M.white, Math.cos((i * Math.PI) / 4) * 0.6, h + 3.78, cz + Math.sin((i * Math.PI) / 4) * 0.6, g, 6);
  box(1.6, 0.14, 1.6, M.white, 0, h + 4.48, cz, g);
  const dome = mesh(new THREE.SphereGeometry(0.78, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), solid(0x5a6a62, 0.6, 0.2), 0, h + 4.54, cz, g);
  cyl(0.03, 0.03, 0.7, ink, 0, h + 5.55, cz, g, 5);
  mesh(new THREE.SphereGeometry(0.1, 8, 6), solid(0xb08a3a, 0.4, 0.6), 0, h + 5.35, cz, g);
  return g;
}
export { M as SM };
