/* engine/door.js: the parts of a door (owner, 17 November 2026: "this doesn't look like a door", a flat brown board on a wall).
   NOT one door for everything: "the doors should fit their purpose, not one shared one" (owner, same day). Each building's door is chosen and sized
   for that building, its use, its time and place, from sources where they exist (CLAUDE.md rule 3); this file only saves drawing frames, panels and handles again.
   A door reads as a door from a few things, all here: a frame that stands out from the wall, a leaf set back into the opening, panels or boards
   that catch the light, a handle at hand height, and a step or sill at the foot. Each game picks the kind that fits its time and place.

   makeDoor(opts) returns a THREE.Group. Its origin is the middle of the foot of the opening, on the wall's outer face; the door faces +z
   (turn the group to face the street). Nothing in it sticks out more than `out` (the frame's depth, 5 cm), so it can stand on any wall.
     w, h       the opening, in metres (default 0.95 by 2.1)
     kind       'panel'   four raised panels (a house or office door, 19th and 20th century)
                'six'     six raised panels (a Georgian door: Port Royal, Spanish Town)
                'plank'   upright boards with ledges (a shack, a store, a yard door)
                'glazed'  glass in the upper half, a solid panel below (a shop, a station, a clinic)
                'flush'   one plain face with a thin edge line (a 1960s to today block of flats)
                'louvre'  slatted, to let air through (a Caribbean house, a school)
     leaves     1 or 2 (two leaves meet in the middle; each gets its own handle)
     color      the leaf (default a varnished brown); frame: the frame (default off-white); glass: the glass colour
     handle     'knob' | 'lever' | 'ring' | 'latch' | 'pull' | 'none'   (default: knob, latch for plank, pull for glazed)
     recess     how far the leaf is set back into a real opening in the wall (default 0: the wall is solid, the leaf stands on its face, framed)
     step       height of a step at the foot (default 0: only a sill); open: how far the leaf (or both) is swung: 0 to 1 swings it OUT, towards +z (negative swings it in; Garvey's room doors rely on this)
     rough      material roughness for the leaf (default 0.7)
   The materials are MeshStandardMaterial, named Door, DoorFrame, DoorGlass, DoorMetal (the audit and tint code can find them by name). */
import * as THREE from 'three';
import { doorSound } from './audio.js';

const MATS = new Map();
function mat(name, color, rough = 0.7, metal = 0, extra = {}) {
  const k = name + color + rough + metal + JSON.stringify(extra); if (MATS.has(k)) return MATS.get(k);
  const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra }); m.name = name; MATS.set(k, m); return m;
}
const B = (g, m, w, h, d, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };

/* one leaf, lw wide and lh high, its hinge side at x = 0 and its face at z = 0 (it lies from z = -t to 0), opening towards -z */
function leaf(o, lw, lh, M, hingeLeft) {
  const g = new THREE.Group(), t = 0.045, side = hingeLeft ? 1 : -1, cx = side * lw / 2, rail = Math.min(0.12, lw * 0.14), rs = 0.012;
  const panelRow = (y0, y1, cols) => {   /* raised panels between stiles and rails: the panel stands 1 cm proud, with a bevel line round it */
    const inner = lw - 2 * rail - (cols - 1) * rail * 0.8, pw = inner / cols;
    for (let c = 0; c < cols; c++) { const x = side * (rail + pw / 2 + c * (pw + rail * 0.8)); B(g, M.leaf, pw - 0.03, y1 - y0 - 0.03, 0.012, x, (y0 + y1) / 2, rs); B(g, M.shade, pw, y1 - y0, 0.004, x, (y0 + y1) / 2, 0.002); }
  };
  B(g, M.leaf, lw, lh, t, cx, lh / 2, -t / 2);   /* the leaf itself */
  const k = o.kind;
  if (k === 'panel' || k === 'six') {
    const rows = k === 'six' ? [[0.1, 0.36], [0.4, 0.72], [0.76, 0.93]] : [[0.1, 0.45], [0.5, 0.92]];
    for (const [a, b] of rows) panelRow(lh * a, lh * b, lw > 0.7 ? 2 : 1);
  } else if (k === 'plank') {
    const n = Math.max(3, Math.round(lw / 0.14)), bw = lw / n;
    for (let i = 0; i < n; i++) { const x = side * (bw / 2 + i * bw); B(g, i % 2 ? M.leaf : M.leaf2, bw - 0.008, lh - 0.01, 0.008, x, lh / 2, 0.004); }   /* boards, a dark gap between each */
    for (const y of [0.18, 0.82]) B(g, M.leaf2, lw - 0.06, 0.12, 0.022, cx, lh * y, 0.012);   /* ledges across */
  } else if (k === 'glazed') {
    const gy0 = lh * 0.42, gy1 = lh - rail; B(g, M.glass, lw - 2 * rail, gy1 - gy0, 0.01, cx, (gy0 + gy1) / 2, 0.003);
    B(g, M.leaf, 0.025, gy1 - gy0, 0.016, cx, (gy0 + gy1) / 2, 0.008);   /* a glazing bar down the middle */
    panelRow(lh * 0.08, lh * 0.38, 1);
  } else if (k === 'flush') {
    B(g, M.shade, lw - 0.06, lh - 0.06, 0.003, cx, lh / 2, 0.001); B(g, M.leaf, lw - 0.075, lh - 0.075, 0.004, cx, lh / 2, 0.003);
    B(g, M.metal, 0.12, 0.012, 0.004, cx, lh * 0.7, 0.004);   /* a letter plate */
  } else if (k === 'louvre') {
    const y0 = lh * 0.1, y1 = lh * 0.92, n = Math.round((y1 - y0) / 0.07);
    for (let i = 0; i < n; i++) { const s = B(g, i % 2 ? M.leaf : M.leaf2, lw - 2 * rail, 0.06, 0.012, cx, y0 + (i + 0.5) * (y1 - y0) / n, 0.004); s.rotation.x = -0.6; }
  }
  /* the handle, on the side away from the hinge, at about 1 m */
  const hx = side * (lw - 0.08), hy = Math.min(1.0, lh * 0.48), H = o.handle;
  if (H === 'knob') { const kn = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), M.metal); kn.position.set(hx, hy, 0.05); g.add(kn); B(g, M.metal, 0.05, 0.12, 0.008, hx, hy - 0.02, 0.006); B(g, M.metal, 0.012, 0.012, 0.045, hx, hy, 0.028); }
  else if (H === 'lever') { B(g, M.metal, 0.045, 0.16, 0.008, hx, hy, 0.006); B(g, M.metal, 0.012, 0.012, 0.05, hx, hy + 0.03, 0.03); B(g, M.metal, 0.12, 0.018, 0.018, hx - side * 0.05, hy + 0.03, 0.055); }
  else if (H === 'ring') { const r = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 16), M.metal); r.position.set(hx, hy, 0.02); g.add(r); B(g, M.metal, 0.05, 0.05, 0.01, hx, hy + 0.05, 0.008); }
  else if (H === 'latch') { B(g, M.metal, 0.03, 0.15, 0.02, hx, hy, 0.02); B(g, M.metal, 0.14, 0.018, 0.012, hx - side * 0.06, hy + 0.09, 0.016); }
  else if (H === 'pull') B(g, M.metal, 0.025, 0.32, 0.025, hx, hy + 0.08, 0.035);
  /* hinges on the hinge side (outward-opening doors show them; inward ones barely do: a thin dark line is enough) */
  for (const y of [0.15, lh - 0.2]) B(g, M.shade, 0.012, 0.1, 0.004, side * 0.006, y, 0.002);
  g.userData.side = side; return g;
}

