# Starting a new game

The example below uses Marcus Garvey, the second game, which was started this way. Sections 3 and 4 are kept as a record of how it was planned. For people, clothes, places and animations in any game, follow `docs/STANDARD.md`.

## 1. Make the folder

```bash
cp -r games/_template games/garvey
node tools/build.mjs garvey --dev
python3 -m http.server 8765      # open http://localhost:8765/games/garvey/site/
```

The template runs straight away. You get:
- a ground and a few buildings as boxes;
- first-person movement with keys, touch and drag-to-look;
- one character (`site/models/sailor.js`, a stand-in) using the shared animations, who turns to face you and talks (E, the Talk button, or tap him);
- a dialogue box: "You" lines get their own colour, and the ×, Escape or a tap outside ends the talk;
- a goal line, a Sound button, and a "Main Menu" button back to the menu (`../../../menu/`);
- footstep and interface sounds.

The template has no journal, chapters, saving or helper arrow yet. Port Royal has all of them in `games/port-royal/src/main.js`; copy or move them into `engine/` when the new game needs them (section 2).

Then:
1. Add the game to `menu/index.html`: copy one of the existing `<a class="game">` cards (Kendal's is a good one), set `data-game` and `href="games/<game>/site/"`, give it its own class and colours in the page's styles, and set its background picture (for example `menu/garvey.jpg`, taken with a `?shot=thumb`-style test view). The menu scrolls on every screen size: one card per row on phones (the browser's own bars leave too little height to fit three cards), two per row on desktop. A new game needs no grid change. Check it at 414x706, 360x640 and 320x568 (no text clipped, no badge on top of the year) and on desktop.
2. Change `soundPref('template-sound')` in `src/main.js` to the game's own key.
3. `node tools/dist.mjs` builds every game folder that has `src/main.js` and does not start with `_`, so the new game goes live with the next deploy (see PUBLISHING.md). Keep a game that is not ready in a folder starting with `_`.

## People

Every character in a new game follows `docs/PEOPLE.md`: recipes in `tools/<game>/people/`, built by `tools/garvey/era.py`, packed by `tools/people/pack.mjs`, and the checks wired before the first pull request. `docs/STANDARD.md` is the step-by-step guide for people, clothes, places and animations. The template's one person (`site/models/sailor.js`, a Port Royal sailor) is only a stand-in: replace it with the game's own bodies.

## 2. What you get for free, and what each game makes

| Shared (reuse) | Made per game |
|---|---|
| Animation library and controller (`engine/anim.js`) | The world: streets, buildings, props, sky, period details |
| Sound engine (`engine/audio.js`) | Characters for the era: recipes in `tools/<game>/people/`, built by `tools/garvey/era.py` (`docs/PEOPLE.md`) |
| Automatic audits (`engine/audit.js`): floating objects, people in solids, unreachable spots, held items, people overlapping, seats, walking, cloth; and `engine/skinprobe.js` for skin | The place data it reads (walls, bounds, start, actions, people) |
| Model loading and packing (`engine/loader.js`, tools) | The story: chapters, conversations, journal pages, goals |
| The clothes builder `tools/garvey/era.py`, the packer `tools/people/pack.mjs`, clip retargeting (`tools/anims/`), the build (`tools/build.mjs`) | Places and their walking bounds |
| Patterns from Port Royal to copy or move into `engine/`: conversations, actions, journal, chapters, saving, controls, strolling people, test views, the autoplayer (see ENGINE.md, "Still inside Port Royal") | |

When the Garvey game needs one of those Port Royal systems, move it into `engine/`, taking the game-specific parts as options, and switch Port Royal over to it too. Run Port Royal's autoplayer afterwards to prove nothing broke.

## 3. Marcus Garvey: starting points (verify every fact before using it)

Commonly cited outline, to research and confirm from reliable sources (for example the Marcus Garvey and UNIA Papers project at UCLA, the National Library of Jamaica, the Jamaica National Heritage Trust):

- Born in St Ann's Bay, Jamaica, in 1887.
- Printer's apprentice, then printer, in Kingston.
- Travelled in Central America and lived in London.
- Founded the Universal Negro Improvement Association (UNIA) in Jamaica in 1914.
- Moved to the United States in 1916 and built the UNIA in Harlem: the *Negro World* newspaper, the Black Star Line ships, the 1920 international convention.
- Convicted of mail fraud, imprisoned, and deported to Jamaica in 1927.
- Politics in Jamaica, then London, where he died in 1940.
- Named Jamaica's first National Hero in 1964; his remains rest in National Heroes Park, Kingston.

Present contested points (the trial, the shipping line's failure) fairly and simply.

Suggested first slice: **Kingston, 1914**, the founding of the UNIA. It's a small, self-contained place (a street, a print shop, a meeting hall) that proves the reuse before the bigger settings: Harlem streets, a steamship, a convention hall.

## 4. New period assets the Garvey game needs

- **Clothing** for about 1900 to 1930. This is now done in `tools/garvey/era.py` (`docs/PIPELINE.md`, section 5): suits, trousers, collars and ties, hats, women's blouses and skirts. The UNIA uniform with plumed hat is still to make.
- **Buildings**: early-1900s Kingston (timber and brick shops with verandas, zinc roofs) and Harlem (brownstones), as new Blender variants or code-built boxes using `houseMat()` and `worldUV()` with new textures.
- **Vehicles and props**: a printing press, a steamship, a streetcar, newspapers, flags.
- **Animations**: most already exist (walk, talk, wave, point, clap, cheer, salute, sit). A speech clip ("Talking" with big arm gestures, from Mixamo) would suit rallies.

## 5. Before shipping

Follow TESTING.md and PUBLISHING.md: screenshots, a scripted playthrough, the phone layout, a reading-level pass, and a facts check.

**Wire the automatic checks before the first PR** (owner rule 8, TESTING.md section 5). The template does not wire any of them yet: it only carries a reminder at the top of `src/main.js`. Copy the blocks from `games/kendal/src/main.js` (search for `q.get('test')`) and import `engine/audit.js` and `engine/skinprobe.js`: the place audit (`?test=audit`), held items (`?test=held`), the layout test (`?test=layout`), and, once the game has people, `?test=cloth`, `?test=walkers` and `?test=skin` (`docs/PEOPLE.md`), plus `?test=resume` once it saves. Every place must report 0 issues. The full list is in `docs/STANDARD.md`.
