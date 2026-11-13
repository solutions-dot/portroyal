# Make the first-person torch hand for Bog Walk, in Blender (bpy as a Python module, no GUI).
#
#   node tools/bog-walk/unpack_model.mjs hl_worker                     # build/bog-walk/hl_worker.glb, a plain glb Blender can read
#   ~/venv/bin/python3 -I tools/bog-walk/hand_blender.py -- [key=value ...]
#
# What it does:
#   1. Imports the shared character "hl_worker" (a MakeHuman body with a Mixamo skeleton).
#   2. Closes the right hand round a handle (a cylinder of the torch's radius): the handle lies across the palm at a slant, as in a real power grip,
#      and every finger joint (knuckle, middle joint, end joint) bends, base first, until that part of the finger touches the handle.
#      The thumb is then turned (a small search over its three joints) so it lies UP along the handle, pressed against it, its tip above the index finger.
#   3. Keeps the hand, the forearm and the shirt sleeve over it, poses them (the same skinning the armature does), welds the seams and turns the
#      triangles back into quads, then smooths with one level of Catmull-Clark subdivision.
#   4. Darkens the creases with ambient occlusion baked into the vertices (the handle is in the scene while it bakes, so the skin is darker where it holds it).
#   5. Writes games/bog-walk/src/handmesh.js: one vertex list in "grip space" and a list of named parts (four fingers, the thumb, the palm, the nails ...),
#      so the game can split it into meshes with the names its held check counts.
#
# Grip space: the handle is the y axis through (0, y, 0), +y up the handle (toward the thumb tip and the flame), +z toward the wrist (toward you in the game),
# +x toward the back of the hand. The middle of the fist is at the origin.
# Options: rh= handle radius (m), slant= degrees the handle is turned across the palm, back= how far the handle sits from the knuckles toward the wrist (m),
#   sub= subdivision levels (0, 1 or 2), ao=0 to skip the bake, render=1 to also write preview pictures to build/bog-walk/.
import bpy, bmesh, sys, math, json, base64, os
import numpy as np
from mathutils import Vector, Matrix

ARGS = dict(a.split('=', 1) for a in (sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []) if '=' in a)
num = lambda k, d: float(ARGS[k]) if k in ARGS else d
RH = num('rh', 0.0148)          # the handle's radius where the hand holds it (games/bog-walk/src/hand.js: RH)
SLANT = num('slant', 22) * math.pi / 180
BACK = num('back', 0.006)
SUB = int(num('sub', 0))   # Blender subdivision levels; normally 0, because the game smooths the mesh itself (smooth=, Loop subdivision in hand.js) so it ships small
GLB = ARGS.get('glb', 'build/bog-walk/hl_worker.glb')
OUT = ARGS.get('out', 'games/bog-walk/src/handmesh.js')
DEG = math.pi / 180

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
arm = bpy.data.objects['Human.rig']
body, shirt = bpy.data.objects['Body'], bpy.data.objects['Shirt']
vl = bpy.context.view_layer
for b in arm.pose.bones: b.matrix_basis = Matrix.Identity(4)   # the bind pose, so the mesh and the joints agree before we bend anything
vl.update()
PB = lambda n: arm.pose.bones['mixamorig:' + n]
FINGERS = ['Index', 'Middle', 'Ring', 'Pinky']
HANDJ = ['RightHand'] + [f + str(i) for f in FINGERS + ['Thumb'] for i in (1, 2, 3)]
HANDJ = ['RightHand'] + ['RightHand' + f + str(i) for f in FINGERS + ['Thumb'] for i in (1, 2, 3)]
KEEP = HANDJ + ['RightForeArm']

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
    bm.verts.ensure_lookup_table(); bm.verts.index_update()
    co = np.array([v.co[:] for v in bm.verts])
    bones = [b.name.replace('mixamorig:', '') for b in arm.data.bones]
    W = np.zeros((len(bm.verts), len(bones)))
    for v in bm.verts:
        for k, w in v[dl].items():
            n = names[k]
            if n in bones: W[v.index, bones.index(n)] += w
    W /= np.maximum(1e-9, W.sum(1, keepdims=True))
    domn = [dom(v) for v in bm.verts]
    return {'bm': bm, 'co': co, 'W': W, 'dom': domn, 'bones': bones}

