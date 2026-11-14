# tools/tivoli/kit.py: the 2010 security-force kit for Tivoli bodies, added AFTER tools/garvey/era.py has built the body.
# era.py is not changed (another branch owns it). This script opens build/people/<name>.blend (saved by era.py), adds the kit
# pieces in the body's rest shape, gives them bone weights, paints them into the same 'Col' vertex colours era.py uses,
# and exports build/people/<name>.glb again with era.py's export settings, ready for tools/people/pack.mjs.
#
#   MAKEHUMAN=~/mh/makehuman NPC_OUT=build/people/ ~/venv/bin/python3 tools/garvey/era.py "$(cat tools/tivoli/people/soldier2010.json)"
#   ~/venv/bin/python3 tools/tivoli/kit.py "$(cat tools/tivoli/people/soldier2010.json)"
#   node tools/people/pack.mjs --out games/_tivoli/site/models --lo soldier2010
#
# The recipe's "kit" block says what to add (all optional):
#   camo: [materials]   paint these in four-colour woodland camouflage (Jamaica Defence Force, May 2010; see docs/games/tivoli.md "Uniforms")
#   vest                a sleeveless body-armour vest over the shirt, from the waist (above the belt) to the shoulders
#   pouches             "soldier" (four ammunition pouches and two water bottles on the belt) or "police" (two small pouches)
#   straps              the load-carrying harness: two straps from the belt in front, over the shoulders, joining in a Y at the back
#   helmet              a ballistic helmet of the 1980s US shape (a dome with a lower edge at the sides and back), camouflaged if listed in camo
#   armband             a band round the left upper arm (the yellow armbands worn in the operation)
#   boots               trousers tucked into high black boots
#   armbandtext         a word in letters round the armband ("POLICE": shown only for police attached to the army; the game hides it for soldiers)
#   backtext, fronttext a word in raised letters across the back of the vest and, smaller, across its front (police: "POLICE" on both)
# Colours come from the recipe's "colors" (Vest, Helmet, Pouch, Straps, ArmBand, Boots, VestText), in sRGB 0 to 255.
import bpy, bmesh, sys, json, os, math
from mathutils import Vector, Matrix, noise
from mathutils.bvhtree import BVHTree

P = json.loads(sys.argv[-1]); K = P.get('kit', {}); NAME = P['name']; OUT = os.environ.get('NPC_OUT', 'build/people/')
bpy.ops.wm.open_mainfile(filepath=os.path.abspath('build/people/' + NAME + '.blend'))
rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
OB = {o.name: o for o in bpy.data.objects if o.type == 'MESH'}
def J(n): return rig.data.bones['mixamorig:' + n].head_local.copy()
def T(n): return rig.data.bones['mixamorig:' + n].tail_local.copy()
def srgb(c): return Vector(tuple((x / 255) ** 2.2 for x in c))
COL = {k: srgb(v) for k, v in P['colors'].items()}
FRONT = -1   # the body faces -y

def colmat(name, rough=0.9):   # the same material era.py makes: Principled BSDF fed by the 'Col' vertex colours
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value = rough
    vc = nt.nodes.new('ShaderNodeVertexColor'); vc.layer_name = 'Col'; nt.links.new(vc.outputs['Color'], b.inputs['Base Color']); return m

def tree(o):
    b = bmesh.new(); b.from_mesh(o.data); t = BVHTree.FromBMesh(b); b.free(); return t

def new_obj(name, bm, mat, weights_from=None, only=None, bone=None):
    """A kit piece that bends with the body: bone weights come from the nearest surface of weights_from (limited to the bones in only), or all go to one bone."""
    me = bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(colmat(mat))
    if bone:
        g = o.vertex_groups.new(name='mixamorig:' + bone); g.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
    else:
        for g in weights_from.vertex_groups: o.vertex_groups.new(name=g.name)   # the weight copy fills groups by name, so they must exist first
        md = o.modifiers.new('wt', 'DATA_TRANSFER'); md.object = weights_from; md.use_vert_data = True; md.data_types_verts = {'VGROUP_WEIGHTS'}
        md.vert_mapping = 'POLYINTERP_NEAREST'; md.layers_vgroup_select_src = 'ALL'; md.layers_vgroup_select_dst = 'NAME'
        with bpy.context.temp_override(object=o, active_object=o, selected_objects=[o]): bpy.ops.object.modifier_apply(modifier='wt')
        if only:
            ok = {o.vertex_groups['mixamorig:' + n].index for n in only if 'mixamorig:' + n in o.vertex_groups}
            for v in me.vertices:
                w = [(g.group, g.weight) for g in v.groups if g.group in ok and g.weight > 0]; tot = sum(x[1] for x in w)
                for gi in [g.group for g in v.groups]: o.vertex_groups[gi].remove([v.index])
                if tot < 1e-4:
                    nb = min(only, key=lambda n: (J(n) - v.co).length); (o.vertex_groups.get('mixamorig:' + nb) or o.vertex_groups.new(name='mixamorig:' + nb)).add([v.index], 1.0, 'REPLACE')
                else:
                    for gi, wt in w: o.vertex_groups[gi].add([v.index], wt / tot, 'REPLACE')
    o.parent = rig; o.modifiers.new('Armature', 'ARMATURE').object = rig
    for p in me.polygons: p.use_smooth = True
    return o

