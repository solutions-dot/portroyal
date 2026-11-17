/* games/garvey/src/shrine.js: the Marcus Garvey monument in National Heroes Park, Kingston (chapter 8).
   What the sources say (Jamaica National Heritage Trust; Wikipedia, "National Heroes Park"; Gleaner, 9 August 2026):
     - the monument was designed in 1964 by G. C. Hodges, the Government Town Planner;
     - Garvey's tomb is at the centre of a raised platform in the shape of a black star (the symbol of his Black Star Line);
     - the burial vault is terrazzo, inset with marble;
     - behind the tomb a peaked and angled wall holds a bronze bust of him by T. Alvin Marriott, put up elsewhere in the park in 1956
       and moved into the monument.
   What the photograph shows (November 2026; the photograph is in docs/games/garvey.md, "The shrine against a photograph"):
     - the star is a raised bed about knee high, its sides faced with pale cut limestone in an irregular pattern, a dark grey coping
       round its edge and dark grey river pebbles filling it; two of its points face the visitor and one points back under the wall;
     - in the middle a dark grey base carries the white marble top of the tomb, with a small dark cross lying on it, and at its head a
       dark stone frame round a white plate cut with MARCUS MOSIAH GARVEY / JAMAICAS FIRST NATIONAL HERO / 1887 - 1940 (as the
       photograph reads; no apostrophe can be seen);
     - the wall behind is a gable: straight sides and a peak, faced with the same pale stone and capped in white; the bronze bust (head,
       shoulders and upper arms, jacket, shirt and tie) stands on a dark ledge on its face, a small plate under the ledge;
     - low stone walls with the same coping run off to either side; sago palms stand by the wall; red flowers in red earth along the
       star's front; flagpoles behind.
   Sizes are judged from the photograph (the tomb top about 1.1 m wide), not measured: the star about 7 m point to point, its sides
   0.6 m high, the wall about 5 m wide, 1.3 m high at the sides and 2.4 m at the peak.
   The bust is cast from the game's own Marcus Garvey (garvey1914, whose face was shaped against a photograph, docs/PEOPLE.md): his
   posed body is cut under the chest and turned to bronze (castBust). Until that body has loaded, nothing stands on the ledge. */
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const PI = Math.PI;
const mat = (color, rough, metal = 0, extra) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...(extra || {}) });
function add(geo, m, x, y, z, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); parent.add(o); return o; }
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

