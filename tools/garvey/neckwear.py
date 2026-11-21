# Collars and ties, started again from the drawing board (owner, 21 November 2026: "the collars of most of the characters are messed up, jagged
# and not smooth ... I suspect that the collars should be attached to the shirt and not separate").
#
# era.py runs this file in its own namespace (exec), after the torso layers are finished, for every later-era shirt with a collar kind
# ("stand", "turn", "open", "camp", "round") and for "tie". It uses era.py's names: G, P, s, NECK, NJ, HIP, SX, SKIN, SHT, PART, CK, VZ, VK, h, rig,
# clothes, colmat, sstep, side_arm, tree_of, GI.
#
# How it works, and why it replaces the old collar code:
#  1. The neck is measured once and smoothed. At any height the neck's outline round its own axis is a low-frequency curve (a few Fourier terms) that
#     lies just outside every point of the skin. Collars are shaped from that smooth outline, never from one ray hit per point on lumpy cloth
#     (that was the source of the saw teeth, and of the dozen later passes that tried to iron them out).
#  2. The collar is sewn to the shirt. The shirt's neckline is cut back to one smooth seam line and its edge points are moved onto it. The collar's
#     first row is built on those very points, with the same bone weights, so collar and shirt meet in one line and can never part in any pose.
#     (The collar stays its own part, named Collar, so a game can still colour it or hide it.)
#  3. Each kind is a few rows of points round the neck: a band that stands up from the seam, a leaf that folds over it or lies on the shirt.
#     Every surface that can be seen has a back to it (the inside of a band, the underside of a leaf's edge), so no edge shows as a dark sliver.
#  4. A tie is one piece of cloth: a rounded knot that fills the collar's opening and a blade that runs on from inside the knot, stiff over the shirt.

from mathutils.kdtree import KDTree as _NWKD

NW_SEAMLESS = True      # read by era.py: the collar is attached to the shirt, so its old tucks and skin pulls are not needed
_nw_camp = CK == 'camp'
_nw_round = CK == 'round'
_nw_open = CK == 'open'
_nw_kind = CK

# --- the neck's axis: the middle between the skin's front and back, from two heights on the neck itself (higher, the ray meets the chin) ---
def _nw_mid(z):
    f = SKIN.ray_cast(Vector((0, -1.0, z)), Vector((0, 1, 0)))[0]; b = SKIN.ray_cast(Vector((0, 1.0, z)), Vector((0, -1, 0)))[0]
    return (f.y + b.y) / 2 if f is not None and b is not None else NJ.y
_nw_z0 = NECK - 0.002 * s; _nw_c0 = _nw_mid(_nw_z0); _nw_cl = _nw_mid(NECK - 0.032 * s)
_nw_k_lo = (_nw_c0 - _nw_cl) / (0.030 * s)      # how the middle moves forward with height below the base of the neck (measured on the skin)
_HJ = J('Head'); _nw_k_hi = (_HJ.y - NJ.y) / max(1e-4, _HJ.z - NJ.z)      # and above it, the lean of the neck bone (the skin's front there is the chin)
def nw_cy(z):
    z = max(NECK - 0.06 * s, min(NECK + 0.06 * s, z))
    return _nw_c0 + (z - _nw_z0) * (_nw_k_lo if z < _nw_z0 else _nw_k_hi)
def nw_ang(c): return math.atan2(c.x, -(c.y - nw_cy(c.z)))      # 0 at the throat, +pi/2 at the wearer's left, +-pi at the nape
def nw_pt(a, z, r): return Vector((math.sin(a) * r, nw_cy(z) - math.cos(a) * r, z))
def _nw_wrap(a): return (a + math.pi) % (2 * math.pi) - math.pi
def _nw_front(a): return ((1 + math.cos(a)) / 2) ** 1.5      # 1 at the throat, 0 at the nape, smoothly

# --- a smooth outline round the neck: low-pass Fourier fit that lies just outside every skin sample ---
_NW_NA = 72
def _nw_coeffs(r, K):
    n = len(r); out = []
    for k in range(K + 1):
        c = sum(r[i] * math.cos(2 * math.pi * k * i / n) for i in range(n)) * 2 / n
        d = sum(r[i] * math.sin(2 * math.pi * k * i / n) for i in range(n)) * 2 / n
        out.append([c / 2 if k == 0 else c, 0.0 if k == 0 else d])
    return out
def _nw_eval(co, a): return sum(c * math.cos(k * a) + d * math.sin(k * a) for k, (c, d) in enumerate(co))
def nw_outline(zfun, clear, K=4):
    """A function a -> radius: the skin's outline at height zfun(a), smoothed and lifted to lie `clear` outside every point of it."""
    angs = [2 * math.pi * i / _NW_NA for i in range(_NW_NA)]; raw = []
    for a in angs:
        z = zfun(a); o = Vector((0, nw_cy(z), z)); hit = SKIN.ray_cast(o, Vector((math.sin(a), -math.cos(a), 0)), 0.25)[0]
        raw.append((hit - o).length if hit is not None else None)
    good = [x for x in raw if x is not None] or [0.06]
    raw = [x if x is not None else sum(good) / len(good) for x in raw]
    f = raw[:]
    for _ in range(10):      # the upper envelope: fit, raise every sample the fit passes under, fit again
        co = _nw_coeffs(f, K); f = [max(r, _nw_eval(co, a)) for r, a in zip(raw, angs)]
    co = _nw_coeffs(f, K); co[0][0] += max(0.0, max(r - _nw_eval(co, a) for r, a in zip(raw, angs))) + clear
    return lambda a: _nw_eval(co, a)

