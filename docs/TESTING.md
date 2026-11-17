# Testing

**Unified hint delay:** `tests/guidance-delay.mjs` checks that all ten games use the same 2.5-second guidance delay, including shared-engine exploration stages. It is included in `npm test`. Browser interaction remains a separate verification requirement.

**Story target priority:** `tests/guidance-target-priority.mjs` checks that the five stage-marked legacy controllers (Garvey, Bog Walk, Nanny, Melissa and Eventide) consider unfinished required people before optional action fallback. This is a source regression, not a chapter replay.

**Garvey multi-person progress:** `tests/garvey-goal-progress.mjs` checks the source-level counter and refresh wiring. Confirm in browser that each conversation increments the visible goal and that a saved mid-stage goal restores the count.

**Behavioral guidance tests:** `tests/guidance-target-priority.mjs` now also exercises the shared story engine with synthetic ordered and unordered tasks, optional actions and immediate retargeting. These checks do not prove the ten games' real stage maps or UI rendering.

**Near-target arrow stability:** `tests/guidance-delay.mjs` also checks that seven legacy guidance controllers do not reactivate the arrow every frame while the player is already within interaction range. Verify the objective does not flash or replay sounds at the destination.

**Timing units:** Bog Walk passes elapsed seconds to its nudge tick (`2.5`); other legacy controllers use milliseconds (`2500`). The guidance-delay test accounts for the difference and checks both shared delay constants.

**Chapter-by-chapter stage data:** `tests/chapter-guidance.mjs` enumerates all stages of Kendal, Selassie and Windrush and checks goal/needs/next references and simulated requirement completion; it also checks goal and talk transition tables for Nanny, Melissa, Eventide and Bog Walk. This is a structural data check, not a substitute for walking each chapter in browser and checking arrow targets, interaction controls and physical reachability.

**Ten-game structural chapter coverage:** `tests/chapter-guidance.mjs` now includes Garvey, Tivoli and Port Royal in addition to the seven previously covered games. Port Royal checks goal controllers and hint mapping, Tivoli checks walking-chapter conversation orders, and Garvey checks talk transitions. Execute the suite and browser/mobile autoplay before claiming the chapter-by-chapter audit passes.

## Current UI regression coverage (16 November 2026, PR #101)

The following checks are included in `npm test` on the integration branch:

- `tests/chapter-footer.mjs`: all **ten** playable games must expose chapter actions in the order **Unlock All | Restart | Credits**, with the three-column layout rule.
- `tests/final-two-ui.mjs`: Windrush and Selassie chapter cards, selected journal tab, notice treatment and mobile title controls.
- `tests/kendal.mjs`: Kendal stage transitions, water tasks, beach activity guards and save/resume contracts.
- `tests/regressions.mjs`: the menu includes exactly ten distinct playable games.

A focused Chromium workflow is added in `.github/workflows/tivoli-mobile.yml`, running `tests/tivoli-browser.mjs` at 320px and 390px and uploading screenshots. It checks chapter action alignment, Credits navigation, Journal open/close, four touch arrows and uncaught script errors. **Presence of controls is not proof that held movement works**; manually test sustained press, release, turning, dialogue interruption and touch drag-to-look.

**Verification status:** source regression checks and GitHub's `npm test` runs are separate from real browser interaction. Do not mark the Tivoli mobile flow or the full ten-game visual pass complete without a successful browser run and screenshot review. The older `docs/HANDOFF.md` list is a historical baseline; use its unchecked items as outstanding until verified.

Always do these before saying something works.

## 1. Build and serve

```bash
node tools/build.mjs port-royal --dev
python3 -m http.server 8765          # from the repo root; restart it if it stops (servers die between sessions)
```

## 2. Screenshots of what you changed

Use headless Chrome with software WebGL. It's slow but reliable. Run one at a time, because parallel runs time out.

```bash
timeout 170 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader \
  --window-size=700,460 --virtual-time-budget=16000 --screenshot=/tmp/x.png \
  "http://localhost:8765/games/port-royal/site/index.html?shot=ns1"
```

Test views (dev builds only) live in the `if (__DEV__ && q.has('shot'))` block of `frame`'s loading code. Add your own: set `state.x`, `state.z`, `state.yaw`, `state.pitch` (and `eyeY` for height), usually inside a `setTimeout` so the town has loaded first.

Port Royal views:

| View | Shows |
|---|---|
| `ns1` ... `ns9` | the second street |
| `ns7` | the turtle crawl |
| `nsabba` | Abba outside the tavern |
| `tav`, `tav2` | the tavern |
| `ned`, `mug` | Ned at his table |
| `ships`, `shipflag` | the harbour, a ship's flag |
| `fort`, `fortflag`, `spit`, `spit2`, `mline` | Fort Charles and its spit |
| `kofi2`, `kofistack` | Kofi and his crates |
| `quake2`, `swim`, `boat` | the earthquake and the swim |
| `camp4`, `npc3` | the camp, Benning |
| `gwalk` | 12 side-on frames of Galdy's walk as data URLs |
| `sheet` | one body in the game's light: `&who=galdy&clip=Walk&zoom=full` (or `top`, `legs`, `head`); rows are standing and three moments of the clip, columns front, side, back, three-quarter. Pictures are left in `window.__sheet` as data URLs |
| `walkcheck` | scans walk clips for jumps and loop seams |
| `move`, `step`, `pad`, `nswalk` | step the frame loop by hand: walking, controller, a scripted walk into the second street |
| `fbquit` | starts the flashback, picks a chapter, and checks it cleans up |

**Frames are rare in headless Chrome.** It draws very few frames in a virtual-time run, so anything that depends on frame time looks slow or frozen. To test movement or timing, step the game yourself: replace `requestAnimationFrame` with a no-op and call `frame(t)` in a loop, adding 33 ms each time (see the `step` and `nswalk` views). Report results through `document.title` and read them with `--dump-dom | grep -o "<title>[^<]*"`.

## 3. The autoplayer: a scripted playthrough

