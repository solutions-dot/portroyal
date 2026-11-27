/* Moves film captions later so no clip runs past the next caption (owner, 27 November 2026: the film must not pause for the voice).
   node tools/audio/retime-captions.mjs <game> [--write]. A moved caption keeps its clip by naming it as the third field.
   Only a film whose last caption still ends inside the film's duration is moved; the others are listed. */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const game = process.argv[2], write = process.argv.includes("--write"), GAP = 0.25;
const file = new URL(`../../games/${game}/src/content.js`, import.meta.url).pathname;
const mod = await import(file); let src = readFileSync(file, "utf8");
const films = mod.FILMS || {};
for (const [key, f] of Object.entries(films)) {
  const caps = f.captions || []; if (!caps.length) continue;
  const stem = (c) => c[2] || key + "-" + String(c[0]).replace(".", "_");
  let cur = -1; const plan = [];
  for (const c of caps) {
    let d = 0; try { d = +execFileSync("ffprobe", ["-v", "0", "-show_entries", "format=duration", "-of", "csv=p=0", `${new URL(`../../games/${game}/site/voices/`, import.meta.url).pathname}narrator-${stem(c)}.mp3`]).toString(); } catch {}
    const nt = Math.max(c[0], cur); plan.push([c, Math.round(nt * 10) / 10, stem(c)]); cur = nt + d + GAP;
  }
  const moved = plan.filter(([c, n]) => n > c[0] + 0.01);
  if (!moved.length) continue;
  if (cur > f.duration) { console.log(`${key}: needs ${cur.toFixed(1)}s, film is ${f.duration}s: NOT moved`); continue; }
  console.log(`${key}: moved ${moved.map(([c, n]) => c[0] + "->" + n).join(" ")} (ends ${cur.toFixed(1)} of ${f.duration})`);
  if (write) for (const [c, n, s] of moved) {
    const esc = c[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), re = new RegExp(`\\[\\s*${String(c[0]).replace(".", "\\.")}\\s*,\\s*(["'\`])${esc}\\1(\\s*,\\s*["'][^"']*["'])?\\s*\\]`);
    const m = src.match(re); if (!m) { console.log("  could not find", c[0], c[1]); continue; }
    src = src.replace(re, `[${n}, ${m[1]}${c[1]}${m[1]}, "${s}"]`);
  }
}
if (write) writeFileSync(file, src);
