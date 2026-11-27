/* Cards written as card('Title', ['para', 'para'], ...) in a game's own code, added to that game's voice-lines.json (owner, 27 November 2026).
   node tools/audio/card-literals.mjs <game> [--write]  Only cards whose words are plain strings are found (cards built from variables are listed by the dev collector: tools/audio/collect-text.mjs).
   Existing lines (title cards, captions) are kept; each card is one line: its title, then its paragraphs, exactly what SV.card reads. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const game = process.argv[2], dir = new URL(`../../games/${game}/`, import.meta.url).pathname;
const src = readdirSync(dir + "src").filter((f) => f.endsWith(".js")).map((f) => readFileSync(dir + "src/" + f, "utf8")).join("\n");
const file = dir + "voice-lines.json", have = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
const known = new Set(have.map((l) => l.key)), norm = (t) => String(t).replace(/\s+/g, " ").trim();
const unq = (s) => s.replace(/\\(['"`])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const added = [];
for (const m of src.matchAll(/card\(\s*(['"])((?:\\.|(?!\1).)+?)\1\s*,\s*\[((?:\s*(['"`])(?:\\.|(?!\4).)*?\4\s*,?)+)\]/g)) {
  const paras = [...m[3].matchAll(/(['"`])((?:\\.|(?!\1).)*?)\1/g)].map((p) => p[2]);
  if (paras.some((p) => /\$\{/.test(p))) continue;
  if (/^(Reset|Start again|Leave )/.test(unq(m[2]))) continue;   // confirmation prompts, not story
  const key = norm(unq(m[2]) + ". " + paras.map(unq).join(" "));
  if (known.has(key)) continue; known.add(key);
  added.push({ key, stem: "n-" + createHash("sha1").update(key).digest("hex").slice(0, 8), text: speakText(key), emotion: "neutral", speed: 0.95 });
}
console.log(added.length, "cards added,", added.reduce((n, o) => n + o.text.length, 0), "chars");
if (process.argv.includes("--list")) added.forEach((a, i) => console.log(i + "|" + a.text));
if (process.argv.includes("--write")) writeFileSync(file, JSON.stringify([...have, ...added], null, 1) + "\n");
