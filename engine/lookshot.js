/* engine/lookshot.js: looking at something is a close-up action (owner rule 13, 22 November 2026: "It must feel like a cinematic story / story
   book"). Before this, a goal that sent the player to look at a thing flipped it to its changed state and covered the screen with a card a
   moment later: the view never moved and nothing happened. The pattern is Nanny Town's lookOut(): input is held, the letterbox bars come in,
   the camera eases (with a change of lens) from the player's eye to a close framing of the thing, the thing does something over a second or
   three with a sound, a short story line or two shows in the lower bar, the game's card says what it means, and the camera eases back.

   const LS = createLookShot({ camera, fov, setFov, bars, say, freeze, sound, quick, reduced, home });
     camera      the THREE camera
     fov()       the play lens now (degrees); setFov(f) sets the lens and updates the projection
     bars(on)    letterbox bars in or out (Hutchinson: document.body.classList.toggle('cine', on))
     say(text)   one short story line in the lower bar ('' clears it)
     freeze(on)  hold the player's input, the touch stick and the action button (the game's own busy flag)
     sound(name) a sound from the game's sfx; quick() true for the autoplayer and ?test runs: no camera, no waiting
     reduced     prefers-reduced-motion: the camera cuts instead of easing; the thing still moves
     home()      where the player's eye is now: { pos: Vector3, quat: Quaternion } (it is read every frame on the way back)

   await LS.play({ view: { p: [x, y, z], look: [x, y, z], fov: 40 }, reveal: (k) => {}, lines: ['...'], sound: 'name' });
     eases in (about 0.8 s), then runs reveal(k) with k from 0 to 1 over `act` seconds (default 2.2) and plays the sound, shows each line in
     turn (`line` seconds each, default 2.4), and resolves while the camera still holds the close framing. reveal(1) is always the last call.
   await LS.back();   the game's card has been read: bars out, the camera eases back to the player, input comes back
   LS.cancel();       a change of step or place mid-shot: everything put back at once (reveal(1) is called)
   LS.paused = true   holds the moment where it is (a dev screenshot mid-action)
   LS.tick(dt)        every frame; returns true while it is driving the camera, so the game skips its own camera that frame
   frameOf(stand, focus, { dist, lift, fov }) is a framing from where the player stands to the thing, for a look with no `view` of its own.

   How to adopt it in a game (Windrush, Rose Hall, The Shark Papers have the old lookAt copy):
   1. make one LS with the adapter above; call LS.tick(dt) before the game's own camera code and skip that code when it returns true;
   2. give each LOOKS entry a `view` (or let frameOf make one from `at` and a `focus`), and optional `say` lines and a `sound`;
   3. let the place's reveal take a number: Q.reveal[id](k) with k from 0 (as found) to 1 (changed), so the thing moves, not just shows;
   4. in lookAt: await LS.play(...), then the card, and LS.back() on its button; call LS.cancel() wherever the game changes step. */
import * as THREE from "three";

