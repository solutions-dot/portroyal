/* games/kendal/src/cast.js: who is in the game and how they look.
   There are only a dozen character bodies (shared with Marcus Garvey). Each person is one of those bodies with their own colours:
   garments are separate materials (Shirt, Breeches, Skirt, Hat, Hair, Shoes, Waistcoat, Jacket, Tie, Collar, Apron), so we recolour or hide them here. */
import { rng } from './gfx.js';

/* a look: which body, which colours (hex), which garments to hide, how tall (scale) */
const L = (base, tint, o = {}) => ({ base, tint, ...o });
export const LOOKS = {
  /* 1840s */
  worker45: L('hl_worker', { Shirt: 0xe8e2cf, Breeches: 0x6a5a46, Hat: 0xcdb372, Shoes: 0x3a2e24, Hair: 0x1c1816 }, { hide: ['Waistcoat'] }),
  muleteer: L('hl_worker', { Shirt: 0xdcd3b8, Breeches: 0x5a4c3a, Hat: 0xc2a45c, Shoes: 0x2a2018, Hair: 0x26211d, Waistcoat: 0x7a5a3c }, {}),
  gent45: L('delegate1920', { Jacket: 0x23232a, Breeches: 0x45403a, Hat: 0x16161a, Shirt: 0xf0ece0, Tie: 0x2a2a2e, Shoes: 0x15110e, Hair: 0x222020 }),
  governor: L('delegate1920', { Jacket: 0x1c2a52, Breeches: 0xe8e4d6, Hat: 0x16161a, Shirt: 0xf6f2e6, Tie: 0xb02a2a, Shoes: 0x15110e, Hair: 0x3a3836 }),
  woman45: L('nb_seller', { Shirt: 0xf0ebe0, Skirt: 0x8a4a3a, Shoes: 0x3a2e24, Hair: 0x1c1816 }),
  higgler: L('nb_seller', { Shirt: 0xf4efe4, Skirt: 0x2f6f8f, Hair: 0x201a18 }),
  lady45: L('hl_woman', { Hat: 0xf0e8d8, Shirt: 0xd8c8e8, Skirt: 0xd8c8e8, Collar: 0xf4f0e8, Hair: 0x2a2220 }),
  surveyor: L('clerk1919', { Shirt: 0xf0ecdc, Breeches: 0x5a5040, Waistcoat: 0x6a5a40, Hat: 0xcdb372, Collar: 0xf0ecdc, Tie: 0x5a3a2a, Shoes: 0x3a2e24, Hair: 0x2a2624 }, { hide: ['Tie', 'Collar'] }),
  clerk45: L('clerk1919', { Shirt: 0xf4f0e4, Breeches: 0x3a3a40, Waistcoat: 0x4a2a2a, Hat: 0x1c1c20, Collar: 0xf4f0e4, Tie: 0x1c1c20, Shoes: 0x15110e, Hair: 0x2a2624 }),
  boy45: L('nb_youth', { Shirt: 0xf2eee2, Breeches: 0x5a5a68, Hat: 0xc2a45c, Shoes: 0x3a2e24, Hair: 0x1c1816 }, { scale: 0.66 }),
  /* 1890s */
  foreman: L('hl_pressman', { Shirt: 0xd8d2b8, Breeches: 0x3c3a36, Apron: 0x8a7a5a, Shoes: 0x2a2018, Hair: 0x201c1a }, { hat: false }),
  stationmaster: L('clerk1919', { Shirt: 0xf4f0e6, Breeches: 0x232c3e, Waistcoat: 0x232c3e, Hat: 0x232c3e, Collar: 0xf4f0e6, Tie: 0x9a2a2a, Shoes: 0x15110e, Hair: 0x2a2624 }),
  farmer: L('nb_seller', { Shirt: 0xe6b23a, Skirt: 0x3a6a3a, Hair: 0x1c1816 }),
  ezraBoy: L('nb_youth', { Shirt: 0xd8d0b8, Breeches: 0x6a5a40, Hat: 0x6a5a40, Shoes: 0x2a2018, Hair: 0x1c1816 }, { scale: 0.62 }),
  fireman: L('engineer1919', { Shirt: 0x3a3a40, Breeches: 0x3a3a40, Hat: 0x2a2a30, Shoes: 0x1c1816, Hair: 0x201c1a }),
  /* 1957 */
  gran: L('hl_woman', { Hat: 0x5a3a7a, Shirt: 0xf2eee6, Skirt: 0x2a3a5a, Collar: 0xf2eee6, Shoes: 0x1c1816, Hair: 0xd6d4d0 }),
  lloyd: L('nb_youth', { Shirt: 0xf4f0e6, Breeches: 0xb5a07a, Shoes: 0xf0ece0, Hair: 0x1c1816 }, { scale: 0.7, hide: ['Hat'] }),
  ezra57: L('nb_elder', { Hair: 0xe0ddd8, Hat: 0x1f2a44, Shirt: 0xe8e4d4, Waistcoat: 0x2a3550, Breeches: 0x2a3550, Collar: 0xe8e4d4, Shoes: 0x1c1816 }),
  guard57: L('engineer1919', { Hat: 0x16213a, Shirt: 0x1d2a45, Breeches: 0x16213a, Shoes: 0x15110e, Hair: 0x201c1a }),
  vendor: L('nb_seller', { Shirt: 0xf6f2ea, Skirt: 0xe0b030, Hair: 0x201a18 }),
  mother: L('woman1914', { Shirt: 0xe8d0dc, Skirt: 0x5a3a52, Collar: 0xe8d0dc, Hair: 0x1c1816 }),
  clive: L('hl_worker', { Shirt: 0xc8c0a4, Breeches: 0x4a4636, Hat: 0x6a5a40, Waistcoat: 0x4a4636, Shoes: 0x2a2018, Hair: 0x26221e }, { hide: ['Waistcoat'] }),
  nurse: L('nurse1920', { Shirt: 0xf2f2f0, Skirt: 0xe8e8ea, Collar: 0xf2f2f0, Hair: 0x1c1816 }),
  dawn: L('nb_youth', { Shirt: 0xe9a0b8, Breeches: 0xe9a0b8, Hair: 0x1c1816, Shoes: 0xf0ece0 }, { scale: 0.52, hide: ['Hat'] }),
  louise: L('woman1914', { Shirt: 0xf4efe4, Skirt: 0x3a3a50, Collar: 0xf4efe4, Hair: 0x201a18 }),
  /* today */
  joy: L('guide2020', { Shirt: 0xe4883a, Skirt: 0x2a4a3a, Hair: 0x1c1816 }),
  andre: L('student2020', { Shirt: 0x2f6a8a, Breeches: 0x2a3a5a, Hair: 0x1c1816 }, { scale: 0.86 }),
};
const men57 = ['hl_worker', 'clerk1919', 'engineer1919', 'nb_elder', 'hl_pressman'], women57 = ['woman1914', 'hl_woman', 'nb_seller', 'nurse1920', 'guide2020'];
const DRESS = [0xf2eee6, 0xe8c8d4, 0xc8d8e8, 0xd8e8c8, 0xf0dca0, 0xd4b8e0, 0xe8a8a0, 0x9ac8c0], DARK = [0x2a3a5a, 0x4a2a3a, 0x2a4a3a, 0x3a3a3a, 0x5a3a2a], TROUS = [0x2a3040, 0x4a4a4a, 0xb5a07a, 0x6a6458, 0x2e2a28];
export function crowd57(n, seed, area, { anims = ['Idle', 'Talk1', 'Talk2', 'Laugh', 'Wave', 'Idle'], faceZ = 0, kids = 0.25 } = {}) {   /* n well-dressed people on a platform in their Sunday best; area: [x0, z0, x1, z1] */
  const r = rng(seed), out = []; const pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), kind = r(), ry = faceZ + (r() - 0.5) * 2.2, anim = pick(anims);
    if (kind < kids) out.push({ base: 'nb_youth', tint: { Shirt: pick(DRESS), Breeches: pick(TROUS), Shoes: 0x1c1816, Hair: 0x1c1816 }, hide: ['Hat'], scale: 0.55 + r() * 0.25, x, z, ry, anim, skin: 0.85 + r() * 0.4 });
    else if (kind < 0.62) out.push({ base: pick(women57), tint: { Shirt: pick(DRESS), Skirt: pick(DARK), Hat: pick([0xf0e8d8, 0xd8b8d8, 0x2a3a5a, 0xc8a050, 0x8a4a5a]), Collar: 0xf4f0e8, Hair: pick([0x1c1816, 0x1c1816, 0x6a6a6a]), Shoes: 0x1c1816 }, x, z, ry, anim, skin: 0.85 + r() * 0.4 });
    else out.push({ base: pick(men57), tint: { Shirt: 0xf4f0e6, Breeches: pick(TROUS), Waistcoat: pick(DARK), Hat: pick([0xc2a45c, 0x2a2a30, 0xcdb372, 0x4a4036]), Collar: 0xf4f0e6, Tie: pick([0x9a2a2a, 0x2a3a5a, 0x2a2a2a]), Shoes: 0x15110e, Hair: pick([0x1c1816, 0x1c1816, 0xc0bcb4]) }, hide: r() < 0.5 ? ['Waistcoat'] : [], x, z, ry, anim, skin: 0.85 + r() * 0.4 });
  }
  return out;
}
export function crowd45(n, seed, area, { anims = ['Idle', 'Wave', 'Clap', 'Cheer', 'Talk1', 'Idle'], faceZ = Math.PI } = {}) {   /* townspeople of 1845 watching the engine: straw hats, bonnets, white shirts */
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = faceZ + (r() - 0.5) * 1.4, anim = pick(anims), k = r();
    if (k < 0.2) out.push({ base: 'nb_youth', tint: { Shirt: 0xf0ece0, Breeches: pick([0x5a5a68, 0x6a5a46]), Hat: 0xc2a45c, Shoes: 0x3a2e24, Hair: 0x1c1816 }, scale: 0.55 + r() * 0.2, x, z, ry, anim, skin: 0.9 + r() * 0.3 });
    else if (k < 0.55) out.push({ base: pick(['nb_seller', 'woman1914', 'hl_woman']), tint: { Shirt: pick([0xf0ebe0, 0xe8d8b8, 0xd0e0e8]), Skirt: pick([0x8a4a3a, 0x2f6f8f, 0x5a3a52, 0x4a6a3a, 0x9a7a3a]), Hat: pick([0xf0e8d8, 0xd8c8a0]), Collar: 0xf4f0e8, Hair: 0x1c1816 }, x, z, ry, anim, skin: 0.9 + r() * 0.3 });
    else out.push({ base: pick(['hl_worker', 'clerk1919', 'engineer1919']), tint: { Shirt: pick([0xe8e2cf, 0xf0ece0, 0xd8d0b0]), Breeches: pick([0x6a5a46, 0x5a5a68, 0x4a4a3a, 0x8a7a5a]), Hat: pick([0xcdb372, 0xc2a45c, 0x2a2a30]), Waistcoat: pick([0x4a3a2a, 0x3a4a5a]), Collar: 0xf0ece0, Tie: 0x2a2a2e, Shoes: 0x3a2e24, Hair: 0x1c1816 }, hide: ['Waistcoat', 'Tie', 'Collar'], x, z, ry, anim, skin: 0.9 + r() * 0.3 });
  }
  return out;
}
export function villagers(n, seed, area, { anims = ['Idle', 'Talk1', 'Sad1', 'Idle'], faceZ = 0, lamp = 0.6 } = {}) {   /* helpers at night: plain clothes, many holding lamps */
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = faceZ + (r() - 0.5) * 2, anim = pick(anims), k = r();
    const common = { x, z, ry, anim: 'Idle', lamp: r() < lamp, skin: 0.9 + r() * 0.3 };
    if (k < 0.45) out.push({ ...common, base: pick(['nb_seller', 'woman1914', 'hl_woman']), tint: { Shirt: pick([0xe8e0d0, 0xd8c8a8, 0xb8c8d0, 0xe0b0a0]), Skirt: pick([0x4a4a52, 0x6a4a3a, 0x3a4a5a, 0x5a3a52]), Hat: pick([0x6a5a46, 0xd8c8a0]), Hair: 0x1c1816 } });
    else out.push({ ...common, base: pick(['hl_worker', 'engineer1919', 'nb_elder', 'hl_pressman']), tint: { Shirt: pick([0xc8c0a4, 0xd8d0b8, 0x8a98a8, 0xb8a888]), Breeches: pick([0x4a4636, 0x3a3a40, 0x5a5040]), Hat: pick([0x6a5a40, 0x2a2a30, 0xc2a45c]), Waistcoat: 0x4a4636, Hair: 0x1c1816 }, hide: ['Waistcoat', 'Tie', 'Collar'] });
  }
  return out;
}

/* a person you can talk to, and a background figure: both are a look plus a place to stand */
export const person = (id, look, who, x, z, ry = 0, o = {}) => ({ id, who, label: 'Talk to ' + who, x, z, ry, anim: 'Idle', ...LOOKS[look], ...o });
export const extra = (look, x, z, ry = 0, anim = 'Idle', o = {}) => ({ ...LOOKS[look], x, z, ry, anim, ...o });
