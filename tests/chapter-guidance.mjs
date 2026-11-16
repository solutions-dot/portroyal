/* Chapter-by-chapter data validation for the three shared-engine games.
   This checks every declared stage, not rendered gameplay or physical reachability. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { STEPS as KENDAL } from '../games/kendal/src/steps.js';
import { STEPS as SELASSIE, TASK_IDS as SELASSIE_TASKS } from '../games/selassie/src/steps.js';
import { STEPS as WINDRUSH, TASK_IDS as WINDRUSH_TASKS } from '../games/windrush/src/steps.js';
import { needList, createStory } from '../engine/story.js';

for (const [game, steps, taskIds] of [
  ['kendal', KENDAL, null],
  ['selassie', SELASSIE, SELASSIE_TASKS],
  ['windrush', WINDRUSH, WINDRUSH_TASKS],
]) {
  for (const [stage, row] of Object.entries(steps)) {
    test(game + ' stage ' + stage + ': objective and declared needs', () => {
      assert.ok(typeof row.goal === 'string' && row.goal.trim(), 'missing player-facing goal');
      const needs = needList(row);
      assert.ok(row.wait || row.end || needs.length, 'stage has no requirements or wait/end');
      assert.equal(new Set(needs.map(n => n.id)).size, needs.length, 'duplicate required id');
      for (const n of needs) {
        assert.ok(n.id && typeof n.id === 'string', 'invalid requirement id');
        if (n.kind === 'do' && taskIds) assert.ok(taskIds.includes(n.id), 'missing task definition: ' + n.id);
      }
      if (row.next !== undefined && row.next !== null && typeof row.next !== 'function') {
        assert.ok(Object.hasOwn(steps, row.next), 'next stage missing: ' + row.next);
      }
      const points = Object.fromEntries(needs.map((n, i) => [n.id, [10 + i * 3, 0]]));
      const story = createStory({dry:true, steps: { [stage]: row }, where: id => points[id] || null, player:()=>[0,0]});
      story.enter(stage);
      assert.equal(story.count().of, needs.reduce((a,n)=>a+n.n,0));
      if (row.wait || row.end) assert.equal(story.pick(), null, 'waiting/end step should not direct to an activity');
      else {
        for (const n of needs) {
          assert.equal(story.needs(n.id), true, 'declared requirement not available');
          for (let i=0; i<n.n; i++) assert.equal(story.done(n.id), true, 'required task did not count');
        }
        assert.equal(story.count().n, story.count().of, 'stage cannot complete its requirements');
        assert.equal(story.pick(), null, 'completed step still directs player to a finished target');
      }
    });
  }
}
