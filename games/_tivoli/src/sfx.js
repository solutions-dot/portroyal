/* games/_tivoli/src/sfx.js: gunfire sounds made in code, for the May 2010 street scene. Everything is Web Audio noise and tones (engine/audio.js), no files.
   shot(pan, far, calm): one gunshot. A sharp crack, a short boom and a low thump; `far` (0 near, 1 far) makes it softer, duller and later.
   rattle(pan): a few quick shots far away. ring(): a thin high tone that fades, for the end of the scene. Calm mode makes everything about a third as loud. */
import { AU, noiseHit, tone, setG, chirp } from '../../../engine/audio.js';

const ok = () => AU.ctx && AU.on && AU.ctx.state === 'running';
let lastShot = 0;

/* An echo off the buildings: a short burst of decaying noise (1.4 s) used as a reverb, with every shot sending a little of its sound to it. Made once. */
let VERB = null;
function verb() {
  if (VERB || !AU.ctx) return VERB; const c = AU.ctx, len = Math.floor(c.sampleRate * 1.4), buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) { const t = i / len; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2) * (i < c.sampleRate * 0.03 ? i / (c.sampleRate * 0.03) : 1); } }
  const conv = c.createConvolver(); conv.buffer = buf; const g = c.createGain(); g.gain.value = 0.55; conv.connect(g); g.connect(AU.master); VERB = conv; return VERB;
}
function hit(freq, q, dur, vol, pan, delay, wet) {   /* a noise burst through a band-pass, with a send to the echo */
  const c = AU.ctx, t0 = c.currentTime + 0.02 + delay, src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null;
  src.buffer = AU.crack; src.playbackRate.value = 0.5; bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q; g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  src.connect(bp); bp.connect(g); if (p) { p.pan.value = pan; g.connect(p); p.connect(AU.master); if (wet) { const send = c.createGain(); send.gain.value = wet; p.connect(send); send.connect(verb()); } } else g.connect(AU.master);
  src.start(t0); src.stop(t0 + dur + 0.05);
}
export function shot(pan = 0, far = 0, calm = false, kind = 'rifle') {
  if (!ok()) return; const now = performance.now(); if (now - lastShot < 35) return; lastShot = now;   /* at most about 28 shots a second */
  const v = (calm ? 0.3 : 1) * (1 - 0.6 * far), d = far * 0.12 * (0.8 + Math.random() * 0.4), f = kind === 'pistol' ? 1.25 : 1;
  hit((2600 - far * 1500) * f, 1.1, 0.04, 0.5 * v, pan, d, 0.5);                    /* the crack */
  hit((900 - far * 500) * f, 0.7, 0.16 + far * 0.1, 0.45 * v, pan, d + 0.01, 0.9);   /* the body of the shot, with the echo off the buildings */
  tone(110 * (2 - f * 0.6), 38, 0.22, 'sine', 0.35 * v, pan, d);                     /* the thump */
}
export function rattle(pan = 0, calm = false) { for (let i = 0; i < 3 + (Math.random() * 3 | 0); i++) setTimeout(() => shot(pan + (Math.random() - 0.5) * 0.3, 0.9, calm), i * (60 + Math.random() * 90)); }
export function ring(calm = false) { if (!ok()) return; tone(3300, 3100, 2.6, 'sine', (calm ? 0.01 : 0.03), 0, 0); }

/* a footstep on the road: a dull tap, louder for those nearer */
export function step(pan = 0, vol = 0.1, calm = false) { if (!ok()) return; hit(230 + Math.random() * 60, 0.9, 0.07, vol * (calm ? 0.4 : 1), pan, 0, 0.1); }
/* the street before the shooting: a breeze, far-off city, now and then a bird and a dog (all made in code). Call ambience(on, calm) at the start and end of the scene. */
let birdT = 0, dogT = 0;
export function ambience(on, calm = false) {
  if (!AU.ctx || !AU.ch) return; setG(AU.ch.wind, on ? (calm ? 0.04 : 0.09) : 0, 1.2); setG(AU.ch.crowd, on ? 0.025 : 0, 1.5);
}
export function bark(pan = 0.5, calm = false) { if (!ok()) return; const v = calm ? 0.04 : 0.1; tone(420, 260, 0.13, 'sawtooth', v, pan); tone(380, 220, 0.12, 'sawtooth', v * 0.8, pan, 0.19); hit(900, 1.2, 0.1, v * 0.6, pan, 0, 0.5); }
/* called every frame by the scene while it is quiet (before contact): returns nothing; sounds are spaced at random */
export function quietLife(dt, calm = false) { birdT -= dt; dogT -= dt; if (birdT <= 0) { birdT = 1.5 + Math.random() * 2.5; if (ok()) chirp(); } if (dogT <= 0) { dogT = 6 + Math.random() * 6; bark(Math.random() * 1.6 - 0.8, calm); } }
