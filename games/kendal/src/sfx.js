/* games/kendal/src/sfx.js: the railway's sounds, made in code on top of engine/audio.js (no audio files).
   Steam and diesel horns, wheel clatter, brakes, the crash, a ringing in the ears, bells, crickets and a little mento band. */
import { AU, out, tone, noiseHit, chan, noiseSrc, setG } from '../../../engine/audio.js';

const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
const B = {};   /* beds made after the first tap: wheel rumble, engine idle, crickets, the ringing */

export function initBeds() {
  if (!AU.ctx || B.ok) return; const c = AU.ctx; B.ok = true;
  B.rumble = chan('brown', 'lowpass', 210); B.rumble.gain.value = 0;
  B.rush = chan('white', 'bandpass', 1400, 0.5); B.rush.gain.value = 0;   /* air rushing past the windows */
  /* a diesel engine ticking over: a low saw with a slow wobble in its loudness, over brown noise */
  const o = c.createOscillator(), og = c.createGain(), lf = c.createOscillator(), lg = c.createGain(), lp = c.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = 44; lf.frequency.value = 11; lg.gain.value = 0.35; lf.connect(lg); lg.connect(og.gain); og.gain.value = 0.5; lp.type = 'lowpass'; lp.frequency.value = 180; o.connect(og); og.connect(lp);
  B.idle = c.createGain(); B.idle.gain.value = 0; lp.connect(B.idle); B.idle.connect(AU.master); o.start(); lf.start();
  /* crickets: a high tone chopped fast, and a slower chop on top */
  const co = c.createOscillator(), cg = c.createGain(), ch = c.createOscillator(), chg = c.createGain(), ch2 = c.createOscillator(), ch2g = c.createGain(); co.frequency.value = 4300; ch.type = 'square'; ch.frequency.value = 24; chg.gain.value = 0.5; ch2.type = 'square'; ch2.frequency.value = 3.1; ch2g.gain.value = 0.5;
  cg.gain.value = 0.5; ch.connect(chg); chg.connect(cg.gain); ch2.connect(ch2g); ch2g.connect(cg.gain); const cl = c.createGain(); cl.gain.value = 0; co.connect(cg); cg.connect(cl); cl.connect(AU.master); B.cricket = cl; co.start(); ch.start(); ch2.start();
  /* a thin ringing, as after a very loud sound */
  const ro = c.createOscillator(), rg = c.createGain(); ro.frequency.value = 4100; rg.gain.value = 0; ro.connect(rg); rg.connect(AU.master); ro.start(); B.ring = rg;
  B.levels = { rumble: 0, rush: 0, idle: 0, cricket: 0, ring: 0 };
}
export function setBeds(l, tc = 0.4) { if (!AU.ctx || !B.ok) return; for (const k of ['rumble', 'rush', 'idle', 'cricket', 'ring']) { const v = l[k] || 0; if (B.levels[k] !== v) { B.levels[k] = v; setG(B[k], v, tc); } } }
export function hush(tc = 0.15) { setBeds({}, tc); for (const k of ['sea', 'surf', 'wind', 'crowd', 'room']) if (AU.ch[k]) setG(AU.ch[k], 0, tc); }

/* ---------- one-shots ---------- */
export function whistleSteam(len = 0.9, vol = 0.22) {   /* a steam whistle: two notes together, a breath of air on top */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.03, d = out(0);
  for (const f of [392, 494]) { const o = c.createOscillator(), g = c.createGain(), v = c.createOscillator(), vg = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 0.97, t0); o.frequency.exponentialRampToValueAtTime(f, t0 + 0.08); o.frequency.setValueAtTime(f, t0 + len - 0.1); o.frequency.exponentialRampToValueAtTime(f * 0.93, t0 + len + 0.2); v.frequency.value = 6; vg.gain.value = 3; v.connect(vg); vg.connect(o.frequency);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.06); g.gain.setValueAtTime(vol, t0 + len - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len + 0.25); o.connect(lp); lp.connect(g); g.connect(d); o.start(t0); v.start(t0); o.stop(t0 + len + 0.3); v.stop(t0 + len + 0.3); }
  noiseHit(2600, 0.8, len, vol * 0.25, 0); }
