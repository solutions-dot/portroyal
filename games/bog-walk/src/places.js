import { JOURNEY } from './content.js';
/* games/bog-walk/src/places.js: the places outside the Tube, built in code (see docs/games/bog-walk.md, "Places").
   One site at three times (the station on Sunday evening, the yard the morning after, the ruins today) and Kingston in 1899.
   Each builder returns { id, group, walls, bounds, start, people, extras, env, eye, spots, tick, ... } like Kendal's places.
   Coordinates are metres; x runs east, yaw 0 looks toward -z (north, where the river and the hills are).
   The turbine house, the valve wheel, the switchboard and the trams are a general picture: the record does not say how they looked or where the valve was. */
import * as THREE from 'three';
import { T, cv, grain, std, solid, flat, glow, mesh, box, cyl, plane, grp, rng } from './wgfx.js';
import { palm, tree, banana, bush, boardHouse, hillRing, scatter, mule, bench, lampPost, crate, barrel, bucket, sack, lantern, cart } from './props.js';
import { grassField, flowerField, rockField, blotches, fence, mangoTree, bamboo, flameTree, hibiscus, croton, stump } from './detail.js';
import { rails, steamLoco, wagon } from './trains.js';
import { person, extra, crowd04, crowd99, crowdNow } from './cast.js';

const PI = Math.PI;
const PR = 1.22, PY = 1.72, PZ = -11;   /* the Tube outside: 8 feet across (radius 1.22 m), its middle 1.72 m up, running along x at z = -11 */

/* ---------- times of day (as in Kendal's common.js) ---------- */
export const ENV = {
  day: { top: 0x58a6e4, hor: 0xd6eaf0, fog: 0xcfe2e6, fogN: 80, fogF: 280, hemi: [0xeaf4ff, 0x8a7a5a, 2.1], sun: [0xfff2dc, 2.4, [20, 30, 10]], stars: 0, moon: 0 },
  morning: { top: 0x6fb0e2, hor: 0xf1dcb8, fog: 0xe4d6bd, fogN: 70, fogF: 260, hemi: [0xfff1d8, 0x7a6a50, 1.9], sun: [0xffdca8, 2.1, [30, 20, -14]], stars: 0, moon: 0 },
  gold: { top: 0x4c7cc0, hor: 0xf6c27c, fog: 0xe2b98a, fogN: 50, fogF: 230, hemi: [0xffe0b4, 0x6a5444, 1.7], sun: [0xffb464, 2.0, [-36, 10, 6]], stars: 0, moon: 0 },
  dusk: { top: 0x2c3c72, hor: 0xe8946a, fog: 0x8a6a6a, fogN: 30, fogF: 190, hemi: [0xe9b8a0, 0x3a3040, 1.25], sun: [0xff8a4a, 1.1, [-40, 6, 12]], stars: 0.3, moon: 0 },
  night: { top: 0x03050e, hor: 0x1b2744, fog: 0x0c1322, fogN: 6, fogF: 90, hemi: [0x6a7cb0, 0x161a24, 0.75], sun: [0x8ea8ff, 0.55, [30, 40, -20]], stars: 1, moon: 1 },
  dawn: { top: 0x44568a, hor: 0xf1b186, fog: 0xcfa790, fogN: 14, fogF: 170, hemi: [0xffdcc0, 0x54464a, 1.25], sun: [0xffa860, 1.1, [40, 6, 0]], stars: 0.15, moon: 0 },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
export function mixEnv(a, b, k) {
  const lc = (x, y) => _c1.set(x).lerp(_c2.set(y), k).getHex(), ln = (x, y) => x + (y - x) * k;
  return { top: lc(a.top, b.top), hor: lc(a.hor, b.hor), fog: lc(a.fog, b.fog), fogN: ln(a.fogN, b.fogN), fogF: ln(a.fogF, b.fogF),
    hemi: [lc(a.hemi[0], b.hemi[0]), lc(a.hemi[1], b.hemi[1]), ln(a.hemi[2], b.hemi[2])], sun: [lc(a.sun[0], b.sun[0]), ln(a.sun[1], b.sun[1]), a.sun[2].map((v, i) => ln(v, b.sun[2][i]))], stars: ln(a.stars, b.stars), moon: ln(a.moon, b.moon) };
}

/* ---------- textures for this game's places ---------- */
const memo = {}; const once = (k, f) => memo[k] || (memo[k] = f());
const TX = {
  brick(rep = [4, 3], tone = [150, 74, 52], age = 0) {   /* red brick in English bond, with lime mortar; age > 0 adds soot, moss and broken edges */
    return once('brick' + rep + tone + age, () => cv(512, 512, (x, w, h) => {
      const r = rng(31 + age * 7); x.fillStyle = '#b8ab92'; x.fillRect(0, 0, w, h); const bh = 512 / 16, bw = 512 / 4;
      for (let row = 0; row < 16; row++) { const header = row % 2, cw = header ? bw / 2 : bw, off = header ? bw / 4 : 0;
        for (let c = -1; c < w / cw + 1; c++) { const v = (r() - 0.5) * 36, bx = c * cw + off, by = row * bh; x.fillStyle = `rgb(${tone[0] + v | 0},${tone[1] + v * 0.7 | 0},${tone[2] + v * 0.5 | 0})`; x.fillRect(bx + 2, by + 2, cw - 4, bh - 4);
          x.fillStyle = 'rgba(255,230,200,0.06)'; x.fillRect(bx + 2, by + 2, cw - 4, 3); x.fillStyle = 'rgba(30,10,5,0.12)'; x.fillRect(bx + 2, by + bh - 6, cw - 4, 4); } }
      if (age) { for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${40 + r() * 30 | 0},${70 + r() * 40 | 0},${30 + r() * 20 | 0},${0.1 + r() * 0.25})`; x.beginPath(); x.ellipse(r() * w, h * 0.6 + r() * h * 0.4, 10 + r() * 50, 6 + r() * 26, 0, 0, 7); x.fill(); }
        for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(20,16,12,${0.05 + r() * 0.12})`; x.beginPath(); x.ellipse(r() * w, r() * h * 0.6, 20 + r() * 60, 10 + r() * 40, 0, 0, 7); x.fill(); } }
      grain(x, w, h, 16); }, rep));
  },
  rivets(rep = [20, 4], base = [58, 54, 50], rust = 0) {   /* the Tube's riveted plates seen from outside: seams round the pipe and along it, each with a row of rivet heads */
    return once('rv' + rep + base + rust, () => cv(512, 256, (x, w, h) => {
      const r = rng(5 + rust); x.fillStyle = `rgb(${base})`; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) { const v = (r() - 0.5) * 30; x.fillStyle = `rgba(${base[0] + v | 0},${base[1] + v | 0},${base[2] + v | 0},0.35)`; x.beginPath(); x.ellipse(r() * w, r() * h, 20 + r() * 60, 10 + r() * 30, 0, 0, 7); x.fill(); }
      if (rust >= 1) for (let i = 0; i < 70 * rust; i++) { x.fillStyle = `rgba(${130 + r() * 50 | 0},${60 + r() * 30 | 0},${25 + r() * 15 | 0},${0.2 + r() * 0.5})`; x.beginPath(); x.ellipse(r() * w, r() * h, 6 + r() * 40, 4 + r() * 22, r() * 3, 0, 7); x.fill(); }
      else if (rust) for (let i = 0; i < 60; i++) { const sx = r() * w, sy = r() * h, l = 10 + r() * 40; const gr = x.createLinearGradient(0, sy, 0, sy + l); gr.addColorStop(0, `rgba(${120 + r() * 40 | 0},${58 + r() * 20 | 0},${30},${0.12 + r() * 0.16})`); gr.addColorStop(1, 'rgba(120,60,30,0)'); x.fillStyle = gr; x.fillRect(sx, sy, 2 + r() * 4, l); }   /* a light worn pipe: thin rust streaks running down from seams and rivets */
      const seam = (x0, y0, x1, y1) => { x.strokeStyle = 'rgba(15,12,10,0.7)'; x.lineWidth = 3; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); x.strokeStyle = 'rgba(255,240,220,0.08)'; x.lineWidth = 2; x.beginPath(); x.moveTo(x0 + 2, y0 + 2); x.lineTo(x1 + 2, y1 + 2); x.stroke(); };
      seam(4, 0, 4, h); seam(0, h * 0.5, w, h * 0.5);
      const dot = (cx, cy) => { const g = x.createRadialGradient(cx - 1.5, cy - 1.5, 0.5, cx, cy, 5); g.addColorStop(0, 'rgba(160,150,140,0.9)'); g.addColorStop(0.6, `rgba(${base[0] - 10},${base[1] - 10},${base[2] - 10},1)`); g.addColorStop(1, 'rgba(10,8,6,0.8)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 4.6, 0, 7); x.fill(); };
      for (let y = 10; y < h; y += 16) { dot(16, y); dot(30, y); } for (let xx = 12; xx < w; xx += 16) { dot(xx, h * 0.5 - 9); dot(xx, h * 0.5 + 9); }
      grain(x, w, h, 14); }, rep));
  },
  marble() {   /* the switchboard: grey-white marble slabs with brass dials and the knife switches drawn on */
    return once('marble', () => cv(1024, 512, (x, w, h) => {
      const r = rng(77); x.fillStyle = '#e6e2d8'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(120,120,128,${0.12 + r() * 0.2})`; x.lineWidth = 1 + r() * 2; x.beginPath(); let px = r() * w, py = r() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (r() - 0.5) * 140; py += (r() - 0.3) * 90; x.lineTo(px, py); } x.stroke(); }
      for (let p = 1; p < 4; p++) { x.fillStyle = 'rgba(40,36,30,0.5)'; x.fillRect(p * w / 4 - 2, 0, 4, h); }   /* the joins between the four panels */
      for (let p = 0; p < 4; p++) { const cx = p * w / 4 + w / 8;
        for (const [dy, rr] of [[96, 58], [230, 44]]) { const g = x.createRadialGradient(cx, dy, 4, cx, dy, rr + 8); g.addColorStop(0, '#f7f1de'); g.addColorStop(0.85, '#e8dcbc'); g.addColorStop(0.86, '#b08a3a'); g.addColorStop(1, '#6a4e1c'); x.fillStyle = g; x.beginPath(); x.arc(cx, dy, rr + 8, 0, 7); x.fill();
          x.strokeStyle = '#2a2620'; x.lineWidth = 2; for (let t = 0; t <= 10; t++) { const a = PI * (0.8 + t * 0.14); x.beginPath(); x.moveTo(cx + Math.cos(a) * rr * 0.78, dy + Math.sin(a) * rr * 0.78); x.lineTo(cx + Math.cos(a) * rr * 0.92, dy + Math.sin(a) * rr * 0.92); x.stroke(); }
          x.fillStyle = '#2a2620'; x.font = `700 ${rr * 0.28 | 0}px Georgia, serif`; x.textAlign = 'center'; x.fillText(dy < 150 ? 'VOLTS' : 'AMPERES', cx, dy + rr * 0.45);
          x.strokeStyle = '#8a1a14'; x.lineWidth = 3; const a = PI * (1.1 + r() * 0.8); x.beginPath(); x.moveTo(cx, dy); x.lineTo(cx + Math.cos(a) * rr * 0.8, dy + Math.sin(a) * rr * 0.8); x.stroke(); x.fillStyle = '#3a3428'; x.beginPath(); x.arc(cx, dy, 5, 0, 7); x.fill(); }
        x.fillStyle = '#c89a4a'; x.fillRect(cx - 50, 330, 100, 10); for (const s of [-30, 0, 30]) { x.fillStyle = '#8a5a28'; x.fillRect(cx + s - 5, 310, 10, 50); x.fillStyle = '#d8a050'; x.fillRect(cx + s - 3, 312, 6, 46); }   /* knife switches */
        x.fillStyle = '#1a1814'; for (const s of [-36, 36]) { x.beginPath(); x.arc(cx + s, 420, 9, 0, 7); x.fill(); } x.fillStyle = '#c89a4a'; x.fillRect(cx - 40, 446, 80, 22); x.fillStyle = '#2a2014'; x.font = '700 14px Georgia, serif'; x.fillText(['FEEDER 1', 'FEEDER 2', 'FEEDER 3', 'MAIN'][p], cx, 462); }
      grain(x, w, h, 8); }, null));
  },
  marl() {   /* Kingston's street: pale crushed limestone (marl), dusty, with darker wheel ruts and hoof marks; repeats along the street */
    return once('marl', () => cv(512, 512, (x, w, h) => { const r = rng(61); x.fillStyle = '#cdbf9f'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { const v = (r() - 0.5) * 40; x.fillStyle = `rgba(${200 + v | 0},${188 + v | 0},${158 + v | 0},0.55)`; x.fillRect(r() * w, r() * h, 1 + r() * 4, 1 + r() * 3); }
      for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(150,128,96,${0.06 + r() * 0.1})`; x.beginPath(); x.ellipse(r() * w, r() * h, 20 + r() * 70, 8 + r() * 30, r() * 3, 0, 7); x.fill(); }
      for (const cy of [0.3, 0.36, 0.64, 0.7]) { const g = x.createLinearGradient(0, cy * h - 8, 0, cy * h + 8); g.addColorStop(0, 'rgba(120,100,74,0)'); g.addColorStop(0.5, 'rgba(120,100,74,0.22)'); g.addColorStop(1, 'rgba(120,100,74,0)'); x.fillStyle = g; x.fillRect(0, cy * h - 8, w, 16); }
      for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(110,92,70,${0.15 + r() * 0.2})`; x.beginPath(); x.ellipse(r() * w, (0.42 + r() * 0.16) * h, 3, 2.2, 0, 0, 7); x.fill(); }   /* hoof marks down the middle */
      grain(x, w, h, 14); }, [16, 2]));
  },
  tiles(rep = [12, 8]) {   /* a floor of red and buff quarry tiles, each about 30 cm, with grey joints and a little wear */
    return once('tiles' + rep, () => cv(256, 256, (x, w, h) => { const r = rng(15), n = 4, s = w / n; x.fillStyle = '#7a746a'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const red = (i + j) % 2 === 0, v = (r() - 0.5) * 18; x.fillStyle = red ? `rgb(${150 + v | 0},${70 + v * 0.6 | 0},${52 + v * 0.5 | 0})` : `rgb(${196 + v | 0},${170 + v | 0},${130 + v | 0})`; x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
        x.fillStyle = 'rgba(255,255,255,0.06)'; x.fillRect(i * s + 2, j * s + 2, s - 4, 4); for (let k = 0; k < 5; k++) { x.fillStyle = `rgba(40,30,20,${0.04 + r() * 0.06})`; x.beginPath(); x.ellipse(i * s + r() * s, j * s + r() * s, 3 + r() * 10, 2 + r() * 6, r() * 3, 0, 7); x.fill(); } }
      grain(x, w, h, 10); }, rep));
  },
  glazed(rep = [10, 1]) {   /* the dado: cream glazed bricks with a dark green band along the top, easy to wipe clean in an engine room */
    return once('glazed' + rep, () => cv(256, 128, (x, w, h) => { const r = rng(19); x.fillStyle = '#b8b2a0'; x.fillRect(0, 0, w, h); const bh = 16, bw = 64;
      for (let row = 0; row < 7; row++) for (let c = -1; c < 5; c++) { const off = row % 2 ? bw / 2 : 0, v = (r() - 0.5) * 10; x.fillStyle = `rgb(${232 + v | 0},${224 + v | 0},${200 + v | 0})`; x.fillRect(c * bw + off + 1.5, h - (row + 1) * bh + 1.5, bw - 3, bh - 3); x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(c * bw + off + 3, h - (row + 1) * bh + 3, bw - 10, 2); }
      x.fillStyle = '#2f5a44'; x.fillRect(0, 0, w, h - 7 * bh); x.fillStyle = 'rgba(255,255,255,0.25)'; x.fillRect(0, 2, w, 2); grain(x, w, h, 6); }, rep));
  },
  vine() {   /* creepers on an old wall: leafy patches on a transparent card, thicker at the bottom */
    return once('vine', () => cv(256, 256, (x, w, h) => { x.clearRect(0, 0, w, h); const r = rng(23);
      for (let i = 0; i < 520; i++) { const y = h - Math.pow(r(), 1.6) * h, xx = w / 2 + (r() - 0.5) * w * (0.5 + 0.5 * (y / h)), g = 70 + r() * 70; x.fillStyle = `rgb(${g * 0.45 | 0},${g | 0},${g * 0.32 | 0})`; x.beginPath(); x.ellipse(xx, y, 4 + r() * 5, 2.5 + r() * 3, r() * 3, 0, 7); x.fill(); }
      x.strokeStyle = 'rgba(70,52,30,0.8)'; x.lineWidth = 2; for (let i = 0; i < 6; i++) { x.beginPath(); let px = w * (0.2 + r() * 0.6), py = h; x.moveTo(px, py); for (let k = 0; k < 8; k++) { px += (r() - 0.5) * 30; py -= h * (0.05 + r() * 0.08); x.lineTo(px, py); } x.stroke(); } }, null));
  },
  rust(rep = [2, 1]) {
    return once('rust' + rep, () => cv(256, 256, (x, w, h) => { const r = rng(9); x.fillStyle = '#6a3a22'; x.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(${90 + r() * 90 | 0},${40 + r() * 40 | 0},${18 + r() * 20 | 0},${0.3 + r() * 0.5})`; x.beginPath(); x.ellipse(r() * w, r() * h, 3 + r() * 30, 2 + r() * 14, r() * 3, 0, 7); x.fill(); }
      for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(20,14,10,${0.2 + r() * 0.3})`; x.beginPath(); x.ellipse(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6, 0, 0, 7); x.fill(); } grain(x, w, h, 20); }, rep));
  },
};

/* the notice board's picture of the water's journey: six pictures, shuffled until you put them in order, then in a row with arrows */
const ICONS = {
  river(x, s) { x.fillStyle = '#5a8a3a'; x.fillRect(-s, -s, 2 * s, 2 * s); x.fillStyle = '#3a6a8a'; x.beginPath(); x.moveTo(-s, s * 0.2); x.bezierCurveTo(-s * 0.3, -s * 0.4, s * 0.2, s * 0.8, s, -s * 0.1); x.lineTo(s, s * 0.4); x.bezierCurveTo(s * 0.2, s * 1.2, -s * 0.3, 0, -s, s * 0.7); x.fill(); x.strokeStyle = '#d8eaf0'; x.lineWidth = 3; for (const k of [0, 0.3]) { x.beginPath(); x.moveTo(-s * 0.6, s * (0.3 + k)); x.quadraticCurveTo(-s * 0.3, s * (0.15 + k), 0, s * (0.35 + k)); x.stroke(); } x.fillStyle = '#4a6a3a'; x.beginPath(); x.moveTo(-s, -s * 0.3); x.lineTo(-s * 0.4, -s); x.lineTo(s * 0.2, -s * 0.4); x.lineTo(s * 0.7, -s * 0.9); x.lineTo(s, -s * 0.5); x.lineTo(s, -s); x.lineTo(-s, -s); x.fill(); },
  dam(x, s) { x.fillStyle = '#8ab0c8'; x.fillRect(-s, -s, 2 * s, 2 * s); x.fillStyle = '#3a6a8a'; x.fillRect(-s, -s * 0.2, s * 0.9, s * 1.2); x.fillStyle = '#9a968a'; x.beginPath(); x.moveTo(-s * 0.1, -s * 0.5); x.lineTo(s * 0.25, -s * 0.5); x.lineTo(s * 0.6, s); x.lineTo(-s * 0.1, s); x.fill(); x.strokeStyle = '#6a665a'; x.lineWidth = 2; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-s * 0.1, -s * 0.3 + i * s * 0.35); x.lineTo(s * 0.3 + i * 0.08 * s, -s * 0.3 + i * s * 0.35); x.stroke(); } x.fillStyle = '#5a8aa8'; x.fillRect(s * 0.6, s * 0.6, s * 0.4, s * 0.4); },
  tube(x, s) { x.fillStyle = '#7ab05a'; x.fillRect(-s, -s, 2 * s, 2 * s); x.fillStyle = '#3a3a3e'; x.save(); x.rotate(0.45); x.fillRect(-s * 1.4, -s * 0.28, s * 2.8, s * 0.56); x.fillStyle = '#5a5a60'; x.fillRect(-s * 1.4, -s * 0.28, s * 2.8, s * 0.12); x.fillStyle = '#1a1a1c'; for (let i = -4; i <= 4; i++) x.fillRect(i * s * 0.3, -s * 0.28, 2, s * 0.56); x.restore(); x.fillStyle = '#9a968a'; for (const k of [-0.5, 0.1, 0.6]) x.fillRect(k * s - 4, k * s * 0.5 + s * 0.15, 8, s * 0.8 - k * s * 0.4); },
  wheel(x, s) { x.fillStyle = '#c8b898'; x.fillRect(-s, -s, 2 * s, 2 * s); x.strokeStyle = '#2a2a2e'; x.lineWidth = s * 0.12; x.beginPath(); x.arc(0, 0, s * 0.72, 0, 7); x.stroke(); x.lineWidth = s * 0.07; for (let i = 0; i < 8; i++) { const a = i * PI / 4; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * s * 0.7, Math.sin(a) * s * 0.7); x.stroke(); } x.fillStyle = '#b08a3a'; x.beginPath(); x.arc(0, 0, s * 0.16, 0, 7); x.fill(); x.fillStyle = '#e8c84a'; x.font = `700 ${s * 0.5 | 0}px Georgia`; x.textAlign = 'center'; x.fillText('⚡', s * 0.62, -s * 0.5); },
  wires(x, s) { x.fillStyle = '#9ac0d8'; x.fillRect(-s, -s, 2 * s, 2 * s); x.fillStyle = '#5a8a3a'; x.fillRect(-s, s * 0.6, 2 * s, s * 0.4); x.fillStyle = '#4a3020'; for (const px of [-0.7, 0.05, 0.8]) { x.fillRect(px * s - 4, -s * 0.6, 8, s * 1.3); x.fillRect(px * s - s * 0.2, -s * 0.55, s * 0.4, 5); } x.strokeStyle = '#1a1a1a'; x.lineWidth = 2; for (const dy of [-0.5, -0.38]) { x.beginPath(); x.moveTo(-s, dy * s); x.quadraticCurveTo(-s * 0.32, (dy + 0.12) * s, 0.05 * s, dy * s); x.quadraticCurveTo(s * 0.42, (dy + 0.12) * s, s, dy * s); x.stroke(); } },
  tram(x, s) { x.fillStyle = '#d8c8a8'; x.fillRect(-s, -s, 2 * s, 2 * s); x.fillStyle = '#7a7060'; x.fillRect(-s, s * 0.62, 2 * s, s * 0.38); x.strokeStyle = '#1a1a1a'; x.lineWidth = 2; x.beginPath(); x.moveTo(-s, -s * 0.8); x.lineTo(s, -s * 0.8); x.stroke(); x.beginPath(); x.moveTo(0, -s * 0.25); x.lineTo(s * 0.35, -s * 0.8); x.stroke(); x.fillStyle = '#2f5a3a'; x.fillRect(-s * 0.75, -s * 0.25, s * 1.5, s * 0.75); x.fillStyle = '#efe4c8'; x.fillRect(-s * 0.75, -s * 0.25, s * 1.5, s * 0.3); x.fillStyle = '#3a4a5a'; for (let i = 0; i < 4; i++) x.fillRect(-s * 0.62 + i * s * 0.32, -s * 0.18, s * 0.22, s * 0.18); x.fillStyle = '#1a1a1a'; for (const wx of [-0.45, 0.45]) { x.beginPath(); x.arc(wx * s, s * 0.56, s * 0.12, 0, 7); x.fill(); } },
};
const ICON_ORDER=JOURNEY.map(e=>e[2]), ICON_NAMES=Object.fromEntries(JOURNEY.map(e=>[e[2],e[0]]));
export function journeyIcon(index) {
  const texture=cv(160,128,(x)=>{x.fillStyle='#eee3c4';x.fillRect(0,0,160,128);x.save();x.translate(80,64);ICONS[ICON_ORDER[index]](x,54);x.restore();},null);
  const url=texture.image.toDataURL();texture.dispose();return url;
}
export function noticeTex(solved) {
  return cv(1024, 704, (x, w, h) => {
    x.fillStyle = '#e8dcbc'; x.fillRect(0, 0, w, h); const r = rng(3); for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(120,90,40,${0.03 + r() * 0.05})`; x.beginPath(); x.ellipse(r() * w, r() * h, 30 + r() * 90, 20 + r() * 50, 0, 0, 7); x.fill(); }
    x.strokeStyle = '#2a2014'; x.lineWidth = 6; x.strokeRect(14, 14, w - 28, h - 28); x.lineWidth = 2; x.strokeRect(26, 26, w - 52, h - 52);
    x.fillStyle = '#1e1810'; x.textAlign = 'center'; x.font = '700 50px Georgia, serif'; x.fillText('BOG WALK POWER STATION', w / 2, 92); x.font = 'italic 34px Georgia, serif'; x.fillText('The journey of the water', w / 2, 140);
    const order = ICON_ORDER, s = 62;
    order.forEach((k, i) => { const cx = 110 + i * 161, cy = 290; x.save(); x.translate(cx, cy); x.beginPath(); x.rect(-s, -s, 2 * s, 2 * s); x.clip(); ICONS[k](x, s); x.restore(); x.strokeStyle = '#2a2014'; x.lineWidth = 4; x.strokeRect(cx - s, cy - s, 2 * s, 2 * s);
      x.fillStyle = '#1e1810'; x.font = '700 24px Georgia, serif'; x.fillText(ICON_NAMES[k], cx, cy + s + 36);
      if (i < 5) { x.fillStyle = '#8a1a14'; x.beginPath(); x.moveTo(cx + s + 8, cy - 12); x.lineTo(cx + s + 24, cy - 12); x.lineTo(cx + s + 24, cy - 22); x.lineTo(cx + s + 36, cy); x.lineTo(cx + s + 24, cy + 22); x.lineTo(cx + s + 24, cy + 12); x.lineTo(cx + s + 8, cy + 12); x.fill(); } });
    x.font = '700 30px Georgia, serif'; x.fillText(JOURNEY.map(e=>e[0].replace(/^The /,'')).join(', ')+'.', w / 2, 470);
    x.strokeStyle = '#2a2014'; x.lineWidth = 2; x.beginPath(); x.moveTo(80, 510); x.lineTo(w - 80, 510); x.stroke();
    x.font = '700 30px Georgia, serif'; x.fillText('NOTICE', w / 2, 562); x.font = '28px Georgia, serif'; x.fillText('The water is shut off at twelve o\'clock on Sunday nights,', w / 2, 606); x.fillText('after all traffic has ceased.', w / 2, 644);
    grain(x, w, h, 10); }, null);
}
/* the information board today: the real 1904 headline, and one gentle line under it */
function infoTex() {
  return cv(1024, 720, (x, w, h) => {
    x.fillStyle = '#1f4a3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2ecd8'; x.fillRect(24, 24, w - 48, h - 48);
    x.fillStyle = '#1f4a3a'; x.fillRect(24, 24, w - 48, 110); x.fillStyle = '#f2ecd8'; x.textAlign = 'left'; x.font = '700 56px Georgia, serif'; x.fillText('The Bog Walk Tube', 60, 98); x.font = '26px Georgia, serif'; x.textAlign = 'right'; x.fillText('Rio Cobre, St Catherine', w - 60, 96);
    x.textAlign = 'left'; x.fillStyle = '#1e1a14'; x.font = '24px Georgia, serif';
    ['A power station stood here from 1899 to 1966.', 'Water from the dam ran down a huge iron pipe, the Tube,', 'to turn the wheels that made power for Kingston\'s trams.'].forEach((t, i) => x.fillText(t, 60, 186 + i * 34));
    x.fillStyle = '#ece2c4'; x.fillRect(60, 300, 560, 360); x.strokeStyle = '#2a2014'; x.lineWidth = 3; x.strokeRect(60, 300, 560, 360);
    x.fillStyle = '#1e1a14'; x.textAlign = 'center'; x.font = '700 18px Georgia, serif'; x.fillText('THE GLEANER, 28 JUNE 1904', 340, 330); x.beginPath(); x.moveTo(80, 342); x.lineTo(600, 342); x.stroke();
    const H = [['FEARFUL CATASTROPHE AT BOG WALK', '700 30px Georgia, serif'], ['Drowning Men Fight For Life', '700 24px Georgia, serif'], ['Sudden Rush of Water Causes Panic', '22px Georgia, serif'], ['33 Able-Bodied Men Drowned', '700 24px Georgia, serif'], ['In Water-Pipe', '700 24px Georgia, serif'], ['No Accurate Information as To', '22px Georgia, serif'], ['Cause Of The Disaster', '22px Georgia, serif']];
    H.forEach(([t, f], i) => { x.font = f; x.fillText(t, 340, 384 + i * 40); });
    x.fillStyle = '#d8ccb0'; x.fillRect(650, 300, 314, 230); x.strokeRect(650, 300, 314, 230); x.save(); x.translate(807, 415); ICONS.tube(x, 100); x.restore(); x.strokeRect(650, 300, 314, 230);   /* a little picture of the pipe */
    x.fillStyle = '#1e1a14'; x.font = 'italic 20px Georgia, serif'; x.fillText('The Tube was 8 feet across.', 807, 556);
    x.fillStyle = '#1f4a3a'; x.fillRect(650, 580, 314, 80); x.fillStyle = '#f2ecd8'; x.font = '700 20px Georgia, serif'; x.fillText('In 1904, 33 men died here', 807, 612); x.fillText('when water came into the pipe.', 807, 640);
    grain(x, w, h, 6); }, null);
}
function signTex(lines, w = 512, h = 128, bg = '#efe6cc', fg = '#1e1810') { return once('sign' + JSON.stringify([lines, w, h, bg, fg]), () => signTex0(lines, w, h, bg, fg)); }   /* the same sign twice shares one texture */
function signTex0(lines, w, h, bg, fg) { return cv(w, h, (x) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.strokeStyle = fg; x.lineWidth = 5; x.strokeRect(7, 7, w - 14, h - 14); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; lines.forEach(([t, f], i) => { x.font = f; x.fillText(t, w / 2, h * (i + 1) / (lines.length + 1)); }); }, null); }

