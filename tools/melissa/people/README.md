# Melissa 2025: character recipes

Follows `docs/PEOPLE.md` (on `main` since PR 50). Every recipe sets `era`, `hat` as `[kind, material]` pairs, a `collar` kind and `colors` for each garment.

## Status: recipes written, bodies NOT built yet

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
