/* Chapter-end cards (and any other { title, lines|paras } card object in a game's content) not yet in voice-lines.json.
   node tools/audio/end-cards.mjs <game> [--list] [--write]   Walks content.js for objects shaped { title, lines: [...] } or { title, paras: [...] } under a key named end, ending, fin, card or cards. */
import { readFileSync, writeFileSync, existsSync } from "node:fs"; import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const game = process.argv[2], root = new URL(`../../games/${game}/`, import.meta.url).pathname;
const c = await import(root + "src/content.js"), file = root + "voice-lines.json";
const have = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [], known = new Set(have.map((l) => l.key)), norm = (t) => String(t).replace(/\s+/g, " ").trim();
const found = new Map();
const walk = (o, path) => { if (!o || typeof o !== "object") return; const L = Array.isArray(o.lines) ? o.lines : Array.isArray(o.paras) ? o.paras : null;
  if (typeof o.title === "string" && L && L.every((x) => typeof x === "string") && /(^|\.)(end|ending|fin|card|cards|done|finish)(\.|$)/i.test(path)) { const key = norm(o.title + ". " + L.join(" ")); if (!known.has(key)) found.set(key, path); }
  for (const [k, v] of Object.entries(o)) if (v && typeof v === "object") walk(v, path ? path + "." + k : k); };
for (const [k, v] of Object.entries(c)) walk(v, k);
const add = [...found.keys()].map((key) => ({ key, stem: "n-" + createHash("sha1").update(key).digest("hex").slice(0, 8), text: speakText(key), emotion: "neutral", speed: 0.95 }));
console.log(game, add.length, "end cards,", add.reduce((n, o) => n + o.text.length, 0), "chars");
if (process.argv.includes("--list")) add.forEach((a, i) => console.log(i + "|" + a.text));
if (process.argv.includes("--write")) writeFileSync(file, JSON.stringify([...have, ...add], null, 1) + "\n");
