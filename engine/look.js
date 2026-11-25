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
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { isPhone, PERF } from './perf.js';
import { contactShadows } from './contact.js';
import { givesLight } from './lightkind.js';

const Q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
export const SKY_SHARE = 0.6;
const PHONE = typeof window !== 'undefined' && isPhone();   /* the engine is also loaded by Node tests (engine/batch.js imports this through surfaces.js), where there is no screen */
export const LOOK = { sky: !Q.has('nosky'), ao: !Q.has('noao') && (Q.has('ao') || !PHONE), glow: !Q.has('noglow') && (Q.has('glow') || !PHONE), grading: !Q.has('nograde'), post: !Q.has('nopost'), grade: null, aoOff: '' };
const ST = new WeakMap();
const CAM = Q.has('cam') ? [...Q.get('cam').split(','), ...(Q.get('at') || '0,0,0').split(',')].map(Number) : null;
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
const onStage = (o, scene) => { for (let q = o; q; q = q.parent) { if (!q.visible) return false; if (q === scene) return true; } return false; };
function lightsOf(scene, st) {
  /* looked up again every half second, and at once when a light we use is taken away or hidden (a new place, a chapter, indoors): with a two-second wait the
     old place's sky lit the new place for a moment */
  if (st.scene === scene && st.seen > 0 && (!st.hemi || onStage(st.hemi, scene)) && (!st.sun || onStage(st.sun, scene))) { st.seen--; return; }
  st.scene = scene; st.seen = 30; st.hemi = null; st.sun = null;
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
/* The extra pass is drawn exactly as the screen would be: each material tone maps and turns its colour into display colour itself (three does both only when
   drawing straight to the screen), into a target marked as display colour, and the last pass hands the picture to the screen unchanged. So see-through layers
   (light pools, moss and grass patches, glass, smoke) blend as they always did, and materials drawn without tone mapping (the gold guide arrow) keep their
   colours. (Blended in linear colour first, Bog Walk's night ground turned grey-green and the guide arrow came out duller.) */
const TONEFN = { [THREE.ACESFilmicToneMapping]: 'ACESFilmicToneMapping', [THREE.AgXToneMapping]: 'AgXToneMapping', [THREE.ReinhardToneMapping]: 'ReinhardToneMapping', [THREE.CineonToneMapping]: 'OptimizedCineonToneMapping', [THREE.NeutralToneMapping]: 'NeutralToneMapping' };
function toneInPass(mat, shader, r) {
  const t = r && r.getRenderTarget(), fs = shader.fragmentShader;
  if (!t || !t.__look || !fs.includes('#include <colorspace_fragment>')) return;
  const fn = TONEFN[r.toneMapping], tone = fn && mat.toneMapped !== false && fs.includes('#include <tonemapping_fragment>');
  let out = fs;
  if (tone) {
    const pars = fs.includes('vec3 ' + fn) ? '' : THREE.ShaderChunk.tonemapping_pars_fragment;   /* three leaves the curves out when it does not tone map */
    out = out.replace('void main() {', pars + '\nvoid main() {').replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n\tgl_FragColor.rgb = ' + fn + '( gl_FragColor.rgb );');
  }
  /* and display colour, just where the screen path makes it (before fog, as three does) */
  shader.fragmentShader = out.replace('#include <colorspace_fragment>', '#include <colorspace_fragment>\n\tgl_FragColor = sRGBTransferOETF( gl_FragColor );');
}
/* the sea (engine/sea.js) has its own shader hook, so it calls this for the haze toward the sun (or it showed plain fog beside the hazed land) and the tone mapping above */
export function lookHaze(shader, r, mat) { if (shader.uniforms && 'fogColor' in shader.uniforms) Object.assign(shader.uniforms, HAZE); if (mat) toneInPass(mat, shader, r); }
{ const p2 = THREE.Material.prototype.onBeforeCompile; THREE.Material.prototype.onBeforeCompile = function (shader, r) { p2.call(this, shader, r); const k = clothKind(this); if (k) addCloth(shader, k); else if (grainOK(this)) addGrain(shader); toneInPass(this, shader, r); }; }

/* ---------- 7. cloth with a weave ---------- */
/* clothes read as cloth, not plastic: a fine weave and a little unevenness of colour, drawn by the shader from each point's place on the body at rest (the
   clothes have no texture coordinates), so it stays on the cloth as it bends. Wool (coats, jackets, waistcoats, breeches, caps): a diagonal twill and a
   heathered colour; linen and cotton (shirts, skirts, aprons, neckcloths, wraps): a plain weave. The weave fades away where it is finer than a pixel, so it
   shows in close-ups and talk scenes and never shimmers far off. Matched by material name, on the full bodies only (the phone and crowd copies share one
   material). ?noweave to compare. */
const WOOL = /^(Coat|Jacket|Waistcoat|Breeches|Cap|Cardigan|Vest|Facings|Lapels|Tam)$/, LINEN = /^(Shirt|Skirt|Apron|Bands|Wrap|Collar|Scarf|Sock|Pocket|ArmBand|Bonnet)$/;
const clothKind = (m) => (Q.has('noweave') || !m || !m.isMeshStandardMaterial ? 0 : WOOL.test(m.name) ? 1 : LINEN.test(m.name) ? 2 : 0);
const CLOTH_GLSL = `
varying vec3 vClothPos;
float cHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float cNoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(cHash(i), cHash(i + vec3(1,0,0)), f.x), mix(cHash(i + vec3(0,1,0)), cHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(cHash(i + vec3(0,0,1)), cHash(i + vec3(1,0,1)), f.x), mix(cHash(i + vec3(0,1,1)), cHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float cWeave(vec3 p, float kind) {      /* thread height, 0..1 */
  float u = (p.x + p.z), v = p.y;
  if (kind < 1.5) { float per = 0.0026; float d = (u + v) / per; return 0.5 + 0.5 * sin(d * 6.2831) * (0.75 + 0.25 * sin(v / per * 3.1416)); }
  float per = 0.0018; return 0.5 + 0.25 * (sin(u / per * 6.2831) + sin(v / per * 6.2831));
}
vec3 cBump(vec3 pos, vec3 n, float h) {
  vec3 dpx = dFdx(pos), dpy = dFdy(pos); float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx); float det = dot(dpx, r1);
  vec3 g = sign(det) * (dhx * r1 + dhy * r2); return normalize(abs(det) * n - g);
}`;
function addCloth(shader, kind) {
  shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vClothPos;').replace('#include <begin_vertex>', '#include <begin_vertex>\n\tvClothPos = position;');
  shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + CLOTH_GLSL)
    .replace('#include <color_fragment>', `#include <color_fragment>
	float cFw = length(fwidth(vClothPos));
	float cMot = mix(0.5, cNoise(vClothPos / 0.006), 1.0 - smoothstep(0.0015, 0.004, cFw)) * 0.5 + cNoise(vClothPos / 0.025) * 0.5;      /* uneven threads and slubs, the fine ones only where they are several pixels across (finer, they sparkled) */
	diffuseColor.rgb *= 1.0 + ${kind === 1 ? '0.12' : '0.06'} * (cMot - 0.5) * (1.0 - smoothstep(0.008, 0.02, cFw));`)
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
	{ float cK = ${kind}.0, cPer = cK < 1.5 ? 0.0026 : 0.0018;
	  float cAmp = (1.0 - smoothstep(cPer * 0.08, cPer * 0.16, cFw)) * 0.00012;      /* only where a thread is eight pixels or more: finer, the weave beat against the pixels in moire bands */
	  float cSl = (1.0 - smoothstep(0.0015, 0.004, cFw)) * 0.0003;      /* the slubs, as soft bumps, where they are several pixels across */
	  if (cAmp + cSl > 0.0) normal = cBump(-vViewPosition, normal, cAmp * cWeave(vClothPos, cK) + cSl * cMot); }`);
}
/* ---------- 6. grain on plain surfaces ---------- */
/* every plain-coloured surface of a place (no picture of its own, not see-through, not glowing, not metal, not a body; a place's surfaces merged by engine/batch.js count) gets a gentle grain from its place in
   the world, so it needs no texture coordinates and nothing to download: broad weathering over a metre or two, mottling of a few centimetres, and a fine
   roughness that shows only close up and fades where it is finer than a pixel. A wall, a floor or the ground is no longer one flat colour. A material
   marked userData.noGrain keeps its plain colour. ?nograin to compare. */
const grainOK = (m) => !Q.has('nograin') && m && (m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial) && !m.map && (!m.vertexColors || /_colours$/.test(m.name || '')) && !m.transparent
  && !(m.userData && m.userData.noGrain) && !(m.emissive && (m.emissive.r + m.emissive.g + m.emissive.b) > 0.05) && !((m.metalness || 0) > 0.5) && m.side !== THREE.BackSide && !clothKind(m);
const GX = (+Q.get('grainx') || 1.8).toFixed(2);   /* ?grainx=5: the grain made stronger, to see where it lands */
function addGrain(shader) {
  shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vGrainPos;').replace('#include <begin_vertex>',
    '#include <begin_vertex>\n\t{ vec4 gp = vec4( transformed, 1.0 );\n\t#ifdef USE_INSTANCING\n\tgp = instanceMatrix * gp;\n\t#endif\n\tvGrainPos = ( modelMatrix * gp ).xyz; }');
  const fn = CLOTH_GLSL.replace('varying vec3 vClothPos;', 'varying vec3 vGrainPos;');
  shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + fn)
    .replace('#include <color_fragment>', `#include <color_fragment>
	float gFw = length(fwidth(vGrainPos));
	float gBroad = cNoise(vGrainPos / 1.6) * 0.6 + cNoise(vGrainPos / 0.45) * 0.4;
	float gMid = mix(0.5, cNoise(vGrainPos / 0.05), 1.0 - smoothstep(0.004, 0.012, gFw));
	diffuseColor.rgb *= 1.0 + ${GX} * (0.10 * (gBroad - 0.5) + 0.07 * (gMid - 0.5));`)
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
	#ifndef FLAT_SHADED
	{ float gA = (1.0 - smoothstep(0.0012, 0.0035, gFw)) * 0.0004;
	  if (gA > 0.0) normal = cBump(-vViewPosition, normal, gA * cNoise(vGrainPos / 0.008)); }
	#endif`);
}
/* the game's tone mapping, part of every shader's identity: three notices a change of it only when drawing straight to the screen, so in the extra pass a sky
   kept the tube's tone mapping after Bog Walk switched it off outdoors (draw() marks every material for rebuilding when it changes) */
