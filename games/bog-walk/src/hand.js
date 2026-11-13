/* games/bog-walk/src/hand.js: what you hold. A torch in your right hand, low down in front of you (a child of the camera).
   The hand is modelled from a photograph of a torch held up in a right hand (the owner's reference), seen as you see your own: from behind, above and a little
   to the left. What that picture shows, and what this file builds:
     - the handle passes right through the closed fist;
     - four fingers, stacked tight with no gaps, each one going round the FAR side of the handle, round its left side and back across the near side,
       so the fingertips (and their nails) come back toward you and tuck in under the thumb;
     - one thumb, lying up along the near side of the handle, its tip well above the index finger, with a thumbnail;
     - the fleshy base of the thumb and the heel of the palm on the right, the wrist, and the forearm going off to the lower right, toward you.
   Owner rules: a held thing is held properly, never floats, never passes through the body and never covers the middle of the view.
   The dev check ?test=held counts the fingers and the thumb, checks that every finger goes round the handle, and tests the picture on the screen. */
import * as THREE from 'three';
import { flameTex, woodTex, ragTex } from './gfx.js';

const DEG = Math.PI / 180;

/* A smooth limb: circles (flattened if asked) swept along a curve through the points [[x, y, z, radius], ...], with rounded ends.
   o.up is the direction the cross-section's first axis leans toward; o.flat stretches the section along it; o.shade(position, normal) returns
   a brightness from 0 to 1 for each vertex (soft shadow where fingers touch each other and the handle). */
