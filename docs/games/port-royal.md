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
| Abba, tavern keeper | fictional (stands for the free Black people of Port Royal) | by the tavern door (-5.2, 0.9); she stays outside | `abba` |
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
- **Next chapter card**: when a part of the story finishes, `nextChapterCard(i)` offers "Next chapter" on screen after a short pause (no "Stay here"; `engine/chapter-end.js`) (the same idea as Garvey). It is called a few seconds after the Arrival goals are done, and when the flashback ends. It waits while a panel, dialogue or card is open and gives up after about 8 s, so it never takes over something the player is reading. A card that is waiting is dropped if the player has since gone to a chapter (`navGen`, which `playChapter` bumps), so it never interrupts the warehouse or another chapter. The `?shot=nextcard` test view shows it; `?shot=navcard` jumps to the warehouse before the card is due and writes the card titles seen to the page title (add `&stay=1` for the control run, where the card should appear).
- **Controls**: `MV` (easing, wall sliding), Shift to hurry, `padRead` (gamepad), touch joystick (left), drag to look (right), tap-to-walk is mouse only.
- **Tap to talk** (19 November 2026): a quick tap or click on a person you could talk to right now starts that talk, with the same `go()` as the talk button (`tapTalk` in `src/main.js`, using `pickPerson` from `engine/tap.js`). Only the "Talk to" actions on offer count, each within its own reach `r`; a tap that closes a talk never opens another. A mouse click that is not on such a person still walks there.
- **Solid things**: everything added to the scene after `nStreet` in the harbour section becomes solid (`streetProps`, `buildPropC`). People are solid through the list near the end of `clampPos` (Abba, `NPCS`, `NS_PEOPLE`, the soldier).
- **Menu link**: The "Main Menu" button links to `../../../menu/` from the title screen, Journal and restart panel. It remains available while models load and does not depend on a network probe or the platform name. Title controls use `shared/title.css`, with no creator credit and with the loading bar retained.
- **Per-frame hooks**: `TICKS.push((dt) => ...)`.
- **Sounds**: `engine/audio.js`; `footstep()` picks the floor kind.
- **Earthquake**: `Q` (phases calm, tremor, sink, sea).
- **Flashback**: `FB`, `FBP` positions, `LOAD` crate loading.

## The people's bodies

Every man is built from his recipe in `tools/people/<name>.json` by `tools/garvey/era.py` and packed by `tools/people/pack.mjs` (how to rebuild: `docs/PIPELINE.md`, section 1; the rules for every game: `docs/PEOPLE.md`). Skin is drawn as built (`SKIN_K = 1.0` in `main.js`), because this game's light is brighter than Kendal's. Dress is 1690: shirt with a neckband, cravat, coat with skirts and cloth buttons, full breeches gathered below the knee or sailor's slops, stockings, buckled shoes, broad felt hats, knitted caps. Do not modernise it. The real people (Galdy, Morgan, Heath) have the same faces and colours as before; only the build quality of their clothes changed.

Neckbands (21 November 2026): the working men in shirts without a sleeved coat (the sailor, `buc1`, `buc2`, Ned, the turtler, Kofi, and Benning under his sleeveless coat) wear a narrow neckband over a short slit, worn open in the heat. Shirts of the time were cut from rectangles and gathered into a neckband, for gentlemen and labourers alike, and the shape barely changed from the 1500s to the mid-1800s (V&A shirt c. 1697 to 1702, collections.vam.ac.uk/item/O366237; Colonial Williamsburg shirt 1775 to 1790, emuseum.history.org/objects/42096). The band is now built by `tools/garvey/neckwear.py`, sewn to the shirt (before, it was ragged and showed gaps at the back). Men with cravats (`bands`) are unchanged.

Check a body in the game's own light with `?shot=sheet&who=galdy&clip=Walk&zoom=full|top|legs` (standing and three moments of the clip, each from the front, side, back and three-quarter; `&it=0.25,0.75` shows the standing clip at those moments instead). Then run `?test=cloth` (no layer shows through another) and `?test=held` (carried things are at the hand and clear of the body).

## The boats (17 November 2026)

