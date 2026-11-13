# Writing content: dialogue, goals, journal, chapters

## The voice

- **Ages 6 and up.** Short lines, about 12 words or fewer, one idea each. Common words. Explain a hard word the first time ("a privateer had papers from the government").
- **Main path in plain words. Detail in "Dig deeper".** Journal pages have `simple` lines for everyone and `deeper` lines for older readers and teachers.
- **Accurate.** Check every fact against a source before writing it, and note the source in the commit or the game's doc.
  - Made-up people are fine, but their journal page must say so ("Grace in this game is made up").
  - Real people only say things they could have said; never invent famous quotes.
  - Real objects use their real words (the Port Royal tombstone shows its actual 1739 inscription).
- **Hard history, told gently.** Slavery is named plainly ("enslaved: forced to work, unpaid, not free to leave"). Violence stays in the background. No one is shown dying.
- **No em dashes**, anywhere.

## A conversation

```js
const KOFI = [
  { who: 'Kofi', text: 'Mind the casks. They are heavy!' },
  { who: 'Lewis', text: 'Do you work for the merchant?' },
  { who: 'Kofi', text: 'No. I am enslaved. A man says he owns me.', unlock: 'kofi' },   // opens a journal page
  { who: 'Abba', text: 'How much change?', choices: [{ t: '6 reales', ok: true }, { t: '4 reales' }] },  // a question; wrong answers grey out
  { who: 'Kofi', anim: 'Wave', text: 'Go well.' },                                    // optional animation for the speaker
];
startConvo(KOFI, () => { /* runs after the last line */ });
```

- `who` must match a name `speakerModel()` knows, so the right person animates and turns to you.
- `unlock: 'id'` opens journal page `id`, with a chime and a toast.

## Later visits

The first talk tells the story. After that, each person says one short line, picked from a list that reacts to progress:

```js
const MORE = { kofi: [[() => true, 'I must get back to work.'], [() => state.ate, 'You ate at Abba’s? Her stew is good.']] };
```

`npcTalk` / `nsTalk` give lines the player hasn't heard yet first, then take turns (the record is kept in `state.ch.seen` and `state.ch.heard`).

## A journal page

```js
{ id: 'turtles', title: 'Turtles and crawls',
  simple: ['Green turtle was one of the town’s main foods.', 'They kept them alive in pens in the sea, called crawls.'],
  deeper: ['Ships bought turtles to eat on long voyages.', 'Peter in this game is made up.'] }
```

Add pages to `JOURNAL` (or `JOURNAL.push(...)` in a later section). Pages are listed in the order they were added.

## Goals

`goalText = 'Talk to the quartermaster on the beach.'; showGoal();` sets a goal. It shows for a few seconds, then folds into a small "Goal" tab.
- Keep goals to one short sentence.
- Say who or where ("the man in the red coat", "by the barrels").
- Include counts ("Loaded: 2 of 3").

## Things to do (actions)

```js
ACTIONS.push({ label: 'Talk to the turtler', r: 2.6,
  where: () => state.place === 'out' && [21.0, 12.6],   // [x, z] when available, otherwise false
  go: () => startConvo(PETER) });
```

- Labels starting with "Talk to" show as a glowing speech bubble with the rest of the label as a name.
- Other labels show as a button ("Look at the pipes").
- Turn them off when they don't make sense: in the flashback (`!FB.on`), during the earthquake (`!Q.on`), before something is unlocked.

## Chapters

Each chapter in `CHAPTERS` has an `id`, `name`, `year`, a `go()` that sets up the place, state and goal, and a `done()` test. The Chapters menu plays any finished chapter. Wrap a chapter start in `chapterFade('Title', fn)` for the fade-to-title effect. Starting any chapter must clean up the one before it (see `fbReset()`).

## People who move

Put walk routes in `STROLL` (second street) or `route` (Kofi). People pause at each point, walk with the `Walk` clip, stop and face the player within about 3.6 m, and keep their action point (`n.x`, `n.z`) updated as they go.
