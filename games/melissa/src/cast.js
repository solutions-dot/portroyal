/* games/melissa/src/cast.js: who is in the game and how they look.
   There are ten character bodies, shared with Kendal 1957 (no new body was made for this game, because Blender is not part of this build):
   men (man_work, man_shirt, man_elder), women (woman57, woman_elder), real children (boy, girl, girl_small: a child's own shape) and two people of today (guide2020, student2020).
   Each person is one of those bodies with their own colours: garments are separate materials (Shirt, Breeches, Skirt, Waistcoat, Tie, Shoes, Belt, Ribbon...),
   so we recolour or hide them here. A body can carry several hats under different material names (HATS below); `hat` picks one, or false for none.
   Clothes for 1988 and for 2025 are general pictures (bright cotton shirts, trousers, skirts, head ties, caps), not copies of photographs. */
import { rng } from './gfx.js';

/* the hats each body carries: straw hat, flat cap, a woman's hat, a head tie */
export const HATS = { man_work: ['Hat', 'Cap'], man_shirt: ['Hat', 'Cap'], man_elder: ['Cap', 'Hat'], woman57: ['Hat', 'Cap'], woman_elder: ['Hat', 'Wrap'], boy: ['Hat'] };
/* how tall a child stands: the child bodies are stored enlarged (so every animation fits) and shrunk here. 0.8 is a child of about ten, 0.68 one of about five. */
export const KID = { boy: 0.8, girl: 0.8, girl_small: 0.66 };

