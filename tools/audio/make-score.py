#!/usr/bin/env python3
"""Makes the quiet music bed for each film (owner rule 17): original, synthesised, no samples. Usage: make-score.py <game> [film ...]
Writes games/<game>/site/scores/score-<film>.mp3 (mono, 32 kbps). Film lengths come from the game's FILMS (read through node).
Each game has a palette (root, mode, texture); a film may override its mood. Levels are set by engine/filmvoice.js (0.40, ducked to 0.17 under a voice)."""
import json, subprocess, sys, os
import numpy as np
SR = 24000
MODES = {"major": [0, 2, 4, 7, 9], "minor": [0, 3, 5, 7, 10], "dorian": [0, 2, 3, 7, 9], "phrygian": [0, 1, 3, 7, 8], "mixo": [0, 2, 4, 7, 10]}
# game: default palette; films: per-film overrides. root in Hz, chords as scale-degree stacks, bell: sparse motif, dark: low drone weight, tremolo: tension, pace: seconds per chord
P = {
 "air-jamaica": dict(root=196.0, mode="major", chords=[[0, 2, 4], [3, 5, 7], [1, 3, 5], [4, 6, 8]], bell=True, dark=0.2, pace=7.0, tremolo=0.0,
     films={"lastlanding": dict(mode="dorian", pace=9.0, dark=0.4), "reveal": dict(pace=4.0), "newflight": dict(root=220.0)}),
 "hutchinson": dict(root=110.0, mode="phrygian", chords=[[0, 2, 4], [0, 1, 4], [0, 2, 3]], bell=False, dark=0.9, pace=9.0, tremolo=0.15, films={"morning": dict(pace=11.0, dark=1.0)}),
 "morant-bay": dict(root=146.8, mode="dorian", chords=[[0, 2, 4], [1, 3, 5], [0, 3, 4]], bell=False, dark=0.7, pace=9.0, tremolo=0.1,
     films={"riot": dict(dark=1.0, tremolo=0.35, pace=6.0), "burning": dict(dark=1.0, tremolo=0.25), "courts": dict(dark=0.9), "dawn": dict(dark=0.5, bell=True, pace=10.0), "today": dict(mode="major", dark=0.3, bell=True),
            "dry": dict(dark=0.6), "walk": dict(dark=0.5), "home": dict(dark=0.6)}),
 "rose-hall": dict(root=164.8, mode="minor", chords=[[0, 2, 4], [2, 4, 6], [0, 3, 4]], bell=True, dark=0.6, pace=8.0, tremolo=0.2,
     films={"legend": dict(bell=True, tremolo=0.3, dark=0.8), "pages": dict(bell=False, dark=0.5, tremolo=0.05), "aisle": dict(mode="dorian", bell=False, dark=0.4), "arrive": dict(mode="mixo", dark=0.4)}),
 "selassie": dict(root=174.6, mode="major", chords=[[0, 2, 4], [3, 5, 7], [4, 6, 8], [0, 2, 4]], bell=True, dark=0.3, pace=10.0, tremolo=0.0, films={}),
 "shark-papers": dict(root=130.8, mode="mixo", chords=[[0, 2, 4], [3, 5, 7], [4, 6, 8]], bell=True, dark=0.4, pace=8.0, tremolo=0.05, films={"verdict": dict(mode="dorian", bell=False, dark=0.6)}),
 "windrush": dict(root=185.0, mode="major", chords=[[0, 2, 4], [5, 7, 9], [3, 5, 7], [4, 6, 8]], bell=True, dark=0.3, pace=9.0, tremolo=0.0, films={"arrival": dict(mode="dorian", pace=10.0, dark=0.5)}),
}
# games with no timed films: a bed per cinematic mood ('story' calm, 'event' grave), 120 seconds each (engine/cine.js plays them under every camera scene)
P.update({
 "bog-walk": dict(root=123.5, mode="dorian", chords=[[0, 2, 4], [1, 3, 5], [0, 3, 4]], bell=False, dark=0.6, pace=9.0, tremolo=0.05, films={}),
 "eventide": dict(root=155.6, mode="dorian", chords=[[0, 2, 4], [3, 5, 7], [1, 3, 5]], bell=True, dark=0.4, pace=9.0, tremolo=0.0, films={}),
 "kendal": dict(root=146.8, mode="mixo", chords=[[0, 2, 4], [3, 5, 7], [4, 6, 8]], bell=True, dark=0.3, pace=8.0, tremolo=0.0, films={"event": dict(mode="minor", bell=False, dark=0.9, pace=9.0, tremolo=0.15)}),
 "melissa": dict(root=130.8, mode="dorian", chords=[[0, 2, 4], [1, 3, 5], [0, 3, 4]], bell=False, dark=0.5, pace=9.0, tremolo=0.05, films={"event": dict(dark=1.0, tremolo=0.3, pace=6.0)}),
 "nanny": dict(root=110.0, mode="dorian", chords=[[0, 2, 4], [0, 3, 4], [1, 3, 5]], bell=False, dark=0.6, pace=10.0, tremolo=0.0, films={}),
 "tivoli": dict(root=98.0, mode="dorian", chords=[[0, 2, 4], [1, 3, 5], [0, 3, 4]], bell=False, dark=0.8, pace=10.0, tremolo=0.05, films={"event": dict(dark=1.0, tremolo=0.12, pace=11.0)}),
 "garvey": dict(root=130.8, mode="mixo", chords=[[0, 2, 4]], bell=False, dark=0.2, pace=10.0, tremolo=0.0, films={}),
 "port-royal": dict(root=146.8, mode="minor", chords=[[0, 2, 4], [3, 5, 7], [0, 3, 4]], bell=True, dark=0.5, pace=9.0, tremolo=0.05, films={"event": dict(bell=False, dark=1.0, tremolo=0.35, pace=6.0)}),
})
BEDS = {"tivoli": ["story", "event"], "garvey": ["record"], "bog-walk": ["story"], "eventide": ["story"], "kendal": ["story", "event"], "melissa": ["story", "event"], "nanny": ["story"], "port-royal": ["story", "event"]}
def note(root, mode, deg):
    sc = MODES[mode]; o, i = divmod(deg, len(sc)); return root * 2 ** ((sc[i] + 12 * o) / 12)
