"""Uniform reconstruction from the owner's five arrival-day reference images.
Full-size tunic, pale shirt/tie, red gorget tabs, ribbons, Sam Browne belt and
braided gold cords. No photograph is embedded in the model.
"""
from mathutils import Matrix
COL['Insignia']=srgb([180,151,81]);COL['Gorget']=srgb([157,41,36])
# The uniform's fitted lapels replace the civilian suit's broad lapels.
# (21 November 2026, owner: "this cannot be your finished model". With "outfit" in the recipe the tunic is the modelled jacket fitted to him
# (tools/people/outfit.py): its own collar and lapels are kept, and the hand-made lapel inserts and centre buttons below are left out. Removing
# the fitted lapels, as this script did for the generated jacket, tore the tunic open.)
FITTED=bool(P.get('outfit'))
old_lapels=bpy.data.objects.get('Lapels')
if old_lapels and not FITTED:bpy.data.objects.remove(old_lapels,do_unlink=True)
tunic=PART['jacket'];st=tree_of(PART['shirt'])
if FITTED and old_lapels:
    _jb=bmesh.new();_jb.from_mesh(tunic.data);_jb.from_mesh(old_lapels.data);_jb.normal_update();jt=BVHTree.FromBMesh(_jb);_jb.free()
else:jt=tree_of(tunic)
def near_src(p):      # the piece of the tunic a badge lies on: the fitted jacket's lapels and collar are their own piece, and a tab that took the jacket's
    # weights while lying on the lapel drifted off it when he moved (the red collar tabs floated in front of his throat)
    if not (FITTED and old_lapels):return tunic
    d=lambda o:min(((v.co-p).length for v in o.data.vertices),default=9)
    return old_lapels if d(old_lapels)<d(tunic) else tunic
def front(x,z,off=.006):
    origin=Vector((x,hy-.8,z));direction=Vector((0,1,0))
    hits=[t.ray_cast(origin,direction)[0] for t in (jt,st,tree)]
    hits=[p for p in hits if p is not None and p.y<hy]
    return min((p.y for p in hits),default=hy-.14)-off

def patch(name,x,z,w,h,material,off=.007,slant=0):
    bm=bmesh.new();rows=[]
    for j in range(3):
        zz=z+(j/2-.5)*h;row=[]
        for i in range(3):
            xx=x+(i/2-.5)*w+slant*(zz-z);row.append(bm.verts.new((xx,front(xx,zz,off),zz)))
        rows.append(row)
    quadstrip(bm,rows);bm.normal_update()
    if sum(f.normal.y for f in bm.faces)>0:bmesh.ops.reverse_faces(bm,faces=bm.faces[:])
    o=soft(name,bm,material,src=near_src(Vector((x,front(x,z,0),z))));paint(o);return o
# The civilian suit template has a broad open V. This tunic has a much
# narrower shirt opening, with khaki lapels reaching the neck on both sides.
# Fit these inserts to the shirt surface before adding tabs or braid.
for sx in ([] if FITTED else [-1,1]):
    bm=bmesh.new();rows=[]
    for j in range(25):
        t=j/24;z=NECK-.205+t*.185;rise=z-(NECK-.212)
        inner=.23*rise;outer=.70*rise+.008
        rows.append([bm.verts.new((sx*(inner+(outer-inner)*k/5),front(sx*(inner+(outer-inner)*k/5),z,.009),z)) for k in range(6)])
    quadstrip(bm,rows);o=soft('Tunic lapel',bm,'Jacket',src=PART['shirt']);paint(o)

# Lower, close-fitting crown, as in the arrival-day salute photograph.
cap=bpy.data.objects.get('Cap')
band=bpy.data.objects.get('CapBand')
if cap:
    floor=min(v.co.z for v in cap.data.vertices)
    roof=max(v.co.z for v in cap.data.vertices)
    ratio=max(.70,(TOP+.005-floor)/(roof-floor))
    for v in cap.data.vertices:
        v.co.x*=.93;v.co.y=hy+(v.co.y-hy)*.95;v.co.z=floor+(v.co.z-floor)*ratio
if band:
    for v in band.data.vertices:v.co.x*=.93;v.co.y=hy+(v.co.y-hy)*.95
