# Preview Garvey-era characters: python3 tools/garvey/preview.py name1,name2 [out.png]
# Reads NPC_OUT/<name>.glb; writes front and three-quarter views to build/ (git-ignored). Brighter than tools/people/preview_body.py.
import os, bpy, math, sys
from mathutils import Vector
args=[a for a in sys.argv[sys.argv.index('--')+1:]] if '--' in sys.argv else sys.argv[-1:]
names=args[0].split(',')
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
for i,n in enumerate(names):
    bpy.ops.import_scene.gltf(filepath=os.environ.get('NPC_OUT','build/people/')+n+'.glb')
    for o in bpy.context.selected_objects:
        if o.parent is None: o.location.x=i*1.0
try: bpy.ops.preferences.addon_enable(module='cycles')
except Exception: pass
sc.render.engine='CYCLES'; sc.cycles.samples=24; sc.cycles.use_denoising=True
sc.view_settings.view_transform='Standard'
w=bpy.data.worlds.new('w'); sc.world=w
if w.node_tree is None: w.use_nodes=True
bg=next(n for n in w.node_tree.nodes if n.type=='BACKGROUND'); bg.inputs[0].default_value=(0.80,0.82,0.85,1); bg.inputs[1].default_value=1.6
for rot,en in (((50,0,-35),5.0),((60,0,140),2.0)):
    s=bpy.data.lights.new('s','SUN'); s.energy=en; so=bpy.data.objects.new('s',s); sc.collection.objects.link(so); so.rotation_euler=tuple(math.radians(x) for x in rot)
cam=bpy.data.cameras.new('c'); cam.lens=55; co=bpy.data.objects.new('c',cam); sc.collection.objects.link(co); sc.camera=co
cx=(len(names)-1)*0.5
for p,loc in (('build/garvey_front.png',(cx,-6.2,0.95)),('build/garvey_34.png',(cx+3.6,-5.0,1.0))):
    co.location=Vector(loc); co.rotation_euler=(Vector((cx,0,0.88))-co.location).to_track_quat('-Z','Y').to_euler()
    sc.render.resolution_x,sc.render.resolution_y=(1300,880); sc.render.filepath=p; bpy.ops.render.render(write_still=True)
