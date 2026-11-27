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

/* ---------- small helpers for the boats below: everything painted is one mesh with vertex colours on a shared material.
   paintKit() is exported for other small code-built things (a porter's barrow) that want the same one-mesh look. ---------- */
export function paintKit() {
  const parts = [], tint = new THREE.Color();
  const plain = (g) => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') n.deleteAttribute(k); if (!n.attributes.normal) n.computeVertexNormals(); return n; };
  const K = {
    add(g, hex) { const n = plain(g); if (!n.attributes.color) { tint.set(hex); const a = new Float32Array(n.attributes.position.count * 3); for (let i = 0; i < a.length; i += 3) { a[i] = tint.r; a[i + 1] = tint.g; a[i + 2] = tint.b; } n.setAttribute('color', new THREE.BufferAttribute(a, 3)); } parts.push(n); return n; },
    box(w, h, d, x, y, z, hex, ry = 0, rz = 0) { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); if (ry) g.rotateY(ry); g.translate(x, y, z); return K.add(g, hex); },
    cyl(r0, r1, h, x, y, z, hex, seg = 8, rx = 0, rz = 0) { const g = new THREE.CylinderGeometry(r1, r0, h, seg); if (rx) g.rotateX(rx); if (rz) g.rotateZ(rz); g.translate(x, y, z); return K.add(g, hex); },
    /* a round bar or rope from a to b */
    rod(a, b, r, hex, seg = 5) { const d = new THREE.Vector3().subVectors(b, a), len = d.length(); if (len < 1e-4) return; const g = new THREE.CylinderGeometry(r, r, len, seg, 1, true); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); return K.add(g, hex); },
    tube(pts, r, hex, seg = 12, rad = 4) { return K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, rad), hex); },
    mesh(name) { const m = new THREE.Mesh(mergeGeometries(parts), BITS || (BITS = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))); m.name = name; for (const p of parts) p.dispose(); return m; },
    get count() { return parts.length; },
  };
  return K;
}
/* a skin from a grid of points: P(i, j) gives [x, y, z, r, g, b] for i along (0..NI) and j across (0..NJ). out(x, y, z) says which way is
   outside there, so every triangle faces the right way whatever order the points come in. Pushes into the arrays of a builder b. */
function skin(b, NI, NJ, P, out) {
  const base = b.pos.length / 3, nrm = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), o = new THREE.Vector3();
  for (let i = 0; i <= NI; i++) for (let j = 0; j <= NJ; j++) { const p = P(i, j); b.pos.push(p[0], p[1], p[2]); b.col.push(p[3], p[4], p[5]); }
  const at = (k) => new THREE.Vector3(b.pos[k * 3], b.pos[k * 3 + 1], b.pos[k * 3 + 2]);
  for (let i = 0; i < NI; i++) for (let j = 0; j < NJ; j++) { const a = base + i * (NJ + 1) + j, c = a + NJ + 1;
    for (const [p, q, r] of [[a, c, a + 1], [a + 1, c, c + 1]]) { const A = at(p), B = at(q), C = at(r); e1.subVectors(B, A); e2.subVectors(C, A); nrm.crossVectors(e1, e2); if (nrm.lengthSq() < 1e-14) continue;
      const m = A.add(B).add(C).multiplyScalar(1 / 3); o.copy(out(m.x, m.y, m.z)); if (nrm.dot(o) < 0) b.idx.push(p, r, q); else b.idx.push(p, q, r); } }
}
const geoOf = (b) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(b.col, 3)); g.setIndex(b.idx); const n = g.toNonIndexed(); g.dispose(); n.computeVertexNormals(); return n; };
const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

/* dugOut(o): a canoe hollowed out of one log, the kind Jamaican fishermen paddled from Taino times to the twentieth century.
   The log is shaped to a point at both ends and rises a little there; inside it is hollowed with adze marks, and the ends are left solid as
   two small decks. A seat board rests across it, a paddle and a calabash bailer lie in the bottom, and a short painter (rope) is made fast at
   the bow. Nothing on it is named or numbered. The canoe runs along x with the bow at +x and the bottom at y = 0.

     o.L, o.beam, o.depth   length, width and depth in metres (default 4.4, 0.8, 0.46)
     o.wood                 material for the log (it takes vertex colours: darker low down and inside). Default: a plain brown wood
     o.seats                x of each seat board (default two)
     o.gear                 false leaves out the paddles, the bailer and the rope

   Two meshes: the log, and the seats and gear (shared vertex-colour material). Returns a Group; userData: L, beam, depth, floor (y of the inside bottom). */
export function dugOut(o = {}) {
  const L = o.L || 4.4, beam = o.beam || 0.8, D = o.depth || 0.46, TH = Math.min(0.06, beam * 0.07), NS = 40, NT = 9, hw = beam / 2;
  const xOf = (s) => (s - 0.5) * L;
  const half = (s) => Math.max(0.025, hw * Math.pow(Math.sin(Math.PI * Math.min(1, s * (s < 0.5 ? 1.08 : 1))), s > 0.5 ? 0.62 : 0.5));   /* the bow (s = 1) is finer than the stern */
  const keel = (s) => { const e = Math.abs(2 * s - 1); return e > 0.42 ? sheer(s) * (s > 0.5 ? 0.8 : 0.72) * Math.pow((e - 0.42) / 0.58, 1.9) : 0; };   /* the bottom curves up toward the ends */
  const sheer = (s) => D + D * (s > 0.5 ? 0.2 : 0.12) * Math.pow(Math.abs(2 * s - 1), 3);
  const hollow = (s) => smooth(0.07, 0.15, s) * (1 - smooth(0.85, 0.92, s));   /* 0 where the log is left solid (the end decks), 1 where it is hollowed */
  const sect = (s, t) => { const a = t * Math.PI / 2, h = half(s), k = keel(s), sh = sheer(s), fl = 0.55 + 0.45 * hollow(s);   /* [z, y]; t from -1 (port gunwale) round the bottom to 1 */
    return [Math.sign(a) * h * Math.pow(Math.abs(Math.sin(a)), 0.75), k + (sh - k) * (1 - Math.pow(Math.abs(Math.cos(a)), 1.2 + 0.9 * fl))]; };
  const inner = (s, t) => { const [z, y] = sect(s, t), h = half(s), sh = sheer(s), e = hollow(s), zi = Math.sign(z) * Math.max(0, Math.abs(z) - TH * (0.6 + 0.4 * Math.abs(t))) * (h > TH * 2 ? 1 : h / (TH * 2));
    return [zi, sh - Math.max(0, sh - (y + TH * (1.6 - 0.6 * Math.abs(t)))) * e]; };
  /* colour: adze marks run across the log as faint bands; the outside is darker low down (wet, tarred), the inside darker still, the rim worn pale */
  const adze = (x, t) => 0.9 + 0.1 * Math.sin(x * 21 + Math.sin(t * 3.1) * 1.3) * Math.sin(x * 5.3 + 1.7);
  /* outward normals: across and up, and, toward each end where the underside sweeps up, along the boat too (without it the stern's lower side lit as dark wedges: owner, 27 November 2026) */
  const out = (x, y, z) => { const e = (2 * x) / L; return new THREE.Vector3(Math.sign(e) * Math.pow(Math.abs(e), 3) * 1.4, y - D * 0.45, z); };
  const b = { pos: [], col: [], idx: [] };
  skin(b, NS, NT * 2, (i, j) => { const s = i / NS, t = j / NT - 1, [z, y] = sect(s, t), x = xOf(s), k = (y < D * 0.32 ? 0.66 : 0.82 + 0.18 * smooth(D * 0.32, D * 0.6, y)) * adze(x, t); return [x, y, z, k, k * 0.98, k * 0.94]; }, out);
  skin(b, NS, NT * 2, (i, j) => { const s = i / NS, t = j / NT - 1, [z, y] = inner(s, t), x = xOf(s), e = hollow(s), k = (0.95 - 0.27 * e - 0.08 * e * (1 - Math.abs(t))) * adze(x * 1.3, t); return [x, y, z, k, k * 0.96, k * 0.9]; }, (x, y, z) => new THREE.Vector3(0, D * 2 - y, -z));
  for (const side of [1, -1]) skin(b, NS, 1, (i, j) => { const s = i / NS, x = xOf(s), [z, y] = j ? inner(s, side) : sect(s, side); return [x, j ? y : y, z, 1.06, 1.02, 0.94]; }, () => new THREE.Vector3(0, 1, 0));
  for (const s of [0, 1]) { /* close the very tips of the log: a strip of wood from the outer skin to the inner one, all the way round the cross-section (a fan from the centre left gaps in the hollow, owner, 27 November 2026) */
    const base = b.pos.length / 3, x = xOf(s), n = NT * 2;
    for (let j = 0; j <= n; j++) { const [z, y] = sect(s, j / NT - 1); b.pos.push(x, y, z); b.col.push(0.74, 0.72, 0.68); }
    for (let j = 0; j <= n; j++) { const [z, y] = inner(s, j / NT - 1); b.pos.push(x, y, z); b.col.push(0.7, 0.68, 0.64); }
    for (let j = 0; j < n; j++) { const a = base + j, c = base + n + 1 + j; if (s) b.idx.push(a, c, a + 1, a + 1, c, c + 1); else b.idx.push(a, a + 1, c, a + 1, c + 1, c); }
  }
  const hullG = geoOf(b);
  const wood = o.wood || DUGWOOD || (DUGWOOD = new THREE.MeshStandardMaterial({ color: 0x8a6440, roughness: 0.95 })); wood.vertexColors = true;
  const group = new THREE.Group(), hull = new THREE.Mesh(hullG, wood); hull.name = 'canoeHull'; group.add(hull);
  const floor = TH * 1.6, K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z), seats = o.seats || [-0.16 * L, 0.18 * L];
  const halfIn = (x, y) => { const s = x / L + 0.5; let best = 0; for (let j = 0; j <= NT; j++) { const [z, yy] = inner(s, j / NT); if (yy <= y) best = Math.max(best, z); } return best; };
  /* seat boards across the top, each resting in two shallow notches, with a peg at either end */
  const lift = o.seatLift || 0;   /* o.seatLift: boards set higher than the rim notches (a deep canoe whose sitters' feet reached through the bottom) */
  for (const x of seats) { const s = x / L + 0.5, w = half(s) * 2 + 0.04, y = sheer(s) - 0.035 + lift; K.box(0.2, 0.03, w, x, y, 0, 0x9a7a54); for (const side of [1, -1]) K.cyl(0.012, 0.012, 0.06, x, y + 0.02, side * (half(s) - 0.01), 0x5a4430, 5); }
  if (o.gear !== false) {
    /* two paddles lying in the bottom, blades toward the stern: a round shaft with a cross grip and a leaf-shaped blade */
    for (const side of [1, -1]) { const len = Math.min(1.45, L * 0.36), x0 = -0.1 * L + side * 0.1, z0 = side * Math.min(0.12, hw * 0.3), y0 = floor + 0.05 + (side > 0 ? 0.03 : 0);
      K.cyl(0.018, 0.018, len - 0.5, x0 + (len - 0.5) / 2, y0, z0, 0x8a6a46, 6, 0, Math.PI / 2); K.box(0.04, 0.03, 0.14, x0 + len - 0.5, y0, z0, 0x7a5c3c);
      const bl = new THREE.SphereGeometry(1, 10, 4); bl.scale(0.25, 0.014, 0.085); bl.translate(x0 - 0.22, y0, z0); K.add(bl, 0x8f7050); }
    /* a calabash bailer: half a dried gourd */
    { const x = 0.08 * L, z = -Math.min(0.14, hw * 0.35), g = new THREE.SphereGeometry(0.1, 10, 5, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); g.scale(1.1, 0.8, 1); g.translate(x, floor + 0.09, z); K.add(g, 0xa38a4c);
      const rim = new THREE.TorusGeometry(0.105, 0.008, 4, 12); rim.rotateX(Math.PI / 2); rim.scale(1.1, 1, 1); rim.translate(x, floor + 0.09, z); K.add(rim, 0x7a6232); }
    /* the painter: a rope through a hole in the bow deck, its end coiled loose on the deck. It rests on the real deck surface (inner(s, 0) at each x): the bow
       deck dips toward the hollow, and at a fixed height the coil floated above it (owner, 27 November 2026: "rope is floating in the boat") */
    { const s0 = 0.93, x = xOf(s0), rope = 0xbfa97e, yAt = (xx) => inner(Math.max(0, Math.min(1, xx / L + 0.5)), 0)[1];
      K.tube([V(x + 0.12, yAt(x + 0.12) - 0.03, 0), V(x + 0.1, yAt(x + 0.1) + 0.03, 0.03), V(x - 0.02, yAt(x - 0.02) + 0.022, 0.05), V(x - 0.14, yAt(x - 0.14) + 0.02, 0)], 0.012, rope, 8, 4);
      for (let i = 0; i < 2; i++) { const g = new THREE.TorusGeometry(0.09 - i * 0.02, 0.012, 4, 12); g.rotateX(Math.PI / 2); g.translate(x - 0.2, yAt(x - 0.2) + 0.014 + i * 0.022, 0); K.add(g, rope); } }
  }
  if (seats.length || o.gear !== false) { const gear = K.mesh('canoeGear'); group.add(gear); }   /* nothing to merge in a bare canoe (no seats, no gear) */
  /* seatBoxes: each seat board as a box in the canoe's own frame [x0, y0, z0, x1, y1, z1] (engine/audit-crew.js checks legs against them) */
  const seatBoxes = seats.map((x) => { const sv = x / L + 0.5, y = sheer(sv) - 0.035 + lift, hw2 = half(sv) + 0.02; return [x - 0.1, y - 0.015, -hw2, x + 0.1, y + 0.015, hw2]; });
  /* outline(y): the hull's outer edge where it crosses height y, as [x, z] points from the stern to the bow on the +z side (empty where the bottom curves above y).
     waterRing (below) draws the splash round a boat from it. */
  const outline = (y) => { const out = []; for (let i = 0; i <= NS; i++) { const s = i / NS; let z = null, prev = null; for (let j = 0; j <= NT; j++) { const [zz, yy] = sect(s, j / NT); if (prev && prev[1] <= y && yy >= y) { const k = (y - prev[1]) / Math.max(1e-6, yy - prev[1]); z = prev[0] + (zz - prev[0]) * k; break; } prev = [zz, yy]; } if (z !== null && z > 0.02) out.push([xOf(s), z]); } return out; };
  Object.assign(group.userData, { outline, L, beam, depth: D, floor, halfIn, sheer: (x) => sheer(x / L + 0.5), bow: 'x', seatBoxes, bottom: floor });   /* bottom: the true inside bottom (a game may raise .floor to seat people higher) */   /* bow: which local axis the bow points along (engine/audit-course.js) */
  return group;
}
let DUGWOOD = null;
/* waterRing(boat, { y, width }): a ring of foam round a dugout at its waterline (local height y, default boat.userData.draught or 0.18), so she sits IN the water
   with a little splash along her sides instead of resting on top of it (owner, 27 November 2026: "it looks like it's on it, it needs a little splash around the
   body"). Add it to the dugout itself; the boat must lie with its keel `y` below the water. boat.userData.ring.userData.tick(time, speed) animates it
   (speed 0 is still water, 1 is a canoe under way: a wider, brighter bow and sides). Returns the ring (also boat.userData.ring) or null. */
