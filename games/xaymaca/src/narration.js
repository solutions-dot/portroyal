/* Xaymaca's audio calls, now served by the shared player (engine/filmvoice.js, owner rules 16 and 17). The exports stay as they were so the
   director, the dialogue and the ending do not change; the clips are still voices/narrator-<name>.mp3 and scores/score-<name>.mp3. */
import { createFilmVoice } from "../../../engine/filmvoice.js";

const FV = createFilmVoice();

export const narrationActive = () => FV.active();
export const preloadNarration = (name) => FV.preloadClip(name);
export const preloadScore = (name) => FV.preload([], name);
export const preloadDialogue = (path) => FV.preloadLine(path);
export const playDialogue = (path) => FV.say(path);
export const stopNarration = () => FV.stopVoice();
export const stopScore = () => FV.stopScore();
export const playNarration = (name, elapsed = () => 0) => FV.play(name, elapsed);
export const playScore = (name, elapsed) => FV.syncScore(name, elapsed);
