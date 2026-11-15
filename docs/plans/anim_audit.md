# Character animation audit: all eight games (15 November 2026)

Read-only. I edited no repo file, made no commit and ran no build (Port Royal's `site/app.js` is tracked in git, so a build would have changed a repo file).

## How I checked

- **The clip library, from the data.** I decoded `shared/models/anims.js` (39 clips) and `games/tivoli/site/models/anims_tivoli.js` (18 clips) in node with gltf-transform. For every clip I got its length, the hips height over time (this shows sitting, kneeling, falling and lying), the upper-arm and forearm angles and head tilt at 9 moments (what the arms do), and the "loop seam": the biggest bone turn between the first and last frame. A large seam means a looping clip snaps.
- **What every game plays.** I scanned every `games/*/src/*.js` for clip names, `animate()`, `ctl.play()`, `pace()`, `grip()`, seats and crowd generators, and compared them with each game's `anim-clips.json`.
- **Line numbers** are against the committed code (HEAD `0bc4502`). While I worked, another session had uncommitted changes to `games/nanny/src/main.js` and `engine/audit.js`, and a new `engine/follow.js` (paced following with `ctl.pace`). Those are not counted here, so some Nanny line numbers may shift and its follower slide may already be in hand.
- **Six clips rendered on real bodies** with Port Royal's existing dev view `?shot=sheet` (the current `site/app.js` is a dev build), driven by Playwright and headless Chrome, one browser at a time: Pray (on Heath), Sword2 (buc2), Wave (sailor), Drink (buc1), StumbleBack and Terrified (Abba). The pictures confirm what the data shows: Pray kneels with hands together and then stands up; Sword2 ends with the man on the ground, legs in the air; Wave is a hand waving at shoulder height the whole time; Drink lifts the LEFT hand to the mouth; StumbleBack ends lying flat on the back; Terrified is a crouch with hands over the head.
- **Not done:** I did not play any chapter through, did not run `?test=walkers` or `?test=held`, and did not measure foot slide. The slide figures below are estimates from the code: speed set in code against the walk's own pace (Eventide's code says the Walk clip covers about 1.3 m a second at clip speed 1).

## The ten things that matter most

1. **Port Royal: the Reverend Heath "preaching" kneels and stands up again every 7 seconds** (`games/port-royal/src/main.js:963`). `Pray` is a one-off clip (kneel, hands together, stand up), but here it loops as his base clip and snaps back to kneeling every 6.9 s.
2. **Hurricane Melissa: in the storm scenes nobody reacts.** Families in the 1951 and 1988 rooms stand on `Idle` while the roof tears off. In the church hall people keep chatting (`SitTalk`) through it (`games/melissa/src/places.js:171-172`, `main.js:532`).
3. **Nanny Town: fighters wave their muskets over their heads.** They play `Cheer` (both hands over the head) and `Wave` with a musket gripped in the right hand (`games/nanny/src/main.js:565`, `:767`). Soldiers play `Terrified` with muskets too (`:554`). Kendal's crowd code has a rule against exactly this; Nanny's held test never tries these clips.
4. **Port Royal: the sword drill's `Sword2` ends with the man falling to the ground**, then the loop snaps him back up every 8.2 s (`main.js:1607`). To a child this reads as being cut down.
5. **Port Royal earthquake: Abba falls flat on her back** (`StumbleBack`), then pops straight up into a run within 0.25 s (`main.js:920-922`).
6. **Helpers who do nothing at a story moment.** Kendal's Nurse Gray at the crash (`places2.js:132`), Bog Walk's Dr Hammond "looks after the men" (`places.js:508`), Eventide's firefighters while the ward burns (`main.js:192`), Melissa's sawman and lineman (`places.js:135`). All of them stand on `Idle`.
7. **Feet slide in five games.** Walkers are not paced to their ground speed (`ctl.pace`) in Port Royal, Marcus Garvey, Nanny Town, Hurricane Melissa and Eventide (Eventide uses a fixed guess). Kendal and Tivoli pace correctly. Bog Walk has no walkers. Nanny's `?test=walkers` checks floating and jumping, not sliding.
8. **One-off waves last about half a second.** `Wave` is a 0.57 s loop, so `play('Wave', true)` shows a flick. Port Royal ends every conversation with it (`main.js:496`, `:629`), including for seated Ned, Benning and Exquemelin. They get a standing clip on a seat for that moment, and grieving survivors in the camp wave cheerfully. Bog Walk's Rudy "waves you over" the same way (`content.js:53`).
9. **Kendal's mento band plays nothing.** Two men `Clap` and one `Talk2`, with no instruments (`places2.js:98`). The railway labourers in chapter 1 "carry" with empty hands, and one walks on the spot (`places1.js:44`).
10. **Every man, elder and child uses one woman's idle, walk and talk clips** (the shared `Idle`, `Walk` and `Talk1` to `Talk3` came from Abba). The engine already damps `Walk` into `WalkM` for men, and the Port Royal guide asks for a male walk. Elders (the whole cast of Eventide) and children have no clips of their own.

---

## 1. The clip library: what each clip shows

All clips share one skeleton. Hips height when standing is about 0.86 m. "Seam" is the snap when a clip loops (under about 5 degrees is invisible). "Once" means it is made to play once and should not loop.

