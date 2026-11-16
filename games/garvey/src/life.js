/* games/garvey/src/life.js: what every person in every place is doing (owner, November 2026: "too much standing around looking like zombies").
   Each person gets a behaviour from engine/ambient.js (docs/ENGINE.md): printers work at the case and the press, listeners watch the speaker
   and nod or clap, neighbours sit and talk in turn, a customer browses the shop, visitors stroll in the park. The ambient tick then owns
   their body: clips with random start times (nobody moves in step), idle variants, the head turning toward you or the speaker (limited
   and eased), feet on the ground. The game takes a person back while you talk to them (life.hold) and while it walks them somewhere
   (the hall's neighbours on their way to the benches).
   actFor(n, stage) is plain data per person and stage; main.js calls refresh() whenever the stage or the place changes. */
import { createAmbient } from '../../../engine/ambient.js';

const at = (x, z) => [x, z];
const MEN_IDLES = ['Idle', 'IdleM'], OLD_IDLES = ['OldIdle', 'Idle'], WOMEN_IDLES = ['Idle'];
const ELDERS = /nb_elder|hl_critic/;
export const sexOf = (model) => (/amy|woman|seller|nurse|guide/.test(model) ? 'f' : 'm');
export const idlesOf = (model) => (ELDERS.test(model) ? OLD_IDLES : sexOf(model) === 'f' ? WOMEN_IDLES : MEN_IDLES);

