# Nanny Town 1734: The Narrow Path (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the rules that are special to this game, the research, the code map and what is left.

- Code: `games/nanny/src/` (modules, see "Code map"). Page and styles: `games/nanny/site/index.html`.
- Models: `games/nanny/site/models/*.js`, built from `tools/nanny/people/` (see "Characters").
- Build: `node tools/build.mjs nanny --dev` (test views and the autoplayer) or without `--dev` (public).
- Status: all six chapters are playable from start to end. It is new, so expect polish work (see "What is left").

## People rebuilt (16 November 2026)

All ten bodies and their light copies were rebuilt with the fixed shared builder (see `docs/HANDOFF.md`, "People pass"). Each recipe names a face shape (`face` in `tools/nanny/people/*.json`), so the Maroon man, the scout, the elder, the women and the children no longer share one face. Men's shirts hang plainly, light copies keep their eyes and brows, and children keep wide eyes and light brows. Checks after: audit 0, held 0, walkers 0, layout 0, cloth 45 lines (46 on main; the Maroon men are at 0). Look with `node tools/review/people-sheet.mjs nanny maroon_man,maroon_scout,maroon_elder,maroon_boy`.

## Rules that are special to this game

These sit on top of the owner's rules in `CLAUDE.md`. They exist because Nanny is thinly documented and her people's heritage is living.

1. **Nanny never speaks.** Nobody wrote down her words, so the game gives her none. Other people talk about her.
2. **Nanny is only seen from far away.** Nobody drew her from life. The face on the 500 dollar note comes from a student's drawing made in 1976. She stands on the high rock in chapter 2 and under the meeting tree in chapter 6, and you cannot walk up to her. Her look (a pale head wrap, a plain light garment, a string of beads) follows the best known picture of her, which the owner supplied. That picture was drawn long after her time, and the journal says so.
3. **Nothing sacred is shown.** No Kromanti ceremony, song, drumming or language. No burial and no Bump Grave. No healing plant is named. The journal says these exist and are private.
4. **The word "obeah" is not used.** It was the colonists' word. The 1733 record that uses it is described without it.
5. **Every journal page says where its facts come from**: written records, Maroon tradition, or fiction made for this game. The last chapter turns this into a game ("How do we know?").
6. **The fight is fictional and says so.** It shows methods that were written down, mostly for another Windward town in 1739. Nobody is shown hurt and nobody falls. A card after it says that people were hurt and killed in this war, on both sides.
7. **Review before release.** We found no written guidance from the Moore Town Maroon Council or the Jamaica National Heritage Trust on how to tell this story. Send them the journal pages and the two set pieces and ask. The credits already say the game has not been reviewed yet.

## The story

You are fictional: a child, first person, at a child's eye height (1.32 m). You and your mother leave a sugar estate at night with a Maroon scout, and live in Nanny Town through an attack that is driven back, the night the town is taken in 1734, and the day in 1740 when a paper with Nanny's name on it reaches the new town.

| # | When and where | Walk and do | Remembered choice |
|---|---|---|---|
| 1 | About 1730, a sugar estate at night (`estate`) | Talk to Mama and Quamin. Follow Quamin along the cane. Cross the cart road while the watchman's lantern is far away (if he comes close you go back to the shadows and try again). Cross the stream, climb the hill, watch the sun rise on the Blue Mountains. | None |
| 2 | About 1730, Nanny Town (`town`) | Climb the narrow path with Mama and Quamin. Talk to Auntie Mimba, Cubbenah and Beneba. Plant three yams. Learn two horn calls. See Nanny, far off on the high rock. | The work you choose: watch, garden or carry messages. Mimba and Cubbenah remember it. |
| 3 | About 1731, the watch rock (`watch`) | Talk to Quamin and Cubbenah. Look out over the valley and see a thin red line of soldiers, far away. Pass two horn calls on. Set three forked sticks by the trenches. Mama gives you a cloak of leaves. | None |
| 4 | About 1731, the same rock | The fight (see below). Then talk to Cubbenah and Mama. | None. You can choose "Read what happened instead". |
| 5 | 1734, Nanny Town at night | The horn wakes you. Knock on three doors. Find little Phibba by the cotton tree; she holds your hand. Climb the back trail while small cannon fire behind you. At the top the sun rises and you look back once. | None. You can choose "Read what happened instead". |
| 6 | 5 August 1740, New Nanny Town (`newtown`), then today | Talk to Mama, Cubbenah and Beneba. Look at the paper on the flat stone: the real words. Play Beneba's game: six statements, and for each, how do we know? A card about today, then the last question. | Why we remember Nanny (she led her people, she helped keep them free, her people kept her story) |