SK = take(body, set(KEEP))
SH = take(shirt, {'RightForeArm', 'RightArm'})
BONES = SK['bones']
REST = {b.name: b.matrix_basis.copy() for b in arm.pose.bones}

def mats():
    vl.update()
    return np.array([np.array(arm.pose.bones['mixamorig:' + n].matrix @ arm.data.bones['mixamorig:' + n].matrix_local.inverted()) for n in BONES])

def skin(part, idx=None, M=None):
    """the posed positions of a part's vertices (linear blend skinning, as the armature modifier does)"""
    M = mats() if M is None else M
    co = part['co'] if idx is None else part['co'][idx]
    W = part['W'] if idx is None else part['W'][idx]
    used = np.nonzero(W.sum(0))[0]
    h = np.c_[co, np.ones(len(co))]
    out = np.zeros((len(co), 3))
    for b in used:
        out += W[:, b:b + 1] * (h @ M[b].T)[:, :3]
    return out

def head(n): vl.update(); return Vector(PB(n).head)
def rot(n, axis, ang):
    """turn a joint about an axis through its head (armature space); its children follow"""
    if not ang: return
    pb = PB(n); p = Vector(pb.head)
    pb.matrix = Matrix.Translation(p) @ Matrix.Rotation(ang, 4, Vector(axis).normalized()) @ Matrix.Translation(-p) @ pb.matrix
    vl.update()

ids = lambda part, names: np.array([i for i, d in enumerate(part['dom']) if d in names], dtype=int)

# ---------- the hand's own directions, at rest: f along the fingers, k across the knuckles toward the index finger, p out of the palm ----------
f = (head('RightHandMiddle2') - head('RightHandMiddle1')).normalized()
k = head('RightHandIndex1') - head('RightHandPinky1'); k = (k - f * k.dot(f)).normalized()
p = k.cross(f).normalized()

# bring the fingers side by side first (the rest pose spreads them a little), turning each about the palm's normal at its knuckle
for fn, a in [('Index', num('sIndex', -3)), ('Ring', num('sRing', 3)), ('Pinky', num('sPinky', 7))]:
    rot('RightHand' + fn + '1', p, a * DEG)

# ---------- the handle's direction, and how a finger bends ----------
AX = (k * math.cos(SLANT) + f * math.sin(SLANT)).normalized()   # the handle crosses the palm at a slant: its top (index) end further from the wrist
BI = {n: i for i, n in enumerate(BONES)}
knuck = sum((head('RightHand' + fn + '1') for fn in FINGERS), Vector()) / 4
def radial(P, C, A):
    d = P - np.array(C); A = np.array(A); d -= np.outer(d @ A, A); return np.linalg.norm(d, axis=1)
SAVE = {fn: [PB('RightHand%s%d' % (fn, j)).matrix_basis.copy() for j in (1, 2, 3)] for fn in FINGERS}
SIGNS = {}
def pose_finger(fn, angs):
    names = ['RightHand%s%d' % (fn, j) for j in (1, 2, 3)]
    for n, m in zip(names, SAVE[fn]): PB(n).matrix_basis = m
    vl.update()
    for n, a, sg in zip(names, angs, SIGNS.get(fn, [1, 1, 1])):
        bdir = (Vector(PB(n).tail) - Vector(PB(n).head)).normalized(); rot(n, (k - bdir * k.dot(bdir)).normalized(), sg * a * DEG)
for fn in FINGERS:   # flexion turns each bone's tip toward the palm side
    sg = []
    for j in range(3):
        n = 'RightHand%s%d' % (fn, j + 1); pose_finger(fn, [0, 0, 0]); t0 = Vector(PB(n).tail); a = [0, 0, 0]; a[j] = 3; pose_finger(fn, a)
        sg.append(1 if (Vector(PB(n).tail) - t0).dot(p) > 0 else -1)
    SIGNS[fn] = sg

