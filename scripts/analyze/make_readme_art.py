#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow", "numpy", "fonttools", "brotli"]
# ///
"""Make the pictures at the top of the main README, in docs/readme/.

hero.gif is the banner. It shows one real BRACOL leaf photo, the same leaf bent in 3D in Blender, and renders of
that leaf. Under them a bar shows the real training photos next to the renders that join them. hero-still.png is
its first frame, for readers who turn motion off. results.png is the chart of the results. Every picture and every
count comes from the repo: the manifests, the renders and results/summary.csv.

  uv run scripts/analyze/make_readme_art.py                   # the banner and the chart, with leaf 154
  uv run scripts/analyze/make_readme_art.py chart             # the chart only. It needs no Blender
  uv run scripts/analyze/make_readme_art.py hero --leaf 806 --rerender

Needs Blender (the turning leaf) and ffmpeg (the GIF). The turning leaf is cached in a temp folder, so a second
run skips Blender. Pass --rerender after you change scripts/synth/render_turntable.py. The colours and fonts are
the ones of presentation/site: blue means made in 3D.
"""
import argparse
import csv
import json
import random
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent.parent
BLENDER = "/Applications/Blender.app/Contents/MacOS/Blender"
SITE_FONTS = ROOT / "presentation" / "site" / "fonts"

# the colours of presentation/site/css/style.css
DAYLIGHT, PAPER, INK = (232, 237, 227), (246, 248, 241), (14, 31, 26)
INK2, INK3, CHALK = (63, 80, 73), (91, 106, 99), (239, 244, 234)
BLUE, BLUE_TINT, BLUE_PALE = (43, 76, 235), (221, 228, 251), (236, 240, 254)
WHITE = (255, 255, 255)
# chart series, as in presentation/site/css/style.css: real photos violet, renders only teal, both blue.
# The untrained model is neutral grey and drawn as an open dot, so it never relies on colour alone.
VIOLET, TEAL, GREY, GRID = (138, 63, 160), (10, 141, 176), (111, 124, 118), (221, 227, 214)

S = 2                      # draw at 2x, then shrink, so edges and text stay smooth
W, H = 1040, 576           # the banner, in pixels of the finished picture
MARGIN, COL_W = 32, 280
GAP = (W - 2 * MARGIN - 3 * COL_W) // 2
X1 = MARGIN
X2 = X1 + COL_W + GAP
X3 = X2 + COL_W + GAP
CY = 226                   # the middle line of the three pictures
CARD_REAL = (X1, CY - 70, COL_W, 140)       # 2 to 1, like the BRACOL photo
CARD_3D = (X2, CY - 105, COL_W, 210)        # 4 to 3, like the turntable frames
BENTO_TOP = CY - 142
BAR_Y, BAR_H = 508, 50


def s(v):
    return int(round(v * S))


class scale:
    """Draw at another scale for a moment. The banner uses 2x and the chart 4x."""

    def __init__(self, n):
        self.n = n

    def __enter__(self):
        global S
        self.old, S = S, self.n

    def __exit__(self, *exc):
        global S
        S = self.old


# ------------------------------------------------------------------ fonts
class Fonts:
    """The site's fonts come as woff2. Pillow needs ttf, so we convert them once."""

    def __init__(self, work):
        self.files, self.cache = {}, {}
        for name in ("bigshoulders", "atkinson", "jetbrains-mono"):
            dst = work / "fonts" / f"{name}.ttf"
            if not dst.exists():
                from fontTools.ttLib import TTFont
                dst.parent.mkdir(parents=True, exist_ok=True)
                f = TTFont(SITE_FONTS / f"{name}.woff2")
                f.flavor = None
                f.save(dst)
            self.files[name] = dst

    def get(self, name, size, weight):
        key = (name, size, weight, S)
        if key not in self.cache:
            f = ImageFont.truetype(str(self.files[name]), s(size))
            f.set_variation_by_axes([weight])
            self.cache[key] = f
        return self.cache[key]


def text_width(txt, font, tracking=0.0):
    return sum(font.getlength(c) for c in txt) + s(tracking) * max(len(txt) - 1, 0)


