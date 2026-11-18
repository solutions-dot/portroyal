# Handoff: where the work stands (15 November 2026)

## People pass: faces, chests, clothes and the crowd (16 November 2026, evening)

The owner's open list was: faces in The Emperor's Arrival, the Rastafari men in its crowd, faces in Nanny Town, men's chests that read as a bust, and broken clothes. This pass started from main (not from the rejected draft #108) and found causes in shared code, so the fixes reach every game.

**Root causes found**

- **Stance (every game).** The clips straightened our bodies' naturally curved spine, tipping every ribcage back about 20 degrees: belly out, upper chest sunk, body leaning back. `engine/anim.js` `POSTURE` now turns three spine bones back, once, for every clip. This was the main reason men's chests read as a bust.
- **Shirt hung from the chin (builder).** The cloth outline's top row reached the jaw, so a man's shirt front was stretched from chin to belt. Fixed in `tools/garvey/era.py`.
- **Light, crowd and phone copies lost their faces (packer).** The face is now marked by the builder (`_FACE`) and `tools/people/pack.mjs` gives it its own triangles, simplified with its colours. Eyes joined into a crowd body had black, clear vertex colours and vanished: the packer drops vertex colours from textured eyes.
- **Hats rode high.** The builder measures the top of the head on a helper shape about 13 mm above the skull. New recipe key `hatdrop`.
- **Locs floated and stuck out.** They were measured against helper shapes, not the skin. They now grow from the whole scalp, lie on the head and fall back.

**Also new**: eyebrows placed from the eyes and painted on finer skin; a brighter eye texture with a smaller iris; relaxed upper lids (`eyes`); ten named face shapes in `tools/people/faces.json` (`"face": "lean"`); a man's chest and rib sides eased (`garments.chest`, default 0.5); skin under the top of a shirt tucked in and bound to the cloth (no more patches at the shoulder); a flatter camp collar; `tools/review/people-sheet.mjs`, one six-view sheet for any game's bodies in the game's own stance.

**Rebuilt with all of this**: Nanny Town (10 bodies and light copies) and The Emperor's Arrival (15 recipes, five copies each). Each recipe has its own face; the Rastafari men have their own builds, beards and locs; the Emperor's beard is dark and round the mouth and jaw as in the owner's 1966 photographs, his face narrower, his cap lower.

**Checks after the rebuild** (dev builds, this machine): `npm test` 223 pass. Nanny: audit 0, held 0 (the horn is held a little further out), walkers 0, layout 0 at 390x800 and 1280x720 (the talk button now moves clear of a wrapped hint on phones), cloth 45 lines against 46 on main (the Maroon men are at 0; what is left is the seated skirt when kneeling and the two soldiers' coats, as before). Selassie: `?test=all` 0, placement and held 0, cloth 2 lines (one or two points of a short sleeve's hem 5 mm out when waving; main had 0). All ten games build (`npm run dist`).

