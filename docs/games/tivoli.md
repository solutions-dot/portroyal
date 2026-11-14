# Tivoli: West Kingston, 1960s to today (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the plan, the rules for this game, the placeholders and the research.

- Code: `games/_tivoli/` (started from `games/_template/`; see "Code map").
- **The folder name starts with an underscore on purpose.** `tools/dist.mjs` skips such folders, so nothing here is published or listed on the menu. When the owner decides to publish, rename it to `games/tivoli/`, add the menu card, and fix the paths in this file and in `.gitignore`.
- Build: `node tools/build.mjs _tivoli --dev`, then open `http://localhost:8765/games/_tivoli/site/` (see "Test it").
- Status (14 November 2026): **scaffold only.** It builds and runs as the template does. There are no chapters, places, people or journal yet. There is a placeholder pose layer for the gunfight scenes (`src/clips.js`) and a staging view for it.

## What this game is, and why it needs care

It tells the story of Tivoli Gardens, the West Kingston community, from before it was built to today. The centre is the security operation of May 2010 (the "incursion"), when soldiers and police entered Tivoli Gardens to arrest Christopher "Dudus" Coke, whom the United States wanted extradited. More than 70 civilians died. Who was responsible for many of those deaths is still argued over, families are still grieving, and some of the people involved are alive.

It is the hardest subject in the family. The usual rules hold (CLAUDE.md rules 2, 3, 4), and the sections below add to them.

## Decisions

**Settled by the owner**
- The game covers the whole history, with May 2010 as the centre.
- The 2010 chapters show police and soldiers shooting and taking cover behind buildings, and gunmen shooting back from hiding places. **No one dies on screen.** The owner says these scenes are integral.
- Real animations (crouch, duck and so on) will come later. Placeholders now (see "Placeholder poses").
- **CLAUDE.md rule 4 is changed for this game only** (done). It now carries a one-sentence Tivoli exception with the limits below: seen from a safe place, behind an opt-in card, no one hit, no blood, the player never holds or fires a weapon. Every other game keeps "fights happen in the background".
- **A fictional elder is the thread through the chapters:** a girl in the 1960s chapters and a grandmother in 2010, with a child as the main character from chapter 4 on. Her name and exact age are still to choose, so the dates fit (a girl in the 1960s is about 55 in 2010). Like Mass Ezra in Kendal, she is fictional and her journal page says so.
- **No "play with a grown-up" note on the menu card.** The game keeps the same audience as the others (6 and up, plus adults). The in-game protection stays: the opt-in card before the gunfight, with "Read what happened instead".

**Proposed by Claude.** The first four points (the player never fires, the opt-in card, the safe place, no one hit and no blood) are now also in CLAUDE.md rule 4, so they are settled. The rest are still to be confirmed.
- The player never fires and never holds a weapon. No crosshair.
- The gunfight is a directed scene, like the Kendal crash: an opt-in card first ("It is loud, and it may be scary", with "Begin" or "Read what happened instead").
- The child sees it from a safe place (a window, a roof, a gap in a fence), with the camera cutting between wide views.
- Gunfire is shown as muzzle flashes, dust on walls, sparks and broken glass. No blood. Nobody is hit and nobody falls.
- Because the scene shows no one falling, the game and the journal say plainly, right after it, that many people died, most of them civilians. The scene shows what a child could see. The words say the rest.
- Gunmen are called "gunmen" in the text, never "thugs". In the scenes they wear ordinary clothes, because they looked like their neighbours. Police and soldiers wear their real uniforms.
- Real people (Coke, politicians, commanders, officers) never speak and never appear. They are named only in the journal, as facts from the record.
- Fair telling of the disputed parts: say who found what, and who disagreed (see "The dispute").
- Settings to turn off screen shake and to turn down loud sounds. (Kendal still lacks the shake setting.)

**Open (waiting for the owner)**
1. A reviewer from West Kingston before anything is published (Claude recommends yes).

## The story (proposed)

| # | When | Story |
|---|---|---|
| 1 | Before the 1960s | Back-o-Wall, a crowded settlement in West Kingston, and the housing shortage |
| 2 | 1960s | The clearance and the new Tivoli Gardens homes. People still disagree about it. |
| 3 | 1970s to 2009 | Politics and community leadership grow together (the "garrison" idea, explained simply). A local leader. The 2009 extradition request. |
| 4 | May 2010, before | The state of emergency, barricades, the family waits |
| 5 | May 2010, the days | The gunfight scenes, then the days indoors |
| 6 | After | Missing people, funerals, the Public Defender and the Commission |
| 7 | 2016 to 2017 | The Commission's report, and the disagreement that followed |
| 8 | Today | The community now |