def draw_text(d, xy, txt, font, fill, tracking=0.0, anchor="l"):
    """Text at 1x coordinates. `anchor` is l (left), r (right) or m (middle) of the x position. y is the baseline."""
    x, y = s(xy[0]), s(xy[1])
    w = text_width(txt, font, tracking)
    if anchor == "r":
        x -= w
    elif anchor == "m":
        x -= w / 2
    if not tracking:
        d.text((x, y), txt, font=font, fill=fill, anchor="ls")
        return
    for c in txt:
        d.text((x, y), c, font=font, fill=fill, anchor="ls")
        x += font.getlength(c) + s(tracking)


# ------------------------------------------------------------------ data
def read_csv(path):
    with open(ROOT / path, newline="") as f:
        return list(csv.DictReader(f))


def find_leaf(leaf):
    real = next(r for r in read_csv("data/bracol/manifest.csv") if r["id"] == str(leaf))
    renders = [r for r in read_csv("data/synthetic/v1/manifest.csv") if r["source_id"] == str(leaf)]
    whole = [r for r in renders if r["mode"] == "whole"]
    close = [r for r in renders if r["mode"] == "closeup"]
    if not whole or len(close) < 2:
        sys.exit(f"leaf {leaf} has no whole render and two close-ups in v1. Pick one of the 66 leaves with three renders.")
    return real, [whole[0], close[0], close[1]]


def counts():
    n_real = sum(1 for r in read_csv("data/bracol/manifest.csv") if r["split"] == "train")
    n_syn = len(read_csv("data/synthetic/v1/manifest.csv"))
    return n_real, n_syn


def load_small(path, size):
    """Open a big picture fast, at about the size we need."""
    im = Image.open(ROOT / path)
    im.draft("RGB", (size[0] * 2, size[1] * 2))
    return ImageOps.fit(im.convert("RGB"), size, method=Image.LANCZOS)


# ------------------------------------------------------------------ the leaf cut-out and the turntable
def run_turntable(leaf, work, frames, rerender):
    out = work / f"turntable_{leaf}"
    if (out / "mesh.json").exists() and not rerender:
        if json.load(open(out / "mesh.json"))["meta"]["frames"] == frames:
            return out
    shutil.rmtree(out, ignore_errors=True)
    cmd = [BLENDER, "-b", "--factory-startup", "--python", str(ROOT / "scripts/synth/render_turntable.py"), "--",
           str(leaf), str(out), "--frames", str(frames)]
    print("blender: turning leaf", leaf, "into", out, flush=True)
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL)
    return out


# ------------------------------------------------------------------ drawing helpers
def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return m


def paste_rounded(base, im, xy, radius, alpha=1.0):
    mask = rounded_mask(im.size, radius)
    if alpha < 1.0:
        mask = mask.point(lambda v: int(v * alpha))
    base.paste(im, xy, mask)


def card_shadow(base, box, radius, strength=0.16, blur=14, dy=8):
    x, y, w, h = [s(v) for v in box]
    layer = Image.new("L", base.size, 0)
    ImageDraw.Draw(layer).rounded_rectangle((x, y + s(dy), x + w, y + h + s(dy)), radius=radius, fill=255)
    layer = layer.filter(ImageFilter.GaussianBlur(s(blur))).point(lambda v: int(v * strength))
    base.paste(Image.new("RGB", base.size, INK), (0, 0), layer)


def soft_shadow(box, radius, strength=0.13, blur=9, dy=5):
    """A small padded mask for the shadow of one card, so a tile can bring its own shadow when it pops in."""
    pad = s(blur) * 3
    w, h = s(box[2]), s(box[3])
    m = Image.new("L", (w + 2 * pad, h + 2 * pad), 0)
    ImageDraw.Draw(m).rounded_rectangle((pad, pad, pad + w, pad + h), radius=radius, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(s(blur))).point(lambda v: int(v * strength))
    return m, pad, s(dy)


def pill(d, fonts, x, y, label, fill, ink=WHITE):
    f = fonts.get("jetbrains-mono", 14, 700)
    w = text_width(label, f, 1.6) / S + 22
    d.rounded_rectangle((s(x), s(y), s(x + w), s(y + 28)), radius=s(8), fill=fill)
    draw_text(d, (x + 11, y + 19.5), label, f, ink, tracking=1.6)
    return w


def add_chip(im, fonts, label):
    """A small dark label at the bottom left of a picture, in 2x pixels. It names where the picture comes from."""
    f = fonts.get("jetbrains-mono", 11, 700)
    w = text_width(label, f, 1.0)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((s(8), im.height - s(28), s(8) + w + s(14), im.height - s(8)), radius=s(5), fill=INK)
    draw_text(d, (15, im.height / S - 14.5), label, f, CHALK, tracking=1.0)


