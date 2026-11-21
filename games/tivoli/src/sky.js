/* games/tivoli/src/sky.js: a Kingston midday sky shared by every place: a haze-to-blue dome, soft clouds, and a sun that casts shadows on computers (phones get none). */
import * as THREE from 'three';
import { cloudTexture } from '../../../engine/cloud-tex.js';

export function addSky(out, rnd, opts = {}) {
  const dome = new THREE.Mesh(new THREE.SphereGeometry(380, 24, 14), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }));
  const pos = dome.geometry.attributes.position, col = new Float32Array(pos.count * 3), hz = new THREE.Color(0xdbe6ea), zn = new THREE.Color(0x4f90d0);
  for (let i = 0; i < pos.count; i++) { const u = Math.max(0, Math.min(1, pos.getY(i) / 260)), c = hz.clone().lerp(zn, Math.pow(u, 0.6)); col.set([c.r, c.g, c.b], i * 3); }
  dome.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3)); out.add(dome);
  const ct = cloudTexture();   /* made from numbers, not a canvas: no Safari speckles (engine/cloud-tex.js) */
  for (let i = 0; i < 14; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false, opacity: 0.85 })); const a = rnd() * 6.28, d = 220 + rnd() * 100; sp.position.set(Math.cos(a) * d, 70 + rnd() * 90, Math.sin(a) * d); sp.scale.set(120 + rnd() * 120, 50 + rnd() * 30, 1); out.add(sp); }
  const sun = new THREE.DirectionalLight(0xfff1d6, 3.3); sun.position.set(-26, 42, 24); sun.target.position.set(...(opts.target || [-8, 0, 0])); out.add(sun, sun.target);
  if (opts.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const c = sun.shadow.camera, e = opts.extent || [60, 30]; c.left = -e[0]; c.right = e[0]; c.top = e[1]; c.bottom = -e[1]; c.near = 5; c.far = 120; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04; }
  return sun;
}
