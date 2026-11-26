# Audio production for PastPort

Use this workflow for opening narration, in-game dialogue, cinematics, music, and endings. Xaymaca is the first implementation with timed narration and an original score across all seven cinematics.

## 1. Make a cue sheet and cast the story

Read the current game script and source before recording. Voice every non-player dialogue line, including early conversations and repeat-talk lines, and every cinematic caption. Track coverage by speaker and cue. The player's own replies stay text-only. Map each spoken moment to its chapter, dialogue step, film time, or ending card. Include the exact words, speaker, delivery, and any moment to leave quiet. Start with the narrator and characters who carry the story.

**Cast each game independently.** Different stories can have different narrators and character voices. Keep a cast list with the game notes. For each role, record the approved provider, voice name or ID, accent and delivery, pronunciation notes, and which scenes have been recorded. Carry an approved voice through its role within that game. Casting choices from another story are useful references when the owner requests them.

Use voices and recordings authorized for the game. The owner can supply finished takes or authorize generation with saved voices in the connected provider. Confirm the intended cast and delivery before replacing an approved performance. Keep source recordings and private account data out of the public repository.

## 2. Write for the scene and record for the edit

- Use the approved title and description for the opening clip. Preserve the existing intro when adding in-game narration.
- For character dialogue, use the game's exact line and record one clean file per voiced caption. Leave uncast replies on screen. Name clips by role and cue, such as `grandmother-farewell-01.mp3`.
- For films, spot the pictures before writing or recording. Keep lines short enough to fit between picture and caption changes. Use a separate clip per timed cue, such as `narrator-trade-16.mp3`. Save space for effects, a reaction, or a pause.
- Read back personal and place names against the game notes. Audition a short excerpt before generating a batch, especially after a casting change. Verify delivered audio against the script and check that no lines start or end mid-word.
- For endings, let the final character beat settle. Narrate the closing reflection where it belongs in the flow, after the quiz when the game uses one.

## 3. Score and mix

Build a musical identity for each story. Reprise a small theme across scenes and vary its pace, harmony, and texture with the story. Keep the voice clear and leave room for the game's effects. Use original or licensed audio and keep the source and permissions in the project notes. Treat historical instrument and music claims as research questions.

Keep speech, effects, and score separate where the game needs independent playback. Fade the music in and out, and lower it while narration is speaking. In Xaymaca the score runs at 0.40 gain between lines and 0.17 under speech. The tracks have written-in fades and the departure scene has a longer tail fade before Grandmother returns. These levels are a starting point. Adjust by listening on phone speakers and headphones.

Deliver a dry voice preview for casting and a scene mix preview when reviewing music. A preview can use shortened gaps, provided the actual game cues keep their original timing.

## 4. Integrate without changing the story flow

- Opening narration uses the shared title-screen player and waits for Start to become available. Keep its manual speaker control.
- Use exact dialogue step and line IDs or the game's existing line records. Play audio when the corresponding caption is displayed. Advancing, closing dialogue, muting, and leaving the page should stop the clip.
- Attach film audio to the director's scene clock. Keep subtitles and Read instead available. Load audio ahead of playback. Pause and resume from the film's time, and stop both narration and score on skip, scene exit, mute, or page exit. Missing audio should leave the caption and controls usable.
- In Xaymaca, film caption entries support an optional narrator clip stem in the third field. The director plays that clip and a separate scene score through the game audio master. Static audio lives under `games/xaymaca/site/voices/` and `games/xaymaca/site/scores/`. The build copies these into the deployed game.
- Keep clips compressed for the web. Xaymaca uses mono MP3 scores at 32 kbps and 64 kbps MP3 narration. Compare the encoded files to the source takes before choosing different settings.

## 5. Check before release

1. Decode every asset, verify the filenames match their cues, and check each clip fits its caption or scene window.
2. Play through the scenes in a browser. Check timing, volume, pronunciation, fades, and transitions at phone and desktop sizes. Test sound off, pause and resume, Read instead, skipping, and fast advancement between dialogue lines.
3. Check there is no audio overlap when a player advances a caption, leaves a scene, or moves from the ending to another panel. Check blocked or missing audio still allows play.
4. Provide the owner with the preview and PR. Log which scenes are voiced, the cast used, and any playback or device checks still pending.

## Casting background and number pronunciation

Cast foreign characters with a suitable accent for their background. Diego Méndez in Xaymaca uses Marcos, a Spain-based library voice, for his English dialogue. The interpreter uses Daniel's neutral English delivery. His historical Taíno accent is unknown, so the voice is an English storytelling performance. Record the choice per game and review a sample in context.

Write all numbers as words in voice scripts and voiced captions. In Xaymaca, 1503 is “fifteen oh three”, and 29 February 1504 is “the twenty-ninth of February, fifteen oh four”. Check the actual spoken result.

