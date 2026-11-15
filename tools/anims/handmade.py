# tools/anims/handmade.py: animation clips made by hand, for movements no clip library offers.
#
# Each clip is built on the shared rig (shared/rig/char.blend, Mixamo bone names "mixamorig:..."), often on top of a
# library source clip (the Walk or Idle FBX in shared/anim-sources/), with poses layered over it as smooth curves of time.
# Arms and legs are placed by a small two-bone IK solver (a hand goes to a spot, the elbow points a given way), heads are
# steadied in the world, and every curve is periodic, so the last frame equals the first and the clip loops cleanly.
# The result is written as an FBX with no mesh to shared/anim-sources/handmade/<Name>.fbx at 30 frames a second, in place,
# so it goes through tools/anims/retarget_clips.py and the packing steps like any downloaded clip (docs/PIPELINE.md, section 2).
#
#   python3 tools/anims/handmade.py                       # build every clip below (python3 must have bpy, as for retarget_clips.py)
#   python3 tools/anims/handmade.py Speech SitScared      # build only these
#   python3 tools/anims/handmade.py --list                # list the clips
#
# All clips here are made by this project and are CC0 (public domain).
import bpy, os, sys, math, random
from mathutils import Vector, Matrix, Quaternion

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'shared', 'anim-sources')
OUT = os.path.join(SRC, 'handmade')
FPS = 30
P = 'mixamorig:'
TAU = math.pi * 2
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))   # the rig faces -Y; +X is the character's left; Z is up


# ---------------------------------------------------------------- the rig: rest pose and forward kinematics
class Rig:
    def __init__(self, obj):
        self.obj = obj
        bones = obj.data.bones
        self.names = [b.name for b in bones]   # Blender lists parents before children
        self.parent = {b.name: (b.parent.name if b.parent else None) for b in bones}
        self.rest = {b.name: b.matrix_local.copy() for b in bones}
        self.rel = {n: (self.rest[self.parent[n]].inverted() @ self.rest[n]) if self.parent[n] else self.rest[n].copy() for n in self.names}
        self.rel3 = {n: self.rel[n].to_3x3() for n in self.names}
        self.rest3 = {n: self.rest[n].to_3x3() for n in self.names}
        self.length = {b.name: b.length for b in bones}
        self.palm = {}   # each hand's palm normal in the hand's own frame (it points out of the palm)
        for s in ('Left', 'Right'):
            h = P + s + 'Hand'; yh = self.rest3[h].col[1]
            across = self.rest[P + s + 'HandIndex1'].translation - self.rest[P + s + 'HandPinky1'].translation
            n = yh.cross(across).normalized()
            if n.x * self.rest[h].translation.x > 0: n = -n   # at rest the palms face the thighs
            self.palm[s] = self.rest3[h].inverted() @ n
        self.hinge = {}  # the axis an elbow or knee bends about, in each bone's own frame
        for a, b in (('LeftArm', 'LeftForeArm'), ('RightArm', 'RightForeArm'), ('LeftUpLeg', 'LeftLeg'), ('RightUpLeg', 'RightLeg')):
            n = self.rest3[P + a].col[1].cross(self.rest3[P + b].col[1]).normalized()
            self.hinge[a] = self.rest3[P + a].inverted() @ n; self.hinge[b] = self.rest3[P + b].inverted() @ n

    def fk(self, pose):
        M = {}
        for n in self.names:
            p = self.parent[n]
            basis = Matrix.Translation(pose.loc) @ pose.rot[n].to_matrix().to_4x4() if n == P + 'Hips' else pose.rot[n].to_matrix().to_4x4()
            M[n] = (M[p] @ self.rel[n] if p else self.rel[n]) @ basis
        return M


class Pose:
    def __init__(self, rot, loc):
        self.rot = rot; self.loc = loc
    def copy(self):
        return Pose({k: v.copy() for k, v in self.rot.items()}, self.loc.copy())


def rest_pose(rig):
    return Pose({n: Quaternion() for n in rig.names}, Vector())


# ---------------------------------------------------------------- small maths helpers
def frame(a_loc, b_loc, A, B):
    """The rotation that takes local vector a to world A and local b (made square to a) to world B."""
    a = a_loc.normalized(); b = (b_loc - a * a.dot(b_loc)).normalized(); c = a.cross(b)
    A = A.normalized(); B = (B - A * A.dot(B)).normalized(); C = A.cross(B)
    return Matrix((A, B, C)).transposed() @ Matrix((a, b, c))


def rot(axis, ang):
    return Matrix.Rotation(ang, 3, axis)


def smooth(x):   # 0 to 1 with gentle ends
    x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)


def ease(x):     # gentler still (smootherstep)
    x = max(0.0, min(1.0, x)); return x * x * x * (x * (x * 6 - 15) + 10)


def bump(t, t0, t1, rin=0.4, rout=0.6, T=None):
    """0 outside [t0, t1], rising over rin seconds and falling over rout. With T it wraps round the loop."""
    if T is not None and t < t0: t += T
    if t < t0 or t > t1: return 0.0
    return ease((t - t0) / rin) * ease((t1 - t) / rout)


class Waves:
    """Smooth, looping wobble: a sum of sines whose periods divide the loop, so it ends where it starts."""
    def __init__(self, seed, terms):
        r = random.Random(seed); self.terms = [(k, a, r.random()) for k, a in terms]
    def __call__(self, u):
        return sum(a * math.sin(TAU * (k * u + ph)) for k, a, ph in self.terms)


class Spline:
    """A looping Catmull-Rom curve through keys [(time, value), ...] (values are floats or Vectors). Repeat a key for a hold."""
    def __init__(self, keys, T, tension=1.0):
        self.k = sorted(keys, key=lambda kv: kv[0]); self.T = T; self.tension = tension
    def __call__(self, t):
        k, T, n = self.k, self.T, len(self.k); t = t % T
        i = max(j for j in range(-1, n) if j < 0 or k[j][0] <= t)
        def key(j):
            q, r = divmod(j, n); return k[r][0] + q * T, k[r][1]
        (t0, p0), (t1, p1), (t2, p2), (t3, p3) = key(i - 1), key(i), key(i + 1), key(i + 2)
        dt = (t2 - t1) or 1e-6; s = (t - t1) / dt
        m1 = (p2 - p0) * (self.tension * dt / ((t2 - t0) or 1e-6)); m2 = (p3 - p1) * (self.tension * dt / ((t3 - t1) or 1e-6))
        h00, h10, h01, h11 = 2 * s**3 - 3 * s**2 + 1, s**3 - 2 * s**2 + s, -2 * s**3 + 3 * s**2, s**3 - s**2
        return p1 * h00 + m1 * h10 + p2 * h01 + m2 * h11


def V(*a):
    return Vector(a)


# ---------------------------------------------------------------- posing tools (each works on a Pose in place)
def set_world(rig, pose, b, W, M=None):
    """Turn bone b so its world orientation is W (its children follow)."""
    M = M or rig.fk(pose); n = P + b; p = rig.parent[n]
    pf = (M[p] @ rig.rel[n]).to_3x3() if p else rig.rel3[n]
    pose.rot[n] = (pf.inverted() @ W).to_quaternion()


