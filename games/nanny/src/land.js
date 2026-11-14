/* games/nanny/src/land.js: the mountain world. Everything is made in code (no image files).
   - noise (vnoise, fbm) and smooth paths
   - makeGround(): the shape of the land. A base height function, plus trails (paths you can walk) and flats (clearings).
     It gives h(x, z), walkable(x, z), clamp(x, z), and rectangles ("walls") for the engine's audits.
   - landMesh(): the terrain you see, coloured by slope and by how close a trail is
   - ribbon(): a strip that follows a path over the land (a trail, a stream)
   - makeRidges(): rings of far blue ridges that fade into the haze. They follow the camera, like a painted backdrop.
   - makeMist(): a slow sea of mist in the valleys
   - makeSun(), makeFireflies(), makeSmoke(), ENV (times of day) and mixEnv()
   Coordinates are metres; y is up; yaw 0 looks toward -z. */
import * as THREE from 'three';
import { cv, rng, std, T } from './gfx.js';

/* ---------- noise ---------- */
const imul = Math.imul;
function hash2(ix, iz, seed) { let h = imul(ix, 374761393) ^ imul(iz, 668265263) ^ imul(seed, 1274126177); h = imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
export function vnoise(x, z, seed = 1) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz, seed), b = hash2(ix + 1, iz, seed), c = hash2(ix, iz + 1, seed), d = hash2(ix + 1, iz + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, z, oct = 4, seed = 1) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, z * f, seed + i * 17); n += a; a *= 0.5; f *= 2.03; } return s / n; }
export const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mixN = (a, b, k) => a + (b - a) * k;

/* a smooth path through the given points [x, z, y]: about one point every `step` metres */
export function smoothPath(pts, step = 1.5) {
  const out = [], n = pts.length, P = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), k = Math.max(1, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let j = 0; j < k; j++) { const t = j / k, t2 = t * t, t3 = t2 * t, cr = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - 3 * c + d - a) * t3);
      out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1]), mixN(p1[2], p2[2], t * t * (3 - 2 * t))]); }
  }
  out.push(pts[n - 1].slice()); return out;
}
/* how far along a dense path a point is, and the point at a given distance along it */
export function pathLength(d) { let L = 0; for (let i = 1; i < d.length; i++) L += Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]); return L; }
export function pathAt(d, s) { for (let i = 1; i < d.length; i++) { const l = Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]); if (s <= l || i === d.length - 1) { const k = Math.max(0, Math.min(1, s / (l || 1))); return [mixN(d[i - 1][0], d[i][0], k), mixN(d[i - 1][1], d[i][1], k), Math.atan2(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1])]; } s -= l; } return [d[0][0], d[0][1], 0]; }

/* ---------- the ground: a base shape, cut by trails and clearings ----------
   base(x, z): the wild height. trails: [{ pts: [[x, z, y], ...], w }] where w is half the width you can walk. flats: [{ x, z, r, y }] round clearings.
   Near a trail or a clearing the land is levelled to its height (a bench cut into the slope), then eases back to the wild height over `bench` metres. */
