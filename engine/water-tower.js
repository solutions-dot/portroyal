/* engine/water-tower.js: the railway water tower, one for every game (rule 10, owner, 21 November 2026). It was copied into six games
   (Kendal, Bog Walk, Eventide, Melissa, Selassie, Windrush); a fix to its legs had to be made six times. A game passes its own helpers
   and materials, so it keeps its own look:

     buildWaterTower({ grp, cyl, box, solid, M })   M needs woodDark and iron

   A wooden tank on four straight legs, each on a stone footing so every foot sits flat on the ground, a conical roof, an outlet pipe,
   a spout and a canvas hose for filling an engine's tender. About 7.2 m tall, 3.4 m across; its centre is at the group's origin, its feet at y = 0. */
export function buildWaterTower({ grp, cyl, box, solid, M }) {
  const g = grp();
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    cyl(0.08, 0.1, 4.9, M.woodDark, x, 2.55, z, g, 6);            /* a straight leg, from the footing to the tank */
    box(0.36, 0.1, 0.36, solid(0x8a8478, 1), x, 0.05, z, g);      /* its stone footing */
  }
  cyl(1.6, 1.6, 2.2, solid(0x7a5a3c, 0.9), 0, 5.4, 0, g, 18);     /* the tank */
  cyl(0.0, 1.7, 0.7, solid(0x3d3d3a, 0.8), 0, 6.85, 0, g, 18);    /* its roof */
  /* the feed: a short outlet pipe down from the tank's floor, a spout out to the side, and a canvas hose hanging from its end, for
     filling an engine's tender. (It was a long pipe hanging in the air, which read as a short fourth leg: owner, 21 Nov 2026.) */
  box(0.18, 0.6, 0.18, M.iron, 1.0, 4.0, 0, g);                    /* the outlet pipe, from the tank floor (y 4.3) */
  box(0.2, 0.2, 2.0, M.iron, 1.0, 3.7, 0.9, g);                    /* the spout */
  cyl(0.09, 0.11, 1.1, solid(0x6a6250, 1), 1.0, 3.1, 1.85, g, 8);  /* the canvas hose at its end */
  return g;
}
