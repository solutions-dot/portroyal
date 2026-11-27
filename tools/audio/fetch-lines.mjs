/* Downloads recorded clips for voice-lines.json, in order, and keeps games/<game>/site/voices/index.json (text -> clip) up to date.
   node tools/audio/fetch-lines.mjs <game> <first-index> [voice-cast.json] < ids     ids: Cartesia link ids (the part after link_), whitespace separated, one per line of voice-lines.json starting at first-index. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [game, first = "0", file = "voice-lines.json", only] = process.argv.slice(2);
const root = new URL("../../games/", import.meta.url).pathname;
let lines = JSON.parse(readFileSync(`${root}${game}/${file}`, "utf8"));
const haveIdx = (() => { try { return JSON.parse(readFileSync(`${root}${game}/site/voices/index.json`, "utf8")); } catch { return {}; } })();
if (only === "missing") lines = lines.filter((l) => !haveIdx[l.key]);   /* first-index then counts only the lines with no clip yet */
const ids = readFileSync(0, "utf8").split(/\s+/).filter(Boolean);
const dir = `${root}${game}/site/voices/`; mkdirSync(dir, { recursive: true });
const idxFile = dir + "index.json"; const index = existsSync(idxFile) ? JSON.parse(readFileSync(idxFile, "utf8")) : {};
let ok = 0;
const url = (id) => `https://files.cartesia.ai/link/link_${id}`;
const status = (id) => { try { return execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "-I", url(id)]).toString(); } catch { return "000"; } };
/* a copied link id may have a swapped or dropped character: try those fixes (a link that answers 200 is the one) */
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function repair(id) {   /* swapped, moved, dropped or wrong character: all tried at once, 32 requests in parallel (tools/audio/probe.sh) */
  const c = new Set();
  for (let i = 0; i < id.length - 1; i++) c.add(id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2));
  for (let i = 0; i < id.length; i++) { const r = id.slice(0, i) + id.slice(i + 1); c.add(r); for (let j = 0; j <= r.length; j++) c.add(r.slice(0, j) + id[i] + r.slice(j)); }
  for (let i = 0; i < id.length; i++) for (const ch of A) if (ch !== id[i]) c.add(id.slice(0, i) + ch + id.slice(i + 1));
  c.delete(id);
  try { const out = execFileSync("sh", ["-c", "xargs -P 32 -n1 " + new URL("./probe.sh", import.meta.url).pathname], { input: [...c].join("\n"), maxBuffer: 1 << 20 }).toString(); const m = out.split("\n").find((l) => l.startsWith("200 ")); return m ? m.slice(4).trim() : null; } catch { return null; }
}
ids.forEach((id, i) => {
  const l = lines[+first + i]; if (!l) return console.log("NO LINE for", id);
  const f = `${dir}${l.stem}.mp3`;
  const get = (x) => execFileSync("curl", ["-s", "-L", "--fail", "-o", f, url(x)], { stdio: "pipe" });
  try { get(id); }
  catch { const fixed = repair(id); if (!fixed) return console.log("FAILED", +first + i, l.stem, l.key.slice(0, 50)); try { get(fixed); console.log("repaired", +first + i); } catch { return console.log("FAILED", +first + i, l.stem); } }
  index[l.key] = l.stem + ".mp3"; ok++;
});
writeFileSync(idxFile, JSON.stringify(index, null, 1) + "\n");
console.log(game, ok + "/" + ids.length, "fetched; index has", Object.keys(index).length);
