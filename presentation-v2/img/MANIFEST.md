# Image manifest

`tools/build_data.py` makes these files from the repo data, so do not edit them by hand. Other tools make some folders in img/ (for example dial/), and this list does not cover them.
Rebuild: `uv run --script presentation-v2/tools/build_data.py`

## Sources and credits

| Source | Dataset | Licence | Credit |
|---|---|---|---|
| BRACOL | BRACOL coffee leaf images | CC BY 4.0 | Krohling, Esgario and Ventura, Mendeley Data, doi 10.17632/yy2k5y8mxg.1. Real leaf photos on a plain background. |
| Uganda | Uganda smartphone coffee leaf set | CC BY 4.0 | Chelangat, Anirwoth, Mayanja and Sserwadda (2025), Mendeley Data, doi 10.17632/k36wnd6knb.1. Smartphone photos from farms in Uganda, 256x256. |
| Kenya | Kenya JMuBEN coffee leaf sample | CC BY 4.0 | JMuBEN and JMuBEN2, Mutira plantation, Kirinyaga county, Mendeley Data doi 10.17632/tgv3zb82nd.1 and 10.17632/t2r6rszp5c.1 (CC BY). We used the Hugging Face copy Project-AgML/arabica_coffee_leaf_disease_classification (CC BY 4.0). The colours in this copy look shifted. |
| Synthetic | ShhS synthetic leaf renders (Blender) | CC BY 4.0 | This project rendered them from BRACOL train leaves, so they carry the BRACOL credit: Krohling, Esgario and Ventura, CC BY 4.0. |

## img/verdict/ (26 files, 461 KB)

Photos for the try-it demo and the hero: 16 BRACOL test photos and 10 Uganda photos from the 300-photo test set. Each one was picked by eye, and the script checks the rule behind each pick. The BRACOL photos show one leaf each on a plain background.

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/verdict/b1196.webp | 26.3 | BRACOL test photo 1196, healthy leaf, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1313.webp | 18.5 | BRACOL test photo 1313, other disease (cercospora), severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1329.webp | 18.6 | BRACOL test photo 1329, rust severity 2, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1422.webp | 29.3 | BRACOL test photo 1422, rust severity 2, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1443.webp | 20.4 | BRACOL test photo 1443, rust severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1493.webp | 28.4 | BRACOL test photo 1493, rust severity 3, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1508.webp | 21.0 | BRACOL test photo 1508, rust severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b1592.webp | 22.7 | BRACOL test photo 1592, rust severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b215.webp | 17.2 | BRACOL test photo 215, other disease (miner), severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b243.webp | 16.8 | BRACOL test photo 243, other disease (phoma), severity 3, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b598.webp | 30.5 | BRACOL test photo 598, rust severity 4, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b6.webp | 30.1 | BRACOL test photo 6, healthy leaf, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b610.webp | 21.7 | BRACOL test photo 610, other disease (phoma), severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b619.webp | 27.0 | BRACOL test photo 619, rust severity 1, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b70.webp | 22.0 | BRACOL test photo 70, other disease (miner), severity 2, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/b845.webp | 8.3 | BRACOL test photo 845, healthy leaf, 1200x600 | BRACOL | CC BY 4.0 |
| img/verdict/u_fi_00000.webp | 11.9 | Uganda field photo fi_00000 (healthy), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_00125.webp | 9.1 | Uganda field photo fi_00125 (healthy), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_00274.webp | 23.0 | Uganda field photo fi_00274 (healthy), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_00752.webp | 10.3 | Uganda field photo fi_00752 (rust), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01041.webp | 5.3 | Uganda field photo fi_01041 (rust), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01174.webp | 3.6 | Uganda field photo fi_01174 (rust), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01243.webp | 13.2 | Uganda field photo fi_01243 (rust), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01367.webp | 8.1 | Uganda field photo fi_01367 (phoma), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01588.webp | 5.2 | Uganda field photo fi_01588 (phoma), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |
| img/verdict/u_fi_01702.webp | 12.5 | Uganda field photo fi_01702 (phoma), 256x256 upsampled to 512x512 | Uganda | CC BY 4.0 |

## img/gap/ (3 files, 320 KB)

Sprite sheets for the tidy photos versus messy farms mosaic. generated.js (GAP) lists the tiles row by row.

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/gap/bracol.webp | 95.9 | Sprite sheet of 112 BRACOL photos (14 x 8 tiles of 128x64, 39% rust). Each tile is the whole photo, shrunk. Tiles run row by row | BRACOL | CC BY 4.0 |
| img/gap/kenya.webp | 31.5 | Sprite sheet of 32 random Kenya photos (8 x 4 tiles of 96x96, centre-cropped, same mix of groups as the set), row by row | Kenya | CC BY 4.0 |
| img/gap/uganda.webp | 192.7 | Sprite sheet of 112 random Uganda field photos (14 x 8 tiles of 128x128, same mix of rust, healthy and phoma as the set), row by row | Uganda | CC BY 4.0 |

