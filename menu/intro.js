/* The intro for the menu. About six seconds, then the menu rises in.
   What happens: you tap Begin (browsers only play sound after a tap), a dial runs backwards through the years and a passport stamp
   lands for every game on the menu, two low notes sound, a bell rings, and the PastPort logo appears with a line about what it is.
   Any tap, Escape or the Skip button ends it early.

   It plays once for each browser tab. ?intro=1 plays it again, ?intro=0 skips it (the check is in index.html).
   The words are text in index.html (#intro .in-name, .in-island and .in-desc). A game gets a stamp when its card has data-year.
   The sound is made here with Web Audio, no audio files, the same way the games make theirs. See docs/PLATFORM.md. */
(() => {
  const root = document.documentElement, el = document.getElementById('intro');
  if (!el || !root.classList.contains('intro-on')) return;
  el.style.animation = 'none';   /* the script loaded, so switch off the 8 second failsafe in intro.css */

  const START_YEAR = new Date().getFullYear();
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SOUND_KEY = 'platform-sound';

  /* ---------- the stops: one for every game on the menu, newest first ---------- */
  function readStops() {
    const list = [...document.querySelectorAll('.game[data-year]')].map((g) => {
      const play = g.querySelector('.play');
      return { year: +g.dataset.year, colour: play ? getComputedStyle(play).backgroundColor : '#FFB627' };   /* the stamp wears the colour of the card's Play button */
    }).filter((s) => s.year < START_YEAR).sort((a, b) => b.year - a.year);
    return list.length ? list : [{ year: 1692, colour: '#FFB627' }];
  }
  const STOPS = readStops();
  const END_YEAR = STOPS[STOPS.length - 1].year, SPAN = START_YEAR - END_YEAR;

  /* ---------- the timeline, in seconds after the tap ---------- */
  function plan(rm) {
    const n = STOPS.length, lead = rm ? 0.15 : 0.25, gap = rm ? 0 : Math.min(0.26, 2.1 / n);
    const stops = STOPS.map((s, i) => ({ year: s.year, colour: s.colour, t: lead + gap * (i + 1) }));   /* a stamp lands at each of these times */
    const arrive = rm ? lead : lead + gap * n + 0.28, name = arrive + 0.28, hold = name + (rm ? 1.6 : 2.3);
    const Y = [START_YEAR, ...stops.map((s) => s.year)], T = [lead, ...stops.map((s) => s.t)];
    const smooth = (u) => u * u * (3 - 2 * u);   /* the dial eases out of one stop and into the next */
    const yearAt = (t) => {
      if (rm || t >= T[n]) return END_YEAR;
      if (t <= T[0]) return START_YEAR;
      let k = 0; while (k < n - 1 && t >= T[k + 1]) k++;
      return Y[k] + (Y[k + 1] - Y[k]) * smooth((t - T[k]) / (T[k + 1] - T[k]));
    };
    const clicks = [];   /* one click each time a tick (ten years) passes the marker */
    if (!rm) for (let m = 1; m * 10 < SPAN; m++) {
      const b = START_YEAR - m * 10;
      for (let k = 0; k < n; k++) if (Y[k + 1] <= b && b < Y[k]) {
        const e = (Y[k] - b) / (Y[k] - Y[k + 1]);
        let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (smooth(mid) < e) lo = mid; else hi = mid; }
        clicks.push(T[k] + hi * gap); break;
      }
    }
    return { lead, spin: gap * n, arrive, name, hold, end: hold + 0.7, stops, clicks, yearAt };
  }

  /* ---------- the sound ---------- */
  /* A quiet room, a rising whoosh and a clock ticking back. A small wooden note rings as each stamp lands, climbing upward.
     Then two low plucked notes (D then A, an upward fifth, meant to feel like the box bass of old Jamaican mento music) and a bell chord
     that rings out. The chord is D, A, E: open and calm, neither happy nor sad, because the stories in the library are both. */
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
      /* a stamp lands: a short wooden note and a soft thump. The notes climb a major pentatonic scale from D. */
      const SCALE = [0, 2, 4, 7, 9, 12, 14, 16];
      p.stops.forEach((s, i) => {
        const t = t0 + s.t, f = 587.33 * Math.pow(2, SCALE[i % SCALE.length] / 12), vol = 0.05 + 0.004 * Math.min(i, 8);
        const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        o.connect(g); out(g, 0.35); o.start(t); o.stop(t + 0.35);
        const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.frequency.value = f * 2;
        g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.003); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o2.connect(g2); out(g2, 0.2); o2.start(t); o2.stop(t + 0.15);
        const th = ctx.createOscillator(), tg = ctx.createGain();
        th.frequency.setValueAtTime(170, t); th.frequency.exponentialRampToValueAtTime(95, t + 0.06);
        tg.gain.setValueAtTime(0.0001, t); tg.gain.exponentialRampToValueAtTime(vol * 1.6, t + 0.004); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        th.connect(tg); out(tg, 0); th.start(t); th.stop(t + 0.12);
      });
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
    pluck(arrive, 73.42, 0.5);                 /* the first note: D, as the centre of the mark slams down */
    pluck(arrive + 0.27, 110, 0.62);           /* the second note, a fifth higher and a little stronger: A, as the name drops in */
    for (const [i, f] of [587.33, 880, 1318.51].entries()) bell(arrive + 0.27 + i * 0.07, f, 0.065);
  }
  window.IntroSting = { plan, chain, build, stops: STOPS, get ctx() { return audio && audio.ctx; } };   /* so the sound can be rendered and measured without a speaker */

  /* ---------- the picture ---------- */
  const $ = (s) => el.querySelector(s);
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const ticks = $('.in-ticks'), stampsG = $('.in-stamps'), yearEl = $('.in-year'), nameEl = $('.in-name'), goBtn = $('.in-go'), soundBtn = $('.in-sound'), skipBtn = $('.in-skip');
  const main = document.querySelector('main');
  for (let i = 0; i < 36; i++) {   /* a tick every ten degrees; the one at each quarter turn is gold */
    const major = i % 9 === 0;
    ticks.appendChild(svg('line', { x1: 100, x2: 100, y1: major ? 6 : 10, y2: major ? 22 : 18, transform: 'rotate(' + i * 10 + ' 100 100)', class: major ? 'in-tick major' : 'in-tick' }));
  }
  /* the stamps sit in a ring outside the dial, counter-clockwise from the top, with the first (newest) just left of the marker */
  const stampEls = [], N = STOPS.length, R = 124, SR = N > 2 ? Math.min(17, R * Math.sin(Math.PI / N) * 0.9) : 17;
  STOPS.forEach((s, i) => {
    const a = (i + 0.5) * 2 * Math.PI / N, at = svg('g', { transform: 'translate(' + (100 - R * Math.sin(a)).toFixed(1) + ' ' + (100 - R * Math.cos(a)).toFixed(1) + ')' }), st = svg('g', { class: 'in-stamp' });
    st.style.setProperty('--tilt', (((i * 37) % 21) - 10) + 'deg');   /* a little different for each, always the same */
    const year = svg('text', { class: 'st-year', fill: s.colour }); year.textContent = s.year; year.style.fontSize = (SR * 0.62).toFixed(1) + 'px';
    st.append(svg('circle', { class: 'st-fill', r: SR, fill: s.colour }), svg('circle', { class: 'st-ring', r: SR, stroke: s.colour }),
      svg('circle', { class: 'st-dash', r: SR * 0.8, stroke: s.colour }), svg('circle', { class: 'st-burst', r: SR, stroke: s.colour }), year);
    at.appendChild(st); stampsG.appendChild(at); stampEls.push(st);
  });
  /* the name: every letter has its own colour, a sunset (gold, orange, hibiscus, violet) running into the sea (blue, teal). So Past is warm and Port is cool. */
  const SWEEP = ['#FFB627', '#FF7A45', '#E8505B', '#B04FB0', '#2B8FD0', '#1FB5A3'].map((h) => [1, 3, 5].map((j) => parseInt(h.slice(j, j + 2), 16)));
  const sweep = (t) => { const x = t * (SWEEP.length - 1), i = Math.min(SWEEP.length - 2, Math.floor(x)), f = x - i; return SWEEP[i].map((v, k) => Math.round(v + (SWEEP[i + 1][k] - v) * f)); };
  const letters = nameEl.textContent.trim();
  nameEl.setAttribute('aria-label', letters); nameEl.textContent = '';
  [...letters].forEach((ch, i, all) => {
    const s = document.createElement('span'), c = sweep(all.length > 1 ? i / (all.length - 1) : 0);
    s.textContent = ch; s.style.setProperty('--i', i); s.style.setProperty('--c', 'rgb(' + c.join(',') + ')'); s.style.setProperty('--glow', 'rgba(' + c.join(',') + ',.45)'); s.setAttribute('aria-hidden', 'true');
    nameEl.appendChild(s);
  });
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

  function begin(byKeyboard) {
    if (started || done) return;
    started = true; el.classList.add('running');
    if (byKeyboard) skipBtn.focus({ preventScroll: true });   /* Begin is about to disappear, so keyboard focus moves to the Skip button (a mouse or finger does not need it, and would see a focus ring) */
    if (soundOn) startAudio();
    t0 = performance.now(); requestAnimationFrame(tick);
  }
  function tick(now) {
    if (done) return;
    const t = Math.max(0, (now - t0) / 1000), year = P.yearAt(t);
    ticks.setAttribute('transform', 'rotate(' + -(START_YEAR - year) + ' 100 100)');   /* one degree for every year, so ten degrees is one tick */
    yearEl.textContent = Math.round(year);
    P.stops.forEach((s, i) => { if (t >= s.t && !stampEls[i].classList.contains('on')) stampEls[i].classList.add('on'); });
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

  goBtn.addEventListener('click', (e) => begin(e.detail === 0));   /* a click with no pointer (detail 0) is Enter or Space */
  skipBtn.addEventListener('click', () => leave(true));
  el.addEventListener('pointerdown', (e) => { if (started && !e.target.closest('button')) leave(true); });   /* a tap anywhere ends it, once it has begun */
  addEventListener('keydown', (e) => {
    if (done) return;
    if (e.key === 'Escape') leave(true);
    else if ((e.key === 'Enter' || e.key === ' ') && started && !e.target.closest('button')) { e.preventDefault(); leave(true); }
  });
  goBtn.focus({ preventScroll: true });
})();
