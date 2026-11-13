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

## Lessons learned (bugs that slipped through)

- **A collision check that ran everywhere** blocked all movement off the spit. Test walking in every place after touching `clampPos`.
- **Cutting dialogue lines** left empty "second visit" arrays and crashed. Run the autoplayer after editing text.
- **Clones copy `userData` as JSON**: store bone references in a `WeakMap`, not in `userData`.
- **Starting a chapter from the menu** must clean up the last chapter's people and props.
- **Gamepad presses**: save the previous button state before comparing, or no press ever registers.
