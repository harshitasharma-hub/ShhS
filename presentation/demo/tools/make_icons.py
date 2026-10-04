#!/usr/bin/env python3
"""Draw the app icons for Kagua Jani: a white coffee leaf on dark green.

  .venv/bin/python presentation/demo/tools/make_icons.py
Writes public/icons/icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png and public/favicon.svg.
The leaf is the same shape as the pictogram in public/index.html.
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public"
GREEN = (27, 94, 58)
WHITE = (255, 255, 255)

# Cubic bezier segments of the leaf outline, in a 200 x 250 box (same numbers as the SVG path).
LEAF = [
    ((100, 228), (52, 206), (26, 160), (30, 112)),
    ((30, 112), (34, 62), (66, 24), (100, 6)),
    ((100, 6), (134, 24), (166, 62), (170, 112)),
    ((170, 112), (174, 160), (148, 206), (100, 228)),
]
VEINS = [((100, 236), (100, 26)), ((100, 190), (64, 162)), ((100, 190), (136, 162)), ((100, 154), (54, 124)),
         ((100, 154), (146, 124)), ((100, 118), (52, 90)), ((100, 118), (148, 90))]


def bezier(p0, p1, p2, p3, steps=40):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3
        pts.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return pts


def draw_icon(size, leaf_height_share, rounded):
    big = size * 4  # draw large, then shrink, for smooth edges
    img = Image.new("RGB", (big, big), GREEN)
    d = ImageDraw.Draw(img)
    scale = big * leaf_height_share / 250
    ox, oy = (big - 200 * scale) / 2, (big - 250 * scale) / 2
    move = lambda p: (ox + p[0] * scale, oy + p[1] * scale)
    outline = []
    for seg in LEAF:
        outline += [move(p) for p in bezier(*seg)]
    d.polygon(outline, fill=WHITE)
    for a, b in VEINS:
        d.line([move(a), move(b)], fill=GREEN, width=max(2, round(5 * scale)))
    img = img.resize((size, size), Image.LANCZOS)
    if rounded:
        mask = Image.new("L", (size * 4, size * 4), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1], radius=size * 4 // 5, fill=255)
        mask = mask.resize((size, size), Image.LANCZOS)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img


def main():
    (OUT / "icons").mkdir(parents=True, exist_ok=True)
    draw_icon(192, 0.78, True).save(OUT / "icons" / "icon-192.png")
    draw_icon(512, 0.78, True).save(OUT / "icons" / "icon-512.png")
    draw_icon(512, 0.58, False).save(OUT / "icons" / "maskable-512.png")  # full-bleed, leaf inside the safe zone
    draw_icon(180, 0.78, False).save(OUT / "icons" / "apple-touch-icon.png")
    veins = "".join(f'<path d="M{a[0]} {a[1]}L{b[0]} {b[1]}"/>' for a, b in VEINS)
    (OUT / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -20 260 290">'
        f'<rect x="-30" y="-20" width="260" height="290" rx="60" fill="rgb{GREEN}"/>'
        '<path fill="#fff" d="M100 228C52 206 26 160 30 112C34 62 66 24 100 6C134 24 166 62 170 112C174 160 148 206 100 228Z"/>'
        f'<g fill="none" stroke="rgb{GREEN}" stroke-width="6" stroke-linecap="round">{veins}</g></svg>\n',
        encoding="utf-8",
    )
    print("wrote", sorted(p.name for p in (OUT / "icons").iterdir()), "and favicon.svg")


if __name__ == "__main__":
    main()
