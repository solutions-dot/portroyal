/* engine/audio.js: every sound is made in code with the Web Audio API, so games ship no audio files.
   Call soundPref(key) once, audioInit() on the first tap, then use the helpers. See docs/ENGINE.md. */
export const AU = { ctx: null, master: null, on: true, ch: {}, crack: null };
export function soundPref(key) { AU.key = key; try { AU.on = localStorage.getItem(key) !== 'off'; } catch (e) { /* default on */ } }
let sceneAudioScale = 1;
const masterLevel = () => AU.on ? 0.8 * sceneAudioScale : 0;
export function setSceneAudioScale(scale) {
  sceneAudioScale = scale;
  if (AU.master) AU.master.gain.setTargetAtTime(masterLevel(), AU.ctx.currentTime, 0.1);
}
export function setSound(on) { AU.on = on; try { localStorage.setItem(AU.key || 'game-sound', on ? 'on' : 'off'); } catch (e) { /* ignore */ } audioInit(); if (AU.master) AU.master.gain.setTargetAtTime(masterLevel(), AU.ctx.currentTime, 0.1); }
export function noiseSrc(kind) { const c = AU.ctx, len = c.sampleRate * 3, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0); let l = 0;
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'brown') { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w * 0.5; }
  const src = c.createBufferSource(); src.buffer = b; src.loop = true; src.start(); return src; }
export function chan(kind, type, f, q) { const c = AU.ctx, fl = c.createBiquadFilter(), g = c.createGain(); fl.type = type; fl.frequency.value = f; if (q) fl.Q.value = q; g.gain.value = 0; noiseSrc(kind).connect(fl); fl.connect(g); g.connect(bedBus()); g.f = fl; return g; }
/* every background bed (sea, surf, wind, crowd, room, traffic) goes through one bus, well under the voices and one-shots (23 November 2026, owner: "all of the games have what sounds like the sea that drowns everything else out"). A bed's own level keeps its 0.05 to 0.35 range for the mix; noise at a given gain sounds far louder than a tone or a footstep at the same gain, and several beds play at once, so the bus brings them all down together. */
export const BED_BUS = 0.45;
function bedBus() { if (!AU.bedBus) { AU.bedBus = AU.ctx.createGain(); AU.bedBus.gain.value = BED_BUS; AU.bedBus.connect(AU.master); } return AU.bedBus; }
export function audioInit() { try { if (!AU.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; AU.ctx = new AC(); AU.master = AU.ctx.createGain(); AU.master.gain.value = masterLevel(); AU.master.connect(AU.ctx.destination);
      AU.ch.sea = chan('brown', 'lowpass', 800); AU.ch.surf = chan('white', 'bandpass', 2200, 0.4); AU.ch.wind = chan('white', 'bandpass', 650, 0.6); AU.ch.crowd = chan('white', 'bandpass', 480, 2.2); AU.ch.room = chan('brown', 'lowpass', 160);
      AU.ch.traffic = chan('brown', 'lowpass', 340, 0.8); lfoGain(AU.ch.traffic, 0.07, 0.35);   /* a town's far traffic: a low rolling hum that comes and goes (22 November 2026) */
      AU.ch.cricket = cricketBed();   /* night insects, one bed for every game (Kendal, Nanny and Melissa each made their own) */
      const n = AU.ctx.sampleRate * 0.03, b = AU.ctx.createBuffer(1, n, AU.ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); AU.crack = b;
      { const m = AU.ctx.sampleRate * 0.22 | 0, sb = AU.ctx.createBuffer(1, m, AU.ctx.sampleRate), e = sb.getChannelData(0); let grain = 0; for (let i = 0; i < m; i++) { if (Math.random() < 0.004) grain = 0.6 + Math.random() * 0.4; grain *= 0.992; const env = Math.min(1, i / (m * 0.15)) * Math.pow(1 - i / m, 1.6); e[i] = (Math.random() * 2 - 1) * (0.35 + grain) * env; } AU.step = sb; } }
    if (typeof __DEV__ !== 'undefined' && __DEV__) window.__AU = AU;   /* dev builds: the test runners read the bed levels */
    AU.ctx.resume(); if (!AU.wake) { AU.wake = () => { if (AU.ctx && AU.ctx.state !== 'running') AU.ctx.resume(); };   /* a phone pauses sound for a call or when the player switches apps; the next touch or key brings it back, in every game (22 November 2026; it was Port Royal's alone) */
      for (const ev of ['pointerdown', 'keydown', 'touchend']) addEventListener(ev, AU.wake, { passive: true }); document.addEventListener('visibilitychange', () => { if (!document.hidden) AU.wake(); }); } } catch (e) { AU.ctx = null; } }