def solidify(o, t):
    md = o.modifiers.new('solid', 'SOLIDIFY'); md.thickness = t; md.offset = -1; md.use_even_offset = True
    o.modifiers.move(len(o.modifiers) - 1, 0)   # before the armature
    with bpy.context.temp_override(object=o, active_object=o, selected_objects=[o]): bpy.ops.object.modifier_apply(modifier='solid')

# ---------- colour ----------
TAN, GREEN, BROWN, BLACK = srgb((146, 128, 92)), srgb((84, 96, 56)), srgb((98, 72, 46)), srgb((34, 32, 28))
def woodland(p):
    """Four-colour woodland camouflage, as worn by the Jamaica Defence Force in May 2010 (Gleaner photographs): a tan ground with large green and brown shapes and thin black ones."""
    s = 1 / 0.13
    if noise.noise(p * s * 1.25 + Vector((7.1, 3.3, 1.7))) > 0.38: return BLACK
    if noise.noise(p * s + Vector((1.3, 9.2, 4.4))) > 0.18: return BROWN
    if noise.noise(p * s * 0.8 + Vector((5.5, 2.1, 8.8))) > -0.05: return GREEN
    return TAN
def paint(o, col=None, camo=False):
    """Write the 'Col' layer: one colour per face, so camouflage shapes have clean edges (era.py's soft speckle is kept as a small brightness change)."""
    me = o.data; bm = bmesh.new(); bm.from_mesh(me)
    cl = bm.loops.layers.float_color.get('Col') or bm.loops.layers.float_color.new('Col')
    for f in bm.faces:
        for l in f.loops:   # by vertex, never by face: a colour that differs per face splits every shared vertex and doubles the file
            k = 0.92 + noise.noise(l.vert.co * 14) * 0.06; base = woodland(l.vert.co) if camo else col
            l[cl] = (base.x * k, base.y * k, base.z * k, 1)
    bm.to_mesh(me); bm.free(); ca = me.color_attributes; ca.active_color = ca['Col']; ca.render_color_index = list(ca.keys()).index('Col')

def weight_of(bm, vert, names):
    dl = bm.verts.layers.deform.active; return sum(vert[dl].get(gi, 0) for gi in names)

def group_ids(o, names): return {o.vertex_groups['mixamorig:' + n].index for n in names if 'mixamorig:' + n in o.vertex_groups}
ARMS = ['LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm', 'LeftHand', 'RightHand']
TORSO = ('Hips', 'Spine', 'Spine1', 'Spine2', 'LeftShoulder', 'RightShoulder', 'Neck')
body = OB['Body']; shirt = OB['Shirt']; trousers = OB.get('Breeches'); belt = OB.get('Belt')
NECK = J('Neck'); HEAD = J('Head'); HIPS = J('Hips'); ANK = J('LeftFoot').z
BELT_TOP = max(v.co.z for v in belt.data.vertices) if belt else HIPS.z + 0.09
BELT_MID = (sum(v.co.z for v in belt.data.vertices) / len(belt.data.vertices)) if belt else HIPS.z + 0.07
made = []

# ---------- boots: tuck the trousers into high boots ----------
if K.get('boots') and trousers:
    BT = ANK + 0.17                       # top of the boot
    def shin(x):                          # the shin bone of the leg on this side: knee to ankle
        side = 'Left' if x > 0 else 'Right'; return J(side + 'Leg'), T(side + 'Leg')
    me = trousers.data; inside = []
    for v in me.vertices:
        if v.co.z < BT + 0.06:
            a, b = shin(v.co.x); ax = (b - a).normalized(); c = a + ax * (v.co - a).dot(ax)   # nearest point on the bone
            off = v.co - c; off.z = 0
            if off.length < 1e-4: continue
            want = 0.052 + max(0.0, v.co.z - ANK) * 0.12            # a boot is narrow at the ankle, a little wider up the calf
            f = 1.0 if v.co.z < BT else 1 - (v.co.z - BT) / 0.06; f = f * f * (3 - 2 * f)
            if v.co.z < BT + 0.02 and v.co.z > BT - 0.01: want += 0.012                     # the cloth bunches over the boot top
            v.co = v.co.lerp(c + off.normalized() * want + Vector((0, 0, v.co.z - c.z)), f)
    me.update()
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if not (f.calc_center_median().z < BT - 0.01)], context='FACES')
    bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.016
    o = new_obj('Boots', bm, 'Boots', weights_from=trousers); solidify(o, 0.004); paint(o, COL['Boots']); made.append(o)
    for nm in ('Shoes',):
        if nm in OB: paint(OB[nm], COL['Boots'])

