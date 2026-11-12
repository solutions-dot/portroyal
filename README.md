# Port Royal 1690

An educational, playable 3D game about Port Royal, Jamaica, told through the life of Lewis Galdy: a French Huguenot refugee who arrived in the busiest town in the English Caribbean, was swallowed by the earthquake of 7 June 1692, was thrown back into the sea and rescued, and lived another 47 years. It runs in a phone or desktop browser.

Written for younger readers and adults alike: every journal page has a plain-language layer, with dates, sources and detail behind a "Dig deeper" button.

## Chapters

| Year | Chapter | What happens |
|---|---|---|
| 1690 | Arrival | Step off the ship, meet Abba, buy stew at The Turtle, find four objects |
| 1691 | The warehouse | Check cargo, make change, weigh a clipped coin, read a letter from a slave ship's captain |
| 7 June 1692 | The earthquake | The town sinks into the sand; swallowed, thrown into the sea, rescued |
| 1692 | The days after | The survivors' camp; stay or leave for what becomes Kingston |
| 1739 and today | The tombstone | St Peter's Church and Galdy's tomb |

Progress saves in the browser. Teachers can open all chapters from the Chapters menu.

## Run it

```
npm install
npm run build     # bundles src/main.js into game/app.js
npm run build:dev # same, plus test views (?shot=...) and the autoplayer (?auto=<chapter>, add &one for one chapter)
npm run serve     # http://localhost:8765
```

`game/` is the complete, deployable game (static files only).

## Layout

- `game/` built game: `index.html`, `app.js`, and `models/*.js` (each 3D model as base64 inside a script, because the original host only serves certain file types; `tools/pack_models.py` makes them)
- `src/main.js` game source (three.js)
- `assets/` the 3D models as `.glb`: houses, the two ships, and Abba
- `tools/blender/` Blender Python scripts that generate the textures, houses, ships and Abba
- `tools/people/` work in progress: the generator for townspeople (dockworker, sailor, the pewterer Simon Benning, the Rev. Emmanuel Heath)
- `tools/optimize_models.mjs` compresses house geometry; `tools/camp_check.py` checks scene layouts for overlapping objects

The Blender scripts were written on the build machine and still use its working paths (`/tmp/...`); change those before running them elsewhere. They need Blender 4.2+ (or the `bpy` Python module) and the MPFB (MakeHuman) add-on for the characters.

## What is history and what is invented

**From the record:** Galdy's birth in Montpellier in 1659, his flight as a Huguenot, being swallowed and thrown into the sea in 1692, his rescue by boat, his trade in wine, cocoa and enslaved people as an agent of the Asiento, his seats in the Assembly, his work on St Peter's Church (1726), his death in 1739 and the tomb's move in 1953. Also the brick houses of up to four storeys, the brick floors, pewter, clay pipes and bottles found by archaeologists, the watch stopped at 11:43, liquefaction of the sand, and the minister preaching in a tent.

**Invented:** Abba and her tavern The Turtle, the customer and prices in the warehouse, the captain's letter, who was in the boat that saved Galdy, the camp layout, and all dialogue. The journal says so on each relevant page.

## Sources

- Galdy's tomb inscription, St Peter's Church, Port Royal
- Frank Cundall, *Historic Jamaica* (1915)
- Donny Hamilton and the Texas A&M Port Royal excavations
- Rev. Emmanuel Heath, letters on the earthquake (1692)
- National Geographic, "How the 'wickedest city on Earth' was sunk by an earthquake"
- Jamaica Gleaner, "Lewis Galdy cheated death twice" (2024)

## Notes for contributors

- Peter Dunn's reconstruction paintings and the UCLA Cultural Virtual Reality Lab model were used as visual reference only and are not included.
- Abba's idle animation comes from Mixamo and is baked into `assets/characters/abba_animated.glb`. The raw Mixamo files are not included here.
- The script has not yet been reviewed by a historian. Please have it checked before classroom use.