/* ---------- small builders ---------- */
/* the ground: a big plane pushed back a little in depth (polygonOffset) and cut into tiles, so a yard, a road or a path laid on top of it never
   flickers or vanishes into it at a low angle (on some phones and in software drawing a 900 m plane of two triangles lost the depth test to the road) */
function groundPlane(g, tex) { const gp = mesh(new THREE.PlaneGeometry(900, 900, 36, 36), std(tex, 1, { polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 4 }), 0, 0, 0, g); gp.rotation.x = -PI / 2; return gp; }
const M = { iron: solid(0x2b2d31, 0.55, 0.35), ironPaint: solid(0x1f2a24, 0.6, 0.25), conc: std(T.concrete([2, 1]), 0.95), concOld: solid(0x8e8a7e, 1), wood: solid(0x7a5a3c, 0.95), woodDark: solid(0x3d2d20, 0.95), brass: solid(0xc29a45, 0.35, 0.6), copper: solid(0xb0683a, 0.4, 0.6), white: solid(0xe8e0cc, 0.8), blanket: solid(0x6a5a4a, 1), blanket2: solid(0x4a4a5a, 1), steel: solid(0x8c8f93, 0.4, 0.6) };
function tubePipe(parent, pts, mat, radius = PR, seg = 120) {   /* the big pipe along a curve, with its riveted texture repeating every 2.4 m */
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.2), len = curve.getLength();
  const m = mat.clone(); m.map = mat.map.clone(); m.map.needsUpdate = true; m.map.repeat.set(len / 2.4, 3); if (m.bumpMap) m.bumpMap = m.map;
  return mesh(new THREE.TubeGeometry(curve, seg, radius, 36, false), m, 0, 0, 0, parent);
}
function saddle(parent, x, z, y0 = 0, top = PY - PR + 0.25, w = 0.7, mat = M.conc) {   /* a concrete support under the pipe: a footing and a block under the pipe */
  const g = grp(parent, x, y0, z); box(w, top - y0, PR * 1.7, mat, 0, (top - y0) / 2, 0, g); box(w + 0.3, 0.18, PR * 2.0, mat, 0, 0.09, 0, g);
  return g;
}
function handWheel(r = 0.55, spokes = 6, mat = M.ironPaint) {   /* a cast-iron valve hand wheel facing +z: rim, spokes, hub, and two handles on the rim */
  const g = grp(); const rim = mesh(new THREE.TorusGeometry(r, 0.045, 10, 40), mat, 0, 0, 0, g);
  for (let i = 0; i < spokes; i++) { const a = i / spokes * PI * 2, sp = cyl(0.025, 0.035, r, mat, Math.cos(a) * r / 2, Math.sin(a) * r / 2, 0, g, 8); sp.rotation.z = a - PI / 2; }
  const hub = cyl(0.09, 0.09, 0.14, mat, 0, 0, 0, g, 16); hub.rotation.x = PI / 2; const nut = cyl(0.05, 0.05, 0.18, M.brass, 0, 0, 0.02, g, 6); nut.rotation.x = PI / 2;
  for (const a of [0.3, 0.3 + PI]) { const hd = cyl(0.03, 0.03, 0.16, M.woodDark, Math.cos(a) * r, Math.sin(a) * r, 0.08, g, 8); hd.rotation.x = PI / 2; }
  return g;
}
function bulb(parent, x, y, z, mat, drop = 0.8) {   /* an electric lamp hanging on its flex from a ceiling rose: a green enamel shade, white inside, and the bulb */
  const g = grp(parent, x, y, z); cyl(0.05, 0.05, 0.04, M.white, 0, -0.02, 0, g, 10); cyl(0.006, 0.006, drop, M.iron, 0, -drop / 2, 0, g, 4); cyl(0.03, 0.03, 0.06, M.brass, 0, -drop + 0.01, 0, g, 8);
  cyl(0.03, 0.2, 0.12, solid(0x2a4a3a, 0.5, 0.3), 0, -drop - 0.08, 0, g, 16); const inner = mesh(new THREE.CylinderGeometry(0.028, 0.19, 0.11, 16, 1, true), solid(0xf0ead8, 0.4, 0, { side: THREE.BackSide }), 0, -drop - 0.08, 0, g);
  mesh(new THREE.SphereGeometry(0.05, 10, 8), mat, 0, -drop - 0.12, 0, g); return g;
}
function wallWindow(parent, w, h, x, y, z, ry, glassMat, frame = M.white) {   /* a tall arched window set into a wall: frame, glazing bars and glass that can glow */
  const g = grp(parent, x, y, z); g.rotation.y = ry;
  plane(w, h, glassMat, 0, 0, 0.005, g); const arch = mesh(new THREE.CircleGeometry(w / 2, 20, 0, PI), glassMat, 0, h / 2, 0.005, g);
  box(w + 0.16, 0.1, 0.08, frame, 0, -h / 2 - 0.05, 0.03, g); for (const s of [-1, 1]) box(0.08, h, 0.08, frame, s * (w / 2 + 0.04), 0, 0.03, g);
  for (const s of [-0.5, 0, 0.5]) box(0.03, h, 0.04, frame, s * w / 2, 0, 0.03, g); for (let k = 1; k < 4; k++) box(w, 0.03, 0.04, frame, 0, -h / 2 + k * h / 4, 0.03, g);
  const a2 = mesh(new THREE.TorusGeometry(w / 2 + 0.02, 0.04, 6, 20, PI), frame, 0, h / 2, 0.03, g); return g;
}
function benchWithBack(parent, x, z, ry, L = 2) { const b = bench(L); b.position.set(x, 0, z); b.rotation.y = ry; parent.add(b); return b; }
const SEAT_TOP = 0.485;   /* the top of the seat of bench() in props.js */
/* the spot on a bench where a person sits, facing away from its back */
const seatAt = (x, z, ry, along = 0) => [x + Math.cos(ry) * along + Math.sin(ry) * 0.04, z - Math.sin(ry) * along + Math.cos(ry) * 0.04];

