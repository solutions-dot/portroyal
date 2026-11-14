# Make the first-person torch hand for Bog Walk, in Blender (bpy as a Python module, no GUI).
#
#   node tools/bog-walk/unpack_model.mjs hl_worker                     # build/bog-walk/hl_worker.glb, a plain glb Blender can read
#   ~/venv/bin/python3 -I tools/bog-walk/hand_blender.py -- [key=value ...]
#
# What it does:
#   1. Imports the shared character "hl_worker" (a MakeHuman body with a Mixamo skeleton) and keeps the right hand, the forearm and the shirt sleeve.
#   2. Poses the hand with real joint turns, worked out here in numpy (forward kinematics and dual quaternion skinning, so knuckles keep their volume
#      when they bend a long way):
#        - the handle (a cylinder) lies across the palm at a slant, as in a real power grip, pressed lightly into the palm;
#        - every finger (knuckle, middle joint, end joint) is closed by a search that wants each of its three parts to rest on the handle, nothing to go
#          into the handle, the palm or the finger beside it, and the joints to bend together the way real fingers do;
#        - the thumb is turned (a search over its three joints) so it lies UP along the handle, pressed against it, its tip above the index finger.
#   3. Bends the wrist so the forearm leaves toward you and down to the right, and moves everything into "grip space".
#   4. Welds the seams, turns triangles back into quads, smooths with Catmull-Clark subdivision (sub=, 1 by default), darkens the creases with ambient
#      occlusion baked into the vertices (the handle is in the scene while it bakes), and labels every face with its part.
#   5. Writes games/bog-walk/src/handmesh.js: one vertex list in grip space, the baked light per vertex, and [name, first triangle, count] for each named
#      part (palm, four fingers, thumb, thenar, wrist, sleeve, cuff, the nails), so the game can split it into the meshes its held check counts.
#
# Grip space: the handle is the y axis through (0, y, 0), +y up the handle (toward the thumb tip and the flame), +z toward the wrist (toward you in the game),
# +x toward the back of the hand. The middle of the fist is at the origin.
# Options: rh= the game's handle radius (m), scale= how much the model's (large) hand is shrunk to a real hand's size, slant= degrees the handle is turned
#   across the palm, back= how far the handle sits from the knuckles toward the wrist (m, model size), sub= subdivision levels (0, 1 or 2), ao=0 to skip
#   the bake, render=1 to also write preview pictures to build/bog-walk/hand_*.png, out= the module to write.
import bpy, bmesh, sys, math, json, base64, os, time
import numpy as np
from mathutils import Vector, Matrix

