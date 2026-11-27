# Audio handoff: where the voice work stands (27 November 2026)

**Status board (read this first; older notes below are history).** Work goes one game at a time, in the order of the menu's row (owner, 27 November 2026). Branch `claude/affectionate-dirac-3jvte2`, all committed and pushed, nothing open. No PR is open for the later work (PR #173 merged earlier); open one only when the owner asks.

| # | Game | Narrator and music | Character voices | Left to do |
|---|---|---|---|---|
| 1 | Xaymaca 1503 | done (shared player) | done (coverage check passes) | listen to "Navassa" (came back as "Nevada") and "Ten canoes. Our people made them."; Taino-heritage review |
| 2 | Port Royal | done | 169 lines, 20 voices, checked and wired | click through a real talk to hear it; Abba is free and the four real people (Morgan, Exquemelin, Heath, Benning) keep their imagined lines, each journal page now says so (owner, 27 November 2026) |
| 3 | Nanny Town | done | 90 lines, 6 voices, checked and wired (`showLine`) | listen to the clips; Quamin could move to "young man (expressive)" if the owner prefers |
| 4 | The Mad Master | done except `warrant-32` (failed download, re-record) | **not started** | list speakers, propose voices (light-skinned: library British voices; Black: saved voices), record, wire |
| 5 to 16 | Shark Papers, Rose Hall, Morant Bay, Bog Walk, Garvey, Windrush, Kendal, Selassie, Air Jamaica, Eventide, Tivoli, Melissa | narrator done | **not started** (Eventide: cast file written, 24 clips not recorded, dialogue not wired) | same steps, one game at a time |

**What was done on 27 November 2026:** every game's title cards and captions now wait for the narrator to finish (`engine/cine.js`, `engine/narrator.js` `after`/`done`); film captions were moved later so no clip outlasts its gap and no film pauses (`tools/audio/retime-captions.mjs`; Hutchinson `morning` 44 s, Morant Bay `today` 31 s, Rose Hall `pages` 53 s); Air Jamaica's "New colours" film got shorter lines (new clips, checked); Port Royal's last Grace line re-recorded; Nanny Town and Port Royal dialogue wired. Per-game cast scripts: `tools/audio/port-royal-cast.mjs`, `eventide-cast.mjs`, `nanny-cast.mjs` (copy one for the next game: it reads `who: 'Name', text: '...'` lines from `src/content.js`, resolving two-letter name constants, and writes `games/<g>/voice-cast.json`).

**Recording routine that works:** record 12 to 15 lines per batch with `text_to_speech` (voice id, emotion, speed from the cast file, mp3 64 kbps 44.1 kHz), then immediately `echo "<ids>" | node tools/audio/fetch-lines.mjs <game> 0 voice-cast.json missing` (it fetches only lines without a clip, in order, and repairs a mistyped id). Re-record any that fail and fetch right away. Then check every clip by transcription (faster-whisper in a scratchpad venv; compare words, ignore digits, Saint/St. and name spellings). To swap a voice: change it in the cast script, delete that character's keys from `site/voices/index.json`, and re-record with `missing`.

