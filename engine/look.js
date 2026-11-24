/* engine/look.js: light from the sky and soft shading in corners, for every game (owner, 24 November 2026: "Lets do 1 and 2 for now graphics upgrade").
     draw(renderer, scene, camera)   in place of renderer.render(scene, camera) for the game's main picture (engine/cine.js renderFramed calls it)
     LOOK                            what is on: LOOK.sky, LOOK.ao (and why AO went off, LOOK.aoOff)

   1. Light from the sky. Every game lights its places with a HemisphereLight (a sky colour from above, a ground colour from below) and a sun. Here part of the
      hemisphere's light (SKY_SHARE) comes instead from a real sky round the scene, made from the same two colours with a soft glow toward the sun. It reaches
      each surface by the way it faces, so a wall turned toward the sun side of the sky is warmer than one turned away, and cloth, wood and skin pick up a
      faint sheen from the sky. The amount of light is the same as before: the hemisphere gives irradiance colour x strength, a sky gives pi x radiance x
      strength, so the sky's strength is the share / pi. The game's own lighting code is untouched: the sky is rebuilt from the lights whenever they change
      (time of day, indoors, night), and the hemisphere is turned down by the share only while the picture is drawn. A game's own scene.environment (six games
      had a faint gradient) is folded in and put back after each frame.
   2. Soft shading in corners (ambient occlusion): where a surface is closed in by another (under a chin, inside a collar, where a wall meets the floor, under
      a table), less sky light reaches it and it is drawn a little darker. three.js's GTAOPass, on computers and tablets; phones skip it (it draws the whole
      scene twice). Glows, sprites, see-through effects and anything marked userData.noAO are left out of it, the sun's shadow map is not drawn twice, and
      the picture keeps its anti-aliasing. If frames get slow (engine/perf.js starts drawing fewer pixels), AO switches off before the picture gets coarser.
   ?nosky and ?noao turn each off, ?ao turns AO on on a phone, ?aoview shows the shading alone, to compare. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { isPhone, PERF } from './perf.js';
import { contactShadows } from './contact.js';

const Q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
export const SKY_SHARE = 0.6;
export const LOOK = { sky: !Q.has('nosky'), ao: !Q.has('noao') && (Q.has('ao') || !isPhone()), glow: !Q.has('noglow') && (Q.has('glow') || !isPhone()), grading: !Q.has('nograde'), post: true, grade: null, aoOff: '' };
const ST = new WeakMap();
if (typeof window !== 'undefined') window.__LOOK = LOOK;   /* for a check or a test view */

/* ---------- 1. the sky ---------- */
const W = 64, H = 32;
function skyData(sky, ground, sunDir, sunCol, glow) {
  const d = new Uint16Array(W * H * 4), v = new THREE.Vector3(), hf = THREE.DataUtils.toHalfFloat;   /* half floats: some phones cannot filter full-float textures smoothly */
  for (let y = 0; y < H; y++) {
    const lat = Math.PI * ((y + 0.5) / H - 0.5), up = Math.sin(lat), cl = Math.cos(lat);   /* three's equirectangular layout, as a data texture holds it (no flip): row 0 looks straight down */
    for (let x = 0; x < W; x++) {
      const ph = 2 * Math.PI * ((x + 0.5) / W - 0.5);
      v.set(Math.cos(ph) * cl, up, Math.sin(ph) * cl);
      const t = Math.min(1, Math.max(0, (up + 0.12) / 0.24)), k = t * t * (3 - 2 * t);   /* sky above the horizon, ground below, softly joined: lit by it, a surface facing up gets the sky colour, one facing down the ground colour and one facing sideways half of each, as under the hemisphere light (a slower blend washed ceilings out with sky colour) */
      const g = glow * Math.pow(Math.max(0, v.dot(sunDir)), 4);
      const i = (y * W + x) * 4;
      d[i] = hf(ground.r + (sky.r - ground.r) * k + sunCol.r * g);
      d[i + 1] = hf(ground.g + (sky.g - ground.g) * k + sunCol.g * g);
      d[i + 2] = hf(ground.b + (sky.b - ground.b) * k + sunCol.b * g);
      d[i + 3] = hf(1);
    }
  }
  const t = new THREE.DataTexture(d, W, H, THREE.RGBAFormat, THREE.HalfFloatType);
  t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.LinearSRGBColorSpace; t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}
