/* tools/review/people-check.src.js: every body of a game, in every clip the game ships, through the shared cloth check (engine/audit.js auditCloth)
   and a torn-cloth check of its own. Bundled and driven by people-check.mjs. One page checks one game. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { repairLegacyVertexColours } from '../../engine/colours.js';
import { loadClips, animate, CL } from '../../engine/anim.js';
import { auditCloth } from '../../engine/audit.js';

const q = new URLSearchParams(location.search), game = q.get('game'), ids = q.get('ids').split(','), clipFiles = (q.get('clips') || 'anims').split(','), hide = (q.get('hide') || '').split(',').filter(Boolean);
const AT = (q.get('at') || '0.2,0.5,0.8').split(',').map(Number), only = q.get('only') ? q.get('only').split(',') : null;
const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
const script = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('missing ' + src)); document.head.appendChild(s); });
const dir = `../../games/${game}/site/models/`;
async function model(n) { await script(dir + n + '.js'); const b = atob(window.__models[n]), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); delete window.__models[n];
  return new Promise((res, rej) => loader.parse(u.buffer, '', (g) => res(repairLegacyVertexColours(g)), rej)); }
/* torn cloth: an edge of a garment (not skin, hair or eyes) that is more than 2.6 times, and 3 cm, longer than at rest. A joint stretches cloth a little; a point that follows
   the wrong bone pulls a long spike out of it. Returns how many such edges and the worst ratio. */
function torn(body) { let n = 0, worst = 0; const a = new THREE.Vector3(), b = new THREE.Vector3(), ra = new THREE.Vector3(), rb = new THREE.Vector3(); let worstAt = '';
  body.traverse((o) => { if (!o.isSkinnedMesh || !o.visible) return; const nm = o.material.name || o.name; if (/^(Skin|Body|Hair|Human|Beard|Moustache|Locks|Crowd)/.test(nm)) return; const pos = o.geometry.attributes.position, idx = o.geometry.index; if (!idx) return; const seen = new Set();
    for (let t = 0; t < idx.count; t += 3) for (let k = 0; k < 3; k++) { const i = idx.getX(t + k), j = idx.getX(t + (k + 1) % 3), key = i < j ? i * 1e6 + j : j * 1e6 + i; if (seen.has(key)) continue; seen.add(key);
      ra.fromBufferAttribute(pos, i); rb.fromBufferAttribute(pos, j); const r = ra.distanceTo(rb); if (r < 0.004) continue; a.copy(ra); b.copy(rb); o.applyBoneTransform(i, a); o.applyBoneTransform(j, b); const d = a.distanceTo(b);
      if (d > r * 2.6 && d - r > 0.03) { n++; if (d / r > worst) { worst = d / r; worstAt = nm; } } } });
  return { n, worst, worstAt }; }
(async () => {
  for (const f of clipFiles) loadClips(await model(f));
  const names = Object.keys(CL).filter((n) => !n.startsWith('_') && (!only || only.includes(n))).sort(), poses = names.flatMap((n) => AT.map((t) => [n, t])), out = { game, clips: names.length, bodies: {} };
  for (const id of ids) { let g; try { g = await model(id); } catch (e) { out.bodies[id] = { error: String(e.message || e) }; continue; }
    const m = g.scene; let skinned = false; m.traverse((o) => { if (o.isSkinnedMesh) { skinned = true; o.frustumCulled = false; if (hide.includes(o.material.name) || o.userData.measureOnly || /Measure$/.test(o.name)) o.visible = false; } }); if (!skinned) continue;
    const ctl = animate(m, 'Idle'); if (!ctl) { out.bodies[id] = { error: 'no clip' }; continue; } m.updateMatrixWorld(true);
    const r = auditCloth(id, m, { poses, where: q.has('where') }), byClip = {}; if (q.has('where')) out.lines = (out.lines || []).concat(r.lines.slice(0, 40)); for (const l of r.lines) { const k = l.replace(/^\S+ /, '').replace(/@[\d.]+:/, ':').replace(/: \d+ points.*$/, ''); byClip[k] = (byClip[k] || 0) + 1; }
    let tn = 0, tw = 0, tAt = ''; for (const [cn, at] of poses) { const act = ctl.get(cn); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); m.updateMatrixWorld(true); const t = torn(m); if (t.n) { tn += t.n; if (t.worst > tw) { tw = t.worst; tAt = cn + ' ' + t.worstAt; } } }
    out.bodies[id] = { cloth: r.lines.length, points: r.points, torn: tn, tornWorst: +tw.toFixed(1), tornAt: tAt, kinds: byClip };
    await new Promise((res) => setTimeout(res, 0)); }
  window.__RESULT = out; document.title = 'PEOPLE done';
})().catch((e) => { window.__RESULT = { error: String(e && e.stack || e) }; document.title = 'PEOPLE error'; });
