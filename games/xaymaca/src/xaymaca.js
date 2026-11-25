/* The things of Maima and the bay, 1503 to 1504, drawn in code. What follows a source and what is a general picture is in
   docs/games/xaymaca.md ("Places"). The round house follows the house dug up at Maima (Burley 2022: centre pole, 4 m across, door on the
   west). The buren and the boat-shaped bowl follow the White Marl pieces found there. The caravels are a general picture of a small
   caravel of about 1500 (no plan of La Capitana or the Santiago exists), run aground side by side with straw roofs on deck (Ferdinand; Mendez). */
import * as THREE from "three";
import { cv, std, solid, mesh, box, cyl, plane, grp, rng } from "./gfx.js";
import { lines, hull, spar, rope, sail, shrouds, SM } from "./ships.js";
import { dugOut } from "../../../engine/boats.js";

const once = new Map();
const keep = (k, make) => (once.has(k) ? once.get(k) : (once.set(k, make()), once.get(k)));
export const dynamic = (o) => (o.traverse((n) => (n.userData.noBatch = true)), o);

/* ---------- surfaces ---------- */
/* thatch: grass laid in courses, the strands running down the slope */
export const thatchTex = (repeat = [4, 2]) =>
  keep("thatch" + repeat, () =>
    cv(128, 128, (x, w, h) => {
      x.fillStyle = "#9c8654";
      x.fillRect(0, 0, w, h);
      const r = rng(11);
      for (let i = 0; i < 900; i++) {
        const g = 105 + r() * 95;
        x.strokeStyle = `rgba(${g | 0},${(g * 0.86) | 0},${(g * 0.5) | 0},0.7)`;
        const px = r() * w, py = r() * h;
        x.beginPath();
        x.moveTo(px, py);
        x.lineTo(px + (r() - 0.5) * 4, py + 8 + r() * 14);
        x.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        x.fillStyle = "rgba(48,36,18,0.32)";
        x.fillRect(0, y, w, 3);
      }
    }, repeat),
  );
/* cane walls: upright canes tied with a band of vine */
export const caneTex = (repeat = [10, 1]) =>
  keep("cane" + repeat, () =>
    cv(128, 128, (x, w, h) => {
      const r = rng(5);
      for (let i = 0; i < 16; i++) {
        const g = 120 + r() * 60;
        x.fillStyle = `rgb(${g | 0},${(g * 0.84) | 0},${(g * 0.56) | 0})`;
        x.fillRect(i * 8, 0, 7, h);
        x.fillStyle = "rgba(40,30,16,0.45)";
        x.fillRect(i * 8 + 7, 0, 1, h);
      }
      for (const y of [30, 92]) {
        x.fillStyle = "rgba(70,52,26,0.9)";
        x.fillRect(0, y, w, 4);
      }
    }, repeat),
  );
/* packed earth and marl of a terrace, worn by feet: speckled, with small pebbles of limestone (no wheel ruts: there were no wheels) */
export const earthTex = (repeat = [10, 10], base = [150, 128, 96]) =>
  keep("earth" + repeat + base, () =>
    cv(256, 256, (x, w, h) => {
      x.fillStyle = `rgb(${base})`;
      x.fillRect(0, 0, w, h);
      const r = rng(21);
      for (let i = 0; i < 2600; i++) {
        const d = (r() - 0.5) * 46;
        x.fillStyle = `rgba(${base[0] + d | 0},${base[1] + d | 0},${base[2] + d * 0.8 | 0},0.5)`;
        x.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3);
      }
      for (let i = 0; i < 70; i++) {
        const g = 190 + r() * 40;
        x.fillStyle = `rgba(${g | 0},${g * 0.96 | 0},${g * 0.86 | 0},0.8)`;
        x.beginPath();
        x.ellipse(r() * w, r() * h, 1.5 + r() * 2.5, 1 + r() * 2, r() * 3, 0, 7);
        x.fill();
      }
    }, repeat),
  );