# Raised golden cap crest and a black polished peak beneath its red band.
band=bpy.data.objects.get('CapBand')
if band:
    ca=band.data.color_attributes.get('Col');floor=min(v.co.z for v in band.data.vertices)
    for f in band.data.polygons:
        if sum(band.data.vertices[k].co.z for k in f.vertices)/len(f.vertices)<floor+.02:
            for k in f.loop_indices:ca.data[k].color=(*srgb([24,22,20]),1)
cap=bpy.data.objects.get('Cap')
if cap:
    hit=tree_of(cap).ray_cast(Vector((0,hy-.6,TOP-.05)),Vector((0,1,0)))[0]
    if hit:
        sphere('Cap crest',hit+Vector((0,-.007,0)),(.008,.0025,.012),'Insignia')
        sphere('Cap crown',hit+Vector((0,-.008,.015)),(.005,.002,.004),'Insignia')
# Red collar tabs follow the jacket's lapels, not the white shirt.
for sx in [-1,1]:patch('Gorget',sx*.054,NECK-.055,.019,.044,'Gorget',.016,slant=sx*.3)
# Compact coloured ribbon rows on the left breast. Colour and layout are a
# visual reconstruction; the game does not identify or award individual orders.
colours=[[172,42,39],[53,105,142],[222,188,79],[218,214,188],[50,113,79],[68,58,95]]
for i,c in enumerate(colours):COL['Ribbon'+str(i)]=srgb(c)
# Four columns of narrow ribbon bars, each made from three colour stripes.
# The reference has ribbons, not a grid of large square tiles.
# (21 November 2026, owner: "the medals on his jacket are off from where they should be". The rack sat half on the lapel. It is on the left breast
# now, clear of the lapel and above the breast pocket, 7 rows by 4.)
RX=.078 if FITTED else .047;RZ=NECK-(.152 if FITTED else .14)
for row in range(7 if FITTED else 9):
    for col in range(4):
        for stripe in range(3):
            x=RX+col*.018+stripe*.0053
            patch('Ribbon',x,RZ-row*.007,.0051,.0048,'Ribbon'+str((col+row*2+stripe)%6),.012 if FITTED else .018)
# Small flat service stars below the ribbon rack.
for i in range(3):
    x=(RX+.012 if FITTED else .054)+i*.022;z=RZ-(.060 if FITTED else .071);bm=bmesh.new();ring=[]
    for k in range(10):
        a=k/10*math.pi*2;r=.007 if k%2==0 else .0032
        xx=x+math.sin(a)*r;zz=z+math.cos(a)*r
        ring.append(bm.verts.new((xx,front(xx,zz,.010 if FITTED else .016),zz)))
    bm.faces.new(ring);o=soft('Service star',bm,'Insignia',src=tunic);paint(o)
# Four pocket flaps and centre buttons give the long tunic its period outline.
for sx in [-1,1]:
    patch('Breast pocket',sx*.095,NECK-.24,.077,.024,'Jacket',.006)
    patch('Hip pocket',sx*.12,HIP-.035,.092,.035,'Jacket',.006)
for i in ([] if FITTED else range(4)):
    z=NECK-.18-i*.082;sphere('Tunic button',(0,front(0,z,.010),z),(.006,.006,.006),'Insignia','Spine2',tunic)
