/* Douglas DC-6B: the type of airliner that brought Haile Selassie I to Palisadoes (LIFE called it "the emperor's DC-6";
   Ethiopian Air Lines flew three DC-6Bs in the 1960s). Built to the published size: about 32.2 m long, 35.8 m span,
   8.7 m to the top of the fin, a 3.3 m fuselage, four radial engines with 4 m three-blade propellers, tricycle gear and
   the passenger door at the back on the left (port) side, as in the arrival photographs. Which of the three aircraft
   flew that day, and its exact paint, are not confirmed: there is no registration and no aircraft name, and the
   cheatline and tail bands are a general reconstruction (docs/games/selassie.md). No archive image textures.
   Local axes: the nose points along +x, the left (port) side is -z, the wheels stand on y = 0. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv, std, batchStatic } from "./gfx.js";
export const DC6 = {
  R: 1.65, // fuselage radius
  Y0: 3.5, // height of the fuselage centre line
  door: { x: -9.0, w: 0.86, h: 1.68, sill: 2.56 }, // the rear passenger door on the port side
  TAIL_Y: 3.5 + 0.66, // height of the horizontal tail's plane
  FIN_TOP: 8.74, // the top of the fin above the ground
};
const metal = solid(0xb4bab6, 0.34, 0.65),
  dark = solid(0x262d2b, 0.55),
  tyre = solid(0x1f2221, 0.9),
  glass = solid(0x2c4650, 0.22, 0.3),
  cream = solid(0xeeece2, 0.45, 0.1),
  yellowTip = solid(0xe1b53f, 0.6);
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
/* the fuselage outline: [x along the body, radius] */
const PROFILE = [
  [-16.2, 0.06],
  [-15.4, 0.34],
  [-13.2, 0.82],
  [-10.5, 1.28],
  [-7.2, 1.6],
  [-5.5, 1.65],
  [7.5, 1.65],
  [10.4, 1.6],
  [12.4, 1.45],
  [14.0, 1.12],
  [15.2, 0.72],
  [15.85, 0.32],
  [16.05, 0.04],
];
/* The tail cone is swept up, as on every DC-6: behind the rear door the underside rises steeply while the top line stays
   almost level, so the tail ends high, at about the height of the fuselage's upper half. centreY(x) is the height of the
   body's centre line at x (DC6.Y0 forward of the door). */
const UP0 = -9.6,
  UP = 0.85;