export const M = {
  thatch: () => keep("m-thatch", () => std(thatchTex(), 1)),
  cane: () => keep("m-cane", () => std(caneTex(), 0.95)),
  pole: () => keep("m-pole", () => solid(0x6e5236, 0.9)),
  clay: () => keep("m-clay", () => solid(0x9a6a48, 0.95)),
  clayDark: () => keep("m-clayd", () => solid(0x4a3426, 0.95)),
  stone: () => keep("m-stone", () => solid(0xb2aa94, 1, 0, { flatShading: true })),
  cotton: () => keep("m-cotton", () => solid(0xe2d8c0, 1)),
  casabe: () => keep("m-casabe", () => solid(0xe6d4a4, 0.95)),
  casabeTop: () => keep("m-casabe-top", () => solid(0xc9a060, 0.95)),
  gourd: () => keep("m-gourd", () => solid(0xa8884a, 0.7)),
  basket: () => keep("m-basket", () => std(caneTex([6, 1]), 1)),
  shipWood: () => keep("m-shipwood", () => solid(0x5a4632, 0.9)),
  shipDeck: () => keep("m-shipdeck", () => solid(0x8a7456, 0.95)),
  sailOld: () => keep("m-sailold", () => solid(0xc8bea2, 1, 0, { side: THREE.DoubleSide })),
};

/* ---------- the round house (Burley 2022, House 10) ---------- */
/* r: radius (2 m: 4 m across). The door is a gap in the wall on the house's -x side: turn the house so it faces west. */
export function roundHouse(r = 2, { h = 1.7, seed = 1, door = true, hammock = true } = {}) {
  const g = grp(),
    gap = door ? 0.5 : 0,   /* half the door's angle */
    wall = new THREE.CylinderGeometry(r, r, h, 28, 1, true, Math.PI * 1.5 + gap, Math.PI * 2 - gap * 2);
  mesh(wall, M.cane(), 0, h / 2, 0, g).material.side = THREE.DoubleSide;
  /* the roof: a tall cone of thatch, lapping out past the wall, with a little cap of bound grass at the peak */
  const roofH = r * 1.35,
    roof = mesh(new THREE.ConeGeometry(r + 0.45, roofH, 28, 3, true), M.thatch(), 0, h + roofH / 2 - 0.05, 0, g);
  roof.material.side = THREE.DoubleSide;
  cyl(0.18, 0.05, 0.4, M.thatch(), 0, h + roofH - 0.02, 0, g, 10);
  /* the centre pole, and the ring beam it carries */
  cyl(0.08, 0.1, h + roofH - 0.2, M.pole(), 0, (h + roofH - 0.2) / 2, 0, g, 8);
  const ring = mesh(new THREE.TorusGeometry(r - 0.02, 0.05, 5, 28), M.pole(), 0, h, 0, g);
  ring.rotation.x = Math.PI / 2;
  /* door posts */
  if (door) for (const s of [-1, 1]) cyl(0.06, 0.07, h + 0.1, M.pole(), -r * Math.cos(gap) , (h + 0.1) / 2, s * r * Math.sin(gap), g, 6);
  /* inside: a cotton hammock slung from the centre pole to the wall, a pot and a mat */
  if (hammock) {
    const hm = mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.5, 10, 1, true, Math.PI, Math.PI), M.cotton(), 0.85, 0.75, 0.25, g);
    hm.rotation.set(0, 0.3, Math.PI / 2);
    hm.material.side = THREE.DoubleSide;
    for (const [ax, az, bx, bz] of [[0.1, 0.0, 0.1, 0.05], [1.62, 0.5, 1.6, 0.5]]) rope([ax, 1.3, az], [bx + 0.0, 0.85, bz + 0.0], 0.008, SM.hemp, g);
    const mat = box(0.9, 0.012, 0.6, M.basket(), -0.6, 0.006, 0.7, g);
    mat.rotation.y = 0.4;
    const p = pot(0.18);
    p.position.set(0.6, 0, -1.2);
    g.add(p);
  }
  g.userData.r = r;
  return g;
}

