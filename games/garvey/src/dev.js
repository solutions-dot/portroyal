/* games/garvey/src/dev.js: dev builds only. The checks every game wires (docs/TESTING.md, sections 5 and 7), on the real places and people:
     ?test=all       the shared runner (engine/checks.js) with this game's hooks, plus the anim check below
     ?test=audit     every place: floating things, people in solids, unreachable spots, people in each other, seats (engine/audit.js); also ?test=seating
     ?test=held      every carried thing (nobody carries anything in this game yet, so it checks that and says so)
     ?test=layout    the HUD in each state, at the window size it is run at (390x800, 667x375, 800x500, 1280x720)
     ?test=walkers   every body that walks, at the speed the game walks it: slide, sink, float, loop seam (auditWalk)
     ?test=ambient   every place's life for a minute while you walk through it (engine/ambient.js ambientTest)
     ?test=anim      this game's own animation check: in every place and story moment, people frozen on one pose in view, several people
                     moving in step, heads turned past what a neck can do or snapping round, walk clips on someone standing still, someone
                     sliding on a standing clip. Expect ANIM 0.
   &p=hall,street picks places. Results go to #autolog and the page title. */
import { checkAll, CHECKS } from '../../../engine/checks.js';
import { auditPlace, auditHeld, auditWalk, snapMeshes } from '../../../engine/audit.js';
import { ambientTest } from '../../../engine/ambient.js';
import { slideWalls, walkRoute } from '../../../engine/placement.js';
import { gripTick } from '../../../engine/grip.js';
import { WALKS, isSeated, animate } from '../../../engine/anim.js';
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import * as THREE from 'three';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3();
/* the stage each place is checked at (its first, or its busiest) */
export const FIRST = { shop: 0, hall: 10, street: 20, press: 30, dock: 40, liberty: 50, office: 60, park: 70 };
export const BUSY = { shop: 0, hall: 13, street: 22, press: 32, dock: 40, liberty: 53, office: 60, park: 70 };
const placeOf = (s) => (s >= 70 ? 'park' : s >= 60 ? 'office' : s >= 50 ? 'liberty' : s >= 40 ? 'dock' : s >= 30 ? 'press' : s >= 20 ? 'street' : s >= 10 ? 'hall' : 'shop');
export const STEPS = [0, 1, 2, 3, 10, 11, 12, 13, 14, 20, 21, 22, 23, 30, 31, 32, 33, 34, 40, 41, 42, 43, 44, 50, 51, 52, 53, 54, 60, 61, 62, 63, 64, 70, 71, 72, 73, 74];

