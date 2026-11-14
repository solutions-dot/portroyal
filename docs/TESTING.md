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

- `tools/people/preview_heads.py` and `preview_body.py` render front, back and close-up images with Blender.
- Look for hair poking through hats, cloth gaps, shirts showing through, and floating feet.

## 5. Automatic checks (required for every game)

Owner rule, for every game: these checks are wired into the dev build, and **every place must report 0 issues** before work is called done. Looking for floating lamps, people stuck in walls and overlapping text one screenshot at a time does not scale. The shared code is `engine/audit.js` (place, held and people checks). The layout test lives in each game's `main.js`.

| Check | URL (dev build only) | What it finds |
|---|---|---|
| Place audit | `?test=audit`, or `?test=audit&p=hill,road` for some places | **float**: a sign, lamp, roof or step that touches nothing connected to the ground. **inside**: a person inside a solid box or cylinder, or inside a walking wall. **stuck**: the start, a thing to do or a person to talk to that cannot be reached by walking. **overlap**: two people standing in the same spot, or someone on a walker's path or on the player's start. **seated**: a person who sits too low (the seat passes through the thighs), hangs above the seat, sits on nothing, cuts into the back of the seat or a wall, or faces the back of a seat. |
| Held items | `?test=held` | Something carried (a basket, a lantern, a suitcase) that is not at the hand, hangs the wrong way up, or cuts into the carrier's body. It tests the real mesh vertices against the posed body. |
| Layout | `?test=layout` | Interface text that overlaps other interface, is clipped, or runs off the screen, in each state (play, narration, dialogue, card, hold button, helper arrow), and checks that the journal, chapters and credits panels opened in the middle of play have their title and Close button on top (nothing from the HUD covers them). Run it at **390x800, 667x375, 800x500 and 1280x720**; the 1280x720 run takes about 4 minutes in software drawing. |
| Walking | `?test=walkers` (Kendal) | Every body walks whole loops at the speed the game moves it (`auditWalk` in `engine/audit.js`). It reports the stride, the clip speed used, how far the feet slide in a loop (good is under 3 cm), how far the shoes sink or float, and any jump where the loop joins. A carried thing must stay clear of the body in every stride. |
| Cloth | `?test=cloth` (Kendal and Garvey; `&b=man_suit,boy` picks bodies, `&full` or `&lo` one kind in Kendal; `&where` adds where the worst point is) | An under layer that shows through its cover: skin through a shirt, a shirt through a waistcoat or jacket, hair through a hat (`auditCloth` in `engine/audit.js`). It poses every body (and in Kendal every light copy, each hat, and with the waistcoat hidden) standing, mid-stride, talking, waving and sitting, works out the real vertex positions, and lists body, pose, the two pieces, how many points and the worst depth in millimetres. Hands and arms hanging against skirts, points near a sleeve hem or a neckline, and the shirt's own neck ring under a jacket are left out on purpose: they are openings, not show-through. In Kendal's people viewer `?shot=model&m=people&ids=gran,lloyd&cloth` draws a red dot on every fault. **Not yet at 0**: on 14 November 2026 Kendal had 19 lines (64 points) and Garvey 18 lines (68 points), nearly all a few points at the waist of a shirt over trousers when sitting, or at a jacket's hem when sitting. See `docs/games/kendal.md`. |
| Resume | `?test=resume` (where the game saves) | Every saved stage reloads into the right place without breaking. |

```bash
node tools/build.mjs kendal --dev
timeout 280 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader --window-size=320,240 \
  --virtual-time-budget=120000 --dump-dom "http://localhost:8765/games/kendal/site/index.html?test=audit" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
# the layout test needs the real window size, so set it to each size in turn:
timeout 150 google-chrome --headless=new --no-sandbox --use-gl=swiftshader --enable-unsafe-swiftshader --window-size=667,375 \
  --virtual-time-budget=60000 --dump-dom "http://localhost:8765/games/kendal/site/index.html?test=layout" | sed -n '/<pre id="autolog"/,/<\/pre>/p'
```

Port Royal has `?test=held` (the soldier's half-pike, Grace's basket, Kofi's crate, standing and walking) and `?test=cloth` (every body standing, mid-stride, talking and sitting; `&b=galdy,kofi` picks bodies). Its place audit and layout test are not wired yet.

Bog Walk (`docs/games/bog-walk.md`) is a first-person game with no people yet, so its `?test=held` checks the hand and torch directly (finger count, grip on the stick, on screen) instead of calling `auditHeld`, and its `?test=audit` adds a rule that nothing hung in the pipe may be outside the wall. It is a second model for games like that.

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

## Lessons learned (bugs that slipped through)

- **A collision check that ran everywhere** blocked all movement off the spit. Test walking in every place after touching `clampPos`.
- **Cutting dialogue lines** left empty "second visit" arrays and crashed. Run the autoplayer after editing text.
- **Sound errors only show when sound really plays.** `stepSound('water')` threw (it set a sound's buffer twice) but every muted headless test passed. Run the autoplayer once with sound allowed: add `--autoplay-policy=no-user-gesture-required` to Chrome (Playwright: in `args`), then check `AU.ctx.state` is `running` and that the page logged no errors. Do it after any change to sound code.
- **Clones copy `userData` as JSON**: store bone references in a `WeakMap`, not in `userData`.
- **Starting a chapter from the menu** must clean up the last chapter's people and props.
- **Gamepad presses**: save the previous button state before comparing, or no press ever registers.
