// Corner shading baked into a body's colours (owner, 24 November 2026, graphics step 1). Where a point of skin or cloth is closed in by the body or its
// clothes (under the chin, inside a collar and a cuff, under the arms, between the fingers, under a hat's brim, in the folds of a skirt), less light
// reaches it, and it is drawn a little darker. Baked into the vertex colours, so every device gets it, phones included, for nothing at draw time.
//   shadeDoc(doc)   on a gltf-transform Document of one body (the packer calls it; tools/people/bake-shade.mjs runs it on packed models)
// From every point that has a colour, RAYS short rays (up to REACH) go out over the half sphere the surface faces, in the body's rest pose; the share that
// meet the body or its clothes close by, nearer counting more, darkens the colour by up to STRENGTH (much less on the face, marked by era.py as _FACE, so
// eyes and faces stay clear in any light: owner rule 9). The result is evened out over each point's neighbours, so no speckle shows. A body is marked when
// done (extras.shaded) and never shaded twice. The shape of the body and its clothes is not changed.
const RAYS = 24, REACH = 0.12, STRENGTH = 0.62, FACE = 0.18, FLOOR = 0.5;

/* ---------- a small bounding-volume tree over triangles ---------- */
function buildTree(tri) {   /* tri: Float32Array of 9 numbers per triangle */
  const n = tri.length / 9, idx = new Uint32Array(n), cen = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { idx[i] = i; for (let k = 0; k < 3; k++) cen[i * 3 + k] = (tri[i * 9 + k] + tri[i * 9 + 3 + k] + tri[i * 9 + 6 + k]) / 3; }
  const nodes = [];
  function make(lo, hi) {
    const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (let i = lo; i < hi; i++) { const t = idx[i] * 9; for (let v = 0; v < 3; v++) for (let k = 0; k < 3; k++) { const x = tri[t + v * 3 + k]; if (x < b[k]) b[k] = x; if (x > b[3 + k]) b[3 + k] = x; } }
    const node = { b, lo, hi, l: null, r: null }; nodes.push(node);
    if (hi - lo <= 8) return node;
    const ax = [b[3] - b[0], b[4] - b[1], b[5] - b[2]], a = ax[0] > ax[1] ? (ax[0] > ax[2] ? 0 : 2) : (ax[1] > ax[2] ? 1 : 2);
    const sub = Array.from(idx.subarray(lo, hi)).sort((p, q) => cen[p * 3 + a] - cen[q * 3 + a]); idx.set(sub, lo);
    const mid = (lo + hi) >> 1; node.l = make(lo, mid); node.r = make(mid, hi); return node;
  }
  const root = make(0, n);
  return { root, idx, tri };
}
function boxHit(b, o, inv, far) {
  let t0 = 0, t1 = far;
  for (let k = 0; k < 3; k++) { let a = (b[k] - o[k]) * inv[k], c = (b[3 + k] - o[k]) * inv[k]; if (a > c) { const s = a; a = c; c = s; } if (a > t0) t0 = a; if (c < t1) t1 = c; if (t0 > t1) return false; }
  return true;
}
function rayHit(T, o, d, far) {   /* the nearest hit distance along d, or far */
  const inv = [1 / d[0], 1 / d[1], 1 / d[2]], st = [T.root]; let best = far; const tri = T.tri;
  while (st.length) {
    const nd = st.pop(); if (!boxHit(nd.b, o, inv, best)) continue;
    if (nd.l) { st.push(nd.l, nd.r); continue; }
    for (let i = nd.lo; i < nd.hi; i++) {
      const t = T.idx[i] * 9;
      const e1x = tri[t + 3] - tri[t], e1y = tri[t + 4] - tri[t + 1], e1z = tri[t + 5] - tri[t + 2], e2x = tri[t + 6] - tri[t], e2y = tri[t + 7] - tri[t + 1], e2z = tri[t + 8] - tri[t + 2];
      const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x, det = e1x * px + e1y * py + e1z * pz;
      if (Math.abs(det) < 1e-12) continue; const id = 1 / det;
      const sx = o[0] - tri[t], sy = o[1] - tri[t + 1], sz = o[2] - tri[t + 2], u = (sx * px + sy * py + sz * pz) * id; if (u < 0 || u > 1) continue;
      const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x, v = (d[0] * qx + d[1] * qy + d[2] * qz) * id; if (v < 0 || u + v > 1) continue;
      const tt = (e2x * qx + e2y * qy + e2z * qz) * id; if (tt > 1e-4 && tt < best) best = tt;
    }
  }
  return best;
}
/* RAYS directions over a half sphere round +Z, cosine weighted, the same for every point (a fixed spiral, turned per point so no pattern shows) */
const DIRS = []; for (let i = 0; i < RAYS; i++) { const r = Math.sqrt((i + 0.5) / RAYS), a = i * 2.39996; DIRS.push([r * Math.cos(a), r * Math.sin(a), Math.sqrt(Math.max(0, 1 - r * r))]); }

