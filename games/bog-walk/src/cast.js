/* games/bog-walk/src/cast.js: who is in the game and how they look (the same system as Kendal 1957, games/kendal/src/cast.js).
   There are only a dozen character bodies (shared with Marcus Garvey and Kendal). Each person is one of those bodies with their own colours:
   garments are separate materials (Shirt, Breeches, Skirt, Hat, Hair, Shoes, Waistcoat, Jacket, Tie, Collar, Apron), so we recolour or hide them here.
   Clothes are a general picture of working people in Jamaica around 1900 (and of today); we have not found photographs of the real men to copy. */
import { rng } from './wgfx.js';

const L = (base, tint, o = {}) => ({ base, tint, ...o });
export const LOOKS = {
  /* the gang, 1904 */
  rudy: L('hl_worker', { Shirt: 0xd9cfb4, Breeches: 0x4a4a3e, Hat: 0x8a6a40, Shoes: 0x2a2018, Hair: 0x1c1816 }, { hide: ['Waistcoat'] }),
  henry: L('hl_pressman', { Shirt: 0xc8b898, Breeches: 0x3c3a36, Apron: 0x6a5a40, Shoes: 0x2a2018, Hair: 0x201c1a }, { hide: ['Apron'], hat: false }),
  zeke: L('nb_elder', { Hair: 0xd8d4cc, Hat: 0x5a4a36, Shirt: 0xd8d0b8, Waistcoat: 0x4a3e30, Breeches: 0x4a4636, Collar: 0xd8d0b8, Shoes: 0x2a2018 }),
  labourer: L('hl_worker', { Shirt: 0xc8c0a4, Breeches: 0x4a4636, Hat: 0x6a5a40, Waistcoat: 0x4a4636, Shoes: 0x2a2018, Hair: 0x26221e }, { hide: ['Waistcoat'] }),
  /* the morning after */
  ivy: L('woman1914', { Shirt: 0xe8e0d0, Skirt: 0x3a3a4a, Collar: 0xe8e0d0, Hair: 0x1c1816 }),
  hammond: L('delegate1920', { Jacket: 0x23232a, Breeches: 0x3a3a40, Hat: 0x16161a, Shirt: 0xf0ece0, Tie: 0x2a2a2e, Shoes: 0x15110e, Hair: 0x2a2624 }, { hide: ['Hat'] }),
  minister: L('clerk1919', { Shirt: 0x1c1c22, Breeches: 0x1c1c22, Waistcoat: 0x1c1c22, Hat: 0x16161a, Collar: 0xf4f0e8, Tie: 0x1c1c22, Shoes: 0x15110e, Hair: 0x3a3632 }),
  haggart: L('clerk1919', { Shirt: 0xf0ecdc, Breeches: 0x3a3a40, Waistcoat: 0x3a3a40, Hat: 0x1c1c20, Collar: 0xf4f0e4, Tie: 0x5a2a2a, Shoes: 0x15110e, Hair: 0x4a4440 }),
  osborne: L('delegate1920', { Jacket: 0x2a2a30, Breeches: 0x6a6458, Hat: 0x16161a, Shirt: 0xf6f2e6, Tie: 0x3a2a4a, Shoes: 0x15110e, Hair: 0x8a8680 }),
  reporter: L('clerk1919', { Shirt: 0xf0ecdc, Breeches: 0x5a5040, Waistcoat: 0x6a5a40, Hat: 0xcdb372, Collar: 0xf0ecdc, Tie: 0x2a3a5a, Shoes: 0x3a2e24, Hair: 0x2a2624 }),
  /* Kingston, 1899 */
  bertie: L('nb_elder', { Hair: 0xe0ddd8, Hat: 0xc2a45c, Shirt: 0xe8e4d4, Waistcoat: 0x5a4030, Breeches: 0x4a4036, Collar: 0xe8e4d4, Shoes: 0x2a2018 }),
  woman: L('hl_woman', { Hat: 0xf0e8d8, Shirt: 0xe8c8d4, Skirt: 0x5a3a52, Collar: 0xf4f0e8, Hair: 0x2a2220 }),
  conductor: L('engineer1919', { Shirt: 0x1d2a45, Breeches: 0x16213a, Hat: 0x16213a, Shoes: 0x15110e, Hair: 0x201c1a }),
  /* today */
  grant: L('guide2020', { Shirt: 0x2f7a8a, Skirt: 0x2a3a4a, Hair: 0x1c1816 }),
  kemar: L('student2020', { Shirt: 0xf2f0e8, Breeches: 0x6a5a40, Hair: 0x1c1816 }, { scale: 0.88 }),
};

