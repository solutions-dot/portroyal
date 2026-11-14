/* games/bog-walk/src/wgfx.js (copied from games/kendal/src/gfx.js): textures drawn in code (no image files), materials, small builders and the sky.
   Everything here is plain three.js. Textures are cached by key, so a place can ask for the same one again cheaply. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const G = { aniso: 4 };

/* a repeatable canvas texture */
export function cv(w, h, draw, repeat, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = G.aniso;
  if (repeat) t.repeat.set(repeat[0], repeat[1]); return t;
}
export function grain(x, w, h, amt) { const d = x.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * amt; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n * 0.8; } x.putImageData(d, 0, 0); }
export function rng(seed) { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const memo = {}; const once = (k, fn) => memo[k] || (memo[k] = fn());
const rgbs = (c, v = 0) => `rgb(${Math.max(0, Math.min(255, c[0] + v)) | 0},${Math.max(0, Math.min(255, c[1] + v)) | 0},${Math.max(0, Math.min(255, c[2] + v * 0.8)) | 0})`;

/* ---------- textures ---------- */
export const T = {
  plank(rgb, planks = 5, repeat = [1, 1], horizontal = false) {   /* boards, running up and down (or sideways) */
    return once('plank' + rgb + planks + repeat + horizontal, () => cv(256, 256, (x, w, h) => { if (horizontal) { x.translate(w, 0); x.rotate(Math.PI / 2); }
      const pw = w / planks; for (let p = 0; p < planks; p++) { const v = (Math.random() - 0.5) * 24; x.fillStyle = rgbs(rgb, v); x.fillRect(p * pw, 0, pw, h);
        x.strokeStyle = 'rgba(30,18,10,0.2)'; x.lineWidth = 1; for (let g = 0; g < 6; g++) { const gx = p * pw + 2 + Math.random() * (pw - 4); x.beginPath(); x.moveTo(gx, 0); x.bezierCurveTo(gx + 2, h * 0.3, gx - 2, h * 0.6, gx + 1, h); x.stroke(); }
        x.fillStyle = 'rgba(15,9,5,0.6)'; x.fillRect(p * pw, 0, 2, h); }
      x.setTransform(1, 0, 0, 1, 0, 0); grain(x, w, h, 14); }, repeat));
  },
  grass(repeat = [30, 30], base = [74, 112, 52]) {
    return once('grass' + repeat + base, () => cv(256, 256, (x, w, h) => { x.fillStyle = rgbs(base); x.fillRect(0, 0, w, h);
      for (let i = 0; i < 700; i++) { x.fillStyle = rgbs(base, (Math.random() - 0.5) * 60); x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 5); }
      for (let i = 0; i < 30; i++) { x.fillStyle = 'rgba(210,190,90,0.18)'; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 20, 4 + Math.random() * 10, Math.random() * 3, 0, 7); x.fill(); } grain(x, w, h, 10); }, repeat));
  },
  dirt(repeat = [4, 30], base = [150, 98, 62]) {   /* red-brown Jamaican earth with wheel ruts along the length (the texture's up and down) */
    return once('dirt' + repeat + base, () => cv(256, 256, (x, w, h) => { x.fillStyle = rgbs(base); x.fillRect(0, 0, w, h);
      for (let i = 0; i < 500; i++) { x.fillStyle = rgbs(base, (Math.random() - 0.5) * 50); x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 5, 1 + Math.random() * 12); }
      for (const cx of [w * 0.28, w * 0.72]) { const g = x.createLinearGradient(cx - 16, 0, cx + 16, 0); g.addColorStop(0, 'rgba(60,34,18,0)'); g.addColorStop(0.5, 'rgba(60,34,18,0.38)'); g.addColorStop(1, 'rgba(60,34,18,0)'); x.fillStyle = g; x.fillRect(cx - 16, 0, 32, h); }
      for (let i = 0; i < 14; i++) { x.fillStyle = 'rgba(90,70,60,0.5)'; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 2 + Math.random() * 3, 0, 0, 7); x.fill(); } grain(x, w, h, 12); }, repeat));
  },
  ballast(repeat = [30, 2]) {
    return once('ballast' + repeat, () => cv(256, 128, (x, w, h) => { x.fillStyle = '#7d7a72'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { const v = 70 + Math.random() * 90; x.fillStyle = `rgb(${v},${v - 4},${v - 10})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 1 + Math.random() * 3.5, 1 + Math.random() * 2.5, Math.random() * 3, 0, 7); x.fill(); } }, repeat));
  },
  concrete(repeat = [12, 3], base = [168, 164, 152]) {
    return once('conc' + repeat + base, () => cv(256, 256, (x, w, h) => { x.fillStyle = rgbs(base); x.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(80,76,66,${0.03 + Math.random() * 0.07})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 40, 5 + Math.random() * 24, Math.random() * 3, 0, 7); x.fill(); }
      x.strokeStyle = 'rgba(40,36,30,0.35)'; x.lineWidth = 2; x.strokeRect(0, 0, w, h); grain(x, w, h, 18); }, repeat));
  },
  zinc(rgb = [150, 154, 150], repeat = [4, 3]) {   /* corrugated zinc roofing: stripes, some rust */
    return once('zinc' + rgb + repeat, () => cv(256, 256, (x, w, h) => { for (let i = 0; i < 16; i++) { const g = x.createLinearGradient(i * 16, 0, i * 16 + 16, 0); g.addColorStop(0, rgbs(rgb, -34)); g.addColorStop(0.5, rgbs(rgb, 26)); g.addColorStop(1, rgbs(rgb, -34)); x.fillStyle = g; x.fillRect(i * 16, 0, 16, h); }
      for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${140 + Math.random() * 40 | 0},${70 + Math.random() * 30 | 0},40,${0.06 + Math.random() * 0.14})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 30, 6 + Math.random() * 50, 0, 0, 7); x.fill(); } grain(x, w, h, 10); }, repeat));
  },
  plaster(rgb = [226, 214, 184], repeat = [1, 1], band) {   /* limewash with stains; band: a darker painted strip along the bottom */
    return once('plaster' + rgb + repeat + band, () => cv(512, 512, (x, w, h) => { x.fillStyle = rgbs(rgb); x.fillRect(0, 0, w, h);
      for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(${90 + Math.random() * 40 | 0},${74 + Math.random() * 30 | 0},50,${0.012 + Math.random() * 0.03})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h * 0.8, 20 + Math.random() * 80, 10 + Math.random() * 50, Math.random() * 3, 0, 7); x.fill(); }
      if (band) { x.fillStyle = band; x.fillRect(0, h * 0.78, w, h * 0.22); x.fillStyle = 'rgba(30,22,14,0.35)'; x.fillRect(0, h * 0.78, w, 3); } grain(x, w, h, 14); }, repeat));
  },
  stone(rgb = [150, 150, 144], repeat = [2, 2]) {
    return once('stone' + rgb + repeat, () => cv(256, 256, (x, w, h) => { x.fillStyle = rgbs(rgb); x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${60 + Math.random() * 60 | 0},${60 + Math.random() * 60 | 0},${58 + Math.random() * 50 | 0},0.12)`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 6 + Math.random() * 20, Math.random() * 3, 0, 7); x.fill(); } grain(x, w, h, 20); }, repeat));
  },
  sand(repeat = [20, 20]) {
    return once('sand' + repeat, () => cv(256, 256, (x, w, h) => { x.fillStyle = '#e4d3a8'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${150 + Math.random() * 90 | 0},${130 + Math.random() * 80 | 0},${90 + Math.random() * 60 | 0},0.35)`; x.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } grain(x, w, h, 10); }, repeat));
  },
  water(repeat = [30, 30]) {   /* sea: soft bands of light and shadow that scroll slowly */
    return once('water' + repeat, () => cv(256, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2a9bb0'); g.addColorStop(1, '#1f7f9d'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.12})`; x.lineWidth = 1 + Math.random() * 2; const px = Math.random() * w, py = Math.random() * h; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 14, py - 4, px + 30, py); x.stroke(); } }, repeat));
  },
  leaf() {   /* a palm frond: a spine with leaflets, on a transparent card */
    return once('leaf', () => cv(128, 256, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = '#3d5a22'; x.lineWidth = 3; x.beginPath(); x.moveTo(w / 2, h); x.lineTo(w / 2, 6); x.stroke();
      for (let i = 0; i < 26; i++) { const y = h - 10 - i * 9, len = 14 + 44 * Math.sin(Math.PI * (i + 3) / 30); for (const s of [-1, 1]) { x.strokeStyle = i % 2 ? '#4f7a2a' : '#5e8c33'; x.lineWidth = 3.2; x.beginPath(); x.moveTo(w / 2, y); x.lineTo(w / 2 + s * len, y - 10 - len * 0.2); x.stroke(); } } }, [1, 1], true));
  },
  bananaLeaf() {
    return once('bleaf', () => cv(128, 256, (x, w, h) => { x.clearRect(0, 0, w, h); const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#4f9a2c'); g.addColorStop(0.5, '#79c140'); g.addColorStop(1, '#4f9a2c'); x.fillStyle = g; x.beginPath(); x.moveTo(w / 2, h); x.bezierCurveTo(w * 0.05, h * 0.75, w * 0.0, h * 0.25, w / 2, 0); x.bezierCurveTo(w, h * 0.25, w * 0.95, h * 0.75, w / 2, h); x.fill();
      x.strokeStyle = 'rgba(30,70,15,0.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2, h); x.lineTo(w / 2, 0); x.stroke(); for (let i = 1; i < 14; i++) { x.beginPath(); x.moveTo(w / 2, i * 18); x.lineTo(w * 0.1, i * 18 - 14); x.moveTo(w / 2, i * 18); x.lineTo(w * 0.9, i * 18 - 14); x.stroke(); } }, [1, 1], true));
  },
  bunting(repeat = [1, 1]) {   /* a string of small flags */
    return once('bunting', () => cv(512, 64, (x, w, h) => { x.clearRect(0, 0, w, h); const cols = ['#d63b34', '#f1c232', '#2f7f4f', '#2f6fb5', '#f5f0e0'];
      for (let i = 0; i < 16; i++) { x.fillStyle = cols[i % cols.length]; x.beginPath(); x.moveTo(i * 32 + 3, 4); x.lineTo(i * 32 + 29, 4); x.lineTo(i * 32 + 16, 56); x.closePath(); x.fill(); } x.strokeStyle = '#2b2b2b'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 4); x.lineTo(w, 4); x.stroke(); }, repeat, true));
  },
  unionJack() {
    return once('uj', () => cv(256, 128, (x, w, h) => { x.fillStyle = '#1f3a7a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#f4f1e8'; x.lineWidth = 26; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, h); x.moveTo(w, 0); x.lineTo(0, h); x.stroke(); x.strokeStyle = '#c8202f'; x.lineWidth = 9; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, h); x.moveTo(w, 0); x.lineTo(0, h); x.stroke();
      x.fillStyle = '#f4f1e8'; x.fillRect(w / 2 - 22, 0, 44, h); x.fillRect(0, h / 2 - 22, w, 44); x.fillStyle = '#c8202f'; x.fillRect(w / 2 - 13, 0, 26, h); x.fillRect(0, h / 2 - 13, w, 26); }));
  },
  sign(text, w = 512, h = 128, bg = '#f3ecd8', fg = '#16202a', font = '700 76px Georgia, serif', border = true) {
    return cv(w, h, (x) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); if (border) { x.strokeStyle = fg; x.lineWidth = 6; x.strokeRect(8, 8, w - 16, h - 16); } x.fillStyle = fg; x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, h / 2 + 4); });
  },
  clock() {
    return once('clock', () => cv(128, 128, (x, w, h) => { x.fillStyle = '#f3ecd8'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.strokeStyle = '#1a1a1a'; x.lineWidth = 6; x.stroke(); x.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; x.beginPath(); x.moveTo(64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); x.lineTo(64 + Math.sin(a) * 56, 64 - Math.cos(a) * 56); x.stroke(); }
      x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 + Math.sin(-0.5) * 30, 64 - Math.cos(-0.5) * 30); x.stroke(); x.lineWidth = 4; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 + Math.sin(0.1) * 46, 64 - Math.cos(0.1) * 46); x.stroke(); }));
  },
  window(night) {
    return once('win' + night, () => cv(64, 96, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); if (night) { g.addColorStop(0, '#ffcf80'); g.addColorStop(1, '#c47a30'); } else { g.addColorStop(0, '#34485a'); g.addColorStop(1, '#1d2a35'); } x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(6, 6, 18, 80); }));
  },
  weave(repeat = [2, 1]) {   /* a woven basket: bands going over and under */
    return once('weave' + repeat, () => cv(128, 128, (x, w, h) => { x.fillStyle = '#a07a38'; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) { const v = ((r + c) % 2) ? 28 : -16; x.fillStyle = `rgb(${170 + v},${130 + v},${62 + v * 0.6})`; x.fillRect(c * 8 + 1, r * 8 + 1, 6, 6); } x.fillStyle = 'rgba(40,24,8,0.3)'; for (let i = 0; i <= 16; i++) { x.fillRect(i * 8, 0, 1, h); x.fillRect(0, i * 8, w, 1); } }, repeat));
  },
  tuft() {   /* a clump of soft grass blades on a transparent card: a few wide, tapering, curving blades that start in the middle and never touch the card's edge, so the card cannot show */
    return once('tuft', () => cv(128, 128, (x, w, h) => { x.clearRect(0, 0, w, h); const r = rng(11);
      for (let i = 0; i < 11; i++) { const bx = w * (0.3 + r() * 0.4), bh = h * (0.42 + r() * 0.4), lean = (r() - 0.5) * 30, bw = 5 + r() * 4, dry = r() < 0.14, g = 120 + r() * 70;
        const grd = x.createLinearGradient(0, h, 0, h - bh); if (dry) { grd.addColorStop(0, '#6a5a30'); grd.addColorStop(1, `rgb(${190 + r() * 30 | 0},${170 + r() * 20 | 0},${110 + r() * 20 | 0})`); } else { grd.addColorStop(0, `rgb(${g * 0.3 | 0},${g * 0.45 | 0},${g * 0.18 | 0})`); grd.addColorStop(1, `rgb(${g * 0.72 | 0},${g * 0.95 | 0},${g * 0.42 | 0})`); }
        x.fillStyle = grd; x.beginPath(); x.moveTo(bx - bw, h); x.bezierCurveTo(bx - bw * 0.8, h - bh * 0.5, bx + lean * 0.5, h - bh * 0.8, bx + lean, h - bh); x.bezierCurveTo(bx + lean * 0.5 + bw * 0.4, h - bh * 0.7, bx + bw * 0.9, h - bh * 0.4, bx + bw, h); x.closePath(); x.fill(); } }, [1, 1], true));
  },
  cloud() {
    return once('cloud', () => cv(256, 128, (x, w, h) => { x.clearRect(0, 0, w, h); for (let i = 0; i < 16; i++) { const cx = 40 + Math.random() * (w - 80), cy = h * 0.55 + (Math.random() - 0.5) * 20, r = 22 + Math.random() * 26, g = x.createRadialGradient(cx, cy, 2, cx, cy, r); g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); } }, [1, 1], true));
  },
  flame() {
    return once('flame', () => cv(64, 64, (x) => { const g = x.createRadialGradient(32, 40, 2, 32, 36, 30); g.addColorStop(0, 'rgba(255,250,210,1)'); g.addColorStop(0.3, 'rgba(255,190,70,0.85)'); g.addColorStop(0.7, 'rgba(255,110,20,0.25)'); g.addColorStop(1, 'rgba(255,90,10,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }, null, true));
  },
  puff() {
    return once('puff', () => cv(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }, null, true));
  },
};

/* ---------- materials and little builders ---------- */
const MC = new Map();   /* materials are shared when they ask for the same thing, so static scenery can be merged into a few big meshes (batchStatic) */
const cached = (key, make) => { let m = MC.get(key); if (!m) { m = make(); MC.set(key, m); } return m; };
export const std = (map, rough = 0.9, extra) => cached('s|' + (map ? map.uuid : '') + '|' + rough + '|' + JSON.stringify(extra || {}), () => new THREE.MeshStandardMaterial({ map, roughness: rough, ...(extra || {}) }));
export const solid = (color, rough = 0.85, metal = 0, extra) => extra ? new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra }) : cached('c|' + color + '|' + rough + '|' + metal, () => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
export const flat = (color, extra) => extra ? new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true, ...extra }) : cached('f|' + color, () => new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
export const glow = (color) => cached('g|' + color, () => new THREE.MeshBasicMaterial({ color }));
export function mesh(geo, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
export const box = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, parent);
export const cyl = (r0, r1, h, m, x, y, z, parent, seg = 16) => mesh(new THREE.CylinderGeometry(r0, r1, h, seg), m, x, y, z, parent);
export const plane = (w, h, m, x, y, z, parent) => mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, parent);
export function grp(parent, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); if (parent) parent.add(g); return g; }
export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };

