# Garvey-era characters (about 1900 to 1930)

Spike status: working, needs polish. `era.py` is a copy of `tools/people/npc.py` with extra garments, kept separate so the Port Royal chat's `npc.py` is untouched. Fold it back into `npc.py` after the Port Royal work has merged.

## Set up on a fresh Linux machine

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
node tools/optimize_models.mjs --dir build/people --chars printer1907 woman1914             # compress, then pack as in docs/PIPELINE.md
```

The bpy module has no Draco or meshopt, so the first `.glb` is large (about 1.5 MB). The compress step brings it to about 290 KB (printer) and 210 KB (woman).

## What `era.py` adds to `npc.py`

| Key in `garments` | What it makes |
|---|---|
| `trousers` | Long trousers to the ankle |
| `waistcoat` | A sleeveless waistcoat over the shirt (colour key `Waistcoat`) |
| `collar` | A stiff white standing collar (colour key `Collar`) |
| `tie` | A plain tie (colour key `Tie`) |
| `hat: "flat"` | A flat cap with a short peak |
| `woman` | The blouse follows the figure instead of a man's shirt drape |
| `highneck` | A high-necked blouse |
| `skirt` | A long skirt that hangs from both legs (colour key `Skirt`) |
| `bun` | Hair gathered into a bun |

Women use the body macros `gender: 0.0`, `cupsize` and `firmness`, as in `tools/blender/abba.py`.

## Known issues (to fix before use in a game)

- The waistcoat's top and armhole edges are ragged.
- The flat cap looks like a flared pillbox. It needs a rounded, slouchy crown.
- The collar looks like a small flap.
- Not yet tried in a game with the walk and talk clips.
- Still to make: a suit jacket, women's hats, the UNIA uniform, the nurses' dress, and a teen body for the young hero.
- The preview makes deep skin tones look very dark. Check them under the game's own lighting.
