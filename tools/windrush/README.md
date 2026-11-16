# Windrush assets and checks

This game owns its `wr_` recipes and packed models. It imports the shared engine, animation library, builder and packer. It does not edit another game's people or require a feature branch to be merged first.

## Build people

Install Blender with MPFB and its MakeHuman data using the repository pipeline guide. Set `MAKEHUMAN` to the data installation. On Blender 4.3, `build_person.py` bridges only the newer glTF export option names; it executes the current shared `tools/garvey/era.py` body and garment code unchanged.

```sh
MAKEHUMAN=/path/to/makehuman node tools/windrush/build-people.mjs
# Or rebuild selected recipes:
MAKEHUMAN=/path/to/makehuman node tools/windrush/build-people.mjs wr_iris79
MPFB_SOURCE=/path/to/mpfb2 MAKEHUMAN_SOURCE=/path/to/makehuman-repository node tools/windrush/asset-manifest.mjs
node tools/build.mjs windrush --dev
```

`BLENDER_BIN` optionally selects the Blender executable; `BLENDER_USER_RESOURCES` can select an isolated Blender profile. Rebuild before regenerating the manifest, so its recorded builder revision describes the delivered models. Intermediate GLBs and logs go in ignored `build/windrush-people/`.

Each recipe produces a raw inspection body, a light inspection copy, and joined focus, crowd and phone bodies. Joining preserves original bone weights and the original eyes. Skin lighting is baked at 1.55 for joined bodies; raw bodies receive the same factor on the Skin material at runtime. Hair remains at 1. The standing render versions retain invisible measurement proxies for shared hand-clearance logic. They omit the unused seated skirt. No seated or kneeling clips are used in this story.

The shipped models were rebuilt with shared builder commit `ee66772`, after PRs #88 and #89. This includes the later-era neckline fix and uses the same builder as main. Future rebuilds use the shared builder at that checkout; no local fork needs synchronising.

## Check the playable game

Serve the repository root after a dev build. The game provides `?auto=1` and `?test=all`, `audit`, `cloth`, `walkers`, `skin`, `held`, `ambient`, `resume`, `layout` and `budget`. `?b=wr_iris79` narrows body checks. `?shot=yard`, `poster`, `deck`, `london`, `work`, `jamaica`, `elder`, `advice` and `people` frame repeatable visual reviews.

The browser smoke test uses actual keyboard/touch input and full document reloads, in addition to the game's development adapters. It checks arbitrary-order packing, saved held objects, posted sheets, chapter cleanup, Iris's guide route, sound, camera controls, teacher access and the calm reading path.

```sh
# Install playwright-core outside this repository if it is not already available.
PW_MODULE=/path/to/playwright-core/index.mjs \
WINDRUSH_URL=http://localhost:8891/games/windrush/site/ \
node tools/windrush/browser-smoke.mjs
```

The default browser is `/usr/bin/chromium`; `CHROMIUM_BIN` can override it. A public build intentionally strips these development hooks. See `docs/games/windrush.md` for story, sources and review results, and `animation-plan.md` for the requested motions that still need dedicated licensed clips.