export function makeGround({ base, trails = [], flats = [], bench = 4.5 }) {
  const segs = [];   /* each: ax, az, ay, bx, bz, by, w */
  for (const t of trails) { t.dense = t.dense || smoothPath(t.pts, t.step || 1.5); const d = t.dense; for (let i = 0; i < d.length - 1; i++) segs.push([d[i][0], d[i][1], d[i][2], d[i + 1][0], d[i + 1][1], d[i + 1][2], t.w, t.bench === undefined ? bench : t.bench, t.nowalk ? 1 : 0]); }
  let onT = 0;   /* set by h(): how close the last point asked for is to a trail or clearing (1 on it, 0 far away) */
  function h(x, z) {
    let wsum = 0, ysum = 0, wmax = 0; onT = 0;
    for (let i = 0; i < segs.length; i++) { const s = segs[i], dx = s[3] - s[0], dz = s[4] - s[1], t = Math.max(0, Math.min(1, ((x - s[0]) * dx + (z - s[1]) * dz) / (dx * dx + dz * dz || 1))), d = Math.hypot(x - s[0] - dx * t, z - s[1] - dz * t);
      if (d > s[6] + s[7]) continue; const w = 1 - smooth(s[6] + 0.5, s[6] + s[7], d), ww = w * w * w + 1e-6; wsum += ww; ysum += ww * (s[2] + (s[5] - s[2]) * t); if (w > wmax) wmax = w; const o = 1 - smooth(s[6] - 0.15, s[6] + 0.7, d); if (o > onT) onT = o; }
    for (let i = 0; i < flats.length; i++) { const f = flats[i], d = Math.hypot(x - f.x, z - f.z), bn = f.bench === undefined ? bench : f.bench; if (d > f.r + bn) continue; const w = 1 - smooth(f.r + 0.5, f.r + bn, d), ww = w * w * w + 1e-6; wsum += ww; ysum += ww * f.y; if (w > wmax) wmax = w; const o = (1 - smooth(f.r - 0.3, f.r + 0.8, d)) * (f.earth === undefined ? 0.7 : f.earth); if (o > onT) onT = o; }
    const b = base(x, z); return wmax > 0 ? b + (ysum / wsum - b) * wmax : b;
  }
  const trailness = (x, z) => { h(x, z); return onT; };
  function walkable(x, z, m = 0) {
    for (let i = 0; i < segs.length; i++) { const s = segs[i]; if (s[8]) continue; const dx = s[3] - s[0], dz = s[4] - s[1], t = Math.max(0, Math.min(1, ((x - s[0]) * dx + (z - s[1]) * dz) / (dx * dx + dz * dz || 1))); if (Math.hypot(x - s[0] - dx * t, z - s[1] - dz * t) <= s[6] - m) return true; }
    for (let i = 0; i < flats.length; i++) if (!flats[i].nowalk && Math.hypot(x - flats[i].x, z - flats[i].z) <= flats[i].r - m) return true;
    return false;
  }
  function clamp(x, z) {   /* the nearest spot you may stand on: slides smoothly along the edge of a trail */
    let bx = x, bz = z, bd = 1e9;
    for (let i = 0; i < segs.length; i++) { const s = segs[i]; if (s[8]) continue; const dx = s[3] - s[0], dz = s[4] - s[1], t = Math.max(0, Math.min(1, ((x - s[0]) * dx + (z - s[1]) * dz) / (dx * dx + dz * dz || 1))), px = s[0] + dx * t, pz = s[1] + dz * t, d = Math.hypot(x - px, z - pz);
      if (d <= s[6]) return [x, z]; const m = d - s[6]; if (m < bd) { bd = m; const k = s[6] * 0.999 / d; bx = px + (x - px) * k; bz = pz + (z - pz) * k; } }
    for (let i = 0; i < flats.length; i++) { const f = flats[i]; if (f.nowalk) continue; const d = Math.hypot(x - f.x, z - f.z); if (d <= f.r) return [x, z]; const m = d - f.r; if (m < bd) { bd = m; const k = f.r * 0.999 / d; bx = f.x + (x - f.x) * k; bz = f.z + (z - f.z) * k; } }
    return [bx, bz];
  }
  const b = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 };
  for (const s of segs) if (!s[8]) for (const [x, z] of [[s[0], s[1]], [s[3], s[4]]]) { b.x0 = Math.min(b.x0, x - s[6]); b.x1 = Math.max(b.x1, x + s[6]); b.z0 = Math.min(b.z0, z - s[6]); b.z1 = Math.max(b.z1, z + s[6]); }
  for (const f of flats) if (!f.nowalk) { b.x0 = Math.min(b.x0, f.x - f.r); b.x1 = Math.max(b.x1, f.x + f.r); b.z0 = Math.min(b.z0, f.z - f.r); b.z1 = Math.max(b.z1, f.z + f.r); }
  const bounds = { x0: Math.floor(b.x0) - 1, x1: Math.ceil(b.x1) + 1, z0: Math.floor(b.z0) - 1, z1: Math.ceil(b.z1) + 1 };
  /* rectangles covering everywhere you may not walk, for the engine's audits (engine/audit.js works with rectangles). Cells are `cell` metres. */
  function walls(cell = 0.5) {
    const out = []; let prev = [];
    for (let z = bounds.z0; z < bounds.z1 - 1e-6; z += cell) { const row = []; let x0 = null;
      for (let x = bounds.x0; x <= bounds.x1 + 1e-6; x += cell) { const blocked = x < bounds.x1 - 1e-6 && !walkable(x + cell / 2, z + cell / 2, -0.12); if (blocked && x0 === null) x0 = x; if (!blocked && x0 !== null) { row.push([x0, z, x, z + cell]); x0 = null; } }
      for (const r of row) { const p = prev.find((q) => q[0] === r[0] && q[2] === r[2] && Math.abs(q[3] - r[1]) < 1e-6); if (p) { p[3] = r[3]; row[row.indexOf(r)] = p; } else out.push(r); }
      prev = row; }
    return out;
  }
  return { h, trailness, walkable, clamp, bounds, walls, trails, flats, segs };
}

