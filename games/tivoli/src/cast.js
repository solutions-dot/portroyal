/* games/tivoli/src/cast.js: Tivoli's bodies and how each person looks. Copies Kendal's pattern (games/kendal/src/main.js and cast.js) until
   engine/people.js lands (docs/PEOPLE.md): load each body once, clone it per person,
   recolour by material name in one place, lighten the skin so faces read in every light (CLAUDE.md rule 9).
   Bodies come from recipes in tools/tivoli/people/ (era.py, then tools/tivoli/kit.py for the 2010 uniforms, then pack.mjs); see docs/games/tivoli.md "Uniforms". */
import { clone as skClone } from 'three/addons/utils/SkeletonUtils.js';
import { hiddenWith } from '../../../engine/audit.js';
import { animate } from '../../../engine/anim.js';
import { model } from '../../../engine/loader.js';

export const SKIN_LIGHT = 1.55;   /* as Kendal: the bodies' skin is built dark, so it is lightened in the game (CLAUDE.md rule 9) */
export const HATS = { soldier2010: [], police2010: [], woman_elder: ['Hat', 'Wrap'], man_elder: ['Cap', 'Hat'], girl: [], guide2020: [] };   /* the helmets are part of the uniform bodies and always shown */
/* A look: a body (base) plus, optionally, tint {material: 0xrrggbb} and skin (a factor on SKIN_LIGHT). The uniforms keep their painted colours. */
export const LOOKS = {
  /* variant (17 November 2026): story people who borrow one body each get their own face (<base>_b, <base>_c; engine/faces.js), so Mass Roy, Mr Clarke and Pastor Grant
     are three men, not one. Ivy keeps one face at every age. */
  /* The story cast, from bodies COPIED from Kendal and Garvey (docs/PEOPLE.md: a body used by two games is built once and copied). Every one is fictional; the journal says so. */
  ivyGirl: { base: 'girl', scale: 0.8, tint: { Shirt: 0xf2e6c8, Skirt: 0x4a78a8, Shoes: 0x2a211b } },                 /* Ivy as a girl in Back-o-Wall, about 1963 */
  pearl: { base: 'woman_elder', hat: 'Wrap', tint: { Wrap: 0xd8b04a, Shirt: 0xe9e2d2, Skirt: 0x5a4a6a, Shoes: 0x2a211b } },   /* Ivy's gran */
  roy: { base: 'man_elder', hat: 'Cap', tint: { Cap: 0x6a5a48, Shirt: 0xd9d2bc, Waistcoat: 0x6a4a3a, Breeches: 0x4a4a42, Shoes: 0x1c1816 } },   /* a neighbour, Mass Roy */
  clarke: { base: 'man_elder', variant: '_b', hat: 'Hat', tint: { Hat: 0x3a3a3a, Shirt: 0xf0ece2, Waistcoat: 0x3a4a5a, Breeches: 0x2e2e34, Shoes: 0x1c1816 } },   /* Mr Clarke at the community centre, 1960s (fictional) */
  ivyGran: { base: 'guide2020', tint: { Shirt: 0xc6603a, Skirt: 0x3a4a6a } },                                          /* Ivy as the grandmother in 2010 (a modern body; her hair is grey in the chapters that show her) */
  dawn: { base: 'woman_elder', variant: '_b', hat: 'Wrap', tint: { Wrap: 0x2f6a8a, Shirt: 0xe6d8b8, Skirt: 0x7a3a3a, Shoes: 0x2a211b } },   /* Miss Dawn at the grocery, 2010 (fictional; a borrowed Kendal body until a 2010 one is built) */
  brown: { base: 'civilian2010', skin: 1.15, tint: { Shirt: 0x6a7a5a, Breeches: 0x3a3e48 } },   /* skin 1.15: ?test=all found his face too dark in the 2016 courtyard light (rule 9) */                                          /* Mr Brown, a neighbour, 2010 (fictional) */
  pastor: { base: 'man_elder', variant: '_c', hat: 'Hat', tint: { Hat: 0x222226, Shirt: 0xf4f2ec, Waistcoat: 0x1e1e24, Breeches: 0x1e1e24, Shoes: 0x111111 } },   /* Pastor Grant, 2010 (fictional; a borrowed Kendal body) */
  ivyMum: { base: 'guide2020', tint: { Shirt: 0xe8b84a, Skirt: 0x3a5a7a } },                                         /* Ivy grown up, about 1980 (fictional; the same body as Gran Ivy) */
  coach: { base: 'civilian2010', variant: '_b', tint: { Shirt: 0x1f7a3a, Breeches: 0xf0ece2, Shoes: 0x111111 } },                     /* Coach Davis, about 1980 (fictional) */
  andre: { base: 'youth2010', tint: { Shirt: 0x2a6ad0, Breeches: 0x46608c } },                                       /* Andre the painter, today (fictional) */
  kemesha: { base: 'girl', variant: '_b', scale: 0.92, tint: { Shirt: 0xd0402a, Skirt: 0x111111, Shoes: 0xf0ece2 } },                  /* Kemesha from the dance troupe, today (fictional) */
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
export const bodyOf = (look) => look.base + (look.variant || '');   /* the body file a look uses */
export function makeBody(s) {
  const m = skClone(BASES[s.bodyId || bodyOf(s)].scene), off = (HATS[s.base] || []).filter((h) => h !== s.hat);
  m.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; const nm = o.material.name || '';
    if ((s.hide && (s.hide.includes(nm) || (nm === 'WaistcoatButtons' && s.hide.includes('Waistcoat')))) || hiddenWith(nm, off)) { o.visible = false; return; }   /* a hat not worn goes with its band (engine/audit.js) */
    o.material = o.material.clone(); const t = nm === 'Hair' ? undefined : s.tint && s.tint[nm];
    if (t !== undefined) { o.material.vertexColors = false; o.material.color.setHex(t); o.material.needsUpdate = true; }
    else if (nm === 'Skin') o.material.color.setScalar((s.skin || 1) * SKIN_LIGHT); else if (nm === 'Hair') o.material.color.setScalar(1); });
  m.scale.setScalar(s.scale || 1); m.position.set(s.x || 0, s.ground || 0, s.z || 0); m.rotation.y = s.ry || 0; m.userData.ground = s.ground || 0;
  const ctl = animate(m, s.anim || 'Idle'); m.userData.anim = ctl; ctl.mx.update(0);
  return m;
}
