/* engine/flame.js: a candle flame for every game (owner, 23 November 2026: "ensure the candles have a flame too that is realistic"). Before, a
   candle's flame was a small yellow ball, which read as nothing close up. A real candle flame is a teardrop about 3 cm tall: a bright pale core,
   an orange-yellow outer flame that is see-through at its edge, a little blue at its root by the wick, a dark wick standing in it, and a soft
   glow round it; it sways and stretches a little all the time.
     const f = candleFlame({ s: 1, seed: 2 });  f.position.set(x, topOfWax, z);  parent.add(f);
     It flickers by itself while it is drawn (still with reduced motion); f.userData.tick(seconds) or flickerAll(list, seconds) also work.
   It stands on y = 0 at the top of the wax. Light only (MeshBasic, additive), so it never needs a lamp; a game adds a point light if it wants one. */
import * as THREE from 'three';
import { crackle, AU } from './audio.js';

let glowTex = null;
function glow() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,214,140,0.9)'); g.addColorStop(0.25, 'rgba(255,170,80,0.35)'); g.addColorStop(1, 'rgba(255,140,40,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); glowTex = new THREE.CanvasTexture(c); glowTex.colorSpace = THREE.SRGBColorSpace; return glowTex;
}
const tear = (w, h) => new THREE.LatheGeometry([[0, 0], [w * 0.55, h * 0.06], [w, h * 0.25], [w * 0.92, h * 0.45], [w * 0.55, h * 0.72], [w * 0.18, h * 0.92], [0, h]].map(([a, b]) => new THREE.Vector2(a, b)), 10);
const add = (c, o) => ({ color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: o });
const M = { outer: new THREE.MeshBasicMaterial(add(0xff9a2a, 0.55)), core: new THREE.MeshBasicMaterial(add(0xfff2c8, 0.95)), blue: new THREE.MeshBasicMaterial(add(0x4a6cff, 0.45)), wick: new THREE.MeshBasicMaterial({ color: 0x1a1410 }) };
const G = { outer: tear(0.0065, 0.034), core: tear(0.0035, 0.018), blue: new THREE.SphereGeometry(0.004, 8, 6), wick: new THREE.CylinderGeometry(0.0009, 0.0011, 0.012, 5) };

export function candleFlame({ s = 1, seed = 1, glowSize = 0.14 } = {}) {
  const g = new THREE.Group(), sway = new THREE.Group(); g.add(sway);
  const wick = new THREE.Mesh(G.wick, M.wick); wick.position.y = 0.004; g.add(wick);
  const outer = new THREE.Mesh(G.outer, M.outer); outer.position.y = 0.003; sway.add(outer);
  const core = new THREE.Mesh(G.core, M.core); core.position.y = 0.005; sway.add(core);
  const blue = new THREE.Mesh(G.blue, M.blue); blue.position.y = 0.004; blue.scale.set(1, 0.7, 1); sway.add(blue);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.75 })); halo.scale.setScalar(glowSize); halo.position.y = 0.016; g.add(halo);
  g.traverse((o) => { o.userData.noBatch = true; o.userData.noAudit = true; o.userData.guide = true; o.renderOrder = 3; });   /* light, not scenery to merge or check */
  g.scale.setScalar(s); g.userData.candle = true;
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  g.userData.tick = (t) => {   /* a slow sway and a quick small stretch, never in step with the next candle */
    const a = t + seed * 1.37, k = 1 + 0.07 * Math.sin(a * 11.3) + 0.05 * Math.sin(a * 23.7 + 1.1);
    sway.scale.set(1 - (k - 1) * 0.6, k, 1 - (k - 1) * 0.6); sway.rotation.z = Math.sin(a * 1.9) * 0.08 + Math.sin(a * 7.1) * 0.03; sway.rotation.x = Math.sin(a * 1.3 + 2) * 0.05;
    halo.material.opacity = 0.62 + 0.13 * Math.sin(a * 9.7);
  };
  outer.onBeforeRender = () => { if (!reduced) g.userData.tick(performance.now() / 1000); };   /* it flickers by itself while drawn */
  return g;
}
/* ---------- a wood fire (Port Royal's tavern hearth, the owner's choice, 23 November 2026: "the fireplace here should be the same fireplace in
   any other game.. i like the fire effect and sound here"). Tongues of flame painted as soft teardrops (pale yellow at the heart, orange, then
   red at the edge), each two crossed sheets that glow over what is behind them, each flickering on its own; on a bed of red embers, charred
   logs and grey ash. hearthFire({ s, bed }) stands on y = 0, about 0.7 m tall at s = 1 (bed: false for a fire that brings its own logs and stones);
   it moves and crackles by itself while drawn, and f.userData.tick(seconds) returns a flicker for a game's fire light.
   fireCrackle() returns { tick(seconds, near) }: the crackle of the tavern fire (engine/audio.js crackle), only while near is true. ---------- */
