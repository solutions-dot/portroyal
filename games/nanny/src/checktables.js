/* games/nanny/src/checktables.js: the hooks the shared ?test=all runner (engine/checks.js, docs/TESTING.md section 7) needs from this game, and this game's tables.
   main.js builds the adapter in its dev views with makeAdapter(A), where A holds the game's own functions and getters (dev builds only). */
import { CHAPTERS, JOURNAL, TALK, GOALS } from './content.js';

/* every character who appears in more than one chapter, under each id they have (cast.js LOOKS, places.js people) */
export const CHECK_TABLES = {
  real: [],   /* nobody real speaks: Nanny never speaks (docs/games/nanny.md, rule 1) */
  settle: 150,
  cast: { mama: ['mama', 'mama3', 'mama4', 'mama5', 'mama5b', 'mama6'], quamin: ['quamin', 'quamin3'], cubbenah: ['cubbenah', 'cubbenah3', 'cub6'], beneba: ['beneba', 'beneba5', 'beneba6'] },
  /* in 1740 Mama is ten years older (an elder's body), and Beneba is grown (a woman's body and her own clothes) */
  changes: [{ id: 'mama', chapter: 6, field: 'body' }, { id: 'mama', step: 60, field: 'body' }, { id: 'beneba', chapter: 6, field: 'body' }, { id: 'beneba', step: 60, field: 'body' }, { id: 'beneba', chapter: 6, field: 'colours' }, { id: 'beneba', step: 60, field: 'colours' }],
  lights: { estate: ['night'], town: ['morning', 'firenight', 'dawn'], watch: ['haze', 'day'], newtown: ['morning', 'gold'] },
  intense: { 42: 'fight' },   /* the fight starts only after its opt-in card ("Read what happened instead" is the other choice) */
  /* phones draw no shadows, so the budget is measured without them (frame() below). Headless software drawing is many times slower than a phone, so frameMs is loose here; a real phone with ?stats is the judge of time. */
  budget: { frameMs: 4000 },
  timeout: 1500000,
};

/* the ids the code unlocks itself (main.js unlock(...)), on top of the ones in the conversations */
const CODE_UNLOCKS = ['you', 'trenches', 'attacks', 'horn', 'fall', 'patent', 'hero', 'mooretown', 'journey'];
const STORIES = [{}, { job: 'watch' }, { job: 'garden' }, { job: 'run' }];
function talkLines() {
  const out = [], walk = (ls) => { for (const l of ls || []) { out.push(l); for (const c of l.choices || []) walk(c.then); } };
  for (const fn of Object.values(TALK)) for (const s of STORIES) { try { walk(fn(s)); } catch (e) { /* a talk that needs more of the story */ } }
  return out;
}

export function makeAdapter(A) {
  const P = () => A.place();
  const placeIndex = { estate: 0, town: 1, watch: 2, newtown: 3 }, OFF = 10000;
  return {
    ready: () => A.ready(),
    journal: () => { const L = talkLines(); return { pages: JOURNAL.map((p) => ({ id: p.id, title: p.title, simple: p.simple, deeper: p.deeper })), unlocks: [...new Set([...L.filter((l) => l.unlock).map((l) => l.unlock), ...CODE_UNLOCKS])], refs: ['journey'], speakers: [...new Set(L.map((l) => l.who))] }; },
    screens: () => A.screens(),
    keyMove: () => A.keyMove(),
    chapters: () => CHAPTERS,
    openChapter: (i) => A.begin(i),
    step: () => A.stage(),
    people: () => P().people.filter((n) => n.m && n.m.visible).map((n) => ({ id: n.id, name: n.who, body: n.base, hat: n.hat || null, colours: n.tint || {} })),
    light: () => ({ tod: A.envName() }),
    steps: () => Object.keys(GOALS).map(Number).filter((s) => s >= 10 && !(s in A.SAFE) && !A.scripted.includes(s)),
    goStep: (s) => A.begin(A.chapterOf(s), s),
    place: () => { const Q = P(); return { id: Q.id, start: [Q.start.x, Q.start.z], bounds: Q.bounds, walls: [], blocked: (x, z, r) => A.blocked(Q, x, z, r), r: 0.25, groundAt: () => 0,
      /* camera samples come in each place's own coordinates moved OFF metres apart (camera() below), with y the height above that place's ground: a camera is inside
         a solid when it is within a hut's, a tree's or a rock's footprint and below its top */
      solid: (x, y, z) => { const k = Math.round(x / OFF), id = Object.keys(placeIndex).find((p) => placeIndex[p] === k), Q2 = A.places()[id]; if (!Q2) return false; const rx = x - k * OFF; return y < 2.2 && Q2.solids.some((s) => Math.hypot(s[0] - rx, s[1] - z) < s[2] * 0.85); } }; },
    targets: () => A.targets(),
    snapshot: () => A.snapshot(),
    save: () => A.save(),
    restore: (d) => A.restore(d),
    places: () => Object.keys(placeIndex),
    goPlace: (id, light) => A.goPlace(id, light),
    move: (from, to) => A.move(from, to),
    faces: () => A.faces(),
    renderer: () => A.renderer,
    scene: () => A.scene,
    frame: (dt) => A.frame(dt),
    autoplay: (o) => A.autoplay(o),
    camera: () => { const Q = P(), c = A.camera.position; if (!Q || !A.started()) return null; return { x: c.x + placeIndex[Q.id] * OFF, y: c.y - Q.G.h(c.x, c.z), z: c.z }; },
    clips: () => A.clips(),
    cardSeen: (id) => A.cardSeen(id),
    audio: () => A.AU,
    setSound: (on) => A.setSound(on),
    talking: () => A.talking(),
  };
}