function lightsOf(scene, st) {
  if (st.scene === scene && st.seen > 0) { st.seen--; return; }
  st.scene = scene; st.seen = 120; st.hemi = null; st.sun = null;
  scene.traverseVisible((o) => {   /* only lights that are really on: a hidden place's own lights are left out */
    if (o.isHemisphereLight && (!st.hemi || o.intensity > st.hemi.intensity)) st.hemi = o;
    if (o.isDirectionalLight && (!st.sun || o.intensity > st.sun.intensity)) st.sun = o;
  });
}
const r2 = (x) => Math.round(x * 50) / 50;
function sky(renderer, scene, st) {
  lightsOf(scene, st);
  const h = st.hemi; if (!h || h.intensity <= 0) return null;
  const sun = st.sun, sd = new THREE.Vector3(0, 1, 0), sc = new THREE.Color(0, 0, 0);
  let glow = 0;
  if (sun && sun.intensity > 0) {
    sd.copy(sun.position); if (sun.target) sd.sub(sun.target.position); if (sd.lengthSq() < 1e-6) sd.set(0, 1, 0); sd.normalize();
    sc.copy(sun.color); glow = Math.min(0.5, 0.18 * sun.intensity / h.intensity);
  }
  const sig = [h.color.r, h.color.g, h.color.b, h.groundColor.r, h.groundColor.g, h.groundColor.b, sd.x, sd.y, sd.z, sc.r, sc.g, sc.b, glow].map(r2).join(',');
  const now = performance.now();
  if (sig !== st.sig && (!st.env || now - st.at > 250)) {
    st.pmrem = st.pmrem || new THREE.PMREMGenerator(renderer);
    const t = skyData(h.color, h.groundColor, sd, sc, glow), rt = st.pmrem.fromEquirectangular(t); t.dispose();
    if (st.envRT) st.envRT.dispose();
    st.envRT = rt; st.env = rt.texture; st.sig = sig; st.at = now;
  }
  return st.env ? h : null;
}

/* ---------- 2. soft shading in corners ---------- */
class SoftCorners extends GTAOPass {
  render(renderer, w, r, dt, mask) {
    const au = renderer.shadowMap.autoUpdate; renderer.shadowMap.autoUpdate = false;   /* the sun's shadow map was drawn by the picture itself, just before */
    super.render(renderer, w, r, dt, mask); renderer.shadowMap.autoUpdate = au;
  }
  _overrideVisibility() {
    const cache = this._visibilityCache;
    this.scene.traverse((o) => {
      if (!o.visible) return;
      let skip = o.isPoints || o.isLine || o.isLine2 || o.isSprite || o.userData.noAO;
      if (!skip && o.isMesh) {
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        skip = !m || m.blending === THREE.AdditiveBlending || m.colorWrite === false || (m.transparent && (m.depthWrite === false || m.opacity < 0.6)) || m.side === THREE.BackSide;
      }
      if (skip) { o.visible = false; cache.push(o); }
    });
  }
}
/* the sky's sheen is kept to 40 per cent: in full, rough ground seen low reflected the night sky's blue and turned grey-green, and lamplight pools went cold
   (Bog Walk at night). The diffuse sky light is untouched. ?fullsheen for the whole. */
if (!Q.has('fullsheen')) {
  const c = THREE.ShaderChunk.envmap_physical_pars_fragment, a = 'return envMapColor.rgb * envMapIntensity;';
  if (c.includes(a)) THREE.ShaderChunk.envmap_physical_pars_fragment = c.replace(a, 'return envMapColor.rgb * envMapIntensity * 0.4;');
}

/* ---------- 4. haze toward the sun ---------- */
/* fog in every built-in material turns brighter and warmer toward the sun, as real haze does: flat fog read as a grey wall. The two uniforms are shared by
   every material through a default onBeforeCompile (a material with its own keeps it, and gets plain fog, as before). */
const HAZE = { fogSunDir: { value: new THREE.Vector3(0, 1, 0) }, fogSunColor: { value: new THREE.Color(0, 0, 0) } };
if (!Q.has('nohaze')) {
  THREE.ShaderChunk.fog_pars_fragment = THREE.ShaderChunk.fog_pars_fragment.replace('#ifdef USE_FOG', '#ifdef USE_FOG\n\tuniform vec3 fogSunDir;\n\tuniform vec3 fogSunColor;\n\tvarying vec3 vFogWorldDir;');
  THREE.ShaderChunk.fog_pars_vertex = THREE.ShaderChunk.fog_pars_vertex.replace('#ifdef USE_FOG', '#ifdef USE_FOG\n\tvarying vec3 vFogWorldDir;');
  THREE.ShaderChunk.fog_vertex = THREE.ShaderChunk.fog_vertex.replace('#ifdef USE_FOG', '#ifdef USE_FOG\n\tvFogWorldDir = transpose( mat3( viewMatrix ) ) * mvPosition.xyz;');
  THREE.ShaderChunk.fog_fragment = THREE.ShaderChunk.fog_fragment.replace('gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',
    'float sunAmt = pow( max( dot( normalize( vFogWorldDir ), fogSunDir ), 0.0 ), 6.0 );\n\tvec3 hazeColor = fogColor + fogSunColor * ( 0.08 + 0.35 * sunAmt );\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, hazeColor, fogFactor );');
  const prev = THREE.Material.prototype.onBeforeCompile;
  THREE.Material.prototype.onBeforeCompile = function (shader, r) { if (shader.uniforms && 'fogColor' in shader.uniforms) Object.assign(shader.uniforms, HAZE); if (prev) prev.call(this, shader, r); };
}

