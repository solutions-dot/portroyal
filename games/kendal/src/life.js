/* games/kendal/src/life.js: what the background people of each place do, as data for engine/ambient.js (docs/STANDARD.md, "Ambient life").
   lifeFor(P) runs once per place, after the crowd has been spread out and before the bodies are made. It gives each background person
   (and the odd story person outside their own step) a `life` spec, turns some crowd members into chat groups, errands, watchers and
   children at play, and adds the few people a place needs for its work (banana carriers, the mento band, helpers at the crash site).
   Clip rules (rule 4): no fear, falls, fights or shouting in ambient life. Hurt clips only stand or walk, far from the story, at the crash site.
   Every clip named here is listed in games/kendal/anim-clips.json. */
import { rng } from './gfx.js';
import { LOOKS } from './cast.js';

const PI = Math.PI;
const isKid = (e) => /^(boy|girl)/.test(e.base) && (e.scale || 1) < 0.9;
const isElder = (e) => /_elder$/.test(e.base);
const isMan = (e) => /^man_|^boy$|^student/.test(e.base);
const holds = (e) => !!(e.props && e.props.length) || !!e.lamp;
const idlesOf = (e) => (isElder(e) ? ['OldIdle', 'Idle'] : isMan(e) && !isKid(e) ? ['IdleM', 'Idle'] : ['Idle', 'LookAround']);
const talksOf = (e) => (isMan(e) ? ['TalkM1', 'TalkM2', 'Talk2'] : ['Talk1', 'Talk2', 'Talk3']);
const walkOf = (e) => (isMan(e) && !isKid(e) && !isElder(e) ? 'WalkM2' : 'Walk');
const at = (e, kind, spec = {}) => { e.life = { kind, ...spec }; delete e.path; e.walker = false; return e; };
const clampTo = (v, a, b) => Math.max(a, Math.min(b, v));

/* a lively crowd in a place: children play in pairs, holders run errands with their bags, neighbours chat in twos and threes, and the rest
   wander or watch the thing the place is about. o: { seed, area (where people may walk), watch (point of interest, or a function of a person),
   chat, wander, errand(e) -> [to x, to z] or null, sad } */
function crowd(list, o) {
  const r = rng(o.seed || 1), left = list.filter((e) => !e.life && !(e.ground > 0) && !e.seated && !/^Sit/.test(e.anim || ''));
  const kids = left.filter(isKid), grown = left.filter((e) => !isKid(e));
  /* children: in pairs, one chasing the other (in a sad scene they keep close to the grown-ups and watch) */
  for (let i = 0; i < kids.length; i++) { const k = kids[i];
    if (o.sad || o.calm) { at(k, 'watch', { at: typeof o.watch === 'function' ? o.watch(k) : o.watch, idles: ['Idle'], react: o.sad ? [] : ['Point'], every: [5, 9] }); continue; }
    const a = o.playArea || o.area; at(k, 'play', { area: [clampTo(k.x - 5, a[0], a[2] - 2), clampTo(k.z - 3, a[1], a[3] - 2), clampTo(k.x + 5, a[0] + 2, a[2]), clampTo(k.z + 3, a[1] + 2, a[3])], joy: ['Cheer', 'Clap', 'Laugh'], idles: ['Idle'] });
    if (i % 2 === 1) { k.life.chase = kids[i - 1]; } }
  /* holders: an errand along the place and back, the bag in the right hand */
  for (const e of grown) { if (!holds(e) || !o.errand) continue; const to = o.errand(e, r); if (!to) continue; at(e, 'errand', { from: [e.x, e.z], to, walk: e.props ? 'CarryBagWalk' : walkOf(e), back: e.props ? 'CarryBagWalk' : walkOf(e), idle: e.props ? 'BriefcaseIdle' : idlesOf(e)[0], wait: [4, 9] }); }
  /* chat groups: neighbours within 1.6 m who hold nothing, in twos and threes */
  let gid = 0; const free = () => grown.filter((e) => !e.life && !holds(e));
  for (const e of free()) { if (e.life || r() > (o.chat ?? 0.55)) continue; const mates = free().filter((q) => q !== e && Math.hypot(q.x - e.x, q.z - e.z) < 1.6).slice(0, r() < 0.5 ? 1 : 2); if (!mates.length) continue;
    const g = (o.id || 'g') + gid++; for (const q of [e, ...mates]) at(q, 'chat', { group: g, talks: talksOf(q), idles: idlesOf(q) }); }
  /* the rest: wander about, or watch */
  for (const e of grown) { if (e.life) continue;
    if (!holds(e) && r() < (o.wander ?? 0.5)) at(e, 'wander', { area: [clampTo(e.x - 7, o.area[0], o.area[2] - 2), clampTo(e.z - 4, o.area[1], o.area[3] - 2), clampTo(e.x + 7, o.area[0] + 2, o.area[2]), clampTo(e.z + 4, o.area[1] + 2, o.area[3])], walk: walkOf(e), idles: idlesOf(e), pause: [2, 6] });
    else at(e, 'watch', { at: typeof o.watch === 'function' ? o.watch(e) : o.watch, idles: holds(e) ? ['Idle'] : idlesOf(e), react: holds(e) ? ['Nod'] : (o.react || ['Nod', 'Point']), every: [4, 8] }); }
}

