/* The things of St Thomas-in-the-East in 1865 that the shared scenery does not have. What each is modelled on is in docs/games/morant-bay.md
   ("Places and looks"); where no source was found it says "a general picture" there.
   - A wattle-and-daub house with a thatched hip roof: the country houses of the 1865 album photographs and the later prints. General picture.
   - The Native Baptist chapel at Stony Gut: no picture of it is known. A long thatched house of the same build, with benches inside. General picture.
   - The court-house at Morant Bay: after the Illustrated London News engraving of 9 December 1865 (from a naval officer's sketch), "a long low
     building with a row of round arches". Its exact look is not known; this is that engraving's building.
   - The temporary court-house where courts-martial sat: after the second engraving: an open shed on posts under a shingle roof.
   - Market sheds, a two-storey house with a louvred upper floor (the engraving), a school-house of boards. */
import * as THREE from "three";
import { T, std, solid, mesh, box, cyl, plane, grp, rng, cv } from "./gfx.js";
import { dugOut, rowBoat } from "../../../engine/boats.js";
import * as W from "./world.js";
import { M, roof as hipRoofS } from "./scenery.js";

const DAUB = () => M.daub(),
  THATCH = () => M.thatch(),
  SHINGLE = () => M.shingle(),
  CHAR = solid(0x1d1814, 1),
  WOOD = W.WM.wood,
  DARKW = W.WM.woodDark;

/* a thatched hip roof (four slopes) over a w by d box at height h: a pyramid stretched, with a short ridge */
function thatchRoof(w, d, h, rise, g, over = 0.5) {
  const geo = new THREE.BufferGeometry(),
    X = w / 2 + over,
    Z = d / 2 + over,
    rx = Math.max(0, (w - d) / 2),
    v = [-X, 0, -Z, X, 0, -Z, X, 0, Z, -X, 0, Z, -rx, rise, 0, rx, rise, 0],
    idx = [0, 4, 5, 0, 5, 1, 1, 5, 2, 2, 5, 4, 2, 4, 3, 3, 4, 0];
  const pos = [],
    uv = [];
  for (const i of idx) {
    pos.push(v[i * 3], v[i * 3 + 1], v[i * 3 + 2]);
    uv.push((v[i * 3] + v[i * 3 + 2]) * 0.4, v[i * 3 + 1] * 0.8);
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, THATCH());
  m.material.side = THREE.DoubleSide;
  m.position.y = h;
  m.castShadow = true;
  g.add(m);
  /* a thick thatch edge, so the roof does not read as paper */
  for (const [len, x, z, ry] of [[2 * X, 0, -Z, 0], [2 * X, 0, Z, 0], [2 * Z, -X, 0, Math.PI / 2], [2 * Z, X, 0, Math.PI / 2]]) box(len, 0.16, 0.22, THATCH(), x, h - 0.02, z, g).rotation.y = ry;
  return m;
}

/* a country house of wattle and daub: one or two rooms, a thatched roof, a plank door and a window with a board shutter.
   burnt: the roof gone, the walls blackened and broken down, the door posts charred (after the soldiers came, 19 October 1865) */
