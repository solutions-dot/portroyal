/* engine/return-talk.js: nobody sends you back across the place to someone you already talked to (owner, 21 November 2026: "sometimes
   you talk to someone, and then someone sends you back to them which feels a bit off"; "just go").

   When the story's next talk is with one person you already talked to in this chapter, they come to you: a moment after the step
   before it ends, with the screen clear, their talk starts where you stand. New people you still walk to and find, so the place is
   still there to explore.

     returningTalker(targets, stage, nameOf)   the id of the person who should call you, or null.
         targets  { stage: [ids] } (a game's TALK_TARGETS); a chapter is a block of ten stages (10-19, 20-29 ...)
         nameOf   id -> the person's name (the same person can have a new id in a new spot, for example papa51 and papaR51)
     callBack({ still, clear, talk, pause })   start talk() once the screen has been clear for pause ms (default RETURN_PAUSE_MS),
                                               while still() is true
     comeOver(n, { px, pz, goTo, talk })       the person walks up to you (engine/follow.js goTo, round walls) and talks when they arrive
                                               (owner, 21 Nov 2026: "some persons walking to you"). A game without goTo, or someone
                                               already close, just talks. */
export const RETURN_PAUSE_MS = 1200;

export function returningTalker(targets, stage, nameOf) {
  const now = targets[stage];
  if (!now || now.length !== 1) return null;
  const id = now[0], name = nameOf(id), ch = Math.floor(stage / 10);
  if (!name) return null;
  for (const k of Object.keys(targets)) {
    const t = +k;
    if (t >= stage || Math.floor(t / 10) !== ch) continue;
    if (targets[k].some((o) => nameOf(o) === name)) return id;
  }
  return null;
}

export function callBack({ still = () => true, clear = () => true, talk, pause = RETURN_PAUSE_MS }) {
  const STEP = 200; let quiet = 0;
  const tick = () => {
    if (!still()) return;
    quiet = clear() ? quiet + STEP : 0;
    if (quiet >= pause) { talk(); return; }
    setTimeout(tick, STEP);
  };
  setTimeout(tick, STEP);
}

export const COME_GAP = 1.5;   /* metres from you where they stop to talk */
export function comeOver(n, { px, pz, goTo = null, talk, gap = COME_GAP }) {
  const dx = n.x - px, dz = n.z - pz, d = Math.hypot(dx, dz);
  if (!goTo || d < gap + 1.2) { talk(); return; }
  const k = gap / d;
  if (n.amb) n.amb.held = true;   /* the person's background life lets go while they walk over, so the walk clip plays: left running, its idle and work clips played over the walk and they slid along like a ghost (owner, 23 November 2026, Morant Bay) */
  goTo(n, px + dx * k, pz + dz * k, { done: () => talk() });
}
