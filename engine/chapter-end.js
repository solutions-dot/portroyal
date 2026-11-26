import { chapterChime } from './audio.js';
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
  if (pause <= 0) { if (still() && clear()) { chapterChime('close'); show(); return; } pause = 0; }   /* a test run (pause 0): at once, as the autoplayer expects */
  let quiet = 0;
  const tick = () => {
    if (!still()) return;
    quiet = clear() ? quiet + STEP : 0;
    if (quiet >= pause) { chapterChime('close'); show(); return; }
    setTimeout(tick, STEP);
  };
  setTimeout(tick, STEP);
}

/* Straight on to the next chapter (owner, 25 November 2026: "the chapter start should only play if you are manually going through the chapters via the
   journal ... if you are playing straight, the first chapter can play, and its end, then the other chapters go straight into it"; and "the fade is better..
   avoiding another click"). The end card's Next chapter button marks the move as straight on (goingStraight); when the new chapter begins the game asks
   startCard(): false after a straight move, and the game plays titleFade() (the chapter's name and its one-line introduction on black, timed, no click)
   in place of its start card. The first chapter's card, and a chapter chosen from the Chapters list, still show the card.
     nextLines(nx)               the end card's line: what comes next
     goingStraight()             call from the end card's Next chapter button, just before the game goes on
     startCard()                 true unless the player came straight on from the end card (it resets itself)
     titleFade(fade, title, sub, done, quick)   the timed fade over #fade / #fadeT / #fadeS (engine/cine.js playChapterFade); quick: at once (tests) */
import { playChapterFade } from './cine.js';
let straight = false;
export const nextLines = (nx) => ['Next is ' + nx.name + ' (' + nx.year + ').'];
export function goingStraight() { straight = true; }
export function startCard() { const s = straight; straight = false; return !s; }
export function titleFade(fade, title, sub, done, quick = false) {
  if (quick || !fade) { done(); return; }
  const T = fade.querySelector('#fadeT'), S = fade.querySelector('#fadeS');
  if (T) T.textContent = title;
  if (S) S.textContent = sub || '';
  const long = (sub || '').length > 60;   /* a full sentence under the title gets longer on screen, to read it (and, later, to hear it read) */
  playChapterFade(fade, () => {}, done, long ? [700, 4600, 5100, 5900] : [700, 3200, 3700, 4500]);
}
