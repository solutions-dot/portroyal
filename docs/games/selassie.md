# The Emperor's Arrival

A six-chapter game about Haile Selassie I's arrival at Palisadoes Airport on 21 April 1966. The title follows the owner's chosen spelling. Folder and save namespace: `selassie`.

## Integration boundary

Rebased onto released main `57ad99a` after reviewing PRs #83, #85 and #86, the recent PR list and current `docs/HANDOFF.md`. The latest additional change was PR #86, covering 1690 knee clearance and builder lapel/pocket weights. It was inspected before the final rebase. Packed models retain their actual earlier builder hash in the asset manifest; a future rebuild uses the current shared builder. No open PRs remained at the earlier integration check on 15 November 2026. Main now includes the shared hand clearance, finger integrity, garment fixes, timeline menu and quality runner. Those shared changes are inherited normally, not copied into the game. The other games and shared engine, character builder, animation library have no changes in this feature diff. The only deployment setting is a branch-specific `git.deploymentEnabled` entry disabling Vercel builds for `feat/selassie-1966`, as the owner requested a PR only.

The six chapters import the shared story, carry, follow, ambient, animation, grip, colour, loading, input and audio systems. `?test=all` uses `engine/checks.js` and the game's adapter. Shared modules remain the source of truth, so later changes benefit this game on rebuild.

The new game, its own recipes/build scripts, review documents, one check configuration, small menu/about registrations and the branch-specific Vercel disable belong to this change. Keep the work on its own branch. The coordinating chat can sweep that branch into its combined work. Do not copy the shared engine into the game or replace the coordinator's work with these files.

The normal build discovers the game automatically. Shared engine fixes take effect on the next game build. Animation clips are selected from the shared library. Character rebuilds execute the current shared builder and packer, then apply this game's hair and uniform fitting. The independent save key, `selassie-save-v1`, does not touch any other game's progress.

## Story and play

The player is Ruth, a fictional child aged 10. Grandma Adina, Mum, Uncle Levi, Mr. Brown, Teddy and Miss Pearl are fictional. Young Adina in the short 1930 memory is also fictional. None of their words are historical quotations.

1. **The picture in the tin.** Kingston in April 1966 opens a playable memory of young Adina hearing about the 1930 coronation. Carry a newspaper to a map and ask the vendor about Ethiopia.
2. **Everyone has a reason.** Listen to Mum and Uncle Levi in either order. Bring thread to the sewing table, fit a chair slat, and pack water, lunch and the picture.
3. **The road to Palisadoes.** Mum uses the shared guide system. Help Grandma with water, look over the harbour, join the bus and find the family meeting post.
4. **Before the plane.** Hear the family, spread a cloth, carry water and share it with two neighbours. Uncle Levi describes his own faith and unfair treatment.
5. **The arrival.** Choose to watch the cinematic or read the event. A four-engine DC-6 arrives. Mortimo Planno and Haile Selassie I appear at the steps. Neither has invented dialogue. Choose a personal memory after speaking with Grandma.
6. **What we carry home.** Return to the evening yard. Put the bus ticket beside the picture, listen to the family, and keep a journal memory.

Choices change Ruth's remembered experience, not the historical event or whether a belief is correct. There is no sacred-practice minigame, violence or drug-use activity. The crowd scene has a sound toggle, pause and read-instead route. All dialogue is written on screen.

Only current story people receive gold markers. Goals count unordered tasks. The shared arrow appears after 2.5 seconds, or 5 seconds when exploring, and follows unfinished needs. Required objects are visible in the camera carry slot, leave their source and are visibly placed. Shared grips attach neighbours' cups. The journal gains a badge, glow and chime. Chapters, teacher access, native Main Menu links, reset and saved progress follow the established interface. The opening bar disappears once loading finishes.

## Historical basis

