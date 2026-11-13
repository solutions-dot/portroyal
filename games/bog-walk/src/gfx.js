/* games/bog-walk/src/gfx.js: textures drawn in code (no image files), as in the other games.
   Every texture is drawn in its own small coordinates (w by h) on a bigger canvas, so it stays sharp up close.
   TEXQ is how many times bigger: 2 on a computer, 1.5 on a phone or tablet, 1 on a device that says it has little memory.
   All the random choices come from a seeded generator, so every run draws the same pictures. */
import * as THREE from 'three';

const MOBILE = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent), MEM = navigator.deviceMemory || 4;
export const TEXQ = MEM <= 2 ? 1 : MOBILE ? 1.5 : 2;
let ANISO = 4;
export function setAniso(n) { ANISO = n; }

export function rng(seed) {   /* a small seeded random number generator (mulberry32) */
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function cv(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = Math.round(w * TEXQ); c.height = Math.round(h * TEXQ);
  const g = c.getContext('2d'); g.scale(c.width / w, c.height / h); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = opts.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping; t.anisotropy = ANISO; return t;
}
export function grain(x, amt, r) {   /* fine noise over the whole picture */
  const c = x.canvas, d = x.getImageData(0, 0, c.width, c.height), a = d.data;
  for (let i = 0; i < a.length; i += 4) { const n = (r() - 0.5) * amt; a[i] += n; a[i + 1] += n; a[i + 2] += n * 0.85; }
  x.putImageData(d, 0, 0);
}
/* Draw a shape again one tile to each side, so a tiled texture has no seams where blotches cross the edge. */
function wrap(w, h, cx, cy, rx, ry, fn) { for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { const px = cx + ox * w, py = cy + oy * h; if (px + rx < 0 || px - rx > w || py + ry < 0 || py - ry > h) continue; fn(px, py); } }

/* the pipe wall: dark iron plate with soot, cloudy shading, clusters of small rust flakes and runoff streaks (u runs round the pipe, so a streak that
   runs sideways in the picture runs down the wall) */
export function ironTex() {
  return cv(512, 512, (x, w, h) => {
    const r = rng(7);
    x.fillStyle = '#2f2c2a'; x.fillRect(0, 0, w, h);
    for (const [n, a0, a1, al] of [[24, 70, 150, 0.06], [70, 26, 80, 0.06], [220, 7, 26, 0.06]]) for (let i = 0; i < n; i++) {   /* cloudy light and dark, at three sizes */
      const v = 16 + r() * 54, rx = a0 + r() * (a1 - a0), ry = rx * (0.45 + r() * 0.8), rot = r() * 3, col = `rgba(${v | 0},${(v - 1) | 0},${(v - 4) | 0},${al * (0.5 + r())})`;
      wrap(w, h, r() * w, r() * h, rx, ry, (px, py) => { x.fillStyle = col; x.beginPath(); x.ellipse(px, py, rx, ry, rot, 0, 7); x.fill(); }); }
    for (let c = 0; c < 11; c++) { const cx = r() * w, cy = r() * h, spread = 24 + r() * 50;   /* rust: clusters of small flakes, thick in the middle */
      for (let k = 0; k < 46; k++) { const a = r() * 6.28, d = Math.abs(r() + r() + r() - 1.5) * spread * 1.3, px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.8, s = 1.5 + r() * 6;
        const col = r() < 0.7 ? `rgba(${(122 + r() * 40) | 0},${(70 + r() * 26) | 0},${(38 + r() * 14) | 0},${0.1 + r() * 0.2})` : `rgba(${(64 + r() * 22) | 0},${(38 + r() * 12) | 0},22,${0.12 + r() * 0.2})`;
        wrap(w, h, px, py, s, s, (qx, qy) => { x.fillStyle = col; x.beginPath(); x.ellipse(qx, qy, s, s * (0.5 + r() * 0.6), r() * 3, 0, 7); x.fill(); }); } }
    for (let i = 0; i < 46; i++) { const sx = r() * w, sy = r() * h, len = 30 + r() * 150, sw = 0.8 + r() * 2.6, rusty = r() < 0.4, a = 0.1 + r() * 0.16;   /* runoff streaks, down the wall */
      for (const ox of [-w, 0, w]) { const g = x.createLinearGradient(sx + ox, 0, sx + ox + len, 0); const c0 = rusty ? '128,72,40' : '10,9,8'; g.addColorStop(0, `rgba(${c0},0)`); g.addColorStop(0.15, `rgba(${c0},${a})`); g.addColorStop(1, `rgba(${c0},0)`); x.fillStyle = g; x.fillRect(sx + ox, sy, len, sw); } }
    x.strokeStyle = 'rgba(160,150,140,0.09)'; x.lineWidth = 0.7;   /* fine scratches */
    for (let i = 0; i < 40; i++) { const sx = r() * w, sy = r() * h, a = r() * 6.28, l = 6 + r() * 26; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke(); }
    grain(x, 20, r);
  });
}

/* the sand and silt on the floor of the pipe */
export function sandTex() {
  return cv(256, 256, (x, w, h) => {
    const r = rng(21);
    x.fillStyle = '#7b6e5a'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const cx = r() * w, cy = r() * h, rx = 14 + r() * 50, ry = 6 + r() * 20, col = r() < 0.5 ? `rgba(60,50,40,${0.06 + r() * 0.1})` : `rgba(170,150,120,${0.05 + r() * 0.08})`;
      wrap(w, h, cx, cy, rx, ry, (px, py) => { x.fillStyle = col; x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, 7); x.fill(); }); }
    for (let i = 0; i < 260; i++) { const cx = r() * w, cy = r() * h, s = 1 + r() * 3, col = r() < 0.5 ? `rgba(30,24,18,${0.25 + r() * 0.3})` : `rgba(210,190,150,${0.2 + r() * 0.3})`;
      wrap(w, h, cx, cy, s, s, (px, py) => { x.fillStyle = col; x.fillRect(px, py, s, s * 0.8); }); }
    grain(x, 26, r);
  });
}

