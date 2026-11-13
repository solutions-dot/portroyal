/* games/garvey/src/main.js: Marcus Garvey. First test scene: a print shop in Kingston, Jamaica, about 1907.
   Built from games/_template. The movement, talking and talk-button code is still the template's small version;
   it moves into engine/ after the Port Royal work has merged (see docs/games/garvey.md, "Working alongside the Port Royal chat").
   The two people and their lines are placeholders for testing the pipeline. Both are made up. */
import * as THREE from 'three';
import { CL, mixers, grounded, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, cue, AU, setG, tone, noiseHit, gullCry, chirp, shipCreak } from '../../../engine/audio.js';
import { model, prefetch, onLoadFail } from '../../../engine/loader.js';

const $ = (id) => document.getElementById(id);
soundPref('garvey-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light ---------- */
const canvas = $('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x2a2118);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 100);
const hemi = new THREE.HemisphereLight(0xfff4e0, 0x7a6048, 1.25); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d0, 1.7); sun.position.set(6, 7, 5); scene.add(sun);
const lampLight = new THREE.PointLight(0xffcf8a, 7, 9, 2); lampLight.position.set(0.2, 2.9, -0.3); scene.add(lampLight);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- textures drawn in code (no image files) ---------- */
/* Every texture is drawn in its own small coordinates (w by h) but on a bigger canvas, so walls, wood, signs and paper stay sharp up close.
   TEXQ is how many times bigger: 2 on a computer, 1.5 on a phone or tablet, 1 on a device that says it has little memory. */
const TEXQ = (() => { const mobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent), mem = navigator.deviceMemory || 4; return mem <= 2 ? 1 : mobile ? 1.5 : 2; })();
let TEXMS = 0;   /* milliseconds spent drawing textures (shown by the dev load test) */
function cv(w, h, draw, repeat) {
  const t0 = performance.now(); const c = document.createElement('canvas'); c.width = Math.round(w * TEXQ); c.height = Math.round(h * TEXQ); const g2 = c.getContext('2d'); g2.scale(c.width / w, c.height / h); draw(g2, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso;
  if (repeat) t.repeat.set(repeat[0], repeat[1]); TEXMS += performance.now() - t0; return t;
}
function grain(x, w, h, amt) { const d = x.getImageData(0, 0, x.canvas.width, x.canvas.height); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * amt; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n * 0.8; } x.putImageData(d, 0, 0); }
function plankTex(rgb, planks, repeat) {   /* boards that run up and down the picture */
  return cv(256, 256, (x, w, h) => { const pw = w / planks;
    for (let p = 0; p < planks; p++) { const v = (Math.random() - 0.5) * 24; x.fillStyle = `rgb(${rgb[0] + v | 0},${rgb[1] + v | 0},${rgb[2] + v * 0.8 | 0})`; x.fillRect(p * pw, 0, pw, h);
      x.strokeStyle = 'rgba(30,18,10,0.22)'; x.lineWidth = 1; for (let g = 0; g < 7; g++) { const gx = p * pw + 2 + Math.random() * (pw - 4); x.beginPath(); x.moveTo(gx, 0); x.bezierCurveTo(gx + 2, h * 0.3, gx - 2, h * 0.6, gx + 1, h); x.stroke(); }
      x.fillStyle = 'rgba(15,9,5,0.7)'; x.fillRect(p * pw, 0, 2, h); if (Math.random() < 0.5) { x.fillStyle = 'rgba(25,14,8,0.5)'; x.beginPath(); x.ellipse(p * pw + pw / 2, Math.random() * h, 2.5, 5, 0, 0, 7); x.fill(); } }
    grain(x, w, h, 16); }, repeat);
}
function plasterTex() {   /* limewash above, a darker painted band at the bottom of the wall, with stains */
  return cv(512, 512, (x, w, h) => { x.fillStyle = '#dccfb0'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(${90 + Math.random() * 40 | 0},${74 + Math.random() * 30 | 0},50,${0.012 + Math.random() * 0.03})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h * 0.8, 20 + Math.random() * 80, 10 + Math.random() * 50, Math.random() * 3, 0, 7); x.fill(); }
    x.fillStyle = '#7d8a6a'; x.fillRect(0, h * 0.76, w, h * 0.24); x.fillStyle = 'rgba(40,30,20,0.35)'; x.fillRect(0, h * 0.76, w, 3);
    const g = x.createLinearGradient(0, h * 0.7, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(30,22,14,0.35)'); x.fillStyle = g; x.fillRect(0, h * 0.7, w, h * 0.3); grain(x, w, h, 14); });
}
function caseTex() {   /* a type case: rows of small boxes full of metal letters */
  return cv(512, 256, (x, w, h) => { x.fillStyle = '#3a2c20'; x.fillRect(0, 0, w, h);
    const rows = 7, rh = (h - 12) / rows; for (let r = 0; r < rows; r++) { let cx = 6; while (cx < w - 10) { const bw = (r < 3 ? 26 : 34) + Math.random() * 16; x.fillStyle = '#17120e'; x.fillRect(cx, 6 + r * rh, Math.min(bw, w - 6 - cx) - 3, rh - 3);
        for (let k = 0; k < 26; k++) { x.fillStyle = `rgba(${150 + Math.random() * 60 | 0},${150 + Math.random() * 60 | 0},${150 + Math.random() * 50 | 0},0.8)`; x.fillRect(cx + 2 + Math.random() * (bw - 8), 8 + r * rh + Math.random() * (rh - 8), 2, 4); } cx += bw; } } });
}
function stoneTex() { return cv(256, 256, (x, w, h) => { x.fillStyle = '#9a9a94'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${60 + Math.random() * 60 | 0},${60 + Math.random() * 60 | 0},${58 + Math.random() * 50 | 0},0.12)`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 6 + Math.random() * 20, Math.random() * 3, 0, 7); x.fill(); } grain(x, w, h, 20); }); }
function formeTex() { return cv(256, 192, (x, w, h) => { x.fillStyle = '#26231f'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(190,190,180,0.55)'; for (let r = 0; r < 14; r++) { let cx = 8; while (cx < w - 12) { const bw = 4 + Math.random() * 10; x.fillRect(cx, 10 + r * 12, bw, 5); cx += bw + 2 + Math.random() * 3; } } x.strokeStyle = '#6b6a66'; x.lineWidth = 3; x.strokeRect(2, 2, w - 4, h - 4); }); }
function sheetTex(word, tilt) {   /* a printed sheet: a big heading, lines of small type, a rule */
  return cv(256, 340, (x, w, h) => { x.fillStyle = '#efe7d2'; x.fillRect(0, 0, w, h); x.fillStyle = '#1d1a16'; x.textAlign = 'center'; x.font = '700 ' + (word.length > 6 ? 34 : 44) + 'px Georgia, serif'; x.fillText(word, w / 2, 70);
    x.fillRect(30, 90, w - 60, 3); for (let i = 0; i < 12; i++) { const lw = (w - 60) * (0.6 + Math.random() * 0.4); x.fillRect((w - lw) / 2, 120 + i * 17, lw, 4); } x.fillRect(30, h - 36, w - 60, 3); grain(x, w, h, 12); if (tilt) x.rotate(0); });
}
function windowViewTex() { return cv(256, 320, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#b9dcef'); g.addColorStop(0.55, '#f1f0dc'); g.addColorStop(1, '#d9cfa6'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${40 + Math.random() * 40 | 0},${110 + Math.random() * 60 | 0},${40 + Math.random() * 30 | 0},0.9)`; x.beginPath(); x.ellipse(Math.random() * w, h * 0.55 + Math.random() * h * 0.45, 20 + Math.random() * 30, 14 + Math.random() * 22, 0, 0, 7); x.fill(); } }); }
function streetTex() { return cv(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#a9d4ea'); g.addColorStop(0.45, '#e6eede'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#d8c89a'; x.fillRect(0, 90, w, 110); x.fillStyle = '#b97a5a'; x.fillRect(40, 70, 200, 130); x.fillStyle = '#e8d9a8'; x.fillRect(260, 60, 220, 140);
    x.fillStyle = '#3f6b4a'; for (let i = 0; i < 4; i++) x.fillRect(60 + i * 46, 100, 26, 70); x.fillStyle = '#3f6b4a'; for (let i = 0; i < 4; i++) x.fillRect(290 + i * 50, 95, 28, 80);
    x.fillStyle = '#8a7656'; x.fillRect(0, 200, w, 56); grain(x, w, h, 10); }); }
function louverTex() { return cv(128, 256, (x, w, h) => { x.fillStyle = '#4f6b4c'; x.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 12) { x.fillStyle = '#6c8967'; x.fillRect(4, y, w - 8, 8); x.fillStyle = 'rgba(0,0,0,0.45)'; x.fillRect(4, y + 8, w - 8, 3); } x.strokeStyle = '#2f4430'; x.lineWidth = 5; x.strokeRect(2, 2, w - 4, h - 4); }); }
function patchTex() { return cv(128, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,240,200,0.9)'); g.addColorStop(1, 'rgba(255,240,200,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(w / 2 - 2, 0, 4, h); x.fillRect(0, h * 0.34, w, 4); }); }

/* Textures that are asked for again and again are drawn once and shared (the GPU keeps one copy). */
const memo = (fn, key) => { const m = new Map(); return (...a) => { const k = key ? key(...a) : 0; if (!m.has(k)) m.set(k, fn(...a)); return m.get(k); }; };
caseTex = memo(caseTex); stoneTex = memo(stoneTex); formeTex = memo(formeTex); sheetTex = memo(sheetTex, (word) => word); windowViewTex = memo(windowViewTex); streetTex = memo(streetTex); louverTex = memo(louverTex); patchTex = memo(patchTex);

/* ---------- materials and little builders ---------- */
const std = (map, rough = 0.9, extra) => new THREE.MeshStandardMaterial({ map, roughness: rough, ...(extra || {}) });
const solid = (color, rough = 0.85, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const room = new THREE.Group(); scene.add(room);
function mesh(geo, m, x, y, z, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (parent || room).add(o); return o; }
const BOXGEO = new Map();
function boxGeo(w, h, d, textured) {   /* a textured box gets its UVs scaled by its size, so grain, bricks and stone keep one size on every face instead of stretching across a bench or a wall */
  const key = w + ',' + h + ',' + d + (textured ? 't' : ''); let g = BOXGEO.get(key); if (g) return g;
  g = new THREE.BoxGeometry(w, h, d);
  if (textured) { const uv = g.attributes.uv, T = 1.2, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]; for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / T, uv.getY(i) * dims[f][1] / T); } }
  BOXGEO.set(key, g); return g; }
const box = (w, h, d, m, x, y, z, parent) => mesh(boxGeo(w, h, d, !!m.map), m, x, y, z, parent);
const cyl = (r0, r1, h, m, x, y, z, parent, seg = 18) => mesh(new THREE.CylinderGeometry(r0, r1, h, seg), m, x, y, z, parent);

/* ---------- the room: 9 m wide, 7 m deep, high ceiling for the heat ---------- */
const W = 9, D = 7, H = 3.8, X0 = -W / 2, X1 = W / 2, Z0 = -D / 2, Z1 = D / 2, DOOR = { x: -0.5, w: 1.6, h: 2.5 };
const WALLS = [];   /* [x0, z0, x1, z1] boxes the player cannot enter */
const wood = std(plankTex([112, 82, 54], 4, [1, 1]), 0.85), woodDark = std(plankTex([66, 48, 33], 3, [1, 1]), 0.85), beam = solid(0x3a2a1d, 0.95), iron = solid(0x3b3d42, 0.6, 0.12), brass = solid(0xc29a45, 0.45, 0.25), paper = solid(0xe6dcc2, 0.95);
mesh(new THREE.PlaneGeometry(W, D), std(plankTex([128, 96, 64], 7, [W / 1.05, D / 2]), 0.85), 0, 0, 0).rotation.x = -Math.PI / 2;
mesh(new THREE.PlaneGeometry(W, D), std(plankTex([78, 58, 40], 8, [W / 1.2, D / 2]), 0.95), 0, H, 0).rotation.x = Math.PI / 2;
const plasterT = plasterTex();
function wall(w, cx, cz, ry) { const t = plasterT.clone(); t.needsUpdate = true; t.repeat.set(w / 3.4, 1); t.wrapT = THREE.ClampToEdgeWrapping; const p = mesh(new THREE.PlaneGeometry(w, H), std(t, 1), cx, H / 2, cz); p.rotation.y = ry; return p; }
wall(W, 0, Z0, 0); wall(D, X0, 0, Math.PI / 2); wall(D, X1, 0, -Math.PI / 2);
const dl = DOOR.x - DOOR.w / 2, dr = DOOR.x + DOOR.w / 2;
wall(dl - X0, (X0 + dl) / 2, Z1, Math.PI); wall(X1 - dr, (dr + X1) / 2, Z1, Math.PI);
box(DOOR.w + 0.3, H - DOOR.h, 0.14, solid(0xdccfb0, 1), DOOR.x, (DOOR.h + H) / 2, Z1 - 0.07);
for (const x of [dl - 0.06, dr + 0.06]) box(0.14, DOOR.h, 0.18, beam, x, DOOR.h / 2, Z1 - 0.09);
box(DOOR.w + 0.34, 0.16, 0.18, beam, DOOR.x, DOOR.h + 0.08, Z1 - 0.09);
for (let z = Z0 + 0.5; z < Z1; z += 0.95) box(0.14, 0.2, W, beam, 0, H - 0.1, z).rotation.y = Math.PI / 2;   /* ceiling joists */
box(0.3, 0.34, D, beam, -2.2, H - 0.3, 0); box(0.3, 0.34, D, beam, 2.2, H - 0.3, 0);
for (const [w, cx, cz, ry] of [[W, 0, Z0, 0], [D, X0, 0, Math.PI / 2], [D, X1, 0, -Math.PI / 2]]) { const c = Math.cos(ry), s = Math.sin(ry); box(w, 0.1, 0.05, beam, cx + s * 0.03, 0.05, cz + c * 0.03).rotation.y = ry; }   /* skirting boards */
/* outside, seen through the door: a sunlit street */
mesh(new THREE.PlaneGeometry(16, 5.6), new THREE.MeshBasicMaterial({ map: streetTex() }), DOOR.x, 2.3, Z1 + 3.4).rotation.y = Math.PI;
mesh(new THREE.PlaneGeometry(16, 3.4), new THREE.MeshBasicMaterial({ color: 0xcdb98a }), DOOR.x, 0.01, Z1 + 1.7).rotation.x = -Math.PI / 2;
/* windows: bright views with louvred shutters folded back, and a patch of sun on the floor */
const viewM = new THREE.MeshBasicMaterial({ map: windowViewTex() }), louverM = new THREE.MeshBasicMaterial({ map: louverTex() }), patchM = new THREE.MeshBasicMaterial({ map: patchTex(), transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
function windowOn(side, pos, sill, w, h) {   /* side: 'L' left wall, 'R' right wall, 'B' back wall */
  const g = new THREE.Group(); const ry = side === 'L' ? Math.PI / 2 : side === 'R' ? -Math.PI / 2 : 0;
  g.position.set(side === 'L' ? X0 : side === 'R' ? X1 : pos, 0, side === 'B' ? Z0 : pos); g.rotation.y = ry; room.add(g);
  const y = sill + h / 2; mesh(new THREE.PlaneGeometry(w, h), viewM, 0, y, 0.012, g);
  for (const dx of [-w / 2, w / 2]) box(0.09, h + 0.12, 0.12, beam, dx, y, 0.05, g); for (const dy of [sill - 0.03, sill + h + 0.03]) box(w + 0.2, 0.09, 0.12, beam, 0, dy, 0.05, g); box(0.05, h, 0.06, beam, 0, y, 0.04, g); box(w, 0.04, 0.06, beam, 0, y + h * 0.1, 0.04, g);
  box(w + 0.3, 0.05, 0.22, wood, 0, sill - 0.07, 0.1, g);
  for (const dx of [-(w / 2 + w / 4 + 0.05), w / 2 + w / 4 + 0.05]) mesh(new THREE.PlaneGeometry(w / 2, h), louverM, dx, y, 0.02, g);
  if (side !== 'B') { const p = mesh(new THREE.PlaneGeometry(w * 0.9, 2.4), patchM, 0, 0.012, 1.5, g); p.rotation.x = -Math.PI / 2; }
}
windowOn('L', -1.7, 0.9, 1.3, 1.7); windowOn('L', 1.3, 0.9, 1.3, 1.7); windowOn('R', 0.2, 0.9, 1.3, 1.7); windowOn('B', -2.65, 1.6, 1.6, 1.3);
{ const p = mesh(new THREE.PlaneGeometry(1.5, 3.0), patchM, DOOR.x + 0.1, 0.013, Z1 - 1.5); p.rotation.x = -Math.PI / 2; }

/* ---------- the things in the shop ---------- */
/* a type stand: a cabinet with a sloping top holding a case of metal type */
function typeStand(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); room.add(g);
  box(1.12, 0.72, 0.6, woodDark, 0, 0.36, 0, g); const t = 0.42;
  const slab = box(1.12, 0.05, 0.66, wood, 0, 0.9, 0, g); slab.rotation.x = t;
  const top = mesh(new THREE.PlaneGeometry(1.06, 0.6), std(caseTex(), 0.6), 0, 0.93, 0.0, g); top.rotation.x = -Math.PI / 2 + t; top.position.y += 0.02;
  for (const dx of [-0.52, 0.52]) box(0.05, 0.14, 0.62, wood, dx, 0.88, 0, g).rotation.x = t;
  WALLS.push([x - 0.7, z - 0.45, x + 0.7, z + 0.45]);
}
typeStand(-3.4, -2.95); typeStand(-1.9, -2.95);
/* the imposing stone: a flat table where the page of type is locked into its frame */
{ const g = new THREE.Group(); g.position.set(-0.55, 0, -0.65); room.add(g);
  box(1.9, 0.08, 0.95, std(stoneTex(), 0.7), 0, 0.93, 0, g);
  for (const [dx, dz] of [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]]) box(0.12, 0.9, 0.12, woodDark, dx, 0.45, dz, g);
  box(1.7, 0.1, 0.07, woodDark, 0, 0.55, -0.4, g); box(1.7, 0.1, 0.07, woodDark, 0, 0.55, 0.4, g);
  mesh(new THREE.PlaneGeometry(0.72, 0.52), std(formeTex(), 0.5), -0.2, 0.975, 0.05, g).rotation.x = -Math.PI / 2;
  for (const [w, d, dx, dz] of [[0.78, 0.04, -0.2, -0.22], [0.78, 0.04, -0.2, 0.32], [0.04, 0.58, -0.58, 0.05], [0.04, 0.58, 0.18, 0.05]]) box(w, 0.04, d, iron, dx, 0.985, dz, g);
  box(0.3, 0.05, 0.2, paper, 0.62, 0.99, 0.15, g);
  WALLS.push([-0.55 - 1.1, -0.65 - 0.6, -0.55 + 1.1, -0.65 + 0.6]); }
/* a treadle-driven platen press: iron frame, a round ink disc, a flywheel and a foot treadle */
{ const g = new THREE.Group(); g.position.set(3.2, 0, -2.5); room.add(g);
  for (const dx of [-0.42, 0.42]) box(0.14, 0.95, 0.72, iron, dx, 0.475, 0, g);
  box(1.0, 0.16, 0.7, iron, 0, 0.9, 0, g); box(0.95, 0.5, 0.3, iron, 0, 1.25, -0.2, g);
  box(0.6, 0.62, 0.08, solid(0x8e8e88, 0.45, 0.2), 0, 1.2, 0.0, g); box(0.4, 0.4, 0.02, solid(0x2c2c2e, 0.6, 0.15), 0, 1.2, 0.05, g);
  cyl(0.22, 0.22, 0.05, iron, 0, 1.62, -0.1, g, 24).rotation.x = Math.PI / 2;
  for (const dx of [-0.2, 0.2]) box(0.04, 0.5, 0.04, iron, dx, 1.3, 0.1, g);
  const wheel = new THREE.Group(); wheel.position.set(-0.62, 0.95, -0.05); g.add(wheel); mesh(new THREE.TorusGeometry(0.4, 0.04, 8, 28), solid(0x8a2a22, 0.55, 0.15), 0, 0, 0, wheel).rotation.y = Math.PI / 2;
  for (let i = 0; i < 6; i++) { const sp = box(0.03, 0.8, 0.03, iron, 0, 0, 0, wheel); sp.rotation.x = i * Math.PI / 6; } cyl(0.07, 0.07, 0.14, iron, 0, 0, 0, wheel).rotation.z = Math.PI / 2;
  box(0.8, 0.04, 0.16, wood, 0, 0.08, 0.4, g); box(0.7, 0.04, 0.34, wood, 0, 0.88, 0.5, g); box(0.4, 0.05, 0.28, paper, 0.1, 0.93, 0.5, g);
  WALLS.push([3.2 - 1.15, -2.5 - 0.5, 3.2 + 0.6, -2.5 + 0.75]); }
/* shelves of paper on the back wall */
{ const g = new THREE.Group(); g.position.set(0.9, 0, Z0 + 0.22); room.add(g);
  for (const dx of [-1.1, 1.1]) box(0.06, 2.4, 0.4, woodDark, dx, 1.2, 0, g);
  for (const y of [0.3, 1.0, 1.7, 2.4]) box(2.26, 0.05, 0.4, wood, 0, y, 0, g);
  for (const [y, n] of [[0.3, 4], [1.0, 3], [1.7, 4]]) for (let i = 0; i < n; i++) { const w = 0.42 + Math.random() * 0.1; box(w, 0.1 + Math.random() * 0.2, 0.32, i % 2 ? paper : std(null, 0.95, { color: 0xcfc3a2 }), -0.9 + i * 0.55, y + 0.13, 0, g); }
  WALLS.push([0.9 - 1.2, Z0, 0.9 + 1.2, Z0 + 0.5]); }
/* bundles of paper tied with string, on the floor */
for (const [x, z, n] of [[1.9, -3.0, 3], [-4.1, -0.9, 2], [-4.1, 0.1, 3]]) { for (let i = 0; i < n; i++) { const b = box(0.5, 0.2, 0.36, paper, x, 0.1 + i * 0.2, z + (i % 2) * 0.03, room); box(0.52, 0.02, 0.04, solid(0x8b6c3a), 0, 0, 0, b); } WALLS.push([x - 0.4, z - 0.3, x + 0.4, z + 0.3]); }
/* a rope with printed sheets drying on it, above head height */
{ cyl(0.012, 0.012, W - 0.2, solid(0x8b7a55), 0, 2.62, 0.8, room, 6).rotation.z = Math.PI / 2;
  [['NOTICE'], ['FOR SALE'], ['TO LET'], ['NOTICE'], ['SALE'], ['TO LET'], ['NOTICE']].forEach(([word], i) => { const s = mesh(new THREE.PlaneGeometry(0.36, 0.48), new THREE.MeshStandardMaterial({ map: sheetTex(word), side: THREE.DoubleSide, roughness: 1 }), -3.4 + i * 1.1 + Math.random() * 0.2, 2.35, 0.8); s.rotation.set(0.05 * (Math.random() - 0.5), 0.2 * (Math.random() - 0.5), 0.06 * (Math.random() - 0.5)); }); }
/* the counter by the door, with a ledger, an inkwell and a bell, and a board of notices above it */
{ const g = new THREE.Group(); g.position.set(2.6, 0, 2.55); room.add(g);
  box(2.2, 0.98, 0.6, woodDark, 0, 0.49, 0, g); box(2.4, 0.06, 0.74, wood, 0, 1.0, 0, g);
  box(0.34, 0.04, 0.44, solid(0x5a1f1c, 0.7), -0.5, 1.05, 0.0, g); box(0.3, 0.02, 0.4, paper, -0.5, 1.075, 0, g); cyl(0.04, 0.04, 0.07, solid(0x1b1b1d, 0.3, 0.3), 0.1, 1.07, 0.1, g);
  cyl(0.05, 0.03, 0.06, brass, 0.6, 1.06, 0.0, g); cyl(0.035, 0.03, 0.09, solid(0x6c5436), 0.3, 1.09, -0.12, g, 8);
  WALLS.push([2.6 - 1.3, 2.55 - 0.45, 2.6 + 1.3, 2.55 + 0.45]);
  const bd = box(0.04, 0.9, 1.9, woodDark, 1.75, 1.8, 0, g); bd.position.x = X1 - 2.6 - 0.04; bd.position.y = 1.85; bd.position.z = 0;
  [['MEETING', -0.55], ['LOST', 0.0], ['TO LET', 0.55]].forEach(([word, dz]) => { const s = mesh(new THREE.PlaneGeometry(0.42, 0.56), std(sheetTex(word), 1), X1 - 2.6 - 0.07, 1.85, dz, g); s.rotation.y = -Math.PI / 2; }); }
/* a hanging lamp */
{ const g = new THREE.Group(); g.position.set(0.2, 0, -0.3); room.add(g);
  cyl(0.008, 0.008, 0.9, solid(0x222222), 0, H - 0.45 - 0.2, 0, g, 6); cyl(0.05, 0.16, 0.12, brass, 0, 2.95, 0, g); cyl(0.11, 0.11, 0.26, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 }), 0, 2.76, 0, g); cyl(0.12, 0.05, 0.08, brass, 0, 2.6, 0, g); }
/* a stool by the counter */
{ cyl(0.17, 0.17, 0.05, wood, 1.2, 0.62, 2.3, room, 14); for (const [dx, dz] of [[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]]) cyl(0.015, 0.02, 0.6, woodDark, 1.2 + dx, 0.3, 2.3 + dz, room, 6); }
const BOUNDS = { x0: X0 + 0.4, x1: X1 - 0.4, z0: Z0 + 0.4, z1: Z1 - 0.45 };

/* ---------- state, movement and controls (the same controls as Port Royal) ---------- */
const state = { x: -0.5, z: 2.9, yaw: 0, pitch: 0, started: false };   /* yaw 0 looks toward -z, into the shop */
const START = { x: -0.5, z: 2.9, yaw: 0 };
const EYE = 1.55, isTouch = matchMedia('(pointer: coarse)').matches;
const keys = new Set(); let busy = false, fading = false;   /* busy: a talk, the journal or another panel is open, so do not move */
let talkWith = null, near = null, DEV_NOSTOP = false, curWalls = WALLS, curBounds = BOUNDS;   /* DEV_NOSTOP: test views only, so a walker keeps walking while the camera is close */
const panelsOpen = () => ['dialogue', 'typeset', 'pagebuild', 'inspect', 'decl', 'sortp', 'letp', 'timep', 'ansp', 'journal', 'chapters', 'credits', 'card'].some((id) => !$(id).hidden);   /* closing one panel must not unpause the world while another is open */
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); closeType(false); closePage(false); if (!$('card').hidden) hideCard(); }
  if ((k === 'e' || k === 'enter') && !busy && near) activate(near);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   /* keep inside the room, out of furniture (slide along it) and out of people */
  x = Math.max(curBounds.x0, Math.min(curBounds.x1, x)); z = Math.max(curBounds.z0, Math.min(curBounds.z1, z));
  for (const [x0, z0, x1, z1] of curWalls) { if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; } }
  for (const n of PEOPLE) { const d = Math.hypot(x - n.x, z - n.z); if (n.m && n.m.visible && d < 0.5) { x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (busy) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth / 2 && stick.id === null) { stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0; }
  else { look.id = e.pointerId; look.x = e.clientX; look.y = e.clientY; look.moved = 0; }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stick.id) { stick.dx = Math.max(-1, Math.min(1, (e.clientX - stick.x0) / 50)); stick.dy = Math.max(-1, Math.min(1, (e.clientY - stick.y0) / 50)); }
  else if (e.pointerId === look.id) { const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy); state.yaw -= dx * 0.005; state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch - dy * 0.004)); }
});
const endPointer = (e) => {
  if (e.pointerId === stick.id) { stick.id = null; stick.dx = stick.dy = 0; }
  if (e.pointerId === look.id) { if (look.moved < 8) { const p = tapPerson(e.clientX, e.clientY); if (p) startTalk(p); } look.id = null; }   /* a tap (not a drag) on a person starts a talk */
};
canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer);
function stickUI() {   /* a resting outline at the bottom left on phones; it follows your thumb while you walk */
  const el = $('stick'); if (!isTouch || !state.started || busy) { el.hidden = true; return; }
  el.hidden = false; const rest = stick.id === null; el.classList.toggle('rest', rest);
  el.style.left = (rest ? 84 : stick.x0) + 'px'; el.style.top = (rest ? innerHeight - 150 : stick.y0) + 'px'; $('nub').style.transform = `translate(calc(-50% + ${stick.dx * 30}px), calc(-50% + ${stick.dy * 30}px))`;
}

/* ---------- the two people (both made up; placeholders for testing) ---------- */
const STRIKE_LINES = [
  { who: 'Printer', text: 'Come here. The printers have news.' },
  { who: 'Printer', text: 'Our union asked the owners for better working conditions.' },
  { who: 'Printer', text: 'A union is workers standing up for each other.' },
  { who: 'Printer', text: 'The owners said no. So we may stop work together.' },
  { who: 'Printer', text: 'That is called a strike. Marcus Garvey is a union leader.', unlock: 'strike' },
  { who: 'Printer', text: 'There is a meeting. What would you do there?', choices: [
    { t: 'Speak up now', set: { strike: 'speak' }, then: [{ who: 'Printer', text: 'Brave. Speaking up early takes courage.' }] },
    { t: 'Wait and listen first', set: { strike: 'wait' }, then: [{ who: 'Printer', text: 'Wise. Listening is a strength too.' }] },
    { t: 'Ask the others what they think', set: { strike: 'ask' }, then: [{ who: 'Printer', text: 'Fair. A union is people deciding together.' }] }] },
  { who: 'Printer', text: 'The strike lasted some weeks. It did not win.' },
  { who: 'Printer', text: 'Marcus Garvey lost his job. Private firms would not hire him.' },
  { who: 'Printer', text: 'But he did not stop. He had bigger plans.' }];