export function hornDiesel(len = 1.2, vol = 0.26) {   /* a diesel horn: two deep notes with a little growl */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.03, d = out(0);
  for (const f of [262, 330]) { const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * 0.97, t0 + len); lp.type = 'lowpass'; lp.frequency.value = 1100; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.05); g.gain.setValueAtTime(vol, t0 + len - 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len + 0.2); o.connect(lp); lp.connect(g); g.connect(d); o.start(t0); o.stop(t0 + len + 0.25); } }
export function threeBlasts(horn = hornDiesel) { for (let i = 0; i < 3; i++) setTimeout(() => horn(0.75, 0.34), i * 1000); }
export function screech(dur = 3.2) {   /* brakes biting: a sliding high squeal over a hiss of grit */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.02, d = out(0);
  const src = c.createBufferSource(); const len = c.sampleRate * dur, b = c.createBuffer(1, len, c.sampleRate), dd = b.getChannelData(0); for (let i = 0; i < len; i++) dd[i] = Math.random() * 2 - 1; src.buffer = b;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 6; bp.frequency.setValueAtTime(3600, t0); bp.frequency.linearRampToValueAtTime(2300, t0 + dur); const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.3); g.gain.setValueAtTime(0.35, t0 + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); src.connect(bp); bp.connect(g); g.connect(d); src.start(t0);
  for (const [f0, f1, v] of [[2100, 1500, 0.07], [1650, 1250, 0.05]]) { const o = c.createOscillator(), og = c.createGain(), lf = c.createOscillator(), lg = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t0); o.frequency.linearRampToValueAtTime(f1, t0 + dur); lf.frequency.value = 9; lg.gain.value = 60; lf.connect(lg); lg.connect(o.frequency); og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(v, t0 + 0.4); og.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(og); og.connect(d); o.start(t0); lf.start(t0); o.stop(t0 + dur + 0.05); lf.stop(t0 + dur + 0.05); } }
export function crashBang() {   /* the crash: a huge low thump, a crack, then timber and metal tumbling */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.02, d = out(0);
  tone(110, 28, 1.6, 'sine', 0.8, 0); tone(70, 24, 2.2, 'triangle', 0.5, 0);
  const src = c.createBufferSource(); const len = c.sampleRate * 3.2, b = c.createBuffer(1, len, c.sampleRate), dd = b.getChannelData(0); let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.04 * (Math.random() * 2 - 1)) / 1.04; dd[i] = (l * 3.2 + (Math.random() * 2 - 1) * 0.35) * Math.pow(1 - i / len, 1.6); } src.buffer = b;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(2400, t0); lp.frequency.exponentialRampToValueAtTime(220, t0 + 3); const g = c.createGain(); g.gain.value = 1.2; src.connect(lp); lp.connect(g); g.connect(d); src.start(t0);
  for (let i = 0; i < 14; i++) { const t = 0.05 + Math.random() * 1.8; noiseHit(300 + Math.random() * 2400, 3 + Math.random() * 4, 0.08 + Math.random() * 0.2, 0.18 + Math.random() * 0.25, Math.random() * 1.6 - 0.8, t); }
  for (const [f, t] of [[420, 0.02], [610, 0.12], [330, 0.3], [880, 0.5]]) tone(f, f * 0.92, 0.9, 'triangle', 0.08, Math.random() - 0.5, t); }
