# Eventide 1980: the game plan (story draft)

Status: **story plot, agreed by the owner on 13 Nov 2026.** No code, models or menu card exist yet, and the facts still need the second research pass. Read `CLAUDE.md`, `docs/NEW_GAME.md` and `docs/games/garvey.md` first. Garvey is the closest model: its panels, journal, chapters, saving and helper arrow are the ones to copy, and two of its activities are reused below.

Owner decisions (13 Nov 2026): **the hero is a fictional child who is grown in chapter 7**; **two of the four women get out, and they are Miss Pearl and Miss Maude**; **the night chapter can be a little more detailed, but never graphic**. The owner also agreed the storyline as a whole, which includes the other recommendations at the end of this file.

Working title: **Eventide 1980**. Code would live in `games/eventide/` (copied from `games/_template/`, then the Garvey panels).

## The idea in one paragraph

A fictional child lives near Slipe Pen Road in Kingston and visits friends in the Eventide Home, a government home for poor old women, in May 1980. The child gets to know four women in the old wooden Myers Ward, hears their lives, and says goodnight to them on a Monday evening. In the early hours of Tuesday 20 May the ward burns. The child watches from behind the police rope, holds a gate while the children from the next building are led out, and finds two of the four women wrapped in blankets by the road. The other two did not get out. The child then goes with Gran to the day of national mourning, when the women who died are laid in one grave at National Heroes Park. Later chapters ask what is known and what is only rumour, and the last chapter is at the monument today, where the grown-up hero tells a young listener who the women were.

## What it is like to play

**The feel.** The same as Port Royal and Garvey: a first-person 3D game in the browser, on a phone or a computer. Walk with the keys or the touch joystick, drag to look, tap a person with a glowing speech mark to talk. A small Goal tab says what to do next, and a gold arrow helps if you stall. The Journal collects pages with a plain side and a "Dig deeper" side. Progress saves in the browser. There are no scores, meters or lives, so you cannot lose. Your choices show up as what people say to you later.

**The shape.** My target is about 5 to 10 minutes a chapter (a design aim, not measured), so the whole story is under an hour. The mood runs: warm (chapters 1 to 3), the night (4), grief and quiet (5), questions (6), remembering (7). Each chapter ends with the "Next chapter" card and a "History / Story" journal page.

**What you do.** Talk and listen. Read a letter aloud. Tidy a woman's things by tapping an item and then its place (Garvey's page builder, with new content). Hold a gate. Hand out blankets. Lay a flower. Sort six cards into fact, opinion or rumour. Put six events in order on a timeline board.

**What you never do.** Fight, race a clock, solve a puzzle to save someone, or see anyone hurt.

## The footnote

Port Royal is about one earthquake and the people in it. Eventide is a fire that history books give a few lines, and those lines sit inside a bigger story: the violent 1980 election year. The game's job is to turn that line back into people. It does this the way Port Royal did, with a real event, real places and fictional neighbours who say they are fictional. The one thing it cannot copy from Port Royal is a real person at the centre. The second research pass found a few real names in old news reports (see "Second research pass"), but too little about any one person to tell a whole game through her, so the hero stays fictional, as in Garvey, as the owner agreed.

Dramatic question: **who gets remembered, and who looks after people who cannot look after themselves?**

The line the whole game answers, from a real speaker: Jean Lowrie-Chin, founder of the Caribbean Community of Retired Persons, laid a wreath at the monument in 2020 and said, "These elderly women, they must have done so much to build this country." (Gleaner, 20 May 2020). Use it in "Dig deeper", with her name.

## How the fire is told (owner rule 4, applied)

This is the hardest history in the family of games: it is recent, relatives are alive, the victims were poor, old and disabled, and the cause is political and unproven. These rules are part of the plan, not polish.

