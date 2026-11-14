/* games/tivoli/src/cast.js: Tivoli's bodies and how each person looks. Copies Kendal's pattern (games/kendal/src/main.js and cast.js) until
   engine/people.js lands (docs/PEOPLE.md): load each body once, clone it per person,
   recolour by material name in one place, lighten the skin so faces read in every light (CLAUDE.md rule 9).
   Bodies come from recipes in tools/tivoli/people/ (era.py, then tools/tivoli/kit.py for the 2010 uniforms, then pack.mjs); see docs/games/tivoli.md "Uniforms". */
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { animate } from '../../../engine/anim.js';
import { model } from '../../../engine/loader.js';

export const SKIN_LIGHT = 1.55;   /* as Kendal: the bodies' skin is built dark, so it is lightened in the game (CLAUDE.md rule 9) */
export const HATS = { soldier2010: [], police2010: [] };   /* the helmets are part of the uniform bodies and always shown */
/* A look: a body (base) plus, optionally, tint {material: 0xrrggbb} and skin (a factor on SKIN_LIGHT). The uniforms keep their painted colours. */
export const LOOKS = {
  soldier: { base: 'soldier2010', hide: ['ArmBandText'] },     /* Jamaica Defence Force, May 2010: woodland camouflage, covered helmet, olive vest and harness, yellow armband */
  policeCamo: { base: 'soldier2010' },  /* police attached to the army in May 2010: the same camouflage and kit, with POLICE on the yellow armband (Gleaner photographs) */
  police: { base: 'police2010' },       /* Jamaica Constabulary Force, May 2010: navy shirt and trousers, black vest marked POLICE, grey helmet */
};
export const BODIES = ['soldier2010', 'police2010'];

const BASES = {}, PEND = {};
export function loadBase(id) {
  if (BASES[id]) return Promise.resolve(BASES[id]);
  return (PEND[id] = PEND[id] || model(id).then((g) => { g.scene.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; }); BASES[id] = g; return g; }));
}
export function makeBody(s) {
  const m = skClone(BASES[s.bodyId || s.base].scene), off = (HATS[s.base] || []).filter((h) => h !== s.hat);
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const nm = o.material.name || '';
    if ((s.hide && s.hide.includes(nm)) || off.includes(nm)) { o.visible = false; return; }
    o.material = o.material.clone(); const t = nm === 'Hair' ? undefined : s.tint && s.tint[nm];
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin' || nm === 'Hair') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x || 0, s.ground || 0, s.z || 0); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; ctl.mx.update(0);
  return m;
}
