# Port Royal 1690: the game guide

Everything you need to pick up work on Port Royal in a new chat. Read `CLAUDE.md` and `docs/ARCHITECTURE.md` first.

- Code: `games/port-royal/src/main.js` (one large file; search for the `/* ---------- name ---------- */` section headers).
- Page and styles: `games/port-royal/site/index.html`.
- Packed models: `games/port-royal/site/models/*.js`. Source `.glb` files: `games/port-royal/assets/`.
- Build: `node tools/build.mjs port-royal --dev` (test views and autoplayer) or without `--dev` (public).
- Live: on Vercel from `main` (see `docs/PUBLISHING.md`), and the claude.ai artifact `2869be7e-61df-45c3-a18e-bd4f53a9798e`.
- Teacher guide: claude.ai doc `0b724c26-247a-4a67-9ae3-03b53ba6507d`.

## The story

The player is **Lewis Galdy** (real: a French Huguenot from Montpellier, swallowed by the 1692 earthquake, thrown back into the sea, rescued, lived to 1739). Six chapters, chosen from the Chapters menu. Progress saves in the browser (`saveGame`, local storage).

| # | Year | Chapter | What happens | Ends when |
|---|---|---|---|---|
| 0 | 1690 | Arrival | Walk the pier into town. Meet Abba. Go into her tavern, The Turtle, buy stew, find 4 objects, hear old Ned's story, walk to Fort Charles. | the forts page unlocks |
| 1 | 1670 | Ned's story: Morgan's men | A flashback: you play young Ned, first person only. Meet Henry Morgan on the pier, talk to the quartermaster, watch a sword drill, load crates into a boat. Exit button any time. | 3 crates loaded |
| 2 | 1691 | The warehouse | Galdy's warehouse: check cargo (sugar, cocoa, logwood), sit at the desk and give change, weigh a clipped coin, talk to Abba, read a letter from a slave ship's captain. | the letter is read |
| 3 | 7 June 1692 | The earthquake | A hot morning, the shock, the town sinks, Galdy is swallowed then thrown into the sea, swim to the boat. | you reach the boat |
| 4 | 1692 | The days after | The survivors' camp: Abba, the Reverend Emmanuel Heath preaching in a tent, the edge of the water. Stay or leave for what becomes Kingston. | the choice |
| 5 | 1739 and today | The tombstone | St Peter's Church yard. Read Galdy's tombstone, with its real inscription. | the tombstone is read |

`CHAPTERS` (in main.js) holds each chapter's `go()` and `done()`. `fbReset()` cleans up the flashback when you leave it or pick another chapter.

## Places and coordinates

The world is metres; y is up; `yaw = 0` looks toward -z. `state.place` says where you are, and `clampPos()` keeps you inside each place.

| Place | `state.place` | Where |
|---|---|---|
| Main street and harbour | `out` | street along z = 0 from x = -17.9 (`X0`) to 17.9 (`X1`); houses at z = ±5.2 (`S`); shore at x = 23 (`SHORE`); the pier runs east from the shore; you start at x = 43 |
| The new street (market, Jews Street, prison) | `out` | `NS`: z 13.6 to 23.2, centre z = 18.6, from x = -7.5 to the harbour corner; entered from the harbour corner at x about 18 to 21, z about 13 |
| Fort Charles | `out` | centre (50, -30) (`FC`), reached along the quay (x about 22) and the sand spit (`SPIT`) |
| Tavern inside | `in` | `IN`: x -205 to -195, z -3.5 to 3.5; the door outside is at (-6.18, -4.5) |
| Warehouse | `ware` | x about -260 to -248 (`WX0`, `WX1`) |
| The sea (earthquake) | `sea` | x from `SHORE + 4`, z 9 to 75 |
| Survivors' camp | `after` | the ruined street, tents in `CAMP_TENTS` |
| Church yard | `yard` | `YX`, `YZ` offsets |

## Characters

