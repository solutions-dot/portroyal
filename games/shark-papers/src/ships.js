/* Ships, their gear and the shark: the builders the three places share. Everything here is drawn in code.
   A hull is a set of lines (how wide she is and how high her rail stands, from stern to bow); the planking, the deck, the bulwarks and the
   stern are made from those lines, so a schooner, a cutter, a brig and a two-decker are the same builder with different numbers.
   Every ship lies along z with her bow toward -z; y = 0 is her deck amidships and her waterline is at y = -fb.
   What each ship is modelled on, and what is still a general picture, is in docs/games/shark-papers.md ("Places"). */
import * as THREE from "three";
import { cv, std, solid, mesh, box, cyl, grp } from "./gfx.js";
import { loftSkin } from "../../../engine/loft.js";

const DS = { side: THREE.DoubleSide };
export const SM = {
  spar: solid(0xa98654, 0.8),   /* pine spars, oiled */
  sparDark: solid(0x2a2522, 0.9),   /* mastheads, tops and yards, blacked */
  tar: solid(0x1b1a19, 0.95),   /* standing rigging, tarred */
  hemp: solid(0xbfa675, 1),   /* running rigging */
  iron: solid(0x26282b, 0.6, 0.35),
  gun: solid(0x1c1d1f, 0.5, 0.5),
  wood: solid(0x7a5a3c, 0.9),
  woodDark: solid(0x3a2a1f, 0.95),
  red: solid(0x8a2f24, 0.95),   /* red ochre, as inboard works were painted */
  ochre: solid(0xc49a45, 0.9),
  brass: solid(0xb8963c, 0.35, 0.8),
  bone: solid(0xe6dfcc, 0.6),
  lead: solid(0x8a8f92, 0.6, 0.3),
  white: solid(0xe8e2d0, 0.9),
};
let _sail, _grate, _hull;
const sailMat = () =>
  _sail ||
  (_sail = new THREE.MeshStandardMaterial({
    map: cv(256, 256, (x, W, H) => {
      x.fillStyle = "#ddd3b6";
      x.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) {
        x.fillStyle = `rgba(${150 + ((i * 37) % 30)},${138 + ((i * 53) % 24)},110,0.10)`;
        x.fillRect(i * 32, 0, 32, H);
        x.fillStyle = "rgba(96,84,60,0.32)";
        x.fillRect(i * 32, 0, 1.5, H);
      }
      for (let i = 0; i < 900; i++) {
        x.fillStyle = `rgba(110,98,70,${(Math.random() * 0.06).toFixed(3)})`;
        x.fillRect(Math.random() * W, Math.random() * H, 2, 6);
      }
    }),
    roughness: 1,
    side: THREE.DoubleSide,
  }));
const grateMat = () =>
  _grate ||
  (_grate = std(
    cv(128, 128, (x, W, H) => {
      x.fillStyle = "#1a1512";
      x.fillRect(0, 0, W, H);
      x.fillStyle = "#8a6a46";
      for (let i = 0; i < 8; i++) {
        x.fillRect(i * 16, 0, 9, H);
        x.fillRect(0, i * 16, W, 9);
      }
    }),
    0.9,
  ));
const hullMat = () => _hull || (_hull = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }));
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const UP = new THREE.Vector3(0, 1, 0);
/* a rope, stay or spar from a to b: r at a, r1 at b */
export function rope(a, b, r = 0.012, m = SM.tar, parent, seg = 5, r1 = r) {
  const A = V(a),
    d = V(b).sub(A),
    L = d.length(),
    o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r, L, seg, 1, seg < 7), m);
  o.position.copy(A).addScaledVector(d, 0.5);
  o.quaternion.setFromUnitVectors(UP, d.normalize());
  if (parent) parent.add(o);
  return o;
}
export const spar = (a, b, r0, r1, m = SM.spar, parent) => rope(a, b, r0, m, parent, 10, r1);
/* a sail between four corners (tack, clew, peak, throat, going round), hanging with a little belly toward +x * belly */
export function sail(c, belly = 0.25, parent, n = 6) {
  const P = c.map(V),
    pos = [],
    uv = [],
    idx = [];
  for (let i = 0; i <= n; i++)
    for (let j = 0; j <= n; j++) {
      const u = i / n,
        v = j / n,
        a = P[0].clone().lerp(P[1], u),
        b = P[3].clone().lerp(P[2], u),
        p = a.lerp(b, v);
      p.x += Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * belly;
      pos.push(p.x, p.y, p.z);
      uv.push(u * Math.max(1, P[0].distanceTo(P[1]) / 2.4), v);
    }
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const a = i * (n + 1) + j,
        b = a + n + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const o = new THREE.Mesh(g, sailMat());
  if (parent) parent.add(o);
  return o;
}
/* a three-cornered sail (a jib or a staysail): the head corner doubled */
export const jib = (tack, clew, head, belly, parent) => sail([tack, clew, head, head], belly, parent, 5);

/* ---------- the hull ---------- */
const BLACK = 0x1d1c1b,
  OCHRE = 0xc49a45,
  PALE = 0xb9b29a;
/* the lines of a hull. s runs from the stern (0) to the bow (1). */
export function lines({ L, B, fb = 1.5, bul = 0.85, sheerF = 0, sheerA = 0, stern = 0.74, bowAt = 0.6, bluff = 2.4 }) {
  const h = B / 2;
  return {
    L, B, fb, bul,
    z: (s) => (0.5 - s) * L,
    s: (z) => 0.5 - z / L,
    half: (s) => (s < 0.3 ? h * (stern + (1 - stern) * Math.sin((Math.max(0, s) / 0.3) * (Math.PI / 2))) : s < bowAt ? h : h * Math.pow(Math.max(0, 1 - Math.pow((s - bowAt) / (1 - bowAt), bluff)), 0.6)),
    sheer: (s) => sheerA * Math.pow(Math.max(0, (0.4 - s) / 0.4), 2) + sheerF * Math.pow(Math.max(0, (s - 0.5) / 0.5), 2),
  };
}
/* the planked hull, her deck, bulwarks and stern, from her lines.
   o: stripe (height of the ochre band below the deck edge, 0 for none), bands ([[y from the deck, height, colour]] for more),
      ports ([{ y, n, s0, s1, w, h, lid }] rows of gun ports), deck (a material, or false), inner (inboard bulwark colour), N stations */
