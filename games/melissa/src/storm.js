/* games/melissa/src/storm.js: the weather you can see. Rain, blown leaves, loose zinc sheets that fly, and plants that sway.
   Everything is drawn on the graphics card from a few numbers, so a storm costs almost nothing on a phone:
   - rain: one set of short lines. Their places come from a seed in the vertex shader, wrapped round the camera, so nothing is moved by the CPU.
   - leaves: one set of points sailing sideways in the wind.
   - flying sheets: a handful of real zinc meshes that glide along arcs (used only in the big moments).
   - sway: plants marked with swayable() lean and shake in the wind (swayTick). */
import * as THREE from 'three';
import { zincSheet } from './houses.js';

const RAIN_V = `attribute vec4 seed; attribute float end; uniform float uTime; uniform vec3 uCam; uniform vec2 uWind; uniform float uLen; uniform float uDens; uniform vec3 uMask; varying float vA;
void main(){ float R = 15.0, H = 13.0, fall = 17.0 + seed.y * 7.0;
  float wx = uCam.x + mod(seed.x * 2.0 * R - uCam.x + R, 2.0 * R) - R, wz = uCam.z + mod(seed.z * 2.0 * R - uCam.z + R, 2.0 * R) - R;
  float y = mod(seed.y * H * 5.0 - uTime * fall, H);
  vec3 p = vec3(wx + uWind.x * (H - y) * 0.32, y, wz + uWind.y * (H - y) * 0.32);
  vec3 d = normalize(vec3(uWind.x * 0.32, -1.0, uWind.y * 0.32));
  p -= d * uLen * end;
  vec4 mv = modelViewMatrix * vec4(p, 1.0); float dist = length(mv.xyz);
  vA = (seed.w < uDens ? 1.0 : 0.0) * (1.0 - smoothstep(uMask.z - 0.6, uMask.z + 0.6, distance(p.xz, uMask.xy))) * smoothstep(0.7, 2.5, dist) * (1.0 - smoothstep(9.0, 15.0, dist)) * (end > 0.5 ? 0.35 : 1.0);
  gl_Position = projectionMatrix * mv; }`;
const RAIN_F = `uniform float uAlpha; uniform vec3 uTint; varying float vA; void main(){ gl_FragColor = vec4(uTint, vA * uAlpha); }`;
const LEAF_V = `attribute vec4 seed; uniform float uTime; uniform vec3 uCam; uniform vec2 uWind; uniform float uSize; uniform float uDens; varying float vK; varying float vA;
void main(){ float R = 20.0; vec2 dir = normalize(uWind + vec2(0.001)); float sp = 7.0 + seed.y * 9.0 + length(uWind) * 6.0;
  float t = uTime * sp * 0.2 + seed.x * 40.0;
  float wx = uCam.x + mod(seed.x * 2.0 * R - uCam.x + dir.x * uTime * sp + R, 2.0 * R) - R, wz = uCam.z + mod(seed.z * 2.0 * R - uCam.z + dir.y * uTime * sp + R, 2.0 * R) - R;
  float y = 0.4 + seed.y * 7.0 + sin(t) * 0.8;
  vec4 mv = modelViewMatrix * vec4(wx, y, wz, 1.0); float dist = length(mv.xyz);
  vA = (seed.w < uDens ? 1.0 : 0.0) * smoothstep(1.0, 3.0, dist) * (1.0 - smoothstep(14.0, 20.0, dist)); vK = seed.z;
  gl_PointSize = uSize * (0.6 + seed.w) * 90.0 / max(dist, 1.0); gl_Position = projectionMatrix * mv; }`;
const LEAF_F = `varying float vK; varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; if (abs(c.x) * 1.6 + abs(c.y) > 0.5) discard; vec3 col = mix(vec3(0.22, 0.34, 0.14), vec3(0.4, 0.3, 0.16), vK); gl_FragColor = vec4(col, vA); }`;

