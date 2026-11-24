# Fitted garments: a garment modelled once (a MakeHuman .mhclo, from shared/garments/) fitted to each body, in place of the clothes era.py makes
# by code. Started 21 November 2026, after the owner judged the generated collars, ties and suits not good enough (docs/reviews/collars-20261121.md).
#
# A recipe asks for one with
#   "outfit": {"garment": "toigo_male_suit_tie_and_jacket", "waistcoat": true, "tie": false, "drape": true}      (the last three are optional)
# and keeps its usual garment keys (shirt, trousers, jacket and so on): era.py still makes those, because its skin trimming, layer weights and
# checks are built round them, and this step then removes the ones the garment replaces.
#
# era.py runs this file twice (exec, in its own namespace):
#   OUTFIT_PHASE == 'fit'     right after the skeleton is added, while the body is still MakeHuman's own mesh (the fitting reads its points):
#                             MPFB fits the garment and gives it the skeleton's weights.
#   OUTFIT_PHASE == 'finish'  just before the colours are painted: the generated pieces the garment replaces are removed, the garment is split
#                             into the parts games expect (Shirt, Tie, Jacket, Breeches, JButtons), each takes its recipe colour, and skin
#                             the garment hides is removed (the neck above the collar is kept).
import os, math, bmesh
from mathutils import Vector

_OF = P.get('outfit') or {}
_GDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'shared', 'garments', _OF.get('garment', ''))

# Each garment's texture is laid out in regions; a face belongs to the part whose region holds its UV. Everything else is the garment's main
# cloth, split into trousers (pieces that reach below the knee) and jacket.
_REGIONS = {
    'toigo_male_suit_tie_and_jacket': [('Shirt', 0.745, 1.0, 0.78, 1.0), ('Tie', 0.745, 1.0, 0.44, 0.78), ('JButtons', 0.80, 1.0, 0.30, 0.44)],
    'toigo_male_suit_3': [('Tie', 0.83, 0.95, 0.73, 0.98), ('JButtons', 0.58, 0.76, 0.88, 0.98), ('Shirt', 0.555, 0.79, 0.59, 0.83), ('Drop', 0.82, 0.91, 0.52, 0.58), ('Shirt', 0.66, 0.91, 0.48, 0.62)],      # a three-button jacket with a higher, shorter lapel: closer to the cut of 1908 to 1925
}
# the generated pieces a full suit replaces
_REPLACES = ('Shirt', 'Collar', 'Tie', 'Placket', 'Buttons', 'Pocket', 'Jacket', 'JacketSkirt', 'Lapels', 'JButtons', 'Breeches', 'Belt', 'Buckle',
             'Waistband', 'Waistcoat', 'WaistcoatButtons')

if OUTFIT_PHASE == 'fit':
    _before = {m.name for m in h.modifiers}
    OUTFIT_OBJ = HumanService.add_mhclo_asset(os.path.join(_GDIR, _OF['garment'] + '.mhclo'), h, asset_type='Clothes', subdiv_levels=0)
    OUTFIT_DELETE = [(m.vertex_group, m.invert_vertex_group) for m in h.modifiers if m.type == 'MASK' and m.name not in _before]
    print('OUTFIT fitted', OUTFIT_OBJ.name, len(OUTFIT_OBJ.data.vertices), 'points')

