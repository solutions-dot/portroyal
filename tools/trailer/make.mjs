/* tools/trailer/make.mjs: put the trailer together from recorded clips (record.mjs), the overlay (overlay.html) and the music (music.py).

     node tools/trailer/make.mjs <edit.json> <frames dir> <music.wav> <out.mp4>      (the repo root served on :8765)

   edit.json: { fps, total, barsFrom, endAt, shots: [{ clip, from, dur, stamp? }], lines: [{ t0, t1, text, cls? }] }
     a shot takes dur seconds of <frames dir>/<clip>/ starting at second `from` of that recording; shots follow one another from 0,
     and anything after the last shot (the end card) is black under the overlay. stamp: { place, year, colour, tilt? }
     portrait: true makes the 1080x1920 cut for Instagram and TikTok: each shot shows a 3:4 window, `pcrop` [x, y, zoom, y2] (else crop), over a blurred copy of itself
   push: 0.08 slowly pushes in on a shot that hardly moves; ui: true shows the game's interface, so the letterbox bars stay off; phone: true puts a phone recording in a phone over a blurred `bg` clip */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const [editPath, FR, music, outFile] = process.argv.slice(2);
const E = JSON.parse(fs.readFileSync(editPath, 'utf8'));
const PT = !!E.portrait, VW = PT ? 1080 : 1280, VH = PT ? 1920 : 720;
const fps = E.fps || 30, total = Math.round(E.total * fps);
const work = path.join(path.dirname(outFile), 'trailer-work');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(`${work}/seq`, { recursive: true }); fs.mkdirSync(`${work}/ov`, { recursive: true });

/* 1. the picture: the chosen frames of each shot, linked in order */
const black = `${work}/black.jpg`;
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=black:s=${VW}x${VH}`, '-frames:v', '1', black]);
/* a phone shot: the phone's screen in a phone, standing right of centre over a blurred, darkened shot of the same game */
function phoneShot(s, i) {
  const dir = `${work}/phone${i}`, PH = 600, x = 760, y = 60;
  fs.mkdirSync(dir);
  const pf = fs.readdirSync(`${FR}/${s.clip}`).filter((f) => f.endsWith('.jpg')).sort()[0];
  const [pw0, ph0] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', `${FR}/${s.clip}/${pf}`]).toString().trim().split(',').map(Number);
  const pw = Math.round((pw0 * PH) / ph0 / 2) * 2;
  execFileSync('python3', ['-I', '-c', `