/* ---------- the site by the Rio Cobre, shared by the station, the morning yard and the ruins ---------- */
function siteGround(g, kind) {
  const r = rng(kind === 'ruin' ? 9 : 4); const dry = kind === 'ruin' ? [70, 116, 50] : [96, 124, 58];
  groundPlane(g, T.grass([200, 200], dry));
  if (kind !== 'ruin') { const wide = kind === 'morn', yard = mesh(new THREE.PlaneGeometry(wide ? 62 : 46, 26), std(T.dirt(wide ? [8, 4] : [6, 4], [142, 104, 70]), 1), wide ? 7 : 0, 0.016, 4, g); yard.rotation.x = -PI / 2; }
  else { const path = mesh(new THREE.PlaneGeometry(3, 30), std(T.dirt([1, 6], [150, 120, 84]), 1), 2, 0.02, 4, g); path.rotation.x = -PI / 2; }
  /* the Rio Cobre, behind the station, and its banks */
  const wt = T.water([40, 3]).clone(); wt.needsUpdate = true; wt.repeat.set(40, 2);
  const river = mesh(new THREE.PlaneGeometry(500, 12), new THREE.MeshStandardMaterial({ map: wt, color: 0x9ab8b0, roughness: 0.25, metalness: 0.1 }), 0, 0.03, -30, g); river.rotation.x = -PI / 2; river.userData.noBatch = true; g.userData.river = wt;
  for (const z of [-23.6, -36.4]) { const bk = mesh(new THREE.PlaneGeometry(500, 1.4), std(T.dirt([60, 1], [110, 90, 66]), 1), 0, 0.026, z, g); bk.rotation.x = -PI / 2; }
  rockField(g, [-60, -24.8, 60, -23.2], 40, { seed: 3, size: 0.35 });
  /* the dam upstream: a concrete weir across the river, with white water falling over it */
  const dam = grp(g, -96, 0, -30); box(3, 2.2, 13, M.concOld, 0, 1.1, 0, dam); box(3.4, 0.3, 13.4, M.conc, 0, 2.3, 0, dam);
  const fg = new THREE.PlaneGeometry(3.0, 12.6); fg.rotateX(-PI / 2); fg.rotateZ(-Math.atan2(2.25, 2.0)); const foam = mesh(fg, new THREE.MeshStandardMaterial({ color: 0xdfeaea, transparent: true, opacity: 0.75, roughness: 0.3, depthWrite: false }), 2.5, 1.22, 0, dam);   /* white water sliding down the face of the weir */
  const pond = mesh(new THREE.PlaneGeometry(40, 12), new THREE.MeshStandardMaterial({ color: 0x3a6a72, roughness: 0.2 }), -21, 1.9, 0, dam); pond.rotation.x = -PI / 2;
  box(40, 1.9, 0.4, M.concOld, -21, 0.95, 6.2, dam); box(40, 1.9, 0.4, M.concOld, -21, 0.95, -6.2, dam); box(0.4, 1.9, 12.8, M.concOld, -41, 0.95, 0, dam);   /* the reservoir behind it, held in by banks */
  g.add(hillRing(200, 18, 70, { seed: kind === 'ruin' ? 6 : 5, base: [0.2, 0.4, 0.22] }));
  /* the far bank: hills close behind the river, covered in trees */
  for (let i = 0; i < 28; i++) { const o = (r() < 0.35 ? palm(6 + r() * 3, i) : r() < 0.6 ? mangoTree(6 + r() * 3, i) : tree(6 + r() * 4, i)); o.position.set(-90 + i * 6.5 + r() * 3, 0, -42 - r() * 18); o.scale.setScalar(0.9 + r() * 0.6); g.add(o); }
  bamboo(3).position.set(-30, 0, -21.8); g.add(g.children[g.children.length - 1]);
}
function pipeAndSaddles(g, kind) {   /* the Tube coming down from the dam, on concrete supports, and its last bend down into the turbine house */
  const rust = kind === 'ruin', mat = new THREE.MeshStandardMaterial({ map: TX.rivets([20, 3], [96, 82, 72], 0.5), roughness: 0.7, metalness: 0.25 });   /* tarred iron, worn brown, with a little rust at the seams */
  const xs = []; for (let x = -118; x <= -16; x += 6) xs.push(x);
  if (!rust) {
    tubePipe(g, [[-130, PY, PZ], [-40, PY, PZ], [-20, PY, PZ], [-14.6, PY + 0.25, PZ], [-11.6, PY - 0.05, PZ], [-9.2, PY - 0.55, PZ], [-6.9, PY - 0.7, PZ]], mat);
    for (const x of xs) { saddle(g, x, PZ); const st = cyl(PR + 0.03, PR + 0.03, 0.1, M.iron, x, PY, PZ, g, 40); st.rotation.z = PI / 2; for (const s of [-1, 1]) box(0.1, 0.32, 0.08, M.iron, x, PY - PR + 0.42, PZ + s * (PR * 0.86), g); }   /* an iron strap round the pipe at each support, bolted down to it */
    saddle(g, -12.3, PZ, 0, PY - PR + 0.25, 0.7);
    /* a collar where the pipe goes into the wall */
    const col = cyl(PR + 0.12, PR + 0.12, 0.25, M.iron, -7.05, PY - 0.7, PZ, g, 36); col.rotation.z = PI / 2;
    for (let x = -112; x <= -16; x += 12) { const f = cyl(PR + 0.05, PR + 0.05, 0.14, M.iron, x + 3, PY, PZ, g, 36); f.rotation.z = PI / 2; }   /* joint rings */
  } else {
    for (const x of xs) if (x > -70) ruinSupport(g, x, PZ, x);   /* the supports are still there in a row; the pipe is gone */
    /* a rusted half-shell of the pipe, lying on the ground */
    /* a long rusted half of one section of the pipe, 8 feet across, lying open side up in the grass; the plate is thick, with a flange ring at one end */
    const rm = new THREE.MeshStandardMaterial({ map: TX.rivets([4, 2.2], [78, 54, 42], 3), roughness: 0.95, metalness: 0.25, side: THREE.DoubleSide });
    const half = (len, arc, x, z, ry, roll, y) => { const geo = new THREE.CylinderGeometry(PR, PR, len, 36, 1, true, (PI - arc) / 2, arc); geo.rotateZ(-PI / 2); const sh = grp(g, x, y, z); sh.rotation.set(roll, ry, 0); mesh(geo, rm, 0, 0, 0, sh);
      const lip = new THREE.CylinderGeometry(PR + 0.035, PR + 0.035, len, 36, 1, true, (PI - arc) / 2, arc); lip.rotateZ(-PI / 2); mesh(lip, rm, 0, 0, 0, sh);   /* the thickness of the plate, seen at the cut edges */
      const fl = new THREE.TorusGeometry(PR + 0.03, 0.06, 6, 30, arc); fl.rotateZ(-PI / 2 - arc / 2); fl.rotateY(PI / 2); mesh(fl, rm, len / 2 - 0.05, 0, 0, sh);
      for (let i = 1; i < Math.floor(len / 2.4); i++) { const rb = new THREE.TorusGeometry(PR + 0.02, 0.035, 5, 30, arc); rb.rotateZ(-PI / 2 - arc / 2); rb.rotateY(PI / 2); mesh(rb, rm, -len / 2 + i * len / Math.floor(len / 2.4), 0, 0, sh); }   /* the seams where the plates were riveted together, ridged ribs round the pipe */
      return sh; };
    half(9.6, PI, -8.2, -1.2, 0.35, 0.0, PR - 0.1);   /* the big piece: a whole length of the pipe, split, lying open side up where you can walk up to it */
    half(3.4, PI * 0.7, -42, PZ + 0.2, -0.5, 1.0, PR - 0.03);   /* a smaller broken piece, tipped on its side against the old supports */
    half(5.2, PI * 0.8, -31, PZ + 3.6, 0.15, 0.1, PR - 0.1);
  }
}
function ruinSupport(g, x, z, seed) {   /* an old concrete support: a wide footing, a pedestal with a chipped, broken top, rusty rebar stubs sticking out, and moss at the foot */
  const r = rng(seed * 13 + 5), grp1 = grp(g, x, 0, z), cm = M.concOld, rust = solid(0x6a3a22, 0.9, 0.3), lean = (r() - 0.5) * 0.08;
  box(1.2, 0.22, 2.6, cm, 0, 0.11, 0, grp1); const ped = box(0.7, 0.9, 1.9, cm, 0, 0.67, 0, grp1); ped.rotation.z = lean;
  const top = PY - PR + 0.25, hh = top - 1.12 - (r() < 0.4 ? 0.35 : 0);
  const up = box(0.7, hh, 2.0, cm, 0, 1.12 + hh / 2, 0, grp1); up.rotation.z = lean;
  for (let i = 0; i < 3; i++) { const bk = box(0.3 + r() * 0.25, 0.18 + r() * 0.16, 0.5 + r() * 0.5, cm, (r() - 0.5) * 0.4, 1.12 + hh + 0.06, (r() - 0.5) * 1.3, grp1); bk.rotation.set(r() - 0.5, r() * 2, r() * 0.4); }   /* chipped, broken lumps at the top */
  for (const dz of [-0.7, -0.25, 0.25, 0.7]) { const rb = cyl(0.012, 0.012, 0.3 + r() * 0.35, rust, (r() - 0.5) * 0.4, 1.12 + hh + 0.22, dz, grp1, 5); rb.rotation.set((r() - 0.5) * 0.7, 0, (r() - 0.5) * 0.7); }   /* rebar stubs */
  for (const dz of [-0.8, 0.8]) { const rb = cyl(0.012, 0.012, 0.28, rust, 0.35, 0.34, dz, grp1, 5); rb.rotation.z = -0.6; }
  const moss = mesh(new THREE.CircleGeometry(0.9, 10), solid(0x3a5a2a, 1), 0, 0.235, 0, grp1); moss.rotation.x = -PI / 2; moss.scale.set(0.9, 1.4, 1);
  /* weathering: rain streaks down the faces, green moss creeping up the foot, a crack, a darker band where the formwork joined, and bevelled corners */
  const stain = solid(0x5e5a50, 1), mossy = solid(0x4a6a34, 1), top1 = 1.12 + hh;
  for (const sx of [-1, 1]) { for (let i = 0; i < 5; i++) { const w = 0.05 + r() * 0.1, h = 0.4 + r() * (top1 - 0.6); box(w, h, 0.012, stain, sx * 0.356, top1 - h / 2 - 0.05, (r() - 0.5) * 1.7, grp1).rotation.y = PI / 2;
      } for (let i = 0; i < 4; i++) { const w = 0.15 + r() * 0.3, h = 0.12 + r() * 0.3; box(0.014, h, w, mossy, sx * 0.357, 0.3 + h / 2, (r() - 0.5) * 1.7, grp1); } box(0.014, 0.05, 1.96, solid(0x66625a, 1), sx * 0.357, 1.12, 0, grp1); }
  for (const sz of [-1, 1]) for (let i = 0; i < 3; i++) { const w = 0.05 + r() * 0.1, h = 0.4 + r() * (top1 - 0.6); box(w, h, 0.014, stain, (r() - 0.5) * 0.5, top1 - h / 2 - 0.05, sz * 1.006, grp1); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const ch = box(0.05, top1 - 0.9, 0.05, cm, sx * 0.35, 0.9 + (top1 - 0.9) / 2, sz * 1.0, grp1); ch.rotation.y = PI / 4; }   /* the corner bevels */
  { const ck = box(0.016, 0.7, 0.03, solid(0x2e2c28, 1), 0.357, top1 - 0.55, 0.3, grp1); ck.rotation.x = 0.35; }
}
function turbineHouse(g, kind, P) {
  /* the brick house: 14 m by 10 m, walls 0.4 m thick and 6.5 m high, a door in the south wall. Inside: the turbine casing, the shaft, the spinning wheel,
     the generator and the switchboard. In the ruins, the walls are broken, there is no roof, and only the bases of the machines are left. */
  const ruin = kind === 'ruin', H = ruin ? 0 : 6.5, x0 = -7, x1 = 7, z0 = -15.5, z1 = -5.5, th = 0.4, bt = TX.brick([4, 3], [150, 74, 52], ruin ? 1 : 0), bm = std(bt, 0.9);
  const bw = (w, h, d, x, y, z) => { const t = bt.clone(); t.needsUpdate = true; t.repeat.set(Math.max(w, d) / 3.2, h / 2.4); return box(w, h, d, std(t, 0.9), x, y, z, g); };
  const walls = P.walls;
  if (!ruin) {
    bw(x1 - x0, H, th, 0, H / 2, z0); bw(th, H, z1 - z0, x0, H / 2, (z0 + z1) / 2); bw(th, H, z1 - z0, x1, H / 2, (z0 + z1) / 2);
    bw(5.8, H, th, -4.1, H / 2, z1); bw(5.8, H, th, 4.1, H / 2, z1); bw(2.4, H - 3.2, th, 0, 3.2 + (H - 3.2) / 2, z1);   /* the south wall, with the doorway (2.4 m wide, 3.2 m high) */
    box(14.6, 0.3, 0.6, M.conc, 0, H + 0.1, z0, g); box(14.6, 0.3, 0.6, M.conc, 0, H + 0.1, z1, g);
    /* the roof: two slopes of zinc, and a dark ceiling under them */
    const zt = T.zinc([150, 154, 150]).clone(); zt.needsUpdate = true; zt.repeat.set(6, 4); const rise = 2.2, half = (z1 - z0) / 2 + 0.6, Ls = Math.hypot(half, rise), a = Math.atan2(rise, half);
    for (const s of [-1, 1]) { const p = box(15.2, 0.1, Ls, std(zt, 0.7), 0, H + rise / 2 + 0.05, (z0 + z1) / 2 + s * half / 2, g); p.rotation.x = s * a; }
    for (const x of [x0, x1]) { const gab = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-(z1 - z0) / 2 - 0.2, 0), new THREE.Vector2((z1 - z0) / 2 + 0.2, 0), new THREE.Vector2(0, rise)])), bm, x, H, (z0 + z1) / 2, g); gab.rotation.y = PI / 2; gab.material = std(bt, 0.9, { side: THREE.DoubleSide }); }
    box(13.2, 0.05, 9.2, solid(0x2a2420, 0.95), 0, H - 0.03, (z0 + z1) / 2, g);   /* ceiling */
    for (const x of [-4.5, -1.5, 1.5, 4.5]) box(0.18, 0.3, 9.4, M.iron, x, H - 0.2, (z0 + z1) / 2, g);   /* iron roof trusses */
    const fl = mesh(new THREE.PlaneGeometry(13.2, 9.2), std(TX.tiles([11, 7.7]), 0.7), 0, 0.02, (z0 + z1) / 2, g); fl.rotation.x = -PI / 2;   /* a clean floor of quarry tiles */
    /* a dado of cream glazed brick round the inside, 1.5 m high, with a green band on top (cut round the doorway) */
    const dado = (w, x, z, ry) => { const t = TX.glazed([w / 2.6, 1]).clone(); t.needsUpdate = true; t.repeat.set(w / 2.6, 1); const d = plane(w, 1.5, std(t, 0.35), x, 0.77, z, g); d.rotation.y = ry; };
    dado(13.2, 0, z0 + th / 2 + 0.012, 0); dado(9.2, x0 + th / 2 + 0.012, (z0 + z1) / 2, PI / 2); dado(9.2, x1 - th / 2 - 0.012, (z0 + z1) / 2, -PI / 2); dado(5.4, -3.95, z1 - th / 2 - 0.012, PI); dado(5.4, 3.95, z1 - th / 2 - 0.012, PI);
    box(13.2, 0.12, 0.12, M.woodDark, 0, 0.06, z0 + th / 2 + 0.06, g); box(0.12, 0.12, 9.2, M.woodDark, x0 + th / 2 + 0.06, 0.06, (z0 + z1) / 2, g);   /* skirting */
    /* tall arched windows, glowing at night (their glass material is P.glass, dimmed when the valve is shut) */
    for (const x of [-4.5, 4.5]) { wallWindow(g, 1.3, 2.6, x, 2.9, z1 + th / 2 + 0.01, 0, P.glass); wallWindow(g, 1.3, 2.6, x, 2.9, z1 - th / 2 - 0.01, PI, P.glassIn); }
    for (const z of [-12.5, -8.5]) { wallWindow(g, 1.3, 2.6, x1 + th / 2 + 0.01, 2.9, z, PI / 2, P.glass); wallWindow(g, 1.3, 2.6, x0 - th / 2 - 0.01, 3.4, z, -PI / 2, P.glass); }
    for (const x of [-3.5, 0, 3.5]) wallWindow(g, 1.3, 2.6, x, 3.2, z0 - th / 2 - 0.01, PI, P.glass);
    /* the door frame and an open door, and a sign over it */
    box(0.14, 3.2, 0.5, M.woodDark, -1.25, 1.6, z1, g); box(0.14, 3.2, 0.5, M.woodDark, 1.25, 1.6, z1, g); box(2.64, 0.18, 0.5, M.woodDark, 0, 3.25, z1, g);
    const door = box(1.15, 3.0, 0.07, solid(0x3a4a3a, 0.9), -1.25 - 0.36 * 0.6, 1.52, z1 + th / 2 + 0.93 * 0.6, g); door.rotation.y = -1.94;   /* the door, swung open against the wall */
    const sg = mesh(new THREE.PlaneGeometry(3.4, 0.62), std(signTex([['TURBINE HOUSE', '700 58px Georgia, serif']], 512, 96), 0.8), 0, 4.1, z1 + th / 2 + 0.03, g);
    walls.push([x0 - 0.3, z0 - 0.3, x1 + 0.3, z0 + 0.3], [x0 - 0.3, z0, x0 + 0.3, z1], [x1 - 0.3, z0, x1 + 0.3, z1], [x0 - 0.3, z1 - 0.3, -1.25, z1 + 0.3], [1.25, z1 - 0.3, x1 + 0.3, z1 + 0.3], [-1.9, z1, -1.15, z1 + 1.0]);
    /* ----- the machines. The water comes in through the west wall into a spiral casing (the turbine), which turns a shaft; the shaft turns the big wheel and the generator. ----- */
    const mg = grp(g); const green = solid(0x2a4a3a, 0.55, 0.3), cream = solid(0xd8ccae, 0.6), MZ = PZ, SY = 1.6;
    tubePipe(mg, [[-6.8, PY - 0.7, MZ], [-6.0, PY - 0.68, MZ], [-5.2, SY - 0.1, MZ], [-4.3, SY, MZ]], new THREE.MeshStandardMaterial({ map: TX.rivets([4, 2], [40, 70, 56]), roughness: 0.55, metalness: 0.3 }), 0.62, 16);   /* the pipe's end, narrowing inside the wall and rising to the turbine */
    const casing = cyl(1.25, 1.25, 1.0, green, -3.6, SY, MZ, mg, 40); casing.rotation.z = PI / 2; for (const dx of [0.5, -0.5]) { const ring = mesh(new THREE.TorusGeometry(1.25, 0.08, 8, 40), M.iron, -3.6 + dx, SY, MZ, mg); ring.rotation.y = PI / 2; }
    for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2, bolt = cyl(0.04, 0.04, 0.08, M.brass, -3.05, SY + Math.sin(a) * 1.17, MZ + Math.cos(a) * 1.17, mg, 6); bolt.rotation.z = PI / 2; }
    box(1.6, 0.42, 2.8, M.conc, -3.6, 0.21, MZ, mg);   /* its bed */
    const shaft = cyl(0.11, 0.11, 6.6, M.steel, 0, SY, MZ, mg, 14); shaft.rotation.z = PI / 2;
    for (const x of [-1.9, 1.3, 4.3]) { box(0.5, 1.3, 0.6, green, x, 0.65, MZ, mg); box(0.66, 0.2, 0.7, M.iron, x, 1.42, MZ, mg); }   /* bearings on pedestals */
    /* the spinning wheel: a flywheel with eight spokes, painted green; it turns (P.spin) and a pale mark on its rim shows it */
    const fw = grp(g, -0.3, SY, MZ); fw.userData.noBatch = true; const rimM = solid(0x2f5a44, 0.5, 0.35);
    const rim = mesh(new THREE.TorusGeometry(1.42, 0.12, 10, 48), rimM, 0, 0, 0, fw); rim.rotation.y = PI / 2; rim.scale.set(1, 1, 1.6);
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2, sp = cyl(0.05, 0.08, 1.36, rimM, 0, Math.sin(a) * 0.7, Math.cos(a) * 0.7, fw, 8); sp.rotation.x = PI / 2 - a; }
    const hub = cyl(0.3, 0.3, 0.4, M.iron, 0, 0, 0, fw, 20); hub.rotation.z = PI / 2; box(0.4, 0.16, 0.06, cream, 0, 1.4, 0, fw);
    box(1.2, 0.08, 0.14, M.iron, -0.3, 0.04, MZ - 1.75, g); box(1.2, 0.08, 0.14, M.iron, -0.3, 0.04, MZ + 1.75, g);   /* iron kerbs either side of it on the floor */
    /* the generator: a big drum with copper bands, on a cast frame */
    const gen = cyl(1.0, 1.0, 1.6, cream, 2.6, SY, MZ, mg, 32); gen.rotation.z = PI / 2; for (const dx of [-0.6, 0, 0.6]) { const b = cyl(1.03, 1.03, 0.12, M.copper, 2.6 + dx, SY, MZ, mg, 32); b.rotation.z = PI / 2; }
    box(1.9, 0.66, 2.2, green, 2.6, 0.33, MZ, mg); const cap = cyl(0.45, 0.45, 0.2, M.brass, 3.5, SY, MZ, mg, 20); cap.rotation.z = PI / 2;
    for (const dz of [-0.4, 0.4]) cyl(0.04, 0.04, 3.4, M.iron, 3.0, 4.0, MZ + dz, mg, 6);   /* cables up from the generator, along the roof truss, to the switchboard */
    box(0.08, 0.08, 2.4, M.iron, 3.0, 5.7, MZ + 1.2, mg); box(3.7, 0.08, 0.08, M.iron, 4.85, 5.7, MZ + 2.4, mg); box(0.08, 2.4, 0.08, M.iron, x1 - th / 2 - 0.06, 4.5, MZ + 2.4, mg);
    /* the switchboard: four marble panels on the east wall, with dials and knife switches, an iron rail in front */
    const sbw = 4.4, sbh = 2.2, sx = x1 - th / 2 - 0.08; mesh(new THREE.PlaneGeometry(sbw, sbh), std(TX.marble(), 0.5), sx, 2.1, -9.6, g).rotation.y = -PI / 2;
    box(0.1, sbh + 0.2, sbw + 0.2, M.woodDark, x1 - th / 2 - 0.02, 2.1, -9.6, g);
    box(0.14, 0.95, sbw + 0.2, solid(0x2a2c2e, 0.5), x1 - th / 2 - 0.05, 0.5, -9.6, g);   /* a slate base under the marble */
    { const U = (u) => -9.6 + (u / 1024 - 0.5) * sbw, Vy = (v) => 2.1 + (0.5 - v / 512) * sbh, k = sbh / 512;   /* brass bezels round the drawn dials, and real knife switches standing out from the panel */
      for (let p4 = 0; p4 < 4; p4++) { const cx = p4 * 256 + 128;
        for (const [dy, rr] of [[96, 58], [230, 44]]) { const b = mesh(new THREE.TorusGeometry((rr + 8) * k, 0.018, 6, 28), M.brass, sx - 0.02, Vy(dy), U(cx), g); b.rotation.y = PI / 2; const gl = mesh(new THREE.CircleGeometry((rr + 7) * k, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.2 }), sx - 0.03, Vy(dy), U(cx), g); gl.rotation.y = -PI / 2; }
        for (const sdu of [-30, 0, 30]) { const z = U(cx + sdu), sw = grp(g, sx - 0.02, Vy(335), z); box(0.05, 0.03, 0.03, M.copper, -0.02, 0, 0, sw); const blade = box(0.012, 0.2, 0.025, M.copper, -0.05, 0.09, 0, sw); blade.rotation.z = -0.35; const hd = cyl(0.014, 0.014, 0.08, M.woodDark, -0.085, 0.19, 0, sw, 6); hd.rotation.z = PI / 2; }
        for (const sdu of [-36, 36]) { const kb = cyl(0.03, 0.03, 0.05, solid(0x1a1814, 0.4), sx - 0.025, Vy(420), U(cx + sdu), g, 12); kb.rotation.z = PI / 2; } } }
    for (const z of [-11.2, -9.6, -8.0]) { const lv = box(0.18, 0.05, 0.05, M.copper, x1 - th / 2 - 0.15, 1.6, z, g); }
    for (const z of [-11.9, -7.3]) cyl(0.03, 0.03, 1.0, M.brass, x1 - 1.2, 0.5, z, g, 8); box(0.05, 0.05, 4.6, M.brass, x1 - 1.2, 1.0, -9.6, g);
    mesh(new THREE.PlaneGeometry(1.4, 0.3), std(signTex([['SWITCHBOARD', '700 52px Georgia, serif']], 512, 96, '#2a2014', '#e8d8a8'), 0.8), x1 - th / 2 - 0.05, 3.45, -9.6, g).rotation.y = -PI / 2;
    /* lamps: bulbs on flexes, glowing (P.bulb), and two lights inside */
    for (const [x, z] of [[-4, -8], [0, -8], [4, -8], [-4, -13], [0, -13], [4, -13]]) bulb(g, x, H - 0.05, z, P.bulb, 1.4);
    walls.push([-6.8, PZ - 1.8, 4.7, PZ + 1.8], [x1 - 1.3, -12.2, x1 - 0.2, -7.0]);
    P.spin = fw;
    hallFittings(g, P, { x0, x1, z0, z1, th, H, MZ, SY, green, cream });
  } else {
    /* broken walls: uneven heights, no roof, a gap where the door was, brick rubble and trees growing inside */
    const r = rng(41), segs = [], seg = (xa, za, xb, zb, hs) => { const n = hs.length, dx = (xb - xa) / n, dz = (zb - za) / n; for (let i = 0; i < n; i++) { const h = hs[i]; if (h <= 0) continue; const along = Math.hypot(dx, dz), w = Math.abs(dx) > 0.01 ? along : th, d = Math.abs(dz) > 0.01 ? along : th; bw(w, h, d, xa + dx * (i + 0.5), h / 2, za + dz * (i + 0.5)); segs.push([xa + dx * (i + 0.5), za + dz * (i + 0.5), along, h, Math.abs(dx) > 0.01]); } };
    /* the north and west walls stand almost to their full height: one slab each with arched window openings cut through and a broken, stepped top edge */
    const brickT = bt.clone(); brickT.needsUpdate = true; brickT.repeat.set(1 / 3.2, 1 / 2.4); const brickM = std(brickT, 0.92, { side: THREE.DoubleSide });
    const slab = (len, cols, wins, x, z, ry) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(len, 0); for (let i = cols.length - 1; i >= 0; i--) { const u1 = (i + 1) * len / cols.length, u0 = i * len / cols.length, jit = (r() - 0.5) * 0.3; sh.lineTo(u1, cols[i] + jit); sh.lineTo(u0, cols[i] + jit); } sh.lineTo(0, 0);
      for (const u of wins) { const hp = new THREE.Path(), hw = 0.65, y0 = 1.6, y1 = 4.2; hp.moveTo(u - hw, y0); hp.lineTo(u + hw, y0); hp.lineTo(u + hw, y1); hp.absarc(u, y1, hw, 0, PI, false); hp.lineTo(u - hw, y0); sh.holes.push(hp); }
      const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false }); const m = mesh(geo, brickM, x, 0, z, g); m.rotation.y = ry; return m; };
    slab(x1 - x0, [3.2, 4.4, 5.8, 6.4, 6.5, 6.5, 6.5, 6.4, 6.5, 6.5, 6.5, 5.9, 4.8, 3.0], [3.5, 7, 10.5], x0, z0 - th / 2, 0);
    slab(z1 - z0, [1.5, 2.6, 5.6, 6.5, 7.4, 8.4, 7.6, 6.5, 5.4, 3.0], [3.0, 7.0], x0 + th / 2, z0, -PI / 2);   /* turned -90 degrees, the slab runs from z0 toward z1 and its thickness goes toward -x, so it is centred on x0 like the wall's collision box */
    for (const [cx, cz, al, h, ax] of [[-4, z0, 3, 6, true], [3, z0, 3, 6, true], [x0, -12.5, 3, 5.5, false], [x0, -8.5, 3, 7, false]]) segs.push([cx, cz, al, h, ax]);
    seg(x1, z0, x1, z1, [2.8, 3.9, 2.2, 0.0, 1.0]);
    seg(x0, z1, -1.4, z1, [1.8, 2.6, 1.2]); seg(1.4, z1, x1, z1, [0.9, 2.2, 3.0]);
    walls.push([x0 - 0.3, z0 - 0.3, x1 + 0.3, z0 + 0.3], [x0 - 0.3, z0, x0 + 0.3, z1], [x1 - 0.3, z0, 7.3, -9.5], [x1 - 0.3, -7.5, x1 + 0.3, z1], [x0 - 0.3, z1 - 0.3, -1.4, z1 + 0.3], [1.4, z1 - 0.3, x1 + 0.3, z1 + 0.3]);
    for (const [x, z, h] of [[-3.6, -10.6, 0.5], [2.6, -10.6, 0.55]]) { box(2.0, h, 2.6, M.concOld, x, h / 2, z, g); for (const dx of [-0.6, 0.6]) for (const dz of [-0.9, 0.9]) cyl(0.04, 0.04, 0.12, solid(0x5a3a28, 0.9), x + dx, h + 0.06, z + dz, g, 6); }   /* the machine beds, with their old bolts */
    walls.push([-4.7, -12, -2.5, -9.2], [1.5, -12, 3.7, -9.2]);
    for (let i = 0; i < 18; i++) { const b = box(0.24, 0.08 + r() * 0.06, 0.12, std(bt, 0.9), (r() - 0.5) * 12, 0.05, -10.5 + (r() - 0.5) * 8, g); b.rotation.y = r() * 3; }   /* loose bricks */
    /* creepers climbing the old walls, inside and out, and heaps of fallen brick at their feet */
    const vm = new THREE.MeshStandardMaterial({ map: TX.vine(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1 });
    segs.forEach(([cx, cz, along, h, alongX], i) => { if (h < 1.2) return; for (const side of [-1, 1]) { if (r() < 0.3) continue; const vh = h * (0.5 + r() * 0.45), vw = along * (0.6 + r() * 0.35), off = side * (th / 2 + 0.015);
      const v = plane(vw, vh, vm, alongX ? cx + (r() - 0.5) * (along - vw) : cx + off, vh / 2, alongX ? cz + off : cz + (r() - 0.5) * (along - vw), g); v.rotation.y = alongX ? 0 : PI / 2; } });
    const heap = new THREE.DodecahedronGeometry(1, 1); for (const [x, z, sx, sz] of [[-6.0, -13.2, 1.2, 0.9], [6.1, -8.6, 1.0, 1.4], [-6.0, -9.2, 0.8, 0.9], [2.5, -15.0, 1.6, 0.7]]) { const hp = mesh(heap, std(bt, 1), x, 0, z, g); hp.scale.set(sx, 0.35, sz); walls.push([x - sx * 0.8, z - sz * 0.8, x + sx * 0.8, z + sz * 0.8]); }
    for (const [x, z, s2] of [[-2.0, -13.6, 0.8], [4.6, -7.0, 0.7], [-5.6, -10.6, 0.9], [0.4, -14.4, 0.6]]) { const b = bush(x * 7 | 0, s2); b.position.set(x, 0, z); g.add(b); }
    for (const [x, z, k] of [[-5.2, -7.0, 0], [5.0, -13.6, 1]]) { const t = k ? tree(6, 9) : mangoTree(5, 4); t.position.set(x, 0, z); g.add(t); walls.push([x - 0.5, z - 0.5, x + 0.5, z + 0.5]); }
  }
}
/* the rest of an engine room of about 1900: a travelling crane on runway beams, the turbine's governor, the generator's exciter and terminal box,
   a workbench with a vice and oil cans, a clock, fire buckets, the engineer's desk with the log book. A general picture, not a record of this station. */