/* ---------- the terrain you see ---------- */
const DETAIL = () => cv(256, 256, (x, w, h) => { x.fillStyle = '#d8d8d2'; x.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { const v = 150 + Math.random() * 105 | 0; x.fillStyle = `rgba(${v},${v},${v - 8},0.5)`; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 5, 1 + Math.random() * 4); }
  for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(255,255,240,0.14)'; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 22, 4 + Math.random() * 12, Math.random() * 3, 0, 7); x.fill(); } }, [1, 1]);
let _detail = null;
export const PALETTE = {
  hill: { a: [0.20, 0.42, 0.16], b: [0.32, 0.52, 0.20], rock: [0.42, 0.40, 0.36], earth: [0.52, 0.33, 0.20], low: [0.16, 0.34, 0.16] },
  cane: { a: [0.30, 0.46, 0.18], b: [0.40, 0.54, 0.22], rock: [0.42, 0.40, 0.36], earth: [0.50, 0.32, 0.20], low: [0.22, 0.38, 0.16] },
};
/* size: metres across. seg: squares across. pow > 1 packs the squares closer near the middle, where you walk. */
export function landMesh(G, { size = 320, seg = 150, pow = 1.55, palette = PALETTE.hill, seed = 3, sink = 0.07 } = {}) {
  const geo = new THREE.PlaneGeometry(size, size, seg, seg); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position, half = size / 2, n = p.count, on = new Float32Array(n), uv = geo.attributes.uv;
  for (let i = 0; i < n; i++) { const u = p.getX(i) / half, v = p.getZ(i) / half, x = Math.sign(u) * Math.pow(Math.abs(u), pow) * half, z = Math.sign(v) * Math.pow(Math.abs(v), pow) * half, y = G.h(x, z); on[i] = G.trailness(x, z); p.setXYZ(i, x, y - sink * on[i], z); uv.setXY(i, x / 7, z / 7); }
  geo.computeVertexNormals(); const nor = geo.attributes.normal, col = new Float32Array(n * 3), c = [0, 0, 0];
  for (let i = 0; i < n; i++) { const x = p.getX(i), z = p.getZ(i), y = p.getY(i), ny = nor.getY(i), k = fbm(x * 0.045, z * 0.045, 3, seed), k2 = vnoise(x * 0.4, z * 0.4, seed + 9);
    for (let j = 0; j < 3; j++) c[j] = mixN(palette.a[j], palette.b[j], k) * (0.86 + k2 * 0.28);
    const lowK = smooth(0, -14, y) * 0.6; for (let j = 0; j < 3; j++) c[j] = mixN(c[j], palette.low[j], lowK);
    const rk = smooth(0.86, 0.62, ny) * (0.6 + k2 * 0.4); for (let j = 0; j < 3; j++) c[j] = mixN(c[j], palette.rock[j] * (0.8 + k2 * 0.4), rk);
    const e = on[i] * (0.82 + k2 * 0.18); for (let j = 0; j < 3; j++) c[j] = mixN(c[j], palette.earth[j] * (0.85 + k2 * 0.3), e);
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  _detail = _detail || DETAIL(); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, map: _detail, roughness: 1 })); m.receiveShadow = true; m.userData.noBatch = true; m.name = 'land'; return m;
}