def pad(freq, n, rng):
    t = np.arange(n) / SR; y = np.zeros(n)
    for det, amp in ((0, 1.0), (0.004, 0.6), (-0.003, 0.6)):
        f = freq * (1 + det); y += amp * (np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) + 0.3 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t))
    return y / 4.0
def reverb(x, rng):
    n = int(SR * 2.4); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.55)); ir[0] = 0
    L = len(x) + n; X = np.fft.rfft(x, L); H = np.fft.rfft(ir, L); wet = np.fft.irfft(X * H, L)[:len(x)]
    return x + 0.35 * wet / (np.abs(wet).max() + 1e-9) * np.abs(x).max()
def crackle(duration):
    # a gramophone: a soft hiss and the odd pop (owner, 26 November 2026), narrow like an old record
    rng = np.random.default_rng(7); n = int(duration * SR); h = rng.standard_normal(n) * 0.05
    k = np.ones(6) / 6; h = np.convolve(h, k, mode="same")
    for _ in range(int(duration * 3)):
        i = int(rng.uniform(0, n - 400)); L = int(rng.uniform(20, 90)); h[i:i + L] += rng.standard_normal(L) * rng.uniform(0.08, 0.3) * np.exp(-np.arange(L) / 25)
    fi = int(1.0 * SR); h[:fi] *= np.linspace(0, 1, fi); h[-fi:] *= np.linspace(1, 0, fi)
    return h / (np.abs(h).max() + 1e-9) * 0.2
def make(game, film, duration):
    if film == "record": return crackle(duration)
    p = dict(P[game]); p.update(P[game]["films"].get(film, {})); rng = np.random.default_rng(abs(hash((game, film))) % 2**32 if False else sum(map(ord, game + film)))
    n = int((duration + 2.5) * SR); out = np.zeros(n); pace = p["pace"]; k = 0; t0 = 0.0
    while t0 < duration + 2.5:
        seg = int(min(pace + 2.0, duration + 2.5 - t0 + 2.0) * SR); a = int(t0 * SR)
        chord = p["chords"][k % len(p["chords"])]; env = np.minimum(1, np.minimum(np.arange(seg) / (SR * 2.0), (seg - np.arange(seg)) / (SR * 2.0)))
        y = sum(pad(note(p["root"], p["mode"], d), seg, rng) for d in chord) * env
        y += p["dark"] * 0.9 * pad(note(p["root"] / 2, p["mode"], chord[0]), seg, rng) * env
        end = min(n, a + seg); out[a:end] += y[:end - a]; t0 += pace; k += 1
    if p["tremolo"]:
        tt = np.arange(n) / SR; out *= 1 - p["tremolo"] * (0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * tt))
    if p["bell"]:
        t = 3.0; sc = MODES[p["mode"]]; degs = [4, 2, 3, 1, 2, 0, 1, 4]; i = 0
        while t < duration - 1:
            f = note(p["root"] * 2, p["mode"], degs[i % len(degs)]); L = int(2.6 * SR); tt = np.arange(L) / SR
            b = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt / 0.9) * 0.16
            a = int(t * SR); end = min(n, a + L); out[a:end] += b[:end - a]; t += rng.choice([4.0, 5.5, 7.0]); i += 1
    out = reverb(out, rng)
    fi, fo = int(1.8 * SR), int(min(4.0, duration * 0.2 + 1.5) * SR); out[:fi] *= np.linspace(0, 1, fi); out[-fo:] *= np.linspace(1, 0, fo)
    return out / (np.abs(out).max() + 1e-9) * 0.23
if __name__ == "__main__":
    game = sys.argv[1]; root = os.path.dirname(os.path.abspath(__file__)) + "/../../"
    films = {b: 120 for b in BEDS[game]} if game in BEDS else json.loads(subprocess.check_output(["node", "-e", "import('./games/%s/src/content.js').then(m=>console.log(JSON.stringify(Object.fromEntries(Object.entries(m.FILMS||{}).map(([k,f])=>[k,f.duration])))))" % game], cwd=root, stderr=subprocess.DEVNULL))
    if not films: films = {"arrival": 98}   # Selassie: one film, END = 98
    out_dir = f"{root}games/{game}/site/scores"; os.makedirs(out_dir, exist_ok=True)
    for film, dur in films.items():
        if len(sys.argv) > 2 and film not in sys.argv[2:]: continue
        y = make(game, film, dur); pcm = (y * 32767).astype("<i2").tobytes()
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "32k", f"{out_dir}/score-{film}.mp3"], input=pcm, check=True)
        print(game, film, dur)