def turn(rig, pose, b, axis, ang, M=None):
    """Turn bone b about a world axis (through its own joint)."""
    M = M or rig.fk(pose); set_world(rig, pose, b, rot(axis, ang) @ M[P + b].to_3x3(), M)


def turn_local(pose, b, axis, ang):
    n = P + b; pose.rot[n] = pose.rot[n] @ Quaternion(axis, ang)


def body_dir(rig, M, side, out, fwd, up, bone='Spine2'):
    """A direction given as (out to this side, forwards, up), turned with the bone (Spine2 by default)."""
    sx = -1 if side == 'Right' else 1
    D = M[P + bone].to_3x3() @ rig.rest3[P + bone].inverted()
    return D @ V(sx * out, -fwd, up)


def body_point(rig, M, side, out, fwd, up, bone='Spine2', at=None):
    """A point (out, forwards, up) in metres from this side's shoulder joint at rest (or from `at`), carried with the bone."""
    sx = -1 if side == 'Right' else 1
    D = M[P + bone].to_3x3() @ rig.rest3[P + bone].inverted()
    base = rig.rest[P + (at or side + 'Arm')].translation - rig.rest[P + bone].translation
    return M[P + bone].translation + D @ (base + V(sx * out, -fwd, up))


_TWIST = {}


def limb_ik(rig, pose, upper, lower, end, target, pole, end_W=None, twist=0.0):
    """Two-bone IK: put the end bone's joint at `target`, the middle joint towards `pole`, and (if given) the end bone at
    world orientation end_W. `twist` is the share of the end bone's roll that the lower bone takes (forearms roll; shins do not)."""
    M = rig.fk(pose); U, L, E = P + upper, P + lower, P + end
    S = M[U].translation; l1 = rig.rel[L].translation.length; l2 = rig.rel[E].translation.length
    d = target - S; dist = max(0.02, min(d.length, 0.995 * (l1 + l2))); u = d.normalized()
    a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist); h = math.sqrt(max(0.0, l1 * l1 - a * a))
    v = pole - u * pole.dot(u)
    v = v.normalized() if v.length > 1e-6 else u.orthogonal().normalized()
    J = S + u * a + v * h; W = S + u * dist
    d1 = (J - S).normalized(); d2 = (W - J).normalized(); n = d1.cross(d2)
    n = n.normalized() if n.length > 1e-5 else u.cross(v).normalized()
    WU = frame(Y, rig.hinge[upper], d1, n); WL = frame(Y, rig.hinge[lower], d2, n)
    if end_W is not None and twist:
        q = (WL.inverted() @ end_W).to_quaternion(); th = 2 * math.atan2(q.y, q.w)
        th = (th + math.pi) % TAU - math.pi
        last = _TWIST.get(lower)
        if last is not None:   # keep the roll continuous from the last frame, so a forearm never flips round
            while th - last > math.pi: th -= TAU
            while last - th > math.pi: th += TAU
        _TWIST[lower] = th; WL = WL @ rot(Y, twist * th)
    p = rig.parent[U]; pf = (M[p] @ rig.rel[U]).to_3x3()
    pose.rot[U] = (pf.inverted() @ WU).to_quaternion()
    pose.rot[L] = ((WU @ rig.rel3[L]).inverted() @ WL).to_quaternion()
    if end_W is not None: pose.rot[E] = ((WL @ rig.rel3[E]).inverted() @ end_W).to_quaternion()
    else:   # keep the end bone's old world orientation
        pose.rot[E] = ((WL @ rig.rel3[E]).inverted() @ M[E].to_3x3()).to_quaternion()


def hand_W(rig, side, fingers, palm):
    """World orientation for a hand whose fingers point along `fingers` and whose palm faces `palm`."""
    return frame(Y, rig.palm[side], fingers, palm)


def arm(rig, pose, side, wrist, elbow, fingers, palm, twist=0.55):
    limb_ik(rig, pose, side + 'Arm', side + 'ForeArm', side + 'Hand', wrist, elbow, hand_W(rig, side, fingers, palm), twist)


def curl(rig, pose, side, amount, thumb=0.0):
    """Bend the fingers towards the palm at their first joint (amount in radians). Only the first joints are set: the
    library packer drops finger joints 2 to 4 (tools/anims/optimize_clips.mjs), so those stay at rest in the games."""
    pn = rig.rest3[P + side + 'Hand'] @ rig.palm[side]
    for f in ('Index', 'Middle', 'Ring', 'Pinky'):
        n = P + side + 'Hand' + f + '1'
        yf = rig.rest3[n].col[1]; ax = rig.rest3[n].inverted() @ yf.cross(pn).normalized()
        pose.rot[n] = Quaternion(ax, amount * {'Index': 0.85, 'Middle': 1.0, 'Ring': 1.08, 'Pinky': 1.15}[f])
    if thumb:
        n = P + side + 'HandThumb1'
        yf = rig.rest3[n].col[1]; ax = rig.rest3[n].inverted() @ yf.cross(pn).normalized()
        pose.rot[n] = pose.rot[n] @ Quaternion(ax, thumb)


def level(rig, pose, b, k=1.0):
    """Roll bone b about the forward axis so its side-to-side line is level (k of the way)."""
    M = rig.fk(pose); lat = M[P + b].to_3x3() @ (rig.rest3[P + b].inverted() @ X)
    turn(rig, pose, b, Y, k * math.asin(max(-1, min(1, lat.z / lat.length))), M)


def steady_head(rig, pose, yaw=0.0, pitch=0.0, roll=0.0, neck=0.5):
    """Hold the head at a fixed world orientation (upright, facing forwards, then turned by yaw/pitch/roll);
    the neck takes `neck` of the turn and the head the rest."""
    Wt = rot(Z, yaw) @ rot(X, pitch) @ rot(Y, roll) @ rig.rest3[P + 'Head']
    M = rig.fk(pose); D = (Wt @ M[P + 'Head'].to_3x3().inverted()).to_quaternion()
    turn(rig, pose, 'Neck', D.axis, D.angle * neck, M)
    set_world(rig, pose, 'Head', Wt)


def plant_foot(rig, pose, side, ankle, foot_W, knee_dir):
    limb_ik(rig, pose, side + 'UpLeg', side + 'Leg', side + 'Foot', ankle, knee_dir, foot_W, 0.0)


