# Melissa 2025: the game guide

Read `CLAUDE.md`, `docs/NEW_GAME.md` and `docs/CONTENT.md` first. This file is the story, the systems, the research and what is left. It is the guide for `games/melissa/`.

- Code: `games/melissa/src/`. Page and styles: `games/melissa/site/index.html`.
- Build: `node tools/build.mjs melissa --dev` (test views and the autoplayer) or without `--dev` (public).
- Status (14 November 2026): **all seven chapters play from start to end** under the autoplayer, the place audit reports 0 issues in all nine places, and the layout test is clean at three phone and tablet sizes. It is on the menu (the owner added the card). See "What is left".
- The framework is Kendal 1957's (talking, journal, cards, chapters, saving, the audits, the cinematic layer). The new parts are the weather (`storm.js`), the houses and wreckage (`houses.js`), the village (`places.js`) and the sounds (`sfx.js`).

## The story

You are a made-up child (first person, eye height 1.32 m) in a made-up village, **Breadnut Corner**, in the west of Jamaica. The family is made up too. The storms, the government and the helpers are real. Nobody real speaks.

Three time lines meet in one family. In 1951 you are **Hattie**, aged ten, with Papa, Mama and baby brother Winston, in a fishing bay near Kingston. Baby Winston is Dad in 1988 and Grandpa in 2025, and Hattie is the big sister Dad speaks of in chapter 2. In 1988 you are **Pearl**, aged twelve, with Dad, Mama and little Delroy. In 2025 you are Pearl's child, living with **Mum (Pearl)**, Grandpa (Dad of 1988) and Gran (Mama of 1988). Uncle Delroy now lives abroad and is the voice on the phone in chapter 5. Mr. Raymond is the son of Mass Clifford, whose block house kept its roof in Gilbert.

| # | When and where | Walk and do | Remembered choice |
|---|---|---|---|
| 1 | Friday 17 and Saturday 18 August 1951, `yard51` then `room51` | A seaside yard near Kingston, no wires, the sea to the south. Talk to Papa, Mama, Mass Cyril. Three jobs (fill the drum, board two windows, haul the canoe up the beach). Miss Ivy offers her block house. **Storm scene** (roof lifts). Morning in the torn room. | none |
| 2 | Sunday 11 and Monday 12 September 1988, `yard88`, `kingston88`, then `room88` | Talk to Dad, Mama, Delroy. Three jobs (fill the drum, board two windows, take in the washing). Mass Clifford offers his block house. Go in. **Storm scene**, which opens with a **Kingston cutaway** (see below), then the roof lifts in the village. Morning in the torn room. | none |
| 3 | Saturday 25 to Monday 27 October 2025, `yard25` | Talk to Mum, Grandpa. Four jobs (shop, buckets, window boards, go-bag). Mr. Raymond: hand up three nails. Listen to the radio. Walk to the church hall. | none |
| 4 | Monday evening and Tuesday 28 October 2025, `hall` | Talk to Mum, Pastor Gayle, Nurse Simone. Two jobs (blankets, water). The night passes. **Storm scene** (lights go out, hold on, the roof opens, a hymn). The hall in afternoon light. | none |
| 5 | Tuesday afternoon, `after` | Mum and Grandpa. Walk home (Mum follows). Look at the fallen tree and the fallen wires (once each). Look at the house. Check on Miss Hyacinth. | none |
| 6 | The days and weeks after, `after` | Mr. Raymond. Four jobs (logs, water truck, tarp, food for Miss Hyacinth). Jordan's phone call to Uncle Delroy. A helicopter. The light comes back. | What you did first (lane, roof or food) |
| 7 | Today, `today` | Miss Campbell, the Ready Plan board, the family kit quiz, the "storms before" quiz, Andre's question. | Why we get ready |

Hard history is told gently: nobody is hurt on screen, the loud scenes have an opt-in card ("Read what happened instead"), and deaths are stated plainly in the journal (45 in Jamaica for Melissa, about 45 for Gilbert, about 150 for Charlie).

### The Kingston cutaway and the one dish (Gilbert 1988 only)