export function out(pan) { const c = AU.ctx, g = c.createGain(); if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(AU.master); } else g.connect(AU.master); return g; }
export function gullCry() { const c = AU.ctx, t0 = c.currentTime + 0.05, o = out(Math.random() * 1.6 - 0.8), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 1.4; bp.connect(o); o.gain.value = 0.35 + Math.random() * 0.4;
  for (let i = 0, n = 2 + (Math.random() * 2 | 0); i < n; i++) { const s0 = t0 + i * 0.42, osc = c.createOscillator(), g = c.createGain(), vib = c.createOscillator(), vg = c.createGain(); osc.type = 'triangle';
    osc.frequency.setValueAtTime(1300, s0); osc.frequency.linearRampToValueAtTime(1750, s0 + 0.06); osc.frequency.exponentialRampToValueAtTime(950, s0 + 0.34); vib.frequency.value = 28; vg.gain.value = 45; vib.connect(vg); vg.connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, s0); g.gain.exponentialRampToValueAtTime(0.16, s0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, s0 + 0.36); osc.connect(g); g.connect(bp); osc.start(s0); vib.start(s0); osc.stop(s0 + 0.4); vib.stop(s0 + 0.4); } }
let stepSide = 1;
export function stepSound(k) { if (!AU.ctx || !AU.on || AU.ctx.state !== 'running' || !k) return;   /* k: 'sand' | 'grass' | 'wood' | 'stone' | 'water' */
  const c = AU.ctx, t0 = c.currentTime + 0.005; stepSide = -stepSide; const g = out(stepSide * 0.12), v = 0.85 + Math.random() * 0.3;
  const src = c.createBufferSource(); src.buffer = (k === 'sand' || k === 'grass' || k === 'water') && AU.step ? AU.step : AU.crack;   /* a sound's buffer can be set only once, so every kind picks its buffer here */ const f = c.createBiquadFilter();
  if (k === 'sand' || k === 'grass') { f.type = 'lowpass'; f.frequency.value = k === 'sand' ? 700 + Math.random() * 300 : 1600; src.playbackRate.value = 0.9 + Math.random() * 0.2; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.16 * v, t0 + 0.045); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24); }
  else if (k === 'water') { f.type = 'bandpass'; f.Q.value = 0.7; f.frequency.setValueAtTime(500, t0); f.frequency.exponentialRampToValueAtTime(1800, t0 + 0.12); f.frequency.exponentialRampToValueAtTime(700, t0 + 0.5); src.playbackRate.value = 0.55 + Math.random() * 0.15; src.loop = true; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.3 * v, t0 + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6); src.connect(f); f.connect(g); src.start(t0); src.stop(t0 + 0.65); return; }
  else if (k === 'wood') { f.type = 'bandpass'; f.frequency.value = 420 + Math.random() * 120; f.Q.value = 1.4; src.playbackRate.value = 0.5; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.26 * v, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
    const o = c.createOscillator(), og = c.createGain(); o.frequency.setValueAtTime(130, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.09); og.gain.setValueAtTime(0.16 * v, t0); og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16); o.connect(og); og.connect(g); o.start(t0); o.stop(t0 + 0.2); }
  else { f.type = 'bandpass'; f.frequency.value = 1100 + Math.random() * 400; f.Q.value = 0.9; src.playbackRate.value = 0.8; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.17 * v, t0 + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11); }
  src.connect(f); f.connect(g); src.start(t0); src.stop(t0 + 0.3); }
