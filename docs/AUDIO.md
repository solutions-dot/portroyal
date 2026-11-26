# Audio production for PastPort

Use this workflow for opening narration, in-game dialogue, cinematics, music, and endings. Xaymaca is the first implementation with timed narration and an original score across all seven cinematics.

## 1. Make a cue sheet and cast the story

Read the current game script and source before recording. Map each spoken moment to its chapter, dialogue step, film time, or ending card. Include the exact words, speaker, delivery, and any moment to leave quiet. Start with the narrator and characters who carry the story.

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