/* a look: which body, which colours (hex), which garments to hide, which hat, how tall (scale) */
const L = (base, tint, o = {}) => ({ base, tint, ...(KID[base] ? { scale: KID[base] } : {}), ...o });
const STRAW = 0xcdb372, DENIM = 0x2e4a78, BLACK = 0x1c1c20, KHAKI = 0xb5a07a, OLIVE = 0x5a6a46;
export const LOOKS = {
  /* ===== 1988: the same village, bright cotton and plain shoes ===== */
  dad88: L('man_work', { Shirt: 0xd8c8a0, Breeches: 0x4a4e5a, Shoes: 0x2a2018 }, { hat: false, hide: ['Waistcoat'] }),
  mama88: L('woman57', { Shirt: 0xe8a0b8, Skirt: 0x2e5a7a, Belt: 0x4a2a3a, Shoes: 0x2a2018 }, { hat: false }),
  delroy88: L('boy', { Shirt: 0xd8402a, Breeches: 0x3a4a6a, Shoes: 0x2a2018 }, { hat: false, scale: 0.62 }),
  clifford88: L('man_elder', { Hat: STRAW, Shirt: 0xc8d0d8, Breeches: 0x5a5040, Waistcoat: 0x5a5040, Shoes: 0x2a2018 }, { hat: 'Hat', hide: ['Waistcoat'] }),
  /* ===== 2025 ===== */
  pearl: L('woman57', { Shirt: 0x3a8e9c, Skirt: 0x2a3a5a, Belt: 0x2a2030, Shoes: 0x2a2018 }, { hat: false }),                                   /* Mum, 49: the girl of chapter 1 grown up */
  winston: L('man_elder', { Hat: STRAW, Shirt: 0xe4e0d0, Breeches: 0x4a4a46, Waistcoat: 0x4a4a46, Shoes: 0x2a2018 }, { hat: 'Hat', hide: ['Waistcoat'] }),   /* Grandpa, 75 */
  gloria: L('woman_elder', { Wrap: 0x7a4a8a, Shirt: 0xf0eee4, Skirt: 0x4a3a5a, Shoes: 0x2a2018 }, { hat: 'Wrap', hide: ['Hair'] }),                              /* Gran, 72 */
  bev: L('woman57', { Shirt: 0xe8a62a, Skirt: 0x26262a, Belt: 0x4a3a20, Shoes: 0x1c1816 }, { hat: false }),                                         /* the shop */
  raymond: L('man_work', { Cap: 0x2a2a30, Shirt: 0xa04a3a, Breeches: DENIM, Shoes: 0x1c1816 }, { hat: 'Cap', hide: ['Waistcoat'] }),             /* a neighbour with a chainsaw later */
  hyacinth: L('woman_elder', { Hat: 0xe8dcc0, Shirt: 0x86b0c8, Skirt: 0x5a4a3a, Shoes: 0x2a2018 }, { hat: 'Hat' }),                               /* the oldest neighbour */
  pastor: L('man_shirt', { Shirt: 0xf6f4ee, Breeches: BLACK, Tie: 0x6a2a3a, Shoes: 0x15110e }, { hat: false, hide: ['Waistcoat'] }),
  simone: L('guide2020', { Shirt: 0x3ba0a0, Skirt: 0x2a3a5a }),                                                                                       /* the health aide with the first-aid kit */
  keisha: L('girl_small', { Shirt: 0xf0c040, Skirt: 0xf0c040, Shoes: 0xf0ece0 }),
  marlon: L('boy', { Shirt: 0x2a6ad9, Breeches: 0x2a3040, Shoes: 0xe8e4dc }, { hat: false, scale: 0.84 }),                                          /* a cousin a little older than you */
  soldier: L('man_work', { Cap: OLIVE, Shirt: OLIVE, Breeches: OLIVE, Shoes: BLACK }, { hat: 'Cap', hide: ['Waistcoat'] }),                         /* a Jamaica Defence Force soldier: general olive clothes */
  lineman: L('man_work', { Cap: 0xf0c820, Shirt: 0xe8781a, Breeches: 0x3a3a40, Shoes: BLACK }, { hat: 'Cap', hide: ['Waistcoat'] }),                /* a line crew worker: bright shirt, yellow cap */
  sawman: L('man_work', { Cap: 0x3a3a40, Shirt: 0x3a6a4a, Breeches: 0x3a3a40, Shoes: BLACK }, { hat: 'Cap', hide: ['Waistcoat'] }),
  youth: L('student2020', { Shirt: 0xc8502a, Breeches: 0x2a3a5a }, { scale: 0.95 }),                                                              /* a teenager with a phone */
  teacher: L('guide2020', { Shirt: 0x3a7ab0, Skirt: 0x2a2a30 }),
  student: L('student2020', { Shirt: 0xe0b030, Breeches: 0x2a3a5a }, { scale: 0.85 }),
};
const BRIGHT = [0xe8505b, 0x3ba0a0, 0xf0c040, 0x5aa86a, 0xf0ece0, 0x2a6ad9, 0xe88a3a, 0xb06ac8, 0xe8a0b8], DARK = [0x2a3a5a, 0x4a2a3a, 0x2a4a3a, 0x3a3a3a, 0x5a3a2a], TROUS = [DENIM, 0x3a3a40, KHAKI, 0x4a4a46, 0x2a3040], PALE = [0xf2eee6, 0xe8c8d4, 0xc8d8e8, 0xd8e8c8, 0xf0dca0];
/* a child for a crowd: a boy in shorts or a girl in a frock, about five to eleven years old */
function kid(r, pick) {
  const girl = r() < 0.5, c = pick(BRIGHT), size = 0.66 + r() * 0.16;
  return girl ? { base: 'girl', tint: { Shirt: c, Skirt: pick(BRIGHT), Belt: pick(DARK), Ribbon: pick([0xe23c50, 0xf0ece0, 0x3a6ad9, 0xe8c040]), Shoes: 0x1c1816 }, scale: size }
    : { base: 'boy', tint: { Shirt: c, Breeches: pick(TROUS), Shoes: 0x1c1816 }, hat: false, scale: size };
}
/* people of the village: n people inside area [x0, z0, x1, z1]. Plain cotton clothes, some caps, hats and head ties. kids: share of children. */
export function folk(n, seed, area, { anims = ['Idle', 'Talk1', 'Talk2', 'Idle', 'Laugh'], faceZ = 0, kids = 0.2, elders = 0.2 } = {}) {
  const r = rng(seed), out = [], pick = (a) => a[(r() * a.length) | 0];
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]), z = area[1] + r() * (area[3] - area[1]), ry = faceZ + (r() - 0.5) * 2.2, anim = pick(anims), at = { x, z, ry, anim, skin: 0.85 + r() * 0.4 }, kind = r();
    if (kind < kids) out.push({ ...kid(r, pick), ...at });
    else if (kind < 0.55) { const old = r() < elders * 1.4, modern = !old && r() < 0.45;
      if (modern) out.push({ base: 'guide2020', tint: { Shirt: pick(BRIGHT), Skirt: pick(DARK) }, ...at });
      else out.push({ base: old ? 'woman_elder' : 'woman57', hat: old ? pick(['Wrap', 'Hat', 'Wrap']) : r() < 0.2 ? 'Hat' : false, tint: { Shirt: pick(old ? PALE : BRIGHT), Skirt: pick(DARK), Wrap: pick([0x7a4a8a, 0x3a6a9a, 0xe8e0d0, 0x5a8a4a, 0xd8a030]), Hat: pick([0xe8dcc0, 0xcdb372]), Belt: pick(DARK), Shoes: 0x1c1816 }, ...at }); }
    else { const k = r();
      if (k < 0.5) out.push({ base: 'man_work', hat: r() < 0.5 ? 'Cap' : false, tint: { Shirt: pick([...BRIGHT, 0xc8c0a4, 0xe4e0d0]), Breeches: pick(TROUS), Cap: pick([0x2a2a30, 0x3a4a5a, 0x7a3a3a, 0xcdb372]), Shoes: 0x1c1816 }, hide: ['Waistcoat'], ...at });
      else if (k < 0.72) out.push({ base: 'student2020', tint: { Shirt: pick(BRIGHT), Breeches: pick(TROUS) }, scale: 0.97, ...at });
      else if (k < 0.88) out.push({ base: 'man_shirt', hat: r() < 0.4 ? 'Cap' : false, tint: { Shirt: pick(PALE), Breeches: pick(TROUS), Cap: pick([0x2a2a30, 0x4a3a2a]), Shoes: 0x1c1816 }, hide: ['Waistcoat', 'Tie'], ...at });
      else out.push({ base: 'man_elder', hat: pick(['Hat', false]), tint: { Shirt: pick(PALE), Breeches: pick(TROUS), Hat: pick([STRAW, 0x8a8472]), Shoes: 0x1c1816 }, hide: ['Waistcoat'], ...at }); }
  }
  for (const e of out) if (e.hat === 'Wrap') e.hide = [...(e.hide || []), 'Hair'];   /* a head tie covers the hair: the grey bun showing through would look like a pom-pom */
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
