/* games/nanny/src/life.js: what the people of each place do when they are not moving the story, as data for engine/ambient.js
   (docs/STANDARD.md, "Ambient life"). Owner, November 2026: "too much standing around looking like zombies".
   lifeFor(P) runs once per place, after settle() has spread the crowd out and before the bodies are made. It gives each person a `life` spec:
     - background villagers work, carry loads on their heads, chat in twos and threes, walk about, and children play;
     - the people you talk to stand at their own spot and "watch" (small shifts of weight, another idle now and then, a look at you when you come near);
     - in the night of 1734 nobody laughs or plays: people talk low and watch the path; on the ridge at dawn (a sad scene) they look back at the town.
   Rule 4 and the game's own rules: no fear, falls or fights in background life, and nothing sacred (no drumming, dancing, praying or ceremony:
   docs/games/nanny.md, rule 3). The work shown is ordinary daily work: digging the yam hills, tending the fire, carrying baskets.
   Who is moved by the story (a guide, a follower, a soldier in the column, a fighter in the bush) is taken out of background life while the story
   has them (main.js, npcTick) and given back afterwards. Every clip named here is in games/nanny/anim-clips.json. */
import { rng } from './gfx.js';

const isKid = (e) => /^maroon_(boy|girl|child)/.test(e.base);
const isMan = (e) => /^(maroon_(man|scout|elder|boy)|redcoat|militia)$/.test(e.base);
const isElder = (e) => /elder/.test(e.base);
const holds = (e) => !!(e.props && e.props.length);
const idlesOf = (e) => (isKid(e) ? ['Idle', 'LookAround'] : isElder(e) ? ['OldIdle', 'Idle', 'LookAround'] : isMan(e) ? ['IdleM', 'Idle', 'LookAround'] : ['Idle', 'LookAround', 'IdleM']);
const talksOf = (e) => (isMan(e) && !isKid(e) ? ['TalkM1', 'TalkM2', 'Talk2'] : ['Talk1', 'Talk2', 'Talk3']);
const walkOf = (e) => (isMan(e) && !isKid(e) && !isElder(e) ? 'WalkM2' : 'Walk');
const set = (e, kind, spec = {}) => { e.life = { kind, ...spec }; return e; };
const clampTo = (v, a, b) => Math.max(a, Math.min(b, v));
const box = (x, z, rx, rz, A) => [clampTo(x - rx, A[0], A[2] - 2), clampTo(z - rz, A[1], A[3] - 2), clampTo(x + rx, A[0] + 2, A[2]), clampTo(z + rz, A[1] + 2, A[3])];

/* a story person between their talks: stands at their spot facing the way they were set, and looks at you when you come near */
const storyWatch = (e, at, react = ['Nod']) => set(Object.assign(e, { story: true }), 'watch', { at, idles: idlesOf(e), react: holds(e) ? [] : react, every: [4, 7], sadIdles: ['Sad1', 'Sad2', 'Idle'] });

/* a lively crowd: children play in pairs, some grown-ups carry a basket on the head between two spots, neighbours chat in twos and threes,
   the rest walk about or watch the thing the place is about. o: { seed, area, watch, chat, wander, carry: [[from, to], ...] } */