export function wattleHouse(w = 4.6, d = 3.4, { h = 2.1, seed = 1, burnt = false, open = 1.1 } = {}) {
  const g = grp(),
    r = rng(seed);
  if (!burnt) {
    box(w, h, d, DAUB(), 0, h / 2, 0, g);
    for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) cyl(0.08, 0.09, h + 0.1, DARKW, x, h / 2 + 0.05, z, g, 6);
    thatchRoof(w, d, h, 1.7 + r() * 0.3, g);
    box(0.86, 1.75, 0.06, W.WM.dark, w * 0.18, 0.875, d / 2 + 0.01, g);
    const leaf = box(0.84, 1.72, 0.05, WOOD, w * 0.18 + 0.42, 0.87, d / 2 + 0.03, g);
    leaf.geometry.translate(0.42, 0, 0);
    leaf.position.x = w * 0.18 - 0.42;
    leaf.rotation.y = -open;
    g.userData.door = leaf;
    box(0.5, 0.46, 0.06, W.WM.dark, -w * 0.25, 1.25, d / 2 + 0.01, g);
    box(0.5, 0.46, 0.04, WOOD, -w * 0.25 - 0.44, 1.25, d / 2 + 0.05, g).rotation.y = 0.15;
    box(w + 0.1, 0.18, d + 0.1, solid(0x6e5c46, 1), 0, 0.09, 0, g);   /* the beaten earth footing */
  } else {
    const wallM = solid(0x4a3f34, 1);
    for (const [len, x, z, ry, k] of [[w, 0, -d / 2, 0, 0.9], [d, -w / 2, 0, Math.PI / 2, 0.55], [d, w / 2, 0, Math.PI / 2, 0.7], [w * 0.4, -w * 0.3, d / 2, 0, 0.45]]) {
      const hh = h * (k - r() * 0.2);
      box(len, hh, 0.16, wallM, x, hh / 2, z, g).rotation.y = ry;
    }
    for (const x of [-w / 2, w / 2]) cyl(0.07, 0.09, h * 0.8, CHAR, x, h * 0.4, d / 2, g, 5);
    for (let i = 0; i < 5; i++) {
      const p = cyl(0.05, 0.06, 2.4, CHAR, (r() - 0.5) * w * 0.8, 0.12, (r() - 0.5) * d * 0.7, g, 5);
      p.rotation.z = Math.PI / 2 - 0.15 + r() * 0.3;
      p.rotation.y = r() * 3;
    }
    const ash = mesh(new THREE.CircleGeometry(1, 14), solid(0x3a3632, 1), 0, 0.02, 0, g);
    ash.rotation.x = -Math.PI / 2;
    ash.scale.set(w * 0.5, d * 0.5, 1);
  }
  return g;
}

/* the chapel at Stony Gut: no picture is known. A long wattle house with a thatched roof, its door in the gable end, benches inside */
export function bushChapel(w = 5.4, d = 10, { burnt = false, seed = 3 } = {}) {
  const g = grp(),
    h = 2.5;
  if (burnt) {
    const b = wattleHouse(w, d, { h, seed, burnt: true });
    g.add(b);
    return g;
  }
  /* the walls stop short of the eaves (an open band for air and light, as country chapels were built), the posts carry the roof */
  box(w, 1.5, 0.14, DAUB(), 0, 0.75, -d / 2, g);
  for (const s of [-1, 1]) box(0.14, 1.5, d, DAUB(), s * w / 2, 0.75, 0, g);
  for (const x of [-w / 2 + 0.6, w / 2 - 0.6]) box(w / 2 - 1.2 > 0 ? (w - 2) / 2 : 0.8, 1.5, 0.14, DAUB(), x * 0.85, 0.75, d / 2, g);
  for (let i = 0; i <= 5; i++) for (const s of [-1, 1]) cyl(0.08, 0.1, h, DARKW, s * w / 2, h / 2, -d / 2 + (i * d) / 5, g, 6);
  thatchRoof(w, d, h, 2.2, g, 0.6);
  for (let i = 0; i < 5; i++) {   /* benches: planks on stakes, facing the far end */
    const z = -d / 2 + 2.2 + i * 1.4;
    for (const s of [-1, 1]) {
      box(1.7, 0.06, 0.3, WOOD, s * 1.15, 0.44, z, g);
      for (const dx of [-0.7, 0.7]) box(0.07, 0.42, 0.07, DARKW, s * 1.15 + dx, 0.21, z, g);
    }
  }
  box(1.0, 0.95, 0.6, WOOD, 0, 0.475, -d / 2 + 0.9, g);   /* the leader's table */
  return g;
}

