"""Render one 3D leaf swaying in front of a camera, with no window. For the README banner.

It builds the bent leaf that blender_render.py builds (same mesh, same material) and turns it a little
each frame. For every frame it writes a transparent PNG. It also writes mesh.json, with the screen position
of the mesh lines of the leaf in every frame and of a floor grid. analyze/make_readme_art.py draws the mesh
on top of the PNG, inside the leaf outline, and draws the floor under it.

Run (leaf id and output folder, then options):
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
      --python scripts/synth/render_turntable.py -- 154 /tmp/turntable --frames 60
"""
import argparse
import json
import math
import os
import random
import sys

import bpy
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import blender_render as br  # noqa: E402

LEAF_LEN = 0.15          # metres, the middle of the range the renders use
GRID = (26, 10)          # mesh lines the banner draws: along the leaf, across the leaf
ALONG_SAMPLES, ACROSS_SAMPLES = 80, 32   # points per line, so the lines bend smoothly


def pick_seed():
    """The first seed whose leaf has a clear fold, droop, twist and wave, so the 3D shape shows."""
    for seed in range(1000):
        s = br.LeafShape(random.Random(seed), LEAF_LEN, 0.07)
        if 0.20 <= s.fold <= 0.30 and 0.08 <= s.arch <= 0.14 and s.wave_a >= 0.04 and abs(s.twist) >= 0.12:
            return seed
    return 0


def tighten_outline(leaf, lo=0.6, hi=0.9):
    """Cut the soft rim off the leaf outline. The renders are small, so it never shows there.
    On a large turntable frame it does. Only this script changes the material."""
    nt = leaf.data.materials[0].node_tree
    out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
    cut = out.inputs["Surface"].links[0].from_node        # the mix that cuts the outline with the mask
    src = cut.inputs[0].links[0].from_socket
    ramp = nt.nodes.new("ShaderNodeMapRange")
    ramp.inputs["From Min"].default_value = lo
    ramp.inputs["From Max"].default_value = hi
    nt.links.new(src, ramp.inputs["Value"])
    nt.links.new(ramp.outputs["Result"], cut.inputs[0])


def project(sc, cam, leaf, shape, pts):
    """Screen position (0 to 1 across, 0 to 1 down) of local points of the leaf, as a list of [x, y]."""
    out = []
    for xn, yn in pts:
        z = float(shape.z(xn, yn))
        w = leaf.matrix_world @ Vector((xn * shape.L / 2, yn * shape.W / 2, z))
        p = world_to_camera_view(sc, cam, w)
        out.append([round(p.x, 4), round(1 - p.y, 4)])
    return out