# ---------- the vest (body armour) ----------
vest = None
if K.get('vest'):
    bm = bmesh.new(); bm.from_mesh(shirt.data); arm = group_ids(shirt, ARMS)
    sp2 = J('Spine2')
    def cut(f):
        c = f.calc_center_median()
        if c.z < BELT_TOP + 0.045: return True                                                                    # stops clear above the belt and its pouches
        if sum(weight_of(bm, v, arm) for v in f.verts) / len(f.verts) > 0.2: return True                         # armholes, roomy so the arm and armband clear the edge
        if c.z > NECK.z - 0.02 and not (0.075 <= abs(c.x) <= 0.115): return True                                   # well below the collar, except the shoulder pieces, which run over the top
        if abs(c.x) < 0.075 and c.z > NECK.z - (0.10 if (c.y - sp2.y) * FRONT > 0 else 0.055): return True        # round neck, lower in front
        if abs(c.x) > 0.115 and c.z > NECK.z - 0.075: return True                                                  # narrow shoulder straps, not the whole shoulder
        return False
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if cut(f)], context='FACES')
    # clean edges: cutting by whole faces leaves a stepped outline, so level the hem and smooth the armholes and neckline along the edge
    hem = BELT_TOP + 0.05
    for v in bm.verts:
        if v.is_boundary and v.co.z < hem + 0.035: v.co.z = hem
    for _ in range(4):
        new = {}
        for v in bm.verts:
            if not v.is_boundary or abs(v.co.z - hem) < 1e-4: continue
            nb = [e.other_vert(v) for e in v.link_edges if e.is_boundary]
            if len(nb) == 2: new[v] = v.co * 0.5 + (nb[0].co + nb[1].co) * 0.25
        for v, c in new.items(): v.co = c
    bm.normal_update()
    for v in bm.verts: v.co += v.normal * 0.028
    vest = new_obj('Vest', bm, 'Vest', weights_from=shirt, only=TORSO); solidify(vest, 0.012); paint(vest, COL['Vest']); made.append(vest)

surf = [o for o in (vest, shirt) if o]
def hit(origin, d, objs):
    best = None
    for o in objs:
        t = tree(o); loc, nrm, _, dist = t.ray_cast(origin, d)
        if loc is not None and (best is None or dist < best[2]): best = (loc, nrm, dist, o)
    return best

def box(bm, c, side, out, w, h, d, up=Vector((0, 0, 1))):
    """A box centred at c: w along side, d along out, h along up. The face against the body is left out: it is never seen, and a face
    pointing into the body makes the cloth check read the layer beneath as poking through."""
    vs = [bm.verts.new(c + side * sx * w / 2 + out * sy * d / 2 + up * sz * h / 2) for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    for q in ((0, 1, 3, 2), (4, 6, 7, 5), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)): bm.faces.new([vs[i] for i in q])
def on(objs, ang, z, cen=None, front=None):
    """Where a ray from outside the body at heading ang (0 = the front, + to the body's left) and height z meets the outermost of objs: (point, outward normal, sideways)."""
    o0 = cen or Vector((HIPS.x, HIPS.y, z)); dirv = Vector((math.sin(ang), FRONT * math.cos(ang), 0)); o0 = Vector((o0.x, o0.y, z))
    r = hit(o0 + dirv * 0.6, -dirv, objs)
    if not r: return None
    n = r[1].copy(); n.z = 0; n.normalize(); n = n if n.dot(dirv) > 0 else -n; return r[0], n, Vector((0, 0, 1)).cross(n).normalized()

