"""Compact upper-lip moustache and close grey beard, fitted to facial landmarks.
The exposed lips separate the moustache from the beard. The beard follows the
chin surface instead of lifting into a crescent over the cheeks.
"""
from mathutils import noise
lip_group=GI['lips']
lips=[v.co for v in h.data.vertices if any(g.group==lip_group and g.weight>0 for g in v.groups)]
lower_lip=min(v.z for v in lips)
lip_width=max(abs(v.x) for v in lips)
COL['Moustache']=srgb([62,58,52] if kind=='emperor' else P['colors']['Hair']);COL['Beard']=srgb([145,146,138] if kind=='emperor' else P['colors']['Hair'])
moustache=bpy.data.objects.get('Moustache')
if moustache:
    moustache.data.materials[0]=colmat('Moustache')
    # Recolour the existing feathered upper-lip geometry without stacking layers.
    colours=moustache.data.color_attributes.get('Col')
    if colours:
        for c in colours.data:
            c.color=(*COL['Moustache'],1)
# Take the beard surface from the actual face. Every vertex stays attached to
# the jaw; there are no fallback points or free tips projecting off the cheek.
bm=bmesh.new();bm.from_mesh(h.data)
remove=[]
for f in bm.faces:
    c=f.calc_center_median()
    if not (HEAD-.045<c.z<lower_lip+.052 and abs(c.x)<.085 and c.y<hy-.040):remove.append(f)
bmesh.ops.delete(bm,geom=remove,context='FACES')
bmesh.ops.subdivide_edges(bm,edges=bm.edges[:],cuts=2,use_grid_fill=True)
remove=[]
for f in bm.faces:
    c=f.calc_center_median()
    top=lower_lip-.005+.043*sstep(lip_width*.55,lip_width*1.6,abs(c.x))
    if c.z>top or c.z<HEAD-(.020 if kind=='emperor' else .035) or abs(c.x)>.078:remove.append(f)
bmesh.ops.delete(bm,geom=remove,context='FACES')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
bm.normal_update()
for v in bm.verts:v.co+=v.normal*.0025
# A copied skin surface still carries deform weights. Clear them before
# binding the hair to Head, so no hidden helper group can move the beard.
dl=bm.verts.layers.deform.active
if dl:
    for v in bm.verts:v[dl].clear()
beard=rigid('Beard',bm,'Beard','Head');paint(beard)
# Fine salt-and-pepper variation stays in vertex colours, with no image texture.
colours=beard.data.color_attributes.get('Col')
for f in beard.data.polygons:
    for li in f.loop_indices:
        v=beard.data.vertices[beard.data.loops[li].vertex_index].co
        grain=.85+.25*noise.noise(v*420)
        c=COL['Beard']*grain
        colours.data[li].color=(*c,1)
print('FITTED FACIAL HAIR',round(lower_lip,4),round(lip_width,4),'beard below mouth, moustache separate')
