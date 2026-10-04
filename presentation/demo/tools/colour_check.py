#!/usr/bin/env python3
"""Check the answer-screen colours: text contrast, and how far apart the three screens look to people with common
colour-vision differences. Uses WCAG 2 contrast and the Machado, Oliveira and Fernandes (2009) simulation, with the CIE76 distance.

  python3 presentation/demo/tools/colour_check.py
A distance under about 20 means two colours are easy to confuse. Colour never carries the meaning alone in the page, so a low score
on one pair is a warning, not a failure.
"""
import math

MACHADO = {
    "protanopia": [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    "deuteranopia": [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    "tritanopia": [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
}
INK, WHITE = "#12201A", "#FFFFFF"
SETS = {
    "before": [("rust", "#BF4A12", WHITE), ("no rust", "#1F6B45", WHITE), ("not sure", "#34508C", WHITE)],
    "after": [("rust", "#F59A2E", INK), ("no rust", "#14532D", WHITE), ("not sure", "#2F3E8C", WHITE)],
}


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(c):
    r, g, b = (lin(x) for x in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def simulate(c, m):
    v = [lin(x) for x in c]
    out = [sum(m[i][j] * v[j] for j in range(3)) for i in range(3)]
    return tuple(round(255 * (12.92 * max(0, min(1, x)) if x <= 0.0031308 else 1.055 * max(0, min(1, x)) ** (1 / 2.4) - 0.055)) for x in out)


def lab(c):
    r, g, b = (lin(x) for x in c)
    xyz = (0.4124 * r + 0.3576 * g + 0.1805 * b, 0.2126 * r + 0.7152 * g + 0.0722 * b, 0.0193 * r + 0.1192 * g + 0.9505 * b)
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = f(xyz[0] / 0.95047), f(xyz[1]), f(xyz[2] / 1.08883)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


for name, rows in SETS.items():
    print(f"\n{name}")
    for label, bg, fg in rows:
        print(f"  {label:9s} {bg}  text contrast {contrast(rgb(fg), rgb(bg)):5.2f}:1")
    pairs = [(rows[0], rows[1]), (rows[0], rows[2]), (rows[1], rows[2])]
    for mode in ("normal", *MACHADO):
        d = []
        for (_, a, _), (_, b, _) in pairs:
            ca, cb = rgb(a), rgb(b)
            if mode != "normal":
                ca, cb = simulate(ca, MACHADO[mode]), simulate(cb, MACHADO[mode])
            d.append(math.dist(lab(ca), lab(cb)))
        print(f"  {mode:13s} distance rust/no-rust {d[0]:5.1f}  rust/not-sure {d[1]:5.1f}  no-rust/not-sure {d[2]:5.1f}  smallest {min(d):5.1f}")