You are fictional. Every person you talk to is fictional, and each journal page says so. The events, the places and the findings are real.

The thread is a fictional elder. In chapters 1 and 2 she is a girl in Back-o-Wall and then in the new Tivoli. In chapter 3 she grows up and raises a family. In chapters 4 to 6 she is the grandmother of the child you play. In chapters 7 and 8 she looks back with you.

## The dispute (what the game must tell, with attribution)

The gunfight is the least disputed part of 2010. The most disputed part is how many civilians were killed unlawfully.

- The Public Defender's interim report (2013) counted 76 civilian deaths, 44 of them alleged extrajudicial killings by security forces.
- The West Kingston Commission of Enquiry (chair: Sir David Simmons) published its report on 15 June 2016. It recommended an apology and compensation for residents.
- In 2017 a police review cleared five officers and questioned the Commission.

Chapters 6 and 7 state these findings and disagreements in plain words, with who said what. If the game showed only the gunfight, it would tell one side's version.

## Placeholder poses

The game asks for a pose by its real clip name through `pose(name)` in `games/_tivoli/src/clips.js`. If the shared animation library has that clip, it plays. If not, a stand-in (an existing clip) plays, so scenes can be built and timed now.

| Real clip to add | Stand-in now | What the real clip must show |
|---|---|---|
| `CrouchIdle` | `Block` | Crouched or kneeling behind cover, weapon low, small breathing. Loops. |
| `DuckDown` | `Block` | Drop quickly from standing to a crouch at a shot. Plays once, ends in `CrouchIdle`. |
| `CrouchAim` | `Point` | Crouched, weapon raised, aiming over cover. Loops. |
| `CrouchFire` | `Point` | Crouched, firing over cover with a small recoil. Short loop. |
| `StandAim` | `Point` | Standing, weapon raised, aiming. Loops. |
| `StandFire` | `Point` | Standing, firing with a small recoil. Short loop. |
| `PeekAround` | `Idle` | Lean out from a wall corner, look, pull back. Plays once. |
| `RunLow` | `Run` | Run bent over from one cover to the next. Loops, in place. |
| `AdvanceReady` | `Walk` | Walk with the weapon at the ready, slow and steady. Loops, in place. |

To swap in a real clip:
1. Download it from Mixamo ("In Place", FBX without skin), add it to `tools/anims/clips.json` and rebuild the library (`docs/PIPELINE.md`, section 2).
2. Add its name to `games/_tivoli/anim-clips.json`. Do this only **after** the clip is in the library: the build stops with "clips not in the library" for a name that is missing.
3. Rebuild. The stand-in drops out by itself. No game code changes.

Checks (dev build):
- `?test=clips` lists the poses that still use a stand-in, in the page title and the console. It must be empty before anything is published.
- `?shot=fight` shows every pose in a row on its current clip, in front of a low wall. The stand-ins read weakly: `Block` is a guarded forward bend and `Point` barely reads as aiming. That is expected.

Still needed when the real clips arrive: a weapon prop with a two-handed grip (`engine/grip.js` only does one hand today, and the result must pass `?test=held`), muzzle flashes, gunshot sounds made in code (see `engine/audio.js` and `games/kendal/src/sfx.js`), and cover spots that the place audit accepts (people close to walls).

## Code map

| File | What it holds |
|---|---|
| `src/main.js` | The template's starting point (scene, movement, one talking person), plus the dev-only block `devViews` (`?shot=fight`, `?test=clips`). |
| `src/clips.js` | `POSES` (real name, stand-in, what it must show), `pose(name)`, `standIns()` |
| `anim-clips.json` | The clips the build keeps in this game's copy of the animation library: `Idle, Walk, Run, Talk1, Block, Point, Terrified` (214 KB instead of 979 KB) |
| `site/models/sailor.js` | The template's stand-in character. Tivoli needs its own people (see "What is left"). |

## Test it

```bash
npm install
node tools/build.mjs _tivoli --dev          # dev build
python3 -m http.server 8765                 # then open http://localhost:8765/games/_tivoli/site/
```

Views: `?shot=fight`, `?test=clips`. The automatic audits and the layout test are **not wired yet** because there are no places. CLAUDE.md rule 8 says to wire them before the first PR that contains a place (copy the blocks from `games/kendal/src/main.js`, see `docs/TESTING.md` section 5).

## Research (checked 14 November 2026 against secondary sources only)

Nothing here was checked against the Commission's report, the Public Defender's report, court records or newspaper archives. Do that before writing any line of story. Where sources disagree the game says "about" or "some say".

