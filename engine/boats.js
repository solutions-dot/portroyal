import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* engine/boats.js: an open wooden rowing boat, built in code.

   rowBoat(o) makes a small clinker-built boat of the kind a harbour used from the 1600s to the 1900s: overlapping planks (strakes),
   a keel with a stem post at the bow and a stern post and transom at the back, ribs inside, a gunwale with a rubbing strake under it,
   thwarts (seats) on risers, bottom boards, thole pins (wooden pegs that hold the oars; metal rowlocks came later), oars, a rudder
   with a tiller, a coil of rope and a wooden bailer. Nothing on it is named or numbered.

   The boat runs along x with the bow at +x; the bottom of the keel is at y = 0 amidships.
   The whole boat is three meshes (planking, timber, small things), plus one for each oar when the oars swing, plus the water mask.

     o.L, o.beam, o.depth   length, width and depth in metres
     o.wood                 material for the planking; its texture runs keel to gunwale along u and along the boat on v.
                            It is drawn two-sided and takes vertex colours (the shadow under each plank lap)
     o.timber               material for keel, posts, ribs, gunwale, thwarts, oars and rudder
     o.thwarts              x of each seat (default: three or four spread along the boat)
     o.oars                 'rowing' (two oars out in the thole pins, each its own mesh so it can swing: see rowStroke),
                            'shipped' (two oars lying in the boat) or 'none'
     o.rowAt                x of the seat of whoever rows; the thole pins and oars go o.pinGap toward the way she faces (o.rowFace: 1 bow, -1 stern)
     o.rudder, o.gear       false leaves out the rudder, or the rope and bailer
     o.mask                 true adds an unseen lid that stops the sea being drawn inside the boat. Draw the sea after it
                            (sea.renderOrder = 2 or more); the lid has renderOrder 1

   Returns a Group. userData: seatTop (y of the top of the thwarts), thwarts (their x), oars ([starboard, port] when rowing),
   halfAt(x, y) (half the inside width at that place, for putting loads in), boards (y of the top of the bottom boards). */