let RING_TEX = null;
function ringTex() {
  if (RING_TEX) return RING_TEX;
  const c = document.createElement('canvas'); c.width = 128; c.height = 32; const g = c.getContext('2d'), img = g.createImageData(128, 32);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 128; x++) { const v = y / 31, edge = Math.pow(1 - v, 1.4), n = 0.55 + 0.45 * Math.sin(x * 0.7 + Math.sin(y * 0.5) * 2.0) * Math.sin(x * 0.23 + y * 0.31); const a = Math.max(0, Math.min(1, edge * (0.75 + 0.6 * n))); const i = (y * 128 + x) * 4; img.data[i] = 245; img.data[i + 1] = 250; img.data[i + 2] = 248; img.data[i + 3] = Math.round(255 * a); }
  g.putImageData(img, 0, 0); RING_TEX = new THREE.CanvasTexture(c); RING_TEX.wrapS = THREE.RepeatWrapping; RING_TEX.colorSpace = THREE.SRGBColorSpace; return RING_TEX;
}
export function waterRing(boat, o = {}) {
  /* o.points: [[along, half]] from stern to bow, for a hull without outline() (a ship); o.axis 'z' when the boat's length runs along its local z (a caravel) */
  const u = boat.userData, wl = o.y ?? u.draught ?? 0.18, w0 = o.width ?? 0.24 * Math.max(1, (u.beam || 1) / 1.1), pts = o.points || (u.outline ? u.outline(wl) : []), Lh = (o.length || u.L || 5) / 2;
  if (pts.length < 6) return null;
  const loop = [...pts.map(([x, z]) => [x, z]), ...pts.slice().reverse().map(([x, z]) => [x, -z])], n = loop.length, pos = [], uv = [], idx = [];
  let run = 0;
  for (let i = 0; i < n; i++) {
    const [x, z] = loop[i], [x0, z0] = loop[(i + n - 1) % n], [x1, z1] = loop[(i + 1) % n];
    let tx = x1 - x0, tz = z1 - z0; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    let nx = tz, nz = -tx; if (nx * x + nz * z < 0) { nx = -nx; nz = -nz; }   /* outward */
    const e = Math.min(1, Math.abs(x) / Lh), w = w0 * (0.85 + 0.5 * Math.pow(Math.max(0, (x / Lh + 1) / 2), 6) + 0.15 * Math.pow(e, 4));   /* wider toward the bow and the ends */
    pos.push(x - nx * 0.04, wl + 0.02, z - nz * 0.04, x + nx * w, wl + 0.02, z + nz * w);
    if (i) run += Math.hypot(x - loop[i - 1][0], z - loop[i - 1][1]);
    uv.push(run / 1.2, 0, run / 1.2, 1);
  }
  for (let i = 0; i < n; i++) { const a = i * 2, b = ((i + 1) % n) * 2; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new THREE.MeshBasicMaterial({ map: ringTex().clone(), color: o.color ?? 0xffffff, transparent: true, depthWrite: false, opacity: 0.85, side: THREE.DoubleSide });   /* o.color: darker at night (an unlit white glowed) */ m.map.needsUpdate = true;
  if (o.axis === 'z') { const a = g.attributes.position; for (let i = 0; i < a.count; i++) { const x = a.getX(i), z = a.getZ(i); a.setXYZ(i, z, a.getY(i), x); } }   /* along z: swap */
  const ring = new THREE.Mesh(g, m); ring.name = 'waterRing'; ring.renderOrder = 3; ring.frustumCulled = false;
  ring.traverse((q) => { q.userData.noBatch = true; q.userData.noAudit = true; q.userData.water = true; });
  /* a short wake behind a boat under way: it widens and fades out behind the stern, and shows with speed */
  let trail = null;
  if (!o.points && u.L) {
    const c = document.createElement('canvas'); c.width = 32; c.height = 128; const gx = c.getContext('2d'), img = gx.createImageData(32, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 32; x++) { const v = y / 127, e = Math.abs(x / 15.5 - 1), edge = Math.pow(Math.max(0, 1 - Math.abs(e - 0.75) / 0.25), 1.5) * 0.9 + 0.25 * (1 - e), n = 0.6 + 0.4 * Math.sin(y * 0.9 + x * 0.7) * Math.sin(y * 0.31 + x * 1.3); const a = Math.max(0, Math.min(1, edge * n * Math.pow(1 - v, 1.6))); const i = (y * 32 + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 245; img.data[i + 3] = Math.round(255 * a); }
    gx.putImageData(img, 0, 0); const tt = new THREE.CanvasTexture(c); tt.colorSpace = THREE.SRGBColorSpace;
    const len = Math.min(5, u.L * 0.5), b0 = (u.beam || 1) * 0.7, b1 = (u.beam || 1) * 2.4, sx = -u.L / 2 + 0.2;
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute([sx, wl + 0.025, -b0 / 2, sx, wl + 0.025, b0 / 2, sx - len, wl + 0.025, -b1 / 2, sx - len, wl + 0.025, b1 / 2], 3));
    tg.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2)); tg.setIndex([0, 2, 1, 1, 2, 3]);
    trail = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ map: tt, color: o.color ?? 0xffffff, transparent: true, depthWrite: false, opacity: 0, side: THREE.DoubleSide }));
    trail.name = 'wake'; trail.renderOrder = 3; trail.frustumCulled = false; trail.userData.noBatch = true; trail.userData.noAudit = true; trail.userData.water = true;
    boat.add(trail);
  }
  ring.userData.tick = (time, speed = 0) => { const k = Math.max(0, Math.min(1, speed)); m.opacity = 0.78 + 0.2 * k; m.map.offset.x = (time * (0.12 + 0.5 * k)) % 1; if (trail) { trail.material.opacity = 0.85 * k; trail.visible = k > 0.03 && ring.visible; } };
  boat.add(ring); u.ring = ring; return ring;
}

/* shipLifeboat(o): a ship's lifeboat of the 1920s to 1950s hung in a pair of davits: a double-ended (pointed both ends) hull painted white,
   a varnished gunwale and rubbing band, grab lines looped along the sides, a canvas cover laced over a ridge, and the falls (lifting ropes)
   running up from hooks at each end to blocks on the davit heads. Nothing is named or numbered.
   The boat runs along x; its keel is at y = 0. The davits stand on the deck at y = o.deck (below the keel, default -0.4) on the inboard side,
   which is -z when o.side = 1 (the ship's side is toward +z) and +z when o.side = -1.

     o.L, o.beam, o.depth   size in metres (default 7.2, 2.1, 0.8)
     o.white, o.wood, o.canvas, o.steel, o.rope   colours (hex)
     o.cover                false leaves the boat open, showing thwarts inside
     o.davits               false leaves out the davits and falls; o.davitX gives their x (default 40% of the length either side)

   ONE mesh with vertex colours on a shared material, so a ship's row of lifeboats merges into a single draw call. Returns a Group. */
