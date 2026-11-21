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
