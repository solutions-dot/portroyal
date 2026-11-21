/* engine/action-button.js: where the button for a thing to do sits, the same in every game (owner, 21 November 2026): up in the middle
   of the screen, just below where you look. You still press it: actions do not happen by themselves (the owner tried that and asked for
   the button back). Bog Walk's button is called #act (Scrape, Read the notice board, Climb on to the car): it sat at the side of its middle column, and
   is placed here with the rest (owner, 21 November 2026: "The 'Scrape' button should be center screen as well"). */
const CSS = '#talk.btn,#act.btn{position:fixed!important;top:62%!important;bottom:auto!important;left:50%!important;transform:translate(-50%,-50%)!important;max-width:calc(100vw - 32px);white-space:nowrap}@media (max-aspect-ratio:4/5){#act.btn{top:38%!important}}';   /* on an upright phone Bog Walk's torch is held up the middle of the lower screen: its button sits above the flame */
export function placeActionButton() {
  if (typeof document === 'undefined' || document.getElementById('action-button-css')) return;
  const st = document.createElement('style'); st.id = 'action-button-css'; st.textContent = CSS; document.head.appendChild(st);
}