/* ---------- the sky: a dome with a colour gradient, stars and a moon. setSky() recolours it for the time of day ---------- */
export function makeSky() {
  const R = 520, g = new THREE.SphereGeometry(R, 24, 14), n = g.attributes.position.count; g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const dome = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })); dome.renderOrder = -2; dome.frustumCulled = false;
  const sp = new Float32Array(500 * 3), r = rng(7); for (let i = 0; i < 500; i++) { const a = r() * Math.PI * 2, e = 0.08 + r() * 0.92, rr = Math.sqrt(1 - e * e) * (R - 20); sp[i * 3] = Math.cos(a) * rr; sp[i * 3 + 1] = e * (R - 20); sp[i * 3 + 2] = Math.sin(a) * rr; }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xfff6e0, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false })); stars.frustumCulled = false; stars.renderOrder = -1;
  const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: cv(128, 128, (x) => { const gg = x.createRadialGradient(64, 64, 10, 64, 64, 62); gg.addColorStop(0, 'rgba(255,250,230,1)'); gg.addColorStop(0.22, 'rgba(255,248,225,0.95)'); gg.addColorStop(0.3, 'rgba(255,245,220,0.25)'); gg.addColorStop(1, 'rgba(255,245,220,0)'); x.fillStyle = gg; x.fillRect(0, 0, 128, 128); }, null, true), transparent: true, depthWrite: false, fog: false, opacity: 0 }));
  moon.scale.set(60, 60, 1); moon.position.set(-190, 230, -380); moon.renderOrder = -1;
  const clouds = new THREE.Group(), cr = rng(21); for (let i = 0; i < 22; i++) { const a = cr() * Math.PI * 2, e = 0.1 + cr() * 0.34, rr = R - 40, c = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.cloud(), transparent: true, depthWrite: false, fog: false, opacity: 0.8 })); c.position.set(Math.cos(a) * Math.cos(e) * rr, Math.sin(e) * rr, Math.sin(a) * Math.cos(e) * rr); const sc = 170 + cr() * 190; c.scale.set(sc, sc * 0.42, 1); c.renderOrder = -1; clouds.add(c); } clouds.frustumCulled = false;
  const top = new THREE.Color(), hor = new THREE.Color(), c = new THREE.Color(); const pos = g.attributes.position, col = g.attributes.color;
  function setSky(topHex, horHex, starsOn = 0, moonOn = 0, light = 1) { top.set(topHex); hor.set(horHex); for (let i = 0; i < n; i++) { const e = Math.max(0, pos.getY(i) / R); c.copy(hor).lerp(top, Math.pow(e, 0.55)); col.setXYZ(i, c.r, c.g, c.b); } col.needsUpdate = true; stars.material.opacity = starsOn; moon.material.opacity = moonOn; for (const c of clouds.children) { c.material.color.copy(hor).lerp(new THREE.Color(0xffffff), 0.55).multiplyScalar(0.25 + 0.75 * light); c.material.opacity = 0.85 * (1 - starsOn * 0.75); } stars.visible = starsOn > 0.01; moon.visible = moonOn > 0.01; }
  return { dome, stars, moon, clouds, setSky, objects: [dome, stars, moon, clouds] };
}

