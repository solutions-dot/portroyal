# Ambient life: a plan for all eight games (15 November 2026)

Phase 1 is done: `engine/ambient.js`, its tests (`tests/ambient.mjs`, in `npm test`) and its docs (`docs/ENGINE.md`, "engine/ambient.js"; `docs/STANDARD.md`, "Ambient life"; `docs/TESTING.md`, the `?test=ambient` row). No game imports it yet. This file is phase 2: which background people in each game get which behaviour, which clips they use, and which clips each game must add to its `anim-clips.json`.

Sources: the animation audit (`anim_audit.md` in this scratchpad), each game's places files and `main.js`, and the clip library as packed now (`shared/models/anims.js`, 96 clips; the list is in `tools/anims/clips.json`).

---

## 1. How a game adopts it (the same steps in every game)

1. **Import and make one system per place.** `const life = createAmbient({ walls: P.walls, bounds: P.bounds, blocked, keepOff, seed, phone })`. `blocked` is the same function the game already gives `engine/follow.js` (`followWorld().blocked` in Kendal, Melissa, Eventide, Nanny).
2. **Give each background person a `life:` field in the place data** (next to `anim:` in `extra(...)`), and in the place builder `for (const n of P.npcs) if (n.life) life.add(n, n.life)`. Crowd helpers (`crowd57`, `crowd45`, `villagers`, `folk`, `crowd04`, `crowd99`, `crowdNow`, Eventide's `crowd` and `walkers`) get a `life` option that hands out a mix (section 3) instead of a fixed `anim`.
3. **Take ambient people out of the game's own loops**: `npcTick`, the mixer update, `groundFeet` and the old `walkers()` path code. Kendal's `npcTick` returns early for `n.amb`; the frame loop skips `n.amb` in the mixer and grounding passes. The old `walkers()` helpers and Port Royal's `STROLL` routes become `wander` with `pts`.
4. **Story people are never ambient in their step.** Pass the step's story people as `story` in the tick (`STORY.isStory(id)` from `engine/story.js` picks them out), and hold anyone you talk to (`talking: talkWith`). A flavour person who is also ambient keeps walking until tapped; `talking` stops them and turns them to you.
5. **keepOff from the story.** For each step: a corridor along the route the arrow takes (the game's `route()` callback points), each `needs.go` spot, each `do` spot (the wagon, the press table, the drum) with about 1.2 m, and the player's start. A function of the stage: `keepOff: () => KEEP[stage] || KEEP_PLACE[cur]`.
6. **Mood per stage.** `life.mood('sad')` at the crash, the camp, storm and grief stages; `'calm'` indoors and at memorials; `'lively'` for markets, platforms, beaches, parades. Set it in `setStage`.
7. **Phones.** Pass `phone: true` where the game already detects a phone or small screen (most read `matchMedia('(pointer: coarse)')` or the window size), and give crowd members their `_lo` body as `n.lo` where the game already loads light copies.
8. **Wire `?test=ambient`** like `?test=audit`: build each place, add its people, `ambientTest(life, { route: <the walk a child takes through the place>, story })`, print in `#autolog` and `document.title`, and expect `AMBIENT 0` in every place. Add a line to the game's doc with the date and the numbers.
9. **Check by eye** (rule 6): screenshots of each place close up and from far away, on the phone layout too; the autoplayer for each chapter.

**Clip rules for ambient life** (rule 4 and the audit):
- Never in ambient life: Terrified, Terrified2, Scared, SitScared, StumbleBack, JogStumble, Stagger, Injured*, Hurt*, InjuredWalk, Crawl, Punch, Block, Sword1, Sword2, Defeated, Rifle* (outside Tivoli's directed scenes), Pray (it kneels and stands up), Yell (shouting reads as anger at age 6). These stay story or directed-scene clips.
- Fine for ambient life: Idle, Walk, WalkM, Run (children), Talk1-3, TalkM1, TalkM2, Laugh, Point, WaveSlow, Clap, Cheer (only at a celebration), Sad1, Sad2, SadWalk, Cry (only in a sad scene, a few people), SitIdle, SitTalk, SitPoseM, SitPoseF, SitDisbelief (sad scenes), Write (seated, with a pen or book), Drink (LEFT hand, with a cup), Carry, CarryIdle (with a box), CarryBagWalk (with a bag in the right hand), CarryHeadWalk, CarryHeadWalk2, CarryHeadIdle (with a load on the head), PickUp, ReachOut, Kneel and KneelDown (after the engine fix below), Speech (a speaker to a crowd), PlayGuitar, PlayGuitar2, PlayPiano (with the instrument), Argue (only as a lively market haggle, not anger: check by eye first), WalkTurn180 (see below), ComfortGive and ComfortTake (sad scenes, as a pair).
- Every work or carry clip needs the thing in the hand: `grip()` it, or `show()` it for a carried load, or `life.issues()` reports it.

**Engine notes found while building (each its own PR to `engine/anim.js`, owner to merge):**
- `HIPS_Y` in `engine/anim.js` does not list `Kneel`, `KneelDown`, `Crawl`, `Scared`, `SitScared` (Sit is covered), or `Comfort*` (check the hand-made Comfort clips' hips first), so `clipFor` throws away their hips height: a kneeling body would stand at full height with bent legs, and `groundFeet` would push the shins into the ground. Add `Kneel|Crawl|Scared|Comfort` before any game uses those clips, then check them in `?shot=` views.
- `WALKS` and the `seamLoop` list do not include `CarryBagWalk`, `CarryHeadWalk`, `CarryHeadWalk2`, `RifleWalk*`, `HurtWalk`, `InjuredWalk`. `engine/ambient.js` paces any walking clip itself (it does not need `WALKS`), but `ctl.pace()` in game code returns without pacing for those, and the loop seam of the unlisted walks is not smoothed. Add them, and run `?test=walkers` on each.
- `WalkTurn180` and `WalkTurn180b` are 1 s turns while walking. Their root motion is stripped by `clipFor`, so they turn the body only through the bones. A later version of the ambient walker could play one for a turn of more than 150 degrees in place of turning on the spot; this needs the clip's hips turn read out and applied to `rotation.y` at the end. Not used yet.

---

## 2. New clips that would help most (for the shared library, its own PR)

| Clip | Why | Games |
|---|---|---|
| **IdleVariants**: arms crossed, hands behind the back, hands on hips, look around, shift weight | Every crowd shares one `Idle` (a woman's). Three or four calm standing loops are the cheapest big gain against "zombies": `spec.idles` rotates them. | all |
| **ManIdle**, **OldIdle**, **OldWalk** | Men and elders on Abba's idle and walk (audit item 10). | all; Eventide most |
| **Sweep** (with a broom) | `work` at doorsteps and yards | Port Royal tavern, Eventide ward and veranda, Melissa after the storm, Nanny town, Kendal hill station |
| **Hammer** | `work` at a bench or a roof | Melissa (Mr Raymond, the three jobs, rebuilding), Kendal 1845 works, Port Royal (Benning), Bog Walk |
| **Hoe** / **Dig** | `work` in gardens and works | Nanny yam grounds, Kendal navvies, Melissa clean-up |
| **CarryBucket** (walk and idle, one heavy hand) | `errand` to a standpipe, a well, a fire | Eventide firefighters, Kendal helpers, Bog Walk labourer, Melissa water truck, Nanny water carriers |
| **KidHop**, **KidSkip**, **KidJump** | `play` has only Run, Cheer, Clap, Laugh for children | Kendal beach, Melissa, Nanny, Tivoli 1963, Bog Walk 1899 |
| **Nod** / **ListenIdle** | listeners in a `chat` (the engine nods the head by itself, but a whole-body listen loop reads better) | all |
| **WorkBench** (hands busy at waist height) | the printer, the pressman, a clerk, a seller at a stall | Garvey, Port Royal market, Kendal clerk |
| **Wash** (scrubbing at a tub) | yards | Melissa, Tivoli 1963, Nanny |
| **Sell** / **CallOut** (a seller calling, one hand up) | markets | Port Royal market (Grace already loops WaveSlow and Point), Kendal platform vendor, Tivoli |

---

## 3. Mixes for crowds (what a crowd helper hands out)

A crowd of N people in a lively place: about 30 % `wander` (pts or area), 10 % `errand` (with a bag or a head load), 35 % in `chat` groups of 2 or 3 (the helper makes the groups: neighbours within 1.5 m share a `group`), 15 % `watch` (toward what the place is about: the train, the band, the speaker), 10 % children on `play` in pairs (one chases the other). Seated crowds: `sit` in pairs as `group`s. In a sad place: no `play`, half the chats become `watch` with `idles: ['Sad1', 'Sad2']`, and `life.mood('sad')` does the rest.

---

## 4. Each game

### Kendal 1957 (`games/kendal/`)

**Clips shipped now (18):** Idle, Walk, Run, Talk1-3, Wave, Laugh, Clap, Cheer, SitIdle, SitTalk, SitDisbelief, Sad1, Sad2, Carry, CarryIdle, Cry. **Add:** TalkM1, TalkM2, SitPoseM, SitPoseF, PickUp, CarryBagWalk, CarryHeadWalk, CarryHeadIdle, Point, SadWalk, PlayGuitar (or PlayGuitar2), WaveSlow; later Kneel (after the HIPS_Y fix) for the nurse.

| Place | Who | Behaviour |
|---|---|---|
| road 1844 (`places1.js:40-44`) | the four labourers at the railway works (now Carry on the spot, CarryIdle with no box, Idle, Talk2) | two as `work` with `between` the cutting and the spoil heap (`walk: 'Carry'`, `show` a box or basket), one `watch` toward the works with `react: ['Point']`, one `chat` with the man on the bank (group of 2). Fixes the audit's "walks on the spot" and "invisible box". |
| road 1844 | the traveller (walks a path now) | `wander` with `pts` along the road |
| station 1845 (`places1.js:70-72`) | the 26 people of `crowd45` (endless Cheer, Clap, Wave) | `watch` toward the engine with `react: ['Cheer', 'Clap', 'WaveSlow']` (a reaction now and then, not forever), small chat groups at the back, children `play` in pairs behind the crowd; `life.mood('lively')`. The governor and gentlemen: a `chat` group of 3. The fireman (`Wave` forever): `work` with `clip: 'Idle'`, `react: ['WaveSlow']`, or `watch` toward the crowd. |
| ride 1845, coach (`places1.js:86`, `places2.js:75`) | seated passengers | `sit` in pairs by row (`group` per bench), `clips: ['SitIdle', 'SitPoseM'/'SitPoseF']`. In the crash run (`main.js:502-516`), `mood('sad')`: no SitTalk, SitDisbelief. |
| hill station 1890s (`places1.js:111-114`) | stationmaster, foreman, farmer, young Ezra are talk targets; add 3 to 4 banana carriers | carriers as `errand` from the field edge to the wagon with `walk: 'CarryHeadWalk'` and a bunch on the head (`drop: true`, `show`), kept off the player's own carry route (keepOff along it). |
| Kingston 1957 platform (`places2.js:46-49`) | `crowd57` (34 + 8), today Idle/Talk/Laugh/Wave facing random ways, a third walking | mix from section 3: chats in groups (fixes "talking to nobody"), `errand` with suitcases (`walk: 'CarryBagWalk'`, suitcase gripped right), `watch` toward the train; the guard keeps his paced walk (`wander` with `pts`). Lloyd (`Wave` forever) is a story person; outside his step he becomes `play` near Gran with `area` 3 m. |
| beach (`places2.js:96-98`) | 14 + 10 people, 40 % children; the mento band | children `play` in pairs on the sand (`area` the beach, `joy: ['Cheer', 'Clap', 'Laugh']`); adults `wander` along the shore, `chat` in groups, `sit` on the sea wall where it has a seat top. The band: three `work` people with `clip: 'PlayGuitar'` and gripped instruments (a banjo, a guitar; the rumba box player seated, `SitIdle` until a seated playing clip exists). The toast says banjo, guitar and rumba box; nobody plays now (audit). |
| crash site (`places2.js:129-142`) | survivors by the fire (Cry), 16 villagers, 6 helpers at the calling place (Talk1 all one way), 4 with lamps | `life.mood('sad')`. Helpers with lamps: `errand` between the lane and the coaches with the lamp gripped (`walk: 'Walk'`, slow), keepOff on the player's routes to Dawn and the nurse. Calling-place helpers: two `chat` groups of 3 facing each other. Survivors by the fire: `sit` where there is a log (seat top) with `sadClips`, else `watch` toward the fire with `idles: ['Sad1', 'Sad2']`. Nobody laughs. Nurse Gray (a story person) needs Kneel later, not ambient. |
| memorial (`places2.js:164-166`) | school children (Idle, Talk1, Idle, Laugh) | `mood('calm')`, children `watch` toward the monument with `idles: ['Idle']`, two in a quiet `chat`; no Laugh at a memorial (audit). |

### Marcus Garvey (`games/garvey/`)

**Clips shipped now (7):** Idle, Walk, Talk1-3, SitIdle, SitTalk. **Add:** TalkM1, TalkM2, Laugh, Clap, Point, SitPoseM, SitPoseF, CarryBagWalk, Carry, CarryIdle, PickUp, Write, Speech (for Garvey himself, a story person), WaveSlow.

Garvey's places are small and nearly everyone is a talk target (`SHOP_PEOPLE`, `HALL_PEOPLE`, `STREET_PEOPLE`, `PRESS_PEOPLE`, `DOCK_PEOPLE`, `LIB_PEOPLE`, `OFF_PEOPLE`, `PARK_PEOPLE`). Ambient life here means: (a) talk targets outside their own step become ambient (`life.add` when the step is not theirs, `life.hold` or removal when it is), and (b) a few extras added per place, made up and said so where they speak (they do not).

| Place | Who | Behaviour |
|---|---|---|
| print shop (ch 1) | the printer (Idle, "Mind the type"); the customer (walks through) | printer: `work` at the type case (`clip: 'Idle'` until WorkBench exists, then WorkBench, with a composing stick gripped left) with `react: ['Point']`; customer: `errand` door to counter with `walk: 'CarryBagWalk'` and a parcel. |
| hall (ch 2) | neighbours after they sit (SitIdle); listeners in stage 13 | `sit` in pairs on the benches (`group` per bench), SitTalk between turns of the speech only before and after it, not during; during the speech, `watch` behaviour for seated people is `sit` with `clips: ['SitIdle', 'SitPoseM']` and head toward the stage. Add 4 to 6 seated extras so the hall is not empty. |
| Harlem street (ch 3) | worker, woman, older man (Idle) round the soapbox | `watch` toward Garvey with `react: ['Clap', 'Point']` (Clap must be added) and head looks; add 6 to 10 passers-by as `wander` and `errand` along the pavement (keepOff the player's way to the soapbox), two `chat` groups at a shop front. |
| press room (ch 4) | pressman, sailor (Idle) | pressman: `work` at the press (`clip` WorkBench when it exists; until then `Idle` with `react` and `glance`); sailor: `work` with `between` the press and the door carrying bundles (`walk: 'Carry'`, `show` a bundle). |
| dock (ch 5) | share clerk, engineer, friend (Idle) | add dock workers: two `work` with `between` the stack and the gangway (`Carry`), one `errand` with a bag, a `chat` of two by the rail; talk targets outside their step `watch` the ship. |
| Liberty Hall (ch 6) | nurse, traveller, messenger, steward (Idle) | add delegates: `sit` in rows in pairs, a few standing at the back as `watch` toward the platform with `react: ['Clap']`; the messenger outside his step `errand` between the door and the platform with a paper. |
| office (ch 7) | Amy Jacques Garvey (a story person; the audit asks for her seated with Write) | not ambient. Add a clerk at a side desk as `sit` with `clips: ['Write', 'SitIdle']` and a pen gripped. |
| park today (ch 8) | guide, student (talk targets) | add visitors: a family `wander` on the paths (keepOff the shrine approach), two children `play` well away from the shrine, a `watch` pair reading the sign; `mood('calm')`. |

### Port Royal 1690 (`games/port-royal/`)

**Clips:** the whole library (no `anim-clips.json`), so nothing to add. Port Royal keeps much of its own code in `main.js`; its strollers (`STROLL`, `main.js:1415`), tavern cycle (`main.js:1513-1517`) and camp are the places to convert.

| Place | Who | Behaviour |
|---|---|---|
| the new street (`main.js:1315-1418`) | Peter, Mendes, Constable Hart stroll (`STROLL`, Walk not paced, a woman's walk on men) | `wander` with their `STROLL` points as `pts`, `sex: 'm'` (WalkM, paced). They are talk targets: `talking` stops them. Add 4 to 6 market extras: `errand` with head baskets (`CarryHeadWalk`), `chat` groups of two at the stalls, children `play` in the open part of the street. Grace stays as she is (a seller who calls out) or becomes `work` with `clips: ['WaveSlow', 'Point', 'Talk2']`. |
| tavern (`main.js:1507-1517`) | buccaneers on a 26 s cycle with Drink (no tankard) and Punch/Block | `chat` group of 3 at the table side (`group`), `react` none; Drink only with a tankard in the LEFT hand (`work` with `clip: 'Drink'`, `prop`). Drop Punch and Block from ambient (rule 4: no fight in the foreground). Ned stays seated (`sit`). |
| wharf | Kofi with crates (a story person in his step); add porters | Kofi outside his step: `work` with `between` the stack and the boat (`Carry`, crate `show`). Add 2 porters the same way and a soldier on patrol as `wander` with `pts` (his half-pike gripped). |
| fort | gunner (Salute once) | `watch` toward the sea with `react: ['Point']`; add a second gunner `work` at the gun with `clip: 'PickUp'` (shot) once a seated or ram clip exists. |
| the camp after the quake (`main.js:959-963`) | survivors on Sad1, Sad2, Cry; Benning SitDisbelief; Heath (Pray loop, a story fix) | `life.mood('sad')`. Survivors: `watch` with `idles: ['Sad1', 'Sad2']`, two pairs as ComfortGive and ComfortTake (`work` with one clip each) once checked; one or two `errand` carrying water between the well and the tents (slow walk, bucket gripped). Nobody laughs or waves; no `play`. |
| flashback (`main.js:1598-1717`) | onlookers (Laugh, Talk2, Wave forever), the crate carrier on a sine wave, the muster cheer in step | onlookers: a `chat` group and `watch` toward the drill with `react: ['Clap', 'Laugh']`; crate carrier: `work` with `between` two points (`Carry`, paced: fixes the slide and the instant turn); the muster cheer: everyone `watch` with `react: ['Cheer', 'Clap']`, which the engine starts at random times (fixes "in step"). |

### Bog Walk 1904 (`games/bog-walk/`)

**Clips shipped now (17):** Idle, Walk, Talk1-3, Carry, CarryIdle, PickUp, Point, Wave, Cheer, Clap, Sad1, Sad2, SitIdle, SitTalk, Laugh. **Add:** TalkM1, TalkM2, WalkM (derived, free), SitPoseM, SadWalk, CarryBagWalk, WaveSlow, Write.

| Place | Who | Behaviour |
|---|---|---|
| station (`places.js:450-452`) | labourers: a Talk1/Talk2 pair, Idle with lamps, Idle with a bucket, two on a bench | the pair: `chat` group; the lamp men: `watch` toward the works with small shifts; the bucket man: `errand` between the tank and the shed with the bucket gripped; the bench: `sit` as a `group` of two. Nobody walks in this game now (audit): two labourers as `work` with `between` the shed and the pipe (`Carry`, a box shown). |
| inside the Tube | nobody (by design) | none |
| yard after the water (`places.js:503-520`) | survivors on forms, officials, families, ministers, Miss Ivy | `life.mood('sad')`. Forms: `sit` in pairs with `sadClips: ['SitIdle']` (blankets stay). Families at the gate (`crowd04`): `watch` toward the yard with `idles: ['Sad1', 'Sad2']`; one minister: `chat` with a family member (group of 2) instead of Talk2 to nobody. A labourer `errand` between the gate and the forms with a bucket (water), slow. |
| Kingston 1899 (`places.js:669`) | 28 people of `crowd99` cheering before anything happens | `watch` toward the track with `react: ['Cheer', 'Clap', 'WaveSlow']` (now and then, at random times; when the car rolls out, raise the reaction chance for 5 s instead of every extra starting Cheer in the same frame, `main.js:619`), chats at the back, two children on `play` (a real child body, not the scaled `nb_youth`: audit). |
| ruins today (`places.js:540-542`) | Miss Grant, Kemar, visitors | visitors: `wander` with `pts` round the ruins, one `watch` reading a sign, `mood('calm')`. |

### Nanny Town 1734 (`games/nanny/`)

Rules that matter here (`docs/games/nanny.md`): Nanny never speaks, nothing sacred is shown (no ceremony, song, drumming), stand-in bodies, not yet reviewed by the Moore Town Maroons. Nanny herself is never ambient. No drumming or dancing clips in ambient life.

**Clips shipped now (13):** Idle, Walk, Run, Talk1-3, Point, Wave, Cheer, Clap, Terrified, Sad1, Drink. **Add:** TalkM1, TalkM2, WalkM, Laugh, Sad2, PickUp, Carry, CarryIdle, CarryHeadWalk, CarryHeadWalk2, CarryHeadIdle, SitIdle (also fixes the cloth test asking for it), SitPoseM, SitPoseF, Kneel (after the HIPS_Y fix).

| Place | Who | Behaviour |
|---|---|---|
| estate at night (`places.js:65`) | the watchman with a lantern (path, not paced) | `wander` with `pts` along his path, lantern gripped, `speed: 0.9`, `mood('calm')`. |
| the town (`places.js:116`, `cast.js:39`) | 11 + 3 villagers (Idle, Talk1, Talk2, random ways) | the audit's "a working town with no work": two or three `errand` with head loads between the stream path and the houses (`CarryHeadWalk`, a calabash or basket on the head via the game's head `hold()`), two `work` at the yam grounds (`clip: 'PickUp'` until Hoe exists), `chat` groups of two or three at doorways, children on `play` near the houses (slower near you), elders on `sit` at a doorway seat (needs a stool or log with a seat top). keepOff the paths of each step (Quamin's lead path, the planting spot). |
| planting (`main.js:436`) | Mimba claps once | unchanged (a story moment). |
| the fight (`main.js:527-565`) | soldiers and fighters | not ambient (a directed scene, rule 4). The audit's musket and Cheer fix belongs to the story code. |
| 1734 night (`places.js:117`) | villagers who flee | not ambient (followers via `engine/follow.js`). |
| New Nanny Town 1740 (`places.js:197-198`) | 8 + 12 villagers | like the town, `mood('calm')`: `chat`, `errand` with head loads, `work`, a few children on `play`. |

### Eventide 1980 (`games/eventide/`)

Most of the cast is elderly. Until OldIdle and OldWalk exist, elders get `speed: 0.6` and `Walk` (paced; slow), and seated where possible.

**Clips shipped now (7):** Idle, Walk, Talk1-3, Sad1, Sad2. **Add:** TalkM1, TalkM2, WalkM, Laugh, SitIdle, SitTalk, SitPoseF, SitPoseM, CarryBagWalk, Carry, CarryIdle, PickUp, WaveSlow, SadWalk, Cry, ComfortGive, ComfortTake.

| Place | Who | Behaviour |
|---|---|---|
| Slipe Pen Road by day (`main.js` SCENES[0]) | 13 + 17 pavement walkers (Eventide's own `walkers`, a fixed 1.3 m/s guess), 6 chatting | walkers: `wander` with `pts` along their pavement stretches (paced by the engine: fixes the guessed pace), some `errand` with shopping bags (`CarryBagWalk`); the chatters: `chat` groups of two or three; elders `speed: 0.6`. Miss Iris on the veranda (standing; the guide plans her seated): `sit` on a veranda chair. |
| the ward (SCENES[1]) | residents standing by their beds (Idle) | `sit` on bed edges and chairs (needs seat tops at 0.45 to 0.5 m), in pairs as `group`s with SitTalk; one resident `wander` slowly between her bed and the window (`pts`, `speed: 0.5`); `mood('calm')`. Nurse Bell is a story person. |
| goodnight at dusk (SCENES[2]) | residents on the veranda, walkers | `sit` on the veranda in a row (pairs), `mood('calm')`; walkers as above. A goodnight `WaveSlow` as `react` on two of them when you leave. |
| the fire at night (SCENES[3]) | firefighters (Idle, one bucket), police at the rope, neighbours | `life.mood('sad')`. Firefighters: `errand` with buckets between the hydrant or truck and the line (`CarryBucket` when it exists; until then `Walk` with the bucket gripped), never inside the keepOff round the ward door and the children's path; police: `watch` toward the fire with shifts; neighbours: `watch` with `idles: ['Sad1', 'Sad2']`, two ComfortGive/ComfortTake pairs. Nobody runs or panics in ambient life. |
| day of mourning (SCENES[4]) | mourners, officials, crowd in black | `mood('sad')`; crowd `watch` toward the grave with Sad idles; "an old lady being comforted" (in the guide) as a ComfortGive/ComfortTake pair; staff walking to the grave as `errand` with `walk: 'SadWalk'`. No chat clips. |
| Golden Age Home | residents standing (Idle) | `sit` in pairs; one `wander` slowly in the garden. |
| monument | the guard; people laying flowers (Idle, Talk1, Talk2) | `mood('calm')`; the guard is not ambient (an at-attention pose when it exists); visitors `watch` toward the monument, no Talk clips, one `errand` to the monument and back with a flower (`drop: true`, `show` the flower appearing on the base). |

### Hurricane Melissa (`games/melissa/`)

**Clips shipped now (21):** Idle, Walk, Talk1-3, Wave, Laugh, Clap, Cheer, SitIdle, SitTalk, Sad1, Sad2, Carry, CarryIdle, Cry, Pray, Point, PickUp, Drink, Write. **Add:** TalkM1, TalkM2, WalkM, SitPoseM, SitPoseF, CarryBagWalk, CarryHeadWalk, CarryHeadIdle, SitDisbelief, ComfortGive, ComfortTake, SitComfortGive, SitComfortTake, Kneel (after the fix).

| Place | Who | Behaviour |
|---|---|---|
| the village before each storm, 1951, 1988, 2025 (`places.js:121-130`) | Mama and Papa / Dad on Talk to nobody, `folk` walkers (not paced) | `folk` people: `wander` with `pts` along the road (paced), `errand` with shopping bags or head loads to the shop and back, children `play` in pairs in the yards; the two talkers: a `chat` group if they stand together, else `work` (yard jobs: `clip: 'PickUp'`, or Carry `between` with a box shown, until Hammer and Sweep exist). keepOff the paths to the drum, the boards, the canoe and the washing. |
| storm in the room (`places.js:171-172`) | family members (story people) | not ambient (the audit's fix is a story-scene clip: SitScared, Sad, Cry). |
| church hall (`places.js:208-214`) | 26 seated (SitIdle, SitTalk), 6 standing (Idle, Talk1, Talk2) | `sit` in pairs by pew; standing people `chat` in groups at the back, children near their mothers as `play` with a small `area` (calm) before the storm; when the storm comes, `life.mood('sad')`: no SitTalk (seated people keep SitIdle and a few SitComfortGive/Take pairs), no chat, no play. The audit's "people keep chatting as the roof opens" is fixed by the mood change. |
| after the storm (`places.js:134-135`) | `folk` with Sad1, the sawman (Idle, chainsaw sound), the lineman (Idle), the soldier | `mood('sad')` then `'calm'` once the clean-up starts: `folk` as `errand` carrying boards and zinc between the road and a pile (`Carry`, shown), a few `watch` with Sad idles; the sawman `work` at the log (`clip: 'PickUp'` until Saw exists, saw gripped); the lineman `work` at the pole (`clip: 'ReachOut'` until a pole clip exists). |
| today (`places.js:138`) | `folk` walkers | `wander`, `errand`, `chat`, `play`, `mood('lively')`. |

### Tivoli (`games/tivoli/`)

The hardest subject (`docs/games/tivoli.md`). Ambient life only where the game is calm and the people are not part of a directed scene. Never in the May 2010 street chapters: those are directed scenes with their own rules (rule 4 exception). The game is early and its places are few.

**Clips shipped now:** Idle, Walk, Run, Talk1, Block, Point, Terrified (shared) plus its own 18. **Add for ambient life:** Talk2, Talk3, TalkM1, TalkM2, WalkM, Laugh, Clap, Sad1, Sad2, SitIdle, SitTalk, SitPoseM, SitPoseF, CarryBagWalk, CarryHeadWalk, CarryHeadIdle, PickUp.

| Place | Who | Behaviour |
|---|---|---|
| Back-o-Wall 1963 (`backowall.js:77-79`) | Ivy, Miss Pearl, Mass Roy (story people, Idle) | add 6 to 8 yard people (made up, said so if they ever speak): `errand` with head loads between the standpipe and the yards, a `chat` pair at a fence, `work` at a washing tub (`PickUp` until Wash exists), children `play` in the lane, an elder `sit` on a crate (a seat top). Story people outside their step `watch` their yard. `mood('calm')`. |
| the street, May 2010 | soldiers, police, gunmen | not ambient (directed scene). |
| later chapters (not built) | families, today's community | plan them with `chat`, `sit`, `play` and `errand` from the start; the chapters after 2010 should be `calm` or `sad` where the story is grief, `lively` for today's community events. |

---

## 5. Order of work (suggested)

1. The two engine notes (HIPS_Y and WALKS/seamLoop) in one small PR, checked with `?test=walkers` and `?shot=` views.
2. Kendal first: it already paces, grounds and holds props correctly, and has the most crowds (platform, beach, station, crash). It becomes the model.
3. Melissa and Eventide next: their walkers slide today and their sad scenes need the mood change.
4. Port Royal's street, tavern, camp and flashback (fixes several audit items at once: the in-step muster, the sine-wave carrier, the endless onlookers).
5. Bog Walk, Nanny Town, Garvey, Tivoli (Garvey and Tivoli need extras added first).
6. New clips from section 2 as their own shared-library PR, starting with IdleVariants, Sweep, Hammer and KidHop.

Each game: `?test=ambient` at `AMBIENT 0` in every place, the place audit still at 0 (`?test=audit`; a later improvement is to pass the spots each ambient person stood on during the run to `auditBodies` as `place.routes`, the way `watch.spots` does for followers), screenshots close up and far off, the phone layout, and the autoplayer.