export function makeStorm(scene, camera, { count = 1700, leaves = 260 } = {}) {
  const S = { wind: new THREE.Vector2(0.6, 0.2), rain: 0, dens: 1, leaf: 0, speed: 1 };
  const mk = (n, vs, fs, uniforms, mode) => {
    const g = new THREE.BufferGeometry(), seeds = new Float32Array(n * (mode === 'lines' ? 2 : 1) * 4), ends = new Float32Array(n * 2), pos = new Float32Array(n * (mode === 'lines' ? 2 : 1) * 3);
    for (let i = 0; i < n; i++) { const a = Math.random(), b = Math.random(), c = Math.random(), d = Math.random(); for (let k = 0; k < (mode === 'lines' ? 2 : 1); k++) { const o = (i * (mode === 'lines' ? 2 : 1) + k) * 4; seeds.set([a, b, c, d], o); if (mode === 'lines') ends[i * 2 + k] = k; } }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('seed', new THREE.BufferAttribute(seeds, 4)); if (mode === 'lines') g.setAttribute('end', new THREE.BufferAttribute(ends, 1));
    const m = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms, transparent: true, depthWrite: false });
    const o = mode === 'lines' ? new THREE.LineSegments(g, m) : new THREE.Points(g, m); o.frustumCulled = false; o.renderOrder = 8; o.visible = false; scene.add(o); return o; };
  const ru = { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uWind: { value: S.wind }, uLen: { value: 0.9 }, uMask: { value: new THREE.Vector3(0, 0, 1e5) }, uDens: { value: 1 }, uAlpha: { value: 0.0 }, uTint: { value: new THREE.Color(0.78, 0.84, 0.9) } };
  const lu = { uTime: ru.uTime, uCam: ru.uCam, uWind: ru.uWind, uSize: { value: 1 }, uDens: { value: 1 } };
  const rain = mk(count, RAIN_V, RAIN_F, ru, 'lines'), leaf = mk(leaves, LEAF_V, LEAF_F, lu, 'points');
  /* flying zinc sheets: a pool, each with its own arc */
  const sheets = []; for (let i = 0; i < 5; i++) { const sh = zincSheet({ len: 2.2, curl: 0.35, seed: 40 + i }); sh.visible = false; sh.userData.noBatch = true; scene.add(sh); sheets.push({ o: sh, t: 1, dur: 1, a: new THREE.Vector3(), b: new THREE.Vector3(), spin: 0 }); }
  S.rain = rain; S.leaves = leaf; S.sheets = sheets;
  S.set = ({ rain: r, wind, leaves: l, dens }) => { if (r !== undefined) { ru.uAlpha.value = r * 0.62; rain.visible = r > 0.01; } if (dens !== undefined) { ru.uDens.value = lu.uDens.value = dens; } if (wind) S.wind.set(wind[0], wind[1]); if (l !== undefined) { leaf.visible = l > 0.01; lu.uDens.value = Math.min(1, l); } };
  S.mask = (cx, cz, r) => { ru.uMask.value.set(cx, cz, r); };
  S.throwSheet = (from, to, dur = 2.4) => { const s = sheets.find((q) => q.t >= 1); if (!s) return; s.t = 0; s.dur = dur; s.a.copy(from); s.b.copy(to); s.spin = (Math.random() - 0.5) * 6; s.o.visible = true; s.o.position.copy(from); };
  S.tick = (dt, t) => {
    ru.uTime.value = t; ru.uCam.value.copy(camera.position);
    for (const s of sheets) { if (s.t >= 1) continue; s.t += dt / s.dur; const k = Math.min(1, s.t); s.o.position.lerpVectors(s.a, s.b, k); s.o.position.y += Math.sin(k * Math.PI) * 3.2; s.o.rotation.set(k * s.spin * 1.7, k * s.spin * 2.3, k * s.spin); if (k >= 1) s.o.visible = false; }
  };
  S.clear = () => { rain.visible = leaf.visible = false; ru.uAlpha.value = 0; for (const s of sheets) { s.t = 1; s.o.visible = false; } };
  return S;
}

/* ---------- plants that sway in the wind ---------- */
export function swayable(o, amp = 0.05, ph = 0) { o.userData.noBatch = true; o.userData.sway = { amp, ph: ph || Math.random() * 6.28, rx: o.rotation.x, rz: o.rotation.z }; return o; }
export function collectSway(group) { const out = []; group.traverse((o) => { if (o.userData && o.userData.sway) out.push(o); }); return out; }
/* k: how hard the wind blows (0 still, 1 a hurricane). Plants lean away from the wind and shake faster as it grows. */
export function swayTick(list, t, k, wind) {
  const wx = wind ? wind[0] : 0.6, wz = wind ? wind[1] : 0.2;
  for (const o of list) { const s = o.userData.sway, gust = 0.55 + 0.45 * Math.sin(t * (0.7 + k) + s.ph), f = t * (1.4 + k * 5) + s.ph;
    const lean = k * 0.2 * gust, shake = Math.sin(f) * s.amp * (0.25 + k * 1.6) + Math.sin(f * 2.3 + 1) * s.amp * k * 0.6;
    o.rotation.z = s.rz + (-wx * lean + shake) * 1.0; o.rotation.x = s.rx + (wz * lean + shake * 0.5); }
}
