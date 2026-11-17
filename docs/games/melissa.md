# Melissa 2025: the game guide

Read `CLAUDE.md`, `docs/NEW_GAME.md` and `docs/CONTENT.md` first. This file is the story, the systems, the research and what is left. It is the guide for `games/melissa/`.

- Code: `games/melissa/src/`. Page and styles: `games/melissa/site/index.html`.
- Build: `node tools/build.mjs melissa --dev` (test views and the autoplayer) or without `--dev` (public).
- Status (14 November 2026): **all seven chapters play from start to end** under the autoplayer, the place audit reports 0 issues in all nine places, and the layout test is clean at all four sizes (390x800, 667x375, 800x500, 1280x720). It is on the menu (the owner added the card). See "What is left".
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
- Automatic checks (owner rule 8): `?test=audit` (0 in all nine places on 14 Nov 2026), `?test=held`, `?test=layout` (run at 390x800, 667x375, 800x500 and 1280x720; all four clean on 14 Nov 2026), `?test=resume`, and `?test=sound` (see below). `PEOPLE.md` also asks for `?test=cloth`, `?test=walkers` and `?test=skin`; those arrive with `engine/skinprobe.js` in PR 50 and are not wired here yet.

**Vehicles, 17 November 2026:** the car in Kingston 1988 and the water truck in "after" were plain boxes. They now come from `engine/roadcars.js` (`docs/ENGINE.md`): `car()` is a 1980s saloon and `waterTruck()` is a lorry with a banded tank, a hatch, a ladder, an outlet and a hose. Same colours, place and footprint; no names or numbers. To view: `?shot=cam&p=after&c=31.5,2.4,6.8&l=26,1.3,1.1` and `?shot=cam&p=kingston88&c=-4.4,1.9,-10.6&l=-9.3,0.7,-7`.

**The canoe, 17 November 2026:** Mass Cyril's canoe on the beach in 1951 was half a tube standing on its edge (one mesh, 16 triangles). It is now a dug-out canoe from `engine/boats.js` (`dugOut` in `detail.js`): 4.4 m by 0.8 m, pointed ends that curve up, solid end decks, adze marks inside, a seat board, two paddles, a calabash bailer and a painter at the bow; 2 meshes, about 3,800 triangles. The haul-up job still moves it along z as before. To view: `?shot=cam&p=yard51&c=13.5,1.9,9.5&l=10,0.3,13.4`.

## People (follow `docs/PEOPLE.md`)

