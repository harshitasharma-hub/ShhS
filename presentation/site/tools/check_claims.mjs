// npm run check
// 1. Every finding sentence on the page comes from src/lib/claims.js. Each claim has a test. This prints them all.
//    A failing claim means a new run changed the story: the page falls back to plain numbers, and the copy needs a rewrite.
// 2. Every image the page names exists.
// 3. No typographic dashes in the page text (plain hyphen only).
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { claims, facts, fmt3 } from '../src/lib/claims.js';
import { RUNS, META } from '../src/data/generated.js';

let bad = 0;
console.log(`\nRuns in the data: ${RUNS.length} (built ${META.generatedAt})\n`);
const F = facts();
for (const c of claims(F)) {
  console.log(`${c.ok ? 'HOLDS ' : 'FAILS '} ${c.id}\n        ${c.text}`);
  if (!c.ok) bad++;
}

// Images named in the page files
const root = new URL('..', import.meta.url).pathname;
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  if (['node_modules', 'img', 'fonts', 'js', '.git'].includes(f)) return;
  const p = join(d, f);
  statSync(p).isDirectory() ? walk(p) : /\.(html|js|css|md|mjs)$/.test(f) && files.push(p);
});
walk(root);
const missing = new Set();
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/img\/[A-Za-z0-9_\/.\-]+\.(?:webp|jpg|png)/g)) if (!existsSync(join(root, m[0]))) missing.add(`${m[0]}  (in ${f.replace(root, '')})`);
}
console.log(`\nImages: ${missing.size ? 'MISSING\n  ' + [...missing].join('\n  ') : 'every named image exists'}`);
bad += missing.size;

// Dashes
const dashRe = new RegExp('[' + String.fromCharCode(0x2010) + '-' + String.fromCharCode(0x2015) + String.fromCharCode(0x2212) + ']');
let dashes = 0;
for (const f of files) {
  if (f.endsWith('FACTS.md')) continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => { if (dashRe.test(line)) { dashes++; console.log(`DASH   ${f.replace(root, '')}:${i + 1}  ${line.trim().slice(0, 90)}`); } });
}
console.log(`Dashes: ${dashes ? dashes + ' found' : 'none'}`);
bad += dashes;
console.log(bad ? `\n${bad} problem(s).\n` : '\nAll checks pass.\n');
process.exit(bad ? 1 : 0);