export function clack(speed = 1) { if (!live()) return; const p = Math.random() * 0.2 - 0.1, v = Math.min(1, 0.4 + speed * 0.04); noiseHit(260, 2.5, 0.07, 0.2 * v, p); tone(78, 50, 0.1, 'sine', 0.11 * v, p); noiseHit(300, 2.5, 0.07, 0.17 * v, p, 0.16); tone(82, 52, 0.1, 'sine', 0.09 * v, p, 0.16); }   /* the front and rear wheels over a rail joint */
export function chuff(v = 0.2) { if (!live()) return; noiseHit(420, 0.5, 0.2, v, 0); tone(95, 55, 0.14, 'sine', v * 0.35, 0); }
export function hiss(dur = 1.6, vol = 0.12) { if (!live()) return; noiseHit(5200, 0.4, dur, vol, 0.2); noiseHit(3200, 0.5, dur * 0.8, vol * 0.7, -0.2); }
export function bell(f = 520, n = 2, gap = 0.5, vol = 0.07) { if (!live()) return; for (let i = 0; i < n; i++) { tone(f, f * 0.995, 0.9, 'sine', vol, 0.3, i * gap); tone(f * 2.32, f * 2.3, 0.5, 'sine', vol * 0.4, 0.3, i * gap); } }
export function stationGong() { bell(660, 3, 0.55, 0.06); }
export function churchBell(n = 3) { if (!live()) return; for (let i = 0; i < n; i++) for (const [m, v] of [[1, 0.1], [2.0, 0.05], [2.76, 0.035], [4.1, 0.02]]) tone(196 * m, 196 * m * 0.998, 3.2, 'sine', v, 0, i * 2.2); }
export function fanfare() {   /* a short brass phrase to open the day of the first train */
  if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.05, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600; lp.connect(AU.master);
  for (const [f, t, d] of [[392, 0, 0.35], [392, 0.45, 0.35], [440, 0.9, 0.7], [370, 1.7, 0.35], [392, 2.15, 0.35], [440, 2.6, 0.35], [494, 3.05, 0.9]]) for (const det of [0, 9]) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det; g.gain.setValueAtTime(0.0001, t0 + t); g.gain.exponentialRampToValueAtTime(0.045, t0 + t + 0.05); g.gain.setValueAtTime(0.045, t0 + t + d * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + d); o.connect(g); g.connect(lp); o.start(t0 + t); o.stop(t0 + t + d + 0.05); } }
export function pluck(f, vol = 0.07, pan = 0) { if (!live()) return; tone(f, f * 0.99, 0.28, 'triangle', vol, pan); tone(f * 2, f * 1.99, 0.12, 'sine', vol * 0.35, pan); }
export function thump(vol = 0.16) { if (!live()) return; tone(110, 70, 0.22, 'sine', vol, -0.2); noiseHit(180, 1.5, 0.08, vol * 0.4, -0.2); }

/* a little mento band: a rumba-box bass on the beat, a banjo strumming the chords. Call mentoTick(now) each frame while it plays. */
const MENTO = { next: 0, i: 0, on: false };
export function mento(on) { MENTO.on = on; MENTO.next = 0; }
export function mentoTick(now) {
  if (!MENTO.on || !live() || now < MENTO.next) return; MENTO.next = now + 0.27; const i = MENTO.i++ % 16, bar = (i / 4) | 0, ch = [[196, 247, 294], [262, 330, 392], [196, 247, 294], [294, 370, 440]][bar];   /* G, C, G, D */
  if (i % 4 === 0 || i % 4 === 2) thump(0.12); if (i % 2 === 1) for (const f of ch) pluck(f * 2, 0.025, 0.25);
}

/* a mule's snort and the creak of a load settling on the pack frame */
export function snort() { if (!live()) return; noiseHit(520, 0.8, 0.28, 0.14, -0.2); tone(150, 90, 0.3, 'sawtooth', 0.03, -0.2, 0.02); }
export function settle() { if (!live()) return; tone(95, 60, 0.18, 'sine', 0.16, -0.3); noiseHit(260, 2, 0.1, 0.12, -0.3); tone(210, 175, 0.4, 'sawtooth', 0.018, -0.3, 0.1); }