const SHOP_PEOPLE = [
  { id: 'printer', model: 'printer1907', who: 'Printer', label: 'Talk to the printer', x: -2.65, z: -2.2, ry: Math.PI, base: 'Idle',
    lines: () => stage === 2 ? STRIKE_LINES : [
      { who: 'Printer', text: 'Mind the type. Every letter is made of metal.' },
      { who: 'You', text: 'Why are the words all backwards?' },
      { who: 'Printer', text: 'We set type back to front. The press turns it round.' },
      { who: 'You', text: 'So one page can reach many people?' },
      { who: 'Printer', text: 'Yes. That is the power of print.' },
      { who: 'Printer', text: 'Marcus Garvey learned this trade, too.', unlock: 'garvey-printer' }],
    later: () => stage >= 3 ? [({ speak: 'You spoke up. I will remember that.', wait: 'You waited and listened. That was wise.', ask: 'You asked the others. That was fair.' })[story.strike] || 'The printers are in your thoughts.', 'I hope the strike ends well for everyone.'] : ['Mind the type!', 'I have work to do. Come back soon.'] },
  { id: 'customer', model: 'woman1914', who: 'Customer', label: 'Talk to the customer', x: 1.3, z: 1.6, ry: Math.PI, base: 'Idle',
    path: [[1.3, 1.6], [2.2, 1.55], [1.0, 0.6], [-1.9, 0.7], [-0.5, 1.9]],
    lines: [
      { who: 'Customer', text: 'Good morning! Are my printed notices ready?' },
      { who: 'You', text: 'Nearly. The ink is still wet.' },
      { who: 'Customer', text: 'I will wait. I like to watch the press.' }],
    later: ['I will wait here, thank you.', 'What a busy shop!'] },
];
function initPerson(n) { n.m = null; n.walking = false; n.wait = 1.5 + Math.random() * 2; n.i = 0; n.heard = 0; n.talked = false; n.hx = n.x; n.hz = n.z; n.dest = null; n.delay = 0; n.hidden = false; }
for (const n of SHOP_PEOPLE) initPerson(n);
let PEOPLE = SHOP_PEOPLE;   /* the people in the place you are in */
const allPeople = () => [...SHOP_PEOPLE, ...HALL_PEOPLE, ...STREET_PEOPLE, ...PRESS_PEOPLE, ...DOCK_PEOPLE, ...LIB_PEOPLE, ...OFF_PEOPLE, ...PARK_PEOPLE];
const byId = (id) => allPeople().find((n) => n.id === id);
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of PEOPLE) if (n.m && ray.intersectObject(n.m, true).length > 0 && Math.hypot(state.x - n.x, state.z - n.z) < 6) return n;
  return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
const sitClip = (talking) => (talking && CL.SitTalk ? 'SitTalk' : CL.SitIdle ? 'SitIdle' : null);
function sitDown(n) { n.seated = true; n.walking = false; n.m.userData.anim.play(sitClip(false)); }
function npcTick(n, dt) {
  const m = n.m; if (!m) return; if (POSTER) { m.rotation.y = n.ry; return; }   /* the menu poster: everyone keeps the pose they were given */
  const ac = m.userData.anim, d = Math.hypot(state.x - n.x, state.z - n.z), isNear = (d < 3.2 && !DEV_NOSTOP) || talkWith === n;
  if (n.delay > 0) { n.delay -= dt; if (n.delay <= 0) { n.hidden = false; m.visible = place === 'hall'; n.walking = true; ac.play('Walk'); } return; }
  if (n.dest && talkWith !== n) { const dx = n.dest[0] - n.x, dz = n.dest[1] - n.z, dist = Math.hypot(dx, dz), sp = 1.25 * dt; faceTo(m, Math.atan2(dx, dz), dt);
    if (dist <= sp) { n.x = n.dest[0]; n.z = n.dest[1]; if (n.legs && n.legs.length) { n.dest = n.legs.shift(); } else { n.dest = null; n.walking = false; n.ry = Math.PI; if (n.seat) sitDown(n); else ac.play(null); } } else { n.x += dx / dist * sp; n.z += dz / dist * sp; } m.position.set(n.x, 0, n.z); return; }
  const toPlayer = Math.atan2(state.x - n.x, state.z - n.z);
  if (n.seated) { faceTo(m, talkWith === n ? toPlayer : n.ry, dt, 3); return; }
  if (!n.path) { if (isNear) faceTo(m, toPlayer, dt); else faceTo(m, n.ry, dt, 2); return; }   /* the printer stays at his stand, and turns to look at you */
  if (isNear || n.wait > 0) {   /* stop, and look at the player if they are close */
    if (n.walking) { n.walking = false; ac.play(null); }
    if (isNear) faceTo(m, toPlayer, dt); else { n.wait -= dt; if (n.wait <= 0) { n.walking = true; ac.play('Walk'); } }
    return; }
  if (!n.walking) { n.walking = true; ac.play('Walk'); }
  const to = n.path[(n.i + 1) % n.path.length], dx = to[0] - n.x, dz = to[1] - n.z, dist = Math.hypot(dx, dz), sp = 1.05 * dt;
  faceTo(m, Math.atan2(dx, dz), dt);
  if (dist <= sp) { n.x = to[0]; n.z = to[1]; n.i = (n.i + 1) % n.path.length; n.wait = 2.5 + Math.random() * 3; n.walking = false; ac.play(null); } else { n.x += dx / dist * sp; n.z += dz / dist * sp; }
  m.position.set(n.x, 0, n.z);
}

/* ---------- the menu link: shown only where the real game menu exists (the website), as in Port Royal ---------- */
const MENU = { ok: false, url: '../../../menu/' };
{ const links = ['allgames', 'jhome'].map((id) => document.getElementById(id)).filter(Boolean); for (const a of links) a.hidden = true;
  fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }
function toMenu() { saveGame(); location.href = MENU.url; }

/* ---------- the journal ---------- */
const JOURNAL = [
  { id: 'you', title: 'You in this game', simple: ['You are made up.', 'You are a young helper in a print shop in Kingston, Jamaica.', 'The printer and the customer are made up too.'],
    deeper: ['The big events in this game really happened. Made-up people help us tell them.', 'Your choices will change what you see and who you meet. They will not change what really happened.'] },
  { id: 'garvey-printer', title: 'Marcus Garvey, printer', simple: ['Marcus Garvey was born in St Ann\'s Bay, Jamaica, in 1887.', 'As a boy he learned printing from his godfather.', 'Later he worked as a printer in Kingston.'],
    deeper: ['He moved to Kingston in about 1905 or 1906 and worked for a large printing firm. He became a foreman, a leader of the workers.', 'He was also an officer of the printers\' union: the vice-president of its compositors\' section.', 'Most of this comes from books and articles about him. We still need to check it against the Marcus Garvey and UNIA Papers.'] },
  { id: 'strike', title: 'The printers\' strike', simple: ['A union is a group of workers who stand up for each other.', 'In about 1908 the printers in Kingston went on strike.', 'That means they stopped work together.', 'They wanted better working conditions.', 'The strike did not win. Marcus Garvey lost his job.'],
    deeper: ['Most sources date the strike to late 1908. Some older ones say 1907.', 'The strike was broken after some weeks, and the union ended.', 'Private printing firms would not hire Garvey afterwards. For a short time he worked at the government printery.', 'Your choice in this game does not change what really happened.'] },
  { id: 'press', title: 'How a press works', simple: ['Printers set type: small metal letters.', 'Each metal letter is a mirror image.', 'The press inks the letters and presses paper onto them.', 'The words print the right way round.'],
    deeper: ['A page of type locked in an iron frame is called a forme.', 'Printers locked up formes on a flat table called an imposing stone.', 'Small jobbing presses were worked by a foot treadle, a hand lever, or a belt from an engine.'] },
  { id: 'garvey-home', title: 'Marcus Garvey comes home', simple: ['Marcus Garvey travelled to other countries as a young man.', 'He lived in London for about two years.', 'He came back to Jamaica in July 1914.'],
    deeper: ['In Costa Rica he worked for a fruit company and wrote about the hard conditions of the workers.', 'In London he studied, and worked for a newspaper called the African Times and Orient Review.', 'Sources give different years for his travels in Central America, between 1909 and 1911.'] },
  { id: 'amy', title: 'Amy Ashwood', simple: ['Amy Ashwood was one of the first members of the UNIA.', 'She worked with Marcus Garvey in the early years.', 'She later led its women\'s division.'],
    deeper: ['She was an early secretary of the UNIA.', 'Some writers call her a co-founder. The historian Tony Martin thought that was too strong. Records show she was an organiser and a secretary.', 'We still need to check this against the Marcus Garvey and UNIA Papers.'] },
  { id: 'harlem', title: 'Harlem in 1916', simple: ['Harlem is a part of New York City.', 'Many Black families came to Harlem.', 'Some came from the southern United States. Some came from Caribbean islands such as Jamaica.', 'Street corners were places where people gave speeches and listened.', 'The worker, the woman and the older man in this game are made up.'],
    deeper: ['Harlem\'s Black population grew from about 29,000 in 1910 to about 84,000 in 1920. This comes from one source, which we still need to check.', 'Many kinds of speakers used the corners, including socialists such as A. Philip Randolph. Some middle-class Black New Yorkers did not like street speaking.', 'The words spoken at the corner in this game are made up, including the words of Marcus Garvey. They are not his real words.'] },
  { id: 'garvey-arrives', title: 'Garvey arrives in New York', simple: ['Marcus Garvey sailed from Jamaica in March 1916.', 'He reached New York later that month.', 'He gave speeches in Harlem and began to find friends there.'],
    deeper: ['His ship was the SS Tallac. Sources give the day he arrived as 23 or 24 March.', 'He worked as a printer after he arrived.', 'Garvey is said to have first spoken at the corner of 135th Street and Lenox Avenue. This comes from one source.'] },
  { id: 'unia-ny', title: 'The UNIA in New York', simple: ['In 1917 Garvey started a New York branch of the UNIA.', 'It grew quickly in Harlem.'],
    deeper: ['Sources give the first members as 13 or 17.', 'Liberty Hall in Harlem, a large meeting hall, opened in 1919.'] },
  { id: 'negro-world', title: 'The Negro World', simple: ['The Negro World was a newspaper. Marcus Garvey and the UNIA made it.', 'It came out every week and cost five cents.', 'People read it in Harlem and in many other places.'],
    deeper: ['The first issue came out on 17 August 1918. At first it was printed in English.', 'Copies travelled by ship. Black sailors and others carried them from port to port.', 'The headlines and the people in this game are made up.', 'These details come from books and articles. We still need to check them against the Marcus Garvey and UNIA Papers.'] },
  { id: 'frontpage', title: 'How a front page is made', simple: ['The name of the paper goes at the top.', 'Then come the big headline, a picture, and the price.', 'Printers lock all the pieces into a frame before they print.'],
    deeper: ['The name at the top of a paper is called the masthead.', 'A page of type locked in an iron frame is called a forme. The stone table where printers did this is called the imposing stone.'] },
  { id: 'ban', title: 'The paper is banned', simple: ['Some governments did not want people to read the Negro World.', 'They banned it. That means it was not allowed.', 'Sailors still carried copies from port to port.'],
    deeper: ['It was banned in several places, such as Trinidad, British Guiana and St Vincent. Sources differ on the years.', 'The sailor in this game is made up, and so is his voyage. He shows how the paper really did travel.', 'The sources we have do not say how copies were carried past officers, so the game does not show it.'] },
  { id: 'bsl', title: 'The Black Star Line', simple: ['The Black Star Line was a company that planned to own ships.', 'People bought shares in it for five dollars each.', 'Marcus Garvey hoped the ships would help Black people trade and travel.'],
    deeper: ['The company was set up in June 1919 in the state of Delaware. Sources give the day as 23 or 27 June.', 'Its first ship was the Yarmouth, bought in 1919. She was old and in poor condition. Some people called her the Frederick Douglass.', 'Two more ships followed in 1920: the Shady Side, a small excursion boat, and the Kanawha, a steam yacht. Sources say they were old and cost too much.', 'The company had many troubles and collapsed in the early 1920s.', 'The clerk, the engineer, the friend and the ship inspection in this game are made up. The ships and the five dollar shares are real.', 'These details come from books and websites. We still need to check them against the Marcus Garvey and UNIA Papers.'] },
  { id: 'shares', title: 'What is a share?', simple: ['A share is a small part of a company.', 'If the company does well, people who own shares can share the profit.', 'If it does badly, they can lose the money they put in.'],
    deeper: ['Garvey sold shares for five dollars so that people with little money could join in.', 'Nearly 100,000 shares were sold by August 1920. The exact number differs between sources.'] },
  { id: 'convention', title: 'The 1920 convention', simple: ['In August 1920 the UNIA held a big convention in New York.', 'It lasted the whole month. People came from many countries.', 'There were parades through Harlem, with bands and the Black Cross Nurses.'],
    deeper: ['The convention ran from 1 to 31 August 1920. Most sources say it met at Liberty Hall in Harlem.', 'Sources say delegates came from more than twenty countries. Crowd sizes differ a lot between sources, so we give no number.', 'The nurse, the traveller, the messenger and the steward in this game are made up. So are the words of Marcus Garvey. They are not his real words.', 'These details come from books and websites. We still need to check them against the Marcus Garvey and UNIA Papers.'] },
  { id: 'declaration', title: 'The Declaration of Rights', simple: ['The convention wrote a Declaration of Rights.', 'It says what Black people in the world should be free to do.', 'One line chose red, black and green as the colours of the Black race.'],
    deeper: ['Its full name is the Declaration of the Rights of the Negro Peoples of the World. It was signed on 13 August 1920.', 'One source says it has a preamble and 54 articles. The line in the game is item 39: "That the colors, Red, Black and Green, be the colors of the Negro race." These are the real words.', 'The banner you colour in the game is only an illustration. Our sources do not say how the first banners looked.'] },
  { id: 'nurses', title: 'The Black Cross Nurses', simple: ['The Black Cross Nurses were a women\'s group in the UNIA.', 'They helped with health and first aid.', 'They marched in parades.'],
    deeper: ['Some accounts say they wore white uniforms. The nurse in this game wears white for that reason.', 'The nurse in this game is made up.'] },
  { id: 'amyj', title: 'Amy Jacques Garvey', simple: ['Amy Jacques Garvey was born in Kingston, Jamaica.', 'In the 1920s she became Marcus Garvey\'s wife and helped him with his work.', 'She was an editor of the Negro World and wrote a page for women.'],
    deeper: ['Her page was called Our Women and What They Think. It ran from 1924 to 1927.', 'She also gathered Marcus Garvey\'s speeches and writings into a book, Philosophy and Opinions of Marcus Garvey (1923 and 1925).', 'Amy Jacques Garvey was a real person. Her words and the reader and friend in this game are made up.'] },
  { id: 'trial', title: 'The trial and prison', simple: ['In 1923 Marcus Garvey was found guilty of mail fraud.', 'That means using the mail to cheat people.', 'The case was about the Black Star Line.', 'He went to prison in Atlanta in 1925.', 'In 1927 he was let out and sent back to Jamaica.'],
    deeper: ['He was convicted in June 1923 and sentenced to five years. The exact day differs between sources.', 'His sentence was shortened in November 1927, and then he was deported.', 'People still disagree about how fair the trial was. Many of his supporters say it was not fair. Others say the Black Star Line was run badly. This game tells it as simply as it can.'] },
  { id: 'rumour', title: 'Fact or rumour?', simple: ['A fact is something we can check.', 'A rumour is something people say, but nobody has shown that it is true.', 'Before you share news, ask: who said it, and how do they know?'],
    deeper: ['Good editors check a story before they print it.', 'We still need to ask the same questions today.'] },
  { id: 'later', title: 'His later life', simple: ['In 1927 Marcus Garvey was sent back to Jamaica.', 'He lived for a time in Kingston, then in London.', 'He died in London in 1940.'],
    deeper: ['He reached Kingston in December 1927. In 1929 he started a political party in Jamaica, the People\'s Political Party. This comes from one source.', 'He moved to London in 1935. This also comes from one source.', 'His remains were brought home to Jamaica in 1964 and placed in a shrine at National Heroes Park in Kingston. Sources give the day as 10 or 15 November.', 'In 1969 he was named a National Hero of Jamaica.'] },
  { id: 'shrine', title: 'The shrine in Kingston', simple: ['Marcus Garvey\'s shrine is in National Heroes Park in Kingston.', 'It has a bronze bust of him.'],
    deeper: ['The monument was designed in 1964. The bust is by the sculptor T. Alvin Marriott. It was placed in the park in 1956 and later moved into the monument.', 'In this game the shrine is only an outline, drawn from descriptions. The plaque gives just his name and dates, because we have not found the exact words on the real one.', 'The student and the guide in this game are made up.'] },
  { id: 'pardon', title: 'The pardon', simple: ['In January 2025 US President Joe Biden pardoned Marcus Garvey.', 'This pardon came after his death.', 'His family and many supporters had asked for this for years.'],
    deeper: ['Some of them also want the US Congress to exonerate him, which would clear his name completely.', 'People still disagree about how fair his trial was. This game does not decide it for you.'] },
  { id: 'journey', title: 'Your journey', simple: ['You finished the story.'], deeper: ['Your choices did not change what really happened. They show how you took part in it.'] },
  { id: 'unia', title: 'The UNIA begins', simple: ['UNIA stands for Universal Negro Improvement Association.', 'It was founded in Kingston, Jamaica, in July 1914.', 'It wanted to help people in need, build pride, and open a trade school.'],
    deeper: ['Many sources give the first meeting as 20 July 1914. Others point to 1 August, Emancipation Day. Where it met is also uncertain.', 'In 1914 Garvey wrote to Booker T. Washington about a trade school like Tuskegee. Washington died in 1915.', 'Garvey sailed for the United States in March 1916.'] },
];
const unlocked = []; let toastTimer = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600); }
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function renderJournal(sel) {
  refreshJourney();   /* "Your journey" always shows the choices as they are now, even after a chapter is replayed */
  const tabs = $('jtabs'); tabs.replaceChildren(); const open = sel || unlocked[unlocked.length - 1];
  JOURNAL.filter((p) => unlocked.includes(p.id)).forEach((p) => { const b = document.createElement('button'); b.className = 'tab' + (p.id === open ? ' on' : ''); b.textContent = p.title; b.onclick = () => renderJournal(p.id); tabs.appendChild(b); });
  const left = JOURNAL.length - unlocked.length; if (left > 0) { const m = document.createElement('button'); m.className = 'tab'; m.disabled = true; m.textContent = left + ' more to find'; tabs.appendChild(m); }
  const page = $('jpage'); page.replaceChildren(); const p = JOURNAL.find((q) => q.id === open);
  if (!p) { const e = document.createElement('p'); e.textContent = 'Your journal is empty. Talk to people in the shop to fill it.'; page.appendChild(e); return; }
  const h = document.createElement('h3'); h.textContent = p.title; page.appendChild(h);
  for (const t of p.simple) { const e = document.createElement('p'); e.textContent = t; page.appendChild(e); }
  const d = document.createElement('details'); const s = document.createElement('summary'); s.textContent = 'Dig deeper'; d.appendChild(s);
  for (const t of p.deeper) { const e = document.createElement('p'); e.textContent = t; d.appendChild(e); } page.appendChild(d);
}
function openJournal(sel) { if (busy) return; busy = true; keys.clear(); renderJournal(typeof sel === 'string' ? sel : undefined); $('journal').hidden = false; $('jclose').focus(); }
function closeJournal() { if ($('journal').hidden) return; $('journal').hidden = true; busy = panelsOpen(); }
$('jbtn').onclick = () => openJournal(); $('jclose').onclick = closeJournal;

/* ---------- goal, hint, sound button (as in Port Royal) ---------- */
let stage = 0, best = 0;   /* the story is a number. Chapter 1: 0 talk, 1 set the type, 2 (reserved), 3 done. Chapter 2: 10 meet, 11 print the poster, 12 welcome the neighbours, 13 listen, 14 done. best: the furthest stage ever reached */
const GOALS = { 0: 'Talk to the printer and the customer.', 1: 'Set the type for a notice. Go to the type stand.', 2: 'Talk to the printer. He has news.', 3: 'Well done! The print shop chapter is finished. Open Chapters for the next one.',
  70: 'Meet the park guide and the student at the shrine.', 71: 'Put the events of his later life in order at the board.', 72: 'The student has a big question. Talk to the student.', 73: 'Answer the question at the shrine, in your own words.', 74: 'You have finished the story. Thank you for playing! Your journey is in the Journal.',
  60: 'Talk to Amy Jacques Garvey at her desk.', 61: 'Sort the news cards on the desk: fact or rumour?', 62: 'Talk to Amy about the rumour.', 63: 'A friend has written. Read the letter and write back.', 64: 'Well done! Chapter 7 is finished. Open Chapters for the next one.',
  50: 'Welcome the three visitors in Liberty Hall.', 51: 'Three people need help. Talk to the steward.', 52: 'Read the Declaration on the table.', 53: 'Talk to Marcus Garvey on the platform.', 54: 'Well done! Chapter 6 is finished. Open Chapters for the next one.',
  40: 'Meet Marcus Garvey, the share clerk and the engineer.', 41: 'Look the old ship over, at the edge of the dock.', 42: 'Talk to Marcus Garvey about the ship.', 43: 'Your friend wants to buy shares. Talk to her.', 44: 'Well done! Chapter 5 is finished. Open Chapters for the next one.',
  30: 'Talk to the pressman and Marcus Garvey.', 31: 'Lay out the front page on the stone table.', 32: 'Talk to the sailor by the door.', 33: 'The sailor is back. Talk to him and the pressman.', 34: 'Well done! Chapter 4 is finished. Open Chapters for the next one.',
  20: 'Listen to the three people at the corner.', 21: 'Talk to Marcus Garvey.', 22: 'The older man has a question. Talk to him.', 23: 'Well done! Chapter 3 is finished. Open Chapters for the next one.',
  10: 'Talk to Amy Ashwood and Marcus Garvey.', 11: 'Print the poster at the press table.', 12: 'Welcome the three neighbours as they arrive.', 13: 'Listen to Marcus Garvey.', 14: 'Well done! Chapter 2 is finished. Open Chapters for the next one.' };
const TALK_TARGETS = { 70: ['guide', 'student'], 72: ['student'], 60: ['amyj'], 62: ['amyj'], 50: ['nurse', 'delegate', 'messenger'], 51: ['steward'], 53: ['garvey6'], 40: ['garvey5', 'clerk', 'engineer'], 42: ['garvey5'], 43: ['friend'], 30: ['pressman', 'garvey4'], 32: ['sailor'], 33: ['sailor', 'pressman'], 20: ['worker', 'woman', 'critic'], 21: ['garvey3'], 22: ['critic'], 0: ['printer', 'customer'], 2: ['printer'], 10: ['amy', 'garvey'], 12: ['elder', 'seller', 'youth'], 13: ['garvey'] };   /* who you must talk to at each stage */
const NEXT_AFTER_TALK = { 70: 71, 72: 73, 60: 61, 62: 63, 50: 51, 51: 52, 53: 54, 40: 41, 42: 43, 43: 44, 30: 31, 32: 33, 33: 34, 20: 21, 21: 22, 22: 23, 0: 1, 2: 3, 10: 11, 12: 13, 13: 14 };
const wantsTalk = (n) => !n.talked && (TALK_TARGETS[stage] || []).includes(n.id);
function setStage(s) { stage = s; best = Math.max(best, s); for (const n of allPeople()) n.talked = false; saveGame(); setGoal(); if (s === 12) startArrivals(); if (s === 33) chapterFade('Some weeks later', 'The press room, Harlem', arrangePress); if (!QUICK && s in CHAPTER_END) setTimeout(() => nextCard(CHAPTER_END[s], s), 900); }
function onTalked() { const t = TALK_TARGETS[stage]; if (t && t.every((id) => byId(id).talked)) setStage(NEXT_AFTER_TALK[stage]); }
let goalText = '', goalTimer = 0, hintTimer = 0;
function showGoal(withControls) {
  const el = $('goal'); if (el.textContent !== goalText && state.started) uiSound('goal'); el.textContent = goalText; el.classList.remove('folded'); el.setAttribute('aria-expanded', 'true'); clearTimeout(goalTimer);
  goalTimer = setTimeout(() => { el.textContent = 'Goal'; el.classList.add('folded'); el.setAttribute('aria-expanded', 'false'); }, 6500);
  if (withControls) showHint();
}
function showHint() { $('hint').hidden = false; clearTimeout(hintTimer); hintTimer = setTimeout(() => { $('hint').hidden = true; }, 6000); }
function setGoal() { goalText = GOALS[stage]; showGoal(true); }
$('goal').onclick = () => showGoal(true);
function showSound() { const b = $('snd'); b.setAttribute('aria-pressed', AU.on ? 'true' : 'false'); b.setAttribute('aria-label', AU.on ? 'Sound on. Tap to turn off.' : 'Sound off. Tap to turn on.'); $('sndon').style.display = AU.on ? '' : 'none'; $('sndoff').style.display = AU.on ? 'none' : ''; }
$('snd').onclick = () => { setSound(!AU.on); showSound(); }; showSound();

/* ---------- saving: kept in this browser only ---------- */
const story = {};   /* what the player chose: the printers' strike, who to invite... later lines read it. Saved with the rest. */
const SAVE_KEY = 'garvey-save-v1'; let hasSave = false, erasing = false;   /* erasing: the reload that follows "Start again" must not save the old progress back */
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, unlocked, stage, best, story, talked: allPeople().filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return;
  for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  if (d.story && typeof d.story === 'object') Object.assign(story, d.story);
  stage = Number.isInteger(d.stage) && d.stage in GOALS ? d.stage : 0; best = Number.isInteger(d.best) ? Math.max(d.best, stage) : stage; const waiting = TALK_TARGETS[stage] || [];   /* talk flags only count inside the stage they were saved in; saves from before version 2 used other stage numbers, so their flags are dropped */
  for (const p of allPeople()) p.talked = d.v === 2 && Array.isArray(d.talked) && d.talked.includes(p.id) && waiting.includes(p.id);
  refreshJourney(); hasSave = unlocked.length > 1 || stage > 0 || best > 0;
}
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && state.started) saveGame(); });

/* ---------- cards (small prompts) and chapter titles ---------- */
function card(title, paras, btns) {
  $('ctitle').textContent = title; const b = $('cbody'); b.replaceChildren(); for (const t of paras) { const p = document.createElement('p'); p.textContent = t; b.appendChild(p); }
  const bb = $('cbtns'); bb.replaceChildren(); btns.forEach((x, i) => { const el = document.createElement('button'); el.className = 'btn' + (i ? ' ghost' : ''); el.textContent = x.t; el.onclick = x.go; bb.appendChild(el); });
  $('card').hidden = false; busy = true; keys.clear(); const f = bb.querySelector('button'); if (f) f.focus();
}
function hideCard() { $('card').hidden = true; busy = panelsOpen(); }
const QUICK = __DEV__ && /[?&](shot|auto|test)=/.test(location.search);   /* test views skip the fade */
function chapterFade(title, sub, fn) {
  if (QUICK) { fn(); return; } if (fading) return; fading = true; const f = $('fade'); $('fadeT').textContent = title; $('fadeS').textContent = sub; $('card').hidden = true; $('dialogue').hidden = true;
  f.hidden = false; requestAnimationFrame(() => { f.classList.add('on'); }); setTimeout(() => { fn(); f.classList.add('txt'); }, 750);
  setTimeout(() => { f.classList.remove('txt'); }, 2500); setTimeout(() => { f.classList.remove('on'); }, 2900); setTimeout(() => { f.hidden = true; fading = false; }, 3800);
}
function resetChapter() {   /* the print shop again: people go home, the goal starts over, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); enterPlace('shop');
  for (const n of SHOP_PEOPLE) { n.talked = false; n.heard = 0; n.i = 0; n.walking = false; n.wait = 1.5; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  setStage(0); showPlace();
}

/* ---------- chapters (only the first is built so far) ---------- */
const CHAPTER_END = { 3: 0, 14: 1, 23: 2, 34: 3, 44: 4, 54: 5, 64: 6 };   /* the last stage of each chapter but the final one, and which chapter it ends */
function nextCard(i, s, tries = 0) {   /* when a chapter is finished, offer the next one on screen, so nobody has to dig through Chapters */
  if (stage !== s) return;   /* the player has moved on or restarted */
  if (panelsOpen() || fading) { if (tries < 10) setTimeout(() => nextCard(i, s, tries + 1), 800); return; }   /* never take over a panel the player is reading: if it stays open, drop the prompt (Chapters still works) */
  const nx = CHAPTERS[i + 1]; if (!nx || !nx.ready) return; uiSound('goal');
  card('Chapter ' + (i + 1) + ' is finished!', ['Well done. Next is ' + nx.name + ' (' + nx.year + ').'], [{ t: 'Next chapter', go: () => { hideCard(); nx.go(); } }, { t: 'Stay here', go: hideCard }]);
}
const CHAPTERS = [
  { year: 'About 1908', name: 'The print shop', ready: true, go: () => chapterFade('About 1908', 'A print shop in Kingston', resetChapter), done: () => best >= 3 },
  { year: 'July 1914', name: 'The first followers', ready: true, go: () => { toast('Loading the hall'); ensureHall().then(() => chapterFade('1914', 'A meeting hall in Kingston', resetChapter2)); }, done: () => best >= 14 }, { year: '1916', name: 'The streets of Harlem', ready: true, go: () => { toast('Loading Harlem'); ensureStreet().then(() => chapterFade('1916', 'Harlem, New York', resetChapter3)); }, done: () => best >= 23 }, { year: '1918 to 1919', name: 'The power of the press', ready: true, go: () => { toast('Loading the press room'); ensurePress().then(() => chapterFade('1918', 'The press room, Harlem', resetChapter4)); }, done: () => best >= 34 },
  { year: '1919', name: 'The Black Star Line', ready: true, go: () => { toast('Loading the dock'); ensureDock().then(() => chapterFade('1919', 'A dock in New York', resetChapter5)); }, done: () => best >= 44 }, { year: 'August 1920', name: 'The great convention', ready: true, go: () => { toast('Loading Liberty Hall'); ensureLiberty().then(() => chapterFade('August 1920', 'Liberty Hall, Harlem', resetChapter6)); }, done: () => best >= 54 }, { year: '1922 to 1927', name: 'The price of a dream', ready: true, go: () => { toast('Loading the office'); ensureOffice().then(() => chapterFade('1925', 'Amy Jacques Garvey\'s desk, Harlem', resetChapter7)); }, done: () => best >= 64 }, { year: '1927 to today', name: 'The question that remains', ready: true, go: () => { toast('Loading the park'); ensurePark().then(() => chapterFade('Today', 'National Heroes Park, Kingston', resetChapter8)); }, done: () => best >= 74 },
];
function renderChapters() {
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = !!c.ready && (i === 0 || CHAPTERS[i - 1].done() || stage >= 10 * i), dn = c.done ? c.done() : false, li = document.createElement('li'), b = document.createElement('button');
    b.className = 'chbtn' + (dn ? ' done' : ''); b.disabled = !open || !modelsReady;
    for (const [cls, txt] of [['yr', c.year], ['nm', c.name], ['st', !c.ready ? 'Coming soon' : !modelsReady ? 'Loading' : dn ? 'Done' : 'Play']]) { const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; b.appendChild(sp); }
    b.onclick = () => playChapter(c); li.appendChild(b); ul.appendChild(li); });
  $('chreset').textContent = 'Start again'; $('chreset').dataset.armed = '';
}
function openChapters() { closeJournal(); busy = true; keys.clear(); renderChapters(); $('chapters').hidden = false; const f = $('chlist').querySelector('button:not(:disabled)'); (f || $('chclose')).focus(); }
function closeChapters() { if ($('chapters').hidden) return; $('chapters').hidden = true; busy = panelsOpen(); if (state.started) canvas.focus(); }
function playChapter(c) { $('chapters').hidden = true; busy = false; if (!state.started) startGame(); c.go(); }
$('chclose').onclick = closeChapters; $('tchap').onclick = openChapters; $('jchap').onclick = openChapters;
function eraseAll() { erasing = true; try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } location.reload(); }
$('chreset').onclick = () => { const b = $('chreset'); if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Tap again to erase all progress'; return; } eraseAll(); };
function openCredits() { if (state.started) { closeJournal(); busy = true; keys.clear(); } $('credits').hidden = false; $('crclose').focus(); }
function closeCredits() { if ($('credits').hidden) return; $('credits').hidden = true; busy = panelsOpen(); }
$('dev').onclick = openCredits; $('chcred').onclick = () => { closeChapters(); openCredits(); }; $('crclose').onclick = closeCredits;
/* the reset button: this chapter again, the whole story again, or back to all games */
$('reset').onclick = () => { if (fading) return; closeJournal();
  card('Reset', ['Start this chapter again, or start the whole story again.'], [
    { t: 'Restart “' + CHAPTERS[stage >= 70 ? 7 : stage >= 60 ? 6 : stage >= 50 ? 5 : stage >= 40 ? 4 : stage >= 30 ? 3 : stage >= 20 ? 2 : stage >= 10 ? 1 : 0].name + '”', go: () => { hideCard(); CHAPTERS[stage >= 70 ? 7 : stage >= 60 ? 6 : stage >= 50 ? 5 : stage >= 40 ? 4 : stage >= 30 ? 3 : stage >= 20 ? 2 : stage >= 10 ? 1 : 0].go(); } },
    { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) },
    { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'All games', go: toMenu }] : [])]); };

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0, talkFull = false; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  busy = true; talkWith = n; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true;
  talkFull = wantsTalk(n);
  if (talkFull) lines = [...(typeof n.lines === 'function' ? n.lines() : n.lines)]; else { const later = typeof n.later === 'function' ? n.later() : n.later; lines = [{ who: n.who, text: later[n.heard++ % later.length] }]; }
  showLine();
}
function showLine() {
  const s = lines[step], me = s.who === 'You' || !!s.choices; if (s.unlock) unlock(s.unlock); $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me);
  const box = $('choices'); box.replaceChildren(); $('next').hidden = !!s.choices;
  if (s.choices) { s.choices.forEach((c) => { const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = c.t; b.onclick = () => choose(s, c); box.appendChild(b); }); box.firstChild.focus(); } else $('next').focus();
  const ac = talkWith && talkWith.m && talkWith.m.userData.anim; if (ac) { if (talkWith.seated) ac.play(sitClip(!me)); else if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(s, c) {   /* a choice: remember it, add the lines that answer it, and go on */
  uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || []));
  step++; if (step >= lines.length) endTalk(true); else showLine();
}
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  const n = talkWith; talkWith = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.m) n.m.userData.anim.play(n.seated ? sitClip(false) : null);
  if (finished && n && talkFull) { n.talked = true; saveGame(); onTalked(); }
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) activate(near); };