# ---------- pouches on the belt ----------
if K.get('pouches') and (belt or trousers):
    ring = [o for o in (belt, trousers) if o]
    spots = ([(-0.55, 0.10, 0.11, 0.05), (-0.25, 0.10, 0.11, 0.05), (0.25, 0.10, 0.11, 0.05), (0.55, 0.10, 0.11, 0.05), (1.75, 0.10, 0.17, 0.08), (-1.75, 0.10, 0.17, 0.08)]
             if K['pouches'] == 'soldier' else [(-0.9, 0.07, 0.08, 0.04), (0.9, 0.07, 0.08, 0.04)])   # angle from the front (radians, + to the body's left), width, height, depth
    bm = bmesh.new()
    for ang, w, h, d in spots:
        dirv = Vector((math.sin(ang), FRONT * math.cos(ang), 0)); o0 = Vector((HIPS.x, HIPS.y, BELT_MID))
        r = hit(o0 + dirv * 0.5, -dirv, ring)
        if not r: continue
        n = r[1].copy(); n.z = 0; n.normalize(); n = n if n.dot(dirv) > 0 else -n; side = Vector((0, 0, 1)).cross(n).normalized()   # outward, whichever way the hit face was wound
        c = r[0] + n * (d / 2 + 0.013) + Vector((0, 0, BELT_TOP - BELT_MID - h / 2 - 0.012))   # tops just under the belt top, below where the shirt puffs out
        box(bm, c, side, n, w, h, d)
        box(bm, c + n * 0.004 + Vector((0, 0, h / 2 - 0.024)), side, n, w * 1.06, 0.042, d * 1.02)    # the flap over the top, closed by a press stud
    if K['pouches'] == 'police':      # a holster on the right hip, leaning a little forward
        r = on(ring, -1.45, BELT_MID)
        if r: box(bm, r[0] + r[1] * 0.035 + Vector((0, 0, -0.07)), r[2], r[1], 0.06, 0.20, 0.05)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
    made.append(paint_o := new_obj('BeltPouch', bm, 'Pouch', weights_from=belt or trousers, only=('Hips', 'Spine'))); paint(paint_o, COL['Pouch'])

# ---------- the harness straps ----------
if K.get('straps') and surf:
    sp2 = J('Spine2'); sh = NECK.z - 0.03; bm = bmesh.new(); W = 0.016   # 3.2 cm webbing
    for sx in (-1, 1):
        path = []
        for i in range(9):                                   # up the front, from the belt to the top of the shoulder
            z = BELT_TOP + 0.03 + (sh - 0.02 - (BELT_TOP + 0.03)) * i / 8; path.append(((sx * (0.085 + 0.01 * i / 8)), z, Vector((0, FRONT, 0))))   # ends at x 0.095, the middle of the vest's shoulder piece (0.075 to 0.115)
        for k in range(1, 6):                                # over the top of the shoulder in an arc, on the vest's shoulder piece (|x| 0.085 to 0.115)
            a = math.pi * k / 6; path.append((sx * 0.095, sh - 0.04, Vector((0, FRONT * math.cos(a), math.sin(a)))))
        for i in range(9):                                   # down the back, coming together in a Y
            z = sh - 0.02 - (sh - 0.02 - (BELT_TOP + 0.03)) * i / 8; x = sx * (0.095 - 0.095 * min(1, i / 4)) if i < 5 else 0.0
            path.append((x + sx * 0.004 * (i >= 5), z, Vector((0, -FRONT, 0))))
        dense = []                                           # three samples per step, so the strap follows the vest's curves instead of cutting across them
        for (x0, z0, d0), (x1, z1, d1) in zip(path, path[1:]):
            for k in range(3): t = k / 3; dense.append((x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, (d0 * (1 - t) + d1 * t).normalized()))
        dense.append(path[-1]); path = dense
        prev = None
        for x, z, d in path:
            o0 = Vector((x, sp2.y, z)) + d * 0.6; ray = -d; r = hit(o0, ray, surf)    # start OUTSIDE the side this point belongs to (front, back, or above and around the shoulder)
            if not r: continue
            nn = r[1] if r[1].dot(-ray) > 0 else -r[1]
            p = r[0] + nn * (0.06 if (r[3] is not vest and z < BELT_TOP + 0.09) else 0.02); t = Vector((1, 0, 0))   # below the vest's hem the strap hangs straight down at the vest's thickness, not tucked under it; everywhere else it lies on the vest
            pair = (bm.verts.new(p - t * W), bm.verts.new(p + t * W))
            if prev: bm.faces.new((prev[0], prev[1], pair[1], pair[0]))
            prev = pair
    o = new_obj('BeltStraps', bm, 'Straps', weights_from=vest or shirt, only=TORSO); paint(o, COL['Straps']); made.append(o)   # one-sided: a thickened strap's inner face would point into the vest

