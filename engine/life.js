/* engine/life.js: small life that makes a place feel lived in, cheap enough for phones (22 November 2026; the owner: "we want persons to
   be wowed by the graphics in all the games too, so details matter (without sacrificing performance)"). Each helper is one or a few draw
   calls and returns tick(t) for the place's tickers.

   flock(parent, { n, at: [x, z], h, r, color, size, speed, seed })   birds wheeling over a spot (dark rooks or bats at dusk, gulls by day)
   fireflies(parent, { n, area: [x0, z0, x1, z1], y: [lo, hi], color, size, seed, on })   blinking points drifting over grass; on() says
       whether they show now (dusk only); one Points draw call
   motes(parent, { n, box: [x0, y0, z0, x1, y1, z1], color, size, seed })   dust turning slowly in candle or lamp light; one Points draw call
   Nanny Town's fireflies (games/nanny/src/land.js) are its own copy, to move here when Nanny is next touched. */
import * as THREE from 'three';

function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
let dotTex = null;
function dot() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 32, 32); dotTex = new THREE.CanvasTexture(c); return dotTex;
}
const keep = (o) => { o.userData.noBatch = true; o.userData.noAudit = true; o.userData.guide = true; o.frustumCulled = false; return o; };   /* moving light and life: not scenery to merge or rest */

export function flock(parent, { n = 8, at = [0, 0], h = 12, r = 14, color = 0x1a1612, size = 0.5, speed = 0.22, seed = 1 } = {}) {
  const birds = [], m = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: true }), R = rng(seed);
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-size, 0, 0, 0, 0, size * 0.25, 0, 0, -size * 0.2, size, 0, 0, 0, 0, size * 0.25, 0, 0, -size * 0.2], 3));
    const b = keep(new THREE.Mesh(geo, m));
    b.userData.u = { ph: R() * 6.28, r: r * (0.55 + R() * 0.6), h: h + R() * 5, sp: speed * (0.8 + R() * 0.5), dir: R() < 0.8 ? 1 : -1 };
    parent.add(b); birds.push(b);
  }
  return (t) => {
    for (const b of birds) {
      const u = b.userData.u, a = t * u.sp * u.dir + u.ph;
      b.position.set(at[0] + Math.cos(a) * u.r, u.h + Math.sin(t * 0.4 + u.ph) * 1.5, at[1] + Math.sin(a) * u.r);
      b.rotation.y = -a * u.dir + (u.dir > 0 ? 0 : Math.PI);
      const f = Math.sin(t * 10 + u.ph * 3) * (Math.sin(t * 0.8 + u.ph) > -0.2 ? 0.4 : 0.06) * size, p = b.geometry.attributes.position;
      p.setY(0, f); p.setY(3, f); p.needsUpdate = true;
    }
  };
}

function points(parent, n, color, size, place) {
  const pos = new Float32Array(n * 3), geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size, map: dot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: 1 });
  const p = keep(new THREE.Points(geo, mat)); parent.add(p);
  return { p, pos, geo, mat };
}

export function fireflies(parent, { n = 40, area = [-10, -10, 10, 10], y = [0.3, 1.6], color = 0xd8ff7a, size = 0.12, seed = 3, on = () => true } = {}) {
  const P = points(parent, n, color, size), R = rng(seed), B = [];
  for (let i = 0; i < n; i++) B.push({ x: area[0] + R() * (area[2] - area[0]), z: area[1] + R() * (area[3] - area[1]), y: y[0] + R() * (y[1] - y[0]), ph: R() * 6.28, sp: 0.3 + R() * 0.5 });
  return (t) => {
    const show = on(); P.p.visible = show; if (!show) return;
    for (let i = 0; i < n; i++) {
      const b = B[i], blink = Math.max(0, Math.sin(t * b.sp * 2.2 + b.ph)) ** 4;
      P.pos[i * 3] = b.x + Math.sin(t * b.sp + b.ph) * 0.8; P.pos[i * 3 + 1] = blink > 0.02 ? b.y + Math.sin(t * 0.7 + b.ph) * 0.3 : -50; P.pos[i * 3 + 2] = b.z + Math.cos(t * b.sp * 0.8 + b.ph) * 0.8;
    }
    P.geo.attributes.position.needsUpdate = true;
  };
}

export function motes(parent, { n = 60, box = [-1, 0.5, -1, 1, 2.5, 1], color = 0xffe2b0, size = 0.025, seed = 5 } = {}) {
  const P = points(parent, n, color, size), R = rng(seed), B = [];
  P.mat.opacity = 0.55;
  for (let i = 0; i < n; i++) B.push({ x: R(), y: R(), z: R(), ph: R() * 6.28, sp: 0.03 + R() * 0.05 });
  const [x0, y0, z0, x1, y1, z1] = box;
  return (t) => {
    for (let i = 0; i < n; i++) {
      const b = B[i], yy = (b.y + t * b.sp * 0.2) % 1;
      P.pos[i * 3] = x0 + (x1 - x0) * (b.x + Math.sin(t * b.sp * 4 + b.ph) * 0.05); P.pos[i * 3 + 1] = y0 + (y1 - y0) * yy; P.pos[i * 3 + 2] = z0 + (z1 - z0) * (b.z + Math.cos(t * b.sp * 3 + b.ph) * 0.05);
    }
    P.geo.attributes.position.needsUpdate = true;
  };
}
