import { audioInit, setSceneAudioScale } from './audio.js';

const PREF = 'history-games-calm-scenes';
let calm = false;

export function sceneIsCalm() { return calm; }
export function endSceneWarning() {
  calm = false;
  setSceneAudioScale(1);
}

function preference() {
  try {
    const value = localStorage.getItem(PREF) ?? localStorage.getItem('tivoli-calm');
    if (value !== null) return value === '1';
  } catch { /* A blocked preference store still allows this scene's choice. */ }
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function addSceneWarningOptions(body, watchButton, readButton, watch, read) {
  endSceneWarning();
  const label = document.createElement('label');
  label.style.cssText = 'display:flex;align-items:center;gap:.6rem;min-height:44px;line-height:1.35;cursor:pointer';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.cssText = 'flex:none;width:24px;height:24px;margin:0;accent-color:var(--brass,#d9a441)';
  checkbox.checked = preference();
  checkbox.addEventListener('change', () => {
    try { localStorage.setItem(PREF, checkbox.checked ? '1' : '0'); } catch { /* Keep the current choice. */ }
  });
  label.append(checkbox, 'Calm mode (less motion, fewer flashes, quieter sound)');
  body.replaceChildren(label);
  watchButton.textContent = 'Watch scene';
  readButton.textContent = 'Read what happened instead';
  watchButton.onclick = () => {
    calm = checkbox.checked;
    setSceneAudioScale(calm ? 0.35 : 1);
    audioInit();
    watch();
  };
  readButton.onclick = () => { endSceneWarning(); read(); };
  watchButton.focus({ preventScroll: true });
}

export function sceneWarning(card, { title, lines, watch, read }) {
  card(title, lines, [{ t: 'Watch scene', go: watch }, { t: 'Read what happened instead', go: read }], { col: true });
  const options = document.createElement('div');
  const buttons = document.getElementById('cbtns');
  const [watchButton, readButton] = buttons.children;
  // Generic cards already replace their body when opened again.
  document.getElementById('cbody').append(options);
  addSceneWarningOptions(options, watchButton, readButton, watch, read);
}