1. **The fire can be seen, but never inside it.** From behind the police rope the player sees the old ward burning: flames in the windows and along the roof, sparks, thick smoke, firefighters with hoses and ladders, and the roof and walls falling, all at a distance. Never show the inside of the ward, any person in the fire, or any person hurt. No burns, blood or bodies.
2. **Sound can be big, but never distressing.** Sirens, engines, the roar and crackle, neighbours calling to each other, a hymn from the crowd, then quiet. No screams or cries of pain. Women who got out are shown tired and wrapped in blankets, with no visible injuries.
3. **The player is never in danger** and the rope stops the player near the fire (the same kind of clamp as `clampPos`).
4. **No choice in the night chapter.** Nothing you do changes what happened, and a line says so: "They could not get in, child. It was too fast." (Real fact: firefighters could not enter and the building fell about four minutes after they arrived.) This stops a child feeling it was their fault.
5. **Numbers only in the Journal, said plainly:** "More than 140 women died. Sources give different numbers, from 144 to 157." About 58 of the women in the ward got out. No counting of bodies on the main path.
6. **The cause is never settled.** The game says: "Nobody has proved what started the fire. People still disagree." No party, person or group is named as the cause on the main path. "Dig deeper" gives what was said at the time, fairly: on 20 May 1980 the Prime Minister told Parliament the cause was unknown and arson could not be ruled out, the opposition leader said he believed it was an accident, and early reports from the security forces pointed to arson (AP, 21 May 1980). Later accounts add that phone lines were said to be cut and that the fire chief thought an electrical fault possible. Then the 1981 inquest.
7. **Left out completely:** the smell, any account of what people inside went through, anything about bodies, burns or injuries, and any claim that doors or windows were locked (no source read says so).
8. **Staff are not blamed.** The Home had about 180 staff for about 700 residents (JNHT), and the Journal can say plainly that it was crowded and old.
9. **Real officials appear only as distant figures at the burial, with no fictional speech.** News comes through a fictional radio voice that only says documented facts ("Monday is a day of national mourning").
10. **A "This chapter is sad" card** before chapter 4, with "Continue" and "Skip to the morning". The game is for ages 6 and up.
11. **A review step before it goes public:** have a Jamaican heritage or elder-care person read the finished game. Families of the women are alive.

## The hero

- Fictional, first person "you", no name (as in Garvey). About 11 in 1980.
- Lives on a lane off Slipe Pen Road with **Gran** (fictional), who visits her friend in the Home on Saturdays.
- In chapter 7 you are the same person grown up (about 57 in 2026) at the monument with a young listener, as chapter 8 of Garvey jumps to the present.
- The journal says: the hero, Gran, and the four women are fictional and stand for the real women of Eventide.

## Chapters

Seven chapters, in the Garvey pattern: one place, one or two hands-on activities, one remembered choice. Branches rejoin so each chapter has one `done()` test for the autoplayer.

