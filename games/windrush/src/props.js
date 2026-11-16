/* Reconstructed household and travel props. No archive image is embedded. */
import * as THREE from "three";
import {
  cv,
  std,
  solid,
  mesh,
  box,
  cyl,
  plane,
  grp,
  batchStatic,
} from "./gfx.js";
import {
  suitcase as oldCase,
  bucket as oldBucket,
  boardHouse,
} from "./period-props.js";
export const WOOD = solid(0x826247),
  PAPER = solid(0xe7dcc2),
  DARK = solid(0x344340),
  METAL = solid(0x78827f, 0.45, 0.3);
export function dynamic(o) {
  o.traverse((n) => (n.userData.noBatch = true));
  return o;
}
export function label(text, w = 2, h = 0.4, bg = "#e7dcc2", fg = "#263e45") {
  const tex = cv(768, Math.max(64, Math.round((768 * h) / w)), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = "bold " + Math.round(H * 0.55) + "px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2, W * 0.94);
  });
  return plane(w, h, std(tex));
}
export function table(w = 2, d = 1, h = 0.8) {
  const g = grp();
  for (const x of [-w * 0.4, w * 0.4])
    for (const z of [-d * 0.35, d * 0.35])
      box(0.075, h, 0.075, WOOD, x, h / 2, z, g);
  box(w, 0.07, d, WOOD, 0, h, 0, g);
  return g;
}
export function paper(text = "A family letter", colour = "#e8ddc4") {
  const g = grp();
  box(0.31, 0.009, 0.23, PAPER, 0, 0.008, 0, g);
  const p = label(text, 0.29, 0.21, colour);
  p.rotation.x = -Math.PI / 2;
  p.position.y = 0.014;
  g.add(p);
  return dynamic(g);
}
export function photo() {
  const tex = cv(256, 192, (x, W, H) => {
    x.fillStyle = "#dad0b5";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#7c8e79";
    x.fillRect(10, 10, W - 20, H - 20);
    x.fillStyle = "#a39172";
    x.fillRect(25, 75, 205, 95);
    for (const [cx, cy, r] of [
      [80, 58, 19],
      [155, 58, 19],
      [117, 95, 14],
    ]) {
      x.fillStyle = "#76563f";
      x.beginPath();
      x.arc(cx, cy, r, 0, 7);
      x.fill();
      x.fillStyle = "#e0cfac";
      x.fillRect(cx - r, cy + r, r * 2, 60);
    }
    x.fillStyle = "#31433f";
    x.font = "14px serif";
    x.fillText("Our family · Jamaica", 22, 182);
  });
  const g = grp();
  box(0.34, 0.012, 0.25, WOOD, 0, 0.006, 0, g);
  const p = plane(0.32, 0.24, std(tex));
  p.rotation.x = -Math.PI / 2;
  p.position.y = 0.014;
  g.add(p);
  return dynamic(g);
}
export function book() {
  const g = grp();
  box(0.28, 0.045, 0.2, solid(0x335c73), 0, 0.025, 0, g);
  box(0.25, 0.035, 0.185, PAPER, 0.012, 0.025, 0, g);
  return dynamic(g);
}
export function cloth(hanging = false) {
  const g = grp();
  box(
    0.36,
    hanging ? 0.6 : 0.055,
    hanging ? 0.018 : 0.25,
    solid(0xc1d5d1),
    0,
    hanging ? -0.28 : 0.03,
    0,
    g,
  );
  return dynamic(g);
}
export function openCase() {
  const g = grp();
  const mat = solid(0x72513a);
  box(0.9, 0.04, 0.5, mat, 0, 0.02, 0, g);
  for (const x of [-0.45, 0.45]) box(0.025, 0.12, 0.5, mat, x, 0.06, 0, g);
  for (const z of [-0.25, 0.25]) box(0.9, 0.12, 0.025, mat, 0, 0.06, z, g);
  const lid = box(0.9, 0.5, 0.025, mat, 0, 0.34, -0.3, g);
  lid.rotation.x = -0.3;
  return g;
}
export function schoolbag() {
  const g = grp();
  const m = solid(0x586c7a);
  box(0.55, 0.04, 0.32, m, 0, 0.02, 0, g);
  for (const x of [-0.275, 0.275]) box(0.025, 0.11, 0.32, m, x, 0.06, 0, g);
  for (const z of [-0.16, 0.16]) box(0.55, 0.11, 0.025, m, 0, 0.06, z, g);
  for (const x of [-0.18, 0.18]) {
    const strap = box(0.025, 0.4, 0.025, WOOD, x, 0.29, -0.22, g);
    strap.rotation.x = -0.3;
  }
  return g;
}
export function caseProp() {
  return dynamic(oldCase(0x77553d));
}
export function bucket() {
  return dynamic(oldBucket());
}
export function cup() {
  const g = grp();
  cyl(0.065, 0.05, 0.13, solid(0xd8dfd4), 0, 0.065, 0, g, 12);
  return dynamic(g);
}
export function board() {
  const g = grp();
  box(0.75, 0.06, 0.15, WOOD, 0, 0.03, 0, g);
  return dynamic(g);
}
export function folder() {
  const g = grp();
  box(0.43, 0.025, 0.31, solid(0xb28f63), 0, 0.015, 0, g);
  const p = label("IRIS · FAMILY PAPERS", 0.39, 0.27, "#b28f63");
  p.rotation.x = -Math.PI / 2;
  p.position.y = 0.03;
  g.add(p);
  return dynamic(g);
}
export function item(id) {
  if (id === "bucket") return bucket();
  if (["cloth", "packCloth"].includes(id)) return cloth(false);
  if (["slat", "board"].includes(id)) return board();
  if (id === "photo") return photo();
  if (id === "case") return caseProp();
  if (id === "book") return book();
  if (id === "cup") return cup();
  if (id === "folder") return folder();
  const names = {
    address: "Our family address",
    route: "Atlantic crossing",
    letter: "Dear Pearl",
    order: "Postal order",
    envelope: "To Pearl, Jamaica",
    brownLetter: "Please contact us",
    schoolRecord: "School record · Iris",
    workRecord: "Work record · Iris",
    oldLetter: "A letter from 1948",
  };
  return paper(
    names[id] || "Family papers",
    id === "brownLetter" ? "#b89b74" : "#e8ddc4",
  );
}
export function radio() {
  const g = grp();
  box(0.75, 0.42, 0.28, WOOD, 0, 0.21, 0, g);
  box(0.4, 0.28, 0.014, solid(0xb4aa89), -0.12, 0.23, 0.147, g);
  for (const x of [0.16, 0.28])
    cyl(0.045, 0.045, 0.025, DARK, x, 0.14, 0.16, g, 12).rotation.x =
      Math.PI / 2;
  return g;
}
export function postbox() {
  const g = grp();
  cyl(0.35, 0.38, 1.55, solid(0x9e302d), 0, 0.775, 0, g, 18);
  cyl(0.4, 0.35, 0.15, solid(0x9e302d), 0, 1.62, 0, g, 18);
  box(0.31, 0.07, 0.04, DARK, 0, 1.18, 0.35, g);
  const p = label("POST", 0.25, 0.18, "#e9dfc4");
  p.position.set(0, 0.94, 0.373);
  g.add(p);
  return g;
}
export function caseStack() {
  const g = grp();
  for (let i = 0; i < 4; i++) {
    const s = oldCase([0x6c513d, 0x8a7556][i % 2]);
    s.position.set((i % 2) * 0.7, Math.floor(i / 2) * 0.35, 0);
    g.add(s);
  }
  return g;
}
export function line(parent, a, b, material = METAL, r = 0.012) {
  const p = new THREE.Vector3(...a),
    q = new THREE.Vector3(...b),
    d = q.clone().sub(p);
  const o = cyl(
    r,
    r,
    d.length(),
    material,
    ...p.clone().add(q).multiplyScalar(0.5).toArray(),
    parent,
    6,
  );
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return o;
}
export function doubleDecker() {
  const g = grp();
  const red = solid(0x96362e);
  box(2.35, 3.9, 8, red, 0, 2.35, 0, g);
  const glass = solid(0x6f9296, 0.35);
  for (const side of [-1, 1])
    for (const y of [2, 3.7])
      for (let i = 0; i < 6; i++)
        box(0.025, 0.85, 0.92, glass, side * 1.19, y, -2.7 + i * 1.08, g);
  for (const y of [2, 3.7]) box(1.8, 0.85, 0.025, glass, 0, y, 4.03, g);
  for (const x of [-1.12, 1.12])
    for (const z of [-2.6, 2.7]) {
      const w = cyl(0.47, 0.47, 0.24, DARK, x, 0.48, z, g, 16);
      w.rotation.z = Math.PI / 2;
    }
  const sign = label("BRIXTON", 1.8, 0.28, "#222b2b", "#e6ddbe");
  sign.position.set(0, 4.33, 4.04);
  g.add(sign);
  return g;
}
export function ship() {
  const g = grp(),
    hull = solid(0xe2e2d6),
    buff = solid(0xc6a765),
    black = solid(0x343b3c),
    deck = solid(0x9c8b6a),
    glass = solid(0x546d70, 0.45),
    white = solid(0xece9dd);
  // Tapered ends and a rounded bilge, preserving the two-funnel liner silhouette.
  const sections = [
      [-72, 0.2],
      [-67, 5.8],
      [-55, 9.6],
      [-40, 10],
      [40, 10],
      [58, 8.3],
      [69, 4.8],
      [74, 0.2],
    ],
    rings = [];
  const verts = [],
    indices = [];
  for (const [x, r] of sections) {
    const ring = [];
    for (let k = 0; k < 9; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 8;
      ring.push(verts.length / 3);
      verts.push(x, -3 + 8 * Math.sin(a), r * (k >= 4 ? 1 : Math.cos(a)));
    }
    for (let k = 8; k >= 0; k--) {
      const a = -Math.PI / 2 + (k * Math.PI) / 8;
      ring.push(verts.length / 3);
      verts.push(x, -3 + 8 * Math.sin(a), -r * (k >= 4 ? 1 : Math.cos(a)));
    }
    rings.push(ring);
  }
  for (let j = 1; j < rings.length; j++)
    for (let k = 0; k < rings[j].length; k++) {
      const n = (k + 1) % rings[j].length;
      indices.push(
        rings[j - 1][k],
        rings[j][k],
        rings[j][n],
        rings[j - 1][k],
        rings[j][n],
        rings[j - 1][n],
      );
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, hull);
  body.material.side = THREE.DoubleSide;
  g.add(body);
  box(118, 0.3, 18.6, deck, 0, 5.1, 0, g);
  box(100, 3.7, 15.7, white, 2, 7, 0, g);
  box(82, 3.1, 13.8, white, 3, 10.4, 0, g);
  box(67, 0.28, 14.3, deck, 2, 12.1, 0, g);
  box(17, 3.2, 13.6, white, -32, 13.65, 0, g);
  for (const z of [-8.01, 8.01])
    for (let x = -45; x <= 47; x += 2.3) {
      cyl(0.37, 0.37, 0.045, black, x, 7.5, z, g, 10).rotation.x = Math.PI / 2;
      cyl(0.29, 0.29, 0.046, black, x, 2.6, z * 1.16, g, 10).rotation.x =
        Math.PI / 2;
    }
  for (const z of [-6.98, 6.98])
    for (let x = -35; x <= 35; x += 2.6)
      box(1.25, 0.8, 0.025, glass, x, 10.4, z, g);
  for (const x of [-32, -8, 19, 43])
    for (const z of [-7.5, 7.5]) {
      const boat = mesh(
        new THREE.SphereGeometry(1, 12, 6),
        white,
        x,
        12.9,
        z,
        g,
      );
      boat.scale.set(5.2, 0.9, 1.4);
      for (const dx of [-3.2, 3.2])
        line(g, [x + dx, 12.2, z * 0.76], [x + dx, 14.8, z], METAL, 0.08);
    }
  for (const x of [-13, 19]) {
    cyl(2.5, 2.9, 8.5, buff, x, 17, 0, g, 20);
    cyl(2.53, 2.53, 1.5, black, x, 21.5, 0, g, 20);
  }
  for (const x of [-49, 49]) {
    cyl(0.18, 0.27, 26, WOOD, x, 17.5, 0, g, 10);
    line(g, [x, 28, 0], [x - 12, 12, -7], DARK, 0.022);
    line(g, [x, 28, 0], [x + 12, 12, 7], DARK, 0.022);
  }
  for (const z of [-9.1, 9.1]) {
    for (let x = -55; x <= 55; x += 2.5)
      box(0.05, 1, 0.05, METAL, x, 5.7, z, g);
    line(g, [-56, 6.2, z], [56, 6.2, z], METAL, 0.035);
    line(g, [-56, 5.8, z], [56, 5.8, z], METAL, 0.025);
  }
  for (const z of [-10.06, 10.06]) {
    const name = label("EMPIRE WINDRUSH", 16, 1.2, "#e2e2d6", "#273333");
    name.position.set(-48, 3.6, z);
    if (z < 0) name.rotation.y = Math.PI;
    g.add(name);
  }
  batchStatic(g);
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
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
