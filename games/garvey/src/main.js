/* games/garvey/src/main.js: Marcus Garvey. First test scene: a print shop in Kingston, Jamaica, about 1907.
   Built from games/_template. The movement, talking and talk-button code is still the template's small version;
   it moves into engine/ after the Port Royal work has merged (see docs/games/garvey.md, "Working alongside the Port Royal chat").
   The two people and their lines are placeholders for testing the pipeline. Both are made up. */
import * as THREE from 'three';
import { CL, mixers, grounded, loadClips, animate, groundFeet } from '../../../engine/anim.js';
import { soundPref, setSound, audioInit, stepSound, uiSound, cue, AU, setG, tone, noiseHit } from '../../../engine/audio.js';
import { model, onLoadFail } from '../../../engine/loader.js';

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

/* ---------- state, movement and controls (the same controls as Port Royal) ---------- */
const state = { x: -0.5, z: 2.9, yaw: 0, pitch: 0, started: false };   /* yaw 0 looks toward -z, into the shop */
const START = { x: -0.5, z: 2.9, yaw: 0 };
const EYE = 1.55, isTouch = matchMedia('(pointer: coarse)').matches;
const keys = new Set(); let busy = false, fading = false;   /* busy: a talk, the journal or another panel is open, so do not move */
let talkWith = null, near = null;
const panelsOpen = () => ['dialogue', 'typeset', 'journal', 'chapters', 'credits', 'card'].some((id) => !$(id).hidden);   /* closing one panel must not unpause the world while another is open */
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && state.started) e.preventDefault();
  keys.add(k); if (!state.started) return;
  if (k === 'escape') { if (!$('dialogue').hidden) { leaveTalk(); return; } closeJournal(); closeChapters(); closeCredits(); closeType(false); if (!$('card').hidden) hideCard(); }
  if ((k === 'e' || k === 'enter') && !busy && near) activate(near);
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
function clampPos(x, z) {   /* keep inside the room, out of furniture (slide along it) and out of people */
  x = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, x)); z = Math.max(BOUNDS.z0, Math.min(BOUNDS.z1, z));
  for (const [x0, z0, x1, z1] of WALLS) { if (x > x0 && x < x1 && z > z0 && z < z1) { const dl = x - x0, dr = x1 - x, dt = z - z0, db = z1 - z, m = Math.min(dl, dr, dt, db); if (m === dl) x = x0; else if (m === dr) x = x1; else if (m === dt) z = z0; else z = z1; } }
  for (const n of PEOPLE) { const d = Math.hypot(x - n.x, z - n.z); if (n.m && d < 0.5) { x = n.x + (x - n.x) / (d || 1) * 0.5; z = n.z + (z - n.z) / (d || 1) * 0.5; } }
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
const PEOPLE = [
  { id: 'printer', model: 'printer1907', who: 'Printer', label: 'Talk to the printer', x: -2.65, z: -2.2, ry: Math.PI, base: 'Idle',
    lines: [
      { who: 'Printer', text: 'Mind the type. Every letter is made of metal.' },
      { who: 'You', text: 'Why are the words all backwards?' },
      { who: 'Printer', text: 'We set type back to front. The press turns it round.' },
      { who: 'You', text: 'So one page can reach many people?' },
      { who: 'Printer', text: 'Yes. That is the power of print.' },
      { who: 'Printer', text: 'Marcus Garvey learned this trade, too.', unlock: 'garvey-printer' }],
    later: ['Mind the type!', 'I have work to do. Come back soon.'] },
  { id: 'customer', model: 'woman1914', who: 'Customer', label: 'Talk to the customer', x: 1.3, z: 1.6, ry: Math.PI, base: 'Idle',
    path: [[1.3, 1.6], [2.2, 1.55], [1.0, 0.6], [-1.9, 0.7], [-0.5, 1.9]],
    lines: [
      { who: 'Customer', text: 'Good morning! Are my printed notices ready?' },
      { who: 'You', text: 'Nearly. The ink is still wet.' },
      { who: 'Customer', text: 'I will wait. I like to watch the press.' }],
    later: ['I will wait here, thank you.', 'What a busy shop!'] },
];
for (const n of PEOPLE) { n.m = null; n.walking = false; n.wait = 1.5 + Math.random() * 2; n.i = 0; n.heard = 0; n.talked = false; n.hx = n.x; n.hz = n.z; }
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