/* ---------- 2. the colour grade ---------- */
/* a gentle grade over the finished picture, on every device, worked out from the place's own lights each frame and eased between moods: a low, warm sun gives
   golden hour (warm highlights, a little richer colour); a dim sun under a dark sky gives night (cool, softer colour); a bright high sun, a clear day
   (a little contrast, slightly warm); anything else a soft filmic look. A game can set LOOK.grade = { tint: [r,g,b], sat, contrast, lift: [r,g,b] } for a chapter
   (null goes back to automatic). And a soft vignette, as a camera lens gives. */
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, gain: { value: new THREE.Vector3(1, 1, 1) }, lift: { value: new THREE.Vector3(0, 0, 0) }, sat: { value: 1 }, contrast: { value: 1 }, vig: { value: 0.18 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 gain, lift; uniform float sat, contrast, vig; varying vec2 vUv;
    void main() { vec4 t = texture2D(tDiffuse, vUv); vec3 c = t.rgb;
      c = (c - 0.5) * contrast + 0.5;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, sat);
      vec3 sh = 1.0 - c; c = c * gain + lift * sh * sh * sh * sh;   /* the tint in the deepest shadows only: across all the darks it greyed warm lamplight */
      vec2 d = vUv - 0.5; c *= 1.0 - vig * dot(d, d) * 1.6;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), t.a); }`,
};
const MOOD = { gain: new THREE.Vector3(1, 1, 1), lift: new THREE.Vector3(), sat: 1, contrast: 1, vig: 0.18 };
function moodFor(st) {
  const g = LOOK.grade;
  if (g) return { gain: new THREE.Vector3(...(g.tint || [1, 1, 1])), lift: new THREE.Vector3(...(g.lift || [0, 0, 0])), sat: g.sat ?? 1, contrast: g.contrast ?? 1, vig: g.vig ?? 0.18 };
  const h = st.hemi, sun = st.sun;
  const hb = h ? h.intensity * (h.color.r + h.color.g + h.color.b) / 3 : 1;
  let e = 0.7, warm = 0, si = 0;
  if (sun && sun.intensity > 0) {
    const d = sun.position.clone(); if (sun.target) d.sub(sun.target.position); d.normalize(); e = d.y;
    warm = sun.color.r - sun.color.b; si = sun.intensity;
  }
  const night = Math.min(1, Math.max(0, (0.9 - hb) / 0.6)) * Math.min(1, Math.max(0, (1.6 - si) / 1.2));
  const golden = (1 - night) * Math.min(1, Math.max(0, (0.5 - e) / 0.35)) * Math.min(1, Math.max(0, (warm - 0.05) / 0.25)) * Math.min(1, si / 0.8);
  const day = (1 - night) * (1 - golden);
  const m = (a, b, c) => a * day + b * golden + c * night;
  return {
    gain: new THREE.Vector3(m(1.01, 1.05, 1.0), m(1.0, 1.0, 1.0), m(0.98, 0.9, 1.02)),
    lift: new THREE.Vector3(m(0.0, 0.01, 0.0), m(0.0, 0.0, 0.004), m(0.01, 0.0, 0.022)),   /* night cools only the shadows: cooling the whole picture lost the warm pools of lamplight and greyed faces (rule 9) */
    sat: m(1.07, 1.1, 0.97), contrast: m(1.05, 1.04, 0.97), vig: m(0.16, 0.2, 0.2),
  };
}
function easeMood(st, dt) {
  const t = moodFor(st), k = st.moodSet ? 1 - Math.exp(-dt * 1.5) : 1; st.moodSet = true;
  MOOD.gain.lerp(t.gain, k); MOOD.lift.lerp(t.lift, k); MOOD.sat += (t.sat - MOOD.sat) * k; MOOD.contrast += (t.contrast - MOOD.contrast) * k; MOOD.vig += (t.vig - MOOD.vig) * k;
}

/* ---------- 3. glow ---------- */
/* bright things (flames, lamps, lit windows, the sun on white sails) get a soft halo, on computers and tablets. Only light well above white glows, so an
   ordinary lit wall does not. */

function composerFor(renderer, scene, camera, st) {
  const pr = renderer.getPixelRatio(), size = renderer.getSize(new THREE.Vector2());
  if (!st.comp) {
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });   /* keeps the anti-aliasing the canvas had */
    st.comp = new EffectComposer(renderer, rt);
    st.rp = new RenderPass(scene, camera); st.comp.addPass(st.rp);
    if (LOOK.ao) {
      st.ao = new SoftCorners(scene, camera, 1, 1);
      st.ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 2, thickness: 1, distanceFallOff: 1, scale: 1.6, samples: 12 });
      /* it fades out with distance: full under 12 m, none past 40 m. Far off, layered hills and the sea's edge lie within a step of each other in the depth
         buffer and read as one deep corner, which turned whole hillsides dark */
      const fs = st.ao.gtaoMaterial.fragmentShader;
      st.ao.gtaoMaterial.fragmentShader = fs.replace('ao = pow(ao, scale);', 'ao = pow(ao, scale);\n\t\t\tao = mix(ao, 1., smoothstep(12., 40., -viewPos.z));');
      st.ao.gtaoMaterial.needsUpdate = true;
      st.ao.updatePdMaterial({ radius: 6, samples: 12 });
      st.ao.blendIntensity = 0.85;
      if (Q.has('aoview')) st.ao.output = GTAOPass.OUTPUT.Denoise;   /* ?aoview: the shading alone, white where nothing is closed in */
      st.comp.addPass(st.ao);
    }
    if (LOOK.glow) { st.glow = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.55, 1.05); st.comp.addPass(st.glow); }
    st.comp.addPass(new OutputPass());
    st.grade = new ShaderPass(GradeShader); st.comp.addPass(st.grade);
    st.w = st.h = st.pr = 0;
  }
  if (size.x !== st.w || size.y !== st.h || pr !== st.pr) { st.comp.setPixelRatio(pr); st.comp.setSize(size.x, size.y); st.w = size.x; st.h = size.y; st.pr = pr; }
  st.rp.scene = scene; st.rp.camera = camera;
  if (st.ao) { st.ao.scene = scene; st.ao.camera = camera; st.ao.enabled = LOOK.ao; }
  if (st.glow) st.glow.enabled = LOOK.glow;
  const u = st.grade.uniforms; u.gain.value.copy(MOOD.gain); u.lift.value.copy(MOOD.lift); u.sat.value = MOOD.sat; u.contrast.value = MOOD.contrast; u.vig.value = MOOD.vig;
  st.grade.enabled = LOOK.grading;
  return st.comp;
}

/* ---------- the frame ---------- */
export function draw(renderer, scene, camera) {
  let st = ST.get(renderer); if (!st) ST.set(renderer, (st = { seen: 0 }));
  const now = performance.now(), dt = Math.min(0.1, (now - (st.last || now)) / 1000); st.last = now;
  const h = LOOK.sky ? sky(renderer, scene, st) : (lightsOf(scene, st), null);
  if (st.sun) {
    const d = HAZE.fogSunDir.value.copy(st.sun.position); if (st.sun.target) d.sub(st.sun.target.position); if (d.lengthSq() > 1e-6) d.normalize();
    HAZE.fogSunColor.value.copy(st.sun.color).multiplyScalar(Math.min(1, st.sun.intensity / 2.5));
  } else HAZE.fogSunColor.value.setRGB(0, 0, 0);
  easeMood(st, dt);
  if (!Q.has('nocontact')) contactShadows(scene, !renderer.shadowMap.enabled || !st.sun || !st.sun.castShadow);   /* 5. a soft shadow under people where no sun shadow is drawn */
  let e0, i0, hi0;
  if (h) {
    e0 = scene.environment; i0 = scene.environmentIntensity; hi0 = h.intensity;
    const own = e0 && e0 !== st.env ? (i0 || 0) * 0.47 : 0;   /* a game's own faint gradient sky, folded in (its colours are about half as bright as the hemisphere's) */
    scene.environment = st.env; scene.environmentIntensity = (hi0 * SKY_SHARE) / Math.PI + own; h.intensity = hi0 * (1 - SKY_SHARE);
  }
  if (PERF.drops > 0 && LOOK.ao) { LOOK.ao = false; LOOK.aoOff = 'slow frames'; }
  else if (PERF.drops > 1 && LOOK.glow) { LOOK.glow = false; LOOK.aoOff = 'slow frames'; }
  try {
    if (LOOK.post && camera.isPerspectiveCamera && (LOOK.ao || LOOK.glow || LOOK.grading || Q.has('forcepost'))) composerFor(renderer, scene, camera, st).render();
    else renderer.render(scene, camera);
  } catch (err) {
    LOOK.post = false; LOOK.aoOff = String(err && err.message || err); renderer.setRenderTarget(null); renderer.render(scene, camera);
  } finally {
    if (h) { scene.environment = e0; scene.environmentIntensity = i0; h.intensity = hi0; }
  }
}
