// Build script. Bundles src/main.js into dist/app.js as a classic script,
// so index.html also works when opened straight from disk (file://).
//   node build.mjs            one-off dev build
//   node build.mjs --watch    rebuild on change
//   node build.mjs --prod     minified build, plus shhs-talk.html (one file)
import * as esbuild from 'esbuild';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const args = new Set(process.argv.slice(2));
const prod = args.has('--prod');
const watch = args.has('--watch');

// Copy the self-hosted fonts once, so the page needs no network.
const fontSources = [
  ['node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2', 'fonts/bricolage-grotesque.woff2'],
  ['node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', 'fonts/instrument-sans.woff2'],
  ['node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2', 'fonts/dm-mono-400.woff2'],
  ['node_modules/@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2', 'fonts/dm-mono-500.woff2'],
];
mkdirSync('fonts', { recursive: true });
for (const [from, to] of fontSources) {
  if (!existsSync(to) && existsSync(from)) cpSync(from, to);
}

const options = {
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: 'dist/app.js',
  sourcemap: prod ? false : 'inline',
  minify: prod,
  legalComments: 'none',
  loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text', '.jpg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl' },
  logLevel: 'info',
};

// Pieces shared by the one-file builds: fonts as data URIs, the stylesheet, the bundled script.
function parts() {
  const b64 = (f) => readFileSync(f).toString('base64');
  const face = (family, file, weight, extra = '') =>
    `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${b64(file)}) format("woff2");font-weight:${weight};${extra}font-display:swap}`;
  const fonts = [
    face('Bricolage', 'fonts/bricolage-grotesque.woff2', '200 800', 'font-stretch:75% 100%;'),
    face('Instrument', 'fonts/instrument-sans.woff2', '400 700'),
    face('DMMono', 'fonts/dm-mono-400.woff2', '400'),
    face('DMMono', 'fonts/dm-mono-500.woff2', '500'),
  ].join('\n');
  const css = readFileSync('styles.css', 'utf8').replace(/@font-face\s*\{[^}]*\}/g, '');
  const js = readFileSync('dist/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
  return { fonts, css, js };
}

// One file you can email, drop in a chat, or open from a USB stick.
function singleFile() {
  const { fonts, css, js } = parts();
  let html = readFileSync('index.html', 'utf8');
  html = html
    .replace(/\s*<link rel="preload"[^>]*>/g, '')
    .replace('<link rel="stylesheet" href="./styles.css">', () => `<style>\n${fonts}\n${css}\n</style>`)
    .replace('<script src="./dist/app.js" defer></script>', () => `<script>\n${js}\n</script>`);
  writeFileSync('shhs-talk.html', html);
  console.log(`shhs-talk.html  ${(html.length / 1024 / 1024).toFixed(2)} MB`);
}

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching src/ ...');
} else {
  await esbuild.build(options);
  if (prod) singleFile();
}
