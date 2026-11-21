/* Where the talk mark goes over a person (every game). headTop(body) is the world height of the real top of the head, hat and hair
   included, in the pose the body is in now. It is measured once per body: the highest point of everything that moves with the head
   (skin, hair, hat; a hat parented to the head bone too), as a height above the Head bone. After that it is the Head bone's height plus
   that number, so it follows sitting, bowing and walking, and a held pole or a raised arm never lifts it.

   Every game puts its marks the same gap over it: markAt(top, k) for the floating talk mark (its bottom MARK_GAP over the head), and
   NEAR_GAP for the anchor of the near talk button. */
import * as THREE from 'three';

export const MARK_GAP = 0.06, NEAR_GAP = 0.08;
/* the centre of a talk mark sprite of size k (its scale): its bottom always MARK_GAP over the head, near or far */
export const markAt = (top, k) => top + MARK_GAP + k * 0.5;
const CACHE = new WeakMap(), _v = new THREE.Vector3(), _h = new THREE.Vector3();

function findHead(body) {
  let head = null; body.traverse((o) => { if (!head && o.isBone && /(^|[:_])Head$/i.test(o.name)) head = o; });
  return head;
}
function measure(body, head) {
  body.updateMatrixWorld(true); head.getWorldPosition(_h); let top = -Infinity;
  const under = new Set(); head.traverse((o) => under.add(o));   /* the head bone and everything below it (eyes, head end, a parented hat) */
  body.traverse((o) => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    let vis = true; for (let q = o; q && q !== body.parent; q = q.parent) if (!q.visible) vis = false; if (!vis) return;
    const pos = o.geometry.attributes.position, n = pos.count, step = Math.max(1, Math.floor(n / 6000));
    if (o.isSkinnedMesh && o.geometry.attributes.skinIndex) {
      const bones = o.skeleton.bones, hi = new Set(); bones.forEach((b, i) => { if (under.has(b)) hi.add(i); }); if (!hi.size) return;
      o.skeleton.update(); const si = o.geometry.attributes.skinIndex, sw = o.geometry.attributes.skinWeight;
      for (let i = 0; i < n; i += step) {
        let w = 0; for (let k = 0; k < 4; k++) if (hi.has(si.getComponent(i, k))) w += sw.getComponent(i, k); if (w < 0.6) continue;
        o.getVertexPosition(i, _v); _v.applyMatrix4(o.matrixWorld); if (_v.y > top) top = _v.y;
      }
    } else if (under.has(o)) { const b = new THREE.Box3().setFromObject(o); if (b.max.y > top) top = b.max.y; }
  });
  return Number.isFinite(top) && top > _h.y ? top - _h.y : 0.14;
}

/* the world height of the top of the head (or hat); null when the body has no head bone (the game keeps its own guess then) */
export function headTop(body) {
  if (!body) return null; let c = CACHE.get(body);
  if (!c) { const head = findHead(body); if (!head) return null; c = { head, off: measure(body, head) }; CACHE.set(body, c); }
  c.head.updateWorldMatrix(true, false); c.head.getWorldPosition(_h); return _h.y + c.off;
}
/* forget a body's measure (after its hat changes) */
export function remeasure(body) { CACHE.delete(body); }

/* Who gets a talk sign (owner, 21 November 2026: "only the person you need to speak to at that particular time should have the speech
   indicator"). The game is a storybook: one sign, on one person. The gold mark floats only over a person the story needs now (the same
   people the helper arrow points to) and goes once you are near, where the talk bubble with their name takes over. Nobody else gets a
   sign; tapping them still gives a short remark that fits who they are. Every game asks these two, so the rule is the same everywhere. */
export const showTalkMark = (needed, isNear) => !!needed && !isNear;
export const showTalkBubble = (needed) => !!needed;