export function shipLifeboat(o = {}) {
  const L = o.L || 7.2, beam = o.beam || 2.1, D = o.depth || 0.8, hw = beam / 2, side = o.side || 1, NS = 28, NT = 7;
  const C = { white: o.white ?? 0xece8dc, wood: o.wood ?? 0x8a6a44, canvas: o.canvas ?? 0xd8d0b8, steel: o.steel ?? 0xd6d4cc, rope: o.rope ?? 0xc2ad84, dark: 0x3a3632 };
  const xOf = (s) => (s - 0.5) * L, e = (s) => Math.abs(2 * s - 1);
  const half = (s) => Math.max(0.03, hw * Math.pow(Math.max(0, 1 - Math.pow(e(s), 2.2)), 0.55));
  const sheer = (s) => D + 0.16 * D * Math.pow(e(s), 2.5);
  const keel = (s) => e(s) > 0.7 ? sheer(s) * 0.62 * Math.pow((e(s) - 0.7) / 0.3, 2) : 0;
  const sect = (s, t) => { const a = t * Math.PI / 2, h = half(s), k = keel(s); return [Math.sign(a) * h * Math.pow(Math.abs(Math.sin(a)), 0.7), k + (sheer(s) - k) * (1 - Math.pow(Math.abs(Math.cos(a)), 1.7))]; };
  const tw = new THREE.Color(C.white), b = { pos: [], col: [], idx: [] };
  /* the hull: white, with a faint line at each plank seam so it reads as a wooden boat */
  skin(b, NS, NT * 2, (i, j) => { const s = i / NS, t = j / NT - 1, [z, y] = sect(s, t), k = (j % 2 ? 0.93 : 1) * (y < 0.06 ? 0.85 : 1); return [xOf(s), y, z, tw.r * k, tw.g * k, tw.b * k]; }, (x, y, z) => new THREE.Vector3(0, y - D * 0.5, z));
  const K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  if (o.cover === false) skin(b, NS, NT * 2, (i, j) => { const s = i / NS, t = j / NT - 1, [z, y] = sect(s, t), q = 0.04 * Math.min(1, half(s) / 0.2); return [xOf(s), y + q, z * (1 - q / Math.max(0.05, half(s))), tw.r * 0.8, tw.g * 0.8, tw.b * 0.8]; }, (x, y, z) => new THREE.Vector3(0, D - y, -z));
  K.add(geoOf(b));
  /* keel and the two stem posts, the varnished gunwale, a rubbing band below it */
  { const pts = []; for (let i = 0; i <= 16; i++) { const s = 0.02 + 0.96 * i / 16; pts.push(V(xOf(s), keel(s) - 0.025, 0)); } K.tube(pts, 0.05, C.wood, 16, 4); }
  for (const s0 of [0, 1]) { const d = s0 ? 1 : -1; K.tube([V(xOf(s0) - d * 0.06, keel(s0 ? 0.97 : 0.03), 0), V(xOf(s0) + d * 0.005, sheer(s0) * 0.6, 0), V(xOf(s0) + d * 0.02, sheer(s0) + 0.1, 0)], 0.045, C.wood, 6, 4); }
  for (const sd of [1, -1]) { const gw = [], rb = []; for (let i = 0; i <= 20; i++) { const s = 0.015 + 0.97 * i / 20; gw.push(V(xOf(s), sheer(s) + 0.015, sd * (half(s) + 0.005))); const [z, y] = sect(s, sd * 0.78); rb.push(V(xOf(s), y, z + sd * 0.02)); } K.tube(gw, 0.045, C.wood, 24, 4); K.tube(rb, 0.028, C.wood, 24, 4);
    /* grab lines: a rope hung in loops along the side, from eyes under the gunwale */
    const gl = []; for (let i = 0; i <= 40; i++) { const s = 0.12 + 0.76 * i / 40, [z, y] = sect(s, sd * 0.9), sag = 0.16 * Math.abs(Math.sin(i / 40 * Math.PI * 7)); gl.push(V(xOf(s), y - sag, z + sd * 0.03)); } K.tube(gl, 0.014, C.rope, 60, 3); }
  if (o.cover !== false) { /* the canvas cover: a low tent over a ridge pole, its edge laced down outside the gunwale, with seams across it */
    const cb = { pos: [], col: [], idx: [] }, cv = new THREE.Color(C.canvas), r = 0.45 * D;
    skin(cb, NS - 2, 8, (i, j) => { const s = 0.035 + 0.93 * i / (NS - 2), t = j / 4 - 1, h = half(s) + 0.05, rise = r * Math.pow(Math.max(0, 1 - Math.pow(e(s), 3)), 0.6), sh = sheer(s) + 0.04, z = t * h, y = sh + rise * (1 - Math.pow(Math.abs(t), 1.4)) - (Math.abs(t) > 0.92 ? 0.06 : 0);
      const k = (i % 4 === 0 ? 0.88 : 1); return [xOf(s), y, z, cv.r * k, cv.g * k, cv.b * k]; }, (x, y, z) => new THREE.Vector3(0, 1, z * 0.3));
    K.add(geoOf(cb)); }
  else { /* open: thwarts across, bottom boards */
    for (const s of [0.28, 0.42, 0.58, 0.72]) K.box(0.22, 0.04, half(s) * 2 - 0.12, xOf(s), D - 0.2, 0, C.wood);
    K.box(L * 0.6, 0.03, hw * 0.9, 0, 0.14, 0, C.wood); }
  /* lifting hooks at each end, and the falls up to the blocks */
  const dx = o.davitX || [-0.4 * L, 0.4 * L], deck = o.deck !== undefined ? o.deck : -0.4, top = sheer(0.5) + 1.7;
  if (o.davits !== false) for (const x of dx) {
    const zin = -side * (hw + 0.35), post = [V(x, deck, zin), V(x, deck + (top - deck) * 0.55, zin), V(x, top - 0.25, zin * 0.75), V(x, top, zin * 0.25), V(x, top - 0.12, 0)];
    K.tube(post, 0.075, C.steel, 14, 6); K.cyl(0.13, 0.13, 0.08, x, deck + 0.04, zin, C.steel, 10);   /* a radial davit: a steel post bent over the boat, on a foot plate */
    const blk = top - 0.32; K.box(0.12, 0.2, 0.08, x, blk, 0, C.dark); const hook = sheer(0.5) + 0.15;
    for (const dz of [-0.03, 0.03]) K.rod(V(x, blk - 0.08, dz), V(x, hook + 0.06, dz), 0.016, C.rope, 4);
    K.box(0.1, 0.16, 0.06, x, hook, 0, C.dark); K.rod(V(x, hook - 0.08, 0), V(x, D * 0.55, 0), 0.02, C.dark, 4);
    K.tube([V(x, deck + 1.0, zin), V(x + 0.05, deck + 0.8, zin + side * 0.1), V(x + 0.1, deck + 0.9, zin + side * 0.05)], 0.02, C.rope, 6, 3);   /* the fall's end belayed on the davit */
  }
  const g = new THREE.Group(), m = K.mesh('lifeboat'); g.add(m); g.userData.size = [L, top - deck, beam]; return g;
}

/* steamer(o): a steel cargo steamer of about 1900 to 1925, the common "three island" kind: a raised forecastle at the bow, a bridge deck
   amidships and a poop at the stern, with open well decks between them holding the cargo hatches. A white house with the wheelhouse on top,
   one tall funnel with a steam pipe, cowl ventilators, two masts with cargo derricks, stays and shrouds, lifeboats on the boat deck, rows
   of portholes, anchors at the bow. Black hull, red below the waterline, a plain black funnel: no company colours, name or number.
   The bow is at +x and the still waterline is at y = 0 (the hull goes 0.012 L below it).

     o.L      length in metres (default 100); everything else is drawn in proportion
     o.beam   width (default 0.14 L)

   ONE mesh with vertex colours on a shared material. A 3,000 to 4,000 triangle ship, to be seen across a harbour. */
