/* engine/house-detail.js: close-up surfaces and parts for houses built in code (22 November 2026: the owner asked that the houses "wow" up
   close, "details matter (without sacrificing performance)"). Every picture is drawn once on a small canvas and cached, so a place with ten
   houses pays for one. Use with worldUV / roofUV from engine/building-tex.js, which lay a picture in metres.

   paintedBoards({ paint, boards, wear, seed, gap })   weathered painted boards, upright: grain showing where the paint has worn, dark gaps
                                                       between the boards, nail heads, rain stains at the foot. One picture is `boards` boards
                                                       across: lay it with worldUV(geo, boards * 0.15) for boards about 15 cm wide.
   weatherZinc({ tint, rust, seed })                   corrugated zinc: ridges (with a bump map), nail rows and rust streaks running down from
                                                       them, a rusty lower edge. One picture is one sheet, about 0.8 m: roofUV(geo, 0.8).
   wallpaper({ ground, ink, kind, seed })              a printed wallpaper of the 1940s to 1960s ("sprig": small flowers, "stripe": a regency
                                                       stripe with a sprig, "trellis", "woodchip": painted woodchip), slightly faded; one picture is about 0.5 m.
   fretMat({ color, kind })                            cut fretwork for a valance or a vent: an alpha-cut board ("scallop": a scalloped edge with
                                                       holes, "cross": crosses and holes). Lay it on a plane; one picture is 0.6 m long.
   jalousie(w, h, { color, open, frame })              a jalousie (louvred) window: a frame and level slats tipped open by `open` (radians);
                                                       one merged mesh for the slats.
   glassMat({ tint, opacity })                         window glass that reads as glass: dark, slightly see-through, glossy.
   lace({ ground })                                    net or lace curtain: a soft see-through pattern for a plane.
   sway(mesh, { amp, speed, seed })                    returns a tick(t) that moves a curtain plane's lower edge as if in a breeze (its
                                                       geometry needs some height segments). */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const cache = new Map();
function rand(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const rgb = (c, k = 0) => `rgb(${Math.max(0, Math.min(255, c[0] + k)) | 0},${Math.max(0, Math.min(255, c[1] + k)) | 0},${Math.max(0, Math.min(255, c[2] + k)) | 0})`;
function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; }
function tex(c, color = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}
function once(key, make) { if (!cache.has(key)) cache.set(key, make()); return cache.get(key); }

