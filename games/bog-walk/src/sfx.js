/* games/bog-walk/src/sfx.js: the sounds inside the Tube, made in code on top of engine/audio.js (no audio files).
   Everything is sent through one short echo, because a long iron pipe rings. Beds: a low rumble, moving air, a trickle,
   and a roar of water that grows as the pipe fills. One-shots: drips, scraping, voices heard from far off, a torch going out, a clank. */
import { AU, out, chan, setG } from '../../../engine/audio.js';

const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
const B = {};   /* made after the first tap */
let echoIn = null, noiseBuf = null;

export function initTubeSound() {
  if (!AU.ctx || B.ok) return; const c = AU.ctx; B.ok = true;
  /* the echo: a delay that feeds back on itself through a low-pass filter, so each repeat is duller and quieter */
  echoIn = c.createGain(); const d = c.createDelay(1.0), fb = c.createGain(), lp = c.createBiquadFilter(), wet = c.createGain();
  d.delayTime.value = 0.21; fb.gain.value = 0.42; lp.type = 'lowpass'; lp.frequency.value = 2200; wet.gain.value = 0.55;
  echoIn.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(AU.master);
  B.rumble = chan('brown', 'lowpass', 180); B.air = chan('white', 'bandpass', 520, 0.7); B.stream = chan('white', 'bandpass', 3200, 1.4);
  B.roar = chan('brown', 'lowpass', 420); B.rush = chan('white', 'bandpass', 1100, 0.5);
  const n = c.sampleRate * 0.6 | 0; noiseBuf = c.createBuffer(1, n, c.sampleRate); const dd = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) dd[i] = Math.random() * 2 - 1;
  /* a low drone for tension: two soft notes a fifth apart, the filter wobbling slowly */
  const d1 = c.createOscillator(), d2 = c.createOscillator(), dl = c.createBiquadFilter(), dg = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
  d1.type = 'sine'; d1.frequency.value = 55; d2.type = 'triangle'; d2.frequency.value = 82.4; dl.type = 'lowpass'; dl.frequency.value = 240; lfo.frequency.value = 0.17; lg.gain.value = 70; dg.gain.value = 0;
  lfo.connect(lg); lg.connect(dl.frequency); d1.connect(dl); d2.connect(dl); dl.connect(dg); dg.connect(AU.master); d1.start(); d2.start(); lfo.start(); B.drone = dg;
  B.levels = { rumble: 0, air: 0, stream: 0, roar: 0, rush: 0, drone: 0 };
}
export function setBeds(l, tc = 0.5) { if (!AU.ctx || !B.ok) return; for (const k of ['rumble', 'air', 'stream', 'roar', 'rush', 'drone']) { const v = l[k] || 0; if (B.levels[k] !== v) { B.levels[k] = v; setG(B[k], v, tc); } } }
export function hushTube(tc = 0.4) { setBeds({}, tc); }

/* a sound that goes to the speakers and, a little quieter, into the echo */
function send(pan, amount) { const g = out(pan), s = AU.ctx.createGain(); s.gain.value = amount; g.connect(s); s.connect(echoIn); return g; }

