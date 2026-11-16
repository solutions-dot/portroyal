"""Compact upper-lip moustache and close grey beard, fitted to facial landmarks.
The exposed lips separate the moustache from the beard. The beard follows the
chin surface instead of lifting into a crescent over the cheeks.

Haile Selassie (kind 'emperor', owner's note "his beard is off", November 2026).
Photographs of 1963 to 1969 (sources in docs/games/selassie.md) show a short,
full, closely trimmed beard: it covers the chin and the whole jaw back to the
ears, where it joins the hair in front of them; on the cheeks it stops at a neat
line that runs from beside the nostrils up and out to the ear; it joins the
moustache at the corners of the mouth; the moustache covers the top of the upper
lip and turns down past the mouth corners; it is fuller at the chin, grey-white
at the chin and the middle of the moustache and darker grey at the sides.

It is one shell taken from the face's own surface (so it cannot float), pushed
out by the hair's thickness inside its outline and sunk just under the skin
outside it. The visible edge is where the shell meets the skin, so it follows a
smooth outline instead of the mesh's grid (the earlier beard's edge was saw-
toothed). Under the chin it stops in front of the throat, so the tunic collar
never has beard inside it (the cloth check reported "Beard shows through Collar"
up to 30 mm before).
"""
from mathutils import noise
from mathutils.kdtree import KDTree
BEARD_UNDER=.028   # metres behind the chin tip that the beard may reach under the chin
lip_group=GI['lips']
lips=[v.co for v in h.data.vertices if any(g.group==lip_group and g.weight>0 for g in v.groups)]
lower_lip=min(v.z for v in lips)
lip_width=max(abs(v.x) for v in lips)
COL['Moustache']=srgb([88,84,78] if kind=='emperor' else P['colors']['Hair']);COL['Beard']=srgb([128,127,121] if kind=='emperor' else P['colors']['Hair'])
moustache=bpy.data.objects.get('Moustache')
if moustache and kind=='emperor':
    # the moustache is part of the beard's shell below
    clothes[:]=[o for o in clothes if o is not moustache]
    bpy.data.objects.remove(moustache,do_unlink=True);moustache=None
if moustache:
    moustache.data.materials[0]=colmat('Moustache')
    # Recolour the existing feathered upper-lip geometry without stacking layers.
    colours=moustache.data.color_attributes.get('Col')
    if colours:
        for c in colours.data:
            c.color=(*COL['Moustache'],1)