# --- the seam: where the collar is sewn to the shirt ---
# At the nape it sits at the base of the neck; at the throat about 3 cm lower, at the top of the breastbone, as a shirt's neckband does.
_nw_zb = NECK - 0.006 * s
_nw_zf = NECK - (0.046 if _nw_open else 0.026 if _nw_round else (G.get('neckdrop', 0.012 if G.get('highneck') else 0.042 if G.get('woman') else 0.032) if CK == 'plain' else 0.030) if CK in ('band', 'plain') else 0.034) * s      # a plain opening: "neckdrop" is how far below the base of the neck its front sits
def _nw_ring_z(a): return _nw_zb + (_nw_zf - _nw_zb) * (_nw_front(a) ** 2 if CK == 'plain' else _nw_front(a))      # a plain opening dips only at the front: lower at the sides too, its ring ran out onto a narrow shoulder and left a wedge of skin there
_NW_RING_R = nw_outline(_nw_ring_z, 0.006)
_aj = 0.0
if _nw_camp:
    # A camp collar's seam runs round the back of the neck and down both edges of the shirt's V to its point. Seen from above it still goes once
    # round the neck, so it too is a height and a radius for each angle: the ring at the back and sides, and in front of the angle where the ring
    # meets the V (_aj) a line falling straight to the V's point.
    _aj = 0.6
    for k in range(400):
        a = math.pi * k / 400; q = nw_pt(a, _nw_ring_z(a), _NW_RING_R(a))
        if q.z <= VZ + VK * abs(q.x): _aj = max(0.15, a); break
    _zj = _nw_ring_z(_aj)
    def SEAM_Z(a):
        aw = abs(_nw_wrap(a)); return _nw_ring_z(a) if aw >= _aj else VZ + (_zj - VZ) * aw / _aj
    _NV = 720; _tab = []
    for i in range(_NV):      # the radius: on the skin's front (plus the shirt's clearance) along the V, the smooth ring elsewhere, blended between
        a = 2 * math.pi * i / _NV; aw = abs(_nw_wrap(a)); z = SEAM_Z(a); rr = _NW_RING_R(a); k = sstep(_aj + 0.18, _aj, aw)
        if k > 0:
            o = Vector((0, nw_cy(z), z)); hit = SKIN.ray_cast(o, Vector((math.sin(a), -math.cos(a), 0)), 0.3)[0]
            if hit is not None: rr = rr * (1 - k) + ((hit - o).length + 0.006) * k
        _tab.append(rr)
    for _ in range(3): _tab = [(_tab[i - 2] + 2 * _tab[i - 1] + 3 * _tab[i] + 2 * _tab[(i + 1) % _NV] + _tab[(i + 2) % _NV]) / 9 for i in range(_NV)]
    def SEAM_R(a):
        f = (a % (2 * math.pi)) / (2 * math.pi) * _NV; i = int(f) % _NV; u = f - int(f); return _tab[i] * (1 - u) + _tab[(i + 1) % _NV] * u
else:
    SEAM_Z = _nw_ring_z; SEAM_R = _NW_RING_R
def seam_pt(a): return nw_pt(a, SEAM_Z(a), SEAM_R(a))

def _nw_above(c):      # is this point of the shirt above the seam, inside the neck opening? (only near the ring: a high shoulder slope outside it is not)
    a = nw_ang(c); return c.z > SEAM_Z(a) - 0.0015 and math.hypot(c.x, c.y - nw_cy(c.z)) < SEAM_R(a) + 0.012
_nw_zlow = (VZ - 0.03 * s) if _nw_camp else NECK - 0.09 * s
def _nw_zone(c):      # the cloth round the neck opening: within 4 cm of the seam, seen from above. (It used to leave out points that count as the arm's; on a child or a narrow-shouldered
    # woman the top of the shoulder is the arm's, so the edge there was never moved onto the seam and a wedge of skin showed at each shoulder.)
    return c.z > _nw_zlow and abs(c.x) < 0.15 * s and math.hypot(c.x, c.y - nw_cy(c.z)) < SEAM_R(nw_ang(c)) + 0.04

# --- bone weights as dicts {group name: weight} ---
def _nw_w(o, vi):
    d = {}; vg = o.vertex_groups
    for g in o.data.vertices[vi].groups:
        n = vg[g.group].name
        if n.startswith('mixamorig:') and g.weight > 0: d[n] = d.get(n, 0) + g.weight
    t = sum(d.values()) or 1; return {k: w / t for k, w in d.items()}
def _nw_mix(a, b, t): return {k: a.get(k, 0) * (1 - t) + b.get(k, 0) * t for k in set(a) | set(b)}
def _nw_avg(ws):
    out = {}
    for w in ws:
        for k, x in w.items(): out[k] = out.get(k, 0) + x / len(ws)
    return out
class _NWSampler:      # the weights of a mesh at any point: the four nearest points, blended by distance
    def __init__(self, o, only=None):
        self.o = o; self.idx = [v.index for v in o.data.vertices if only is None or only(v)]; self.kd = _NWKD(max(1, len(self.idx)))
        for k, i in enumerate(self.idx): self.kd.insert(o.data.vertices[i].co, k)
        self.kd.balance()
    def __call__(self, p):
        near = self.kd.find_n(p, 4); ws = []; tot = 0
        for co, k, d in near: q = 1 / (d + 0.002); ws.append((_nw_w(self.o, self.idx[k]), q)); tot += q
        out = {}
        for w, q in ws:
            for n, x in w.items(): out[n] = out.get(n, 0) + x * q / tot
        return out

