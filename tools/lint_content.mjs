// Content lint for every game: node tools/lint_content.mjs [--game nanny] [--ci] [--update-baseline] [--json out.json] [--all]
//   Reads every word a game ships (games/<game>/src: content.js when there is one, and the dialogue, goals and journal in every source file) and reports:
//     long      dialogue lines over 12 words (CLAUDE.md rule 2), except a game's allowLong list in tools/checks/<game>.json
//     goal      goals that are not one short sentence
//     dash      em dashes in shipped text, code comments and docs (rule 1)
//     name      a speaker's name spelled two ways
//     fact      years, dates and numbers in the game's words that its facts doc (docs/games/<game>*.md) does not contain (rule 3)
//     real      every line a real person speaks, for a person to check against the sources (the real list in tools/checks/<game>.json)
//     journal   an unlock with no page, a page nothing unlocks, a fictional speaker with no "is fictional" note (rule 3; engine/checks.js journalIssues)
//     sound     a sound name engine/audio.js does not make, or a sound file that is missing
//     rule4     clips from the rule 4 list (falls, doubled over, fights, boxing) named in a game's code, for a person to check (engine/checks.js BANNED)
//   --ci compares with tools/checks/lint-baseline.json and fails only on findings that are not in it (npm test runs this), so a pull request cannot add
//   new ones while the old ones are fixed. --update-baseline rewrites the baseline from what is found now. The baseline must only ever shrink.
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { journalIssues, soundRefIssues, SOUNDS, BANNED, ROLES } from '../engine/checks.js';

export const ROOT = process.cwd();
const read = (p) => readFileSync(p, 'utf8');
const walk = (d, re = /\.(js|mjs)$/) => (!existsSync(d) ? [] : readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p, re) : re.test(f) ? [p] : []; }));

