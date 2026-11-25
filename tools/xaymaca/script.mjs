/* The readable script of Xaymaca, made from the game's own words: node tools/xaymaca/script.mjs
   Writes docs/games/xaymaca/script.md. Never edit that file by hand: change games/xaymaca/src/content.js (and steps.js) and run this again. */
import { writeFileSync } from "node:fs";
const C = await import("../../games/xaymaca/src/content.js");
const { STEPS, LOOKS, TASKS } = await import("../../games/xaymaca/src/steps.js");
const out = ["# Xaymaca, 1503 to 1504: the script", "", "Made from `games/xaymaca/src/content.js` and `steps.js` by `node tools/xaymaca/script.mjs`. Do not edit by hand.", "", `> ${C.GAME.fiction}`, ""];
for (const ch of C.CHAPTERS) {
  out.push(`## ${C.CHAPTERS.indexOf(ch) + 1}. ${ch.name} (${ch.year})`, "", `*${ch.caption}.* ${ch.intro}`, "");
  for (const [s, row] of Object.entries(STEPS)) {
    if (+s < ch.first || +s > ch.last || row.card === "playing") continue;
    out.push(`**Step ${s}.** Goal: ${row.goal}`, "");
    if (row.film) {
      const F = C.FILMS[row.film], card = C.CARDS[row.film];
      out.push(`*Camera scene: ${F.title}.*${card ? " Card: " + card.lines.join(" ") : ""}`, "");
      for (const [t, line] of F.captions) out.push(`- (${t} s) ${line}`);
      out.push("", `Read instead: ${F.read.join(" ")}`, "");
    }
    for (const id of row.needs?.talk || []) {
      for (const l of C.TALK[s]?.[id] || []) out.push(`- **${l.who}:** ${l.text}`);
      out.push("");
    }
    for (const n of row.needs?.do || []) {
      const id = typeof n === "string" ? n : n.id, L = LOOKS[id], T = TASKS[id];
      if (L) out.push(`*Close-up: ${L.title}.* ${L.say.join(" ")}`, "", ...L.lines.map((x) => `- ${x}`), "");
      if (T) out.push(`*Carry:* ${T.label}, then ${T.put.toLowerCase()}.`, "");
    }
    if (row.card === "quiz") out.push(`*Quiz: ${C.QUIZ.title}*`, "", ...C.QUIZ.items.map((q) => `- ${q.q} (${q.opts.find((o) => o.ok).t}. ${q.why})`), "");
    if (row.card === "end") out.push(`*End card: ${C.CARDS.end.title}.*`, "", ...C.CARDS.end.lines.map((x) => `- ${x}`), "");
  }
}
out.push("## Journal pages", "");
for (const j of C.JOURNAL) out.push(`### ${j.title}`, "", ...j.simple.map((x) => `- ${x}`), "", "Dig deeper:", "", ...j.deeper.map((x) => `- ${x}`), "");
writeFileSync("docs/games/xaymaca/script.md", out.join("\n"));
console.log("wrote docs/games/xaymaca/script.md", out.length, "lines");
