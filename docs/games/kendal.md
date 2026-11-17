# Kendal 1957: The Excursion Train (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the systems, the research and what is left to polish.

- Code: `games/kendal/src/` (split into modules, see "Code map"). Page and styles: `games/kendal/site/index.html`.
- Models: `games/kendal/site/models/*.js` (13 character bodies made for this game and their light copies; recipes in `tools/kendal/people/`, see "Characters" below). The animation library is copied in by the build and trimmed to the 44 clips this game plays (`games/kendal/anim-clips.json`). If you play a new clip, add its name there, or the build's copy will not have it.
- Build: `node tools/build.mjs kendal --dev` (test views and the autoplayer) or without `--dev` (public).
- Status: all seven chapters are playable. It is new, so expect polish work (see "What is left").

## The story

It is Sunday 1 September 1957. A long train takes a church group from Kingston to Montego Bay for the day. On the way home that night it runs away down the hill at Kendal and crashes. It is the worst railway disaster in Jamaica's history. The game tells the history of the railway first (how people travelled before trains, the first train, the hill railway), then the day, the night, the crash, the long night of helping, and how Kendal remembers today.

You are fictional: a child, first person, at a child's eye height (1.32 m). Gran, Cousin Lloyd, Mass Ezra and everyone you meet are fictional. The railway, the crash and the helpers of Kendal are real.

Mass Ezra is the thread through the story. He is the boy at the hill station in the 1890s (chapter 3). In 1957 he is the old railwayman who gives you his hand lamp in chapter 4. You carry that lamp through the night at Kendal in chapter 6. His grandfather is Mass Dudley the muleteer (chapters 1 and 2).

| # | When and where | Walk and do | Remembered choice |
|---|---|---|---|
| 1 | About 1844, the Spanish Town road (`road`) | Talk to a muleteer, a higgler and a traveller, load the mule (3 taps), walk to the surveyors and hear about the railway plan | Whether the railway will help, take work, or you are not sure. Mass Dudley remembers it in chapter 2. |
| 2 | 21 November 1845, the Kingston terminus (`station45`) then the open carriage (`ride45`) | Talk to Mass Dudley, a boy and a clerk, look at the engine Projector, climb aboard, ride out across the marsh, pass the water bucket at the Rio Cobre bridge (3 taps), ride back at about 30 mph | None |
| 3 | The 1890s, a hill station (`hill`) | Talk to the stationmaster, the foreman, a farmer and young Ezra, carry 4 banana bunches to the wagon, watch a steam train climb in (cutscene), check three brakes with the foreman | None |
| 4 | Sunday 1 September 1957, Kingston Railway Station (`kingston57`), the coach by day (`coach`), a beach (`beach`) | Talk to Gran, Lloyd and Mass Ezra (he gives you his lamp), walk the long train to the last coach, ride to Montego Bay, do two of three things at the beach (splash, build a sandcastle, hear a mento band) | What you did at the beach (it appears in "Your journey") |
| 5 | Sunday night, the coach (`coach`), then the crash | Talk to Gran, Lloyd and the mother, look out of two windows, sit down with Gran, then the crash sequence (see below) | None. You can choose "Read what happened instead" at the card before the crash. |
| 6 | About half past eleven, the crash site (`crash`), night to dawn | Stay with Gran and talk to Mr. Clive, carry water twice to the nurse, find a lost girl, take her to the calling place, hold your lamp up, wait for morning | None |
| 7 | Today, the memorial at Kendal (`memorial`) | Talk to Miss Joy and Andre, read the storyboard and the monument, leave a flower, answer Andre's question | Why we remember Kendal (safe, honour, or thank the helpers) |

Rule of truth: real events stay as they happened. Choices change only what people say and the "Your journey" page.

### The crash sequence (chapter 5, `crashRun` in `main.js`)

Same dramatic idea as the Port Royal earthquake: an opt-in card first ("It is loud, and it may be scary" with "Begin" or "Read what happened instead"), then phases. In order: Greenvale and the long way down, Lloyd and Gran lines as subtitles, the train speeds up (shake grows, clatter quickens), three whistle blasts, the brakes scream (orange flickers, a Hold on! button you can hold), the coach tilts and the lamps flicker, the crash (a big sound, a white flash), black and a thin ringing, a title card "Kendal, Manchester, Sunday night, 1 September 1957", then a slow fade into the night at the crash site. Nobody is hurt on screen. After the crash the game never shows the dead. The next chapter is about the helpers.

