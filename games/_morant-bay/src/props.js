/* Small things of the 1770s: what the player carries, what people hold, and the things the story looks at.
   Every one is a reconstruction of a common kind of object; none copies a museum piece. */
import * as THREE from "three";
import { marketBasket } from "./period-props.js";
import { cv, std, solid, mesh, box, cyl, plane, grp } from "./gfx.js";
import { candleFlame } from "../../../engine/flame.js";
import { fodder, cask } from "./scenery.js";
export const WOOD = solid(0x826247),
  WOOD_DARK = solid(0x4a3626, 0.9),
  PAPER = solid(0xe7dcc2),
  IRON = solid(0x2b2d31, 0.6, 0.3),
  BRASS = solid(0xb8963c, 0.35, 0.8),
  SILVER = solid(0xc9c9c2, 0.3, 0.85);
/* something that moves or is switched on and off: kept out of the place's merged scenery */
export function dynamic(o) {
  o.traverse((n) => (n.userData.noBatch = true));
  return o;
}
export function label(text, w = 2, h = 0.4, bg = "#e7dcc2", fg = "#2b2620", font = "bold") {
  const tex = cv(768, Math.max(64, Math.round((768 * h) / w)), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = font + " " + Math.round(H * 0.5) + "px Georgia, serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2, W * 0.92);
  });
  return plane(w, h, std(tex));
}
export function table(w = 2, d = 1, h = 0.8, m = WOOD_DARK) {
  const g = grp();
  for (const x of [-w * 0.42, w * 0.42]) for (const z of [-d * 0.38, d * 0.38]) box(0.08, h, 0.08, m, x, h / 2, z, g);
  box(w, 0.06, d, m, 0, h, 0, g);
  return g;
}
/* a folded letter with a red wax seal */
export function letter() {
  const g = grp();
  box(0.2, 0.012, 0.13, PAPER, 0, 0.006, 0, g);
  cyl(0.018, 0.018, 0.006, solid(0x9a1f1a, 0.5), 0, 0.015, 0, g, 10);
  return dynamic(g);
}
/* a written sheet: a few lines of ink, and a title that can be read close up */
export function sheet(text = "", w = 0.3, d = 0.22) {
  const g = grp();
  box(w, 0.006, d, PAPER, 0, 0.003, 0, g);
  if (text) {
    const p = label(text, w * 0.94, d * 0.9, "#e8ddc4");
    p.rotation.x = -Math.PI / 2;
    p.position.y = 0.0065;
    g.add(p);
  }
  return dynamic(g);
}
/* a wooden pail with iron hoops and a rope handle, water near the top */
export function pail() {
  return dynamic(woodBucket(true));   /* staves and iron hoops, as the well's own bucket */
}
/* a pocket watch: a round silver or gold case, a pale face, a short chain */
export function watch(gold = false) {
  const g = grp(),
    m = gold ? BRASS : SILVER;
  cyl(0.025, 0.025, 0.012, m, 0, 0.006, 0, g, 14);
  cyl(0.02, 0.02, 0.002, solid(0xf2ecdc, 0.4), 0, 0.013, 0, g, 12);
  cyl(0.005, 0.005, 0.012, m, 0, 0.006, -0.03, g, 6);
  for (let i = 0; i < 5; i++) mesh(new THREE.TorusGeometry(0.006, 0.0018, 4, 8), m, 0.004 * (i % 2), 0.003, -0.042 - i * 0.011, g).rotation.x = Math.PI / 2;
  return g;
}
/* a long gun of the time: a flintlock musket, plain */
export function musket() {
  const g = grp();
  box(0.05, 0.11, 0.36, WOOD_DARK, 0, 0, -0.18, g).rotation.x = 0.16;
  box(0.045, 0.055, 0.74, WOOD_DARK, 0, 0.03, 0.26, g);
  const b = cyl(0.012, 0.014, 1.0, IRON, 0, 0.065, 0.5, g, 8);
  b.rotation.x = Math.PI / 2;
  box(0.03, 0.05, 0.07, IRON, 0.03, 0.07, 0.02, g);
  return g;
}
/* a soldier's long gun of 1865, held upright at the order, its butt by the right foot: a general picture of the percussion rifle-musket of
   the time (the Enfield pattern of 1853), stock, barrel, bands and ramrod. Origin: the butt; it stands along +y, about 1.4 m. */
