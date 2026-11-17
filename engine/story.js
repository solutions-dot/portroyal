/* engine/story.js: who moves the story, the hint arrow, and the things the player carries. One system for every game.

   The owner's three rules (docs/STANDARD.md, "Story flow"):
     1. Only the people who push the story forward are the point of focus. In each step only that step's story people get the gold talk mark
        and the arrow. Anyone else can be talked to for a short flavour line, but never moves the story on and never sends you to someone else.
        A person needed later is flavour until their step. Where order does not matter, any order works and the goal shows a count ("2 of 3").
     2. The hint arrow shows 2.5 s after a new goal, including explore steps, even while the child walks. It points only at the step's
        unfinished needs (never at optional actions), nearest first, and moves to the next need at once when one is done.
     3. Every required task shows on screen: carry() draws the thing in the player's hand, place() leaves it where it goes, a "do" need has a
        visible change registered, and counts show in the goal.

   A step table is plain data, one entry per stage:
     { goal: 'Talk to Gran and Mr. Clive.',       one short sentence (or a function of { n, of, got, stage }); the count is added for you
       needs: { talk: ['gran6', 'clive'],         people whose first talk moves the step on
                do: [{ id: 'water', n: 2 }],      things to do; a plain id means once. { carry: 'bucket' } says the task is carrying that item
                go: ['lamp'] },                   places to walk to (arriving is the visible change)
       story: ['gran6', 'clive'],                 who moves this step (default: needs.talk). Everyone else is flavour in this step.
       any: true,                                 any order (the default). false: the needs are done in the listed order, one at a time.
       explore: false,                            true: a look-around step (same 2.5 s guidance delay)
       optional: ['tree'],                        things that can be done but are never needed and never get the arrow
       at: { lamp: [12, -4] },                    where a need is, when the game's where() does not know it (a point, or a function)
       shows: { water: (n, of) => ... },          the visible change for each "do" need (or register it with story.shows(id, fn))
       flavour: { clive: ['...'] },               flavour lines for this step only (otherwise options.flavour)
       after: { gran6: ['...'] },                 what a story person says once their part of this step is done
       next: 61,                                  the step that follows (a stage id, or a function of the story)
       end: true,                                 the last step of the story (no next)
       wait: true }                               a timed scene or a card with nothing to point at (no needs, no arrow). The game moves it on itself.

   createStory(options) gives a story. A game can switch one step table (or one stage) at a time: the story only owns stages that are in its
   table. For the others it goes idle and every question returns null, so the game's own code keeps working:
     sync(stage)            call from the game's own setStage. Enters that step if the table has it, else goes idle.
     owns()                 true while the current stage is one of the table's.
     enter(id)              start a step (resets its progress, sends onStep and onGoal). Used by sync and by the story itself.
     done(id, k = 1)        the player did a need: talked to that person (after their whole first talk), did a task, reached a place.
                            Counts only for a current, unfinished need; returns true if it counted. The last need moves on to `next`
                            through options.advance(next) (the game's setStage), or enter(next) when there is no advance.
     talk(id)               what talking to this person should do now: { kind: 'story' } play their step talk, then done(id);
                            { kind: 'meet' } their one-off full flavour talk (options.meet), played once; { kind: 'flavour', line }
                            or { kind: 'after', line } one short line that changes nothing. null when the story is idle.
     marked(id)             true for the people who get the gold mark now (unfinished talk needs; in an ordered step only the next one).
     isStory(id), needs(id) is this person a story person in this step; is this id an unfinished need now.
     goal(), count()        the goal text with its count, and { n, of }.
     tick(now, quiet)       call once a frame. quiet: no talk, card, cut scene or fade (time only counts while quiet). Returns the arrow:
                            { show, id, x, z, final, target: [x, z] } (x, z is the next point on the way, from options.route).
     pick()                 the need the arrow would point at now, nearest first: { id, kind, x, z } or null.
     save(), restore(s)     { stage, got, met } for the game's save; restore puts the visible changes back with shows(n, of, true).
   options: { steps, where(id, kind) -> [x, z] | null (null: not in this place or hidden), player() -> [x, z] or { x, z },
              route(target, player, stage) -> [x, z] or [x, z, final] (Port Royal's nudgeStep, Eventide's gate and steps),
              advance(next), onStep(id, step), onGoal(text), onArrow(id) (once a step, when the arrow first shows: pop the goal open),
              flavour: { id: [lines] or () => [lines] } (a game's LATER, wrapped), meet: { id: [lines] }, names: { id: 'Mass Dudley' } (for the redirect check), items: { bucket: obj },
              delay: 2500, exploreDelay: 2500, near: 2.2 (the arrow hides within this many metres of its target) }

   createCarry(options) is the player's hand (rule 3):
     carry(item, o)         shows the item in the hand: on the camera slot in first person, in the grip of the player's body in third person
                            (engine/grip.js). It leaves the spot it came from (so a pile goes down by one).
     place(item, spot)      puts it where it goes and keeps it there: spot is an Object3D, or { parent, at: [x, y, z], ry, scale }.
     drop(), holding(), view(mode)   let go (hides it), the item in the hand, switch first / third person (the item moves with you).
     issues()               dev: lines for a held item that is hidden, not in the hand, or shrunk to nothing.

   checkFlow(story, opts) is the engine side of ?test=flow. See its comment. */
