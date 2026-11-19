/* engine/perf.js: smooth frames on phones without a worse picture (18 November 2026).
   tunePixels(renderer) replaces a game's own renderer.setPixelRatio(...). It:
   - caps how many pixels are drawn: a phone draws at most 1.5 pixels per screen point (most phones are 3), a computer at most 2.
     On a phone screen 1.5 looks the same as 3 and costs a quarter of the work.
   - watches the frame time (its own requestAnimationFrame, so no game loop needs changing). If frames stay slow (over 28 ms, under about 36 a second)
     for a few seconds, it draws a little fewer pixels, down to a floor; once they are quick again for a while, it climbs back. Loading hitches
     (one frame over 120 ms) are left out, and nothing is changed in the first five seconds.
   - ?perf (in every build, so it can be checked on a real phone) shows a small readout: frames a second, frame time, pixel ratio,
     draw calls, triangles, geometries and textures held on the graphics chip, and what engine/joinbody.js saved.
   Port Royal's own slow-frame drop moved here (docs/ENGINE.md, "engine/perf.js"). */
import { JOIN_STATS } from './joinbody.js';

/* the camera each game draws with (engine/preload.js runs heavy work only while it is still) */
export const VIEW = { camera: null };
export const PERF = { pr: 1, ms: 16, fps: 60, calls: 0, tris: 0, drops: 0, rises: 0 };
export const isPhone = () => (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) || Math.min(innerWidth, innerHeight) < 600;

export function tunePixels(renderer, { phone = isPhone(), phoneMax = 1.5, max = 2, floor = phone ? 0.9 : 1, slow = 28, quick = 19 } = {}) {
  const dpr = devicePixelRatio || 1, top = Math.min(dpr, phone ? phoneMax : max), low = Math.min(top, floor);
  let pr = top, avg = 16, last = 0, t0 = 0, since = 0, good = 0, dropAt = -1e9; renderer.setPixelRatio(pr); PERF.pr = pr;
  const set = (v) => { pr = Math.round(v * 100) / 100; renderer.setPixelRatio(pr); PERF.pr = pr; };
  { const r0 = renderer.render.bind(renderer); renderer.render = (sc, c) => { r0(sc, c); if (sc && sc.isScene) VIEW.camera = c; }; }
  const hud = typeof location !== 'undefined' && /[?&]perf\b/.test(location.search) ? readout(renderer) : null;
  function step(now) {
    requestAnimationFrame(step);
    if (!last) { last = t0 = now; return; } const d = now - last; last = now; if (hud) hud(now);
    if (document.hidden || d > 120) return;   /* a loading hitch or a hidden page says nothing about the steady frame rate */
    avg += (d - avg) * 0.05; PERF.ms = avg; PERF.fps = 1000 / avg;
    if (now - t0 < 5000 || PERF.hold > now) return; since += d;
    if (since < 2500) return; since = 0;
    if (avg > slow && pr > low) { set(Math.max(low, pr - 0.15)); PERF.drops++; good = 0; dropAt = now; }
    else if (avg < quick && pr < top && PERF.drops < 4 && now - dropAt > 30000) { if (++good >= 4) { set(Math.min(top, pr + 0.1)); PERF.rises++; good = 0; } }   /* ten seconds of quick frames, and none slow for thirty, before drawing more; after four drops it stays down. Each change resizes the canvas (a small hitch), so a phone on the edge must not swing up and down */
    else good = 0;
  }
  requestAnimationFrame(step);
  return { get pr() { return pr; }, top, low, hold(ms) { PERF.hold = performance.now() + ms; } };
}

/* ?perf: a small box in the top corner, updated twice a second */
function readout(renderer) {
  const el = document.createElement('div'); el.id = 'perf';
  el.style.cssText = 'position:fixed;left:4px;top:4px;z-index:99999;font:11px/1.35 ui-monospace,Menlo,monospace;color:#fff;background:rgba(0,0,0,.62);padding:4px 6px;border-radius:4px;pointer-events:none;white-space:pre';
  (document.body || document.documentElement).appendChild(el);
  const info = renderer.info, r0 = renderer.render.bind(renderer); let calls = 0, tris = 0;
  renderer.render = (s, c) => { r0(s, c); if (s && s.isScene) { calls = info.render.calls; tris = info.render.triangles; window.__scene = s; window.__camera = c; } };   /* the last whole scene drawn (shadows included) */
  let next = 0;
  return (now) => { if (now < next) return; next = now + 500; PERF.calls = calls; PERF.tris = tris; const mem = performance.memory;
    el.textContent = `${PERF.fps.toFixed(0)} fps  ${PERF.ms.toFixed(1)} ms  px ${PERF.pr}\ncalls ${calls}  tris ${(tris / 1000).toFixed(0)}k\ngeo ${info.memory.geometries}  tex ${info.memory.textures}` +
      (JOIN_STATS.bodies ? `\njoined ${JOIN_STATS.bodies} people: ${JOIN_STATS.before} -> ${JOIN_STATS.after} meshes` : '') + (mem ? `\nheap ${(mem.usedJSHeapSize / 1e6).toFixed(0)} MB` : ''); };
}
if (typeof window !== 'undefined') { window.__perf = PERF; window.__join = JOIN_STATS; }   /* for tools and tests to read */