export function steamer(o = {}) {
  const L = o.L || 100, sc = L / 100, B = o.beam || 0.14 * L, NS = 40, K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const HULL = 0x1d1f22, BOOT = 0x7a2e24, HOUSE = 0xddd6c2, DECK = 0x9c8462, HATCH = 0x4c5044, FUNNEL = 0x17181b, MAST = 0x9a7a4c, RIG = 0x2a2826, DARK = 0x22282c;
  const xOf = (s) => (s - 0.5) * L;
  const half = (s) => B / 2 * Math.max(0.06, s > 0.62 ? 1 - Math.pow((s - 0.62) / 0.38, 1.35) : s < 0.2 ? 0.3 + 0.7 * Math.sin(Math.PI / 2 * s / 0.2) : 1);
  const deck = (s) => sc * (3.4 + 2.6 * Math.pow(Math.max(0, s - 0.5) / 0.5, 2) + 1.4 * Math.pow(Math.max(0, 0.5 - s) / 0.5, 2));
  const PK = o.style === 'packet';   /* a coastal passenger steamer of the 1880s, after photographs of the Yarmouth (built 1887): a black hull with a plumb stem and a high forecastle that runs about a third of her length, a small white wheelhouse on it with the foremast just behind, big dark cowl ventilators fore and aft of the funnel, three boats a side, a derrick on each mast, one tall thin funnel amidships, and a long white deckhouse aft with a boat deck over it */
  const isl = (s) => PK ? smooth(0.685, 0.695, s) : smooth(0.865, 0.875, s) + smooth(0.415, 0.425, s) * (1 - smooth(0.615, 0.625, s)) + (1 - smooth(0.125, 0.135, s));   /* forecastle, bridge deck, poop */
  const floor = (s) => deck(s) + 2.4 * sc * isl(s), top = (s) => floor(s) + 1.0 * sc;
  const bot = (s) => s < 0.06 ? -1.2 * sc + 2.4 * sc * Math.pow(1 - s / 0.06, 1.5) : -1.2 * sc;   /* the counter stern overhangs the water */
  const R = 1.0 * sc, WL = 0.45 * sc;
  /* one side of a cross section, keel to rail: flat bottom, the turn of the bilge, a straight side with crisp colour rows at the boot-top */
  const sect = (s) => { const h = half(s), b = bot(s), r = Math.min(R, h * 0.6), t = top(s), P = [[0, b, BOOT], [h - r, b, BOOT]];
    for (let k = 1; k <= 3; k++) { const a = k / 3 * Math.PI / 2; P.push([h - r + r * Math.sin(a), b + r - r * Math.cos(a), BOOT]); }
    for (const [y, c] of [[WL, BOOT], [WL + 0.01, HULL], [t, HULL]]) if (y > b + r) P.push([h, y, c]); return P; };
  const b = { pos: [], col: [], idx: [] }, tint = new THREE.Color(), NJ = sect(0.5).length - 1;
  const pt = (s, j) => { const P = sect(s), p = P[Math.min(j, P.length - 1)]; return p; };
  for (const sd of [1, -1]) skin(b, NS, NJ, (i, j) => { const s = i / NS, [z, y, c] = pt(s, j); tint.set(c); return [xOf(s), y, sd * z, tint.r, tint.g, tint.b]; }, (x, y, z) => new THREE.Vector3(0, -0.2, z));
  /* the rail along the top, the inside of the bulwark and the deck */
  const BW = 0.22 * sc, hc = new THREE.Color(HULL), dc = new THREE.Color(DECK), wc = new THREE.Color(HOUSE);
  for (const sd of [1, -1]) { skin(b, NS, 1, (i, j) => { const s = i / NS, h = half(s); return [xOf(s), top(s), sd * (j ? Math.max(0, h - BW) : h), wc.r, wc.g, wc.b]; }, () => new THREE.Vector3(0, 1, 0));
    skin(b, NS, 1, (i, j) => { const s = i / NS, h = Math.max(0, half(s) - BW); return [xOf(s), j ? floor(s) : top(s), sd * h, hc.r * 1.6, hc.g * 1.6, hc.b * 1.6]; }, (x, y, z) => new THREE.Vector3(0, 0, -z)); }
  skin(b, NS, 2, (i, j) => { const s = i / NS, h = Math.max(0, half(s) - BW); return [xOf(s), floor(s), (j - 1) * h, dc.r, dc.g, dc.b]; }, () => new THREE.Vector3(0, 1, 0));
  { /* close the stern and the stem */
    for (const s of [0, 1]) { const P = sect(s), base = b.pos.length / 3, x = xOf(s); b.pos.push(x, (P[0][1] + top(s)) / 2, 0); b.col.push(hc.r, hc.g, hc.b); const ring = [...P.map((p) => [p[0], p[1]]), ...P.slice().reverse().map((p) => [-p[0], p[1]])];
      for (const [z, y] of ring) { b.pos.push(x, y, z); b.col.push(hc.r, hc.g, hc.b); } for (let j = 0; j < ring.length; j++) { const p = base + 1 + j, q = base + 1 + (j + 1) % ring.length; if (s) b.idx.push(base, p, q); else b.idx.push(base, q, p); } } }
  K.add(geoOf(b));
  /* portholes along the forecastle, the bridge deck and the poop */
  for (const sd of [1, -1]) for (const [s0, s1, n] of PK ? [[0.14, 0.66, 18], [0.72, 0.93, 7]] : [[0.88, 0.95, 4], [0.43, 0.61, 9], [0.03, 0.12, 4]]) for (let k = 0; k < n; k++) { const s = s0 + (s1 - s0) * (k + 0.5) / n; K.cyl(0.18 * sc, 0.18 * sc, 0.08 * sc, xOf(s), floor(s) - 1.1 * sc, sd * half(s), DARK, 6, Math.PI / 2); }
  /* anchors in the hawse pipes */
  for (const sd of [1, -1]) { const s = 0.955, x = xOf(s), y = deck(s) + 0.4 * sc, z = sd * (half(s) + 0.05 * sc); K.box(0.35 * sc, 2.2 * sc, 0.2 * sc, x, y - 1.2 * sc, z, DARK); K.box(1.5 * sc, 0.35 * sc, 0.2 * sc, x, y - 2.3 * sc, z, DARK); }
  /* hatches in the well decks */
  for (const s of PK ? [] : [0.72, 0.8, 0.2, 0.3]) K.box(0.055 * L, 1.0 * sc, B * 0.42, xOf(s), deck(s) + 0.5 * sc, 0, HATCH);
  /* the midships house, the boat deck over it, the wheelhouse on top and the open bridge with its wings */
  const fl = floor(PK ? 0.36 : 0.52), hb = B * (PK ? 0.34 : 0.36), h1 = (PK ? 2.4 : 2.5) * sc;
  if (!PK) {
  K.box(0.15 * L, h1, hb * 2, xOf(0.51), fl + h1 / 2, 0, HOUSE); K.box(0.16 * L, 0.2 * sc, hb * 2 + 0.6 * sc, xOf(0.51), fl + h1 + 0.1 * sc, 0, DECK);
  for (const sd of [1, -1]) for (let k = 0; k < 7; k++) K.box(0.6 * sc, 0.7 * sc, 0.1 * sc, xOf(0.445 + k * 0.02), fl + h1 * 0.6, sd * hb, DARK);
  const f2 = fl + h1 + 0.2 * sc, h2 = 2.3 * sc; K.box(0.045 * L, h2, hb * 1.3, xOf(0.575), f2 + h2 / 2, 0, HOUSE);
  K.box(0.12 * sc, 0.8 * sc, hb * 1.25, xOf(0.575) + 0.0225 * L + 0.04 * sc, f2 + h2 * 0.62, 0, DARK);   /* the wheelhouse windows */
  K.box(0.03 * L, 0.18 * sc, B + 0.6 * sc, xOf(0.585), f2 + h2 + 0.09 * sc, 0, DECK); K.box(0.03 * L, 0.9 * sc, 0.06 * sc, xOf(0.585), f2 + h2 + 0.6 * sc, B / 2 + 0.3 * sc, HOUSE); K.box(0.03 * L, 0.9 * sc, 0.06 * sc, xOf(0.585), f2 + h2 + 0.6 * sc, -B / 2 - 0.3 * sc, HOUSE);
  K.box(0.12 * sc, 0.9 * sc, B + 0.6 * sc, xOf(0.6), f2 + h2 + 0.6 * sc, 0, HOUSE);   /* the canvas dodger along the front of the bridge */
  } else {
    K.box(0.61 * L, h1, hb * 2, xOf(0.385), fl + h1 / 2, 0, HOUSE); K.box(0.63 * L, 0.2 * sc, hb * 2 + 1.2 * sc, xOf(0.375), fl + h1 + 0.1 * sc, 0, DECK);   /* the long deckhouse from the forecastle to the stern, and the boat deck over it, level with the forecastle deck and wider than the house: a covered walk along each side */
    for (const sd of [1, -1]) { for (let k = 0; k < 24; k++) K.box(0.5 * sc, 0.8 * sc, 0.1 * sc, xOf(0.1 + k * 0.0245), fl + h1 * 0.58, sd * hb, DARK);
      K.box(0.63 * L, 0.07 * sc, 0.07 * sc, xOf(0.375), fl + h1 + 1.1 * sc, sd * (hb + 0.55 * sc), HOUSE); for (let k = 0; k <= 16; k++) K.box(0.07 * sc, 1.0 * sc, 0.07 * sc, xOf(0.06 + k * 0.0394), fl + h1 + 0.6 * sc, sd * (hb + 0.55 * sc), HOUSE);   /* the boat deck rail */
      for (let k = 0; k <= 11; k++) K.box(0.09 * sc, h1, 0.09 * sc, xOf(0.07 + k * 0.0555), fl + h1 / 2, sd * (hb + 0.5 * sc), HOUSE); }   /* posts under the boat deck */
    const u = 2.0 * sc, ud = fl + h1 + 0.2 * sc; for (const [sc0, len] of [[0.255, 0.15], [0.635, 0.16]]) { K.box(len * L, u, hb * 0.9, xOf(sc0), ud + u / 2, 0, HOUSE); K.box((len + 0.01) * L, 0.15 * sc, hb * 0.9 + 0.4 * sc, xOf(sc0), ud + u + 0.07 * sc, 0, DECK); for (const sd of [1, -1]) for (let k = 0; k < 5; k++) K.box(0.45 * sc, 0.6 * sc, 0.08 * sc, xOf(sc0 + (k - 2) * len * 0.19), ud + u * 0.6, sd * hb * 0.45, DARK); }   /* two low houses on the boat deck, one aft of the funnel and one forward of it */
    const wf = floor(0.755), h2 = 2.5 * sc, wb = B * 0.17; K.box(0.045 * L, h2, wb * 2, xOf(0.755), wf + h2 / 2, 0, HOUSE); K.box(0.052 * L, 0.16 * sc, wb * 2 + 0.5 * sc, xOf(0.755), wf + h2 + 0.08 * sc, 0, DECK);   /* the wheelhouse on the forecastle deck */
    K.box(0.1 * sc, 0.8 * sc, wb * 1.8, xOf(0.755) + 0.0225 * L + 0.03 * sc, wf + h2 * 0.64, 0, DARK); for (const sd of [1, -1]) K.box(0.032 * L, 0.8 * sc, 0.1 * sc, xOf(0.758), wf + h2 * 0.64, sd * wb, DARK);
  }
  /* the funnel, raked a little, with a rim at the top and a steam pipe in front; a mast house on the poop */
  { const fx = xOf(PK ? 0.47 : 0.495), fy = fl + h1 + 0.2 * sc, fh = (PK ? 12.5 : 9.5) * sc, r = (PK ? 1.15 : 1.5) * sc, g = new THREE.CylinderGeometry(r, r * 1.05, fh, 16, 1, true); g.scale(1.25, 1, 1); g.translate(0, fh / 2, 0); g.rotateZ(0.09); g.translate(fx, fy, 0); K.add(g, FUNNEL);
    const rim = new THREE.TorusGeometry(r * 1.0, 0.1 * sc, 4, 16); rim.rotateX(Math.PI / 2); rim.scale(1.25, 1, 1); rim.translate(0, fh, 0); rim.rotateZ(0.09); rim.translate(fx, fy, 0); K.add(rim, FUNNEL);
    const cap = new THREE.CircleGeometry(r * 0.98, 16); cap.rotateX(-Math.PI / 2); cap.scale(1.25, 1, 1); cap.translate(0, fh - 0.6 * sc, 0); cap.rotateZ(0.09); cap.translate(fx, fy, 0); K.add(cap, 0x0b0b0c);
    K.cyl(0.18 * sc, 0.18 * sc, fh + 0.6 * sc, fx + r * 1.4 + Math.sin(0.09) * fh / 2 * -1, fy + (fh + 0.6 * sc) / 2, 0, 0x8a8c88, 6, 0, 0.09);
    /* cowl ventilators either side of the funnel: a pipe and a turned mouth */
    for (const [dx, sd] of (PK ? [[8, 1], [8, -1], [-2.4, 1], [-2.4, -1]] : [[-2.4, 1], [-2.4, -1], [2.6, 1], [2.6, -1]])) { const x = fx + dx * sc, z = sd * hb * 0.6, y0 = fy, vh = 2.6 * sc; K.cyl(0.32 * sc, 0.32 * sc, vh, x, y0 + vh / 2, z, (PK ? FUNNEL : HOUSE), 8);
      const m = new THREE.CylinderGeometry(0.55 * sc, 0.38 * sc, 0.8 * sc, 10, 1, true); m.rotateZ(Math.PI / 2 * (dx < 0 ? -1 : 1)); m.translate(x + (dx < 0 ? -0.3 : 0.3) * sc, y0 + vh + 0.25 * sc, z); K.add(m, (PK ? FUNNEL : HOUSE)); K.cyl(0.5 * sc, 0.5 * sc, 0.05 * sc, x + (dx < 0 ? -0.68 : 0.68) * sc, y0 + vh + 0.25 * sc, z, 0x6a2a22, 10, 0, Math.PI / 2); } }
  if (!PK) K.box(0.06 * L, 2.0 * sc, B * 0.45, xOf(0.07), floor(0.07) + 1.0 * sc, 0, HOUSE);
  /* lifeboats on the boat deck, two a side */
  for (const sd of [1, -1]) for (const s of PK ? [0.5, 0.36, 0.14] : [0.455, 0.54]) { const g = new THREE.SphereGeometry(1, 10, 5, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); g.scale(3.2 * sc, 0.9 * sc, 0.9 * sc); g.translate(xOf(s), fl + h1 + 1.2 * sc, sd * (hb - 0.6 * sc)); K.add(g, 0xece8dc);
    K.box(6.2 * sc, 0.12 * sc, 1.8 * sc, xOf(s), fl + h1 + 1.2 * sc, sd * (hb - 0.6 * sc), 0xc8bfa8);
    for (const dx of [-2.4, 2.4]) K.tube([V(xOf(s) + dx * sc, fl + h1 + 0.2 * sc, sd * (hb - 1.6 * sc)), V(xOf(s) + dx * sc, fl + h1 + 2.6 * sc, sd * (hb - 1.4 * sc)), V(xOf(s) + dx * sc, fl + h1 + 2.8 * sc, sd * (hb - 0.6 * sc))], 0.1 * sc, HOUSE, 5, 4); }
  /* two masts with a topmast and crosstrees, derrick booms resting toward the hatches, and the standing rigging */
  const masts = [];
  for (const [s, toward] of PK ? [[0.725, 1], [0.255, -1]] : [[0.765, 1], [0.255, -1]]) { const x = xOf(s), y0 = deck(s), mh = 24 * sc, tp = y0 + mh;
    K.cyl(0.42 * sc, 0.3 * sc, mh * 0.7, x, y0 + mh * 0.35, 0, MAST, 8); K.cyl(0.24 * sc, 0.14 * sc, mh * 0.34, x, y0 + mh * 0.83, 0, MAST, 6); K.box(0.25 * sc, 0.25 * sc, 3.2 * sc, x, y0 + mh * 0.68, 0, MAST);
    K.box(1.4 * sc, 0.9 * sc, 1.4 * sc, x, y0 + 0.45 * sc, 0, HOUSE);   /* the winch house at the foot */
    if (PK) K.rod(V(x, floor(0.5) + h1 + 1.4 * sc, 0), V(x + toward * 0.075 * L, floor(0.5) + h1 + 8 * sc, 0), 0.16 * sc, MAST, 5);   /* one derrick boom on each mast, topped up */
    else for (const sd of [1, -1]) K.rod(V(x, y0 + 1.2 * sc, sd * 0.6 * sc), V(x + toward * 0.085 * L, y0 + 4.2 * sc, sd * 1.4 * sc), 0.16 * sc, MAST, 5);
    for (const sd of [1, -1]) for (const dx of [-1.6, 0, 1.6]) K.rod(V(x, y0 + mh * 0.68, sd * 0.3 * sc), V(x + dx * sc, top(s), sd * (half(s) - 0.1 * sc)), 0.04 * sc, RIG, 3);
    masts.push(V(x, tp, 0)); }
  K.rod(masts[0], V(xOf(1) - 0.2 * sc, top(1), 0), 0.05 * sc, RIG, 3); K.rod(masts[0], masts[1], 0.05 * sc, RIG, 3); K.rod(masts[1], V(xOf(0.01), top(0.01), 0), 0.05 * sc, RIG, 3);
  const g = new THREE.Group(), m = K.mesh('steamer'); g.add(m); g.userData.size = [L, top(1) - bot(0.5), B]; return g;
}

