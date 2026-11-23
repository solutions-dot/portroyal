/* engine/page.js: a written page that reads as paper close up (22 November 2026). Rose Hall and The Shark Papers drew a sheet as a pale
   card with one line of big print on it. writtenPage() paints old paper (a little uneven in tone, a soft edge), a heading in an ink hand
   at the top, and lines of writing below it that are too small to read: the heading is the only words, so a game never invents a text.

   writtenPage(title, { w, d, seed, paper, ink, rows }) returns a THREE.CanvasTexture sized for a sheet w by d metres (used as a map on a
   plane lying on the sheet). title may hold "|" for a second heading line. */
import * as THREE from 'three';

function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function writtenPage(title = '', { w = 0.3, d = 0.22, seed = 1, paper = '#ece0c4', ink = '#3a2a1c', rows = null } = {}) {
  const W = 512, H = Math.max(128, Math.round((512 * d) / w)), c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d'), r = rng(seed + title.length * 7);
  x.fillStyle = paper; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) { x.fillStyle = `rgba(140,100,50,${0.03 + r() * 0.05})`; x.beginPath(); x.arc(r() * W, r() * H, 20 + r() * 80, 0, 7); x.fill(); }
  const edge = x.createLinearGradient(0, 0, 0, H); edge.addColorStop(0, 'rgba(120,90,50,0.12)'); edge.addColorStop(0.08, 'rgba(0,0,0,0)'); edge.addColorStop(0.92, 'rgba(0,0,0,0)'); edge.addColorStop(1, 'rgba(120,90,50,0.14)');
  x.fillStyle = edge; x.fillRect(0, 0, W, H);
  x.fillStyle = ink; x.strokeStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle';
  const parts = title ? title.split('|') : [], th = Math.min(H * 0.16, 46);
  parts.forEach((t, i) => { x.font = `italic ${Math.round(th * (i ? 0.75 : 1))}px Georgia, serif`; x.fillText(t, W / 2, H * 0.1 + th * 0.7 + i * th * 1.05, W * 0.86); });
  /* the writing: wavy strokes in rows, each a slightly different length, a little ragged */
  const y0 = parts.length ? H * 0.1 + th * (parts.length * 1.05 + 0.8) : H * 0.1, gap = Math.max(14, H * 0.065), n = rows ?? Math.floor((H * 0.92 - y0) / gap);
  x.globalAlpha = 0.6; x.lineWidth = 2;
  for (let i = 0; i < n; i++) {
    const y = y0 + i * gap, end = W * (0.78 + r() * 0.14) - (i === n - 1 ? W * 0.3 : 0);
    x.beginPath(); x.moveTo(W * 0.1, y);
    for (let k = W * 0.1; k < end; k += 5) x.lineTo(k, y + Math.sin(k * 0.37 + i) * 2.2 - r() * 3);
    x.stroke();
  }
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
