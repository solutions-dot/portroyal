// A keyup or pointerup can be lost when a browser or phone changes focus.
export function useInteractionKey(e, action) {
  if (e.defaultPrevented || e.repeat || !['e', 'enter', ' '].includes(e.key.toLowerCase())) return false;
  // Focused controls own their normal Enter/Space activation, and text input
  // must never start a conversation or use a world object.
  if (e.target?.closest?.('button,a,input,textarea,select,summary,[contenteditable]')) return false;
  if (action() === false) return false;
  e.preventDefault();
  return true;
}

export function releaseOnBlur(keys, pointers, onRelease = () => {}) {
  const release = () => {
    keys.clear();
    for (const p of pointers) {
      p.id = null;
      for (const k of ['dx', 'dy', 'x', 'y', 'moved']) if (k in p) p[k] = 0;
    }
    onRelease();
  };
  addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => { if (document.hidden) release(); });
  return release;
}