/* ---------- small, tested pieces ---------- */
export const words = (t) => String(t).replace(/\{[^}]*\}/g, 'N').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
const ABBR = /\b(Mr|Mrs|Ms|Dr|St|Mt|Sgt|Capt|Rev|No|Jr|Sr|vs|etc|Lt|Col|Gen|Gov|Ft|a\.m|p\.m|U\.S|J\.A|i\.e|e\.g)\.$/i;
/* sentences in a goal; a leading "Well done!" (or a game's own goalLead) is not counted */
export function sentenceCount(text, lead = ['Well done!', 'Good!', 'Great!', 'Well done.']) {
  let t = String(text).trim(); for (const l of lead) if (t.startsWith(l)) { t = t.slice(l.length).trim(); break; }
  t = t.replace(/:\s*\d+\s+of\s+\d+\.?$/, '.').replace(/\d+\.\d+/g, 'N');
  const parts = []; let cur = '';
  for (const tok of t.split(/(\s+)/)) { cur += tok; if (/[.!?]["”’)]*$/.test(tok) && !ABBR.test(tok.replace(/["”’)]+$/, ''))) { parts.push(cur); cur = ''; } }
  if (cur.trim()) parts.push(cur);
  return parts.filter((p) => /\p{L}{2}/u.test(p)).length;
}
/* every em dash in a file: [{ line, kind: 'text' | 'comment' }] */
export function emDashes(src) { const out = []; src.split('\n').forEach((l, i) => { if (l.includes('\u2014')) out.push({ line: i + 1, kind: /^\s*(\/\/|\/\*|\*|#)/.test(l) ? 'comment' : 'text', at: l.trim().slice(0, 90) }); }); return out; }
export function lev(a, b) { if (a === b) return 0; const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
const normName = (n) => String(n).toLowerCase().replace(/[’`]/g, "'").replace(/\./g, '').replace(/\s+/g, ' ').trim();
/* speakers spelled two ways: the same name with different punctuation or case, or one letter apart */
export function nameIssues(names) {
  const list = [...new Set(names.filter(Boolean).map(String))], out = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j], na = normName(a), nb = normName(b);
    if (na === nb) out.push(`"${a}" and "${b}" are the same name spelled two ways`);
    else if (na.length >= 5 && nb.length === na.length && lev(na, nb) === 1 && !/\d/.test(na + nb)) out.push(`"${a}" and "${b}" differ by one letter: is one misspelt?`);
  }
  return out;
}
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
/* the years, dates and numbers a text states (numbers under 10 and "n of m" counts are left out) */
export function factsIn(text) {
  const t = String(text).replace(/\b\d+\s+of\s+\d+\b/g, ' ').replace(/\{[^}]*\}/g, ' '), out = new Set();
  for (const m of t.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? (${MONTHS})\\b|\\b(${MONTHS}) (\\d{1,2})\\b`, 'g'))) out.add((m[1] || m[4]) + ' ' + (m[2] || m[3]));
  for (const m of t.matchAll(/(?<![\d.,$])\d{1,3}(?:,\d{3})+(?![\d,])|(?<![\d.,:])\d+(?:\.\d+)?(?![\d:])/g)) { const v = m[0]; if (parseFloat(v.replace(/,/g, '')) >= 10) out.add(v); }
  return [...out];
}
/* is a fact in the doc text? a date as "5 August" or "August 5"; a number with or without its thousands commas */
export function factFound(f, doc) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const dm = f.match(new RegExp(`^(\\d{1,2}) (${MONTHS})$`)); if (dm) return new RegExp(`\\b${dm[1]}(st|nd|rd|th)? ${dm[2]}\\b|\\b${dm[2]} ${dm[1]}\\b`).test(doc);
  const forms = [f, f.replace(/,/g, ''), f.replace(/,/g, ' '), Number(f.replace(/,/g, '')).toLocaleString('en')];
  return forms.some((x) => new RegExp(`(?<![\\d.,])${esc(x)}(?![\\d])`).test(doc));
}

/* ---------- reading a game's words ---------- */
/* skip from an opening bracket to its partner, past strings, template literals and comments */
export function matchBracket(src, i) {
  const open = src[i], close = { '[': ']', '{': '}', '(': ')' }[open]; let d = 0;
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (c === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); if (k < 0) return -1; continue; }
    if (c === '/' && src[k + 1] === '*') { k = src.indexOf('*/', k + 2) + 1; if (k <= 0) return -1; continue; }
    if (c === "'" || c === '"' || c === '`') { for (k++; k < src.length && src[k] !== c; k++) if (src[k] === '\\') k++; continue; }
    if (c === '[' || c === '{' || c === '(') d++; else if (c === ']' || c === '}' || c === ')') { d--; if (d === 0) return src[k] === close ? k : -1; }
  }
  return -1;
}
/* evaluate a literal that may name the game's own variables: every unknown name is a harmless stand-in */
const stand = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === Symbol.iterator ? [][Symbol.iterator] : k === 'length' ? 0 : stand), apply: () => stand, has: () => true });
const scope = new Proxy({}, { has: (t, k) => !(k in globalThis) || k === 'stand', get: (t, k) => (k === Symbol.unscopables ? undefined : stand) });
export function evalLiteral(lit) { try { return new Function('scope', 'with (scope) { return (' + lit + '); }')(scope); } catch (e) { return undefined; } }
/* call a content function (GOALS[12], TALK.mama, LATER.gran) with a stand-in state */
const call = (v) => { if (typeof v !== 'function') return v; try { return v(stand, stand, stand); } catch (e) { return undefined; } };
const STR = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\`(?:[^\`\\]|\\.)*\``;
export function strValue(lit) { if (lit[0] === '`') lit = lit.replace(/\$\{[^}]*\}/g, '{n}'); return evalLiteral(lit); }
/* simple string constants a file defines (const MA = 'Mama'), so `who: MA` reads as Mama */
function constants(src) { const c = {}; for (const m of src.matchAll(new RegExp(String.raw`\b(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(${STR})\s*[,;]`, 'g'))) { const v = strValue(m[2]); if (typeof v === 'string') c[m[1]] = v; } for (const m of src.matchAll(new RegExp(String.raw`[,{]\s*([A-Za-z_$][\w$]*)\s*=\s*(${STR})\s*(?=[,;])`, 'g'))) { const v = strValue(m[2]); if (typeof v === 'string' && !c[m[1]]) c[m[1]] = v; } return c; }
const lineAt = (src, i) => src.slice(0, i).split('\n').length;
/* the source with its comments blanked (newlines kept, so line numbers still match): examples in comments are not the game's words */
export function stripComments(src) {
  let out = '';
  for (let k = 0; k < src.length; k++) {
    const c = src[k];
    if (c === '/' && src[k + 1] === '/') { const e = src.indexOf('\n', k); const end = e < 0 ? src.length : e; out += ' '.repeat(end - k); k = end - 1; continue; }
    if (c === '/' && src[k + 1] === '*') { const e = src.indexOf('*/', k + 2), end = e < 0 ? src.length : e + 2; out += src.slice(k, end).replace(/[^\n]/g, ' '); k = end - 1; continue; }
    if (c === "'" || c === '"' || c === '`') { let j = k + 1; for (; j < src.length && src[j] !== c && !(c !== '`' && src[j] === '\n'); j++) if (src[j] === '\\') j++; out += src.slice(k, j + 1); k = j; continue; }
    out += c;
  }
  return out;
}

