# Uganda smartphone coffee leaf set

Real field photos used only to test the rust yes or no model.

- Source: Chelangat, Anirwoth, Mayanja, Sserwadda (2025), Mendeley Data, doi 10.17632/k36wnd6knb.1, CC BY 4.0.
- Zip downloaded 2026-10-04, 26,024,910 bytes, sha256 ceab111e7b17744918e80aee1dffa26d19e5a0abeda53bc0a7dd73ff8faeb70a.
- What it is: smartphone photos from farms in Uganda, daylight and low light, one leaf each, 256x256 JPEG.
- What it does not cover: Arabica from other regions, whole plants, hands and field clutter at full size, and severity (no severity labels, so the severity column is empty).
- Known problems: 100 empty files in the Healthy folder and 2 in the rust folder. The authors added flips, rotations and brightness changes to balance classes. Copies that are flips, 90 degree turns or brightness changes were removed by image hash. Copies turned by other angles may remain.
- Use: test only. Never train on it.

Photos kept: 1712 (582 rust). Small balanced test set (`in_eval` = 1): 300.

Photos kept by label:

- healthy: 702
- phoma: 428
- rust: 582

Rebuild: `uv run scripts/prepare_field.py uganda`
