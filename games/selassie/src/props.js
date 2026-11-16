/* Period props are game-only. Photographs are references, never textures. */
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { cv, std, solid, flat, mesh, box, cyl, plane, grp } from "./gfx.js";
export const WOOD = solid(0x836044),
  DARK = solid(0x37443d),
  METAL = solid(0x737c79, 0.5, 0.4),
  PAPER = solid(0xe5d5b5),
  CREAM = solid(0xe6dfcd);
export function dynamic(root) {
  root.traverse((o) => {
    o.userData.noBatch = true;
  });
  return root;
}
export function label(text, w = 2, h = 0.45, bg = "#ded3ae", fg = "#283a35") {
  const t = cv(768, Math.round((768 * h) / w), (x, W, H) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = fg;
    x.font = "700 " + Math.round(H * 0.55) + "px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, W / 2, H / 2, W * 0.94);
  });
  return plane(w, h, std(t, 1));
}
export function table(w = 2, d = 1) {
  const g = grp();
  for (const x of [-w * 0.4, w * 0.4])
    for (const z of [-d * 0.36, d * 0.36])
      box(0.08, 0.74, 0.08, WOOD, x, 0.37, z, g);
  box(w, 0.09, d, WOOD, 0, 0.78, 0, g);
  return g;
}
export function chair() {
  const g = grp();
  for (const x of [-0.24, 0.24])
    for (const z of [-0.22, 0.22]) box(0.06, 0.55, 0.06, WOOD, x, 0.275, z, g);
  box(0.6, 0.06, 0.6, WOOD, 0, 0.56, 0, g);
  for (const x of [-0.24, 0.24]) box(0.06, 0.75, 0.06, WOOD, x, 0.86, -0.23, g);
  const slat = box(0.54, 0.11, 0.05, WOOD, 0, 1.1, -0.23, g);
  slat.rotation.z = 0.13;
  g.userData.slat = slat;
  return dynamic(g);
}
export function tin() {
  const g = grp();
  box(0.34, 0.16, 0.25, solid(0x708783, 0.5, 0.5), 0, 0.08, 0, g);
  const hinge = grp(g, 0, 0.16, -0.125);
  box(0.36, 0.025, 0.27, solid(0x82938a, 0.5, 0.5), 0, 0, 0.125, hinge);
  g.userData.lid = hinge;
  return dynamic(g);
}
export function card(kind) {
  const g = grp(),
    w = kind === "paper" ? 0.38 : 0.18,
    h = kind === "paper" ? 0.5 : 0.25;
  box(w, 0.008, h, PAPER, 0, 0.005, 0, g);
  const t = cv(256, 384, (x, W, H) => {
    x.fillStyle = kind === "ticket" ? "#dcc69a" : "#e5d9b8";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#37483c";
    x.textAlign = "center";
    x.font = "bold 22px serif";
    x.fillText(
      kind === "ticket"
        ? "PALISADOES"
        : kind === "paper"
          ? "NEWS FROM AFRICA"
          : "HAILE SELASSIE I",
      W / 2,
      35,
      W - 14,
    );
    if (kind === "photo") {
      x.fillStyle = "#625c45";
      x.beginPath();
      x.ellipse(128, 140, 38, 50, 0, 0, 7);
      x.fill();
      x.fillRect(94, 180, 68, 100);
    } else {
      for (let i = 0; i < 8; i++)
        x.fillRect(22, 95 + i * 22, W - 44, i === 0 ? 5 : 3);
    }
    x.font = "12px sans-serif";
    x.fillText(
      kind === "ticket" ? "21 APR 1966" : "Game reconstruction",
      W / 2,
      H - 20,
    );
  });
  const p = plane(w * 0.95, h * 0.95, std(t), 0, 0.011, 0, g);
  p.rotation.x = -Math.PI / 2;
  return dynamic(g);
}
export function bottle() {
  const g = grp();
  cyl(0.045, 0.05, 0.23, solid(0x708c6a, 0.3), 0, 0.115, 0, g, 10);
  cyl(0.018, 0.023, 0.07, solid(0x708c6a, 0.3), 0, 0.26, 0, g, 8);
  cyl(0.024, 0.024, 0.022, solid(0x897756), 0, 0.302, 0, g, 8);
  return dynamic(g);
}
export function lunch() {
  const g = grp();
  box(0.23, 0.1, 0.17, solid(0xd9b989), 0, 0.05, 0, g);
  box(0.015, 0.103, 0.175, solid(0xa38c65), 0, 0.05, 0, g);
  box(0.235, 0.103, 0.014, solid(0xa38c65), 0, 0.05, 0, g);
  return dynamic(g);
}
export function thread() {
  const g = grp();
  cyl(0.038, 0.038, 0.07, solid(0x33796f), 0, 0.045, 0, g, 12);
  for (const y of [0.006, 0.087]) cyl(0.05, 0.05, 0.014, WOOD, 0, y, 0, g, 12);
  return dynamic(g);
}
export function bag() {
  const g = grp();
  const b = mesh(
    new THREE.SphereGeometry(0.25, 12, 8),
    solid(0x9f7951),
    0,
    0.18,
    0,
    g,
  );
  b.scale.set(1.3, 0.8, 0.7);
  const h = mesh(
    new THREE.TorusGeometry(0.13, 0.018, 5, 16, Math.PI),
    WOOD,
    0,
    0.33,
    0,
    g,
  );
  return dynamic(g);
}
export function cup() {
  const g = grp();
  cyl(0.045, 0.037, 0.085, CREAM, 0, 0.0425, 0, g, 10);
  return dynamic(g);
}
export function sewingMachine() {
  const g = grp();
  box(0.7, 0.055, 0.38, DARK, 0, 0.04, 0, g);
  box(0.12, 0.3, 0.1, DARK, 0.23, 0.19, 0, g);
  box(0.48, 0.1, 0.12, DARK, 0, 0.34, 0, g);
  box(0.05, 0.21, 0.05, DARK, -0.22, 0.21, 0, g);
  mesh(
    new THREE.TorusGeometry(0.12, 0.017, 6, 16),
    DARK,
    0.33,
    0.27,
    0,
    g,
  ).rotation.y = Math.PI / 2;
  return g;
}
export function flag() {
  const g = grp();
  cyl(0.018, 0.018, 2.5, WOOD, 0, 1.25, 0, g, 6);
  for (let i = 0; i < 3; i++)
    box(
      0.65,
      0.18,
      0.008,
      solid([0x3f8151, 0xe0b546, 0xb84438][i]),
      0.325,
      2.32 - i * 0.18,
      0,
      g,
    );
  return paintedProp(g);
}
export function bus() {
  const g = grp();
  box(2.3, 1.5, 7.7, solid(0xe3d7ad), 0, 1.7, 0, g);
  box(2.32, 0.6, 7.72, solid(0x356e5d), 0, 1.18, 0, g);
  box(2.2, 0.18, 7.6, solid(0xc3b991), 0, 2.52, 0, g);
  for (const sx of [-1, 1])
    for (let i = 0; i < 6; i++)
      box(
        0.02,
        0.6,
        0.65,
        solid(0x567d83, 0.4),
        sx * 1.16,
        1.98,
        -2.8 + i * 0.95,
        g,
      );
  box(2, 0.65, 0.04, solid(0x668b8d, 0.4), 0, 1.97, 3.87, g);
  for (const x of [-1.14, 1.14])
    for (const z of [-2.45, 2.5]) {
      const w = cyl(0.43, 0.43, 0.21, solid(0x282b27), x, 0.44, z, g, 16);
      w.rotation.z = Math.PI / 2;
      const hub = cyl(0.2, 0.2, 0.22, METAL, x, 0.44, z, g, 12);
      hub.rotation.z = Math.PI / 2;
    }
  const sign = label("PALISADOES", 1.4, 0.22, "#284b3f", "#eee0b7");
  sign.position.set(0, 2.38, 3.9);
  g.add(sign);
  return g;
}
export { dc6 as aircraft } from "./aircraft.js";
/* Boarding steps rolled to the aircraft's rear door: a top platform level with the door sill (`sill`), then `n` equal steps down to the
   apron, about 21 cm high and 26 cm deep, with stringers, handrails and wheels. Local axes: the platform starts at z = -0.62 (the door)
   and ends at z = 0.3; the steps go down towards +z; y = 0 is the apron. userData.plan has the treads (for the camera check). */
