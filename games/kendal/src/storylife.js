/* games/kendal/src/storylife.js: a little life for the people who stay in one place: the story people while they wait for you (Gran, Mr. Gordon,
   Mass Ezra, the mother in the coach...) and anyone else engine/ambient.js does not move. Background life (engine/ambient.js) has its own.
   - Now and then they change their stance: another idle clip for a while, a look round or a nod (sitting: another way of sitting), never in step with anyone.
   - Their head turns: a glance about every few seconds, and toward you when you come near and they can see you. Eased, never faster than about
     150 degrees a second and never more than about 60 degrees from the chest (?test=motion checks both).
   - Someone in a held pose (kneeling by a hurt man, a hand on Lloyd's shoulder, playing, carrying a basket on the head) keeps it and only glances.
   storyLifeTick(n, dt, W, { head }) runs after the person's mixer each frame; W: { px, pz, talking }; head: false leaves the head to engine/ambient.js. */
import * as THREE from 'three';
import { idleOK, lookBegin, lookEnd } from '../../../engine/anim.js';

const KEEP = /^(Kneel|Comfort|PlayPiano|PlayGuitar|Sad|Cry|Hurt|CarryHead|TorchIdle|BriefcaseIdle|SitScared|Talk|Yell)/;
const SITS = /^Sit/;
const choice = (L) => L[(Math.random() * L.length) | 0];
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const MAXYAW = 1.0, RATE = 2.6, UP = new THREE.Vector3(0, 1, 0), _ax = new THREE.Vector3(), _pq = new THREE.Quaternion(), _r = new THREE.Quaternion();
const BONES = new WeakMap();
function bonesOf(m) { let b = BONES.get(m); if (!b) { b = { neck: m.getObjectByName('mixamorigNeck'), head: m.getObjectByName('mixamorigHead') }; BONES.set(m, b); } return b; }
function turnBone(bone, axis, ang) { if (!bone || !bone.parent || Math.abs(ang) < 1e-4) return; bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_pq); _r.setFromAxisAngle(axis, ang); bone.quaternion.premultiply(_pq.clone().invert().multiply(_r).multiply(_pq)); }

/* the stances a person may change between, by kind of body and what they are doing */
function stancesOf(n) {
  const a = n.anim || 'Idle', kid = /^(boy|girl)/.test(n.base) && (n.scale || 1) < 0.9, elder = /_elder$/.test(n.base), man = /^man_|^student/.test(n.base);
  if (SITS.test(a)) return { idles: [a, man ? 'SitPoseM' : 'SitPoseF'], once: [], hold: [3, 5] };
  if (a === 'OldIdle' || elder) return { idles: ['OldIdle', 'Idle'], once: ['Nod'], hold: [6, 10] };
  if (kid) return { idles: ['Idle'], once: ['Nod'], hold: [4, 7] };
  if (man) return { idles: ['IdleM', 'Idle'], once: ['Nod', 'LookAround'], hold: [6, 10] };
  return { idles: ['Idle'], once: ['LookAround', 'Nod'], hold: [5, 8] };
}

export function storyLifeTick(n, dt, W, { head = true } = {}) {
  const m = n.m, c = n.ctl; if (!m || !c) return;
  const s = n.sl || (n.sl = { t: 2 + Math.random() * 7, look: 0, lookP: 0, want: 0, wantP: 0, gl: 1 + Math.random() * 4, hq: null, st: null });
  const talking = W.talking === n, held = (m.userData.held || []).length > 0, keep = KEEP.test(n.anim || '') || held || n.fol;
  /* stance: only while the base clip plays (a talk gesture or a reaction owns the body otherwise) */
  if (!talking && !keep && !n.path) {
    const S = s.st || (s.st = stancesOf(n));
    s.t -= dt;
    if (s.t <= 0 && c.cur === c.base) {
      const have = (k) => idleOK(k) && c.get(k);
      const gestures = S.once.filter(have), idles = S.idles.filter(k => k !== c.base.getClip().name && have(k));
      if (gestures.length && (!idles.length || Math.random() < 0.45)) {
        c.play(choice(gestures), true);
        s.t = 5 + Math.random() * 6;
      } else {
        const k = choice(idles);
        if (k) { c.play(k, false, S.hold[0] + Math.random() * (S.hold[1] - S.hold[0])); c.get(k).timeScale = 0.9 + Math.random() * 0.2; }
        s.t = 7 + Math.random() * 6;
      }
    }
  }
  /* the head */
  if (!head) return; const b = bonesOf(m); if (!b.neck && !b.head) return;
  const ry = m.rotation.y, dpx = W.px - n.x, dpz = W.pz - n.z, dp = Math.hypot(dpx, dpz), toP = wrap(Math.atan2(dpx, dpz) - ry);
  s.gl -= dt;
  if (talking || (dp < 5 && Math.abs(toP) < 1.6 && !n.fol)) { s.want = toP; s.wantP = -0.05; s.gl = Math.max(s.gl, 1); }   /* you, when you are near and in front */
  else if (s.gl <= 0) { const far = keep ? 0.5 : 0.85; s.want = Math.random() < 0.35 ? 0 : (Math.random() * 2 - 1) * far; s.wantP = (Math.random() - 0.6) * 0.15; s.gl = 2.5 + Math.random() * 3.5; }
  const yaw = Math.max(-MAXYAW, Math.min(MAXYAW, Math.abs(s.want) > 1.7 ? 0 : s.want)), lim = RATE * dt;
  s.look += Math.max(-lim, Math.min(lim, (yaw - s.look) * Math.min(1, dt * 3))); s.lookP += Math.max(-lim, Math.min(lim, (s.wantP - s.lookP) * Math.min(1, dt * 3)));
  /* the mixer writes a bone only when its clip value changes, and a still head track is written once: start each frame from the clip's pose, or the turns add up */
  const hq = s.hq || (s.hq = [b.neck, b.head].map(() => ({ base: new THREE.Quaternion(), after: new THREE.Quaternion(10, 0, 0, 0) })));
  lookBegin([b.neck, b.head]);   /* start from the clip's own pose (engine/anim.js) */
  _ax.set(Math.cos(ry), 0, -Math.sin(ry));
  turnBone(b.neck, UP, s.look * 0.4); turnBone(b.head, UP, s.look * 0.6); turnBone(b.head, _ax, s.lookP);
  lookEnd([b.neck, b.head]);
}
