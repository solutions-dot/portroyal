/* Interface parity for Windrush and The Emperor's Arrival: the same look and behaviour as Kendal 1957 (and Melissa, Garvey, Nanny Town).
   These source checks run in CI without needing WebGL; phone screenshots are still checked by eye. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const style = (html) => [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const kendal = style(readFileSync('games/kendal/site/index.html', 'utf8'));
const shared = kendal.slice(kendal.indexOf('\n}\n') + 3).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('/*'));

for (const game of ['windrush', 'selassie']) {
  test(game + ' has the same interface as Kendal', () => {
    const html = readFileSync('games/' + game + '/site/index.html', 'utf8');
    const css = style(html);
    const ui = readFileSync('games/' + game + '/src/ui.js', 'utf8');
    const main = readFileSync('games/' + game + '/src/main.js', 'utf8');
    for (const id of ['start', 'tchap', 'allgames', 'jbtn', 'jcount', 'jtabs', 'jpage', 'jclose', 'chlist', 'toast', 'hint', 'goal', 'stick', 'nub', 'dialogue', 'card']) {
      assert.match(html, new RegExp('id="' + id + '"'), game + ' is missing UI control ' + id);
    }
    /* every shared rule of Kendal's page is in this page too (sizes, fonts, panels, the glowing Journal button, the fainter joystick) */
    const missing = shared.filter((l) => !css.includes(l));
    assert.deepEqual(missing, [], game + ' is missing some of Kendal\'s interface rules');
    assert.doesNotMatch(css, /#jbtn\.new/, 'the Journal button glows with .glow, as in every game');
    /* behaviour */
    assert.ok(ui.includes('b.classList.toggle("glow", n > 0)'), 'new journal pages make the Journal button glow');
    assert.ok(ui.includes('"New journal page: "'), 'a new page shows a toast');
    assert.ok(ui.includes('Left thumb walks. Drag to look. Tap a person to talk.'), 'the same controls tip as every game');
    assert.ok(ui.includes('}, 6000);'), 'the controls tip goes away after about 6 seconds');
    assert.doesNotMatch(main, /\$\("hint"\)\.textContent/, 'the controls tip is not rewritten every frame');
    assert.doesNotMatch(main + ui, /fillText\("!"/, 'no yellow "!" speech bubble: the gold talk mark instead');
    assert.ok(ui.includes('from "../../../engine/marks.js"'), 'the talk mark sits over the real head or hat (engine/marks.js)');
    assert.ok(ui.includes('className = "tbub"'), 'the talk button with the name over the nearest person');
    assert.ok(main.includes('"Chapter " + (i + 1) + " is finished!"') && main.includes('"Next chapter"') && main.includes('"Stay here"'), 'the Next chapter card');
    for (const klass of ['yr', 'nm', 'st']) assert.ok(ui.includes('["' + klass + '"'), 'chapter card missing ' + klass);
    assert.ok(ui.includes('b.classList.toggle("on", selected)'), 'journal tab must show selection');
    assert.ok(ui.includes('b.setAttribute("aria-pressed", String(selected))'), 'journal tab must announce selection');
    assert.ok(ui.includes('$("jpage").scrollTop = 0'), 'changing pages should start at the top');
  });
}
