**Resume here (27 November 2026, small hours; owner's usage ran out, check in again at 4):** branch `claude/xaymaca-polish`, stacked on the audio PR (#177).
- Done this round: the interpreter is back and Mendez speaks short Spanish lines that the interpreter repeats (step 26); Mendez and the interpreter stand about 1.9 m apart; the "Turn off play analytics" link is off the game screens (still on the menu and About; games honour the choice); wrecks stay hidden until the arrival scene brings them in; trinkets only after the trade; Cousin carries the bread basket out, stops paddling alongside the ship and hands it up; the canoe rope lies on the deck; end-of-chapter cards say only "Well done." (every game; the next chapter announces itself).
- **For the audio chat (Cartesia): re-record these Xaymaca lines (`games/xaymaca/src/content.js`, TALK 26):** Mendez, in Spanish: "Debo cruzar el mar hasta La Española, en canoa." / "Lo sé. Por eso necesito a los mejores." / "Pagaré bien a los remeros." Interpreter, English: "He says: I must cross the sea to Hispaniola, in a canoe." / "I will tell him your words." / "He knows. That is why he needs the best." / "He will pay the paddlers well." Unchanged and still valid: "This is Diego Mendez. He is brave, they say." and "He needs strong paddlers. Ten for each canoe." The interpreter's first line at step 25 ("Do not be afraid. I speak your words.") has no recording at all (the owner noticed it is not narrated): record it with the rest of his step 25 and 50 lines (`LINE_VOICES` or a third argument to `L()`).
- Still to look at: the live opening scene (wrecks and men in the water) in a real playthrough once deployed; the sailors on the deck; listen to the mutiny scene's narration timing; phone layout of all of this; Mendez's collar and the women's chest band (see `docs/games/xaymaca.md`).

# To do: checks still open (19 November 2026)
**Also 27 November 2026 (same branch):** the ten mutiny canoes lie along the beach 9 m apart, board and launch one after another and string out east (was a tight block, all at once); the hawk's bell cloth moved up the beach clear of the trading canoe so its close-up shows the bell; `engine/boats.js` stern fixed (outward normals gain a length component at the ends, and the tip caps are a strip of wood, so the stern no longer lights as broken wedges). Narration audio was not heard (no audio here): read the captions and journal for the mutiny only.

**Added 27 November 2026 (branch `claude/xaymaca-continue`):** trading sailors followed their ship by up to 6.5 m at the start of a scene, because crews were placed by the place's tickers, which the scene holds still; now `Q.posers` run every frame (`places.js` `crewTicker`, `main.js`). `engine/follow.js` `goTick`: someone sent to a spot stops 1 m from the player and faces them, never through them (`tests/goto-space.mjs`; other games that send people to the player get it too). New `engine/lookassist.js`: the camera eases toward a look or task in reach when it is out of view, and pauses while the player turns the view (Xaymaca only so far: wire `createLookAssist` in the other games' `findNear`/tick the way `games/xaymaca/src/main.js` does, `assistLook`). `auditCourse` is on in all games (0); the rest check stays off outside Xaymaca until `docs/reviews/floating-20261126.md` is sorted.

**Resume here (27 November 2026, Xaymaca boats; owner ran out of usage):** pushed to `main` from `fix/floating-props` (PR #171).
- Done: every boat points where it goes (trade canoe, the two big canoes, the ten mutiny canoes, the arriving wrecks, the rescue ship); new engine check `engine/audit-course.js` (on in Xaymaca, 0). Sailors stand on both wrecks until the rescue ship leaves (`deckCrew` in `places.js`); the trade canoe goes alongside the nearer wreck where two sailors stand at the rail. Cousin sits on the trade canoe's stern seat board; new engine check `engine/audit-crew.js` (legs in boat seats or through the bottom; on in Xaymaca, 0). Floating bread fixed; `engine/audit-placed.js` on in Xaymaca.
- To do: look again by eye at the trade scene at 13 to 18 s (the sailors at the rail should be in frame; the camera shots are in `content.js` FILMS.trade) and at Cousin's paddle while seated; run the autoplayer (`?auto=1`, desktop and phone) after these changes; switch `audit-course`, `audit-crew` and `resting: true` on in the other games (Port Royal's rescue boat, Air Jamaica, Windrush) and sort `docs/reviews/floating-20261126.md`; Mendez's collar and the women's chest band (see `docs/games/xaymaca.md`).