## img/synth/ (1 files, 256 KB)

One mosaic of 240 synthetic renders. generated.js (SYNTH) lists the tiles row by row.

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/synth/mosaic.webp | 255.9 | Mosaic of 240 synthetic renders (20 x 12 tiles of 128x96, 120 from v1 and 120 from v2), row by row | Synthetic | CC BY 4.0 |

## img/unusable/ (10 files, 81 KB)

Two examples of each kind of photo that no model should judge: no leaf, tiny leaf, defocus, glare and dark.

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/unusable/dark_1.webp | 16.2 | Synthetic render u0541_dark_2, damage kind dark, 640x320 | Synthetic | CC BY 4.0 |
| img/unusable/dark_2.webp | 15.3 | Synthetic render u1520_dark_11, damage kind dark, 640x320 | Synthetic | CC BY 4.0 |
| img/unusable/defocus_1.webp | 2.4 | Synthetic render u0207_defocus_26, damage kind defocus, 640x320 | Synthetic | CC BY 4.0 |
| img/unusable/defocus_2.webp | 5.2 | Synthetic render u0815_defocus_25, damage kind defocus, 640x480 | Synthetic | CC BY 4.0 |
| img/unusable/glare_1.webp | 5.9 | Synthetic render u1006_glare_4, damage kind glare, 640x640 | Synthetic | CC BY 4.0 |
| img/unusable/glare_2.webp | 2.9 | Synthetic render u1015_glare_24, damage kind glare, 640x480 | Synthetic | CC BY 4.0 |
| img/unusable/no_leaf_1.webp | 7.5 | Synthetic render u0091_no_leaf_13, damage kind no_leaf, 640x640 | Synthetic | CC BY 4.0 |
| img/unusable/no_leaf_2.webp | 7.1 | Synthetic render u0404_no_leaf_27, damage kind no_leaf, 640x640 | Synthetic | CC BY 4.0 |
| img/unusable/tiny_1.webp | 9.6 | Synthetic render u0298_tiny_4, damage kind tiny, 640x320 | Synthetic | CC BY 4.0 |
| img/unusable/tiny_2.webp | 9.1 | Synthetic render u1337_tiny_3, damage kind tiny, 640x320 | Synthetic | CC BY 4.0 |

## img/severity/ (10 files, 149 KB)

Two leaves for each BRACOL severity level. Severity 0 is healthy. Levels 1 to 4 are leaves with rust only (no other disease marked).

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/severity/s0_693.webp | 11.1 | BRACOL train photo 693, healthy leaf, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s0_694.webp | 11.9 | BRACOL train photo 694, healthy leaf, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s1_1383.webp | 22.7 | BRACOL train photo 1383, pure rust, severity 1, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s1_1528.webp | 11.5 | BRACOL train photo 1528, pure rust, severity 1, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s2_1344.webp | 9.6 | BRACOL train photo 1344, pure rust, severity 2, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s2_1382.webp | 17.2 | BRACOL train photo 1382, pure rust, severity 2, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s3_1085.webp | 16.6 | BRACOL train photo 1085, pure rust, severity 3, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s3_1359.webp | 25.1 | BRACOL train photo 1359, pure rust, severity 3, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s4_1297.webp | 12.7 | BRACOL train photo 1297, pure rust, severity 4, 900x450 | BRACOL | CC BY 4.0 |
| img/severity/s4_1308.webp | 10.2 | BRACOL train photo 1308, pure rust, severity 4, 900x450 | BRACOL | CC BY 4.0 |

## img/pipeline/ (6 files, 218 KB)

Leaf 897 (a real BRACOL train leaf, rust severity 4 and leaf miner) at each step: the photo, the cut-out and three training renders.

| File | KB | What it is | Source | Licence |
|---|---:|---|---|---|
| img/pipeline/897_cutout.webp | 94.8 | Leaf 897 cut out of its photo, transparent background, same frame as the texture, 1400 px wide | BRACOL | CC BY 4.0 |
| img/pipeline/897_cutout_tex.webp | 45.1 | Same cut-out at 900 px wide, for a WebGL texture | BRACOL | CC BY 4.0 |
| img/pipeline/897_original.webp | 54.2 | BRACOL train photo 897 (rust severity 4 and leaf miner), 1600x800 | BRACOL | CC BY 4.0 |
| img/pipeline/v0897_closeup_1.webp | 3.5 | Synthetic training render v0897_closeup_1 of leaf 897 (sun_wet, closeup), native size 256x256 | Synthetic | CC BY 4.0 |
| img/pipeline/v0897_whole_0.webp | 8.9 | Synthetic training render v0897_whole_0 of leaf 897 (studio, whole), native size 896x672 | Synthetic | CC BY 4.0 |
| img/pipeline/v0897_whole_2.webp | 11.2 | Synthetic training render v0897_whole_2 of leaf 897 (studio, whole), native size 1024x512 | Synthetic | CC BY 4.0 |

Total: 1484 KB (1.45 MB) in 56 files.
