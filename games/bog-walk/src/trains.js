/* games/bog-walk/src/trains.js: Bog Walk's railway vehicles, the same ones Kendal uses: they are built by the shared engine/vehicles.js
   with this game's own textures and materials (wgfx.js). The 1904 special train is the 4-4-0 steam engine with its tender
   (steamLoco('late'), an engine of the 1890s) and slatted goods wagons; see docs/games/bog-walk.md, "The train". */
import * as gfx from './wgfx.js';
import { makeVehicles } from '../../../engine/vehicles.js';
export const { RAIL_TOP, TM, rails, railsCurve, wheel, spin, woodCoach, dieselLoco, steamLoco, carriage1845, wagon, platform, makeSmoke } = makeVehicles(gfx);
