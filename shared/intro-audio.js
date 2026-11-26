/* Title narration. The Start button doubles as the game's ready signal. */
(() => {
  const title = document.getElementById('title');
  const start = document.getElementById('start');
  const audio = document.getElementById('intro-audio');
  const toggle = document.getElementById('intro-audio-toggle');
  const exit = document.getElementById('allgames');
  if (!title || !start || !audio || !toggle || !exit) return;

  let utilities = document.getElementById('title-utilities');
  if (!utilities) {
    utilities = document.createElement('span');
    utilities.id = 'title-utilities';
    exit.before(utilities);
  }
  toggle.className = exit.className;
  toggle.innerHTML = `<svg width="28" height="24" viewBox="0 0 28 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path class="intro-speaker" d="M11 5 6 9H2v6h4l5 4V5Z"/>
    <path class="intro-speaker" d="m17 6 9 6-9 6Z" fill="currentColor" stroke="none"/>
    <path class="intro-pause" d="M11 5v14m6-14v14"/>
  </svg>`;
  utilities.prepend(toggle);

  const exits = '#start, #tchap, #chbtn, #allgames';
  let tryOnTap = true;

  function updateControl() {
    toggle.setAttribute('aria-label', audio.paused ? 'Listen to intro' : 'Pause intro');
    toggle.classList.toggle('is-playing', !audio.paused);
  }

  function playIntro() {
    if (!start.disabled && !title.hidden) audio.play().catch(updateControl);
  }

  function stopIntro() {
    tryOnTap = false;
    audio.pause();
    audio.currentTime = 0;
  }

  audio.addEventListener('play', () => {
    tryOnTap = false;
    updateControl();
  });
  audio.addEventListener('pause', updateControl);
  audio.addEventListener('ended', updateControl);
  audio.addEventListener('error', () => {
    toggle.hidden = true;
    tryOnTap = false;
  });

  toggle.hidden = false;
  toggle.disabled = start.disabled;
  updateControl();
  toggle.addEventListener('click', () => {
    if (audio.paused) playIntro();
    else audio.pause();
  });

  title.addEventListener('click', (event) => {
    if (event.target.closest(exits)) stopIntro();
    else if (tryOnTap && audio.paused && !event.target.closest('button, a')) playIntro();
  }, { capture: true });
  window.addEventListener('pagehide', stopIntro);

  const ready = () => {
    toggle.disabled = start.disabled;
    if (start.disabled) return;
    loading.disconnect();
    if (tryOnTap) playIntro();
  };
  const loading = new MutationObserver(ready);
  loading.observe(start, { attributes: true, attributeFilter: ['disabled'] });
  ready();

  new MutationObserver(() => {
    if (title.hidden) stopIntro();
  }).observe(title, { attributes: true, attributeFilter: ['hidden'] });
})();