function crowd(list, o) {
  const r = rng(o.seed || 1), left = list.filter((e) => !e.life);
  const kids = left.filter(isKid), grown = left.filter((e) => !isKid(e));
  kids.forEach((k, i) => {
    if (o.quiet) { set(k, 'watch', { at: o.watch, idles: ['Idle', 'LookAround'], sadIdles: ['Sad1', 'Idle'], every: [5, 9], stay: true }); return; }
    set(k, 'play', { area: box(k.x, k.z, 5, 4, o.area), joy: ['Cheer', 'Clap', 'Laugh'], idles: ['Idle', 'LookAround'] }); if (i % 2 === 1) k.life.chase = kids[i - 1];
  });
  for (const [from, to] of o.carry || []) {   /* a basket of yams carried on the head from one spot to another and back (the load is shown only on the way there) */
    const e = grown.find((q) => !q.life && !holds(q)); if (!e) break; e.x = from[0]; e.z = from[1]; e.placed = true;
    set(e, 'work', { between: [from, to], walk: 'CarryHeadWalk', idle: 'CarryHeadIdle', back: walkOf(e), pick: 'PickUp', load: 'basket', wait: [2, 5] });
  }
  let gid = 0; const free = () => grown.filter((e) => !e.life && !holds(e));
  for (const e of free()) { if (e.life || r() > (o.chat ?? 0.55)) continue; const mates = free().filter((q) => q !== e && Math.hypot(q.x - e.x, q.z - e.z) < 3.2).slice(0, r() < 0.5 ? 1 : 2); if (!mates.length) continue;
    const g = (o.id || 'g') + gid++; for (const q of [e, ...mates]) set(q, 'chat', { group: g, talks: o.quiet ? ['Talk3', 'Talk2'] : talksOf(q), idles: o.quiet ? ['Idle', 'LookAround'] : idlesOf(q), stay: true }); }
  for (const e of grown) { if (e.life) continue;
    if (!holds(e) && !o.quiet && r() < (o.wander ?? 0.5)) set(e, 'wander', { area: box(e.x, e.z, 6, 5, o.area), walk: walkOf(e), idles: idlesOf(e), pause: [2, 6] });
    else set(e, 'watch', { at: o.watch, idles: holds(e) ? ['Idle', 'LookAround'] : idlesOf(e), react: o.quiet ? [] : ['Nod', 'Point'], sadIdles: ['Sad1', 'Sad2', 'Idle'], every: [4, 8], stay: true }); }
}

