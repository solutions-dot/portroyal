/* games/nanny/src/sfx.js: the sounds of the mountain, made in code on top of engine/audio.js (no audio files).
   The horn, guns heard from far away, a soldiers' drum and trumpet, night insects, a stream, a fire, an owl, a low whistle. */
import { AU, out, tone, noiseHit, chan, setG } from '../../../engine/audio.js';

const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
const B = {};   /* beds made after the first tap */
export function initBeds() {
  if (!AU.ctx || B.ok) return; const c = AU.ctx; B.ok = true;
  B.stream = chan('white', 'bandpass', 1500, 0.5); B.stream.gain.value = 0;
  B.fire = chan('brown', 'bandpass', 520, 0.7); B.fire.gain.value = 0;
  B.rumble = chan('brown', 'lowpass', 150); B.rumble.gain.value = 0;
  /* night insects: a high tone chopped fast, with a slower chop on top */
  const co = c.createOscillator(), cg = c.createGain(), ch = c.createOscillator(), chg = c.createGain(), ch2 = c.createOscillator(), ch2g = c.createGain(); co.frequency.value = 4500; ch.type = 'square'; ch.frequency.value = 22; chg.gain.value = 0.5; ch2.type = 'square'; ch2.frequency.value = 2.7; ch2g.gain.value = 0.5;
  cg.gain.value = 0.5; ch.connect(chg); chg.connect(cg.gain); ch2.connect(ch2g); ch2g.connect(cg.gain); const cl = c.createGain(); cl.gain.value = 0; co.connect(cg); cg.connect(cl); cl.connect(AU.master); B.cricket = cl; co.start(); ch.start(); ch2.start();
  B.levels = { stream: 0, fire: 0, rumble: 0, cricket: 0 };
}
export function setBeds(l, tc = 0.5) { if (!AU.ctx || !B.ok) return; for (const k of ['stream', 'fire', 'rumble', 'cricket']) { const v = l[k] || 0; if (B.levels[k] !== v) { B.levels[k] = v; setG(B[k], v, tc); } } }

/* ---------- the horn. A call is a list of notes: 'L' long, 'S' short. far: 0 (beside you) to 1 (across the valley). Returns how long it lasts. ---------- */
export const NOTE = { L: 0.95, S: 0.3, GAP: 0.22 };
export function callLength(pattern) { let t = 0; for (const n of pattern) t += NOTE[n] + NOTE.GAP; return t; }
export function hornNote(len = 0.9, { far = 0, pan = 0, pitch = 330, delay = 0, vol = 0.3 } = {}) {
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.03 + delay, d = out(pan), v = vol * (1 - far * 0.72);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500 - far * 900; const bp = c.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = pitch * 2.5; bp.Q.value = 2; bp.gain.value = 7; lp.connect(bp); bp.connect(d);
  for (const [mul, typ, k] of [[1, 'sawtooth', 1], [2.01, 'triangle', 0.35], [0.5, 'sine', 0.3]]) { const o = c.createOscillator(), g = c.createGain(), vb = c.createOscillator(), vg = c.createGain(); o.type = typ;
    o.frequency.setValueAtTime(pitch * mul * 0.9, t0); o.frequency.exponentialRampToValueAtTime(pitch * mul, t0 + 0.09); o.frequency.setValueAtTime(pitch * mul, t0 + Math.max(0.1, len - 0.12)); o.frequency.exponentialRampToValueAtTime(pitch * mul * 0.95, t0 + len + 0.1);
    vb.frequency.value = 5.2; vg.gain.value = pitch * 0.012; vb.connect(vg); vg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v * k, t0 + 0.07); g.gain.setValueAtTime(v * k, t0 + Math.max(0.08, len - 0.06)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len + 0.16); o.connect(g); g.connect(lp); o.start(t0); vb.start(t0); o.stop(t0 + len + 0.2); vb.stop(t0 + len + 0.2); }
  noiseHit(900, 0.6, len, v * 0.1, pan, delay);
  if (far > 0.3) { hornEcho(len, pitch, pan, delay + 0.34, v * 0.35); }
}
function hornEcho(len, pitch, pan, delay, v) { if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.03 + delay, o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(), d = out(-pan * 0.6); o.type = 'triangle'; o.frequency.value = pitch; lp.type = 'lowpass'; lp.frequency.value = 500; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len + 0.3); o.connect(lp); lp.connect(g); g.connect(d); o.start(t0); o.stop(t0 + len + 0.35); }
export function hornCall(pattern, opts = {}) { let t = opts.delay || 0; for (const n of pattern) { hornNote(NOTE[n], { ...opts, delay: t }); t += NOTE[n] + NOTE.GAP; } return t; }
/* horns answering from all around the valley: several players, each a little later, quieter and from another side */
export function hornsAnswer(pattern, n = 4) { for (let i = 0; i < n; i++) hornCall(pattern, { far: 0.45 + i * 0.13, pan: (i % 2 ? 1 : -1) * (0.3 + i * 0.15), pitch: 300 + ((i * 37) % 90), delay: 0.5 + i * 0.75 }); }

