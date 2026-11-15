# Wiring `?test=all` into every game: the plan

Phase 1 (done, engine and tools only): `engine/checks.js` (the runner `checkAll` and every rule as a plain function), accessibility checks added to `engine/ui-audit.js`, `tools/lint_content.mjs` (run by `npm test`), `tools/checks_browser.mjs` (menu, errors, a11y, size, harness, fixtures), `tools/checks/<game>.json` (per-game settings), `tools/checks/lint-baseline.json`, `tools/checks/adapters/bog-walk.js` (proof on a live game without editing it), `tests/checks.mjs`, `tests/checks.html`, `.github/workflows/checks.yml`, and docs (`docs/TESTING.md` section 7, `docs/ENGINE.md`, `docs/STANDARD.md`).

Phase 2 (per game, one pull request each, after the other agents' passes land): add one block and one new file to each game. Nothing else in the game changes. The order below starts with the games whose dev build already exposes most hooks.

## The one block (the same in every game)

In the game's dev-only test code (where its other `q.get('test')` checks are):

```js
import { checkAll } from '../../../engine/checks.js';
import { checkAdapter, CHECK_TABLES } from './checktables.js';
if (__DEV__ && q.get('test') === 'all') whenModelsReady(() => checkAll(checkAdapter(DEV), CHECK_TABLES));
```

`whenModelsReady` is whatever the game already uses before its other tests run (Bog Walk: the `devViews()` call after `modelsReady = true`; Kendal, Nanny, Melissa, Eventide: the place their `?test=audit` starts). `DEV` is an object of the game's internals; Bog Walk already has one (`main.js`, `const DEV = __DEV__ ? {...}`); each other game adds the same kind of object in its dev code.

`games/<game>/src/checktables.js` holds two things: `checkAdapter(DEV)` (the hooks, copied from `tools/checks/adapters/bog-walk.js` and pointed at the game's own functions) and `CHECK_TABLES` (the data below). Do not name it `checks.js`: Tivoli already has a `src/checks.js`.

## The hooks each game maps (from its own code)

| Hook | Port Royal | Garvey | Kendal | Bog Walk | Nanny Town | Eventide | Melissa | Tivoli |
|---|---|---|---|---|---|---|---|---|
| `chapters`, `openChapter(i)` | `CHAPTERS`, `playChapter(i)` | `CHAPTERS`, `playChapter(i)` | `CHAPTERS`, `beginChapter(i)` | `CHAPTERS`, `beginChapter(i)` | `CHAPTERS`, `beginChapter(i)` | `CHAPTERS`, `beginChapter(i)` | `CHAPTERS`, `beginChapter(i)` | `CHAPTERS` (playable only), `startChapter(i)` |
| `steps`, `goStep(s)` | the flashback steps (`FB.step`) and quake phases | `GOALS` keys, `setStage(s)` | `STEPS` in `src/steps.js` (new) and `GOALS`, `beginChapter(ch, s)` | `TALK_TARGETS` keys, `beginChapter(ch, s)` | `GOALS` keys, `beginChapter(ch, s)` | `GOALS` keys, `beginChapter(ch, s)` | `GOALS` keys, `beginChapter(ch, s)` | `CH1.goals` index |
| `place()`, `places()`, `goPlace` | `state.place` (`out`, `tavern`, `fort`, `spit`, ...), its bounds in `clampPos` | `enterPlace(id)` | `buildPlace`, `enterPlace` | `PL`, `enterPlace` | `buildPlace`, `enterPlace` (land from `land.js`: `groundAt`) | `buildPlace` | `buildPlace`, `enterPlace` | the street (`street.js`) |
| `move(from, to)` | `clampPos` | `clampPos` | `clampPos` | `clampWorld` | `clampPos` / `clamp` | `clampPos` | `clampPos` | `clampPos` |
| `save`, `restore`, `snapshot` | `saveGame`, `loadGame`, `applySave` (`portroyal-save-v1`) | same (`garvey-save-v1`) | same (`kendal-save-v1`) | same | same (`nanny-save-v1`) | same | same | no save yet: skip |
| `held()` | `state` carried crate or basket | the type stick | `createCarry().holding()` | the torch (always) | `createCarry().holding()` | `createCarry().holding()` | `createCarry().holding()` | none |
| `camera()` | the camera (third person) | the camera | the camera | the eye (first person) | the camera | the camera | the camera | the camera |
| `clips()` | every NPC's `userData.anim.cur` | the same | the same | the same | the same, plus `engine/ambient.js` people | the same | the same | the soldiers', police and gunmen's clips (`fight.js`) |
| `audio()`, `setSound`, `talking()` | `AU`, `setSound`, `talkWith` | same | same | same | same | same | same | same |
| `faces()` | story people of the place | same | same | same | same | same | same | same |
| `autoplay({ sample })` | its `?auto` code turned into a function that resolves at `AUTO OK` or `STALL` | same | same | same (`dev.js`) | same | same | same | none yet |

## The tables each game fills in (`CHECK_TABLES`)

Every game: `cast`, `changes`, `given` and `drops`, `tagged`, `ages`, `intense`, `budget`, `lights` (the lights `faces` must check), `talkLevel` (0.3 unless the game's beds are quieter). Draft entries below are taken from the games' content and docs; each is to be checked against the game before it is relied on.

### Port Royal 1690
- `cast`: Abba, Kofi, Grace, Peter, Sam, Ned, Symon Benning, Constable Hart, Daniel Mendes, Emmanuel Heath; flashback crew (Henry Morgan, the quartermaster, Exquemelin, Will, Jack, Tom, Dick). Player Lewis Galdy keeps `galdy` before and after the quake, with `changes: [{ id: 'galdy', step: 'swim', field: 'colours' }]` if his clothes get wet-dark.
- `tagged`: the earthquake and the night after it (`night` for lines in the camp at night, if any).
- `ages`: `galdy: { born: 1659, seen: [[1690, 31], [1692, 33]] }` (journal: born 1659, died 1739 aged 80).
- `intense`: none needed (rule 4 holds); the quake has no card today.
- `budget`: `{ bytes: 30e6 }` (largest download).
- Rule 4: the sword drill (`Sword1`, `Sword2`) and the tavern fight (`Punch`, `Block`) and `JogStumble`, `StumbleBack` in the quake: the `rule4` check must see them only in the background, and Sword2 never past its fall.

### Marcus Garvey
- `cast`: `garvey: ['garvey1908', 'garvey1914', 'garvey1916', ...]` (one character, several bodies: list each body change in `changes` by chapter), Amy Ashwood, Amy Jacques Garvey, the printer, the sailor, the pressman, the steward, the student.
- `ages`: `garvey: { born: 1887, seen: [[1908, 21], [1914, 27], [1916, 29], [1920, 33]] }` (born 17 August 1887: check each chapter's year).
- `lights`: indoor and outdoor (its `?test=skin` already prints both).
- `intense`: none.

### Kendal 1957
- `cast`: `gran: ['gran', 'gran6', ...]`, `lloyd`, `dawn`, Mass Dudley, Mass Ezra (`ezra` and `mass ezra`: check one person or two), Miss Ruby, Mr. Clive, Nurse Gray, Sister Louise, Andre.
- `tagged`: chapter 6's night after the crash (`night`), the morning (`dawn`: "The sun is up").
- `given`/`drops`: the bucket in the water chain (`needs.do` with `carry: 'bucket'`).
- `intense`: the crash itself (chapter 5) if the owner wants a card there; today it has none.

### Bog Walk 1904 (adapter already written: `tools/checks/adapters/bog-walk.js`)
- `cast`: `zeke: ['zeke', 'zekeV']` with `changes: [{ id: 'zeke', step: 14, field: 'body' }]`; `rudy: ['rudy', 'rudy4']`.
- `tagged`: stage 14 "It is midnight" (`night`), the yard at dawn (`dawn`), the morning (`day`).
- `held`: the torch in the Tube.
- `lights`: `{ station: ['dusk', 'night'], yard: ['dawn', 'morning'] }`.
- `intense`: the water rising (chapter 3) if the owner wants a card.

### Nanny Town 1734
- `cast`: `mama: ['mama', 'mama3', 'mama4', 'mama5', 'mama5b', 'mama6']`, `quamin: ['quamin', 'quamin3']`, `cubbenah: ['cubbenah', 'cubbenah3', 'cub6']`, `beneba: ['beneba', 'beneba5', 'beneba6']`, Auntie Mimba, Phibba.
- `ages`: the child grows from about 1730 to 1740: `you: [[1730, 8], [1740, 18]]` (set the real numbers the journal uses).
- `tagged`: chapter 1 (night road: `night`), chapter 5 (the guns in the night: `night`).
- `intense`: chapter 5 (1734, the town taken) if the owner wants a card.
- Rule: Nanny never speaks. Add `nanny` to a `silent` list: the lint already shows she has no lines; keep it so.

### Eventide 1980
- `cast`: `gran: ['gran1', ...]`, `iris: ['iris1', 'iris3']`, `hyacinth: ['hyacinth2', 'hyacinth3']`, `maude`, `dora`, `nurse: ['nurse2', 'nurse3']` (Nurse Bell), the gateman, Kayla.
- `tagged`: chapter 4 (the fire, about 1 a.m.: `night`), "It is morning" (`dawn`).
- `intense`: the fire night (chapter 4) if the owner wants a card.

### Hurricane Melissa
- `cast`: Hattie (1951) becomes Gran (2025): `changes` by chapter; `pearl: ['pearl', 'pearlH', 'pearlA']`, `winston: ['winston', 'winstonA']`, `delroy: ['delroy', 'Uncle Delroy']`, `raymond: ['raymond', 'raymondA']`.
- `ages` (from the journal "you" page: Hattie aged ten in 1951, Pearl aged twelve in 1988): `hattie: { born: 1941, seen: [[1951, 10]] }`, `pearl: { born: 1976, seen: [[1988, 12], [2025, 49]] }`; add Winston and Delroy once their ages are set.
- `tagged`: each storm's night (`night`), the morning after (`dawn`).
- `intense`: the storm peaks (chapters with `storm.js` at full) if the owner wants cards.

### Tivoli
- `cast`: `ivy` (a girl in chapter 1, a grandmother in 2010: `changes: [{ id: 'ivy', chapter: 5, field: 'body' }]`), Miss Pearl, Mass Roy.
- `ages`: `ivy: { born: 1950, seen: [[1960, 10], [2010, 60]] }` (set from docs/games/tivoli.md once fixed).
- `intense`: `{ <every May 2010 stage>: 'may24' }` and `allowClips: { <those stages>: ['Block', 'Point', 'Terrified'] }` (rule 4's Tivoli exception: the card with "Read what happened instead" must come first; nobody is hit; the player holds no weapon).
- `budget`: as Kendal.

## Content lint settings (`tools/checks/<game>.json`)

- `real`: set for Port Royal (Henry Morgan, Exquemelin, Emmanuel Heath, Symon Benning) and Garvey (Marcus Garvey, Amy Ashwood, Amy Jacques Garvey). Add any other real speaker.
- `allowLong`: empty everywhere. Keep it to a few lines a game, each with a reason.
- `factsIgnore`: puzzle numbers (Port Royal's prices in reales) once the owner agrees.
- `budget.bytes`: the download budget the `size` check uses (default 30 MB).

## Order of work

1. Bog Walk: move `tools/checks/adapters/bog-walk.js` into `src/checktables.js`, call the real `clampWorld`, turn `?auto=` into `autoplay()`.
2. Nanny Town, Melissa, Eventide (same layout as Kendal, all have `?test=resume`, `follow`, `layout`).
3. Kendal (after the full pass now in progress).
4. Garvey, Port Royal (content in `main.js`; their `DEV` object is new).
5. Tivoli (needs a save first; its May 2010 table is the most important `intense` table).

Each game: wire, run `?test=all` at 390x800 and 667x375, fix until `ALL 0`, run `npm test` (the lint baseline must not grow; shrink it with `--update-baseline` after fixes), then open the pull request.

## First findings (15 November 2026, no game edited)

### Content lint (`node tools/lint_content.mjs --all`): 195 findings, all in `tools/checks/lint-baseline.json`

| Game | long | goal | dash | fact | journal | real | rule4 | total |
|---|---|---|---|---|---|---|---|---|
| Bog Walk | 0 | 15 | 0 | 1 | 0 | 0 | 0 | 16 |
| Eventide | 0 | 10 | 0 | 1 | 0 | 0 | 0 | 11 |
| Garvey | 5 | 16 | 0 | 2 | 0 | 3 | 0 | 26 |
| Kendal | 1 | 17 | 0 | 6 | 0 | 0 | 0 | 24 |
| Melissa | 1 | 12 | 0 | 3 | 0 | 0 | 0 | 16 |
| Nanny Town | 0 | 3 | 1 | 1 | 0 | 0 | 0 | 5 |
| Port Royal | 43 | 6 | 0 | 32 | 4 | 4 | 6 | 95 |
| Tivoli | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 |

- **goal (79):** two- and three-sentence goals in every game but Tivoli ("Find Rudy. He is by the house.", Garvey's "Well done! Chapter 2 is finished. Open Chapters for the next one.", Kendal's new `steps.js`). Rule 2 says one short sentence.
- **long (50):** Port Royal has 43 lines of 13 to 20 words (Abba, Kofi, Ned, Henry Morgan, the gunner); Garvey 5 of 13 words; Kendal 1 (Sister Louise); Melissa 1 (the end card, 18 words).
- **fact (46):** numbers the player reads that the game's facts doc does not contain. Port Royal's doc has almost none of its journal's dates (1659, 1668, 1688, 6,500 people, 2,500 enslaved, 213 ships...). Kendal: 1834, 1838, 1872, 1896, 30 July (Balaclava). Melissa: 30 November, 29 October, 9 November. Garvey: 27 June 1919, 100,000 shares. Nanny: 1655. Eventide: 1961 (a fictional dress date, probably fine: `factsIgnore`). Bog Walk: 81 cm.
- **journal (4):** Port Royal's Will, Jack, Tom and Dick speak but no page says they are fictional.
- **real (7):** real people who speak, for a person to check against the sources (rule 3: never invent quotes): Port Royal's Henry Morgan (20 lines), Symon Benning (6), Exquemelin (4), Emmanuel Heath (4); Garvey's Marcus Garvey (30), Amy Jacques Garvey (11), Amy Ashwood (4).
- **rule4 (8):** clips to check by eye: Port Royal `JogStumble`, `StumbleBack` (the quake), `Punch`, `Block` (the tavern), `Sword1`, `Sword2` (the drill: Sword2 must never be seen past its fall); Tivoli `Block` (cover poses, allowed behind its card).
- **dash (1):** `tools/nanny/readcheck.mjs` line 5 has a literal em dash in its own dash check: write `\u2014`.
- No speaker spelled two ways, no unknown sound names, no missing sound files in any game.

### Page checks (`node tools/checks_browser.mjs`, current builds on disk)
- **menu (MENU 1):** every game opens from the menu and "Main Menu" goes back in all 8. Tivoli has no `#jhome` (Main Menu in its journal).
- **errors (ERRORS 0 on load):** no script errors or failed files on any title screen. One gap seen in the Bog Walk run: no game page has a `<link rel="icon">`, so every game asks for `/favicon.ico` and gets a 404 (the menu has one).
- **a11y (A11Y 5 at 390x800):** all 8 title screens pass (48 px buttons, readable text). The menu: "About this platform", "Get updates" and "Created by Kellz 5.0" are 40 px tall (need 44); the "New" tag and "Go there" are contrast 3.44 (need 4.5).
- **size (SIZE 0):** before Start is ready: Port Royal 11.7 MB, Melissa 6.5, Eventide 4.2, Kendal 4.2, Garvey 3.8, Nanny 3.5, Bog Walk 2.8, Tivoli 1.4 (budget 30 MB).
- **fixtures:** `PASS 7 accessibility fixtures`.

### Bog Walk through the runner (`harness bog-walk`, dev build, 667x375): ALL 17, then steps alone ALL 2
- journal 0, links 0, keys 0, chapters 0 (all six open), map 0 (5,404 probe points: nobody leaves the map or gets stuck), budget 0 (headless numbers), camera 0, rule4 0, continuity 0, steps 0 (every outdoor step: targets reachable, save and resume give back the step, goal, place and people).
- a11y 1: the journal tab "Who is real?" is 40 px tall.
- faces 13: `osborne` (brightness 66 to 70) and `minister2` (69 to 74) are under the readable line (75) at the station, in Kingston and the yard; `rudy4`, `hammond` and `haggart` had no face to measure (their hats or hair cover the forehead and cheek spots, or they face away): look at them in `?shot=` views and add `?test=skin` to Bog Walk.
- errors 2: the `/favicon.ico` 404 above.
- Not run: `autoplay` (its `?auto=` must become a function), `sound` (`AU` is not in Bog Walk's `DEV` object).