/* a strip that follows a dense path over the land: w is half its width; the texture runs along it */
export function ribbon(dense, w, hfn, mat, { dy = 0.05, vrep = 3, wAt } = {}) {
  const n = dense.length, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = []; let dist = 0;
  for (let i = 0; i < n; i++) { const p = dense[i], a = dense[Math.max(0, i - 1)], b = dense[Math.min(n - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const L = Math.hypot(tx, tz) || 1; tx /= L; tz /= L; const ww = wAt ? wAt(i / (n - 1)) * w : w;
    if (i) dist += Math.hypot(p[0] - dense[i - 1][0], p[1] - dense[i - 1][1]);
    for (let s = 0; s < 2; s++) { const k = s ? 1 : -1, x = p[0] - tz * ww * k, z = p[1] + tx * ww * k, o = (i * 2 + s) * 3; pos[o] = x; pos[o + 1] = hfn(x, z) + dy; pos[o + 2] = z; uv[(i * 2 + s) * 2] = s; uv[(i * 2 + s) * 2 + 1] = dist / vrep; }
    if (i < n - 1) { const q = i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; m.userData.noBatch = true; return m;
}
/* the worn earth of a trail: red-brown, stony, fading into the grass at both edges */
export const trailMat = (() => { let m = null; return () => m || (m = new THREE.MeshStandardMaterial({ map: cv(128, 256, (x, w, h) => { x.clearRect(0, 0, w, h);
  for (let px = 0; px < w; px++) { const e = Math.min(px, w - 1 - px) / (w * 0.28), a = Math.min(1, e * e); x.fillStyle = `rgba(150,98,62,${a})`; x.fillRect(px, 0, 1, h); }
  for (let i = 0; i < 520; i++) { const px = 14 + Math.random() * (w - 28), v = (Math.random() - 0.5) * 60; x.fillStyle = `rgba(${150 + v | 0},${98 + v * 0.8 | 0},${62 + v * 0.6 | 0},0.5)`; x.fillRect(px, Math.random() * h, 1 + Math.random() * 5, 1 + Math.random() * 9); }
  for (let i = 0; i < 26; i++) { x.fillStyle = 'rgba(96,88,78,0.75)'; x.beginPath(); x.ellipse(22 + Math.random() * (w - 44), Math.random() * h, 2 + Math.random() * 4, 1.5 + Math.random() * 3, Math.random() * 3, 0, 7); x.fill(); } }, [1, 1]),
  transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); })();
/* running water: bands of light that slide along the stream. The returned mesh has userData.flow(dt). */
export function streamMesh(dense, w, y, { speed = 0.5 } = {}) {
  const tex = cv(128, 256, (x, W, H) => { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(60,110,110,0.0)'); g.addColorStop(0.18, 'rgba(58,118,122,0.9)'); g.addColorStop(0.5, 'rgba(70,138,140,0.95)'); g.addColorStop(0.82, 'rgba(58,118,122,0.9)'); g.addColorStop(1, 'rgba(60,110,110,0.0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { x.strokeStyle = `rgba(235,250,250,${0.1 + Math.random() * 0.3})`; x.lineWidth = 1 + Math.random() * 2; const px = 16 + Math.random() * (W - 32), py = Math.random() * H; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + (Math.random() - 0.5) * 10, py + 16, px + (Math.random() - 0.5) * 6, py + 30 + Math.random() * 20); x.stroke(); } }, [1, 1]);
  const m = ribbon(dense, w, () => y, new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 0.25, metalness: 0.1 }), { dy: 0, vrep: 9 });
  m.userData.flow = (dt) => { tex.offset.y += dt * speed / 9; }; m.receiveShadow = false; return m;
}

/* ---------- far ridges: rings of mountains that fade to blue. Each ring is a wall with a jagged top; farther rings are paler. ---------- */
export function makeRidges({ layers, seed = 5 } = {}) {
  const L = layers || [{ r: 196, base: 0, amp: 30, k: 0.16 }, { r: 232, base: 12, amp: 44, k: 0.3 }, { r: 276, base: 26, amp: 56, k: 0.44 }, { r: 330, base: 40, amp: 70, k: 0.6 }, { r: 396, base: 56, amp: 86, k: 0.75 }, { r: 468, base: 74, amp: 104, k: 0.88 }];
  const group = new THREE.Group(); group.userData.noBatch = true; const N = 200, list = [];
  L.forEach((ly, li) => {
    const pos = new Float32Array((N + 1) * 6), col = new Float32Array((N + 1) * 6), idx = [], tk = new Float32Array((N + 1) * 2);
    for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2, cx = Math.cos(a), sz = Math.sin(a), n1 = fbm(cx * 2.1 + 9, sz * 2.1 + 9, 4, seed + li * 31), n2 = 1 - Math.abs(2 * vnoise(cx * 6.2 + 3, sz * 6.2 + 3, seed + li * 7) - 1), top = ly.base + ly.amp * (0.62 * n1 + 0.38 * n2 * n1 * 1.6);
      pos.set([cx * ly.r, -160, sz * ly.r, cx * ly.r, top, sz * ly.r], i * 6); tk[i * 2] = 0; tk[i * 2 + 1] = 1; if (i < N) { const q = i * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); } }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide, depthWrite: true })); m.frustumCulled = false; m.renderOrder = -1 + li * -0.01; group.add(m); list.push({ m, k: ly.k, col, pos, base: ly.base, amp: ly.amp });
  });
  const A = new THREE.Color(), B = new THREE.Color(), C = new THREE.Color();
  /* green: the colour of near forest. haze: the colour of the far air. light: 0 (night) to 1 (noon). */
  function tone(green, haze, light = 1) {
    for (const ly of list) { A.set(green).multiplyScalar(0.35 + 0.65 * light).lerp(B.set(haze), ly.k); C.copy(A).lerp(B, 0.35 + ly.k * 0.4);
      for (let i = 0; i < ly.col.length / 6; i++) { const yTop = ly.pos[i * 6 + 4], fold = vnoise(i * 0.21, ly.k * 40, 3), shade = (0.84 + 0.2 * ((yTop - ly.base) / (ly.amp || 1))) * (0.9 + 0.2 * fold); ly.col.set([C.r, C.g, C.b, A.r * shade, A.g * shade, A.b * shade], i * 6); }
      ly.m.geometry.attributes.color.needsUpdate = true; }
  }
  return { group, tone };
}