| Clip | Length | Kind | What it shows (from the data, and renders where noted) |
|---|---|---|---|
| Idle | 16.6 s | loop | Standing, small weight shifts. A woman's idle (Abba). |
| Walk | 1.0 s | loop, in place | A woman's walk (hip sway). The engine seam-loops it. `WalkM` is a damped copy for men (engine/anim.js `walkM`). |
| Run | 1.1 s | loop, in place | Running. Seam 41 degrees, fixed by the engine's seamLoop. |
| Talk1 / Talk2 / Talk3 | 4.0 / 5.2 / 10.3 s | loop | Standing conversation gestures. Talk1 uses both arms (forearms up to about 97 degrees). Talk2 mostly the right arm. Talk3 both arms, slower. |
| Point | 2.8 s | once | Right arm raised to shoulder height, pointing, then down. |
| Wave | 0.57 s | loop | Right hand raised at shoulder height, waving the whole time (render). Played once, it lasts about 0.5 s. |
| WaveSlow | 4.8 s | once | One slow wave: arm up, wave, arm down. |
| Laugh | 9.8 s | loop | Laughing, bending forward and back. |
| Clap | 1.2 s | loop | Clapping in front of the chest. Seam 13 degrees (a small twitch each loop). |
| Cheer | 2.9 s | loop | Both arms above the head. Seam 15 degrees. |
| Salute | 2.8 s | once | Right hand to the brow, then down. |
| Sad1 / Sad2 | 2.7 / 4.0 s | loop | Standing, head bowed about 30 degrees, arms hanging. |
| Cry | 6.3 s | loop | Standing, both hands to the face. Gentle. |
| Terrified | 20 s | loop | Crouched, bent forward, hands over the head (render). Ends 12 cm lower than it starts: seam 115 degrees, a snap every 20 s. |
| Pray | 6.9 s | once | Kneeling with hands together, then stands up (render, hips 0.46 m to 0.86 m). Seam 94 degrees if looped. |
| SitIdle | 4.3 s | loop | Seated, still. |
| SitTalk | 44 s | loop | Seated, talking gestures. |
| SitDisbelief | 4.6 s | loop | Seated, hands to the head (grief, shock). |
| SitDrink | 15.2 s | once | Sits down, then drinks seated. The engine plays only 4.7 to 15.2 s. No game plays it. |
| Write | 5.0 s | loop | Seated, head down, writing at a desk. |
| Carry | 2.9 s | loop, in place | Walking with a box held in front in both hands. |
| CarryIdle | 10 s | loop | Standing, holding a box in front in both hands. |
| PickUp | 9.6 s | once | Bends to the ground, picks something up, stands. |
| Drink | 8.9 s | loop | Standing, raises the LEFT hand to the mouth (render). Any cup must go in the left hand. |
| TurnR / TurnL / TurnRW / TurnLW | 1.0 / 1.0 / 1.2 / 1.2 s | once | Turning on the spot (W: a woman's turn). |
| JogStumble | 1.2 s | once | Trips while jogging and recovers. |
| StumbleBack | 3.4 s | once | Staggers back and falls flat on the back, ending lying down (render, hips 0.12 m). The skirt spreads through the ground. |
| Tread | 3.0 s | loop | Treading water. |
| Block | 3.4 s | loop | Crouched boxing guard. |
| Punch | 1.3 s | loop | Boxing punches. |
| Sword1 | 8.2 s | loop | Sword fight moves with crouches. Seam 31 degrees. |
| Sword2 | 8.2 s | loop | Sword fight that ends with the fighter falling to the ground (render, hips 0.16 m). Seam 85 degrees. |
| Sheathe | 1.7 s | once | Puts a sword away. |

**Tivoli's own clips** (`tools/tivoli/clips.json`, packed into `anims_tivoli.js`):
- Lying flat with a rifle: ProneFire, ProneTurnR.
- Firing: ShootRifle (standing, slightly crouched rifle fire); Gunplay (0.57 s) and ShootPistol (pistol fire).
- At a corner: PeekAim (lean out and aim a pistol); PeekCorner (peek round a corner).
- Crouching: Ducking (stand to crouch, once); CrouchIdle; CrouchToStand and CrouchTurnStand (once); WalkCrouchR.
- Running with a rifle: RunLow and RunLow2 (crouched runs); RunForward, RunBackward, RunLeft and RunRight.

**Source files that are retargeted but then dropped.** `tools/anims/optimize_clips.mjs` has an `UNUSED` set that removes these, although their FBX files are in `shared/anim-sources/` and they are listed in `tools/anims/clips.json`: StartWalk, StopWalk, SadWalk, Injured, CarryTurn, BoxTurn, BoxIdle, Defeated, SlashIn, SlashOut, Draw. Two things follow:
- `docs/ENGINE.md` lists StartWalk and StopWalk as being in the library, but they are not.
- `engine/anim.js` names SadWalk in `seamLoop` and `WALKS`, but SadWalk is not packed.
- SadWalk, StartWalk, StopWalk, BoxIdle and BoxTurn are cheap to bring back (no download needed). Injured and Defeated should stay out (rule 4).

---

## 2. Each game

### Port Royal 1690

**Clips available:** the whole shared library (39), because there is no `games/port-royal/anim-clips.json`, plus the derived `WalkM`. It plays 38 of them. `SitDrink` is the only one never played.

All references are to `games/port-royal/src/main.js`.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker in a conversation | 495 | Talk1, Talk2, Talk3 in turn; SitTalk if seated; a line's own gesture (Point 153, 1616, 1662, 1669, 1690; Laugh 1670) | fits |
| End of every conversation | 496, 629 | `Wave` once (about 0.5 s) | **weak.** Too short to read as a wave. Ned (1506), Benning (961) and Exquemelin (1702) are seated: Wave is a standing clip, so for half a second their legs straighten under the seat anchor. Grieving camp survivors wave cheerfully. |
| People turn to face you | 1122, 1138 | TurnL/TurnR (men), TurnLW/TurnRW (Abba), once | fits |
| Abba at the tavern door | 1158-1161, 1123 | her own idle plus breathing and head-follow code | fits |
| Kofi carrying crates on the pier | 498-509 | CarryIdle, Carry (crate held between both hands), PickUp at the stack, `Walk` on the way back | fits the action. **Weak:** Carry and Walk are not paced at 1.25 m/s (slide); a woman's Walk on a man for the empty leg. |
| The soldier's patrol | 775-790 | `Walk` at 0.85 m/s, not paced; half-pike placed at an open right hand | **weak.** Feet slide (estimate 0.4 m/s); Walk, not WalkM; the pike is not gripped (known; `docs/STANDARD.md`). |
| New-street strollers (Peter, Mendes, Constable Hart) | 1403, 1424 | `Walk` at 0.75 m/s, not paced | **weak.** Slide (estimate 0.5 m/s); a woman's walk on men. |
| Grace, market seller | 1413, 1419 | Abba's body, Idle base; WaveSlow, Point, Talk2 or Talk1 once every 6 to 13 s; basket fixed to the head bone | fits (she calls out) |
| Ned sitting at his table | 1506 | SitIdle; SitTalk when he speaks; seat anchor | fits (apart from the end-of-talk Wave) |
| Tavern buccaneers | 1507, 1513-1517 | Idle; then a 26 s cycle: Drink, Talk1/Laugh, Punch/Block, Laugh, Talk2/Talk3 | **weak.** Drink with no tankard (the clip raises the left hand). A punch-up in the foreground, close to the player; rule 4 says fights stay in the background. |
| Gunner at Fort Charles | 1508, 1593 | Idle; Salute once, then the cannons fire by themselves | fits. Missing (low): nobody works the guns. |
| Quake, tremor | 919 | Abba `Terrified` | fits |
| Quake, main shock | 920-922 | `StumbleBack` once (she falls flat), then at 2.5 s `Run` at 4.6 m/s (not paced) with one `JogStumble` | **weak.** She lies on the ground and pops into a run within 0.25 s. The fall flat on the back is hard for 6+. Missing: a get-up, or a stagger that stays on its feet. |
| Quake, everyone else | 895 (`npcShow(false)`) | hidden | Missing (optional): nobody else is seen running. Keep any crowd in the background. |
| Galdy in third person | 1107-1109 | `updateWalk` (WalkM at speed / 1.3, close to paced); Tread in the sea | fits. The guide notes a heel flick. |
| Abba leaves the warehouse | 646 | WaveSlow once, then she vanishes after 2.6 s | wave fits. **Weak:** she disappears instead of walking out. |
| Camp survivors standing | 165, 959-960 | Sad1, Sad2, Sad2, Cry on tinted clones | fits |
| Sam and Kofi in the camp | 961 | Sad2 and Sad1; Talk1 to Talk3 when they speak | fits standing. **Weak** while talking: cheerful chat gestures in grief. |
| Benning on a box in the camp | 961 | SitDisbelief on a seat made for him | fits |
| The Reverend Heath "preaching in a tent" | 963 | `Pray` as a looping base | **wrong.** He kneels with hands together, stands up, and snaps back to his knees every 6.9 s (render). Preaching needs a standing speech clip. The render also shows coat tails sticking out in spikes while kneeling (a cloth issue). |
| Flashback: Morgan | 1610, 1616-1690 | Idle; Point and Laugh on his lines | fits |
| Flashback: sword drill | 1607, 1631, 1712 | Sword1 and Sword2 looping, cutlass parented to the hand; Sheathe or Laugh at the end, then the loop again | **weak, rule 4.** Sword2 ends on the ground and snaps up every 8.2 s (render). Sword1 has a 31 degree seam. The render also showed Sword2's body starting off its spot (clipFor keeps the first frame's hips x and z); not measured. |
| Flashback: crate carrier | 1608, 1634-1635 | `Carry` while moved back and forth on a sine wave (0 to 1.1 m/s), turned 180 degrees in one frame at each end | **weak.** Feet slide, worst near the ends where he slows to a stop while still striding; instant turn. |
| Flashback: onlookers | 1598 | Laugh, Talk2 and Wave as endless base clips | **weak.** Talk2 to nobody; Wave never stops. |
| Flashback: quartermaster | 1703 | Talk2 as his base clip | **weak.** Talks to nobody between conversations. |
| Flashback: Exquemelin writing | 1695-1702 | Write, seated at a desk with a book | fits. **Weak:** no quill in his hand. |
| Flashback: muster cheer | 1717 | every man plays Cheer or Clap in the same frame | **weak.** In step (`play()` restarts each clip at 0). |

