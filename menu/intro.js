/* The intro for the menu. About five seconds, then the menu rises in.
   What happens: you tap Begin (browsers only play sound after a tap), a dial runs backwards through the years,
   two low notes land, a bell rings, and the name appears. Any tap, Escape or the Skip button ends it early.

   It plays once for each browser tab. ?intro=1 plays it again, ?intro=0 skips it (the check is in index.html).
   The name and the line under it are text in index.html (#intro .in-name and .in-tag). Change them there.
   The sound is made here with Web Audio, no audio files, the same way the games make theirs. See docs/PLATFORM.md. */
(() => {
  const root = document.documentElement, el = document.getElementById('intro');
  if (!el || !root.classList.contains('intro-on')) return;
  el.style.animation = 'none';   /* the script loaded, so switch off the 8 second failsafe in intro.css */

  const END_YEAR = 1690;                            /* the earliest game in the library, Port Royal */
  const START_YEAR = new Date().getFullYear();
  const SPAN = START_YEAR - END_YEAR;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SOUND_KEY = 'platform-sound';

  /* ---------- the timeline, in seconds after the tap ---------- */
  function plan(rm) {
    const lead = rm ? 0.15 : 0.3, spin = rm ? 0 : 2.2, arrive = lead + spin, name = arrive + 0.28, hold = name + (rm ? 1.6 : 1.9);
    const clicks = [];   /* one click each time a tick (ten years) passes the marker, slowing as the dial slows */
    if (spin) for (let k = 1; k * 10 < SPAN; k++) clicks.push(lead + (1 - Math.cbrt(1 - (k * 10) / SPAN)) * spin);
    return { lead, spin, arrive, name, hold, end: hold + 0.7, clicks };
  }
  const ease = (u) => 1 - Math.pow(1 - u, 3);   /* fast at first, then slower and slower (the inverse is used for the clicks) */

  /* ---------- the sound ---------- */
  /* A quiet room, a rising whoosh and a clock ticking back, then two low plucked notes (D then A, an upward fifth,
     meant to feel like the box bass of old Jamaican mento music) and a bell chord that rings out. The chord is D, A, E:
     open and calm, neither happy nor sad, because the stories in the library are both. */
  function chain(ctx) {   /* a filter that drops the rumble phones cannot play, a compressor so nothing is ever harsh, then the volume */
    const master = ctx.createGain(), hp = ctx.createBiquadFilter(), comp = ctx.createDynamicsCompressor(), vol = ctx.createGain();
    hp.type = 'highpass'; hp.frequency.value = 45;
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.25;
    vol.gain.value = 0.5;   /* gentle: this is heard by children, often on headphones. The volume comes after the compressor so it really lowers the peak. */
    master.connect(hp); hp.connect(comp); comp.connect(vol); vol.connect(ctx.destination);
    return master;   /* the sound goes in here; the fade-out on skip lowers this one */
  }
  function build(ctx, dest, t0, p) {
    const sr = ctx.sampleRate;
    const noise = ctx.createBuffer(1, sr * 3, sr), nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const irLen = Math.floor(sr * 2.4), ir = ctx.createBuffer(2, irLen, sr);   /* a small made-up room, for the bell to ring in */
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3.2); }
    const verb = ctx.createConvolver(), verbOut = ctx.createGain();
    verb.buffer = ir; verbOut.gain.value = 0.55; verb.connect(verbOut); verbOut.connect(dest);
    const out = (node, wet) => {   /* dry to the speakers, and some of it into the room */
      node.connect(dest);
      if (wet) { const s = ctx.createGain(); s.gain.value = wet; node.connect(s); s.connect(verb); }
    };
    const arrive = t0 + p.arrive;

    if (p.spin) {
      /* the whoosh: noise through a filter that sweeps upward as the dial runs back */
      const sw = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      sw.buffer = noise; sw.loop = true; bp.type = 'bandpass'; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(180, t0 + p.lead); bp.frequency.exponentialRampToValueAtTime(3600, arrive);
      g.gain.setValueAtTime(0.0001, t0 + p.lead); g.gain.exponentialRampToValueAtTime(0.16, arrive - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, arrive + 0.18);
      sw.connect(bp); bp.connect(g); out(g, 0.2); sw.start(t0 + p.lead); sw.stop(arrive + 0.25);
      /* the clicks of the dial, softer when fast and clearer when slow */
      for (const c of p.clicks) {
        const t = t0 + c, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), cg = ctx.createGain();
        s.buffer = noise; f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 3;
        cg.gain.setValueAtTime(0.03 + 0.09 * ((c - p.lead) / p.spin), t); cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        s.connect(f); f.connect(cg); out(cg, 0.05); s.start(t, Math.random() * 2, 0.05);
      }
    }
    /* a low hum under it all, which swells until the notes land and then fades */
    for (const [f, v] of [[73.42, 0.1], [110, 0.06], [146.83, 0.03]]) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + p.lead); g.gain.exponentialRampToValueAtTime(v, arrive); g.gain.exponentialRampToValueAtTime(0.0001, arrive + 3.2);
      o.connect(g); out(g, 0.3); o.start(t0 + p.lead); o.stop(arrive + 3.3);
    }
    const pluck = (t, f, vol) => {   /* a woody plucked bass note: a soft triangle wave, a quiet octave above it, and a deep sub */
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100;
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle';
      o.frequency.setValueAtTime(f * 1.25, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      o.connect(lp); lp.connect(g); out(g, 0.25); o.start(t); o.stop(t + 1.6);
      const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.frequency.value = f * 2;
      g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.004); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o2.connect(g2); out(g2, 0.2); o2.start(t); o2.stop(t + 0.6);
      const o3 = ctx.createOscillator(), g3 = ctx.createGain(); o3.frequency.value = f / 2;
      g3.gain.setValueAtTime(0.0001, t); g3.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.01); g3.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      o3.connect(g3); out(g3, 0); o3.start(t); o3.stop(t + 1.1);
      const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), sg = ctx.createGain();   /* the sound of the finger */
      s.buffer = noise; bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 2;
      sg.gain.setValueAtTime(vol * 0.25, t); sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      s.connect(bp); bp.connect(sg); out(sg, 0); s.start(t, 0.5, 0.05);
    };
    const bell = (t, f, vol) => {   /* a bell: the note, plus higher parts that die away faster */
      for (const [r, v, d] of [[1, 1, 3.4], [2.01, 0.38, 2.2], [3.02, 0.14, 1.2], [4.2, 0.06, 0.6]]) {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f * r;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); out(g, 0.9); o.start(t); o.stop(t + d + 0.1);
      }
    };
    pluck(arrive, 73.42, 0.5);                 /* the first note: D */
    pluck(arrive + 0.27, 110, 0.62);           /* the second note, a fifth higher and a little stronger: A */
    for (const [i, f] of [587.33, 880, 1318.51].entries()) bell(arrive + 0.27 + i * 0.07, f, 0.065);
  }
  window.IntroSting = { plan, chain, build, get ctx() { return audio && audio.ctx; } };   /* so the sound can be rendered and measured without a speaker */

  /* ---------- the picture ---------- */
  const $ = (s) => el.querySelector(s);
  const ticks = $('.in-ticks'), yearEl = $('.in-year'), nameEl = $('.in-name'), goBtn = $('.in-go'), soundBtn = $('.in-sound'), skipBtn = $('.in-skip');
  const main = document.querySelector('main');
  const NS = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 36; i++) {   /* a tick every ten degrees; the one at each quarter turn is gold */
    const l = document.createElementNS(NS, 'line'), major = i % 9 === 0;
    l.setAttribute('x1', 100); l.setAttribute('x2', 100); l.setAttribute('y1', major ? 6 : 10); l.setAttribute('y2', major ? 22 : 18);
    l.setAttribute('transform', 'rotate(' + i * 10 + ' 100 100)'); l.setAttribute('class', major ? 'in-tick major' : 'in-tick');
    ticks.appendChild(l);
  }
  const letters = nameEl.textContent.trim();   /* the letters rise one after another */
  nameEl.setAttribute('aria-label', letters); nameEl.textContent = '';
  [...letters].forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch; s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true'); nameEl.appendChild(s); });
  yearEl.textContent = START_YEAR;
  if (main) main.inert = true;   /* the menu underneath is not reachable until the intro is gone */

  /* ---------- running it ---------- */
  const P = plan(RM);
  let soundOn = true, audio = null, started = false, done = false, t0 = 0, stage = 0;
  try { soundOn = localStorage.getItem(SOUND_KEY) !== 'off'; } catch (e) { /* default on */ }
  const showSound = () => { soundBtn.textContent = soundOn ? 'Sound on' : 'Sound off'; soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); };
  showSound();
  soundBtn.addEventListener('click', () => { soundOn = !soundOn; try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch (e) { /* ignore */ } showSound(); });

  function startAudio() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC(), master = chain(ctx);
      if (ctx.state === 'suspended') ctx.resume();
      build(ctx, master, ctx.currentTime + 0.06, P);
      audio = { ctx, master };
    } catch (e) { audio = null; }   /* no sound is fine: the picture still plays */
  }
  function stopAudio(fast) {
    if (!audio) return;
    const { ctx, master } = audio; audio = null;
    try { if (fast) master.gain.setTargetAtTime(0, ctx.currentTime, 0.06); setTimeout(() => ctx.close(), fast ? 600 : 4500); } catch (e) { /* ignore */ }
  }

  function begin() {
    if (started || done) return;
    started = true; el.classList.add('running');
    skipBtn.focus({ preventScroll: true });   /* Begin is about to disappear, so keyboard focus moves to the Skip button */
    if (soundOn) startAudio();
    t0 = performance.now(); requestAnimationFrame(tick);
  }
  function tick(now) {
    if (done) return;
    const t = Math.max(0, (now - t0) / 1000);
    const u = P.spin ? Math.min(1, Math.max(0, (t - P.lead) / P.spin)) : (t >= P.lead ? 1 : 0), year = START_YEAR - SPAN * ease(u);
    ticks.setAttribute('transform', 'rotate(' + -(START_YEAR - year) + ' 100 100)');   /* one degree for every year, so ten degrees is one tick */
    yearEl.textContent = Math.round(year);
    if (stage < 1 && t >= P.arrive) { stage = 1; el.classList.add('arrived'); }
    if (stage < 2 && t >= P.name) { stage = 2; el.classList.add('named'); }
    if (stage < 3 && t >= P.hold) { stage = 3; leave(false); }
    if (t < P.end) requestAnimationFrame(tick);
  }
  function leave(skipped) {   /* fade the overlay and let the menu rise in */
    if (done) return;
    done = true; stopAudio(skipped);
    try { sessionStorage.setItem('intro-seen', '1'); } catch (e) { /* ignore */ }
    document.querySelectorAll('.game').forEach((g, i) => g.style.setProperty('--i', Math.min(i, 5)));
    root.classList.add('menu-in'); el.classList.add('leaving');
    setTimeout(() => {
      el.remove(); root.classList.remove('intro-on');
      if (main) main.inert = false;
      const h = document.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, 750);
  }

  goBtn.addEventListener('click', begin);
  skipBtn.addEventListener('click', () => leave(true));
  el.addEventListener('pointerdown', (e) => { if (started && !e.target.closest('button')) leave(true); });   /* a tap anywhere ends it, once it has begun */
  addEventListener('keydown', (e) => {
    if (done) return;
    if (e.key === 'Escape') leave(true);
    else if ((e.key === 'Enter' || e.key === ' ') && started && !e.target.closest('button')) { e.preventDefault(); leave(true); }
  });
  goBtn.focus({ preventScroll: true });
})();