/* what each person does at each stage; null means the game moves them itself (walking to a seat, hidden, not yet arrived) */
export function actFor(n, stage) {
  const idles = idlesOf(n.model);
  if (n.hidden || n.delay > 0 || n.fol) return null;
  if (n.seat && !n.seated) return null;
  if (n.seated) return stage === 13 ? { kind: 'sit', clips: ['SitIdle', 'SitIdle2'], every: [5, 9] } : { kind: 'sit', group: 'bench', clips: ['SitIdle', 'SitIdle2', 'SitIdle3'] };
  const A = {
    /* chapter 1: the print shop, Kingston, about 1908 */
    printer: { kind: 'work', clips: ['ReachOut', 'ReachOut', 'IdleM', 'LookAround'], work: [3, 6], rest: [1.5, 3], idles },   /* picks letters from the case at his stand */
    customer: { kind: 'wander', pts: n.path, pause: [3, 6], speed: 0.85, idles },   /* looks round the shop while her notices dry */
    apprentice: { kind: 'work', clips: ['PickUp', 'WipeSweat', 'IdleM'], work: [3, 6], rest: [2, 4], idles },
    /* chapter 2: the hall, Kingston, July 1914 */
    amy: stage === 12 ? { kind: 'watch', at: at(-0.5, 3.6), react: ['WaveSlow', 'Nod'], every: [3, 6], idles }
      : stage === 13 ? { kind: 'watch', at: at(0, -2.6), react: ['Nod', 'Clap'], idles }
      : { kind: 'work', clips: ['ReachOut', 'Nod', 'LookAround'], work: [3, 6], rest: [2, 4], idles },
    garvey: stage === 13 ? { kind: 'work', clips: ['Speech', 'TalkM1', 'TalkM2', 'Speech'], work: [5, 9], rest: [0.6, 1.4], idles }
      : stage >= 14 ? { kind: 'watch', at: at(0, 1), react: ['Nod', 'WaveSlow'], idles }
      : { kind: 'work', clips: ['IdleM', 'LookAround', 'Nod'], work: [4, 7], rest: [2, 4], idles },   /* reads over his notes for the meeting */
    early1: { kind: 'sit', group: 'front', clips: ['SitIdle', 'SitIdle2', 'SitIdle3'] },
    early2: { kind: 'sit', group: 'front', clips: ['SitIdle', 'SitIdle3'] },
    /* chapter 3: a Harlem street corner, 1916 */
    garvey3: stage >= 22 ? { kind: 'work', clips: ['Speech', 'TalkM1', 'TalkM2', 'Speech'], work: [5, 9], rest: [0.5, 1.2], idles }
      : { kind: 'watch', at: at(0, 3), react: ['Nod', 'LookAround'], idles },
    worker: { kind: 'watch', at: at(0, 0.4), react: stage >= 22 ? ['Nod', 'Clap'] : ['LookAround', 'WipeSweat'], idles },
    woman: { kind: 'watch', at: at(0, 0.4), react: stage >= 22 ? ['Nod', 'Clap'] : ['LookAround'], idles },
    critic: { kind: 'watch', at: at(0, 0.4), react: ['HeadTurn', 'LookAround'], idles },
    passer1: { kind: 'wander', area: [-11, -3.9, -4, -2.7], pause: [3, 7], idles },
    passer2: { kind: 'wander', area: [4, -3.9, 11, -2.7], pause: [3, 7], idles },
    stoop: { kind: 'watch', at: at(0, 0.4), react: ['Nod', 'HeadTurn'], every: [5, 9], idles },
    /* chapter 4: the press room, Harlem, 1918 */
    pressman: { kind: 'work', clips: ['PickUp', 'ReachOut', 'WipeSweat'], work: [3, 6], rest: [1.5, 3], face: at(2.6, -1.6), idles },
    garvey4: { kind: 'work', clips: ['IdleM', 'Nod', 'LookAround'], work: [4, 7], rest: [2, 4], idles },
    sailor: { kind: 'watch', at: at(0, 0), react: ['LookAround', 'Nod'], idles },
    compositor: { kind: 'work', clips: ['ReachOut', 'ReachOut', 'IdleM'], work: [3, 6], rest: [1.5, 3], idles },
    /* chapter 5: a New York dock, 1919 */
    garvey5: { kind: 'watch', at: at(0, 6), react: ['Point', 'Nod'], idles },
    clerk: { kind: 'work', clips: ['ReachOut', 'Nod', 'IdleM'], work: [3, 6], rest: [2, 4], idles },
    engineer: { kind: 'work', clips: ['WipeSweat', 'LookAround', 'PickUp'], work: [3, 6], rest: [2, 4], face: at(5, 5), idles },
    friend: { kind: 'watch', at: at(0, 6), react: ['LookAround'], idles },
    docker1: { kind: 'work', clips: ['PickUp', 'WipeSweat', 'IdleM'], work: [3, 6], rest: [2, 4], idles },
    docker2: { kind: 'wander', area: [-8.5, -3.2, -5.5, 0], pause: [3, 7], idles },
    /* chapter 6: Liberty Hall, August 1920 */
    garvey6: stage >= 53 ? { kind: 'work', clips: ['Speech', 'TalkM1', 'TalkM2'], work: [5, 9], rest: [0.6, 1.4], idles }
      : { kind: 'watch', at: at(0, 3), react: ['WaveSlow', 'Nod'], idles },
    nurse: { kind: 'watch', at: at(0, -4.5), react: ['Nod', 'LookAround'], idles },
    delegate: { kind: 'watch', at: at(0, -4.5), react: ['LookAround', 'WipeSweat'], idles },
    messenger: { kind: 'watch', at: at(0, -4.5), react: ['LookAround', 'HeadTurn'], idles },
    steward: { kind: 'work', clips: ['Point', 'Nod', 'LookAround'], work: [2.5, 5], rest: [2, 4], idles },
    /* chapter 7: Amy Jacques Garvey's office, Harlem, 1925 */
    amyj: { kind: 'work', clips: ['ReachOut', 'Nod', 'LookAround'], work: [3, 6], rest: [2, 4], idles },   /* reads the letters on her desk */
    typist: { kind: 'work', clips: ['ReachOut', 'IdleM', 'PickUp'], work: [3, 6], rest: [2, 4], idles },
    /* chapter 8: National Heroes Park, today */
    guide: { kind: 'watch', at: at(0, -6.8), react: ['Point', 'Nod'], idles },
    student: { kind: 'watch', at: at(0, -6.8), react: ['LookAround', 'HeadTurn'], idles },
    visitor: { kind: 'wander', area: [-8.5, 3.6, 8.5, 5.6], pause: [4, 8], speed: 0.85, idles },
  };
  return A[n.id] || { kind: 'watch', idles };
}

/* one ambient system per place, made the first time the place is lived in */
export function lifeFor(P, opts) {
  if (!P.life) P.life = createAmbient({ walls: P.walls, bounds: P.bounds, seed: 7 + Object.keys(opts.PLACES).indexOf(P.key || ''), phone: opts.phone,
    keepOff: () => (P.actions || []).map((a) => ({ at: [a.x, a.z], r: Math.min(0.9, a.r * 0.7) })) });
  return P.life;
}