export function hull(F, o = {}) {
  const g = grp(),
    N = o.N || 30,
    stripe = o.stripe ?? 0.3,
    pos = [],
    col = [],
    idx = [],
    c = new THREE.Color();
  const wAt = (s, y) => {
    const sh = F.sheer(s),
      k = (y + F.fb) / (sh + F.fb);   /* 0 at the waterline, 1 at the deck edge */
    return Math.max(0.04, F.half(s) * (k >= 0 ? 0.9 + 0.1 * Math.min(1, k) : Math.max(0.35, 0.9 + k * 0.5)));
  };
  /* bands from the rail down: [top, bottom, colour], heights measured from the local deck edge */
  const B = [[F.bul, -0.04, BLACK]];
  if (stripe) B.push([-0.04, -0.04 - stripe, o.stripeColor || OCHRE]);
  for (const [y, hgt, colr] of o.bands || []) B.push([y, y - hgt, colr]);
  B.sort((a, b) => b[0] - a[0]);
  const full = [];
  let top = F.bul;
  for (const b of B) {
    if (b[0] < top - 0.001) full.push([top, b[0], BLACK]);
    full.push(b);
    top = b[1];
  }
  const strip = (yTop, yBot, colour, fixedBot) => {
    for (const side of [1, -1]) {
      const base = pos.length / 3;
      c.set(colour);
      for (let i = 0; i <= N; i++) {
        const s = i / N,
          sh = F.sheer(s),
          y0 = sh + yTop,
          y1 = fixedBot === undefined ? sh + yBot : fixedBot,
          z = F.z(s);
        pos.push(side * wAt(s, y0), y0, z, side * wAt(s, y1), y1, z);
        col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
      for (let i = 0; i < N; i++) {
        const a = base + i * 2;
        idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    }
  };
  for (const [a, b, colr] of full) strip(a, b, colr);
  strip(top, 0, BLACK, -F.fb + 0.12);   /* down to just above the water */
  /* below the waterline: pale "white stuff" over the bottom, as most hulls of the time were payed */
  for (const side of [1, -1]) {
    const base = pos.length / 3;
    c.set(o.bottom || PALE);
    for (let i = 0; i <= N; i++) {
      const s = i / N,
        z = F.z(s);
      pos.push(side * wAt(s, -F.fb + 0.12), -F.fb + 0.12, z, side * wAt(s, -F.fb - 1.3), -F.fb - 1.3, z);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    for (let i = 0; i < N; i++) {
      const a = base + i * 2;
      idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }
  /* the stern: a flat transom from the rail to below the water */
  {
    const base = pos.length / 3,
      z = F.z(0) + 0.001,
      ys = [F.sheer(0) + F.bul, F.sheer(0) - 0.04, F.sheer(0) - 0.04 - (stripe || 0.3), -F.fb + 0.12, -F.fb - 1.3],
      cs = [BLACK, stripe ? o.stripeColor || OCHRE : BLACK, BLACK, o.bottom || PALE];
    for (let k = 0; k < 4; k++) {
      c.set(cs[k]);
      const b = pos.length / 3;
      for (const y of [ys[k], ys[k + 1]]) for (const sd of [-1, 1]) {
        pos.push(sd * wAt(0, y), y, z);
        col.push(c.r, c.g, c.b);
      }
      idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
    void base;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const skin = new THREE.Mesh(geo, hullMat());
  skin.name = "hull";
  g.add(skin);
  /* the deck: planks running fore and aft, following the sheer */
  if (o.deck !== false) {
    const p = [],
      uv = [],
      ix = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N,
        w = Math.max(0.02, F.half(s) - 0.02),
        z = F.z(s),
        y = F.sheer(s);
      p.push(-w, y, z, w, y, z);
      uv.push(-w / 1.6, z / 3, w / 1.6, z / 3);
    }
    for (let i = 0; i < N; i++) {
      const a = i * 2;
      ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    dg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    dg.setIndex(ix);
    dg.computeVertexNormals();
    const dk = new THREE.Mesh(dg, o.deck || SM.wood);
    dk.name = "terrain";
    g.add(dk);
    g.userData.deck = dk;
  }
  /* the bulwark's inboard face and the rail on top of it */
  if (o.inner !== false) {
    const p = [],
      cl = [],
      ix = [],
      inC = new THREE.Color(o.inner || 0x6e4a34),
      capC = new THREE.Color(o.cap || 0x4a3626);
    for (const side of [1, -1]) {
      const base = p.length / 3;
      for (let i = 0; i <= N; i++) {
        const s = i / N,
          z = F.z(s),
          sh = F.sheer(s),
          wo = wAt(s, sh + F.bul),
          wi = Math.max(0.01, F.half(s) - 0.13);
        p.push(side * wi, sh, z, side * wi, sh + F.bul, z, side * (wi - 0.05), sh + F.bul + 0.035, z, side * (wo + 0.05), sh + F.bul + 0.035, z, side * (wo + 0.05), sh + F.bul - 0.03, z);
        cl.push(inC.r, inC.g, inC.b, inC.r, inC.g, inC.b, capC.r, capC.g, capC.b, capC.r, capC.g, capC.b, capC.r, capC.g, capC.b);
      }
      for (let i = 0; i < N; i++)
        for (let k = 0; k < 4; k++) {
          const a = base + i * 5 + k;
          ix.push(a, a + 1, a + 5, a + 1, a + 6, a + 5);
        }
    }
    /* across the stern */
    const b0 = p.length / 3,
      z = F.z(0),
      sh = F.sheer(0),
      w = F.half(0);
    p.push(-w, sh, z - 0.13, w, sh, z - 0.13, -w, sh + F.bul, z - 0.13, w, sh + F.bul, z - 0.13, -w - 0.05, sh + F.bul + 0.035, z - 0.2, w + 0.05, sh + F.bul + 0.035, z - 0.2, -w - 0.05, sh + F.bul + 0.035, z + 0.06, w + 0.05, sh + F.bul + 0.035, z + 0.06);
    for (let k = 0; k < 4; k++) cl.push(inC.r, inC.g, inC.b);
    for (let k = 0; k < 4; k++) cl.push(capC.r, capC.g, capC.b);
    ix.push(b0, b0 + 1, b0 + 2, b0 + 1, b0 + 3, b0 + 2, b0 + 4, b0 + 5, b0 + 6, b0 + 5, b0 + 7, b0 + 6);
    const bg = new THREE.BufferGeometry();
    bg.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    bg.setAttribute("color", new THREE.Float32BufferAttribute(cl, 3));
    bg.setIndex(ix);
    bg.computeVertexNormals();
    g.add(new THREE.Mesh(bg, hullMat()));
  }
  /* gun ports: a dark opening in the side, a lid lifted above it when lid is true */
  for (const R of o.ports || [])
    for (let k = 0; k < R.n; k++) {
      const s = R.s0 + ((R.s1 - R.s0) * (k + 0.5)) / R.n,
        y = F.sheer(s) + R.y,
        z = F.z(s),
        w = R.w || 0.7,
        hh = R.h || 0.6,
        ds = 0.01,
        ang = Math.atan2(wAt(s + ds, y) - wAt(s - ds, y), (2 * ds * F.L));
      for (const side of [1, -1]) {
        const x = side * (wAt(s, y) + 0.02),
          pt = box(0.06, hh, w, R.color ? solid(R.color, 0.9) : SM.tar, x, y, z, g);
        pt.rotation.y = side * ang;
        if (R.lid) {
          const ld = box(hh * 0.8, 0.05, w, SM.red, x + side * hh * 0.38, y + hh * 0.56, z, g);   /* the lid, triced up */
          ld.rotation.y = side * ang;
          ld.rotation.z = side * 0.25;
        }
      }
    }
  /* the stem and the rudder */
  spar([0, -F.fb - 1.2, F.z(1) + 0.25], [0, F.sheer(1) + F.bul + 0.25, F.z(1) - 0.12], 0.09, 0.07, SM.woodDark, g);
  box(0.09, F.fb + 1.2 + F.sheer(0), 0.5, SM.woodDark, 0, (F.sheer(0) - F.fb - 1.2) / 2, F.z(0) + 0.26, g);
  g.userData.lines = F;
  g.userData.wAt = wAt;
  return g;
}

/* ---------- masts and rigging ---------- */
/* shrouds on both sides of a mast: from the hounds down to the rail, with ratlines to climb and deadeyes at the foot.
   at(z) -> half the ship's width at the rail there; y0: the rail's height */
export function shrouds(g, { z, hounds, n = 3, gap = 0.42, first = 0.25, at, y0, rat = 0.4, r = 0.014, aft = 1 }) {
  for (const side of [1, -1]) {
    const feet = [],
      heads = [];
    for (let k = 0; k < n; k++) {
      const zz = z + aft * (first + k * gap),
        x = side * (at(zz) + 0.06);
      feet.push([x, y0 + 0.24, zz]);
      heads.push([side * 0.1, hounds, z + aft * 0.05 * k]);
      rope(feet[k], heads[k], r, SM.tar, g);
      /* the deadeyes and their lanyard, and the chain plate down the side */
      for (const dy of [0.06, 0.2]) cyl(0.05, 0.05, 0.035, SM.tar, x, y0 + dy, zz, g, 8).rotation.z = Math.PI / 2;
      rope([x, y0 + 0.06, zz], [x, y0 + 0.22, zz], 0.02, SM.hemp, g, 4);
      box(0.03, 0.34, 0.035, SM.iron, x, y0 - 0.14, zz, g);
    }
    if (n > 1) {
      box(0.1, 0.03, (n - 1) * gap + 0.3, SM.woodDark, side * (at(z + aft * (first + ((n - 1) * gap) / 2)) + 0.07), y0 + 0.01, z + aft * (first + ((n - 1) * gap) / 2), g);   /* the channel the deadeyes stand on */
      const A = V(feet[0]),
        Bv = V(feet[n - 1]),
        HA = V(heads[0]),
        HB = V(heads[n - 1]),
        H = hounds - y0;
      for (let y = 0.55; y < H - 0.5; y += rat) {
        const k = y / H;
        rope(A.clone().lerp(HA, k).toArray(), Bv.clone().lerp(HB, k).toArray(), 0.007, SM.tar, g, 4);
      }
    }
  }
}
/* a fore-and-aft mast with its gaff sail: the lower mast, a topmast above the cap, a boom (or none) and a gaff.
   o: z, h (hounds), top (topmast length), r (radius at the deck), boom (length), gaffL, boomY, swing (how far the boom is off the centre line),
      set: 'set' (hanging in the calm), 'brailed' (gathered to the mast and gaff) or 'furled' (stowed on the boom) */
export function gaffMast(g, o) {
  const { z, h, top = h * 0.55, r = 0.15, boom = 6, gaffL = boom * 0.62, boomY = 2.3, swing = 0, set = "set", deck = 0 } = o,
    m = grp(g);
  spar([0, deck - 1, z], [0, deck + h + 0.9, z], r, r * 0.72, SM.spar, m);
  /* the cap, the crosstrees and the topmast */
  box(0.34, 0.1, 0.5, SM.sparDark, 0, deck + h + 0.9, z - 0.12, m);
  box(1.1, 0.06, 0.09, SM.sparDark, 0, deck + h, z + 0.05, m);
  box(1.1, 0.06, 0.09, SM.sparDark, 0, deck + h, z - 0.3, m);
  box(0.09, 0.07, 0.7, SM.sparDark, 0.14, deck + h - 0.03, z - 0.12, m);
  box(0.09, 0.07, 0.7, SM.sparDark, -0.14, deck + h - 0.03, z - 0.12, m);
  spar([0, deck + h - 0.2, z - 0.24], [0, deck + h + top, z - 0.24], r * 0.5, r * 0.3, SM.spar, m);
  cyl(0.06, 0.06, 0.05, SM.sparDark, 0, deck + h + top + 0.02, z - 0.24, m, 8);   /* the truck */
  /* mast hoops and an iron band or two */
  for (let y = boomY + 0.6; y < h - 2; y += 0.55) mesh(new THREE.TorusGeometry(r * 0.98 + 0.012, 0.014, 4, 12), SM.wood, 0, deck + y, z, m).rotation.x = Math.PI / 2;
  const sx = Math.sin(swing),
    cz = Math.cos(swing),
    throat = [0, deck + h - 0.9, z + r + 0.08],
    peakR = gaffL,
    peak = [sx * peakR * 0.8, throat[1] + peakR * 0.52, z + r + cz * peakR * 0.85],
    tack = [0, deck + boomY + 0.08, z + r + 0.08],
    clew = [sx * boom, deck + boomY + 0.12, z + r + cz * boom];
  spar(throat, peak, 0.075, 0.05, SM.spar, m);
  box(0.26, 0.09, 0.2, SM.spar, 0, throat[1], z + r - 0.02, m);   /* the gaff's jaws round the mast */
  if (boom) {
    spar([0, deck + boomY, z + r + 0.02], [sx * (boom + 0.5), deck + boomY + 0.04, z + r + cz * (boom + 0.5)], 0.085, 0.06, SM.spar, m);
    box(0.28, 0.1, 0.22, SM.spar, 0, deck + boomY, z + r - 0.02, m);
    /* the topping lift from the masthead to the boom end, and the sheet from the boom to the deck */
    rope([0, deck + h + 0.4, z + 0.1], [sx * (boom + 0.4), deck + boomY + 0.1, z + r + cz * (boom + 0.4)], 0.009, SM.hemp, m, 4);
  }
  /* the peak and throat halyards */
  rope([0, deck + h + 0.6, z + 0.05], [peak[0] * 0.55, throat[1] + (peak[1] - throat[1]) * 0.55, z + r + cz * peakR * 0.47], 0.009, SM.hemp, m, 4);
  rope([0, deck + h + 0.5, z + 0.12], [0, throat[1] + 0.08, z + r + 0.1], 0.009, SM.hemp, m, 4);
  if (set === "set") sail([tack, clew, peak, throat], 0.22 + Math.abs(swing), m);
  else if (set === "brailed") {
    /* gathered in to the mast and up to the gaff: a heavy fold of canvas down the mast and along the spar */
    sail([tack, [sx * 0.5, tack[1] + 0.4, z + r + 0.7], [peak[0] * 0.5, throat[1] + (peak[1] - throat[1]) * 0.5 - 0.5, z + r + cz * peakR * 0.42], throat], 0.3, m, 5);
    const b = spar(throat, peak, 0.13, 0.1, sailMat(), m);
    b.position.y -= 0.13;
  } else if (boom) {
    const b = spar(tack, clew, 0.14, 0.11, sailMat(), m);
    b.position.y += 0.16;
    for (let k = 0.12; k < 1; k += 0.14) mesh(new THREE.TorusGeometry(0.17, 0.012, 4, 10), SM.hemp, sx * boom * k, deck + boomY + 0.19, z + r + cz * boom * k, m);   /* the gaskets */
  }
  m.userData = { throat, peak, tack, clew, head: [0, deck + h + top, z - 0.24], hounds: [0, deck + h, z] };
  return m;
}
/* a square-rigged mast: lower mast with a top, a topmast with crosstrees, a topgallant mast, and yards with the sails furled along them (in port)
   yards: [[height, length]] ; o.set: yards whose sails hang loose to dry are not modelled, every sail is furled */
export function squareMast(g, { z, h, r = 0.2, top = h * 0.62, tg = h * 0.34, yards = [], deck = 0, platform = true }) {
  const m = grp(g);
  spar([0, deck - 1, z], [0, deck + h + 1.1, z], r, r * 0.8, SM.spar, m);
  if (platform) {
    box(r * 9, 0.07, r * 6.5, SM.sparDark, 0, deck + h, z + 0.1, m);
    box(r * 7, 0.12, 0.1, SM.sparDark, 0, deck + h - 0.08, z + r + 0.2, m);
    box(r * 7, 0.12, 0.1, SM.sparDark, 0, deck + h - 0.08, z - r - 0.2, m);
  }
  box(r * 2.2, 0.12, r * 4, SM.sparDark, 0, deck + h + 1.1, z - r, m);   /* the cap */
  if (top) {
    spar([0, deck + h - 0.3, z - r * 1.9], [0, deck + h + top, z - r * 1.9], r * 0.62, r * 0.45, SM.spar, m);
    box(r * 6, 0.05, 0.08, SM.sparDark, 0, deck + h + top - 0.9, z - r * 1.9 + 0.2, m);
    box(r * 6, 0.05, 0.08, SM.sparDark, 0, deck + h + top - 0.9, z - r * 1.9 - 0.2, m);
    if (tg) {
      spar([0, deck + h + top - 1.1, z - r * 3.3], [0, deck + h + top + tg, z - r * 3.3], r * 0.38, r * 0.2, SM.spar, m);
      cyl(0.05, 0.05, 0.04, SM.sparDark, 0, deck + h + top + tg + 0.02, z - r * 3.3, m, 8);
    }
  }
  for (const [y, len] of yards) {
    const zz = z - r - 0.14 - (y > h ? r * 1.9 : 0) - (y > h + top ? r * 1.4 : 0),
      rr = Math.max(0.05, len * 0.012);
    spar([-len / 2, deck + y, zz], [0, deck + y, zz], rr * 0.55, rr, SM.sparDark, m);
    spar([0, deck + y, zz], [len / 2, deck + y, zz], rr, rr * 0.55, SM.sparDark, m);
    /* the sail furled on top of the yard, in its gaskets */
    const f = cyl(rr * 1.5, rr * 1.5, len * 0.9, sailMat(), 0, deck + y + rr * 1.9, zz, m, 8);
    f.rotation.z = Math.PI / 2;
    f.scale.x = 1.25;
    /* lifts from the mast above to the yard arms, and foot ropes under the yard */
    for (const s of [-1, 1]) {
      rope([0, deck + y + Math.min(2.2, len * 0.22), zz + 0.1], [s * len * 0.48, deck + y + 0.05, zz], 0.008, SM.hemp, m, 4);
      rope([s * len * 0.48, deck + y - 0.05, zz + 0.06], [s * 0.3, deck + y - 0.5, zz + 0.1], 0.008, SM.tar, m, 4);
    }
  }
  m.userData = { head: [0, deck + h + top + tg, z - r * 3.3], hounds: [0, deck + h, z], topHead: [0, deck + h + top - 0.9, z - r * 1.9] };
  return m;
}
/* a bowsprit and jib-boom running out over the stem, with its bobstay and gammoning */
export function bowsprit(g, { z, y, len, rise = 0.28, r = 0.13, jibboom = len * 0.55 }) {
  const m = grp(g),
    c = Math.cos(rise),
    s = Math.sin(rise),
    heel = [0, y, z + 1.6],
    cap = [0, y + s * (len + 1.6), z - c * len],
    end = [0, cap[1] + s * jibboom * 0.92, cap[2] - c * jibboom];
  spar(heel, cap, r, r * 0.8, SM.spar, m);
  if (jibboom) spar([0, cap[1] - s * 1.2 + 0.14, cap[2] + c * 1.2], [end[0], end[1] + 0.14, end[2]], r * 0.55, r * 0.35, SM.spar, m);
  box(0.2, 0.34, 0.1, SM.sparDark, 0, cap[1] + 0.07, cap[2], m);
  m.userData = { cap, end };
  return m;
}

/* ---------- deck gear ---------- */
/* an iron gun on a wooden truck carriage. len: the barrel's length (a 3-pounder is about 1.35 m). The muzzle points to +z. */
export function gun(len = 1.35, cal = 1) {
  const g = grp(),
    r = 0.1 * cal,
    pr = [[0, -len * 0.56], [r * 0.5, -len * 0.56], [r * 0.62, -len * 0.52], [r * 0.4, -len * 0.5], [r * 1.02, -len * 0.47], [r * 1.02, -len * 0.44], [r * 0.95, -len * 0.44], [r * 0.9, -len * 0.14], [r * 1.0, -len * 0.14], [r * 1.0, -len * 0.11], [r * 0.84, -len * 0.11], [r * 0.7, len * 0.4], [r * 0.82, len * 0.41], [r * 0.9, len * 0.45], [r * 0.78, len * 0.49], [r * 0.4, len * 0.49], [r * 0.4, len * 0.3]],
    barrel = mesh(new THREE.LatheGeometry(pr.map((p) => new THREE.Vector2(p[0], p[1])), 12), SM.gun, 0, 0.42 * cal, 0.08, g);
  barrel.rotation.x = Math.PI / 2;
  cyl(0.03 * cal, 0.03 * cal, 0.34 * cal, SM.gun, 0, 0.42 * cal, -0.02, g, 6).rotation.z = Math.PI / 2;   /* the trunnions */
  for (const s of [-1, 1]) {
    /* the cheeks, stepped down toward the back */
    box(0.07 * cal, 0.3 * cal, 0.42 * cal, SM.red, s * 0.155 * cal, 0.3 * cal, 0.06, g);
    box(0.07 * cal, 0.2 * cal, 0.24 * cal, SM.red, s * 0.155 * cal, 0.25 * cal, -0.26 * cal, g);
    box(0.07 * cal, 0.1 * cal, 0.2 * cal, SM.red, s * 0.155 * cal, 0.2 * cal, -0.46 * cal, g);
    for (const z of [0.16, -0.34]) cyl(z > 0 ? 0.1 * cal : 0.085 * cal, z > 0 ? 0.1 * cal : 0.085 * cal, 0.07 * cal, SM.woodDark, s * 0.24 * cal, z > 0 ? 0.1 * cal : 0.085 * cal, z * cal, g, 10).rotation.z = Math.PI / 2;
  }
  box(0.38 * cal, 0.06 * cal, 0.86 * cal, SM.red, 0, 0.14 * cal, -0.1 * cal, g);   /* the bed */
  box(0.5 * cal, 0.05 * cal, 0.07 * cal, SM.woodDark, 0, 0.1 * cal, 0.16 * cal, g);   /* axles */
  box(0.5 * cal, 0.05 * cal, 0.07 * cal, SM.woodDark, 0, 0.085 * cal, -0.34 * cal, g);
  box(0.1 * cal, 0.1 * cal, 0.3 * cal, SM.wood, 0, 0.22 * cal, -0.34 * cal, g).rotation.x = 0.25;   /* the quoin that sets the height of the muzzle */
  return g;
}
/* a gun at its port: the breeching rope from the bulwark round the back of the gun, and the side tackles */
export function gunAtPort(side, len = 1.35) {
  const g = grp(),
    q = gun(len);
  q.rotation.y = (side * Math.PI) / 2;
  q.position.x = side * 0.3;   /* run out: the muzzle stands in the port */
  g.add(q);
  for (const dz of [-0.42, 0.42]) {
    rope([side * 0.78, 0.36, dz], [side * -0.44, 0.34, dz * 0.42], 0.022, SM.hemp, g, 5);
    cyl(0.035, 0.035, 0.03, SM.iron, side * 0.78, 0.36, dz, g, 6).rotation.z = Math.PI / 2;
  }
  rope([side * -0.44, 0.34, -0.18], [side * -0.44, 0.34, 0.18], 0.022, SM.hemp, g, 5);
  return g;
}
/* a rope coiled down flat on the deck, or (hang) hung from a pin */
export function coil(r = 0.26, turns = 4, hang = false, m = SM.hemp) {
  const g = grp();
  if (hang) {
    for (let i = 0; i < turns; i++) mesh(new THREE.TorusGeometry(r * (0.82 + i * 0.05), 0.018, 5, 14), m, 0, -r * 1.2, i * 0.014 - 0.02, g).scale.set(0.6, 1.3, 1);
    cyl(0.018, 0.018, 0.22, m, 0, -0.02, 0, g, 5);
  } else
    for (let i = 0; i < turns; i++) {
      const t = mesh(new THREE.TorusGeometry(r * (1 - i * 0.2) + 0.02, 0.022, 5, 16), m, 0, 0.022 + (i % 2) * 0.016, 0, g);
      t.rotation.x = Math.PI / 2;
    }
  return g;
}
/* a rope left in a heap: loops thrown down anyhow (what Jem tidies) */
export function tangle(m = SM.hemp) {
  const g = grp();
  for (const [x, z, r, a, b] of [[0, 0, 0.3, 0.2, 0], [0.16, 0.1, 0.22, -0.25, 1], [-0.14, 0.14, 0.26, 0.3, 2], [0.05, -0.18, 0.2, -0.15, 3], [-0.2, -0.1, 0.17, 0.35, 4]]) {
    const t = mesh(new THREE.TorusGeometry(r, 0.022, 5, 14), m, x, 0.03 + b * 0.012, z, g);
    t.rotation.x = Math.PI / 2 + a;
    t.rotation.z = b;
    t.scale.y = 0.7 + 0.1 * b;
  }
  rope([0.3, 0.025, 0.1], [0.75, 0.025, -0.2], 0.022, m, g, 5);
  return g;
}
/* a pin rail: a plank with belaying pins, and coils of rope hung on some of them. n pins along z. */
export function pinRail(n = 5, hung = [0, 2, 3]) {
  const g = grp();
  box(0.12, 0.05, n * 0.2 + 0.1, SM.woodDark, 0, 0, 0, g);
  for (let k = 0; k < n; k++) {
    const z = (k - (n - 1) / 2) * 0.2;
    cyl(0.014, 0.011, 0.26, SM.wood, 0, 0, z, g, 6);
    cyl(0.02, 0.016, 0.07, SM.wood, 0, 0.12, z, g, 6);
    if (hung.includes(k)) {
      const c = coil(0.17, 3, true);
      c.position.set(0, -0.04, z);
      c.rotation.y = Math.PI / 2;
      g.add(c);
    }
  }
  return g;
}
/* a hatch: a coaming with a grating let into it. w across, d along. */
export function hatch(w = 1.6, d = 1.3, h = 0.42, solidTop = false) {
  const g = grp();
  for (const s of [-1, 1]) {
    box(0.1, h, d, SM.woodDark, (s * (w - 0.1)) / 2, h / 2, 0, g);
    box(w, h, 0.1, SM.woodDark, 0, h / 2, (s * (d - 0.1)) / 2, g);
  }
  const top = box(w - 0.16, 0.05, d - 0.16, solidTop ? SM.wood : grateMat().clone(), 0, h - 0.01, 0, g);
  if (!solidTop) {
    top.material.map = top.material.map.clone();
    top.material.map.repeat.set(Math.round(w / 0.5), Math.round(d / 0.5));
    top.material.map.needsUpdate = true;
  } else for (let k = -1; k <= 1; k++) box(w - 0.1, 0.03, 0.07, SM.woodDark, 0, h + 0.03, k * d * 0.3, g);   /* battens over a closed hatch */
  box(w - 0.2, h - 0.08, d - 0.2, new THREE.MeshBasicMaterial({ color: 0x0a0807 }), 0, (h - 0.08) / 2, 0, g);
  return g;
}
/* the companionway: a low house over the cabin ladder, with a sliding top and two small doors facing aft (+z) */
export function companion(w = 1.0, d = 1.3, h = 0.95) {
  const g = grp();
  box(w, h, d, SM.wood, 0, h / 2, 0, g);
  const top = box(w + 0.1, 0.06, d * 0.62, SM.woodDark, 0, h + 0.03, -d * 0.2, g);
  top.rotation.x = 0.04;
  for (const s of [-1, 1]) box(0.05, 0.05, d + 0.04, SM.woodDark, s * (w / 2 + 0.01), h + 0.01, 0, g);
  box(w - 0.16, h - 0.16, 0.03, new THREE.MeshBasicMaterial({ color: 0x0b0908 }), 0, h / 2 + 0.04, d / 2 + 0.006, g);   /* the dark way down */
  for (const s of [-1, 1]) {
    const leaf = box(0.04, h - 0.14, w / 2 - 0.06, SM.woodDark, s * (w / 2 - 0.04), h / 2 + 0.04, d / 2 + w / 4, g);   /* the doors, folded back */
    leaf.rotation.y = s * 0.25;
    cyl(0.012, 0.012, 0.03, SM.brass, s * (w / 2 - 0.07), h / 2 + 0.05, d / 2 + w / 2 - 0.1, g, 6);
  }
  for (const x of [-0.25, 0, 0.25]) box(0.16, 0.1, 0.02, solid(0x6f8a90, 0.2, 0.2), x, h - 0.2, -d / 2 - 0.006, g);   /* small lights forward */
  return g;
}
/* the binnacle: a small cupboard lashed to the deck before the tiller, a compass each side and a lamp between */
export function binnacle() {
  const g = grp();
  box(0.9, 0.78, 0.42, SM.wood, 0, 0.45, 0, g);
  for (const x of [-0.42, 0.42]) for (const z of [-0.18, 0.18]) box(0.06, 0.1, 0.06, SM.woodDark, x, 0.05, z, g);
  box(0.96, 0.04, 0.48, SM.woodDark, 0, 0.86, 0, g);
  for (const x of [-0.28, 0.28]) {
    box(0.24, 0.26, 0.02, new THREE.MeshBasicMaterial({ color: 0x15110e }), x, 0.6, 0.212, g);
    cyl(0.085, 0.085, 0.03, SM.brass, x, 0.5, 0.2, g, 12);
    cyl(0.07, 0.07, 0.006, SM.white, x, 0.518, 0.2, g, 12);
  }
  box(0.14, 0.3, 0.02, solid(0xe2b458, 0.4, 0, { emissive: 0x5a3a10 }), 0, 0.6, 0.213, g);
  for (const s of [-1, 1]) rope([s * 0.48, 0.5, 0], [s * 0.78, 0.01, 0], 0.012, SM.hemp, g, 4);   /* lashings to ring bolts */
  return g;
}
/* the windlass: a barrel between two bitts, turned with handspikes, for the anchor cable */
export function windlass(w = 2.0) {
  const g = grp();
  for (const s of [-1, 1]) {
    box(0.2, 0.95, 0.24, SM.woodDark, (s * w) / 2, 0.475, 0, g);
    box(0.14, 0.5, 0.5, SM.woodDark, (s * w) / 2, 0.25, 0.2, g).rotation.x = 0.5;
  }
  const b = mesh(new THREE.CylinderGeometry(0.19, 0.19, w - 0.2, 8), SM.wood, 0, 0.5, 0, g);
  b.rotation.z = Math.PI / 2;
  for (const x of [-w * 0.3, w * 0.3]) {
    const p = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 8), SM.woodDark, x, 0.5, 0, g);
    p.rotation.z = Math.PI / 2;
  }
  /* turns of the cable round the barrel, and a handspike left in its hole */
  for (let k = -2; k <= 2; k++) mesh(new THREE.TorusGeometry(0.21, 0.035, 5, 12), SM.hemp, k * 0.075, 0.5, 0, g).rotation.y = Math.PI / 2;
  spar([w * 0.3, 0.6, 0], [w * 0.3, 1.25, -0.75], 0.03, 0.022, SM.wood, g);
  return g;
}
/* the ship's bell in its belfry: userData.bell swings (rotation.x) */
export function belfry() {
  const g = grp();
  for (const s of [-1, 1]) box(0.09, 1.2, 0.09, SM.woodDark, s * 0.24, 0.6, 0, g);
  box(0.66, 0.1, 0.16, SM.woodDark, 0, 1.24, 0, g);
  box(0.5, 0.05, 0.12, SM.woodDark, 0, 1.32, 0, g);
  const sw = grp(g, 0, 1.17, 0);
  const pr = [[0.012, 0], [0.05, -0.01], [0.075, -0.06], [0.082, -0.14], [0.1, -0.2], [0.125, -0.235], [0.118, -0.24], [0.09, -0.2]];
  mesh(new THREE.LatheGeometry(pr.map((p) => new THREE.Vector2(p[0], p[1])), 14), SM.brass, 0, 0, 0, sw).material.side = THREE.DoubleSide;
  cyl(0.008, 0.008, 0.2, SM.iron, 0, -0.15, 0, sw, 5);
  mesh(new THREE.SphereGeometry(0.022, 8, 6), SM.iron, 0, -0.25, 0, sw);
  rope([0, -0.26, 0], [0, -0.5, 0], 0.008, SM.hemp, sw, 4);
  sw.traverse((o) => (o.userData.noBatch = true));
  g.userData.bell = sw;
  return g;
}
/* a wooden-stocked anchor, lying on its side: shank along +z, about L long */
export function anchor(L = 2.2) {
  const g = grp(),
    r = L * 0.03;
  spar([0, r, 0], [0, r, L], r, r * 0.8, SM.iron, g);
  for (const s of [-1, 1]) {
    const arm = spar([0, r, 0.02], [s * L * 0.3, r, L * 0.2], r * 1.05, r * 0.7, SM.iron, g);
    void arm;
    const fl = mesh(new THREE.ConeGeometry(L * 0.075, L * 0.16, 3), SM.iron, s * L * 0.3, r, L * 0.2, g);
    fl.rotation.set(Math.PI / 2, 0, -s * 0.9);
    fl.scale.z = 0.35;
  }
  box(L * 0.09, L * 0.95, L * 0.07, SM.woodDark, 0, L * 0.4, L * 0.9, g);   /* the wooden stock, standing up as she lies */
  for (const y of [0.25, 0.6]) box(L * 0.1, 0.03, L * 0.08, SM.iron, 0, L * y, L * 0.9, g);
  mesh(new THREE.TorusGeometry(L * 0.07, r * 0.6, 5, 12), SM.iron, 0, r + L * 0.03, L + L * 0.06, g).rotation.y = Math.PI / 2;
  return g;
}
/* a capstan: a barrel on a spindle with holes for the bars, some bars shipped */
export function capstan(bars = 4) {
  const g = grp();
  cyl(0.5, 0.56, 0.1, SM.woodDark, 0, 0.05, 0, g, 12);
  mesh(new THREE.CylinderGeometry(0.2, 0.34, 0.7, 10), SM.wood, 0, 0.45, 0, g);
  for (let k = 0; k < 6; k++) {
    const w = box(0.06, 0.6, 0.12, SM.woodDark, Math.sin((k * Math.PI) / 3) * 0.3, 0.42, Math.cos((k * Math.PI) / 3) * 0.3, g);   /* the whelps the rope grips */
    w.rotation.y = (k * Math.PI) / 3;
  }
  cyl(0.36, 0.34, 0.24, SM.woodDark, 0, 0.92, 0, g, 12);
  cyl(0.3, 0.36, 0.05, SM.wood, 0, 1.06, 0, g, 12);
  for (let k = 0; k < bars; k++) {
    const a = (k * Math.PI * 2) / bars + 0.3;
    spar([Math.sin(a) * 0.3, 0.92, Math.cos(a) * 0.3], [Math.sin(a) * 1.9, 0.94, Math.cos(a) * 1.9], 0.04, 0.03, SM.wood, g);
  }
  for (let k = -1; k <= 1; k++) mesh(new THREE.TorusGeometry(0.3, 0.03, 5, 14), SM.hemp, 0, 0.3 + k * 0.07, 0, g).rotation.x = Math.PI / 2;
  return g;
}
/* spare spars stacked on bearers: len long, lying along x */
export function sparStack(len = 9, n = 5) {
  const g = grp();
  for (const x of [-len * 0.32, len * 0.32]) box(0.2, 0.16, 1.5, SM.woodDark, x, 0.08, 0, g);
  let k = 0;
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < (row ? n - 3 : 3); i++, k++) {
      const r = 0.15 - k * 0.012,
        z = (i - (row ? (n - 4) / 2 : 1)) * 0.36,
        s = spar([-len / 2 + k * 0.3, 0.16 + r + row * 0.27, z], [len / 2 - k * 0.5, 0.16 + r + row * 0.27, z], r, r * 0.7, SM.spar, g);
      void s;
    }
  return g;
}
/* a pile of round shot in a wooden frame */
export function shotRack(n = 5, r = 0.04) {
  const g = grp();
  box(n * r * 2.3 + 0.06, 0.04, r * 2.6, SM.woodDark, 0, 0.02, 0, g);
  for (let k = 0; k < n; k++) mesh(new THREE.SphereGeometry(r, 8, 6), SM.gun, (k - (n - 1) / 2) * r * 2.3, 0.04 + r * 0.8, 0, g);
  return g;
}
/* a wooden pail with rope handle, a swab and a holystone beside it: what a ship's boy works with */
export function swab() {
  const g = grp();
  spar([0, 0.03, 0], [0, 0.05, 1.5], 0.018, 0.016, SM.wood, g);
  for (let k = -2; k <= 2; k++) rope([k * 0.02, 0.03, 0], [k * 0.07, 0.02, -0.4], 0.014, SM.hemp, g, 4);
  return g;
}
/* a brass spyglass on its side */
export function spyglass() {
  const g = grp();
  cyl(0.022, 0.026, 0.3, SM.brass, 0, 0.026, 0, g, 8).rotation.x = Math.PI / 2;
  cyl(0.018, 0.02, 0.22, SM.woodDark, 0, 0.026, -0.24, g, 8).rotation.x = Math.PI / 2;
  return g;
}
/* an officer's cocked hat of the 1790s, worn across the head: a low crown and a brim turned up before and behind, a black cockade and a loop of gold lace */
export function cockedHat() {
  const g = grp(),
    felt = solid(0x121214, 0.85, 0, DS),
    sh = new THREE.Shape();
  sh.moveTo(-0.23, 0);
  sh.quadraticCurveTo(-0.24, 0.07, -0.13, 0.12);
  sh.quadraticCurveTo(0, 0.19, 0.13, 0.12);
  sh.quadraticCurveTo(0.24, 0.07, 0.23, 0);
  sh.quadraticCurveTo(0, -0.035, -0.23, 0);
  const flap = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false, curveSegments: 6 });
  const crown = mesh(new THREE.SphereGeometry(0.098, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), felt, 0, 0, 0, g);
  crown.scale.set(1.0, 0.75, 1.12);
  for (const s of [-1, 1]) {
    const f = mesh(flap, felt, 0, -0.005, s * 0.085, g);
    f.rotation.x = -s * 0.16;
  }
  /* the brim's ends closing at each side */
  for (const s of [-1, 1]) box(0.05, 0.02, 0.17, felt, s * 0.2, 0.004, 0.005, g);
  cyl(0.03, 0.03, 0.006, solid(0x0a0a0b, 0.5), 0.07, 0.085, 0.108, g, 10).rotation.x = Math.PI / 2 - 0.16;   /* the cockade */
  box(0.012, 0.09, 0.004, SM.brass, 0.07, 0.05, 0.106, g).rotation.x = -0.16;
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
}

/* ---------- whole ships ---------- */
/* the rig of a two-masted schooner on a hull: both gaff sails, a jib and a staysail, a square topsail yard on the fore, shrouds and stays.
   set: how the sails are ('set' hanging in a calm, or 'furled'). Returns { fore, main, sprit }. */
export function schoonerRig(g, F, { foreZ, mainZ, set = "set", foreH = 10.5, mainH = 11.5, swing = [0.1, -0.14], deck = 0, boomY = 2.3 } = {}) {
  const at = (z) => F.half(F.s(z)),
    y0 = F.bul,
    rake = 0.045,
    fore = gaffMast(g, { z: foreZ, h: foreH, boom: mainZ - foreZ - 0.9, gaffL: (mainZ - foreZ) * 0.56, swing: swing[0], set, deck, boomY, r: 0.15 }),
    main = gaffMast(g, { z: mainZ, h: mainH, boom: F.z(0) - mainZ + 1.3, gaffL: (F.z(0) - mainZ) * 0.72, swing: swing[1], set, deck, boomY: boomY + 0.1, r: 0.16 });
  for (const m of [fore, main]) {
    /* masts rake a little aft, as a schooner's did: turn each about its own foot */
    const z = m === fore ? foreZ : mainZ;
    m.position.set(0, 0, z);
    m.children.forEach((c) => (c.position.z -= z));
    m.rotation.x = rake;
  }
  const lean = (p, z) => [p[0], p[1] * Math.cos(rake) - (p[2] - z) * Math.sin(rake), z + (p[2] - z) * Math.cos(rake) + p[1] * Math.sin(rake)];
  const fh = lean(fore.userData.hounds, foreZ),
    mh = lean(main.userData.hounds, mainZ),
    fHead = lean(fore.userData.head, foreZ),
    mHead = lean(main.userData.head, mainZ);
  shrouds(g, { z: fh[2] + 0.1, hounds: fh[1] - 0.1, n: 3, at, y0, first: -0.05 });
  shrouds(g, { z: mh[2] + 0.1, hounds: mh[1] - 0.1, n: 3, at, y0, first: -0.05 });
  const sp = bowsprit(g, { z: F.z(1) + 0.1, y: F.bul + 0.25, len: F.L * 0.22, jibboom: F.L * 0.16 });
  /* stays: fore stay and jib stay to the bowsprit, the main stay to the fore masthead, topmast stays, and backstays to the quarters */
  rope(fh, sp.userData.cap, 0.016, SM.tar, g);
  rope([fHead[0], fHead[1] - 0.3, fHead[2]], sp.userData.end, 0.012, SM.tar, g);
  rope([mh[0], mh[1] + 0.5, mh[2]], [fh[0], fh[1] + 0.8, fh[2]], 0.014, SM.tar, g);
  rope([mHead[0], mHead[1] - 0.3, mHead[2]], [fHead[0], fHead[1] - 0.3, fHead[2]], 0.01, SM.tar, g);
  for (const s of [-1, 1]) {
    rope([0, fHead[1] - 0.5, fHead[2]], [s * (at(foreZ + 2.6) + 0.06), y0 + 0.05, foreZ + 2.6], 0.01, SM.tar, g);
    rope([0, mHead[1] - 0.5, mHead[2]], [s * (at(mainZ + 2.8) + 0.06), y0 + 0.05, mainZ + 2.8], 0.01, SM.tar, g);
    rope([s * 0.1, sp.userData.cap[1], sp.userData.cap[2] + 0.15], [s * (at(F.z(1) + 1.6) + 0.02), -0.3, F.z(1) + 1.6], 0.012, SM.tar, g);   /* bowsprit shrouds, from just inboard of the cap */
  }
  rope(sp.userData.cap, [0, -F.fb + 0.3, F.z(1) + 0.3], 0.018, SM.tar, g);   /* the bobstay */
  /* head sails: set and hanging in the calm, or furled along the bowsprit */
  if (set === "set") {
    jib([0, sp.userData.cap[1] + 0.25, sp.userData.cap[2] + 0.4], [0.3, F.bul + 1.4, foreZ - 0.7], [0, fh[1] - 0.6, fh[2] - 0.5], 0.2, g);
    jib([0, sp.userData.end[1] + 0.2, sp.userData.end[2] + 0.5], [-0.3, sp.userData.cap[1] + 1.3, sp.userData.cap[2] + 1.6], [0, fHead[1] - 1.6, fHead[2] - 0.6], -0.2, g);
  } else {
    const f = spar([0, sp.userData.cap[1] + 0.3, sp.userData.cap[2] + 2.4], [0, sp.userData.cap[1] + 0.22, sp.userData.cap[2] + 0.2], 0.13, 0.1, sailMat(), g);
    void f;
  }
  /* the square topsail yard on the fore topmast, its sail furled */
  const ty = fh[1] + 1.7,
    tz = fh[2] - 0.5;
  spar([-2.6, ty, tz], [0, ty, tz], 0.035, 0.06, SM.sparDark, g);
  spar([0, ty, tz], [2.6, ty, tz], 0.06, 0.035, SM.sparDark, g);
  const f = cyl(0.09, 0.09, 4.6, sailMat(), 0, ty + 0.11, tz, g, 8);
  f.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) rope([0, fHead[1] - 0.6, fHead[2]], [s * 2.5, ty + 0.03, tz], 0.008, SM.hemp, g, 4);
  /* sheets and halyards coming down to the deck */
  const ms = main.userData.clew;
  rope(lean(ms, mainZ), [0.5, 0.75, F.z(0) - 0.25], 0.012, SM.hemp, g, 4);
  rope(lean(fore.userData.clew, foreZ), [-0.3, 0.1, mainZ - 0.9], 0.012, SM.hemp, g, 4);
  for (const [m, z] of [[fh, foreZ], [mh, mainZ]]) for (const s of [-1, 1]) rope([s * 0.12, m[1] - 0.2, m[2] + 0.1], [s * (at(z - 0.5) - 0.2), y0 - 0.12, z - 0.5], 0.008, SM.hemp, g, 4);
  return { fore, main, sprit: sp, fh, mh, at };
}
/* HM cutter Sparrow, seen from another deck: one mast, a long bowsprit, a great gaff mainsail and two head sails (123 tons, about 66 feet) */
export function cutter(set = "set") {
  const F = lines({ L: 20.2, B: 7.2, fb: 1.5, bul: 0.9, sheerF: 0.5, sheerA: 0.25, stern: 0.7, bowAt: 0.5, bluff: 2.2 }),
    g = hull(F, { stripe: 0.34, N: 22, ports: [{ y: 0.42, n: 6, s0: 0.14, s1: 0.74, w: 0.6, h: 0.42 }] }),
    mz = F.z(0.6),
    m = gaffMast(g, { z: mz, h: 14.5, top: 8, boom: F.z(0) - mz + 2.6, gaffL: 8.6, boomY: 2.5, swing: -0.1, set, r: 0.24 });
  shrouds(g, { z: mz + 0.1, hounds: 14.4, n: 4, at: (z) => F.half(F.s(z)), y0: F.bul + F.sheer(0.6), gap: 0.5, rat: 0.5 });
  const sp = bowsprit(g, { z: F.z(1) + 0.2, y: F.bul + 0.8, len: 9, rise: 0.1, jibboom: 0, r: 0.16 });
  rope(m.userData.hounds, [0, F.bul + 0.9, F.z(1) + 0.1], 0.02, SM.tar, g);
  rope([0, 15.5, mz], sp.userData.cap, 0.016, SM.tar, g);
  rope([0, 22, mz - 0.24], sp.userData.cap, 0.012, SM.tar, g);
  for (const s of [-1, 1]) rope([0, 21.5, mz - 0.24], [s * (F.half(0.3) + 0.06), F.bul, F.z(0.3)], 0.012, SM.tar, g);
  if (set === "set") {
    jib([0, F.bul + 1.1, F.z(1) + 0.4], [0.3, F.bul + 1.6, mz - 1], [0, 13.6, mz - 0.6], 0.25, g);
    jib([0, sp.userData.cap[1] + 0.3, sp.userData.cap[2] + 0.5], [-0.3, F.bul + 2.4, F.z(1) + 1.4], [0, 15, mz - 0.5], -0.25, g);
  }
  /* the square topsail yard, the sail furled */
  spar([-4.4, 16.2, mz - 0.5], [4.4, 16.2, mz - 0.5], 0.07, 0.07, SM.sparDark, g);
  cyl(0.12, 0.12, 8, sailMat(), 0, 16.36, mz - 0.5, g, 8).rotation.z = Math.PI / 2;
  /* a low companion and a skylight, so her deck is not bare */
  const c = companion(1, 1.2, 0.8);
  c.position.set(0, F.sheer(0.25), F.z(0.25));
  g.add(c);
  return g;
}
/* a merchant brig of the 1790s, about 125 tons: two square-rigged masts, the sails furled in port, a boat on deck, a caboose, a windlass.
   A general picture: no drawing of the Nancy is known. userData.hatchAt: where her main hatch is. */
