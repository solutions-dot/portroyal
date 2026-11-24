/* engine/lightkind.js: what counts as a light for the glow (engine/look.js), and for engine/batch.js, which keeps lights out of its merging so they
   stay findable: merged, a lamp's glass took the white material of its batch and was no longer known as a light (24 November 2026).
     givesLight(o, m)   an additive glow (a flame, a lamp's halo), a material giving light (emissive, at least a quarter bright), an unlit surface in a
                        bright warm colour (lamp glass, a lit window), or anything marked userData.glow; never one marked userData.noGlow */
import * as THREE from 'three';

const GLOW_MIN = 0.25, _gh = {};
export function givesLight(o, m) {
  if (!m || (o && o.userData && o.userData.noGlow) || (m.userData && m.userData.noGlow)) return false;
  if ((o && o.userData && o.userData.glow) || (m.userData && m.userData.glow)) return true;
  if (m.blending === THREE.AdditiveBlending && !(o && (o.name === 'skyGlow' || o.name === 'contactShadows'))) return true;
  if (m.isMeshBasicMaterial && m.color && !m.map && !m.vertexColors) {
    m.color.getHSL(_gh, THREE.SRGBColorSpace);
    return _gh.l >= 0.55 && _gh.s >= 0.35 && _gh.h >= 0.03 && _gh.h <= 0.17;
  }
  const e = m.emissive; if (!e) return false;
  return (0.2126 * e.r + 0.7152 * e.g + 0.0722 * e.b) * (m.emissiveIntensity ?? 1) >= GLOW_MIN;
}
