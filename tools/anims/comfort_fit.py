# tools/anims/comfort_fit.py: fit a comfort clip's resting hand so it lies flat on the other person, touching but never in.
# It changes the clip's entry in tools/anims/comfort_fit.json (wrist shift, elbow swing, palm direction, finger tip and
# curl), rebuilds the clip with handmade.py and measures it with pair_check.py, keeping each change that helps.
#   python3 tools/anims/comfort_fit.py ComfortGive          # (pair names as in pair_check.py; the giver clip is fitted)
# Goal: palm and fingers 0 to 0.5 cm above the other person's surface at every moment, the forearm resting (under 1 cm),
# no overlap anywhere.
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); FIT = os.path.join(HERE, 'comfort_fit.json')
PY = os.environ.get('BPY_PYTHON', os.path.expanduser('~/venv/bin/python3'))
GIVER = {'ComfortGive': 'ComfortGive', 'ComfortHand': 'ComfortHand', 'ComfortChild': 'ComfortChild', 'SitComfort': 'SitComfortGive'}
DEFAULT = {'w': [0, 0, 0], 'pole': [0, 0, 0], 'palm': [0, 0, -1], 'down': 0.25, 'curl': 0.35}
env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')


def score(pair):
    subprocess.run([PY, os.path.join(HERE, 'handmade.py'), GIVER[pair]], capture_output=True, env=env, cwd=os.path.dirname(os.path.dirname(HERE)))
    out = subprocess.run([PY, os.path.join(HERE, 'pair_check.py'), pair], capture_output=True, text=True, env=dict(env, PAIR_N=os.environ.get('PAIR_N', '10'))).stdout
    r = {}
    for part in ('palm', 'fingers', 'forearm'):
        m = re.search(r'resting %s\s+nearest point above her surface: (-?[\d.]+) to (-?[\d.]+)' % part, out)
        r[part] = (float(m.group(1)), float(m.group(2))) if m else (1, 1)
    over = [float(x) for x in re.findall(r'vs .*?(\d\.\d+) m', out.split('contacts or overlaps')[1].split('hands through')[0])] if 'contacts or overlaps' in out else [1]
    selfs = [float(x) for x in re.findall(r'(\d\.\d+) m', out.split('hands through own body:')[1])] if 'hands through own body:' in out else []
    s = 50 * (max(over, default=0) + max(selfs, default=0))
    for part in ('palm', 'fingers'):
        lo, hi = r[part]; s += max(0, hi - 0.005) + 5 * max(0, -lo)
    lo, hi = r['forearm']; s += 0.5 * max(0, hi - 0.01) + 5 * max(0, -lo)
    return s, r, max(over, default=0)


SCALE = {'ComfortGive': 1.07, 'SitComfort': 1.07, 'ComfortHand': 1.07, 'ComfortChild': 1.0}   # the giver body is this much bigger than the shared rig


def settle(pair, cur, save):
    """Lay the palm on the surface under it: the palm faces into that surface, the fingers run along it in the
    forearm's direction, and the wrist moves so the palm's middle sits just off it."""
    for it in range(4):
        save(cur)
        subprocess.run([PY, os.path.join(HERE, 'handmade.py'), GIVER[pair]], capture_output=True, env=env)
        out = subprocess.run([PY, os.path.join(HERE, 'pair_check.py'), pair], capture_output=True, text=True, env=dict(env, PAIR_N='2', SUGGEST='1')).stdout
        m = re.search(r'SUGGEST palm_centre \(([^)]*)\) surface \(([^)]*)\) normal \(([^)]*)\) forearm \(([^)]*)\)', out)
        pc, q, n, fa = [[float(x) for x in g.split(',')] for g in m.groups()]
        gap = sum((pc[i] - q[i]) * n[i] for i in range(3)); dist = sum((pc[i] - q[i]) ** 2 for i in range(3)) ** 0.5
        print('settle', it, 'palm off its surface by %.3f' % dist, flush=True)
        tgt = [q[i] + n[i] * 0.013 for i in range(3)]
        cur['w'] = [round(cur['w'][i] + (tgt[i] - pc[i]) / SCALE[pair], 4) for i in range(3)]
        cur['palm'] = [round(-x, 3) for x in n]
        d = sum(fa[i] * n[i] for i in range(3)); f = [fa[i] - d * n[i] for i in range(3)]; f[2] -= 0.15; L = sum(x * x for x in f) ** 0.5
        cur['fingers'] = [round(x / L, 3) for x in f]
    save(cur)


def main():
    pair = sys.argv[1]; name = GIVER[pair]
    allp = json.load(open(FIT)) if os.path.exists(FIT) else {}
    cur = {**DEFAULT, **allp.get(name, {})}
    def save(c): allp[name] = c; json.dump(allp, open(FIT, 'w'), indent=1)
    if '--settle' in sys.argv: settle(pair, cur, save)
    save(cur); best, info, ov = score(pair); print('start', round(best, 4), info, ov, flush=True)
    steps = {('w', 0): 0.01, ('w', 1): 0.01, ('w', 2): 0.01, ('pole', 0): 0.3, ('pole', 1): 0.3, ('pole', 2): 0.3,
             ('palm', 0): 0.1, ('palm', 2): 0.1, ('fingers', 0): 0.1, ('fingers', 2): 0.1, 'curl': 0.15}
    for rnd in range(int(os.environ.get('ROUNDS', 4))):
        better = False
        for key, st in list(steps.items()):
            for sgn in (1, -1):
                trial = json.loads(json.dumps(cur))
                if isinstance(key, tuple): trial[key[0]][key[1]] = round(trial[key[0]][key[1]] + sgn * st, 4)
                else: trial[key] = round(trial[key] + sgn * st, 4)
                save(trial); sc, inf, ov = score(pair)
                if sc < best - 1e-5:
                    best, cur, info = sc, trial, inf; better = True; print(rnd, key, sgn, round(best, 4), info, ov, flush=True); break
            save(cur)
        if not better:
            for k in steps: steps[k] /= 2
    save(cur); print('BEST', name, round(best, 4), info, cur)


if __name__ == '__main__':
    main()