import { grip as engineGrip } from './grip.js';

const DEF = { delay: 2500, exploreDelay: 2500, near: 2.2 };
export const ARROW_LIMIT = 2500, ARROW_LIMIT_EXPLORE = 2500;
/* words that send a child somewhere else. A flavour line must not use them (rule 1). */
export const REDIRECT_WORDS = ['first', 'come back', 'go and', 'go to', 'talk to', 'then', 'go back'];
export const REDIRECT = new RegExp(REDIRECT_WORDS.map((w) => '\\b' + w + '\\b').join('|'), 'i');

const xz = (p) => (!p ? null : Array.isArray(p) ? p : [p.x, p.z]);
const lineText = (l) => (typeof l === 'string' ? l : l && l.text) || '';
const lineWho = (l) => (typeof l === 'string' ? null : l && l.who) || null;

/* the needs of one step as a flat list: [{ id, kind, n, carry }] */
export function needList(step) {
  const out = [], N = (step && step.needs) || {};
  for (const kind of ['talk', 'do', 'go']) for (const e of N[kind] || []) {
    const o = typeof e === 'string' ? { id: e } : e; out.push({ id: o.id, kind, n: kind === 'do' ? Math.max(1, o.n || 1) : 1, carry: o.carry || null });
  }
  return out;
}
/* the goal text with the count put in: '{n}' and '{of}' in the text are filled in, or ': n of m.' is added when the step has more than one thing to do */
export function goalWithCount(goal, n, of, ctx) {
  let t = typeof goal === 'function' ? goal(ctx) : goal || '';
  if (/\{n\}|\{of\}/.test(t)) return t.replace(/\{n\}/g, n).replace(/\{of\}/g, of);
  if (of > 1 && !/\b\d+ of \d+\b/.test(t)) t = t.replace(/[.!\s]+$/, '') + ': ' + n + ' of ' + of + '.';
  return t;
}

