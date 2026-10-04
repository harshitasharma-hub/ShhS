// Take the screenshots used in docs/accessibility-study.md.
//   node shots.mjs <before-url> <after-url> <out-folder>
// "before" is the page as it stood before the redesign (kept live until the new version is deployed).
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [BEFORE, AFTER, OUT] = process.argv.slice(2);
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });

async function page({ js = true } = {}) {
  const ctx = await browser.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  if (!js) await p.setJavaScriptEnabled(false);
  return p;
}
const shot = (p, name) => p.screenshot({ path: path.join(OUT, name), type: "jpeg", quality: 72 });

if (BEFORE) {
  const p = await page();
  await p.goto(BEFORE + "?lang=en", { waitUntil: "networkidle0" });
  await sleep(500);
  await shot(p, "before-home.jpg");
  await p.click(".thumbs button:nth-child(1)");
  await sleep(700);
  await shot(p, "before-answer.jpg");
  await p.close();
}
{
  const p = await page();
  await p.goto(AFTER + "?lang=sw", { waitUntil: "networkidle0" });
  await sleep(500);
  await shot(p, "after-home.jpg");
  await p.evaluate(() => { location.hash = "#/k/1"; });
  await sleep(500);
  await shot(p, "after-camera.jpg");
  await p.click("#shutter");
  await sleep(700);
  await shot(p, "after-looking.jpg");
  for (const [n, name] of [[1, "rust"], [2, "no-rust"], [3, "not-sure"]]) {
    await p.evaluate((h) => { location.hash = h; }, "#/" + n);
    await sleep(500);
    await shot(p, `after-${name}.jpg`);
  }
  await p.evaluate(() => { location.hash = "#/3/onyesha"; });
  await sleep(500);
  await shot(p, "after-person-card.jpg");
  await p.close();
}
{
  const p = await page({ js: false });
  await p.goto(AFTER, { waitUntil: "networkidle0" });
  await shot(p, "after-plain-page.jpg");
  await p.close();
}
await browser.close();
console.log("screenshots in", OUT, fs.readdirSync(OUT).map((f) => f + " " + Math.round(fs.statSync(path.join(OUT, f)).size / 1000) + " KB").join(", "));
