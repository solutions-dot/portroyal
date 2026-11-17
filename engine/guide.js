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

function softTex(draw) {   /* a soft, glowing mark drawn on a small canvas: no hard edges, no dark outline */
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.strokeStyle = x.shadowColor = 'rgba(255,214,120,1)'; x.lineCap = x.lineJoin = 'round'; x.shadowBlur = 10; draw(x);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function plane(size, map) { const g = new THREE.PlaneGeometry(size, size); g.rotateX(-Math.PI / 2); return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, depthTest: true, fog: false, toneMapped: false })); }

export function createGuide({ scene, camera, ground = null, eye = 1.6 } = {}) {
  /* two thin chevrons (pointing along +x) and a thin ring, soft gold, half see-through */
  const chev = softTex((x) => { x.lineWidth = 9; for (const o of [-22, 18]) { x.globalAlpha = o < 0 ? 0.55 : 1; x.beginPath(); x.moveTo(44 + o, 30); x.lineTo(78 + o, 64); x.lineTo(44 + o, 98); x.stroke(); } });
  const loop = softTex((x) => { x.lineWidth = 7; x.shadowBlur = 14; x.beginPath(); x.arc(64, 64, 50, 0, Math.PI * 2); x.stroke(); x.stroke(); });   /* a little brighter and fuller than at first (owner, 17 November 2026: the ring had become too dull) */
  const root = new THREE.Group(); root.name = 'GuideArrow'; root.visible = false;
  const body = plane(0.62, chev); body.renderOrder = 22; root.add(body); root.userData.noAudit = true;
  const ring = new THREE.Group(); ring.name = 'GuideRing'; ring.visible = false; ring.userData.noAudit = true;
  const band = plane(1.15, loop); band.renderOrder = 19; ring.add(band);
  for (const m of [body, band]) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -2; m.raycast = () => {}; m.frustumCulled = false; }
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

  let want = 1, lx = null, lz = null, speed = 0;
  function tick(now) { const dt = last === null ? 0 : Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; fade += ((shown ? want : 0) - fade) * Math.min(1, dt * 3); return dt; }
  /* soft and quiet: at most half see-through, a slow gentle glow, and it fades right down while you walk the right way */
  function setFade(f, t) { const glow = 0.85 + 0.15 * Math.sin(t * 2.2); body.material.opacity = 0.55 * f * glow; band.material.opacity = Math.min(1, 0.72 * f * glow); }

  const G = {
    root, ring,
    point(now, { x, z, tx = x, tz = z, final = true }) {
      shown = true; const dt0 = tick(now); const t = now / 1000;
      const px = camera.position.x, pz = camera.position.z, dx = x - px, dz = z - pz, dist = Math.hypot(dx, dz);
      camera.getWorldDirection(_d); const look = Math.atan2(_d.x, _d.z), pitch = Math.asin(Math.max(-1, Math.min(1, _d.y)));
      const way = Math.atan2(dx, dz); let rel = way - look; rel = Math.atan2(Math.sin(rel), Math.cos(rel));
      const step = lx === null ? 0 : Math.hypot(px - lx, pz - lz); lx = px; lz = pz; speed += (step / Math.max(1e-3, dt0) - speed) * 0.2;
      want = speed > 0.6 && Math.abs(rel) < 0.6 ? 0.25 : 1;   /* walking the right way: only a faint hint */
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
        root.position.set(ax + Math.sin(way) * push, groundAt(ax, az) + 0.04, az + Math.cos(way) * push);
        root.rotation.set(0, way - Math.PI / 2, 0);   /* the arrow's +x along the way to go */
        const s = 0.9 + 0.2 * Math.min(1, D / 4); root.scale.setScalar(s);
      }
      const tdist = Math.hypot(tx - px, tz - pz);
      ring.visible = fade > 0.02 && tdist < 40;
      if (ring.visible) { const p = 1 + 0.04 * Math.sin(t * 2); ring.position.set(tx, groundAt(tx, tz) + 0.03, tz); ring.scale.setScalar(p); }
      setFade(fade, t);
      info = { show: true, arrow: showArrow, ring: ring.visible, D: +D.toFixed(2), rel: +rel.toFixed(2), final, x, z, tx, tz };
      return info;
    },
    hide(now = performance.now()) {
      shown = false; tick(now); setFade(fade, now / 1000);
      if (fade < 0.02) { root.visible = false; ring.visible = false; }
      info = { show: false }; return info;
    },
    state: () => info,
    dispose() { scene.remove(root, ring); for (const m of [body, band]) { m.geometry.dispose(); m.material.map.dispose(); m.material.dispose(); } },
  };
  if (__DEV__) window.__guide = G;   /* dev builds: tests read what the guide shows */
  return G;
}
