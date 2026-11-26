# Audio plan for all games (26 November 2026)

Voice platform: **Cartesia**, through the hosted MCP server `https://mcp.cartesia.ai/mcp` (connected to this account on 26 November 2026). The workflow is in `docs/AUDIO.md`; Xaymaca is the finished example.

## Cast saved in the Cartesia account

| Voice | ID | Note |
|---|---|---|
| **Narrator** | `06d22dff-4250-4f54-be10-a82700f8d924` | "Our main narrator". **Confirmed by the owner as the narrator of every game.** |
| Faye Ellington | `c6f27449-17f7-4ec6-afcc-fc4ea217b099` | Older lady. Xaymaca: Grandmother. |
| Winston Stona | `e10a81c4-f597-4382-a675-5cb5d5db7170` | Older man. Xaymaca: the cacique. |
| Bob Marley | `2bd626f2-4c0c-44f0-940b-034afd5701eb` | Xaymaca: Cousin. |
| Sizzla | `6d19c8ed-0ab5-465b-92fd-c6287c4fe82e` | Xaymaca: the runner. |
| Rosie | `dc27725f-d567-40fc-bbb7-ffd55445fe5d` | Xaymaca: Miss Sharon. |
| Jimmy Cliff | `90543854-f1d7-4ed4-b265-44eeb96e4d80` | Not yet cast. |
| Michael Sharpe | `5292be3e-f857-4a68-b239-e2f99c2bd93a` | Not yet cast. |

The owner is sure only of the narrator for every game. Every other voice is chosen per game, and variety is wanted. A voice named after a real person is a casting choice made by the owner; do not give a real, named person's voice to a character whose words the game keeps unspoken (Marcus Garvey says only sourced words, Nanny never speaks, Haile Selassie I and Mortimo Planno have no invented words, Columbus and Hutchinson have fixed words).

## What each game has to voice

Counts come from `node tools/audio/cue-inventory.mjs`.

| Game | Film captions | Chapter openers | Chapter closers | End cards | Spoken characters (lines in script) |
|---|---|---|---|---|---|
| Xaymaca | 39 (done) | 7 | | 8 | Done. See `docs/AUDIO.md`. |
| Air Jamaica | 33 | 6 | | 5 | Mum 18, Aunt Marcia 16, Mr Hines 10, Captain Ross 7, Mr Grant 5, Chef Bailey 4, Mr Clarke 4 |
| Mad Master (Hutchinson) | 35 | 6 | | 7 | Sampson 18, Dr Hutton 12, Cubba 7, Juba 7, Cudjoe 6, Captain Reid 4, the clerk 3 |
| Morant Bay | 65 | 6 | | 13 | Gran 21, Mama 16, Papa 15, Deacon Clarke 12, Miss Ada 8, Sammy 6, the clerk 4 |
| White Witch of Rose Hall | 31 | 6 | | 9 | Miss Bryan 33, Tia 18, Mrs Lindo 12, Sister Reid 8 |
| Emperor's Arrival (Selassie) | 9 | 6 | | 8 | Ruth 15, Grandma Adina 13, Mum 12, Uncle Levi 10, Mr Brown 3, Young Adina 2 |
| Shark Papers | 27 | 4 | | 5 | Mr Fitton 27, Ben 9, Mr Cato 8, Mr Wylie 6, the clerk 5 |
| Windrush | 8 | 8 | | 3 | May 17, Samuel 15, Iris 14, Pearl 10, and eight small parts |
| Bog Walk, Eventide, Kendal, Melissa, Nanny Town, Tivoli | none (cards and camera scenes) | 6 to 8 each | 4 to 6 each (Nanny 5, Eventide 6, Melissa 6, Kendal 4) | | Not yet extracted: their talk tables use another shape. |
| Marcus Garvey, Port Royal | none | in `main.js` | in `main.js` | | Not yet extracted. |

## Order of work

1. **DONE 26 November 2026, listening pass still to do.** **Games with film captions already written** (Air Jamaica, Mad Master, Morant Bay, Rose Hall, Selassie, Shark Papers, Windrush): voice the captions with the Narrator, as Xaymaca did. Rewrite a caption for the ear only where needed (numbers as words, no digits, short lines), keep the on-screen text the same, and keep each clip inside its caption window.
2. **Games with cards and camera scenes only** (Bog Walk, Eventide, Kendal, Melissa, Nanny, Tivoli, Garvey, Port Royal): write narrator lines for each cinematic, each chapter opener and each closer, one reading each, then record. The scripts go through the same accuracy and tone rules as the game text. Tivoli, Nanny and Morant Bay keep their own rules.
3. **Character voices**: after the narrator is in, cast each game's speaking parts from the saved voices, with the owner choosing. Record the cast in each game's doc, as `docs/AUDIO.md` asks.

## Checks

- `node tools/xaymaca/voice-coverage.mjs` for Xaymaca. A generic version for every game comes with the first new voiced game.
- Clip against script: transcribe each clip (a local model works) and compare. Xaymaca, 26 November 2026: 132 clips checked, 2 to listen to by ear ("Navassa" heard as "Nevada", and "Ten canoes. Our people made them." heard as "10 canoes are people made them"). The other differences were only digits or contractions.
- Every clip must fit its caption window. Run the timing check from `docs/AUDIO.md` section 5.
