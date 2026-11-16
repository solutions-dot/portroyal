/* Layout contracts for Windrush and The Emperor's Arrival.
   These source checks run in CI without needing WebGL; mobile visual review is separate. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const game of ['windrush', 'selassie']) {
  test(game + ' uses consistent title navigation, chapter cards and journal feedback', () => {
    const html = readFileSync('games/' + game + '/site/index.html', 'utf8');
    const ui = readFileSync('games/' + game + '/src/ui.js', 'utf8');
    for (const id of ['start', 'tchap', 'allgames', 'jbtn', 'jcount', 'jtabs', 'jpage', 'jclose', 'chlist', 'toast']) {
      assert.match(html, new RegExp('id="' + id + '"'), game + ' is missing UI control ' + id);
    }
    assert.match(html, /grid-template-columns:\\s*repeat\\(3,\\s*minmax\\(0,\\s*1fr\\)\\)/, 'opening actions fit on one row');
    assert.match(html, /#title \\.title-actions > \\.track/, 'loading bar is below opening actions');
    assert.match(html, /#journal \\.book\\s*\\{\\s*overflow:\\s*hidden/, 'journal keeps its header and footer in view');
    assert.match(html, /#journal #jpage\\s*\\{[^}]*overscroll-behavior:\\s*contain/, 'journal body scrolls separately');
    assert.match(html, /#jbtn\\.new\\s*\\{\\s*animation:/, 'new journal pages draw attention');
    assert.match(html, /prefers-reduced-motion:\\s*reduce/, 'notification animation respects reduced motion');
    assert.match(html, /body:has\\(:is\\(#dialogue, #card, #journal, #chapters, #credits\\):not\\(\\[hidden\\]\\)\\)/, 'toasts do not obscure important panels');
    for (const klass of ['yr', 'nm', 'st']) assert.ok(ui.includes('className = "' + klass + '"'), 'chapter card missing ' + klass);
    assert.ok(ui.includes('b.classList.toggle("on", selected)'), 'journal tab must show selection');
    assert.ok(ui.includes('b.setAttribute("aria-pressed", String(selected))'), 'journal tab must announce selection');
    assert.ok(ui.includes('$("jpage").scrollTop = 0'), 'changing pages should start at the top');
  });
}
