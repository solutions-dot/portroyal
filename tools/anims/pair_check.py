# tools/anims/pair_check.py: check two-person clips (the comfort clips) for bodies passing through each other.
#
# Both real bodies are posed with their clips (the FBX files from tools/anims/handmade.py, carried onto each body the
# way tools/anims/retarget_clips.py does it), placed as the game must place them, skinned, and measured at 32 moments
# of the loop:
#   (a) every point of one body inside the other, or closer than 1 cm to it, by body part (the giver's resting hand
#       is allowed to touch, but never to go in);
#   (b) the giver's resting hand: how far its nearest point is above the other person's surface (it should stay
#       between 0.5 and 2 cm, and never lift more than 3 cm);
#   (c) each person's hands against their own body (a hand through one's own chest or face).
# It prints the worst depth for each pair of parts. Bodies come from build/people/<name>.blend (made by era.py).
#
#   python3 tools/anims/pair_check.py                  # every pair
#   python3 tools/anims/pair_check.py ComfortHand      # one pair
import bpy, os, sys, math
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CLIPS = os.path.join(ROOT, 'shared', 'anim-sources', 'handmade')
PEOPLE = os.path.join(ROOT, 'build', 'people')
N = 32
# giver clip, taker clip, giver body, taker body, where the taker stands relative to the giver (x, y, turn, scale), seated
PAIRS = {
    'ComfortGive': ('ComfortGive', 'ComfortTake', 'man_shirt', 'woman57', (-0.415, -0.205, 0.0, 1.0), False),
    'ComfortHand': ('ComfortHand', 'ComfortTake', 'man_shirt', 'woman57', (0.0, -0.58, math.pi, 1.0), False),
    'ComfortChild': ('ComfortChild', 'ComfortTake', 'woman_elder', 'boy', (-0.31, -0.24, 0.0, 0.6), False),
    'SitComfort': ('SitComfortGive', 'SitComfortTake', 'man_shirt', 'woman57', (-0.465, -0.27, 0.0, 1.0), True),
}
REST = {'ComfortGive': 'Right', 'ComfortHand': 'Left', 'ComfortChild': 'Right', 'SitComfort': 'Right'}   # the giver's hand and forearm that rest on the other person
SKIP = ('Human.low-poly', 'Cap')   # the proxy mesh and the spare cap (each game shows one hat)


def part_of(obj_name, group):
    n = obj_name
    if n.startswith('Hat'): return 'hat'
    if n.startswith('Skirt'): return 'skirt'
    g = group.replace('mixamorig:', '')
    for side in ('Left', 'Right'):
        if g.startswith(side):
            r = g[len(side):]
            if r.startswith('Hand'): return side + 'Hand'
            if r.startswith('ForeArm'): return side + 'ForeArm'
            if r.startswith('Arm'): return side + 'UpperArm'
            if r.startswith('Shoulder'): return 'shoulders'
            return 'legs'
    if g in ('Neck', 'Head'): return 'head'
    if g == 'Spine2': return 'shoulders'
    if g in ('Spine', 'Spine1'): return 'body'
    return 'hips'


def load(scene, body, fbx, place, giver=False):
    with bpy.data.libraries.load(os.path.join(PEOPLE, body + '.blend')) as (src, dst): dst.objects = src.objects
    rig = None; meshes = []
    for o in dst.objects:
        scene.collection.objects.link(o)
        if o.type == 'ARMATURE': rig = o
    for o in dst.objects:
        if o.type == 'MESH' and o.parent == rig and not any(o.name.startswith(k) for k in SKIP): meshes.append(o)
    x, y, rz, s = place
    e = bpy.data.objects.new('off', None); scene.collection.objects.link(e)
    e.location = (x, y, 0); e.rotation_euler = (0, 0, rz); e.scale = (s, s, s)
    rig.location = e.location; rig.rotation_euler = e.rotation_euler; rig.scale = e.scale
    before = set(bpy.data.objects); bpy.ops.import_scene.fbx(filepath=fbx, automatic_bone_orientation=False)
    src = [o for o in bpy.data.objects if o not in before and o.type == 'ARMATURE'][0]; src.parent = e
    for pb in rig.pose.bones:
        pb.matrix_basis.identity()
        if pb.name not in src.pose.bones: continue
        c = pb.constraints.new('COPY_ROTATION'); c.target = src; c.subtarget = pb.name; c.target_space = 'WORLD'; c.owner_space = 'WORLD'
        if 'Hips' in pb.name:
            c2 = pb.constraints.new('COPY_LOCATION'); c2.target = src; c2.subtarget = pb.name; c2.target_space = 'WORLD'; c2.owner_space = 'WORLD'
    labels = []
    for o in meshes:
        names = {g.index: g.name for g in o.vertex_groups}
        for v in o.data.vertices:
            best = max((g for g in v.groups if names.get(g.group, '').startswith('mixamorig')), key=lambda g: g.weight, default=None)
            labels.append(part_of(o.name, names[best.group] if best else ''))
    act = src.animation_data.action
    return dict(rig=rig, off=e, meshes=meshes, labels=labels, frames=(int(act.frame_range[0]), int(act.frame_range[1])))