export function devRun(A) {
  const { q, $ } = A;
  const test = q.get('test');
  const emit = (lines, title) => { let el = $('autolog'); if (!el) { el = document.createElement('pre'); el.id = 'autolog'; document.body.appendChild(el); } el.hidden = false; el.textContent = lines.join('\n'); document.title = title; window.__RESULT = lines; };
  const closeAll = () => { for (const id of ['dialogue', 'typeset', 'pagebuild', 'inspect', 'decl', 'sortp', 'letp', 'timep', 'ansp', 'journal', 'chapters', 'credits', 'card']) $(id).hidden = true; if (A.talkWith) A.endTalk(false); A.hideCard(); };
  const begin = () => { if (!A.state.started) A.startGame(); A.state.started = true; $('title').hidden = true; $('hud').hidden = false; };
  /* a place at its first stage, freshly reset (the chapter's own reset: people home, choices of that chapter cleared) */
  const goPlace = async (id, st) => { begin(); await A.ENSURE[id](); closeAll(); A.RESET[id](); closeAll(); if (st !== undefined && st !== FIRST[id]) await goStep(st); return A.PLACES[id]; };
  async function goStep(s) {
    begin(); const id = placeOf(s); await A.ENSURE[id](); closeAll();
    if (A.place !== id || s === FIRST[id]) A.RESET[id]();
    A.stage = s; A.best = Math.max(A.best, s); for (const n of A.allPeople()) n.talked = false;
    A.enterPlace(id); A.setGoal(); A.refreshLife(); closeAll(); return A.PLACES[id];
  }
  const P = () => A.PLACES[A.place];
  const blocked = (Q) => (x, z, r) => Q.walls.some((w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r);
  const placesWanted = () => (q.get('p') ? q.get('p').split(',') : A.PLACE_ORDER);

  /* ---------- hooks for engine/checks.js ---------- */
  const adapter = {
    ready: async () => { while (!A.CL.Idle) await wait(100); },
    chapters: () => A.CHAPTERS.map((c) => ({ name: c.name })),
    openChapter: async (i) => { const id = A.PLACE_ORDER[i]; await goPlace(id); },
    step: () => A.stage,
    steps: () => STEPS,
    goStep: async (s) => { await goStep(s); },
    places: () => A.PLACE_ORDER.slice(),
    goPlace: async (id) => { await goPlace(id, BUSY[id]); },
    place: () => { const Q = P(); return { id: A.place, bounds: Q.bounds, start: [Q.start.x, Q.start.z], walls: Q.walls, blocked: blocked(Q) }; },
    targets: () => { const Q = P(), want = A.TALK_TARGETS[A.stage] || []; const out = [];
      for (const id of want) { const n = A.byId(id); if (n && !n.talked) out.push({ id, label: id, x: n.x, z: n.z, r: 2.3 }); }
      for (const a of Q.actions) if (a.on()) out.push({ id: a.id, label: a.label, x: a.x, z: a.z, r: a.r }); return out; },
    snapshot: () => ({ stage: A.stage, goal: A.GOALS[A.stage], place: A.place, people: P().people.filter((n) => n.m && n.m.visible).map((n) => n.id), journal: A.unlocked.slice(), pos: [A.state.x, A.state.z] }),
    save: () => { A.saveGame(); return JSON.parse(localStorage.getItem(A.SAVE_KEY)); },
    restore: async (d) => { A.applySave(d); await goStep(d.stage); },
    move: (from, to, Pl) => { const Q = A.PLACES[Pl && Pl.id] || P(), B = Q.bounds; let [x, z] = slideWalls(from, to, Q.walls, 0.22); x = Math.max(B.x0, Math.min(B.x1, x)); z = Math.max(B.z0, Math.min(B.z1, z)); return [x, z]; },
    journal: () => {
      const speakers = new Set();
      for (const n of A.allPeople()) { if (!n.real) speakers.add(n.who); }
      return { pages: A.JOURNAL.map((p) => ({ id: p.id, title: p.title, simple: p.simple, deeper: p.deeper, text: [p.title, ...p.simple, ...p.deeper].join(' ') })), unlocks: A.JOURNAL.map((p) => p.id), refs: A.JOURNAL.map((p) => p.id), speakers: [...speakers] };
    },
    renderer: () => A.renderer, scene: () => A.scene, audio: () => A.AU, setSound: A.setSound,
    talking: () => !!A.talkWith,
    faces: () => P().people.filter((n) => n.m && n.m.visible && !n.seated).map((n) => ({ id: n.id, body: n.m })),   /* seated people are measured where they stand (the probe needs a standing head) */
    frame: async (dt) => { A.frame(dt); },
    camera: () => ({ x: A.camera.position.x, y: A.camera.position.y, z: A.camera.position.z }),
    clips: () => { const out = [], cam = A.camera.position, fw = new THREE.Vector3(); A.camera.getWorldDirection(fw);
      for (const n of P().people) { if (!n.m || !n.m.visible) continue; const c = n.m.userData.anim, act = c && c.cur, name = act ? act.getClip().name : 'Idle', dx = n.x - cam.x, dz = n.z - cam.z, d = Math.hypot(dx, dz);
        const hips = n.m.getObjectByName('mixamorigHips'); let hy = 1; if (hips) { const v = new THREE.Vector3(); hips.getWorldPosition(v); hy = (v.y - (n.m.userData.ground || 0)) / (0.95 * n.m.scale.y); }
        out.push({ id: n.id, clip: name, t: act ? act.time : 0, dist: d, inView: (dx * fw.x + dz * fw.z) / (d || 1) > 0.3, hips: isSeated(name) ? 1 : hy }); }
      return out; },
    autoplay: async () => { const stalls = []; for (const k of ['1', '2', '4', '5', '6', '7', '8', '9']) { closeAll(); if (k === '1') { await goPlace('shop'); A.stage = 0; A.refreshLife(); } const log = await A.runAuto(k); if (!log.includes('ALLDONE')) stalls.push('chapter ' + ({ 1: 1, 2: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8 })[k] + ': ' + log.slice(-4).join(' | ')); closeAll(); await wait(300); } return { ok: !stalls.length, why: stalls.join('; '), stalls }; },
    talks: () => (A.TALK_TARGETS[A.stage] || []).slice(0, 2),
    talkTo: async (id) => { const n = A.byId(id); if (!n) return; const ry = n.m ? n.m.rotation.y : 0, B = P().bounds; A.state.x = Math.max(B.x0, Math.min(B.x1, n.x + Math.sin(ry) * 1.3)); A.state.z = Math.max(B.z0, Math.min(B.z1, n.z + Math.cos(ry) * 1.3)); A.update(0.016); A.startTalk(n); A.frame(0.016); },
    people: () => P().people.map((n) => ({ id: n.id, name: n.who, body: n.model })),
    screens: () => ({
      title: () => { closeAll(); $('title').hidden = false; $('hud').hidden = true; },
      play: () => { closeAll(); begin(); },
      dialogue: () => { begin(); const n = P().people.find((p) => p.m && p.m.visible && !p.real); if (n) A.startTalk(n); },
      journal: () => { closeAll(); begin(); A.openJournal(); },
      chapters: () => { closeAll(); begin(); A.openChapters(); },
      credits: () => { closeAll(); begin(); A.openCredits(); },
    }),
  };
  window.__adapter = adapter;

  /* ?shot=face&id=garvey&st=10&d=0.8&a=0.3 : a close look at one person's face in the game's own light (the likeness check). d metres in front, a radians round */
  if (q.get('shot') === 'face') {
    (async () => { await adapter.ready(); const id = q.get('id') || 'garvey', n0 = A.byId(id); await goStep(+(q.get('st') || FIRST[A.PLACE_ORDER.find((k) => A.PLACES[k].people.includes(n0))] || 10)); const n = A.byId(id); for (let i = 0; i < 10; i++) A.update(1 / 30);
      if (n.amb) A.PLACES[A.place].life.hold(n, true); n.m.userData.anim.play(null); for (let i = 0; i < 10; i++) A.update(1 / 30);
      const head = n.m.getObjectByName('mixamorigHead'), hp = new THREE.Vector3(); head.getWorldPosition(hp); hp.y += 0.07;
      const d = +(q.get('d') || 0.8), a = +(q.get('a') || 0), ry = n.m.rotation.y + a; A.state.x = hp.x + Math.sin(ry) * d; A.state.z = hp.z + Math.cos(ry) * d; A.state.eyeY = hp.y; A.state.yaw = Math.atan2(-(hp.x - A.state.x), -(hp.z - A.state.z)); A.state.pitch = 0;
      $('hud').hidden = true; window.__SHOT = true; document.title = 'SHOT face ' + id; })();
    return;
  }
  if (test === 'all') {
    (async () => {
      await adapter.ready();
      if (!CHECKS.some((c) => c.id === 'anim')) CHECKS.push({ id: 'anim', needs: [], run: async () => { closeAll(); const r = await animCheck(['hall', 'street', 'liberty'], 12); return { lines: r.lines, note: r.note }; } });
      await checkAll(adapter, TABLES);
    })();
    return;
  }

  /* ---------- the anim check ---------- */
  function headYaw(m) { const h = m.getObjectByName('mixamorigHead'), c = m.getObjectByName('mixamorigSpine2'); if (!h || !c) return 0; h.getWorldQuaternion(_q1); c.getWorldQuaternion(_q2); _q2.invert().multiply(_q1); _v.set(0, 0, 1).applyQuaternion(_q2); return Math.atan2(_v.x, _v.z); }
  async function animCheck(ids, seconds) {
    const lines = [], stats = [];
    const moments = []; for (const id of ids) { moments.push([id, BUSY[id]]); if (id === 'hall') moments.push(['hall', 12]); }
    for (const [id, st] of moments) {
      const Q = await goPlace(id, st); if (id === 'hall' && st === 12) { A.setStage(12); }
      /* the player's walk: from the start to each person (stopping 1.4 m short for 2 s), and back */
      const route = [[Q.start.x, Q.start.z]]; for (const n of Q.people) { if (!n.m || !n.m.visible) continue; const t = [n.x + 1.0, n.z + 1.0], w = walkRoute(route[route.length - 1], t, Q.walls, 0.3, Q.bounds); route.push(...(w.length ? w : [t])); }
      route.push([Q.start.x, Q.start.z]);
      const dt = 1 / 30, T = {}; let ri = 0, pause = 0, t = 0;
      for (let f = 0; f < seconds / dt; f++) {
        t += dt; const to = route[Math.min(ri + 1, route.length - 1)], dx = to[0] - A.state.x, dz = to[1] - A.state.z, d = Math.hypot(dx, dz);
        if (pause > 0) pause -= dt; else if (d < 0.08) { if (ri < route.length - 2) { ri++; pause = 2; } } else { const s = Math.min(d, 1.3 * dt); const [x, z] = A.clampPos(A.state.x + dx / d * s, A.state.z + dz / d * s); A.state.x = x; A.state.z = z; A.state.yaw = Math.atan2(-dx, -dz); }
        A.update(dt);
        if (f % 8) continue;   /* sample about four times a second */
        const cam = [A.state.x, A.state.z], fw = [-Math.sin(A.state.yaw), -Math.cos(A.state.yaw)], vis = [];
        for (const n of Q.people) {
          if (!n.m || !n.m.visible) continue; const c = n.m.userData.anim, act = c && c.cur, clip = act ? act.getClip().name : '?', ry = n.m.rotation.y, hy = headYaw(n.m);
          const ex = n.x - cam[0], ez = n.z - cam[1], ed = Math.hypot(ex, ez), inView = ed < 14 && (ex * fw[0] + ez * fw[1]) / (ed || 1) > 0.35;
          const k = T[n.id] || (T[n.id] = { x: n.x, z: n.z, ry, hy, clip, since: t, stillMax: 0, runStill: 0, slide: 0, maxHead: 0, snaps: 0, prevT: t });
          const sp = Math.hypot(n.x - k.x, n.z - k.z) / (t - k.prevT || 1), dHead = Math.abs(hy - k.hy) / (t - k.prevT || 1);
          const changed = clip !== k.clip || Math.hypot(n.x - k.x, n.z - k.z) > 0.02 || Math.abs(ry - k.ry) > 0.02 || Math.abs(hy - k.hy) > 0.03 || (act && !/^(Idle|SitIdle|OldIdle|IdleM)$/.test(clip));
          if (changed) k.since = t; else if (inView) k.stillMax = Math.max(k.stillMax, t - k.since);
          if (WALKS.test(clip) && sp < 0.05) k.runStill += 0.27; else k.runStill = 0; if (k.runStill > 0.6) { lines.push(`${id}@${st}: ${n.id} plays ${clip} while standing still`); k.runStill = -1e9; }
          if (!WALKS.test(clip) && !n.seated && sp > 0.25 && t > 1) { k.slide++; if (k.slide === 2) lines.push(`${id}@${st}: ${n.id} slides at ${sp.toFixed(2)} m/s on ${clip}`); } else if (k.slide < 2) k.slide = 0;
          k.maxHead = Math.max(k.maxHead, Math.abs(hy)); if (dHead > 7 && t > 1) k.snaps++;
          if (inView && act && !isSeated(clip)) vis.push({ id: n.id, clip, tt: act.time, dur: act.getClip().duration });
          Object.assign(k, { x: n.x, z: n.z, ry, hy, clip, prevT: t });
        }
        /* moving in step: three or more people in view on the same clip at the same moment */
        const groups = {}; for (const v of vis) (groups[v.clip] = groups[v.clip] || []).push(v);
        for (const [clip, g] of Object.entries(groups)) { if (g.length < 3) continue; for (const a of g) { const same = g.filter((b) => { const dd = Math.abs(a.tt - b.tt) % a.dur; return Math.min(dd, a.dur - dd) < 0.05; }); if (same.length >= 3) { const key = clip + same.map((s) => s.id).sort().join(); T._sync = T._sync || {}; T._sync[key] = (T._sync[key] || 0) + 1; if (T._sync[key] === 8) lines.push(`${id}@${st}: ${same.map((s) => s.id).join(', ')} move in step on ${clip}`); } } }
      }
      for (const [nid, k] of Object.entries(T)) { if (nid === '_sync') continue;
        if (k.stillMax > 12) lines.push(`${id}@${st}: ${nid} is frozen for ${k.stillMax.toFixed(0)} s in view`);
        if (k.maxHead > 1.45) lines.push(`${id}@${st}: ${nid} turns the head ${(k.maxHead * 57.3).toFixed(0)} degrees from the chest (more than a neck can)`);
        if (k.snaps > 2) lines.push(`${id}@${st}: ${nid}'s head snaps round ${k.snaps} times`);
        stats.push(`${id}@${st} ${nid}: still at most ${k.stillMax.toFixed(1)} s, head at most ${(k.maxHead * 57.3).toFixed(0)} deg`); }
      const L = Q.life; if (L) for (const l of L.issues()) lines.push(`${id}@${st}: ${l}`);
      await wait(0);
    }
    return { lines, stats, note: moments.length + ' story moments' };
  }

  /* ---------- what each check needs ---------- */
  const npcsOf = (Q) => Q.people.filter((n) => n.m && n.m.visible).map((n) => ({ id: n.id, x: n.x, z: n.z, ground: n.ground || 0, anim: n.seated ? 'SitIdle' : 'Idle', path: n.path && n.amb && n.amb.kind === 'wander' ? n.path : undefined }));

  if (['audit', 'seating'].includes(test)) {
    (async () => { await adapter.ready(); const out = []; let count = 0;
      for (const id of placesWanted()) { const Q = await goPlace(id, BUSY[id]); for (let i = 0; i < 4; i++) A.update(1 / 30);
        const r = auditPlace({ id, snap: snapMeshes(Q.group), npcs: npcsOf(Q), walls: Q.walls, bounds: Q.bounds, start: Q.start, actions: Q.actions.map((a) => ({ ...a })), people: npcsOf(Q).filter((p) => p.anim !== 'SitIdle') });
        /* hung: every hat or coat hung on a wall rack or stand (userData.hung) must touch a peg or the stand's top (userData.peg). Proposed for engine/audit.js */
        const pegs = [], hung = []; Q.group.updateMatrixWorld(true); Q.group.traverse((o) => { if (!o.isMesh) return; if (o.userData.peg) pegs.push(new THREE.Box3().setFromObject(o).expandByScalar(0.005)); if (o.userData.hung) hung.push(o); });
        for (const o of hung) { const b = new THREE.Box3().setFromObject(o); if (!pegs.some((p) => p.intersectsBox(b))) { const c = b.getCenter(new THREE.Vector3()); r.floating.push(`hung@(${c.x.toFixed(2)},${c.y.toFixed(2)},${c.z.toFixed(2)}): a ${o.userData.hung} touches no peg`); } }
        const all = [...r.floating, ...r.inside, ...r.stuck];
        if (q.get('dbg')) { const [dx, dy, dz] = q.get('dbg').split(',').map(Number), pt = new THREE.Vector3(dx, dy, dz); Q.group.traverse((o) => { if (o.isMesh && new THREE.Box3().setFromObject(o).expandByScalar(0.02).containsPoint(pt)) { let t = o; while (t.parent && t.parent !== Q.group) t = t.parent; all.push('dbg: ' + o.geometry.type + ' ' + JSON.stringify(o.geometry.parameters || {}) + ' top ' + (t === o ? 'self' : t.type) + ' at ' + o.getWorldPosition(new THREE.Vector3()).toArray().map((v) => v.toFixed(2))); } }); } count += all.length; out.push(id + ': ' + all.length + ' issues'); for (const l of all) out.push('  ' + l); await wait(0); }
      out.unshift('AUDIT ' + count); emit(out, 'AUDIT ' + count); })();
  }
  if (test === 'held') {
    (async () => { await adapter.ready(); const out = []; let carriers = 0;
      for (const id of placesWanted()) { const Q = await goPlace(id, BUSY[id]); for (const n of Q.people) { const held = n.m && n.m.userData.held; if (!held || !held.length) continue; carriers++; const ac = n.m.userData.anim, found = new Set(); for (let k = 0; k < 12; k++) { ac.mx.update(ac.cur.getClip().duration / 12); gripTick(n.m); for (const l of auditHeld(n.id, n.m, held)) found.add(l); } for (const l of found) out.push(id + ': ' + l); } }
      const n = out.length; out.unshift('held items: ' + n + ' issues (' + carriers + ' people carry something' + (carriers ? '' : ': nobody in this game holds a thing yet') + ')'); emit(out, 'HELD ' + n); })();
  }
  if (test === 'walkers') {
    (async () => { await adapter.ready(); const out = []; let bad = 0; const seen = new Set();
      for (const id of placesWanted()) { const Q = await goPlace(id, BUSY[id]);
        const walkers = [...Q.people, ...(Q.extras || [])].filter((n) => n.m && (n.route || n.path || (n.amb && /wander|errand/.test(n.amb.kind))));
        for (const n of walkers) { if (seen.has(n.model)) continue; seen.add(n.model);
          const gl = await A.model(n.model), b = skClone(gl.scene);
          b.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); b.position.set(300, 0, 300); b.rotation.y = Math.PI / 2; if (n.scale) b.scale.setScalar(n.scale); A.scene.add(b);
          const clip = (n.amb && n.amb.spec.walk) || (n.amb && /wander|errand/.test(n.amb.kind) && n.sex === 'm' ? 'WalkM' : 'Walk');   /* the clip each walker really uses: ambient men walk WalkM, people sent somewhere Walk */
          animate(b, clip); b.userData.ground = 0;
          for (const v of [n.route ? (n.walkSpeed || 1.25) : 1.05 * (n.amb && n.amb.spec.speed || 1)]) { const r = auditWalk(n.id + ' (' + n.model + ')', b, v, { after: gripTick });
            out.push(`${n.id} (${n.model}, ${clip}): stride ${(r.stride * 100).toFixed(0)} cm, ${v.toFixed(2)} m/s, clip speed ${r.pace.toFixed(2)}, slide ${r.slide.toFixed(1)} cm a loop, shoes ${r.sink.toFixed(1)} to ${r.float.toFixed(1)} cm, biggest jump ${r.pop.toFixed(1)}x`);
            for (const l of r.lines) { out.push('  ' + l); bad++; } }
          A.scene.remove(b); await wait(0); } }
      out.unshift('walkers: ' + bad + ' issues'); emit(out, 'WALKERS ' + bad); })();
  }
  if (test === 'ambient') {
    (async () => { await adapter.ready(); const out = []; let total = 0;
      for (const id of placesWanted()) { const Q = await goPlace(id, BUSY[id]); for (let i = 0; i < 3; i++) A.update(1 / 30); if (!Q.life) { out.push(id + ': no life'); continue; }
        const route = [[Q.start.x, Q.start.z]]; for (const n of Q.people) { if (!n.m || !n.m.visible) continue; const t = [n.x + 0.9, n.z + 0.9], w = walkRoute(route[route.length - 1], t, Q.walls, 0.3, Q.bounds); route.push(...(w.length ? w : [t])); }
        const txt = ambientTest(Q.life, { route, stops: route.map((_, i) => i), seconds: +(q.get('s') || 60), blocked: blocked(Q), view: (pp) => ({ x: pp[0], z: pp[1], yaw: A.state.yaw }) }), n = +txt.split('\n')[0].split(' ')[1];
        total += n; out.push(id + ': ' + txt.split('\n').filter((l, i) => i === 0 || (l && !/^\S+: (wander|chat|work|sit|watch|errand|play),/.test(l)) || q.has('stats')).join('\n  ')); await wait(0); }
      out.unshift('AMBIENT ' + total); emit(out, 'AMBIENT ' + total); })();
  }
  if (test === 'anim') {
    (async () => { await adapter.ready(); const r = await animCheck(placesWanted(), +(q.get('s') || 30)); const out = ['ANIM ' + r.lines.length, ...r.lines]; if (q.has('stats')) out.push('', ...r.stats); emit(out, 'ANIM ' + r.lines.length); })();
  }
  if (test === 'layout') {
    (async () => { await adapter.ready(); const out = [], W = innerWidth, Hh = innerHeight; const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
      await goPlace('hall', 10);
      const IDS = ['goal', 'topr', 'talk', 'hint', 'toast', 'dialogue', 'cinner', 'place', 'nudge'], rect = (id) => { const e = id === 'cinner' ? document.querySelector('#card .cardin') : $(id); if (!e || e.hidden || (id === 'cinner' && $('card').hidden)) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || +cs.opacity < 0.05 || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? { id, r, e } : null; };
      const check = (name) => { const L = IDS.map(rect).filter(Boolean); for (const a of L) { if (a.r.left < -1 || a.r.top < -1 || a.r.right > W + 1 || a.r.bottom > Hh + 1) out.push(`${W}x${Hh} ${name}: ${a.id} is off the screen (${a.r.left | 0},${a.r.top | 0},${a.r.right | 0},${a.r.bottom | 0})`); if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'visible' && a.id !== 'dialogue') out.push(`${W}x${Hh} ${name}: ${a.id} text is cut off`); }
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 4 && oy > 4) out.push(`${W}x${Hh} ${name}: ${L[i].id} overlaps ${L[j].id} by ${ox | 0}x${oy | 0}`); } };
      const reset = () => { closeAll(); document.body.classList.remove('talking', 'carding'); for (const id of ['talk', 'toast', 'nudge']) $(id).hidden = true; $('hint').hidden = true; $('place').hidden = true; $('place').style.opacity = 0; };
      const settle = () => wait(700);
      reset(); A.showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Print the poster'; A.showHint(); A.toast('Journal: The UNIA begins'); A.showPlace(); await settle(); check('play: goal, talk, hint, toast, place');
      reset(); A.showGoal(true); A.startTalk(A.byId('garvey')); await settle(); check('dialogue told by the story');
      reset(); A.showGoal(true); $('dialogue').hidden = false; document.body.classList.add('talking'); $('who').hidden = false; $('who').textContent = 'Market seller'; $('line').textContent = 'UNITY? My neighbours and I help each other already, every day.'; $('choices').innerHTML = '<button class="btn ghost">Pride in who we are</button><button class="btn ghost">Good schools</button><button class="btn ghost">Fair work</button>'; $('next').hidden = true; await settle(); check('dialogue with three choices'); $('choices').innerHTML = ''; $('next').hidden = false;
      reset(); A.card('Chapter 2 is finished!', ['Well done. Next is The streets of Harlem (1916).'], [{ t: 'Next chapter', go: () => {} }, { t: 'Stay here', go: () => {} }]); await settle(); check('next chapter card');
      reset(); $('nudge').hidden = false; $('nudge').style.left = (W * 0.75 | 0) + 'px'; $('nudge').style.top = (Hh * 0.45 | 0) + 'px'; A.showGoal(true); $('talk').hidden = false; $('talk').textContent = 'Print the poster'; await settle(); check('helper arrow with talk button');
      const covered = (name, panel, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panel).contains(t)) out.push(`${W}x${Hh} ${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
      reset(); A.showGoal(true); await settle();
      A.openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); A.closeChapters();
      A.openJournal(); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); A.closeJournal();
      A.openCredits(); await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); A.closeCredits();
      emit(out.length ? out : [W + 'x' + Hh + ': no layout problems'], 'LAYOUT ' + out.length); })();
  }
}

/* the tables engine/checks.js reads (docs/TESTING.md, section 7) */
export const TABLES = {
  real: ['Marcus Garvey', 'Amy Ashwood', 'Amy Jacques Garvey'],
  settle: 150,
  cast: { garvey: ['garvey', 'garvey3', 'garvey4', 'garvey5', 'garvey6'] },
  /* Garvey's two bodies (1914 bare-headed, 1916 on with a felt hat) are a declared change between chapters 2 and 3 */
  changes: [{ id: 'garvey', chapter: 3, field: 'body' }, { id: 'garvey', chapter: 3, field: 'hat' }, ...[10, 20, 30, 40, 50].flatMap((step) => [{ id: 'garvey', step, field: 'body' }, { id: 'garvey', step, field: 'hat' }])],
  ages: {},
  budget: { frameMs: 400, calls: 260, triangles: 450000, bytes: 30e6 },   /* software drawing in headless Chrome is several times slower than a phone: frame time is judged loosely there */
};
