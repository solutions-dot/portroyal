/* Downloads recorded clips for voice-lines.json, in order, and keeps games/<game>/site/voices/index.json (text -> clip) up to date.
   node tools/audio/fetch-lines.mjs <game> <first-index> [voice-cast.json] < ids     ids: Cartesia link ids (the part after link_), whitespace separated, one per line of voice-lines.json starting at first-index. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [game, first = "0", file = "voice-lines.json"] = process.argv.slice(2);
const root = new URL("../../games/", import.meta.url).pathname;
const lines = JSON.parse(readFileSync(`${root}${game}/${file}`, "utf8"));
const ids = readFileSync(0, "utf8").split(/\s+/).filter(Boolean);
const dir = `${root}${game}/site/voices/`; mkdirSync(dir, { recursive: true });
const idxFile = dir + "index.json"; const index = existsSync(idxFile) ? JSON.parse(readFileSync(idxFile, "utf8")) : {};
let ok = 0;
const url = (id) => `https://files.cartesia.ai/link/link_${id}`;
const status = (id) => { try { return execFileSync("curl", ["-s", "-o", "/dev/null", "-w", "%{http_code}", "-I", url(id)]).toString(); } catch { return "000"; } };
/* a copied link id may have a swapped or dropped character: try those fixes (a link that answers 200 is the one) */
function repair(id) {
  const tries = [];
  for (let i = 0; i < id.length - 1; i++) tries.push(id.slice(0, i) + id[i + 1] + id[i] + id.slice(i + 2));
  for (let i = 0; i < id.length; i++) tries.push(id.slice(0, i) + id.slice(i + 1));
  return tries.find((t) => status(t) === "200") || null;
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
