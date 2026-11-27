/* Lines the story tells (no speaker: `who: NAR` or `who: ''`) are read by the Narrator voice through SV.line (engine/storyvoice.js), keyed by their plain text.
   node tools/audio/story-told-lines.mjs <game> [--write]   adds the ones missing from games/<game>/voice-lines.json (stem n-<sha1 8>, neutral, 0.95).
   Owner, 27 November 2026: Marcus Garvey's sourced words stay in his recreated voice; the story's own lines are the narrator's. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const game = process.argv[2], root = new URL(`../../games/${game}/`, import.meta.url).pathname;
const file = root + "voice-lines.json", have = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [], keys = new Set(have.map((l) => l.key));
const clean = (t) => t.replace(/\\(['"])/g, "$1").replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\s+/g, " ").trim();
const add = [];
for (const f of readdirSync(root + "src").filter((f) => f.endsWith(".js"))) {
  const s = readFileSync(root + "src/" + f, "utf8");
  for (const m of s.matchAll(/\{\s*who:\s*(?:NAR|''|""),\s*text:\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")([^}]*)\}/g)) {
    if (/sourced:\s*true/.test(m[3])) continue;   // his real words have their own recreated-voice clips
    const key = clean(m[1] ?? m[2]); if (key.length < 4 || keys.has(key)) continue; keys.add(key);
    add.push({ key, stem: "n-" + createHash("sha1").update(key).digest("hex").slice(0, 8), text: speakText(key), emotion: "neutral", speed: 0.95 });
  }
}
console.log(add.length, "new story-told lines,", add.reduce((n, l) => n + l.text.length, 0), "characters");
if (process.argv.includes("--list")) add.forEach((l, i) => console.log(i + "|" + l.text));
if (process.argv.includes("--write")) writeFileSync(file, JSON.stringify([...have, ...add], null, 1) + "\n");