/* ---------- the menu link: shown only where the real game menu exists (the website), as in Port Royal ---------- */
const MENU = { ok: false, url: '../../../menu/' };
{ const links = ['allgames', 'jhome'].map((id) => document.getElementById(id)).filter(Boolean); for (const a of links) a.hidden = true;
  fetch(MENU.url, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')).then((t) => { if (/History Games/.test(t)) { MENU.ok = true; for (const a of links) a.hidden = false; } }).catch(() => {}); }
function toMenu() { saveGame(); location.href = MENU.url; }

/* ---------- the journal ---------- */
const JOURNAL = [
  { id: 'you', title: 'You in this game', simple: ['You are made up.', 'You are a young helper in a print shop in Kingston, Jamaica.', 'The printer and the customer are made up too.'],
    deeper: ['The big events in this game really happened. Made-up people help us tell them.', 'Your choices will change what you see and who you meet. They will not change what really happened.'] },
  { id: 'garvey-printer', title: 'Marcus Garvey, printer', simple: ['Marcus Garvey was born in St Ann\'s Bay, Jamaica, in 1887.', 'He learned the printing trade as a young man.', 'Later he worked as a printer in Kingston.'],
    deeper: ['He became a foreman, a leader of the workers, at a Kingston printing firm.', 'He took part in a printers\' strike there. Sources give the year as 1907 or 1908.', 'Some sources say he could not get work at other firms afterwards, and later worked at the Government Printing Office.', 'We will check these dates against the Marcus Garvey and UNIA Papers.'] },
  { id: 'press', title: 'How a press works', simple: ['Printers set type: small metal letters.', 'Each metal letter is a mirror image.', 'The press inks the letters and presses paper onto them.', 'The words print the right way round.'],
    deeper: ['A page of type locked in an iron frame is called a forme.', 'Printers locked up formes on a flat table called an imposing stone.', 'Some small presses were worked with a foot treadle.'] },
];
const unlocked = []; let toastTimer = 0;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600); }
function showCount() { $('jcount').textContent = unlocked.length; $('jcount').hidden = !unlocked.length; }
function unlock(id, quiet) { if (unlocked.includes(id)) return; unlocked.push(id); showCount(); saveGame(); if (!quiet) { uiSound('page'); toast('Journal: ' + JOURNAL.find((p) => p.id === id).title); } }
function renderJournal(sel) {
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
let stage = 0;   /* 0: talk to both people, 1: set the type, 2: finished */
const GOALS = ['Talk to the printer and the customer.', 'Set the type for a notice. Go to the type stand.', 'Well done! This test scene is finished. More is coming soon.'];
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
const SAVE_KEY = 'garvey-save-v1'; let hasSave = false, erasing = false;   /* erasing: the reload that follows "Start again" must not save the old progress back */
function saveGame() { if (erasing) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, stage, talked: PEOPLE.filter((p) => p.talked).map((p) => p.id) })); } catch (e) { /* storage may be blocked; the game still plays */ } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function applySave(d) {
  if (!d || !Array.isArray(d.unlocked)) return;
  for (const id of d.unlocked) if (JOURNAL.some((p) => p.id === id) && !unlocked.includes(id)) unlocked.push(id);
  stage = [0, 1, 2].includes(d.stage) ? d.stage : 0; for (const p of PEOPLE) p.talked = Array.isArray(d.talked) && d.talked.includes(p.id);
  hasSave = unlocked.length > 1 || stage > 0 || PEOPLE.some((p) => p.talked);
}
applySave(loadGame());
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
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); state.x = START.x; state.z = START.z; state.yaw = START.yaw; state.pitch = 0; stage = 0;
  for (const n of PEOPLE) { n.talked = false; n.heard = 0; n.i = 0; n.walking = false; n.wait = 1.5; n.x = n.hx; n.z = n.hz; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
  saveGame(); setGoal();
}

