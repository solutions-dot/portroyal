# Melissa 2025: character recipes

Follows `docs/PEOPLE.md` (on `main` since PR 50). Every recipe sets `era`, `hat` as `[kind, material]` pairs, a `collar` kind and `colors` for each garment.

## Status, 25 November 2026: built, in modern clothes, and in the game

The owner asked for a modern wardrobe in this game too ("we need the wardrobe upgrade for hurricane melissa too as that is modern clothes"). The six recipes were rewritten in the clothes of their year and a seventh added, then built with `tools/melissa/build-people.mjs` (each body and a light `_lo` copy, every garment its own material so `cast.js` can recolour it):

| Recipe | Clothes | Used for |
|---|---|---|
| `man1988` | polo shirt tucked into high-waisted jeans, belt, white sneakers; a cap or a straw hat | Dad (1988), men in 1988 crowds |
| `woman1988` | top tucked into belted high-waisted jeans, white sneakers | Mama (1988), women in 1988 crowds |
| `man2025` | loose T-shirt over jeans, white sneakers, a fine chain (hidden on some), a baseball cap or a straw hat | Mr. Raymond, the sawman, the lineman, men in crowds |
| `polo2025` | striped polo worn out over jeans, white sneakers, a baseball cap (its shirt is never recoloured: that would hide the stripes) | Jordan, young men in crowds |
| `woman2025` | loose top over jeans, sandals, a fine chain | Mum, Miss Bev, Simone, Miss Campbell, women in crowds |
| `elderman2025` | polo shirt tucked into slacks, belt, sneakers; a cap or a straw hat | Grandpa, Mass Clifford (1988), older men |
| `elderwoman2025` | blouse tucked into slacks, sandals; a head tie or a hat | Gran, Miss Hyacinth, older women |

Still borrowed: the children (`boy`, `girl`, `girl_small`), the 1951 people (Kendal's 1950s bodies, right for their time), Pastor Gayle (`man_shirt`, a shirt and tie), the soldier (`man_work` in olive), Andre (`student2020`).

## Before (kept for the record): recipes written, bodies NOT built yet

MakeHuman and Blender are not in the container this game was started in, so `tools/garvey/era.py` could not run. Until these six are built and packed, the game uses bodies already built for Kendal 1957 and copied into `games/melissa/site/models/` (allowed by `PEOPLE.md` section 2: a body used by two games is built once and copied). Colours are set per person in `games/melissa/src/cast.js`.

| Recipe (to build) | Stand-in used now | Used for |
|---|---|---|
| `man2025` | `man_work` | Mr. Raymond, the sawman, the lineman, the soldier (olive colours), men in crowds |
| `woman2025` | `woman57` | Mum, Miss Bev, women in crowds |
| `elderwoman2025` | `woman_elder` | Gran, Miss Hyacinth |
| `elderman2025` | `man_elder` | Grandpa |
| `man1988` | `man_work` | Dad (1988), Mass Clifford (1988) |
| `woman1988` | `woman57` | Mama (1988) |

Reused as they are (built for other games): `boy`, `girl`, `girl_small` (children, `tools/kendal/people/`), `guide2020` and `student2020` (people of today, `tools/garvey/people/`), `man_shirt` (Pastor Gayle).

Stand-in differences to fix when the real bodies exist: the Kendal bodies wear 1950s cuts (long sleeves, a waistcoat that the game hides, a belt, a collar on the shirt). The 2025 and 1988 recipes use short sleeves, no waistcoat and a plain top.

## Build (where MakeHuman and Blender exist)

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/melissa/people/man2025.json)"
node tools/people/pack.mjs --src build/people --out games/melissa/site/models --lo man2025
```

Then point the looks in `games/melissa/src/cast.js` at the new body ids, and run `?test=audit`, `?test=held`, `?test=layout`, `?test=cloth`, `?test=walkers` and `?test=skin` (see `docs/PEOPLE.md` section 5). These recipes have not been run through `era.py`: check the clothes in close screenshots before trusting them.

## Hurricane Charlie, 1951 (chapter 1)

The people of 1951 (`papa51`, `mama51`, `cyril`, `ivy51` in `cast.js`) use the Kendal bodies `man_work`, `woman57`, `man_elder` and `woman_elder` as they are: those bodies were built for the 1950s, so no new recipe is needed for them. Check their clothes against 1951 photographs when the bodies are reviewed (a general picture of the 1950s, not copied from photographs). `docs/STANDARD.md` (section 1) says a body may be shared only if it was made for the same period and the same kind of person, and its table lists borrowing as a gap: decide with the owner whether the 1951 people get recipes of their own (`era: 1951`) once the builder fix lands.

## Building where GitHub is blocked (trial run, 15 November 2026)

`docs/PIPELINE.md` says to `git clone` MakeHuman, which fails where GitHub is blocked. Everything `era.py` needs was reachable another way. **Nothing from this trial was kept in the game:** the owner put the bodies on hold (build none until the builder fix lands on `origin/main`, then follow `docs/STANDARD.md`). These are the steps and what they showed, for whoever builds them.

1. Blender as a module: `uv venv --python 3.13 ~/venv && uv pip install --python ~/venv/bin/python bpy==5.3.0` (PyPI).
2. MPFB 2.0.18 from the Blender extensions site (`https://extensions.blender.org/api/v1/extensions/`, find `mpfb`, download its `archive_url` with `curl -L`, sha256 `c075b3e9b94b8e5556a5f03f4653602d02ea306de08126e8f55ed6dee28a2dad`). Unzip it into `~/.config/blender/5.3/extensions/user_default/mpfb/`. `era.py` then enables it as `bl_ext.user_default.mpfb`.
3. The eye mesh `era.py` reads from `$MAKEHUMAN/data/eyes/low-poly/`: it is in the MakeHuman system assets (CC0), `https://files.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip` (about 280 MB). Unzip it into `/tmp/mh/makehuman/data/` and set `MAKEHUMAN=/tmp/mh/makehuman`. (The `makehuman` wheel on PyPI does not contain the eyes.)
4. Hosts a sandbox must allow: `extensions.blender.org`, `files.makehumancommunity.org` (and `static.makehumancommunity.org` to read the pack's page). `github.com` was not needed.
5. Then the two commands above build and pack: about 3 seconds a body, all six inside the budgets (25,500 to 26,500 triangles, 375 to 400 KB full; 6,000 to 6,200 triangles light).

What the six showed in the game's own checks (a trial in the working tree, not committed): `?test=held` 0, `?test=walkers` 0, `?test=skin` every face inside the rule 9 range once `Hair` is no longer multiplied, `?test=cloth` 0 for four of the six as written. The two elders needed small recipe changes to reach 0 in `?test=cloth`: `elderwoman2025` with `"collar": "round"` and `"sleeve": 0.4` (no collar left skin showing at the back of the neck), and `elderman2025` with `"sleeve": 0.5` (0.3, 0.4 and 0.6 each left a fault of 2 to 17 mm in the light copy or the sitting pose; the result moves with `sleeve`, so recheck after any change). The recipes in this folder are still the originals.

