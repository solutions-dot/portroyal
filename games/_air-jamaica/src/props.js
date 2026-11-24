/* Small things of the airport and the plane: the boarding steps, ground gear, and what people hold. Each is a general picture of a common
   kind of object (docs/games/air-jamaica.md, "Places"); none copies a particular piece. */
import * as THREE from "three";
import { cv, std, solid, mesh, box, cyl, plane, grp } from "./gfx.js";
export const WOOD = solid(0x826247),
  CREAM = solid(0xe6dfcd),
  METAL = solid(0x737c79, 0.5, 0.4),
  STEEL = solid(0xa9aeab, 0.35, 0.7),
  BLUE = solid(0x2a58a8, 0.5),
  WHITE = solid(0xf2f0ea, 0.5),
  RUBBER = solid(0x222625, 0.9),
  ORANGE = solid(0xe27024, 0.55);
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
/* lettering on a clear panel, to lay on a side of something */
function lettering(text, w, h, fg = "#ffffff") {
  const tex = cv(768, Math.max(48, Math.round((768 * h) / w)), (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = "bold " + Math.round(H * 0.62) + "px Verdana, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2, W * 0.94);
  });
  const p = plane(w, h, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  return p;
}
/* Wheeled boarding steps in blue and white, marked "Air Jamaica" (the Gleaner of 1 May 2010 describes the steps of the first flights as
   "gleaming blue and white plane steps marked 'Air Jamaica'": the 1966 photograph is the source for the colours, a general picture of the shape).
   Local axes: the steps climb toward -z (the platform is at -z, the foot at +z), the platform's top is at y = top, the width is along x.
   Returns the group; g.userData.walls lists the footprint of the whole thing. */
export function airstairs({ top = 2.9, run = 4.6, w = 1.25, treads = 12 } = {}) {
  const g = grp();
  const rise = top / treads, step = run / treads;
  /* the two stringers (side frames): a sloping band, tall at the platform (z = 0) and meeting the ground at z = run */
  for (const s of [-1, 1]) {
    const sh = new THREE.Shape();
    sh.moveTo(0, top - 0.32);
    sh.lineTo(0, top);
    sh.lineTo(run, 0.26);
    sh.lineTo(run, 0);
    sh.closePath();
    const stringer = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.07, bevelEnabled: false }), BLUE);
    stringer.rotation.y = -Math.PI / 2; /* the shape's x runs along +z, its depth along -x */
    stringer.position.set(s * (w / 2) + (s < 0 ? 0.07 : 0), 0, 0);
    g.add(stringer);
  }
  /* treads: a pale ribbed plate on each rise, and the riser below it */
  for (let i = 0; i < treads; i++) {
    const y = top - (i + 1) * rise, z = (i + 0.5) * step;
    box(w - 0.1, 0.05, step * 0.96, WHITE, 0, y + rise - 0.025, z, g);
    for (let r = 0; r < 4; r++) box(w - 0.12, 0.012, 0.025, STEEL, 0, y + rise + 0.003, z - step * 0.3 + r * step * 0.2, g);
    box(w - 0.1, rise * 0.96, 0.03, BLUE, 0, y + rise * 0.5, z - step * 0.5 + 0.02, g);
  }
  /* the platform at the top: a deck with a rail on three sides and a low rubber bumper against the fuselage */
  box(w + 0.12, 0.09, 1.3, WHITE, 0, top - 0.05, -0.65, g);
  box(w + 0.12, 0.3, 1.3, BLUE, 0, top - 0.24, -0.65, g);
  box(w + 0.1, 0.12, 0.1, RUBBER, 0, top + 0.02, -1.3, g);
  const slope = Math.atan2(top, run), len = Math.hypot(run, top);
  for (const s of [-1, 1]) {
    const x = s * (w / 2 + 0.03);
    for (const h of [0.95, 0.5]) {
      box(0.05, 0.05, 1.3, STEEL, x, top + h, -0.65, g); /* the rail round the platform */
      const r = box(0.05, 0.05, len, STEEL, x, top / 2 + h, run / 2, g); /* the rail down the slope */
      r.rotation.x = slope;
    }
    for (let i = 0; i <= 4; i++) {
      const z = (i / 4) * run * 0.92, y = top - z * (top / run);
      box(0.04, 0.95, 0.04, STEEL, x, y + 0.475, z, g);
    }
    box(0.04, 0.95, 0.04, STEEL, x, top + 0.475, -1.2, g);
  }
  /* wheels and a hitch at the foot, a small enginey box under the platform */
  for (const s of [-1, 1]) {
    const wh = cyl(0.26, 0.26, 0.14, RUBBER, s * (w / 2 + 0.05), 0.26, run - 0.4, g, 14);
    wh.rotation.z = Math.PI / 2;
    const wh2 = cyl(0.26, 0.26, 0.14, RUBBER, s * (w / 2 + 0.05), 0.26, run * 0.45, g, 14);
    wh2.rotation.z = Math.PI / 2;
  }
  box(0.1, 0.1, 1.2, STEEL, 0, 0.3, run + 0.5, g);
  /* the name, on each stringer, climbing with the slope */
  for (const s of [-1, 1]) {
    const holder = grp(g, s * (w / 2 + 0.045), top * 0.5 + 0.1, run * 0.5);
    holder.rotation.y = s * (Math.PI / 2);
    const t = lettering("AIR JAMAICA", 2.4, 0.24, "#ffffff");
    t.rotation.z = s > 0 ? slope : -slope;
    holder.add(t);
  }
  g.userData.run = run;
  g.userData.top = top;
  g.userData.w = w;
  return g;
}
/* a wheel chock pair, a small cone, a ground power cart */
export function chock() {
  const g = grp();
  box(0.4, 0.14, 0.2, solid(0xd8a620, 0.7), 0, 0.07, 0, g);
  return g;
}
export function cone() {
  const g = grp();
  mesh(new THREE.ConeGeometry(0.17, 0.5, 12), solid(0xe86a1c, 0.6), 0, 0.28, 0, g);
  box(0.4, 0.04, 0.4, solid(0xe86a1c, 0.6), 0, 0.02, 0, g);
  box(0.2, 0.06, 0.2, WHITE, 0, 0.2, 0, g).scale.set(1.0, 1, 1);
  return g;
}
export function powerCart() {
  const g = grp();
  box(1.5, 0.9, 0.9, solid(0x4a7a5a, 0.6), 0, 0.75, 0, g);
  box(1.3, 0.12, 0.8, METAL, 0, 1.25, 0, g);
  for (const x of [-0.55, 0.55])
    for (const z of [-0.4, 0.4]) {
      const w = cyl(0.2, 0.2, 0.12, RUBBER, x, 0.2, z, g, 12);
      w.rotation.x = Math.PI / 2;
    }
  const cable = cyl(0.04, 0.04, 2.4, solid(0x1f2423, 0.8), 0.9, 0.15, 0.0, g, 6);
  cable.rotation.z = Math.PI / 2;
  return g;
}
/* what a person holds in the right hand (engine/grip.js): a clipboard (the ground man's loading sheet), or a flight bag */
export function held(kind) {
  if (kind === "clipboard") {
    const g = grp();
    box(0.3, 0.02, 0.22, solid(0x7a5a3a, 0.8), 0, 0, 0, g);
    box(0.26, 0.004, 0.18, solid(0xf0ece0, 0.9), 0, 0.012, 0, g);
    return { obj: dynamic(g), handleY: 0.0, scale: 1, lift: 0.34, straighten: 0.5, label: "clipboard" };
  }
  if (kind === "bag") {
    const g = grp();
    box(0.34, 0.2, 0.14, solid(0x23407a, 0.7), 0, -0.1, 0, g);
    box(0.2, 0.04, 0.06, solid(0x23407a, 0.7), 0, 0.03, 0, g);
    return { obj: dynamic(g), handleY: 0.03, scale: 1, lift: 0.26, straighten: 0.8, label: "flight bag" };
  }
  return null;
}
/* a thing the player picks up and carries (steps.js TASKS): none yet in chapter 1 */
export function item(id) {
  return dynamic(box(0.2, 0.2, 0.2, solid(0xd0c8b4), 0, 0.1, 0));
}
let shadow = null;
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
