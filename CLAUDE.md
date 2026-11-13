# History Games: start here

This repository holds a family of educational 3D history games for the web, built on one shared engine.

- **Port Royal 1690** (`games/port-royal/`) is finished and live. It follows Lewis Galdy through Port Royal, Jamaica, from 1690 to the 1692 earthquake.
- **Marcus Garvey** (`games/garvey/`) has all eight chapters playable, from a Kingston print shop about 1908 to National Heroes Park today. It is new, so expect polish work. Read `docs/games/garvey.md` first.
- **Kendal 1957** (`games/kendal/`) tells the story of Jamaica's railway and the Kendal train crash of 1957 in seven chapters. It is new, so expect polish work. Read `docs/games/kendal.md` first.
- New games start from `games/_template/`.

Audience: **children aged 6 and up, plus adults**. Every choice follows from that.

## Read these before changing anything

| If you are... | Read |
|---|---|
| New to the repo | `docs/ARCHITECTURE.md` (layout, how a game runs, the build) |
| Using shared code (animation, sound, loading) | `docs/ENGINE.md` |
| Making characters, animations, buildings or packed models | `docs/PIPELINE.md` |
| Writing dialogue, goals, journal pages, chapters | `docs/CONTENT.md` |
| Checking your work | `docs/TESTING.md` |
| Publishing the game or pushing code | `docs/PUBLISHING.md` |
| Starting a new game | `docs/NEW_GAME.md` |
| Working on Marcus Garvey | `docs/games/garvey.md` |
| Working on Port Royal | `docs/games/port-royal.md` |
| Working on Kendal 1957 | `docs/games/kendal.md` |

## Rules the owner has set (follow them every time)

1. **No em dashes** in any writing: code comments, dialogue, docs, commit messages, replies.
2. **Plain words for ages 6+.** Dialogue lines are short, about 12 words or fewer, one idea each. Goals are one short sentence. Harder detail goes in the journal's "Dig deeper" section.
3. **Historically accurate.** Check facts against sources before writing them. Made-up characters are fine, but say so in their journal page ("X in this game is made up"). Never invent quotes for real people or make up historical claims. When the game shows something real, such as a tombstone inscription, use the real wording.
4. **Difficult history is told honestly and gently**: slavery, violence, disaster. Fights happen in the background, nobody falls down dead, and nothing is graphic.
5. **Everything must work on phones**: touch joystick, drag to look, tap people to talk. Check with the phone layout.
6. **Check your work before calling it done**: build, take screenshots of what you changed, and run the autoplayer (see `docs/TESTING.md`).
7. **Git**: commit as `M Squared <msquared.mail@gmail.com>` and add the attribution trailer the session asks for. Work on a branch, open a PR, and merge to `main` when the owner asks.
8. **Run the automatic audits and fix everything they report, in every game.** Spotting floating signs and lamps, people stuck in walls, held items that cut through a body, people standing inside each other, seated people whose seat cuts through them or who sit on nothing, and text that overlaps one by one does not scale. `engine/audit.js` and the layout test find them for you. Every game wires them into its dev build (`?test=audit`, `?test=held`, `?test=layout`; see `docs/TESTING.md`, section 5) and every place must report **0 issues** before work is called done. A new game wires them before its first PR. When you find a new kind of mistake by eye, add a check for it to the audit, then fix it.

## Quick commands

```bash
npm install                                 # three.js, esbuild, gltf-transform
node tools/build.mjs port-royal --dev       # build with test views and the autoplayer
node tools/build.mjs port-royal             # public build (no test code)
python3 -m http.server 8765                 # serve the repo root
# then open http://localhost:8765/menu/ or http://localhost:8765/games/port-royal/site/
```
