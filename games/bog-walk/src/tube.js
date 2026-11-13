/* games/bog-walk/src/tube.js: the inside of the Bog Walk Tube, built in code.
   The pipe is 8 feet (2.44 m) across (R = 1.22 m), lying along the z axis, with its lowest point at y = 0. Sand and silt fill the bottom to y = SAND,
   so the flat floor you walk on is about 2 m wide and there is about 1.9 m of headroom. The manhole in the roof is 2 ft 8 in (0.81 m) across.
   Facts checked so far are in docs/games/bog-walk.md. The rivets, flanges, tools and torches are a general picture of a riveted pipe of the time,
   not a copy of the real one (nothing is known yet about how it was fitted out). */
import * as THREE from 'three';
import { ironTex, sandTex, rustPatchTex, steelPatchTex, flameTex, skyTex, beamTex, poolTex, rippleNormalTex, rng } from './gfx.js';

export const R = 1.22, SAND = 0.5, ZMIN = -62, ZMAX = 14, ZM = 7.75, HOLE = 0.405, RING = 1.5, FLANGE = 12;
export const halfChord = (y) => Math.sqrt(Math.max(0, R * R - (y - R) * (y - R)));   /* half the width of the pipe at height y */
const UP = new THREE.Vector3(0, 1, 0);
const onWall = (theta, r, z, o = new THREE.Vector3()) => o.set(r * Math.sin(theta), R - r * Math.cos(theta), z);   /* theta 0 is the bottom, pi the top, +x is positive theta */
const inwardOf = (theta, o = new THREE.Vector3()) => o.set(-Math.sin(theta), Math.cos(theta), 0);
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* a rod between two points */
function between(a, b, r0, r1, mat, seg = 8) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length(), m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, len, seg), mat);
  m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return m;
}

/* The wall of the pipe, as a grid of faces we make ourselves so that the manhole can be a real hole. Faces look inward. */
function pipeGeometry() {
  const NT = 96, zs = [];
  for (let z = ZMIN; z < ZM - 1.2; z += 2.5) zs.push(z);
  for (let z = ZM - 1.2; z < ZM + 1.2 - 1e-6; z += 0.075) zs.push(z);
  for (let z = ZM + 1.2; z < ZMAX - 1e-6; z += 2.5) zs.push(z);
  zs.push(ZMAX);
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i < zs.length; i++) for (let j = 0; j <= NT; j++) {
    const th = j / NT * Math.PI * 2, s = Math.sin(th), c = Math.cos(th);
    pos.push(R * s, R - R * c, zs[i]); nor.push(-s, c, 0); uv.push(j / NT * 3, zs[i] / 2.4);
  }
  const at = (i, j) => i * (NT + 1) + j;
  for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < NT; j++) {
    const thc = (j + 0.5) / NT * Math.PI * 2, zc = (zs[i] + zs[i + 1]) / 2;
    if (Math.abs(thc - Math.PI) < 0.6 && Math.hypot(R * Math.sin(thc), zc - ZM) < HOLE) continue;   /* the manhole */
    const A = at(i, j), B = at(i, j + 1), C = at(i + 1, j + 1), D = at(i + 1, j);
    idx.push(A, C, B, A, D, C);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}