Rule of truth: real events stay as they happened. Choices change only what people say and the "Your journey" page.

### The fight (chapter 4, `fightRun` in `main.js`)

Same idea as the Port Royal earthquake and the Kendal crash: an opt-in card first ("It is loud, and it may be scary"), then phases. You stand at the edge of the watch rock between two boulders and cannot walk, but you can look round.

1. The forest is still. A camera shot down the path: red coats come out of the mist in single file. A drum and a trumpet.
2. Cubbenah nods. You blow "Now!" on the horn. Horns answer from every side, and nobody can be seen.
3. The soldiers stop. Guns flash and smoke from the bushes, and the soldiers fire back at nothing. A "Stay low!" button lets you duck behind the rock (your leaf cloak closes in).
4. Cubbenah nods again. You blow "All together". The bushes are cut away at one stroke and the hillside is full of Maroons.
5. The soldiers turn and run back down the mountain. Birds sing.
6. A card: this fight is fictional, the attacks were real, and people were hurt and killed in this war.

What each part rests on: horns answering unseen, the trenches and forked sticks, and the bush cut away to show a hillside full of people are from Thicknesse (1788) and Dallas (1803), about Quao's town in 1739. The leaf cloaks are Maroon tradition. The single-file path is Edwards (1793). That soldiers attacked Nanny Town in 1730, 1731 and 1732 is from the Jamaica National Heritage Trust. How any one attack went is not recorded.

### The guns in the night (chapter 5, `gunsRun`, `ridgeDawn`)

After another opt-in card, two swivel guns on a knoll by the path fire every few seconds (a boom, a flash, a shake). Houses begin to glow. You walk the back trail with Phibba; Mama and the neighbours climb ahead of you. At the top the game fades the night into dawn, the camera looks back at the smoking town with soldiers standing in it, and a card called "What really happened in 1734?" gives the three accounts that disagree.

## Code map

`games/nanny/src/`:

| File | What it holds |
|---|---|
| `main.js` | renderer, sky, the far ridges and mist, controls, people, the place registry, the journal, cards, the cinematic layer (`bars`, `say`, `flash`, `fadeBlack`, the camera director `cut` with zoom), saving, chapters and stages, the horn game (`hornGame`), the lantern (`estateTick`), the fight (`FIGHT`, `fightRun`), the guns (`GUNS`, `gunsRun`, `ridgeDawn`), the loop, the place audit, test views and the autoplayer |
| `content.js` | every word the player reads: `CHAPTERS`, `GOALS`, `TALK`, `LATER`, `SAY` (narration), `CARDS`, `CALLS` (the horn calls), `JOURNAL` |
| `land.js` | noise, `makeGround` (heights, trails, clearings, where you may walk), `landMesh`, `ribbon`, `streamMesh`, `makeRidges`, `makeMist`, `makeSun`, `makeFireflies`, `makeSmoke`, the times of day (`ENV`, `mixEnv`) |
| `flora.js` | trees, tree ferns, plantains, palms, cane, grass and rocks, each drawn many times at once; `forest()`; the cotton tree |
| `props.js` | huts, cook fire, jerk frame, yam hill, trench, forked stick, musket, swivel gun, horn, baskets, the paper on its stone, the lantern, the leaf cloak |
| `places.js` | the four places |
| `cast.js` | `LOOKS` (a body plus colours per person), villagers, fighters |
| `sfx.js` | the horn, guns heard from far away, drum, trumpet, night insects, stream, fire, owl, frog |
| `gfx.js` | copied from Kendal: textures drawn in code, shared materials, the sky, `batchStatic` |

### What is new in this game's engine code