let tongueTex = null;
function tongueMap() {
  if (tongueTex) return tongueTex;
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const x = c.getContext('2d'), g1 = x.createRadialGradient(32, 96, 2, 32, 84, 44);
  g1.addColorStop(0, 'rgba(255,250,210,1)'); g1.addColorStop(0.25, 'rgba(255,214,90,0.95)'); g1.addColorStop(0.55, 'rgba(255,130,30,0.75)'); g1.addColorStop(0.85, 'rgba(200,40,10,0.25)'); g1.addColorStop(1, 'rgba(160,20,0,0)');
  x.fillStyle = g1; x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(40, 40, 62, 70, 58, 100); x.bezierCurveTo(56, 122, 8, 122, 6, 100); x.bezierCurveTo(2, 70, 24, 40, 32, 2); x.fill();
  tongueTex = new THREE.CanvasTexture(c); tongueTex.colorSpace = THREE.SRGBColorSpace; return tongueTex;
}
export function hearthFire({ s = 1, bed = true, seed = 0 } = {}) {
  const fire = new THREE.Group(), tm = new THREE.MeshBasicMaterial({ map: tongueMap(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }), tg = new THREE.PlaneGeometry(1, 1); tg.translate(0, 0.5, 0);
  const flames = new THREE.Group(); flames.position.y = 0.1; fire.add(flames); fire.userData.tongues = [];
  for (const [dx, dz, w, h] of [[0, 0, 0.36, 0.66], [0.02, -0.16, 0.26, 0.48], [-0.02, 0.17, 0.28, 0.54], [0.05, 0.07, 0.2, 0.38], [-0.04, -0.07, 0.2, 0.42], [0, 0.28, 0.16, 0.28], [0, -0.28, 0.15, 0.26]]) {
    const tn = new THREE.Group(); tn.position.set(dx, 0, dz); tn.userData.wh = [w, h]; tn.scale.set(w, h, w);
    for (const ry of [0.3, 0.3 + Math.PI / 2]) { const s1 = new THREE.Mesh(tg, tm); s1.rotation.y = ry; tn.add(s1); }
    flames.add(tn); fire.userData.tongues.push(tn);
  }
  if (bed) {
    const emberM = new THREE.MeshBasicMaterial({ color: 0xff5a1a }), emberD = new THREE.MeshBasicMaterial({ color: 0xa82a0c }), char = new THREE.MeshStandardMaterial({ color: 0x1c1512, roughness: 1 });
    for (let i = 0; i < 16; i++) { const e = new THREE.Mesh(new THREE.DodecahedronGeometry(0.025 + (i % 3) * 0.008, 0), i % 3 ? emberM : emberD); e.position.set(((i * 37) % 11 - 5) * 0.012, 0.075 + (i % 2) * 0.012, ((i * 53) % 17 - 8) * 0.03); e.rotation.set(i, i * 2, i * 3); fire.add(e); }
    for (const [dz, r, y] of [[-0.2, 0.3, 0.09], [0.15, -0.4, 0.09], [0, 1.2, 0.09], [0.02, 0.9, 0.17], [-0.05, -0.8, 0.16]]) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.5, 7), char); lg.position.set(0, y, dz); lg.rotation.set(Math.PI / 2, 0, r); fire.add(lg); }
    const ash = new THREE.Mesh(new THREE.CircleGeometry(0.42, 14), new THREE.MeshStandardMaterial({ color: 0x4a443e, roughness: 1 })); ash.position.set(-0.02, 0.062, 0); ash.rotation.x = -Math.PI / 2; ash.scale.set(0.6, 1.1, 1); fire.add(ash);
  }
  fire.traverse((o) => { o.userData.noBatch = true; });
  fire.scale.setScalar(s); fire.userData.fire = true;
  fire.userData.tick = (t) => {   /* each tongue stretches, sways and turns on its own */
    const T = fire.userData.tongues;
    for (let i = 0; i < T.length; i++) { const tn = T[i], [w, h] = tn.userData.wh, a = t * (5 + i * 0.9) + i * 1.7 + seed, k2 = 0.82 + 0.16 * Math.sin(a) + 0.1 * Math.sin(a * 2.3 + i);
      tn.scale.set(w * (1.05 - (k2 - 0.82) * 0.5), h * k2, w * (1.05 - (k2 - 0.82) * 0.5)); tn.rotation.z = Math.sin(a * 0.7) * 0.07; tn.rotation.y = Math.sin(a * 0.31) * 0.4; }
    return 0.85 + Math.sin(t * 11.1) * 0.08 + Math.sin(t * 27) * 0.07;   /* the light's flicker, for a game's fire light (intensity times this) */
  };
  /* it runs itself while it is drawn (as engine/sea.js does): the flames move, and it crackles while the camera is within 7 m. A game that ticks it
     itself (Port Royal, for its fire light) does no harm: a second tick in the same frame changes nothing. */
  const snd = fireCrackle(), wp = new THREE.Vector3(), still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  fire.userData.tongues[0].children[0].onBeforeRender = (r, sc, cam) => {
    const t = performance.now() / 1000; if (t === fire.userData.lastT) return; fire.userData.lastT = t;
    if (!still) fire.userData.tick(t); fire.getWorldPosition(wp); snd.tick(t, cam && cam.position.distanceTo(wp) < 7);
  };
  return fire;
}
export function fireCrackle() {
  let at = 0;
  return { tick(t, near = true) { if (!near || t < at || !AU.ctx || !AU.on || AU.ctx.state !== 'running') return; at = t + 0.05 + Math.random() * 0.35; crackle(); } };
}

