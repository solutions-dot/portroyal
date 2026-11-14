/* engine/skinprobe.js: measure how dark a face really looks in a game (dev only; see docs/PIPELINE.md, "Skin").
   skinProbe(renderer, scene, body) turns the person to four headings and for each puts a camera 70 cm in front of the face, renders the game's own scene and lights, finds the forehead and both cheeks
   by casting rays at the head (only hits on the Skin material count), and reads back the drawn pixels there. It returns { rgb, lo, hi, each }: colours 0 to 255 as drawn on screen (the mean, the darkest and lightest heading).
   The body must already be in the scene and posed. The camera and the drawing size are put back afterwards. */
import * as THREE from 'three';

function probeOnce(renderer, scene, body, dist, size) {
  body.updateMatrixWorld(true);
  const head = body.getObjectByName('mixamorigHead'); if (!head) return { rgb: [0, 0, 0], n: 0 };
  const sc = body.getWorldScale(new THREE.Vector3()).x || 1, H = head.getWorldPosition(new THREE.Vector3());
  const F = new THREE.Vector3(0, 0, 1).applyQuaternion(body.getWorldQuaternion(new THREE.Quaternion())).setY(0).normalize(), U = new THREE.Vector3(0, 1, 0), R = new THREE.Vector3().crossVectors(U, F).normalize();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 50); cam.position.copy(H).addScaledVector(F, dist * sc).addScaledVector(U, 0.06 * sc); cam.lookAt(H.clone().addScaledVector(U, 0.06 * sc)); cam.updateMatrixWorld(true);
  const old = renderer.getSize(new THREE.Vector2()), oldPR = renderer.getPixelRatio(); renderer.setPixelRatio(1); renderer.setSize(size, size, false);
  renderer.render(scene, cam);
  const gl = renderer.getContext(), ray = new THREE.Raycaster(), meshes = []; body.traverse((o) => { if (o.isMesh && o.visible) meshes.push(o); });
  const spots = [[0, 0.115], [0.038, 0.035], [-0.038, 0.035], [0, 0.09]], px = new Uint8Array(4), acc = [0, 0, 0]; let n = 0;
  for (const [dx, dy] of spots) {   /* forehead, the two cheeks, the brow */
    const target = H.clone().addScaledVector(R, dx * sc).addScaledVector(U, dy * sc), dir = target.clone().sub(cam.position).normalize(); ray.set(cam.position, dir);
    const hit = ray.intersectObjects(meshes, false)[0]; if (!hit || !/^Skin$/.test(hit.object.material.name || '')) continue;
    const p = hit.point.clone().project(cam), x = Math.round((p.x * 0.5 + 0.5) * size), y = Math.round((p.y * 0.5 + 0.5) * size);
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { gl.readPixels(x + ox, y + oy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); acc[0] += px[0]; acc[1] += px[1]; acc[2] += px[2]; n++; }
  }
  renderer.setPixelRatio(oldPR); renderer.setSize(old.x, old.y, false);
  return { rgb: n ? acc.map((v) => Math.round(v / n)) : [0, 0, 0], n };
}

/* the same, with the person turned to four headings (the sun is fixed, so a face can be lit, side-lit or in shade): returns { rgb: the mean, lo, hi: the darkest and lightest heading, each } */
export function skinProbe(renderer, scene, body, { dist = 0.7, size = 256, yaws = [0, Math.PI / 2, Math.PI, -Math.PI / 2] } = {}) {
  const ry = body.rotation.y, all = [];
  for (const y of yaws) { body.rotation.y = y; const r = probeOnce(renderer, scene, body, dist, size); if (r.n) all.push(r.rgb); }
  body.rotation.y = ry; if (!all.length) return { rgb: [0, 0, 0], lo: [0, 0, 0], hi: [0, 0, 0], each: [] };
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], srt = all.slice().sort((a, b) => lum(a) - lum(b));
  return { rgb: [0, 1, 2].map((k) => Math.round(all.reduce((a, c) => a + c[k], 0) / all.length)), lo: srt[0], hi: srt[srt.length - 1], each: all };
}