export function paintedBoards({ paint = [196, 176, 140], boards = 6, wear = 0.35, seed = 1, gap = true } = {}) {
  return once('boards' + paint + boards + wear + seed + gap, () => {
    const W = 512, H = 512, bw = W / boards, r = rand(seed * 977 + 13);
    const col = canvas(W, H, (x) => {
      for (let i = 0; i < boards; i++) {
        const x0 = i * bw, k = (r() - 0.5) * 18;
        /* the bare wood first, grain running up the board */
        x.fillStyle = rgb([128, 98, 70], k); x.fillRect(x0, 0, bw, H);
        for (let g = 0; g < 26; g++) { x.strokeStyle = `rgba(60,40,24,${0.12 + r() * 0.2})`; x.lineWidth = 0.6 + r() * 1.4; x.beginPath(); const gx = x0 + r() * bw; x.moveTo(gx, 0); for (let y = 0; y <= H; y += 32) x.lineTo(gx + Math.sin(y * 0.02 + g) * 2.2, y); x.stroke(); }
        /* the paint over it, worn through in thin streaks along the grain, most at the board's edges and its foot */
        x.fillStyle = rgb(paint, k * 0.6); x.fillRect(x0, 0, bw, H);
        for (let p = 0; p < 26 * wear; p++) {
          const edge = r() < 0.6, px = edge ? x0 + (r() < 0.5 ? 3 + r() * 6 : bw - 3 - r() * 6) : x0 + r() * bw, foot = r() < 0.4, py = foot ? H * (0.75 + r() * 0.25) : r() * H, ph = 8 + r() * 46;
          x.fillStyle = rgb([128, 98, 70], k + (r() - 0.5) * 20); x.globalAlpha = 0.25 + r() * 0.35; x.beginPath(); x.ellipse(px, py, 0.8 + r() * 2.2, ph, 0, 0, 7); x.fill(); x.globalAlpha = 1;
        }
        /* fine grain still showing through thin paint */
        for (let g = 0; g < 18; g++) { x.strokeStyle = `rgba(70,50,30,${0.04 + r() * 0.06})`; x.lineWidth = 0.8; x.beginPath(); const gx = x0 + r() * bw; x.moveTo(gx, 0); for (let y = 0; y <= H; y += 32) x.lineTo(gx + Math.sin(y * 0.02 + g) * 2.2, y); x.stroke(); }
        for (let g = 0; g < 10; g++) { x.strokeStyle = `rgba(40,30,20,${0.05 + r() * 0.08})`; x.lineWidth = 1; x.beginPath(); const gx = x0 + r() * bw; x.moveTo(gx, 0); x.lineTo(gx + (r() - 0.5) * 4, H); x.stroke(); }
        /* nail heads top and bottom, with a rust bloom */
        for (const ny of [18, H / 2, H - 18]) for (const nx of [x0 + bw * 0.25, x0 + bw * 0.75]) { x.fillStyle = 'rgba(120,70,40,0.35)'; x.beginPath(); x.ellipse(nx, ny + 6, 3, 10, 0, 0, 7); x.fill(); x.fillStyle = '#2a2622'; x.beginPath(); x.arc(nx, ny, 2.2, 0, 7); x.fill(); }
        if (gap) { x.fillStyle = 'rgba(16,12,8,0.9)'; x.fillRect(x0, 0, 3, H); x.fillStyle = 'rgba(255,255,240,0.12)'; x.fillRect(x0 + 3, 0, 2, H); }
      }
      /* rain stains: darker at the foot, drips running down */
      const g = x.createLinearGradient(0, H * 0.78, 0, H); g.addColorStop(0, 'rgba(50,40,30,0)'); g.addColorStop(1, 'rgba(50,40,30,0.35)'); x.fillStyle = g; x.fillRect(0, H * 0.78, W, H * 0.22);
      for (let d = 0; d < 14; d++) { const dx = r() * W, dy = r() * H * 0.5; const dg = x.createLinearGradient(0, dy, 0, dy + 120); dg.addColorStop(0, 'rgba(60,50,36,0.18)'); dg.addColorStop(1, 'rgba(60,50,36,0)'); x.fillStyle = dg; x.fillRect(dx, dy, 2 + r() * 3, 120); }
    });
    const bump = canvas(256, 256, (x) => {
      x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
      const b = 256 / boards;
      for (let i = 0; i < boards; i++) { const gg = x.createLinearGradient(i * b, 0, (i + 1) * b, 0); gg.addColorStop(0, '#606060'); gg.addColorStop(0.08, '#8a8a8a'); gg.addColorStop(0.9, '#848484'); gg.addColorStop(1, '#6a6a6a'); x.fillStyle = gg; x.fillRect(i * b, 0, b, 256); if (gap) { x.fillStyle = '#202020'; x.fillRect(i * b, 0, 2, 256); } }
    });
    return new THREE.MeshStandardMaterial({ map: tex(col), bumpMap: tex(bump, false), bumpScale: 1.6, roughness: 0.88 });
  });
}

