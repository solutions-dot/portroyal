/* games/kendal/src/trains.js: Kendal's railway vehicles. They are built by the shared engine/vehicles.js (track, steam engines,
   wooden coaches, the 1950s diesel, 1845 carriages, wagons, the platform and smoke) with this game's own textures and materials (gfx.js). */
import * as gfx from './gfx.js';
import { makeVehicles } from '../../../engine/vehicles.js';
export const { RAIL_TOP, TM, rails, railsCurve, wheel, spin, woodCoach, dieselLoco, steamLoco, carriage1845, wagon, platform, makeSmoke } = makeVehicles(gfx);