/* ---------- pots, the buren, baskets ---------- */
/* a round-bodied cooking pot, coil built, with a notched rim (White Marl style, Burley 2022) */
export function pot(r = 0.2, m = M.clay()) {
  const g = grp(),
    pts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    pts.push(new THREE.Vector2(r * (0.35 + 0.65 * Math.sin(Math.PI * (0.15 + 0.7 * t))) + (t > 0.9 ? r * 0.06 : 0), t * r * 1.5));
  }
  const body = mesh(new THREE.LatheGeometry(pts, 14), m, 0, 0, 0, g);
  body.material.side = THREE.DoubleSide;
  const rim = mesh(new THREE.TorusGeometry(pts[10].x, r * 0.05, 4, 16), M.clayDark(), 0, r * 1.5, 0, g);
  rim.rotation.x = Math.PI / 2;
  return g;
}
/* a boat-shaped bowl with raised ends (Burley 2022, after Rodney-Harrack) */
export function boatBowl(L = 0.36) {
  const g = grp(),
    b = mesh(new THREE.SphereGeometry(1, 14, 7, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.clay(), 0, 0.09, 0, g);
  b.scale.set(L / 2, 0.09, L / 3.4);
  b.material.side = THREE.DoubleSide;
  for (const s of [-1, 1]) {
    const e = cyl(0.02, 0.035, 0.07, M.clayDark(), s * L * 0.5, 0.11, 0, g, 8);
    e.rotation.z = -s * 0.6;
  }
  return g;
}
/* a cake of casabe: flat and round, pale, browned on top */
export function casabe(r = 0.2) {
  const g = grp();
  cyl(r, r, 0.016, M.casabe(), 0, 0.008, 0, g, 20);
  cyl(r * 0.96, r * 0.96, 0.002, M.casabeTop(), 0, 0.017, 0, g, 20);
  return g;
}
/* the buren: a thick clay griddle about half a metre across on three hearth stones, a low fire under it, a cake baking on top.
   userData.cake is the cake (it turns over in the look-shot); userData.fire is the glow to flicker */
export function buren() {
  const g = grp();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.3,
      s = mesh(new THREE.DodecahedronGeometry(0.15, 0), M.stone(), Math.cos(a) * 0.24, 0.12, Math.sin(a) * 0.24, g);
    s.scale.set(1, 1.2, 0.9);
  }
  cyl(0.29, 0.27, 0.05, M.clay(), 0, 0.3, 0, g, 24);
  cyl(0.285, 0.285, 0.004, M.clayDark(), 0, 0.327, 0, g, 24);
  /* embers and small sticks under the griddle */
  const ember = solid(0xd8642a, 0.6, 0, { emissive: new THREE.Color(0xff6a20), emissiveIntensity: 1.4 });
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1;
    box(0.3, 0.035, 0.035, M.pole(), Math.cos(a) * 0.06, 0.05, Math.sin(a) * 0.06, g).rotation.y = a;
  }
  const glowBed = cyl(0.12, 0.14, 0.04, ember, 0, 0.04, 0, g, 10);
  const light = new THREE.PointLight(0xff8a3a, 0.9, 3.2, 1.6);
  light.position.set(0, 0.2, 0);
  g.add(light);
  const cake = dynamic(casabe(0.2));
  cake.position.set(0, 0.33, 0);
  g.add(cake);
  g.userData.cake = cake;
  g.userData.fire = { bed: glowBed, light };
  return g;
}
/* a round open basket of woven cane, with a few cakes of casabe in it (n = 0 for empty) */
export function basket(n = 4, r = 0.26) {
  const g = grp(),
    b = mesh(new THREE.CylinderGeometry(r, r * 0.8, r * 0.85, 16, 1, true), M.basket(), 0, r * 0.425, 0, g);
  b.material = b.material.clone();
  b.material.side = THREE.DoubleSide;
  cyl(r * 0.8, r * 0.8, 0.01, M.basket(), 0, 0.005, 0, g, 16);
  const rim = mesh(new THREE.TorusGeometry(r, 0.014, 4, 18), M.pole(), 0, r * 0.85, 0, g);
  rim.rotation.x = Math.PI / 2;
  for (let i = 0; i < n; i++) {
    const c = casabe(r * 0.72);
    c.position.set(0, r * 0.55 + i * 0.02, 0);
    c.rotation.set(0.05 * (i % 2 ? 1 : -1), i, 0);
    g.add(c);
  }
  return g;
}
/* a calabash for water: a dried gourd with a stopper of corn husk and a cord */
export function calabash() {
  const g = grp(),
    b = mesh(new THREE.SphereGeometry(0.11, 14, 10), M.gourd(), 0, 0.11, 0, g);
  b.scale.set(1, 0.95, 1);
  const n = mesh(new THREE.SphereGeometry(0.055, 10, 8), M.gourd(), 0, 0.235, 0, g);
  n.scale.set(1, 1.2, 1);
  cyl(0.022, 0.026, 0.05, M.casabe(), 0, 0.3, 0, g, 8);
  const c = mesh(new THREE.TorusGeometry(0.06, 0.006, 4, 12), SM.hemp, 0, 0.27, 0, g);
  c.rotation.x = Math.PI / 2;
  return g;
}
/* a dugout canoe from the engine, in a darker wood */
export function canoe(L = 5.5, o = {}) {
  return dugOut({ L, beam: 0.8, depth: 0.45, ...o });
}
/* cassava growing in mounds: a stem and a few hand-shaped leaves on each */
export function cassavaMound(seed = 1) {
  const g = grp(),
    r = rng(seed);
  const soil = mesh(new THREE.SphereGeometry(0.42, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), solid(0x7a5236, 1), 0, -0.05, 0, g);
  soil.scale.y = 0.55;
  const leaf = keep("m-cassava-leaf", () => solid(0x4f7a34, 0.9, 0, { side: THREE.DoubleSide }));
  for (let k = 0; k < 2; k++) {
    const x = (r() - 0.5) * 0.25, z = (r() - 0.5) * 0.25, h = 0.9 + r() * 0.5;
    cyl(0.015, 0.02, h, solid(0x8a6a50, 0.9), x, h / 2, z, g, 5);
    for (let i = 0; i < 4; i++) {
      const a = r() * Math.PI * 2, y = h * (0.65 + r() * 0.35);
      for (let f = -2; f <= 2; f++) {
        const p = plane(0.05, 0.22, leaf, x + Math.cos(a) * 0.12, y, z + Math.sin(a) * 0.12, g);
        p.rotation.set(-0.9, a + f * 0.35, 0);
      }
    }
  }
  return g;
}