export function crackle() { const c = AU.ctx, s0 = c.currentTime, src = c.createBufferSource(), hp = c.createBiquadFilter(), g = out(0.3); src.buffer = AU.crack; src.playbackRate.value = 0.6 + Math.random(); hp.type = 'highpass'; hp.frequency.value = 1400; g.gain.value = 0.05 + Math.random() * 0.12; src.connect(hp); hp.connect(g); src.start(s0); }
export function chirp() { const c = AU.ctx, t0 = c.currentTime + 0.02, o = out(Math.random() * 1.4 - 0.7); o.gain.value = 0.5;
  for (let i = 0; i < 3; i++) { const s0 = t0 + i * 0.13, osc = c.createOscillator(), g = c.createGain(); osc.frequency.setValueAtTime(2600, s0); osc.frequency.exponentialRampToValueAtTime(3700, s0 + 0.07); g.gain.setValueAtTime(0.0001, s0); g.gain.exponentialRampToValueAtTime(0.05, s0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s0 + 0.08); osc.connect(g); g.connect(o); osc.start(s0); osc.stop(s0 + 0.1); } }
export function cue(kind) { if (!AU.ctx) return; const c = AU.ctx, t0 = c.currentTime + 0.05, notes = { begin: [[293.66, 0], [369.99, 0.35], [440, 0.7], [587.33, 1.05]], sad: [[293.66, 0], [349.23, 0.5], [440, 1.0], [392, 1.6]], end: [[440, 0], [369.99, 0.6], [329.63, 1.2], [293.66, 1.8]] }[kind];
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(AU.master);
  for (const [f, dt] of notes) for (const det of [0, 7]) { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; g.gain.setValueAtTime(0.0001, t0 + dt); g.gain.exponentialRampToValueAtTime(0.05, t0 + dt + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 2.4); o.connect(g); g.connect(lp); o.start(t0 + dt); o.stop(t0 + dt + 2.5); } }
export function setG(g, v, tc) { g.gain.setTargetAtTime(v, AU.ctx.currentTime, tc || 0.5); }
export function tone(f0, f1, dur, type, vol, pan, delay = 0) { const c = AU.ctx, t0 = c.currentTime + 0.02 + delay, o = c.createOscillator(), g = c.createGain(), d = out(pan || 0); o.type = type; o.frequency.setValueAtTime(f0, t0); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.02, dur * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g); g.connect(d); o.start(t0); o.stop(t0 + dur + 0.02); }
export function noiseHit(freq, q, dur, vol, pan, delay = 0) { const c = AU.ctx, t0 = c.currentTime + 0.02 + delay, src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(), d = out(pan || 0); src.buffer = AU.crack; src.playbackRate.value = 0.5; bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); src.connect(bp); bp.connect(g); g.connect(d); src.start(t0); }
/* a crowd's cheer, for a film's "cheer" sound or a look: a few voices rising in a soft hurrah, then clapping (review, 25 November 2026: the
   new-colours scene asked for a cheer that no game could play, so it was silent) */
export function crowdCheer(vol = 0.08, pan = 0, delay = 0) { if (!AU.ctx) return;
  [0, 0.18, 0.4, 0.7].forEach((d, i) => noiseHit(700 + i * 260, 1.4, 0.9 - i * 0.12, vol * (1 - i * 0.15), pan + (i % 2 ? 0.3 : -0.3), delay + d));
  for (let i = 0; i < 10; i++) noiseHit(2600 + (i % 3) * 400, 2.5, 0.05, vol * 0.5, pan + Math.sin(i * 2.1) * 0.5, delay + 0.9 + i * 0.13 + (i % 2) * 0.05); }