export function stairs(sill = 2.56, n = 12) {
  const g = grp(),
    W = 1.1,
    rise = sill / n,
    tread = 0.26,
    back = -0.62,
    front0 = 0.3,
    grey = solid(0x9aa29e, 0.5, 0.45),
    deck = solid(0x5b625f, 0.8, 0.2);
  box(W + 0.2, 0.08, front0 - back, deck, 0, sill - 0.04, (back + front0) / 2, g);
  const steps = [{ y: sill, z0: back, z1: front0 }];
  for (let k = 1; k < n; k++) {
    const y = sill - k * rise,
      z0 = front0 + (k - 1) * tread,
      z1 = z0 + tread;
    steps.push({ y, z0, z1 });
    box(W, 0.05, tread + 0.02, deck, 0, y - 0.025, (z0 + z1) / 2, g);
    box(W, rise - 0.05, 0.012, grey, 0, y + rise / 2 - 0.02, z0 + 0.006, g);
  }
  const zEnd = front0 + (n - 1) * tread,
    len = Math.hypot(zEnd - front0, sill),
    ang = Math.atan2(sill, zEnd - front0);
  for (const x of [-(W / 2 + 0.05), W / 2 + 0.05]) {
    const st = box(0.07, 0.26, len + 0.1, grey, x, sill / 2 - 0.12, (front0 + zEnd) / 2, g);
    st.rotation.x = ang;
    const rail = box(0.05, 0.05, len + 0.05, grey, x, sill / 2 + 0.9, (front0 + zEnd) / 2, g);
    rail.rotation.x = ang;
    for (let i = 0; i <= 4; i++) {
      const z = front0 + ((zEnd - front0) * i) / 4,
        y = sill - (sill * i) / 4;
      box(0.035, 0.9, 0.035, grey, x, y + 0.45, z, g);
    }
    box(0.05, 0.05, front0 - back, grey, x, sill + 0.9, (back + front0) / 2, g);
    box(0.035, 0.9, 0.035, grey, x, sill + 0.45, back + 0.05, g);
    box(0.09, sill - 0.3, 0.09, grey, x, (sill - 0.3) / 2 + 0.3, back + 0.2, g);
    for (const z of [back + 0.2, zEnd - 0.3]) {
      const w = cyl(0.17, 0.17, 0.1, DARK, x, 0.17, z, g, 12);
      w.rotation.z = Math.PI / 2;
    }
  }
  g.userData.plan = { sill, steps, rise, tread, end: zEnd };
  return g;
}

