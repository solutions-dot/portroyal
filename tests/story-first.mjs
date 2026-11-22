/* the story-first engine pieces (docs/STANDARD.md, "Story first"; docs/plans/story_first_plan.md, Phase 1) */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readTime, judge, trimQuiz, scoreLine, QUIZ_MAX } from '../engine/quiz.js';
import { yawTo, angleDiff, easeAngle, talkAim, createTalkCam } from '../engine/talk-cam.js';
import { recapItems, RECAP_MAX } from '../engine/recap.js';
import { bannerWanted, BANNER_MS, BUSY_IDS } from '../engine/hud.js';

const item = { q: 'Which storm came first?', opts: [{ t: 'Gilbert', say: 'Gilbert was in 1988.' }, { t: 'The 1780 storm', ok: true }, { t: 'Melissa' }], why: 'The 1780 storm came first.' };

test('quiz: a wrong pick names the right answer and says why; a right pick says why', () => {
  const w = judge(item, 0); assert.equal(w.ok, false); assert.equal(w.right, 1); assert.match(w.line, /Gilbert was in 1988\. The 1780 storm came first\./);
  const w2 = judge(item, 2); assert.match(w2.line, /^Not that one\. The 1780 storm came first\.$/);
  const noWhy = { ...item, why: undefined }; assert.match(judge(noWhy, 2).line, /The answer is: The 1780 storm\./, 'with no why, the line still names the right answer');
  const r = judge(item, 1); assert.equal(r.ok, true); assert.equal(r.line, 'The 1780 storm came first.');
});

test('quiz: 3 or 4 questions at most, a reading pause long enough for a young reader, a kind score line', () => {
  assert.equal(QUIZ_MAX, 4); assert.equal(trimQuiz([1, 2, 3, 4, 5, 6]).length, 4); assert.equal(trimQuiz([1, 2, 3, 4, 5, 6], 3).length, 3);
  assert.ok(readTime('Yes!') >= 2200, 'never shorter than 2.2 s'); assert.ok(readTime('one two three four five six seven eight nine ten eleven twelve') > readTime('Yes!'));
  assert.ok(readTime('word '.repeat(200)) <= 6500, 'never longer than 6.5 s');
  assert.equal(scoreLine(4, 4), 'You got all 4. Well done!'); assert.match(scoreLine(2, 4), /You got 2 of 4\. Well done for trying!/);
});

test('talk camera: turns the short way to the speaker and aims a little below the head', () => {
  assert.ok(Math.abs(yawTo(0, 0, 0, -5)) < 1e-9, 'straight ahead (-z) is yaw 0');
  assert.ok(Math.abs(yawTo(0, 0, -5, 0) - Math.PI / 2) < 1e-9, 'to the left (-x) is +90 degrees');
  assert.ok(Math.abs(angleDiff(3.0, -3.0) - (2 * Math.PI - 6)) < 1e-9, 'across the back, the short way');
  assert.ok(Math.abs(easeAngle(3.0, -3.0, 1) - (3.0 + 2 * Math.PI - 6)) < 1e-9);
  const a = talkAim({ x: 0, y: 1.32, z: 0 }, { x: 0, y: 1.6, z: -2 }, { lift: 0.1 });
  assert.ok(Math.abs(a.yaw) < 1e-9); assert.ok(a.pitch < Math.atan2(0.28, 2), 'below the head, so the head shows above the dialogue box');
  assert.equal(talkAim({ x: 0, z: 0 }, { x: 1, z: 1 }).pitch, null, 'no heights: pitch is left alone');
});

test('talk camera: eases in, stops when the player drags to look, and does nothing when not talking', () => {
  const T = createTalkCam(), s = { yaw: Math.PI / 2, pitch: 0 }, eye = { x: 0, y: 1.3, z: 0 }, head = { x: 0, y: 1.6, z: -3 };
  assert.equal(T.step(s, eye, head, 0.016), false, 'not talking'); assert.equal(s.yaw, Math.PI / 2);
  T.begin(); for (let i = 0; i < 120; i++) T.step(s, eye, head, 1 / 60); assert.ok(Math.abs(s.yaw) < 0.02, 'turned to face the speaker in two seconds');
  s.yaw = 1; T.cancel(); T.step(s, eye, head, 0.1); assert.equal(s.yaw, 1, 'the player looked away: leave the view alone');
  T.end(); T.begin(); T.step(s, eye, head, 0.1); assert.ok(s.yaw < 1, 'a new talk turns again');
});

test('recap: three items at most, the ones whose pages the player has', () => {
  const items = [{ icon: 'A', label: 'a', page: 'p1' }, { label: 'b', page: 'p2' }, { label: 'c', page: 'p3' }, { label: 'd', page: 'p4' }, { label: 'no page' }];
  assert.equal(RECAP_MAX, 3); assert.deepEqual(recapItems(items).map((i) => i.page), ['p1', 'p2', 'p3']);
  assert.deepEqual(recapItems(items, ['p2', 'p4']).map((i) => i.page), ['p2', 'p4']);
  assert.deepEqual(recapItems(items, ['zzz']).map((i) => i.page), ['p1', 'p2', 'p3'], 'none unlocked: show the game\'s three');
});

test('goal banner: new words only, never empty, waits for every modal the games use', () => {
  assert.equal(bannerWanted('Plant three yams.', ''), true); assert.equal(bannerWanted('Plant three yams.', 'Plant three yams.'), false);
  assert.equal(bannerWanted('   ', ''), false); assert.ok(BANNER_MS >= 2500 && BANNER_MS <= 4000);
  for (const id of ['title', 'card', 'dialogue', 'journal', 'chapters', 'quizpanel']) assert.ok(BUSY_IDS.includes(id), id);
});