def arrow(d, x0, x1, y, color):
    """A thick arrow with a round tail and an open head."""
    d.line((s(x0), s(y), s(x1 - 4), s(y)), fill=color, width=s(5))
    d.ellipse((s(x0) - s(2.5), s(y) - s(2.5), s(x0) + s(2.5), s(y) + s(2.5)), fill=color)
    head = [(s(x1 - 13), s(y - 11)), (s(x1), s(y)), (s(x1 - 13), s(y + 11))]
    d.line(head, fill=color, width=s(5), joint="curve")
    for p in (head[0], head[2]):
        d.ellipse((p[0] - s(2.5), p[1] - s(2.5), p[0] + s(2.5), p[1] + s(2.5)), fill=color)


def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def ease_in_out(t):
    t = max(0.0, min(1.0, t))
    return 3 * t * t - 2 * t ** 3


def premul_resize(im, size):
    """Resize an RGBA picture without the dark rim you get from the colour of transparent pixels."""
    return im.convert("RGBa").resize(size, Image.LANCZOS).convert("RGBA")


# ------------------------------------------------------------------ the banner
class Banner:
    def __init__(self, leaf, work, frames, fonts):
        self.fonts = fonts
        self.real_row, self.render_rows = find_leaf(leaf)
        self.n_real, self.n_syn = counts()
        self.mesh = json.load(open(run_turntable(leaf, work, frames, False) / "mesh.json"))
        self.turn_dir = work / f"turntable_{leaf}"
        self.frames = frames
        self.rng = random.Random(7)
        self.base = self.build_base()
        self.tiles = self.load_bento()
        self.bar_real, self.bar_syn = self.load_bar()
        self.card3d = self.build_card3d()

    # ---- static layer
    def build_base(self):
        im = Image.new("RGB", (s(W), s(H)), DAYLIGHT)
        d = ImageDraw.Draw(im)
        f = self.fonts
        # headers
        pill(d, f, X1, 34, "REAL PHOTO", INK, CHALK)
        pill(d, f, X2, 34, "3D MODEL", BLUE)
        pill(d, f, X3, 34, "3D RENDERS", BLUE)
        # the real photo
        card_shadow(im, CARD_REAL, s(14))
        photo = load_small(self.real_row["image"], (s(CARD_REAL[2]), s(CARD_REAL[3])))
        add_chip(photo, f, f"BRACOL {self.real_row['id']}")
        paste_rounded(im, photo, (s(CARD_REAL[0]), s(CARD_REAL[1])), s(14))
        # the 3D card sits under the turntable
        card_shadow(im, CARD_3D, s(14))
        d = ImageDraw.Draw(im)
        # arrows
        arrow(d, X1 + COL_W + 12, X2 - 12, CY, BLUE)
        arrow(d, X2 + COL_W + 12, X3 - 12, CY, BLUE)
        # captions
        cap_y = CY + 142 + 36
        for x, line1, line2 in (
            (X1, "A real leaf photo", "BRACOL, one leaf, plain background"),
            (X2, "The same leaf, bent in 3D", "Blender, same spots, new shape"),
            (X3, "Rendered in field scenes", "new light, weather and camera"),
        ):
            draw_text(d, (x, cap_y), line1, f.get("bigshoulders", 29, 700), INK)
            draw_text(d, (x, cap_y + 24), line2, f.get("atkinson", 16.5, 400), INK2)
        # the dataset bar: frames now, tiles later
        self.seg = self.segments()
        (rx, rw), (sx, sw) = self.seg
        d.rounded_rectangle((s(rx), s(BAR_Y), s(rx + rw), s(BAR_Y + BAR_H)), radius=s(10), fill=PAPER, outline=INK, width=s(2))
        d.rounded_rectangle((s(sx), s(BAR_Y), s(sx + sw), s(BAR_Y + BAR_H)), radius=s(10), fill=BLUE_PALE, outline=BLUE, width=s(2))
        return im

    def segments(self):
        total_w = W - 2 * MARGIN - 8
        real_w = total_w * self.n_real / (self.n_real + self.n_syn)
        return (MARGIN, real_w), (MARGIN + real_w + 8, total_w - real_w)

    def bento_boxes(self):
        sq = (COL_W - 8) // 2
        return [(X3, BENTO_TOP, COL_W, 140), (X3, BENTO_TOP + 148, sq, sq), (X3 + sq + 8, BENTO_TOP + 148, sq, sq)]

    def load_bento(self):
        out = []
        for row, box in zip(self.render_rows, self.bento_boxes()):
            im = load_small(row["image"], (s(box[2]), s(box[3])))
            out.append((im, box, row["preset"].replace("_", " ").upper(), soft_shadow(box, s(12))))
        return out

    def load_bar(self):
        (rx, rw), (sx, sw) = self.segments()
        inner = BAR_H - 6
        rows = 4
        th = inner / rows
        # real photos are 2 to 1, so a tile is twice as wide as it is tall
        real_cols = int((rw - 6) / (2 * th))
        syn_cols = int((sw - 6) / th)
        train = [r for r in read_csv("data/bracol/manifest.csv") if r["split"] == "train"]
        syn = read_csv("data/synthetic/v1/manifest.csv")
        self.rng.shuffle(train)
        self.rng.shuffle(syn)
        out = []
        for rows_, cols, seg in ((train, real_cols, (rx, rw)), (syn, syn_cols, (sx, sw))):
            tiles = []
            tw = (seg[1] - 6) / cols
            for i in range(rows * cols):
                c, r = i // rows, i % rows
                x0, x1 = seg[0] + 3 + c * tw, seg[0] + 3 + (c + 1) * tw
                y0, y1 = BAR_Y + 3 + r * th, BAR_Y + 3 + (r + 1) * th
                w_px, h_px = max(1, s(x1) - s(x0) - 1), max(1, s(y1) - s(y0) - 1)
                tiles.append((load_small(rows_[i]["image"], (w_px, h_px)), (s(x0), s(y0)), c))
            out.append((tiles, cols))
        return out

    # ---- the turning leaf
    def build_card3d(self):
        x, y, w, h = CARD_3D
        cw, ch = s(w), s(h)
        card = Image.new("RGB", (cw, ch), BLUE_TINT)
        # a floor grid, drawn as a Blender viewport does, fading toward the back
        layer = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        for line in self.mesh["floor"]:
            ld.line([(px * cw, py * ch) for px, py in line], fill=BLUE + (95,), width=max(1, s(0.9)))
        fade = Image.linear_gradient("L").resize((cw, ch)).point(lambda v: int(60 + 195 * (v / 255) ** 1.2))
        layer.putalpha(ImageChops.multiply(layer.getchannel("A"), fade))
        card.paste(layer, (0, 0), layer)
        # the axis gizmo, small, in the corner
        gd = ImageDraw.Draw(card)
        gx, gy, r = cw - s(34), s(36), s(5.2)
        for dx, dy, col in ((0, -17, (60, 140, 255)), (16, 9, (235, 70, 80)), (-16, 9, (120, 200, 40))):
            gd.line((gx, gy, gx + s(dx), gy + s(dy)), fill=INK3, width=s(1.4))
            gd.ellipse((gx + s(dx) - r, gy + s(dy) - r, gx + s(dx) + r, gy + s(dy) + r), fill=col)
        return card

    def leaf_card(self, i):
        x, y, w, h = CARD_3D
        cw, ch = s(w), s(h)
        card = self.card3d.copy()
        leaf = premul_resize(Image.open(self.turn_dir / f"f{i:03d}.png").convert("RGBA"), (cw, ch))
        alpha = leaf.getchannel("A")
        # a soft shadow on the floor, below the leaf
        sh = alpha.filter(ImageFilter.GaussianBlur(s(7)))
        sh = ImageChops.offset(sh, 0, s(30)).point(lambda v: int(v * 0.30))
        card.paste(Image.new("RGB", card.size, INK2), (0, 0), sh)
        card.paste(leaf, (0, 0), leaf)
        # the mesh, drawn on the leaf only
        wires = Image.new("RGBA", card.size, (0, 0, 0, 0))
        wd = ImageDraw.Draw(wires)
        for line in self.mesh["frames"][i]["lines"]:
            wd.line([(px * cw, py * ch) for px, py in line], fill=WHITE + (150,), width=max(1, s(0.9)))
        wires.putalpha(ImageChops.multiply(wires.getchannel("A"), alpha))
        card.paste(wires, (0, 0), wires)
        return card

    # ---- one frame
    def frame(self, i, build):
        """`build` is 0 for an empty banner and 1 for the finished one."""
        im = self.base.copy()
        d = ImageDraw.Draw(im)
        f = self.fonts
        # the 3D card
        x, y, w, h = CARD_3D
        paste_rounded(im, self.leaf_card(i % self.frames), (s(x), s(y)), s(14))
        # renders pop in one after another
        for k, (tile, box, tag, (sh, pad, dy)) in enumerate(self.tiles):
            p = ease_out(build["tiles"][k])
            if p <= 0:
                continue
            bx, by, bw, bh = box
            im.paste(Image.new("RGB", sh.size, INK), (s(bx) - pad, s(by + (1 - p) * 10) - pad + dy), sh.point(lambda v: int(v * p)))
            t = tile.copy()
            add_chip(t, f, tag)
            paste_rounded(im, t, (s(bx), s(by + (1 - p) * 10)), s(12), alpha=p)
        # the bar: real photos always, renders as they arrive
        (tiles, cols), (stiles, scols) = self.bar_real, self.bar_syn
        for tile, xy, c in tiles:
            im.paste(tile, xy)
        reveal = build["fill"] * (scols + 1)
        for tile, xy, c in stiles:
            a = max(0.0, min(1.0, reveal - c))
            if a > 0:
                im.paste(tile, xy, Image.new("L", tile.size, int(255 * a)))
        d = ImageDraw.Draw(im)
        # the numbers
        (rx, rw), (sx, sw) = self.seg
        n_syn = int(round(self.n_syn * build["fill"]))
        num, lab = f.get("bigshoulders", 42, 700), f.get("atkinson", 17, 500)
        y0 = BAR_Y - 14
        draw_text(d, (rx, y0), f"{self.n_real:,}", num, INK)
        draw_text(d, (rx + text_width(f"{self.n_real:,}", num) / S + 8, y0 - 1), "real photos", lab, INK2)
        draw_text(d, (sx, y0), f"+ {n_syn:,}", num, BLUE)
        draw_text(d, (sx + text_width(f"+ {n_syn:,}", num) / S + 8, y0 - 1), "3D renders", lab, BLUE)
        total = f"= {self.n_real + n_syn:,}"
        draw_text(d, (W - MARGIN, y0), "to train on", lab, INK2, anchor="r")
        draw_text(d, (W - MARGIN - text_width("to train on", lab) / S - 8, y0), total, num, INK, anchor="r")
        return im.resize((W, H), Image.LANCZOS)


