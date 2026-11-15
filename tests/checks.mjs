/* engine/checks.js, the accessibility helpers in engine/ui-audit.js and the pieces of tools/lint_content.mjs: each rule is shown catching a fault
   and passing a good case. Run with npm test (tests/regressions.mjs imports this file). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { continuityIssues, itemIssues, lightIssues, lightKind, ageIssues, gridReach, reachIssues, boundsIssues, stuckIssues, cameraIssues, resumeDiff,
  journalIssues, nameKey, levelIssues, soundRefIssues, budgetIssues, bannedKind, clipIssues, intenseIssues, faceIssues, checkAll, watchErrors, ORDER, CHECKS } from '../engine/checks.js';
import { parseColor, contrastRatio, contrastNeed, blend } from '../engine/ui-audit.js';
import { words, sentenceCount, emDashes, nameIssues, factsIn, factFound, matchBracket, evalLiteral, stripComments } from '../tools/lint_content.mjs';

/* a small yard: bounds 0..10 by 0..10, a wall across the middle with a gap at the east end, a closed room in the north-west corner */
const B = { x0: 0, z0: 0, x1: 10, z1: 10 }, WALLS = [[0, 4.9, 8, 5.1], [0, 7, 3, 7.2], [2.9, 7, 3.1, 10]];
const clamp = (from, to, walls = WALLS, b = B) => { /* a game's clamp: slide, then keep in bounds */
  const steps = Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / 0.05) || 1; let p = from.slice();
  for (let i = 1; i <= steps; i++) for (const k of [0, 1]) { const q = p.slice(); q[k] += (to[k] - from[k]) / steps; if (!walls.some((w) => q[0] > w[0] - 0.25 && q[0] < w[2] + 0.25 && q[1] > w[1] - 0.25 && q[1] < w[3] + 0.25)) p = q; }
  return [Math.max(b.x0, Math.min(b.x1, p[0])), Math.max(b.z0, Math.min(b.z1, p[1]))];
};

test('continuity: a changed hat or body is caught unless the step declares it; one character keeps one spelling across its ids', () => {
  const s = [{ chapter: 1, id: 'mama', name: 'Mama', body: 'woman1', hat: 'tie' }, { chapter: 3, id: 'mama3', name: 'Mama', body: 'woman1', hat: 'tie' },
    { chapter: 4, id: 'mama4', name: 'Mama', body: 'woman1', hat: 'none' }, { chapter: 5, id: 'mama5', name: 'Mamma', body: 'woman2', hat: 'none' }];
  const cast = { mama: ['mama', 'mama3', 'mama4', 'mama5'] };
  const bad = continuityIssues(s, { cast });
  assert.equal(bad.length, 3); assert.match(bad[0], /hat/); assert.match(bad[1], /body/); assert.match(bad[2], /name/);
  assert.deepEqual(continuityIssues(s, { cast, changes: [{ id: 'mama', chapter: 4, field: 'hat' }, { id: 'mama', chapter: 5 }] }), []);
  assert.equal(continuityIssues(s).length, 0, 'different ids with no cast table are different people');
});

test('given items stay held until a declared drop; light matches tagged lines; ages add up across eras', () => {
  const tl = [{ step: 10, held: [], given: ['lamp'] }, { step: 11, held: ['lamp'] }, { step: 12, held: [] }];
  assert.equal(itemIssues(tl).length, 1); assert.deepEqual(itemIssues(tl, { drops: [{ item: 'lamp', step: 12 }] }), []);
  assert.equal(lightKind({ sun: -20 }), 'night'); assert.equal(lightKind({ sun: 40 }), 'day'); assert.equal(lightKind({ tod: 'Dawn' }), 'dawn');
  assert.deepEqual(lightIssues([{ text: 'The stars are out.', tag: 'night', light: { sun: -15 } }]), []);
  assert.equal(lightIssues([{ text: 'The stars are out.', tag: 'night', light: { sun: 30 } }]).length, 1);
  assert.deepEqual(ageIssues({ pearl: { born: 1976, seen: [[1988, 12], [2025, 49]] } }), []);
  assert.equal(ageIssues({ pearl: [[1988, 12], [2025, 40]] }).length, 1);
  assert.equal(ageIssues({ hattie: { born: 1941, seen: [[1951, 12]] } }).length, 1);
});

test('reach: a target behind a wall is reached round the gap; one inside a closed room is not', () => {
  const g = gridReach({ start: [1, 1], walls: WALLS, bounds: B });
  assert.ok(g.reach(1, 6)); assert.ok(!g.reach(1, 9, 0.6));
  const lines = reachIssues({ start: [1, 1], walls: WALLS, bounds: B, targets: [{ id: 'gran', x: 1, z: 6 }, { id: 'box', x: 1, z: 9, r: 0.6 }] });
  assert.equal(lines.length, 1); assert.match(lines[0], /box/);
  const solid = (x, z, r) => Math.hypot(x - 9, z - 5) < 1 + r;   /* a tree in the gap closes the way round */
  assert.equal(reachIssues({ start: [1, 1], walls: WALLS, bounds: B, blocked: solid, targets: [{ id: 'gran', x: 1, z: 6 }] }).length, 1);
});