let shadow = null;
export function shadowTexture() {
  if (shadow) return shadow;
  return (shadow = cv(64, 64, (x) => {
    const g = x.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, "rgba(18,30,24,.8)");
    g.addColorStop(1, "rgba(18,30,24,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
  }));
}
export function frond() {
  const g = grp();
  cyl(0.012, 0.018, 1.4, WOOD, 0, 0.7, 0, g, 5);
  const leaf = plane(
    0.65,
    1.4,
    std(
      (() => {
        const c = cv(128, 256, (x) => {
          x.clearRect(0, 0, 128, 256);
          x.strokeStyle = "#547b35";
          x.lineWidth = 5;
          for (let i = 0; i < 22; i++) {
            const y = 240 - i * 10,
              w = 48 * Math.sin(((i + 2) / 25) * Math.PI);
            for (const s of [-1, 1]) {
              x.beginPath();
              x.moveTo(64, y);
              x.lineTo(64 + s * w, y - 26);
              x.stroke();
            }
          }
        });
        return c;
      })(),
      1,
      { alphaTest: 0.4, side: THREE.DoubleSide },
    ),
    0,
    1.2,
    0,
    g,
  );
  return dynamic(g);
}

export function ceremonialRifle() {
  const g = grp();
  box(0.065, 0.49, 0.065, WOOD, 0, 0.255, 0, g);
  box(0.045, 0.56, 0.05, METAL, 0, 0.76, 0, g);
  cyl(0.017, 0.017, 0.58, METAL, 0, 1.2, 0, g, 7);
  box(0.018, 0.23, 0.018, solid(0xaaa99b, 0.4, 0.6), 0, 1.59, 0, g);
  return paintedProp(g);
}

const propPaint = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.78,
  metalness: 0.12,
});
function paintedProp(root) {
  root.updateMatrixWorld(true);
  const parts = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const geo = o.geometry.toNonIndexed();
    geo.applyMatrix4(o.matrixWorld);
    const count = geo.attributes.position.count,
      c = new Float32Array(count * 3),
      colour = o.material.color;
    for (let i = 0; i < count; i++) {
      c[i * 3] = colour.r;
      c[i * 3 + 1] = colour.g;
      c[i * 3 + 2] = colour.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(c, 3));
    parts.push(geo);
  });
  root.clear();
  root.add(new THREE.Mesh(mergeGeometries(parts, false), propPaint));
  return dynamic(root);
}
