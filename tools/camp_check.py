import math, itertools
# footprint rectangles: (name, cx, cz, half-x, half-z, rotation-y)  rotation as in three.js (y up)
def rect(name,x,z,hx,hz,ry): return (name,x,z,hx,hz,ry)
def corners(r):
    n,x,z,hx,hz,ry=r; c,s=math.cos(ry),math.sin(ry)
    # three.js rotation.y: local (lx,lz) -> world (lx*c + lz*s, -lx*s + lz*c)
    return [(x+lx*c+lz*s, z-lx*s+lz*c) for lx,lz in ((hx,hz),(hx,-hz),(-hx,-hz),(-hx,hz))]
def axes(p): return [ (p[(i+1)%4][1]-p[i][1], -(p[(i+1)%4][0]-p[i][0])) for i in range(2)]
def overlap(a,b):
    A,Bc=corners(a),corners(b)
    for ax in axes(A)+axes(Bc):
        pa=[px*ax[0]+pz*ax[1] for px,pz in A]; pb=[px*ax[0]+pz*ax[1] for px,pz in Bc]
        if max(pa)<min(pb)-1e-6 or max(pb)<min(pa)-1e-6: return False
    return True
import json,sys
L=json.load(open(sys.argv[1]))
R=[rect(*o) for o in L['items']]
bad=0
for a,b in itertools.combinations(R,2):
    if overlap(a,b): print('OVERLAP',a[0],'<->',b[0]); bad+=1
xmin,xmax,zlim=L['bounds']
for r in R:
    for px,pz in corners(r):
        if px<xmin or px>xmax or abs(pz)>zlim: print('OUT',r[0],round(px,2),round(pz,2)); bad+=1; break
print('problems',bad)