/* ---------- mist: soft cloud lying in the valleys. Three thin sheets with holes in them, sliding slowly, and banks of cloud standing up out of them. ---------- */
export function makeMist({ seed = 4 } = {}) {
  const r = rng(seed), tex = () => cv(512, 512, (x, w, h) => { x.clearRect(0, 0, w, h); for (let i = 0; i < 70; i++) { const cx = r() * w, cy = r() * h, rad = 26 + r() * 110, a = 0.16 + r() * 0.3; for (const [ox, oy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) { const g = x.createRadialGradient(cx + ox, cy + oy, 2, cx + ox, cy + oy, rad); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx + ox - rad, cy + oy - rad, rad * 2, rad * 2); } } }, [1, 1]);
  const group = new THREE.Group(); group.userData.noBatch = true; const sheets = [], puffs = [];
  for (let i = 0; i < 3; i++) { const t = tex(); t.repeat.set(3 + i * 2, 3 + i * 2); const m = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1500), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.y = -i * 3; m.renderOrder = 2 + i; m.frustumCulled = false; group.add(m); sheets.push({ m, t, vx: 0.003 + i * 0.002, vz: 0.0015 - i * 0.0015 }); }
  const pt = T.cloud(); for (let i = 0; i < 46; i++) { const a = r() * Math.PI * 2, d = 60 + r() * 150, s = new THREE.Sprite(new THREE.SpriteMaterial({ map: pt, transparent: true, depthWrite: false, fog: false })), sc = 70 + r() * 110; s.position.set(Math.cos(a) * d, 2 + r() * 9, Math.sin(a) * d); s.scale.set(sc, sc * 0.36, 1); s.renderOrder = 5; group.add(s); puffs.push(s); }
  return { group, set(y, color, opacity) { group.visible = opacity > 0.01 && y > -150; group.position.y = y; for (const s of sheets) { s.m.material.color.set(color); s.m.material.opacity = opacity * 0.78; } for (const p of puffs) { p.material.color.set(color); p.material.opacity = opacity * 0.5; } }, tick(dt) { for (const s of sheets) { s.t.offset.x += s.vx * dt; s.t.offset.y += s.vz * dt; } } };
}

