# Nanny Town 1734: character recipes

Status: **recipes only, not built yet.** The character builder (`tools/garvey/era.py`) is being rebuilt in its own pull request, so nothing here has been run through it. The game plays today with stand-in bodies borrowed from Port Royal and Kendal (see `games/nanny/src/cast.js`).

These files follow the standard in `docs/PEOPLE.md` (on the character builder's branch): a top-level `era`, hats as a list of `[kind, material]` pairs, a colour for every garment, and `Skin` inside the range Marcus Garvey uses.

| Recipe | Who it is for | Replaces the stand-in |
|---|---|---|
| `maroon_man` | Cubbenah, village men, fighters | `turtler`, `buc1` |
| `maroon_scout` | Quamin | `kofi` |
| `maroon_elder` | an old man of the town | `ned` |
| `maroon_woman` | Mama, village women, Beneba grown up | `woman_long` |
| `maroon_elder_woman` | Auntie Mimba, Mama in 1740, Nanny (seen far off only) | `woman_elder` |
| `maroon_girl`, `maroon_child`, `maroon_boy` | Beneba, Phibba, village children | `girl`, `girl_small`, `boy` |
| `redcoat` | British soldiers | `soldier` |
| `militia` | local militia | `gunner` |
| `blackshot` | the armed Black men the government hired (Dallas, 1803). Not in the game yet. | none |

## Build them (when the builder is ready)

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/nanny/people/maroon_woman.json)"
```

```bash
node tools/people/pack.mjs --src build/people --out games/nanny/site/models --lo maroon_woman
```

Then change `base` in `games/nanny/src/cast.js` (and `HATS`, `KID`) and delete the stand-in files from `games/nanny/site/models/`.

## Things the builder may need first

- **Women before 1800.** `docs/PEOPLE.md` says any era before 1800 uses the 1690 tailoring, and that tailoring has only made men so far. If a skirt and a head wrap cannot be built at era 1734, build the women and girls at era 1900 with the same keys.
- **Bare feet.** No recipe here has `shoes` or `socks`. The stand-ins wear shoes tinted to the skin, and `main.js` repaints the children's white socks as skin (`bareLegs`). Remove that code when real bodies arrive.
- **A cocked hat.** British soldiers of the 1730s wore cocked (three-cornered) hats. The builder has no such kind, so `redcoat` asks for `felt`.
- **No shirt.** The one description we have of Maroon men's dress (a Leeward captain in 1738, in Dallas) is loose drawers to the knee, a small round hat and no shirt. These recipes keep a shirt, because the builder removes the skin under clothes. A bare-chested man is a body with no `sleeve` key; try one.

## What we know about the clothes (very little)

No description of Windward Maroon dress survives, and nothing at all on women's or children's clothes. Colours here are a plain guess: undyed cloth, earth colours and indigo. The game's credits and `docs/games/nanny.md` say so.