/* ---------- things to do: the type-setting activity (like Port Royal's ACTIONS, shown as a button when you stand at it) ---------- */
const SHOP_ACTIONS = [{ id: 'type', label: 'Set some type', x: -1.9, z: -2.3, r: 0.95, on: () => stage === 1, go: () => openType('NOTICE', () => { unlock('press'); setStage(2); uiSound('goal'); }) }];
let ACTIONS = SHOP_ACTIONS;
let typeWord = 'NOTICE', typeDone = null, typed = '';   /* real type is a mirror image of what prints, so the letters here are backwards too */
function openType(word, done) {
  if (busy) return; busy = true; keys.clear(); typed = ''; typeWord = word; typeDone = done; $('typeset').hidden = false; $('tword').textContent = typeWord; $('tprint').hidden = true; $('tpress').hidden = true; $('tdone').hidden = true;
  $('tcase').hidden = false; $('tstick').innerHTML = ''; for (let i = 0; i < typeWord.length; i++) { const sl = document.createElement('span'); sl.className = 'slot'; $('tstick').appendChild(sl); }
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((c) => !typeWord.includes(c)).sort(() => Math.random() - 0.5).slice(0, 6), letters = typeWord.split('').concat(pool); for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; }
  $('tcase').innerHTML = ''; for (const L of letters) { const b = document.createElement('button'); b.className = 'tile'; b.dataset.l = L; b.setAttribute('aria-label', 'Letter ' + L); b.innerHTML = '<span class="mir">' + L + '</span>'; b.onclick = () => tapTile(b, L); $('tcase').appendChild(b); }
  $('tmsg').textContent = 'Tap the letters in order. They are backwards, like real type.';
}
function tapTile(b, L) {
  if (typed.length >= typeWord.length || b.disabled) return;
  if (L === typeWord[typed.length]) { b.disabled = true; $('tstick').children[typed.length].innerHTML = '<span class="mir">' + L + '</span>'; typed += L; uiSound('tap');
    if (typed.length === typeWord.length) { $('tmsg').textContent = 'The type is set. Now press!'; $('tpress').hidden = false; $('tpress').focus(); } else $('tmsg').textContent = 'Good. Next letter: ' + typeWord[typed.length] + '.'; }
  else { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('tmsg').textContent = 'Not that one. Look at the word again.'; }
}
$('tpress').onclick = () => { pressThump(); $('tprint').textContent = typeWord; $('tprint').hidden = false; $('tcase').hidden = true; $('tpress').hidden = true; $('tdone').hidden = false; $('tmsg').textContent = 'Printed! The words come out the right way round.'; };
function closeType(done) { closePage(false); closeInspect(false); closeDecl(false); closeSort(false); closeLetter(false); closeTime(false); closeAnswer(false); if ($('typeset').hidden) return; $('typeset').hidden = true; busy = panelsOpen(); if (done && typeDone) { const f = typeDone; typeDone = null; f(); } }
$('tclose').onclick = () => closeType(false); $('tdone').onclick = () => closeType(true);

/* ---------- a glowing speech mark over each person, a bubble on the nearest, and the Talk button for things to do ---------- */
const BUBBLE = cv(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.fillStyle = '#f6c45c'; c.strokeStyle = 'rgba(70,45,10,0.85)'; c.lineWidth = 3; c.beginPath(); c.arc(64, 64, 15, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#fff3d0'; c.beginPath(); c.arc(59, 59, 5, 0, Math.PI * 2); c.fill(); });
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
for (const n of SHOP_PEOPLE) addMark(n);
const headTop = (n) => ((n.m && n.m.userData.ground) || 0) + (n.h || 1.8) * (n.seated ? 0.74 : 1) - 0.03;   /* the height of the top of someone's head or hat, standing on whatever they stand on */
const POSTER = __DEV__ && /[?&]shot=poster/.test(location.search);   /* the menu poster is rendered from this view with no marks or bubbles */
function bubbleTick(now) {
  const show = state.started && !busy && $('card').hidden && !POSTER;
  for (const n of PEOPLE) { const m = n.mark; if (!m) continue; if (!show || !n.m || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, headTop(n) + 0.3 + Math.sin(now * 2.4 + n.x) * 0.03, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, headTop(near) + 0.2, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = Math.max(r.top + (1 - TB.v.y) / 2 * r.height, r.top + 196) + 'px';   /* never up under the Goal tab and the buttons, even when the head is above the top of the screen */
  if (TB.el.dataset.label !== near.label) { TB.el.dataset.label = near.label; TB.el.innerHTML = TALK_SVG + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- the helper arrow (as in Port Royal): stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
function nudgeTarget() {   /* where the next thing to do is, as [x, z] */
  const a = ACTIONS.find((x) => x.on()); if (a) return [a.x, a.z];
  let best = null, bd = 1e9; for (const n of PEOPLE) if (n.m && n.m.visible && wantsTalk(n)) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; best = [n.x, n.z]; } } return best;
}
function nudgeTick(now) {
  const el = $('nudge'); if (!el) return;
  const quiet = state.started && !busy && $('dialogue').hidden && $('card').hidden && goalText && !fading;
  if (goalText !== NUDGE.goal) { NUDGE.goal = goalText; NUDGE.since = now; NUDGE.on = false; }
  if (Math.hypot(state.x - NUDGE.lx, state.z - NUDGE.lz) > 0.6) { NUDGE.lx = state.x; NUDGE.lz = state.z; NUDGE.still = now; }
  if (!quiet) { NUDGE.since = Math.max(NUDGE.since, now - 30000); NUDGE.still = now; }   /* time spent reading does not count */
  const tgt = quiet ? nudgeTarget() : null;
  if (!NUDGE.on && quiet && (now - NUDGE.still > 15000 || now - NUDGE.since > 50000)) { NUDGE.on = true; showGoal(); const g = $('goal'); g.classList.remove('nudge'); void g.offsetWidth; g.classList.add('nudge'); }
  if (NUDGE.on && tgt && Math.hypot(state.x - tgt[0], state.z - tgt[1]) < 2.2) { NUDGE.on = false; NUDGE.since = NUDGE.still = now; }   /* there: the Talk bubble or button takes over */
  if (!NUDGE.on || !tgt) { el.hidden = true; return; }
  el.hidden = false;
  const W = innerWidth, H = innerHeight, dx = tgt[0] - state.x, dz = tgt[1] - state.z, rel = Math.atan2(-dx, -dz) - state.yaw, a = Math.atan2(Math.sin(rel), Math.cos(rel));   /* a: 0 straight ahead, plus to the left */
  _nv.set(tgt[0], 2.1, tgt[1]).project(camera); const lab = el.querySelector('span');
  if (Math.abs(a) < 0.55 && _nv.z < 1) {   /* in front: a bouncing arrow points down at it */
    el.style.left = Math.max(60, Math.min(W - 60, (_nv.x + 1) / 2 * W)) + 'px'; el.style.top = Math.max(110, Math.min(H * 0.62, (1 - _nv.y) / 2 * H)) + 'px'; el.className = 'down'; const sy = (1 - _nv.y) / 2 * H; lab.textContent = sy > H * 0.75 ? 'Look down' : sy < 90 ? 'Look up' : 'Here!'; }
  else { const left = a > 0; el.style.left = (left ? 58 : W - 58) + 'px'; el.style.top = (H * 0.45) + 'px'; el.className = left ? 'left' : 'right'; lab.textContent = 'This way'; }   /* to the side or behind: a big arrow at the edge says which way to turn */
}

/* ---------- sound: each place has its own mix of the engine's beds, and now and then one small sound ---------- */
let auNext = 0, thumpAt = 7;
function pressThump() { if (!AU.ctx || !AU.on) return; for (let i = 0; i < 3; i++) { noiseHit(220, 1.2, 0.16, 0.1, 0.5, i * 0.55); tone(90, 55, 0.2, 'triangle', 0.04, 0.5, i * 0.55); } }
const SOUNDSCAPE = {   /* bed levels (room hum, crowd murmur, wind, sea, surf) and the small sound heard every few seconds */
  shop: { room: 0.28, crowd: 0.04, once: pressThump }, hall: { room: 0.22, crowd: 0.05 }, street: { crowd: 0.1, wind: 0.05 }, press: { room: 0.26, crowd: 0.03, once: pressThump },
  dock: { sea: 0.2, surf: 0.05, wind: 0.07, crowd: 0.04, once: () => (Math.random() < 0.5 ? gullCry() : shipCreak()) }, liberty: { room: 0.22, crowd: 0.12 }, office: { room: 0.18, crowd: 0.02 }, park: { wind: 0.05, crowd: 0.03, once: chirp } };
function audioTick(t) {
  if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1; const S = SOUNDSCAPE[place] || SOUNDSCAPE.shop;
  for (const k of ['room', 'crowd', 'wind', 'sea', 'surf']) if (AU.ch[k]) setG(AU.ch[k], S[k] || 0);
  if (t > thumpAt) { thumpAt = t + 6 + Math.random() * 6; if (S.once && AU.on) S.once(); }
}


/* ---------- chapter 2: a meeting hall in Kingston, July 1914 ---------- */
const hallG = new THREE.Group(); hallG.visible = false; scene.add(hallG);
const HALL = { x0: -5, x1: 5, z0: -4, z1: 4, h: 4.2 }, HALL_WALLS = [], HALL_BOUNDS = { x0: -4.5, x1: 4.5, z0: -3.5, z1: 3.55 };
const hallLamp = new THREE.PointLight(0xffd29a, 9, 13, 2); hallLamp.position.set(0, 3.3, -0.5); hallLamp.visible = false; scene.add(hallLamp);
let hallBuilt = false, posterMesh = null;
function buildHall() {
  if (hallBuilt) return; hallBuilt = true; const g = hallG, W2 = HALL.x1 - HALL.x0, D2 = HALL.z1 - HALL.z0, H2 = HALL.h;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([124, 92, 62], 7, [W2 / 1.05, D2 / 2]), 0.85), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([74, 56, 40], 8, [W2 / 1.2, D2 / 2]), 0.95), 0, H2, 0, g).rotation.x = Math.PI / 2;
  const wallP = (w, cx, cz, ry) => { const t = plasterT.clone(); t.needsUpdate = true; t.repeat.set(w / 3.4, 1); t.wrapT = THREE.ClampToEdgeWrapping; const p = mesh(new THREE.PlaneGeometry(w, H2), std(t, 1), cx, H2 / 2, cz, g); p.rotation.y = ry; };
  wallP(W2, 0, HALL.z0, 0); wallP(D2, HALL.x0, 0, Math.PI / 2); wallP(D2, HALL.x1, 0, -Math.PI / 2);
  const dw = 2.2, dh = 3.0, sw = (W2 - dw) / 2; wallP(sw, HALL.x0 + sw / 2, HALL.z1, Math.PI); wallP(sw, HALL.x1 - sw / 2, HALL.z1, Math.PI);
  box(dw + 0.3, H2 - dh, 0.14, solid(0xdccfb0, 1), 0, (dh + H2) / 2, HALL.z1 - 0.07, g);
  for (const x of [-dw / 2 - 0.07, dw / 2 + 0.07]) box(0.16, dh, 0.2, beam, x, dh / 2, HALL.z1 - 0.1, g); box(dw + 0.36, 0.18, 0.2, beam, 0, dh + 0.09, HALL.z1 - 0.1, g);
  mesh(new THREE.PlaneGeometry(16, 6), new THREE.MeshBasicMaterial({ map: streetTex() }), 0, 2.4, HALL.z1 + 3.6, g).rotation.y = Math.PI;
  mesh(new THREE.PlaneGeometry(16, 3.4), new THREE.MeshBasicMaterial({ color: 0xcdb98a }), 0, 0.01, HALL.z1 + 1.7, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(2.6, 3.2), patchM, 0, 0.013, HALL.z1 - 1.6, g).rotation.x = -Math.PI / 2;
  for (let z = HALL.z0 + 0.6; z < HALL.z1; z += 1.2) box(0.16, 0.24, W2, beam, 0, H2 - 0.12, z, g).rotation.y = Math.PI / 2;
  box(0.34, 0.4, D2, beam, -2.5, H2 - 0.35, 0, g); box(0.34, 0.4, D2, beam, 2.5, H2 - 0.35, 0, g);
  for (const side of ['L', 'R']) for (const z of [-2.2, 0.2, 2.4]) {   /* tall windows with the same shutters as the print shop */
    const w = 1.2, h = 1.9, sill = 1.0, y = sill + h / 2, gg = new THREE.Group(); gg.position.set(side === 'L' ? HALL.x0 : HALL.x1, 0, z); gg.rotation.y = side === 'L' ? Math.PI / 2 : -Math.PI / 2; g.add(gg);
    mesh(new THREE.PlaneGeometry(w, h), viewM, 0, y, 0.012, gg); for (const dx of [-w / 2, w / 2]) box(0.09, h + 0.12, 0.12, beam, dx, y, 0.05, gg); for (const dy of [sill - 0.03, sill + h + 0.03]) box(w + 0.2, 0.09, 0.12, beam, 0, dy, 0.05, gg); box(0.05, h, 0.06, beam, 0, y, 0.04, gg); box(w, 0.04, 0.06, beam, 0, y + h * 0.1, 0.04, gg);
    for (const dx of [-(w / 2 + w / 4 + 0.05), w / 2 + w / 4 + 0.05]) mesh(new THREE.PlaneGeometry(w / 2, h), louverM, dx, y, 0.02, gg); }
  for (const bx of [-2.6, 2.6]) for (const bz of [-1.2, 0.2, 1.4]) {   /* benches either side of the middle aisle */
    box(3.0, 0.08, 0.42, wood, bx, 0.46, bz, g); box(3.0, 0.5, 0.05, wood, bx, 0.78, bz + 0.22, g);   /* the backrest is behind the sitter, who faces the platform */ for (const dx of [-1.35, 1.35]) box(0.06, 0.46, 0.4, woodDark, bx + dx, 0.23, bz, g); HALL_WALLS.push([bx - 1.6, bz - 0.35, bx + 1.6, bz + 0.3]); }
  box(8.4, 0.25, 1.7, wood, 0, 0.125, HALL.z0 + 0.85, g); HALL_WALLS.push([-4.3, HALL.z0, 4.3, HALL.z0 + 1.75]);   /* the platform at the back, with a table and a lamp */
  box(2.2, 0.85, 0.8, woodDark, 0, 0.25 + 0.425, HALL.z0 + 0.7, g); box(2.4, 0.06, 0.95, wood, 0, 0.25 + 0.88, HALL.z0 + 0.7, g);
  cyl(0.07, 0.1, 0.22, brass, -0.6, 0.25 + 1.04, HALL.z0 + 0.7, g); cyl(0.09, 0.09, 0.2, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.7, transparent: true, opacity: 0.8 }), -0.6, 0.25 + 1.25, HALL.z0 + 0.7, g);
  for (const dx of [0.2, 0.6]) box(0.34, 0.02, 0.46, paper, dx, 0.25 + 0.93, HALL.z0 + 0.7, g);
  cyl(0.008, 0.008, 0.9, solid(0x222222), 0, H2 - 0.55, -0.5, g, 6); cyl(0.05, 0.16, 0.12, brass, 0, 3.15, -0.5, g); cyl(0.11, 0.11, 0.26, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 }), 0, 2.96, -0.5, g);
  box(0.05, 1.2, 1.0, woodDark, HALL.x1 - 0.06, 1.9, -1.0, g);   /* a notice board; the poster you print goes on it */
  posterMesh = mesh(new THREE.PlaneGeometry(0.62, 0.82), new THREE.MeshStandardMaterial({ map: sheetTex('LEARN'), roughness: 1 }), HALL.x1 - 0.1, 1.9, -1.0, g); posterMesh.rotation.y = -Math.PI / 2; posterMesh.visible = false;
  box(1.8, 0.9, 0.9, woodDark, 3.7, 0.45, 1.7, g); box(1.9, 0.06, 1.0, wood, 3.7, 0.93, 1.7, g); box(0.5, 0.34, 0.4, iron, 4.0, 1.13, 1.7, g); cyl(0.025, 0.025, 0.5, iron, 4.2, 1.3, 1.7, g, 6).rotation.z = 0.7;
  mesh(new THREE.PlaneGeometry(0.7, 0.42), std(caseTex(), 0.6), 3.35, 0.97, 1.7, g).rotation.x = -Math.PI / 2; box(0.3, 0.05, 0.22, paper, 3.55, 0.97, 2.05, g); HALL_WALLS.push([2.75, 1.15, 4.65, 2.25]);
}
const HALL_ACTIONS = [{ id: 'press', label: 'Print the poster', x: 2.3, z: 1.7, r: 1.1, on: () => stage === 11, go: () => openType(story.poster || 'LEARN', () => { story.printed = true; showPoster(); setStage(12); uiSound('goal'); }) }];
function showPoster() { if (!posterMesh) return; posterMesh.material.map = sheetTex(story.poster || 'LEARN'); posterMesh.material.needsUpdate = true; posterMesh.visible = !!story.printed; }
const NB = { elder: { LEARN: 'Your poster says LEARN. I never went to school.', WORK: 'Your poster says WORK. I have worked all my life.', UNITY: 'Your poster says UNITY. We are strong together.' },
  seller: { LEARN: 'LEARN? Good. I want my children to go to school.', WORK: 'WORK? Fair pay for fair work, I say.', UNITY: 'UNITY? My neighbours and I help each other already.' },
  youth: { LEARN: 'LEARN! Will there be books?', WORK: 'WORK! Will there be jobs for young people?', UNITY: 'UNITY! I will bring my friends.' } };
function neighbourLines(id) { const who = { elder: 'Older man', seller: 'Market seller', youth: 'Young man' }[id]; return [{ who, text: NB[id][story.poster || 'LEARN'] }, { who: 'You', text: 'Please come in. Everyone is welcome.' }, { who, text: id === 'youth' ? 'Thank you! I will stand near the front.' : 'Thank you. I will listen carefully.' }]; }
const word = (w) => ({ t: w, set: { poster: w }, then: [{ who: 'Marcus Garvey', text: w[0] + w.slice(1).toLowerCase() + '. Yes. Please print it on the press.' }] });
const HALL_PEOPLE = [
  { id: 'amy', model: 'amy1914', who: 'Amy Ashwood', label: 'Talk to Amy Ashwood', x: -1.6, z: 2.3, ry: Math.PI, base: 'Idle',
    lines: () => [{ who: 'Amy Ashwood', text: 'Welcome! Something new begins here today.' }, { who: 'You', text: 'What is it?' }, { who: 'Amy Ashwood', text: 'An association, so people can help each other.' }, { who: 'Amy Ashwood', text: 'I am Amy Ashwood. I am one of the first members.', unlock: 'amy' }],
    later: () => ({ 10: ['Please talk to Marcus Garvey too.'], 11: ['Please print our poster. The press table is on the right.'], 12: ['Our neighbours are arriving!'], 13: ['Marcus is about to speak.'], 14: ['We did it. This is only the beginning.'] })[stage] || ['Thank you for helping us.'] },
  { id: 'garvey', model: 'garvey1914', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: 0, z: -2.62, ry: 0, base: 'Idle', ground: 0.25,
    lines: () => stage === 13 ? [{ who: 'Marcus Garvey', text: 'Thank you all for coming.' }, { who: 'Marcus Garvey', text: 'Together we can help people, and build pride.' }, { who: 'Marcus Garvey', text: 'This is the Universal Negro Improvement Association.', unlock: 'unia' }, { who: 'Amy Ashwood', text: 'And everyone here is welcome to join.' }, { who: 'Marcus Garvey', text: 'It begins today, here in Kingston.' }]
      : [{ who: 'Marcus Garvey', text: 'Welcome. I have just come home from London.', unlock: 'garvey-home' }, { who: 'You', text: 'What will you do now?' }, { who: 'Marcus Garvey', text: 'Start an association, so people can help each other.' }, { who: 'Marcus Garvey', text: 'We will help people in need. We will build pride.' },
        { who: 'Marcus Garvey', text: 'What one word should our poster say?', choices: [word('LEARN'), word('WORK'), word('UNITY')] }],
    later: () => ({ 10: ['Please talk to Amy Ashwood too.'], 11: ['Please print the poster on the press.'], 12: ['Please welcome our guests.'], 14: ['Thank you for helping us begin.'] })[stage] || ['One moment, please.'] },
  { id: 'elder', model: 'nb_elder', who: 'Older man', label: 'Talk to the older man', x: -0.6, z: 6.5, ry: Math.PI, base: 'Idle', seat: [-1.9, 0.2], route: [[0, 3.4], [0, -0.5], [-1.9, -0.5]], lines: () => neighbourLines('elder'), later: () => ['I am glad I came.', 'Will Mr Garvey speak soon?'] },
  { id: 'seller', model: 'nb_seller', who: 'Market seller', label: 'Talk to the market seller', x: 0.6, z: 6.5, ry: Math.PI, base: 'Idle', seat: [1.9, 0.2], route: [[0, 3.4], [0, -0.5], [1.9, -0.5]], lines: () => neighbourLines('seller'), later: () => ['I closed my stall early to come.', 'What a good idea.'] },
  { id: 'youth', model: 'nb_youth', who: 'Young man', label: 'Talk to the young man', x: 0, z: 7.2, ry: Math.PI, base: 'Idle', seat: [-1.9, 1.4], route: [[0, 3.4], [0, 0.83], [-1.9, 0.83]], lines: () => neighbourLines('youth'), later: () => ['I told my friends too.', 'Can I help next time?'] },
];
for (const n of HALL_PEOPLE) initPerson(n);
for (const n of HALL_PEOPLE.slice(2)) n.hidden = true;   /* the neighbours arrive when the poster is printed */
function startArrivals() {
  HALL_PEOPLE.slice(2).forEach((n, i) => { if (!n.m) return; n.hidden = true; n.m.visible = false; n.x = (i - 1) * 0.6; n.z = 5.2; n.m.position.set(n.x, 0, n.z); n.m.rotation.y = Math.PI; n.legs = [...n.route.map((q) => q.slice()), n.seat.slice()]; n.dest = n.legs.shift(); n.seated = false; n.delay = 1.2 + i * 1.8; });   /* walk the aisle and the gap between the rows, then sit */
}
function loadPerson(n) {
  if (n.loading) return n.loading;
  n.loading = model(n.model).then((gl) => { const m = gl.scene; m.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; m.userData.ground = n.ground || 0; m.visible = false; scene.add(m); animate(m, n.base); grounded.push(m); n.m = m; m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m); n.h = Math.max(1.3, Math.min(2.3, bb.max.y - bb.min.y)); addMark(n); });   /* n.h: how tall this person is, so the speech mark can sit just above the head or hat */
  return n.loading;
}
let hallLoading = null;
function ensureHall() { if (!hallLoading) { buildHall(); hallLoading = Promise.all(HALL_PEOPLE.map(loadPerson)); } return hallLoading; }