export function createStory(options) {
  const o = { ...DEF, ...options }, steps = o.steps || {}, visual = {}, heard = {}, met = new Set();
  const S = { options: o, stage: null, step: null, got: {}, active: false };
  let waited = 0, last = null, arrowed = false;
  const player = () => xz(o.player ? o.player() : [0, 0]) || [0, 0];
  const list = () => needList(S.step);
  const left = (e) => e.n - (S.got[e.id] || 0);
  const open = () => { const L = list().filter((e) => left(e) > 0); return S.step && S.step.any === false ? L.slice(0, 1) : L; };
  function count() { let n = 0, of = 0; for (const e of list()) { of += e.n; n += Math.min(e.n, S.got[e.id] || 0); } return { n, of }; }
  function goal() { if (!S.active) return null; const c = count(); return goalWithCount(S.step.goal, c.n, c.of, { ...c, got: S.got, stage: S.stage }); }
  const storyIds = () => (S.step.story || (S.step.needs && S.step.needs.talk || []).map((e) => (typeof e === 'string' ? e : e.id)));
  S.owns = () => S.active;
  S.has = (id) => Object.prototype.hasOwnProperty.call(steps, id);
  S.goal = goal; S.count = () => (S.active ? count() : null);
  S.shows = (id, fn) => { visual[id] = fn; return S; };
  S.hasShow = (id, step) => !!((step && step.shows && step.shows[id]) || visual[id]);
  S.enter = (id) => {
    if (!S.has(id)) { S.active = false; S.stage = id; S.step = null; return S; }
    S.stage = id; S.step = steps[id]; S.got = {}; S.active = true; waited = 0; last = null; arrowed = false;
    if (!o.dry) { if (o.onStep) o.onStep(id, S.step); if (o.onGoal) o.onGoal(goal()); }
    return S;
  };
  S.sync = (id) => (S.stage === id && S.active ? S : S.enter(id));
  S.needs = (id) => S.active && open().some((e) => e.id === id);
  S.isStory = (id) => S.active && storyIds().includes(id);
  S.marked = (id) => (S.active ? open().some((e) => e.kind === 'talk' && e.id === id) : null);
  function show(id, restore) { const fn = (S.step.shows && S.step.shows[id]) || visual[id]; if (fn && !o.dry) { const e = list().find((x) => x.id === id); fn(Math.min(e.n, S.got[id] || 0), e.n, !!restore); } }
  function finish() {
    const nx = typeof S.step.next === 'function' ? S.step.next(S) : S.step.next; if (S.step.end || nx === undefined || nx === null) return;
    if (o.advance) o.advance(nx); else S.enter(nx);
  }
  S.done = (id, k = 1) => {
    if (!S.active) return false; const e = open().find((x) => x.id === id); if (!e) return false;
    S.got[id] = Math.min(e.n, (S.got[id] || 0) + k); show(id, false);
    if (!o.dry && o.onGoal) o.onGoal(goal());
    if (!list().some((x) => left(x) > 0) && !o.dry) finish();
    return true;
  };
  S.talked = S.done;
  S.talk = (id) => {
    if (!S.active) return null;
    if (open().some((e) => e.kind === 'talk' && e.id === id)) return { kind: 'story' };
    const pickLine = (L, key) => { if (typeof L === 'function') L = L(S); if (!L || !L.length) return null; heard[key] = (heard[key] || 0) + 1; return L[(heard[key] - 1) % L.length]; };
    if (S.isStory(id)) { const a = (S.step.after && S.step.after[id]) || (S.step.flavour && S.step.flavour[id]) || (o.flavour && o.flavour[id]); return { kind: 'after', line: pickLine(a, 'a:' + S.stage + ':' + id) }; }
    if (o.meet && o.meet[id] && !met.has(id)) { met.add(id); return { kind: 'meet' }; }
    const L = (S.step.flavour && S.step.flavour[id]) || (o.flavour && o.flavour[id]); return { kind: 'flavour', line: pickLine(L, 'f:' + id) };
  };
  /* the need the arrow points at: the nearest unfinished one that is in this place */
  S.pick = () => {
    if (!S.active || S.step.wait) return null; const [px, pz] = player(); let best = null, bd = Infinity;
    for (const e of open()) {
      const at = S.step.at && S.step.at[e.id]; const p = xz(at ? (typeof at === 'function' ? at(S) : at) : o.where ? o.where(e.id, e.kind) : null); if (!p) continue;
      const d = Math.hypot(p[0] - px, p[1] - pz); if (d < bd) { bd = d; best = { id: e.id, kind: e.kind, x: p[0], z: p[1], d }; }
    }
    return best;
  };
  S.delay = () => (S.active && S.step.explore ? o.exploreDelay : o.delay);
  S.ready = () => S.active && waited >= S.delay();
  const HIDE = Object.freeze({ show: false });
  S.tick = (now, quiet = true) => {
    if (!S.active) return HIDE;
    if (last === null) last = now; const dt = Math.max(0, Math.min(500, now - last)); last = now;   /* a long frame (a hidden tab) adds at most half a second */
    if (quiet) waited += dt;
    if (!quiet || waited < S.delay()) return HIDE;
    const t = S.pick(); if (!t) return HIDE;
    if (t.d < o.near) return { show: false, near: true, id: t.id };   /* there: the talk or action button takes over */
    let w = o.route ? o.route([t.x, t.z], player(), S.stage) : null; w = w ? xz(w) : [t.x, t.z];
    const final = w.length > 2 ? !!w[2] : w[0] === t.x && w[1] === t.z;
    if (!arrowed) { arrowed = true; if (o.onArrow && !o.dry) o.onArrow(t.id); }
    return { show: true, id: t.id, kind: t.kind, x: w[0], z: w[1], final, target: [t.x, t.z] };
  };
  S.save = () => ({ stage: S.stage, got: { ...S.got }, met: [...met] });
  S.restore = (s) => {
    if (s && Array.isArray(s.met)) for (const id of s.met) met.add(id);
    if (!s || !S.has(s.stage)) return S; const q = o.dry; o.dry = true; S.enter(s.stage); o.dry = q;
    for (const e of list()) if (s.got && s.got[e.id]) S.got[e.id] = Math.min(e.n, s.got[e.id] | 0);
    for (const e of list()) if (S.got[e.id]) show(e.id, true);
    if (!o.dry) { if (o.onStep) o.onStep(S.stage, S.step); if (o.onGoal) o.onGoal(goal()); }
    return S;
  };
  return S;
}