/* an irregular blob outline, the same for the rust and for the bare steel that shows when it is scraped away */
function blobK(seed, n = 18) { const r = rng(seed), k = []; for (let i = 0; i < n; i++) k.push(0.78 + r() * 0.3); return k; }
function blob(x, cx, cy, rx, ry, k) {   /* a smooth rounded blob: curves through the midpoints between the outline points */
  const n = k.length, pts = [], mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx * k[i], cy + Math.sin(a) * ry * k[i]]); }
  const s = mid(pts[n - 1], pts[0]); x.beginPath(); x.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) { const p = pts[i], m = mid(p, pts[(i + 1) % n]); x.quadraticCurveTo(p[0], p[1], m[0], m[1]); }
  x.closePath();
}
export function rustPatchTex(seed) {
  return cv(256, 256, (x, w, h) => {
    const r = rng(seed * 13 + 1), k = blobK(seed);
    x.fillStyle = 'rgba(96,64,40,0.30)'; blob(x, w / 2, h / 2, 118, 112, k); x.fill();   /* a faint stain round the edge */
    const g = x.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, 100); g.addColorStop(0, '#9a6a42'); g.addColorStop(0.7, '#7c5636'); g.addColorStop(1, '#4f3624'); x.fillStyle = g; blob(x, w / 2, h / 2, 96, 90, k); x.fill();
    x.save(); blob(x, w / 2, h / 2, 96, 90, k); x.clip();
    for (let i = 0; i < 70; i++) { const px = r() * w, py = r() * h, s = 6 + r() * 22; x.fillStyle = r() < 0.5 ? `rgba(176,112,58,${0.08 + r() * 0.14})` : `rgba(52,36,24,${0.1 + r() * 0.16})`; x.beginPath(); x.ellipse(px, py, s, s * (0.5 + r() * 0.5), r() * 3, 0, 7); x.fill(); }   /* patches of thicker and thinner rust */
    for (let i = 0; i < 380; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 94, px = w / 2 + Math.cos(a) * d, py = h / 2 + Math.sin(a) * d * 0.95, s = 1.5 + r() * 5; x.fillStyle = r() < 0.45 ? `rgba(200,128,64,${0.25 + r() * 0.35})` : r() < 0.6 ? `rgba(34,22,14,${0.3 + r() * 0.4})` : `rgba(140,150,130,${0.12 + r() * 0.16})`; x.fillRect(px, py, s * (0.8 + r()), s * (0.6 + r() * 0.8)); }   /* flakes, pits and bright bare spots */
    x.strokeStyle = 'rgba(30,20,12,0.28)'; x.lineWidth = 1;   /* cracks */
    for (let i = 0; i < 16; i++) { let px = w / 2 + (r() - 0.5) * 150, py = h / 2 + (r() - 0.5) * 140; x.beginPath(); x.moveTo(px, py); for (let j = 0; j < 4; j++) { px += (r() - 0.5) * 34; py += (r() - 0.5) * 34; x.lineTo(px, py); } x.stroke(); }
    x.restore();
  }, { clamp: true });
}
export function steelPatchTex(seed) {
  return cv(256, 256, (x, w, h) => {
    const r = rng(seed * 17 + 3), k = blobK(seed);
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#d2cfc6'); g.addColorStop(0.5, '#a9a69d'); g.addColorStop(1, '#bdb9af'); x.fillStyle = g; blob(x, w / 2, h / 2, 96, 90, k); x.fill();
    x.save(); blob(x, w / 2, h / 2, 96, 90, k); x.clip();
    for (let i = 0; i < 70; i++) { const px = r() * w, py = r() * h, l = 20 + r() * 60; x.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.22)' : 'rgba(60,56,50,0.22)'; x.lineWidth = 0.8 + r() * 1.4; x.beginPath(); x.moveTo(px, py); x.lineTo(px + l * 0.8, py + l * 0.5); x.stroke(); }
    x.restore();
  }, { clamp: true });
}

