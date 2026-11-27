/* engine/storyvoice.js: the one place a game's on-screen words are read aloud (owner, 27 November 2026: "all games are standardised, no individual
   code, so when we make a change it is across all"). Every game makes one of these and calls it; no game carries its own copy of the logic.

     const SV = createStoryVoice();            fetches voices/index.json once and decodes the clips ahead
     SV.line(who, text, isMe)                  a character's recorded line (key "who|text"); the player's own line, or no clip, stops the voice
     SV.card(title, paragraphs)                a card is read as one clip: its title, then its paragraphs
     SV.stop()                                 a button press, closing, leaving
     SV.look                                   { speak, voiceBusy } for createLookShot (engine/lookshot.js): each look line is read, and the next waits for it
     SV.lookLines(lk)                          the lines of a look scene: what you see, then what it means (no pop-up card)
     SV.narrator                               the underlying narrator (title cards, captions: engine/narrator.js)

   Clips are made from tools/audio/card-text.mjs (cards and looks) and tools/audio/<game>-cast.mjs (characters). tests/story-voice.mjs checks every game uses this. */
import { createNarrator } from './narrator.js';
import { sharedVoice } from './filmvoice.js';

let current = null;
/* the title fade (engine/chapter-end.js titleFade) reads its own words through whichever game voice is running */
export const speakStory = (text) => { if (current) current.speak(text); };
const norm = (t) => String(t).replace(/\s+/g, ' ').trim();
export function createStoryVoice(opts) {
  const narrator = createNarrator(opts); narrator.preload(); current = narrator;
  return {
    narrator,
    line(who, text, isMe) { if (!isMe && text) narrator.speak(who + '|' + norm(text)); else narrator.stop(); },
    card(title, paragraphs) { narrator.speak(title + '. ' + paragraphs.join(' ')); },
    stop() { narrator.stop(); },
    look: { speak: (t) => narrator.speak(t), voiceBusy: () => sharedVoice().active() },
    lookLines: (lk) => [...(lk.say || []), ...(lk.lines || [])],
  };
}