# ---------------------------------------------------------------- base clips
def load_base(rig, fbx):
    """Read a library clip onto our rig exactly as retarget_clips.py does (world rotations, plus the hips position).
    Returns a list of Poses, one per source frame."""
    ours = rig.obj; before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=fbx, automatic_bone_orientation=False)
    new = [o for o in bpy.data.objects if o not in before]; src = [o for o in new if o.type == 'ARMATURE'][0]
    src.matrix_world = ours.matrix_world.copy(); act = src.animation_data.action
    f0, f1 = int(act.frame_range[0]), int(act.frame_range[1]); cons = []
    for pb in ours.pose.bones:
        if pb.name not in src.pose.bones: continue
        c = pb.constraints.new('COPY_ROTATION'); c.target = src; c.subtarget = pb.name; c.target_space = 'WORLD'; c.owner_space = 'WORLD'; cons.append((pb, c))
        if 'Hips' in pb.name:
            c2 = pb.constraints.new('COPY_LOCATION'); c2.target = src; c2.subtarget = pb.name; c2.target_space = 'WORLD'; c2.owner_space = 'WORLD'; cons.append((pb, c2))
    sc = bpy.context.scene; out = []
    for f in range(f0, f1 + 1):
        sc.frame_set(f); M = {pb.name: pb.matrix.copy() for pb in ours.pose.bones}; rotd = {}; loc = Vector()
        for n in rig.names:
            p = rig.parent[n]; basis = ((M[p] @ rig.rel[n]) if p else rig.rel[n]).inverted() @ M[n]
            rotd[n] = basis.to_quaternion().normalized()
            if n == P + 'Hips': loc = basis.translation.copy()
        out.append(Pose(rotd, loc))
    for pb, c in cons: pb.constraints.remove(c)
    for o in new: bpy.data.objects.remove(o)
    return out


def seam(frames):
    """Make a run of poses end exactly where it starts, spreading the gap over the run so nothing snaps."""
    n = len(frames) - 1; a, b = frames[0], frames[-1]
    err = {k: a.rot[k] @ b.rot[k].inverted() for k in a.rot}; dl = a.loc - b.loc
    for i, p in enumerate(frames):
        w = i / n
        for k in p.rot:
            e = Quaternion().slerp(err[k], w); p.rot[k] = (e @ p.rot[k]).normalized()
        p.loc = p.loc + dl * w
    return frames


def resample(frames, n_out, cycles=1):
    """Stretch a looping run of poses (last == first) to n_out frames, playing it `cycles` times. The result also ends on its first pose."""
    n_in = len(frames) - 1; out = []
    for i in range(n_out + 1):
        x = (i * n_in * cycles / n_out) % n_in; j = int(x); f = x - j; a, b = frames[j], frames[min(j + 1, n_in)]
        out.append(Pose({k: a.rot[k].slerp(b.rot[k], f) for k in a.rot}, a.loc.lerp(b.loc, f)))
    out[-1] = out[0].copy()
    return out


def soften(frames, bones, sigma=4.0):
    """Smooth these bones' turns over time (a Gaussian of `sigma` frames, wrapping round the loop), so a quick change
    of hand or elbow direction eases in and out instead of snapping."""
    n = len(frames) - 1; r = int(sigma * 3); w = [math.exp(-0.5 * (j / sigma) ** 2) for j in range(-r, r + 1)]
    for b in bones:
        k = P + b; src = [frames[i].rot[k].copy() for i in range(n)]
        for i in range(n):
            q0 = src[i]; acc = Vector((0, 0, 0, 0))
            for j, wj in zip(range(-r, r + 1), w):
                q = src[(i + j) % n]; acc += wj * (Vector(q) if q.dot(q0) >= 0 else -Vector(q))
            frames[i].rot[k] = Quaternion(acc).normalized()
        frames[n].rot[k] = frames[0].rot[k].copy()


def mean_rot(frames, k):
    q0 = frames[0].rot[k]; s = Vector((0, 0, 0, 0))
    for p in frames[:-1]:
        q = p.rot[k]; s += Vector(q) if q.dot(q0) >= 0 else -Vector(q)
    return Quaternion(s).normalized()


def damp(frames, scale):
    """Shrink each named bone's movement towards its average over the loop: {'Spine': 0.5, ...}."""
    for b, k in scale.items():
        n = P + b; m = mean_rot(frames, n)
        for p in frames: p.rot[n] = m.slerp(p.rot[n], k)


def calm_idle(rig, seconds, segment=(351, 500)):
    """The library Idle's calm stretch (no big weight change), looped to fill `seconds`."""
    base = load_base(rig, os.path.join(SRC, 'abba_Idle_withoutskin.fbx'))[segment[0] - 1:segment[1]]
    seam(base); n = round(seconds * FPS); cyc = max(1, round(n / (len(base) - 1)))
    return resample(base, n, cyc)


# ---------------------------------------------------------------- a standing body with weight shifts
def stand(rig, frames, T, shifts, sway=0.035, seed=1, knee=0.07):
    """Gentle weight shifts for a standing clip: `shifts(t)` runs from -1 (weight on the right foot) to 1 (on the left).
    The pelvis drops on the free side, the free knee eases forwards, the upper body leans back over the standing foot.
    The feet stay where the base clip put them."""
    wob = Waves(seed, [(1, 0.008), (2, 0.005), (3, 0.003)])
    for i, p in enumerate(frames):
        t = i / FPS; u = t / T; s = shifts(t); M0 = rig.fk(p)
        feet = {sd: (M0[P + sd + 'Foot'].translation.copy(), M0[P + sd + 'Foot'].to_3x3(),
                     (M0[P + sd + 'Leg'].translation - M0[P + sd + 'UpLeg'].translation)) for sd in ('Left', 'Right')}
        turn(rig, p, 'Hips', Y, -sway * s)                              # free side drops
        turn(rig, p, 'Hips', Z, 0.03 * s + wob(u) * 0.5)                # and turns a little
        M1 = rig.fk(p); turn(rig, p, 'Spine', Y, sway * 1.2 * s, M1)    # the body leans back over the standing foot
        M1 = rig.fk(p); turn(rig, p, 'Spine1', Y, wob(u + 0.3), M1)
        for sd in ('Left', 'Right'):
            free = max(0.0, s) if sd == 'Right' else max(0.0, -s)       # the free leg is the one without weight
            a, W, kd = feet[sd]; fwd = -Y
            a = a + V(0, 0, 0.012 * free)                               # its heel lifts a touch
            W = rot(X, -0.12 * free) @ W
            plant_foot(rig, p, sd, a, W, kd.normalized() + fwd * (knee * 4 * free))
    return frames


def breathe(rig, frames, T, cycles, amt=0.018, phase=0.0, shoulders=0.012):
    for i, p in enumerate(frames):
        b = math.sin(TAU * (cycles * i / FPS / T + phase))
        M = rig.fk(p); turn(rig, p, 'Spine1', X, -amt * b * 0.5, M)
        M = rig.fk(p); turn(rig, p, 'Spine2', X, -amt * b, M)
        for sd, sx in (('Left', 1), ('Right', -1)):
            M = rig.fk(p); turn(rig, p, sd + 'Shoulder', Y, -sx * shoulders * (b + 1) * 0.5, M)


# ---------------------------------------------------------------- the clips
CLIPS = {}
def clip(name, source):
    def reg(f):
        CLIPS[name] = (f, source); return f
    return reg


LOAD_R = 0.2       # the load on the head is planned as about 0.2 m round the head's middle
CROWN = 0.19       # the top of the head is about this far above the Head bone's joint


