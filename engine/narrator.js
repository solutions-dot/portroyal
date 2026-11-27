/* engine/narrator.js: the narrator reads text the game already shows (owner rule 17), from voices/index.json: { "<exact text>": "<clip file>" }.
   One voice at a time, on the page's shared channel (engine/filmvoice.js); text with no clip is simply silent and stops the last line.

     const N = createNarrator();      // fetches voices/index.json once
     N.speak(text)                    // starts the clip for this text; true when there is one
     N.stop()                         // advancing, closing, skipping, sound off, leaving
     N.preload()                      // decode every clip ahead (call when a chapter starts)
   Clips are made by tools/audio/voice-lines.mjs from the game's own text; see docs/AUDIO.md. */
import { sharedVoice } from './filmvoice.js';
const norm = (t) => String(t).replace(/\s+/g, ' ').trim();
export function createNarrator({ dir = './voices/' } = {}) {
  const FV = sharedVoice();
  let map = {}, gen = 0, last = { f: '', t: 0 };
  const ready = fetch(dir + 'index.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((m) => { map = m || {}; return map; });
  return {
    ready,
    speak(text) {   /* the same text asked twice within 1.5 s (a game and the engine both asking) plays once */
      const f = text && map[norm(text)]; if (!f) { FV.stopVoice(); return false; }
      const now = Date.now(); if (f === last.f && now - last.t < 1500) return true; last = { f, t: now };
      FV.say('voices/' + f); return true;
    },
    stop() { FV.stopVoice(); },
    /* run fn after ms, but never while the narrator is still speaking (owner, 27 November 2026: captions and cards must not go before the voice ends).
       A newer after() call replaces an older one. */
    /* a promise that resolves once nothing is speaking */
    done() { return new Promise((res) => { const t = () => (FV.active() ? setTimeout(t, 150) : setTimeout(res, 250)); t(); }); },
    after(ms, fn) { const g = ++gen; setTimeout(function tick() { if (g !== gen) return; if (FV.active()) setTimeout(tick, 150); else setTimeout(() => { if (g === gen) fn(); }, 250); }, ms); },
    bed(name) { FV.syncScore(name, () => 0); },   /* a quiet sound bed such as a gramophone's hiss (owner rule 16) */
    endBed() { FV.stopScore(); },
    preload() { ready.then((m) => { for (const f of Object.values(m)) FV.preloadLine('voices/' + f); }); },
  };
}
