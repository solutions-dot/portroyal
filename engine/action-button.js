/* engine/action-button.js: where the button for a thing to do sits, the same in every game (owner, 21 November 2026): up in the middle
   of the screen, just below where you look. You still press it: actions do not happen by themselves (the owner tried that and asked for
   the button back). Bog Walk's #act already sits in its middle column. */
const CSS = '#talk.btn{position:fixed!important;top:62%!important;bottom:auto!important;left:50%!important;transform:translate(-50%,-50%)!important;max-width:calc(100vw - 32px);white-space:nowrap}';
export function placeActionButton() {
  if (typeof document === 'undefined' || document.getElementById('action-button-css')) return;
  const st = document.createElement('style'); st.id = 'action-button-css'; st.textContent = CSS; document.head.appendChild(st);
}