export function centreY(x) {
  const t = Math.max(0, Math.min(1, (UP0 - x) / (UP0 + 16.2)));
  return DC6.Y0 + UP * t ** 1.6;
}
export function radiusAt(x) {
  for (let j = 1; j < PROFILE.length; j++)
    if (x <= PROFILE[j][0]) {
      const a = PROFILE[j - 1],
        b = PROFILE[j];
      return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0]));
    }
  return 0;
}
function extrude(points, depth, mat, parent, bevel = 0) {
  const s = new THREE.Shape();
  points.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  return mesh(geo, mat, 0, 0, 0, parent);
}
/* a stylised lion's head in a gold ring: the Gleaner described "the insignia of a roaring lion on the front" */
function lionBadge() {
  return cv(256, 256, (x, W) => {
    x.clearRect(0, 0, W, W);
    const c = W / 2;
    x.fillStyle = "#d9b24a";
    x.beginPath();
    x.arc(c, c, 120, 0, 7);
    x.fill();
    x.fillStyle = "#2f6b45";
    x.beginPath();
    x.arc(c, c, 104, 0, 7);
    x.fill();
    x.fillStyle = "#d9b24a";
    x.beginPath();
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2,
        r = i % 2 ? 62 : 92;
      x.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
    }
    x.closePath();
    x.fill();
    x.fillStyle = "#b5862d";
    x.beginPath();
    x.ellipse(c, c + 6, 46, 54, 0, 0, 7);
    x.fill();
    x.fillStyle = "#e8cf86";
    x.beginPath();
    x.ellipse(c, c + 30, 24, 20, 0, 0, 7);
    x.fill();
    x.fillStyle = "#3a2a16";
    for (const s of [-1, 1]) {
      x.beginPath();
      x.ellipse(c + s * 18, c - 8, 7, 5, 0, 0, 7);
      x.fill();
    }
    x.beginPath();
    x.moveTo(c - 10, c + 16);
    x.lineTo(c + 10, c + 16);
    x.lineTo(c, c + 28);
    x.closePath();
    x.fill();
    x.fillRect(c - 16, c + 40, 32, 5);
  });
}
export function dc6() {
  const { R, Y0, door: D } = DC6;
  const g = grp();
  g.userData.noBatch = true;
  /* paint by height on the body: polished metal below, a gold cheatline with red and green lines through the windows, white above */
  const paint = cv(1024, 8, (ctx, W, H) => {
    for (let i = 0; i < W; i++) {
      const s = -Math.sin((i / W) * Math.PI * 2); // -1 underneath, +1 on top
      ctx.fillStyle =
        s > 0.52
          ? "#f1efe6"
          : s > 0.47
            ? "#a33f31"
            : s > 0.43
              ? "#f1efe6"
              : s > -0.04
                ? "#dcc56c"
                : s > -0.08
                  ? "#3f7a52"
                  : s > -0.16
                    ? "#dcc56c"
                    : s > -0.2
                      ? "#a33f31"
                      : "#c7ccc8";
      ctx.fillRect(i, 0, 1, H);
    }
  });
  const painted = std(paint, 0.42, { metalness: 0.18 });
  const lathe = (pts, mat, segs) => {
    const o = mesh(
      new THREE.LatheGeometry(
        pts.map(([x, r]) => new THREE.Vector2(r, x)),
        segs,
      ),
      mat,
      0,
      Y0,
      0,
      g,
    );
    o.rotation.z = -Math.PI / 2;
    return o;
  };
  {
    const body = lathe(PROFILE, painted, 56);
    // bake the turn and the height into the geometry, then lift the tail cone onto its swept-up centre line
    body.geometry.rotateZ(-Math.PI / 2);
    body.geometry.translate(0, Y0, 0);
    body.rotation.z = 0;
    body.position.y = 0;
    const P = body.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) P.setY(i, P.getY(i) + centreY(P.getX(i)) - Y0);
    body.geometry.computeVertexNormals();
  }
  /* wings: tapered, thinner and higher towards the tips (dihedral) */
  const xLE = (s) => lerp(2.0, -0.9, (s - 1) / 16.9),
    xTE = (s) => lerp(-4.0, -2.5, (s - 1) / 16.9),
    WY = 2.05;
  for (const side of [-1, 1]) {
    const pts = [
      [2.0, 0.6],
      [-0.9, 17.7],
      [-1.5, 17.9],
      [-2.5, 17.7],
      [-4.0, 0.6],
    ].map(([x, s]) => [x, -side * s]);
    const w = extrude(pts, 0.34, metal, g, 0.04);
    w.geometry.rotateX(-Math.PI / 2);
    const P = w.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) {
      const s = Math.abs(P.getZ(i)),
        y = P.getY(i);
      P.setY(i, WY + y * (1 - 0.55 * (s / 17.9)) + s * 0.065);
    }
    w.geometry.computeVertexNormals();
    /* horizontal tail: about 11.6 m across, flat (no dihedral), a straight tapered planform with a little sweep on the
       leading edge and rounded tips, set low on the swept-up tail cone, on its centre line, below the fin */
    const tp = extrude(
      [
        [-12.7, 0.3],
        [-14.3, 5.5],
        [-14.55, 5.74],
        [-14.95, 5.8],
        [-15.3, 5.72],
        [-15.5, 5.45],
        [-15.95, 0.3],
      ].map(([x, s]) => [x, -side * s]),
      0.2,
      metal,
      g,
      0.03,
    );
    tp.geometry.rotateX(-Math.PI / 2);
    {
      const P = tp.geometry.attributes.position;
      for (let i = 0; i < P.count; i++) {
        const s = Math.abs(P.getZ(i));
        // thinner towards the tips, centred on its own plane
        P.setY(i, DC6.TAIL_Y + (P.getY(i) - 0.1) * (1 - 0.5 * (s / 5.8)));
      }
      tp.geometry.computeVertexNormals();
    }
    /* navigation lights: red on the left wing tip, green on the right */
    mesh(
      new THREE.SphereGeometry(0.11, 10, 6),
      solid(side < 0 ? 0xc0392b : 0x3e9a5a, 0.3),
      -1.4,
      WY + 17.9 * 0.065 + 0.08,
      side * 17.85,
      g,
    );
  }
  /* engines: radial-engine nacelles with cowl rings, spinners and three-blade propellers (about 4 m across) */
  g.userData.props = [];
  for (const side of [-1, 1])
    for (const span of [4.9, 9.6]) {
      const z = side * span,
        y = WY + span * 0.065 + 0.5,
        front = xLE(span) + 2.3,
        back = xTE(span) + 0.2;
      const nac = mesh(
        new THREE.LatheGeometry(
          [
            [back, 0.08],
            [back + 1.2, 0.42],
            [front - 1.6, 0.66],
            [front - 0.25, 0.64],
            [front, 0.6],
          ].map(([x, r]) => new THREE.Vector2(r, x)),
          22,
        ),
        metal,
        0,
        y,
        z,
        g,
      );
      nac.rotation.z = -Math.PI / 2;
      const intake = cyl(0.5, 0.5, 0.06, dark, front + 0.01, y, z, g, 20);
      intake.rotation.z = Math.PI / 2;
      const spinner = mesh(
        new THREE.ConeGeometry(0.26, 0.62, 16),
        metal,
        front + 0.38,
        y,
        z,
        g,
      );
      spinner.rotation.z = -Math.PI / 2;
      const prop = grp(g, front + 0.18, y, z);
      prop.userData.noBatch = true;
      for (let i = 0; i < 3; i++) {
        const pivot = grp(prop);
        pivot.rotation.x = (i * Math.PI * 2) / 3 + 0.35;
        const blade = box(0.07, 1.7, 0.3, dark, 0, 1.05, 0, pivot);
        blade.rotation.y = 0.35;
        box(0.072, 0.22, 0.3, yellowTip, 0, 1.92, 0, pivot).rotation.y = 0.35;
      }
      prop.userData.noBatch = false;
      batchStatic(prop);
      prop.userData.noBatch = true;
      g.userData.props.push(prop);
      for (const dz of [-0.36, 0.36]) {
        const ex = cyl(0.06, 0.06, 0.5, dark, back + 1.4, y - 0.42, z + dz, g, 7);
        ex.rotation.z = Math.PI / 2;
      }
    }
  /* main gear under the inner engines, nose gear under the cockpit: every tyre touches y = 0 */
  for (const side of [-1, 1]) {
    const z = side * 4.9;
    box(0.16, 1.55, 0.16, metal, 0.3, 1.28, z, g);
    const drag = box(0.08, 1.5, 0.08, metal, -0.15, 1.3, z, g);
    drag.rotation.z = -0.35;
    box(0.12, 0.12, 0.75, metal, 0.3, 0.55, z, g);
    for (const dz of [-0.34, 0.34]) {
      const w = cyl(0.55, 0.55, 0.26, tyre, 0.3, 0.55, z + dz, g, 20);
      w.rotation.x = Math.PI / 2;
      const hub = cyl(0.25, 0.25, 0.27, metal, 0.3, 0.55, z + dz, g, 12);
      hub.rotation.x = Math.PI / 2;
    }
  }
  const noseX = 12.6,
    noseBottom = Y0 - radiusAt(noseX);
  box(0.12, noseBottom - 0.38 + 0.1, 0.12, metal, noseX, (noseBottom + 0.38) / 2, 0, g);
  for (const dz of [-0.2, 0.2]) {
    const w = cyl(0.38, 0.38, 0.2, tyre, noseX, 0.38, dz, g, 18);
    w.rotation.x = Math.PI / 2;
  }
  /* fin and rudder: the DC-6's large fin, its straight leading edge swept back from a long dorsal fillet that rises out of
     the top of the fuselage behind the door, a rounded tip 8.7 m above the ground, and a nearly upright rudder whose
     trailing edge comes down to the end of the tail cone. One outline, so the fillet runs into the fin without a seam.
     Painted with three bands in the Ethiopian colours fanning back from the root (a general reconstruction). */
  const top = (x) => centreY(x) + radiusAt(x); // the fuselage's top line
  const LE0 = [-11.7, top(-11.7) - 0.05],
    LE1 = [-14.55, DC6.FIN_TOP - 0.3];
  const leX = (y) => LE0[0] + ((y - LE0[1]) * (LE1[0] - LE0[0])) / (LE1[1] - LE0[1]);
  const finPts = [];
  // the dorsal fillet: a smooth curve from the top of the fuselage up into the leading edge
  const F0 = [-7.2, top(-7.2) - 0.06],
    F2 = [leX(5.55), 5.55],
    F1 = [-11.0, top(-11.0) + 0.06];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10,
      u = 1 - t;
    finPts.push([u * u * F0[0] + 2 * u * t * F1[0] + t * t * F2[0], u * u * F0[1] + 2 * u * t * F1[1] + t * t * F2[1]]);
  }
  finPts.push(LE1);
  // the rounded tip
  for (const a of [0.3, 0.42, 0.54, 0.66, 0.78]) {
    const cx = -15.12,
      cy = DC6.FIN_TOP - 0.62,
      ang = Math.PI * a; // from the front of the tip, over the top, to the back
    finPts.push([cx + Math.cos(ang) * 0.66, cy + Math.sin(ang) * 0.62]);
  }
  // the rudder's trailing edge, then back along the inside of the fuselage
  finPts.push([-15.86, DC6.FIN_TOP - 0.55], [-16.05, 6.0], [-16.22, top(-16.22) + 0.02], [-15.6, centreY(-15.6) + 0.05], [-12.5, centreY(-12.5) + 0.5], [-9.0, Y0 + 1.1], [-7.2, Y0 + 1.25]);
  const U0 = -16.6,
    UW = 9.8,
    V0 = 4.0,
    VH = 4.9;
  const finTex = cv(512, 512, (x, W, H) => {
    x.fillStyle = "#f1efe6";
    x.fillRect(0, 0, W, H);
    const P = (fx, fy) => [((fx - U0) / UW) * W, H - ((fy - V0) / VH) * H];
    const fan = (col, a, b) => {
      x.fillStyle = col;
      x.beginPath();
      x.moveTo(...P(-11.6, 5.0));
      x.lineTo(...P(-16.6, a));
      x.lineTo(...P(-16.6, b));
      x.closePath();
      x.fill();
    };
    fan("#a33f31", 5.2, 6.3);
    fan("#dcc56c", 6.3, 7.4);
    fan("#3f7a52", 7.4, 8.5);
  });
  finTex.repeat.set(1 / UW, 1 / VH);
  finTex.offset.set(-U0 / UW, -V0 / VH);
  const finMat = std(finTex, 0.45, { metalness: 0.1 });
  const fin = extrude(finPts, 0.26, finMat, g, 0.03);
  fin.geometry.translate(0, 0, -0.13);
  // a white tail light at the end of the tail cone
  mesh(new THREE.SphereGeometry(0.07, 8, 5), cream, -16.22, centreY(-16.22), 0, g);
  /* windows: rounded oblongs in the cheatline, both sides; the flight deck panes at the front */
  const win = new THREE.ShapeGeometry(
    (() => {
      const s = new THREE.Shape(),
        w = 0.36,
        h = 0.44,
        r = 0.1;
      s.moveTo(-w / 2 + r, -h / 2);
      s.lineTo(w / 2 - r, -h / 2);
      s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r);
      s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2);
      s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r);
      s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return s;
    })(),
    4,
  );
  const winMat = solid(0x223941, 0.25, 0.3, {
    polygonOffset: true,
    polygonOffsetFactor: -2,
    side: THREE.DoubleSide,
  });
  const wy = 0.3,
    wz = Math.sqrt(R * R - wy * wy) + 0.006;
  for (const side of [-1, 1])
    for (let i = 0; i < 12; i++) {
      const x = -7.6 + i * 1.3;
      if (side < 0 && Math.abs(x - D.x) < 0.8) continue;
      const o = mesh(win, winMat, x, Y0 + wy, side * wz, g);
      o.rotation.x = side * -Math.asin(wy / R);
    }
  for (const side of [-1, 1])
    for (const [x, h, w, tilt] of [
      [13.55, 0.62, 0.7, 0.42],
      [14.25, 0.52, 0.55, 0.62],
    ]) {
      const r = radiusAt(x),
        yy = 0.66;
      const pane = box(w, 0.42, 0.04, glass, x, Y0 + yy, side * Math.sqrt(Math.max(0.05, r * r - yy * yy)), g);
      pane.rotation.y = side * -tilt;
      pane.rotation.x = side * 0.35;
    }
  box(1.1, 0.03, 0.9, dark, 14.6, Y0 + 0.92, 0, g).rotation.z = -0.45;
  /* the rear passenger door: a dark opening on the port side, and a door that swings out and forward (userData.door.open(0..1)) */
  const dz = -(Math.sqrt(R * R - (D.sill + D.h / 2 - Y0) ** 2) + 0.004);
  box(D.w, D.h, 0.05, solid(0x1d2321, 0.8), D.x, D.sill + D.h / 2, dz + 0.012, g);
  for (const xx of [D.x - D.w / 2 - 0.03, D.x + D.w / 2 + 0.03])
    box(0.04, D.h + 0.06, 0.05, metal, xx, D.sill + D.h / 2, dz - 0.004, g);
  box(D.w + 0.1, 0.04, 0.05, metal, D.x, D.sill + D.h + 0.02, dz - 0.004, g);
  box(D.w + 0.1, 0.04, 0.05, metal, D.x, D.sill - 0.02, dz - 0.004, g);
  const hinge = grp(g, D.x + D.w / 2 + 0.03, D.sill + D.h / 2, dz - 0.03);
  hinge.userData.noBatch = true;
  const leaf = box(D.w, D.h - 0.04, 0.06, cream, -D.w / 2, 0, 0, hinge);
  box(D.w * 0.9, 0.12, 0.065, solid(0xdcc56c, 0.5), -D.w / 2, 0.3, 0, hinge);
  leaf.userData.noBatch = true;
  hinge.userData.open = (k) => {
    hinge.rotation.y = -k * 1.75;
  };
  hinge.userData.open(0);
  g.userData.door = hinge;
  /* titles on both sides, wrapped onto the body: the airline's name and the lion on the nose (no registration or aircraft name: not confirmed) */
  const text = cv(1024, 96, (x, W) => {
    x.clearRect(0, 0, W, 96);
    x.fillStyle = "#9d3a2e";
    x.font = "bold 64px Georgia";
    x.textAlign = "center";
    x.fillText("ETHIOPIAN", W / 2, 72);
  });
  const lion = lionBadge();
  function wrapped(tex, cx, cy, w, h, side) {
    const geo = new THREE.PlaneGeometry(w, h, 32, 6),
      p = geo.attributes.position,
      uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + cx,
        y = p.getY(i) + cy,
        r = radiusAt(x);
      p.setXYZ(i, x, y, side * (Math.sqrt(Math.max(0.006, r * r - (y - Y0) ** 2)) + 0.014));
      if (side < 0) uv.setX(i, 1 - uv.getX(i));
    }
    geo.computeVertexNormals();
    const mat = std(tex, 0.6, {
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    mat.forceSinglePass = true;
    g.add(new THREE.Mesh(geo, mat));
  }
  for (const side of [-1, 1]) {
    wrapped(text, 2.2, Y0 + 1.08, 8.4, 0.78, side);
    wrapped(lion, 12.35, Y0 + 0.02, 0.95, 0.95, side);
  }
  /* aerial mast and wire */
  box(0.04, 0.5, 0.04, metal, 3.5, Y0 + R + 0.24, 0, g);
  const wire = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(3.5, Y0 + R + 0.48, 0),
    new THREE.Vector3(-14.3, 8.2, 0),
  ]);
  g.add(new THREE.LineSegments(wire, new THREE.LineBasicMaterial({ color: 0x656b66 })));
  return g;
}
