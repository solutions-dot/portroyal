# Engine (shared code)

The engine is plain ES modules in `engine/`, bundled into each game by `tools/build.mjs`. A game imports what it needs:

```js
import { CL, mixers, grounded, loadClips, setFallbackClip, clipFor, animate, groundFeet, seamLoop } from '../../../engine/anim.js';
import { AU, soundPref, setSound, audioInit, stepSound, uiSound, cue, tone, noiseHit, gullCry, crackle, chirp, shipCreak, hammer, clink, setG, out } from '../../../engine/audio.js';
import { loader, onLoadFail, script, model, stage } from '../../../engine/loader.js';
```

## engine/loader.js: loading packed models

Models ship as `site/models/<name>.js`, each defining `window.__models[name] = "<base64 glb>"`. This keeps everything as text, so any static host serves it, including claude.ai artifacts.

**Versioned URLs.** `tools/build.mjs` fingerprints every model file (a short hash of its contents) and bakes the list into `app.js` as `__MODELV__`, so the game asks for `models/ned.js?v=1a2b3c4d5e`. A changed model gets a new URL and is fetched again, an unchanged one stays in the browser's cache, which is why `vercel.json` can cache models for a year (`immutable`). Nothing to do by hand: just rebuild after changing a model.

| Function | Use |
|---|---|
| `onLoadFail(fn)` | `fn(name)` is called if a file fails, for example to show "reload the page". |
| `script(name)` | Loads `models/<name>.js?v=<fingerprint>`. Texture packs (`tex_*`) only need this. If a host refuses the `?v=` part, it tries the plain file once. |
| `model(name)` | Loads and parses a packed glTF and resolves to the gltf (`.scene`, `.animations`). Meshopt-compressed files are supported. |
| `prefetch([names])` | Asks the browser to fetch these models quietly in the background, so they are already there when needed. Skipped on a slow or data-saving connection. Garvey uses it for the next chapter's people. |
| `modelUrl(name)` | The versioned URL of a model. |
| `stage([names], onEach)` | Loads several in parallel and puts results in `window.__got[name]`. `onEach(fraction)` drives a progress bar. |

## engine/anim.js: animation for every character

Every character uses the same Mixamo skeleton (`mixamorig*` bones, from `shared/rig/char.blend`), so one clip library animates everyone.

| Name | Use |
|---|---|
| `CL` | Clip library, name to `AnimationClip`. Fill it with `loadClips(gltfOf('anims'))`. |
| `clipFor(name)` | Returns a ready-to-play copy of a clip (details below). |
| `animate(model, name)` | Gives a character a controller, also kept as `model.userData.anim`. |
| `mixers` | Every mixer `animate()` makes. The game loop calls `mx.update(dt)` on visible ones. |
| `grounded`, `groundFeet(m)` | Push a model into `grounded` and call `groundFeet` each frame: it pins the lowest toe to `m.userData.ground` (default 0), so feet never float or sink. |
| `seamLoop(clip)` | Makes a loop end exactly where it starts. Already applied to Walk, Run, Carry, Tread, SadWalk. |
| `setFallbackClip(c)` | The clip used if a named one is missing. |

What `clipFor` does to each copy:
- It drops scale tracks and moving-root tracks.
- It keeps the hips' height only for clips matching `HIPS_Y` (sitting, stumbling, praying, sword work...).
- It locks seated clips over their seat, facing the way the character is placed.
- `WalkM` is a steadier man's walk made from `Walk`, with less hip and spine twist.

The controller from `animate()` (`ctl`):
- `ctl.play('Wave', once)` plays a clip, cross-faded. With `once` it returns to the base clip afterwards.
- `ctl.play('Walk')` loops a clip.
- `ctl.rest()` goes back to the base clip.
- `ctl.tick(dt)` is called each frame for the once-timers.

Clips in the library: Idle, Run, Walk, StartWalk, StopWalk, Carry, CarryIdle, TurnR, TurnL, TurnRW, TurnLW, JogStumble, StumbleBack, Tread, Talk1, Talk2, Talk3, Point, Wave, WaveSlow, Laugh, Salute, Clap, Cheer, SitDisbelief, SitTalk, SitIdle, SitDrink, Write, Terrified, Sad1, Sad2, Cry, Block, Punch, Sword1, Sword2, Sheathe, PickUp, Pray, Drink. To add one, see PIPELINE.md.

## engine/audio.js: sound made in code

There are no audio files. Everything is Web Audio noise and oscillators.

