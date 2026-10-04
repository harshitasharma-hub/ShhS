#!/usr/bin/env python3
"""Build public/index.html from src/index.template.html and src/strings.json.

  python3 presentation/demo/tools/build.py
The same strings feed three things: the app screens, the plain-HTML page that shows when scripts do not run
(Opera Mini, old phones), and the voice clips (tools/make_voice.py). Edit the words in src/strings.json, never in public/index.html.
It also writes a version tag into public/sw.js, so a changed file makes phones fetch the new copy.
"""
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# The four saved examples: Uganda field photos and the score the real model gave (run real_d140_f10_s0).
LEAVES = [
    {"id": 1, "src": "samples/rust_yes_fi_01050.jpg", "verdict": "rust", "score": 5.0},
    {"id": 2, "src": "samples/no_rust_fi_00422.jpg", "verdict": "no_rust", "score": -6.0625},
    {"id": 3, "src": "samples/not_sure_1_fi_00758.jpg", "verdict": "not_sure", "score": -1.125},
    {"id": 4, "src": "samples/not_sure_2_fi_01524.jpg", "verdict": "not_sure", "score": -1.5},
]
BAND = {"cutoff": -1.375, "margin": 2.5}


def basic_page(sw):
    """The Swahili page as plain HTML. No scripts and no CSS variables needed."""
    esc = html.escape
    parts = ['  <section class="basic" id="basic" lang="sw">', f"    <h2>{esc(sw['ask'])}</h2>", f"    <p>{esc(sw['basicIntro'])}</p>"]
    for leaf in LEAVES:
        v, n = leaf["verdict"], leaf["id"]
        parts += [
            "    <article>",
            f"      <h3>{esc(sw['leaf'])} {n}</h3>",
            f'      <img src="{leaf["src"]}" width="256" height="256" alt="{esc(sw["leaf"])} {n}: {esc(sw["alt"][n - 1])}">',
            f"      <p><strong>{esc(sw['verdict'][v])}.</strong> {esc(sw['next'][v])}</p>",
            f'      <p><a href="voice/{v}_full.mp3">{esc(sw["basicListen"])}</a></p>',
            "    </article>",
        ]
    parts += [f"    <p><strong>{esc(sw['note'])}</strong></p>", "  </section>"]
    return "\n".join(parts)


def build_tag():
    """A short hash of everything the phone caches, so the tag changes when any of it changes."""
    h = hashlib.sha256()
    for path in [ROOT / "src" / "index.template.html", ROOT / "src" / "strings.json", PUBLIC / "manifest.webmanifest", PUBLIC / "favicon.svg"]:
        h.update(path.read_bytes())
    sw = re.sub(r'const VERSION = "[^"]*";', "", (PUBLIC / "sw.js").read_text(encoding="utf-8"))
    h.update(sw.encode("utf-8"))
    for folder, pattern in (("samples", "*.jpg"), ("voice", "*.mp3")):
        for path in sorted((PUBLIC / folder).glob(pattern)):
            h.update(path.read_bytes())
    return h.hexdigest()[:8]


def main():
    strings = json.loads((ROOT / "src" / "strings.json").read_text(encoding="utf-8"))
    strings.pop("_about", None)
    template = (ROOT / "src" / "index.template.html").read_text(encoding="utf-8")
    tag = build_tag()
    as_json = lambda obj: json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    page = (template.replace("{{BASIC}}", basic_page(strings["sw"]))
            .replace("{{STRINGS}}", as_json(strings))
            .replace("{{LEAVES}}", as_json(LEAVES))
            .replace("{{BAND}}", as_json(BAND))
            .replace("{{BUILD}}", tag))
    (PUBLIC / "index.html").write_text(page, encoding="utf-8")
    sw_path = PUBLIC / "sw.js"
    sw = re.sub(r'const VERSION = "[^"]*";', f'const VERSION = "kj-{tag}";', sw_path.read_text(encoding="utf-8"))
    sw_path.write_text(sw, encoding="utf-8")
    print(f"built public/index.html ({len(page.encode('utf-8')) / 1000:.1f} KB), version {tag}")


if __name__ == "__main__":
    main()