/* ---------- chapter 3: a Harlem street, 1916 ---------- */
const streetG = new THREE.Group(); streetG.visible = false; scene.add(streetG);
const STREET_WALLS = [], STREET_BOUNDS = { x0: -12, x1: 12, z0: -4.3, z1: 4.3 };
let streetBuilt = false;
function facadeTex(v) {   /* a brick front: rows of tall windows with stone lintels and a cornice; v picks the colour and the number of windows */
  return cv(256, 512, (x, w, h) => {
    const base = [[150, 78, 56], [138, 92, 70], [120, 70, 58], [160, 102, 74], [110, 84, 76]][v % 5]; x.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; x.fillRect(0, 0, w, h);
    for (let r = 0; r < 64; r++) { x.fillStyle = 'rgba(40,24,18,0.16)'; x.fillRect(0, r * 8, w, 1); for (let c = (r % 2) * 16; c < w; c += 32) x.fillRect(c, r * 8, 1, 8); }
    x.fillStyle = 'rgba(30,20,14,0.12)'; for (let i = 0; i < 30; i++) { x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 12 + Math.random() * 40, 8 + Math.random() * 30, 0, 0, 7); x.fill(); }
    const cols = v % 2 ? 2 : 3, gap = w / cols;
    for (let r = 0; r < 4; r++) for (let c = 0; c < cols; c++) { const wx = c * gap + gap / 2 - 18, wy = 70 + r * 100 + (r === 3 ? 20 : 0); x.fillStyle = '#d9cbb0'; x.fillRect(wx - 5, wy - 8, 46, 8); x.fillStyle = '#1c2630'; x.fillRect(wx, wy, 36, 62); x.fillStyle = 'rgba(180,200,215,0.35)'; x.fillRect(wx + 2, wy + 2, 14, 28); x.fillStyle = '#e8ddc6'; x.fillRect(wx, wy + 30, 36, 3); x.fillRect(wx + 17, wy, 2, 62); }
    x.fillStyle = '#d9cbb0'; x.fillRect(0, 0, w, 26); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(0, 26, w, 4); x.fillStyle = '#c9bb9f'; x.fillRect(0, h - 70, w, 6);
    grain(x, w, h, 14); });
}
facadeTex = memo(facadeTex, (v) => (v % 5) + '/' + (v % 2));   /* the same ten fronts are shared by every street, room window and backdrop */
function buildStreet() {
  if (streetBuilt) return; streetBuilt = true; const g = streetG;
  const road = std(cv(256, 256, (x, w, h) => { x.fillStyle = '#5a5650'; x.fillRect(0, 0, w, h); for (let i = 0; i < 600; i++) { x.fillStyle = `rgba(${40 + Math.random() * 60 | 0},${40 + Math.random() * 60 | 0},${40 + Math.random() * 56 | 0},0.5)`; x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 5, 2 + Math.random() * 3); } x.fillStyle = 'rgba(30,26,22,0.35)'; x.fillRect(w * 0.3, 0, 6, h); x.fillRect(w * 0.7, 0, 6, h); }, [10, 3]), 1);
  mesh(new THREE.PlaneGeometry(60, 9), road, 0, 0, 0, g).rotation.x = -Math.PI / 2;
  const walk = std(cv(128, 128, (x, w, h) => { x.fillStyle = '#b6b0a2'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(60,56,50,0.5)'; x.lineWidth = 2; x.strokeRect(0, 0, w, h); x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.stroke(); grain(x, w, h, 12); }, [30, 2]), 1);
  for (const sz of [-1, 1]) { box(60, 0.15, 3.2, walk, 0, 0.075, sz * 6.1, g); box(60, 0.18, 0.25, solid(0x8a8678, 0.9), 0, 0.09, sz * 4.5, g); }
  for (let i = 0; i < 13; i++) for (const sz of [-1, 1]) {   /* a row of tall brick houses on each side, each with a stoop and a door */
    const x = -27 + i * 4.5, z = sz * 10.6, v = i + (sz > 0 ? 2 : 0), f = mesh(new THREE.PlaneGeometry(4.5, 11), std(facadeTex(v), 0.95), x, 5.5, sz * 7.58, g); f.rotation.y = sz > 0 ? Math.PI : 0;
    box(4.5, 11, 6, solid([0x6a4034, 0x5c4034, 0x70483a][v % 3], 1), x, 5.5, z, g); box(4.7, 0.5, 0.7, solid(0xcfc2a8, 0.9), x, 11.1, sz * 7.35, g);
    for (let k = 0; k < 3; k++) box(1.3, 0.2, 0.42, solid(0x9a9486, 0.9), x - 0.5, 0.1 + k * 0.2, sz * (7.35 - 0.2 - k * 0.4 + 1.2), g);
    box(0.95, 2.1, 0.12, solid(0x2a1d16, 0.8), x - 0.5, 1.9, sz * 7.5, g); box(1.1, 0.14, 0.18, solid(0xcfc2a8, 0.9), x - 0.5, 3.0, sz * 7.47, g); }
  for (const lx of [-9, -3, 3, 9]) for (const sz of [-1, 1]) { cyl(0.05, 0.07, 3.6, solid(0x202428, 0.6), lx, 1.8, sz * 4.7, g, 8); const lamp = cyl(0.22, 0.16, 0.34, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffd48a, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 }), lx, 3.7, sz * 4.7, g, 8); lamp.name = 'lamp'; }
  box(1.3, 0.5, 1.0, wood, 0, 0.25, 0.5, g); box(1.38, 0.05, 1.08, woodDark, 0, 0.525, 0.5, g); STREET_WALLS.push([-0.75, -0.05, 0.75, 1.05]);   /* the speaker's box: big enough to stand on with both feet well inside the edge, with a darker lid and a wall so nobody walks through it */
  for (const [bx, bz] of [[-0.6, -0.02], [0.6, -0.02], [-0.6, 1.02], [0.6, 1.02]]) box(0.08, 0.5, 0.08, woodDark, bx, 0.25, bz, g);
  for (const [x, z] of [[-10, 5.7], [8, -5.7], [-5, -5.9]]) { box(0.7, 0.5, 0.7, wood, x, 0.4, z, g); }
  mesh(new THREE.PlaneGeometry(90, 40), new THREE.MeshBasicMaterial({ map: cv(64, 128, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9ec8e6'); gr.addColorStop(0.7, '#e9eee4'); gr.addColorStop(1, '#d9d3c0'); x.fillStyle = gr; x.fillRect(0, 0, w, h); }) }), 0, 20, -34, g);
  mesh(new THREE.PlaneGeometry(90, 40), new THREE.MeshBasicMaterial({ color: 0xc9d8de }), 0, 20, 34, g).rotation.y = Math.PI;
}

const STREET_SPOTS = { worker: [-2.3, 1.7], woman: [2.4, 2.0], critic: [0.6, 3.2], garvey3: [0, 0.4] };
const faceToward = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const wordsIs = (w) => story.words === w;
const THEME = { work: 'Friends, everyone deserves fair work and fair pay.', learn: 'Friends, every child deserves a good school.', pride: 'Friends, we can be proud of who we are.' };
const theme = (id, t) => ({ t, set: { words: id }, then: [{ who: 'Marcus Garvey', text: THEME[id] }, { who: 'Marcus Garvey', text: 'Let us help each other, and build something together.' }, { who: 'Woman', text: ({ work: 'Yes! Fair work is what I hope for.', learn: 'Yes! My son must go to school.', pride: 'Yes! I do feel proud.' })[id] }] });
const answer = (id, t, reply) => ({ t, set: { answer: id }, then: [{ who: 'Older man', text: reply }] });
const STREET_PEOPLE = [
  { id: 'garvey3', model: 'garvey1916', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: 0, z: 0.4, ry: 0, base: 'Idle', ground: 0.55,
    lines: () => [{ who: 'Marcus Garvey', text: 'Welcome, friend. I have only just arrived in New York.', unlock: 'garvey-arrives' }, { who: 'You', text: 'People here have told me what they need.' }, { who: 'Marcus Garvey', text: 'Then I will listen to you. What should I speak about?', choices: [theme('work', 'Fair work'), theme('learn', 'Good schools'), theme('pride', 'Pride in who we are')] }],
    later: () => stage >= 22 ? ['Thank you for helping me find my words.'] : ['I will speak when everyone is ready.'] },
  { id: 'worker', model: 'hl_worker', who: 'Worker', label: 'Talk to the worker', x: STREET_SPOTS.worker[0], z: STREET_SPOTS.worker[1], ry: faceToward(-2.3, 1.7, 0, 0.5), base: 'Idle',
    lines: () => [{ who: 'Worker', text: 'I work long hours. The pay is small.', unlock: 'harlem' }, { who: 'You', text: 'What do you hope for?' }, { who: 'Worker', text: 'Fair pay, and a fair chance for my children.' }],
    later: () => ['Fair pay. That is all I ask.', 'I am listening.'] },
  { id: 'woman', model: 'hl_woman', who: 'Woman', label: 'Talk to the woman', x: STREET_SPOTS.woman[0], z: STREET_SPOTS.woman[1], ry: faceToward(2.4, 2.0, 0, 0.5), base: 'Idle',
    lines: () => [{ who: 'Woman', text: 'I came from Jamaica, hoping for a better life.' }, { who: 'You', text: 'Is it better here?' }, { who: 'Woman', text: 'Some days. I miss home. I want my son to learn.' }],
    later: () => stage >= 22 ? ['That was a good speech.'] : ['I miss the sea at home.', 'I hope my son will go to school.'] },
  { id: 'critic', model: 'hl_critic', who: 'Older man', label: 'Talk to the older man', x: STREET_SPOTS.critic[0], z: STREET_SPOTS.critic[1], ry: faceToward(0.6, 3.2, 0, 0.5), base: 'Idle',
    lines: () => stage === 22 ? [{ who: 'Older man', text: 'Fine words. But you are new here.' }, { who: 'Older man', text: 'Why should we trust him?', choices: [answer('listen', 'Listen, then decide for yourself', 'Fair. I will listen, and then decide.'), answer('watch', 'Watch what he does', 'Good. What a man does matters most.'), answer('ask', 'Ask him your questions', 'Then I will. I have many!')] }, { who: 'Older man', text: 'Not everyone will agree with him. That is fair.', unlock: 'unia-ny' }]
      : [{ who: 'Older man', text: 'Another street speaker? I have heard many.' }, { who: 'You', text: 'Do you disagree with them?' }, { who: 'Older man', text: 'I want proof, not only words.' }],
    later: () => stage >= 23 ? ['I will keep my eyes open.'] : ['Words are easy.', 'We shall see.'] },
];
for (const n of STREET_PEOPLE) initPerson(n);
let streetLoading = null;
function ensureStreet() { if (!streetLoading) { buildStreet(); streetLoading = Promise.all(STREET_PEOPLE.map(loadPerson)); } return streetLoading; }
function resetChapter3() {   /* the street corner again: the journal and your choices are kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); stage = 20; delete story.words; delete story.answer;
  for (const n of STREET_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('street'); setStage(20); showPlace();
}

/* ---------- chapter 4: the press room in Harlem, 1918 ---------- */
const pressG = new THREE.Group(); pressG.visible = false; scene.add(pressG);
const PRESS = { x0: -5, x1: 5, z0: -4, z1: 4, h: 4.2 }, PRESS_WALLS = [], PRESS_BOUNDS = { x0: -4.5, x1: 4.5, z0: -3.5, z1: 3.55 };
const pressLamp = new THREE.PointLight(0xffd29a, 9, 13, 2); pressLamp.position.set(0, 3.3, -0.5); pressLamp.visible = false; scene.add(pressLamp);
let pressBuilt = false, wallPage = null; const bundles = [];
const HEADLINES = { pride: 'Be Proud of Who You Are', learn: 'Read, Learn and Grow', unity: 'Stand Together' };   /* made up, and the journal says so */
function brickTex() { return cv(256, 256, (x, w, h) => { x.fillStyle = '#3c2a22'; x.fillRect(0, 0, w, h); const bh = 16, bw = 42; for (let r = 0; r * bh < h; r++) for (let c = -1; c * bw < w; c++) { const v = 0.82 + Math.random() * 0.3; x.fillStyle = `rgb(${128 * v | 0},${74 * v | 0},${58 * v | 0})`; x.fillRect(c * bw + (r % 2) * bw / 2 + 1, r * bh + 1, bw - 2, bh - 2); } grain(x, w, h, 10); }); }
brickTex = memo(brickTex);
function frontPageTex(head) {   /* the finished front page, as a picture for the wall */
  return cv(256, 340, (x, w, h) => { x.fillStyle = '#efe7d2'; x.fillRect(0, 0, w, h); x.fillStyle = '#1d1a16'; x.textAlign = 'center'; x.font = '700 27px Georgia, serif'; x.fillText('THE NEGRO WORLD', w / 2, 40); x.fillRect(14, 50, w - 28, 3); x.fillRect(14, 56, w - 28, 1);
    x.font = '700 20px Georgia, serif'; const rows = []; let cur = ''; for (const wd of head.split(' ')) { if ((cur + ' ' + wd).trim().length > 16) { rows.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); } rows.push(cur); rows.forEach((r, i) => x.fillText(r, w / 2, 86 + i * 24));
    const top = 96 + rows.length * 24; x.fillStyle = '#8a8272'; x.fillRect(16, top, 100, 84); x.fillStyle = '#1d1a16'; for (let i = 0; i < 14; i++) x.fillRect(126, top + i * 6, 100 + (i % 3) * 4, 3);
    for (let i = 0; i < 8; i++) x.fillRect(16, top + 98 + i * 14, w - 32, 3); x.font = '700 14px Georgia, serif'; x.fillText('5 cents', w - 44, h - 12); grain(x, w, h, 10); });
}
function buildPress() {
  if (pressBuilt) return; pressBuilt = true; const g = pressG, W2 = PRESS.x1 - PRESS.x0, D2 = PRESS.z1 - PRESS.z0, H2 = PRESS.h;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([92, 70, 50], 7, [W2 / 1.05, D2 / 2]), 0.9), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([62, 48, 36], 8, [W2 / 1.2, D2 / 2]), 0.95), 0, H2, 0, g).rotation.x = Math.PI / 2;
  const brick = brickTex(), wallP = (w, cx, cz, ry) => { const t = brick.clone(); t.needsUpdate = true; t.repeat.set(w / 2.6, H2 / 1.8); const p = mesh(new THREE.PlaneGeometry(w, H2), std(t, 1), cx, H2 / 2, cz, g); p.rotation.y = ry; };
  wallP(W2, 0, PRESS.z0, 0); wallP(D2, PRESS.x0, 0, Math.PI / 2); wallP(D2, PRESS.x1, 0, -Math.PI / 2);
  const dw = 2.2, dh = 3.0, sw = (W2 - dw) / 2; wallP(sw, PRESS.x0 + sw / 2, PRESS.z1, Math.PI); wallP(sw, PRESS.x1 - sw / 2, PRESS.z1, Math.PI);
  box(dw + 0.3, H2 - dh, 0.14, solid(0x6a4a3a, 1), 0, (dh + H2) / 2, PRESS.z1 - 0.07, g);
  for (const x of [-dw / 2 - 0.07, dw / 2 + 0.07]) box(0.16, dh, 0.2, beam, x, dh / 2, PRESS.z1 - 0.1, g); box(dw + 0.36, 0.18, 0.2, beam, 0, dh + 0.09, PRESS.z1 - 0.1, g);
  for (let i = 0; i < 4; i++) mesh(new THREE.PlaneGeometry(4.5, 9), new THREE.MeshBasicMaterial({ map: facadeTex(i + 1) }), -6.75 + i * 4.5, 4.5, PRESS.z1 + 3.4, g).rotation.y = Math.PI;   /* the houses across the street, seen through the door */
  mesh(new THREE.PlaneGeometry(18, 3.4), new THREE.MeshBasicMaterial({ color: 0xa9a291 }), 0, 0.01, PRESS.z1 + 1.7, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(2.6, 3.2), patchM, 0, 0.013, PRESS.z1 - 1.6, g).rotation.x = -Math.PI / 2;
  for (let z = PRESS.z0 + 0.6; z < PRESS.z1; z += 1.2) box(0.16, 0.24, W2, beam, 0, H2 - 0.12, z, g).rotation.y = Math.PI / 2;
  for (const [wx, wz, ry] of [[-2.6, PRESS.z0, 0], [2.6, PRESS.z0, 0], [PRESS.x0, 1.4, Math.PI / 2], [PRESS.x1, 1.4, -Math.PI / 2]]) {   /* tall windows, the same frames and shutters as the other rooms */
    const w = 1.2, h = 1.9, sill = 1.0, y = sill + h / 2, gg = new THREE.Group(); gg.position.set(wx, 0, wz); gg.rotation.y = ry; g.add(gg);
    mesh(new THREE.PlaneGeometry(w, h), viewM, 0, y, 0.012, gg); for (const dx of [-w / 2, w / 2]) box(0.09, h + 0.12, 0.12, beam, dx, y, 0.05, gg); for (const dy of [sill - 0.03, sill + h + 0.03]) box(w + 0.2, 0.09, 0.12, beam, 0, dy, 0.05, gg); box(0.05, h, 0.06, beam, 0, y, 0.04, gg); box(w, 0.04, 0.06, beam, 0, y + h * 0.1, 0.04, gg);
    for (const dx of [-(w / 2 + w / 4 + 0.05), w / 2 + w / 4 + 0.05]) mesh(new THREE.PlaneGeometry(w / 2, h), louverM, dx, y, 0.02, gg); }
  /* the press: an iron flatbed press against the right wall, with a flywheel */
  box(2.6, 0.7, 1.3, iron, 3.55, 0.35, -1.9, g); box(2.2, 0.5, 1.0, iron, 3.55, 0.95, -1.9, g); cyl(0.42, 0.42, 1.15, iron, 3.3, 1.45, -1.9, g, 20).rotation.x = Math.PI / 2;
  cyl(0.62, 0.62, 0.12, iron, 4.2, 1.15, -1.2, g, 26).rotation.x = Math.PI / 2; cyl(0.14, 0.14, 0.18, brass, 4.2, 1.15, -1.17, g, 12).rotation.x = Math.PI / 2; box(0.62, 0.02, 0.46, paper, 2.7, 1.22, -1.9, g);
  PRESS_WALLS.push([2.2, -2.6, 4.9, -1.1]);
  /* the stone table where a page is locked up, with a forme on it */
  box(2.4, 0.9, 1.1, woodDark, -1.4, 0.45, -1.2, g); mesh(new THREE.PlaneGeometry(2.5, 1.2), std(stoneTex(), 0.7), -1.4, 0.92, -1.2, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(0.9, 0.68), std(formeTex(), 0.6), -1.7, 0.93, -1.2, g).rotation.x = -Math.PI / 2; box(0.3, 0.05, 0.22, paper, -0.7, 0.95, -1.0, g); PRESS_WALLS.push([-2.7, -1.85, -0.1, -0.55]);
  /* type cases along the left wall */
  for (const z of [-2.6, -1.3, 0.0]) { box(0.7, 0.95, 1.1, woodDark, -4.55, 0.475, z, g); mesh(new THREE.PlaneGeometry(0.62, 1.0), std(caseTex(), 0.6), -4.55, 0.97, z, g).rotation.x = -Math.PI / 2; } PRESS_WALLS.push([-4.95, -3.2, -4.15, 0.6]);
  /* printed sheets hung up to dry along the back wall */
  cyl(0.01, 0.01, 8.4, solid(0x222222), 0, 2.75, -3.55, g, 4).rotation.z = Math.PI / 2; const dry = new THREE.MeshStandardMaterial({ map: sheetTex('NEWS'), roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) mesh(new THREE.PlaneGeometry(0.4, 0.55), dry, -3.6 + i * 0.9, 2.45, -3.55, g).rotation.z = (i % 3 - 1) * 0.04;
  /* the printed copies in bundles by the door */
  const cord = solid(0x3a2a1d, 0.9); [[3.0, 0.14, 3.2], [3.5, 0.14, 3.2], [4.0, 0.14, 3.2], [3.25, 0.4, 3.2], [3.75, 0.4, 3.2], [3.5, 0.66, 3.2]].forEach(([x, y, z]) => { const b = new THREE.Group(); b.position.set(x, y, z); g.add(b); box(0.44, 0.26, 0.34, paper, 0, 0, 0, b); box(0.46, 0.27, 0.04, cord, 0, 0, 0, b); box(0.04, 0.27, 0.36, cord, 0, 0, 0, b); b.visible = false; bundles.push(b); }); PRESS_WALLS.push([2.7, 2.9, 4.3, 3.55]);
  cyl(0.008, 0.008, 0.9, solid(0x222222), 0, H2 - 0.55, -0.5, g, 6); cyl(0.05, 0.16, 0.12, brass, 0, 3.15, -0.5, g); cyl(0.11, 0.11, 0.26, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 }), 0, 2.96, -0.5, g);
  box(0.74, 0.94, 0.05, woodDark, -4.0, 1.9, PRESS.z0 + 0.03, g);   /* the finished front page is pinned up here */
  wallPage = mesh(new THREE.PlaneGeometry(0.62, 0.82), new THREE.MeshStandardMaterial({ map: frontPageTex(HEADLINES.pride), roughness: 1 }), -4.0, 1.9, PRESS.z0 + 0.065, g); wallPage.visible = false;
}
function showWallPage() { if (!wallPage) return; wallPage.material.map = frontPageTex(HEADLINES[story.headline] || HEADLINES.pride); wallPage.material.needsUpdate = true; wallPage.visible = stage >= 32; }
const PRESS_SPOTS = { pressman: [2.0, -0.4], garvey4: [-0.2, -2.8], sailor: [2.7, 2.3] }, SAILOR_BACK = [0.9, 2.2];
function arrangePress() {   /* what the room shows at this stage: the page, the bundles and where the sailor stands */
  const sa = byId('sailor'), back = stage >= 33; sa.x = (back ? SAILOR_BACK : PRESS_SPOTS.sailor)[0]; sa.z = (back ? SAILOR_BACK : PRESS_SPOTS.sailor)[1]; sa.ry = faceToward(sa.x, sa.z, 0, 0); if (sa.m) { sa.m.position.set(sa.x, 0, sa.z); sa.m.rotation.y = sa.ry; }
  const left = stage < 32 ? 0 : stage < 33 ? 6 : ({ all: 0, split: 3, hold: 4 })[story.delivery] ?? 0; bundles.forEach((b, i) => { b.visible = i < left; }); showWallPage();
}
/* the front page activity: tap a piece, then the box where it belongs */
let pageDone = null, pageSel = null, pageLeft = 0;
const PAGE_BOXES = { title: ['bxTitle', 'The name of the paper'], head: ['bxHead', 'The big news'], pic: ['bxPic', 'A picture'], price: ['bxPrice', 'What it costs'] };
const PAGE_FACTS = { title: 'The name at the top is called the masthead.', head: 'The headline tells readers the main news.', pic: 'A picture helps people understand a story.', price: 'The paper costs five cents.' };
function openPage(done) {
  if (busy) return; busy = true; keys.clear(); pageDone = done; pageSel = null; pageLeft = 4; unlock('frontpage'); $('pagebuild').hidden = false; $('pgtray').style.display = ''; $('pgpress').hidden = true; $('pgdone').hidden = true;
  const pg = $('pgpage'); pg.replaceChildren(); for (const [k, [id, hint]] of Object.entries(PAGE_BOXES)) { const b = document.createElement('button'); b.className = 'bx'; b.id = id; b.dataset.k = k; b.textContent = hint; b.setAttribute('aria-label', 'Box: ' + hint); b.onclick = () => dropPiece(b); pg.appendChild(b); }
  const pieces = [['title', 'THE NEGRO WORLD'], ['head', HEADLINES[story.headline] || HEADLINES.pride], ['pic', 'A picture'], ['price', '5 cents']].sort(() => Math.random() - 0.5);
  const tr = $('pgtray'); tr.replaceChildren(); for (const [k, t] of pieces) { const b = document.createElement('button'); b.className = 'pc'; b.dataset.k = k; b.textContent = t; b.onclick = () => pickPiece(b); tr.appendChild(b); }
  $('pgmsg').textContent = '';
}
function pickPiece(b) { if (b.disabled) return; uiSound('tap'); pageSel = b; for (const x of $('pgtray').children) x.classList.toggle('sel', x === b); for (const x of $('pgpage').children) x.classList.toggle('hot', !x.disabled); }
function dropPiece(box) {
  if (box.disabled) return; if (!pageSel) { $('pgmsg').textContent = 'Pick a piece first.'; return; }
  const k = pageSel.dataset.k;
  if (k !== box.dataset.k) { box.classList.add('no'); setTimeout(() => box.classList.remove('no'), 400); $('pgmsg').textContent = 'That piece does not go there. Read it again.'; return; }
  uiSound('tap'); box.className = 'bx ok'; box.disabled = true; box.textContent = pageSel.textContent; box.style.fontSize = { title: '1.5rem', head: '1.2rem', pic: '.9rem', price: '1.1rem' }[k];
  if (k === 'pic') { box.style.background = '#8a8272'; box.style.color = '#efe7d2'; } pageSel.disabled = true; pageSel.classList.remove('sel'); pageSel = null; for (const x of $('pgpage').children) x.classList.remove('hot'); pageLeft--;
  $('pgmsg').textContent = PAGE_FACTS[k] + (pageLeft ? '' : ' The page is ready. Press!'); if (!pageLeft) { $('pgtray').style.display = 'none'; $('pgpress').hidden = false; $('pgpress').focus({ preventScroll: true }); }
}
$('pgpress').onclick = () => { pressThump(); $('pgpress').hidden = true; $('pgdone').hidden = false; $('pgdone').focus({ preventScroll: true }); $('pgmsg').textContent = 'Printed! The front page of the Negro World is ready.'; };
function closePage(done) { if ($('pagebuild').hidden) return; $('pagebuild').hidden = true; busy = panelsOpen(); if (done && pageDone) { const f = pageDone; pageDone = null; f(); } }
$('pgclose').onclick = () => closePage(false); $('pgdone').onclick = () => closePage(true);
const PRESS_ACTIONS = [{ id: 'layout', label: 'Lay out the front page', x: -1.4, z: -0.1, r: 1.2, on: () => stage === 31, go: () => openPage(() => { story.laid = true; unlock('negro-world'); setStage(32); arrangePress(); uiSound('goal'); }) }];
const headline = (id, t) => ({ t, set: { headline: id }, then: [{ who: 'Marcus Garvey', text: '“' + HEADLINES[id] + '.” Yes. That is the one.' }, { who: 'Marcus Garvey', text: 'Please lay out the front page on the stone table.' }] });
const ship = (id, t, reply) => ({ t, set: { delivery: id }, then: [{ who: 'Sailor', text: reply }, { who: 'Sailor', text: 'I will take them to my ship tonight. Wish me luck!' }] });
const BACK = { all: 'I took every bundle. At one port an officer took the biggest one. The rest were read by many.', split: 'I shared the bundles with friends. One was taken. The others were read.', hold: 'I took only a few. None were taken. But only a few people read them.' };
const PRESS_PEOPLE = [
  { id: 'pressman', model: 'hl_pressman', who: 'Pressman', label: 'Talk to the pressman', x: PRESS_SPOTS.pressman[0], z: PRESS_SPOTS.pressman[1], ry: faceToward(2.0, -0.4, -1.4, -1.0), base: 'Idle',
    lines: () => stage === 33 ? [{ who: 'Pressman', text: 'Some places banned our paper.' }, { who: 'Pressman', text: 'People still passed it from hand to hand.' }, { who: 'You', text: 'So the news still travelled.' }, { who: 'Pressman', text: 'It did. We print again tomorrow.' }]
      : [{ who: 'Pressman', text: 'This is our press. Type goes in, paper comes out.' }, { who: 'You', text: 'What do we print?' }, { who: 'Pressman', text: 'A new weekly paper, the Negro World.', unlock: 'negro-world' }, { who: 'Pressman', text: 'The stone table is where we lock up each page.' }],
    later: () => ({ 31: ['The stone table is on the left. Lay out the page there.'], 32: ['The sailor is by the door. Talk to him.'] })[stage] || ['Mind the ink. It stains!'] },
  { id: 'garvey4', model: 'garvey1916', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: PRESS_SPOTS.garvey4[0], z: PRESS_SPOTS.garvey4[1], ry: 0, base: 'Idle', ground: 0,
    lines: () => [{ who: 'Marcus Garvey', text: 'Welcome to our new paper.' }, { who: 'Marcus Garvey', text: 'We call it the Negro World.' }, { who: 'Marcus Garvey', text: 'It comes out every week. It costs five cents.' }, { who: 'Marcus Garvey', text: 'What should our big headline say?', choices: [headline('pride', HEADLINES.pride), headline('learn', HEADLINES.learn), headline('unity', HEADLINES.unity)] }],
    later: () => ({ 31: ['The front page is up to you.'], 32: ['Our paper must travel. Talk to the sailor.'] })[stage] || ['Thank you for your help.'] },
  { id: 'sailor', model: 'seaman1919', who: 'Sailor', label: 'Talk to the sailor', x: PRESS_SPOTS.sailor[0], z: PRESS_SPOTS.sailor[1], ry: faceToward(2.7, 2.3, 0, 0), base: 'Idle',
    lines: () => stage === 33 ? [{ who: 'Sailor', text: 'I am back! The paper travelled far.' }, { who: 'Sailor', text: BACK[story.delivery] || BACK.all }, { who: 'Sailor', text: 'In some places the paper was not allowed at all.', unlock: 'ban' }, { who: 'You', text: 'Why would anyone stop a newspaper?' }, { who: 'Sailor', text: 'Some leaders did not want people to read it.' }, { who: 'Sailor', text: 'But the news still found its readers.' }]
      : [{ who: 'Sailor', text: 'Good day! I work on a ship. We visit many ports.' }, { who: 'You', text: 'Will you take some papers with you?' }, { who: 'Sailor', text: 'Gladly. People far away want news from Harlem.' }, { who: 'Sailor', text: 'But some officers do not like this paper. How should I carry it?', choices: [ship('all', 'Take every bundle', 'Every bundle. Then many people can read it.'), ship('split', 'Share them with your friends', 'Small bundles, shared out. Then not all are lost if one is found.'), ship('hold', 'Take only a few', 'A few. Safer for me, but fewer people will read it.')] }],
    later: () => stage >= 33 ? ['It is good to be home.'] : ['My ship sails soon. Are the papers ready?'] },
];
for (const n of PRESS_PEOPLE) initPerson(n);
let pressLoading = null;
function ensurePress() { if (!pressLoading) { buildPress(); pressLoading = Promise.all(PRESS_PEOPLE.map(loadPerson)); } return pressLoading; }
function resetChapter4() {   /* the press room again: the page comes down, the journal and your choices in earlier chapters are kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); closePage(false); stage = 30; delete story.headline; delete story.delivery; delete story.laid;
  for (const n of PRESS_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('press'); setStage(30); showPlace();
}

/* ---------- chapter 5: a dock in New York, 1919 ---------- */
const dockG = new THREE.Group(); dockG.visible = false; scene.add(dockG);
const DOCK_WALLS = [], DOCK_BOUNDS = { x0: -9.2, x1: 9.2, z0: -3.6, z1: 3.4 };
let dockBuilt = false;
function signTex(lines, w = 512, h = 160) { return cv(w, h, (x) => { x.fillStyle = '#2b2118'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d6b45c'; x.lineWidth = 6; x.strokeRect(8, 8, w - 16, h - 16); x.fillStyle = '#efe3c0'; x.textAlign = 'center'; let y = 16; for (const [t, size] of lines) { y += size; x.font = '700 ' + size + 'px Georgia, serif'; x.fillText(t, w / 2, y); y += 12; } }); }
function buildDock() {
  if (dockBuilt) return; dockBuilt = true; const g = dockG;
  mesh(new THREE.PlaneGeometry(240, 240), std(cv(128, 128, (x, w, h) => { x.fillStyle = '#4c6f7c'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${120 + Math.random() * 60 | 0},${160 + Math.random() * 50 | 0},${180 + Math.random() * 40 | 0},0.18)`; x.fillRect(Math.random() * w, Math.random() * h, 10 + Math.random() * 22, 2); } }, [40, 40]), 0.35), 0, -0.7, 0, g).rotation.x = -Math.PI / 2;
  box(20.4, 0.7, 8.6, woodDark, 0, -0.35, 0, g); mesh(new THREE.PlaneGeometry(20.4, 8.6), std(plankTex([118, 90, 62], 7, [20.4 / 1.05, 8.6 / 2]), 0.9), 0, 0.005, 0, g).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 14; i++) cyl(0.16, 0.18, 1.4, woodDark, -9.6 + i * 1.5, -0.7, 4.4, g, 8);   /* pilings along the edge */
  for (const bx of [-6.5, -2, 2.5, 7]) { cyl(0.18, 0.26, 0.5, iron, bx, 0.25, 4.0, g, 12); }   /* bollards */
  for (let i = 0; i < 5; i++) mesh(new THREE.PlaneGeometry(4.5, 9), std(facadeTex(i + 3), 0.95), -9 + i * 4.5, 4.5, -4.5, g);   /* warehouses behind the dock */
  /* the old ship, moored on the far side of a gap of water */
  const hullM = solid(0x23262b, 0.7), white = solid(0xdcd6c4, 0.8), rust = solid(0x6b3a2a, 0.9);
  box(13, 2.6, 3.4, hullM, 0, 0.6, 8.4, g); box(13.05, 0.22, 3.45, solid(0x7a2e24, 0.8), 0, -0.55, 8.4, g);
  const bow = new THREE.ExtrudeGeometry((() => { const sh = new THREE.Shape(); sh.moveTo(0, -1.7); sh.lineTo(2.8, 0); sh.lineTo(0, 1.7); sh.closePath(); return sh; })(), { depth: 2.6, bevelEnabled: false }); bow.rotateX(-Math.PI / 2); const bw = mesh(bow, hullM, 6.5, -0.7, 8.4, g); bw.rotation.y = 0;
  box(12.9, 0.1, 0.1, white, 0, 1.75, 6.68, g); box(8.6, 1.5, 2.2, white, -1.0, 2.9, 8.4, g); box(3.2, 1.0, 1.8, white, -0.6, 4.2, 8.4, g);
  cyl(0.38, 0.42, 2.0, solid(0x16181b, 0.7), -2.6, 4.2, 8.4, g, 16); cyl(0.4, 0.4, 0.4, solid(0x16181b, 0.7), -2.6, 5.3, 8.4, g, 16);
  for (const mx of [3.8, -5.2]) { cyl(0.07, 0.1, 6.2, woodDark, mx, 4.5, 8.4, g, 8); box(0.05, 0.05, 2.4, woodDark, mx, 6.0, 8.4, g); }
  for (const lx of [-3.8, 1.6, 3.2]) box(1.4, 0.5, 0.7, rust, lx, 2.2, 6.9, g);
  for (let i = 0; i < 12; i++) cyl(0.025, 0.025, 0.7, white, -6 + i * 1.1, 2.1, 6.72, g, 5);
  box(0.9, 0.06, 3.1, wood, 0, 1.1, 5.4, g).rotation.x = -0.62;   /* a gangway from the dock to the deck */
  mesh(new THREE.PlaneGeometry(2.8, 0.7), new THREE.MeshBasicMaterial({ map: signTex([['YARMOUTH', 60]], 512, 128) }), -4.2, 1.3, 6.69, g).rotation.y = Math.PI;
  /* the share table, with a sign */
  box(2.3, 0.9, 0.9, woodDark, -4.5, 0.45, -0.9, g); box(2.4, 0.06, 1.0, wood, -4.5, 0.93, -0.9, g); box(0.34, 0.02, 0.45, paper, -5.1, 0.97, -0.9, g); box(0.34, 0.02, 0.45, paper, -4.7, 0.97, -0.85, g); cyl(0.05, 0.07, 0.2, brass, -3.8, 1.05, -0.9, g, 10);
  mesh(new THREE.PlaneGeometry(2.6, 0.82), new THREE.MeshBasicMaterial({ map: signTex([['BLACK STAR LINE', 52], ['SHARES FIVE DOLLARS EACH', 30]], 512, 160) }), -4.5, 2.5, -2.4, g); box(0.07, 2.4, 0.07, beam, -5.75, 1.2, -2.4, g); box(0.07, 2.4, 0.07, beam, -3.25, 1.2, -2.4, g); DOCK_WALLS.push([-5.75, -2.3, -3.2, -0.4]);   /* the sign stands well behind the clerk, who stands behind the table */
  /* crates, barrels and rope */
  const crate = (x, z, s2, y2 = 0) => { box(s2, s2, s2, wood, x, s2 / 2 + y2, z, g).rotation.y = x * 0.7; DOCK_WALLS.push([x - s2 * 0.75, z - s2 * 0.75, x + s2 * 0.75, z + s2 * 0.75]); };
  crate(6.2, -2.4, 0.9); crate(7.1, -2.2, 0.8); crate(6.5, -2.3, 0.7, 0.9); crate(-8, 1.2, 0.9); crate(-8.2, 2.2, 0.8);
  for (const [bx, bz] of [[7.6, 0.4], [8.2, 1.2], [7.4, 1.4]]) { cyl(0.34, 0.34, 0.8, woodDark, bx, 0.4, bz, g, 14); cyl(0.35, 0.35, 0.06, iron, bx, 0.55, bz, g, 14); DOCK_WALLS.push([bx - 0.4, bz - 0.4, bx + 0.4, bz + 0.4]); }
  mesh(new THREE.TorusGeometry(0.4, 0.1, 8, 20), solid(0x8c7a52, 1), 0.8, 0.12, 3.5, g).rotation.x = Math.PI / 2;
  for (const lx of [-7, 0, 7]) { cyl(0.05, 0.07, 3.6, solid(0x202428, 0.6), lx, 1.8, -3.9, g, 8); cyl(0.22, 0.16, 0.34, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffd48a, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 }), lx, 3.7, -3.9, g, 8); }
}
const DOCK_SPOTS = { garvey5: [1.4, -0.4], clerk: [-4.5, -1.8], engineer: [5.0, 2.0], friend: [-1.6, 1.4] };
let inspected = 0;
const INSPECT = { hull: ['Hull', 'The paint looks fresh. Under it, the plates are rusty.'], engine: ['Engine', 'The engineer says it runs, but it is very old and will need many repairs.'], deck: ['Deck', 'The planks are worn, and some of the rails are loose.'] };
let inspectDone = null, inspectSeen = {};
function openInspect(done) {
  if (busy) return; busy = true; keys.clear(); inspectDone = done; inspectSeen = {}; state.yaw = Math.PI; state.pitch = 0.12; $('inspect').hidden = false; $('indone').hidden = true; $('inmsg').textContent = 'Tap each part of the ship to look at it.';
  const row = $('inrow'); row.replaceChildren(); for (const [k, [t]] of Object.entries(INSPECT)) { const b = document.createElement('button'); b.className = 'pc'; b.dataset.k = k; b.textContent = t; b.onclick = () => lookAt(b, k); row.appendChild(b); }
}
function lookAt(b, k) {
  uiSound('tap'); inspectSeen[k] = true; b.classList.add('sel'); $('inmsg').textContent = INSPECT[k][1];
  if (Object.keys(INSPECT).every((x) => inspectSeen[x])) { $('indone').hidden = false; $('indone').focus({ preventScroll: true }); $('inmsg').textContent += ' You have looked at everything. The ship is old.'; }
}
function closeInspect(done) { if ($('inspect').hidden) return; $('inspect').hidden = true; busy = panelsOpen(); if (done && inspectDone) { const f = inspectDone; inspectDone = null; f(); } }
$('inclose').onclick = () => closeInspect(false); $('indone').onclick = () => closeInspect(true);
const DOCK_ACTIONS = [{ id: 'inspect', label: 'Look the old ship over', x: 0, z: 3.0, r: 1.6, on: () => stage === 41, go: () => openInspect(() => { unlock('shares'); setStage(42); uiSound('goal'); }) }];
const plan = (id, t, reply) => ({ t, set: { plan: id }, then: [{ who: 'Marcus Garvey', text: reply }, { who: 'Marcus Garvey', text: 'People have paid their money. They want to see a ship.' }, { who: 'Marcus Garvey', text: 'So I will buy this one. Thank you for your honest advice.' }] });
const advice = (id, t, reply) => ({ t, set: { advice: id }, then: [{ who: 'Friend', text: reply }] });
const DOCK_PEOPLE = [
  { id: 'garvey5', model: 'garvey1916', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: DOCK_SPOTS.garvey5[0], z: DOCK_SPOTS.garvey5[1], ry: faceToward(1.4, -0.4, 0, 3), base: 'Idle', ground: 0,
    lines: () => stage === 42 ? [{ who: 'You', text: 'The ship is old. It needs many repairs.' }, { who: 'Marcus Garvey', text: 'I know. We have little money, and people are waiting.' }, { who: 'Marcus Garvey', text: 'Should we buy this ship now, or save for a better one?', choices: [plan('now', 'Buy it now', 'Now. Yes, a ship people can see is a strong thing.'), plan('wait', 'Save for a better ship', 'A better ship would cost much more.')] }]
      : [{ who: 'Marcus Garvey', text: 'Welcome to the dock. We are starting a shipping company.', unlock: 'bsl' }, { who: 'Marcus Garvey', text: 'It is called the Black Star Line.' }, { who: 'Marcus Garvey', text: 'People will buy shares, and with the money we will buy ships.' }, { who: 'Marcus Garvey', text: 'Please look at our first ship.' }, { who: 'Marcus Garvey', text: 'Talk to the clerk and the engineer first.' }],
    later: () => ({ 41: ['Please look the ship over. The edge of the dock is the best place.'], 43: ['A friend of yours is waiting to talk to you.'] })[stage] || ['Thank you for your help.'] },
  { id: 'clerk', model: 'clerk1919', who: 'Share clerk', label: 'Talk to the share clerk', x: DOCK_SPOTS.clerk[0], z: DOCK_SPOTS.clerk[1], ry: 0, base: 'Idle',
    lines: () => [{ who: 'Share clerk', text: 'Shares in the Black Star Line! Five dollars each.', unlock: 'shares' }, { who: 'You', text: 'What is a share?' }, { who: 'Share clerk', text: 'A small part of the company. Many people can afford one.' }, { who: 'Share clerk', text: 'If the company does well, the owners do well too.' }],
    later: () => ['Shares, five dollars each!', 'Come and join us.'] },
  { id: 'engineer', model: 'engineer1919', who: 'Engineer', label: 'Talk to the engineer', x: DOCK_SPOTS.engineer[0], z: DOCK_SPOTS.engineer[1], ry: faceToward(5.0, 2.0, 0, 5), base: 'Idle',
    lines: () => [{ who: 'Engineer', text: 'I look after the engine of this ship.' }, { who: 'You', text: 'Is she a good ship?' }, { who: 'Engineer', text: 'She is old. She has carried coal for years.' }, { who: 'Engineer', text: 'Look her over yourself. Start at the dock edge.' }],
    later: () => ['Mind the ropes.', 'She is old, but she floats.'] },
  { id: 'friend', model: 'hl_woman', who: 'Friend', label: 'Talk to your friend', x: DOCK_SPOTS.friend[0], z: DOCK_SPOTS.friend[1], ry: faceToward(-1.6, 1.4, -4.5, -0.9), base: 'Idle',
    lines: () => stage === 43 ? [{ who: 'Friend', text: 'I have saved a little money. I want to buy shares.' }, { who: 'Friend', text: 'You have seen the ship. What should I do?', choices: [advice('truth', 'Tell the truth: the ship is old', 'Thank you for telling me. I will buy just one share.'), advice('cheer', 'Say it will surely succeed', 'Then I will buy five shares! Thank you!'), advice('wait', 'Say wait and see', 'Good idea. I will wait and look again next month.')] }]
      : [{ who: 'Friend', text: 'I am thinking about buying a share.' }, { who: 'You', text: 'It is a big choice.' }, { who: 'Friend', text: 'It is. My savings are small.' }],
    later: () => stage >= 44 ? ({ truth: ['I bought one share. I hope for the best.'], cheer: ['I bought five shares. I hope you were right.'], wait: ['I am waiting and watching the ship.'] })[story.advice] || ['Thank you.'] : ['I am still thinking.'] },
];
for (const n of DOCK_PEOPLE) initPerson(n);
let dockLoading = null;
function ensureDock() { if (!dockLoading) { buildDock(); dockLoading = Promise.all(DOCK_PEOPLE.map(loadPerson)); } return dockLoading; }
function resetChapter5() {   /* the dock again: your choices here are cleared, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); closePage(false); closeInspect(false); stage = 40; delete story.plan; delete story.advice;
  for (const n of DOCK_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('dock'); setStage(40); showPlace();
}

/* ---------- chapter 6: Liberty Hall, Harlem, August 1920 ---------- */
const libG = new THREE.Group(); libG.visible = false; scene.add(libG);
const LIB = { x0: -7, x1: 7, z0: -5.5, z1: 5.5, h: 5.6 }, LIB_WALLS = [], LIB_BOUNDS = { x0: -6.5, x1: 6.5, z0: -3.3, z1: 5.0 };
const libLamp = new THREE.PointLight(0xffd29a, 16, 20, 2); libLamp.position.set(0, 4.6, -0.5); libLamp.visible = false; scene.add(libLamp);
let libBuilt = false, bannerMesh = null;
const RBG = { red: '#b3262b', black: '#14141a', green: '#1f7a3d' }, RBG_ORDER = ['red', 'black', 'green'];   /* Item 39 of the Declaration names them in this order */
function bannerTex(done) { return cv(512, 160, (x, w, h) => { if (done) { RBG_ORDER.forEach((c, i) => { x.fillStyle = RBG[c]; x.fillRect(0, i * h / 3, w, h / 3 + 1); }); } else { x.fillStyle = '#e2d8bb'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(80,66,44,0.5)'; x.setLineDash([10, 8]); x.lineWidth = 3; x.strokeRect(10, 10, w - 20, h - 20); } grain(x, w, h, 10); }); }
function buildLiberty() {
  if (libBuilt) return; libBuilt = true; const g = libG, W2 = LIB.x1 - LIB.x0, D2 = LIB.z1 - LIB.z0, H2 = LIB.h;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([128, 98, 68], 8, [W2 / 1.05, D2 / 2]), 0.85), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([78, 60, 44], 8, [W2 / 1.2, D2 / 2]), 0.95), 0, H2, 0, g).rotation.x = Math.PI / 2;
  const wallP = (w, cx, cz, ry) => { const t = plasterT.clone(); t.needsUpdate = true; t.repeat.set(w / 3.4, 1); t.wrapT = THREE.ClampToEdgeWrapping; const p = mesh(new THREE.PlaneGeometry(w, H2), std(t, 1), cx, H2 / 2, cz, g); p.rotation.y = ry; };
  wallP(W2, 0, LIB.z0, 0); wallP(D2, LIB.x0, 0, Math.PI / 2); wallP(D2, LIB.x1, 0, -Math.PI / 2);
  const dw = 2.4, dh = 3.2, sw = (W2 - dw) / 2; wallP(sw, LIB.x0 + sw / 2, LIB.z1, Math.PI); wallP(sw, LIB.x1 - sw / 2, LIB.z1, Math.PI);
  box(dw + 0.3, H2 - dh, 0.14, solid(0xdccfb0, 1), 0, (dh + H2) / 2, LIB.z1 - 0.07, g); for (const x of [-dw / 2 - 0.07, dw / 2 + 0.07]) box(0.16, dh, 0.2, beam, x, dh / 2, LIB.z1 - 0.1, g); box(dw + 0.36, 0.18, 0.2, beam, 0, dh + 0.09, LIB.z1 - 0.1, g);
  for (let i = 0; i < 4; i++) mesh(new THREE.PlaneGeometry(4.5, 9), new THREE.MeshBasicMaterial({ map: facadeTex(i + 2) }), -6.75 + i * 4.5, 4.5, LIB.z1 + 3.4, g).rotation.y = Math.PI;
  mesh(new THREE.PlaneGeometry(18, 3.4), new THREE.MeshBasicMaterial({ color: 0xa9a291 }), 0, 0.01, LIB.z1 + 1.7, g).rotation.x = -Math.PI / 2;
  for (const z of [-4.5, -1.5, 1.5, 4.5]) box(W2, 0.3, 0.3, beam, 0, H2 - 0.15, z, g);
  for (const side of [-1, 1]) for (const z of [-3.2, 0, 3.0]) {   /* tall windows high in the side walls */
    const w = 1.3, h = 2.4, sill = 1.4, y = sill + h / 2, gg = new THREE.Group(); gg.position.set(side < 0 ? LIB.x0 : LIB.x1, 0, z); gg.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; g.add(gg);
    mesh(new THREE.PlaneGeometry(w, h), viewM, 0, y, 0.012, gg); for (const dx of [-w / 2, w / 2]) box(0.1, h + 0.12, 0.12, beam, dx, y, 0.05, gg); for (const dy of [sill - 0.03, sill + h + 0.03]) box(w + 0.2, 0.1, 0.12, beam, 0, dy, 0.05, gg); box(0.05, h, 0.06, beam, 0, y, 0.04, gg); }
  /* the platform at the back, with a lectern, and the banner above it */
  box(10.4, 0.4, 2.0, wood, 0, 0.2, LIB.z0 + 1.0, g); LIB_WALLS.push([-5.2, LIB.z0, 5.2, LIB.z0 + 2.05]);
  box(0.9, 1.1, 0.6, woodDark, 2.2, 0.4 + 0.55, LIB.z0 + 1.2, g); box(1.0, 0.06, 0.7, wood, 2.2, 0.4 + 1.13, LIB.z0 + 1.2, g).rotation.x = 0.15;
  bannerMesh = mesh(new THREE.PlaneGeometry(6.4, 2.0), new THREE.MeshStandardMaterial({ map: bannerTex(false), roughness: 1 }), 0, 3.6, LIB.z0 + 0.04, g); box(6.6, 0.1, 0.1, woodDark, 0, 4.66, LIB.z0 + 0.06, g);
  /* rows of chairs either side of a middle aisle */
  const seatG = new THREE.BoxGeometry(0.46, 0.06, 0.42), backG = new THREE.BoxGeometry(0.46, 0.5, 0.05), chairs = [];
  for (const side of [-1, 1]) for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) chairs.push([side * (1.9 + c * 0.9), -2.2 + r * 0.95]);
  const seats = new THREE.InstancedMesh(seatG, wood, chairs.length), backs = new THREE.InstancedMesh(backG, wood, chairs.length), m4 = new THREE.Matrix4();
  chairs.forEach(([x, z], i) => { m4.makeTranslation(x, 0.46, z); seats.setMatrixAt(i, m4); m4.makeTranslation(x, 0.74, z - 0.2); backs.setMatrixAt(i, m4); }); g.add(seats, backs);
  LIB_WALLS.push([-6.5, -2.7, -1.45, 2.95], [1.45, -2.7, 6.5, 2.95]);
  /* a table for the Declaration, near the door */
  box(1.6, 0.74, 0.8, woodDark, 4.8, 0.37, 4.0, g); box(1.7, 0.06, 0.9, wood, 4.8, 0.77, 4.0, g); box(0.6, 0.02, 0.8, paper, 4.8, 0.81, 4.0, g); LIB_WALLS.push([3.95, 3.55, 5.65, 4.45]);
  for (const lx of [-3.5, 0, 3.5]) { cyl(0.008, 0.008, 1.0, solid(0x222222), lx, H2 - 0.65, 0, g, 6); cyl(0.07, 0.2, 0.14, brass, lx, 4.15, 0, g); cyl(0.13, 0.13, 0.3, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 }), lx, 3.95, 0, g); }
}
function showBanner() { if (!bannerMesh) return; bannerMesh.material.map = bannerTex(!!story.banner); bannerMesh.material.needsUpdate = true; }
/* the Declaration: read one real line, then colour the banner in the order the line gives */
let declDone = null, declStep = 0;
function openDecl(done) {
  if (busy) return; busy = true; keys.clear(); declDone = done; declStep = 0; unlock('declaration'); $('decl').hidden = false; $('dcdone').hidden = true; $('dcmsg').textContent = '';
  for (const sp of $('dcbanner').children) { sp.style.background = ''; sp.style.opacity = ''; } for (const b of $('dccolors').children) { b.disabled = false; b.classList.remove('sel'); }
}
function pickColour(b) {
  const c = b.dataset.c; if (c !== RBG_ORDER[declStep]) { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('dcmsg').textContent = 'Read the line again. It gives the colours in an order.'; return; }
  uiSound('tap'); const sp = $('dcbanner').children[declStep]; sp.style.background = RBG[c]; sp.style.opacity = 1; b.disabled = true; declStep++;
  if (declStep === 3) { $('dcmsg').textContent = 'The banner is ready. These became the colours of the movement.'; $('dcdone').hidden = false; $('dcdone').focus({ preventScroll: true }); } else $('dcmsg').textContent = 'Good. What comes next in the line?';
}
for (const b of $('dccolors').children) b.onclick = () => pickColour(b);
function closeDecl(done) { if ($('decl').hidden) return; $('decl').hidden = true; busy = panelsOpen(); if (done && declDone) { const f = declDone; declDone = null; f(); } }
$('dcx').onclick = () => closeDecl(false); $('dcdone').onclick = () => closeDecl(true);
const LIB_ACTIONS = [{ id: 'declaration', label: 'Read the Declaration', x: 4.8, z: 3.0, r: 1.3, on: () => stage === 52, go: () => openDecl(() => { story.banner = true; showBanner(); setStage(53); uiSound('goal'); }) }];
const help = (id, t, reply) => ({ t, set: { helped: id }, then: [{ who: 'Steward', text: reply }, { who: 'Steward', text: 'I will go to the others right after. Thank you.' }] });
const thanks = (id, other) => () => stage >= 52 ? [story.helped === id ? 'Thank you for helping me first!' : other] : null;
const LIB_PEOPLE = [
  { id: 'nurse', model: 'nurse1920', who: 'Nurse', label: 'Talk to the nurse', x: -3.6, z: 3.6, ry: faceToward(-3.6, 3.6, 0, 0), base: 'Idle',
    lines: () => [{ who: 'Nurse', text: 'I am a Black Cross Nurse. We help with health and first aid.', unlock: 'nurses' }, { who: 'You', text: 'That basket looks heavy.' }, { who: 'Nurse', text: 'It is full of bandages.' }, { who: 'Nurse', text: 'I must take it to the first aid room.' }],
    later: () => thanks('nurse', 'The steward came to me soon after. All is well.')() || ['I must take this basket to the first aid room.'] },
  { id: 'delegate', model: 'delegate1920', who: 'Traveller', label: 'Talk to the traveller', x: 3.0, z: 3.5, ry: faceToward(3.0, 3.5, 0, 0), base: 'Idle',
    lines: () => [{ who: 'Traveller', text: 'I came by ship from far away. The trip took many days.' }, { who: 'You', text: 'You must be tired.' }, { who: 'Traveller', text: 'I am. I need a seat before the meeting.' }],
    later: () => thanks('delegate', 'The steward found me a seat soon after. Thank you.')() || ['My legs are tired from the journey.'] },
  { id: 'messenger', model: 'nb_youth', who: 'Messenger', label: 'Talk to the messenger', x: 0.2, z: 4.4, ry: faceToward(0.2, 4.4, 0, 0), base: 'Idle',
    lines: () => [{ who: 'Messenger', text: 'I carry messages around the hall.' }, { who: 'Messenger', text: 'But I have lost the programme sheets!' }, { who: 'You', text: 'When does the meeting start?' }, { who: 'Messenger', text: 'Very soon. What shall I do?' }],
    later: () => thanks('messenger', 'The steward helped me find them soon after. Thank you.')() || ['Where could those sheets be?'] },
  { id: 'steward', model: 'steward1920', who: 'Steward', label: 'Talk to the steward', x: -0.9, z: 2.3, ry: faceToward(-0.9, 2.3, 0, 4), base: 'Idle',
    lines: () => stage === 51 ? [{ who: 'Steward', text: 'Three people need help, and I can only help one at a time.' }, { who: 'Steward', text: 'Who should I help first?', choices: [help('nurse', 'The nurse with the heavy basket', 'The nurse first. Bandages must reach the first aid room.'), help('delegate', 'The tired traveller', 'The traveller first. A long journey is hard.'), help('messenger', 'The messenger with the lost sheets', 'The messenger first. The meeting is about to begin.')] }]
      : [{ who: 'Steward', text: 'Welcome to Liberty Hall. I look after our guests.', unlock: 'convention' }, { who: 'Steward', text: 'The convention lasts all month. Guests come from many countries.' }, { who: 'Steward', text: 'Please say hello to our three visitors by the door.' }],
    later: () => ({ 50: ['Please talk to the three visitors first.'], 52: ['The Declaration is on the table by the door. Please read it.'] })[stage] || ['A busy day, but a good one.'] },
  { id: 'garvey6', model: 'garvey1916', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: 0, z: -4.5, ry: 0, base: 'Idle', ground: 0.4,
    lines: () => [{ who: 'Marcus Garvey', text: 'Friends, welcome to Liberty Hall.', unlock: 'convention' }, { who: 'Marcus Garvey', text: 'You have come from many places. Today we put our hopes in writing.' }, { who: 'Marcus Garvey', text: 'We have chosen red, black and green as our colours.' }, { who: 'Marcus Garvey', text: ({ nurse: 'I hear our nurse was helped first. People who care for others deserve care.', delegate: 'I hear our guest found a seat first. A long journey deserves a fair welcome.', messenger: 'I hear our messenger was helped first. Small jobs keep a big meeting going.' })[story.helped] || 'I hear you helped our guests today. Thank you.' }, { who: 'Marcus Garvey', text: 'Thank you for all your help this month.' }],
    later: () => stage >= 54 ? ['Thank you for helping us.'] : ['Please read the Declaration first.'] },
];
for (const n of LIB_PEOPLE) initPerson(n);
let libLoading = null;
function ensureLiberty() { if (!libLoading) { buildLiberty(); libLoading = Promise.all(LIB_PEOPLE.map(loadPerson)); } return libLoading; }
function resetChapter6() {   /* Liberty Hall again: the banner is plain, your choice here is cleared, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); closePage(false); closeInspect(false); closeDecl(false); stage = 50; delete story.helped; delete story.banner; showBanner();
  for (const n of LIB_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('liberty'); setStage(50); showPlace();
}

/* ---------- chapter 7: Amy Jacques Garvey's desk, Harlem, 1925 ---------- */
const offG = new THREE.Group(); offG.visible = false; scene.add(offG);
const OFF = { x0: -4, x1: 4, z0: -3.5, z1: 3.5, h: 3.6 }, OFF_WALLS = [], OFF_BOUNDS = { x0: -3.5, x1: 3.5, z0: -3.0, z1: 3.0 };
const offLamp = new THREE.PointLight(0xffd29a, 9, 12, 2); offLamp.position.set(0, 2.9, 0); offLamp.visible = false; scene.add(offLamp);
let offBuilt = false;
function buildOffice() {
  if (offBuilt) return; offBuilt = true; const g = offG, W2 = OFF.x1 - OFF.x0, D2 = OFF.z1 - OFF.z0, H2 = OFF.h;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([104, 78, 54], 7, [W2 / 1.05, D2 / 2]), 0.85), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(W2, D2), std(plankTex([74, 56, 40], 8, [W2 / 1.2, D2 / 2]), 0.95), 0, H2, 0, g).rotation.x = Math.PI / 2;
  const wallP = (w, cx, cz, ry) => { const t = plasterT.clone(); t.needsUpdate = true; t.repeat.set(w / 3.4, 1); t.wrapT = THREE.ClampToEdgeWrapping; const p = mesh(new THREE.PlaneGeometry(w, H2), std(t, 1), cx, H2 / 2, cz, g); p.rotation.y = ry; };
  wallP(W2, 0, OFF.z0, 0); wallP(D2, OFF.x0, 0, Math.PI / 2); wallP(D2, OFF.x1, 0, -Math.PI / 2);
  const dw = 2.0, dh = 2.7, sw = (W2 - dw) / 2; wallP(sw, OFF.x0 + sw / 2, OFF.z1, Math.PI); wallP(sw, OFF.x1 - sw / 2, OFF.z1, Math.PI);
  box(dw + 0.3, H2 - dh, 0.14, solid(0xdccfb0, 1), 0, (dh + H2) / 2, OFF.z1 - 0.07, g); for (const x of [-dw / 2 - 0.07, dw / 2 + 0.07]) box(0.16, dh, 0.2, beam, x, dh / 2, OFF.z1 - 0.1, g); box(dw + 0.36, 0.18, 0.2, beam, 0, dh + 0.09, OFF.z1 - 0.1, g);
  for (let i = 0; i < 4; i++) mesh(new THREE.PlaneGeometry(4.5, 9), new THREE.MeshBasicMaterial({ map: facadeTex(i) }), -6.75 + i * 4.5, 4.5, OFF.z1 + 3.2, g).rotation.y = Math.PI;
  mesh(new THREE.PlaneGeometry(14, 3.0), new THREE.MeshBasicMaterial({ color: 0xa9a291 }), 0, 0.01, OFF.z1 + 1.5, g).rotation.x = -Math.PI / 2;
  for (const z of [-2, 0, 2]) box(W2, 0.2, 0.2, beam, 0, H2 - 0.1, z, g);
  for (const wx of [-2.3, 2.3]) {   /* two windows in the back wall */
    const w = 1.2, h = 1.7, sill = 1.0, y = sill + h / 2, gg = new THREE.Group(); gg.position.set(wx, 0, OFF.z0); g.add(gg);
    mesh(new THREE.PlaneGeometry(w, h), viewM, 0, y, 0.012, gg); for (const dx of [-w / 2, w / 2]) box(0.09, h + 0.12, 0.12, beam, dx, y, 0.05, gg); for (const dy of [sill - 0.03, sill + h + 0.03]) box(w + 0.2, 0.09, 0.12, beam, 0, dy, 0.05, gg); box(0.05, h, 0.06, beam, 0, y, 0.04, gg); }
  /* a bookcase along the left wall, full of books */
  for (const y of [0.1, 0.8, 1.5, 2.2, 2.9]) box(0.34, 0.05, 4.4, wood, -3.8, y, -0.2, g); for (const z of [-2.4, 2.0]) box(0.34, 3.0, 0.05, wood, -3.8, 1.5, z, g);
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.8 }), 4 * 26), bm = new THREE.Matrix4(), col = new THREE.Color(); let bi = 0;
  for (const y of [0.13, 0.83, 1.53, 2.23]) { let z = -2.3; for (let k = 0; k < 26 && z < 1.9; k++) { const th = 0.06 + Math.random() * 0.06, ht = 0.34 + Math.random() * 0.2; bm.compose(new THREE.Vector3(-3.78, y + ht / 2 + 0.025, z + th / 2), new THREE.Quaternion(), new THREE.Vector3(0.22, ht, th)); books.setMatrixAt(bi, bm); col.setHSL(Math.random(), 0.25 + Math.random() * 0.2, 0.25 + Math.random() * 0.15); books.setColorAt(bi, col); bi++; z += th + 0.01; } }
  books.count = bi; g.add(books); OFF_WALLS.push([-4.0, -2.4, -3.6, 2.2]);
  /* the desk, with a typewriter, a lamp and the news cards */
  box(2.2, 0.8, 1.0, woodDark, -0.5, 0.4, -1.5, g); box(2.3, 0.06, 1.1, wood, -0.5, 0.83, -1.5, g);
  box(0.34, 0.12, 0.32, iron, -1.0, 0.92, -1.45, g); box(0.3, 0.03, 0.12, solid(0x222222), -1.0, 0.99, -1.32, g); box(0.22, 0.01, 0.3, paper, -1.0, 1.08, -1.6, g).rotation.x = -0.4;
  cyl(0.1, 0.12, 0.05, brass, 0.4, 0.88, -1.8, g, 12); cyl(0.02, 0.02, 0.4, brass, 0.4, 1.08, -1.8, g, 6); cyl(0.04, 0.16, 0.16, solid(0x2f6a4a, 0.5), 0.4, 1.3, -1.8, g, 14);
  for (const [dx, dz, r] of [[-0.1, -1.2, 0.2], [0.15, -1.3, -0.1], [0.3, -1.15, 0.35], [-0.35, -1.15, 0.0]]) box(0.2, 0.012, 0.28, paper, -0.5 + dx, 0.87, -1.5 + dz + 0.3, g).rotation.y = r;
  box(0.5, 0.5, 0.5, woodDark, -0.5, 0.25, -2.3, g); OFF_WALLS.push([-1.7, -2.1, 0.7, -0.85]);
  /* a side table with the letters, and a notice board */
  box(1.1, 0.74, 0.7, woodDark, 3.2, 0.37, 0.8, g); box(1.2, 0.05, 0.8, wood, 3.2, 0.77, 0.8, g); for (const [dx, dz] of [[-0.25, 0], [0.1, 0.1], [0.3, -0.1]]) box(0.26, 0.015, 0.18, paper, 3.2 + dx, 0.81, 0.8 + dz, g); OFF_WALLS.push([2.55, 0.4, 3.85, 1.2]);
  box(0.06, 1.2, 1.6, woodDark, OFF.x1 - 0.05, 1.7, -1.4, g); for (const [dz, dy] of [[-0.45, 0.3], [0, 0.3], [0.45, 0.3], [-0.3, -0.25], [0.25, -0.25]]) mesh(new THREE.PlaneGeometry(0.34, 0.26), new THREE.MeshStandardMaterial({ map: sheetTex('NEWS'), roughness: 1 }), OFF.x1 - 0.09, 1.7 + dy, -1.4 + dz, g).rotation.y = -Math.PI / 2;
  cyl(0.008, 0.008, 0.7, solid(0x222222), 0, H2 - 0.5, 0, g, 6); cyl(0.05, 0.14, 0.12, brass, 0, 2.95, 0, g); cyl(0.1, 0.1, 0.24, new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.75 }), 0, 2.78, 0, g);
}
/* sort the news cards: fact or rumour */
const CARDS = [['The Negro World comes out every week.', 'fact', 'Yes. You can check this: a new issue comes out every week.'], ['Someone says the paper will close tomorrow. They cannot say who told them.', 'rumour', 'Yes. Nobody can say who told them, so we cannot check it.'], ['In 1925 Marcus Garvey went to prison in Atlanta.', 'fact', 'Yes. This is in the records, so we can check it.'], ['Everybody knows there is no money left. Nobody has shown any numbers.', 'rumour', 'Yes. "Everybody knows" is not proof. We need the numbers.']];
let sortDone = null, cardI = 0;
function openSort(done) { if (busy) return; busy = true; keys.clear(); sortDone = done; cardI = 0; unlock('rumour'); $('sortp').hidden = false; showCard(); }
function showCard() { const c = CARDS[cardI]; $('soprog').textContent = 'Card ' + (cardI + 1) + ' of ' + CARDS.length; $('socard').textContent = c[0]; $('somsg').textContent = 'Is this a fact, or a rumour?'; $('sonext').hidden = true; $('sodone').hidden = true; $('sobtns').style.display = ''; }
function answerCard(b) {
  const c = CARDS[cardI]; if (b.dataset.a !== c[1]) { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('somsg').textContent = 'Not quite. Ask: do we know who said it, and can we check it?'; return; }
  uiSound('tap'); $('somsg').textContent = c[2]; $('sobtns').style.display = 'none'; if (cardI + 1 >= CARDS.length) { $('sodone').hidden = false; $('sodone').focus({ preventScroll: true }); } else { $('sonext').hidden = false; $('sonext').focus({ preventScroll: true }); }
}
for (const b of $('sobtns').children) b.onclick = () => answerCard(b);
$('sonext').onclick = () => { cardI++; showCard(); };
function closeSort(done) { if ($('sortp').hidden) return; $('sortp').hidden = true; busy = panelsOpen(); if (done && sortDone) { const f = sortDone; sortDone = null; f(); } }
$('sox').onclick = () => closeSort(false); $('sodone').onclick = () => closeSort(true);
/* a letter from the friend in chapter 5, and how you write back */
const LETTER = { truth: 'Dear friend, I bought one share, as we talked. Now I read worrying news about the ships. Should I be afraid?', cheer: 'Dear friend, I bought five shares because you believed in the ship. Now I read worrying news about the ships. Should I be afraid?', wait: 'Dear friend, I waited and watched, as we said. Now I read worrying news about the ships. Should I buy a share or not?' };
const REPLIES = [['honest', 'Be honest: the ships have had troubles, and nobody can promise', 'Your friend writes back: "Thank you for the truth. I will not put in any more."'], ['cheer', 'Say that all will be well', 'Your friend writes back: "I hope you are right. I will keep my shares."'], ['ask', 'Suggest asking the UNIA office for the facts', 'Your friend writes back: "A good idea. I will ask for the facts."']];
let letDone = null;
function openLetter(done) {
  if (busy) return; busy = true; keys.clear(); letDone = done; $('letp').hidden = false; $('ledone').hidden = true; $('letext').textContent = LETTER[story.advice] || LETTER.wait; $('lemsg').textContent = '';
  const box = $('lebtns'); box.replaceChildren(); for (const [id, t, reply] of REPLIES) { const b = document.createElement('button'); b.className = 'pc'; b.textContent = t; b.onclick = () => { story.reassure = id; saveGame(); uiSound('tap'); for (const x of box.children) { x.disabled = true; x.classList.toggle('sel', x === b); } $('lemsg').textContent = reply; $('ledone').hidden = false; $('ledone').focus({ preventScroll: true }); }; box.appendChild(b); }
}
function closeLetter(done) { if ($('letp').hidden) return; $('letp').hidden = true; busy = panelsOpen(); if (done && letDone) { const f = letDone; letDone = null; f(); } }
$('lex').onclick = () => closeLetter(false); $('ledone').onclick = () => closeLetter(true);
const OFF_ACTIONS = [{ id: 'sort', label: 'Sort the news cards', x: -0.5, z: -0.5, r: 1.3, on: () => stage === 61, go: () => openSort(() => { setStage(62); uiSound('goal'); }) },
  { id: 'letter', label: 'Read the letter', x: 3.2, z: 0.0, r: 1.3, on: () => stage === 63, go: () => openLetter(() => { setStage(64); uiSound('goal'); }) }];
const fair = (id, t, reply) => ({ t, set: { question: id }, then: [{ who: 'Amy Jacques Garvey', text: reply }, { who: 'Amy Jacques Garvey', text: 'A friend of yours has sent a letter.' }, { who: 'Amy Jacques Garvey', text: 'It is on the table by the door.' }] });
const OFF_PEOPLE = [
  { id: 'amyj', model: 'amyj1925', who: 'Amy Jacques Garvey', label: 'Talk to Amy Jacques Garvey', x: 1.5, z: -1.5, ry: faceToward(1.5, -1.5, 0, 1.5), base: 'Idle',
    lines: () => stage === 62 ? [{ who: 'Amy Jacques Garvey', text: 'Well sorted. Now, the rumour about the paper closing.' }, { who: 'Amy Jacques Garvey', text: 'A reader wrote to me about it.' }, { who: 'Amy Jacques Garvey', text: 'What should I ask before I print it?', choices: [fair('who', 'Who said it, and how do they know?', 'Yes. We should always ask who said it and how they know.'), fair('check', 'Check it with the office first', 'Good. We can check with the printers before we print.'), fair('print', 'Print it quickly so readers know', 'Quickly? If it is wrong, many people would worry for nothing. Let us check first.')] }]
      : [{ who: 'Amy Jacques Garvey', text: 'Hello. I am Amy Jacques Garvey.', unlock: 'amyj' }, { who: 'Amy Jacques Garvey', text: 'I help to edit the Negro World.' }, { who: 'Amy Jacques Garvey', text: 'I run a page called Our Women and What They Think.' }, { who: 'Amy Jacques Garvey', text: 'Marcus is in prison in Atlanta now. I keep the work going.', unlock: 'trial' }, { who: 'You', text: 'How can I help?' }, { who: 'Amy Jacques Garvey', text: 'Stories and letters arrive every day. Some are facts. Some are only rumours.' }, { who: 'Amy Jacques Garvey', text: 'Please sort the news cards on my desk.' }],
    later: () => ({ 61: ['The news cards are on the desk in front of you.'], 63: ['Your friend\'s letter is on the table by the door.'] })[stage] || ['Thank you for your help. Good editors always check.'] },
];
for (const n of OFF_PEOPLE) initPerson(n);
let offLoading = null;
function ensureOffice() { if (!offLoading) { buildOffice(); offLoading = Promise.all(OFF_PEOPLE.map(loadPerson)); } return offLoading; }
function resetChapter7() {   /* Amy's desk again: your choices here are cleared, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); stage = 60; delete story.question; delete story.reassure;
  for (const n of OFF_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('office'); setStage(60); showPlace();
}

/* ---------- chapter 8: National Heroes Park, Kingston, today ---------- */
const parkG = new THREE.Group(); parkG.visible = false; scene.add(parkG);
const PARK_WALLS = [], PARK_BOUNDS = { x0: -9, x1: 9, z0: -1.2, z1: 6 };
let parkBuilt = false;
function buildPark() {
  if (parkBuilt) return; parkBuilt = true; const g = parkG;
  mesh(new THREE.PlaneGeometry(80, 60), std(cv(128, 128, (x, w, h) => { x.fillStyle = '#4f8a45'; x.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(${40 + Math.random() * 40 | 0},${110 + Math.random() * 60 | 0},${30 + Math.random() * 40 | 0},0.5)`; x.fillRect(Math.random() * w, Math.random() * h, 2, 5 + Math.random() * 4); } }, [20, 15]), 1), 0, 0, 0, g).rotation.x = -Math.PI / 2;
  const walk = std(cv(128, 128, (x, w, h) => { x.fillStyle = '#c8bda2'; x.fillRect(0, 0, w, h); grain(x, w, h, 14); }, [1, 1]), 1);
  mesh(new THREE.PlaneGeometry(24, 2.4), walk, 0, 0.01, 3.2, g).rotation.x = -Math.PI / 2; mesh(new THREE.PlaneGeometry(2.4, 6.5), walk, 0, 0.011, -0.3, g).rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(9, 6), std(cv(128, 128, (x, w, h) => { x.fillStyle = '#b9ae94'; x.fillRect(0, 0, w, h); grain(x, w, h, 12); }, [1, 1]), 1), 0, 0.012, -3.4, g).rotation.x = -Math.PI / 2;   /* the paved circle round the shrine */
  /* the shrine: a black star on the ground, an angled stone wall behind, and a bronze bust on a plinth (drawn from descriptions) */
  const star = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.75 : 1.7; (i ? star.lineTo : star.moveTo).call(star, Math.cos(a) * r, Math.sin(a) * r); } star.closePath();
  const starG = new THREE.ExtrudeGeometry(star, { depth: 0.12, bevelEnabled: false }); starG.rotateX(-Math.PI / 2); mesh(starG, solid(0x15161a, 0.5), 0, 0.012, -2.6, g);
  const stone = solid(0xcfc6b0, 0.9); for (const sx of [-1, 1]) { const w = box(2.3, 2.4, 0.3, stone, sx * 1.05, 1.2, -4.5, g); w.rotation.y = -sx * 0.3; }
  box(0.8, 0.9, 0.8, stone, 0, 0.45, -3.7, g); const bronze = solid(0x8a6a38, 0.45, 0.5); mesh(new THREE.SphereGeometry(0.23, 16, 12), bronze, 0, 1.25, -3.7, g); const sh = mesh(new THREE.SphereGeometry(0.34, 14, 10), bronze, 0, 0.98, -3.7, g); sh.scale.set(1.2, 0.55, 0.7);
  mesh(new THREE.PlaneGeometry(0.6, 0.3), new THREE.MeshBasicMaterial({ map: signTex([['MARCUS MOSIAH GARVEY', 26], ['1887 to 1940', 24]], 512, 160) }), 0, 0.5, -3.29, g); PARK_WALLS.push([-1.6, -5.4, 1.6, -2.6]);
  /* palm trees, benches, a low fence and the town beyond */
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3f7d3a, roughness: 0.8, side: THREE.DoubleSide });
  const palm = (x, z, hgt) => { const t = cyl(0.11, 0.17, hgt, solid(0x7a6246, 0.9), x, hgt / 2, z, g, 8); for (let i = 0; i < 7; i++) { const l = mesh(new THREE.PlaneGeometry(2.0, 0.4), leaf, x + Math.cos(i * 0.9) * 0.9, hgt + 0.1, z + Math.sin(i * 0.9) * 0.9, g); l.rotation.set(-0.5, -i * 0.9, 0.25); } PARK_WALLS.push([x - 0.3, z - 0.3, x + 0.3, z + 0.3]); };
  [[-7, -2.6, 5.2], [7.2, -2.4, 4.6], [-6.6, 1.0, 4.2], [6.8, 1.2, 5.0], [-3.8, -4.8, 4.8], [3.8, -5.0, 5.4]].forEach(([x, z, h]) => palm(x, z, h));
  for (const [bx, bz] of [[-4, 4.6], [4, 4.6]]) { box(1.6, 0.08, 0.5, wood, bx, 0.45, bz, g); box(1.6, 0.5, 0.06, wood, bx, 0.75, bz + 0.22, g); for (const dx of [-0.7, 0.7]) box(0.08, 0.45, 0.45, woodDark, bx + dx, 0.22, bz, g); PARK_WALLS.push([bx - 0.9, bz - 0.35, bx + 0.9, bz + 0.35]); }
  for (let i = 0; i < 26; i++) { box(0.06, 0.8, 0.06, solid(0x2c2f34, 0.6), -12 + i, 0.4, 7.2, g); } box(26, 0.05, 0.05, solid(0x2c2f34, 0.6), 0, 0.7, 7.2, g);
  for (const [px, pz, ry, w] of [[0, -11, 0, 30], [-12, -2, Math.PI / 2, 22], [12, -2, -Math.PI / 2, 22]]) mesh(new THREE.PlaneGeometry(w, 6), new THREE.MeshBasicMaterial({ map: streetTex() }), px, 2.6, pz, g).rotation.y = ry;
  for (const [fx, fz, c] of [[-1.7, -1.6, 0xd9453a], [1.7, -1.6, 0xe9b83a], [-2.1, -1.2, 0xe9b83a], [2.1, -1.2, 0xd9453a]]) for (let k = 0; k < 5; k++) mesh(new THREE.SphereGeometry(0.07, 8, 6), solid(c, 0.7), fx + (k % 3 - 1) * 0.16, 0.1, fz + (k % 2) * 0.14, g);
  /* the timeline board */
  box(0.1, 1.6, 0.1, woodDark, -6.1, 0.8, 0.0, g); box(0.1, 1.6, 0.1, woodDark, -3.9, 0.8, 0.0, g); box(2.4, 1.2, 0.08, wood, -5.0, 1.6, 0.0, g);
  mesh(new THREE.PlaneGeometry(2.2, 1.0), new THREE.MeshBasicMaterial({ map: signTex([['TIMELINE', 40], ['1927 to 1969', 28]], 512, 220) }), -5.0, 1.6, 0.05, g); PARK_WALLS.push([-6.3, -0.3, -3.7, 0.3]);
}
/* the timeline: tap the events in the order they happened */
const EVENTS = [['Marcus Garvey comes home to Jamaica', '1927'], ['He starts a political party in Jamaica', '1929'], ['He moves to London', '1935'], ['He dies in London', '1940'], ['His remains come home to Jamaica', '1964'], ['He is named a National Hero', '1969']];
let timeDone = null, timeI = 0;
function openTime(done) {
  if (busy) return; busy = true; keys.clear(); timeDone = done; timeI = 0; unlock('later'); $('timep').hidden = false; $('tmdone').hidden = true; $('tmmsg').textContent = 'Which happened first? Tap the events in order.'; $('tmlist').replaceChildren();
  const tray = $('tmtray'); tray.replaceChildren(); EVENTS.map((e, i) => [e, i]).sort(() => Math.random() - 0.5).forEach(([e, i]) => { const b = document.createElement('button'); b.className = 'pc'; b.dataset.i = i; b.textContent = e[0]; b.onclick = () => pickEvent(b); tray.appendChild(b); });
}
function pickEvent(b) {
  if (+b.dataset.i !== timeI) { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('tmmsg').textContent = 'Not that one yet. What did the guide say came first?'; return; }
  uiSound('tap'); const li = document.createElement('li'); li.textContent = EVENTS[timeI][1] + ': ' + EVENTS[timeI][0]; $('tmlist').appendChild(li); b.disabled = true; b.style.display = 'none'; timeI++;
  if (timeI >= EVENTS.length) { $('tmmsg').textContent = 'The timeline is in order.'; $('tmdone').hidden = false; $('tmdone').focus({ preventScroll: true }); } else $('tmmsg').textContent = 'Good. What came next?';
}
function closeTime(done) { if ($('timep').hidden) return; $('timep').hidden = true; busy = panelsOpen(); if (done && timeDone) { const f = timeDone; timeDone = null; f(); } }
$('tmx').onclick = () => closeTime(false); $('tmdone').onclick = () => closeTime(true);
/* the last question, answered in your own words: pick how it starts and why */
const OPEN = ['In some ways, yes.', 'Not yet.', 'It is still being built.'], WHY = ['I think of how proud many people are today.', 'I think of children who still need good schools and fair work.', 'I think of people working together to make it true.'];
let ansDone = null, ansA = -1, ansB = -1;
function ansText() { return (ansA >= 0 ? OPEN[ansA] : '...') + ' ' + (ansB >= 0 ? WHY[ansB] : '...'); }
function openAnswer(done) {
  if (busy) return; busy = true; keys.clear(); ansDone = done; ansA = ansB = -1; $('ansp').hidden = false; $('andone').hidden = true;
  const fill = (id, arr, set) => { const box = $(id); box.replaceChildren(); arr.forEach((t, i) => { const b = document.createElement('button'); b.className = 'pc'; b.textContent = t; b.onclick = () => { set(i); uiSound('tap'); for (const x of box.children) x.classList.toggle('sel', x === b); $('antext').textContent = ansText(); if (ansA >= 0 && ansB >= 0) { $('andone').hidden = false; $('andone').focus({ preventScroll: true }); } }; box.appendChild(b); }); };
  fill('anopen', OPEN, (i) => { ansA = i; }); fill('anwhy', WHY, (i) => { ansB = i; }); $('antext').textContent = ansText();
}
function closeAnswer(done) { if ($('ansp').hidden) return; $('ansp').hidden = true; busy = panelsOpen(); if (done && ansDone) { const f = ansDone; ansDone = null; f(); } }
$('anx').onclick = () => closeAnswer(false); $('andone').onclick = () => closeAnswer(true);
/* what you chose along the way, written plainly for the Journal */
function refreshJourney() {
  const pg = JOURNAL.find((q) => q.id === 'journey'); if (!pg) return; const L2 = [], pick = (k, m) => m[story[k]] && L2.push(m[story[k]]);
  pick('strike', { speak: 'In the print shop you chose to speak up at the union meeting.', wait: 'In the print shop you chose to wait and listen first.', ask: 'In the print shop you chose to ask the others what they thought.' });
  if (story.poster) L2.push('In Kingston you chose the poster word ' + story.poster + '.');
  pick('words', { work: 'In Harlem you helped Garvey speak about fair work.', learn: 'In Harlem you helped Garvey speak about good schools.', pride: 'In Harlem you helped Garvey speak about pride in who we are.' });
  pick('answer', { listen: 'You told the older man to listen and then decide.', watch: 'You told the older man to watch what Garvey does.', ask: 'You told the older man to ask his own questions.' });
  if (HEADLINES[story.headline]) L2.push('You chose the headline "' + HEADLINES[story.headline] + '".');
  pick('delivery', { all: 'You sent every bundle of the paper with the sailor.', split: 'You shared the bundles out among the sailor\'s friends.', hold: 'You sent only a few bundles.' });
  pick('plan', { now: 'You advised Garvey to buy the old ship now. He bought it, as really happened.', wait: 'You advised Garvey to save for a better ship. He bought the old one, as really happened.' });
  pick('advice', { truth: 'You told your friend the ship was old.', cheer: 'You told your friend it would surely succeed.', wait: 'You told your friend to wait and see.' });
  pick('helped', { nurse: 'At the convention you asked the steward to help the nurse first.', delegate: 'At the convention you asked the steward to help the tired traveller first.', messenger: 'At the convention you asked the steward to help the messenger first.' });
  pick('question', { who: 'With Amy you asked who said a rumour and how they knew.', check: 'With Amy you asked to check a rumour with the office first.', print: 'With Amy you wanted to print a rumour quickly, then agreed to check first.' });
  pick('reassure', { honest: 'You wrote to your friend honestly.', cheer: 'You told your friend that all would be well.', ask: 'You told your friend to ask the UNIA office for the facts.' });
  if (story.final) L2.push('Asked if the dream has come true, you said: "' + story.final + '"');
  pg.simple = L2.length ? L2 : ['You finished the story.'];
}
const PARK_ACTIONS = [{ id: 'timeline', label: 'Read the timeline board', x: -5.0, z: 1.4, r: 1.4, on: () => stage === 71, go: () => openTime(() => { setStage(72); uiSound('goal'); }) },
  { id: 'answer', label: 'Answer at the shrine', x: 0, z: -0.3, r: 1.7, on: () => stage === 73, go: () => openAnswer(() => { story.final = ansText(); unlock('shrine'); unlock('pardon'); refreshJourney(); unlock('journey'); setStage(74); uiSound('goal'); endCard(); }) }];
