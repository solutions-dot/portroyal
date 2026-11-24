/* Air Jamaica's jets, built from one kit (makeJet) and a spec for each type. Sources and what is still a general picture:
   docs/games/air-jamaica.md ("Planes and colours"). Types so far: the Douglas DC-8 (the first jet, 1969) and the Douglas DC-9 (one of the
   first four jets), both in the airline's first look: a white body, a yellow band over the top, an orange and red stripe along the windows
   with a thin pink line under it, the title "airJamaica" in lowercase orange near the nose, a Jamaican flag by the registration, and a
   white fin with a yellow and orange sweep and an orange roundel with a white bird (owner's reference photographs: ref-1969-crew-and-dc8,
   ref-gallery2, ref-dc9-6Y-JGB, ref-727-6Y-JMO). Sizes are the published ones for each type. No registration is drawn, so no number is claimed.
   Local axes: the nose points along +x, the left (port) side is -z, the wheels stand on y = 0. The passenger door is forward on the port side. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv } from "./gfx.js";

export const ORANGE = 0xe86a1c, RED = 0xc8321e, YELLOW = 0xf3b61f, PINK = 0xd8467a, WHITE = 0xf1efe8;
const M = {
  white: solid(WHITE, 0.5, 0.05),
  grey: solid(0xc9ccc8, 0.45, 0.1),
  metal: solid(0xb9bdbb, 0.32, 0.65),
  steel: solid(0x7d8280, 0.4, 0.6),
  dark: solid(0x1c2120, 0.6),
  seam: solid(0x55595a, 0.7),
  tyre: solid(0x1b1d1c, 0.92),
  glass: solid(0x16262e, 0.15, 0.4),
  frame: solid(0xdcdad2, 0.5, 0.1),
  red: solid(0xcc2020, 0.4),
  green: solid(0x20b040, 0.4),
};
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

/* ---- the types ---- */
export const DC8 = {
  name: "DC-8-50",
  /* fuselage outline [x, radius] from the tail to the nose, and the lift of the tail cone */
  profile: [[-23.0, 0.08], [-22.2, 0.42], [-19.5, 0.95], [-16.0, 1.45], [-12.0, 1.78], [-9.0, 1.85], [14.0, 1.85], [17.0, 1.78], [19.4, 1.55], [21.2, 1.15], [22.3, 0.62], [22.9, 0.1]],
  Y0: 3.2, lift: { from: -11, over: 12, up: 0.55 },
  windows: { from: -17.0, to: 18.2, step: 0.78, dy: 0.7 },
  doors: [{ x: 14.2, side: -1, w: 0.9, h: 1.85, sill: 2.9, main: true }, { x: 14.2, side: 1, w: 0.8, h: 1.7, sill: 2.9 }, { x: -13.4, side: -1, w: 0.8, h: 1.7, sill: 2.9 }, { x: -13.4, side: 1, w: 0.8, h: 1.7, sill: 2.9 }],
  overwing: [{ x: -3.2, side: -1 }, { x: -3.2, side: 1 }, { x: -5.4, side: -1 }, { x: -5.4, side: 1 }],
  cargo: [{ x: 9.0, side: 1 }, { x: -9.4, side: -1 }],
  wing: { root: [3.0, -7.5], tip: [-9.0, -11.8], span: 21.2, y: 2.3, tilt: 0.05, thick: 0.34 },
  engines: { kind: "wing", z: [7.4, 13.2], y: 1.1, len: 4.0, r: 0.62 },
  tail: { fin: [[-10.5, 1.0], [-13.2, 9.8], [-17.2, 9.8], [-19.8, 1.0]], finTop: 9.8, stab: { y: 0.9, pts: [[-15.5, 0], [-19.2, 7.0], [-22.0, 7.0], [-21.4, 0]] }, tee: false },
  gear: { noseX: 17.0, mainX: -3.0, mainZ: 3.6, bogie: 4, wheel: 0.62, noseWheel: 0.46 },
  title: { x: 8.4, w: 6.2 },
  flag: { x: -5.0 },
  cockpit: { x: 19.7, dx: 0.5, n: 3, dy: 0.68 },
};
export const DC9 = {
  name: "DC-9-30",
  profile: [[-18.2, 0.07], [-17.5, 0.3], [-15.0, 0.8], [-12.0, 1.3], [-9.0, 1.62], [-6.0, 1.67], [10.5, 1.67], [13.0, 1.58], [15.0, 1.3], [16.7, 0.85], [17.7, 0.4], [18.2, 0.08]],
  Y0: 2.9, lift: { from: -8, over: 10, up: 0.6 },
  windows: { from: -12.0, to: 12.6, step: 0.7, dy: 0.62 },
  doors: [{ x: 11.2, side: -1, w: 0.85, h: 1.75, sill: 2.55, main: true }, { x: 11.2, side: 1, w: 0.75, h: 1.6, sill: 2.55 }, { x: -10.6, side: -1, w: 0.7, h: 1.5, sill: 2.55 }],
  overwing: [{ x: -2.4, side: -1 }, { x: -2.4, side: 1 }],
  cargo: [{ x: 6.2, side: 1 }, { x: -7.0, side: 1 }],
  wing: { root: [2.2, -5.0], tip: [-5.6, -7.6], span: 14.2, y: 2.0, tilt: 0.04, thick: 0.28 },
  engines: { kind: "rear", z: 2.55, y: 0.55, x: -11.6, len: 4.0, r: 0.6 },
  tail: { fin: [[-9.0, 1.0], [-12.0, 6.0], [-16.2, 6.0], [-17.0, 1.0]], finTop: 6.0, stab: { y: 6.0, pts: [[-11.6, 0], [-15.6, 4.4], [-17.8, 4.4], [-16.4, 0]] }, tee: true },
  gear: { noseX: 13.4, mainX: -1.2, mainZ: 2.9, bogie: 2, wheel: 0.55, noseWheel: 0.4 },
  title: { x: 4.9, w: 5.6 },
  flag: { x: -3.0 },
  cockpit: { x: 15.2, dx: 0.45, n: 3, dy: 0.62 },
};

