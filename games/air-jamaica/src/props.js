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
/* Wheeled boarding steps in blue and white, marked "Air Jamaica" (the Gleaner of 1 May 2010 describes the steps of the first flights as "gleaming blue
   and white plane steps marked 'Air Jamaica'"; the shape is a general picture of the towed passenger steps of the time). One truck: a chassis on four
   wheels, a frame tower under the platform, the flight of steps between solid blue side panels, white ribbed treads, a handrail each side that runs
   parallel to the stairs on posts standing on the side panels and carries on round the platform, and a rubber bumper where the platform meets the plane.
   Local axes: the steps climb toward -z (the platform is at -z, the foot at +z), the platform's top is at y = top, the width is along x. */
export function airstairs({ top = 2.9, run = 4.6, w = 1.25, treads = 12 } = {}) {
  const g = grp();
  const rise = top / treads, step = run / treads, PZ = 1.3; /* the platform is PZ deep, from z -PZ to z 0 */
  /* the chassis: a beam each side under the whole length, cross members, the frame tower that carries the platform */
  const cy = 0.42, wheelR = 0.21, FOOT = 0.5, beamEnd = run - 2.4 * step; /* FOOT: the side panels' top edge at the foot of the steps */
  for (const sx of [-1, 1]) box(0.12, 0.16, beamEnd + PZ + 0.1, METAL, sx * (w / 2 - 0.08), cy, (beamEnd - PZ - 0.1) / 2, g);
  for (const z of [-PZ + 0.1, -0.2, beamEnd * 0.5, beamEnd - 0.06]) box(w - 0.1, 0.1, 0.1, METAL, 0, cy, z, g);
  for (const sx of [-1, 1]) for (const z of [-PZ + 0.12, -0.12]) box(0.1, top - cy - 0.2, 0.1, BLUE, sx * (w / 2 - 0.08), cy + (top - cy - 0.2) / 2, z, g);
  for (const z of [-PZ + 0.12, -0.12]) { const x = box(w - 0.2, 0.06, 0.06, METAL, 0, (top + cy) / 2, z, g); x.rotation.z = 0.0; }
  for (const sx of [-1, 1]) { const d = box(0.05, Math.hypot(PZ - 0.24, top - cy - 0.3), 0.05, METAL, sx * (w / 2 - 0.08), (top + cy) / 2, -PZ / 2, g); d.rotation.x = Math.atan2(PZ - 0.24, top - cy - 0.3); }
  /* four wheels under the chassis, on axles, inside its width */
  for (const z of [-PZ + 0.35, beamEnd - 0.3]) {
    const ax = cyl(0.04, 0.04, w - 0.05, METAL, 0, wheelR, z, g, 8); ax.rotation.z = Math.PI / 2;
    box(w - 0.2, cy - wheelR, 0.08, METAL, 0, (cy + wheelR) / 2, z, g); /* the axle's hanger up to the chassis */
    for (const sx of [-1, 1]) {
      const t = cyl(wheelR, wheelR, 0.16, RUBBER, sx * (w / 2 - 0.12), wheelR, z, g, 18); t.rotation.z = Math.PI / 2;
      const hub = cyl(wheelR * 0.5, wheelR * 0.5, 0.17, METAL, sx * (w / 2 - 0.12), wheelR, z, g, 12); hub.rotation.z = Math.PI / 2;
    }
  }
  /* the two side panels: a sloping blue band from the platform down to the chassis at the foot */
  for (const sx of [-1, 1]) {
    const sh = new THREE.Shape();
    sh.moveTo(0, top - 0.34); sh.lineTo(0, top + 0.02); sh.lineTo(run + 0.05, FOOT); sh.lineTo(run + 0.05, 0.12); sh.lineTo(beamEnd, cy - 0.08); sh.closePath();
    const panel = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false }), BLUE);
    panel.rotation.y = -Math.PI / 2;
    panel.position.set(sx * (w / 2) + (sx < 0 ? 0.06 : 0), 0, 0);
    g.add(panel);
  }
  /* the treads: a ribbed white plate on each step and a blue riser under its front edge */
  for (let i = 0; i < treads - 1; i++) {
    const yT = top - (i + 1) * rise, z = (i + 0.5) * step + step * 0.5;
    if (yT < 0.18) break;
    box(w - 0.14, 0.05, step * 0.98, WHITE, 0, yT - 0.025, z, g);
    for (let r = 0; r < 4; r++) box(w - 0.16, 0.012, 0.022, STEEL, 0, yT + 0.003, z - step * 0.32 + r * step * 0.21, g);
    box(w - 0.14, rise, 0.03, BLUE, 0, yT + rise / 2 - 0.025, z - step * 0.49, g);
  }
  /* the platform: a white ribbed deck on a blue skirt, the bumper at its front */
  box(w + 0.02, 0.08, PZ, WHITE, 0, top - 0.04, -PZ / 2, g);
  for (let r = 0; r < 6; r++) box(w - 0.04, 0.012, 0.022, STEEL, 0, top + 0.004, -PZ + 0.12 + r * 0.21, g);
  box(w + 0.02, 0.26, PZ, BLUE, 0, top - 0.21, -PZ / 2, g);
  box(w + 0.04, 0.12, 0.1, RUBBER, 0, top - 0.04, -PZ - 0.03, g);
  /* the handrails: posts standing on each side panel's top edge, a top rail 0.95 m over the nosings and a middle rail, both parallel to the stairs, and
     the same two rails carried level round the sides of the platform */
  const nose = (z) => top - (z / run) * top; /* the line of the nosings */
  for (const sx of [-1, 1]) {
    const x = sx * (w / 2 + 0.035);
    for (const h of [0.95, 0.5]) {
      const r = box(0.045, 0.045, Math.hypot(run, top - FOOT), STEEL, x, (top + FOOT) / 2 + h, run / 2, g);
      r.rotation.x = Math.atan2(top - FOOT, run);
      box(0.045, 0.045, PZ, STEEL, x, top + h, -PZ / 2, g);
    }
    for (const z of [-PZ + 0.05, -0.6, 0]) box(0.045, 0.95, 0.045, STEEL, x, top + 0.475, z, g);
    for (let i = 1; i <= 4; i++) {
      const z = (i / 4.4) * run, y0 = nose(z) * (1 - 0.0) + (cy + 0.2) * (z / run) * 0 + 0.02;
      const base = top - (z / run) * (top - FOOT) + 0.02, h = 0.95;
      box(0.045, h, 0.045, STEEL, x, base + h / 2, z, g);
      void y0;
    }
  }
  /* the name, on each side panel, climbing with the slope */
  const panelSlope = Math.atan2(top - FOOT, run);
  for (const sx of [-1, 1]) {
    const holder = grp(g, sx * (w / 2 + 0.065), (top + FOOT) / 2 - 0.16, run * 0.5);
    holder.rotation.y = sx * (Math.PI / 2);
    const t = lettering("AIR JAMAICA", 2.4, 0.22, "#ffffff");
    t.rotation.z = sx > 0 ? panelSlope : -panelSlope;
    holder.add(t);
  }
  g.userData.run = run;
  g.userData.top = top;
  g.userData.w = w;
  g.userData.platform = PZ;
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
    /* carried as people carry one at their side: gripped by its top edge, hanging upright along the leg, the sheet held flat to the board
       (owner, 25 November 2026: it was held flat like a tray, the fist on top of it) */
    box(0.22, 0.31, 0.014, solid(0x7a5a3a, 0.8), 0, 0.155, 0, g);
    box(0.19, 0.25, 0.02, solid(0xf0ece0, 0.9), 0, 0.14, 0, g);
    box(0.08, 0.03, 0.026, solid(0x9a9e9c, 0.4, 0.6), 0, 0.29, 0, g);
    return { obj: dynamic(g), handleY: 0.29, scale: 1, lift: 0.14, straighten: 0.6, hangs: true, label: "clipboard" };
  }
  if (kind === "bag") {
    const g = grp();
    box(0.34, 0.2, 0.14, solid(0x23407a, 0.7), 0, -0.1, 0, g);
    box(0.2, 0.04, 0.06, solid(0x23407a, 0.7), 0, 0.03, 0, g);
    return { obj: dynamic(g), handleY: 0.03, scale: 1, lift: 0.26, straighten: 0.8, label: "flight bag" };
  }
  return null;
}
/* a stewardess's flight bag, standing on the ground (the 1969 advertisement: one at each crew member's feet; owner, 26 November 2026: "the shape of
   their bags looks a bit different"): a soft holdall, not a box. Seen end on, a flat base and straight sides that round over into an arched top; cream
   with pale piping round each end, two strap handles arching over the ridge, a dark zip along the top and a small dark clasp. Its long side runs along z. */
