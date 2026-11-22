// Test painted text, not the unused padding of a heading or paragraph. Buttons
// still use their whole hit area. Clip text to scroll containers as the browser does.
export function contentRects(el) {
  if(el.closest('[hidden]'))return [];
  for(let p=el;p;p=p.parentElement)if(p.matches('details:not([open])')){const summary=p.querySelector(':scope > summary');if(!summary||!summary.contains(el))return [];}
  let rects;
  if (el.matches('button,a,input,select')) rects = [el.getBoundingClientRect()];
  else {
    rects = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(walker.currentNode);
      rects.push(...range.getClientRects());
    }
  }
  let clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (!/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowY)) continue;
    const r = p.getBoundingClientRect();
    clip = { left: Math.max(clip.left, r.left), right: Math.min(clip.right, r.right), top: Math.max(clip.top, r.top), bottom: Math.min(clip.bottom, r.bottom) };
  }
  return rects.map((r) => ({ left: Math.max(r.left, clip.left), right: Math.min(r.right, clip.right), top: Math.max(r.top, clip.top), bottom: Math.min(r.bottom, clip.bottom) })).filter((r) => r.right > r.left && r.bottom > r.top);
}
export function contentsOverlap(a, b) {
  return contentRects(a).some((r) => contentRects(b).some((s) => r.left < s.right - 1 && s.left < r.right - 1 && r.top < s.bottom - 1 && s.top < r.bottom - 1));
}

/* ---------- accessibility (?test=all, "a11y" and "keys"; docs/TESTING.md, section 7) ----------
   Pure helpers first (tested in node by tests/checks.mjs), then the DOM checks. */
export function parseColor(s) {   /* 'rgb(1, 2, 3)', 'rgba(1,2,3,.5)', '#abc', '#aabbcc' -> [r, g, b, a] (0 to 255, alpha 0 to 1), or null */
  if (!s) return null; s = String(s).trim();
  let m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
  if (m) { let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]; return [+m[1], +m[2], +m[3], a]; }
  m = s.match(/^#([0-9a-f]{3,8})$/i); if (!m) return s === 'transparent' ? [0, 0, 0, 0] : null;
  let h = m[1]; if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = (i) => parseInt(h.slice(i, i + 2), 16); return [n(0), n(2), n(4), h.length >= 8 ? n(6) / 255 : 1];
}
export function luminance([r, g, b]) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
export function contrastRatio(a, b) { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
export function blend(top, under) { const a = top[3] === undefined ? 1 : top[3]; return [0, 1, 2].map((k) => top[k] * a + under[k] * (1 - a)).concat(1); }
/* WCAG AA: 4.5 for body text, 3 for large text (24 px, or 18.66 px bold) */
export function contrastNeed(px, weight) { return px >= 24 || (px >= 18.66 && weight >= 700) ? 3 : 4.5; }

const shown = (el) => { if (!el || el.closest('[hidden]')) return false; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; const r = el.getBoundingClientRect(); return r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; };
const label = (el) => (el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : '')) + ((el.textContent || '').trim() ? ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24) + '"' : '');
const TAPPABLE = 'button, a[href], input, select, textarea, summary, [role=button], [onclick], [tabindex]:not([tabindex="-1"])';

/* every visible thing you tap is at least min x min CSS pixels (a link inside a sentence is left out: WCAG 2.5.8 allows it) */
export function tapTargetIssues(root = document, min = 44) {
  const out = [];
  for (const el of root.querySelectorAll(TAPPABLE)) {
    if (!shown(el) || el.disabled || el.closest('#autolog')) continue;
    if (el.tagName === 'A' && el.parentElement && /^(P|LI|SPAN|SMALL|EM|STRONG)$/.test(el.parentElement.tagName) && (el.parentElement.textContent || '').trim().length > (el.textContent || '').trim().length + 8) continue;
    const r = el.getBoundingClientRect(); if (r.width < min - 0.5 || r.height < min - 0.5) out.push(`tap target ${label(el)} is ${Math.round(r.width)} x ${Math.round(r.height)} px (needs ${min} x ${min})`);
  }
  return out;
}