const PLACES = {
  road(P, people, extras) {   /* the railway works: two men carry baskets of earth from the cutting to the spoil heap, two talk, one picks up stones */
    const w = extras.filter((e) => e.base === 'man_work');
    if (w[0]) at(w[0], 'work', { between: [[19.2, -3.0], [35.2, -2.9]], walk: 'Carry', idle: 'CarryIdle', back: 'WalkM2', load: 'crate', wait: [2, 4] });
    if (w[1]) { w[1].x = 18.6; w[1].z = -2.7; at(w[1], 'work', { between: [[18.6, -2.7], [34.8, -2.4]], walk: 'Carry', idle: 'CarryIdle', back: 'WalkM2', load: 'crate', wait: [3, 6] }); }
    if (w[2]) { w[2].x = 41; w[2].z = -4.3; at(w[2], 'chat', { group: 'navvies', talks: ['TalkM1', 'TalkM2'], idles: ['IdleM', 'Idle'] }); }
    if (w[3]) { w[3].x = 42.1; w[3].z = -4.9; w[3].ground = 0; at(w[3], 'chat', { group: 'navvies', talks: ['TalkM1', 'TalkM2'], idles: ['IdleM', 'Idle'] }); }
    extras.push(at({ ...LOOKS.worker45, x: 40.2, z: -2.4, ry: PI, anim: 'Idle', skin: 1.05 }, 'work', { clip: 'PickUp', once: true, work: [4, 6], rest: [2, 4], idles: ['IdleM'] }));
    const cleo = people.find((p) => p.id === 'cleo'); if (cleo) cleo.anim = 'CarryHeadIdle';   /* her basket rests on her head; her hand steadies it */
  },
  station45(P, people, extras) {   /* the first train: the town watches the engine, cheering now and then, not without end */
    const ex = extras.filter((e) => e.base !== 'man_work' || !(e.ground > 0));
    const gov = extras.filter((e) => e.name === 'governor' || (e.base === 'man_suit' && e.z < 3 && e.x > 16));
    gov.forEach((e) => at(e, 'chat', { group: 'governor', talks: ['TalkM1', 'TalkM2'], idles: ['IdleM', 'Idle'] }));
    crowd(ex, { id: 's45', seed: 45, area: [-20, 2.4, 30, 11.5], playArea: [0, 9.4, 26, 11.8], watch: (e) => [clampTo(e.x, -12, 18), -3], react: ['Cheer', 'Clap', 'WaveSlow', 'Nod'], chat: 0.35, wander: 0.25, errand: (e) => [clampTo(e.x + 9, -18, 28), e.z] });
  },
  ride45(P, people, extras) {   /* the open carriage: two on one bench talk in turn; the lady looks out */
    for (const e of extras) { const row = e.z < 0 ? 'back' : 'front'; at(e, 'sit', { group: row === 'back' ? 'bench1' : undefined, clips: e.base === 'man_work' ? ['SitIdle', 'SitPoseM'] : ['SitIdle', 'SitPoseF'] }); }
  },
  hill(P, people, extras) {   /* the banana harvest: two carriers walk bunches on their heads from the field gate to the far wagon */
    const c = [[{ ...LOOKS.worker45, skin: 1.08 }, [-4.2, 12.6], [-21.6, 0.9]], [{ ...LOOKS.woman45, skin: 0.96 }, [8.6, 12.4], [-18.8, 0.8]], [{ ...LOOKS.worker45, skin: 0.92, hat: false }, [-5.0, 11.2], [-20.2, 0.7]]];
    for (const [look, from, to] of c) extras.push(at({ ...look, x: from[0], z: from[1], ry: PI, anim: 'Idle' }, 'errand', { from, to, walk: 'CarryHeadWalk', back: look.base === 'man_work' ? 'WalkM2' : 'Walk', idle: 'CarryHeadIdle', drop: true, pick: 'PickUp', load: 'bunch', wait: [2, 5] }));
  },
  kingston57(P, people, extras) {   /* the platform: families chat, children play, people with cases walk along the train, others watch it */
    crowd(extras, { id: 'k57', seed: 57, area: [-50, 1.4, 42, 8.6], playArea: [-48, 1.6, 40, 8.4], watch: (e) => [e.x + 2, -3], react: ['Nod', 'Point', 'WaveSlow'], chat: 0.6, wander: 0.45, errand: (e, r) => [clampTo(e.x + (r() < 0.5 ? -10 : 10), -48, 40), clampTo(e.z + (r() - 0.5) * 2, 1.8, 8)] });
    const lloyd = people.find((p) => p.id === 'lloyd'); if (lloyd) { lloyd.anim = 'Idle'; lloyd.life = { kind: 'play', area: [-7.5, 3.2, -0.5, 8.2], joy: ['Cheer', 'Clap', 'Laugh'], idles: ['Idle'] }; }   /* he plays near Gran, except in his own step */
  },
  coach(P, people, extras) {   /* the coach: neighbours on a bench talk in turn */
    for (const e of extras) at(e, 'sit', { group: 'bench' + e.x.toFixed(1) + (e.z < 0 ? 'L' : 'R'), clips: isMan(e) && !isKid(e) ? ['SitIdle', 'SitPoseM'] : ['SitIdle', 'SitPoseF'] });
  },
  beach(P, people, extras) {   /* the beach: children play, people stroll and chat; a mento band plays and a few people sway to it */
    for (let i = extras.length - 1; i >= 0; i--) if (extras[i].band) extras.splice(i, 1);
    extras.push({ ...LOOKS.clive, x: 13.0, z: 3.7, ry: 0.55, anim: 'PlayGuitar', props: [['Chest', 'guitar']], skin: 1, life: { kind: 'work', clip: 'PlayGuitar', work: [30, 60], rest: [1, 2], idles: ['PlayGuitar2'] }, noSpread: true });
    extras.push({ ...LOOKS.worker45, x: 14.6, z: 3.0, ry: 0.15, anim: 'PlayGuitar2', props: [['Chest', 'banjo']], skin: 0.95, life: { kind: 'work', clip: 'PlayGuitar2', work: [30, 60], rest: [1, 2], idles: ['PlayGuitar'] }, noSpread: true });
    extras.push({ ...LOOKS.muleteer, x: 15.4, z: 4.05, ry: -0.6, anim: 'PlayPiano', seat: 0.5, skin: 1.1, hat: 'Hat', life: { kind: 'sit', clips: ['PlayPiano'], every: [20, 40], prop: true } });   /* his instrument is the box he sits on */   /* the rumba box player sits on his box and plucks its keys */
    const lis = [[12.4, 6.6], [13.6, 7.1], [14.9, 6.9], [16.2, 6.2], [17.0, 4.8]];
    const adults = extras.filter((e) => !e.life && !isKid(e) && !holds(e) && e.z > 0).slice(0, lis.length);
    adults.forEach((e, i) => { e.x = lis[i][0]; e.z = lis[i][1]; at(e, 'watch', { at: [14.2, 3.6], idles: ['ListenMusic', 'ListenMusic', 'Idle'], react: ['Clap', 'Nod'], every: [6, 12] }); });
    crowd(extras, { id: 'beach', seed: 43, area: [-34, -15.5, 34, 11], playArea: [-30, -15.5, 30, -8], watch: [0, -22], react: ['Nod', 'Point', 'WaveSlow'], chat: 0.55, wander: 0.6 });
  },
  crash(P, people, extras) {   /* the long night (a sad scene): helpers with lamps fetch and carry, others watch over the wreck, survivors rest by the fire */
    const lloyd = extras.find((e) => e.base === 'boy'); if (lloyd) lloyd.anim = 'ComfortTake';   /* Gran's hand on his shoulder (ComfortChild and ComfortTake are a pair) */
    for (const e of extras) {
      if (e.life || e === lloyd || e.tended) continue;
      if (e.fire) { at(e, e.seat !== undefined ? 'sit' : 'watch', e.seat !== undefined ? { sadClips: ['SitIdle', 'SitDisbelief'], clips: ['SitIdle'], stay: true } : { at: [-3, 6], idles: ['Sad1', 'Sad2'], sadIdles: e.hurt ? ['HurtIdle', 'Sad1'] : ['Sad1', 'Sad2', 'Cry'], stay: true, every: [6, 10] }); continue; }
      if (e.call) { at(e, 'chat', { group: e.call, talks: talksOf(e), idles: idlesOf(e), stay: true }); continue; }
      if (e.gully) { at(e, 'watch', { at: [-20, -12], idles: ['TorchIdle', 'Idle'], sadIdles: ['TorchIdle', 'Sad1'], stay: true }); continue; }
    }
    const vil = extras.filter((e) => !e.life && e !== lloyd && !e.tended);
    vil.forEach((e, i) => {
      if (e.lamp && i % 3 === 0) at(e, 'errand', { from: [e.x, e.z], to: [clampTo(e.x - 6 + (i % 5) * 3, -12, 20), 20.5], walk: 'Walk', back: 'Walk', idle: 'TorchIdle', wait: [4, 9], speed: 0.8, stay: true });
      else if (!e.lamp && i % 4 === 1) at(e, 'watch', { at: [e.x - 2, e.z - 6], idles: ['Kneel', 'Kneel', 'Sad1'], sadIdles: ['Kneel', 'Kneel', 'Sad1'], every: [8, 14], stay: true });   /* kneeling at the edge of the gully, looking for people */
      else at(e, 'watch', { at: [-14, -12], idles: e.lamp ? ['TorchIdle', 'Idle'] : ['Sad1', 'Sad2'], sadIdles: e.lamp ? ['TorchIdle', 'Sad1'] : ['Sad1', 'Sad2', 'Idle'], every: [5, 9], stay: true });
    });
    extras.push(at({ ...LOOKS.worker45, hat: false, x: -9.2, z: 4.2, ry: 0.6, anim: 'HurtIdle', skin: 1.0, tint: { ...LOOKS.worker45.tint, Shirt: 0xb8b0a0 } }, 'wander', { pts: [[-9.2, 4.2], [-7.4, 4.9], [-8.6, 5.6]], walk: 'HurtWalk', idles: ['HurtIdle'], sadIdles: ['HurtIdle'], speed: 0.6, pause: [5, 9], stay: true }));   /* a survivor who can walk, slowly, by the fire */
  },
  memorial(P, people, extras) {   /* a school group at the memorial (calm): they look at the monument, two talk quietly. They stand to one side, clear of the ways to Miss Joy, Andre, the monument and the flowers */
    const spots = [[9.4, -2.0], [10.5, -1.3], [11.6, -2.1], [9.9, -0.4], [11.0, -0.1], [12.2, -0.9]];
    extras.forEach((e, i) => { if (spots[i]) { e.x = spots[i][0]; e.z = spots[i][1]; e.ry = Math.atan2(4 - e.x, -9.5 - e.z); } if (i === 1 || i === 2) at(e, 'chat', { group: 'pupils', talks: ['Talk1', 'Talk2'], idles: ['Idle'] }); else at(e, 'watch', { at: [4, -9.5], idles: ['Idle', 'LookAround'], react: ['Nod', 'Point'], every: [5, 9] }); e.anim = 'Idle'; });
  },
};

export function lifeFor(P) { const f = PLACES[P.id]; if (f) f(P, P.specs.people, P.specs.extras); for (const e of [...P.specs.extras, ...P.specs.people]) e.sex = isMan(e) ? 'm' : 'f'; }
export const KEEP = {};