export function flightBag() {
  const g = grp(), W = 0.21, H = 0.31, L = 0.38, r = W / 2, body = solid(0xe4dccb, 0.75), pipe = solid(0xf6f2e8, 0.6), dark = solid(0x4a3a2c, 0.5);
  const sh = new THREE.Shape();   /* the end panel: base, sides, arched top */
  sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0); sh.lineTo(W / 2, H - r); sh.absarc(0, H - r, r, 0, Math.PI, false); sh.lineTo(-W / 2, 0);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: L - 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 3, curveSegments: 14 });
  geo.translate(0, 0, -(L - 0.03) / 2);
  const bag = new THREE.Mesh(geo, body); bag.castShadow = true; g.add(bag);
  const edge = new THREE.Path(); edge.moveTo(W / 2 + 0.01, 0.01); edge.lineTo(W / 2 + 0.01, H - r); edge.absarc(0, H - r, r + 0.01, 0, Math.PI, false); edge.lineTo(-W / 2 - 0.01, 0.01);
  const pts = edge.getPoints(24).map((p) => new THREE.Vector3(p.x, p.y, 0));
  for (const z of [-L / 2 - 0.004, L / 2 + 0.004]) {   /* the piping round each end */
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.007, 6, false), pipe); t.position.z = z; g.add(t);
  }
  box(0.012, 0.006, L * 0.9, dark, 0, H + 0.016, 0, g);   /* the zip along the ridge */
  for (const z of [-0.075, 0.075]) {   /* two strap handles over the top, from side to side */
    const hnd = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.009, 6, 16, Math.PI), pipe);
    hnd.position.set(0, H - 0.02, z);
    g.add(hnd);
  }
  box(0.04, 0.03, 0.008, dark, 0, H * 0.55, L / 2 + 0.012, g);   /* the clasp on the end */
  box(0.004, 0.05, 0.035, solid(0xe0662b, 0.6), W / 2 + 0.013, 0.2, 0.12, g);   /* a small orange tag */
  return dynamic(g);
}
/* a stewardess's printed scarf, folded and carried over the forearm (the 1969 advertisement "They put a little bit of Jamaica in a whole lot of plane":
   every stewardess in the line has one over her arm; the 1969 postcard shows one worn round the neck). Cream silk printed with orange, red and gold
   flowers and teardrops, a red border at each end. Built in its own frame: x along the forearm, y up, the fold over the arm at the origin, one end
   hanging in front of the arm (z+) and the longer end behind it (z-). placeScarf() sets it on the forearm every frame. */