# ---------- where the handle goes: across the palm, pressed a little into its soft pads ----------
# The model's hand is large and thick for a torch handle, so the grip is worked out round a thinner handle (rm=, in the model's own size) and the finished
# hand is scaled to fit the game's handle (RH).
RM = num('rm', RH); SCALE = RH / RM
P0 = skin(SK)
def along_bone(i, n):   # how far along its bone (0 at the joint, 1 at the next one) a vertex lies, in the pose the hand is in now
    pb = PB(n); h = np.array(pb.head); t = np.array(pb.tail); return (P0[i] - h) @ (t - h) / np.dot(t - h, t - h)
# what the handle rests against: the palm (without the ball of the thumb, which the thumb moves) and the first half of each finger's first part
palmI = np.array([i for i, d in enumerate(SK['dom']) if (d == 'RightHand' and SK['W'][i, BI['RightHandThumb1']] < 0.15 and -0.05 < (Vector(P0[i]) - knuck).dot(f) < 0.005)
                  or (d in ('RightHand%s1' % fn for fn in FINGERS) and along_bone(i, d) < 0.5)], dtype=int)
def palm_gap(s_):
    C_ = knuck - f * BACK + p * s_
    P = skin(SK, palmI); near = np.abs((P - np.array(C_)) @ np.array(AX)) < 0.05
    return radial(P[near], C_, AX).min() - RM
s_ = 0.09   # come in from outside the palm until the handle presses "sink" metres into it
while palm_gap(s_ - 0.0005) > -num('sink', 0.001): s_ -= 0.0005
C = knuck - f * BACK + p * s_
print('handle centre %.4f m out of the palm from the knuckles; grip worked out round radius %.4f, hand scaled by %.3f' % (s_, RM, SCALE))

# ---------- close each finger as a real hand does: all three joints bend together (the middle joint most), and when a part of the finger
#            touches the handle, that part and the joints behind it stop while the joints beyond it keep bending, until every part rests on the handle ----------
MAXA = np.array([num('maxMcp', 95), num('maxPip', 110), num('maxDip', 80)])
RATE = np.array([1.0, 1.2, 0.8])
TARGET = -num('press', 0.0004)   # each part presses this far into the handle's surface (skin is soft)
SEGS = {fn: [np.array([i for i in ids(SK, {'RightHand%s%d' % (fn, j)}) if along_bone(i, 'RightHand%s%d' % (fn, j)) > num('half', 0.45)], dtype=int) for j in (1, 2, 3)] for fn in FINGERS}
report = {'fingers': {}}
for fn in FINGERS:
    def gaps():
        M = mats(); return [radial(skin(SK, s2, M), C, AX).min() - RM for s2 in SEGS[fn]]
    ang = np.zeros(3); active = np.ones(3, bool); step = 1.5
    while active.any():
        d = step * RATE * active; trial = np.minimum(MAXA, ang + d); pose_finger(fn, trial); g = gaps()
        hit = [j for j in range(3) if g[j] < TARGET and active[: j + 1].any()]
        if hit:
            lo, hi = 0.0, 1.0
            for _ in range(8):
                mid = (lo + hi) / 2; pose_finger(fn, np.minimum(MAXA, ang + d * mid)); gg = gaps()
                if min(gg[j] for j in hit) < TARGET: hi = mid
                else: lo = mid
            ang = np.minimum(MAXA, ang + d * lo); active[: max(hit) + 1] = False
        else:
            ang = trial
        active &= ang < MAXA - 1e-6
    pose_finger(fn, ang)
    # roll the grip tighter: where a part near the knuckle still stands off the handle (its tip touched first), bend that joint more and open the
    # joints beyond it just enough that nothing goes into the handle
    for _ in range(60):
        g = gaps(); j = next((m for m in (0, 1) if g[m] > 0.0006 and ang[m] < MAXA[m]), None)
        if j is None: break
        ang[j] += 1; pose_finger(fn, ang); g = gaps(); n_ = 0
        while min(g[j + 1:]) < TARGET - 0.0003 and n_ < 30:
            m = max(range(j + 1, 3), key=lambda q_: ang[q_])
            if ang[m] <= 0: break
            ang[m] -= 1; pose_finger(fn, ang); g = gaps(); n_ += 1
        if min(g) < TARGET - 0.0008: ang[j] -= 1; pose_finger(fn, ang); break
    for m in (1, 2):   # then close the joints beyond again until their parts rest on the handle
        g = gaps(); n_ = 0
        while g[m] > 0.0003 and min(g[m:]) > TARGET - 0.0003 and ang[m] < MAXA[m] and n_ < 40: ang[m] += 1; pose_finger(fn, ang); g = gaps(); n_ += 1
        if min(g[m:]) < TARGET - 0.0006: ang[m] -= 1; pose_finger(fn, ang)
    report['fingers'][fn] = [round(float(x), 1) for x in ang]
    print(fn, 'bent', report['fingers'][fn], 'gap per part (mm)', [round(float(x) * 1000, 2) for x in gaps()])

