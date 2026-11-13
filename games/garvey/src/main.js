/* games/garvey/src/main.js: Marcus Garvey. First test scene: a print shop in Kingston, Jamaica, about 1907.
   Built from games/_template. The movement, talking and talk-button code is still the template's small version;
   it moves into engine/ after the Port Royal work has merged (see docs/games/garvey.md, "Working alongside the Port Royal chat").
   The two people and their lines are placeholders for testing the pipeline. Both are made up. */
import * as THREE from 'three';
import { CL, mixers, grounded, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, AU, setG, tone, noiseHit } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';

const $ = (id) => document.getElementById(id);
soundPref('garvey-sound');
onLoadFail((name) => { $('loadnote').textContent = 'Could not load ' + name + '. Please reload the page.'; });

/* ---------- renderer, camera, light ---------- */
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
const maxAniso = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x2a2118);
const camera = new THREE.PerspectiveCamera(68, 1, 0.1, 100);
scene.add(new THREE.HemisphereLight(0xfff4e0, 0x7a6048, 1.25));
const sun = new THREE.DirectionalLight(0xfff0d0, 1.7); sun.position.set(6, 7, 5); scene.add(sun);
const lampLight = new THREE.PointLight(0xffcf8a, 7, 9, 2); lampLight.position.set(0.2, 2.9, -0.3); scene.add(lampLight);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* ---------- textures drawn in code (no image files) ---------- */
function cv(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso;
  if (repeat) t.repeat.set(repeat[0], repeat[1]); return t;
}
function grain(x, w, h, amt) { const d = x.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * amt; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n * 0.8; } x.putImageData(d, 0, 0); }
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

/* ---------- materials and little builders ---------- */
const std = (map, rough = 0.9, extra) => new THREE.MeshStandardMaterial({ map, roughness: rough, ...(extra || {}) });
const solid = (color, rough = 0.85, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const room = new THREE.Group(); scene.add(room);
function mesh(geo, m, x, y, z, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); (parent || room).add(o); return o; }
const box = (w, h, d, m, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, parent);
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

/* ---------- player state and movement ---------- */
const state = { x: -0.5, z: 2.9, yaw: 0, pitch: 0, started: false };   /* yaw 0 looks toward -z, into the shop */
const EYE = 1.55;
const keys = new Set(); let busy = false;   /* busy: a talk is open, so do not move */
let talkWith = null, near = null;
addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); keys.add(k); if (k === 'escape') leaveTalk(); if ((k === 'e' || k === 'enter') && !busy && near) startTalk(near); });
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   /* keep inside the room, out of furniture (slide along it) and out of people */
  x = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, x)); z = Math.max(BOUNDS.z0, Math.min(BOUNDS.z1, z));
  for (const [x0, z0, x1, z1] of WALLS) { if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; } }
  for (const n of PEOPLE) { const d = Math.hypot(x - n.x, z - n.z); if (n.m && d < 0.5) { x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
  return [x, z];
}
const stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, look = { id: null, x: 0, y: 0, moved: 0 };
canvas.addEventListener('pointerdown', (e) => {
  if (busy) { leaveTalk(); return; }   /* tapping the world while talking ends the talk */
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

/* ---------- the two people (both made up; placeholders for testing) ---------- */
const PEOPLE = [
  { id: 'printer', model: 'printer1907', who: 'Printer', label: 'the printer', x: -2.65, z: -2.2, ry: Math.PI, base: 'Idle',
    lines: [
      { who: 'Printer', text: 'Mind the type. Every letter is made of lead.' },
      { who: 'You', text: 'Why are the words all backwards?' },
      { who: 'Printer', text: 'We set type back to front. The press turns it round.' },
      { who: 'You', text: 'So one page can reach many people?' },
      { who: 'Printer', text: 'Yes. That is the power of print.' }],
    later: ['Mind the type!', 'I have work to do. Come back soon.'] },
  { id: 'customer', model: 'woman1914', who: 'Customer', label: 'the customer', x: 1.3, z: 1.6, ry: Math.PI, base: 'Idle',
    path: [[1.3, 1.6], [2.2, 1.55], [1.0, 0.6], [-1.9, 0.7], [-0.5, 1.9]],
    lines: [
      { who: 'Customer', text: 'Good morning! Are my printed notices ready?' },
      { who: 'You', text: 'Nearly. The ink is still wet.' },
      { who: 'Customer', text: 'I will wait. I like to watch the press.' }],
    later: ['I will wait here, thank you.', 'What a busy shop!'] },
];
for (const n of PEOPLE) { n.m = null; n.walking = false; n.wait = 1.5 + Math.random() * 2; n.i = 0; n.heard = 0; n.talked = false; }
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of PEOPLE) if (n.m && ray.intersectObject(n.m, true).length > 0 && Math.hypot(state.x - n.x, state.z - n.z) < 6) return n;
  return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
function npcTick(n, dt) {
  const m = n.m; if (!m) return; const ac = m.userData.anim, d = Math.hypot(state.x - n.x, state.z - n.z), isNear = d < 3.2 || talkWith === n;
  const toPlayer = Math.atan2(state.x - n.x, state.z - n.z);
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

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
function startTalk(n) {
  busy = true; talkWith = n; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true;
  lines = n.talked ? [{ who: n.who, text: n.later[n.heard++ % n.later.length] }] : n.lines; showLine();
}
function showLine() {
  const s = lines[step], me = s.who === 'You'; $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus();
  const ac = talkWith && talkWith.m && talkWith.m.userData.anim; if (ac) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  const n = talkWith; busy = false; talkWith = null; $('dialogue').hidden = true; if (n && n.m) n.m.userData.anim.play(null);
  if (finished && n && !n.talked) { n.talked = true; if (PEOPLE.every((p) => p.talked)) { setGoal('Well done! This test scene is finished. More is coming soon.'); uiSound('goal'); } }
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) startTalk(near); };
function setGoal(t) { $('goal').textContent = t; }

/* ---------- sound: a room hum, the street outside, and now and then the press ---------- */
let auNext = 0, thumpAt = 7;
function pressThump() { if (!AU.on) return; for (let i = 0; i < 3; i++) { noiseHit(220, 1.2, 0.16, 0.1, 0.5, i * 0.55); tone(90, 55, 0.2, 'triangle', 0.04, 0.5, i * 0.55); } }
function audioTick(t) { if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1; setG(AU.ch.room, 0.28); setG(AU.ch.crowd, 0.04); if (t > thumpAt) { thumpAt = t + 6 + Math.random() * 6; pressThump(); } }

/* ---------- loading and starting ---------- */
Promise.all([model('anims'), ...PEOPLE.map((n) => model(n.model))]).then(([anims, ...gl]) => {
  loadClips(anims);
  PEOPLE.forEach((n, i) => { const m = gl[i].scene; m.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; });
    m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; m.userData.ground = 0; scene.add(m); animate(m, n.base); grounded.push(m); n.m = m; });
  $('start').disabled = false; $('start').textContent = 'Start'; $('loadnote').textContent = '';
  if (__DEV__) devViews();
});
function begin() { audioInit(); $('title').hidden = true; $('hud').hidden = false; state.started = true; setGoal('Talk to the printer and the customer.'); $('place').hidden = false; $('place').style.opacity = 1; setTimeout(() => { $('place').style.opacity = 0; }, 4500); canvas.focus(); }
$('start').onclick = begin;
$('sound').onclick = () => { setSound(!AU.on); $('sound').textContent = AU.on ? 'Sound on' : 'Sound off'; };

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
  near = null; if (state.started && !busy) { let best = 2.6; for (const n of PEOPLE) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && d < best) { best = d; near = n; } } }
  $('talk').hidden = !near; if (near) $('talk').textContent = 'Talk to ' + near.label;
  for (const mx of mixers) mx.update(dt); for (const n of PEOPLE) if (n.m && n.m.userData.anim) n.m.userData.anim.tick(dt);
  for (const m of grounded) groundFeet(m);
  if (now !== undefined) audioTick(now / 1000);
}
let last = performance.now(), stepT = 0;
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - last) / 1000); last = t; update(dt, t);
  camera.position.set(state.x, EYE, state.z); camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);

