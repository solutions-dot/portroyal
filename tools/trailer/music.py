"""tools/trailer/music.py: the trailer's music, made from code like the games' own sound (no recordings).

    python3 -I tools/trailer/music.py <intro.wav> <out.wav>

80 beats a minute, so a bar of four is 3 seconds and every cut in the trailer lands on a bar. In D, calm and a little awed, with
the plucked box bass of old mento music (an approximation, like the menu intro). intro.wav is the menu intro's own sound, rendered
by record_intro_sound (tools/trailer/make.mjs); it plays under the first seven seconds, where the trailer shows the intro.

   0 -  3   the hook: a low hit on each cut and a rising breath
   3 -  9   the menu intro's sound (dial, stamps, logo)
   9 - 21   pad and marimba, bass on the one             (Play)
  21 - 45   adds the offbeat guitar chop, one-drop drums and shaker   (Learn, Discover)
  45 - 51   fuller, the melody climbs
  51 - 56   the passport page: a note for each stamp as it lands, then a swell
  56 - 60   the bell (D, A, E, as the intro) over a held D, fading out
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 60.0
N = int(SR * DUR)
BEAT = 0.75
BAR = 3.0
T0 = 9.0                         # the bed starts after the intro
INTRO_AT = 3.0                   # where the intro's sound starts
GROOVE, FULL, PASS, END = 21.0, 45.0, 51.0, 56.0
STAMPS = [PASS + 0.25 + 0.3 * i for i in range(10)]   # must match the overlay's passport page
rng = np.random.default_rng(7)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def place(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(sig) <= 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def pluck(f, dur, bright=0.5, decay=0.996):
    """Karplus-Strong string: the box bass and the guitar chop"""
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    for _ in range(int(3 * (1 - bright)) + 1):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    for i in range(0, n, p):
        k = min(p, n - i)
        out[i:i + k] = buf[:k]
        buf = decay * 0.5 * (buf + np.roll(buf, 1))
    return out


def marimba(f, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.55) + 0.25 * np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t / 0.08)
    return s * np.minimum(1, t / 0.004)


def bell(f, dur=6.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (d)) for r, a, d in [(1, 1, 2.6), (2.0, 0.4, 1.4), (2.76, 0.25, 0.9), (5.4, 0.12, 0.4)])
    return s * np.minimum(1, t / 0.003)


def pad(notes, dur):
    """a soft string pad: detuned saws, slow attack, darkened"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.12, 0.0, 0.11):
            f = hz(m + det)
            ph = (f * t) % 1.0
            s += (2 * ph - 1) * 0.33
    s /= len(notes)
    att = np.minimum(1, t / 0.9) * np.minimum(1, (dur - t) / 0.8)
    return s * np.clip(att, 0, 1)


def kick():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)


def rim():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n)
    x = x - np.concatenate([[0], x[:-1]])          # brighter
    return (0.6 * x + np.sin(2 * np.pi * 1700 * t)) * np.exp(-t / 0.025)


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = rng.uniform(-1, 1, n)
    x = x - np.concatenate([[0], x[:-1]])
    return x * np.minimum(1, t / 0.02) * np.exp(-t / 0.03)


# I - vi - IV - V in D, one bar each
CHORDS = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]
ROOTS = [38, 35, 43, 45]          # D2 B1 G2 A2
MEL = {  # (bar in the progression cycle, beat) -> note, a gentle line that answers itself
    (0, 0): 78, (0, 2): 76, (0, 3): 74,
    (1, 0): 71, (1, 2): 74,
    (2, 0): 74, (2, 1): 71, (2, 2): 67,
    (3, 0): 69, (3, 2): 73, (3, 3): 76,
}
MEL_HI = {(0, 0): 81, (0, 2): 78, (0, 3): 76, (1, 0): 78, (1, 2): 74, (2, 0): 79, (2, 2): 78, (2, 3): 74, (3, 0): 76, (3, 2): 73}

L = np.zeros(N)   # dry, centre
WET = np.zeros(N)  # sent to the reverb

bars = int((PASS - T0) / BAR)   # 14 bars to the passport page
for b in range(bars):
    t = T0 + b * BAR
    k = b % 4
    groove = t >= GROOVE - 1e-6
    full = t >= FULL - 1e-6
    # pad
    p = pad(CHORDS[k], BAR + 0.4)
    place(WET, p, t, 0.10 if not full else 0.13)
    place(L, p, t, 0.05)
    # box bass: the one and the "and of two" (mento), then three
    for bt, g in [(0, 1.0), (1.5, 0.6), (2, 0.8)] if groove else [(0, 1.0), (2, 0.7)]:
        place(L, pluck(hz(ROOTS[k] + (7 if bt == 2 and groove else 0)), 1.2, bright=0.2, decay=0.9985), t + bt * BEAT, 0.42 * g)
    # melody
    tune = MEL_HI if full else MEL
    for (kb, bt), m in tune.items():
        if kb == k:
            s = marimba(hz(m))
            place(L, s, t + bt * BEAT, 0.16)
            place(WET, s, t + bt * BEAT, 0.12)
    if groove:
        # guitar chop on every offbeat
        for bt in range(4):
            ch = sum(pluck(hz(m + 12), 0.25, bright=0.9, decay=0.97) for m in CHORDS[k])
            place(L, ch * np.exp(-np.arange(len(ch)) / SR / 0.07), t + (bt + 0.5) * BEAT, 0.07)
            place(WET, ch, t + (bt + 0.5) * BEAT, 0.02)
        # one drop: kick and rim together on beat three
        place(L, kick(), t + 2 * BEAT, 0.55)
        place(L, rim(), t + 2 * BEAT, 0.12)
        place(WET, rim(), t + 2 * BEAT, 0.08)
        if full:
            place(L, kick(), t + 0 * BEAT, 0.35)
        for e in range(8):
            place(L, shaker(), t + e * BEAT / 2, 0.035 if e % 2 else 0.02)