# ---------- the thumb: a small search over its joints so it lies up along the handle, pressed on it ----------
thI = ids(SK, {'RightHandThumb2', 'RightHandThumb3'}); th3 = ids(SK, {'RightHandThumb3'}); th2 = ids(SK, {'RightHandThumb2'})
fiI = ids(SK, {'RightHand%s%d' % (fn, j) for fn in FINGERS for j in (1, 2, 3)})
TS = {n: PB(n).matrix_basis.copy() for n in ('RightHandThumb1', 'RightHandThumb2', 'RightHandThumb3')}
WANT = (-f - AX * (-f).dot(AX)).normalized()   # toward the wrist, across the handle: the side the thumb lies on
WANT = (WANT + (-p) * num('tside', 0.35)).normalized()
def pose_thumb(x):
    for n, m in TS.items(): PB(n).matrix_basis = m
    vl.update()
    rot('RightHandThumb1', AX, x[0]); rot('RightHandThumb1', p, x[1]); rot('RightHandThumb1', f, x[2])
    for n, a, b in (('RightHandThumb2', x[3], x[4]), ('RightHandThumb3', x[5], 0)):
        pb = PB(n); bd = (Vector(pb.tail) - Vector(pb.head)).normalized(); lat = bd.cross(Vector(np.array(C)) - Vector(pb.head)).normalized()
        rot(n, lat, a)
        if b: rot(n, bd, b)
def thumb_cost(x, verbose=False):
    pose_thumb(x); M = mats()
    P = skin(SK, thI, M); d = radial(P, C, AX) - RM
    pen = np.sum(np.minimum(0, d + 0.0003) ** 2) * 4e6
    P3 = P[np.isin(thI, th3)]; P2 = P[np.isin(thI, th2)]
    c3 = (radial(P3, C, AX).min() - RM) ** 2 * 3e5
    c2 = (radial(P2, C, AX).min() - RM) ** 2 * 1e5
    tip = Vector(PB('RightHandThumb3').tail); base = Vector(PB('RightHandThumb2').head)
    dirn = (tip - base).normalized()
    align = (1 - dirn.dot(AX)) * 30
    m3 = Vector(P3.mean(0)) - Vector(C); m3 = (m3 - AX * m3.dot(AX)).normalized()
    side = (1 - m3.dot(WANT)) * 12
    F = skin(SK, fiI, M)
    dd = np.sqrt(((P[:, None, :] - F[None, :, :]) ** 2).sum(-1)).min(1)
    clash = np.sum(np.minimum(0, dd - 0.0045) ** 2) * 2e5
    reg = sum(v * v for v in x) * 0.3
    cost = pen + c3 + c2 + align + side + clash + reg
    if verbose: print('thumb cost', dict(pen=pen, c3=c3, c2=c2, align=align, side=side, clash=clash, reg=reg))
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
print('thumb angles', report['thumb'])

