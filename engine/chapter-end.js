/* engine/chapter-end.js: the "Chapter N is finished" card, the same in every game (owner, 21 November 2026).
   1. A pause first. The card came up the moment the last action finished, so the player could not see what they had just done.
      Now the screen must be clear (no dialogue, panel, card, fade or camera scene) for PAUSE_MS in a row before the card shows.
   2. No "Stay here". Staying left no way in play to reach the next scene, which felt clumsy. The card offers the next chapter,
      and Chapters is always there in the Journal.

     offerNextChapter({ still, clear, show, pause })
       still()  true while the offer still makes sense (the player has not moved on, restarted or changed chapter); when false, nothing shows
       clear()  true when nothing is on screen that the card would cover
       show()   builds and shows the card
       pause    ms the screen must stay clear first (default PAUSE_MS); 0 in a test run, so the autoplayer is not slowed */
export const PAUSE_MS = 2500;
const STEP = 200;

export function offerNextChapter({ still = () => true, clear = () => true, show, pause = PAUSE_MS }) {
  if (pause <= 0) { if (still() && clear()) { show(); return; } pause = 0; }   /* a test run (pause 0): at once, as the autoplayer expects */
  let quiet = 0;
  const tick = () => {
    if (!still()) return;
    quiet = clear() ? quiet + STEP : 0;
    if (quiet >= pause) { show(); return; }
    setTimeout(tick, STEP);
  };
  setTimeout(tick, STEP);
}