def head_load_hand(rig, p, side, t, T, adjust=0.0, seed=0):
    """A hand steadying a load on the head: the palm flat against the side of the load, the knuckles at its top rim and the
    fingers bent over it. `adjust` (0 to 1) lifts the hand a little, as when she resettles her hold."""
    M = rig.fk(p); w = Waves(seed, [(1, 0.004), (2, 0.003)])(t / T)
    wrist = body_point(rig, M, side, LOAD_R + 0.03 + 0.01 * adjust, 0.025 + w, CROWN + 0.135 + adjust * 0.03, bone='Head', at='Head')
    fingers = body_dir(rig, M, side, -0.04, 0.0, 1.0, bone='Head')
    palm = body_dir(rig, M, side, -1.0, 0.05, 0.0, bone='Head')
    elbow = body_dir(rig, M, side, 1.0, 0.3, -0.3, bone='Head')
    arm(rig, p, side, wrist, elbow, fingers, palm, 0.6)
    curl(rig, p, side, 0.75 - 0.5 * adjust, thumb=0.15)


def raise_shoulder(rig, p, side, amt):
    M = rig.fk(p); turn(rig, p, side + 'Shoulder', Y, (-amt if side == 'Left' else amt), M)


def carry_walk(rig, hands):
    """A walk with a load on the head, steadied by the hands named in `hands`."""
    base = load_base(rig, os.path.join(SRC, 'abba_Walking.fbx'))
    base = seam(base); n = 2 * round((len(base) - 1) * 1.12 / 2)   # a slower cadence; an even frame count, so the packer's every-other-frame samples land on the last frame
    frames = resample(base, n); T = n / FPS
    z0 = sum(p.loc.z for p in frames) / len(frames)
    for p in frames:
        p.loc.x, p.loc.y = 0.006, 0.0
        p.loc.z = z0 + (p.loc.z - z0) * 0.55
    dm = {'Hips': 0.45, 'Spine': 0.4, 'Spine1': 0.4, 'Spine2': 0.35,
          'LeftUpLeg': 0.75, 'RightUpLeg': 0.75, 'LeftFoot': 0.75, 'RightFoot': 0.75}   # shorter, flatter steps: a gliding walk
    for sd in ('Left', 'Right'):
        if sd in hands: continue
        dm[sd + 'Arm'] = 0.55; dm[sd + 'ForeArm'] = 0.6
    damp(frames, dm)
    for i, p in enumerate(frames):
        t = i / FPS
        for b in ('Spine', 'Spine1'):
            turn(rig, p, b, X, -0.03)                                   # stand tall under the load
        level(rig, p, 'Spine2', 0.9)                                    # shoulders level
        sway = math.sin(TAU * (t / T) + 0.4)                            # the head rides a touch ahead of the step, never tips
        steady_head(rig, p, yaw=0.012 * sway, pitch=-0.03, neck=0.45)
        for sd in hands: raise_shoulder(rig, p, sd, 0.16)
        if 'Right' in hands: head_load_hand(rig, p, 'Right', t, T, seed=3)
        if 'Left' in hands: head_load_hand(rig, p, 'Left', t + 0.07, T, seed=5)
        for sd in ('Left', 'Right'):
            if sd not in hands: curl(rig, p, sd, 0.22)
    return frames


@clip('CarryHeadWalk', 'hand-made on the library Walk (abba_Walking.fbx)')
def carry_head_walk(rig):
    return carry_walk(rig, ['Right'])


@clip('CarryHeadWalk2', 'hand-made on the library Walk (abba_Walking.fbx)')
def carry_head_walk2(rig):
    return carry_walk(rig, ['Right', 'Left'])


