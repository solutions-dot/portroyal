/* engine/talk-cam.js: when a talk starts, the view turns to the person talking (21 November 2026). Before this, the person turned to face you but
   your view stayed where it was, and on a phone the speaker could sit cut off at the edge while the dialogue box covered the rest.
   Every game uses yaw 0 = looking toward -z, forward = (-sin yaw, -cos yaw), and pitch > 0 = looking up (camera.rotation 'YXZ').

   const TC = createTalkCam();
   TC.begin()               when a conversation opens (openConvo / startTalk)
   TC.end()                 when it closes
   TC.cancel()              when the player drags to look during the talk: the player wins, the view stops turning
   TC.step(state, eye, head, dt)   every frame while talking: eases state.yaw and state.pitch so the head sits a little above the middle of the
                            screen, clear of the dialogue box. eye and head are { x, y, z } (y may be omitted: then pitch is left alone).
   Pure helpers (yawTo, angleDiff, easeAngle, talkAim) are tested in node by tests/talk-cam.mjs. */

export const yawTo = (px, pz, tx, tz) => Math.atan2(-(tx - px), -(tz - pz));
export const angleDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
export const easeAngle = (a, b, k) => a + angleDiff(a, b) * k;
/* where to look: the yaw toward the speaker, and a pitch a little below their head so the head shows above the dialogue box */
export function talkAim(eye, head, { lift = 0.1, maxPitch = 0.45 } = {}) {
  const dx = head.x - eye.x, dz = head.z - eye.z, d = Math.hypot(dx, dz);
  const yaw = yawTo(eye.x, eye.z, head.x, head.z);
  const pitch = (eye.y === undefined || head.y === undefined) ? null : Math.max(-maxPitch, Math.min(maxPitch, Math.atan2(head.y - eye.y, Math.max(0.5, d)) - lift));
  return { yaw, pitch, d };
}

export function createTalkCam({ rate = 4.5, lift = 0.1, minDist = 0.35 } = {}) {
  const T = { on: false, held: false };
  T.begin = () => { T.on = true; T.held = false; };
  T.end = () => { T.on = false; T.held = false; };
  T.cancel = () => { if (T.on) T.held = true; };
  T.step = (state, eye, head, dt) => {
    if (!T.on || T.held || !state || !eye || !head) return false;
    const a = talkAim(eye, head, { lift }); if (a.d < minDist) return false;
    const k = 1 - Math.exp(-rate * Math.max(0, Math.min(dt, 0.1)));
    state.yaw = easeAngle(state.yaw, a.yaw, k);
    if (a.pitch !== null && typeof state.pitch === 'number') state.pitch += (a.pitch - state.pitch) * k;
    return Math.abs(angleDiff(state.yaw, a.yaw)) > 0.01;
  };
  return T;
}