## Code map

`games/kendal/src/`:

| File | What it holds |
|---|---|
| `main.js` | renderer and sky, controls, people, the place registry (`buildPlace`, `ensurePlace`, `enterPlace`), the journal, cards, the cinematic layer (`bars`, `say`, `flash`, `fadeBlack`, the camera director `cut`), saving, chapters and stages (`setStage`, `ON[stage]`), rides (`RIDE`), actions (`ACTIONS_FOR`), the crash (`CR`, `crashRun`), the loop, test views and the autoplayer |
| `storylife.js` | a little life for people who stay in one place (stance changes, a head that glances and looks at you) |
| `motioncheck.js` | `?test=motion`: frozen, in-step, head, spin, walking in place and sliding checks (dev only) |
| `checktables.js` | the hooks and tables for the shared `?test=all` runner (dev only) |
| `content.js` | every word the player reads: `CHAPTERS`, `TALK` (first conversations), `LATER` (short later lines), `JOURNAL` |
| `steps.js` | the story as step tables for `engine/story.js`: each stage's goal, who and what it needs (talk, do, go), and the stage after it; `placeOfStage` |
| `life.js` | what every background person does, as data for `engine/ambient.js` (`lifeFor(P)`: crowds mixed into chats, errands, watchers and children at play; the mento band; the helpers at the crash site) |
| `cast.js` | `LOOKS` (a body plus colours per person) and crowd generators (`crowd57`, `crowd45`, `villagers`) |
| `places1.js`, `places2.js` | the nine places: geometry, walking bounds, walls, people, spots for actions |
| `decor.js`, `detail.js` | the extra detail (instanced grass, flowers, stones, fences, flame trees, mango trees, bamboo, birds). `DECOR[place]` runs before a place is merged. |
| `trains.js` | one line: track, steam engines (1845 and 1890s), a 1950s diesel, wooden coaches, 1845 carriages, wagons, platform and smoke, built by the shared `engine/vehicles.js` with Kendal's `gfx.js` (Bog Walk uses the same vehicles; change them there, and check both games) |
| `props.js` | plants, hills, houses, animals, small things, accessories held in a hand or worn |
| `common.js` | times of day (`ENV`, `mixEnv`), the station base (a sunk track beside a raised platform), the scrolling scenery rig for rides |
| `gfx.js` | textures drawn in code, shared materials, the sky, `batchStatic` |
| `sfx.js` | railway sounds made in code: whistles, horn, clatter, brakes, the crash, ringing, bells, crickets, mento |

### How a game moves

