/* engine/sea.js: the sea, for every game (owner's rule 10, 17 November 2026). It began as Port Royal's sea and was made shareable in Windrush; now every game uses
   this one file. A patch near the action that the graphics card moves with a few long waves (22 November 2026: it was moved on the CPU, vertex by vertex, every
   frame), a large flat plane beyond, ripples from one tiling normal map read twice at two sizes so no repeat shows, colour that turns deep looking down and pale
   toward the horizon, a sun glint, foam that laps at a quay edge, a wake and bow wave behind a moving ship, and gulls. Colours suit each water (WATERS).
     const sea = createSea(parentGroup, { kind: 'caribbean', y: -0.35, at: [x, z] });
   The sea moves itself while it is drawn (each frame, from the clock): a game needs no hook. A game may still call sea.tick(seconds) itself (Windrush and The Shark
   Papers do); then the game's clock drives the water, and a second call in the same frame does nothing.
   Options: kind (a key of WATERS); y, the still water level; at, the middle of the moving patch (put it where the player looks at the water); size, the patch in metres;
   swell, how tall the swell is (1 = Port Royal's; use less where the water lies only a few centimetres under land, so a crest never comes through it; lower swell is
   calmer water, so the ripples are smaller too); far, the size of the flat plane beyond, and farAt, its middle (default: at); farDrop, how far below the patch it
   lies; edges, quay edges where foam laps; material, a material whose colour and finish the patch copies (Port Royal's flood and lagoon water share its sea's: they get
   the sea's look but stay flat); phone (three waves instead of four, fewer vertices) and reduced (still water) are found from the device when left out.
   sea.setLevel(y) moves the patch (Port Royal's earthquake); sea.height(x, z, t) is the water height at a point, from the same waves the shader draws, for things
   that float. */
import * as THREE from "three";
import { lookHaze } from './look.js';

function cv(w, h, draw, repeat, srgb = true) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; if (repeat) t.repeat.set(repeat[0], repeat[1]); return t;
}
const isPhone = () => typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
const prefersStill = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
let seaN = null;
/* the ripples: a 256 px normal map that tiles exactly, made once at start from 20 small waves whose wave numbers are whole numbers of
   cycles across the tile (so there is no seam), their slopes worked out exactly. The shader reads it twice, at two sizes, two
   directions and two speeds, and blends them, so no repeat shows. */