/* ---------- chapters (only the first is built so far) ---------- */
const CHAPTERS = [
  { year: 'About 1907', name: 'The print shop', ready: true, go: () => chapterFade('About 1907', 'A print shop in Kingston', resetChapter), done: () => stage === 2 },
  { year: '1914', name: 'The first followers' }, { year: '1916', name: 'The streets of Harlem' }, { year: '1918 to 1919', name: 'The power of the press' },
  { year: '1919', name: 'The Black Star Line' }, { year: 'August 1920', name: 'A movement becomes a nation' }, { year: '1922 to 1927', name: 'The price of a dream' }, { year: '1927 to today', name: 'The dream lives on' },
];
function renderChapters() {
  const ul = $('chlist'); ul.replaceChildren();
  CHAPTERS.forEach((c, i) => { const open = !!c.ready && (i === 0 || CHAPTERS[i - 1].done()), dn = c.done ? c.done() : false, li = document.createElement('li'), b = document.createElement('button');
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
    { t: 'Restart “The print shop”', go: () => { hideCard(); CHAPTERS[0].go(); } },
    { t: 'Start the whole story again', go: () => card('Start again?', ['This wipes everything, even your journal.'], [{ t: 'Yes, start again', go: eraseAll }, { t: 'No, keep playing', go: hideCard }]) },
    { t: 'Cancel', go: hideCard }, ...(MENU.ok ? [{ t: 'All games', go: toMenu }] : [])]); };

/* ---------- talking: one line at a time; "You" lines get their own colour; the x, Escape or a tap outside ends it ---------- */
let step = 0, lines = [], talkN = 0; const TALKS = ['Talk1', 'Talk2', 'Talk3'];
function activate(t) { if (t.go) t.go(); else startTalk(t); }
function startTalk(n) {
  busy = true; talkWith = n; keys.clear(); step = 0; uiSound('tap'); $('dialogue').hidden = false; $('talk').hidden = true; $('hint').hidden = true;
  lines = n.talked ? [{ who: n.who, text: n.later[n.heard++ % n.later.length] }] : n.lines; showLine();
}
function showLine() {
  const s = lines[step], me = s.who === 'You'; if (s.unlock) unlock(s.unlock); $('who').textContent = s.who; $('line').textContent = s.text; $('dialogue').classList.toggle('me', me); $('next').focus();
  const ac = talkWith && talkWith.m && talkWith.m.userData.anim; if (ac) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  const n = talkWith; talkWith = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.m) n.m.userData.anim.play(null);
  if (finished && n && !n.talked) { n.talked = true; if (PEOPLE.every((p) => p.talked)) { stage = 1; setGoal(); } saveGame(); }
}
function leaveTalk() { if (!$('dialogue').hidden) endTalk(false); }
$('next').onclick = nextLine; $('dclose').onclick = leaveTalk; $('talk').onclick = () => { if (near && !busy) activate(near); };

