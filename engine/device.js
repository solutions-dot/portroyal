/* engine/device.js: touch or keys (owner, 19 November 2026: the W A S D instructions showed on tablets and phones, where they mean nothing).
   touchFirst(): the best first guess. A coarse main pointer; or touch points on a phone or tablet; or an iPad asking for the desktop site
   (it says "Macintosh" but has touch points); or a device whose only pointers are coarse.
   liveHint(el, touchText, keysText): shows the right instructions now, then follows what the player really uses: the first touch switches
   them to the touch words, the first key press to the key words (a tablet with a keyboard, a laptop with a touch screen). */
const mm = (q) => typeof matchMedia !== 'undefined' && matchMedia(q).matches;
export function touchFirst() {
  if (mm('(pointer: coarse)')) return true;
  const n = typeof navigator !== 'undefined' ? navigator : {}, tp = n.maxTouchPoints || 0, ua = n.userAgent || '';
  if (tp > 0 && /Android|iPhone|iPad|iPod|Mobi|Tablet|Silk|Kindle/i.test(ua)) return true;
  if (tp > 1 && /Macintosh/.test(ua)) return true;   /* an iPad in desktop mode */
  return mm('(any-pointer: coarse)') && !mm('(any-pointer: fine)');
}
let last = null; const hints = new Set();
export function liveHint(el, touchText, keysText) {
  if (!el) return; const h = { el, t: touchText, k: keysText }; for (const o of hints) if (o.el === el) hints.delete(o); hints.add(h);
  el.textContent = (last === null ? touchFirst() : last === 'touch') ? touchText : keysText;
}
if (typeof addEventListener !== 'undefined') {
  const use = (kind) => { if (last === kind) return; last = kind; for (const h of hints) h.el.textContent = kind === 'touch' ? h.t : h.k; };
  addEventListener('touchstart', () => use('touch'), { passive: true, capture: true });
  addEventListener('keydown', (e) => { if (/^(Key[WASD]|Arrow|Space|Enter|Shift)/.test(e.code)) use('keys'); }, { capture: true });
}