/* a field of sugar cane, about three metres high, as one instanced set of stalks with their leaves. area: [x0, z0, x1, z1] in the group */
export function caneField(area, { seed = 5, step = 0.55, h = 3.0, clear = [] } = {}) {
  const g = grp(),
    r = rng(seed),
    pts = [];
  for (let x = area[0]; x < area[2]; x += step)
    for (let z = area[1]; z < area[3]; z += step * 0.8) {
      const px = x + (r() - 0.5) * step * 0.7,
        pz = z + (r() - 0.5) * step * 0.5;
      if (clear.some(([a, b, c, d]) => px > a && px < c && pz > b && pz < d)) continue;
      pts.push([px, pz, h * (0.8 + r() * 0.35), r() * 6.28, (r() - 0.5) * 0.12]);
    }
  const stalk = new THREE.CylinderGeometry(0.022, 0.03, 1, 5);
  stalk.translate(0, 0.5, 0);
  const leafG = new THREE.PlaneGeometry(0.12, 1.5);
  leafG.translate(0, 0.75, 0);
  const sM = solid(0x8a9a52, 0.9),
    lM = new THREE.MeshStandardMaterial({ color: 0x6f8f3a, roughness: 0.9, side: THREE.DoubleSide });
  const S = new THREE.InstancedMesh(stalk, sM, pts.length),
    L = new THREE.InstancedMesh(leafG, lM, pts.length * 4),
    m = new THREE.Matrix4(),
    q = new THREE.Quaternion(),
    e = new THREE.Euler();
  let li = 0;
  pts.forEach(([x, z, hh, a, lean], i) => {
    m.compose(new THREE.Vector3(x, 0, z), q.setFromEuler(e.set(lean, a, lean * 0.6)), new THREE.Vector3(1, hh, 1));
    S.setMatrixAt(i, m);
    for (let k = 0; k < 4; k++) {
      const y = hh * (0.55 + k * 0.12),
        ang = a + k * 1.7;
      m.compose(new THREE.Vector3(x, y, z), q.setFromEuler(e.set(0.9 + r() * 0.5, ang, 0, "YXZ")), new THREE.Vector3(1, 0.8 + r() * 0.4, 1));
      L.setMatrixAt(li++, m);
    }
  });
  L.count = li;
  for (const o of [S, L]) {
    o.castShadow = true;
    o.receiveShadow = true;
    o.userData.noBatch = true;
    g.add(o);
  }
  g.userData.cane = true;
  return g;
}

/* yam hills: heaped earth with a tall stick for the vine, as provision grounds were planted. dry: the vines withered (the drought of 1865) */
export function yamHills(n, area, { seed = 9, dry = true } = {}) {
  const g = grp(),
    r = rng(seed),
    earth = solid(dry ? 0x8c6f4e : 0x6e5438, 1),
    vine = solid(dry ? 0x8a7a48 : 0x4f7a32, 1);
  const cols = Math.ceil(Math.sqrt(n * ((area[2] - area[0]) / (area[3] - area[1]))));
  for (let i = 0; i < n; i++) {
    const x = area[0] + ((i % cols) + 0.5) * ((area[2] - area[0]) / cols) + (r() - 0.5) * 0.3,
      z = area[1] + (Math.floor(i / cols) + 0.5) * 1.3 + (r() - 0.5) * 0.3;
    if (z > area[3]) break;
    const hill = mesh(new THREE.SphereGeometry(0.45, 9, 6, 0, Math.PI * 2, 0, Math.PI / 2), earth, x, 0, z, g);
    hill.scale.set(1, 0.7, 1);
    const st = cyl(0.015, 0.02, 1.8, DARKW, x + 0.05, 0.9, z, g, 4);
    st.rotation.z = (r() - 0.5) * 0.15;
    const v = mesh(new THREE.ConeGeometry(0.22, 1.2, 6, 1, true), vine, x + 0.05, 1.0, z, g);
    v.scale.set(0.7, 1, 0.7);
  }
  return g;
}
/* a plantain: a soft trunk and a few big leaves, torn by the wind; dry ones browner */
export function plantain(h = 3.2, seed = 1, dry = false) {
  const g = grp(),
    r = rng(seed);
  cyl(0.1, 0.13, h * 0.6, solid(0x7c8a4a, 1), 0, h * 0.3, 0, g, 7);
  const lm = new THREE.MeshStandardMaterial({ color: dry ? 0x8c8a48 : 0x5f8a3a, roughness: 0.9, side: THREE.DoubleSide });
  for (let i = 0; i < 6; i++) {
    const L = plane(0.5, 1.8, lm, 0, 0, 0, g);
    L.geometry.translate(0, 0.9, 0);
    L.position.y = h * 0.58;
    L.rotation.set(0.7 + r() * 0.5, i * 1.05 + r() * 0.3, 0, "YXZ");
  }
  return g;
}

