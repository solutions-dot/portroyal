/* engine/filmvoice.js: a narrator that speaks a film's captions (docs/AUDIO.md). A caption is [time, text, clip]; the third field is the
   clip name (when it is missing the clip is <film>-<second>), played from  voices/narrator-<clip>.mp3  next to the game's page. A caption with no third field stays silent. Clips play through the
   shared Web Audio master (engine/audio.js), so the sound button mutes them. Missing or blocked audio never stops a film: the caption still shows.

     const FV = createFilmVoice();
     FV.preload(captions, film)                     when a film starts (skip it in a fast test run)
     FV.sync(caption, () => seconds into caption, film)  every frame, with the caption showing now; starts a clip when the caption changes
     time = FV.hold(time, nextTime, captions, end)  every tick: while a clip speaks, and for PAUSE seconds after it, time never passes the next caption (or the end)
     FV.syncScore(film, () => film time)            every frame: a quiet music bed, scores/score-<film>.mp3, from the film's clock (owner rule 16)
     FV.say(path)                                   a character's recorded line (e.g. 'voices/gran-01.mp3') on the same voice channel, so it never overlaps a caption
     FV.play(stem, elapsed) / FV.preloadClip(stem) / FV.preloadLine(file) / FV.stopVoice() / FV.stopScore()   single clips and channels, for an ending or a dialogue
     FV.stop()                                      on pause, skip, stop, mute or leaving the page (stops the voice and the score)
     FV.active()                                    a clip is speaking now

   The score plays at SCORE_GAIN and ducks to SCORE_DUCK while a voice speaks (Xaymaca's levels). A missing score or clip is simply silent.
   Used by every game with timed captions. Xaymaca's src/narration.js is a thin adapter over this module (moved 26 November 2026). */
import { AU } from './audio.js';

export const SCORE_GAIN = 0.4, SCORE_DUCK = 0.17;
/* a breath after every clip (owner, 27 November 2026: "the pause needs to be between each full said clip"): the channel counts as busy for PAUSE seconds after a
   clip ends by itself, so a film's next caption, a look's next line or a card waits for it; one that was due long after the last clip ends is not delayed */
export const PAUSE = 0.6;

export function createFilmVoice({ dir = './voices/', prefix = 'narrator-', scoreDir = './scores/' } = {}) {
  const clips = new Map();
  let current = null, cue = null, score = null, endedAt = -1e9;
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const busy = () => !!current || now() - endedAt < PAUSE * 1000;
  /* a caption's clip: its third field, or <film>-<second> (a dot in the second becomes an underscore) */
  const stemOf = (c, film) => c[2] || (film ? film + '-' + String(c[0]).replace('.', '_') : null);
  const path = (stem) => dir + prefix + stem + '.mp3';
  function load(stem, direct) {
    const p = direct ? stem : path(stem);
    if (!clips.has(p)) {
      if (!AU.ctx) return Promise.resolve(null);
      clips.set(p, fetch(p).then((r) => { if (!r.ok) throw new Error('clip unavailable'); return r.arrayBuffer(); }).then((b) => AU.ctx.decodeAudioData(b)).catch(() => null));
    }
    return clips.get(p);
  }
  function stopVoice() {
    const c = current; current = null; cue = null; AU.voiceOn = false;
    try { c && c.source && c.source.stop(); } catch (e) { /* already stopped */ }
  }
  function stopScore() {
    const c = score; score = null;
    try { c && c.source && c.source.stop(); } catch (e) { /* already stopped */ }
  }
  const stop = stopVoice;
  const duck = () => { AU.voiceOn = !!current; if (score && score.gain) score.gain.gain.setTargetAtTime(current ? SCORE_DUCK : SCORE_GAIN, AU.ctx.currentTime, 0.09); };
  function play(stem, elapsed) {
    stop();
    if (!AU.on || !AU.ctx || !AU.master) return;
    const req = { source: null }; current = req; cue = stem;
    load(stem).then((buf) => {
      if (current !== req) return;
      if (!buf || !AU.on) { stop(); return; }
      const off = elapsed();
      if (off >= buf.duration) { current = null; return; }
      const src = AU.ctx.createBufferSource();
      src.buffer = buf; req.source = src; src.connect(AU.master);
      src.onended = () => { src.disconnect(); if (current === req) { current = null; endedAt = now(); } duck(); };
      src.start(0, Math.max(0, off));
    });
  }
  const api = {
    say(file) {
      stop();
      if (!AU.on || !AU.ctx || !AU.master) return;
      const req = { source: null }; current = req; cue = file;
      load('./' + file, true).then((buf) => {
        if (current !== req) return;
        if (!buf || !AU.on) { stop(); return; }
        const src = AU.ctx.createBufferSource();
        src.buffer = buf; req.source = src; src.connect(AU.master);
        src.onended = () => { src.disconnect(); if (current === req) { current = null; cue = null; endedAt = now(); } duck(); };
        src.start(0); duck();
      });
    },
    syncScore(film, elapsed) {
      if (!AU.on || !AU.ctx || !AU.master) { stopScore(); return; }
      if (score && score.film === film) { duck(); return; }
      stopScore();
      const req = { film, source: null, gain: null }; score = req;
      load(scoreDir + 'score-' + film + '.mp3', true).then((buf) => {
        if (score !== req || !buf) return;
        const off = elapsed();
        if (off >= buf.duration) return;
        const src = AU.ctx.createBufferSource(), g = AU.ctx.createGain();
        g.gain.value = current ? SCORE_DUCK : SCORE_GAIN;
        src.buffer = buf; req.source = src; req.gain = g; src.connect(g); g.connect(AU.master);
        src.onended = () => { src.disconnect(); g.disconnect(); };
        src.start(0, Math.max(0, off));
      });
    },
    preload(captions, film) { if (AU.ctx) { for (const c of captions || []) { const s = stemOf(c, film); if (s) load(s); } if (film) load(scoreDir + 'score-' + film + '.mp3', true); } },
    sync(caption, elapsed, film) {
      const stem = AU.on && caption ? stemOf(caption, film) : null;
      if (stem === cue) return;
      stop();
      if (stem) play(stem, elapsed);
      duck();
    },
    hold(time, nextTime, captions, end) {
      if (!AU.on || !busy()) return nextTime;
      const next = (captions.find((c) => c[0] > time) || [end])[0];
      return Math.min(nextTime, next - 0.0001);
    },
    play(stem, elapsed = () => 0) { play(stem, elapsed); duck(); },   // a named clip at once (e.g. an ending), on the voice channel
    preloadClip(stem) { if (AU.ctx) load(stem); },
    preloadLine(file) { if (AU.ctx) load('./' + file, true); },
    stopVoice,
    stopScore,
    stop() { stopVoice(); stopScore(); },
    active: busy,   /* speaking, or in the pause after a clip */
  };
  addEventListener('pagehide', () => { stopVoice(); stopScore(); });
  return api;
}

/* one shared voice channel for the page, for modules that have no game object (the cinematic bed in engine/cine.js, the text narrator in engine/narrator.js) */
let shared = null;
export const sharedVoice = () => (shared ||= createFilmVoice());