export function weatherZinc({ tint = [150, 152, 146], rust = 0.5, seed = 1, side = THREE.DoubleSide } = {}) {
  return once('zinc' + tint + rust + seed + side, () => {
    const W = 512, H = 512, n = 12, r = rand(seed * 31 + 7);
    const col = canvas(W, H, (x) => {
      for (let i = 0; i < n; i++) { const g = x.createLinearGradient(i * W / n, 0, (i + 1) * W / n, 0); g.addColorStop(0, rgb(tint, -38)); g.addColorStop(0.35, rgb(tint, 22)); g.addColorStop(0.55, rgb(tint, 30)); g.addColorStop(1, rgb(tint, -38)); x.fillStyle = g; x.fillRect(i * W / n, 0, W / n + 1, H); }
      /* mottled galvanising */
      for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${r() * 0.05})`; x.fillRect(r() * W, r() * H, 2 + r() * 14, 2 + r() * 14); }
      /* nail rows at the top and the middle purlin, rust running down from each nail */
      for (const ny of [10, H * 0.5]) for (let i = 0; i < n; i += 2) {
        const nx = (i + 0.45) * W / n;
        if (r() < 0.85) { const len = 40 + r() * 160 * rust * 2, dg = x.createLinearGradient(0, ny, 0, ny + len); dg.addColorStop(0, `rgba(150,72,30,${0.35 + rust * 0.4})`); dg.addColorStop(1, 'rgba(150,72,30,0)'); x.fillStyle = dg; x.fillRect(nx - 3 - r() * 3, ny, 6 + r() * 6, len); }
        x.fillStyle = '#3a3836'; x.beginPath(); x.arc(nx, ny, 2.5, 0, 7); x.fill();
      }
      /* rust blooms and the rusty foot of the sheet */
      for (let i = 0; i < 18 * rust; i++) { x.fillStyle = `rgba(${130 + r() * 50 | 0},${60 + r() * 30 | 0},30,${0.12 + r() * 0.25})`; x.beginPath(); x.ellipse(r() * W, r() * H, 6 + r() * 26, 8 + r() * 40, 0, 0, 7); x.fill(); }
      const fg = x.createLinearGradient(0, H * 0.82, 0, H); fg.addColorStop(0, 'rgba(140,70,30,0)'); fg.addColorStop(1, `rgba(120,60,26,${0.3 + rust * 0.5})`); x.fillStyle = fg; x.fillRect(0, H * 0.82, W, H * 0.18);
    });
    const bump = canvas(256, 64, (x) => { for (let i = 0; i < n; i++) { const g = x.createLinearGradient(i * 256 / n, 0, (i + 1) * 256 / n, 0); g.addColorStop(0, '#000'); g.addColorStop(0.5, '#fff'); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(i * 256 / n, 0, 256 / n + 1, 64); } });
    return new THREE.MeshStandardMaterial({ map: tex(col), bumpMap: tex(bump, false), bumpScale: 3, roughness: 0.55, metalness: 0.35, side });
  });
}

export function wallpaper({ ground = [226, 214, 184], ink = [150, 90, 80], kind = 'sprig', seed = 1 } = {}) {
  return once('paper' + ground + ink + kind + seed, () => {
    const S = 256, r = rand(seed * 7 + 3);
    const col = canvas(S, S, (x) => {
      x.fillStyle = rgb(ground); x.fillRect(0, 0, S, S);
      if (kind === 'stripe') for (let i = 0; i < 8; i++) { x.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${i % 2 ? 0.12 : 0.05})`; x.fillRect(i * 32, 0, 16, S); }
      if (kind === 'trellis') { x.strokeStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},0.25)`; x.lineWidth = 2; for (let i = -S; i < S * 2; i += 42) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + S, S); x.moveTo(i, S); x.lineTo(i + S, 0); x.stroke(); } }
      const sprig = (cx, cy, s) => {
        x.strokeStyle = 'rgba(80,110,70,0.55)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx, cy + 9 * s); x.quadraticCurveTo(cx - 4 * s, cy, cx, cy - 6 * s); x.stroke();
        x.fillStyle = 'rgba(90,120,74,0.55)'; for (const a of [-1, 1]) { x.beginPath(); x.ellipse(cx + a * 4 * s, cy + 3 * s, 3 * s, 1.6 * s, a * 0.6, 0, 7); x.fill(); }
        x.fillStyle = rgb(ink); for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2; x.beginPath(); x.arc(cx + Math.cos(a) * 3 * s, cy - 6 * s + Math.sin(a) * 3 * s, 2.2 * s, 0, 7); x.fill(); }
        x.fillStyle = 'rgba(230,200,90,0.9)'; x.beginPath(); x.arc(cx, cy - 6 * s, 1.4 * s, 0, 7); x.fill();
      };
      if (kind === 'woodchip') for (let i = 0; i < 1800; i++) { const l = r() < 0.5; x.fillStyle = l ? 'rgba(255,255,250,0.35)' : 'rgba(90,80,60,0.18)'; x.fillRect(r() * S, r() * S, 1 + r() * 2.5, 1 + r() * 2); }
      else for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) sprig(i * 64 + (j % 2) * 32 + 16, j * 64 + 28, 1.1);
      for (let i = 0; i < 2500; i++) { x.fillStyle = `rgba(0,0,0,${r() * 0.03})`; x.fillRect(r() * S, r() * S, 2, 2); }
      const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, 'rgba(255,250,230,0.06)'); g.addColorStop(1, 'rgba(90,70,40,0.06)'); x.fillStyle = g; x.fillRect(0, 0, S, S);
    });
    return new THREE.MeshStandardMaterial({ map: tex(col), roughness: 0.95 });
  });
}

export function fretMat({ color = '#e8e0cc', kind = 'scallop' } = {}) {
  return once('fret' + color + kind, () => {
    const W = 256, H = 64;
    const c = canvas(W, H, (x) => {
      x.fillStyle = color;
      if (kind === 'scallop') {
        x.fillRect(0, 0, W, 30);
        for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(i * 64 + 32, 30, 32, 0, Math.PI); x.fill(); }
        x.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(i * 64 + 32, 30, 9, 0, 7); x.fill(); x.beginPath(); x.arc(i * 64, 14, 5, 0, 7); x.fill(); x.fillRect(i * 64 + 22, 6, 20, 5); }
      } else {
        x.fillRect(0, 0, W, H);
        x.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < 4; i++) { const cx = i * 64 + 32; x.fillRect(cx - 4, 10, 8, 44); x.fillRect(cx - 18, 28, 36, 8); x.beginPath(); x.arc(i * 64, 32, 6, 0, 7); x.fill(); }
      }
    });
    const t = tex(c);
    return new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85 });
  });
}

const mats = new Map();
const solid = (color, rough = 0.85) => { const k = color + ':' + rough; if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough })); return mats.get(k); };
export function jalousie(w, h, { color = 0xe8e0cc, open = 0.6, frame = null } = {}) {
  const g = new THREE.Group(), fm = solid(frame ?? color, 0.8), sm = solid(color, 0.75), n = Math.max(4, Math.round(h / 0.11)), sh = h / n, parts = [];
  for (let i = 0; i < n; i++) { const b = new THREE.BoxGeometry(w - 0.06, sh * 1.15, 0.012); b.rotateX(open); b.translate(0, -h / 2 + sh * (i + 0.5), 0); parts.push(b); }
  g.add(new THREE.Mesh(mergeGeometries(parts), sm));
  for (const s of [-1, 1]) { const o = new THREE.Mesh(new THREE.BoxGeometry(0.05, h + 0.06, 0.06), fm); o.position.x = s * (w / 2 - 0.02); g.add(o); }
  for (const s of [-1, 1]) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, 0.06), fm); o.position.y = s * (h / 2 + 0.01); g.add(o); }
  return g;
}
export function glassMat({ tint = 0x8fa6aa, opacity = 0.42 } = {}) {
  return once('glass' + tint + opacity, () => new THREE.MeshStandardMaterial({ color: tint, roughness: 0.04, metalness: 0.6, transparent: true, opacity, envMapIntensity: 1.4, depthWrite: false }));
}
export function lace({ ground = '#f4f0e4' } = {}) {
  return once('lace' + ground, () => {
    const c = canvas(128, 128, (x) => {
      x.fillStyle = ground; x.globalAlpha = 0.42; x.fillRect(0, 0, 128, 128); x.globalAlpha = 1;
      x.globalCompositeOperation = 'destination-out';
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { x.beginPath(); x.arc(i * 16 + (j % 2) * 8 + 4, j * 16 + 8, 3.2, 0, 7); x.fill(); }
      x.globalCompositeOperation = 'source-over'; x.strokeStyle = ground; x.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(i * 32 + 16, 124, 14, Math.PI, 0); x.stroke(); }
    });
    return new THREE.MeshStandardMaterial({ map: tex(c), transparent: true, side: THREE.DoubleSide, roughness: 1, depthWrite: false });
  });
}
export function sway(m, { amp = 0.05, speed = 1.3, seed = 1 } = {}) {
  const p = m.geometry.attributes.position, base = Float32Array.from(p.array);
  m.geometry.computeBoundingBox();
  const top = m.geometry.boundingBox.max.y, hgt = top - m.geometry.boundingBox.min.y || 1;
  m.userData.noBatch = true;
  return (t) => {
    for (let i = 0; i < p.count; i++) {
      const y = base[i * 3 + 1], k = (top - y) / hgt, x = base[i * 3];
      p.array[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * speed + x * 3 + seed) * amp * k * k + Math.sin(t * speed * 2.3 + seed) * amp * 0.3 * k;
    }
    p.needsUpdate = true;
  };
}