/* a guinep tree, broad and dense: the meeting of 12 August 1865 was held in the market place in front of the court-house "under a gynnep tree" (Report p.32) */
export function guinep(h = 8, seed = 2) {
  const g = grp(),
    r = rng(seed),
    bark = solid(0x5a4a3c, 1),
    leaf = solid(0x3f6a2e, 0.95);
  cyl(0.28, 0.4, h * 0.45, bark, 0, h * 0.225, 0, g, 8);
  for (let i = 0; i < 4; i++) {
    const b = cyl(0.1, 0.16, h * 0.35, bark, 0, h * 0.45, 0, g, 6);
    b.rotation.set(0.55, i * 1.6 + r(), 0, "YXZ");
    b.position.set(Math.sin(i * 1.6) * 0.6, h * 0.55, Math.cos(i * 1.6) * 0.6);
  }
  for (let i = 0; i < 9; i++) {
    const a = r() * 6.28,
      d = r() * h * 0.28;
    const c = mesh(new THREE.IcosahedronGeometry(h * (0.16 + r() * 0.08), 1), leaf, Math.cos(a) * d, h * (0.68 + r() * 0.2), Math.sin(a) * d, g);
    c.scale.y = 0.7;
  }
  return g;
}

/* the court-house at Morant Bay as the engraving of 1865 shows it from the sea: a long low building of masonry with a row of round arches
   along its front (an open arcade), a hipped roof. state: "whole", "burnt" (the roof gone, the arches blackened) */
