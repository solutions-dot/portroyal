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

## Casting notes from the owner

- **Port Royal (26 November 2026):** the English characters, and anyone who is not Black, could use a pre-built Cartesia library voice with an English accent. Choose and audition from the library when the character-voice phase starts; Black Jamaican characters use the account's saved voices.

## Port Royal cast (proposal, 26 November 2026, not yet approved)

Rule (owner, 26 November 2026): **every light-skinned character gets a pre-built Cartesia library voice; Black characters use the account's saved voices.** The split below follows each person's `Skin` colour in `tools/people/<id>.json` (dark: about 136 to 168; light: about 196 to 222), not a guess.

**Library voices (light-skinned):** audition numbers are the ten clips sent on 26 November 2026; "new" voices have no audition yet.

| Character | Real or fictional | Voice (audition no.) |
|---|---|---|
| Henry Morgan (29 lines, the biggest part) | real | Roy, stern (2). He was Welsh; no Welsh voice found. |
| Old Ned, retired buccaneer | fictional | Griffin, elderly (1) |
| Symon Benning, pewterer | real family | Gary, measured (4) |
| Sam, sailor; and "Sailor" | fictional | Spencer, casual (5) |
| The Reverend Emmanuel Heath | real | Benedict, polished (3) |
| The gunner | fictional | Owen, Scottish (6) |
| Daniel Mendes, merchant | fictional | Clive, measured (7) |
| Constable Hart | fictional | Martin, mature (8) |
| Alexandre Exquemelin, surgeon | real, French | Rupert, warm (10); a French-accented voice not yet tried |
| Quartermaster | fictional | Harrison (new) |
| Tom and Dick (the drill) | fictional | Alec, lively (9) and Toby (new) |
| Will and Jack (tavern men) | fictional | Jasper (new) and Finn (new) |

**Saved voices (Black characters):** Abba (tavern keeper), Kofi (dockworker, enslaved), Grace (market seller), Peter (turtler), and Hannah (tavern worker; check her model). The account has Faye Ellington (older lady), Rosie, Winston Stona (older man), Bob Marley, Sizzla, Jimmy Cliff and Michael Sharpe. Xaymaca already uses Faye, Winston, Bob Marley, Sizzla and Rosie, so Jimmy Cliff and Michael Sharpe are free for new roles; the owner decides whether a voice may serve two games. Suggested: Abba, Rosie or Faye; Kofi, Michael Sharpe; Peter, Jimmy Cliff; Grace, Rosie; Hannah, to be settled.

**Notes**
- `docs/games/port-royal.md` calls Abba a free Black woman who stands for the free Black people of Port Royal; the owner said (26 November 2026) that Abba and Kofi are enslaved. One of the two is out of date, so settle it before her lines are voiced (Rule 3: accuracy).
- No lawyer speaks in Port Royal. The court scenes with a clerk and judge are in other games (Shark Papers, Morant Bay, The Mad Master). When those games' characters are cast, the same split applies to all fifteen games.
- Real people's words in Port Royal (Morgan, Exquemelin, Heath, Benning) are paraphrases, and whether they may stay is the owner's open question; voicing them makes them more real, so settle it first.

## Delivery table written, clips not yet re-recorded (26 November 2026)

`tools/audio/delivery.mjs` has put an emotion and speed on every line of the 15 games with narrator clips (`voice-script.json`, `voice-lines.json`). The 317 clips have not yet been re-recorded with it; Xaymaca's clips were recorded by another route and are not included.

## New saved voices (owner, 26 November 2026, 20:30 UTC), not yet cast

| Name in Cartesia | ID | Note |
|---|---|---|
| Woman generic | `aa188bb9-72e0-47ab-9fc8-6b927aaf45cd` | a woman; free for a Black woman's part (Hannah in Port Royal needs one) |
| dorraine samuels | `74a89262-c877-4580-af34-28b50a665413` | name of a person; ask the owner who she is and what she may voice |
| generic male | `54e2eb56-f80c-488b-8035-ca63bb19ab1d` | a man |
| Man generic (two voices) | `e09b6b48-9904-49ed-9c67-6d4def9deda0`, `d4cd9717-9a69-4127-87ba-3b8377b24ada` | two different men |
| msn generic3 | `1f2d4cc3-5950-41a5-bfda-c9801fab8a75` | unknown; audition |
| Don topping | `f8b95dbe-5d18-488f-acd3-e2fc7a993680` | name of a person; ask the owner |
| Marcus Garvey | `98b523a0-0957-49a4-a1a8-ff3e9205ef59` | a voice named for a real person. Marcus Garvey says only his real, sourced words (rule 3); do not use it until the owner says where, and keep to sourced words |

Audition each one saying one line before casting (the descriptions are empty). Use them for Black characters, as with the older saved voices; light-skinned characters keep the library voices.

## More casting rules from the owner (26 November 2026)

- **The Mad Master of Edinburgh Castle (Hutchinson):** light-skinned characters use the British library voices, the generic ones from the Cartesia platform, one different voice each. Black characters use the account's saved voices.
- **Shark Papers:** English-accented or Spanish-accented library voices as each scene needs (the French and Spanish ships, the court in Kingston). One different voice each.
- **Windrush:** the family and others in the UK need **UK-accent voices for Black British characters**. The library does not label race, so audition British voices, and try `localize_voice` on a saved voice to give it a British accent; the owner chooses by ear.
- **Port Royal:** as above, English library voices for the light-skinned characters (the first batch is recorded).
- **All games:** light-skinned characters, library voices; Black characters, saved voices (generic ones the owner added are free for any game); never two characters in one game on the same voice.