/* ---------- batchStatic: merge every still mesh under root into one mesh per material. Things that move (or are switched on and off one by one)
   are marked with userData.noBatch = true and are left alone, together with everything inside them. ---------- */
export function batchStatic(root) {
  root.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), rel = new THREE.Matrix4(), buckets = new Map(), dead = [], keep = ['position', 'normal', 'uv', 'color'];
  (function walk(o, skip) {
    if (o.userData.noBatch || skip) skip = true;
    if (!skip && o.isMesh && !o.isSkinnedMesh && !o.isInstancedMesh && !Array.isArray(o.material) && o.visible && o.geometry.attributes.position && o.geometry.attributes.normal) {
      rel.multiplyMatrices(inv, o.matrixWorld); if (rel.determinant() > 0) {
        const g = o.geometry.clone(); for (const k of Object.keys(g.attributes)) if (!keep.includes(k)) g.deleteAttribute(k); if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
        g.applyMatrix4(rel); const ni = g.index ? g.toNonIndexed() : g; const key = o.material.uuid + (ni.attributes.color ? 'c' : ''); let b = buckets.get(key); if (!b) buckets.set(key, (b = { mat: o.material, geos: [] })); b.geos.push(ni); dead.push(o);
      }
    }
    for (const c of [...o.children]) walk(c, skip);
  })(root, false);
  for (const o of dead) { o.parent.remove(o); }
  for (const b of buckets.values()) { const g = mergeGeometries(b.geos, false); if (!g) continue; const m = new THREE.Mesh(g, b.mat); m.userData.batched = true; m.matrixAutoUpdate = false; root.add(m); }
  return { merged: buckets.size, removed: dead.length };
}
