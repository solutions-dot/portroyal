# Garvey-era characters (about 1900 to 1930)

Status: working. `era.py` is now the one clothes builder for every game's people (Port Royal's 1690 recipes too); the rules are in `docs/PEOPLE.md` and every recipe key is listed in `docs/PIPELINE.md`, section 5. It began as a copy of Port Royal's old `tools/people/npc.py`, which is now retired and kept only for reference. The Garvey bodies are in `people/`: the printer and customer (chapter 1), Garvey, Amy Ashwood and three neighbours (chapter 2), Garvey in street clothes and three Harlem people (chapter 3), a pressman and a seaman (chapter 4), a clerk and an engineer (chapter 5), a nurse, a traveller and a steward (chapter 6), Amy Jacques Garvey (chapter 7), and a modern student and a park guide (chapter 8).

## Set up on a fresh Linux machine

The `bpy` wheel can also be installed from a saved file: `pip install ./bpy-5.3.0-cp313-cp313-manylinux_2_28_x86_64.whl` works offline. MakeHuman's data folder must be a complete clone (check that `makehuman/data/eyes/low-poly/low-poly.mhclo` exists) and `MAKEHUMAN` points at its inner `makehuman` folder.

These are the steps that worked on 13 November 2026 (Python 3.13, no Blender install needed).

```bash
python3 -m venv ~/venv && ~/venv/bin/pip install bpy==5.3.0        # Blender as a Python module, about 430 MB
git clone --depth 1 https://github.com/makehumancommunity/makehuman ~/mh
# MPFB (MakeHuman for Blender): download add-on-mpfb-v2.0.18.zip from https://extensions.blender.org/add-ons/mpfb/
mkdir -p ~/.config/blender/5.3/extensions/user_default/mpfb
unzip add-on-mpfb-v2.0.18.zip -d ~/.config/blender/5.3/extensions/user_default/mpfb
npm install
```

## Build and look at a character

```bash
mkdir -p build/people
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/garvey/people/printer1907.json)"
NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/preview.py -- printer1907,woman1914    # build/garvey_front.png, build/garvey_34.png
node tools/people/pack.mjs --out games/garvey/site/models printer1907 woman1914          # trim, compress and pack (add --lo for light copies)
```

The bpy module has no Draco or meshopt, so the first `.glb` is large (about 1.5 MB). Packing brings a full body to about 320 to 420 KB (printer1907 397 KB, woman1914 323 KB). The same bodies are also copied into other games (Bog Walk uses several); copy the packed files, do not rebuild them per game.

## Recipe keys

The full, current list of keys is in `docs/PIPELINE.md`, section 5 (and section 1 for 1690 recipes). The Garvey recipes were written before `docs/PEOPLE.md`: they leave out `era` (so they build as 1915), give `hat` as one word instead of a list, and use `collar: true`. They still build, but bring each one up to the standard (`docs/STANDARD.md`) when you next change it. `smooth`, set in some of them, is no longer read.

Women use the body macros `gender: 0.0`, `cupsize` and `firmness`.

## Known issues

- A child must be a real child body built with `upscale` (`docs/PEOPLE.md`), as `student2020` is. Kendal's `boy.json` and `girl.json` are the models to start from.
- A woman's apron lies on her skirt and hangs to near its hem (fixed 15 November 2026).
- Still to make: the UNIA uniform (from chapter 6), the Black Cross Nurses' dress, women's hats for this game's women, and a teen body for the young hero.
- The preview makes deep skin tones look darker than the game does. Check them in the game with `?test=skin` (`docs/PIPELINE.md`, "Skin").
- `?test=cloth` printed 7 issues (49 points) on 14 November 2026: trousers through the jacket hem when sitting (`delegate1920`, `garvey1914`, `garvey1916`, `hl_critic`) and a few points at a shirt's waist (`nb_youth`, `student2020`).
