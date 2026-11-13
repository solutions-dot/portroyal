// Drive a visible walker from distance actually travelled, not a footstep counter
// or requested velocity (which can remain nonzero against a wall).
export function updateWalk(model, dx, dz, dt) {
  const ac = model.userData.anim, speed = dt > 0 ? Math.hypot(dx, dz) / dt : 0;
  if (!ac) return;
  if (speed <= 0.02) { ac.rest(); return; }
  const wanted = Math.atan2(dx, dz), delta = Math.atan2(Math.sin(wanted - model.rotation.y), Math.cos(wanted - model.rotation.y));
  model.rotation.y += delta * Math.min(1, dt * 12);
  const walk = ac.get('WalkM');
  if (!walk) return;
  if (ac.cur !== walk) ac.play('WalkM');
  walk.timeScale = Math.max(0.1, Math.min(2.3, speed / 1.3));
}