export function brig(deckMat, o = {}) {
  const F = lines({ L: 23.5, B: 6.9, fb: o.fb ?? 1.9, bul: o.bul ?? 1.0, sheerF: 0.55, sheerA: 0.5, stern: 0.78, bowAt: 0.66, bluff: 3 }),
    g = hull(F, { stripe: 0.3, N: 26, deck: deckMat, inner: 0x5c6a4c, bands: [[-0.7, 0.14, 0x3a2a1f]] }),
    at = (z) => F.half(F.s(z)),
    fz = F.z(0.74),
    mz = F.z(0.34);
  squareMast(g, { z: fz, h: 9.5, r: 0.2, yards: [[7.6, 10.5], [14, 8], [18.2, 5.6]] });
  squareMast(g, { z: mz, h: 10.5, r: 0.21, yards: [[8.4, 11.5], [15.3, 8.6], [19.8, 6]] });
  /* the spanker on the main mast: gaff and boom, the sail brailed in */
  const boom = F.z(0) - mz + 0.8;
  spar([0, 2.9, mz + 0.25], [0, 3.0, mz + boom], 0.09, 0.06, SM.spar, g);
  spar([0, 9.2, mz + 0.25], [0, 12.4, mz + boom * 0.7], 0.07, 0.05, SM.spar, g);
  sail([[0, 3.1, mz + 0.3], [0.2, 3.6, mz + 0.9], [0.1, 10.4, mz + boom * 0.3], [0, 9.1, mz + 0.3]], 0.2, g, 4);
  rope([0, 11.4, mz], [0, 12.4, mz + boom * 0.7], 0.009, SM.hemp, g, 4);
  rope([0, 11, mz], [0, 3.05, mz + boom], 0.009, SM.hemp, g, 4);
  for (const [z, hh] of [[fz, 9.4], [mz, 10.4]]) shrouds(g, { z: z + 0.15, hounds: hh, n: 4, at, y0: F.bul + F.sheer(F.s(z)), gap: 0.46, rat: 0.42 });
  const sp = bowsprit(g, { z: F.z(1) + 0.1, y: F.bul + F.sheer(1) + 0.3, len: 5.6, rise: 0.36, jibboom: 4.4, r: 0.16 });
  rope([0, 9.5, fz], sp.userData.cap, 0.02, SM.tar, g);
  rope([0, 15.4, fz - 0.4], sp.userData.end, 0.014, SM.tar, g);
  rope([0, 10.5, mz], [0, 3.6, fz + 0.3], 0.02, SM.tar, g);
  rope([0, 16.9, mz - 0.4], [0, 10.4, fz], 0.014, SM.tar, g);
  rope([0, 20.5, mz - 0.7], [0, 15.4, fz - 0.4], 0.01, SM.tar, g);
  rope(sp.userData.cap, [0, -F.fb + 0.4, F.z(1) + 0.4], 0.02, SM.tar, g);
  for (const s of [-1, 1]) {
    rope([0, 15.3, fz - 0.4], [s * (at(fz + 3) + 0.06), F.bul + 0.3, fz + 3], 0.012, SM.tar, g);
    rope([0, 16.8, mz - 0.4], [s * (at(mz + 3) + 0.06), F.bul + 0.4, mz + 3], 0.012, SM.tar, g);
  }
  const furl = spar([0, sp.userData.cap[1] + 0.2, sp.userData.cap[2] + 0.2], [0, sp.userData.cap[1] - 0.7, sp.userData.cap[2] + 2.8], 0.12, 0.14, sailMat(), g);
  void furl;
  /* on deck: the windlass, the caboose (the cook's small house) with its chimney, the main hatch, a boat on chocks, the wheel and a skylight */
  const put = (o, z, x = 0, ry = 0, dy = 0) => {
    o.position.set(x, F.sheer(F.s(z)) + dy, z);
    o.rotation.y = ry;
    g.add(o);
    return o;
  };
  put(windlass(2.4), F.z(0.9));
  const cab = grp();
  box(1.5, 1.5, 1.3, SM.wood, 0, 0.75, 0, cab);
  box(1.64, 0.06, 1.44, SM.woodDark, 0, 1.53, 0, cab);
  cyl(0.07, 0.07, 0.7, SM.iron, 0.4, 1.9, 0.3, cab, 8);
  box(0.5, 1.1, 0.03, SM.woodDark, 0, 0.6, 0.66, cab);
  put(cab, F.z(0.66));
  const hz = F.z(0.5);
  put(hatch(2.4, 2.2, 0.5, true), hz);
  put(hatch(1.2, 1.0, 0.4, true), F.z(0.8) + 0.2, 0);
  const wh = grp();
  box(0.5, 0.8, 0.26, SM.woodDark, 0, 0.4, 0, wh);
  mesh(new THREE.TorusGeometry(0.44, 0.035, 6, 16), SM.wood, 0, 0.95, 0.18, wh);
  for (let i = 0; i < 4; i++) box(1.04, 0.035, 0.035, SM.wood, 0, 0.95, 0.18, wh).rotation.z = (i * Math.PI) / 4;
  put(wh, F.z(0.08), 0, Math.PI);
  const sk = companion(1.3, 1.6, 0.9);
  put(sk, F.z(0.2));
  for (const s of [-1, 1]) {
    const pr = pinRail(6, [0, 1, 3, 5]);
    pr.position.set(s * (at(mz + 0.8) - 0.2), F.bul - 0.1, mz + 0.8);
    g.add(pr);
    const a = anchor(2.4);
    a.position.set(s * (at(F.z(0.93)) + 0.16), F.bul + F.sheer(0.93) - 0.5, F.z(0.93) + 1.4);
    a.rotation.set(0, Math.PI, s * 1.35);
    g.add(a);
    box(0.2, 0.2, 1.3, SM.woodDark, s * (at(F.z(0.95)) + 0.1), F.bul + F.sheer(0.95) + 0.1, F.z(0.95), g).rotation.y = s * 0.9;   /* the cat head */
  }
  /* stern windows and her name board */
  for (const x of [-1.2, 0, 1.2]) box(0.7, 0.5, 0.04, solid(0x56707a, 0.25, 0.2), x, F.sheer(0) - 0.55, F.z(0) + 0.02, g);
  g.userData.F = F;
  g.userData.hatchAt = [0, F.sheer(0.5) + 0.5, hz];
  return g;
}
/* a two-decked ship of the line, seen across the harbour: two rows of gun ports, three masts with lower yards and topsail yards, the sails furled,
   the topgallant masts sent down as a guard ship's were. A general picture of a two-decker of her time. */
