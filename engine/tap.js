/* engine/tap.js: tap a person to talk to them (owner, 19 November 2026: "allow the touching of the character themself to initiate the dialogue").
   pickPerson(camera, people, cx, cy, opts) returns the person under a tap, or null.
   - people: [{ obj, data, h }]: obj is the body (any Object3D), data is what is returned, h its height in metres (default 1.7 times its scale).
   - A person is a band on the screen from feet to head, as wide as about a fifth of their height there and never thinner than `slop` pixels,
     so a child far off is still easy to hit with a finger. Of several under the finger, the nearest to the camera wins.
   - opts.near = [x, z] and opts.maxDist: only people within that distance of the player (as far as the game lets you talk).
   No ray is cast through the body: posing a skinned body point by point in JavaScript is what made walking slow (see engine/guide.js). */
import * as THREE from 'three';

const _w = new THREE.Vector3(), _f = new THREE.Vector3(), _h = new THREE.Vector3();
const shown = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };

export function pickPerson(camera, people, cx, cy, { near = null, maxDist = 9, slop = 30 } = {}) {
  const W = innerWidth, H = innerHeight; let best = null, bestD = Infinity;
  for (const p of people || []) {
    const o = p && p.obj; if (!o || !shown(o)) continue; o.updateWorldMatrix(true, false); o.getWorldPosition(_w);
    if (near && Math.hypot(_w.x - near[0], _w.z - near[1]) > maxDist) continue;
    const h = p.h || 1.7 * (o.scale ? o.scale.y : 1);
    _f.copy(_w); _f.y += h * 0.05; _f.project(camera); _h.copy(_w); _h.y += h; _h.project(camera);
    if (_f.z > 1 || _h.z > 1 || _f.z < -1) continue;   /* behind the camera */
    const fx = (_f.x + 1) / 2 * W, fy = (1 - _f.y) / 2 * H, hx = (_h.x + 1) / 2 * W, hy = (1 - _h.y) / 2 * H;
    const sx = fx - hx, sy = fy - hy, len2 = sx * sx + sy * sy, len = Math.sqrt(len2) || 1;
    const t = Math.max(0, Math.min(1, ((cx - hx) * sx + (cy - hy) * sy) / (len2 || 1))), dx = cx - (hx + sx * t), dy = cy - (hy + sy * t);
    const off = Math.hypot(dx, dy), half = Math.max(slop, len * 0.2) + (t <= 0 ? len * 0.06 : 0);   /* a little more room above the head */
    if (off > half) continue;
    const d = camera.position.distanceTo(_w); if (d < bestD) { bestD = d; best = p.data !== undefined ? p.data : o; }
  }
  return best;
}