/* a rack of sticks with fish laid to dry in the sun (fish bones far outnumber all others at Maima, Burley 2022) */
export function fishRack() {
  const g = grp();
  for (const x of [-0.9, 0.9]) for (const z of [-0.3, 0.3]) cyl(0.03, 0.035, 1.0, M.pole(), x, 0.5, z, g, 5);
  for (const z of [-0.3, 0.3]) box(1.9, 0.04, 0.04, M.pole(), 0, 1.0, z, g);
  for (let i = 0; i < 7; i++) box(0.035, 0.03, 0.7, M.pole(), -0.8 + i * 0.27, 1.03, 0, g);
  const fishM = keep("m-fish", () => solid(0x9a8c78, 0.6, 0.1));
  for (let i = 0; i < 6; i++) {
    const f = mesh(new THREE.SphereGeometry(0.1, 8, 5), fishM, -0.7 + i * 0.28, 1.08, (i % 2 ? 0.1 : -0.1), g);
    f.scale.set(0.45, 0.18, 1.6);
  }
  return g;
}
/* a cotton fishing net hung over two posts, with stone sinkers along its foot (a net sinker was found at Maima) */
export function hungNet() {
  const g = grp(),
    tex = cv(64, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = "rgba(200,190,160,0.95)"; x.lineWidth = 2; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 8, 0); x.lineTo(i * 8, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 8); x.lineTo(w, i * 8); x.stroke(); } }, [6, 3]);
  const net = mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 1 }), 0, 0.9, 0, g);
  net.userData.noGrain = true;
  for (const x of [-1.15, 1.15]) cyl(0.04, 0.05, 1.6, M.pole(), x, 0.8, 0, g, 5);
  for (let i = 0; i < 8; i++) mesh(new THREE.DodecahedronGeometry(0.035, 0), M.stone(), -1.0 + i * 0.28, 0.33, 0, g);
  return g;
}

/* ---------- the caravels ---------- */
/* A small caravel of about 1500, about 21 m long: a round stern with a high sterncastle, a low forecastle, square sails on the fore and
   main masts and a lateen yard on the mizzen. aground: run ashore, low in the water, with straw roofs over the waist and castles and the
   sails gone (Ferdinand: "sheds were erected on the decks and the poops and forecastles"; Mendez: "two cabins thatched with straw").
   Without aground she is a ship under sail (the rescue ship of June 1504, also a general picture). */