/* everything a game says: { lines: [{ who, text, at }], goals: [{ text, at }], pages: [...], unlocks, refs, srcs: {file: text} } */
export async function readGame(game) {
  const dir = join(ROOT, 'games', game, 'src'), files = walk(dir).filter((f) => !/[\\/]dev\.js$|checks\.js$/.test(f)), raw = Object.fromEntries(files.map((f) => [relative(ROOT, f), read(f)])), srcs = Object.fromEntries(Object.entries(raw).map(([f, t]) => [f, stripComments(t)]));
  const lines = [], goals = [], pages = [], seenLine = new Set(), seenGoal = new Set();
  const addLine = (who, text, at) => { if (typeof text !== 'string' || !text.trim() || (typeof who === 'string' && who.length === 1)) return;   /* one-letter speakers are layout-test fixtures */ const k = who + '|' + text; if (seenLine.has(k)) return; seenLine.add(k); lines.push({ who: typeof who === 'string' ? who : '', text, at }); };
  const addGoal = (text, at) => { if (typeof text !== 'string' || !text.trim() || seenGoal.has(text)) return; seenGoal.add(text); goals.push({ text, at }); };
  /* content.js: import it and walk what it exports */
  const content = join(dir, 'content.js');
  if (existsSync(content)) {
    let C = {}; try { C = await import(pathToFileURL(content).href + '?t=' + Date.now()); } catch (e) { console.error(`${game}: content.js does not import (${e.message}); reading it as text only`); }
    const at = 'games/' + game + '/src/content.js';
    const talk = (v, where) => { v = call(v); if (Array.isArray(v)) for (const l of v) { if (typeof l === 'string') addLine('', l, where); else if (l && typeof l === 'object') { if (typeof l.text === 'string') addLine(l.who, l.text, where); for (const c of l.choices || []) if (c && typeof c.t === 'string') addLine('You', c.t, where + ' (choice)'); } } };
    for (const [name, v] of Object.entries(C)) {
      if (name === 'JOURNAL' && Array.isArray(v)) pages.push(...v);
      else if (name === 'GOALS' && v && typeof v === 'object') for (const [k, g] of Object.entries(v)) addGoal(call(g), `${at} GOALS[${k}]`);
      else if (/^(TALK|LATER|SAY|MEET|MORE|LINES|FLAVOUR)$/.test(name) && v && typeof v === 'object') for (const [k, t] of Object.entries(v)) talk(t, `${at} ${name}.${k}`);
      else if (v && typeof v === 'object' && !Array.isArray(v)) {   /* Tivoli's CH1 = { goals, talk, later } */
        if (Array.isArray(v.goals)) v.goals.forEach((g, i) => addGoal(g, `${at} ${name}.goals[${i}]`));
        for (const key of ['talk', 'later', 'flavour']) if (v[key] && typeof v[key] === 'object') for (const [k, t] of Object.entries(v[key])) talk(t, `${at} ${name}.${key}.${k}`);
      }
    }
  }
  /* every source file: dialogue objects, goals and journal literals */
  for (const [f, src] of Object.entries(srcs)) {
    const K = constants(src);
    for (const m of src.matchAll(new RegExp(String.raw`\{\s*who:\s*([^,{}]+?)\s*,[^{}]*?\btext:\s*(${STR})`, 'g'))) { const w = m[1].trim(), who = /^['"`]/.test(w) ? strValue(w) : K[w] ?? '';   /* a name held in a variable we cannot follow counts as unknown */ addLine(who, strValue(m[2]), `${f}:${lineAt(src, m.index)}`); }
    for (const m of src.matchAll(new RegExp(String.raw`\bchoices:\s*\[`, 'g'))) { const e = matchBracket(src, m.index + m[0].length - 1); if (e < 0) continue; for (const c of src.slice(m.index, e).matchAll(new RegExp(String.raw`\bt:\s*(${STR})`, 'g'))) addLine('You', strValue(c[1]), `${f}:${lineAt(src, m.index)} (choice)`); }
    for (const m of src.matchAll(new RegExp(String.raw`(?:\bgoalText\s*=\s*|\bsetGoal\(\s*|\bgoal:\s*)(${STR})`, 'g'))) addGoal(strValue(m[1]), `${f}:${lineAt(src, m.index)}`);
    if (!existsSync(content)) {
      for (const m of src.matchAll(/\bconst GOALS\s*=\s*\{/g)) { const e = matchBracket(src, m.index + m[0].length - 1), v = e > 0 && evalLiteral(src.slice(m.index + m[0].length - 1, e + 1)); if (v) for (const [k, g] of Object.entries(v)) addGoal(call(g), `${f} GOALS[${k}]`); }
      for (const m of src.matchAll(/\bconst JOURNAL\s*=\s*\[|\bJOURNAL\.push\(/g)) { const i0 = m.index + m[0].length - 1, e = matchBracket(src, i0), v = e > 0 && evalLiteral((src[i0] === '(' ? '[' + src.slice(i0 + 1, e) + ']' : src.slice(i0, e + 1))); if (Array.isArray(v)) pages.push(...v.filter((p) => p && p.id)); }
    }
  }
  const all = Object.values(srcs).join('\n'), unlocks = new Set(), refs = new Set();
  for (const m of all.matchAll(/\bunlock\s*(?::\s*|\(\s*)(['"])([\w-]+)\1/g)) unlocks.add(m[2]);
  for (const m of all.matchAll(/\bunlocks?\s*:\s*\[([^\]]*)\]/g)) for (const s of m[1].matchAll(/['"]([\w-]+)['"]/g)) unlocks.add(s[1]);
  for (const p of pages) { const n = (all.match(new RegExp(`['"]${p.id}['"]`, 'g')) || []).length; if (n >= 2) refs.add(p.id); }
  return { game, lines, goals, pages: pages.filter((p) => p && p.id), unlocks: [...unlocks], refs: [...refs], srcs, raw };
}

/* ---------- the lint of one game ---------- */
export function config(game) { const p = join(ROOT, 'tools/checks', game + '.json'); return existsSync(p) ? JSON.parse(read(p)) : {}; }
export function factsDoc(game) { const d = join(ROOT, 'docs/games'); return !existsSync(d) ? '' : readdirSync(d).filter((f) => f === game + '.md' || f.startsWith(game + '-')).map((f) => read(join(d, f))).join('\n'); }

export async function lintGame(game, cfg = config(game)) {
  const G = await readGame(game), out = [], add = (check, msg, at) => out.push({ check, msg, at });
  const max = cfg.maxWords || 12, allow = new Set(cfg.allowLong || []);
  for (const l of G.lines) { const n = words(l.text).length; if (n > max && !allow.has(l.text)) add('long', `${n} words${l.who ? ' (' + l.who + ')' : ''}: "${l.text}"`, l.at); }
  for (const g of G.goals) { const n = sentenceCount(g.text, cfg.goalLead), w = words(g.text).length; if (n > 1) add('goal', `${n} sentences: "${g.text}"`, g.at); else if (w > (cfg.maxGoalWords || 14)) add('goal', `${w} words, keep a goal short: "${g.text}"`, g.at); }
  /* em dashes: the game's source, its page, its docs and its tools */
  const files = [...Object.keys(G.raw), ...[`games/${game}/site/index.html`, `docs/games/${game}.md`].filter((p) => existsSync(join(ROOT, p))), ...readdirSync(join(ROOT, 'docs/games')).filter((f) => f.startsWith(game + '-')).map((f) => 'docs/games/' + f), ...walk(join(ROOT, 'tools', game), /\.(js|mjs|py|json)$/).map((f) => relative(ROOT, f))];
  for (const f of new Set(files)) { const d = emDashes(read(join(ROOT, f))); if (d.length) add('dash', `${d.length} em dash${d.length > 1 ? 'es' : ''} (${[...new Set(d.map((x) => x.kind))].join(', ')}), first on line ${d[0].line}: ${d[0].at}`, f); }
  for (const l of nameIssues(G.lines.map((l) => l.who))) add('name', l, game);
  /* facts: every year, date and number the player reads is in the facts doc */
  const doc = factsDoc(game), ignore = new Set((cfg.factsIgnore || []).map(String)), seenF = new Set();
  if (!doc) add('fact', `no facts doc docs/games/${game}.md`, game);
  else {
    const texts = [...G.lines.map((l) => [l.text, l.at]), ...G.goals.map((g) => [g.text, g.at]), ...G.pages.flatMap((p) => [p.title, ...(p.simple || []), ...(p.deeper || [])].filter((x) => typeof x === 'string').map((t) => [t, `journal '${p.id}'`]))];
    for (const [t, at] of texts) for (const f of factsIn(t)) if (!ignore.has(f) && !seenF.has(f) && !factFound(f, doc)) { seenF.add(f); add('fact', `"${f}" is not in the facts doc: "${t.slice(0, 80)}"`, at); }
  }
  /* rule 3: a real person's words must be real. Every real speaker is listed for a person to check against the sources */
  for (const r of cfg.real || []) { const n = G.lines.filter((l) => l.who === r).length; if (n) add('real', `${r} is a real person and speaks ${n} line${n > 1 ? 's' : ''}: check each is sourced (rule 3: never invent quotes for real people)`, game); }
  for (const l of journalIssues({ pages: G.pages, unlocks: G.unlocks, refs: G.refs, speakers: G.lines.map((l) => l.who), real: cfg.real || [] })) add('journal', l, game);
  /* sounds the code asks for */
  const all = Object.values(G.srcs).join('\n'), refs = {};
  for (const fn of Object.keys(SOUNDS)) for (const m of all.matchAll(new RegExp(`\\b${fn}\\(\\s*['"](\\w+)['"]`, 'g'))) (refs[fn] = refs[fn] || new Set()).add(m[1]);
  for (const l of soundRefIssues(Object.fromEntries(Object.entries(refs).map(([k, v]) => [k, [...v]])), { ...SOUNDS, ...(cfg.sounds || {}) })) add('sound', l, game);
  for (const m of all.matchAll(/['"`]([\w./-]+\.(?:mp3|ogg|wav|m4a|opus))['"`]/g)) if (![`games/${game}/site/${m[1]}`, m[1]].some((p) => existsSync(join(ROOT, p)))) add('sound', `sound file ${m[1]} is missing`, game);
  /* rule 4: banned clips the code names (a person checks each is in the background, or behind Tivoli's card) */
  const clipList = existsSync(join(ROOT, `games/${game}/anim-clips.json`)) ? JSON.parse(read(join(ROOT, `games/${game}/anim-clips.json`))) : [];
  const banned = [...BANNED.fall, ...BANNED.doubled, ...BANNED.fight], allowClips = new Set(cfg.rule4Reviewed || []);
  for (const [f, src] of Object.entries(G.srcs)) for (const m of src.matchAll(/['"`]([A-Z]\w+)['"`]/g)) { const c = m[1]; if ((banned.includes(c) || BANNED.always.some((re) => re.test(c)) && /^Box(Idle|Turn)/.test(c)) && !allowClips.has(c)) add('rule4', `uses clip ${c}: check it is in the background, never a fall in view (rule 4)`, `${f}:${lineAt(src, m.index)}`); }
  for (const c of Array.isArray(clipList) ? clipList : []) if (/^Box/.test(c) && !allowClips.has(c)) add('rule4', `ships clip ${c} (boxing) in anim-clips.json`, `games/${game}/anim-clips.json`);
  /* one line per clip per file is enough */
  const seen = new Set(); const dedup = out.filter((o) => { if (o.check !== 'rule4') return true; const k = o.msg + o.at.split(':')[0]; if (seen.has(k)) return false; seen.add(k); return true; });
  return { game, findings: dedup, stats: { lines: G.lines.length, goals: G.goals.length, pages: G.pages.length, unlocks: G.unlocks.length, speakers: new Set(G.lines.map((l) => l.who).filter(Boolean)).size } };
}

/* the repository's own writing (shared code, docs, tools, menu): em dashes only */
export function lintShared() {
  const files = [...walk(join(ROOT, 'engine')), ...walk(join(ROOT, 'menu'), /\.(js|html|css)$/), ...walk(join(ROOT, 'docs'), /\.md$/).filter((f) => !/docs[\\/]games[\\/]/.test(f)), ...walk(join(ROOT, 'tests'), /\.(mjs|html)$/), ...readdirSync(join(ROOT, 'tools')).filter((f) => /\.(mjs|py)$/.test(f)).map((f) => join(ROOT, 'tools', f)), join(ROOT, 'CLAUDE.md'), join(ROOT, 'README.md')].filter(existsSync);
  const out = []; for (const f of files) { const d = emDashes(read(f)); if (d.length) out.push({ check: 'dash', msg: `${d.length} em dash${d.length > 1 ? 'es' : ''}, first on line ${d[0].line}: ${d[0].at}`, at: relative(ROOT, f) }); }
  return { game: 'shared', findings: out, stats: {} };
}

export const keyOf = (f) => `${f.check}|${f.msg.replace(/\s+/g, ' ')}`;
export const GAMES = () => readdirSync(join(ROOT, 'games')).filter((g) => !g.startsWith('_') && existsSync(join(ROOT, 'games', g, 'src', 'main.js'))).sort();

async function main() {
  process.removeAllListeners('warning');   /* content.js files are ES modules in a package without "type": "module": node says so for each */
  const argv = process.argv.slice(2), opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const only = opt('--game'), ci = argv.includes('--ci'), update = argv.includes('--update-baseline'), json = opt('--json'), show = argv.includes('--all') || !ci;
  const t0 = Date.now(), results = [];
  for (const g of only ? [only] : GAMES()) results.push(await lintGame(g));
  if (!only) results.push(lintShared());
  const bpath = join(ROOT, 'tools/checks/lint-baseline.json'), base = existsSync(bpath) ? JSON.parse(read(bpath)) : {};
  if (update) { const b = Object.fromEntries(results.map((r) => [r.game, [...new Set(r.findings.map(keyOf))].sort()])); if (only) Object.assign(base, b); writeFileSync(bpath, JSON.stringify(only ? base : b, null, 1) + '\n'); console.log('baseline written: ' + relative(ROOT, bpath)); }
  let fresh = 0, gone = 0;
  console.log('content lint (tools/lint_content.mjs)\n\ngame        long  goal  dash  name  fact  journal  real  sound  rule4  total  new');
  for (const r of results) {
    const known = new Set(base[r.game] || []), c = (k) => r.findings.filter((f) => f.check === k).length, nw = r.findings.filter((f) => !known.has(keyOf(f)));
    const now = new Set(r.findings.map(keyOf)); gone += [...known].filter((k) => !now.has(k)).length; fresh += nw.length; r.fresh = nw;
    console.log(`${r.game.padEnd(12)}${['long', 'goal', 'dash', 'name', 'fact', 'journal', 'real', 'sound', 'rule4'].map((k) => String(c(k)).padEnd(k.length + 2)).join('')}${String(r.findings.length).padEnd(7)}${nw.length}`);
  }
  const list = (r, fs) => { for (const f of fs) console.log(`  [${f.check}] ${f.msg}  (${f.at})`); };
  if (show) { for (const r of results) if (r.findings.length) { console.log(`\n--- ${r.game} (${r.findings.length})`); list(r, r.findings); } }
  else if (fresh) { for (const r of results) if (r.fresh.length) { console.log(`\n--- ${r.game}: ${r.fresh.length} new`); list(r, r.fresh); } }
  if (json) writeFileSync(json, JSON.stringify(results.map(({ fresh: _, ...r }) => r), null, 1));
  console.log(`\nLINT ${results.reduce((a, r) => a + r.findings.length, 0)} findings, ${fresh} new since the baseline, ${gone} fixed (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  if (gone && ci) console.log('Some baseline findings are fixed: run node tools/lint_content.mjs --update-baseline so they cannot come back.');
  if (ci && fresh && !update) process.exit(1);
}
if (/lint_content\.mjs$/.test(process.argv[1] || '')) await main();