const ease = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
export function frameOf(stand, focus, { dist = 1.5, lift = 0.35, fov = 42 } = {}) {
  const dx = stand[0] - focus[0],
    dz = stand[1] - focus[2],
    d = Math.hypot(dx, dz) || 1,
    r = Math.min(dist, d + 0.3);
  return { p: [focus[0] + (dx / d) * r, focus[1] + lift, focus[2] + (dz / d) * r], look: focus.slice(), fov };
}
export function createLookShot({ camera, fov, setFov, bars = () => {}, say = () => {}, freeze = () => {}, sound = () => {}, quick = () => false, reduced = false, home }) {
  const L = { on: false, paused: false };
  let S = null;
  const aim = (p, look) => {
    const m = new THREE.Matrix4().lookAt(p, look, new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  };
  L.play = (o) =>
    new Promise((resolve) => {
      if (quick()) {
        o.reveal?.(1);
        resolve();
        return;
      }
      L.cancel();
      freeze(true);
      bars(true);
      const p = new THREE.Vector3(...o.view.p),
        look = new THREE.Vector3(...o.view.look),
        /* the camera creeps a little toward the thing while it acts, as a storybook page is leaned in to */
        push = p.clone().lerp(look, o.push ?? 0.12);
      S = {
        o, t: 0, phase: "in", resolve,
        p0: camera.position.clone(), q0: camera.quaternion.clone(), f0: fov(),
        p, push, q: aim(p, look), qPush: aim(push, look), f1: o.view.fov || 40,
        inT: reduced ? 0.01 : o.ease ?? 0.8, act: o.act ?? 2.2, line: o.line ?? 2.4, lines: o.lines || [], said: -1,
      };
      L.on = true;
    });
  L.back = () =>
    new Promise((resolve) => {
      if (!S || quick()) {
        L.cancel();
        resolve();
        return;
      }
      bars(false);
      say("");
      Object.assign(S, { phase: "out", t: 0, resolve, p0: camera.position.clone(), q0: camera.quaternion.clone(), f0: camera.fov, outT: reduced ? 0.01 : S.o.ease ?? 0.8 });
    });
  L.cancel = () => {
    if (!S) return;
    const s = S;
    S = null;
    L.on = false;
    s.o.reveal?.(1);
    bars(false);
    say("");
    freeze(false);
    setFov(fov());
    s.resolve?.();
  };
  L.tick = (dt) => {
    if (!S) return false;
    if (!L.paused) S.t += Math.min(dt, 0.1);
    const s = S;
    if (s.phase === "in") {
      const k = ease(s.t / s.inT);
      camera.position.lerpVectors(s.p0, s.p, k);
      camera.quaternion.slerpQuaternions(s.q0, s.q, k);
      setFov(s.f0 + (s.f1 - s.f0) * k);
      if (s.t >= s.inT) {
        s.phase = "act";
        s.t = 0;
        if (s.o.sound) sound(s.o.sound);
      }
    } else if (s.phase === "act" || s.phase === "hold") {
      const k = ease(s.t / Math.max(s.act, s.lines.length * s.line));
      camera.position.lerpVectors(s.p, s.push, k);
      camera.quaternion.slerpQuaternions(s.q, s.qPush, k);
      setFov(s.f1);
      if (s.phase === "act") {
        s.o.reveal?.(Math.min(1, s.t / s.act));
        const i = Math.min(s.lines.length - 1, Math.floor(s.t / s.line));
        if (i > s.said) say(s.lines[(s.said = i)]);
        if (s.t >= s.act && s.t >= s.lines.length * s.line) {
          s.o.reveal?.(1);
          s.phase = "hold";
          const r = s.resolve;
          s.resolve = null;
          r();
        }
      }
    } else if (s.phase === "out") {
      const k = ease(s.t / s.outT),
        h = home();
      camera.position.lerpVectors(s.p0, h.pos, k);
      camera.quaternion.slerpQuaternions(s.q0, h.quat, k);
      setFov(s.f0 + (fov() - s.f0) * k);
      if (s.t >= s.outT) {
        S = null;
        L.on = false;
        freeze(false);
        setFov(fov());
        s.resolve?.();
        return false;
      }
    }
    return true;
  };
  return L;
}

/* cineLayer(): the letterbox bars and the line in the lower bar, for a game that has none of its own (Garvey, Tivoli, 23 November 2026). Made
   once; returns { bars(on), say(text) } for createLookShot. The bars slide in from top and bottom; the goal, hint and toast step aside. */
let CL = null;
export function cineLayer() {
  if (CL) return CL;
  const st = document.createElement('style');
  st.textContent = '#ls-bars{position:fixed;inset:0;pointer-events:none;z-index:60}#ls-bars::before,#ls-bars::after{content:"";position:absolute;left:0;right:0;height:0;background:#000;transition:height .8s ease}#ls-bars::before{top:0}#ls-bars::after{bottom:0}body.ls-cine #ls-bars::before,body.ls-cine #ls-bars::after{height:13vh}#ls-sub{position:fixed;left:0;right:0;bottom:0;height:13vh;margin:0;display:flex;align-items:center;justify-content:center;z-index:61;color:#f3e6cc;font-family:Georgia,serif;font-style:italic;font-size:clamp(1rem,2.6vw,1.5rem);pointer-events:none;text-align:center;padding:0 16px;opacity:0;transition:opacity .4s}body.ls-cine #ls-sub{opacity:1}body.ls-cine #goal,body.ls-cine #hint,body.ls-cine #toast,body.ls-cine #nudge{opacity:0!important;pointer-events:none}';
  document.head.appendChild(st);
  const bars = document.createElement('div'); bars.id = 'ls-bars'; bars.setAttribute('aria-hidden', 'true'); document.body.appendChild(bars);
  const sub = document.createElement('p'); sub.id = 'ls-sub'; sub.setAttribute('aria-live', 'polite'); document.body.appendChild(sub);
  CL = { bars: (on) => document.body.classList.toggle('ls-cine', on), say: (t) => { sub.textContent = t || ''; } };
  return CL;
}
/* where a camera at (p) with yaw and pitch (YXZ, as most games turn their eye) is looking, d metres ahead */
export function lookFrom(p, yaw, pitch, d = 3) { return [p[0] - Math.sin(yaw) * Math.cos(pitch) * d, p[1] + Math.sin(pitch) * d, p[2] - Math.cos(yaw) * Math.cos(pitch) * d]; }
