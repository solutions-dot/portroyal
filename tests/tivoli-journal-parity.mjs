import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync('games/tivoli/site/index.html','utf8');
const story=readFileSync('games/tivoli/src/story.js','utf8');
test('Tivoli journal uses the same book, tabs and footer navigation as other games',()=>{
  for(const id of ['journal','jtitle','jclose','jlist','jpage','jchap']) assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(html,/id="journal"[^>]*role="dialog"|id="journal" role="dialog"/);
  assert.match(html,/class="book"/);
  assert.match(html,/role="tablist"/);
  assert.match(story,/\$\('jchap'\)\.onclick = openCh/);
  assert.match(story,/aria-selected/);
});
test('Tivoli start card excludes Journal; home-page artwork moves, not the menu',()=>{
  const title=html.match(/<section id="title">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(title);
  assert.doesNotMatch(title,/>Journal</);
  for(const id of ['start','chbtn','allgames']) assert.match(title,new RegExp('id="'+id+'"'));
  assert.doesNotMatch(html,/@keyframes tivoli-menu-enter/);
  const menu=readFileSync('menu/index.html','utf8');
  assert.match(menu, /\.game\.tivoli::before/);
  assert.match(menu, /@keyframes tivoli-scene-drift/);
  assert.match(menu, /prefers-reduced-motion:reduce/);
  assert.match(html,/id="jbtn"[^>]*>Journal/);   // the shared Journal button (17 Nov 2026: Tivoli's own #jhud replaced)
});