const PLACES = {
  estate(P, people) {   /* night on the estate: Mama and Quamin wait by the huts for you, then lead and follow (main.js). The watchman walks his road with the lantern. */
    for (const e of people) storyWatch(e, [2, 40.6]);
  },
  town(P, people, extras) {
    const S = P.spots, A = [-11.5, -11.5, 11.5, 11.5];
    /* chapter 2, a morning in the town: Auntie Mimba in her garden, Cubbenah with his horn, Beneba; the neighbours at work round the fire and in the garden */
    for (const e of people) { if (!e.when || e.when[0] !== 20) continue; storyWatch(e, e.id === 'mimba' ? [-23, 5] : e.id === 'cubbenah' ? [0, 3] : [3, 9], e.id === 'beneba' ? ['Wave', 'Nod'] : ['Nod']); }
    const day = extras.filter((e) => e.when && e.when[0] === 20 && !e.id && !(e.base === 'maroon_elder_woman' && e.beads));
    const garden = day.filter((e) => e.x < -17), clearing = day.filter((e) => e.x >= -17);
    garden.forEach((e, i) => set(e, 'work', { clips: i % 2 ? ['PickUp', 'Kneel'] : ['Kneel', 'PickUp'], work: [4, 8], rest: [2, 4], idles: idlesOf(e), face: [-23, 5] }));   /* digging and planting the yam hills */
    const tender = clearing.find((e) => !isKid(e) && !holds(e)); if (tender) { tender.x = -1.5; tender.z = 2.2; tender.placed = true; set(tender, 'work', { clips: ['Kneel', 'PickUp'], work: [5, 9], rest: [2, 4], idles: idlesOf(tender), face: [-3, 3] }); }   /* someone kneels by the cook fire */
    crowd(clearing, { id: 't2', seed: 21, area: A, watch: [-3, 3], chat: 0.5, wander: 0.55, carry: [[[-9.4, 7.6], [-14.2, 3.4]], [[8.4, 9.4], [3.2, 4.2]]] });
    /* the guide and Mama, once they are home (they lead and follow you up the path first) */
    for (const e of extras) if (e.id === 'mamaT' || e.id === 'quaminT') storyWatch(e, [-3, 3]);
    /* chapter 5, the night of 1734: the horn has woken the town. People talk low and watch the narrow path; nobody laughs or plays. They run up the back trail later (main.js). */
    for (const e of people) if (e.when && e.when[0] === 50 && e.id !== 'phibba') storyWatch(e, [22, 22], []);
    const ph = people.find((e) => e.id === 'phibba'); if (ph) set(ph, 'watch', { at: [0, 0], idles: ['Sad1', 'Sad2'], sadIdles: ['Sad1', 'Sad2'], every: [5, 8], stay: true });   /* little Phibba is crying by the cotton tree until you find her */
    crowd(extras.filter((e) => e.flee), { id: 't5', seed: 51, area: A, watch: [22, 22], quiet: true, chat: 0.6 });
    /* dawn on the ridge (sad): everyone looks back at the town */
    for (const e of people) if (e.when && e.when[0] === 55) storyWatch(e, [0, 0], []);
    for (const e of extras) if (e.when && e.when[0] === 55 && !holds(e)) set(e, 'watch', { at: [0, 0], idles: ['Sad1', 'Sad2', 'Idle'], sadIdles: ['Sad1', 'Sad2', 'Idle'], every: [5, 9], stay: true });
    /* the soldiers in the empty town, seen far off from the ridge: they stand and look about */
    for (const e of extras) if (e.when && e.when[0] === 55 && holds(e)) set(e, 'watch', { at: [e.x + Math.sin(e.ry || 0) * 4, e.z + Math.cos(e.ry || 0) * 4], idles: ['IdleM', 'Idle', 'LookAround'], react: [], every: [5, 9], stay: true, far: true });
    const nanny = extras.find((e) => e.id === 'nanny'); if (nanny) set(nanny, 'watch', { idles: ['Idle', 'OldIdle'], react: [], every: [6, 10], far: true });   /* Nanny on the high rock: far off, still and calm. She never speaks. */
  },
  watch(P, people, extras) {   /* the watch rock (chapters 3 and 4): Quamin, Cubbenah and Mama; men in leaf cloaks at the trenches watch the valley */
    for (const e of people) storyWatch(e, [10, 40]);
    for (const e of extras) if (e.fixed) set(e, 'watch', { at: [10, 40], idles: ['IdleM', 'Idle', 'LookAround'], react: [], every: [5, 9], far: true });
  },
  newtown(P, people, extras) {   /* New Nanny Town, 1740: a busy morning by the river. The paper on its stone draws a few people. */
    for (const e of people) storyWatch(e, [3.6, -4.6], ['Nod', 'Wave']);
    const pg = extras.find((e) => e.base === 'maroon_girl' && !e.wild && Math.hypot(e.x - 3.2, e.z + 1.6) < 0.5); if (pg) set(pg, 'watch', { at: [3.6, -4.6], idles: ['Idle', 'LookAround'], react: ['Point', 'Nod'], every: [4, 7] });
    for (const e of extras) if (e.id === 'nanny6' || e.wild) set(e, 'watch', { at: e.id === 'nanny6' ? [e.x - 6, e.z - 30] : [e.x + 0.1, e.z - 3], idles: e.id === 'nanny6' ? ['Idle', 'OldIdle'] : idlesOf(e), react: [], every: [6, 10], far: true });
    const tender = extras.find((e) => !e.life && !isKid(e) && !e.wild && e.base !== 'maroon_girl'); if (tender) { tender.x = -6.4; tender.z = 4.4; tender.placed = true; set(tender, 'work', { clips: ['Kneel', 'PickUp'], work: [5, 9], rest: [2, 4], idles: idlesOf(tender), face: [-5, 5.4] }); }
    crowd(extras.filter((e) => !e.wild && !e.id), { id: 'n6', seed: 61, area: [-11, -11, 11, 11], watch: [3.6, -4.6], chat: 0.5, wander: 0.5, carry: [[[-8.6, 9.2], [-4.2, 7.6]], [[9.6, 2.4], [5.4, 6.6]]] });
  },
};

export function lifeFor(P) { const f = PLACES[P.id]; if (f) f(P, P.specs.people, P.specs.extras); for (const e of [...P.specs.extras, ...P.specs.people]) e.sex = isMan(e) ? 'm' : 'f'; }
/* which background life a person belongs to: one for each set of people who are in the place together (their `when`); the story people of that set
   in a life of their own (they stand at their own spot, which the story's ways lead to, so the ways are not kept clear of them); and far figures on open
   hillside that never move (they stand where you cannot walk, so they are not judged against the walkable ground) */
export const lifeKey = (e) => (e.life && e.life.far ? 'far:' : e.story ? 'story:' : '') + (e.when ? e.when.join('-') : 'all');
/* the mood of a scene: the night of 1734 is calm and low, the ridge at dawn is sad */
export const MOOD = (stage) => (stage >= 55 && stage <= 59 ? 'sad' : stage >= 50 && stage <= 54 ? 'calm' : stage >= 30 && stage <= 49 ? 'calm' : 'lively');