let scarfTex = null;
export function scarf(seed = 0) {
  scarfTex = scarfTex || cv(256, 512, (x, W, H) => {
    let r = 7; const R = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    x.fillStyle = "#f2e2bd"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) {   /* teardrops (paisley) and five-petal flowers, scattered */
      const px = R() * W, py = R() * H, s = 9 + R() * 16, c = ["#d2451e", "#e8a21a", "#8a3a1a", "#c8262e", "#e9761f"][i % 5];
      x.save(); x.translate(px, py); x.rotate(R() * 6.28); x.fillStyle = c;
      if (i % 2) { x.beginPath(); x.arc(0, 0, s * 0.55, 0, Math.PI * 2); x.moveTo(0, -s); x.quadraticCurveTo(s * 0.9, -s * 0.2, 0, s * 0.55); x.quadraticCurveTo(-s * 0.9, -s * 0.2, 0, -s); x.fill(); x.fillStyle = "#f2e2bd"; x.beginPath(); x.arc(0, s * 0.05, s * 0.2, 0, 7); x.fill(); }
      else { for (let k = 0; k < 5; k++) { x.beginPath(); x.ellipse(Math.cos(k * 1.256) * s * 0.42, Math.sin(k * 1.256) * s * 0.42, s * 0.3, s * 0.18, k * 1.256, 0, 7); x.fill(); } x.fillStyle = "#f5c64a"; x.beginPath(); x.arc(0, 0, s * 0.18, 0, 7); x.fill(); }
      x.restore();
    }
    for (const y0 of [0, H - 26]) { x.fillStyle = "#b8301c"; x.fillRect(0, y0, W, 26); x.fillStyle = "#e8a21a"; x.fillRect(0, y0 + (y0 ? 4 : 18), W, 4); }
  });
  const r = 0.05, front = 0.3, back = 0.42, w = 0.24, prof = [];   /* the cloth's line across the arm: down the front, over the top, down the back */
  for (let i = 0; i <= 8; i++) prof.push([r + 0.012 * (i / 8) ** 2, -front * (1 - i / 8)]);   /* front end, hanging, flaring a little at the bottom */
  for (let i = 1; i < 12; i++) { const a = (i / 12) * Math.PI; prof.push([r * Math.cos(a), r * Math.sin(a)]); }   /* over the forearm */
  for (let i = 0; i <= 10; i++) prof.push([-r - 0.016 * (i / 10) ** 2, -back * (i / 10)]);   /* back end */
  const len = [0]; for (let i = 1; i < prof.length; i++) len.push(len[i - 1] + Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]));
  const N = 6, pos = [], uv = [], idx = [];
  for (let j = 0; j <= N; j++) for (let i = 0; i < prof.length; i++) {
    const u = j / N, hang = Math.max(0, -prof[i][1]), wav = Math.sin(u * Math.PI * 2 + seed + i * 0.15) * 0.008 * hang * 3;   /* the hanging ends ripple a little */
    pos.push((u - 0.5) * w * (1 - 0.18 * hang), prof[i][1], prof[i][0] + wav); uv.push(u, len[i] / len[len.length - 1]);
  }
  const P = prof.length; for (let j = 0; j < N; j++) for (let i = 0; i < P - 1; i++) { const a = j * P + i, b = a + P; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: scarfTex, roughness: 0.55, side: THREE.DoubleSide }));
  m.name = "Scarf"; m.castShadow = true; m.userData.noSurface = true;
  return dynamic(m);
}
/* lays the scarf over a forearm: at the fold, 55 cm of the way from elbow to wrist, its ends hanging straight down whatever the arm does */
const _e = new THREE.Vector3(), _w = new THREE.Vector3(), _x = new THREE.Vector3(), _z = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _m4 = new THREE.Matrix4();
export function placeScarf(sc, body, side = "Left") {
  const el = body.getObjectByName("mixamorig" + side + "ForeArm"), wr = body.getObjectByName("mixamorig" + side + "Hand"); if (!el || !wr) return;
  el.getWorldPosition(_e); wr.getWorldPosition(_w);
  _x.copy(_w).sub(_e).setY(0); if (_x.lengthSq() < 1e-6) _x.set(0, 0, 1); _x.normalize(); _z.copy(_x).cross(_up).normalize();
  _m4.makeBasis(_x, _up, _z); sc.quaternion.setFromRotationMatrix(_m4);
  sc.position.copy(_e).lerp(_w, 0.55); sc.position.y += 0.012;
  if (sc.parent) sc.parent.worldToLocal(sc.position);
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
