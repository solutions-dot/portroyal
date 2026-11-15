// Check a packed animation library: node tools/anims/check_clips.mjs [shared/models/anims.js] [--vs old.js]
// For each clip it prints the length, the loop seam (the largest bone turn, in degrees, between the last pose and the first,
// how far the hips travel over the ground, which the game removes for walkers, and how much their height changes, in cm) and whether the clip holds its first pose for a while at the start (a pause at the loop point).
// A clip that loops should have a seam under about 2 degrees. With --vs it also compares each clip that both files hold, pose by pose,
// lined up at their first frame, and prints the largest bone difference in degrees. At the end it lists clips that are the same
// movement as another clip (under 1 degree apart everywhere), which usually means the same Mixamo clip was downloaded twice.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
async function load(f) {
  let doc; if (f.endsWith('.js')) { const m = fs.readFileSync(f, 'utf8').match(/\["([^"]+)"\]="([A-Za-z0-9+/=]{200,})"/); doc = await io.readBinary(new Uint8Array(Buffer.from(m[2], 'base64'))); } else doc = await io.read(f);
  const clips = {};
  for (const a of doc.getRoot().listAnimations()) {
    const tr = {};
    for (const c of a.listChannels()) {
      const s = c.getSampler(), out = s.getOutput(), t = Array.from(s.getInput().getArray()), raw = out.getArray(), k = out.getElementSize();
      const v = Array.from(raw, (x) => out.getNormalized() ? Math.max(x / (raw instanceof Int16Array ? 32767 : raw instanceof Int8Array ? 127 : 1), -1) : x);
      tr[c.getTargetNode().getName().replace('mixamorig:', '') + '.' + c.getTargetPath()] = { t, v, k };
    }
    let t0 = 1e9, t1 = 0; for (const x of Object.values(tr)) { t0 = Math.min(t0, x.t[0]); t1 = Math.max(t1, x.t[x.t.length - 1]); }
    clips[a.getName()] = { tr, t0, t1 };
  }
  return clips;
}
function at(x, time) {   // sample a track, holding its ends (as three.js does)
  const { t, v, k } = x; if (time <= t[0]) return v.slice(0, k); if (time >= t[t.length - 1]) return v.slice((t.length - 1) * k, t.length * k);
  let i = 1; while (t[i] < time) i++; const a = (time - t[i - 1]) / (t[i] - t[i - 1]), p = v.slice((i - 1) * k, i * k), q = v.slice(i * k, (i + 1) * k);
  if (k === 4) { const d = p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3], s = d < 0 ? -1 : 1, r = p.map((pv, j) => pv * (1 - a) + q[j] * s * a), n = Math.hypot(...r); return r.map((y) => y / n); }
  return p.map((pv, j) => pv * (1 - a) + q[j] * a);
}
const ang = (p, q) => { const n1 = Math.hypot(...p), n2 = Math.hypot(...q), d = Math.abs(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3]) / (n1 * n2); return 2 * Math.acos(Math.min(1, d)) * 180 / Math.PI; };
function poseDiff(A, ta, B, tb) {
  let worst = 0, bone = '', dl = 0, dy = 0;
  for (const [n, x] of Object.entries(A.tr)) { const y = B.tr[n]; if (!y) continue;
    if (x.k === 4) { const d = ang(at(x, ta), at(y, tb)); if (d > worst) { worst = d; bone = n.replace('.rotation', ''); } }
    else if (/Hips/.test(n)) { const p = at(x, ta), q = at(y, tb); dl = Math.hypot(p[0] - q[0], p[2] - q[2]); dy = Math.abs(p[1] - q[1]); } }
  return { worst, bone, dl, dy };
}
const args = process.argv.slice(2), vi = args.indexOf('--vs'), old = vi >= 0 ? await load(args[vi + 1]) : null;
const file = args.find((a, i) => !a.startsWith('--') && (vi < 0 || i !== vi + 1)) || 'shared/models/anims.js', clips = await load(file);
for (const [name, c] of Object.entries(clips)) {
  const s = poseDiff(c, c.t1, c, c.t0);
  const hips = c.tr['Hips.rotation'], hold = hips && hips.t.length > 1 && hips.t[0] > 1e-4 ? `starts at ${hips.t[0].toFixed(3)} s (first pose held)` : '';
  let line = `${name.padEnd(18)} ${(c.t1 - c.t0).toFixed(2).padStart(6)} s  seam ${s.worst.toFixed(2).padStart(6)} deg (${s.bone})  hips moved ${(s.dl * 100).toFixed(0)} cm, height ${(s.dy * 100).toFixed(1)} cm ${hold}`;
  if (old && old[name]) { const o = old[name]; let w = 0, wb = ''; const len = Math.min(c.t1 - c.t0, o.t1 - o.t0);
    for (let t = 0; t <= len; t += 1 / 30) { const d = poseDiff(c, c.t0 + t, o, o.t0 + t); if (d.worst > w) { w = d.worst; wb = d.bone; } }
    line += `  vs old: ${w.toFixed(2)} deg (${wb}), length ${(o.t1 - o.t0).toFixed(2)} s`; }
  console.log(line);
}
const names = Object.keys(clips), same = [];
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
  const A = clips[names[i]], B = clips[names[j]], len = A.t1 - A.t0; if (Math.abs(len - (B.t1 - B.t0)) > 0.05) continue;
  let w = 0; for (let t = 0; t <= len && w < 1; t += 0.1) w = Math.max(w, poseDiff(A, A.t0 + t, B, B.t0 + t).worst);
  if (w < 1) same.push(`${names[i]} = ${names[j]} (${w.toFixed(2)} deg)`);
}
console.log(same.length ? 'THE SAME MOVEMENT: ' + same.join(', ') : 'no two clips are the same movement');