/* schooner(o): a wooden two-masted trading schooner of the late 1800s and early 1900s, its sails furled on their booms: a dark hull with a
   pale rail, a bowsprit with the jibs stowed, a deckhouse aft, a cargo hatch, a small boat on deck and the standing rigging. No name.
   The bow is at +x, the waterline at y = 0. o.L is the length (default 30). ONE mesh with vertex colours. */
export function schooner(o = {}) {
  const L = o.L || 30, sc = L / 30, B = o.beam || 0.24 * L, NS = 28, K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const HULL = o.hull ?? 0x2b2f2c, BOOT = 0x6e2c22, RAIL = 0xd8d2bf, DECK = 0xa8916a, SPAR = 0x9a7a4c, SAIL = 0xd9cfb4, RIG = 0x2a2826;
  const xOf = (s) => (s - 0.5) * L, half = (s) => B / 2 * Math.max(0.05, s > 0.6 ? 1 - Math.pow((s - 0.6) / 0.4, 1.8) : s < 0.15 ? 0.55 + 0.45 * Math.sin(Math.PI / 2 * s / 0.15) : 1);
  const sheer = (s) => sc * (1.5 + 1.0 * Math.pow(Math.max(0, s - 0.45) / 0.55, 2) + 0.5 * Math.pow(Math.max(0, 0.45 - s) / 0.45, 2)), D = 1.6 * sc;
  const sect = (s, t) => { const a = t * Math.PI / 2, h = half(s), k = -D + (s < 0.06 ? D * 0.9 * (1 - s / 0.06) : 0); return [h * Math.pow(Math.sin(a), 0.6), k + (sheer(s) + 0.6 * sc - k) * (1 - Math.pow(Math.cos(a), 1.6))]; };
  const b = { pos: [], col: [], idx: [] }, tint = new THREE.Color(), NT = 8;
  for (const sd of [1, -1]) skin(b, NS, NT, (i, j) => { const s = i / NS, [z, y] = sect(s, j / NT); tint.set(y < 0.2 * sc ? BOOT : y > sheer(s) + 0.45 * sc ? RAIL : HULL); return [xOf(s), y, sd * z, tint.r, tint.g, tint.b]; }, (x, y, z) => new THREE.Vector3(0, 0, z));
  const dc = new THREE.Color(DECK); skin(b, NS, 2, (i, j) => { const s = i / NS, h = half(s) * 0.92; return [xOf(s), sheer(s), (j - 1) * h, dc.r, dc.g, dc.b]; }, () => new THREE.Vector3(0, 1, 0));
  for (const sd of [1, -1]) skin(b, NS, 1, (i, j) => { const s = i / NS, h = half(s); return [xOf(s), j ? sheer(s) : sheer(s) + 0.6 * sc, sd * h * 0.97, 0.5, 0.48, 0.44]; }, (x, y, z) => new THREE.Vector3(0, 0, -z));
  K.add(geoOf(b));
  K.box(0.12 * L, 1.0 * sc, B * 0.5, xOf(0.17), sheer(0.17) + 0.5 * sc, 0, RAIL); K.box(0.13 * L, 0.12 * sc, B * 0.55, xOf(0.17), sheer(0.17) + 1.05 * sc, 0, 0x6a5038);   /* the deckhouse aft */
  K.box(0.1 * L, 0.6 * sc, B * 0.4, xOf(0.5), sheer(0.5) + 0.3 * sc, 0, 0x4c5044);   /* the main hatch */
  { const g = new THREE.SphereGeometry(1, 8, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); g.scale(-2.2 * sc, -0.55 * sc, 0.8 * sc); g.translate(xOf(0.36), sheer(0.36) + 0.7 * sc, 0); K.add(g, 0xe2dccb); }   /* a boat upside down on the deck */
  /* the bowsprit, two raked masts with topmasts, gaffs and booms with the sails furled along them */
  const bs = V(xOf(1) + 0.2 * L, sheer(1) + 1.4 * sc, 0); K.rod(V(xOf(0.93), sheer(0.93) + 0.4 * sc, 0), bs, 0.18 * sc, SPAR, 6);
  const tops = [];
  for (const [s, mh] of [[0.68, 20], [0.4, 22]]) { const x = xOf(s), y0 = sheer(s), lean = 0.06, top = V(x - lean * mh * sc, y0 + mh * sc, 0); K.rod(V(x, y0, 0), top, 0.22 * sc, SPAR, 7); K.rod(top, top.clone().add(V(-lean * 6 * sc, 6 * sc, 0)), 0.11 * sc, SPAR, 5);
    const boomL = (s > 0.5 ? 0.24 : 0.36) * L, by = y0 + 1.6 * sc; K.rod(V(x - 0.3 * sc, by, 0), V(x - boomL, by + 0.3 * sc, 0), 0.13 * sc, SPAR, 5);
    const gy = y0 + mh * sc * 0.72; K.rod(V(x - lean * (gy - y0), gy, 0), V(x - boomL * 0.7, gy + 2.2 * sc, 0), 0.1 * sc, SPAR, 5);
    const sail = new THREE.CylinderGeometry(0.42 * sc, 0.3 * sc, boomL * 0.9, 7); sail.rotateZ(Math.PI / 2 - 0.02); sail.translate(x - boomL * 0.5, by + 0.45 * sc, 0); K.add(sail, SAIL);
    for (const sd of [1, -1]) for (const dx of [-1.0, 0.3]) K.rod(V(top.x + 0.2 * sc, top.y - 1.5 * sc, 0), V(x + dx * sc, sheer(s) + 0.6 * sc, sd * half(s)), 0.035 * sc, RIG, 3);
    tops.push(top); }
  { const jib = new THREE.CylinderGeometry(0.3 * sc, 0.12 * sc, 0.2 * L, 6); jib.rotateZ(Math.PI / 2 + 0.08); jib.translate(xOf(1) + 0.08 * L, sheer(1) + 1.2 * sc, 0); K.add(jib, SAIL); }
  K.rod(tops[0], bs, 0.04 * sc, RIG, 3); K.rod(tops[0], tops[1], 0.04 * sc, RIG, 3); K.rod(V(bs.x, bs.y, 0), V(xOf(0.98), 0.2 * sc, 0), 0.04 * sc, RIG, 3);
  const g = new THREE.Group(), m = K.mesh('schooner'); g.add(m); g.userData.size = [L * 1.2, tops[1].y + 6 * sc, B]; return g;
}

/* sideWheeler(o): the Shady Side, a wooden side-wheel passenger steamboat of New York Harbor (built at Bulls Ferry in 1873; the Black Star Line
   ran her as an excursion boat from 1920). Shaped after James Bard's watercolour of her (a true side view, as all his ship portraits are) and the
   figures in her record: 168 ft 1 in (51.2 m) long and 27 ft 5 in (8.4 m) in the hull. From the painting, measured against that length: a low white
   hull; a main deck carried out over the water on guards; a long white cabin on it with a row of windows; an open fore deck under an awning; a
   saloon deck above with a shorter cabin and a rail all round; a small pilot house forward on that deck; one tall black funnel just behind it
   (about 16 m above the water); a half-round paddle box each side a little aft of the middle (7.2 m across), the wheel showing red under it; the
   A-frame and diamond-shaped walking beam of her engine standing above the paddle boxes; a flagstaff at the bow and the stern.
   Not from a source: how she looked in 1920 (the painting shows her new), so no name, flags or company colours are drawn; the window count.
   The bow is at +x and the still waterline is at y = 0. o.L is the length (default 51.2). ONE mesh with vertex colours. */
