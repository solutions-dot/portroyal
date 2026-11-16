"""Compact upper-lip moustache and close grey beard, fitted to facial landmarks.
The exposed lips separate the moustache from the beard. The beard follows the
chin surface instead of lifting into a crescent over the cheeks.

Haile Selassie (kind 'emperor', November 2026 review): in the 1960s photographs his
beard is a short, full beard over the jaw and the lower cheeks, joined to the
moustache at the corners of the mouth, grey with darker hair at the sides. It is
taken from the face's own surface, so it cannot float. Under the chin it stops in
front of the throat, so the tunic collar never has beard inside it (the cloth
check reported "Beard shows through Collar" up to 30 mm).
"""
from mathutils import noise
BEARD_UNDER=.035   # metres behind the chin tip that the beard may reach under the chin
lip_group=GI['lips']
lips=[v.co for v in h.data.vertices if any(g.group==lip_group and g.weight>0 for g in v.groups)]
lower_lip=min(v.z for v in lips)
lip_width=max(abs(v.x) for v in lips)
COL['Moustache']=srgb([88,84,78] if kind=='emperor' else P['colors']['Hair']);COL['Beard']=srgb([128,127,121] if kind=='emperor' else P['colors']['Hair'])
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
front=min(v.co.y for v in bm.verts)   # the tip of the chin (the face looks along -y)
for f in bm.faces:
    c=f.calc_center_median()
    if kind=='emperor':
        # Up the cheeks to just under the cheekbone at the sides, down to the lower lip in the middle,
        # joining the moustache at the mouth corners; under the chin only the front half, clear of the throat.
        top=lower_lip-.004+.062*sstep(lip_width*.5,lip_width*1.5,abs(c.x))
        under=c.z<lower_lip-.032 and c.y>front+BEARD_UNDER
        if c.z>top or c.z<HEAD-.008 or abs(c.x)>.080 or under:remove.append(f)
    else:
        top=lower_lip-.005+.043*sstep(lip_width*.55,lip_width*1.6,abs(c.x))
        if c.z>top or c.z<HEAD-.035 or abs(c.x)>.078:remove.append(f)
bmesh.ops.delete(bm,geom=remove,context='FACES')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
bm.normal_update()
for v in bm.verts:
    # a short full beard: a little thicker over the chin than on the cheeks
    v.co+=v.normal*((.0032+.0026*sstep(lip_width*1.3,lip_width*.2,abs(v.co.x))) if kind=='emperor' else .0025)
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
        if kind=='emperor':c=c*(1-.35*sstep(lip_width*.8,lip_width*1.5,abs(v.x)))   # darker at the sides, greyest at the chin
        colours.data[li].color=(*c,1)
print('FITTED FACIAL HAIR',round(lower_lip,4),round(lip_width,4),'beard below mouth, moustache separate')
