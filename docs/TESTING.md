# Testing

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
- Look for hair poking through hats, cloth gaps, shirts showing through, and floating feet.

## 5. Automatic checks (required for every game)

Owner rule, for every game: these checks are wired into the dev build, and **every place must report 0 issues** before work is called done. Looking for floating lamps, people stuck in walls and overlapping text one screenshot at a time does not scale. The shared code is `engine/audit.js` (place, held and people checks). The layout test lives in each game's `main.js`.

| Check | URL (dev build only) | What it finds |
|---|---|---|
| Place audit | `?test=audit`, or `?test=audit&p=hill,road` for some places | **float**: a sign, lamp, roof or step that touches nothing connected to the ground. **inside**: a person inside a solid box or cylinder, or inside a walking wall. **stuck**: the start, a thing to do or a person to talk to that cannot be reached by walking. **overlap**: two people standing in the same spot, or someone on a walker's path or on the player's start. **seated**: a person who sits too low (the seat passes through the thighs), hangs above the seat, sits on nothing, cuts into the back of the seat or a wall, or faces the back of a seat. |
| Held items | `?test=held` | Something carried (a basket, a lantern, a suitcase) that is not at the hand, hangs the wrong way up, or cuts into the carrier's body. It tests the real mesh vertices against the posed body. |
| Layout | `?test=layout` | Interface text that overlaps other interface, is clipped, or runs off the screen, in each state (play, narration, dialogue, card, hold button, helper arrow), and checks that the journal, chapters and credits panels opened in the middle of play have their title and Close button on top (nothing from the HUD covers them). Run it at **390x800, 667x375, 800x500 and 1280x720**; the 1280x720 run takes about 4 minutes in software drawing. |
| Walking | `?test=walkers` (Kendal) | Every body walks whole loops at the speed the game moves it (`auditWalk` in `engine/audit.js`). It reports the stride, the clip speed used, how far the feet slide in a loop (good is under 3 cm), how far the shoes sink or float, and any jump where the loop joins. A carried thing must stay clear of the body in every stride. |
| Cloth | `?test=cloth` (Kendal, Garvey, Port Royal, Tivoli; `&b=man_suit,boy` picks bodies, `&full` or `&lo` one kind in Kendal; `&where` adds where the worst point is) | An under layer that shows through its cover: skin through a shirt, a shirt through a waistcoat or jacket, hair through a hat (`auditCloth` in `engine/audit.js`). It poses every body (and in Kendal every light copy, each hat, and with the waistcoat hidden) standing, mid-stride, talking, waving and sitting, works out the real vertex positions, and lists body, pose, the two pieces, how many points and the worst depth in millimetres. Hands and arms hanging against skirts, points near a sleeve hem or a neckline, and the shirt's own neck ring under a jacket are left out on purpose: they are openings, not show-through. In Kendal's people viewer `?shot=model&m=people&ids=gran,lloyd&cloth` draws a red dot on every fault. **Not yet at 0**: on 14 November 2026 Kendal had 9 lines (15 points), Garvey 7 lines (49 points: trousers through the jacket hem when sitting for `delegate1920`, `garvey1914`, `garvey1916` and `hl_critic`, and a few points at a shirt's waist) and Port Royal 34 lines (390 points). Kendal's are a few points at the waist of a shirt over trousers or at a jacket's hem when sitting; Port Royal's are a shirt collar against the coat when walking, breeches against the coat skirt and a shirt tail against the breeches when sitting, and buc1's waistband. See `docs/games/kendal.md`. |
| Skin | `?test=skin` (Kendal, Garvey, Port Royal; Tivoli with a local copy) | The colour each face is drawn in, in the game's own light, from four headings (`engine/skinprobe.js`). Compare with the target in `docs/PIPELINE.md`, "Skin". |
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

## 6. Which game wires which check

Read from each game's code (`q.get('test')` in `games/<game>/src/`), November 2026. "yes" means the dev build answers that `?test=` name; it does not mean it reports 0. `collision` and `seating` are other names for the place audit where a game has one. The template wires none.

| Game | audit | held | layout | cloth | walkers | skin | resume | other |
|---|---|---|---|---|---|---|---|---|
| Port Royal | no (only `collision`, `seating`) | yes | no | yes | no | yes | no | `walk` |
| Marcus Garvey | no (`overlap`, `collision`, `seating` check people against furniture) | no | no | yes | no | yes | no | `walk` |
| Kendal 1957 | yes | yes | yes | yes | yes | yes | yes | |
| Bog Walk 1904 | yes | yes | yes | no | no | no | yes | |
| Nanny Town 1734 | yes | yes | yes | no | yes | no | yes | |
| Eventide 1980 | yes | yes | yes | no | no | no | yes | |
| Hurricane Melissa | yes | yes | yes | no | no | no | yes | |
| Tivoli | no (no places yet) | yes (weapon grips) | no | yes | yes | yes | no | `clips`, `measure` |

Each game's current state and gaps are in `docs/STANDARD.md`, "Where each game stands".

## Lessons learned (bugs that slipped through)

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