const TM = { now: -1 };
export const lookKey = () => '|tm' + TM.now;   /* for a material with its own shader key (engine/surfaces.js) */
const ckPrev = THREE.Material.prototype.customProgramCacheKey;
THREE.Material.prototype.customProgramCacheKey = function () { const k = clothKind(this); return ckPrev.call(this) + (k ? '|cloth' + k : grainOK(this) ? '|grain' : '') + '|tm' + TM.now; };

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

/* ---------- 3. glow: only lights glow ---------- */
/* Lamps, flames, lit windows and anything else that gives light get a soft glow, on computers and tablets (owner, 24 November 2026: "do it"). A glow by
   brightness could not tell a lamp from a sunlit beach or a white sky once tone mapped, and washed the Shark Papers quay white; so this one is selective.
   The lights are found by what they are: an additive glow (a flame, a lamp's halo), a material that gives light (emissive, at least a quarter bright), an
   unlit surface in a bright warm colour (lamp glass, a lit window), or
   anything a game marks userData.glow. Each frame they alone are drawn into a small buffer, with everything else drawn black (so a wall or a person still
   hides a lamp behind it; see-through things are left out, so a lamp glows through glass), the buffer is blurred, and the glow is added to the picture.
   Nothing that is not a light can ever glow. A light marked userData.noGlow is left out. ?noglow, ?glowview (four times stronger, to see what glows). */