**Saved Cartesia voices (owner's account):** Narrator 06d22dff, Faye Ellington c6f27449, Winston Stona e10a81c4, Bob Marley 2bd626f2, Sizzla 6d19c8ed, Rosie dc27725f, Jimmy Cliff 90543854, Michael Sharpe 5292be3e, Woman generic aa188bb9, dorraine samuels 74a89262 (free now), generic male 54e2eb56, Man generic e09b6b48 and d4cd9717, msn generic3 1f2d4cc3, Don topping f8b95dbe, Male generic 0a97a9a1, Marcus Garvey 98b523a0 (his three sourced lines only), "woman (middle aged)" 41f3f9c6 (Nanny Mama), "young man (expressive)" 9e0fa051, "young child" b883942d (Beneba), "Small girl child" 7ea04cdd (Phibba). Rule: one distinct voice per character within a game; Black characters use saved voices, light-skinned characters use Cartesia library voices.

**Open for the owner:** Windrush needs UK-accented Black British voices; a listening pass on phone and desktop for every game; Tivoli and Garvey beds (done for Garvey's record crackle; Tivoli needs the owner's say); name pronunciations to check by ear (Morant, Jacmel, Takoo, Planno, Stony Gut, Cudjoe, Sevilla).

---

Read this first to resume. It is written so another session or another model can carry on. Branch `claude/affectionate-dirac-3jvte2`, PR #172 (draft, stacked on #171). Background: `docs/AUDIO.md` (workflow, rules 16 and 17 in `CLAUDE.md`), `docs/audio/PLAN.md` (cast, order of work).

## What is finished and pushed

- **Shared engine:** `engine/filmvoice.js` (voice channel, score, ducking), `engine/narrator.js` (reads on-screen text from `voices/index.json`), `engine/cine.js` (`configureCinematicBed`, `nextCinematicBed`: a quiet bed under every cinematic). Xaymaca's `narration.js` is an adapter over the engine.
- **Seven film games** (Air Jamaica, The Mad Master, Morant Bay, Rose Hall, Selassie, Shark Papers, Windrush): 208 captions voiced in the Narrator voice, 33 original synthesised scores, wired through each `director.js`. All checked by transcription.
- **Eight games with no film captions** (Bog Walk, Eventide, Kendal, Melissa, Nanny, Tivoli, Garvey, Port Royal): 109 narrator clips read from existing on-screen text (title cards, scene captions), beds for six of them. Tivoli and Garvey have no bed (Tivoli's May 2010 scenes need the owner's say).
- **Tools** (all in `tools/audio/`): `cue-inventory`, `voice-script`, `voice-lines`, `delivery`, `fetch-clips.sh`, `fetch-lines`, `fetch-film`, `stale-clips`, `film-voice-check`, `make-score.py`, `port-royal-cast`. `tools/xaymaca/voice-coverage.mjs`.

## In progress: re-recording the narrator clips with delivery (emotion and pace)

The owner approved the delivery (26 November 2026: "the delivery sounds good, we need this on the clips"). `tools/audio/delivery.mjs` has already written `emotion` and `speed` into every line of `voice-script.json` and `voice-lines.json`. The clips on disk for most lines are still the first, flat recording.

**Directed (done and checked by transcription):** Air Jamaica 33 of 33; The Mad Master 34 of 35 (`warrant-32` failed to download); Morant Bay 65 of 65; Rose Hall 31 of 31.

**Still to record with delivery** (`node tools/audio/stale-clips.mjs <game>` lists them; it compares each clip's last commit with the delivery commit `87970788`):

| Game | Left |
|---|---|
| Shark Papers | 27 |
| Selassie | 8 |
| Windrush | 8 |
| The Mad Master | 1 (`warrant-32`) |
| The eight no-caption games | 109 (not started; they use `voice-lines.json`, see below) |

**How to record one clip** (Cartesia MCP, `https://mcp.cartesia.ai/mcp`, already connected in the owner's account):

1. Read the line's `text`, `emotion` and `speed` from `games/<game>/voice-script.json` (film games) or `voice-lines.json` (no-caption games). Print them with `node -e` to copy from.
2. Call `text_to_speech` with `voice_id` `06d22dff-4250-4f54-be10-a82700f8d924` (the Narrator, the owner's voice for every game), `transcript` = the `text`, `emotion`, `speed`, `language` `en`, `output_format` `{"container":"mp3","bit_rate":64000,"sample_rate":44100}`. The result has a `download_url` ending `link_<id>`.
3. Download with the id, in the same order as the script: `echo "<id1> <id2> ..." | node tools/audio/fetch-film.mjs <game> <first-index>` (film games, replaces `voices/narrator-<stem>.mp3`) or `node tools/audio/fetch-lines.mjs <game> <first-index>` (no-caption games). Both repair a link id with one swapped or dropped character.
4. **Always check afterwards.** Copying ids by hand goes wrong about one time in six; a wrong or missing id leaves the old clip in place (`stale-clips.mjs` shows it) or, worse, a clip for the wrong line. Transcribe and compare: a local `faster-whisper` model works (install in a venv; decode each mp3 to 16 kHz mono with ffmpeg first). Only digits, "Saint" and name spellings should differ.
5. Commit and push after each game.

Calls made in a large parallel batch can be moved to the background and finish later as notifications: match them to lines by task order, then verify by transcription. Batches of about 30 work well. The owner stopped long batches twice, so keep each one short.

## Pronunciation rules (owner decisions, 26 November 2026)

- **Palisadoes** shows as written on screen. Spoken: the opening Air Jamaica line uses `pal-e-say-doze` ("The waving gallery, pal-e-say-doze Airport."), Captain Ross's line is "There it is. The airport, pal-e-say-doze. Home." (the owner chose this take; it adds "The airport," to get the sound). The model says the same respelling differently by context, so each Palisadoes line was auditioned. In `tools/audio/voice-script.mjs` see `RESPELL`.
- **Selassie** `arrival-10`: the caption no longer names Palisadoes ("The aircraft reaches the airport."), so it has an ordinary clip.
- **Still to ask the owner by ear:** Morant, Jacmel, Takoo, Planno, Stony Gut, Cudjoe, Sevilla, Navassa (Xaymaca's "Navassa" came back as "Nevada" in transcription and was not fixed).
- Numbers are spoken as words; a hard name is respelled only in the voice script, never on screen.

## Delivery table (tools/audio/delivery.mjs)

A mood per film or scene plus word-based lifts and drops: `!` lines lift (excited, 1.03+), grave words (died, fire, sold, hanged, names, quiet) go sad and slower (about 0.9). Games: Air Jamaica bright to sad at the last landing; The Mad Master neutral, slow, sad for the hanging morning; Morant Bay sad for the drought, burning, courts and hangings; Rose Hall neutral, sad in the church; Shark Papers excited for the catch; Windrush sad at departure. A known quirk: "dark blue tail" tripped the grave-word rule (Air Jamaica `reveal-7_8` is excited at 1.0, which is right). Tune with the owner by ear.

## Next: character voices (not recorded yet except 32 Port Royal lines)

`docs/audio/PLAN.md` has the cast. Rule (owner): **every light-skinned character gets a different Cartesia library voice; Black characters use the account's saved voices** (Faye Ellington, Rosie, Winston Stona, Bob Marley, Sizzla, Jimmy Cliff, Michael Sharpe; Xaymaca already uses Faye, Winston, Bob Marley, Sizzla, Rosie). Each character gets a different voice.

Port Royal: `node tools/audio/port-royal-cast.mjs --write` makes `games/port-royal/voice-cast.json` (162 lines, 19 characters, voice and delivery per line). **32 of 162 recorded** (the first batch; lines 0 to 40, of which 9 failed to download: indices 31, 34, 35, 38 and five others; run `node -e` against `site/voices/index.json` to list the lines whose key is missing). Voices: Morgan Roy, Ned Griffin, Benning Gary, Sam Spencer, Sailor Oscar, Heath Benedict, the gunner Owen, Mendes Clive, Constable Hart Martin, Exquemelin Rupert, Quartermaster Harrison, Tom Alec, Dick Toby, Will Jasper, Jack Finn; Abba Faye, Grace Rosie, Kofi Michael Sharpe, Peter Jimmy Cliff. **Hannah (7 lines) has no voice yet:** the owner has now added `Woman generic` and `dorraine samuels` (see `docs/audio/PLAN.md`, "New saved voices"); audition them and pick one. **Wiring is not done:** `games/port-royal/src/main.js` has `NARR` for title cards; the dialogue (`showStep`) needs a call that plays `who|text` from `voices/index.json` (keys are `who|text`, stems `c-<hash>`).

Other games' characters (Air Jamaica, The Mad Master, Morant Bay, Rose Hall, Selassie, Shark Papers, Windrush, Kendal, Melissa, Nanny, and more): not yet extracted or cast.

## Open questions for the owner

1. Abba: `docs/games/port-royal.md` says free; the owner said enslaved. Settle before voicing her.
2. Real people's words in Port Royal (Morgan, Exquemelin, Heath, Benning) are paraphrases; whether they may stay is the owner's call.
3. Tivoli and Garvey beds; Xaymaca's two clips to re-listen ("Navassa", "Ten canoes. Our people made them.").
4. Whether a cheaper model may do the recording calls (it is mechanical; the risk is copying link ids, mitigated by the repair tool and the transcription check).
5. A listening pass on phone and desktop for every game (nothing here has been heard by a person except samples).

## Owner instructions added later on 26 November 2026

- **Direct every clip** (emotion and pace per line), not only some. Until the table above reaches zero stale clips, the games play a mix of directed and flat takes.
- **Add sounds and music where needed.** Gaps found so far: Tivoli and Garvey have no cinematic bed (Tivoli's May 2010 scenes need the owner's say first; Garvey has no `showCinematicSkip` scenes, so the chapter-7 record scene and the ship scenes could take a bed or a gramophone crackle); the title cards and chapter closers of the eight no-caption games have no sound of their own; Port Royal's character lines are not wired. Audit each game once by playing it with sound on and note silent stretches.
- **Done on 26 November 2026 after the handoff was first written:** Xaymaca's guide Miss Sharon (the 2026 chapter, 11 clips) now uses the saved voice "Woman generic" instead of Rosie; Garvey's three sourced record lines play in the recreated "Marcus Garvey" voice (see `docs/games/garvey.md`, "His voice").

**Update 26 November 2026, 22:50 UTC:** Morant Bay and Rose Hall are fully directed and checked. Left: Shark Papers 27, Selassie 8, Windrush 8, The Mad Master 1 (`warrant-32`), then the 109 no-caption lines. `fetch-film.mjs` now repairs a mistyped link id by trying swapped, moved, dropped and wrong characters in parallel (`tools/audio/probe.sh`); ids with more than one error still fail, so re-record those and download right away.

**Update 26 November 2026, late:** Shark Papers 27, Windrush 8 and Selassie 9 are directed and checked. Left of the film clips: The Mad Master `warrant-32` (1). Then the 109 no-caption lines, character voices, and the Port Royal dialogue wiring. Xaymaca's on-screen dates now show as digits (the voice still says words); `tools/xaymaca/voice-coverage.mjs` flags a date spelled out on screen.

**Update 26 November 2026, night:** all 109 no-caption narrator lines are directed and checked (Kendal 47, Eventide 16, Melissa 14, Garvey 10, Tivoli 8, Bog Walk 6, Nanny 6, Port Royal 2). **Every narrator clip is now directed except The Mad Master `warrant-32`.** Next: character voices (Port Royal 130 lines to record, 9 failed lines; the Mad Master, Shark Papers, Windrush, Morant Bay and the rest not yet extracted), the Port Royal dialogue wiring, then a listening pass.

**Update 27 November 2026 (one game at a time, in menu order):** Xaymaca and Port Royal are done (Port Royal's 169 character lines are recorded, checked and wired; Abba's free-or-enslaved question and the paraphrased real people are still the owner's call). **Nanny Town done:** 90 character lines, checked by transcription, wired in `showLine()` (`NARR.speak('who|text')`). Voices (owner): Mama "woman (middle aged)", Cubbenah Bob Marley, Auntie Mimba Faye Ellington, Quamin Jimmy Cliff, Beneba "young child", Phibba "Small girl child"; Nanny never speaks. `tools/audio/nanny-cast.mjs` makes `games/nanny/voice-cast.json`. Eventide is cast (Gran Faye, gateman Michael Sharpe) but its 24 clips are not recorded and its dialogue is not wired. Film captions were retimed so no clip outlasts its gap (`tools/audio/retime-captions.mjs`); title cards and captions now wait for the voice (`engine/cine.js`, `NARR.after`/`done`). Next in menu order: The Mad Master (Hutchinson), then Shark Papers, Rose Hall, Morant Bay, Bog Walk, Garvey, Windrush, Kendal, Selassie, Air Jamaica, Eventide, Tivoli, Melissa. Newest saved voices: "Small girl child", "young child", a middle-aged woman voice (unnamed so far), Male generic.

## Owner asks of 27 November 2026 (evening) still to finish

1. **Card narration, Xaymaca first, then each game in menu order.** Cards that stay on screen until a button is pressed (chapter introductions, story cards, "Who you are") stay as they are and are read aloud, one clip per card (title, then paragraphs), stopped when the button is pressed. Xaymaca: wired (`cardVoice` in `games/xaymaca/src/ui.js`), text list `tools/audio/xaymaca-text.mjs` -> `games/xaymaca/voice-lines.json`; **the clips are NOT recorded yet** (record with the Narrator voice, then `node tools/audio/fetch-lines.mjs xaymaca 0`). Other games: add the same hook to their own `card()` and extract their card text.
2. **Looking at something: no pop-up.** Xaymaca's `lookAt` no longer opens a card: the story line and the "what it means" lines show one at a time in the cinematic lower bar over the close shot, each read aloud, the next held until the voice finishes (`speak` and `voiceBusy` in `engine/lookshot.js`; same list file). Other games that end a look with a card (check `LS.play` / `lookOut` callers) still need the same change, one game at a time.
3. **Scene prompt removed:** no "Watch scene / Read what happened instead" card before any scene (`SHOW_CARD = false` in `engine/scene-warning.js`; set it true to bring it back). Tivoli has its own opt-in card in `games/tivoli/src/fight.js`: left as is until the owner says. `CLAUDE.md` rule 4 still describes the opt-in cards: update it when the owner confirms.
4. **Space bar presses a card's Next button on a desktop** (`engine/card-keys.js`, loaded by `engine/input.js`). Written but NOT yet verified in a real card (the headless test could not show one); test it in the running game.
5. **Film captions:** in the lower black bar they now have no box and are bigger (all eight film games).

**Level standard (27 November 2026):** every spoken clip in every game is now at -19 LUFS (`tools/audio/balance-dir.mjs`, see `docs/AUDIO.md`, "Level balance"). Run it with `--write` after recording any new clips, then again without: it should report 0 or 1 to change (one peaky Tivoli clip cannot go higher under the -2 dB ceiling). Port Royal's 169 character clips were re-checked by transcription after balancing (only "Galdy" heard as "Goldie"). Narrator clips were all near -24 LUFS before, so they are about 5 dB louder than they were. Xaymaca's card and look lines (38) are recorded and checked.