/* ---- the kit ---- */
function radiusAt(S, x) {
  const P = S.profile;
  for (let j = 1; j < P.length; j++) if (x <= P[j][0]) return lerp(P[j - 1][1], P[j][1], (x - P[j - 1][0]) / (P[j][0] - P[j - 1][0]));
  return 0;
}
function centreY(S, x) {
  const { from, over, up } = S.lift;
  const t = Math.max(0, Math.min(1, (from - x) / over));
  return S.Y0 + up * t * t;
}
/* a point on the body's side at height dy above the centre line: its y and z on side s, and the tilt of the surface there */
function onSide(S, x, dy, s) {
  const r = radiusAt(S, x), cy = centreY(S, x), d = Math.min(dy, r * 0.95);
  const dz = Math.sqrt(Math.max(0.0001, r * r - d * d));
  return { y: cy + d, z: s * dz, tilt: Math.asin(d / r) };
}
function fuselage(S) {
  const N = 150, Mn = 160, pos = [], idx = [];
  const C = (h) => new THREE.Color(h);
  /* paint by height above the centre line, so the stripes stay level along the body and run straight through the windows;
     every face takes one flat colour, so the edges of the stripes are crisp */
  const paint = (dy) => (dy > 1.0 ? C(YELLOW) : dy > 0.84 ? C(ORANGE) : dy > 0.5 ? C(RED) : dy > 0.4 ? C(WHITE) : dy > 0.3 ? C(PINK) : C(WHITE));
  const x0 = S.profile[0][0], x1 = S.profile[S.profile.length - 1][0];
  for (let i = 0; i <= N; i++) {
    const x = lerp(x0, x1, i / N), r = radiusAt(S, x), cy = centreY(S, x);
    for (let j = 0; j < Mn; j++) {
      const a = (j / Mn) * Math.PI * 2;
      pos.push(x, cy + Math.cos(a) * r, Math.sin(a) * r);
    }
  }
  for (let i = 0; i < N; i++)
    for (let j = 0; j < Mn; j++) {
      const a = i * Mn + j, b = i * Mn + ((j + 1) % Mn), c2 = (i + 1) * Mn + j, d = (i + 1) * Mn + ((j + 1) % Mn);
      idx.push(a, c2, b, b, c2, d);
    }
  let geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  geo = geo.toNonIndexed();
  const P = geo.attributes.position, col = new Float32Array(P.count * 3);
  for (let t = 0; t < P.count; t += 6) {
    /* both triangles of a quad take the colour of the quad's middle, so a stripe edge runs along the body and does not follow the diagonals */
    let sx = 0, sy = 0;
    for (let k = 0; k < 6; k++) { sx += P.getX(t + k); sy += P.getY(t + k); }
    const c = paint(sy / 6 - centreY(S, sx / 6));
    for (let k = 0; k < 6; k++) { col[(t + k) * 3] = c.r; col[(t + k) * 3 + 1] = c.g; col[(t + k) * 3 + 2] = c.b; }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const o = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.1, side: THREE.DoubleSide }));
  o.name = "fuselage";
  return o;
}
function slab(points, depth, mat) {
  const s = new THREE.Shape();
  points.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, mat);
}
/* a thin dark line between two points on a plane at height y (x, z), width w: a panel line on a wing or a control surface edge */
function seamLine(parent, a, b, y, w = 0.045) {
  const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
  const l = box(len, 0.012, w, M.seam, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, parent);
  l.rotation.y = -Math.atan2(dz, dx);
  return l;
}
function roundRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 4);
}
/* the Love Bird roundel: an orange disc with a white bird in a ring (the bird on the tail in the reference photographs) */
export function roundelTexture() {
  return cv(256, 256, (x, W) => {
    x.clearRect(0, 0, W, W);
    const c = W / 2;
    x.fillStyle = "#e8581c"; x.beginPath(); x.arc(c, c, 124, 0, 7); x.fill();
    x.strokeStyle = "#f6efe2"; x.lineWidth = 11; x.lineCap = "round";
    x.beginPath(); x.arc(c, c + 6, 78, 0.5, Math.PI * 2 - 0.25); x.stroke();
    x.fillStyle = "#f6efe2";
    x.beginPath(); x.ellipse(c - 6, c + 2, 34, 22, -0.5, 0, 7); x.fill();
    x.lineWidth = 12;
    x.beginPath(); x.moveTo(c - 30, c - 10); x.quadraticCurveTo(c - 54, c - 56, c - 22, c - 70); x.stroke();
    x.lineWidth = 7; x.beginPath(); x.moveTo(c - 26, c - 70); x.lineTo(c - 6, c - 76); x.stroke();
    x.lineWidth = 9; x.beginPath(); x.moveTo(c + 18, c + 14); x.bezierCurveTo(c + 70, c + 30, c + 82, c + 84, c + 30, c + 92); x.stroke();
  });
}
function titleTexture() {
  return cv(1024, 180, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#d9531b"; x.font = "700 128px 'Trebuchet MS', Verdana, sans-serif"; x.textBaseline = "middle";
    x.fillText("airJamaica", 18, H / 2 + 6);
  });
}
export function flagTexture() {
  return cv(96, 64, (x, W, H) => {
    x.fillStyle = "#1a8a3a"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#111";
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W / 2, H / 2); x.lineTo(0, H); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(W, 0); x.lineTo(W / 2, H / 2); x.lineTo(W, H); x.closePath(); x.fill();
    x.strokeStyle = "#f2c62c"; x.lineWidth = 10;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W, H); x.moveTo(W, 0); x.lineTo(0, H); x.stroke();
  });
}
/* the fin panel (orange look): the yellow band that climbs from the roof stripe, the orange band under it, the roundel; clipped to the fin */
function finPaint(S) {
  const F = S.tail.fin, xs = F.map((p) => p[0]), ys = F.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
  const tex = cv(512, Math.round(512 * (h / w)), (x, W, H) => {
    x.clearRect(0, 0, W, H);
    const X = (m) => ((m - x0) / w) * W, Y = (m) => ((y1 - m) / h) * H, u = (a, b) => [x0 + a * w, y0 + b * h];
    x.save();
    x.beginPath(); F.forEach(([a, b], i) => (i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b)))); x.closePath(); x.clip();
    const poly = (fill, pts) => { x.fillStyle = fill; x.beginPath(); pts.forEach((p, i) => { const [a, b] = u(p[0], p[1]); i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b)); }); x.closePath(); x.fill(); };
    /* panel fractions: u from the tail end (0) to the nose end (1), v from the bottom (0) to the top (1) */
    poly("#f3b61f", [[1.02, 0.0], [1.02, 0.18], [0.78, 0.55], [0.42, 0.8], [0.3, 0.52], [0.52, 0.34], [0.72, 0.0]]);
    poly("#e86a1c", [[0.72, 0.0], [0.52, 0.34], [0.3, 0.52], [0.22, 0.34], [0.38, 0.18], [0.46, 0.0]]);
    x.restore();
    const R = W * 0.2, cx = W * 0.42, cy = H * 0.18 + R;
    x.drawImage(roundelTexture().image, cx - R, cy - R, R * 2, R * 2);
  });
  return { tex, w, h, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
function decal(w, h, tex) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
}
function wheel(r, w, parent, x, y, z) {
  const t = cyl(r, r, w, M.tyre, x, y, z, parent, 18); t.rotation.x = Math.PI / 2;
  const rim = cyl(r * 0.62, r * 0.62, w + 0.015, M.metal, x, y, z, parent, 14); rim.rotation.x = Math.PI / 2;
  const hub = cyl(r * 0.22, r * 0.22, w + 0.04, M.steel, x, y, z, parent, 8); hub.rotation.x = Math.PI / 2;
  return t;
}
/* a turbofan pod: nacelle, a bright intake lip, the dark intake with the fan face and its spinner, a tail pipe and a cone */
function pod(parent, x, y, z, len, r) {
  const e = grp(parent, x, y, z);
  const body = cyl(r, r * 0.9, len, M.white, 0, 0, 0, e, 20); body.rotation.z = Math.PI / 2;
  const lip = cyl(r * 1.05, r * 1.05, 0.2, M.metal, len / 2, 0, 0, e, 20); lip.rotation.z = Math.PI / 2;
  const mouth = cyl(r * 0.9, r * 0.9, 0.06, M.dark, len / 2 + 0.07, 0, 0, e, 20); mouth.rotation.z = Math.PI / 2;
  const fan = cyl(r * 0.78, r * 0.78, 0.04, M.steel, len / 2 - 0.35, 0, 0, e, 20); fan.rotation.z = Math.PI / 2;
  const spin = mesh(new THREE.ConeGeometry(r * 0.2, 0.5, 12), M.metal, len / 2 - 0.12, 0, 0, e); spin.rotation.z = -Math.PI / 2;
  for (let i = 0; i < 12; i++) { const b = box(r * 1.4, 0.02, 0.045, M.steel, len / 2 - 0.34, 0, 0, e); b.rotation.x = (i / 12) * Math.PI; }
  const pipe = cyl(r * 0.62, r * 0.5, 0.8, M.steel, -len / 2 - 0.3, 0, 0, e, 16); pipe.rotation.z = Math.PI / 2;
  const cone = mesh(new THREE.ConeGeometry(r * 0.28, 0.8, 10), M.metal, -len / 2 - 0.55, 0, 0, e); cone.rotation.z = Math.PI / 2;
  for (const dx of [-0.8, 0.9]) { const s = cyl(r * 1.005, r * 1.005, 0.025, M.seam, dx, 0, 0, e, 20); s.rotation.z = Math.PI / 2; }
  return e;
}
/* a wing-mounted pylon: a tapered fairing from the pod's top up to the wing's underside */
function pylon(parent, x, y, z, len, top) {
  const p = slab([[0, 0], [len, 0], [len * 0.75, top], [len * 0.1, top]], 0.18, M.white);
  p.position.set(x - len * 0.35, y, z);
  parent.add(p);
}
export function makeJet(S) {
  const g = grp();
  g.userData.noBatch = true;
  g.userData.spec = S.name;
  g.add(fuselage(S));
  const wg = S.wing, TILT = wg.tilt, lead = (z) => lerp(wg.root[0], wg.tip[0], z / wg.span), trail = (z) => lerp(wg.root[1], wg.tip[1], z / wg.span);
  /* windows: a framed pane each, along the window line on both sides, skipping the doors and the over-wing exits */
  const W = S.windows, skip = [...S.doors.map((d) => d.x), ...S.overwing.map((d) => d.x)];
  const xs = [];
  for (let x = W.from; x <= W.to; x += W.step) if (!skip.some((k) => Math.abs(k - x) < 0.9)) xs.push(x);
  const glassG = roundRect(0.3, 0.42, 0.1), frameG = roundRect(0.38, 0.5, 0.12);
  const gi = new THREE.InstancedMesh(glassG, M.glass, xs.length * 2), fi = new THREE.InstancedMesh(frameG, M.frame, xs.length * 2);
  const q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), m4 = new THREE.Matrix4(), euler = new THREE.Euler();
  xs.forEach((x, i) =>
    [-1, 1].forEach((s, k) => {
      const o = onSide(S, x, W.dy, s);
      euler.set(s > 0 ? -o.tilt : o.tilt, s > 0 ? 0 : Math.PI, 0, "XYZ");
      q.setFromEuler(euler);
      p.set(x, o.y, o.z + s * 0.012);
      fi.setMatrixAt(i * 2 + k, m4.compose(p, q, one));
      p.set(x, o.y, o.z + s * 0.02);
      gi.setMatrixAt(i * 2 + k, m4.compose(p, q, one));
    }),
  );
  gi.name = "windows"; fi.name = "windowFrames";
  g.add(fi, gi);
  /* the windscreen: three panes each side of the nose, each in a pale frame */
  const C = S.cockpit;
  for (const s of [-1, 1])
    for (let i = 0; i < C.n; i++) {
      const x = C.x + i * C.dx, o = onSide(S, x, C.dy, s);
      const pn = box(0.34, 0.4, 0.04, M.glass, x, o.y, o.z, g);
      pn.rotation.y = s * 0.05 * (i + 1);
      pn.rotation.x = s > 0 ? -o.tilt : o.tilt;
      const fr = box(0.4, 0.46, 0.03, M.frame, x, o.y, o.z - s * 0.012, g);
      fr.rotation.copy(pn.rotation);
    }
  /* doors: a proud panel with a dark seam on its four edges; the main passenger door has a small window and a handle */
  const doorFor = (d) => {
    const mid = d.sill + d.h / 2, o = onSide(S, d.x, mid - centreY(S, d.x), d.side), z = o.z + d.side * 0.02;
    const tilt = d.side > 0 ? -o.tilt : o.tilt;
    const panel = box(d.w, d.h, 0.05, M.grey, d.x, o.y, z, g); panel.rotation.x = tilt;
    for (const [w, h, dx, dy] of [[d.w + 0.05, 0.03, 0, d.h / 2], [d.w + 0.05, 0.03, 0, -d.h / 2], [0.03, d.h, -d.w / 2, 0], [0.03, d.h, d.w / 2, 0]]) {
      const l = box(w, h, 0.07, M.seam, d.x + dx, o.y + dy, z, g); l.rotation.x = tilt;
    }
    if (d.main) {
      const win = box(0.22, 0.28, 0.06, M.glass, d.x + 0.12, o.y + d.h * 0.22, z + d.side * 0.01, g); win.rotation.x = tilt;
      const h = box(0.2, 0.05, 0.08, M.metal, d.x - 0.18, o.y - 0.1, z + d.side * 0.03, g); h.rotation.x = tilt;
    }
  };
  S.doors.forEach(doorFor);
  S.overwing.forEach((d) => {
    const o = onSide(S, d.x, 0.62, d.side), z = o.z + d.side * 0.018, t = d.side > 0 ? -o.tilt : o.tilt;
    const h = box(0.52, 0.72, 0.04, M.grey, d.x, o.y, z, g); h.rotation.x = t;
    for (const [w, hh, dx, dy] of [[0.55, 0.025, 0, 0.36], [0.55, 0.025, 0, -0.36], [0.025, 0.72, -0.26, 0], [0.025, 0.72, 0.26, 0]]) { const l = box(w, hh, 0.06, M.seam, d.x + dx, o.y + dy, z, g); l.rotation.x = t; }
  });
  S.cargo.forEach((d) => {
    const o = onSide(S, d.x, -0.95, d.side), z = o.z + d.side * 0.018, t = d.side > 0 ? -o.tilt : o.tilt;
    const h = box(1.2, 0.9, 0.04, M.grey, d.x, o.y, z, g); h.rotation.x = t;
    for (const [w, hh, dx, dy] of [[1.25, 0.025, 0, 0.45], [1.25, 0.025, 0, -0.45], [0.025, 0.9, -0.6, 0], [0.025, 0.9, 0.6, 0]]) { const l = box(w, hh, 0.06, M.seam, d.x + dx, o.y + dy, z, g); l.rotation.x = t; }
  });
  const md = S.doors.find((d) => d.main), mo = onSide(S, md.x, md.sill + md.h / 2 - centreY(S, md.x), md.side);
  g.userData.door = { x: md.x, y: md.sill, z: mo.z + md.side * 0.04, sill: md.sill, w: md.w, h: md.h, side: md.side };
  /* the title near the nose and the flag by the registration, on both sides */
  const title = titleTexture(), flag = flagTexture();
  for (const s of [-1, 1]) {
    const x = S.title.x, o = onSide(S, x, 0.05, s), t = decal(S.title.w, S.title.w * 0.1774, title);
    t.position.set(x, o.y, o.z + s * 0.025); t.rotation.set(s > 0 ? -o.tilt : o.tilt, s > 0 ? 0 : Math.PI, 0);
    g.add(t);
    const fx = S.flag.x, fo = onSide(S, fx, 0.15, s), f = decal(0.7, 0.46, flag);
    f.position.set(fx, fo.y, fo.z + s * 0.025); f.rotation.set(s > 0 ? -fo.tilt : fo.tilt, s > 0 ? 0 : Math.PI, 0);
    g.add(f);
  }
  /* wings: swept slabs, tilted up toward the tip; a leading edge with its slat line, flaps and an aileron on the trailing edge, spoiler lines,
     a navigation light and a fuel vent at the tip */
  const wingPts = [[wg.root[0], 0], [wg.tip[0], wg.span], [wg.tip[1], wg.span], [wg.root[1], 0]];
  const wingTop = wg.y + wg.thick / 2 + 0.012;
  for (const s of [-1, 1]) {
    const holder = grp(g, 0, 0, 0);
    holder.rotation.x = -s * TILT;
    const w = slab(wingPts, wg.thick, M.white);
    w.rotation.x = Math.PI / 2; w.scale.y = s; w.position.set(0, wg.y, 0); w.name = "wing";
    holder.add(w);
    const sz = (z) => z * s;
    seamLine(holder, [lead(0.4) - 0.55, sz(0.4)], [lead(wg.span * 0.97) - 0.55, sz(wg.span * 0.97)], wingTop);
    const f1 = 0.1 * wg.span, f2 = 0.45 * wg.span, a1 = 0.6 * wg.span, a2 = 0.94 * wg.span;
    for (const z of [f1, f2, a1, a2]) seamLine(holder, [trail(z) + 1.6, sz(z)], [trail(z), sz(z)], wingTop);
    seamLine(holder, [trail(f1) + 1.6, sz(f1)], [trail(f2) + 1.6, sz(f2)], wingTop);
    seamLine(holder, [trail(a1) + 1.0, sz(a1)], [trail(a2) + 1.0, sz(a2)], wingTop);
    seamLine(holder, [trail(f2) + 2.4, sz(f2)], [trail(a1) + 2.4, sz(a1)], wingTop, 0.035);
    const tipZ = wg.span * 0.995;
    mesh(new THREE.SphereGeometry(0.12, 8, 6), s < 0 ? M.red : M.green, trail(tipZ) + 0.4, wg.y, sz(tipZ), holder);
    box(0.5, 0.04, 0.04, M.steel, lead(tipZ) - 0.6, wg.y + 0.35, sz(tipZ) * 0.985, holder);
  }
  /* engines */
  const E = S.engines;
  if (E.kind === "wing")
    for (const s of [-1, 1])
      for (const z of E.z) {
        const ex = lead(z) + 0.5, ey = E.y + TILT * z;
        pod(g, ex, ey, z * s, E.len, E.r);
        pylon(g, ex, ey + E.r * 0.8, z * s, 2.6, wg.y - ey - E.r * 0.8 - 0.05);
      }
  else
    for (const s of [-1, 1]) {
      const ey = S.Y0 + E.y, rr = radiusAt(S, E.x);
      pod(g, E.x, ey, s * E.z, E.len, E.r);
      box(1.9, 0.22, E.z - rr + 0.15, M.white, E.x + 0.1, ey - 0.02, s * (rr + (E.z - rr) / 2 - 0.05), g);
    }
  /* tail: a swept fin standing on the rear fuselage with its own paint, a rudder line, a cap and a beacon; the horizontal tail with elevator lines */
  const T = S.tail, fin = slab(T.fin, 0.22, M.white);
  fin.position.set(0, S.Y0, 0); fin.name = "fin"; g.add(fin);
  const fp = finPaint(S);
  for (const s of [-1, 1]) {
    const f = decal(fp.w, fp.h, fp.tex);
    f.position.set(fp.cx, S.Y0 + fp.cy, s * 0.125);
    if (s < 0) f.rotation.y = Math.PI;
    g.add(f);
  }
  const rudderX = (y) => lerp(T.fin[2][0], T.fin[3][0], 1 - (y - 1.0) / (T.finTop - 1.0)) + 1.5;
  const l0 = [rudderX(T.finTop), T.finTop], l1 = [rudderX(1.0), 1.0];
  for (const s of [-1, 1]) {
    const r = box(0.03, Math.hypot(l0[1] - l1[1], l0[0] - l1[0]), 0.03, M.seam, (l0[0] + l1[0]) / 2, S.Y0 + (l0[1] + l1[1]) / 2, s * 0.125, g);
    r.rotation.z = -Math.atan2(l0[0] - l1[0], l0[1] - l1[1]);
  }
  box(Math.abs(T.fin[1][0] - T.fin[2][0]) + 0.2, 0.1, 0.3, M.grey, (T.fin[1][0] + T.fin[2][0]) / 2, S.Y0 + T.finTop + 0.04, 0, g);
  mesh(new THREE.SphereGeometry(0.13, 8, 6), M.red, (T.fin[1][0] + T.fin[2][0]) / 2 - 0.4, S.Y0 + T.finTop + 0.18, 0, g);
  for (const s of [-1, 1]) {
    const hs = slab(T.stab.pts, 0.2, M.white);
    hs.rotation.x = Math.PI / 2; hs.scale.y = s;
    hs.position.set(0, S.Y0 + T.stab.y, 0); hs.name = "stab";
    g.add(hs);
    const top = S.Y0 + T.stab.y + 0.11, sp = T.stab.pts[2][1];
    seamLine(g, [T.stab.pts[3][0] + 1.2, s * 0.4], [T.stab.pts[2][0] + 1.2, s * sp], top);
    mesh(new THREE.SphereGeometry(0.08, 6, 5), s < 0 ? M.red : M.green, T.stab.pts[2][0], S.Y0 + T.stab.y, s * sp, g);
  }
  /* red beacon under the belly and one on the top of the fuselage, a blade antenna on the roof, a pitot probe on the nose */
  const midX = (S.profile[0][0] + S.profile[S.profile.length - 1][0]) / 2 + 3;
  mesh(new THREE.SphereGeometry(0.1, 8, 6), M.red, midX, S.Y0 - radiusAt(S, midX) - 0.02, 0, g);
  mesh(new THREE.SphereGeometry(0.1, 8, 6), M.red, midX - 1, centreY(S, midX - 1) + radiusAt(S, midX - 1) + 0.03, 0, g);
  const blade = slab([[0, 0], [0.5, 0], [0.34, 0.38], [0.1, 0.38]], 0.025, M.metal);
  blade.position.set(midX + 4, centreY(S, midX + 4) + radiusAt(S, midX + 4) - 0.02, 0); g.add(blade);
  const noseX = S.profile[S.profile.length - 1][0];
  const pitot = cyl(0.02, 0.025, 0.5, M.steel, noseX - 1.6, S.Y0 + 0.05, 0, g, 6); pitot.rotation.z = Math.PI / 2;
  /* landing gear: the nose gear with a two-part leg and torque links and two wheels; the main bogies with a leg, a beam, a brace and the wheels */
  const G = S.gear, ngY = S.Y0 - radiusAt(S, G.noseX) + 0.1;
  const ng = grp(g, G.noseX, 0, 0);
  cyl(0.1, 0.1, ngY - 0.5, M.steel, 0, 0.5 + (ngY - 0.5) / 2, 0, ng, 10);
  cyl(0.07, 0.07, 0.62, M.metal, 0, 0.62, 0, ng, 8);
  box(0.06, 0.34, 0.05, M.steel, -0.12, ngY * 0.62, 0, ng).rotation.z = 0.4;
  box(0.06, 0.34, 0.05, M.steel, 0.12, ngY * 0.62, 0, ng).rotation.z = -0.4;
  box(0.08, 0.16, 0.12, M.white, 0.12, ngY - 0.2, 0, ng);
  for (const dz of [-0.28, 0.28]) wheel(G.noseWheel, 0.22, ng, 0, G.noseWheel, dz);
  box(0.5, 0.05, 0.14, M.steel, 0, G.noseWheel, 0, ng);
  for (const dz of [-1, 1]) box(1.1, 0.04, 0.5, M.grey, 0.1, ngY + 0.05, dz * 0.6, ng);
  for (const s of [-1, 1]) {
    const mg = grp(g, G.mainX, 0, s * G.mainZ), legTop = wg.y - 0.1;
    cyl(0.14, 0.14, legTop - 1.2, M.steel, 0, 1.2 + (legTop - 1.2) / 2, 0, mg, 10);
    cyl(0.1, 0.1, 0.8, M.metal, 0, 1.0, 0, mg, 8);
    box(0.07, 1.1, 0.07, M.steel, 0.5, 1.7, 0, mg).rotation.z = -0.5;
    box(G.bogie === 4 ? 1.7 : 0.3, 0.14, 0.3, M.steel, 0, G.wheel, 0, mg);
    const ws = G.bogie === 4 ? [[-0.65, -0.32], [-0.65, 0.32], [0.65, -0.32], [0.65, 0.32]] : [[0, -0.32], [0, 0.32]];
    for (const [dx, dz] of ws) wheel(G.wheel, 0.3, mg, dx, G.wheel, dz);
    box(2.0, 0.04, 0.9, M.grey, -0.2, wg.y - 0.18, s * -0.1, mg);
  }
  g.traverse((o) => { o.userData.noBatch = true; });
  return g;
}
export const dc8 = () => makeJet(DC8);
export const dc9 = () => makeJet(DC9);
export const radius = radiusAt, centre = centreY;