def shape(p, dg):
    """World positions and triangles of a posed body, with each triangle's part."""
    verts = []; tris = []; tpart = []; base = 0
    for o in p['meshes']:
        ev = o.evaluated_get(dg); m = ev.to_mesh(); mw = o.matrix_world
        verts.extend(mw @ v.co for v in m.vertices)
        m.calc_loop_triangles()
        for t in m.loop_triangles:
            tris.append(tuple(base + i for i in t.vertices)); tpart.append(p['labels'][base + t.vertices[0]])
        base += len(m.vertices); ev.to_mesh_clear()
    return verts, tris, tpart


def ground(p, dg_get):
    p['rig'].location.z = 0; p['off'].location.z = 0; bpy.context.view_layer.update(); dg = dg_get(); lo = 9
    for o in p['meshes']:
        if o.name.startswith(('Shoes', 'Sole')):
            ev = o.evaluated_get(dg); m = ev.to_mesh(); lo = min(lo, min((o.matrix_world @ v.co).z for v in m.vertices)); ev.to_mesh_clear()
    if lo < 9: p['rig'].location.z = -lo; p['off'].location.z = -lo


def signed(tree, v, parts=None):
    """Distance to the nearest surface, negative when the point is behind it (inside). Garments are open shells, so a
    point more than 5 cm behind the nearest surface is taken to be on its far side, not deep inside; hats (open brims)
    are only measured by distance."""
    hit = tree.find_nearest(v, 0.2)
    if hit[0] is None: return None, None
    loc, nrm, idx, d = hit
    if (v - loc).dot(nrm) >= 0 or (parts and parts[idx] == 'hat'): return d, idx
    return (-d if d < 0.05 else None), idx


def run(name):
    gclip, tclip, gbody, tbody, place, seated = PAIRS[name]
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    G = load(sc, gbody, os.path.join(CLIPS, gclip + '.fbx'), (0, 0, 0, 1), True)
    Tk = load(sc, tbody, os.path.join(CLIPS, tclip + '.fbx'), place)
    f0, f1 = G['frames']; worst = {}; band = []; selfhit = {}
    def note(key, depth):
        if depth > worst.get(key, 0): worst[key] = depth
    for k in range(N):
        sc.frame_set(f0 + round(k * (f1 - f0) / N))
        if not seated:
            for p in (G, Tk): ground(p, bpy.context.evaluated_depsgraph_get)
        dg = bpy.context.evaluated_depsgraph_get()
        if os.environ.get('DEBUG') and k == 0:
            W = lambda p, b: tuple(round(x, 3) for x in p['rig'].matrix_world @ p['rig'].pose.bones['mixamorig:' + b].head)
            print('DEBUG giver', {b: W(G, b) for b in ('RightShoulder', 'RightArm', 'RightForeArm', 'RightHand', 'RightHandMiddle1')})
            print('DEBUG taker', {b: W(Tk, b) for b in ('LeftArm', 'RightArm', 'RightForeArm', 'Spine2', 'Neck', 'Head')})
        gv, gt, gp = shape(G, dg); tv, tt, tp = shape(Tk, dg)
        gtree = BVHTree.FromPolygons(gv, gt); ttree = BVHTree.FromPolygons(tv, tt)
        hand = 9.0
        for v, lab in zip(gv, G['labels']):            # the giver against the taker
            d, i = signed(ttree, v, tp)
            if d is None: continue
            if lab in (REST[name] + 'Hand', REST[name] + 'ForeArm'):   # the arm that rests on them may touch, never go in
                if lab == REST[name] + 'Hand':
                    hand = min(hand, d)
                    if os.environ.get('DEBUG') and k == 0 and d < -0.02: print('DEBUG deep hand point', tuple(round(x, 3) for x in v), round(d, 3), tp[i], ttree.find_nearest(v)[0])
                if d < 0: note(('giver ' + lab, 'taker ' + tp[i]), -d)
                if d < -0.03 and os.environ.get('DEBUG') and lab.endswith('ForeArm'): print('DEBUG deep forearm', k, tuple(round(x, 3) for x in v), round(d, 3), tp[i])
            elif d < 0.01: note(('giver ' + lab, 'taker ' + tp[i]), 0.01 - d)
        for v, lab in zip(tv, Tk['labels']):            # the taker against the giver
            d, i = signed(gtree, v, gp)
            if d is None: continue
            if gp[i] in (REST[name] + 'Hand', REST[name] + 'ForeArm'): continue   # the resting arm is measured from its own side above (a thin hand has no reliable inside)
            if d < 0.01: note(('taker ' + lab, 'giver ' + gp[i]), 0.01 - d)
        band.append(hand)
        for who, (vs, ts, ps, labs) in (('giver', (gv, gt, gp, G['labels'])), ('taker', (tv, tt, tp, Tk['labels']))):   # hands through one's own body
            keep = [(t, pp) for t, pp in zip(ts, ps) if pp in ('body', 'shoulders', 'head', 'hips', 'legs', 'skirt')]
            own = BVHTree.FromPolygons(vs, [t for t, pp in keep]); kp = [pp for t, pp in keep]
            for v, lab in zip(vs, labs):
                if not lab.endswith('Hand'): continue
                d, i = signed(own, v)
                if d is not None and d < -0.004: selfhit[(who, lab + ' in ' + kp[i])] = max(selfhit.get((who, lab + ' in ' + kp[i]), 0), -d)
    print('PAIR', name, '(%s + %s, %s + %s)' % (gclip, tclip, gbody, tbody))
    rest = [b for b in band if b < 9]
    if os.environ.get('DEBUG'): print('DEBUG band', ' '.join('%.3f' % b for b in band))
    if rest: print('  giver resting hand above their surface: min %.3f m, max %.3f m (want 0.005 to 0.02, never over 0.03)' % (min(rest), max(rest)))
    bad = {k: v for k, v in worst.items() if v > 0}
    print('  contacts or overlaps (depth past the 1 cm gap; the resting hand counts only if it goes in):', 'none' if not bad else '')
    for (a, b), d in sorted(bad.items(), key=lambda kv: -kv[1]): print('    %-22s vs %-22s %.3f m' % (a, b, d))
    print('  hands through own body:', 'none' if not selfhit else ', '.join('%s %s %.3f m' % (w, l, d) for (w, l), d in selfhit.items()))
    return bad, rest, selfhit