/* ---------- guns, heard from a distance. far: 0 near, 1 far ---------- */
export function musket(far = 0.4, pan = 0) {
  if (!live()) return; const v = 0.5 * (1 - far * 0.75); noiseHit(1800 - far * 900, 0.5, 0.09, v, pan); noiseHit(420, 0.6, 0.3, v * 0.7, pan, 0.02); tone(140, 50, 0.22, 'sine', v * 0.5, pan, 0.01);
  if (far > 0.25) { noiseHit(600, 0.5, 0.5, v * 0.25, -pan, 0.38); }   /* the echo off the far ridge */
}
export function swivelBoom(far = 0.3, pan = 0) {
  if (!live()) return; const v = 0.75 * (1 - far * 0.6); noiseHit(240, 0.5, 0.7, v, pan); noiseHit(1200, 0.5, 0.12, v * 0.6, pan); tone(90, 28, 0.9, 'sine', v * 0.9, pan, 0.01);
  noiseHit(300, 0.5, 1.4, v * 0.3, -pan, 0.55); noiseHit(220, 0.5, 1.6, v * 0.16, pan * 0.5, 1.3);
}
/* a soldiers' drum: a dry tap with a rattle. roll: a quick run of taps */
export function drumTap(vol = 0.2, pan = 0, delay = 0) { if (!live()) return; noiseHit(2400, 1.2, 0.07, vol, pan, delay); tone(190, 120, 0.09, 'triangle', vol * 0.6, pan, delay); }
export function drumMarch(bars = 2, vol = 0.14, pan = 0) { for (let b = 0; b < bars; b++) for (const [d, k] of [[0, 1], [0.42, 0.6], [0.84, 1], [1.05, 0.5], [1.26, 0.8]]) drumTap(vol * k, pan, b * 1.68 + d); }
export function trumpet(vol = 0.16, pan = 0) {   /* a short army call: four bright notes */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.03, d = out(pan), seq = [[392, 0.18], [523, 0.18], [659, 0.18], [523, 0.5]]; let t = t0;
  for (const [f, len] of seq) { const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = 'square'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 2200; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.setValueAtTime(vol, t + len - 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + len); o.connect(lp); lp.connect(g); g.connect(d); o.start(t); o.stop(t + len + 0.02); t += len + 0.03; }
}
/* small sounds */
export function whistle(vol = 0.1, pan = 0.3) { if (!live()) return; tone(880, 1180, 0.26, 'sine', vol, pan); tone(1180, 900, 0.3, 'sine', vol, pan, 0.3); }
export function owl(vol = 0.12, pan = -0.5) { if (!live()) return; tone(330, 300, 0.32, 'sine', vol, pan); tone(300, 250, 0.5, 'sine', vol, pan, 0.42); }
export function frog(vol = 0.05, pan = 0) { if (!live()) return; for (let i = 0; i < 3; i++) tone(2300, 2900, 0.07, 'sine', vol, pan, i * 0.16); }
export function knock(vol = 0.3) { if (!live()) return; for (let i = 0; i < 3; i++) { noiseHit(500, 2, 0.06, vol, 0, i * 0.17); tone(160, 110, 0.07, 'sine', vol * 0.8, 0, i * 0.17); } }
export function dig(vol = 0.2) { if (!live()) return; noiseHit(700, 0.7, 0.22, vol, 0); tone(120, 70, 0.16, 'sine', vol * 0.7, 0, 0.02); }
export function rustle(vol = 0.16, pan = 0) { if (!live()) return; noiseHit(3200, 0.5, 0.5, vol, pan); noiseHit(1800, 0.6, 0.35, vol * 0.7, pan, 0.12); }
export function chop(vol = 0.26) { if (!live()) return; for (let i = 0; i < 6; i++) { noiseHit(2600, 0.8, 0.07, vol * (0.6 + Math.random() * 0.4), (i % 2 ? 0.5 : -0.5), i * 0.07); } noiseHit(1500, 0.4, 1.2, vol * 0.8, 0, 0.3); }
export function cheer(vol = 0.2) { if (!live()) return; for (let i = 0; i < 9; i++) tone(260 + Math.random() * 260, 320 + Math.random() * 300, 0.5 + Math.random() * 0.5, 'sawtooth', vol * 0.12, Math.random() * 1.6 - 0.8, Math.random() * 0.9); noiseHit(1100, 0.5, 1.6, vol * 0.5, 0); }