`?auto=N` plays from chapter N; add `&one` to stop after it. It:
- clicks through cards and dialogue (first choice that isn't greyed out);
- does each available action once per goal, exits last;
- nudges position-triggered goals;
- speeds up the earthquake clock;
- logs every change of goal, place, phase and page, plus any JS error;
- writes `STALL` if nothing changes for 20 seconds.

```bash
timeout 295 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader \
  --window-size=320,240 --virtual-time-budget=70000 --dump-dom \
  "http://localhost:8765/games/port-royal/site/index.html?auto=1&one" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
```

The autoplayer jumps between actions instead of walking, so it can't catch movement bugs. Use a stepped walk test for those.

## 4. Character and model checks

The rules every character must meet are in `docs/PEOPLE.md`; the checklist is in `docs/STANDARD.md`.

- `tools/people/preview_heads.py` and `preview_body.py` render front, back and close-up images with Blender.
- `tools/garvey/preview.py` renders front and three-quarter views of bodies built by `era.py`, brighter than the two above: `NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/preview.py -- printer1907,woman1914` (writes `build/garvey_front.png` and `build/garvey_34.png`).
- Blender previews make dark skin look darker than the game does. Judge skin with `?test=skin` and game screenshots (`docs/PIPELINE.md`, "Skin").
- In the game: Port Royal's `?shot=sheet&who=<name>`, and Kendal's and Melissa's `?shot=model&m=people&ids=...` line people up for a close look.
- `node tools/review/people-sheet.mjs <game> <id,id,...> [out.png] [views=front,side,back,face,face34,faceside]` draws the same sheet for any game's packed bodies, in the game's own stance and skin lightening (serve the repository root first). Add `_lo`, `_crowd` or `_phone` to an id to look at a light copy: check that it still has eyes, brows and lips. `torso`, `torso34`, `torsoside` and `torsoback` views look closer at the clothes.
- Look for hair poking through hats, cloth gaps, shirts showing through, and floating feet.

## 5. Automatic checks (required for every game)

Owner rule, for every game: these checks are wired into the dev build, and **every place must report 0 issues** before work is called done. Looking for floating lamps, people stuck in walls and overlapping text one screenshot at a time does not scale. The shared code is `engine/audit.js` (place, held and people checks). The layout test lives in each game's `main.js`.

| Check | URL (dev build only) | What it finds |
|---|---|---|
| Place audit | `?test=audit`, or `?test=audit&p=hill,road` for some places | **float**: a sign, lamp, roof or step that touches nothing connected to the ground. **inside**: a person inside a solid box or cylinder, or inside a walking wall; and (`auditBodies`) a person whose body is cut by, enclosed by, or standing inside the shin-high outline of any solid shape, tested on its real triangles, including merged shapes (a whole tree) and every copy of an instanced shape (a forest, rocks, far huts). It checks where each person stands, at their own height and width (a child is smaller), every 30 cm along a walker's loop, and along the routes a game passes as `place.routes` (followers, guides, people sent somewhere). Leaf cards, see-through and unlit things, planes and thin small plants are walked through and not judged. **stuck**: the start, a thing to do or a person to talk to that cannot be reached by walking. **overlap**: two people standing in the same spot, or someone on a walker's path or on the player's start. **seated**: a person who sits too low (the seat passes through the thighs), hangs above the seat, sits on nothing, cuts into the back of the seat or a wall, or faces the back of a seat. **rest**: a pot, jar, bucket, gourd, plant pot or lamp (an upright cylinder or lathe shape, or a squashed ball) that touches nothing holding it up: not on the ground, not really touching a table, shelf, stage or fire's stones below it, not fixed to a bracket at its top and not hung from a thin hook or chain. **overlap**: two separate solid things that cut more than 4 cm into each other (a plant through a hut wall, a trunk inside a rock, two rocks run together); pieces of one object, and two pieces of a place's own fabric (walls, beams, floors added straight to the place), are not compared. |
| Follow and lead | `?test=follow` (Nanny Town, Kendal, Melissa, Eventide) | Walks the player along each follower's and guide's real route (`engine/follow.js`, `drive`), with stops and a turn back into the follower, and reports a follower inside the personal space, standing inside a footprint or a real shape (`auditBodies`), more than a set distance behind for over 2 seconds, or a guide that stands still while you wait near it. Expect 0. |
| Ambient life | `?test=ambient` (games that use `engine/ambient.js`) | Runs every background person for a minute with the player walking through (`ambientTest`) and reports anyone standing inside a solid, two people (or a person and the player) inside each other, a walker whose feet slide (speed against the clip's pace), someone moving on a standing clip or walking sideways, anyone with nothing changing for over 12 seconds in a lively scene, anyone standing on a story path or next to a story person, and setup faults (a clip the game does not ship, a carry clip with nothing in the hand, a seat missing). It also reports look-alikes (17 November 2026): two people of the same body (one body, one face) who come within 2.5 m of each other at any time in the run (`twins`), or the same face with nearly the same clothes colours (`lookalike`); see the Look-alikes row. Expect `AMBIENT 0`. See `docs/ENGINE.md`, `engine/ambient.js`. |
| Story flow | `?test=flow` (games that use `engine/story.js`) | For every step of the story table: a goal with several things to do but no count, an arrow with no target or pointing at something not needed now (an optional action), an arrow later than 3 s (5 s for explore steps), a task with no visible change, a carried item that is not drawn, a story person not in the place, and a flavour line that sends you somewhere ("first", "come back", "go and", "go to", "talk to", "then", another person's name). Expect `FLOW 0`. See `docs/ENGINE.md`, `engine/story.js`. |
| Vehicles | part of `?test=audit` (Eventide: its own pass, "chapter 4 at dawn") | `auditVehicles(vehicles, people, { start, walls, safe })` sweeps each moving vehicle's body (half width, half length) along its whole path and reports any person, walker's route or player's spot within `safe` metres (1 m) of its side, and any walking wall (a parked car) it drives through. A game lists its vehicles with the place (Eventide: `P.vehicles`) and runs the check in the part of the story where they move. A bus that stops for people still needs a clear road: the check looks at where people stand. |
| Garments | part of `?test=audit` (Eventide) | `auditGarments(id, body)`: a small piece of clothing that shows while its garment is hidden (waistcoat buttons with no waistcoat, a hat band with no hat, a buckle with no belt, a wrap's knot with no wrap), or a small piece (under 45 cm) that hardly touches any other piece (under 3 in 100 of its points within 1.5 cm). The Eventide audit also checks itself: it leaves the gateman's waistcoat buttons showing and expects the check to see them. Run it once per look (body, hat, hidden garments). |
| Hanging plants | part of `?test=audit` (Eventide) | `auditHanging(snap, groundAt)`: a loose clump of leaves or flowers high up that touches nothing (no stem, no wall, no ground). The float check forgives 20 cm gaps; this one allows 3 cm. |
| Look-alikes | part of `?test=audit` in all ten games (17 November 2026) | `faceCheck(people)` in `engine/faces.js`: two people in one place who are drawn with the same body and face (`man_suit`, `man_suit_lo` and every other copy of one body count as one face; `man_suit_b` is another face) and come within 2.5 m of each other. **twins**: the same face. **lookalike**: the same face and nearly the same clothes colours. It takes the story people and the extras together, so it also sees an extra beside the story person whose body it borrows, and two story people on one body. People who move are measured over the whole box they walk in (`reachOf`: the ambient behaviour's `pts`, `area`, `from`, `to`, `between`, a chaser's partner, a walker's `path`); `?test=ambient` measures the nearest two people really came. Not reported: one person shown twice (`who`), a child beside a grown-up on the same body shown small, and two members of one squad in uniform and helmet (`uniform`). Games whose people are `{ bodyId, hx, hz, m, life, path }` call `placeFaces(P.npcs)`. The lines are counted in the audit's total (Selassie and Windrush print `FACES <place> <count>`). Expect 0. The fix is in the game: `spreadBodies` (same file) gives each background person one of the body's three faces, or another body of the same kind, or makes a walker stay put; see `docs/PEOPLE.md`, section 5b. |
| Held items | `?test=held` | Something carried (a basket, a lantern, a suitcase) that is not at the hand, hangs the wrong way up, or cuts into the carrier's body. It tests the real mesh vertices against the posed body. |
| Layout | `?test=layout` | Interface text that overlaps other interface, is clipped, or runs off the screen, in each state (play, narration, dialogue, card, hold button, helper arrow), and checks that the journal, chapters and credits panels opened in the middle of play have their title and Close button on top (nothing from the HUD covers them). Run it at **390x800, 667x375, 800x500 and 1280x720**; the 1280x720 run takes about 4 minutes in software drawing. |
| Walking | `?test=walkers` (Kendal) | Every body walks whole loops at the speed the game moves it (`auditWalk` in `engine/audit.js`). It reports the stride, the clip speed used, how far the feet slide in a loop (good is under 3 cm), how far the shoes sink or float, and any jump where the loop joins. A carried thing must stay clear of the body in every stride. |
| Cloth | `?test=cloth` (Kendal, Garvey, Port Royal, Tivoli, Nanny Town; `&b=man_suit,boy` picks bodies, `&full` or `&lo` one kind in Kendal; `&where` adds where the worst point is) | An under layer that shows through its cover: skin through a shirt, a shirt through a waistcoat or jacket, hair through a hat (`auditCloth` in `engine/audit.js`). It poses every body (and in Kendal every light copy, each hat, and with the waistcoat hidden) standing, mid-stride, talking, waving and sitting, works out the real vertex positions, and lists body, pose, the two pieces, how many points and the worst depth in millimetres. Hands and arms hanging against skirts, points near a sleeve hem or a neckline, and the shirt's own neck ring under a jacket are left out on purpose: they are openings, not show-through. In Kendal's people viewer `?shot=model&m=people&ids=gran,lloyd&cloth` draws a red dot on every fault. **Not yet at 0**: on 14 November 2026 Kendal had 9 lines (15 points), Garvey 7 lines (49 points: trousers through the jacket hem when sitting for `delegate1920`, `garvey1914`, `garvey1916` and `hl_critic`, and a few points at a shirt's waist) and Port Royal 34 lines (390 points). Kendal's are a few points at the waist of a shirt over trousers or at a jacket's hem when sitting; Port Royal's are a shirt collar against the coat when walking, breeches against the coat skirt and a shirt tail against the breeches when sitting, and buc1's waistband. See `docs/games/kendal.md`. |
| Edges, fingers, hands | part of `?test=cloth` (every game that wires it) | Three more checks in `auditCloth` (`engine/audit.js`, 15 November 2026). **Jagged edges**: an open edge of a garment (collar rim, hem, neckline, skirt top) whose point juts more than 4 mm further from its neighbours than it does standing in Idle; edges under a belt, sash or apron, or tucked inside another garment, are left out. **Fingers in the cloth**: hand points more than 3 mm inside a skirt, seated skirt, apron, trousers or coat skirt (the show-through test leaves hands out on purpose, so this is their own check). **Fingers with holes**: an open edge on a finger (missing faces), checked once per body in Idle; this found every skirt body's fingertips deleted by the builder on 15 November 2026 (fixed the same day). **Malformed hands**: a hand edge over 4 mm stretched past 2.2 times, or squashed under 0.35 times, its Idle length. On the day they were added, every man in Kendal reported 3 hand edges in Walk at the thumb's web (not visible in close shots; judge before fixing), and many seated men in every game reported fingers in their trousers. |
| Skin | `?test=skin` (Kendal, Garvey, Port Royal, Nanny Town; Tivoli with a local copy) | The colour each face is drawn in, in the game's own light, from four headings (`engine/skinprobe.js`). Compare with the target in `docs/PIPELINE.md`, "Skin". |
| Resume | `?test=resume` (where the game saves) | Every saved stage reloads into the right place without breaking. |

```bash
node tools/build.mjs kendal --dev
timeout 280 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader --window-size=320,240 \
  --virtual-time-budget=120000 --dump-dom "http://localhost:8765/games/kendal/site/index.html?test=audit" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
# the layout test needs the real window size, so set it to each size in turn:
timeout 150 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader --window-size=667,375 \
  --virtual-time-budget=60000 --dump-dom "http://localhost:8765/games/kendal/site/index.html?test=layout" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
```

Port Royal has `?test=held` (the soldier's half-pike, Grace's basket, Kofi's crate, standing and walking), `?test=cloth` (every body standing, mid-stride, talking and sitting; `&b=galdy,kofi` picks bodies), `?test=skin`, `?test=walk` and `?test=collision` / `?test=seating`. Its full place audit (`?test=audit`) and layout test are not wired yet.

Bog Walk (`docs/games/bog-walk.md`) is first person, so its `?test=held` checks the torch hand directly (finger count, grip on the stick, on screen) as well as calling `auditHeld` for the people in its places, and its `?test=audit` adds a rule that nothing hung in the pipe may be outside the wall. Its checks live in `games/bog-walk/src/dev.js`. It is a second model for games like that.

How to wire it into a game (Kendal's `main.js` is the model: search for "the place audit"):
1. When a place is built, take `snap = snapMeshes(group)` **before** `batchStatic` merges the meshes.
2. Call `auditPlace({ id, snap, npcs, walls, bounds, start, actions, people })` and print `floating`, `inside` and `stuck`.
3. For carried things, call `auditHeld(...)` for each person who holds something (pose the mixer first).
4. Report through `#autolog` and `document.title`, so `--dump-dom` can read it.

Rules of thumb the audit enforces:
- A sign, lamp, step or beam needs a post, a bracket, a strap or a wall behind it. Leave no gaps.
- Two flat faces at the same depth flicker when the camera moves (z-fighting): keep a gap of at least 1 cm, or give the front face a `polygonOffset`.
- Do not hang a clock, picture or sign in front of a window. Put it on plain wall.
- A person who sits needs a seat. Give the person spec `seat: <top of the seat>` and the engine places the hip joint 12 cm above it for any body size (`SIT_HIPS` in Kendal's `main.js`). The sitting clips are chair poses: outdoors, put a bench or stool under them.
- Crowds and strollers use a relaxation pass and keep-out footprints so nobody overlaps; scenery must not sit on a path.
- When you find a new kind of mistake by eye, add a check for it here, then fix the places.
- A person between the buttress roots of a big tree looks as if they are inside it even when nothing cuts them (Nanny Town, November 2026): `auditBodies` now reports standing inside a shape's outline at shin height.
- Footprints (the circles and rectangles a game uses to keep people out) must match the real shape: a hut's corner, a tree's roots, a rock's full width. The open-ground scan in Nanny's audit checks every walkable spot outside the footprints against the real shapes.

## 6. Which game wires which check

Read from each game's code (`q.get('test')` in `games/<game>/src/`), November 2026. "yes" means the dev build answers that `?test=` name; it does not mean it reports 0. `collision` and `seating` are other names for the place audit where a game has one. The template wires none.

| Game | audit | held | layout | cloth | walkers | skin | resume | other |
|---|---|---|---|---|---|---|---|---|
| Port Royal | no (only `collision`, `seating`) | yes | no | yes | no | yes | no | `walk` |
| Marcus Garvey | no (`overlap`, `collision`, `seating` check people against furniture) | no | no | yes | no | yes | no | `walk` |
| Kendal 1957 | yes | yes | yes | yes | yes | yes | yes | |
| Bog Walk 1904 | yes | yes | yes | no | no | no | yes | |
| Nanny Town 1734 | yes (with the rest and overlap checks) | yes | yes | yes | yes | yes | yes | |
| Eventide 1980 | yes | yes | yes | no | no | no | yes | |
| Hurricane Melissa | yes | yes | yes | no | no | no | yes | |
| Tivoli | no (no places yet) | yes (weapon grips) | no | yes | yes | yes | no | `clips`, `measure` |

`?test=follow` (people who follow or lead, `engine/follow.js`): Nanny Town, Kendal, Melissa and Eventide. Garvey's people who walk to their seats use `goTo` and are checked by its route lines in `?test=collision`. Port Royal, Bog Walk and Tivoli have nobody who follows or leads.

Each game's current state and gaps are in `docs/STANDARD.md`, "Where each game stands". No game wires `?test=all` yet (15 November 2026); Bog Walk runs it through the test adapter (section 7).

## 7. All the checks at once: `?test=all` and the content lint

One runner, `checkAll(adapter, TABLES)` in `engine/checks.js`, runs every gameplay, continuity and quality check below and prints `ALL <n>` and a table (each check, its issues, its time, and "skip: needs game.x" for a hook the game has not given yet) into `#autolog`, with `ALL <n>` in the page title. Expect `ALL 0`. `&checks=journal,map` runs only those. Every game wires it before a pull request with one block in its dev code:

```js
import { checkAll } from '../../../engine/checks.js';
if (__DEV__ && q.get('test') === 'all') whenReady(() => checkAll(CHECK_ADAPTER, CHECK_TABLES));   // CHECK_* live in the game's src/checktables.js
```

The adapter is a set of small hooks into the game. A check runs when its hooks are there, so a game can add them one at a time:

| Check | What it finds | Hooks it needs (`game.x`) |
|---|---|---|
| `journal` | an unlock with no page, a page nothing unlocks, two pages with one id, a fictional speaker with no "X in this game is fictional" note (rule 3) | `journal()` returns `{ pages, unlocks, refs, speakers }` |
| `links` | no "Main Menu" link (`#allgames`, `#jhome`), or one that does not go to the menu or does not load | none |
| `a11y` | tap targets under 44 x 44 px, text under WCAG AA contrast (4.5, or 3 for large text; see-through panels are judged over black and white scenery), on the title and every screen `screens()` opens | optional `screens()`: `{ name: open() }` |
| `keys` | a control you can tap but not reach with Tab, a positive `tabindex`, Tab going up the screen; with `keyMove()`, arrow keys and Enter/Space that do nothing | optional `keyMove()` |
| `chapters` | a chapter the chapter list cannot open, or that opens with no step; collects who is in each chapter for `continuity` | `chapters()`, `openChapter(i)`, optional `step()`, `people()`, `light()` |
| `steps` | for every step: its targets cannot be reached on foot from the start (`walkRoute` from `engine/placement.js`, then a 25 cm grid walk round walls and `blocked(x, z, r)` solids); save, resume and compare: goal, place, people, held items, position (the old `?test=resume`, at every step) | `steps()`, `goStep(s)`, `place()`, `targets()`, optional `held()`, `snapshot()`, `save()`, `restore(data)` |
| `map` | the player leaves the map (every edge pushed outward, and 16 long walks from the start, through the game's own clamp) or gets stuck (a 1 m grid of reachable probe points; each needs two ways out) | `places()`, `goPlace(id)`, `place()`, `move(from, to, place)` |
| `faces` | a face too dark or too pale in each place and each light (`engine/skinprobe.js`, not only daylight; `TABLES.lights = { place: ['night'] }`) | `faces()`, `renderer()`, `scene()`, `places()`, `goPlace(id, light)` |
| `budget` | frame time, draw calls and triangles over the phone budget in each place, and the total download (`TABLES.budget`, defaults in `BUDGET`) | `renderer()`, `frame(dt)`, `places()`, `goPlace(id)` |
| `autoplay` | the autoplayer does not finish a chapter, or stalls; while it plays, the runner samples the camera, the clips in view, the line shown, the light and the sound levels every 250 ms | `autoplay({ sample })` returns `{ ok, why, stalls }` |
| `camera` | the camera below the ground, inside a wall (`[x0, z0, x1, z1, top]`) or inside a solid, along the autoplayer run and at every talk | `camera()`, optional `talks()`, `talkTo(id)` |
| `rule4` | a banned clip in view (`BANNED`: falls, doubled over, boxing always; fights closer than 12 m; `Sword2` past its fall), anyone whose hips are under 55 % of standing height on a clip that is not sitting, kneeling or crouching; a step tagged intense (`TABLES.intense = { stage: cardId }`) entered without its opt-in card. Tivoli lists its allowed clips per step in `TABLES.allowClips` | `clips()` returns `[{ id, clip, t, dist, inView, hips }]`, optional `cardSeen(id)` |
| `sound` | a sound name the engine does not make, a sound connected straight to the speakers (so the toggle cannot silence it), sound off leaving the master volume up, a bed louder than `TABLES.talkLevel` (0.3) during dialogue | `audio()` returns `AU`, optional `setSound(on)`, `talking()` |
| `continuity` | one character (`TABLES.cast = { mama: ['mama', 'mama3'] }`) whose body, colours, hat or name changes between chapters or steps with no change declared (`TABLES.changes = [{ id, chapter or step, field }]`); a given item (`TABLES.given = { step: ['lamp'] }`) gone before its drop (`TABLES.drops`); a line tagged night, day, dawn or dusk (`TABLES.tagged = { 'line text': 'night' }`) shown in other light; ages that do not add up across eras (`TABLES.ages = { pearl: { born: 1976, seen: [[1988, 12], [2025, 49]] } }`) | `people()`, and what `chapters`, `steps` and `autoplay` collected |
| `errors` | script errors, rejected promises, `console.error`, and files that fail to load, across the whole run | none |

Phone size: run it at 390x800 (and 667x375) as for the layout test. `TABLES.budget` numbers are for a real phone with `?stats`; software drawing in headless Chrome is several times slower, so a headless run uses looser numbers.

**Proving it on a game without touching its code.** `node tools/checks_browser.mjs harness bog-walk` (after `node tools/build.mjs bog-walk --dev`) loads the dev build, injects `engine/checks.js` and a test adapter (`tools/checks/adapters/bog-walk.js`, which reads the `window.__bw` object the dev build already has), and prints the table. Copy that adapter when wiring another game; once a game wires `?test=all` itself, its adapter moves into the game.

**Content lint: `node tools/lint_content.mjs`** (part of `npm test`). It reads every word each game ships (`content.js` where there is one, and the dialogue, choices, goals and journal pages in every source file) and reports:

| Finding | Rule |
|---|---|
| `long` | a dialogue line or choice over 12 words (rule 2); a short list of lines that must stay long goes in `allowLong` in `tools/checks/<game>.json` |
| `goal` | a goal of more than one sentence, or over 14 words ("Well done!" in front is allowed) |
| `dash` | an em dash anywhere in a game's source, page, docs or tools, and in the shared code and docs (rule 1). Write `\u2014` in code that looks for one |
| `name` | a speaker's name spelled two ways ("Mr. Clive" and "Mr Clive") or one letter apart |
| `fact` | a year, date or number (10 and over) the player reads that the game's facts doc (`docs/games/<game>.md` and `docs/games/<game>-*.md`) does not contain: add the fact and its source to the doc, or fix the text; puzzle numbers go in `factsIgnore` |
| `journal` | the same rules as the `journal` check above |
| `real` | every real person who speaks (the `real` list in `tools/checks/<game>.json`): check each line against the sources (rule 3) |
| `sound` | `stepSound`, `uiSound` or `cue` with a name `engine/audio.js` does not make, or a missing sound file |
| `rule4` | a clip from the rule 4 list named in a game's code: check it is in the background, never a fall in view |

`--game nanny` lints one game, `--all` lists every finding, `--json out.json` writes them. `npm test` runs it with `--ci`, which fails only on findings that are not in `tools/checks/lint-baseline.json`, so a pull request cannot add new ones while the old ones are fixed. After fixing some, run `node tools/lint_content.mjs --update-baseline` so they cannot come back. The baseline must only shrink; rule 8 still wants 0.

**Page checks: `node tools/checks_browser.mjs <what> [games]`** serves the repository laid out like `dist/` and drives headless Chrome (Playwright):

| `<what>` | Checks | Time (Nov 2026, software drawing) |
|---|---|---|
| `menu` | clicks every game on the menu, checks it loads with no errors, its "Main Menu" links (`#allgames`, `#jhome`) go to the menu and load, and "Main Menu" really goes back | about 8 minutes for 8 games |
| `errors` | loads each game (with `--auto`, runs `?auto=1&one`) and lists errors and files that fail to load | about 2 minutes a game |
| `a11y` | the menu and each title screen at 390x800 (`--size 667x375`): tap targets, contrast, Tab order | about 1 to 2 minutes a game |
| `size` | what each game downloads before Start is ready, against `budget.bytes` in `tools/checks/<game>.json` | about 1 to 2 minutes a game |
| `harness bog-walk` | `checkAll` on the live dev build through `tools/checks/adapters/bog-walk.js` (`--checks steps,map` for some) | about 14 minutes |
| `fixtures` | `tests/checks.html`: the accessibility checks catch planted faults (title `PASS 7 accessibility fixtures`) | seconds |

**On pull requests:** `.github/workflows/checks.yml` runs `npm test` (the regression tests and the content lint) on every pull request, in about a minute, with no secrets. The page checks are a separate job started by hand from the Actions tab (about 25 to 40 minutes).

## Lessons learned (bugs that slipped through)

- **Floating pots the float check could not see.** The float check joins any two meshes whose boxes come within 10 cm, and anything whose box overlaps the ground's box (on land with hills, that is everything). Pots standing past the end of Liberty Hall's platform (Garvey), an iron pot over the camp fire with nothing to hang from and a turtle shell 10 cm off the chimney breast (Port Royal), and a pen pot 1.5 cm above a counter (Garvey) all passed it. The **rest** check tests real contact, with each mesh's own turned box. Garvey and Port Royal, which have no place audit yet, print it in `?test=collision`.
- **Shirt colour inside 1690 breeches.** `tools/garvey/era.py` keeps the hidden body as a lining coloured like the cloth over it. Blender 5 resets every face to the first material when the slots are cleared, so the whole lining took the shirt's colour and showed as pale patches inside the breeches' hems and creases. Fixed in `era.py` (14 November 2026); bodies built before that (Port Royal's men) still carry it until they are rebuilt.

- **A collision check that ran everywhere** blocked all movement off the spit. Test walking in every place after touching `clampPos`.
- **Cutting dialogue lines** left empty "second visit" arrays and crashed. Run the autoplayer after editing text.
- **Sound errors only show when sound really plays.** `stepSound('water')` threw (it set a sound's buffer twice) but every muted headless test passed. Run the autoplayer once with sound allowed: add `--autoplay-policy=no-user-gesture-required` to Chrome (Playwright: in `args`), then check `AU.ctx.state` is `running` and that the page logged no errors. Do it after any change to sound code.
- **Clones copy `userData` as JSON**: store bone references in a `WeakMap`, not in `userData`.
- **Starting a chapter from the menu** must clean up the last chapter's people and props.
- **Gamepad presses**: save the previous button state before comparing, or no press ever registers.

## Focus, colour and visible-walk regressions

`npm test` runs the Node regression fixtures through the existing esbuild dependency. No extra test framework is needed. `tests/ui-audit.html`, served from the repository, checks the browser's real text rectangles and clipped scroll content; its title must read `PASS 4 layout regressions`.

Port Royal's dev build also supports `?test=walk`. Wait for `WALK 0` and read `#autolog`. It steps the actual Lewis Galdy controller through normal and hurried walking, backward and sideways movement, stopping, foot grounding and Walk/WalkM loop seams. `?shot=gwalk&clip=WalkM&cam=front` and `&cam=side` capture twelve poses for clothing and foot inspection. The preview and visible player now use the same walk clip.

For desktop input, approach a person and focus the game canvas. Both Space and Enter must open the conversation once. With Next or a choice focused, the same keys must activate that button normally. Journal/menu buttons must retain native keyboard activation, and text fields must not trigger world actions.

Teacher access: in a fresh browser, open Chapters, check the normal locks, turn on Teacher unlock, and verify that every chapter is available. Reload to check persistence; switch it off before starting a chapter to verify that the normal locks return. Check Port Royal (6), Garvey (8), Kendal (7), and Bog Walk (6). Selecting a chapter still changes the current story position normally.

The Pipe's ordering challenge shares its journey data with the physical notice board and the picture buttons. Its board guide remains in the panel; the full board can be expanded. Check a wrong pick, all six correct picks, Done, and keyboard activation at 390x800 and 667x375.

Use `?test=collision` or `?test=seating` for seating and furniture checks. Port Royal includes the dock and new street routes, Ned in the tavern, Benning after the earthquake, and Exquemelin at his desk. Garvey includes all places, complete route segments and bench approaches. Kendal and Bog Walk include these checks in their place audits. A missing walking wall must also be checked against the actual furniture boxes.

### The cloth check measures in true units (17 November 2026)

`auditCloth` (`engine/audit.js`) used to take each piece's rest shape in the squeezed box a packed body stores it in, so most skin-under-cloth pairs were never tested. It now measures every piece from the hips bone in true units. Counts from before this date are not comparable. See `docs/HANDOFF.md`.
