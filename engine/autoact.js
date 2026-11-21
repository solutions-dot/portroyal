/* engine/autoact.js: a story action happens when you reach it, with no button to press (owner, 21 November 2026: "when i am in the
   proximity of it, or right by it.. it automatically does the action so i dont have to do another button press").

   Only an action the story needs now runs by itself. Exits (doors, "Go back to the street") and anything optional keep their button,
   so walking past a door never pulls you through it. A short pause first (you arrive, then it happens, so it is never a surprise), and
   after one fires the next waits until you have walked a little, so a pick-up spot next to a put-down spot cannot chain.

     const auto = createAutoAct()
     auto.tick(dt, action, x, z, run)   every frame: action is the one in reach that may fire (or null); run(action) does it */
export const AUTO_DELAY = 0.35;     /* seconds standing in reach before it happens */
export const AUTO_REARM = 0.6;      /* metres to walk after one fires before the next can */

/* the button that stays (doors, optional things) sits up in the middle of the screen, just below where you look, in every game
   (owner, 21 November 2026). Bog Walk's #act already sits in its middle column. */
const BUTTON_CSS = '#talk.btn{position:fixed!important;top:62%!important;bottom:auto!important;left:50%!important;transform:translate(-50%,-50%)!important;max-width:calc(100vw - 32px);white-space:nowrap}';
function placeButton() {
  if (typeof document === 'undefined' || document.getElementById('autoact-css')) return;
  const st = document.createElement('style'); st.id = 'autoact-css'; st.textContent = BUTTON_CSS; document.head.appendChild(st);
}

export function createAutoAct({ delay = AUTO_DELAY, rearm = AUTO_REARM } = {}) {
  placeButton();
  let cur = null, t = 0, lock = null;
  return {
    tick(dt, action, x, z, run) {
      if (lock && Math.hypot(x - lock[0], z - lock[1]) >= rearm) lock = null;
      if (!action || action.manual || action.exit) { cur = null; t = 0; return; }
      const key = action.id !== undefined ? action.id : action;   /* by id: some games build the nearby action afresh every frame */
      if (key !== cur) { cur = key; t = 0; }
      if (lock) return;
      t += dt || 0;
      if (t >= delay) { lock = [x, z]; cur = null; t = 0; run(action); }
    },
    reset() { cur = null; t = 0; lock = null; },
  };
}
