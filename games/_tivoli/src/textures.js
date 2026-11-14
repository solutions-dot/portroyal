/* games/_tivoli/src/textures.js: weathered surface textures drawn in code (no image files). Each maker returns a repeating CanvasTexture sized for
   world-space mapping (street.js maps them by metres, so one repeat is TILE metres). Seeded, so a surface looks the same every run.
   stucco(colour): painted render with stains, damp at the bottom, hairline cracks and speckle. block(colour): painted concrete block with mortar lines.
   zinc(): corrugated zinc roofing with rust. asphalt(): worn road with patches, cracks and oil. paving(): concrete pavement slabs. grass(): dry grass with bare earth. */
import * as THREE from 'three';

function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const mix = (c, k) => { const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255; const f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(r)},${f(g)},${f(b)})`; };
function tex(draw, size = 256, seed = 1) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); draw(g, size, rng(seed));
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function speckle(g, s, r, n, a = 0.08) { for (let i = 0; i < n; i++) { g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`; g.fillRect(r() * s, r() * s, 1 + r() * 2, 1 + r() * 2); } }
function wrapped(g, s, x, y, w, h, draw) { for (const dx of [0, -s, s]) for (const dy of [0, -s, s]) { g.save(); g.translate(dx, dy); draw(x, y, w, h); g.restore(); } }

export const TILE = { stucco: 4, block: 3, zinc: 3, asphalt: 6, paving: 3, grass: 5, boards: 2, dirt: 5 };

