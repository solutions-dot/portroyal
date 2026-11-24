/* tools/review/people-check.src.js: every body of a game, in every clip the game ships, through the shared cloth check (engine/audit.js auditCloth)
   and a torn-cloth check of its own. Bundled and driven by people-check.mjs. One page checks one game. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { repairLegacyVertexColours } from '../../engine/colours.js';
import { loadClips, animate, CL, POSTURE } from '../../engine/anim.js';
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
const WHERE = new URLSearchParams(location.search).has('where');
function torn(body) { let n = 0, worst = 0; const a = new THREE.Vector3(), b = new THREE.Vector3(), ra = new THREE.Vector3(), rb = new THREE.Vector3(); let worstAt = '';
  body.traverse((o) => { if (!o.isSkinnedMesh || !o.visible) return; const nm = o.material.name || o.name; if (/^(Skin|Body|Hair|Human|Beard|Moustache|Locks|Crowd)/.test(nm)) return; const pos = o.geometry.attributes.position, idx = o.geometry.index; if (!idx) return; const seen = new Set();
    for (let t = 0; t < idx.count; t += 3) for (let k = 0; k < 3; k++) { const i = idx.getX(t + k), j = idx.getX(t + (k + 1) % 3), key = i < j ? i * 1e6 + j : j * 1e6 + i; if (seen.has(key)) continue; seen.add(key);
      ra.fromBufferAttribute(pos, i); rb.fromBufferAttribute(pos, j); const r = ra.distanceTo(rb); if (r < 0.004) continue; a.copy(ra); b.copy(rb); o.applyBoneTransform(i, a); o.applyBoneTransform(j, b); const d = a.distanceTo(b);
      if (d > r * 2.6 && d - r > 0.03) { n++; if (d / r > worst) { worst = d / r; worstAt = nm + (WHERE ? ' at rest ' + ra.toArray().map((v) => v.toFixed(3)).join(',') : ''); } } } });   /* with &where, the worst edge's place at rest too */
  return { n, worst, worstAt }; }
/* hats: each hat a body carries, measured on the standing body against its own skull. A crown more than 6.5 cm above the top of the skull is too tall (a top hat is the one
   kind that may be: it is listed in the baseline); a hat whose lowest point is less than 4.5 cm below the top of the skull rides high; one wider than 2.3 heads is too wide. */
function hats(body) { const out = [], box = (o) => { const p = o.geometry.attributes.position, v = new THREE.Vector3(), b = new THREE.Box3(); for (let i = 0; i < p.count; i += 2) { v.fromBufferAttribute(p, i); o.applyBoneTransform(i, v); v.applyMatrix4(o.matrixWorld); b.expandByPoint(v); } return b; };
  let head = null; body.traverse((o) => { if (o.isBone && /mixamorig:?Head$/.test(o.name)) head = o; }); if (!head) return out; const hy = head.getWorldPosition(new THREE.Vector3()).y;
  let top = -9, hw = 0; body.traverse((o) => { if (!o.isSkinnedMesh || (o.material.name !== 'Skin' && o.material.name !== 'Body')) return; const p = o.geometry.attributes.position, v = new THREE.Vector3(); let x0 = 9, x1 = -9; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); o.applyBoneTransform(i, v); v.applyMatrix4(o.matrixWorld); if (v.y > hy + 0.06) { if (v.y > top) top = v.y; x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); } } hw = Math.max(hw, x1 - x0); });
  if (top < 0) return out;
  body.traverse((o) => { if (!o.isSkinnedMesh) return; const nm = o.material.name || ''; if (!/^(Hat|Cap|Tam|Bonnet|Helmet|Bowler|Top|Straw|Felt)\w*$/.test(nm) || /Band$|Badge|Peak/.test(nm)) return; const b = box(o), up = b.max.y - top, low = top - b.min.y, w = b.max.x - b.min.x;
    if (up > 0.065) out.push(`${nm} crown stands ${(up * 100).toFixed(1)} cm above the skull`); if (low < 0.045) out.push(`${nm} rides high: it comes only ${(low * 100).toFixed(1)} cm down the head`); if (hw > 0 && w > hw * 2.3) out.push(`${nm} is ${(w / hw).toFixed(1)} heads wide`); });
  return out; }
(async () => {
  if (q.has('posture')) { const k = q.get('posture'); for (const n of Object.keys(POSTURE)) if (k === 'none' || (k === 'spine' && /Shoulder/.test(n))) POSTURE[n] = 0; }   /* for comparing: posture=none (the clips as they are) or spine (no shoulder correction) */
  for (const f of clipFiles) loadClips(await model(f));
  const names = Object.keys(CL).filter((n) => !n.startsWith('_') && (!only || only.includes(n))).sort(), poses = names.flatMap((n) => AT.map((t) => [n, t])), out = { game, clips: names.length, bodies: {} };
  for (const id of ids) { let g; try { g = await model(id); } catch (e) { out.bodies[id] = { error: String(e.message || e) }; continue; }
    const m = g.scene; let skinned = false; m.traverse((o) => { if (o.isSkinnedMesh) { skinned = true; o.frustumCulled = false; if (hide.includes(o.material.name) || o.userData.measureOnly || /Measure$/.test(o.name)) o.visible = false; } }); if (!skinned) continue;
    const ctl = animate(m, 'Idle'); if (!ctl) { out.bodies[id] = { error: 'no clip' }; continue; } m.updateMatrixWorld(true);
    const r = auditCloth(id, m, { poses, where: q.has('where') }), byClip = {}; if (q.has('where')) out.lines = (out.lines || []).concat(r.lines.slice(0, 40)); for (const l of r.lines) { const k = l.replace(/^\S+ /, '').replace(/@[\d.]+:/, ':').replace(/: \d+ points.*$/, ''); byClip[k] = (byClip[k] || 0) + 1; }
    let tn = 0, tw = 0, tAt = ''; for (const [cn, at] of poses) { const act = ctl.get(cn); if (!act) continue; ctl.mx.stopAllAction(); act.reset().play(); act.time = at * act.getClip().duration; ctl.mx.update(0); m.updateMatrixWorld(true); const t = torn(m); if (t.n) { tn += t.n; if (t.worst > tw) { tw = t.worst; tAt = cn + ' ' + t.worstAt; } } }
    ctl.mx.stopAllAction(); const idle = ctl.get('Idle'); if (idle) { idle.reset().play(); ctl.mx.update(0); } m.updateMatrixWorld(true); const hl = hats(m);
    out.bodies[id] = { cloth: r.lines.length, points: r.points, torn: tn, tornWorst: +tw.toFixed(1), tornAt: tAt, kinds: byClip, hats: hl };
    await new Promise((res) => setTimeout(res, 0)); }
  window.__RESULT = out; document.title = 'PEOPLE done';
})().catch((e) => { window.__RESULT = { error: String(e && e.stack || e) }; document.title = 'PEOPLE error'; });