| # | Where and when | Walk and do | Remembered choice |
|---|---|---|---|
| 1 | **Slipe Pen Road**, a Saturday in early May 1980 | Ride the No. 43 bus with Gran. Walk past the shops and the cemetery wall to the gate of the Home. Meet the gatekeeper, then Miss Iris, a blind woman on the Myers Ward veranda. Give her your gift and read her a letter aloud. Journal: "Eventide Home" (opened 1 July 1870, paid for by the city). | What you bring Miss Iris: mangoes, radio batteries, or a song. She mentions it later. |
| 2 | **Inside Myers Ward**, the same afternoon | A long wooden hall of iron beds close together, because it holds more women than it was built for. Meet Miss Pearl (sold yam at the market), Miss Maude (taught children to read) and one more. Help each woman put her things back where she likes them (a photo, a Bible, a comb, a radio). Each item opens a "life" journal page. | Whose story you sit with longest. If she got out, you visit her first in chapter 6. If she did not, you speak of her first at the monument in chapter 7. |
| 3 | **Goodnight**, Monday 19 May, dusk | A quiet evening on the veranda. A hymn. A fictional radio voice talks about the election campaign and the grown-ups look worried. The nurse on duty says "We have more ladies than beds." Say goodnight to each woman. Nothing sad happens, and the player is never warned. | Your words at goodnight ("I will come Saturday"). They come back at the monument in chapter 7. |
| 4 | **The night**, Tuesday 20 May, about 1 a.m. | Woken by sirens and an orange light on the ceiling. Run with Gran to the corner and stop at the police rope. From there you see the old wooden ward burning: flames in the windows and along the roof, sparks, thick smoke, the engines from Kingston and St Andrew, firefighters with hoses and ladders, and a crowd of neighbours. A firefighter asks you to hold the gate while the children from the nearby building are led out to the road. The roof and walls fall, seen from far off, and the crowd goes quiet. Hand blankets to the children and to the women who got out. You find Miss Pearl and Miss Maude sitting wrapped in blankets and ask after Miss Iris and the others. A nurse says, "We are checking every name." Dawn: smoke over the road, the No. 43 bus waved through by a police officer. | None. The card before it offers "Skip to the morning". |
| 5 | **A day of mourning**, Monday 26 May, National Heroes Park | Thousands in the park. Walk with Gran to the grave. Hear three mourners (a retired nurse, a neighbour, a man whose aunt lived at the Home). See the Home's staff walking to the grave and an old lady being comforted. Learn that Miss Iris and the fourth woman did not get out. A nurse from the Home says it plainly and gently. | How you take part: lay a flower, sing, or stand quietly. People later remember it. |
| 6 | **After**, 1980 to about 1985, the new Golden Age Home | Visit Miss Pearl and Miss Maude, who got out. Hear what changed: a committee, a new home, an inquest in May 1981 that found no one criminally responsible. **Fact, opinion or rumour:** Miss Maude, the teacher, marks your six cards (reuse Garvey chapter 7), then choose a fair question to ask about the cause. | The fair question you ask about the cause. |
| 7 | **The monument**, National Heroes Park, 20 May today, the National Day of Remembrance | You are grown. People are laying flowers at the real monument, a white concrete triangle with a black plaque. A young listener asks who the women were. Put six events on the timeline board (reuse Garvey chapter 8): 1870, 1980, the burial, 1981, the new home, the memorial day. Lay a flower for each of the two women who did not get out, read the plaque's real words, and tell the listener who they were. The shrine of Marcus Garvey is in the same park. Journal gets a "Your journey" page. | The final answer: what a country owes the people who cannot look after themselves. |

Optional extra, only if wanted later: a short **1870 flashback** for the Home's opening, like Port Royal's Ned story. Every scene would be fictional and labelled, so it is not needed for the main arc.

### Rule of truth

Big events stay as they happened. Your choices change what you learn, what people say to you later, and who you speak of first at the monument. Nobody can be saved, and which two women get out is fixed, not a choice. Every chapter ends with a "History / Story" journal page that says what really happened and what was fictional.

## Cast

| Who | Real or fictional |
|---|---|
| The hero (child, then grown) | Fictional |
| Gran | Fictional |
| Miss Iris, Miss Pearl, Miss Maude and one more woman | Fictional. They stand for the real women. The journal says so. Miss Pearl and Miss Maude get out. Miss Iris and the fourth woman do not. |
| The gatekeeper, the nurse on duty, a firefighter, a police officer, the radio voice, three mourners, the young listener, the children from the nearby building | Fictional |
| Governor General Florizel Glasspole, Prime Minister Michael Manley, Edward Seaga | Real. Seen only as distant figures at the burial (chapter 5), no speech. |
| Allen Ridgeway, Kingston's fire chief | Real. Named only in "Dig deeper". |
| The real residents who died or survived | Never named in the game. A few names appear in old reports (see "Second research pass"). |

## What really happened (the facts the game stands on)

Each line is checked against at least one source below. "Sources differ" lines are listed again under "Research".