- **2 November 1930:** Haile Selassie I was crowned Emperor of Ethiopia. Rastafari emerged in Jamaica in the 1930s. The memory, newspaper and keepsake illustration are reconstructed, not reproduced archive objects. Source: Oxford University Press, *The emergence of Rastafari*: https://academic.oup.com/book/7074/chapter-abstract/151570898
- **20 April 1966:** people were already gathering before the arrival day. The fictional family journey does not claim a recorded route or bus timetable. Source: The Gleaner's retrospective: https://past.jamaica-gleaner.com/article/lead-stories/20160421/online-special-when-selassie-came-looking-back-visit-emperor-50-years
- **21 April 1966:** arrival at Palisadoes Airport, Kingston, during a three-day visit. Use the period airport name, not its later name, Norman Manley International Airport. Crowd estimates vary; the game says many thousands. Sources: National Library of Jamaica https://nljdigital.nlj.gov.jm/items/show/7914 and UWI Museum eyewitness recollections https://uwimuseum.wordpress.com/2016/05/04/video-selassie-recollections/
- Photographs show spectators on a terminal roof. The terminal massing, tower, roof spectators and apron are a general reconstruction, not a surveyed copy. Source: National Library of Jamaica https://nljdigital.nlj.gov.jm/items/show/824
- The arriving aircraft was a DC-6, a four-engine propeller aircraft. Its model uses a tapered fuselage and wings, radial nacelles, three-blade propellers, cabin windows, period Ethiopian Air Lines lettering and tricycle gear. Livery, the salute and the arrival uniform are reconstructed from the owner's uploaded photographs and the historical references below. The final twin-engine reference is used for clearer tail colours, not as the arriving DC-6's airframe. Reference: LIFE/TIME, Lynn Pelham's photographs: https://time.com/3880376/haile-selassie-in-jamaica-photos-from-a-rastafari-milestone/ ; arrival photograph record https://www.gettyimages.co.uk/detail/news-photo/haile-selassie-i-emperor-of-ethiopia-arrives-at-palisadoes-news-photo/75572629
- **Mortimo Planno:** a real Rastafari elder who helped the welcome proceed at the aircraft. His name also appears as Mortimer Planno. He is shown silently. The Gleaner retrospective and arrival photographs document his role.
- Rastafari beliefs are diverse. Many regard Haile Selassie I as divine. This is presented as faith, not a historical proof of divinity or a universal Jamaican belief. No miracle is presented as fact.
- **1963 / 2017:** the journal mentions Coral Gardens and the Government's apology in 2017 for state-inflicted violence. No violence is reenacted. Source: https://jis.gov.jm/government-apologises-victims-coral-gardens/
- **Grounation Day:** the anniversary remembers the visit. It is not the Emperor's birthday. Source: https://jis.gov.jm/minister-grange-celebrates-rastafari-groundation-day/

## Characters and graphics

All bodies have game-specific `sel_` recipes. Children use child shapes, build upscale 1.26 and runtime scale 0.8. Skin swatches remain in the established range and full bodies use the shared 1.55 runtime skin multiplier. Crowd copies bake that multiplier into skin vertex colours before joining. Hair is not brightened.

The airport includes distinct Rastafari elder, younger man, woman and knitted-tam recipes, alongside other visitors. Locs, beards, plain period clothes, striped tams and a headwrap vary the crowd. Greeters carry Ethiopian-colour flags above their heads or palm fronds. Ceremonial police wear red tunics, white belts and checked black caps, with ceremonial rifles. Roof spectators, apron markings, glazed terminal bays, an airport tower, baggage carts and wet-apron patches follow the photographic setting within a compressed reconstruction. Rastafari identity is not reduced to one costume or hair style.

Close figures retain separate garments and the full skeleton. Crowd copies join painted garments and skin before packing, while preserving named bone weights and the original eyes. They use the shared animation and grounding systems. Phones use fewer ground and roof spectators, fewer full animation updates and capped pixel ratio. Static terminal and aircraft pieces are batched; propellers, flags and people remain movable. Contact shadows use one instanced batch per place.

Selassie's uniform has a khaki tunic and lapels, narrow pale shirt opening and tie, red gorget tabs, small multicolour ribbon bars, flat service stars, Sam Browne belt and shoulder strap, fine gold cords, khaki shoulder boards and a low peaked cap. He salutes at the top of the rear port stairs. The face uses a separate compact moustache, a grey beard made from the jaw's own surface and game-specific face targets. The earlier detached curved beard and broad white shirt opening have been replaced after owner feedback. Likeness remains a stylised reconstruction for visual review, not a claim of pixel-level identity.

The owner supplied uniform, aircraft and airport photographs in this conversation. They were inspected visually and used as modelling references. No archive photograph or watermark is embedded as a game texture or distributed as an asset.

Every body has raw and low material-separated inspection assets and joined focus, crowd and phone versions. Focus versions preserve the close geometry in two visible draws. Hidden `measureOnly` garment meshes preserve the shared engine's clothing measurements for hand clearance; they do not render. The story uses no seated or kneeling poses, so the shared alternate seated skirt is retained in inspection models and omitted from joined standing render models. `tools/selassie/asset-manifest.json` records builder, finishing and recipe hashes, geometry, packed sizes and source revisions. Normal game builds require no Blender install.

