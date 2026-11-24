/* Air Jamaica's first jet, a Douglas DC-8, in the airline's first look (orange and yellow, the Love Bird on the tail).
   Sources and what is still a general picture: docs/games/air-jamaica.md ("Planes and colours"). Built to the published size of a
   DC-8-50: about 45.9 m long, 43.4 m span, a 3.7 m fuselage, 13 m to the top of the fin, four turbofans under swept wings, tricycle gear.
   The livery follows the owner's reference photographs (ref-1969-crew-and-dc8.jpg, ref-gallery2.jpg): a white body, a yellow band over the
   top of the fuselage, an orange and red stripe along the windows with a thin pink line under it, the title "airJamaica" in lowercase orange
   near the nose, a Jamaican flag by the registration, and a white fin with a yellow and orange sweep and an orange roundel with a white bird.
   Local axes: the nose points along +x, the left (port) side is -z, the wheels stand on y = 0. The door is forward on the port side. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv, std } from "./gfx.js";

export const DC8 = {
  L: 45.9,
  R: 1.85, // fuselage radius
  Y0: 3.2, // height of the fuselage centre line above the ground (wheels on y = 0)
  NOSE: 22.9, // x of the tip of the nose
  TAIL: -23.0, // x of the end of the tail cone
  door: { x: 14.2, w: 0.9, h: 1.85, sill: 2.9 }, // the forward port door: sill height above the ground
  FIN_TOP: 13.0,
  SPAN: 43.4,
};
export const ORANGE = 0xe86a1c,
  RED = 0xc8321e,
  YELLOW = 0xf3b61f,
  PINK = 0xd8467a,
  WHITE = 0xf1efe8;
const metal = solid(0xb9bdbb, 0.35, 0.6),
  dark = solid(0x1f2423, 0.55),
  tyre = solid(0x1c1e1d, 0.9),
  glass = solid(0x1f313a, 0.18, 0.35),
  white = solid(WHITE, 0.5, 0.05),
  gear = solid(0x8d9290, 0.45, 0.5);
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
/* the fuselage outline: [x along the body, radius] (nose at +x) */
const PROFILE = [
  [-23.0, 0.08], [-22.2, 0.42], [-19.5, 0.95], [-16.0, 1.45], [-12.0, 1.78], [-9.0, 1.85],
  [14.0, 1.85], [17.0, 1.78], [19.4, 1.55], [21.2, 1.15], [22.3, 0.62], [22.9, 0.1],
];
export function radiusAt(x) {
  for (let j = 1; j < PROFILE.length; j++)
    if (x <= PROFILE[j][0]) {
      const a = PROFILE[j - 1], b = PROFILE[j];
      return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0]));
    }
  return 0;
}
/* the tail cone sweeps up behind the wing: the centre line rises toward the tail */
export function centreY(x) {
  const t = Math.max(0, Math.min(1, (-11 - x) / 12));
  return DC8.Y0 + 0.55 * t * t;
}
/* the fuselage skin: a lathe round the x axis, painted by height on the body with vertex colours, so the stripes stay level along the
   whole length and run straight through the windows: white belly, a pink line, an orange and red stripe at window height, a yellow roof */
