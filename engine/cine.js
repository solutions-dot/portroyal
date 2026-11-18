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