- **1 July 1870:** the Eventide Home opens on Slipe Pen Road, Kingston 5, for old women. It is paid for by the city's "poor rates" and later takes in old men and disabled children too. (JNHT; Local Government Jamaica.)
- **By 1980:** about 700 residents and about 180 staff. Three buildings. Newspapers had reported poor conditions for years. (JNHT; Gleaner 2020.)
- **Tuesday 20 May 1980, about 1 a.m.:** fire in the Myers Ward, an old two-storey wooden building with 204 to 211 women in it against a legal limit of 180. Kingston and St Andrew crews arrive quickly but cannot enter. The building falls about four minutes after they arrive. They carry disabled children out of a nearby building and stop the fire spreading to the rest of the Home.
- **That morning:** smoke over Slipe Pen Road. A Gleaner reader remembers a police officer waving the No. 43 bus on.
- **The next day's reports (AP, 21 May 1980):** police say 205 women were in the building: 144 killed, 9 missing, 52 rescued. The Prime Minister tells Parliament the cause is unknown and arson cannot be ruled out. The opposition leader says he believes it was an accident.
- **Monday 26 May 1980:** a day of national mourning. About 145 of the dead are buried in 26 wooden coffins in one grave at National Heroes Park. Thousands attend. A memorial service is held at Holy Trinity Cathedral on North Street. The Governor General and the Prime Minister read the lessons, the opposition leader reads the Gospel, and the grave is sealed with concrete and steel slabs. (Gleaner, 2023 photo flashback.)
- **August 1980:** RJR, the radio station, is given an award for running the Eventide Home Rebuilding Fund. (National Library of Jamaica photograph record.)
- **30 October 1980:** the general election. The JLP (Edward Seaga) wins 51 of 60 seats from the PNP (Michael Manley). The campaign was very violent. Sources say hundreds died. About six months after the fire, gunmen attack the Home again and two people are hurt (JNHT).
- **5 May 1981:** a coroner's jury meets for 17 minutes and finds no one criminally responsible. (Gleaner 2020.)
- **About 1984 or 1985:** the survivors are moved to the new Golden Age Home. (Dates differ.)
- **1981:** Sistren Theatre Collective stages *QPH* (*Queenie, Pearlie, Hopie*), about three women who lived at Eventide. (Wikipedia gives 1997, probably a later staging.)
- **2020:** a wreath-laying at the monument on the 40th anniversary.
- **2025:** Cabinet approves a National Day of Remembrance on 20 May each year. It is a day of remembrance, not a public holiday. (JIS, 29 May 2025.)
- **20 May 2026:** the first National Day of Remembrance: a floral tribute at the monument, with a guard of honour of forty women from the Jamaica Fire Brigade. (JIS, 23 May 2026; Local Government Jamaica, 27 May 2026.)

## Research

The first pass (13 Nov 2026) used secondary sources only. The second pass, the same day, added a 1980 AP wire report, library photograph records and a photograph of the monument (see "Second research pass"). **The New York Times (1980), the Daily Gleaner of May 1980, Eyre's 1984 *Geographical Review* paper and Davis (1993) were not read directly.** Wikipedia cites them, so treat those lines as "reported by". No public photograph of the Home or the ward was found. Verify before any line goes in the game.

### Sources read

