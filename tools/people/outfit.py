# Fitted garments: a garment modelled once (a MakeHuman .mhclo, from shared/garments/) fitted to each body, in place of the clothes era.py makes
# by code. Started 21 November 2026, after the owner judged the generated collars, ties and suits not good enough (docs/reviews/collars-20261121.md).
#
# A recipe asks for one with
#   "outfit": {"garment": "toigo_male_suit_tie_and_jacket"}
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
        o = g.copy(); o.data = g.data.copy(); o.name = name; bpy.context.scene.collection.objects.link(o)
        b = bmesh.new(); b.from_mesh(o.data); b.faces.ensure_lookup_table()
        bmesh.ops.delete(b, geom=[f for f in b.faces if tag[f.index] != name], context='FACES')
        bmesh.ops.delete(b, geom=[v for v in b.verts if not v.link_faces], context='VERTS')
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
        def _keep(c): return c.y < J('Spine2').y and abs(c.x) < 0.085 * s and c.z < min(NZ - 0.05 * s, vz + vk * abs(c.x))      # (its top corners stopped short of the lapels, where they showed through)      # the front, below the V and below the collar
        bmesh.ops.delete(b, geom=[f for f in b.faces if not _keep(f.calc_center_median())], context='FACES')
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
    # kept generated pieces (a waistcoat) lie inside the garment's jacket: they were sized for the generated jacket, which stands further out
    if 'Jacket' in _new:
        from mathutils.bvhtree import BVHTree as _BVH
        jb = bmesh.new(); jb.from_mesh(_new['Jacket'].data); jb.normal_update(); jt = _BVH.FromBMesh(jb); jb.free()
        for o in [o for o in clothes if o.name.split('.')[0] in tuple(_OF.get('keep', ())) + ('Waistcoat', 'WaistcoatButtons')]:
            n = 0
            o.data.update(); o.data.calc_normals() if hasattr(o.data, 'calc_normals') else None
            for v in o.data.vertices:      # only where the jacket is over it (a ray out from the point meets the jacket): in the jacket's opening it stays where it is
                hit = jt.ray_cast(v.co - v.normal * 0.01, v.normal, 0.04)
                if hit[0] is None: continue
                loc, nrm = hit[0], hit[1]; sd = (v.co - loc).dot(nrm)
                if sd > -0.004: v.co = v.co - nrm * (sd + 0.004); n += 1
            o.data.update(); print('OUTFIT kept', o.name, 'pulled in', n)
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
