/* engine/collapse.js: a building that falls down, for every game (first made for the Myers Ward fire in Eventide; Port Royal's 1692 houses
   still use their own sink and brick code in games/port-royal/src/main.js, which can move here when that game is next touched).

     import { collapse } from '../../../engine/collapse.js';
     const fall = collapse(ward.group, { floorAt: (x, z) => 0.6, onImpact: (k) => { shake = k; } });
     fall.start();                  // then call fall.tick(dt) every frame; it returns true once everything has come to rest
     fall.reset();                  // puts the building back as it was (for replaying a chapter)

   How it falls, so it reads like a real collapse and not one shape squashing flat:
   1. The building trembles for a moment.
   2. The roof (opts.roof, or the highest piece) caves in first: it drops into the building and crumples.
   3. Long walls and floors are cut into panels about opts.seg metres wide (boxes only, with their texture kept in place), and each panel
      tips over on its bottom edge, mostly inward, one after another from the middle out (opts.from: 'centre', '+x' or '-x').
      Windows, doors and rails fixed to a panel go with it.
   4. Timbers and sheets tumble off as each piece lets go, bounce and settle, and smoke or dust rises where they land.
   5. If opts.char is true (the default), the wood darkens to char as it falls, with a faint glow of embers.
   Everything lower than opts.keepBelow (1.6 m) above the floor stays where it is: foundations, steps, low beds of plants.
   All of it is worked out in the building group's own space, so the group may be placed and turned anywhere.
   Nothing here shows a person: it is only the building (owner rule 4). */
import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

/* a radial puff for smoke and dust, drawn once */
let PUFF = null;
function puffTex() {
  if (PUFF) return PUFF; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
  g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  PUFF = new THREE.CanvasTexture(c); PUFF.colorSpace = THREE.SRGBColorSpace; return PUFF;
}
function rand(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* cut a box mesh into nx x ny x nz smaller boxes that sit exactly where the big one was, each showing its own part of the texture */
function splitBox(m, nx, ny, nz) {
  const p = m.geometry.parameters, out = [], W = p.width, H = p.height, D = p.depth;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) {
    const g = new THREE.BoxGeometry(W / nx, H / ny, D / nz), uv = g.attributes.uv;
    /* BoxGeometry faces, 4 corners each: +x, -x, +y, -y, +z, -z. u and v run along these axes on each face (sign: does u grow with the axis) */
    const faces = [['z', -1, 'y'], ['z', 1, 'y'], ['x', 1, 'z', -1], ['x', 1, 'z', 1], ['x', 1, 'y'], ['x', -1, 'y']];
    const part = { x: [i, nx], y: [j, ny], z: [k, nz] };
    faces.forEach(([ua, us, va, vs = 1], f) => { for (let c = 0; c < 4; c++) { const n = f * 4 + c; let u = uv.getX(n), v = uv.getY(n);
      const [pu, nu] = part[ua], [pv, nv] = part[va]; u = ((us > 0 ? pu : nu - 1 - pu) + u) / nu; v = ((vs > 0 ? pv : nv - 1 - pv) + v) / nv; uv.setXY(n, u, v); } });
    const s = new THREE.Mesh(g, m.material); s.castShadow = m.castShadow; s.receiveShadow = m.receiveShadow;
    s.position.set(-W / 2 + W / nx * (i + 0.5), -H / 2 + H / ny * (j + 0.5), -D / 2 + D / nz * (k + 0.5)).applyQuaternion(m.quaternion).add(m.position);
    s.quaternion.copy(m.quaternion); s.scale.copy(m.scale); s.userData.split = true; out.push(s);
  }
  return out;
}