# ---------- the wrist: turn the hand on the forearm so the forearm leaves toward the lower right, toward you (fx= fy= fz= in grip space) ----------
def frame(A_, f_):
    yv = np.array(A_); zv = np.array(-f_ - A_ * (-f_).dot(A_)); zv /= np.linalg.norm(zv); return yv, zv, np.cross(yv, zv)
yv, zv, xv = frame(AX, f)
want = np.array([num('fx', 0.15), num('fy', -0.42), num('fz', 0.89)]); want /= np.linalg.norm(want)
wantW = Vector(want[0] * xv + want[1] * yv + want[2] * zv)
have = (head('RightForeArm') - head('RightHand')).normalized()
q = wantW.rotation_difference(have)
wrist = head('RightHand')
rot('RightHand', q.axis, q.angle)
R3 = q.to_matrix()
C = wrist + R3 @ (Vector(C) - wrist); AXg = (R3 @ AX).normalized(); fg = (R3 @ f).normalized()
report['wristTurn'] = round(math.degrees(q.angle), 1)
print('wrist turned %.0f degrees' % math.degrees(q.angle))

# ---------- grip space ----------
M = mats()
Pall = skin(SK, None, M)
yv, zv, xv = frame(AXg, fg)
iy = [(skin(SK, ids(SK, {'RightHand%s2' % fn}), M) - np.array(C)) @ yv for fn in ('Index', 'Pinky')]
O = np.array(C) + yv * (iy[0].mean() + iy[1].mean()) / 2
G = lambda P: np.c_[(P - O) @ xv, (P - O) @ yv, (P - O) @ zv] * SCALE
fore = np.array(head('RightForeArm') - head('RightHand')); fore /= np.linalg.norm(fore)
report['forearm'] = [round(float(v_), 3) for v_ in (fore @ xv, fore @ yv, fore @ zv)]
print('forearm direction in grip space', report['forearm'])

# ---------- one mesh: posed skin and sleeve in grip space, every face labelled with its part ----------
PARTS = ['palm', 'finger', 'finger', 'finger', 'finger', 'thumb', 'thenar', 'wrist', 'sleeve', 'fingernail', 'fingernail', 'fingernail', 'fingernail', 'thumbnail']
def part_of(d):
    if d == 'RightHand': return 0
    if d == 'RightForeArm': return 7
    for i, fn in enumerate(FINGERS):
        if d.startswith('RightHand' + fn): return 1 + i
    return 6 if d == 'RightHandThumb1' else 5

out = bmesh.new(); play = out.faces.layers.int.new('part'); cl = out.loops.layers.color.new('ao')
def add_part(src, P, label):
    bm = src['bm']; vs = [out.verts.new(q) for q in G(P)]
    for fc in bm.faces:
        if 'keep' in src and not src['keep'](fc): continue
        nf = out.faces.new([vs[v.index] for v in fc.verts])
        doms = [src['dom'][v.index] for v in fc.verts]
        nf[play] = label(max(set(doms), key=doms.count))
add_part(SK, Pall, part_of)
_e = np.array(arm.data.bones['mixamorig:RightForeArm'].head_local); _w = np.array(arm.data.bones['mixamorig:RightHand'].head_local)
SH['keep'] = lambda fc: min(((np.array(v.co) - _e) @ (_w - _e)) / np.dot(_w - _e, _w - _e) for v in fc.verts) > -num('upper', 0.25)   # up to a quarter of a forearm's length above the elbow
add_part(SH, skin(SH, None, M), lambda d: 8)