| Fact | Used as | Source and caveat |
|---|---|---|
| Tivoli Gardens was built in West Kingston in the 1960s by clearing Back-o-Wall. Dates differ: building 1963 to 1965; about 2,000 people removed from Back-o-Wall February to July 1966; Phase I followed a 1963 removal of 932 families (3,658 people) from the Foreshore Road area | "In the 1960s" | [Wikipedia](https://en.wikipedia.org/wiki/Tivoli_Gardens,_Kingston); the dates overlap, so they conflict |
| Edward Seaga became West Kingston's MP in 1962. A Gleaner opinion column says he organised the clearance as Minister of Housing | Say "critics say" for the column's claim | [Gleaner, Tafari-Ama, 2021](https://past.jamaica-gleaner.com/article/focus/20210523/imani-tafari-ama-tumultuous-history-tivoli-gardens) (opinion) |
| How many lived in Back-o-Wall: Seaga's own account says about 1,500 on 40 acres; the Observer cites well over 5,000 | "People disagree about how many" | Gleaner and [Observer](https://jamaicaobserver.com/news/how-tivoli-got-its-name) |
| The clearance as slum clearance in a housing shortage (historian Clinton Hutton) versus a forced removal and "garrisonisation" (critics) | Both views, plainly | Gleaner (above) |
| US extradition request for Christopher Coke in 2009 (one source says August) | "In 2009" | [Wikipedia](https://en.wikipedia.org/wiki/Christopher_Coke); [InSight Crime](https://insightcrime.org/investigations/how-jamaica-tried-to-stall-dudus-coke-extradition/) |
| State of emergency declared 23 May 2010; the operation began 24 May | Used | Wikipedia (citing the New York Times and Reuters, 23 May 2010); Observer |
| Coke captured 23 June 2010; waived his extradition trial 24 June; pleaded guilty in 2011; sentenced to 23 years (the maximum). One source gives 22 June for the raid, which conflicts with the rest. The sentencing date was not found. | Journal only | [JIS](https://jis.gov.jm/coke-waives-right-for-extradition-trial-off-to-the-us/); [Caribbean Journal](https://www.caribjournal.com/?p=14822) |
| Deaths: the Public Defender's interim report says 76 civilians, 44 of them alleged extrajudicial killings; a later Gleaner piece says 74 civilians and one soldier; the US State Department says 73 civilians and 3 security force members; Seaga estimated as many as 150. One soldier died and 40 others were shot, per the 2015 Commission hearings. | "More than 70 civilians" in the story; the range in the journal | [Washington Examiner](https://www.washingtonexaminer.com/?p=2232087); [Amnesty](https://www.amnesty.org/ar/wp-content/uploads/2021/07/amr380022014en.pdf); Gleaner |
| The Commission of Enquiry (chair Sir David Simmons) published a report of about 900 pages on 15 June 2016. It recommended an apology and compensation. | Used, with attribution | [Gleaner, June 2016](https://images.jamaica-gleaner.com/article/lead-stories/20160630/lobby-action-amnesty-intl-demands-govt-move-quickly-implement-west); [Stabroek News](https://stabroeknews.com/2016/06/17/news/regional/commissioners-tell-jamaica-govt-pay-tivoli-residents) |
| A 2017 police review cleared five officers and questioned the Commission. A JDF lawyer said the report should have examined a "culture of silence" among residents. | Used, as the other side of the dispute | [Global Voices, 2017](https://globalvoices.org/2017/08/12/jamaica-police-review-absolves-officers-in-tivoli-gardens-incursion/) |
| Barricades in Tivoli Gardens | Used generally. The Public Defender's report describes a siege. | Search results; needs the Commission report |
| Attacks on police stations, armoured vehicles | **Not found. Do not use** until a primary source confirms them. | None |

Real people in the game: none speak. Coke, politicians, commanders and officers appear only in the journal, as facts.

## What is left

1. **Research in primary sources**: the Commission's report (the hearings and Chapter 15 for the deaths), the Public Defender's reports, the Gleaner and Observer archives. Replace this table's "secondary only" note.
2. **The open decision** above (the West Kingston reviewer), and the elder's name and age.
3. **A reviewer from West Kingston.**
4. **Characters.** Tivoli needs its own people: the elder, a child, neighbours, police and soldiers in real uniforms, gunmen in everyday clothes. Skin must follow CLAUDE.md rule 9. See `docs/PIPELINE.md`.
5. **Places**: Back-o-Wall, new Tivoli streets and flats, a home interior, a rooftop or window view, the community centre.
6. **The real gunfight clips** (table above), weapon props, flashes and sounds.
7. **Story code**: chapters, journal, goals, saving (copy the patterns from `games/kendal/src/`).
8. **Wire the automatic audits and layout test** before the first PR that has a place.
9. **The menu card and the poster**, once the owner decides to publish.