### Marcus Garvey

**Clips available (7):** Idle, Walk (and WalkM), Talk1, Talk2, Talk3, SitIdle, SitTalk.

All references are to `games/garvey/src/main.js`.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker / listener | 490, 498 | Talk1 to Talk3; SitTalk when seated; Idle on "You" lines | fits |
| Printer at his type stand (ch 1) | 247, 287 | Idle; turns to look at you | **weak.** He stands still while saying "Mind the type". Missing: setting type at the case. |
| Customer walking through the shop | 256, 289-294 | Walk at 1.05 m/s, not paced | fits; small slide (estimate 0.25 m/s) |
| Hall: neighbours walk in and sit (ch 2) | 281-283, 277, 632-634 | Walk at 1.25 m/s (not paced), then SitIdle at once | fits overall. **Weak:** a pop from walking to sitting, with no sit-down. The older man walks like the young man. |
| Hall: Garvey's speech (stage 13) | 627, 490 | Talk1 to Talk3 (conversation clips); listeners on SitIdle | **weak.** A public speech done with chat gestures. No applause (Clap is not shipped). |
| Harlem soapbox (ch 3) | 694, 1356 | Garvey Idle on the box (0.55 m up), Talk1 to Talk3; worker, woman, older man on Idle (697-703) | **weak.** A street speech with chat gestures; listeners neutral. |
| Press room (ch 4) | 800-807 | pressman, Garvey and sailor on Idle | **weak.** The pressman never works the press; the sailor carries no bundles. |
| Dock (ch 5) | 872-882 | Garvey, share clerk, engineer, friend on Idle | fits (a talk scene) |
| Liberty Hall convention (ch 6) | 950-963 | nurse, traveller, messenger, steward, Garvey on Idle | **weak.** A convention with no cheering or clapping. |
| Amy Jacques Garvey's desk (ch 7) | 1038 | Idle, standing | **weak.** The chapter is "played from her desk"; she could sit and write (`Write` is in the library but not in Garvey's list). |
| Park today (ch 8) | 1126-1129 | guide Idle; student (child body, scale 0.85) Idle | fits |
| Cloth test poses | 1406 | asks for `Wave`, which is not in `anim-clips.json` | **missing clip, silently skipped** (`engine/audit.js:318` skips missing poses) |

### Kendal 1957

**Clips available (18):** Idle, Walk, Run, Talk1, Talk2, Talk3, Wave, Laugh, Clap, Cheer, SitIdle, SitTalk, SitDisbelief, Sad1, Sad2, Carry, CarryIdle, Cry. SitDisbelief and Sad2 are shipped but never played.

Kendal paces every walker (`main.js:194`, `:201`, with `walkSpeed` scaling for small bodies), keeps held props out of waving crowds (`cast.js:70`) and anchors seats properly. It is the model to copy.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker | `main.js:311`, `:316` | Talk1 to Talk3, then back to the base clip | fits. **Weak** for Dawn (base Sad1): the lost girl switches to chat gestures. |
| Seated speaker | `main.js:311` (guard) | keeps SitIdle, never gestures | weak (minor): SitTalk exists |
| Road 1844: Mass Dudley loading the mule | `places1.js:40`, `main.js:412` | Idle; Talk2 once for each item loaded | **weak.** He never lifts anything. |
| Road: Miss Cleo with a basket on her head | `places1.js:41` | Idle, basket held on the head | fits |
| Road: traveller | `places1.js:42` | Walk on a path, paced | fits |
| Road: railway-works labourers | `places1.js:44` | Carry and CarryIdle with no prop; Idle; Talk2 | **wrong.** `Carry` is a walking clip on a man who stands still, so he walks on the spot. Both carry clips hold an invisible box. |
| 1845 terminus crowd | `places1.js:72`, `cast.js:74` | Idle, Wave, Clap, Cheer, Talk1 as endless base clips (random start times) | fits the occasion. **Weak:** the cheering never stops; Cheer has a 15 degree seam. |
| Fireman on the engine | `places1.js:71` | `Wave` as base | **weak.** Waves without stopping. |
| Ride 1845: open carriage | `places1.js:85-86` | SitIdle and SitTalk on 0.48 m seats | fits |
| Hill station 1890s | `places1.js:111-114` | stationmaster, foreman, farmer, young Ezra on Idle | fits for talk. Missing (low): nobody else carries bananas (you carry four bunches alone). |
| Kingston 1957: Gran with her hamper | `places2.js:43` | Idle with the hamper gripped; Talk1 to Talk3 while holding it | fits. The talk gestures with the hamper are never checked (`?test=held` steps only the base clip, `main.js:766`). |
| Kingston 1957: Lloyd | `places2.js:44` | `Wave` as base | **weak.** A child waving without end. |
| Kingston 1957: guard walking the train | `places2.js:46` | Walk, paced | fits |
| Kingston 1957: platform crowd | `places2.js:48-49` | crowd57 mix (Idle, Talk1, Talk2, Laugh, Wave); walkers paced | fits. **Weak:** Talk1 and Talk2 on people facing random ways (talking to nobody). |
| Coach, by day and night | `places2.js:71-76` | SitIdle and SitTalk | fits |
| The crash run in the coach | `main.js:502-516` | seated people keep SitIdle and SitTalk | **weak.** Lloyd keeps chatting (SitTalk) while "We are going so fast!"; "Gran takes your hand" happens in text only. Missing: seated brace or fear. |
| Beach crowd | `places2.js:96-97` | Idle, Wave, Laugh, Cheer; some walk, paced | fits. Missing: children playing (40% of this crowd are children). |
| Mento band | `places2.js:98` | Clap, Clap, Talk2; no instruments | **wrong.** The toast says "Banjo, guitar and a rumba box" (`main.js:430`), but nobody plays anything. |
| Crash site: Gran | `places2.js:129` | Idle | **weak.** Neutral after a crash; sad or sitting would fit. |
| Crash site: Lloyd | `places2.js:130` | Sad1 | fits |
| Crash site: Mr Clive and Sister Louise with lanterns | `places2.js:131`, `:134` | Idle with a lantern gripped | fits |
| Crash site: Nurse Gray | `places2.js:132` | Idle | **weak.** A nurse doing nothing. Missing: kneel and tend. |
| Crash site: Dawn, the lost girl, follows you | `places2.js:133`, `main.js:194`, `:528` | Sad1; Walk or Run when following, paced | fits |
| Crash site: survivors by the fire | `places2.js:136-138` | Cry | fits (gentle) |
| Crash site: helpers with lamps | `places2.js:140-142` | Idle; six at the calling place on Talk1 | fits. **Weak:** the Talk1 group all face one way. (Note: `villagers()` ignores its own `anims` option, `cast.js:86-90`.) |
| "Helpers carry people up the path" | `main.js:529-532` | text only | missing (optional, gentle): helpers walking up with lamps and blankets |
| Water for the nurse: "She drinks" | `main.js:436` | toast only | missing: Drink is not shipped |
| Memorial: Miss Joy and Andre | `places2.js:164-165` | Idle | fits |
| Memorial: school children | `places2.js:166` | Idle, Talk1, Idle, Laugh | **weak.** Laughing at a disaster memorial (wrong mood). |
| Memorial: leave a flower | `main.js:551` | the flower appears; nobody moves | fits (first person) |

