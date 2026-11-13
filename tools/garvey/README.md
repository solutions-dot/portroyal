# Garvey-era characters (about 1900 to 1930)

Status: working. Used for every Garvey character so far, in `people/`: the printer and customer (chapter 1), Garvey, Amy Ashwood and three neighbours (chapter 2), Garvey in street clothes and three Harlem people (chapter 3), a pressman and a seaman (chapter 4), a clerk and an engineer (chapter 5), and a nurse, a traveller and a steward (chapter 6). `era.py` is a copy of `tools/people/npc.py` with extra garments. Port Royal's `npc.py` has changed since (the neckcloth and coat-skirt fixes); folding the two together is a tidy-up for later.

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
| `jacket` | A suit jacket with a V opening, waist-length, sleeves to the wrist (colour key `Jacket`; `jacketsleeve` sets how far down the arm) |
| `bun` | Hair gathered into a bun |
| `smooth` | Smooths the cut edges of a man's shirt (neckline and sleeves). Used for the pressman and the seaman. |

Women use the body macros `gender: 0.0`, `cupsize` and `firmness`, as in `tools/blender/abba.py`.

## Known issues (to fix before use in a game)

- The waistcoat is a plain panel with no V opening (the jacket has one).
- A very young or very short body (age below about 0.3) leaves skin strips down the trouser legs; use proportions like `printer1907.json`.
- A woman's apron does not fit over a skirt (it is cast onto the body, not the skirt).
- Still to make: women's hats, the UNIA uniform (from chapter 6), the Black Cross Nurses' dress, and a teen body for the young hero.
- The preview makes deep skin tones look very dark. Check them under the game's own lighting.