The owner asked for more detail on the boat that rescues Lewis Galdy. All three small boats are now built by `rowBoat` in `engine/boats.js` (see `docs/ENGINE.md`):

- **The rescue boat** (`buildSeaProps` in `main.js`, 5.2 m long, 1.7 m wide): a plain clinker-built harbour boat, the kind a ship's boat or a wherry was. It has overlapping planks, a keel, stem and stern posts, a transom, ribs, a gunwale and rubbing strake, four thwarts, bottom boards, thole pins, two oars, a rudder with a tiller, a coil of rope and a bailer. It was a flat-topped slab before. The tombstone says only "a Boat", so it has no name and nothing fancy.
  - The boat now comes to you **bow first** (it used to slide stern first), and turns toward you smoothly.
  - Abba sits on a thwart facing the bow (`BOAT_SEAT`), with the oars in thole pins in front of her. The oars swing while the boat moves (`rowStroke`). She has no rowing animation yet: her hands rest in her lap.
  - The sea no longer shows inside the boat: the boat has a depth-only mask and `waves.renderOrder = 2`.
  - Cost: the sea scene went from 41 to 43 draw calls and from about 37,000 to 43,500 triangles.
- **The boat on the beach** (harbour section): the same builder, oars lying in it, rudder unshipped. It went from 9 meshes to 3.
- **The ship's boat in Ned's story** (`loadBuild`): it was a plain box, and it sat inside the merchant ship's hull where only a sliver showed. It is now a real boat in the open water on the other side of the pier (`LOAD.drop` moved to `[SHORE + 9.2, 1.15]`), and the crates go on its bottom boards.
- Sources for the look: Port Royal had wherries (John Taylor names the Wherry Bridge, 1688); small English working boats of the time were commonly clinker-built and rowed with oars in thole pins. The boat is a general picture, not a copy of a recorded boat.
- **To view:** Chapters, "The earthquake", or `?shot=swim` in a dev build. `node build/vehicles/pr_shot.mjs after` saves close-up pictures of all three boats to `build/vehicles/port-royal/`.
- Not done: the fishing canoe on the spit and the two packed ship models are unchanged.
- Layout fix, same day: at 390 x 800 the round talk button sat on top of the controls hint when the hint wrapped to two lines (`?test=layout`). On narrow screens the hint now gives way while the talk button shows (`index.html`, the `max-width:520px` rule). At 667 x 375 the layout test still reports 4 overlaps (the top-right buttons and the goal over dialogue choices and cards); they were there before this change and are not fixed yet.
- **The fishing canoe on the spit** (17 November 2026, the last plain boat): a dug-out canoe cut from one log (`dugOut` in `engine/boats.js`), 4.8 m by 1.1 m as before, with ends that curve up, solid end decks, adze marks inside, a seat board, two paddles, a calabash bailer and a painter coiled on the bow deck. Canoes like this were the island's fishing boats from Taino times. It was half a squashed sphere with two boards and a pole: 4 meshes, about 350 triangles; now 2 meshes, about 3,800. Same place, turn, collision circles and `DEVBOATS.canoe`. Pictures: `node build/vehicles/pr_canoe.mjs <tag>`.
- **The packed ships** (the merchant ship and the sloop in `site/models`) were left alone: they are made in Blender, and adding loose code-built parts round a packed model would not line up with its hull.

## Test views (dev build only)

Open `games/port-royal/site/index.html?shot=<name>`. Useful ones: `ns1` to `ns9` (new street), `nsst1`, `nsst2` (stalls), `nsmen` (Mendes), `nsback` (harbour corner), `sold1`, `sold2` (the soldier), `nudge`, `nudge2` (helper arrow), `meline` (a "You" line), `leave` (ending a talk early), `thumb` (a clean picture for the menu card), `walkcheck`, `pad`, `move`, `fbquit`. The autoplayer: `?auto=0&one` plays chapter 0 and logs to the page title. See `docs/TESTING.md`.

## The helper arrow

