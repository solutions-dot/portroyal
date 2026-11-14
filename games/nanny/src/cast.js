/* games/nanny/src/cast.js: who is in the game and how they look.
   STAND-IN BODIES. The character builder is being rebuilt in another pull request, so this game borrows finished bodies from the other games and recolours them:
     men: kofi, turtler, buc1, ned (Port Royal: a shirt and knee breeches, bare feet or a cap);  soldiers: soldier, gunner (Port Royal: coat, hat, shoes)
     women: woman_long, woman_elder (Kendal: a blouse, a long skirt and a head tie);  children: boy, girl, girl_small (Kendal: real child bodies)
   The recipes for bodies made for this game are in tools/nanny/people/ (see docs/games/nanny.md, "Characters"). When they are built, change `base` here and nothing else.
   No description of Windward Maroon dress survives, apart from one line about a Leeward captain in 1738 (loose drawers to the knee, a small round hat, no shirt).
   So these clothes are a plain guess: undyed cloth, earth colours and indigo. Shoes are tinted to the skin so feet read as bare. */
import { rng } from './gfx.js';

export const HATS = { woman_long: ['Hat', 'Bonnet'], woman_elder: ['Hat', 'Wrap'], boy: ['Hat'], turtler: ['Hat'], buc1: ['Hat'], ned: ['Hat'], soldier: ['Hat'], gunner: ['Hat'] };
export const KID = { boy: 0.8, girl: 0.8, girl_small: 0.66 };
const BARE = 0x8a5c40;   /* shoes tinted to skin, so feet look bare */
const L = (base, tint, o = {}) => ({ base, tint, ...(KID[base] ? { scale: KID[base] } : {}), ...o });
const CLOTH = [0xd8ccae, 0xc9bb98, 0xe2d8c0, 0xb8a888], EARTH = [0x6a4a34, 0x7a5a3a, 0x5a4636, 0x8a6a48], INDIGO = [0x2f3f6a, 0x3a4a78, 0x28365a], WRAP = [0xc9962e, 0xa8402e, 0x2f3f6a, 0xd8ccae, 0x7a5a3a];
const KIDHIDE = ['Collar', 'Belt', 'Buckle', 'Buttons', 'Ribbon'];
export const LOOKS = {
  mama: L('woman_long', { Shirt: 0xd8ccae, Skirt: 0x2f3f6a, Hat: 0xc9962e, Shoes: BARE, Sole: BARE }, { hat: 'Hat', hide: ['Belt'], h: 1.74 }),
  mamaOld: L('woman_elder', { Shirt: 0xd8ccae, Skirt: 0x2f3f6a, Wrap: 0xc9962e, Shoes: BARE, Sole: BARE }, { hat: 'Wrap', hide: ['Collar'], h: 1.72 }),
  mimba: L('woman_elder', { Shirt: 0xc9bb98, Skirt: 0x7a4a2e, Wrap: 0x2f3f6a, Shoes: BARE, Sole: BARE }, { hat: 'Wrap', hide: ['Collar'], h: 1.72 }),
  nanny: L('woman_elder', { Shirt: 0xe2d8c0, Skirt: 0x8a2e24, Wrap: 0x8a2e24, Shoes: BARE, Sole: BARE }, { hat: 'Wrap', hide: ['Collar'], h: 1.72 }),
  benebaGrown: L('woman_long', { Shirt: 0xe2d8c0, Skirt: 0xa8402e, Hat: 0x2f3f6a, Shoes: BARE, Sole: BARE }, { hat: 'Hat', hide: ['Belt'], h: 1.74 }),
  quamin: L('kofi', { Shirt: 0xc9bb98, Breeches: 0x5a4636 }, { h: 1.8 }),
  cubbenah: L('turtler', { Shirt: 0xd8ccae, Breeches: 0x6a4a34, Hat: 0x4a3a2a }, { hat: 'Hat', h: 1.84 }),
  watchman: L('buc1', { Shirt: 0x9a9484, Breeches: 0x3a342c, Hat: 0x2a2620 }, { hat: 'Hat', h: 1.84 }),
  elder: L('ned', { Shirt: 0xc9bb98, Breeches: 0x5a4636, Hat: 0x6a5a40, Shoes: BARE }, { hat: 'Hat', h: 1.8 }),
  beneba: L('girl', { Shirt: 0xd8ccae, Skirt: 0xd8ccae, Shoes: BARE, Sole: BARE }, { hide: KIDHIDE, scale: 0.8, h: 1.36 }),
  phibba: L('girl_small', { Shirt: 0xe2d8c0, Skirt: 0xe2d8c0, Shoes: BARE, Sole: BARE }, { hide: KIDHIDE, scale: 0.62, h: 1.06 }),
  phibbaGrown: L('girl', { Shirt: 0xc9962e, Skirt: 0xc9962e, Shoes: BARE, Sole: BARE }, { hide: KIDHIDE, scale: 0.88, h: 1.5 }),
  soldier: L('soldier', { Coat: 0x9a2a22, Breeches: 0xd8ceb0, Hat: 0x16141a, Shirt: 0xe8e2d0, Bands: 0xe8e2d0, Shoes: 0x1a1612 }, { hat: 'Hat', h: 1.86 }),
  officer: L('gunner', { Coat: 0x8a2420, Breeches: 0xe2d8c0, Hat: 0x16141a, Shirt: 0xf0ece0, Bands: 0xf0ece0, Shoes: 0x1a1612 }, { hat: 'Hat', h: 1.86 }),
  militia: L('gunner', { Coat: 0x5a5244, Breeches: 0x8a7a5a, Hat: 0x3a3226, Shirt: 0xd8d0b8, Bands: 0xd8d0b8, Shoes: 0x2a2018 }, { hat: 'Hat', h: 1.86 }),
};
/* a villager of the hill town, for the background: a man, a woman or a child in plain cloth */
export function villager(r, pick) {
  const k = r(), skin = 0.9 + r() * 0.25;
  if (k < 0.2) { const girl = r() < 0.5, c = pick(CLOTH); return girl ? { base: 'girl', tint: { Shirt: c, Skirt: c, Shoes: BARE, Sole: BARE }, hide: KIDHIDE, scale: 0.64 + r() * 0.2, skin } : { base: 'boy', tint: { Shirt: c, Breeches: pick(EARTH), Shoes: BARE, Sole: BARE }, hide: KIDHIDE, hat: false, scale: 0.64 + r() * 0.2, skin }; }
  if (k < 0.6) { const old = r() < 0.3; return { base: old ? 'woman_elder' : 'woman_long', hat: old ? 'Wrap' : 'Hat', hide: old ? ['Collar'] : ['Belt'], tint: { Shirt: pick(CLOTH), Skirt: pick([...EARTH, ...INDIGO, 0x8a4a2e]), Hat: pick(WRAP), Wrap: pick(WRAP), Shoes: BARE, Sole: BARE }, skin }; }
  const b = pick(['kofi', 'kofi', 'turtler', 'buc1']); return { base: b, hat: b === 'kofi' ? false : (r() < 0.6 ? 'Hat' : false), tint: { Shirt: pick(CLOTH), Breeches: pick(EARTH), Hat: pick([0x4a3a2a, 0x6a5a40, 0x3a342c]) }, skin };
}
/* n villagers in area [x0, z0, x1, z1] */
export function villagers(n, seed, area, { anims = ['Idle', 'Talk1', 'Idle', 'Talk2', 'Idle'], face = null } = {}) {
  const r = rng(seed), pick = (a) => a[(r() * a.length) | 0], out = [];
  for (let i = 0; i < n; i++) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); out.push({ ...villager(r, pick), x, z, ry: face ? Math.atan2(face[0] - x, face[1] - z) + (r() - 0.5) * 0.5 : r() * 6.28, anim: pick(anims) }); }
  return out;
}
/* a Maroon fighter for the path: a man with a long gun and a cloak of leaves */
export function fighter(r, pick) { const b = pick(['kofi', 'turtler', 'buc1']); return { base: b, hat: b === 'kofi' ? false : 'Hat', tint: { Shirt: pick([0x5a6a3a, 0x4a5a34, 0x6a6a44]), Breeches: pick(EARTH), Hat: 0x3a4a2a }, skin: 0.9 + r() * 0.25, props: [['RightHand', 'musket']], cloak: true }; }
export const person = (id, look, who, x, z, ry = 0, o = {}) => ({ id, who, label: 'Talk to ' + who, x, z, ry, anim: 'Idle', ...LOOKS[look], ...o });
export const extra = (look, x, z, ry = 0, anim = 'Idle', o = {}) => ({ ...LOOKS[look], x, z, ry, anim, ...o });