export function shipCreak() { const c = AU.ctx, t0 = c.currentTime + 0.03, o = c.createOscillator(), g = c.createGain(), bp = c.createBiquadFilter(), d = out(0.5 + Math.random() * 0.4), dur = 0.6 + Math.random() * 0.7, f = 70 + Math.random() * 50;   /* timbers groaning as the hulls rock */
  o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * (1.15 + Math.random() * 0.3), t0 + dur); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 5; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.05, t0 + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 18 + Math.random() * 14; lg.gain.value = 0.04; lfo.connect(lg); lg.connect(g.gain); o.connect(bp); bp.connect(g); g.connect(d); o.start(t0); lfo.start(t0); o.stop(t0 + dur + 0.05); lfo.stop(t0 + dur + 0.05); }
export function hammer() { const pan = Math.random() * 1.6 - 0.8, n = 2 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) { noiseHit(900 + Math.random() * 300, 6, 0.12, 0.09, pan, i * 0.42); tone(260, 220, 0.12, 'triangle', 0.02, pan, i * 0.42); } }   /* a cooper hooping a cask down the street */
export function clink() { const pan = Math.random() * 1.4 - 0.7, f = 1700 + Math.random() * 900; tone(f, f, 0.5, 'sine', 0.035, pan); tone(f * 2.76, f * 2.76, 0.25, 'sine', 0.012, pan); }
export function uiSound(kind) { if (!AU.ctx || !AU.on || AU.ctx.state !== 'running') return;
  if (kind === 'page') { tone(660, 660, 0.35, 'sine', 0.07, 0); tone(880, 880, 0.5, 'sine', 0.06, 0, 0.12); tone(1320, 1320, 0.6, 'sine', 0.03, 0, 0.24); }   /* a new journal page */
  else if (kind === 'goal') { tone(523, 523, 0.25, 'triangle', 0.045, 0); tone(784, 784, 0.4, 'triangle', 0.04, 0, 0.1); }
  else if (kind === 'tap') noiseHit(2400, 3, 0.05, 0.05, 0); }

/* ---------- shared beds and one-shots (22 November 2026: "Ensure our music, sound effects, ambient are on point for all games") ---------- */
const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
function lfoGain(g, rate, depth) { const c = AU.ctx, l = c.createOscillator(), lg = c.createGain(), mul = c.createGain(); l.frequency.value = rate; lg.gain.value = depth; mul.gain.value = 1 - depth; l.connect(lg); lg.connect(mul.gain); const f = g.f; f.disconnect(); f.connect(mul); mul.connect(g); l.start(); }
/* night insects: a high tone chopped fast, with a slower chop on top; returns its gain (0 until a game turns it up) */
export function cricketBed(f = 4300, chop = 24, slow = 3.1) { const c = AU.ctx, co = c.createOscillator(), cg = c.createGain(), ch = c.createOscillator(), chg = c.createGain(), ch2 = c.createOscillator(), ch2g = c.createGain(), cl = c.createGain();
  co.frequency.value = f; ch.type = 'square'; ch.frequency.value = chop; chg.gain.value = 0.5; ch2.type = 'square'; ch2.frequency.value = slow; ch2g.gain.value = 0.5; cg.gain.value = 0.5;
  ch.connect(chg); chg.connect(cg.gain); ch2.connect(ch2g); ch2g.connect(cg.gain); cl.gain.value = 0; co.connect(cg); cg.connect(cl); cl.connect(bedBus()); co.start(); ch.start(); ch2.start(); return cl; }

/* The looping beds and the level they live at. A game's SOUNDSCAPE gives each place a level per bed; mixBeds() sets them.
   Target (docs/ENGINE.md, "One ambient level"): the loudest bed of a place between BED_RANGE.lo and BED_RANGE.hi, after the game's own scale,
   and every bed times BED_RANGE.duck while someone talks. */