if kind in ('emperor','locks'):
    # ---- landmarks, measured on this head ----
    head_group=GI['mixamorig:Head'];ear_group=GI['ears']
    def wt(v,g):
        return sum(x.weight for x in v.groups if x.group==g)
    eye_z=sum((eyes.matrix_world@v.co).z for v in eyes.data.vertices)/len(eyes.data.vertices)
    upper_lip=max(c.z for c in lips if abs(c.x)<.004)
    corner=max(lips,key=lambda c:abs(c.x))
    ears_=[v.co for v in h.data.vertices if wt(v,ear_group)>.5]
    ear_front=min(c.y for c in ears_);ear_low=min(c.z for c in ears_);ear_top=max(c.z for c in ears_)
    def profile(z,x=0.):
        hit=(tree if kind=='emperor' else SKIN).ray_cast(Vector((x,-1,z)),Vector((0,1,0)))[0];return hit.y if hit else 0.
    zs=[upper_lip+i*.001 for i in range(int((eye_z-upper_lip)/.001))]
    tip_z=min(zs,key=profile)                                        # the tip of the nose
    sub_z=max([z for z in zs if z<tip_z],key=profile)                # under the nose, where the moustache starts
    chin_y=min(profile(lower_lip-.004-i*.002) for i in range(12))    # the front of the chin
    yc=hy+.012
    def ang(c):
        return math.atan2(abs(c.x),-(c.y-yc))                      # 0 straight ahead, about 1.6 at the side of the head
    a_nose=ang(Vector((.019,profile(sub_z,.019),sub_z)))
    a_corner=ang(corner)
    a_ear=ang(Vector((.075,ear_front,ear_low)))
    print('BEARD LANDMARKS eye',round(eye_z,4),'nose tip',round(tip_z,4),'under nose',round(sub_z,4),'upper lip',round(upper_lip,4),
          'lower lip',round(lower_lip,4),'corner',[round(x,4) for x in corner],'chin',round(chin_y,4),'ear',round(ear_front,4),round(ear_low,4),
          'angles',round(a_nose,3),round(a_corner,3),round(a_ear,3))
    def top_line(a):
        # the upper edge: under the nose, then the moustache's outer edge beside the nostril, then the neat cheek line rising to the ear,
        # then the hair in front of the ear (it reaches up under the cap)
        if kind=='locks':
            # A lower cheek line and a rounded jaw, rather than a dark face mask.
            z=sub_z+.003-.009*sstep(a_nose*.45,a_nose*.95,a)
            z-=.012*sstep(a_nose*1.1,a_corner*1.2,a)
            z+=.032*sstep(a_corner*1.2,a_ear,a)
            z+=.012*sstep(a_ear*.98,a_ear*1.1,a)
            return z
        z=sub_z+.0045
        z-= .009*sstep(a_nose*.45,a_nose*.95,a)                       # under each nostril's wing, never up its side
        z+=(tip_z-sub_z+.042)*sstep(a_nose*1.1,a_ear*.98,a)**.6
        z+=(ear_top+.03-tip_z)*sstep(a_ear*.92,a_ear*1.08,a)
        return z
    # the lower lip and the line of the mouth stay bare; the moustache hangs over most of the upper lip, and the beard
    # meets it at the corners of the mouth (the lips group reaches up to the nose, so the mouth line is the corners' height)
    mouth_z=corner.z
    bare=[c for c in lips if c.z<mouth_z-.0012 and abs(c.x)<lip_width*.86]
    kd=KDTree(len(bare))
    for i,c in enumerate(bare):kd.insert(c,i)
    kd.balance()
    def inside(c,w):
        # signed distance (metres, positive inside the beard's outline)
        a=ang(c)
        d=top_line(a)-c.z
        d=min(d,ear_front+.004+.022*sstep(ear_low,ear_low-.02,c.z)-c.y)                    # in front of the ear; below it, round the jaw
        if c.z<lower_lip-.02:d=min(d,chin_y+BEARD_UNDER-c.y)                                 # under the chin, never back to the throat
        d=min(d,(w-.42)*.06)                                                                 # off the head onto the neck (the jaw line)
        if band_top is not None:d=min(d,c.z-band_top-.005-.008*sstep(chin_y+.004,chin_y+.02,c.y))   # under the chin, clear of the tie and collar: on his short neck the chin comes down to them as he bows his head (the cloth check)
        if c.y<yc-.04:d=min(d,kd.find(c)[2]-.0018)                                           # the lips
        return d
    # the front of the tie (its knot under the chin), not the band that goes up round the back of the neck under the collar
    tie=bpy.data.objects.get('Tie');tf=[v.co for v in tie.data.vertices if v.co.y<hy-.04] if tie else []
    tie_top=max(c.z for c in tf) if tf else None
    tie_front=min(c.y for c in tf if c.z>tie_top-.03) if tf else 0
    band_top=max(v.co.z for v in tie.data.vertices) if tie else None
    bm=bmesh.new();bm.from_mesh(h.data)
    dl=bm.verts.layers.deform.active
    remove=[f for f in bm.faces if not (HEAD-.05<f.calc_center_median().z<eye_z+.04 and f.calc_center_median().y<ear_front+.03 and abs(f.calc_center_median().x)<.1)]
    bmesh.ops.delete(bm,geom=remove,context='FACES')
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    bmesh.ops.subdivide_edges(bm,edges=bm.edges[:],cuts=2,use_grid_fill=True)
    bm.normal_update()
    # the head's weight at each point (subdivision interpolates the new points' weights)
    D={v:inside(v.co,v[dl].get(head_group,0.) if dl else 1.) for v in bm.verts}
    moved={}
    for v in bm.verts:
        c=v.co;a=ang(c)
        chin=sstep(a_corner*1.5,a_corner*.3,a)*sstep(lower_lip+.004,lower_lip-.012,c.z)       # the middle of the chin, below the lip
        must=sstep(mouth_z,mouth_z+.004,c.z)*sstep(a_corner*1.25,a_corner*.9,a)              # the moustache
        T=.0018+.0022*sstep(lower_lip+.008,lower_lip-.02,c.z)+.0036*chin*(1-.3*sstep(a_corner*.4,a_corner*1.4,a))+.0040*must
        if kind=='locks':T*=1.7  # visible short hair volume, fuller at the chin
        moved[v]=(-.0028+(T+.0028)*sstep(-.001,.0025+.0015*(1-must),D[v]),v.normal.copy())
    # faces wholly under the skin never show
    hidden=[f for f in bm.faces if all(moved[v][0]<=0 for v in f.verts)]
    bmesh.ops.delete(bm,geom=hidden,context='FACES')
    # small loose islands left round the mouth would show as specks: keep only the large pieces
    seen=set()
    for f in list(bm.faces):
        if f in seen:continue
        part=[f];seen.add(f);i=0
        while i<len(part):
            for e in part[i].edges:
                for g in e.link_faces:
                    if g not in seen:seen.add(g);part.append(g)
            i+=1
        if len(part)<150:bmesh.ops.delete(bm,geom=part,context='FACES')
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    moved={v:v.co+n*off for v,(off,n) in moved.items() if v.is_valid}
    # fuller at the chin: the hair below the chin hangs a little lower and further forward
    for v in bm.verts:
        a=ang(v.co)
        if D[v]>0 and v.co.z<lower_lip-.006:
            k=sstep(a_corner*1.6,a_corner*.2,a)*sstep(lower_lip-.006,lower_lip-.02,v.co.z)*sstep(0,.004,D[v])
            moved[v]=moved[v]+Vector((0,-.002,-.0015))*k
    for v,p in moved.items():v.co=p
    if dl:
        for v in bm.verts:v[dl].clear()
    bm.normal_update()
    if kind=='emperor':beard=rigid('Beard',bm,'Beard','Head')
    else:
        beard=soft('Beard',bm,'Beard',src=h)
        for group in list(beard.vertex_groups):
            if not group.name.startswith('mixamorig:'):beard.vertex_groups.remove(group)
    paint(beard)
    colours=beard.data.color_attributes.get('Col')
    if kind=='emperor':grey=srgb([156,154,148]);dark=srgb([66,64,61]);mid=srgb([92,90,86])
    else:
        hair=[max(c,n) for c,n in zip(P['colors']['Hair'],[42,36,30])];grey=srgb([min(255,c+12) for c in hair]);dark=srgb(hair);mid=srgb([min(255,c+6) for c in hair])
    for f in beard.data.polygons:
        for li in f.loop_indices:
            v=beard.data.vertices[beard.data.loops[li].vertex_index].co;a=ang(v)
            side=sstep(a_corner*1.1,a_ear*.85,a)                                              # darker towards the ears
            mo=sstep(mouth_z,mouth_z+.004,v.z)*(1-side)
            c=grey.lerp(dark,side**.8).lerp(mid,mo)
            grain=.82+.3*noise.noise(v*520)+.06*noise.noise(v*90)
            colours.data[li].color=(*(c*grain),1)
    print('FITTED FACIAL HAIR',P['name'],': one shell, tie front',round(tie_front,4),'tie top',tie_top and round(tie_top,4),'chin',round(chin_y,4),'under nose',round(sub_z,4),len(beard.data.vertices),'points')
