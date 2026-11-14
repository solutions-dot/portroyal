/* games/tivoli/src/cast.js: Tivoli's bodies and how each person looks. Copies Kendal's pattern (games/kendal/src/main.js and cast.js) until
   engine/people.js lands (docs/PEOPLE.md): load each body once, clone it per person,
   recolour by material name in one place, lighten the skin so faces read in every light (CLAUDE.md rule 9).
   Bodies come from recipes in tools/tivoli/people/ (era.py, then tools/tivoli/kit.py for the 2010 uniforms, then pack.mjs); see docs/games/tivoli.md "Uniforms". */
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { animate } from '../../../engine/anim.js';
import { model } from '../../../engine/loader.js';

export const SKIN_LIGHT = 1.55;   /* as Kendal: the bodies' skin is built dark, so it is lightened in the game (CLAUDE.md rule 9) */
export const HATS = { soldier2010: [], police2010: [], woman_elder: ['Hat', 'Wrap'], man_elder: ['Cap', 'Hat'], girl: [], guide2020: [] };   /* the helmets are part of the uniform bodies and always shown */
/* A look: a body (base) plus, optionally, tint {material: 0xrrggbb} and skin (a factor on SKIN_LIGHT). The uniforms keep their painted colours. */
export const LOOKS = {
  /* The story cast, from bodies COPIED from Kendal and Garvey (docs/PEOPLE.md: a body used by two games is built once and copied). Every one is fictional; the journal says so. */
  ivyGirl: { base: 'girl', scale: 0.8, tint: { Shirt: 0xf2e6c8, Skirt: 0x4a78a8, Shoes: 0x2a211b } },                 /* Ivy as a girl in Back-o-Wall, about 1963 */
  pearl: { base: 'woman_elder', hat: 'Wrap', tint: { Wrap: 0xd8b04a, Shirt: 0xe9e2d2, Skirt: 0x5a4a6a, Shoes: 0x2a211b } },   /* Ivy's gran */
  roy: { base: 'man_elder', hat: 'Cap', tint: { Cap: 0x6a5a48, Shirt: 0xd9d2bc, Waistcoat: 0x6a4a3a, Breeches: 0x4a4a42, Shoes: 0x1c1816 } },   /* a neighbour, Mass Roy */
  ivyGran: { base: 'guide2020', tint: { Shirt: 0xc6603a, Skirt: 0x3a4a6a } },                                          /* Ivy as the grandmother in 2010 (a modern body; her hair is grey in the chapters that show her) */
  soldier: { base: 'soldier2010', hide: ['ArmBandText'] },     /* Jamaica Defence Force, May 2010: woodland camouflage, covered helmet, olive vest and harness, yellow armband */
  policeCamo: { base: 'soldier2010' },  /* police attached to the army in May 2010: the same camouflage and kit, with POLICE on the yellow armband (Gleaner photographs) */
  gunman: { base: 'civilian2010' },     /* shown only far away behind the barricade and unidentified (docs/games/tivoli.md "The dispute"); plain clothes */
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
    else if (nm === 'Skin') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); else if (nm === 'Hair') o.material.color.setScalar(1); });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x || 0, s.ground || 0, s.z || 0); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; ctl.mx.update(0);
  return m;
}