const DARK = new Map(), _fr = new THREE.Frustum(), _pm = new THREE.Matrix4();
function darkFor(m) {      /* black, but with the same faces and cut-outs, so it hides a light exactly as the real thing does */
  const key = (m.side ?? 0) + ':' + (m.alphaTest > 0 && m.map ? m.map.uuid + ':' + m.alphaTest : '');
  let d = DARK.get(key);
  if (!d) { d = new THREE.MeshBasicMaterial({ color: 0x000000, side: m.side, fog: false, ...(m.alphaTest > 0 && m.map ? { map: m.map, alphaTest: m.alphaTest } : {}) }); d.userData.noGlow = true; DARK.set(key, d); }
  return d;
}
const GlowMixShader = {
  uniforms: { tDiffuse: { value: null }, tGlow: { value: null }, strength: { value: 1 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  /* the glow is added where the picture is dark and fades out where it is already bright, so a lit window keeps its glazing bars */
  fragmentShader: 'uniform sampler2D tDiffuse, tGlow; uniform float strength; varying vec2 vUv; void main() { vec4 c = texture2D(tDiffuse, vUv)' + (Q.has('glowonly') ? ' * 0.0' : '') + '; vec3 g = texture2D(tGlow, vUv).rgb * strength; gl_FragColor = vec4(c.rgb + g * (1.0 - c.rgb) * (1.0 - c.rgb), c.a); }',
};
function glowSources(scene, st) {
  if (st.glowScene === scene && st.glowAge-- > 0) return st.glowList;
  st.glowScene = scene; st.glowAge = 30; st.glowList = [];
  scene.traverse((o) => { if ((o.isMesh || o.isSprite || o.isPoints) && givesLight(o, Array.isArray(o.material) ? o.material[0] : o.material)) st.glowList.push(o); });
  return st.glowList;
}
/* draws the lights alone into st.gcomp's buffer: every other mesh black (or hidden, if see-through, a sprite or points), no fog, a black background */
function drawGlow(renderer, scene, camera, st) {
  const lights = glowSources(scene, st); let any = false;
  _pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _fr.setFromProjectionMatrix(_pm);
  for (const o of lights) {      /* only when a light is shown and on screen: otherwise the whole extra drawing is skipped (most daytime frames) */
    let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; }
    if (v && (o.isSprite ? _fr.intersectsSprite(o) : _fr.intersectsObject(o))) { any = true; break; }
  }
  if (!any) return false;
  const swapped = [], hidden = [], keep = new Set(lights), bg = scene.background, fog = scene.fog;
  scene.traverseVisible((o) => {
    if (keep.has(o) || !(o.isMesh || o.isSprite || o.isPoints || o.isLine)) return;
    const m = o.material, m0 = Array.isArray(m) ? m[0] : m;
    if (!o.isMesh || !m0 || (m0.transparent && !(m0.alphaTest > 0)) || m0.colorWrite === false || o.name === 'skyGlow') { hidden.push(o); return; }   /* a cut-out (alphaTest: gate bars, balustrades, leaves) stays in the black pass with its holes (darkFor), so it still hides a light behind it; only truly see-through things are hidden */
    swapped.push([o, m]); o.material = Array.isArray(m) ? m.map(darkFor) : darkFor(m);
  });
  for (const o of hidden) o.visible = false;
  scene.background = null; scene.fog = null;
  try { st.gcomp.render(); } finally {
    for (const [o, m] of swapped) o.material = m;
    for (const o of hidden) o.visible = true;
    scene.background = bg; scene.fog = fog;
  }
  return true;
}

function composerFor(renderer, scene, camera, st) {
  const pr = renderer.getPixelRatio(), size = renderer.getSize(new THREE.Vector2());
  if (!st.comp) {
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });   /* keeps the anti-aliasing the canvas had */
    rt.__look = true;   /* materials write display colour into it, as to the screen (toneInPass) */
    st.comp = new EffectComposer(renderer, rt); for (const t of [st.comp.renderTarget1, st.comp.renderTarget2]) t.__look = true;   /* the scene may be drawn into either */
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
    if (LOOK.glow) {      /* the lights' own buffer, half size, blurred; then added to the picture */
      const grt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }); grt.__look = true;
      st.gcomp = new EffectComposer(renderer, grt); for (const t of [st.gcomp.renderTarget1, st.gcomp.renderTarget2]) t.__look = true;
      st.gcomp.renderToScreen = false; st.grp = new RenderPass(scene, camera); st.grp.clearColor = new THREE.Color(0, 0, 0); st.grp.clearAlpha = 1; st.gcomp.addPass(st.grp);
      st.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), Q.has('glowview') ? 3 : 0.28, 0.3, 0.25);   /* soft and close to each light: at 0.55 a lit window shone like a floodlight (owner, 24 November 2026: "isnt this a bit too bright") */ st.gcomp.addPass(st.bloom);
      st.glowMix = new ShaderPass(GlowMixShader); st.comp.addPass(st.glowMix);
    }
    st.grade = new ShaderPass(GradeShader); st.comp.addPass(st.grade);
    st.w = st.h = st.pr = 0;
  }
  if (size.x !== st.w || size.y !== st.h || pr !== st.pr) { st.comp.setPixelRatio(pr); st.comp.setSize(size.x, size.y); if (st.gcomp) { st.gcomp.setPixelRatio(pr * 0.5); st.gcomp.setSize(size.x, size.y); }   /* half size: a quarter lost the glazing bars and left blocky edges */ st.w = size.x; st.h = size.y; st.pr = pr; }
  st.rp.scene = scene; st.rp.camera = camera;
  if (st.ao) { st.ao.scene = scene; st.ao.camera = camera; st.ao.enabled = LOOK.ao; }
  if (st.gcomp) {
    st.grp.scene = scene; st.grp.camera = camera;
    const on = LOOK.glow && drawGlow(renderer, scene, camera, st);
    st.glowMix.enabled = on; if (on) { st.glowMix.uniforms.tGlow.value = st.gcomp.readBuffer.texture; st.glowMix.uniforms.strength.value = 1; }
  }
  const u = st.grade.uniforms; u.gain.value.copy(MOOD.gain); u.lift.value.copy(MOOD.lift); u.sat.value = MOOD.sat; u.contrast.value = MOOD.contrast; u.vig.value = MOOD.vig;
  if (!LOOK.grading) { u.gain.value.set(1, 1, 1); u.lift.value.set(0, 0, 0); u.sat.value = 1; u.contrast.value = 1; u.vig.value = 0; }   /* the last pass always runs: it hands the picture to the screen */
  return st.comp;
}

