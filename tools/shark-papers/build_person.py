"""Use the shared builder, with an exporter-only bridge for Blender 4.3 hosts.

No garment or body logic is copied or changed. Blender 5.x uses the source as-is.
"""
import pathlib, runpy, bpy
root=pathlib.Path.cwd()
source=root/'tools/garvey/era.py'
code=source.read_text()
props=bpy.ops.export_scene.gltf.get_rna_type().properties
if 'export_vertex_color_name' not in props:
    code=code.replace("export_vertex_color='NAME',export_vertex_color_name='Col'", "export_vertex_color='ACTIVE'")
if 'export_rest_position_armature' not in props:
    code=code.replace(',export_rest_position_armature=False','')
context={'__name__':'__main__','__file__':str(source)}
exec(compile(code,str(source),'exec'),context)
kit=root/'tools/shark-papers/finish_person.py'
if kit.exists():runpy.run_path(str(kit),init_globals=context)