export function rowBoat(o = {}) {
  const L = o.L || 5, beam = o.beam || 1.6, D = o.depth || 0.68, K = o.strakes || 6, NS = 24, hw = beam / 2;
  const xOf = (s) => (s - 0.5) * L;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  /* the lines of the hull: half width at the gunwale, height of the gunwale (the sheer) and of the keel, at s from stern (0) to bow (1) */
  const half = (s) => Math.max(0.035, hw * (s < 0.42 ? 0.64 + 0.36 * Math.sin(Math.PI / 2 * s / 0.42) : Math.pow(Math.max(0, Math.cos(Math.PI / 2 * (s - 0.42) / 0.58)), 0.8)));
  const sheer = (s) => D + (s < 0.45 ? 0.09 * ((0.45 - s) / 0.45) ** 2 : 0.24 * ((s - 0.45) / 0.55) ** 2) * (D / 0.7);
  const keel = (s) => s > 0.76 ? 0.55 * sheer(1) * Math.pow((s - 0.76) / 0.24, 2.4) : s < 0.14 ? 0.1 * D * ((0.14 - s) / 0.14) ** 2 : 0;
  const full = (s) => s > 0.4 ? 1 - clamp01((s - 0.4) / 0.6) ** 1.6 : 0.82 + 0.18 * (s / 0.4);   /* 1 = round and full amidships, 0 = a V at the bow */
  /* one point of a cross section: t from the keel (0) round the bilge to the gunwale (1) */
  const sect = (s, t) => { const f = full(s), a = t * Math.PI / 2, p = 1.3 - 0.62 * f, q = 0.95 + 0.5 * f, k = keel(s), h = half(s);
    return [0.03 + (h - 0.03) * Math.pow(Math.sin(a), p), k + (sheer(s) - k) * (1 - Math.pow(Math.max(0, Math.cos(a)), q))]; };   /* [z, y] */
  const halfAt = (x, y) => { const s = clamp01(x / L + 0.5); let pz = 0.03, py = keel(s); if (y <= py) return 0; for (let i = 1; i <= 24; i++) { const [z, yy] = sect(s, i / 24); if (yy >= y) return pz + (z - pz) * (y - py) / Math.max(1e-5, yy - py); pz = z; py = yy; } return pz; };

  /* ---- planking: K strakes a side, each its own strip, its lower edge standing proud of the plank below (clinker) ---- */
  const pos = [], uv = [], col = [], idx = [], LAP = 0.016;
  for (const side of [1, -1]) for (let k = 0; k < K; k++) { const base = pos.length / 3;
    for (let i = 0; i <= NS; i++) { const s = i / NS, x = xOf(s), [z0, y0] = sect(s, k / K), [z1, y1] = sect(s, (k + 1) / K);
      let nz = y1 - y0, ny = -(z1 - z0); const n = Math.hypot(nz, ny) || 1; nz /= n; ny /= n; const lap = k === 0 ? 0 : LAP * Math.min(1, half(s) / 0.2);
      pos.push(x, y0 + ny * lap, side * (z0 + nz * lap), x, y1, side * z1); uv.push((k + 0.06) / K, x / 1.3, (k + 0.94) / K, x / 1.3);
      const dark = k < 2 ? 0.82 : 1; col.push(dark, dark, dark, 0.7 * dark, 0.7 * dark, 0.7 * dark);   /* darker up under the lap of the plank above, and the two lowest planks darker, as if wet */
      pos.push(x, y0 + ny * lap, side * (z0 + nz * lap), x, y0, side * z0); uv.push((k + 0.02) / K, x / 1.3, (k + 0.05) / K, x / 1.3); col.push(0.45, 0.45, 0.45, 0.45, 0.45, 0.45); }   /* the edge of the plank, closing the lap */
    for (let i = 0; i < NS; i++) for (const off of k ? [0, 2] : [0]) { const a = base + i * 4 + off, b = a + 1, c = a + 4, d = a + 5; if (side > 0) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c); } }
  { /* the transom: the flat board across the stern, cut to the ends of the planks */
    const base = pos.length / 3, x = xOf(0) + 0.004, rim = []; pos.push(x, sheer(0), 0); uv.push(0.5, 0); col.push(0.9, 0.9, 0.9);
    for (let k = 0; k < K; k++) { const [z0, y0] = sect(0, k / K), [z1, y1] = sect(0, (k + 1) / K); let nz = y1 - y0, ny = -(z1 - z0); const n = Math.hypot(nz, ny) || 1, lap = k === 0 ? 0 : LAP; rim.push([z0, y0], [z0 + nz / n * lap, y0 + ny / n * lap]); if (k === K - 1) rim.push([z1, y1]); }
    for (const side of [1, -1]) for (const [z, y] of rim) { pos.push(x, y, side * z); uv.push(0.5 + side * z / beam, y / 1.3); col.push(0.9, 0.9, 0.9); }
    const N = rim.length; for (let j = 0; j + 1 < N; j++) { idx.push(base, base + 1 + j, base + 2 + j); idx.push(base, base + N + 2 + j, base + N + 1 + j); } idx.push(base, base + 1, base + N + 1); }
  const hullG = new THREE.BufferGeometry(); hullG.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); hullG.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  hullG.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); hullG.setIndex(idx); hullG.computeVertexNormals();

  /* ---- timber: everything made of sawn wood, merged into one mesh ---- */
  const T = [], bits = [], oarG = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z), UP = V(0, 1, 0), _m = new THREE.Matrix4();
  /* a square timber from a to b, w wide and h thick; `up` says which way its thickness faces */
  const bar = (a, b, w, h, up = UP, into = T) => { const d = b.clone().sub(a), len = d.length(); if (len < 1e-4) return; const X = d.clone().normalize(); let Z = X.clone().cross(up); if (Z.lengthSq() < 1e-6) Z = X.clone().cross(V(0, 0, 1)); Z.normalize(); const Y = Z.clone().cross(X);
    const g = new THREE.BoxGeometry(len + 0.004, h, w); _m.makeBasis(X, Y, Z).setPosition(a.clone().add(b).multiplyScalar(0.5)); g.applyMatrix4(_m); into.push(g); };
  const run = (pts, w, h, up, into) => { for (let i = 0; i + 1 < pts.length; i++) bar(pts[i], pts[i + 1], w, h, up, into); };
  const boxAt = (w, h, d, x, y, z, into = T) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); into.push(g); return g; };
  /* keel, the curve of the forefoot, the stem post standing above the gunwale, and the stern post */
  { const pts = []; for (let i = 0; i <= 30; i++) { const s = i / 30; pts.push(V(xOf(s), keel(s) - 0.03, 0)); } pts.push(V(L / 2 + 0.015, sheer(1) + 0.12, 0)); run(pts, 0.065, 0.085);
    bar(V(-L / 2 - 0.03, keel(0) - 0.07, 0), V(-L / 2 - 0.03, sheer(0) + 0.02, 0), 0.065, 0.07, V(1, 0, 0));
    run([0.12, 0.3, 0.5, 0.68, 0.78].map((s) => V(xOf(s), keel(s) + 0.035, 0)), 0.11, 0.05); }   /* the keelson inside */
  /* ribs: bent frames inside the planking */
  const ribN = Math.max(6, Math.round(L / 0.42));
  for (let r = 0; r < ribN; r++) { const s = 0.07 + 0.83 * r / (ribN - 1); for (const side of [1, -1]) { const pts = []; for (let j = 0; j <= 7; j++) { const t = 0.04 + 0.93 * j / 7, [z, y] = sect(s, t), [z2, y2] = sect(s, t + 0.01); let nz = y2 - y, ny = -(z2 - z); const n = Math.hypot(nz, ny) || 1;
      pts.push(V(xOf(s), y - ny / n * 0.016, side * Math.max(0.01, z - nz / n * 0.016))); } run(pts, 0.04, 0.03, V(1, 0, 0)); } }
  /* gunwale on top of the planking, the rubbing strake outside under it, and the riser inside that carries the thwarts */
  const seatTop = o.seatTop !== undefined ? o.seatTop : D - 0.18, riserY = seatTop - 0.06;
  for (const side of [1, -1]) { const gw = [], rub = [], ris = [];
    for (let i = 0; i <= NS; i++) { const s = i / NS, x = xOf(s), h = half(s); gw.push(V(x, sheer(s) + 0.012, side * (h + 0.004))); const [z, y] = sect(s, 0.86); rub.push(V(x, y, side * (z + 0.02)));
      if (s > 0.06 && s < 0.9 && keel(s) < riserY - 0.1) ris.push(V(x, riserY, side * (halfAt(x, riserY) - 0.02))); }
    gw.push(V(L / 2 + 0.01, sheer(1) + 0.012, 0)); rub.push(V(L / 2 + 0.03, sect(1, 0.86)[1], 0)); run(gw, 0.058, 0.036); run(rub, 0.026, 0.04); run(ris, 0.024, 0.05); }
  bar(V(-L / 2 + 0.012, sheer(0) + 0.012, -half(0)), V(-L / 2 + 0.012, sheer(0) + 0.012, half(0)), 0.05, 0.036);   /* the top of the transom */
  { /* the breasthook: the knee that ties the two gunwales to the stem */
    const s = 0.93, sh = new THREE.Shape(); sh.moveTo(0, -half(s) + 0.03); sh.lineTo(xOf(1) - xOf(s) - 0.03, 0); sh.lineTo(0, half(s) - 0.03); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false }); g.rotateX(Math.PI / 2); g.translate(xOf(s), sheer(0.96) + 0.0, 0); T.push(g); }
  /* thwarts, each with a small knee at either end */
  const thw = o.thwarts || (L > 4.4 ? [-0.3 * L, -0.1 * L, 0.1 * L, 0.29 * L] : [-0.29 * L, 0, 0.27 * L]);
  for (const x of thw) { const h = halfAt(x, seatTop - 0.02) - 0.015; boxAt(0.22, 0.036, h * 2, x, seatTop - 0.018, 0); for (const side of [1, -1]) boxAt(0.05, 0.12, 0.05, x, seatTop + 0.06, side * (h - 0.035)); }
  /* bottom boards: loose slats along the bottom, on bearers across the ribs */
  const boards = 0.115, slat = Math.min(0.15, beam / 11);
  for (let j = -2; j <= 2; j++) { const z = j * (slat + 0.022); let s0 = null, s1 = null; for (let i = 0; i <= 60; i++) { const s = 0.1 + 0.74 * i / 60, x = xOf(s); if (keel(s) < boards - 0.06 && halfAt(x, boards) > Math.abs(z) + slat / 2 + 0.01) { if (s0 === null) s0 = s; s1 = s; } }
    if (s0 !== null && s1 - s0 > 0.1) boxAt((s1 - s0) * L, 0.022, slat, xOf((s0 + s1) / 2), boards - 0.011, z); }
  /* thole pins: two pegs in a pad on the gunwale for each oar */
  const rowAt = o.rowAt !== undefined ? o.rowAt : thw[Math.min(1, thw.length - 1)], face = o.rowFace || -1, pinX = rowAt + face * (o.pinGap || 0.32);
  const pinsAt = [pinX, ...thw.filter((x) => Math.abs(x - rowAt) > 0.5 && Math.abs(x) < 0.3 * L).slice(0, 1).map((x) => x + face * (o.pinGap || 0.32))];
  for (const x of pinsAt) for (const side of [1, -1]) { const s = x / L + 0.5, y = sheer(s) + 0.03, z = side * (half(s) + 0.004); boxAt(0.26, 0.022, 0.07, x, y + 0.008, z);
    for (const dx of [-0.045, 0.045]) { const g = new THREE.CylinderGeometry(0.011, 0.014, 0.11, 6); g.translate(x + dx, y + 0.07, z); T.push(g); } }
  /* an oar: a round loom with a grip, and a flat blade. Built along +z from the pin (z = 0): the grip inboard at -IN, the blade tip at OUT */
  const OL = o.oarLen || Math.min(3.1, Math.max(2.3, beam * 1.72)), IN = Math.min(0.72, half(pinX / L + 0.5) - 0.1), OUT = OL - IN;
  const oarGeo = () => { const loom = new THREE.CylinderGeometry(0.02, 0.024, OL - 0.75, 7); loom.rotateX(Math.PI / 2); loom.translate(0, 0, (OUT - 0.75 - IN) / 2);
    const grip = new THREE.CylinderGeometry(0.016, 0.016, 0.16, 6); grip.rotateX(Math.PI / 2); grip.translate(0, 0, -IN + 0.06);
    const blade = new THREE.BoxGeometry(0.11, 0.016, 0.8, 1, 1, 3), bp = blade.attributes.position; for (let i = 0; i < bp.count; i++) { const t = (bp.getZ(i) + 0.4) / 0.8; bp.setX(i, bp.getX(i) * (0.45 + 0.55 * Math.min(1, t * 1.6))); } blade.translate(0, 0, OUT - 0.4); blade.computeVertexNormals();
    return mergeGeometries([loom, grip, blade]); };
  const group = new THREE.Group(), oars = [];
  if (o.oars === 'rowing') { const g = oarGeo(), s = pinX / L + 0.5; for (const side of [1, -1]) { const m = new THREE.Mesh(g, o.timber); m.rotation.order = 'YXZ'; m.position.set(pinX, sheer(s) + 0.062, side * (half(s) + 0.004)); m.userData.side = side; group.add(m); oars.push(m); } rowStroke({ userData: { oars } }, 0, false); }
  else if (o.oars !== 'none') { /* shipped: lying on the thwarts, blades toward the bow */
    for (const side of [1, -1]) { const g = oarGeo(); g.rotateY(Math.PI / 2); g.rotateZ(0.012); g.translate(thw[0] - 0.25 + IN, seatTop + 0.024, side * Math.min(0.2, halfAt(thw[0], seatTop) - 0.12)); T.push(g); } }
  /* the rudder: a board hung on the stern post by two iron straps, with a tiller over the transom */
  if (o.rudder !== false) { const x = -L / 2 - 0.065, top = sheer(0) + 0.1, bot = keel(0) - 0.06, sh = new THREE.Shape(); sh.moveTo(0, top); sh.lineTo(-0.075, top); sh.lineTo(-0.085, bot + 0.3); sh.lineTo(-0.3, bot + 0.1); sh.lineTo(-0.3, bot); sh.lineTo(0, bot); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false }); g.translate(x, 0, -0.015); T.push(g);
    bar(V(x - 0.04, top - 0.03, 0), V(x + 0.62, top + 0.05, 0), 0.034, 0.034);
    for (const y of [bot + 0.2, top - 0.2]) boxAt(0.2, 0.03, 0.04, x - 0.04, y, 0, bits).userData = { c: 0x2a2826 }; }
  /* a coil of rope in the bow with its end made fast at the stem, and a wooden bailer */
  if (o.gear !== false) { const cx = xOf(0.8), cy = Math.max(boards, keel(0.8) + 0.1) + 0.03, rope = 0xc9b68c;
    for (let i = 0; i < 3; i++) { const g = new THREE.TorusGeometry(0.17 - i * 0.02, 0.022, 5, 14); g.rotateX(Math.PI / 2); g.translate(cx, cy + i * 0.04, 0.03 * (i - 1)); g.userData = { c: rope }; bits.push(g); }
    const c = new THREE.CatmullRomCurve3([V(cx + 0.15, cy + 0.08, 0.02), V(xOf(0.9), cy + 0.2, 0.05), V(xOf(0.97), sheer(0.97) - 0.05, 0.02), V(L / 2 - 0.02, sheer(1) + 0.03, 0)]), tg = new THREE.TubeGeometry(c, 10, 0.014, 5); tg.userData = { c: rope }; bits.push(tg);
    const bx = xOf(0.3), bz = -Math.min(0.2, halfAt(bx, boards) - 0.14), by = boards + 0.045;   /* the bailer: a small wooden scoop, open at one end */
    for (const [w, h, d, x, y, z] of [[0.24, 0.012, 0.15, 0, -0.04, 0], [0.24, 0.08, 0.012, 0, 0, 0.07], [0.24, 0.08, 0.012, 0, 0, -0.07], [0.012, 0.08, 0.15, -0.12, 0, 0]]) boxAt(w, h, d, bx + x, by + y, bz + z, bits).userData = { c: 0x8a6a48 };
    const hd = new THREE.CylinderGeometry(0.014, 0.014, 0.12, 6); hd.rotateZ(Math.PI / 2); hd.translate(bx - 0.18, by, bz); hd.userData = { c: 0x8a6a48 }; bits.push(hd); }

  /* ---- put it together ---- */
  const wood = o.wood; wood.side = THREE.DoubleSide; wood.vertexColors = true;
  const hull = new THREE.Mesh(hullG, wood); hull.name = 'boatHull'; group.add(hull);
  const strip = (g) => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k); return n; };
  const timber = new THREE.Mesh(mergeGeometries(T.map(strip)), o.timber); timber.name = 'boatTimber'; group.add(timber);
  if (bits.length) { const tint = new THREE.Color(); const gs = bits.map((g) => { const n = strip(g), c = new Float32Array(n.attributes.position.count * 3); tint.set(g.userData.c || 0xffffff); for (let i = 0; i < c.length; i += 3) { c[i] = tint.r; c[i + 1] = tint.g; c[i + 2] = tint.b; } n.setAttribute('color', new THREE.BufferAttribute(c, 3)); return n; });
    const m = new THREE.Mesh(mergeGeometries(gs), BITS || (BITS = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))); m.name = 'boatBits'; group.add(m); }
  if (o.mask) { /* an unseen lid at the gunwale: it writes depth only, so the sea (drawn after it) never shows inside the boat */
    const p = [], ix = []; for (let i = 0; i <= NS; i++) { const s = i / NS, h = half(s) - 0.004; p.push(xOf(s), sheer(s), -h, xOf(s), sheer(s), h); if (i < NS) { const a = i * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setIndex(ix);
    const m = new THREE.Mesh(g, MASK || (MASK = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide }))); m.name = 'boatWaterMask'; m.renderOrder = 1; group.add(m); group.userData.mask = m; }
  for (const g of T) g.dispose(); for (const g of bits) g.dispose();
  Object.assign(group.userData, { seatTop, thwarts: thw, oars, halfAt, boards, sheer: (x) => sheer(x / L + 0.5), rowAt, pinX });
  return group;
}
let BITS = null, MASK = null;

/* Swing a rowing boat's two oars. phase is in radians and goes round once a stroke; pulling = false rests the blades just clear of the water.
   dir is the way the boat is going along its own x (1 = bow first). */
export function rowStroke(boat, phase, pulling = true, dir = 1) {
  const oars = boat.userData.oars || []; const sw = pulling ? 0.42 * Math.cos(phase) * dir : -0.12 * dir, dip = pulling ? 0.27 + 0.085 * Math.sin(phase) : 0.2;
  for (const m of oars) { const side = m.userData.side; m.rotation.set(dip, side > 0 ? sw : Math.PI - sw, 0); }
}
