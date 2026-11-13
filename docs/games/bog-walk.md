# Bog Walk 1904: the story plan

Status: **story agreed with the owner (13 Nov 2026). The first slice is built** (see "Where things are now"); the rest of the story is not. Read `CLAUDE.md`, `docs/NEW_GAME.md` and `docs/CONTENT.md` first. This file is the game guide: the story, the facts we can and cannot use, the decisions, the build rules and the code map.

Title: **Bog Walk 1904: The Tube**. The game is in `games/bog-walk/`, started from `games/_template/`.

## Decisions (agreed with the owner)

| Question | Decision |
|---|---|
| Who do you play? | A made-up young labourer. Real survivors are met in the journal only, never played. |
| Name the men who died? | **No.** The game never names any man who died, and does not use the surnames of the families on the newspaper's list either. They are "the men" and a number. |
| Does Zeke, the old valve man, come out? | **No.** He does not come out. It is told gently, in the morning scene with his daughter. |
| The 1899 flashback | **Yes.** It is chapter 1 and it is built. |
| The title | **Bog Walk 1904: The Tube.** |

Still open: the made-up characters' final names (Zeke, Rudy and Zeke's daughter are working names), and how the menu card picture looks.

## Build rules from the owner (13 Nov 2026)

These are being developed across the games and are not in `CLAUDE.md` yet. Follow them here, and move them to the shared docs when the owner writes them up.

1. **Nothing overlaps or passes through anything solid.** No character is placed in, or walks through, a solid object, and no two characters overlap. Solid things (tools, benches, walls, people) block walking, for the player and for anyone who walks. In this game the buckets and shovels are circles in `T.solids` (`tube.js`) and `clampPos` slides the player round them. Dev builds check that no tool overlaps another or sits under the manhole (`__bw.propOverlaps()`, and the autoplayer runs it).
2. **Things held in a hand are held properly.** The grip is at the hand, the object is not floating, does not pass through the body or face, and never covers the body or the middle of the view. In first person the torch is in a real fist: a palm behind the stick, **exactly four fingers** (each goes across the front of the stick and curls back round its left side, and they differ a little in length), **one thumb** (shorter and fatter than a finger, laid diagonally across the front of the first two fingers, with a thumbnail so nobody counts it as a fifth finger), and a sleeve leaving through the bottom of the screen. Count the digits in a close-up after any change to the hand (`?shot=fist` brings it close); an earlier version had the thumb in its own row and looked like six fingers. The fist sits at a fixed low spot, fully in view, and the torch is pivoted and scaled about it (`hand.place`), so it leans away, stays small, and is never cut off or in the way on any screen shape.
3. **Detailed graphics for the important sections** (the Tube, the manhole, the water, the yard at dawn, the ruins). Look at a screenshot of each at close range and from far away before calling it done.
4. **No overlapping text or other elements on screen, at any size.** The words and buttons are one flex column (top bar, subtitle, open space, bottom bar), so they cannot overlap by construction, and the subtitle sits under the top bar so the bottom corners stay free for the hand and the buttons. Dev builds check it (`__bw.hudOverlaps()` lists every visible pair of words and buttons that overlap, anything off the screen, and anywhere the hand, tested by rays through the real picture, overlaps a word or button, runs off the sides or top, or covers the middle of the view). The buttons sit at the right edge on wide screens and at the left on narrow ones. Check it at a desktop size, a portrait phone, a landscape phone, a small phone and a tablet (the check was run at 1280x720, 390x844, 844x390, 320x568, 768x1024, 667x375 and 360x640).

## Where things are now

Status: the **first slice is built**: an opening, the inside of the Tube and the night the water came (chapters 2 and 3 of the plan below, with placeholder voices), staged cinematically. Nothing else exists yet: no title-screen chapters menu, journal, saving, people, station yard, flashback or ending scenes.

Code is in `games/bog-walk/`:

| File | What it holds |
|---|---|
| `src/main.js` | renderer, the HUD, controls (keys, touch stick, drag to look, tap the rust), the night's phases (`work`, `trickle`, `rise`, `dark`, `out`, `end`), sound mixing, the dev test views and the autoplayer |
| `src/tube.js` | `buildTube`: the pipe wall (a grid we make so the manhole is a real hole), sand, rivets and flanges (instanced, in 10 m chunks), tools, rust patches, hung torches, the manhole, the rising water; and `makeHand`: the torch and fist in first person |
| `src/gfx.js` | every texture, drawn in code with a seeded random generator |
| `src/sfx.js` | the pipe's sounds on top of `engine/audio.js`: a short echo, drips, scraping, voices heard from far off, a torch hissing out, a clank, the water beds |
| `site/index.html` | the page and its styles (one flex column of words and buttons, so nothing overlaps) |
| `anim-clips.json` | the 14 shared animation clips this game will use (the build trims `anims.js` to them) |

Measurements that matter (all in `tube.js`): the pipe is 2.44 m across (`R = 1.22`), the sand floor is at `SAND = 0.5`, so the roof is 1.94 m above the floor and your eyes are at 1.45 m. The pipe runs from `ZMIN = -62` to `ZMAX = 14` and the manhole is at `ZM = 7.75`. Anything hung on the wall must stay under the roof (2.44 m up): a first version hung the torches too high and they were hidden behind the wall.

Test it:

```bash
node tools/build.mjs bog-walk --dev          # dev build: test views and the autoplayer
python3 -m http.server 8765                  # then open http://localhost:8765/games/bog-walk/site/
# ?shot=view1 (the start), cap (an opening title card; &line=2), end (the end card; &skipped=1), fist (the hand brought close), patch (&p=0 to 5, &half=n or &clean=0,1 to show scraping), up, manhole, torch (&t=0 to 5), back (&z=-18),
#   water (&wl=0.55&z=-12&yaw=3.14), dark (&wl=0.9&torch=0&vig=0.85), hud (the worst-case words and buttons) are views;
#   add &x= &z= &yaw= &pitch= &wl= &torch= &vig= &sky= to place the camera and the water by hand, and &quick to run every timed part at 15% length.
# ?auto=1 plays the whole night, ?auto=2 presses Skip at the first sign of water, ?auto=3 plays the opening cards by their own timers first. The result is in the page title and in #autolog.
# In the console: __bw.hudOverlaps() and __bw.propOverlaps() list anything that overlaps (both should print []), and
#   __bw.audit() runs the engine's place audit (engine/audit.js: floating objects, people inside solids, spots that cannot be reached) and should report nothing.
#   The autoplayer runs all three and fails if any reports a problem. The engine's auditHeld needs a Mixamo body, so it does not apply to the first-person hand (hudOverlaps tests that by rays).
```

### The cinematic moments (owner rule: the major events must feel cinematic)

Each major event is staged, not just switched on. The helpers are `bars`, `hideHud`, `caption` and `captionOff` in `main.js`, the camera's acting is in `tick`, and the sounds are in `sfx.js`.

| Moment | What the player sees and hears |
|---|---|
| **The opening** (`startIntro`) | Black, with the letterbox bars in. Two title cards fade in and out: "Bog Walk, Jamaica / June 1904", then "The last tram has gone. / The water in the pipe is shut off." Then a slow fade up into the Tube as the bars slide away and the words appear. Any key or tap skips it ("Tap or press a key to skip"). It plays once per visit; "Play the night again" goes straight to the work. |
| **The first water** (`startTrickle`) | A held breath: almost every sound drops away for about 2.6 s, your view slowly dips to the water at your feet and comes back, and a low drone starts under everything. |
| **The rush** (`startRise`) | A deep boom heard far off. From then on the camera has a low rumble that grows with the water, the roar grows, the drone climbs. |
| **The torches go out** (`startDark`) | The black bars slide in (the words move inside them and the hand rises to stay clear), the view narrows a little, and the torches on the walls go out one by one, the far ones first, each with a hiss; yours goes last. A soft heartbeat starts and speeds up a little. The edges of the screen darken. Only the pale light from the manhole is left. |
| **The climb** (`startOut`) | The words fade away and the bars stay. You glide to the manhole and up into its neck, looking up. The air swells, the sky turns from night blue to dawn, the view widens, the rumble dies, and the picture fades to white. |
| **The end** (`showEnd`) | The bars go, and a card says you are out. |

