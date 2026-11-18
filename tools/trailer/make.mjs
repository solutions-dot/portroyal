/* tools/trailer/make.mjs: put the trailer together from recorded clips (record.mjs), the overlay (overlay.html) and the music (music.py).

     node tools/trailer/make.mjs <edit.json> <frames dir> <music.wav> <out.mp4>      (the repo root served on :8765)

   edit.json: { fps, total, barsFrom, endAt, shots: [{ clip, from, dur, stamp? }], lines: [{ t0, t1, text, cls? }] }
     a shot takes dur seconds of <frames dir>/<clip>/ starting at second `from` of that recording; shots follow one another from 0,
     and anything after the last shot (the end card) is black under the overlay. stamp: { place, year, colour, tilt? } */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const [editPath, FR, music, outFile] = process.argv.slice(2);
const E = JSON.parse(fs.readFileSync(editPath, 'utf8'));
const fps = E.fps || 30, total = Math.round(E.total * fps);
const work = path.join(path.dirname(outFile), 'trailer-work');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(`${work}/seq`, { recursive: true }); fs.mkdirSync(`${work}/ov`, { recursive: true });

/* 1. the picture: the chosen frames of each shot, linked in order */
const black = `${work}/black.jpg`;
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=black:s=1280x720', '-frames:v', '1', black]);
let n = 0, t = 0;
E.stamps = [];
for (const s of E.shots) {
  const files = fs.readdirSync(`${FR}/${s.clip}`).filter((f) => f.endsWith('.jpg')).sort();
  const a = Math.round(s.from * fps), k = Math.round(s.dur * fps);
  if (a + k > files.length) throw new Error(`${s.clip}: wants frames ${a}-${a + k}, has ${files.length}`);
  for (let i = 0; i < k; i++) fs.symlinkSync(path.resolve(`${FR}/${s.clip}/${files[a + i]}`), `${work}/seq/${String(++n).padStart(5, '0')}.jpg`);
  if (s.stamp) E.stamps.push({ ...s.stamp, t0: t + 0.15, t1: t + s.dur - 0.1 });
  t += s.dur;
}
while (n < total) fs.symlinkSync(path.resolve(black), `${work}/seq/${String(++n).padStart(5, '0')}.jpg`);
console.log('picture frames', n, 'shots end at', t.toFixed(2), 's');

/* 2. the overlay, one see-through frame at a time */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
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