def search(name, step=0.015, span=4, frames=6):
    """Try the other person at nearby places (a grid of `step` metres, `span` steps each way) and print the places
    with no overlap whose resting hand is nearest the middle of its band. The bodies are posed once; the other
    person is only slid along the floor."""
    gclip, tclip, gbody, tbody, place, seated = PAIRS[name]
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    G = load(sc, gbody, os.path.join(CLIPS, gclip + '.fbx'), (0, 0, 0, 1), True)
    Tk = load(sc, tbody, os.path.join(CLIPS, tclip + '.fbx'), place)
    f0, f1 = G['frames']; poses = []
    for k in range(frames):
        sc.frame_set(f0 + round(k * (f1 - f0) / frames))
        if not seated:
            for p in (G, Tk): ground(p, bpy.context.evaluated_depsgraph_get)
        dg = bpy.context.evaluated_depsgraph_get(); poses.append((shape(G, dg), shape(Tk, dg)))
    rest = (REST[name] + 'Hand', REST[name] + 'ForeArm'); res = []
    for ix in range(-span, span + 1):
        for iy in range(-span, span + 1):
            off = Vector((ix * step, iy * step, 0)); over = 0.0; lo, hi = 9.0, -9.0
            for (gv, gt, gp), (tv, tt, tp) in poses:
                tvs = [v + off for v in tv]; ttree = BVHTree.FromPolygons(tvs, tt); gtree = BVHTree.FromPolygons(gv, gt); hand = 9.0
                for v, lab in zip(gv, G['labels']):
                    d, i = signed(ttree, v, tp)
                    if d is None: continue
                    if lab in rest:
                        if lab == rest[0]: hand = min(hand, d)
                        if d < 0: over = max(over, -d)
                    elif d < 0.01: over = max(over, 0.01 - d)
                for v, lab in zip(tvs, Tk['labels']):
                    d, i = signed(gtree, v, gp)
                    if d is None or gp[i] in rest: continue
                    if d < 0.01: over = max(over, 0.01 - d)
                lo = min(lo, hand); hi = max(hi, hand)
            res.append((over, abs((lo + hi) / 2 - 0.012) + max(0, hi - lo - 0.015), place[0] + off.x, place[1] + off.y, lo, hi))
    res.sort()
    for r in res[:8]: print('  place x %.3f y %.3f  overlap %.3f  hand %.3f to %.3f' % (r[2], r[3], r[0], r[4], r[5]))


if __name__ == '__main__':
    if '--search' in sys.argv:
        for n in [a for a in sys.argv[1:] if a in PAIRS]: print('SEARCH', n); search(n)
        sys.exit(0)
    args = [a for a in sys.argv[1:] if not a.endswith('.py')]
    for n in (args or list(PAIRS)): run(n)
