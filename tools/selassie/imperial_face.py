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
BEARD=P.get('beard') or {}
COL['Moustache']=srgb([54,51,48] if kind=='emperor' else P['colors']['Hair']);COL['Beard']=srgb([98,96,92] if kind=='emperor' else P['colors']['Hair'])      # the Emperor in April 1966 (the owner's photographs): a dark beard, greying at the chin, not a pale grey one
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
        top=lower_lip-.004+.042*sstep(lip_width*.55,lip_width*1.5,abs(c.x))      # full round the mouth and chin and along the jaw; it does not climb to the cheekbones (at 62 mm it read as a mask)
        under=c.z<lower_lip-.032 and c.y>front+BEARD_UNDER
        if c.z>top or c.z<HEAD-.008 or abs(c.x)>.080 or under:remove.append(f)
    else:
        # The Rastafari men (16 November 2026, after the owner's note): the beard follows the jaw and the chin and stops in front of the throat.
        # It reached 35 mm down the neck and 78 mm out, and read as a black bib with a ragged edge.
        top=lower_lip-.006+.040*sstep(lip_width*.6,lip_width*1.55,abs(c.x))
        under=c.z<lower_lip-.030 and c.y>front+BEARD.get('under',.040)
        if c.z>top or c.z<HEAD-.016 or abs(c.x)>.072 or under:remove.append(f)
bmesh.ops.delete(bm,geom=remove,context='FACES')
bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
bm.normal_update()
smooth_edge(bm,iters=10)      # a clean outline: cut face by face, the edge ran in steps
EDGE={v.index:(0. if v.is_boundary else .55 if any(e.other_vert(v).is_boundary for e in v.link_edges) else 1.) for v in bm.verts}      # 0 on the outline, 1 well inside: the colour feathers into the skin
for v in bm.verts:
    # a short full beard: a little thicker over the chin than on the cheeks
    if kind=='emperor':v.co+=v.normal*(.0036+.0034*sstep(lip_width*1.3,lip_width*.2,abs(v.co.x)))*(.45+.55*EDGE[v.index])
    else:
        chin=sstep(lip_width*1.7,lip_width*.3,abs(v.co.x))*sstep(lower_lip-.012,lower_lip-.045,v.co.z)      # 1 on the chin, 0 on the cheeks
        v.co+=v.normal*(BEARD.get('thick',.004)*(.45+.55*EDGE[v.index])*(1+.8*chin))+Vector((0,-.12,-1))*BEARD.get('len',.012)*chin*EDGE[v.index]      # fuller and longer at the chin (recipe key "beard": len, thick, under, in metres)
# A copied skin surface still carries deform weights. Clear them before
# binding the hair to Head, so no hidden helper group can move the beard.
dl=bm.verts.layers.deform.active
if dl:
    for v in bm.verts:v[dl].clear()
beard=rigid('Beard',bm,'Beard','Head');paint(beard)
_fa=beard.data.attributes.get('_FACE')      # the beard is cut from the face's skin and carried its face mark: only the skin itself is the face (tools/people/pack.mjs)
if _fa:beard.data.attributes.remove(_fa)
# Fine salt-and-pepper variation stays in vertex colours, with no image texture.
colours=beard.data.color_attributes.get('Col')
for f in beard.data.polygons:
    for li in f.loop_indices:
        v=beard.data.vertices[beard.data.loops[li].vertex_index].co
        grain=.85+.25*noise.noise(v*420)
        c=COL['Beard']*grain
        if kind=='emperor':c=c*(1-.5*sstep(lip_width*.7,lip_width*1.5,abs(v.x)))   # darker at the sides, greyest at the chin
        c=(COL['Skin']*1.55).lerp(c,.25+.75*EDGE.get(beard.data.loops[li].vertex_index,1.))   # the outline feathers into the skin (drawn 1.55 times lighter in the game)
        colours.data[li].color=(*c,1)
print('FITTED FACIAL HAIR',round(lower_lip,4),round(lip_width,4),'beard below mouth, moustache separate')
