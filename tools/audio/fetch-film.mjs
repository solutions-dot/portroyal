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
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/* a copied link id may have a swapped, moved, dropped or wrong character: try all of those at once, 32 requests in parallel (a link that answers 200 is the one) */
const repair = (id) => {
  const c = new Set();
  for (let i = 0; i < id.length - 1; i++) c.add(id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2));
  for (let i = 0; i < id.length; i++) { const r = id.slice(0, i) + id.slice(i + 1); c.add(r); for (let j = 0; j <= r.length; j++) c.add(r.slice(0, j) + id[i] + r.slice(j)); }
  for (let i = 0; i < id.length; i++) for (const ch of A) if (ch !== id[i]) c.add(id.slice(0, i) + ch + id.slice(i + 1));
  c.delete(id);
  try { const out = execFileSync("sh", ["-c", "xargs -P 32 -n1 " + new URL("./probe.sh", import.meta.url).pathname], { input: [...c].join("\n"), maxBuffer: 1 << 20 }).toString(); const m = out.split("\n").find((l) => l.startsWith("200 ")); return m ? m.slice(4).trim() : null; } catch { return null; }
};
let done = 0;
ids.forEach((id, i) => {
  const k = keys[+first + i]; if (!k) return console.log("NO KEY", id);
  const f = `${root}${game}/site/voices/narrator-${k}.mp3`;
  const get = (x) => execFileSync("curl", ["-s", "-L", "--fail", "-o", f, url(x)], { stdio: "pipe" });
  try { get(id); done++; } catch { const x = repair(id); if (!x) return console.log("FAILED", +first + i, k); get(x); done++; console.log("repaired", +first + i); }
});
console.log(game, done + "/" + ids.length);