export function courthouse({ w = 22, d = 9, h = 4.6, arches = 7, state = "whole" } = {}) {
  const g = grp(),
    burnt = state === "burnt",
    wallM = burnt ? std(T.plaster([120, 112, 100], [4, 1]), 1) : std(T.plaster([222, 214, 192], [4, 1]), 1),
    trim = burnt ? solid(0x3a332c, 1) : solid(0xd2c8ae, 0.95),
    inner = burnt ? solid(0x221d18, 1) : solid(0x6a5e4e, 1);
  const D = 2.4;   /* the depth of the arcade in front of the rooms */
  box(w + 0.6, 0.45, d + 0.6, std(T.stone([170, 164, 150], [6, 2]), 1), 0, 0.225, 0, g);   /* the stone platform, three steps up */
  for (let i = 0; i < 3; i++) box(w * 0.3, 0.15, 0.4, std(T.stone([176, 170, 156], [3, 1]), 1), 0, 0.075 + i * 0.15, d / 2 + 0.3 + (2 - i) * 0.4 - 0.4, g);
  box(w, h, 0.3, inner, 0, 0.45 + h / 2, d / 2 - D, g);   /* the inner wall behind the arcade */
  for (const [len, z] of [[w, -d / 2]]) box(len, h, 0.4, wallM, 0, 0.45 + h / 2, z, g);
  for (const s of [-1, 1]) box(0.4, h, d, wallM, (s * w) / 2, 0.45 + h / 2, 0, g);
  /* the arcade front: piers and round arches */
  const span = w / arches,
    ah = h * 0.72,
    pierW = span * 0.28;
  for (let i = 0; i <= arches; i++) box(pierW, h, 0.5, wallM, -w / 2 + i * span, 0.45 + h / 2, d / 2, g);
  for (let i = 0; i < arches; i++) {
    const x = -w / 2 + (i + 0.5) * span,
      rr = (span - pierW) / 2;
    const top = new THREE.Shape();
    top.moveTo(-span / 2, 0);
    top.lineTo(span / 2, 0);
    top.lineTo(span / 2, -(h - ah));
    top.lineTo(rr, -(h - ah));
    top.absarc(0, -(h - ah), rr, 0, Math.PI, false);
    top.lineTo(-span / 2, -(h - ah));
    const sp = mesh(new THREE.ExtrudeGeometry(top, { depth: 0.5, bevelEnabled: false, curveSegments: 10 }), wallM, x, 0.45 + h, d / 2 - 0.25, g);
    sp.position.y = 0.45 + h;
    sp.geometry.translate(0, 0, 0);
  }
  box(w + 0.5, 0.3, 0.6, trim, 0, 0.45 + h + 0.15, d / 2, g);   /* the cornice */
  /* the doors and windows of the rooms inside the arcade, dark */
  for (let i = 0; i < arches; i++) {
    const x = -w / 2 + (i + 0.5) * span;
    box(i % 2 ? 1.1 : 1.4, i % 2 ? 1.3 : 2.5, 0.05, W.WM.dark, x, 0.45 + (i % 2 ? 1.9 : 1.25), d / 2 - D + 0.17, g);
  }
  /* arched end windows */
  for (const s of [-1, 1]) for (const z of [-d / 4, d / 8]) box(0.05, 1.8, 1.0, W.WM.dark, s * (w / 2 + 0.21), 2.2, z, g);
  if (!burnt) {
    const rf = hipRoofS(w + 0.6, d + 0.6, 2.4, 0.4);
    rf.position.y = 0.45 + h + 0.3;
    g.add(rf);
  } else {
    for (let i = 0; i < 6; i++) {   /* a few charred roof beams fallen across the walls */
      const b = box(0.2, 0.22, d * 0.9, CHAR, -w / 2 + 2 + i * (w - 4) / 5, 0.45 + h - 0.6 - (i % 2) * 1.2, 0, g);
      b.rotation.x = (i % 2 ? 0.3 : -0.2);
    }
    for (let i = 0; i <= arches; i++) box(pierW + 0.02, 1.2, 0.52, solid(0x2a241e, 1), -w / 2 + i * span, 0.45 + h - 0.6, d / 2, g);   /* soot over the arches */
  }
  g.userData.size = { w, d, h: 0.45 + h, ridge: 0.45 + h + 2.7, arcade: D };
  return g;
}

/* the school-house beside the court-house: a building of boards on a stone footing, a shingle roof. It was set alight first (Report p.12). */
export function schoolhouse(w = 9, d = 6, { burnt = false } = {}) {
  const g = grp(),
    h = 3.4;
  if (burnt) {
    g.add(wattleHouse(w, d, { h, burnt: true, seed: 11 }));
    return g;
  }
  const boards = std(T.plank([150, 120, 88], 6, [3, 1], true), 0.95);
  box(w + 0.3, 0.5, d + 0.3, std(T.stone([168, 160, 146], [4, 2]), 1), 0, 0.25, 0, g);
  box(w, h, d, boards, 0, 0.5 + h / 2, 0, g);
  for (let i = 0; i < 4; i++) box(0.8, 1.2, 0.05, W.WM.dark, -w / 2 + 1.4 + i * 2.1, 2.3, d / 2 + 0.01, g);
  box(1.0, 2.1, 0.05, W.WM.dark, 0, 1.55, d / 2 + 0.02, g);
  const rf = hipRoofS(w + 0.4, d + 0.4, 2.0, 0.4);
  rf.position.y = 0.5 + h;
  g.add(rf);
  g.userData.size = { w, d, h: 0.5 + h, ridge: 0.5 + h + 2 };
  return g;
}