Gilbert's storm scene opens in Kingston at about midday, when the eye passed over the city (`kingstonCutaway` in `main.js`, the place `kingston88` in `places.js`). The camera director shows one street with two sides. North of it, uptown: a high white wall, a gate, a lawn, palms, a car, a big concrete house with a tile roof, and **the one satellite dish** of the game (about 2 m across) on a post in the garden. South of it, downtown: a zinc fence and rows of small board houses with zinc roofs, packed close, with washing and a standpipe. The dish is torn off its post and sails over the wall; zinc sheets fly from the crowded yards; the last shot looks along the whole street. The line is "Gilbert hit big houses and small houses alike." Then the scene goes on in the village, where the roof sheets lift off Mass Clifford's house.

The owner's direction (14 November 2026): the dish belongs to Gilbert only, there is only one, and it belongs in a rich Kingston neighbourhood, not the countryside, to show the storm hit rich and poor. Melissa has no dishes, only flying zinc. **None of it is sourced yet**: nothing in `docs/games/melissa-facts.md` says that dishes were common in 1988 or that Gilbert threw them, so the journal makes no such claim and says only that Gilbert hit uptown and downtown alike. Find a source (the Gleaner archive of September 1988) before adding one. Likewise nothing says which Kingston neighbourhoods were hit hardest, so no real neighbourhood is named.

### The storm scene (`stormRun` in `main.js`)

Same idea as Kendal's crash (and Gilbert's begins with the Kingston cutaway above). An opt-in card, then: the wind rises, the roof groans, the lights go out (a torch is in your hand), a "Hold on!" button you can hold, the roof sheets over the middle of the room lift off one by one (rain falls only inside a circle under the hole: `STORM.mask`), a hymn (chapter 3), then fade to a title card and back to the room afterwards. Lines are in `LINES` in `content.js`.

## Code map

`games/melissa/src/`:

| File | What it holds |
|---|---|
| `main.js` | the Kendal framework (renderer, controls, people, places, journal, cards, chapters, saving, helper arrow, audits) plus: the actions of each place (`ACTIONS_FOR`), the chapter scripts (`ON[stage]`), the storm scene (`stormIntro`, `stormRun`, `stormAfter`, `tearRoof`, `restoreRoof`), the weather per scene (`weather`, `WIND`), the quizzes, sound mixing, and the dev views and autoplayer |
| `content.js` | every word the player reads: `CHAPTERS`, `GOALS`, `TALK`, `LATER`, `JOURNAL`, `LINES`, `KIT`, `STORMS` |
| `cast.js` | `LOOKS` (a body plus colours per person), `folk` (crowds), `HATS`, `KID` |
| `places.js` | `village()` (built five times: 1951, 1988, 2025, after, today), `buildRoom88(year)` (the rooms of 1951 and 1988), `buildHall`, `buildKingston88` |
| `houses.js` | houses with zinc-sheet roofs that can be whole, half gone or off; the shop; tanks and drums; wreckage (loose zinc, fallen tree, snapped palm, leaning pole and wires, tarps) |
| `storm.js` | rain, blown leaves and flying zinc drawn on the graphics card; `swayable` plants |
| `sfx.js` | wind, howl, roar, rain, rattling roof, generator, helicopter, chainsaw, hymn, crickets (beds) and one-shots |
| `common.js` | times of day and weather (`ENV`: `calm`, `gale`, `storm`, `after`, `room`, `roomStorm`...), `mixEnv` |
| `gfx.js`, `props.js`, `detail.js` | copied from Kendal (textures drawn in code, plants, small things) |

`main.js` was assembled from Kendal's `main.js` and edited by hand afterwards. It is the source now: edit it directly.

Stages: chapter n uses stages n0 to n9 plus 10 (chapter 1 is 10 to 16, chapter 2 is 20 to 26, and so on). Charlie (10) and Gilbert (20) share one shape, set by `BYGONE` in `main.js`: talk (base), three jobs (base+1), the neighbour with the strong house (base+2), go inside (base+3), the storm night (base+4), the morning (base+5), done (base+6). `GOALS`, `TALK_TARGETS`, `NEXT_AFTER_TALK` and `CHAPTER_END` in `content.js` drive it; `ON[stage]` runs scripted scenes; `DONE` in `main.js` says which stage finishes each chapter.