function fuselage() {
  const N = 48, M = 56, rows = [];
  const pos = [], col = [], idx = [];
  const xs = [];
  for (let i = 0; i <= N; i++) xs.push(lerp(DC8.TAIL, DC8.NOSE, i / N));
  const C = (hex) => new THREE.Color(hex);
  /* height above the centre line (dy) -> colour. Window line at dy 0.55 to 0.95. */
  const paint = (dy) => {
    if (dy > 0.98) return C(YELLOW);
    if (dy > 0.82) return C(ORANGE);
    if (dy > 0.5) return C(RED);
    if (dy > 0.4) return C(WHITE);
    if (dy > 0.3) return C(PINK);
    return C(WHITE);
  };
  for (let i = 0; i <= N; i++) {
    const x = xs[i], r = radiusAt(x), cy = centreY(x);
    for (let j = 0; j < M; j++) {
      const a = (j / M) * Math.PI * 2, dy = Math.cos(a) * r, dz = Math.sin(a) * r;
      pos.push(x, cy + dy, dz);
      /* bands only where the body is nearly full size; the nose and tail cones take the roof colour above the line and white below */
      const k = Math.min(1, r / 1.5);
      const c = paint(dy / Math.max(k, 0.3) * 1.0);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < N; i++)
    for (let j = 0; j < M; j++) {
      const a = i * M + j, b = i * M + ((j + 1) % M), c2 = (i + 1) * M + j, d = (i + 1) * M + ((j + 1) % M);
      idx.push(a, c2, b, b, c2, d);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.08, side: THREE.DoubleSide });
  const o = new THREE.Mesh(geo, m);
  o.name = "fuselage";
  return o;
}
/* a flat outline pushed out to a thickness, in a plane: points are [a, b] in the plane's two axes */
function slab(points, depth, mat) {
  const s = new THREE.Shape();
  points.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, mat);
}
/* the Love Bird roundel: an orange disc with a white bird in a ring (the bird on the tail in the reference photographs) */
function roundelTexture() {
  return cv(256, 256, (x, W) => {
    x.clearRect(0, 0, W, W);
    const c = W / 2;
    x.fillStyle = "#e8581c";
    x.beginPath(); x.arc(c, c, 124, 0, 7); x.fill();
    x.strokeStyle = "#f6efe2"; x.lineWidth = 11; x.lineCap = "round";
    /* the ring, open at the top right where the tail of the bird leaves it */
    x.beginPath(); x.arc(c, c + 6, 78, 0.5, Math.PI * 2 - 0.25); x.stroke();
    /* the bird: a round body, a long neck and head, and a long curling tail through the ring */
    x.fillStyle = "#f6efe2";
    x.beginPath(); x.ellipse(c - 6, c + 2, 34, 22, -0.5, 0, 7); x.fill();
    x.lineWidth = 12;
    x.beginPath(); x.moveTo(c - 30, c - 10); x.quadraticCurveTo(c - 54, c - 56, c - 22, c - 70); x.stroke();
    x.beginPath(); x.moveTo(c - 26, c - 70); x.lineTo(c - 6, c - 76); x.lineWidth = 7; x.stroke();
    x.lineWidth = 9;
    x.beginPath(); x.moveTo(c + 18, c + 14); x.bezierCurveTo(c + 70, c + 30, c + 82, c + 84, c + 30, c + 92); x.stroke();
  });
}
/* the title "airJamaica" in lowercase orange, in a transparent strip to lay on each side of the nose */
function titleTexture() {
  return cv(1024, 180, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#d9531b";
    x.font = "700 128px 'Trebuchet MS', Verdana, sans-serif";
    x.textBaseline = "middle";
    x.fillText("airJamaica", 18, H / 2 + 6);
  });
}
/* a small Jamaican flag: black and green and gold saltire (green top and bottom, black sides, a gold cross) */
export function flagTexture() {
  return cv(96, 64, (x, W, H) => {
    x.fillStyle = "#1a8a3a"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#111"; x.beginPath(); x.moveTo(0, 0); x.lineTo(W / 2, H / 2); x.lineTo(0, H); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(W, 0); x.lineTo(W / 2, H / 2); x.lineTo(W, H); x.closePath(); x.fill();
    x.strokeStyle = "#f2c62c"; x.lineWidth = 10;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W, H); x.moveTo(W, 0); x.lineTo(0, H); x.stroke();
  });
}
/* the fin panel: the fin outline in panel space, the yellow band that rises from the roof stripe, an orange band below it, and the roundel */
function finPaint() {
  return cv(512, 486, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    /* panel space: u 0..1 left to right = x -19.8 to -10.5 (tail on the left); v 0..1 top to bottom = y 9.8 to 1.0 */
    const X = (m) => ((m + 19.8) / 9.3) * W, Y = (m) => ((9.8 - m) / 8.8) * H;
    x.save();
    x.beginPath();
    [[-10.5, 1.0], [-13.2, 9.8], [-17.2, 9.8], [-19.8, 1.0]].forEach(([a, b], i) => (i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b))));
    x.closePath();
    x.clip();
    x.fillStyle = "#f3b61f";
    x.beginPath(); x.moveTo(X(-10.4), Y(1.0)); x.lineTo(X(-10.4), Y(2.6)); x.lineTo(X(-13.4), Y(5.8)); x.lineTo(X(-16.6), Y(7.6)); x.lineTo(X(-17.4), Y(5.4)); x.lineTo(X(-15.2), Y(3.8)); x.lineTo(X(-13.2), Y(1.0)); x.closePath(); x.fill();
    x.fillStyle = "#e86a1c";
    x.beginPath(); x.moveTo(X(-13.2), Y(1.0)); x.lineTo(X(-15.2), Y(3.8)); x.lineTo(X(-17.4), Y(5.4)); x.lineTo(X(-18.0), Y(3.6)); x.lineTo(X(-16.4), Y(2.4)); x.lineTo(X(-15.4), Y(1.0)); x.closePath(); x.fill();
    x.restore();
    const cx = X(-15.4), cy = Y(7.0), R = 100;
    const rt = roundelTexture();
    x.drawImage(rt.image, cx - R, cy - R, R * 2, R * 2);
  });
}
function decal(w, h, tex) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
}
function wheel(r, w, parent, x, y, z) {
  const c = cyl(r, r, w, tyre, x, y, z, parent, 14);
  c.rotation.x = Math.PI / 2;
  const hub = cyl(r * 0.5, r * 0.5, w + 0.02, metal, x, y, z, parent, 10);
  hub.rotation.x = Math.PI / 2;
}
function engine(x, y, z, parent) {
  const e = grp(parent, x, y, z);
  const body = cyl(0.62, 0.55, 4.0, metal, 0, 0, 0, e, 18);
  body.rotation.z = Math.PI / 2;
  const lip = cyl(0.66, 0.66, 0.22, white, 2.0, 0, 0, e, 18);
  lip.rotation.z = Math.PI / 2;
  const mouth = cyl(0.5, 0.5, 0.05, dark, 2.13, 0, 0, e, 18);
  mouth.rotation.z = Math.PI / 2;
  const nozzle = cyl(0.42, 0.36, 0.6, dark, -2.2, 0, 0, e, 14);
  nozzle.rotation.z = Math.PI / 2;
  /* the pylon up to the wing */
  box(2.6, 0.9, 0.16, white, -0.2, 0.8, 0, e);
  return e;
}
export function dc8() {
  const { R, Y0 } = DC8;
  const g = grp();
  g.userData.noBatch = true;
  g.add(fuselage());
  /* windows: a row of small dark panes on each side at the window line, and the cockpit windscreen */
  const pane = new THREE.BoxGeometry(0.34, 0.46, 0.04);
  const wins = [];
  for (let x = -17; x <= 18.2; x += 0.78) {
    if (Math.abs(x - DC8.door.x) < 1.4) continue;
    wins.push(x);
  }
  const wm = new THREE.InstancedMesh(pane, glass, wins.length * 2);
  const q = new THREE.Matrix4();
  wins.forEach((x, i) => {
    const r = radiusAt(x), cy = centreY(x), dy = 0.7;
    const dz = Math.sqrt(Math.max(0.01, r * r - dy * dy));
    q.makeTranslation(x, cy + dy, dz + 0.005);
    wm.setMatrixAt(i * 2, q);
    q.makeTranslation(x, cy + dy, -dz - 0.005);
    wm.setMatrixAt(i * 2 + 1, q);
  });
  wm.instanceMatrix.needsUpdate = true;
  wm.name = "windows";
  g.add(wm);
  /* cockpit: four dark panes across the nose, and the black nose-cone window line seen in the reference photographs */
  for (const s of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const x = 19.7 + i * 0.5, r = radiusAt(x), cy = centreY(x), dy = 0.68;
      const dz = Math.sqrt(Math.max(0.01, r * r - dy * dy)) * s;
      const p = box(0.36, 0.42, 0.04, glass, x, cy + dy, dz, g);
      p.rotation.y = s * 0.12;
    }
  /* the door: forward on the port side, a slightly proud panel with a thin seam */
  const D = DC8.door, dr = radiusAt(D.x), dcy = centreY(D.x);
  const doorMat = solid(0xe9e6dd, 0.5, 0.05), seam = solid(0x4a4a46, 0.6);
  const doorY = D.sill - 0.0 + D.h / 2, dzz = -Math.sqrt(Math.max(0.01, dr * dr - (doorY - dcy) ** 2)) - 0.02;
  box(D.w, D.h, 0.05, doorMat, D.x, doorY, dzz, g);
  box(D.w + 0.06, 0.03, 0.06, seam, D.x, D.sill, dzz, g);
  box(D.w + 0.06, 0.03, 0.06, seam, D.x, D.sill + D.h, dzz, g);
  box(0.03, D.h, 0.06, seam, D.x - D.w / 2, doorY, dzz, g);
  box(0.03, D.h, 0.06, seam, D.x + D.w / 2, doorY, dzz, g);
  g.userData.doorWorld = { x: D.x, y: D.sill, z: dzz };
  /* the title, near the nose on each side, and the flag by the registration */
  const title = titleTexture();
  for (const s of [-1, 1]) {
    const x = 13.6, r = radiusAt(x), cy = centreY(x), dy = 0.05;
    const t = decal(6.2, 1.1, title);
    t.position.set(x - 0.2, cy + dy, s * (Math.sqrt(r * r - dy * dy) + 0.02));
    if (s > 0) t.rotation.y = 0; else { t.rotation.y = Math.PI; }
    g.add(t);
  }
  const flag = flagTexture();
  for (const s of [-1, 1]) {
    const x = -5.0, r = radiusAt(x), cy = centreY(x), dy = 0.62;
    const f = decal(0.7, 0.46, flag);
    f.position.set(x, cy + dy - 0.4, s * (Math.sqrt(r * r - (dy - 0.4) ** 2) + 0.02));
    if (s < 0) f.rotation.y = Math.PI;
    g.add(f);
  }
  /* wings: swept back about 30 degrees, tilted up a little toward the tip, a thin slab each side. In (x, span): the leading edge runs from
     x 3.0 at the root to x -9.0 at the tip, 21.2 m out */
  const WING_Y = 2.3, TILT = 0.05;
  const wingOut = [[3.0, 0], [-9.0, 21.2], [-11.8, 21.2], [-7.5, 0]];
  const leadX = (z) => 3.0 - 12.0 * (z / 21.2);
  for (const s of [-1, 1]) {
    const w = slab(wingOut, 0.34, white);
    w.rotation.x = Math.PI / 2; /* the outline's second axis becomes the span; scale.y = -1 mirrors it to the port side */
    w.scale.y = s;
    w.position.set(0, WING_Y, 0);
    w.name = "wing";
    const holder = grp(g, 0, 0, 0);
    holder.add(w);
    holder.rotation.x = -s * TILT;
  }
  /* four engines under the wings on pylons, inboard and outboard each side, just ahead of the leading edge */
  for (const s of [-1, 1])
    for (const z of [7.4, 13.2]) engine(leadX(z) + 0.5, 1.1 + TILT * z, z * s, g);
  /* tail: a swept fin standing on the rear fuselage, with the roundel on each side, and the horizontal tail */
  const fin = slab([[-10.5, 1.0], [-13.2, 9.8], [-17.2, 9.8], [-19.8, 1.0]], 0.22, white);
  fin.position.set(0, DC8.Y0, 0);
  fin.name = "fin";
  g.add(fin);
  /* the fin's own paint: the yellow and orange sweep that climbs from the roof stripe, and the roundel, drawn on one panel per side that
     covers the fin's outline (x -19.8 to -10.5, y 1.0 to 9.8 above the centre line) and is clipped to it */
  const finTex = finPaint();
  for (const s of [-1, 1]) {
    const f = decal(9.3, 8.8, finTex);
    f.position.set(-15.15, DC8.Y0 + 5.4, s * 0.125);
    if (s < 0) f.rotation.y = Math.PI;
    g.add(f);
  }
  const hstab = slab([[-15.5, 0], [-19.2, 7.0], [-22.0, 7.0], [-21.4, 0]], 0.22, white);
  hstab.rotation.x = Math.PI / 2;
  hstab.position.set(0, DC8.Y0 + 0.8, 0);
  g.add(hstab);
  const hstab2 = slab([[-15.5, 0], [-19.2, -7.0], [-22.0, -7.0], [-21.4, 0]], 0.22, white);
  hstab2.rotation.x = Math.PI / 2;
  hstab2.position.set(0, DC8.Y0 + 0.8, 0);
  g.add(hstab2);
  /* tricycle gear: the nose gear, and two main bogies under the wing roots */
  const nose = grp(g, 17.0, 0, 0);
  cyl(0.08, 0.08, DC8.Y0 - 0.9, gear, 0, 1.3, 0, nose, 8);
  wheel(0.46, 0.24, nose, 0, 0.46, -0.3);
  wheel(0.46, 0.24, nose, 0, 0.46, 0.3);
  for (const s of [-1, 1]) {
    const m = grp(g, -3.0, 0, s * 3.6);
    cyl(0.11, 0.11, DC8.Y0 - 1.1, gear, 0, 1.4, 0, m, 8);
    for (const [dx, dz] of [[-0.6, -0.3], [-0.6, 0.3], [0.6, -0.3], [0.6, 0.3]]) wheel(0.62, 0.3, m, dx, 0.62, dz);
  }
  g.traverse((o) => { o.userData.noBatch = true; });
  g.userData.parts = { fuselage: g.children[0] };
  return g;
}
/* the registration seen in the reference postcard of a DC-8-51 (6Y-JGD) is only a title on the card; the game draws no registration
   so that no number is claimed for a particular aircraft. */
