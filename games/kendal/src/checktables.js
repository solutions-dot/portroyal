/* games/kendal/src/checktables.js: the hooks and tables for the shared ?test=all runner (engine/checks.js, docs/TESTING.md section 7). Dev builds only.
   main.js hands over K, a small object of its own functions and state (see `checkHooks` in main.js); everything here goes through it. */
import { needList } from '../../../engine/story.js';
import { STEPS, placeOfStage } from './steps.js';
import { CHAPTERS, JOURNAL, TALK } from './content.js';

const FACES = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* the speakers: every `who` in the conversations, with the game's story choices filled in (each talk is a function of the story so far) */
const ARG = { road: 'help', beach: 'band', why: 'safe', lamp: true, stage: 0, got: () => 0 };
const allLines = () => { const out = []; for (const f of Object.values(TALK)) { let ls = []; try { ls = typeof f === 'function' ? f(ARG) : f; } catch (e) { ls = []; } const walk = (L) => { for (const l of L || []) { if (!l) continue; out.push(l); if (l.choices) for (const c of l.choices) walk(c.then); } }; walk(ls); } return out; };
/* the pages the game opens: the unlock() calls in main.js, and every `unlock` on a line of talk */
const MAIN_UNLOCKS = ['you', 'first-train', 'slowroad', 'higglers', 'projector', 'greenvale', 'mento', 'crash', 'cause', 'helpers', 'toll', 'mourning', 'remember', 'railend', 'journey', 'ezra'];
const unlockIds = () => [...new Set([...MAIN_UNLOCKS, ...allLines().map((l) => l.unlock).filter(Boolean)])];
function speakers() {
  const out = new Set(), arg = { road: 'help', beach: 'band', why: 'safe', lamp: true, stage: 0, got: () => 0 };
  for (const f of Object.values(TALK)) { let ls = []; try { ls = typeof f === 'function' ? f(arg) : f; } catch (e) { ls = []; } const walk = (L) => { for (const l of L || []) { if (l && l.who) out.add(l.who); if (l && l.choices) for (const c of l.choices) walk(c.then); } }; walk(ls); }
  return [...out];
}
export const CHECK_TABLES = {
  real: ['Lord Elgin', 'Governor'],   /* real people never speak; the Governor stands silently in 1845 */
  settle: 250,
  /* the same people across chapters: Gran and Lloyd in chapters 4 to 6, Mass Ezra as a boy (1890s) and an old man (1957), Mass Dudley in chapters 1 and 2 */
  cast: { gran: ['gran', 'gran4', 'gran5', 'gran6', 'granCoach'], lloyd: ['lloyd', 'lloyd5', 'lloydCoach'], dudley: ['dudley', 'dudley2'], ezra: ['ezraboy', 'ezra'] },
  /* Ezra is a boy in the 1890s (chapter 3) and an old railwayman in 1957 (chapter 4): body, clothes, hat and name ('Ezra', then 'Mass Ezra') change between them, in either order (the runner visits the chapters, then the steps) */
  changes: ['body', 'hat', 'colours', 'name'].flatMap((field) => [{ id: 'ezra', step: 30, field }, { id: 'ezra', step: 40, field }, { id: 'ezra', chapter: 3, field }, { id: 'ezra', chapter: 4, field }]),
  ages: { ezra: [[1895, 10], [1957, 72]] },   /* a boy of about ten in the 1890s is about seventy in 1957 */
  budget: { frameMs: 5000, calls: 220, triangles: 450000 },   /* the phone budget for draw calls and triangles (run with &noshadow: phones draw no shadow maps); frame time is not judged headless, where software drawing is many times slower than a phone */
  soundRefs: { stepSound: ['grass', 'wood', 'stone', 'sand'], uiSound: ['goal', 'tap'], cue: ['begin'] },
  timeout: 1800000,
};