export function drip() {   /* one drop of water falling a long way into a puddle */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.02, pan = Math.random() * 1.4 - 0.7, g = send(pan, 0.8), o = c.createOscillator(), og = c.createGain(), f = 1300 + Math.random() * 700;
  o.type = 'sine'; o.frequency.setValueAtTime(f, t0); o.frequency.exponentialRampToValueAtTime(f * 0.45, t0 + 0.08); og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(0.13, t0 + 0.006); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
  o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 0.14);
}
export function scrapeSound() {   /* three strokes of a scraper on iron */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.02;
  for (let i = 0; i < 3; i++) { const t = t0 + i * 0.42, src = c.createBufferSource(), bp = c.createBiquadFilter(), g = send(-0.1 + i * 0.1, 0.35); src.buffer = noiseBuf; src.loop = true;
    bp.type = 'bandpass'; bp.Q.value = 1.3; bp.frequency.setValueAtTime(2300, t); bp.frequency.linearRampToValueAtTime(4300, t + 0.34);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.05); g.gain.setValueAtTime(0.16, t + 0.26); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    src.connect(bp); bp.connect(g); src.start(t); src.stop(t + 0.4); }
}
export function voice(pan = 0, far = false) {   /* someone speaking, heard but not understood: two low buzzing notes through a vowel-like filter, rising and falling */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.03, len = 0.9 + Math.random() * 0.5, g = send(pan, far ? 0.9 : 0.5), base = 100 + Math.random() * 30;
  const lp = c.createBiquadFilter(), f1 = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = far ? 900 : 1600; f1.type = 'bandpass'; f1.frequency.value = 600; f1.Q.value = 1.2;
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(far ? 0.035 : 0.07, t0 + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
  for (const k of [1, 1.51]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(base * k, t0); o.frequency.linearRampToValueAtTime(base * k * 1.12, t0 + len * 0.4); o.frequency.linearRampToValueAtTime(base * k * 0.94, t0 + len); o.connect(f1); o.start(t0); o.stop(t0 + len + 0.05); }
  f1.frequency.setValueAtTime(500, t0); f1.frequency.linearRampToValueAtTime(900, t0 + len * 0.5); f1.frequency.linearRampToValueAtTime(560, t0 + len); f1.connect(lp); lp.connect(g);
}
export function hiss() {   /* a torch going out: a short hiss of steam */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.02, src = c.createBufferSource(), hp = c.createBiquadFilter(), g = send(0, 0.5);
  src.buffer = noiseBuf; src.loop = true; hp.type = 'highpass'; hp.frequency.value = 3200; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
  src.connect(hp); hp.connect(g); src.start(t0); src.stop(t0 + 0.75);
}
export function clank() {   /* iron knocking on iron, a long way off */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.03, pan = Math.random() * 1.6 - 0.8, g = send(pan, 1.0), f = 380 + Math.random() * 260;
  for (const [k, v] of [[1, 0.06], [2.76, 0.03], [5.4, 0.015]]) { const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = f * k; og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(v, t0 + 0.004); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9); o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 0.95); }
}

/* A foot in water. The engine has its own stepSound('water'), but it sets the sound's buffer twice, which browsers refuse, so it throws.
   This one is used here instead (see docs/games/bog-walk.md). Deeper water makes a lower, heavier slosh. */
export function waterStep(depth = 0.1) {
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.005, src = c.createBufferSource(), f = c.createBiquadFilter(), g = send(Math.random() * 0.3 - 0.15, 0.4), deep = Math.min(1, depth / 0.8);
  src.buffer = noiseBuf; src.loop = true; f.type = 'bandpass'; f.Q.value = 0.8;
  f.frequency.setValueAtTime(500 - 220 * deep, t0); f.frequency.exponentialRampToValueAtTime(1800 - 900 * deep, t0 + 0.12); f.frequency.exponentialRampToValueAtTime(700 - 300 * deep, t0 + 0.5);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.22 + 0.12 * deep, t0 + 0.07); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55 + 0.25 * deep);
  src.connect(f); f.connect(g); src.start(t0); src.stop(t0 + 0.85);
}

/* cinematic sounds */
export function heartbeat(vol = 0.16) {   /* a soft heartbeat, lub-dub */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.02;
  for (const [dt, v] of [[0, 1], [0.2, 0.7]]) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(72, t0 + dt); o.frequency.exponentialRampToValueAtTime(38, t0 + dt + 0.14);
    g.gain.setValueAtTime(0.0001, t0 + dt); g.gain.exponentialRampToValueAtTime(vol * v, t0 + dt + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.2); o.connect(g); g.connect(AU.master); o.start(t0 + dt); o.stop(t0 + dt + 0.25); }
}
export function boom() {   /* a deep boom with a rumble, when the first rush of water is heard far off */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.03, o = c.createOscillator(), g = send(0, 0.7), src = c.createBufferSource(), lp = c.createBiquadFilter(), ng = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(64, t0); o.frequency.exponentialRampToValueAtTime(28, t0 + 1.2); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6); o.connect(g); o.start(t0); o.stop(t0 + 1.7);
  src.buffer = noiseBuf; src.loop = true; lp.type = 'lowpass'; lp.frequency.value = 260; ng.gain.setValueAtTime(0.0001, t0); ng.gain.exponentialRampToValueAtTime(0.22, t0 + 0.12); ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8); src.connect(lp); lp.connect(ng); ng.connect(AU.master); src.start(t0); src.stop(t0 + 1.9);
}
export function airSwell(dur = 2.4) {   /* cool air rushing down the manhole as you climb: a soft rising whoosh */
  if (!live() || !B.ok) return; const c = AU.ctx, t0 = c.currentTime + 0.03, src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
  src.buffer = noiseBuf; src.loop = true; bp.type = 'bandpass'; bp.Q.value = 0.6; bp.frequency.setValueAtTime(350, t0); bp.frequency.exponentialRampToValueAtTime(2600, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.6); src.connect(bp); bp.connect(g); g.connect(AU.master); src.start(t0); src.stop(t0 + dur + 0.7);
}