# the nails: on each end joint, the faces on the back of the finger, toward its tip
out.faces.ensure_lookup_table(); out.normal_update()
for i, fn in enumerate(FINGERS + ['Thumb']):
    n = 'RightHand%s3' % fn; pb = PB(n)
    h, t = G(np.array([pb.head]))[0], G(np.array([pb.tail]))[0]
    bd = (t - h) / np.linalg.norm(t - h)
    R = np.array((pb.matrix @ arm.data.bones['mixamorig:' + n].matrix_local.inverted()).to_3x3())
    back = np.array(-p) @ R.T; back = np.array([back @ xv, back @ yv, back @ zv]); back -= bd * (back @ bd); back /= np.linalg.norm(back)
    lab = 5 if fn == 'Thumb' else 1 + i
    cand = [fc for fc in out.faces if fc[play] == lab]
    tipd = max(((np.array(v.co) - h) @ bd for fc in cand for v in fc.verts))
    L0, L1 = num('nailFrom', 0.42), num('nailTo', 0.97)
    for fc in cand:
        c = np.array(fc.calc_center_median()); tq = (c - h) @ bd
        if tq < tipd * L0 or tq > tipd * L1: continue
        rv = (c - h) - bd * tq; up = rv @ back
        if up > 0 and np.array(fc.normal) @ back > num('nailCos', 0.72) and up > np.linalg.norm(rv) * 0.8:
            fc[play] = 13 if fn == 'Thumb' else 9 + i

bmesh.ops.delete(out, geom=[v for v in out.verts if not v.link_faces], context='VERTS')
bmesh.ops.join_triangles(out, faces=out.faces[:], angle_face_threshold=math.pi, angle_shape_threshold=math.pi, cmp_seam=False, cmp_sharp=False, cmp_uvs=False, cmp_vcols=False, cmp_materials=False)
me = bpy.data.meshes.new('hand'); out.to_mesh(me)
for poly in me.polygons: poly.use_smooth = True
ob = bpy.data.objects.new('hand', me); bpy.context.scene.collection.objects.link(ob)
for o in list(bpy.data.objects):
    if o is not ob: o.hide_render = True
if SUB:
    md = ob.modifiers.new('sub', 'SUBSURF'); md.levels = md.render_levels = SUB; md.uv_smooth = 'NONE'
    dg = bpy.context.evaluated_depsgraph_get(); me2 = bpy.data.meshes.new_from_object(ob.evaluated_get(dg), preserve_all_data_layers=True, depsgraph=dg)
    ob.modifiers.clear(); ob.data = me2; me = me2

# the handle, only while the occlusion bakes, so the skin is darker where it holds the handle
bpy.ops.mesh.primitive_cylinder_add(radius=RH, depth=0.4, vertices=32, location=(0, 0, 0))
handle = bpy.context.active_object; handle.rotation_euler = (math.pi / 2, 0, 0)   # Blender's cylinder runs along z; grip space wants y
ao = np.ones(len(me.vertices))
if num('ao', 1):
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = int(num('aoSamples', 64))
    sc.world = bpy.data.worlds.new('w'); sc.world.light_settings.distance = num('aoDist', 0.02)
    me.color_attributes.new('bake', 'FLOAT_COLOR', 'POINT'); me.color_attributes.active_color = me.color_attributes['bake']
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True); vl.objects.active = ob
    mat = bpy.data.materials.new('bake'); me.materials.append(mat)
    bpy.ops.object.bake(type='AO', target='VERTEX_COLORS')
    ao = np.array([c.color[0] for c in me.color_attributes['bake'].data])
    print('ambient occlusion: min %.2f mean %.2f' % (ao.min(), ao.mean()))

# ---------- write the game's module ----------
me.calc_loop_triangles()
V = np.array([v.co[:] for v in me.vertices]); pa = np.array([0] * len(me.polygons))
me.attributes['part'].data.foreach_get('value', pa)
tris = np.array([t.vertices[:] for t in me.loop_triangles]); tpart = pa[[t.polygon_index for t in me.loop_triangles]]
order = np.argsort(tpart, kind='stable'); tris = tris[order]; tpart = tpart[order]
ranges = []
for lab in range(len(PARTS)):
    w = np.nonzero(tpart == lab)[0]
    if len(w): ranges.append([PARTS[lab], int(w[0]), int(len(w))])
