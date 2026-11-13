# Starting a new game (for example: Marcus Garvey)

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
- a goal line, a Sound button, and an "All games" link back to the menu (`../../../menu/`);
- footstep and interface sounds.

The template has no journal, chapters, saving or helper arrow yet. Port Royal has all of them in `games/port-royal/src/main.js`; copy or move them into `engine/` when the new game needs them (section 2).

Then:
1. Add the game to `menu/index.html`: replace the "Coming soon" panel with a copy of the Port Royal `<a class="game">` block, set `data-game="garvey"` and `href="games/garvey/site/"`, and set its background picture (for example `menu/garvey.jpg`, taken with a `?shot=thumb`-style test view). The menu must still fit one screen without scrolling; with three or more games, change the `.games` grid.
2. Change `soundPref('template-sound')` in `src/main.js` to the game's own key.
3. `node tools/dist.mjs` builds every game that does not start with `_`, so the new game goes live with the next deploy (see PUBLISHING.md).

## 2. What you get for free, and what each game makes

| Shared (reuse) | Made per game |
|---|---|
| Animation library and controller (`engine/anim.js`) | The world: streets, buildings, props, sky, period details |
| Sound engine (`engine/audio.js`) | Characters for the era (clothes in `npc.py`) |
| Model loading and packing (`engine/loader.js`, tools) | The story: chapters, conversations, journal pages, goals |
| Character generator, retargeting, optimisers (`tools/`) | Places and their walking bounds |
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

- **Clothing** for about 1900 to 1930, added to `tools/people/npc.py` (see PIPELINE.md): suits, trousers, collars and ties, hats, women's dresses. The famous UNIA uniform with plumed hat comes later.
- **Buildings**: early-1900s Kingston (timber and brick shops with verandas, zinc roofs) and Harlem (brownstones), as new Blender variants or code-built boxes using `houseMat()` and `worldUV()` with new textures.
- **Vehicles and props**: a printing press, a steamship, a streetcar, newspapers, flags.
- **Animations**: most already exist (walk, talk, wave, point, clap, cheer, salute, sit). A speech clip ("Talking" with big arm gestures, from Mixamo) would suit rallies.

## 5. Before shipping

Follow TESTING.md and PUBLISHING.md: screenshots, a scripted playthrough, the phone layout, a reading-level pass, and a facts check.