export function collapse(group, opts = {}) {
  const o = { floorAt: () => 0, seg: 4.2, keepBelow: 1.6, from: 'centre', spread: 3.2, roofTime: 1.0, char: true, seed: 7, debris: 260, smoke: 0x4c4642, timber: 0x2e2620, sheet: 0x6a6660, onImpact: null, roof: null, ...opts };
  const r = rand(o.seed), saved = [], made = [], mats = new Map(), pieces = [], deb = [];
  let T = -1, running = false, inv = new THREE.Matrix4(), built = false, fx = null, glow = 0;

  /* the box of an object in the group's own space */
  const localBox = (obj) => { const b = new THREE.Box3().setFromObject(obj); return b.isEmpty() ? null : b.applyMatrix4(inv); };

  function build() {
    group.updateMatrixWorld(true); inv.copy(group.matrixWorld).invert();
    for (const c of group.children) saved.push({ obj: c, pos: c.position.clone(), q: c.quaternion.clone(), s: c.scale.clone(), vis: c.visible });
    const all = localBox(group); if (!all) return; const floor0 = all.min.y;
    const roofs = new Set(o.roof || []);
    if (!roofs.size) { let best = null; for (const c of group.children) { const b = localBox(c); if (b && (!best || b.max.y > best.b.max.y)) best = { c, b }; } if (best) roofs.add(best.c); }
    /* 1. cut long boxes into panels */
    const parts = [];
    for (const c of group.children.slice()) {
      if (!c.visible) continue; const b = localBox(c); if (!b || b.max.y - floor0 < o.keepBelow) continue;
      if (c.isMesh && c.geometry && c.geometry.type === 'BoxGeometry' && !roofs.has(c)) {
        const p = c.geometry.parameters, n = (v) => Math.max(1, Math.round(v / o.seg)), nx = n(p.width), ny = p.height > 4.5 ? 2 : 1, nz = n(p.depth);
        if (nx * ny * nz > 1) { const bits = splitBox(c, nx, ny, nz); c.visible = false; for (const s of bits) { group.add(s); made.push(s); parts.push(s); } continue; }
      }
      parts.push(c);
    }
    /* 2. small things fixed to a bigger panel (windows, doors, rails) ride on it */
    const info = parts.map((c) => { const b = localBox(c), sz = b.getSize(new THREE.Vector3()); return { c, b, vol: sz.x * sz.y * sz.z, sz }; });
    const big = info.filter((i) => !roofs.has(i.c) && Math.max(i.sz.x, i.sz.z) > 1.2 && i.sz.y > 1.2);
    for (const i of info) {
      if (roofs.has(i.c) || big.includes(i)) continue; const ctr = i.b.getCenter(new THREE.Vector3());
      const host = big.find((h) => h.b.clone().expandByScalar(0.12).containsPoint(ctr));
      if (host) { host.c.attach(i.c); i.host = host; }
    }
    /* 3. when and how each piece falls */
    const cx = (all.min.x + all.max.x) / 2, cz = (all.min.z + all.max.z) / 2, alongX = all.max.x - all.min.x >= all.max.z - all.min.z;
    const half = (alongX ? all.max.x - all.min.x : all.max.z - all.min.z) / 2, top = all.max.y;
    for (const i of info) {
      if (i.host) continue; const c = i.c, ctr = i.b.getCenter(new THREE.Vector3()), roof = roofs.has(c);
      const a = alongX ? ctr.x - cx : ctr.z - cz, wave = o.from === 'centre' ? Math.abs(a) / half : o.from === '+x' ? (half - a) / (2 * half) : (a + half) / (2 * half);
      const floor = o.floorAt(ctr.x, ctr.z);
      let dir = new THREE.Vector3(cx - ctr.x, 0, cz - ctr.z); if (alongX) dir.x *= 0.15; else dir.z *= 0.15;   /* lean across the building, toward its middle */
      if (dir.lengthSq() < 1e-4) dir.set(r() - 0.5, 0, r() - 0.5); dir.normalize(); if (r() < 0.22) dir.negate();
      dir.applyAxisAngle(UP, (r() - 0.5) * 0.7);
      const e = Math.min(0.5, Math.abs(dir.x) * i.sz.x / 2 + Math.abs(dir.z) * i.sz.z / 2), pivot = new THREE.Vector3(ctr.x, i.b.min.y, ctr.z).addScaledVector(dir, e);
      const drop = Math.max(0, i.b.min.y - floor), slim = i.sz.y > 2.5 * Math.max(i.sz.x, i.sz.z), flat = i.sz.y < 0.5 * Math.min(Math.max(i.sz.x, i.sz.z), 2);   /* a floor or ceiling drops and lands at a slant; it does not stand up on end */
      pieces.push({ c, roof, pivot, dir, axis: new THREE.Vector3().crossVectors(UP, dir).normalize(), pos0: c.position.clone(), q0: c.quaternion.clone(), s0: c.scale.clone(), floor, drop,
        delay: roof ? 0 : o.roofTime + wave * o.spread - ((ctr.y - floor0) / (top - floor0)) * 0.5 + r() * 0.45,
        dur: roof ? 2.0 : 0.75 + Math.sqrt(i.sz.y) * 0.32 + r() * 0.25, th: roof ? (r() - 0.5) * 0.12 : flat ? 0.15 + r() * 0.3 : slim ? 1.35 + r() * 0.2 : 1.15 + r() * 0.35, twist: (r() - 0.5) * 0.5,
        size: i.sz, box: i.b, gone: false, hit: false });
    }
    /* 4. timbers and sheets that tumble off, and smoke where things land */
    const tim = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.12, 1.5), new THREE.MeshStandardMaterial({ color: o.timber, roughness: 1 }), o.debris);
    const sh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 0.025, 0.6), new THREE.MeshStandardMaterial({ color: o.sheet, roughness: 0.7, metalness: 0.3 }), Math.round(o.debris / 2));
    for (const m of [tim, sh]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; m.userData.split = true; group.add(m); made.push(m); }
    const smoke = []; fx = { tim, sh, smoke };
    /* 5. the wood's own materials, copied so the char does not reach any other building */
    group.traverse((m) => { if (!m.isMesh || m === tim || m === sh) return; const src = m.material; if (!src || Array.isArray(src)) return;
      if (!mats.has(src)) { const cl = src.clone(); cl.userData.col = cl.color ? cl.color.clone() : null; mats.set(src, cl); }
      m.userData.matWas = src; m.material = mats.get(src); });
    built = true;
  }

  const _q = new THREE.Quaternion(), _t = new THREE.Quaternion(), _v = new THREE.Vector3(), _m = new THREE.Matrix4(), _e = new THREE.Euler(), _s = new THREE.Vector3(), CHAR = new THREE.Color(0x221c18), EMBER = new THREE.Color(0x5a1e06);

  function spill(p, n, sheets) {
    for (let k = 0; k < n; k++) {
      const b = p.box, x = b.min.x + r() * (b.max.x - b.min.x), y = b.min.y + r() * (b.max.y - b.min.y), z = b.min.z + r() * (b.max.z - b.min.z), out = 0.6 + r() * 1.8;
      deb.push({ sheet: sheets && r() < 0.8, x, y, z, vx: p.dir.x * out + (r() - 0.5) * 1.2, vy: 0.5 + r() * 2.2, vz: p.dir.z * out + (r() - 0.5) * 1.2, rx: r() * 6, ry: r() * 6, rz: r() * 6, w: (r() - 0.5) * 9, rest: false, floor: o.floorAt(x, z), delay: r() * 0.5 });
    }
  }
  function puff(x, y, z, size, life) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex(), color: o.smoke, transparent: true, opacity: 0, depthWrite: false }));
    s.position.set(x, y, z); s.userData = { age: 0, life, size, y0: y, split: true }; group.add(s); fx.smoke.push(s);
  }

  function tick(dt) {
    if (!running) return false; T += dt; let busy = false;
    for (const p of pieces) {
      const s = T - p.delay;
      if (s < 0) { busy = true; if (s > -0.6) { _q.setFromAxisAngle(p.axis, Math.sin(T * 40 + p.delay * 7) * 0.006 * (1 + s / 0.6)); p.c.quaternion.copy(p.q0).premultiply(_q); } continue; }   /* a tremble before it goes */
      if (!p.gone) { p.gone = true; spill(p, Math.max(1, Math.min(9, Math.round(p.size.x * p.size.z * (p.roof ? 0.12 : 0) + p.size.y * Math.max(p.size.x, p.size.z) / 3))), p.roof); if (p.roof) spill(p, 40, true); }
      const k = Math.min(1, s / p.dur), g = k * k, kd = Math.min(1, s / (p.dur * 0.85));
      if (p.roof) {   /* the roof drops into the building and crumples */
        p.c.position.copy(p.pos0); p.c.position.y -= p.drop * Math.pow(kd, 2.4);   /* a slow sag at first, then it goes */ p.c.scale.copy(p.s0); p.c.scale.y = p.s0.y * (1 - 0.72 * g);
        _q.setFromAxisAngle(p.axis, p.th * g); p.c.quaternion.copy(p.q0).premultiply(_q);
      } else {   /* tip over on the bottom edge while the bottom gives way */
        const th = p.th * g, pv = _v.copy(p.pivot); pv.y -= p.drop * kd * kd;
        _q.setFromAxisAngle(p.axis, th); _t.setFromAxisAngle(UP, p.twist * g); _q.premultiply(_t);
        p.c.position.copy(p.pos0).sub(p.pivot).applyQuaternion(_q).add(pv); p.c.quaternion.copy(p.q0).premultiply(_q);
      }
      if (k < 1) busy = true; else if (!p.hit) { p.hit = true; const b = new THREE.Box3().setFromObject(p.c).applyMatrix4(inv), c = b.getCenter(_v);
        const big = p.roof ? 1 : Math.min(1, p.size.y * Math.max(p.size.x, p.size.z) / 14); puff(c.x, p.floor + 0.8, c.z, (p.roof ? 9 : 3 + 3 * big), 5 + r() * 2); if (o.onImpact) o.onImpact(0.25 + 0.5 * big); }
    }
    /* falling timbers and sheets: gravity, a bounce or two, then they lie flat */
    let nt = 0, ns = 0;
    for (const d of deb) {
      if (d.delay > 0) { d.delay -= dt; busy = true; continue; }
      if (!d.rest) { busy = true; d.vy -= 9.8 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt; d.rx += d.w * dt; d.rz += d.w * 0.6 * dt; const fl = d.floor + (d.sheet ? 0.02 : 0.06);
        if (d.y < fl) { d.y = fl; if (Math.abs(d.vy) < 1.1) { d.rest = true; d.rx = Math.round(d.rx / Math.PI) * Math.PI; d.rz = Math.round(d.rz / Math.PI) * Math.PI; } d.vy = -d.vy * 0.25; d.vx *= 0.4; d.vz *= 0.4; d.w *= 0.4; } }
      const m = d.sheet ? fx.sh : fx.tim, n = d.sheet ? ns : nt; if (n >= m.instanceMatrix.count) continue;
      _m.compose(_s.set(d.x, d.y, d.z), _q.setFromEuler(_e.set(d.rx, d.ry, d.rz)), _v.set(1, 1, 1)); m.setMatrixAt(n, _m); if (d.sheet) ns++; else nt++;
    }
    fx.tim.count = nt; fx.sh.count = ns; fx.tim.instanceMatrix.needsUpdate = fx.sh.instanceMatrix.needsUpdate = true;
    /* smoke and dust: they swell, rise and thin out */
    for (let i = fx.smoke.length - 1; i >= 0; i--) { const sp = fx.smoke[i], u = sp.userData; u.age += dt; const k = u.age / u.life;
      sp.scale.setScalar(u.size * (0.5 + k * 1.6)); sp.position.y = u.y0 + k * 6; sp.material.opacity = Math.min(0.6, u.age * 1.4) * (1 - k);
      if (k >= 1) { group.remove(sp); sp.material.dispose(); fx.smoke.splice(i, 1); } else busy = true; }
    /* the wood chars as it falls; embers glow and then fade */
    if (o.char) { const c = Math.min(1, T / (o.roofTime + o.spread + 1.5)); glow = Math.max(0, Math.sin(Math.min(1, T / (o.roofTime + o.spread + 4)) * Math.PI));
      for (const m of mats.values()) { if (m.userData.col) m.color.copy(m.userData.col).lerp(CHAR, 0.78 * c); if (m.emissive) m.emissive.copy(EMBER).multiplyScalar(glow * 0.55); } }
    return !busy;
  }

  return {
    start() { if (!built) build(); T = 0; running = true; },
    tick,
    get time() { return T; },
    /* everything at rest and the dust gone */
    get done() { return running && !pieces.some((p) => !p.hit) && deb.every((d) => d.rest) && fx && !fx.smoke.length; },
    reset() {
      running = false; T = -1; if (!built) return;
      for (const m of made) group.remove(m); for (const s of fx.smoke) { group.remove(s); s.material.dispose(); }
      for (const s of saved) { if (s.obj.parent !== group) group.attach(s.obj); s.obj.position.copy(s.pos); s.obj.quaternion.copy(s.q); s.obj.scale.copy(s.s); s.obj.visible = s.vis; }
      /* the small things that rode on a panel go back where they were */
      group.traverse((m) => { if (m.userData.matWas) { m.material = m.userData.matWas; delete m.userData.matWas; } });
      for (const m of mats.values()) m.dispose(); for (const m of made) { if (m.geometry) m.geometry.dispose(); if (m.isInstancedMesh) m.material.dispose(); }
      saved.length = made.length = pieces.length = deb.length = 0; mats.clear(); fx = null; built = false;
    },
  };
}