export function sideWheeler(o = {}) {
  const L = o.L || 51.2, sc = L / 51.2, B = (o.beam || 8.36 * sc), NS = 32, K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const WHITE = 0xe9e6dc, BOOT = 0x7a2e24, LINE = 0x23262a, DECK = 0xa89472, WIN = 0x5c3a30, FUNNEL = 0x17181b, IRON = 0x4f6258, AWN = 0xcfd6dc, WHEEL = 0x9a3226, SPAR = 0xd8d2c0;
  const xOf = (s) => (s - 0.5) * L, cl = (v) => Math.max(0, Math.min(1, v));
  const half = (s) => B / 2 * Math.max(0.04, s > 0.68 ? 1 - Math.pow((s - 0.68) / 0.32, 1.7) : s < 0.14 ? 0.55 + 0.45 * Math.sin(Math.PI / 2 * s / 0.14) : 1);
  const guard = (s) => half(s) + 1.5 * sc * Math.pow(Math.sin(Math.PI * cl((s - 0.02) / 0.9)), 0.7);   /* the main deck is wider than the hull: it runs out to the paddle boxes */
  const D = 1.7 * sc, U = D + 2.8 * sc, keel = -1.0 * sc;   /* main deck and saloon deck above the water */
  const b = { pos: [], col: [], idx: [] }, tint = new THREE.Color();
  const sect = (s) => { const h = half(s), k = s < 0.05 ? keel + (0.3 * sc - keel) * (1 - s / 0.05) : keel; return [[0, k, BOOT], [h * 0.8, k, BOOT], [h, k + 0.5 * sc, BOOT], [h, 0.02 * sc, BOOT], [h, 0.03 * sc, WHITE], [h, D, WHITE]]; };
  for (const sd of [1, -1]) skin(b, NS, 5, (i, j) => { const s = i / NS, [z, y, c] = sect(s)[j]; tint.set(c); return [xOf(s), y, sd * z, tint.r, tint.g, tint.b]; }, (x, y, z) => new THREE.Vector3(0, -0.2, z));
  const flat = (y, s0, s1, w, hex, n = 24) => { tint.set(hex); const r = tint.r, g = tint.g, bl = tint.b; skin(b, n, 2, (i, j) => { const s = s0 + (s1 - s0) * i / n; return [xOf(s), y, (j - 1) * w(s), r, g, bl]; }, () => new THREE.Vector3(0, 1, 0)); };
  const wall = (y0, y1, s0, s1, w, hex, n = 24) => { tint.set(hex); const r = tint.r, g = tint.g, bl = tint.b; for (const sd of [1, -1]) skin(b, n, 1, (i, j) => { const s = s0 + (s1 - s0) * i / n; return [xOf(s), j ? y1 : y0, sd * w(s), r, g, bl]; }, (x, y, z) => new THREE.Vector3(0, 0, z)); };
  flat(D, 0, 1, guard, DECK, NS); wall(D - 0.22 * sc, D + 0.02 * sc, 0, 1, guard, LINE, NS);   /* the main deck and the dark line of its edge */
  flat(D - 0.22 * sc, 0, 1, guard, WHITE, NS);   /* the underside of the guards */
  /* the main cabin, the saloon deck over it and the saloon */
  const cab = (s) => guard(s) - 0.9 * sc, M0 = 0.03, M1 = 0.69;
  wall(D, U, M0, M1, cab, WHITE); K.box(0.1 * sc, U - D, cab(M1) * 2, xOf(M1), (D + U) / 2, 0, WHITE); K.box(0.1 * sc, U - D, cab(M0) * 2, xOf(M0), (D + U) / 2, 0, WHITE);
  const up = (s) => guard(s) - 0.25 * sc; flat(U, 0.015, 0.8, up, DECK); wall(U - 0.14 * sc, U + 0.02 * sc, 0.015, 0.8, up, WHITE); flat(U - 0.14 * sc, 0.015, 0.8, up, WHITE);
  const S0 = 0.25, S1 = 0.77, sal = (s) => Math.min(cab(s) - 0.9 * sc, B * 0.42), T = U + 2.3 * sc;
  wall(U, T, S0, S1, sal, WHITE); K.box(0.1 * sc, T - U, sal(S1) * 2, xOf(S1), (U + T) / 2, 0, WHITE); K.box(0.1 * sc, T - U, sal(S0) * 2, xOf(S0), (U + T) / 2, 0, WHITE);
  flat(T, S0 - 0.01, S1 + 0.01, (s) => sal(s) + 0.35 * sc, WHITE); wall(T - 0.1 * sc, T + 0.02 * sc, S0 - 0.01, S1 + 0.01, (s) => sal(s) + 0.35 * sc, WHITE);
  K.add(geoOf(b));
  /* windows along both cabins (the paddle box covers the middle of the main cabin) */
  for (const sd of [1, -1]) { for (let k = 0; k < 34; k++) { const s = M0 + 0.02 + (M1 - M0 - 0.04) * k / 33; if (Math.abs(s - 0.42) < 0.075) continue; K.box(0.62 * sc, 0.95 * sc, 0.08 * sc, xOf(s), D + 1.55 * sc, sd * cab(s), WIN); }
    for (let k = 0; k < 22; k++) { const s = S0 + 0.02 + (S1 - S0 - 0.04) * k / 21; K.box(0.62 * sc, 0.85 * sc, 0.08 * sc, xOf(s), U + 1.3 * sc, sd * sal(s), WIN); } }
  /* the rail round the saloon deck, and the awning over the fore deck on its posts */
  for (const sd of [1, -1]) { for (let k = 0; k < 26; k++) { const s0 = 0.02 + 0.775 * k / 26, s1 = 0.02 + 0.775 * (k + 1) / 26; for (const y of [U + 1.0 * sc, U + 0.5 * sc]) K.rod(V(xOf(s0), y, sd * up(s0)), V(xOf(s1), y, sd * up(s1)), 0.035 * sc, WHITE, 3); K.box(0.07 * sc, 1.0 * sc, 0.07 * sc, xOf(s0), U + 0.5 * sc, sd * up(s0), WHITE); }
    for (let k = 0; k <= 5; k++) { const s = 0.71 + 0.25 * k / 5; K.box(0.1 * sc, U - D, 0.1 * sc, xOf(s), (D + U) / 2, sd * (guard(s) - 0.3 * sc), WHITE); } }
  K.rod(V(xOf(0.02), U + 1.0 * sc, -up(0.02)), V(xOf(0.02), U + 1.0 * sc, up(0.02)), 0.035 * sc, WHITE, 3);
  for (let k = 0; k < 12; k++) { const s0 = 0.7 + 0.275 * k / 12, s1 = 0.7 + 0.275 * (k + 1) / 12, sm = (s0 + s1) / 2; K.box((s1 - s0) * L, 0.06 * sc, (guard(sm) - 0.2 * sc) * 2, xOf(sm), U - 0.05 * sc, 0, k % 2 ? AWN : WHITE); }
  /* the pilot house forward on the saloon deck */
  { const x = xOf(0.715), ph = 2.5 * sc; K.box(3.2 * sc, ph, 3.0 * sc, x, T + ph / 2 - 0.9 * sc, 0, WHITE); K.box(3.3 * sc, 0.8 * sc, 3.1 * sc, x, T + ph * 0.62 - 0.9 * sc, 0, WIN); K.box(3.7 * sc, 0.14 * sc, 3.5 * sc, x, T + ph - 0.83 * sc, 0, WHITE); }
  /* the funnel, straight and tall, with its stays */
  { const fx = xOf(0.645), r = 0.62 * sc, top = 16.4 * sc, fh = top - T; K.cyl(r * 1.04, r, fh, fx, T + fh / 2, 0, FUNNEL, 14); K.cyl(r * 1.12, r * 1.12, 0.18 * sc, fx, top - 0.3 * sc, 0, FUNNEL, 14);
    for (const sd of [1, -1]) for (const dx of [-5, 5]) K.rod(V(fx, top - 3 * sc, 0), V(fx + dx * sc, T, sd * 1.6 * sc), 0.03 * sc, LINE, 3); }
  /* the paddle boxes and the wheels under them */
  const px = xOf(0.42), pr = 3.6 * sc, pc = 6.6 * sc - pr;
  for (const sd of [1, -1]) { const z = sd * (guard(0.42) - 0.75 * sc); const g = new THREE.CylinderGeometry(pr, pr, 1.5 * sc, 20, 1, false, 0, Math.PI); g.rotateY(Math.PI / 2); g.rotateX(Math.PI / 2); g.translate(px, pc, z); K.add(g, WHITE);
    K.box(pr * 2, pc - D, 1.5 * sc, px, (pc + D) / 2, z, WHITE);
    const rim = new THREE.TorusGeometry(pr * 0.98, 0.09 * sc, 4, 20, Math.PI); rim.translate(px, pc, z + sd * 0.76 * sc); K.add(rim, LINE);
    for (let k = 1; k < 8; k++) { const a = Math.PI * k / 8; K.rod(V(px + Math.cos(a) * pr * 0.25, pc + Math.sin(a) * pr * 0.25, z + sd * 0.77 * sc), V(px + Math.cos(a) * pr * 0.92, pc + Math.sin(a) * pr * 0.92, z + sd * 0.77 * sc), 0.045 * sc, LINE, 3); }   /* the fan of slats on its face */
    const w = new THREE.CylinderGeometry(pr * 0.9, pr * 0.9, 1.1 * sc, 16, 1, false, 0, Math.PI); w.rotateY(Math.PI / 2); w.rotateX(-Math.PI / 2); w.translate(px, D + 0.6 * sc, z); K.add(w, WHEEL);   /* the lower half of the wheel, below the guard */ }
  /* the walking beam of her engine: an A-frame through the saloon roof and the diamond-shaped beam rocking on top of it */
  { const wx = xOf(0.48), ay = 9.6 * sc; for (const sd of [1, -1]) for (const dx of [-2.3, 2.3]) K.rod(V(wx + dx * sc, T, sd * 0.9 * sc), V(wx, ay, sd * 0.35 * sc), 0.16 * sc, 0xc89a5a, 5);   /* the gallows frame is timber in the painting, a pale tan; the beam on it is iron, painted green */
    const tip = (d, h) => V(wx + d * Math.cos(0.16) * sc - h * Math.sin(0.16) * sc, ay + d * Math.sin(0.16) * sc + h * sc, 0), E = [tip(-3.1, 0), tip(0, 0.85), tip(3.1, 0), tip(0, -0.85)];
    for (let k = 0; k < 4; k++) K.rod(E[k], E[(k + 1) % 4], 0.12 * sc, IRON, 5); K.rod(E[0], E[2], 0.1 * sc, IRON, 5); K.rod(E[1], E[3], 0.1 * sc, IRON, 5);
    K.rod(E[0], V(E[0].x, T, 0), 0.08 * sc, IRON, 4); K.rod(E[2], V(E[2].x, D + 1 * sc, 0), 0.08 * sc, IRON, 4); }
  /* more of what Bard painted (18 November 2026, owner: "could be a bit more detailed"):
     - a white rail with turned posts round the open fore deck, under the striped awning, and along the main deck aft of the paddle boxes;
     - a second, smaller striped awning on the saloon deck forward of the pilot house;
     - window frames picked out in red on the saloon deck, and a dark band under the main deck windows;
     - gilt ball finials on the rail posts, a gilt eagle on the pilot house roof, a bell and the brass whistle on the escape pipe beside the funnel;
     - a gilt sunburst in the middle of each paddle box with a blue ring round it, and the box's face drawn as a fan of slats (already there). */
  const GILT = 0xd8b04a, RED = 0xa03a2c, BLUE = 0x3d5f9a;
  for (const sd of [1, -1]) { for (let k = 0; k <= 22; k++) { const s0 = 0.7 + 0.28 * k / 22, z = sd * (guard(s0) - 0.12 * sc); K.box(0.06 * sc, 0.95 * sc, 0.06 * sc, xOf(s0), D + 0.48 * sc, z, WHITE); }
    for (const y of [D + 0.95 * sc, D + 0.5 * sc]) for (let k = 0; k < 22; k++) { const s0 = 0.7 + 0.28 * k / 22, s1 = 0.7 + 0.28 * (k + 1) / 22; K.rod(V(xOf(s0), y, sd * (guard(s0) - 0.12 * sc)), V(xOf(s1), y, sd * (guard(s1) - 0.12 * sc)), 0.03 * sc, WHITE, 3); }
    for (let k = 0; k <= 16; k++) { const s0 = 0.04 + 0.28 * k / 16; K.box(0.06 * sc, 0.95 * sc, 0.06 * sc, xOf(s0), D + 0.48 * sc, sd * (guard(s0) - 0.12 * sc), WHITE); }
    for (const y of [D + 0.95 * sc]) for (let k = 0; k < 16; k++) { const s0 = 0.04 + 0.28 * k / 16, s1 = 0.04 + 0.28 * (k + 1) / 16; K.rod(V(xOf(s0), y, sd * (guard(s0) - 0.12 * sc)), V(xOf(s1), y, sd * (guard(s1) - 0.12 * sc)), 0.03 * sc, WHITE, 3); }
    for (let k = 0; k < 26; k += 2) { const s0 = 0.02 + 0.775 * k / 26; K.cyl(0.07 * sc, 0.07 * sc, 0.14 * sc, xOf(s0), U + 1.1 * sc, sd * up(s0), GILT, 6); }   /* gilt ball finials on the saloon deck rail */
    for (let k = 0; k < 22; k++) { const s0 = S0 + 0.02 + (S1 - S0 - 0.04) * k / 21; K.box(0.78 * sc, 1.02 * sc, 0.06 * sc, xOf(s0), U + 1.3 * sc, sd * (sal(s0) + 0.012 * sc), RED); }   /* the red frames round the saloon windows (the dark glass is drawn over them) */
    K.box((M1 - M0) * L, 0.12 * sc, 0.05 * sc, xOf((M0 + M1) / 2), D + 0.95 * sc, sd * (cab((M0 + M1) / 2) + 0.01 * sc), LINE); }
  for (const sd of [1, -1]) for (let k = 0; k < 22; k++) { const s0 = S0 + 0.02 + (S1 - S0 - 0.04) * k / 21; K.box(0.62 * sc, 0.85 * sc, 0.08 * sc, xOf(s0), U + 1.3 * sc, sd * (sal(s0) + 0.03 * sc), WIN); }
  for (let k = 0; k < 6; k++) { const s0 = 0.745 + 0.045 * k / 6, s1 = 0.745 + 0.045 * (k + 1) / 6, sm = (s0 + s1) / 2; K.box((s1 - s0) * L, 0.05 * sc, sal(0.76) * 2 + 0.4 * sc, xOf(sm), T + 2.1 * sc, 0, k % 2 ? BLUE : WHITE); }   /* the small striped awning forward of the pilot house */
  for (const sd of [1, -1]) for (const s0 of [0.748, 0.788]) K.box(0.06 * sc, 2.1 * sc, 0.06 * sc, xOf(s0), T + 1.05 * sc, sd * sal(0.76), WHITE);
  { const x = xOf(0.715), ph = 2.5 * sc, top = T + ph - 0.76 * sc; K.cyl(0.05 * sc, 0.05 * sc, 0.5 * sc, x, top + 0.25 * sc, 0, GILT, 5); const e = new THREE.SphereGeometry(0.3 * sc, 8, 6); e.scale(1.6, 0.9, 0.7); e.translate(x, top + 0.62 * sc, 0); K.add(e, GILT); for (const sd of [1, -1]) K.box(0.6 * sc, 0.06 * sc, 0.45 * sc, x - 0.1 * sc, top + 0.72 * sc, sd * 0.35 * sc, GILT, 0, sd * 0.4); }   /* the gilt eagle on the pilot house, wings spread */
  { const fx = xOf(0.645); K.cyl(0.09 * sc, 0.09 * sc, 4.4 * sc, fx - 1.1 * sc, T + 2.2 * sc, 0.7 * sc, 0x8a8c88, 6); K.cyl(0.13 * sc, 0.08 * sc, 0.5 * sc, fx - 1.1 * sc, T + 4.6 * sc, 0.7 * sc, GILT, 8);   /* the escape pipe and its brass whistle */
    K.cyl(0.05 * sc, 0.05 * sc, 1.2 * sc, fx + 1.4 * sc, T + 0.6 * sc, 0, LINE, 5); const bell = new THREE.CylinderGeometry(0.16 * sc, 0.28 * sc, 0.36 * sc, 10, 1, true); bell.translate(fx + 1.4 * sc, T + 1.3 * sc, 0); K.add(bell, GILT); }   /* the bell on its post */
  for (const sd of [1, -1]) { const z = sd * (guard(0.42) - 0.75 * sc + 0.77 * sc); const sun = new THREE.CircleGeometry(1.0 * sc, 16, 0, Math.PI); sun.translate(px, pc, 0); if (sd < 0) sun.rotateY(Math.PI); sun.translate(0, 0, z + sd * 0.02 * sc); K.add(sun, GILT);
    const ring = new THREE.TorusGeometry(pr * 0.86, 0.12 * sc, 4, 20, Math.PI); ring.translate(px, pc, z + sd * 0.01 * sc); K.add(ring, BLUE); }
  /* flagstaffs at the bow and the stern (no flags: we have no source for the ones she flew in 1920) */
  K.cyl(0.07 * sc, 0.04 * sc, 11 * sc, xOf(0.985), D + 5.5 * sc, 0, SPAR, 5); K.cyl(0.07 * sc, 0.04 * sc, 10.5 * sc, xOf(0.03), U + 5.25 * sc, 0, SPAR, 5);
  const g = new THREE.Group(), m = K.mesh('sideWheeler'); g.add(m); g.userData.size = [L, 16.4 * sc - keel, guard(0.42) * 2]; return g;
}

