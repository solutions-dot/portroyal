"""Locs and knitted tams for this game's Rastafari recipes (November 2026, after the owner's note that the hair and tams "don't look good").

Locs: many separate rope-like strands of varied length and thickness, rooted on the scalp over the back, sides and crown (never the
forehead), each falling under its own weight from where it grows. Near the head a strand is kept clear of the scalp and the short
hair under it; below the head it is kept clear of the skin and shirt. Side strands end above the shoulders and lean back, so a raised
arm never meets them; the longer ones fall down the upper back. Weights: the head near the scalp, blending through the neck to the
upper back below it, so they follow the head and the torso without cutting through either.

Tams: a crocheted cap sitting large and soft at the back of the head over gathered locs: a ribbed band at the brim (raised ridges
all round), a full body that slouches back and a little down, and bands of red, gold and green. It is fitted to the real head (and its
short hair) at every angle, so no scalp or hair cuts through. A few locs fall from under its back edge.

Run from finish_person.py with the shared builder's globals (h, rig, J, HEAD, NECK, SH, SX, TOP, tree, PART, colmat, srgb, sstep, paint).
"""
import bmesh, math, random
SIDES = 6
from mathutils import Vector
from mathutils.bvhtree import BVHTree

def _tree(o):
    b = bmesh.new(); b.from_mesh(o.data); t = BVHTree.FromBMesh(b); b.free(); return t

def _bind(o, wfun):
    """weights per vertex from wfun(v.co) -> {bone: weight}"""
    for g in h.vertex_groups:
        if g.name not in o.vertex_groups: o.vertex_groups.new(name=g.name)
    for v in o.data.vertices:
        for bone, w in wfun(v.co).items():
            if w > 1e-4: o.vertex_groups['mixamorig:' + bone].add([v.index], w, 'REPLACE')
    o.parent = rig; o.modifiers.new('Armature', 'ARMATURE').object = rig; clothes.append(o)

def _locs_weights(co):
    wh = sstep(NECK - 0.03, NECK + 0.07, co.z)
    rest = 1 - wh
    return {'Head': wh, 'Neck': rest * 0.35, 'Spine2': rest * 0.65}

def _strand(bm, pts, r0):
    """a tube along pts, six sides, thinner at the tip, closed at the end; returns the rings"""
    rings = []
    n = len(pts)
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]).normalized()
        a = Vector((1, 0, 0)) if abs(d.x) < 0.9 else Vector((0, 1, 0))
        u = d.cross(a).normalized(); w = d.cross(u).normalized()
        r = r0 * (1 - 0.35 * (i / (n - 1)) ** 2) * (1 + 0.12 * math.sin(i * 1.7 + r0 * 900))   # a little lumpy, like a rolled lock
        rings.append([bm.verts.new(p + (u * math.cos(k / SIDES * 2 * math.pi) + w * math.sin(k / SIDES * 2 * math.pi)) * r) for k in range(SIDES)])
    for r0_, r1_ in zip(rings, rings[1:]):
        for k in range(SIDES):
            bm.faces.new((r0_[k], r0_[(k + 1) % SIDES], r1_[(k + 1) % SIDES], r1_[k]))
    tip = bm.verts.new(pts[-1] + (pts[-1] - pts[-2]).normalized() * r0 * 0.6)
    for k in range(SIDES): bm.faces.new((rings[-1][k], rings[-1][(k + 1) % SIDES], tip))
    return rings