**Second round the same evening (owner's notes on the first sheets)**

- A man's fullest point is now his chest, not his belly: the builder's front line runs straight up from the belt to the chest and then back to the collarbones.
- Faces are friendlier: a slight smile and lifted cheeks by default (`smile`, more on a child), brows a little higher with the inner end up.
- Locs cover the top and the sides of the head (110 to 140 a man), part to their own side and fall beside and behind the head. Beards are one soft mass with a feathered edge and reach a little under the chin.
- **The people gate**, `tools/review/people-check.mjs`: every body of a game in every clip it ships, through the cloth check and a torn-cloth check, against `tools/checks/people-baseline.json`. The rules are in `docs/PEOPLE.md`, section 5a. The baseline was recorded for all ten games on 16 November 2026. Its numbers are large because the old four-pose checks never looked at arms-up, kneeling or bending clips: cloth stretches at the armhole when an arm goes up to carry on the head or to cheer, and coats tear worst (Port Royal 16,224 torn edges, Tivoli 5,306 cloth lines). Bodies with several hats count each hat. Bringing those numbers down, game by game, is the open work; the gate now stops them going up.
- Tivoli's street vehicles (four saloons, three minibuses) have wheel arches, proper wheels, window frames, lights, bumpers, door lines, mirrors and plates. There are no police or military vehicles in that scene and none were added: the game's sources do not show any (`docs/games/tivoli.md`).

**Third round (16 November 2026, late)**

- Garvey: 19 of 21 bodies rebuilt with the fixed builder (faces, brows, eyes, shirts). Garvey himself (`garvey1914`, `garvey1916`) is not rebuilt: his face was matched to photographs, and his recipes set `smile: 0` for when he is.
- Felt hats: the crown stood 7 cm above the skull (a stovepipe). It now clears it by 2 to 3.5 cm. The flat cap has an underside (no gap of forehead under it) and a thick peak; a man's work apron is narrower at the waist.
- The people gate also measures every hat against its wearer's skull (too tall, riding high, too wide). It reports Nanny Town's and Kendal's head wraps as riding high (about 1 cm down the head) and Kendal's top hat as tall: look at those before changing them.
- Stance: `POSTURE` turns the spine only. Seated clips are left out (hands rest on the lap). Turning the shoulders too was tried and made the every-clip gate worse.
- The menu intro's tag line is back to the owner's "An interactive storytelling platform" (a checkpoint commit had put the older line back).
- Gate baseline after this round: Garvey 317 cloth lines and 1,588 torn edges, Nanny Town 562 and 2,422, The Emperor's Arrival 649 and 983, Kendal 1,199 and 2,146. Other games: the first baseline.

**Open, reported by the owner and not yet fixed**

- Nanny Town's soldiers on the path look sunk in the ground with one shoe showing. The bodies have both shoes (checked in `people-sheet`, walking); the column is placed on the slope by `columnPlace` in `games/nanny/src/main.js`, so the likely cause is the far foot below the path's surface. Check with `?shot=soldiers` and a closer camera.
- The armhole stretch when an arm goes up (most of the torn edges). Fix it in the builder's sleeve weights, then rebuild and lower each game's baseline.
- Rebuild the bodies of Kendal, Port Royal, Windrush, Tivoli, Bog Walk, Eventide and Melissa with the fixed builder, and run the gate for each.
- Port Royal's rescue boat and the other games' vehicles: a helper was working on them; its files are in the checkpoint commit (`engine/boats.js`, `engine/roadcars.js`) and are not yet checked.

**Still to do**

1. **Rebuild the other games' bodies** with the fixed builder (Port Royal, Garvey, Kendal, Windrush, Tivoli, Eventide's own three). They already stand upright (the stance fix is in the engine) but keep the old dull eyes, thin brows, chin-hung shirts and face-less light copies until rebuilt. Garvey first needs his brows checked against the photograph: brows are now placed from the eyes, so `brows` and `browwide` in his recipes may need new values. Run each game's cloth, held and audit checks after, because the stance changed.
2. Knees are still a little bent in the standing clip (the same kind of fitting error, in the legs). Not touched.
3. Selassie: the two sleeve-hem points above; the police trousers' red piping is blotchy; phone copies of the grey-haired elder have a spiky cap of hair.
4. Nanny: cloth to 0 (seated skirt when kneeling, soldiers' coats).
5. Neither game has had its independent or community review. Nothing here is deployed.

Earlier entries below record past checkpoints.

## Faces, slopes and houses (17 November 2026, later)

- **A face for every recipe, and three faces for crowd bodies.** Every recipe names a `face`. Crowd bodies also list `"variants"`: `tools/people/rebuild.mjs` builds `<name>_b` and `<name>_c` (and `<name>_d` for a third) with other faces and a slightly different build (light copies everywhere; full copies where `FULL_VARIANTS` says). `engine/faces.js` `spreadBodies` gives each background person a variant so no two copies of one body with one face come near each other. The rules are in `docs/PEOPLE.md`, section 5b.
- **Look-alikes, every game (17 November 2026, evening).** `spreadBodies` now measures a mover over the whole box it walks in (`reachOf`), and has three fallbacks when the faces run out: another body of the same kind (`alts`, `rebase`), making a walker stay and watch (`settle`), and a fourth face. The check is `faceCheck` in the same file: it takes the story people and the extras of a place together and is part of `?test=audit` in nine games (Nanny Town runs it through `?test=ambient`; its `main.js` was being edited by someone else, so add `r.inside.push(...placeFaces(here))` to its `auditPlace` next). `?test=ambient` now counts the nearest two people came in the whole run. Look-alike lines before and after: Kendal 4 to 0 (ambient; audit 0), Tivoli 1 to 0, Nanny Town 0, Marcus Garvey 1 to 0, Bog Walk 13 to 0, Eventide 27 to 0, Hurricane Melissa 3 to 0, The Emperor's Arrival 142 to 0, Port Royal 0, Windrush 0. New downloads: Bog Walk six light copies (1.0 MB), Garvey one full copy (0.4 MB), The Emperor's Arrival 21 crowd bodies (2.6 MB of crowd copies or 1.9 MB of phone copies); each is fetched only where it is used. Tivoli's story people who shared a body have their own faces (`variant` in `cast.js`). Not covered, on purpose: squads in uniform (Tivoli's May 2010 street scene, The Emperor's Arrival's police line). Rebuilding `hl_worker`, `nb_youth` and `woman1914` for their variants also rebuilt those three bodies in Garvey and Bog Walk with the builder as it stood that evening. Tests: `tests/faces.mjs`.
- **Slopes.** `engine/anim.js` `groundFeet` with `userData.groundAt`: the body stands on the foot with the lower ground, the other knee bends (two-bone IK) as a person climbing does, the body moves at most 3.5 cm a frame and feet tip to the slope. Every Nanny Town person on the land uses it. The drawn trail was 7 cm above the land people stand on (feet stood 7 cm deep in every path); it is 1.5 cm now. Nanny's walking check still reports up to 16 cm under a toe at the steepest moments and is not at 0; by eye the soldiers and guides now climb with their feet on the path.
- **Houses on hills.** Nanny Town's huts stand level on an earth platform, the floor at the highest ground under the four corners (they were half buried uphill and hanging downhill). Audit 0.
- Nanny Town's ambient check has one line that is not a look-alike (a girl standing on a story path in the new town); not looked into.

## To do last: portrait framing for cinematic scenes (owner, 17 November 2026)

Every cinematic scene in all ten games needs a camera angle that keeps the action centred on portrait (phone upright) screens. The owner asked for this to be the last item. Each game's director or cinematic code sets the camera; a portrait screen narrows the view, so the subject must be framed for the narrow width (or the field of view widened) when the screen is taller than it is wide.

## Next step for the people (16 November 2026, end of session)

The builder now has: flatter male chests by default (`malechest`), the shoulder cap and elbow evened out on every sleeve (arms-up tearing fell to 0 on test bodies), and trousers fitted to the shirt above (`fit_waist`). A full rebuild was running when the session ended; the first 16 recipes it built came before `fit_waist`. Finish it like this, then check and commit:

```bash
BLENDER_BIN=/path/to/blender-or-stub MAKEHUMAN=/tmp/mh/makehuman node tools/people/rebuild.mjs --jobs 4
for g in nanny selassie garvey kendal melissa bog-walk eventide port-royal tivoli windrush; do node tools/build.mjs $g --dev; done
node tools/review/people-check.mjs all          # then look: node tools/review/people-sheet.mjs <game> <ids>
```

Lower numbers than `tools/checks/people-baseline.json` are expected; after looking at the sheets, record them with `--update`. Still open: Nanny Town's soldiers on the path (sunk, one shoe showing), Melissa's own recipes are not built (it uses Kendal and Garvey bodies), the rescue boat and remaining vehicles (in the checkpoint commit `b4c0371`, unchecked).

## Latest checkpoint: menu and Chapters reconciliation, 16 November 2026

- PR #107 merged the reviewed non-people consolidation into main. The separate people work is draft PR #108 and is not approved for merging.
- The current follow-up is `fix/menu-and-opening-scenes-20261116`. See `docs/reviews/menu-chapters-20261116.md` for scope, preservation checks and browser evidence.
- The owner's latest Chapters standard applies to all ten games, from the title and in-game journal: cream book, dark borders, Close, separate date/name/status, scrolling rows and fixed footer. Exact button text and order: **Unlock All | Restart | Credits**. `shared/chapters.css` is copied by the build. Teaching mode does not rename the button; Restart asks before clearing progress.
- Use Windrush's Kingston quay artwork and opening camera, not the offshore ship view. The Melissa menu heading is Hurricane Melissa; keep its description. Existing games have no New badge.
- Preserve the corrected Selassie tail. Its lettering is ETHIOPIAN AIRLINES; the owner removed the unverified White Nile name. Do not import the rejected people from draft #108.
- The owner expects every merge to `main` to update Vercel production. `vercel.json` keeps `git.deploymentEnabled.main` true. Do not turn it off. Review branches may stay disabled.