`docs/PEOPLE.md` is on `main` (PR 50 merged). Recipes for the 1988 and 2025 bodies are in `tools/melissa/people/` (see its README). They are **not built into the game**. **On hold (owner's note, 15 November 2026):** build no bodies yet; merge `origin/main` once the builder fix lands, then follow `docs/STANDARD.md` (its checklist, section 5, and its table, which lists this game's gaps: build the six recipes and swap the stand-ins, make 1951 recipes of its own instead of borrowing Kendal's 1950s bodies, stop multiplying Hair, wire `?test=cloth`, `?test=walkers` and `?test=skin`). The game uses bodies already built for Kendal, plus Garvey's `guide2020` and `student2020`, recoloured per person in `cast.js`. The stand-ins wear 1950s cuts. A trial on 15 November showed the six recipes build and pack here without GitHub (see `tools/melissa/people/README.md`, "Building where GitHub is blocked"); nothing from that trial was kept in the game.

## Research

Every number about the storms comes from `docs/games/melissa-facts.md` (a sourced table with a confidence for each row, including the conflicts between sources). The decisions that matter:

- **Landfall:** Tuesday 28 October 2025, about 12:25 pm, near New Hope, Westmoreland, Category 5, about 185 mph (NHC). The government statement says 892 mb at landfall; NHC says 892 mb was reached at sea about five hours earlier and landfall was 897 mb. The game gives no pressure.
- **Deaths:** 45 official in Jamaica (announced 11 November 2025; St. Elizabeth 18, Westmoreland 15). In December 2025 some more cases were still being checked and some people were missing; the game says so only in "Dig deeper". Disease deaths are counted separately.
- **Damage:** about 116,000 buildings severely or catastrophically damaged (government, 4 November 2025). World Bank and IDB: US$8.8 billion of damage to buildings and property. The later assessment (damage, losses and extra costs) is US$12.2 billion. The NHC report mixes these two up, so use the World Bank and assessment wording.
- **Gilbert:** the eye passed over Kingston about midday on Monday 12 September 1988 and left the west in the evening. Category 3 by the original report (a later study says a low Category 4). 45 died in Jamaica, 318 in all. The 888 mb low was a day later, near Mexico. The "800,000 in shelters" figure is Low confidence and is not used.
- **No claim about Gilbert in the west.** The sources say little about St. Elizabeth, Westmoreland and Hanover in 1988, so Breadnut Corner's Gilbert is a general picture. Check the Gleaner archive of September 1988 before adding parish claims.
- **Eye and hours of wind:** no source gives how long the eye or the hurricane wind lasted at any place, so the game never says.

### Storms before Gilbert

From the Gleaner (30 October 2025, "More destruction in the 1800s and 1900s") and Wikipedia pages that cite the reports of the time, **checked on 15 November 2026 against the NHC best-track file (HURDAT2), the National Library of Jamaica's "History of Hurricanes and Floods in Jamaica", the UWI Mona disaster pages, UK Hansard of 1951 to 1955, the Jamaica Information Service and the Gleaner's own reprint of its front page of 20 August 1951** (the digitised archive and Norton 1952 could not be opened; see "Checked" below). Death tolls differ between sources, so the game uses ranges and "more than".

| Storm | What the sources say | Used in the game as |
|---|---|---|
| 1780, 3 October (the Savanna-la-Mar hurricane) | Hit the south-west coast. A surge of about 20 feet destroyed the port and most of the town, catching people who had gone to watch the surf. Deaths in Jamaica: 200 or 300 up to over 1,000, the sources disagree (about 3,000 is the figure for the whole storm, all islands). | Journal "Storms before Gilbert"; a quiz question; Miss Campbell's line. **No number is given.** Savanna-la-Mar is in Westmoreland, near where Melissa came ashore. |
| 1880, 18 and 19 August | The eye passed over Kingston; crops, ships and wharves damaged (the sources do not say the harbour flooded). The Gleaner says five drowned; the National Library says 5 drowned and 25 died in fallen houses, about 30 in all. | Journal, one line: "about 30 people died" |
| 1903, 11 August | Category 3 (about 120 mph) near Morant Point. At least 65 and as many as 90 died in Jamaica. Banana crop wiped out. The cost is a 20-fold conflict: the Gleaner printed US$2.5 million in 2025 but GBP 2.5 million in 2021, the National Library says GBP 125,000, a New York Times report says US$10 million. | Journal, deaths as a range, no cost |
| 1912, 18 November | A slow hurricane (Category 3 on the best track) after a week of rain, up to 36 inches in the north-east on 10 to 12 November. About 100 died (National Library, UWI), about 40 to 42 of them in Montego Bay; the west was hit. | Journal, one line with "about 100 died" |
| 1944, 20 August | Gleaner: destroyed the coconut industry, many homes and public buildings. One source, no figures. | Not used |
| 1951, Hurricane Charlie, 17 to 18 August | High Category 3, came ashore just south of Kingston about 10 pm on 17 August (03:00 UTC on the 18th). About 17 inches of rain in Kingston. Winds about 125 mph (110 knots on the best track; 110 mph was the Kingston reading). First headline (Gleaner, 20 August 1951): 110 dead; later counts 152 to 154 in Jamaica, about 2,000 injured, homeless 9,000 or more up to about 25,000 (sources conflict; the game says about 25,000 people), about US$50 million of damage in 1951 dollars. **Correction:** the Gleaner of 2025 calls it Jamaica's deadliest natural disaster of the 20th century, but the 1907 earthquake killed about 800 to 1,200. Charlie was the deadliest *hurricane* of the 1900s, and the game says that. Morant Bay about 80 per cent destroyed and Port Royal laid flat (Gleaner 1951, National Library). No source gives a Charlie surge height, a building-code change or anything about fishing villages, so the game claims none. | **Chapter 1** (a flashback with a made-up family), its journal page, a quiz question, and a note on the Gilbert and Melissa comparison |
| 1980, 6 August, Hurricane Allen | Passed about 25 miles away without coming ashore; the Gleaner says eight died and US$100 million of damage. | Journal, one line |
| 1979, June | The Gleaner says a tropical depression flooded the west and killed about 40 people. The Gleaner's own naming of it is inconsistent. | Not used |

### Checked (15 November 2026)

The full report, with every claim, source and verdict, is `docs/games/melissa-factcheck.md`. What it changed in the game text: Charlie is now "the deadliest hurricane to hit Jamaica in the 1900s" (not the deadliest disaster: the 1907 earthquake killed more); its wind is about 125 miles an hour (the old 110 was knots read as miles); deaths are "more than 150" (152 to 154); the 1880 line no longer says the harbour flooded and gives about 30 dead; the banana, airport and housing lines were cut back to what the sources support; Gilbert's lowest pressure was over the Caribbean Sea, not at Mexico, and one village (not "some places") waited three months for light; the Westmoreland quiz question no longer claims the 1780 storm "came ashore" there. **Still open:** Norton 1952 (Monthly Weather Review) and the Gleaner's scanned archive could not be opened from here, so Charlie's 17 inches of rain and the Kingston wind come second-hand; the homeless count conflicts (9,000 or more up to about 25,000); and no Charlie surge height, building-code change or fishing-village account was found, so the game makes none of those claims.

A point to keep straight: the government called Gilbert the previous benchmark, and Gilbert was the most damaging storm in living memory, but **Charlie killed about three times as many people in Jamaica** (152 to 154 against 45). The game says so.

### The sound check (`?test=sound`)

Nobody can listen in the build container, so `?test=sound` plays the game's own mixes into an offline recorder (`OfflineAudioContext`) and measures them: each place's bed and each storm moment, then each one-shot played over the bed it meets in the story. It reports peak, loudness and low (under 250 Hz), middle and high (over 2 kHz) levels in dB, and flags clipping, a bed that is too quiet or not silent, a storm step that is not louder than the one before it (in total and in the middle band, which is all a phone speaker plays), less than 20 dB from the calm yard to the storm's peak, and a bang or crack that does not rise above its bed. Every run must report 0 problems. The offline recorder is not tied to a headless page's virtual time, so run it with Playwright, not `--dump-dom`:

```bash
node tools/build.mjs melissa --dev
node pw.js "http://localhost:8765/games/melissa/site/index.html?test=sound" SOUND 150000   # waits for the page title "SOUND 0"; read #autolog
```

The storm levels (`SB_GROAN`, `SB_LIGHT`, `SB_PEAK`) live in `main.js` and the test plays those same objects. This check finds mistakes in levels, not in taste: it is a floor, and a person still has to listen (see "What is left"). What the first run found and the fixes (14 Nov 2026): the 1951 sea was as loud as a gale (now about 8 dB quieter), the storm's middle band hardly grew from the dark to the peak (the peak wind is now 1.5, above the old ceiling of 1, and the howl is louder), bangs and the roof groan were lost under the storm (zinc bang and groan louder; the groan is now its own sound in `sfx.js`, because the engine's `shipCreak` is too quiet), the chainsaw was nearly silent (about 9 dB louder), and the helicopter was all bass that a phone drops (its filter opened up and it is quieter overall). The 1951 room was getting the outdoor wind level; it now counts as indoors like the 1988 room.

