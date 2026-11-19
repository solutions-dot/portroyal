/* engine/cine.js: camera scenes framed for a phone held upright (owner, 17 November 2026: "every cinematic scene in all ten games needs a camera angle that
   keeps the action centred on portrait screens"). A camera scene is set up for a wide screen. Held upright, a phone shows the same height but under half
   the width, so people at the sides of the shot were cut off. While a scene plays, renderFramed() draws it with a taller field of view, so the picture
   keeps about 85 per cent of the width a square screen would show (never past 96 degrees, past which the edges stretch). The game's own field of view is
   put back straight after, so walking, aiming and the first-person hand are not changed. On a wide screen nothing changes.

     renderFramed(renderer, scene, camera, cine)   in place of renderer.render(scene, camera); cine: is a camera scene playing now
     cineFov(fov, aspect)                          the field of view used, for a check or a test view */
const D = Math.PI / 180;
export function cineFov(fov, aspect) {
  if (!(aspect > 0) || aspect >= 1) return fov;
  const want = 0.85 * Math.min(fov, 66) * D, v = 2 * Math.atan(Math.tan(want / 2) / aspect) / D;   /* the horizontal angle to keep, and the height that gives it */
  return Math.max(fov, Math.min(96, v));
}
export function renderFramed(renderer, scene, camera, cine) {
  if (!cine || !camera.isPerspectiveCamera || camera.aspect >= 1) { renderer.render(scene, camera); return; }
  const f0 = camera.fov, f = cineFov(f0, camera.aspect);
  if (f === f0) { renderer.render(scene, camera); return; }
  camera.fov = f; camera.updateProjectionMatrix(); renderer.render(scene, camera); camera.fov = f0; camera.updateProjectionMatrix();
}

let skipButton, dismissSkip;

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
      }
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
  };
  dismissSkip = dismiss;
  skipButton.classList.toggle('bottom', bottom);
  skipButton.classList.toggle('left', left);
  skipButton.hidden = false;
  skipButton.onclick = () => { dismiss(); onSkip(); };
  return dismiss;
}

/* The chapter setup runs once, even when the player skips before the title appears. */
export function playChapterFade(fade, setup, onDone, [open, textOff, fadeOut, end]) {
  let applied = false;
  const apply = () => { if (!applied) { applied = true; setup(); } };
  const finish = () => {
    cancelAnimationFrame(frame);
    for (const timer of timers) clearTimeout(timer);
    hideSkip();
    fade.classList.remove('on', 'txt');
    fade.hidden = true;
    apply();
    onDone();
  };
  const hideSkip = showCinematicSkip(finish);
  fade.hidden = false;
  const frame = requestAnimationFrame(() => fade.classList.add('on'));
  const timers = [
    setTimeout(() => { apply(); fade.classList.add('txt'); }, open),
    setTimeout(() => fade.classList.remove('txt'), textOff),
    setTimeout(() => fade.classList.remove('on'), fadeOut),
    setTimeout(finish, end),
  ];
}
