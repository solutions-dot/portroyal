/* engine/textfit.js: words on signs, boards and labels always fit (owner, 17 November 2026: "Jamaica is cut off here. There may be other instances").
   Every game draws its sign text onto a canvas with fillText, in its own copy of a sign helper, and none checked that the words fit: "JAMAICA RAILWAY"
   ran off both ends of its board in Kendal. This module, imported FIRST by every game's main.js, wraps the canvas fillText and strokeText once for
   all games: when a text drawn without its own maxWidth would reach past the canvas edges (less a margin of 6 per cent each side, inside a sign's
   border), it is fitted: a text up to a tenth too wide is narrowed a little (maxWidth), and a wider one is drawn in smaller letters, never cut off. Text that already fits is untouched.
   Two more rules: letters taller than their board are made to fit its height, and a text with a line break ("A\nB") is drawn as two lines centred on its
   place, so a long name can go on two lines of a board.
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
  const PX = /(\d+(?:\.\d+)?)px/;
  const high = (ctx) => { const t = ctx.getTransform ? ctx.getTransform() : null; if (t && (t.b || t.c)) return Infinity; return ctx.canvas.height / (t && t.d > 0 ? t.d : 1); };   /* the canvas height in drawing units */
  const note = (ctx, text, by, why) => { if (typeof window !== 'undefined' && window.__TEXTFIT) window.__TEXTFIT.push({ text: String(text), canvas: ctx.canvas.width + 'x' + ctx.canvas.height, by: +by.toFixed(2), why }); };
  for (const name of ['fillText', 'strokeText']) {
    const orig = P[name];
    P[name] = function (text, x, y, maxWidth) {
      if (maxWidth !== undefined || !this.canvas || !this.canvas.width) return maxWidth === undefined ? orig.call(this, text, x, y) : orig.call(this, text, x, y, maxWidth);
      const lines = String(text).split('\n'), n = lines.length, f0 = this.font, m = PX.exec(f0), H = high(this);
      let px = m ? +m[1] : 0, lh = px * 1.15;
      try {
        /* too tall: letters higher than the board (KINGSTON: 112 px letters on a board 74 px high lost their tops), or lines that do not all fit */
        if (m && isFinite(H) && H > 8) { const cap = n > 1 ? 0.84 * H / (n * 1.15) : (px > 0.92 * H ? 0.8 * H : px); if (px > cap) { note(this, text, px / cap, 'tall'); px = cap; lh = px * 1.15; this.font = f0.replace(m[0], px.toFixed(1) + 'px'); } }
        /* too wide: a little is narrowed, more is drawn in smaller letters (all lines alike) */
        const r = room(text, this, x), w = Math.max(...lines.map((l) => this.measureText(l).width)); let mw;
        if (isFinite(r) && r > 8 && w > r) { note(this, text, w / r, 'wide');
          if (w / r > 1.1 && m) { px = px * r / w * 0.98; lh = Math.min(lh, px * 1.15 * (n > 1 ? 1 : 1)); this.font = f0.replace(m[0], px.toFixed(1) + 'px'); } else mw = r; }
        /* a text with line breaks ("A\nB") is drawn as lines centred on y: a long name can go on two lines of a board */
        for (let k = 0; k < n; k++) { const yy = y + (k - (n - 1) / 2) * lh; if (mw === undefined) orig.call(this, lines[k], x, yy); else orig.call(this, lines[k], x, yy, mw); }
      } finally { this.font = f0; }
    };
  }
}
export const textFit = true;
