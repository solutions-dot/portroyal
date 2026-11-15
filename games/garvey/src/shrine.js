/* games/garvey/src/shrine.js: the Marcus Garvey monument in National Heroes Park, Kingston (chapter 8).
   What the sources say (Jamaica National Heritage Trust; Wikipedia, "National Heroes Park"; Gleaner, 9 August 2026):
     - the monument was designed in 1964 by G. C. Hodges, the Government Town Planner;
     - Garvey's tomb is at the centre of a raised platform in the shape of a black star (the symbol of his Black Star Line);
     - the burial vault is terrazzo, inset with marble;
     - behind the tomb a peaked and angled wall holds a bronze bust of him by T. Alvin Marriott, put up elsewhere in the park in 1956
       and moved into the monument.
   What we could not confirm, so it is kept general (see docs/games/garvey.md): the real size of the star and the wall, the colour and finish
   of the wall, the exact shape of its peak and angles, how the bust is set into it, the pose and dress of the bust (shown here as head and
   shoulders in a jacket, collar and tie, as in his photographs), and any words on the tomb (the game's plaque shows only his name and years).
   Everything here is built from a few hundred to a few thousand triangles, fine for phones. */
import * as THREE from 'three';

const PI = Math.PI;
const mat = (color, rough, metal = 0, extra) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...(extra || {}) });
function add(geo, m, x, y, z, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); parent.add(o); return o; }