export function stucco(colour, seed = 3) {
  return tex((g, s, r) => {
    g.fillStyle = hex(colour); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) { g.fillStyle = mix(colour, 0.92 + r() * 0.16); const w = 20 + r() * 60, h = 20 + r() * 60; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }   /* patchy repainting */
    for (let i = 0; i < 26; i++) { const x = r() * s, w = 4 + r() * 16, gr = g.createLinearGradient(0, 0, 0, s * 0.8); gr.addColorStop(0, 'rgba(60,50,40,0.28)'); gr.addColorStop(1, 'rgba(60,50,40,0)'); g.fillStyle = gr; g.fillRect(x, 0, w, s * (0.3 + r() * 0.5)); }   /* rain streaks */
    const damp = g.createLinearGradient(0, s * 0.7, 0, s); damp.addColorStop(0, 'rgba(70,60,45,0)'); damp.addColorStop(1, 'rgba(70,60,45,0.34)'); g.fillStyle = damp; g.fillRect(0, s * 0.7, s, s * 0.3);   /* damp at the foot */
    g.strokeStyle = 'rgba(40,34,28,0.4)'; g.lineWidth = 1; for (let i = 0; i < 6; i++) { let x = r() * s, y = r() * s; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (r() - 0.5) * 12; y += r() * 10; g.lineTo(x, y); } g.stroke(); }   /* hairline cracks */
    speckle(g, s, r, 1400);
  }, 256, seed);
}
export function block(colour, seed = 5) {
  return tex((g, s, r) => {
    g.fillStyle = hex(colour); g.fillRect(0, 0, s, s); const bh = s / 6, bw = s / 3;
    for (let row = 0; row < 6; row++) for (let i = -1; i < 4; i++) { g.fillStyle = mix(colour, 0.9 + r() * 0.18); g.fillRect(i * bw + (row % 2) * bw / 2 + 2, row * bh + 2, bw - 4, bh - 4); }
    g.fillStyle = 'rgba(40,36,30,0.35)'; for (let row = 0; row <= 6; row++) g.fillRect(0, row * bh - 1, s, 3);
    for (let row = 0; row < 6; row++) for (let i = -1; i < 4; i++) g.fillRect(i * bw + (row % 2) * bw / 2 - 1, row * bh, 3, bh);
    for (let i = 0; i < 14; i++) { const x = r() * s, gr = g.createLinearGradient(0, 0, 0, s * 0.6); gr.addColorStop(0, 'rgba(50,44,36,0.25)'); gr.addColorStop(1, 'rgba(50,44,36,0)'); g.fillStyle = gr; g.fillRect(x, 0, 5 + r() * 12, s * 0.6); }
    speckle(g, s, r, 900);
  }, 256, seed);
}
export function zinc(seed = 7) {
  return tex((g, s, r) => {
    g.fillStyle = '#8f9496'; g.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += s / 16) { const gr = g.createLinearGradient(x, 0, x + s / 16, 0); gr.addColorStop(0, 'rgba(255,255,255,0.3)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.18)'); gr.addColorStop(1, 'rgba(255,255,255,0.3)'); g.fillStyle = gr; g.fillRect(x, 0, s / 16, s); }
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${120 + r() * 40},${64 + r() * 20},${34},${0.1 + r() * 0.25})`; const w = 4 + r() * 30, h = 4 + r() * 24; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }   /* rust */
    speckle(g, s, r, 600, 0.06);
  }, 256, seed);
}
export function asphalt(seed = 11) {
  return tex((g, s, r) => {
    g.fillStyle = '#5a5a5c'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 20; i++) { const v = 36 + r() * 56; g.fillStyle = `rgba(${v},${v},${v + 3},0.35)`; const w = 30 + r() * 90, h = 30 + r() * 90; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }   /* patched surface */
    g.fillStyle = 'rgba(15,15,18,0.3)'; for (let i = 0; i < 5; i++) { const x = r() * s, y = r() * s, rr = 5 + r() * 14; g.beginPath(); g.ellipse(x, y, rr, rr * 0.6, r() * 3, 0, 7); g.fill(); }   /* oil */
    g.strokeStyle = 'rgba(20,20,22,0.55)'; g.lineWidth = 1.4; for (let i = 0; i < 7; i++) { let x = r() * s, y = r() * s; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 10; k++) { x += (r() - 0.5) * 24; y += (r() - 0.5) * 24; g.lineTo(x, y); } g.stroke(); }   /* cracks */
    speckle(g, s, r, 3500, 0.12);
  }, 256, seed);
}
export function paving(seed = 13) {
  return tex((g, s, r) => {
    g.fillStyle = '#a8a59a'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = r() < 0.5 ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${0.03 + r() * 0.06})`; g.fillRect(i * s / 4, j * s / 4, s / 4, s / 4); }
    g.fillStyle = 'rgba(40,38,32,0.45)'; for (let i = 0; i <= 4; i++) { g.fillRect(i * s / 4 - 1, 0, 3, s); g.fillRect(0, i * s / 4 - 1, s, 3); }
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(70,90,40,${0.15 + r() * 0.2})`; g.fillRect(r() * s, r() * s, 2 + r() * 8, 2 + r() * 3); }   /* weeds in the joints */
    speckle(g, s, r, 1500);
  }, 256, seed);
}
export function grass(seed = 17) {
  return tex((g, s, r) => {
    g.fillStyle = '#8a8a52'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${90 + r() * 50},${96 + r() * 40},${40},0.35)`; const w = 12 + r() * 40, h = 12 + r() * 40; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }
    for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(150,120,80,0.4)'; const w = 10 + r() * 30, h = 6 + r() * 16; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }   /* bare earth */
    speckle(g, s, r, 2000, 0.1);
  }, 256, seed);
}
/* a shop sign: painted board with letters, drawn to a canvas texture (not tiled) */
export function sign(text, bg = 0xd8c02a, fg = '#1b1b1b') {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); g.fillStyle = hex(bg); g.fillRect(0, 0, 512, 128); g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(6, 6, 500, 116);
  g.fillStyle = fg; g.font = '700 64px Arial Black, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 68, 480);
  const r = rng(text.length * 7); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(0,0,0,${r() * 0.12})`; g.fillRect(r() * 512, r() * 128, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

/* weathered painted boards, as on the board-and-zinc houses: vertical planks of slightly different tone, grain, nails, gaps, peeling paint and rain streaks */
export function boards(colour, seed = 19) {
  return tex((g, s, r) => {
    const n = 8, w = s / n; for (let i = 0; i < n; i++) { g.fillStyle = mix(colour, 0.86 + r() * 0.24); g.fillRect(i * w, 0, w, s); g.fillStyle = 'rgba(30,24,18,0.5)'; g.fillRect(i * w - 1, 0, 3, s); }
    for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(40,30,20,${0.05 + r() * 0.1})`; g.lineWidth = 1; const x = r() * s; g.beginPath(); g.moveTo(x, r() * s); g.lineTo(x + (r() - 0.5) * 6, r() * s); g.stroke(); }   /* grain */
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${150 + r() * 60},${130 + r() * 50},${100 + r() * 40},${0.25 + r() * 0.3})`; const ww = 6 + r() * 26, hh = 8 + r() * 40; wrapped(g, s, r() * s, r() * s, ww, hh, (x, y) => g.fillRect(x, y, ww, hh)); }   /* bare wood where the paint has gone */
    for (let i = 0; i < n; i++) for (const y of [s * 0.12, s * 0.5, s * 0.88]) { g.fillStyle = 'rgba(20,16,12,0.6)'; g.fillRect(i * w + w * 0.5, y, 2, 2); }   /* nail heads */
    for (let i = 0; i < 22; i++) { const x = r() * s, gr = g.createLinearGradient(0, 0, 0, s * 0.7); gr.addColorStop(0, 'rgba(50,40,30,0.3)'); gr.addColorStop(1, 'rgba(50,40,30,0)'); g.fillStyle = gr; g.fillRect(x, 0, 3 + r() * 9, s * (0.3 + r() * 0.5)); }
    speckle(g, s, r, 900);
  }, 256, seed);
}
/* packed earth: tan and brown patches, pebbles, dry cracks and worn tracks */
export function dirt(seed = 23) {
  return tex((g, s, r) => {
    g.fillStyle = '#a58a62'; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 46; i++) { const v = 0.82 + r() * 0.34; g.fillStyle = `rgba(${165 * v},${138 * v},${98 * v},0.5)`; const w = 16 + r() * 60, h = 16 + r() * 60; wrapped(g, s, r() * s, r() * s, w, h, (x, y) => g.fillRect(x, y, w, h)); }
    for (let i = 0; i < 140; i++) { const v = r() < 0.5 ? 0.6 : 1.3; g.fillStyle = `rgba(${150 * v},${126 * v},${96 * v},0.7)`; g.fillRect(r() * s, r() * s, 1 + r() * 3, 1 + r() * 2); }   /* pebbles */
    g.strokeStyle = 'rgba(70,52,34,0.35)'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { let x = r() * s, y = r() * s; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (r() - 0.5) * 22; y += (r() - 0.5) * 22; g.lineTo(x, y); } g.stroke(); }
    speckle(g, s, r, 2200, 0.1);
  }, 256, seed);
}