export function twoDecker() {
  const F = lines({ L: 50, B: 13.4, fb: 6.2, bul: 1.6, sheerF: 1.3, sheerA: 2.4, stern: 0.84, bowAt: 0.72, bluff: 3.2 }),
    g = hull(F, {
      stripe: 0, N: 26, inner: false, deck: solid(0x8a744e, 1),
      bands: [[-0.5, 1.25, OCHRE], [-2.95, 1.25, OCHRE]],
      ports: [{ y: -1.12, n: 13, s0: 0.1, s1: 0.86, w: 0.9, h: 0.8, lid: true }, { y: -3.57, n: 13, s0: 0.12, s1: 0.84, w: 0.9, h: 0.8, lid: true }, { y: 0.75, n: 5, s0: 0.08, s1: 0.32, w: 0.7, h: 0.6 }],
    }),
    at = (z) => F.half(F.s(z));
  const masts = [[F.z(0.8), 17, 0.42, [[13.5, 22], [24.5, 16]]], [F.z(0.46), 19.5, 0.46, [[15, 25], [27.5, 18]]], [F.z(0.14), 14, 0.3, [[12.8, 15], [21.2, 11]]]];
  const heads = [];
  for (const [z, h, r, yards] of masts) {
    const d = F.sheer(F.s(z));
    const m = squareMast(g, { z, h, r, yards, deck: d, top: h * 0.62, tg: 0 });
    shrouds(g, { z: z + 0.3, hounds: d + h - 0.1, n: 5, at, y0: d + F.bul, gap: 0.8, rat: 0.7, r: 0.03 });
    heads.push([z, d + h, m.userData.topHead]);
  }
  const sp = bowsprit(g, { z: F.z(1) + 0.3, y: F.sheer(1) + 0.6, len: 12, rise: 0.42, jibboom: 9, r: 0.38 });
  rope([0, heads[0][1], heads[0][0]], sp.userData.cap, 0.05, SM.tar, g);
  rope(heads[0][2], sp.userData.end, 0.035, SM.tar, g);
  rope([0, heads[1][1], heads[1][0]], [0, F.sheer(0.8) + 2.5, heads[0][0] + 1], 0.05, SM.tar, g);
  rope(heads[1][2], [0, heads[0][1], heads[0][0]], 0.035, SM.tar, g);
  rope([0, heads[2][1], heads[2][0]], [0, F.sheer(0.46) + 6, heads[1][0] + 0.6], 0.04, SM.tar, g);
  rope(heads[2][2], [0, heads[1][1], heads[1][0]], 0.03, SM.tar, g);
  rope(sp.userData.cap, [0, -F.fb + 1, F.z(1) + 0.8], 0.05, SM.tar, g);
  /* the head: the beak under the bowsprit; the stern: two rows of windows and the quarter galleries */
  spar([0, F.sheer(1) - 1.2, F.z(1) + 0.6], [0, F.sheer(1) + 0.9, F.z(1) - 4.2], 0.5, 0.16, SM.woodDark, g);
  for (const y of [1.0, -1.3]) for (let k = -3; k <= 3; k++) box(0.95, 0.9, 0.06, solid(0x5a7480, 0.25, 0.2), k * 1.35, F.sheer(0) + y - 0.6, F.z(0) + 0.04, g);
  for (const y of [1.75, -0.35, -2.5]) box(11.4, 0.22, 0.2, SM.ochre, 0, F.sheer(0) + y - 0.6, F.z(0) + 0.06, g);
  for (const s of [-1, 1]) box(1.0, 3.6, 2.6, SM.ochre, s * (F.half(0.03) + 0.2), F.sheer(0.03) - 0.4, F.z(0.03), g);
  /* boats on the booms amidships and a poop rail */
  box(2.2, 0.9, 8, SM.woodDark, 0, F.sheer(0.6) + 0.5, F.z(0.6), g);
  g.userData.F = F;
  return g;
}
/* a sheer hulk: an old ship cut down to her lower masts, with a pair of sheer legs for lifting masts in and out of other ships */
export function sheerHulk() {
  const F = lines({ L: 36, B: 10, fb: 4.2, bul: 1.2, sheerF: 0.8, sheerA: 1.4, stern: 0.82, bowAt: 0.7, bluff: 3.2 }),
    g = hull(F, { stripe: 0, N: 20, inner: false, deck: solid(0x7d6a4a, 1), bands: [[-0.5, 1.0, 0x8a7444]], ports: [{ y: -1.0, n: 9, s0: 0.12, s1: 0.84, w: 0.8, h: 0.7 }] });
  spar([0, F.sheer(0.45) - 1, F.z(0.45)], [0, F.sheer(0.45) + 15, F.z(0.45)], 0.42, 0.34, SM.spar, g);
  box(3.4, 0.14, 2.6, SM.sparDark, 0, F.sheer(0.45) + 13, F.z(0.45), g);
  /* the sheers: two long spars lashed at the head, leaning out over the side, held back by guys to the mast */
  const head = [9.5, F.sheer(0.45) + 19, F.z(0.45) + 0.5];
  for (const dz of [-5, 5]) spar([F.half(0.45) - 0.6, F.sheer(0.45), F.z(0.45) + dz], head, 0.3, 0.2, SM.spar, g);
  rope(head, [0, F.sheer(0.45) + 14.6, F.z(0.45)], 0.05, SM.tar, g);
  rope(head, [-F.half(0.45) + 0.4, F.sheer(0.45) + 1, F.z(0.45) + 3], 0.05, SM.tar, g);
  rope(head, [head[0], F.sheer(0.45) + 9, head[2]], 0.05, SM.hemp, g);
  box(0.6, 0.9, 0.5, SM.woodDark, head[0], F.sheer(0.45) + 8.6, head[2], g);   /* the great block */
  box(6, 2.4, 5, solid(0x8a7a5a, 1), 0, F.sheer(0.2) + 1.2, F.z(0.2), g);   /* a deck house */
  const rf = box(6.6, 0.16, 5.6, SM.woodDark, 0, F.sheer(0.2) + 2.5, F.z(0.2), g);
  void rf;
  return g;
}
/* the dead bullock, far off: a dark shape low in the water. Nothing more is shown. */
export function bullock() {
  const g = grp(),
    m = solid(0x4a3a2e, 0.8);
  const b = mesh(new THREE.SphereGeometry(1, 12, 8), m, 0, 0, 0, g);
  b.scale.set(1.2, 0.34, 0.62);
  return g;
}
/* a shark's back fin cutting the water: userData.noBatch, moved by the place */
export function fin(s = 1) {
  const sh = new THREE.Shape();
  sh.moveTo(-0.3, 0);
  sh.quadraticCurveTo(-0.05, 0.3, 0.16, 0.5);
  sh.quadraticCurveTo(0.2, 0.2, 0.3, 0);
  sh.lineTo(-0.3, 0);
  const o = new THREE.Mesh(new THREE.ShapeGeometry(sh, 5), solid(0x4c565e, 0.5, 0, DS));
  o.scale.setScalar(s);
  o.userData.noBatch = true;
  o.userData.water = true;
  return o;
}