# Broad brown waist belt over the jacket and diagonal shoulder strap.
bm=bmesh.new();rows=[]
for z in [HIP+.035,HIP+.092]:
    # the belt's outline: the tunic's radius at 48 points, with misses and odd hits (a gap where the tunic's skirt joins, a sleeve) replaced by the
    # middle value of their neighbours and the whole ring evened out. Taken point by point, the lower edge came out in teeth (owner, 21 November 2026).
    center=Vector((0,J('Hips').y,z));R=[]
    for i in range(48):
        a=i/48*2*math.pi;d=Vector((math.sin(a),-math.cos(a),0));hit=jt.ray_cast(center,d)[0];R.append((hit-center).length if hit else None)
    good=sorted(x for x in R if x is not None) or [.17];R=[x if x is not None else good[len(good)//2] for x in R]
    R=[sorted(R[(i+k)%48] for k in (-2,-1,0,1,2))[2] for i in range(48)]
    for _ in range(3):R=[(R[i-1]+2*R[i]+R[(i+1)%48])/4 for i in range(48)]
    ring=[]
    for i in range(49):
        a=i/48*2*math.pi;d=Vector((math.sin(a),-math.cos(a),0));ring.append(bm.verts.new(center+d*(R[i%48]+.010)))
    rows.append(ring)
quadstrip(bm,rows);o=soft('Sam Browne belt',bm,'Belt',src=tunic);paint(o)
patch('Belt buckle',0,HIP+.064,.039,.043,'Insignia',.022)
bm=bmesh.new();rows=[]
# (21 November 2026, owner: "the strap is crooked". Each edge used to take its own depth from the cloth, so the strap twisted and kinked over the
# lapel. It is now one straight band of even width from the right shoulder to the left hip: one depth for each row, the furthest forward of what
# lies under its width, evened out along its length so it bridges the lapel instead of climbing it.)
_A=Vector((-.145,0,NECK-.055));_B=Vector((.125,0,HIP+.065));_dir=(_B-_A).normalized();_perp=Vector((_dir.z,0,-_dir.x))*.017;_ys=[]
for i in range(25):
    c=_A.lerp(_B,i/24);_ys.append(min(front(c.x+k*_perp.x,c.z+k*_perp.z,.012) for k in (-1,0,1)))
for _ in range(10):_ys=[_ys[0]]+[min(_ys[i],(_ys[i-1]+_ys[i+1])/2) for i in range(1,24)]+[_ys[24]]
# (owner, the same day: "the strap doesn't go over the shoulder". It now starts at the belt on his back, runs up the back, over the top of the right
# shoulder and down the front, as a Sam Browne cross strap does.)
def back(x,z,off=.012):
    hit=jt.ray_cast(Vector((x,hy+.8,z)),Vector((0,-1,0)))[0];return (hit.y if hit else hy+.10)+off
def over(x,y,off=.008):
    hit=jt.ray_cast(Vector((x,y,NECK+.25)),Vector((0,0,-1)))[0];return (hit.z if hit else NECK)+off
_A2=Vector((-.125,0,NECK-.075));_B2=Vector((.10,0,HIP+.065));_yb=[min(9,max(back(_A2.lerp(_B2,i/16).x+k*.012,_A2.lerp(_B2,i/16).z) for k in (-1,0,1))) for i in range(17)]
for _ in range(8):_yb=[_yb[0]]+[max(_yb[i],(_yb[i-1]+_yb[i+1])/2) for i in range(1,16)]+[_yb[16]]
if FITTED:
    for i in range(16,-1,-1):      # up the back, from the belt
        c=_A2.lerp(_B2,i/16);rows.append([bm.verts.new((c.x+k*.017,_yb[i],c.z+k*.006)) for k in (-1,1)])
    for j in range(1,10):      # over the top of the shoulder
        t=j/10;x=_A2.x+(_A.x-_A2.x)*t;y=_yb[0]+(_ys[0]-_yb[0])*t;zt=max(over(x-.017,y),over(x,y),over(x+.017,y));zz=max(zt,_A2.z+(_A.z-_A2.z)*t)
        ox=.017+(abs(_perp.x)-.017)*t;oz=.006+(_perp.z*(-1 if _perp.x<0 else 1)-.006)*t      # the band's width turns smoothly from its line on the back to its line on the front
        rows.append([bm.verts.new((x+k*ox,y,zz+k*oz)) for k in (-1,1)])
_sg=-1 if _perp.x<0 else 1
for i in range(25):
    c=_A.lerp(_B,i/24);rows.append([bm.verts.new((c.x+k*_sg*_perp.x,_ys[i],c.z+k*_sg*_perp.z)) for k in (-1,1)])
if FITTED:      # the band's two edges are evened out along its length where it turns over the shoulder (it stepped and twisted there: owner, "the strap is broken at the shoulder")
    for _ in range(6):
        for k in (0,1):
            P_=[r[k].co.copy() for r in rows]
            for i in range(10,34): rows[i][k].co=(P_[i-1]+P_[i]*2+P_[i+1])/4
    for r in rows[10:34]:      # and kept clear of the cloth
        for v_ in r:
            loc,nrm,_i,_d=jt.find_nearest(v_.co,.05)
            if loc is not None and (v_.co-loc).dot(nrm)<.007: v_.co+=nrm*(.007-(v_.co-loc).dot(nrm))
quadstrip(bm,rows);o=soft('Shoulder strap',bm,'Belt',src=tunic)
# Each row across the strap takes the mean weights of its neighbours along it (two rows each way), and both edges of a row share them:
# where the strap crosses the shoulder, the cloth weights change fast and one edge point used to jut 5 to 7 mm in walking.
def smooth_rows(o,per=2,win=2):
    me=o.data;n=len(me.vertices)//per
    rows=[[{g.group:g.weight for g in me.vertices[r*per+k].groups} for k in range(per)] for r in range(n)]
    for r in range(n):
        acc={};cnt=0
        for rr in range(max(0,r-win),min(n,r+win+1)):
            for d in rows[rr]:
                cnt+=1
                for g,w in d.items():acc[g]=acc.get(g,0)+w
        for k in range(per):
            v=me.vertices[r*per+k]
            for gi in [g.group for g in v.groups]:o.vertex_groups[gi].remove([v.index])
            for g,w in acc.items():
                if w/cnt>1e-4:o.vertex_groups[g].add([v.index],w/cnt,'REPLACE')
smooth_rows(o,win=12 if FITTED else 2);paint(o)      # (fitted tunic: one set of weights from end to end, so the strap stays one straight band when he walks)
# Loose, braided aiguillettes hang forward from the right shoulder.
for strand in range(3):
    bm=bmesh.new();rows=[]
    # (21 November 2026: the cords lie on the chest in three neat loops from the right shoulder to the top button. They used to hang 5 to 8 cm off the
    # chest as hair-thin lines, a tangle beside the body. Each cord is 5 mm thick, 8 mm off the cloth, and its line is evened out along its length.)
    pts=[]
    for i in range(29):
        t=i/28;x=-.15+.135*t;z=NECK-.06-(.10+strand*.03)*math.sin(t*math.pi)-.05*t
        pts.append([x,front(x,z,.008),z])
    for _ in range(6):
        for i in range(1,28):pts[i][1]=min(pts[i][1],(pts[i-1][1]+pts[i+1][1])/2)
    for x,y,z in pts:
        row=[]
        for k in range(6):
            a=k/6*math.pi*2;row.append(bm.verts.new((x+math.cos(a)*.0025,y+math.sin(a)*.0025,z)))
        rows.append(row)
    quadstrip(bm,rows,close=True);o=soft('Aiguillette',bm,'Insignia',src=tunic);paint(o)
# Khaki shoulder boards sit on the tops of the shoulders. Narrow gold edges
# replace the previous yellow rectangles on the front of the sleeves.
for sx in [-1,1]:
    bm=bmesh.new();rows=[]
    for j in range(3):
        y=hy-.025+j*.025;row=[]
        for i in range(5):
            x=sx*(.105+i*.019)
            hit=jt.ray_cast(Vector((x,y,NECK+.2)),Vector((0,0,-1)))[0]
            z=(hit.z if hit else NECK-.055)+.005
            row.append(bm.verts.new((x,y,z)))
        rows.append(row)
    quadstrip(bm,rows);o=soft('Shoulder board',bm,'Jacket',src=tunic);paint(o)
    ca=o.data.color_attributes.get('Col')
    for f in o.data.polygons:
        for li in f.loop_indices:
            v=o.data.vertices[o.data.loops[li].vertex_index].co
            if abs(v.y-hy)>.020:ca.data[li].color=(*COL['Insignia'],1)

# The aiguillettes and medal drops hang in front of the tunic's eased cloth.
# Keep their complete length clear when the shoulders rise for the salute.
for o in list(bpy.context.scene.objects):
    if o.type!='MESH':continue
    if o.name.startswith('Aiguillette'):
        for v in o.data.vertices:v.co.y-=(.004 if FITTED else .035)
    if o.name.startswith('Service star'):
        for v in o.data.vertices:v.co.y-=.003
    if o.name=='Shoulder strap':
        for v in o.data.vertices:v.co.y-=(.006 if FITTED else .020)
