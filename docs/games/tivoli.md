# Tivoli: West Kingston, 1960s to today (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the plan, the rules for this game, the placeholders and the research.

- Code: `games/_tivoli/` (started from `games/_template/`; see "Code map").
- **The folder name starts with an underscore on purpose.** `tools/dist.mjs` skips such folders, so nothing here is published or listed on the menu. When the owner decides to publish, rename it to `games/tivoli/`, add the menu card, and fix the paths in this file and in `.gitignore`.
- Build: `node tools/build.mjs _tivoli --dev`, then open `http://localhost:8765/games/_tivoli/site/` (see "Test it").
- Status (14 November 2026): **scaffold only, with a second research pass done (see "Research").** It builds and runs as the template does. There are no chapters, places, people or journal yet. There is a placeholder pose layer for the gunfight scenes (`src/clips.js`) and a staging view for it.

## What this game is, and why it needs care

It tells the story of Tivoli Gardens, the West Kingston community, from before it was built to today. The centre is the security operation of May 2010 (the "incursion"), when soldiers and police entered Tivoli Gardens to arrest Christopher "Dudus" Coke, whom the United States wanted extradited. About 70 civilians died (the counts run from 69 to 76), and one soldier. Who was responsible for many of those deaths is still argued over, families are still grieving, and some of the people involved are alive.

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

Read this before writing any 2010 scene. Almost every part of the operation has more than one account. (Sources and caveats are in the Research table below.)

