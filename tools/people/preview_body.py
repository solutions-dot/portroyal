import os
import bpy, math, sys
from mathutils import Vector
names=sys.argv[-1].split(',')
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
for i,n in enumerate(names):
    bpy.ops.import_scene.gltf(filepath=os.environ.get('NPC_OUT','games/port-royal/site/models/')+n+'.glb')
    for o in bpy.context.selected_objects:
        if o.parent is None: o.location.x=i*0.9
sc.render.engine='CYCLES'; sc.cycles.samples=16
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True
w.node_tree.nodes['Background'].inputs[0].default_value=(0.75,0.78,0.82,1)
s=bpy.data.lights.new('s','SUN'); s.energy=3; so=bpy.data.objects.new('s',s); sc.collection.objects.link(so); so.rotation_euler=(math.radians(50),0,math.radians(150))
cam=bpy.data.cameras.new('c'); cam.lens=50; co=bpy.data.objects.new('c',cam); sc.collection.objects.link(co); sc.camera=co
cx=(len(names)-1)*0.45
for p,loc in (('build/back.png',(cx,4.6,1.0)),('build/front.png',(cx,-4.6,1.0))):
    co.location=Vector(loc); co.rotation_euler=(Vector((cx,0,0.95))-co.location).to_track_quat('-Z','Y').to_euler(); sc.render.resolution_x,sc.render.resolution_y=(1400,700); sc.render.filepath=p; bpy.ops.render.render(write_still=True)