export function rifleMusket() {
  const g = grp(),
    STEEL = solid(0x3a3c40, 0.45, 0.6);
  box(0.045, 0.32, 0.11, WOOD_DARK, 0, 0.16, 0, g);
  box(0.04, 0.8, 0.05, WOOD_DARK, 0, 0.72, 0.02, g);
  cyl(0.009, 0.011, 1.02, STEEL, 0, 0.86, 0.045, g, 7);
  for (const y of [0.55, 0.8, 1.05]) box(0.05, 0.02, 0.07, STEEL, 0, y, 0.03, g);
  box(0.03, 0.05, 0.03, STEEL, 0.02, 0.36, 0.05, g);
  return dynamic(g);
}
/* a walking staff */
export function staff() {
  const g = grp();
  cyl(0.016, 0.02, 1.35, WOOD, 0, 0.675, 0, g, 6);
  return g;
}
export function ledger() {
  const g = grp();
  box(0.3, 0.05, 0.22, solid(0x4a2f24, 0.8), 0, 0.025, 0, g);
  box(0.27, 0.04, 0.2, PAPER, 0.012, 0.025, 0, g);
  return dynamic(g);
}
/* a horn lantern of the 1770s, as carried in a house or by searchers at night (not the glass hurricane lantern of a century later): a round
   tin base, four tin posts, panes of thin horn that glow amber round a tallow candle, a cone of pierced tin over them with a little chimney,
   and a ring to carry or hang it by. Its origin is the bottom centre; userData.handleY is the top of the ring. */