export function makeDoor(opts = {}) {
  const o = { w: 0.95, h: 2.1, kind: 'panel', leaves: 1, color: 0x6a4a30, frame: 0xefeae0, glass: 0x2a3640, handle: null, step: 0, open: 0, rough: 0.7, out: 0.05, ...opts };
  if (!o.handle) o.handle = o.kind === 'plank' ? 'latch' : o.kind === 'glazed' ? 'pull' : 'knob';
  const c = new THREE.Color(o.color), dark = c.clone().multiplyScalar(0.72), shade = c.clone().multiplyScalar(0.45);
  const M = { leaf: mat('Door', c.getHex(), o.rough), leaf2: mat('Door', dark.getHex(), o.rough), shade: mat('Door', shade.getHex(), 0.9),
    frame: mat('DoorFrame', o.frame, 0.8), metal: mat('DoorMetal', o.metal ?? 0x8a7a50, 0.4, 0.7), glass: mat('DoorGlass', o.glass, 0.15, 0.3, { transparent: false }), dark: mat('DoorFrame', 0x1c1a18, 1) };
  const g = new THREE.Group(); g.name = 'Door';
  const fw = 0.09, set = o.recess || 0;   /* frame width, and how far the leaf is set back from the wall face (only where the wall has a real opening) */
  /* a real opening: a dark reveal behind and round the leaf, so the door sits in a hole in the wall */
  if (set > 0) { B(g, M.dark, o.w, o.h, 0.01, 0, o.h / 2, -set - 0.06);
  B(g, M.shade, 0.02, o.h, set, -o.w / 2 + 0.01, o.h / 2, -set / 2); B(g, M.shade, 0.02, o.h, set, o.w / 2 - 0.01, o.h / 2, -set / 2); B(g, M.shade, o.w, 0.02, set, 0, o.h - 0.01, -set / 2); }
  /* the frame (architrave) round the opening, standing out from the wall, with a head a little deeper */
  B(g, M.frame, fw, o.h + fw, o.out, -o.w / 2 - fw / 2, (o.h + fw) / 2, o.out / 2); B(g, M.frame, fw, o.h + fw, o.out, o.w / 2 + fw / 2, (o.h + fw) / 2, o.out / 2);
  B(g, M.frame, o.w + 2 * fw + 0.06, fw + 0.02, o.out + 0.015, 0, o.h + fw / 2 + 0.01, (o.out + 0.015) / 2);
  /* the sill or step */
  if (o.step > 0) B(g, M.frame, o.w + 2 * fw + 0.2, o.step, 0.32, 0, o.step / 2, 0.165); else B(g, M.frame, o.w + 0.04, 0.03, 0.08, 0, 0.015, 0.045);   /* in front of the wall face, never into the wall (the audit found a step 7 cm into one) */
  /* the leaves, hung at the back of the reveal */
  const y0 = o.step > 0 ? o.step : 0.03, lh = o.h - y0 - 0.005, n = o.leaves === 2 ? 2 : 1, lw = (o.w - 0.01) / n;
  for (let i = 0; i < n; i++) {
    const hingeLeft = i === 0, L = leaf(o, lw - 0.004, lh, M, hingeLeft); L.position.set(hingeLeft ? -o.w / 2 + 0.005 : o.w / 2 - 0.005, y0, set > 0 ? -set : 0.047);   /* on a solid wall the leaf stands just proud of it, inside the deeper frame */
    L.rotation.y = (hingeLeft ? 1 : -1) * -o.open * 1.4; g.add(L);
  }
  return g;
}

/* swingDoor(leaves, open, dt, opts): eases a door's leaves (the groups makeDoor puts in it, or a list of them) open or shut, and makes the sound:
   a latch and a creak as it starts to open, a soft thud as it shuts (engine/audio.js doorSound; 22 November 2026, every game).
   angle: how far each leaf turns, times its hinge side (leaf.userData.side; Garvey's hall uses +1.55, inward), rate: radians a second, sound: false to keep quiet, pan. */
export function swingDoor(leaves, open, dt, { angle = 1.55, rate = 3.8, sound = true, pan = 0 } = {}) {
  const L = Array.isArray(leaves) ? leaves : leaves.children.filter((c) => c.isGroup && c.userData.side); if (!L.length) return;
  const st = L[0].userData.swing || (L[0].userData.swing = { open: null, moving: false });
  if (st.open !== null && open !== st.open && open && sound) doorSound('open', pan);
  st.open = open; let left = 0;
  for (const leaf of L) { const target = open ? (leaf.userData.side || 1) * angle : 0, e = target - leaf.rotation.y; leaf.rotation.y += THREE.MathUtils.clamp(e, -rate * dt, rate * dt); left = Math.max(left, Math.abs(target - leaf.rotation.y)); }
  if (!open && st.moving && left < 1e-4 && sound) doorSound('close', pan);
  st.moving = left > 1e-4;
}