elif OUTFIT_PHASE == 'finish':
    NZ = J('Neck').z
    # 1. the generated pieces the garment replaces go
    gone = [o for o in list(clothes) if o.name.split('.')[0] in _REPLACES and o.name.split('.')[0] not in _OF.get('keep', ())]      # "keep": generated pieces to wear with the garment (a waistcoat under a suit's jacket)
    for o in gone:
        clothes.remove(o); bpy.data.objects.remove(o)
    # 2. the garment, split into its parts
    g = OUTFIT_OBJ
    for m in list(g.modifiers):
        if m.type not in ('ARMATURE',): g.modifiers.remove(m)
    bm = bmesh.new(); bm.from_mesh(g.data); uvl = bm.loops.layers.uv.active
    def _region(uv):
        u, v = uv[0] % 1, uv[1] % 1
        for name, u0, u1, v0, v1 in _REGIONS.get(_OF['garment'], []):
            if u0 < u <= u1 and v0 < v <= v1: return name
        return 'Cloth'
    tag = {f.index: _region(f.loops[0][uvl].uv) for f in bm.faces}
    # the main cloth: pieces that reach below the knee are trousers, the rest the jacket
    seen = set(); legs = set()
    bm.faces.ensure_lookup_table()
    for f in bm.faces:
        if f.index in seen or tag[f.index] != 'Cloth': continue
        st = [f]; grp = []
        while st:
            q = st.pop()
            if q.index in seen or tag[q.index] != 'Cloth': continue
            seen.add(q.index); grp.append(q.index)
            for e in q.edges:
                for r in e.link_faces:
                    if r.index not in seen: st.append(r)
        if min(v.co.z for i in grp for v in bm.faces[i].verts) < KNEE: legs.update(grp)
    for i in tag:
        if tag[i] == 'Cloth': tag[i] = 'Breeches' if i in legs else 'Jacket'
    bm.free()
    for name in sorted(set(tag.values())):
        if name == 'Drop': continue      # a part the games do not wear (a pocket handkerchief, which came out as a pale slab on the chest)
        if name == 'Tie' and _OF.get('tie') is False: continue      # "tie": false: the suit worn with an open collar
        o = g.copy(); o.data = g.data.copy(); o.name = name; bpy.context.scene.collection.objects.link(o)
        b = bmesh.new(); b.from_mesh(o.data); b.faces.ensure_lookup_table()
        bmesh.ops.delete(b, geom=[f for f in b.faces if tag[f.index] != name], context='FACES')
        bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
        if name == 'Breeches':      # the hems come down 1.8 cm to break over the shoe: stopping short, they showed the ragged top edge of the shoe (owner, 21 November 2026)
            for v in b.verts:
                v.co.z -= 0.018 * sstep(ANK + 0.16, ANK + 0.03, v.co.z)
        if name == 'Shirt':      # the shirt front below the jacket's top button is always hidden: left in, its tail came through the jacket's skirt in a stride
            _zc = HIP + 0.20 * s; bmesh.ops.delete(b, geom=[f for f in b.faces if f.calc_center_median().z < _zc], context='FACES'); bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
        if name in ('Shirt', 'Tie'):      # the collar band and the knot ease 4.5 mm off the neck: fitted tight, the neck came through the band's top edge
            b.normal_update()
            for v in b.verts:
                k = max(0.0, min(1.0, (v.co.z - (NZ - 0.06)) / 0.03))
                if k > 0: v.co += v.normal * 0.0045 * k
        b.to_mesh(o.data); b.free()
        o.data.materials.clear(); o.data.materials.append(colmat('Buttons' if name == 'JButtons' else name))
        if 'Col' in o.data.color_attributes: o.data.color_attributes.remove(o.data.color_attributes['Col'])
        o.parent = rig
        if not any(m.type == 'ARMATURE' for m in o.modifiers): o.modifiers.new('Armature', 'ARMATURE').object = rig
        for m in o.modifiers:
            if m.type == 'ARMATURE': m.object = rig
        clothes.append(o); print('OUTFIT part', name, len(o.data.polygons))
    bpy.data.objects.remove(g)
    # era.py's list of main garments now points at the garment's parts (later steps read it), and forgets the pieces that are gone
    _new = {o.name: o for o in clothes}
    for k, nm in (('shirt', 'Shirt'), ('jacket', 'Jacket'), ('breeches', 'Breeches')):
        if nm in _new: PART[k] = _new[nm]
    for k, o in list(PART.items()):
        try: o.name
        except ReferenceError: PART.pop(k, None)
    # "waistcoat": true makes a waistcoat from the garment's own shirt front, which fills the jacket's opening exactly: that panel in the
    # waistcoat's cloth, lifted just over the tie, with a V cut at the top (its point "vz" metres below the neck, default 0.17) that shows the shirt
    # and the knot, and a row of small buttons below the V. (The generated waistcoat was sized for the generated jacket and came through this one.)
    if _OF.get('waistcoat') and 'Shirt' in _new:
        sh = _new['Shirt']; wo = sh.copy(); wo.data = sh.data.copy(); wo.name = 'Waistcoat'; bpy.context.scene.collection.objects.link(wo)
        b = bmesh.new(); b.from_mesh(wo.data); b.normal_update()
        vz = NZ - _OF.get('vz', 0.17) * s; vk = _OF.get('vslope', 1.6)
        # cut with planes, so every edge of the waistcoat is one straight line (kept or dropped face by face, its V and its top were stair-stepped): the back goes,
        # then the sides, the top below the collar, and the two sides of the V
        bmesh.ops.delete(b, geom=[f for f in b.faces if f.calc_center_median().y >= J('Spine2').y], context='FACES')
        def _cut(co, no, only=None):
            g = [f for f in b.faces if only is None or only(f.calc_center_median())]; g = list({e for f in g for e in f.edges}) + list({v for f in g for v in f.verts}) + g
            bmesh.ops.bisect_plane(b, geom=g, plane_co=Vector(co), plane_no=Vector(no).normalized(), clear_outer=True, clear_inner=False, dist=1e-5)
        _cut((0.105 * s, 0, 0), (1, 0, 0)); _cut((-0.105 * s, 0, 0), (-1, 0, 0)); _cut((0, 0, NZ - 0.05 * s), (0, 0, 1))
        if 'JButtons' in _new: _cut((0, 0, max(v.co.z for v in _new['JButtons'].data.vertices) - 0.07 * s), (0, 0, -1))      # and the bottom, a hand below the jacket's top button: lower down it is always hidden, and it came through the jacket's skirt in a stride
        bmesh.ops.bisect_plane(b, geom=b.verts[:] + b.edges[:] + b.faces[:], plane_co=Vector((0, 0, 0)), plane_no=Vector((1, 0, 0)), dist=1e-5)      # a seam down the middle, so each side of the V is cut on its own
        _cut((0, 0, vz), (-vk, 0, 1), lambda q: q.x > 0); _cut((0, 0, vz), (vk, 0, 1), lambda q: q.x < 0)
        bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
        for v in b.verts: v.co += v.normal * 0.007      # over the tie
        b.to_mesh(wo.data); b.free()
        wo.data.materials.clear(); wo.data.materials.append(colmat('Waistcoat')); clothes.append(wo); _new['Waistcoat'] = wo; PART['waistcoat'] = wo
        # its buttons, down the middle from just below the V
        bb = bmesh.new()
        wb = bmesh.new(); wb.from_mesh(wo.data); from mathutils.bvhtree import BVHTree as _BV; wtree = _BV.FromBMesh(wb); wb.free()
        zs = [v.co.z for v in wo.data.vertices if abs(v.co.x) < 0.01]
        if zs:
            z0, z1 = min(zs) + 0.02 * s, vz - 0.015 * s; nb = 5
            for i in range(nb):
                z = z1 + (z0 - z1) * i / (nb - 1); hit = wtree.ray_cast(Vector((0, -1, z)), Vector((0, 1, 0)))[0]
                if hit is None: continue
                bmesh.ops.create_circle(bb, cap_ends=True, segments=8, radius=0.0055 * s, matrix=Matrix.Translation((0, hit.y - 0.0015, z)) @ Matrix.Rotation(math.pi / 2, 4, 'X'))
            bo = bpy.data.objects.new('WaistcoatButtons', bpy.data.meshes.new('WaistcoatButtons')); bb.to_mesh(bo.data); bb.free(); bpy.context.scene.collection.objects.link(bo)
            bo.data.materials.append(colmat('Buttons'))
            for g in wo.vertex_groups: bo.vertex_groups.new(name=g.name)
            md = bo.modifiers.new('wt', 'DATA_TRANSFER'); md.object = wo; md.use_vert_data = True; md.data_types_verts = {'VGROUP_WEIGHTS'}; md.vert_mapping = 'NEAREST'; md.layers_vgroup_select_src = 'ALL'; md.layers_vgroup_select_dst = 'NAME'
            with ov(bo): bpy.ops.object.modifier_apply(modifier='wt')
            bo.parent = rig; bo.modifiers.new('Armature', 'ARMATURE').object = rig; clothes.append(bo)
        print('OUTFIT waistcoat', len(wo.data.polygons))
        if 'Tie' in _new:      # the tie goes under the waistcoat: below the V it is hidden, so it is cut away (it lay over the waistcoat)
            tb = bmesh.new(); tb.from_mesh(_new['Tie'].data)
            bmesh.ops.delete(tb, geom=[f for f in tb.faces if f.calc_center_median().z < vz - 0.012 * s], context='FACES')
            bmesh.ops.delete(tb, geom=[v for v in tb.verts if not v.link_faces], context='VERTS'); tb.to_mesh(_new['Tie'].data); tb.free()
    # the jacket's sleeves get ease: fitted point by point they cling to the arm (owner, 21 November 2026: "a bit too tight"). Every point of a sleeve moves out from
    # the middle of the arm by the same amount ("sleeve_ease", metres, default 0.008), eased in below the sleeve head so no step shows at the shoulder. The sleeve keeps
    # its own modelled shape. (Forcing it onto the generated sleeves' straight tube was tried: it stepped at the sleeve head and creased into rings.)
    if 'Jacket' in _new and _OF.get('sleeve_ease', 0.008) > 0 and '_arm_mid' in globals():
        _se = _OF.get('sleeve_ease', 0.008)
        for v in _new['Jacket'].data.vertices:
            c = v.co
            if abs(c.x) < SX * 0.92: continue
            q, t = arm_axis(c); rb = (c - q).length; q = _arm_mid(q, t, 1 if c.x >= 0 else -1); d = c - q; r = d.length or 1e-6
            k = sstep(0.10, 0.32, t) * (1 - sstep(0.075, 0.10, rb / s)); v.co = q + d / r * (r + _se * k)
        _new['Jacket'].data.update(); print('OUTFIT sleeves eased')
    # the jacket hangs: a garment fitted point by point follows every roll of a stout body, so its torso is moved out to the same eased outline the generated
    # clothes use (era.py env(): hollows bridged, falling straight from the fullest part). Every layer at one place moves by the same amount, worked out from the
    # innermost layer there, so lapels, pocket flaps and the collar keep their own relief and edges (moving each point to the outline on its own pressed the
    # lapels flat into the front and their edges went soft: owner, 21 November 2026, "the flaps don't look neat"). The buttons go with the cloth.
    if 'Jacket' in _new and _OF.get('drape', True) and 'env' in globals():
        from mathutils.kdtree import KDTree as _KD
        jk = _new['Jacket']; was = [v.co.copy() for v in jk.data.vertices]; c = _OF.get('ease', 0.004); NA, DZ = 72, 0.008; ZS = SH.z + 0.045 * s; info = []; rin = {}; tg = {}
        for v in jk.data.vertices:
            x, y, z = v.co
            if z > ZS: info.append(None); continue
            wx = 1.0 if z < ARMPIT - 0.03 else 1 - sstep(SX * 0.80, SX * 1.0, abs(x)) * sstep(ARMPIT - 0.03, ARMPIT, z)
            if z < ARMPIT and side_arm(v.co) is not None and abs(x) > SX * 1.02: wx = 0.0
            wx *= 1 - sstep(SH.z - 0.035 * s, ZS, z)
            if wx <= 0: info.append(None); continue
            yc = YCz(z); dx, dy = x, y - yc; r = math.hypot(dx, dy) or 1e-6; a = math.atan2(dx, -dy); raw, hg, _hl = env(z, a); w = sstep(HIP - 0.02, HIP + 0.20, z)
            key = (int((a % (2 * math.pi)) / (2 * math.pi) * NA) % NA, int(z / DZ)); rin[key] = min(rin.get(key, 9), r); tg.setdefault(key, []).append(raw + (hg - raw) * w + c)
            info.append((yc, dx, dy, r, a, wx))
        D = {k: max(0.0, sum(t) / len(t) - rin[k]) for k, t in tg.items()}
        _ih = int((HIP + 0.06) / DZ)      # below the hips the jacket's skirt hangs straight: it moves out as far as the cloth at the hips did. (Left to follow the thighs, a longer jacket's hem was gathered in under the fuller cloth above it, like a blouson.)
        for (k, i) in list(D):
            if i < _ih:
                _dr = D.get((k, _ih))
                if _dr is None: _dr = D.get((k, _ih + 1), 0.0)
                D[(k, i)] = max(D[(k, i)], _dr)
        for _ in range(3): D = {(k, i): (2 * d + sum(D.get(n, d) for n in (((k - 1) % NA, i), ((k + 1) % NA, i), (k, i - 1), (k, i + 1)))) / 6 for (k, i), d in D.items()}      # one smooth field: neighbours move together
        def _dat(a, z):
            fk = (a % (2 * math.pi)) / (2 * math.pi) * NA - 0.5; fi = z / DZ - 0.5; k0 = math.floor(fk); i0 = math.floor(fi); u = fk - k0; t = fi - i0; tot = 0.0; wt = 0.0
            for kk, uu in ((k0, 1 - u), (k0 + 1, u)):
                for ii, tt in ((i0, 1 - t), (i0 + 1, t)):
                    d = D.get((kk % NA, ii))
                    if d is not None: tot += d * uu * tt; wt += uu * tt
            return tot / wt if wt > 1e-6 else 0.0
        for v, q in zip(jk.data.vertices, info):
            if q is None: continue
            yc, dx, dy, r, a, wx = q; rn = r + _dat(a, v.co.z) * wx; v.co.x = dx * rn / r; v.co.y = yc + dy * rn / r
        # the skirt hangs straight from the hips: no point below them lies further in than the cloth at the hips in the same direction. (A longer jacket's hem was
        # gathered in under the fuller cloth above it, like a blouson: owner's review, 22 November 2026.)
        _zr = HIP + 0.05; _ref = [0.0] * NA
        for v, q in zip(jk.data.vertices, info):
            if q is None or abs(v.co.z - _zr) > 0.03: continue
            yc, dx, dy, r, a, wx = q; k_ = int((a % (2 * math.pi)) / (2 * math.pi) * NA) % NA; _ref[k_] = max(_ref[k_], math.hypot(v.co.x, v.co.y - yc))
        for _ in range(4): _ref = [max(_ref[k], (_ref[k - 1] + 2 * _ref[k] + _ref[(k + 1) % NA]) / 4) if _ref[k] > 0 else (_ref[k - 1] + _ref[(k + 1) % NA]) / 2 for k in range(NA)]
        _nh = 0; _rin2 = {}; _cell = lambda a, z: (int((a % (2 * math.pi)) / (2 * math.pi) * NA) % NA, int(z / DZ))
        for v, q in zip(jk.data.vertices, info):      # every layer at one place moves out by the same amount (worked out from the innermost), so the fronts stay lapped and the hem keeps its turn
            if q is None or v.co.z > _zr: continue
            c_ = _cell(q[4], v.co.z); _rin2[c_] = min(_rin2.get(c_, 9), math.hypot(v.co.x, v.co.y - q[0]))
        D2 = {c_: max(0.0, _ref[c_[0]] - 0.004 - r_) if _ref[c_[0]] > 0 else 0.0 for c_, r_ in _rin2.items()}
        for _ in range(2): D2 = {(k, i): (2 * d + sum(D2.get(n, d) for n in (((k - 1) % NA, i), ((k + 1) % NA, i), (k, i - 1), (k, i + 1)))) / 6 for (k, i), d in D2.items()}
        for v, q in zip(jk.data.vertices, info):
            if q is None or v.co.z > _zr: continue
            yc, dx, dy, r, a, wx = q; d_ = D2.get(_cell(a, v.co.z), 0.0) * wx * sstep(_zr, _zr - 0.03, v.co.z)
            if d_ <= 1e-5: continue
            r1 = math.hypot(v.co.x, v.co.y - yc); rn = r1 + d_; v.co.x *= rn / r1; v.co.y = yc + (v.co.y - yc) * rn / r1; _nh += 1
        print('OUTFIT skirt hangs straight', _nh)
        jk.data.update(); kd = _KD(len(was))
        for i, cc in enumerate(was): kd.insert(cc, i)
        kd.balance()
        if 'JButtons' in _new:
            for v in _new['JButtons'].data.vertices:
                co, i, d = kd.find(v.co); v.co += jk.data.vertices[i].co - was[i]
        print('OUTFIT jacket draped')
    # The jacket's two sides are made alike. One modelled suit came with one shoulder squarer and higher than the other, which read as a lopsided man on a level
    # stance (owner, 22 November 2026: "why are you still showing me these lopsided shoulders"). Away from the front, where the fronts lap and are meant to
    # differ, each point and its partner across the body move to the mean of the two. A point with no partner within 3 cm is left alone.
    if 'Jacket' in _new and _OF.get('even', True):
        from mathutils.kdtree import KDTree as _KD2
        _jv = _new['Jacket'].data.vertices; _kd = _KD2(len(_jv))
        for v in _jv: _kd.insert(v.co, v.index)
        _kd.balance(); _ym2 = J('Spine2').y; _new_co = {}; _ne = 0
        for v in _jv:
            c = v.co
            if c.x <= 0.002: continue
            w = max(sstep(0.07 * s, 0.11 * s, c.x), sstep(_ym2 - 0.02, _ym2 + 0.02, c.y))      # not the lapped fronts
            if w <= 0: continue
            mc, mi, md = _kd.find(Vector((-c.x, c.y, c.z)))
            if mi is None or md > 0.03: continue
            m = _jv[mi].co; avg = Vector(((c.x - m.x) / 2, (c.y + m.y) / 2, (c.z + m.z) / 2))
            _new_co[v.index] = c.lerp(avg, w); _new_co.setdefault(mi, m.lerp(Vector((-avg.x, avg.y, avg.z)), w)); _ne += 1
        for i_, co_ in _new_co.items(): _jv[i_].co = co_
        _new['Jacket'].data.update(); print('OUTFIT jacket sides made alike', _ne)
    # round the neck and down the upper chest the jacket lies outside the shirt: where the two crossed, the shirt's collar showed through the jacket's in teeth.
    # 8 mm clear, down to 18 cm below the neck (23 November 2026: at 4 mm and 10 cm, the cloth check still found the shirt through the lapels in every pose, 2 to 14 mm,
    # in every game that wears this suit: the lapels and the shirt front are weighted to the chest a little differently, so they part by a few millimetres as the body moves)
    if 'Jacket' in _new and 'Shirt' in _new:
        from mathutils.bvhtree import BVHTree as _BVH0
        _sb = bmesh.new(); _sb.from_mesh(_new['Shirt'].data); _sb.normal_update(); _st = _BVH0.FromBMesh(_sb); _n = 0
        for v in _new['Jacket'].data.vertices:
            if v.co.z < NZ - 0.18 * s: continue
            loc, nrm, _i, _d = _st.find_nearest(v.co, 0.025)
            if loc is None: continue
            if nrm.dot(Vector((loc.x, loc.y - NJ.y, 0))) < 0: nrm = -nrm      # outward from the neck
            gap = 0.008 if v.co.z > NZ - 0.14 * s else 0.008 * max(0.0, (v.co.z - (NZ - 0.18 * s)) / (0.04 * s))      # eased out below, so no step shows on the chest
            sd = (v.co - loc).dot(nrm)
            if sd < gap: v.co += nrm * (gap - sd); _n += 1
        _sb.free(); _new['Jacket'].data.update(); print('OUTFIT jacket clear of the shirt collar', _n)
    # over the seat and the hips the jacket lies outside the trousers, 8 mm clear: the trousers' waistband came through the back of the jacket by up to 24 mm when walking
    if 'Jacket' in _new and 'Breeches' in _new:
        from mathutils.bvhtree import BVHTree as _BVH1
        _bb = bmesh.new(); _bb.from_mesh(_new['Breeches'].data); _bb.normal_update(); _bt = _BVH1.FromBMesh(_bb); _n = 0; _hz = J('Hips').z if 'J' in globals() else HIP
        for v in _new['Jacket'].data.vertices:
            if not (_hz - 0.16 * s < v.co.z < _hz + 0.14 * s): continue
            loc, nrm, _i, _d = _bt.find_nearest(v.co, 0.03)
            if loc is None: continue
            if nrm.dot(Vector((loc.x, loc.y - J('Hips').y, 0))) < 0: nrm = -nrm      # outward from the hips
            gap = 0.008 + 0.012 * max(0.0, min(1.0, (v.co.y - J('Hips').y) / (0.06 * s)))      # more room over the seat (behind: +y, the body faces -y), where the stride stretches the trousers out behind
            sd = (v.co - loc).dot(nrm)
            if sd < gap: v.co += nrm * (gap - sd); _n += 1
        _bb.free(); _new['Jacket'].data.update(); print('OUTFIT jacket clear of the trousers', _n)
    # the back vent closes: the two edges of the slit at the back of the jacket are drawn together to overlap by a few millimetres, as a real vent's
    # underlap does, so the trousers no longer show through it (the cloth check found them there by up to 24 mm in every pose, in every game with this suit)
    if 'Jacket' in _new and _OF.get('closevent', True):
        _vb = bmesh.new(); _vb.from_mesh(_new['Jacket'].data); _hy, _hz = J('Hips').y, J('Hips').z; _n = 0
        _edge = [v for v in _vb.verts if v.is_boundary and v.co.y > _hy + 0.02 * s and abs(v.co.x) < 0.06 * s and _hz - 0.35 * s < v.co.z < _hz + 0.06 * s]
        _ring = {e.other_vert(v) for v in _edge for e in v.link_edges} - set(_edge)
        for v in _edge:
            if abs(v.co.x) < 0.004: continue
            sx = 1 if v.co.x > 0 else -1; v.co.x = -sx * 0.003; _n += 1      # each edge just past the middle: the two sides overlap
        for v in _ring:
            if abs(v.co.x) < 0.06 * s and v.co.y > _hy + 0.02 * s: v.co.x *= 0.55      # the cloth beside the edge follows half way, so no fold shows
        _vb.to_mesh(_new['Jacket'].data); _vb.free(); _new['Jacket'].data.update(); print('OUTFIT back vent closed', _n)
    # and under the lapels the shirt front lies a little in: where the shirt stood within 6 mm of the jacket there, it came through the lapels as the chest moved
    if 'Jacket' in _new and 'Shirt' in _new:
        from mathutils.bvhtree import BVHTree as _BVH2
        _jb = bmesh.new(); _jb.from_mesh(_new['Jacket'].data); _jb.normal_update(); _jt = _BVH2.FromBMesh(_jb); _n = 0
        for v in _new['Shirt'].data.vertices:
            if not (NZ - 0.20 * s < v.co.z < NZ - 0.015 * s): continue      # below the collar band, which shows above the jacket's collar
            loc, nrm, _i, _d = _jt.find_nearest(v.co, 0.02)
            if loc is None: continue
            if nrm.dot(Vector((loc.x, loc.y - NJ.y, 0))) < 0: nrm = -nrm
            sd = (loc - v.co).dot(nrm)      # how far inside the jacket the shirt lies
            if sd < 0.009: v.co -= nrm * (0.009 - sd); _n += 1
        _jb.free(); _new['Shirt'].data.update(); print('OUTFIT shirt in under the lapels', _n)
    # what the jacket hides of the shirt is cut away (23 November 2026): a shirt face whose outward line meets the jacket within 4 cm, at least
    # 2.5 cm in from any edge of the jacket, can never be seen, and where the two are weighted a little differently it came through the lapels
    # in motion (the cloth check, every suited body, every game). Faces near the jacket's edges stay, so the V, the collar and the cuffs never open.
    if 'Jacket' in _new and 'Shirt' in _new and _OF.get('trimshirt', True):
        from mathutils.bvhtree import BVHTree as _BVH3
        from mathutils.kdtree import KDTree as _KD3
        _jb = bmesh.new(); _jb.from_mesh(_new['Jacket'].data); _jb.normal_update(); _jt = _BVH3.FromBMesh(_jb)
        _bd = [v.co.copy() for v in _jb.verts if v.is_boundary]; _kd = _KD3(len(_bd))
        for i, c in enumerate(_bd): _kd.insert(c, i)
        _kd.balance(); _sb = bmesh.new(); _sb.from_mesh(_new['Shirt'].data); _sb.normal_update(); _del = []
        for f in _sb.faces:
            c = f.calc_center_median(); d = f.normal
            if d.length < 1e-6: continue
            hit = None
            for dd in (d, -d):      # the face may point either way: whichever way meets the jacket first
                _hh = _jt.ray_cast(c + dd * 0.001, dd, 0.04)
                if _hh[0] is not None and (hit is None or _hh[3] < hit[3]): hit = _hh
            if hit is None: continue
            if _kd.find(hit[0])[2] < 0.025: continue      # near the jacket's edge: it may show as the jacket moves
            if all(_jt.ray_cast(v.co + (v.co - c).normalized() * 0.0005 + d * 0.001, d, 0.05)[0] is not None or _jt.ray_cast(v.co - d * 0.001, -d, 0.05)[0] is not None for v in f.verts): _del.append(f)
        bmesh.ops.delete(_sb, geom=_del, context='FACES'); bmesh.ops.delete(_sb, geom=[v for v in _sb.verts if not v.link_faces], context='VERTS')
        _sb.to_mesh(_new['Shirt'].data); _sb.free(); _jb.free(); _new['Shirt'].data.update(); print('OUTFIT shirt hidden under the jacket cut away', len(_del))
    # the lapels and the jacket's collar are their own piece (Lapels, in the jacket's cloth), which the packer never simplifies (tools/people/pack.mjs WHOLE): cut
    # down with the rest of the jacket, their edges and the notch went soft. Both pieces keep the whole jacket's shading across the cut, so no line shows there.
    if 'Jacket' in _new and _OF.get('lapels', True):
        jk = _new['Jacket']; zb = max([v.co.z for v in _new['JButtons'].data.vertices]) if 'JButtons' in _new else NZ - 0.30 * s; ymid = J('Spine2').y
        def _lap(cc): return (cc.z > zb - 0.012 and cc.y < ymid - 0.02 * s and abs(cc.x) < 0.17 * s and cc.z < NZ + 0.03) or (cc.z > NZ - 0.055 * s and math.hypot(cc.x, cc.y - NJ.y) < 0.14 * s)
        jk.data.update(); nrm = {v.co.to_tuple(5): v.normal.copy() for v in jk.data.vertices}
        lp = jk.copy(); lp.data = jk.data.copy(); lp.name = 'Lapels'; bpy.context.scene.collection.objects.link(lp)
        for o, keep in ((lp, True), (jk, False)):
            b = bmesh.new(); b.from_mesh(o.data)
            bmesh.ops.delete(b, geom=[f for f in b.faces if _lap(f.calc_center_median()) != keep], context='FACES'); bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
            b.to_mesh(o.data); b.free(); o.data.update()
            try: o.data.normals_split_custom_set_from_vertices([nrm.get(v.co.to_tuple(5), v.normal) for v in o.data.vertices])
            except Exception as ex: print('OUTFIT normals', ex)
        clothes.append(lp); _new['Lapels'] = lp; print('OUTFIT lapels', len(lp.data.polygons), 'jacket', len(jk.data.polygons))
    # kept generated pieces (a waistcoat) lie inside the garment's jacket: they were sized for the generated jacket, which stands further out
    if 'Jacket' in _new:
        from mathutils.bvhtree import BVHTree as _BVH
        jb = bmesh.new(); jb.from_mesh(_new['Jacket'].data)
        if 'Lapels' in _new: jb.from_mesh(_new['Lapels'].data)      # the lapels are their own piece now, and they are what lies over the waistcoat's edges
        jb.normal_update(); jt = _BVH.FromBMesh(jb); jb.free()
        for o in [o for o in clothes if o.name.split('.')[0] in tuple(_OF.get('keep', ())) + ('Waistcoat', 'WaistcoatButtons')]:
            n = 0
            o.data.update(); o.data.calc_normals() if hasattr(o.data, 'calc_normals') else None
            for v in o.data.vertices:      # only where the jacket is over it (a ray out from the point meets the jacket): in the jacket's opening it stays where it is
                hit = jt.ray_cast(v.co - v.normal * 0.01, v.normal, 0.04)
                if hit[0] is None: continue
                loc, nrm = hit[0], hit[1]; sd = (v.co - loc).dot(nrm)
                if sd > -0.006: v.co = v.co - nrm * (sd + 0.006); n += 1
            o.data.update(); print('OUTFIT kept', o.name, 'pulled in', n)
    # 2b. an airline pilot's uniform on the suit (Air Jamaica, early 1970s photograph; docs/games/air-jamaica.md, "Early pilot uniforms"):
    #   "uniform": {"double": true, "rings": 4, "wings": true}
    # double: the jacket's own buttons give way to two columns of three gold buttons, as on a double-breasted jacket. rings: gold rings round each
    # sleeve above the cuff (four for a captain, three for a first officer, two for a second officer). wings: a gold wings badge on the left breast.
    # Each piece lies 1.5 to 2.5 mm out from the jacket and takes the jacket's own bone weights where it sits, so it moves with the cloth.
    _UF = _OF.get('uniform') or {}
    if _UF and 'Jacket' in _new:
        COL.setdefault('Rings', srgb((214, 172, 74)))      # gold braid and badges
        from mathutils.bvhtree import BVHTree as _BVU
        _ub = bmesh.new(); _ub.from_mesh(_new['Jacket'].data)
        if 'Lapels' in _new: _ub.from_mesh(_new['Lapels'].data)
        _ub.normal_update(); _ut = _BVU.FromBMesh(_ub); _ub.free()
        def _front(x, z):      # the front of the jacket at (x, z): the first cloth met by a ray from in front
            hit = _ut.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
            return hit[0], hit[1]
        def _on_jacket(name, bm, mat):
            o = bpy.data.objects.new(name, bpy.data.meshes.new(name)); bm.to_mesh(o.data); bm.free(); bpy.context.scene.collection.objects.link(o)
            o.data.materials.append(colmat(mat))
            for g_ in _new['Jacket'].vertex_groups: o.vertex_groups.new(name=g_.name)
            md = o.modifiers.new('wt', 'DATA_TRANSFER'); md.object = _new['Jacket']; md.use_vert_data = True; md.data_types_verts = {'VGROUP_WEIGHTS'}; md.vert_mapping = 'POLYINTERP_NEAREST'; md.layers_vgroup_select_src = 'ALL'; md.layers_vgroup_select_dst = 'NAME'
            with ov(o): bpy.ops.object.modifier_apply(modifier='wt')
            o.parent = rig; o.modifiers.new('Armature', 'ARMATURE').object = rig; clothes.append(o); _new[name] = o; return o
        if _UF.get('double') and 'JButtons' in _new:
            zs = [v.co.z for v in _new['JButtons'].data.vertices]; ztop = max(zs) + 0.035 * s; zlow = min(zs) - 0.01 * s
            clothes.remove(_new['JButtons']); bpy.data.objects.remove(_new['JButtons']); del _new['JButtons']
            bb = bmesh.new(); n = 0
            for i in range(3):
                z = ztop + (zlow - ztop) * i / 2
                for x in (-0.058 * s, 0.058 * s):
                    loc, nrm = _front(x, z)
                    if loc is None: continue
                    bmesh.ops.create_cone(bb, cap_ends=True, segments=10, radius1=0.0075 * s, radius2=0.0062 * s, depth=0.003, matrix=Matrix.Translation(loc + nrm * 0.0022) @ nrm.to_track_quat('Z', 'Y').to_matrix().to_4x4()); n += 1
            _on_jacket('JButtons', bb, 'Buttons'); print('OUTFIT double-breasted buttons', n)
        if _UF.get('rings'):
            bb = bmesh.new(); nr = int(_UF['rings']); NA = 24
            for side in ('Left', 'Right'):
                E, W = J(side + 'ForeArm'), J(side + 'Hand'); ax = (W - E).normalized(); L = (W - E).length
                _jk = _new['Jacket']; _gi = {_jk.vertex_groups[n_].index for n_ in ('mixamorig:' + side + 'ForeArm', 'mixamorig:' + side + 'Hand') if n_ in _jk.vertex_groups}
                tc = max([(v.co - E).dot(ax) for v in _jk.data.vertices if sum(g_.weight for g_ in v.groups if g_.group in _gi) > 0.5 and ((v.co - E) - ax * (v.co - E).dot(ax)).length < 0.08 * s] or [L])      # the cuff: the furthest the sleeve reaches down the forearm (only the sleeve's own points, those that follow the forearm: the jacket's skirt hangs close by the wrist)
                u = ax.orthogonal().normalized(); w = ax.cross(u)
                for k in range(nr):
                    t0 = tc - 0.065 * s - k * 0.019 * s; rows = []      # each ring is a band 1.1 cm wide: two lines of points round the sleeve
                    for t in (t0, t0 - 0.011 * s):
                        c = E + ax * t; row = []
                        for j in range(NA):
                            a = 2 * math.pi * j / NA; d = u * math.cos(a) + w * math.sin(a)
                            hit = _ut.ray_cast(c, d, 0.12 * s)
                            r = ((hit[0] - c).length if hit[0] is not None else 0.05 * s) + 0.0018
                            row.append(bb.verts.new(c + d * r))
                        rows.append(row)
                    for j in range(NA):
                        a_, b_ = rows[0][j], rows[0][(j + 1) % NA]; c_, d_ = rows[1][(j + 1) % NA], rows[1][j]
                        bb.faces.new((a_, b_, c_, d_))
            _on_jacket('Rings', bb, 'Rings'); print('OUTFIT sleeve rings', nr)
        if _UF.get('wings'):
            loc, nrm = _front(0.128 * s, J('Spine2').z + 0.05 * s)      # clear of the lapel's edge (at 9.5 cm it sat on the lapel and cut into it as the lapel moved)
            if loc is not None:
                bb = bmesh.new(); R = nrm.to_track_quat('Z', 'Y').to_matrix().to_4x4(); base = Matrix.Translation(loc + nrm * 0.0018) @ R
                bmesh.ops.create_circle(bb, cap_ends=True, segments=12, radius=0.0075 * s, matrix=base)
                for sx in (-1, 1):      # each wing: a long thin leaf swept out and a little up from the middle
                    bmesh.ops.create_circle(bb, cap_ends=True, segments=12, radius=0.02 * s, matrix=base @ Matrix.Translation((sx * 0.024 * s, 0.003 * s, -0.0003)) @ Matrix.Rotation(sx * 0.12, 4, 'Z') @ Matrix.Diagonal((1.0, 0.22, 1.0, 1.0)))
                _on_jacket('Wings', bb, 'Rings'); print('OUTFIT wings')
    # 3. skin the garment hides goes (its own delete list), except the neck above the collar and anything that is not skin
    bg = h.vertex_groups.get('body')
    for vg_name, inv in OUTFIT_DELETE:
        dg = h.vertex_groups.get(vg_name)
        if dg is None: continue
        b = bmesh.new(); b.from_mesh(h.data); dl = b.verts.layers.deform.verify()
        def _del(v):
            inside = v[dl].get(dg.index, 0) > 0
            if not inv: inside = not inside
            return inside and v.co.z < NZ - 0.035 and (bg is None or v[dl].get(bg.index, 0) > 0)
        dead = [f for f in b.faces if all(_del(v) for v in f.verts)]
        bmesh.ops.delete(b, geom=dead, context='FACES'); bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
        b.to_mesh(h.data); b.free(); h.data.update(); print('OUTFIT skin removed', len(dead))
