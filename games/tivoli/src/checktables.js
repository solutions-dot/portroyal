/* games/tivoli/src/checktables.js: the hooks and tables for the shared ?test=all runner (engine/checks.js, docs/TESTING.md section 7), as Kendal's. Dev builds only.
   main.js hands over K, a small object of its own functions and state (`checkHooks` in main.js); everything here goes through it.
   Steps: a walking chapter N has steps N*10 + k, where k is how many of its three people you have talked to (k = 3: walk to the end spot).
   The May 2010 street scene (chapter 5) is step 50; it is tagged intense, so the run must answer its opt-in card first. */
import { CHAPTERS, JOURNAL, PAGES_FOR, CH1, CH2, CH3, CH4, CH6, CH7, CH8 } from './content.js';

const TEXTS = { 1: CH1, 2: CH2, 3: CH3, 4: CH4, 6: CH6, 7: CH7, 8: CH8 };
const FACES = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* every line of talk: the first talks and the later lines (each said by the person, as talk.js shows them) */
function allLines() { const out = []; for (const T of Object.values(TEXTS)) { for (const L of Object.values(T.talk)) out.push(...L); } return out; }
const unlockIds = () => [...new Set([...allLines().map((l) => l.unlock).filter(Boolean), ...CHAPTERS.flatMap((c) => PAGES_FOR(c.id))])];
const speakers = () => [...new Set(allLines().map((l) => l.who))];

export const CHECK_TABLES = {
  real: [],   /* real people never speak in this game (docs/games/tivoli.md): nobody on the record is a speaker */
  settle: 250,
  /* Ivy is a girl in chapters 1 and 2 (about 1963 and the 1960s), grown up in chapter 3 (about 1980) and a grandmother from chapter 4 (2010) on: body and clothes change */
  cast: { ivy: ['ivy', 'gran'] },
  changes: ['body', 'colours', 'name'].flatMap((field) => [3, 4, 6, 7, 8].flatMap((ch) => [{ id: 'ivy', chapter: ch, field }, { id: 'gran', chapter: ch, field }, { id: 'ivy', step: ch * 10, field }, { id: 'gran', step: ch * 10, field }])),
  ages: {},
  intense: { 50: 'fightcard' },   /* the May 2010 street scene opens only through its opt-in card (CLAUDE.md rule 4, Tivoli exception) */
  budget: { frameMs: 5000, calls: 220, triangles: 450000 },   /* the phone budget for draw calls and triangles (run with &noshadow: phones draw no shadow maps); frame time is not judged headless */
  soundRefs: { stepSound: ['sand', 'stone'], uiSound: ['goal', 'tap', 'page'] },
  timeout: 3600000,   /* the heads check walks and talks through all eight chapters with a stepped clock: about 15 minutes headless, more on a busy machine */
};

export function makeAdapter(K) {
  const settle = async () => { await K.settle(); };
  const go = async (s) => { for (const b of FACES.splice(0)) K.scene.remove(b); await K.begin(s); await settle(); };
  return {
    async ready() { await K.ready(); },
    journal: () => ({ pages: JOURNAL, unlocks: unlockIds(), refs: [], speakers: speakers() }),
    chapters: () => CHAPTERS.map((c, i) => ({ name: c.name, i })),
    async openChapter(i) { const id = CHAPTERS[i].id; await K.open(id); await settle(); if (K.chapter() !== id) throw new Error('opened chapter ' + K.chapter() + ', not ' + id); },
    step: () => K.step(),
    people: () => K.npcs().map((n) => ({ id: n.id, name: n.name, body: n.base, colours: n.tint ? JSON.stringify(n.tint) : undefined })),
    light: () => null,
    steps: () => K.steps(),
    async goStep(s) { await go(s); if (K.step() !== s) throw new Error('stopped at step ' + K.step()); },
    place() { const P = K.place(); if (!P) return null; return { id: 'chapter ' + K.chapter(), start: [P.start.x, P.start.z], bounds: P.bounds || K.bounds, walls: P.walls, r: 0.25 }; },
    targets() { const t = K.target(); return t ? [t] : []; },
    held: () => [],
    /* before saving: where a reload should put you; after the reload: where you really are */
    snapshot: () => ({ stage: K.step(), place: 'chapter ' + K.chapter(), journal: K.unlocks() }),
    save: () => K.save(),
    async restore(d) { await K.resume(d); await settle(); },
    places: () => K.places(),
    async goPlace(id) { await go(+id * 10); },
    move: (a, b) => K.move(a, b),
    renderer: () => K.renderer, scene: () => K.scene,
    faces: () => { for (const b of FACES.splice(0)) K.scene.remove(b); return K.npcs().map((n) => { const b = K.faceBody(n); FACES.push(b); return { id: n.id, body: b }; }); },   /* each story person's face in this place's light, standing where they stand */
    async frame(dt) { K.frame(dt); },
    async autoplay() { return K.autoplay(); },
    camera: () => { const c = K.camera.position; return { x: c.x, y: c.y, z: c.z }; },
    async talks() { return K.npcs().map((n) => n.id); },
    async talkTo(id) { K.talkTo(id); await sleep(300); K.leaveTalk(); },
    clips: () => K.clips(),
    line: () => K.line(),
    talking: () => K.talking(),
    audio: () => K.audio(),
    setSound: (on) => K.setSound(on),
    keyMove: () => K.keyMove(),
    cardSeen: (id) => K.cardSeen(id),
    screens: () => ({
      play: async () => { K.closeAll(); await go(20); },
      dialogue: async () => { K.closeAll(); await go(20); K.talkTo(K.npcs()[0].id); },
      journal: async () => { K.closeAll(); K.openJournal(); },
      chapters: async () => { K.closeAll(); K.openChapters(); },
      card: async () => { K.closeAll(); await K.open(5); },
    }),
  };
}
