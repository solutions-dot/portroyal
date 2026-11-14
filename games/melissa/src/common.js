/* games/melissa/src/common.js: pieces shared by the places: times of day (including the storm's skies) and the ground. */
import * as THREE from 'three';
import { T, std, mesh } from './gfx.js';

/* ---------- times of day and weather ---------- */
export const ENV = {
  morning: { top: 0x6fb0e2, hor: 0xf1dcb8, fog: 0xe4d6bd, fogN: 70, fogF: 260, hemi: [0xfff1d8, 0x7a6a50, 1.9], sun: [0xffdca8, 2.1, [-30, 20, -14]], stars: 0, moon: 0 },
  day: { top: 0x58a6e4, hor: 0xd6eaf0, fog: 0xcfe2e6, fogN: 80, fogF: 280, hemi: [0xeaf4ff, 0x8a7a5a, 2.1], sun: [0xfff2dc, 2.4, [20, 30, 10]], stars: 0, moon: 0 },
  gold: { top: 0x4c7cc0, hor: 0xf6c27c, fog: 0xe2b98a, fogN: 50, fogF: 230, hemi: [0xffe0b4, 0x6a5444, 1.7], sun: [0xffb464, 2.0, [-36, 10, 6]], stars: 0, moon: 0 },
  dusk: { top: 0x26356a, hor: 0xe08a62, fog: 0x8a6a6a, fogN: 30, fogF: 170, hemi: [0xe9b8a0, 0x3a3040, 1.1], sun: [0xff8a4a, 1.0, [-40, 5, 12]], stars: 0.35, moon: 0 },
  night: { top: 0x03050e, hor: 0x1b2744, fog: 0x0c1322, fogN: 4, fogF: 80, hemi: [0x5a6ca0, 0x161a24, 0.62], sun: [0x8ea8ff, 0.55, [30, 40, -20]], stars: 1, moon: 1 },
  dawn: { top: 0x44568a, hor: 0xf1b186, fog: 0xcfa790, fogN: 14, fogF: 170, hemi: [0xffdcc0, 0x54464a, 1.2], sun: [0xffa860, 1.1, [-40, 6, 0]], stars: 0.15, moon: 0 },
  hazy: { top: 0x7fa6c8, hor: 0xe6e2d2, fog: 0xdcd8c6, fogN: 50, fogF: 200, hemi: [0xf4f0e0, 0x8a7a5a, 1.9], sun: [0xfff0d0, 2.0, [14, 26, 12]], stars: 0, moon: 0 },
  /* the days before the storm: hot, still, a thin high haze */
  calm: { top: 0x6aa8d8, hor: 0xe8e4d0, fog: 0xdad8c8, fogN: 60, fogF: 240, hemi: [0xf6f0e0, 0x80725a, 1.9], sun: [0xfff0d0, 2.1, [16, 26, 12]], stars: 0, moon: 0 },
  /* the outer bands: low grey cloud, flat light, thick air */
  gale: { top: 0x58646c, hor: 0x929ea4, fog: 0x7f8a90, fogN: 14, fogF: 110, hemi: [0xd2dbe0, 0x4e5250, 1.25], sun: [0xe4eaee, 0.5, [18, 24, 10]], stars: 0, moon: 0 },
  /* the worst of it: dark green-grey, rain so thick you cannot see far */
  storm: { top: 0x2c343a, hor: 0x586266, fog: 0x4a5458, fogN: 3, fogF: 58, hemi: [0x9aa8b0, 0x2c3234, 0.85], sun: [0xaab4bc, 0.25, [18, 24, 10]], stars: 0, moon: 0 },
  /* the morning after: scrubbed air, a bright washed sky, warm light on a wrecked place */
  after: { top: 0x66a2cc, hor: 0xdfe0cc, fog: 0xc8cec0, fogN: 40, fogF: 210, hemi: [0xf0f2e4, 0x6c6650, 1.95], sun: [0xfff0cc, 2.2, [16, 30, 10]], stars: 0, moon: 0 },
  overcast: { top: 0x8ea2b0, hor: 0xcdd2cc, fog: 0xbec6c4, fogN: 30, fogF: 200, hemi: [0xe8eef0, 0x6a6a5a, 1.75], sun: [0xfff4e0, 0.9, [14, 26, 12]], stars: 0, moon: 0 },
  /* inside a building: the sky is not seen. Warm and low. */
  room: { top: 0x3a3a40, hor: 0x555560, fog: 0x2e2822, fogN: 10, fogF: 60, hemi: [0xffe6c4, 0x34302a, 1.25], sun: [0xffe0b0, 0.0, [10, 20, 10]], stars: 0, moon: 0 },
  roomStorm: { top: 0x20262a, hor: 0x3a4246, fog: 0x1c1e20, fogN: 4, fogF: 34, hemi: [0xc8b89a, 0x1e1c1a, 0.55], sun: [0x9aa8b0, 0.0, [10, 20, 10]], stars: 0, moon: 0 },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
export function mixEnv(a, b, k) {   /* between two times of day or two kinds of weather */
  const lc = (x, y) => _c1.set(x).lerp(_c2.set(y), k).getHex(), ln = (x, y) => x + (y - x) * k;
  return { top: lc(a.top, b.top), hor: lc(a.hor, b.hor), fog: lc(a.fog, b.fog), fogN: ln(a.fogN, b.fogN), fogF: ln(a.fogF, b.fogF),
    hemi: [lc(a.hemi[0], b.hemi[0]), lc(a.hemi[1], b.hemi[1]), ln(a.hemi[2], b.hemi[2])], sun: [lc(a.sun[0], b.sun[0]), ln(a.sun[1], b.sun[1]), a.sun[2].map((v, i) => ln(v, b.sun[2][i]))], stars: ln(a.stars, b.stars), moon: ln(a.moon, b.moon) };
}

/* a big flat ground at y, with a tiled texture */
export function groundPlane(parent, y, size = 900, tex = T.grass([180, 180]), tint) {
  const m = mesh(new THREE.PlaneGeometry(size, size), std(tex, 1, tint ? { color: tint } : undefined), 0, y, 0, parent); m.rotation.x = -Math.PI / 2; return m;
}