export function caravel({ aground = true, sails = !aground, seed = 1, shores = [-1, 1], L = 21, B = 6.4, band = null, torn = true } = {}) {
  /* L, B: length and beam (La Capitana the larger, the Santiago smaller: no plan of either exists); band: a colour for a painted band below the rail (the two
     ships told apart at a glance); torn: a strip of old sail left on the main yard */
  const F = lines({ L, B, fb: 1.8 * L / 21, bul: 0.75, sheerF: 1.0 * L / 21, sheerA: 1.6 * L / 21, stern: 0.86, bowAt: 0.62, bluff: 2.2 });
  const g = hull(F, { stripe: band ? 0.28 : 0, stripeColor: band || undefined, N: 26, deck: M.shipDeck(), inner: 0x4c3a28, bands: [[-0.5 - (band ? 0.3 : 0), 0.12, 0x3a2a1c], [-1.2, 0.1, 0x3a2a1c]] });
  const deckY = (s) => F.sheer(s);
  /* the sterncastle and forecastle: decks raised over the stern and the bow, with rails */
  const sc0 = F.z(0.0), sc1 = F.z(0.28), fc0 = F.z(0.84), fc1 = F.z(1.0);
  const castle = (z0, z1, w, h, y) => {
    const c = grp();
    box(w, h, Math.abs(z1 - z0), M.shipWood(), 0, y + h / 2, (z0 + z1) / 2, c);
    box(w + 0.1, 0.08, Math.abs(z1 - z0) + 0.1, M.shipDeck(), 0, y + h + 0.04, (z0 + z1) / 2, c);
    for (const s of [-1, 1]) box(0.08, 0.5, Math.abs(z1 - z0), M.shipWood(), s * (w / 2), y + h + 0.3, (z0 + z1) / 2, c);
    g.add(c);
    return y + h;
  };
  const scTop = castle(sc0, sc1, F.half(0.12) * 1.75, 1.7, deckY(0.1));
  const fcTop = castle(fc0, fc1 + 1.2, F.half(0.9) * 1.6, 1.1, deckY(0.9));
  const masts = [];
  const mast = (z, h, r) => {
    const m = cyl(r * 0.7, r, h, SM.spar, 0, deckY(F.s(z)) + h / 2, z, g, 10);
    masts.push(m);
    return deckY(F.s(z)) + h;
  };
  const mz = F.z(0.52), fz = F.z(0.8), zz = F.z(0.2);
  const mainTop = mast(mz, aground ? 12.5 : 14, 0.24),
    foreTop = mast(fz, aground ? 9.5 : 10.5, 0.18),
    mizTop = mast(zz, 8.4, 0.14);
  /* yards: the main and fore yards across, the mizzen's lateen yard slanting fore and aft */
  /* aground, the yards are braced round (swung toward fore and aft), so two ships lying board and board do not foul each other's yards */
  const brace = aground ? 0.62 : 0, yard = (L, y, z, r0, r1) => spar([-L * Math.cos(brace), y, z - L * Math.sin(brace)], [L * Math.cos(brace), y, z + L * Math.sin(brace)], r0, r1, SM.spar, g);
  yard(5.2, mainTop - 2.0, mz, 0.11, 0.07);
  yard(3.8, foreTop - 1.6, fz, 0.09, 0.06);
  spar([0, mizTop - 4.8, zz + 3.2], [0, mizTop + 1.4, zz - 3.8], 0.08, 0.05, SM.spar, g);
  /* the bowsprit */
  spar([0, deckY(1) + 0.9, F.z(1) + 0.6], [0, deckY(1) + 2.4, F.z(1) - 5.2], 0.14, 0.09, SM.spar, g);
  /* standing rigging: shrouds to the sides, stays fore and aft */
  const at = (z) => F.half(F.s(z));
  for (const [z, top] of [[mz, mainTop - 1.6], [fz, foreTop - 1.2], [zz, mizTop - 1.2]]) shrouds(g, { z: z + 0.2, hounds: top, n: 3, at, y0: F.bul + deckY(F.s(z)), gap: 0.5, rat: 0.45 });
  rope([0, mainTop - 1.2, mz], [0, foreTop - 0.4, fz + 0.4], 0.02, SM.tar, g);
  rope([0, foreTop - 1.0, fz], [0, deckY(1) + 2.3, F.z(1) - 4.6], 0.02, SM.tar, g);
  if (sails) {
    sail([[-5.0, mainTop - 2.1, mz - 0.1], [5.0, mainTop - 2.1, mz - 0.1], [5.6, deckY(0.52) + 2.4, mz - 0.6], [-5.6, deckY(0.52) + 2.4, mz - 0.6]], 0.45, g, 6);
    sail([[-3.6, foreTop - 1.7, fz - 0.1], [3.6, foreTop - 1.7, fz - 0.1], [4.0, deckY(0.8) + 2.2, fz - 0.5], [-4.0, deckY(0.8) + 2.2, fz - 0.5]], 0.4, g, 6);
    sail([[0, mizTop + 1.3, zz - 3.7], [0, mizTop - 4.6, zz + 3.1], [0, deckY(0.2) + 2.6, zz - 0.4], [0, deckY(0.2) + 2.6, zz - 0.4]], 0.3, g, 5);
  } else if (torn) {
    /* sails gone; a strip of old canvas still bent to the main yard, torn */
    const t = mesh(new THREE.PlaneGeometry(3.2, 1.2, 6, 2), M.sailOld(), -1.2, mainTop - 2.7, mz + 0.05, g);
    t.rotation.z = 0.08;
  }
  if (aground) {
    /* straw roofs over the waist and on the castles: ridged sheds on poles */
    const shed = (z0, z1, w, y, h) => {
      const s = grp(),
        L = Math.abs(z1 - z0),
        zc = (z0 + z1) / 2;
      for (const x of [-w / 2 + 0.1, w / 2 - 0.1]) for (const z of [z0, zc, z1]) cyl(0.05, 0.06, h, M.pole(), x, y + h / 2, z, s, 5);
      for (const sd of [-1, 1]) {
        const r = box(w / 2 + 0.5, 0.1, L + 0.6, M.thatch(), sd * (w / 4 + 0.05), y + h + 0.42, zc, s);
        r.rotation.z = -sd * 0.55;
      }
      box(0.2, 0.18, L + 0.7, M.thatch(), 0, y + h + 0.82, zc, s);
      g.add(s);
    };
    shed(F.z(0.3), F.z(0.48), F.half(0.4) * 1.7, deckY(0.4), 1.7);
    shed(F.z(0.56), F.z(0.78), F.half(0.66) * 1.6, deckY(0.66), 1.6);
    shed(sc0 + 0.6, sc1 - 1.0, F.half(0.12) * 1.5, scTop, 1.4);
    shed(fc0 - 0.4, fc1 + 1.4, F.half(0.9) * 1.2, fcTop, 1.2);
    /* (Ferdinand: shored up on both sides. The shores are under the water here, so they are not drawn: drawn, their tips stood out of the sea as stubs along her side.) */
  }
  /* the stern: a round stern with a rudder */
  box(0.18, F.fb + 1.2, 1.0, M.shipWood(), 0, -F.fb / 2 + 0.3, F.z(0) + 0.45, g);
  g.userData.F = F;
  g.userData.deckTop = scTop;
  return g;
}

