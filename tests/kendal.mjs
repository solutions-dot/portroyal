/* Kendal 1957 story contracts. Static story tables are safe to test without WebGL or loaded models.
   The live beach-action guard check protects against replaying the same activity as a second choice. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStory, needList } from '../engine/story.js';
import { STEPS, placeOfStage } from '../games/kendal/src/steps.js';

test('Kendal story stages lead to existing stages and stay in their correct chapter places', () => {
  const entries = Object.entries(STEPS);
  assert.ok(entries.length > 35, 'the complete Kendal story needs all its stage entries');
  for (const [id, step] of entries) {
    assert.ok(step.goal && typeof step.goal === 'string', 'missing goal at ' + id);
    assert.ok(step.wait || step.end || needList(step).length, 'stage ' + id + ' has no task and is not a timed scene');
    if (step.next != null) assert.ok(STEPS[step.next], 'stage ' + id + ' leads to missing stage ' + step.next);
  }
  const expected = { 10: 'road', 20: 'station45', 23.5: 'ride45', 23.6: 'ride45',
    30: 'hill', 40: 'kingston57', 42: 'coach', 43: 'beach', 50: 'coach',
    61: 'crash', 66: 'crash', 70: 'memorial', 74: 'memorial' };
  for (const [stage, place] of Object.entries(expected)) assert.equal(placeOfStage(+stage), place, 'stage ' + stage);
});

test('Kendal crash water run counts two bucket deliveries before looking for Dawn', () => {
  let story;
  story = createStory({ steps: STEPS, advance: (next) => story.enter(next) });
  const water = needList(STEPS[61]).find((n) => n.id === 'water');
  assert.deepEqual({ kind: water.kind, count: water.n, carry: water.carry }, { kind: 'do', count: 2, carry: 'bucket' });
  story.enter(61);
  assert.deepEqual(story.count(), { n: 0, of: 2 });
  assert.equal(story.done('water'), true);
  assert.equal(story.stage, 61, 'one trip should not end the rescue water task');
  assert.deepEqual(story.count(), { n: 1, of: 2 });
  assert.equal(story.done('water'), true);
  assert.equal(story.stage, 62, 'two deliveries should open the lost-child conversation');
  assert.equal(story.marked('dawn'), true);
});

test('Kendal 1845 carriage water task requires three passes; beach requires two activities', () => {
  const carriage = needList(STEPS[23.5]).find((n) => n.id === 'water');
  assert.equal(carriage.n, 3);
  assert.equal(carriage.carry, 'bucket');
  assert.equal(STEPS[23.5].next, 23.6);
  const beach = needList(STEPS[43]).find((n) => n.id === 'fun');
  assert.equal(beach.n, 2);
  assert.equal(STEPS[43].next, 44);
  let story;
  story = createStory({ steps: STEPS, advance: (next) => story.enter(next) });
  story.enter(43);
  assert.match(story.goal(), /0 of 2/);
  story.done('fun');
  assert.equal(story.stage, 43);
  assert.match(story.goal(), /1 of 2/);
  story.done('fun');
  assert.equal(story.stage, 44);
});

test('Kendal beach activity guards use the same completed flag as each action records', () => {
  const code = readFileSync('games/kendal/src/main.js', 'utf8');
  // The action and completion flag must agree, or one repeated activity can count twice.
  for (const [id, flag] of [['sea', 'splash'], ['castle', 'castle'], ['band', 'band']]) {
    const action = code.match(new RegExp("\\{ id: '" + id + "', need: 'fun'.*?(?=\\n\\s*\\{ id:|\\n\\s*\\];)", 's'));
    assert.ok(action, 'missing ' + id + ' beach action');
    assert.ok(action[0].includes('!done().' + flag), id + ' must check the completion flag ' + flag);
    assert.ok(action[0].includes("fun('" + flag + "')"), id + ' must record ' + flag + ' as completed');
  }
});


test('Kendal saved beach progress restores the count and remembers the selected activity', () => {
  const source = readFileSync('games/kendal/src/main.js', 'utf8');
  assert.match(source, /story\.beachDone\s*=\s*Object\.keys\(done\(\)\)/, 'completed beach choices must be saved to story');
  assert.match(source, /story\.beach\s*=\s*story\.beach\s*\|\|\s*k;\s*STORY\.done\('fun'\);\s*saveGame\(\)/, 'save after STORY.done so the completed count is persisted');
  assert.match(source, /savedFlow\s*&&\s*savedFlow\.stage\s*===\s*43/, 'the return to the beach must identify a saved step');
  assert.match(source, /story\.beachDone\s*\|\|\s*\(story\.beach\s*\?\s*\[story\.beach\]/, 'saved choices are applied to beach activity guards');

  let original;
  original = createStory({ steps: STEPS, advance: (next) => original.enter(next) });
  original.enter(43);
  assert.equal(original.done('fun'), true);
  const save = original.save(), storedStory = { beach: 'splash', beachDone: ['splash'] };
  assert.deepEqual(save.got, { fun: 1 });

  let restored;
  restored = createStory({ steps: STEPS, advance: (next) => restored.enter(next) });
  restored.restore(save);
  const restoredDone = Object.fromEntries(storedStory.beachDone.map((id) => [id, true]));
  assert.equal(restored.stage, 43);
  assert.deepEqual(restored.count(), { n: 1, of: 2 });
  assert.equal(restoredDone.splash, true, 'splash is unavailable after reloading');
  assert.equal(restoredDone.band, undefined, 'the band remains available');
  assert.equal(restored.done('fun'), true);
  assert.equal(restored.stage, 44, 'a distinct second activity completes the goal');
});
