/* engine/textfit.js: words on signs, boards and labels always fit (owner, 17 November 2026: "Jamaica is cut off here. There may be other instances").
   Every game draws its sign text onto a canvas with fillText, in its own copy of a sign helper, and none checked that the words fit: "JAMAICA RAILWAY"
   ran off both ends of its board in Kendal. This module, imported FIRST by every game's main.js, wraps the canvas fillText and strokeText once for
   all games: when a text drawn without its own maxWidth would reach past the canvas edges (less a margin of 6 per cent each side, inside a sign's
   border), it is fitted: a text up to a tenth too wide is narrowed a little (maxWidth), and a wider one is drawn in smaller letters, never cut off. Text that already fits is untouched.
   In dev builds each narrowed text is listed in window.__TEXTFIT (the text, the canvas size and how much it was narrowed), for the checks. */
const P = typeof CanvasRenderingContext2D !== 'undefined' ? CanvasRenderingContext2D.prototype : null;
if (P && !P.__fit) {
  P.__fit = true;
  if (typeof window !== 'undefined' && typeof __DEV__ !== 'undefined' && __DEV__) window.__TEXTFIT = [];
  const room = (x, ctx, cx) => {   /* the widest the text may be, drawn at cx with the current alignment */
    const t = ctx.getTransform ? ctx.getTransform() : null, sx = t && !t.b && !t.c && t.a > 0 ? t.a : 1, ox = t && sx !== 1 ? t.e : 0;   /* a scaled canvas: work in its drawing units */
    if (t && (t.b || t.c)) return Infinity;   /* rotated text: leave it */
    const W = (ctx.canvas.width - ox) / sx, m = Math.max(4, W * 0.06), a = ctx.textAlign;
    if (a === 'center') return 2 * Math.min(cx - m, W - m - cx);
    if (a === 'right' || a === 'end') return cx - m;
    return W - m - cx;   /* left, start */
  };
  for (const name of ['fillText', 'strokeText']) {
    const orig = P[name];
    P[name] = function (text, x, y, maxWidth) {
      if (maxWidth === undefined && this.canvas && this.canvas.width) {
        const r = room(text, this, x), w = this.measureText(String(text)).width;
        if (isFinite(r) && r > 8 && w > r) {
          if (typeof window !== 'undefined' && window.__TEXTFIT) window.__TEXTFIT.push({ text: String(text), canvas: this.canvas.width + 'x' + this.canvas.height, by: +(w / r).toFixed(2) });
          if (w / r > 1.1) {   /* far too wide: smaller letters, not squashed ones (squeezed by a third, KINGSTON looked cramped) */
            const f = this.font, m = /(\d+(?:\.\d+)?)px/.exec(f);
            if (m) { this.font = f.replace(m[0], (+m[1] * r / w * 0.98).toFixed(1) + 'px'); try { return orig.call(this, text, x, y); } finally { this.font = f; } }
          }
          return orig.call(this, text, x, y, r);
        }
      }
      return maxWidth === undefined ? orig.call(this, text, x, y) : orig.call(this, text, x, y, maxWidth);
    };
  }
}
export const textFit = true;