function normals() {
  if (seaN) return seaN;
  const N = 256, waves = [];
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 20; i++) {
    const r = 2 + Math.round(rnd() * rnd() * 12), a = 0.4 + (rnd() - 0.5) * 2.4 + (i % 3 === 2 ? Math.PI / 2 : 0);
    const kx = Math.round(Math.cos(a) * r), ky = Math.round(Math.sin(a) * r);
    if (!kx && !ky) continue;
    waves.push([kx, ky, 1 / Math.pow(Math.hypot(kx, ky), 1.25), rnd() * Math.PI * 2]);
  }
  seaN = cv(
    N,
    N,
    (x) => {
      const d = x.createImageData(N, N);
      for (let v = 0; v < N; v++)
        for (let u = 0; u < N; u++) {
          let gx = 0, gy = 0;
          for (const [kx, ky, a, ph] of waves) {
            const c = Math.cos(((kx * u + ky * v) / N) * Math.PI * 2 + ph) * a;
            gx += c * kx;
            gy += c * ky;
          }
          gx *= 0.35; gy *= 0.35;
          const l = 1 / Math.hypot(gx, gy, 1), i = (v * N + u) * 4;
          d.data[i] = 128 - gx * l * 127;
          d.data[i + 1] = 128 - gy * l * 127;
          d.data[i + 2] = 128 + l * 127;
          d.data[i + 3] = 255;
        }
      x.putImageData(d, 0, 0);
    },
    null,
    false,
  );
  seaN.colorSpace = THREE.NoColorSpace;
  seaN.minFilter = THREE.LinearMipmapNearestFilter;   /* one mip level per read: half the texel reads, and no visible step on moving water */
  return seaN;
}
export const WATERS = {
  caribbean: { color: 0x2b8ea0, deep: 0x17687f, refl: 0.32 },
  harbour: { color: 0x4c7a86, deep: 0x2e4f5a, refl: 0.45 },   /* a northern harbour: New York, 1919 */
  thames: { color: 0x5d7a6e, deep: 0x3b5249, refl: 0.38 },
  atlantic: { color: 0x2f6680, deep: 0x173a50, refl: 0.5 },
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
/* The swell: a few long waves from slightly different directions, summed. Each is [height in m, length in m, direction in radians].
   The shader moves the patch with them on the graphics card, and sea.height() adds up the same waves, so floating things sit on the
   water. A phone uses the first three. Speeds follow deep water (a long wave runs faster), slowed a little to suit a calm harbour. */
const SWELL = [
  [0.062, 17, 0.35],
  [0.046, 10.5, -0.55],
  [0.03, 6.3, 1.15],
  [0.017, 3.6, 0.05],
].map(([a, L, d]) => { const k = (Math.PI * 2) / L; return { a, k, dx: Math.cos(d) * k, dz: Math.sin(d) * k, w: Math.sqrt(9.8 * k) * 0.72 }; });
/* the edge of the moving patch eases flat, so it meets the flat sea beyond without a step */
const edgeEase = (e) => { const k = Math.min(1, Math.max(0, (e - 0.72) / 0.28)); return 1 - k * k * (3 - 2 * k); };
const sharedU = { uT: { value: 0 }, uSky: { value: new THREE.Color(0xc8dce4) }, uSeaN: { value: null } };
/* Gives a MeshStandardMaterial the sea's look, keeping all its own lighting, fog and shadows:
   - ripples from the normal map read twice (two sizes, directions and speeds) and blended, calmer with distance;
   - colour by angle (Fresnel): looking down the water is deep and dark, toward the horizon it turns paler and takes the colour of the
     sky at the horizon (the fog colour, or the background when there is no fog);
   - a tighter sun glint near by (lower roughness), softer far off so it never sparkles into noise;
   - with o.waves (the moving patch only): the swell, moved on the graphics card, with normals worked out from the same waves. */
function seaLook(mat, o) {
  const u = { uDeep: { value: new THREE.Color(o.deep) }, uRefl: { value: o.refl }, uSwell: { value: o.swell || 0 }, uRip: { value: o.rip }, uHalf: { value: o.half || 1 }, uOff: { value: new THREE.Vector2(...(o.off || [0, 0])) } };
  const n = o.waves || 0, key = "sea" + n + (o.lite ? "l" : "");
  mat.customProgramCacheKey = () => key;
  mat.onBeforeCompile = (sh, r) => {
    Object.assign(sh.uniforms, sharedU, u); lookHaze(sh, r, mat);   /* the haze toward the sun, as on the land (engine/look.js) */
    let w = "";
    for (let i = 0; i < n; i++) {
      const s = SWELL[i];
      w += `{ float ph = dot(sp, vec2(${s.dx.toFixed(5)}, ${s.dz.toFixed(5)})) + uT * ${s.w.toFixed(5)}; float a = ${s.a.toFixed(4)} * amp; sh_ += sin(ph) * a; float c = cos(ph) * a; sgx += c * ${s.dx.toFixed(5)}; sgz += c * ${s.dz.toFixed(5)}; }\n`;
    }
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uT, uSwell, uHalf;\nuniform vec2 uOff;\nvarying vec2 vSeaP;")
      .replace(
        "#include <beginnormal_vertex>",
        n
          ? `vec2 sp = position.xz + uOff;
float ed = max(abs(position.x), abs(position.z)) / uHalf, edk = clamp((ed - 0.72) / 0.28, 0.0, 1.0);
float amp = uSwell * (1.0 - edk * edk * (3.0 - 2.0 * edk)), sh_ = 0.0, sgx = 0.0, sgz = 0.0;
${w}vec3 objectNormal = normalize(vec3(-sgx, 1.0, -sgz));
#ifdef USE_TANGENT
vec3 objectTangent = vec3(tangent.xyz);
#endif`
          : "#include <beginnormal_vertex>",
      )
      .replace("#include <begin_vertex>", n ? "vec3 transformed = vec3(position.x, position.y + sh_, position.z);" : "#include <begin_vertex>")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvSeaP = (modelMatrix * vec4(transformed, 1.0)).xz;");
    sh.fragmentShader = (o.lite ? "#define SEA_LITE\n" : "") + sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uT, uRefl, uRip;\nuniform vec3 uDeep, uSky;\nuniform sampler2D uSeaN;\nvarying vec2 vSeaP;")
      .replace(
        "#include <normal_fragment_maps>",
        `float sDist = length(vViewPosition), sNear = 1.0 - smoothstep(12.0, 220.0, sDist);
vec2 r1 = vSeaP * 0.15 + uT * vec2(0.021, 0.013);
vec2 r2 = mat2(0.77, -0.64, 0.64, 0.77) * vSeaP * 0.052 + uT * vec2(-0.008, 0.017);
#ifdef SEA_LITE
vec2 sxy = (texture2D(uSeaN, vSeaP * 0.09 + uT * vec2(0.016, 0.014)).xy * 2.0 - 1.0) * 0.75 * uRip * mix(0.4, 1.0, sNear);
#else
vec2 n2 = texture2D(uSeaN, r2).xy * 2.0 - 1.0;
vec2 n1 = texture2D(uSeaN, r1 + n2 * 0.14).xy * 2.0 - 1.0;   /* the small ripples bent by the large ones: no lattice from above */
vec2 sxy = (n1 * 0.45 * mix(0.3, 1.0, sNear) + n2 * 0.6) * uRip * mix(0.4, 1.0, sNear);
#endif
normal = normalize(normal + viewMatrix[0].xyz * sxy.x - viewMatrix[2].xyz * sxy.y);
float sNV = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), sG = 1.0 - sNV, sG2 = sG * sG;
float sFres = 0.02 + 0.98 * sG2 * sG2 * sG;
diffuseColor.rgb = mix(uDeep, diffuseColor.rgb, sG2);
roughnessFactor = mix(roughnessFactor * 1.7, roughnessFactor * 0.65, sNear);`,
      )
      .replace(
        "#include <fog_fragment>",
        `#ifdef USE_FOG
gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, sFres * uRefl);
#else
gl_FragColor.rgb = mix(gl_FragColor.rgb, uSky, sFres * uRefl);
#endif
#include <fog_fragment>`,
      );
  };
  mat.needsUpdate = true;
  return u;
}
/* parent: the place group. See the top of this file for the options. */
export function createSea(parent, { kind = "caribbean", y = -2.1, at = [0, -40], size = 300, phone = isPhone(), reduced = prefersStill(), edges = [], swell = 1, far = 6000, farAt = null, farDrop = 0.45, material = null } = {}) {
  const W = WATERS[kind] || WATERS.caribbean, nw = phone ? 3 : 4, rip = 0.6 + 0.4 * Math.min(1, swell);   /* a lower swell is calmer water: smaller ripples too */
  sharedU.uSeaN.value = normals();
  /* the moving patch has a material of its own. A material a game passes (Port Royal's, shared with its flood and lagoon) gets the same
     look without the swell, so only the sea's own patch moves; the patch copies its colour and finish. */
  const mat = material ? material.clone() : new THREE.MeshStandardMaterial({ color: W.color, roughness: 0.22, metalness: 0.15 });
  if (material) seaLook(material, { deep: W.deep, refl: W.refl, rip, lite: phone });
  seaLook(mat, { deep: W.deep, refl: W.refl, rip, lite: phone, swell, half: size / 2, off: at, waves: nw });
  const farMat = new THREE.MeshStandardMaterial({ color: material ? material.color.getHex() : W.color, roughness: 0.26, metalness: 0.12 });
  seaLook(farMat, { deep: W.deep, refl: W.refl, rip, lite: true });   /* far off, one ripple read is enough */
  const fa = farAt || at, farM = new THREE.Mesh(new THREE.PlaneGeometry(far, far), farMat);
  farM.rotation.x = -Math.PI / 2; farM.position.set(fa[0], y - farDrop, fa[1]); farM.userData.noBatch = true; farM.userData.water = true; farM.name = "sea far"; parent.add(farM);
  const seg = phone ? 40 : 60, wg = new THREE.PlaneGeometry(size, size, seg, seg); wg.rotateX(-Math.PI / 2);
  const near = new THREE.Mesh(wg, mat); near.position.set(at[0], y, at[1]); near.userData.noBatch = true; near.userData.water = true; near.renderOrder = 2; near.name = "sea"; parent.add(near);
  const foams = [];
  for (const [x0, z0, x1, z1] of edges) {
    const len = Math.hypot(x1 - x0, z1 - z0), t = foam().clone(); t.needsUpdate = true; t.repeat.set(len / 6, 1);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.4), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.55 }));
    f.rotation.order = "YXZ"; f.rotation.y = -Math.atan2(z1 - z0, x1 - x0); f.rotation.x = -Math.PI / 2;
    const nx = (z1 - z0) / len, nz = -(x1 - x0) / len; f.position.set((x0 + x1) / 2 + nx * 0.7, y + 0.06, (z0 + z1) / 2 + nz * 0.7); f.userData.noBatch = true; f.userData.water = true; parent.add(f); foams.push(f);
  }
  let last = -1, level = y, ext = -1e9;
  const half = size / 2, waves = SWELL.slice(0, nw);
  const S = {
    get level() { return level; }, near, far: farM, material: mat,
    /* the water height at a point (the place's own x and z, as the patch is placed), for things that float: the same waves as the shader */
    height(x, z, t) {
      const lx = x - near.position.x, lz = z - near.position.z, amp = swell * edgeEase(Math.max(Math.abs(lx), Math.abs(lz)) / half);
      if (!amp) return level;
      if (reduced) t = 0;   /* still water: the shader's clock stays at 0 */
      let h = 0;
      for (const s of waves) h += Math.sin(x * s.dx + z * s.dz + t * s.w) * s.a;
      return level + h * amp;
    },
    setLevel(v) { if (v === level) return; level = v; near.position.y = v; },
    tick(t, self) {
      if (!self) ext = performance.now();
      if (t === last) return; last = t;
      if (material) { if (!mat.color.equals(material.color)) mat.color.copy(material.color); mat.roughness = material.roughness; mat.metalness = material.metalness; mat.opacity = material.opacity; mat.visible = material.visible; }
      if (reduced) return;
      sharedU.uT.value = t;
      for (const [i, f] of foams.entries()) { f.material.map.offset.x = Math.sin(t * 0.3 + i) * 0.05; f.material.opacity = 0.42 + Math.sin(t * 1.1 + i * 1.7) * 0.16; f.position.y = S.height(f.position.x, f.position.z, t) + 0.05 + Math.sin(t * 1.3 + i) * 0.03; }
    },
  };
  /* moves itself while it is drawn: no game needs a hook. When a game ticks the sea itself (Windrush, The Shark Papers), its clock is used, so
     sea.height() with the game's time matches the drawn water. The sky colour for the horizon comes from the scene being drawn. */
  const self = (r, scene) => {
    const sky = scene && ((scene.fog && scene.fog.color) || (scene.background && scene.background.isColor && scene.background));
    if (sky) sharedU.uSky.value.copy(sky);
    if (performance.now() - ext > 250) S.tick(Math.round(performance.now()) / 1000, true);
  };
  near.onBeforeRender = self; farM.onBeforeRender = self;
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
