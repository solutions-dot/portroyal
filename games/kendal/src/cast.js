/* games/kendal/src/cast.js: who is in the game and how they look.
   There are thirteen character bodies, made for this game by tools/garvey/era.py from the recipes in tools/kendal/people/ (see docs/PIPELINE.md):
   men (man_work, man_suit, man_shirt, man_elder, man_apron), women (woman_long for the 1840s and 1890s, woman57 and woman_elder for 1957),
   real children (boy, girl, girl_small: a child's own shape, not a small adult) and two people of today (guide2020, student2020).
   Each person is one of those bodies with their own colours: garments are separate materials (Shirt, Breeches, Skirt, Waistcoat, Jacket, Tie, Collar, Apron, Shoes, Belt, Ribbon...),
   so we recolour or hide them here. A body can carry several hats under different material names (HATS below); `hat` picks one, or false for none. */
import { rng } from './gfx.js';

/* the hats each body carries: straw hat, flat cap, trilby, top hat, peaked uniform cap, a woman's Sunday hat, a pillbox, a head tie, a straw bonnet */
export const HATS = { man_work: ['Hat', 'Cap'], man_suit: ['Hat', 'TopHat', 'Cap'], man_shirt: ['Hat', 'Cap'], man_elder: ['Cap', 'Hat'], woman_long: ['Hat', 'Bonnet'], woman57: ['Hat', 'Cap'], woman_elder: ['Hat', 'Wrap'], boy: ['Hat'] };
/* how tall a child stands: the child bodies are stored enlarged (so every animation fits) and shrunk here. 0.8 is a child of about ten, 0.68 one of about five. */
export const KID = { boy: 0.8, girl: 0.8, girl_small: 0.66 };

