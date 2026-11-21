/* engine/water-tower.js: the railway water tower, one for every game (rule 10, owner, 21 November 2026). It was copied into six games
   (Kendal, Bog Walk, Eventide, Melissa, Selassie, Windrush); a fix to its legs had to be made six times. A game passes its own helpers
   and materials, so it keeps its own look:

     buildWaterTower({ grp, cyl, box, solid, M }, { feed })   M needs woodDark and iron; feed 'rail' (a spout over the track,
                                                           along +z) or 'pipe' (a down pipe and tap for a building, on +x)

   A wooden tank on four straight legs, each on a stone footing so every foot sits flat on the ground, a conical roof, an outlet pipe,
   a spout and a canvas hose for filling an engine's tender. About 7.2 m tall, 3.4 m across; its centre is at the group's origin, its feet at y = 0. */
export function buildWaterTower({ grp, cyl, box, solid, M }, { feed = 'rail' } = {}) {
  const g = grp();
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    cyl(0.08, 0.1, 4.9, M.woodDark, x, 2.55, z, g, 6);            /* a straight leg, from the footing to the tank */
    box(0.36, 0.1, 0.36, solid(0x8a8478, 1), x, 0.05, z, g);      /* its stone footing */
  }
  cyl(1.6, 1.6, 2.2, solid(0x7a5a3c, 0.9), 0, 5.4, 0, g, 18);     /* the tank */
  cyl(0.0, 1.7, 0.7, solid(0x3d3d3a, 0.8), 0, 6.85, 0, g, 18);    /* its roof */
  if (feed === 'rail') {
    /* the railway feed: a short outlet pipe down from the tank's floor, a spout out over the track and a canvas hose hanging from its
       end, for filling an engine's tender. The spout points along the tower's +z: turn the tower so +z faces the track. (It was a long
       pipe hanging in the air, which read as a short fourth leg: owner, 21 Nov 2026.) */
    box(0.18, 0.6, 0.18, M.iron, 1.0, 4.0, 0, g);                    /* the outlet pipe, from the tank floor (y 4.3) */
    box(0.2, 0.2, 2.0, M.iron, 1.0, 3.7, 0.9, g);                    /* the spout */
    cyl(0.09, 0.11, 1.1, solid(0x6a6250, 1), 1.0, 3.1, 1.85, g, 8);  /* the canvas hose at its end */
  } else {
    /* a building's feed: a pipe from the tank's floor straight down to the ground on the +x side, ending in a tap at waist height */
    cyl(0.07, 0.07, 3.4, M.iron, 1.0, 2.6, 0, g, 8);                 /* the down pipe, y 0.9 to 4.3 */
    box(0.3, 0.12, 0.12, M.iron, 1.12, 0.9, 0, g);                   /* the tap */
    box(0.4, 0.08, 0.4, solid(0x8a8478, 1), 1.12, 0.04, 0, g);       /* a stone under the tap */
  }
  return g;
}
