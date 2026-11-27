/* Lists every card, spoken line and look line a game really shows (owner, 27 November 2026), by playing the dev build with the autoplayer.
   node tools/audio/collect-text.mjs <game> [--write]    needs the repo served on :8765 and a dev build (node tools/build.mjs <game> --dev).
   Prints kind<TAB>text; --write saves games/<game>/story-text.json. Then make voice-lines.json from the card and look lines (see docs/AUDIO.md). */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const game = process.argv[2], url = `http://localhost:8765/games/${game}/site/index.html?auto=1`;
const dom = execFileSync("google-chrome", ["--headless=new", "--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--window-size=320,240", "--virtual-time-budget=" + (process.env.BUDGET || "280000"), "--dump-dom", url], { encoding: "utf8", maxBuffer: 1 << 28, timeout: 600000, stdio: ["ignore", "pipe", "ignore"] });
const m = dom.match(/<pre id="storytext"[^>]*>([\s\S]*?)<\/pre>/);
const rows = (m ? m[1] : "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").split("\n").filter(Boolean).map((l) => { const [kind, ...t] = l.split("\t"); return { kind, text: t.join("\t") }; });
for (const r of rows) console.log(r.kind + "\t" + r.text);
console.log(rows.length, "texts:", ["card", "line", "look"].map((k) => k + " " + rows.filter((r) => r.kind === k).length).join(", "));
if (process.argv.includes("--write")) writeFileSync(new URL(`../../games/${game}/story-text.json`, import.meta.url), JSON.stringify(rows, null, 1) + "\n");