- Wikipedia, [Eventide Home fire](https://en.wikipedia.org/wiki/Eventide_Home_fire) (a pointer to its sources only).
- Jamaica National Heritage Trust, [Dis 'N Dat column by Daive A. Dunkley](http://www.jnht.com/disndat_eventide.php).
- Local Government Jamaica, [The History of the Eventide Home](https://www.localgovjamaica.gov.jm/the-history-of-the-eventide-home/).
- The Gleaner: [Eventide Home fire kills 153 old women](http://past.jamaica-gleaner.com/article/news/20241120/eventide-home-fire-kills-153-old-women) (20 Nov 2024), [Eventide memories still raw](https://past.jamaica-gleaner.com/article/lead-stories/20200520/eventide-memories-still-raw), [Eventide fire victims remembered 40 years later](http://past.jamaica-gleaner.com/article/news/20200520/eventide-fire-victims-remembered-40-years-later), [Eventide 40 years: elderly warehousing concern](https://past.jamaica-gleaner.com/article/lead-stories/20200520/eventide-40-years-elderly-warehousing-concern) (all 20 May 2020), and [Photo flashback: Eventide Home fire victims buried in Heroes Park](https://past.jamaica-gleaner.com/article/esponsored/20230526/photo-flashbackeventide-home-fire-victims-buried-heroes-park) (26 May 2023).
- Jamaica Observer, [May 20 on this day in Jamaican history](https://www.jamaicaobserver.com/2020/05/20/may-20-on-this-day-in-jamaican-history-the-eventide-tragedy-claims-144-lives/) (20 May 2020).
- Our Today, [Moves to have May 20 declared Eventide Home Memorial Day](https://our.today/moves-to-have-may-20-declared-eventide-home-memorial-day/) (31 May 2025).
- Second pass: AP in the [*Daily Reflector*, 21 May 1980](https://digital.lib.ecu.edu/94443); JIS, [29 May 2025](https://jis.gov.jm/eventide-home-memorial-day-to-be-commemorated-annually/) and [23 May 2026](https://jis.gov.jm/nation-urged-to-honour-memory-of-eventide-home-fire-victims-kingston/); Local Government Jamaica, [27 May 2026](https://www.localgovjamaica.gov.jm/eventide-home-fire-victims-honoured-with-national-day-of-remembrance-may-20/); National Library of Jamaica items [12021](https://nljdigital.nlj.gov.jm/items/show/12021) and [9554](https://nljdigital.nlj.gov.jm/items/show/9554); Jamaica Observer, [22 May 2011](https://jamaicaobserver.com/news/eventide-fire-remembered) and [30 May 2025](https://www.jamaicaobserver.com/2025/05/30/mckenzie-may-20-declared-eventide-memorial-day/); the Gleaner, [Political leaders join mourning](http://past.jamaica-gleaner.com/article/esponsored/20230525/political-leaders-join-mourning-eventide-victims) (25 May 2023) and [Evolution of National Heroes Park](http://past.jamaica-gleaner.com/article/art-leisure/20201018/evolution-national-heroes-park) (18 Oct 2020).
- Wikipedia, [1980 Jamaican general election](https://en.wikipedia.org/wiki/1980_Jamaican_general_election) and [National Heroes Park](https://en.wikipedia.org/wiki/National_Heroes_Park).

### Where sources disagree (the game must not pick a side silently)

| Question | What the sources say | Plan |
|---|---|---|
| How many died | 144 recovered plus 2 who died in hospital plus 7 missing and presumed dead (Observer, Gleaner 2024); 145 buried (Gleaner, 27 May 1980); 146 (JNHT); 153 (Gleaner headline); 157 (a New York Times headline, via Wikipedia); 144 killed and 9 missing (AP, 21 May 1980); 147 (an August 1980 photograph caption at the National Library) | "More than 140 women died. Sources give different numbers." |
| How many were in the ward and how many got out | 211, with 58 escaping (JNHT, Observer); 204 (Wikipedia, Our Today); 205 in the building with 52 rescued (AP, 21 May 1980). The NYT reportedly said only 33 of 204 had been found alive hours later. | "About 58 got out" with the doubt in "Dig deeper" |
| What started the fire | At the time (AP, 21 May 1980): the Prime Minister said the cause was unknown and arson could not be ruled out; the opposition leader said he believed it was accidental; early security-force reports pointed to arson. Later accounts: Prime Minister: arson possible, phone lines said to be cut. Fire chief: electrical fault possible, no proof of arson. Police noted reports of four men running from the building. A UK Home Office scientist wrote that a deliberate start could not be ruled out. The 1981 jury found no one criminally responsible. In 2025 the Observer wrote that the two main parties had accused each other. The Minister said in 2026 that the origin is still "unknown". | "Nobody has proved it." No name or party. |
| When the survivors moved | 1984 (Gleaner 2020) or 1985 (Local Government Jamaica) | "About five years later" |
| Whether the reforms worked | JNHT: the committee's ideas were not carried out and Eventide closed in the mid 1980s. Local Government Jamaica: a new home was built to avoid another fire. The Gleaner later reported poor treatment at the new home. | Say there was a new home and that people said more was needed |
| The memorial day | Settled in the second pass. Cabinet approved it in 2025, and the first National Day of Remembrance was held on 20 May 2026 (JIS, 23 May 2026; Local Government Jamaica, 27 May 2026). The proclamation text was not found. | Chapter 7 is set on 20 May |
| Who is buried | 145 (Gleaner 1980) or "140 women" (Wikipedia, National Heroes Park) | "About 145" with the doubt in "Dig deeper" |
| Whether any survivors are alive | The Observer (2011) called Joyce Thompson, who died about 2009, the last direct survivor. JIS (May 2026) says 20 former Eventide residents live in the Golden Age Homes, and Local Government Jamaica calls them survivors. Former residents of the whole Home are not the same as survivors of the Myers Ward. | Assume survivors and families are alive. Keep the review step (rule 11). |

### Not found (never invent)

- Enough about any one real woman to tell her story. The second pass found a few names in old reports. The game names none of them.
- What the ward looked like inside, daily routines, why each woman was admitted.
- Whether the monument has a token for each life (one 2020 source says so, but the 2025 photograph shows none), whether the plaque has more words than can be read in the photograph, and what the low white slabs behind it are.
- The time the fire was reported, and what neighbours did that night. Chapter 4's gate-holding scene is fictional, built on the real fact that firefighters carried disabled children out. The journal says so.
- Whether the Home had fire alarms, locks or a night watch.

### Second research pass (13 Nov 2026)

| Finding | Source | How the game uses it |
|---|---|---|
| Police said 205 women were in the "Myers Building": 144 killed, 9 missing, 52 rescued. The fire started "shortly after 1 a.m." | AP, Marc D. Charney, in the *Daily Reflector*, 21 May 1980, p. 10 (East Carolina University digital collection). Read as scanned text, which is garbled in places; check the page image. | Journal numbers |
| The Prime Minister told Parliament the origin was unknown and arson "could not be ruled out". The opposition leader, Edward Seaga, said he believed it was accidental. Early security-force reports pointed to arson. | AP, 21 May 1980 | Rule 6 rewritten |
| Joyce Aikman, a resident who got out: "A few of us run out, some creep, and a blind woman, she blind but she active, she run out too." | AP, 21 May 1980 (scanned text) | Decision 10 |
| Vida Wedderburn, an assistant in the ward, is also quoted. | AP, 21 May 1980 | Not used. Her words are too graphic for the game. |
| The burial: the Governor General and the Prime Minister read the lessons, Seaga read the Gospel, Archbishop Samuel Carter presided at the memorial service, and the grave was sealed with concrete and steel slabs. Two women who died after the fire are named. | Gleaner photo flashback, 25 May 2023 | Chapter 5's scene. The names are not used. |
| RJR ran an "Eventide Home Rebuilding Fund" and won an award for it. The caption says 147 died. | National Library of Jamaica, item 12021, August 1980 | Chapter 5's radio voice can mention the fund |
| An "Edna Manley Ward play area" was opened at the Home in July 1975, so children lived there. | National Library of Jamaica, item 9554 | Background for the children's building in chapter 4 |
| "The staff at the time numbered 180 and was led by Mr. David E. Dunkley, Master of the Home." | JNHT | Confirmed, one source |
| George Pinto, a man who lived at the Home, woke when "somebody shouted out 'fire!'" and saw the walls fall. He said the men's and children's wards were partly concrete. | Jamaica Observer, 22 May 2011 | Chapter 4: woken by shouting and sirens; the other buildings are partly concrete |
| Sistren's *QPH* (1981): Queenie, Pearlie and Hopie lived together at Eventide. Pearlie was based on a real Kingston woman. | Search results citing the Gleaner (2004) and a Springer chapter; a 1981 Carifesta programme. Read the Gleaner piece before quoting. | Decision 9 (our Miss Pearl) |
| **The monument:** a tall white concrete triangle on a low tiled base, in a round red-brick paved circle with shrubs and trees. A black triangular plaque near the top has a small emblem and the words "DEDICATED TO THE VICTIMS OF THE EVENTIDE HOME FIRE / MAY THEIR SOULS REST IN PEACE". Low white stepped concrete slabs stand behind it. | Read from a photograph by Garfield Robinson, Jamaica Observer, 30 May 2025 (reference only, never a texture) | Chapter 7 shows the real shape and wording |
| The first National Day of Remembrance, 20 May 2026: flowers at the monument and a fire brigade guard of honour of forty women. The Minister said the origin is still "unknown". | JIS, 23 May 2026; Local Government Jamaica, 27 May 2026 | Chapter 7 is set on that day |
| The JIS article of 23 May 2026 gives the year as 1986 and says three wards burned. | JIS | Errors: not used for facts |
| The 1980 campaign: "close to 900" deaths by police statistics. | Jamaica Observer, 30 May 2025 | The game keeps "hundreds" |
| A record, "Eventide Fire A Disaster", by General Echo and Barrington Levy, produced by Henry "Junjo" Lawes. | One record blog | Only after a second source |

### To read next (could not be reached online)

- **The Daily Gleaner, 21 to 27 May 1980.** It is on NewspaperArchive behind a paywall, or at the National Library of Jamaica. Not read.
- **The New York Times, 21 May 1980.** The site blocks this tool. Not read.
- ***The Golden Years*, Fae Ellington's documentary.** Only a link in the Gleaner (2020) mentions it. No copy or listing was found.
- **Photographs of the Myers Ward and the Home.** None are public. The National Library's Daily News Collection may hold some (permission needed).
- **The Gleaner's "Picture This: Eventide Home disaster" video.** YouTube blocked this tool.
- **The 1981 inquest report** and the British scientist's report. Known only from the Gleaner (2020).
- **The East Carolina University page image** of the AP story, to check the scanned quotes word for word.

## Sample lines (placeholder wording, for tone only)

All lines are 12 words or fewer. They still need a reading-level pass and a facts check.

- Gran: "Hold the mangoes in both hands. They are for Miss Iris."
- Miss Iris: "I cannot see you, child. But I know your footsteps."
- Miss Pearl: "Thirty years I sold yam in the market. My feet remember."
- Miss Maude: "I taught half this street to read. Ask me a sum!"
- The nurse on duty: "We have more ladies than beds. We do our best."
- Miss Iris at goodnight: "Come Saturday. Bring me batteries for my radio."
- A firefighter: "Stay behind the rope. Help the little ones to the road."
- Gran, after: "They could not get in, child. It was too fast."
- The nurse, at dawn: "We are checking every name. Please be patient."
- Miss Maude, in a blanket: "Child, you came. Sit with me."
- The radio: "Monday will be a day of national mourning."
- The young listener: "Who are they, in the big grave?"
- You, at the monument: "They were people. Each one had a name."

A sample journal page:

```js
{ id: 'footnote', title: 'A footnote',
  simple: ['A footnote is a small note at the bottom of a page.', 'Some events get only a line like that.', 'In this game, each woman gets a face.'],
  deeper: ['Miss Iris, Miss Pearl and Miss Maude are fictional. They stand for the real women of Eventide.',
           '"These elderly women, they must have done so much to build this country." Jean Lowrie-Chin, Gleaner, 20 May 2020.'] }
```

## What the engine gives and what is new

**Reuse from Garvey (copy, as Garvey copied Port Royal):** the title screen, Journal and chapters panel, saving, the "Next chapter" card, the helper arrow, the talk and listening pattern with remembered choices, the **sort cards** (chapter 7 there, chapter 6 here), the **timeline board** (chapter 8 there, chapter 7 here), and **National Heroes Park** (Garvey's chapter 8 place, used in chapters 5 and 7 here, with the Eventide monument added and, for chapter 5, the 1980 park without it). No shared code is moved into `engine/` for now.

**Reuse from Port Royal:** the earthquake's phase pattern (`Q`: calm, tremor, sink, sea) is the model for chapter 4's phases: asleep, sirens, the rope, the ward falls, dawn. Fire and smoke are lights and simple sprites.

**New to build:**

- **Slipe Pen Road, 1980:** a shopfront row, a cemetery wall, JOS bus stop and bus (route 43), power poles, zinc roofs, a gate.
- **Myers Ward:** a two-storey wooden building with verandas, and a long ward inside. There are no photographs yet, so it is built from descriptions and the journal says it is an impression.
- **The Eventide monument** (chapter 7): the shape and wording are in "Second research pass".
- **The fire sequence:** flames in the windows and roof, flicker, smoke, sparks, the roof and walls falling at a distance, sirens, a rope clamp, a fire engine, firefighters and a police officer in 1980 uniform, blankets, and women and children sitting by the road. Nothing inside the ward. All sound is synthesised in `engine/audio.js` (no audio files).
- **Characters (the real risk):**
  - Elderly women: older body macros, head ties, house dresses and cardigans, a stick, a white cane. `era.py` makes skirts, blouses and buns but no elderly look yet.
  - **Children** for the nearby building and the park. Garvey's known issue says a very young or short body leaves skin strips at the trouser legs, and a child body is still unbuilt. Allow time.
  - 1980s clothes for men, women, schoolchildren and officials.
  - A slow walk clip for the women, and sitting, which already exists.
- **Menu card and a poster picture** at the end, as for Garvey.

## Decisions for the owner (my recommendation first)

Decided by the owner on 13 Nov 2026: items 1 to 3, and the storyline as a whole, which covers items 4 to 8. Item 7 is still a working title. Items 9 and 10 are new from the second research pass and still open.

1. **The hero: a fictional child, then grown in chapter 7 (decided).** (Alternatives that were not chosen: a fictional young nurse's aide, which invites blame questions; a school child on the No. 43 bus, who can only watch.)
2. **How many of the four women get out: two (decided).** The survivors carry chapter 6, and the Journal still gives the real numbers, so the page is honest even if the cast is kinder. Miss Pearl and Miss Maude get out, Miss Iris and the fourth woman do not (confirmed). Miss Maude, a teacher, can run chapter 6's sorting activity.
3. **The night: a little more detailed, but not graphic (decided).** The burning ward can be seen from behind the rope, including the fall of the roof and walls at a distance. Never the inside, never anyone hurt. See "How the fire is told".
4. **A "Skip to the morning" card** before chapter 4.
5. **Politics:** no party named on the main path. The two official views and the inquest go in "Dig deeper".
6. **Fact, opinion or rumour** as chapter 6's activity, which teaches how to read uncertain history.
7. **Title:** "Eventide 1980" (working).
8. **Memorial day:** settled by research. Chapter 7 is set on 20 May, the National Day of Remembrance, first held in 2026.
9. **New, open: rename Miss Pearl.** Sistren's well-known play *QPH* (1981) has a "Pearlie" who lived at Eventide and was based on a real woman. A different name (for example Miss Hyacinth) stops readers taking our fictional woman for her. Recommended.
10. **New, open: a survivor's real words.** Use Joyce Aikman's 1980 words in "Dig deeper", with her name, once the scanned page is checked. Recommended.

## Build order

1. Done: the owner agreed this plot on 13 Nov 2026.
2. Research pass two (the sources under "To read next"). Update the tables.
3. Spike: build an elderly woman and a child character and check them under the game's lights.
4. Chapters 1 to 3, the warm part. Start here so players care before the night.
5. Chapter 4, the night, built and tested alone.
6. Chapters 5 to 7, using Garvey's park, sort cards and timeline.
7. Polish: reading-level pass, facts check, phone layout, sound, the sensitivity read by a heritage or elder-care reader, the menu card.

## Checks before shipping

`docs/TESTING.md`: screenshots of every place, the autoplayer for every chapter, the phone layout, a reading-level pass, a facts check against this file, and the review step in "How the fire is told", rule 11.