Earlier entries below record past checkpoints.

## Update: 16 November 2026, integration PR #101

This section updates the original 15 November handoff without rewriting its historical test claims.

- **Released:** PR #100 was squash-merged to `main`: Tivoli journal Main Menu link, Nanny mobile title background, Bog Walk mobile title actions and menu card borders.
- **In draft PR #101, not released:** Kendal beach activity and saved-progress fixes; Windrush and Selassie chapter/journal/notification layout; chapter footer labels and single-row layout across all **ten** games; Tivoli chapter controls, journal notifications and touch D-pad.
- **New regression coverage:** `tests/chapter-footer.mjs` checks ten-game chapter footer parity; `tests/final-two-ui.mjs` covers Windrush/Selassie; `tests/kendal.mjs` covers Kendal; `tests/tivoli-browser.mjs` adds mobile-sized interaction checks.
- **Browser verification still open:** GitHub's regular PR workflow runs `npm test` but skips the general browser job. The focused Tivoli browser workflow was added, but results and screenshots must be reviewed before marking the D-pad, journal and 320/390px layout verified.
- **Unified delay follow-up (16 November):** all ten games now target 2.5 seconds for ordinary and exploration hint arrows; shared engine defaults updated and `tests/guidance-delay.mjs` added to `npm test`. Browser validation is pending.
- **Targeting checkpoint (16 November):** Garvey now prioritizes stage-required conversations, joining Bog Walk, Nanny, Melissa and Eventide. Added `tests/guidance-target-priority.mjs` to `npm test`. Stage-by-stage gameplay verification remains outstanding.
- **Garvey progress (16 November):** multi-person story goals now show live `(n of total)` progress, updated after each required conversation and on saved-stage load. Regression added; browser replay pending.
- **Guidance behavior tests:** shared story engine now has test cases for unfinished required targets, optional-action exclusion, immediate retargeting and ordered objectives. Per-game stage maps and browser gameplay still need validation.
- **Near-target stability:** seven legacy game guides now avoid reactivating the hint every frame when already within interaction range; added source regression. Browser validation remains pending.
- **Guidance timing audit:** fixed a test that incorrectly expected millisecond timing in Bog Walk, which uses seconds. Both shared story arrow constants now read 2500 ms. Tests not yet executed in a verified runner.
- **Chapter audit expansion:** added `tests/chapter-guidance.mjs` to the regression suite. It checks all declared shared-engine stages (Kendal, Selassie, Windrush) and the goal/required-talk tables of Nanny, Melissa, Eventide and Bog Walk. Port Royal, Garvey and Tivoli need dynamic chapter coverage; no confirmed browser/mobile runs yet.
- **Ten-game structural audit:** extended `tests/chapter-guidance.mjs` to Garvey, Tivoli and Port Royal. This covers source declarations in all ten games but is not yet a complete physical walkthrough, especially for Port Royal's dynamic chapters and Tivoli's special chapter. Tests have not been confirmed passing.
- **Owner guidance standard (16 November):** Bog Walk is the reference for all ten games. Seven games now keep the current task visible instead of folding it after 6.5 seconds; Tivoli now uses the 2.5-second world-arrow delay. Still open: target selection based on unfinished required tasks, text-safe arrow placement across games, Windrush/Selassie parity and per-chapter browser checks. See `docs/plans/flow_audit.md`.
- **Story guidance checkpoint (16 November):** 2.5-second movement-independent hints added to Port Royal, Garvey, Bog Walk, Nanny, Eventide and Melissa; Bog Walk prioritizes required conversations over optional actions. Browser replay is still needed, and the deeper stage-needs migration, Tivoli arrow, Kendal review and remaining flow issues are not complete. Details in `docs/plans/flow_audit.md`.
- **Remaining backlog:** the full per-game screenshot/autoplayer checks, animation and clothing inspection, the story-flow hint-arrow timing and target rules in `docs/plans/flow_audit.md`, and `?test=all` integration. The Tivoli flow audit explicitly notes that it lacks a hint arrow; no change to that behaviour is claimed in PR #101.
- **Release discipline:** continue related fixes in PR #101. Do not describe draft changes as live until merged and deployed.

Read this first if you are picking up the big people, animation and gameplay standardisation work. Then read `CLAUDE.md`, `docs/STANDARD.md` and the plans in `docs/plans/`.

## How the work is organised

- Everything is on branch `claude/affectionate-pasteur-xvhvlq`. **Merged to main on 15 November 2026 at the owner's request (PR #83)**, so the owner can see it in the game. It still holds unchecked work: commits named "Work in progress ... (unchecked, do not merge)" are checkpoints, not reviewed work, and the list under "Unchecked, still to test" below must be checked in testing.
- Vercel previews are on again for this branch (the `git.deploymentEnabled` entry was removed when it was merged).
- The owner runs other game chats. They must push only to their own branches; the coordinating chat sweeps their branches into one combined PR ("sweep the branches"). Tivoli lives in `games/tivoli` (not `_tivoli`).
- Commit as `Johnathon Kelly <msquared.mail@gmail.com>` (CLAUDE.md rule 7) with the session's attribution trailer.
- Warning: PRs #72, #74 and #75 merged unchecked checkpoints from this branch into main, so main has half-finished character rebuilds. The combined PR fixes that.

## Unchecked, still to test (merged to main 15 November 2026)

