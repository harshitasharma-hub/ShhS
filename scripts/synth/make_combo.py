#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Make set 4, called combo: all of v1, plus only the new rimmed photos of v3.

The runs tagged "combo" train on this set. It holds no pictures. Its rows point at the pictures in v1/ and v3/.
The new photos of v3 are the rows whose id starts with "v3_". The other rows of v3 are copies of v1 and are left out.

  uv run scripts/synth/make_combo.py

Writes data/synthetic/combo_v1_v3rim/manifest.csv.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SYN = ROOT / "data" / "synthetic"


def main():
    v1 = (SYN / "v1" / "manifest.csv").read_bytes().splitlines(keepends=True)
    v3 = (SYN / "v3" / "manifest.csv").read_bytes().splitlines(keepends=True)
    assert v1[0] == v3[0], "v1 and v3 have different columns"
    new = [line for line in v3[1:] if line.startswith(b"v3_")]
    out = SYN / "combo_v1_v3rim" / "manifest.csv"
    out.parent.mkdir(exist_ok=True)
    out.write_bytes(b"".join(v1 + new))
    print(f"{len(v1) - 1} photos from v1 + {len(new)} new photos from v3 = {len(v1) - 1 + len(new)} -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
