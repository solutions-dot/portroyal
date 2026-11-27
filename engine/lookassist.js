/* engine/lookassist.js: when you are in reach of something to look at or do, the camera turns gently toward it (owner, 27 November 2026: "so a person isn't
   looking at the sky when they press it"). Shared by every game with a first-person view.

   const assist = createLookAssist();
   assist.touch(now)                    call whenever the player turns the view themselves (a drag, an arrow key, a mouse look): the assist waits `delay` seconds
   assist.tick(S, target, dt, now, opts) call once a frame. S: { x, z, yaw, pitch }. target: { x, y, z } of the thing in reach, or null. opts.eye is the camera height.
   It turns S.yaw and S.pitch (never the player's position), only when the thing is more than `cone` radians off the middle of the view, and only until it is
   within a third of that, so it never fights the player: any input pauses it for `delay` seconds. It is slow (`rate` per second, eased) and does nothing in a
   scene, a talk or a panel (the game passes target null there). Reduced motion: a quarter of the speed. */
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
export function createLookAssist({ delay = 0.9, rate = 1.6, cone = 0.42, maxPitch = 0.6 } = {}) {
  let last = -1e9, active = false;
  const slow = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.25 : 1;
  return {
    touch(now) { last = now; active = false; },
    get active() { return active; },
    tick(S, target, dt, now, { eye = 1.4 } = {}) {
      if (!target || now - last < delay * 1000) { active = false; return; }
      const dx = S.x - target.x, dz = S.z - target.z, d = Math.hypot(dx, dz) || 1e-3;
      const wantYaw = Math.atan2(dx, dz), wantPitch = Math.max(-maxPitch, Math.min(maxPitch, Math.atan2((target.y ?? 0.5) - eye, d)));
      const ey = wrap(wantYaw - S.yaw), ep = wantPitch - S.pitch, off = Math.hypot(ey, ep);
      if (!active && off < cone) return;   /* already in view */
      if (active && off < cone * 0.33) { active = false; return; }
      active = true;
      const k = Math.min(1, rate * slow * dt * (0.4 + Math.min(1, off)));
      S.yaw += ey * k; S.pitch += ep * k;
    }
  };
}