## Test it

```bash
node tools/build.mjs melissa --dev          # dev build
python3 -m http.server 8765                 # then open http://localhost:8765/games/melissa/site/
```

- Views (`?shot=NAME`): `c51a` to `c51c` and `r51` (1951), `y88a` to `y88d`, `y25a` to `y25e`, `aft1` to `aft6`, `tdy1` to `tdy3`, `room1` to `room3`, `hall1` to `hall4`, `stormhall`, `stormroom`, `stormyard`, `cam` (a frozen camera-director view: `&p=kingston88&c=x,y,z&l=x,y,z&dishk=0.4&rain=0.8&sheets=1`), `talk1`, `talk2`, `card1`, `journal1`, `chap1`, `poster`. Add `&k=1&rain=0.9` to put wind and rain on a view. `?shot=model&m=house|shop|fallen|props|wreck|tank|people&ids=pearl,winston&one` shows models and people.
- Autoplayer: `?auto=N&one` plays chapter N (1 to 6). Without `&one` it carries on. Read it from `#autolog` and the page title (`--dump-dom`; the title can hold several lines).
- Automatic checks (owner rule 8): `?test=audit` (0 in all nine places on 14 Nov 2026), `?test=held`, `?test=layout` (run at 390x800, 667x375, 800x500 and 1280x720), `?test=resume`. `PEOPLE.md` also asks for `?test=cloth`, `?test=walkers` and `?test=skin`; those arrive with `engine/skinprobe.js` in PR 50 and are not wired here yet.

## People (follow `docs/PEOPLE.md`)

`docs/PEOPLE.md` is on the branch `claude/affectionate-pasteur-xvhvlq` (PR 50). Recipes for the 1988 and 2025 bodies are in `tools/melissa/people/` (see its README). They are **not built**, because MakeHuman and Blender were not available when the game was started. The game uses bodies already built for Kendal (allowed: a body used by two games is built once and copied), recoloured per person in `cast.js`. The stand-ins wear 1950s cuts; build the real bodies and point `cast.js` at them.

## Research

Every number about the storms comes from `docs/games/melissa-facts.md` (a sourced table with a confidence for each row, including the conflicts between sources). The decisions that matter:

- **Landfall:** Tuesday 28 October 2025, about 12:25 pm, near New Hope, Westmoreland, Category 5, about 185 mph (NHC). The government statement says 892 mb at landfall; NHC says 892 mb was reached at sea about five hours earlier and landfall was 897 mb. The game gives no pressure.
- **Deaths:** 45 official in Jamaica (announced 11 November 2025; St. Elizabeth 18, Westmoreland 15). In December 2025 some more cases were still being checked and some people were missing; the game says so only in "Dig deeper". Disease deaths are counted separately.
- **Damage:** about 116,000 buildings severely or catastrophically damaged (government, 4 November 2025). World Bank and IDB: US$8.8 billion of damage to buildings and property. The later assessment (damage, losses and extra costs) is US$12.2 billion. The NHC report mixes these two up, so use the World Bank and assessment wording.
- **Gilbert:** the eye passed over Kingston about midday on Monday 12 September 1988 and left the west in the evening. Category 3 by the original report (a later study says a low Category 4). 45 died in Jamaica, 318 in all. The 888 mb low was a day later, near Mexico. The "800,000 in shelters" figure is Low confidence and is not used.
- **No claim about Gilbert in the west.** The sources say little about St. Elizabeth, Westmoreland and Hanover in 1988, so Breadnut Corner's Gilbert is a general picture. Check the Gleaner archive of September 1988 before adding parish claims.
- **Eye and hours of wind:** no source gives how long the eye or the hurricane wind lasted at any place, so the game never says.

### Storms before Gilbert

From the Gleaner (30 October 2025, "More destruction in the 1800s and 1900s") and Wikipedia pages that cite the reports of the time. **Death tolls differ between sources; check them in the Gleaner archive or the National Library of Jamaica before anyone relies on them.**