/* a market shed: a shingle roof on posts over a row of stall boards. Under the boards a child can hide (chapter 4). */
export function marketShed(w = 10, d = 4, { stalls = 4 } = {}) {
  const g = grp(),
    h = 2.6;
  for (let i = 0; i <= stalls; i++) for (const s of [-1, 1]) cyl(0.08, 0.1, h, DARKW, -w / 2 + (i * w) / stalls, h / 2, (s * d) / 2, g, 6);
  const rf = hipRoofS(w + 0.4, d + 0.8, 1.2, 0.4);
  rf.position.y = h;
  g.add(rf);
  for (let i = 0; i < stalls; i++) {
    const x = -w / 2 + (i + 0.5) * (w / stalls);
    box(w / stalls - 0.4, 0.07, 1.3, WOOD, x, 0.9, -0.4, g);   /* the stall board */
    for (const dx of [-0.45, 0.45]) for (const dz of [-0.95, 0.15]) box(0.08, 0.9, 0.08, DARKW, x + dx * (w / stalls - 0.4), 0.45, -0.4 + dz, g);
    box(w / stalls - 0.4, 0.55, 0.04, solid(0x8a7656, 1), x, 0.6, 0.27, g);   /* a sacking curtain hung along the front of the board */
  }
  return g;
}

/* a two-storey house: a masonry ground floor, a boarded upper floor with louvred windows all round, a hip roof (the engraving's house on the rise) */
export function louvreHouse(w = 9, d = 7) {
  const g = grp();
  box(w, 3, d, std(T.plaster([214, 204, 182], [3, 1]), 1), 0, 1.5, 0, g);
  box(w + 0.6, 2.8, d + 0.6, std(T.plank([200, 190, 168], 6, [3, 1], true), 0.95), 0, 4.4, 0, g);
  for (let i = 0; i < 5; i++) box(1.1, 1.5, 0.06, solid(0x4a5a46, 0.9), -w / 2 + 1 + i * ((w - 2) / 4), 4.4, d / 2 + 0.32, g);
  for (let i = 0; i < 3; i++) box(0.9, 1.6, 0.05, W.WM.dark, -w / 3 + i * (w / 3), 1.5, d / 2 + 0.01, g);
  const rf = hipRoofS(w + 1, d + 1, 2.4, 0.5);
  rf.position.y = 5.8;
  g.add(rf);
  return g;
}

