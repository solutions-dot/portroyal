/* Evens out and cleans recorded voices (owner, 27 November 2026: the voices recorded on a PC microphone were much quieter than the rest).
   node tools/audio/balance.mjs <game> <voice-cast.json|voice-lines.json> [--target -19] [--only voiceName,voiceName] [--write]
   Each clip: a 90 Hz high-pass (rumble), light hiss reduction, gentle compression, then a two-pass loudness match to the target (LUFS) with a
   -2 dB true-peak ceiling, saved back as mono mp3 (64 kbps, 44.1 kHz). Without --write it only reports. Docs: docs/AUDIO.md. */
import { readFileSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [game, file = "voice-cast.json"] = process.argv.slice(2); const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const T = +arg("--target", -19), only = arg("--only", "") ? arg("--only").split(",") : null, write = process.argv.includes("--write");
const dir = new URL(`../../games/${game}/site/voices/`, import.meta.url).pathname;
const lines = JSON.parse(readFileSync(new URL(`../../games/${game}/${file}`, import.meta.url)));
const PRE = "highpass=f=90,afftdn=nr=10:nf=-40,acompressor=threshold=-26dB:ratio=3:attack=5:release=90:makeup=2";
const run = (a) => spawnSync("ffmpeg", ["-nostats", "-hide_banner", ...a], { encoding: "utf8" });
let n = 0;
for (const l of lines) {
  if (only && !only.includes(l.voiceName)) continue;
  const p = dir + l.stem + ".mp3"; 
  const m1 = run(["-i", p, "-af", `${PRE},loudnorm=I=${T}:TP=-2:LRA=7:print_format=json`, "-f", "null", "-"]).stderr;
  const j = m1.slice(m1.lastIndexOf("{")); let s; try { s = JSON.parse(j); } catch { console.log("measure failed", l.stem); continue; }
  const ln = `loudnorm=I=${T}:TP=-2:LRA=7:measured_I=${s.input_i}:measured_TP=${s.input_tp}:measured_LRA=${s.input_lra}:measured_thresh=${s.input_thresh}:offset=${s.target_offset}:linear=true`;
  if (write) { const out = p + ".tmp.mp3"; const r = run(["-y", "-i", p, "-af", `${PRE},${ln}`, "-ac", "1", "-ar", "44100", "-b:a", "64k", out]); if (r.status === 0) renameSync(out, p); else console.log("failed", l.stem); }
  n++;
}
console.log(n, "clips", write ? "balanced" : "measured only");
