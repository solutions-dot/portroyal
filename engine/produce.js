/* engine/produce.js: a woven basket heaped with produce, for any game's market (rule 10). It follows Port Royal's market baskets
   (games/port-royal/src/main.js, "a heap in a basket"): each fruit is its own piece, laid ring by ring and layer by layer on the basket's floor
   and on the layer below, so the pile is real and nothing floats or sinks into a green lid (owner, 23 November 2026, Morant Bay: "baskets can
   look better (see port royal assets with fruit etc)").
     const b = produceBasket({ fill: ['orange', 'lime'], r: 0.3 });   // standing on y = 0, centred on its origin
   fill: what is in it, one kind or a mix: orange, lime, mango, yam, ackee, pepper, plantain. seed: a number, so the same basket comes out the same.
   piece: { geo, mat } heaps a shape of the game's own instead (Port Royal's peppers are cones). count: about how many go in (the pile stops at
   count x 2.4, never fewer than 6 x 2.4, as Port Royal's heaps did); without it the basket is filled to a dome. Port Royal's market stalls use this
   (moved here from games/port-royal/src/main.js, 23 November 2026, rule 10). */
import * as THREE from 'three';

const KINDS = {
  orange: { r: 0.05, color: 0xd98a2a, rough: 0.55 },
  lime: { r: 0.038, color: 0x6f9a32, rough: 0.5 },
  mango: { r: 0.055, color: 0xd8a830, rough: 0.5, sx: 1.25, blush: 0xc8582a },
  yam: { r: 0.06, color: 0x7a5a3a, rough: 0.95, sx: 1.7 },
  ackee: { r: 0.04, color: 0xc8402a, rough: 0.6 },
  pepper: { r: 0.022, color: 0xc0301e, rough: 0.5, sx: 1.6 },
  plantain: { r: 0.03, color: 0x8aa040, rough: 0.6, sx: 4.2 },
};
let weaveTex = null;
export function weaveTexture() { return weave(); }
function weave() {
  if (weaveTex) return weaveTex;
  const c = document.createElement('canvas'); c.width = 64; c.height = 32; const x = c.getContext('2d');
  x.fillStyle = '#a8844c'; x.fillRect(0, 0, 64, 32);
  for (let y = 0; y < 32; y += 4) for (let i = 0; i < 64; i += 8) { x.fillStyle = ((i + y) / 4) % 2 ? '#8a6a38' : '#c09a5a'; x.fillRect(i + ((y / 4) % 2) * 4, y, 7, 3); }
  weaveTex = new THREE.CanvasTexture(c); weaveTex.wrapS = weaveTex.wrapT = THREE.RepeatWrapping; weaveTex.repeat.set(4, 1); weaveTex.colorSpace = THREE.SRGBColorSpace;
  return weaveTex;
}
export function produceBasket({ fill = ['orange'], r = 0.3, h = 0.15, seed = 1, tint = 0xffffff, piece = null, count = 0 } = {}) {
  let s0 = seed * 9301 + 49297; const rnd = (a) => ((s0 = (s0 * 9301 + 49297) % 233280) / 233280 - 0.5) * a;
  const g = new THREE.Group(), wm = new THREE.MeshStandardMaterial({ map: weave(), color: tint, roughness: 0.95, side: THREE.DoubleSide });
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.8, h, 18, 1, true), wm); wall.position.y = h / 2; g.add(wall);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(r * 0.8, 18), wm); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.012; g.add(floor);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.014, 5, 22), new THREE.MeshStandardMaterial({ color: 0x7a5a30, roughness: 0.9 })); rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
  if (piece && !piece.geo.boundingSphere) piece.geo.computeBoundingSphere();
  const kinds = piece ? [{}] : (Array.isArray(fill) ? fill : [fill]).map((k) => KINDS[k] || KINDS.orange);
  if (!piece && !kinds.length) return g;   /* fill: [] is an empty basket (Port Royal's pineapples stand in one) */
  const geos = piece ? [piece.geo] : kinds.map((k) => new THREE.SphereGeometry(k.r, 10, 8)), mats = piece ? [piece.mat] : kinds.map((k) => new THREE.MeshStandardMaterial({ color: k.color, roughness: k.rough }));
  const sz = piece ? Math.min(0.06, piece.geo.boundingSphere.radius * 0.85) : Math.max(...kinds.map((k) => k.r)); let n = 0;
  const most = count ? Math.max(count, 6) * 2.4 : Infinity;
  for (let L = 0; L < 3 && n < most; L++) {   /* a layer lies in the hollow of the one below, a little narrower each time, so the heap is domed */
    const R = r * 0.8 - sz * 0.9 - L * sz * 1.5, y = 0.012 + sz * 0.95 + L * sz * 1.45;
    if (R < 0) { if (L) { const k = n++ % kinds.length, m = new THREE.Mesh(geos[k], mats[k]); m.position.set(0, y - sz * 0.3, 0); g.add(m); } break; }
    for (let d = L % 2 ? sz : 0; d <= R + 1e-6 && n < most; d += sz * 1.9) {
      const cnt = d < 1e-6 ? 1 : Math.max(3, Math.floor((2 * Math.PI * d) / (sz * 1.95))), a0 = rnd(6);
      for (let q = 0; q < cnt && n < most; q++) {
        const k = n++ % kinds.length, K = kinds[k], a = a0 + (q / cnt) * Math.PI * 2, m = new THREE.Mesh(geos[k], mats[k]);
        m.position.set(Math.cos(a) * d + rnd(sz * 0.2), y + rnd(sz * 0.15), Math.sin(a) * d + rnd(sz * 0.2));
        m.scale.set(K.sx || 1, 1, 1); m.rotation.set(rnd(1), rnd(6), rnd(1)); g.add(m);
      }
    }
  }
  return g;
}