function hallFittings(g, P, { x0, x1, z0, z1, th, H, MZ, SY, green, cream }) {
  const wn = z0 + th / 2, ws = z1 - th / 2, ww = x0 + th / 2, we = x1 - th / 2, walls = P.walls, crane = solid(0x6a5a2a, 0.6, 0.3);
  /* the crane: two runway beams along the long walls on brackets, a girder across them on end carriages, a crab with its chain and hook */
  for (const z of [wn + 0.13, ws - 0.13]) { box(x1 - x0 - th - 0.02, 0.26, 0.24, M.iron, 0, 5.0, z, g); box(x1 - x0 - th - 0.02, 0.04, 0.06, M.steel, 0, 5.15, z, g); for (let x = -5.5; x <= 5.5; x += 2.75) { box(0.12, 0.5, 0.24, M.iron, x, 4.62, z, g); } }
  const cx = -2.2; box(0.4, 0.5, ws - wn - 0.3, crane, cx, 5.44, (wn + ws) / 2, g); for (const z of [wn + 0.13, ws - 0.13]) { box(0.9, 0.3, 0.32, crane, cx, 5.32, z, g); for (const dx of [-0.3, 0.3]) { const w = cyl(0.09, 0.09, 0.06, M.iron, cx + dx, 5.25, z, g, 12); w.rotation.x = PI / 2; } }
  box(0.8, 0.3, 0.7, crane, cx, 5.84, MZ - 0.2, g); box(0.5, 0.12, 0.5, M.iron, cx, 5.63, MZ - 0.2, g); cyl(0.02, 0.02, 1.7, M.iron, cx, 4.73, MZ - 0.2, g, 5);
  box(0.22, 0.28, 0.14, solid(0xc8a020, 0.6), cx, 3.75, MZ - 0.2, g); const hook = mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12, PI * 1.4), M.iron, cx, 3.54, MZ - 0.2, g); hook.rotation.z = PI * 0.8;
  /* the turbine's governor: a column with spinning balls, behind the casing, and the gate rod to the turbine */
  const gx = -3.6, gz = MZ - 2.0; box(0.6, 0.12, 0.6, M.conc, gx, 0.06, gz, g); cyl(0.12, 0.16, 1.5, green, gx, 0.87, gz, g, 12); cyl(0.2, 0.2, 0.18, M.iron, gx, 1.7, gz, g, 14); cyl(0.025, 0.025, 0.5, M.steel, gx, 2.04, gz, g, 6);
  for (const s of [-1, 1]) { const arm = cyl(0.012, 0.012, 0.3, M.steel, gx + s * 0.1, 2.08, gz, g, 4); arm.rotation.z = s * 0.7; mesh(new THREE.SphereGeometry(0.07, 10, 8), M.brass, gx + s * 0.2, 2.0, gz, g); }
  const rod = cyl(0.025, 0.025, 1.0, M.steel, gx, 1.5, gz + 0.62, g, 6); rod.rotation.x = PI / 2; walls.push([gx - 0.45, gz - 0.45, gx + 0.45, gz + 0.45]);
  /* the exciter on the end of the generator shaft, and a terminal box with a brass name plate */
  const ex = cyl(0.34, 0.34, 0.36, cream, 3.78, SY, MZ, g, 24); ex.rotation.z = PI / 2; for (const dx of [-0.13, 0.13]) { const b = cyl(0.36, 0.36, 0.05, M.copper, 3.78 + dx, SY, MZ, g, 24); b.rotation.z = PI / 2; }
  box(0.6, 0.3, 0.45, green, 2.6, SY + 1.12, MZ, g); box(0.44, 0.18, 0.02, M.brass, 2.9, SY - 0.2, MZ + 1.0, g);
  for (const dz of [-1, 1]) box(1.5, 0.12, 0.12, M.iron, 2.6, 0.72, MZ + dz * 1.05, g);   /* holding-down rails */
  /* the workbench along the north wall: top, legs, a vice, oil cans, a tool board on the wall above */
  const bx = 1.75, bz = wn + 0.45; box(2.6, 0.08, 0.7, M.wood, bx, 0.9, bz, g); for (const dx of [-1.2, 1.2]) for (const dz of [-0.28, 0.28]) box(0.08, 0.86, 0.08, M.woodDark, bx + dx, 0.43, bz + dz, g); box(2.5, 0.04, 0.6, M.woodDark, bx, 0.25, bz, g);
  box(0.2, 0.16, 0.14, M.ironPaint, bx - 0.9, 1.02, bz + 0.25, g); cyl(0.012, 0.012, 0.3, M.steel, bx - 0.9, 1.06, bz + 0.38, g, 5).rotation.z = PI / 2;
  for (const [dx, h] of [[0.3, 0.22], [0.55, 0.16]]) { cyl(0.07, 0.08, h, solid(0x7a2a20, 0.5, 0.4), bx + dx, 0.94 + h / 2, bz, g, 12); const sp = cyl(0.008, 0.016, 0.22, solid(0x7a2a20, 0.5, 0.4), bx + dx + 0.08, 0.94 + h + 0.06, bz, g, 6); sp.rotation.z = -0.9; }
  box(1.8, 0.9, 0.04, M.woodDark, bx, 1.75, wn + 0.03, g); for (let i = 0; i < 6; i++) { const t = box(0.04, 0.35 + (i % 3) * 0.1, 0.03, M.steel, bx - 0.7 + i * 0.28, 1.75, wn + 0.07, g); t.rotation.z = (i % 2 ? 0.15 : -0.1); }
  walls.push([bx - 1.4, wn, bx + 1.4, bz + 0.45]);
  /* the engineer's desk in the south-west corner, with the station log open on it and a stool */
  const dxx = ww + 0.5, dz = ws - 1.4; box(0.8, 0.06, 1.4, M.wood, dxx, 0.98, dz, g); box(0.76, 0.95, 0.06, M.woodDark, dxx, 0.475, dz - 0.66, g); box(0.76, 0.95, 0.06, M.woodDark, dxx, 0.475, dz + 0.66, g); box(0.05, 0.95, 1.3, M.woodDark, dxx - 0.37, 0.475, dz, g);
  const book = grp(g, dxx, 1.02, dz); box(0.3, 0.02, 0.42, solid(0x3a2a20, 0.8), 0, 0, 0, book); for (const s of [-1, 1]) { const pg = box(0.14, 0.008, 0.4, M.white, s * 0.075, 0.014, 0, book); pg.rotation.z = -s * 0.05; }
  cyl(0.18, 0.15, 0.04, M.wood, dxx + 0.75, 0.64, dz, g, 12); for (let i = 0; i < 3; i++) { const a = i / 3 * PI * 2, l = cyl(0.02, 0.025, 0.62, M.woodDark, dxx + 0.75 + Math.cos(a) * 0.12, 0.31, dz + Math.sin(a) * 0.12, g, 5); l.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); }
  walls.push([ww, dz - 0.8, dxx + 1.0, dz + 0.8]);
  /* a clock on the south wall, between the windows, and a rack of red fire buckets by the door */
  const ck = mesh(new THREE.CircleGeometry(0.26, 24), std(T.clock(), 0.5), 2.4, 3.3, ws - 0.04, g); ck.rotation.y = PI; const cr = mesh(new THREE.TorusGeometry(0.27, 0.03, 6, 24), M.woodDark, 2.4, 3.3, ws - 0.04, g);
  box(1.3, 0.1, 0.12, M.woodDark, -2.6, 1.32, ws - 0.07, g); for (let i = 0; i < 3; i++) { const bk = grp(g, -3.0 + i * 0.4, 0.9, ws - 0.2); cyl(0.13, 0.1, 0.24, solid(0xa8281e, 0.6), 0, 0.12, 0, bk, 12); const hd = mesh(new THREE.TorusGeometry(0.13, 0.01, 4, 10, PI), M.iron, 0, 0.24, 0, bk); cyl(0.008, 0.008, 0.2, M.iron, 0, 0.33, 0, bk, 4); }
  mesh(new THREE.PlaneGeometry(0.5, 0.14), std(signTex([['FIRE', '700 64px Georgia, serif']], 256, 72, '#a8281e', '#f2ecd8'), 0.7), -2.6, 1.5, ws - 0.03, g).rotation.y = PI;
}
function valveStand(g, P, kind) {   /* the valve wheel on its stand by the Tube (a general picture: the record does not say where the valve was) */
  const x = -17, z = -8.55, s = grp(g, x, 0, z);
  box(0.9, 0.12, 0.9, M.conc, 0, 0.06, 0, s); box(0.42, 1.05, 0.42, M.ironPaint, 0, 0.62, 0, s); box(0.56, 0.1, 0.56, M.ironPaint, 0, 1.16, 0, s);
  const spindle = cyl(0.04, 0.04, 0.55, M.steel || M.iron, 0, 1.36, 0.0, s, 8); spindle.rotation.x = PI / 2; spindle.position.z = 0.1;
  const boss = cyl(0.1, 0.12, 0.2, M.ironPaint, 0, 1.36, -0.15, s, 12); boss.rotation.x = PI / 2;
  const rod = cyl(0.045, 0.045, 1.5, M.iron, 0, 1.36, -0.9, s, 8); rod.rotation.x = PI / 2;   /* the rod to the valve on the pipe */
  const vb = grp(g, x, 0, PZ + PR + 0.1); const vbody = cyl(0.36, 0.36, 0.55, M.ironPaint, 0, 1.36, 0, vb, 18); vbody.rotation.x = PI / 2; for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; cyl(0.03, 0.03, 0.06, M.brass, Math.cos(a) * 0.3, 1.36 + Math.sin(a) * 0.3, 0.29, vb, 6).rotation.x = PI / 2; }
  box(0.2, 0.9, 0.3, M.ironPaint, 0, 0.45, 0.05, vb);
  const plate = mesh(new THREE.PlaneGeometry(0.34, 0.14), std(signTex([['OPEN  SHUT', '700 50px Georgia, serif']], 256, 96, '#c29a45', '#2a1d05'), 0.4, { metalness: 0.5 }), 0, 0.9, 0.215, s);
  const wheel = handWheel(0.5, 6); wheel.position.set(x, 1.36, z + 0.42); wheel.userData.noBatch = true; g.add(wheel); P.valve = wheel;
  P.walls.push([x - 0.5, z - 0.5, x + 0.5, z + 0.75], [x - 0.42, PZ + PR - 0.2, x + 0.42, z - 0.3]);
  P.spots.valve = [x, z + 1.45];
  if (kind === 'eve') { const lp = grp(g, x + 1.25, 0, z + 0.2); cyl(0.05, 0.07, 2.2, M.woodDark, 0, 1.1, 0, lp, 8); box(0.42, 0.05, 0.05, M.woodDark, 0.18, 2.12, 0, lp); const ln = lantern(); ln.position.set(0.36, 1.72, 0); lp.add(ln); cyl(0.006, 0.006, 0.12, M.iron, 0.36, 2.04, 0, lp, 4); P.flames.push(ln.userData.flame); P.walls.push([x + 1.05, z + 0.0, x + 1.45, z + 0.4]); }
}
function noticeBoard(g, P) {   /* the notice board by the turbine house door */
  const x = 3.8, z = -3.9, b = grp(g, x, 0, z); for (const s of [-1, 1]) cyl(0.06, 0.07, 2.3, M.woodDark, s * 0.92, 1.15, -0.06, b, 8);
  box(2.0, 1.4, 0.07, M.woodDark, 0, 1.55, -0.06, b); const face = mesh(new THREE.PlaneGeometry(1.86, 1.28), new THREE.MeshStandardMaterial({ map: noticeTex(false), roughness: 0.85 }), 0, 1.55, -0.02, b); face.userData.noBatch = true;
  const roof = box(2.3, 0.06, 0.42, M.woodDark, 0, 2.32, 0.02, b); roof.rotation.x = -0.2; box(2.2, 0.08, 0.1, M.woodDark, 0, 2.28, -0.08, b);
  P.notice = face; P.walls.push([x - 1.05, z - 0.25, x + 1.05, z + 0.15]); P.spots.notice = [x, z + 1.3];
}
function superHouse(g, P, kind) {   /* the superintendent's house: wooden, with a veranda facing the yard */
  const h = boardHouse(8, 6, 3.0, { wall: [214, 200, 170], roof: [140, 96, 76], seed: 5 }); h.position.set(16.2, 0, 4.5); h.rotation.y = -PI / 2; g.add(h);
  P.walls.push([12.9, 0.2, 19.6, 8.8], [11.0, 0.1, 13.0, 8.9]);
}
function yardBits(g, P, kind) {
  /* the fence and gate at the road, the east fence, lamps on posts, and the siding beyond the east fence */
  const XE = kind === 'morn' ? 36 : 22;   /* in the morning the fence takes in the siding, so the special train stands inside it */
  fence(g, -22, 17, -2.2, 17, { h: 1.2 }); fence(g, 2.2, 17, XE, 17, { h: 1.2 }); fence(g, XE, kind === 'morn' ? -24 : -6, XE, 17, { h: 1.2 }); fence(g, -22, -6, -22, 17, { h: 1.2 });
  for (const s of [-1, 1]) { box(0.3, 1.8, 0.3, M.woodDark, s * 2.3, 0.9, 17, g); const gt = grp(g, s * 2.15, 0, 17); for (const y of [0.35, 0.95]) box(1.9, 0.1, 0.06, M.wood, -s * 0.95, y, 0, gt).position.x = -s * 0; gt.rotation.y = s * 1.25; gt.children.forEach((c) => { c.position.x = -s * 0.98; }); box(0.08, 1.0, 0.06, M.wood, -s * 1.9, 0.65, 0, gt); }
  const road = mesh(new THREE.PlaneGeometry(120, 6), std(T.dirt([24, 1], [150, 110, 76]), 1), 0, 0.02, 21, g); road.rotation.x = -PI / 2;
  const tr = rails(110); tr.rotation.y = PI / 2; tr.position.set(28, 0, 0); g.add(tr); if (kind === 'morn') P.walls.push([22.6, -4.2, 25.9, 12.2], [26.0, -40, 30, 60]); else P.walls.push([22, -40, 40, 60]);
  const plat = box(3.0, 0.9, 16, M.conc, 24.2, 0.45, 4, g);   /* a low platform beside the siding */
  for (const [x, z] of [[-6, -2.6], [8, -2.4], [-13, 6], [6, 11], [-8, 14.5], [10.5, 14.5]]) { const lp = grp(g, x, 0, z); cyl(0.12, 0.15, 0.4, M.iron, 0, 0.2, 0, lp, 10); cyl(0.05, 0.08, 3.0, M.iron, 0, 1.9, 0, lp, 8); box(0.56, 0.04, 0.04, M.iron, 0, 3.0, 0, lp);   /* an iron lamp post with a ladder bar */
    cyl(0.12, 0.08, 0.1, M.iron, 0, 3.43, 0, lp, 4).rotation.y = PI / 4; const gl = cyl(0.19, 0.13, 0.4, kind === 'eve' ? P.lampGlass : solid(0x8a9098, 0.15, 0.3), 0, 3.68, 0, lp, 4); gl.rotation.y = PI / 4;
    for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; const bar = box(0.025, 0.42, 0.025, M.iron, Math.cos(a) * 0.16, 3.68, Math.sin(a) * 0.16, lp); bar.rotation.z = Math.cos(a) * 0.15; bar.rotation.x = -Math.sin(a) * 0.15; }
    cyl(0.04, 0.27, 0.16, M.iron, 0, 3.96, 0, lp, 4).rotation.y = PI / 4; cyl(0.02, 0.02, 0.12, M.iron, 0, 4.1, 0, lp, 6); P.walls.push([x - 0.2, z - 0.2, x + 0.2, z + 0.2]); }
  /* tools and things of the gang: buckets, shovels leaning on the pipe, a cart, barrels, crates */
  for (const [x, z, k] of [[-20, -8.6, 'b'], [-19.3, -8.4, 'b'], [-25, -8.8, 'c'], [-9, 2, 'c'], [-8.4, 2.6, 'r'], [6.6, -3.0, 'r']]) { const o = k === 'b' ? bucket() : k === 'c' ? crate(0.7) : barrel(); o.position.set(x, 0, z); o.rotation.y = x; g.add(o); P.walls.push([x - 0.45, z - 0.45, x + 0.45, z + 0.45]); }
  for (let i = 0; i < 4; i++) { const sh = grp(g, -22.6 + i * 0.32, 0, PZ + PR + 0.05); const hd = cyl(0.02, 0.02, 1.25, M.wood, 0, 0.75, 0, sh, 6); box(0.24, 0.3, 0.02, M.iron, 0, 0.12, 0, sh); sh.rotation.x = -0.08; sh.position.z = PZ + PR + 0.16; }
  /* stores in the yard: a stack of spare timber, a coil of rope on it, and two spare curved plates for the pipe, propped on blocks */
  { const t = grp(g, 15.4, 0, 13.2); t.rotation.y = 0.2; for (let k = 0; k < 4; k++) for (let i = 0; i < 5 - k; i++) box(2.6, 0.16, 0.24, M.wood, 0, 0.08 + k * 0.17, (i - (4 - k) / 2) * 0.26, t); const coil = mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 16), solid(0xb8a070, 1), 0.6, 0.76, 0, t); coil.rotation.x = PI / 2; P.walls.push([13.8, 12.1, 17.0, 14.3]); }
  { const pm = new THREE.MeshStandardMaterial({ map: TX.rivets([1, 1], [96, 82, 72], 0.5), roughness: 0.7, metalness: 0.25, side: THREE.DoubleSide }); for (const [x, z] of [[-15.2, 10.6], [-15.2, 12.0]]) { const geo = new THREE.CylinderGeometry(PR, PR, 1.2, 16, 1, true, -0.5, 1.0); geo.rotateX(PI / 2); geo.translate(0, PR + 0.02, 0); mesh(geo, pm, x, 0.14, z, g); for (const dx of [-0.45, 0.45]) box(0.2, 0.16, 1.1, M.woodDark, x + dx, 0.08, z, g); } P.walls.push([-16.2, 9.8, -14.2, 12.8]); }
  /* the manhole on top of the pipe, its lid open, and a ladder up to it */
  const mx = -24, mh = grp(g, mx, PY + PR - 0.06, PZ); cyl(0.5, 0.5, 0.26, M.iron, 0, 0.13, 0, mh, 28); const lid = cyl(0.46, 0.46, 0.05, M.iron, 0.25, 0.42, 0.36, mh, 28); lid.rotation.x = -1.2;
  const ld = grp(g, mx, 0, PZ + PR + 0.55); for (const s of [-1, 1]) { const rl = box(0.07, 3.2, 0.07, M.wood, s * 0.24, 1.55, 0, ld); } for (let k = 0; k < 9; k++) box(0.48, 0.04, 0.05, M.wood, 0, 0.3 + k * 0.33, 0, ld); ld.rotation.x = -0.18; ld.position.z = PZ + PR + 0.4;
  P.walls.push([mx - 0.5, PZ + PR - 0.2, mx + 0.5, PZ + PR + 1.0]);
}
/* grass, flowers and trees round the edges, not on the yard */
function siteNature(g, kind, keep) {
  const r = rng(kind === 'ruin' ? 21 : 13), yard = [-23, -7, kind === 'morn' ? 37 : 23, 18], ruin = kind === 'ruin';
  const roofed = ruin ? [[-3.6 - 1.1, -12, -3.6 + 1.1, -9.2], [1.5, -12, 3.7, -9.2]] : [[-7.6, -16.1, 7.6, -4.9], [11.4, 0, 20.2, 9.4], [21.6, -40, 40, 60]];   /* never under a roof, a machine bed or on the siding */
  const clear = ruin ? [...keep, ...roofed] : [yard, ...keep, ...roofed];
  grassField(g, [-32, -22.4, 32, 22], ruin ? 9000 : 6000, { seed: 2, clear, h: ruin ? 0.32 : 0.28 });   /* close round the site: thick, ankle to shin high */
  grassField(g, [-70, -22.4, 70, 45], ruin ? 5000 : 3600, { seed: 3, clear: [...clear, [-32, -22.4, 32, 22]], h: ruin ? 0.34 : 0.3, w: 0.46 });
  flowerField(g, [-40, -22, 40, 30], ruin ? 360 : 180, { seed: 5, clear });
  blotches(g, [-50, -20, 50, 30], 20, { seed: 4 });
  const spots = kind === 'ruin' ? [[-14, -2], [-18, 8], [14, -4], [16, 10], [-10, 14], [12, 18], [-26, -16], [24, -16], [-30, 4], [28, 2], [10, 26], [-16, 28]] : [[-30, 6], [-28, 18], [35, -2], [35, 12], [-12, 26], [14, 28], [-30, -16], [35, -18]];
  spots.forEach(([x, z], i) => { const o = i % 3 === 0 ? palm(7 + r() * 2, i) : i % 3 === 1 ? mangoTree(6 + r() * 2, i) : flameTree(6.5, i); o.position.set(x, 0, z); g.add(o); });
  if (kind === 'ruin') { for (const [x, z] of [[-20, -16], [18, -17], [-9, 10.5]]) { const o = bamboo(x | 0); o.position.set(x, 0, z); g.add(o); } for (const [x, z, k] of [[-6, 4], [7.5, 3.4, 1], [-3.2, 12.4]]) { const o = k ? hibiscus(3) : croton(4); o.position.set(x, 0, z); g.add(o); } }
}