| Name | Use |
|---|---|
| `soundPref('mygame-sound')` | Call once at startup; it remembers on/off per game. |
| `audioInit()` | Call on the first user tap (browsers block sound before one). It creates the looping beds `AU.ch.sea`, `surf`, `wind`, `crowd`, `room`. |
| `setG(AU.ch.sea, level)` | Fades a bed. A game's own `audioTick()` decides the levels per place every 0.1 s. |
| `setSound(on)` | The mute button. |
| `stepSound(kind)` | A footstep: `'sand'`, `'grass'`, `'wood'`, `'stone'` or `'water'` (a splash stroke). |
| `uiSound(kind)` | Interface sounds: `'page'` (new journal page), `'goal'` (goal changed), `'tap'` (conversation starts). |
| `cue(kind)` | Short music phrases: `'begin'`, `'sad'`, `'end'`. |
| `gullCry()`, `chirp()`, `crackle()`, `shipCreak()`, `hammer()`, `clink()` | One-shot ambience. |
| `tone(f0, f1, dur, type, vol, pan, delay)`, `noiseHit(freq, q, dur, vol, pan, delay)`, `out(pan)` | Building blocks for new sounds. |

## engine/audit.js: automatic checks of a built place

Required for every game (CLAUDE.md rule 8, TESTING.md section 5). Nothing here runs in a public build unless a game imports it into code that is only reached when `__DEV__` is true.

| Name | Use |
|---|---|
| `snapMeshes(group)` | A list of the world-space box of every visible mesh. Take it when a place is built, **before** `batchStatic` merges the meshes. |
| `auditPlace({ id, snap, npcs, walls, bounds, start, actions, people })` | Returns `{ id, floating, inside, stuck }`: objects hanging in the air, people inside a solid (or overlapping another person), and spots the player cannot walk to. |
| `auditHeld(id, model, held)` | For one person who carries things: each held item must be at the posed hand, upright, and clear of the body. Pose the mixer first (`mx.update(0.1)`). |
| `auditSeated(id, body, snap, ground, stats)` | For one seated person (pose the mixer first): the seat must not pass through the thighs (the hip joint rides about 12 cm above the seat top), the person must not hang or sit on nothing, and must not cut into a seat back or wall. Uses the real skinned vertices. |
| `auditPeople(...)` | People standing in the same spot, or on a walker's path. `auditPlace` calls it. |

Show the results in a dev-only `?test=audit` view and expect 0 issues. Kendal's `main.js` ("the place audit") is the example.

## Still inside Port Royal, ready to move next

These systems are general but still live in `games/port-royal/src/main.js`, because they read Port Royal's UI and state directly. When a second game needs one, move it into `engine/` and pass the game's details in as options:

- **Conversation system**: `startConvo`, `showStep`, choices with `ok: true`, `unlock` on a line, speaker animation (`speakerModel`), the talk badge (`TB`, `BUBBLE`, `setActionButton`) and turning to face the player (two `TICKS` hooks).
- **Actions**: the `ACTIONS` list and the nearest-action picker.
- **Journal and goals**: `JOURNAL`, `unlock`, `renderJournal`, `showGoal`, the goal box that folds away.
- **Chapters and saving**: `CHAPTERS` (each with `go`, `done`), `chapterFade`, `saveGame`, the Reset button.
- **Movement and controls**:
  - the keyboard, touch joystick (resting outline) and drag-to-look code;
  - `padRead` for game controllers;
  - the `MV` easing (walking speeds up and slows down smoothly);
  - wall sliding;
  - mouse-only tap-to-walk;
  - the `clampPos` pattern (bounds per place, then collision circles and boxes).
- **People who stroll**: `STROLL` routes, stopping when the player is near, and later-visit lines (`MORE`, `NS_MORE`, `npcTalk`, `nsTalk`).
- **Test harness**: the `?shot=` views and the `?auto=` autoplayer.

`games/_template/src/main.js` has small, self-contained versions of movement, talking and the frame loop, so a new game can start without pulling these out first.

## engine/grip.js: hands that hold things, arms that clear the body

| Name | Use |
|---|---|
| `grip(model, 'Right', item, { handleY, scale, yaw, lift })` | Closes that hand into a fist, hangs the item from the fist by its handle (upright whatever the hand does) and lifts the arm `lift` radians away from the body so the item clears the hip, thigh or skirt. Pose the mixer once first. |
| `spreadArms(model, angle)` | Holds both empty arms a little further out, so hands do not sink into a wide skirt or a jacket. |
| `gripTick(model)` | Call every frame after the mixer update for any model with `userData.grips`. |

Kendal and Marcus Garvey use it. Check the result with `?test=held`.