/* steamYacht(o): the Kanawha, a twin-screw steam yacht built in 1899 at Morris Heights, New York (the Black Star Line bought her in 1920 and
   called her Antonio Maceo). Shaped after a photograph of her under way as a private yacht before 1917 (US Naval History and Heritage Command
   NH 102128) and her registered size: 208.4 ft (63.5 m) long, 24.4 ft (7.4 m) beam. From the photograph, measured against that length: a white
   hull with a clipper bow and a long bowsprit, a strong sheer and an overhanging counter stern; a row of portholes; a long low dark deckhouse;
   one funnel a little aft of the middle; an open bridge with an awning just ahead of it; boats on davits aft of the funnel; three thin pole
   masts raked aft (the fore and main about 23 m above the deck, the mizzen 17 m), with one yard on the foremast.
   Not from a source: her colours (the photograph is black and white: the funnel is drawn buff with a black top, as most yachts of her day
   carried, and the deckhouse as varnished wood), and how the Black Star Line painted her. No name or flags.
   The bow is at +x and the still waterline is at y = 0. o.L is the length on deck (default 63.5). ONE mesh with vertex colours. */
export function steamYacht(o = {}) {
  const L = o.L || 63.5, sc = L / 63.5, B = (o.beam || 7.44 * sc), NS = 36, K = paintKit(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const WHITE = 0xe8e6de, BOOT = 0x7a2e24, DECK = 0xb09a72, HOUSE = 0x4a3626, DARK = 0x22282c, BUFF = 0xc9a86a, BLACK = 0x17181b, SPAR = 0xb89a66, RIG = 0x2a2826, AWN = 0xdad6c8, BOAT = 0xece8dc;
  const half = (s) => B / 2 * Math.max(0.03, s > 0.48 ? 1 - Math.pow((s - 0.48) / 0.52, 1.9) : 0.34 + 0.66 * Math.pow(Math.sin(Math.PI / 2 * s / 0.48), 0.8));
  const sheer = (s) => sc * (3.2 + 1.7 * Math.pow(Math.max(0, s - 0.4) / 0.6, 2) + 0.5 * Math.pow(Math.max(0, 0.4 - s) / 0.4, 2)), keel = -2.6 * sc;
  /* the stem rakes forward and the counter aft as they rise: x moves out with height at each end */
  const xAt = (s, y) => (s - 0.5) * L * 0.8 + (0.05 * L + 0.062 * L * Math.max(0, y) / sheer(1)) * smooth(0.8, 1, s) * (s > 0.5 ? 1 : 0) - (0.05 * L + 0.045 * L * Math.max(0, y) / sheer(0)) * (1 - smooth(0, 0.16, s)) * (s < 0.5 ? 1 : 0);
  const xD = (s) => xAt(s, sheer(s));   /* where the deck is at station s */
  const b = { pos: [], col: [], idx: [] }, tint = new THREE.Color();
  const sect = (s) => { const h = half(s), top = sheer(s) + 0.5 * sc, k = s < 0.14 ? keel + (0.6 * sc - keel) * Math.pow(1 - s / 0.14, 1.4) : s > 0.9 ? keel + (-0.4 * sc - keel) * Math.pow((s - 0.9) / 0.1, 2) : keel;
    return [[0, k, BOOT], [h * 0.45, k + 0.5 * sc, BOOT], [h * 0.86, Math.min(-0.1 * sc, k + 1.6 * sc), BOOT], [h * 0.96, 0.02 * sc, BOOT], [h * 0.965, 0.04 * sc, WHITE], [h, top * 0.6, WHITE], [h, top, WHITE]]; };
  for (const sd of [1, -1]) skin(b, NS, 6, (i, j) => { const s = i / NS, [z, y, c] = sect(s)[j]; tint.set(c); return [xAt(s, y), y, sd * z, tint.r, tint.g, tint.b]; }, (x, y, z) => new THREE.Vector3(0, -0.15, z));
  { const dc = new THREE.Color(DECK); skin(b, NS, 2, (i, j) => { const s = i / NS; return [xD(s), sheer(s), (j - 1) * half(s) * 0.94, dc.r, dc.g, dc.b]; }, () => new THREE.Vector3(0, 1, 0));
    const wc = new THREE.Color(WHITE); for (const sd of [1, -1]) skin(b, NS, 1, (i, j) => { const s = i / NS; return [xAt(s, sheer(s) + (j ? 0 : 0.5 * sc)), sheer(s) + (j ? 0 : 0.5 * sc), sd * half(s) * 0.95, wc.r * 0.86, wc.g * 0.86, wc.b * 0.86]; }, (x, y, z) => new THREE.Vector3(0, 0, -z)); }
  K.add(geoOf(b));
  for (const sd of [1, -1]) for (let k = 0; k < 28; k++) { const s = 0.17 + 0.68 * k / 27, y = sheer(s) - 1.25 * sc;   /* the photograph shows a long close row of them */ K.cyl(0.13 * sc, 0.13 * sc, 0.06 * sc, xAt(s, y), y, sd * half(s) * 0.995, DARK, 6, Math.PI / 2); }   /* portholes */
  /* the long low deckhouse, in three lengths that follow the sheer, with its windows; the skylight roofs */
  for (const [s0, s1] of [[0.16, 0.36], [0.37, 0.58], [0.59, 0.76]]) { const sm = (s0 + s1) / 2, len = xD(s1) - xD(s0), w = Math.min(half(s0), half(s1)) * 1.25, y = sheer(sm), hh = 1.9 * sc; K.box(len, hh, w, xD(sm), y + hh / 2, 0, HOUSE, 0, Math.atan2(sheer(s1) - sheer(s0), len)); K.box(len + 0.3 * sc, 0.1 * sc, w + 0.4 * sc, xD(sm), y + hh + 0.05 * sc, 0, AWN, 0, Math.atan2(sheer(s1) - sheer(s0), len));
    for (const sd of [1, -1]) for (let k = 0; k < 7; k++) K.box(0.75 * sc, 0.7 * sc, 0.06 * sc, xD(s0) + len * (k + 0.5) / 7, y + hh * 0.62, sd * w / 2, DARK); }
  /* the funnel: one, raked a little, buff with a black top */
  { const fx = xD(0.46), fy = sheer(0.46) + 1.9 * sc, fh = 5.9 * sc, r = 1.3 * sc, rk = -0.08; const g1 = new THREE.CylinderGeometry(r, r * 1.03, fh * 0.8, 14); g1.translate(0, fh * 0.4, 0); g1.rotateZ(rk); g1.translate(fx, fy, 0); K.add(g1, BUFF);
    const g2 = new THREE.CylinderGeometry(r * 1.02, r * 1.02, fh * 0.2, 14); g2.translate(0, fh * 0.9, 0); g2.rotateZ(rk); g2.translate(fx, fy, 0); K.add(g2, BLACK); }
  /* the open bridge ahead of the funnel, under an awning, and the awning over the after deck */
  { const s = 0.535, x = xD(s), y = sheer(s) + 1.95 * sc; K.box(4.6 * sc, 0.12 * sc, B * 0.8, x, y + 0.06 * sc, 0, DECK); for (const sd of [1, -1]) { K.box(4.6 * sc, 0.9 * sc, 0.06 * sc, x, y + 0.55 * sc, sd * B * 0.4, AWN); for (const dx of [-2.2, 2.2]) K.box(0.07 * sc, 2.1 * sc, 0.07 * sc, x + dx * sc, y + 1.05 * sc, sd * B * 0.38, SPAR); }
    K.box(5.2 * sc, 0.07 * sc, B * 0.86, x, y + 2.13 * sc, 0, AWN); K.box(1.3 * sc, 1.2 * sc, 1.3 * sc, x + 0.6 * sc, y + 0.7 * sc, 0, HOUSE); }
  { const s0 = 0.03, s1 = 0.14, sm = 0.085, w = half(sm) * 1.5, y = sheer(sm) + 2.3 * sc; K.box(xD(s1) - xD(s0), 0.07 * sc, w, xD(sm), y, 0, AWN); for (const sd of [1, -1]) for (const s of [s0 + 0.005, s1 - 0.005]) K.box(0.06 * sc, 2.3 * sc, 0.06 * sc, xD(s), sheer(s) + 1.15 * sc, sd * w * 0.47, SPAR); }
  /* boats on davits, two a side, aft of the funnel */
  for (const sd of [1, -1]) for (const s of [0.4, 0.3]) { const x = xD(s), y = sheer(s) + 2.5 * sc, z = sd * (half(s) * 0.98); const g = new THREE.SphereGeometry(1, 10, 5, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); g.scale(2.9 * sc, 0.75 * sc, 0.8 * sc); g.translate(x, y, z); K.add(g, BOAT); K.box(5.6 * sc, 0.08 * sc, 1.5 * sc, x, y, z, 0xc8bfa8);
    for (const dx of [-2.1, 2.1]) K.tube([V(x + dx * sc, sheer(s), z - sd * 0.7 * sc), V(x + dx * sc, y + 1.0 * sc, z - sd * 0.6 * sc), V(x + dx * sc, y + 1.25 * sc, z)], 0.07 * sc, WHITE, 5, 4); }
  /* the bowsprit and the three pole masts, raked aft, with one yard on the foremast and the stays */
  const stem = V(xD(1), sheer(1) + 0.5 * sc, 0), bs = V(xD(1) + 8.9 * sc, sheer(1) + 1.3 * sc, 0); K.rod(V(xD(0.97), sheer(0.97) + 0.4 * sc, 0), bs, 0.16 * sc, SPAR, 6); K.rod(bs, V(xAt(1, 0.4 * sc), 0.4 * sc, 0), 0.03 * sc, RIG, 3);
  const tops = [];
  for (const [s, mh] of [[0.73, 23.5], [0.36, 23.4], [0.155, 17]]) { const x = xD(s), y0 = sheer(s), top = V(x - 0.137 * mh * sc, y0 + mh * sc, 0); K.rod(V(x, y0, 0), top, 0.16 * sc, SPAR, 6);
    for (const sd of [1, -1]) for (const dx of [-0.9, -2.2]) K.rod(V(x - 0.137 * mh * 0.7 * sc, y0 + mh * 0.7 * sc, 0), V(x + dx * sc, y0 + 0.5 * sc, sd * half(s) * 0.95), 0.025 * sc, RIG, 3);
    tops.push(top); }
  { const x = xD(0.73), y0 = sheer(0.73), yy = y0 + 7.6 * sc; K.rod(V(x - 1.05 * sc, yy - 0.3 * sc, -3.2 * sc), V(x - 1.05 * sc, yy + 0.3 * sc, 3.2 * sc), 0.08 * sc, SPAR, 5); }
  K.rod(tops[0], bs, 0.03 * sc, RIG, 3); K.rod(tops[0], stem, 0.03 * sc, RIG, 3); K.rod(tops[0], tops[1], 0.03 * sc, RIG, 3); K.rod(tops[1], tops[2], 0.03 * sc, RIG, 3); K.rod(tops[2], V(xD(0), sheer(0) + 0.5 * sc, 0), 0.03 * sc, RIG, 3);
  K.cyl(0.04 * sc, 0.03 * sc, 2.4 * sc, xD(0.005), sheer(0) + 1.6 * sc, 0, SPAR, 4);   /* the ensign staff at the stern, bare */
  /* more of what the photograph shows (18 November 2026, owner: "could be a bit more detailed"):
     - a white rail on stanchions all round the deck edge, and a thin gilt line along the sheer below it, as yachts of her day carried;
     - gilt scrollwork (trailboards) either side of the clipper bow under the bowsprit;
     - cowl ventilators either side of the funnel, and the steam pipe up its after side;
     - a canvas dodger round the front of the bridge, and a small chart house on it;
     - a gaff on the main and the mizzen mast, as in the photograph. */
  const GILT2 = 0xd0a848;
  for (const sd of [1, -1]) { for (let k = 0; k <= 40; k++) { const s = 0.01 + 0.97 * k / 40; K.box(0.05 * sc, 0.75 * sc, 0.05 * sc, xD(s), sheer(s) + 0.88 * sc, sd * half(s) * 0.93, WHITE); }
    for (let k = 0; k < 40; k++) { const s0 = 0.01 + 0.97 * k / 40, s1 = 0.01 + 0.97 * (k + 1) / 40; K.rod(V(xD(s0), sheer(s0) + 1.25 * sc, sd * half(s0) * 0.93), V(xD(s1), sheer(s1) + 1.25 * sc, sd * half(s1) * 0.93), 0.035 * sc, WHITE, 3);
      const y0 = sheer(s0) - 0.32 * sc, y1 = sheer(s1) - 0.32 * sc; K.rod(V(xAt(s0, y0), y0, sd * half(s0) * 1.002), V(xAt(s1, y1), y1, sd * half(s1) * 1.002), 0.035 * sc, GILT2, 3); }
    const g = new THREE.TorusGeometry(1.1 * sc, 0.07 * sc, 4, 10, Math.PI * 0.8); g.rotateZ(-0.3); g.translate(xD(0.985), sheer(0.985) - 0.5 * sc, sd * half(0.985) * 1.05 + sd * 0.05 * sc); K.add(g, GILT2); }
  { const fx = xD(0.46), fy = sheer(0.46) + 1.9 * sc; K.cyl(0.11 * sc, 0.11 * sc, 6.2 * sc, fx - 1.55 * sc, fy + 3.1 * sc, 0, 0x8a8c88, 6, 0, -0.08);
    for (const sd of [1, -1]) for (const dx of [1.9, -2.4]) { const x = fx + dx * sc, z = sd * 1.6 * sc; K.cyl(0.18 * sc, 0.18 * sc, 1.6 * sc, x, fy + 0.8 * sc, z, WHITE, 8); const m2 = new THREE.CylinderGeometry(0.36 * sc, 0.22 * sc, 0.5 * sc, 10, 1, true); m2.rotateZ(Math.PI / 2 * (dx > 0 ? 1 : -1)); m2.translate(x + (dx > 0 ? 0.18 : -0.18) * sc, fy + 1.75 * sc, z); K.add(m2, WHITE); } }
  { const s = 0.535, x = xD(s), y = sheer(s) + 1.95 * sc; K.box(0.08 * sc, 0.95 * sc, B * 0.8, x + 2.3 * sc, y + 0.5 * sc, 0, AWN); K.box(1.8 * sc, 1.5 * sc, 1.8 * sc, x - 1.2 * sc, y + 0.8 * sc, 0, HOUSE); K.box(1.9 * sc, 0.08 * sc, 1.9 * sc, x - 1.2 * sc, y + 1.58 * sc, 0, WHITE); for (const sd of [1, -1]) K.box(1.2 * sc, 0.5 * sc, 0.05 * sc, x - 1.2 * sc, y + 1.0 * sc, sd * 0.91 * sc, DARK); }
  for (const [s, mh] of [[0.36, 23.4], [0.155, 17]]) { const x = xD(s), y0 = sheer(s), lean = 0.137, gy = y0 + 4.2 * sc, gx = x - lean * 4.2 * sc; K.rod(V(gx, gy, 0), V(gx - (s > 0.2 ? 7.5 : 5.5) * sc, gy + 2.6 * sc, 0), 0.08 * sc, SPAR, 5); }

  const g = new THREE.Group(), m = K.mesh('steamYacht'); g.add(m); g.userData.size = [L + 9 * sc, tops[0].y - keel, B]; return g;
}