/* ---------- the three places on the site ---------- */
const HOUSES = [[-6.6, -15.1, 6.6, -5.9], [13.4, 0.7, 19.0, 8.3]];   /* under a roof (the turbine house, the superintendent's house): no grass or flowers may grow here (the audit checks) */
export function buildStation() {   /* chapter 0: Sunday evening. Sunset into night, the lamps lit, the wheel turning. */
  const g = grp(), P = { id: 'station', group: g, walls: [], spots: {}, flames: [], people: [], extras: [], env: ENV.dusk, eye: 1.6 };
  P.glass = new THREE.MeshBasicMaterial({ color: 0xffd890 }); P.glassIn = new THREE.MeshBasicMaterial({ color: 0x8a7a5a }); P.bulb = new THREE.MeshBasicMaterial({ color: 0xfff0c0 }); P.lampGlass = new THREE.MeshBasicMaterial({ color: 0xffd78a });
  siteGround(g, 'eve'); pipeAndSaddles(g, 'eve'); turbineHouse(g, 'eve', P); valveStand(g, P, 'eve'); noticeBoard(g, P); superHouse(g, P, 'eve'); yardBits(g, P, 'eve'); siteNature(g, 'eve', []);
  const bs = benchWithBack(g, -7.5, 9.5, 0.4); P.walls.push([-8.6, 8.9, -6.4, 10.2]);
  /* lights: the lamps of the yard and the turbine house (dimmed when the valve shuts) */
  P.lights = [new THREE.PointLight(0xffc878, 0, 18, 1.6), new THREE.PointLight(0xffd8a0, 0, 16, 1.4), new THREE.PointLight(0xffd8a0, 0, 16, 1.4)];
  P.lights[0].position.set(-15.5, 2.4, -7.2); P.lights[1].position.set(-2, 4.4, -10.5); P.lights[2].position.set(3, 4.4, -9); for (const l of P.lights) g.add(l);
  P.people.push(person('rudy', 'rudy', 'Rudy', -5.5, 6.2, 0.6, { h: 1.78 }));
  P.people.push(person('henry', 'henry', 'Bass Henry', -21.5, -7.2, 0.5, { h: 1.8 }));
  P.people.push(person('zeke', 'zeke', 'Old Zeke', 1.4, -7.4, 0.2, { h: 1.74 }));
  P.people.push(person('zekeV', 'zeke', 'Old Zeke', -15.5, -7.6, -0.9, { h: 1.74, hidden: true }));
  P.extras.push(extra('labourer', -19.6, -6.6, 2.6, 'Talk1'), extra('labourer', -18.6, -5.4, -2.2, 'Idle', { lamp: true }), extra('labourer', -24.6, -6.4, 0.6, 'Talk2'), extra('labourer', -11.4, 3.4, -0.6, 'Idle', { lamp: true }), extra('labourer', -6.2, 1.6, 2.4, 'Idle', { carry: 'bucket' }));
  const [sx, sz] = seatAt(-7.5, 9.5, 0.4, -0.45), [sx2, sz2] = seatAt(-7.5, 9.5, 0.4, 0.45);
  P.extras.push(extra('labourer', sx, sz, 0.4, 'SitTalk', { seat: SEAT_TOP, seated: true }), extra('labourer', sx2, sz2, 0.4, 'SitIdle', { seat: SEAT_TOP, seated: true }));
  P.indoor = HOUSES; P.bounds = { x0: -21.4, x1: 21.4, z0: -21, z1: 16.4 }; P.start = { x: -2, z: 13, yaw: 0.25 };
  P.spots.inside = [0, -8]; P.spots.door = [0, -4.5];
  P.tick = (dt, t) => { if (P.spin) P.spin.rotation.x += dt * (P.wheelSpeed ?? 2.6); g.userData.river.offset.x = (t * 0.02) % 1; for (const f of P.flames) f.scale.setScalar(0.5 * (0.9 + 0.1 * Math.sin(t * 9 + f.id))); };
  P.setPower = (k) => { P.wheelSpeed = 2.6 * k; P.glass.color.setHex(0x2a2a30).lerp(new THREE.Color(0xffd890), k); P.glassIn.color.setHex(0x1a1a20).lerp(new THREE.Color(0x8a7a5a), k); P.bulb.color.setHex(0x3a3430).lerp(new THREE.Color(0xfff0c0), k); P.lights[1].intensity = 9 * k; P.lights[2].intensity = 9 * k; };
  P.titleView = { x: -2, y: 1.7, z: 14, yaw: 0.35, pitch: 0.08 };
  return P;
}
/* the life of the yard: cart ruts, patches of trampled earth, a washing line, water butts, trees, a handcart, planks and a tarpaulin, so no corner is bare */
function yardLife(g, P) {
  const r = rng(77), rut = cv(64, 256, (x, w, h) => { x.clearRect(0, 0, w, h); for (const cx of [14, 50]) { const gr = x.createLinearGradient(cx - 9, 0, cx + 9, 0); gr.addColorStop(0, 'rgba(70,42,24,0)'); gr.addColorStop(0.5, 'rgba(70,42,24,0.55)'); gr.addColorStop(1, 'rgba(70,42,24,0)'); x.fillStyle = gr; x.fillRect(cx - 9, 0, 18, h); }
    for (let i = 0; i < 80; i++) { x.fillStyle = 'rgba(40,24,14,0.25)'; x.fillRect(r() * w, r() * h, 2, 3); } }, null, true);
  const rm = new THREE.MeshStandardMaterial({ map: rut, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  for (const [x0, z0, x1, z1, w] of [[0.2, 17, 0.4, -4.6, 1.5], [0.4, 14, 11.8, 12.5, 1.5], [0.2, 4, -17, 12, 1.5], [-14, -2.6, 10, -2.6, 1.5]]) { const L = Math.hypot(x1 - x0, z1 - z0), p = mesh(new THREE.PlaneGeometry(w, L), rm, (x0 + x1) / 2, 0.026, (z0 + z1) / 2, g); p.rotation.x = -PI / 2; p.rotation.z = Math.atan2(x1 - x0, z1 - z0) * -1 + 0 ; p.rotation.order = 'YXZ'; p.rotation.set(-PI / 2, 0, 0); p.rotation.y = 0; p.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.atan2(x1 - x0, z1 - z0)); }
  blotches(g, [-20, -3, 34, 16], 16, { seed: 9, colors: [0x7a5a3a, 0x9a7a54, 0x6a4a30, 0xa88a60] });
  /* a washing line behind the house gate side: two forked poles, a line with sheets and shirts */
  { const ax = 13.4, bx = 19.2, z = 11.2; for (const x of [ax, bx]) { cyl(0.05, 0.07, 2.4, M.woodDark, x, 1.2, z, g, 6); box(0.28, 0.05, 0.05, M.woodDark, x, 2.35, z, g); } P.walls.push([ax - 0.2, z - 0.2, ax + 0.2, z + 0.2], [bx - 0.2, z - 0.2, bx + 0.2, z + 0.2]);
    box(bx - ax, 0.012, 0.012, solid(0xc8c0a8, 1), (ax + bx) / 2, 2.3, z, g); const cols = [0xf0ece0, 0xc8d4e0, 0xe8dcc0, 0xd8b8a8, 0xf0ece0];
    cols.forEach((c, i) => { const m = solid(c, 1, 0, { side: THREE.DoubleSide }), w = 0.7 + (i % 2) * 0.35, x = ax + 0.6 + i * 1.1; const sh = plane(w, 0.9 - (i % 2) * 0.2, m, x, 2.3 - (0.9 - (i % 2) * 0.2) / 2, z, g); sh.rotation.y = 0.05 * i; }); }
  /* water butts under the house roof, hooped, with a downpipe */
  for (const [x, z] of [[16.0, 9.2], [16.0, -0.2]]) { const b = cyl(0.42, 0.34, 0.9, solid(0x5a4630, 0.9), x, 0.45, z, g, 14); for (const y of [0.2, 0.7]) cyl(0.43 - y * 0.05, 0.43 - y * 0.05, 0.04, M.iron, x, y, z, g, 14); cyl(0.4, 0.4, 0.03, solid(0x1a2a30, 0.2), x, 0.9, z, g, 14); const dp = cyl(0.04, 0.04, 2.8, M.iron, x, 2.3, z + (z > 4 ? -0.28 : 0.28), g, 6); P.walls.push([x - 0.5, z - 0.5, x + 0.5, z + 0.5]); }
  /* a handcart left near the gate, planks on trestles, and a tarpaulin over a heap of stores */
  { const c = cart(2.0, 1.1); c.position.set(-17.4, 0, 14.6); c.rotation.y = 0.5; g.add(c); P.walls.push([-19.0, 13.2, -15.8, 16.0]); }
  { const t = grp(g, -3.4, 0, -3.8); for (const dx of [-0.9, 0.9]) { box(0.08, 0.7, 0.5, M.woodDark, dx, 0.35, 0, t); } for (let i = 0; i < 3; i++) box(2.2, 0.05, 0.22, M.wood, 0, 0.72 + i * 0.0, (i - 1) * 0.25, t); P.walls.push([-4.7, -4.4, -2.1, -3.2]); }
  { const tp = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.6, 12, 1, true, 0, PI), solid(0x5a6a58, 1, 0, { side: THREE.DoubleSide })); tp.rotation.z = PI / 2; tp.rotation.y = 0.3; tp.position.set(17.8, 0.05, -2.0); tp.scale.set(1, 1, 0.7); g.add(tp); const crt = crate(0.6, 0x8a6a42); crt.position.set(17.8, 0, -2.0); g.add(crt); P.walls.push([16.6, -3.2, 19.0, -0.8]); }
  /* trees inside the fence, so the corners are not bare */
  for (const [x, z, k] of [[-20.2, 0.5, 0], [-20.4, 12.8, 1], [20.6, 14.8, 2], [33.5, -10, 0], [33.5, 12, 1]]) { const o = k === 0 ? mangoTree(6.2, 3 + (x | 0)) : k === 1 ? flameTree(6, 4) : mangoTree(5.6, 8); o.position.set(x, 0, z); g.add(o); P.walls.push([x - 0.5, z - 0.5, x + 0.5, z + 0.5]); }
  /* the middle of the yard: short trampled grass, pebbles, mud puddles, and the things people dropped. Kept off houses and anything solid. */
  const inClear = (x, z, rs) => rs.some(([a, b, c, d]) => x > a && x < c && z > b && z < d);
  const pad = P.walls.map(([a, b, c, d]) => [a - 0.5, b - 0.5, c + 0.5, d + 0.5]), keep = [...HOUSES, [-8, -16, 8, -4.5], ...pad];
  grassField(g, [-21, -4, 22, 17], 1200, { seed: 31, h: 0.15, w: 0.34, tint: 0xe0e0a8, clear: keep });
  rockField(g, [-21, -4, 22, 17], 70, { seed: 32, size: 0.1, tone: 0x8a7e68, clear: keep });
  const sky = new THREE.MeshStandardMaterial({ color: 0x4a5a62, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  for (const [x, z, sx, sz, ry] of [[-2.0, 7.4, 1.6, 0.9, 0.4], [5.2, 12.8, 1.2, 0.8, 1.1], [-9.5, 6.5, 1.0, 0.7, 0.2], [2.2, 1.0, 0.9, 0.6, 2.0]]) { if (inClear(x, z, pad)) continue; const p = mesh(new THREE.CircleGeometry(0.5, 20), sky, x, 0.03, z, g); p.rotation.x = -PI / 2; p.scale.set(sx, sz, 1); p.rotation.z = ry; }
  for (const [x, z, ry] of [[-4.6, 4.8, 0.7], [1.0, 3.3, 2.1], [6.2, 9.9, 4.0], [-11.0, 8.4, 1.3]]) { if (inClear(x, z, pad)) continue; const h = grp(g, x, 0, z); h.rotation.y = ry; const hat = solid(0xb8a47a, 1); cyl(0.17, 0.2, 0.012, hat, 0, 0.02, 0, h, 14); cyl(0.1, 0.1, 0.11, hat, 0, 0.07, 0, h, 14); cyl(0.102, 0.102, 0.02, solid(0x3a2a1c, 1), 0, 0.045, 0, h, 14); }   /* dropped straw hats */
  for (const [x, z, ry] of [[-6.4, 10.8, 0.4], [0.2, 6.4, 2.6]]) { if (inClear(x, z, pad)) continue; const b = grp(g, x, 0, z); b.rotation.y = ry; box(0.12, 0.05, 0.3, solid(0x2a2018, 1), -0.08, 0.025, 0, b); box(0.12, 0.05, 0.3, solid(0x2a2018, 1), 0.1, 0.025, 0.04, b); }   /* a pair of boots left behind */
}
export function buildYard() {   /* chapter 4: the morning after. Dawn going to day; the lamps out, the wheel still. */
  const g = grp(), P = { id: 'yard', group: g, walls: [], spots: {}, flames: [], people: [], extras: [], env: ENV.dawn, eye: 1.6 };
  P.glass = new THREE.MeshStandardMaterial({ color: 0x2a3440, roughness: 0.2 }); P.glassIn = P.glass; P.bulb = new THREE.MeshStandardMaterial({ color: 0x6a6458 }); P.lampGlass = M.iron;
  siteGround(g, 'morn'); pipeAndSaddles(g, 'morn'); turbineHouse(g, 'morn', P); valveStand(g, P, 'morn'); noticeBoard(g, P); P.notice.material.map = noticeTex(true); superHouse(g, P, 'morn'); yardBits(g, P, 'morn'); siteNature(g, 'morn', []);
  P.notice.material.needsUpdate = true;
  /* the men who came out, sitting on low plank forms and crates (nobody sits on the bare ground: the sitting clips are chair poses), blankets folded on the seats and spread on the ground */
  const form = (x, z, ry, L = 2.2) => { const f = grp(g, x, 0, z); f.rotation.y = ry; box(L, 0.07, 0.4, M.wood, 0, 0.45, 0, f); for (const dx of [-L / 2 + 0.2, L / 2 - 0.2]) box(0.08, 0.42, 0.34, M.woodDark, dx, 0.21, 0, f); box(L - 0.5, 0.05, 0.05, M.woodDark, 0, 0.3, 0, f);
    const c = Math.abs(Math.cos(ry)), sn = Math.abs(Math.sin(ry)); P.walls.push([x - (c * L / 2 + sn * 0.25), z - (sn * L / 2 + c * 0.25), x + (c * L / 2 + sn * 0.25), z + (sn * L / 2 + c * 0.25)]); };
  const blanket = (x, y, z, ry, mat, big = false) => { const w = big ? 1.5 : 0.56, d = big ? 1.0 : 0.38, b = box(w, big ? 0.03 : 0.09, d, mat, x, y, z, g); b.rotation.y = ry; if (!big) { const f = box(w, 0.03, d - 0.02, mat, x, y + 0.06, z, g); f.rotation.y = ry + 0.08; } else for (const k of [-0.3, 0.3]) { const st = box(w, 0.012, 0.07, solid(0xb8a888, 1), x, y + 0.02, z, g); st.rotation.y = ry; st.position.x += Math.sin(ry) * k * 0.9; st.position.z += Math.cos(ry) * k * 0.9; } return b; };
  const seats = [], FORMS = [[9.2, 1.6, PI / 2], [9.2, 4.6, PI / 2], [6.6, -1.2, PI], [-9.5, -1.0, PI]];
  FORMS.forEach(([x, z, ry], bi) => { form(x, z, ry); for (const a of [-0.62, 0.62]) { const [px, pz] = seatAt(x, z, ry, a); seats.push([px - Math.sin(ry) * 0.04 + Math.sin(ry) * -0.0, pz, ry]); } const [bx, bz] = seatAt(x, z, ry, 0); blanket(bx, SEAT_TOP + 0.045, bz, ry, bi % 2 ? M.blanket2 : M.blanket); });
  for (const [x, z, ry] of [[-13.6, 1.6, 0.8], [-12.6, 3.4, 0.5]]) { const c = crate(0.606, 0x7a5a3c); c.position.set(x, 0, z); c.rotation.y = ry; g.add(c); P.walls.push([x - 0.35, z - 0.35, x + 0.35, z + 0.35]); seats.push([x, z, ry]); }
  blanket(-11.4, 0.03, 3.2, 0.4, M.blanket2, true); blanket(-15.2, 0.03, 3.8, -0.3, M.blanket, true); blanket(7.4, 0.03, 6.6, 0.2, M.blanket, true);   /* blankets spread on the ground */
  for (const [x, z] of [[-11.9, 1.2], [-14.6, 2.6], [8.0, 0.6]]) { cyl(0.04, 0.035, 0.08, M.steel, x, 0.04, z, g, 8); }   /* tin mugs */
  const [rx, rz, rry] = seats[0]; P.people.push(person('rudy4', 'rudy', 'Rudy', rx, rz, rry, { anim: 'SitIdle', seat: SEAT_TOP, h: 1.3 }));
  seats.slice(1).forEach(([x, z, ry], i) => P.extras.push(extra('labourer', x, z, ry, ['SitIdle', 'SitTalk', 'SitIdle', 'SitIdle', 'SitTalk', 'SitIdle', 'SitIdle', 'SitTalk'][i % 8], { seat: SEAT_TOP, seated: true, tint: { ...extra('labourer', 0, 0).tint, Shirt: [0xb8b0a0, 0xa8a090, 0xc8c0a8][i % 3] } })));
  /* officials and families on the veranda of the superintendent's house (the deck is 27 cm high) */
  for (const [z, anim, who] of [[2.3, 'Sad1', 'minister'], [6.5, 'Idle', 'minister'], [4.5, 'Sad2', 'labourer']]) P.extras.push(extra(who, 12.45, z, -PI / 2, anim, { ground: 0.27, fixed: true }));
  /* the real people of the morning: seen, not heard */
  P.people.push(person('hammond', 'hammond', 'Dr Hammond', 7.8, 3.0, PI / 2, { h: 1.8, see: true, anim: 'Idle' }));
  P.people.push(person('minister1', 'minister', 'A minister', -3.4, 9.6, 0.5, { h: 1.8, see: true, anim: 'Idle', carry: 'book' }));
  P.people.push(person('minister2', 'minister', 'A minister', -7.6, 4.4, -0.4, { h: 1.8, see: true, anim: 'Talk2', tint: { ...extra('minister', 0, 0).tint, Hair: 0xb8b4ac } }));
  P.people.push(person('haggart', 'haggart', 'Mr Haggart', 4.6, 8.8, PI / 2, { h: 1.8, see: true, anim: 'Idle' }));
  P.people.push(person('osborne', 'osborne', 'Mr Osborne-Smith', -2.6, 12.9, 0, { h: 1.8, see: true, anim: 'Talk3' }));
  { const t = grp(g, 5.55, 0, 8.8); box(0.9, 0.05, 0.6, M.wood, 0, 0.76, 0, t); for (const dx of [-0.38, 0.38]) for (const dz of [-0.25, 0.25]) box(0.05, 0.74, 0.05, M.woodDark, dx, 0.37, dz, t);
    const bk = grp(t, 0, 0.79, 0); box(0.36, 0.015, 0.26, solid(0x5a2a22, 0.9), 0, 0, 0, bk); for (const s of [-1, 1]) { const pg = box(0.17, 0.006, 0.24, M.white, s * 0.09, 0.012, 0, bk); pg.rotation.z = -s * 0.06; } P.walls.push([5.0, 8.4, 6.1, 9.2]); }
  P.people.push(person('reporter', 'reporter', 'The man from the Gleaner', -3.4, 3.2, 0.4, { h: 1.8, carry: 'notebook' }));
  P.people.push(person('ivy', 'ivy', 'Miss Ivy', 3.2, 15.0, PI, { h: 1.62, hidden: true }));
  /* families at the gate and along the fence, and men of the company */
  P.extras.push(...crowd04(8, 11, [-9, 14.4, 9, 16.1], { face: PI, women: 0.6, anims: ['Idle', 'Sad1', 'Sad2', 'Idle'] }));
  P.extras.push(extra('minister', -2.2, 10.4, -2.6, 'Sad1', { base: 'nb_seller', tint: { Shirt: 0xd8c8a8, Skirt: 0x3a3a4a, Hair: 0x1c1816 } }), extra('labourer', -6.6, 5.6, 2.8, 'Sad2'));
  P.extras.push(extra('labourer', -19.5, -6.8, 0.5, 'Idle'), extra('labourer', -18.4, -5.8, -2.6, 'Sad1'));
  yardLife(g, P); P.indoor = HOUSES; P.bounds = { x0: -21.4, x1: 22.5, z0: -21, z1: 16.4 }; P.start = { x: -1, z: 0.5, yaw: PI - 0.5 };
  P.keepOut = [[3.2, 15.0, 0.7]];
  /* the special train, standing inside the east fence on the siding (empty vans), until the whistle brings it up to the platform */
  const train = grp(g, 28, 1.69, -16); train.rotation.y = PI / 2; train.userData.noBatch = true; const loco = steamLoco('late'); train.add(loco); const van = wagon(); van.position.x = 9.4; train.add(van); const van2 = wagon(); van2.position.x = 16.1; train.add(van2); P.train = train; P.spots.trainStart = -16; P.spots.trainStop = 6;
  P.tick = (dt, t) => { g.userData.river.offset.x = (t * 0.02) % 1; };
  return P;
}
export function buildRuins() {   /* chapter 5: today, bright day among trees */
  const g = grp(), P = { id: 'ruins', group: g, walls: [], spots: {}, flames: [], people: [], extras: [], env: ENV.day, eye: 1.6 };
  siteGround(g, 'ruin'); pipeAndSaddles(g, 'ruin'); turbineHouse(g, 'ruin', P); siteNature(g, 'ruin', [[-8, -16, 8, -5], [-1, -6, 5, 20], [-60, PZ - 1.5, -14, PZ + 1.5], [-34, -10, -25, -5.5]]);
  P.walls.push([-121, PZ - 1.0, -14, PZ + 1.0], [-35.3, PZ + 2.2, -26.7, PZ + 5.0], [-44.0, PZ - 1.4, -40.0, PZ + 1.8], [-13.6, -2.7, -2.8, 0.7]);
  /* the information board: two posts, a sloping panel under a little roof */
  { const x = 4.2, z = -2.2, b = grp(g, x, 0, z); for (const s of [-1, 1]) cyl(0.06, 0.06, 2.1, solid(0x2a3a34, 0.5, 0.4), s * 0.86, 1.05, 0, b, 10); box(1.9, 1.3, 0.06, solid(0x1f4a3a, 0.6), 0, 1.35, -0.02, b);
    const face = mesh(new THREE.PlaneGeometry(1.8, 1.26), new THREE.MeshStandardMaterial({ map: infoTex(), roughness: 0.6 }), 0, 1.35, 0.015, b); const roof = box(2.1, 0.05, 0.34, solid(0x2a3a34, 0.6), 0, 2.08, 0.05, b); roof.rotation.x = -0.15;
    box(1.82, 0.04, 0.04, solid(0x2a3a34, 0.5, 0.4), 0, 0.7, 0, b); P.walls.push([x - 1.0, z - 0.25, x + 1.0, z + 0.2]); P.spots.board = [x, z + 1.3]; }
  /* where the superintendent's house stood: its stone piers in the grass */
  for (const [x, z] of [[13.5, 1], [13.5, 4.5], [13.5, 8], [18.5, 1], [18.5, 4.5], [18.5, 8]]) { cyl(0.16, 0.2, 0.32, solid(0x9a968a, 1), x, 0.16, z, g, 8); }
  /* a low wall to sit on, a path sign, and some modern things: a bin, a bench */
  benchWithBack(g, -1.8, 13.4, PI, 2); P.walls.push([-3, 13.0, -0.6, 13.8]); const bin = cyl(0.25, 0.22, 0.8, solid(0x2a5a3a, 0.6), 1.2, 0.4, 14.2, g, 12); P.walls.push([0.9, 13.9, 1.5, 14.5]);
  P.people.push(person('grant', 'grant', 'Miss Grant', 0.6, 8.6, PI - 0.3, { h: 1.7 }));
  P.people.push(person('kemar', 'kemar', 'Kemar', -2.6, -2.2, 0.6, { h: 1.55 }));
  P.extras.push(...crowdNow(4, 7, [-5, 4, 5, 9], { face: PI }));
  P.bounds = { x0: -36, x1: 21, z0: -20.5, z1: 18 }; P.start = { x: 2, z: 15.5, yaw: 0 };
  P.tick = (dt, t) => { g.userData.river.offset.x = (t * 0.02) % 1; };
  return P;
}

/* ---------- Kingston, Friday 31 March 1899 ---------- */
/* the electric car: a closed saloon in the middle, open platforms at both ends with dashboards and controllers, a clerestory roof and a trolley pole up to the wire.
   It faces +x. Its floor is 0.75 m up; the group's origin is on the rails' level ground. Colours are our best guess (no photograph found). */
export function electricCar(wireY = 6.1) {
  const g = grp(); g.userData.noBatch = true; const L = 5.2, W = 2.0, PL = 1.3, fl = 0.78, green = solid(0x2a4a36, 0.5, 0.15), cream = solid(0xece0c0, 0.6), gold = solid(0xc8a04a, 0.35, 0.6), dark = solid(0x1c1a18, 0.7), wood = solid(0x8a5a32, 0.6), glass = new THREE.MeshStandardMaterial({ color: 0x3a4a58, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.55 });
  /* the truck: frame, wheels, axle boxes, the motor between the axles */
  box(3.2, 0.24, 1.5, dark, 0, 0.52, 0, g); const W2 = []; for (const x of [-0.95, 0.95]) for (const z of [-0.72, 0.72]) { const w = cyl(0.38, 0.38, 0.1, solid(0x202226, 0.5, 0.5), x, 0.38, z, g, 20); w.rotation.x = PI / 2; W2.push(w); const hb = cyl(0.12, 0.12, 0.16, M.iron, x, 0.38, z * 1.12, g, 8); hb.rotation.x = PI / 2; }
  for (const z of [-0.85, 0.85]) box(2.6, 0.18, 0.1, dark, 0, 0.5, z, g); const mot = cyl(0.3, 0.3, 0.9, dark, 0, 0.44, 0, g, 14); mot.rotation.x = PI / 2;
  /* the floor and the saloon: dark green lower panels with gold lining, cream window band, pillars and windows, letterboard */
  box(L + 2 * PL, 0.1, W, wood, 0, fl, 0, g);
  for (const s of [-1, 1]) { box(L, 0.9, 0.06, green, 0, fl + 0.5, s * W / 2, g); box(L - 0.1, 0.03, 0.07, gold, 0, fl + 0.85, s * W / 2, g); box(L - 0.1, 0.03, 0.07, gold, 0, fl + 0.18, s * W / 2, g);
    box(L, 0.18, 0.07, cream, 0, fl + 1.02, s * W / 2, g);
    for (let i = 0; i <= 6; i++) box(0.09, 0.9, 0.07, cream, -L / 2 + i * L / 6, fl + 1.56, s * W / 2, g);
    const gl = plane(L - 0.1, 0.86, glass, 0, fl + 1.56, s * (W / 2 + 0.005), g); if (s < 0) gl.rotation.y = PI;
    box(L, 0.36, 0.07, cream, 0, fl + 2.2, s * W / 2, g); }
  for (const s of [-1, 1]) { box(0.07, 2.35, W, green, s * L / 2, fl + 1.2, 0, g); const dg = plane(0.7, 0.86, glass, s * (L / 2 + 0.04), fl + 1.56, 0, g); dg.rotation.y = s * PI / 2; box(0.08, 0.1, 0.8, cream, s * (L / 2 + 0.01), fl + 2.0, 0, g); }   /* the end walls with their doors */
  /* the letterboard sign on each side */
  const lb = std(signTex([['KING STREET', '700 60px Georgia, serif']], 512, 72, '#ece0c0', '#2a4a36'), 0.6); for (const s of [-1, 1]) { const sp = plane(2.6, 0.3, lb, 0, fl + 2.2, s * (W / 2 + 0.04), g); if (s < 0) sp.rotation.y = PI; }
  /* the roof: a curved top over the whole car and platforms, and a raised clerestory in the middle with little windows */
  const roof = mesh(new THREE.CylinderGeometry(1.6, 1.6, L + 2 * PL + 0.2, 24, 1, true, PI / 2 - 0.68, 1.36), solid(0xece0c0, 0.6, 0, { side: THREE.DoubleSide }), 0, fl + 2.42 - 1.6 * Math.cos(0.68), 0, g); roof.rotation.z = PI / 2;   /* a curved roof: its edges at the top of the sides, its crown 0.36 m higher */
  box(L + 2 * PL + 0.2, 0.06, W + 0.12, cream, 0, fl + 2.4, 0, g);
  box(L - 0.6, 0.3, 0.9, cream, 0, fl + 2.84, 0, g); for (const s of [-1, 1]) for (let i = 0; i < 6; i++) plane(0.5, 0.18, glass, -L / 2 + 0.6 + i * 0.8, fl + 2.84, s * 0.456, g).rotation.y = s < 0 ? PI : 0;
  box(L - 0.5, 0.05, 1.0, green, 0, fl + 3.01, 0, g);   /* the clerestory: a raised middle with little windows */
  /* the platforms: a curved dashboard at each end, a controller and a brake staff, a headlamp, steps, and rails to hold */
  for (const s of [-1, 1]) {
    const x = s * (L / 2 + PL), dash = mesh(new THREE.CylinderGeometry(W / 2, W / 2, 1.0, 20, 1, true, s > 0 ? 0 : PI, PI), green, x - s * 0.5, fl + 0.55, 0, g); dash.scale.set(0.55, 1, 1); dash.material = solid(0x2a4a36, 0.5, 0.15, { side: THREE.DoubleSide });
    const lamp = cyl(0.14, 0.16, 0.14, solid(0xfff0c0, 0.3, 0, { emissive: 0xffe0a0, emissiveIntensity: 0.6 }), x + s * 0.02, fl + 0.8, 0, g, 14); lamp.rotation.z = PI / 2;
    const ctl = box(0.26, 1.0, 0.3, dark, x - s * 0.42, fl + 0.55, -0.5, g); box(0.3, 0.08, 0.06, gold, x - s * 0.42, fl + 1.1, -0.42, g);
    cyl(0.03, 0.03, 1.1, M.iron, x - s * 0.42, fl + 0.6, 0.5, g, 8); const bw2 = mesh(new THREE.TorusGeometry(0.14, 0.02, 6, 16), M.iron, x - s * 0.42, fl + 1.18, 0.5, g); bw2.rotation.x = PI / 2;
    for (const z of [-1, 1]) { cyl(0.02, 0.02, 1.45, gold, x - s * 0.62, fl + 1.65, z * 0.94, g, 6); box(0.5, 0.06, 0.3, wood, s * (L / 2 + PL * 0.5), 0.42, z * (W / 2 + 0.1), g); for (const dx of [-0.22, 0.22]) box(0.04, 0.36, 0.04, M.iron, s * (L / 2 + PL * 0.5) + dx, 0.6, z * (W / 2 + 0.02), g); }   /* the step, hung from the platform on two irons */
    for (const z of [-0.94, 0.94]) cyl(0.02, 0.02, 1.62, cream, x - s * 0.05, fl + 1.62, z * 0.86, g, 6);   /* the corner posts holding up the roof over the platform */
    const num = plane(0.34, 0.3, std(signTex([['1', '700 120px Georgia, serif']], 128, 128, '#ece0c0', '#2a4a36'), 0.6), x + s * 0.0, fl + 2.15, 0, g); num.position.x = x + s * 0.04; num.rotation.y = s * PI / 2;
  }
  /* the trolley pole: a base on the roof, a long pole leaning back, a small wheel running on the wire */
  const tb = grp(g, -0.6, fl + 3.03, 0); cyl(0.14, 0.18, 0.16, dark, 0, 0.08, 0, tb, 12);
  const tipX = -0.6 - 3.4, tipY = wireY - 0.05, base = new THREE.Vector3(-0.6, fl + 3.15, 0), tip = new THREE.Vector3(tipX, tipY, 0), d = tip.clone().sub(base), len = d.length();
  const pole = cyl(0.025, 0.04, len, dark, (base.x + tip.x) / 2, (base.y + tip.y) / 2, 0, g, 8); pole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  const tw = cyl(0.06, 0.06, 0.05, gold, tipX, tipY - 0.04, 0, g, 12); tw.rotation.x = PI / 2;
  for (const s of [-1, 1]) { const sp = cyl(0.015, 0.015, 0.7, M.iron, -0.6 - s * 0.3, fl + 3.15, 0.12, g, 6); sp.rotation.z = PI / 2; }   /* the springs that push the pole up against the wire */
  { const ra = new THREE.Vector3(tipX + 0.25, tipY - 0.25, 0.04), rb = new THREE.Vector3(-(L / 2 + PL) + 0.08, fl + 2.42, 0.6), rd = rb.clone().sub(ra), rl = rd.length(); const rope = cyl(0.008, 0.008, rl, solid(0xc8b890, 1), (ra.x + rb.x) / 2, (ra.y + rb.y) / 2, (ra.z + rb.z) / 2, g, 4); rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rd.normalize()); }   /* the trolley rope, from the pole down to the back of the roof, to pull it off the wire */
  /* inside the saloon: two long seats of slatted wood along the sides, and leather straps to hold */
  for (const s of [-1, 1]) { box(L - 0.4, 0.06, 0.42, wood, 0, fl + 0.46, s * (W / 2 - 0.27), g); box(L - 0.4, 0.4, 0.05, wood, 0, fl + 0.24, s * (W / 2 - 0.46), g); box(L - 0.4, 0.4, 0.05, wood, 0, fl + 0.78, s * (W / 2 - 0.08), g);
    box(L - 0.3, 0.025, 0.025, gold, 0, fl + 2.2, s * 0.42, g); for (let i = 0; i < 6; i++) box(0.03, 0.22, 0.03, solid(0x5a3a22, 0.8), -L / 2 + 0.6 + i * 0.8, fl + 2.07, s * 0.42, g); }
  /* the lifeguard: a slatted tray under each end, to scoop up anything on the track */
  for (const s of [-1, 1]) { const x = s * (L / 2 + PL - 0.05); box(0.08, 0.06, 1.5, dark, x, 0.24, 0, g); box(0.08, 0.06, 1.5, dark, x - s * 0.25, 0.3, 0, g); for (const z of [-0.6, 0, 0.6]) box(0.34, 0.04, 0.04, dark, x - s * 0.12, 0.27, z, g); box(0.06, 0.5, 0.06, dark, x - s * 0.12, 0.52, 0.62, g); box(0.06, 0.5, 0.06, dark, x - s * 0.12, 0.52, -0.62, g); }
  g.userData.wheels = W2; g.userData.len = L + 2 * PL; g.userData.floor = fl;
  return g;
}
/* the old mule car: smaller, with open sides and benches, no pole; its paint faded */
function muleCar() {
  const g = grp(); const red = solid(0x8a4a32, 0.8), yel = solid(0xc8a860, 0.8), dark = solid(0x2a2420, 0.8), wood = solid(0x7a5a3c, 0.9), L = 4.2, W = 1.8, fl = 0.7;
  for (const x of [-1.0, 1.0]) for (const z of [-0.7, 0.7]) { const w = cyl(0.34, 0.34, 0.08, dark, x, 0.34, z, g, 16); w.rotation.x = PI / 2; } box(2.6, 0.2, 1.3, dark, 0, 0.5, 0, g);
  box(L + 1.4, 0.08, W, wood, 0, fl, 0, g); for (const s of [-1, 1]) { box(L, 0.5, 0.05, red, 0, fl + 0.3, s * W / 2, g); box(L, 0.04, 0.06, yel, 0, fl + 0.55, s * W / 2, g); for (let i = 0; i <= 5; i++) box(0.07, 1.4, 0.07, yel, -L / 2 + i * L / 5, fl + 1.25, s * W / 2, g); box(L, 0.24, 0.06, yel, 0, fl + 1.95, s * W / 2, g); }
  for (const s of [-1, 1]) box(L - 0.2, 0.06, 0.34, wood, 0, fl + 0.42, s * 0.62, g);   /* benches along the sides */
  box(L + 1.6, 0.08, W + 0.2, red, 0, fl + 2.1, 0, g); for (const s of [-1, 1]) { box(0.05, 0.7, W, red, s * (L / 2 + 0.7), fl + 0.4, 0, g); box(0.06, 0.06, 0.6, M.iron, s * (L / 2 + 0.9), 0.55, 0, g); }
  /* the pole the mules are hitched either side of, and the swingletrees their traces pull on, at the front (+x) end */
  const pole = box(2.6, 0.08, 0.08, wood, L / 2 + 0.7 + 1.3, 0.95, 0, g); pole.rotation.z = 0.06; box(0.12, 0.3, 0.12, M.iron, L / 2 + 0.76, 0.8, 0, g);
  for (const z of [-0.5, 0.5]) { box(0.08, 0.06, 0.62, wood, L / 2 + 0.86, 0.8, z, g); } box(0.08, 0.06, 1.3, M.iron, L / 2 + 0.8, 0.8, 0, g);
  return g;
}
/* harness on a mule from props.js (it faces +x): a padded collar round the base of the neck with brass hames, a back band and belly band, breeching
   round the rump, and two traces running back to the swingletree; side = which side of the pole the mule stands, so the inner trace is not hidden */
