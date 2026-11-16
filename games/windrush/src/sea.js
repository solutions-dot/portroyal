/* Moving water, the way Port Royal's sea moves (copied into this game, not imported): a tiling normal map drawn from summed sine waves and
   scrolled every frame, a 300 m plane near the action whose vertices rise and fall, a large flat plane beyond with the same material, foam that
   laps at a quay edge, and a wake and bow wave behind a moving ship. Colours suit each water: the Caribbean at Kingston, the grey-green Thames at
   Tilbury, the open Atlantic on the crossing. Reduced motion keeps the water still. */
import * as THREE from "three";
import { cv } from "./gfx.js";

let seaN = null;
function normals() {
  if (seaN) return seaN;
  seaN = cv(
    128,
    128,
    (x) => {
      const d = x.createImageData(128, 128),
        h = new Float32Array(128 * 128);
      for (let i = 0; i < h.length; i++) {
        const u = i % 128,
          v = (i / 128) | 0;
        h[i] =
          Math.sin(u * 0.196 + Math.sin(v * 0.147) * 2) +
          Math.sin(v * 0.245 + Math.sin(u * 0.098) * 1.5) * 0.7 +
          Math.sin((u + v) * 0.393) * 0.3;
      }
      for (let v = 0; v < 128; v++)
        for (let u = 0; u < 128; u++) {
          const i = v * 128 + u,
            dx = h[v * 128 + ((u + 1) % 128)] - h[i],
            dy = h[((v + 1) % 128) * 128 + u] - h[i];
          d.data[i * 4] = 128 + dx * 150;
          d.data[i * 4 + 1] = 128 + dy * 150;
          d.data[i * 4 + 2] = 255;
          d.data[i * 4 + 3] = 255;
        }
      x.putImageData(d, 0, 0);
    },
    [160, 160],
    false,
  );
  seaN.colorSpace = THREE.NoColorSpace;
  return seaN;
}
export const WATERS = {
  caribbean: { color: 0x2b8ea0, deep: 0x1f6f86 },
  thames: { color: 0x5d7a6e, deep: 0x4a655b },
  atlantic: { color: 0x2f6680, deep: 0x214f66 },
};
let foamTex = null;
function foam() {
  if (foamTex) return foamTex;
  foamTex = cv(256, 64, (x) => {
    x.clearRect(0, 0, 256, 64);
    for (let u = 0; u < 256; u += 2) {
      const w = 10 + Math.sin(u * 0.11) * 6 + Math.sin(u * 0.37) * 4 + Math.random() * 5,
        g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, "rgba(255,255,255,0.85)");
      g.addColorStop(Math.min(0.95, w / 40), "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(u, 0, 2, 64);
    }
  });
  return foamTex;
}
/* parent: the place group. kind: a key of WATERS. y: the still water level. at: [x, z] the middle of the moving patch.
   edges: quay edges [[x0, z0, x1, z1], ...] where foam laps (the water side is the side the line's left normal points to). */
export function createSea(parent, { kind = "caribbean", y = -2.1, at = [0, -40], size = 300, phone = false, reduced = false, edges = [] } = {}) {
  const W = WATERS[kind],
    mat = new THREE.MeshStandardMaterial({ color: W.color, roughness: 0.22, metalness: 0.15, normalMap: normals(), normalScale: new THREE.Vector2(0.55, 0.55) });
  const far = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: W.deep, roughness: 0.3, metalness: 0.1, normalMap: normals(), normalScale: new THREE.Vector2(0.4, 0.4) }));
  far.rotation.x = -Math.PI / 2;
  far.position.set(at[0], y - 0.45, at[1]);
  far.userData.noBatch = true;
  far.userData.water = true;
  parent.add(far);
  const seg = phone ? 40 : 60,
    wg = new THREE.PlaneGeometry(size, size, seg, seg);
  wg.rotateX(-Math.PI / 2);
  const near = new THREE.Mesh(wg, mat);
  near.position.set(at[0], y, at[1]);
  near.userData.noBatch = true;
  near.userData.water = true;
  near.userData.base = wg.attributes.position.array.slice();
  parent.add(near);
  const foams = [];
  for (const [x0, z0, x1, z1] of edges) {
    const len = Math.hypot(x1 - x0, z1 - z0),
      t = foam().clone();
    t.needsUpdate = true;
    t.repeat.set(len / 6, 1);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.4), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.55 }));
    f.rotation.order = "YXZ";
    f.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    f.rotation.x = -Math.PI / 2;
    const nx = (z1 - z0) / len,
      nz = -(x1 - x0) / len;
    f.position.set((x0 + x1) / 2 + nx * 0.7, y + 0.06, (z0 + z1) / 2 + nz * 0.7);
    f.userData.noBatch = true;
    f.userData.water = true;
    parent.add(f);
    foams.push(f);
  }
  let frame = 0;
  const S = {
    level: y,
    near,
    far,
    material: mat,
    /* the water height at a world point (for things that float) */
    height(x, z, t) {
      return y + Math.sin(x * 0.42 + t * 1.3) * 0.07 + Math.sin(z * 0.31 + t * 0.9) * 0.06;
    },
    tick(t) {
      if (reduced) return;
      const n = normals();
      n.offset.x = t * 0.02;
      n.offset.y = t * 0.013;
      const p = wg.attributes.position,
        b = near.userData.base;
      if (!phone || (frame & 1) === 0) {
        for (let i = 0; i < p.count; i++) {
          const x = b[i * 3] + near.position.x,
            z = b[i * 3 + 2] + near.position.z;
          p.setY(i, Math.sin(x * 0.42 + t * 1.3) * 0.07 + Math.sin(z * 0.31 + t * 0.9) * 0.06 + Math.sin((x + z) * 0.9 + t * 2.1) * 0.025);
        }
        p.needsUpdate = true;
      }
      if ((frame++ & (phone ? 7 : 3)) === 0) wg.computeVertexNormals();
      for (const [i, f] of foams.entries()) {
        f.material.map.offset.x = Math.sin(t * 0.3 + i) * 0.05;
        f.material.opacity = 0.42 + Math.sin(t * 1.1 + i * 1.7) * 0.16;
        f.position.y = y + 0.05 + Math.sin(t * 1.3 + i) * 0.05;
      }
    },
  };
  return S;
}
/* a ship rides the water: bob and roll gently around its still pose */
export function rideShip(ship, level, t, k = 1) {
  ship.position.y = level + Math.sin(t * 0.8) * 0.05 * k;
  ship.rotation.x = Math.sin(t * 0.6) * 0.012 * k;
  ship.rotation.z = Math.sin(t * 0.45) * 0.004 * k;
}
/* a wake: a long foam trail behind the stern and a bow wave at each side of the bow. Add it to the ship (in its own frame: bow at +x,
   waterline at y = 0); `strength` 0 hides it, 1 is full speed. */
