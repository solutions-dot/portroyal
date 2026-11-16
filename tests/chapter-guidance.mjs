/* Chapter-by-chapter data validation for the three shared-engine games.
   This checks every declared stage, not rendered gameplay or physical reachability. */
import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { STEPS as KENDAL } from '../games/kendal/src/steps.js';
import { STEPS as SELASSIE, TASK_IDS as SELASSIE_TASKS } from '../games/selassie/src/steps.js';
import { STEPS as WINDRUSH, TASK_IDS as WINDRUSH_TASKS } from '../games/windrush/src/steps.js';
import { needList, createStory } from '../engine/story.js';
import * as NANNY from '../games/nanny/src/content.js';
import * as MELISSA from '../games/melissa/src/content.js';
import * as EVENTIDE from '../games/eventide/src/content.js';
import * as BOG from '../games/bog-walk/src/content.js';

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

for (const [game, content] of [['nanny',NANNY],['melissa',MELISSA],['eventide',EVENTIDE],['bog-walk',BOG]]) {
  test(game + ': chapter goal table is complete and talk targets have goals', () => {
    assert.ok(content.CHAPTERS.length >= 5, 'missing chapters');
    for (const [stage, goal] of Object.entries(content.GOALS)) {
      assert.equal(typeof goal,'function', 'stage '+stage+' goal is not callable');
    }
    for (const [stage, people] of Object.entries(content.TALK_TARGETS)) {
      assert.ok(Object.hasOwn(content.GOALS,stage),'talk stage '+stage+' missing goal');
      assert.ok(people.length>0 && new Set(people).size===people.length,'duplicate or empty required talk list at '+stage);
    }
    if (content.NEXT_AFTER_TALK) {
      for (const [stage,next] of Object.entries(content.NEXT_AFTER_TALK)) {
        assert.ok(content.TALK_TARGETS[stage]?.length,'transition '+stage+' has no required talk');
        assert.ok(Object.hasOwn(content.GOALS,next),'talk stage '+stage+' advances to missing '+next);
      }
      for (const stage of Object.keys(content.TALK_TARGETS)) {
        assert.ok(Object.hasOwn(content.NEXT_AFTER_TALK,stage),'required talk stage '+stage+' has no transition');
      }
    }
  });
}

/* The remaining three games use custom stage machines rather than exported step tables.
   Inspect their actual source declarations without loading browser-only modules. */
test('Garvey: all chapter conversation stages have goals and valid transitions', () => {
  const source=readFileSync('games/garvey/src/main.js','utf8');
  const goals=source.match(/const GOALS = \{([\s\S]*?)\};/);
  const talks=source.match(/const TALK_TARGETS = \{([\s\S]*?)\};/);
  const next=source.match(/const NEXT_AFTER_TALK = \{([\s\S]*?)\};/);
  assert.ok(goals && talks && next, 'missing stage data table');
  const goalStages=new Set([...goals[1].matchAll(/(?:^|[,\s])([0-9]+):\s*'/g)].map(m=>m[1]));
  const talkStages=[...talks[1].matchAll(/(?:^|[,\s])([0-9]+):\s*\[([^\]]+)\]/g)];
  const nextPairs=[...next[1].matchAll(/(?:^|[,\s])([0-9]+):\s*([0-9]+)/g)];
  assert.ok(goalStages.size>=30 && talkStages.length>=15, 'chapter tables unexpectedly small');
  const transitions=new Map(nextPairs.map(m=>[m[1],m[2]]));
  for(const m of talkStages) {
    assert.ok(goalStages.has(m[1]),'talk stage '+m[1]+' has no goal');
    assert.ok(transitions.has(m[1]),'talk stage '+m[1]+' has no transition');
    assert.ok(goalStages.has(transitions.get(m[1])),'talk stage '+m[1]+' leads to missing goal');
    const ids=[...m[2].matchAll(/'([^']+)'/g)].map(x=>x[1]);
    assert.ok(ids.length && ids.length===new Set(ids).size,'duplicate/missing people at '+m[1]);
  }
  assert.equal(talkStages.length,transitions.size,'orphan talk transition');
});

test('Tivoli: each walking chapter has exactly three distinct conversation targets', () => {
  const source=readFileSync('games/tivoli/src/ch1.js','utf8');
  const walks=source.match(/export const WALKS = \{([\s\S]*?)\n\};/);
  assert.ok(walks,'walking chapter table missing');
  const rows=[...walks[1].matchAll(/\b([1-8]):\s*\{[\s\S]*?order:\s*\[([^\]]+)\]/g)];
  assert.equal(rows.length,7,'expected seven walking chapters');
  for(const m of rows) {
    const ids=[...m[2].matchAll(/'([^']+)'/g)].map(x=>x[1]);
    assert.equal(ids.length,3,'chapter '+m[1]+' should have three targets');
    assert.equal(new Set(ids).size,3,'chapter '+m[1]+' repeats a target');
  }
  assert.match(source,/ORDER\.findIndex\(\(id\) => !CH\.talked\[id\]\)/);
});

test('Port Royal: goal-driven chapters retain a stage-aware guidance map', () => {
  const source=readFileSync('games/port-royal/src/main.js','utf8');
  assert.match(source,/const NUDGE_MAP = \[/);
  assert.match(source,/NUDGE_MAP\.find\(\(\[re\]\) => re\.test\(goalText\)\)/);
  for(const goal of ['wareGoal','afterGoal','fbGoal','setGoal']) {
    assert.match(source,new RegExp('function '+goal+'\\('),'missing goal controller '+goal);
  }
});