### Bog Walk 1904

**Clips available (17):** Idle, Walk, Talk1, Talk2, Talk3, Carry, CarryIdle, PickUp, Point, Wave, Cheer, Clap, Sad1, Sad2, SitIdle, SitTalk, Laugh. Walk, Carry, CarryIdle and PickUp are shipped but never played. Nobody walks in this game.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker | `main.js:423`, `:428` | the line's own `anim` once (Wave, Point), otherwise Talk1 to Talk3 | fits |
| Rudy waves you over | `content.js:53` | `Wave` once | **weak.** About half a second. Use WaveSlow (not shipped) or loop Wave for about 2 s. |
| Station: Bass Henry, Zeke | `places.js:447-448` | Idle | fits |
| Zeke at the valve: "Help me turn the wheel" | `places.js:449` (`zekeV`) | Idle while you turn the wheel | **weak / missing:** two hands on the wheel |
| Station labourers | `places.js:450`, `:452` | a Talk1/Talk2 pair facing each other; Idle with lamps; Idle with a bucket; SitTalk and SitIdle on the bench | fits |
| Inside the Tube | `tube.js` | nobody visible | fits (by design: people are heard, not seen) |
| Kingston 1899 crowd before the car | `places.js:669`, `cast.js:42` | Cheer, Clap, Idle, Wave, Talk1, Laugh as endless base clips | **weak.** They cheer before anything happens. |
| The car rolls out | `main.js:619` | every extra starts Cheer, Clap or Wave in the same frame | **weak.** In step. |
| 1899 "children" | `cast.js:44` | the adult `nb_youth` body scaled to 0.58 to 0.78, with adult clips | **weak.** The standard asks for real child bodies. |
| Mr Bertie, the conductor, the woman | `places.js:666-668` | Idle; the woman points once | fits |
| Yard: survivors on forms in blankets | `places.js:503-504` | SitIdle and SitTalk | fits |
| Yard: veranda officials and families | `places.js:506` | Sad1, Idle, Sad2 | fits |
| Dr Hammond "looks after the men" | `places.js:508` | Idle | **weak.** Missing: kneel and tend. |
| Ministers "talk with families" | `places.js:509-510` | Idle holding a book; Talk2 alone | fits / **weak** (talks to nobody) |
| Mr Haggart "writes names in a book" | `places.js:511` (table and book at 513-514) | Idle, standing beside the table | **weak.** Missing: writing (seat him with `Write`, or a standing-write clip). |
| Mr Osborne-Smith "speaks calmly to the crowd" | `places.js:512` | Talk3 loop | fits (a speech clip would be better) |
| The Gleaner reporter with a notebook | `places.js:515` | Idle; Talk1 to Talk3 while holding it | fits. Not checked with the talk gestures. |
| Miss Ivy, Zeke's daughter | `places.js:516` | Idle; Talk1 to Talk3 | **weak.** A grief scene with neutral and chatty clips (Sad1 and Sad2 are shipped). |
| Families at the gate | `places.js:518-520` | Idle, Sad1, Sad2 | fits |
| Ruins today: Miss Grant, Kemar, visitors | `places.js:540-542` | Idle; visitors Idle, Talk1, Point | fits |

### Nanny Town 1734

**Clips available (13):** Idle, Walk, Run, Talk1, Talk2, Talk3, Point, Wave, Cheer, Clap, Terrified, Sad1, Drink.

