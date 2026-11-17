# Tivoli: West Kingston, 1960s to today (the game guide)

Read `CLAUDE.md` and `docs/NEW_GAME.md` first. This file is the plan, the rules for this game, the placeholders and the research.

- Code: `games/tivoli/` (started from `games/_template/`; see "Code map").
- **On the menu since 14 November 2026** (the owner's choice), in `games/tivoli/`. The folder used to start with an underscore so `tools/dist.mjs` skipped it.
- Build: `node tools/build.mjs tivoli --dev`, then open `http://localhost:8765/games/tivoli/site/` (see "Test it").
- Status (14 November 2026): **two playable parts**: chapter 1 (Back-o-Wall, with Ivy, journal and chapters list) and the May 2010 street scene (from the Chapters list), with 2010 uniforms, weapons, the owner's clips and research. As of 16 Nov 2026, all eight chapters are playable in code: seven walking chapters and the May 2010 scene. Historical, community and visual review remain separate work. There is a placeholder pose layer (`src/clips.js`) and a staging view for it.

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

**Settled by the owner on 16 November 2026 (the street scene as redirected that day)**
- Gunmen fire back from behind the barricade.
- At the first shots, the two leading soldiers fire from where they stand at the same moment the gunmen open fire, so neither side is shown firing first.
- Prone firing clips (`ProneFire`, `ProneTurnR`, `RifleProneToKneel`) are not used: a person flat on the road could look hurt to a child.
- No civilians appear in the gunfight scene.

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

The game asks for a pose by its real clip name through `pose(name)` in `games/tivoli/src/clips.js`. If the shared animation library has that clip, it plays. If not, a stand-in (an existing clip) plays, so scenes can be built and timed now.

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
2. Add its name to `games/tivoli/anim-clips.json`. Do this only **after** the clip is in the library: the build stops with "clips not in the library" for a name that is missing.
3. Rebuild. The stand-in drops out by itself. No game code changes.

**The owner's clips (14 and 15 November 2026).** Four more on 15 November (Mixamo, free to use in games): `StopWalkRifle` (Stop_Walking_With_Rifle, walking with a rifle then stopping), `RifleKneelToStand` (Rifle_Kneel_To_Stand), `RifleProneToKneel` (Rifle_Prone_To_Kneel, from lying flat to one knee) and `PistolKneelIdle` (Pistol_Kneeling_Idle, on one knee, hands up for a pistol). `RunLow2` is the same movement as `RunLow`. All 22 are packed (about 346 KB). The first eighteen: Eighteen Mixamo clips are in `tools/tivoli/anim-sources/`: Shoot_Rifle, Gunplay, Shooting_Pistol, Prone_Firing_Rifle, Prone_Right_Turn, Female_Peek_And_Aim, Femme_Peek_Around_Corner, Ducking, Crouch_Idle, Crouched_Run, Crouched_Run_1, Crouch_To_Stand, Crouch_Turn_To_Stand, Walk_Crouching_Right, Run_Forward, Run_Backward, Run_Left, Run_Right. They are retargeted (`tools/tivoli/clips.json`, `tools/anims/retarget_clips.py`, a few seconds) and packed by `tools/tivoli/pack_clips.mjs` into `games/tivoli/site/models/anims_tivoli.js` (about 270 KB), which the game loads after the shared library. They are kept apart from the shared library so no other game changes. Poses: `StandFire`, `StandAim`, `CrouchAim`, `CrouchFire` play ShootRifle; `PeekAround` PeekCorner; `AimCorner` PeekAim (a pistol clip); `PistolFire` ShootPistol or Gunplay; `ProneFire`, `ProneTurn`; `DuckDown` Ducking; `CrouchIdle`; `RunLow` Crouched_Run (a second one, `RunLow2`); `CrouchToStand`, `CrouchTurnStand`, `WalkCrouchR`; and the four rifle runs `RunForward`, `RunBackward`, `RunLeft`, `RunRight`. **The only stand-in left is `AdvanceReady` (Walk)**, and the rifle's low-ready carry (see Weapons) makes a plain Walk look like an advance with the rifle at the ready. The prone clips lie flat on the ground because `groundFeet` drops the body until the toes touch; the hips' height is not kept (`HIPS_Y` in `engine/anim.js` does not list them, and `engine/` is not edited here).

Checks (dev build):
- `?test=clips` lists the poses that still use a stand-in, in the page title and the console. It must be empty before anything is published.
- `?shot=fight` shows every pose in a row on its current clip, in front of a low wall. The stand-ins read weakly: `Block` is a guarded forward bend and `Point` barely reads as aiming. That is expected.

Still needed when the real clips arrive: a weapon prop with a two-handed grip (`engine/grip.js` only does one hand today, and the result must pass `?test=held`), muzzle flashes, gunshot sounds made in code (see `engine/audio.js` and `games/kendal/src/sfx.js`), and cover spots that the place audit accepts (people close to walls).

## Uniforms (May 2010)

Built 14 November 2026 from Gleaner photographs of the operation (May 2010, reproduced in the Gleaner in 2010 and 2021). Two bodies, both men:

| Body | What it wears | From the photographs |
|---|---|---|
| `soldier2010` (Jamaica Defence Force) | Four-colour woodland camouflage shirt and trousers (tan ground, green, brown, black), trousers tucked into high black boots; a ballistic helmet of the 1980s US shape with a camouflage cover, its band and a chinstrap; an olive body-armour vest; olive webbing (belt with four ammunition pouches with flaps, two water bottles, the round respirator canister on the left hip, a harness with two straps in front joining in a Y at the back, a first-aid pouch on the left strap); thigh cargo pockets; a yellow band round the left upper arm | Soldiers in Tivoli and at the waterfront: woodland camouflage, covered helmets, olive vests and webbing, yellow armbands. Police attached to the army wore the same camouflage with yellow armbands marked POLICE (the `policeCamo` look). |
| `policeCamo` look (police attached to the army) | The soldier body with POLICE in black letters round the yellow armband (the `ArmBandText` piece, which the `soldier` look hides) | Gleaner photograph of the operation: police in the same camouflage, helmets and webbing, armbands marked POLICE. |
| `police2010` (Jamaica Constabulary Force) | Dark navy short-sleeved shirt with shoulder straps and two-stripe rank chevrons, navy trousers tucked into black boots; a black vest with POLICE across the back and, smaller, across the chest, two pouches on its front; a plain dark grey helmet with a chinstrap; a black belt with two pouches and a holster on the right hip | Police on the streets of Kingston on 24 and 25 May 2010: navy shirts and trousers, black vests marked POLICE, plain dark helmets, M16-type rifles. |

Caveats: the camouflage is a general woodland pattern, not traced from the real cloth; the exact chevron colours, the helmet shades and the vest cuts are judged from a handful of photographs. Some sources say the Defence Force wore British-style DPM from 1992 until its 2014 digital pattern; the 2010 photographs show a woodland-style pattern, so that is what the game uses.

How they are made (`era.py` and `pack.mjs` are not changed; another branch owns them):

```bash
MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/tivoli/people/soldier2010.json)"
~/venv/bin/python3 tools/tivoli/kit.py "$(cat tools/tivoli/people/soldier2010.json)"      # adds the 2010 kit to build/people/soldier2010.glb
node tools/people/pack.mjs --out games/tivoli/site/models --max 30000 --lo soldier2010 police2010
```

- `tools/tivoli/kit.py` reads the recipe's `kit` block (camo, vest, pouches, straps, helmet, armband, boots, backtext, fronttext, details) and adds each piece in the body's rest shape, with bone weights and `Col` vertex colours like `era.py`'s own. It also removes skin that is always under the shirt, shirt that is always under the trousers and shoe tops inside the boots (they can never be seen and poked through in some poses), and removes hair under the helmet.
- Colour by vertex, never by face: per-face colour splits every vertex and doubled the file size.
- Budget: full bodies about 28,600 triangles and 460 KB; light copies 5,900 to 6,000 triangles. `--max 30000` keeps the full copy under budget.
- In the game: `games/tivoli/src/cast.js` (Kendal's pattern; `SKIN_LIGHT = 1.55`). View them with `?shot=uniforms` (`&lo` for the light copies).
- **The people branch is merged (PR 50).** `engine/audit.js` now has `auditCloth` and `auditWalk`, and `engine/skinprobe.js` exists, so `games/tivoli/src/checks.js` can go: switch the imports to the engine and delete it. `engine/people.js` was planned but does not exist; keep Kendal's pattern in `cast.js`. Rebuild these bodies if `era.py` changes the pieces they use. `cast.js` lightens Hair as well as Skin; `docs/PEOPLE.md` says hair keeps its own colour.

Checks (14 November 2026, measured with the local copies in `games/tivoli/src/checks.js`, before PR 50 merged):
- `?test=cloth`: 19 issues on 55 points, every one at most 2.8 mm except two single points (one point of shoe through each police boot, from `pack.mjs` simplifying the light copy and from `era.py`'s shoe; one point of skin under the police sleeve when pointing). Most are the harness straps grazing the vest's edges by 1 to 3 mm in different poses. Down from 175 issues on 16,750 points. Not yet 0.
- `?test=walkers`: shoes sink 4.3 cm walking and 10.3 cm running, the same for both bodies and both copies. That was the old `groundFeet` pinning only the toe joint. `engine/anim.js` on main now pins the lowest points of the soles, so run it again.
- `?test=skin`: faces read a warm mid-brown in the template's daylight (soldier mean 99,62,42; police 110,71,49). Judge again in the real places and lighten if they read too dark.

## The street scene (chapter 5, the first playable scene)

Start it from the title screen: "May 2010 street scene (work in progress)". In the dev build, `?scene=fight&at=22&hold` jumps to 22 seconds and freezes there (for pictures).

**How it runs** (`games/tivoli/src/fight.js`; the scene lasts about 50 seconds):
1. An opt-in card: "Next is a loud scene with gunfire. You watch from a window. No one is shown hurt. It may feel scary." Buttons: Begin, **Read what happened instead** (a plain-words card with the facts and the disagreement), Not now. A **Calm mode** tick box (saved in the browser) makes it quieter, with no bright flashes and no shaking.
2. Title: "Monday 24 May 2010. A street in West Kingston. It is made up. The day was real." Then a quiet street, soldiers and police walking in file.
3. At 9 seconds both sides open fire together (the scene never says who fired first): the two leading soldiers fire a short burst from where they stand while the gunmen open fire from behind the barricade. Then the soldiers and police run to cover (a parked car, low wall A, then later wall B and a van further up), crouch, rise and fire short bursts, and drop back. Gunmen are tiny, far away behind the barricade, in plain clothes, and unidentified. Flashes, dust on walls and ground, gunshot sounds made in code, a little shake. **Nobody is hit.** Dust never lands on a person. No blood. How they are directed, and the check for it, is in "The street scene directed again" below.
4. Fade to black with a thin ringing, then the **after card**: "This street is made up. The day was real. About 70 civilians died. Civilians are people who are not soldiers or police. One soldier died too. Soldiers and police said armed men fought them. Many neighbours said they never saw armed men inside. People still disagree. Later chapters look at what was found."
- You watch from the balcony of a second-floor flat (all shots are from there, with different lenses). You never hold or fire a weapon (rule 4).
- Everything the people do is general (take cover, fire, duck, move up), not a record of a real event. The street is made up. Every number and claim on the cards comes from the Research tables below.

**Sound** (all made in code, `sfx.js`; there are no recordings): gunshots with a crack, a body and a low thump, and an echo off the buildings (a decaying-noise reverb); far shots softer, duller and later; a footstep tap for runners, louder when near; before the shooting, a breeze, far-off city, now and then a bird and a dog bark; a thin ringing at the end. Calm mode is about a third as loud. Real recordings (gunfire, a Kingston street) would sound better; they would have to be licensed files supplied by the owner.

**Files**: `fight.js` (the people, their steps, the camera shots, the cards), `street.js` (the street), `vehicles.js`, `textures.js`, `fx.js` (flashes, dust, shake, calm mode), `sfx.js` (gunfire sounds), `walk.js` (stride and pace, copied from the people branch).

**The street** (`street.js`, built from code and merged into one mesh per material, with textures mapped by world position): four-storey walk-up flats in faded pastel render with plinths, balconies, railings, burglar bars, louvred windows, window air conditioners, laundry, satellite dishes, black rooftop water tanks and rebar; shops with zinc roofs, roll-down shutters and painted signs (GROCERY, BAR & LOUNGE); a worn asphalt road with patches, cracks, oil, edge lines, a faded zebra crossing, manholes, storm drains; paved pavements with weeds in the joints, kerbs, litter; wooden utility poles with sagging wires and lamps; mango trees and coconut palms; a zinc-fenced vacant lot; a bus shelter; a hazy sky with clouds; hills round Kingston; real sun shadows on computers (phones get none). The barricade at the far end is an overturned minibus, a pushed car, tyres, pallets, planks and rubble. All textures are drawn in code (`textures.js`), so there are no image files.
- **Vehicles** (`vehicles.js`): a small saloon (like a Toyota Corolla) and a Hiace-style minibus (the common route taxi), each an extruded side profile with wheels and hubs, dark glass, lights, bumpers, mirrors and door lines, plus an "overturned" version. General shapes, not copies of any real vehicle or plate. No military vehicles: nothing read mentions them.
- **Vehicle details (16 November 2026).** The owner asked for more detail on the vehicles in the street scene. They are still the same seven civilian vehicles (four saloons and three minibuses, counting the two in the barricade), in the same places and the same outer size, so the cover spots, the solid boxes and the audits did not change. No police or military vehicles were added, because no source read mentions any (see "Not found"). What each now has:
  - **Both:** wheel arches cut into the body with a dark inside; wheels with a rounded tyre, a rim and a centre cap; amber indicators; a plate with grey blocks where the letters would be (no real number); a dark floor underneath and an exhaust pipe.
  - **Saloon:** a painted window frame each side with three pillars and two window openings, pillars beside the windscreen and rear screen, wipers, a vent strip, bonnet and boot lines, painted bumpers with a dark air intake and fog lamps, a grille with bright bars, headlights, tail lights in red, amber and white, a bright strip over the rear plate, three door lines and a sill each side, a dark rubbing strip, door handles, mirrors on stalks with a mirror face, five-spoke wheels, a white plate (private car).
  - **Minibus:** a longer sloped windscreen in a rubber seal with wipers, a grille with bright bars, sliding side windows in seals with a bright bar down the middle, shaped cab windows, a rear window in the tailgate with the gate's outline, tall tail lights, a rain gutter, roof ribs, front door lines and handles, a sliding door with its rail and handle on the left side only (Jamaica drives on the left), tall mirrors, mud flaps, steel wheels with a ring of holes, a red plate (the colour for a public passenger vehicle in Jamaica), and axles, a drive shaft, a silencer, a fuel tank and a spare wheel underneath, for the one rolled over at the barricade.
  - **Cost:** a saloon went from 1,008 to 3,044 triangles and a minibus from 1,014 to 3,232 (about 7,100 to 21,900 for all seven). Draw calls did not go up: `street.js` merges the street into one mesh per material, the details use a few shared materials, and paint is now shared by colour (19 vehicle materials before, 18 now).
  - **To view:** build with `--dev` and open `?shot=poster&cx=6.5&cy=1.3&cz=4.6&tx=2&tz=1.9&pitch=-0.12` (the green car from the front). Other camera spots: the car from behind `cx=-2.2&cy=1.4&cz=4.4&tx=2&tz=1.9`, the blue minibus `cx=-12.5&cy=1.5&cz=0.2&tx=-17&tz=-2.6` and from behind `cx=-21.5&cy=1.6&cz=0.4&tx=-17&tz=-2.6`, the barricade `cx=-20&cy=1.7&cz=1&tx=-27&tz=1`, from above `cx=9&cy=7&cz=7.5&tx=-4&tz=0&pitch=-0.35`. If you change a vehicle, keep its outer size (it is written at the top of `vehicles.js`) and run `?test=audit` and `?test=scene`.
- **Gunmen** wear plain clothes: the `civilian2010` body (T-shirt and jeans, `tools/tivoli/people/civilian2010.json`, 25,400 triangles, light copy 5,200), tinted per person. They are shown only as light copies, far away.

**Checks wired (CLAUDE.md rule 8)**: `?test=audit` (the street: floating objects, people inside solids; 14 November 2026: **0 issues** after it found and we fixed floating satellite dishes, a floating bus stop sign, lamp arms that did not touch their poles, and people starting on top of each other); `?test=layout` (every card and title state at 390x800, 320x568, 667x375, 800x500, 1280x720: **0 issues**); `?test=held`, `?test=cloth`, `?test=walkers`, `?test=skin` as before.

## Weapons (Tivoli only)

`games/tivoli/src/weapons.js`: an M16A2 rifle and a black pistol, built in code. The rifle is a side profile (tapered stock, receiver, carry handle, angled pistol grip, trigger guard, curved magazine) extruded to 2.8 cm, with a round handguard, a triangular front sight, barrel and flash hider: 33 cm from the grip to the butt plate, handguard 12 to 42 cm ahead of the grip. Those sizes fit the clips (`?test=measure`: right palm to shoulder joint 36 to 40 cm, palm to palm 31 to 34 cm). `engine/grip.js` holds one-handed things and is not changed here, so this file does the hold itself, every frame after the mixer:
- **Rifle clips** (`ShootRifle`, `ProneFire`, `ProneTurnR`): the grip sits in the right palm and the butt in the right shoulder pocket (a little in front of, inside and below the shoulder joint), which sets the rifle's direction. It never points more than about 11 degrees above level or 30 below (the prone turn lifts the hands). The right palm is turned against the side of the pistol grip. The left arm reaches the handguard by two-bone IK, under it where the clip had the hand along it, palm turned up to cradle it. The neck and head tip (at most about 25 degrees each) to bring the cheek to the stock and the eye behind the rear sight.
- **Fingers**: the right hand closes into a fist round the grip (index finger curled less, on the trigger); the left wraps the handguard, or the shooting hand in the two-handed pistol clips. Same method as `engine/grip.js`.
- **Pistol clips** (`ShootPistol`, `Gunplay`, `PeekAim`): the pistol is in the right hand along the forearm. `PeekAim` is a pistol clip (the hands are 13 to 22 cm apart with the arms out), so `AimCorner` is a police pistol pose and `StandAim` uses `ShootRifle`.
- **Low ready** (`weapon.carry = 'ready'`, set for everyone in the street scene): in any other clip (walking, running, crouching, standing) the rifle is held across the chest, grip low in front of the right side, muzzle about 25 degrees below level, both hands placed by IK, so no clip for "rifle at the ready" is needed. The right palm is turned against the grip; the left hand is under the handguard. The rifle is drawn in towards the left shoulder whenever the handguard would be out of the left arm's reach (the arm is 53 cm; a leaning torso in a run pushed it out), and the IK has a preferred elbow direction for an almost straight arm. `?test=held` checks it in walking, five runs, crouched walk, crouch idle and ducking: all within 0.3 cm on the grip and 0.2 cm on the handguard.
- **Otherwise** the rifle is slung across the back (muzzle up over the right shoulder) and the pistol is in the holster; the hands relax.
- Bones this file turns start each frame from the clip's pose; a bone the clip does not move is put back to its pose before our turn, or turns would pile up (they did: the head spun back).
- `arm(body, 'rifle' | 'pistol')`; `weaponTick(body)` runs in the frame loop for everyone armed (`ARMED`). The player is never armed (rule 4).
- Views: `?shot=hands&clip=ShootRifle` (`&look=police&kind=pistol`, `&yaw=`, `&t=`, `&dist=`, `&h=`), `?shot=rifles`, `?shot=slung`, `?shot=fight` (everyone armed). Checks: `?test=held` (each palm on the grip or handguard within 4 cm, closed fingertips within 3 cm of the weapon, through every weapon clip): 0 issues; `?test=measure` prints the clip distances above.

## Code map

| File | What it holds |
|---|---|
| `src/main.js` | Scene, the shared controls (joystick, drag to look, tap or Space to talk), the HUD (goal, reset, sound, Journal with its glow and count, talk marks and bubble, controls tip), the cards, the frame loop (`update`, `frame`), `startChapter`, the autoplayer (`?auto=N`), the hooks for `?test=all`, and the dev-only block `devViews` (all `?shot=` and `?test=` views, `?chapter=N`) |
| `src/content.js` | Every word the player reads: `CHAPTERS`, the words for each walking chapter (`CH1` to `CH8`), the journal pages (`JOURNAL`) |
| `src/ch1.js` | The walking chapters (1, 2, 3, 4, 6, 7, 8) from one `WALKS` table: place, words, goal order, sky, camera height |
| `src/backowall.js` | Chapter 1's place (imagined Back-o-Wall) |
| `src/newtivoli.js` | The courtyard of flats, community centre and clinic, by year: 1965 (chapter 2), 1980 (3), 2010 (6), 2016 (7), today with murals (8) |
| `src/street.js` | The 2010 street (chapter 5's scene) and `streetPlace()` for chapter 4 |
| `src/fight.js` | Chapter 5, the directed street scene behind the opt-in card: each person's plan (walk in, stand ready, run to cover, rest, fire, move up) |
| `src/aim.js` | Where an armed person really points (`aimDir`), the turn each clip builds in (`clipTurn`), and the body turn that points the weapon, not the hips, at a target (`faceFor`) |
| `src/scenecheck.js` | Dev only: `?test=scene` (aim, facing and feet of everyone in the street scene) and `?test=clipinfo` |
| `src/life.js` | The neighbours who are not in the story, in every walking chapter (`LIFE`), on the shared `engine/ambient.js`; `?test=ambient` |
| `src/talk.js`, `src/story.js` | Talking to people (each story person's idles, talk gestures and head turn); saving, the journal and the chapters list |
| `src/cast.js` | Bodies, looks (`LOOKS`) and `makeBody`; `SKIN_LIGHT` on Skin only |
| `src/weapons.js`, `src/clips.js` | The rifle and pistol with the two-handed hold; the pose names and their stand-ins |
| `src/textures.js`, `src/bake.js`, `src/sky.js` | Canvas textures (including `fresh` paint and the `mural` designs), merging by material, the sky |
| `src/checktables.js` | Dev only: Tivoli's hooks and tables for the shared `?test=all` runner (`engine/checks.js`), as Kendal's |
| `src/headcheck.js` | Dev only: `?test=heads` (heads and body turns of everyone, through every chapter and the street scene) |
| `src/checks.js` | `overlapSolids` (solid boxes), `sinkCheck` (feet below a surface), and `CLOTH_SKIP` (the order the 2010 kit is worn in, for the shared `auditCloth`); re-exports the engine's `auditCloth`, `auditWalk` and `skinProbe` |

## Test it

```bash
npm install
node tools/build.mjs tivoli --dev          # dev build
python3 -m http.server 8765                 # then open http://localhost:8765/games/tivoli/site/
```

Views: `?shot=fight`, `?test=clips` and the others in the code map. Wired checks (17 November 2026): `?test=all` (the shared runner plus `heads`), `?test=heads`, `?test=resume`, `?auto=N` (`&one`), `?test=audit`, `?test=layout`, `?test=scene`, `?test=held`, `?test=ambient`, `?test=cloth`, `?test=walkers`, `?test=skin`. See "Playing like the other games" below.

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

### Back-o-Wall and the clearance (third pass, 14 November 2026)

| Fact | Used as | Source (grade) |
|---|---|---|
| The larger part of Back-o-Wall was demolished in 1963 to make way for the new low-cost Tivoli Gardens estate. The remainder, at Industrial Terrace, was bulldozed on 12 July 1966. (This is why sources give 1963 or 1966.) | "From 1963", and "the last part on 12 July 1966" | [Gleaner, 16 July 2021, a feature on the 1966 clearance](https://jamaica-gleaner.com/article/esponsored/20210716/crime-being-poor-squatters-sent-packing) (N, a modern feature that reprints 1966 reporting) |
| July 1966: after fighting in West Kingston (gang warfare that spread to some political clashes; one man killed, about 30 seriously hurt, two police revolvers taken), the Government set a midnight deadline on 11 July. On 12 and 13 July bulldozers cleared Industrial Terrace and part of Foreshore Road; over 800 shanties were pulled down, and when the bulldozer sank on 13 July the rest were set on fire. A 300-strong police detachment stood by and there were no incidents. The churches helped some families find somewhere to stay; others moved to places such as Riverton City and Tower Hill. The Government said Tivoli Gardens would grow on the cleared Industrial Terrace land. | Journal "The clearing" | same Gleaner feature (N) |
| People still disagree: some say the clearance was needed to stop violence; others that it made many families homeless and spread the trouble | Both views, plainly | same (N) |
| The size of Back-o-Wall: Edward Seaga said about 1,500 people on 40 acres; the historian Clinton Hutton said about 2,300 huts were bulldozed between 1963 and 1966 | "People disagree about how many." Both figures, attributed. | Gleaner, Tafari-Ama, 2021 (S, opinion, quoting Seaga); [Gleaner via Stabroek News, 2010](https://stabroeknews.com/2010/08/30/news/regional/jamaicans-still-being-forced-to-flee-communities-decades-on) (N, quoting Hutton) |
| Hutton puts the clearance in the context of Jamaica's housing shortage after independence | Journal | Stabroek News, 2010 (N) |
| Who lived there: Rastafari and other people (Seaga's description, via a search summary; not read in full). A 2015 Gleaner opinion column says the population was mostly PNP supporters; others say the clearing and rebuilding made a JLP stronghold. | Say only that many Rastafari and other families lived there. Politics are left to a later chapter, as a disagreement. | Not confirmed in a source I read in full. **Needs a primary source.** |
| Daily life in Back-o-Wall (how people got water, worked, played) | **Nothing is claimed.** The chapter shows general everyday life as the game's own imagining and the journal says so. | Not found. **Needs oral histories or photographs.** |

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
   - **Before adding any character**, read `docs/PEOPLE.md` and `docs/STANDARD.md` (both on `main`). Follow them for every person.
   - **Owner's rules for this work:** put recipes in `tools/tivoli/people/` (one JSON file per body, named after the body); keep all game work inside `games/tivoli/`; do **not** edit `tools/garvey/era.py`, `tools/people/pack.mjs` or anything in `engine/`: every game shares them, so a change goes in its own PR for the owner (`docs/STANDARD.md`).
   - **What PEOPLE.md requires, in short:** every recipe sets `era`, `hat` as a list of `[kind, material]` pairs, `collar` as a kind, and `colors` for every garment. Children are real child bodies built with `upscale` (start from Kendal's `boy.json` and `girl.json`). Build with `era.py`, pack with `pack.mjs --out games/tivoli/site/models --lo <name>` (always pass `--out`). Skin follows CLAUDE.md rule 9. Wire `?test=cloth`, `?test=walkers` and `?test=skin` as well as audit, held and layout (see "Test it").
   - **Open problem (found 14 November 2026):** `era.py` dresses people for about 1900 to 1957 and for 2020. The 1960s chapters can start from the 1957 clothes and the 2010 civilians from the 2020 ones. But 2010 police and soldier kit (uniforms, helmets, vests) is not in `era.py`, and the uniform cap is the only uniform piece. This game solved it with `tools/tivoli/kit.py`, which adds the 2010 kit on top of an `era.py` body (see "Characters" above). Do not edit `era.py` to fix it.
5. **Places**: Back-o-Wall, new Tivoli streets and flats, a home interior, a rooftop or window view, the community centre.
6. **A proper `AdvanceReady` clip** (a walk with the weapon at the ready; the procedural low-ready carry stands in), **weapon props** (rifles and pistols with a two-handed grip: `engine/grip.js` only does one hand, and must not be edited here), flashes and sounds. 
7. **Story code**: chapters, journal, goals, saving (copy the patterns from `games/kendal/src/`).
8. **Wire the automatic audits and layout test** before the first PR that has a place.
9. **The poster picture.** The menu card uses `menu/tivoli.jpg` (15 November 2026); see "Menu picture" below.

## STANDARD.md follow-up (14 November 2026)

`docs/STANDARD.md` says: Hair is set to 1, not multiplied (done in `src/cast.js`); do not borrow other games' bodies. Still borrowed: `girl`, `woman_elder`, `man_elder` (Kendal) and `guide2020` (Garvey). They need Tivoli recipes in `tools/tivoli/people/` (Ivy as girl and grandmother, Miss Pearl, Mass Roy, a 2020 guide). The Back-o-Wall place is now in `?test=audit` (overlaps only; see below).

**Street details from Gleaner photographs (14 November 2026).** From two photos only (soldiers on a residential lane, 24 to 27 May 2010; the Coronation Market street): white cast-block fences with round openings and white iron gates (`fenceBlock` texture, `fenceRun` in `street.js`), bushy shrubs behind them, and covered concrete walkways on posts over shop pavements (awnings on the shops). These are general looks, not copies of any real fence or shop. The tall blocks are still generic walk-up flats; no photograph of Tivoli's high-rise blocks was found. `?test=audit` stays at 0.

**Overlap check (15 November 2026).** `?test=audit` now also runs `overlapSolids` (in `src/checks.js`) on the street and on Back-o-Wall. Each place lists its solid things as boxes (`solids`: buildings with roofs and balconies, walkways and posts, fences, trees split into trunk and canopy, poles and crossarms, vehicles, props, people). Two boxes that overlap by more than 5 cm on every side are reported, so a tree in a building, a drum in a house or a person in a wall shows up. Plants touching plants and building touching building are allowed. The first run found 36 overlaps in the street and 14 in Back-o-Wall (mostly trees standing in buildings). Trees now stand only in gaps between buildings, props moved off house walls, and both places report 0. When you add a thing to a place, add its box too.

**Menu picture (15 November 2026).** The card uses `menu/tivoli.jpg`, taken from the quiet street with nobody in it: build with `--dev`, open `games/tivoli/site/?shot=poster` (optional `&cx=&cy=&cz=&tx=&ty=&tz=` to move the camera) at 1280x720 and save the screenshot as `menu/tivoli.jpg`. Retake it when the street changes.

## Chapter 2, the new Tivoli (15 November 2026)

- **Playable.** Ivy remembers moving into the new Tivoli Gardens a few years after Back-o-Wall. You talk to Ivy on the path, Miss Pearl by the flats and Mr Clarke (fictional, new) by the community centre, in any order, then walk to the community centre door. The journal page "Tivoli Gardens is built" unlocks.
- **Facts used** (Research table, "Tivoli Gardens was built in the 1960s"): built in the 1960s where Back-o-Wall stood; homes by the Ministry of Housing; the West Kingston Trust paid for a clinic, a creche, schools and a community centre with drama, singing and a steel band; dates differ (one source says 1963 to 1965); some say the clearing left many families homeless.
- **The place** (`src/newtivoli.js`) is a general picture, not a copy: three-storey blocks of newly painted flats round a courtyard, balconies with washing, flower beds, young trees, benches, lamp posts, a community centre with a porch and sign, a clinic. The journal says so. New texture `fresh()` (clean new paint) in `textures.js`.
- **Code:** `src/ch1.js` now runs both walking chapters from a `WALKS` table (place, words, order of goals, sky). `startChapter(2)` and `?chapter=2` start it. Words in `CH2` in `content.js`; look `clarke` in `cast.js` (a borrowed Kendal body, like the others).
- **Any order.** Every talk in chapters 1 and 2 works in any order. Miss Pearl no longer says "Go and see Roy". The goal line shows the first person not yet met.
- **Checks (15 November 2026):** `?test=audit` now runs the engine place audit (from main) on all three places plus the overlap check: street 0, Back-o-Wall 0, new Tivoli 0. The stricter engine audit first found 37 street issues (the barricade junk cut into the two vehicles, tyre stacks with nothing under them, satellite dishes not touching their posts). The junk now sits in front of the vehicles, tyres stack straight, and the satellite dishes are gone (the owner does not want them in this game). Layout test 0 at all five sizes. Scripted chapter 2 run (Mr Clarke first, then Miss Pearl, then Ivy): goals, toast, end card, journal 3 of 7, chapters list, no errors.
- **Waiting on main** (do not build here): engine/follow.js and engine/story.js (gold marks and arrows for the people who move the story on), the new shared and Tivoli clips (Talk, Speech, Comfort, Kneel and others would suit Mr Clarke, Miss Pearl and the later chapters), and the clothes builder fixes before the bodies are rebuilt.

## Chapter 4, May 2010: before (15 November 2026)

- **Playable.** Sunday 23 May 2010. You are Ivy's grandchild (fictional). On the 2010 street, with the barricade already across the road and no soldiers yet, you talk to Gran Ivy by your gate, Miss Dawn at the grocery and Mr Brown near the bus stop, in any order, then go home through the gate. Talking to Miss Dawn unlocks "The man the US wanted".
- **Facts used:** the US request (2009), the Government's agreement (18 May 2010, "last week" from 23 May), the state of emergency (23 May 2010), barricades at the entrances before the operation. Who built the barricades is not said: our sources do not say, so Mr Brown says people will argue about it. 23 May 2010 was a Sunday.
- **Code:** `streetPlace()` in `street.js` reuses the street and makes its walls from the solid boxes. `WALKS[4]` in `ch1.js` (lower camera, 1.25 m, for a child). Words `CH4` in `content.js`; looks `dawn` (a borrowed Kendal body in 1957 clothes, to replace with a 2010 body) and `brown` (the Tivoli `civilian2010` body) in `cast.js`.
- **Checks:** `?test=audit` 0 in all four places (street, Back-o-Wall, new Tivoli, street for chapter 4). The layout test now also shows the chapter title over the goal and buttons, the chapter end card, the journal and the chapters list; it found the chapter title touching the Journal button on phones (fixed: the title sits lower below 560 px). 0 at all five sizes. Scripted chapter 4 run (Mr Brown, Miss Dawn, then Gran Ivy): goals, end card, journal 4 of 7, no errors.
- **Chapters now playable:** 1, 2, 4, 5, 6. Still to build: 3 (politics and power, 1970s to 2009), 7 (the report), 8 (today).

## Chapter 6, after (15 November 2026)

- **Playable.** A few days after the operation, in the chapter 2 courtyard as it is in 2010 (older paint, grown trees). You talk to Gran Ivy, Mr Brown (his son was taken away for questioning) and Pastor Grant (families planning funerals and asking for answers), in any order, then go into the community centre. Unlocks "Monday 24 May 2010" and "After". Nobody is shown hurt.
- **Facts used** (journal pages "Monday 24 May 2010" and "After"): about 70 civilians and one soldier died; many people were held for days; a Commission of Enquiry looked at it later. Gran Ivy, Mr Brown and Pastor Grant are fictional, and the end card says so.
- **Code:** `buildNewTivoli({ year: 2010, cast })` in `newtivoli.js`; `WALKS[6]` in `ch1.js`; words `CH6`; look `pastor` (a borrowed Kendal body).

## Feet on pavements and paths (15 November 2026)

- **The bug:** story people were pinned to height 0 everywhere, so on the 16 cm pavement (chapter 4) their shoes sank out of sight, and on the 6 cm paths (chapters 2 and 6) by a little. Their feet were also not re-pinned every frame.
- **The fix:** each walking place now has `groundAt(x, z)` (street: pavement 16 cm, kerb 20 cm; courtyard: paths 6 cm; Back-o-Wall: 0). `ch1.js` passes it to `addNpc` as `ground`, and `main.js` calls `groundFeet` on every story person every frame.
- **New check, `sinkCheck` in `src/checks.js`,** run by `?test=audit` on every place and on the gunfight positions: it finds anyone whose `ground` is below the top of a low flat surface (pavement, kerb, path, step) under their feet. Proved by turning the pavement height off: it reported Gran Ivy, Miss Dawn and Mr Brown 16 cm under. With the fix, 0 everywhere. Close screenshots of the feet in chapters 1, 2, 4 and 6 show shoes resting on the ground. The lowest point of each body is 1 to 3 cm under the surface (the engine's `groundFeet` sets soles 8 mm low on purpose and the toes bend); not visible.

## Chapters 3, 7 and 8, and polish (15 November 2026)

All eight chapters are now playable.

- **Chapter 3, Politics and power (about 1980).** Ivy, grown up, Mass Roy (older, from Back-o-Wall) and Coach Davis, in the courtyard. Football (the club began in 1970), the dance troupe (1976), and what a "garrison" is, in plain words. The end card and the journal attribute Seaga's account (violence over politics from the mid-1970s, gangs in the late 1990s) and give the 2009 US request. New journal page "Politics and the garrison".
- **Chapter 7, The report (June 2016).** Gran Ivy, Mr Brown and Pastor Grant: what the Commission said, a Defence Force lawyer's objection, the 2017 police review, and the Prime Minister's apology in December 2017 in his real words. Unlocks "What people disagree about" and "After".
- **Chapter 8, Today.** Gran Ivy, Andre the painter and Kemesha from the dance troupe; murals on the courtyard walls (our own designs: a sunrise over hills, children playing and dancing, a hibiscus with a doctor bird). End card ends "Thank you for playing." New journal page "Tivoli Gardens today".
- **New sources (15 November 2026):**

| Fact | Used as | Source (grade) |
|---|---|---|
| A garrison is a political stronghold completely controlled by one party; Tivoli is often called the first | "A place almost fully controlled by one political party" | Gleaner, via search summary, 2010 (N); Wikipedia, Tivoli Gardens (S) |
| The Tivoli Mural Project began in 2022 (about 12 years after the operation); murals about hope, resilience and new beginnings; some walls still have marks from 2010 | Chapter 8 and its journal page; the game's murals are our own designs | [Observer, 2 June 2024](https://jamaicaobserver.com/2024/06/02/mural-therapy) (N) |
| The Tivoli Dance Troupe, linked to Tivoli Gardens High School, began in 1976 | Chapters 3 and 8 | [Observer, 27 June 2024](https://www.jamaicaobserver.com/2024/06/27/tivoli-dance-troupe-celebrates-30th-season-applause/) (N) |
| Tivoli Gardens Football Club began in 1970 and has won Jamaica's top league several times (Wikipedia says 5) | Chapters 3 and 8: "several times" | [Wikipedia](https://en.wikipedia.org/wiki/Tivoli_Gardens_F.C.) (S) |

- **Polish:** each courtyard chapter opens facing its first person; the end card has space between its lines; murals sit in front of the wall bands and are square panels, not stretched; the audit now runs every walking chapter with its own cast (`WALKS` is exported).
- **Checks (15 November 2026):** `?test=audit` 0 in the street and in all seven walking chapters. Layout test 0 at 390x800, 320x568, 667x375, 800x500, 1280x720. A scripted run of all seven walking chapters from a fresh save (talking in reverse order each time) reached every end card, unlocked 9 of 9 journal pages, with no errors. The public build has no test code.
- **Still to do:** own bodies for everyone (Ivy, Pearl, Roy, Clarke, Dawn, Pastor Grant and Kemesha use Kendal and Garvey bodies, so faces repeat); wire in the new clips (Talk, Comfort, Kneel and others) and `engine/story.js` and `engine/follow.js` when they land; the West Kingston reviewer; read the Commission's report itself.

## The street scene directed again, and background life (16 November 2026)

The owner played the May 2010 chapters and reported three things. What was wrong and what changed:

**1. "At one time the police turn to shoot at their own men."** The owner's Mixamo firing clips turn the body inside the clip. `?test=clipinfo` measures each clip on the real body: `ShootPistol` builds in a 121 degree turn of the pistol and swings it 83 degrees round during the clip; `PeekAim` swings 109 degrees, `PeekCorner` turns 155. The game turned the body to face the gunmen and let the clip add its own turn, so a police officer with a pistol ended up pointing back up the street at a soldier 1.3 m away (the check found exactly that on the old code). Now:
- `aim.js` measures, once per clip, body and weapon, how far the clip turns the weapon from the body's facing, and `faceFor()` turns the body by the difference, so the **weapon** points at the target.
- Pistols use the arm-out aim of `PistolKneelIdle` (kneeling) or `PistolStand` (the same arms on standing legs, made in `clips.js`); `ShootPistol`, `PeekAim` and `PeekCorner` are no longer used here.
- Every burst first picks a target on the other side with a clear line: nobody of the shooter's own side within 13 degrees of it and nearer than it. If no target is clear (someone ran forward), the shooter stays down. During a burst, if a friend comes into that cone, the burst stops at once. A crouched person already faces the clearest target, so the weapon never sweeps across a friend when they rise.

**2. "They are running in place and shooting."** `ShootRifle` (the owner's Shoot_Rifle) is a run-and-shoot clip: its feet travel 3.7 m a second. It played for every standing and crouched shot. There is no standing or kneeling rifle-firing clip among the downloads, so `clips.js` makes two from the owner's clips: `FireStand` (ShootRifle's upper body, aim and recoil on the still legs and hips of `RifleIdle`) and `FireKneel` (the same on the legs of `PistolKneelIdle`, on one knee). Their feet never move. The scene's steps now keep moving and firing apart: people move only in `RifleWalk` (walking in, the real clip that replaced the `Walk` stand-in for `AdvanceReady`) or `RunLow`, at the ground speed the clip's own stride gives at the pace it can play (`walk.js`), and they stop and change to a still clip before they fire. The stride the game worked out for the crouched run was wrong (1.29 m a loop; the feet really cover 0.91 m, so runners' feet slid 30 cm a loop), and RifleWalk's a little (1.30 against 1.28): `walk.js` now uses the measured strides (`MEASURED`), found with `?test=walkers&walk=RunLow:1.2` (the shared `auditWalk` at a chosen speed, clip speed 1). Runners now move at about 2.25 m/s.

**3. "It doesn't just look like zombies standing around."**
- The street scene: before the shooting the soldiers and police stand with their rifles ready (`RifleIdle`, looking about); afterwards they crouch behind cover, rise to fire, drop back, and some move up to cover further on; a guard kneels at the back watching a side street. Timings are random per person, so nobody is in step.
- The walking chapters now have neighbours who are not in the story (`life.js`, on the shared `engine/ambient.js`): children playing chase, people talking in twos and threes with gestures and the odd laugh or nod, elders on the benches, someone walking by, someone watching the children, a man at a handcart wiping his brow. The mood follows the chapter: lively in chapters 1, 2, 3 and 8 (in 8 people stop to look at the murals and point); calm and few in chapter 4 (Sunday 23 May 2010: two neighbours talk low, two others look down the street toward the barricade); sad in chapter 6 (no games; one woman comforts another, people sit and talk quietly, a child stands by them); calm in chapter 7. Everyone is fictional and general, like the rest of the everyday life in these chapters.
- The story people: each has idles that suit them (Ivy as a girl `HappyIdle`, the elders `OldIdle`, the men `IdleM`, `LookAround`, `WipeSweat`), changed every few seconds; quieter idles in the calm chapters and `Sad1`, `Sad2` in chapter 6. While talking they use a talk clip that changes with each line (men and women have their own; quieter ones when sad) and nod while you speak. Their heads turn toward you when you come near.
- `anim-clips.json` now ships 31 clips (the talk, idle, sit, comfort and reaction clips above, `RifleIdle` and `RifleWalk`); the game's copy of the library went from 211 KB to about 770 KB.

**Checks (dev build):**
- `?test=scene` (new, `scenecheck.js`): runs the whole street scene with six random seeds and checks everyone. Every quarter second from the first shots: a raised weapon must point within 12 degrees of someone on the other side and never within 8 degrees of anyone on its own side in front of it; someone still and not aiming must face within 75 degrees of the other side (the guard 135). Every frame: a walking or running clip while standing still (running in place), moving in a still clip (sliding), or moving more than 25 % off the speed the clip's stride gives. **0 issues** (6 seeds, about 108,000 person-frames, 3,600 aims). Proved on the old clip choice: 21 issues, among them "police 6 aims 2.0 degrees from soldier 5, 1.3 m in front" and "plays the moving clip ShootRifle while standing still".
- `?test=ambient` (new): every walking chapter's background people run for a minute while a player walks the story route (the engine's `ambientTest`): **0** in all seven chapters.
- `?test=audit`: the place audit now checks every walk and run route in the street scene every 30 cm, not just the end points: **0** (street and all seven walking chapters).
- `?test=walkers` now tests the uniform bodies in the clips the street scene gives them (Walk, RifleWalk, RunLow), with the shared `auditWalk`: **0** (it was 6 before the measured strides).
- `?test=held`: the new clips are in it (`FireStand`, `FireKneel`, `PistolKneelIdle`, `PistolStand`, `RifleWalk`, `RifleIdle`): **0**.
- `?test=cloth` now uses the shared `auditCloth` (engine/audit.js) with the 2010 kit's order as its `skip` rule, and also poses the bodies in the clips the street scene uses (RifleWalk, RunLow, CrouchIdle, FireStand, FireKneel, PistolKneelIdle). After merging the new kit (16 November 2026): **39 issues on 209 points**, all in the bodies, not the game: the tucked shirt shows through the trousers when crouched or kneeling (CrouchIdle 42 to 47 points, FireKneel 10 to 15, RunLow 5 to 9), the police vest pouches' edges are jagged in some poses (up to 27 mm on the light copy), the shirt hem is jagged in the light copies (5 to 8 mm), 1 to 3 points of shoe through the boot in the soldier's light copy kneeling, 4 points of shirt through the vest in the soldier's light copy in RifleWalk, 1 point of vest through the armband walking. They need `tools/tivoli/kit.py` and the builder, not this branch. Without the kit order (the shared check alone) it reported 366, nearly all of them pieces it read the wrong way round ("Boots shows through Shoes" 480 points a pose).
- `?test=layout` 0 at 390x800, 320x568, 667x375, 800x500, 1280x720; `?test=clips` no stand-ins; scripted run of all seven walking chapters (every line of every talk, then the end spot): every end card, no errors.

**What needs the owner (how the operation is shown):**
- The scene still shows gunmen firing back from the barricade, as the owner decided; nothing in this change adds to or takes away from that. The two leading soldiers now fire a short burst from where they stand at the first shots, at the same moment the gunmen open fire, so neither side is shown firing first.
- No one lies down: the owner's prone clips (`ProneFire`, `ProneTurnR`, `RifleProneToKneel`) are not used, because a person flat on the road could read to a child as someone hurt.
- No civilians are in the street scene (they are indoors; the child watches from the balcony).


## The title screen matches the other games (16 November 2026)

The owner said Tivoli's start screen did not look like the others. It now uses the same layout as Kendal, Nanny Town, Windrush, Melissa and The Emperor's Arrival (only `games/tivoli/site/index.html` changed):
- A date line on top in small brass capitals: "Jamaica · West Kingston · 1960s to today".
- The name and the three lines of words sit low on the screen, inside `<div class="tcard">` (not `card`, because `.card` is the full-screen overlay class in this game). The street shows above them.
- The name uses Alfa Slab One at the same size as Kendal. Its line height is 1.1, not 0.95, so the layout test does not find its letters touching the date line or the words below.
- The shade is clear at the top and dark under the words (the same gradient as Kendal). On short screens (600 px tall or less) the words start at the top, so the shade starts darker there to keep them easy to read over the bright sky.
- The buttons use the shared `title.css` row (Start, Chapters, Main Menu, in that order, then the loading bar); the old Tivoli grid that squeezed them is gone. The loading note moved inside the button row, as in Kendal.
- Kept: the quiet-street picture `menu/tivoli.jpg` behind the title with its slow drift, and no drift with reduced motion. The picture and the shade are now `position:fixed`, so they still cover the screen when a short screen scrolls the title.

Checks: `?test=layout` 0 at 390x800, 320x568, 667x375, 800x500 and 1280x720; `npm test` 225 of 225; `tests/tivoli-browser.mjs` 24 of 24 passes. Before and after pictures at 1280x720, 390x844, 320x568 and 667x375 are in `build/title-parity/` (not in git).


## Playing like the other games (17 November 2026)

The owner said Tivoli "does not play like the other games, has a different controller, top menu doesn't look the same, characters' heads are spinning 360". A side by side audit against Kendal, Nanny Town, Windrush and Hurricane Melissa found these differences, and each is now the same as in those games.

**What was different, and what it is now**
- **Controller.** Tivoli had its own four-arrow pad (`#dpad`) on touch screens. It now has the shared joystick: the left half of the screen walks, with the faint ring and gold nub of the other games (`#stick`, `#nub`, `stickUI`), the right half drags to look, a tap on a person talks. Walking speed is Kendal's (2.3 m/s, 3.6 with Shift; it was 2.6 and 4.2). Escape closes the journal, chapters, credits and cards; tapping the world no longer ends a talk (the x and Escape do, as elsewhere). Footsteps sound like earth in Back-o-Wall and paving elsewhere (they were sand everywhere).
- **Top of the screen.** Tivoli had text buttons "Sound on" and "Journal" stacked on the right and the goal in the corner. It now has the shared row: a reset button, a sound button with the speaker icon, and the paper Journal button that glows and shows a red count of new pages until you open the journal; the goal box sits under that row and plays the goal sound when it changes; a controls tip shows at the bottom for six seconds at the start of each chapter (and when you tap the goal). Toasts are the shared paper toast, and one that comes while someone is talking waits for the dialogue box to close.
- **Talking.** There was a "Talk to ..." button in the corner. Now, as in Kendal, a glowing speech mark floats over each person you can talk to (`engine/marks.js` places it just over the head), and the nearest gets the round gold talk bubble with their name. Space, Enter or E talks; the goal and tip step aside while someone speaks.
- **Reset.** The reset button opens the same card as the other games: restart this chapter, start the whole story again, cancel, or go to the main menu.
- **End of a chapter.** The end card had only "Back to the start". It now offers **Next chapter**, Chapters and Stay here (the last chapter offers Chapters, Main Menu and Stay here). The street scene's after card and the "Read what happened" card also offer Next chapter. Going on to chapter 5 always opens its opt-in card first (rule 4): Begin, Read what happened instead, Not now.
- **Save and resume.** Only finished chapters and pages were saved, and Start always began a chapter from the top. Now the chapter you are in and who you have talked to are saved too, the title says **Continue** with "Your progress is saved on this device." when there is a saved game, and Continue brings you back to the same chapter with the same people talked to.
- **Helper arrow.** It pointed in a straight line, through buildings. It now points to the next corner on a walking route round the walls (`engine/placement.js` `walkRoute`), with the ring on the person or the end spot, after the same 2.5 seconds.
- **Heads spinning round** (see below), and **bodies spinning**: the story people turned to face you at up to 900 degrees a second; sitters on the benches swung round in one frame when they sat; runners in the street scene turned at 516 degrees a second at corners.

**The heads: cause and fix.** `src/talk.js` turned each story person's neck and head toward you after the mixer, by adding a turn to the bone. The mixer only writes a bone when its clip value changes, and a clip whose neck and head tracks stay still (Idle, OldIdle, HappyIdle) writes them once, so every frame's turn was added to the last one and the head went round and round. It is the bug `engine/ambient.js` and Kendal's `storylife.js` had already fixed for their people. Now each frame starts from the clip's own pose again, the turn eases at most 150 degrees a second, and the whole turn (the clip's plus ours) stays inside 70 degrees from the chest (`HEAD_MAX`; if the clip already looks round, only what is left is added). Bodies turn the short way round, at most 200 degrees a second (`TURN_RATE`), with angles kept in -PI..PI. Background people get Kendal's turn limit (`turnLimit` in `src/ch1.js`) and sitters start facing their seat (`src/life.js`). Street-scene runners turn at most 315 degrees a second (`src/fight.js`).

**The new check, so it cannot come back.** `engine/audit.js` has a new shared `headWatch` (and `headAngles`), added without changing anything already there: sample people over time and it reports a head turned more than 80 degrees from the chest or tipped more than 60, a head that goes right round (more than 360 degrees one way on one clip), and a head turning faster than 320 degrees a second and faster than its clip turns it alone. `?test=heads` (`src/headcheck.js`) runs the game's real update loop with a stepped clock through every walking chapter (walking to each person, talking through every line, then to the end spot) and the whole street scene, samples everyone on screen every frame, and also reports a body turning faster than 240 degrees a second on the spot or 600 moving. On the old talk code it reported 13 issues in chapter 2 alone, among them "Ivy's head goes right round (2198 degrees one way) on HappyIdle". It is also part of `?test=all` as `heads`.

**Story flow and checks wired like Kendal's**
- `?auto=N` (`&one`): plays from chapter N to the end as a player would, pressing Next chapter, answering the opt-in card with Begin and watching the street scene to its after card. Logs every change; says STALL if nothing changes for 30 s.
- `?test=all`: the shared runner with `src/checktables.js` (journal, links, a11y, keys, chapters, steps with save and reload, map, faces, budget, autoplay, camera, rule 4 with the street scene tagged intense behind its card, sound, continuity, errors) plus `heads`. A walking chapter N has steps N*10 to N*10+3 (people talked to); the street scene is step 50.
- `?test=resume`: saves at six steps, reloads, and checks the chapter, the people talked to and the pages come back.

**Found and fixed by the newly wired checks**
- `?test=all` map: in chapter 1 the open lane end let you walk on to x -35, and in chapter 4 gaps between the street's buildings let you walk out to z 12. The game now keeps you inside each place's bounds, as Kendal does (Back-o-Wall has bounds now).
- `?test=all` faces: Mr Brown's face read too dark in the 2016 courtyard (brightness 70, needs 75), so his skin is lightened a little more (`skin: 1.15`, rule 9).
- `?test=all` a11y: the Calm mode tick box was 24 px; it is 44 px now.
- `?test=all` budget (with `&noshadow`, measured as a phone draws): chapter 2 had 229 draw calls against 220; it has two playing children instead of three.
- `?test=ambient` once found chapter 1's walker waiting by Mass Roy; the walker now goes round him.
- The talk mark: `engine/marks.js` `headTop` looks for a bone named ":Head" or "_Head", and three.js loads these bodies' bone as "mixamorigHead", so it finds none; the game's old 1.75 m fallback floated the mark a metre above Ivy as a girl. Tivoli now uses the Head bone's height plus 24 cm (scaled). The engine function was not changed (other games use it); it is worth a look in its own pull request.

**Checks (17 November 2026, dev build, headless)**
- `?test=all&noshadow`: ALL 0 after the fixes above (the last full run gave ALL 1, the budget line, then fixed and re-run as `&checks=budget,errors`: 0). Journal 0, links 0, a11y 0, keys 0, chapters 0, steps 0 (28 steps with save and reload), map 0 (12,251 probe points), faces 0, budget 0, autoplay 0, camera 0, rule4 0, sound 0, continuity 0, errors 0, heads 0 (8 scenes).
- `?test=heads`: 0 in all seven walking chapters and the street scene (about 200,000 head samples).
- `?auto=1`: all eight chapters to ALLDONE, through the opt-in card and the street scene.
- `?test=resume` 0, `?test=audit` 0 (street and seven chapters), `?test=layout` 0 at 390x800, 320x568, 667x375, 800x500 and 1280x720, `?test=scene` 0, `?test=held` 0, `?test=ambient` 0.
- `npm test` 227 of 227, lint 0 new. Kendal `?test=audit` still 0 after the `engine/audit.js` addition.
- Pictures before and after (Tivoli and Kendal, 390x800 and 1280x720) are in `build/tivoli-audit/` (not in git).

**Still different, or not done**
- The journal uses Tivoli's book with page tabs (the shared book layout), not Kendal's ruled paper page; it reads the same way, and opens from the same Journal button.
- Tivoli has no `#place` caption or fade title: the chapter start shows the date and words over the scene (`#scenetitle`), as before.
- `tests/tivoli-browser.mjs` still clicks `#jhud` and counts four `#dpad` arrows, the old controller. It needs `#jhud` changed to `#jbtn` and the arrow count replaced by a check for `#stick`; a scratch copy with those two changes passes (see the check results).
- The bodies are still the borrowed Kendal and Garvey stand-ins (see "Characters").


## Modern clothes (17 November 2026)

The owner asked for more modern clothes for some men in the present-day chapters. Two new bodies, `youth2010` and `man2010` (`tools/tivoli/people/`), wear a long, loose T-shirt worn untucked over cut-off jeans that end at the knee (`untucked` and `shortslen` in the builder; the owner found the first, tucked version not modern enough) and suede crepe-soled shoes of the Clarks Wallabee and Desert Boot kind, which Vybz Kartel's 2010 song "Clarks" made the fashion in Kingston that year (the owner's "bank robbers"). No brand mark is drawn. Andre the painter and six background men in chapters 4, 7 and 8 use them. Checks after: audit 0, ambient 0, held 0.

## Look-alikes (17 November 2026)

No two people with one face stand or walk side by side (`docs/PEOPLE.md`, section 5b).

- **Story people who borrowed one body now have their own faces.** A look in `cast.js` may name `variant` (`_b`, `_c`): Mr Clarke and Pastor Grant are no longer Mass Roy's face, Miss Dawn is not Miss Pearl's, Coach Davis is not Mr Brown's, and Kemesha is not young Ivy's. The bodies are the full face variants already in `site/models` (`man_elder_b`, `man_elder_c`, `woman_elder_b`, `civilian2010_b`, `girl_b`), so nothing new is downloaded. Ivy keeps one face at every age. `bodyOf(look)` gives the file a look uses.
- **Background people** (`life.js`, `lifeBodies`): `spreadBodies` now counts each person's whole walk (the walker who crosses the lane past the man at the cart), and a young man with no face left takes another young man's body (`youth2010`, `man2010`, `civilian2010` wear the same pieces).
- **The check**: `?test=audit` runs `faceCheck` on the story people and the background people of every walking chapter. `?test=ambient` look-alike lines: 1 before (2 with the check counting the nearest two people came), 0 now. `?test=audit`: 0.
- **Left out on purpose**: the soldiers and police of the May 2010 street scene. They are squads in one uniform and helmet, seen from across the street, and are meant to look alike. Giving them faces would need variants of `soldier2010` and `police2010` (four more full bodies and four light copies). Ask the owner before adding them.

## Journal like the other games (17 November 2026)

The journal's tabs were one sideways-scrolling row with a fixed width, so long titles ran out of their buttons and the last tabs were cut off. They now wrap onto more rows, as in every other game. "Dig deeper" lost its open arrow (its summary is a flex box); it has one again and opens to the extra text. Layout 0 at 390x800.