def timeline(i, fps):
    """What is on screen at frame i. Frame 0 is the finished banner, so a still of the GIF tells the story.
    The finished banner holds, fades out, stays empty for a moment, then the renders pop in one by one while
    the bar fills and the counters climb."""
    t = i / fps
    hold, fade, empty, pop, build = 2.4, 0.25, 0.25, 0.32, 1.5
    full = {"tiles": [1, 1, 1], "fill": 1.0}
    if t < hold or t >= hold + fade + empty + build:
        return full
    if t < hold + fade:
        a = 1 - (t - hold) / fade
        return {"tiles": [a, a, a], "fill": a}
    if t < hold + fade + empty:
        return {"tiles": [0, 0, 0], "fill": 0.0}
    b = t - (hold + fade + empty)
    return {"tiles": [min(1.0, max(0.0, (b - 0.3 * k) / pop)) for k in range(3)], "fill": ease_in_out(b / build)}


# ------------------------------------------------------------------ the results chart
def dot(d, cx, cy, r, color, ring, open_=False):
    """A dot with a ring in the colour of the surface, so dots that overlap stay readable."""
    R, g = s(r), s(2)
    d.ellipse((s(cx) - R - g, s(cy) - R - g, s(cx) + R + g, s(cy) + R + g), fill=ring)
    d.ellipse((s(cx) - R, s(cy) - R, s(cx) + R, s(cy) + R), fill=color)
    if open_:
        w = s(2.4)
        d.ellipse((s(cx) - R + w, s(cy) - R + w, s(cx) + R - w, s(cy) + R - w), fill=ring)


