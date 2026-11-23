/* engine/look-sounds.js: the sounds of a look moment (engine/lookshot.js), made in code from engine/audio.js, so every game's lid, cloth, paper
   and water sound alike (rule 10, 22 November 2026). lookSound(name) plays one if sound is on and running; names below. The Mad Master of
   Edinburgh Castle still has its own copy (LOOK_SFX in its main.js), to move here when that game is next touched. */
import { AU, noiseHit, tone, shipCreak, clink } from "./audio.js";

const later = (ms, fn) => setTimeout(fn, ms);
export const LOOK_SOUNDS = {
  lid: () => {
    tone(320, 260, 0.35, "triangle", 0.02, 0, 0.05);   /* a tin lid's squeak */
    noiseHit(1800, 3, 0.08, 0.08, 0, 0.5);
  },
  creak: () => shipCreak(),
  clink: () => [0.3, 0.6, 1.0].forEach((d) => later(d * 1000, clink)),
  cloth: () => noiseHit(2200, 0.5, 1.2, 0.1, -0.3, 0.1),
  paper: () => [0, 0.35].forEach((d) => noiseHit(3200, 0.6, 0.18, 0.08, 0.1, d)),   /* a sheet unfolded */
  wood: () => {
    noiseHit(500, 4, 0.12, 0.16, 0, 0.2);
    noiseHit(300, 4, 0.18, 0.2, 0, 1.4);
  },
  water: () => [0.2, 0.9, 1.6, 2.3].forEach((d, i) => noiseHit(600 + i * 80, 0.6, 0.6, 0.06, -0.4, d)),   /* small waves on a hull */
  wind: () => noiseHit(500, 0.4, 2.6, 0.08, -0.3, 0),
  steps: () => { for (let i = 0; i < 5; i++) noiseHit(220, 2, 0.08, 0.07, 0.2, i * 0.5); },
  drill: () => { for (let i = 0; i < 4; i++) { noiseHit(260, 3, 0.07, 0.12, 0, i * 0.6); noiseHit(1800, 6, 0.05, 0.05, 0, i * 0.6 + 0.05); } },   /* boots stamp, steel rings */
  bell: () => { tone(523, 520, 2.2, "sine", 0.05, 0); tone(784, 780, 1.6, "sine", 0.02, 0); },
  stone: () => noiseHit(900, 2, 0.4, 0.08, 0, 0.3),   /* a chisel's scrape on stone */
};
export function lookSound(name) {
  if (!AU.ctx || !AU.on || AU.ctx.state !== "running") return;
  LOOK_SOUNDS[name]?.();
}
