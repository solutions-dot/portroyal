/* engine/ontop.js: draw something held in front of the eye over the world, so it never cuts into a wall, a post or a counter (rule 10).
   First made for Bog Walk's torch hand (owner, 21 November 2026: "I can turn and cut through the pipe"); every game's carried things use it
   through engine/story.js createCarry (Morant Bay, 23 November 2026: the basket passed through the market stalls).
     drawOnTop(obj, on = true)   each mesh and sprite in obj is drawn in the nearest slice of the depth range, so it is always in front of the
                                 world, while its own parts still hide each other as usual. drawOnTop(obj, false) puts it back.
   The body stops about a quarter of a metre from a wall while a held thing floats more than half a metre in front of the eye, so without this
   the thing sinks into whatever you walk up to. */
const NEAR_SLICE = 0.02, gl = (r) => r.getContext();
const near = (r) => gl(r).depthRange(0, NEAR_SLICE), full = (r) => gl(r).depthRange(0, 1);
export function drawOnTop(obj, on = true) {
  obj.traverse((o) => {
    if (!o.isMesh && !o.isSprite) return;
    const u = o.userData;
    if (on && !u.onTop) {
      u.onTop = { before: o.onBeforeRender, after: o.onAfterRender };
      const b = u.onTop.before, a = u.onTop.after;
      o.onBeforeRender = function (r, ...rest) { near(r); return b.call(this, r, ...rest); };
      o.onAfterRender = function (r, ...rest) { full(r); return a.call(this, r, ...rest); };
    } else if (!on && u.onTop) {
      o.onBeforeRender = u.onTop.before;
      o.onAfterRender = u.onTop.after;
      delete u.onTop;
    }
  });
  return obj;
}