/* ---------- things to do: the type-setting activity (like Port Royal's ACTIONS, shown as a button when you stand at it) ---------- */
const ACTIONS = [{ id: 'type', label: 'Set some type', x: -1.9, z: -2.3, r: 0.95, on: () => stage === 1, go: () => openType() }];
const WORD = 'NOTICE'; let typed = '';   /* real type is a mirror image of what prints, so the letters here are backwards too */
function openType() {
  if (busy) return; busy = true; keys.clear(); typed = ''; $('typeset').hidden = false; $('tword').textContent = WORD; $('tprint').hidden = true; $('tpress').hidden = true; $('tdone').hidden = true;
  $('tcase').hidden = false; $('tstick').innerHTML = ''; for (let i = 0; i < WORD.length; i++) { const sl = document.createElement('span'); sl.className = 'slot'; $('tstick').appendChild(sl); }
  const letters = WORD.split('').concat('ARSLDM'.split('')); for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; }
  $('tcase').innerHTML = ''; for (const L of letters) { const b = document.createElement('button'); b.className = 'tile'; b.dataset.l = L; b.setAttribute('aria-label', 'Letter ' + L); b.innerHTML = '<span class="mir">' + L + '</span>'; b.onclick = () => tapTile(b, L); $('tcase').appendChild(b); }
  $('tmsg').textContent = 'Tap the letters in order. They are backwards, like real type.';
}
function tapTile(b, L) {
  if (typed.length >= WORD.length || b.disabled) return;
  if (L === WORD[typed.length]) { b.disabled = true; $('tstick').children[typed.length].innerHTML = '<span class="mir">' + L + '</span>'; typed += L; uiSound('tap');
    if (typed.length === WORD.length) { $('tmsg').textContent = 'The type is set. Now press!'; $('tpress').hidden = false; $('tpress').focus(); } else $('tmsg').textContent = 'Good. Next letter: ' + WORD[typed.length] + '.'; }
  else { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('tmsg').textContent = 'Not that one. Look at the word again.'; }
}
$('tpress').onclick = () => { pressThump(); $('tprint').textContent = WORD; $('tprint').hidden = false; $('tcase').hidden = true; $('tpress').hidden = true; $('tdone').hidden = false; $('tmsg').textContent = 'Printed! The words come out the right way round.'; };
function closeType(done) { if ($('typeset').hidden) return; $('typeset').hidden = true; busy = panelsOpen(); if (done) finishType(); }
$('tclose').onclick = () => closeType(false); $('tdone').onclick = () => closeType(true);
function finishType() { stage = 2; unlock('press'); saveGame(); setGoal(); uiSound('goal'); }

