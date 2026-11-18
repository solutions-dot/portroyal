/* tools/trailer/intro_sound.mjs: render the menu intro's own sound (menu/intro.js) to a WAV, with no speaker.
     node tools/trailer/intro_sound.mjs <out.wav>      (the repo root served on :8765) */
import { createRequire } from 'node:module';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:8765/menu/?intro=1');
await page.waitForFunction(() => window.IntroSting, null, { timeout: 30000 });
const b64 = await page.evaluate(async () => {
  const S = window.IntroSting, sr = 44100, p = S.plan(false), len = Math.ceil((p.end + 4) * sr);
  const ctx = new OfflineAudioContext(2, len, sr);
  S.build(ctx, S.chain(ctx), 0.06, p);
  const buf = await ctx.startRendering(), L = buf.getChannelData(0), R = buf.getChannelData(1);
  const out = new Int16Array(len * 2);
  for (let i = 0; i < len; i++) { out[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767; out[2 * i + 1] = Math.max(-1, Math.min(1, R[i])) * 32767; }
  let s = ''; const u8 = new Uint8Array(out.buffer);
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return [btoa(s), p.end, p.arrive, p.name, p.hold];
});
await browser.close();
const pcm = Buffer.from(b64[0], 'base64'), h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
h.writeUInt32LE(44100, 24); h.writeUInt32LE(44100 * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(process.argv[2], Buffer.concat([h, pcm]));
console.log('intro end', b64[1], 'arrive', b64[2], 'name', b64[3], 'hold', b64[4]);
