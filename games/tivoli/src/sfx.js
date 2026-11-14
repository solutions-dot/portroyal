/* games/tivoli/src/sfx.js: gunfire sounds made in code, for the May 2010 street scene. Everything is Web Audio noise and tones (engine/audio.js), no files.
   shot(pan, far, calm): one gunshot. A sharp crack, a short boom and a low thump; `far` (0 near, 1 far) makes it softer, duller and later.
   rattle(pan): a few quick shots far away. ring(): a thin high tone that fades, for the end of the scene. Calm mode makes everything about a third as loud. */
import { AU, noiseHit, tone } from '../../../engine/audio.js';

const ok = () => AU.ctx && AU.on && AU.ctx.state === 'running';
let lastShot = 0;

export function shot(pan = 0, far = 0, calm = false, kind = 'rifle') {
  if (!ok()) return; const now = performance.now(); if (now - lastShot < 35) return; lastShot = now;   /* at most about 28 shots a second */
  const v = (calm ? 0.3 : 1) * (1 - 0.6 * far), d = far * 0.12 * (0.8 + Math.random() * 0.4), f = kind === 'pistol' ? 1.25 : 1;
  noiseHit((2600 - far * 1500) * f, 1.1, 0.04, 0.5 * v, pan, d);                    /* the crack */
  noiseHit((900 - far * 500) * f, 0.7, 0.16 + far * 0.1, 0.45 * v, pan, d + 0.01);   /* the body of the shot */
  tone(110 * (2 - f * 0.6), 38, 0.22, 'sine', 0.35 * v, pan, d);                     /* the thump */
}
export function rattle(pan = 0, calm = false) { for (let i = 0; i < 3 + (Math.random() * 3 | 0); i++) setTimeout(() => shot(pan + (Math.random() - 0.5) * 0.3, 0.9, calm), i * (60 + Math.random() * 90)); }
export function ring(calm = false) { if (!ok()) return; tone(3300, 3100, 2.6, 'sine', (calm ? 0.01 : 0.03), 0, 0); }
