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

Write all numbers as words in the voice script only. On screen a number shows as it is written, as digits ("June 1503", "29 February 1504"): the caption text is never spelled the way it sounds (owner, 26 November 2026). A clip is chosen by its clip name, so the caption can differ from the spoken words. In Xaymaca, 1503 is “fifteen oh three”, and 29 February 1504 is “the twenty-ninth of February, fifteen oh four”. Check the actual spoken result.

The Xaymaca player uses the shared Web Audio master for dialogue and cinematic narration. Conversation clips preload as the dialogue opens. A cinematic holds its current caption when needed until the active spoken line finishes. Test these paths with normal play and muted play.

## Xaymaca full voice coverage

All non-player story dialogue, character repeat lines, and cinematic captions have assigned recordings. Faye voices Grandmother, the approved Bob Marley voice voices Cousin, Winston voices the cacique, Sizzla voices the runner, Rosie voices Miss Sharon, Daniel voices the interpreter in neutral English, and Marcos voices Diego Méndez in English with a Spanish delivery. The player speaks through captions only. The production voice list is stored in Cartesia and the game's line-to-file map is in `src/line-voices.js`.

Verify early scenes as well as dramatic later scenes before declaring a character voiced. A returning character must have coverage in every conversation. Cinematic narration waits for a spoken cue to finish before its caption changes. Missing audio must leave controls and text usable.

## Film narration in the other seven games (26 November 2026)

Air Jamaica, The Mad Master, Morant Bay, Rose Hall, The Emperor's Arrival, Shark Papers and Windrush speak every film caption in the **Narrator** voice (Cartesia voice `06d22dff-4250-4f54-be10-a82700f8d924`, the owner's narrator for every game). 208 clips, mono-compatible 64 kbps MP3 at 44.1 kHz.

- The player is shared: `engine/filmvoice.js` (see `docs/ENGINE.md`). Each game's `director.js` has the same few lines: `FV.preload`, `FV.sync`, `FV.hold`, `FV.stop`. Xaymaca keeps its own copy in `src/narration.js` because it also plays a score.
- A clip is `games/<game>/site/voices/narrator-<film>-<second>.mp3`, where a dot in the second becomes an underscore (`takeoff-3_5`). A caption may name its clip with a third field instead.
- The spoken text is in `games/<game>/voice-script.json`, made by `node tools/audio/voice-script.mjs <game> --write` (numbers as words, "Mr" as "Mister", hard names respelled). The caption on screen is unchanged.
- Respelled names: **Palisadoes is said "Palesaydoze"** (owner, 26 November 2026), written that way in voice scripts. Cartesia's pronunciation dictionary did not give the right sound ("Palisades"); the respelling did. Still to check by ear: Morant, Jacmel, Takoo, Planno, Stony Gut.
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

**Xaymaca on the shared player (26 November 2026).** `games/xaymaca/src/narration.js` keeps its exports but calls `engine/filmvoice.js`, so the director, dialogue and ending are unchanged and there is one player for all eight voiced games. Tested in a browser: the score plays at 0.40, ducks to 0.17 under a voice and returns to 0.40 when it ends; a character line replaces a caption's voice (never two voices); `stop()` silences all. The clip files and `src/line-voices.js` are untouched.

## Eight games with no film captions (26 November 2026)

Bog Walk, Eventide, Kendal, Melissa, Nanny Town, Tivoli, Marcus Garvey and Port Royal have camera scenes and title cards, not timed films. The Narrator reads **text the game already shows**, so nothing new is invented and the history stays as vetted.

- **How it works:** `engine/narrator.js` loads `voices/index.json` (exact on-screen text to clip file) and `speak(text)` plays that clip on the shared voice channel. Each game calls it from its chapter title card (`chapterFade`, or `titleFade` in Port Royal, or `card` in Tivoli) and from its camera-scene captions (`say`, in Eventide, Kendal, Melissa, Nanny). Text with no clip is silent.
- **Making the lines:** `node tools/audio/voice-lines.mjs <game> --write` lists the text and the spoken version (`voice-lines.json`); record each with the Narrator; `node tools/audio/fetch-lines.mjs <game> <first> < ids` downloads them and writes the index. It repairs a link id with a swapped or dropped character.
- **Lines recorded (109):** Kendal 47, Eventide 16, Melissa 14, Garvey 10, Tivoli 8, Bog Walk 6, Nanny 6, Port Royal 2.
- **Music (owner rule 16):** `configureCinematicBed('story')` plays `scores/score-story.mp3` under every `showCinematicSkip` scene; `nextCinematicBed('event')` picks a graver bed for the Kendal crash, the Melissa storm and the Port Royal earthquake. Made by `tools/audio/make-score.py`, 120 seconds each. Tivoli and Garvey have no `showCinematicSkip` scenes, so they have no bed yet (Tivoli's May 2010 scenes need the owner's say first).
- **Gaps:** Port Royal has only its two title cards in the scan; its chapter cards go through `startCard` and the look-shots (`LS.play` lines) are not yet voiced. Nanny's `SAY` and `CARDS`, Bog Walk's story captions (`say(who, text)`), Garvey's scene text and Tivoli's chapter text are not yet voiced. Closers (the chapter-end cards) are not voiced: the next chapter's title card does that job. A line read with a name label ("Lloyd: We are going so fast!") is read by the Narrator, not by Lloyd.
- **Delivery:** these clips use Cartesia's default delivery. They have NOT been directed per line (emotion and pace). See "Delivery" below.

