"""Wrap each .glb as a small script file the game loads (models/<name>.js).

The artifact host only serves a fixed set of file types, so models ship as
base64 inside JavaScript. Usage: python3 tools/pack_models.py assets/houses/*.glb
"""
import base64, os, sys
out = os.path.join(os.path.dirname(__file__), '..', 'game', 'models')
for path in sys.argv[1:]:
    name = os.path.splitext(os.path.basename(path))[0]
    data = base64.b64encode(open(path, 'rb').read()).decode()
    open(os.path.join(out, name + '.js'), 'w').write('(window.__models=window.__models||{})["%s"]="%s";' % (name, data))
    print('packed', name)