If you stand still or stall, the Goal tab opens and a gold arrow points at the next thing to do (`nudgeTarget`, `NUDGE_MAP`). Outside, the main street and the new street are walled off from each other by houses and both open only onto the harbour strip at the east end, so `nudgeStep` first points the arrow along the way out and only points at the goal itself when there is a clear way to it. The arrow is the shared gold arrow on the ground with a ring round the goal (`engine/guide.js`). Dev check: `window.__nudgeTest(playerX, playerZ, goalX, goalZ)` returns `[x, z, isGoal]`. If you add a place with walls inside it, give it a rule in `nudgeStep`.

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
- Abba is a builder body (`tools/people/abba.json`), and Grace is her body in Grace's colours (see `docs/PIPELINE.md`, section 1). `?shot=grace` looks at Grace's stall.
- Port Royal has `?test=held`, `?test=cloth` (34 lines, 390 points on 14 November 2026), `?test=skin`, `?test=walk` and `?test=collision` / `?test=seating`. The full place audit (`?test=audit`: floating things, people inside solids or each other) and the layout test (`?test=layout`) are not wired yet. See `docs/STANDARD.md`, "Where each game stands".
- Talking, journal, chapters, saving, controls, strolling and the helper arrow still live in main.js. Move each into `engine/` when a second game needs it.
- When adding a goal, add its `NUDGE_MAP` row, or the helper arrow cannot point the way (the goal still pops open).

## Facts the player reads, with sources (checked November 2026)

The content lint (`node tools/lint_content.mjs --game port-royal`) asks for every year and number the player reads to be written here with its source.