/* where the arrow goes on screen. dx, dz: from the player to the arrow's point; yaw: the camera's turn; ndc: that point projected (three's
   Vector3.project, so x and y are -1 to 1 and z > 1 is behind). Returns { cls: 'down' | 'left' | 'right', x, y, label } for the #nudge element. */
export function arrowPose({ dx, dz, yaw, ndc, W, H, final = true }) {
  const rel = Math.atan2(-dx, -dz) - yaw, a = Math.atan2(Math.sin(rel), Math.cos(rel));
  if (Math.abs(a) < 0.55 && ndc && ndc[2] < 1) { const sy = (1 - ndc[1]) / 2 * H; return { cls: 'down', x: Math.max(60, Math.min(W - 60, (ndc[0] + 1) / 2 * W)), y: Math.max(110, Math.min(H * 0.62, sy)), label: sy > H * 0.75 ? 'Look down' : sy < 90 ? 'Look up' : final ? 'Here!' : 'This way' }; }
  const leftSide = a > 0; return { cls: leftSide ? 'left' : 'right', x: leftSide ? 58 : W - 58, y: H * 0.45, label: Math.abs(a) > 2.2 ? 'Turn around' : 'This way' };
}

/* ---------- the player's hand ---------- */
export function createCarry({ camera = null, body = null, side = 'Right', slot = [0.32, -0.4, -0.6], grip = engineGrip, gripOpts = {}, view = 'first' } = {}) {
  const C = { held: null, mode: view, placed: [] };
  function release() {
    const it = C.held; if (!it) return; const w = it.parent;
    if (w && w.userData && w.userData.carryWrap) { const hand = w.parent; if (hand) hand.remove(w); if (body && body.userData.grips) body.userData.grips = body.userData.grips.filter((g) => g.wrap !== w); w.remove(it); }
    else if (it.parent) it.parent.remove(it);
  }
  function attach(it, o = {}) {
    if (C.mode === 'first' || !body) { if (!camera) throw new Error('carry: no camera for first person'); const s = o.slot || slot; it.position.set(s[0], s[1], s[2]); it.rotation.set(0, o.yaw || 0, 0); camera.add(it); }
    else { const w = grip(body, side, it, { ...gripOpts, ...(o.grip || {}) }); if (!w) throw new Error('carry: the body has no ' + side + ' hand'); w.userData.carryWrap = true; }
    it.visible = true;
  }
  C.carry = (it, o = {}) => { if (C.held) release(); if (it.parent) it.parent.remove(it); C.held = it; C.opts = o; attach(it, o); return it; };
  C.holding = () => C.held;
  C.place = (it, spot) => {
    it = it || C.held; if (!it) return null; if (it === C.held) { release(); C.held = null; } else if (it.parent) it.parent.remove(it);
    const parent = spot && spot.isObject3D ? spot : spot.parent; parent.add(it);
    if (spot && !spot.isObject3D) { const a = spot.at || [0, 0, 0]; it.position.set(a[0], a[1], a[2]); it.rotation.set(0, spot.ry || 0, 0); if (spot.scale) it.scale.setScalar(spot.scale); }
    else it.position.set(0, 0, 0);
    it.visible = true; C.placed.push(it); return it;
  };
  C.drop = () => { const it = C.held; if (!it) return null; release(); C.held = null; it.visible = false; return it; };
  C.view = (mode) => { if (mode === C.mode) return C; const it = C.held; if (it) release(); C.mode = mode; if (it) attach(it, C.opts); return C; };
  C.issues = () => {
    const out = [], it = C.held; if (!it) return out; let up = it, inHand = false, seen = true;
    while (up) { if (up.visible === false) seen = false; if (up === camera || (up.userData && up.userData.carryWrap)) inHand = true; up = up.parent; }
    if (!seen) out.push('carry: ' + (it.name || 'the held item') + ' is hidden');
    if (!inHand) out.push('carry: ' + (it.name || 'the held item') + ' is not in the player\'s hand');
    const s = it.scale; if (s && Math.min(Math.abs(s.x), Math.abs(s.y), Math.abs(s.z)) < 0.01) out.push('carry: ' + (it.name || 'the held item') + ' is shrunk to nothing');
    return out;
  };
  return C;
}