@clip('CarryHeadIdle', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def carry_head_idle(rig):
    T = 8.0; frames = calm_idle(rig, T)
    damp(frames, {'Spine': 0.5, 'Spine1': 0.5, 'Spine2': 0.5, 'LeftArm': 0.6, 'LeftForeArm': 0.6})
    stand(rig, frames, T, lambda t: math.sin(TAU * t / T + 0.6) * 0.9, sway=0.03, seed=11)
    breathe(rig, frames, T, 2, amt=0.014)
    look = Spline([(0, 0.0), (1.6, 0.0), (2.6, 0.22), (3.8, 0.24), (4.8, 0.02), (6.0, -0.14), (7.0, -0.12)], T, 0.8)
    for i, p in enumerate(frames):
        t = i / FPS
        turn(rig, p, 'Spine', X, 0.035)                                 # upright over her feet under the load
        level(rig, p, 'Spine2', 0.8)
        steady_head(rig, p, yaw=look(t), pitch=-0.03, neck=0.4)       # she turns her head slowly, keeping it level
        raise_shoulder(rig, p, 'Right', 0.16)
        adj = bump(t, 5.2, 6.6, 0.4, 0.7)                               # now and then she resettles her hold on the load
        head_load_hand(rig, p, 'Right', t, T, adjust=adj, seed=4)
        curl(rig, p, 'Left', 0.25)
    return frames


@clip('Speech', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def speech(rig):
    T = 12.0; frames = calm_idle(rig, T)
    damp(frames, {'Spine': 0.6, 'Spine1': 0.6, 'Spine2': 0.6})
    shift = Spline([(0, -0.7), (2.2, -0.8), (3.4, 0.0), (4.6, 0.8), (7.2, 0.7), (8.4, 0.0), (9.6, -0.7)], T, 0.9)
    stand(rig, frames, T, shift, sway=0.035, seed=21)
    breathe(rig, frames, T, 4, amt=0.016)
    # wrist spots as (out, forwards, up) from each shoulder; fingers and palm as directions; elbow as a direction
    LOW = (V(0.07, 0.10, -0.43), V(0.05, 0.2, -1), V(-1, 0.1, 0), V(0.5, -0.3, 0))                 # hands down, relaxed
    BEAT = (V(0.06, 0.30, -0.17), V(-0.15, 1, 0.25), V(-0.4, 0.1, -1), V(0.7, -0.1, -0.6))        # forearm forwards, palm down: making a point
    OPEN = (V(0.20, 0.26, -0.20), V(0.55, 0.8, 0.0), V(0.2, 0.3, 1), V(0.6, -0.1, -0.8))           # open, palm up
    WIDE = (V(0.34, 0.15, -0.12), V(0.8, 0.5, 0.2), V(0.1, 0.55, 0.85), V(0.3, -0.4, -0.85))       # arms wide, palms up and out
    HIGH = (V(0.14, 0.30, 0.24), V(0.0, 0.4, 1), V(0.15, 1, 0.0), V(0.9, 0.2, -0.3))             # raised, palm to the crowd
    CHEST = (V(-0.08, 0.20, -0.10), V(-1, 0.2, 0.2), V(0.15, -1, 0), V(0.6, 0.2, -0.8))            # hand to the heart
    R = [(0.0, LOW), (0.9, LOW), (1.7, BEAT), (2.3, BEAT), (3.3, OPEN), (4.6, OPEN), (5.8, HIGH), (7.2, HIGH), (8.3, BEAT), (9.3, WIDE), (10.3, WIDE), (11.4, LOW)]
    L = [(0.0, LOW), (1.4, LOW), (2.6, LOW), (3.5, OPEN), (4.8, OPEN), (5.6, LOW), (7.4, LOW), (8.4, CHEST), (9.5, WIDE), (10.5, WIDE), (11.6, LOW)]
    def splines(spec, off):
        return [Spline([(t + off, kk[j]) for t, kk in spec], T, 0.85) for j in range(4)]
    SR, SL = splines(R, 0.0), splines(L, 0.12)
    beat = lambda t: 0.025 * (bump(t, 1.7, 2.6, 0.15, 0.3) * math.sin(TAU * 2.4 * (t - 1.7)) + bump(t, 8.0, 8.9, 0.15, 0.3) * math.sin(TAU * 2.2 * (t - 8.0)))
    look = Spline([(0, -0.05), (1.2, 0.05), (2.4, 0.30), (3.6, 0.28), (4.8, 0.0), (6.0, -0.32), (7.3, -0.30), (8.4, -0.05), (9.6, 0.18), (10.8, 0.12)], T, 0.8)
    nod = Spline([(0, 0.0), (1.8, 0.06), (2.1, -0.02), (2.4, 0.05), (3.4, -0.06), (5.0, 0.0), (6.4, -0.1), (7.2, -0.08), (8.3, 0.06), (8.6, 0.0), (9.8, -0.06), (11.0, 0.02)], T, 0.8)
    lean = Spline([(0, 0.0), (1.9, 0.05), (3.3, -0.02), (4.6, 0.0), (6.4, -0.05), (7.4, -0.04), (8.3, 0.05), (9.8, -0.03), (11.0, 0.0)], T, 0.8)
    twist = Spline([(0, 0.0), (2.4, 0.12), (3.8, 0.1), (5.0, 0.0), (6.4, -0.14), (7.6, -0.12), (8.8, 0.0), (10.0, 0.08)], T, 0.8)
    for i, p in enumerate(frames):
        t = i / FPS
        turn(rig, p, 'Spine', X, 0.04)                                  # stand up to the crowd, not leaning back
        turn(rig, p, 'Spine1', X, lean(t)); turn(rig, p, 'Spine1', Z, twist(t) * 0.5); turn(rig, p, 'Spine2', Z, twist(t) * 0.4)
        level(rig, p, 'Spine2', 0.4)
        steady_head(rig, p, yaw=look(t), pitch=nod(t), roll=0.03 * math.sin(TAU * t / T * 2), neck=0.5)
        hi = bump(t, 5.4, 7.6, 0.6, 0.6); raise_shoulder(rig, p, 'Right', 0.12 * hi)
        for sd, S, off in (('Right', SR, 0.0), ('Left', SL, 0.12)):
            M = rig.fk(p); w, f, pa, e = [s(t) for s in S]
            if sd == 'Right': w = w + V(0, 0, beat(t))
            arm(rig, p, sd, body_point(rig, M, sd, w.x, w.y, w.z), body_dir(rig, M, sd, e.x, e.y, e.z),
                body_dir(rig, M, sd, f.x, f.y, f.z), body_dir(rig, M, sd, pa.x, pa.y, pa.z), 0.6)
            curl(rig, p, sd, 0.18 + 0.12 * (1 - min(1, w.z + 0.45)), thumb=0.05)
    return frames


GIVE_AT = (-0.415, -0.205)   # ComfortGive and ComfortTake: where the one comforted stands from the giver (x to his left, y backwards), facing the same way
CHILD_AT = (-0.25, -0.25)   # ComfortChild: where the game places the child from her (found with pair_check.py --search), clear of her skirt
SIT_AT = (-0.465, -0.27)   # SitComfortGive and SitComfortTake: where she sits from him on the bench
HAND_OUT, HAND_FWD, HAND_UP = 0.080, -0.04, -0.084   # fine placement of the resting hand (checked by tools/anims/pair_check.py)
FACE_OUT, FACE_FWD, FACE_UP = 0.06, 0.0, -0.09   # ComfortHand: fine placement of the resting hand
FACE_GAP = 0.58   # ComfortHand: the other person stands this far in front of the giver, facing them


def follow(rig, take_frames, bone, x, y, rz, scale=1.0):
    """How the other person's joint moves (their weight shifts and breaths), as seen from the giver, frame by frame,
    measured from its average. The giver's resting hand adds this so it rides along on their shoulder."""
    R = rot(Z, rz); pts = [R @ rig.fk(p)[P + bone].translation + V(x, y, 0) for p in take_frames]
    m = sum(pts, Vector()) / len(pts)
    return [(q - m) * scale for q in pts]


def comfort_arm(rig, frames, T, gap, drop, lean=0.0, turn_to=0.6, look=(-0.45, 0.25), ride=None, ahead=0.12, half=0.12, nudge=(0.0, 0.0, 0.0), elbow_dir=(-0.15, -1.0, -0.35)):
    """An arm round the shoulders of someone standing (or sitting) `gap` metres to the right, facing the same way.
    The giver's body turns about 30 degrees towards them, the arm goes round their back and the hand rests on their far
    shoulder, with a few slow pats. `drop` is how far below the giver's own shoulder joint their shoulder top is; `lean`
    bends the giver sideways and down towards them (for a child). Positions are taken from the hips, so turning the
    chest does not move the hand."""
    pat = lambda t: sum(bump(t, t0, t0 + 0.7, 0.25, 0.45) for t0 in (1.2, 2.1, 5.6))
    Mfix = rig.fk(frames[0])   # the resting hand is placed in a fixed frame, so the giver's own sway does not slide it about
    for i, p in enumerate(frames):
        t = i / FPS; pt = pat(t)
        turn(rig, p, 'Spine', Z, -0.45 * turn_to); turn(rig, p, 'Spine1', Z, -0.35 * turn_to); turn(rig, p, 'Spine2', Z, -0.2 * turn_to)
        turn(rig, p, 'Spine', Y, -0.02 - lean); turn(rig, p, 'Spine1', X, 0.03 + 0.6 * lean)
        steady_head(rig, p, yaw=look[0] - turn_to + 0.03 * math.sin(TAU * t / T), pitch=look[1] + 0.02 * math.sin(TAU * 2 * t / T + 1), roll=-0.04, neck=0.5)
        M = rig.fk(p)
        far = gap - 0.16 + half                                         # their far shoulder, from the giver's shoulder joint
        wrist = body_point(rig, Mfix, 'Right', far - 0.05 + HAND_OUT + nudge[0], ahead - 0.08 + HAND_FWD + nudge[1], -drop + HAND_UP + nudge[2] + 0.008 * pt, bone='Hips')   # over their far shoulder, from behind
        if ride: wrist = wrist + ride[i]
        elbow = body_dir(rig, M, 'Right', *elbow_dir, bone='Hips')   # elbow down and back, behind them
        rest_hand(rig, p, 'Right', wrist, elbow, curl_by=0.35 - 0.1 * pt)
        relaxed_arm(rig, p, 'Left')


def embrace_arm(rig, frames, T, turn_body=0.5, lean_in=0.06, upper=(0.35, 0.2, 0.90), fore=(0.80, 0.45, 0.25), ride=None,
                look=(-0.35, 0.28), seated=False, reach=None, hand=((-0.25, -0.2, -1.0), (0.5, -0.85, 0.0))):
    """An arm round someone a little in front and to the right: the whole body turns `turn_body` towards them and leans
    in, the upper arm angles down and back (`upper`: towards them, back, down, in the room's directions), the elbow bends about 95 degrees and the forearm
    runs forwards and out across their shoulder blades (`fore`: towards them, forwards, up) to the hand on their far upper arm.
    The arm is set by its directions, so the bend is the same on every body; the game places the other person where
    the hand lands (tools/anims/pair_check.py measures it). `ride` adds their shoulder's breathing to the hand."""
    pat = lambda t: sum(bump(t, t0, t0 + 0.8, 0.3, 0.5) for t0 in (1.2, 2.2, 5.6))
    l1 = rig.rel[P + 'RightForeArm'].translation.length; l2 = rig.rel[P + 'RightHand'].translation.length
    for i, p in enumerate(frames):
        t = i / FPS; pt = pat(t)
        if not seated: turn(rig, p, 'Hips', Z, -turn_body)                       # the whole body turns to them
        else: turn(rig, p, 'Spine', Z, -0.6 * turn_body)
        turn(rig, p, 'Spine', X, 0.07); turn(rig, p, 'Spine1', X, 0.03)          # stand up over the feet, not leaning back
        turn(rig, p, 'Spine', Y, -lean_in); turn(rig, p, 'Spine1', Z, -0.15)    # lean and turn into them
        steady_head(rig, p, yaw=look[0] - turn_body + 0.03 * math.sin(TAU * t / T), pitch=look[1] + 0.02 * math.sin(TAU * 2 * t / T + 1), roll=-0.06, neck=0.5)
    S0 = sum((rig.fk(p)[P + 'RightArm'].translation for p in frames), Vector()) / len(frames)   # the hand is set from his shoulder's average place, so his own breathing does not rub it about
    for i, p in enumerate(frames):
        t = i / FPS; pt = pat(t); M = rig.fk(p); S = S0
        d1 = V(-upper[0], upper[1], -upper[2]).normalized()                     # in the room, not the turned body: towards them, back, down
        d2 = V(-fore[0], -fore[1], fore[2] + 0.012 * pt).normalized()
        E = S + d1 * l1; W = E + d2 * l2
        if reach: W = S + V(*reach); d1 = V(0, 1.0, -0.8).normalized(); d2 = V(0, 0, 0)   # given as the hand's place from the shoulder instead; the elbow drops back and down
        if ride: W = W + ride[i]
        rest_hand(rig, p, 'Right', W, d1 - d2, curl_by=0.35 - 0.1 * pt)         # palm down on the top of her shoulder, fingers forward over it
        if seated:
            M = rig.fk(p)
            arm(rig, p, 'Left', body_point(rig, M, 'Left', -0.02, 0.32, -0.33, bone='Hips'), body_dir(rig, M, 'Left', 0.6, -0.3, -0.6, bone='Hips'),
                body_dir(rig, M, 'Left', -0.2, 0.9, -0.3, bone='Hips'), body_dir(rig, M, 'Left', -0.3, 0.0, -1, bone='Hips'), 0.5)   # the free hand on his knee
            curl(rig, p, 'Left', 0.35)
        else: relaxed_arm(rig, p, 'Left')


def rest_hand(rig, p, side, wrist, elbow, down=0.25, palm_dir=V(0, 0, -1), curl_by=0.35):
    """Lay a hand on top of someone's shoulder: the wrist nearly straight in line with the forearm, the palm facing
    down onto the shoulder (`palm_dir`), the fingers carrying on from the forearm and tipping `down` over its curve."""
    limb_ik(rig, p, side + 'Arm', side + 'ForeArm', side + 'Hand', wrist, elbow)   # first pass, to find where the forearm points
    M = rig.fk(p); fa = M[P + side + 'ForeArm'].to_3x3().col[1].normalized()
    fingers = (fa + V(0, 0, -down)).normalized()
    arm(rig, p, side, wrist, elbow, fingers, palm_dir, 0.5)
    curl(rig, p, side, curl_by, thumb=0.1)


def relaxed_arm(rig, p, side):
    """The free arm hangs at the side, a little bent."""
    M = rig.fk(p)
    arm(rig, p, side, body_point(rig, M, side, 0.13, 0.08, -0.42), body_dir(rig, M, side, 0.3, -1, -0.3),
        body_dir(rig, M, side, 0.0, 0.15, -1), body_dir(rig, M, side, -1, 0.1, 0), 0.5)
    curl(rig, p, side, 0.3)


def stand_still(rig, T, seed):
    frames = calm_idle(rig, T)
    damp(frames, {'Spine': 0.5, 'Spine1': 0.5, 'Spine2': 0.5})
    stand(rig, frames, T, lambda t: -0.4 + 0.3 * math.sin(TAU * t / T), sway=0.025, seed=seed)
    breathe(rig, frames, T, 2, amt=0.012)
    return frames


@clip('ComfortGive', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def comfort_give(rig):
    T = 8.0; frames = stand_still(rig, T, 31)
    embrace_arm(rig, frames, T, ride=follow(rig, comfort_take(rig), 'Spine2', 0.0, 0.0, 0.0))
    return frames


@clip('ComfortChild', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def comfort_child(rig):
    T = 8.0; frames = stand_still(rig, T, 33)
    embrace_arm(rig, frames, T, turn_body=0.25, lean_in=0.05, upper=(0.15, 0.1, 1.0), fore=(0.6, 0.75, -0.35), look=(-0.3, 0.6),
                ride=follow(rig, comfort_take(rig), 'Spine2', 0.0, 0.0, 0.0, 0.6))   # upper arm hanging, forearm forward: the hand palm down on the child's shoulder
    return frames


@clip('ComfortHand', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def comfort_hand(rig):
    """Facing the other person, who stands FACE_GAP in front: the left hand rests on their right shoulder, head bowed a
    little. (They play ComfortTake, whose hand to the eyes is their left one, on the other side.)"""
    T = 8.0; frames = stand_still(rig, T, 37)
    ride = follow(rig, comfort_take(rig), 'RightArm', 0.0, -FACE_GAP, math.pi)
    Mfix = rig.fk(frames[0])
    pat = lambda t: sum(bump(t, t0, t0 + 0.8, 0.3, 0.5) for t0 in (1.5, 5.2))
    for i, p in enumerate(frames):
        t = i / FPS; pt = pat(t)
        turn(rig, p, 'Spine1', X, 0.04)
        steady_head(rig, p, yaw=0.05 + 0.03 * math.sin(TAU * t / T), pitch=0.25, roll=0.05, neck=0.5)
        M = rig.fk(p)
        wrist = body_point(rig, Mfix, 'Left', FACE_OUT, FACE_GAP - 0.2 + FACE_FWD, FACE_UP + 0.008 * pt, bone='Hips') + ride[i]
        arm(rig, p, 'Left', wrist, body_dir(rig, M, 'Left', 0.4, -0.2, -1, bone='Hips'), body_dir(rig, M, 'Left', -0.1, 0.8, -0.6, bone='Hips'),
            body_dir(rig, M, 'Left', 0.0, 0.3, -1, bone='Hips'), 0.5)
        curl(rig, p, 'Left', 0.25 - 0.1 * pt, thumb=0.1)
        relaxed_arm(rig, p, 'Right')
    return frames


def sit_base(rig, T):
    base = seam(load_base(rig, os.path.join(SRC, 'Sitting_Idle.fbx')))
    n = round(T * FPS); frames = resample(base, n, max(1, round(n / (len(base) - 1))))
    damp(frames, {'Spine': 0.4, 'Spine1': 0.4, 'Spine2': 0.4, 'Neck': 0.3, 'Head': 0.3, 'LeftArm': 0.4, 'RightArm': 0.4, 'LeftForeArm': 0.4, 'RightForeArm': 0.4})
    return frames


@clip('SitComfortGive', 'hand-made on the library SitIdle (Sitting_Idle.fbx)')
def sit_comfort_give(rig):
    T = 8.0; frames = sit_base(rig, T); breathe(rig, frames, T, 2, amt=0.014)
    embrace_arm(rig, frames, T, turn_body=0.3, ride=follow(rig, sit_comfort_take(rig), 'Spine2', 0.0, 0.0, 0.0), seated=True, reach=(-0.32, -0.03, -0.07), hand=((-0.35, -0.2, -0.9), (0.8, -0.4, 0.1)))
    for p in frames: turn(rig, p, 'RightUpLeg', Z, 0.14)   # knees together, clear of hers
    return frames


@clip('SitComfortTake', 'hand-made on the library SitIdle (Sitting_Idle.fbx)')
def sit_comfort_take(rig):
    T = 8.0; frames = sit_base(rig, T)
    for p in frames: turn(rig, p, 'LeftUpLeg', Z, -0.14)   # knees together, clear of his
    take_upper(rig, frames, T, lap=True)
    return frames


def take_upper(rig, frames, T, wipe_side='Left', lap=False):
    """Upright and quiet: the head bowed and tipped towards the giver on the left, slow breaths, the hands loose in front;
    once a loop she lifts one hand (`wipe_side`, the one away from the giver's resting hand) to wipe her eyes."""
    wipe = lambda t: bump(t, 2.2, 5.4, 1.3, 1.3)   # slow in and out
    for i, p in enumerate(frames):
        t = i / FPS; w = wipe(t); b = math.sin(TAU * 2 * t / T)
        turn(rig, p, 'Spine', Y, 0.02); turn(rig, p, 'Spine2', X, 0.03 - 0.01 * b)
        steady_head(rig, p, yaw=0.15 + 0.03 * math.sin(TAU * t / T), pitch=0.28 + 0.06 * w + 0.015 * b, roll=0.08, neck=0.5)
        for sd in ('Right', 'Left'):
            M = rig.fk(p); k = w if sd == wipe_side else 0.0
            low = body_point(rig, M, sd, -0.05, 0.36, -0.25, bone='Hips') if lap else body_point(rig, M, sd, -0.03, 0.27, -0.40, bone='Hips')
            face = body_point(rig, M, sd, 0.03, 0.20, -0.06, bone='Head', at='Head') + V(0, 0, -0.02)
            target = low.lerp(face, k); elbow = body_dir(rig, M, sd, 0.5, -0.5, -0.8, bone='Hips')
            limb_ik(rig, p, sd + 'Arm', sd + 'ForeArm', sd + 'Hand', target, elbow)   # find the forearm, so the low hand carries straight on from it
            fa = rig.fk(p)[P + sd + 'ForeArm'].to_3x3().col[1].normalized()
            arm(rig, p, sd, target, elbow,
                fa.lerp(body_dir(rig, M, sd, -0.15, 0.35, 0.9), k),
                body_dir(rig, M, sd, -1.0, 0.25, 0.0).lerp(body_dir(rig, M, sd, -0.5, -1.0, 0.1), k), 0.5)   # palm in, then to the face
            curl(rig, p, sd, 0.3 + 0.1 * k)
    soften(frames, [sd + b for sd in ('Left', 'Right') for b in ('Arm', 'ForeArm', 'Hand')], 8.0)


@clip('ComfortTake', 'hand-made on the library Idle (abba_Idle_withoutskin.fbx)')
def comfort_take(rig):
    T = 8.0; frames = calm_idle(rig, T)
    damp(frames, {'Spine': 0.4, 'Spine1': 0.4, 'Spine2': 0.4})
    stand(rig, frames, T, lambda t: 0.4 + 0.25 * math.sin(TAU * t / T + 2), sway=0.025, seed=41)   # weight a little towards the giver on her left
    breathe(rig, frames, T, 2, amt=0.016)
    take_upper(rig, frames, T)
    return frames


@clip('SitScared', 'hand-made on the library SitIdle (Sitting_Idle.fbx)')
def sit_scared(rig):
    base = seam(load_base(rig, os.path.join(SRC, 'Sitting_Idle.fbx')))
    T = 9.0; n = round(T * FPS); frames = resample(base, n, max(1, round(n / (len(base) - 1))))
    damp(frames, {'Spine': 0.3, 'Spine1': 0.3, 'Spine2': 0.3, 'Neck': 0.3, 'Head': 0.3})
    M0 = rig.fk(frames[0])
    hipj = {sd: M0[P + sd + 'UpLeg'].translation.copy() for sd in ('Left', 'Right')}
    knee = {sd: M0[P + sd + 'Leg'].translation.copy() for sd in ('Left', 'Right')}
    seat = min(h.z for h in hipj.values()) - 0.085    # the seat top, under the thighs
    flinch = lambda t: bump(t, 2.6, 3.5, 0.1, 0.8) + 0.8 * bump(t, 6.9, 7.8, 0.1, 0.8)
    look = Spline([(0, 0.0), (0.8, 0.0), (1.1, 0.35), (2.2, 0.38), (2.6, 0.30), (3.3, -0.1), (4.4, -0.45), (5.1, -0.42), (5.5, -0.1), (6.6, 0.05), (6.9, 0.2), (7.9, 0.1), (8.5, 0.02)], T, 0.7)
    up = Spline([(0, 0.25), (1.1, 0.15), (2.2, 0.3), (2.6, 0.35), (3.3, 0.05), (4.4, 0.12), (5.5, 0.32), (6.9, 0.35), (7.9, 0.12)], T, 0.8)
    for i, p in enumerate(frames):
        t = i / FPS; f = flinch(t); b = math.sin(TAU * 4 * t / T)
        turn(rig, p, 'Spine', X, 0.17 + 0.05 * f)                       # hunched forwards, tight
        turn(rig, p, 'Spine1', X, 0.05 + 0.03 * f)
        turn(rig, p, 'Spine2', X, 0.04 - 0.01 * b + 0.04 * f)
        for sd in ('Left', 'Right'):
            raise_shoulder(rig, p, sd, 0.12 + 0.12 * f)                 # shoulders up
            M = rig.fk(p); turn(rig, p, sd + 'Shoulder', Z, (0.05 if sd == 'Right' else -0.05), M)
        steady_head(rig, p, yaw=look(t), pitch=-0.75 * up(t) + 0.35 * f, roll=0.05 * math.sin(TAU * t / T), neck=0.55)   # looking up and round; ducks in a flinch
        M = rig.fk(p)
        for sd in ('Left', 'Right'):
            sx = -1 if sd == 'Right' else 1
            edge = hipj[sd].lerp(knee[sd], 0.5); wrist = V(hipj[sd].x + sx * 0.12, edge.y, seat + 0.045 + 0.01 * f)
            arm(rig, p, sd, wrist, body_dir(rig, M, sd, 1.0, -0.6, -0.1, bone='Spine'), V(sx * 0.2, -1.0, -0.45), V(0, -0.1, -1.0), 0.6)
            curl(rig, p, sd, 0.55 + 0.1 * f, thumb=0.2)                 # gripping the edge
    return frames


# ---------------------------------------------------------------- writing and checking
def write_fbx(rig, name, frames, path):
    ob = rig.obj; ob.animation_data_create(); act = bpy.data.actions.new(name); ob.animation_data.action = act
    prev = {}
    for i, p in enumerate(frames):
        for n in rig.names:
            pb = ob.pose.bones[n]; pb.rotation_mode = 'QUATERNION'; q = p.rot[n].normalized()
            if n in prev: q.make_compatible(prev[n])
            prev[n] = q; pb.rotation_quaternion = q; pb.keyframe_insert('rotation_quaternion', frame=i, group=n)
            if n == P + 'Hips': pb.location = p.loc; pb.keyframe_insert('location', frame=i, group=n)
    sc = bpy.context.scene; sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = len(frames) - 1   # keys from time 0, like a Mixamo download
    for o in bpy.data.objects: o.select_set(o == ob)
    bpy.context.view_layer.objects.active = ob
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.fbx(filepath=path, use_selection=True, object_types={'ARMATURE'}, add_leaf_bones=False, bake_anim=True,
                             bake_anim_use_all_actions=False, bake_anim_use_nla_strips=False, bake_anim_force_startend_keying=True,
                             bake_anim_simplify_factor=0.0, bake_anim_step=1.0, primary_bone_axis='Y', secondary_bone_axis='X',
                             armature_nodetype='NULL', apply_unit_scale=True, global_scale=1.0)
    ob.animation_data.action = None
    for pb in ob.pose.bones: pb.matrix_basis.identity()
    bpy.data.actions.remove(act)


def check(rig, name, frames):
    """Numbers to read before looking at renders: the loop seam, and how close each hand comes to the head."""
    a, b = frames[0], frames[-1]
    seam_deg = max(math.degrees(a.rot[k].rotation_difference(b.rot[k]).angle) for k in a.rot)
    worst = 9.0
    for p in frames[::3]:
        M = rig.fk(p); hc = M[P + 'Head'].translation + M[P + 'Head'].to_3x3() @ (rig.rest3[P + 'Head'].inverted() @ V(0, -0.02, 0.09))
        for sd in ('Left', 'Right'):
            for bn in ('Hand', 'HandMiddle1', 'HandIndex3', 'ForeArm'):
                q = M[P + sd + bn].translation; worst = min(worst, (q - hc).length)
    print('CHECK %-15s frames %4d  %.2f s  seam %.3f deg  nearest hand or forearm to the head middle %.3f m' % (name, len(frames), (len(frames) - 1) / FPS, seam_deg, worst))
    # natural movement: the fastest turn of any bone from one frame to the next, and elbows and knees that bend the right way
    fast, fb = 0.0, ''
    for a, b in zip(frames, frames[1:]):
        for k in a.rot:
            if 'Hand' in k and k[-1] in '1234' and 'Hand' != k[-4:]: continue
            d = math.degrees(a.rot[k].rotation_difference(b.rot[k]).angle)
            if d > fast: fast, fb = d, k.replace(P, '')
    wrong = 0
    for p in frames[::3]:
        M = rig.fk(p)
        for up, lo in (('LeftArm', 'LeftForeArm'), ('RightArm', 'RightForeArm'), ('LeftUpLeg', 'LeftLeg'), ('RightUpLeg', 'RightLeg')):
            d1 = M[P + up].to_3x3().col[1]; d2 = M[P + lo].to_3x3().col[1]; n = d1.cross(d2)
            if n.length > 0.05 and n.dot(M[P + up].to_3x3() @ rig.hinge[up]) < 0: wrong += 1
    wb = 0.0
    for p in frames[::3]:
        M = rig.fk(p)
        for sd in (('Right',) if 'Comfort' in name and 'Take' not in name else ('Left', 'Right')):
            wb = max(wb, math.degrees(M[P + sd + 'ForeArm'].to_3x3().col[1].angle(M[P + sd + 'Hand'].to_3x3().col[1])))
    print('      fastest bone turn %.1f deg a frame (%s); elbows or knees bent backwards: %d; most bent wrist %.0f deg' % (fast, fb, wrong, wb))
    if name.startswith('CarryHead'):   # the hand must stay outside the load: radius LOAD_R, from the crown up 0.25 m
        near = 9.0
        for p in frames[::2]:
            M = rig.fk(p); H = M[P + 'Head']; D = H.to_3x3() @ rig.rest3[P + 'Head'].inverted(); Di = D.inverted()
            for sd in ('Left', 'Right'):
                for bn in ('Hand', 'HandIndex1', 'HandMiddle1', 'HandRing1', 'HandPinky1'):
                    q = Di @ (M[P + sd + bn].translation - H.translation)
                    if CROWN < q.z < CROWN + 0.25: near = min(near, math.hypot(q.x, q.y) - LOAD_R)
        print('      hand joints beside the load: nearest %.3f m outside its side' % near)
    if 'Walk' in name:   # how much the body rises and falls once the lower foot is pinned to the ground, and how high the swinging foot lifts
        lows = []
        for p in frames:
            q = p.copy(); q.loc = Vector(); M = rig.fk(q); lo = []
            for sd in ('Left', 'Right'):
                T = M[P + sd + 'ToeBase']; tip = T.translation + T.to_3x3().col[1] * rig.length[P + sd + 'ToeBase']
                lo.append(min(M[P + sd + 'Foot'].translation.z - 0.06, T.translation.z, tip.z))
            lows.append(lo)
        g = [min(a) for a in lows]; lift = [abs(a[0] - a[1]) for a in lows]
        print('      bob %.3f m  highest swing-foot lift %.3f m' % (max(g) - min(g), max(lift)))


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    args = [a for a in args if not a.endswith('.py')]
    if '--list' in args:
        for k, (f, s) in CLIPS.items(): print(k, ':', s)
        return
    names = [a for a in args if not a.startswith('-')] or list(CLIPS)
    bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, 'shared', 'rig', 'char.blend'))
    ob = bpy.data.objects['Human.rig']
    for pb in ob.pose.bones: pb.matrix_basis.identity()
    ob.animation_data_create(); ob.animation_data.action = None
    bpy.context.scene.render.fps = FPS
    rig = Rig(ob)
    for name in names:
        fn, _ = CLIPS[name]; _TWIST.clear(); frames = fn(rig)
        if 'Walk' not in name: soften(frames, [sd + b for sd in ('Left', 'Right') for b in ('Arm', 'ForeArm', 'Hand')])
        frames[-1] = frames[0].copy()   # an exact loop
        check(rig, name, frames)
        write_fbx(rig, name, frames, os.path.join(OUT, name + '.fbx'))
        print('WROTE', os.path.join(OUT, name + '.fbx'))


if __name__ == '__main__':
    main()