# --- 1. the shirt's neckline: cut back below the seam, its edge moved onto the seam, the cloth just under it relaxed ---
_sh = PART['shirt']; _b = bmesh.new(); _b.from_mesh(_sh.data); _b.verts.ensure_lookup_table()
bmesh.ops.delete(_b, geom=[f for f in _b.faces if _nw_zone(f.calc_center_median()) and any(_nw_above(v.co) for v in f.verts)], context='FACES')
bmesh.ops.delete(_b, geom=[v for v in _b.verts if not v.link_faces], context='VERTS')
_SL = _b.verts.layers.int.new('nw_seam')      # marks the points of the seam, so none is lost on the way
def _nw_snap(v): v.co = seam_pt(nw_ang(v.co))
for v in [v for v in _b.verts if v.is_boundary and _nw_zone(v.co)]: _nw_snap(v); v[_SL] = 1
def _nw_seamverts(): return [v for v in _b.verts if v[_SL] == 1]
bmesh.ops.remove_doubles(_b, verts=_nw_seamverts(), dist=0.0025)
for _ in range(4):      # long edges along the seam are split, so the seam line has a point every 5 to 8 mm
    _sv = set(_nw_seamverts()); _long = [e for e in _b.edges if e.is_boundary and e.verts[0] in _sv and e.verts[1] in _sv and e.calc_length() > 0.008]
    if not _long: break
    _r = bmesh.ops.subdivide_edges(_b, edges=_long, cuts=1)
    for v in [x for x in _r['geom_inner'] if isinstance(x, bmesh.types.BMVert)]: _nw_snap(v); v[_SL] = 1
