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
const hemi = new THREE.HemisphereLight(0xfff4e0, 0x7a6048, 1.25); scene.add(hemi);
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
let talkWith = null, near = null, DEV_NOSTOP = false, curWalls = WALLS, curBounds = BOUNDS;   /* DEV_NOSTOP: test views only, so a walker keeps walking while the camera is close */
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
const allPeople = () => [...SHOP_PEOPLE, ...HALL_PEOPLE, ...STREET_PEOPLE];
const byId = (id) => allPeople().find((n) => n.id === id);
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tapPerson(cx, cy) {
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  for (const n of PEOPLE) if (n.m && ray.intersectObject(n.m, true).length > 0 && Math.hypot(state.x - n.x, state.z - n.z) < 6) return n;
  return null;
}
const faceTo = (m, want, dt, k = 5) => { let e = want - m.rotation.y; e = Math.atan2(Math.sin(e), Math.cos(e)); m.rotation.y += e * Math.min(1, dt * k); };
function npcTick(n, dt) {
  const m = n.m; if (!m) return; const ac = m.userData.anim, d = Math.hypot(state.x - n.x, state.z - n.z), isNear = (d < 3.2 && !DEV_NOSTOP) || talkWith === n;
  if (n.delay > 0) { n.delay -= dt; if (n.delay <= 0) { n.hidden = false; m.visible = place === 'hall'; n.walking = true; ac.play('Walk'); } return; }
  if (n.dest && talkWith !== n) { const dx = n.dest[0] - n.x, dz = n.dest[1] - n.z, dist = Math.hypot(dx, dz), sp = 1.25 * dt; faceTo(m, Math.atan2(dx, dz), dt);
    if (dist <= sp) { n.x = n.dest[0]; n.z = n.dest[1]; n.dest = null; n.walking = false; n.ry = Math.PI; ac.play(null); } else { n.x += dx / dist * sp; n.z += dz / dist * sp; } m.position.set(n.x, 0, n.z); return; }
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
  { id: 'garvey-printer', title: 'Marcus Garvey, printer', simple: ['Marcus Garvey was born in St Ann\'s Bay, Jamaica, in 1887.', 'As a boy he learned printing from his godfather.', 'Later he worked as a printer in Kingston.'],
    deeper: ['He moved to Kingston in about 1905 or 1906 and worked for a large printing firm. He became a foreman, a leader of the workers.', 'He was also an officer of the printers\' union: the vice-president of its compositors\' section.', 'Most of this comes from books and articles about him. We still need to check it against the Marcus Garvey and UNIA Papers.'] },
  { id: 'strike', title: 'The printers\' strike', simple: ['A union is a group of workers who stand up for each other.', 'In about 1908 the printers in Kingston went on strike. That means they stopped work together.', 'They wanted better working conditions.', 'The strike did not win. Marcus Garvey lost his job.'],
    deeper: ['Most sources date the strike to late 1908. Some older ones say 1907.', 'The strike was broken after some weeks, and the union ended.', 'Private printing firms would not hire Garvey afterwards. For a short time he worked at the government printery.', 'Your choice in this game does not change what really happened.'] },
  { id: 'press', title: 'How a press works', simple: ['Printers set type: small metal letters.', 'Each metal letter is a mirror image.', 'The press inks the letters and presses paper onto them.', 'The words print the right way round.'],
    deeper: ['A page of type locked in an iron frame is called a forme.', 'Printers locked up formes on a flat table called an imposing stone.', 'Small jobbing presses were worked by a foot treadle, a hand lever, or a belt from an engine.'] },
  { id: 'garvey-home', title: 'Marcus Garvey comes home', simple: ['Marcus Garvey travelled to other countries as a young man.', 'He lived in London for about two years.', 'He came back to Jamaica in July 1914.'],
    deeper: ['In Costa Rica he worked for a fruit company and wrote about the hard conditions of the workers.', 'In London he studied, and worked for a newspaper called the African Times and Orient Review.', 'Sources give different years for his travels in Central America, between 1909 and 1911.'] },
  { id: 'amy', title: 'Amy Ashwood', simple: ['Amy Ashwood was one of the first members of the UNIA.', 'She worked with Marcus Garvey in the early years.', 'She later led its women\'s division.'],
    deeper: ['She was an early secretary of the UNIA.', 'Some writers call her a co-founder. The historian Tony Martin thought that was too strong. Records show she was an organiser and a secretary.', 'We still need to check this against the Marcus Garvey and UNIA Papers.'] },
  { id: 'harlem', title: 'Harlem in 1916', simple: ['Harlem is a part of New York City.', 'Many Black families came to Harlem from the southern United States and from Caribbean islands such as Jamaica.', 'Street corners were places where people gave speeches and listened.', 'The worker, the woman and the older man in this game are made up.'],
    deeper: ['Harlem\'s Black population grew from about 29,000 in 1910 to about 84,000 in 1920. This comes from one source, which we still need to check.', 'Many kinds of speakers used the corners, including socialists such as A. Philip Randolph. Some middle-class Black New Yorkers did not like street speaking.', 'The words spoken at the corner in this game are made up, including the words of Marcus Garvey. They are not his real words.'] },
  { id: 'garvey-arrives', title: 'Garvey arrives in New York', simple: ['Marcus Garvey sailed from Jamaica in March 1916.', 'He reached New York later that month.', 'He gave speeches in Harlem and began to find friends there.'],
    deeper: ['His ship was the SS Tallac. Sources give the day he arrived as 23 or 24 March.', 'He worked as a printer after he arrived.', 'Garvey is said to have first spoken at the corner of 135th Street and Lenox Avenue. This comes from one source.'] },
  { id: 'unia-ny', title: 'The UNIA in New York', simple: ['In 1917 Garvey started a New York branch of the UNIA.', 'It grew quickly in Harlem.'],
    deeper: ['Sources give the first members as 13 or 17.', 'Liberty Hall in Harlem, a large meeting hall, opened in 1919.'] },
  { id: 'unia', title: 'The UNIA begins', simple: ['UNIA stands for Universal Negro Improvement Association.', 'It was founded in Kingston, Jamaica, in July 1914.', 'It wanted to help people in need, build pride, and open a trade school.'],
    deeper: ['Many sources give the first meeting as 20 July 1914. Others point to 1 August, Emancipation Day. Where it met is also uncertain.', 'In 1914 Garvey wrote to Booker T. Washington about a trade school like Tuskegee. Washington died in 1915.', 'Garvey sailed for the United States in March 1916.'] },
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
let stage = 0, best = 0;   /* the story is a number. Chapter 1: 0 talk, 1 set the type, 2 (reserved), 3 done. Chapter 2: 10 meet, 11 print the poster, 12 welcome the neighbours, 13 listen, 14 done. best: the furthest stage ever reached */
const GOALS = { 0: 'Talk to the printer and the customer.', 1: 'Set the type for a notice. Go to the type stand.', 2: 'Talk to the printer. He has news.', 3: 'Well done! The print shop chapter is finished. Open Chapters for the next one.',
  20: 'Listen to the three people at the corner.', 21: 'Talk to Marcus Garvey.', 22: 'The older man has a question. Talk to him.', 23: 'Well done! Chapter 3 is finished. More is coming soon.',
  10: 'Talk to Amy Ashwood and Marcus Garvey.', 11: 'Print the poster at the press table.', 12: 'Welcome the three neighbours as they arrive.', 13: 'Listen to Marcus Garvey.', 14: 'Well done! Chapter 2 is finished. More is coming soon.' };
const TALK_TARGETS = { 20: ['worker', 'woman', 'critic'], 21: ['garvey3'], 22: ['critic'], 0: ['printer', 'customer'], 2: ['printer'], 10: ['amy', 'garvey'], 12: ['elder', 'seller', 'youth'], 13: ['garvey'] };   /* who you must talk to at each stage */
const NEXT_AFTER_TALK = { 20: 21, 21: 22, 22: 23, 0: 1, 2: 3, 10: 11, 12: 13, 13: 14 };
const wantsTalk = (n) => !n.talked && (TALK_TARGETS[stage] || []).includes(n.id);
function setStage(s) { stage = s; best = Math.max(best, s); for (const n of allPeople()) n.talked = false; saveGame(); setGoal(); if (s === 12) startArrivals(); }
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
  hasSave = unlocked.length > 1 || stage > 0 || best > 0;
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
const CHAPTERS = [
  { year: 'About 1908', name: 'The print shop', ready: true, go: () => chapterFade('About 1908', 'A print shop in Kingston', resetChapter), done: () => best >= 3 },
  { year: 'July 1914', name: 'The first followers', ready: true, go: () => { toast('Loading the hall'); ensureHall().then(() => chapterFade('1914', 'A meeting hall in Kingston', resetChapter2)); }, done: () => best >= 14 }, { year: '1916', name: 'The streets of Harlem', ready: true, go: () => { toast('Loading Harlem'); ensureStreet().then(() => chapterFade('1916', 'Harlem, New York', resetChapter3)); }, done: () => best >= 23 }, { year: '1918 to 1919', name: 'The power of the press' },
  { year: '1919', name: 'The Black Star Line' }, { year: 'August 1920', name: 'A movement becomes a nation' }, { year: '1922 to 1927', name: 'The price of a dream' }, { year: '1927 to today', name: 'The dream lives on' },
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
    { t: 'Restart “' + CHAPTERS[stage >= 20 ? 2 : stage >= 10 ? 1 : 0].name + '”', go: () => { hideCard(); CHAPTERS[stage >= 20 ? 2 : stage >= 10 ? 1 : 0].go(); } },
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
  const ac = talkWith && talkWith.m && talkWith.m.userData.anim; if (ac) { if (me) ac.play(null); else if (CL.Talk1) ac.play(TALKS[talkN++ % 3]); }
}
function choose(s, c) {   /* a choice: remember it, add the lines that answer it, and go on */
  uiSound('tap'); if (c.set) Object.assign(story, c.set); saveGame(); lines.splice(step + 1, 0, ...(c.then || []));
  step++; if (step >= lines.length) endTalk(true); else showLine();
}
function nextLine() { uiSound('tap'); step++; if (step >= lines.length) { endTalk(true); return; } showLine(); }
function endTalk(finished) {
  const n = talkWith; talkWith = null; $('dialogue').hidden = true; busy = panelsOpen(); if (n && n.m) n.m.userData.anim.play(null);
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
function closeType(done) { if ($('typeset').hidden) return; $('typeset').hidden = true; busy = panelsOpen(); if (done && typeDone) { const f = typeDone; typeDone = null; f(); } }
$('tclose').onclick = () => closeType(false); $('tdone').onclick = () => closeType(true);

/* ---------- a glowing speech mark over each person, a bubble on the nearest, and the Talk button for things to do ---------- */
const BUBBLE = cv(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 8, 64, 64, 62); g.addColorStop(0, 'rgba(255,190,70,0.9)'); g.addColorStop(0.35, 'rgba(255,180,60,0.45)'); g.addColorStop(1, 'rgba(255,170,50,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.fillStyle = '#f6c45c'; c.strokeStyle = 'rgba(70,45,10,0.85)'; c.lineWidth = 3; c.beginPath(); c.arc(64, 64, 15, 0, Math.PI * 2); c.fill(); c.stroke(); c.fillStyle = '#fff3d0'; c.beginPath(); c.arc(59, 59, 5, 0, Math.PI * 2); c.fill(); });
const TALK_SVG = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
const TB = { el: null, v: new THREE.Vector3() };
function addMark(n) { n.mark = new THREE.Sprite(new THREE.SpriteMaterial({ map: BUBBLE, transparent: true, depthWrite: false, depthTest: true, fog: false })); n.mark.renderOrder = 5; n.mark.visible = false; scene.add(n.mark); }
for (const n of SHOP_PEOPLE) addMark(n);
function bubbleTick(now) {
  const show = state.started && !busy && $('card').hidden;
  for (const n of PEOPLE) { const m = n.mark; if (!m) continue; if (!show || !n.m || !n.m.visible) { m.visible = false; continue; } const d = Math.hypot(state.x - n.x, state.z - n.z), k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
    m.position.set(n.x, 2.15 + Math.sin(now * 2.4 + n.x) * 0.06, n.z); m.scale.set(k, k, k); m.material.opacity = Math.max(0.6, 1 - d / 20); m.visible = near !== n; }
  if (!TB.el) { TB.el = document.createElement('button'); TB.el.className = 'tbub'; TB.el.hidden = true; document.body.appendChild(TB.el); TB.el.addEventListener('click', (e) => { e.stopPropagation(); if (near && !near.go && !busy) activate(near); }); }
  const on = show && near && !near.go; TB.el.hidden = !on; if (!on) return;
  TB.v.set(near.x, 2.0, near.z).project(camera); if (TB.v.z > 1) { TB.el.hidden = true; return; }
  const r = canvas.getBoundingClientRect(); TB.el.style.left = (r.left + (TB.v.x + 1) / 2 * r.width) + 'px'; TB.el.style.top = (r.top + (1 - TB.v.y) / 2 * r.height) + 'px';
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

/* ---------- sound: a room hum, the street outside, and now and then the press ---------- */
let auNext = 0, thumpAt = 7;
function pressThump() { if (!AU.ctx || !AU.on) return; for (let i = 0; i < 3; i++) { noiseHit(220, 1.2, 0.16, 0.1, 0.5, i * 0.55); tone(90, 55, 0.2, 'triangle', 0.04, 0.5, i * 0.55); } }
function audioTick(t) { if (!AU.ctx || !state.started || t < auNext) return; auNext = t + 0.1; setG(AU.ch.room, 0.28); setG(AU.ch.crowd, 0.04); if (t > thumpAt) { thumpAt = t + 6 + Math.random() * 6; pressThump(); } }


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
    box(3.0, 0.08, 0.42, wood, bx, 0.46, bz, g); box(3.0, 0.5, 0.05, wood, bx, 0.78, bz - 0.22, g); for (const dx of [-1.35, 1.35]) box(0.06, 0.46, 0.4, woodDark, bx + dx, 0.23, bz, g); HALL_WALLS.push([bx - 1.6, bz - 0.35, bx + 1.6, bz + 0.3]); }
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
  { id: 'elder', model: 'nb_elder', who: 'Older man', label: 'Talk to the older man', x: -0.6, z: 6.5, ry: Math.PI, base: 'Idle', seat: [-1.0, -0.2], lines: () => neighbourLines('elder'), later: () => ['I am glad I came.', 'Will Mr Garvey speak soon?'] },
  { id: 'seller', model: 'nb_seller', who: 'Market seller', label: 'Talk to the market seller', x: 0.6, z: 6.5, ry: Math.PI, base: 'Idle', seat: [1.0, -0.2], lines: () => neighbourLines('seller'), later: () => ['I closed my stall early to come.', 'What a good idea.'] },
  { id: 'youth', model: 'nb_youth', who: 'Young man', label: 'Talk to the young man', x: 0, z: 7.2, ry: Math.PI, base: 'Idle', seat: [-1.0, 1.2], lines: () => neighbourLines('youth'), later: () => ['I told my friends too.', 'Can I help next time?'] },
];
for (const n of HALL_PEOPLE) initPerson(n);
for (const n of HALL_PEOPLE.slice(2)) n.hidden = true;   /* the neighbours arrive when the poster is printed */
function startArrivals() {
  HALL_PEOPLE.slice(2).forEach((n, i) => { if (!n.m) return; n.hidden = true; n.m.visible = false; n.x = (i - 1) * 0.6; n.z = 5.2; n.m.position.set(n.x, 0, n.z); n.m.rotation.y = Math.PI; n.dest = n.seat.slice(); n.delay = 1.2 + i * 1.8; });
}
function loadPerson(n) {
  if (n.loading) return n.loading;
  n.loading = model(n.model).then((gl) => { const m = gl.scene; m.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); m.position.set(n.x, 0, n.z); m.rotation.y = n.ry; m.userData.ground = n.ground || 0; m.visible = false; scene.add(m); animate(m, n.base); grounded.push(m); n.m = m; addMark(n); });
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
  box(0.9, 0.5, 0.6, wood, 0, 0.25, 0.5, g);   /* the soapbox */
  for (const [x, z] of [[-10, 5.7], [8, -5.7], [-5, -5.9]]) { box(0.7, 0.5, 0.7, wood, x, 0.4, z, g); }
  mesh(new THREE.PlaneGeometry(90, 40), new THREE.MeshBasicMaterial({ map: cv(64, 128, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9ec8e6'); gr.addColorStop(0.7, '#e9eee4'); gr.addColorStop(1, '#d9d3c0'); x.fillStyle = gr; x.fillRect(0, 0, w, h); }) }), 0, 20, -34, g);
  mesh(new THREE.PlaneGeometry(90, 40), new THREE.MeshBasicMaterial({ color: 0xc9d8de }), 0, 20, 34, g).rotation.y = Math.PI;
}

const STREET_SPOTS = { worker: [-2.3, 1.7], woman: [2.4, 2.0], critic: [0.6, 3.2], garvey3: [0, 0.5] };
const faceToward = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const wordsIs = (w) => story.words === w;
const THEME = { work: 'Friends, everyone deserves fair work and fair pay.', learn: 'Friends, every child deserves a good school.', pride: 'Friends, we can be proud of who we are.' };
const theme = (id, t) => ({ t, set: { words: id }, then: [{ who: 'Marcus Garvey', text: THEME[id] }, { who: 'Marcus Garvey', text: 'Let us help each other, and build something together.' }, { who: 'Woman', text: ({ work: 'Yes! Fair work is what I hope for.', learn: 'Yes! My son must go to school.', pride: 'Yes! I do feel proud.' })[id] }] });
const answer = (id, t, reply) => ({ t, set: { answer: id }, then: [{ who: 'Older man', text: reply }] });
const STREET_PEOPLE = [
  { id: 'garvey3', model: 'garvey1916', who: 'Marcus Garvey', label: 'Talk to Marcus Garvey', x: 0, z: 0.5, ry: 0, base: 'Idle', ground: 0.5,
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

/* ---------- places ---------- */
const PLACES = {
  shop: { group: room, lamp: lampLight, walls: WALLS, bounds: BOUNDS, people: SHOP_PEOPLE, actions: SHOP_ACTIONS, start: START, caption: 'Kingston, about 1908' },
  hall: { group: hallG, lamp: hallLamp, walls: HALL_WALLS, bounds: HALL_BOUNDS, people: HALL_PEOPLE, actions: HALL_ACTIONS, start: { x: 0, z: 3.1, yaw: 0 }, caption: 'Kingston, July 1914' },
  street: { group: streetG, lamp: new THREE.Object3D(), walls: STREET_WALLS, bounds: STREET_BOUNDS, people: STREET_PEOPLE, actions: [], start: { x: -7, z: 2.6, yaw: -1.25 }, caption: 'Harlem, New York, 1916', sky: 0x9ec8e6 } };
let place = 'shop', placeT = 0;
function enterPlace(name, keepPos) {
  place = name; const P = PLACES[name];
  for (const k of Object.keys(PLACES)) { const Q = PLACES[k]; Q.group.visible = k === name; Q.lamp.visible = k === name; for (const n of Q.people) { if (n.mark) n.mark.visible = false; if (n.m) n.m.visible = k === name && !n.hidden; } }
  if (name === 'hall' && stage >= 12) for (const n of HALL_PEOPLE.slice(2)) if (n.m && !n.delay && !n.dest) { n.hidden = false; n.x = n.seat[0]; n.z = n.seat[1]; n.ry = Math.PI; n.m.position.set(n.x, 0, n.z); n.m.rotation.y = Math.PI; n.m.visible = true; }
  curWalls = P.walls; curBounds = P.bounds; PEOPLE = P.people; ACTIONS = P.actions; near = null;
  scene.background = new THREE.Color(P.sky || 0x2a2118); scene.fog = P.sky ? new THREE.Fog(0xcbd9de, 28, 90) : null;   /* outdoor places have sky and haze; rooms do not */
  hemi.intensity = P.sky ? 2.3 : 1.25; sun.intensity = P.sky ? 2.2 : 1.7; sun.position.set(P.sky ? -5 : 6, P.sky ? 9 : 7, P.sky ? 4 : 5);   /* daylight outside is brighter, so dark skin still shows */
  if (!keepPos) { state.x = P.start.x; state.z = P.start.z; state.yaw = P.start.yaw; state.pitch = 0; }
}
function showPlace() { const el = $('place'); el.textContent = PLACES[place].caption; el.hidden = false; el.style.opacity = 1; clearTimeout(placeT); placeT = setTimeout(() => { el.style.opacity = 0; }, 4500); }
function resetChapter2() {   /* the hall again: the poster comes down, the neighbours go home, the journal is kept */
  talkWith = null; $('dialogue').hidden = true; busy = false; closeType(false); delete story.poster; delete story.printed; showPoster(); stage = 10;
  for (const n of HALL_PEOPLE) { n.talked = false; n.heard = 0; n.dest = null; n.delay = 0; n.x = n.hx; n.z = n.hz; n.hidden = HALL_PEOPLE.indexOf(n) >= 2; if (n.m) { n.m.position.set(n.x, 0, n.z); n.m.rotation.y = n.ry; n.m.userData.anim.play(null); } }
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
    (stage >= 20 ? ensureStreet() : stage >= 10 ? ensureHall() : Promise.resolve()).then(() => { enterPlace(stage >= 20 ? 'street' : stage >= 10 ? 'hall' : 'shop'); showPoster(); if (__DEV__) devViews(); });
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
  if (shot === 'street1') inStreet(20, -7, 2.6, -1.25, 0.02);
  if (shot === 'street2') inStreet(21, 4.5, 1.2, 1.35, 0.03);
  if (shot === 'streetchat') inStreet(21, 0.3, 2.9, 0.1, 0.05).then(() => startTalk(byId('garvey3')));
  if (shot === 'hall1') inHall(10, 0, 3.1, 0, 0);
  if (shot === 'hall2') inHall(11, 1.2, 0.6, -1.0, -0.08, 'WORK');
  if (shot === 'hall3') inHall(13, 0, 1.4, 0, 0.04, 'UNITY');
  if (shot === 'hall4') inHall(12, -3.2, 2.6, 0.75, 0, 'LEARN');
  if (shot === 'hallchat') inHall(10, -0.8, -1.2, 0, 0.04).then(() => startTalk(byId('garvey')));
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
        L('strike lines=' + await talkTo(SHOP_PEOPLE[0]) + ' choice=' + story.strike + ' stage=' + stage + ' pages=' + unlocked.join(','));
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
