/* engine/card-keys.js: on a desktop, the space bar presses the "next" button of an open card (owner, 27 November 2026).
   Cards are the games' #card (or Tivoli's #chcard) dialogs. Only a plain forward button is pressed (Next, Next chapter, Go on, Begin,
   Continue, Watch scene, OK): never a choice such as Reset, Exit, Yes or a delete, and never while the player is typing or has a
   button focused (a focused button already answers the space bar). Loaded by engine/input.js, so every game has it. */
const FORWARD = /^(next( chapter)?|go on|begin|continue|watch scene|ok|okay|start|done)$/i;
const CARDS = ['#card', '#chcard'];
const BUTTONS = ['#cbtns button', '#chcardb button', '#chcardb a'];
function openCard() { for (const s of CARDS) { const el = document.querySelector(s); if (el && !el.hidden && el.getClientRects().length > 0) return el; } return null; }
function onKey(e) {
  if (e.code !== 'Space' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target, tag = t && t.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A' || (t && t.isContentEditable)) return;
  const card = openCard(); if (!card) return;
  const btn = [...card.querySelectorAll(BUTTONS.join(','))].find((b) => !b.disabled && FORWARD.test(b.textContent.trim()));
  if (!btn) return;
  e.preventDefault(); e.stopPropagation(); btn.click();
}
if (typeof addEventListener === 'function') addEventListener('keydown', onKey, true);
export const cardKeys = { onKey, FORWARD };