export function buildTube(scene) {
  const group = new THREE.Group(); scene.add(group);
  const T = { group, patches: [], torches: [], solids: [], chunks: [] };
  const iron = ironTex(); iron.colorSpace = THREE.SRGBColorSpace;

  /* ----- the wall ----- */
  const wallMat = new THREE.MeshStandardMaterial({ map: iron, bumpMap: iron, bumpScale: 0.9, roughness: 0.82, metalness: 0.12 });
  const wall = new THREE.Mesh(pipeGeometry(), wallMat); group.add(wall);
  /* the closed ends: a dark plate down the pipe, and the far end that the fog hides */
  for (const [z, face] of [[ZMAX, -1], [ZMIN, 1]]) { const e = new THREE.Mesh(new THREE.CircleGeometry(R + 0.02, 40), new THREE.MeshStandardMaterial({ color: 0x1b1816, roughness: 0.9 })); e.position.set(0, R, z); if (face < 0) e.rotation.y = Math.PI; group.add(e); }

  /* ----- the floor: sand and silt, and drifts of it along the walls ----- */
  const sTex = sandTex(); sTex.repeat.set(1, (ZMAX - ZMIN) / 2.3);
  const sandMat = new THREE.MeshStandardMaterial({ map: sTex, roughness: 1, metalness: 0 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.4, ZMAX - ZMIN), sandMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, SAND, (ZMIN + ZMAX) / 2); group.add(floor);
  T.sandMat = sandMat;

  /* ----- the seams: a raised band round the pipe every 1.5 m, each with two rows of rivets, and a bolted flange every 12 m ----- */
  const rand = rng(11), rings = [], flanges = [];
  for (let k = 1; ZMIN + RING * k < ZMAX - 0.2; k++) { const z = ZMIN + RING * k; ((Math.round((z - ZMIN) / FLANGE * 1e6) % 1e6 === 0) ? flanges : rings).push(z); }
  const ringGeo = new THREE.TorusGeometry(R - 0.018, 0.03, 6, 72), ringMat = new THREE.MeshStandardMaterial({ color: 0x3a3430, roughness: 0.82, metalness: 0.15, bumpMap: iron, bumpScale: 0.8 });
  const ringMesh = new THREE.InstancedMesh(ringGeo, ringMat, rings.length), m4 = new THREE.Matrix4();
  rings.forEach((z, i) => { m4.makeTranslation(0, R, z); ringMesh.setMatrixAt(i, m4); }); group.add(ringMesh);
  const flGeo = new THREE.TorusGeometry(R - 0.034, 0.058, 8, 72), flMesh = new THREE.InstancedMesh(flGeo, new THREE.MeshStandardMaterial({ color: 0x403833, roughness: 0.78, metalness: 0.2, bumpMap: iron, bumpScale: 0.8 }), flanges.length);
  flanges.forEach((z, i) => { m4.makeTranslation(0, R, z); flMesh.setMatrixAt(i, m4); }); group.add(flMesh);

  const CH = 10, nCh = Math.ceil((ZMAX - ZMIN) / CH), lists = Array.from({ length: nCh }, () => []);
  const keep = (theta, r, z) => { const y = R - r * Math.cos(theta); return y >= SAND - 0.02 && !(y > 2 * R - 0.4 && Math.hypot(r * Math.sin(theta), z - ZM) < HOLE + 0.14); };
  const addRivet = (theta, z, r) => { if (!keep(theta, r, z)) return; lists[Math.max(0, Math.min(nCh - 1, Math.floor((z - ZMIN) / CH)))].push([theta, z, r]); };
  for (const z of rings) for (const dz of [-0.075, 0.075]) for (let a = 0; a < 77; a++) addRivet(a / 77 * Math.PI * 2 + (dz > 0 ? 0.04 : 0), z + dz, R - 0.004);
  for (const th of [1.0, -1.0, 2.55, -2.55]) for (let z = ZMIN + 0.3; z < ZMAX - 0.2; z += 0.12) addRivet(th, z, R - 0.004);   /* the seams that run along the pipe */
  const bolts = [];   /* flange bolts: hexagon heads on the inside of the flange */
  for (const z of flanges) for (let a = 0; a < 46; a++) { const th = a / 46 * Math.PI * 2; if (keep(th, R - 0.094, z)) bolts.push([th, z]); }
  const rivGeo = new THREE.SphereGeometry(0.02, 8, 3, 0, Math.PI * 2, 0, Math.PI / 2); rivGeo.scale(1, 0.7, 1);
  const rivMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0.2 });
  const q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), c1 = new THREE.Color(0x35322f), c2 = new THREE.Color(0x5e3a22), col = new THREE.Color();
  lists.forEach((list, ci) => {
    if (!list.length) return; const im = new THREE.InstancedMesh(rivGeo, rivMat, list.length);
    list.forEach(([th, z, r], i) => { onWall(th, r, z, v); q.setFromUnitVectors(UP, inwardOf(th)); const s = 0.9 + rand() * 0.3; sc.set(s, s, s); m4.compose(v, q, sc); im.setMatrixAt(i, m4); im.setColorAt(i, col.copy(c1).lerp(c2, rand() * 0.45)); });
    im.userData.cz = ZMIN + (ci + 0.5) * CH; group.add(im); T.chunks.push(im);
  });
  if (bolts.length) { const bm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.026, 6), new THREE.MeshStandardMaterial({ color: 0x2e2b28, roughness: 0.7, metalness: 0.3 }), bolts.length);
    bolts.forEach(([th, z], i) => { onWall(th, R - 0.1, z, v); q.setFromUnitVectors(UP, inwardOf(th)); sc.set(1, 1, 1); m4.compose(v, q, sc); bm.setMatrixAt(i, m4); }); group.add(bm); }

  /* ----- sand drifts along the walls (never on top of the tools, see below) ----- */
  const drifts = [];

  /* ----- tools: buckets and shovels. They are solid: the player walks round them (T.solids is a list of circles), and none overlaps another. ----- */
  const metal = new THREE.MeshStandardMaterial({ color: 0x4b4d50, roughness: 0.55, metalness: 0.55, side: THREE.DoubleSide }), wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.85 }), dark = new THREE.MeshStandardMaterial({ color: 0x151311, roughness: 1 });
  const bucket = (x, z) => { const g = new THREE.Group(); g.position.set(x, SAND, z);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.3, 16, 1, true), metal); body.position.y = 0.15; g.add(body);
    const base = new THREE.Mesh(new THREE.CircleGeometry(0.13, 16), metal); base.rotation.x = -Math.PI / 2; base.position.y = 0.004; g.add(base);
    const fill = new THREE.Mesh(new THREE.CircleGeometry(0.162, 16), sandMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 0.2; g.add(fill);   /* sand shovelled in */
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.008, 5, 20), metal); rim.rotation.x = Math.PI / 2; rim.position.y = 0.3; g.add(rim);
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 4, 14, Math.PI), metal); bail.position.y = 0.3; bail.rotation.y = 0.5; g.add(bail);
    group.add(g); T.solids.push({ x, z, r: 0.22, what: 'bucket' }); };
  const shovel = (x, z) => {   /* leans on the wall: the foot of the blade on the sand, the top of the handle against the pipe */
    const side = Math.sign(x), top = new THREE.Vector3(side * (halfChord(1.75) - 0.03), 1.75, z), foot = new THREE.Vector3(x, SAND, z), d = top.clone().sub(foot).normalize();
    const hs = foot.clone().addScaledVector(d, 0.3); group.add(between(hs, top, 0.016, 0.016, wood, 6));
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.03), wood); grip.position.copy(top).addScaledVector(d, -0.04); grip.quaternion.setFromUnitVectors(UP, d); grip.rotateZ(Math.PI / 2); group.add(grip);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.3, 0.22), metal); blade.position.copy(foot).addScaledVector(d, 0.15); blade.quaternion.setFromUnitVectors(UP, d); group.add(blade);
    T.solids.push({ x, z, r: 0.16, what: 'shovel' }); };
  for (const [x, z] of [[-0.52, -2.4], [0.5, -16.5], [-0.5, -27.0], [0.48, -37.5]]) bucket(x, z);
  for (const [x, z] of [[0.8, -8.6], [-0.8, -19.5], [0.8, -31.5]]) shovel(x, z);
  {   /* drifts, kept at least 1.3 m (along the pipe) from every tool */
    const r2 = rng(33); let tries = 0;
    while (drifts.length < 16 && tries++ < 200) { const z = ZMIN + 4 + r2() * (ZMAX - ZMIN - 8), x = (r2() < 0.5 ? -1 : 1) * (0.9 + r2() * 0.1); if (Math.abs(z - ZM) < 2.2 || T.solids.some((s) => Math.abs(s.z - z) < 1.3) || drifts.some((d) => Math.abs(d[1] - z) < 2.2)) continue; drifts.push([x, z, 0.8 + r2() * 0.5, 0.2 + r2() * 0.14, 0.9 + r2() * 0.8]); }
    const dg = new THREE.SphereGeometry(0.5, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), pa = dg.attributes.position;   /* a lumpy hump, not a smooth ball */
    for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), k = 1 + 0.1 * Math.sin(x * 13 + 1.3) + 0.08 * Math.sin(z * 17 + 0.4) + 0.05 * Math.sin((x + z) * 29); pa.setXYZ(i, x * k, y * (0.9 + 0.2 * Math.sin(x * 11 + z * 7)), z * k); } dg.computeVertexNormals();
    const driftMat = new THREE.MeshStandardMaterial({ color: 0x7a6d58, roughness: 1 }); T.driftMat = driftMat; T.drifts = drifts.map(([x, z, w, h, l]) => ({ x, z, w, l }));   /* footprints, for the dev overlap check */
    const dm = new THREE.InstancedMesh(dg, driftMat, drifts.length);
    drifts.forEach(([x, z, w, h, l], i) => { v.set(x, SAND - 0.01, z); q.identity(); sc.set(w, h, l); m4.compose(v, q, sc); dm.setMatrixAt(i, m4); }); group.add(dm); }

  /* ----- patches of rust to scrape. Each has a rust picture over a picture of bare steel; scraping fades the rust out and the steel in. ----- */
  const rustTexs = [rustPatchTex(1), rustPatchTex(2), rustPatchTex(3)], steelTexs = [steelPatchTex(1), steelPatchTex(2), steelPatchTex(3)];
  [[2, 1], [-5, -1], [-13, 1], [-21, -1], [-30, 1], [-40, -1]].forEach(([z, side], i) => {
    const th = side * (1.52 + (i % 3) * 0.16), len = 1.0, arc = 0.86 / R, k = i % 3, geo = (r) => { const g = new THREE.CylinderGeometry(r, r, len, 12, 1, true, th - arc / 2, arc); g.rotateX(Math.PI / 2); g.translate(0, R, z); return g; };
    const mk = (map, r, off, op, order, bump) => { const m = new THREE.Mesh(geo(r), new THREE.MeshStandardMaterial({ map, bumpMap: bump ? map : null, bumpScale: bump ? 2.2 : 0, transparent: true, opacity: op, roughness: 0.9, metalness: 0.1, side: THREE.BackSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: off, polygonOffsetUnits: off })); m.renderOrder = order; return m; };
    const steel = mk(steelTexs[k], R - 0.004, -1, 0, 1, false), rust = mk(rustTexs[k], R - 0.007, -2, 1, 2, true); steel.material.roughness = 0.45; steel.material.metalness = 0.55;
    group.add(steel); group.add(rust);
    T.patches.push({ i, z, theta: th, pos: onWall(th, R, z), rust, steel, clean: 0, counted: false });
  });

  /* ----- torches hung on the wall (the flame is a glowing sprite; only the two nearest also light the pipe) ----- */
  const fTex = flameTex(), clothMat = new THREE.MeshStandardMaterial({ color: 0x2a1d12, roughness: 1, emissive: 0x3a1606, emissiveIntensity: 0.8 });
  const mkFlame = (size) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: fTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); s.scale.set(size, size * 1.5, 1); return s; };
  [[-3, 1], [-12, -1], [-22, 1], [-33, -1], [-44, 1], [-55, -1]].forEach(([z, side], i) => {
    const yW = 1.3, W = new THREE.Vector3(side * (halfChord(yW) - 0.02), yW, z), d = new THREE.Vector3(-side * 0.42, 1, 0).normalize(), Tp = W.clone().addScaledVector(d, 0.44);   /* shoulder height, leaning in; the roof is only 2.44 m up */
    group.add(between(W, Tp, 0.02, 0.026, wood, 7));
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.09), metal); bracket.position.copy(W).addScaledVector(d, 0.02); bracket.position.x -= side * 0.02; group.add(bracket);
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 5, 12), metal); clamp.position.copy(W).addScaledVector(d, 0.1); clamp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d); group.add(clamp);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.026, 0.15, 9), clothMat); head.position.copy(Tp).addScaledVector(d, 0.03); head.quaternion.setFromUnitVectors(UP, d); group.add(head);
    const fp = Tp.clone().addScaledVector(d, 0.2), flame = mkFlame(0.34); flame.position.copy(fp); group.add(flame);
    T.torches.push({ pos: fp, flame, seed: i * 1.7, base: 0.34, on: 1 });
  });
  T.lights = [0, 1].map(() => { const l = new THREE.PointLight(0xff9a50, 0, 16, 1.3); group.add(l); return l; });

  /* ----- the manhole: a short neck standing up out of the roof, with a flange of bolts, the sky above, a beam of light and a pool of it on the floor ----- */
  {
    const neckMat = wallMat.clone(); neckMat.side = THREE.DoubleSide;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(HOLE + 0.03, HOLE + 0.03, 0.55, 28, 1, true), neckMat); neck.position.set(0, 2 * R + 0.02, ZM); group.add(neck);
    const fl = new THREE.Mesh(new THREE.TorusGeometry(HOLE + 0.03, 0.04, 8, 36), new THREE.MeshStandardMaterial({ color: 0x5a4d44, roughness: 0.6, metalness: 0.35 })); fl.rotation.x = Math.PI / 2; fl.position.set(0, 2 * R - 0.25, ZM); group.add(fl);
    const nb = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.026, 6), new THREE.MeshStandardMaterial({ color: 0x3e3a36, roughness: 0.5, metalness: 0.5 }), 12);
    for (let a = 0; a < 12; a++) { const ang = a / 12 * Math.PI * 2; v.set(Math.cos(ang) * (HOLE + 0.03), 2 * R - 0.292, ZM + Math.sin(ang) * (HOLE + 0.03)); q.identity(); sc.set(1, 1, 1); m4.compose(v, q, sc); nb.setMatrixAt(a, m4); } group.add(nb);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex(), fog: false, toneMapped: false }), sky = new THREE.Mesh(new THREE.CircleGeometry(HOLE + 0.03, 28), skyMat); sky.rotation.x = Math.PI / 2; sky.position.set(0, 2 * R + 0.28, ZM); group.add(sky);
    const beamMat = new THREE.MeshBasicMaterial({ map: beamTex(), color: 0x93b4e8, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(HOLE, 0.72, 2 * R + 0.28 - SAND, 24, 1, true), beamMat); beam.position.set(0, (2 * R + 0.28 + SAND) / 2, ZM); beam.renderOrder = 4; group.add(beam);
    const poolMat = new THREE.MeshBasicMaterial({ map: poolTex(), color: 0x8fb0e8, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), poolMat); pool.rotation.x = -Math.PI / 2; pool.position.set(0, SAND + 0.006, ZM); pool.renderOrder = 3; group.add(pool);
    const light = new THREE.PointLight(0x9db6e0, 4.5, 10, 1.6); light.position.set(0, 2.0, ZM); group.add(light);
    const night = new THREE.Color(1, 1, 1), dawn = new THREE.Color(1.0, 0.82, 0.66), dawnLight = new THREE.Color(0xffc9a0), nightLight = new THREE.Color(0x9db6e0), beamNight = new THREE.Color(0x93b4e8), beamDawn = new THREE.Color(0xffd2a8);
    T.manhole = { light, setSky(k) { skyMat.color.copy(night).lerp(dawn, k); light.color.copy(nightLight).lerp(dawnLight, k); beamMat.color.copy(beamNight).lerp(beamDawn, k); poolMat.color.copy(beamNight).lerp(beamDawn, k); light.intensity = 4.5 + 5 * k; } };
  }
  T.solids.push({ x: 0, z: ZM, r: 0.0, what: 'manhole' });   /* the opening itself is not an obstacle; the player glides up it at the end */

  /* ----- the water: a surface that rises up the pipe, as wide as the pipe is at that height ----- */
  {
    const N = 48, g = new THREE.BufferGeometry(), pos = new Float32Array((N + 1) * 2 * 3), uv = new Float32Array((N + 1) * 2 * 2), nor = new Float32Array((N + 1) * 2 * 3), idx = [];
    for (let i = 0; i <= N; i++) { const z = ZMIN + (ZMAX - ZMIN) * i / N; for (let s = 0; s < 2; s++) { pos[(i * 2 + s) * 3 + 2] = z; nor[(i * 2 + s) * 3 + 1] = 1; uv[(i * 2 + s) * 2 + 1] = z * 0.9; } if (i < N) { const a = i * 2, b = a + 1, c = a + 3, d = a + 2; idx.push(a, d, c, a, c, b); } }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
    const nm = rippleNormalTex(), mat = new THREE.MeshStandardMaterial({ color: 0x2f3b36, roughness: 0.1, metalness: 0.05, transparent: true, opacity: 0.84, normalMap: nm, normalScale: new THREE.Vector2(0.55, 0.55), depthWrite: false });
    const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; mesh.renderOrder = 5; mesh.visible = false; group.add(mesh);
    T.water = { mesh, level: 0, set(wl) {   /* wl is the depth of water above the sand, in metres */
      this.level = wl; mesh.visible = wl > 0.002; if (!mesh.visible) return; const y = SAND + 0.012 + wl, hw = halfChord(y) + 0.015;
      for (let i = 0; i <= N; i++) { pos[(i * 2) * 3] = -hw; pos[(i * 2) * 3 + 1] = y; pos[(i * 2 + 1) * 3] = hw; pos[(i * 2 + 1) * 3 + 1] = y; uv[(i * 2) * 2] = -hw * 0.9; uv[(i * 2 + 1) * 2] = hw * 0.9; }
      g.attributes.position.needsUpdate = true; g.attributes.uv.needsUpdate = true; const wet = 1 - 0.42 * Math.min(1, wl * 12); sandMat.color.setScalar(wet); T.driftMat.color.setHex(0x7a6d58).multiplyScalar(wet); }, scroll(t) { nm.offset.set(t * 0.012, t * 0.035); } };
  }

  /* ----- light: a little ambient so the dark is not pure black, and the pool of torch lights ----- */
  T.hemi = new THREE.HemisphereLight(0x3a332d, 0x18130f, 0.85); scene.add(T.hemi);

  /* ----- every frame ----- */
  T.update = (dt, time, pz, torchK) => {
    for (const t of T.torches) { const k = torchK * t.on * (0.84 + 0.12 * Math.sin(time * 9 + t.seed) + 0.08 * Math.sin(time * 23 + t.seed * 2.3)); t.flame.material.opacity = Math.max(0, Math.min(1, k)); t.flame.visible = k > 0.02; t.flame.scale.set(t.base * (0.9 + 0.16 * Math.sin(time * 11 + t.seed)), t.base * 1.5 * (0.88 + 0.2 * Math.sin(time * 13 + t.seed * 1.3)), 1); t.k = k; }
    const near = T.torches.filter((t) => t.k > 0.05).sort((a, b) => Math.abs(a.pos.z - pz) - Math.abs(b.pos.z - pz)).slice(0, 2);
    T.lights.forEach((l, i) => { const t = near[i]; if (t) { l.position.copy(t.pos); l.intensity = 5 * t.k; } else l.intensity = 0; });
    for (const c of T.chunks) c.visible = Math.abs(c.userData.cz - pz) < 40;
    for (const p of T.patches) if (p.clean > 0 && p.clean < 1) { p.clean = Math.min(1, p.clean + dt / 1.5); const k = smooth(0, 1, p.clean); p.rust.material.opacity = 1 - k; p.steel.material.opacity = k; if (p.clean >= 1) p.rust.visible = false; }
    T.water.scroll(time);
  };
  T.startClean = (p) => { if (p.clean === 0) p.clean = 0.001; };
  T.setPatchClean = (p, k) => { p.clean = k; p.counted = k >= 1; p.rust.visible = k < 1; p.rust.material.opacity = 1 - smooth(0, 1, k); p.steel.material.opacity = smooth(0, 1, k); };
  return T;
}