/* a flame: a tall teardrop that is white-hot at the bottom and fades to orange and clear at the tip, with a soft glow round it */
export function flameTex() {
  return cv(64, 96, (x, w, h) => {
    const glow = x.createRadialGradient(w / 2, h * 0.62, 2, w / 2, h * 0.6, w * 0.62); glow.addColorStop(0, 'rgba(255,170,70,0.5)'); glow.addColorStop(1, 'rgba(255,100,20,0)'); x.fillStyle = glow; x.fillRect(0, 0, w, h);
    const body = (k, col0, col1) => { const g = x.createLinearGradient(0, h * 0.1, 0, h * 0.84); g.addColorStop(0, col0); g.addColorStop(1, col1); x.fillStyle = g; x.beginPath(); x.moveTo(w / 2, h * (0.1 + (1 - k) * 0.3));
      x.bezierCurveTo(w / 2 + w * 0.34 * k, h * 0.5, w / 2 + w * 0.3 * k, h * 0.78, w / 2, h * 0.84); x.bezierCurveTo(w / 2 - w * 0.3 * k, h * 0.78, w / 2 - w * 0.34 * k, h * 0.5, w / 2, h * (0.1 + (1 - k) * 0.3)); x.fill(); };
    body(1, 'rgba(255,90,20,0)', 'rgba(255,140,40,0.85)'); body(0.7, 'rgba(255,170,60,0)', 'rgba(255,210,110,0.95)'); body(0.4, 'rgba(255,240,170,0)', 'rgba(255,252,225,1)');
  }, { clamp: true });
}
/* the night sky seen up through the manhole: deep blue, thin cloud, soft round stars, and dark leaves of the trees round the edge */
export function skyTex() {
  return cv(256, 256, (x, w, h) => {
    const r = rng(3), g = x.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w * 0.72); g.addColorStop(0, '#7792c6'); g.addColorStop(0.7, '#36497c'); g.addColorStop(1, '#1d2a52'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(195,210,238,0.07)'; x.beginPath(); x.ellipse(r() * w, r() * h, 50 + r() * 60, 8 + r() * 12, r() * 0.6, 0, 7); x.fill(); }
    for (let i = 0; i < 70; i++) { const px = r() * w, py = r() * h, s = 0.6 + r() * 1.4, a = 0.35 + r() * 0.65, sg = x.createRadialGradient(px, py, 0, px, py, s * 2.4); sg.addColorStop(0, `rgba(255,255,245,${a})`); sg.addColorStop(1, 'rgba(255,255,245,0)'); x.fillStyle = sg; x.beginPath(); x.arc(px, py, s * 2.4, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(7,13,9,0.96)'; x.lineCap = 'round';   /* palm fronds hanging in from the rim: a curved stem with a leaflet either side of each step */
    for (let k = 0; k < 8; k++) {
      const a = (k + r() * 0.6) / 8 * Math.PI * 2, len = w * (0.24 + r() * 0.12), bend = (r() - 0.5) * 1.1, steps = 16;
      let px = w / 2 + Math.cos(a) * w * 0.58, py = h / 2 + Math.sin(a) * h * 0.58, ang = a + Math.PI + (r() - 0.5) * 0.5;
      for (let i = 0; i < steps; i++) { const nx = px + Math.cos(ang) * len / steps, ny = py + Math.sin(ang) * len / steps, ll = len * 0.2 * (1 - i / steps * 0.55);
        x.lineWidth = 2.4 * (1 - i / steps * 0.6); x.beginPath(); x.moveTo(px, py); x.lineTo(nx, ny); x.stroke();
        x.lineWidth = 1.5; for (const s of [-1, 1]) { x.beginPath(); x.moveTo(nx, ny); x.lineTo(nx + Math.cos(ang + s * 1.05) * ll, ny + Math.sin(ang + s * 1.05) * ll); x.stroke(); }
        px = nx; py = ny; ang += bend / steps; }
    }
  }, { clamp: true });
}
/* a beam of light: bright at the top and fading away down the picture */
export function beamTex() {
  return cv(8, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0.0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0.9)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }, { clamp: true });
}
/* a soft round pool of light, laid on the floor */
export function poolTex() {
  return cv(128, 128, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.6, 'rgba(255,255,255,0.3)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }, { clamp: true });
}
/* small ripples for the water: a height map from a few waves, turned into a normal map that tiles */
export function rippleNormalTex() {
  const n = 128, hgt = new Float32Array(n * n), r = rng(5), waves = [];
  for (let i = 0; i < 7; i++) waves.push([1 + ((r() * 5) | 0), 1 + ((r() * 5) | 0), r() * 6.28, 0.5 + r()]);
  for (let y = 0; y < n; y++) for (let xx = 0; xx < n; xx++) { let v = 0; for (const [fx, fy, ph, a] of waves) v += a * Math.sin((fx * xx + fy * y) / n * 6.2832 + ph); hgt[y * n + xx] = v; }
  const c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d'), im = g.createImageData(n, n);
  for (let y = 0; y < n; y++) for (let xx = 0; xx < n; xx++) {
    const dx = hgt[y * n + (xx + 1) % n] - hgt[y * n + (xx + n - 1) % n], dy = hgt[((y + 1) % n) * n + xx] - hgt[((y + n - 1) % n) * n + xx];
    const nx = -dx * 0.35, ny = -dy * 0.35, l = Math.hypot(nx, ny, 1), i = (y * n + xx) * 4;
    im.data[i] = (nx / l * 0.5 + 0.5) * 255; im.data[i + 1] = (ny / l * 0.5 + 0.5) * 255; im.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.anisotropy = ANISO; return t;
}