function limbGeo(pts, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal'), n = pts.length - 1;
  const S = o.steps || 22, M = o.radial || 14, K = 4, up = o.up || new THREE.Vector3(0, 1, 0), flat = o.flat || 1, pos = [], starts = [];
  const rAt = (t) => { const f = Math.min(n - 1e-6, Math.max(0, t * n)), i = Math.floor(f), k = f - i; return pts[i][3] * (1 - k) + pts[i + 1][3] * k; };
  const N = new THREE.Vector3(), B = new THREE.Vector3();
  const ring = (c, tan, r) => {
    N.copy(up).addScaledVector(tan, -up.dot(tan)); if (N.lengthSq() < 1e-6) N.set(1, 0, 0).addScaledVector(tan, -tan.x); N.normalize(); B.crossVectors(tan, N);
    starts.push(pos.length / 3);
    for (let j = 0; j < M; j++) { const a = j / M * Math.PI * 2, u = r * flat * Math.cos(a), v = r * Math.sin(a); pos.push(c.x + N.x * u + B.x * v, c.y + N.y * u + B.y * v, c.z + N.z * u + B.z * v); }
  };
  const p0 = curve.getPoint(0), t0 = curve.getTangent(0).normalize(), r0 = rAt(0), p1 = curve.getPoint(1), t1 = curve.getTangent(1).normalize(), r1 = rAt(1);
  for (let k = K; k >= 1; k--) { const a = k / K * Math.PI / 2; ring(p0.clone().addScaledVector(t0, -r0 * Math.sin(a)), t0, Math.max(1e-4, r0 * Math.cos(a))); }
  for (let i = 0; i <= S; i++) { const t = i / S; ring(curve.getPoint(t), curve.getTangent(t).normalize(), rAt(t)); }
  for (let k = 1; k <= K; k++) { const a = k / K * Math.PI / 2; ring(p1.clone().addScaledVector(t1, r1 * Math.sin(a)), t1, Math.max(1e-4, r1 * Math.cos(a))); }
  const idx = [];
  for (let q = 0; q < starts.length - 1; q++) for (let j = 0; j < M; j++) { const a = starts[q] + j, b = starts[q] + (j + 1) % M, c = starts[q + 1] + (j + 1) % M, d = starts[q + 1] + j; idx.push(a, b, c, a, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  { /* make sure the faces look outward: test one vertex on a middle ring against the middle of the limb, and turn the faces round if they look in */
    const mid = starts[K + (S >> 1)], c = curve.getPoint(0.5), P = g.attributes.position, Nn = g.attributes.normal, v = new THREE.Vector3(P.getX(mid) - c.x, P.getY(mid) - c.y, P.getZ(mid) - c.z);
    if (v.dot(new THREE.Vector3(Nn.getX(mid), Nn.getY(mid), Nn.getZ(mid))) < 0) { for (let i = 0; i < idx.length; i += 3) { const s = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = s; } g.setIndex(idx); g.computeVertexNormals(); } }
  const P = g.attributes.position, Nn = g.attributes.normal, col = new Float32Array(P.count * 3), p = new THREE.Vector3(), nn = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); nn.fromBufferAttribute(Nn, i); const k = o.shade ? Math.max(0, Math.min(1, o.shade(p, nn))) : 1; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeBoundingBox(); return g;
}

export function makeHand(camera) {
  const root = new THREE.Group(), inner = new THREE.Group(); camera.add(root); root.add(inner);
  /* Everything is in the hand's own space: the handle runs straight up the y axis through (0, y, 0); +z is toward you, +x is to your right. */
  const RH = 0.0148, RF = 0.0098, Y0 = -0.43, GAP = 0.0188;   /* handle radius at the grip, finger radius, height of the index finger, spacing of the fingers */
  const skin = new THREE.MeshStandardMaterial({ color: 0x7a4a2e, roughness: 0.62, metalness: 0, vertexColors: true, emissive: 0x160a05 });
  const nailMat = new THREE.MeshStandardMaterial({ color: 0xb48a74, roughness: 0.32, emissive: 0x1a100b });
  const add = (geo, mat, name) => { const m = new THREE.Mesh(geo, mat); m.name = name; inner.add(m); return m; };

  /* ----- the torch: a turned wooden handle with a rounded butt, a head of oil-soaked rags bound on with wire, and a flame ----- */
  const stickA = new THREE.Vector3(0, -0.575, 0), stickB = new THREE.Vector3(0, -0.25, 0);
  const wTex = woodTex(), rTex = ragTex(); rTex.repeat.set(2, 1);
  const wood = new THREE.MeshStandardMaterial({ map: wTex, bumpMap: wTex, bumpScale: 0.6, roughness: 0.78, emissive: 0x100904 });
  const profile = [[0.0001, -0.575], [0.009, -0.5735], [0.0128, -0.566], [0.0138, -0.555], [0.0132, -0.545], [0.0146, -0.535], [RH, -0.5], [RH, -0.4], [0.0142, -0.33], [0.0134, -0.25]].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(profile, 18), wood, 'stick');
  const rag = new THREE.MeshStandardMaterial({ map: rTex, bumpMap: rTex, bumpScale: 2.4, roughness: 1, emissive: 0x5a2208, emissiveIntensity: 1 });
  const headProfile = [[0.0134, -0.262], [0.021, -0.258], [0.0285, -0.246], [0.033, -0.226], [0.0345, -0.2], [0.033, -0.178], [0.0275, -0.162], [0.018, -0.152], [0.007, -0.148], [0.0001, -0.1475]].map(([r, y]) => new THREE.Vector2(r, y));
  const head = add(new THREE.LatheGeometry(headProfile, 20), rag, 'head');
  { const hp = head.geometry.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < hp.count; i++) { v.fromBufferAttribute(hp, i); const a = Math.atan2(v.z, v.x), k = 1 + 0.06 * Math.sin(a * 3 + v.y * 60) + 0.04 * Math.sin(a * 7 - v.y * 95); hp.setXYZ(i, v.x * k, v.y, v.z * k); } head.geometry.computeVertexNormals(); }   /* lumpy, as a bundle of rags is */
  const wire = new THREE.MeshStandardMaterial({ color: 0x2c2a28, roughness: 0.5, metalness: 0.7 });
  for (const [y, r] of [[-0.251, 0.0262], [-0.2445, 0.0293], [-0.184, 0.0343]]) { const w = add(new THREE.TorusGeometry(r, 0.0017, 5, 28), wire, 'binding'); w.rotation.x = Math.PI / 2; w.position.y = y; }
  const fTex = flameTex(), flameMat = () => new THREE.SpriteMaterial({ map: fTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
  const flame = new THREE.Sprite(flameMat()); flame.name = 'flame'; flame.position.set(0, -0.062, 0); inner.add(flame);
  const core = new THREE.Sprite(flameMat()); core.name = 'flamecore'; core.position.set(0, -0.088, 0.001); inner.add(core);   /* a smaller, brighter flame inside the first */
  const light = new THREE.PointLight(0xffa860, 4, 18, 1.2); light.position.set(-0.02, -0.07, 0.1); inner.add(light);

  /* ----- the four fingers. Angles are measured round the handle: 0 is to your right, 90 toward you, 180 to your left, -90 away from you.
     A finger leaves its knuckle on the far right, goes round the far side, bends at the middle joint on the far left, comes toward you down the left side,
     bends again and lies across the near side, its tip tucked in on the near right. The joints stand a little proud, as knuckles do. ----- */
  const fingerShade = (yc, r) => (p, n) => { const rad = Math.hypot(p.x, p.z) || 1, toAxis = -(n.x * p.x + n.z * p.z) / rad, side = Math.abs(n.y);
    return 1 - 0.5 * Math.pow(side, 3) * (Math.abs(p.y - yc) > r * 0.45 ? 1 : 0.4) - 0.35 * Math.max(0, toAxis); };   /* darker where a finger touches its neighbours and the handle */
  const FING = [ { k: 1.0, end: -287 }, { k: 1.04, end: -296 }, { k: 0.98, end: -290 }, { k: 0.86, end: -276 } ];   /* index, middle, ring, little: thickness, and how far round each one reaches */
  let y = Y0; const fingerYs = [];
  FING.forEach((F, i) => {
    const r = RF * F.k; if (i > 0) y -= GAP * (FING[i - 1].k + F.k) / 2; fingerYs.push(y);
    const rho = RH + r * 0.92, at = (deg, m, dy) => [Math.cos(deg * DEG) * rho * m, y + dy, Math.sin(deg * DEG) * rho * m];
    const pts = [[...at(-32, 1.34, 0.001), r * 1.1], [...at(-88, 1.06, 0), r * 1.04], [...at(-148, 1.13, -0.0005), r * 1.07], [...at(-196, 1.0, -0.001), r * 0.99], [...at(-242, 1.09, -0.002), r * 1.0], [...at(F.end, 0.99, -0.003), r * 0.88]];
    add(limbGeo(pts, { steps: 30, radial: 14, shade: fingerShade(y, r) }), skin, 'finger');
    /* the fingernail, on the outside of the last joint, facing you */
    const a = (F.end + 20) * DEG, out = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), tan = new THREE.Vector3(Math.sin(a), 0, -Math.cos(a)), nail = add(new THREE.SphereGeometry(1, 12, 8), nailMat, 'fingernail');
    nail.scale.set(r * 0.74, r * 0.66, r * 0.2); nail.position.set(out.x * (rho + r * 0.74), y - 0.0026, out.z * (rho + r * 0.74)); nail.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tan, new THREE.Vector3(0, 1, 0), out));
  });
  const yTop = fingerYs[0] + RF, yBot = fingerYs[3] - RF * 0.86, yMid = (yTop + yBot) / 2;

  /* ----- the palm and the back of the hand: a rounded slab on the right of the handle, from the knuckles (far) to the wrist (near you) ----- */
  const palmShade = (p, n) => 1 - 0.3 * Math.max(0, -n.x) * (p.z < 0.03 ? 1 : 0.3);
  add(limbGeo([[0.0318, yMid, -0.021, 0.0165], [0.0322, yMid - 0.001, 0.022, 0.0172], [0.036, yMid - 0.006, 0.06, 0.016]], { steps: 14, radial: 20, flat: 2.42, shade: palmShade }), skin, 'palm');
  /* the fleshy base of the thumb, bulging toward you */
  { const g = new THREE.SphereGeometry(1, 18, 14); g.scale(0.0195, 0.0315, 0.0225); g.translate(0.0285, Y0 - 0.014, 0.041); const c = new Float32Array(g.attributes.position.count * 3).fill(1); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.computeBoundingBox(); add(g, skin, 'thenar'); }
  /* the thumb: up from the base, along the near side of the handle, to a tip well above the index finger */
  const thumbPts = [[0.0325, Y0 - 0.016, 0.051, 0.0138], [0.0215, Y0 + 0.014, 0.0405, 0.0131], [0.0105, Y0 + 0.041, 0.0305, 0.0121], [0.0045, Y0 + 0.064, 0.0252, 0.0104]];
  add(limbGeo(thumbPts, { steps: 22, radial: 14, up: new THREE.Vector3(0, 0, 1), flat: 0.9, shade: (p, n) => 1 - 0.3 * Math.max(0, -(n.x * p.x + n.z * p.z) / (Math.hypot(p.x, p.z) || 1)) }), skin, 'thumb');
  { const nail = add(new THREE.SphereGeometry(1, 12, 8), nailMat, 'thumbnail'), tp = new THREE.Vector3(0.0062, Y0 + 0.0595, 0.0338), along = new THREE.Vector3(-0.006, 0.023, -0.0053).normalize(), out = new THREE.Vector3(0.25, 0.18, 0.95).normalize(), side = new THREE.Vector3().crossVectors(along, out).normalize(); out.crossVectors(side, along).normalize();
    nail.scale.set(0.0064, 0.0076, 0.0021); nail.position.copy(tp); nail.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, along, out)); }

  /* ----- the wrist and forearm go off toward you and down to the right, and leave through the bottom of the screen; a rolled shirt sleeve higher up ----- */
  const F0 = new THREE.Vector3(0.036, yMid - 0.006, 0.058), FD = new THREE.Vector3(0.2, -0.5, 0.84).normalize(), fa = (d, dx = 0) => { const p = F0.clone().addScaledVector(FD, d); return [p.x + dx, p.y, p.z]; };
  add(limbGeo([[...fa(-0.006), 0.0168], [...fa(0.03), 0.0172], [...fa(0.1), 0.0205], [...fa(0.2), 0.0245]], { steps: 16, radial: 18, flat: 1.5 }), skin, 'wrist');
  const cloth = new THREE.MeshStandardMaterial({ color: 0x8a8272, roughness: 0.95, emissive: 0x14110b, vertexColors: true });
  add(limbGeo([[...fa(0.105), 0.0275], [...fa(0.13), 0.0288], [...fa(0.145), 0.0275]], { steps: 8, radial: 18, flat: 1.42 }), cloth, 'cuff');   /* the roll of the sleeve */
  add(limbGeo([[...fa(0.135), 0.0258], [...fa(0.22), 0.03], [...fa(0.3), 0.034]], { steps: 12, radial: 18, flat: 1.4 }), cloth, 'sleeve');
  inner.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.renderOrder = 10; } });

  const FIST = new THREE.Vector3(0, yMid, 0.004);   /* the middle of the fist: the hand is turned and scaled about this point */
  const H = { root, inner, stickA, stickB, flame, light, lift: 0, baseY: -0.25, tune: null, s: 1, cs: 0,
    setLift(u) { H.lift = u; root.position.y = H.baseY + u; },
    setCine(c) { H.cs = c; const s = H.s * (1 - 0.14 * c); inner.scale.setScalar(s); inner.position.copy(FIST).multiplyScalar(-s).applyEuler(inner.rotation); },   /* the black bars push the words down, so the torch shrinks a little about the fist to keep its flame clear of them */   /* lift (in camera units): the black bars are in, so the whole hand rises just enough to keep the fist clear of the bottom bar */
    lowestFistPx(cam, screenH) {   /* the lowest point of the fingers, thumb and palm on the screen, in pixels from the top */
      cam.updateMatrixWorld(true); const v = new THREE.Vector3(); let low = 0;
      inner.traverse((o) => { if (!o.isMesh || !['finger', 'palm', 'thumb', 'thenar'].includes(o.name)) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox;
        for (const x of [bb.min.x, bb.max.x]) for (const y2 of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y2, z).applyMatrix4(o.matrixWorld).project(cam); low = Math.max(low, (-v.y * 0.5 + 0.5) * screenH); } });
      return low; },
    place(aspect, fov, ph, pw) {   /* the fist sits at a fixed low spot, fully in view; the torch is turned and scaled about it, so a small or narrow screen shrinks the torch, not the grip */
      const depth = 0.55, halfW = Math.tan(fov * Math.PI / 360) * aspect * depth, wide = aspect >= 1.2, s = 0.94 * Math.min(1, Math.max(0.55, Math.min(ph / 640, pw / 560)));   /* words keep their pixel size, so a short or narrow screen gets a smaller torch to leave them room */
      const tn = H.tune || {};
      root.position.set(wide ? Math.min(0.34, halfW * 0.7) : halfW * 0.36, H.baseY + H.lift, -depth); root.rotation.set(0, tn.ry ?? 0.34, 0);
      inner.rotation.set(tn.rx ?? -0.2, 0, tn.rz ?? (wide ? -0.15 : -0.07)); H.s = s; H.setCine(H.cs); },
    update(time, k) {
      rag.emissiveIntensity = 0.1 + 0.9 * Math.min(1, k); const f = k * (0.86 + 0.1 * Math.sin(time * 9.1) + 0.06 * Math.sin(time * 21)), f2 = k * (0.9 + 0.1 * Math.sin(time * 13.3 + 1));
      flame.material.opacity = Math.max(0, Math.min(1, f)); flame.visible = f > 0.02; flame.scale.set(0.17 * (0.92 + 0.14 * Math.sin(time * 11)), 0.26 * (0.9 + 0.18 * Math.sin(time * 14)), 1);
      core.material.opacity = Math.max(0, Math.min(1, f2)); core.visible = f2 > 0.02; core.scale.set(0.085 * (0.9 + 0.2 * Math.sin(time * 17 + 2)), 0.15 * (0.88 + 0.22 * Math.sin(time * 19 + 0.5)), 1); core.position.x = 0.004 * Math.sin(time * 7.3);
      light.intensity = 4 * Math.max(0, f); } };
  return H;
}