/* ----- what you hold: a torch in your right hand, low down in front of you (a child of the camera). The hand is a real fist closed round the stick
   and a sleeve runs off the bottom of the screen, so the torch is never floating. It leans away from you and out to the right, and stays small and low,
   so it never covers the middle of the view (owner rules: held things are held properly and never cover the body or the view). ----- */
export function makeHand(camera) {
  const root = new THREE.Group(), inner = new THREE.Group(); camera.add(root); root.add(inner);
  const skin = new THREE.MeshStandardMaterial({ color: 0x6a4028, roughness: 0.75, emissive: 0x120905 }), cloth = new THREE.MeshStandardMaterial({ color: 0x6f6657, roughness: 0.95, emissive: 0x151209 }), wood = new THREE.MeshStandardMaterial({ color: 0x4d3620, roughness: 0.9, emissive: 0x0e0804 });
  const rag = new THREE.MeshStandardMaterial({ color: 0x241a11, roughness: 1, emissive: 0x4a1c08, emissiveIntensity: 1 });
  /* everything below is in the hand's own space: the stick runs up the y axis, the fist is round its middle, the palm is on the far side of it */
  const stick = between(new THREE.Vector3(-0.012, -0.64, 0), new THREE.Vector3(0.023, -0.26, 0), 0.016, 0.02, wood, 8); inner.add(stick);
  const binding = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.033, 0.03, 9), rag); binding.position.set(0.022, -0.275, 0); binding.rotation.z = -0.09; inner.add(binding);   /* rags wound on with cord */
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.028, 0.085, 10), rag); head.position.set(0.025, -0.225, 0); head.rotation.z = -0.09; inner.add(head);
  const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); flame.scale.set(0.16, 0.24, 1); flame.position.set(0.028, -0.125, 0); inner.add(flame);
  /* The fist, seen from behind and a little to the left (a right hand). The stick is a little to the left of the palm. Each of the four fingers goes across the
     FRONT of the stick and curls back round its left side, so the stick passes through the closed loop of palm and fingers. The thumb lies across the front of the
     fingers and joins the palm at its base. The forearm comes up from the bottom right, as your own arm would. */
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 10), skin); palm.scale.set(0.95, 1.5, 0.95); palm.position.set(0.034, -0.442, -0.012); inner.add(palm);
  /* exactly four fingers, a little different in length (the middle one longest, the little one shortest), then ONE thumb */
  const LENS = [0.042, 0.047, 0.041, 0.033];
  for (let i = 0; i < 4; i++) {
    const y = -0.405 - i * 0.0275, r = 0.0125 - (i === 3 ? 0.0015 : 0), len = LENS[i], cx = 0.0085 + (0.042 - len) * 0.5 * 0.5;
    const across = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), skin); across.rotation.z = Math.PI / 2; across.position.set(cx, y, 0.031); across.name = 'finger'; inner.add(across);
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(r * 0.92, 0.022, 4, 10), skin); tip.rotation.x = Math.PI / 2; tip.position.set(cx - len / 2 - r + 0.004, y, 0.0165); tip.name = 'fingertip'; inner.add(tip);
  }
  /* the thumb: shorter and fatter than a finger, from the top of the palm diagonally down across the front of the first two fingers, with a thumbnail, so it cannot be mistaken for another finger */
  { const from = new THREE.Vector3(0.05, -0.372, 0.03), to = new THREE.Vector3(0.002, -0.4, 0.062), thumb = between(from, to, 0.0155, 0.0145, skin, 12); thumb.name = 'thumb'; inner.add(thumb);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.0145, 12, 8), skin); cap.position.copy(to); cap.name = 'thumb'; inner.add(cap);
    const nail = new THREE.Mesh(new THREE.SphereGeometry(0.0105, 10, 6), new THREE.MeshStandardMaterial({ color: 0xcaa98c, roughness: 0.45, emissive: 0x1a120c })); nail.scale.set(1.0, 0.4, 1.25); nail.position.set(0.0, -0.389, 0.068); nail.rotation.set(0.5, 0, 0.3); nail.name = 'thumbnail'; inner.add(nail); }
  const wrist = between(new THREE.Vector3(0.038, -0.5, -0.03), new THREE.Vector3(0.046, -0.6, -0.075), 0.03, 0.027, skin, 12); inner.add(wrist);
  const sleeve = between(new THREE.Vector3(0.046, -0.59, -0.075), new THREE.Vector3(0.13, -1.0, -0.22), 0.05, 0.064, cloth, 14); inner.add(sleeve);
  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.053, 0.012, 6, 16), cloth); cuff.position.set(0.048, -0.602, -0.077); cuff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0.09, -0.41, -0.145).normalize()); inner.add(cuff);
  [['stick', stick], ['binding', binding], ['head', head], ['flame', flame], ['palm', palm], ['wrist', wrist], ['sleeve', sleeve], ['cuff', cuff]].forEach(([n, o]) => { o.name = n; });
  inner.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.renderOrder = 10; } });
  const light = new THREE.PointLight(0xffa860, 4, 18, 1.2); light.position.set(0.028, -0.1, 0.1); inner.add(light);
  const FIST = new THREE.Vector3(0.012, -0.44, 0.01);   /* the middle of the fist, in the hand's own space */
  const H = { root, flame, light, lift: 0, baseY: -0.27, setLift(u) { H.lift = u; root.position.y = H.baseY + u; },   /* lift (in camera units): the black bars are in, so the whole hand rises just enough to keep the fist clear of the bottom bar */
    lowestFistPx(camera, screenH) {   /* the lowest point of the palm, fingers and thumb on the screen, in pixels from the top, from their shapes in the camera's frame */
      camera.updateMatrixWorld(true); const v = new THREE.Vector3(); let low = 0;
      inner.traverse((o) => { if (!o.isMesh || !['finger', 'fingertip', 'palm', 'thumb'].includes(o.name)) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox;
        for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y, z).applyMatrix4(o.matrixWorld).project(camera); low = Math.max(low, (-v.y * 0.5 + 0.5) * screenH); } });
      return low; },
    place(aspect, fov, ph, pw) {   /* the fist sits at a fixed low spot, fully in view; the torch is pivoted and scaled about it, so a small or narrow screen shrinks the torch, not the grip */
    const depth = 0.55, halfW = Math.tan(fov * Math.PI / 360) * aspect * depth, wide = aspect >= 1.2, s = 0.92 * Math.min(1, Math.max(0.55, Math.min(ph / 640, pw / 560)));   /* words keep their pixel size, so a short or narrow screen gets a smaller torch to leave them room */
    H.baseY = -0.27; root.position.set(wide ? Math.min(0.3, halfW * 0.62) : halfW * 0.42, H.baseY + H.lift, -depth); root.rotation.set(0, -0.1, 0);
    inner.rotation.set(-0.6, 0, wide ? -0.26 : -0.1); inner.scale.setScalar(s); inner.position.copy(FIST).multiplyScalar(-s).applyEuler(inner.rotation); },
    update(time, k) { rag.emissiveIntensity = 0.12 + 0.88 * Math.min(1, k); const f = k * (0.86 + 0.1 * Math.sin(time * 9.1) + 0.06 * Math.sin(time * 21)); flame.material.opacity = Math.max(0, Math.min(1, f)); flame.visible = f > 0.02; flame.scale.set(0.16 * (0.92 + 0.14 * Math.sin(time * 11)), 0.24 * (0.9 + 0.18 * Math.sin(time * 14)), 1); light.intensity = 4 * Math.max(0, f); } };
  return H;
}
