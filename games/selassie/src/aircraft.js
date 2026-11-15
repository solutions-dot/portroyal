/* DC-6 reconstruction: four piston engines, tapered wings, round cabin windows,
   tricycle gear and Ethiopian Air Lines period livery. No archive image textures. */
import * as THREE from "three";
import { grp, mesh, box, cyl, solid, cv, std, batchStatic } from "./gfx.js";
const metal = solid(0xa9b2af, 0.36, 0.6),
  cream = solid(0xe8e4d5, 0.48, 0.18),
  dark = solid(0x27312e, 0.5),
  red = solid(0x963f34, 0.6),
  glass = solid(0x345660, 0.27, 0.25),
  gold = solid(0xd8b34c),
  green = solid(0x3e7c50);
function shape(points, depth, mat, parent, x = 0, y = 0, z = 0) {
  const s = new THREE.Shape();
  points.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  s.closePath();
  return mesh(
    new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false }),
    mat,
    x,
    y,
    z,
    parent,
  );
}
function line(points, mat, parent) {
  const g = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const o = new THREE.Line(g, new THREE.LineBasicMaterial({ color: mat }));
  parent.add(o);
  return o;
}
function ball(r, mat, x, y, z, parent, scale = [1, 1, 1]) {
  const o = mesh(new THREE.SphereGeometry(r, 16, 10), mat, x, y, z, parent);
  o.scale.set(...scale);
  return o;
}
export function dc6() {
  const g = grp();
  const paint = cv(1024, 16, (ctx, W, H) => {
    for (let i = 0; i < W; i++) {
      const y = 3.05 - 1.26 * Math.sin((i / W) * Math.PI * 2);
      ctx.fillStyle =
        y > 3.52
          ? "#edece1"
          : y > 3.48
            ? "#a74132"
            : y > 3.12
              ? "#dccb72"
              : y > 3.08
                ? "#477d58"
                : y > 2.85
                  ? "#dccb72"
                  : y > 2.81
                    ? "#a74132"
                    : "#dcded6";
      ctx.fillRect(i, 0, 1, H);
    }
  });
  const painted = std(paint, 0.46, { metalness: 0.22 });
  g.userData.noBatch = true;
  const profile = [
    [-15.8, 0.02],
    [-14.8, 0.3],
    [-12.4, 0.7],
    [-9.5, 1.05],
    [-6, 1.22],
    [7.5, 1.26],
    [10.6, 1.16],
    [12, 0.95],
    [13.5, 0.65],
    [14.5, 0.28],
    [14.8, 0.02],
  ];
  const fuselage = mesh(
    new THREE.LatheGeometry(
      profile.map(([x, r]) => new THREE.Vector2(r, x)),
      48,
    ),
    painted,
    0,
    3.05,
    0,
    g,
  );
  fuselage.rotation.z = -Math.PI / 2;
  // Polished underside follows the same profile, just below the painted body.
  const belly = mesh(
    new THREE.LatheGeometry(
      profile.map(([x, r]) => new THREE.Vector2(r + 0.005, x)),
      32,
      0.2,
      Math.PI - 0.4,
    ),
    metal,
    0,
    3.05,
    0,
    g,
  );
  belly.rotation.z = -Math.PI / 2;
  for (const side of [-1, 1]) {
    const wing = shape(
      [
        [-6.8, 0.9],
        [2.1, 0.9],
        [-0.4, 9.5],
        [-3, 16.8],
        [-5, 17.1],
        [-6.8, 8.6],
      ],
      0.18,
      metal,
      g,
      0,
      2.0,
      0,
    );
    wing.rotation.x = (side * Math.PI) / 2;
    // Panel and flap divisions use lines rather than extra solid meshes.
    line(
      [
        [-6.5, 2.04, side * 2],
        [-5.1, 2.04, side * 8.5],
        [-4.1, 2.04, side * 16.3],
      ],
      0x788783,
      g,
    );
    for (const z of [4, 7.5, 11, 14.5])
      line(
        [
          [-5.8, 2.04, side * z],
          [-1.4 - (z - 4) * 0.23, 2.04, side * z],
        ],
        0x87918c,
        g,
      );
    const tail = shape(
      [
        [-14.3, 0.4],
        [-10.5, 0.4],
        [-11.8, 6],
        [-13.6, 6.3],
      ],
      0.12,
      metal,
      g,
      0,
      3.1,
      0,
    );
    tail.rotation.x = (side * Math.PI) / 2;
    ball(
      0.105,
      solid(side > 0 ? 0x569d69 : 0xbb4639, 0.2),
      -4.1,
      2.02,
      side * 17,
      g,
    );
    // Round-corner cabin windows and separate polished rims.
    for (let i = 0; i < 12; i++) {
      const x = -8 + i * 1.38,
        y = 3.45,
        z = side * 1.245;
      const rim = mesh(
        new THREE.TorusGeometry(0.235, 0.025, 5, 12),
        metal,
        x,
        y,
        z,
        g,
      );
      rim.scale.set(0.78, 1, 1);
      ball(0.215, glass, x, y, z + side * 0.012, g, [0.76, 1, 0.09]);
    }
    // Flight-deck glazing sits on the taper, not on the cabin cylinder.
    for (const [x, z, w] of [
      [11.3, 0.82, 0.78],
      [12.1, 0.6, 0.65],
      [12.7, 0.33, 0.5],
    ]) {
      const pane = box(w, 0.47, 0.045, glass, x, 3.57, side * z, g);
      pane.rotation.y = side * 0.28;
    }
    line(
      [
        [10.8, 3.57, side * 0.92],
        [12, 3.62, side * 0.68],
        [13.3, 3.38, side * 0.15],
      ],
      0xaaa99b,
      g,
    );
  }
  const fin = shape(
    [
      [-15.1, 3.1],
      [-15.35, 6.8],
      [-13.4, 7.15],
      [-10.4, 3.1],
    ],
    0.18,
    cream,
    g,
    0,
    0,
    -0.09,
  );
  for (const side of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const low = 3.45 + i * 1.02,
        high = low + 1.02;
      shape(
        [
          [-11.1, 3.4],
          [-14.95, low],
          [-14.95, high],
        ],
        0.006,
        [red, gold, green][i],
        g,
        0,
        0,
        side * 0.108,
      );
      for (let j = 0; j < 4; j++) {
        const yy = low + ((high - low) * j) / 4;
        line(
          [
            [-11.1, 3.4, side * 0.12],
            [-14.95, yy, side * 0.12],
          ],
          0x4a5b43,
          g,
        );
      }
    }
  // Four radial engines, nacelles, cooling rings, exhausts and three-blade propellers.
  g.userData.props = [];
  for (const side of [-1, 1])
    for (const span of [4.3, 9]) {
      const z = side * span;
      const nacelle = cyl(0.55, 0.43, 3.3, metal, 0.15, 2.08, z, g, 20);
      nacelle.rotation.z = Math.PI / 2;
      const cowl = mesh(
        new THREE.TorusGeometry(0.48, 0.065, 6, 20),
        cream,
        1.84,
        2.08,
        z,
        g,
      );
      cowl.rotation.y = Math.PI / 2;
      const core = cyl(0.42, 0.42, 0.07, dark, 1.86, 2.08, z, g, 16);
      core.rotation.z = Math.PI / 2;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        line(
          [
            [1.91, 2.08 + Math.cos(a) * 0.12, z + Math.sin(a) * 0.12],
            [1.91, 2.08 + Math.cos(a) * 0.38, z + Math.sin(a) * 0.38],
          ],
          0x77807b,
          g,
        );
      }
      const spinner = mesh(
        new THREE.ConeGeometry(0.17, 0.48, 14),
        metal,
        2.12,
        2.08,
        z,
        g,
      );
      spinner.rotation.z = -Math.PI / 2;
      const prop = grp(g, 2.07, 2.08, z);
      prop.userData.noBatch = true;
      for (let i = 0; i < 3; i++) {
        const pivot = grp(prop);
        pivot.rotation.x = (i * Math.PI * 2) / 3;
        box(0.07, 1.02, 0.17, dark, 0, 0.75, 0, pivot);
        box(0.075, 0.13, 0.18, gold, 0, 1.22, 0, pivot);
      }
      prop.userData.noBatch = false;
      batchStatic(prop);
      prop.userData.noBatch = true;
      g.userData.props.push(prop);
      const exhaust = cyl(0.07, 0.07, 0.6, dark, -1.3, 1.64, z + 0.35, g, 7);
      exhaust.rotation.z = 0.8;
    }
  // Main wheel pairs and the smaller nose pair. Every tyre touches the apron.
  for (const side of [-1, 1]) {
    box(0.09, 1.3, 0.1, metal, -2.4, 1.1, side * 3.3, g);
    const brace = box(0.07, 1.4, 0.07, metal, -2.6, 1.14, side * 3.55, g);
    brace.rotation.z = 0.25;
    for (const dz of [-0.2, 0.2]) {
      const w = cyl(0.4, 0.4, 0.2, dark, -2.4, 0.4, side * 3.3 + dz, g, 18);
      w.rotation.x = Math.PI / 2;
      const hub = cyl(
        0.19,
        0.19,
        0.205,
        metal,
        -2.4,
        0.4,
        side * 3.3 + dz,
        g,
        12,
      );
      hub.rotation.x = Math.PI / 2;
    }
  }
  box(0.1, 2, 0.1, metal, 10.4, 1.3, 0, g);
  for (const z of [-0.16, 0.16]) {
    const w = cyl(0.3, 0.3, 0.17, dark, 10.4, 0.3, z, g, 16);
    w.rotation.x = Math.PI / 2;
  }
  const door = box(0.98, 1.9, 0.035, dark, -7.7, 3.38, 1.265, g);
  door.userData.noBatch = true;
  g.userData.door = door;
  for (const x of [-8.22, -7.18])
    box(0.025, 1.94, 0.04, metal, x, 3.38, 1.3, g);
  box(1.06, 0.025, 0.04, metal, -7.7, 4.35, 1.3, g);
  const text = cv(1024, 80, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#923c31";
    x.font = "bold 57px Georgia";
    x.textAlign = "center";
    x.fillText("ETHIOPIAN", W / 2, 61);
  });
  function paintedText(tex, cx, cy, w, h, side) {
    const geo = new THREE.PlaneGeometry(w, h, 32, 6),
      p = geo.attributes.position,
      uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + cx,
        y = p.getY(i) + cy;
      let r = 1.25;
      for (let j = 1; j < profile.length; j++)
        if (x <= profile[j][0]) {
          const a = profile[j - 1],
            b = profile[j],
            t = (x - a[0]) / (b[0] - a[0]);
          r = a[1] + (b[1] - a[1]) * t;
          break;
        }
      p.setXYZ(
        i,
        x,
        y,
        side * (Math.sqrt(Math.max(0.006, r * r - (y - 3.05) ** 2)) + 0.012),
      );
      if (side < 0) uv.setX(i, 1 - uv.getX(i));
    }
    geo.computeVertexNormals();
    const mat = std(tex, 1, {
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    mat.forceSinglePass = true;
    const o = new THREE.Mesh(geo, mat);
    g.add(o);
  }
  const name = cv(768, 96, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#4b594d";
    x.font = "italic 62px Georgia";
    x.textAlign = "center";
    x.fillText("The White Nile", W / 2, 72);
  });
  const reg = cv(512, 96, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#263b38";
    x.font = "700 64px sans-serif";
    x.textAlign = "center";
    x.fillText("ET-AAZ", W / 2, 75);
  });
  for (const side of [-1, 1]) {
    paintedText(text, 3, 3.96, 11, 0.55, side);
    paintedText(name, -4, 3.88, 4.6, 0.42, side);
    paintedText(reg, -9.5, 2.53, 3, 0.45, side);
  }
  // Small aerials and a dark anti-glare panel help the silhouette at close range.
  box(2.5, 0.035, 1.35, dark, 11.9, 3.67, 0, g);
  box(0.035, 0.45, 0.035, metal, 2.5, 4.08, 0, g);
  line(
    [
      [2.5, 4.3, 0],
      [-13.6, 6.4, 0],
    ],
    0x686e67,
    g,
  );
  const groups = new Map(),
    remove = [];
  g.traverse((o) => {
    if (o.isLine && !o.isLineSegments) {
      const key = o.material.color.getHex();
      if (!groups.has(key)) groups.set(key, []);
      const a = o.geometry.attributes.position;
      for (let i = 1; i < a.count; i++) {
        groups
          .get(key)
          .push(
            a.getX(i - 1),
            a.getY(i - 1),
            a.getZ(i - 1),
            a.getX(i),
            a.getY(i),
            a.getZ(i),
          );
      }
      remove.push(o);
    }
  });
  for (const o of remove) o.parent.remove(o);
  for (const [color, points] of groups) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color })));
  }
  return g;
}