# the hook: a deep hit on each of the three cuts, and a breath of noise rising into the dial
for t in (0.0, 1.0, 2.0):
    k = kick()
    place(L, k, t, 0.8)
    place(WET, k, t, 0.25)
    place(WET, bell(hz(38 + 12), 2.0), t, 0.05)
nz = rng.uniform(-1, 1, int(2.8 * SR))
nz = np.convolve(nz, np.ones(24) / 24, mode='same') * np.linspace(0, 1, len(nz)) ** 3
place(WET, nz, 0.2, 0.35)
place(L, nz, 0.2, 0.08)

# the passport page: the groove stops, the pad holds, and each stamp lands with a woody note climbing the D major scale
pp = pad([50, 57, 62, 66], END - PASS + 0.5)
place(WET, pp, PASS, 0.14)
place(L, pluck(hz(38), 3.0, bright=0.2, decay=0.9993), PASS, 0.45)
scale = [62, 64, 66, 67, 69, 71, 73, 74, 76, 78]
for t, m in zip(STAMPS, scale):
    place(L, kick()[: int(0.12 * SR)], t, 0.25)
    s_ = marimba(hz(m), 1.2)
    place(L, s_, t, 0.2)
    place(WET, s_, t, 0.12)
# the empty slots and "more on the way": a soft rising swell
sw = pad([50, 57, 62, 66, 69], 2.0)
place(WET, sw * np.linspace(0, 1, len(sw)) ** 2, END - 2.0, 0.2)
for i, (m, dt) in enumerate([(74, 0.0), (81, 0.55), (88, 1.1)]):   # D, A, E like the intro's bell
    s_ = bell(hz(m))
    place(L, s_, END + dt, 0.13)
    place(WET, s_, END + dt, 0.15)
hold = pad([50, 57, 62, 69], 60.0 - END)
hold *= np.linspace(1, 0, len(hold)) ** 1.5
place(WET, hold, END, 0.16)
place(L, hold, END, 0.06)
place(L, pluck(hz(38), 3.0, bright=0.2, decay=0.9993), END, 0.5)

# reverb: a decaying noise tail, convolved with the FFT
ir_n = int(2.8 * SR)
ti = np.arange(ir_n) / SR
irL = rng.normal(0, 1, ir_n) * np.exp(-ti / 0.7)
irR = rng.normal(0, 1, ir_n) * np.exp(-ti / 0.7)


def conv(x, ir):
    m = len(x) + len(ir)
    nf = 1 << (m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[: len(x)]
    return y / np.sqrt(np.sum(ir ** 2)) * 0.5


wl, wr = conv(WET, irL), conv(WET, irR)
left = L + wl
right = L + wr

# the intro's own sound under the first seven seconds
with wave.open(sys.argv[1]) as w:
    ch, sw_, rate = w.getnchannels(), w.getsampwidth(), w.getframerate()
    raw = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    raw = raw.reshape(-1, ch)
    assert rate == SR
iL, iR = raw[:, 0], raw[:, -1]
a0 = int(INTRO_AT * SR)
n = min(len(iL), N - a0)
fade = np.ones(n)
f0, f1 = int((T0 - INTRO_AT - 0.4) * SR), int((T0 - INTRO_AT + 0.6) * SR)
if n > f0:
    fade[f0:min(n, f1)] = np.linspace(1, 0, min(n, f1) - f0)
    fade[min(n, f1):] = 0
left[a0:a0 + n] += iL[:n] * fade
right[a0:a0 + n] += iR[:n] * fade

# gentle fade in of the bed and out at the end
g = np.ones(N)
a0 = int(T0 * SR)
g[a0:a0 + int(0.6 * SR)] = np.linspace(0.3, 1, int(0.6 * SR))
g[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
st = np.stack([left * g, right * g], 1)
st = np.tanh(st / (np.max(np.abs(st)) + 1e-9) * 1.2) * 0.85   # soft ceiling
st *= 0.89 / np.max(np.abs(st))                                 # about -1 dBFS peak
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('wrote', sys.argv[2])