/* ---------- ?test=flow: the engine side ----------
   checkFlow(story, opts) walks every step of the table in a dry copy (no scene changes, no callbacks) and returns
   { issues: [lines], text } where text ends with 'FLOW <issues>'. It fails:
     - a step with more than one thing to do whose goal shows no count
     - a step whose arrow has no target, or points at something that is not an unfinished need (an optional action, a done one)
     - a step whose arrow does not move to another unfinished need at once when one is done
     - a "do" need with no visible change registered (step.shows or story.shows), or a carry need whose item is not in options.items
     - an arrow that would take more than 3 s (5 s for explore) after a new goal, while the child keeps walking
     - a story person or need that is not in the place (where() gives nothing)
     - a flavour or meet line that sends you somewhere ('first', 'come back', 'go and', 'go to', 'talk to', 'then', 'go back'),
       names another person (options.names), or has an em dash
     - a step with needs but no next (and not end), or a step with no needs that is not marked wait or end
   opts: { place(stage) (bring the step's place in, so where() knows it), start(stage) -> [x, z] (where the player stands at the start of the
           step; default options.player()), only: [stages] }. */
export function checkFlow(story, opts = {}) {
  const o = story.options, steps = o.steps || {}, issues = [], ids = Object.keys(steps).filter((k) => !opts.only || opts.only.map(String).includes(k));
  const bad = (st, m) => issues.push('flow ' + st + ': ' + m);
  const lint = (who, where, l) => {
    const t = lineText(l); if (!t) return; const by = lineWho(l); if (by === 'You') return;
    const w = REDIRECT.test(t) && REDIRECT_WORDS.find((x) => new RegExp('\\b' + x + '\\b', 'i').test(t)); if (w) bad(where, who + ' says "' + t + '": a flavour line must not send you on ("' + w + '")');
    if (/\u2014/.test(t)) bad(where, who + ' says "' + t + '": no em dashes');
    for (const [id, name] of Object.entries(o.names || {})) if (id !== who && name && new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(t)) bad(where, who + ' says "' + t + '": a flavour line names ' + name);
  };
  const lines = (L) => { try { L = typeof L === 'function' ? L(story) : L; } catch (e) { L = []; } return Array.isArray(L) ? L : []; };
  for (const [id, L] of Object.entries(o.flavour || {})) for (const l of lines(L)) lint(id, 'flavour', l);
  for (const [id, L] of Object.entries(o.meet || {})) for (const l of lines(L)) lint(id, 'meet', l);
  for (const st of ids) {
    const step = steps[st], L = needList(step);
    for (const [id, Ls] of Object.entries(step.flavour || {})) for (const l of lines(Ls)) lint(id, st, l);
    if (opts.place) opts.place(isNaN(+st) ? st : +st);
    let pos = xz(opts.start ? opts.start(isNaN(+st) ? st : +st) : o.player ? o.player() : [0, 0]) || [0, 0];
    const sim = createStory({ ...o, dry: true, player: () => pos, advance: () => {}, onStep: null, onGoal: null, onArrow: null });
    sim.enter(isNaN(+st) ? st : +st);
    const of = L.reduce((s, e) => s + e.n, 0), g = sim.goal() || '';
    if (of > 1 && !/\b\d+ of \d+\b/.test(g)) bad(st, 'goal "' + g + '" has ' + of + ' things to do but no count');
    if (L.length && !step.end && (step.next === undefined || step.next === null)) bad(st, 'has needs but no next step');
    if (!L.length && !step.wait && !step.end) bad(st, 'has nothing to do: give it needs, or wait: true for a timed scene or a card');
    for (const e of L) {
      if (e.kind === 'do' && !(step.shows && step.shows[e.id]) && !story.hasShow(e.id)) bad(st, 'do "' + e.id + '" has no visible change (shows)');
      if (e.carry && !(o.items && o.items[e.carry])) bad(st, 'do "' + e.id + '" carries "' + e.carry + '" but no such item is drawn (options.items)');
    }
    for (const id of step.story || []) if (o.where && !o.where(id, 'talk') && !(step.at && step.at[id])) bad(st, 'story person "' + id + '" is not in the place');
    if (step.wait || !L.length) continue;
    /* the arrow: walk in small circles (moving must not hold it back) and see when it is ready */
    const limit = step.explore ? ARROW_LIMIT_EXPLORE : ARROW_LIMIT, c0 = pos.slice(); let t = 0;
    sim.tick(0, true);
    while (!sim.ready() && t <= 10000) { t += 100; pos = [c0[0] + Math.cos(t / 600) * 0.8, c0[1] + Math.sin(t / 600) * 0.8]; sim.tick(t, true); }
    if (!sim.ready()) { bad(st, 'the arrow never shows'); continue; }
    if (t > limit) bad(st, 'the arrow shows after ' + (t / 1000).toFixed(1) + ' s (at most ' + limit / 1000 + ' s)');
    const optional = new Set(step.optional || []);
    for (let guard = 0; guard < 50; guard++) {
      const p = sim.pick(), rest = L.filter((e) => (sim.got[e.id] || 0) < e.n);
      if (!rest.length) break;
      if (!p) { bad(st, 'the arrow has no target (' + rest.map((e) => e.id).join(', ') + ' not in the place)' + (guard ? ' after a need was done' : '')); break; }
      if (optional.has(p.id) || !rest.some((e) => e.id === p.id)) { bad(st, 'the arrow points at "' + p.id + '", which is not needed now'); break; }
      sim.done(p.id, 1);
    }
  }
  return { issues, text: issues.join('\n') + (issues.length ? '\n' : '') + 'FLOW ' + issues.length };
}