- **Land with heights.** Earlier games are flat. Here `makeGround({ base, trails, flats })` gives `h(x, z)`. A trail is a list of `[x, z, y]` points with a half-width; a flat is a round clearing. The land is levelled to a bench under each one and eases back to the wild slope. People stand at `G.h(x, z)`. The camera follows it.
- **Walking on trails.** You may stand on a trail or a clearing and nowhere else. `G.clamp(x, z)` gives the nearest allowed spot, so you slide smoothly along a trail's edge. A trail marked `nowalk` shapes the land but cannot be walked (the soldiers' path). For the engine's audits, `G.walls(0.5)` turns everything you may not walk on into rectangles.
- **Leading and following** use the shared `engine/follow.js` (`docs/ENGINE.md`), with this game's numbers in `FOLLOW` in `main.js`. Quamin leads (`lead`, along the trail, and waits if you fall behind), Mama and Phibba follow in your footsteps (`follow`: behind and to one side, never closer than 0.9 m, 0.8 m for Phibba, and they step aside if you walk back into them), Mama leads the climb up the back trail and the neighbours run ahead of you, and Quamin and Mama walk home round the fire and stools (`goTo`). Where a person may not stand is `blockedAt`: off the ground you can walk on, or inside a footprint in `P.solids`.
- **Footprints match the real shapes.** `P.solids` holds a circle for each hut, fire, rock, gourd, yam hill and fence post, and the cotton trees' whole root spread (`userData.reach` from `cottonTree`). Forest trees stand at least 1.7 m, bushes 1.5 m times their size, and the far huts 3.1 m from any ground you can walk on (`flora.js`, `places.js` `farHuts`). On the estate's stream crossing you stand on the stepping stones (`G.h` is raised to the stone tops after the land is built).
- **Who is where.** A place holds different people in different chapters, so each person has `when: [firstStage, lastStage]`. `refreshCast()` shows and hides them. A person with `hiddenNow` waits for the script to show them (the soldiers, the Maroons in the bushes).
- **The horn.** `hornGame(['well', 'come'])` shows each call as dots and bars, plays it, then waits for you to tap Short and Long in the same order. A wrong tap just restarts that call. Keys 1 and 2 also work.
- **The backdrop.** Six rings of ridges (`makeRidges`) follow the camera and take their colours from the time of day, paler with distance. Sheets and banks of mist sit at `backdrop.mist`. `backdrop.lift` raises or lowers the ridges for each place.

### How a game moves

- `stage` is the story as a number: chapter n uses stages n0 to n9 (chapter 1 is 10 to 15, chapter 2 is 20 to 25, and so on). `DONE` in `main.js` says which stage finishes each chapter. `ON[stage]` runs scripted scenes. `SAFE` moves a saved game out of the middle of a scene.
- Timed scenes use `run`, `tween`, `cut`, `waitFor` and `wait`. They stop themselves when the chapter changes (`EP`, the "epoch").
- Speed: draw calls and triangles are in line with Kendal (`?shot=town3&stats` gives about 600 calls and 760,000 triangles with shadows on a computer; phones have no shadows).

## Coordinates

Metres. `yaw = 0` looks toward -z (north). In the mountain places +z is south and downhill.

| Place | Notes |
|---|---|
| `estate` | You start at (2, 40.6) by three huts. The trail runs north: cane on both sides, the cart road at z 8 (the watchman walks it from x -27 to 25), the stream at z -13.5 with stepping stones, then up the hill to the lookout at (6, -65.5), 19.8 m up. |
| `town` | The clearing is a circle of radius 14.5 round (0, 0). The narrow path comes in from the south-east, starting at (36, 60), 24.5 m lower. The garden is at (-23, 5). The cotton tree is at (7.5, -6). The high rock is at (3, -24.5). The back trail leaves at (-9, -9.5) and climbs to the ridge at (-64, -61), 36.5 m up. The soldiers' knoll is at (22, 22). |
| `watch` | The rock is a circle of radius 4.6 round (0, 0) at the top of a 15 m drop. You stand at (0.2, 4.0) for the fight. The top of the path (walkable, with the trenches) runs west and down to (-31, 27). The soldiers' path (not walkable) winds from there down the slope below the rock to (40, 100), where it goes into the mist at y -46. The far spur with the red line is at (50, 158). |
| `newtown` | The clearing is a circle of radius 13 round (0, 0). The paper stone is at (3.6, -4.6). The river runs along x 27. The meeting tree and Nanny are on a knoll at (-9, -37), which you cannot reach. The waterfall is at (-72, 6). |

