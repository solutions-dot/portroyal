/* engine/water.js: the sea, for every game (owner's rule 10). It is Port Royal's sea made shareable: a glossy surface with a rippled normal map that drifts, and a
   patch of gentle swell near you, on a wide still sheet that runs to the horizon.
     const sea = makeSea({ color: 0x2b8ea0, y: -0.35, x: 0, z: 0 });  scene.add(sea);
     every frame: sea.userData.tick(seconds, { phone })
   color: the water's colour (Caribbean turquoise by default; a northern harbour is greyer). y: the still water level. x, z: where the swell patch is centred (put it where
   the player looks at the water). size: the swell patch, in metres (default 300). far: the still sheet (default 5000). swell: how tall the swell is (1 = Port Royal's).
   Port Royal still draws its own copy (its sea level rises and falls with the earthquake); move it over to this when that code is next touched. */
import * as THREE from 'three';
let ripple = null;
function rippleMap() {
  if (ripple) return ripple; const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), d = x.createImageData(N, N), h = new Float32Array(N * N);
  for (let i = 0; i < h.length; i++) { const u = i % N, v = i / N | 0; h[i] = Math.sin(u * 0.196 + Math.sin(v * 0.147) * 2) + Math.sin(v * 0.245 + Math.sin(u * 0.098) * 1.5) * 0.7 + Math.sin((u + v) * 0.393) * 0.3; }
  for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) { const i = v * N + u, dx = h[v * N + (u + 1) % N] - h[i], dy = h[((v + 1) % N) * N + u] - h[i]; d.data[i * 4] = 128 + dx * 150; d.data[i * 4 + 1] = 128 + dy * 150; d.data[i * 4 + 2] = 255; d.data[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0); ripple = new THREE.CanvasTexture(c); ripple.wrapS = ripple.wrapT = THREE.RepeatWrapping; ripple.colorSpace = THREE.NoColorSpace; return ripple;
}
export function makeSea({ color = 0x2b8ea0, y = 0, x = 0, z = 0, size = 300, far = 5000, swell = 1, seg = 60 } = {}) {
  const g = new THREE.Group(), near = rippleMap().clone(), wide = rippleMap().clone(); near.needsUpdate = wide.needsUpdate = true; near.repeat.set(size / 1.875, size / 1.875); wide.repeat.set(far / 1.875, far / 1.875);
  const matOf = (map) => new THREE.MeshStandardMaterial({ color, roughness: 0.22, metalness: 0.15, normalMap: map, normalScale: new THREE.Vector2(0.55, 0.55) });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(far, far), matOf(wide)); sheet.rotation.x = -Math.PI / 2; sheet.position.set(x, y - 0.12 * swell, z); g.add(sheet);   /* just under the swell's troughs, so the two never fight */
  const wg = new THREE.PlaneGeometry(size, size, seg, seg); wg.rotateX(-Math.PI / 2); const waves = new THREE.Mesh(wg, matOf(near)); waves.position.set(x, y, z); waves.renderOrder = 2; g.add(waves);
  const base = wg.attributes.position.array.slice(); let frame = 0; g.userData.waves = waves; g.userData.noBatch = true; g.name = 'sea';
  for (const m of [sheet, waves]) m.userData.sea = true;
  g.userData.tick = (t, { phone = false } = {}) => { for (const m of [near, wide]) { m.offset.x = t * 0.02; m.offset.y = t * 0.013; }
    const p = wg.attributes.position; if (!phone || (frame & 1) === 0) { for (let i = 0; i < p.count; i++) { const bx = base[i * 3], bz = base[i * 3 + 2]; p.setY(i, (Math.sin(bx * 0.42 + t * 1.3) * 0.07 + Math.sin(bz * 0.31 + t * 0.9) * 0.06 + Math.sin((bx + bz) * 0.9 + t * 2.1) * 0.025) * swell); } p.needsUpdate = true; }
    if ((frame++ & (phone ? 7 : 3)) === 0) wg.computeVertexNormals(); };
  return g;
}