/* ---------- the sun (a soft disc with a glow) ---------- */
export function makeSun() {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cv(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 4, 128, 128, 126); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.07, 'rgba(255,252,235,1)'); g.addColorStop(0.12, 'rgba(255,240,200,0.55)'); g.addColorStop(0.4, 'rgba(255,220,160,0.16)'); g.addColorStop(1, 'rgba(255,210,150,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }, null, true), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
  s.scale.set(230, 230, 1); s.renderOrder = -1.5; return s;
}

/* ---------- fireflies (in Jamaica, "peenie wallies"): little lights that drift and blink near you at night ---------- */
export function makeFireflies(n = 54) {
  const group = new THREE.Group(); group.userData.noBatch = true; const sets = [], r = rng(31);
  for (let k = 0; k < 3; k++) { const p = new Float32Array(n / 3 * 3); for (let i = 0; i < n / 3; i++) p.set([(r() - 0.5) * 34, 0.3 + r() * 3.2, (r() - 0.5) * 34], i * 3); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xd8ff7a, size: 3.2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); pts.frustumCulled = false; group.add(pts); sets.push({ pts, ph: k * 2.1, sp: 0.7 + k * 0.23 }); }
  return { group, tick(t, on, x, y, z) { group.visible = on; if (!on) return; group.position.set(x, y, z); for (const s of sets) { s.pts.material.opacity = Math.max(0, Math.sin(t * s.sp + s.ph)) * 0.95; s.pts.position.set(Math.sin(t * 0.21 + s.ph) * 1.6, Math.sin(t * 0.33 + s.ph) * 0.3, Math.cos(t * 0.17 + s.ph) * 1.6); } } };
}

/* ---------- smoke and dust: a small pool of soft puffs ---------- */
export function makeSmoke(scene, n = 60) {
  const pool = [], tex = T.puff(); for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 })); s.visible = false; s.renderOrder = 6; scene.add(s); pool.push({ s, age: 1, life: 1, v: new THREE.Vector3() }); }
  let i = 0;
  return {
    emit(pos, vel, { life = 3, size = 1.2, grow = 3.2, color = 0xe9e9e6, opacity = 0.55 } = {}) { const p = pool[i++ % n]; p.age = 0; p.life = life; p.size = size; p.grow = grow; p.op = opacity; p.s.position.copy(pos); p.v.copy(vel); p.s.material.color.set(color); p.s.visible = true; },
    tick(dt) { for (const p of pool) { if (p.age >= p.life) { p.s.visible = false; continue; } p.age += dt; const k = p.age / p.life; p.s.position.addScaledVector(p.v, dt); p.v.multiplyScalar(1 - dt * 0.4); const sz = p.size + p.grow * k; p.s.scale.set(sz, sz, sz); p.s.material.opacity = p.op * Math.min(1, p.age * 5) * (1 - k); } },
    clear() { for (const p of pool) { p.age = p.life; p.s.visible = false; } },
  };
}

/* ---------- times of day. top/hor: sky colours. fog: haze colour, near and far. hemi: [sky, ground, strength]. sun: [colour, strength, direction].
   green/haze: the far ridges. mist: [colour, how thick]. ---------- */
