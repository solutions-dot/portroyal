import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStory, ARROW_LIMIT, ARROW_LIMIT_EXPLORE } from '../engine/story.js';

const DELAY = 2500;
const games = ['port-royal','garvey','kendal','bog-walk','nanny','tivoli','melissa','eventide','selassie','windrush'];

test('all ten games use the same 2.5-second objective guidance', () => {
  assert.equal(ARROW_LIMIT, DELAY);
  assert.equal(ARROW_LIMIT_EXPLORE, DELAY);
  for (const game of games) {
    const code = readFileSync('games/' + game + '/src/main.js','utf8');
    assert.match(code,/createGuide\s*\(/,game+': missing world guide');
    if (['port-royal','garvey','bog-walk','nanny','melissa','eventide','tivoli'].includes(game)) {
      assert.match(code,game==='bog-walk' ? /now\s*-\s*NUDGE\.since\s*>=\s*2\.5/ : /now\s*-\s*NUDGE\.since\s*>=\s*2500/,game+': delay differs');
    } else {
      assert.match(code,/\.tick\(now,\s*quiet\)/,game+': shared story guidance not ticked');
    }
  }
});

for (const explore of [false,true]) {
  test('shared story '+(explore?'explore':'ordinary')+' objective waits 2.5 seconds',()=>{
    const story=createStory({dry:true,steps:{1:{goal:'Talk to Gran',needs:{talk:['gran']},explore}},where:()=>[12,0],player:()=>[0,0]});
    story.enter(1);
    assert.equal(story.tick(0,true).show,false);
    // The engine caps large frame gaps to 500 ms; simulate normal animation frames.
    for(let t=16;t<=2496;t+=16)story.tick(t,true);
    assert.equal(story.tick(2496,true).show,false);
    assert.equal(story.tick(2512,true).show,true);
  });
}

test('legacy arrows do not re-trigger while inside the interaction radius', () => {
  for (const game of ['port-royal','garvey','bog-walk','nanny','melissa','eventide','tivoli']) {
    const source=readFileSync('games/'+game+'/src/main.js','utf8');
    const tick=source.split('\n').find(line=>line.includes('!NUDGE.on && quiet && tgt')) || '';
    assert.match(tick,/!NUDGE\.on && quiet && tgt && Math\.hypot\([^)]*\) >= [\d.]+ && now - NUDGE\.since >=/,game+': arrow repeatedly triggers near a target');
  }
});