bmesh.ops.triangulate(_b, faces=[f for f in _b.faces if len(f.verts) > 4])
_sv = set(_nw_seamverts()); _kds = _NWKD(max(1, len(_sv)))
for i, v in enumerate(_sv): _kds.insert(v.co, i)
_kds.balance()
_relax = [v for v in _b.verts if v not in _sv and _nw_zone(v.co) and _sv and _kds.find(v.co)[2] < 0.028]
for _ in range(6): bmesh.ops.smooth_vert(_b, verts=_relax, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
for v in _relax:      # and clear of the skin again
    loc, nrm, _i, _d = SKIN.find_nearest(v.co, 0.03)
    if loc is not None and (v.co - loc).dot(nrm) < 0.005: v.co += nrm * (0.005 - (v.co - loc).dot(nrm))
for v in _sv: _nw_snap(v)
_b.verts.index_update(); _nw_seam = []
for v in _sv: _nw_seam.append((nw_ang(v.co) % (2 * math.pi), v.index, v.co.copy()))
_b.normal_update(); _b.to_mesh(_sh.data); _b.free(); _sh.data.update()
SHT = tree_of(_sh)
_nw_seam.sort()
print('NECKWEAR', CK, 'seam points', len(_nw_seam))
_nw_seamw = [(t, _nw_w(_sh, i), c) for t, i, c in _nw_seam]
def _nw_seam_at(t):      # weights (and the shirt's own point, if one is there) on the seam at parameter t (an angle, or u for a camp collar)
    import bisect
    T = [x[0] for x in _nw_seamw]; n = len(T); per = 2 * math.pi
    k = bisect.bisect_left(T, t)
    if k < n and abs(T[k] - t) < 1e-7: return _nw_seamw[k][1], _nw_seamw[k][2]
    if per:
        i0, i1 = (k - 1) % n, k % n; t0 = T[i0] - (per if k == 0 else 0); t1 = T[i1] + (per if k == n else 0)
    else:
        i0, i1 = max(0, k - 1), min(n - 1, k); t0, t1 = T[i0], T[i1]
    f = 0.0 if t1 == t0 else max(0.0, min(1.0, (t - t0) / (t1 - t0)))
    return _nw_mix(_nw_seamw[i0][1], _nw_seamw[i1][1], f), None

# --- 2. helpers to lay a leaf on the cloth and keep it clear ---
_nw_under = [SHT] + ([tree_of(PART['waistcoat'])] if PART.get('waistcoat') else [])
def _nw_out_hit(o, d, trees):      # the outermost cloth along a ray from inside the body: (point, its outward normal) or None
    best = None
    for t in trees:
        loc, nrm, _i, _d = t.ray_cast(o, d, 0.45)
        if loc is not None and (best is None or (loc - o).length > (best[0] - o).length): best = (loc, nrm)
    return best
def nw_profile(a, S):
    """The cloth's line outward from the seam point S at angle a: rays fanned from a point on the neck's axis above the seam, in the half-plane at
    angle a, meet the outermost cloth; the hits are walked from the one nearest S outward (over the shoulder, down the chest or the back).
    Returns [(point, normal, distance along the line from S)]."""
    zo = SEAM_Z(a) + 0.05 * s; O = Vector((0, nw_cy(zo), zo)); H = []
    for k in range(120):
        phi = math.radians(2 + k * 0.72)
        hit = _nw_out_hit(O, Vector((math.sin(a) * math.cos(phi), -math.cos(a) * math.cos(phi), -math.sin(phi))), _nw_under)
        H.append(hit)
    idx = [i for i, x in enumerate(H) if x is not None]
    if not idx: return [(S, Vector((math.sin(a), -math.cos(a), 0.3)).normalized(), 0.0)]
    k0 = min(idx, key=lambda i: (H[i][0] - S).length)
    def run(step):
        out = []; i = k0
        while 0 <= i < len(H) and H[i] is not None: out.append(H[i]); i += step
        return out
    up, dn = run(-1), run(1)
    side = up if (len(up) > 1 and (up[-1][0] - S).length > (dn[-1][0] - S).length) else dn
    # cloth is stiff across a step: the line rests on the outer hull of what is beneath (over the top edge of a waistcoat it spans straight across
    # instead of climbing the step, which stood the leaf up like a fin)
    pts = [(S, side[0][1])] + list(side); changed = True
    while changed and len(pts) > 2:
        changed = False
        for i in range(1, len(pts) - 1):
            p0, p1, p2 = pts[i - 1][0], pts[i][0], pts[i + 1][0]; d = p2 - p0; L2 = d.length_squared or 1e-12
            q = p0 + d * max(0.0, min(1.0, (p1 - p0).dot(d) / L2))
            if (p1 - q).dot(pts[i][1]) < -0.0003: del pts[i]; changed = True; break
    side = pts[1:]
    res = [(S, side[0][1], 0.0)]; L = 0.0; prev = S
    for p, n in side:
        L += (p - prev).length; prev = p; res.append((p, n, L))
    return res
def nw_along(prof, dist, off):      # the point `dist` along a profile, lifted `off` off the cloth
    for (p0, n0, l0), (p1, n1, l1) in zip(prof, prof[1:]):
        if l1 >= dist:
            t = 0.0 if l1 == l0 else (dist - l0) / (l1 - l0); n = n0.lerp(n1, t).normalized(); return p0.lerp(p1, t) + n * off
    p, n, l = prof[-1]; return p + n * off
def nw_front(p, off, trees=None):      # p dropped onto the outermost cloth from in front (for the chest: a camp collar's facings, a collar's points)
    hit = _nw_out_hit(Vector((p.x, nw_cy(p.z), p.z)), Vector((0, -1, 0)), trees or _nw_under)
    return (hit[0] + hit[1] * off) if hit else p
def nw_under_pt(p, d=0.0016):      # just under p, toward the cloth it lies on (the underside of a leaf's edge)
    best = None
    for t in _nw_under:
        loc, nrm, _i, dd = t.find_nearest(p, 0.03)
        if loc is not None and (best is None or dd < best[1]): best = (nrm, dd)
    return p - (best[0] if best else Vector((0, 0, 1))) * d
def nw_clear(cols, rows, trees, mn):      # lift points of these rows to at least mn above the surfaces, the lifts spread along the collar so it moves out as one curve
    n = len(cols)
    for j in rows:
        D = []
        for i in range(n):
            q = cols[i][j]; best = Vector((0, 0, 0))
            for t in trees:
                loc, nrm, _i, _d = t.find_nearest(q, 0.03)
                if loc is None: continue
                sd = (q - loc).dot(nrm)
                if (q - loc - nrm * sd).length > 0.004: continue      # off the edge of that surface
                if sd < mn and (mn - sd) > best.length: best = nrm * (mn - sd)
            D.append(best)
        D = [max(D[max(0, i - 3):i + 4], key=lambda d: d.length) for i in range(n)]      # each lift spread over its neighbours, so an edge never ripples where the cloth beneath is lumpy
        for _ in range(6): D = [(D[max(0, i - 1)] + D[i] * 2 + D[min(n - 1, i + 1)]) / 4 for i in range(n)]
        for i in range(n): cols[i][j] = cols[i][j] + D[i]
def nw_smooth_rows(cols, rows, it=4):      # each row evened out along the collar (the ends stay)
    n = len(cols)
    for _ in range(it):
        for j in rows:
            new = [cols[i][j] if i in (0, n - 1) else (cols[i - 1][j] + cols[i][j] * 2 + cols[i + 1][j]) / 4 for i in range(n)]
            for i in range(n): cols[i][j] = new[i]

# --- 3. building a part from strips of points, with its weights ---
class _NWMesh:
    def __init__(self): self.bm = bmesh.new(); self.W = []; self.strips = []
    def strip(self, cols, wcols, out_rows, closed=False):
        """cols[i][j]: column i (along the collar), row j (from the seam outward). out_rows: the row intervals whose faces must look away from the neck."""
        V = [[self.bm.verts.new(p) for p in col] for col in cols]
        for wc in wcols: self.W.extend(wc)
        fs = []; n = len(V); m = len(V[0])
        for i in range(n if closed else n - 1):
            for j in range(m - 1):
                q = (V[i][j], V[(i + 1) % n][j], V[(i + 1) % n][j + 1], V[i][j + 1])
                if len({x.co.to_tuple(6) for x in q}) < 3: continue
                fs.append((j, self.bm.faces.new(q)))
        self.strips.append((fs, out_rows))
    def finish(self, name, mat, smooth_w=True):
        bm = self.bm; bm.normal_update()
        for fs, out_rows in self.strips:      # each strip is one consistent sheet: turn it so the faces in out_rows look outward
            sc = 0.0
            for j, f in fs:
                if j in out_rows:
                    c = f.calc_center_median(); r = Vector((c.x, c.y - nw_cy(c.z), 0))
                    if r.length > 1e-6: sc += f.normal.dot(r.normalized()) * f.calc_area()
            if sc < 0: bmesh.ops.reverse_faces(bm, faces=[f for j, f in fs])
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
        for i, w in enumerate(self.W):
            t = sum(w.values()) or 1
            for k, x in w.items():
                if x / t > 0.002: (o.vertex_groups.get(k) or o.vertex_groups.new(name=k)).add([i], x / t, 'REPLACE')
        o.parent = rig; o.modifiers.new('Armature', 'ARMATURE').object = rig; clothes.append(o); return o
def _nw_wsmooth(wcols, rows, it=3):      # weights evened along the collar, row by row (never the seam row: it must stay the shirt's own)
    n = len(wcols)
    for _ in range(it):
        for j in rows:
            new = [wcols[i][j] if i in (0, n - 1) else _nw_avg([wcols[i - 1][j], wcols[i][j], wcols[i][j], wcols[i + 1][j]]) for i in range(n)]
            for i in range(n): wcols[i][j] = new[i]

_NW_BAND_MAP = {'Head': 'Neck', 'LeftArm': 'LeftShoulder', 'LeftForeArm': 'LeftShoulder', 'LeftHand': 'LeftShoulder', 'RightArm': 'RightShoulder',
                'RightForeArm': 'RightShoulder', 'RightHand': 'RightShoulder', 'Spine': 'Spine1', 'Hips': 'Spine1'}
def _nw_band_w(w):      # a band round the neck follows the neck and the shoulders, never the head (copied from the neck's skin, it swung with the head and sank into the neck)
    out = {}
    for k, x in w.items():
        b = 'mixamorig:' + _NW_BAND_MAP.get(k[10:], k[10:]); out[b] = out.get(b, 0) + x
    return out
_nw_skin_w = _NWSampler(h, only=lambda v: any(g.group == GI['body'] and g.weight > 0 for g in v.groups))
_nw_shirt_w = _NWSampler(_sh)

# --- 4. the columns round the neck: every seam point of the shirt, plus more where the collar turns sharply ---
def _nw_cols(g):
    """Angles (0 to 2pi, front at 0) from g round the back to 2pi-g: the shirt's seam points, with more added so no step is wider than 0.09 rad (0.05 near the front)."""
    T = sorted(set([g, 2 * math.pi - g] + [t for t, w, c in _nw_seamw if g + 0.004 < t < 2 * math.pi - g - 0.004])); out = [T[0]]
    for t in T[1:]:
        if t - out[-1] < 0.004: continue
        step = 0.05 if _nw_front(out[-1]) > 0.35 else 0.09; gap = t - out[-1]; k = int(gap / step); base = out[-1]
        out += [base + gap * q / (k + 1) for q in range(1, k + 1)]
        out.append(t)
    return out
def _nw_seam_col(t):
    w, c = _nw_seam_at(t)
    return (c if c is not None else seam_pt(t)), w

NW_FRONT = None      # for the tie: where the closed collar's front is, and how it moves
NW_PLACKET_TOP = SEAM_Z(0) - 0.003 * s

if CK == 'plain':
    # A plain rounded opening, no collar (Nanny Town's Maroon men: owner, 21 November 2026): the shirt's edge on the smooth seam, turned in as a narrow
    # facing so the cloth has a clean, finished edge and its inside never shows through from above.
    A = _nw_cols(0.0); cols = []; wcols = []
    for a in A:
        s0, w0 = _nw_seam_col(a); cols.append([s0, nw_pt(a, s0.z - 0.004 * s, SEAM_R(a) - 0.0025), nw_pt(a, s0.z - 0.012 * s, SEAM_R(a) - 0.003)]); wcols.append([w0, w0, w0])
    nw_clear(cols, (1, 2), [SKIN], 0.002)
    M = _NWMesh(); M.strip(cols, wcols, out_rows=()); _nw_collar = M.finish('Collar', 'Shirt')

elif CK in ('stand', 'turn', 'open', 'band'):
    # A band that stands up from the seam round the neck. 'stand': a tall stiff band (before about 1925), its front corners rounded, closed at the
    # throat. 'turn' and 'open': a lower band with a leaf folded down over it that ends in two points on the shirt front; 'open' is worn unbuttoned,
    # the band's ends apart and the points spread on the chest.
    # 'band': a shirt of the 1690s and 1730s, its body gathered into a narrow neckband over a short slit at the front, worn open in the heat
    stand = CK in ('stand', 'band'); g = 0.035 if CK == 'stand' else 0.16 if CK == 'band' else 0.03 if CK == 'turn' else 0.30
    Hb, Hf = ((0.016, 0.011) if CK == 'band' else (0.044, 0.029) if stand else (0.032, 0.024) if CK == 'turn' else (0.028, 0.012))
    def H(a):
        aw = abs(_nw_wrap(a)); hh = (Hb + (Hf - Hb) * _nw_front(a)) * s
        if stand:
            e = (aw - g) / 0.16
            if e < 1: hh *= 1 - 0.32 * (1 - max(0.0, e)) ** 2      # the front corners rounded
        return hh
    TS = (0.0, 0.5, 1.0)
    RB = [nw_outline(lambda a, t=t: SEAM_Z(a) + t * H(a), 0.006 if t == 0 else 0.0065) for t in TS]
    def band_r(a, z):      # the band's outer radius at angle a, height z (between its rows)
        t = max(0.0, min(1.0, (z - SEAM_Z(a)) / max(1e-6, H(a)))); k = min(len(TS) - 2, int(t / 0.5)); u = (t - TS[k]) / (TS[k + 1] - TS[k])
        return RB[k](a) * (1 - u) + RB[k + 1](a) * u
    A = _nw_cols(g); cols = []; wcols = []
    for a in A:
        s0, w0 = _nw_seam_col(a); col = [s0]
        for t, R in zip(TS[1:], RB[1:]): col.append(nw_pt(a, SEAM_Z(a) + t * H(a), R(a)))
        top = col[-1]; zt = top.z; rt = RB[-1](a)
        col.append(nw_pt(a, zt - 0.006 * s, rt - 0.003))      # the band's inside: a narrow strip down from its top edge, so its thickness shows
        col.append(nw_pt(a, zt - (0.020 if stand else 0.014) * s, RB[1](a) - 0.003))
        # The band moves with the chest, as the shirt does. Only the back of its top edge takes a little of the neck (a third), so the neck cannot push
        # through it when the head tips back. (Copied from the neck's skin, the front of the band followed the neck bone, which pivots behind and
        # above the throat: when the head nodded the band's front and the tie's knot swung down into the chest.)
        wt = _nw_mix(_nw_band_w(w0), {'mixamorig:Neck': 1.0}, 0.33 * (1 - _nw_front(a)) ** 1.5); wm = _nw_mix(w0, wt, 0.5)
        cols.append(col); wcols.append([w0, wm, wt, wt, wm])
    nw_clear(cols, (1, 2), [SKIN], 0.0055); nw_clear(cols, (3, 4), [SKIN], 0.0028)
    nw_smooth_rows(cols, (1, 2, 3, 4), 2)
    _wb = [list(w) for w in wcols]; _nw_wsmooth(_wb, (1, 2, 3, 4))
    M = _NWMesh(); M.strip(cols, _wb, out_rows=(0, 1))
    ia = min(range(len(A)), key=lambda i: abs(_nw_wrap(A[i])))      # the column nearest the throat
    NW_FRONT = {'g': g, 'ztop': cols[0][2].z, 'ytop': min(cols[0][2].y, cols[-1][2].y), 'ymid': min(cols[0][1].y, cols[-1][1].y),
                'w': _nw_avg([_wb[0][1], _wb[-1][1], _wb[0][2], _wb[-1][2]]), 'xg': abs(cols[0][2].x)}
    if not stand:
        # the leaf: from a fold just over the band's top edge, down over the band and past the seam onto the shirt, measured along the cloth; at the
        # front it runs out into the two points, which lie on the shirt front
        ap = 0.95 if CK == 'turn' else 0.85
        tipx = (0.036 if CK == 'turn' else 0.075) * s; tipz = SEAM_Z(0) - (0.058 if CK == 'turn' else 0.052) * s
        tips = {sx: nw_front(Vector((sx * tipx, 0, tipz)), 0.0042, [SHT]) for sx in (1, -1)}      # on the shirt: a waistcoat's edge beneath only lifts them (the clearing below), it does not fold them
        lcols = []; lw = []
        for a, bc, w in zip(A, cols, _wb):
            S = bc[0]; top = bc[2]; rt = RB[-1](a); fold = nw_pt(a, top.z + 0.0025, rt + 0.0035)
            prof = nw_profile(a, S); dL = (0.009 + 0.005 * _nw_front(a)) * s      # how far the leaf reaches past the seam
            zm = S.z + 0.5 * H(a); m1 = nw_pt(a, zm, band_r(a, zm) + 0.0045)      # over the band
            m2 = nw_pt(a, S.z + 0.0015, SEAM_R(a) + 0.0045)      # over the seam
            m3 = nw_along(prof, dL * 0.55, 0.0043); e = nw_along(prof, dL, 0.0042)
            fr = max(0.0, min(1.0, (ap - abs(_nw_wrap(a))) / (ap - g)))
            if fr > 0:      # the points: the edge runs out to the tip, on the shirt front
                sx = 1 if _nw_wrap(a) >= 0 else -1; k = sstep(0.0, 1.0, fr) ** 0.9
                e = nw_front(e.lerp(tips[sx], k), 0.0042, [SHT]); m3 = nw_front(m3.lerp(m2.lerp(e, 0.5), k), 0.0043, [SHT])
            lcols.append([fold, m1, m2, m3, e])
            ws = _nw_shirt_w(e); lw.append([w[2], _nw_mix(w[2], w[0], 0.5), w[0], _nw_mix(w[0], ws, 0.6), ws])
        for _ in range(3):      # evened out along the collar, then lifted clear again (the clearing spreads its lifts too)
            nw_smooth_rows(lcols, (1, 2, 3, 4), 3)
            nw_clear(lcols, (2, 3, 4), _nw_under, 0.0038); nw_clear(lcols, (0, 1, 2), [SKIN], 0.008)
        nw_smooth_rows(lcols, (0, 1), 3)      # and the fold, which the neck's clearance lifted point by point, evened out once more
        for _ in range(3):      # and each column from the fold to the edge, so the leaf runs in one smooth curve over the seam (it dimpled where the neck's clearance lifted one row)
            for col in lcols:
                for j in (1, 2, 3): col[j] = col[j].lerp((col[j - 1] + col[j + 1]) * 0.5, 0.4)
            nw_clear(lcols, (2, 3, 4), _nw_under, 0.0038)
        full = [col + [nw_under_pt(col[-1]), nw_under_pt(col[-2])] for col in lcols]      # the underside of the leaf's edge: it has a thickness, and its back never shows as a dark sliver
        lw2 = [w + [w[-1], w[-2]] for w in lw]; _nw_wsmooth(lw2, (1, 2, 3, 4, 5, 6))
        M.strip(full, lw2, out_rows=(0, 1, 2, 3))
    _nw_collar = M.finish('Collar', 'Shirt' if CK == 'band' else 'Collar')      # a neckband is the shirt's own cloth

elif CK == 'round':
    # A flat round collar (a blouse's or a frock's): sewn on a close neckline, a little roll at the seam, then a leaf that lies flat on the shoulders,
    # the same width all round (measured along the cloth), its two ends rounded and nearly meeting at the throat.
    g = 0.05; W = G.get('leaf', 0.062 if G.get('woman') else 0.072) * s; ends = 0.42
    A = _nw_cols(g); cols = []; wcols = []
    for a in A:
        s0, w0 = _nw_seam_col(a); aw = abs(_nw_wrap(a)); e = (aw - g) / ends
        wk = math.sqrt(max(0.0, 1 - (1 - e) ** 2)) if e < 1 else 1.0; w = max(0.003, W * wk)
        prof = nw_profile(a, s0); col = [s0, nw_pt(a, s0.z + 0.0025, SEAM_R(a) + 0.0012)]
        for t in (0.33, 0.66, 1.0): col.append(nw_along(prof, w * t, 0.0040 if t < 1 else 0.0036))
        cols.append(col); wcols.append([w0] + [_nw_shirt_w(q) for q in col[1:]])
    nw_smooth_rows(cols, (2, 3, 4), 2)
    for _ in range(2): nw_clear(cols, (1, 2, 3, 4), _nw_under, 0.0036); nw_clear(cols, (1, 2), [SKIN], 0.0045)
    full = [col + [nw_under_pt(col[-1]), nw_under_pt(col[-2])] for col in cols]
    wfull = [w + [w[-1], w[-2]] for w in wcols]; _nw_wsmooth(wfull, (1, 2, 3, 4, 5, 6))
    M = _NWMesh(); M.strip(full, wfull, out_rows=(0, 1, 2, 3)); _nw_collar = M.finish('Collar', 'Collar')

elif CK == 'camp':
    # A camp collar is two pieces, as it is sewn: the collar round the neck, lying nearly flat on the shoulders and ending at each side in a point,
    # and the shirt's front turned back as a facing down each side of the V, narrowing to nothing at the V's point. The facing's top tucks under
    # the collar's point, with a notch between them. (Built as one strip, the leaf had to turn a sharp corner where the neck meets the V and it
    # crumpled there.)
    W0 = G.get('leaf', 0.058 if G.get('woman') else 0.062) * s; WV = 0.046 * s; M = _NWMesh()
    # the collar, from one point round the back to the other
    e0 = max(0.05, _aj - 0.10); A = [x for x in _nw_cols(e0)]; cols = []; wcols = []
    for a in A:
        s0, w0 = _nw_seam_col(a); aw = abs(_nw_wrap(a)); pt = sstep(e0 + 0.45, e0, aw)      # 1 at the collar's point
        w = W0 * (0.86 + 0.14 * _nw_front(a)) * (1 + 0.45 * pt); prof = nw_profile(a, s0)
        col = [s0, nw_pt(a, s0.z + 0.0022 + 0.003 * s * (1 - _nw_front(a)), SEAM_R(a) + 0.0012)] + [nw_along(prof, w * t, (0.0052 if t < 1 else 0.0048) + 0.0015 * pt) for t in (0.4, 0.75, 1.0)]
        if pt > 0:      # the point leans toward the front: its outer edge moves down the chest
            for j in (2, 3, 4): col[j] = nw_front(col[j] + Vector((0, 0, -0.012 * s * pt * (j - 1) / 3)), 0.0052)
        cols.append(col); wcols.append([w0] + [_nw_shirt_w(q) for q in col[1:]])
    for _ in range(3):
        nw_smooth_rows(cols, (1, 2, 3, 4), 3); nw_clear(cols, (2, 3, 4), _nw_under, 0.0045); nw_clear(cols, (1, 2), [SKIN], 0.0045)
    full = [col + [nw_under_pt(col[-1]), nw_under_pt(col[-2])] for col in cols]
    wfull = [w + [w[-1], w[-2]] for w in wcols]; _nw_wsmooth(wfull, (1, 2, 3, 4, 5, 6))
    M.strip(full, wfull, out_rows=(0, 1, 2, 3))
    # the two facings, from the V's point up to just under the collar's point
    for sx in (1, -1):
        A2 = [x for x in _nw_cols(0.012) if (_nw_wrap(x) >= 0) == (sx > 0) and abs(_nw_wrap(x)) <= _aj + 0.06]
        A2.sort(key=lambda x: abs(_nw_wrap(x)))
        cols = []; wcols = []; D = Vector((sx * 0.94, 0, -0.34)).normalized()
        for a in A2:
            s0, w0 = _nw_seam_col(a); aw = abs(_nw_wrap(a)); w = max(0.002, WV * min(1.0, aw / _aj) ** 0.75)
            col = [s0, nw_front(s0 + D * 0.0015, 0.0040)] + [nw_front(s0 + D * (w * t), 0.0038 if t < 1 else 0.0034) for t in (0.4, 0.75, 1.0)]
            cols.append(col); wcols.append([w0] + [_nw_shirt_w(q) for q in col[1:]])
        for _ in range(2):
            nw_smooth_rows(cols, (2, 3, 4), 3); nw_clear(cols, (1, 2, 3, 4), _nw_under, 0.0034)
        full = [col + [nw_under_pt(col[-1]), nw_under_pt(col[-2])] for col in cols]
        wfull = [w + [w[-1], w[-2]] for w in wcols]; _nw_wsmooth(wfull, (1, 2, 3, 4, 5, 6))
        M.strip(full, wfull, out_rows=(0, 1, 2, 3))
    _nw_collar = M.finish('Collar', 'Collar')

# --- 5. the tie: one piece, a knot in the collar's opening and a blade that runs on from inside it ---
if G.get('tie') and NW_FRONT is not None:
    stand = CK == 'stand'
    KH = (0.034 if stand else 0.040) * s
    zt = NW_FRONT['ztop'] - (0.008 * s if stand else -0.0015)      # a stand collar's rounded corners frame the knot; a turn collar's band ends meet behind it, so it reaches the band's top edge (lower, the band's two ends showed above it as white tabs)
    yback = NW_FRONT['ytop'] + 0.0015      # its back just inside the front of the band, so it sits in the opening, not on it
    def _ysh(z, x=0.0):      # the shirt's front at height z, a little over it
        hit = SHT.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))[0]; return (hit.y if hit else nw_cy(z) - 0.08) - 0.0025
    M = _NWMesh(); NR = 9; NA = 13; rings = []; wk = NW_FRONT['w']
    for t in range(NR):
        v = t / (NR - 1); z = zt - KH * v
        hw = ((0.0160 - 0.0078 * v) if stand else (0.0180 - 0.0090 * v)) * s      # a four-in-hand knot: straight sides tapering from the top into the blade
        dd = (0.0060 + 0.0022 * math.sin(math.pi * min(1.0, v * 1.4))) * (1 - 0.5 * max(0.0, (v - 0.75) / 0.25))      # flat across the front, a little fuller below the top
        if t == 0: hw *= 0.97; dd *= 0.55      # a crisp top edge, tucked into the collar
        yb = min(yback, _ysh(z)) if z < SEAM_Z(0) + 0.004 else yback
        ring = []
        for k in range(NA):
            u = -1 + 2 * k / (NA - 1); bulge = math.cos(u * math.pi / 2) ** 0.30      # flat across, rounding only at the sides
            ring.append(Vector((u * hw, yb - dd * bulge - 0.0008, z)))
        for k in range(NA - 2, 0, -1):
            u = -1 + 2 * k / (NA - 1); ring.append(Vector((u * hw * 0.94, yb, z)))
        rings.append(ring)
    # a closed knot: its rings, and a cap at top and bottom
    V = [[M.bm.verts.new(p) for p in r] for r in rings]
    for r in rings: M.W.extend([wk] * len(r))
    m = len(rings[0]); kf = []
    for a_, b_ in zip(V, V[1:]):
        for k in range(m): kf.append(M.bm.faces.new((a_[k], a_[(k + 1) % m], b_[(k + 1) % m], b_[k])))
    kf.append(M.bm.faces.new(list(reversed(V[0])))); kf.append(M.bm.faces.new(V[-1]))
    bmesh.ops.recalc_face_normals(M.bm, faces=kf)
    # the blade: a thin closed band of cloth, 7 points across its front and back
    zb = zt - KH; z0 = zb + 0.012 * s
    zend = (WVZ - 0.07 * s) if (G.get('waistcoat') and 'WVZ' in globals() and G.get('vwaist')) else HIP + 0.13
    n = 26; ZS = []; WS = []; YS = []
    for t in range(n + 1):
        f = t / n; z = z0 - (z0 - zend) * f
        w = (0.0095 + 0.0075 * min(1.0, f / 0.10)) * s if f < 0.10 else (0.017 + 0.019 * (f - 0.10) / 0.78) * s if f < 0.88 else max(0.0012, 0.036 * s * (1 - f) / 0.12)
        yf = min(_ysh(z, -w), _ysh(z), _ysh(z, w)) - 0.0035      # 6 mm over the shirt: clear of the front band and its buttons
        inside = sstep(zb - 0.006 * s, zb + 0.004 * s, z)      # inside the knot, then easing out onto the shirt
        ZS.append(z); WS.append(w); YS.append(yf + (min(yf, yback - 0.004) - yf) * inside)
    for _ in range(14): YS = [YS[0]] + [min(YS[k], (YS[k - 1] + YS[k + 1]) / 2) for k in range(1, n)] + [YS[n]]      # a tie is stiff: it bridges a dip in the shirt instead of following it
    bcols = []; bw = []
    for z, w, y in zip(ZS, WS, YS):
        fr = [Vector(((-1 + 2 * k / 6) * w, y - 0.0018 * math.cos((-1 + 2 * k / 6) * math.pi / 2), z)) for k in range(7)]
        bk = [Vector((p.x * 0.97, y + 0.0016, z)) for p in reversed(fr)]
        ring = fr + bk; bcols.append(ring)
        ws = _nw_shirt_w(Vector((0, y + 0.004, z))); wz = sstep(zb + 0.004, zb - 0.03 * s, z); bw.append([_nw_mix(wk, ws, wz)] * len(ring))
    # rows of the blade run across it, so build it as columns down its length
    Vb = [[M.bm.verts.new(p) for p in ring] for ring in bcols]
    for wr in bw: M.W.extend(wr)
    bf = []; m = len(bcols[0])
    for a_, b_ in zip(Vb, Vb[1:]):
        for k in range(m): bf.append(M.bm.faces.new((a_[k], a_[(k + 1) % m], b_[(k + 1) % m], b_[k])))
    bf.append(M.bm.faces.new(list(reversed(Vb[0])))); bf.append(M.bm.faces.new(Vb[-1]))
    bmesh.ops.recalc_face_normals(M.bm, faces=bf)
    M.finish('Tie', 'Tie')
