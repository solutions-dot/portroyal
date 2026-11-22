/* engine/lookkit.js: engine/lookshot.js wired the way the Kendal-pattern games need it (Kendal, Melissa, Eventide, Nanny Town, Bog Walk),
   so each game does not carry its own copy of the adapter (CLAUDE.md rule 10). 22 November 2026, owner rule 13.

   const LOOK = makeLooks({ camera, eye, bars, say, freeze, sounds, quick, reduced });
     eye()        where the player's eye is now: { x, y, z, yaw, pitch } (the camera eases back to it, read every frame)
     bars, say, freeze, quick, reduced: as engine/lookshot.js; sounds: { name: () => {} } the game's look sounds (played only while sound runs)
     fov()        optional, the play lens (default: 76 upright, 66 wide, as these games set it in resize())
   await LOOK.look({ at: [x, y, z], dist, lift, fov, reveal: (k) => {}, sound: 'name', lines: ['...'], act });   eases in, the thing acts, the lines show
     (or view: { p, look, fov } for a framing of its own); then the game's card, and LOOK.back() on its button. LOOK.cancel() on a change of step.
   LOOK.tick(dt) in the frame loop before the game's own camera; true while the look drives the camera.
   Dev: ?look=<id>&k=0.5 pauses the moment when the thing is half way (LOOK.pauseAt), for a screenshot; the title becomes "LOOK <id>". */
import * as THREE from 'three';
import { AU } from './audio.js';
import { createLookShot, frameOf } from './lookshot.js';

export function makeLooks({ camera, eye, bars, say, freeze, sounds = {}, quick = () => false, reduced = false, fov = null }) {
  const q = new THREE.Quaternion(), e = new THREE.Euler();
  const playFov = fov || (() => (innerWidth / innerHeight < 0.8 ? 76 : 66));
  const live = () => AU.ctx && AU.on && AU.ctx.state === 'running';
  /* while a look plays, the top buttons go as they do in a cinematic (engine/cine.js): only the picture, the bars and the words */
  if (typeof document !== 'undefined' && !document.getElementById('lookkit-style')) { const st = document.createElement('style'); st.id = 'lookkit-style';
    st.textContent = 'body.look-on #jbtn,body.look-on #exitbtn,body.look-on #jrow,body.look-on #snd,body.look-on #reset,body.look-on #view,body.look-on #topr,body.look-on #topright,body.look-on #goal,body.look-on #hint,body.look-on #talk,body.look-on #stick,body.look-on .tbub{visibility:hidden!important}'; document.head.append(st); }
  const LS = createLookShot({
    camera, fov: playFov, say, freeze, quick, reduced,
    bars: (on) => { bars(on); document.body.classList.toggle('look-on', on); },
    setFov: (f) => { if (Math.abs(camera.fov - f) < 0.01) return; camera.fov = f; camera.updateProjectionMatrix(); },
    sound: (n) => { if (!live()) return; const f = typeof n === 'function' ? n : sounds[n]; if (f) f(); },
    home: () => { const E = eye(); return { pos: new THREE.Vector3(E.x, E.y, E.z), quat: q.setFromEuler(e.set(E.pitch, E.yaw, 0, 'YXZ')) }; },
  });
  const K = {
    LS, pauseAt: null, id: null,
    get on() { return LS.on; },
    tick: (dt) => LS.tick(dt),
    back: () => LS.back(),
    cancel: () => LS.cancel(),
    look: async (o) => {
      const E = eye(), v0 = o.view || frameOf([E.x, E.z], o.at, { dist: o.dist ?? 1.6, lift: o.lift ?? 0.3, fov: o.fov ?? 42 });
      /* a framing is set for a wide screen; on a phone held upright the same width is kept (a taller lens, up to 90 degrees), so a board or a plaque still fits across */
      const asp = innerWidth / innerHeight, wide = 1.6, f = v0.fov || 40, view = asp >= 0.95 ? v0 : { ...v0, fov: Math.min(90, 2 * Math.atan(Math.tan((f * Math.PI) / 360) * wide / asp) * 180 / Math.PI) };
      const rev = o.reveal || (() => {});
      const reveal = K.pauseAt === null ? rev : (k) => { rev(k); if (k >= K.pauseAt && k < 1 && !LS.paused) { LS.paused = true; document.title = 'LOOK ' + (o.id || K.id || ''); } };
      await LS.play({ ...o, view, reveal });
    },
  };
  return K;
}