**Floating things (26 November 2026, PR on branch `fix/floating-props`):** the new rest check (`engine/audit-placed.js`, `auditReveals(Q, { resting: true, tasks: TASKS })`) is on in Xaymaca (0). Switch it on game by game after sorting each list in `docs/reviews/floating-20261126.md` (about 70 lines; some real: Windrush's cloth 107 cm up, the Shark Papers' bait 89 cm up, Air Jamaica's scarves; some are wall-mounted or hung things that need `userData.hung`).

**Next LLM, start here (25 November 2026, branch `story-card-copy-and-title-typography`, PR #163; the owner stacks PRs: commit to the open PR, do not open a new one).**
- [ ] **Narration on physical phones.** All 16 opening screens use a shared player that waits for Start, then falls back to a title tap or the speaker control. The menu handles the Mature 13+ profile filter. Confirm playback on iPhone Safari and Android Chrome.
- [ ] **Autoplayer after the new chapter flow** (`engine/chapter-end.js`: `goingStraight`, `startCard`, `titleFade`): Xaymaca (AUTO END 75), the Shark Papers (48) and the Mad Master (68) passed on 25 November; **not yet confirmed:** Rose Hall, Morant Bay, Windrush, Air Jamaica, Port Royal (`?auto=1`; Port Royal from a dev build, then restore the public `app.js`). Then play one chapter change by hand: the end card's Next chapter, then the title fade, no Begin card.
- [x] **Xaymaca audit at 0** (26 November 2026: audit, faces and ambient setup 0 in all five places; crews got their own faces, the bell settles back on the cloth, the wrecks no longer touch, see `docs/games/xaymaca.md`). Was: **Xaymaca audit not at 0** after the canoe crews (25 November, late): faces 22 in Maima, 9 on the shore and the crossing (the crew bodies, hidden until manned, likely counted), audit 1 to 6 per place. Run `node tools/review/run-test.mjs xaymaca audit,cloth` and fix every line (rule 8).
- [ ] **Xaymaca cloth** reports 1 to 9 lines on most bodies after the hair and breechcloth rebuild; run `full-check.mjs` for all 16 and look at every sheet (rule 15). The girl's walk still slides 7.6 cm a loop (engine girl-stride fault, below); she only stands in this game.
- [ ] **Paddle clip for Port Royal's rescue boat** (owner): try `Paddle` (`shared/anim-sources/Paddling.fbx`, Xaymaca's own clip, `tools/xaymaca/pack_clips.mjs`); if used, move it into the shared library (`tools/anims/clips.json`).
- [ ] **Xaymaca, still open:** a Taino-heritage reviewer before it is treated as finished; Mendez's coat neck (a few mm of skin, a deeper tuck did not reach it); Seville Heritage Park's real layout (no plan or sign photo online); the cloth lines on the original bodies (women's band in talk poses); a phone hand-play with a stopwatch. The cassava squeezing is checked against Oviedo's *Sumario* (1526). All in `docs/games/xaymaca.md`.
- [ ] **Selassie** has no start card between chapters, so no change was made; if the owner wants the same title fade there, call `titleFade` in its `go` for a chapter's first step.

Work from PR #129 (merged to `main`) that was not checked before the merge. Each item says what changed, what to check, and how. Tick an item off (`[x]`) when it is done, and add a line saying what you found. Read `CLAUDE.md` first; its rules apply (no em dashes, check on phones, audits at 0).

Build a game with test views first: `node tools/build.mjs <game> --dev`, then serve the repo root (`python3 -m http.server 8765`). Never commit a dev build of `games/port-royal/site/app.js`: run `node tools/build.mjs port-royal` (public) before any commit.

**Next LLM, start here (22 November 2026, branch `claude/serene-hamilton-9eq8ag`, draft PR #147):**
- [ ] Confirm Windrush `?test=audit` is 0 after the new stairwell and banister (`games/windrush/src/places.js`, the 2018 hall).
- [ ] Retake two recap pictures: Tivoli `games/tivoli/site/recap/today.jpg` must show the murals; The Emperor's Arrival `games/selassie/site/recap/airport.jpg` is an almost empty apron.
- [ ] Run the autoplayer to the end after the quiz changes: Melissa (`?auto=1`), Bog Walk (`?auto=all`), Port Royal (dev build, then restore the public `app.js`).
- [ ] A "Who you are" card for The Emperor's Arrival and Tivoli (`onceWhenClear` in `engine/hud.js`; Tivoli has no "you" page yet, read `docs/games/tivoli.md`).
- [ ] Carried items shown in the hand (Nanny yams, sticks, horn; Melissa; Eventide), the new audit checks, then Phase 2 (Nanny Town). Details in `docs/plans/story_first_plan.md`.
- Do not touch bodies, clothes or the people builders (another chat works on them).

**Story-first pass for all ten games (21 November 2026):** the full to-do list is in `docs/plans/story_first_plan.md`. Work from it, one phase at a time.

## Nanny Town (games/nanny)

- [x] **Audit after the waterfall came out.** The waterfall on the western hill of New Nanny Town (`buildNewTown` in `src/places.js`) was removed, and the place's `tick` that moved its water went with it. Run `?test=audit&p=newtown` and `?test=layout`. Expect 0 issues.
  Removed the leftover waterfall mist emitter that crashed New Nanny Town on load. Chromium reported `AUDIT 0` for all four places and `LAYOUT 0` at all four sizes. The autoplayer finished all six chapters.
- [ ] **Listen to the sound.** The owner heard a loud rush like a waterfall in ordinary play. The wind is now softer in every Nanny place (`SOUNDSCAPE` in `src/main.js`), and the stream is a quieter, lower brook (`src/sfx.js`) heard only within about 9 to 10 m of the water (the estate stream near z = -13.5, the New Nanny Town river along x = 27). Play each chapter with sound on. Check: no loud rushing noise away from water, and the brook can still be heard beside it. Turn it down further if it still sounds like a waterfall.
  Measured the stream gain in Chromium with audio running. It was 0 away from water in the estate and New Nanny Town, and about 0.08 beside each stream. A listening pass through all six chapters is still open.

## Air Jamaica (games/air-jamaica)

Live on the menu since 25 November 2026. The full list and the faults still visible are in `docs/games/air-jamaica/HANDOFF.md`, "What is left".

- [ ] The owner looks at the DC-8, DC-9 and A320 noses and tails in the game (`?shot=10`, `?shot=40`, `?shot=96`).
- [ ] A person listens to the sound of every place and the new-colours cheer (levels pass `?test=beds`; nobody has heard them).
- [ ] Small body faults: `aj_dee04` jeans specks at the belt and the seated hip crease; `aj_dee10` seated back hem.

## Every game

- [x] **One water tower in the engine.** `engine/water-tower.js` `buildWaterTower()` (straight legs on stone footings); Kendal, Bog Walk, Eventide, Melissa, Selassie and Windrush call it with their own helpers. `tests/shared-props.mjs` keeps copies out (21 Nov 2026).
- [x] **One standard card before every cinematic** (owner, 21 November 2026). `sceneWarning` in `engine/scene-warning.js` writes the words: what happens, then "It may be scary." and "Nobody is hurt on the screen.", with Watch scene and Read what happened instead. Port Royal, Eventide, Kendal, Bog Walk, Nanny, Melissa and Tivoli use it as a scary scene. Selassie (the arrival) and Windrush (the two ship scenes) use it as a plain choice (`scary: false`); Windrush's second "A short scene" card is gone. No calm mode. Garvey has no cinematic.
- [x] **Cinematics show only a faded X; chapter title cards have no X; the chapter-end card comes after a pause and has no "Stay here"** (owner, 21 November 2026; `engine/cine.js`, `engine/chapter-end.js`, `docs/STANDARD.md`).

- [ ] **Title screens.** All three title buttons (Start, Chapters, Exit) should appear at the same moment, with Chapters dimmed until the game is ready, and nothing should move as the game loads (`shared/title.css`). Take screenshots of each game's title screen at 390x800 and 1280x720.
  Captured loading and ready screenshots for all ten games at both sizes. All three buttons appeared during loading, with Chapters dimmed. Button positions still moved by up to 5 px. A follow-up Chromium check held fonts constant and replayed Loading, Start and Continue. Button rectangles matched in all ten games at both sizes. Blocking web fonts reproduced the direction and size of the shift in Bog Walk, Nanny Town and Tivoli (about 1 to 5 px).
- [x] **Bog Walk title.** The title should sit lower on the screen, with no control words under the buttons. Screenshot at 390x800 and 1280x720.
  Moved the title and buttons lower by keeping the loading status in one row of the title column. Screenshots at both sizes show the title low with no control instructions under the buttons.
- [ ] **Fonts.** Menus, cards, journal buttons and the Exit button should use Alfa Slab One (`--display`) in every game, and body text Atkinson Hyperlegible. Only a game's own title keeps its period lettering (`--period`). Compare screenshots of the journal and a card in Port Royal, Garvey, Bog Walk and Tivoli.
  Chromium reported Atkinson Hyperlegible on journal and reset buttons in Garvey and Tivoli. Tivoli also uses IM Fell English for its Journal heading.
- [x] **Tivoli credits.** Open Chapters, then Credits. Check that the sources list shows, reads well and can be scrolled on a phone, and that the Back to Chapters button works.
  All six sources were readable at 390x800. The panel scrolled to the bottom and Back to Chapters worked at 390x800 and 667x375.
- [x] **Card buttons on a phone.** On desktop, the Reset card's three buttons are on one line in all ten games (checked at 1280 wide). Check the Reset card and the "Start again?" card at 390x800 and 667x375: whole buttons may drop to the next line there, but no button's words should be cut off, and the card should fit on the screen. Run `?test=layout` in each game at 390x800, 667x375, 800x500 and 1280x720 (see `docs/TESTING.md`, section 5).
  Reset and Start again? button text fit in all ten games at both phone sizes in Chromium. The layout audit reported zero issues in all 40 game and viewport combinations. The layout audit also caught a toolbar clipping in Port Royal at 390x800 and a caption covering a toast in Garvey at 667x375. Both sizes passed after the fixes.

## People: posture, necklines, suits and legs (21 November 2026)

The audit and what changed: `docs/reviews/people-20261121.md`. Left to do, in order of how much they show:

- [ ] **Model the everyday period garments once and fit them**, as suits are now (`docs/PIPELINE.md`, "Fitted garments"): a man's shirt, a blouse, a frock, a long skirt, a 1690 coat. Until then they are made by `tools/garvey/era.py` from the body's own surface. The free MakeHuman packs were checked on 21 November 2026 and have none of these.
- [ ] **A period cut for Marcus Garvey's suit**: a three-button jacket that closes higher, and a stiff stand collar for 1914. The fitted suit is a modern two-button cut.
- [ ] **A squarer shoulder on the fitted suit.** Its shoulder line follows the body's slope.
- [ ] **A speck of trouser at the jacket's front hem in a stride** (the fitted suit; see `?test=cloth`).
- [ ] **Eventide's own three bodies** (`tools/eventide/people.py`) still wear the old collars. Rebuild them with `era.py` recipes.
- [ ] **A speck of skin at the shoulder seam of a round opening** on one small girl (`wr_kgirl48`, seen from the side). Look with `node tools/review/people-sheet.mjs windrush wr_kgirl48 views=neckside,neck34`.
- [ ] **Walking checks not at 0 after the stance fix** (21 November 2026): Kendal 2 (Dawn's run 8.8 cm a loop, a slow survivor 7.8), Port Royal 3 (Kofi's carry 11 cm, Abba's run 33 cm). The walk itself measures right on every body; `Run` and `Carry` strides and very slow walks do not yet. Fix `strideOf` in `engine/anim.js` for those clips; do not add per-game factors.
- [ ] **The girl bodies' stride.** `strideOf` in `engine/anim.js` measures every body's walking stride exactly (Kendal's `?test=walkers&tune` gives 1.000 for all of them) except `girl` and `girl_small`, whose real stride is about a quarter longer than the measure. Kendal corrects it in `STRIDE_K`; find the cause in the engine and take the correction out. Check the girls in Tivoli, Melissa and Eventide too.
- [ ] **A man's apron when he sits** lies on the lap as a short flap instead of falling over the knees (`man_apron`, `SitIdle`). Standing and walking it hangs right.
- [ ] **Two small specks on the fitted jacket's front in a stride** (the pocket flap's corners) and a sliver of trouser at its front hem.
- [ ] **Abba's bodice** has a ragged lower edge above her apron string (`tools/people/abba.json`).
- [x] **The Emperor's tunic** is the fitted jacket now (21 November 2026): real collar and lapels, smooth shoulders, a clean belt, cords lying on the chest. The same day: the strap is one straight band, the ribbons are on his left breast clear of the lapel, the collar tabs stay on the collar, the beard fades into the cheek, and the fitted trousers break over the shoe (every suited man). The strap now runs from the belt on his back over the right shoulder and down the front. Still to do: the strap wavers a little on the chest when he walks and its turn over the shoulder stands a little proud; his shoulder boards are plain rectangles; the back of the shoe's top edge shows a little under the hem.
- [ ] **An old woman's round opening** (`woman_elder`, `wr_kelder48`) is uneven at the front: her neck leans forward and the opening is worked out round an upright one.
- [ ] **Waistcoats are still the generated kind** (owner, 21 November 2026: "ill shaped"). The torn V is fixed. The shape still follows the belly, a speck of shirt shows at the side of the hem on `man_elder`, and shirt sleeves beside it still show the upper arm's shape. A modelled waistcoat, fitted as the suits are, is the real fix.
- [ ] **Shoulders still do not look natural** (owner, 21 November 2026, of the old man in a waistcoat and the boy and girls in short sleeves): the top of the sleeve bulges at the shoulder point and the shirt's shoulder line is lumpy. The sleeve tube is smooth now from the seam down; the shoulder cap itself (where sleeve, chest and neckline meet) is still the body's surface pushed out. Fix with a modelled shirt, fitted as the suits are.
- [x] **`woman_long` and `woman_elder` looked badly built**: it was the packer crushing them, fixed 21 November 2026 (`docs/PIPELINE.md`).
- [ ] **A turn collar and tie worn without a jacket** (`man_shirt`, `clerk1919`, `printer1907`, `steward1920`, two Windrush men) is still the generated collar. Take the collar and tie from the fitted suit instead.

## Character movement

- [x] **Seated feet spinning in Tivoli and Windrush.** The shared seat correction reused its previous ankle turn when an animation track stayed still. Both games' `?test=feet` runs found zero sustained spins after the fix.
- [x] **Brief foot snaps on clip changes.** The animation controller now preserves the current pose and weights if a crossfade is interrupted. Chromium at 390x800 reported zero foot snaps and spins across all eight Tivoli chapters, 11 Windrush routes and two Windrush films.
- [x] **Check movement in the other eight games.** At 390x800 in Chromium, the Bog Walk, Eventide and Hurricane Melissa autoplayers reached the end. Garvey, Kendal, Nanny Town, Port Royal and The Emperor’s Arrival ran their own animation checks. A frame-by-frame pose trace sampled feet, heads, torsos and root positions during these runs. No sustained foot spins remained in the scenes rerun after the fixes.
  - Garvey’s hall guests ease into their seats. Hurricane Melissa’s storm reaction and Port Royal’s camp and drill animations loop without the previous large jumps. Port Royal’s stepped check no longer sends its live clock backward.
  - Nanny Town’s foot corrections no longer pile up on slopes, and Phibba’s stride now matches her speed on the tested back trail. Kendal now leaves clip phase to the shared controller. The Emperor’s Arrival also applies its head-turn limit to the story cast, and its head check reported zero.
  - Eventide and Hurricane Melissa both reported `FOLLOW 0` on the walking routes with Gran and Mum. The position jumps from the scripted playthroughs did not recur on those routes.
- [x] **Fix the remaining motion findings.** The shared engine smooths fast ankle turns on flat ground and slopes. At 390x800 in Chromium, the full foot checks for Nanny Town, Kendal and Port Royal reported `FEET 0`, including Dawn’s run and Abba’s earthquake run. Tivoli and Windrush also reported `FEET 0` on repeat. Port Royal’s flashback crowd uses the shared turn limit and reported `HEADS 0`.
  - Nanny Town’s ridge cast changes stance sooner and Kendal’s Lloyd uses an available gesture. Nanny Town reported `ANIM 0`, and the check for Kendal’s road, station and crash steps reported `MOTION 0`.
  - The shared grip blends in the reach for the basket on Kendal’s road and applies one posture correction to the cup arm in The Emperor’s Arrival. The phone-sized frame trace found no arm snaps in those scenes.

## Characters clipping through scenery

- [x] **Check posed characters against nearby scenery in all ten games.** Ran the built-in place or seating audits and sampled posed hands, arms, legs and torsos in phone-sized Chromium during chapter replays and stepped animation checks. The pose pass measured solid boxes and cylinders, including tables, seats, posts and walls. Close checks on Exquemelin and two Garvey characters also compared the rendered skin and clothing vertices with the props. The sampled Bog Walk and Nanny Town poses showed no intersections in this pass.
- [x] **Port Royal.** Exquemelin’s writing pose has an open table and a separate stool. Moved the drill, a cheering spectator and nearby cargo for arm and foot clearance. Set the quartermaster’s paper and the counting-house coins on their surfaces. Kofi fills the bottom row before he puts crates on top.
- [x] **Marcus Garvey.** Gave the Harlem office typist room to work and the compositor room to reach. Set the papers on the desks and put the upright sheet in the typewriter roller. Moved Garvey forward from the hall table and limited seated guests to compact clips.
- [x] **Kendal.** Gave the crash-site sitters room for their shins in front of the log, and the coach passengers room from the side panel. Added the platform baggage and hill station steps to the walking obstructions.
- [x] **Hurricane Melissa.** Kept seated people on the pews when they react to the storm. Moved the food table, pot and drum away from the sitters and shifted their seats forward for hand clearance.
- [x] **Windrush.** Gave the domino players clearance from the tabletop and set their stools on the piazza. Adjusted Iris’s seat and widened the hallway gap. Her route uses the centre of the gap.
- [x] **Tivoli.** Moved the incursion actors away from the low walls and set the walking-chapter sitters on their benches at scene start. The phone-sized run found zero foot snaps or spins across the eight chapters.
- [x] **Eventide and The Emperor’s Arrival.** Moved the Golden Age Home cast clear of the raised foundations and a parade spectator clear of the edge he was waving over.

## Poses, props and Eventide routes

- [x] **Standing posture.** Relaxed the shoulders and arms in the shared quiet idles. Compared side views of Nanny Town’s `Idle` and `IdleM` against the reference.
- [x] **Nanny Town basket carriers.** They walk back and forth and keep the basket on their heads when they pause. Sampled both carrying clips in New Nanny Town and the ridge without a hidden basket.
- [x] **Airport crowd.** The Emperor’s Arrival starts its background crowd on approved idles and directs their attention toward the aircraft during the film. Explicit scene cues can still play `LookAround`.
- [x] **Carried items.** Windrush’s suitcase stays low in the lower-right corner at phone and desktop sizes. Kendal and The Emperor’s Arrival use the same first-person framing.
- [x] **Eventide.** Gran leads across the street and stops when the player pauses. The route check reported `FOLLOW 0`. The children go through the clear gap beside the rope. Gran stands clear of all three at the blanket pile.
- [x] **Eventide blankets.** Restored the broad, striped wrap. It rests on the shoulders of all three children and both women, covers their backs and arms, and stays open down the front. Their hands hang beside their thighs under the blanket. The idle and dialogue checks reported `BLANKETS 0` across 364 poses.

## Windrush scenery and indoor doors

[In-game screenshots](games/windrush-scene-review.webp)

- [x] Set the houses in both Jamaican yards on their foundations and fill the empty views beyond the yards, docks and Brixton streets.
- [x] Move the yard trees clear of the houses in 1948 and 1962. The yard audit checks the full crown and the building exterior, including the roof and veranda.
- [x] Keep the telephone and typewriter clear of the news cards in Garvey’s Harlem office. The gramophone also has clear space beside the letters on the side table. [Office desk screenshot](games/garvey-office-desk.webp)
- [x] Fit railings around the Windrush passenger deck and keep the ship, passengers and furniture on the same floor. The deck check passed with both ordinary and reduced motion.
- [x] Leave an empty chair between the two visitors at the advice centre. Preserve the eye and brow geometry when building Windrush's lighter character models.
- [x] Square the legs of the community centre's exhibition table and the Tilbury registration table. Rest their papers on the tabletop.
- [x] Close the advice centre, the Melissa church hall and both domestic shelters. Garvey's indoor doors close too. The three visitors to the Kingston meeting hall pass through while its doors are open and the doors close behind them.

## Faces on lightweight character models

- [x] Keep the face marker through Tivoli’s uniform export and rebuild the soldier and police models used in crowds.
- [x] Keep more detail around brows, eyes and mouths in the shared character packer. Protect the crown and hairline on joined crowd and phone models without adding a draw call.
- [x] Rebuild the affected models in Bog Walk, Eventide, Kendal, Hurricane Melissa, Tivoli, The Emperor’s Arrival and Windrush. The model regression test checks facial geometry and textured eyes in representative lightweight and phone copies.

## Not done yet (ask the owner first)

- [ ] **The main site menu** (`menu/index.html`) still uses its own fonts (Inter and Fraunces). The games now share one set of fonts. Ask the owner whether the menu should use them too.