- Lewis Galdy: born in France in 1659; died at Port Royal on 22 December 1739, aged 80, so he lived 47 years after the 1692 earthquake. His tombstone (wording shown in the game) first stood at Green Bay across the harbour and was moved to St Peter's churchyard in 1953. As churchwarden he oversaw the new St Peter's Church, finished in 1725 to 1726. Sources: the tombstone; Jamaica Gleaner, "Lewis Galdy cheated death twice" (25 October 2024); Jamaican Ancestral Records, St Peter's Anglican, Port Royal; The Appendix, "The Man who was Buried Twice" (2014).
- The town in 1692: about 6,500 people, about 2,500 of them enslaved Africans (Pawson and Buisseret, *Port Royal, Jamaica*). In 1688, 213 ships called at Port Royal, against 226 for all of New England (Zahedieh; quoted by the Port Royal Project, Texas A&M).
- Archaeology: Donny Hamilton's Port Royal Project dug under water from 1981 to 1990. Onion bottles came up sealed after more than 250 years. In one building about 25 pewter plates lay stacked; Port Royal holds the largest collection of late 1600s pewter. Simon Benning was working as a pewterer in Jamaica by the 1660s, followed by his son Symon (Gotelipe-Miller, *Pewter and Pewterers from Port Royal*, 1990).
- The watch: found by divers in 1959 (Edwin Link's expedition), made in Amsterdam about 1686 (Paul Blondel), stopped at 11:43.
- Slavery and law: the Royal African Company held the English slave trade to itself until 1698. Laws against free Black people grew harsher in the 1700s.
- Morgan: Portobelo 1668, Maracaibo 1669, Panama taken in January 1671; arrested and sent to England in 1672, knighted in 1674, back in 1675 as Lieutenant Governor; died 25 August 1688, and the ships fired 22 guns (Exquemelin; Pawson and Buisseret). By the 1680s the government hanged pirates. Exquemelin's book came out in English in 1684; Morgan sued the publishers and won 200 pounds. The articles paid 600 pieces of eight for a lost right arm (Exquemelin, *The Buccaneers of America*, 1678).
- Fort Charles: begun in 1655; its guns were raised from 10 to 36 in 1667 (the gunner says 36 big guns); the only Port Royal fort to survive 1692 (Jamaica National Heritage Trust).
- Prices and the quizzes are puzzles, not records (the cocoa sale for 20 reales is a sum to work out); see the "prices" journal page.

## Owner rule 3 and the real people who speak

Henry Morgan, Alexandre Exquemelin, the Reverend Emmanuel Heath and Symon Benning speak in the game. Their lines are short paraphrases of facts from the sources above (Morgan's papers from the governor, the vote that made him leader, the fire ship at Maracaibo, Panama; Exquemelin as surgeon and writer; Heath's letters about sleeping on a ship and caring for the sick; Benning's trade and mark). None is a real quotation, and the credits say so ("their words in this game are fictional"). Rule 3 says never invent quotes for real people: whether these paraphrased lines may stay is for the owner to decide (see the November 2026 review in the report). Fictional people: Abba, Kofi, Sam, Ned, Grace, Peter, Daniel Mendes, Constable Hart, Will and Jack (the tavern), Tom and Dick (the drill), the quartermaster, the gunner; each has a "fictional" note in the journal.

## Look-alikes (17 November 2026)

`?test=audit` (`checks.js`, `placeAudit`) now runs the look-alike check (`faceCheck`, `engine/faces.js`) on everyone shown in a place: two people with one body and face within 2.5 m. It reports 0 in all seven places, before and after, so nothing was changed. The townsfolk, the 1670 buccaneers and the camp's survivors are recoloured copies of story bodies placed by hand, and the nearest two of one body are 2.9 m apart (two men on Kofi's body in the camp) and 3.7 m (two buccaneers on the sailor's body). Keep copies of one body at least that far apart; if one must stand closer, give that recipe `"variants"` (`docs/PEOPLE.md`, section 5b). `?test=audit&faces` lists each person's body. The other 5 lines of `?test=audit` (Grace and a camp person at a walking wall, Kofi's route past furniture) are from before this change.

## Audit 0, the market stall (17 November 2026)

- `?test=audit` is wired (`checks.js`, `placeAudit`) and reports **0** in all seven places. (An older line above says it is not wired; that is out of date.) Kofi now starts 30 cm clear of his crates, so his route no longer touches them. A person counts as "inside a walking wall" only when there is no walkable ground within 40 cm (`offWall`): the walking walls here are half-metre grid rows that include the player's own margin round every prop, so a seller right behind her stall was flagged without touching anything.
- Fruit floated over the basket floors. `heap` now builds a real pile, ring by ring and layer by layer, resting on the floor; the pineapples stand on the floor and the watermelons sit on the cloth.
- The plantains hanging from the stall frame were a row of thick sticks. Each hook now holds two hands of plantains on a cord, after a photograph the owner supplied: six or seven long curved fingers joined at a crown, hanging down and fanning out, with a thin neck and a tight narrow tip, a ripe yellow hand over a green one.
- The fruit on Grace's stall, checked on 17 November 2026 against period writers as quoted on piratesurgeon.com (pages "prov_jamaica2" and "prov_jamaica3", which cite the printed editions):
  - Watermelons: John Taylor, 1687, says they were "sold at Port Royall for a royall apeice".
  - Pineapples: Taylor calls the pineapple "the king of all fruites yet known"; Richard Blome (1672) lists "Pines".
  - Oranges and limes: Blome (1672) lists both; Taylor says limes were valued for their juice, to make punch.
  - Plantains: Blome (1672) lists them; Hans Sloane (in Jamaica 1687 to 1689) calls them the "most general support of Life in the Island".
  - Carrots (on the herb stall): Taylor says carrots grew small and were sold very dear at Port Royal market.
  These are quotations seen on a secondary page, not in the books themselves. Before any of them goes into the journal as a quotation, read it in the edition (Taylor: *Jamaica in 1687*, ed. David Buisseret; Sloane: *A Voyage to the Islands*, 1707).
- The audit does not yet catch small things floating inside a basket. A check for this is work to do.

## The tavern (17 November 2026)

- Old Ned sat facing the table and his hands went through it when he talked. He now sits on the near bench with his back to the table, facing the room and the fire (`TAV.ned`). Held 0, audit 0.
- The hearth fire was two plain cones. It is now seven tongues of flame (soft painted teardrops, two crossed sheets each, flickering on their own) over red embers, charred logs and ash.
- The dust motes were hard white squares; they are soft and round now.
- The pineapples are barrel-shaped with diamond eyes and a crown of long arching leaves.

## Heads do not spin (17 November 2026)

The owner saw the pewterer's head on backwards on a phone. People near you turn their heads toward you: a turn added on top of the clip's pose each frame. The animation mixer only writes a bone again when its clip value changes, so on a still head track the turns piled up and the head went right round (measured: the pewterer and the sailor reached 171 and 179 degrees from the chest). `turnBone` in `main.js` now remembers what the bone was before its turn and puts it back if it finds the bone untouched (now 35 degrees at most). The shared crowd code (`engine/ambient.js`), Kendal, Tivoli and Selassie already had this guard; Port Royal's own look code did not.

New check: `?test=heads` (`checks.js`, `runHeads`) stands you in front of and beside each person in every place and watches every head with `engine/audit.js` `headWatch`. `&p=tavern` runs one place. The town takes several minutes.

Also: the name and talk button over a person now stay below the goal's words (they sat on top of them when you looked up at someone from close by).

## Toast and goal on a phone (17 November 2026)

- The toast sits just above the action button, however tall the button is (`placeToast`), and wraps its words; a long line also stays up longer. On a phone, Abba's "Not in my tavern, boys! Take it outside!" was cut short and then covered by the two-line "Go back to the street" button.
- The goal is hidden while a card is open (at 320 px wide it lay across the card's top edge).
- The layout test has a case for a long toast over a two-line button. It passes at 320x640, 390x800 and 1280x720.
- Publishing: Vercel builds every push to `main` with `npm run dist`. To see whether the live site has a change, fetch its `games/<game>/site/app.js` and compare it with `dist/` after `npm run dist`. A phone may show the old page until it is reloaded.

## The way out waits (17 November 2026)

"Go back to the street" came up the moment you stepped into the tavern, because you arrive at the door. It and "Go out to the wharf" are marked `exit: true` and use the engine's `exitReady` (`docs/ENGINE.md`): the button appears once you have walked into the room, or after 7 seconds. The head-turn guard is the engine's `lookBegin` and `lookEnd` now.

## Doors (17 November 2026)

The owner: "this doesn't look like a door", then "the doors should fit their purpose, not one shared one". Every door made in code is now `prDoor` in `main.js`, set for its building. It follows English joinery of the later 1600s: an outer door of upright boards on ledges and braces, hung on long iron strap hinges, or, for a better building, a panelled door (stiles and rails round a low panel, a short frieze panel and a tall top panel). No photograph or plan of these particular Port Royal doors survives, so each is a reasonable stand-in for its kind, not a copy of a known door.

| Building | Door | Why |
|---|---|---|
| The Marshalsea (prison), new street | one leaf of boards and braces, rows of nail heads, a barred spy-hole, a box lock, an iron ring | a lock-up door of the time was made to be hard to break |
| The synagogue, new street | a pair of panelled doors on the step, ring handles | a public building in brick, the better kind of door |
| The powder magazine in Fort Charles | boards and braces with copper fittings and a box lock, no ring | magazines used copper fittings so nothing could strike a spark |
| St Peter's Church, churchyard | a pair of ledged and braced doors under a white transom bar, long scrolled strap hinges, a ring; over them a **glazed fanlight** fills the round head of the arch (white glazing bars radiating round a small half-round); the arch surround stands out past the stone base band | the fanlight follows the church as it stands today (see Sources below). The leaves stand open inward in every photograph found, so their face is still a stand-in |

The town houses (the packed `h1` to `h6`, `tools/blender/street.py`) already have their own modelled doors (cut into the wall, frame, strap hinges, latch, step) and were not changed. The tavern's street door (inside) and the warehouse's wharf doors were already boarded with straps and were not changed.

**Fort Charles gate** (`buildFort`, `main.js`): the two open leaves are now nine upright boards each, with three ledges and strap hinges on the back, folded flat against the sides of the gate passage just inside the outer arch. Before, each was one plain block set mostly inside the masonry, so it could hardly be seen. Same size (1.4 by 2.0 m), and they stay outside the walking strip of the gate.

### Sources checked for the doors (17 November 2026)

The owner asked for the doors to be checked against photographs of the time. For Port Royal before 1692 there are none, and no drawing, plan or written account of these particular doors was found. What was found:

| Door | Source | What it shows | What was done |
|---|---|---|---|
| St Peter's west door | Photographs of the church today, *Jamaica: Port Royal, St Peter's Anglican Church*, travel2unlimited.com, March 2024 (https://travel2unlimited.com/?p=320648), outside and inside | a round-headed doorway in a white moulded surround; the head of the arch is a glazed fanlight with white glazing bars radiating round a small half-round, over a transom; the doors open inward and are not seen face on | the boarded arch head became a glazed fanlight. The fanlight may be later than 1725 (not dated) |
| St Peter's | Daily News photograph, September 1973, National Library of Jamaica (https://nljdigital.nlj.gov.jm/items/show/10524) | the church from the street; the door is not seen | nothing to change. The church itself was rebuilt in the game on 18 November 2026: see "St Peter's Church" below. |
| Fort Charles gate | Photograph *Fort Charles, Port Royal 1955*, National Library of Jamaica (https://nljdigital.nlj.gov.jm/items/show/8215); also https://nljdigital.nlj.gov.jm/items/show/8214 | a round brick arch; a pair of tall leaves of upright boards stands open, folded back in the arch | the leaves became upright boards and were moved flat against the passage sides. The 1955 gate is not proven to be the 1690s one; it is the best evidence found |
| Powder magazine | *Gunpowder magazine*, Wikipedia (https://en.wikipedia.org/wiki/Gunpowder_magazine); no Port Royal source | magazines avoided iron fittings so nothing would strike a spark; copper and bronze were used | kept (copper fittings, no ring) |
| Marshalsea, synagogue | Port Royal underwater excavations (Institute of Nautical Archaeology and Texas A&M, 1981 to 1990, https://nauticalarch.org/projects/port-royal-harbor-excavation/) | no published door or door hardware was found in what could be searched | kept as stand-ins of English joinery of the later 1600s (work to do: the excavation building reports) |

## St Peter's Church (rebuilt in the game, 18 November 2026)

The church in the last chapter was drawn as red brick with a squat west tower and a cupola. The sources show otherwise, so it was rebuilt:

| What the game shows | Source |
|---|---|
| Walls in a pale cream render scored to look like stone blocks, over the brick | Jamaica National Heritage Trust, "St. Peter's Church" (jnht.com): "Its walls are now faced with cement marked to simulate stone blocks, thus hiding the original brick walls of the Church." Photographs of the outside, travel2unlimited.com, March 2024. |
| No tower; the bells in a separate timber frame in the churchyard | Victorian Web, "Anglican churches in the West Indies": "It has no tower; the bells being rung from a separate frame in the churchyard." The 2024 photographs show no tower. |
| A steep gable at each end with a white coping and a small cross at the top; a grey slate roof; round-headed windows with white glazing bars; the door under a round-headed fanlight in the west gable | The 2024 photographs. |

Not from a source: the exact shape and place of the bell frame (no picture of it was found), and the lower side wing with a hipped roof seen in the photographs, which the game leaves out.


## Performance (18 November 2026)

Still scenery is now drawn in a few pieces (`still()` in `main.js`, which calls the engine's `batchStatic` from `engine/batch.js`). It looks the same; only the number of draw calls changes.

- What is merged: the pier (planks, piles, braces, rope rings, the gangplank), each cask and crate on the quay and in the street, each market stall, building, the stocks, the signpost, the crawl's stakes and the beach strip of the new street, the whole of Fort Charles with the spit and Morgan's Line, and the tavern room.
- What is not: anything that moves, flickers, or is shown and hidden on its own (the turtles, the market bell, the fort's guns, which run out for the salute, its flag, the canoe, the hearth fire, the candle flames, the four finds, the stew), every see-through mesh (sea foam, window light, lantern glass, path decals), every packed model's mesh (their points are quantized, and merging them broke a house), all people, the ships, and the town's houses, which the earthquake moves, tilts and sinks one by one.
- The walking boxes of the casks and crates (`buildPropC`) are taken from the unmerged pieces, before they are merged.
- The place audits (`?test=audit`, `collision`, `seating`) see the scenery unmerged, because they read each piece's own shape. `?nobatch` turns merging off in a dev build to compare.
- Draw calls, before and after (headless, 390 x 800): title 486 to 256; `ns1` 628 to 191; `nsst1` 157 to 127; `ns7` 148 to 114; `tav` 92 to 49; `fort` 407 to 253; `spit` 596 to 349; `ships` 219 to 99; `kofistack` 181 to 88; `quake2` 32 to 32. Triangles drawn rise by up to 4% (a merged piece is drawn whole when any of it is in view).
- `setQuiet` (`engine/preload.js`) is told when a talk, card, chapter title, the journal or the chapter list is open. Port Royal queues no work yet: the tavern, the second street and the late bodies are still built 0.3 s after the town, as before, because the tavern must be ready (`tavernReady`) as soon as a saved game or a chapter can need it.

## The story, the history and the sources (moved here from the README, 21 November 2026)

### Chapters

| Year | Chapter | What happens |
|---|---|---|
| 1690 | Arrival | Step off the ship, meet Abba, buy stew at The Turtle, find four objects, hear Ned's story, walk to the fort, explore the market street |
| 1670 | Ned's story | A flashback: Henry Morgan, the buccaneers' articles, a sword drill, loading the ships |
| 1691 | The warehouse | Check cargo, make change, weigh a clipped coin, read a letter from a slave ship's captain |
| 7 June 1692 | The earthquake | The town sinks into the sand; swallowed, thrown into the sea, rescued |
| 1692 | The days after | The survivors' camp; stay or leave for what becomes Kingston |
| 1739 and today | The tombstone | St Peter's Church and Galdy's tomb |

Progress saves in the browser. Teachers can open all chapters from the Chapters menu.

### What is history and what is fictional

**From the record:** Galdy's birth in Montpellier in 1659, his flight as a Huguenot, being swallowed and thrown into the sea in 1692, his rescue by boat, his trade in wine, cocoa and enslaved people as an agent of the Asiento, his seats in the Assembly, his work on St Peter's Church (1726), his death in 1739 and the tomb's move in 1953. Also the brick houses of up to four storeys, the brick floors, pewter, clay pipes and bottles found by archaeologists, the watch stopped at 11:43, liquefaction of the sand, and the minister preaching in a tent.

**Fictional:** Abba and her tavern The Turtle, old Ned, Kofi, Sam, the gunner, the soldier, the market street's people (Grace, Peter, Daniel Mendes, Constable Hart), the customer and prices in the warehouse, the captain's letter, who was in the boat that saved Galdy, the camp layout, and all dialogue. The journal says so on each relevant page.

### Sources

- Galdy's tomb inscription, St Peter's Church, Port Royal
- Frank Cundall, *Historic Jamaica* (1915)
- Donny Hamilton and the Texas A&M Port Royal excavations
- Rev. Emmanuel Heath, letters on the earthquake (1692)
- John Taylor's description of Port Royal (1687 to 1688): markets, prices, turtles
- The 1677 deed for a synagogue on New Street (Jew Street); histories of Jamaica's Jews (for example Arbell, 2000)
- Alexandre Exquemelin, *The Buccaneers of America* (1678)
- National Geographic, "How the 'wickedest city on Earth' was sunk by an earthquake"
- Jamaica Gleaner, "Lewis Galdy cheated death twice" (2024)

### Notes for contributors

- Peter Dunn's reconstruction paintings and the UCLA Cultural Virtual Reality Lab model were used as visual reference only and are not included.
- Animations come from Mixamo, and a few are made by hand (`tools/anims/handmade.py`, CC0). The source files are in `shared/anim-sources/` and are retargeted into one shared library (`shared/models/anims.js`); see `docs/PIPELINE.md`.
- The script has not yet been reviewed by a historian. Please have it checked before classroom use.

## Hannah, Abba's worker (21 November 2026)

The owner: Abba cannot be at the tavern door and inside at the same time. Inside The Turtle, Hannah now serves the stew and asks the change question; Abba stays at the door. Hannah is fictional, and the journal's "Who lived here?" page says so. **Stand-in body (work to do):** she is Abba's body in her own colours (indigo bodice, ochre skirt, pale blue head wrap) and a taller, slimmer build, made in `main.js` the way Grace is. She needs her own body from the character tools (`tools/people/`, Blender) so her face differs from Abba's.