export function shadeDoc(doc) {
  const root = doc.getRoot();
  if ((root.getExtras() || {}).shaded) return { skipped: true };
  const parts = [];
  for (const node of root.listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue; const m = node.getWorldMatrix();
    for (const p of mesh.listPrimitives()) {
      const P = p.getAttribute('POSITION'), I = p.getIndices(); if (!P || !I) continue;
      const n = P.getCount(), w = new Float32Array(n * 3), e = [0, 0, 0];
      for (let i = 0; i < n; i++) { P.getElement(i, e); w[i * 3] = m[0] * e[0] + m[4] * e[1] + m[8] * e[2] + m[12]; w[i * 3 + 1] = m[1] * e[0] + m[5] * e[1] + m[9] * e[2] + m[13]; w[i * 3 + 2] = m[2] * e[0] + m[6] * e[1] + m[10] * e[2] + m[14]; }
      parts.push({ p, m, w, idx: I.getArray(), n, joints: node.getSkin() ? node.getSkin().listJoints().map((j) => j.getName()) : null });
    }
  }
  let nt = 0; for (const q of parts) nt += q.idx.length / 3;
  const tri = new Float32Array(nt * 9); let o = 0;
  for (const q of parts) for (let t = 0; t < q.idx.length; t++) { const v = q.idx[t]; tri[o++] = q.w[v * 3]; tri[o++] = q.w[v * 3 + 1]; tri[o++] = q.w[v * 3 + 2]; }
  const T = buildTree(tri); let shaded = 0;
  for (const q of parts) {
    const C = q.p.getAttribute('COLOR_0'), N = q.p.getAttribute('NORMAL'); if (!C || !N) continue;
    const F = q.p.getAttribute('_FACE'), occ = new Float32Array(q.n), e = [0, 0, 0], nn = [0, 0, 0], mm = q.m;
    /* the head: points that follow the head bone more than half. era.py's _FACE marks are stripped by the packer before this runs, so the head bone is what
       tells a face (without it the face was shaded as hard as cloth, and eye sockets and the corners of the mouth went dark: rule 9) */
    const J = q.p.getAttribute('JOINTS_0'), Wt = q.p.getAttribute('WEIGHTS_0'), head = new Set();
    if (J && Wt && q.joints) q.joints.forEach((nm, k) => { if (/Head$/.test(nm)) head.add(k); });
    const headW = (i) => { if (!head.size) return 0; const jj = [0, 0, 0, 0], ww = [0, 0, 0, 0]; J.getElement(i, jj); Wt.getElement(i, ww); let h = 0; for (let k = 0; k < 4; k++) if (head.has(jj[k])) h += ww[k]; return h; };
    for (let i = 0; i < q.n; i++) {
      N.getElement(i, e); nn[0] = mm[0] * e[0] + mm[4] * e[1] + mm[8] * e[2]; nn[1] = mm[1] * e[0] + mm[5] * e[1] + mm[9] * e[2]; nn[2] = mm[2] * e[0] + mm[6] * e[1] + mm[10] * e[2];
      const l = Math.hypot(nn[0], nn[1], nn[2]) || 1; nn[0] /= l; nn[1] /= l; nn[2] /= l;
      const tx = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], ux = [nn[1] * tx[2] - nn[2] * tx[1], nn[2] * tx[0] - nn[0] * tx[2], nn[0] * tx[1] - nn[1] * tx[0]], ul = Math.hypot(...ux); ux[0] /= ul; ux[1] /= ul; ux[2] /= ul;
      const vx = [nn[1] * ux[2] - nn[2] * ux[1], nn[2] * ux[0] - nn[0] * ux[2], nn[0] * ux[1] - nn[1] * ux[0]], spin = (i * 0.618) % 1 * 6.2832, cs = Math.cos(spin), sn = Math.sin(spin);
      const org = [q.w[i * 3] + nn[0] * 0.0015, q.w[i * 3 + 1] + nn[1] * 0.0015, q.w[i * 3 + 2] + nn[2] * 0.0015];
      let s = 0;
      for (const [a, b, c] of DIRS) {
        const x = a * cs - b * sn, y = a * sn + b * cs, d = [ux[0] * x + vx[0] * y + nn[0] * c, ux[1] * x + vx[1] * y + nn[1] * c, ux[2] * x + vx[2] * y + nn[2] * c];
        const h = rayHit(T, org, d, REACH); if (h < REACH) s += 1 - h / REACH;
      }
      occ[i] = s / RAYS;
    }
    /* evened over neighbours (twice), so no speckle shows */
    const nb = Array.from({ length: q.n }, () => []);
    for (let t = 0; t < q.idx.length; t += 3) { const a = q.idx[t], b = q.idx[t + 1], c = q.idx[t + 2]; nb[a].push(b, c); nb[b].push(a, c); nb[c].push(a, b); }
    let cur = occ;
    for (let k = 0; k < 2; k++) { const nx = new Float32Array(q.n); for (let i = 0; i < q.n; i++) { let s = cur[i] * 2, w = 2; for (const j of nb[i]) { s += cur[j]; w++; } nx[i] = s / w; } cur = nx; }
    const col = [0, 0, 0, 0], fe = [0];
    for (let i = 0; i < q.n; i++) {
      const face = F ? (F.getElement(i, fe), fe[0] > 0.5) : headW(i) > 0.5;
      const k = Math.max(FLOOR, 1 - (face ? FACE : STRENGTH) * cur[i]);
      C.getElement(i, col); col[0] *= k; col[1] *= k; col[2] *= k; C.setElement(i, col);
    }
    shaded++;
  }
  root.setExtras({ ...(root.getExtras() || {}), shaded: 1 });
  return { shaded, tris: nt };
}