/* ---------- the moon, for the eclipse ---------- */
/* A disc that faces the camera. k from 0 (full, white) to 1 (in the Earth's shadow, a dull red) and back: the shadow comes in from one edge
   as a soft round edge, as an eclipse does (the umbra is about 2.6 times the moon's width). */
export function eclipseMoon(R = 6) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { k: { value: 0 }, glow: { value: 1 } },
    transparent: true,
    depthWrite: false,
    fog: false,
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: `varying vec2 vUv; uniform float k; uniform float glow;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec2 p=vUv*2.0-1.0; float r=length(p); if(r>1.0) discard;
        float maria=0.82+0.18*smoothstep(0.2,0.8,hash(floor(p*5.0+3.0)))*0.6 - 0.12*smoothstep(0.55,0.0,length(p-vec2(-0.25,0.2))) - 0.1*smoothstep(0.4,0.0,length(p-vec2(0.3,-0.1)));
        vec3 white=vec3(0.98,0.96,0.88)*maria;
        // the shadow's centre moves across from the left; 'cover' is how deep in the shadow this point is
        float sx=mix(-3.6,0.0,clamp(k,0.0,1.0)); float d=length(p-vec2(sx,0.15*(1.0-k)))-2.6;
        float cover=smoothstep(0.35,-0.35,d);
        vec3 red=vec3(0.55,0.16,0.08)*maria*(0.7+0.3*(1.0-r));
        vec3 col=mix(white,red,cover);
        float edge=smoothstep(1.0,0.96,r);
        gl_FragColor=vec4(col*glow,edge);
      }`,
  });
  const m = new THREE.Mesh(new THREE.CircleGeometry(R, 40), mat);
  m.userData.noBatch = true;
  m.userData.far = true;
  m.renderOrder = -1;
  m.onBeforeRender = (r, s, cam) => { m.quaternion.copy(cam.quaternion); m.updateMatrixWorld(); };   /* always a round disc, from any camera */
  return m;
}

/* ---------- Navassa ---------- */
/* a low island of bare rock "about half a league in circumference, without either spring or tree" (Ferdinand) */
export function navassa() {
  const g = grp(),
    r = rng(3),
    geo = new THREE.SphereGeometry(1, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    p.setY(i, Math.min(y, 0.55) + (r() - 0.5) * 0.06);
  }
  geo.computeVertexNormals();
  const m = mesh(geo, solid(0x2a2826, 1, 0, { flatShading: true }), 0, -0.2, 0, g);
  m.scale.set(60, 18, 34);
  return g;
}