/* ---------- a glowing speech mark over each person, a bubble on the nearest, and the Talk button for things to do ---------- */
const BUBBLE = cv(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.fillStyle = '#f6c45c'; c.strokeStyle = 'rgba(70,45,10,0.85)'; c.lineWidth = 3; c.beginPath(); c.arc(64, 64, 15, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#fff3d0'; c.beginPath(); c.arc(59, 59, 5, 0, Math.PI * 2); c.fill(); });
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
for (const n of PEOPLE) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
function bubbleTick(now) {
  const show = state.started && !busy && $('card').hidden;
  for (const n of PEOPLE) { const m = n.mark; if (!show || !n.m) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, 2.15 + Math.sin(now * 2.4 + n.x) * 0.06, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, 2.0, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
  if (TB.el.dataset.label !== near.label) { TB.el.dataset.label = near.label; TB.el.innerHTML = TALK_SVG + '<span class="who">' + near.who + '</span>'; TB.el.setAttribute('aria-label', near.label); }
}

/* ---------- the helper arrow (as in Port Royal): stand still or stall for a while and the goal pops open and a gold arrow shows the way ---------- */
const NUDGE = { goal: '', since: 0, still: 0, lx: 0, lz: 0, on: false }, _nv = new THREE.Vector3();
function nudgeTarget() {   /* where the next thing to do is, as [x, z]; add a case for every new goal */
  if (stage === 0) { let best = null, bd = 1e9; for (const n of PEOPLE) if (!n.talked && n.m) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (d < bd) { bd = d; best = [n.x, n.z]; } } return best; }
  const a = ACTIONS.find((x) => x.on()); return a ? [a.x, a.z] : null;
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

/* ---------- sound: a room hum, the street outside, and now and then the press ---------- */
let auNext = 0, thumpAt = 7;
function pressThump() { if (!AU.ctx || !AU.on) return; for (let i = 0; i < 3; i++) { noiseHit(220, 1.2, 0.16, 0.1, 0.5, i * 0.55); tone(90, 55, 0.2, 'triangle', 0.04, 0.5, i * 0.55); } }
function audioTick(t) { if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1; setG(AU.ch.room, 0.28); setG(AU.ch.crowd, 0.04); if (t > thumpAt) { thumpAt = t + 6 + Math.random() * 6; pressThump(); } }

/* ---------- loading and starting ---------- */
let modelsReady = false;
{ let done = 0; const total = 1 + PEOPLE.length, tick = (x) => { done++; $('bar').style.width = (done / total * 100) + '%'; return x; };
  Promise.all([model('anims').then(tick), ...PEOPLE.map((n) => model(n.model).then(tick))]).then(([anims, ...gl]) => {
    loadClips(anims);
    PEOPLE.forEach((n, i) => { const m = gl[i].scene; m.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; });
      m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; m.userData.ground = 0; scene.add(m); animate(m, n.base); grounded.push(m); n.m = m; });
    modelsReady = true; $('start').disabled = false; $('start').textContent = hasSave ? 'Continue' : 'Start'; $('tchap').hidden = false; $('loadnote').textContent = ''; $('savenote').hidden = !hasSave;
    if (__DEV__) devViews();
  }); }
function startGame() {
  audioInit(); state.started = true; $('title').hidden = true; $('hud').hidden = false; unlock('you', true); showCount(); setGoal();
  $('hint').textContent = isTouch ? 'Left thumb walks. Drag to look. Tap a person to talk.' : 'W A S D to walk, Shift to hurry. Drag to look. E to use.'; showHint();
  $('place').hidden = false; $('place').style.opacity = 1; setTimeout(() => { $('place').style.opacity = 0; }, 4500); canvas.focus();
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
  near = null; if (state.started && !busy) { let best = 2.6; for (const n of PEOPLE) { const d = Math.hypot(state.x - n.x, state.z - n.z); if (n.m && d < best) { best = d; near = n; } }
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

/* ---------- test views and a scripted playthrough: dev builds only (node tools/build.mjs garvey --dev) ---------- */
function devViews() {
  const q = new URLSearchParams(location.search); const shot = q.get('shot');
  const go = (x, z, yaw, pitch) => { $('title').hidden = true; $('hud').hidden = false; state.started = true; state.x = x; state.z = z; state.yaw = yaw; state.pitch = pitch || 0; unlock('you', true); showCount(); setGoal(); };
  const VIEWS = { shop1: [-0.5, 2.9, 0, 0], shop2: [0.6, 0.4, -0.75, -0.08], shop3: [-2.0, -0.2, 0.3, 0.05], shop4: [-0.5, 0.6, Math.PI, -0.02], shop5: [0.9, 1.8, 0.35, -0.1], shop6: [3.9, 3.0, 0.6, 0], shop7: [-3.7, 1.8, 0.7, 0.1] };
  if (shot && VIEWS[shot]) go(...VIEWS[shot]);
  if (shot === 'talk') { go(-2.0, -0.3, 0.3, 0.05); startTalk(PEOPLE[0]); }
  if (shot === 'type') { go(-1.9, -1.7, 0, -0.1); stage = 1; openType(); for (const ch of WORD.slice(0, 3)) $('tcase').querySelector('[data-l="' + ch + '"]').click(); }
  if (shot === 'typedone') { go(-1.9, -1.7, 0, -0.1); stage = 1; openType(); for (const ch of WORD) $('tcase').querySelector('[data-l="' + ch + '"]').click(); $('tpress').click(); }
  if (shot === 'journal') { go(-1.9, -1.7, 0, -0.1); unlock('garvey-printer', true); unlock('press', true); openJournal('garvey-printer'); }
  if (shot === 'chapters') { go(-0.5, 2.9, 0, 0); openChapters(); }
  if (shot === 'reset') { go(-0.5, 2.9, 0, 0); setTimeout(() => $('reset').click(), 600); }
  if (shot === 'credits') { go(-0.5, 2.9, 0, 0); openCredits(); }
  if (shot === 'bubble') { go(-2.3, -0.8, 0.25, 0.08); }
  if (shot === 'nudge') { go(-0.5, 2.9, Math.PI / 2, 0); NUDGE.still = performance.now() - 20000; }
  if (q.has('test') && q.get('test') === 'walk') {   /* step the world by hand and watch the customer walk her route */
    const c = PEOPLE[1]; go(4.0, -1.2, 0, 0); const trail = []; let dist = 0, px = c.x, pz = c.z, minx = 9, maxx = -9, minz = 9, maxz = -9, walked = 0;
    for (let i = 0; i < 60 * 40; i++) { update(1 / 60); if (c.walking) walked++; dist += Math.hypot(c.x - px, c.z - pz); px = c.x; pz = c.z; minx = Math.min(minx, c.x); maxx = Math.max(maxx, c.x); minz = Math.min(minz, c.z); maxz = Math.max(maxz, c.z); if (i % 300 === 0) trail.push(c.x.toFixed(1) + ',' + c.z.toFixed(1)); }
    document.title = 'WALK dist=' + dist.toFixed(1) + ' walkingFrames=' + walked + ' x=' + minx.toFixed(1) + '..' + maxx.toFixed(1) + ' z=' + minz.toFixed(1) + '..' + maxz.toFixed(1) + ' leg=' + c.i + ' trail=' + trail.join(' '); }
  if (q.has('auto')) {   /* the autoplayer: start, talk to everyone, set the type, open each menu, check the way out, report problems */
    const log = []; const L = (m) => { log.push(m); document.title = log.join(' | '); };
    addEventListener('error', (e) => L('ERROR ' + e.message));
    L('place=shop title: allgames=' + (!$('allgames').hidden) + ' chapters=' + (!$('tchap').hidden) + ' savenote=' + (!$('savenote').hidden)); $('start').click(); L('started=' + state.started + ' goal="' + $('goal').textContent + '"');
    let k = 0; const next = () => { const n = PEOPLE[k]; if (!n) { setTimeout(() => { L('stage=' + stage + ' goal="' + $('goal').textContent + '"');
        state.x = -1.9; state.z = -1.7; update(0.016); L('near=' + (near && near.label)); if (near && near.go) near.go();
        for (const ch of WORD) { const t = $('tcase').querySelector('[data-l="' + ch + '"]'); if (t) t.click(); } L('typed=' + typed);
        $('tpress').click(); $('tdone').click(); L('stage=' + stage + ' pages=' + unlocked.join(','));
        $('jbtn').click(); L('journal open=' + !$('journal').hidden + ' tabs=' + $('jtabs').children.length + ' jcount=' + $('jcount').textContent + ' allgames=' + (!$('jhome').hidden)); $('jchap').click();
        L('chapters open=' + !$('chapters').hidden + ' items=' + $('chlist').children.length + ' playable=' + $('chlist').querySelectorAll('button:not(:disabled)').length); $('chclose').click();
        { const t = performance.now(); NUDGE.still = t - 20000; nudgeTick(t); L('helper arrow shown=' + (!$('nudge').hidden) + ' label=' + $('nudge').querySelector('span').textContent); NUDGE.on = false; $('nudge').hidden = true; }
        $('reset').click(); L('reset card="' + $('ctitle').textContent + '" buttons=' + [...$('cbtns').children].map((b) => b.textContent).join('/')); $('cbtns').children[0].click();
        L('reset while talking: ' + (() => { startTalk(PEOPLE[0]); $('reset').click(); hideCard(); const ok = busy && !$('dialogue').hidden; endTalk(false); return ok ? 'still paused' : 'UNPAUSED'; })());
        L('after restart: stage=' + stage + ' pages=' + unlocked.length + ' talked=' + PEOPLE.filter((p) => p.talked).length + ' busy=' + busy);
        L(stage === 0 && unlocked.length === 3 && !busy ? 'ALLDONE' : 'STALL'); L('DONE'); }, 300); return; }
      state.x = n.x + 1.1; state.z = n.z + 0.4; update(0.016); L('near=' + (near && near.id)); startTalk(n); let c = 0; const iv = setInterval(() => { if ($('dialogue').hidden) { clearInterval(iv); L(n.id + ' talked=' + n.talked + ' lines=' + c); k++; setTimeout(next, 100); } else { c++; $('next').click(); } }, 80); };
    setTimeout(next, 200); }
}