# ---------- the armband ----------
if K.get('armband'):
    # fitted to the sleeve itself (not the bone line, which the sleeve hangs below): only sleeve cloth that follows the upper arm, in a thin slice
    a0, a1 = J('LeftArm'), T('LeftArm'); ax = (a1 - a0); L = ax.length; ax.normalize(); ga = shirt.vertex_groups['mixamorig:LeftArm'].index
    sl = []
    for v in shirt.data.vertices:
        w = next((g.weight for g in v.groups if g.group == ga), 0); t = (v.co - a0).dot(ax) / L
        if w > 0.6 and 0.48 < t < 0.56: sl.append(v.co.copy())
    cen = sum(sl, Vector()) / len(sl); cen = a0 + ax * (cen - a0).dot(ax) + ((cen - a0) - ax * (cen - a0).dot(ax))   # the middle of the sleeve at that height
    u = ax.cross(Vector((0, 1, 0))).normalized(); w2 = ax.cross(u).normalized()
    def rad(p): d = (p - cen) - ax * (p - cen).dot(ax); return d.length
    rs = sorted(rad(p) for p in sl); R = rs[int(len(rs) * 0.6)] + 0.003   # a typical point of the loose sleeve, not its widest fold, so the band hugs the arm
    bm = bmesh.new(); N = 24; rows = []
    for h in (-0.028, 0.028):
        rows.append([bm.verts.new(cen + ax * h + (u * math.cos(i * 2 * math.pi / N) + w2 * math.sin(i * 2 * math.pi / N)) * R) for i in range(N)])
    for i in range(N): bm.faces.new((rows[0][i], rows[0][(i + 1) % N], rows[1][(i + 1) % N], rows[1][i]))
    st = tree(shirt)
    for v in bm.verts:          # hug the sleeve: each point moves onto the nearest sleeve surface, just outside it
        loc, nrm, _, _ = st.find_nearest(v.co)
        if loc is not None: v.co = loc + nrm * 0.004
    o = new_obj('ArmBand', bm, 'ArmBand', bone='LeftArm'); solidify(o, 0.003); paint(o, COL['ArmBand']); made.append(o)
    print('ARMBAND radius', round(R, 3), 'from', len(sl), 'sleeve points')