export const ENV = {
  night: { top: 0x040714, hor: 0x1a2a4c, fog: 0x0f1a30, fogN: 6, fogF: 120, hemi: [0x6f86c0, 0x1a2230, 0.95], sun: [0x9fb8ff, 0.8, [-30, 42, -18]], stars: 1, moon: 1, green: 0x0c1c22, haze: 0x1a2a4c, mist: [0x30446a, 0.55], light: 0.12 },
  predawn: { top: 0x1a2752, hor: 0x8a6a84, fog: 0x4a4a6a, fogN: 10, fogF: 190, hemi: [0xa8a0c8, 0x2a2a38, 1.05], sun: [0xffb890, 0.6, [-44, 6, -8]], stars: 0.45, moon: 0.4, green: 0x16303a, haze: 0x7a6a8c, mist: [0x8a82a6, 0.8], light: 0.3 },
  dawn: { top: 0x4a6aa8, hor: 0xffc08a, fog: 0xe6b494, fogN: 22, fogF: 260, hemi: [0xffe0c4, 0x4a4648, 1.45], sun: [0xffb070, 1.7, [-46, 9, -10]], stars: 0.05, moon: 0, green: 0x24503c, haze: 0xf0bc9c, mist: [0xffdcc0, 0.9], light: 0.62 },
  morning: { top: 0x5a9ede, hor: 0xe6e2cc, fog: 0xd6e0d8, fogN: 60, fogF: 330, hemi: [0xfff2dc, 0x6a6a50, 1.95], sun: [0xffe2b4, 2.2, [-34, 24, -16]], stars: 0, moon: 0, green: 0x2c5e40, haze: 0xc4d8e0, mist: [0xf2f4ee, 0.85], light: 1 },
  day: { top: 0x4c98e0, hor: 0xcfe4ec, fog: 0xcbdfe4, fogN: 80, fogF: 360, hemi: [0xeaf4ff, 0x7a7a58, 1.85], sun: [0xfff2dc, 2.2, [-24, 34, -12]], stars: 0, moon: 0, green: 0x2a5c3e, haze: 0xb8d2e2, mist: [0xf4f6f2, 0.7], light: 1 },
  haze: { top: 0x7ea6c8, hor: 0xdfe4dc, fog: 0xd0d8d0, fogN: 46, fogF: 300, hemi: [0xf2f0e2, 0x74745c, 1.75], sun: [0xfff0d4, 1.9, [-20, 30, -14]], stars: 0, moon: 0, green: 0x2a5642, haze: 0xcad6d6, mist: [0xe9eee8, 0.95], light: 0.9 },
  gold: { top: 0x4a78b8, hor: 0xf8c680, fog: 0xe6bc8c, fogN: 40, fogF: 280, hemi: [0xffe2b8, 0x5a4c40, 1.7], sun: [0xffb060, 2.1, [38, 12, 10]], stars: 0, moon: 0, green: 0x2c5038, haze: 0xeec49a, mist: [0xffe2c0, 0.8], light: 0.85 },
  firenight: { top: 0x070812, hor: 0x3a2428, fog: 0x1c1418, fogN: 5, fogF: 110, hemi: [0x8a7a9a, 0x2a1c18, 0.9], sun: [0xa8b4f0, 0.6, [-26, 40, -14]], stars: 0.8, moon: 0.7, green: 0x100f14, haze: 0x3a2428, mist: [0x4a3a44, 0.6], light: 0.12 },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
export function mixEnv(a, b, k) {
  const lc = (x, y) => _c1.set(x).lerp(_c2.set(y), k).getHex(), ln = (x, y) => x + (y - x) * k;
  return { top: lc(a.top, b.top), hor: lc(a.hor, b.hor), fog: lc(a.fog, b.fog), fogN: ln(a.fogN, b.fogN), fogF: ln(a.fogF, b.fogF), hemi: [lc(a.hemi[0], b.hemi[0]), lc(a.hemi[1], b.hemi[1]), ln(a.hemi[2], b.hemi[2])],
    sun: [lc(a.sun[0], b.sun[0]), ln(a.sun[1], b.sun[1]), a.sun[2].map((v, i) => ln(v, b.sun[2][i]))], stars: ln(a.stars, b.stars), moon: ln(a.moon, b.moon), green: lc(a.green, b.green), haze: lc(a.haze, b.haze), mist: [lc(a.mist[0], b.mist[0]), ln(a.mist[1], b.mist[1])], light: ln(a.light, b.light) };
}
