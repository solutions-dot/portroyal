# Audio handoff: where the voice work stands (26 November 2026)

Read this first to resume. It is written so another session or another model can carry on. Branch `claude/affectionate-dirac-3jvte2`, PR #172 (draft, stacked on #171). Background: `docs/AUDIO.md` (workflow, rules 16 and 17 in `CLAUDE.md`), `docs/audio/PLAN.md` (cast, order of work).

## What is finished and pushed

- **Shared engine:** `engine/filmvoice.js` (voice channel, score, ducking), `engine/narrator.js` (reads on-screen text from `voices/index.json`), `engine/cine.js` (`configureCinematicBed`, `nextCinematicBed`: a quiet bed under every cinematic). Xaymaca's `narration.js` is an adapter over the engine.
- **Seven film games** (Air Jamaica, The Mad Master, Morant Bay, Rose Hall, Selassie, Shark Papers, Windrush): 208 captions voiced in the Narrator voice, 33 original synthesised scores, wired through each `director.js`. All checked by transcription.
- **Eight games with no film captions** (Bog Walk, Eventide, Kendal, Melissa, Nanny, Tivoli, Garvey, Port Royal): 109 narrator clips read from existing on-screen text (title cards, scene captions), beds for six of them. Tivoli and Garvey have no bed (Tivoli's May 2010 scenes need the owner's say).
- **Tools** (all in `tools/audio/`): `cue-inventory`, `voice-script`, `voice-lines`, `delivery`, `fetch-clips.sh`, `fetch-lines`, `fetch-film`, `stale-clips`, `film-voice-check`, `make-score.py`, `port-royal-cast`. `tools/xaymaca/voice-coverage.mjs`.

## In progress: re-recording the narrator clips with delivery (emotion and pace)

The owner approved the delivery (26 November 2026: "the delivery sounds good, we need this on the clips"). `tools/audio/delivery.mjs` has already written `emotion` and `speed` into every line of `voice-script.json` and `voice-lines.json`. The clips on disk for most lines are still the first, flat recording.

**Directed (done and checked):** Air Jamaica 33 of 33; The Mad Master 34 of 35 (`warrant-32` failed to download); Morant Bay 27 of 65 (indices 0 to 26).

**Still to record with delivery** (`node tools/audio/stale-clips.mjs <game>` lists them; it compares each clip's last commit with the delivery commit `87970788`):

| Game | Left |
|---|---|
| Morant Bay | 38 (indices 27 to 64, from `riot-0`) |
| Rose Hall | 31 |
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