## Delivery (tone and pace), open as of 26 November 2026

All 317 narrator clips (208 film captions, 109 text lines) and the earlier Xaymaca clips were recorded with default delivery. Words are checked by transcription; **how a line sounds has not been checked, by anyone**. Cartesia's `text_to_speech` takes `emotion` and `speed` per line. A plan: give each line a `delivery` (for example calm, sad, excited, tense; speed 0.85 to 1.1), keep it in the voice script next to the text, record again, and have the owner listen to the scene with the music under it. Samples (flat against directed) were sent to the owner on 26 November 2026.

## Level balance (owner, 27 November 2026)

Voices recorded on a PC microphone (the saved "woman (middle aged)", "young child" and "Small girl child") came out 10 to 14 dB quieter than the library voices. After recording and checking a game's clips, measure and balance them: `node tools/audio/balance.mjs <game> voice-cast.json [--only voiceName,...] [--write]` (target -19 LUFS, -2 dB true peak, a high-pass, light hiss reduction and gentle compression). Nanny Town's Mama, Beneba, Phibba, Quamin and Cubbenah were balanced this way (all clips now -19.3 to -19.6 LUFS, Mimba already was). **Do this for every new set of character clips, and for Port Royal's and Eventide's if a voice sounds low.** Beds sink to 0.4 while anyone speaks (`AU.voiceOn`, set by `engine/filmvoice.js`, read by `bedLevels` in `engine/audio.js`), so the background no longer rides over a voice.

**The standard (owner, 27 November 2026: "this must be a standard"):** every spoken clip in every game sits at **-19 LUFS** with a -2 dB true-peak ceiling, narrator and characters alike. `node tools/audio/balance-dir.mjs [game ...] --write` brings every mp3 in `games/<game>/site/voices` to it (a clip within 0.8 dB is left alone; a very quiet PC-microphone clip also gets the clean-up chain). Run it after recording any clips, then run it again without `--write`: it must report 0 to change. Measured before the first run: narrator clips sat near -24 LUFS in every game, Nanny Town's characters between -19 and -34, Port Royal's from -35 to -12.

## A pause between every clip (owner, 27 November 2026)

"The spoken words at the beginning do not put a pause between the sentences.. they even overlap. The pause needs to be between each full said clip."

- **Overlap at the start (fixed):** in Xaymaca, Rose Hall, The Shark Papers and Air Jamaica, Start ran the first step at once; that step is a film with no warning card, so the opening scene began behind the first chapter card, and the card's narration and the film's narration spoke together. `go(FIRST, { hold: true })` now waits for the card's Begin.
- **A pause after every clip (fixed, every game):** `engine/filmvoice.js` counts the voice channel as busy for `PAUSE` (0.6 s) after a clip ends by itself. A film's next caption waits (`FV.hold`), and anything that waits for a quiet voice (`FV.active()`, the narrator's `done()` and `after()`, look shots' `voiceBusy`) waits through it. A line due long after the last clip ended is not delayed.
- **The title intros (to re-cut in the audio pipeline):** each game's `<game>-intro.mp3` is one file, and most leave almost no gap between sentences. The longest gaps found at the sentence breaks (seconds, ffmpeg silencedetect at -38 dB): Air Jamaica 0.12, 0.09; Bog Walk 0.46, 0.25; Eventide 0.30, 0.38; Garvey 0.12, 0.08; Hutchinson 0.10, 0.13; Kendal 0.21, 0.19; Melissa 0.11 (one break not found); Morant Bay 0.25, 0.15; Nanny 0.10, 0.06, 0.13; Port Royal 0.09 (breaks not found); Rose Hall 0.11, 0.12; Selassie 0.13, 0.19; The Shark Papers (no breaks found); Tivoli 0.07, 0.26; Windrush 0.19, 0.16; Xaymaca 0.16, 0.09, 0.37. Rebuild each from one clip per sentence (the title, then each sentence of the page's intro paragraph) joined with 0.6 s of silence; they were not spliced here, since cutting a finished file without the sentence clips risks cutting inside a word.
