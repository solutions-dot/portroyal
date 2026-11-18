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
/* compile and upload a place before it is first drawn. Its hidden parts (the place itself, people not yet in the scene) are shown to the
   compiler only: three.js picks what to compile at the start of compileAsync, so everything is hidden again before the first await, and no
   frame can draw the place early (a flash on a phone that compiles in parallel). The await then only waits for the shaders to finish. */
export async function warm(renderer, object, camera, scene) {
  if (!renderer || !object) return;
  const hidden = []; object.traverse((o) => { if (!o.visible) hidden.push(o); }); for (const o of hidden) o.visible = true;
  let done = null; try { done = renderer.compileAsync ? renderer.compileAsync(object, camera, scene) : (renderer.compile(object, camera, scene), null); } catch (e) { /* a context that cannot compile ahead: the first frame will */ }
  for (const o of hidden) o.visible = false;
  if (done) try { await done; } catch (e) { /* as above */ }
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
/* placeKeeper: the glue for a game whose places are kept in a table (Kendal, Bog Walk, Melissa, Nanny): places = { id: { group, populated } },
   ensure(id) builds and peoples a place (cached), current() is the place shown now. The game keeps only its own list of which places a chapter uses.
   - ready(ids): each place built, peopled and warmed in a quiet moment, one at a time, once.
   - tidy(keep): free the graphics memory of every place not in keep, not shown and not current (it stays built, and comes back if shown).
   - background(order, gap): the old background load, one place at a time in quiet moments; order() is asked again before each place, so the next chapter's places can go first. */
export function placeKeeper({ places, ensure, renderer, camera, scene, current = () => null }) {
  const readied = new Set(); let bg = false;
  return {
    ready(ids) { for (const id of new Set(ids)) { if (readied.has(id)) continue; readied.add(id); work(async () => { const P = await ensure(id); if (P && P.group && !P.group.visible) await warm(renderer, P.group, camera, scene); }); } },
    tidy(keepIds) { const keep = new Set(keepIds); for (const [id, P] of Object.entries(places)) if (P && P.group && !keep.has(id) && id !== current() && !P.group.visible) { release(P.group, scene); readied.delete(id); } },
    background(order, gap = 400) { if (bg) return; bg = true; const step = () => { const id = order().find((k) => !places[k] || !places[k].populated); if (id) work(async () => { await ensure(id); await new Promise((r) => setTimeout(r, gap)); step(); }); }; step(); },
  };
}
if (typeof window !== 'undefined') window.__preload = PRELOAD;