export const BEDS = ['room', 'crowd', 'wind', 'sea', 'surf', 'traffic', 'cricket'];
export const BED_RANGE = { lo: 0.05, hi: 0.35, duck: 0.6 };
export function bedLevels(S = {}, { scale = 1, duck = false } = {}) { const o = {}; for (const k of BEDS) o[k] = (S[k] || 0) * scale * (duck ? BED_RANGE.duck : 1); return o; }
export function mixBeds(S, opts = {}) { if (!AU.ctx) return; const L = bedLevels(S, opts); for (const k of BEDS) if (AU.ch[k]) setG(AU.ch[k], L[k], opts.tc); }
/* the dev check (?test=beds in each game): rows [{ place, beds: { name: effective gain } , once }] ; a place is silent (no bed and no one-shot), too quiet (loudest bed under lo) or too loud (any bed over hi) */
export function bedReport(rows, { lo = BED_RANGE.lo, hi = BED_RANGE.hi } = {}) {
  const issues = [], lines = [];
  for (const r of rows) { const e = Object.entries(r.beds).filter(([, v]) => v > 0), peak = e.reduce((m, [, v]) => Math.max(m, v), 0);
    lines.push(`${r.place}: peak ${peak.toFixed(3)}  ${e.map(([k, v]) => k + ' ' + v.toFixed(3)).join(', ') || '(no bed)'}${r.once ? '  + one-shots' : ''}`);
    if (!e.length && !r.once) issues.push(`${r.place}: silent`); else if (peak < lo - 1e-6) issues.push(`${r.place}: loudest bed ${peak.toFixed(3)} is under ${lo}`);
    for (const [k, v] of e) if (v > hi + 1e-6) issues.push(`${r.place}: ${k} ${v.toFixed(3)} is over ${hi}`); }
  return { issues, lines, text: `BEDS ${issues.length}\n` + [...issues, '', ...lines].join('\n') };
}

/* the player's hand (engine/story.js createCarry plays these) */
export function pickUp(weight = 0.5) { if (!live()) return; const w = Math.max(0, Math.min(1, weight)); noiseHit(1500 - w * 700, 1.1, 0.09 + w * 0.06, 0.045 + w * 0.03, 0.05); tone(380 - w * 120, 470 - w * 140, 0.1, 'sine', 0.018, 0.05, 0.02); }
export function putDown(weight = 0.5) { if (!live()) return; const w = Math.max(0, Math.min(1, weight)); tone(150 - w * 50, 80 - w * 25, 0.14 + w * 0.06, 'sine', 0.05 + w * 0.04, 0); noiseHit(700 - w * 250, 1.4, 0.08, 0.05 + w * 0.03, 0); }
/* a door: 'open' a latch click and a short creak, 'close' a soft thud and the latch (engine/door.js swingDoor plays these) */
export function doorSound(kind = 'open', pan = 0) { if (!live()) return; const c = AU.ctx;
  if (kind === 'open') { noiseHit(2800, 4, 0.03, 0.05, pan); const t0 = c.currentTime + 0.08, o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain(), d = out(pan), f = 160 + Math.random() * 60;
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * 1.35, t0 + 0.45); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 6;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.022, t0 + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5); o.connect(bp); bp.connect(g); g.connect(d); o.start(t0); o.stop(t0 + 0.55); }
  else { tone(110, 68, 0.2, 'sine', 0.08, pan); noiseHit(420, 1, 0.12, 0.07, pan); noiseHit(2600, 4, 0.03, 0.04, pan, 0.06); } }

/* far-off town and country life, for a place's `once` */
export function dogFar(pan = Math.random() * 1.6 - 0.8, vol = 0.05) { if (!live()) return; const n = 1 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) { const d = i * (0.28 + Math.random() * 0.1); tone(520, 300, 0.12, 'sawtooth', vol * 0.35, pan, d); noiseHit(700, 2, 0.1, vol, pan, d); } }
export function carFar(pan = Math.random() * 1.6 - 0.8, vol = 0.06) { if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.02, src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), d = out(pan), len = 2.6 + Math.random() * 1.4;   /* a car going by down the road: a swell of low road noise and an engine note */
  src.buffer = AU.step || AU.crack; src.loop = true; src.playbackRate.value = 0.35; f.type = 'lowpass'; f.frequency.setValueAtTime(300, t0); f.frequency.linearRampToValueAtTime(900, t0 + len * 0.5); f.frequency.linearRampToValueAtTime(260, t0 + len);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + len * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len); src.connect(f); f.connect(g); g.connect(d); src.start(t0); src.stop(t0 + len + 0.05);
  tone(95, 80, len, 'sawtooth', vol * 0.12, pan); }