- **The last chat's checkpoints**: the Kendal pass (`engine/story.js`, `engine/ambient.js`, `?test=all` wiring; its band, crash site, nurse, station crowd, bucket and Gran with Lloyd screenshots were never taken), the comfort clips (to-do 2, palm not yet flat), and the new `engine/checks.js` runner.
- **Port Royal's 1690 men** (worked on after the merge, 15 November 2026 evening): fixed by eye and by the cloth check: Galdy's knee spike and torn coat back and the strip between buc1's legs (points bound only to a helper bone, now healed from the nearest point joined through the cloth), breeches below the knee follow the shin, hands kept clear of flared coat skirts and slops, coated men's collar bands and coat necks move as one band (no jagged points or dark flaps when walking), the coat's front and back follow the chest. Port Royal cloth 136 -> 65 lines, Nanny Town 33 -> 30. Still reported, all small or not visible in close-ups: the collar band touching the coat at the side of the neck when walking, the coat sleeve and front resting on the thigh when seated (contact), coat-skirt hem corners in the walk, the back hem pressed under the seat, the tucked shirt and lining at the fork when seated, a small step at the edge of the coat's shoulder, the sailor's notch where the inner seam meets the hem. Cutting the breeches legs apart below the fork was tried three times and opened holes; do not do it.
- **Small leftovers** (16 November 2026 update): fixed: Garvey's lapels (follow the chest), the student's and boy's pocket edge, Nanny Town's Maroon men (deeper 1690 waistband, no lining across a tucked shirt; Nanny cloth 30 -> 22), the 1690 shirt tail trimmed inside the breeches. Still reported: fingertips over the raised knee when kneeling and skin at the seated skirt's hem on the two small girls (Kendal, not visible by eye), the redcoat and militia coat-skirt corner kink in the walk and their buttons against the lining, the boy's shirt at the back of the seat, Tivoli's police and soldier kit (vest through belt straps). Cloth on 16 November: Garvey 3, Kendal 54, Nanny Town 22, Port Royal 61.
- Checked before the merge: `npm test` (54 pass), every game built, `npm run dist` built, and the menu and all eight games loaded and started from the production build with no errors.

## Shared engine pieces built in this work (all documented in `docs/ENGINE.md`)

- `engine/story.js`: steps as data, only story people marked, automatic counts, hint arrow after 2.5 s pointing only at needs, carry and place, `?test=flow`. No game uses it yet except as being wired in the Kendal pass.
- `engine/ambient.js`: background people wander, chat, work, sit, watch, run errands, children play; no sync, head turns, personal space, story paths kept clear, mood, phone budget, `?test=ambient`.
- `engine/follow.js`: followers and guides for every game, `?test=follow`. Wired in Nanny, Kendal, Melissa, Eventide, Garvey.
- `engine/vehicles.js`: shared trains and vehicles (Kendal and Bog Walk use it).
- `engine/boats.js`: a detailed wooden rowing boat (Port Royal), and a dug-out canoe, a ship's lifeboat, a cargo steamer and a schooner (Port Royal, Melissa, Bog Walk, Windrush, Garvey). `engine/roadcars.js`: cars, a bus, a double-decker, a van and lorries at two draw calls each (Eventide, Melissa, Windrush). All 17 November 2026; see `docs/ENGINE.md`.
- `engine/checks.js`: one `?test=all` runner (journal, links, accessibility, reach and resume at every step, map, camera, faces, budget, rule 4, sound, continuity, errors); `tools/lint_content.mjs` runs in `npm test` with a baseline; `tools/checks_browser.mjs`; `.github/workflows/checks.yml`.
- `engine/audit.js`: new checks for people against real merged and instanced shapes along routes, object overlaps, things resting or floating, vehicles near people, hidden-garment pieces, hanging leaves.
- `engine/skinprobe.js`, `engine/colours.js` (skin and colour pipeline, owner rule 9).

## Character and animation tooling

- Builder `tools/garvey/era.py`: collar rings and weights fixed, flatter men's fronts, slimmer jackets, straight waistcoat V with `WaistcoatButtons` (games hide them with the waistcoat), 1690 shirt ease and lining colour bug fixed, seated skirt. Round 2 was in progress (see to-do 1).
- Animation library `shared/models/anims.js`: 126 clips, rebuilt with the frame range fix; Tivoli `anims_tivoli.js` 22 clips. Each game ships only the clips in its `games/<game>/anim-clips.json` (Port Royal now has one). Tools: `tools/anims/retarget_clips.py`, `clean_clips.mjs`, `check_clips.mjs`, `merge_clips.mjs` (quick update of a few clips), `handmade.py` (hand-made clips), `pair_check.py` (two-person collision check), `comfort_fit.py`. The clip table with sources and licences is in `docs/PIPELINE.md` section 2.
- `engine/anim.js` still needs low-body clips (Kneel, Crawl, Scared, Hurt*) in `HIPS_Y` and the new walks in `WALKS` (the Kendal pass was doing this).

## To-do list (in order)

