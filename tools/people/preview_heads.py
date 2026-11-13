import os
import bpy, math, sys
from mathutils import Vector
names=sys.argv[-1].split(',')
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
for i,n in enumerate(names):
    bpy.ops.import_scene.gltf(filepath=os.environ.get('NPC_OUT','games/port-royal/site/models/')+n+'.glb')
    for o in bpy.context.selected_objects:
        if o.parent is None: o.location.x=(i-1.5)*0.9
try: bpy.ops.preferences.addon_enable(module='cycles')
except Exception: pass
sc.render.engine='CYCLES'; sc.cycles.samples=32; sc.cycles.use_denoising=True
w=bpy.data.worlds.new('w'); sc.world=w
if w.node_tree is None: w.use_nodes=True
bg=next(n for n in w.node_tree.nodes if n.type=='BACKGROUND'); bg.inputs[0].default_value=(0.75,0.78,0.82,1); bg.inputs[1].default_value=0.8
s=bpy.data.lights.new('s','SUN'); s.energy=3; so=bpy.data.objects.new('s',s); sc.collection.objects.link(so); so.rotation_euler=(math.radians(50),0,math.radians(-30))
bpy.ops.mesh.primitive_plane_add(size=30)
cam=bpy.data.cameras.new('c'); cam.lens=40; co=bpy.data.objects.new('c',cam); sc.collection.objects.link(co); sc.camera=co
def shot(p,loc,tgt,res):
    co.location=Vector(loc); co.rotation_euler=(Vector(tgt)-co.location).to_track_quat('-Z','Y').to_euler(); sc.render.resolution_x,sc.render.resolution_y=res; sc.render.filepath=p; bpy.ops.render.render(write_still=True)
pass #shot('build/group.png',(0,-5.2,1.3),(0,0,0.9),(1200,800))
shot('build/heads.png',(-0.45,-3.2,1.1),(-0.45,0,1.0),(1000,700))
pass #shot('build/back.png',(0.5,4.8,1.4),(0,0,0.9),(1100,750))