/* bring the place's people in line with the stage: add, change or take back each person's behaviour */
export function refresh(P, stage, opts) {
  const life = lifeFor(P, opts);
  for (const n of [...P.people, ...(P.extras || [])]) {
    if (!n.m) continue;
    const spec = actFor(n, stage), key = spec ? JSON.stringify(spec, (k, v) => (typeof v === 'function' ? undefined : v)) : '';
    if (key === n.actKey) continue;
    if (n.amb) { life.remove(n); delete n.amb; }
    n.actKey = key; n.m.userData.amb = !!spec;
    if (!spec) continue;
    n.ctl = n.m.userData.anim; n.sex = sexOf(n.model); life.add(n, spec);
  }
}

/* ---------- people in the background: nobody to talk to, each busy with something (actFor above). Bodies are other chapters' people of the
   same years, recoloured (tint multiplies the cloth colours) so a face is not seen twice in one place. Seated people sit on a real bench or
   chair (seat), facing the platform. ---------- */
export const EXTRAS = {
  shop: [{ id: 'apprentice', model: 'nb_youth', x: 2.75, z: -1.3, ry: Math.PI, tint: { Shirt: [0.9, 0.95, 1], Breeches: [1.3, 1.2, 1.0] } }],
  hall: [{ id: 'early1', model: 'woman1914', seat: [2.75, 0.2], tint: { Shirt: [0.75, 0.85, 1.0], Skirt: [0.7, 0.75, 0.95] } },
    { id: 'early2', model: 'hl_worker', seat: [1.9, 1.4], tint: { Shirt: [1.1, 1.0, 0.85], Breeches: [0.8, 0.8, 0.8] } }],
  street: [{ id: 'passer1', model: 'nb_seller', x: -8, z: -3.3, ry: Math.PI / 2, tint: { Shirt: [0.7, 0.8, 1.0], Skirt: [0.6, 0.55, 0.6] } },
    { id: 'passer2', model: 'clerk1919', x: 7.5, z: -3.3, ry: -Math.PI / 2, tint: { Jacket: [1.4, 1.3, 1.1], Breeches: [1.4, 1.3, 1.1], Hat: [1.3, 1.2, 1.0] } },
    { id: 'stoop', model: 'nb_elder', x: -4.6, z: 3.2, ry: 2.4, tint: { Jacket: [0.8, 0.9, 1.1] } }],
  press: [{ id: 'compositor', model: 'nb_youth', x: -3.75, z: -1.3, ry: -Math.PI / 2, tint: { Shirt: [1.0, 0.92, 0.8], Breeches: [0.7, 0.7, 0.75] } }],
  dock: [{ id: 'docker1', model: 'hl_worker', x: -6.0, z: -2.25, ry: Math.PI, tint: { Shirt: [0.75, 0.85, 1.05] } },
    { id: 'docker2', model: 'seaman1919', x: -7.0, z: -1.2, ry: 0.4, tint: { Shirt: [1.1, 1.05, 0.95] } }],
  liberty: [{ id: 'del1', model: 'hl_critic', seat: [-2.8, -2.2] }, { id: 'del2', model: 'hl_woman', seat: [-1.9, -1.25], tint: { Shirt: [0.8, 0.9, 1.1], Skirt: [0.8, 0.8, 0.9] } },
    { id: 'del3', model: 'woman1914', seat: [2.8, -2.2], tint: { Shirt: [1.0, 0.85, 0.85] } }, { id: 'del4', model: 'nb_elder', seat: [3.7, -1.25] }, { id: 'del5', model: 'hl_worker', seat: [1.9, 0.65], tint: { Shirt: [0.9, 1.0, 1.1] } }],
  office: [{ id: 'typist', model: 'hl_pressman', x: 3.2, z: 1.5, ry: Math.PI, tint: { Shirt: [1.05, 1.05, 1.1] } }],
  park: [{ id: 'visitor', model: 'guide2020', x: 6.5, z: 5.0, ry: -Math.PI / 2, tint: { Shirt: [0.6, 0.8, 1.1], Skirt: [0.5, 0.5, 0.6] } }],
};
