import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStory } from '../engine/story.js';

// These games use explicit per-stage required-person selectors.
// Guard against optional actions taking precedence over an unfinished conversation.
for (const game of ['garvey','bog-walk','nanny','melissa','eventide']) {
  test(game + ': required story people precede optional actions in guidance', () => {
    const source = readFileSync('games/' + game + '/src/main.js', 'utf8');
    const start = source.indexOf('function nudgeTarget()');
    assert.ok(start >= 0, 'missing nudgeTarget');
    const end = source.indexOf('\nfunction ', start + 10);
    const block = source.slice(start, end < 0 ? undefined : end);
    const person = block.search(/wantsTalk\(n\)|markWanted\(n\)/);
    const action = block.indexOf('.actions.find(') >= 0 ? block.indexOf('.actions.find(') : block.indexOf('ACTIONS.find(');
    assert.ok(person >= 0 && action > person, 'required-person targeting must come before action fallback');
  });
}

test('story guidance selects nearest unfinished required need and immediately retargets', () => {
  const points = { gran: [8,0], teacher: [16,0], market: [2,0] };
  const story = createStory({
    dry: true, player: () => [0,0], where: (id) => points[id],
    steps: { 1: { goal: 'Speak to Gran and the teacher', needs: { talk: ['gran','teacher'] }, optional: ['market'] } }
  });
  story.enter(1);
  assert.equal(story.pick().id, 'gran');
  for(let t=0;t<=2512;t+=16) story.tick(t,true);
  assert.equal(story.tick(2528,true).id,'gran');
  assert.equal(story.done('market'),false,'optional actions cannot complete the story');
  assert.equal(story.done('gran'),true);
  assert.equal(story.pick().id,'teacher');
  assert.equal(story.tick(2544,true).id,'teacher','next target should appear without a second delay');
});

test('ordered story guidance never skips ahead to a closer later need', () => {
  const story=createStory({
    dry:true, player:()=>[0,0], where:(id)=>id==='first'?[30,0]:[3,0],
    steps:{1:{goal:'Complete these in order',needs:{talk:['first','second']},any:false}}
  });
  story.enter(1);
  assert.equal(story.pick().id,'first');
  story.done('first');
  assert.equal(story.pick().id,'second');
});
