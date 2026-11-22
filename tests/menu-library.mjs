/* The menu's library (menu/library.js, docs/PLATFORM.md "The library"): what every card must say about itself,
   and the thinking behind profiles, "For you", "More like this" and the shared average. No browser is needed. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import lib from '../menu/library.js';

const page = readFileSync('menu/index.html', 'utf8');
const cards = [...page.matchAll(/<a class="game[^"]*"([^>]*)>/g)].map((m) => m[1]).filter((a) => /data-game=/.test(a));
const attr = (a, name) => (a.match(new RegExp('data-' + name + '="([^"]*)"')) || [])[1];

test('menu library: every card names its kinds of story, its tags and its age; a 13 card has a warning note', () => {
  const known = lib.GENRES.map((g) => g[0]);
  assert.deepEqual(known, ['mystery', 'disasters', 'freedom', 'leaders', 'family', 'battles']);
  assert.ok(cards.length >= 10);
  for (const a of cards) {
    const id = attr(a, 'game'), genres = lib.words(attr(a, 'genres')), tags = lib.words(attr(a, 'tags')), age = attr(a, 'age');
    assert.ok(genres.length > 0, id + ' has no data-genres');
    for (const g of genres) assert.ok(known.includes(g), id + ' has an unknown kind of story: ' + g);
    assert.ok(tags.length > 0, id + ' has no data-tags');
    assert.ok(age === '6' || age === '13', id + ' needs data-age of 6 or 13');
    if (age === '13') assert.ok((attr(a, 'warn') || '').trim().length > 0, id + ' is 13 and needs a data-warn note');
  }
});

test('menu library: the page never says PG-13, and the library files are loaded', () => {
  for (const f of ['menu/index.html', 'menu/library.js', 'menu/library.css', 'menu/about.html']) assert.doesNotMatch(readFileSync(f, 'utf8'), /PG-?13/i, f);
  assert.match(page, /<link rel="stylesheet" href="library\.css">/);
  assert.match(page, /<script src="library\.js"><\/script>/);
  const main = page.slice(page.indexOf('<main>'), page.indexOf('</main>'));
  assert.match(main, /id="library"[^>]* hidden/, 'the library bar sits inside main and starts hidden');
  assert.match(main, /id="kidsnote"[^>]* hidden/);
});

test('menu library: shared ratings are switched off in the committed file', () => {
  assert.equal(lib.RATINGS_URL, '');
  assert.match(readFileSync('menu/library.js', 'utf8'), /^const RATINGS_URL = '';$/m);
});

/* a made-up library: three games from the menu, the two Mature 13+ games, and a made-up New game for all ages */
const game = (id, title, genres, tags, age = 6, isNew = false) => ({ id, title, genres: genres.split(' '), tags: tags.split(' '), age, isNew });
const CATALOG = [
  game('port-royal', 'Port Royal Earthquake, 1692', 'disasters', 'sea ships town earthquake 1600s'),
  game('hutchinson', 'The Mad Master of Edinburgh Castle, 1773', 'mystery', 'crime mystery st-ann 1700s hard-history', 13, true),
  game('rose-hall', 'The White Witch of Rose Hall', 'mystery', 'legend ghost-story st-james 1800s hard-history', 13, true),
  game('garvey', 'Marcus Garvey and the UNIA, 1914', 'leaders freedom', 'biography movement kingston ships'),
  game('kendal', 'Kendal Train Crash, 1957', 'disasters', 'railway crash journey'),
  game('lost-letter', 'The Lost Letter, 1960', 'mystery', 'sea ships letters', 6, true),
  game('tivoli', 'Tivoli Incursion, 2010', 'freedom', 'kingston community hard-history'),
];
const ids = (list) => list.map((x) => (x.game || x).id);

test('menu library: Kids never see a 13 game; Teens and adults see everything', () => {
  assert.deepEqual(ids(lib.visibleGames(CATALOG, 'kids')), ['port-royal', 'garvey', 'kendal', 'lost-letter', 'tivoli']);
  assert.equal(lib.visibleGames(CATALOG, 'teen').length, 7);
  for (const odd of [undefined, null, '', 'TEEN', 'adult']) assert.equal(lib.cleanProfile(odd), 'kids', 'anything but "teen" is Kids');
  const noLetter = CATALOG.filter((g) => g.id !== 'lost-letter');
  assert.ok(!lib.genresInUse(lib.visibleGames(noLetter, 'kids')).includes('mystery'), 'no Mystery chip for Kids while its only games are hidden');
  assert.deepEqual(lib.genresInUse(lib.visibleGames(noLetter, 'teen')), ['mystery', 'disasters', 'freedom', 'leaders']);
  assert.deepEqual(ids(lib.byGenre(lib.visibleGames(CATALOG, 'kids'), 'disasters')), ['port-royal', 'kendal']);
});

test('menu library: the year of birth opens Teens and adults only from 13', () => {
  assert.equal(lib.gateFromYear('2013', 2026), 'teen');
  assert.equal(lib.gateFromYear(2014, 2026), 'kids');
  assert.equal(lib.gateFromYear(' 1980 ', 2026), 'teen');
  for (const odd of ['', 'abc', '12', '20.5', 2027, 1800, null]) assert.equal(lib.gateFromYear(odd, 2026), 'unclear', String(odd));
});