- `stage` is the story as a number: chapter n uses stages n0 to n9 (chapter 1 is 10 to 14, chapter 2 is 20 to 25, and so on; the 1845 water stop is its own step, 23.5, and the ride on after it 23.6). Every stage is a step in `steps.js`, run by `engine/story.js` (`STORY` in `main.js`): `setStage` enters the step, a whole first talk or a task calls `STORY.done(id)`, and the last need moves on through `advance` (or a short closing scene, `OUTRO`). `ON[stage]` runs scripted scenes. `DONE` (in `main.js`) says which stage finishes each chapter; `CHAPTER_END` (in `content.js`) which stages show the end card.
- **Story flow (owner's three rules, `docs/STANDARD.md`).** Only the step's story people have the gold mark and move the story; anyone else gives one flavour line (`LATER`), and the lady, the guard, Miss Pearl and the boy on the ride give their full talk once (`meet`). Counts show in every goal with more than one thing to do. The arrow shows 2.5 s after a new goal (5 s at the beach and the memorial), even while you walk, points only at what is still needed (round walls, `walkRoute`), and gives way to the talk button within 2.7 m. Every task shows: the goods fly onto the mule; the water bucket goes hand to hand on the 1845 ride (`HAND`, `createCarry`, your left hand); you carry each banana bunch from the pile and it stays in the wagon; each brake handle is pulled down and tagged; a splash of spray, the sandcastle, sitting down by the band; you carry a full bucket from the pipe and it is left by the nurse; Mass Ezra's lamp is in your right hand from the moment he gives it. A saved game keeps the step's progress (`flow` in the save) and `STORY.restore` puts the scene back.
- **Background life (`engine/ambient.js`, `life.js`).** One system per place (`P.life`, made in `makeLife`): it moves, turns, animates and grounds the background people (`n.amb`), and `npcTick` and the loops in `update()` leave them alone. Everyone keeps clear of the story's ways through the place (`placeKeep`: from the start to everything any step there needs, round walls, and a space round each); anyone standing on one is moved aside when the place is made (`offPaths`). Moods: lively on the road, at the stations and the beach, calm in the coach at night and at the memorial, sad at the crash site (some lively people go, nobody laughs or plays, nobody freezes). Lloyd plays near Gran on the platform except in his own step. Clip rules (rule 4): no fear, falls, fights or shouting in background life; the Hurt clips only stand (`HurtIdle`, far from the story); Sister Louise calls out names (`Yell`, now and then) as a story person, not as background life.
- **Animations, November 2026.** Men talk with `TalkM1`, `TalkM2` (seated men `TalkM3`) and walk with `WalkM2`; elders idle on `OldIdle`, men on `IdleM`; Miss Cleo stands on `CarryHeadIdle`; the navvies carry baskets of earth on their heads (`CarryHeadWalk`); banana carriers at the hill station; people with cases walk with `CarryBagWalk`; the mento band plays (`PlayGuitar` with a guitar, `PlayGuitar2` with a banjo, the rumba box player sits on his box on `PlayPiano`) and listeners sway (`ListenMusic`); at the crash site Nurse Gray kneels by a man on a log (`Kneel`), helpers kneel at the gully edge, lamp holders lift their lamps (`TorchIdle`), Mr. Clive too, Gran rests a hand on Lloyd's shoulder (`ComfortChild` and `ComfortTake`, placed as `docs/PIPELINE.md` says, `with` tells the audit they stand close on purpose), and in the crash run Lloyd and some passengers hold on to their seats (`SitScared`). Anyone holding something, kneeling or in a pair keeps their pose while talking (`gestureFor`).
- **Scattered detail never cuts into anything.** `declutter(P)` (in `main.js`) takes out a stone, tree, hut or piece of luggage scattered for detail (`userData.decor`, rock fields) that cuts into something else, before the place is merged.
- **Journal pages.** A new page makes the Journal button glow, with the number of new pages on it, and a soft chime (`SFX.chime`); its toast waits until any dialogue box has closed (`TOASTQ`), so it never covers one. Opening the journal clears the glow.
- Places are built when needed. `buildPlace` makes geometry only (the title screen uses Kingston station this way). `ensurePlace` also loads the people. After the first chapter starts, `backgroundLoad` loads the rest quietly.
- Rides (chapter 2, 4 and 5): the vehicle stays still and the scenery scrolls past (`makeRig` in `common.js`, `RIDE` in `main.js`).
- Timed scenes use `run([[ms, fn], ...])`, `tween`, `cut` and `waitFor`. They stop themselves when the chapter changes (`EP`, the "epoch").
- Characters: 13 bodies (`man_work`, `man_suit`, `man_shirt`, `man_elder`, `man_apron`, `woman_long`, `woman57`, `woman_elder`, `boy`, `girl`, `girl_small`, `guide2020`, `student2020`). A person is a body plus a colour per garment and a choice of hat (`cast.js`: `LOOKS`, `HATS`). Children are real child bodies, stored enlarged and shrunk by `scale` (`KID` in `cast.js`), never small adults. People you talk to use the full body. Background figures use a light copy (`<name>_lo.js`, about 5,900 to 6,300 triangles: `pack.mjs` aims at `--lomax`, default 5,900, and the small pieces it never simplifies come on top). Rebuild with `tools/garvey/era.py` and `node tools/people/pack.mjs --out games/kendal/site/models --lo <names>` (see `docs/PEOPLE.md` and `docs/PIPELINE.md`). Kendal is the model every game copies for people (`docs/STANDARD.md`).
- Carrying: a thing in a hand uses `grip()` from `engine/grip.js` (the fingers close round the handle, the arm lifts clear of the body). `spreadArms()` keeps empty hands out of skirts and jackets. `GRIP` in `main.js` sets each item's size and lift. After changing these run `?test=held`.
- Dev model viewer: `?shot=model&m=diesel` (also `coach`, `early`, `late`, `mule`, `mule3`, `cart`, `truck`, `props`...), and `?shot=model&m=people&ids=gran,lloyd&one&a=1.57&d=1.9&h=1.5&t=1.45` lines people up for a close look (`&lo` for light copies, `&hold=suitcase` to test a grip).
- Speed budget for the web: shared materials plus `batchStatic` merge each place's still scenery into a few meshes; grass and flowers are instanced; background figures are light and are hidden beyond 75 m. Real shadows are on for computers and off on phones, which get soft blob shadows under people instead. Measure with `?shot=k2&stats`.

## Coordinates

Metres. `yaw = 0` looks toward -z. Trains run along x and face -x. Vehicle floors and platform tops are y = 0, so rail tops are y = -1.1 where there is a platform.

| Place | Notes |
|---|---|
| `road` | the road runs along x from -60 to 60; you start at x -36 and walk east; the railway works are at x 20 to 44, north of the road |
| `station45` | track at z -3; platform north of it; the Projector, a first-class carriage, two open ones and the state carriage; you stand at z 0 to 14 |
| `ride45`, `coach` | rides: you walk in the aisle only; the scenery rig scrolls outside |
| `hill` | track at z -3, a wooden platform, a hut, a water tower at x 34, two wagons at x -20 and -13, the banana pile at (-14, 5.6); the arriving train starts at x 90 |
| `kingston57` | twelve coaches (rear at x 33, 11.8 m apart) and two diesels far to the west; the station building behind the platform at z 14 to 23 |
| `beach` | sea to the north (-z), sand to the south; the band at (14, 4), the sandcastle spot (-12, -2.6) |
| `crash` | the line at z 0 on a low bed; two coaches stay on the rails at x 12 and 24; the wreck lies in the gully on the north side (z -4 to -26); the road and trucks at z 30; the calling place at (-6, 15), the pipe at (26, 8) |
| `memorial` | the old track at z 8 under grass; the monument at (4, -9.5); the storyboard at (-8, -4) |

## Test it

```bash
node tools/build.mjs kendal --dev          # dev build
python3 -m http.server 8765                # then open http://localhost:8765/games/kendal/site/
```

- Views (`?shot=NAME`, dev build only): `road1` to `road3`, `st1` to `st3`, `ride1`, `ride2`, `hill1`, `hill2`, `k1` to `k4`, `coach1` to `coach3`, `lurch`, `beach1`, `beach2`, `crash1` to `crash5`, `mem1`, `mem2`, `talk1`, `talk2`, `card1`, `journal1`, `chap1`, `poster`. Add `&stats` to print draw calls and triangles to the page title. Add `&noshadow` to turn shadows off.
- Autoplayer: `?auto=N&one` plays chapter N (1 to 7). Without `&one` it carries on to the next chapter. It logs every change of stage, place, journal pages and cards to the page title and to `#autolog`, and writes `STALL` if nothing changes for 30 seconds. It skips drawing, because software drawing is slow. Read the log like this:

```bash
timeout 290 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader --window-size=320,240 \
  --virtual-time-budget=150000 --dump-dom "http://localhost:8765/games/kendal/site/index.html?auto=5&one" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
```

- Engine views: `seat1` to `seat3` (the coach benches), `sit1` (benches at the crash site), `loco1` to `loco4` (the 1890s engine), `eloco1`, `eloco2` (the 1845 engine), `bunch1`, `bunch2` (banana bunches), `mule1`, `mule2` (the loaded mule).
- **Automatic checks (a rule for every game, see `docs/TESTING.md`, section 5).** Each place must report 0 issues:
  - `?test=audit` (or `&p=hill,road`): floating signs and lamps, people inside solids, unreachable spots, people standing inside each other, and seated people (seat through the thighs, hanging, sitting on nothing). Add `&seats=1` to print each seated person's hip height. The code is `engine/audit.js`.
  - `?test=held`: carried things are at the hand and clear of the body.
  - `?test=layout`: interface overlap, clipped text and off-screen items, in each state. Run it with the window at 390x800, 667x375, 800x500 and 1280x720.
  - `?test=resume`: a saved game resumes in the right place.
  - `?test=skin`: how dark each face is drawn in daylight (`engine/skinprobe.js`).
  - `?test=walkers`: every body walks without sliding, sinking or jumping (0 issues).
  - `?test=cloth`: under layers that show through their cover. On 14 November 2026 it printed 9 lines (15 points) for Kendal, down from 354 lines (6,840 points). What is left is a few points where a shirt tail meets the trousers when a person sits (`man_shirt`, `man_elder`, `man_work`, `man_apron`, `student2020`), a tie edge against the waistcoat, a boy's knee against his shorts when striding, and one jacket hem when sitting. Garvey's `?test=cloth` (same check, 21 bodies) printed 7 lines (49 points). See `docs/PIPELINE.md` section 5 for the cloth rules that removed the rest.
- The menu poster `menu/kendal.jpg` comes from `?shot=poster` at 1280 by 720 (the HUD is hidden).

## Research (checked 13 November 2026 against secondary sources only)

None of this was checked against the Jamaica Railway Corporation's own records, the 1957 Commission of Enquiry report, or newspaper archives. Do that before treating dates as final. Where sources disagree the game says "about" or "some say".

| Fact | Used as | Source and caveat |
|---|---|---|
| Crash on Sunday 1 September 1957 near Kendal, Manchester, late at night | About half past eleven; the journal also says some sources say ten past eleven | Jamaica National Heritage Trust (JNHT) site page; Gleaner; National Library of Jamaica (NLJ) "Lives Derailed" gives about 11:10 |
| Church excursion of the Holy Name Society of St. Anne's Roman Catholic Church, Kingston, to Montego Bay | Used. The priest's name differs (Earle or Eberle), so he is never named. | JNHT; Gleaner; NLJ; Espeut (Gleaner, 2026) |
| About 1,600 people; two diesel engines; twelve wooden coaches; 130 to 150 per coach against a limit of 80 | Used | Gleaner (history pages and 2024 article); NLJ |
| Three whistle blasts, the train sped up, derailed on a curve; eight of twelve coaches wrecked; two rear coaches stayed on the line; one coach ran on about a quarter of a mile | Used | JNHT; NLJ; Gleaner (2020 railway article says about 55 mph at the foot of the slope, one source) |
| Downhill from Greenvale, the highest station on the line | Used. Its height (1,890 ft) is one source, and the line's summit near Kendal is given as about 1,700 ft by another. | Espeut; Wikipedia, Kingston to Montego Bay railway |
| Cause: the Commission of Enquiry found a closed angled wheel (brake) cock, "probably the result of vandalism" (Espeut) or incorrectly placed (JNHT); poor brake maintenance; overcrowding | The game says a brake valve was closed, it could not be sure how, and many things went wrong together. It does not decide. | JNHT; Espeut; Gleaner |
| Dead: 187 is the common figure; also 175, 178, 200. About 700 hurt (400 to 700). The monument lists 177 names. | "Close to 200" and "about 700" in the story; the journal gives the range | Many; Observer (September 2025) for the 177 names |
| Helpers: hundreds from the area came; torches and crowds; passing vehicles; hospitals at Spaldings, May Pen and Mandeville; volunteers and blood asked for; survivors went home on a banana train on the Tuesday | Used in general terms. No real helper is named. | NLJ; Gleaner 2017 and 2024 |
| National Day of Mourning on Friday 8 September 1957; mass burial on the third day near the site; Governor Sir Hugh Foot visited the church and unveiled a plaque | Used in the journal | NLJ; Espeut |
| Metal coaches replaced all wooden coaches; the Jamaica Government Railway became the Jamaica Railway Corporation (1960) | Used | JNHT; Wikipedia |
| 1 September named a day of remembrance in 2017; a National Day of Remembrance for ever in 2024 (Governor-General Sir Patrick Allen); monument unveiled in September 2025; a museum and memorial park planned for 2027 | Used | Observer (2018, 2025, 2026); Gleaner (2026) |
| First railway in a British colony: Kingston to Spanish Town (Angels), opened 21 November 1845; Governor Lord Elgin; engines Projector and Patriot built by Sharp Brothers of Manchester; the Smith brothers (William and David); the first section cost £222,250 against £150,000 | Used | Wikipedia; Gleaner; a newspaper account of 1845 reprinted by the Historic Jamaica blog |
| The 1845 opening day: about an hour to Spanish Town with a stop for water at the new Rio Cobre bridge; about 40 minutes back at up to 30 mph; the 1st West India Regiment band | Used | The same 1845 account |
| Old Harbour 1869; Porus 1885; Montego Bay 1894 or 1895 (sources differ); government took over in 1900; banana shipments by rail rose from about 330,000 stems (1880) to 24 million (1930); bananas had to reach a ship within two days | Used with "in the 1890s" | Wikipedia; Gleaner (2020) |
| Passenger trains stopped in 1992; a short service ran 2011 to 2012 | Used | Wikipedia; Gleaner |
| The Balaclava crash on 30 July 1938, 32 dead | Mentioned once in "Dig deeper", marked as one source | Wikipedia, Jamaica Railway Corporation ("30 July 1938 ... 32 people died and over 70 were injured"), checked 16 November 2026 |
| The line from Bog Walk to Port Antonio, finished in 1896 | Used in the journal | Wikipedia, Jamaica Railway Corporation ("from Bog Walk to Port Antonio in 1896"), checked 16 November 2026 |
| Slavery in the British Caribbean ended on 1 August 1834; apprenticeship ended in 1838; Kingston became the capital of Jamaica in 1872 (in place of Spanish Town) | Used in the journal | Standard dates: Slavery Abolition Act 1833 (in force 1834), apprenticeship ended 1 August 1838; Wikipedia, Spanish Town and Kingston, Jamaica |
| A museum and memorial park planned for the 70th anniversary of the crash (2027) | Used in the journal | Observer (2026); 1957 + 70 = 2027 |
| How people travelled in the 1840s (mule, cart, horse, on foot; poor roads) | General knowledge, stated simply. We did not find a source for journey times by road, so no figure is given beyond "most of a day". | Not found |
| Mento (banjo, guitar, rumba box) in the 1950s; a band on a beach that day | The journal says this is general knowledge and that we have no source for a band at the beach | Not found |

Real people in the game: none speak. The Governor stands silently in 1845. Father, survivors and named victims never appear. Words on the plaque and storyboard are our own, and the journal says so.

Look and feel: the 1957 diesel follows a National Library of Jamaica photograph of one of the railway's English Electric hood engines (two four-wheel trucks). We do not know which engines pulled the train that night. Every colour, the whole shape of the wooden coaches, the 1845 engine and carriages, the truck and the 1950s clothes are still guesses; the code comments say so.

## Season 1 finish (16 November 2026)

What this pass checked and changed (branch `claude/kendal-par`):

- **`?test=all`** is wired (`checktables.js` holds the hooks and tables; `checkHooks()` in `main.js` hands the game over). Run it with `&noshadow` at 390x800, because phones draw no shadow maps and the budget check counts draw calls. It also runs this game's own `motion` check.
- **`?test=motion`** (`motioncheck.js`, new): every step of the story, played on the real frame loop while you walk to each thing the step needs. It fails on anyone in view frozen on an idle clip (over 12 s, 20 s in a calm or sad scene), three or more people in step on one clip, a head turned over 80 degrees from the chest, nodded over 60, or turning faster than 320 degrees a second and faster than the clip does on its own, a body spinning (over 240 degrees a second standing, 600 walking), walking in place, or sliding on a standing clip. `&st=40,61` picks steps. Its first run found 88 faults; the fixes below brought them down.
- **Story people are alive** (`storylife.js`, new): while they wait for you they change stance now and then (another idle, a nod, a look round, another way of sitting) and their heads glance about and turn to you when you come near, eased and limited. A background person held still for their own step (Lloyd on the platform) changes stance too.
- **Nobody spins:** `faceTo` turns at most about 170 degrees a second, and `turnLimit` caps every body's turn at 200 degrees a second standing and 315 walking (the shared ambient walk turned corners at up to 700).
- **No loop starts in step:** every looping clip started through a body's controller starts at a random moment.
- **Walk pace:** `STRIDE_K` in `main.js` corrects the engine's stride measure per body and clip (measured with `?test=walkers&tune`); WalkM2 and CarryBagWalk had been sliding 22 to 25 cm a loop. Background life uses the same stride through `createAmbient({ stride })`.
- **Faces at night (rule 9):** Skin glows a little with its own colour, more the darker the light (`skinFill`: 0.1 by day, about 0.55 at night). Faces at the crash site and in the night coach were brightness 10 to 25 from their dark side; the faces check is now clean.
- **Phones:** each standing (or always seated) background figure is joined into one skinned mesh at load (`joinBody`), and each strip of passing scenery on a ride is merged (`batchStatic`). Draw calls without shadows: Kingston station 693 to about 310, the coach 1,037 to 168, the 1845 ride 509 to 103, the beach 404 to about 150, the crash site 529 to about 290.
- **Saving:** a game saved during the 1845 water stop (steps 23.5 and 23.6) now resumes at the station before boarding instead of at the station with the bucket task.
- **Walls at the edge** no longer push you off the map (the hill station, `clampPos`).
- **Tap targets:** the folded goal, the journal's tabs and "Dig deeper" are at least 44 px.
- Gran's full body (`woman_elder`) never walks in this game and sinks 3.1 cm at one heel strike, so `?test=walkers` checks the light copy every walking elder uses; Eventide and Melissa, which also ship `woman_elder`, should check theirs.
## What is left (polish list)

1. **Check facts in primary sources** (the Commission of Enquiry report, the 1957 Daily Gleaner, the railway's records) and remove the "one source" notes.
2. **Read every line aloud** for the 6+ level. All dialogue is new wording.
3. **Characters.** Collars of 1957: `collar: "camp"` (an open pointed collar over a V neck: `boy`, `man_elder`, `student2020`, `woman57`) and `collar: "round"` (a flat round collar: `girl`, `girl_small`, `woman_elder`); `man_shirt` and `man_suit` keep the closed turn-down collar and tie, `man_work` its plain neck. `puff` gives short puffed sleeves, `sash` a deep waistband (material `Belt`), `pocket` a patch pocket (material `Pocket`). In the game a collar takes the shirt's tint unless `Collar` is set. Light copies are packed with their clothes kept finer than their skin (`tools/people/pack.mjs`), 5,925 to 6,273 triangles in November 2026. Rebuilt in November 2026: 1950s frocks and church hats, suits and trilbies, a guard's uniform and cap, real children. Still to do: faces repeat (13 bodies); the 1957 clothes are general pictures, not copied from photographs.
4. **Places against photographs.** Kingston station, the coaches (colours, markings) and the 1845 engine are general pictures.
5. **Sound.** A real mento recording and a recorded steam whistle would beat our synthesised ones.
6. **Memory on phones.** The first load fetches about 3 MB of characters; later chapters load in the background. Consider splitting `anims.js`.
7. **The 1957 train's coach count in the station** is 12, but each coach is 11 m (real ones were longer). The platform is shorter than the real one.
8. **Accessibility.** The crash can be skipped, but there is no setting to turn off screen shake. Add one.

## Look-alikes (17 November 2026)

No two people with one face stand or walk side by side (`docs/PEOPLE.md`, section 5b). `ensurePlace` in `main.js` calls `spreadBodies` (`engine/faces.js`) after `lifeFor`, so each background person's whole walk is counted, not only where they start. Three fallbacks when a body's three faces run out: a girl becomes the smaller girl's body (`girl` and `girl_small` wear the same pieces), a wanderer or someone on an errand stays and watches instead (`settle` in `life.js`), and children chase only the nearest child within 12 m (a chaser used to cross the whole platform after a far partner and meet every child on the way). `?test=audit` now also runs the look-alike check on the story people and extras of every place (`placeFaces`). `?test=ambient`: 4 look-alike lines before (8 with the check counting the nearest two people came in the whole run), 0 now. `?test=audit`: 0. `?faces=woman57` on any dev URL prints who got which face and the box each one stays in.