No cinematic element may break the no-overlap rule. The bars are in the same flex layout as the words (the whole `#hud` is inset by the height of a bar), the captions only show while the words are hidden, and the hand is lifted clear of the bottom bar. The overlap check runs with the bars in (`&cine=1`). Test views: `?shot=cap` (an opening card, `&line=2` for the second), `&cine=1` on any view (bars in), `?auto=3` (plays the opening cards on their own timers, then the night).

### Known issues and notes

- **Menu card.** The card is in `menu/index.html` (class `bogwalk`, rust orange, "New" tag, "Bog Walk, 1904 / The Tube") with the poster `menu/bog-walk.jpg`. To remake the poster, build with `--dev`, serve the repo and render `games/bog-walk/site/index.html?shot=poster` at 1280 by 720 (the view hides the words and frames the manhole's light at the end of the pipe); the card's picture is that render brightened about a third and saved as a JPEG of about 80 KB. The menu was checked at seven sizes for overlapping or clipped card text.

- **Credit link.** "Created by **Kellz 5.0**" is a link to `https://www.instagram.com/kellzilla_5.0` everywhere it appears: this game's title screen and end card, the menu header, the About page footer, and the credits panels of Port Royal, Garvey and Kendal (the big "Created by" line inside the panel; the small "Created by Kellz 5.0" button in those games still just opens the panel). Every link opens in a new tab with `rel="noopener noreferrer"`. A new game should do the same.

- **Engine bug, fixed.** `stepSound('water')` in `engine/audio.js` used to set the sound's buffer twice, which browsers refuse, so it threw the first time anyone stepped in water with sound on (Port Royal's swim, Kendal's beach and bucket actions call it). It is fixed in the engine now. Bog Walk keeps its own `waterStep` in `src/sfx.js` only because it deepens the sound with the water and sends it through the pipe's echo.
- **Test sound in a browser that allows it.** The autoplayer is silent in headless Chrome unless it is started with `--autoplay-policy=no-user-gesture-required`; run it that way once after any sound change, because errors in sound code only show when the sound really plays.
- **It is already on the public site.** `tools/dist.mjs` builds every folder in `games/` that does not start with `_`, so this game is served at `/games/bog-walk/site/` after the next deploy, although the menu does not link to it yet. Add the menu card (see `docs/NEW_GAME.md`, step 1) only when the owner says it is ready.
- **Looking straight up the manhole** (`?shot=up`) is the roughest view: the neck and the ring seam beside it are lit very close and a little faceted. The end of the night will glide you up through it, so polish it when the station yard is built.

## The event in one paragraph

In 1904 the trams of Kingston ran on electricity made at a power station near Bog Walk, in St Catherine. The station was driven by water from the Rio Cobre, which ran down a huge pipe called the Tube. Every Sunday night, after the last tram, the water was shut off so that gangs of labourers could go inside and clear out sand and rust. In the early hours of Monday 27 June 1904, with about 61 men inside, water came into the pipe. About 28 men got out. 33 died. It was called "without precedent in the annals of Jamaica". No one could say for sure why the water came.

One correction to the idea as first described: the water did not rush *out* of the pipe. It rushed *in*, on the men who were cleaning it.

## What we know, and how sure we are

All of this comes from secondary sources. The original *Gleaner* of 28 June 1904 has not been read yet. Treat every row as "most sources say" until it is checked (see "Research still to do").

| Fact | Status |
|---|---|
| A hydroelectric station on the Rio Cobre near Bog Walk was started in 1898 and finished in 1899. It powered Kingston's electric trams, which replaced trams pulled by pairs of mules. It closed in August 1966. | Wikipedia ("Bog Walk"), citing Brian Hudson, *Waterfalls of Jamaica* (2003). Kingston's electric trams ran from 31 March 1899 to 1948 (our Garvey notes). |
| The company is called the West India Electric Company in some sources and the Electric Tramway Company in the 1904 report. | Names differ. Check. |
| The Tube carried water from a reservoir on the Rio Cobre to the station. It was 8 feet across. A photo caption says 6,200 feet long, 1,700,000 pounds, 260,000 rivets, "the largest pipe in the world". One article says "cast iron", but a riveted pipe is more likely plate. | The 8 feet is repeated everywhere. The rest is one caption: say "said to be". Material unknown. |
| About 15 yards from the station the pipe rose slightly, then curved sharply for seven or eight feet before running downhill into the station. | One source (the 1904 report as retold). |
| The manhole was two feet eight inches across. | Two sources agree. |
| The water was normally shut off at twelve o'clock on Sunday nights "after all traffic has ceased", so the gangs could clear sand and rust. | The 1904 report as retold. |
| **Date: the morning of Monday 27 June 1904.** | The 2021 retelling of the 28 June 1904 report says 27 June. Several other pages say 24 June. **24 June 1904 was a Friday** and 27 June was a Monday, which fits the Sunday-night shut-off. This is our own calendar check, so confirm it in the original. |
| The men went in about 1 a.m. Water began to rise slowly. About 4 a.m. they panicked. The pipe filled in "over twenty minutes". | Retellings of the 1904 report. |
| Colin McDonald, a survivor, told a reporter the water began to rise within about an hour of going in and he did not think it was anything to worry about. | The 2022 retelling, as a paraphrase. Not a quote. |
| Mr Douparrouzel, the chief electrician, said: "I told the men that there was a little water coming but it was not from the dam." | The 2021 retelling of the 1904 report. Spelling of the name to check. |
| Counts: 61 went in (one retelling also says "60 odd" and a rumour of "some 80"); 28 came out; 33 died. | 61 = 28 + 33, which fits. One retelling says 17 escaped and another says "no survivors": both are wrong. |
| The cause: the 1904 headline says "No Accurate Information as To Cause". Two theories were reported: an order to let more water in to wash out sand, with a board at the intake removed for ten or twenty minutes; or sand built up a temporary dam and the water behind it burst through. One account says the main valve was never fully closed. | Disputed. The game never says which is true. |
| One retelling says three men panicking at the manhole may have blocked it. Another calls that a belief, not a finding. | **Not shown in the game.** See the rules below. |
| The headline, cited in Wikipedia's references: "Fearful Catastrophe At Bog Walk Drowning Men Fight For Life Sudden Rush of Water Causes Panic 33 Able-Bodied Men Drowned In Water-Pipe No Accurate Information as To Cause Of The Disaster" (*Gleaner*, 28 June 1904). | Real wording. Check capitals and spelling in the original. |
| Afterwards: the men were laid out on the ground floor of the superintendent's house; coffins came by special train at 11:50; the company paid for coffins, clothing and burial and gave cash to families who lost their income; burials were at family homes or the Linstead churchyard; police guarded the site overnight; Kingston heard between 7 and 8 a.m. and crowds filled the stations and newspaper offices by 9. | The 2021 retelling. |
| People named as doing things that morning: Dr Hammond (woken at 4:15 a.m.), the Rev. J.T. Dillon (Baptist, Linstead), the Rev. C.R.G. Thomas (Anglican rector, Linstead, arranged graves), Mr Haggart (the company's attorney, arranged identification, burials and relief), the Hon. E.G. Osborne-Smith (spoke calmly to the crowd), Coroner J.V. Leach. | The 2021 retelling. |
| An inquest was expected the following Monday. Its result was not found. Later pages say only that "investigations ruled the event an accident" and that many people felt "someone had blundered somewhere". | Verdict unknown. Do not state one. |
| The trams ran again within days. Buses replaced trams in the 1930s; the trams stopped in 1948. The dam, the ruins of the turbine house, some concrete supports and "a shell of the pipe" are still there. | Wikipedia ("Rio Cobre Dam") and a 2016 jamaicans.com post. No memorial was mentioned in anything we found. |

Sources used so far: the *Gleaner* retellings "1904 Bog Walk disaster relived" (2 July 2021) and "33 die in Bog Walk tube incident" (6 July 2022), both sponsored pieces that say they are independent of the newsroom; Rebecca Tortello, "Bog Walk Tube", *Pieces of the Past* (*Gleaner*); Wikipedia "Bog Walk" and "Rio Cobre Dam"; jamaicans.com, "See What's Left of the Bog Walk Tube" (2016, contains errors, so used for the ruins only).

## The story

You are a made-up young labourer on your first season with the tramway company's Sunday-night gang. The story is one long night and the morning after. The dramatic question, in plain words: **what do we owe the people whose hard work keeps the lights on, and how do we remember a disaster when nobody can say exactly why it happened?**

The honest centre of the game is the *not knowing*. The first reports were wrong (80 dead, 300 saved), the sources still disagree on the date, and nobody could say why the water came. The game teaches how we sort what we know from what we heard, which suits Garvey's fact-or-rumour cards and a history class.

### The hero

- Made up. The journal page says so (owner rule 3).
- About 20. The Gleaner says most of the men were unmarried labourers between about 20 and 50, so the game does not put a child in the pipe.
- Always first person, as in Garvey. You never see your own body.
- **Real people are met, never played.** Colin McDonald and the other survivors are not played and do not speak. They appear in the journal and in what the newspaper printed. The hero "stands for" the men who got out.

### Chapters

Six chapters, matching Port Royal's six (0 to 5), chosen from the Chapters menu. Each ends with a "History / Story" journal page saying what really happened and what is made up.

| # | Port Royal chapter it matches | Where and when | Walk and do | Remembered choice |
|---|---|---|---|---|
| 0 | Arrival | **The power station, Sunday evening 26 June 1904.** The turbine hall, the yard, the mouth of the Tube. | Meet Mr Douparrouzel, Old Zeke (the valve man) and your friend Rudy. See the turbines spin. Put the journey of the water in order on a board: river, dam, Tube, turbine, wires, tram. At midnight, after the last tram, turn the valve wheel with Zeke and watch the hum fade and the lights dim. | none |
| 1 | Ned's story (flashback) | **Kingston, 31 March 1899: the first electric tram.** Zeke tells it on the break; you play the day, first person, as a boy of about 15. | Stand in the crowd on a Kingston street, watch the first car, hear what the mule trams were like. Gives the reason the Tube mattered, and shows the joy before the grief. An Exit button works at any time, as in Ned's story. | none |
| 2 | The warehouse (ordinary life before the shock) | **Inside the Tube, about 1 to 3 a.m.** A round iron tunnel, 8 feet across, lit by torches, rivets in rows, sand on the floor. | Scrape the rust patches until the metal shines (tap each one), shovel sand into buckets, pass them to the manhole, talk to the gang. Time is called out: "Two o'clock." Water begins to drip. | Notice water around your boots and **tell Mr Douparrouzel or keep working.** Either way the record is kept: he says his real line, or a worker does. Later lines change, never the outcome, and neither choice is called wrong. |
| 3 | The earthquake | **The water, about 4 a.m.** | The playable sequence (below). You reach the manhole and a hand pulls you out. | none |
| 4 | The days after | **The station yard, dawn to noon, 27 June.** | The men who came out sit on the ground. Meet the doctor, the two ministers, the company's attorney and a member of the Legislative Council, each doing what the record says they did. A *Gleaner* reporter (made up) asks what you saw: sort "what I saw" from "what I heard" and pick only what you saw. Zeke's daughter asks about her father. A train whistle: the coffins arrive. | How you answer Zeke's daughter: **say plainly what you saw, or say he was brave** (the game never says he was a hero because no one knows). Her later line changes. |
| 5 | The tombstone (and today) | **The ruins of the Tube, today.** The dam, the turbine house walls, the concrete supports, a shell of the pipe. | A made-up teacher and a student. Read the real *Gleaner* headline on an information board (older readers' version first, a gentler line for the youngest). Sort the theories and the facts we still do not have. Put the later events in order: trams again within days, buses in the 1930s, trams end 1948, station closes 1966. | The student asks "Who was to blame?" Choose how to answer. The "Your journey" journal page lists every choice. |

The branches rejoin at the end of every chapter, so each has one `done()` test and the autoplayer can follow it.

### The playable night (chapter 3)

Modelled on Port Royal's earthquake (`Q` phases calm, tremor, main, swallow, sea). We use phases `work`, `trickle`, `rise`, `dark`, `out`, kept in one state object like `Q`.

1. **work**: you are scraping. A drip, then another. The torches hiss.
2. **trickle**: water pools at your boots. Zeke: "It will pass. It always passes." The chief says to move toward the exit. Voices call along the pipe.
3. **rise**: the water climbs to your knees. A low rushing sound builds. People are heard, never seen.
4. **dark**: the torches go out. The screen narrows to a vignette, as in the swallow phase. Keep your hand on a row of rivets and follow the voices toward a small light.
5. **out**: the light is the manhole. A hand reaches down. You squeeze up through a hole 2 feet 8 inches wide, and the air outside is cool and quiet. Cut to the grey of dawn.

Rules for this sequence:

- **No failing, no timer, no game over.** You are always able to reach the manhole.
- **Nobody is shown in the water. Nobody falls.** You hear voices, then fewer voices, then you are out.
- **The manhole is never turned into a crush, a blockage or blame.** Whether men crowded at it is a belief in one retelling, not a finding.
- A **skip** button, like `finishQuake(skipped)` in Port Royal, for any player who would rather not play it.
- The game never says why the water came. In the dark, the water simply arrives from the far end, the way the survivors described it.

### The honest telling

- 33 of 61 died. Some of the story's people do not come out. We say so plainly and kindly, in the aftermath, in words: "Zeke did not come out." Nothing is graphic.
- The company paid for coffins and burials and gave money to families. Many people also felt someone had blundered. **Both are stated, as reported, with no verdict.**
- Douparrouzel is a real man who was in the pipe and led men out. He is shown fairly. The cause theories name no person.
- Real people only say words traced to the record. At present those are Douparrouzel's one line and the newspaper headline. Everyone else's lines are labelled as made up in the journal. Doctors, ministers and officials appear doing what the report says they did and say only short, plain lines.
- Do not invent facts the record does not give: wages, hours, who hired whom, what tools the men used, where the valve was. Where the game shows these, it is "a general picture" and the journal says so, as Garvey's print shop does.

### Cast

| Who | Real or made up |
|---|---|
| The hero (you) | Made up |
| Mr Douparrouzel, chief electrician | Real. One traced line. |
| Mr Lewis (company manager), Mr Haggart (company attorney), Dr Hammond, the Rev. J.T. Dillon, the Rev. C.R.G. Thomas, the Hon. E.G. Osborne-Smith | Real. They appear in chapter 4 doing what the report says. Spellings and roles to check. |
| Colin McDonald and the other survivors | Real. Named in the journal only. |
| The 33 men who died | Real. **Not named anywhere in the game.** They appear as a number and as "the men". |
| Old Zeke, the valve man (working name) | Made up. Does not come out. |
| Rudy, your friend (working name) | Made up. Comes out. |
| Zeke's daughter (working name) | Made up |
| The *Gleaner* reporter | Made up. Stands for the reporters who were there. |
| The man with the torch at the manhole | Real, unnamed in the record. The hand that pulls you out stands for him. |
| The teacher and the student, today | Made up |
| Tram conductor and crowd, 1899 | Made up |

Made-up people get first names or nicknames only, so no one can be mistaken for a real man.

## What is needed

**Reuse (copy from Garvey and Port Royal, then consider moving into `engine/`):**
- Conversations, journal, chapters, saving, goals, helper arrow, speech marks, joystick and look controls.
- Garvey's timeline board (put events in order) for the water's journey and for today's events.
- Garvey's fact-or-rumour cards for the reporter scene.
- Garvey's `tools/garvey/era.py` for 1900s clothes. Workers' shirts and trousers, caps, and a few women for the families.
- Port Royal's `Q`-style phase machine, vignette and skip for the night.

**New:**
- **The Tube interior**: a round tunnel built in code, with a riveted-iron texture drawn on a canvas (the games draw their textures in code), seams every metre or two, patches of rust that clean to bright metal, sand drifts, hanging torches (two or three real lights only, for phones), a manhole with light coming in.
- **Rising water**: a see-through plane that climbs the pipe, tinted darker as it rises.
- **The power station**: turbine hall (a spinning wheel and a switchboard), valve wheel, yard, the mouth of the Tube where it curves down into the station.
- **The yard at dawn**: the superintendent's house, a gate, a platform for the train.
- **The ruins today**: concrete footings, broken walls, a shell of the pipe among trees.
- **A valve-wheel activity** (turn it by dragging in a circle or holding the button).
- **Sound** (engine audio is all made in code): a turbine hum that fades when the valve closes; drips and a short echo for the pipe (a small new `echo` using delay nodes); a rushing-water bed for the night; no music until the aftermath, where `cue('sad')` can play.
- **The tram and a Kingston street** for chapter 1 (Garvey has no street yet). One early electric tram car, a stretch of track, shopfronts with verandas and zinc roofs, gas street lamps, a crowd of instanced figures.

**Test views and autoplayer** as in `docs/TESTING.md`: `?shot=` views for each place and the night, `?auto=N` playing each chapter, and a phone-layout check. Reading-level and facts passes before it ships.

## Research still to do

1. **Read the original *Gleaner* of 28 June 1904** (Gleaner Archives, the National Library of Jamaica, or the Jamaica Archives in Spanish Town). Settle the date, the counts, the exact headline, the spelling of Douparrouzel's name and his words, and the spellings of the officials, doctors and ministers. The names of the dead are not needed, because the game does not use them.
2. Find the **inquest result** and any later inquiry: the coroner's report, the *Jamaica Gazette*, and the *Gleaner* of early July 1904.
3. Read Hudson, *Waterfalls of Jamaica* (pp. 55 and 59) and Tortello's "Bog Walk Tube".
4. Is there any **memorial or grave marker**, in the Linstead churchyard or at the site? Where exactly are the ruins, and can people visit?
5. Get the plant's facts straight: what the Tube was made of, the real length, 900 kW or 1,500 H.P., who built it, the company's correct name.
6. Confirm 31 March 1899 as the first day of electric trams, and what the mule trams were like (chapter 1 depends on it). Also what the first car looked like and where the first route ran.
7. The method of cleaning: tools, lighting (torches or lamps), where the valve and the intake board were. Until found, show only a general picture.
8. Photographs to use as a guide (reference only, never textures): the National Library of Jamaica and the Gleaner's photo archive for the ruins and the tramway; period engineering photographs of riveted penstocks.

## To test once it is built

- **The water scene** (chapter 3) is the one to try on a nervous 6-year-old with a parent beside them. As planned: slow rise, a vignette, only voices, a hand at the manhole, a skip button.
- **Zeke's daughter** (chapter 4). If it proves too heavy for the youngest players, the scene can move to "Dig deeper" and the rest of the chapter stays. The decision that Zeke does not come out stands either way.
- **The "tombstone" of this game.** Because the men are not named, chapter 5 rests on the real *Gleaner* headline and on the ruins. If a memorial or grave marker is found (research item 4), it can take the place the tombstone has in Port Royal, without naming anyone the game has not been told to name.

## Build order

1. Spike: the Tube interior, the rising water and one torch, running on a phone.
2. Chapters 0 and 2 (the station and the work), then 3 (the night).
3. Chapter 4 (the morning), then 5 (today).
4. Chapter 1 (the 1899 flashback), which needs the Kingston street and the tram.
5. Polish: reading level, facts check, phone layout, sound, menu card, all the autoplayers.
