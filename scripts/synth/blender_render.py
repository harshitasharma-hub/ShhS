"""Render synthetic coffee leaf photos in Blender, with no window.

Each job puts one real BRACOL leaf texture on a bent 3D leaf, adds light, weather,
a background and a phone-like camera, and writes one PNG. The label comes from the
BRACOL leaf, so the caller never has to label anything.

Run (jobs.json is a list of job dicts, see JOB_DEFAULTS):
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
      --python scripts/synth/blender_render.py -- jobs.json
"""
import json
import math
import os
import random
import sys
import time

import bpy
import numpy as np
from mathutils import Matrix, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEX_DIR = os.path.join(ROOT, "data", "synthetic", "textures")
HDRI_DIR = "/Applications/Blender.app/Contents/Resources/5.2/datafiles/studiolights/world"

JOB_DEFAULTS = {
    "leaf": 960,            # BRACOL id of the leaf to render
    "preset": "overcast",   # see PRESETS
    "seed": 0,
    "out": "render.png",
    "engine": "EEVEE",      # EEVEE is fast, CYCLES is the slow, accurate one
    "res": [1024, 512],
    "samples": 20,
    "bg_leaves": [],        # BRACOL ids of healthy leaves to use as background clutter
}

# One entry per look. Tuples are (low, high) ranges drawn with the job seed.
PRESETS = {
    "studio":   dict(light="studio", ground="white", clutter=(0, 0), drops=(0, 0), dapple=0.0,
                     exposure=(0.0, 0.0), cover=(0.70, 0.88), cam_tilt=(0, 6), wet=0.0, haze=0.0),
    "overcast": dict(light="overcast", ground="soil", clutter=(10, 24), drops=(0, 0), dapple=0.0,
                     exposure=(0.2, 0.9), cover=(0.48, 0.80), cam_tilt=(0, 28), wet=0.0, haze=0.0),
    "sun":      dict(light="sun", ground="soil", clutter=(10, 24), drops=(0, 0), dapple=0.7,
                     exposure=(-0.5, 0.1), cover=(0.48, 0.80), cam_tilt=(0, 28), wet=0.0, haze=0.0),
    "golden":   dict(light="golden", ground="soil", clutter=(10, 24), drops=(0, 0), dapple=0.4,
                     exposure=(-0.4, 0.2), cover=(0.48, 0.80), cam_tilt=(0, 28), wet=0.0, haze=0.0),
    "shade":    dict(light="shade", ground="soil", clutter=(10, 24), drops=(0, 0), dapple=0.0,
                     exposure=(-0.4, 0.3), cover=(0.48, 0.80), cam_tilt=(0, 28), wet=0.0, haze=0.0),
    "backlit":  dict(light="backlit", ground="soil", clutter=(8, 18), drops=(0, 0), dapple=0.3,
                     exposure=(-0.4, 0.2), cover=(0.48, 0.80), cam_tilt=(0, 22), wet=0.0, haze=0.0),
    "rain":     dict(light="overcast", ground="soil", clutter=(10, 24), drops=(40, 160), dapple=0.0,
                     exposure=(-0.1, 0.5), cover=(0.52, 0.80), cam_tilt=(0, 28), wet=1.0, haze=0.0),
    "sun_wet":  dict(light="sun", ground="soil", clutter=(10, 24), drops=(40, 160), dapple=0.5,
                     exposure=(-0.6, 0.0), cover=(0.52, 0.80), cam_tilt=(0, 28), wet=1.0, haze=0.0),
}


def U(rng, lo, hi):
    return lo + (hi - lo) * rng.random()


def rng_range(rng, pair):
    return U(rng, pair[0], pair[1])


def set_in(node, names, value):
    """Set the first input that exists. Principled BSDF socket names changed between versions."""
    if isinstance(names, str):
        names = [names]
    for n in names:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return True
    return False


