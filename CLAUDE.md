# History Games: start here

This repository holds a family of educational 3D history games for the web, built on one shared engine.

All ten games are **live** (owner, 21 November 2026), so every change reaches real players. Since then five more have joined the menu (The Mad Master of Edinburgh Castle, The Shark Papers, The White Witch of Rose Hall, Morant Bay and Air Jamaica), so all fifteen are live. Where a game below is called new, read it as: newer, still being polished. `README.md` has the status of every game in one table.

- **Port Royal 1690** (`games/port-royal/`) is finished and live. It follows Lewis Galdy through Port Royal, Jamaica, from 1690 to the 1692 earthquake.
- **Marcus Garvey** (`games/garvey/`) has all eight chapters playable, from a Kingston print shop about 1908 to National Heroes Park today. It is new, so expect polish work. Read `docs/games/garvey.md` first.
- **Kendal 1957** (`games/kendal/`) tells the story of Jamaica's railway and the Kendal train crash of 1957 in seven chapters. It is new, so expect polish work. Read `docs/games/kendal.md` first.
- **Bog Walk 1904: The Tube** (`games/bog-walk/`) tells the story of the night in June 1904 when water came into the huge pipe that fed Kingston's tram power station. All six chapters are playable, from the station and the electric tram to the Tube, the water, the morning after and the Tube today. Read `docs/games/bog-walk.md` first.
- **Nanny Town 1734: The Narrow Path** (`games/nanny/`) tells the story of Nanny of the Windward Maroons and her town in the Blue Mountains, from a night walk to freedom about 1730 to the land paper of 1740, in six chapters. It is new, it uses stand-in character bodies, and it has not yet been reviewed by the Moore Town Maroons. Read `docs/games/nanny.md` first: it has rules of its own (Nanny never speaks, nothing sacred is shown).
- **Tivoli** (`games/tivoli/`) is the story of Tivoli Gardens, West Kingston, from the 1960s to today, with the May 2010 security operation at the centre. It is on the menu (the owner's choice, 14 November 2026), under the Mature 13+ label since 22 November 2026, but still early: some poses are stand-ins. It is the hardest subject here: read `docs/games/tivoli.md` before changing anything.
- **Hurricane Melissa** (`games/melissa/`) follows a made-up family through Hurricane Charlie (1951), Hurricane Gilbert (1988) and Hurricane Melissa (2025) in seven chapters. It is new and still uses stand-in bodies. Read `docs/games/melissa.md` first.
- **The Emperor's Arrival, 1966** (`games/selassie/`) follows Ruth, a fictional Kingston girl, to Haile Selassie I's arrival at Palisadoes Airport on 21 April 1966, in six chapters. It is new and not yet reviewed. Read `docs/games/selassie.md` first: Haile Selassie I and Mortimo Planno have no invented words.
- **The Mad Master of Edinburgh Castle, 1773** (`games/hutchinson/`) is a **Mature 13+** story: Lewis Hutchinson of St Ann, hanged at Spanish Town in 1773, told through a fictional enslaved boy, in six chapters. It is new and not yet reviewed. Read `docs/games/hutchinson.md` first: it keeps record and story apart, and Hutchinson has no words but his own couplet.
- **The Shark Papers, 1799** (`games/shark-papers/`) is an all-ages mystery in a basic first version: the papers of the brig Nancy, found inside a shark and carried to the court in Kingston, seen by a fictional ship's boy. Read `docs/games/shark-papers.md` first: Fitton's own 1835 account and his 1799 affidavit (printed in Stark's guide, 1898) have been read at source; Thompson's 1970 study has not.
- **The White Witch of Rose Hall** (`games/rose-hall/`) is a **Mature 13+** story in a basic first version: the ghost story of Annie Palmer told as a legend, then checked against the papers. Read `docs/games/rose-hall.md` first: the legend is never shown as fact, and real people appear only through quoted papers.
- **Eventide Home** (`games/eventide/`) is an early game set at the Eventide Home in Kingston, 1980.
- **Windrush: Two Places Called Home** (`games/windrush/`) follows a fictional family between Jamaica and England, 1948 to 2018, in eight chapters. Read `docs/games/windrush.md` first. It is new and awaits independent review.
- **Morant Bay, 1865** (`games/morant-bay/`, first playable build, **published on the menu** at the owner's request on 23 November 2026, still being polished) is the newest game (owner, 23 November 2026), a **Mature 13+** story of the 1865 rebellion told through a fictional girl of Stony Gut, with some violence and no blood. Research and design are done. Read `docs/games/morant-bay.md` first, then `docs/games/morant-bay/README.md`: Bogle and Gordon have no invented words and are modelled on the images the owner accepted.
- **Air Jamaica** (`games/air-jamaica/`, on the menu since 25 November 2026, still being polished) follows a fictional family and the national airline from the first flight on 1 April 1969 to the last on 30 April 2010, in six chapters (the apron and waving gallery, the DC-8 flight deck, the new colours of 1994, the flying chef, the sale, the last flight home). The DC-8 is built from the owner's 3D model (manilov.ap, CC BY 4.0, credited). Read `docs/games/air-jamaica.md` first, then `docs/games/air-jamaica/HANDOFF.md`: Chef Louis Bailey's words are imagined, and the sale is told to children in one plain idea agreed with the owner.
- **Xaymaca, 1503** (`games/xaymaca/`, first playable build, on the menu at the owner's request on 25 November 2026) is an all-ages story: a fictional Taino child of Maima, above St Ann's Bay, through the year Columbus's men were stranded there (June 1503 to June 1504), in seven chapters. It has **not yet been seen by a Taino-heritage reviewer**. Read `docs/games/xaymaca.md` first: the record is Spanish only, nothing sacred is shown, no Taino word or name is invented, and Columbus has no invented words.
- New games start from `games/_template/`.

Audience: **children aged 6 and up, plus adults**. Every choice follows from that.

## Read these before changing anything

| If you are... | Read |
|---|---|
| Picking up open work | `docs/TODO.md` (checks still open) |
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
| Working on The Mad Master of Edinburgh Castle | `docs/games/hutchinson.md` |
| Working on The White Witch of Rose Hall | `docs/games/rose-hall.md` |
| Working on The Shark Papers | `docs/games/shark-papers.md` |
| Working on the menu, the intro, or the platform name and idea | `docs/PLATFORM.md` |
| Working on Hurricane Melissa | `docs/games/melissa.md` |
| Working on Tivoli | `docs/games/tivoli.md` |
| Working on Morant Bay, 1865 | `docs/games/morant-bay.md` and `docs/games/morant-bay/README.md` |
| Working on Xaymaca, 1503 | `docs/games/xaymaca.md` (and the script, `docs/games/xaymaca/script.md`) |
| Working on Air Jamaica | `docs/games/air-jamaica.md` and `docs/games/air-jamaica/HANDOFF.md` |

## Rules the owner has set (follow them every time)

1. **No em dashes** in any writing: code comments, dialogue, docs, commit messages, replies.
2. **Plain words for ages 6+.** Dialogue lines are short, about 12 words or fewer, one idea each. Goals are one short sentence. Harder detail goes in the journal's "Dig deeper" section.
3. **Historically accurate.** Check facts against sources before writing them. Fictional characters are fine, but say so in their journal page ("X in this game is fictional"). Never make up historical claims or famous quotes. Real people may say imagined everyday words that complete a scene and keep it logical (owner, 16 Nov 2026), if the words fit the facts and what is known of the person, and their journal page says their words in the game are imagined. Marcus Garvey says only his real, sourced words. Game rules stay: Nanny never speaks, and Haile Selassie I and Mortimo Planno have no invented words. When the game shows something real, such as a tombstone inscription, use the real wording. **This covers how things look too** (owner, 17 Nov 2026): a real ship, building, vehicle, uniform or market stall is modelled on sources for that very thing (a photograph, a plan, a written account), not on a generic stand-in. If a stand-in cannot be avoided yet, say so in the game's doc and list it as work to do.
4. **Difficult history is told honestly and gently**: slavery, violence, disaster. Fights happen in the background, nobody falls down dead, and nothing is graphic. **One exception, Tivoli only** (`docs/games/tivoli.md`): its May 2010 chapters may show police, soldiers and gunmen shooting and taking cover, as a directed scene seen from a safe place, behind an opt-in card with a "Read what happened instead" choice. No one is hit, there is no blood, and the player never holds or fires a weapon. **Mature 13+** (owner, 22 November 2026): Tivoli, The Mad Master of Edinburgh Castle and The White Witch of Rose Hall sit behind the Mature 13+ label. The menu hides them in the Kids profile and its dark Mature 13+ card is the one age prompt; inside a game there is no second prompt, only a stop for a device set to Kids (`engine/mature.js`). What a Mature 13+ game may show (owner, 22 November 2026, "Bodies, no wounds"; Tivoli keeps its own rules above): dread, threat, a violent act up to the moment it happens and then a cut away, aftermath, a dead or wounded person seen still, covered or at a distance, and a little blood (a stain, a cloth). Never open wounds, gore, a close look at a body or the moment of a killing, and the player never harms anyone. Details in `docs/games/hutchinson.md`. **Morant Bay, 1865** (owner, 23 November 2026) has its own, stronger line, confirmed for that game alone and written in `docs/games/morant-bay.md`: crowds with weapons, a scuffle, a volley with people falling at a distance, burning and a flogging begun and cut away may be shown, always behind the opt-in card; blood, wounds, bodies and hangings never; the player never harms anyone. Never write "PG-13"; the label is "Mature 13+".
5. **Everything must work on phones**: touch joystick, drag to look, tap people to talk. Check with the phone layout.
6. **Check your work before calling it done**: build, take screenshots of what you changed, and run the autoplayer (see `docs/TESTING.md`).
7. **Git**: a Claude session commits as `Claude <noreply@anthropic.com>` (owner, 17 Nov 2026: so GitHub shows the commits as verified) and adds the attribution trailer the session asks for. The owner's own commits are `Johnathon Kelly <msquared.mail@gmail.com>`. Work on a branch, open a PR, and merge to `main` when the owner asks.
8. **Run the automatic audits and fix everything they report, in every game.** Spotting floating signs and lamps, people stuck in walls, held items that cut through a body, people standing inside each other, seated people whose seat cuts through them or who sit on nothing, and text that overlaps one by one does not scale. `engine/audit.js` and the layout test find them for you. Every game wires them into its dev build (`?test=audit`, `?test=held`, `?test=layout`; see `docs/TESTING.md`, section 5) and every place must report **0 issues** before work is called done. A new game wires them before its first PR. When you find a new kind of mistake by eye, add a check for it to the audit, then fix it.
9. **Skin must read clearly in every light.** Faces were coming out too dark. Build each character's `Skin` colour inside the range Marcus Garvey uses, about `[134, 90, 64]` to `[156, 108, 80]`, never darker, and lighten the skin material in the game as Kendal does (`SKIN_LIGHT = 1.55` in `games/kendal/src/main.js`), so faces still show at night, indoors and by firelight. Judge skin in a game screenshot, not in the Blender preview, which makes it look darker. If a face still looks too dark, lighten it. Details in `docs/PIPELINE.md`.

10. **Fix it in the master engine, not game by game** (owner, 17 Nov 2026). When a fault can happen in more than one game (a head that spins, a way out offered too soon, a held item through a body, a check that is wrong), the fix goes in `engine/` and every game uses it. Do not copy a guard or a rule into a game's own file. If a game still carries its own copy of something the engine does, move it over when you touch it, and say so in `docs/ENGINE.md`.

11. **Every game has the same navigation and controls** (owner, 19 Nov 2026), existing and new: the title buttons Start, Chapters, Exit; Exit to the right of the Journal button with an "are you sure" (`engine/exit.js`); no "Main Menu" anywhere; touch or key words in the controls tip (`engine/device.js`); tap a person to talk. Details in `docs/STANDARD.md`, "Navigation and controls"; `tests/controls.mjs` checks every game.

12. **People stand straight and wear plain necklines** (owner, 21 November 2026). A stooped, leaning or crooked person is an engine fault, never a clothes or recipe fault: measure it with `node tools/review/posture-probe.mjs` and fix it in `engine/anim.js` (`docs/ENGINE.md`, "Every body keeps its own shape"). "Most just need a round opening for the garment": write `"collar": false` unless the period and the person need a collar, and give a man in a jacket the fitted suit (`docs/PIPELINE.md`, "Fitted garments"). Look at clothes from the front, three-quarter, side and back, standing, walking and seated, and in a pale colour as well as their own. A builder change is not done until the bodies are rebuilt and looked at in the game's stance. The audit behind this rule: `docs/reviews/people-20261121.md`.

13. **Looking at something is a close-up action** (owner, 22 November 2026: "If we are sent to look at something in games, then it needs to be a close up action for camera etc"). When a goal sends the player to look at, open, read, test or watch a thing, the camera eases in to a close shot of it, the thing visibly does something (a lid lifts, a cloth slides back, a lantern goes down), with sound, and only then do the words show; then the camera eases back. It must feel like a cinematic story book (owner: "It must feel like a cinematic story / story book"): black bars in, the camera glides, short story lines one at a time, as Nanny Town's "Look out over the valley" does (`lookOut()` in `games/nanny/src/main.js`). A button press and a text card alone is not enough. The shared part lives in the engine (`engine/lookshot.js`, `docs/ENGINE.md`), every game uses it, and the autoplayer skips the animation.

14. **Immersive and playable, never busy work** (owner, 22 November 2026: "The games must feel immersive and playable, we have to balance education and fun without giving the user more busy work. But we must ensure the tasks we give them to look at and do are engaging and accurate."). Every task and every look must earn its place: something real to see or do, true to the sources, that moves the story on. Cut or merge a step that is only a button press. Check by eye that what the player is sent to see is really there and looks right (the floating hat in the Mad Master game passed every check), and add an audit for each new kind of fault (rule 8).

15. **Check every character fully before calling it done** (owner, 23 November 2026: "make a rule to ensure you check every character thoroughly and dont give me half checked work. I am depending on you to do as you say"). After any change to a person's body or clothes, run `node tools/review/full-check.mjs <game> <id,...> anims=<the clips that person really plays>` for **every** person the change touches, in every game, and look at every cell of every sheet: each pose from the front, three-quarter, side and back, the clothes and the neck close up, and the phone and crowd copies. A passing cloth check is not enough on its own. In the report, say which people and poses were looked at, and name every fault still visible. Never say "fixed" or "no tears" about a person or pose that was not looked at.

## Quick commands

```bash
npm install                                 # three.js, esbuild, gltf-transform
node tools/build.mjs port-royal --dev       # build with test views and the autoplayer
node tools/build.mjs port-royal             # public build (no test code)
python3 -m http.server 8765                 # serve the repo root
# then open http://localhost:8765/menu/ or http://localhost:8765/games/port-royal/site/
```
