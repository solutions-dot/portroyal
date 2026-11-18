/* engine/preload.js: the next chapter is ready before the player gets there, and the last one lets go of its memory (18 November 2026).
   Three steps, each where it disturbs the player least:
   1. download early: ahead(names) asks the browser for the next chapter's model files as soon as this chapter starts (engine/loader.js prefetch,
      skipped on a slow or data-saving connection). Downloading does not slow the frame.
   2. unpack while reading: work(fn) queues the heavy part (unpacking a model, building a place) and runs one piece at a time while the game is
      quiet: a conversation, a card or the chapter-end page is on screen (the game says so with quiet()), or the browser is idle. A stutter there is not seen.
   3. warm(renderer, object, camera, scene): compiles the shaders and sends the textures of a place that is about to be shown, so it does not
      hitch on its first frame. Run it from work(), on a place built but still hidden.
   release(object, scene) frees the graphics memory of a place the player has left (geometries, materials, textures), keeping anything still drawn
   elsewhere in the scene. Nothing is lost: three.js sends a freed thing again if the place is shown again. Phones (iPhones above all) reload the page
   when graphics memory runs out, and players see that as a crash. See docs/ENGINE.md, "engine/preload.js". */
import { prefetch } from './loader.js';

let quietFn = () => false; const Q = []; let busy = false, timer = 0;
export const PRELOAD = { queued: 0, ran: 0, warmed: 0, released: 0 };
/* tell the engine how to see that the player is reading, not moving: a conversation or a card is open */
export function setQuiet(fn) { quietFn = fn || (() => false); }
export function ahead(names) { if (names && names.length) prefetch([...new Set(names)]); }
/* queue fn (it may return a promise); it runs while the game is quiet, or after at most `wait` ms on an idle moment */
export function work(fn, { wait = 6000 } = {}) { Q.push({ fn, by: performance.now() + wait }); PRELOAD.queued++; pump(); }
function idle(cb) { if (typeof requestIdleCallback === 'function') requestIdleCallback(cb, { timeout: 400 }); else setTimeout(cb, 60); }
function pump() {
  if (busy || !Q.length) return; clearTimeout(timer);
  const now = performance.now(), job = Q[0];
  if (!quietFn() && now < job.by) { timer = setTimeout(pump, 250); return; }
  busy = true; idle(async () => { Q.shift(); try { await job.fn(); } catch (e) { console.warn('preload', e); } PRELOAD.ran++; busy = false; setTimeout(pump, 30); });
}
/* compile and upload a place before it is first drawn */
export async function warm(renderer, object, camera, scene) {
  if (!renderer || !object) return;
  const was = object.visible; object.visible = true;
  try { if (renderer.compileAsync) await renderer.compileAsync(object, camera, scene); else renderer.compile(object, camera, scene); } catch (e) { /* a context that cannot compile in parallel: the first frame will */ }
  object.visible = was;
  const seen = new Set(); object.traverse((o) => { for (const m of mats(o)) for (const t of texs(m)) if (!seen.has(t)) { seen.add(t); try { renderer.initTexture(t); } catch (e) { /* a texture still loading */ } } });
  PRELOAD.warmed++;
}
const mats = (o) => (o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []);
const texs = (m) => { const out = []; for (const k in m) { const v = m[k]; if (v && v.isTexture) out.push(v); } if (m.uniforms) for (const k in m.uniforms) { const v = m.uniforms[k] && m.uniforms[k].value; if (v && v.isTexture) out.push(v); } return out; };
/* free the graphics memory of a place that is no longer drawn. scene: what stays (anything it still uses is kept). Returns how many things were freed. */
export function release(object, scene) {
  if (!object) return 0; const keep = new Set();
  if (scene) { const walk = (o) => { if (o === object) return; if (o.geometry) keep.add(o.geometry); for (const m of mats(o)) { keep.add(m); for (const t of texs(m)) keep.add(t); } for (const c of o.children) walk(c); }; walk(scene); }
  const geos = new Set(), ms = new Set(), ts = new Set();
  object.traverse((o) => { if (o.geometry && !keep.has(o.geometry)) geos.add(o.geometry); for (const m of mats(o)) { if (!keep.has(m)) ms.add(m); for (const t of texs(m)) if (!keep.has(t)) ts.add(t); } });
  for (const g of geos) g.dispose(); for (const m of ms) m.dispose(); for (const t of ts) t.dispose();
  const n = geos.size + ms.size + ts.size; PRELOAD.released += n; return n;
}
if (typeof window !== 'undefined') window.__preload = PRELOAD;