# ---------------------------------------------------------------- leaf geometry
class LeafShape:
    """A leaf bent in 3D. x runs along the midrib, y across the blade, z is height."""

    def __init__(self, rng, length, width):
        self.L, self.W = length, width
        self.fold = U(rng, -0.05, 0.30)          # V fold along the midrib, as a share of the width
        self.arch = U(rng, -0.04, 0.14)          # bend along the length; positive droops the tip
        self.twist = U(rng, -0.22, 0.22)
        self.wave_a = U(rng, 0.0, 0.07)
        self.wave_n = U(rng, 2.5, 6.5)
        self.wave_p = U(rng, 0, 2 * math.pi)
        self.swirl = [(U(rng, 0.8, 2.6), U(rng, 0, 2 * math.pi), U(rng, 0, 2 * math.pi),
                       U(rng, 0.006, 0.026)) for _ in range(3)]

    def z(self, xn, yn):
        """Height for normalised coordinates xn, yn in [-1, 1]."""
        W, L = self.W, self.L
        z = self.fold * W * np.abs(yn) ** 1.3
        z = z - self.arch * L * (xn ** 2) * 0.5
        z = z + self.twist * W * yn * xn
        z = z + self.wave_a * W * np.sin(math.pi * self.wave_n * xn + self.wave_p) * np.abs(yn) ** 1.6
        for f, ph1, ph2, amp in self.swirl:
            z = z + amp * W * np.sin(f * math.pi * xn + ph1) * np.sin(f * 0.8 * math.pi * yn + ph2)
        return z


def load_image(path, noncolor=False):
    img = bpy.data.images.load(path, check_existing=True)
    if noncolor:
        img.colorspace_settings.name = "Non-Color"
    return img


