# PastPort - Jamaica

Educational 3D history games for the web, for children aged 6 and up and for adults. They run in a phone, tablet or desktop browser. Every game is built on one shared engine (`engine/`): animation, sound, loading, controls, cinematics, chapter cards and the automatic checks. The home page (`menu/index.html`) lists the games under the platform name **PastPort - Jamaica** (`docs/PLATFORM.md`).

## The games

| Game | Folder | Status | Read first |
|---|---|---|---|
| **Port Royal 1690**: Lewis Galdy, from 1690 to the 1692 earthquake and after | `games/port-royal/` | finished and live | `docs/games/port-royal.md` |
| **Nanny Town 1734: The Narrow Path**: Nanny of the Windward Maroons, about 1730 to 1740, six chapters | `games/nanny/` | new, stand-in bodies, not yet reviewed by the Moore Town Maroons | `docs/games/nanny.md` |
| **Bog Walk 1904: The Tube**: the night water came into the pipe that fed Kingston's tram power station, six chapters | `games/bog-walk/` | all chapters playable | `docs/games/bog-walk.md` |
| **Marcus Garvey**: a Kingston print shop about 1908 to National Heroes Park today, eight chapters | `games/garvey/` | all chapters playable, being polished | `docs/games/garvey.md` |
| **Windrush: Two Places Called Home**: a fictional family between Jamaica and England, 1948 to 2018, eight chapters | `games/windrush/` | new, awaits independent review | `docs/games/windrush.md` |
| **Kendal 1957**: Jamaica's railway and the Kendal train crash, seven chapters | `games/kendal/` | new, being polished | `docs/games/kendal.md` |
| **The Emperor's Arrival, 1966**: Ruth, a fictional Kingston girl, at Haile Selassie I's arrival, six chapters | `games/selassie/` | new, not yet reviewed | `docs/games/selassie.md` |
| **Eventide Home, 1980**: the Eventide Home in Kingston and the fire | `games/eventide/` | early | `docs/games/eventide.md` |
| **Tivoli**: Tivoli Gardens, West Kingston, from the 1960s to today, with May 2010 at the centre | `games/tivoli/` | early, some stand-in poses; the hardest subject here | `docs/games/tivoli.md` |
| **Hurricane Melissa**: a fictional family through Charlie (1951), Gilbert (1988) and Melissa (2025), seven chapters | `games/melissa/` | new, stand-in bodies | `docs/games/melissa.md` |

A new game starts from `games/_template/` (`docs/NEW_GAME.md`).

## Start here

Read `CLAUDE.md` first. It has the owner's rules (plain words for ages 6+, no em dashes, history checked against sources, gentle telling of hard history, phones first, fix it in the engine) and the table of which guide to read for what you are doing. The main guides:

| If you are... | Read |
|---|---|
| Picking up open work | `docs/TODO.md` |
| New to the repo | `docs/ARCHITECTURE.md` |
| Using shared code | `docs/ENGINE.md` |
| Bringing a game up to the standard (navigation, controls, cinematics, chapter cards, people) | `docs/STANDARD.md` |
| Adding or changing people | `docs/PEOPLE.md` |
| Making characters, animations, buildings or packed models | `docs/PIPELINE.md` |
| Writing dialogue, goals, journal pages, chapters | `docs/CONTENT.md` |
| Checking your work | `docs/TESTING.md` |
| Publishing or pushing code | `docs/PUBLISHING.md` |
| Working on the menu, the intro or the platform name | `docs/PLATFORM.md` |

## What every game does the same way

Players move between games, so they all play alike (`docs/STANDARD.md`):

- **Title screen**: Start (or Continue), Chapters, Exit.
- **In play**: Exit sits to the right of the Journal button and asks "are you sure". Touch joystick, drag to look, tap a person to talk.
- **Cinematics** (scenes you watch, such as the earthquake, the fire, the crash or the arrival): only a faded X to skip shows. The Journal, Exit and other buttons hide until the scene ends. Before each one, a card says what happens (and, if it may be scary, "It may be scary. Nobody is hurt on the screen.") with "Watch scene" and "Read what happened instead" (`engine/scene-warning.js`).
- **Chapter title cards** have no X.
- **End of a chapter**: after a short pause on a clear screen, a "Chapter N is finished" card offers the next chapter. There is no "Stay here" (`engine/chapter-end.js`).

## Run it

```bash
npm install
node tools/build.mjs <game> --dev    # a game with test views (?test=..., ?shot=...) and the autoplayer (?auto=<chapter>)
node tools/build.mjs <game>          # the public build, no test code
npm run serve                        # http://localhost:8765/menu/  or  http://localhost:8765/games/<game>/site/
npm test                             # the regression tests and the content lint
node --test tests/*.mjs              # every test file
npm run dist                         # the whole website (menu and every game, public builds) into dist/
npm run serve:dist                   # check dist/ at http://localhost:8766/
```

`<game>` is a folder name in `games/`, for example `port-royal`, `garvey` or `kendal`. Deploying is through Vercel (`vercel.json`); every push to `main` updates the site. Details in `docs/PUBLISHING.md`.

## Layout

```
engine/            shared runtime: animation, audio, loading, controls, cinematics, chapter cards, audits
games/<game>/      src/ (the game), site/ (index.html, app.js, models/), assets/ (source models)
games/_template/   a small working starter for a new game
menu/              the PastPort home page that lists the games
shared/            the animation library, the character rig, the Mixamo sources
tools/             build.mjs, dist.mjs, the character generator, animation retargeting, Blender scripts
tests/             node tests (npm test, node --test tests/*.mjs)
docs/              the guides above, docs/games/ (one per game), reviews and plans
```

Each game's history, sources and which characters are fictional are in its page in `docs/games/`.
