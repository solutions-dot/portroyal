"""tools/subset_tex.py: copy Port Royal's building surfaces into a shared texture file for other games (22 November 2026).

Reads games/port-royal/site/models/tex_town.js (made by Port Royal's tex.py), keeps the building surfaces, makes any picture larger
than 512 pixels 512 (a phone's budget), and writes shared/textures/tex_1700.js in the same form (window.__tex). A game that wants
them lists "tex_1700" in games/<game>/shared-tex.json; tools/build.mjs copies the file into that game's models; engine/building-tex.js
turns them into materials. Run from the repo root: python3 tools/subset_tex.py
"""
import base64, io, json, re
from PIL import Image

KEYS = ["brick", "brick_n", "plaster", "plaster_n", "stone", "stone_n", "wood", "wood_n", "clay", "clay_n", "shingle", "shingle_n"]
src = open("games/port-royal/site/models/tex_town.js").read()
found = dict(re.findall(r'"([a-z_]+)":"(data:image/jpeg;base64,[^"]+)"', src))
out = {}
for k in KEYS:
    data = base64.b64decode(found[k].split(",", 1)[1])
    im = Image.open(io.BytesIO(data))
    if im.width > 512:
        im = im.resize((512, 512), Image.LANCZOS)
        buf = io.BytesIO()
        im.convert("RGB").save(buf, "JPEG", quality=86)
        data = buf.getvalue()
    out[k] = "data:image/jpeg;base64," + base64.b64encode(data).decode()
    print(k, im.size, len(data))
open("shared/textures/tex_1700.js", "w").write("Object.assign(window.__tex=window.__tex||{}," + json.dumps(out, separators=(",", ":")) + ");\n")