1. **Builder round 2** (`tools/garvey/era.py`). Done 15 November 2026 (second chat), all bodies rebuilt and repacked in every game:
   - Seated and kneeling skirts: every later skirt body carries a second skirt (`SkirtSeat`); `engine/anim.js` shows it only in seated or kneeling clips. Skirts without a belt get a waistband in their own cloth. Belts and sashes are one flat band with a rim onto the blouse.
   - Collars: round and pointed collars have 28 rows a side and a smoothed seam (no teeth); a round collar lies close on the blouse and moves with it (no wing when kneeling).
   - Aprons hang as one sheet; 1690 and 1734 waistbands close onto the shirt; fingers are no longer cut off on skirt bodies.
   - Engine: `lapHands` keeps every fingertip and wrist outside the skirt, trousers, lap and waist in every pose; `BOW` softens the kneel clip's neck, head, chest and shoulder bow.
   - Audit (`?test=cloth`): jagged edges, fingers in cloth, fingers with holes, malformed hands (see `docs/TESTING.md`).
   - Still open (15 November 2026, evening): fingertips curl over the raised knee when kneeling (Kendal, 5 lines, looks like resting); lapels jagged when talking (Garvey's four jacket bodies) and student2020's pocket; Nanny Town's maroon_scout shirt shows through his breeches standing (about 2 cm at the front of the waist), breeches and coat-skirt hems jagged in the walk (maroon_scout, maroon_boy, redcoat, militia); Tivoli's kit (vest through belt straps) unchanged. **Port Royal's 1690 bodies (item 5)**: the full cloth report runs now (136 lines). Seen by eye: Galdy's coat back tears and shows dark patches when he sits and walks, the sailor's slops have a ragged hem, pale strips show through the sailor's shirt back when seated. Abba and Grace are builder bodies now (cloth 0). The 1690 breeches report "jagged" at the hem's inner corner by up to 30 cm when walking or sitting: each leg seems to have a seam up its inside (two edges in one place in Blender, but the importer also splits vertices, so it is not proven); welding the seam and cutting the legs apart were both tried and reverted. Next: look at a 1690 man walking from low between the legs to see whether the seam opens, then fix the coat back, coat-skirt hems and the collar through the coat.
2. **Comfort clips** (`tools/anims/handmade.py`): the owner chose the simpler target: palm resting flat on top of her shoulder from the side (no forearm across her back), for ComfortGive, ComfortHand, SitComfortGive, ComfortChild. Pass `pair_check.py`, then merge just those clips into the library.
3. **Per-game full pass, one game at a time** (Kendal was in progress: its code changes are in the final checkpoint 922da67 but unverified; the worker had reached the screenshot step, so start by running Kendal's checks and taking the band, crash site, nurse, station crowd, bucket and Gran with Lloyd screenshots; then Melissa, Eventide, Nanny, Bog Walk, Garvey, Tivoli, Port Royal): wire `engine/story.js`, `engine/ambient.js`, `?test=all`; fix the game's lists in `docs/plans/flow_audit.md`, `anim_audit.md`, `ambient_plan.md`, `story_migration.md`, `checks_plan.md`; journal button glows with a badge and chime and no notice covers a dialogue box; all checks to 0; autoplayer every chapter.
4. **Object overlaps** still reported: Kendal 33 (a worker inside the station locomotive), Melissa 17, Bog Walk (turbine house, gate posts, rocks), Nanny walkers (Mama 3.6 cm, Quamin 3.4 cm), Nanny cloth 22. Add Eventide's vehicle, garment and hanging checks to the shared audit for every game.
5. **Port Royal**: cloth to 0, rebuild Abba and Grace with the builder (keep Abba's mixer behaviour), wire audit and layout, remove Abba's ground glow ring (the arrow replaces it), fix the content lint findings (43 long lines, fictional notes for Will, Jack, Tom and Dick).
6. **Shared menu and journal UI** for all games (audit was started then stopped): same options everywhere, "All games" link (Port Royal and Tivoli lack it), journal unlock glow, a check.
7. **Wardrobe builder with face variety**: design in `docs/plans/wardrobe_design.md`, about 20 small PRs, every game on its own bodies, no stand-ins.
8. **Graphics pass**: Garvey shrine bust needs a real likeness from photos and the shrine checked against a photograph; Bog Walk train dark at dawn; then all places.
9. **Last**: richer, lusher visuals within budget with quality tiers (people, plants, buildings), realistic period vehicles researched (Eventide 1980 buses, the owner's "jolly bus"; Tivoli 2010 cars and military and police vehicles), measured with the budget check.

Animation clips still wanted (owner downloads from Mixamo or ActionForge; ActionForge exports with the Mixamo skeleton, CC0): a standing prayer, arms crossed, hands behind back, sweeping, hammering, hoeing, carrying a bucket, child hops and skips, washing, a seller calling out. Several owner downloads were exact duplicates (see `docs/PIPELINE.md`).


## 2026-11-16: Tivoli / Windrush outstanding release
- Tivoli: journal redesigned as a book with horizontally scrollable page tabs, a reading panel, and persistent **Main Menu / Chapters** footer. The opening Tivoli screen no longer has a Journal button; the in-game Journal button remains. Chapter footer remains **Unlock All / Credits / Restart**.
- Main game-selection menu: Tivoli card **artwork alone** gently drifts and zooms. Neither the card text/buttons nor the Tivoli opening menu animates. Reduced-motion preference disables artwork motion.
- Windrush: iOS WebGL sky cloud sprites are disabled to avoid the multicoloured stipple shown in the user's iPhone screenshot. The sky dome and world geometry remain intact. Needs real-iPhone visual QA.
- Windrush thumbnail: PR #92 replaces the old card background with a ship-focused image and responsive framing; it also changes the asset path and Vercel config. Validate the asset and mobile cropping in production.
- Release QA: run the complete `checks` suite and `Tivoli mobile browser` workflow on the integrated main commit. Specifically test 320px/390px journal, chapter buttons, title card, and iPhone Windrush sky. Git merge is not proof that the production Vercel deployment is current.

## Session 16 Nov 2026: where things stand (written when usage ran low)

On main (PR #95): engine/guide.js ground arrow in every game (Tivoli too), engine/marks.js talk mark height (all but Selassie and Windrush), fainter joystick.

Helper branches still being worked on (`claude/selassie-places` is merged into this branch). Check each for screenshots and 0 audit issues, then merge:
- `claude/sw-ui-parity`: Selassie and Windrush interface like the other games (tip only at start, journal, options, talk mark not "!", marks.js height, fainter stick).
- `claude/selassie-places`: varied chapter places for the visit day (yard was reused for chapters 1, 2, 6).
- `claude/selassie-likeness`: face, beard, DC-6 tail, varied actions, menu image.
- `claude/windrush-review`: full review, ship, docks, animated water, its own Jamaican home (it copied Selassie's yard; owner says no shared places).
- `claude/kendal-par`, `claude/garvey-par` (also: hats must hang over pegs, add an audit check), `claude/nanny-par`, `claude/port-royal-par`.
Still to do: par wave 2 (Bog Walk, Eventide, Melissa, Tivoli), re-run ?test=all for Garvey, Nanny, Bog Walk (timed out on a busy machine), then the full 10-game suite and one PR to main.


## Main consolidation: 16 November 2026

The owner approved the non-people changes for main. Selassie people revisions and their updated thumbnail are held for a separate PR. Main keeps its existing character models and character-building recipes/scripts; previous people checklists above are historical. The current consolidation review and branch inventory are in `docs/reviews/outstanding-branches-20261116.md`. Automatic Vercel deployments for main are enabled. The earlier no-deploy instruction applied to manual deployment, not to the normal production build after a merge to `main`.

## 17 November 2026, later: slopes, collars, look-alikes, real ships

- Look-alikes are 0 in every game and the check is in every audit (`engine/faces.js`, `docs/PEOPLE.md` 5b). Squads in uniform are exempt.
- Slope walking rewritten (`docs/games/nanny.md`). Nanny's `?test=walkers` still reports a few frames.
- Band collars fitted to the neck; untucked T-shirts hang straight (`docs/PIPELINE.md`).
- Port Royal audit 0; fruit rests in its baskets; plantains are bunches (`docs/games/port-royal.md`).
- The Yarmouth is modelled on photographs of the ship (`docs/games/garvey.md`). **Owner's rule: no stand-ins.** Things are modelled on sources for the real thing (CLAUDE.md rule 3).
- Known stand-ins to replace: *Shadyside* and *Kanawha* in Garvey chapter 5; stand-in bodies and poses named at the top of CLAUDE.md (Nanny, Tivoli, Melissa).
- Audits not yet at 0: Bog Walk 30 and Melissa 17 scenery overlaps.
- Still to do, last: portrait camera framing for the cinematic scenes in all ten games.

## 17 November 2026, evening: on board the Yarmouth

Garvey chapter 5 lets you walk the ship's deck (`docs/games/garvey.md`, "On board the Yarmouth"). No other game has a place like it yet: a second place inside a chapter, with close looks that move your eyes to the thing (`lookPart`). People stand upright in every game (`engine/anim.js` `STANCE`, `docs/ENGINE.md`). Garvey's dock is busy. Port Royal's tavern and market were tidied (`docs/games/port-royal.md`).

## The cloth check was comparing pieces in different units (found and fixed 17 November 2026)

After the full rebuild `people-check` reported many bodies WORSE (Kendal `woman_long` 18 to 291, Garvey `nb_youth` 17 to 75). The cause was the check, not the bodies.

- Packed bodies store every piece (skin, shirt, hat) squeezed into its own box. The true size is folded into the bones' bind matrices.
- `auditCloth` took each piece's rest shape by posing the skeleton, which left each piece in its own squeezed box. So "which skin points lie under the shirt" compared skin and shirt in different units. For most pairs it found nothing and the pair was never tested. For a few it found a handful of chance points, and which ones depended on the size of the head. That is why a new face changed the count on a body that was the same below the neck.
- Fix (`clParts` in `engine/audit.js`): the rest shape is each point through the hips bone's bind matrix, which is true units in one frame for every piece. Two test bodies that are the same below the neck now report the same faults.
- Also fixed: an arm inside its sleeve beside the shirt's side panel is covered (`clUnder`), and buttons on the front band are not a fault.

**What this means**: every earlier cloth count, and the old baseline, came from a check that skipped most skin-under-cloth pairs. The numbers are much higher now because the check finally looks. `?test=cloth` in every game uses the same code.

**Where it stands** (end of 17 November 2026):
- The baseline (`tools/checks/people-baseline.json`) is recorded again from the corrected check, so the gate again catches a body that gets worse. It is not a clean bill: about 30,000 lines across the ten games.
- Three kinds of harmless report are left out now: cloth right beside a cover's open edge in any pose (`clRimNear`, the rule the rest shape already had), an arm inside its sleeve beside the side panel (`clUnder`), and under 8 mm of skin in an armpit (`clArmpit`).
- The check still reports things nobody can see. Example: Tivoli's `woman_elder` in `Agree` has 35 lines of "Body shows through Shirt" and the picture shows a whole blouse. So the list is a guide, not a count of visible faults. The honest next step is a test that asks what the eye sees: draw the body from a few sides with each piece in a flat colour and count skin-coloured pixels inside a garment's outline.
- The biggest kinds after that: "Skirt shows through Belt" (a belt or sash sinking into a skirt when the body bends), "fingers go into Breeches", "Shirt shows through Breeches", jagged shirt and skirt hems. The bodies with most lines: `woman_elder`, `man_elder`, `guide2020`, `student2020`, `woman57`, `boy`, `girl` and their light copies.
- Place audits are 0 in every game (Bog Walk and Melissa were the last two). Held items are 0 in the eight games that have that view.

## The seen check is the clothes work list (17 November 2026, late)

`node tools/review/people-seen.mjs all --list` (see `docs/TESTING.md`). First full run: 15,033 visible patches over the ten games, recorded in `tools/checks/people-seen.json`.

- 5,705 of them were one fault: a belt coming through the back of a waistcoat. Fixed in the builder (the part of a belt under a waistcoat is not made) and `man_shirt`, `man_elder`, `man_work` are rebuilt: in Kendal those six files went from 1,341 patches to 334.
- Next kinds, by count: shirt through waistcoat (1,398), skin through shirt (1,021), breeches through coat and coat skirt (1,555, Port Royal's 1690 coats), shirt through jacket (909), shirt through breeches (638), skirt through belt (588).
- Before fixing a kind, look at its pictures (`--shots`): a shirt or tie seen in the front opening of a jacket is how it is worn, and may need a rule in the check, not a change to the body. Most patches are in clips a body seldom plays (kneeling, picking up, sitting).
- Port Royal has a `?test=heads` check now; the head-turn guard is in every game that turns heads.

## State at the end of 17 November 2026 (for the next session)

Branch `claude/beautiful-faraday-rc8sek` is ahead of `main` and not yet merged. Before merging: a public build of every game, then `?test=audit`, `layout` and `ambient` at 0 in every game.

**Done on the branch:** Tivoli police vest spike, soldier vest, "Tivoli Incursion"; seated people sit on their seats with knees bent (`engine/placement.js`), and the seat check covers crowds; a door made for each building in all ten games, checked against period sources (each game's doc, "Doors"); sign words always fit (`engine/textfit.js`); relaxed hands (`engine/anim.js` `restFingers`).

**Approved by the owner, not yet built into the games:** the waistcoat that goes over the shoulders. The fix is in `tools/garvey/era.py` (the waistcoat's top cut). Bodies with a waistcoat need a rebuild; show sheets from several angles and in movement first.

**Stopped by the owner:** collars and ties ("the collars look awful"). The tries are not in the tree: the test copy of the builder that held them is in the branch history (`git show 76afcce:tools/garvey/_era_bis.py`), for reference only. `tools/garvey/era.py` has main's collar code, plus the approved waistcoat fix and the skirt waist fix (`tuck_under_skirt`, not yet built into any body). What was learned: the jagged edge was the neck's flat facets cutting through the collar band, not the collar's own shape; and two collar-edge changes tried earlier (a clamp on the leaf's outer edge, a turned-under row for `turn` collars) made a turn-down collar's edge zigzag.

**Needs more work (owner):** the hands and the ties. The crowd-copy hand fix (`splitHands` in `tools/people/pack.mjs`) needs every body packed again.

**Buildings that period photographs show are wrong** (ask the owner which to rebuild): Port Royal church (plastered, no tower); Kendal 1845 station (masonry, open arches); Kingston station (brick, arches at one end only); Bog Walk turbine house (plastered); Liberty Hall (main door under a shallow brick arch).

**Signs that had to be fitted by a lot** (`engine/textfit.js` draws them in smaller letters; better to widen the board or shorten the words): Melissa "BREADNUT CORNER COMMUNITY CHURCH" (1.7 times too wide), "BREADNUT CORNER READY PLAN", "MISS ADA'S SHOP", "DORRIT'S SHOP"; Kendal "KINGSTON", "JAMAICA RAILWAY"; Bog Walk "OPEN SHUT"; Garvey "THE NEGRO WORLD", "JAMAICAS FIRST NATIONAL HERO"; Eventide "BUS STOP"; Windrush "WELCOME". Nanny, Selassie and Tivoli have none. To list them again: `window.__TEXTFIT` after `?test=audit` in a dev build.

**Open at the end of the session:** PR solutions-dot/portroyal#112 (this branch into main) waits on the full checks (`?test=audit`, `held`, `layout`, `ambient` in every game, then a public build) before merging. Garvey and Bog Walk audits were 0. Bog Walk's shop name boards (DRY GOODS, BAKERY and others) have letters slightly taller than their boards: `engine/textfit.js` fits them, but the boards could be made taller. A review bot noted that `tools/people/rebuild.mjs --repack` still runs Blender for Selassie and Windrush (their own `build-people.mjs`): fix that before repacking every body for the hand fix.

## PR #112 merged: what the full checks found (17 November 2026, night)

The four checks ran in every game on the code that was merged: `?test=audit`, `held`, `ambient` (the seven games that have background life) and `layout` at 390x800, 667x375, 800x500 and 1280x720. All report 0. `npm test` passes (232 tests, no new lint findings). A public build of every game was made before the merge.

The first full run was not at 0. What it found, and where each fix lives:

- **Eventide, held: a crowd man's suitcase touched his thigh**, on some runs only. He stood on Talk2, and the gesture swung the case. Two fixes in the engine (rule 10). `engine/anim.js`: a hand that holds a thing hanging from it (a case, a basket, a bucket, a lamp, a bag) does not gesture; `play()` gives the Idle for a hand-waving clip and `grip()` calls `calmHands()`. A flag or a palm frond held up may still be waved (The Emperor's Arrival). Eventide's own copy of the rule is gone. `engine/audit.js`: `auditHeldClip` looks at 48 moments of the whole clip from its start, so the count is the same on every run; Kendal, Garvey, Melissa, Nanny Town and Eventide use it in place of their copied loop of 12 moments.
- **Garvey, ambient: 12 issues in Liberty Hall** from the new seat check for crowds. Both were faults in the check. It took the shapes of every place in the scene, hidden ones too (`snapMeshes(root, { shown: true })` now leaves hidden parts out), and it did not count rows of chairs drawn as instanced boxes as seats (`auditSeated` now does).
- **Kendal and Eventide, layout: the toast lay across the action button** on some runs. `engine/hud.js` moved the toast only on the next drawn frame; it now also moves it at once when the toast or the button changes.
- **Port Royal, layout at 667x375: the corner buttons lay over a dialogue with three choices and over a card with three buttons.** This was on main too. On a phone held sideways the choices now sit side by side and the corner buttons step aside while a card is open (`games/port-royal/site/index.html`).
- **Bog Walk's shop name boards** are 50 cm high (they were 42), so their letters are drawn at full size.
- `tools/people/rebuild.mjs --repack` now passes `--repack` on to `tools/selassie/build-people.mjs` and `tools/windrush/build-people.mjs`, which pack from the bodies already built and run no Blender. `BPY_PYTHON` works for Selassie as it did for Windrush.

Not part of the four checks, still open: Port Royal's own `?test=life` reports 9 people who stand with nothing changing for over 12 seconds (the 1670 buccaneers on Idle, the camp on Sad and Cry, Abba on SitIdle). It reports the same on main.

**Read this before any body is rebuilt.** The bodies in the games were last built at commit `e00ffc1` (17 November, 11:19), three Port Royal men at `7b1c677` and Tivoli's police and soldier on this branch. `tools/garvey/era.py` on main changed after that with no rebuild: the belt under a waistcoat (`9cb0c78`), and two collar changes in `7e07bbb` (a round collar's ends nearly meet; the skin under a collar is sunk less near its top edge). So a rebuild of any body with today's builder also brings those in. The owner has stopped collar work: to repack a body without changing its collar, build it with the builder as it was at `e00ffc1` (`git show e00ffc1:tools/garvey/era.py`), or check neck close-ups first. `build/` is not in git, so a fresh machine has no built bodies and `--repack` has nothing to pack until they are built once. Blender as a module (`pip install bpy==5.3.0`), MPFB 2.0.18 from extensions.blender.org and the MakeHuman data all install in a cloud session in a few minutes; a body builds in about 5 seconds.

## After the merge: work waiting on the owner (17 November 2026, late night)

`main` has PR #112 (merge `a988677`) and the live site serves it. This branch (`claude/fervent-sagan-7m0ju4`) holds the follow-up work. Nothing here changes a body in any game.

**Sheets the owner has, with no answer yet.** Do not rebuild or push bodies until the owner says.

- **Waistcoat over the shoulders.** Only one waistcoat recipe has a flat collar, `man_elder` (the fix is behind `FLAT`), so only he and his two crowd variants change; the other fifteen waistcoat bodies would come out the same. To rebuild him: `PYTHON=~/venv/bin/python3 MAKEHUMAN=/tmp/mh/makehuman node tools/people/rebuild.mjs man_elder` (writes Kendal, Tivoli, Eventide and Melissa, about a minute). His neck and collar look the same before and after in close-ups. The rebuild also brings main's belt fix (`9cb0c78`), and his crowd copies get the packer's hand fix. Variant `_b` shows a strip of belt in the waistcoat's armhole when he walks; it is in the games now too.
- **Hands.** Full bodies look right in close-ups. The light crowd copies still have spiky fingers until every body is packed again (`splitHands`). The sheet shows a crowd copy before and after. Repacking every body needs the built bodies first: see "Read this before any body is rebuilt" above.
- **Ties.** A proposed tie is in `tools/garvey/era.py` behind `"tie": "four"` in a recipe. No recipe asks for it, so every body builds as before. It is one piece (a four-in-hand knot and a blade that starts inside it), where today's tie is a small box and a strip that come apart when the man moves. The collar code is not changed. It also puts right a knot setting that a comment had swallowed in the earlier try. If the owner approves: set `"tie": "four"` in the recipes that wear a tie and rebuild them. If not: take the block out.
- **Collars**: stopped, not touched.

**Done on this branch, for the owner to look at** (screenshots sent):

- **The Shady Side and the Kanawha** (Garvey chapter 5): `sideWheeler()` and `steamYacht()` in `engine/boats.js`, each from a picture of that ship (`docs/games/garvey.md`). They lie off the Yarmouth's stern and bow, where the dock can see them. The stand-ins lay behind her, where nobody could see them.
- **Greet**: the first turn of every ring of chatting background people is a raised hand and a nod (`engine/ambient.js`), once, when you are within 16 m. `Angry` is used nowhere. The one argument in the games (Port Royal's tavern) uses `Argue` and `Yell`.
- `tools/review/people-sheet.mjs` has close-ups of the seat and fork of the trousers (`views=hips,hips34,hipsside,hipsback`).

**Questions for the owner:**

1. Which buildings to rebuild from the photographs: Port Royal church (plastered, no tower), Kendal 1845 station (masonry, open arches), Kingston station (brick, arches at one end only), Bog Walk turbine house (plastered), Liberty Hall (main door under a shallow brick arch).
2. The waistcoat man's crotch: what looks wrong? A try at a flatter trouser front made almost no difference, so the fault is something else (the sheet of the fork as it is now was sent).
3. Tivoli's Back-o-Wall headband: who wears it and what is wrong? Hidden hats already take their bands with them.
4. Should a story person also greet you the first time you talk to them?

**Still open:** Nanny Town's `?test=walkers` reports 3 problems (toes up to 9 cm above the ground and 7 cm under it at the steepest moments); Port Royal's `?test=life` reports 9; portrait camera framing for the cinematic scenes in all ten games (the owner asked for this last); Bog Walk's first-person hand looks pale by torchlight (check it against rule 9).

## 18 November 2026: playability pass, pushed to main

The owner: "I will take your advice on the sheets. Let's push what we have to main for now ... I need to ensure playability."

- **Waistcoat over the shoulders: built, then undone the same day** (owner saw his neck look deformed in the crowd copies; owner: "I don't want to mess up other work"). `man_elder` is back to the bodies that passed every check at `a988677`. The fix stays in the builder for later. Was: `man_elder` and his two crowd variants, in Kendal, Tivoli, Eventide and Melissa. His collar and neck look the same as before in close-ups. The other waistcoat bodies are unchanged (the fix only applies under a flat collar).
- **Hands and ties: not built.** Packing every body again (the crowd copies' fingers) and the proposed tie (`"tie": "four"`, used by no recipe) wait until the owner points at things in the game.
- **Port Royal `?test=life`: 0** (was 9). See ENGINE.md, idle variety.
- **Camera scenes on an upright phone**: `engine/cine.js`, in the eight games that have camera scenes.
- Still open: the buildings (owner to choose), the waistcoat man's crotch and Tivoli's headband (owner to point them out), Nanny Town's walking check (3), the Shady Side and Kanawha could be more detailed (owner, 18 November).

## 18 November 2026, later: the checks finished

- Port Royal `?test=life`: 0. Its own idle loop moved into the engine (`userData.idles`); seated people only get sitting clips; each moment of variety lasts a few seconds (SitTalk runs 42 s); everyone rests at their own pace, so nobody moves in step.
- Miss Cleo's hand rests on her basket (`steadyLoad` in `engine/grip.js`), and the held check now measures it (it found her hand 9 to 12 cm off before the fix).
- The full round (audit, held, ambient, layout at four sizes, Port Royal life) is 0 in every game on the merged code.

## 18 November 2026, night: launch sweep

- **Every chapter of all ten games plays through with the autoplayer** (`?auto=N&one`), with no stalls and no script errors. Port Royal's and Bog Walk's autoplayers count chapters from 0, Garvey's `?auto=1` is the menu test and `?auto=9` its last chapter, and Windrush's chapter 7 needs about 8 minutes in software drawing.
- Bog Walk's night autoplayer reported a fail: the resting-pot check took the curved rust patches on the pipe wall for pots on nothing. `auditRest` now leaves out part-cylinders (`engine/audit.js`). AUTO OK.
- The Shady Side and the Kanawha have more detail from their pictures (`docs/games/garvey.md`).
- Nanny Town's walking check is still 3. A faster settle on slopes made no real difference, so it was put back; by eye the climbers' feet stay on the path. Not a launch blocker.

## 18 November 2026, night: the buildings the photographs show were wrong

The owner said "fix what is broken ... use all available sources", so the five buildings on the list were rebuilt from their sources (each game's doc has the details):

- **Port Royal, St Peter's Church**: cream render scored as stone blocks, gable copings and crosses, a grey slate roof, no tower; the bells in a timber frame in the churchyard (JNHT; Victorian Web; photographs of 2024).
- **Kendal, the 1845 Kingston terminus**: a plastered arcade of nine round arches between pilasters, a low roof (Illustrated London News engraving, 1846).
- **Kendal, Kingston station 1957**: a long two-storey brick range with square-headed doors and sash windows, and a pale arcaded pavilion at the east end (JNHT; photograph of 2007).
- **Bog Walk, the turbine house**: rendered and limewashed walls with a round-headed opening high in each gable; brick in the ruins of today (NLJ photograph D0006009).
- **Garvey, Liberty Hall**: the main doorway under a shallow arch (Keystone photograph, 1924).

Audits 0 in each place. Still not drawn: St Peter's side wing, the 1845 gate lodge, Kingston's iron train-shed roof.

