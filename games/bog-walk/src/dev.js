import { gripTick } from '../../../engine/grip.js';
import { contentsOverlap } from '../../../engine/ui-audit.js';
/* games/bog-walk/src/dev.js: test views, the automatic checks and the scripted playthrough. Dev builds only: main.js loads this file from code that runs
   only when __DEV__ is true, so the public build leaves it out (node tools/build.mjs bog-walk --dev to include it). See docs/TESTING.md and docs/games/bog-walk.md.
   Every check writes its lines to #autolog and its count of problems to the page title (AUDIT n, HELD n, LAYOUT n, RESUME n); every one must report 0.
   The playthrough (?auto=all, ?auto=ch0 ... ch5, add &one to stop after one chapter; ?auto=1, 2, 3 for the night alone) ends with "AUTO OK" or "AUTO FAIL". */
export function dev(D) {
  const { THREE, q, $, S, N, T, PL, hand, camera } = D;
  const errs = []; addEventListener('error', (e) => { errs.push(e.message + ' @' + e.lineno); document.body.dataset.err = errs.join(' | '); });
  addEventListener('unhandledrejection', (e) => { errs.push(String((e.reason && e.reason.stack) || e.reason).slice(0, 300)); document.body.dataset.err = errs.join(' | '); });
  const num = (k, d) => (q.has(k) ? parseFloat(q.get(k)) : d), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const lookAt = (x, y, z) => { const dx = x - S.x, dz = z - S.z, dy = y - S.eye; S.yaw = Math.atan2(-dx, -dz); S.pitch = Math.atan2(dy, Math.hypot(dx, dz)); };
  const report = (title, lines, count) => { let pre = $('autolog'); pre.hidden = false; pre.textContent = lines.join('\n'); document.title = title + ' ' + count; };
  const vis = (e) => { if (!e || e.closest('[hidden]')) return false; const folded=e.closest('details:not([open])');if(folded&&!folded.querySelector(':scope > summary')?.contains(e))return false; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; const r = e.getBoundingClientRect(); return r.width >= 1 && r.height >= 1; };
  const box = (e) => { const r = e.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; };
  const hits = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;

  /* ---------- the hand and the words: every visible word or button that overlaps another, runs off the screen, or is under the hand ---------- */
  function handRects() { hand.setPanelOpen(!$('pick').hidden);   /* the screen box of each part of the hand */
    camera.updateMatrixWorld(true); const v = new THREE.Vector3(), c = new THREE.Vector3(), out = [], th = Math.tan(camera.fov * Math.PI / 360);
    hand.root.traverse((o) => { if (!(o.isMesh || o.isSprite) || !o.visible) return; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      if (o.isSprite) { const sx = v.setFromMatrixColumn(o.matrixWorld, 0).length(), sy = v.setFromMatrixColumn(o.matrixWorld, 1).length(); c.setFromMatrixPosition(o.matrixWorld).applyMatrix4(camera.matrixWorldInverse); const d = -c.z; if (d <= 0) return;
        const cx = (c.x / (d * th * camera.aspect) * 0.5 + 0.5) * innerWidth, cy = (-c.y / (d * th) * 0.5 + 0.5) * innerHeight, hw = sx / 2 / (d * th * camera.aspect) * innerWidth / 2, hh = sy / 2 / (d * th) * innerHeight / 2;
        x0 = cx - hw * 0.76; x1 = cx + hw * 0.76; y0 = cy - hh * 0.68; y1 = cy + hh; }
      else { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox;
        for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y, z).applyMatrix4(o.matrixWorld).project(camera); const sx = (v.x * 0.5 + 0.5) * innerWidth, sy = (-v.y * 0.5 + 0.5) * innerHeight; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); } }
      out.push({ name: o.name || o.type, left: x0, right: x1, top: y0, bottom: y1 }); });
    return out;
  }
  const HUD_IDS = ['goal', 'icons', 'clock', 'sub', 'toast', 'way', 'pick', 'act', 'holdbox', 'skip', 'exit', 'hint', 'barT', 'barB', 'dialogue', 'tbub', 'nudge'];
  function hudOverlaps() {
    const out = [], list = [];
    for (const id of HUD_IDS) { const e = $(id); if (!vis(e) || (id === 'sub' && e.classList.contains('dim')) || (!e.textContent.trim() && e.tagName === 'P')) continue; if ((id === 'barT' || id === 'barB') && e.getBoundingClientRect().height < 1) continue; list.push([id, box(e)]); }
    for (const [id, r] of list) if (r.left < -0.5 || r.top < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5) out.push(id + ' off screen');
    if (hand.root.visible) {   /* the torch, fist and sleeve, tested by the picture they really draw: rays through the screen must not hit the hand inside a word or button, along the sides or top, or round the middle */
      const parts = []; hand.root.traverse((o) => { if (o.isMesh && o.visible) parts.push(o); }); const flame = handRects().find((r) => r.name === 'flame'), ray = new THREE.Raycaster(), nd = new THREE.Vector2();
      const hit = (sx, sy) => { if (flame && sx >= flame.left && sx <= flame.right && sy >= flame.top && sy <= flame.bottom) return 'flame'; nd.set(sx / innerWidth * 2 - 1, -(sy / innerHeight) * 2 + 1); ray.setFromCamera(nd, camera); const h = ray.intersectObjects(parts, false)[0]; return h ? (h.object.name || 'part') : null; };
      for (const [id, r] of list) { let found = null; for (let i = 0; i <= 8 && !found; i++) for (let j = 0; j <= 5 && !found; j++) { const f = hit(r.left + (r.right - r.left) * i / 8, r.top + (r.bottom - r.top) * j / 5); if (f && !(id === 'barB' && ['wrist', 'sleeve', 'cuff', 'stick'].includes(f))) found = f; } if (found) out.push('hand overlaps ' + id + ' (' + found + ')'); }
      let off = false; for (let k = 0; k <= 40 && !off; k++) { const f = k / 40; if (hit(2, f * innerHeight * 0.92) || hit(innerWidth - 3, f * innerHeight * 0.92) || hit(f * innerWidth, 2)) off = true; } if (off) out.push('hand runs off the side or top');
      const c = Math.min(innerWidth, innerHeight) * 0.07; let mid = false; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (hit(innerWidth / 2 + i * c, innerHeight / 2 + j * c)) mid = true; if (mid) out.push('hand covers the middle of the view');
    }
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) if (hits(list[i][1], list[j][1])) out.push(list[i][0] + ' overlaps ' + list[j][0]);
    return out;
  }
  /* the words inside a panel (a card, a puzzle, the journal): none overlap another, none runs off the side, none is cut off; off the top or bottom only where the panel scrolls */
  function panelCheck(name, root) {
    const out = [], W = innerWidth, H = innerHeight, els = [...root.querySelectorAll('h2,h3,p,li,button,a,summary,.pc,#pzcard')].filter((e) => vis(e) && e.textContent.trim());
    const scrolls = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1) return true; } return false; };
    for (const e of els) { const r = box(e), nm = e.id || e.tagName.toLowerCase() + ' "' + e.textContent.trim().slice(0, 24) + '"';
      if (r.left < -1 || r.right > W + 1) out.push(`${name}: ${nm} runs off the side`); if ((r.top < -1 || r.bottom > H + 1) && !scrolls(e)) out.push(`${name}: ${nm} is off the screen`);
      if (e.tagName === 'BUTTON' && e.scrollWidth > e.clientWidth + 2) out.push(`${name}: ${nm} is cut off`); }
    for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) { const a = els[i], b = els[j]; if (a.contains(b) || b.contains(a)) continue; if (contentsOverlap(a, b)) out.push(`${name}: "${a.textContent.trim().slice(0, 20)}" overlaps "${b.textContent.trim().slice(0, 20)}"`); }
    const first = root.querySelector('button:not([hidden])'); if (first && vis(first)) { const r = box(first); if (r.top >= 0 && r.bottom <= H) { const top = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); if (!top || !(top === first || first.contains(top))) out.push(`${name}: its first button is covered by ${top ? (top.id || top.className || top.tagName) : 'nothing'}`); } }
    return out;
  }
  function propOverlaps() {   /* tools in the Tube that overlap each other, or sit under the manhole or in a sand drift */
    const out = [], s = T.solids.filter((x) => x.r > 0); for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) if (Math.hypot(s[i].x - s[j].x, s[i].z - s[j].z) < s[i].r + s[j].r) out.push(s[i].what + ' overlaps ' + s[j].what);
    for (const p of s) if (Math.hypot(p.x, p.z - D.ZM) < p.r + 0.6) out.push(p.what + ' is under the manhole');
    for (const d of T.drifts) { for (const p of s) if (Math.abs(p.z - d.z) < d.l / 2 + p.r && Math.abs(p.x - d.x) < d.w / 2 + p.r) out.push(p.what + ' sits in a sand drift'); if (Math.abs(d.z - D.ZM) < d.l / 2 + 0.6) out.push('a sand drift is under the manhole'); }
    return out;
  }
  function tubeAuditRaw() { const walls = T.solids.filter((s) => s.r > 0).map((s) => [s.x - s.r - 0.3, s.z - s.r - 0.3, s.x + s.r + 0.3, s.z + s.r + 0.3]);
    return D.auditPlace({ id: 'tube', snap: D.snapMeshes(T.group), npcs: [], walls, bounds: { x0: -D.LANE, x1: D.LANE, z0: D.ZMIN + 3, z1: D.ZMAX - 1.6 }, start: { x: 0.12, z: D.ZM - 1.5 }, actions: T.patches.map((p) => ({ label: 'scrape patch ' + p.i, x: p.pos.x, z: p.pos.z, r: 2.3 })), people: [] }); }
  function tubeAudit() {   /* the engine's place audit, tools that overlap, and anything hung inside the pipe that is really outside its wall */
    const r = tubeAuditRaw(), issues = [...r.floating, ...r.inside, ...r.stuck, ...propOverlaps()], v = new THREE.Vector3(), sz = new THREE.Vector3(), R = D.R;
    for (const s of D.snapMeshes(T.group)) { s.b.getSize(sz); if (sz.z > 40 || Math.abs((s.b.min.z + s.b.max.z) / 2 - D.ZM) < 0.9) continue; if (s.geo === 'CircleGeometry' && Math.max(sz.x, sz.y) <= 2 * R + 0.06) continue;
      let far = 0; for (const x of [s.b.min.x, s.b.max.x]) for (const y of [s.b.min.y, s.b.max.y]) far = Math.max(far, Math.hypot(x, y - R)); if (far > R + 0.25) issues.push('a ' + s.geo + ' near z ' + ((s.b.min.z + s.b.max.z) / 2).toFixed(1) + ' reaches ' + far.toFixed(2) + ' m from the pipe axis, outside the wall (hidden)'); }
    T.group.traverse((o) => { if (!o.isSprite) return; v.copy(o.position); if (Math.abs(v.z - D.ZM) < 0.9) return; const d = Math.hypot(v.x, v.y - R); if (d > R - 0.05) issues.push('a flame at z ' + v.z.toFixed(1) + ' is ' + d.toFixed(2) + ' m from the pipe axis, outside the wall (hidden)'); });
    return issues;
  }
  function tubeHeld() {   /* the torch in your hand (first person, no skeleton for auditHeld): four fingers and one thumb, every digit on the stick, the stick upright, and the on-screen checks */
    const lines = [], A = hand.stickA, B = hand.stickB, ab = B.clone().sub(A), len2 = ab.lengthSq(), by = (n) => { const out = []; hand.root.traverse((o) => { if (o.isMesh && o.name === n) out.push(o); }); return out; };
    const ctr = (o) => { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); return o.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(o.matrix); };
    const onStick = (p) => { const t = Math.max(0, Math.min(1, p.clone().sub(A).dot(ab) / len2)); return { t, d: p.distanceTo(A.clone().addScaledVector(ab, t)) }; };
    const fingers = by('finger'), tips = by('fingernail'), palm = by('palm')[0], thumbs = by('thumb'), nails = by('thumbnail');
    if (fingers.length !== 4) lines.push('the fist has ' + fingers.length + ' fingers, not 4'); if (tips.length !== 4) lines.push('the fist has ' + tips.length + ' fingernails, not 4'); if (nails.length !== 1 || !thumbs.length) lines.push('the fist needs exactly one thumb with a nail (' + thumbs.length + ' thumb parts, ' + nails.length + ' nails)');
    fingers.forEach((f, i) => { const s = onStick(ctr(f)); if (s.d > 0.05) lines.push('finger ' + (i + 1) + ' is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); if (s.t < 0.15 || s.t > 0.85) lines.push('finger ' + (i + 1) + ' is not on the middle of the stick (at ' + (s.t * 100).toFixed(0) + '%)'); });
    if (palm) { const s = onStick(ctr(palm)); if (s.d > 0.07) lines.push('the palm is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); }
    for (const th of thumbs) { const s = onStick(ctr(th)); if (s.d > 0.07) lines.push('a thumb part is ' + (s.d * 100).toFixed(1) + ' cm from the stick'); }
    { const top = (o) => { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); return new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(o.matrix).max.y; };
      const topFinger = fingers.reduce((hi, f) => (!hi || top(f) > top(hi) ? f : hi), null), thumbTip = thumbs.reduce((hi, f) => (!hi || top(f) > top(hi) ? f : hi), null);
      if (topFinger && thumbTip && top(thumbTip) < top(topFinger) + 0.005) lines.push('the thumb does not rise above the index finger'); }
    const up = ab.clone().normalize().applyQuaternion(hand.inner.quaternion).applyQuaternion(hand.root.quaternion).y; if (up < 0.6) lines.push('the torch is tipped over (its up is ' + up.toFixed(2) + ')');
    document.body.classList.add('notrans'); for (const cine of [false, true]) { D.bars(cine); if (cine) D.calcLift(); N.lift = cine ? N.liftNeed : 0; hand.setLift(N.lift); hand.setCine(cine ? 1 : 0); for (const l of hudOverlaps()) if (/^hand/.test(l)) lines.push((cine ? 'with the black bars in: ' : '') + l); } D.bars(false); N.lift = 0; hand.setLift(0); hand.setCine(0);
    return lines;
  }
  /* the engine's place audit for a place outside: floating things, people inside solids or each other, spots that cannot be reached, and seated people on their seats */
  function auditWorld(P) {
    const r = D.auditPlace({ id: P.id, snap: P.snap, npcs: P.npcs.map((n) => ({ id: n.id || n.base, x: n.hx, z: n.hz, anim: n.anim, ground: n.m.userData.ground || 0, path: n.path })), walls: P.walls, bounds: P.bounds, start: P.start,
      actions: P.actions.filter((a) => a.on()).map((a) => ({ label: a.label, x: a.x, z: a.z, r: a.r })), people: P.people.map((n) => ({ id: n.id, x: n.x, z: n.z, anim: n.anim })) });
    for (const n of P.npcs) if (/^Sit/.test(n.anim || '') && n.m.userData.anim) { n.m.userData.anim.mx.update(0.1); for (const l of D.auditSeated(n.id || n.base, n.m, P.snap, n.m.userData.ground || 0, [])) r.inside.push(l); }
    /* our own rules for this game, found by eye: (1) no grass or flower may grow under a roof (P.indoor), (2) every flame or glow has something holding it:
       a person's hand, or a lamp body right round it (a light floating in the air is a mistake) */
    { const m4 = new THREE.Matrix4(), v = new THREE.Vector3(), rooms = P.indoor || []; P.group.traverse((o) => { if (!o.isInstancedMesh || !o.userData.veg) return; let bad = 0, ex = null;
        for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); v.setFromMatrixPosition(m4); if (rooms.some((w) => v.x > w[0] && v.x < w[2] && v.z > w[1] && v.z < w[3])) { bad++; ex = ex || v.clone(); } }
        if (bad) r.inside.push(`${bad} plants grow under a roof, the first at (${ex.x.toFixed(1)},${ex.z.toFixed(1)})`); }); }
    { const v = new THREE.Vector3(), held = (o) => { for (let p = o.parent; p; p = p.parent) if (P.bodies.includes(p)) return true; return false; };
      P.group.traverse((o) => { if (!o.isSprite || !o.visible || o.material.blending !== THREE.AdditiveBlending || held(o)) return; o.getWorldPosition(v); const near = P.snap.some((m) => m.b.distanceToPoint(v) < 0.12);
        if (!near) r.floating.push(`a light with nothing holding it at (${v.x.toFixed(1)},${v.y.toFixed(1)},${v.z.toFixed(1)})`); }); }
    /* our own rule for this game: nobody stands on the tram track or the siding where something will run */
    if (P.id === 'kingston') for (const n of P.npcs) if (Math.abs(n.hz) < 1.6 && n.hx > -46 && n.hx < 82) r.inside.push((n.id || n.base) + ' stands on the tram track at (' + n.hx.toFixed(1) + ',' + n.hz.toFixed(1) + ')');
    return r;
  }
  window.__bw = Object.defineProperties({hudOverlaps,handRects,propOverlaps,tubeAudit,tubeHeld,auditWorld,panelCheck},Object.getOwnPropertyDescriptors(D));

  /* ---------- test views: ?shot=<name>. Tube views as before; places outside are ?shot=<view> below or ?shot=w&p=<place>&st=<stage>&x=&z=&yaw=&pitch= ---------- */
  const shot = q.get('shot');
  const VIEWS = {   /* place, stage, x, z, yaw, pitch, env */
    st1: ['station', 10, -2, 13, 0.25, 0.02], st2: ['station', 11, -12, -2.5, 0.75, 0.04], hall: ['station', 12, 3.6, -6.4, 0.85, 0.05], hall2: ['station', 12, -5.5, -6.2, -0.8, 0.06], switch: ['station', 12, 3.6, -9.4, -1.5, 0.08],
    board: ['station', 13, 3.8, -2.3, 0, -0.06], valve: ['station', 15, -16.8, -6.4, 0.05, -0.12, 'night'], valve2: ['station', 15, -14.2, -5.6, 0.75, 0.0, 'night'], night: ['station', 15, -2, 12, 0.3, 0.06, 'night'],
    k1: ['kingston', 20, -12, 3, Math.PI / 2 + 0.25, 0.02], k2: ['kingston', 20, -28, 1.0, 1.3, 0.0], tram: ['kingston', 22, -15.6, 2.6, 1.25, 0.1], tram2: ['kingston', 22, -25.5, -2.8, -2.4, 0.08], k3: ['kingston', 20, 20, 0.6, -Math.PI / 2 + 0.1, 0.05],
    yard1: ['yard', 50, -1, 0.5, Math.PI - 0.5, 0.0], yard2: ['yard', 51, 6.6, 3.2, -1.6, -0.05], yard3: ['yard', 53, 1.2, 11.5, Math.PI + 0.3, 0.0], yard4: ['yard', 52, -3.0, 6.0, 0.0, 0.03], gate: ['yard', 53, 0, 12, Math.PI, 0.02],
    ruins1: ['ruins', 60, 2, 15.5, 0, 0.04], ruins2: ['ruins', 61, 4.2, 0.4, 0.0, -0.05], ruins3: ['ruins', 62, -12, -4, 0.7, 0.04], ruins4: ['ruins', 62, -24, -3, 1.2, 0.0],
  };
  const goWorld = async (id, st, x, z, yaw, pitch, env) => { D.startGame(); const P = await D.ensurePlace(id); $('title').hidden = true; $('hud').hidden = false; D.enterPlace(id, { env: env ? D.ENV[env] : undefined }); D.stage = st; N.phase = 'world'; S.started = true; S.x = x; S.z = z; S.yaw = yaw; S.pitch = pitch || 0; D.setGoal('', true);
    if (id === 'station') { P.setPower(st >= 16 ? 0 : 1); D.showPerson(D.byId('zeke'), st < 14); D.showPerson(D.byId('zekeV'), st >= 14); P.notice.material.map = D.noticeTex(st >= 14); P.notice.material.needsUpdate = true; }
    if (id === 'kingston') P.car.position.x = st >= 22 ? -20 : -46; if (id === 'yard') D.showPerson(D.byId('ivy'), st >= 53); return P; };
  if (shot && !VIEWS[shot] && !['w', 'nudge', 'nudge2', 'journal', 'chapters', 'credits', 'reset', 'order', 'sort', 'talk', 'final', 'ride'].includes(shot)) {   /* the Tube's own views */
    D.begin(true); D.setPhase('shot'); T.torches.forEach((t) => { t.on = num('torch', 1); }); $('hint').textContent = q.has('nohint') ? '' : $('hint').textContent;
    const wl = num('wl', 0), cl = (q.get('clean') || '').split(',').filter(Boolean).map(Number);
    S.x = num('x', 0.12); S.z = num('z', D.ZM - 1.5); S.yaw = num('yaw', 0); S.pitch = num('pitch', 0); N.wl = wl; N.torch = num('torch', 1); N.vig = num('vig', 0); N.sky = num('sky', 0); $('vig').style.opacity = N.vig; T.manhole.setSky(N.sky);
    cl.forEach((i) => T.setPatchClean(T.patches[i], 1)); if (q.has('half')) T.setPatchClean(T.patches[+q.get('half')], 0.5);
    if (shot === 'patch') { const p = T.patches[+(q.get('p') || 0)]; S.z = p.z + 1.6; S.x = -Math.sign(p.pos.x) * 0.1; lookAt(p.pos.x, p.pos.y, p.pos.z); }
    if (shot === 'fist') { hand.root.position.set(0.02, 0.36 + num('fy', 0), -0.3 + num('fz', 0)); hand.root.rotation.set(0, num('fry', -0.1), 0); S.pitch = 0; S.yaw = 0; }
    if (q.has('cine')) { document.body.classList.add('notrans'); D.bars(true); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); }
    if (shot === 'cap') { document.body.classList.add('notrans'); D.hideHud(true); D.bars(true); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); D.fadeTo('#000', 1, 0); $('fade').style.transition = 'none'; $('cap').style.transition = 'none'; q.get('line') === '2' ? D.caption('The last tram has gone.', 'The water in the pipe is shut off.') : D.caption('Inside the Tube', 'Monday 27 June 1904, about 1 a.m.'); }
    if (shot === 'poster') { D.poster = true; D.hideHud(true); document.body.classList.add('notrans'); if (!q.has('z')) S.z = -2; if (!q.has('yaw')) S.yaw = Math.PI; if (!q.has('pitch')) S.pitch = 0.03; if (!q.has('wl')) N.wl = 0.2; if (!q.has('vig')) { N.vig = 0.22; $('vig').style.opacity = N.vig; } }
    if (shot === 'end') { N.skipped = q.has('skipped'); D.showEnd(); }
    if (shot === 'up') { S.x = 0; S.z = D.ZM - 0.12; S.pitch = 1.5; }
    if (shot === 'manhole') { S.x = 0; S.z = D.ZM - 3.4; lookAt(0, 2 * D.R, D.ZM); }
    if (shot === 'torch') { const tt = T.torches[+(q.get('t') || 0)]; S.x = 0; S.z = tt.pos.z + 2.8; lookAt(tt.pos.x, tt.pos.y, tt.pos.z); }
    if (shot === 'back') { S.z = num('z', -20); S.yaw = Math.PI; S.pitch = 0.05; }
    if (shot === 'boots') { N.wl = 0.03; D.setGoal('Look down. There is water at your boots.', true); D.setClock('3 a.m.'); D.showPick('Water is round your boots. What do you do?', [['Tell Bass Henry', 'tell'], ['Keep working', 'work']], () => {}); }
    if (shot === 'hud') { D.setGoal('Scrape the rust off the pipe: 3 of 6. This is a long goal to test wrapping on a small screen.', true); D.setClock('4 a.m.'); $('skip').hidden = q.has('act'); $('act').hidden = !q.has('act'); D.say('Bass Henry', 'Out, all of you! Go to the manhole! This is a long line to test two rows.', 60000); }
    setTimeout(() => { document.body.dataset.shot = shot; document.body.dataset.overlaps = hudOverlaps().join('; ') || 'none'; }, 400);
  }
  if (VIEWS[shot] || shot === 'w') {
    const v = VIEWS[shot] || [q.get('p') || 'station', num('st', 10), num('x', 0), num('z', 0), num('yaw', 0), num('pitch', 0), q.get('env')];
    goWorld(...v).then((P) => {
      if (q.has('x')) S.x = num('x', S.x); if (q.has('z')) S.z = num('z', S.z); if (q.has('yaw')) S.yaw = num('yaw', S.yaw); if (q.has('pitch')) S.pitch = num('pitch', S.pitch);
      if (shot === 'valve' || shot === 'valve2' || shot === 'night') { P.setPower(q.has('off') ? 0 : 1); }
      if (shot === 'tram' || shot === 'tram2') { for (const n of P.extras) if (n.ctl && D.CL.Cheer) n.ctl.play('Cheer'); }
      if (shot === 'yard2' || shot === 'yard3') D.setEnv(D.ENV.morning);
      if (q.has('env')) D.setEnv(D.ENV[q.get('env')]);
      if (q.has('hud')) D.setGoal(D.stage in {} ? '' : 'Look at who came to help: 1 of 4.', true); else { $('hud').classList.add('clean'); }
      if (q.has('cine')) D.bars(true);
      for (let i = 0; i < 8; i++) D.tick(0.05);
      setTimeout(() => { document.body.dataset.shot = shot; document.body.dataset.overlaps = hudOverlaps().join('; ') || 'none'; }, 400);
    });
  }
  if (shot === 'ride') goWorld('kingston', 23, -24, 0.3, -Math.PI / 2, 0).then((P) => { P.car.position.x = num('cx', 10); S.x = P.car.position.x + 3.0; S.z = 0.05; S.eye = P.car.userData.floor + 1.5; S.yaw = num('yaw', -Math.PI / 2 + 0.25); D.bars(true); D.say('', 'The car glides down the street. People wave.', 1e6); for (const n of P.extras) if (n.ctl && D.CL.Wave) n.ctl.play('Wave'); for (let i = 0; i < 8; i++) D.tick(0.05); });
  if (shot === 'nudge' || shot === 'nudge2') goWorld('station', 13, shot === 'nudge' ? -3.5 : 2, shot === 'nudge' ? 9.5 : -1.5, shot === 'nudge' ? 0.3 : Math.PI, 0.0).then((P) => {   /* the helper arrow: over the notice board, and (nudge2) behind you */
    if (q.has('hud')) D.setGoal('Read the notice board.', true); D.NUDGE.on = true; const a = P.actions.find((x) => x.on()); const t = a ? [a.x, a.z, 1.7] : [P.spots.notice[0], P.spots.notice[1], 1.7];
    const go = () => D.showNudgeAt(t, true); go(); setInterval(go, 400); for (let i = 0; i < 4; i++) D.tick(0.05); setTimeout(() => { document.body.dataset.shot = shot; document.body.dataset.overlaps = hudOverlaps().join('; ') || 'none'; }, 600); });
  if (shot === 'talk') goWorld('yard', 53, 2.6, 13.6, Math.PI - 0.4, 0.05).then(() => { D.startTalk(D.byId('ivy')); if (q.has('n')) for (let i = 0; i < +q.get('n'); i++) $('next').click(); });
  if (['journal', 'chapters', 'credits', 'reset', 'order', 'sort', 'final'].includes(shot)) goWorld('station', 13, -2, 13, 0.25, 0.02).then(() => {
    for (const p of D.JOURNAL) D.unlock(p.id, true); D.story.boots = 'tell'; D.story.ivy = 'saw'; D.story.blame = 'ask'; D.story.story = 'heard'; for (let i = 0; i < 6; i++) D.doneCh[i] = i < 4;
    if (shot === 'journal') D.openJournal(q.get('page') || 'journey'); if (shot === 'chapters') D.openChapters(); if (shot === 'credits') D.openCredits(); if (shot === 'reset') $('reset').click();
    if (shot === 'order') D.openOrder('The journey of the water', D.JOURNEY, 'Tap the pictures in order, from the river to the tram.', () => {});
    if (shot === 'sort') { D.openSort(D.REPORT, () => {}); if (q.has('a')) $('pztray').querySelector('[data-a="saw"]').click(); }
    if (shot === 'final') D.ON[65]();
    for (let i = 0; i < 4; i++) D.tick(0.05); });

  /* ---------- ?test=audit: every place, and the Tube ---------- */
  if (['audit','collision','seating'].includes(q.get('test'))) (async () => {
    const out = [], ids = (q.get('p') || Object.keys(D.BUILD).join(',')).split(','); let n = 0; D.startGame();
    for (const id of ids) { const P = await D.ensurePlace(id); const r = auditWorld(P), l = [...r.floating, ...r.inside, ...r.stuck]; n += l.length; out.push(id + ': ' + l.length + ' issues', ...l.map((x) => '  ' + x)); }
    D.enterTube(); const t = tubeAudit(); n += t.length; out.push('tube: ' + t.length + ' issues', ...t.map((x) => '  ' + x));
    report('AUDIT', out, n);
  })();
  /* ---------- ?test=held: things carried by people in every place (engine auditHeld), and the torch in your hand ---------- */
  if (q.get('test') === 'held') (async () => {
    const out = []; let n = 0, items = 0; D.startGame();
    for (const id of Object.keys(D.BUILD)) { const P = await D.ensurePlace(id); for (const p of P.npcs) if (p.m.userData.held && p.m.userData.held.length) { items += p.m.userData.held.length; p.m.userData.anim.mx.update(0.1);gripTick(p.m); for (const l of D.auditHeld(p.id || p.base, p.m, p.m.userData.held)) { out.push(id + ': ' + l); n++; } } }
    D.enterTube(); D.resetNight(); D.setPhase('shot'); const t = tubeHeld(); n += t.length; out.push(...t.map((x) => 'torch hand: ' + x));
    out.unshift('held items: ' + n + ' issues (' + items + ' things carried by people, and the torch in your hand)'); report('HELD', out, n);
  })();
  /* ---------- ?test=layout: each interface state in turn (run at 390x800, 667x375, 800x500 and 1280x720) ---------- */
  if (q.get('test') === 'layout') (async () => {
    const out = [], W = innerWidth, Hh = innerHeight, settle = () => sleep(500), pre = `${W}x${Hh} `; document.body.classList.add('notrans');
    const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
    const inside = (name, id, e) => { const r = box(e); if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > Hh + 1) out.push(`${pre}${name}: ${id} is off the screen (${r.left | 0},${r.top | 0},${r.right | 0},${r.bottom | 0})`); };
    const check = (name) => { for (const l of hudOverlaps()) out.push(pre + name + ': ' + l);
      for (const id of HUD_IDS) { const e = $(id); if (!vis(e) || !e.textContent.trim() || id === 'dialogue' || id === 'barT' || id === 'barB') continue; if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX !== 'visible') out.push(`${pre}${name}: ${id} is clipped`); for (const b of e.querySelectorAll('button')) if (vis(b) && b.scrollWidth > b.clientWidth + 2) out.push(`${pre}${name}: a button in ${id} is cut off`); } };
    const panel = (name, sel) => { for (const l of panelCheck(name, document.querySelector(sel))) out.push(pre + l); };
    const covered = (name, panelId, ids) => { for (const id of ids) { const e = $(id), r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !$(panelId).contains(t)) out.push(`${pre}${name}: ${id} is covered by ${t ? (t.id || t.className || t.tagName) : 'nothing'}`); } };
    const reset = () => { for (const id of ['skip', 'act', 'pick', 'holdbox', 'exit', 'toast', 'way', 'nudge', 'dialogue', 'card', 'puzzle', 'journal', 'chapters', 'credits']) $(id).hidden = true; $('hint').textContent = ''; $('sub').classList.add('dim'); D.bars(false); D.hideHud(false); D.captionOff(); $('skiphint').hidden = true; D.setClock(''); document.body.classList.remove('talk'); N.lift = 0; hand.setLift(0); hand.setCine(0); if (D.TB.el) D.TB.el.hidden = true; };
    const longGoal = 'Talk to Mr Bertie, the woman and the conductor: 2 of 3. This goal is long, to test it wrapping.';
    const sayLong = () => { D.say('Old Zeke', 'This water makes the light for all of Kingston. A long line to test two rows.', 6e7); $('sub').classList.remove('dim'); };
    /* the title screen */
    { const t = $('title'); await settle(); const els = [['Start', $('start')], ['Chapters', $('tchap')], ['credit link', t.querySelector('.credit a')], ['heading', t.querySelector('h1')]]; if (vis($('allgames'))) els.push(['Main Menu', $('allgames')]);
      for (const [id, e] of els) if (vis(e)) inside('title screen', id, e); for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) if (vis(els[i][1]) && vis(els[j][1]) && hits(box(els[i][1]), box(els[j][1]))) out.push(`${pre}title screen: ${els[i][0]} overlaps ${els[j][0]}`); }
    /* outside */
    D.startGame(); const P = await D.ensurePlace('station'); D.enterPlace('station'); N.phase = 'world'; S.started = true; D.stage = 13; await settle();
    reset(); D.setGoal(longGoal, true); D.setClock('Midnight'); D.toast('Journal: The power station', 6e4); $('act').hidden = false; $('act').textContent = 'Read the notice board'; sayLong(); $('hint').textContent = 'WASD to walk. Drag to look. E to talk or use.'; await settle(); check('outside: goal, clock, toast, button, words, hint');
    /* the helper arrow, asked for on top of every word and button in turn and at the sides: it must move to a free spot (or wait), never cover them */
    for (const id of ['act', 'goal', 'sub', 'toast', 'hint']) { const e = $(id); if (!vis(e)) continue; const r = box(e); D.placeNudge((r.left + r.right) / 2, (r.top + r.bottom) / 2, 'down', 'Here!', true); await sleep(60); check('the helper arrow asked for over ' + id); }
    for (const [cls, lab] of [['left', 'This way'], ['right', 'Turn around']]) { D.placeNudge(cls === 'left' ? 60 : W - 60, Hh * 0.45, cls, lab, true); await sleep(60); check('the helper arrow at the ' + cls + ' side'); }
    $('nudge').hidden = true;
    reset(); D.setGoal('Hold the button to turn the valve wheel.', true); D.setClock('Midnight'); $('holdbox').hidden = false; sayLong(); await settle(); check('the valve: hold button with words');
    reset(); D.setGoal(longGoal, true); $('exit').hidden = false; $('act').hidden = false; $('act').textContent = 'Climb on to the car'; D.toast('Loading', 6e4); await settle(); check('Kingston: leave button and the car button');
    reset(); D.setGoal(longGoal, true); D.bars(true); sayLong(); $('act').hidden = false; $('act').textContent = 'Climb on to the car'; await settle(); check('outside with the black bars in');
    /* the tap bubble over a person, put right under the goal and on top of the buttons: it must hide itself rather than cover them */
    reset(); D.setGoal(longGoal, true); $('act').hidden = false; $('act').textContent = 'Read the notice board'; await settle(); { const z = D.byId('zeke'); D.showPerson(z, true); for (const [x, zz, yaw, pitch] of [[0.6, -5.2, 0.4, -0.5], [1.4, -9.6, 3.14, 0.2], [-0.4, -6.8, -2.5, -0.9]]) { S.x = x; S.z = zz; S.yaw = yaw; S.pitch = pitch; for (let i = 0; i < 6; i++) D.tick(0.3); await sleep(80); check('the talk bubble over Zeke at ' + x + ',' + zz); } }
    /* a conversation with choices, and a narrator's line */
    reset(); D.setGoal(longGoal, true); D.convo([{ who: 'You', text: 'What will you tell her? This is a long line to test the wrapping of the box.', choices: [{ t: 'Tell her what you saw' }, { t: 'Tell her he was brave' }] }], null); await settle(); check('a conversation with two choices'); panel('a conversation with two choices', '#dialogue'); D.leaveTalk();
    reset(); D.convo([{ who: '', text: 'Zeke did not come out.' }], null); await settle(); check('a narrator\'s line'); panel('a narrator\'s line', '#dialogue'); D.leaveTalk();
    /* cards and puzzles */
    reset(); D.stage = 13; $('reset').click(); await settle(); panel('the reset card', '#card'); check('the reset card'); D.hideCard();
    reset(); D.card('Chapter 1 is finished', ['The water is shut off. The Tube is empty.', 'Before the gang goes in, Zeke has a story to tell.'], [{ t: 'Go into the Tube', go: () => {} }, { t: 'Hear Zeke\'s story', go: () => {} }]); await settle(); panel('a chapter card', '#card'); D.hideCard();
    reset(); D.openOrder('The journey of the water', D.JOURNEY, 'Tap the pictures in order, from the river to the tram.', () => {}); await settle(); panel('the notice board, at the start', '#puzzle');
    for (let i = 0; i < 3; i++) $('pztray').querySelector(`[data-i="${i}"]`).click(); await settle(); panel('the notice board, half done', '#puzzle');
    for (let i = 3; i < 6; i++) $('pztray').querySelector(`[data-i="${i}"]`).click(); await settle(); panel('the notice board, done', '#puzzle'); D.closePuzzle(false);
    reset(); D.openOrder('What came after?', D.AFTER, 'Tap the events in the order they happened.', () => {}, { years: true }); for (let i = 0; i < 5; i++) $('pztray').querySelector(`[data-i="${i}"]`).click(); await settle(); panel('what came after, done', '#puzzle'); D.closePuzzle(false);
    reset(); D.openSort(D.WHY, () => {}); await settle(); panel('Kemar\'s cards', '#puzzle'); $('pztray').querySelector('[data-a="guess"]').click(); await settle(); panel('Kemar\'s cards, a wrong answer', '#puzzle'); $('pztray').querySelector('[data-a="know"]').click(); await settle(); panel('Kemar\'s cards, answered', '#puzzle'); D.closePuzzle(false);
    reset(); D.openSort(D.REPORT, () => {}); await settle(); panel('the reporter\'s cards', '#puzzle'); D.closePuzzle(false);
    /* panels opened in the middle of play must be on top: their title and Close button must be what you touch there */
    for (const p of D.JOURNAL) D.unlock(p.id, true); D.story.boots = 'tell'; D.story.ivy = 'brave'; D.story.blame = 'unsure'; D.story.story = 'heard';
    reset(); D.setGoal(longGoal, true); $('act').hidden = false; await settle();
    D.openJournal('journey'); await settle(); covered('journal panel in play', 'journal', ['jtitle', 'jclose']); panel('the journal', '#journal'); document.querySelector('#jpage details').open = true; await settle(); panel('the journal, dig deeper', '#journal'); D.closeJournal();
    D.openChapters(); await settle(); covered('chapters panel in play', 'chapters', ['chtitle', 'chclose']); panel('the chapters', '#chapters'); D.closeChapters();
    D.openCredits(); await settle(); covered('credits panel in play', 'credits', ['crtitle', 'crclose']); panel('the credits', '#credits'); D.closeCredits();
    reset(); D.ON[65](); for (let i = 0; i < 20; i++) D.tick(0.1); await settle(); panel('the end card', '#card'); { const a = $('ccredit').querySelector('a'); for (const l of panelCheck('end card', $('card'))) out.push(pre + l); const r = box(a), top = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); if (r.top >= 0 && r.bottom <= Hh && (!top || !(top === a || a.contains(top)))) out.push(pre + 'end card: the credit link is covered'); } D.hideCard();
    /* the Tube */
    reset(); D.enterTube(); D.resetNight(); D.setPhase('shot'); await settle();
    const busy = () => { D.setGoal('Scrape the rust off the pipe: 3 of 6. This is a long goal to test the wrapping on a small screen.', true); D.setClock('4 a.m.'); D.say('Bass Henry', 'Out, all of you! Go to the manhole! This is a long line to test two rows.', 6e7); $('sub').classList.remove('dim'); };
    reset(); busy(); $('hint').textContent = 'WASD to walk. Drag to look. E to scrape.'; $('act').hidden = false; $('act').textContent = 'Scrape'; await settle(); check('the Tube: goal, clock, words, hint and the Scrape button');
    reset(); busy(); $('skip').hidden = false; await settle(); check('the water: goal, clock, words and the Skip button');
    reset(); busy(); $('skip').hidden = false; D.bars(true); D.calcLift(); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); await settle(); check('the dark: black bars in, with the Skip button');
    reset(); busy(); $('act').hidden = false; D.bars(true); D.calcLift(); N.lift = N.liftNeed; hand.setLift(N.lift); hand.setCine(1); await settle(); check('black bars in, with the Scrape button');
    reset(); D.setGoal('Look down. There is water at your boots.', true); D.setClock('3 a.m.'); D.showPick('Water is round your boots. What do you do?', [['Tell Bass Henry', 'tell'], ['Keep working', 'work']], () => {}); await settle(); check('the Tube: the choice at your boots');
    reset(); D.hideHud(true); D.bars(true); D.fadeTo('#000', 1, 0); D.caption('The last tram has gone.', 'The water in the pipe is shut off.'); $('skiphint').hidden = false; await settle();
    { const parts = [...document.querySelectorAll('#cap p')].filter((e) => e.textContent), sh = $('skiphint'); parts.forEach((e, i) => inside('opening card', 'caption line ' + (i + 1), e)); inside('opening card', 'skip hint', sh); for (const e of parts) if (hits(box(e), box(sh))) out.push(pre + 'opening card: the caption overlaps the skip hint'); const bb = box($('barB')); if (hits(box(sh), box($('barT')))) out.push(pre + 'opening card: the skip hint is in the top bar'); if (box(sh).top < bb.top - 1 || box(sh).bottom > bb.bottom + 1) out.push(pre + 'opening card: the skip hint is not inside the bottom bar'); }
    reset(); D.fadeTo('#000', 0, 0); N.skipped = false; D.showEnd(); await settle(); panel('the end of the night', '#card'); D.hideCard();
    report('LAYOUT', out.length ? out : [`${W}x${Hh}: no layout problems`], out.length);
  })();
  /* ---------- ?test=resume: every saved stage reloads into the right place without breaking ---------- */
  if (q.get('test') === 'resume') (async () => {
    const out = [], bad = (m) => out.push('FAIL ' + m), ok = (m) => out.push('ok   ' + m); D.startGame(); await waitFor(() => D.modelsReady);
    const cases = [[13, 0], [15, 0], [21, 1], [23, 1], [30, 2], [41, 3], [52, 4], [54, 4], [62, 5], [65, 5]];
    for (const [st, ch] of cases) {
      D.stage = st; D.doneCh.fill(false); for (let i = 0; i < ch; i++) D.doneCh[i] = true; D.saveGame(); let saved = null; try { saved = JSON.parse(localStorage.getItem('bogwalk-save')); } catch (e) { /* ignore */ }
      if (!saved || saved.stage !== st) { bad(`stage ${st}: not saved under bogwalk-save`); continue; }
      D.applySave(saved); const go = st >= 10 ? (D.SAFE[st] || st) : st; const pr = D.beginChapter(ch, ch === 2 || ch === 3 ? undefined : go); await pr; await waitFor(() => !D.fading && (D.cur === 'tube' ? !['intro', 'title'].includes(N.phase) || N.intro : true), 9000); if (N.intro) D.skipIntro(); await sleep(400);
      const where = D.cur, P = PL[where], s = D.stage, lab = `saved at ${st}: resumed in ${where} at stage ${s}`;
      const want = D.CH_PLACE[ch]; if (where !== want) { bad(lab + ` (wanted ${want})`); continue; }
      let note = ''; if (ch === 0 && go >= 14 && !(D.byId('zekeV').m.visible && D.envNow.stars > 0.5)) note = 'Zeke is not at the valve at midnight'; if (ch === 0 && go < 14 && !D.byId('zeke').m.visible) note = 'Zeke is not in the turbine house';
      if (ch === 1 && go >= 22 && Math.abs(P.car.position.x + 20) > 0.5) note = 'the car is not out of the depot'; if (ch === 1 && $('exit').hidden && go < 23) note = 'no Leave button';
      if (ch === 2 && N.phase !== 'work') note = 'the night is in phase ' + N.phase; if (ch === 3 && !['trickle', 'intro', 'rise'].includes(N.phase)) note = 'the water did not start (' + N.phase + ')';
      if (ch === 4 && go >= 53 && !D.byId('ivy').m.visible) note = 'Miss Ivy is not at the gate'; if (s < go) note = 'stage went back to ' + s;
      if (D.panelsOpen() && !(ch === 4 && go === 50)) { const c = $('card').hidden ? '' : $('ctitle').textContent; if (c && !/morning|Chapter/.test(c)) note = 'a panel is open: ' + c; D.hideCard(); }
      if (note) bad(lab + ': ' + note); else ok(lab);
    }
    let ran = 0; D.convo([{ who: 'x', text: 'y' }, { who: 'x', text: 'z' }], () => { ran++; }); D.leaveTalk(); (ran === 1 ? ok : bad)('a conversation closed early still moves the story on');
    if (errs.length) bad('errors: ' + errs.join(' | '));
    const n = out.filter((l) => /^FAIL/.test(l)).length; report('RESUME', out, n);
  })();
  async function waitFor(fn, ms = 60000) { const t0 = performance.now(); while (!fn() && performance.now() - t0 < ms) await sleep(100); return fn(); }

  /* ---------- the scripted playthrough: ?auto=all (every chapter), ?auto=ch2 &one, ?auto=1|2|3 (the night only: 2 presses Skip, 3 lets the opening cards play) ---------- */
  if (q.get('auto')) (async () => {
    const mode = q.get('auto'), one = q.has('one'), pre = $('autolog'); pre.hidden = false; const log = (m) => { pre.textContent += m + '\n'; };
    const night = /^[123]$/.test(mode), first = night ? 2 : mode === 'all' ? 0 : +mode.replace('ch', ''), dt = 1 / 30; let ok = true, simT = 0; const seen = [];
    const step = (n) => { for (let i = 0; i < n; i++) { D.tick(dt); simT += dt; } };
    D.manual = true; await waitFor(() => D.modelsReady); D.startGame(); if (night || mode === 'all') { for (let i = 0; i < 6; i++) D.doneCh[i] = false; }
    const plan = mode === 'all' ? [0, 1, 2, 3, 4, 5] : night ? [2, 3] : one ? [first] : [0, 1, 2, 3, 4, 5].filter((i) => i >= first);
    const usedActions = new Set(); let lastProgress = '', progressAt = 0;
    let lastKey = '', lastT = 0, skipped = false; const stopAt = one ? first : night ? 3 : 5;
    log('plan: chapters ' + plan.join(', ')); D.beginChapter(plan[0]);   /* not awaited: the chapter's fade runs on the game's own clock, which this loop drives */
    for (let it = 0; it < 80000; it++) {
      if (it % 6 === 0) await sleep(0); step(6);
      const lk = D.stage + '|' + D.cur + '|' + N.phase + '|' + ($('card').hidden ? '' : $('ctitle').textContent), key = D.stage + '|' + D.cur + '|' + N.phase + '|' + D.unlocked.length + '|' + ($('card').hidden ? '' : $('ctitle').textContent) + '|' + ($('dialogue').hidden ? '' : $('line').textContent) + '|' + ($('puzzle').hidden ? '' : $('pzmsg').textContent);
      if (key !== lastKey) { lastKey = key; lastT = simT; } if (lk !== D.__lk) { D.__lk = lk; const ph = D.cur === 'tube' ? N.phase : D.cur; if (seen[seen.length - 1] !== ph) seen.push(ph); log(simT.toFixed(1) + 's s' + D.stage + ' ' + D.cur + ' ' + N.phase + ' pages=' + D.unlocked.length + ($('card').hidden ? '' : ' card="' + $('ctitle').textContent + '"') + ' goal="' + $('goal').textContent + '"'); }
      const progress = D.stage + '|' + D.cur + '|' + N.phase + '|' + D.unlocked.length;
      if (progress !== lastProgress) { lastProgress = progress; progressAt = simT; }
      if (simT - lastT > 60 || simT - progressAt > 120) { ok = false; log('STALL at stage ' + D.stage + ' in ' + D.cur + ' phase ' + N.phase + ' frozen=' + D.frozen + ' fading=' + D.fading + ' panels=' + D.panelsOpen()); break; }
      if (errs.length) { ok = false; log('ERRORS: ' + errs.join(' | ')); break; }
      if (one && D.doneCh[first] && first !== 2) { log('chapter ' + first + ' done'); break; }
      if (!$('card').hidden) {   /* cards: at the end of a chapter, follow the plan; otherwise the first button */
        const t = $('ctitle').textContent, btns = [...$('cbtns').querySelectorAll('button')];
        if (t === 'The end' || (t === 'You are out' && stopAt === 3)) { log('the last card: "' + t + '"'); break; }
        if (t === 'Chapter 1 is finished') { btns[plan.includes(1) ? 1 : 0].click(); continue; }
        btns[0].click(); continue;
      }
      if (!$('puzzle').hidden) {
        if (!$('pzdone').hidden) { $('pzdone').click(); continue; } if (!$('pznext').hidden) { $('pznext').click(); continue; }
        if (!$('pzlist').hidden) { const i = $('pzlist').children.length; if (!skipped && i === 0) { const w = $('pztray').querySelector('[data-i="1"]'); if (w) { w.click(); log('wrong pick gives: "' + $('pzmsg').textContent + '"'); } } const b = $('pztray').querySelector('[data-i="' + i + '"]'); if (b) b.click(); continue; }
        const set = [D.REPORT, D.WHY].find((s) => s.cards.some((c) => c[0] === $('pzcard').textContent)); const c = set.cards.find((x) => x[0] === $('pzcard').textContent); const wrong = set.bins.find((b) => b[0] !== c[1]); if (!skipped) { $('pztray').querySelector('[data-a="' + wrong[0] + '"]').click(); log('wrong answer gives: "' + $('pzmsg').textContent + '"'); } $('pztray').querySelector('[data-a="' + c[1] + '"]').click(); continue;
      }
      if (!$('puzzle').hidden) continue;
      if (!$('dialogue').hidden) { const c = $('choices').firstChild; if (c) c.click(); else $('next').click(); continue; }
      if (!$('pick').hidden) { $('pick').firstChild.click(); continue; }
      if (D.cur === 'tube') {
        if (N.intro) { if (mode === '3' && simT < 30) continue; D.skipIntro(); continue; }
        if (N.phase === 'work') { const p = T.patches.find((x) => x.clean === 0); if (p && !T.patches.some((x) => x.clean > 0 && x.clean < 1)) { S.z = p.z + 1.5; S.x = -Math.sign(p.pos.x) * 0.1; lookAt(p.pos.x, p.pos.y, p.pos.z); step(1); if (D.nearPatch() !== p) { ok = false; log('FAIL: no scrape action at patch ' + p.i); } D.act(); } continue; }
        if (mode === '2' && N.phase === 'trickle' && !D.__skipped) { D.__skipped = true; log('pressing Skip'); D.skipNight(); continue; }
        if (['rise', 'dark'].includes(N.phase)) { S.yaw = Math.PI; S.pitch = 0; D.keys.add('w'); } else D.keys.delete('w');
        if (!isFinite(camera.position.x + camera.position.y + camera.position.z)) { ok = false; log('FAIL: camera is NaN'); break; }
        continue;
      }
      D.keys.delete('w');
      if (D.locked() || D.RIDE.on) continue;
      if (!$('holdbox').hidden) { D.HOLD.on = true; continue; }
      const P = PL[D.cur]; if (!P || !P.populated) continue;
      const actionKey = (x) => D.stage + '|' + D.cur + '|' + x.label;
      const a = P.actions.find((x) => x.on() && !usedActions.has(actionKey(x))); if (a) { usedActions.add(actionKey(a)); S.x = a.x; S.z = a.z + 0.4; step(2); if (D.near === a) a.go(); else { S.x = a.x; S.z = a.z; step(2); if (D.near === a) a.go(); } continue; }
      if (D.stage === 15) { S.x = P.spots.valve[0]; S.z = P.spots.valve[1]; step(2); continue; }
      const n = P.people.find((p) => D.wantsTalk(p) || (p.see && D.stage === 51 && !D.ctr['seen_' + ({ hammond: 'hammond', minister1: 'ministers', minister2: 'ministers', haggart: 'haggart', osborne: 'osborne' })[p.id]]));
      if (n) { const ang = Math.atan2(S.x - n.x, S.z - n.z), dd = 1.2; S.x = n.x + Math.sin(ang) * dd; S.z = n.z + Math.cos(ang) * dd; step(2); if (D.near !== n) { S.x = n.x + 1.0; S.z = n.z + 0.3; step(2); } D.activate(n); continue; }
    }
    D.keys.delete('w');
    for (const i of plan) if (!D.doneCh[i]) { ok = false; log('FAIL: chapter ' + i + ' (' + D.CHAPTERS[i].name + ') not done'); }
    if (mode === 'all') { const missing = D.JOURNAL.filter((p) => !D.unlocked.includes(p.id)).map((p) => p.id); if (missing.length) { ok = false; log('FAIL: journal pages not found: ' + missing.join(', ')); } log('choices: ' + JSON.stringify(D.story)); }
    if (night) { const au = tubeAudit(); if (au.length) { ok = false; log('FAIL audit: ' + au.join('; ')); } const ho = hudOverlaps(); if (ho.length) { ok = false; log('FAIL hud: ' + ho.join('; ')); } }
    if (errs.length) { ok = false; log('FAIL errors: ' + errs.join(' | ')); }
    log('places: ' + seen.join(' > ')); document.title = (ok ? 'AUTO OK ' : 'AUTO FAIL ') + seen.join('>'); D.render();
  })();
}