Fictional characters say so on their journal page (owner rule 3).

| Who | Real or fictional | Where | Model |
|---|---|---|---|
| Lewis Galdy (you) | real | everywhere | `galdy` (third-person view with V); walks with the shared `Walk` clip, paced to his speed |
| Abba, tavern keeper | fictional (stands for the free Black people of Port Royal) | by the tavern door (-5.2, 0.9) | `abba` |
| Old Ned, retired buccaneer | fictional | tavern table, sitting | `ned` |
| Kofi, enslaved dockworker | fictional | carries crates from the stack at (19.4, 3.1) to the pier | `kofi` |
| Symon Benning, pewterer | real family of pewterers | main street | `benning` |
| Sam, sailor | fictional | main street | `sailor` |
| The Reverend Emmanuel Heath | real (rector of St Paul's) | camp, and the earthquake day | `heath` |
| The gunner | fictional | Fort Charles | `gunner` |
| A soldier of the garrison | fictional, no dialogue | walks the main street into the tavern, comes out, walks to Fort Charles and back | `soldier` (buff coat, half-pike) |
| Henry Morgan | real | flashback, on the pier | `morgan` |
| Quartermaster, buccaneers | fictional | flashback beach | `buc1`, `buc2` |
| Alexandre Exquemelin, surgeon | real (wrote *The Buccaneers of America*) | flashback | |
| Grace, market seller | fictional | fruit stall (9.6, 16.1), stays put, gestures now and then; asks a sum quiz | Abba's body recoloured, basket on her head |
| Peter, turtler | fictional | turtle crawl, harbour corner | `turtler` |
| Daniel Mendes, merchant | fictional | Jews Street, strolls by the synagogue | `mendes` (blue coat) |
| Constable Hart | fictional | strolls the new street | `constable` |

People who stroll use `STROLL` (paths per id); they stop and face you within 3.6 m. The soldier uses `SOLDIER` (one path, walked both ways, hidden while inside the tavern or fort).

## Systems (search these names in main.js)

- **Actions**: `ACTIONS` is a list of `{ label, r, where(), go() }`. `where()` returns `[x, z]` when the action is available. The nearest one in range shows the Talk/Look button.
- **Talking**: `startConvo(lines, onEnd)`, `showStep`, `advance`, `leaveTalk`. A line is `{ who, text, anim?, choices?, unlock? }`. Player lines use `who: 'You'` and get the light box. The ×, Escape, or a tap outside ends a talk early, with no reward, so you can come back.
- **Later lines**: `npcTalk` and `nsTalk` give different short lines on repeat visits (`state.ch.seen`, `state.ch.heard`).
- **Journal**: `JOURNAL` pages, each `{ id, title, simple: [...], deeper: [...] }`. Every id must be unique. `unlock(id)` adds a page.
- **Goals**: `setGoal()` for chapter 0; chapters set `goalText` and call `showGoal()`.
- **Helper arrow**: `NUDGE` and `NUDGE_MAP`. If you stand still 15 s, or a goal does not change for 50 s, the goal pops open and pulses, and a gold arrow shows the way: pointing down at the target with "Here!" when it is in front ("Look down" or "Look up" when it is off the top or bottom of the screen), or a big "This way" arrow at the left or right edge when you need to turn. Add a row to `NUDGE_MAP` for every new goal: `[goal regex, action-label regex or [x, z]]`.
- **Next chapter card**: when a part of the story finishes, `nextChapterCard(i)` offers "Next chapter" or "Stay here" on screen (the same idea as Garvey). It is called a few seconds after the Arrival goals are done, and when the flashback ends. It waits while a panel, dialogue or card is open and gives up after about 8 s, so it never takes over something the player is reading. A card that is waiting is dropped if the player has since gone to a chapter (`navGen`, which `playChapter` bumps), so it never interrupts the warehouse or another chapter. The `?shot=nextcard` test view shows it; `?shot=navcard` jumps to the warehouse before the card is due and writes the card titles seen to the page title (add `&stay=1` for the control run, where the card should appear).
- **Controls**: `MV` (easing, wall sliding), Shift to hurry, `padRead` (gamepad), touch joystick (left), drag to look (right), tap-to-walk is mouse only.
- **Solid things**: everything added to the scene after `nStreet` in the harbour section becomes solid (`streetProps`, `buildPropC`). People are solid through the list near the end of `clampPos` (Abba, `NPCS`, `NS_PEOPLE`, the soldier).
- **Menu link**: `MENU` checks whether `../../../menu/` exists; if it does, the "Main Menu" button shows on the title screen, in the Journal and in the restart panel.
- **Per-frame hooks**: `TICKS.push((dt) => ...)`.
- **Sounds**: `engine/audio.js`; `footstep()` picks the floor kind.
- **Earthquake**: `Q` (phases calm, tremor, sink, sea).
- **Flashback**: `FB`, `FBP` positions, `LOAD` crate loading.

## Test views (dev build only)

Open `games/port-royal/site/index.html?shot=<name>`. Useful ones: `ns1` to `ns9` (new street), `nsst1`, `nsst2` (stalls), `nsmen` (Mendes), `nsback` (harbour corner), `sold1`, `sold2` (the soldier), `nudge`, `nudge2` (helper arrow), `meline` (a "You" line), `leave` (ending a talk early), `thumb` (a clean picture for the menu card), `walkcheck`, `pad`, `move`, `fbquit`. The autoplayer: `?auto=0&one` plays chapter 0 and logs to the page title. See `docs/TESTING.md`.

## The helper arrow

If you stand still or stall, the Goal tab opens and a gold arrow points at the next thing to do (`nudgeTarget`, `NUDGE_MAP`). Outside, the main street and the new street are walled off from each other by houses and both open only onto the harbour strip at the east end, so `nudgeStep` first points the arrow along the way out ("This way") and only says "Here!" when there is a clear way to the goal. Dev check: `window.__nudgeTest(playerX, playerZ, goalX, goalZ)` returns `[x, z, isGoal]`. If you add a place with walls inside it, give it a rule in `nudgeStep`.

## History sources used

- John Taylor's description of Port Royal, written after his visits in 1687 and 1688: the markets, prices (a watermelon one real), turtles and crawls, the town's streets.
- The Reverend Emmanuel Heath's two letters of 22 and 28 June 1692, *A Full Account of the Late Dreadful Earthquake at Port Royal* (printed 1692).
- A letter from the day of the earthquake, quoted in histories of Jamaica's Jews (for example Arbell, 2000), saying the synagogue fell beside the writer as he turned into Jews Street. Sources name the writer "Edmund Heath"; the game does not name him.
- The 1677 deed for land on New Street (also called Jew Street) for a synagogue.
- The 1672 complaint of English merchants against Jewish traders, and the extra tax on Jews in Jamaica from the 1690s.
- Galdy's tombstone at St Peter's Church, Port Royal: the game shows its real wording.
- Alexandre Exquemelin, *The Buccaneers of America* (1678): Morgan, the articles, Panama.
- Church records of free Black people in the 1670s (for example Peter Moore and Black Betty, married 1677).
- Archaeology of the sunken town: onion bottles, pewter with the Benning mark, clay pipes, the stopped watch (11:43).

## Known issues and backlog

- `models/anims.js` is about 1 MB. It could be split by chapter.
- Galdy's own walk has a slight heel flick. A male Mixamo walk would fix it.
- Grace is Abba's body recoloured. `npc.py` makes men only; a women's generator (bodice, skirt, head wrap) is needed for more women and for the Garvey game.
- Talking, journal, chapters, saving, controls, strolling and the helper arrow still live in main.js. Move each into `engine/` when a second game needs it.
- When adding a goal, add its `NUDGE_MAP` row, or the helper arrow cannot point the way (the goal still pops open).