The shared derived `WalkM` showed 20 to 34 cm of sliding on these bodies. This game chooses the shared original `Walk` through ambient behaviour options and calibrates its pace normally. It does not patch or replace the shared walk implementation.

## Checks

Build with `node tools/build.mjs selassie --dev` and serve the repository root. Development URLs include `?test=flow`, `audit`, `held`, `layout`, `follow`, `ambient`, `cloth`, `walkers`, `skin`, `budget` and `?auto=1`. `&b=sel_emperor66` selects a body for cloth checks. `?shot=poster`, `terminal`, `emperor`, `face`, `people`, `adina` and `memory` are screenshot views. These hooks are removed from the production bundle.

Results from 15 November 2026, tested on released main `84839f8`:

- Repository unit tests: 54 pass. The full `npm test` command still exits with four pre-existing Tivoli content-lint findings: one long quotation and three fictional-character notes. No Tivoli or shared baseline files are changed here. Selassie content lint: 0; own story tests: 5 pass.
- Seven Playwright integration cases pass: keyboard interaction and carried-object reload; partial packing and water reload; every step's snapshot restore; teacher access and native menu navigation; salute, sound, pause and read route; replay cleanup; real phone touch movement and look.
- Shared runner: `ALL 0` for journal, links, accessibility, keys, chapters, every step, map, sound references, continuity and runtime errors. Map coverage: 6,018 probes. Its sound case did not start audio; the separate integration test started it through a user gesture and verified mute/pause/read controls.
- Full story autoplayer: ending 64, no page errors. All four placement audits: 0. One-minute ambient simulations: 0 in each place. Carry checks: 0.
- Interface layout: 0 at 390x800, 667x375, 800x500 and 1280x720. Close-up, salute, crowd, title and phone views were inspected.
- Representative phone airport view: 202 draw calls and 260,932 triangles, inside the shared 220-call / 450,000-triangle budget. This measures geometry and draws, not native-device frame rate. Phones retain 50 background people at the airport; larger screens retain a denser crowd. Distant spectators update less often through the shared ambient system.
- `npm run dist` builds all nine games, repeated after rebasing onto `57ad99a`; the 54 repository unit tests also pass again there. Production smoke passes: nine ordered menu cards, every game link HTTP 200, the new game starts, native Main Menu returns, and development hooks are absent.
- Final packed geometry: at most 30,012 visible triangles in a focus body, 5,822 in an actual crowd body and 3,169 in a phone body, with two visible draws per joined body. Hidden measurement meshes are listed separately in the asset manifest.

### Remaining findings for independent review

This is a draft for another LLM's review, not a release approval. No merge or Vercel deployment is requested.

The conservative raw-body cloth test is **not zero**: five lines on Selassie and one on the police. Selassie's report includes beard/collar relations in Idle, Walk, Talk1 and Salute, plus a 5.4 mm strap-edge finding in Talk1. The police have a 5.1 mm coat-edge finding in Wave. The latter talking and waving poses are not currently assigned to those historical figures or police, but their diagnostics are retained. The beard/collar reports must be investigated rather than dismissed as false positives. Other 13 bodies report 0. The extra exterior-regalia depth check passes 390 posed samples; it does not exempt beard, shirt, collar or body checks.

The walking diagnostic reports 4.8 cm drift per loop on the boy and 5.2 cm on Selassie in shared `Walk`; Selassie does not walk in the current sequence. The derived `WalkM` and new `WalkM2` were tested and drifted more on these shapes, so they were not shipped as replacements. Keep the shared engine unchanged in this feature; investigate the residual retargeting in review.

Review the likeness and uniform against the supplied photos. The facial hair was revised after feedback, and the detached crescent geometry has been removed. The model remains stylised, with no pixel-perfect likeness claim. Current review images: [face](selassie-face.jpg), [salute](selassie-salute.jpg), and [menu card scene](../../menu/selassie.jpg). Exact reports are in [selassie-qa.json](selassie-qa.json).

To inspect the event quickly: build with `node tools/build.mjs selassie --dev`, serve the repository root, open Chapters, enable Teacher unlock, and select **The arrival**. The development-only `?shot=face`, `?shot=emperor` and `?shot=poster` views reproduce the review angles. Run `?test=cloth&b=sel_emperor66` for the remaining raw-body findings. Keep this work on its own branch for the coordinating LLM to review or sweep.