/* pale limestone in an irregular cut pattern: courses of stones of different widths, each a little different in tone, with grey joints */
function limestoneTex() {
  return canvasTex(512, 512, (x, w, h) => {
    x.fillStyle = '#a49c8a'; x.fillRect(0, 0, w, h);
    let y = 0; while (y < h) { const ch = 34 + rnd() * 40; let px = -rnd() * 60; while (px < w) { const cw = 40 + rnd() * 90, tone = 214 + rnd() * 26 | 0, sk = (rnd() - 0.5) * 10;
      x.fillStyle = `rgb(${tone},${tone - 6 | 0},${tone - 20 | 0})`; x.beginPath(); x.moveTo(px + 3, y + 3); x.lineTo(px + cw - 3 + sk, y + 3 + rnd() * 3); x.lineTo(px + cw - 3 - sk, y + ch - 3); x.lineTo(px + 3, y + ch - 3 - rnd() * 3); x.closePath(); x.fill();
      for (let k = 0; k < 6; k++) { x.fillStyle = `rgba(150,140,120,${0.08 + rnd() * 0.1})`; x.fillRect(px + rnd() * cw, y + rnd() * ch, 2 + rnd() * 8, 1 + rnd() * 3); }
      px += cw; } y += ch; }
  });
}
/* dark grey river pebbles packed close */
function pebbleTex() {
  return canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#3c3d3f'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const t = 70 + rnd() * 70 | 0, r = 3 + rnd() * 5; x.fillStyle = `rgb(${t},${t},${t + 4})`; x.beginPath(); x.ellipse(rnd() * w, rnd() * h, r, r * (0.6 + rnd() * 0.4), rnd() * 3, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,0.12)'; x.beginPath(); x.ellipse(rnd() * w, rnd() * h, r * 0.4, r * 0.25, 0, 0, 7); x.fill(); } });
}
/* red earth with small green plants and red flowers (ixora) */
function bedTex() {
  return canvasTex(256, 64, (x, w, h) => { x.fillStyle = '#6e2f22'; x.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(${90 + rnd() * 40 | 0},${40 + rnd() * 20 | 0},30,0.6)`; x.fillRect(rnd() * w, rnd() * h, 2, 2); } });
}
/* the plate at the head of the tomb, with the words the photograph shows */
function tabletTex() {
  return canvasTex(512, 220, (x, w, h) => { x.fillStyle = '#3a3b3e'; x.fillRect(0, 0, w, h); x.fillStyle = '#dfe2e3'; x.fillRect(40, 34, w - 80, h - 68);
    x.fillStyle = '#20252b'; x.textAlign = 'center'; x.font = '600 30px Georgia, serif'; x.fillText('MARCUS MOSIAH GARVEY', w / 2, 82); x.font = '600 25px Georgia, serif'; x.fillText('JAMAICAS FIRST NATIONAL HERO', w / 2, 124); x.font = '600 32px Georgia, serif'; x.fillText('1887 - 1940', w / 2, 168); });
}
/* a five-pointed star in the ground plane (x, z), one point toward -z (the wall) */
function starShape(R, r) { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = PI / 2 + i * PI / 5, k = i % 2 ? r : R; if (i) s.lineTo(Math.cos(a) * k, Math.sin(a) * k); else s.moveTo(Math.cos(a) * k, Math.sin(a) * k); } s.closePath(); return s; }
function starGeo(R, r, y0, y1, holeR) {   /* a star prism from y0 to y1; with holeR, a ring (the coping) round a star hole */
  const sh = starShape(R, r); if (holeR) sh.holes.push(new THREE.Path(starShape(holeR, holeR * r / R).getPoints().reverse()));
  const g = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false }); g.rotateX(-PI / 2); g.translate(0, y0, 0); return g;   /* the shape's +y becomes -z: one point toward the wall */
}
/* side walls of a star with their own texture coordinates (u along the outline, v up), so the stone pattern keeps one size */
function starSides(R, r, h, scale) {
  const pts = starShape(R, r).getPoints(), pos = [], uv = [], idx = []; let u = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b.x - a.x, b.y - a.y), k = pos.length / 3;
    pos.push(a.x, 0, -a.y, b.x, 0, -b.y, b.x, h, -b.y, a.x, h, -a.y); uv.push(u / scale, 0, (u + L) / scale, 0, (u + L) / scale, h / scale, u / scale, h / scale); idx.push(k, k + 1, k + 2, k, k + 2, k + 3); u += L; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

/* ---------- the bust: the game's own Marcus Garvey, posed, cut under the chest and cast in bronze ----------
   body: a loaded body (garvey1914). Returns a Group with one static mesh, its cut at y = 0, facing +z, at the body's own size. */
const BRONZE = (vc) => mat(0x7a5434, 0.5, 0.5, vc ? { vertexColors: true } : undefined);
/* bronze is one metal, but cast clothes read by their edges and their wear: shirt, collar and lapel faces are rubbed brighter, the tie and hair darker */
const PATINA = { Skin: 1.0, Hair: 0.5, Jacket: 0.78, Waistcoat: 0.62, Shirt: 1.35, Collar: 1.45, Tie: 0.45, Buttons: 0.5, Breeches: 0.7 };
export function castBust(body, { cut = 0.715 } = {}) {
  const src = body; src.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(src), H = box.max.y - box.min.y, cutY = box.min.y + H * cut, v = new THREE.Vector3(), out = [], cols = [];
  src.traverse((o) => {
    if (!o.isSkinnedMesh || !o.visible) return; if (o.skeleton) o.skeleton.update();
    const g = o.geometry, idx = g.index, n = g.attributes.position.count, P = new Float32Array(n * 3), k0 = PATINA[o.material.name] ?? 0.85;
    for (let i = 0; i < n; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); P[i * 3] = v.x; P[i * 3 + 1] = v.y; P[i * 3 + 2] = v.z; }
    const tri = idx ? idx.array : Array.from({ length: n }, (_, i) => i);
    for (let t = 0; t < tri.length; t += 3) { const a = tri[t], b = tri[t + 1], c = tri[t + 2];
      if (P[a * 3 + 1] < cutY && P[b * 3 + 1] < cutY && P[c * 3 + 1] < cutY) continue;   /* below the cut: not part of the bust */
      for (const k of [a, b, c]) { out.push(P[k * 3], Math.max(cutY, P[k * 3 + 1]), P[k * 3 + 2]); cols.push(k0, k0, k0); } }   /* points of a cut triangle are pressed up to the cut, so the bottom is one clean plane */
  });
  const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
  for (let i = 0; i < out.length; i += 3) { out[i] -= cx; out[i + 1] -= cutY; out[i + 2] -= cz; }
  let geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); geo = mergeVertices(geo, 2e-4); geo.computeVertexNormals();   /* joined again, so the bronze is smooth, not faceted */
  const grp = new THREE.Group(), m = new THREE.Mesh(geo, BRONZE(true)); m.name = 'bust'; grp.add(m);
  /* a bronze plate closing the cut */
  const w = (box.max.x - box.min.x) * 0.5, d = (box.max.z - box.min.z) * 0.5, cap = add(new THREE.CircleGeometry(1, 28), BRONZE(), 0, 0.004, 0, grp); cap.rotation.x = PI / 2; cap.scale.set(w * 0.9, d * 0.8, 1);
  return grp;
}

/* ---------- the monument. Origin: the middle of the star, on the ground. +z is toward the visitor. Returns the rectangles people cannot walk into,
   and placeBust(group), which puts a cast bust on the ledge. ---------- */
export function buildShrine(parent, { x = 0, z = -4.0 } = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const walls = [];
  const lime = limestoneTex();
  const coping = mat(0x55585c, 0.75), pebbles = mat(0xffffff, 0.95, 0, { map: pebbleTex() }); pebbles.map.repeat.set(5, 5);
  const marble = mat(0xf1f0eb, 0.32), dark = mat(0x45474b, 0.6), cream = mat(0xf2efe6, 0.6), paving = mat(0xb9b4a8, 0.95);
  /* the paved apron in front, and the grey path edge */
  const ring = add(new THREE.CircleGeometry(5.6, 48), paving, 0, 0.012, -0.4, g); ring.rotation.x = -PI / 2;
  /* the star: limestone sides 0.6 m high, a dark coping round the edge, pebbles inside */
  const R = 3.6, r = 1.45, HS = 0.6;
  const sl = lime.clone(); sl.needsUpdate = true; g.add(new THREE.Mesh(starSides(R, r, HS, 1.4), mat(0xffffff, 0.92, 0, { map: sl, side: THREE.DoubleSide })));
  add(starGeo(R + 0.04, r + 0.016, HS, HS + 0.07, R - 0.42), coping, 0, 0, 0, g);   /* the coping band */
  add(starGeo(R - 0.4, (R - 0.4) * r / R, 0, HS - 0.03), pebbles, 0, 0, 0, g);       /* the pebble fill */
  /* the tomb: a dark grey base, the white marble top with a small dark cross lying on it, and the plate at its head (toward the wall) */
  const TB = HS - 0.03;
  add(new THREE.BoxGeometry(1.7, 0.16, 2.5), dark, 0, TB + 0.08, 0.15, g);
  add(new THREE.BoxGeometry(1.15, 0.12, 1.95), marble, 0, TB + 0.22, 0.2, g);
  add(new THREE.BoxGeometry(0.08, 0.035, 0.5), dark, 0, TB + 0.3, 0.32, g); add(new THREE.BoxGeometry(0.3, 0.035, 0.08), dark, 0, TB + 0.3, 0.44, g);
  const tab = add(new THREE.BoxGeometry(1.0, 0.42, 0.12), dark, 0, TB + 0.37, -0.95, g); tab.rotation.x = -0.12;
  const plate = add(new THREE.PlaneGeometry(0.98, 0.42), mat(0xffffff, 0.5, 0, { map: tabletTex() }), 0, 0, 0.062, tab); plate.position.z = 0.0605;
  walls.push([-2.4, -2.9, 2.4, 1.0], [-3.5, -1.8, 3.5, -0.2]);   /* the star's body and its side points: nobody walks on the tomb (the front points are low enough to see over) */

  /* the gable wall behind: straight sides and a peak, the same limestone, capped in white; 5 m wide, 1.3 m at the sides, 2.4 m at the peak */
  const WZ = -3.1, WW = 5.0, HE = 1.3, HP = 2.4, TH = 0.4;
  const sh = new THREE.Shape(); sh.moveTo(-WW / 2, 0); sh.lineTo(WW / 2, 0); sh.lineTo(WW / 2, HE); sh.lineTo(0, HP); sh.lineTo(-WW / 2, HE); sh.closePath();
  const wg = new THREE.ExtrudeGeometry(sh, { depth: TH, bevelEnabled: false }); wg.translate(0, 0, -TH);
  { const uv = wg.attributes.uv, p = wg.attributes.position; for (let i = 0; i < uv.count; i++) { const nz = Math.abs(p.getZ(i)) < 1e-3 || Math.abs(p.getZ(i) + TH) < 1e-3; uv.setXY(i, (nz ? p.getX(i) : p.getZ(i) + p.getX(i)) / 1.4, p.getY(i) / 1.4); } }
  const wl = lime.clone(); wl.needsUpdate = true; add(wg, mat(0xffffff, 0.92, 0, { map: wl }), 0, 0, WZ + TH / 2, g);
  const slope = Math.hypot(WW / 2, HP - HE), ang = Math.atan2(HP - HE, WW / 2);
  for (const s of [-1, 1]) { const c = add(new THREE.BoxGeometry(slope + 0.08, 0.07, TH + 0.08), cream, s * WW / 4, (HE + HP) / 2 + 0.035, WZ, g); c.rotation.z = -s * ang;
    add(new THREE.BoxGeometry(0.08, HE, TH + 0.08), cream, s * (WW / 2 + 0.02), HE / 2, WZ, g); }   /* white edges on the sides */
  walls.push([-WW / 2 - 0.3, WZ - TH / 2 - 0.3, WW / 2 + 0.3, WZ + TH / 2 + 0.3]);
  /* the dark ledge for the bust, and the small plate under it */
  const LY = 1.42; add(new THREE.BoxGeometry(1.05, 0.06, 0.28), mat(0x222326, 0.5), 0, LY, WZ + TH / 2 + 0.14, g);
  add(new THREE.BoxGeometry(0.22, 0.26, 0.015), mat(0xc9c9c4, 0.4, 0.4), 0, LY - 0.3, WZ + TH / 2 + 0.008, g);
  const bustAt = new THREE.Group(); bustAt.position.set(0, LY + 0.03, WZ + TH / 2 + 0.17); g.add(bustAt);

  /* the low walls off to either side, the same stone and coping as the star */
  for (const s of [-1, 1]) { const lw = add(new THREE.BoxGeometry(3.4, 0.6, 0.35), mat(0xffffff, 0.92, 0, { map: (() => { const t = lime.clone(); t.needsUpdate = true; t.repeat.set(2.4, 0.43); return t; })() }), s * (WW / 2 + 1.7), 0.3, WZ + 0.2, g);
    add(new THREE.BoxGeometry(3.4, 0.06, 0.45), coping, 0, 0.33, 0, lw); walls.push([s > 0 ? WW / 2 : -WW / 2 - 3.5, WZ, s > 0 ? WW / 2 + 3.5 : -WW / 2, WZ + 0.5]); }
  /* red earth and red flowers along the two front faces of the star, and the paving slabs in the notch between the front points */
  const bm = mat(0xffffff, 0.95, 0, { map: bedTex() });
  const vtx = (i) => { const a = PI / 2 + i * PI / 5, k = i % 2 ? r : R; return [Math.cos(a) * k, -Math.sin(a) * k]; };   /* star corners in the ground plane (x, z) */
  for (const i of [3, 4, 5, 6]) { const A = vtx(i), B = vtx(i + 1), dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz), mx = (A[0] + B[0]) / 2, mz = (A[1] + B[1]) / 2;
    let nx = -dz / L, nz = dx / L; if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz; }   /* the outward side */
    const bed = add(new THREE.PlaneGeometry(L, 0.45), bm, mx + nx * 0.24, 0.02, mz + nz * 0.24, g); bed.rotation.order = 'YXZ'; bed.rotation.set(-PI / 2, Math.atan2(-dz, dx), 0);
    for (let k = 0; k < 5; k++) { const t = (k + 0.5) / 5, fx = A[0] + dx * t + nx * 0.22, fz = A[1] + dz * t + nz * 0.22; add(new THREE.SphereGeometry(0.13, 8, 6), mat(0x2f6a2a, 0.85), fx, 0.12, fz, g).scale.y = 0.8; for (let j = 0; j < 3; j++) add(new THREE.SphereGeometry(0.035, 6, 4), mat(0xd23b2c, 0.6), fx + (j - 1) * 0.06, 0.24, fz + (j % 2) * 0.04, g); } }
  for (const dz of [0, 0.62]) add(new THREE.BoxGeometry(0.6, 0.03, 0.55), mat(0xcfc9bb, 0.8), 0, 0.03, R * 0.38 + 0.35 + dz, g);
  /* sago palms by the wall, and flagpoles behind it */
  const frond = new THREE.MeshStandardMaterial({ color: 0x2f5f2b, roughness: 0.8, side: THREE.DoubleSide });
  for (const s of [-1, 1]) { const px = s * (WW / 2 + 0.9), pz = WZ + 0.9; add(new THREE.CylinderGeometry(0.16, 0.2, 0.5, 8), mat(0x6b5a44, 0.95), px, 0.25, pz, g);
    for (let i = 0; i < 12; i++) { const f = add(new THREE.PlaneGeometry(0.22, 1.15), frond, px, 0.55, pz, g); f.geometry.translate(0, 0.55, 0); f.rotation.set(0, i * PI / 6, 0); f.rotateX(0.95); }
    walls.push([px - 0.6, pz - 0.6, px + 0.6, pz + 0.6]); }
  const pole = mat(0xe8e8e4, 0.5, 0.3);
  for (const px of [-3.4, -1.2, 1.2, 3.4]) { add(new THREE.CylinderGeometry(0.04, 0.07, 9, 8), pole, px, 4.5, WZ - 2.6, g); add(new THREE.CylinderGeometry(0.2, 0.25, 0.25, 10), mat(0x9a958a, 0.9), px, 0.12, WZ - 2.6, g); }

  /* a wreath on a stand at the foot of the star: wreaths are laid here every 17 August, his birthday */
  const ws = new THREE.Group(); ws.position.set(1.15, 0, 2.55); ws.rotation.y = -0.35; ws.scale.setScalar(0.85); g.add(ws);
  const easel = mat(0x3a2a1d, 0.8);
  for (const s of [-1, 1]) { const l = add(new THREE.CylinderGeometry(0.015, 0.015, 1.25, 6), easel, s * 0.22, 0.6, 0, ws); l.rotation.z = s * 0.16; l.rotation.x = 0.12; }
  const back = add(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), easel, 0, 0.58, -0.17, ws); back.rotation.x = -0.25;
  const wr = add(new THREE.TorusGeometry(0.3, 0.075, 10, 28), mat(0x2f5e2c, 0.85), 0, 1.0, 0.04, ws); wr.rotation.x = -0.12;
  for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2; add(new THREE.IcosahedronGeometry(0.045, 0), mat(i % 3 ? 0xd9453a : 0xf2c53d, 0.7), Math.cos(a) * 0.3, 1.0 + Math.sin(a) * 0.3, 0.1, ws); }
  const sash = add(new THREE.BoxGeometry(0.1, 0.36, 0.01), mat(0x1d1d1d, 0.7), 0, 0.72, 0.1, ws); sash.rotation.x = -0.12;

  const placeBust = (b, size = 1.12) => { bustAt.clear(); b.scale.setScalar(size); bustAt.add(b); };
  return { group: g, bustAt, placeBust, walls: walls.map(([x0, z0, x1, z1]) => [x0 + x, z0 + z, x1 + x, z1 + z]) };
}
