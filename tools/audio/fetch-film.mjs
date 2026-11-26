/* Downloads re-recorded film clips in the order of voice-script.json: node tools/audio/fetch-film.mjs <game> <first-index> < ids
   Saves games/<game>/site/voices/narrator-<stem>.mp3 (replacing the old clip). Repairs a link id with a swapped or dropped character. */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [game, first = "0"] = process.argv.slice(2);
const root = new URL("../../games/", import.meta.url).pathname;
const keys = Object.keys(JSON.parse(readFileSync(`${root}${game}/voice-script.json`, "utf8")));
const ids = readFileSync(0, "utf8").split(/\s+/).filter(Boolean);
const url = (id) => `https://files.cartesia.ai/link/link_${id}`;
const ok200 = (id) => { try { return execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "-I", url(id)]).toString() === "200"; } catch { return false; } };
const repair = (id) => { const t = []; for (let i = 0; i < id.length - 1; i++) t.push(id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2)); for (let i = 0; i < id.length; i++) t.push(id.slice(0, i) + id.slice(i + 1)); return t.find(ok200) || null; };
let done = 0;
ids.forEach((id, i) => {
  const k = keys[+first + i]; if (!k) return console.log("NO KEY", id);
  const f = `${root}${game}/site/voices/narrator-${k}.mp3`;
  const get = (x) => execFileSync("curl", ["-s", "-L", "--fail", "-o", f, url(x)], { stdio: "pipe" });
  try { get(id); done++; } catch { const x = repair(id); if (!x) return console.log("FAILED", +first + i, k); get(x); done++; console.log("repaired", +first + i); }
});
console.log(game, done + "/" + ids.length);