test('the map: a clamp that keeps you in passes, one with a hole is caught; a pocket you cannot walk out of is stuck', () => {
  assert.deepEqual(boundsIssues({ move: (a, b) => clamp(a, b), bounds: B, start: [1, 1] }), []);
  const leaky = (a, b) => (b[0] > 10 && a[1] > 8 ? b : clamp(a, b));
  assert.ok(boundsIssues({ move: leaky, bounds: B, start: [1, 1] }).length > 0);
  assert.equal(stuckIssues({ move: (a, b) => clamp(a, b), start: [1, 1], walls: WALLS, bounds: B }).lines.length, 0);
  const sticky = (a, b) => (Math.hypot(a[0] - 5.5, a[1] - 2.5) < 0.3 ? a : clamp(a, b));
  const r = stuckIssues({ move: sticky, start: [1, 1], walls: WALLS, bounds: B }); assert.ok(r.probes > 20); assert.equal(r.lines.length, 1); assert.match(r.lines[0], /5\.5,2\.5/);
});

test('camera: below the ground, inside a wall or inside a solid is caught, once per spot', () => {
  const s = [{ x: 1, y: 1.6, z: 1 }, { x: 1, y: -0.2, z: 1 }, { x: 4, y: 1.6, z: 5 }, { x: 4, y: 1.6, z: 5 }, { x: 4, y: 3.5, z: 5 }, { x: 8, y: 1, z: 8, what: 'talk gran' }];
  const out = cameraIssues(s, { walls: WALLS, solid: (x, y, z) => x === 8 && z === 8 && y < 2 });
  assert.equal(out.length, 3); assert.match(out[0], /below/); assert.match(out[1], /wall/); assert.match(out[2], /solid.*talk gran/);
});

test('resume: the goal, the people and what you hold come back', () => {
  const a = { stage: 22, goal: 'Help Auntie Mimba plant yams: 1 of 3.', people: ['mimba', 'quamin'], held: ['hoe'], pos: [3, 4] };
  assert.deepEqual(resumeDiff(a, { ...a, people: ['quamin', 'mimba'] }), []);
  const bad = resumeDiff(a, { ...a, goal: 'Climb the narrow path to the town.', people: ['quamin'], held: [], pos: [30, 4] });
  assert.equal(bad.length, 4);
});

test('journal: unlocks need pages, pages need unlocks, fictional speakers need their note', () => {
  const pages = [{ id: 'you', title: 'You', simple: ['You are fictional.'], deeper: ['Mass Dudley and Miss Cleo in this game are fictional.'] }, { id: 'rail', title: 'The railway', simple: ['Trains came in 1845.'] }, { id: 'old', title: 'Old page', simple: [] }];
  const out = journalIssues({ pages, unlocks: ['you', 'rail', 'kendal'], speakers: ['Mass Dudley', 'Miss Cleo', 'Mr. Gordon', 'You', 'The conductor', 'Marcus Garvey'], real: ['Marcus Garvey'] });
  assert.deepEqual(out.map((l) => l.split(' ')[0]), ['unlock', 'journal', 'Mr.']);
  assert.equal(nameKey('Mass Dudley'), 'Dudley'); assert.equal(nameKey('Gran'), 'Gran'); assert.equal(nameKey('Auntie Mimba'), 'Mimba');
  assert.deepEqual(journalIssues({ pages: [{ id: 'you', title: 'You', simple: ['Everyone you meet is fictional.'] }], unlocks: ['you'], speakers: ['Mr. Gordon'] }), []);
  assert.deepEqual(journalIssues({ pages: [{ id: 'a', title: 'A', deeper: ['Mr. Raymond, Miss Bev and Gran are fictional.'] }], unlocks: ['a'], speakers: ['Mr. Raymond', 'Gran'] }), []);
});

test('sound: beds ducked under the talk, sound names the engine makes; budgets; faces', () => {
  assert.deepEqual(levelIssues({ sea: 0.2, wind: 0.1 }, { talking: true }), []);
  assert.equal(levelIssues({ sea: 0.6 }, { talking: true }).length, 1); assert.deepEqual(levelIssues({ sea: 0.6 }, { talking: false }), []);
  assert.equal(soundRefIssues({ stepSound: ['sand', 'mud'], uiSound: ['page'] }).length, 1);
  assert.equal(budgetIssues({ frameMs: 70, calls: 100, triangles: 9e5 }, { triangles: 1e6 }).length, 1);
  assert.equal(faceIssues([{ id: 'gran', where: 'night', rgb: [120, 90, 70], lo: [40, 25, 20], hi: [150, 110, 90] }]).length, 1);
  assert.deepEqual(faceIssues([{ id: 'gran', where: 'day', rgb: [170, 120, 95], lo: [120, 85, 66], hi: [200, 150, 120] }]), []);
});

