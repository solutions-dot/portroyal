// Test painted text, not the unused padding of a heading or paragraph. Buttons
// still use their whole hit area. Clip text to scroll containers as the browser does.
export function contentRects(el) {
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
