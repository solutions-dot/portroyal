/* The on-screen text The White Witch of Rose Hall's narrator reads: chapter introductions, the fiction note, story cards and the look lines (what you see, then what it means).
   node tools/audio/rose-hall-text.mjs [--write]  writes games/rose-hall/voice-lines.json (key = exact text, stem n-<sha1 8>), as tools/audio/voice-lines.mjs does for other games.
   The look lines and cards play through engine/narrator.js (voices/index.json). Owner, 27 November 2026. */
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { speakText } from "./voice-script.mjs";
const root = new URL("../../games/rose-hall/", import.meta.url).pathname;
const c = await import(root + "src/content.js"), st = await import(root + "src/steps.js");
const keys = new Map(), norm = (t) => String(t).replace(/\s+/g, " ").trim();
const add = (t) => { t = norm(t); if (t.length > 3 && !keys.has(t)) keys.set(t, "n-" + createHash("sha1").update(t).digest("hex").slice(0, 8)); };
/* a card is read as one clip: its title, then its paragraphs (the first chapter's card also has the fiction note) */
c.CHAPTERS.forEach((ch, i) => add(ch.name + ". " + ch.intro + (i === 0 ? " " + c.GAME.fiction : "")));
for (const k of ["told", "mixed", "book", "names", "end"]) add(c.CARDS[k].title + ". " + c.CARDS[k].lines.join(" "));   // the cards that still show (the Watch card is off)
for (const lk of Object.values(st.LOOKS)) for (const l of [...(lk.say || []), ...(lk.lines || [])]) add(l);
const out = [...keys].map(([key, stem]) => ({ key, stem, text: speakText(key), emotion: "neutral", speed: 0.95 }));
console.log(out.length, "lines,", out.reduce((n, o) => n + o.text.split(" ").length, 0), "words");
if (process.argv.includes("--write")) writeFileSync(root + "voice-lines.json", JSON.stringify(out, null, 1) + "\n");