test('rule 4: falls, doubled over and boxing never in view; fights only in the background; Sword2 past its fall; intense scenes need their card', () => {
  assert.equal(bannedKind('BoxIdle'), 'boxing'); assert.equal(bannedKind('Sword2', 0.3), 'fight'); assert.match(bannedKind('Sword2', 0.8), /fall/); assert.equal(bannedKind('Walk'), null);
  const s = [{ id: 'buc1', clip: 'Sword2', t: 0.3, dist: 20 }, { id: 'buc2', clip: 'Sword2', t: 0.9, dist: 20 }, { id: 'man', clip: 'Punch', dist: 4 }, { id: 'boy', clip: 'Defeated', dist: 30, inView: false },
    { id: 'sold', clip: 'Block', dist: 5, stage: 51 }, { id: 'old', clip: 'Idle', hips: 0.4 }, { id: 'nan', clip: 'SitIdle', hips: 0.5 }];
  const out = clipIssues(s, { allow: { 51: ['Block'] } });
  assert.equal(out.length, 3); assert.match(out[0], /buc2.*fall/); assert.match(out[1], /man.*foreground/); assert.match(out[2], /old.*fallen/);
  assert.equal(intenseIssues([{ stage: 50, card: true }, { stage: 51, card: false }], { 50: 'may24', 51: 'may24' }).length, 1);
});

test('colour contrast follows WCAG: black on white is 21, AA needs 4.5 (3 for large text), see-through panels blend', () => {
  assert.deepEqual(parseColor('rgba(10, 20, 30, 0.5)'), [10, 20, 30, 0.5]); assert.deepEqual(parseColor('#fff'), [255, 255, 255, 1]);
  assert.ok(Math.abs(contrastRatio([0, 0, 0], [255, 255, 255]) - 21) < 0.01); assert.ok(contrastRatio([119, 119, 119], [255, 255, 255]) < 4.5);
  assert.equal(contrastNeed(16, 400), 4.5); assert.equal(contrastNeed(24, 400), 3); assert.equal(contrastNeed(19, 700), 3);
  assert.deepEqual(blend([0, 0, 0, 0.5], [255, 255, 255, 1]).slice(0, 3), [127.5, 127.5, 127.5]);
});

test('the runner: skips a check whose hooks are missing, runs the rest, counts every issue and keeps its order', async () => {
  assert.equal(new Set(ORDER).size, CHECKS.length, 'every check has a place in the order');
  const game = { journal: () => ({ pages: [{ id: 'a', title: 'A', simple: [] }], unlocks: ['a', 'b'], speakers: [] }), places: () => ['yard'], goPlace: () => {}, place: () => ({ bounds: B, walls: WALLS, start: [1, 1] }), move: (a, b) => clamp(a, b) };
  const r = await checkAll(game, {}, { only: ['journal', 'map', 'camera'] });
  assert.equal(r.n, 1); assert.deepEqual(r.rows.map((x) => [x.id, x.status]), [['journal', 'ok'], ['map', 'ok'], ['camera', 'skip']]);
  assert.match(r.text, /^ALL 1 \(1 check not wired\)/); assert.match(r.text, /unlock 'b' has no journal page/);
  const w = watchErrors({}); assert.deepEqual(w.lines, []);   /* outside a browser it does nothing */
});

test('content lint pieces: words, one-sentence goals, em dashes, names, facts and reading literals', () => {
  assert.equal(words('Hush, child. Tonight we walk.').length, 5); assert.equal(words(`Loaded: {n} of {of}.`).length, 4);
  assert.equal(sentenceCount('Talk to Mr. Clive and Gran.'), 1); assert.equal(sentenceCount('Well done! Next, the hill town.'), 1); assert.equal(sentenceCount('Find Rudy. He is by the house.'), 2);
  assert.equal(sentenceCount('Help Auntie Mimba plant yams: 1 of 3.'), 1); assert.equal(sentenceCount('It is 2.5 m away.'), 1);
  assert.deepEqual(emDashes('a\n// note \u2014 here\nb \u2014 c').map((d) => [d.line, d.kind]), [[2, 'comment'], [3, 'text']]);
  assert.equal(nameIssues(['Mr. Clive', 'Mr Clive', 'Quamin', 'Quamim', 'Gran']).length, 2);
  assert.deepEqual(factsIn('On 5 August 1740 about 1,500 people, 3 of 4, and 2 dogs.').sort(), ['1,500', '1740', '5 August'].sort());
  assert.ok(factFound('5 August', 'signed on August 5, 1740')); assert.ok(factFound('1,500', 'about 1500 people')); assert.ok(!factFound('12', 'in 1912'));
  const src = "const J = [{ id: 'a', text: 'x ] y' /* ] */ }, ['b']]; more"; assert.equal(src[matchBracket(src, 10)], ']'); assert.equal(src.slice(matchBracket(src, 10) + 1, matchBracket(src, 10) + 2), ';');
  assert.deepEqual(evalLiteral("[{ id: 'a', simple: [NAME + ' is fictional.'] }]")[0].id, 'a');
  const raw = "a /* unlock: 'x' */ b // c\nd 'e // f'", bare = stripComments(raw);
  assert.equal(bare.length, raw.length); assert.ok(!/unlock|\/\/ c/.test(bare)); assert.ok(bare.endsWith("\nd 'e // f'"));
});