def chart_data():
    """AUC of the four models of the first round on BRACOL test and on all 1,792 Uganda photos.
    The numbers are the ones of results/summary.csv, so the chart and the tables never disagree."""
    rows = read_csv("results/summary.csv")
    by = {r["run"]: r for r in rows}

    def runs(arm, pct, col):
        v = sorted(float(r[col]) for r in rows if r["arm"] == arm and r["detail"] == "140"
                   and r["real_percent"] == str(pct) and r[col] not in ("", None))
        if len(v) != 3:
            sys.exit(f"expected 3 seeds for {arm} at {pct}% real on {col}, found {len(v)}. Run make_results.py first.")
        return v

    zero = by["zeroshot_d140_cuda"]
    return {col: {"zero": [float(zero[col])], "real": runs("real", 100, col), "syn": runs("syn", 0, col),
                  "mix": runs("mix", 100, col)} for col in ("auc", "uganda_all_auc")}


def build_chart(fonts, out):
    data = chart_data()
    n_real, n_syn = counts()
    W2, H2 = 1000, 514
    series = [("zero", "No training", "Gemma 4 E2B as released", GREY, True),
              ("real", "Real photos only", f"{n_real:,} real photos", VIOLET, False),
              ("syn", "Renders only", f"{n_syn:,} renders", TEAL, False),
              ("mix", "Renders + real photos", f"{n_real + n_syn:,} photos, both", BLUE, False)]
    card_w = 356
    first = MARGIN + 212
    panels = [("auc", "Clean photos", "BRACOL test, 261 photos", first),
              ("uganda_all_auc", "Real farm photos", "Uganda, 1,792 photos", first + card_w + 12)]
    lo, hi = 0.90, 1.00
    with scale(4):
        im = Image.new("RGB", (s(W2), s(H2)), DAYLIGHT)
        d = ImageDraw.Draw(im)
        draw_text(d, (MARGIN, 52), "Renders alone score close to real photos", fonts.get("bigshoulders", 38, 700), INK)
        draw_text(d, (MARGIN, 80), "AUC, higher is better: 0.5 is a coin flip, 1.0 is perfect. One dot per training run. Dots overlap when runs agree.",
                  fonts.get("atkinson", 17, 400), INK2)
        top, card_h = 108, 342
        row_y = [top + 112 + 58 * i for i in range(4)]
        # the row labels, shared by both panels
        for (key, name, sub, color, hollow), y in zip(series, row_y):
            dot(d, MARGIN + 7, y, 6, color, DAYLIGHT, hollow)
            draw_text(d, (MARGIN + 24, y - 1), name, fonts.get("atkinson", 17.5, 600), INK)
            draw_text(d, (MARGIN + 24, y + 18), sub, fonts.get("atkinson", 14.5, 400), INK3)
        for col, title, sub, x0 in panels:
            d.rounded_rectangle((s(x0), s(top), s(x0 + card_w), s(top + card_h)), radius=s(14), fill=PAPER)
            draw_text(d, (x0 + 20, top + 34), title, fonts.get("bigshoulders", 26, 700), INK)
            draw_text(d, (x0 + 20, top + 56), sub, fonts.get("atkinson", 15, 400), INK2)
            px0, px1 = x0 + 28, x0 + card_w - 64               # the plot runs from AUC 0.90 to 1.00
            xs = lambda v: px0 + (v - lo) / (hi - lo) * (px1 - px0)
            for k in range(6):                                  # hairline grid and tick labels
                v = lo + 0.02 * k
                d.line((s(xs(v)), s(top + 84), s(xs(v)), s(top + card_h - 40)), fill=GRID, width=s(1))
                draw_text(d, (xs(v), top + card_h - 20), f"{v:.2f}", fonts.get("jetbrains-mono", 13.5, 400), INK3, anchor="m")
            for (key, name, sub, color, hollow), y in zip(series, row_y):
                d.line((s(px0), s(y), s(px1), s(y)), fill=GRID, width=s(1))
            for (key, name, sub, color, hollow), y in zip(series, row_y):
                v = data[col][key]
                for x in v:
                    dot(d, xs(x), y, 5, color, PAPER, hollow)
                mean = sum(v) / len(v)
                draw_text(d, (xs(max(v)) + 16, y + 5), f"{mean:.3f}", fonts.get("jetbrains-mono", 15.5, 700), INK)
        draw_text(d, (MARGIN, H2 - 22), "The renders are synthetic scenes built from real BRACOL leaf textures. Neither test set was used to train or to make renders.",
                  fonts.get("atkinson", 15, 400), INK3)
        im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
    im.save(out / "results.png", optimize=True)
    print(f"results.png: {(out / 'results.png').stat().st_size / 1e3:.0f} KB")


