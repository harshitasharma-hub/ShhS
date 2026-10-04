// Build script. Bundles src/main.js into js/app.js as a classic script, so index.html also opens straight from disk (file://).
//   node build.mjs            minified build
//   node build.mjs --watch    rebuild on every change
// Also inlines the few files that must not be fetched at run time (file:// blocks fetch and WebGL cross-origin images):
// the 3D leaf texture, the render metadata and the list of background pictures.
// Run tools/build_data.py, tools/build_v3.py and tools/build_why.py first when runs, images or renders change.
import * as esbuild from 'esbuild';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';

const watch = process.argv.includes('--watch');
mkdirSync('src/data', { recursive: true });

const b64 = (f) => readFileSync(f).toString('base64');
const texture = 'img/pipeline/897_cutout_tex.webp';
const dialMeta = 'img/dial/dial_meta.json';
const platesDir = 'img/plates';
const plateFiles = existsSync(platesDir) ? readdirSync(platesDir).filter((f) => /\.webp$/.test(f)).sort() : [];
const inline = [
  `export const CUTOUT_TEX = ${existsSync(texture) ? JSON.stringify('data:image/webp;base64,' + b64(texture)) : 'null'};`,
  `export const DIAL_META = ${existsSync(dialMeta) ? readFileSync(dialMeta, 'utf8') : 'null'};`,
  `export const PLATE_FILES = ${JSON.stringify(plateFiles)};`,
].join('\n') + '\n';
writeFileSync('src/data/inline.js', inline);

if (!existsSync(texture)) console.warn('WARNING: ' + texture + ' is missing, so the 3D leaf will be off. Run: uv run tools/build_data.py');
if (!existsSync(dialMeta)) console.warn('WARNING: ' + dialMeta + ' is missing, so the scene section will be hidden.');
if (!plateFiles.length) console.warn('NOTE: ' + platesDir + ' has no pictures, so the 3D leaf shows a plain gradient behind it.');
for (const f of ['src/data/generated.js', 'src/data/v3.js', 'src/data/why.js']) {
  if (!existsSync(f)) console.warn(f + ' is missing. Run the scripts in tools/ (see README).');
}

const options = {
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: 'js/app.js',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  legalComments: 'none',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('watching src/ ...');
} else {
  await esbuild.build(options);
}