/* the temporary court-house of the engraving: an open shed on squared posts under a steep shingle roof, a long table and benches under it */
export function courtShed(w = 12, d = 6) {
  const g = grp(),
    h = 2.8;
  for (let i = 0; i <= 5; i++) for (const s of [-1, 1]) box(0.16, h, 0.16, solid(0xd8cfb8, 0.95), -w / 2 + (i * w) / 5, h / 2, (s * d) / 2, g);
  const rf = hipRoofS(w + 0.8, d + 1.2, 2.8, 0.5);
  rf.position.y = h;
  g.add(rf);
  box(5, 0.08, 1.1, WOOD, 0, 0.82, -1.2, g);
  for (const dx of [-2.3, 2.3]) for (const dz of [-0.45, 0.45]) box(0.08, 0.8, 0.08, DARKW, dx, 0.4, -1.2 + dz, g);
  for (const z of [0.6, 1.8]) {
    box(6, 0.06, 0.32, WOOD, 0, 0.45, z, g);
    for (const dx of [-2.6, 0, 2.6]) box(0.07, 0.43, 0.07, DARKW, dx, 0.215, z, g);
  }
  return g;
}
/* a boardwalk on short posts, as in the engraving */
export function boardwalk(len = 8) {
  const g = grp();
  box(len, 0.06, 1.0, solid(0x9a8462, 1), 0, 0.42, 0, g);
  for (let x = -len / 2 + 0.4; x < len / 2; x += 1.4) for (const z of [-0.4, 0.4]) box(0.12, 0.4, 0.12, DARKW, x, 0.2, z, g);
  return g;
}
/* a flagpole */
export function flagpole(h = 12) {
  const g = grp();
  cyl(0.06, 0.1, h, solid(0xd8d2c0, 0.9), 0, h / 2, 0, g, 6);
  return g;
}
/* a far gallows, a dark frame only, seen against the dawn (chapter 6). Never anyone on it. */
export function farGallows() {
  const g = grp(),
    m = W.WM.dark;
  box(3.4, 0.25, 2.2, m, 0, 1.6, 0, g);
  for (const [x, z] of [[-1.6, -1], [1.6, -1], [-1.6, 1], [1.6, 1]]) box(0.16, 1.6, 0.16, m, x, 0.8, z, g);
  for (const x of [-1.4, 1.4]) box(0.2, 3.6, 0.2, m, x, 3.4, 0, g);
  box(3.2, 0.2, 0.2, m, 0, 5.2, 0, g);
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
}
/* a cave mouth in a limestone face: a dark hollow framed by rock, ferns at its lip (chapter 5) */
export function caveMouth(seed = 4) {
  const g = grp(),
    r = rng(seed),
    rock = solid(0x8c8676, 1, 0, { flatShading: true });
  for (let i = 0; i < 9; i++) {
    const a = (i / 8) * Math.PI,
      R = 2.1 + r() * 0.5;
    const b = mesh(new THREE.DodecahedronGeometry(1.1 + r() * 0.6, 0), rock, Math.cos(a) * R, Math.sin(a) * R * 1.05, -0.3, g);
    b.scale.set(1, 0.9, 1.2);
  }
  for (let i = 0; i < 6; i++) mesh(new THREE.DodecahedronGeometry(1.4 + r() * 0.8, 0), rock, (r() - 0.5) * 7, 3.4 + r() * 1.6, -1 - r(), g);
  const hole = mesh(new THREE.CircleGeometry(1.75, 16, 0, Math.PI), W.WM.dark, 0, 0.02, -0.2, g);
  hole.scale.y = 1.15;
  const inner = mesh(new THREE.CylinderGeometry(1.7, 1.7, 3.2, 14, 1, true, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: 0x15120f, side: THREE.BackSide, roughness: 1 }), 0, 0, -1.8, g);
  inner.rotation.x = Math.PI / 2;
  g.userData.cave = true;
  return g;
}

/* the Rodney Memorial on the north side of the square at Spanish Town (built 1783 to 1789, so there in 1865): a temple of white stone with
   columns and a domed roof over the statue of Admiral Rodney, joined by an arcade on each side to a small end pavilion. A general picture of
   its parts, not a measured model. The front faces +z. */