def kmeans(x, k, iters=12, seed=0):
    rng = np.random.default_rng(seed)
    c = x[rng.choice(len(x), k, replace=False)].astype(np.float32)
    for _ in range(iters):
        a = ((x[:, None, :] - c[None, :, :]) ** 2).sum(-1).argmin(1)
        for j in range(k):
            m = a == j
            if m.any():
                c[j] = x[m].mean(0)
    return c


def balanced_palette(frames):
    """The 256 colours of the GIF, picked by hue family.

    A plain median cut spends the colours on the big green and grey areas and keeps none for the orange and
    brown of the rust spots, which are what the picture is about. So the warm colours get a fixed share."""
    px = np.concatenate([np.asarray(f).reshape(-1, 3)[::7] for f in frames[::6]]).astype(np.float32) / 255
    mx, mn = px.max(1), px.min(1)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    r, g, b = px[:, 0], px[:, 1], px[:, 2]
    hue = np.where(mx == mn, 0, np.where(mx == r, (60 * (g - b) / np.maximum(mx - mn, 1e-4)) % 360,
                   np.where(mx == g, 60 * (b - r) / np.maximum(mx - mn, 1e-4) + 120,
                            60 * (r - g) / np.maximum(mx - mn, 1e-4) + 240)))
    fixed = [INK, BLUE, BLUE_TINT, BLUE_PALE, DAYLIGHT, PAPER, CHALK, WHITE, INK2, INK3]
    families = [((sat > 0.22) & ((hue < 68) | (hue > 330)), 56),     # orange, brown, yellow, red: the rust
                ((sat > 0.18) & (hue >= 68) & (hue < 180), 84),      # green
                ((sat > 0.18) & (hue >= 180) & (hue <= 330), 28),    # blue and violet
                (sat <= 0.18, 256 - len(fixed) - 56 - 84 - 28)]      # grey, sage, white, black
    cols = [np.array(c, dtype=np.float32) / 255 for c in fixed]
    for mask, k in families:
        x = px[mask]
        if len(x) > 60000:
            x = x[np.random.default_rng(1).choice(len(x), 60000, replace=False)]
        cols.extend(kmeans(x, min(k, len(x))))
    pal = (np.clip(np.array(cols), 0, 1) * 255).round().astype(np.uint8)
    pal = np.concatenate([pal, np.zeros((256 - len(pal), 3), np.uint8)])
    return Image.fromarray(pal.reshape(16, 16, 3))