/* the colour behind an element: the nearest painted background, blended down to the page; for a see-through panel over the 3D view, a list of two
   (over black and over white); null when a picture or the bare 3D view is behind it */
export function backdrop(el) {
  const layers = [];
  for (let p = el; p; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (cs.backgroundImage && cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null;
    const c = parseColor(cs.backgroundColor); if (c && c[3] > 0) layers.push(c);
    if (c && c[3] >= 0.999) return layers.reduceRight((u, t) => blend(t, u), [0, 0, 0, 1]);
  }
  /* nothing opaque: a see-through panel over the 3D view. Judge it over both black and white scenery and keep the worse, if the panel covers at least half */
  const cover = 1 - layers.reduce((a, c) => a * (1 - c[3]), 1); if (cover < 0.5) return null;
  return [[0, 0, 0, 1], [255, 255, 255, 1]].map((under) => layers.reduceRight((u, t) => blend(t, u), under));
}

/* text that does not meet WCAG AA against its own background; text over the 3D view or a picture is counted, not judged */
export function contrastIssues(root = document, { unknown = null } = {}) {
  const out = [], seen = new Set();
  const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode, el = t.parentElement; if (!el || seen.has(el) || !t.textContent.trim() || el.closest('#autolog,script,style,noscript')) continue; seen.add(el);
    if (!shown(el)) continue;
    const cs = getComputedStyle(el), fg = parseColor(cs.color); if (!fg) continue;
    const bg = backdrop(el); if (!bg) { if (unknown) unknown.push(label(el)); continue; }
    const ratio = Math.min(...(Array.isArray(bg[0]) ? bg : [bg]).map((b) => contrastRatio(blend(fg, b), b))), need = contrastNeed(parseFloat(cs.fontSize), +cs.fontWeight || 400);
    if (ratio < need - 0.005) out.push(`contrast ${ratio.toFixed(2)} (needs ${need}) for ${label(el)}`);
  }
  return out;
}

/* Tab order: every visible control can take focus, nothing has a positive tabindex, and Tab moves top to bottom, left to right inside each panel */
export function focusOrderIssues(root = document) {
  const out = [], els = [...root.querySelectorAll(TAPPABLE)].filter((el) => shown(el) && !el.disabled && !el.closest('#autolog'));
  for (const el of els) {
    if (el.tabIndex > 0) out.push(`${label(el)} has tabindex ${el.tabIndex}: Tab order will jump`);
    if (el.tabIndex < 0 && !el.matches('button, a[href], input, select, textarea')) out.push(`${label(el)} can be tapped but not reached with Tab`);
  }
  const groups = new Map();
  for (const el of els) { if (el.tabIndex < 0) continue; const g = el.closest('dialog, [role=dialog], section, aside, nav, header, footer, .panel, .card') || document.body; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(el); }
  for (const list of groups.values()) for (let i = 1; i < list.length; i++) {
    const a = list[i - 1].getBoundingClientRect(), b = list[i].getBoundingClientRect();
    if (b.bottom < a.top - 4 && Math.abs(b.left - a.left) < 200) { out.push(`Tab goes up the screen from ${label(list[i - 1])} to ${label(list[i])}`); }
  }
  return out;
}
/* is a button's own text cut off? scrollWidth alone also counts a badge hung over its corner (engine/hud.js puts #jcount at -9 px), which is meant to
   stick out: absolutely positioned children are left out of the measure (22 November 2026; Bog Walk's layout test reported the Journal button 19 times). */
export function buttonCutOff(b, slack = 2) {
  const abs = [...b.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'absolute' || getComputedStyle(e).position === 'fixed'), keep = abs.map((e) => e.style.display);
  abs.forEach((e) => { e.style.display = 'none'; }); const cut = b.scrollWidth > b.clientWidth + slack; abs.forEach((e, i) => { e.style.display = keep[i]; }); return cut;
}
