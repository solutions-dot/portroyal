/* games/tivoli/src/checks.js: Tivoli's own dev-only place checks (overlapSolids, sinkCheck), and the Tivoli rule for the shared cloth check.
   The cloth, walk and skin checks used to be local copies here; since 16 November 2026 Tivoli uses the shared ones (engine/audit.js auditCloth and auditWalk,
   engine/skinprobe.js skinProbe), which have moved on a lot (jagged edges, fingers in cloth, finger holes, malformed hands, folds, belt-to-vest and sleeve exemptions).
   They are re-exported here so the dev views keep one import. */
export { auditCloth, auditWalk } from '../../../engine/audit.js';
export { skinProbe } from '../../../engine/skinprobe.js';

/* The one Tivoli-only cloth rule, given to auditCloth as `skip(under, cover)`: the order the 2010 kit is worn in (exact names, so BeltPouch is not taken for
   the belt). The shared check knows the order of ordinary clothes but not of boots over shoes, a vest over the shirt and belt, an armband over the sleeve and the
   vest, its letters on the armband, pouches and straps on the vest and belt, a helmet over the hair. Without this it reads a boot as under the shoe it covers and
   reports the shoe's whole outside as "Boots shows through Shoes". So a pair is skipped when the first piece is worn OVER the second (it is meant to be outside it);
   every other pair is tested by the shared check as usual, with the order it reads from the body itself. */
const KIT_ORDER = [/^(Body|Skin)$/, /^(Hair|Bun|Puffs|Plaits|Moustache)/, /^Sock/, /^Shirt$/, /^(Placket|Pocket)/, /^(Collar|Tie|Buttons)/, /^(Breeches|Skirt)$/, /^(Belt|Buckle|Sash)$/, /^Waistcoat/, /^Apron/,
  /^(Jacket|JacketSkirt|Lapels|JButtons|Coat|CoatSkirt)/, /^(Shoes|Sole)/, /^(Ribbon|Hat|Cap|TopHat|Bonnet|Wrap|Scarf)/, /^(Boots|Cargo)$/, /^Vest$/, /^(ArmBand|Epaulette|Chevrons)$/,
  /^(BeltStraps|BeltPouch|BeltCanister|VestPouch|VestText|ArmBandText)$/, /^(Helmet|HelmetStrap)$/];
const KIT = /^(Boots|Cargo|Vest|ArmBand|Epaulette|Chevrons|BeltStraps|BeltPouch|BeltCanister|VestPouch|VestText|ArmBandText|Helmet|HelmetStrap)$/;
const rank = (n) => KIT_ORDER.findIndex((r) => r.test(n));
export const CLOTH_SKIP = (under, cover) => { if (!KIT.test(under) && !KIT.test(cover)) return false; const a = rank(under), b = rank(cover); return a >= 0 && b >= 0 && a >= b; };

/* The overlap check: no solid thing stands inside another (a tree in a building, a car in a wall, a bush in a fence). Each solid is a box {kind, name, x0..x1, z0..z1, y0..y1}. Two boxes overlapping by more than 5 cm on every side are reported.
   Not counted: plants touching plants, a building touching a building, posts under their own walkway, and things that are meant to touch. Returns a list of text lines (empty means 0). */
const OK_PAIRS = new Set(['tree|tree', 'tree|bush', 'bush|bush', 'building|building', 'fence|fence', 'pole|pole', 'bush|pole', 'post|post']);
export function overlapSolids(solids, tol = 0.05) {
  const out = [];
  for (let i = 0; i < solids.length; i++) for (let j = i + 1; j < solids.length; j++) {
    const a = solids[i], b = solids[j]; if (OK_PAIRS.has(a.kind + '|' + b.kind) || OK_PAIRS.has(b.kind + '|' + a.kind)) continue;
    const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), oz = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0), oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
    if (ox > tol && oz > tol && oy > tol) out.push(`${a.name} (${a.kind}) overlaps ${b.name} (${b.kind}) by ${(ox * 100) | 0} x ${(oz * 100) | 0} x ${(oy * 100) | 0} cm`);
  }
  return out;
}

/* The sinking check: nobody stands below the surface under their feet. For each person, find the top of every low, flat box (a pavement, a kerb, a path, a step) under
   where they stand; if that top is higher than the ground they are pinned to (person.ground), their shoes sink into it. Returns text lines (empty means 0). */
export function sinkCheck(snap, people) {
  const out = [];
  for (const p of people) {
    let top = -1e9, what = '';
    for (const m of snap) { const b = m.b, h = b.max.y - b.min.y; if (h > 0.45 || b.min.y > 0.05 || b.max.x - b.min.x < 0.4 || b.max.z - b.min.z < 0.4) continue; if (p.x > b.min.x && p.x < b.max.x && p.z > b.min.z && p.z < b.max.z && b.max.y > top) { top = b.max.y; what = m.col || m.mat; } }
    if (top > (p.ground || 0) + 0.02) out.push(`${p.id}@(${p.x.toFixed(1)},${p.z.toFixed(1)}) stands ${((top - (p.ground || 0)) * 100).toFixed(0)} cm below the top of a ${what} surface under them (set its ground)`);
  }
  return out;
}
