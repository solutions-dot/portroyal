/* The helper guide on the ground (every game). When the player stands still or stalls, a gold arrow lies on the ground just in front of
   them and points the way to go, and a gold ring pulses on the ground round the person or place they need. No words on the screen.

   Every game has a first-person camera, so the arrow sits on the ground a few steps ahead, low in the view, where the player can see it
   whichever way they look. It turns to point at the next step on the way. When the goal is behind, it points back toward the player
   (turn round). The ring shows round the goal itself.

   const guide = createGuide({ scene, camera, ground: (x, z) => y, eye: 1.6 });   eye may be a function; with no ground, the ground is the camera's height less the eye
   every frame: guide.point(now, { x, z, tx, tz, final })   the next step on the way (x, z) and the goal (tx, tz), or
                guide.hide(now)                             nothing to show.
   guide.state() says what is shown (for tests). */
import * as THREE from 'three';

const GOLD = 0xf3b43a, EDGE = 0x3b2a0e;

function arrowShape(len, w, head) {   /* pointing along +x, centred on the origin */
  const s = new THREE.Shape(), hl = len * 0.42, sw = w * 0.36, x0 = -len / 2, xh = len / 2 - hl;
  s.moveTo(x0, -sw); s.lineTo(xh, -sw); s.lineTo(xh, -head / 2); s.lineTo(len / 2, 0); s.lineTo(xh, head / 2); s.lineTo(xh, sw); s.lineTo(x0, sw); s.closePath();
  return s;
}
function flat(geo) { geo.rotateX(-Math.PI / 2); return geo; }   /* lying on the ground, +x stays +x, shape y becomes -z */