The Xaymaca player uses the shared Web Audio master for dialogue and cinematic narration. Conversation clips preload as the dialogue opens. A cinematic holds its current caption when needed until the active spoken line finishes. Test these paths with normal play and muted play.

## Xaymaca full voice coverage

All non-player story dialogue, character repeat lines, and cinematic captions have assigned recordings. Faye voices Grandmother, the approved Bob Marley voice voices Cousin, Winston voices the cacique, Sizzla voices the runner, Rosie voices Miss Sharon, Daniel voices the interpreter in neutral English, and Marcos voices Diego Méndez in English with a Spanish delivery. The player speaks through captions only. The production voice list is stored in Cartesia and the game's line-to-file map is in `src/line-voices.js`.

Verify early scenes as well as dramatic later scenes before declaring a character voiced. A returning character must have coverage in every conversation. Cinematic narration waits for a spoken cue to finish before its caption changes. Missing audio must leave controls and text usable.

## Film narration in the other seven games (26 November 2026)

Air Jamaica, The Mad Master, Morant Bay, Rose Hall, The Emperor's Arrival, Shark Papers and Windrush speak every film caption in the **Narrator** voice (Cartesia voice `06d22dff-4250-4f54-be10-a82700f8d924`, the owner's narrator for every game). 208 clips, mono-compatible 64 kbps MP3 at 44.1 kHz.

- The player is shared: `engine/filmvoice.js` (see `docs/ENGINE.md`). Each game's `director.js` has the same few lines: `FV.preload`, `FV.sync`, `FV.hold`, `FV.stop`. Xaymaca keeps its own copy in `src/narration.js` because it also plays a score.
- A clip is `games/<game>/site/voices/narrator-<film>-<second>.mp3`, where a dot in the second becomes an underscore (`takeoff-3_5`). A caption may name its clip with a third field instead.
- The spoken text is in `games/<game>/voice-script.json`, made by `node tools/audio/voice-script.mjs <game> --write` (numbers as words, "Mr" as "Mister", hard names respelled). The caption on screen is unchanged.
- Respelled names: **Palisadoes is said "Palisaydoze"** (owner, 26 November 2026), written that way in voice scripts. Cartesia's pronunciation dictionary did not give the right sound ("Palisades"); the respelling did. Still to check by ear: Morant, Jacmel, Takoo, Planno, Stony Gut.
- Where a clip is longer than its caption window the film waits on that caption until the clip ends (a pause of up to 2 seconds), so a line is never cut off. `node tools/audio/film-voice-check.mjs` lists those and any missing clip.
- Recording: one `text_to_speech` call per caption through the Cartesia MCP (`https://mcp.cartesia.ai/mcp`), downloaded with `tools/audio/fetch-clips.sh`. Check every batch for a clip that holds the wrong line (one did, and was re-recorded): transcribe and compare, as for Xaymaca.
- Scene text such as "Captain Ross: There it is." is read by the Narrator, not by a character voice. Character voices come later (`docs/audio/PLAN.md`).

Checked: all 208 clips present, transcribed and compared (only digit and name spellings differ), build passes for all seven games, no page errors on load. **Not yet done**: a listening pass in a browser on phone and desktop (pause and resume, skip, Read instead, sound off).

## The music bed in the other seven games (26 November 2026, owner rule 16)

Every film in Air Jamaica, The Mad Master, Morant Bay, Rose Hall, The Emperor's Arrival, Shark Papers and Windrush has an original score, 33 tracks in `games/<game>/site/scores/score-<film>.mp3`. They are synthesised by `python3 tools/audio/make-score.py <game>` (no samples, nothing licensed): slow chord pads, a low drone where the story is grave, and a few soft bells where it is gentle. Each game has its own key and mode; a film can change the mood.

| Game | Palette | Notes |
|---|---|---|
| Air Jamaica | G major, bells | The last landing is dorian and slower. |
| The Mad Master | E phrygian, low drone, no bells | Dread kept quiet and steady. |
| Morant Bay | D dorian, low pad, no bells | The riot, burning and courts are the darkest, with a slow tremolo; the dawn and today are lighter. |
| Rose Hall | E minor, thin bells | The legend is eerie; the record scenes (pages, aisle) are plainer. |
| The Emperor's Arrival | F major, warm, slow | |
| Shark Papers | C mixolydian | The verdict is dorian, without bells. |
| Windrush | F sharp major | The arrival is dorian. |

Level: peak about -13 dB, like Xaymaca's scores. The engine plays them at 0.40 and ducks to 0.17 under a voice. **These were made and measured but not yet listened to.** A listening pass on phone speakers and headphones decides whether any palette needs changing (a film can override `mood` in `make-score.py`).