function harness(m, side) {
  const lea = solid(0x2a1c14, 0.7), pad = solid(0x3a2a1c, 0.9), brass = M.brass, NA = 0.62;   /* NA: the lean of the mule's neck */
  const cg = new THREE.TorusGeometry(0.25, 0.065, 8, 20); cg.scale(1, 1.2, 1); cg.rotateX(-PI / 2); cg.rotateZ(-NA); mesh(cg, pad, 0.76, 1.2, 0, m);   /* the collar, square to the neck */
  for (const s of [-1, 1]) { const h = box(0.035, 0.55, 0.03, brass, 0.76, 1.2, s * 0.31, m); h.rotation.z = PI / 2 - NA + PI / 2; }   /* hames along the sides of the collar */
  box(0.14, 0.05, 0.72, lea, 0.05, 1.37, 0, m); for (const s of [-1, 1]) box(0.12, 0.6, 0.03, lea, 0.05, 1.06, s * 0.31, m);   /* the back band, down the sides to the belly band */
  const bg = new THREE.TorusGeometry(0.33, 0.03, 5, 18, PI); bg.rotateX(PI / 2); bg.rotateY(-PI / 2); mesh(bg, lea, -0.62, 1.0, 0, m);   /* breeching round the rump */
  const a = [0.72, 1.12], b = [-1.78, 0.84], len = Math.hypot(a[0] - b[0], a[1] - b[1]);
  for (const s of [-1, 1]) { const tr = box(len, 0.035, 0.025, lea, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, s * 0.33, m); tr.rotation.z = Math.atan2(a[1] - b[1], a[0] - b[0]); }   /* the traces, from the hames back to the swingletree */
}
const GAS_GLASS = new THREE.MeshStandardMaterial({ color: 0xf0e8c8, roughness: 0.15, transparent: true, opacity: 0.7 });
function gasLamp(parent, x, z, ry = 0) {   /* a gas street lamp: a fluted iron post, a cross bar for the lamplighter's ladder, a four-sided lantern */
  const g = grp(parent, x, 0, z); g.rotation.y = ry; cyl(0.12, 0.16, 0.5, M.iron, 0, 0.25, 0, g, 10); cyl(0.05, 0.07, 3.0, M.iron, 0, 1.7, 0, g, 10); box(0.6, 0.04, 0.04, M.iron, 0, 2.9, 0, g);
  cyl(0.2, 0.12, 0.42, GAS_GLASS, 0, 3.45, 0, g, 4); cyl(0.04, 0.22, 0.16, M.iron, 0, 3.74, 0, g, 4); cyl(0.12, 0.12, 0.05, M.iron, 0, 3.22, 0, g, 4); return g;
}
export function buildKingston() {
  const g = grp(), P = { id: 'kingston', group: g, walls: [], spots: {}, flames: [], people: [], extras: [], env: ENV.morning, eye: 1.5 }, r = rng(17), WIRE = 6.1;
  groundPlane(g, T.grass([200, 200], [110, 128, 70]));
  const road = mesh(new THREE.PlaneGeometry(170, 21), std(TX.marl(), 1), 25, 0.02, 0, g); road.rotation.x = -PI / 2;   /* a pale marl road, dusty, from wall to wall */
  /* the tram track down the middle of the street, into the depot */
  const rt = solid(0x7a7c80, 0.4, 0.7); for (const z of [-0.72, 0.72]) box(170, 0.03, 0.07, rt, 25, 0.03, z, g);
  for (const z of [-0.72, 0.72]) for (const dz of [-0.09, 0.09]) box(170, 0.012, 0.05, solid(0x8a7e66, 1), 25, 0.021, z + dz, g);   /* in a street the rails are set flush in the road: only a strip of packed stone either side of each rail shows */
  /* shops of board and zinc with verandas, both sides */
  const walls = ['#c8b080', '#a8c0a8', '#d8c0a0', '#c0a088', '#e0d4b8', '#b8b8c8'].map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const names = [['DRY GOODS', 0], ['BAKERY', 1], ['HARDWARE', 0], ['PROVISIONS', 1], ['DRUG STORE', 0], ['TAILOR', 1], ['GROCERY', 0], ['SHOES', 1]];
  let k = 0; for (const side of [-1, 1]) for (let x = -30; x < 100; x += 8.6) { if (side < 0 && x < -25) continue; const h = boardHouse(7.6, 5, 3.2 + r() * 0.8, { wall: walls[k % walls.length], roof: [[150, 154, 150], [140, 96, 76], [120, 124, 120]][k % 3], seed: k + 3 }); h.position.set(x, 0, side * 10); h.rotation.y = side < 0 ? 0 : PI; g.add(h);
    const nm = names[k % names.length]; const sg = mesh(new THREE.PlaneGeometry(3.4, 0.42), std(signTex([[nm[0], '700 60px Georgia, serif']], 512, 64), 0.8), x, 2.3, side * (10 - 4.1), g); if (side > 0) sg.rotation.y = PI; k++; }
  P.walls.push([-60, -40, 120, -5.5], [-60, 5.5, 120, 40]);
  /* the depot: a long shed with wide doors opening on to the street */
  const dx = -40, dep = grp(g); const dwt = T.plaster([226, 214, 184], [3, 1]); const dm = std(dwt, 0.9);
  box(16, 7, 0.4, dm, dx - 8, 3.5, -8, dep); box(16, 7, 0.4, dm, dx - 8, 3.5, 8, dep); box(0.4, 7, 16, dm, dx - 16, 3.5, 0, dep);
  box(0.4, 7, 5.2, dm, dx, 3.5, -5.4, dep); box(0.4, 7, 5.2, dm, dx, 3.5, 5.4, dep); box(0.4, 0.6, 5.6, dm, dx, 6.7, 0, dep);
  const zt = T.zinc([150, 154, 150]).clone(); zt.needsUpdate = true; zt.repeat.set(5, 3); for (const s of [-1, 1]) { const rf = box(17, 0.1, 9, std(zt, 0.7), dx - 8, 7.8, s * 4.1, dep); rf.rotation.x = s * 0.28; }
  for (const s of [-1, 1]) { const gab = mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(-8.2, 0), new THREE.Vector2(8.2, 0), new THREE.Vector2(0, 2.4)])), std(dwt, 0.9, { side: THREE.DoubleSide }), s < 0 ? dx - 16 : dx, 7, 0, dep); gab.rotation.y = PI / 2; }
  box(15.6, 0.04, 15.6, solid(0x2a2622, 0.95), dx - 8, 0.02, 0, dep); box(15.6, 0.05, 15.6, solid(0x2a2622, 0.95), dx - 8, 6.95, 0, dep);
  for (const s of [-1, 1]) box(2.8, 5.2, 0.1, solid(0x2a4a36, 0.9), dx + 1.6, 2.6, s * 2.85, dep);   /* the doors, swung open */
  mesh(new THREE.PlaneGeometry(4.6, 0.5), std(signTex([['TRAM DEPOT', '700 62px Georgia, serif']], 512, 72, '#2a4a36', '#ece0c0'), 0.8), dx + 0.22, 6.7, 0, dep).rotation.y = PI / 2;
  P.walls.push([dx - 16.5, -8.5, dx + 0.3, -2.7], [dx - 16.5, 2.7, dx + 0.3, 8.5], [dx - 16.5, -8.5, dx - 15.5, 8.5], [dx - 0.1, -2.9, dx + 2.9, -2.6], [dx - 0.1, 2.6, dx + 2.9, 2.9], [-60, -2.8, dx - 0.2, 2.8]);
  /* a street sign at the corner */
  { const sp = grp(g, dx + 3.6, 0, -5.0); cyl(0.05, 0.06, 2.8, M.iron, 0, 1.4, 0, sp, 8); const sb = mesh(new THREE.PlaneGeometry(1.4, 0.3), std(signTex([['ORANGE STREET', '700 56px Georgia, serif']], 512, 96, '#f2ecd8', '#1e1810'), 0.8), 0, 2.6, 0.06, sp); const sb2 = sb.clone(); sb2.rotation.y = PI; sb2.position.z = 0.0 - 0.06 + 0.0; sp.add(sb2); box(1.44, 0.34, 0.08, M.iron, 0, 2.6, 0, sp); P.walls.push([dx + 3.3, -5.3, dx + 3.9, -4.7]); }
  /* overhead: a pole each side every 20 m, a span wire across, and the trolley wire over the track */
  const wm = solid(0x1c1c1c, 0.6, 0.4); for (let x = -34; x <= 104; x += 20) { for (const s of [-1, 1]) { const pl = grp(g, x, 0, s * 5.6); cyl(0.11, 0.15, 7.0, solid(0x3a2e24, 0.9), 0, 3.5, 0, pl, 8); cyl(0.14, 0.14, 0.1, M.iron, 0, 6.6, 0, pl, 8); cyl(0.02, 0.12, 0.18, M.iron, 0, 7.09, 0, pl, 8); cyl(0.05, 0.05, 0.12, solid(0xe8e4d8, 0.3), 0, WIRE + 0.08, -s * 0.16, pl, 8); box(0.05, 0.05, 0.12, M.iron, 0, WIRE + 0.08, -s * 0.06, pl); P.walls.push([x - 0.25, s * 5.6 - 0.25, x + 0.25, s * 5.6 + 0.25]); }
    box(0.02, 0.02, 11.2, wm, x, WIRE + 0.08, 0, g); box(0.1, 0.12, 0.1, wm, x, WIRE + 0.04, 0, g); }
  box(160, 0.022, 0.022, wm, 25, WIRE + 0.02, 0, g); box(0.1, 0.8, 0.1, wm, -54.6, WIRE + 0.4, 0, g);   /* the trolley wire, running on into the depot, hung from its roof at the far end */
  /* gas lamps along the street, and telegraph-style poles behind */
  for (let x = -24; x < 100; x += 20) for (const s of [-1, 1]) { gasLamp(g, x + s * 4, s * 5.0, 0); P.walls.push([x + s * 4 - 0.25, s * 5 - 0.25, x + s * 4 + 0.25, s * 5 + 0.25]); }
  /* the retired mule car under a tree at the side of the street, and its two mules resting */
  const mc = muleCar(); mc.position.set(-30, 0, -3.8); g.add(mc); P.walls.push([-33.0, -4.9, -27.1, -2.7]);
  /* its two mules, still in harness, standing either side of the pole, ready to be led away: collars, hames, traces back to the swingletrees, a back band and breeching */
  for (const z of [-4.32, -3.28]) { const m = mule(z < -3.8 ? 0x5a4838 : 0x6a5442, false); m.userData.noBatch = true; m.position.set(-25.35, 0, z); m.scale.setScalar(0.95); harness(m, z < -3.8 ? 1 : -1); g.add(m); P.flames.push(m); }
  P.walls.push([-27.1, -4.75, -23.3, -2.85]);
  /* the electric car, in the depot doorway */
  const car = electricCar(WIRE); car.position.set(-46, 0, 0); g.add(car); P.car = car;
  /* palms and hills behind the street */
  for (let i = 0; i < 26; i++) { const o = r() < 0.6 ? palm(7 + r() * 3, i) : mangoTree(6 + r() * 2, i); o.position.set(-30 + i * 5.4 + r() * 2, 0, (i % 2 ? 1 : -1) * (15 + r() * 8)); g.add(o); }
  g.add(hillRing(220, 18, 60, { seed: 8, base: [0.24, 0.42, 0.24] }));
  /* people */
  P.people.push(person('bertie', 'bertie', 'Mr Bertie', -28.2, -2.1, 0.4, { h: 1.74 }));
  P.people.push(person('woman', 'woman', 'The woman', 6.0, 4.0, PI - 0.3, { h: 1.68 }));
  P.people.push(person('conductor', 'conductor', 'The conductor', -35.4, 3.6, -1.0, { h: 1.78 }));
  P.extras.push(...crowd99(14, 21, [-22, 3.6, 40, 4.9], { face: PI }), ...crowd99(14, 22, [-22, -4.9, 40, -3.6], { face: 0 }));
  P.bounds = { x0: -36, x1: 100, z0: -5.2, z1: 5.2 }; P.start = { x: -12, z: 3.0, yaw: PI / 2 + 0.25 };
  P.spots.board = [-22.2, 1.6]; P.keepOut = [[-12, 3.0, 1.2], [-22, 1.8, 1.0], [-22, 2.6, 1.0]];
  P.tick = (dt, t) => { for (const m of P.flames) if (m.userData.tick) m.userData.tick(t); };
  return P;
}