def make_locs(seed, count, long_back, hair_rgb, grey=0.0, roots=None, thick=1.0, light=False):
    global SIDES
    SIDES = 4 if light else 6      # a crowd copy's locs: four sides and longer steps
    rnd = random.Random(seed)
    hy = J('Head').y
    C = Vector((0, hy + 0.004, HEAD + 0.075))      # about the middle of the skull
    hair_obj = bpy.data.objects.get('Hair')
    skin = globals().get('SKIN') or tree      # the skin alone: the base mesh also holds helper shapes that stand clear of the skull, and locs measured against them floated above the head
    trees = [skin] + ([_tree(hair_obj)] if hair_obj else [])
    shirt = PART.get('shirt'); ST = _tree(shirt) if shirt else None
    def surface(d):
        far = 0
        for t in trees:
            hit = t.ray_cast(C + d * 0.3, -d, 0.3)[0]
            if hit is not None: far = max(far, (hit - C).length)
        return far
    bm = bmesh.new(); strands = []
    golden = math.pi * (3 - math.sqrt(5))
    tries = 0
    while len(strands) < count and tries < count * 20:
        tries += 1
        if roots:
            a, e = roots[len(strands) % len(roots)]
            a += rnd.uniform(-0.25, 0.25)
        else:
            k = len(strands) + tries
            a = (k * golden) % (2 * math.pi)                 # 0 = straight ahead (-y)
            e = math.asin(rnd.uniform(-0.15, 1.0))          # elevation from the skull's middle: locs grow from the whole scalp, the top of the head too (owner, 16 November 2026)
        front = math.cos(a)                                  # 1 at the forehead, -1 at the nape
        if front > 0.35 and e < 0.62: continue               # never over the forehead or the face; from the hairline back they do
        if front > 0.1 and e < 0.3: continue                 # nor in front of the ears (the temples); over and behind the ears they do, so the head is full at the sides (owner, 16 November 2026)
        d = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
        R = surface(d)
        if R <= 0: continue
        p = C + d * (R - 0.002)      # rooted in the hair, not on top of it
        side = abs(math.sin(a))
        L = rnd.uniform(0.16, 0.26) if front > -0.45 else rnd.uniform(0.18, long_back)
        r0 = rnd.uniform(0.0075, 0.0125) * thick      # locs are thick ropes of hair: at 5 to 9 mm they read as thin sticks
        # grow: first out from the scalp, then down under its weight; side locs drift back
        # start along the scalp, back and down (a lock lies on the head before it hangs), never up into the air
        dirv = Vector((0, 0.55, -0.8)); dirv = (dirv - d * max(0.0, dirv.dot(d)) - d * 0.05).normalized()      # along the scalp, never out from it: with a share of the outward direction, a lock on the crown stood up like a hook
        pts = [p]; seg = 0.034 if light else 0.017; length = 0      # shorter steps: at 24 mm each bend showed as a kink
        sgn = (1 if d.x >= 0 else -1) if abs(d.x) > 0.08 else rnd.choice((-1, 1))      # which side a lock from the top falls to
        if e > 0.6: L += 0.16 * (e - 0.6) / 0.97 + 0.10      # a lock from the top first lies over the head, so it is longer
        while length < L:
            dq0 = pts[-1] - C
            if dq0.z > -0.01 and dq0.length < surface(dq0.normalized()) + r0 + 0.02:
                # still on the head: lie on the scalp and run down it, back and to its own side, never forward over the face
                n_ = dq0.normalized(); g_ = Vector((1.0 * sgn * max(0.15, front + 0.55), 0.55 + 0.4 * max(0.0, -front), -0.6)); t_ = g_ - n_ * g_.dot(n_)      # locks from the front and the top part to their own side and fall beside the head; those further back run back
                if t_.length > 1e-4:
                    q = pts[-1] + t_.normalized() * seg; dq = q - C; Rq = surface(dq.normalized())
                    if Rq > 0: q = C + dq.normalized() * (Rq + r0 * 0.9)
                    dirv = (q - pts[-1]).normalized(); pts.append(q); length += seg; continue
            dirv = (dirv + Vector((0, 0.06 * (1 - front) * 0.5 + 0.07 * side * max(0.0, front + 0.8), -0.32))).normalized()      # locks at the side drift back behind the ear
            q = pts[-1] + dirv * seg
            # clear of the head and its short hair
            dq = q - C
            if dq.length > 1e-6:
                Rq = surface(dq.normalized())
                if Rq > 0 and dq.length < Rq + r0 + 0.002: q = C + dq.normalized() * (Rq + r0 + 0.002)
            # clear of the skin and the shirt below the head
            for t, clear in [(skin, 0.012)] + ([(ST, 0.032)] if ST else []):      # well clear of the shirt: it moves with the shoulders and the back, and locks lying 12 mm off it sank into it in the standing and waving clips
                loc, nrm, _i, dist = t.find_nearest(q, 0.08)
                if loc is not None and (q - loc).dot(nrm) < r0 + clear:
                    q = loc + nrm * (r0 + clear)
            # below the collar a lock is always outside the shirt: measured out from the spine, it lies beyond the shirt's outer face (the nearest-point test above let a
            # lock slip down the nape inside the neck opening, and the cloth check found it under the shirt)
            if ST and q.z < NECK + 0.05:
                ax = Vector((0, globals()['YCz'](q.z) if 'YCz' in globals() else hy, q.z)); dd = Vector((q.x - ax.x, q.y - ax.y, 0)); L_ = dd.length
                if L_ > 1e-5:
                    out = ST.ray_cast(ax + dd / L_ * 0.4, -dd / L_, 0.4)[0]
                    if out is not None and (out - ax).length + r0 + 0.02 > L_: q = ax + dd / L_ * ((out - ax).length + r0 + 0.02)
            # side locs end above the shoulder, so a raised arm never meets them
            if side > 0.55 and front > -0.75 and q.z < SH.z + 0.06: break
            # below the base of the neck only a band down the middle of the back: the shirt over the shoulders and shoulder
            # blades rises and moves with the arms (the cloth check found locs through the shirt there)
            if q.z < NECK + 0.06 and abs(q.x) > 0.10: break
            pts.append(q); length += seg
        if len(pts) < 3: continue
        # no lock may stand up from its root like a hook, or stick out sideways past the ear before it falls (both were seen on the rebuilt men, 16 November 2026)
        if max(q.z for q in pts) > p.z + 0.02: continue
        if any(q.z > NECK + 0.10 and (q - C).length > surface((q - C).normalized()) + r0 + 0.05 for q in pts[1:]): continue
        rings = _strand(bm, pts, r0)
        strands.append((rings, rnd.uniform(0.75, 1.15), rnd.random() < grey))
    me = bpy.data.meshes.new('Locks'); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(me)
    o = bpy.data.objects.new('Locks', me); bpy.context.scene.collection.objects.link(o)
    me.materials.append(colmat('Hair'))
    _bind(o, _locs_weights)
    paint(o)
    # each lock its own shade (and some grey on an elder), tips a little lighter
    ca = o.data.color_attributes.get('Col')
    base = srgb(hair_rgb)
    vi = 0; shade = []
    for rings, k, g in strands:
        nv = len(rings) * SIDES + 1
        for j in range(nv):
            t = min(1, (j // SIDES) / max(1, len(rings) - 1))
            c = (srgb([150, 146, 138]) if g else base) * k * (1 + 0.25 * t)
            shade.append(c)
        vi += nv
    for f in o.data.polygons:
        for li in f.loop_indices:
            c = shade[o.data.loops[li].vertex_index] if o.data.loops[li].vertex_index < len(shade) else base
            ca.data[li].color = (min(1, c[0]), min(1, c[1]), min(1, c[2]), 1)
    print('LOCS', len(strands), 'strands', len(me.vertices), 'verts')
    return o

def make_tam(seed):
    """a slouched, banded, crocheted tam fitted to the head; returns the object"""
    rnd = random.Random(seed)
    hy = J('Head').y
    C = Vector((0, hy + 0.004, HEAD + 0.075))
    hair_obj = bpy.data.objects.get('Hair')
    skin = globals().get('SKIN') or tree      # the skin alone: the base mesh also holds helper shapes that stand clear of the skull, and locs measured against them floated above the head
    trees = [skin] + ([_tree(hair_obj)] if hair_obj else [])
    def surface_at(p, d):
        far = 0
        for t in trees:
            hit = t.ray_cast(p + d * 0.3, -d, 0.3)[0]
            if hit is not None: far = max(far, (hit - p).length)
        return far
    N = 40
    band_z = lambda a: HEAD + 0.105 - 0.045 * (0.5 - 0.5 * math.cos(a))   # higher over the forehead, lower at the nape
    rows = []
    # the ribbed band: three rows hugging the head, ridges all round
    for k in range(3):
        row = []
        for i in range(N):
            a = i / N * 2 * math.pi
            z = band_z(a) + k * 0.014
            c = Vector((0, hy + 0.004, z)); d = Vector((math.sin(a), -math.cos(a), 0))
            r = surface_at(c, d) + 0.007 + 0.0025 * (1 if i % 2 else -1) * (1 if k < 2 else 0.4)
            row.append(c + d * r)
        rows.append(row)
    # the body: a soft bag that grows out, slouches back and down, then closes at the crown
    top = rows[-1]
    bag_c = Vector((0, hy + 0.07, TOP - 0.02))
    for k in range(1, 9):
        u = k / 8
        row = []
        for i in range(N):
            a = i / N * 2 * math.pi
            base = top[i]
            el = -0.35 + u * (math.pi / 2 + 0.35)           # from below the bulge to the crown
            back = 0.5 - 0.5 * math.cos(a)                   # 0 at the front, 1 at the back
            rx, ry, rz = 0.145, 0.165 + 0.04 * back, 0.07
            e = bag_c + Vector((math.sin(a) * math.cos(el) * rx, -math.cos(a) * math.cos(el) * ry, math.sin(el) * rz - 0.05 * back * math.cos(el)))
            w = sstep(0, 0.45, u)
            p = base.lerp(e, w)
            # soft, a little uneven, like crochet
            p += Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1))) * 0.0012
            d = p - C
            R = surface_at(C, d.normalized())
            if R > 0 and d.length < R + 0.012: p = C + d.normalized() * (R + 0.012)
            row.append(p)
        rows.append(row)
    bm = bmesh.new()
    vrows = [[bm.verts.new(p) for p in row] for row in rows]
    for r0, r1 in zip(vrows, vrows[1:]):
        for i in range(N):
            bm.faces.new((r0[i], r0[(i + 1) % N], r1[(i + 1) % N], r1[i]))
    crown = bm.verts.new(sum(rows[-1], Vector()) / N + Vector((0, 0, 0.004)))
    for i in range(N): bm.faces.new((vrows[-1][i], vrows[-1][(i + 1) % N], crown))
    me = bpy.data.meshes.new('Tam'); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('Tam', me); bpy.context.scene.collection.objects.link(o)
    me.materials.append(colmat('Tam'))
    _bind(o, lambda co: {'Head': 1.0})
    paint(o)
    ca = o.data.color_attributes.get('Col')
    cols = [srgb(c) for c in ([30, 34, 30], [30, 34, 30], [30, 34, 30], [146, 44, 36], [146, 44, 36], [196, 156, 58], [196, 156, 58], [52, 98, 62], [52, 98, 62], [146, 44, 36], [196, 156, 58], [52, 98, 62])]
    nv_row = N
    for f in o.data.polygons:
        for li in f.loop_indices:
            vi = o.data.loops[li].vertex_index
            row = min(len(cols) - 1, vi // nv_row)
            g = 0.88 + 0.2 * ((vi * 7919) % 13) / 13            # knitted grain
            c = cols[row] * g
            ca.data[li].color = (c[0], c[1], c[2], 1)
    print('TAM', len(me.vertices), 'verts')
    return o