export function hornFar(pan = Math.random() * 1.6 - 0.8, vol = 0.03) { if (!live()) return; const f = 330 + Math.random() * 80, n = Math.random() < 0.5 ? 1 : 2; for (let i = 0; i < n; i++) { tone(f, f, 0.22, 'square', vol * 0.5, pan, i * 0.3); tone(f * 1.26, f * 1.26, 0.22, 'square', vol * 0.35, pan, i * 0.3); } }
export function planeFar(pan = Math.random() * 1.2 - 0.6, vol = 0.05) { if (!live()) return; const c = AU.ctx, t0 = c.currentTime + 0.02, len = 7, o = c.createOscillator(), o2 = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain(), d = out(pan);   /* propeller engines far off: two low notes beating, swelling and fading */
  o.type = o2.type = 'sawtooth'; o.frequency.value = 74; o2.frequency.value = 76.5; lp.type = 'lowpass'; lp.frequency.value = 260; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol * 0.5, t0 + len * 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
  o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(d); o.start(t0); o2.start(t0); o.stop(t0 + len + 0.05); o2.stop(t0 + len + 0.05); }
export function radioFar(pan = Math.random() * 1.4 - 0.7, vol = 0.03) { if (!live()) return; const root = [196, 220, 174.6][Math.random() * 3 | 0], steps = [0, 4, 7, 4, 9, 7, 4, 0], beat = 0.26;   /* a radio playing in a house down the road: a few muffled notes, no words */
  steps.forEach((s, i) => { const f = root * Math.pow(2, s / 12); tone(f, f, beat * 1.6, 'triangle', vol, pan, i * beat); if (i % 2 === 0) tone(root / 2, root / 2, beat * 1.2, 'sine', vol * 0.8, pan, i * beat); }); }
export function owl(pan = Math.random() - 0.5, vol = 0.07) { if (!live()) return; tone(330, 300, 0.32, 'sine', vol, pan); tone(300, 250, 0.5, 'sine', vol, pan, 0.42); }
export function frog(pan = Math.random() - 0.5, vol = 0.04) { if (!live()) return; for (let i = 0; i < 3; i++) tone(2300, 2900, 0.07, 'sine', vol, pan, i * 0.16); }
/* bedTest(table, opts): the dev view ?test=beds. table: a game's SOUNDSCAPE { place: { bed: level, once } }; opts.scale: the game's own
   multiplier; opts.extra(place, S): the game's own beds at their effective gain ({ name: gain }). Prints into #autolog, the title (BEDS n)
   and the console, and returns the report. */
export function bedTest(table, { scale = 1, extra = null, lo, hi } = {}) {
  const rows = Object.entries(table).map(([place, S]) => { const b = bedLevels(S, { scale }), x = extra ? extra(place, S) || {} : {}; return { place, beds: { ...b, ...x }, once: !!S.once }; });
  const rep = bedReport(rows, { lo, hi }); if (typeof document !== 'undefined') { let el = document.getElementById('autolog'); if (!el) { el = document.createElement('pre'); el.id = 'autolog'; el.hidden = true; document.body.appendChild(el); } el.textContent = rep.text; document.title = rep.text.split('\n')[0]; }
  try { console.table(Object.fromEntries(rows.map((r) => [r.place, Object.fromEntries(Object.entries(r.beds).filter(([, v]) => v > 0).map(([k, v]) => [k, +v.toFixed(3)]))]))); console.log(rep.text); } catch (e) { /* no console */ }
  return rep;
}
