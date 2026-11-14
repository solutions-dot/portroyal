/* games/tivoli/src/bake.js: merge everything static in a built place into one mesh per material, and map textures by WORLD position (a material with
   userData.tile = metres per repeat), so a wall never stretches whatever its size. Used by street.js and backowall.js. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function bake(g, noShadow = []) {
  const buckets = new Map(); g.updateMatrixWorld(true);
  g.traverse((o) => {
    if (!o.isMesh) return; let ge = o.geometry.clone(); ge.applyMatrix4(o.matrixWorld);
    for (const k of Object.keys(ge.attributes)) if (!['position', 'normal', 'uv'].includes(k)) ge.deleteAttribute(k);
    if (ge.index) ge = ge.toNonIndexed(); const m = o.material;
    if (m.userData.tile) { const p = ge.attributes.position, n = ge.attributes.normal, uv = new Float32Array(p.count * 2), t = m.userData.tile;
      for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
        if (ax >= ay && ax >= az) { uv[i * 2] = p.getZ(i) / t; uv[i * 2 + 1] = p.getY(i) / t; } else if (ay >= az) { uv[i * 2] = p.getX(i) / t; uv[i * 2 + 1] = p.getZ(i) / t; } else { uv[i * 2] = p.getX(i) / t; uv[i * 2 + 1] = p.getY(i) / t; } }
      ge.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); }
    (buckets.get(m) || buckets.set(m, []).get(m)).push(ge);
  });
  const out = new THREE.Group();
  for (const [m, gs] of buckets) { const me = new THREE.Mesh(mergeGeometries(gs), m); me.castShadow = !noShadow.includes(m); me.receiveShadow = true; out.add(me); }
  return out;
}