def write_gif(frames, path, fps):
    tmp = Path(tempfile.mkdtemp())
    for i, fr in enumerate(frames):
        fr.save(tmp / f"f{i:03d}.png")
    balanced_palette(frames).save(tmp / "palette.png")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps), "-i", str(tmp / "f%03d.png"),
                    "-i", str(tmp / "palette.png"), "-lavfi", "paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
                    "-loop", "0", str(path)], check=True)
    shutil.rmtree(tmp)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("what", nargs="?", default="all", choices=["all", "hero", "chart"])
    ap.add_argument("--leaf", type=int, default=154, help="BRACOL id of a train leaf with three renders in set 1")
    ap.add_argument("--frames", type=int, default=60)
    ap.add_argument("--fps", type=float, default=12.5)
    ap.add_argument("--out", default="docs/readme")
    ap.add_argument("--work", default=str(Path(tempfile.gettempdir()) / "shhs_readme_art"))
    ap.add_argument("--rerender", action="store_true", help="render the turning leaf again")
    ap.add_argument("--frame", type=int, default=None, help="write this banner frame as a PNG, to look at it")
    a = ap.parse_args()
    work = Path(a.work)
    work.mkdir(parents=True, exist_ok=True)
    out = ROOT / a.out
    out.mkdir(parents=True, exist_ok=True)
    fonts = Fonts(work)
    if a.what in ("all", "chart"):
        build_chart(fonts, out)
        if a.what == "chart":
            return
    run_turntable(a.leaf, work, a.frames, a.rerender)
    banner = Banner(a.leaf, work, a.frames, fonts)
    if a.frame is not None:
        banner.frame(a.frame, timeline(a.frame, a.fps)).save(work / f"frame_{a.frame:03d}.png")
        print("wrote", work / f"frame_{a.frame:03d}.png")
        return
    frames = [banner.frame(i, timeline(i, a.fps)) for i in range(a.frames)]
    frames[0].save(out / "hero-still.png", optimize=True)
    write_gif(frames, out / "hero.gif", a.fps)
    for name in ("hero.gif", "hero-still.png"):
        print(f"{name}: {(out / name).stat().st_size / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