from PIL import Image, ImageDraw
pw, ph, b = ${pw}, ${PH}, 14
m = Image.new('L', (pw, ph), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, pw - 1, ph - 1), 34, fill=255); m.save('${dir}/mask.png')
z = Image.new('RGBA', (pw + 2 * b, ph + 2 * b), (0, 0, 0, 0)); d = ImageDraw.Draw(z)
d.rounded_rectangle((0, 0, pw + 2 * b - 1, ph + 2 * b - 1), 46, fill=(14, 16, 20, 255), outline=(70, 74, 82, 255), width=3)
d.rounded_rectangle((pw // 2 + b - 46, b + 10, pw // 2 + b + 46, b + 34), 12, fill=(0, 0, 0, 255))
z.save('${dir}/bezel.png')`]);
  const a = Math.round(s.from * fps), k = Math.round(s.dur * fps), ba = Math.round((s.bgFrom || 0) * fps);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-start_number', String(ba + 1), '-framerate', String(fps), '-i', `${FR}/${s.bg}/f%05d.jpg`,
    '-start_number', String(a + 1), '-framerate', String(fps), '-i', `${FR}/${s.clip}/f%05d.jpg`, '-i', `${dir}/mask.png`, '-i', `${dir}/bezel.png`,
    '-filter_complex', `[0:v]boxblur=18:2,eq=brightness=-0.18:saturation=0.8[b];[1:v]scale=${pw}:${PH},format=rgba[p0];[2:v]format=gray[m];[p0][m]alphamerge[p];` +
      `[b][3:v]overlay=${x - 14}:${y - 14}[b2];[b2][p]overlay=${x}:${y}`, '-frames:v', String(k), '-q:v', '2', `${dir}/f%05d.jpg`]);
  return { dir, files: fs.readdirSync(dir).filter((f) => /^f\d+\.jpg$/.test(f)).sort(), a: 0 };
}
let n = 0, t = 0;
E.stamps = []; E.nobars = [];
for (const [si, s] of E.shots.entries()) {
  if (s.ui || s.phone) E.nobars.push([t, t + s.dur]);   /* gameplay with its interface: no letterbox over it */
  if (s.phone) {
    const P = phoneShot(s, si), k = Math.round(s.dur * fps);
    for (let i = 0; i < k; i++) fs.symlinkSync(path.resolve(`${P.dir}/${P.files[i]}`), `${work}/seq/${String(++n).padStart(5, '0')}.jpg`);
    if (s.stamp) E.stamps.push({ ...s.stamp, t0: t + 0.15, t1: t + s.dur - 0.1 });
    t += s.dur;
    continue;
  }
  let dir = `${FR}/${s.clip}`, files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
  let a = Math.round(s.from * fps);
  const k = Math.round(s.dur * fps);
  if (a + k > files.length) throw new Error(`${s.clip}: wants frames ${a}-${a + k}, has ${files.length}`);
  if (PT) {   /* portrait: a 3:4 window of the shot, 1080x1440 in the middle of the frame, over the same shot blurred and darkened */
    const out = `${work}/pt${si}`; fs.mkdirSync(out);
    const [cx, cy0, cz, cy1 = cy0] = s.pcrop || s.crop || [0.5, 0.5, 1];
    const cy = `(${cy0}+(${cy1}-${cy0})*(0.5-0.5*cos(PI*n/${k})))`;
    const fg = (cz < 1 ? `pad=1920:${Math.round(1080 / cz / 2) * 2}:0:(oh-ih)/2:color=${s.pcolour || 'black'},` : '') + `crop=w=${Math.round(810 / cz)}:h=${Math.round(1080 / cz)}:x='max(0,min(iw-ow,${cx}*iw-ow/2))':y='max(0,min(ih-oh,${cy}*ih-oh/2))',` +
      (s.push ? `scale=2160:2880:flags=lanczos,zoompan=z='1+${s.push}*on/${k}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1440:fps=${fps}` : 'scale=1080:1440:flags=lanczos') + ',unsharp=5:5:0.5';
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-start_number', String(a + 1), '-framerate', String(fps), '-i', `${dir}/f%05d.jpg`,
      '-filter_complex', `[0:v]scale=1920:1080:flags=lanczos,split[a][b];[a]scale=-2:1920,crop=1080:1920:x='max(0,min(iw-1080,${cx}*iw-540))':y=0,boxblur=28:2,eq=brightness=-0.2:saturation=0.85[bg];` +
        `[b]${fg}[fg];[bg][fg]overlay=0:240`, '-frames:v', String(k), '-q:v', '2', `${out}/f%05d.jpg`]);
    dir = out; files = fs.readdirSync(out).sort(); a = 0;
  } else if (s.push || s.crop) {   /* push: a slow push in on a shot that hardly moves (the picture grows by `push`); crop: [x, y, zoom, y2] frames a part of the shot (portrait: a zoom under 1 widens past the frame, the rest filled with `pcolour`), x and y its centre as fractions, y2 a tilt to */
    const out = `${work}/push${si}`; fs.mkdirSync(out);
    const [cx, cy0, cz, cy1 = cy0] = s.crop || [0.5, 0.5, 1], z = `${cz}*(1+${s.push || 0}*on/${k})`;   /* a fourth number tilts the frame from cy0 down to it, eased */
    const cy = `(${cy0}+(${cy1}-${cy0})*(0.5-0.5*cos(PI*on/${k})))`;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-start_number', String(a + 1), '-framerate', String(fps), '-i', `${dir}/f%05d.jpg`,
      '-vf', `scale=2560:1440,zoompan=z='${z}':x='max(0,min(iw-iw/zoom,${cx}*iw-iw/zoom/2))':y='max(0,min(ih-ih/zoom,${cy}*ih-ih/zoom/2))':d=1:s=1280x720:fps=${fps}`, '-frames:v', String(k), '-q:v', '2', `${out}/f%05d.jpg`]);
    dir = out; files = fs.readdirSync(out).sort(); a = 0;
  }
  for (let i = 0; i < k; i++) fs.symlinkSync(path.resolve(`${dir}/${files[a + i]}`), `${work}/seq/${String(++n).padStart(5, '0')}.jpg`);
  if (s.stamp) E.stamps.push({ ...s.stamp, t0: t + 0.15, t1: t + s.dur - 0.1 });
  t += s.dur;
}
while (n < total) fs.symlinkSync(path.resolve(black), `${work}/seq/${String(++n).padStart(5, '0')}.jpg`);
console.log('picture frames', n, 'shots end at', t.toFixed(2), 's');

/* 2. the overlay, one see-through frame at a time */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
await page.goto('http://localhost:8765/tools/trailer/overlay.html');
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
await page.evaluate((e) => window.setEdit(e), E);
for (let i = 0; i < total; i++) {
  await page.evaluate((s) => window.render(s), i / fps);
  await page.screenshot({ path: `${work}/ov/${String(i + 1).padStart(5, '0')}.png`, omitBackground: true });
  if (i % 300 === 0) console.log('overlay', i, '/', total);
}
await browser.close();

/* 3. together, with a light grade (a little warmth and a soft vignette) and the music */
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', `${work}/seq/%05d.jpg`, '-framerate', String(fps), '-i', `${work}/ov/%05d.png`, '-i', music,
  '-filter_complex', `[0:v]eq=contrast=1.06:saturation=1.08:gamma=0.98,colorbalance=rm=0.02:bm=-0.02,vignette=PI/5[v];[v][1:v]overlay=format=auto,format=yuv420p[o]`,
  '-map', '[o]', '-map', '2:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k',
  '-t', String(E.total), outFile], { stdio: 'inherit' });
console.log('wrote', outFile);