const pickOf = (r) => (a) => a[(r() * a.length) | 0];
/* working people of 1904 at the station: plain shirts and trousers, caps and straw hats; women in long skirts */
export function crowd04(n, seed, area, { anims = ['Idle', 'Sad1', 'Idle', 'Sad2'], face = 0, women = 0.4, lamp = 0 } = {}) {
  const r = rng(seed), out = [], pick = pickOf(r);
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = face + (r() - 0.5) * 1.6, anim = pick(anims), skin = 0.85 + r() * 0.35;
    if (r() < women) out.push({ base: pick(['nb_seller', 'woman1914', 'hl_woman']), tint: { Shirt: pick([0xe8e0d0, 0xd8c8a8, 0xb8c8d0, 0xe0c0b0]), Skirt: pick([0x3a3a4a, 0x4a3a32, 0x2a3a4a, 0x4a3a4a]), Hat: pick([0x6a5a46, 0xd8c8a0]), Collar: 0xece4d4, Hair: 0x1c1816 }, x, z, ry, anim, skin });
    else out.push({ base: pick(['hl_worker', 'engineer1919', 'hl_pressman', 'nb_elder']), tint: { Shirt: pick([0xc8c0a4, 0xd8d0b8, 0x9aa0a8, 0xb8a888]), Breeches: pick([0x4a4636, 0x3a3a40, 0x5a5040]), Hat: pick([0x6a5a40, 0x2a2a30, 0xc2a45c]), Waistcoat: 0x4a4636, Apron: 0x6a5a40, Hair: pick([0x1c1816, 0x1c1816, 0x9a968e]) }, hide: ['Waistcoat', 'Tie', 'Collar', 'Apron'], x, z, ry, anim, skin, lamp: r() < lamp });
  }
  return out;
}
/* townspeople of Kingston, 1899, out to see the first electric car: Sunday best, straw hats and bonnets, children */
export function crowd99(n, seed, area, { anims = ['Cheer', 'Clap', 'Idle', 'Wave', 'Talk1', 'Laugh'], face = 0 } = {}) {
  const r = rng(seed), out = [], pick = pickOf(r);
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = face + (r() - 0.5) * 1.2, anim = pick(anims), k = r(), skin = 0.85 + r() * 0.35;
    if (k < 0.2) out.push({ base: 'nb_youth', tint: { Shirt: pick([0xf0ece0, 0xe0d8c0]), Breeches: pick([0x5a5a68, 0x6a5a46]), Hat: 0xc2a45c, Shoes: 0x3a2e24, Hair: 0x1c1816 }, hide: r() < 0.5 ? ['Hat'] : [], scale: 0.58 + r() * 0.2, x, z, ry, anim, skin });
    else if (k < 0.58) out.push({ base: pick(['nb_seller', 'woman1914', 'hl_woman']), tint: { Shirt: pick([0xf0ebe0, 0xe8d8b8, 0xd0e0e8, 0xe8c8d4]), Skirt: pick([0x8a4a3a, 0x2f6f8f, 0x5a3a52, 0x4a6a3a, 0x9a7a3a]), Hat: pick([0xf0e8d8, 0xd8c8a0, 0xe8b0b8]), Collar: 0xf4f0e8, Hair: 0x1c1816 }, x, z, ry, anim, skin });
    else out.push({ base: pick(['hl_worker', 'clerk1919', 'engineer1919', 'delegate1920']), tint: { Shirt: pick([0xe8e2cf, 0xf0ece0, 0xd8d0b0]), Breeches: pick([0x6a5a46, 0x5a5a68, 0x4a4a3a, 0x2a2a30]), Jacket: pick([0x2a2a30, 0x4a4036, 0x3a4a5a]), Hat: pick([0xcdb372, 0xc2a45c, 0x2a2a30]), Waistcoat: pick([0x4a3a2a, 0x3a4a5a]), Collar: 0xf0ece0, Tie: 0x2a2a2e, Shoes: 0x3a2e24, Hair: 0x1c1816 }, hide: r() < 0.5 ? ['Waistcoat'] : [], x, z, ry, anim, skin });
  }
  return out;
}
/* visitors today */
export function crowdNow(n, seed, area, { anims = ['Idle', 'Talk1', 'Point', 'Idle'], face = 0 } = {}) {
  const r = rng(seed), out = [], pick = pickOf(r);
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = face + (r() - 0.5) * 1.6, anim = pick(anims), skin = 0.85 + r() * 0.35;
    out.push({ base: 'nb_youth', tint: { Shirt: pick([0xf2f0e8, 0x2f6a8a, 0xe4883a, 0x6a8a3a]), Breeches: pick([0x2a3a5a, 0x6a5a40, 0x3a3a3a]), Shoes: 0xf0ece0, Hair: 0x1c1816 }, hide: ['Hat'], scale: 0.78 + r() * 0.12, x, z, ry, anim, skin });
  }
  return out;
}

/* a person you can talk to (or look at), and a background figure: both are a look plus a place to stand */
export const person = (id, look, who, x, z, ry = 0, o = {}) => ({ id, who, label: 'Talk to ' + who, x, z, ry, anim: 'Idle', ...LOOKS[look], ...o });
export const extra = (look, x, z, ry = 0, anim = 'Idle', o = {}) => ({ ...LOOKS[look], x, z, ry, anim, ...o });