/* the ?test=flow view for a game's dev build: run checkFlow and write the lines into #autolog, the way the other checks do
   (docs/TESTING.md, section 5). Wire it only inside an `if (__DEV__)` block, so the public build leaves it out:
     if (__DEV__ && q.get('test') === 'flow') flowTest(STORY, { place: (s) => enterPlaceFor(s), start: (s) => START[s] }); */
export function flowTest(story, opts = {}) {
  const r = checkFlow(story, opts), doc = typeof document !== 'undefined' ? document : null;
  if (doc) { let el = doc.getElementById('autolog'); if (!el) { el = doc.createElement('pre'); el.id = 'autolog'; doc.body.appendChild(el); } el.textContent = r.text; el.hidden = false; }
  if (typeof console !== 'undefined') console.log(r.text);
  return r;
}

/* A way out is not offered the moment you come in. You arrive standing on the spot where the way out is (a door, the head of a stair), so its button ("Go back to the
   street") came up at once and read as the next thing to do (owner, 17 November 2026). An exit is ready once you have walked off its spot, or after `wait` seconds for
   someone who came in by mistake. Shared by every game: mark the action `exit: true`, ask exitReady(id, distance, radius, nowSeconds) where the game picks the action
   to offer, and call exitsReset() whenever the place changes. */
const EXITS = new Map();
export function exitReady(id, d, r, now, { wait = 7 } = {}) { let e = EXITS.get(id); if (!e) EXITS.set(id, e = { t: now, off: false }); if (d > r + 0.5) e.off = true; return e.off || now - e.t > wait; }
export function exitsReset() { EXITS.clear(); }