/* a look: which body, which colours (hex), which garments to hide, which hat, how tall (scale) */
const L = (base, tint, o = {}) => ({ base, tint, ...(KID[base] ? { scale: KID[base] } : {}), ...o });
const STRAW = 0xcdb372, NAVY = 0x1a2540;
export const LOOKS = {
  /* 1840s */
  worker45: L('man_work', { Shirt: 0xe8e2cf, Breeches: 0x6a5a46, Hat: STRAW, Shoes: 0x3a2e24 }, { hat: 'Hat', hide: ['Waistcoat'] }),
  muleteer: L('man_work', { Shirt: 0xdcd3b8, Breeches: 0x5a4c3a, Hat: 0xc2a45c, Shoes: 0x2a2018, Waistcoat: 0x7a5a3c }, { hat: 'Hat' }),
  gent45: L('man_suit', { Jacket: 0x23232a, Waistcoat: 0x4a2a2a, Breeches: 0x45403a, TopHat: 0x16161a, Shirt: 0xf0ece0, Tie: 0x2a2a2e, Shoes: 0x15110e }, { hat: 'TopHat' }),
  governor: L('man_suit', { Jacket: 0x1c2a52, Waistcoat: 0xe8e4d6, Breeches: 0xe8e4d6, TopHat: 0x16161a, Shirt: 0xf6f2e6, Tie: 0xb02a2a, Shoes: 0x15110e }, { hat: 'TopHat' }),
  woman45: L('woman_long', { Shirt: 0xf0ebe0, Skirt: 0x8a4a3a, Hat: 0xe8dcc0, Shoes: 0x3a2e24 }, { hat: 'Hat' }),
  higgler: L('woman_long', { Shirt: 0xf4efe4, Skirt: 0x2f6f8f, Hat: 0xd9b84a }, { hat: 'Hat' }),
  lady45: L('woman_long', { Bonnet: 0xf0e8d8, Shirt: 0xd8c8e8, Skirt: 0xd8c8e8, Belt: 0x8a6aa8 }, { hat: 'Bonnet' }),
  surveyor: L('man_shirt', { Shirt: 0xf0ecdc, Breeches: 0x5a5040, Waistcoat: 0x6a5a40, Hat: STRAW, Shoes: 0x3a2e24 }, { hat: 'Hat', hide: ['Tie'] }),
  clerk45: L('man_shirt', { Shirt: 0xf4f0e4, Breeches: 0x3a3a40, Waistcoat: 0x4a2a2a, Hat: 0x1c1c20, Tie: 0x1c1c20, Shoes: 0x15110e }, { hat: 'Hat' }),
  boy45: L('boy', { Shirt: 0xf2eee2, Breeches: 0x5a5a68, Hat: 0xc2a45c, Shoes: 0x3a2e24 }, { hat: 'Hat', scale: 0.78 }),
  /* 1890s */
  foreman: L('man_apron', { Shirt: 0xd8d2b8, Breeches: 0x3c3a36, Apron: 0x8a7a5a, Shoes: 0x2a2018 }),
  stationmaster: L('man_suit', { Shirt: 0xf4f0e6, Jacket: 0x232c3e, Breeches: 0x232c3e, Waistcoat: 0x232c3e, Cap: 0x232c3e, Tie: 0x9a2a2a, Shoes: 0x15110e }, { hat: 'Cap' }),
  farmer: L('woman_long', { Shirt: 0xe6b23a, Skirt: 0x3a6a3a, Hat: 0xe8e0c8 }, { hat: 'Hat' }),
  ezraBoy: L('boy', { Shirt: 0xd8d0b8, Breeches: 0x6a5a40, Hat: 0x6a5a40, Shoes: 0x2a2018 }, { hat: 'Hat', scale: 0.76 }),
  fireman: L('man_work', { Shirt: 0x3a3a40, Breeches: 0x3a3a40, Waistcoat: 0x2a2a30, Cap: 0x2a2a30, Shoes: 0x1c1816 }, { hat: 'Cap' }),
  /* 1957 */
  gran: L('woman_elder', { Hat: 0x5a3a7a, HatBand: 0xe6e0ee, Shirt: 0xf2eee6, Skirt: 0x2a3a5a, Belt: 0x5a3a7a, Shoes: 0x1c1816 }, { hat: 'Hat' }),
  lloyd: L('boy', { Shirt: 0xf4f0e6, Breeches: 0xb5a07a, Shoes: 0x3a2a1e }, { hat: false, scale: 0.84 }),
  ezra57: L('man_elder', { Cap: 0x1f2a44, Shirt: 0xe8e4d4, Waistcoat: 0x2a3550, Breeches: 0x2a3550, Shoes: 0x1c1816 }, { hat: 'Cap' }),
  guard57: L('man_suit', { Cap: NAVY, Jacket: NAVY, Waistcoat: NAVY, Breeches: NAVY, Shirt: 0xf0ece0, Tie: 0x101826, Shoes: 0x15110e, Buttons: 0xc9a84a }, { hat: 'Cap' }),
  vendor: L('woman57', { Shirt: 0xf6f2ea, Skirt: 0xe0b030, Belt: 0x7a4a20 }, { hat: false }),
  mother: L('woman57', { Shirt: 0xe8d0dc, Skirt: 0x5a3a52, Belt: 0x3a2434 }, { hat: false }),
  clive: L('man_work', { Shirt: 0xc8c0a4, Breeches: 0x4a4636, Cap: 0x6a5a40, Shoes: 0x2a2018 }, { hat: 'Cap', hide: ['Waistcoat'] }),
  nurse: L('woman57', { Shirt: 0xf2f2f0, Skirt: 0xe8e8ea, Cap: 0xf6f6f4, Belt: 0xe8e8ea, Shoes: 0xe8e4dc }, { hat: 'Cap' }),
  dawn: L('girl_small', { Shirt: 0xe9a0b8, Skirt: 0xe9a0b8, Shoes: 0xf0ece0 }),
  louise: L('woman57', { Shirt: 0xf4efe4, Skirt: 0x3a3a50, Belt: 0x2a2a3a }, { hat: false }),
  /* today */
  joy: L('guide2020', { Shirt: 0xe4883a, Skirt: 0x2a4a3a }),
  andre: L('student2020', { Shirt: 0x2f6a8a, Breeches: 0x2a3a5a }, { scale: 0.85 }),
};
const DRESS = [0xf2eee6, 0xe8c8d4, 0xc8d8e8, 0xd8e8c8, 0xf0dca0, 0xd4b8e0, 0xe8a8a0, 0x9ac8c0], DARK = [0x2a3a5a, 0x4a2a3a, 0x2a4a3a, 0x3a3a3a, 0x5a3a2a], TROUS = [0x2a3040, 0x4a4a4a, 0xb5a07a, 0x6a6458, 0x2e2a28], SUIT = [0x2a3040, 0x3a3a40, 0x4a4036, 0x5a5a60, 0x2e2a28];
/* a child for a crowd: a boy in shorts or a girl in a frock, about five to eleven years old */
function kid(r, pick, shirts = DRESS) {
  const girl = r() < 0.5, c = pick(shirts), size = 0.68 + r() * 0.16;
  return girl ? { base: 'girl', tint: { Shirt: c, Skirt: c, Belt: pick(DARK), Ribbon: pick([0xe23c50, 0xf0ece0, 0x3a6ad9, 0xe8c040]), Shoes: 0x1c1816 }, scale: size }
    : { base: 'boy', tint: { Shirt: pick([0xf4f0e6, 0xf4f0e6, c]), Breeches: pick(TROUS), Shoes: 0x1c1816 }, hat: false, scale: size };
}
export function crowd57(n, seed, area, { anims = ['Idle', 'Talk1', 'Talk2', 'Laugh', 'Wave', 'Idle'], faceZ = 0, kids = 0.25 } = {}) {   /* n people on a platform in their Sunday best: frocks and church hats, suits and trilbies; area: [x0, z0, x1, z1] */
  const r = rng(seed), out = []; const pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), kind = r(), ry = faceZ + (r() - 0.5) * 2.2, anim = pick(anims), at = { x, z, ry, anim, skin: 0.9 + r() * 0.25 };
    if (kind < kids) out.push({ ...kid(r, pick), ...at });
    else if (kind < 0.62) { const elder = r() < 0.25, c = pick(DRESS), two = r() < 0.4;
      out.push({ props: r() < 0.3 ? [['RightHand', 'hamper']] : undefined, base: elder ? 'woman_elder' : 'woman57', hat: r() < 0.75 ? 'Hat' : (elder ? false : pick(['Cap', false])),
        tint: { Shirt: two ? 0xf4f0e8 : c, Skirt: two ? pick(DARK) : c, Hat: pick([0xf0e8d8, 0xd8b8d8, 0x2a3a5a, 0xf4f0e8, 0x8a4a5a]), HatBand: pick(DARK), Cap: pick([0xf0e8d8, 0x2a3a5a, 0x8a4a5a]), Belt: pick(DARK), Shoes: 0x1c1816 }, ...at });
      const w = out[out.length - 1].tint; if (!two && i % 3 === 0) w.Belt = c; if (!two && i % 2 === 0) w.Collar = 0xf4f0e8; }   /* a blouse and skirt wear a dark sash; a one-colour frock has a dark sash or one of its own cloth, and often a white collar */
    else { const k = r(), c = pick(SUIT);
      if (k < 0.45) out.push({ props: r() < 0.25 ? [['RightHand', 'suitcase']] : undefined, base: 'man_suit', hat: r() < 0.7 ? 'Hat' : false, tint: { Shirt: 0xf4f0e6, Jacket: c, Waistcoat: c, Breeches: c, Hat: pick([0x5a5248, 0x2a2a30, 0x6a6458, 0x4a4036]), Tie: pick([0x9a2a2a, 0x2a3a5a, 0x2a2a2a]), Shoes: 0x15110e }, ...at });
      else if (k < 0.8) out.push({ props: r() < 0.25 ? [['RightHand', 'suitcase']] : undefined, base: 'man_shirt', hat: r() < 0.6 ? 'Hat' : false, tint: { Shirt: 0xf4f0e6, Breeches: pick(TROUS), Waistcoat: pick(DARK), Hat: pick([0xc2a45c, 0x5a5248, 0xcdb372, 0x4a4036]), Tie: pick([0x9a2a2a, 0x2a3a5a, 0x2a2a2a]), Shoes: 0x15110e }, hide: r() < 0.5 ? ['Waistcoat'] : [], ...at });
      else out.push({ base: 'man_elder', hat: pick(['Hat', 'Hat', false]), tint: { Shirt: 0xf4f0e6, Breeches: pick(TROUS), Waistcoat: pick(DARK), Hat: pick([0x5a5248, 0x6a6458]), Shoes: 0x15110e }, ...at }); }
    const e = out[out.length - 1]; if (e.props) e.anim = 'Idle';   /* a hand that holds a suitcase or a hamper does not wave, clap or point: the case swung through the body */
  }
  return out;
}
export function crowd45(n, seed, area, { anims = ['Idle', 'Wave', 'Clap', 'Cheer', 'Talk1', 'Idle'], faceZ = Math.PI } = {}) {   /* townspeople of 1845 watching the engine: straw hats, head ties, white shirts */
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = faceZ + (r() - 0.5) * 1.4, anim = pick(anims), k = r(), at = { x, z, ry, anim, skin: 0.9 + r() * 0.25 };
    if (k < 0.2) { const girl = r() < 0.45, c = pick([0xf0ece0, 0xe8d8b8, 0xd0e0e8]);
      out.push(girl ? { base: 'girl', tint: { Shirt: c, Skirt: c, Belt: 0x8a6a4a, Ribbon: 0xf0ece0, Shoes: 0x3a2e24 }, scale: 0.68 + r() * 0.14, ...at } : { base: 'boy', hat: r() < 0.6 ? 'Hat' : false, tint: { Shirt: 0xf0ece0, Breeches: pick([0x5a5a68, 0x6a5a46]), Hat: 0xc2a45c, Shoes: 0x3a2e24 }, scale: 0.68 + r() * 0.14, ...at }); }
    else if (k < 0.55) out.push({ base: 'woman_long', hat: r() < 0.7 ? 'Hat' : 'Bonnet', tint: { Shirt: pick([0xf0ebe0, 0xe8d8b8, 0xd0e0e8]), Skirt: pick([0x8a4a3a, 0x2f6f8f, 0x5a3a52, 0x4a6a3a, 0x9a7a3a]), Hat: pick([0xf0e8d8, 0xd9b84a, 0xb84a3a, 0xd8c8a0]), Bonnet: 0xd8c8a0, Belt: 0x5a4030 }, ...at });
    else if (k < 0.9) out.push({ base: 'man_work', hat: r() < 0.8 ? 'Hat' : false, tint: { Shirt: pick([0xe8e2cf, 0xf0ece0, 0xd8d0b0]), Breeches: pick([0x6a5a46, 0x5a5a68, 0x4a4a3a, 0x8a7a5a]), Hat: pick([0xcdb372, 0xc2a45c]), Waistcoat: pick([0x4a3a2a, 0x3a4a5a]), Shoes: 0x3a2e24 }, hide: r() < 0.6 ? ['Waistcoat'] : [], ...at });
    else out.push({ base: 'man_shirt', hat: 'Hat', tint: { Shirt: 0xf0ece0, Breeches: pick([0x4a4a3a, 0x3a3a40]), Waistcoat: pick([0x4a2a2a, 0x3a4a5a]), Hat: 0x2a2a30, Tie: 0x2a2a2e, Shoes: 0x15110e }, ...at });
  }
  return out;
}
export function villagers(n, seed, area, { anims = ['Idle', 'Talk1', 'Sad1', 'Idle'], faceZ = 0, lamp = 0.6 } = {}) {   /* helpers at night: plain country clothes, many holding lamps */
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = faceZ + (r() - 0.5) * 2, k = r();
    const common = { x, z, ry, anim: 'Idle', lamp: r() < lamp, skin: 0.9 + r() * 0.25 };
    if (k < 0.45) { const old = r() < 0.3; out.push({ ...common, base: old ? 'woman_elder' : 'woman57', hat: old ? 'Wrap' : false, tint: { Shirt: pick([0xe8e0d0, 0xd8c8a8, 0xb8c8d0, 0xe0b0a0]), Skirt: pick([0x4a4a52, 0x6a4a3a, 0x3a4a5a, 0x5a3a52]), Wrap: pick([0xd8c8a0, 0xb84a3a, 0xe8e0d0]), Belt: 0x3a3030 } }); }
    else { const b = pick(['man_work', 'man_work', 'man_elder', 'man_apron']); out.push({ ...common, base: b, hat: b === 'man_work' ? pick(['Cap', 'Hat', false]) : (b === 'man_elder' ? pick(['Hat', false]) : false), tint: { Shirt: pick([0xc8c0a4, 0xd8d0b8, 0x8a98a8, 0xb8a888]), Breeches: pick([0x4a4636, 0x3a3a40, 0x5a5040]), Hat: pick([0x6a5a40, 0xc2a45c]), Cap: pick([0x6a5a40, 0x2a2a30]), Waistcoat: 0x4a4636, Apron: 0x7a6a50 }, hide: ['Waistcoat'] }); }
  }
  return out;
}

/* a person you can talk to, and a background figure: both are a look plus a place to stand */
export const person = (id, look, who, x, z, ry = 0, o = {}) => ({ id, who, label: 'Talk to ' + who, x, z, ry, anim: 'Idle', ...LOOKS[look], ...o });
export const extra = (look, x, z, ry = 0, anim = 'Idle', o = {}) => ({ ...LOOKS[look], x, z, ry, anim, ...o });

/* give some of a crowd somewhere to walk: each chosen person gets two or three spots near where they stand (inside `area`) and strolls between them.
   The game's people-walk code (npcTick in main.js) does the rest. seed keeps it repeatable. */
export function walkers(list, seed, area, frac = 0.5, reach = 7) {
  const r = rng(seed); for (const e of list) { if (r() > frac || /^Sit/.test(e.anim || '')) continue; const pts = [[e.x, e.z]]; const k = 1 + ((r() * 2) | 0);
    for (let i = 0; i < k; i++) pts.push([Math.max(area[0], Math.min(area[2], e.x + (r() - 0.5) * 2 * reach)), Math.max(area[1], Math.min(area[3], e.z + (r() - 0.5) * 2 * reach * 0.6))]);
    e.path = pts; e.anim = 'Idle'; e.walker = true; }
  return list;
}