def make_leaf_material(name, tex, mask, rough, wet, rng, tint=(1, 1, 1)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    uv = nt.nodes.new("ShaderNodeTexCoord")
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = tex
    t.extension = "EXTEND"
    t.interpolation = "Smart"
    m = nt.nodes.new("ShaderNodeTexImage")
    m.image = mask
    m.extension = "EXTEND"
    nt.links.new(uv.outputs["UV"], t.inputs["Vector"])
    nt.links.new(uv.outputs["UV"], m.inputs["Vector"])
    # wet leaves look darker and a little richer in colour
    mulc = nt.nodes.new("ShaderNodeMix")
    mulc.data_type = "RGBA"
    mulc.blend_type = "MULTIPLY"
    mulc.inputs[0].default_value = 1.0
    dark = 1.0 - 0.22 * wet
    mulc.inputs[7].default_value = (tint[0] * dark, tint[1] * dark, tint[2] * dark, 1)
    nt.links.new(t.outputs["Color"], mulc.inputs[6])
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(mulc.outputs[2], bsdf.inputs["Base Color"])
    set_in(bsdf, "Roughness", max(0.08, rough - 0.28 * wet))
    set_in(bsdf, ["Specular IOR Level", "Specular"], 0.32)
    set_in(bsdf, ["Coat Weight", "Clearcoat"], 0.55 * wet)
    set_in(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.05)
    # veins and lesions get a little relief from the photo's own brightness
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    bump.inputs["Distance"].default_value = 0.0015
    nt.links.new(t.outputs["Color"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    # leaves let light through: mix in a coloured translucent layer
    trans = nt.nodes.new("ShaderNodeBsdfTranslucent")
    nt.links.new(mulc.outputs[2], trans.inputs["Color"])
    mix_t = nt.nodes.new("ShaderNodeMixShader")
    mix_t.inputs[0].default_value = 0.30
    nt.links.new(bsdf.outputs["BSDF"], mix_t.inputs[1])
    nt.links.new(trans.outputs["BSDF"], mix_t.inputs[2])
    # the mask cuts the outline out of the flat sheet
    clear = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix_a = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(m.outputs["Color"], mix_a.inputs[0])
    nt.links.new(clear.outputs["BSDF"], mix_a.inputs[1])
    nt.links.new(mix_t.outputs["Shader"], mix_a.inputs[2])
    nt.links.new(mix_a.outputs["Shader"], out.inputs["Surface"])
    try:
        mat.surface_render_method = "DITHERED"
        mat.use_transparent_shadow = True
    except Exception:
        pass
    return mat


def make_leaf(leaf_id, rng, length, name, wet=0.0, rough=None, tint=(1, 1, 1), grid=(140, 56), want_mask=True):
    tex = load_image(os.path.join(TEX_DIR, f"{leaf_id}.jpg"))
    mask = load_image(os.path.join(TEX_DIR, f"{leaf_id}_mask.png"), noncolor=True)
    w_px, h_px = tex.size
    width = length * h_px / w_px
    shape = LeafShape(rng, length, width)
    nx, ny = grid
    xs = np.linspace(-1, 1, nx + 1)
    ys = np.linspace(-1, 1, ny + 1)
    XN, YN = np.meshgrid(xs, ys)
    px = XN * length / 2
    py = YN * width / 2
    pz = shape.z(XN, YN)
    verts = np.stack([px, py, pz], -1).reshape(-1, 3)
    idx = np.arange((nx + 1) * (ny + 1)).reshape(ny + 1, nx + 1)
    faces = np.stack([idx[:-1, :-1], idx[:-1, 1:], idx[1:, 1:], idx[1:, :-1]], -1).reshape(-1, 4)
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts.tolist(), [], faces.tolist())
    mesh.update()
    uv_layer = mesh.uv_layers.new(name="UV")
    loop_v = np.empty(len(mesh.loops), dtype=np.int32)
    mesh.loops.foreach_get("vertex_index", loop_v)
    uvs = np.stack([(XN + 1) / 2, (YN + 1) / 2], -1).reshape(-1, 2)[loop_v]
    uv_layer.data.foreach_set("uv", uvs.astype(np.float32).ravel())
    for p in mesh.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    rough = rough if rough is not None else U(rng, 0.28, 0.62)
    obj.data.materials.append(make_leaf_material(name + "_mat", tex, mask, rough, wet, rng, tint))
    mk = None
    if want_mask:  # small mask for placing water drops only on the leaf
        buf = np.empty(w_px * h_px * 4, dtype=np.float32)
        mask.pixels.foreach_get(buf)
        mk = buf.reshape(h_px, w_px, 4)[::6, ::6, 0] > 0.5
    return obj, shape, mk


def add_drops(rng, leaf_obj, shape, mk, n, wet):
    """Water beads sitting on the leaf, as flattened glass spheres."""
    if n <= 0:
        return
    import bmesh
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=14, v_segments=8, radius=1.0)
    sph = bpy.data.meshes.new("drop")
    bm.to_mesh(sph)
    bm.free()
    for p in sph.polygons:
        p.use_smooth = True
    mat = bpy.data.materials.new("water")
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    set_in(b, "Base Color", (1, 1, 1, 1))
    set_in(b, "Roughness", 0.0)
    set_in(b, ["Transmission Weight", "Transmission"], 1.0)
    set_in(b, "IOR", 1.33)
    try:
        mat.use_raytrace_refraction = True
        mat.use_screen_refraction = True
    except Exception:
        pass
    sph.materials.append(mat)
    ys_i, xs_i = np.nonzero(mk)
    if len(ys_i) == 0:
        return
    h_m, w_m = mk.shape
    # a few big beads and many small ones
    sizes = [U(rng, 0.0014, 0.0034) for _ in range(max(1, n // 7))] + \
            [U(rng, 0.0004, 0.0012) for _ in range(n - max(1, n // 7))]
    eps = 0.002
    for i, r in enumerate(sizes):
        k = rng.randrange(len(ys_i))
        xn = (xs_i[k] + 0.5) / w_m * 2 - 1
        yn = (ys_i[k] + 0.5) / h_m * 2 - 1
        px = xn * shape.L / 2
        py = yn * shape.W / 2
        z = float(shape.z(np.array(xn), np.array(yn)))
        dzdx = (float(shape.z(np.array(xn + eps), np.array(yn))) - float(shape.z(np.array(xn - eps), np.array(yn)))) \
            / (2 * eps * shape.L / 2)
        dzdy = (float(shape.z(np.array(xn), np.array(yn + eps))) - float(shape.z(np.array(xn), np.array(yn - eps)))) \
            / (2 * eps * shape.W / 2)
        nrm = Vector((-dzdx, -dzdy, 1.0)).normalized()
        d = bpy.data.objects.new(f"drop{i}", sph)
        flat = U(rng, 0.5, 0.9)
        d.scale = (r, r * U(rng, 0.85, 1.15), r * flat)
        d.location = Vector((px, py, z)) + nrm * (r * flat * 0.55)
        d.rotation_euler = nrm.to_track_quat("Z", "Y").to_euler()
        d.parent = leaf_obj
        bpy.context.scene.collection.objects.link(d)


# ---------------------------------------------------------------- world and light
def blackbody(kelvin):
    """Rough colour of a light of this temperature, as linear RGB near 1."""
    t = kelvin / 100.0
    r = 1.0 if t <= 66 else min(1.0, 1.2929 * (t - 60) ** -0.1332)
    g = (0.3900 * math.log(t) - 0.6318) if t <= 66 else 1.1299 * (t - 60) ** -0.0755
    b = 1.0 if t >= 66 else (0.0 if t <= 19 else 0.5432 * math.log(t - 10) - 1.1962)
    return (max(0.0, min(1.0, r)), max(0.0, min(1.0, g)), max(0.0, min(1.0, b)))


def build_world(sc, kind, rng):
    """Sky and sun for the scene. Returns the sun direction as a Vector, or None."""
    w = bpy.data.worlds.new("world")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    info = {"light": kind}
    sun_dir = None
    if kind == "studio":
        bg.inputs["Color"].default_value = (0.9, 0.9, 0.9, 1)
        bg.inputs["Strength"].default_value = 0.8
        info["sky"] = "flat"
        return None, info
    if kind in ("overcast", "shade"):
        if rng.random() < 0.55:
            # a real panorama lights the scene and tints it green or grey
            name = rng.choice(["forest", "courtyard", "city", "sunrise"])
            env = nt.nodes.new("ShaderNodeTexEnvironment")
            env.image = load_image(os.path.join(HDRI_DIR, name + ".exr"))
            mp = nt.nodes.new("ShaderNodeMapping")
            mp.inputs["Rotation"].default_value = (0, 0, U(rng, 0, 2 * math.pi))
            tc = nt.nodes.new("ShaderNodeTexCoord")
            nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
            nt.links.new(mp.outputs["Vector"], env.inputs["Vector"])
            nt.links.new(env.outputs["Color"], bg.inputs["Color"])
            bg.inputs["Strength"].default_value = U(rng, 0.6, 1.1) * (0.45 if kind == "shade" else 1.0)
            info["sky"] = "hdri:" + name
        else:
            c = U(rng, 0.75, 1.0)
            bg.inputs["Color"].default_value = (c * 0.9, c * 0.95, c, 1)
            bg.inputs["Strength"].default_value = U(rng, 1.0, 1.8) * (0.45 if kind == "shade" else 1.0)
            info["sky"] = "flat_cloud"
        return None, info
    # sun cases
    if kind == "sun":
        el = U(rng, 38, 82)
        kelvin = U(rng, 5200, 6200)
        strength = U(rng, 3.0, 5.0)
    elif kind == "golden":
        el = U(rng, 4, 16)
        kelvin = U(rng, 2900, 3800)
        strength = U(rng, 2.5, 4.0)
    else:  # backlit: sun is behind the leaf, seen from the camera
        el = U(rng, 18, 50)
        kelvin = U(rng, 4800, 6000)
        strength = U(rng, 3.0, 5.0)
    az = U(rng, 0, 360)
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_disc = False
    sky.sun_elevation = math.radians(el)
    sky.sun_rotation = math.radians(az)
    sky.air_density = U(rng, 0.8, 1.6)
    sky.aerosol_density = U(rng, 0.5, 2.5)
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = U(rng, 0.30, 0.65)
    # Blender's sky puts the sun at a rotation measured from +Y; use the same angle for the lamp
    saz = math.radians(az)
    sun_dir = Vector((math.cos(math.radians(el)) * math.sin(saz) * -1.0,
                      math.cos(math.radians(el)) * math.cos(saz),
                      math.sin(math.radians(el)))).normalized()
    ld = bpy.data.lights.new("sun", "SUN")
    ld.energy = strength
    ld.angle = math.radians(U(rng, 0.5, 1.6))
    ld.color = blackbody(kelvin)
    lo = bpy.data.objects.new("sun", ld)
    lo.rotation_euler = sun_dir.to_track_quat("Z", "Y").to_euler()
    sc.collection.objects.link(lo)
    info.update(sun_el=round(el, 1), sun_az=round(az, 1), kelvin=int(kelvin), sun_energy=round(strength, 2))
    return sun_dir, info


def soil_material(rng, wet):
    mat = bpy.data.materials.new("ground")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n1 = nt.nodes.new("ShaderNodeTexNoise")
    n1.inputs["Scale"].default_value = U(rng, 40, 120)
    n1.inputs["Detail"].default_value = 12
    n1.inputs["Roughness"].default_value = 0.7
    nt.links.new(tc.outputs["Object"], n1.inputs["Vector"])
    n2 = nt.nodes.new("ShaderNodeTexNoise")
    n2.inputs["Scale"].default_value = U(rng, 2.0, 6.0)
    n2.inputs["Detail"].default_value = 4
    nt.links.new(tc.outputs["Object"], n2.inputs["Vector"])
    mulf = nt.nodes.new("ShaderNodeMath")
    mulf.operation = "MULTIPLY"
    nt.links.new(n1.outputs["Fac"], mulf.inputs[0])
    nt.links.new(n2.outputs["Fac"], mulf.inputs[1])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    d = 1.0 - 0.35 * wet
    ramp.color_ramp.elements[0].position = 0.10
    ramp.color_ramp.elements[0].color = (0.020 * d, 0.014 * d, 0.010 * d, 1)
    ramp.color_ramp.elements[1].position = 0.45
    ramp.color_ramp.elements[1].color = (U(rng, 0.10, 0.20) * d, U(rng, 0.07, 0.13) * d, 0.045 * d, 1)
    nt.links.new(mulf.outputs["Value"], ramp.inputs["Fac"])
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    set_in(b, "Roughness", 0.9 - 0.6 * wet)
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    return mat


def white_material():
    mat = bpy.data.materials.new("white")
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    set_in(b, "Base Color", (0.92, 0.92, 0.90, 1))
    set_in(b, "Roughness", 0.9)
    return mat


def dapple_caster(rng, center, sun_dir, strength):
    """A flat sheet with holes, 1.4 to 2.4 m above the leaf, that throws leaf-shadow patches.
    It lies flat and high so a camera that looks down never sees it."""
    bpy.ops.mesh.primitive_plane_add(size=40.0)
    pl = bpy.context.active_object
    pl.name = "dapple"
    pl.location = center + Vector((0, 0, U(rng, 1.4, 2.4)))
    mat = bpy.data.materials.new("dapple_mat")
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = U(rng, 1.2, 3.0)
    n.inputs["Detail"].default_value = 5
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    cut = 0.5 + 0.25 * (1.0 - strength) - 0.02
    ramp.color_ramp.elements[0].position = cut
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = cut + 0.04
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    clear = nt.nodes.new("ShaderNodeBsdfTransparent")
    diff = nt.nodes.new("ShaderNodeBsdfDiffuse")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(ramp.outputs["Color"], mix.inputs[0])
    nt.links.new(clear.outputs["BSDF"], mix.inputs[1])
    nt.links.new(diff.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    pl.data.materials.append(mat)
    try:
        mat.surface_render_method = "DITHERED"
        mat.use_transparent_shadow = True
    except Exception:
        pass
    pl.visible_camera = False
    return pl


# ---------------------------------------------------------------- camera
def camera_matrix(pos, target, roll):
    f = (target - pos).normalized()
    up0 = Vector((-math.sin(roll), math.cos(roll), 0.0))
    if abs(f.dot(Vector((0, 0, 1)))) > 0.999 and False:
        pass
    r = f.cross(up0).normalized()
    u = r.cross(f).normalized()
    return Matrix(((r.x, u.x, -f.x, pos.x), (r.y, u.y, -f.y, pos.y), (r.z, u.z, -f.z, pos.z), (0, 0, 0, 1)))


def new_camera(sc, lens, fstop, focus):
    cam = bpy.data.cameras.new("cam")
    cam.sensor_width = 36.0
    cam.sensor_fit = "HORIZONTAL"
    cam.lens = lens
    cam.clip_start = 0.01
    cam.clip_end = 20.0
    cam.dof.use_dof = True
    cam.dof.focus_distance = focus
    cam.dof.aperture_fstop = fstop
    co = bpy.data.objects.new("cam", cam)
    sc.collection.objects.link(co)
    sc.camera = co
    return co


def place_camera(sc, rng, target, extent, cover, tilt_deg, phone, defocus=1.0):
    """Whole-leaf view: the camera stands so `extent` metres fill `cover` of the frame width."""
    hfov_half = math.atan(18.0 / phone["lens"])
    dist = extent / (cover * 2 * math.tan(hfov_half))
    co = new_camera(sc, phone["lens"], phone["fstop"], dist * defocus)
    theta = math.radians(tilt_deg)
    phi = U(rng, 0, 2 * math.pi)
    pos = target + Vector((math.sin(theta) * math.cos(phi), math.sin(theta) * math.sin(phi), math.cos(theta))) * dist
    co.matrix_world = camera_matrix(pos, target, math.radians(rng.gauss(0, 6)))
    return dist


def place_camera_closeup(sc, rng, target, normal, frame_w, phone, tilt_deg, defocus=1.0):
    """Close-up: the camera looks at one spot on the leaf, from along its normal, tilted a little."""
    dist = frame_w * phone["lens"] / 36.0
    co = new_camera(sc, phone["lens"], phone["fstop"], dist * defocus)
    nz = normal.normalized()
    ax = nz.cross(Vector((1, 0, 0)) if abs(nz.x) < 0.9 else Vector((0, 1, 0))).normalized()
    ay = nz.cross(ax)
    theta, phi = math.radians(tilt_deg), U(rng, 0, 2 * math.pi)
    dirv = nz * math.cos(theta) + (ax * math.cos(phi) + ay * math.sin(phi)) * math.sin(theta)
    pos = target + dirv * dist
    co.matrix_world = camera_matrix(pos, target, U(rng, 0, 2 * math.pi))
    return dist


def branch(rng, depth, wet):
    """A thin brown stem crossing behind the leaf, so the background leaves look attached."""
    length = U(rng, 0.4, 0.9)
    bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=U(rng, 0.003, 0.008), depth=length,
                                        location=(U(rng, -0.25, 0.25), U(rng, -0.25, 0.25), -depth),
                                        rotation=(math.radians(U(rng, 60, 120)), math.radians(U(rng, -25, 25)),
                                                  rng.random() * math.pi))
    ob = bpy.context.active_object
    mat = bpy.data.materials.new("bark")
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    d = 1.0 - 0.4 * wet
    g = U(rng, 0.045, 0.085)
    set_in(b, "Base Color", (g * U(rng, 1.0, 1.35) * d, g * d, g * U(rng, 0.45, 0.7) * d, 1))
    set_in(b, "Roughness", 0.9)
    set_in(b, ["Specular IOR Level", "Specular"], 0.15)
    ob.data.materials.append(mat)


def measure_luma(sc, tmp_path, meter="centre"):
    """Render a tiny draft and return the mean display brightness of the middle of the frame."""
    old = (sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage,
           sc.eevee.taa_render_samples, sc.render.filepath)
    sc.render.resolution_x, sc.render.resolution_y = 256, 128
    sc.eevee.taa_render_samples = 4
    sc.render.filepath = tmp_path
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(tmp_path, check_existing=False)
    img.colorspace_settings.name = "Non-Color"
    w, h = img.size
    buf = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(buf)
    full = buf.reshape(h, w, 4)[..., :3]
    lum = 0.2126 * full[..., 0] + 0.7152 * full[..., 1] + 0.0722 * full[..., 2]
    if meter == "paper":  # expose so the white paper reads as light grey, like the BRACOL photos
        luma = float(np.percentile(lum, 90))
    else:
        luma = float(lum[h // 4: 3 * h // 4, w // 4: 3 * w // 4].mean())
    bpy.data.images.remove(img)
    os.remove(tmp_path)
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = old[:3]
    sc.eevee.taa_render_samples = old[3]
    sc.render.filepath = old[4]
    return luma

# ---------------------------------------------------------------- one job
def surface_point(leaf, shape, u, v):
    """World position and normal of the leaf surface at texture position (u, v)."""
    xn, yn, e = u * 2 - 1, v * 2 - 1, 0.002

    def z(a, b):
        return float(shape.z(np.array(a), np.array(b)))
    local = Vector((xn * shape.L / 2, yn * shape.W / 2, z(xn, yn)))
    dzdx = (z(xn + e, yn) - z(xn - e, yn)) / (2 * e * shape.L / 2)
    dzdy = (z(xn, yn + e) - z(xn, yn - e)) / (2 * e * shape.W / 2)
    rot = leaf.rotation_euler.to_matrix()
    return rot @ local, (rot @ Vector((-dzdx, -dzdy, 1.0))).normalized()


BAD_KINDS = ("no_leaf", "tiny", "defocus", "glare", "dark")


def render_job(job):
    t0 = time.time()
    job = {**JOB_DEFAULTS, **job}
    P = dict(PRESETS[job["preset"]])
    rng = random.Random(job["seed"])
    mode = job.get("mode", "whole")            # whole leaf, or a close-up aimed at a lesion
    bad = job.get("bad")                       # a way to make an unusable photo, see BAD_KINDS
    if bad == "glare":
        P.update(light="sun", wet=1.0, drops=(40, 120), dapple=0.0)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = job["res"]
    aspect = job["res"][0] / job["res"][1]
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.display_settings.display_device = "sRGB"
    sc.view_settings.view_transform = "AgX"
    exposure = rng_range(rng, P["exposure"])
    sc.view_settings.exposure = exposure
    wet = P["wet"]
    sc.render.engine = "BLENDER_EEVEE"
    sc.eevee.taa_render_samples = job["samples"]
    sc.eevee.use_raytracing = True
    sc.eevee.use_shadows = True

    sun_dir, winfo = build_world(sc, P["light"], rng)
    leaf_len = U(rng, 0.11, 0.17)
    phone = {"lens": U(rng, 24, 34), "fstop": U(rng, 2.0, 5.6)}
    defocus = U(rng, 3.0, 5.0) if bad == "defocus" else 1.0
    if bad == "defocus":
        phone["fstop"] = U(rng, 0.8, 1.4)
    leaf = shape = None
    dist = 0.0
    frame_cm = None
    aim = job.get("aim_uv")
    cover = rng_range(rng, P["cover"])
    tilt_cam = rng_range(rng, P["cam_tilt"])

    if mode != "none":
        leaf, shape, mk = make_leaf(job["leaf"], rng, leaf_len, "leaf", wet=wet)
        studio = P["light"] == "studio"
        spread = 6 if mode == "closeup" else (3 if studio else 9)
        yaw_sd = 8 if studio else 24
        leaf.rotation_euler = (math.radians(rng.gauss(0, spread)), math.radians(rng.gauss(0, spread)),
                               math.radians(max(-70, min(70, rng.gauss(0, yaw_sd)))))
        yaw = leaf.rotation_euler.z
        n_drops = int(rng_range(rng, P["drops"]) * (2.5 if mode == "closeup" else 1.0))
        add_drops(rng, leaf, shape, mk, n_drops, wet)
        if mode == "closeup":
            frame_cm = math.exp(U(rng, math.log(2.8), math.log(8.0)))  # more tight frames, like the field photos
            # a phone cannot focus nearer than about 7 cm, so a tight frame needs a longer lens
            phone["lens"] = min(85.0, max(U(rng, 30, 70), 0.07 * 36.0 / (frame_cm / 100.0)))
            # keep the aim well inside the leaf so the leaf fills the frame, but keep the lesion in view
            au = min(0.88, max(0.12, aim[0]))
            av = min(0.72, max(0.28, aim[1]))
            tgt, nrm = surface_point(leaf, shape, au, av)
            dist = place_camera_closeup(sc, rng, tgt, nrm, frame_cm / 100.0, phone, U(rng, 0, 28), defocus)
        else:
            if bad == "tiny":
                cover = U(rng, 0.05, 0.12)
            ex = (shape.L / 2) * abs(math.cos(yaw)) + (shape.W / 2) * abs(math.sin(yaw))
            ey = (shape.L / 2) * abs(math.sin(yaw)) + (shape.W / 2) * abs(math.cos(yaw))
            fit = max(2 * ex, 2 * ey * aspect)
            target = Vector((U(rng, -0.04, 0.04) * leaf_len, U(rng, -0.05, 0.05) * leaf_len, 0))
            dist = place_camera(sc, rng, target, fit, cover, tilt_cam, phone, defocus)
    else:  # no leaf in the picture: only the background
        dist = place_camera(sc, rng, Vector((0, 0, 0)), 0.2, 0.6, U(rng, 0, 30), phone)

    # --- ground and clutter
    if P["ground"] == "white":
        bpy.ops.mesh.primitive_plane_add(size=4.0, location=(0, 0, -0.004))
        bpy.context.active_object.data.materials.append(white_material())
        if sun_dir is None:
            ld = bpy.data.lights.new("key", "AREA")
            ld.energy = 9.0
            ld.size = 2.0
            lo = bpy.data.objects.new("key", ld)
            lo.location = (U(rng, -0.5, 0.5), U(rng, -0.5, 0.5), 1.1)
            sc.collection.objects.link(lo)
    else:
        gz = -U(rng, 0.8, 1.4)
        bpy.ops.mesh.primitive_plane_add(size=6.0, location=(0, 0, gz))
        bpy.context.active_object.data.materials.append(soil_material(rng, wet))
        lo_, hi_ = P["clutter"]
        n_clutter = int(rng_range(rng, (lo_, hi_)) * (0.5 if mode == "closeup" else 1.0))
        if mode == "none":
            n_clutter = max(n_clutter, 8)
        pool = job["bg_leaves"] or [job["leaf"]]
        for i in range(n_clutter):
            lid = rng.choice(pool)
            depth = U(rng, 0.11, 0.9)
            shade_t = max(0.35, 1.0 - 0.9 * depth)  # deeper leaves sit in shadow
            tone = U(rng, 0.8, 1.05) * shade_t
            bl, _, _ = make_leaf(lid, rng, leaf_len * U(rng, 0.9, 1.9), f"bg{i}", wet=wet * 0.8,
                                 tint=(tone * U(rng, 0.92, 1.0), tone, tone * U(rng, 0.85, 1.0)),
                                 grid=(56, 24), want_mask=False)
            ang = rng.random() * 2 * math.pi
            rad = U(rng, 0.0, 0.42) * (0.5 + depth)
            bl.location = (math.cos(ang) * rad, math.sin(ang) * rad, -depth)
            bl.rotation_euler = (math.radians(rng.gauss(0, 38)), math.radians(rng.gauss(0, 38)),
                                 rng.random() * 2 * math.pi)
        for _ in range(rng.randint(0, 2) if mode != "closeup" else rng.randint(0, 1)):
            branch(rng, U(rng, 0.15, 0.6), wet)
        if sun_dir is not None and P["dapple"] > 0 and rng.random() < 0.9:
            dapple_caster(rng, Vector((0, 0, 0)), sun_dir, P["dapple"])

    os.makedirs(os.path.dirname(os.path.abspath(job["out"])), exist_ok=True)
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    sc.render.filepath = job["out"]
    # a phone meters the scene, so bring the subject to a mid grey before the real render
    if job.get("auto_exposure", True):
        paper = P["light"] == "studio"
        target_l = rng_range(rng, (0.78, 0.88) if paper else (0.36, 0.55))
        for _ in range(2):
            luma = measure_luma(sc, job["out"] + ".draft.png", "paper" if paper else "centre")
            if abs(luma - target_l) < 0.03:
                break
            sc.view_settings.exposure += max(-2.5, min(2.5, 1.9 * math.log2(max(target_l, 0.02) / max(luma, 0.02))))
    if bad == "glare":
        sc.view_settings.exposure += U(rng, 2.6, 3.6)
    elif bad == "dark":
        sc.view_settings.exposure -= U(rng, 3.2, 4.4)
    exposure = sc.view_settings.exposure
    if job.get("save_blend"):
        bpy.ops.file.pack_all()
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(job["save_blend"]), copy=True)
    t1 = time.time()
    bpy.ops.render.render(write_still=True)
    t2 = time.time()
    meta = {"leaf": job["leaf"], "preset": job["preset"], "seed": job["seed"], "mode": mode, "bad": bad,
            "samples": job["samples"], "exposure_ev": round(exposure, 2), "res": job["res"],
            "leaf_len_m": round(leaf_len, 3), "cover": round(cover, 2), "cam_tilt_deg": round(tilt_cam, 1),
            "cam_dist_m": round(dist, 3), "lens_mm": round(phone["lens"], 1), "fstop": round(phone["fstop"], 1),
            "frame_cm": round(frame_cm, 1) if frame_cm else None, "aim_uv": aim,
            "setup_s": round(t1 - t0, 2), "render_s": round(t2 - t1, 2), **winfo}
    with open(os.path.splitext(job["out"])[0] + ".json", "w") as f:
        json.dump(meta, f)
    print(f"[render] {os.path.basename(job['out'])} setup {t1 - t0:.1f}s render {t2 - t1:.1f}s", flush=True)


def main():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    jobs = json.load(open(argv[0]))
    for j in jobs:
        try:
            render_job(j)
        except Exception as e:  # keep going so one bad leaf does not kill a long batch
            import traceback
            traceback.print_exc()
            print(f"[fail] {j.get('out')} {e}", flush=True)


main()
