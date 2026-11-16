# Selassie game assets and checks

**Work in progress:** the owner rejected the current reduced faces and character styling. The phone simplification must preserve eye sockets, nose, mouth and jaw geometry. Passing cloth audits is not visual approval. These revisions are kept out of main in the separate people PR.

Run all commands from the repository root. None modifies the shared builder or another game's models.

## Character rebuild

Use the existing MPFB/MakeHuman setup described in `docs/PIPELINE.md`, Blender and Node dependencies from `npm ci`:

```bash
node tools/selassie/build-people.mjs
# Or rebuild selected recipes:
node tools/selassie/build-people.mjs sel_emperor66 sel_rastaman66
```

`BLENDER_BIN` can select Blender. `MAKEHUMAN` points to the MakeHuman application's `makehuman` directory. An isolated `BLENDER_USER_RESOURCES` can hold the official MPFB extension without changing a developer's installed Blender preferences.

This environment used Blender 4.3.2 with official `makehumancommunity/mpfb2` and `makehumancommunity/makehuman` checkouts. `build_person.py` runs the current `tools/garvey/era.py` with an exporter-option bridge for Blender 4.3. It does not copy or patch garment generation. Blender 5 uses the newer exporter options unchanged.

`locs.py` fits roots against visible skin and hair, rather than MakeHuman helper geometry; the root rings follow the head. Crowd beards retain the skin's bone weights, and narrow neckbands replace oversized camp collars on the Rastafari recipes.

`finish_person.py` adds this game's beards, locs and uniform details. `imperial_face.py` fits Selassie's moustache and grey beard; `imperial_uniform.py` constructs his arrival uniform from the uploaded references. It fits Adina's shoulder and the Emperor's tucked tunic. The normal full body and low copy preserve separate garment materials for close inspection. It also exports a joined crowd body before packing. Crowd skin receives the established 1.55 multiplier in its vertex colours; one painted material and the original eyes reduce draw calls. Named bone weights, the skeleton and shared clips are preserved.

`build-people.mjs` calls the current shared `tools/people/pack.mjs` for full, low and crowd versions. GLBs and build logs stay in ignored `build/selassie-people/`. Only packed model JS and recipes are committed. Normal website builds do not need Blender.

## The game's own animation clips

The owner's salute for Haile Selassie (`shared/anim-sources/owner/Salute_selassie.fbx`) is packed into this game's own `games/selassie/site/models/anims_selassie.js`, so the shared library and the other games are unchanged:

```bash
ANIMS_OUT=build/anims_selassie.glb ~/venv/bin/python3 tools/anims/retarget_clips.py tools/selassie/clips.json   # about 20 seconds
node tools/selassie/pack_clips.mjs build/anims_selassie.glb
```

The game loads it after the shared library (`main.js`). The owner's `Descending_Stairs.fbx` was measured and does not fit his body (see `docs/games/selassie.md`), so it is not in `clips.json`.

To rebuild people on a machine where `bpy` is a Python module rather than a Blender program, a stand-in that drops Blender's own arguments works: `BLENDER_BIN` pointing at a script that runs `~/venv/bin/python3 "$5" "$6" "$7"`.

## Checks

```bash
node tools/selassie/test.mjs
npm test
node tools/build.mjs selassie --dev
python3 -m http.server 8879
```

Use the URLs documented in `docs/games/selassie.md`. `?auto=1` uses the real talk/action/carry handlers and clicks every story card to the ending. `&one` stops after the requested chapter. The route and ambient tests additionally simulate movement. Inspect screenshots as well as automated results.

The shared runner is wired at `?test=all`, using `src/checktables.js`. Its adapter is exposed through the dev-only `window.__adapter` and `window.__SEL.checkAdapter`; the matching tables are `window.__tables`. A check without a hook reports an explicit skip. The separate browser integration runner tests keyboard input, real reloads, touch controls, replay cleanup, teacher access and the cinematic's mute, pause and read route:

```bash
PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs node tools/selassie/browser-checks.mjs
```

Generate a reproducibility record after a character rebuild with `node tools/selassie/asset-manifest.mjs`. Optional `MPFB_SOURCE` and `MAKEHUMAN_SOURCE` point to the source checkouts so their commits can be recorded too. `BUILDER_ROOT` records a different checkout only when that checkout actually performed the build.

The current game document records references, integration boundaries, the reconstruction scope and the status of visual likeness review. Do not turn a successful technical check into a claim of pixel-perfect historical likeness.