**Agreed by every source read**
- Vehicle entrances to Tivoli Gardens were barricaded before the operation (the Public Defender's own text says so).
- The operation began on Labour Day, Monday 24 May 2010, close to midday, led by the Jamaica Defence Force with police.
- There was gunfire. One soldier was killed.
- About 70 civilians died (the count runs from 69 to 76 depending on the source), mostly on 24 and 25 May.
- Many people were detained, some for days. (The Public Defender later said over 10,000; no source read disputes that people were held.)

**Disputed**
- **How much armed resistance there was inside Tivoli.** The security forces and their lawyers describe a fierce firefight with armed men. Nearly all the residents who testified to the Commission said they never saw armed men inside the community and did not know how the barricades went up. The Public Defender's interim report lists "the level of resistance actually encountered" among the questions still to be answered.
- **Whether civilians were killed after the security forces already controlled parts of the community.** The Public Defender's lawyer put this to commanders at the hearings. The commanders said they knew of no such killings.
- **The mortars.** 37 were fired into three open spaces. The Commission called this "a serious error of judgement" and "reckless and wholly disproportionate to the threats offered by gunmen". A former Defence Force chief wrote that "reckless" was the wrong word, and that no credible evidence showed any resident hurt by mortar fire.
- **Who was responsible for the civilian deaths.** The Public Defender's interim report (2013) investigated 44 deaths as possible extrajudicial killings. The Commission (2016) found strong evidence that members of the security forces took part in extrajudicial killings and listed 15 people it said could have been killed by police. It wrote that the police "did not acknowledge responsibility for any civilian deaths whatsoever". The police's own 2017 review cleared the five officers the Commission criticised and said there was no basis for the criticism. The Public Defender asked the Attorney General to have that review withdrawn.
- **The residents.** A lawyer for the Defence Force said the Commission should have looked at a "culture of silence" among residents. Others point to the testimony of residents who lost relatives.

**What came after**
- The Commission made 51 recommendations, among them an apology, compensation and counselling.
- Months after the operation the Government paid residents J$112 million in grants for property damage and burials. Prime Minister Andrew Holness apologised in Parliament in December 2017 ("We are truly sorry for the pain and loss that occurred"). Cabinet accepted J$200 million in compensation. By 2020 the Public Defender said over J$300 million had been paid, and that there had been no accountability within the police or the army.

**What this means for the gunfight scenes (owner's rule 4 exception)**
- The owner wants gunmen shooting back from cover, and that stays. It is the account the security forces gave, and one soldier did die of gunshot wounds. But residents told the Commission they never saw armed men inside the community, so show it carefully:
  - Gunmen are seen only at a distance and unidentified, firing from behind the barricades and buildings at the edge, never among the homes and never close to the child.
  - No numbers, no named places, no one firing first. Soldiers and police take cover and fire back, as the same accounts describe.
  - Nothing from the "disputed" list: no killings after control, no mortar damage, no one being detained roughly.
- The child hears and glimpses. It is a loud, frightening day seen from a safe place.
- Straight after, the journal page gives both accounts (the security forces' and the residents'), says who held each, and says plainly that people died.
- Chapters 6 and 7 state the findings and disagreements in plain words, with who said what. If the game showed only the gunfight, it would tell one side's version.

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

Views: `?shot=fight`, `?test=clips`. The automatic audits and the layout test are **not wired yet** because there are no places. When there are characters, `docs/PEOPLE.md` (on branch `claude/affectionate-pasteur-xvhvlq` until it is merged) also requires `?test=cloth`, `?test=walkers` and `?test=skin`. CLAUDE.md rule 8 says to wire them before the first PR that contains a place (copy the blocks from `games/kendal/src/main.js`, see `docs/TESTING.md` section 5).

## Research (14 November 2026: second pass, from primary documents and newspaper archives)

**Source grades:** **P** the document itself. **O** an official body's own statement. **N** a newspaper report (including newspaper reports of testimony). **S** secondary, or opinion.

**Read for this pass:** the full text of the Public Defender's interim report (2013, a copy published by Radio Jamaica); the US Attorney's press release on Coke's sentence; Jamaica Information Service (JIS) notices; Gleaner and Observer reports of the Commission's hearings and report (2015 to 2020). **Not reached:** the Commission's own 900-page report (see "What is left"), Hansard, the Supreme Court judgment on the extradition (a scanned PDF this environment could not read), the 1960s records. Every Commission finding below is therefore as the Gleaner reported it, and must be checked against the report before it goes in a line of dialogue.

### 2009 to 2010: the request, the emergency, the operation

| Fact | Used as | Source (grade) |
|---|---|---|
| The US request for Coke's extradition was received on 25 August 2009 | "In 2009" | Public Defender interim report, [full text](https://radiojamaicanewsonline.com/local/full-text-of-tivoli-report) (P) |
| Key steps: talks on 17 December 2009 and 12 April 2010; the Attorney General went to the Supreme Court on 14 April; heard 5 May, judgment 11 May; she decided on 17 May to sign, signed the authority to proceed on 18 May; a magistrate then issued the arrest warrant | Journal only | [Observer, 6 Sept 2010](https://www.jamaicaobserver.com/2010/09/06/how-christopher-dudus-coke-was-extradited/), a detailed account that appears to draw on Government records (N) |
| A state of emergency for Kingston and St Andrew was declared on Sunday 23 May 2010, for one month, later extended to 22 July. **Do not use 13 May**: the interim report says the proclamation was gazetted on 13 May, but a Government Printing Office witness told the Commission that a 13 May document was a counterfeit and that the real proclamation was issued on 23 May and gazetted the next day | 23 May | Interim report (P); [Gleaner, 24 Apr 2015](https://jamaica-gleaner.com/article/lead-stories/20150424/cops-fired-more-1000-rounds-after-tivoli-secured-gifford) (N, testimony) |
| On the night of 22 May a police patrol car was attacked in Mountain View Avenue, East Kingston: two police killed, eight hurt (the PM's account). The Public Defender calls it "by all appearances, an event not directly connected to the extradition request". Overnight, police stations were attacked, among them Darling Street and Hannah Town in West Kingston (set on fire and badly damaged), Rockfort and Spanish Town. Vehicle entrances to Tivoli Gardens were barricaded | Barricades and "police stations attacked" may be used. The Mountain View killings are left out. | Interim report (P). The police-station claims first come from the PM's statement; the Public Defender repeats the Darling Street and Hannah Town attacks in his own words. |
| The operation began on Monday 24 May (Labour Day), close to midday, led by the Defence Force. A Defence Force major told the Commission his troops held key areas about five hours after it began | "About midday" | Interim report (P); [Gleaner, 24 Oct 2015](https://past.jamaica-gleaner.com/article/lead-stories/20151024/were-civilians-killed-after-tivoli-secured) (N, testimony) |
| Security force losses: one soldier killed. Injuries: a police news release on the day said 7 security force members were hurt (6 shot, one of whom died); the PM later said 12 soldiers were hurt; the former police commissioner told the Commission one soldier was killed and about 40 were shot. The Public Defender does not fully accept the official figures | "One soldier died and others were hurt" | Interim report (P); Gleaner, 24 Apr 2015 (N) |
| 37 mortar rounds were fired into three open spaces, on the Chief of Defence Staff's authority. The Commission: the target area was under 550 m from civilian buildings (guideline 700 m), "a serious error of judgement", "reckless and wholly disproportionate to the threats offered by gunmen". The Defence Force's reasons were to keep women and children indoors and to frighten gunmen. A former Defence Force chief disagreed with "reckless" | Not shown in scenes. Journal only, with both views. | [Gleaner, 15 June 2016](https://past.jamaica-gleaner.com/article/lead-stories/20160616/never-again-tivoli-commission-says-certain-high-ranking-officers) and [19 June 2016](http://past.jamaica-gleaner.com/article/lead-stories/20160619/commissioners-wrong-use-mortars-tivoli-lewin) (N) |
| Over 10,000 people were detained, some for up to a week, in makeshift holding areas in West Kingston and at the National Arena | "Many were held for days" | Public Defender, in [Gleaner, 24 May 2020](https://jamaica-gleaner.com/article/news/20200524/300m-tivoli-bill-figure-set-increase-suits-pending-public-defender-laments) (N) |

### Deaths (counts differ; the game says "about 70 civilians" and gives the range in the journal)

| Count | Source (grade) |
|---|---|
| 76 civilians and 1 soldier; the Public Defender was investigating complaints that 44 of the 76 were extrajudicial killings. Five more people were missing and four unidentified bodies might be theirs, which would make 80 civilians and 81 in all | Interim report, 2013 (P) |
| 74 civilians and 1 soldier | Office of the Public Defender, as reported by the Gleaner in 2015 and 2016 (N) |
| 69 civilians and 1 soldier "confirmed dead" (the Gleaner's words); the Public Defender, Arlene Harrison Henry, is quoted as saying "Sixty-nine dead" | Gleaner, 24 May 2020 (N) |
| 73 civilians and 3 security force members | US State Department 2010 report, via an earlier search (S, not re-checked). Another Gleaner caption says 4 security force members; the interim report counts 1 soldier in the operation and 2 police killed earlier in East Kingston. |

### The Commission of Enquiry (2014 to 2016) and afterwards

| Fact | Used as | Source (grade) |
|---|---|---|
| Commissioners: Sir David Simmons (chair, retired Chief Justice of Barbados), Hazel Harris (retired High Court judge), Anthony Harriott (UWI professor). Hearings began 6 October 2014 (over 90 days; the Gleaner says they ended in February 2016, JIS says April, so say "2016"). Report tabled in the House on 15 June 2016 by Justice Minister Delroy Chuck; about 900 pages; 51 recommendations; cost J$384.5 million | Used | [JIS](https://jis.gov.jm/west-kingston-report-tabled/) (O) |
| Reported findings: police may have engaged in extrajudicial killings; 15 people listed as possibly killed by police; in one family's case the Commission found the mother "truthful" and the evidence "suggestive of deliberate murder by unidentified police officers"; it preferred the Defence Force's timelines to those of two police commanders; it recommended that named senior officers be barred from leading future operations. Residents' testimony: the Gleaner reports scores of residents describing relatives, friends and neighbours "killed in cold blood" by the security forces, and nearly all saying they never saw armed men inside | Journal, attributed. **No victim or officer is named in the game.** | [Gleaner, 15 June 2016](https://past.jamaica-gleaner.com/article/lead-stories/20160616/never-again-tivoli-commission-says-certain-high-ranking-officers) (N); the report itself not read |
| The police review of 2017 cleared the five named officers. The Public Defender asked the Attorney General in August 2017 to have it withdrawn and had no answer by 2020. Prime Minister Holness apologised in Parliament in December 2017. J$112 million in grants; J$200 million compensation accepted; over J$300 million paid by 2020; the Government agreed to pay up to J$100,000 a day to settle 29 detention lawsuits | Used, attributed | [Gleaner, 24 May 2020](https://jamaica-gleaner.com/article/news/20200524/300m-tivoli-bill-figure-set-increase-suits-pending-public-defender-laments) (N) |
| A Defence Force lawyer (Peter Champagnie) said the report should have addressed a "culture of silence" among residents and gave the impression the enquiry was to "appease" residents | Used as the other side | [Gleaner, 17 June 2016](https://past.jamaica-gleaner.com/article/news/20160617/tivoli-report-didnt-hold-citizens-culpable-lawyer) (N) |

### Coke and the United States

| Fact | Used as | Source (grade) |
|---|---|---|
| Arrested near Kingston on 22 June 2010 (the US says 22 June; some Jamaican reports say 23 June). On 24 June he waived his extradition hearing in Jamaica and was flown to the US that afternoon. Pleaded guilty on 31 August 2011 to racketeering conspiracy and conspiracy to commit assault with a dangerous weapon in aid of racketeering. Sentenced on 8 June 2012 to 23 years. The US government describes him as leader of the "Shower Posse" ("Presidential Click") and says Tivoli Gardens was "guarded by a group of gunmen" at his direction | Journal only, and the US description is attributed to the US | [US Attorney, SDNY, 8 June 2012](https://www.justice.gov/archive/usao/nys/pressreleases/June12/cokechristophersentencing.html) (O); [JIS](https://jis.gov.jm/coke-waives-right-for-extradition-trial-off-to-the-us/) (O) |
| A pastor who drove him was convicted in 2016 of attempting to pervert the course of justice | Not used | Gleaner, 24 May 2020 (N) |

### Before 2010: the origins

| Fact | Used as | Source (grade) |
|---|---|---|
| Tivoli Gardens was built in the 1960s after Back-O-Wall was demolished, by the Ministry of Housing, with the West Kingston Trust paying for social and cultural facilities (clinic, creche, schools, a community centre with drama, singing and a steel band). Edward Seaga says it "thrived for about four years" and that politically motivated violence changed it from the mid-1970s; he says gangs took hold in the late 1990s. He also says the name comes from an old cinema called Tivoli | Chapters 1 to 3, attributed to Seaga | [Observer, 2010](https://jamaicaobserver.com/news/how-tivoli-got-its-name) (S: his own account in an interview) |
| A critic's account: the clearance was a bulldozing organised by Seaga, Tivoli was the first "garrison", and before 2010 it had a very low street crime rate (the police agree), with Coronation Market and the weekly Passa Passa street dance close by | Attributed. It is an opinion piece. | [Gleaner, Tafari-Ama, 2021](https://past.jamaica-gleaner.com/article/focus/20210523/imani-tafari-ama-tumultuous-history-tivoli-gardens) (S, opinion) |
| Dates differ: building 1963 to 1965; about 2,000 people removed from Back-o-Wall in 1966; Phase I followed a 1963 removal of 932 families. Seaga's title is given as Minister of Housing in one source and Minister of Development in another | "In the 1960s"; "a government minister" | [Wikipedia](https://en.wikipedia.org/wiki/Tivoli_Gardens,_Kingston) (S) |

### Not found in anything read (do not use)

- Armoured vehicles and helicopters: not mentioned in the interim report. The soldiers and police are described, and 37 mortar rounds were fired.
- Anything that says exactly where gunmen were, or how many.
- The Rastafari community of Back-o-Wall and the 1960s clearance in primary sources (Hansard, 1960s Gleaner). Only Seaga's account and one opinion piece were read.

Real people in the game: none speak. Coke, politicians, commanders, officers and every named victim appear nowhere, or only in the journal as facts from the record.

## What is left

1. **Get the Commission of Enquiry's own report and read it.** It is about 900 pages and could not be downloaded in the second research pass (the Jamaicans for Justice archive copy of Chapter 1 timed out and the Gleaner's "full report" link is dead). Try the Ministry of Justice or the House of Representatives, or drop a copy into the repo. Until then every Commission finding in this file is as the Gleaner reported it. Also still to read: Hansard (the PM's statements), the Supreme Court judgment on the extradition (a scanned PDF, needs OCR), the Public Defender's final report (only the 2013 interim report was read), and 1960s sources for Back-o-Wall and the Rastafari community there.
2. **The open decision** above (the West Kingston reviewer), and the elder's name and age.
3. **A reviewer from West Kingston.**
4. **Characters.** Tivoli needs its own people: the elder, a child, neighbours, police and soldiers in real uniforms, gunmen in everyday clothes. Skin must follow CLAUDE.md rule 9. See `docs/PIPELINE.md`.
   - **Before adding any character**, run `git fetch --depth=50 origin claude/affectionate-pasteur-xvhvlq` and read `docs/PEOPLE.md` from that branch (`git show origin/claude/affectionate-pasteur-xvhvlq:docs/PEOPLE.md`). Follow it for every person. It may change before it is merged, so read it again at the start of each character session.
   - **Owner's rules for this work:** put recipes in `tools/tivoli/people/` (one JSON file per body, named after the body); keep all game work inside `games/_tivoli/`; do **not** edit `tools/garvey/era.py`, `tools/people/pack.mjs` or anything in `engine/`, because another branch is changing them.
   - **What PEOPLE.md requires, in short:** every recipe sets `era`, `hat` as a list of `[kind, material]` pairs, `collar` as a kind, and `colors` for every garment. Children are real child bodies built with `upscale` (start from Kendal's `boy.json` and `girl.json`). Build with `era.py`, pack with `pack.mjs --out games/_tivoli/site/models --lo <name>` (always pass `--out`). Skin follows CLAUDE.md rule 9. Wire `?test=cloth`, `?test=walkers` and `?test=skin` as well as audit, held and layout (see "Test it").
   - **Open problem (found 14 November 2026):** `era.py` dresses people for about 1900 to 1957 and for 2020. The 1960s chapters can start from the 1957 clothes and the 2010 civilians from the 2020 ones. But 2010 police and soldier kit (uniforms, helmets, vests) is not in `era.py`, and the uniform cap is the only uniform piece. Use plain stand-ins (Kendal's guard uniform recoloured) until the other branch's work lands or the owner says how to proceed. Do not edit `era.py` to fix it.
5. **Places**: Back-o-Wall, new Tivoli streets and flats, a home interior, a rooftop or window view, the community centre.
6. **The real gunfight clips** (table above), weapon props, flashes and sounds.
7. **Story code**: chapters, journal, goals, saving (copy the patterns from `games/kendal/src/`).
8. **Wire the automatic audits and layout test** before the first PR that has a place.
9. **The menu card and the poster**, once the owner decides to publish.
