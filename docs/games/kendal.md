# Kendal 1957: The Excursion Train (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the story, the systems, the research and what is left to polish.

- Code: `games/kendal/src/` (split into modules, see "Code map"). Page and styles: `games/kendal/site/index.html`.
- Models: `games/kendal/site/models/*.js` (13 character bodies and their light copies). The animation library is copied in by the build.
- Build: `node tools/build.mjs kendal --dev` (test views and the autoplayer) or without `--dev` (public).
- Status: all seven chapters are playable. It is new, so expect polish work (see "What is left").

## The story

It is Sunday 1 September 1957. A long train takes a church group from Kingston to Montego Bay for the day. On the way home that night it runs away down the hill at Kendal and crashes. It is the worst railway disaster in Jamaica's history. The game tells the history of the railway first (how people travelled before trains, the first train, the hill railway), then the day, the night, the crash, the long night of helping, and how Kendal remembers today.

You are made up: a child, first person, at a child's eye height (1.32 m). Gran, Cousin Lloyd, Mass Ezra and everyone you meet are made up. The railway, the crash and the helpers of Kendal are real.

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
| `content.js` | every word the player reads: `CHAPTERS`, `GOALS`, `TALK` (first conversations), `LATER` (short later lines), `JOURNAL` |
| `cast.js` | `LOOKS` (a body plus colours per person) and crowd generators (`crowd57`, `crowd45`, `villagers`) |
| `places1.js`, `places2.js` | the nine places: geometry, walking bounds, walls, people, spots for actions |
| `decor.js`, `detail.js` | the extra detail (instanced grass, flowers, stones, fences, flame trees, mango trees, bamboo, birds). `DECOR[place]` runs before a place is merged. |
| `trains.js` | track, steam engines (1845 and 1890s), a 1950s diesel, wooden coaches, 1845 carriages, wagons, platform, smoke |
| `props.js` | plants, hills, houses, animals, small things, accessories held in a hand or worn |
| `common.js` | times of day (`ENV`, `mixEnv`), the station base (a sunk track beside a raised platform), the scrolling scenery rig for rides |
| `gfx.js` | textures drawn in code, shared materials, the sky, `batchStatic` |
| `sfx.js` | railway sounds made in code: whistles, horn, clatter, brakes, the crash, ringing, bells, crickets, mento |

### How a game moves

- `stage` is the story as a number: chapter n uses stages n0 to n9 plus 10 (chapter 1 is 10 to 14, chapter 2 is 20 to 25, and so on). `GOALS`, `TALK_TARGETS`, `NEXT_AFTER_TALK` and `CHAPTER_END` in `content.js` drive it. `ON[stage]` runs scripted scenes. `DONE` (in `main.js`) says which stage finishes each chapter.
- Places are built when needed. `buildPlace` makes geometry only (the title screen uses Kingston station this way). `ensurePlace` also loads the people. After the first chapter starts, `backgroundLoad` loads the rest quietly.
- Rides (chapter 2, 4 and 5): the vehicle stays still and the scenery scrolls past (`makeRig` in `common.js`, `RIDE` in `main.js`).
- Timed scenes use `run([[ms, fn], ...])`, `tween`, `cut` and `waitFor`. They stop themselves when the chapter changes (`EP`, the "epoch").
- Characters are 13 bodies shared with Marcus Garvey. A person is a body plus a colour per garment (`Shirt`, `Skirt`, `Breeches`, `Hat`, `Hair`, `Shoes`, `Waistcoat`, `Jacket`, `Tie`, `Collar`, `Apron`) and garments can be hidden. People you talk to use the full body. Background figures use a light copy (`<name>_lo.js`, about a fifth of the triangles), made by `node tools/kendal/make_lo.mjs <names>`.
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
| The 1938 Balaclava crash, 32 dead | Mentioned once in "Dig deeper", marked as one source | Wikipedia |
| How people travelled in the 1840s (mule, cart, horse, on foot; poor roads) | General knowledge, stated simply. We did not find a source for journey times by road, so no figure is given beyond "most of a day". | Not found |
| Mento (banjo, guitar, rumba box) in the 1950s; a band on a beach that day | The journal says this is general knowledge and that we have no source for a band at the beach | Not found |

Real people in the game: none speak. The Governor stands silently in 1845. Father, survivors and named victims never appear. Words on the plaque and storyboard are our own, and the journal says so.

Look and feel are guesses: the colours of coaches and engines, the 1950s clothes, the platform, the 1845 carriages. No photographs were found or used.

## What is left (polish list)

1. **Check facts in primary sources** (the Commission of Enquiry report, the 1957 Daily Gleaner, the railway's records) and remove the "one source" notes.
2. **Read every line aloud** for the 6+ level. All dialogue is new wording.
3. **Characters.** There are only 13 bodies, so faces repeat. Women's dresses are the long skirts of 1914. Children are scaled adults. A newer toolchain could make 1950s dresses, a railway guard's uniform and real children (see `docs/PIPELINE.md` and `tools/garvey/README.md`; the Blender tools could not be installed in the build session).
4. **Places against photographs.** Kingston station, the coaches (colours, markings) and the 1845 engine are general pictures.
5. **Sound.** A real mento recording and a recorded steam whistle would beat our synthesised ones.
6. **Memory on phones.** The first load fetches about 3 MB of characters; later chapters load in the background. Consider splitting `anims.js`.
7. **The 1957 train's coach count in the station** is 12, but each coach is 11 m (real ones were longer). The platform is shorter than the real one.
8. **Accessibility.** The crash can be skipped, but there is no setting to turn off screen shake. Add one.
