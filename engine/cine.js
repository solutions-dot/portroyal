/* engine/cine.js: camera scenes framed for a phone held upright (owner, 17 November 2026: "every cinematic scene in all ten games needs a camera angle that
   keeps the action centred on portrait screens"). A camera scene is set up for a wide screen. Held upright, a phone shows the same height but under half
   the width, so people at the sides of the shot were cut off. While a scene plays, renderFramed() draws it with a taller field of view, so the picture
   keeps about 85 per cent of the width a square screen would show (never past 96 degrees, past which the edges stretch). The game's own field of view is
   put back straight after, so walking, aiming and the first-person hand are not changed. On a wide screen nothing changes.

     renderFramed(renderer, scene, camera, cine)   in place of renderer.render(scene, camera); cine: is a camera scene playing now
     cineFov(fov, aspect)                          the field of view used, for a check or a test view */
import { draw } from './look.js';   /* the picture itself: light from the sky and soft shading in corners (engine/look.js) */
const D = Math.PI / 180;
export function cineFov(fov, aspect) {
  if (!(aspect > 0) || aspect >= 1) return fov;
  const want = 0.85 * Math.min(fov, 66) * D, v = 2 * Math.atan(Math.tan(want / 2) / aspect) / D;   /* the horizontal angle to keep, and the height that gives it */
  return Math.max(fov, Math.min(96, v));
}
export function renderFramed(renderer, scene, camera, cine) {
  if (!cine || !camera.isPerspectiveCamera || camera.aspect >= 1) { draw(renderer, scene, camera); return; }
  const f0 = camera.fov, f = cineFov(f0, camera.aspect);
  if (f === f0) { draw(renderer, scene, camera); return; }
  camera.fov = f; camera.updateProjectionMatrix(); draw(renderer, scene, camera); camera.fov = f0; camera.updateProjectionMatrix();
}

let skipButton, dismissSkip;

/* A cinematic shows only the skip X (owner, 21 November 2026, every game): the Journal, Exit, sound, reset and view buttons and a scene's own
   Pause / Read instead bar hide while it plays (body.cine-on), and the X is faded so it does not pull the eye, brighter when touched or focused. Chapter title cards have no X at all. */

/* A scene owns its button until it finishes or a new scene replaces it. */
export function showCinematicSkip(onSkip, { bottom = false, left = false } = {}) {
  if (!skipButton) {
    skipButton = document.createElement('button');
    skipButton.type = 'button';
    skipButton.className = 'cine-skip';
    skipButton.setAttribute('aria-label', 'Skip cinematic');
    skipButton.textContent = '×';
    const style = document.createElement('style');
    style.textContent = `
      .cine-skip {
        position: fixed;
        top: max(12px, env(safe-area-inset-top));
        right: max(12px, env(safe-area-inset-right));
        z-index: 9999;
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        padding: 0;
        border: 2px solid #fff;
        border-radius: 6px;
        background: #10222b;
        color: #fff;
        font: 400 28px/1 system-ui;
        cursor: pointer;
        touch-action: manipulation;
        opacity: .45;
        transition: opacity .2s ease;
      }
      .cine-skip:hover, .cine-skip:focus-visible, .cine-skip:active { opacity: .9; }
      body.cine-on #jbtn, body.cine-on #exitbtn, body.cine-on #jrow, body.cine-on #snd, body.cine-on #reset,
      body.cine-on #view, body.cine-on #fbexit, body.cine-on #topr, body.cine-on #topright, body.cine-on #cineControls { visibility: hidden !important; }
      .cine-skip[hidden] { display: none; }
      .cine-skip.bottom { top: auto; bottom: max(16px, env(safe-area-inset-bottom)); }
      .cine-skip.left { right: auto; left: max(12px, env(safe-area-inset-left)); }
      .cine-skip:focus-visible { outline: 3px solid #f9c656; outline-offset: 3px; }
    `;
    document.head.append(style);
    document.body.append(skipButton);
  }
  dismissSkip?.();
  const dismiss = () => {
    if (dismissSkip !== dismiss) return;
    dismissSkip = null;
    skipButton.hidden = true;
    skipButton.onclick = null;
    document.body.classList.remove('cine-on');
  };
  dismissSkip = dismiss;
  skipButton.classList.toggle('bottom', bottom);
  skipButton.classList.toggle('left', left);
  skipButton.hidden = false;
  document.body.classList.add('cine-on');
  skipButton.onclick = () => { dismiss(); onSkip(); };
  return dismiss;
}

/* A chapter title card is short and has no skip X (owner, 21 November 2026: the X to close should not be on the chapter text screens, in any game).
   The chapter setup runs once. */
export function playChapterFade(fade, setup, onDone, [open, textOff, fadeOut, end]) {
  let applied = false;
  const apply = () => { if (!applied) { applied = true; setup(); } };
  const finish = () => {
    cancelAnimationFrame(frame);
    for (const timer of timers) clearTimeout(timer);
    fade.classList.remove('on', 'txt');
    fade.hidden = true;
    apply();
    onDone();
  };
  fade.hidden = false;
  const frame = requestAnimationFrame(() => fade.classList.add('on'));
  const timers = [
    setTimeout(() => { apply(); fade.classList.add('txt'); }, open),
    setTimeout(() => fade.classList.remove('txt'), textOff),
    setTimeout(() => fade.classList.remove('on'), fadeOut),
    setTimeout(finish, end),
  ];
}