S = np.abs(V).max() / 32767
b64 = lambda a: base64.b64encode(a.tobytes()).decode()
# fingers, thumb and handle: how well they hold on (millimetres from the handle's surface; negative is inside it)
rad = np.hypot(V[:, 0], V[:, 2]) - RH
for lab in range(len(PARTS)):
    vi = np.unique(tris[tpart == lab])
    if len(vi): report.setdefault('gapsMm', {}).setdefault(PARTS[lab], []).append(round(float(rad[vi].min()) * 1000, 2))
report.update(handleRadius=RH, slant=round(SLANT / DEG, 1), subdivision=SUB, verts=int(len(V)), tris=int(len(tris)), scale=S,
              box=[[round(float(q), 4) for q in V.min(0)], [round(float(q), 4) for q in V.max(0)]])
skinCol = np.array([c.color[:3] for c in body.data.attributes['Color'].data]).mean(0); shirtCol = np.array([c.color[:3] for c in shirt.data.attributes['Color'].data]).mean(0)
report['skinLinear'] = [round(float(q), 4) for q in skinCol]; report['shirtLinear'] = [round(float(q), 4) for q in shirtCol]
data = {'info': report, 'smooth': int(num('smooth', 1)), 'scale': S, 'n': int(len(V)), 'pos': b64(np.round(V / S).astype('<i2')), 'ao': b64(np.round(np.clip(ao, 0, 1) * 255).astype('u1')),
        'idx': b64(tris.astype('<u2').ravel()), 'parts': ranges}
with open(OUT, 'w') as fh:
    fh.write('/* Made by tools/bog-walk/hand_blender.py from the shared character model "hl_worker". Do not edit by hand: run the tool again (docs/games/bog-walk.md).\n'
             '   A right hand closed round a handle of radius %g m, with its forearm and shirt sleeve, in grip space (the handle is the y axis, +y up the handle,\n'
             '   +z toward the wrist, +x toward the back of the hand, the middle of the fist at the origin). Positions are 16-bit numbers times "scale"; "ao" is how\n'
             '   much light reaches each vertex (0 to 255); "parts" lists [name, first triangle, triangle count] for each named part. */\n' % RH)
    fh.write('export const HANDMESH = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print(json.dumps(report, indent=1))
print('wrote', OUT, os.path.getsize(OUT), 'bytes')

# ---------- preview pictures (render=1) ----------
if num('render', 0):
    handle.hide_render = False
    for o in (ob, handle): o.rotation_euler = (math.pi / 2 + o.rotation_euler[0], 0, 0)   # Blender's up is z: turn grip space's y up to it
    zup = lambda q: (q[0], -q[2], q[1])
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.render.resolution_x = 640; sc.render.resolution_y = 640
    sc.world = sc.world or bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.6
    skinM = bpy.data.materials.new('skin'); skinM.use_nodes = True; bs = skinM.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value = (0.25, 0.1, 0.05, 1); bs.inputs['Roughness'].default_value = 0.6
    ob.data.materials.clear(); ob.data.materials.append(skinM)
    woodM = bpy.data.materials.new('wood'); woodM.use_nodes = True; woodM.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.5, 0.35, 0.2, 1); handle.data.materials.append(woodM)
    L = bpy.data.lights.new('l', 'SUN'); L.energy = 3; lo_ = bpy.data.objects.new('l', L); sc.collection.objects.link(lo_); lo_.rotation_euler = (0.6, 0.3, 0.8)
    cam = bpy.data.cameras.new('c'); cam.lens = 50; co_ = bpy.data.objects.new('c', cam); sc.collection.objects.link(co_); sc.camera = co_
    for name, pos in (('eye', (-0.09, 0.16, 0.30)), ('front', (-0.05, 0.05, -0.32)), ('left', (-0.32, 0.06, 0.05)), ('right', (0.32, 0.05, 0.02))):
        pos = zup(pos); co_.location = pos; d = Vector((0, 0, 0)) - Vector(pos); co_.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        sc.render.filepath = 'build/bog-walk/hand_%s.png' % name; bpy.ops.render.render(write_still=True)
