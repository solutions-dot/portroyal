/* games/_tivoli/src/fx.js: the look of gunfire without harm (CLAUDE.md rule 4, the Tivoli exception): muzzle flashes, dust kicked up on walls and the ground,
   and a little camera shake. Nothing here ever touches a person: dust is only placed on walls and ground, never on a body, and there is no blood.
   Calm mode (the opt-in card) turns off the flashes' light, the shake and the dust's size, for anyone who finds them hard. */
import * as THREE from 'three';

function glow(stops) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  for (const [o, col] of stops) r.addColorStop(o, col); g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const FLASH_TEX = glow([[0, 'rgba(255,250,220,1)'], [0.25, 'rgba(255,200,90,0.85)'], [1, 'rgba(255,120,20,0)']]);
const DUST_TEX = glow([[0, 'rgba(200,184,150,0.8)'], [0.6, 'rgba(190,172,140,0.35)'], [1, 'rgba(190,172,140,0)']]);

export const FX = { calm: false, shake: 0, items: [], group: new THREE.Group() };

export function flash(pos, size = 0.5) {   /* a flash at the muzzle: about 70 ms */
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: FLASH_TEX, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: FX.calm ? 0.5 : 1 }));
  sp.position.copy(pos); sp.scale.setScalar(size * (FX.calm ? 0.6 : 1)); FX.group.add(sp); FX.items.push({ sp, t: 0, life: 0.07, kind: 'flash', s0: sp.scale.x });
}
export function puff(pos, size = 0.9) {   /* dust on a wall or the ground: grows and fades over about 0.7 s */
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: DUST_TEX, depthWrite: false, transparent: true, opacity: 0.7 }));
  sp.position.copy(pos); sp.scale.setScalar(size * 0.4 * (FX.calm ? 0.6 : 1)); FX.group.add(sp); FX.items.push({ sp, t: 0, life: 0.7, kind: 'dust', s0: sp.scale.x, rise: 0.5 + Math.random() * 0.4 });
}
export function kick(amount = 1) { if (!FX.calm) FX.shake = Math.min(1.4, FX.shake + 0.35 * amount); }

export function updateFx(dt) {
  FX.shake = Math.max(0, FX.shake - dt * 2.4);
  for (let i = FX.items.length - 1; i >= 0; i--) {
    const it = FX.items[i]; it.t += dt; const u = it.t / it.life;
    if (u >= 1) { FX.group.remove(it.sp); it.sp.material.dispose(); FX.items.splice(i, 1); continue; }
    if (it.kind === 'flash') { it.sp.material.opacity = (FX.calm ? 0.5 : 1) * (1 - u); it.sp.scale.setScalar(it.s0 * (1 + u * 0.6)); }
    else { it.sp.material.opacity = 0.7 * (1 - u) * (1 - u); it.sp.scale.setScalar(it.s0 * (1 + u * 3)); it.sp.position.y += it.rise * dt; }
  }
}
/* the camera's shake offset for this moment (metres), zero in calm mode */
export function shakeOffset(t) { const a = FX.shake * 0.012; return [Math.sin(t * 53) * a, Math.sin(t * 61 + 1) * a, Math.sin(t * 47 + 2) * a * 0.5]; }
