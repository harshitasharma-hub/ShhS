// What the two image steps show. Every file name here is made by tools/prepare_assets.py.
// Labels come from BRACOL (data/bracol/manifest.csv). All source leaves are in the train split.

// The same leaf, BRACOL 897 (rust, severity 4), in seven worlds.
// `clean` is what Blender writes. `phone` is the same image after the phone effects.
export const WORLDS = [
  { key: 'overcast', name: 'Overcast', clean: 'render_overcast', phone: 'world_overcast' },
  { key: 'sun', name: 'Sun', clean: 'render_sun', phone: 'world_sun' },
  { key: 'golden', name: 'Golden hour', clean: 'render_golden', phone: 'world_golden' },
  { key: 'shade', name: 'Shade', clean: 'render_shade', phone: 'world_shade' },
  { key: 'backlit', name: 'Backlit', clean: 'render_backlit', phone: 'world_backlit' },
  { key: 'rain', name: 'Rain', clean: 'render_rain', phone: 'world_rain' },
  { key: 'afterrain', name: 'After rain', clean: 'render_afterrain', phone: 'world_afterrain' },
];
export const FIRST_WORLD = 'golden';
export const REAL_PHOTO = 'real_897';

// The line under the scene picker. It changes when the phone effects switch changes.
export const WORLD_NOTE = 'The spots are real pixels from the photo. Light, weather and background are new.';
export const FX_NOTE = 'Phone effects add noise, blur and JPEG, like a cheap phone.';

// Nine renders from nine different BRACOL leaves, in the order the grid reads.
// leaf: the BRACOL leaf the render was made from. cls: healthy, rust or other.
// `other` means a look-alike problem, and the label is still "no rust".
export const LABELED = [
  { img: 'lab_960', leaf: 960, cls: 'healthy', label: 'Healthy', scene: 'Overcast', alt: 'Healthy coffee leaf in overcast light' },
  { img: 'lab_891', leaf: 891, cls: 'healthy', label: 'Healthy', scene: 'Sun', alt: 'Healthy coffee leaf in sun' },
  { img: 'lab_1664', leaf: 1664, cls: 'rust', label: 'Rust, severity 1', scene: 'Golden hour', alt: 'Coffee leaf with one small rust spot, golden hour' },
  { img: 'lab_1741', leaf: 1741, cls: 'rust', label: 'Rust, severity 2', scene: 'Shade', alt: 'Coffee leaf with rust, severity 2, in shade' },
  { img: 'lab_1046', leaf: 1046, cls: 'rust', label: 'Rust, severity 3', scene: 'After rain', alt: 'Wet coffee leaf with rust, severity 3, after rain' },
  { img: 'world_rain', leaf: 897, cls: 'rust', label: 'Rust, severity 4', scene: 'Rain', alt: 'Coffee leaf with rust, severity 4, with water drops in rain' },
  { img: 'lab_895', leaf: 895, cls: 'other', label: 'No rust, leaf miner', scene: 'Backlit', alt: 'Coffee leaf with leaf miner damage, backlit' },
  { img: 'lab_1016', leaf: 1016, cls: 'other', label: 'No rust, cercospora', scene: 'Overcast', alt: 'Coffee leaf with a cercospora spot, overcast' },
  { img: 'lab_365', leaf: 365, cls: 'other', label: 'No rust, phoma', scene: 'Sun', alt: 'Coffee leaf with a dark phoma spot, in sun' },
];

// Photos the model should not answer. They test the "not sure" answer.
export const REFUSE = [
  { img: 'bad_dark', cls: 'unsure', label: 'Not sure', scene: 'Too dark', alt: 'A coffee leaf in the dark' },
  { img: 'bad_glare', cls: 'unsure', label: 'Not sure', scene: 'Glare', alt: 'A coffee leaf washed out by glare' },
  { img: 'bad_defocus', cls: 'unsure', label: 'Not sure', scene: 'Out of focus', alt: 'A blurred coffee leaf' },
  { img: 'bad_cropped', cls: 'unsure', label: 'Not sure', scene: 'Cropped', alt: 'A close crop that cuts the leaf' },
  { img: 'bad_no_leaf', cls: 'unsure', label: 'Not sure', scene: 'No leaf', alt: 'Scattered leaves and soil, with no single leaf to judge' },
  { img: 'bad_tiny', cls: 'unsure', label: 'Not sure', scene: 'Leaf too small', alt: 'A leaf too small in the frame' },
];