export function rodneyMemorial() {
  const g = grp(),
    stone = std(T.stone([226, 222, 210], [3, 2]), 1),
    dark = W.WM.dark;
  box(8, 0.8, 7, stone, 0, 0.4, 0, g);
  box(7, 6.2, 5.4, stone, 0, 3.9, -0.6, g);
  box(3.6, 4.2, 0.06, dark, 0, 3.1, 2.12, g);
  for (const x of [-2.6, -0.9, 0.9, 2.6]) cyl(0.32, 0.34, 5.6, stone, x, 3.6, 2.9, g, 14);
  box(7.6, 0.8, 1.8, stone, 0, 6.8, 2.2, g);
  const ped = mesh(new THREE.CylinderGeometry(0, 4.2, 1.6, 3, 1), stone, 0, 7.9, 2.2, g);
  ped.rotation.set(Math.PI / 2, 0, 0);
  ped.scale.set(1, 0.35, 0.55);
  cyl(2.3, 2.5, 1.4, stone, 0, 7.9, -0.6, g, 20);
  mesh(new THREE.SphereGeometry(2.3, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), stone, 0, 8.6, -0.6, g);
  /* the statue inside, white marble, seen through the columns */
  const marble = solid(0xeeeae2, 0.6);
  cyl(0.5, 0.6, 1.4, marble, 0, 1.5, 0.6, g, 10);
  cyl(0.28, 0.36, 1.6, marble, 0, 3.0, 0.6, g, 10);
  mesh(new THREE.SphereGeometry(0.2, 10, 8), marble, 0, 4.0, 0.6, g);
  for (const s of [-1, 1]) {
    box(10, 4.4, 2.4, stone, s * 9, 2.2, 0.2, g);
    for (let i = 0; i < 4; i++) box(1.5, 2.8, 0.06, dark, s * (5.6 + i * 2.3), 1.6, 1.42, g);
    box(4, 6, 4, stone, s * 16, 3, 0, g);
    box(1.2, 2.6, 0.06, dark, s * 16, 1.5, 2.02, g);
  }
  return g;
}
/* a fishing canoe hauled up on the beach: the engine's dug-out (engine/boats.js), tilted a little on the sand */
export function canoe(L = 4.2, seed = 1) {
  const g = grp(),
    c = dugOut({ L, beam: 0.78, depth: 0.42 });
  c.rotation.z = 0.04 * ((seed % 3) - 1);
  g.add(c);
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
}
/* a rowing boat drawn up on the beach (engine/boats.js), oars shipped */
export function beachBoat(seed = 2) {
  const g = grp(),
    b = rowBoat({ L: 4.6, beam: 1.5, depth: 0.6, wood: std(T.plank([118, 96, 72], 6, [1, 1])), timber: std(T.plank([92, 72, 52], 1, [1, 1])), oars: "shipped", rudder: false });
  b.rotation.z = 0.06;
  g.add(b);
  g.traverse((o) => (o.userData.noBatch = true));
  return g;
}
/* beach sand: pale, fine, with a few shells and darker grains, no ruts (the dirt texture's wheel ruts read as tracks on a beach) */
const sandTexes = {};
export function sandTex(repeat = [20, 4], rgb = [214, 200, 164]) {
  const k = repeat + "" + rgb;
  if (sandTexes[k]) return sandTexes[k];
  const t = cv(256, 256, (x, w, h) => {
    x.fillStyle = `rgb(${rgb})`;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const d = (Math.random() - 0.5) * 34;
      x.fillStyle = `rgb(${rgb.map((c) => Math.max(0, Math.min(255, c + d))).join(",")})`;
      x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    x.strokeStyle = "rgba(150,130,100,0.12)";
    for (let i = 0; i < 9; i++) {   /* faint ripples left by the wind */
      x.beginPath();
      const y0 = Math.random() * h;
      for (let px = 0; px <= w; px += 8) x.lineTo(px, y0 + Math.sin(px * 0.05 + i) * 4);
      x.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  return (sandTexes[k] = t);
}
export function oldCanoe(L = 4.2, seed = 1) {
  const g = grp(),
    r = rng(seed),
    wood = solid(0x6a5038, 0.95);
  const hull = mesh(new THREE.CylinderGeometry(0.42, 0.42, L, 12, 1, false, Math.PI * 0.08, Math.PI * 0.84), new THREE.MeshStandardMaterial({ color: 0x6a5038, roughness: 0.95, side: THREE.DoubleSide }), 0, 0.42, 0, g);
  hull.rotation.set(0, 0, Math.PI / 2);
  hull.rotation.x = Math.PI;
  hull.scale.set(1, 1, 0.7);
  box(0.06, 0.04, 0.5, wood, L * 0.2, 0.36, 0, g);
  const pad = box(1.3, 0.03, 0.12, wood, -0.3, 0.3, 0.1 + r() * 0.05, g);
  pad.rotation.y = 0.2;
  return g;
}
