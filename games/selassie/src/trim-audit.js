/* Regalia hangs outside the tunic. The generic cloth check infers layers from
   a whole merged material and can mistake a medal's back for an under layer.
   Check its actual posed depth against the front of the coat before excluding
   that reversed layer relation. Body, shirt and jacket checks still run. */
import * as THREE from "three";
export function exteriorTrim(body, poses) {
  const lines = [],
    ctl = body.userData.anim,
    targets = [],
    trim = [];
  body.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    if (o.name === "Regalia") trim.push(o);
    else if (o.material.name === "Jacket") targets.push(o);
  });
  const ray = new THREE.Raycaster(),
    point = new THREE.Vector3(),
    origin = new THREE.Vector3(),
    back = new THREE.Vector3(0, 0, -1);
  let checked = 0;
  for (const [clip, at] of poses) {
    const action = ctl.get(clip);
    if (!action) continue;
    ctl.mx.stopAllAction();
    action.reset().play();
    action.time = action.getClip().duration * at;
    ctl.mx.update(0);
    body.updateMatrixWorld(true);
    let bad = 0,
      worst = 0;
    for (const mesh of trim) {
      mesh.skeleton.update();
      const n = mesh.geometry.attributes.position.count;
      for (let i = 0; i < n; i += 10) {
        mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
        origin.copy(point).addScaledVector(back, -0.3);
        ray.set(origin, back);
        ray.far = 0.8;
        const hit = ray.intersectObjects(targets, false)[0];
        if (!hit) continue;
        checked++;
        const depth = hit.point.z - point.z;
        if (depth > 0.004) {
          bad++;
          worst = Math.max(worst, depth);
        }
      }
    }
    if (bad)
      lines.push(
        `exterior trim ${clip}: ${bad} points inside the coat, worst ${(worst * 1000).toFixed(1)} mm`,
      );
  }
  ctl.mx.stopAllAction();
  ctl.base.reset().play();
  ctl.cur = ctl.base;
  ctl.mx.update(0);
  return { lines, checked };
}
export const outsideTrimRelation = (a, b) =>
  a === "Regalia" && /^(Jacket|Breast_pocket)/.test(b);
