// Reading-level check for the Nanny game: node tools/nanny/readcheck.mjs games/nanny/src/content.js
//   flags dialogue and narration over 12 words, goals over 14, journal "simple" lines over 16, any em or en dash, repeated or missing journal pages.
import { pathToFileURL } from 'node:url'; import { readFileSync } from 'node:fs';
const f = process.argv[2], C = await import(pathToFileURL(f).href), wc = (t) => t.trim().split(/\s+/).length, out = [];
const src = readFileSync(f, 'utf8'); if (/\u2014|\u2013/.test(src)) out.push('DASH: an em or en dash is in the file');
for (const [id, fn] of Object.entries(C.TALK)) for (const s of [{}, { job: 'watch' }, { job: 'garden' }]) for (const l of fn(s)) { if (wc(l.text) > 12) out.push(`TALK ${id} (${wc(l.text)}): ${l.text}`); for (const c of l.choices || []) { if (wc(c.t) > 8) out.push(`CHOICE ${id} (${wc(c.t)}): ${c.t}`); for (const t of c.then || []) if (wc(t.text) > 12) out.push(`TALK ${id} then (${wc(t.text)}): ${t.text}`); } }
for (const [id, fn] of Object.entries(C.LATER)) for (const t of fn({})) if (wc(t) > 12) out.push(`LATER ${id} (${wc(t)}): ${t}`);
for (const [k, v] of Object.entries(C.SAY)) for (const t of [].concat(v)) if (wc(t) > 12) out.push(`SAY ${k} (${wc(t)}): ${t}`);
for (const [k, fn] of Object.entries(C.GOALS)) { const t = fn({}); if (wc(t) > 14) out.push(`GOAL ${k} (${wc(t)}): ${t}`); }
for (const p of C.JOURNAL) for (const t of p.simple) if (wc(t) > 16) out.push(`JOURNAL ${p.id} simple (${wc(t)}): ${t}`);
for (const [k, c] of Object.entries(C.CARDS)) for (const t of c.paras) if (wc(t) > 22 && !/^"/.test(t)) out.push(`CARD ${k} (${wc(t)}): ${t}`);
const ids = C.JOURNAL.map((p) => p.id); if (new Set(ids).size !== ids.length) out.push('JOURNAL ids repeat');
const un = new Set(); for (const fn of Object.values(C.TALK)) for (const l of fn({})) if (l.unlock) un.add(l.unlock); for (const u of un) if (!ids.includes(u)) out.push('unlock of a missing page: ' + u);
console.log(out.length ? out.join('\n') : 'reading level: all lines are within the limits'); console.log('pages:', ids.length, 'unlocked by talk:', [...un].length);