/* many candles as one set (a chandelier room): the same flame, drawn as instanced copies (two draw calls for the flames and one for their glow),
   each swaying on its own. pos is a flat [x, y, z, ...] list of where each flame stands (the top of its wax). The set flickers by itself while
   drawn; set.userData.on(lit) shows or hides it. */
export function candleSet(pos, { s = 1, glowSize = 0.16 } = {}) {
  const n = pos.length / 3, g = new THREE.Group(), outer = new THREE.InstancedMesh(G.outer, M.outer, n), core = new THREE.InstancedMesh(G.core, M.core, n);
  const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos.map((v, i) => (i % 3 === 1 ? v + 0.016 * s : v)), 3));
  const halo = new THREE.Points(gg, new THREE.PointsMaterial({ map: glow(), size: glowSize * s, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.75 }));
  for (const o of [outer, core, halo]) { o.frustumCulled = false; o.renderOrder = 3; o.userData.noBatch = true; o.userData.noAudit = true; o.userData.guide = true; g.add(o); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
  const tick = (t) => {
    for (let i = 0; i < n; i++) { const a = t + i * 1.37, k = 1 + 0.07 * Math.sin(a * 11.3) + 0.05 * Math.sin(a * 23.7 + 1.1);
      q.setFromEuler(e.set(Math.sin(a * 1.3 + 2) * 0.05, 0, Math.sin(a * 1.9) * 0.08 + Math.sin(a * 7.1) * 0.03)); sc.set((1 - (k - 1) * 0.6) * s, k * s, (1 - (k - 1) * 0.6) * s);
      p.set(pos[i * 3], pos[i * 3 + 1] + 0.003 * s, pos[i * 3 + 2]); m4.compose(p, q, sc); outer.setMatrixAt(i, m4); p.y += 0.002 * s; core.setMatrixAt(i, m4.compose(p, q, sc)); }
    outer.instanceMatrix.needsUpdate = true; core.instanceMatrix.needsUpdate = true;
  };
  tick(0);
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches; let last = -1;
  outer.onBeforeRender = () => { const t = performance.now() / 1000; if (reduced || t === last) return; last = t; tick(t); };
  g.userData.tick = tick; g.userData.on = (lit) => (g.visible = lit); g.userData.candles = n;
  return g;
}
/* tick every candle flame in a list */
export function flickerAll(list, t) { for (const f of list) if (f && f.userData && f.userData.tick) f.userData.tick(t); }