| Storm | What the sources say | Used in the game as |
|---|---|---|
| 1780, 3 October (the Savanna-la-Mar hurricane) | Hit the south-west coast. A surge of about 20 feet destroyed the port and most of the town, catching people who had gone to watch the surf. Deaths: estimates from hundreds to over 3,000; the sources disagree. | Journal "Storms before Gilbert"; a quiz question; Miss Campbell's line. **No number is given.** Savanna-la-Mar is in Westmoreland, near where Melissa came ashore. |
| 1880, 18 and 19 August | Crops, ships and wharves in Kingston damaged; the Gleaner says five drowned. | Journal, one line |
| 1903, 11 August | Category 3 (about 120 mph) near Morant Point. At least 65 and as many as 90 died in Jamaica. Banana crop wiped out. The Gleaner says US$2.5 million of loss; a New York Times report says US$10 million. | Journal, deaths as a range, no cost |
| 1912, 18 November | A slow hurricane after a week of rain, said to be as much as three feet in places. | Journal, one line |
| 1944, 20 August | Gleaner: destroyed the coconut industry, many homes and public buildings. One source, no figures. | Not used |
| 1951, Hurricane Charlie, 17 to 18 August | High Category 3, came ashore just south of Kingston about 10 pm on 17 August (03:00 UTC on the 18th). About 17 inches of rain in Kingston. First headline: 110 dead; later counts about 152 in Jamaica, about 2,000 injured, about 25,000 homeless, about US$50 million of damage in 1951 dollars. The Gleaner calls it Jamaica's deadliest natural disaster of the 20th century. | **Chapter 1** (a flashback with a made-up family), its journal page, a quiz question, and a note on the Gilbert and Melissa comparison |
| 1980, 6 August, Hurricane Allen | Passed about 25 miles away without coming ashore; the Gleaner says eight died and US$100 million of damage. | Journal, one line |
| 1979, June | The Gleaner says a tropical depression flooded the west and killed about 40 people. The Gleaner's own naming of it is inconsistent. | Not used |

A point to keep straight: the government called Gilbert the previous benchmark, and Gilbert was the most damaging storm in living memory, but **Charlie killed about three times as many people in Jamaica** (about 150 against 45). The game says so.

## What is left

1. **Build the six character recipes** in `tools/melissa/people/` and swap the stand-in bodies (see above). Then run the skin, cloth and walker tests from `PEOPLE.md` once they exist.
2. **Run the layout test** at 390x800, 667x375, 800x500 and 1280x720 and fix everything it finds; run `?test=held` and `?test=resume`.
3. **Look at every place** in close screenshots (the 1988 yard, the room, the village after the storm, today). Only the 2025 yard, the hall, the storm in the hall and the village today have been looked at so far. The wreckage (zinc sheets, wires, tarps, the fallen tree) needs a pass for how it reads from the lane.
4. **Read every line aloud** for the 6+ level (lines of about 12 words or fewer). All dialogue is new wording.
5. **Check Gilbert in the west** in the Gleaner archive (see above) and check the Charlie and 1903 numbers against the Gleaner of the time.
6. **Real people.** Nobody real speaks. If the owner wants a real official or a real survivor, use only words from the record.
7. **Source the Gilbert dishes and the Kingston contrast** (see above). Also check the Charlie details used in chapter 1 (the sea close by, the block house, the night landfall) against the Gleaner of August 1951; the 1951 bay and family are made up.
8. **Sound** has been written but not heard: run the autoplayer once with sound allowed (`--autoplay-policy=no-user-gesture-required`) and check `AU.ctx.state` is `running`, as `docs/TESTING.md` says.
9. **Menu card, poster, `CLAUDE.md` index line and `docs/ARCHITECTURE.md`** are left until the owner says the game is ready (as with Bog Walk), and until PR 50, which edits `CLAUDE.md`, has landed.
10. **Phones.** Rain and sway cost little (one set of lines, one set of points), but measure with `?shot=y25a&stats` and on a real phone.