export function makeAdapter(K) {
  const P = () => K.place(), visible = () => (P() ? P().npcs.filter((n) => n.m && n.m.visible) : []);
  const settle = async () => { await K.settle(); };
  const go = async (s) => { for (const b of FACES.splice(0)) K.scene.remove(b); await K.begin(s); await settle(); };
  return {
    async ready() { await K.ready(); },
    journal: () => ({ pages: JOURNAL, unlocks: unlockIds(), refs: ['journey'], speakers: speakers() }),
    chapters: () => CHAPTERS.map((c, i) => ({ name: c.name, i })),
    async openChapter(i) { await go(K.chFirst(i)); if (K.cur() !== K.chPlace(i)) throw new Error('opened in ' + K.cur() + ', not ' + K.chPlace(i)); },
    step: () => K.stage(),
    people: () => visible().filter((n) => !n.extra).map((n) => ({ id: n.id, name: n.who, body: n.base, hat: n.hat === undefined ? undefined : JSON.stringify(n.hat), colours: n.tint ? JSON.stringify(n.tint) : undefined })),
    light: () => K.light(),
    /* every step that asks you to do something (the rides and scripted scenes are played by the autoplayer) */
    steps: () => Object.keys(STEPS).map(Number).filter((s) => STEPS[s].needs).sort((a, b) => a - b),
    async goStep(s) { await go(s); if (K.stage() !== s) throw new Error('stopped at step ' + K.stage()); if (K.cur() !== placeOfStage(s)) throw new Error('in ' + K.cur() + ', not ' + placeOfStage(s)); },
    place() { const Q = P(); if (!Q) return null; return { id: Q.id, start: [Q.start.x, Q.start.z], bounds: Q.bounds, walls: Q.walls, r: 0.25, blocked: (x, z, r) => (Q.keepOut || []).some((k) => Math.hypot(k[0] - x, k[1] - z) < k[2] + r * 0.3) }; },
    targets() { const sp = STEPS[K.stage()]; return needList(sp).filter((n) => K.story().needs(n.id)).map((n) => { const p = (sp.at && sp.at[n.id]) || K.where(n.id); return p && !Array.isArray(p[0]) ? { id: n.id, x: p[0], z: p[1], r: n.kind === 'talk' ? 2.3 : 1.2 } : null; }).filter(Boolean); },
    held: () => K.held(),
    /* before saving: where a reload should put you (a step inside a scripted scene goes back to its start, SAFE in main.js); after the reload: where you really are */
    snapshot: () => { const s = K.stage(); if (K.restored()) return { stage: s, place: K.cur(), journal: K.unlocks().slice() }; return { stage: K.safe(s), place: placeOfStage(K.safe(s)), journal: K.unlocks().slice() }; },
    save: () => { K.save(); return K.load(); },
    async restore(d) { K.resume(d); await settle(); },
    places: () => K.places(),
    async goPlace(id, light) { await go(K.stageOfPlace(id)); },
    move: (a, b, Q) => K.move(a, b),
    renderer: () => K.renderer, scene: () => K.scene,
    faces: () => { for (const b of FACES.splice(0)) K.scene.remove(b); for (const n of visible()) if (!n.extra) n.m.visible = false; return P().people.filter((n) => !n.hidden).map((n) => { const b = K.faceBody(n); FACES.push(b); return { id: n.id, body: b }; }); },   /* each story person's face in this place's light, standing where they stand (their own body is hidden while the probe looks) */
    async frame(dt) { K.frame(dt); },
    async autoplay({ sample }) { return K.autoplay(sample); },
    camera: () => { const c = K.camera.position; return { x: c.x, y: c.y, z: c.z }; },
    async talks() { const sp = STEPS[K.stage()]; return ((sp && sp.needs && sp.needs.talk) || []).filter((id) => visible().some((n) => n.id === id)); },
    async talkTo(id) { const n = visible().find((p) => p.id === id); if (!n) return; K.talkTo(n); await sleep(300); K.leaveTalk(); },
    clips: () => visible().map((n) => { const c = n.ctl && n.ctl.cur, d = c ? c.getClip().duration || 1 : 1; return { id: n.id || n.base, clip: c ? c.getClip().name : n.anim, t: c ? (c.time % d) / d : 0, dist: Math.hypot(n.x - K.player().x, n.z - K.player().z) }; }),
    line: () => K.line(),
    talking: () => K.talking(),
    audio: () => K.audio(),
    setSound: (on) => K.setSound(on),
    keyMove: () => K.keyMove(),
    screens: () => ({
      play: async () => { K.closeAll(); await go(10); },
      dialogue: async () => { K.closeAll(); const n = visible().find((p) => !p.extra); if (n) K.talkTo(n); },
      journal: async () => { K.closeAll(); K.openJournal(); },
      chapters: async () => { K.closeAll(); K.openChapters(); },
      credits: async () => { K.closeAll(); K.openCredits(); },
      card: async () => { K.closeAll(); K.card(); },
    }),
  };
}