ARGS = dict(a.split('=', 1) for a in (sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []) if '=' in a)
num = lambda k, d: float(ARGS[k]) if k in ARGS else d
RH = num('rh', 0.0148)               # the handle's radius where the hand holds it (games/bog-walk/src/hand.js: RH)
SCALE = num('scale', 0.86)           # the model's hand is about 23 cm long; a grown man's is about 19 to 20 cm
RM = RH / SCALE                      # so the grip is worked out round this radius in the model's own size, and the hand is shrunk afterwards
SLANT = num('slant', 24) * math.pi / 180
BACK = num('back', 0.008)
SUB = int(num('sub', 1))
GLB = ARGS.get('glb', 'build/bog-walk/hl_worker.glb')
OUT = ARGS.get('out', 'games/bog-walk/src/handmesh.js')
DEG = math.pi / 180
T0 = time.time()
log = lambda *a: print('[%5.1fs]' % (time.time() - T0), *a, flush=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
arm = bpy.data.objects['Human.rig']
body, shirt = bpy.data.objects['Body'], bpy.data.objects['Shirt']
for b in arm.pose.bones: b.matrix_basis = Matrix.Identity(4)   # the bind pose: the mesh and the joints agree
bpy.context.view_layer.update()
FINGERS = ['Index', 'Middle', 'Ring', 'Pinky']
HANDJ = ['RightHand'] + ['RightHand%s%d' % (f, i) for f in FINGERS + ['Thumb'] for i in (1, 2, 3)]
REST = {b.name.replace('mixamorig:', ''): (np.array(b.head_local), np.array(b.tail_local)) for b in arm.data.bones}
HEAD = lambda n: REST[n][0]
TAIL = lambda n: REST[n][1]
BONES = list(REST.keys()); BI = {n: i for i, n in enumerate(BONES)}
PARENT = {b.name.replace('mixamorig:', ''): (b.parent.name.replace('mixamorig:', '') if b.parent else None) for b in arm.data.bones}

# ---------- the meshes we keep, welded at their seams, with their skin weights ----------
def take(obj, keep_dom):
    names = [g.name.replace('mixamorig:', '') for g in obj.vertex_groups]
    bm = bmesh.new(); bm.from_mesh(obj.data)
    dl = bm.verts.layers.deform.active
    def dom(v):
        d = v[dl]; return names[max(d.keys(), key=lambda k: d[k])] if len(d) else None
    bad = [f for f in bm.faces if not all(dom(v) in keep_dom for v in f.verts)]
    bmesh.ops.delete(bm, geom=bad, context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
    bm.verts.ensure_lookup_table(); bm.verts.index_update(); bm.faces.ensure_lookup_table()
    co = np.array([v.co[:] for v in bm.verts])
    W = np.zeros((len(bm.verts), len(BONES)))
    for v in bm.verts:
        for k, w in v[dl].items():
            n = names[k]
            if n in BI: W[v.index, BI[n]] += w
    W /= np.maximum(1e-9, W.sum(1, keepdims=True))
    return {'bm': bm, 'co': co, 'W': W, 'dom': [dom(v) for v in bm.verts]}

SK = take(body, set(HANDJ + ['RightForeArm']))
# The model's fingers are thick (about 22 mm across, a real finger is about 17), too thick to close round a torch handle, so each finger vertex is
# moved toward the axis of its own bone by slim= (1 leaves them alone). The thumb is left as it is.
SLIM = num('slim', 0.78)
for i, d in enumerate(SK['dom']):
    if d and any(d.startswith('RightHand' + fn) for fn in FINGERS):
        h, t = HEAD(d), TAIL(d); u = (SK['co'][i] - h) @ (t - h) / np.dot(t - h, t - h); c = h + (t - h) * min(1.0, max(0.0, u))
        SK['co'][i] = c + (SK['co'][i] - c) * SLIM
SH = take(shirt, {'RightArm'})
log('kept', len(SK['co']), 'skin vertices and', len(SH['co']), 'sleeve vertices')

# ---------- forward kinematics: every bone's transform (rest space to posed space) is a chain of turns about the joints' rest positions ----------
def rotm(axis, ang, about):
    a = np.array(axis, float); a /= np.linalg.norm(a); c, s = math.cos(ang), math.sin(ang); x, y, z = a
    R = np.array([[c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
                  [y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s],
                  [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c)]])
    M = np.eye(4); M[:3, :3] = R; M[:3, 3] = np.array(about) - R @ np.array(about); return M

LOCAL = {}            # bone -> its own turn (4x4, in rest space, about its head)
def mats():
    M = {}
    def get(n):
        if n in M: return M[n]
        p = PARENT[n]; base = get(p) if (p and n != 'RightForeArm') else np.eye(4)
        M[n] = base @ LOCAL.get(n, np.eye(4)); return M[n]
    out = np.tile(np.eye(4), (len(BONES), 1, 1))
    for n in HANDJ + ['RightForeArm']: out[BI[n]] = get(n)
    return out

def quat(R):
    t = np.trace(R)
    if t > 0: s = math.sqrt(t + 1) * 2; return np.array([0.25 * s, (R[2, 1] - R[1, 2]) / s, (R[0, 2] - R[2, 0]) / s, (R[1, 0] - R[0, 1]) / s])
    i = int(np.argmax(np.diag(R)))
    if i == 0: s = math.sqrt(1 + R[0, 0] - R[1, 1] - R[2, 2]) * 2; return np.array([(R[2, 1] - R[1, 2]) / s, 0.25 * s, (R[0, 1] + R[1, 0]) / s, (R[0, 2] + R[2, 0]) / s])
    if i == 1: s = math.sqrt(1 + R[1, 1] - R[0, 0] - R[2, 2]) * 2; return np.array([(R[0, 2] - R[2, 0]) / s, (R[0, 1] + R[1, 0]) / s, 0.25 * s, (R[1, 2] + R[2, 1]) / s])
    s = math.sqrt(1 + R[2, 2] - R[0, 0] - R[1, 1]) * 2; return np.array([(R[1, 0] - R[0, 1]) / s, (R[0, 2] + R[2, 0]) / s, (R[1, 2] + R[2, 1]) / s, 0.25 * s])
def qmul(a, b):   # rows of quaternions (w, x, y, z)
    w1, x1, y1, z1 = a.T; w2, x2, y2, z2 = b.T
    return np.stack([w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2, w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2, w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2, w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2], 1)

def skin(part, idx=None, M=None):
    """posed positions by dual quaternion skinning (keeps the volume of a knuckle that bends a long way, where plain linear blending pinches it)"""
    M = mats() if M is None else M
    co = part['co'] if idx is None else part['co'][idx]
    W = part['W'] if idx is None else part['W'][idx]
    used = np.nonzero(W.sum(0) > 1e-6)[0]
    Q = np.array([quat(M[b][:3, :3]) for b in used]); Tt = np.array([np.r_[0, M[b][:3, 3]] for b in used])
    D = 0.5 * qmul(Tt, Q)
    Wu = W[:, used]; piv = Q[np.argmax(Wu, 1)]                       # keep every blended quaternion on the same side as the vertex's main bone
    sg = np.sign(np.einsum('vk,bk->vb', piv, Q)); sg[sg == 0] = 1; Wq = Wu * sg
    qr = Wq @ Q; qd = Wq @ D; nr = np.linalg.norm(qr, axis=1, keepdims=True); qr /= nr; qd /= nr
    w, v = qr[:, :1], qr[:, 1:]
    t = 2 * (w * qd[:, 1:] - qd[:, :1] * v + np.cross(v, qd[:, 1:]))   # the translation of the blended dual quaternion: 2 qd conj(qr)
    rotv = co + 2 * np.cross(v, np.cross(v, co) + w * co)
    return rotv + t

ids = lambda part, names: np.array([i for i, d in enumerate(part['dom']) if d in names], dtype=int)

# ---------- the hand's own directions, at rest: f along the fingers, k across the knuckles toward the index finger, p out of the palm ----------
knuck = sum(HEAD('RightHand%s1' % fn) for fn in FINGERS) / 4
f = knuck - HEAD('RightHand'); f /= np.linalg.norm(f)
k = HEAD('RightHandIndex1') - HEAD('RightHandPinky1'); k -= f * (k @ f); k /= np.linalg.norm(k)
p = np.cross(k, f); p /= np.linalg.norm(p)       # a right hand: k x f points out of the palm
P0 = skin(SK)
log('palm side check (the thumb tip at rest lies on the palm side, so this is positive): %.3f' % ((TAIL('RightHandThumb3') - knuck) @ p))

def flex_axis(n):
    bd = TAIL(n) - HEAD(n); bd /= np.linalg.norm(bd); a = k - bd * (k @ bd); return a / np.linalg.norm(a)
SPREAD = {'Index': num('sIndex', -2), 'Middle': 0, 'Ring': num('sRing', 2), 'Pinky': num('sPinky', 5)}
def pose_finger(fn, ang):
    n1, n2, n3 = ['RightHand%s%d' % (fn, j) for j in (1, 2, 3)]
    LOCAL[n1] = rotm(flex_axis(n1), ang[0] * DEG, HEAD(n1)) @ rotm(p, SPREAD[fn] * DEG, HEAD(n1))
    LOCAL[n2] = rotm(flex_axis(n2), ang[1] * DEG, HEAD(n2))
    LOCAL[n3] = rotm(flex_axis(n3), ang[2] * DEG, HEAD(n3))

# ---------- where the handle goes: across the palm at a slant, its index end further toward the fingers, pressed a little into the palm ----------
AX = k * math.cos(SLANT) + f * math.sin(SLANT); AX /= np.linalg.norm(AX)
def radial(P, C, A=None):
    A = AX if A is None else A
    d = P - C; d = d - np.outer(d @ A, A); return np.linalg.norm(d, axis=1)
thW = SK['W'][:, BI['RightHandThumb1']] + SK['W'][:, BI['RightHandThumb2']]
palmI = np.array([i for i, d in enumerate(SK['dom']) if d == 'RightHand' and thW[i] < 0.1 and (P0[i] - knuck) @ p > 0], dtype=int)
def palm_gap(s_):
    C_ = knuck - f * BACK + p * s_; P = P0[palmI]; near = np.abs((P - C_) @ AX) < 0.06
    return radial(P[near], C_).min() - RM
s_ = 0.1
# The model's palm is thick (its skin lies about 22 mm out from the knuckle joints, more than a real hand), so the handle is let into the soft palm a little
# ("sink"); the skin it would go into is pressed out onto the handle's surface afterwards (below), as a real palm squashes round a handle.
while palm_gap(s_ - 0.0002) > -num('sink', 0.009): s_ -= 0.0002
C = knuck - f * BACK + p * s_
log('handle centre %.1f mm out of the palm side of the knuckles; grip radius %.1f mm in model size (scale %.2f)' % (s_ * 1000, RM * 1000, SCALE))

# ---------- close each finger ----------
palmAll = np.array([i for i, d in enumerate(SK['dom']) if d in ('RightHand', 'RightHandThumb1')], dtype=int)
PALM = P0[palmAll]                         # the palm does not move while the fingers close
def along(i, n):
    h, t = HEAD(n), TAIL(n); return (P0[i] - h) @ (t - h) / np.dot(t - h, t - h)
report = {'fingers': {}, 'gapsMm': {}}
PRESS = num('press', 0.0008)              # skin is soft: a finger pad presses this far into the handle
ALLOW = num('allow', 0.0028)              # and the folds of skin by a bent joint may go this far in before they count as going through it
ORDER = ['Middle', 'Ring', 'Index', 'Pinky']
LIM = np.array([100, 115, 90])
FD = {}
for fn in FINGERS:
    names3 = ['RightHand%s%d' % (fn, j) for j in (1, 2, 3)]
    allI = ids(SK, set(names3)); loc = {i: j for j, i in enumerate(allI)}
    segs = [np.array([loc[i] for i in ids(SK, {n}) if along(i, n) > (0.3 if j == 0 else 0.0)], dtype=int) for j, n in enumerate(names3)]
    pads = [np.array([loc[i] for i in ids(SK, {n}) if 0.25 < along(i, n) < (0.8 if j < 2 else 0.7)], dtype=int) for j, n in enumerate(names3)]   # the middle of each part's pad, which should rest on the handle
    tm = np.array([loc[i] for i in np.r_[ids(SK, {names3[1]}), [i for i in ids(SK, {names3[2]}) if along(i, names3[2]) > 0.2]]], dtype=int)
    FD[fn] = dict(names=names3, allI=allI, segs=segs, pads=pads, segL=np.concatenate(segs), tm=tm)

def solve_fingers(C_, A_, quick=False, verbose=True):
    """close every finger round a handle with centre C_ and direction A_; returns the total cost, the angles and the posed fingers"""
    posed, angs, total, infos = {}, {}, 0, {}
    for fn in ORDER:
        F = FD[fn]; nb = [posed[o] for o in posed if abs(FINGERS.index(o) - FINGERS.index(fn)) == 1]
        def evalf(a, verbose=False):
            pose_finger(fn, a); M = mats(); P = skin(SK, F['allI'], M)
            g = [radial(P[s2], C_, A_).min() - RM for s2 in F['pads']]
            fit = sum(w_ * (g_ + PRESS) ** 2 for w_, g_ in zip((1.0, 1.4, 1.0), g)) * 4e5
            r = radial(P[F['segL']], C_, A_) - RM      # the base of the finger, by the knuckle, is soft skin that is pressed out later, so it is not counted here
            pen = np.sum(np.minimum(0, r + ALLOW) ** 2) * 5e7     # deeper than ALLOW: the creases by the joints may go a little way in (pressed out later)
            dd = np.sqrt(((P[F['tm']][:, None, :] - PALM[None, ::2, :]) ** 2).sum(-1)).min(1)
            palm = np.sum(np.minimum(0, dd - 0.0025) ** 2) * 2e7
            tip = (M[BI[F['names'][2]]] @ np.r_[TAIL(F['names'][2]), 1])[:3]
            reach = (max(0, np.sqrt(((PALM - tip) ** 2).sum(1)).min() - 0.006) / 0.01) ** 2 * num('reach', 1.0)   # a real fist closes until the fingertips come near the palm
            clash = 0
            for Q_ in nb:
                dq = np.sqrt(((P[::2, None, :] - Q_[None, ::2, :]) ** 2).sum(-1)).min(1)
                clash += np.sum(np.minimum(0, dq - 0.0028) ** 2) * 2e7
            reg = 0
            tot = fit + pen + palm + reach + clash + reg
            if verbose: return tot, dict(gapsMm=[round(float(x) * 1000, 2) for x in g], fit=round(float(fit), 3), pen=round(float(pen), 3), palm=round(float(palm), 3), reach=round(float(reach), 3), clash=round(float(clash), 3), reg=round(float(reg), 3))
            return tot
        if 'dbg' in ARGS:
            for a_ in ([18, 82, 1], [40, 70, 50], [50, 80, 60], [60, 90, 60], [70, 90, 70], [30, 100, 70]): log('   try', fn, a_, evalf(a_, True))
        # Real fingers bend all three joints together: the middle joint most, the knuckle a little less, the end joint about 0.7 of the middle one.
        # So the search is over how far the finger closes (c, the middle joint) and how the knuckle and end joint share it (k1, k3).
        nat = lambda c, k1, k3: [k1 * c, c, k3 * c]
        best = None
        for c in range(0, 116, 4 if quick else 2):
            for k1 in (0.3, 0.45, 0.6, 0.75, 0.9, 1.05):
                v = evalf(nat(c, k1, 0.72))
                if best is None or v < best[0]: best = (v, [c, k1, 0.72])
        y0 = np.array(best[1], float); steps = np.array([3.0, 0.08, 0.06])
        while steps[0] > (1.0 if quick else 0.25):            # then a pattern search to polish
            moved = False
            for j in range(3):
                for sgn in (1, -1):
                    y = y0.copy(); y[j] += sgn * steps[j]; y[2] = min(1.0, max(0.5, y[2])); y[1] = min(1.1, max(0.25, y[1]))
                    v = evalf(nat(*y))
                    if v < best[0]: best = (v, list(y)); y0 = y; moved = True
            if not moved: steps /= 2
        x = np.minimum(LIM, np.array(nat(*y0)))
        tot, info = evalf(x, True); total += tot; infos[fn] = info
        posed[fn] = skin(SK, F['allI']); angs[fn] = [round(float(q), 1) for q in x]
        if verbose: log(fn, 'bent', angs[fn], info)
    return total, angs, posed, infos

def handle_at(back, sink, slant):
    A_ = k * math.cos(slant * DEG) + f * math.sin(slant * DEG); A_ /= np.linalg.norm(A_)
    def gap(s2):
        C2 = knuck - f * back + p * s2; P = P0[palmI]; near = np.abs((P - C2) @ A_) < 0.06
        return radial(P[near], C2, A_).min() - RM
    s2 = 0.1
    while gap(s2 - 0.0002) > -sink and s2 > -0.05: s2 -= 0.0002
    return knuck - f * back + p * s2, A_

if 'search' in ARGS:   # try handle placements (back, sink, slant) and keep the one where the fingers close best
    res = []
    for bk in [float(q) for q in ARGS.get('backs', '-0.02,-0.01,0').split(',')]:
        for sk in [float(q) for q in ARGS.get('sinks', '0.002,0.006').split(',')]:
            for sl in [float(q) for q in ARGS.get('slants', '12,24').split(',')]:
                C_, A_ = handle_at(bk, sk, sl); tot, angs, _, inf = solve_fingers(C_, A_, quick=True, verbose=False)
                res.append((tot, bk, sk, sl)); log('back %.3f sink %.3f slant %d: cost %.2f' % (bk, sk, sl, tot), angs)
    res.sort(); log('best placements', res[:5])
    sys.exit(0)
C, AX = handle_at(BACK, num('sink', 0.004), SLANT / DEG)
# ---------- close the fingers: each finger is bent along a path that leaves its knuckle, runs straight to the handle's surface, then goes round the handle in a
# circle (the fingers' own length decides how far round it gets), and the finger's skin is carried along that path (every vertex keeps its distance along the finger and
# its offsets across it). The fingers are stacked along the handle, close together, as in a real fist. The joints are not turned one by one: a finger is not a rigid rod
# at a joint but a soft tube that follows the handle, and this closes all four fully, which a search over the joint angles could not (it kept stopping short). ----------
e_f = f - (f @ AX) * AX; e_f /= np.linalg.norm(e_f)      # in the plane across the handle: along the fingers, and toward the palm side
e_p = p - (p @ AX) * AX; e_p /= np.linalg.norm(e_p)
STRETCH = num('stretch', 1.1)    # the model's fingers are short for a thin handle; stretching them a little along their length lets the tips reach the palm
RHO = RM + num('rho', 0.0092)    # the radius of the path of a finger's own axis round the handle: the handle's radius and the depth of the finger's pad
SQ = num('squeeze', 0.8)         # how close together the fingers are stacked along the handle (1 keeps the knuckles' spacing)
cross2 = lambda a_, b_: a_[0] * b_[1] - a_[1] * b_[0]
J0s = {fn: HEAD('RightHand%s1' % fn) for fn in FINGERS}
hs = {fn: (J0s[fn] - C) @ AX for fn in FINGERS}; hm = np.mean(list(hs.values()))
D = np.zeros_like(SK['co']); SREST = np.zeros(len(SK['co'])); FWHICH = np.full(len(SK['co']), -1)
POSED = {}; wrapinfo = {}
for fi_, fn in enumerate(FINGERS):
    names3 = ['RightHand%s%d' % (fn, j) for j in (1, 2, 3)]
    J0, J3 = J0s[fn], TAIL(names3[2]); fdir = (J3 - J0) / np.linalg.norm(J3 - J0)
    pd = p - fdir * (p @ fdir); pd /= np.linalg.norm(pd); kd = np.cross(fdir, pd); ksign = 1.0 if kd @ AX > 0 else -1.0
    q0 = np.array([(J0 - C) @ e_f, (J0 - C) @ e_p]); h_i = hm + (hs[fn] - hm) * SQ
    # the straight part: from the knuckle to the point where it touches the circle (tangent), the circle then taken in the direction that curls toward the palm
    phis = np.linspace(-math.pi * 0.999, math.pi * 0.999, 6000); Tp = RHO * np.c_[np.cos(phis), np.sin(phis)]; tg = np.c_[-np.sin(phis), np.cos(phis)]
    v_ = Tp - q0; g = v_[:, 0] * tg[:, 1] - v_[:, 1] * tg[:, 0]; dt = (v_ * tg).sum(1)
    cand_ = [i for i in range(len(phis) - 1) if g[i] * g[i + 1] <= 0 and dt[i] > 0]
    ph_t = phis[cand_[0]]; Tpt = RHO * np.array([math.cos(ph_t), math.sin(ph_t)]); seg = np.linalg.norm(Tpt - q0); ds = (Tpt - q0) / seg
    wrapinfo[fn] = dict(segMm=round(seg * 1000, 1), startDeg=round(math.degrees(ph_t), 1))
    nrm_s = np.array([-ds[1], ds[0]]);  nrm_s = nrm_s if nrm_s @ (-q0) > 0 else -nrm_s     # across the straight part, toward the handle (the pad side)
    def path(sv):
        sv = np.asarray(sv); pos = np.zeros((len(sv), 2)); nr = np.zeros((len(sv), 2))
        ins = sv <= seg; pos[ins] = q0 + np.outer(sv[ins], ds); nr[ins] = nrm_s
        a_ = ph_t + (sv[~ins] - seg) / RHO; pos[~ins] = RHO * np.c_[np.cos(a_), np.sin(a_)]; nr[~ins] = -np.c_[np.cos(a_), np.sin(a_)]
        return pos, nr
    # weight of each vertex to this finger: how much of it the finger's three bones own
    wF = SK['W'][:, [BI[n] for n in names3]].sum(1)
    sel = np.nonzero(wF > 0.02)[0]
    rel = SK['co'][sel] - J0; sr = rel @ fdir; perp = rel - np.outer(sr, fdir); op = perp @ pd; ok = perp @ kd
    pos, nr = path(sr * STRETCH)
    tgt = C + np.outer(pos[:, 0], e_f) + np.outer(pos[:, 1], e_p) + np.outer(np.full(len(sel), h_i), AX) + np.outer(op * num('padk', 1.0), np.zeros(3))
    tgt = tgt + np.outer(op, np.zeros(3)) + nr[:, :1] * op[:, None] * e_f + nr[:, 1:] * op[:, None] * e_p + np.outer(ok * ksign, AX)
    D[sel] += (tgt - SK['co'][sel]) * wF[sel, None]
    inFinger = ids(SK, set(names3)); POSED[fn] = None
    SREST[sel] = np.maximum(SREST[sel], sr * STRETCH); FWHICH[inFinger] = fi_
    log(fn, 'wrapped: straight part %.1f mm, circle starts at %.0f degrees, finger path %.1f mm' % (seg * 1000, math.degrees(ph_t), np.linalg.norm(J3 - J0) * STRETCH * 1000))
report['wrap'] = wrapinfo
for fn in FINGERS: POSED[fn] = (SK['co'] + D)[ids(SK, {'RightHand%s%d' % (fn, j) for j in (1, 2, 3)})]

# ---------- the thumb: a search over its joints so it lies up along the handle, pressed on it ----------
thI = ids(SK, {'RightHandThumb2', 'RightHandThumb3'}); th3 = ids(SK, {'RightHandThumb3'}); th2 = ids(SK, {'RightHandThumb2'})
fiP = np.concatenate([POSED[fn] for fn in FINGERS])
WANT = -f - AX * ((-f) @ AX); WANT /= np.linalg.norm(WANT); WANT = WANT + (-p) * num('tside', 0.35); WANT /= np.linalg.norm(WANT)   # the side the thumb lies on: toward the wrist, a little round toward the back
def pose_thumb(x):
    n1, n2, n3 = 'RightHandThumb1', 'RightHandThumb2', 'RightHandThumb3'
    LOCAL[n1] = rotm(AX, x[0], HEAD(n1)) @ rotm(p, x[1], HEAD(n1)) @ rotm(f, x[2], HEAD(n1))
    for n, a, b in ((n2, x[3], x[4]), (n3, x[5], 0)):
        bd = TAIL(n) - HEAD(n); bd /= np.linalg.norm(bd); lat = np.cross(bd, p); lat /= np.linalg.norm(lat)
        LOCAL[n] = rotm(lat, a, HEAD(n)) @ (rotm(bd, b, HEAD(n)) if b else np.eye(4))
def thumb_cost(x, verbose=False):
    pose_thumb(x); M = mats()
    P = skin(SK, thI, M); d = radial(P, C) - RM
    pen = np.sum(np.minimum(0, d + PRESS) ** 2) * 4e7
    P3 = P[np.isin(thI, th3)]; P2 = P[np.isin(thI, th2)]
    c3 = (radial(P3, C).min() - RM + PRESS * 0.5) ** 2 * 4e5
    c2 = (radial(P2, C).min() - RM + PRESS * 0.5) ** 2 * 1.5e5
    tipP = (M[BI['RightHandThumb3']] @ np.r_[TAIL('RightHandThumb3'), 1])[:3]; baseP = (M[BI['RightHandThumb2']] @ np.r_[HEAD('RightHandThumb2'), 1])[:3]
    dirn = tipP - baseP; dirn /= np.linalg.norm(dirn)
    align = (1 - dirn @ AX) * 30
    m3 = P3.mean(0) - C; m3 -= AX * (m3 @ AX); m3 /= np.linalg.norm(m3)
    side = (1 - m3 @ WANT) * 12
    dd = np.sqrt(((P[:, None, :] - fiP[None, ::2, :]) ** 2).sum(-1)).min(1)
    clash = np.sum(np.minimum(0, dd - 0.0035) ** 2) * 2e7
    reg = sum(v * v for v in x) * 0.3
    cost = pen + c3 + c2 + align + side + clash + reg
    if verbose: log('thumb cost', {k_: round(float(v_), 3) for k_, v_ in dict(pen=pen, c3=c3, c2=c2, align=align, side=side, clash=clash, reg=reg).items()})
    return cost

def nelder_mead(fn, x0, step=0.3, iters=500):
    n = len(x0); pts = [np.array(x0, float)] + [np.array(x0, float) + np.eye(n)[i] * step for i in range(n)]
    vals = [fn(q) for q in pts]
    for it in range(iters):
        o = np.argsort(vals); pts = [pts[i] for i in o]; vals = [vals[i] for i in o]
        c = np.mean(pts[:-1], 0); r = c + (c - pts[-1]); fr = fn(r)
        if fr < vals[0]:
            e = c + 2 * (c - pts[-1]); fe = fn(e)
            if fe < fr: pts[-1], vals[-1] = e, fe
            else: pts[-1], vals[-1] = r, fr
        elif fr < vals[-2]: pts[-1], vals[-1] = r, fr
        else:
            ct = c + 0.5 * (pts[-1] - c); fc = fn(ct)
            if fc < vals[-1]: pts[-1], vals[-1] = ct, fc
            else:
                pts = [pts[0]] + [pts[0] + 0.5 * (q - pts[0]) for q in pts[1:]]; vals = [vals[0]] + [fn(q) for q in pts[1:]]
    i = int(np.argmin(vals)); return pts[i], vals[i]

best = None
for start in ([0, 0, 0, 0, 0, 0], [0.5, 0, 0, 0.3, 0, 0.2], [-0.5, 0, 0, 0.3, 0, 0.2], [0, 0.5, 0, 0, 0, 0], [0, -0.5, 0, 0, 0, 0], [0, 0, 0.6, 0.2, 0, 0], [0, 0, -0.6, 0.2, 0, 0]):
    x, v = nelder_mead(thumb_cost, start, 0.35, 260)
    if best is None or v < best[1]: best = (x, v)
x, v = nelder_mead(thumb_cost, best[0], 0.08, 300)
thumb_cost(x, True); report['thumb'] = [round(float(q) / DEG, 1) for q in x]
log('thumb angles', report['thumb'])

# ---------- the wrist: turn the hand on the forearm so the forearm leaves toward the lower right, toward you (fx= fy= fz= in grip space) ----------
def frame(A_, f_):
    yv = np.array(A_); zv = -f_ - A_ * ((-f_) @ A_); zv = zv / np.linalg.norm(zv); return yv, zv, np.cross(yv, zv)
yv, zv, xv = frame(AX, f)
ROLL = num('roll', 30) * DEG   # turn the whole hand about the handle, so the curled fingers face the player a little more
RY = np.array([[math.cos(ROLL), 0, -math.sin(ROLL)], [0, 1, 0], [math.sin(ROLL), 0, math.cos(ROLL)]])   # x' = x cos + z sin, z' = -x sin + z cos (row vectors)
want = np.array([num('fx', 0.3), num('fy', -0.42), num('fz', 0.85)]); want /= np.linalg.norm(want); want = want @ RY.T   # the direction the player sees, turned back to before the roll
wantW = want[0] * xv + want[1] * yv + want[2] * zv
have = HEAD('RightForeArm') - HEAD('RightHand'); have /= np.linalg.norm(have)
# the hand turns so that the forearm's direction, seen from the hand, becomes "want": the hand turns by the rotation taking wantW to have
ax_ = np.cross(wantW, have); ang_ = math.atan2(np.linalg.norm(ax_), wantW @ have)
Wm = rotm(ax_, ang_, HEAD('RightHand')) if ang_ > 1e-6 else np.eye(4)
LOCAL['RightHand'] = Wm
R3 = Wm[:3, :3]
Cg = (Wm @ np.r_[C, 1])[:3]; AXg = R3 @ AX; fg = R3 @ f; pg = R3 @ p
report['wristTurn'] = round(math.degrees(ang_), 1)
log('wrist turned %.0f degrees' % math.degrees(ang_))

# ---------- grip space ----------
M = mats()
Pall = skin(SK, None, M) + D @ R3.T   # the wrist turned the whole hand; the wrapped fingers' displacements turn with it
# soft skin: anything inside the handle is pressed out onto its surface, and the push fades out over the neighbouring skin so there is no ridge
def press_out(P, C_, A_, keep_in):
    r = radial(P, C_, A_); d = P - C_; d -= np.outer(d @ A_, A_); u = d / np.maximum(1e-9, np.linalg.norm(d, axis=1, keepdims=True))
    return u * np.maximum(0, (RM - keep_in) - r)[:, None]
nbr = [[] for _ in SK['co']]
for e in SK['bm'].edges: a_, b_ = e.verts[0].index, e.verts[1].index; nbr[a_].append(b_); nbr[b_].append(a_)
for it in range(int(num('pressIters', 6))):
    D = press_out(Pall, Cg, AXg, PRESS)
    if not D.any(): break
    for _ in range(4):   # spread the push to the neighbours (the pushed vertices keep theirs)
        D2 = np.array([D[n_].mean(0) if n_ else D[i] for i, n_ in enumerate(nbr)]); big = np.linalg.norm(D, axis=1) >= np.linalg.norm(D2, axis=1); D = np.where(big[:, None], D, D2 * 0.8)
    Pall = Pall + D
log('soft skin: the most the handle still goes into the skin is %.2f mm' % max(0, (RM - radial(Pall, Cg, AXg).min()) * 1000))
yv, zv, xv = frame(AXg, fg)
iy = [(Pall[ids(SK, {'RightHand%s2' % fn})] - Cg) @ yv for fn in ('Index', 'Pinky')]
O = Cg + yv * (iy[0].mean() + iy[1].mean()) / 2
G = lambda P: (np.c_[(P - O) @ xv, (P - O) @ yv, (P - O) @ zv] @ RY) * SCALE
fore = HEAD('RightForeArm') - HEAD('RightHand'); fore /= np.linalg.norm(fore)
report['forearm'] = [round(float(v_), 3) for v_ in (fore @ xv, fore @ yv, fore @ zv)]
log('forearm direction in grip space', report['forearm'])

# ---------- one mesh: posed skin and sleeve in grip space, every face labelled with its part ----------
PARTS = ['palm', 'finger', 'finger', 'finger', 'finger', 'thumb', 'thenar', 'wrist', 'sleeve', 'fingernail', 'fingernail', 'fingernail', 'fingernail', 'thumbnail', 'cuff']
def part_of(d):
    if d == 'RightHand': return 0
    if d == 'RightForeArm': return 7
    for i, fn in enumerate(FINGERS):
        if d.startswith('RightHand' + fn): return 1 + i
    return 6 if d == 'RightHandThumb1' else 5

EL = HEAD('RightForeArm'); WR = HEAD('RightHand')
tfore = lambda P: (P - EL) @ (WR - EL) / np.dot(WR - EL, WR - EL)    # 0 at the elbow, 1 at the wrist (rest space)
FCUT = num('forecut', 0.36)       # keep the forearm from this far down from the elbow: only its lower part is ever on screen
out = bmesh.new(); play = out.faces.layers.int.new('part')
def add_part(src, P, label, keep=None):
    bm = src['bm']; vs = [out.verts.new(q) for q in G(P)]
    for fc in bm.faces:
        if keep and not keep(fc): continue
        nf = out.faces.new([vs[v.index] for v in fc.verts])
        doms = [src['dom'][v.index] for v in fc.verts]
        nf[play] = label(max(set(doms), key=doms.count))
SREST_OUT = {i: SREST[i] for i in range(len(SREST))}   # (the skin's vertices come first in the output mesh, in the same order)
add_part(SK, Pall, part_of, lambda fc: min(tfore(np.array(v.co)) for v in fc.verts) > FCUT)

# a short rolled cuff and the open end of a sleeve, built round the forearm (the shirt mesh only reaches the upper arm). Rings along the forearm, quads between them.
AXF = (WR - EL) / np.linalg.norm(WR - EL); uF = np.cross(AXF, [0, 0, 1.0]); uF /= np.linalg.norm(uF); vF = np.cross(AXF, uF)
ST = SK['co']; tS = tfore(ST); domF = np.array([d == 'RightForeArm' for d in SK['dom']])
def forearm_r(t):
    t = max(t, float(tS[domF].min()) + 0.04)     # the kept forearm only reaches so far up; further up the radius is taken from its upper end
    sel = domF & (np.abs(tS - t) < 0.04); d = ST[sel] - EL - np.outer((ST[sel] - EL) @ AXF, AXF); return float(np.median(np.linalg.norm(d, axis=1)))
RINGS = [(0.30, 1.50, 8), (0.38, 1.42, 8), (0.46, 1.32, 8), (0.51, 1.25, 8), (0.52, 1.25, 14), (0.55, 1.36, 14), (0.58, 1.36, 14), (0.605, 1.20, 14), (0.612, 1.06, 14)]
NS = 20; rows = []
for t_, m_, lab_ in RINGS:
    r_ = forearm_r(t_) * m_ if t_ < 0.6 else forearm_r(0.58) * m_; ctr = EL + (WR - EL) * t_
    pts = np.array([ctr + (uF * math.cos(2 * math.pi * j / NS) + vF * math.sin(2 * math.pi * j / NS)) * r_ for j in range(NS)])
    rows.append(([out.verts.new(q) for q in G(pts)], lab_))
cuffF = []
for (ra, la), (rb, lb) in zip(rows[:-1], rows[1:]):
    for j in range(NS):
        fc = out.faces.new([ra[j], ra[(j + 1) % NS], rb[(j + 1) % NS], rb[j]]); fc[play] = lb if lb == 14 else 8; cuffF.append(fc)
out.normal_update(); cen = np.mean([np.array(v.co) for v in rows[3][0]], axis=0)
if np.mean([np.array(fc.normal) @ (np.array(fc.calc_center_median()) - cen) for fc in cuffF[:NS]]) < 0:
    for fc in cuffF: fc.normal_flip()

# the nails: on each end joint, the faces on the back of the finger, toward its tip
out.verts.index_update(); out.faces.ensure_lookup_table(); out.normal_update()
for i, fn in enumerate(FINGERS):
    cand = [fc for fc in out.faces if fc[play] == 1 + i]
    L3 = np.linalg.norm(TAIL('RightHand%s3' % fn) - HEAD('RightHand%s3' % fn)) * STRETCH; tipS = max(SREST[ids(SK, {'RightHand%s3' % fn})])
    for fc in cand:
        c = np.array(fc.calc_center_median()); r = np.array([c[0], 0, c[2]]); rn = np.linalg.norm(r)
        sv = np.mean([SREST_OUT.get(v.index, 0) for v in fc.verts])
        if sv < tipS - L3 * (1 - num('nailFrom', 0.38)) or sv > tipS * 0.995: continue
        if rn > 1e-6 and np.array(fc.normal) @ (r / rn) > num('nailCos', 0.55): fc[play] = 9 + i
for i, fn in enumerate(['Thumb']):
    n = 'RightHand%s3' % fn; Mb = M[BI[n]]
    h, t = G(np.array([(Mb @ np.r_[HEAD(n), 1])[:3]]))[0], G(np.array([(Mb @ np.r_[TAIL(n), 1])[:3]]))[0]
    bd = (t - h) / np.linalg.norm(t - h)
    back = Mb[:3, :3] @ (-p); back = np.array([back @ xv, back @ yv, back @ zv]) @ RY; back -= bd * (back @ bd); back /= np.linalg.norm(back)
    cand = [fc for fc in out.faces if fc[play] == 5]
    tipd = max(((np.array(v.co) - h) @ bd for fc in cand for v in fc.verts))
    for fc in cand:
        c = np.array(fc.calc_center_median()); tq = (c - h) @ bd
        if tq < tipd * 0.4 or tq > tipd * 0.97: continue
        rv = (c - h) - bd * tq; up = rv @ back
        if up > 0 and np.array(fc.normal) @ back > 0.7 and up > np.linalg.norm(rv) * 0.75: fc[play] = 13

bmesh.ops.delete(out, geom=[v for v in out.verts if not v.link_faces], context='VERTS')
if num('dissolve', 0.06) > 0:   # drop the vertices on nearly flat ground (the forearm, the back of the hand), never across two parts, to keep the phone's triangle count down
    for fc in out.faces: fc.material_index = fc[play]
    bmesh.ops.dissolve_limit(out, angle_limit=num('dissolve', 0.06), use_dissolve_boundaries=False, verts=out.verts[:], edges=out.edges[:], delimit={'MATERIAL'})
    bmesh.ops.triangulate(out, faces=out.faces[:], quad_method='BEAUTY', ngon_method='BEAUTY')
bmesh.ops.join_triangles(out, faces=out.faces[:], angle_face_threshold=math.pi, angle_shape_threshold=math.pi, cmp_seam=False, cmp_sharp=False, cmp_uvs=False, cmp_vcols=False, cmp_materials=False)
me = bpy.data.meshes.new('hand'); out.to_mesh(me)
for poly in me.polygons: poly.use_smooth = True
ob = bpy.data.objects.new('hand', me); bpy.context.scene.collection.objects.link(ob)
for o in list(bpy.data.objects):
    if o is not ob: o.hide_render = True
log('before subdivision:', len(me.vertices), 'vertices,', len(me.polygons), 'faces')
if SUB:
    md = ob.modifiers.new('sub', 'SUBSURF'); md.levels = md.render_levels = SUB; md.uv_smooth = 'NONE'; md.boundary_smooth = 'PRESERVE_CORNERS'
    dg = bpy.context.evaluated_depsgraph_get(); me2 = bpy.data.meshes.new_from_object(ob.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    ob.modifiers.clear(); ob.data = me2; me = me2
    for poly in me.polygons: poly.use_smooth = True

# the handle, only while the occlusion bakes, so the skin is darker where it holds the handle
bpy.ops.mesh.primitive_cylinder_add(radius=RH, depth=0.4, vertices=32, location=(0, 0, 0))
handle = bpy.context.active_object; handle.rotation_euler = (math.pi / 2, 0, 0)   # Blender's cylinder runs along z; grip space wants y
vl = bpy.context.view_layer
ao = np.ones(len(me.vertices))
if num('ao', 1):
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = int(num('aoSamples', 96))
    sc.world = bpy.data.worlds.new('w'); sc.world.light_settings.distance = num('aoDist', 0.025)
    me.color_attributes.new('bake', 'FLOAT_COLOR', 'POINT'); me.color_attributes.active_color = me.color_attributes['bake']
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True); vl.objects.active = ob
    mat = bpy.data.materials.new('bake'); me.materials.append(mat)
    bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
    ao = np.array([c.color[0] for c in me.color_attributes['bake'].data])
    log('ambient occlusion: min %.2f mean %.2f' % (ao.min(), ao.mean()))

# ---------- write the game's module ----------
me.calc_loop_triangles()
V = np.array([v.co[:] for v in me.vertices]); pa = np.zeros(len(me.polygons), dtype=np.int32)
me.attributes['part'].data.foreach_get('value', pa)
tris = np.array([t.vertices[:] for t in me.loop_triangles]); tpart = pa[[t.polygon_index for t in me.loop_triangles]]
order_ = np.argsort(tpart, kind='stable'); tris = tris[order_]; tpart = tpart[order_]
# the cuff: the sleeve's lowest band, as its own part (a rolled-up sleeve), so the check can tell it from the sleeve
ranges = []
for lab in range(len(PARTS)):
    w = np.nonzero(tpart == lab)[0]
    if len(w): ranges.append([PARTS[lab], int(w[0]), int(len(w))])
S = np.abs(V).max() / 32767
b64 = lambda a: base64.b64encode(a.tobytes()).decode()
rad = np.hypot(V[:, 0], V[:, 2]) - RH
for lab in range(len(PARTS)):
    vi = np.unique(tris[tpart == lab])
    if len(vi): report['gapsMm'].setdefault(PARTS[lab], []).append(round(float(rad[vi].min()) * 1000, 2))
report.update(handleRadius=RH, scale=SCALE, slant=round(SLANT / DEG, 1), subdivision=SUB, verts=int(len(V)), tris=int(len(tris)),
              box=[[round(float(q), 4) for q in V.min(0)], [round(float(q), 4) for q in V.max(0)]])
data = {'info': report, 'smooth': int(num('smooth', 0 if SUB else 1)), 'scale': S, 'n': int(len(V)), 'pos': b64(np.round(V / S).astype('<i2')), 'ao': b64(np.round(np.clip(ao, 0, 1) * 255).astype('u1')),
        'idx': b64(tris.astype('<u2').ravel()), 'parts': ranges}
with open(OUT, 'w') as fh:
    fh.write('/* Made by tools/bog-walk/hand_blender.py from the shared character model "hl_worker". Do not edit by hand: run the tool again (docs/games/bog-walk.md).\n'
             '   A right hand closed round a handle of radius %g m, with its forearm and shirt sleeve, in grip space (the handle is the y axis, +y up the handle,\n'
             '   +z toward the wrist, +x toward the back of the hand, the middle of the fist at the origin). Positions are 16-bit numbers times "scale"; "ao" is how\n'
             '   much light reaches each vertex (0 to 255); "parts" lists [name, first triangle, triangle count] for each named part. */\n' % RH)
    fh.write('export const HANDMESH = ' + json.dumps(data, separators=(',', ':')) + ';\n')
log(json.dumps(report))
log('wrote', OUT, os.path.getsize(OUT), 'bytes')

# ---------- preview pictures (render=1) ----------
if num('render', 0):
    handle.hide_render = False; handle.scale = (1, 1, 0.3)   # a short handle, so the view from the top sees into the fist
    for o in (ob, handle): o.rotation_euler = (math.pi / 2 + o.rotation_euler[0], 0, 0)   # Blender's up is z: turn grip space's y up to it
    zup = lambda q: (q[0], -q[2], q[1])
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.render.resolution_x = 560; sc.render.resolution_y = 560
    sc.world = sc.world or bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[1].default_value = 1.2
    skinM = bpy.data.materials.new('skin'); skinM.use_nodes = True; nt = skinM.node_tree; bs = nt.nodes['Principled BSDF']; bs.inputs['Roughness'].default_value = 0.55
    bs.inputs['Base Color'].default_value = (0.55, 0.3, 0.18, 1)
    if num('ao', 1):   # show the baked light: base colour times the bake
        ca = nt.nodes.new('ShaderNodeAttribute'); ca.attribute_name = 'bake'; mul = nt.nodes.new('ShaderNodeVectorMath'); mul.operation = 'MULTIPLY'
        mul.inputs[1].default_value = (0.55, 0.3, 0.18); nt.links.new(ca.outputs['Color'], mul.inputs[0]); nt.links.new(mul.outputs[0], bs.inputs['Base Color'])
    ob.data.materials.clear(); ob.data.materials.append(skinM)
    woodM = bpy.data.materials.new('wood'); woodM.use_nodes = True; woodM.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.5, 0.35, 0.2, 1); handle.data.materials.append(woodM)
    L = bpy.data.lights.new('l', 'SUN'); L.energy = 3; lo_ = bpy.data.objects.new('l', L); sc.collection.objects.link(lo_); lo_.rotation_euler = (0.6, 0.3, 0.8)
    cam = bpy.data.cameras.new('c'); cam.lens = 50; co_ = bpy.data.objects.new('c', cam); sc.collection.objects.link(co_); sc.camera = co_
    for name, pos in (('eye', (-0.09, 0.16, 0.30)), ('front', (-0.05, 0.05, -0.32)), ('left', (-0.32, 0.06, 0.05)), ('right', (0.32, 0.05, 0.02)), ('top', (0, 0.4, 0))):
        pos = zup(pos); co_.location = pos; d = Vector((0, 0, 0)) - Vector(pos); co_.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler() if name != 'top' else (0, 0, 0)
        cam.type = 'ORTHO' if name == 'top' else 'PERSP'; cam.ortho_scale = 0.16
        sc.render.filepath = os.path.abspath('build/bog-walk/hand_%s.png' % name); bpy.ops.render.render(write_still=True)
    log('rendered previews')