/* ---------- the shark ---------- */
/* A large shark, about 3.4 m, lying on its belly. No kind of shark is recorded, so it is a plain large shark: grey above, pale below,
   a blunt pointed snout, five gill slits, a tall back fin and a tail with a long upper lobe. Head toward -z. */
export function shark(L = 3.4) {
  const g = grp(),
    k = L / 3.4,
    top = 0x68737c,
    pale = 0xdcdfd8,
    R = (z, w, h, y = 0.3, x = 0) => [x * k, y * k, z * k, w * k, h * k, top, pale],
    rings = [R(-1.7, 0.02, 0.02, 0.26), R(-1.6, 0.1, 0.07, 0.27), R(-1.42, 0.19, 0.13, 0.28), R(-1.15, 0.27, 0.2, 0.3), R(-0.8, 0.32, 0.25, 0.31), R(-0.35, 0.33, 0.27, 0.32), R(0.15, 0.29, 0.25, 0.31), R(0.6, 0.22, 0.2, 0.29, 0.03), R(1.0, 0.14, 0.14, 0.27, 0.1), R(1.3, 0.08, 0.09, 0.26, 0.2), R(1.52, 0.045, 0.06, 0.26, 0.31)],
    skin = new THREE.Mesh(loftSkin(rings, 14), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 })),
    grey = solid(0x5c676f, 0.55, 0, DS);
  g.add(skin);
  const finShape = (pts) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 2) s.quadraticCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    return new THREE.ExtrudeGeometry(s, { depth: 0.03 * k, bevelEnabled: false, curveSegments: 5 });
  };
  /* fins are drawn in the z-y plane (x is the thickness), then turned into place */
  const put = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const o = new THREE.Mesh(geo, grey);
    o.position.set(x * k, y * k, z * k);
    o.rotation.set(rx, ry, rz);
    g.add(o);
    return o;
  };
  const S = (a) => a.map((p) => [p[0] * k, p[1] * k]);
  /* shapes in x-y (x back along the body); turned so x runs along +z */
  const dorsal = finShape(S([[0, 0], [0.12, 0.3], [0.42, 0.46], [0.4, 0.2], [0.5, 0], [0.25, -0.04], [0, 0]])),
    dorsal2 = finShape(S([[0, 0], [0.04, 0.08], [0.14, 0.12], [0.14, 0.05], [0.18, 0], [0.09, -0.02], [0, 0]])),
    pect = finShape(S([[0, 0], [0.16, 0.06], [0.62, -0.08], [0.36, -0.14], [0.16, -0.2], [0.04, -0.1], [0, 0]])),
    tailUp = finShape(S([[0, 0], [0.16, 0.26], [0.5, 0.62], [0.36, 0.3], [0.2, 0.02], [0.1, -0.02], [0, 0]])),
    tailLo = finShape(S([[0, 0], [0.1, -0.12], [0.2, -0.3], [0.16, -0.12], [0.18, 0], [0.1, 0.02], [0, 0]]));
  put(dorsal, 0.015, 0.54, -0.45, 0, -Math.PI / 2);
  put(dorsal2, 0.14, 0.34, 0.98, 0, -Math.PI / 2 - 0.25);
  put(tailUp, 0.3, 0.27, 1.44, 0, -Math.PI / 2 - 0.5);
  put(tailLo, 0.3, 0.27, 1.44, 0, -Math.PI / 2 - 0.5);
  /* the side fins lie out flat on the deck */
  const pl = put(pect, 0.24, 0.14, -0.86, Math.PI / 2 - 0.1, -Math.PI / 2 + 0.9, 0),
    prt = put(pect, -0.24, 0.17, -0.86, -Math.PI / 2 + 0.1, -Math.PI / 2 - 0.9, 0);
  void pl;
  void prt;
  /* eyes and gill slits */
  for (const s of [-1, 1]) {
    mesh(new THREE.SphereGeometry(0.022 * k, 8, 6), solid(0x0c0d0e, 0.3), s * 0.168 * k, 0.33 * k, -1.42 * k, g);
    for (let i = 0; i < 5; i++) {
      const sl = box(0.008 * k, 0.15 * k, 0.012 * k, solid(0x3a4248, 0.7), s * (0.285 + i * 0.008) * k, 0.3 * k, (-1.06 + i * 0.065) * k, g);
      sl.rotation.z = s * 0.25;
      sl.rotation.x = -0.15;
    }
  }
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
}
