# History Games: start here

This repository holds a family of educational 3D history games for the web, built on one shared engine.

- **Port Royal 1690** (`games/port-royal/`) is finished and live. It follows Lewis Galdy through Port Royal, Jamaica, from 1690 to the 1692 earthquake.
- **Marcus Garvey** (`games/garvey/`) has all eight chapters playable, from a Kingston print shop about 1908 to National Heroes Park today. It is new, so expect polish work. Read `docs/games/garvey.md` first.
- **Kendal 1957** (`games/kendal/`) tells the story of Jamaica's railway and the Kendal train crash of 1957 in seven chapters. It is new, so expect polish work. Read `docs/games/kendal.md` first.
- **Bog Walk 1904: The Tube** (`games/bog-walk/`) tells the story of the night in June 1904 when water came into the huge pipe that fed Kingston's tram power station. All six chapters are playable, from the station and the electric tram to the Tube, the water, the morning after and the Tube today. Read `docs/games/bog-walk.md` first.
- **Nanny Town 1734: The Narrow Path** (`games/nanny/`) tells the story of Nanny of the Windward Maroons and her town in the Blue Mountains, from a night walk to freedom about 1730 to the land paper of 1740, in six chapters. It is new, it uses stand-in character bodies, and it has not yet been reviewed by the Moore Town Maroons. Read `docs/games/nanny.md` first: it has rules of its own (Nanny never speaks, nothing sacred is shown).
- **Tivoli** (`games/tivoli/`) is the story of Tivoli Gardens, West Kingston, from the 1960s to today, with the May 2010 security operation at the centre. It is on the menu (the owner's choice, 14 November 2026) but still early: some poses are stand-ins. It is the hardest subject here: read `docs/games/tivoli.md` before changing anything.
- **Hurricane Melissa** (`games/melissa/`) follows a made-up family through Hurricane Charlie (1951), Hurricane Gilbert (1988) and Hurricane Melissa (2025) in seven chapters. It is new and still uses stand-in bodies. Read `docs/games/melissa.md` first.
- **The Emperor's Arrival, 1966** (`games/selassie/`) follows Ruth, a fictional Kingston girl, to Haile Selassie I's arrival at Palisadoes Airport on 21 April 1966, in six chapters. It is new and not yet reviewed. Read `docs/games/selassie.md` first: Haile Selassie I and Mortimo Planno have no invented words.
- **Eventide Home** (`games/eventide/`) is an early game set at the Eventide Home in Kingston, 1980.
- **Windrush: Two Places Called Home** (`games/windrush/`) follows a fictional family between Jamaica and England, 1948 to 2018, in eight chapters. Read `docs/games/windrush.md` first. It is new and awaits independent review.
- New games start from `games/_template/`.

Audience: **children aged 6 and up, plus adults**. Every choice follows from that.

## Read these before changing anything

| If you are... | Read |
|---|---|
| New to the repo | `docs/ARCHITECTURE.md` (layout, how a game runs, the build) |
| Using shared code (animation, sound, loading) | `docs/ENGINE.md` |
| Making or fixing people, clothes, places or animations in any game, or bringing one game up to the standard (checklist and each game's status) | `docs/STANDARD.md` |
| Adding or changing people in any game (the standard every game follows) | `docs/PEOPLE.md` |
| Making characters, animations, buildings or packed models | `docs/PIPELINE.md` |
| Writing dialogue, goals, journal pages, chapters | `docs/CONTENT.md` |
| Checking your work | `docs/TESTING.md` |
| Publishing the game or pushing code | `docs/PUBLISHING.md` |
| Starting a new game | `docs/NEW_GAME.md` |
| Working on Marcus Garvey | `docs/games/garvey.md` |
| Working on Port Royal | `docs/games/port-royal.md` |
| Working on Kendal 1957 | `docs/games/kendal.md` |
| Working on Bog Walk 1904 | `docs/games/bog-walk.md` |
| Working on Nanny Town 1734 | `docs/games/nanny.md` |
| Working on Eventide Home | `docs/games/eventide.md` |
| Working on The Emperor's Arrival, 1966 | `docs/games/selassie.md` |
| Working on Windrush | `docs/games/windrush.md` |
| Working on the menu, the intro, or the platform name and idea | `docs/PLATFORM.md` |
| Working on Hurricane Melissa | `docs/games/melissa.md` |
| Working on Tivoli | `docs/games/tivoli.md` |

## Rules the owner has set (follow them every time)

1. **No em dashes** in any writing: code comments, dialogue, docs, commit messages, replies.
2. **Plain words for ages 6+.** Dialogue lines are short, about 12 words or fewer, one idea each. Goals are one short sentence. Harder detail goes in the journal's "Dig deeper" section.
3. **Historically accurate.** Check facts against sources before writing them. Fictional characters are fine, but say so in their journal page ("X in this game is fictional"). Never make up historical claims or famous quotes. Real people may say imagined everyday words that complete a scene and keep it logical (owner, 16 Nov 2026), if the words fit the facts and what is known of the person, and their journal page says their words in the game are imagined. Marcus Garvey says only his real, sourced words. Game rules stay: Nanny never speaks, and Haile Selassie I and Mortimo Planno have no invented words. When the game shows something real, such as a tombstone inscription, use the real wording. **This covers how things look too** (owner, 17 Nov 2026): a real ship, building, vehicle, uniform or market stall is modelled on sources for that very thing (a photograph, a plan, a written account), not on a generic stand-in. If a stand-in cannot be avoided yet, say so in the game's doc and list it as work to do.
4. **Difficult history is told honestly and gently**: slavery, violence, disaster. Fights happen in the background, nobody falls down dead, and nothing is graphic. **One exception, Tivoli only** (`docs/games/tivoli.md`): its May 2010 chapters may show police, soldiers and gunmen shooting and taking cover, as a directed scene seen from a safe place, behind an opt-in card with a "Read what happened instead" choice. No one is hit, there is no blood, and the player never holds or fires a weapon.
5. **Everything must work on phones**: touch joystick, drag to look, tap people to talk. Check with the phone layout.
6. **Check your work before calling it done**: build, take screenshots of what you changed, and run the autoplayer (see `docs/TESTING.md`).
7. **Git**: a Claude session commits as `Claude <noreply@anthropic.com>` (owner, 17 Nov 2026: so GitHub shows the commits as verified) and adds the attribution trailer the session asks for. The owner's own commits are `Johnathon Kelly <msquared.mail@gmail.com>`. Work on a branch, open a PR, and merge to `main` when the owner asks.
8. **Run the automatic audits and fix everything they report, in every game.** Spotting floating signs and lamps, people stuck in walls, held items that cut through a body, people standing inside each other, seated people whose seat cuts through them or who sit on nothing, and text that overlaps one by one does not scale. `engine/audit.js` and the layout test find them for you. Every game wires them into its dev build (`?test=audit`, `?test=held`, `?test=layout`; see `docs/TESTING.md`, section 5) and every place must report **0 issues** before work is called done. A new game wires them before its first PR. When you find a new kind of mistake by eye, add a check for it to the audit, then fix it.
9. **Skin must read clearly in every light.** Faces were coming out too dark. Build each character's `Skin` colour inside the range Marcus Garvey uses, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, and lighten the skin material in the game as Kendal does (`SKIN_LIGHT = 1.55` in `games/kendal/src/main.js`), so faces still show at night, indoors and by firelight. Judge skin in a game screenshot, not in the Blender preview, which makes it look darker. If a face still looks too dark, lighten it. Details in `docs/PIPELINE.md`.

10. **Fix it in the master engine, not game by game** (owner, 17 Nov 2026). When a fault can happen in more than one game (a head that spins, a way out offered too soon, a held item through a body, a check that is wrong), the fix goes in `engine/` and every game uses it. Do not copy a guard or a rule into a game's own file. If a game still carries its own copy of something the engine does, move it over when you touch it, and say so in `docs/ENGINE.md`.

## Quick commands

```bash
npm install                                 # three.js, esbuild, gltf-transform
node tools/build.mjs port-royal --dev       # build with test views and the autoplayer
node tools/build.mjs port-royal             # public build (no test code)
python3 -m http.server 8765                 # serve the repo root
# then open http://localhost:8765/menu/ or http://localhost:8765/games/port-royal/site/
```