/* ---------- test views and a scripted playthrough: dev builds only (node tools/build.mjs garvey --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search); const shot = q.get('shot');
  const go = (x, z, yaw, pitch) => { $('title').hidden = true; $('hud').hidden = false; state.started = true; state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; setGoal('Talk to the printer and the customer.'); };
  const VIEWS = { shop1: [-0.5, 2.9, 0, 0], shop2: [0.6, 0.4, -0.75, -0.08], shop3: [-2.0, -0.2, 0.3, 0.05], shop4: [-0.5, 0.6, Math.PI, -0.02], shop5: [0.9, 1.8, 0.35, -0.1], shop6: [3.9, 3.0, 0.6, 0], shop7: [-3.7, 1.8, 0.7, 0.1] };
  if (shot && VIEWS[shot]) go(...VIEWS[shot]);
  if (shot === 'talk') { go(-2.0, -0.3, 0.3, 0.05); startTalk(PEOPLE[0]); }
  if (q.has('test') && q.get('test') === 'walk') {   /* step the world by hand and watch the customer walk her route */
    const c = PEOPLE[1]; go(4.0, -1.2, 0, 0); const trail = []; let dist = 0, px = c.x, pz = c.z, minx = 9, maxx = -9, minz = 9, maxz = -9, walked = 0;
    for (let i = 0; i < 60 * 40; i++) { update(1 / 60); if (c.walking) walked++; dist += Math.hypot(c.x - px, c.z - pz); px = c.x; pz = c.z; minx = Math.min(minx, c.x); maxx = Math.max(maxx, c.x); minz = Math.min(minz, c.z); maxz = Math.max(maxz, c.z); if (i % 300 === 0) trail.push(c.x.toFixed(1) + ',' + c.z.toFixed(1)); }
    document.title = 'WALK dist=' + dist.toFixed(1) + ' walkingFrames=' + walked + ' x=' + minx.toFixed(1) + '..' + maxx.toFixed(1) + ' z=' + minz.toFixed(1) + '..' + maxz.toFixed(1) + ' leg=' + c.i + ' trail=' + trail.join(' '); }
  if (q.has('auto')) {   /* the autoplayer: start, talk to everyone by clicking Next, check the goal, report problems */
    const log = []; const L = (m) => { log.push(m); document.title = log.join(' | '); };
    addEventListener('error', (e) => L('ERROR ' + e.message));
    L('place=shop'); $('start').click(); L('started=' + state.started + ' goal="' + $('goal').textContent + '"');
    let k = 0; const next = () => { const n = PEOPLE[k]; if (!n) { setTimeout(() => { L('GOAL "' + $('goal').textContent + '"'); L(PEOPLE.every((p) => p.talked) ? 'ALLTALKED' : 'STALL'); L('DONE'); }, 300); return; }
      state.x = n.x + 1.1; state.z = n.z + 0.4; update(0.016); L('near=' + (near && near.id)); startTalk(n); let c = 0; const iv = setInterval(() => { if ($('dialogue').hidden) { clearInterval(iv); L(n.id + ' talked=' + n.talked + ' lines=' + c); k++; setTimeout(next, 100); } else { c++; $('next').click(); } }, 80); };
    setTimeout(next, 200); }
}
