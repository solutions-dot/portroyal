/* engine/cloud-tex.js: the soft cloud picture for the sky, made from numbers, not drawn on a canvas (owner, 21 November 2026).
   A browser that guards against fingerprinting (Safari) adds tiny random colours to canvas pictures. In a cloud's see-through edges
   they showed as rainbow speckles across the sky, first seen in Bog Walk and Kendal. Every game's sky uses this one picture.

     cloudTexture()   a 256 x 128 white cloud, sixteen soft puffs, alpha only (one shared texture) */
import * as THREE from 'three';
const rng = (seed) => { let s = (seed >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; };   /* the same picture every time */

let tex = null;
export function cloudTexture() {
  if (tex) return tex;
  const w = 256, h = 128, a = new Float32Array(w * h), r0 = rng(7);
  for (let i = 0; i < 16; i++) {
    const cx = 40 + r0() * (w - 80), cy = h * 0.55 + (r0() - 0.5) * 20, r = 22 + r0() * 26;
    for (let y = Math.max(0, (cy - r) | 0); y < Math.min(h, cy + r + 1); y++) for (let x = Math.max(0, (cx - r) | 0); x < Math.min(w, cx + r + 1); x++) {
      const d = Math.hypot(x - cx, y - cy); if (d >= r) continue;
      const k = 0.55 * (1 - Math.max(0, d - 2) / (r - 2)), j = y * w + x; a[j] = a[j] + k * (1 - a[j]);   /* puffs build up the way painted ones did */
    }
  }
  const px = new Uint8Array(w * h * 4);
  for (let j = 0; j < w * h; j++) { px[j * 4] = px[j * 4 + 1] = px[j * 4 + 2] = 255; px[j * 4 + 3] = Math.round(Math.min(1, a[j]) * 255); }
  tex = new THREE.DataTexture(px, w, h, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  return tex;
}

/* a soft round puff (smoke, steam, dust), made from numbers for the same reason: white, its alpha falling off smoothly from the middle */
let puff = null;
export function puffTexture() {
  if (puff) return puff;
  const n = 64, px = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const d = Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) / (n / 2), a = d >= 1 ? 0 : Math.pow(1 - d, 1.6) * 0.95, j = (y * n + x) * 4; px[j] = px[j + 1] = px[j + 2] = 255; px[j + 3] = Math.round(a * 255); }
  puff = new THREE.DataTexture(px, n, n, THREE.RGBAFormat); puff.colorSpace = THREE.SRGBColorSpace; puff.magFilter = THREE.LinearFilter; puff.minFilter = THREE.LinearMipmapLinearFilter; puff.generateMipmaps = true; puff.needsUpdate = true;
  return puff;
}
