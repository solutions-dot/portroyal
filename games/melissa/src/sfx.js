/* games/melissa/src/sfx.js: the weather's and the village's sounds, made in code on top of engine/audio.js (no audio files).
   Beds (always running, we only turn them up and down): wind, a thin howl, a deep roar, rain, a rattling roof, a generator, a helicopter far off, a chainsaw, a hymn, crickets.
   One-shots: a zinc sheet banging, a tree cracking, a roof groaning, a gust, hammering, a radio being tuned, a phone, a bell. */
import { AU, out, tone, noiseHit, chan, noiseSrc, setG, shipCreak } from '../../../engine/audio.js';

const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
const B = {}, NAMES = ['wind', 'howl', 'roar', 'rain', 'rattle', 'gen', 'heli', 'saw', 'hymn', 'cricket'];

/* a slow wobble on any parameter: an oscillator through a gain onto the param */
function lfo(param, hz, depth, type = 'sine') { const c = AU.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = hz; g.gain.value = depth; o.connect(g); g.connect(param); o.start(); return o; }

export function initBeds() {
  if (!AU.ctx || B.ok) return; const c = AU.ctx; B.ok = true;
  /* wind: noise in a band, the band drifting, and the loudness gusting */
  B.wind = chan('white', 'bandpass', 520, 0.8); lfo(B.wind.f.frequency, 0.13, 260);
  /* a thin howl through gaps: a saw wave in a narrow moving band */
  { const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = 190; f.type = 'bandpass'; f.frequency.value = 760; f.Q.value = 9; g.gain.value = 0; lfo(f.frequency, 0.17, 320); lfo(o.frequency, 0.23, 40); o.connect(f); f.connect(g); g.connect(AU.master); o.start(); B.howl = g; }
  B.roar = chan('brown', 'lowpass', 300); lfo(B.roar.f.frequency, 0.1, 120);
  B.rain = chan('white', 'highpass', 2600); { const p = chan('white', 'bandpass', 1500, 0.5); B.rain2 = p; }
  /* a roof rattling: bandpass noise chopped hard by a fast square wave, with a slower chop on top. The chop is on its own gain stage, so at level 0 there is silence. */
  { const bp = c.createBiquadFilter(), am = c.createGain(), lv = c.createGain(), ch = c.createOscillator(), cg = c.createGain(), ch2 = c.createOscillator(), cg2 = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = 2300; bp.Q.value = 3; am.gain.value = 0.5; lv.gain.value = 0;
    ch.type = 'square'; ch.frequency.value = 11; cg.gain.value = 0.45; ch2.type = 'square'; ch2.frequency.value = 2.3; cg2.gain.value = 0.3; ch.connect(cg); cg.connect(am.gain); ch2.connect(cg2); cg2.connect(am.gain); ch.start(); ch2.start();
    noiseSrc('white').connect(bp); bp.connect(am); am.connect(lv); lv.connect(AU.master); B.rattle = lv; }
  /* a petrol generator: a low saw with a fast wobble in its loudness */
  { const o = c.createOscillator(), lp = c.createBiquadFilter(), am = c.createGain(), lv = c.createGain(); o.type = 'sawtooth'; o.frequency.value = 58; lp.type = 'lowpass'; lp.frequency.value = 420; am.gain.value = 0.6; lv.gain.value = 0; lfo(am.gain, 24, 0.4); o.connect(lp); lp.connect(am); am.connect(lv); lv.connect(AU.master); o.start(); B.gen = lv; B.genO = o; }
  /* a helicopter, far off: a low thump at about 11 beats a second on soft noise */
  { const lp = c.createBiquadFilter(), am = c.createGain(), lv = c.createGain(); lp.type = 'lowpass'; lp.frequency.value = 260; am.gain.value = 0.5; lv.gain.value = 0; lfo(am.gain, 10.5, 0.5); noiseSrc('brown').connect(lp); lp.connect(am); am.connect(lv); lv.connect(AU.master); B.heli = lv; }
  /* a chainsaw: a buzzing saw that revs and eases */
  { const o = c.createOscillator(), bp = c.createBiquadFilter(), am = c.createGain(), lv = c.createGain(); o.type = 'sawtooth'; o.frequency.value = 118; bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 1.2; am.gain.value = 0.55; lv.gain.value = 0; lfo(o.frequency, 0.4, 26); lfo(am.gain, 33, 0.45, 'square'); o.connect(bp); bp.connect(am); am.connect(lv); lv.connect(AU.master); o.start(); B.saw = lv; }
  /* a hymn: slow chords of soft waves */
  { const g = c.createGain(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; g.gain.value = 0; lp.connect(g); g.connect(AU.master); const oscs = [];
    for (const f of [146.8, 220, 293.7, 369.99]) for (const det of [-5, 6]) { const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; const og = c.createGain(); og.gain.value = 0.2; o.connect(og); og.connect(lp); o.start(); oscs.push(o); }
    B.hymn = g; B.hymnOscs = oscs; B.hymnT = 0; }
  /* crickets */
  { const co = c.createOscillator(), cg = c.createGain(), ch = c.createOscillator(), chg = c.createGain(), cl = c.createGain(); co.frequency.value = 4300; ch.type = 'square'; ch.frequency.value = 24; chg.gain.value = 0.5; cg.gain.value = 0.5; ch.connect(chg); chg.connect(cg.gain); cl.gain.value = 0; co.connect(cg); cg.connect(cl); cl.connect(AU.master); co.start(); ch.start(); B.cricket = cl; }
  B.levels = {}; B.scale = { wind: 0.5, howl: 0.06, roar: 0.9, rain: 0.16, rain2: 0.2, rattle: 0.12, gen: 0.06, heli: 0.7, saw: 0.05, hymn: 0.05, cricket: 0.5 };
}
export function setBeds(l, tc = 0.4) {
  if (!AU.ctx || !B.ok) return; const lv = { ...l }; if (lv.rain !== undefined && lv.rain2 === undefined) lv.rain2 = lv.rain;
  for (const k of ['wind', 'howl', 'roar', 'rain', 'rain2', 'rattle', 'gen', 'heli', 'saw', 'hymn', 'cricket']) { const v = (lv[k] || 0) * (B.scale[k] || 1); if (B.levels[k] !== v) { B.levels[k] = v; setG(B[k], v, tc); } }
}
export function hush(tc = 0.15) { setBeds({}, tc); for (const k of ['sea', 'surf', 'wind', 'crowd', 'room']) if (AU.ch[k]) setG(AU.ch[k], 0, tc); }
/* the hymn walks slowly through four chords; call from the loop while it plays */
export function hymnTick(t) { if (!B.ok || !AU.ctx || t < (B.hymnT || 0)) return; B.hymnT = t + 4.2; const chords = [[146.8, 220, 293.7, 369.99], [130.8, 196, 261.6, 329.6], [174.6, 220, 261.6, 349.2], [146.8, 220, 293.7, 369.99]]; B.hymnI = ((B.hymnI || 0) + 1) % 4; const ch = chords[B.hymnI]; B.hymnOscs.forEach((o, i) => o.frequency.setTargetAtTime(ch[(i / 2) | 0], AU.ctx.currentTime, 0.5)); }
export function genPitch(f) { if (B.ok && B.genO) B.genO.frequency.setTargetAtTime(f, AU.ctx.currentTime, 0.4); }

/* ---------- one-shots ---------- */
export function zincBang(vol = 1) { if (!live()) return; const p = Math.random() * 1.4 - 0.7; noiseHit(1900, 1.6, 0.6, 0.28 * vol, p); noiseHit(900, 2, 0.8, 0.2 * vol, p, 0.03); tone(170, 70, 0.5, 'triangle', 0.18 * vol, p); for (let i = 0; i < 4; i++) noiseHit(2400 + Math.random() * 1500, 4, 0.12, 0.08 * vol, p, 0.1 + i * 0.09); }
export function treeCrack(vol = 1) { if (!live()) return; noiseHit(500, 0.8, 0.9, 0.3 * vol, -0.3); noiseHit(1800, 3, 0.15, 0.25 * vol, -0.3); tone(90, 28, 1.3, 'sine', 0.4 * vol, -0.3, 0.2); noiseHit(300, 1, 1.4, 0.22 * vol, -0.3, 0.5); }
export function roofGroan() { if (!live()) return; shipCreak(); setTimeout(() => shipCreak(), 380); }
export function gust(vol = 1, dur = 2.4) { if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.02, src = c.createBufferSource(), len = c.sampleRate * dur, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0), bp = c.createBiquadFilter(), g = c.createGain(), o = out(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5; src.buffer = b; bp.type = 'bandpass'; bp.Q.value = 0.9; bp.frequency.setValueAtTime(400, t0); bp.frequency.linearRampToValueAtTime(1100, t0 + dur * 0.5); bp.frequency.linearRampToValueAtTime(500, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.5 * vol, t0 + dur * 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); src.connect(bp); bp.connect(g); g.connect(o); src.start(t0); }
export function thunderRoll() { if (!live()) return; tone(60, 30, 2.2, 'sine', 0.25, 0); noiseHit(260, 0.6, 2.4, 0.18, 0); }
export function knock(n = 3) { if (!live()) return; for (let i = 0; i < n; i++) { noiseHit(380, 3, 0.1, 0.18, 0, i * 0.3); tone(150, 90, 0.1, 'triangle', 0.14, 0, i * 0.3); } }
export function hammerTap(n = 3) { if (!live()) return; for (let i = 0; i < n; i++) { noiseHit(1100, 7, 0.1, 0.16, 0.1, i * 0.34); tone(300, 240, 0.1, 'triangle', 0.05, 0.1, i * 0.34); } }
export function pourWater() { if (!live()) return; noiseHit(1400, 0.5, 1.1, 0.12, 0); noiseHit(2600, 0.7, 0.9, 0.06, 0.1, 0.1); }
export function scoop() { if (!live()) return; noiseHit(240, 1.2, 0.25, 0.14, 0); noiseHit(900, 2, 0.12, 0.08, 0, 0.12); }
export function bag() { if (!live()) return; noiseHit(3000, 0.6, 0.25, 0.1, 0); noiseHit(2000, 0.8, 0.2, 0.07, 0, 0.18); }
export function radioTune() { if (!live()) return; for (let i = 0; i < 5; i++) { noiseHit(1500 + i * 700, 0.6, 0.18, 0.07, -0.2, i * 0.17); } tone(880, 880, 0.18, 'square', 0.025, -0.2, 0.9); tone(660, 660, 0.18, 'square', 0.025, -0.2, 1.15); tone(880, 880, 0.3, 'square', 0.025, -0.2, 1.4); }
export function phoneRing(n = 2) { if (!live()) return; for (let i = 0; i < n; i++) { for (const d of [0, 0.16, 0.32]) { tone(1100, 1100, 0.1, 'sine', 0.05, 0, i * 1.2 + d); tone(1450, 1450, 0.1, 'sine', 0.04, 0, i * 1.2 + d); } } }
export function chime(f = 660) { if (!live()) return; tone(f, f, 0.5, 'sine', 0.06, 0); tone(f * 1.5, f * 1.5, 0.7, 'sine', 0.04, 0, 0.14); }
export function churchBell(n = 3) { if (!live()) return; for (let i = 0; i < n; i++) for (const [m, v] of [[1, 0.1], [2.0, 0.05], [2.76, 0.035], [4.1, 0.02]]) tone(196 * m, 196 * m * 0.998, 3.2, 'sine', v, 0, i * 2.2); }
export function sawStart() { if (!live()) return; for (let i = 0; i < 3; i++) { tone(90 + i * 20, 160 + i * 30, 0.3, 'sawtooth', 0.05, 0.3, i * 0.35); noiseHit(1200, 1, 0.25, 0.07, 0.3, i * 0.35); } }
export function thump(vol = 0.16) { if (!live()) return; tone(110, 70, 0.22, 'sine', vol, -0.2); noiseHit(180, 1.5, 0.08, vol * 0.4, -0.2); }
export function creakDoor() { if (!live()) return; tone(180, 320, 0.5, 'sawtooth', 0.025, 0.2); tone(300, 190, 0.4, 'triangle', 0.02, 0.2, 0.45); }
export function bellTap() { if (!live()) return; tone(784, 784, 0.4, 'sine', 0.05, 0); }
export function fanfare() { if (!live()) return; for (const [f, t] of [[392, 0], [494, 0.3], [587, 0.6], [784, 1.0]]) tone(f, f, 0.9, 'triangle', 0.05, 0, t); }
export { clink } from '../../../engine/audio.js';
