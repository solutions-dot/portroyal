/* Checks every film caption of the games with voice-script.json has a clip, and that each clip fits before the next caption (docs/AUDIO.md section 5).
   node tools/audio/film-voice-check.mjs [game ...]   exit 1 on a missing clip; "OVER" lines are clips longer than their caption window. */
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
const games = process.argv.slice(2).length ? process.argv.slice(2) : ["air-jamaica", "hutchinson", "morant-bay", "rose-hall", "selassie", "shark-papers", "windrush"];
const root = new URL("../../games/", import.meta.url).pathname;
let bad = 0, total = 0;
for (const g of games) {
  const vs = JSON.parse(readFileSync(`${root}${g}/voice-script.json`, "utf8")), keys = Object.keys(vs);
  keys.forEach((k, i) => {
    const f = `${root}${g}/site/voices/narrator-${k}.mp3`; total++;
    if (!existsSync(f)) { bad++; console.log(`MISSING ${g} ${k}`); return; }
    const len = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString();
    const next = keys.slice(i + 1).find((n) => vs[n].film === vs[k].film);
    if (next && vs[k].t + len > vs[next].t) console.log(`OVER ${g} ${k}: ${len.toFixed(1)}s, window ${(vs[next].t - vs[k].t).toFixed(1)}s (the film waits for the clip)`);
  });
}
console.log(`${total} clips checked, ${bad} missing`);
process.exit(bad ? 1 : 0);
