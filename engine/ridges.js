/* engine/ridges.js: far mountains that fade into the haze, for every game (moved from Nanny Town's land.js, 22 November 2026, rule 10).
   The owner: "the mountains in these games dont look as good as the other games". Nanny Town's far ridges are rings of jagged walls,
   each paler than the one before, that follow the camera like a painted backdrop. makeRidges() returns { group, tone }: add the group to
   the scene, keep it centred on the camera each frame (group.position.set(cam.x, 0, cam.z)), and call tone(green, haze, light) whenever
   the time of day changes. layers: [{ r, base, amp, k }] rings from near to far (k: how far into the haze). vnoise and fbm are the value
   noise it uses, shared too. */
import * as THREE from 'three';

/* ---------- noise ---------- */
const imul = Math.imul;
function hash2(ix, iz, seed) { let h = imul(ix, 374761393) ^ imul(iz, 668265263) ^ imul(seed, 1274126177); h = imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
export function vnoise(x, z, seed = 1) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz, seed), b = hash2(ix + 1, iz, seed), c = hash2(ix, iz + 1, seed), d = hash2(ix + 1, iz + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, z, oct = 4, seed = 1) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, z * f, seed + i * 17); n += a; a *= 0.5; f *= 2.03; } return s / n; }

/* ---------- far ridges: rings of mountains that fade to blue. Each ring is a wall with a jagged top; farther rings are paler. ---------- */
export function makeRidges({ layers, seed = 5 } = {}) {
  const L = layers || [{ r: 196, base: 0, amp: 30, k: 0.16 }, { r: 232, base: 12, amp: 44, k: 0.3 }, { r: 276, base: 26, amp: 56, k: 0.44 }, { r: 330, base: 40, amp: 70, k: 0.6 }, { r: 396, base: 56, amp: 86, k: 0.75 }, { r: 468, base: 74, amp: 104, k: 0.88 }];
  const group = new THREE.Group(); group.userData.noBatch = true; const N = 200, list = [];
  L.forEach((ly, li) => {
    const pos = new Float32Array((N + 1) * 6), col = new Float32Array((N + 1) * 6), idx = [], tk = new Float32Array((N + 1) * 2);
    for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2, cx = Math.cos(a), sz = Math.sin(a), n1 = fbm(cx * 2.1 + 9, sz * 2.1 + 9, 4, seed + li * 31), n2 = 1 - Math.abs(2 * vnoise(cx * 6.2 + 3, sz * 6.2 + 3, seed + li * 7) - 1), top = ly.base + ly.amp * (0.62 * n1 + 0.38 * n2 * n1 * 1.6);
      pos.set([cx * ly.r, -160, sz * ly.r, cx * ly.r, top, sz * ly.r], i * 6); tk[i * 2] = 0; tk[i * 2 + 1] = 1; if (i < N) { const q = i * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); } }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide, depthWrite: true })); m.frustumCulled = false; m.renderOrder = -1 + li * -0.01; group.add(m); list.push({ m, k: ly.k, col, pos, base: ly.base, amp: ly.amp });
  });
  const A = new THREE.Color(), B = new THREE.Color(), C = new THREE.Color();
  /* green: the colour of near forest. haze: the colour of the far air. light: 0 (night) to 1 (noon). */
  function tone(green, haze, light = 1) {
    for (const ly of list) { A.set(green).multiplyScalar(0.35 + 0.65 * light).lerp(B.set(haze), ly.k); C.copy(A).lerp(B, 0.35 + ly.k * 0.4);
      for (let i = 0; i < ly.col.length / 6; i++) { const yTop = ly.pos[i * 6 + 4], fold = vnoise(i * 0.21, ly.k * 40, 3), shade = (0.84 + 0.2 * ((yTop - ly.base) / (ly.amp || 1))) * (0.9 + 0.2 * fold); ly.col.set([C.r, C.g, C.b, A.r * shade, A.g * shade, A.b * shade], i * 6); }
      ly.m.geometry.attributes.color.needsUpdate = true; }
  }
  return { group, tone };
}