/* a speckled stone picture (terrazzo, concrete): small chips of several colours on a base */
function speckle(base, chips, n, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  x.fillStyle = base; x.fillRect(0, 0, size, size);
  for (let i = 0; i < n; i++) { x.fillStyle = chips[i % chips.length]; const r = 0.6 + Math.random() * 1.8; x.beginPath(); x.ellipse(Math.random() * size, Math.random() * size, r, r * (0.6 + Math.random() * 0.4), Math.random() * 3, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
/* white marble with soft grey veins */
function marbleTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#ecebe6'; x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9; i++) { x.strokeStyle = `rgba(120,120,125,${0.12 + Math.random() * 0.18})`; x.lineWidth = 0.6 + Math.random() * 1.6; x.beginPath(); let px = Math.random() * 256, py = 0; x.moveTo(px, py); while (py < 256) { px += (Math.random() - 0.5) * 30; py += 12 + Math.random() * 20; x.lineTo(px, py); } x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/* a five-pointed star in x, y, one point toward +y */
function starShape(R, r) { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = PI / 2 + i * PI / 5, k = i % 2 ? r : R; if (i) s.lineTo(Math.cos(a) * k, Math.sin(a) * k); else s.moveTo(Math.cos(a) * k, Math.sin(a) * k); } s.closePath(); return s; }
function flatStar(R, r, h, bevel = 0) {   /* a star slab lying on the ground, one point toward +z, top at y = h */
  const g = new THREE.ExtrudeGeometry(starShape(R, r), { depth: h - bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1 });
  g.rotateX(-PI / 2); g.rotateY(PI); return g;   /* the shape's +y becomes -z; turning it half round points it at +z (toward the visitor) */
}

/* ---------- the bronze bust: a head shaped from a sphere (brow, eye sockets, nose, moustache, lips, chin, cheekbones, ears, short hair),
   a neck, and shoulders in a jacket with lapels, a shirt collar and a tie. It faces +z. Life size; the monument shows it at 1.6 times, so it reads from the path.
   Light and shade are painted into the vertices (deeper hollows darker, raised parts lighter) so the face reads from a distance. ---------- */
const g2 = (x, y, cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2) - (((y - cy) / sy) ** 2));
function headGeo() {
  const geo = new THREE.SphereGeometry(1, 48, 40), p = geo.attributes.position, n = p.count, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const face = THREE.MathUtils.smoothstep(z, 0.15, 0.6);   /* features only on the front */
    let X = x * 0.074, Y = y * 0.118, Z = z * (z < 0 ? 0.104 : 0.094);
    if (y < -0.15) { const k = Math.min(1, (-y - 0.15) / 0.85); X *= 1 - 0.38 * k * k; if (z < 0) Z *= 1 - 0.45 * k; }   /* the jaw narrows to the chin; no skull below the back of the jaw */
    if (y > 0.55) X *= 1 - 0.12 * (y - 0.55);   /* a slightly narrower crown */
    let d = 0, shade = 0;
    if (face > 0) {
      const nose = g2(x, y, 0, -0.1, 0.085, 0.2) * 0.021 + g2(x, y, 0, -0.27, 0.13, 0.075) * 0.013;
      const wings = (g2(x, y, 0.12, -0.3, 0.06, 0.05) + g2(x, y, -0.12, -0.3, 0.06, 0.05)) * 0.006;
      const brow = (g2(x, y, 0.3, 0.13, 0.24, 0.07) + g2(x, y, -0.3, 0.13, 0.24, 0.07)) * 0.008;
      const sock = (g2(x, y, 0.32, 0.0, 0.15, 0.09) + g2(x, y, -0.32, 0.0, 0.15, 0.09)) * 0.013;
      const lid = (g2(x, y, 0.32, -0.005, 0.075, 0.045) + g2(x, y, -0.32, -0.005, 0.075, 0.045)) * 0.0075;
      const cheek = (g2(x, y, 0.5, -0.17, 0.17, 0.12) + g2(x, y, -0.5, -0.17, 0.17, 0.12)) * 0.006;
      const tache = g2(x, y, 0, -0.39, 0.25, 0.05) * 0.0085;   /* he wore a moustache */
      const lips = g2(x, y, 0, -0.5, 0.19, 0.045) * 0.006, line = g2(x, y, 0, -0.465, 0.2, 0.014) * 0.004;
      const chin = g2(x, y, 0, -0.74, 0.17, 0.12) * 0.012, under = g2(x, y, 0, -0.62, 0.18, 0.04) * 0.004;
      d = (nose + wings + brow - sock + lid + cheek + tache + lips - line + chin - under) * face;
      shade = (-sock * 60 - line * 80 - under * 60 + nose * 8 + brow * 10 + chin * 6) * face;
    }
    const hair = y > 0.42 - 0.5 * Math.max(0, -z) || (z < -0.2 && y > -0.1);   /* close-cut hair over the crown and the back */
    if (hair) { d += 0.003; shade -= 0.12; }
    const len = Math.hypot(x, y, z) || 1; X += (x / len) * d; Y += (y / len) * d; Z += (z / len) * d;
    p.setXYZ(i, X, Y, Z);
    const v = Math.max(0.55, Math.min(1.25, 1 + shade)); col[i * 3] = v; col[i * 3 + 1] = v; col[i * 3 + 2] = v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals(); return geo;
}
function earGeo(side) {   /* a flattened shell with a rim */
  const g = new THREE.SphereGeometry(1, 12, 10); g.scale(0.012, 0.03, 0.02); g.translate(0, 0, -0.004);
  const c = new Float32Array(g.attributes.position.count * 3).fill(0.9); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.rotateY(side * 0.35); return g;
}
function torsoGeo() {   /* head-and-shoulders, cut flat under the chest in the usual way of a bust: rings of rounded-square section, from the cut up over the shoulders to the neck */
  const rings = [[0.0, 0.165, 0.098], [0.08, 0.188, 0.112], [0.17, 0.2, 0.118], [0.235, 0.205, 0.112], [0.27, 0.196, 0.1], [0.295, 0.165, 0.088], [0.315, 0.12, 0.074], [0.33, 0.08, 0.062], [0.34, 0.056, 0.054]];
  const seg = 32, pos = [], col = [], idx = [], sp = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);
  rings.forEach(([y, hw, hd], r) => { for (let i = 0; i < seg; i++) { const a = i / seg * PI * 2, c = Math.cos(a), sn = Math.sin(a); const front = sn > 0 ? 1 + 0.08 * sn * (r < 5 ? 1 : 0) : 1; pos.push(sp(c, 0.7) * hw, y, sp(sn, 0.7) * hd * front); const v = 0.78 + 0.22 * Math.min(1, y / 0.25); col.push(v, v, v); } });
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < seg; i++) { const a = r * seg + i, b2 = r * seg + (i + 1) % seg, c = a + seg, d = b2 + seg; idx.push(a, c, b2, b2, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function bust(bronze, plain) {   /* bronze: the shaded material for the sculpted parts; plain: the same bronze for the simple parts (no painted shade) */
  const b = new THREE.Group(), dark = plain.clone(); dark.color = plain.color.clone().multiplyScalar(0.6);
  add(torsoGeo(), bronze, 0, 0, 0, b);   /* the cut under the chest is at y = 0 */
  const cap = add(new THREE.CircleGeometry(1, 32), dark, 0, 0.001, 0, b); cap.rotation.x = PI / 2; cap.scale.set(0.165, 0.098, 1);
  add(new THREE.CylinderGeometry(0.05, 0.056, 0.14, 16), plain, 0, 0.385, -0.004, b);   /* the neck */
  const head = add(headGeo(), bronze, 0, 0.505, 0.004, b); head.rotation.x = -0.04; head.scale.setScalar(1.08);
  for (const s of [-1, 1]) add(earGeo(s), bronze, s * 0.079, 0.495, -0.006, b);
  /* the shirt collar, the tie and its knot, and the jacket's lapels, lying on the chest */
  for (const s of [-1, 1]) { const c = add(new THREE.BoxGeometry(0.05, 0.04, 0.01), plain, s * 0.03, 0.335, 0.064, b); c.rotation.set(-0.5, 0, s * 0.6); }
  add(new THREE.BoxGeometry(0.03, 0.03, 0.02), dark, 0, 0.318, 0.078, b);
  const tie = add(new THREE.BoxGeometry(0.034, 0.17, 0.008), dark, 0, 0.225, 0.126, b); tie.rotation.x = -0.12;
  for (const s of [-1, 1]) {
    const l = add(new THREE.BoxGeometry(0.07, 0.24, 0.008), plain, s * 0.066, 0.19, 0.127, b); l.rotation.set(-0.06, 0, s * 0.32);   /* a lapel, from the collar down to the cut */
    const e = add(new THREE.BoxGeometry(0.006, 0.22, 0.01), dark, s * 0.03, 0.2, 0.129, b); e.rotation.set(-0.06, 0, s * 0.32);   /* the shadowed line where the jacket opens */
  }
  return b;
}

/* ---------- the monument. Origin: the middle of the star, on the ground. +z is toward the visitor. Returns the rectangles people cannot walk into. ---------- */
export function buildShrine(parent, { x = 0, z = -4.0, signTex } = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const walls = [];
  const paving = mat(0xbdb4a0, 0.95, 0, { map: speckle('#bdb4a0', ['#a99f8a', '#cfc7b4', '#9c937f'], 900) }); paving.map.repeat.set(4, 4);
  const terrazzo = mat(0xffffff, 0.45, 0, { map: speckle('#d8d3c8', ['#8f8a80', '#b9a98e', '#f2efe8', '#6f6a62', '#c9b28a'], 2400) });
  const marble = mat(0xffffff, 0.3, 0, { map: marbleTex() });
  const black = mat(0x141518, 0.32, 0.05), edge = mat(0x2a2b30, 0.5);
  const wallM = mat(0xffffff, 0.9, 0, { map: speckle('#cfcabd', ['#bdb7a8', '#dcd8cc', '#aaa496'], 1600) }); wallM.map.repeat.set(3, 2);
  const nicheM = mat(0x8f8a7e, 0.95), coping = mat(0xb8b2a4, 0.85);
  const bronze = mat(0x9a6d3c, 0.42, 0.35, { vertexColors: true }), bronzePlain = mat(0x8c6335, 0.42, 0.35);

  /* the paved circle round the monument */
  const ring = add(new THREE.CircleGeometry(5.2, 48), paving, 0, 0.012, -0.9, g); ring.rotation.x = -PI / 2;
  /* the raised black star: a dark edge course, then the polished black top. The star is 4.9 m point to point here (its real size was not found). */
  add(flatStar(2.55, 1.07, 0.16), edge, 0, 0.0, 0, g);
  add(flatStar(2.45, 1.02, 0.3, 0.02), black, 0, 0.0, 0, g);
  /* the vault at the centre: terrazzo, with a marble top set into it and a marble band round its foot */
  const VL = 2.2, VW = 1.0, VH = 0.5, top = 0.3;
  add(new THREE.BoxGeometry(VW + 0.16, 0.06, VL + 0.16), marble, 0, top + 0.03, 0, g);
  add(new THREE.BoxGeometry(VW, VH, VL), terrazzo, 0, top + 0.06 + VH / 2, 0, g);
  add(new THREE.BoxGeometry(VW - 0.18, 0.025, VL - 0.18), marble, 0, top + 0.06 + VH + 0.0125, 0, g);
  if (signTex) add(new THREE.PlaneGeometry(0.62, 0.2), new THREE.MeshStandardMaterial({ map: signTex([['MARCUS MOSIAH GARVEY', 30], ['1887 to 1940', 26]], 512, 160), roughness: 0.6 }), 0, top + 0.06 + VH / 2, VL / 2 + 0.003, g);
  walls.push([-1.4, -2.5, 1.4, 1.6]);   /* the star and the vault: the tips of the star are low enough to see, but nobody walks on the tomb */

  /* the peaked and angled wall behind: two wings that meet in a point at the back and lean their tops up to a peak there, with a niche
     in the middle for the bust. Each wing is 3.3 m long, 4.4 m high at the peak and 2.3 m at its outer end. */
  const WZ = -3.35, WA = 0.42, LEN = 3.3, HP = 4.4, HE = 2.3, TH = 0.35;
  for (const s of [-1, 1]) {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(s * LEN, 0); sh.lineTo(s * LEN, HE); sh.lineTo(0, HP); sh.closePath();
    const wg = new THREE.ExtrudeGeometry(sh, { depth: TH, bevelEnabled: false }); wg.translate(0, 0, -TH);
    const w = add(wg, wallM, 0, 0, WZ, g); w.rotation.y = -s * WA;   /* the outer ends come forward, so the wall opens toward the visitor */
    const cl = Math.hypot(LEN, HP - HE), cp = add(new THREE.BoxGeometry(cl + 0.04, 0.08, TH + 0.08), coping, 0, 0, 0, w);   /* a coping strip along the sloping top */
    cp.position.set(s * LEN / 2, (HP + HE) / 2 + 0.04, -TH / 2); cp.rotation.z = -s * Math.atan2(HP - HE, LEN);
    const ex = s * Math.cos(WA) * LEN, ez = WZ + Math.sin(WA) * LEN;
    walls.push([Math.min(0, ex) - 0.3, WZ - TH - 0.3, Math.max(0, ex) + 0.3, ez + 0.3]);
  }
  /* the middle: a pier in front of the point where the wings meet, with a niche, a ledge and a stone block under the bust */
  const PW = 1.5, PD = 0.5, PH = 3.7, pz = WZ + 0.2;
  add(new THREE.BoxGeometry(PW, PH, PD), wallM, 0, PH / 2, pz, g);
  add(new THREE.BoxGeometry(PW + 0.1, 0.08, PD + 0.1), coping, 0, PH + 0.04, pz, g);
  add(new THREE.BoxGeometry(1.05, 1.6, 0.02), nicheM, 0, 2.35, pz + PD / 2 + 0.001, g);   /* the shadowed back of the niche */
  for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.1, 1.7, 0.18), wallM, s * 0.575, 2.35, pz + PD / 2 + 0.09, g);   /* its sides */
  add(new THREE.BoxGeometry(1.25, 0.1, 0.22), wallM, 0, 3.25, pz + PD / 2 + 0.1, g);   /* its head */
  add(new THREE.BoxGeometry(1.2, 0.1, 0.42), coping, 0, 1.5, pz + PD / 2 + 0.2, g);   /* the ledge */
  add(new THREE.BoxGeometry(0.6, 0.22, 0.38), black, 0, 1.66, pz + PD / 2 + 0.22, g);   /* a dark stone block the bust stands on */
  const b = bust(bronze, bronzePlain); b.scale.setScalar(1.6); b.position.set(0, 1.77, pz + PD / 2 + 0.23); g.add(b);
  walls.push([-0.9, pz - 0.4, 0.9, pz + PD / 2 + 0.45]);

  /* a wreath on a stand beside the tomb: wreaths are laid here every 17 August, his birthday */
  const ws = new THREE.Group(); ws.position.set(0.68, 0.3, 0.05); ws.rotation.y = 0.7; ws.scale.setScalar(0.85); g.add(ws);
  const easel = mat(0x3a2a1d, 0.8);
  for (const s of [-1, 1]) { const l = add(new THREE.CylinderGeometry(0.015, 0.015, 1.25, 6), easel, s * 0.22, 0.6, 0, ws); l.rotation.z = s * 0.16; l.rotation.x = 0.12; }
  const back = add(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), easel, 0, 0.58, -0.17, ws); back.rotation.x = -0.25;
  const wr = add(new THREE.TorusGeometry(0.3, 0.075, 10, 28), mat(0x2f5e2c, 0.85), 0, 1.0, 0.04, ws); wr.rotation.x = -0.12;
  for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2; add(new THREE.IcosahedronGeometry(0.045, 0), mat(i % 3 ? 0xd9453a : 0xf2c53d, 0.7), Math.cos(a) * 0.3, 1.0 + Math.sin(a) * 0.3, 0.1, ws); }
  const sash = add(new THREE.BoxGeometry(0.1, 0.36, 0.01), mat(0x1d1d1d, 0.7), 0, 0.72, 0.1, ws); sash.rotation.x = -0.12;
  return { group: g, walls: walls.map(([x0, z0, x1, z1]) => [x0 + x, z0 + z, x1 + x, z1 + z]) };
}
