/* The same navigation and controls in every game (owner, 19 November 2026: "all games existing need to be standardised with these controls, and all
   new games should follow"). Every game folder that does not start with "_" is checked, so a new game fails here until it follows docs/STANDARD.md,
   section "Navigation and controls". */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const GAMES = readdirSync('games').filter((g) => !g.startsWith('_') && existsSync(`games/${g}/site/index.html`) && existsSync(`games/${g}/src/main.js`));
const src = (g) => readdirSync(`games/${g}/src`).filter((f) => f.endsWith('.js') && f !== 'dev.js').map((f) => readFileSync(`games/${g}/src/${f}`, 'utf8')).join('\n');

test('every game has the standard navigation and controls', () => {
  assert.ok(GAMES.length >= 10, 'found ' + GAMES.length + ' games');
  for (const g of GAMES) {
    const html = readFileSync(`games/${g}/site/index.html`, 'utf8'), js = src(g), at = (m) => g + ': ' + m;
    assert.match(html, /id="jbtn"/, at('a Journal button, id="jbtn"'));
    assert.match(js, /addExit\(/, at('the Exit button beside the Journal button: addExit() from engine/exit.js'));
    assert.match(html, /<a id="allgames"[^>]*>Exit<\/a>/, at('the title screen leaves with a link that reads "Exit" (id="allgames")'));
    assert.doesNotMatch(html, /id="jhome"/, at('no Main Menu button on the journal pages'));
    assert.doesNotMatch(html + js, /Main Menu/, at('the words "Main Menu" are not used; it is "Exit"'));
    assert.doesNotMatch(js, /card\('Reset'[\s\S]{0,700}?t: 'Exit'/, at('the Reset card has no Exit button'));
    assert.match(html, /title\.css/, at('the shared title screen styles (shared/title.css: steady buttons, no save line)'));
    assert.doesNotMatch(html, /WASD|W A S D|arrow keys|left thumb|Left thumb/, at('no control instructions in the page itself: the controls tip in play says them (liveHint)'));
    assert.match(html, /id="credits"[\s\S]*Created by[\s\S]*Where the history comes from/, at('Credits say who made the game and where the history comes from'));
    { const cr = (html.match(/id="credits"[\s\S]*?(<\/section>|<\/dialog>|Back to Chapters)/) || [''])[0]; assert.doesNotMatch(cr, /\b(built with|made with|engine|three\.?js|MakeHuman|Mixamo|Blender|Vercel|GitHub|servers?|Claude|software)\b/i, at('Credits name only who made it and where the history comes from, never tools, engines or servers')); }
    assert.match(html, /--display:\s*"Alfa Slab One"/, at('the interface font is Alfa Slab One (--display), the same in every game'));
    assert.match(html, /--(text|body):\s*"Atkinson Hyperlegible"|font-family:\s*"Atkinson Hyperlegible"/, at('the reading font is Atkinson Hyperlegible'));
    assert.match(js, /liveHint\(/, at('the controls tip uses liveHint() from engine/device.js (touch or key words)'));
    assert.match(js, /touchFirst\(\)/, at('touch is detected with touchFirst() from engine/device.js'));
    assert.match(js, /tapPerson|pickPerson/, at('a tap on a person starts their talk (engine/tap.js pickPerson, or the game\'s own tapPerson)'));
    assert.match(js, /tunePixels\(/, at('the pixel cap and slow-frame drop: tunePixels() from engine/perf.js'));
    assert.match(js, /createGuide\(/, at('the gold ground arrow: createGuide() from engine/guide.js'));
  }
});
