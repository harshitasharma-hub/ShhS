// node tools/make_artifact.mjs
// Builds the claude.ai Artifact version: one page fragment with the CSS, JS and fonts inline.
// The images are published beside it (see the printed file list). Writes dist/artifact.html and artifact-test.html (a local preview).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');
let css = readFileSync(join(root, 'css/style.css'), 'utf8');
css = css.replace(/url\(\.\.\/fonts\/([a-z0-9-]+\.woff2)\) format\("woff2"\)/g, (m, f) => `url(data:font/woff2;base64,${readFileSync(join(root, 'fonts', f)).toString('base64')}) format("woff2")`);
const js = readFileSync(join(root, 'js/app.js'), 'utf8').replace(/<\/script/gi, '<\\/script');

let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
body = body.replace(/<script src="js\/app\.js" defer><\/script>/, '');

const out = `<title>Does this leaf have rust?</title>\n<style>\n${css}\n</style>\n${body.trim()}\n<script>\n${js}\n</script>\n`;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/artifact.html'), out);
const skeleton = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif;background:#fafafa}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
writeFileSync(join(root, 'artifact-test.html'), `${skeleton}\n${out}</body></html>`);

// The files to publish beside the page
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.webp$/.test(f) && files.push(relative(root, p)); });
walk(join(root, 'img'));
files.sort();
const total = files.reduce((n, f) => n + statSync(join(root, f)).size, 0);
console.log(`dist/artifact.html  ${(out.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`${files.length} image files, ${(total / 1024 / 1024).toFixed(2)} MB`);
writeFileSync(join(root, 'dist/artifact-files.json'), JSON.stringify(files.map((path) => ({ path, contentType: 'image/webp' }))));