test('menu library: with no visits and no ratings, For you is the New games this profile can see, or nothing', () => {
  const kids = lib.recommend(CATALOG, 'kids', {}, {});
  assert.deepEqual(kids.map((p) => [p.game.id, p.reason]), [['lost-letter', 'New']]);
  assert.deepEqual(ids(lib.recommend(CATALOG, 'teen', {}, {})), ['hutchinson', 'rose-hall', 'lost-letter']);
  assert.deepEqual(lib.recommend(CATALOG.filter((g) => !g.isNew), 'kids', {}, {}), [], 'no New game: no pick is made up');
  assert.deepEqual(lib.recommend(CATALOG.filter((g) => g.id !== 'lost-letter'), 'kids', {}, {}), [], 'the only New games are 13: Kids get no strip');
});

test('menu library: For you scores shared kinds and tags, gives a plain reason, and leaves out what you know', () => {
  const liked = lib.recommend(CATALOG, 'kids', { 'port-royal': 5 }, { 'port-royal': { n: 1, t: 10 } });
  assert.deepEqual(liked.map((p) => [p.game.id, p.score, p.reason]), [
    ['kendal', 3, 'Because you liked Port Royal Earthquake, 1692'],          /* one shared kind with a liked game */
    ['lost-letter', 3, 'Because you liked Port Royal Earthquake, 1692'],     /* two shared tags, and New */
    ['garvey', 1, 'Because you liked Port Royal Earthquake, 1692'],          /* one shared tag */
  ]);
  const went = lib.recommend(CATALOG, 'kids', {}, { kendal: { n: 2, t: 5 } });
  assert.deepEqual(went.map((p) => [p.game.id, p.score, p.reason]), [['port-royal', 2, 'Because you went to Kendal Train Crash, 1957'], ['lost-letter', 1, 'New']]);
  const no = lib.recommend(CATALOG, 'kids', { 'port-royal': 1 }, { 'port-royal': { n: 1, t: 1 } });
  assert.ok(!ids(no).includes('kendal') && !ids(no).includes('port-royal'), 'a game you did not like pulls its kind down');
  assert.ok(!ids(lib.recommend(CATALOG, 'kids', { kendal: 3 }, {})).includes('kendal'), 'a game you rated is not a pick');
  assert.equal(lib.recommend(CATALOG, 'teen', { garvey: 5 }, {}, 2).length, 2, 'never more than the limit');
});

test('menu library: For you and More like this never show Kids a 13 game, as a pick or as a reason', () => {
  const ratings = { hutchinson: 5 }, visits = { hutchinson: { n: 3, t: 9 } };
  const kids = lib.recommend(CATALOG, 'kids', ratings, visits);
  assert.ok(kids.every((p) => p.game.age < 13 && !/Mad Master|Rose Hall/.test(p.reason)));
  assert.deepEqual(kids.map((p) => p.reason), ['New']);
  const teen = lib.recommend(CATALOG, 'teen', ratings, visits);
  assert.equal(teen[0].game.id, 'rose-hall');
  assert.equal(teen[0].reason, 'Because you liked The Mad Master of Edinburgh Castle, 1773');
  const letter = CATALOG.find((g) => g.id === 'lost-letter');
  assert.deepEqual(ids(lib.similar(letter, CATALOG, 'kids')), ['port-royal', 'garvey']);
  assert.deepEqual(ids(lib.similar(letter, CATALOG, 'teen')), ['hutchinson', 'rose-hall', 'port-royal']);
  assert.ok(!ids(lib.similar(letter, CATALOG, 'teen')).includes('lost-letter'));
});

test('menu library: the shared average shows from 3 ratings, to one decimal, and never from numbers that make no sense', () => {
  assert.equal(lib.formatAverage({ sum: 123, n: 30 }), '4.1 of 5, from 30 ratings');
  assert.equal(lib.formatAverage({ sum: 14, n: 3 }), '4.7 of 5, from 3 ratings');
  for (const e of [{ sum: 10, n: 2 }, { sum: 0, n: 0 }, undefined, null, {}, { sum: 99, n: 3 }, { sum: 1, n: 3 }, { sum: 'x', n: 5 }]) assert.equal(lib.formatAverage(e), '');
  assert.deepEqual(lib.addVote({ sum: 123, n: 30 }, 5, 0), { sum: 128, n: 31 });
  assert.deepEqual(lib.addVote({ sum: 123, n: 30 }, 2, 4), { sum: 121, n: 30 });
  assert.deepEqual(lib.addVote({ sum: 123, n: 30 }, 0, 4), { sum: 119, n: 29 });
  assert.deepEqual(lib.cleanRatings({ a: 4, b: 9, c: 'x', d: '2' }), { a: 4, d: 2 });
  assert.deepEqual(lib.cleanVisits({ a: { n: 2, t: 7 }, b: { n: 0 }, c: 3 }), { a: { n: 2, t: 7 } });
});