def floor_lines(sc, cam, z=-0.045, half=(0.22, 0.17), step=0.02, n=24):
    """Lines of a square grid under the leaf, as screen positions. The camera never moves, so one set will do."""
    def at(x, y):
        p = world_to_camera_view(sc, cam, Vector((x, y, z)))
        return [round(p.x, 4), round(1 - p.y, 4)]
    out = []
    for i in range(int(round(2 * half[0] / step)) + 1):
        x = -half[0] + i * step
        out.append([at(x, -half[1] + t * 2 * half[1] / (n - 1)) for t in range(n)])
    for j in range(int(round(2 * half[1] / step)) + 1):
        y = -half[1] + j * step
        out.append([at(-half[0] + t * 2 * half[0] / (n - 1), y) for t in range(n)])
    return out


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("leaf", type=int, help="BRACOL id of a train leaf")
    ap.add_argument("out", help="folder for the frames")
    ap.add_argument("--tex-dir", default=None, help="folder with <leaf>.jpg and <leaf>_mask.png. Default: data/synthetic/textures")
    ap.add_argument("--frames", type=int, default=60)
    ap.add_argument("--width", type=int, default=800)
    ap.add_argument("--height", type=int, default=600)
    ap.add_argument("--samples", type=int, default=64)
    ap.add_argument("--seed", type=int, default=None, help="leaf shape seed. Default: the first seed with a clear bend")
    ap.add_argument("--yaw", type=float, default=48.0, help="sway left and right, in degrees")
    ap.add_argument("--nod", type=float, default=6.0, help="tilt toward and away from the camera, in degrees")
    ap.add_argument("--elevation", type=float, default=46.0, help="camera angle above the leaf, in degrees")
    ap.add_argument("--distance", type=float, default=0.33, help="camera distance in metres")
    ap.add_argument("--exposure", type=float, default=-0.2)
    ap.add_argument("--key", type=float, default=26.0, help="key light, in watts")
    ap.add_argument("--rim", type=float, default=10.0, help="light from behind, in watts")
    ap.add_argument("--only", type=int, default=None, help="render this frame only, to test the look")
    a = ap.parse_args(argv)
    os.makedirs(a.out, exist_ok=True)

    seed = a.seed if a.seed is not None else pick_seed()
    rng = random.Random(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.eevee.taa_render_samples = a.samples
    sc.eevee.use_raytracing = True
    sc.eevee.use_shadows = True
    sc.render.resolution_x, sc.render.resolution_y = a.width, a.height
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.display_settings.display_device = "sRGB"
    sc.view_settings.view_transform = "AgX"
    try:
        sc.view_settings.look = "AgX - Punchy"
    except TypeError:
        pass
    sc.view_settings.exposure = a.exposure
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"

    br.build_world(sc, "studio", rng)   # flat grey fill light. The film is transparent, so it never shows.
    key = bpy.data.lights.new("key", "AREA")
    key.energy, key.size = a.key, 0.7
    ko = bpy.data.objects.new("key", key)
    ko.location = (-0.42, -0.30, 0.62)
    ko.rotation_euler = (Vector((0, 0, 0)) - ko.location).to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(ko)
    rim = bpy.data.lights.new("rim", "AREA")
    rim.energy, rim.size = a.rim, 0.5
    ro = bpy.data.objects.new("rim", rim)
    ro.location = (0.30, 0.35, 0.45)
    ro.rotation_euler = (Vector((0, 0, 0)) - ro.location).to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(ro)

    leaf, shape, _ = br.make_leaf(a.leaf, rng, LEAF_LEN, "leaf", grid=(96, 40), want_mask=False, tex_dir=a.tex_dir)
    tighten_outline(leaf)

    cam_data = bpy.data.cameras.new("cam")
    cam_data.lens, cam_data.sensor_width, cam_data.sensor_fit = 70.0, 36.0, "HORIZONTAL"
    cam_data.dof.use_dof = False
    cam = bpy.data.objects.new("cam", cam_data)
    sc.collection.objects.link(cam)
    sc.camera = cam
    dist = a.distance
    el = math.radians(a.elevation)
    cam.matrix_world = br.camera_matrix(Vector((0, -dist * math.cos(el), dist * math.sin(el))), Vector((0, 0, 0)), 0.0)

    # lines of constant position along and across the leaf, in the units of LeafShape.z (-1 to 1)
    xs = np.linspace(-1, 1, ALONG_SAMPLES)
    ys = np.linspace(-1, 1, ACROSS_SAMPLES)
    lines = []
    for j in range(GRID[1] + 1):
        yn = -1 + 2 * j / GRID[1]
        lines.append([(float(x), yn) for x in xs])
    for i in range(GRID[0] + 1):
        xn = -1 + 2 * i / GRID[0]
        lines.append([(xn, float(y)) for y in ys])

    frames = []
    todo = range(a.frames) if a.only is None else [a.only]
    for i in todo:
        phi = 2 * math.pi * i / a.frames
        leaf.rotation_euler = (math.radians(a.nod) * math.cos(phi), math.radians(5.0) * math.sin(phi + 1.0),
                               math.radians(a.yaw) * math.sin(phi))
        bpy.context.view_layer.update()
        sc.render.filepath = os.path.join(a.out, f"f{i:03d}.png")
        bpy.ops.render.render(write_still=True)
        frames.append({"frame": i, "lines": [project(sc, cam, leaf, shape, ln) for ln in lines]})
        print(f"[turntable] frame {i}", flush=True)
    meta = {"leaf": a.leaf, "shape_seed": seed, "frames": a.frames, "width": a.width, "height": a.height, "grid": GRID,
            "fold": round(shape.fold, 3), "arch": round(shape.arch, 3), "twist": round(shape.twist, 3),
            "wave": round(shape.wave_a, 3), "yaw_deg": a.yaw, "nod_deg": a.nod, "elevation_deg": a.elevation}
    with open(os.path.join(a.out, "mesh.json" if a.only is None else f"mesh_{a.only}.json"), "w") as f:
        json.dump({"meta": meta, "floor": floor_lines(sc, cam), "frames": frames}, f)
    print("[turntable] done", meta, flush=True)


if __name__ == "__main__":
    main()
