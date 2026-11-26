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

  function playIntro(onBlocked) {
    if (!start.disabled && !title.hidden) audio.play().catch((error) => {
      updateControl();
      if (onBlocked && error && error.name === 'NotAllowedError') onBlocked();   /* the browser will not autoplay: it waits for a touch */
    });
  }

  function stopIntro() {
    tryOnTap = false;
    hideStamp();
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

  /* "Touch me" (owner, 26 November 2026, sample A): on a phone or tablet whose browser will not start sound until the screen is touched (autoplay
     refused, NotAllowedError), a small glowing hand print sits in the empty top-left corner of the title. Where the narration starts by itself it
     never appears. Touching it plays the narration; it fades when touched, when the narration
     starts any other way, when the title closes, or after 5 seconds. It never covers the title's words or buttons. */
  const touchScreen = matchMedia('(pointer: coarse)').matches || (matchMedia('(any-pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) || innerWidth <= 760;
  let stamp = null, stampTimer = 0;
  function hideStamp() {
    clearTimeout(stampTimer);
    if (!stamp) return;
    const s = stamp;
    stamp = null;
    s.classList.add('is-gone');
    setTimeout(() => s.remove(), 450);
  }
  function showStamp() {
    if (stamp || !touchScreen || !tryOnTap || !audio.paused || title.hidden || toggle.hidden) return;
    if (!document.getElementById('touch-me-style')) {
      const css = document.createElement('style');
      css.id = 'touch-me-style';
      css.textContent = `
#touch-me{position:fixed;z-index:21;left:calc(env(safe-area-inset-left,0px) + 16px);top:calc(env(safe-area-inset-top,0px) + 16px);display:flex;flex-direction:column;align-items:center;gap:4px;width:84px;padding:0;border:0;background:none;color:#fff6dd;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0;animation:touch-me-in .45s ease-out .2s forwards}
#touch-me .touch-me-disc{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#ffd77a55 0,#ffd77a22 55%,transparent 70%);box-shadow:0 0 18px 6px #ffc94a66;animation:touch-me-glow 1.6s ease-in-out infinite}
#touch-me svg{width:44px;height:44px;color:#ffd77a;filter:drop-shadow(0 0 6px #ffc94a)}
#touch-me .touch-me-words{font:800 13px/1 "Inter",system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-shadow:0 0 8px #ffc94a,0 1px 2px #0008}
#touch-me:focus-visible{outline:2px solid #ffd77a;outline-offset:4px;border-radius:12px}
#touch-me.is-gone{animation:touch-me-out .4s ease-in forwards}
@keyframes touch-me-in{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}
@keyframes touch-me-out{from{opacity:1}to{opacity:0;transform:scale(.9)}}
@keyframes touch-me-glow{0%,100%{box-shadow:0 0 14px 4px #ffc94a55}50%{box-shadow:0 0 24px 9px #ffc94a99}}
@media (prefers-reduced-motion:reduce){#touch-me,#touch-me .touch-me-disc{animation:none;opacity:1}#touch-me.is-gone{display:none}}`;
      document.head.append(css);
    }
    stamp = document.createElement('button');
    stamp.id = 'touch-me';
    stamp.type = 'button';
    stamp.setAttribute('aria-label', 'Touch to hear the story');
    stamp.innerHTML = `<span class="touch-me-disc"><svg viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor">
      <ellipse cx="31" cy="42" rx="14" ry="13"/><rect x="17.5" y="15" width="7" height="22" rx="3.5"/><rect x="25.5" y="9" width="7" height="27" rx="3.5"/>
      <rect x="33.5" y="11" width="7" height="25" rx="3.5"/><rect x="41" y="17" width="6.5" height="21" rx="3.2"/>
      <rect x="4" y="34" width="7" height="18" rx="3.5" transform="rotate(-42 7.5 43)"/></g></svg></span><span class="touch-me-words">Touch me</span>`;
    stamp.addEventListener('click', (event) => {
      event.stopPropagation();
      playIntro();
      hideStamp();
    });
    title.append(stamp);
    stampTimer = setTimeout(hideStamp, 5000);
  }
  audio.addEventListener('play', hideStamp);
  audio.addEventListener('error', hideStamp);

  const ready = () => {
    toggle.disabled = start.disabled;
    if (start.disabled) return;
    loading.disconnect();
    if (tryOnTap) playIntro(showStamp);   /* the stamp shows only where the browser refused to start the narration by itself */
  };
  const loading = new MutationObserver(ready);
  loading.observe(start, { attributes: true, attributeFilter: ['disabled'] });
  ready();

  new MutationObserver(() => {
    if (title.hidden) { stopIntro(); hideStamp(); }
  }).observe(title, { attributes: true, attributeFilter: ['hidden'] });
})();
