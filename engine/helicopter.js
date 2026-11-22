/* engine/helicopter.js: one helicopter for every game (owner's rule 10). It began in Hurricane Melissa (a relief flight) and is shared with Tivoli
   (the May 2010 operation, where the Security Minister said the troops were "backed by helicopters"). A general shape of a twin-engine utility
   helicopter, olive with a pale band, about 15 m long with a 14 m rotor: it is not modelled on one aircraft, so each game that uses it lists it as
   a stand-in in its doc. It carries no weapons.
     const H = makeHelicopter();  scene.add(H);  H.visible = true;
     spinRotors(H, dt);           // each frame: the main rotor and the tail rotor turn
     flyAlong(H, A, B, k);        // put it k (0 to 1) of the way from A to B, nose toward B, a little nose-down
     const snd = rotorSound();    // a low rotor thump on soft noise (engine/audio.js); snd.level(0 to 1, seconds); snd.stop()
   The nose points toward -x in the model. */
import * as THREE from 'three';
import { AU, noiseSrc } from './audio.js';

const PI = Math.PI;
export function makeHelicopter({ body: bodyCol = 0x4d5638, band = 0xc9c2a2 } = {}) {
  const g = new THREE.Group(), body = new THREE.MeshStandardMaterial({ color: bodyCol, roughness: 0.6 }), dark = new THREE.MeshStandardMaterial({ color: 0x1c2024, roughness: 0.3, metalness: 0.4 }), pale = new THREE.MeshStandardMaterial({ color: band, roughness: 0.7 });
  const M = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };
  M(new THREE.SphereGeometry(1, 16, 10), body, 0, 0, 0).scale.set(3.0, 1.15, 1.2); M(new THREE.SphereGeometry(1, 12, 8), dark, -2.2, 0.25, 0).scale.set(1.0, 0.7, 1.0);   /* the cabin and its windscreen (nose toward -x) */
  M(new THREE.BoxGeometry(2.4, 0.18, 2.42), pale, 0.4, -0.1, 0);
  const boom = M(new THREE.CylinderGeometry(0.22, 0.42, 6.2, 8), body, 5.6, 0.35, 0); boom.rotation.z = PI / 2;
  M(new THREE.BoxGeometry(0.9, 1.6, 0.12), body, 8.5, 1.0, 0).rotation.z = -0.35; M(new THREE.BoxGeometry(1.6, 0.08, 0.5), body, 8.0, 0.4, 0);
  M(new THREE.BoxGeometry(1.4, 0.5, 1.0), body, 0.4, 1.25, 0); M(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), dark, 0.4, 1.7, 0);
  for (const s of [-1, 1]) { M(new THREE.BoxGeometry(3.6, 0.08, 0.08), dark, 0, -1.45, s * 1.0); for (const x of [-0.9, 0.9]) M(new THREE.BoxGeometry(0.06, 0.4, 0.06), dark, x, -1.25, s * 1.0); }   /* skids */
  const rotor = new THREE.Group(); rotor.position.set(0.4, 2.0, 0); g.add(rotor);
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(6.9, 0.05, 0.42), dark); b.position.x = 3.45; const a = new THREE.Group(); a.rotation.y = i * PI / 2; a.add(b); rotor.add(a); }
  const tail = new THREE.Group(); tail.position.set(8.6, 1.2, 0.2); g.add(tail);
  for (let i = 0; i < 2; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.05), dark); b.rotation.x = i * PI / 2; tail.add(b); }
  g.userData = { rotor, tail, helicopter: true };
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noBatch = true; } });
  g.name = 'helicopter'; g.visible = false; return g;
}
/* the rotors turn at a steady rate, whatever the frame rate */
export function spinRotors(H, dt) { H.userData.rotor.rotation.y += 54 * dt; H.userData.tail.rotation.z += 78 * dt; }
const _v = new THREE.Vector3();
/* k of the way from A to B (THREE.Vector3s), nose toward B and a little nose-down, with a slight bank */
export function flyAlong(H, A, B, k, bank = 0.08) {
  H.position.lerpVectors(A, B, Math.max(0, Math.min(1, k)));
  _v.copy(B); H.lookAt(_v); H.rotateY(PI / 2); H.rotateZ(0.12); H.rotateX(bank);
}
/* a low rotor thump (about 10.5 beats a second) on soft brown noise. Returns { level(v, tc), stop() }; silent until level() is called. */
export function rotorSound() {
  const c = AU.ctx; if (!c) return { level() {}, stop() {} };
  const lp = c.createBiquadFilter(), am = c.createGain(), lv = c.createGain(), o = c.createOscillator(), og = c.createGain(), src = noiseSrc('brown');
  lp.type = 'lowpass'; lp.frequency.value = 420; am.gain.value = 0.5; lv.gain.value = 0; o.frequency.value = 10.5; og.gain.value = 0.5;
  o.connect(og); og.connect(am.gain); o.start(); src.connect(lp); lp.connect(am); am.connect(lv); lv.connect(AU.master);
  return {
    level(v, tc = 0.3) { lv.gain.setTargetAtTime(Math.max(0, v) * 0.45, c.currentTime, tc); },
    stop() { lv.gain.setTargetAtTime(0, c.currentTime, 0.4); setTimeout(() => { try { o.stop(); src.disconnect(); lv.disconnect(); } catch (e) { /* already stopped */ } }, 1500); },
  };
}