const TIN = new THREE.MeshStandardMaterial({ color: 0x8d8a82, roughness: 0.55, metalness: 0.6 }),
  HORN = new THREE.MeshStandardMaterial({ color: 0xe0b46a, emissive: 0xb86a1c, emissiveIntensity: 0.9, roughness: 0.6, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
export function lantern() {
  const g = grp();
  cyl(0.075, 0.08, 0.025, TIN, 0, 0.0125, 0, g, 16);
  mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.19, 16, 1, true), HORN, 0, 0.12, 0, g);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    box(0.012, 0.2, 0.012, TIN, Math.cos(a) * 0.07, 0.12, Math.sin(a) * 0.07, g);
  }
  for (const y of [0.03, 0.215]) mesh(new THREE.TorusGeometry(0.07, 0.005, 5, 18), TIN, 0, y, 0, g).rotation.x = Math.PI / 2;
  cyl(0.012, 0.012, 0.07, solid(0xeee4c8, 0.8), 0, 0.06, 0, g, 8);   /* the candle */
  { const f = candleFlame({ seed: 5, s: 0.9, glowSize: 0.1 }); f.position.y = 0.095; g.add(f); }   /* its flame, seen through the horn (engine/flame.js) */
  const cone = mesh(new THREE.CylinderGeometry(0.018, 0.074, 0.075, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x8d8a82, roughness: 0.55, metalness: 0.6, side: THREE.DoubleSide }), 0, 0.255, 0, g);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    box(0.008, 0.008, 0.002, solid(0xffc070, 0.4), Math.cos(a) * 0.05, 0.25, Math.sin(a) * 0.05, g).rotation.y = -a + Math.PI / 2;   /* light through the piercings */
  }
  cyl(0.02, 0.02, 0.025, TIN, 0, 0.305, 0, g, 10);
  const ring = mesh(new THREE.TorusGeometry(0.022, 0.004, 5, 14), TIN, 0, 0.34, 0, g);
  cone.userData.noBatch = ring.userData.noBatch = true;
  g.userData.handleY = 0.36;
  return dynamic(g);
}
/* a tin cup with a handle, open at the top: one lathe for the wall and floor, both faces drawn. Origin: the bottom centre. */
export function tinCup() {
  const g = grp(),
    m = new THREE.MeshStandardMaterial({ color: 0x9a9a94, roughness: 0.45, metalness: 0.6, side: THREE.DoubleSide }),
    V = (r, y) => new THREE.Vector2(r, y);
  mesh(new THREE.LatheGeometry([V(0.001, 0), V(0.034, 0), V(0.036, 0.004), V(0.04, 0.078), V(0.042, 0.082), V(0.037, 0.08), V(0.034, 0.008), V(0.001, 0.006)], 18), m, 0, 0, 0, g);
  const h = mesh(new THREE.TorusGeometry(0.022, 0.004, 5, 10, Math.PI), m, 0.04, 0.045, 0, g);
  h.rotation.z = -Math.PI / 2;
  return g;
}
/* a well bucket of wooden staves with two iron hoops and an iron bail, open at the top with water inside. Origin: the bottom centre. */
export function woodBucket(water = true) {
  const g = grp(),
    staves = new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 0.95, side: THREE.DoubleSide }),
    V = (r, y) => new THREE.Vector2(r, y);
  mesh(new THREE.LatheGeometry([V(0.001, 0.02), V(0.13, 0.02), V(0.13, 0), V(0.135, 0), V(0.162, 0.27), V(0.15, 0.27), V(0.124, 0.03), V(0.001, 0.03)], 20), staves, 0, 0, 0, g);
  for (const [y, r] of [[0.05, 0.139], [0.22, 0.157]]) mesh(new THREE.TorusGeometry(r, 0.006, 5, 22), IRON, 0, y, 0, g).rotation.x = Math.PI / 2;
  const bail = mesh(new THREE.TorusGeometry(0.16, 0.006, 5, 16, Math.PI), IRON, 0, 0.25, 0, g);
  if (water) {
    const w = mesh(new THREE.CircleGeometry(0.148, 20), new THREE.MeshStandardMaterial({ color: 0x3a5a66, roughness: 0.15, metalness: 0.1 }), 0, 0.22, 0, g);
    w.rotation.x = -Math.PI / 2;
  }
  bail.userData.noBatch = true;
  g.userData.handleY = 0.41;
  return g;
}
/* what a person holds in the right hand (main.js holdThing): the thing, where its handle is, and how the arm carries it */
export function held(kind) {
  if (kind === "lantern") {
    const obj = lantern();
    return { obj, handleY: obj.userData.handleY || 0.32, scale: 1, lift: 0.34, straighten: 0.6, label: "lantern" };
  }
  if (kind === "pail") {
    const obj = pail();
    return { obj, handleY: obj.userData.handleY || 0.49, scale: 0.9, lift: 0.3, straighten: 0.85, label: "pail" };
  }
  if (kind === "musket") return { obj: rifleMusket(), handleY: 0.8, scale: 1, lift: 0.04, straighten: 0.95, label: "rifle-musket" };
  if (kind === "staff") return { obj: dynamic(staff()), handleY: 1.0, scale: 1, lift: 0.5, straighten: 0.4, label: "staff" };
  if (kind === "ledger") return { obj: ledger(), handleY: 0.06, scale: 1, lift: 0.36, straighten: 0.3, label: "ledger" };
  return null;
}
/* a thing the player picks up and carries (steps.js TASKS) */
export function item(id) {
  if (id === "pail") return pail();
  if (id === "jar") {
    /* a country water jar of red clay: round, a short neck, a lip */
    const g = grp(),
      clay = solid(0x9a5a3a, 0.9),
      V = (r, y) => new THREE.Vector2(r, y);
    mesh(new THREE.LatheGeometry([V(0.001, 0), V(0.09, 0.005), V(0.15, 0.09), V(0.16, 0.17), V(0.13, 0.27), V(0.06, 0.32), V(0.055, 0.37), V(0.07, 0.385), V(0.045, 0.385), V(0.04, 0.33)], 18), clay, 0, 0, 0, g);
    g.userData.handleY = 0.36;
    return dynamic(g);
  }
  if (id === "basket") return dynamic(marketBasket(0xb08a48));
  if (id === "letter" || id === "warrant") return letter();
  if (id === "watch") return dynamic(watch(true));
  if (id === "lantern") return lantern();
  if (id === "fodder") return dynamic(fodder());
  if (id === "cask") return dynamic(cask());
  if (id === "peg") {
    /* a boundary peg with a red rag */
    const g = grp();
    cyl(0.03, 0.02, 0.9, WOOD, 0, 0.45, 0, g, 6);
    box(0.22, 0.12, 0.012, solid(0xb03a2a, 1), 0.12, 0.8, 0, g);
    return dynamic(g);
  }
  if (id === "stone") {
    const g = grp();
    mesh(new THREE.IcosahedronGeometry(0.11, 0), solid(0xa8a294, 1, 0, { flatShading: true }), 0, 0.08, 0, g).scale.y = 0.7;
    return dynamic(g);
  }
  return sheet("");
}
let shadow;
export function shadowTexture() {
  return (
    shadow ||
    (shadow = cv(64, 64, (x) => {
      const a = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      a.addColorStop(0, "rgba(25,29,25,.6)");
      a.addColorStop(1, "rgba(25,29,25,0)");
      x.fillStyle = a;
      x.fillRect(0, 0, 64, 64);
    }))
  );
}
/* a round felt riding hat of the 1770s, as plain travellers wore it uncocked: a wide brim turned up a little at the edge, a low round crown
   that is hollow and open underneath (one lathe, both faces drawn, so it reads right from below and when it hangs on a peg), and a dark
   band. Its brim lies on y = 0 and the crown rises along +y. */
export function feltHat(color = 0x6e5a46, band = 0x2e241e) {
  const g = grp(),
    felt = new THREE.MeshStandardMaterial({ color, roughness: 1, side: THREE.DoubleSide }),
    V = (r, y) => new THREE.Vector2(r, y);
  /* the profile, outside first (crown top, crown side, brim top, the turned edge), then back along the inside (brim under, crown inside) */
  const pts = [V(0.001, 0.116), V(0.06, 0.114), V(0.084, 0.108), V(0.092, 0.095), V(0.094, 0.012), V(0.12, 0.007), V(0.17, 0.006), V(0.19, 0.014), V(0.198, 0.022), V(0.2, 0.016), V(0.186, 0.004), V(0.16, -0.003), V(0.12, -0.003), V(0.086, 0.0), V(0.083, 0.09), V(0.076, 0.101), V(0.055, 0.106), V(0.001, 0.108)];
  mesh(new THREE.LatheGeometry(pts, 28), felt, 0, 0, 0, g);
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.0955, 0.0958, 0.018, 28, 1, true), new THREE.MeshStandardMaterial({ color: band, roughness: 0.9, side: THREE.DoubleSide }));
  b.position.y = 0.024;
  g.add(b);
  return g;
}
