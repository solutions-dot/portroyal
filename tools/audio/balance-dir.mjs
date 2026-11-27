/* The standard level for every spoken clip in every game (owner, 27 November 2026: "this must be a standard").
   node tools/audio/balance-dir.mjs [game ...] [--target -19] [--write]
   Every mp3 in games/<game>/site/voices is brought to -19 LUFS with a -2 dB true-peak ceiling (a clip already within 0.8 dB is left alone).
   A clip that is very quiet (below -27 LUFS, a PC-microphone recording) also gets a 90 Hz high-pass, light hiss reduction and gentle compression first.
   Run it after recording any new clips, then run it again with no --write: it must report 0 to change. Docs: docs/AUDIO.md, "Level balance". */
import { readdirSync, renameSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const args = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--target");
const ti = process.argv.indexOf("--target"), T0 = ti > 0 ? +process.argv[ti + 1] : -19, write = process.argv.includes("--write");
const root = new URL("../../games/", import.meta.url).pathname;
const games = args.length ? args : readdirSync(root).filter((g) => !g.startsWith("_"));
const run = (a) => spawnSync("ffmpeg", ["-nostats", "-hide_banner", ...a], { encoding: "utf8" });
const CLEAN = "highpass=f=90,afftdn=nr=10:nf=-40,acompressor=threshold=-26dB:ratio=3:attack=5:release=90:makeup=2";
const integrated = (p) => { const s = (run(["-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr.split("Summary:")[1]) || ""; const m = s.match(/I:\s+(-?[\d.]+) LUFS/), k = s.match(/Peak:\s+(-?[\d.]+) dBFS/); return m ? { I: +m[1], peak: k ? +k[1] : -99 } : null; };
const TRIM = JSON.parse(readFileSync(new URL("./voice-trim.json", import.meta.url)));   /* per-voice dB offsets for a voice that sounds louder or quieter than it measures */
let changed = 0, kept = 0;
for (const g of games) {
  const d = `${root}${g}/site/voices/`; let files; try { files = readdirSync(d).filter((x) => x.endsWith(".mp3")); } catch { continue; }
  let gc = 0, trimOf = {};
  try { for (const l of JSON.parse(readFileSync(`${root}${g}/voice-cast.json`))) trimOf[l.stem + ".mp3"] = TRIM[l.voice] || 0; } catch { /* no cast file */ }
  for (const f of files) {
    const T = T0 + (trimOf[f] || 0);
    const p = d + f, meas = integrated(p); if (meas === null) continue; const I = meas.I;
    /* within 0.8 dB, or as loud as the -2 dB peak ceiling allows (a peaky clip cannot go higher): leave it */
    if (Math.abs(I - T) <= 0.8 || (I < T && meas.peak >= -2.6)) { kept++; continue; }
    gc++; changed++; if (!write) continue;
    const pre = I < -27 ? CLEAN + "," : "";
    const m1 = run(["-i", p, "-af", `${pre}loudnorm=I=${T}:TP=-2:LRA=7:print_format=json`, "-f", "null", "-"]).stderr, j = m1.slice(m1.lastIndexOf("{"));
    let s; try { s = JSON.parse(j); } catch { console.log("measure failed", g, f); continue; }
    const out = p + ".tmp.mp3", ln = `loudnorm=I=${T}:TP=-2:LRA=7:measured_I=${s.input_i}:measured_TP=${s.input_tp}:measured_LRA=${s.input_lra}:measured_thresh=${s.input_thresh}:offset=${s.target_offset}:linear=true`;
    const r = run(["-y", "-i", p, "-af", `${pre}${ln}`, "-ac", "1", "-ar", "44100", "-b:a", "64k", out]); if (r.status === 0) renameSync(out, p); else console.log("failed", g, f);
  }
  console.log(g.padEnd(13), files.length, "clips,", gc, write ? "balanced" : "to change");
}
console.log(changed, write ? "balanced," : "to change,", kept, "already at the standard");