export function createGuide({ scene, camera, ground = null, eye = 1.6, color = GOLD } = {}) {
  const mat = (c, o, depth) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, depthTest: depth, side: THREE.DoubleSide, fog: false, toneMapped: false });
  const root = new THREE.Group(); root.name = 'GuideArrow'; root.renderOrder = 20; root.visible = false;
  const body = new THREE.Mesh(flat(new THREE.ShapeGeometry(arrowShape(0.62, 0.3, 0.4))), mat(color, 0.92, true));
  const edge = new THREE.Mesh(flat(new THREE.ShapeGeometry(arrowShape(0.7, 0.38, 0.5))), mat(EDGE, 0.45, true));
  edge.position.x = -0.015; edge.position.y = -0.004; body.renderOrder = 22; edge.renderOrder = 21;
  root.add(edge, body); root.userData.noAudit = true;
  const ring = new THREE.Group(); ring.name = 'GuideRing'; ring.visible = false; ring.userData.noAudit = true;
  const band = new THREE.Mesh(flat(new THREE.RingGeometry(0.46, 0.52, 48)), mat(color, 0.85, true));
  const halo = new THREE.Mesh(flat(new THREE.RingGeometry(0.43, 0.55, 48)), mat(EDGE, 0.28, true));
  band.renderOrder = 19; halo.renderOrder = 18; halo.position.y = -0.003; ring.add(halo, band);
  for (const m of [body, edge, band, halo]) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -2; m.raycast = () => {}; m.frustumCulled = false; }
  scene.add(root, ring);
  const _d = new THREE.Vector3(), ray = new THREE.Raycaster(), _o = new THREE.Vector3(), _r = new THREE.Vector3();
  let room = 6, roomAt = -1e9, roomDir = 0;
  const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible || q === root || q === ring) return false; return true; };
  function clear(px, pz, dir, gy, now) {   /* how far the floor is open that way, so the arrow never lies inside a wall or a counter (a few times a second) */
    if (now - roomAt < 200 && Math.abs(Math.atan2(Math.sin(dir - roomDir), Math.cos(dir - roomDir))) < 0.15) return room;
    roomAt = now; roomDir = dir; room = 6;
    for (const h of [0.35, 0.9]) { _o.set(px, gy + h, pz); _r.set(Math.sin(dir), 0, Math.cos(dir)); ray.set(_o, _r); ray.far = 6.5; ray.camera = camera;
      for (const hit of ray.intersectObjects(scene.children, true)) { if (hit.object.isSkinnedMesh || hit.object.isSprite || hit.object.isPoints || hit.object.isLine || !seen(hit.object)) continue; room = Math.min(room, hit.distance); break; } }
    return room;
  }
  let fade = 0, last = null, shown = false, info = { show: false };
  const groundAt = (x, z) => { const y = ground ? ground(x, z) : null; return Number.isFinite(y) ? y : camera.position.y - (typeof eye === 'function' ? eye() : eye); };

  function tick(now) { const dt = last === null ? 0 : Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; fade += ((shown ? 1 : 0) - fade) * Math.min(1, dt * 6); return dt; }
  function setFade(f) { body.material.opacity = 0.78 * f; edge.material.opacity = 0.32 * f; band.material.opacity = 0.7 * f; halo.material.opacity = 0.2 * f; }

  const G = {
    root, ring,
    point(now, { x, z, tx = x, tz = z, final = true }) {
      shown = true; tick(now); const t = now / 1000;
      const px = camera.position.x, pz = camera.position.z, dx = x - px, dz = z - pz, dist = Math.hypot(dx, dz);
      camera.getWorldDirection(_d); const look = Math.atan2(_d.x, _d.z), pitch = Math.asin(Math.max(-1, Math.min(1, _d.y)));
      const want = Math.atan2(dx, dz); let rel = want - look; rel = Math.atan2(Math.sin(rel), Math.cos(rel));
      /* how far ahead: low in the view, about half way down from the middle, whatever the pitch and the field of view */
      const half = THREE.MathUtils.degToRad(camera.fov) / 2, drop = Math.max(0.25, Math.min(1.15, half * 0.5 - pitch)), eyeH = Math.max(0.6, camera.position.y - groundAt(px, pz));
      let D = Math.max(1.6, Math.min(6, eyeH / Math.tan(drop)));
      const wide = Math.atan(Math.tan(half) * camera.aspect) * 0.38, side = Math.max(-wide, Math.min(wide, rel)), at = look + side;   /* in front, leaning toward the way to go, never off the side of a narrow phone screen */
      if (Math.abs(rel) < wide) D = Math.min(D, dist - 1.1);   /* never past the place it points to */
      D = Math.min(D, Math.max(Math.abs(rel) <= wide ? 0 : 1.6, clear(px, pz, at, groundAt(px, pz), now) - 0.55));   /* keep it on open floor in front of any wall or counter (it is hidden behind things like everything else); to turn round it never comes closer than 1.6 m */
      const showArrow = Math.abs(rel) > wide || (D > 1.2 && dist > 4.2);   /* near and in view: the ring is enough; near but out of view: still point the way to turn */
      root.visible = showArrow && fade > 0.02;
      if (showArrow) {
        const ax = px + Math.sin(at) * D, az = pz + Math.cos(at) * D, slide = (t * 0.9) % 1;
        const push = Math.sin(slide * Math.PI) * 0.14;   /* a gentle push toward the way to go */
        root.position.set(ax + Math.sin(want) * push, groundAt(ax, az) + 0.04, az + Math.cos(want) * push);
        root.rotation.set(0, want - Math.PI / 2, 0);   /* the arrow's +x along the way to go */
        const s = 0.9 + 0.2 * Math.min(1, D / 4); root.scale.setScalar(s);
      }
      const tdist = Math.hypot(tx - px, tz - pz);
      ring.visible = fade > 0.02 && tdist < 40;
      if (ring.visible) { const p = 1 + 0.08 * Math.sin(t * 3); ring.position.set(tx, groundAt(tx, tz) + 0.03, tz); ring.scale.setScalar(p); }
      setFade(fade);
      info = { show: true, arrow: showArrow, ring: ring.visible, D: +D.toFixed(2), rel: +rel.toFixed(2), final, x, z, tx, tz };
      return info;
    },
    hide(now = performance.now()) {
      shown = false; tick(now); setFade(fade);
      if (fade < 0.02) { root.visible = false; ring.visible = false; }
      info = { show: false }; return info;
    },
    state: () => info,
    dispose() { scene.remove(root, ring); for (const m of [body, edge, band, halo]) { m.geometry.dispose(); m.material.dispose(); } },
  };
  if (__DEV__) window.__guide = G;   /* dev builds: tests read what the guide shows */
  return G;
}