export function makeWake(L = 152, B = 20) {
  const g = new THREE.Group(),
    t = foam();
  const trail = new THREE.Mesh(new THREE.PlaneGeometry(160, B * 1.6, 1, 1), new THREE.MeshBasicMaterial({ map: wakeTex(), transparent: true, depthWrite: false, opacity: 0.8 }));
  trail.rotation.x = -Math.PI / 2;
  trail.position.set(-L / 2 - 78, 0.08, 0);
  g.add(trail);
  for (const s of [-1, 1]) {
    const bt = t.clone();
    bt.needsUpdate = true;
    bt.repeat.set(3, 1);
    const w = new THREE.Mesh(new THREE.PlaneGeometry(26, 3.2), new THREE.MeshBasicMaterial({ map: bt, transparent: true, depthWrite: false, opacity: 0.85 }));
    w.rotation.order = "YXZ";
    w.rotation.y = s * 0.38;
    w.rotation.x = -Math.PI / 2;
    w.position.set(L / 2 - 14, 0.1, s * (B / 2 + 1.2));
    g.add(w);
  }
  g.traverse((o) => {
    o.userData.noBatch = true;
    o.userData.water = true;
  });
  g.userData.tick = (time, strength) => {
    g.visible = strength > 0.02;
    g.children.forEach((c, i) => {
      c.material.opacity = (i ? 0.85 : 0.75) * Math.min(1, strength);
      if (c.material.map) c.material.map.offset.x = i ? -time * 0.25 * strength : time * 0.04 * strength;
    });
  };
  return g;
}
let _wake;
function wakeTex() {
  if (_wake) return _wake;
  _wake = cv(256, 128, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < 1400; i++) {
      const u = Math.random() * W,
        spread = 0.18 + (1 - u / W) * 0.32,
        v = H / 2 + (Math.random() - 0.5) * H * spread * 2,
        a = (u / W) * 0.55 * (1 - Math.abs(v - H / 2) / (H * spread + 1));
      x.fillStyle = `rgba(255,255,255,${Math.max(0, a).toFixed(3)})`;
      x.fillRect(u, v, 3 + Math.random() * 5, 1.5);
    }
  });
  return _wake;
}
/* gulls: a few birds wheeling over a point, wings flapping now and then */
export function gulls(parent, n = 6, at = [0, 0], h = 14, r = 18, seed = 1) {
  const birds = [],
    m = new THREE.MeshBasicMaterial({ color: 0xf2f0ea, side: THREE.DoubleSide }),
    geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.55, 0.05, 0, 0, 0, 0.12, 0, 0, -0.12, 0.55, 0.05, 0, 0, 0, 0.12, 0, 0, -0.12], 3));
  geo.computeVertexNormals();
  for (let i = 0; i < n; i++) {
    const b = new THREE.Mesh(geo.clone(), m);
    b.userData.noBatch = true;
    b.userData.phase = seed * 1.7 + i * 2.3;
    b.userData.r = r * (0.6 + ((i * 37) % 10) / 20);
    b.userData.h = h + ((i * 53) % 7);
    parent.add(b);
    birds.push(b);
  }
  return (t) => {
    for (const b of birds) {
      const u = b.userData,
        a = t * 0.18 + u.phase;
      b.position.set(at[0] + Math.cos(a) * u.r, u.h + Math.sin(t * 0.5 + u.phase) * 1.2, at[1] + Math.sin(a) * u.r * 0.7);
      b.rotation.y = -a;
      const flap = Math.sin(t * 9 + u.phase) * (Math.sin(t * 0.7 + u.phase) > 0.3 ? 0.35 : 0.05),
        p = b.geometry.attributes.position;
      p.setY(0, flap);
      p.setY(3, flap);
      p.needsUpdate = true;
    }
  };
}
