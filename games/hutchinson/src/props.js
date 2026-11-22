/* Small things of the 1770s: what the player carries, what people hold, and the things the story looks at.
   Every one is a reconstruction of a common kind of object; none copies a museum piece. */
import * as THREE from "three";
import { cv, std, solid, mesh, box, cyl, plane, grp } from "./gfx.js";
import { bucket as tinBucket, lantern as stormLantern } from "./period-props.js";
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
  const g = tinBucket(0x8a6a48);
  g.traverse((o) => {
    if (o.isMesh && o.material.metalness > 0.3 && o.material.color.getHex() === 0x8a6a48) o.material = solid(0x8a6a48, 0.9);
  });
  return dynamic(g);
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
/* a horn lantern with a candle: a tin frame, a warm glow */
export function lantern() {
  return dynamic(stormLantern());
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
  if (kind === "staff") return { obj: dynamic(staff()), handleY: 1.0, scale: 1, lift: 0.5, straighten: 0.4, label: "staff" };
  if (kind === "ledger") return { obj: ledger(), handleY: 0.06, scale: 1, lift: 0.36, straighten: 0.3, label: "ledger" };
  return null;
}
/* a thing the player picks up and carries (steps.js TASKS) */
export function item(id) {
  if (id === "pail") return pail();
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
