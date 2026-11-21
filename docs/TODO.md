# To do: checks still open (19 November 2026)

Work from PR #129 (merged to `main`) that was not checked before the merge. Each item says what changed, what to check, and how. Tick an item off (`[x]`) when it is done, and add a line saying what you found. Read `CLAUDE.md` first; its rules apply (no em dashes, check on phones, audits at 0).

Build a game with test views first: `node tools/build.mjs <game> --dev`, then serve the repo root (`python3 -m http.server 8765`). Never commit a dev build of `games/port-royal/site/app.js`: run `node tools/build.mjs port-royal` (public) before any commit.

## Nanny Town (games/nanny)

- [x] **Audit after the waterfall came out.** The waterfall on the western hill of New Nanny Town (`buildNewTown` in `src/places.js`) was removed, and the place's `tick` that moved its water went with it. Run `?test=audit&p=newtown` and `?test=layout`. Expect 0 issues.
  Removed the leftover waterfall mist emitter that crashed New Nanny Town on load. Chromium reported `AUDIT 0` for all four places and `LAYOUT 0` at all four sizes. The autoplayer finished all six chapters.
- [ ] **Listen to the sound.** The owner heard a loud rush like a waterfall in ordinary play. The wind is now softer in every Nanny place (`SOUNDSCAPE` in `src/main.js`), and the stream is a quieter, lower brook (`src/sfx.js`) heard only within about 9 to 10 m of the water (the estate stream near z = -13.5, the New Nanny Town river along x = 27). Play each chapter with sound on. Check: no loud rushing noise away from water, and the brook can still be heard beside it. Turn it down further if it still sounds like a waterfall.
  Measured the stream gain in Chromium with audio running. It was 0 away from water in the estate and New Nanny Town, and about 0.08 beside each stream. A listening pass through all six chapters is still open.

## Every game

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
