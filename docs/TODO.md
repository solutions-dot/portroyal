# To do: checks still open (19 November 2026)

Work from PR #129 (merged to `main`) that was not checked before the merge. Each item says what changed, what to check, and how. Tick an item off (`[x]`) when it is done, and add a line saying what you found. Read `CLAUDE.md` first; its rules apply (no em dashes, check on phones, audits at 0).

Build a game with test views first: `node tools/build.mjs <game> --dev`, then serve the repo root (`python3 -m http.server 8765`). Never commit a dev build of `games/port-royal/site/app.js`: run `node tools/build.mjs port-royal` (public) before any commit.

## Nanny Town (games/nanny)

- [x] **Audit after the waterfall came out.** The waterfall on the western hill of New Nanny Town (`buildNewTown` in `src/places.js`) was removed, and the place's `tick` that moved its water went with it. Run `?test=audit&p=newtown` and `?test=layout`. Expect 0 issues.
  Removed the leftover waterfall mist emitter that crashed New Nanny Town on load. Chromium reported `AUDIT 0` for all four places and `LAYOUT 0` at all four sizes. The autoplayer finished all six chapters.
- [ ] **Listen to the sound.** The owner heard a loud rush like a waterfall in ordinary play. The wind is now softer in every Nanny place (`SOUNDSCAPE` in `src/main.js`), and the stream is a quieter, lower brook (`src/sfx.js`) heard only within about 9 to 10 m of the water (the estate stream near z = -13.5, the New Nanny Town river along x = 27). Play each chapter with sound on. Check: no loud rushing noise away from water, and the brook can still be heard beside it. Turn it down further if it still sounds like a waterfall.
  Measured the stream gain in Chromium with audio running. It was 0 away from water in the estate and New Nanny Town, and about 0.08 beside each stream. A listening pass through all six chapters is still open.

## Every game

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
- [ ] **Port Royal.** In Ned’s flashback, Exquemelin’s hands cut into the barrel desk during `Write`. His left shin also cuts into the front corner of his seat. Port Royal’s seating audit reports zero for this scene. Ned’s seated talk in the tavern was clear in the close check. Review the drill and quartermaster’s barrel on the same wharf, where the sampled feet and shins also entered props.
- [ ] **Marcus Garvey.** The typist’s right hand enters the Harlem office side table while bending in `PickUp` (stage 60). The compositor’s right hand enters the type case during `ReachOut` (stage 32). Marcus Garvey’s right shin and foot enter the front of the meeting-hall table (stages 12 and 13). Check the seated hands against the hall benches, too.
- [ ] **Kendal.** The sitter at about x = -4.2, z = 4.52 by the crash-site fire puts his left shin through the log while idling. Coach passengers on the z = -0.9 row put a hand through the side panel during `SitTalk` (stages 50 and 51). Check the Kingston station crowd’s route around the sack at x = 36, z = 2.4.
- [ ] **Hurricane Melissa.** In the 2025 church shelter, the sitter nearest the food table at about x = -0.8, z = -3.23 clips the tabletop with an upper arm. A nearby person’s torso and neck enter a metal pot on that table during the storm reaction (stage 43). Check Miss Hyacinth’s left hand against the same table in that reaction.
- [ ] **Windrush.** The seated neighbour on the west side of the district shop’s domino table puts his right forearm through the top. Iris’s left shin and right foot enter the armchair base at home (stage 72). Her left shoulder and forearm also pass into the hallway wall near the doorway as she leads to the gate (stage 75).
- [ ] **Tivoli.** In the incursion scene, characters’ left hands and forearms enter the low walls at x = -11, z = 2.6 and x = -2, z = -2.4 during crouching and standing clips. Review seated knees and shins at the bench near x = 20, z = -3.4 in the walking chapters.
- [ ] **Eventide and The Emperor’s Arrival.** In Eventide’s Golden Age Home scene, three people’s feet enter the raised house bases. Recheck the right hand of the parade spectator at x = 13.3, z = 15.6 in The Emperor’s Arrival. The probe caught a brief overlap during a wave.

## Not done yet (ask the owner first)

- [ ] **The main site menu** (`menu/index.html`) still uses its own fonts (Inter and Fraunces). The games now share one set of fonts. Ask the owner whether the menu should use them too.
