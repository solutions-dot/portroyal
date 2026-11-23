/* engine/blaze.js: a building on fire, for any game (rule 10). It began as Eventide's fire night (games/eventide/src/places.js, makeFire) and is
   made general here for Morant Bay, 1865 (the school-house and the court-house on 11 October; the chapel and the cottages at Stony Gut).
   Flames stand along the eaves and up through the roof, smoke rolls up and drifts with the wind, sparks rise, and an orange light falls on
   everything round. Nothing inside is shown. It runs itself while it is drawn and crackles while the camera is near.
     const B = blaze({ w: 20, d: 7, eave: 4.2, ridge: 6.5 });   // a box w along x, d along z, standing on y = 0, centred on the group's origin
     group.add(B); B.position.set(x, 0, z); B.rotation.y = ry;
     B.userData.setLevel(1);    // 1 burning hard, about 0.4 the roof fallen in, about 0.1 smoke only; 0 out (nothing drawn)
   A game that wants the light to reach far off can raise B.userData.light.distance. */
import * as THREE from 'three';
import { fireCrackle } from './flame.js';

let flameTex, puffTex;
function canvasTex(draw) { const c = document.createElement('canvas'); c.width = c.height = 64; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const flameMap = () => flameTex || (flameTex = canvasTex((x) => {   /* a tongue of flame: white-yellow at the root, orange, then gone at the tip */
  const g = x.createRadialGradient(32, 46, 2, 32, 40, 30); g.addColorStop(0, 'rgba(255,246,200,1)'); g.addColorStop(0.3, 'rgba(255,176,64,.9)'); g.addColorStop(0.65, 'rgba(232,82,20,.45)'); g.addColorStop(1, 'rgba(160,30,0,0)');
  x.fillStyle = g; x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(48, 22, 58, 40, 50, 56); x.quadraticCurveTo(32, 66, 14, 56); x.bezierCurveTo(6, 40, 16, 22, 32, 2); x.fill(); }));
const puffMap = () => puffTex || (puffTex = canvasTex((x) => { const g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.5, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }));

export function blaze({ w = 10, d = 6, eave = 3.5, ridge = 5.5, seed = 7, flames = 0, smoke = 14, sparks = 70, wind = [1, 0.3] } = {}) {
  let s0 = seed * 9301 + 49297; const r = () => ((s0 = (s0 * 9301 + 49297) % 233280) / 233280);
  const g = new THREE.Group(), fl = [], sm = [], nF = flames || Math.round(14 + (w + d) * 0.9);
  const light = new THREE.PointLight(0xff7a2a, 0, 40 + w * 2, 1.6); light.position.set(0, eave + 1, 0); g.add(light);
  for (let i = 0; i < nF; i++) {   /* a third along the eaves, the rest up through the roof toward the ridge */
    const roof = i % 3 !== 0, side = r() < 0.5 ? -1 : 1, x = (r() - 0.5) * w * 0.95, z = roof ? (r() - 0.5) * d * 0.6 : side * d / 2, y = roof ? eave + (ridge - eave) * (0.3 + r() * 0.7) : eave * (0.45 + r() * 0.4);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameMap(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    s.position.set(x, y, z); s.center.set(0.5, 0.1); s.userData = { y, k: (roof ? 2.2 : 1.4) + r() * 1.8, ph: r() * 6.28, low: !roof }; g.add(s); fl.push(s);
  }
  for (let i = 0; i < smoke; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap(), color: 0x3a3634, transparent: true, opacity: 0.5, depthWrite: false })); s.userData = { x: (r() - 0.5) * w * 0.8, z: (r() - 0.5) * d * 0.6, t: r() * 14, sp: 0.7 + r() * 0.6 }; g.add(s); sm.push(s); }
  const pos = new Float32Array(sparks * 3), sd = []; for (let i = 0; i < sparks; i++) sd.push({ x: (r() - 0.5) * w, z: (r() - 0.5) * d * 0.6, t: r() * 5, sp: 1.5 + r() * 2.5, dx: (r() - 0.5) * 2 });
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sp = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffc070, size: 0.16, transparent: true, depthWrite: false, fog: false })); sp.frustumCulled = false; g.add(sp);
  g.traverse((o) => { o.userData.noBatch = true; o.userData.noAudit = true; });   /* light, glow and smoke: nothing to stand on or bump into */
  let level = 0, last = -1; const snd = fireCrackle(), wp = new THREE.Vector3(), still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = (t, dt) => {
    light.intensity = level * (420 + Math.sin(t * 9) * 70 + Math.sin(t * 23) * 40);
    for (const s of fl) { const u = s.userData, on = level > 0.7 ? 1 : (u.low && level > 0.2 ? level : 0), k = u.k * on * (0.8 + 0.3 * Math.sin(t * 7 + u.ph) + 0.15 * Math.sin(t * 17 + u.ph * 2)); s.visible = k > 0.05; s.scale.set(k * 0.8, k * 1.5, 1); }
    for (const s of sm) { const u = s.userData; u.t = (u.t + dt * u.sp) % 14; const k = u.t / 14; s.visible = level > 0.02; s.position.set(u.x + k * wind[0] * 6, (level > 0.7 ? ridge : eave * 0.5) + u.t * 1.6, u.z + k * wind[1] * 6); const sc = 3 + u.t * 0.9; s.scale.set(sc, sc, 1); s.material.opacity = 0.5 * (1 - k) * Math.min(1, level * 2 + 0.1); }
    sp.visible = level > 0.3; for (let i = 0; i < sparks; i++) { const u = sd[i]; u.t = (u.t + dt) % 5; pos[i * 3] = u.x + u.dx * u.t; pos[i * 3 + 1] = (level > 0.7 ? eave + 1 : 1.2) + u.t * u.sp; pos[i * 3 + 2] = u.z; } sg.attributes.position.needsUpdate = true;
  };
  g.userData.light = light;
  g.userData.setLevel = (v) => { level = v; g.visible = v > 0; if (!g.visible) light.intensity = 0; };
  g.userData.tick = (t, dt = 1 / 60) => tick(t, dt);
  g.visible = false;
  /* it runs itself while drawn, as engine/flame.js does */
  fl[0].onBeforeRender = (rd, sc, cam) => {
    const t = performance.now() / 1000; if (t === last) return; const dt = last < 0 ? 1 / 60 : Math.min(0.1, t - last); last = t;
    if (!still) tick(t, dt); g.getWorldPosition(wp); if (cam && cam.position.distanceTo(wp) < 25 + w) snd.tick(t, true);
  };
  return g;
}