/* ---------- 8. the sky: the sun, its halo and the glow of the horizon ---------- */
/* over whatever sky a game draws, a large dome round the camera adds light where the sky shows (nothing nearer is in front, so buildings, hills and trees
   hide it): a sun disc with a soft halo (blooming on computers), and when the sun is low a warm glow along the horizon on its side, as at sunrise and sunset;
   at night (the game's sun is then the moonlight) only a faint halo. Colours and strength come from the place's own sun. A game's own moon, stars and
   clouds stay. ?nosun to compare. */
const SKYGLOW = {
  uniforms: { sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() }, disc: { value: 1 }, low: { value: 0 }, halo: { value: 1 } },
  vertexShader: 'varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform vec3 sunDir, sunCol; uniform float disc, low, halo; varying vec3 vDir;
    void main() { vec3 d = normalize(vDir); float c = max(dot(d, sunDir), 0.0);
      float g = halo * (0.11 * pow(c, 10.0) + 0.3 * pow(c, 80.0)) + disc * smoothstep(0.99955, 0.99975, c) * 6.0;
      vec2 h = normalize(d.xz + 1e-5), s = normalize(sunDir.xz + 1e-5);
      g += low * exp(-abs(d.y + 0.02) * 9.0) * pow(max(dot(h, s), 0.0), 2.0) * 0.55;
      gl_FragColor = vec4(sunCol * g * step(-0.05, d.y), 1.0); }`,
};
function skyGlow(scene, camera, st) {
  if (Q.has('nosun')) return;
  if (!st.glowSky) {
    const m = new THREE.ShaderMaterial({ ...SKYGLOW, uniforms: THREE.UniformsUtils.clone(SKYGLOW.uniforms), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, depthTest: true, fog: false, side: THREE.BackSide });
    st.glowSky = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), m);
    Object.assign(st.glowSky, { frustumCulled: false, renderOrder: -1, name: 'skyGlow' }); st.glowSky.raycast = () => {};
    st.glowSky.userData.noAudit = st.glowSky.userData.noAO = st.glowSky.userData.noShadow = true;
  }
  const g = st.glowSky; if (g.parent !== scene) scene.add(g);
  const sun = st.sun; g.visible = !!(sun && sun.intensity > 0 && camera.isPerspectiveCamera);
  if (!g.visible) return;
  const r = camera.far * 0.9; g.scale.setScalar(r); g.position.copy(camera.position);
  const u = g.material.uniforms, d = u.sunDir.value.copy(sun.position); if (sun.target) d.sub(sun.target.position); if (d.lengthSq() < 1e-6) d.set(0, 1, 0); d.normalize();
  const moon = sun.color.b > sun.color.r + 0.02;   /* a blue light is the game's moonlight: no sun disc, no glow on the horizon (it drew a second moon) */
  const night = moon ? 1 : 1 - Math.min(1, sun.intensity / 1.2), warm = Math.max(0, sun.color.r - sun.color.b);
  u.sunCol.value.copy(sun.color).multiplyScalar(Math.min(1.5, sun.intensity / 2));
  u.disc.value = (1 - night) * (d.y > -0.02 ? 1 : 0);
  u.halo.value = moon ? 0 : 1 - 0.6 * night;
  u.low.value = (1 - night) * Math.min(1, Math.max(0, (0.45 - d.y) / 0.35)) * Math.min(1, warm / 0.3 + 0.2);
}

/* ---------- the frame ---------- */
export function draw(renderer, scene, camera) {
  let st = ST.get(renderer); if (!st) ST.set(renderer, (st = { seen: 0 }));
  if (CAM) { camera.position.set(CAM[0], CAM[1], CAM[2]); camera.lookAt(CAM[3], CAM[4], CAM[5]); camera.updateMatrixWorld(); }
  const now = performance.now(), dt = Math.min(0.1, (now - (st.last || now)) / 1000); st.last = now;
  const h = LOOK.sky ? sky(renderer, scene, st) : (lightsOf(scene, st), null);
  if (st.sun) {
    const d = HAZE.fogSunDir.value.copy(st.sun.position); if (st.sun.target) d.sub(st.sun.target.position); if (d.lengthSq() > 1e-6) d.normalize();
    HAZE.fogSunColor.value.copy(st.sun.color).multiplyScalar(Math.min(1, st.sun.intensity / 2.5));
  } else HAZE.fogSunColor.value.setRGB(0, 0, 0);
  easeMood(st, dt);
  skyGlow(scene, camera, st);
  if (!Q.has('nocontact')) contactShadows(scene, !renderer.shadowMap.enabled || !st.sun || !st.sun.castShadow);   /* 5. a soft shadow under people where no sun shadow is drawn */
  let e0, i0, hi0;
  if (h) {
    e0 = scene.environment; i0 = scene.environmentIntensity; hi0 = h.intensity;
    const own = e0 && e0 !== st.env ? (i0 || 0) * 0.47 : 0;   /* a game's own faint gradient sky, folded in (its colours are about half as bright as the hemisphere's) */
    scene.environment = st.env; scene.environmentIntensity = (hi0 * SKY_SHARE) / Math.PI + own; h.intensity = hi0 * (1 - SKY_SHARE);
  }
  if (PERF.drops > 0 && LOOK.ao) { LOOK.ao = false; LOOK.aoOff = 'slow frames'; }
  else if (PERF.drops > 1 && LOOK.glow) { LOOK.glow = false; LOOK.aoOff = 'slow frames'; }
  else if (PERF.drops > 1 && LOOK.grading && isPhone()) { LOOK.grading = false; LOOK.aoOff = 'slow frames'; }   /* on a phone the grade is the one extra pass: it goes before the picture gets coarser */
  try {
    if (LOOK.post && camera.isPerspectiveCamera && (LOOK.ao || LOOK.glow || LOOK.grading || Q.has('forcepost'))) {
      /* three gives the background colour and the fog colour in display colour only when drawing to the screen: for the extra pass they are converted here
         (the materials make display colour themselves, toneInPass), and put back after */
      const bg = scene.background && scene.background.isColor ? scene.background : null, fc = scene.fog && scene.fog.color, b0 = bg && bg.clone(), f0 = fc && fc.clone();
      if (bg) bg.convertLinearToSRGB(); if (fc && fc !== bg) fc.convertLinearToSRGB();   /* a game may use one colour object for both (Bog Walk): once only */
      try { composerFor(renderer, scene, camera, st).render(); } finally { if (bg) bg.copy(b0); if (fc && fc !== bg) fc.copy(f0); }
    }
    else renderer.render(scene, camera);
  } catch (err) {
    LOOK.post = false; LOOK.aoOff = String(err && err.message || err); renderer.setRenderTarget(null); renderer.render(scene, camera);
  } finally {
    if (h) { scene.environment = e0; scene.environmentIntensity = i0; h.intensity = hi0; }
  }
}
