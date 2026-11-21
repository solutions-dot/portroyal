/* tools/wardrobe/view.src.js: draws .glb files (try-ons from tryon.py) from several sides, one row each. Driven by view.mjs. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const q = new URLSearchParams(location.search), files = q.get('files').split(','), views = (q.get('views') || 'front,q34,side,back').split(','), W = +(q.get('w') || 300), H = +(q.get('h') || 520);
const zoom = q.get('zoom') || 'body';   /* body, top (waist up), neck, legs */
const cv = document.createElement('canvas'); document.body.style.margin = 0; document.body.appendChild(cv);
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(W * views.length, H * files.length); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xb9c2c4); scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x8a8068, 1.25)); const sun = new THREE.DirectionalLight(0xfff2dc, 1.9); scene.add(sun, sun.target);
const cam = new THREE.PerspectiveCamera(20, W / H, 0.05, 50), ANG = { front: 0, q34: 0.7, side: Math.PI / 2, back: Math.PI, back34: Math.PI - 0.7 };
(async () => {
  for (let r = 0; r < files.length; r++) {
    const g = await new GLTFLoader().loadAsync(files[r]), m = g.scene; scene.add(m); m.updateMatrixWorld(true);
    m.traverse((o) => { if (o.isMesh) { o.material.side = THREE.DoubleSide; if (q.has('flat')) o.material.flatShading = true; } });
    const box = new THREE.Box3().setFromObject(m), top = box.max.y, bot = box.min.y, ht = top - bot;
    const [y0, y1] = zoom === 'top' ? [bot + ht * 0.5, top] : zoom === 'neck' ? [bot + ht * 0.74, bot + ht * 0.92] : zoom === 'legs' ? [bot, bot + ht * 0.58] : [bot, top];
    const ctr = new THREE.Vector3(0, (y0 + y1) / 2, 0), span = (y1 - y0) * 1.08, d = span / 2 / Math.tan((cam.fov / 2) * Math.PI / 180);
    views.forEach((v, c) => { const a = ANG[v] ?? 0; cam.position.set(Math.sin(a) * d, ctr.y, Math.cos(a) * d); cam.lookAt(ctr); sun.position.set(Math.sin(a + 0.7) * 5, ctr.y + 4, Math.cos(a + 0.7) * 5); sun.target.position.copy(ctr); sun.target.updateMatrixWorld();
      renderer.setScissorTest(true); renderer.setViewport(c * W, (files.length - 1 - r) * H, W, H); renderer.setScissor(c * W, (files.length - 1 - r) * H, W, H); renderer.render(scene, cam); });
    scene.remove(m);
  }
  document.title = 'VIEW done';
})().catch((e) => { document.title = 'VIEW error ' + e.message; });