There is no `pace()` call anywhere in this game.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker | `main.js:311` | Talk1 to Talk3 | fits |
| Estate: Quamin leads, Mama follows | `main.js:184-191` | Walk or Run at 0.9 to 5.4 m/s, not paced | **weak.** Feet slide badly at speed (Walk is used up to 3 m/s). |
| Estate: watchman with a lantern | `places.js:59` | Walk at 1.15 m/s, not paced; lantern gripped | fits; small slide |
| Town: villagers | `places.js:110`, `cast.js:39` | Idle, Talk1, Talk2, facing random ways | **weak.** A working town with no work (hoeing, pounding, carrying on the head); people talk to nobody. |
| Planting yams: Mimba claps | `main.js:436` | Clap once | fits |
| Cubbenah drinks | `main.js:401` | Drink once, no gourd | **weak.** Drinks from an empty left hand. |
| Nanny far off, on the rock and under the tree | `places.js:108`, `:190` | Idle | fits (still and far away, as the game's rule 2 asks) |
| Fight: soldiers march, halt, flee | `main.js:527`, `:531-533` | Walk at 2.6 m/s (not paced), Idle, Run at 3.4 m/s, muskets in hand | **weak.** Slide. Running with a musket is not checked by `?test=held`. |
| Fight: "the soldiers fire back at nothing" | `main.js:554` | a third of them loop `Terrified`, musket in hand | **weak.** Nobody fires; Terrified swings the musket about; 20 s loop snap. |
| Fight: the hillside full of fighters | `main.js:565`, `:767` | Cheer or Wave with a musket in the right hand | **wrong.** The musket is waved over the head. |
| Fight: Cubbenah points | `main.js:551`, `:560` | Point once | fits |
| 1734 night: villagers flee | `places.js:111`, `main.js:588` | base Idle, Terrified, Idle or Talk1; follow with Walk or Run, not paced | **weak.** Talk1 during an attack; slide. |
| 1734 night: Phibba crying by the cotton tree | `places.js:104`, `main.js:579` | Sad1, then Idle when she comes with you | fits (gentle; Cry is not shipped) |
| 1734 night: soldiers in the taken town | `places.js:113` | Idle with muskets, far off | fits |
| New Nanny Town 1740 | `places.js:190-191` | Idle; villagers Idle and Talk | fits |
| The checks themselves | `main.js:816-819`, `:842`, `:829` | `?test=held` tries only the base clip and Walk; `?test=walkers` measures floating and jumping, not sliding; the cloth poses ask for `SitIdle`, which is not shipped (silently skipped) | gaps |

### Eventide 1980

**Clips available (7):** Idle, Walk, Talk1, Talk2, Talk3, Sad1, Sad2.

All references are to `games/eventide/src/main.js`.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker | 328 | Talk1 to Talk3, skipped when the speaker holds something | fits (a good guard). Gran therefore never gestures. |
| Slipe Pen Road: Gran with her basket, the gateman | 181 | Idle | fits |
| Miss Iris on the veranda (blind, elderly) | 181 | Idle, standing | **weak.** The guide plans her seated on the veranda; she uses a young woman's idle. |
| Pavement walkers | 183-184, 203, 538 | Walk with clip speed = speed / (1.3 x scale), not `pace()`; elders at 0.6 m/s | fits roughly. **Weak:** elders use a young woman's walk slowed to 0.55. |
| Ward: residents by their beds | 185-186 | Idle, standing | **weak.** Old women in a crowded ward all standing; sitting on a bed edge or a chair would fit. |
| Ward: Nurse Bell | 185 | Idle | fits |
| Goodnight at dusk: residents on the veranda, a hymn | 187-188 | Idle | **weak.** Missing: singing, and a goodnight wave (Wave is not shipped). |
| Night: firefighters | 192 | Idle, one holding a bucket; a hose lies on the ground (`places.js:258`) | **weak.** They stand still while the ward burns. Missing: hose work, carrying, a ladder. |
| Night: police at the rope | 192 | Idle | fits |
| Night: neighbours | 192 | Idle, Sad1, Sad2 | fits |
| Night: "Firefighters lead the children out" | 438-445 | the three children walk alone at 1.7 m/s | **weak.** No adult walks with them. Missing: walking hand in hand. |
| Night: Miss Hyacinth and Miss Maude in blankets | 190 | Idle, blanket cape | fits (gentle); tired or seated would fit better |
| Day of mourning | 193-194 | mourners and officials Idle; crowd in black Idle, Sad1, Sad2 | fits. Missing: "an old lady being comforted" (in the guide); staff walking to the grave (SadWalk is dropped from the library). |
| Golden Age Home | 195-196 | Idle | **weak.** Residents standing; seated would fit. |
| Monument: the guard | 197-198 | Idle | **weak.** An honour guard at ease; no attention stance. |
| Monument: people laying flowers | 198 | crowd Idle, Talk1, Talk2 | **weak.** Chatting at a remembrance. Missing: laying a flower, bowing the head. |

### Hurricane Melissa

**Clips available (21):** Idle, Walk, Talk1, Talk2, Talk3, Wave, Laugh, Clap, Cheer, SitIdle, SitTalk, Sad1, Sad2, Carry, CarryIdle, Cry, Pray, Point, PickUp, Drink, Write. Twelve are shipped but never played: Wave, Clap, Cheer, Sad2, Carry, CarryIdle, Cry, Pray, Point, PickUp, Drink, Write.

There is no `pace()` call in this game.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Speaker | `main.js:309`, `:314` | Talk1 to Talk3 | fits |
| 1951 and 1988 yards | `places.js:120-126` | family Idle; two extras on Talk1 and Talk2, far apart | fits / **weak** (talking to nobody) |
| The three jobs (drum, boards, canoe, washing) | `main.js` `ACTIONS_FOR` | only you work; Papa or Dad stands on Idle | **weak.** Missing: hammering, carrying. |
| Storm in the room, 1951 and 1988 | `places.js:171-172`, `main.js:532` | Papa, Mama, Miss Ivy (and Dad, Mama, Delroy, Mass Clifford) stand on Idle while the roof lifts | **wrong.** A disaster scene where nobody reacts. Missing: a seated huddle or fear clip. Cry and Sad2 are shipped and unused. |
| 2025 yard | `places.js:128-129` | Mum, Grandpa, Miss Bev, Mr Raymond, Miss Hyacinth on Idle | **weak.** Mr Raymond stands still while you hand up nails. Missing: hammering. |
| Church hall pews | `places.js:208-213` | SitIdle and SitTalk | fits |
| Church hall: Pastor Gayle, Nurse Simone, Mum, Keisha (child), Marlon | `places.js:210-211` | Idle | **weak.** The pastor leads a hymn on Idle; the nurse does nothing. |
| Hall storm and hymn | `main.js:532` | nothing changes | **weak.** People keep chatting (SitTalk) as the roof opens. Missing: seated fear, hands together. (`Pray` is shipped but kneels.) |
| "Sit down with Mum and Gran" | `main.js:413` | Mum stands on Idle | weak |
| After the storm: Mum follows you home | `main.js:190`, `:569` | Walk at 0.8 to 2.2 m/s, not paced | **weak.** Slide. |
| After: Mr Raymond, the soldier, Jordan, the sawman, the lineman | `places.js:132-135` | Idle; the soldier on Talk2 | **wrong** for the sawman (chainsaw sound, no saw, no movement) and the lineman. Missing: sawing, hammering, carrying. |
| After: village people | `places.js:134` | Idle, Talk1, Sad1 | fits |
| Today: Miss Campbell, Andre, Grandpa | `places.js:137` | Idle | fits |
| Village walkers, every era | `cast.js:78-81`, `main.js:195-198` | Walk at 1.1 m/s, not paced (children too) | **weak.** Slide. |

### Tivoli

**Clips available:** 7 shared (Idle, Walk, Run, Talk1, Block, Point, Terrified) and the 18 of its own listed in section 1. Terrified is shipped but not played.

| Moment | Where | Clip now | Verdict |
|---|---|---|---|
| Back-o-Wall 1963: Ivy (a girl), Miss Pearl, Mass Roy | `backowall.js:77-79` | Idle | fits |
| Speaker | `talk.js:34`, `:39` | Talk1 only, held through your own lines too | **weak.** One clip; the speaker gestures while you talk. |
| Street, May 2010: soldiers and police advance | `fight.js:112` | `AdvanceReady`, which falls back to the stand-in `Walk` (paced) with a rifle | **weak.** The only stand-in left (`clips.js` says do not ship with one). |
| Street: run to cover | `fight.js:112` | RunLow, paced | fits |
| Street: firing | `fight.js:25` | StandFire (ShootRifle), PistolFire (ShootPistol) | fits (this game's owner exception to rule 4) |
| Street: duck and crouch behind cover | `fight.js:25`, `:108` | Ducking, then CrouchIdle | fits |
| Street: gunmen in hiding places | `fight.js:38` | the same loops | fits |
| Poses defined but not used now | `clips.js:14-31` | CrouchAim and CrouchFire map to ShootRifle, a standing shot | weak if they are ever used |
| Civilians, families indoors (chapters not built yet) | none | none | to come |

---

## 3. Patterns that repeat across games

1. **Crowds react in step.** `animate()` starts each base clip at a random time, so idle crowds are not in step. But `ctl.play()` restarts a clip at 0, so a whole crowd reacting at once moves as one:
   - Port Royal's muster (`main.js:1717`);
   - Bog Walk's tram cheer (`main.js:619`);
   - Nanny's fighters (`main.js:565`, `:767`).

   Every crowd in every game also shares the one `Idle`.
2. **Clips that loop visibly:**
   - Pray (94 degree seam) as Heath's base;
   - Sword2 (85 degrees, ends on the ground) and Sword1 (31 degrees) in Port Royal;
   - Terrified (115 degrees, 20 s) as a loop in Nanny;
   - Cheer (15 degrees) and Clap (13 degrees) as base clips in Kendal and Bog Walk crowds.

   The engine's `seamLoop` list (`engine/anim.js`) covers only Walk, Run, Carry and Tread.
3. **Sitting clips without a seat:** none found. Every seated person has a seat anchor and a seat.
   - The opposite does happen: a standing clip on a seated person (Port Royal's end-of-talk Wave).
   - There are no sit-down or stand-up transitions anywhere (Garvey's neighbours, Melissa's "Sit down with Mum and Gran").
4. **Talking clips on people who talk to nobody:**
   - Port Royal: the quartermaster and an onlooker (`main.js:1598`, `:1703`);
   - Kendal: crowds facing random ways, the calling-place group, the band's Talk2;
   - Bog Walk: a minister alone;
   - Melissa: extras far apart;
   - Nanny and Eventide: villagers and crowds facing random ways.
5. **Walk clips without `pace()`:** Port Royal (soldier, strollers, Kofi, the flashback carrier, Abba's run), Garvey (all walkers), Nanny (all walkers and followers), Melissa (walkers and Mum), Eventide (a fixed 1.3 m/s guess).
6. **Work clips with nothing in the hand:**
   - Kendal's labourers with Carry and CarryIdle (`places1.js:44`);
   - Drink with no cup (Port Royal tavern, Nanny's Cubbenah);
   - Exquemelin writing without a quill.
7. **Held things during clips that do not hold them:**
   - Nanny: muskets with Cheer, Wave and Terrified;
   - Kendal, Bog Walk and Eventide: talk gestures with a hamper, lantern, notebook or book. Eventide skips gestures for holders; Kendal and Bog Walk do not.
   - The held tests step only the base clip (Kendal, Melissa, Bog Walk) or the base clip and Walk (Nanny). Talk, Run and scripted clips are never checked with the prop in the hand.
8. **Sad scenes on neutral clips:**
   - Port Royal: grieving survivors switch to Talk gestures and a cheery Wave;
   - Kendal: Gran Idle at the crash, Lloyd chatting during the crash run, Dawn on Talk;
   - Bog Walk: Miss Ivy on Idle;
   - Melissa: every storm scene;
   - Nanny: Talk1 during the 1734 attack;
   - Eventide: Talk at the monument;
   - Kendal: Laugh at the memorial.
9. **Rule 4 (difficult history told gently):**
   - Sword2 falls to the ground on every loop;
   - StumbleBack falls flat on the back (Port Royal's quake);
   - a foreground punch-up in Port Royal's tavern.

   Injured and Defeated are rightly kept out of the packed library. Tivoli's gunfire clips follow its own written exception.
10. **Adult clips on children.** Every child uses the adult (woman's) clips. They mostly read fine when scaled, and Kendal slows small walkers correctly. Bog Walk's 1899 and today crowds use a scaled adult body instead of a child body (`cast.js:44`, `:57`).

---

## 4. Unused clips, and clip names that do not exist

**In the packed library, played by no game:** `SitDrink`.

These are played only by Port Royal: Sword1, Sword2, Sheathe, Punch, Salute, Tread, JogStumble, StumbleBack, the four Turns, WaveSlow, SitDisbelief and Write. That costs nothing, because each game trims the library to its own list.

**Shipped by a game but never played:**
- Kendal: SitDisbelief, Sad2;
- Bog Walk: Walk, Carry, CarryIdle, PickUp;
- Melissa: Wave, Clap, Cheer, Sad2, Carry, CarryIdle, Cry, Pray, Point, PickUp, Drink, Write (twelve, and several Melissa moments in section 2 need them);
- Tivoli: Terrified.

**Asked for, but not available (a fallback or a silent skip happens):**
- Marcus Garvey: `Wave` in the cloth-test poses (`main.js:1406`). It is not in `games/garvey/anim-clips.json`, so `auditCloth` skips it silently.
- Nanny Town: `SitIdle` in the cloth-test poses (`main.js:829`). It is not shipped, so it is skipped silently.
- Tivoli: `AdvanceReady` has no clip and plays the stand-in `Walk` (`clips.js:30`). CrouchAim and CrouchFire fall back to ShootRifle.
- Engine and docs: `SadWalk` (in `seamLoop` and `WALKS`), and `StartWalk` and `StopWalk` (in `docs/ENGINE.md`'s list), are not in the packed library.
- At runtime, `ctl.play(name)` with a missing name does nothing, silently (`engine/anim.js`, `play`). A typo would never be noticed.

---

## 5. New clips needed

The engine treats clips by their names (`HIPS_Y`, `WALKS` and `^Sit` in `engine/anim.js`), so the suggested names follow those families:
- `Sit*` for seated clips (they get the seat anchor);
- a kneel or crouch name added to `HIPS_Y`;
- any clip that walks added to `WALKS` and to the seam-loop list.

Mixamo names are search terms only. I did not check exact clip titles.

**Hands** says where a prop goes (R = right, L = left).

### High priority: a story moment looks wrong today

| Clip | What it must show | Games and moments | Search | Prop (hand) | Child version |
|---|---|---|---|---|---|
| **Speech** | Standing, speaking to a crowd: open arms, one arm raised now and then, weight shifts; loops 8 to 15 s | Port Royal: Heath preaching (replaces the Pray loop). Garvey: the hall speech, the soapbox, Liberty Hall. Melissa: Pastor Gayle. Bog Walk: Osborne-Smith. | search: "speech", "giving a speech", "preaching" | none, or a book (L) for a preacher | no |
| **KneelTend** | Down on one knee, hands working low in front (helping, giving water, checking on someone); loops | Kendal: Nurse Gray at the crash. Bog Walk: Dr Hammond. Melissa: Nurse Simone. Eventide: the nurse at the night scene. Port Royal: the camp. | search: "kneeling", "kneel idle" | optional cup or cloth (R) | no |
| **SitFear** and **StandHuddle** | Seated: tense, holding the seat or the person next to them, looking up. Standing: arms round themselves or another person, looking up. Both loop, gently. | Melissa: storm rooms (1951, 1988) and the church hall. Kendal: the crash run in the coach. Eventide: neighbours at the rope. | search: "scared", "nervous", "sitting scared" | none | yes (Delroy, Keisha, Lloyd) |
| **Comfort** | An arm round someone's shoulders, or a hand on their shoulder; pairs with a Sad or Cry partner | Eventide: "an old lady being comforted" at the mourning. Bog Walk: Miss Ivy, families at the gate. Kendal: Gran with Lloyd at the crash site. Port Royal: the camp. Melissa: after the storm. | search: "consoling", "comforting", "hug" | none | yes (a child being held) |
| **GetUp** (or **StaggerQuake**) | From lying on the back to standing in about 2 s. Or, better for 6+, a stagger and catch of balance that never reaches the ground. | Port Royal: Abba in the quake (replaces StumbleBack, or follows it before Run) | search: "getting up", "stand up", "stumble" | none | no |
| **WalkReady** | Walking slowly with a rifle held at the ready; loop, in place | Tivoli: `AdvanceReady`, the last stand-in | search: "rifle walk", "walk with rifle" | rifle (both) | no |
| **PlayBanjo** / **PlayGuitar**, **SitRumba**, **Shaker** | Strumming a banjo or guitar; sitting on a rumba box and plucking its keys; shaking a shaker. Loops. | Kendal: the mento band at the beach | search: "guitar playing", "playing drums", "playing maracas" | banjo or guitar (both), shaker (R) | no |
| **CarryWork** fix | Not a new clip: give Kendal's labourers a box prop, or swap Carry for CarryIdle or Idle, or give them a path | Kendal: `places1.js:44` | none | box (both) | no |

### Medium priority

| Clip | What it must show | Games and moments | Search | Prop (hand) | Child version |
|---|---|---|---|---|---|
| **OldIdle**, **OldWalk** (and **OldWalkCane**) | A slight stoop, slower weight shifts, short steps; the cane variant leans on a stick | Eventide (most of the cast). Kendal: Gran, Mass Ezra. Melissa: Grandpa, Gran, Miss Hyacinth. Bog Walk: Zeke. Garvey: the older men. Nanny: Mimba. Port Royal: Ned. | search: "old man idle", "old man walking", "elderly" | cane (R) for the cane variant | no |
| **ManIdle**, **ManWalk**, **ManTalk1-3** | A male set to replace the woman's Idle, Walk and Talk on men (the Port Royal guide asks for a male walk) | every game's men | search: "idle", "walking", "talking" (choose male-recorded ones) | none | no |
| **KidIdle**, **KidRun**, **KidPlay** (hop, skip, jump for joy, chase) | Lively child movement; loops | Kendal: beach and memorial children. Nanny: village children. Melissa: Keisha, Delroy. Eventide: the children. Tivoli: Ivy. Bog Walk: 1899 crowd. | search: "jump", "skipping", "happy idle", "excited" | none | is the child version |
| **SitGround** and **SitGroundSad** | Sitting on the ground, knees up or cross-legged; the sad version with arms round the knees, head low. Loop. | Port Royal: the camp. Bog Walk: the yard (the guide says "sit on the ground in blankets"). Kendal: the crash site. Melissa: after the storm. Nanny: the town. Kendal: the beach. | search: "sitting on ground", "sitting idle floor" | none | yes |
| **StandPray** / **SitPray** | Hands together, head bowed (standing or seated); a loop, unlike the current kneel-and-stand Pray | Melissa: the hymn in the hall. Eventide: the goodnight hymn and the monument. Kendal: Sister Louise. Port Royal: the camp. | search: "praying" (pick a looping standing or seated one) | none, or a hymn book (L) | no |
| **SingHymn** | Seated or standing, singing, gentle sway, may hold a hymn book | Melissa: the hall storm hymn. Eventide: the goodnight hymn and the 1980 crowd's hymn. | search: "singing" | hymn book (L), optional | no |
| **Hammer** | Hammering at waist and chest height, and overhead | Melissa: Mr Raymond (nails, roof, boards), the three jobs. Kendal: the 1845 railway works. Port Royal: Benning the pewterer. | search: "hammering" | hammer (R) | no |
| **Dig** / **Hoe** | A two-handed hoe or shovel stroke; loop | Nanny: yam gardens. Kendal: navvies at the railway works. Bog Walk: shovelling sand (not shown now). Melissa: the clean-up. | search: "digging", "shoveling" | hoe or shovel (both; `grip()` twice) | no |
| **CarryBucket** | Walking and standing with a heavy bucket in one hand, leaning away from it | Kendal: helpers fetching water. Bog Walk: the labourer with a bucket. Eventide: a firefighter. Melissa: the water truck. | search: "carrying heavy object", "suitcase walk" | bucket (R) | no |
| **CarryHead** | Walking and standing with a load balanced on the head, one hand up to steady it | Port Royal: Grace. Kendal: Miss Cleo, and banana carriers at the hill station. Nanny: villagers carrying water and yams. | search: "carry on head" (may not exist; may need hand keying: steady head, one arm up) | basket or bunch (Head, using the existing `hold()`) | yes |
| **WorkBench** | Standing at a waist-high bench, hands busy (setting type, sorting, writing on a stand) | Garvey: the printer, the pressman. Bog Walk: Mr Haggart (or seat him with `Write`). Kendal: the clerk. | search: "typing", "working at table" | composing stick (L) for the printer | no |
| **Give** | Holding an item out with one hand, then back to rest; once | Kendal: Mass Ezra gives the lamp. Port Royal: Abba's stew. Eventide: the gift for Miss Iris. Melissa: nails. | search: "giving", "handing over" | the item (R) | yes |
| **PlaceFlower** | Bending (or kneeling), laying something on the ground, standing with head bowed; once | Kendal: the memorial crowd. Eventide: people laying flowers at the monument (in the guide). Port Royal: the tombstone. | search: "put down", "placing object", "kneel" | flower (R) | yes |
| **MusketFire** | Shoulder a long gun, aim, a small recoil; background only | Nanny: soldiers "fire back at nothing". Port Royal: the garrison. Tivoli's ShootRifle might serve if shared; check it with a musket. | search: "rifle aiming", "shooting rifle" | musket (both) | no |
| **SitDown** / **StandUp** | Transitions to and from a seat, about 1.5 s each | Garvey: the neighbours sit. Melissa: "Sit down with Mum and Gran". Kendal: the coach. Port Royal: Galdy's desk. (SitDrink's first 4.7 s is a stand-to-sit already in the library.) | search: "stand to sit", "sit to stand" | none | yes |
| **SadWalk** (bring back) | A slow walk with head bowed | Eventide: staff walking to the grave. Bog Walk: families. Kendal: Dawn following. | already in `shared/anim-sources/Sad_Walk.fbx`; remove it from `UNUSED` | none | no |
| **HandInHandWalk** | An adult walking and leading a child by the hand (two clips, or one pose layered on Walk) | Eventide: firefighters lead the children out | search: "holding hands walk" | none | yes (the child's side) |

### Low priority

| Clip | What it must show | Games and moments | Search | Prop (hand) | Child version |
|---|---|---|---|---|---|
| **TurnValve** | Two hands on a big wheel, turning it slowly | Bog Walk: Zeke at midnight | search: "turning wheel", "valve" | none (the wheel is in the scene) | no |
| **Saw** | A two-handed saw or chainsaw at a log | Melissa: the sawman | search: "sawing" | saw (both) | no |
| **Sweep** | Sweeping with a broom | Melissa: after the storm. Eventide: the ward. Port Royal: the tavern (a broom is already there). | search: "sweeping" | broom (both) | no |
| **Row** | Seated rowing or paddling | Port Royal: the rescue boat (nobody in it). Melissa: the canoe. | search: "rowing" | oar (both) | no |
| **CannonCrew** | Ramming, then lighting a cannon | Port Royal: the fort salute. Nanny: the swivel guns (far off). | search: "pushing", "lighting" | rammer or linstock (both) | no |
| **Attention** | Standing at attention, still | Eventide: the monument guard. Port Royal: the garrison. | search: "standing at attention" | rifle (R), optional | no |
| **CallOut** | Hands cupped round the mouth, calling | Kendal: the calling place. Bog Walk: "Out, all of you!" (heard only). Nanny. | search: "shouting", "yelling" | none | yes |
| **RunScared** | Running hunched with arms up | Port Royal: quake crowd (if added, in the background). Nanny: the 1734 night. Tivoli: civilians. | search: "running scared" | none | yes |
| **IdleVariants** | Arms crossed, hands behind the back, looking around | crowd variety in every game | search: "arms crossed idle", "looking around" | none | yes |
| **SleepBed** | Asleep in bed, slow breathing; must clearly read as asleep and never be used for the dead | Eventide: the goodnight chapter (optional) | search: "sleeping" | none | no |

Animals (Kendal's mule, Bog Walk's mule car) are still props with no motion. They are not on the human rig, so a small procedural idle (ear, tail, head) would do. Low priority.

---

## 6. Fixes that need no new clip

- **Waves.** For one-off waves use `WaveSlow` (add it to the game's list), or loop `Wave` for about 2 s with `ctl.play('Wave', false, 2)`. This affects Port Royal's `endTalk` and Bog Walk's Rudy.
- **No standing clips on seated people.** In Port Royal's `endTalk` (`main.js:496`), skip the wave when `m.userData.sits` is set, and skip it in the camp.
- **Heath.** Until there is a Speech clip, use Talk3 or Talk1 with an occasional Point, not Pray.
- **The sword drill.** Trim Sword2 (`AnimationUtils.subclip`) to the part before the fall, as the engine already does for SitDrink, or play Block with Sword1. Keep the hips x and z at the person's spot.
- **The quake.** Play only the first part of StumbleBack (a stagger), or JogStumble, then Run.
- **Melissa** already ships the clips for several of its moments:
  - storm rooms: Sad1, Sad2 or Cry;
  - the hall storm: Pray is wrong (it kneels), but Sad1 suits listeners who are afraid;
  - helpers: Carry and CarryIdle with a box;
  - Write for anyone writing.
- **Nanny.** Give muskets back to Idle (or `CL.Cheer` only for empty-handed fighters), as Kendal's `cast.js:70` does. Put a gourd in Cubbenah's LEFT hand for Drink, or drop the Drink.
- **Port Royal's tavern.** Put a tankard in the LEFT hand of each buccaneer during Drink.
- **Seated talkers.** Use SitTalk for seated people who speak (Kendal `main.js:311`).
- **Stagger crowd reactions.** Give `play()` a random start time, or delay each person by 0 to 0.4 s.
- **Pace every walker** with `ctl.pace(v)`, as Kendal does: Port Royal, Garvey, Nanny, Melissa, Eventide. Nanny's `?test=walkers` should use `engine/audit.js` `auditWalk` so it measures sliding too.
- **Talkers face a partner.** Give looping Talk clips only to people who face someone within about 2 m; others get Idle or Laugh.

---

## 7. How to add clips through the shared character tooling

1. **One clip catalogue, with facts about each clip.**
   - Turn `tools/anims/clips.json` from `name: file` into `name: { file, loop | once, sit, kneel, keepHips, walks, hands: { R, L }, prop: { hand, item }, child: ok | adultOnly, gentle: true | false, notes }`.
   - Generate a small `shared/models/clipmeta.json` next to `anims.js`.
   - The engine can then read the facts instead of guessing from names (`HIPS_Y`, `WALKS`, `^Sit`, the seam-loop list). That is an engine change, so it is its own PR for the owner.
   - Until then, new clips must follow the name families (`Sit*`, kneel names added to `HIPS_Y`, walkers added to `WALKS` and `seamLoop`).
2. **Shared list or one list per game.**
   - Generic human actions go in the shared library: elder, child, kneel, sit on the ground, pray, speech, carry and work clips. Most of the clips in section 5 are wanted by three or more games, and each game's build already trims the library to its own `anim-clips.json`, so games that do not list a clip do not download it.
   - Clips for one game only (Tivoli's weapons, Kendal's instruments, Bog Walk's valve, Port Royal's cannon) use the Tivoli pattern, generalised:
     - `games/<game>/anim-extra.json`;
     - one script, `node tools/anims/pack_extra.mjs <game>`, writing `games/<game>/site/models/anims_<game>.js`;
     - `tools/anims/retarget_clips.py` given an `--out` option, so it never overwrites `build/anims.glb` (today the Tivoli steps say to move the shared file aside by hand).
   - Promote a per-game clip to the shared library once a second game needs it.
3. **Naming.**
   - PascalCase, named for what the clip shows, never for the source file.
   - Family prefixes: Sit, Kneel, Walk, Run, Carry, Work, Kid, Old, Man.
   - Once clips end in a pose that blends back to Idle. Loop clips join within 5 degrees.
4. **Keep the unused list automatic.** `tools/anims/optimize_clips.mjs` keeps a hand-written `UNUSED` set and fixed input and output paths. Work out the kept set from the union of every game's `anim-clips.json` and extras instead, so a clip is never dropped while a game asks for it.
5. **A dev view that shows every clip on a body.**
   - A shared gallery, as an engine dev helper or a page under `tools/anims/` served from the repo root.
   - It loads a man, a woman, an elder and a child from any game's models and plays every clip the game ships (shared plus extras) in a labelled grid.
   - Toggles: loop or once, clip speed, prop on or off (the prop and hand come from the catalogue), a seat for Sit clips.
   - It marks the loop seam and draws the hips path.
   - Port Royal's `?shot=sheet` (one body, one clip) is the starting point. Its frames are what I used for this audit.
6. **Checks.**
   - **Static, in `node tools/build.mjs <game> --dev`** (or `tools/anims/check.mjs`):
     - every clip name used in `src` (literals, `anim:` fields, `POSES`, cloth-test poses) must be shipped: that would catch Garvey's Wave and Nanny's SitIdle;
     - shipped clips that are never named get a warning: that would catch Melissa's twelve;
     - Sit clips only on people with a seat.

     The build already fails the other way round (a name in `anim-clips.json` that is not in the library). In dev builds, `ctl.play()` and `ctl.get()` should log a missing name instead of doing nothing.
   - **Runtime, `?test=anims` in each game** (wired like `?test=audit`, reporting 0). For every person, try the base clip, the talk set and the scripted clips registered through a helper such as `mayPlay(n, ['Cheer'])`, and report:
     - a work clip with no prop in the expected hand;
     - a busy hand playing a clip that uses that hand (Kendal's crowd rule, made general);
     - a seated person playing a non-Sit clip;
     - a walker that is not paced (run `auditWalk` at the speed the code uses);
     - a looping base clip with a seam over about 15 degrees;
     - a once clip shorter than 1 s;
     - more than three people starting the same clip in the same frame;
     - a looping Talk clip on someone who is not speaking and has nobody facing them within 2 m;
     - a clip marked not gentle (falls, punches) outside an allow-list;
     - a clip marked adult-only on a child body.
   - **Extend every `?test=held`** to step through all clips a carrier can play, not just the base clip (and Walk). `auditWalk` already takes `heldItems`.
7. **Steps to add a clip** (for `docs/PIPELINE.md`):
   1. search Mixamo and download FBX without skin (In Place for anything that walks);
   2. add the clip and its facts to the catalogue;
   3. retarget and optimise (the kept set is now automatic), then pack;
   4. add it to each game's `anim-clips.json` or extras;
   5. open the gallery and take a screenshot with and without the prop;
   6. run the static check and `?test=anims`;
   7. open a PR. A shared-library change is its own PR for the owner, as `docs/STANDARD.md` says.

---

## 8. What I could not confirm

- I did not play any chapter through, so every timing claim comes from reading the code:
  - Abba popping from lying to running at 2.5 s;
  - Lloyd chatting through the crash;
  - Melissa's families standing through the storm.
- Foot slide was not measured. The figures are estimates from the speeds in the code and Eventide's note that Walk covers about 1.3 m a second. The Kofi, Carry and Run figures are unknown, because I did not measure those clips' strides.
- That `Idle`, `Walk` and `Talk` look feminine on men is inferred from their source (Abba's files) and from the engine's own `WalkM` comment and the Port Royal guide. I did not render men side by side to judge it.
- The renders were on Port Royal bodies only. I did not render the Nanny musket-and-Cheer case or the Kendal labourers. Those claims come from the code (the clip's arm angles plus the grip), not from a picture.
- Mixamo clip titles were not checked; every "search" term is a suggestion.
