/* games/nanny/src/cast.js: who is in the game and how they look.
   The bodies are this game's own, built from the recipes in tools/nanny/people/ by tools/garvey/era.py (era 1734, the 1690 tailoring) and packed with tools/people/pack.mjs:
     maroon_man, maroon_scout, maroon_elder (a shirt and knee breeches, bare feet; the man and the elder have a knitted cap);  redcoat, militia (coat, felt hat, shoes)
     maroon_woman, maroon_elder_woman (a blouse, a long skirt and a head wrap); the soldiers wear a cocked hat made in the game (props.js cockedHat), not the builder's round felt hat;  maroon_girl, maroon_child, maroon_boy (real child bodies, built big and shrunk here by 1 / upscale)
   No description of Windward Maroon dress survives, apart from one line about a Leeward captain in 1738 (loose drawers to the knee, a small round hat, no shirt).
   So these clothes are a plain guess: undyed cloth, earth colours and indigo. Each look below recolours its body's clothes by material name. */
import { rng } from './gfx.js';

export const HATS = { maroon_woman: ['Hat'], maroon_elder_woman: ['Hat'], maroon_man: ['Hat'], maroon_elder: ['Hat'], redcoat: ['Hat'], militia: ['Hat'] };
export const KID = { maroon_boy: 1 / 1.26, maroon_girl: 1 / 1.26, maroon_child: 1 / 1.5 };   /* 1 / the recipe's upscale */
const L = (base, tint, o = {}) => ({ base, tint, ...(KID[base] ? { scale: KID[base] } : {}), ...o });
const CLOTH = [0xd8ccae, 0xc9bb98, 0xe2d8c0, 0xb8a888], EARTH = [0x6a4a34, 0x7a5a3a, 0x5a4636, 0x8a6a48], INDIGO = [0x2f3f6a, 0x3a4a78, 0x28365a], WRAP = [0xc9962e, 0xa8402e, 0x2f3f6a, 0xd8ccae, 0x7a5a3a];
export const LOOKS = {
  mama: L('maroon_woman', { Shirt: 0xd8ccae, Skirt: 0x2f3f6a, Hat: 0xc9962e }, { hat: 'Hat', h: 1.74 }),
  mamaOld: L('maroon_elder_woman', { Shirt: 0xd8ccae, Skirt: 0x2f3f6a, Hat: 0xc9962e }, { hat: 'Hat', h: 1.72 }),
  mimba: L('maroon_elder_woman', { Shirt: 0xc9bb98, Skirt: 0x7a4a2e, Hat: 0x2f3f6a }, { hat: 'Hat', h: 1.72 }),
  /* Nanny: a pale head wrap, a plain light garment and a string of beads, after the best known picture of her (which was drawn long after her time). Seen far off only. */
  nanny: L('maroon_elder_woman', { Shirt: 0xe6dcc4, Skirt: 0xd4c7a6, Hat: 0xf2ecdc }, { hat: 'Hat', h: 1.72, beads: true }),
  benebaGrown: L('maroon_woman', { Shirt: 0xe2d8c0, Skirt: 0xa8402e, Hat: 0x2f3f6a }, { hat: 'Hat', h: 1.74 }),
  quamin: L('maroon_scout', { Shirt: 0xc9bb98, Breeches: 0x5a4636 }, { h: 1.8 }),
  cubbenah: L('maroon_man', { Shirt: 0xd8ccae, Breeches: 0x6a4a34, Hat: 0x4a3a2a }, { hat: 'Hat', h: 1.84 }),
  watchman: L('maroon_man', { Shirt: 0x9a9484, Breeches: 0x3a342c, Hat: 0x2a2620 }, { hat: 'Hat', h: 1.84 }),
  elder: L('maroon_elder', { Shirt: 0xc9bb98, Breeches: 0x5a4636, Hat: 0x6a5a40 }, { hat: 'Hat', h: 1.8 }),
  beneba: L('maroon_girl', { Shirt: 0xd8ccae, Skirt: 0xd8ccae }, { scale: 0.8, h: 1.36 }),
  phibba: L('maroon_child', { Shirt: 0xe2d8c0, Skirt: 0xe2d8c0 }, { scale: 0.62, h: 1.06 }),
  phibbaGrown: L('maroon_girl', { Shirt: 0xc9962e, Skirt: 0xc9962e }, { scale: 0.88, h: 1.5 }),
  soldier: L('redcoat', { Coat: 0x9a2a22, Breeches: 0xd8ceb0, Hat: 0x16141a, Shirt: 0xe8e2d0, Bands: 0xe8e2d0, Shoes: 0x1a1612 }, { hat: false, cocked: true, h: 1.86, pale: true }),
  officer: L('redcoat', { Coat: 0x8a2420, Breeches: 0xe2d8c0, Hat: 0x16141a, Shirt: 0xf0ece0, Bands: 0xf0ece0, Shoes: 0x1a1612 }, { hat: false, cocked: true, h: 1.86, pale: true }),
  militia: L('militia', { Coat: 0x5a5244, Breeches: 0x8a7a5a, Hat: 0x3a3226, Shirt: 0xd8d0b8, Bands: 0xd8d0b8, Shoes: 0x2a2018 }, { hat: false, cocked: true, h: 1.86, pale: true }),
};
/* a villager of the hill town, for the background: a man, a woman or a child in plain cloth */
export function villager(r, pick) {
  const k = r(), skin = 0.9 + r() * 0.25;
  if (k < 0.2) { const girl = r() < 0.5, c = pick(CLOTH); return girl ? { base: 'maroon_girl', tint: { Shirt: c, Skirt: c }, scale: 0.64 + r() * 0.2, skin } : { base: 'maroon_boy', tint: { Shirt: c, Breeches: pick(EARTH) }, hat: false, scale: 0.64 + r() * 0.2, skin }; }
  if (k < 0.6) { const old = r() < 0.3, wrap = pick(WRAP); pick(WRAP); return { base: old ? 'maroon_elder_woman' : 'maroon_woman', hat: 'Hat', tint: { Shirt: pick(CLOTH), Skirt: pick([...EARTH, ...INDIGO, 0x8a4a2e]), Hat: wrap }, skin }; }   /* the second pick keeps the random sequence (and so where everyone stands) as it was */
  const b = pick(['maroon_scout', 'maroon_scout', 'maroon_man', 'maroon_man']); return { base: b, hat: b === 'maroon_scout' ? false : (r() < 0.6 ? 'Hat' : false), tint: { Shirt: pick(CLOTH), Breeches: pick(EARTH), Hat: pick([0x4a3a2a, 0x6a5a40, 0x3a342c]) }, skin };
}
/* n villagers in area [x0, z0, x1, z1] */
export function villagers(n, seed, area, { anims = ['Idle', 'Talk1', 'Idle', 'Talk2', 'Idle'], face = null } = {}) {
  const r = rng(seed), pick = (a) => a[(r() * a.length) | 0], out = [];
  for (let i = 0; i < n; i++) { const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]); out.push({ ...villager(r, pick), x, z, ry: face ? Math.atan2(face[0] - x, face[1] - z) + (r() - 0.5) * 0.5 : r() * 6.28, anim: pick(anims) }); }
  return out;
}
/* a Maroon fighter for the path: a man with a long gun and a cloak of leaves */
export function fighter(r, pick) { const b = pick(['maroon_scout', 'maroon_man', 'maroon_man']); return { base: b, hat: b === 'maroon_scout' ? false : 'Hat', tint: { Shirt: pick([0x5a6a3a, 0x4a5a34, 0x6a6a44]), Breeches: pick(EARTH), Hat: 0x3a4a2a }, skin: 0.9 + r() * 0.25, props: [['RightHand', 'musket']], cloak: true }; }
export const person = (id, look, who, x, z, ry = 0, o = {}) => ({ id, who, label: 'Talk to ' + who, x, z, ry, anim: 'Idle', ...LOOKS[look], ...o });
export const extra = (look, x, z, ry = 0, anim = 'Idle', o = {}) => ({ ...LOOKS[look], x, z, ry, anim, ...o });
