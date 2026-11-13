# Architecture

## Repository layout

```
CLAUDE.md                 start here (rules + index)
engine/                   shared runtime code, imported by every game
  anim.js                 clip library, per-character animation controller, seamless loops, feet on the ground
  audio.js                all sound, synthesised with Web Audio (no audio files)
  loader.js               loads models packed as base64 .js files (versioned URLs, background prefetch)
shared/
  models/anims.js         the shared animation library (39 Mixamo clips on one skeleton), copied into each game at build
  anim-sources/*.fbx      the original Mixamo downloads the library is made from
  rig/char.blend          the reference rig every character uses (Abba's), plus eye.png
games/
  port-royal/             the first game
    src/main.js           all game-specific code (world, story, UI); imports engine/
    site/                 what gets published: index.html, app.js (built), models/*.js
    assets/               source .glb files (houses, ships, characters) before packing
  _template/              a small working starter for a new game
menu/index.html           the game picker page
tools/                    the asset pipeline (see PIPELINE.md) and the build script
docs/                     these documents
build/                    scratch output from tools (git-ignored)
```

## How a game is built

`node tools/build.mjs <game> [--dev]` does two things:

1. It copies `shared/models/*.js` into `games/<game>/site/models/`, so every game ships the same animation library. If `games/<game>/anim-clips.json` exists (a list of clip names), that game's copy is cut down to just those clips (`tools/anim_subset.mjs`, the clips are untouched). Garvey plays 7 of the 39, which takes its animation file from about 317 KB to 99 KB gzipped.
2. It bundles `games/<game>/src/main.js` with esbuild into `games/<game>/site/app.js`. That includes three.js and any engine modules the game imports, and a fingerprint for every model file so models are asked for as `models/<name>.js?v=<fingerprint>` (see `docs/ENGINE.md`).

- `--dev` defines `__DEV__ = true`, which keeps the test views (`?shot=...`) and the autoplayer (`?auto=N`).
- The public build defines it as false, so esbuild strips all that code out.

`site/` is fully static: `index.html`, `app.js` and `models/*.js`. It works from any static host, including a claude.ai artifact (see PUBLISHING.md).

`node tools/dist.mjs` (`npm run dist`) builds the whole website into `dist/`: the menu as the home page (and again at `/menu/`), and each released game (excluding `_` templates and the Eventide prototype) at `/games/<game>/site/`, as public builds. Vercel runs it on every push (`vercel.json`).

## How a game runs (Port Royal as the example)

1. **`index.html`** holds all the UI markup and CSS: start screen, goal box, talk button, dialogue box, cards, journal, chapters panel, buttons. It loads `app.js`.
2. **Loading in stages**, so phones get to the first scene fast:
   - **Stage 1** loads the harbour textures and the two ships. The start button unlocks and you're on the pier.
   - **Stage 2** loads the town (`tex_town`, houses `h1` to `h6`), Abba, the townspeople and the animation library while you walk the pier.
   - **Stage 3** runs in a spare moment: it builds the tavern and the second street, then loads the tavern characters and Galdy (for third-person view).
3. **One frame loop** (`frame(now)`) moves the player and updates the camera, sea, flags, animation mixers and feet. It then runs every function in `TICKS` (per-frame hooks that systems push themselves into) and renders.
4. **Places**: `state.place` is one of `out`, `in` (tavern), `ware` (warehouse), `sea`, `after` (camp) or `yard` (churchyard). Each place has its own group, bounds in `clampPos()` and lighting in `setPlace()`.
5. **Story state** lives in `state` (saved to `localStorage`): `unlocked` journal pages, `talked`, `ate`, `ch` (chapter flags, `ch.seen` visit counts, `ch.heard` lines already said).
6. **Actions** are the heart of interaction. `ACTIONS` is a list of `{ label, r, where(), go() }`:
   - `where()` returns `[x, z]` when the action is available, otherwise `false`;
   - `r` is how close you must be;
   - the nearest available action shows as a glowing talk bubble, or a button labelled with the action;
   - `go()` runs it.

   Talk actions start with "Talk to"; the bubble shows the rest of the label.

## Port Royal `src/main.js` map

Sections are marked `/* ---------- name ---------- */`. In order:

| Section | What it holds |
|---|---|
| story content | `JOURNAL` pages and all conversations (`TALK`, `NPCS`, `NED`, `MORGAN_TOPICS`, ...) |
| state | the saved `state` object |
| renderer and scene | three.js setup, sky, sea, sand |
| harbour | pier, moored ships, cargo, beached boat, nets |
| inside The Turtle | the tavern interior and its things to find |
| models | model loading, texture mapping (`TEXMAP`), character setup, `people`, `survivors`, `TICKS` |
| movement | keys, touch joystick, look, `clampPos()` walking bounds |
| interface | toast, goal, dialogue (`startConvo`, `showStep`), journal, action list (`ACTIONS`) |
| saving / chapters | `saveGame`, `CHAPTERS` (each with `go()` and `done()`), the chapter menu |
| sound | soundscape mixing (`audioTick`), extra sounds, gamepad (`padRead`) |
| 7 June 1692 | the earthquake sequence (`Q` state, phases calm, tremor, main, swallow, sea) |
| the days after / 1691 warehouse | the camp chapter and the warehouse chapter |
| loop | `frame()`, `start()`, staged loading, dev test views |
| the second street | market, turtle crawl, Jews Street, the law (`NS`, `NS_PEOPLE`, `buildNewStreet`) |
| test-only autoplayer | `?auto=N` (dev builds only) |
| characters / tavern | buccaneers, Ned |
| Fort Charles | the accurate 1680s fort on its spit |
| Ned's story | the 1670 flashback (`FB`), Morgan, quartermaster, sword drill, loading crates |
| the spit | dunes, grass, rocks, surf, fishing canoe |
| talk badges | the glowing speech bubble over people you can talk to |

## Coordinates (Port Royal)

- `x` runs east toward the harbour.
- The main street runs from `X0 = -17.9` to `X1 = 17.9`, with half-width `S = 5.2` around `z = 0`.
- `SHORE = 23`. The pier runs east from about x 20.5.
- The second street is centred on `z = 18.6`, entered from the harbour corner at x 18 to 21.5.
- Fort Charles sits on a spit centred near (50, -30).
- Indoor places use far-away coordinates: tavern near x -200, warehouse near x -255.