# ---------- the helmet ----------
if K.get('helmet'):
    hb = group_ids(body, ['Head']); bm0 = bmesh.new(); bm0.from_mesh(body.data); dl = bm0.verts.layers.deform.active
    pts = [v.co.copy() for v in bm0.verts if v[dl].get(next(iter(hb)), 0) > 0.5 and v.co.z > HEAD.z + 0.02]; bm0.free()
    if 'Hair' in OB: pts += [v.co.copy() for v in OB['Hair'].data.vertices if v.co.z > HEAD.z + 0.02]
    top = max(p.z for p in pts); cx = (max(p.x for p in pts) + min(p.x for p in pts)) / 2; cy = (max(p.y for p in pts) + min(p.y for p in pts)) / 2
    brow = HEAD.z + 0.105                                    # the front edge sits on the brow
    zc = brow                                                # widest at the brow; below it the sides and back flare out
    def radius(a, z):                                        # how far the head reaches at heading a (0 = front) and height z
        best = 0.0
        for p in pts:
            if abs(p.z - z) < 0.02:
                d = Vector((p.x - cx, p.y - cy));
                if d.length > 1e-4 and abs(math.atan2(d.x, d.y * FRONT) - a) % (2 * math.pi) < 0.25: best = max(best, d.length)
        return best
    N, M = 36, 12; bm = bmesh.new(); rings = []
    R0 = [max(radius(i * 2 * math.pi / N, zc), 0.07) + 0.02 for i in range(N)]
    for j in range(M + 1):
        t = j / M; ring = []
        for i in range(N):
            a = i * 2 * math.pi / N; fr = math.cos(a)            # 1 at the front, -1 at the back
            rim = brow - 0.035 * (1 - max(0, fr)) - 0.025 * max(0, -fr)   # lower at the sides and lowest at the back
            if t == 0: z = rim; r = R0[i] * (1.10 if fr < 0.6 else 1.03)        # a small flare at the edge
            else:
                e = t * math.pi / 2; z = zc + (top + 0.022 - zc) * math.sin(e); r = R0[i] * math.cos(e)
                if j == 1: z = rim + (zc - rim) * 0.6; r = R0[i] * 1.04
            ring.append(bm.verts.new(Vector((cx + math.sin(a) * r, cy + FRONT * math.cos(a) * r, z))))
        rings.append(ring)
    for j in range(M):
        for i in range(N): bm.faces.new((rings[j][i], rings[j][(i + 1) % N], rings[j + 1][(i + 1) % N], rings[j + 1][i]))
    bmesh.ops.remove_doubles(bm, verts=rings[-1], dist=1e-4)
    if 'Hair' in OB:
        hm = OB['Hair'].data; hb2 = bmesh.new(); hb2.from_mesh(hm)
        def under(c):
            a = math.atan2(c.x - cx, (c.y - cy) * FRONT); fr = math.cos(a); return c.z > brow - 0.035 * (1 - max(0, fr)) - 0.025 * max(0, -fr) - 0.004
        bmesh.ops.delete(hb2, geom=[f for f in hb2.faces if under(f.calc_center_median())], context='FACES'); hb2.to_mesh(hm); hb2.free()
    o = new_obj('Helmet', bm, 'Helmet', bone='Head'); solidify(o, 0.007); paint(o, COL['Helmet'], camo='Helmet' in K.get('camo', [])); made.append(o)
    bm = bmesh.new()      # the chinstrap: from each side of the helmet edge, down round under the chin
    chin = Vector((cx, cy + FRONT * 0.055, HEAD.z - 0.005)); pts2 = []
    for i in range(13):
        t = i / 12; a = math.pi / 2 - t * math.pi                     # from the left ear, under the chin, to the right ear
        side = Vector((math.sin(a), 0, 0)); e = (1 - abs(math.cos(t * math.pi)))   # 0 at the ears, 1 under the chin
        p = Vector((cx + math.sin(a) * (R0[N // 4] - 0.012) * (1 - 0.55 * e), cy + FRONT * 0.055 * e, brow - 0.045 - (brow - 0.045 - chin.z) * e))
        pts2.append(p)
    prev = None
    for p in pts2:
        pair = (bm.verts.new(p + Vector((0, -0.006, 0))), bm.verts.new(p + Vector((0, 0.006, 0))))
        if prev: bm.faces.new((prev[0], prev[1], pair[1], pair[0]))
        prev = pair
    if 'Helmet' in K.get('camo', []):   # the elastic band round a camouflage cover
        z = zc + 0.03; rws = []
        for h in (0, 0.018): rws.append([bm.verts.new(Vector((cx + math.sin(i * 2 * math.pi / N) * (R0[i] * math.cos(math.asin(min(1, (z + h - zc) / (top + 0.022 - zc)))) + 0.004), cy + FRONT * math.cos(i * 2 * math.pi / N) * (R0[i] * math.cos(math.asin(min(1, (z + h - zc) / (top + 0.022 - zc)))) + 0.004), z + h))) for i in range(N)])
        for i in range(N): bm.faces.new((rws[0][i], rws[0][(i + 1) % N], rws[1][(i + 1) % N], rws[1][i]))
    o = new_obj('HelmetStrap', bm, 'HelmetStrap', bone='Head'); paint(o, COL.get('HelmetStrap', srgb((40, 40, 34)))); made.append(o)

# ---------- letters on the vest (back and front) ----------
def letters(word, size, zt, back):
    """Raised letters standing on the vest, reading left to right for someone looking at them (behind the body if back, in front if not)."""
    cu = bpy.data.curves.new('txt', 'FONT'); cu.body = word; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = size; cu.extrude = 0.0015; cu.resolution_u = 3   # fewer curve steps: the letters stay readable at this size and the light copy stays in budget
    to = bpy.data.objects.new('txt', cu); bpy.context.scene.collection.objects.link(to); bpy.context.view_layer.update()
    tm = bpy.data.meshes.new_from_object(to.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(to)
    bm = bmesh.new(); bm.from_mesh(tm); vt = tree(vest); s_ = 1 if back else -1    # +1: the back is +y
    for v in bm.verts:
        x, z, lift = (-v.co.x if back else v.co.x), zt + v.co.y, v.co.z
        loc, nrm, _, _ = vt.ray_cast(Vector((x, 0.6 * s_, z)), Vector((0, -s_, 0)))
        v.co = (loc + Vector((0, s_ * (0.003 + lift), 0))) if loc is not None else Vector((x, 0.2 * s_, z))
    return bm
if vest and (K.get('backtext') or K.get('fronttext')):
    bm = bmesh.new()
    if K.get('backtext'):
        b2 = letters(K['backtext'], 0.064, (J('Spine1').z + J('Spine2').z) / 2 + 0.05, True); m2 = bpy.data.meshes.new('t'); b2.to_mesh(m2); bm.from_mesh(m2)
    if K.get('fronttext'):      # smaller, across the chest above the front pouches
        b2 = letters(K['fronttext'], 0.036, J('Spine2').z + 0.075, False); m2 = bpy.data.meshes.new('t'); b2.to_mesh(m2); bm.from_mesh(m2)
    o = new_obj('VestText', bm, 'VestText', weights_from=vest, only=TORSO); paint(o, COL['VestText']); made.append(o)

# ---------- smaller details seen in the May 2010 photographs ----------
D = K.get('details', [])
if 'cargo' in D and trousers:      # a pocket with a flap on the outside of each thigh
    bm = bmesh.new(); kz = (J('LeftUpLeg').z + J('LeftLeg').z) / 2
    for sx in (-1, 1):
        a = J('LeftUpLeg' if sx > 0 else 'RightUpLeg')
        r = on([trousers], sx * 1.45, kz - 0.02, cen=a)
        if r: box(bm, r[0] + r[1] * 0.004, r[2], r[1], 0.13, 0.15, 0.014); box(bm, r[0] + r[1] * 0.009 + Vector((0, 0, 0.066)), r[2], r[1], 0.14, 0.04, 0.008)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=3, use_grid_fill=True)   # enough corners to carry the camouflage
    o = new_obj('Cargo', bm, 'Breeches', weights_from=trousers); paint(o, camo=True) if 'Breeches' in K.get('camo', []) else paint(o, COL['Breeches']); made.append(o)
if 'respirator' in D and (belt or trousers):      # the round respirator (gas mask) canister on the left hip
    r = on([o for o in (trousers, belt) if o], 1.35, BELT_MID - 0.11)   # low on the hip, below the shirt's edge
    if r:
        bm = bmesh.new(); c = r[0] + r[1] * 0.09; N = 16
        rows = [[bm.verts.new(c + r[1] * h + (r[2] * math.cos(i * 2 * math.pi / N) + Vector((0, 0, 1)) * math.sin(i * 2 * math.pi / N)) * 0.055) for i in range(N)] for h in (-0.04, 0.04)]
        for i in range(N): bm.faces.new((rows[0][i], rows[0][(i + 1) % N], rows[1][(i + 1) % N], rows[1][i]))
        bm.faces.new(rows[1])   # the outer end only; the end against the hip is never seen
        o = new_obj('BeltCanister', bm, 'Pouch', weights_from=belt or trousers, only=('Hips', 'Spine')); paint(o, COL['Pouch']); made.append(o)
if 'firstaid' in D and vest:      # a small first-aid pouch on the left harness strap, high on the chest
    bm = bmesh.new(); r = on([vest], 0.32, J('Spine2').z + 0.02, cen=J('Spine2'))
    if r: box(bm, r[0] + r[1] * 0.03, r[2], r[1], 0.07, 0.09, 0.04)
    o = new_obj('VestPouch', bm, 'Pouch', weights_from=vest, only=TORSO); paint(o, COL['Pouch']); made.append(o)
if 'vestpouches' in D and vest:      # two pouches on the front of the vest (radio and magazines)
    bm = bmesh.new()
    for ang in (-0.42, 0.42):
        r = on([vest], ang, J('Spine1').z + 0.02, cen=J('Spine1'))
        if r: box(bm, r[0] + r[1] * 0.027, r[2], r[1], 0.075, 0.10, 0.035); box(bm, r[0] + r[1] * 0.035 + Vector((0, 0, 0.045)), r[2], r[1], 0.08, 0.03, 0.04)
    o = new_obj('VestPouch', bm, 'Pouch', weights_from=vest, only=TORSO); paint(o, COL['Pouch']); made.append(o)
if 'epaulettes' in D:      # shoulder straps on the shirt
    bm = bmesh.new()
    for sx in (-1, 1):
        s0 = J('LeftArm' if sx > 0 else 'RightArm'); n0 = NECK
        for i in range(2):
            pass
        r0 = hit(Vector((sx * 0.19, s0.y, s0.z + 0.4)), Vector((0, 0, -1)), [shirt])
        if r0:
            p = r0[0] + Vector((0, 0, 0.004)); box(bm, p, Vector((1, 0, 0)), Vector((0, 1, 0)), 0.08, 0.008, 0.045)
    o = new_obj('Epaulette', bm, 'Shirt', weights_from=shirt, only=('LeftShoulder', 'RightShoulder', 'Spine2')); paint(o, COL['Shirt']); made.append(o)
if 'chevrons' in D:      # rank chevrons on both upper sleeves (two stripes, as on the corporal in the photographs)
    bm = bmesh.new()
    for side in ('Left', 'Right'):
        a0, a1 = J(side + 'Arm'), T(side + 'Arm'); ax = (a1 - a0).normalized(); L = (a1 - a0).length
        sx = 1 if side == 'Left' else -1; mid = a0 + ax * L * 0.52; out = Vector((sx, 0, 0)) - ax * ax.x * sx; out.normalize()
        r = hit(mid + out * 0.3, -out, [shirt])
        if not r: continue
        c = r[0] + r[1] * 0.003; up = (-ax).normalized(); fw = r[1].cross(up).normalized()
        for k in range(2):
            for sgn in (-1, 1):   # each chevron is two short bars meeting in a point below
                q0 = c + up * (0.012 + k * 0.022) ; mdir = (fw * sgn * 0.8 + up * 0.6).normalized()
                pa = q0; pb = q0 + mdir * 0.042; th = up * 0.007
                v = [bm.verts.new(x) for x in (pa - th, pb - th, pb + th, pa + th)]; bm.faces.new(v)
    o = new_obj('Chevrons', bm, 'Chevrons', weights_from=shirt, only=('LeftArm', 'RightArm')); paint(o, COL.get('Chevrons', srgb((214, 178, 60)))); made.append(o)

# ---------- letters on the armband (police attached to the army wore yellow armbands marked POLICE) ----------
if K.get('armbandtext') and K.get('armband'):
    band = next(o for o in made if o.name == 'ArmBand'); bt = tree(band)
    a0, a1 = J('LeftArm'), T('LeftArm'); ax = (a1 - a0).normalized(); bc = sum((v.co for v in band.data.vertices), Vector()) / len(band.data.vertices)
    out = Vector((1, 0, 0)) - ax * ax.x; out.normalize(); tg = ax.cross(out).normalized()   # out: the outer side of the left arm; tg: round the arm
    cu = bpy.data.curves.new('txt', 'FONT'); cu.body = K['armbandtext']; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.size = 0.032; cu.extrude = 0.001; cu.resolution_u = 3
    to = bpy.data.objects.new('txt', cu); bpy.context.scene.collection.objects.link(to); bpy.context.view_layer.update()
    tm = bpy.data.meshes.new_from_object(to.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(to)
    bm = bmesh.new(); bm.from_mesh(tm); R = 0.075
    for v in bm.verts:     # wrap the word round the band: reading round the arm, letters standing along the arm (up the arm is up)
        ang = -v.co.x / R; d = (out * math.cos(ang) + tg * math.sin(ang)).normalized(); c0 = bc - ax * v.co.y
        loc, nrm, _, _ = bt.ray_cast(c0 + d * 0.3, -d)
        v.co = (loc + d * (0.0015 + v.co.z)) if loc is not None else c0 + d * R
    o = new_obj('ArmBandText', bm, 'ArmBandText', bone='LeftArm'); paint(o, COL.get('ArmBandText', srgb((22, 22, 22)))); made.append(o)

# ---------- remove layers that are always covered ----------
def hide_under(inner, outer, gap=0.05, clear=0.03):
    """Delete faces of inner that lie wholly beneath outer (every corner has outer just above it along its normal) and are at least clear from outer's open edges.
    They can never be seen, and in some poses they poke through (the cloth check found skin through shirts and shirts through trousers)."""
    ot = tree(outer); ob = bmesh.new(); ob.from_mesh(outer.data); edge = [v.co.copy() for v in ob.verts if v.is_boundary]; ob.free()
    from mathutils.kdtree import KDTree
    kd = KDTree(len(edge)); [kd.insert(c, i) for i, c in enumerate(edge)]; kd.balance()
    bm = bmesh.new(); bm.from_mesh(inner.data); bm.normal_update(); gone = []
    for f in bm.faces:
        ok = True
        for v in f.verts:
            if edge and kd.find(v.co)[2] < clear: ok = False; break
            loc, _, _, d = ot.ray_cast(v.co - v.normal * 0.002, v.normal, gap)
            if loc is None: ok = False; break
        if ok: gone.append(f)
    bmesh.ops.delete(bm, geom=gone, context='FACES'); bm.to_mesh(inner.data); bm.free(); print('HIDDEN', inner.name, 'under', outer.name, len(gone), 'faces')
hide_under(body, shirt)
if trousers:
    hide_under(shirt, trousers)
    tt = tree(trousers); me = shirt.data; me.calc_normals_split() if hasattr(me, 'calc_normals_split') else None
    for v in me.vertices:          # shirt cloth under the waistband sits 10 mm further in, so a simplified (light) copy does not poke out
        loc, _, _, d = tt.ray_cast(v.co, v.normal, 0.04)
        if loc is not None: v.co -= v.normal * 0.01
    me.update()
if K.get('boots') and 'Shoes' in OB and 'Boots' in [o.name for o in made]: hide_under(OB['Shoes'], next(o for o in made if o.name == 'Boots'), clear=0.0)

# ---------- camouflage on era.py's own pieces ----------
for o in list(OB.values()):
    mats = [m.name.split('.')[0] for m in o.data.materials]
    if mats and mats[0] in K.get('camo', []) and o.name != 'Helmet': paint(o, camo=True)

print('KIT', NAME, [o.name for o in made], 'TRIS', sum(len(p.vertices) - 2 for o in bpy.data.objects if o.type == 'MESH' for p in o.data.polygons))
bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath('build/people/' + NAME + '_kit.blend'))
bpy.context.scene['vertexColorSpace'] = 'linear'
bpy.ops.export_scene.gltf(export_extras=True, filepath=OUT + NAME + '.glb', export_image_format='JPEG', export_apply=False, export_vertex_color='NAME', export_vertex_color_name='Col', export_skins=True, export_animations=False, export_rest_position_armature=False)
