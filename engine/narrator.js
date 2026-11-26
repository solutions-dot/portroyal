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
  let map = {};
  const ready = fetch(dir + 'index.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((m) => { map = m || {}; return map; });
  return {
    ready,
    speak(text) { const f = text && map[norm(text)]; if (!f) { FV.stopVoice(); return false; } FV.say('voices/' + f); return true; },
    stop() { FV.stopVoice(); },
    preload() { ready.then((m) => { for (const f of Object.values(m)) FV.preloadLine('voices/' + f); }); },
  };
}
