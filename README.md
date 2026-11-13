# History Games

Educational 3D history games for the web, for children aged 6 and up and for adults. They run in a phone, tablet or desktop browser. Every game shares one engine: animations, sounds, model loading, the character generator and the build.

| Game | Folder | Status |
|---|---|---|
| **Port Royal, 1690**: the story of Lewis Galdy, from his arrival to the 1692 earthquake and after | `games/port-royal/` | finished and live |
| **Marcus Garvey** | all eight chapters playable (Kingston 1908, Kingston 1914, Harlem 1916, a press room 1918, a dock 1919, Liberty Hall 1920, Amy Jacques Garvey's desk 1925, and Kingston today) | new, still being polished (see `docs/games/garvey.md`) |

The home page (`menu/index.html`) lists the games.

## Start here

New to the repo, or starting a new chat? Read `CLAUDE.md`, then the guide for what you are doing:

| If you are... | Read |
|---|---|
| New to the repo | `docs/ARCHITECTURE.md` |
| Using shared code (animation, sound, loading) | `docs/ENGINE.md` |
| Making characters, animations, buildings or packed models | `docs/PIPELINE.md` |
| Writing dialogue, goals, journal pages, chapters | `docs/CONTENT.md` |
| Checking your work | `docs/TESTING.md` |
| Publishing (Vercel, the artifact) or pushing code | `docs/PUBLISHING.md` |
| Starting a new game | `docs/NEW_GAME.md` |
| Working on Port Royal | `docs/games/port-royal.md` |

## Run it

```bash
npm install
npm run build:dev    # Port Royal with test views (?shot=...) and the autoplayer (?auto=<chapter>&one)
npm run serve        # http://localhost:8765/menu/  or  http://localhost:8765/games/port-royal/site/
npm run dist         # the whole website (menu and every game, public builds) into dist/
npm run serve:dist   # check dist/ at http://localhost:8766/
```

Deploying: the repo is set up for Vercel (`vercel.json`). Import the repo in Vercel and deploy; every push to `main` updates the site. Details in `docs/PUBLISHING.md`.

## Layout

```
engine/            shared runtime code: anim.js, audio.js, loader.js
games/port-royal/  src/main.js (the game), site/ (index.html, app.js, models/), assets/ (source .glb)
games/_template/   a small working starter for a new game
menu/              the home page that lists the games
shared/            the animation library, the character rig, the Mixamo sources
tools/             build.mjs, dist.mjs, the character generator (people/), animation retargeting (anims/), Blender scripts
docs/              the guides listed above
```

# Port Royal, 1690

## Chapters

| Year | Chapter | What happens |
|---|---|---|
| 1690 | Arrival | Step off the ship, meet Abba, buy stew at The Turtle, find four objects, hear Ned's story, walk to the fort, explore the market street |
| 1670 | Ned's story | A flashback: Henry Morgan, the buccaneers' articles, a sword drill, loading the ships |
| 1691 | The warehouse | Check cargo, make change, weigh a clipped coin, read a letter from a slave ship's captain |
| 7 June 1692 | The earthquake | The town sinks into the sand; swallowed, thrown into the sea, rescued |
| 1692 | The days after | The survivors' camp; stay or leave for what becomes Kingston |
| 1739 and today | The tombstone | St Peter's Church and Galdy's tomb |

Progress saves in the browser. Teachers can open all chapters from the Chapters menu.

## What is history and what is invented

**From the record:** Galdy's birth in Montpellier in 1659, his flight as a Huguenot, being swallowed and thrown into the sea in 1692, his rescue by boat, his trade in wine, cocoa and enslaved people as an agent of the Asiento, his seats in the Assembly, his work on St Peter's Church (1726), his death in 1739 and the tomb's move in 1953. Also the brick houses of up to four storeys, the brick floors, pewter, clay pipes and bottles found by archaeologists, the watch stopped at 11:43, liquefaction of the sand, and the minister preaching in a tent.

**Invented:** Abba and her tavern The Turtle, old Ned, Kofi, Sam, the gunner, the soldier, the market street's people (Grace, Peter, Daniel Mendes, Constable Hart), the customer and prices in the warehouse, the captain's letter, who was in the boat that saved Galdy, the camp layout, and all dialogue. The journal says so on each relevant page.

## Sources

- Galdy's tomb inscription, St Peter's Church, Port Royal
- Frank Cundall, *Historic Jamaica* (1915)
- Donny Hamilton and the Texas A&M Port Royal excavations
- Rev. Emmanuel Heath, letters on the earthquake (1692)
- John Taylor's description of Port Royal (1687 to 1688): markets, prices, turtles
- The 1677 deed for a synagogue on New Street (Jew Street); histories of Jamaica's Jews (for example Arbell, 2000)
- Alexandre Exquemelin, *The Buccaneers of America* (1678)
- National Geographic, "How the 'wickedest city on Earth' was sunk by an earthquake"
- Jamaica Gleaner, "Lewis Galdy cheated death twice" (2024)

## Notes for contributors

- Peter Dunn's reconstruction paintings and the UCLA Cultural Virtual Reality Lab model were used as visual reference only and are not included.
- Animations come from Mixamo. The source files are in `shared/anim-sources/` and are retargeted into one shared library (`shared/models/anims.js`); see `docs/PIPELINE.md`.
- The script has not yet been reviewed by a historian. Please have it checked before classroom use.
