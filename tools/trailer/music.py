"""tools/trailer/music.py: the trailer's music, made from code like the games' own sound (no recordings).

    python3 -I tools/trailer/music.py <intro.wav> <out.wav>

A reggae one-drop riddim in D minor, 80 beats a minute, so a bar of four is 3 seconds and every cut lands on a bar. The parts are the
ones a Kingston studio band would play: kick and rim together on beat three (the one drop), triplet hi-hats, a deep melodic bass that
rests on the one, guitar skank chops on two and four, the organ "bubble", a melodica lead and dub echo. intro.wav is the
menu intro's own sound (tools/trailer/intro_sound.mjs); it plays from 3 s, under the dial and the logo.

   0 -  3   the hook: a deep hit on each cut, a cymbal swelling into the dial
   3 -  9   the menu intro's sound (dial, stamps, logo)
   9 - 21   the riddim drops: drums, bass, skank, bubble                 (Play)
  21 - 45   the melodica comes in over it                                (Learn, Discover)
  45 - 51   dub breakdown: drums and bass with echo, a swell back in      (the Traveller's Rule)
  51 - 56   the band back in, a melodica note for each stamp             (the passport page)
  56 - 60   the last chord, the bell, dub echoes fading out              (the end card)
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 60.0
N = int(SR * DUR)
BEAT = 0.75
BAR = 3.0
T0 = 9.0
INTRO_AT = 3.0
LEAD, BREAK, PASS, END = 21.0, 45.0, 51.0, 56.0
STAMPS = [PASS + 0.25 + 0.3 * i for i in range(10)]   # must match the overlay's passport page
rng = np.random.default_rng(1962)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t_(n):
    return np.arange(n) / SR


def add(buf, sig, t, g=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(sig) <= 0:
        return
    a = max(0, -i)
    j = min(len(buf), i + len(sig))
    buf[max(i, 0):j] += sig[a: j - i] * g


def onepole(x, fc):
    """a gentle low pass, vectorised through the FFT (a one-pole response)"""
    n = len(x)
    nf = 1 << (n - 1).bit_length()
    f = np.fft.rfftfreq(nf, 1 / SR)
    H = 1 / (1 + 1j * f / fc)
    return np.fft.irfft(np.fft.rfft(x, nf) * H, nf)[:n]


def highpass(x, fc):
    return x - onepole(x, fc)


# ---------- instruments ----------
def bass(m, dur):
    n = int((dur + 0.08) * SR)
    t = t_(n)
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    env = np.minimum(1, t / 0.006) * np.where(t < dur, np.exp(-t / 0.9), np.exp(-dur / 0.9) * np.exp(-(t - dur) / 0.03))
    return np.tanh(1.6 * s * env) * 0.8


def kick():
    n = int(0.45 * SR)
    t = t_(n)
    f = 48 + 90 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22) + 0.15 * rng.uniform(-1, 1, n) * np.exp(-t / 0.004)


def rim():
    n = int(0.15 * SR)
    t = t_(n)
    body = np.sin(2 * np.pi * 420 * t) * np.exp(-t / 0.02)
    click = highpass(rng.uniform(-1, 1, n), 1800) * np.exp(-t / 0.012)
    return 0.7 * body + 1.2 * click


def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = t_(n)
    x = highpass(highpass(rng.uniform(-1, 1, n), 6000), 6000)
    return x * np.exp(-t / (0.09 if open_ else 0.014))


def skank(ms):
    """the guitar chop: a bright chord, choked almost at once, with a scrape of the strings"""
    n = int(0.16 * SR)
    t = t_(n)
    s = np.zeros(n)
    for m in ms:
        f = hz(m)
        s += sum((1 / k) * np.sin(2 * np.pi * f * k * t) for k in range(1, 9))
    s = highpass(s / len(ms), 700) * np.exp(-t / 0.045)
    scrape = highpass(rng.uniform(-1, 1, n), 2500) * np.exp(-t / 0.01) * 0.25
    return s + scrape


def organ(ms, dur=0.11):
    n = int((dur + 0.03) * SR)
    t = t_(n)
    s = np.zeros(n)
    for m in ms:
        f = hz(m)
        s += np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * 2 * f * t) + 0.35 * np.sin(2 * np.pi * 3 * f * t) + 0.2 * np.sin(2 * np.pi * 4 * f * t)
    env = np.minimum(1, t / 0.004) * np.where(t < dur, 1, np.exp(-(t - dur) / 0.012))
    return s / len(ms) * env * (1 + 0.15 * np.sin(2 * np.pi * 6.5 * t))   # a little Leslie wobble


def melodica(m, dur):
    """a reed: square and saw together, a breath at the start, vibrato coming in late"""
    n = int((dur + 0.15) * SR)
    t = t_(n)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.4 * t) * np.minimum(1, t / 0.35)
    ph = np.cumsum(hz(m) * vib) / SR % 1.0
    s = 0.55 * np.sign(np.sin(2 * np.pi * ph)) + 0.45 * (2 * ph - 1)
    s = onepole(s, 2600)
    env = np.minimum(1, t / 0.035) * np.where(t < dur, 1, np.exp(-(t - dur) / 0.06))
    breath = highpass(rng.uniform(-1, 1, n), 3000) * np.exp(-t / 0.05) * 0.08
    return (s + breath) * env


def swell(dur):
    """a cymbal played backwards: noise rising into the next section"""
    n = int(dur * SR)
    x = highpass(rng.uniform(-1, 1, n), 3500)
    return x * np.linspace(0, 1, n) ** 3


def bell(f, dur=5.0):
    n = int(dur * SR)
    t = t_(n)
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d) for r, a, d in [(1, 1, 2.6), (2.0, 0.4, 1.4), (2.76, 0.25, 0.9), (5.4, 0.12, 0.4)])
    return s * np.minimum(1, t / 0.003)


# ---------- the riddim: Dm | Dm | Gm | A, one bar each ----------
CH = [[62, 65, 69], [62, 65, 69], [62, 67, 70], [61, 64, 69]]       # skank voicings (around middle C)
OR_HI = [[65, 69, 74], [65, 69, 74], [67, 70, 74], [64, 69, 73]]    # organ, right hand
ROOT = [38, 38, 43, 45]                                              # D2 D2 G2 A2
BL = [  # the bass line (beat, interval from the root, length in beats): it rests on the one
    [(0.5, 0, 0.45), (1.0, 0, 0.4), (1.5, 3, 0.45), (2.5, 7, 0.45), (3.0, 5, 0.4), (3.5, 3, 0.45)],
    [(0.5, 0, 0.45), (1.0, 0, 0.4), (1.5, 3, 0.45), (2.5, 7, 0.95), (3.5, 10, 0.45)],
    [(0.5, 0, 0.45), (1.0, 0, 0.4), (1.5, 3, 0.45), (2.5, 7, 0.45), (3.0, 5, 0.4), (3.5, 3, 0.45)],
    [(0.5, 0, 0.45), (1.0, 0, 0.4), (1.5, 4, 0.45), (2.5, 7, 0.45), (3.0, -5, 0.4), (3.5, -3, 0.45)],
]
# the melodica: a lifting line in D minor, two four-bar phrases (bar, beat, note, beats)
MEL = [
    (0, 0.0, 74, 1.5), (0, 2.0, 77, 1.0), (0, 3.0, 76, 1.0), (1, 0.0, 74, 2.5), (1, 3.0, 72, 0.5), (1, 3.5, 74, 0.5),
    (2, 0.0, 79, 1.5), (2, 2.0, 77, 0.5), (2, 2.5, 76, 0.5), (2, 3.0, 74, 1.0), (3, 0.0, 73, 2.0), (3, 2.5, 76, 1.5),
    (4, 0.0, 81, 1.5), (4, 2.0, 79, 1.0), (4, 3.0, 77, 1.0), (5, 0.0, 76, 2.0), (5, 2.5, 74, 0.5), (5, 3.0, 76, 1.0),
    (6, 0.0, 77, 1.0), (6, 1.0, 79, 1.0), (6, 2.0, 82, 2.0), (7, 0.0, 81, 2.5), (7, 3.0, 76, 1.0),
]

DRY = np.zeros(N)
DUB = np.zeros(N)    # sent to the dub echo
VERB = np.zeros(N)   # sent to the reverb

bars = int(round((END - T0) / BAR))   # 9 .. 57: the last bar is cut off by the end card's hold
for b in range(bars):
    t = T0 + b * BAR
    if t >= END:
        break
    k = b % 4
    brk = BREAK <= t < PASS
    passport = t >= PASS
    # drums: the one drop, triplet hats, an open hat on the "and" of four
    add(DRY, kick(), t + 2 * BEAT, 0.9)
    add(DRY, rim(), t + 2 * BEAT, 0.32)
    add(VERB, rim(), t + 2 * BEAT, 0.12)
    if brk:
        add(DUB, rim(), t + 2 * BEAT, 0.35)
    if b == 0:
        add(VERB, highpass(rng.uniform(-1, 1, int(1.6 * SR)), 4000) * np.exp(-t_(int(1.6 * SR)) / 0.5), t, 0.25)   # a crash as the riddim drops
        add(DRY, kick(), t, 0.9)
    for i in range(12):
        sw = (i % 3)
        g = [0.10, 0.05, 0.13][sw]
        add(DRY, hat(), t + i * BEAT / 3, g * (0.6 if brk else 1))
    if not brk:
        add(DRY, hat(True), t + 3.5 * BEAT, 0.06)
    if k == 3 and not brk:   # a little rim fill into the next phrase
        for j, dt in enumerate((3.0, 3.333, 3.667)):
            add(DRY, rim(), t + dt * BEAT, 0.12 + 0.05 * j)
    # bass
    for bt, iv, ln in BL[k]:
        add(DRY, bass(ROOT[k] + iv, ln * BEAT), t + bt * BEAT, 0.62)
    if brk:
        continue
    # skank on two and four, with dub echo
    for bt in (1, 3):
        s = skank(CH[k])
        add(DRY, s, t + bt * BEAT, 0.20)
        add(DUB, s, t + bt * BEAT, 0.06)
    # the bubble: right hand on the "and", left hand on the "e" and "a"
    for bt in range(4):
        add(DRY, organ(OR_HI[k]), t + (bt + 0.5) * BEAT, 0.075)
        for e in (0.25, 0.75):
            add(DRY, organ([ROOT[k] + 24, ROOT[k] + 31], 0.07), t + (bt + e) * BEAT, 0.04)
    # melodica from 21 s (Learn and Discover), in phrases of eight bars
    if LEAD <= t < BREAK:
        mb = int(round((t - LEAD) / BAR)) % 8
        for bb, bt, m, ln in MEL:
            if bb == mb:
                s = melodica(m, ln * BEAT)
                add(DRY, s, t + bt * BEAT, 0.13)
                add(DUB, s, t + bt * BEAT, 0.05)
                add(VERB, s, t + bt * BEAT, 0.05)

# the hook: a deep hit on each cut, and a swell into the dial
for t in (0.0, 1.0, 2.0):
    add(DRY, kick(), t, 1.0)
    add(DUB, rim(), t, 0.3)
w_ = swell(2.6)
add(VERB, w_, 0.4, 0.35)
add(DRY, w_, 0.4, 0.06)
# the breakdown swelling back into the band
w2 = swell(1.8)
add(VERB, w2, PASS - 1.8, 0.3)
add(DRY, w2, PASS - 1.8, 0.05)
# the passport page: a melodica note for each stamp, climbing D minor
for t, m in zip(STAMPS, [74, 76, 77, 79, 81, 82, 84, 86, 88, 89]):
    s = melodica(m, 0.22)
    add(DRY, s, t, 0.09)
    add(DUB, s, t, 0.04)
# the end: the band stops on the one, the last chord rings with the bell and fades in dub echo
add(DRY, kick(), END, 0.9)
add(DRY, bass(38, 2.6), END, 0.7)
last = organ([62, 65, 69, 74], 2.2)
add(DRY, last * np.exp(-t_(len(last)) / 1.4), END, 0.12)
add(DUB, skank([62, 65, 69]), END, 0.25)
for m, dt in [(74, 0.0), (81, 0.55), (88, 1.1)]:   # D, A, E like the intro's bell
    b_ = bell(hz(m))
    add(DRY, b_, END + dt, 0.08)
    add(VERB, b_, END + dt, 0.10)

# dub echo: dotted eighths, each repeat darker
D = int(0.5625 * SR)
echoL = np.zeros(N)
echoR = np.zeros(N)
x = DUB.copy()
for r in range(1, 8):
    x = onepole(x, 3200 / r ** 0.5) * 0.55
    tgt = echoL if r % 2 else echoR
    tgt[r * D:] += x[: N - r * D]

# reverb: a short dark room
ir_n = int(1.4 * SR)
ti = t_(ir_n)


def conv(sig, ir):
    m = len(sig) + len(ir)
    nf = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(sig, nf) * np.fft.rfft(ir, nf), nf)[: len(sig)] / np.sqrt(np.sum(ir ** 2)) * 0.5


irL = onepole(rng.normal(0, 1, ir_n), 4000) * np.exp(-ti / 0.35)
irR = onepole(rng.normal(0, 1, ir_n), 4000) * np.exp(-ti / 0.35)
left = DRY + conv(VERB, irL) + echoL + 0.35 * echoR
right = DRY + conv(VERB, irR) + echoR + 0.35 * echoL

# the menu intro's own sound, 3 s to 9 s
with wave.open(sys.argv[1]) as w:
    ch, rate = w.getnchannels(), w.getframerate()
    raw = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64).reshape(-1, ch) / 32768
assert rate == SR
a0 = int(INTRO_AT * SR)
n = min(len(raw), N - a0)
fade = np.ones(n)
f0, f1 = int((T0 - INTRO_AT - 0.3) * SR), int((T0 - INTRO_AT + 0.4) * SR)
fade[f0:f1] = np.linspace(1, 0, f1 - f0)
fade[f1:] = 0
left[a0:a0 + n] += raw[:n, 0] * fade * 3.2
right[a0:a0 + n] += raw[:n, -1] * fade * 3.2

# master: a soft ceiling, then -1 dBFS peak, and a fade at the very end
st = np.stack([left, right], 1)
st = np.tanh(st / (np.percentile(np.abs(st), 99.9) + 1e-9) * 0.9)
st[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None]
st *= 0.89 / np.max(np.abs(st))
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('wrote', sys.argv[2])
