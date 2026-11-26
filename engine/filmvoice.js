/* engine/filmvoice.js: a narrator that speaks a film's captions (docs/AUDIO.md). A caption is [time, text, clip]; the third field is the
   clip name (when it is missing the clip is <film>-<second>), played from  voices/narrator-<clip>.mp3  next to the game's page. A caption with no third field stays silent. Clips play through the
   shared Web Audio master (engine/audio.js), so the sound button mutes them. Missing or blocked audio never stops a film: the caption still shows.

     const FV = createFilmVoice();
     FV.preload(captions, film)                     when a film starts (skip it in a fast test run)
     FV.sync(caption, () => seconds into caption, film)  every frame, with the caption showing now; starts a clip when the caption changes
     time = FV.hold(time, nextTime, captions, end)  every tick: while a clip speaks, time never passes the next caption (or the end)
     FV.stop()                                      on pause, skip, stop, mute or leaving the page
     FV.active()                                    a clip is speaking now

   Used by every game with timed captions except Xaymaca, which keeps its own copy in games/xaymaca/src/narration.js (it also plays a score). */
import { AU } from './audio.js';

export function createFilmVoice({ dir = './voices/', prefix = 'narrator-' } = {}) {
  const clips = new Map();
  let current = null, cue = null;
  /* a caption's clip: its third field, or <film>-<second> (a dot in the second becomes an underscore) */
  const stemOf = (c, film) => c[2] || (film ? film + '-' + String(c[0]).replace('.', '_') : null);
  const path = (stem) => dir + prefix + stem + '.mp3';
  function load(stem) {
    const p = path(stem);
    if (!clips.has(p)) {
      if (!AU.ctx) return Promise.resolve(null);
      clips.set(p, fetch(p).then((r) => { if (!r.ok) throw new Error('clip unavailable'); return r.arrayBuffer(); }).then((b) => AU.ctx.decodeAudioData(b)).catch(() => null));
    }
    return clips.get(p);
  }
  function stop() {
    const c = current; current = null; cue = null;
    try { c && c.source && c.source.stop(); } catch (e) { /* already stopped */ }
  }
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
      src.onended = () => { src.disconnect(); if (current === req) current = null; };
      src.start(0, Math.max(0, off));
    });
  }
  const api = {
    preload(captions, film) { if (AU.ctx) for (const c of captions || []) { const s = stemOf(c, film); if (s) load(s); } },
    sync(caption, elapsed, film) {
      const stem = AU.on && caption ? stemOf(caption, film) : null;
      if (stem === cue) return;
      stop();
      if (stem) play(stem, elapsed);
    },
    hold(time, nextTime, captions, end) {
      if (!AU.on || !current) return nextTime;
      const next = (captions.find((c) => c[0] > time) || [end])[0];
      return Math.min(nextTime, next - 0.0001);
    },
    stop,
    active: () => !!current,
  };
  addEventListener('pagehide', stop);
  return api;
}