function endCard() { card('The end', ['Thank you for walking through this story. Your journey, with all your choices, is in the Journal.', 'Marcus Garvey, Amy Ashwood and Amy Jacques Garvey were real people. Their words here are made up. Check the facts in the Journal against books and archives, and ask your own questions.'], [{ t: 'Read my journey', go: () => { hideCard(); openJournal('journey'); } }, { t: 'Keep exploring', go: hideCard }]); }
const PARK_PEOPLE = [
  { id: 'guide', model: 'guide2020', who: 'Guide', label: 'Talk to the guide', x: -1.8, z: 2.2, ry: faceToward(-1.8, 2.2, 0, -3), base: 'Idle',
    lines: () => [{ who: 'Guide', text: 'Welcome to National Heroes Park in Kingston.' }, { who: 'Guide', text: 'This shrine is for Marcus Garvey.', unlock: 'shrine' }, { who: 'Guide', text: 'In 1927 he came home to Jamaica.', unlock: 'later' }, { who: 'Guide', text: 'In 1929 he started a political party here.' }, { who: 'Guide', text: 'In 1935 he moved to London. He died there in 1940.' }, { who: 'Guide', text: 'In 1964 his remains came home, to this shrine.' }, { who: 'Guide', text: 'In 1969 he was named a National Hero.' }],
    later: () => ({ 71: ['Try the timeline board on the left. I will help if you forget.'], 73: ['Take your time. There is no wrong answer.'] })[stage] || ['I like it here. It is quiet and green.'] },
  { id: 'student', model: 'student2020', who: 'Student', label: 'Talk to the student', x: 1.8, z: 2.4, ry: faceToward(1.8, 2.4, 0, -3), base: 'Idle',
    lines: () => stage === 72 ? [{ who: 'Student', text: 'You know a lot about Marcus Garvey now.' }, { who: 'Student', text: 'People say he dreamed of pride, learning and working together.' }, { who: 'Student', text: 'Has his dream come true?' }, { who: 'You', text: 'That is a big question.' }, { who: 'Student', text: 'Please answer it at the shrine, in your own words.' }]
      : [{ who: 'Student', text: 'Hi! We learned about Marcus Garvey at school.' }, { who: 'Student', text: 'I came here to think about it.' }, { who: 'Student', text: 'The guide knows the whole story.' }],
    later: () => stage >= 74 ? ['Thank you. I will think about your answer.'] : ({ 71: ['I have a big question for you soon.'], 73: ['I am listening.'] })[stage] || ['It is a good place to think.'] },
];
for (const n of PARK_PEOPLE) initPerson(n);
let parkLoading = null;
function ensurePark() { if (!parkLoading) { buildPark(); parkLoading = Promise.all(PARK_PEOPLE.map(loadPerson)); } return parkLoading; }
function resetChapter8() {   /* the park again: your last answer is cleared, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); stage = 70; delete story.final;
  for (const n of PARK_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('park'); setStage(70); showPlace();
}

/* ---------- small details that make each place feel lived in ---------- */
const POTM = solid(0xa65a3a, 0.9), TRUNKM = solid(0x5b4330, 0.95), CANOPY = new THREE.MeshStandardMaterial({ color: 0x4f8f3f, roughness: 0.9, flatShading: true }), CANOPY2 = new THREE.MeshStandardMaterial({ color: 0x3c7a36, roughness: 0.9, flatShading: true });
const LEAFA = new THREE.MeshStandardMaterial({ color: 0x3f7d3a, roughness: 0.8, side: THREE.DoubleSide }), LEAFB = new THREE.MeshStandardMaterial({ color: 0x4d9142, roughness: 0.8, side: THREE.DoubleSide });
const LEAFG = new THREE.PlaneGeometry(0.2, 0.95).translate(0, 0.475, 0), BLOB = new THREE.IcosahedronGeometry(1, 1);
const TIN = solid(0x8d9095, 0.45, 0.55), CLOTH = solid(0xe6dcc0, 0.95), GLOWM = new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffc46a, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 });
const clockTex = memo(() => cv(128, 128, (x) => { x.fillStyle = '#ece4cf'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.strokeStyle = '#2b2118'; x.lineWidth = 5; x.stroke(); x.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.moveTo(64 + Math.sin(a) * 50, 64 - Math.cos(a) * 50); x.lineTo(64 + Math.sin(a) * 57, 64 - Math.cos(a) * 57); x.stroke(); } x.lineWidth = 5; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 - Math.sin(1.05) * 32, 64 - Math.cos(1.05) * 32); x.stroke(); x.lineWidth = 3; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 + Math.sin(2.1) * 46, 64 - Math.cos(2.1) * 46); x.stroke(); x.fillStyle = '#2b2118'; x.beginPath(); x.arc(64, 64, 4, 0, 7); x.fill(); }));
const stripeTex = memo((a, b) => cv(64, 64, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? b : a; x.fillRect(i * 8, 0, 8, h); } grain(x, w, h, 10); }), (a, b) => a + b);
const rugTex = memo(() => cv(128, 96, (x, w, h) => { x.fillStyle = '#7a2e2a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d6b45c'; x.lineWidth = 3; x.strokeRect(6, 6, w - 12, h - 12); x.strokeStyle = '#2f3f5c'; x.lineWidth = 6; x.strokeRect(14, 14, w - 28, h - 28); x.fillStyle = '#d6b45c'; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(24 + i * 20, h / 2); x.lineTo(34 + i * 20, h / 2 - 9); x.lineTo(44 + i * 20, h / 2); x.lineTo(34 + i * 20, h / 2 + 9); x.fill(); } grain(x, w, h, 14); }));
const flagJamTex = memo(() => cv(150, 90, (x, w, h) => { x.fillStyle = '#009b3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#000'; x.beginPath(); x.moveTo(0, 0); x.lineTo(w / 2, h / 2); x.lineTo(0, h); x.fill(); x.beginPath(); x.moveTo(w, 0); x.lineTo(w / 2, h / 2); x.lineTo(w, h); x.fill(); x.strokeStyle = '#fed100'; x.lineWidth = 14; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, h); x.moveTo(0, h); x.lineTo(w, 0); x.stroke(); }));
const hillTex = memo(() => cv(256, 64, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6f93a0'); g.addColorStop(1, '#4f7a6e'); x.fillStyle = g; x.fillRect(0, 0, w, h); }));
function dPlant(g, x, z, sc = 1, y = 0) {   /* a potted palm or fern */
  cyl(0.2 * sc, 0.14 * sc, 0.3 * sc, POTM, x, y + 0.15 * sc, z, g, 12);
  for (let i = 0; i < 10; i++) { const l = mesh(LEAFG, i % 2 ? LEAFA : LEAFB, x, y + 0.3 * sc, z, g); l.scale.set(sc, sc * (0.75 + (i % 3) * 0.22), sc); l.rotation.order = 'YXZ'; l.rotation.y = i * 0.63; l.rotation.x = -(0.3 + (i % 3) * 0.22); }
}
function dTree(g, x, z, h = 3.2, r = 1.1) {   /* a street or park tree: a trunk and a few lumpy clumps of leaves */
  cyl(0.09 * r, 0.15 * r, h, TRUNKM, x, h / 2, z, g, 8);
  for (const [dx, dy, dz, k, m] of [[0, 0.2, 0, 1, 0], [0.7, -0.25, 0.25, 0.72, 1], [-0.6, -0.15, -0.35, 0.8, 1], [0.15, 0.62, -0.45, 0.65, 0], [-0.3, 0.5, 0.5, 0.6, 1]]) { const s = mesh(BLOB, m ? CANOPY2 : CANOPY, x + dx * r, h + dy * r, z + dz * r, g); s.scale.set(r * k, r * k * 0.8, r * k); }
}
function dBarrel(g, x, y, z, sc = 1, mat = woodDark) { cyl(0.27 * sc, 0.27 * sc, 0.78 * sc, mat, x, y + 0.39 * sc, z, g, 14); for (const dy of [0.2, 0.58]) cyl(0.285 * sc, 0.285 * sc, 0.035 * sc, iron, x, y + dy * sc, z, g, 14); }
function dCrate(g, x, y, z, s = 0.6, ry = 0) { const b = box(s, s, s, wood, x, y + s / 2, z, g); b.rotation.y = ry; box(s + 0.02, 0.05, s + 0.02, woodDark, x, y + s * 0.2, z, g).rotation.y = ry; box(s + 0.02, 0.05, s + 0.02, woodDark, x, y + s * 0.8, z, g).rotation.y = ry; }
function dClock(g, x, y, z, ry) { const k = new THREE.Group(); k.position.set(x, y, z); k.rotation.y = ry; g.add(k);   /* the face sits clear of the wooden back (0.03) and gets a depth offset, so it never flickers (z-fights) as you walk about */
  mesh(new THREE.CircleGeometry(0.21, 28), new THREE.MeshStandardMaterial({ map: clockTex(), roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 0, 0, 0.045, k); mesh(new THREE.TorusGeometry(0.215, 0.025, 8, 28), brass, 0, 0, 0.04, k); cyl(0.23, 0.23, 0.05, woodDark, 0, 0, 0.005, k, 20).rotation.x = Math.PI / 2; }
function dPegs(g, x, y, z, ry, n = 4) {   /* a coat board with pegs, and two hats hung on it */
  const k = new THREE.Group(); k.position.set(x, y, z); k.rotation.y = ry; g.add(k); box(0.2 + n * 0.22, 0.12, 0.03, woodDark, 0, 0, 0.015, k);
  for (let i = 0; i < n; i++) { const px = (i - (n - 1) / 2) * 0.22; cyl(0.012, 0.012, 0.08, brass, px, 0, 0.07, k, 6).rotation.x = Math.PI / 2; if (i === 0 || i === n - 2) { const hc = i === 0 ? 0x2c2a2a : 0x6b5a45; cyl(0.12, 0.12, 0.012, solid(hc, 0.9), px, -0.12, 0.1, k, 16).rotation.x = Math.PI / 2; cyl(0.075, 0.085, 0.09, solid(hc, 0.9), px, -0.12, 0.14, k, 14).rotation.x = Math.PI / 2; } } }
function dStove(g, x, z, h) { box(0.7, 0.06, 0.7, iron, x, 0.03, z, g); cyl(0.27, 0.3, 0.8, solid(0x25262a, 0.6, 0.2), x, 0.46, z, g, 16); cyl(0.2, 0.27, 0.12, solid(0x25262a, 0.6, 0.2), x, 0.92, z, g, 16); cyl(0.055, 0.055, h - 1.0, solid(0x2a2b2f, 0.6, 0.2), x, 1.0 + (h - 1.0) / 2, z, g, 10); box(0.18, 0.2, 0.02, solid(0x3a1a12, 0.5), x, 0.5, z + 0.3, g); }
function dWallLamp(g, x, y, z, ry) { const k = new THREE.Group(); k.position.set(x, y, z); k.rotation.y = ry; g.add(k); box(0.05, 0.22, 0.04, iron, 0, 0, 0.02, k); box(0.04, 0.04, 0.2, iron, 0, -0.05, 0.1, k); cyl(0.07, 0.06, 0.2, GLOWM, 0, 0.02, 0.2, k, 10); cyl(0.09, 0.05, 0.04, brass, 0, 0.14, 0.2, k, 10); }
function dHydrant(g, x, z) { cyl(0.11, 0.13, 0.6, solid(0xb02a24, 0.6), x, 0.3, z, g, 10); mesh(new THREE.SphereGeometry(0.115, 10, 6, 0, 7, 0, Math.PI / 2), solid(0xb02a24, 0.6), x, 0.6, z, g); for (const sx of [-1, 1]) cyl(0.05, 0.05, 0.12, solid(0xd2d0c8, 0.4, 0.4), x + sx * 0.14, 0.38, z, g, 8).rotation.z = Math.PI / 2; }
function dBin(g, x, z) { cyl(0.2, 0.17, 0.5, TIN, x, 0.25, z, g, 12); cyl(0.215, 0.215, 0.03, TIN, x, 0.52, z, g, 12); cyl(0.03, 0.03, 0.04, iron, x, 0.56, z, g, 6); }
function dGull(g, x, y, z, ry) { const k = new THREE.Group(); k.position.set(x, y, z); k.rotation.y = ry; g.add(k); const w = solid(0xf2f1ea, 0.8); const body = mesh(BLOB, w, 0, 0.1, 0, k); body.scale.set(0.09, 0.08, 0.15); mesh(BLOB, w, 0, 0.2, 0.12, k).scale.set(0.05, 0.05, 0.05); const beak = cyl(0.01, 0.025, 0.06, solid(0xe0a830, 0.6), 0, 0.2, 0.19, k, 6); beak.rotation.x = Math.PI / 2; const wing = box(0.16, 0.02, 0.18, solid(0x9aa0a6, 0.8), 0, 0.15, -0.02, k); wing.rotation.z = 0.0; }
function dShip(g, x, z, len, ry = 0, funnel = true) { const k = new THREE.Group(); k.position.set(x, 0, z); k.rotation.y = ry; g.add(k); const hull = solid(0x2a2d33, 0.8); box(len, 1.8, len * 0.25, hull, 0, 0.1, 0, k); box(len * 0.98, 0.15, len * 0.25 + 0.02, solid(0x7a2e24, 0.8), 0, -0.7, 0, k); box(len * 0.5, 1.1, len * 0.2, solid(0xdcd6c4, 0.8), -len * 0.05, 1.5, 0, k); if (funnel) cyl(len * 0.045, len * 0.05, 1.6, solid(0x16181b, 0.7), -len * 0.1, 2.5, 0, k, 12); cyl(0.05, 0.07, len * 0.4, woodDark, len * 0.22, 2.5, 0, k, 6); }

/* the print shop (built when the page loads) */
{ const g = room;
  dClock(g, 3.3, 2.75, Z0 + 0.03, 0);   /* on plain wall beside the shelves (it used to hang in front of the back window) */ dPegs(g, -2.7, 1.75, Z1 - 0.04, Math.PI);
  dPlant(g, -3.7, 3.0, 1.1); WALLS.push([-4.0, 2.7, -3.4, 3.3]);
  dBarrel(g, 4.05, 0, 1.15, 1, woodDark); WALLS.push([3.75, 0.85, 4.35, 1.45]);
  cyl(0.012, 0.012, 1.5, wood, 4.38, 0.75, 3.1, g, 6).rotation.z = 0.06; box(0.3, 0.2, 0.04, solid(0xb59a5a, 0.95), 4.3, 0.1, 3.1, g);   /* a broom */
  for (let i = 0; i < 3; i++) cyl(0.07, 0.07, 0.1 + i * 0.0, solid(0x1a1a1d, 0.4, 0.3), 4.1 - i * 0.12, 0.05, -1.5, g, 10);   /* tins of ink */
  box(0.32, 0.03, 0.22, solid(0xe6dcc2, 0.95), -3.4, 1.02, -2.95, g);   /* a proof left on a type stand */ }

/* the other places are decorated when they are first built */
{ const b = buildHall; buildHall = () => { const first = !hallBuilt; b(); if (!first) return; const g = hallG;
    dClock(g, -3.3, 2.95, HALL.z0 + 0.03, 0);
    dPlant(g, -3.9, -3.5, 1.3, 0.25); dPlant(g, 3.9, -3.5, 1.3, 0.25); dPegs(g, -3.2, 1.75, HALL.z1 - 0.04, Math.PI, 5);
    for (const z of [-1.0, 1.3]) dWallLamp(g, HALL.x0 + 0.02, 2.4, z, Math.PI / 2); dWallLamp(g, HALL.x1 - 0.02, 2.4, 1.3, -Math.PI / 2);
    box(0.5, 0.5, 0.5, woodDark, -4.15, 0.25, 3.2, g); cyl(0.2, 0.2, 0.55, TIN, -4.15, 0.78, 3.2, g, 14); cyl(0.02, 0.02, 0.1, brass, -3.93, 0.62, 3.2, g, 6).rotation.z = Math.PI / 2; HALL_WALLS.push([-4.5, 2.9, -3.8, 3.5]);   /* a water cooler by the door */
    for (const [x, z] of [[-1.0, 3.3], [1.0, 3.3]]) cyl(0.03, 0.03, 0.9, brass, x, 0.45, z, g, 6);   /* brass posts either side of the door */
  }; }
{ const b = buildStreet; buildStreet = () => { const first = !streetBuilt; b(); if (!first) return; const g = streetG;
    for (let i = -4; i <= 4; i++) for (const sz of [-1, 1]) if (i !== 0) dTree(g, i * 6 + sz * 1.5, sz * 5.1, 3.0 + ((i + 9) % 3) * 0.35, 1.0);   /* trees along the kerb */
    dHydrant(g, -12, 4.7); dHydrant(g, 15, -4.7); dBin(g, -15.6, 6.9); dBin(g, -2.8, -6.9); dBin(g, 10.2, 6.9);
    { const m = box(0.5, 1.2, 0.5, solid(0x2c3e66, 0.5, 0.2), -6, 0.6, 5.2, g); box(0.56, 0.1, 0.56, solid(0x2c3e66, 0.5, 0.2), -6, 1.25, 5.2, g); box(0.3, 0.05, 0.02, solid(0xe6dcc2, 0.9), -6, 0.95, 4.93, g); }   /* a post box */
    { const st = stripeTex('#b8453d', '#efe3c5'); for (let i = 0; i < 13; i++) for (const sz of [-1, 1]) if ((i + (sz > 0 ? 1 : 0)) % 3 === 0) { const a = box(1.7, 0.04, 1.0, std(st, 0.9), -27 + i * 4.5 - 0.5, 3.45, sz * 7.0, g); a.rotation.x = -sz * 0.28; } }   /* striped awnings over some doors */
    { const c = new THREE.Group(); c.position.set(7.5, 0, -5.7); c.rotation.y = 0.2; g.add(c); box(1.7, 0.1, 0.9, wood, 0, 0.62, 0, c); for (const sz of [-1, 1]) mesh(new THREE.TorusGeometry(0.32, 0.04, 8, 20), iron, 0, 0.34, sz * 0.5, c); dBarrel(c, -0.4, 0.67, 0, 0.8); dBarrel(c, 0.2, 0.67, 0.1, 0.8); dCrate(c, 0.6, 0.67, -0.1, 0.4); for (const sz of [-1, 1]) box(1.1, 0.05, 0.05, wood, 1.2, 0.58, sz * 0.35, c); }   /* a handcart with barrels */
    { const n = new THREE.Group(); n.position.set(-9.5, 0, 5.8); g.add(n); box(1.1, 1.0, 0.7, woodDark, 0, 0.5, 0, n); const roof = box(1.3, 0.06, 0.95, std(stripeTex('#2f5f7a', '#efe3c5'), 0.9), 0, 1.65, 0, n); roof.rotation.x = 0.12; for (const [dx, dz] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) box(0.05, 0.65, 0.05, wood, dx, 1.32, dz, n); for (let i = 0; i < 4; i++) { const p = mesh(new THREE.PlaneGeometry(0.28, 0.38), std(sheetTex('NEWS'), 1), -0.4 + i * 0.27, 1.12, 0.36, n); p.rotation.x = -0.25; } }   /* a news stand */
    for (const sx of [-1, 1]) { const e = box(14, 14, 3, solid(0x6a4034, 1), sx * 32.5, 7, 0, g); mesh(new THREE.PlaneGeometry(14, 14), std(facadeTex(sx > 0 ? 2 : 3), 0.95), sx * 30.98, 7, 0, g).rotation.y = -sx * Math.PI / 2; }   /* a cross street closes each end */
  }; }
{ const b = buildPress; buildPress = () => { const first = !pressBuilt; b(); if (!first) return; const g = pressG;
    dStove(g, -4.2, 2.9, PRESS.h); PRESS_WALLS.push([-4.6, 2.5, -3.8, 3.3]);
    dBarrel(g, 4.2, 0, -3.3, 1, solid(0x1d1e22, 0.5, 0.2)); dBarrel(g, 3.35, 0, -3.45, 1, solid(0x1d1e22, 0.5, 0.2)); PRESS_WALLS.push([3.0, -3.8, 4.6, -3.0]);   /* drums of ink */
    for (const [ry, rz] of [[0.24, 0.6], [0.24, 1.06], [0.62, 0.83]]) cyl(0.22, 0.22, 0.8, solid(0xe2d8bd, 0.95), 4.2, ry, rz, g, 18).rotation.z = Math.PI / 2; PRESS_WALLS.push([3.7, 0.3, 4.7, 1.4]);   /* reels of newsprint */
    dClock(g, 0.6, 3.3, PRESS.z0 + 0.03, 0); dPegs(g, PRESS.x1 - 0.04, 1.75, 2.7, -Math.PI / 2, 3);
    cyl(0.17, 0.17, 0.05, wood, -2.9, 0.58, 0.6, g, 14); for (const [dx, dz] of [[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]]) cyl(0.015, 0.02, 0.56, woodDark, -2.9 + dx, 0.28, 0.6 + dz, g, 6); PRESS_WALLS.push([-3.1, 0.4, -2.7, 0.8]);   /* a stool */
    dPlant(g, 4.2, 3.0, 0.9); dWallLamp(g, PRESS.x0 + 0.02, 2.4, 2.5, Math.PI / 2); dWallLamp(g, PRESS.x1 - 0.02, 2.4, -0.3, -Math.PI / 2);
  }; }
{ const b = buildDock; buildDock = () => { const first = !dockBuilt; b(); if (!first) return; const g = dockG;
    for (const i of [2, 6, 10]) dGull(g, -9.6 + i * 1.5, 0.0, 4.4, 0.6 + i * 0.4);   /* gulls on the posts */
    { const k = new THREE.Group(); k.position.set(8.4, 0, -3.0); g.add(k); box(0.34, 3.6, 0.34, iron, 0, 1.8, 0, k); const jib = box(0.16, 3.4, 0.16, iron, 1.0, 3.9, 0, k); jib.rotation.z = -1.05; box(1.4, 0.5, 1.2, solid(0x35383e, 0.7, 0.2), 0, 0.25, 0, k); cyl(0.01, 0.01, 2.2, solid(0x222222), 2.45, 3.6, 0, k, 4); box(0.18, 0.2, 0.18, iron, 2.45, 2.4, 0, k); DOCK_WALLS.push([7.6, -3.7, 9.2, -2.3]); }   /* a small crane */
    for (let i = 0; i < 6; i++) { const s = box(0.55, 0.22, 0.34, solid(0xc9b48a, 0.95), -6.8 + (i % 3) * 0.58, 0.11 + Math.floor(i / 3) * 0.22, -3.05, g); s.rotation.y = (i % 2) * 0.1; } DOCK_WALLS.push([-7.1, -3.4, -5.0, -2.7]);   /* sacks */
    dBarrel(g, -2.2, 0, -3.2, 1); dBarrel(g, -1.6, 0, -3.35, 1); dBarrel(g, -1.9, 0.78, -3.25, 1); DOCK_WALLS.push([-2.6, -3.7, -1.2, -2.8]);
    for (const x of [-7, 0, 7]) { const l = mesh(BLOB, GLOWM, x, 3.7, -3.9, g); l.scale.set(0.12, 0.12, 0.12); }
    dShip(g, -26, 34, 18, 0.15); dShip(g, 30, 26, 11, -0.2, false); dShip(g, 8, 52, 24, 0.05);
    for (let i = 0; i < 16; i++) { const h = 7 + ((i * 37) % 17); box(7, h, 6, solid(0x7f8a92, 1), -60 + i * 8, h / 2 - 0.7, 78, g); }   /* a far shore of low buildings, in the haze */
  }; }
{ const b = buildLiberty; buildLiberty = () => { const first = !libBuilt; b(); if (!first) return; const g = libG;
    dPlant(g, -5.5, -4.5, 1.6, 0.4); dPlant(g, 5.7, -4.5, 1.6, 0.4);
    { const p = new THREE.Group(); p.position.set(-6.55, 0, 4.0); g.add(p); box(0.6, 1.25, 1.5, woodDark, 0, 0.62, 0, p); box(0.45, 0.05, 1.45, wood, 0.28, 0.9, 0, p); box(0.04, 0.05, 1.3, solid(0xf0ebd9, 0.5), 0.5, 0.94, 0, p); for (let i = 0; i < 8; i++) box(0.03, 0.03, 0.06, solid(0x15110d, 0.5), 0.52, 0.97, -0.55 + i * 0.16, p); cyl(0.17, 0.17, 0.05, wood, 0.9, 0.5, 0, p, 14); cyl(0.02, 0.02, 0.48, woodDark, 0.9, 0.25, 0, p, 6); LIB_WALLS.push([-7.0, 3.2, -6.2, 4.8]); }   /* a piano against the wall */
    for (const side of [-1, 1]) for (const z of [-3.2, 0, 3.0]) for (const dz of [-0.92, 0.92]) box(0.06, 2.3, 0.42, CLOTH, side * (LIB.x1 - 0.06), 2.55, z + dz, g);   /* curtains either side of every window */
    dClock(g, 0, 4.5, LIB.z1 - 0.03, Math.PI); dPegs(g, -3.4, 1.8, LIB.z1 - 0.04, Math.PI, 6);
    for (const side of [-1, 1]) for (const z of [-1.6, 1.5]) dWallLamp(g, side * (LIB.x1 - 0.02), 3.1, z, side > 0 ? -Math.PI / 2 : Math.PI / 2);
  }; }
{ const b = buildOffice; buildOffice = () => { const first = !offBuilt; b(); if (!first) return; const g = offG;
    mesh(new THREE.PlaneGeometry(2.8, 2.0), std(rugTex(), 1), -0.5, 0.012, -0.8, g).rotation.x = -Math.PI / 2;
    { const f = new THREE.Group(); f.position.set(3.5, 0, -2.8); g.add(f); box(0.6, 1.3, 0.55, solid(0x4a4f56, 0.6, 0.3), 0, 0.65, 0, f); for (const y of [0.25, 0.65, 1.05]) { box(0.5, 0.3, 0.02, solid(0x585e66, 0.6, 0.3), 0, y, 0.285, f); box(0.14, 0.03, 0.03, brass, 0, y, 0.31, f); } cyl(0.02, 0.02, 0.1, brass, 0, 1.37, 0, f, 6); mesh(new THREE.SphereGeometry(0.15, 16, 12), solid(0x4a6fa0, 0.5), 0, 1.55, 0, f); mesh(new THREE.TorusGeometry(0.17, 0.012, 6, 24), brass, 0, 1.55, 0, f).rotation.x = Math.PI / 2 - 0.4; OFF_WALLS.push([3.15, -3.15, 3.9, -2.5]); }   /* a filing cabinet with a globe on it */
    { const h = new THREE.Group(); h.position.set(-3.0, 0, 2.8); g.add(h); cyl(0.03, 0.03, 1.7, woodDark, 0, 0.85, 0, h, 8); cyl(0.2, 0.22, 0.05, woodDark, 0, 0.03, 0, h, 12); for (let i = 0; i < 4; i++) { const a = box(0.22, 0.03, 0.03, woodDark, Math.cos(i * 1.57) * 0.1, 1.68, Math.sin(i * 1.57) * 0.1, h); a.rotation.y = -i * 1.57; } cyl(0.11, 0.11, 0.012, solid(0x2c2a2a, 0.9), 0, 1.75, 0, h, 14); cyl(0.07, 0.08, 0.08, solid(0x2c2a2a, 0.9), 0, 1.8, 0, h, 12); OFF_WALLS.push([-3.3, 2.5, -2.7, 3.1]); }   /* a hat stand */
    dClock(g, 0, 2.7, OFF.z0 + 0.03, 0); dPlant(g, -3.2, -2.9, 1.2); OFF_WALLS.push([-3.5, -3.2, -2.9, -2.6]);
    cyl(0.1, 0.12, 0.04, iron, -0.15, 0.86, -1.65, g, 12); cyl(0.012, 0.012, 0.22, iron, -0.15, 0.97, -1.65, g, 6); cyl(0.035, 0.035, 0.03, iron, -0.15, 1.1, -1.65, g, 8); box(0.05, 0.1, 0.05, iron, -0.05, 0.99, -1.65, g);   /* a telephone */
    cyl(0.14, 0.11, 0.3, TIN, -1.7, 0.15, -2.3, g, 12); dWallLamp(g, OFF.x0 + 0.02, 2.4, 2.3, Math.PI / 2);
  }; }
{ const b = buildPark; buildPark = () => { const first = !parkBuilt; b(); if (!first) return; const g = parkG;
    for (const [x, z, h, r] of [[-10.5, -5.5, 4.6, 1.9], [10.5, -6, 5.0, 2.1], [-12.5, 1.5, 4.2, 1.7], [12.5, 3, 4.4, 1.8], [-14.5, -8, 5.2, 2.2], [15, -9, 4.8, 2.0], [-7, -9, 5.4, 2.1], [7, -10, 5.0, 2.0]]) dTree(g, x, z, h, r);
    for (const [x, z, s] of [[-2.7, -1.6, 0.7], [2.7, -1.6, 0.7], [-7.6, -0.5, 0.8], [7.4, -0.3, 0.8], [-8.3, 4.6, 0.6], [8.3, 4.8, 0.6]]) { const bsh = mesh(BLOB, CANOPY2, x, s * 0.55, z, g); bsh.scale.set(s, s * 0.7, s); for (let k = 0; k < 4; k++) { const f = mesh(BLOB, solid(k % 2 ? 0xd9453a : 0xf0b53a, 0.7), x + Math.cos(k * 1.7) * s * 0.75, s * (0.55 + (k % 2) * 0.2), z + Math.sin(k * 1.7) * s * 0.75, g); f.scale.set(0.09, 0.09, 0.09); } }
    { const p = new THREE.Group(); p.position.set(5.6, 0, -3.9); g.add(p); cyl(0.04, 0.05, 5.6, solid(0xcfd3d6, 0.4, 0.5), 0, 2.8, 0, p, 8); mesh(BLOB, brass, 0, 5.68, 0, p).scale.set(0.07, 0.07, 0.07); const fl = mesh(new THREE.PlaneGeometry(1.5, 0.9), new THREE.MeshStandardMaterial({ map: flagJamTex(), roughness: 0.9, side: THREE.DoubleSide }), 0.78, 5.1, 0, p); PARK_WALLS.push([5.4, -4.1, 5.8, -3.7]); }   /* the flag of Jamaica, as it is today */
    for (const [x, z, h, r, c] of [[-60, -52, 22, 36, 0x5a7f78], [-18, -58, 17, 30, 0x4f7a6e], [24, -54, 24, 38, 0x5a7f78], [62, -56, 16, 30, 0x4f7a6e]]) mesh(new THREE.ConeGeometry(r, h, 10), solid(c, 1), x, h / 2 - 0.5, z, g).scale.set(1.5, 1, 1);   /* the hills behind the town */
    for (const lx of [-6, 6]) { cyl(0.05, 0.07, 3.4, solid(0x202428, 0.6), lx, 1.7, 4.4, g, 8); mesh(BLOB, GLOWM, lx, 3.55, 4.4, g).scale.set(0.2, 0.2, 0.2); }
  }; }

/* ---------- places ---------- */
const PLACES = {
  shop: { group: room, lamp: lampLight, walls: WALLS, bounds: BOUNDS, people: SHOP_PEOPLE, actions: SHOP_ACTIONS, start: START, caption: 'Kingston, about 1908' },
  hall: { group: hallG, lamp: hallLamp, walls: HALL_WALLS, bounds: HALL_BOUNDS, people: HALL_PEOPLE, actions: HALL_ACTIONS, start: { x: 0, z: 3.1, yaw: 0 }, caption: 'Kingston, July 1914' },
  street: { group: streetG, lamp: new THREE.Object3D(), walls: STREET_WALLS, bounds: STREET_BOUNDS, people: STREET_PEOPLE, actions: [], start: { x: -7, z: 2.6, yaw: -1.25 }, caption: 'Harlem, New York, 1916', sky: 0x9ec8e6 },
  park: { group: parkG, lamp: new THREE.Object3D(), walls: PARK_WALLS, bounds: PARK_BOUNDS, people: PARK_PEOPLE, actions: PARK_ACTIONS, start: { x: 0, z: 5.2, yaw: 0 }, caption: 'National Heroes Park, Kingston, today', sky: 0x9fd0ea },
  office: { group: offG, lamp: offLamp, walls: OFF_WALLS, bounds: OFF_BOUNDS, people: OFF_PEOPLE, actions: OFF_ACTIONS, start: { x: 0, z: 2.5, yaw: 0 }, caption: 'Harlem, New York, 1925' },
  liberty: { group: libG, lamp: libLamp, walls: LIB_WALLS, bounds: LIB_BOUNDS, people: LIB_PEOPLE, actions: LIB_ACTIONS, start: { x: 0, z: 4.5, yaw: 0 }, caption: 'Liberty Hall, Harlem, August 1920' },
  dock: { group: dockG, lamp: new THREE.Object3D(), walls: DOCK_WALLS, bounds: DOCK_BOUNDS, people: DOCK_PEOPLE, actions: DOCK_ACTIONS, start: { x: 0, z: -2.6, yaw: Math.PI }, caption: 'New York, 1919', sky: 0x9fc6dc },
  press: { group: pressG, lamp: pressLamp, walls: PRESS_WALLS, bounds: PRESS_BOUNDS, people: PRESS_PEOPLE, actions: PRESS_ACTIONS, start: { x: 0, z: 3.1, yaw: 0 }, caption: 'Harlem, New York, 1918' } };
let place = 'shop', placeT = 0, pfT = 0;
const PLACE_ORDER = ['shop', 'hall', 'street', 'press', 'dock', 'liberty', 'office', 'park'];   /* the chapters in order */
function prefetchNext(name) {   /* a few seconds after arriving, quietly fetch the people of the next chapter's place, so the move there is quick */
  clearTimeout(pfT); const nx = PLACES[PLACE_ORDER[PLACE_ORDER.indexOf(name) + 1]]; if (!nx) return;
  pfT = setTimeout(() => prefetch([...new Set(nx.people.map((n) => n.model))]), 4000); }
function enterPlace(name, keepPos) {
  place = name; const P = PLACES[name]; prefetchNext(name);
  for (const k of Object.keys(PLACES)) { const Q = PLACES[k]; Q.group.visible = k === name; Q.lamp.visible = k === name; for (const n of Q.people) { if (n.mark) n.mark.visible = false; if (n.m) n.m.visible = k === name && !n.hidden; } }
  if (name === 'hall' && stage >= 12) for (const n of HALL_PEOPLE.slice(2)) if (n.m && !n.delay && !n.dest) { n.hidden = false; n.x = n.seat[0]; n.z = n.seat[1]; n.ry = Math.PI; n.m.position.set(n.x, 0, n.z); n.m.rotation.y = Math.PI; n.m.visible = true; if (n.seat) sitDown(n); }
  if (name === 'press') arrangePress();
  if (name === 'liberty') showBanner();   /* a saved game that was past the Declaration shows the finished banner */
  curWalls = P.walls; curBounds = P.bounds; PEOPLE = P.people; ACTIONS = P.actions; near = null;
  scene.background = new THREE.Color(P.sky || 0x2a2118); scene.fog = P.sky ? new THREE.Fog(0xcbd9de, 28, 90) : null;   /* outdoor places have sky and haze; rooms do not */
  hemi.intensity = P.sky ? 2.3 : 1.25; sun.intensity = P.sky ? 2.2 : 1.7; sun.position.set(P.sky ? -5 : 6, P.sky ? 9 : 7, P.sky ? 4 : 5);   /* daylight outside is brighter, so dark skin still shows */
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
}
function showPlace() { const el = $('place'); el.textContent = PLACES[place].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(placeT); placeT = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetChapter2() {   /* the hall again: the poster comes down, the neighbours go home, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); delete story.poster; delete story.printed; showPoster(); stage = 10;
  for (const n of HALL_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.legs = null; n.seated = false; n.delay = 0; n.x = n.hx; n.z = n.hz; n.hidden = HALL_PEOPLE.indexOf(n) >= 2; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  enterPlace('hall'); setStage(10); showPlace();
}

/* ---------- loading and starting ---------- */
applySave(loadGame());
let modelsReady = false;
{ let done = 0; const total = 1 + PEOPLE.length, tick = (x) => { done++; $('bar').style.width = (done / total * 100) + '%'; return x; };
  Promise.all([model('anims').then(tick), ...PEOPLE.map((n) => model(n.model).then(tick))]).then(([anims, ...gl]) => {
    loadClips(anims);
    PEOPLE.forEach((n, i) => { const m = gl[i].scene; m.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; });
      m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; m.userData.ground = 0; scene.add(m); animate(m, n.base); grounded.push(m); n.m = m; });
    (stage >= 70 ? ensurePark() : stage >= 60 ? ensureOffice() : stage >= 50 ? ensureLiberty() : stage >= 40 ? ensureDock() : stage >= 30 ? ensurePress() : stage >= 20 ? ensureStreet() : stage >= 10 ? ensureHall() : Promise.resolve()).then(() => { enterPlace(stage >= 70 ? 'park' : stage >= 60 ? 'office' : stage >= 50 ? 'liberty' : stage >= 40 ? 'dock' : stage >= 30 ? 'press' : stage >= 20 ? 'street' : stage >= 10 ? 'hall' : 'shop'); showPoster(); if (__DEV__) devViews(); });
    modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave;
  }); }
function startGame() {
  audioInit(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount(); setGoal();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. E to use.'; showHint();
  showPlace(); canvas.focus();
}
$('start').onclick = () => { startGame(); cue('begin'); };

/* ---------- the frame loop ---------- */
function update(dt, now) {
  if (state.started && !busy) {
    if (keys.has('arrowleft')) state.yaw += 1.8 * dt; if (keys.has('arrowright')) state.yaw -= 1.8 * dt;
    let f = stick.id !== null ? -stick.dy : 0, r = stick.id !== null ? stick.dx : 0;
    if (keys.has('w') || keys.has('arrowup')) f += 1; if (keys.has('s') || keys.has('arrowdown')) f -= 1; if (keys.has('d')) r += 1; if (keys.has('a')) r -= 1;
    const len = Math.hypot(f, r);
    if (len > 0.05) { const sp = (keys.has('shift') ? 3.6 : 2.2) * Math.min(1, len), fx = -Math.sin(state.yaw), fz = -Math.cos(state.yaw);
      [state.x, state.z] = clampPos(state.x + (fx * f - fz * r) / Math.max(1, len) * sp * dt, state.z + (fz * f + fx * r) / Math.max(1, len) * sp * dt);
      stepT -= dt * sp; if (stepT <= 0) { stepT = 1.3; stepSound('wood'); } }
  }
  for (const n of PEOPLE) npcTick(n, dt);
  near = null; if (state.started && !busy) { let best = 2.6; for (const n of PEOPLE) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && n.m.visible && d < best) { best = d; near = n; } }
    for (const a of ACTIONS) if (a.on() && Math.hypot(state.x - a.x, state.z - a.z) < a.r) near = a; }   /* standing at a thing to do beats a person nearby */
  const talkBtn = $('talk'); talkBtn.hidden = !(near && near.go); if (near && near.go) talkBtn.textContent = near.label;   /* people get the bubble; things to do get this button */
  for (const mx of mixers) mx.update(dt); for (const n of PEOPLE) if (n.m && n.m.userData.anim) n.m.userData.anim.tick(dt);
  for (const m of grounded) groundFeet(m);
  if (now !== undefined) { audioTick(now / 1000); bubbleTick(now / 1000); stickUI(); nudgeTick(now); }
}
let last = performance.now(), stepT = 0;
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  camera.position.set(state.x, EYE, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);

/* ---------- test views and scripted playthroughs: dev builds only (node tools/build.mjs garvey --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search); const shot = q.get('shot');
  const go = (x, z, yaw, pitch) => { $('title').hidden = true; $('hud').hidden = false; state.started = true; state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); showCount(); setGoal(); };
  const inHall = (st, x, z, yaw, pitch, poster) => ensureHall().then(() => { stage = st; best = Math.max(best, st); if (poster) { story.poster = poster; story.printed = st >= 12; } enterPlace('hall'); go(x, z, yaw, pitch); showPoster(); });
  const VIEWS = { shop1: [-0.5, 2.9, 0, 0], shop2: [0.6, 0.4, -0.75, -0.08], shop3: [-2.0, -0.2, 0.3, 0.05], shop4: [-0.5, 0.6, Math.PI, -0.02], shop5: [0.9, 1.8, 0.35, -0.1], shop6: [3.9, 3.0, 0.6, 0], shop7: [-3.7, 1.8, 0.7, 0.1] };
  if (shot && VIEWS[shot]) go(...VIEWS[shot]);
  if (shot === 'talk') { go(-2.0, -0.3, 0.3, 0.05); startTalk(PEOPLE[0]); }
  if (shot === 'strike') { go(-2.0, -0.3, 0.3, 0.05); stage = 2; startTalk(PEOPLE[0]); step = 5; showLine(); }
  if (shot === 'type') { go(-1.9, -1.7, 0, -0.1); stage = 1; openType('NOTICE'); for (const ch of 'NOT') $('tcase').querySelector('[data-l="' + ch + '"]').click(); }
  if (shot === 'typedone') { go(-1.9, -1.7, 0, -0.1); stage = 1; openType('NOTICE'); for (const ch of 'NOTICE') $('tcase').querySelector('[data-l="' + ch + '"]').click(); $('tpress').click(); }
  if (shot === 'journal') { go(-1.9, -1.7, 0, -0.1); unlock('garvey-printer', true); unlock('strike', true); unlock('press', true); openJournal('strike'); }
  if (shot === 'chapters') { go(-0.5, 2.9, 0, 0); best = 3; openChapters(); }
  if (shot === 'reset') { go(-0.5, 2.9, 0, 0); setTimeout(() => $('reset').click(), 600); }
  if (shot === 'credits') { go(-0.5, 2.9, 0, 0); openCredits(); }
  if (shot === 'bubble') { go(-2.3, -0.8, 0.25, 0.08); }
  if (shot === 'nudge') { go(-0.5, 2.9, Math.PI / 2, 0); NUDGE.still = performance.now() - 20000; }
  const inStreet = (st, x, z, yaw, pitch) => ensureStreet().then(() => { stage = st; best = Math.max(best, st); enterPlace('street'); go(x, z, yaw, pitch); });
  const inPark = (st, x, z, yaw, pitch) => ensurePark().then(() => { stage = st; best = Math.max(best, st); enterPlace('park'); go(x, z, yaw, pitch); });
  if (shot === 'park1') inPark(70, 0, 5.2, 0, 0.05);
  if (shot === 'park2') inPark(71, 0.6, 1.4, 0.0, 0.1);
  if (shot === 'time') inPark(71, -5.0, 1.4, 0, 0).then(() => openTime());
  if (shot === 'timedone') inPark(71, -5.0, 1.4, 0, 0).then(() => { openTime(); for (let i = 0; i < EVENTS.length; i++) $('tmtray').querySelector('[data-i="' + i + '"]').click(); });
  if (shot === 'answer') inPark(73, 0, -0.3, 0, 0).then(() => { openAnswer(); $('anopen').children[2].click(); $('anwhy').children[2].click(); });
  if (shot === 'journey') { Object.assign(story, { strike: 'wait', poster: 'UNITY', words: 'learn', answer: 'listen', headline: 'learn', delivery: 'split', plan: 'wait', advice: 'truth', helped: 'delegate', question: 'who', reassure: 'ask', final: 'It is still being built. I think of people working together to make it true.' }); inPark(74, 0, 5.2, 0, 0.05).then(() => { refreshJourney(); unlock('journey', true); openJournal('journey'); }); }
  if (shot === 'parkchat') inPark(72, 0.5, 4.0, 0.2, 0.05).then(() => startTalk(byId('student')));
  const inOff = (st, x, z, yaw, pitch) => ensureOffice().then(() => { stage = st; best = Math.max(best, st); enterPlace('office'); go(x, z, yaw, pitch); });
  if (shot === 'off1') inOff(60, 0, 2.5, 0, 0.03);
  if (shot === 'off2') inOff(61, 0.5, 0.2, 0.6, -0.12);
  if (shot === 'sort') inOff(61, -0.5, -0.5, 0, 0).then(() => { openSort(); });
  if (shot === 'sortdone') inOff(61, -0.5, -0.5, 0, 0).then(() => { openSort(); $('sobtns').querySelector('[data-a="rumour"]').click(); $('sobtns').querySelector('[data-a="fact"]').click(); });
  if (shot === 'letter') { story.advice = 'cheer'; inOff(63, 3.0, 0.0, -1.3, 0).then(() => { openLetter(); $('lebtns').children[0].click(); }); }
  if (shot === 'offchat') inOff(62, 0.9, 0.2, 0.15, 0.05).then(() => startTalk(byId('amyj')));
  if (shot === 'soapbox1') inStreet(21, 0, 2.3, 0, -0.38);   /* Garvey on the soapbox, from the front, from the side and from behind (close, looking down at his feet) */
  if (shot === 'soapbox2') inStreet(21, 2.2, 0.5, Math.PI / 2, -0.38);
  for (const k of [1, 2, 3]) if (shot === 'soapboxT' + k) inStreet(21, 0, 2.6, 0, -0.3).then(() => { const t = setInterval(() => { if (CL['Talk' + k]) { byId('garvey3').m.userData.anim.play('Talk' + k); clearInterval(t); } }, 100); });
  if (shot === 'soapbox3') inStreet(21, 0, -1.3, Math.PI, -0.38);
  if (shot === 'poster') inStreet(21, -3.7, 0.5, -Math.PI / 2, 0.0).then(() => {   /* looking down the street at Garvey on the soapbox, speaking, with his listeners seen from behind */
    const put = (id, x, z, tx, tz) => { const n = byId(id); n.x = x; n.z = z; n.ry = faceToward(x, z, tx, tz); n.m.position.set(x, 0, z); n.m.rotation.y = n.ry; n.m.visible = true; };
    put('garvey3', 0, 0.45, -3.7, 0.5); put('worker', -1.3, 1.5, 0, 0.5); put('woman', -1.1, -0.6, 0, 0.5); byId('critic').m.visible = false;
    const t = setInterval(() => { if (CL.Talk2) { byId('garvey3').m.userData.anim.play('Talk2'); clearInterval(t); } }, 200); });
  if (shot === 'nextcard') inStreet(23, -1.2, 2.3, 0.4, 0.05).then(() => nextCard(2, 23));
  const inLib = (st, x, z, yaw, pitch) => ensureLiberty().then(() => { stage = st; best = Math.max(best, st); enterPlace('liberty'); go(x, z, yaw, pitch); });
  if (shot === 'lib1') inLib(50, 0, 4.5, 0, 0.04);
  if (shot === 'lib2') inLib(50, -1.0, 1.0, -2.6, 0.02);
  if (shot === 'lib3') { story.banner = true; story.helped = 'delegate'; inLib(53, 0, 1.2, 0, 0.12).then(showBanner); }
  if (shot === 'decl') inLib(52, 4.8, 3.0, 0, 0).then(() => openDecl());
  if (shot === 'decldone') inLib(52, 4.8, 3.0, 0, 0).then(() => { openDecl(); for (const c of RBG_ORDER) $('dccolors').querySelector('[data-c="' + c + '"]').click(); });
  if (shot === 'libchat') inLib(51, -0.2, 3.6, -0.3, 0.05).then(() => startTalk(byId('steward')));
  const inDock = (st, x, z, yaw, pitch) => ensureDock().then(() => { stage = st; best = Math.max(best, st); enterPlace('dock'); go(x, z, yaw, pitch); });
  if (shot === 'dock1') inDock(40, 0, -2.6, Math.PI, 0.05);
  if (shot === 'dock2') inDock(41, 0, 3.0, 0, 0.12);
  if (shot === 'dock3') inDock(42, -1.0, -2.2, -2.6, 0.02);
  if (shot === 'inspect') inDock(41, 0, 3.0, 0, 0.1).then(() => { openInspect(); $('inrow').querySelector('[data-k="hull"]').click(); });
  if (shot === 'dockchat') inDock(43, -0.4, 3.0, 0.64, 0.05).then(() => startTalk(byId('friend')));
  const inPress = (st, x, z, yaw, pitch) => ensurePress().then(() => { stage = st; best = Math.max(best, st); enterPlace('press'); go(x, z, yaw, pitch); });
  if (shot === 'press1') inPress(30, 0, 3.1, 0, 0.03);
  if (shot === 'press2') inPress(31, 1.2, 1.2, -0.8, -0.02);
  if (shot === 'press3') inPress(32, -0.6, 1.4, 0.7, -0.05);
  if (shot === 'pagebuild') inPress(31, -1.4, -0.1, 1.5, 0).then(() => openPage());
  if (shot === 'pagedone') inPress(31, -1.4, -0.1, 1.5, 0).then(() => { openPage(); for (const k of ['title', 'head', 'pic', 'price']) { $('pgtray').querySelector('[data-k="' + k + '"]').click(); $('pgpage').querySelector('[data-k="' + k + '"]').click(); } $('pgpress').click(); });
  if (shot === 'pressback') { story.delivery = 'split'; story.headline = 'learn'; inPress(33, 0.4, 0.2, 0.55, -0.02); }
  if (shot === 'presschat') inPress(32, 2.4, 0.5, -2.98, 0.05).then(() => startTalk(byId('sailor')));
  if (shot === 'street1') inStreet(20, -7, 2.6, -1.25, 0.02);
  if (shot === 'street2') inStreet(21, 4.5, 1.2, 1.35, 0.03);
  if (shot === 'streetchat') inStreet(21, 0.3, 2.9, 0.1, 0.05).then(() => startTalk(byId('garvey3')));
  if (shot === 'hall1') inHall(10, 0, 3.1, 0, 0);
  if (shot === 'hall2') inHall(11, 1.2, 0.6, -1.0, -0.08, 'WORK');
  if (shot === 'hall3') inHall(13, 0, 1.4, 0, 0.04, 'UNITY');
  if (shot === 'hall4') inHall(12, -3.2, 2.6, 0.75, 0, 'LEARN');
  if (shot === 'hallseat') inHall(13, 0.4, 2.4, Math.PI / 2 - 0.35, 0.0, 'LEARN');   /* the neighbours sitting on the benches, seen from the aisle */
  if (shot === 'hallwalk') inHall(11, 0.5, 3.7, 0.5, 0.0, 'LEARN').then(() => { story.printed = true; setStage(12); for (let i = 0; i < 60 * Number(q.get('t') || 6); i++) update(1 / 60); });   /* the neighbours part-way through arriving: ?shot=hallwalk&t=6 */
  if (shot === 'hallamy') inHall(12, -1.0, 3.3, 0.55, 0.35, 'LEARN');   /* close to Amy, looking up: her bubble must stay clear of the Goal tab */
  if (shot === 'hallseat2') inHall(13, 0.3, 0.9, -Math.PI / 2 + 0.25, 0.0, 'LEARN');
  if (shot === 'hallseat3') inHall(13, 0.0, 3.6, 0.0, 0.05, 'LEARN');
  if (shot === 'hallchat') inHall(10, -0.8, -1.2, 0, 0.04).then(() => startTalk(byId('garvey')));
  if (q.get('test') === 'overlap') {   /* is anyone standing or walking inside furniture? Checks every place's people against its walls (furniture rectangles) */
    (async () => {
      const tm = []; for (const [nm, f] of [['hall', ensureHall], ['street', ensureStreet], ['press', ensurePress], ['dock', ensureDock], ['liberty', ensureLiberty], ['office', ensureOffice], ['park', ensurePark]]) { const t0 = performance.now(); await f(); tm.push(nm + ' ' + Math.round(performance.now() - t0) + 'ms'); }
      console.log('LOAD ' + tm.join(', ') + ' | drawing=' + Math.round(TEXMS) + 'ms textures=' + renderer.info.memory.textures + ' geometries=' + renderer.info.memory.geometries);
      const out = [], R = 0.28, hit = (W, x, z) => W.find(([x0, z0, x1, z1]) => x > x0 - R && x < x1 + R && z > z0 - R && z < z1 + R);
      for (const [name, P] of Object.entries(PLACES)) for (const n of P.people) {
        const pts = [['start', n.hx !== undefined ? n.hx : n.x, n.hz !== undefined ? n.hz : n.z]];
        if (n.path) { n.path.forEach((c, i) => { pts.push(['path' + i, c[0], c[1]]); const d = n.path[(i + 1) % n.path.length]; for (let k = 1; k < 8; k++) pts.push(['path' + i + '>' + ((i + 1) % n.path.length) + ' ' + k + '/8', c[0] + (d[0] - c[0]) * k / 8, c[1] + (d[1] - c[1]) * k / 8]); }); }
        if (n.seat) pts.push(['seat', n.seat[0], n.seat[1]]);
        if (n.legs || n.route) { let prev = [n.x, n.z]; for (const c of [...(n.route || []), n.seat].filter(Boolean)) { for (let k = 1; k <= 8; k++) pts.push(['route ' + k + '/8', prev[0] + (c[0] - prev[0]) * k / 8, prev[1] + (c[1] - prev[1]) * k / 8]); prev = c; } }
        for (const [what, x, z] of pts) { const w = hit(P.walls, x, z); if (w) out.push(name + ':' + n.id + ' ' + what + ' (' + x.toFixed(2) + ',' + z.toFixed(2) + ') in [' + w.map((v) => v.toFixed(2)).join(',') + ']'); }
      }
      document.title = 'OVERLAP ' + (out.length ? out.join(' | ') : 'none');
    })(); }
  if (q.get('test') === 'walk') {   /* step the world by hand and watch the customer walk her route */
    const c = SHOP_PEOPLE[1]; go(4.0, -1.2, 0, 0); const trail = []; let dist = 0, px = c.x, pz = c.z, minx = 9, maxx = -9, minz = 9, maxz = -9, walked = 0;
    for (let i = 0; i < 60 * 40; i++) { update(1 / 60); if (c.walking) walked++; dist += Math.hypot(c.x - px, c.z - pz); px = c.x; pz = c.z; minx = Math.min(minx, c.x); maxx = Math.max(maxx, c.x); minz = Math.min(minz, c.z); maxz = Math.max(maxz, c.z); if (i % 300 === 0) trail.push(c.x.toFixed(1) + ',' + c.z.toFixed(1)); }
    document.title = 'WALK dist=' + dist.toFixed(1) + ' walkingFrames=' + walked + ' x=' + minx.toFixed(1) + '..' + maxx.toFixed(1) + ' z=' + minz.toFixed(1) + '..' + maxz.toFixed(1) + ' leg=' + c.i + ' trail=' + trail.join(' '); }
  if (q.has('auto')) {   /* ?auto=1 plays chapter 1 and opens every menu; ?auto=2 plays chapter 2 from its start */
    const log = []; const L = (m) => { log.push(m); document.title = log.join(' | '); }; addEventListener('error', (e) => L('ERROR ' + e.message));
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const talkTo = async (n) => { state.x = n.x + 1.1; state.z = n.z + 0.5; update(0.016); startTalk(n); let c = 0; while (!$('dialogue').hidden && c < 40) { const ch = $('choices').firstChild; if (ch) ch.click(); else $('next').click(); c++; await sleep(40); } return c; };
    const typeIt = () => { for (const ch of typeWord) { const t = $('tcase').querySelector('[data-l="' + ch + '"]'); if (t) t.click(); } $('tpress').click(); $('tdone').click(); };
    (async () => {
      if (q.get('auto') === '3') {   /* old saves, and replaying a choice (run with a version 1 save already in localStorage) */
        L('loaded: stage=' + stage + ' best=' + best + ' printerTalked=' + byId('printer').talked + ' printerWantsTalk=' + wantsTalk(byId('printer')) + ' ch2open=' + (CHAPTERS[0].done())); $('start').click();
        const pr = byId('printer'); const counts = [];
        for (const pick of [0, 2, 1]) { stage = 2; for (const n of SHOP_PEOPLE) n.talked = false; state.x = pr.x + 1.1; state.z = pr.z + 0.5; update(0.016); startTalk(pr); let c = 0, after = -1; while (!$('dialogue').hidden && c < 40) { const ch = $('choices').children; if (ch.length) { ch[pick].click(); after = lines.length; } else $('next').click(); c++; await sleep(30); } counts.push(after + ':' + story.strike); }
        L('lines after the choice for three tries (choice 0, 2, 1) = ' + counts.join(' '));
        stage = 2; for (const n of SHOP_PEOPLE) n.talked = false; L('strike lines=' + await talkTo(pr) + ' stage=' + stage + ' ch2open=' + CHAPTERS[0].done());
        L(stage === 3 && counts.every((c) => c.split(':')[0] === counts[0].split(':')[0]) && CHAPTERS[0].done() ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '1') {
        L('title: allgames=' + (!$('allgames').hidden) + ' chapters=' + (!$('tchap').hidden)); $('start').click(); L('started=' + state.started + ' place=' + place + ' goal="' + $('goal').textContent + '"');
        L('printer lines=' + await talkTo(SHOP_PEOPLE[0])); L('customer lines=' + await talkTo(SHOP_PEOPLE[1])); L('stage=' + stage);
        state.x = -1.9; state.z = -1.7; update(0.016); L('near=' + (near && near.label)); near.go(); typeIt(); L('typed, stage=' + stage + ' goal="' + $('goal').textContent + '"');
        L('strike lines=' + await talkTo(SHOP_PEOPLE[0]) + ' choice=' + story.strike + ' stage=' + stage + ' pages=' + unlocked.join(',')); nextCard(0, 3); L('next card="' + $('ctitle').textContent + '" text="' + $('cbody').textContent + '" buttons=' + [...$('cbtns').children].map((b) => b.textContent).join('/') + ' shown=' + !$('card').hidden); hideCard();
        $('jbtn').click(); L('journal tabs=' + $('jtabs').children.length + ' count=' + $('jcount').textContent + ' allgames=' + (!$('jhome').hidden)); $('jchap').click();
        L('chapters items=' + $('chlist').children.length + ' playable=' + $('chlist').querySelectorAll('button:not(:disabled)').length); $('chclose').click();
        $('reset').click(); L('reset card="' + $('ctitle').textContent + '" buttons=' + [...$('cbtns').children].map((b) => b.textContent).join('/')); $('cbtns').children[0].click(); await sleep(50);
        L('after restart: stage=' + stage + ' pages=' + unlocked.length + ' choice kept=' + story.strike + ' busy=' + busy);
        L(stage === 0 && unlocked.length === 4 && story.strike === 'speak' && !busy ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '4') {
        $('start').click(); best = 14; stage = 14; CHAPTERS[2].go(); for (let i = 0; i < 300 && place !== 'street'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        for (const id of ['worker', 'woman', 'critic']) L(id + ' lines=' + await talkTo(byId(id))); L('stage=' + stage);
        L('garvey lines=' + await talkTo(byId('garvey3')) + ' words=' + story.words + ' stage=' + stage);
        L('critic lines=' + await talkTo(byId('critic')) + ' answer=' + story.answer + ' stage=' + stage + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L(stage === 23 && story.words === 'work' && story.answer === 'listen' && place === 'street' && CHAPTERS[2].done() ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '5') {
        $('start').click(); best = 23; stage = 23; CHAPTERS[3].go(); for (let i = 0; i < 300 && place !== 'press'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        for (const id of ['pressman', 'garvey4']) L(id + ' lines=' + await talkTo(byId(id))); L('headline=' + story.headline + ' stage=' + stage);
        const act = ACTIONS.find((a) => a.on()); L('action=' + (act && act.label)); act.go();
        $('pgtray').querySelector('[data-k="price"]').click(); $('pgpage').querySelector('[data-k="title"]').click(); L('wrong drop placed=' + $('pgpage').querySelector('[data-k="title"]').disabled + ' msg="' + $('pgmsg').textContent + '"');
        for (const k of ['title', 'head', 'pic', 'price']) { $('pgtray').querySelector('[data-k="' + k + '"]').click(); $('pgpage').querySelector('[data-k="' + k + '"]').click(); }
        L('page msg="' + $('pgmsg').textContent + '" press shown=' + !$('pgpress').hidden); $('pgpress').click(); $('pgdone').click(); L('stage=' + stage + ' laid=' + story.laid + ' bundles=' + bundles.filter((b) => b.visible).length + ' busy=' + busy);
        L('sailor lines=' + await talkTo(byId('sailor')) + ' delivery=' + story.delivery + ' stage=' + stage + ' bundles=' + bundles.filter((b) => b.visible).length);
        L('sailor back lines=' + await talkTo(byId('sailor'))); L('pressman lines=' + await talkTo(byId('pressman')) + ' stage=' + stage + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L(stage === 34 && story.headline === 'pride' && story.delivery === 'all' && place === 'press' && CHAPTERS[3].done() && unlocked.includes('ban') ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '6') {
        $('start').click(); best = 34; stage = 34; CHAPTERS[4].go(); for (let i = 0; i < 300 && place !== 'dock'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        for (const id of ['garvey5', 'clerk', 'engineer']) L(id + ' lines=' + await talkTo(byId(id))); L('stage=' + stage);
        const act = ACTIONS.find((a) => a.on()); L('action=' + (act && act.label)); act.go(); $('inrow').querySelector('[data-k="hull"]').click(); L('done shown early=' + !$('indone').hidden); for (const k of ['engine', 'deck']) $('inrow').querySelector('[data-k="' + k + '"]').click(); L('msg="' + $('inmsg').textContent + '" done shown=' + !$('indone').hidden); $('indone').click(); L('stage=' + stage + ' busy=' + busy);
        L('garvey lines=' + await talkTo(byId('garvey5')) + ' plan=' + story.plan + ' stage=' + stage); L('friend lines=' + await talkTo(byId('friend')) + ' advice=' + story.advice + ' stage=' + stage + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L(stage === 44 && story.plan === 'now' && story.advice === 'truth' && place === 'dock' && CHAPTERS[4].done() && unlocked.includes('bsl') && unlocked.includes('shares') ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '7') {
        $('start').click(); best = 44; stage = 44; CHAPTERS[5].go(); for (let i = 0; i < 300 && place !== 'liberty'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        for (const id of ['nurse', 'delegate', 'messenger']) L(id + ' lines=' + await talkTo(byId(id))); L('stage=' + stage);
        L('steward lines=' + await talkTo(byId('steward')) + ' helped=' + story.helped + ' stage=' + stage);
        const act = ACTIONS.find((a) => a.on()); L('action=' + (act && act.label)); act.go();
        $('dccolors').querySelector('[data-c="green"]').click(); L('wrong first: msg="' + $('dcmsg').textContent + '" done shown=' + !$('dcdone').hidden);
        for (const c of RBG_ORDER) $('dccolors').querySelector('[data-c="' + c + '"]').click(); L('msg="' + $('dcmsg').textContent + '" done shown=' + !$('dcdone').hidden); $('dcdone').click(); L('stage=' + stage + ' banner=' + story.banner + ' busy=' + busy);
        L('garvey lines=' + await talkTo(byId('garvey6')) + ' stage=' + stage + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L('nurse after=' + (byId('nurse').later())); L('delegate after=' + (byId('delegate').later()));
        L(stage === 54 && story.helped === 'nurse' && story.banner && place === 'liberty' && CHAPTERS[5].done() && unlocked.includes('declaration') && unlocked.includes('nurses') ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '8') {
        $('start').click(); best = 54; stage = 54; story.advice = 'truth'; CHAPTERS[6].go(); for (let i = 0; i < 300 && place !== 'office'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        L('amy lines=' + await talkTo(byId('amyj')) + ' stage=' + stage); const act = ACTIONS.find((a) => a.on()); L('action=' + (act && act.label)); act.go();
        for (let i = 0; i < CARDS.length; i++) { const wrong = CARDS[i][1] === 'fact' ? 'rumour' : 'fact'; $('sobtns').querySelector('[data-a="' + wrong + '"]').click(); if (i === 0) L('wrong msg="' + $('somsg').textContent + '"'); $('sobtns').querySelector('[data-a="' + CARDS[i][1] + '"]').click(); if (i < CARDS.length - 1) $('sonext').click(); }
        L('done shown=' + !$('sodone').hidden); $('sodone').click(); L('stage=' + stage + ' busy=' + busy);
        L('amy again lines=' + await talkTo(byId('amyj')) + ' question=' + story.question + ' stage=' + stage);
        const act2 = ACTIONS.find((a) => a.on()); L('action=' + (act2 && act2.label)); act2.go(); L('letter="' + $('letext').textContent + '"'); $('lebtns').children[0].click(); L('reply="' + $('lemsg').textContent + '" done shown=' + !$('ledone').hidden); $('ledone').click();
        L('stage=' + stage + ' reassure=' + story.reassure + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L(stage === 64 && story.question === 'who' && story.reassure === 'honest' && place === 'office' && CHAPTERS[6].done() && unlocked.includes('amyj') && unlocked.includes('trial') && unlocked.includes('rumour') ? 'ALLDONE' : 'STALL'); L('DONE');
      } else if (q.get('auto') === '9') {
        $('start').click(); best = 64; stage = 64; Object.assign(story, { strike: 'speak', poster: 'LEARN', words: 'work', answer: 'listen', headline: 'pride', delivery: 'all', plan: 'now', advice: 'truth', helped: 'nurse', question: 'who', reassure: 'honest' }); CHAPTERS[7].go(); for (let i = 0; i < 300 && place !== 'park'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '" people=' + PEOPLE.map((n) => n.id).join(','));
        for (const id of ['guide', 'student']) L(id + ' lines=' + await talkTo(byId(id))); L('stage=' + stage);
        const act = ACTIONS.find((a) => a.on()); L('action=' + (act && act.label)); act.go(); $('tmtray').querySelector('[data-i="3"]').click(); L('wrong msg="' + $('tmmsg').textContent + '" list=' + $('tmlist').children.length);
        for (let i = 0; i < EVENTS.length; i++) $('tmtray').querySelector('[data-i="' + i + '"]').click(); L('list=' + $('tmlist').children.length + ' done shown=' + !$('tmdone').hidden + ' first="' + $('tmlist').firstChild.textContent + '"'); $('tmdone').click(); L('stage=' + stage + ' busy=' + busy);
        L('student lines=' + await talkTo(byId('student')) + ' stage=' + stage); const act2 = ACTIONS.find((a) => a.on()); L('action=' + (act2 && act2.label)); act2.go(); L('text before="' + $('antext').textContent + '" done shown=' + !$('andone').hidden); $('anopen').children[1].click(); L('after one: done shown=' + !$('andone').hidden); $('anwhy').children[0].click(); L('text="' + $('antext').textContent + '" done shown=' + !$('andone').hidden); $('andone').click();
        L('stage=' + stage + ' final="' + story.final + '" card shown=' + !$('card').hidden + ' goal="' + $('goal').textContent + '"'); $('cbtns').firstChild.click(); L('journal open=' + !$('journal').hidden + ' title="' + document.querySelector('#jpage h3').textContent + '" lines=' + document.querySelectorAll('#jpage p').length + ' first="' + document.querySelector('#jpage p').textContent + '"');
        L(stage === 74 && story.final === 'Not yet. I think of how proud many people are today.' && CHAPTERS[7].done() && unlocked.includes('journey') && unlocked.includes('later') && place === 'park' ? 'ALLDONE' : 'STALL'); L('DONE');
      } else {
        $('start').click(); best = 3; stage = 3; CHAPTERS[1].go(); for (let i = 0; i < 200 && place !== 'hall'; i++) await sleep(100); await sleep(200); L('place=' + place + ' stage=' + stage + ' goal="' + $('goal').textContent + '" caption="' + $('place').textContent + '"');
        L('amy lines=' + await talkTo(byId('amy'))); L('garvey lines=' + await talkTo(byId('garvey')) + ' poster=' + story.poster + ' stage=' + stage);
        state.x = 2.3; state.z = 1.7; update(0.016); L('near=' + (near && near.label)); near.go(); typeIt(); L('printed: stage=' + stage + ' poster visible=' + posterMesh.visible);
        const nb = HALL_PEOPLE.slice(2); L('before arrivals visible=' + nb.filter((n) => n.m.visible).length); for (let i = 0; i < 60 * 12; i++) update(1 / 60); L('after arrivals visible=' + nb.filter((n) => n.m.visible).length + ' seated=' + nb.filter((n) => !n.dest && n.m.visible).length);
        for (const n of nb) L(n.id + ' lines=' + await talkTo(n) + ' says: ' + (NB[n.id][story.poster]).slice(0, 24)); L('stage=' + stage + ' goal="' + $('goal').textContent + '"');
        L('speech lines=' + await talkTo(byId('garvey')) + ' stage=' + stage + ' goal="' + $('goal').textContent + '" pages=' + unlocked.join(','));
        L(stage === 14 && unlocked.length === 4 && place === 'hall' ? 'ALLDONE' : 'STALL'); L('DONE');
      }
    })();
  }
}