## What is left

1. **Build the six character recipes** and swap the stand-ins: **on hold** until the builder fix lands on `origin/main` (owner's note, 15 November 2026), then follow `docs/STANDARD.md` (see "People").
2. ~~Run the layout test at the four sizes.~~ Done 14 Nov 2026: 0 problems at all four. Run it again after any change to the interface text.
3. **Look at every place** in close screenshots (the 1988 yard, the room, the village after the storm, today). Only the 2025 yard, the hall, the storm in the hall and the village today have been looked at so far. The wreckage (zinc sheets, wires, tarps, the fallen tree) needs a pass for how it reads from the lane.
4. **Read every line aloud** for the 6+ level (lines of about 12 words or fewer). All dialogue is new wording.
5. **Check Gilbert in the west** in the Gleaner archive (see above). Charlie and the older storms were checked on 15 November 2026 (see "Checked"); what is left is Norton 1952 and the scanned Gleaner pages, which need hosts this build container cannot reach.
6. **Real people.** Nobody real speaks. If the owner wants a real official or a real survivor, use only words from the record.
7. **Source the Gilbert dishes and the Kingston contrast** (see above). The Charlie details used in chapter 1 were checked: the Friday night and the landfall just south of Kingston are confirmed, and block houses did better than board and "nog" houses; no source speaks of fishing villages, so the 1951 bay, family and Miss Ivy stay made up.
8. **Sound** is measured (`?test=sound`, 0 problems) but still not heard. A person needs to play it once with speakers and a phone and say what is wrong: the helicopter and the chainsaw are the likeliest to need a nudge, and the levels were set by numbers, not by ear.
9. **`docs/ARCHITECTURE.md`**: the menu card (with its picture) and the `CLAUDE.md` index line are done; the ARCHITECTURE.md mention is left. The menu picture shows the village road at dusk and does not yet show Charlie or the Kingston street.
10. **Phones.** Rain and sway cost little (one set of lines, one set of points), but measure with `?shot=y25a&stats` and on a real phone.

## Look-alikes (17 November 2026)

`?test=audit` now runs the look-alike check (`placeFaces`, `engine/faces.js`) in every place: 3 lines before (two workmen in the 1951 yard, Simone beside a helper on her own body in the hall, two elder women after the storm), 0 now. `ensurePlace` in `main.js` calls `spreadBodies`, which gives each background person one of the body's three faces (the light copies were already in `site/models`). The other 17 lines of `?test=audit` are scenery that overlaps, from before this change.

## Audit 0 (17 November 2026)

`?test=audit` went from 17 lines to 0, held 0. Scattered stones keep apart and stay out of the houses along the far side and away from the post. In Kingston 1988 the third hibiscus stands beside the drive, and the drive stops at the front of the house. The cut logs that take the fallen mango's place are marked `userData.soft`, so the audit does not compare them with the tree they replace.

## Doors (17 November 2026)

The owner sent a picture of a door that was only a flat brown box and said each door should fit its building, not be one shared door. Each house now names its own front door, built in `games/melissa/src/doors.js` and chosen in `places.js` (`house({ door: [builder, options] })` in `houses.js`).

| House | Door | Why |
|---|---|---|
| The family's board house, 1951 | `boardDoor51`: upright boards, plain on the outside (the ledges and braces are on the inside), two small butt hinges, a hasp and a wooden turn button, bare timber | the plain board door of a Jamaican board house of the time (see the photographs below) |
| The same house, 1988 | `jalousieBoard88`: the board door painted green, a wooden jalousie let into its top half, a cheap knob set | families kept and mended the old door, adding air and a lock |
| The family's block house, 2025 | `scrollGrille25`: a moulded door with a small half-moon light behind a white scrolled iron grille gate with a padlock | burglar-bar gates on front doors are usual on Jamaican houses today |
| Miss Hyacinth's old board house | `pairBoard`: a pair of narrow board leaves, the top third a fixed wooden jalousie, painted to match her shutters, strap hinges and a bolt | the double doors of older Jamaican cottages, opening onto the veranda |
| Miss Ivy's block house, 1951 | `jalousiePair51`: a pair of full-height wooden jalousie doors with a middle rail, painted green, brass knobs | block houses of the 1950s let air through their doors as their windows did |
| Mass Clifford's block house, 1988, and Raymond's, 2025 | `panelGrille88`: a varnished hardwood door of six raised panels, brass lever, behind a flat-bar burglar-bar gate with a padlock | the grille came in with the 1970s and 1980s; Raymond's is the same door, darker, with a darker gate |
| The church | `churchDoors`: a pair of tall board doors under a pointed arch, strap hinges, iron ring handles | the Gothic arch of a Jamaican village church |
| The shops | `shopDoor`: a board door with an iron bar across in staples and a padlocked hasp, behind the counter | shops were barred at night |
| Uptown house, Kingston 1988 | `villaDoors`: a pair of carved hardwood doors with a diamond on each tall panel, brass levers, behind a white scrolled grille | an uptown house of the 1980s |
| Downtown yards, Kingston 1988 | `boardDoor51` in five paints, some braced, some padlocked | old board doors, painted over the years |

**Still stand-ins (work to do):** these are built from general knowledge of Jamaican houses, not from one photograph of each kind. Find and cite photographs (National Library of Jamaica, the Jamaica National Heritage Trust's vernacular architecture work, Gleaner archives for 1951 and 1988) for: the 1951 batten door (and whether its ledges faced out), the 1950s jalousie doors, the 1980s grilles, and the church's door, and adjust shapes and colours to match.

### Photographs checked (17 November 2026)

The owner asked for the doors to be checked against photographs of the time. What was found, and what changed:

- **Board doors, 1940s to 1988 (`boardDoor51`, also the shops and the downtown yards).** Sources: National Library of Jamaica (NLJ), "Rural Housing Scheme with sanitary convenience set apart from main structure" (D0003666, undated, about the 1940s or 1950s, https://nljdigital.nlj.gov.jm/items/show/1978): small houses on posts with horizontal weatherboards, each with one plain, flat, dark door. NLJ, "Wooden house with roof shingles" (Charles R. Pancoast glass slide, D0005799, https://nljdigital.nlj.gov.jm/items/show/5096): a tall door of plain upright boards in a board front on the street, nothing on its face. Jamaica Gleaner, "Photo Flashback: Hurricane Gilbert, September 1988" (https://past.jamaica-gleaner.com/article/esponsored/20230922/photo-flashback-hurricane-gilbert-september-1988), the photograph of Manchioneal, Portland, two days after Gilbert: a weatherboard house whose door is plain boards outside, with no ledges, braces or strap hinges showing. In every photograph where the outer face of a closed board door can be seen it is plain boards; none shows ledges or Z braces outside. **Changed:** `boardDoor51` now shows plain boards with two small butt hinges at the jamb; the ledges, braces and strap hinges are gone from the outside (they are on the inside, where the door swings). They can be put back with `ledgesOut: true` if a photograph of that kind turns up. The hasp and turn button stay. Sizes and position are unchanged.
- **The 1988 board door (`jalousieBoard88`).** The same Manchioneal photograph shows a split door (a "half door"): the bottom half shut, the top half open for air. That is one house, so the family's door is **kept** as it is (painted boards with a jalousie in the top half, which also lets air in). A half door would also fit the photograph, if the owner wants one.
- **Board houses, 2025.** Jamaica Gleaner, "Wooden worries, land title troubles" (16 November 2025, https://jamaica-gleaner.com/article/lead-stories/20251116/wooden-worries-land-title-troubles), photographs from Retirement, Westmoreland, after Melissa: board houses of horizontal boards; a window has a white diamond-pattern burglar grille over glass. It shows no front door closely, so the 2025 doors are **kept**.
- **Gilbert-era grilles (`panelGrille88`, `villaDoors`, `scrollGrille25`).** NLJ, "Burglar bars at National Chest Hospital" (Agency for Public Information, November 1981, https://nljdigital.nlj.gov.jm/items/show/6653) confirms burglar-bar grilles in Kingston by the early 1980s, but the photograph is too small to show a pattern. NLJ "St. Ann's parish library after Hurricane Gilbert" (https://nljdigital.nlj.gov.jm/items/show/7497) and "UWI grounds after hurricane Gilbert" (https://nljdigital.nlj.gov.jm/items/show/7004) show roofs, not doors. **Kept**; still to find a 1988 photograph of a house door grille.
- **Not found (kept as built, still stand-ins):** the 1950s wooden jalousie doors (`jalousiePair51`), Miss Hyacinth's pair (`pairBoard`), the church doors (`churchDoors`) and the uptown house (`villaDoors`). The NLJ "Houses damaged by flood in Morant Bay" (D0007558, https://nljdigital.nlj.gov.jm/items/show/6746) shows a door standing open with a diagonal brace, but it cannot be told whether that is its inside face, so it was not used.

