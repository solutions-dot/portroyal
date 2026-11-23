/* engine/sunshadow.js: real sun shadows, for any game (23 November 2026, the graphics pass: "wow, without losing performance").
   Buildings, trees, carts and people throw shadows on the ground and on each other, which gives a place its depth. Desktop only: a phone keeps
   the blob shadows under people it already has, and pays nothing.
     const SH = sunShadow(renderer, sun, { phone, size: 46 });   // sun: the game's THREE.DirectionalLight
     SH.prepare(group)        // once per place, after it is built: every mesh casts and receives, except glows, water, skies and people's faces
     SH.follow(camera)        // each frame: the shadow box follows the camera (snapped to whole texels, so the edges do not crawl)
     SH.enable(on)            // off for a place that should have none (an interior lit only by lamps)
     SH.tick(scene, camera)   // or all of it at once, each frame, for a game that sets its own lights (below)
   People cast shadows but never receive them, so no face goes dark (owner rule 9). The shadow is soft-edged (PCFSoft) and 2048 texels across
   a box `size` metres wide round the camera. */
import * as THREE from 'three';

export function sunShadow(renderer, sun, { phone = false, size = 46, map = 2048, far = 160, bias = -0.0006, normalBias = 0.03 } = {}) {
  const on = !phone;
  const S = { on, prepare() {}, follow() {}, enable() {}, relight() {}, tick() {} };   /* a phone gets the same calls doing nothing: without relight() every game that calls it failed to load on phones (23 November 2026) */
  if (!on) return S;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  sun.castShadow = true;
  const cam = sun.shadow.camera;
  cam.left = -size / 2; cam.right = size / 2; cam.top = size / 2; cam.bottom = -size / 2; cam.near = 1; cam.far = far;
  sun.shadow.mapSize.set(map, map);
  sun.shadow.bias = bias;
  sun.shadow.normalBias = normalBias;
  sun.shadow.radius = 3;
  if (!sun.target.parent) sun.parent ? sun.parent.add(sun.target) : null;
  const dir = new THREE.Vector3(), c = new THREE.Vector3(), _v = new THREE.Vector3(), texel = size / map;
  let offset = sun.position.clone();   /* the sun's direction, from the origin, as the game set it */
  S.prepare = (group) => {
    group.traverse((o) => {
      if (!o.isMesh && !o.isInstancedMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      const glow = !m || m.isMeshBasicMaterial || m.isSpriteMaterial || m.transparent || m.blending === THREE.AdditiveBlending || o.userData.water || o.userData.noShadow;
      if (o.isSkinnedMesh) { o.castShadow = true; o.receiveShadow = false; return; }   /* a person: throws a shadow, keeps a clear face */
      o.castShadow = !glow && o.name !== 'terrain';
      o.receiveShadow = !glow;
    });
  };
  S.follow = (camera) => {
    if (!sun.castShadow) return;
    dir.copy(offset).normalize();
    c.copy(camera.position);
    const ahead = camera.getWorldDirection(_v).setY(0).normalize().multiplyScalar(size * 0.25);   /* the box sits a little ahead of the camera, where the player looks */
    c.add(ahead).setY(0);
    c.x = Math.round(c.x / texel) * texel; c.z = Math.round(c.z / texel) * texel;
    sun.target.position.copy(c);
    sun.position.copy(c).addScaledVector(dir, far * 0.5);
    sun.target.updateMatrixWorld();
  };
  S.relight = () => { offset = sun.position.clone(); };   /* call right after the game sets its sun's position for a new hour (a position from the origin) */
  /* the automatic way, for a game that lights its places its own way (Garvey, Port Royal, Selassie, Windrush; 23 November 2026): call
     SH.tick(scene, camera) once a frame before drawing. Every half second, if the scene holds a different number of meshes (a place built, people
     come in), they are prepared; when the game has moved its sun since the last frame (a new hour), that becomes the sun's direction; a sun turned
     down for the night or a dim room (intensity under `dim`) throws no shadows, and SH.enable(false) keeps them off where the game says so
     (indoors); then the shadow box follows the camera. */
  let lastSet = null, count = -1, frames = 0, allowed = true;
  const _sky = new THREE.Sphere();
  S.enable = (v) => { allowed = !!v; sun.castShadow = allowed; };
  S.tick = (scene, camera, { dim = 0.6 } = {}) => {
    if (frames++ % 30 === 0) {
      let n = 0; scene.traverse((o) => { if (o.isMesh) n++; });
      if (n !== count) {
        count = n; S.prepare(scene);
        scene.traverse((o) => {   /* a sky dome, a sea or a far backdrop never throws a shadow over the place (it would darken all of it) */
          if (!o.isMesh || !o.castShadow || o.isSkinnedMesh) return;
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          if (m && (m.isShaderMaterial || m.side === THREE.BackSide)) { o.castShadow = false; return; }
          if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
          _sky.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
          if (_sky.radius > 120) o.castShadow = false;
        });
      }
    }
    if (!lastSet || !sun.position.equals(lastSet)) S.relight();
    sun.castShadow = allowed && sun.visible && sun.intensity >= dim;
    S.follow(camera);
    lastSet = sun.position.clone();
  };
  return S;
}