## Test it

```bash
node tools/build.mjs nanny --dev
```

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765/games/nanny/site/`.

- Views (`?shot=NAME`, dev build only): `est1` to `est6`, `town1` to `town8`, `night1` to `night3`, `ridge1`, `ridge2`, `watch1` to `watch7`, `new1` to `new5`, `talk1`, `talk2`, `card1`, `paper`, `journal1`, `chap1`, `horn`, `nanny`, `look`, `guns`, `poster`, and `fight&at=1` to `fight&at=4` (the march, smoke and thunder, the hillside full of people, the soldiers go back). Add `&stats` to a place view to print draw calls and triangles to the page title.
- People up close: `?shot=model&ids=mama,quamin,cubbenah&one&a=1.57&d=4.4` (`&lo` for light copies, `&hold=musket`, `&cloak`, `&anim=Walk`). Full bodies take a while to load: wait about 20 seconds.
- Autoplayer: `?auto=N&one` plays chapter N (1 to 6). Without `&one` it carries on to the end and logs `ALLDONE`. It writes `STALL` if nothing changes for 30 seconds.
- **Automatic checks (owner rule 8).** Each must report 0 issues:
  - `?test=audit`: the engine's place audit, run once for each set of people who are in a place together, plus two checks added for land with heights (everyone stands on the ground; nobody stands in a tree, a hut or a fire). People are checked against the real shapes (`auditBodies`): where they stand, at their own height, along the guides', followers' and runners' routes (`auditRoutes`), and over every spot of open ground you can walk on (a follower goes wherever you go). It also checks the town still shows over 140 houses. Background figures may stand on open hillside beside a trail, so the engine's "walking wall" line is kept only for people you talk to.
  - `?test=follow`: you walk the real routes (the estate trail with Quamin and Mama, the narrow path, Phibba round the town and up the back trail with Mama leading), with stops and a turn back into the follower. Nobody may come inside the personal space, stand inside anything, fall far behind for long, or get stuck.
  - `?shot=cam&p=town&st=53&c=13.5,1.5,-10.5&l=9.9,0.7,-7.6&env=morning`: a camera anywhere (c and l are x, height above the ground there, z), for close checks of one spot.
  - `?test=held`: horns, muskets and the lantern are at the hand and clear of the body, standing and walking.
  - `?test=layout`: at 390x800, 667x375, 800x500 and 1280x720. It includes the horn panel and the "Stay low" button.
  - `?test=resume`: saved stages resume in the right place.
  - `?test=cloth`: no skin or under layer shows through the clothes, every body, full and light copy, with and without a hat. `?test=skin` prints face colours (no pass mark; compare with `docs/PIPELINE.md`, "Skin").
  - `?test=walkers`: people who walk do not bounce, float or sink (the lowest point of the feet stays on the ground, and the body does not jump against the ground between steps), the guide is never behind you, and a follower does not shuffle stop-start. A run is allowed more rise and fall than a walk.
- `npm test` includes two tests of the land code (`tests/regressions.mjs`).
- Reading level: `node tools/nanny/readcheck.mjs games/nanny/src/content.js` flags dialogue and narration over 12 words, long goals and journal lines, dashes, and journal pages that are repeated or missing. Run it after editing any text.
- The menu poster `menu/nanny.jpg` and opening-screen background `games/nanny/site/title-scene.jpg` use the same real game capture from `?shot=soldiers` at 1600 by 900. This dev-only view frames the redcoats approaching on the path before the fighting, with no HUD or text. The image covers the opening screen while models load. Once ready, a live view of the same soldiers replaces it, with slow camera movement, idle character animation and moving mist. Reduced-motion mode holds the camera and scene animation still. This preview never starts the fight or changes the save; Start and Continue restore the gameplay field of view and reset the preview actors through the normal chapter setup. A dark gradient keeps the text readable.

## Research (checked 14 November 2026)

A research pass read the sources below. The full report was a working file and is summarised here. Labels: **record** (written at or near the time), **scholars** (later, and consistent), **tradition** (handed down by Maroons), **disputed** (sources disagree).

| Fact | Used as | Source and caveat |
|---|---|---|
| The English took Jamaica from Spain in 1655; people the Spanish had enslaved went into the mountains, and so did some Taino people | Used in the journal ("Enslaved", Dig deeper) | Jamaica National Heritage Trust (Maroon heritage pages); Bilby (2005), *True-Born Maroons*. Scholars. |
| Old Nanny Town was in Portland, high in the Blue Mountains, about 2,000 feet up, with over 140 houses at its biggest; built about 1723; found by the English in 1728; attacked in 1730, 1731, 1732 and several times in 1734 | Used. "In the 1720s" for the building date, because other sources say 1720. | Jamaica National Heritage Trust, Nanny Town site page. Scholars. |
| Which river ran below it | Not named | Disputed: Stony River in some sources, between the Rio Grande and the Back River in the National Library of Jamaica's notes. |
| "The only path", steep and rocky, "not wide enough to admit the passage of two persons abreast" | Used, with his words quoted in the journal | Bryan Edwards, printed 1793. Record, but hostile and 59 years late. Read in the 1801 edition. |
| 1734: Captain Stoddart attacked with "portable swivel guns"; "many were slain" | The journal names Stoddart and says a planter wrote that many were killed | Edwards. He gives no day or month and no source. |
| 1734: other accounts | The journal and a card give all three | One account (Gleaner, 2021) says troops under a Captain Brook reached the town on 17 December 1734 and found it empty. A 2018 thesis by Michael Siva is reported to argue fewer than ten Maroons died; we have not read it. Stoddart's and Brooks's attacks may be two events. |
| Houses burnt by the militia and rebuilt by the Maroons in the four years of fighting before the treaty | Used | Jamaica National Heritage Trust |
| Horns: Maroons answered the soldiers' trumpet with horns, "not a man of them was to be seen"; each person had a call | Used. The word "abeng" is given as today's name. | Thicknesse (1788), an eyewitness in 1739; Dallas (1803). About Quao's town, not Nanny Town. Neither uses the word abeng. |
| Sentries gave "five or six hours notice" | Used in the journal; in dialogue it is "hours of warning" | Thicknesse and Dallas, on Quao's town |
| Trenches about four feet deep along the path, with forked sticks to rest guns on | Used | Thicknesse and Dallas, on Quao's town |
| "An acre of under wood" cut away and the hillside "covered with" Maroons | Used as the turning point of the fight | Thicknesse, on Quao's town |
| Fighters dressed in leaves and branches and stood still like trees | Used, labelled as tradition | Not in any contemporary account we found. Tradition. |
| Yams and plantains grown; wild hog "jerked" | Used | Thicknesse and Dallas |
| Akan day names in Jamaica (Cudjoe Monday, Cubbenah Tuesday, Quaco Wednesday, Quao Thursday, Cuffee Friday, Quamin Saturday, Quashee Sunday; Juba, Beneba, Cuba, Abba, Phibba, Mimba, Quasheba for girls) | Used for the fictional people | Edward Long (1774) for the boys' names; later tables for the girls' names |
| Cudjoe's treaty, 1 March 1739 (printed as 1 March 1738 in the old calendar): freedom, 1,500 acres, a duty to return runaways | Used | Dallas prints it. Record. |
| Quao's treaty for the Windward Maroons, 1739: land, a duty to return runaways | Used with the year only | Disputed date: 23 June or 23 December 1739. National Library of Jamaica copy. |
| The duty to return runaways is still painful, and Maroons do not all agree about it | Stated plainly, not judged | Observer reports of 2022; Bilby (2010) |
| Land patent of 5 August 1740: "granted unto Nanny a free Negroe and the people under command her & their heirs & Assigns for ever a parcell of land containing 500 acres in the parish of Portland" | Shown on the paper and on a card, word for word | The docket in "Return of Land Grants 1735-1754", UK National Archives CO 137/28, entry 55, read in a transcription on jamaicanfamilysearch.com. Not checked against the original, or against the patent itself (Jamaica Archives, Patents volume 22, folio 15). Granted under a 1723 Act for bringing in white settlers. |
| Assembly Journal, March 1733: a man rewarded for killing "Nanny, the rebels old obeah woman" | Mentioned in "Dig deeper" without the colonists' word | Second hand (Mavis Campbell, page 177, as quoted by others). If it meant her, the 1740 patent shows it was wrong. |
| Nanny's dates | "We do not know when she was born or when she died" | Disputed: born about 1600 to 1686, died 1733 to about 1762 |
| Akan origin; healer; leader in war; the stories of bullets and pumpkin seeds; that she kept leading after 1734 | Used, labelled as tradition | Tradition |
| That she freed over 1,000 people | Left out | We could not trace where the number comes from |
| National Hero; the only woman of the seven | Used. "In the 1970s. Most sources say 1975." | Disputed year: 1975, 1976 or 31 March 1982 in official and newspaper sources. Check the Jamaica Gazette. |
| The 500 dollar note (1994); its portrait drawn by an art student in 1976; no picture from life | Used | Jamaica Information Service; Observer (2005) |
| New Nanny Town is now Moore Town; its leader is the Colonel; Nanny Day on National Heroes Day | Used | Jamaica National Heritage Trust; Jamaica Information Service |
| UNESCO: the Blue and John Crow Mountains inscribed 28 June 2015; the Maroon heritage of Moore Town listed in 2008 | Used | UNESCO decision 39 COM 8B.7 (read in a copy); UNESCO intangible heritage page |
| Blue Mountain Peak, 2,256 m; the mountains are often in mist | Used | IUCN and UNESCO summaries |

Real people in the game: Nanny appears and never speaks. Quao, Cudjoe, Stoddart and Edwards are named in the journal only.

### Could not be checked

1. The Assembly Journals for 1733, and the Windward treaty as entered there.
2. The patent itself and the original of CO 137/28.
3. Whether Stoddart's and Brooks's attacks were one event or two (Campbell 1990 and Carey 1997 would settle it; neither was read).
4. Siva's thesis.
5. Agorsah's reports on the archaeology of Old Nanny Town. So the game says nothing about what was dug up.
6. The Jamaica Gazette for the year Nanny was named a National Hero.
7. A plant list for the site. The forest is a general picture of moist hill forest.

## Look and feel: what is a guess

- **The huts.** No drawing or description of Nanny Town's houses survives. Ours have woven-stick walls and thatch.
- **Clothes.** One line survives about a Leeward captain in 1738: loose drawers to the knee, a small round hat, no shirt. Nothing on Windward dress, women or children. Ours are plain cloth in earth colours and indigo. The soldiers wear red coats and round felt hats; cocked hats would be right for the 1730s.
- **The layout of every place.** The town on a shoulder with one narrow path and a back trail, the watch rock, the knoll for the guns ("a small eminence, commanding the huts" in Edwards), the new town by a river.
- **The horn calls.** All six are fictional. The real calls belong to the Maroons.
- **The estate.** A general picture. It is not a real estate.

## Characters

The bodies are this game's own, built from the recipes in `tools/nanny/people/` by `tools/garvey/era.py` and packed with `tools/people/pack.mjs` (`tools/nanny/README.md` has the commands). `cast.js` recolours them per person.

| Body | Who |
|---|---|
| `maroon_scout` | Quamin, village men without a cap, fighters |
| `maroon_man` | Cubbenah, the estate watchman, village men and fighters with a knitted cap |
| `maroon_elder` | the old man of the town |
| `maroon_woman` | Mama, Beneba grown up, village women |
| `maroon_elder_woman` | Auntie Mimba, Mama in 1740, Nanny (seen far off only), old women |
| `maroon_girl`, `maroon_child`, `maroon_boy` | Beneba, Phibba, village children (built big with `upscale`, shrunk in `cast.js` by 1 / upscale) |
| `redcoat`, `militia` | British soldiers and their officer; the militia |

- The men and soldiers use the 1690 tailoring (era 1734). The women and girls are built at era 1900 with the same keys, as `tools/nanny/README.md` allowed: the 1690 tailoring left a gap between blouse and skirt at the waist where skin showed. A plain blouse, a long skirt and a head wrap are not tied to a decade.
- Everyone is barefoot except the soldiers. `blackshot` is built but not used yet, so its files are not in `site/models/`.
- `?test=cloth` checks every body; `?test=skin` measures faces in the game's light (`&env=day`, `night`, `dawn`, `morning`, `firenight`).

Skin (owner rule 9): recipes sit inside Marcus Garvey's range; `SKIN_LIGHT = 1.55` as in Kendal (the British soldiers, `pale: true`, are drawn as built), plus a soft light that goes with you at night (`nightFill`) so faces near you can be read in the dark. Hair keeps its own colour. Check faces in game screenshots after any change to the times of day.

## What is left (polish list)

1. **Maroon review.** Rule 7 above. Nothing else matters as much.
2. **Primary sources.** The list under "Could not be checked".
3. **Bodies.** Built (November 2026). Still open: `?test=cloth` reports 22 small lines (see `docs/TESTING.md`), `?test=walkers` reports Quamin's lowest foot 3.1 cm off the trail at worst (limit 3) and a soldier's body rising 2.6 cm between two steps on the climb (limit 2.5), and the women's head wraps are small.
4. **Read every line aloud** for the 6+ level. All dialogue is new wording.
5. **Phones.** The autoplayer and the layout test pass at phone sizes, but nobody has played it on a real phone. The fight has about 35 people on screen; watch the frame rate.
6. **The watchman.** If he sees you, you go back a few steps. There is no setting to switch the lantern off for a child who finds it hard.
7. **Sound.** The horn is synthesised. A recording of a real abeng, given with permission, would be far better.
8. **Screen shake.** The guns and the fight shake the camera, and there is no setting to turn that off.
9. **Chapter 6 "today".** It is a card and two journal pages. A walk in Moore Town today would be better, and should only be made with the town's help.

## Slopes, huts and the crowd (17 November 2026)

- **Walking on slopes** (`engine/anim.js`, `groundFeet` with `userData.groundAt`): the body stands on one smooth floor, the lower of the two grounds under the feet while that foot is down, rising to the higher ground as it lifts. The foot over higher ground bends its knee, and a lifted foot clears the ground under its toe. `?test=walkers` now judges each foot on the ground under it and reports the worst gap, the average and the frames over 5 cm. It still reports a few frames (worst 7 to 9 cm, average under 2 cm; it was 13 to 23 cm). Work to do.
- **Huts** (`putHut`, `props.js`): each near hut stands level on a battered earth platform with stone steps to the door; plants and people keep off them. Far huts are cut a little into the hill (`seat(..., 0.45)`) and not stood on tall blocks.
- **Crowd**: a child whose game ended on a story path could stand there for good. Children now run on off the path (`offPath` in `engine/ambient.js`). `?test=ambient` 0.
- **Look-alikes**: `?test=audit` runs `placeFaces`. Audit 0 in all four places.
- **Doors** (17 November 2026, the owner: "the doors should fit their purpose"): each near hut's door is `hutDoor` in `props.js`, in a frame of rough poles. Half the huts have a woven door (upright sticks with withies woven through, like a light piece of the wall), the other half a door of a few hand-split boards lashed with vine to two cross sticks. Both hang on vine loops and have no iron, no nails and no glass. No account describes a Nanny Town door, so both are a reasonable stand-in for what people building with wattle, thatch and hand tools would make: work to do, ask the Moore Town Maroons. The far huts (`hutGeo`) still show the door as a dark shape: they are seen only from a distance. **Sources checked (17 November 2026):** no photograph, drawing or written description of a Windward Maroon door of the 1730s was found. The 1734 attack is known through Bryan Edwards, writing about 50 years later, who says only that the soldiers "found the huts" (Wikipedia, *Nanny Town*, https://en.wikipedia.org/wiki/Nanny_Town). Finds from Old Nanny Town at the Jamaica National Heritage Trust include rosehead (iron) nails, but the Gleaner does not say whether they were Maroon or from the British who held the site after 1734 (*Unearthing the charm of Old Nanny Town*, Gleaner, 29 November 2015, https://past.jamaica-gleaner.com/article/art-leisure/20151129/unearthing-charm-old-nanny-town), so the doors keep no nails. The nearest real example found is a photograph of a traditional bamboo and thatch house at Moore Town (Slavery and Remembrance, https://slaveryandremembrance.org/collections/object/?id=OB0039; not dated, a modern house in the old way): its door is made like its wall, flat split strips woven through upright sticks, with one flat cross board, in a frame of poles. That matches the woven door, so it was kept. The split-board door is neither shown nor ruled out by any source and was kept as a stand-in. Nothing was changed.
