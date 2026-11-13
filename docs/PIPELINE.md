# Asset pipeline

Everything runs from the repo root. Scratch output goes to `build/` (git-ignored).

## Setup (once per machine)

- **Node 20+**: run `npm install` (three, esbuild, @gltf-transform/*).
- **Blender as a Python module**: `pip install bpy==5.3.0` (needs Python 3.13).
- **MPFB** (MakeHuman for Blender): install the extension into Blender 5.3. Scripts enable it as `bl_ext.user_default.mpfb`.
- **MakeHuman data**, for eyes and helper meshes: `git clone https://github.com/makehumancommunity/makehuman /tmp/mh`. Then set `MAKEHUMAN=/tmp/mh/makehuman`, or keep that default path.
- **Headless Chrome**, for tests (see TESTING.md).

## 1. Characters (men): `tools/people/npc.py`

Each character is one JSON file in `tools/people/`. The script builds a MakeHuman body, cuts clothes from helper meshes, paints vertex colours, rigs it with the shared Mixamo skeleton and writes `<name>.glb`.

```bash
python3 tools/people/npc.py "$(cat tools/people/mendes.json)"      # writes games/port-royal/site/models/mendes.glb
NPC_OUT=games/garvey/site/models/ python3 tools/people/npc.py "$(cat tools/people/x.json)"   # another game
python3 tools/people/preview_heads.py turtler,mendes,constable       # renders build/heads.png to check
python3 tools/people/preview_body.py buc1,ned                        # build/front.png and build/back.png
```

JSON fields:
- `name`
- `body`: MakeHuman macros 0 to 1: `gender` (1 is male), `age`, `muscle`, `weight`, `height`, `proportions`, `african`, `caucasian`, `asian`.
- `garments`:

  | Key | Values |
  |---|---|
  | `sleeve` | 0 to 1, how far down the arm |
  | `coat` | `true` |
  | `coatsleeve` | 0 to 1 |
  | `coathem` | skirt length above the knee, for example 0.02 to 0.06 (longer skirts clip the knees when walking) |
  | `coatopen` | `true` by default: the skirt is open at the front below the waist, as 1690 coats were, so the legs pass through when walking. Set `false` for a closed skirt. There is also a vent up the back. The front panels follow their own thigh and the back follows the hips, so walking does not push the legs through the cloth (check with `?shot=gwalk&clip=Walk&cam=front`, and `&who=soldier` for the soldier) |
  | `breeches` | `true` |
  | `breechkind` | `"slops"` for wide sailor breeches |
  | `shoes`, `stockings`, `apron` | `true` |
  | `hat` | `"felt"` (fitted to the head) or `"cap"` |
  | `bands` | `true` gives a cravat |
  | `hairvol` | 0 to 1 |

- `colors`: RGB for Skin, Shirt, Coat, Breeches, Stockings, Shoes, Hat, Hair, Apron, Bands. Every garment you use needs its colour, or the script stops with a KeyError.

Built in for realism:
- Shirts and coats drape flat from the chest.
- Shirts tuck in under breeches.
- Breeches don't balloon at the seat.
- Felt hats are measured to each head.

Then compress and pack (step 4).

**Women**: `npc.py` makes men only. Abba comes from `tools/blender/abba.py` (MPFB body, bodice, skirt, apron, head wrap). Grace in Port Royal is Abba recoloured in code, with a different shape and a basket on her head. A new game with many women should extend `npc.py` with skirt, bodice and dress garments, following `abba.py`.

**Clothes from other eras**: `npc.py` garments are 1690 styles. For the Garvey era (about 1900 to 1940) add: trousers (long breeches), a suit jacket (shorter coat with lapels), a collar and tie, a waistcoat, a peaked cap, a bowler or homburg hat, women's long dresses and blouses. Add each as a new `piece(...)` cut from the MakeHuman helper meshes, the same way the coat and breeches are made.

## 2. Animations: `tools/anims/`

All clips are retargeted onto one rig (`shared/rig/char.blend`), so they play on every character.

1. Download from mixamo.com:
   - upload any of our characters (for example `games/port-royal/assets/characters/galdy.glb` exported as FBX), or use the default;
   - pick the clip, tick **In Place** for anything that walks;
   - download **FBX, Without Skin**.
2. Put it in `shared/anim-sources/` and add `"ClipName": "File.fbx"` to `tools/anims/clips.json`.
3. Retarget and bake all clips:
   ```bash
   timeout 3000 python3 tools/anims/retarget_clips.py tools/anims/clips.json   # writes build/anims.glb (long: about 30 to 50 minutes)
   ```
   This copies world rotations bone by bone, plus the hips position, so clips made on other bodies keep good poses on ours.
4. Optimise: `node tools/anims/optimize_clips.mjs`.
   - It drops scale tracks, moving-root tracks and fingers 2 to 4, resamples, and compresses with meshopt.
   - Its `UNUSED` set removes clips no game uses; keep it in step with what games call.
   - Check the input and output paths at the top of the file.
5. Pack it as `shared/models/anims.js` (step 4) and rebuild the games.

## 3. Buildings, ships, textures: `tools/blender/`

- `street.py`, `variant.py` with `variants.json`: the six 1690 town houses (`h1` to `h6`), with brick, plaster, timber and clay-tile materials.
- `ships.py`: the merchant ship and the sloop, with flags.
- `tex.py`, `tex2.py`: the town texture atlas (`tex_town`) and the harbour textures (`tex_harbour`).

In the game, `TEXMAP` maps material names (Brick, Stone, ClayTile, Wood, Plaster, LeadedGlass, Hull, Deck, Sail, Flag...) to these textures. New buildings made in code can borrow them: see `houseMat()` and `worldUV()` in Port Royal's second street.

## 4. Compress and pack models

```bash
node tools/optimize_models.mjs --dir games/port-royal/site/models --chars mendes turtler   # writes mendes.m.glb and turtler.m.glb (uses shared/rig/eye_small.jpg for the eyes; without it a character packs to over 1 MB)
python3 tools/pack_models.py ...                                                           # or the one-liner below
for n in mendes turtler; do printf '(window.__models=window.__models||{})["%s"]="%s";' $n "$(base64 -w0 games/port-royal/site/models/$n.m.glb)" > games/port-royal/site/models/$n.js; done
```

Only the `.js` files are loaded by the game. Keep each character at roughly 300 to 400 KB packed.
