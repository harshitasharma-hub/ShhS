// Repeatable checks for the Kagua Jani demo page, run in a real Chrome.
//   cd presentation/demo/tools && npm install
//   python3 -m http.server 5294 --directory ../public &      (or use the live address)
//   node check.mjs http://localhost:5294/ [--out results.json]
// It tests what the design study claims: reflow, target size, contrast, keyboard focus, offline, no-script fallback, back button,
// text spacing, reduced motion, forced colours, audio length and page weight. It does NOT replace tests with farmers.
import fs from "node:fs";
import zlib from "node:zlib";
import puppeteer from "puppeteer-core";

const BASE = (process.argv[2] || "http://localhost:5294/").replace(/#.*$/, "");
const OUT = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const results = [];
function rec(id, name, pass, detail = "") {
  results.push({ id, name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${name}${detail ? "   (" + detail + ")" : ""}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STATES = [
  { name: "home", hash: "#/" },
  { name: "simulated camera", hash: "#/k/1" },
  { name: "answer 1 (rust)", hash: "#/1" },
  { name: "answer 2 (no rust)", hash: "#/2" },
  { name: "answer 3 (not sure)", hash: "#/3" },
  { name: "card to show a person", hash: "#/1/onyesha" },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--autoplay-policy=document-user-activation-required"] });

async function newPage({ width = 360, height = 640, js = true } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  if (!js) await page.setJavaScriptEnabled(false);
  page.errors = [];
  page.origins = new Set();
  page.on("console", (m) => { if (m.type() === "error") page.errors.push(m.text()); });
  page.on("pageerror", (e) => page.errors.push(String(e)));
  page.on("request", (r) => { try { const u = new URL(r.url()); if (u.protocol.startsWith("http")) page.origins.add(u.origin); } catch (e) {} });
  return page;
}
async function show(page, hash) {
  await page.evaluate((h) => { location.hash = h; }, hash);
  await sleep(250);
}

/* ---------- functions that run inside the page ---------- */
const inPage = {
  contrast() {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(",").map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
    const bgOf = (el) => {
      const chain = []; for (let e = el; e; e = e.parentElement) chain.push(e);
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = chain.length - 1; i >= 0; i--) { const c = parse(getComputedStyle(chain[i]).backgroundColor); if (c && c.a > 0) bg = over(c, bg); }
      return bg;
    };
    const out = []; const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode; if (!n.textContent.trim()) continue;
      const el = n.parentElement; if (seen.has(el)) continue; seen.add(el);
      let hidden = false; for (let e = el; e; e = e.parentElement) { if (e.hidden || getComputedStyle(e).display === "none" || getComputedStyle(e).visibility === "hidden") { hidden = true; break; } }
      if (hidden || el.closest("svg")) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el); const bg = bgOf(el); const fg = over(parse(cs.color), bg);
      const ratio = (Math.max(L(fg), L(bg)) + 0.05) / (Math.min(L(fg), L(bg)) + 0.05);
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10);
      out.push({ text: n.textContent.trim().slice(0, 36), ratio: Math.round(ratio * 100) / 100, size, large: size >= 24 || (size >= 18.66 && weight >= 700), el: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") });
    }
    return out;
  },
  targets() {
    const out = [];
    document.querySelectorAll("button, a[href], summary, input, [role=button]").forEach((el) => {
      let hidden = false; for (let e = el; e; e = e.parentElement) { if (e.hidden || getComputedStyle(e).display === "none") { hidden = true; break; } }
      if (hidden) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      out.push({ name: (el.getAttribute("aria-label") || el.textContent || el.id).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) });
    });
    return out;
  },
  overflow() {
    const bad = [];
    document.querySelectorAll("button, a, summary, p, h1, h2, h3, li").forEach((el) => {
      let hidden = false; for (let e = el; e; e = e.parentElement) { if (e.hidden || getComputedStyle(e).display === "none") { hidden = true; break; } }
      if (hidden) return;
      const cs = getComputedStyle(el);
      if ((cs.overflow === "hidden" || el.tagName === "BUTTON") && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) bad.push((el.id || el.textContent.trim().slice(0, 24)));
    });
    return { hscroll: document.documentElement.scrollWidth > window.innerWidth + 1, clipped: bad };
  },
};

try {
  /* ---- 1. load, console, third parties, page weight ---- */
  {
    const page = await newPage();
    const sizes = []; page.on("response", async (r) => { try { const b = await r.buffer(); const text = /text|javascript|json|svg|xml/.test(r.headers()["content-type"] || ""); const sent = Number(r.headers()["content-length"] || 0); sizes.push({ url: r.url().replace(BASE, "/"), bytes: b.length, wire: text ? zlib.brotliCompressSync(b).length : b.length, sent }); } catch (e) {} });
    await page.setCacheEnabled(false);
    await page.goto(BASE, { waitUntil: "networkidle0" });
    await sleep(1500);
    rec("L01", "No console errors or script errors on load", page.errors.length === 0, page.errors.join(" | ").slice(0, 160));
    const third = [...page.origins].filter((o) => o !== new URL(BASE).origin);
    rec("L02", "No request to any other website", third.length === 0, third.join(", "));
    const total = sizes.reduce((s, x) => s + x.bytes, 0);
    const wire = sizes.reduce((s, x) => s + x.wire, 0);
    const byType = (re) => sizes.filter((x) => re.test(x.url)).reduce((s, x) => s + x.wire, 0);
    rec("L03", "First visit moves at most 170 KB over the network, with text compressed (research budget 160 KB)", wire <= 170000,
      `${(wire / 1000).toFixed(0)} KB on the wire, ${(total / 1000).toFixed(0)} KB raw, ${sizes.length} files: page ${(byType(/\/$|index\.html/) / 1000).toFixed(0)}, photos ${(byType(/samples/) / 1000).toFixed(0)}, voice ${(byType(/voice/) / 1000).toFixed(0)}, other ${((wire - byType(/\/$|index\.html|samples|voice/)) / 1000).toFixed(0)} KB`);
    const lang = await page.evaluate(() => document.documentElement.lang);
    rec("L04", "Page language is Swahili by default", lang === "sw", lang);
    const autoplay = await page.evaluate(() => { const a = document.getElementById("voice"); return { src: a.getAttribute("src"), paused: a.paused }; });
    rec("L05", "Nothing plays by itself when the page opens", !autoplay.src && autoplay.paused, JSON.stringify(autoplay));
    await page.close();
  }

  /* ---- 2. reflow at 320 px, targets, contrast, per screen ---- */
  for (const w of [320, 360]) {
    const page = await newPage({ width: w, height: w === 320 ? 568 : 640 });
    await page.goto(BASE, { waitUntil: "networkidle0" });
    for (const s of STATES) {
      await show(page, s.hash);
      const o = await page.evaluate(inPage.overflow);
      rec(`R${w}`, `No sideways scrolling and no clipped text at ${w} px wide: ${s.name}`, !o.hscroll && o.clipped.length === 0, o.hscroll ? "sideways scroll" : o.clipped.join(", "));
    }
    await page.close();
  }
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    let small = [], tiny = [], worst = 99, worstAnswer = 99, belowAA = [];
    for (const s of STATES) {
      await show(page, s.hash);
      (await page.evaluate(inPage.targets)).forEach((t) => { if (t.w < 48 || t.h < 48) small.push(`${s.name}: ${t.name} ${t.w}x${t.h}`); if (t.w < 24 || t.h < 24) tiny.push(`${s.name}: ${t.name} ${t.w}x${t.h}`); });
      (await page.evaluate(inPage.contrast)).forEach((c) => {
        worst = Math.min(worst, c.ratio);
        const need = c.large ? 3 : 4.5;
        if (c.ratio < need) belowAA.push(`${s.name}: "${c.text}" ${c.ratio}:1`);
        if (["verdict", "next"].some((id) => c.el.endsWith("#" + id))) worstAnswer = Math.min(worstAnswer, c.ratio);
      });
    }
    rec("T01", "Every control is at least 24 by 24 CSS px (WCAG 2.2 AA 2.5.8)", tiny.length === 0, tiny.join("; "));
    rec("T02", "Every control is at least 48 by 48 CSS px (Android guidance)", small.length === 0, small.join("; ").slice(0, 300));
    rec("C01", "All text meets AA contrast (4.5:1, or 3:1 for large text)", belowAA.length === 0, belowAA.join("; ").slice(0, 300) || `lowest ${worst}:1`);
    rec("C02", "The answer word and next-step line reach AAA (7:1) on every answer screen", worstAnswer >= 7, `lowest ${worstAnswer}:1`);
    await page.close();
  }

  /* ---- 2b. the answer fits one screen on a 360 x 640 phone ---- */
  {
    const page = await newPage({ width: 360, height: 640 });
    await page.goto(BASE, { waitUntil: "networkidle0" });
    for (const hash of ["#/1", "#/2", "#/3"]) {
      await show(page, hash);
      const f = await page.evaluate(() => {
        const r = (id) => document.getElementById(id).getBoundingClientRect();
        return { nextBottom: Math.round(r("next").bottom), actionsTop: Math.round(document.querySelector(".actions").getBoundingClientRect().top), againBottom: Math.round(r("again").bottom), vh: innerHeight };
      });
      rec("F01", `On a 360 by 640 phone the answer, the next step and all three buttons fit without scrolling: ${hash}`, f.nextBottom <= f.actionsTop + 1 && f.againBottom <= f.vh, JSON.stringify(f));
    }
    await show(page, "#/k/1");
    const g = await page.evaluate(() => ({ shutterBottom: Math.round(document.getElementById("shutter").getBoundingClientRect().bottom), vh: innerHeight }));
    rec("F02", "On a 360 by 640 phone the simulated camera and its shutter fit without scrolling", g.shutterBottom <= g.vh, JSON.stringify(g));
    await page.close();
  }

  /* ---- 3. keyboard: focus visible, order, escape ---- */
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const stops = []; let bad = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const f = await page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
        return { id: (e.getAttribute("aria-label") || e.textContent || e.id).trim().slice(0, 24), ow: parseFloat(cs.outlineWidth), os: cs.outlineStyle, top: Math.round(r.top + scrollY), match: e.matches(":focus-visible") };
      });
      if (!f) break;
      if (stops.length && stops[0].id === f.id && i > 2) break;
      stops.push(f);
      if (!(f.ow >= 2 && f.os !== "none") || !f.match) bad.push(f.id);
    }
    rec("K01", "Every tab stop on the home screen shows a focus ring of 2 px or more", stops.length > 0 && bad.length === 0, `${stops.length} stops${bad.length ? "; missing on " + bad.join(", ") : ""}`);
    rec("K02", "The home screen has no more than 16 tab stops", stops.length <= 16, `${stops.length}`);
    await page.keyboard.press("Enter");
    await sleep(200);
    await show(page, "#/3");
    await page.keyboard.press("Escape"); await sleep(250);
    const screen = await page.evaluate(() => document.body.getAttribute("data-screen"));
    rec("K03", "Escape leaves an answer and returns to the leaf list", screen === "home", screen);
    await page.close();
  }

  /* ---- 4. the simulated camera, back button, deep link, title, focus ---- */
  {
    const page = await newPage();
    await page.evaluateOnNewDocument(() => { window.__gum = 0; if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => { window.__gum++; return Promise.reject(new Error("blocked")); }; });
    await page.goto(BASE, { waitUntil: "networkidle0" });
    await page.click(".thumb:nth-child(3)"); await sleep(300);
    const cam = await page.evaluate(() => {
      const vis = (el) => !!el && !el.hidden && el.offsetParent !== null;
      return { screen: document.body.getAttribute("data-screen"), title: document.title, badge: vis(document.querySelector(".badge")) ? document.querySelector(".badge").textContent : "", note: vis(document.querySelector(".simnote")), focus: document.activeElement.id, spoiler: /Sina uhakika|Lina kutu|Halina kutu/.test(document.title) };
    });
    rec("M01", "A sample leaf opens the simulated camera, labelled as an example, without giving the answer away", cam.screen === "camera" && cam.badge === "Mfano tu" && cam.note && cam.focus === "cam-title" && !cam.spoiler, JSON.stringify(cam));
    const t0 = Date.now();
    await page.click("#shutter"); await sleep(350);
    const busy = await page.evaluate(() => ({ analysis: !document.getElementById("analysis").hidden, text: document.getElementById("analysis-text").textContent, disabled: document.getElementById("shutter").disabled, live: document.getElementById("cam-status").textContent }));
    rec("M02", "After the shutter a short 'looking at the leaf' step shows, the shutter is off and a screen reader hears it", busy.analysis && busy.disabled && busy.text.length > 5 && busy.live === busy.text, JSON.stringify(busy));
    await page.waitForFunction(() => document.body.getAttribute("data-screen") === "result", { timeout: 4000 });
    const took = Date.now() - t0;
    rec("M03", "The answer opens between 1.2 and 2.5 seconds after the shutter", took >= 1200 && took <= 2500, `${took} ms`);
    const a = await page.evaluate(() => ({ v: document.getElementById("verdict").textContent, title: document.title, focus: document.activeElement.id, src: (document.getElementById("voice").getAttribute("src") || "") }));
    rec("N01", "The answer sets the page title and moves focus to the answer", a.title.includes(a.v) && a.focus === "verdict", JSON.stringify({ title: a.title, focus: a.focus }));
    rec("N02", "The answer plays only the short answer clip (under 3 s), not the long one", /voice\/not_sure\.mp3$/.test(a.src), a.src);
    rec("M04", "The simulation never asks the phone for the real camera", (await page.evaluate(() => window.__gum)) === 0, "getUserMedia calls: 0");
    await page.goBack(); await sleep(300);
    const b = await page.evaluate(() => document.body.getAttribute("data-screen"));
    rec("N03", "The phone's back button goes from the answer to the camera, and again to the leaf list", b === "camera" && (await (async () => { await page.goBack(); await sleep(300); return page.evaluate(() => document.body.getAttribute("data-screen")); })()) === "home", b);
    await page.goForward(); await sleep(300); await page.goForward(); await sleep(300);
    const c2 = await page.evaluate(() => document.body.getAttribute("data-screen"));
    rec("N04", "Forward returns to the same answer", c2 === "result", c2);
    await page.click("#again"); await sleep(300);
    const nxt = await page.evaluate(() => ({ screen: document.body.getAttribute("data-screen"), hash: location.hash }));
    rec("M05", "'Another leaf' opens the camera with the next sample, so all four answers can be shown in turn", nxt.screen === "camera" && nxt.hash === "#/k/4", JSON.stringify(nxt));
    await page.close();
    const fresh = await newPage();
    await fresh.goto(BASE + "#/2", { waitUntil: "networkidle0" }); await sleep(300);
    const d = await fresh.evaluate(() => ({ v: document.getElementById("verdict").textContent, voice: document.getElementById("voice").getAttribute("src") }));
    rec("N05", "A link to one answer opens it directly, with no sound", d.v === "Halina kutu" && !d.voice, JSON.stringify(d));
    await fresh.close();
  }

  /* ---- 5. language switch, labels, alt text ---- */
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const names = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll("img").forEach((i) => { if (!i.hasAttribute("alt")) bad.push("img " + i.src.split("/").pop()); });
      document.querySelectorAll("button").forEach((b) => { let hidden = false; for (let e = b; e; e = e.parentElement) if (e.hidden) hidden = true; if (hidden) return; if (!(b.getAttribute("aria-label") || b.textContent.trim() || b.querySelector("img[alt]:not([alt=''])"))) bad.push("button " + b.id); });
      return bad;
    });
    rec("A01", "Every image has an alt attribute and every button has a name", names.length === 0, names.join(", "));
    const cardNames = await page.evaluate(() => [...document.querySelectorAll(".thumb")].map((c) => c.querySelector("img").alt));
    rec("A02", "The four sample leaf buttons are named with a description of the photo", cardNames.length === 4 && cardNames.every((t) => t.length > 12), cardNames.join(" | ").slice(0, 200));
    await page.click("#lang"); await sleep(250);
    const en = await page.evaluate(() => ({ lang: document.documentElement.lang, ask: document.getElementById("ask").textContent, sound: document.getElementById("sound").hidden, intro: document.getElementById("intro").hidden, btnLang: document.getElementById("lang").getAttribute("lang") }));
    rec("A03", "The English switch changes the page language, hides the voice controls and tags the button language", en.lang === "en" && en.sound && en.intro && en.btnLang === "sw", JSON.stringify(en));
    await page.close();
  }

  /* ---- 6. user preferences: reduced motion, forced colours, text spacing, big text ---- */
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await show(page, "#/k/1");
    await page.click("#shutter"); await sleep(500);
    const anim = await page.evaluate(() => document.getAnimations().length);
    rec("P01", "With reduced motion on, nothing animates, even while the camera step runs", anim === 0, `${anim} animations`);
    await show(page, "#/1");
    const cdp = await page.createCDPSession();
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "active" }] });
    const fc = await page.evaluate(() => [...document.querySelectorAll(".pill, .round")].filter((e) => !e.hidden && e.offsetParent).map((e) => parseFloat(getComputedStyle(e).borderTopWidth)));
    rec("P02", "With forced colours on, buttons keep a visible border", fc.length > 0 && fc.every((w) => w >= 2), fc.join(","));
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "none" }, { name: "prefers-reduced-motion", value: "no-preference" }] });
    for (const hash of ["#/", "#/3", "#/3/onyesha"]) {
      await show(page, hash);
      await page.addStyleTag({ content: "*{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p{margin-bottom:2em !important}", id: "spacing" });
      await sleep(150);
      const o = await page.evaluate(inPage.overflow);
      rec("P03", `Text spacing overrides (WCAG 1.4.12) break nothing: ${hash}`, !o.hscroll && o.clipped.length === 0, o.hscroll ? "sideways scroll" : o.clipped.join(", "));
      await page.evaluate(() => document.getElementById("spacing") && document.getElementById("spacing").remove());
    }
    await page.evaluate(() => { document.documentElement.style.fontSize = "225%"; });
    for (const hash of ["#/", "#/3"]) {
      await show(page, hash);
      const o = await page.evaluate(inPage.overflow);
      rec("P04", `Text at double size causes no sideways scroll or clipping: ${hash}`, !o.hscroll && o.clipped.length === 0, o.hscroll ? "sideways scroll" : o.clipped.join(", "));
    }
    await page.close();
  }

  /* ---- 7. audio: length of every clip ---- */
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const durations = await page.evaluate(async () => {
      const names = ["intro", "rust", "rust_full", "no_rust", "no_rust_full", "not_sure", "not_sure_full"];
      const out = {};
      for (const n of names) {
        out[n] = await new Promise((res) => { const a = new Audio("voice/" + n + ".mp3"); a.addEventListener("loadedmetadata", () => res(Math.round(a.duration * 10) / 10)); a.addEventListener("error", () => res(-1)); });
      }
      return out;
    });
    const shortOk = ["rust", "no_rust", "not_sure"].every((k) => durations[k] > 0 && durations[k] <= 3);
    rec("V01", "The three short answer clips last 3 seconds or less (WCAG 1.4.2)", shortOk, JSON.stringify(durations));
    rec("V02", "Every clip loads and none is longer than 10 seconds", Object.values(durations).every((d) => d > 0 && d <= 10), "");
    await page.close();
  }

  /* ---- 8. no scripts: the plain page ---- */
  {
    const page = await newPage({ js: false });
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const html = await page.content();
    const snap = await page.accessibility.snapshot();
    const flat = []; (function walk(n) { if (!n) return; flat.push(n); (n.children || []).forEach(walk); })(snap);
    const links = flat.filter((n) => n.role === "link" && /MP3/.test(n.name || "")).length;
    const imgs = flat.filter((n) => n.role === "image").length;
    const heads = flat.filter((n) => n.role === "heading").map((n) => n.name);
    const texts = ["Lina kutu", "Halina kutu", "Sina uhakika"].every((t) => html.includes(t));
    rec("S01", "With scripts off, all four answers are readable as plain text with photos and sound links", links === 4 && imgs >= 4 && texts, `${links} sound links, ${imgs} images, headings: ${heads.slice(0, 6).join(" / ")}`);
    const shot = BASE.startsWith("http://localhost") ? "/tmp/kj-noscript.png" : null;
    if (shot) await page.screenshot({ path: shot, fullPage: false });
    await page.close();
  }

  /* ---- 9. offline: first visit online, then no connection ---- */
  {
    const page = await newPage();
    await page.goto(BASE, { waitUntil: "networkidle0" });
    let ready = true;
    try { await page.waitForFunction(() => !document.getElementById("offline").hidden, { timeout: 15000 }); } catch (e) { ready = false; }
    rec("O01", "After the first visit the page says it works without internet", ready, "");
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await sleep(800);
    const off = await page.evaluate(async () => {
      const home = !document.getElementById("home").hidden && document.querySelectorAll(".thumb").length === 4;
      const photo = [...document.querySelectorAll(".thumb img")].every((i) => i.complete && i.naturalWidth > 0);
      const ctrl = !!navigator.serviceWorker.controller;
      const audio = await Promise.all(["intro", "rust", "rust_full", "no_rust", "no_rust_full", "not_sure", "not_sure_full"].map((n) => fetch("voice/" + n + ".mp3").then((r) => r.arrayBuffer()).then((b) => b.byteLength).catch(() => 0)));
      return { home, photo, ctrl, audio };
    });
    rec("O02", "With no connection the page opens, shows the four photos and the worker is in control", off.home && off.photo && off.ctrl, JSON.stringify({ home: off.home, photo: off.photo, ctrl: off.ctrl }));
    rec("O03", "With no connection all seven voice clips are still available", off.audio.every((b) => b > 2000), off.audio.join(","));
    await page.click(".thumb:nth-child(1)"); await sleep(300);
    await page.click("#shutter");
    await page.waitForFunction(() => document.body.getAttribute("data-screen") === "result", { timeout: 4000 });
    const v = await page.evaluate(() => document.getElementById("verdict").textContent);
    rec("O04", "With no connection the whole flow still works: camera, shutter, answer", v === "Lina kutu", v);
    await page.close();
  }
} catch (e) {
  rec("X00", "The check script ran to the end", false, String(e).slice(0, 200));
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length} of ${results.length} checks passed.`);
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ url: BASE, when: new Date().toISOString(), results }, null, 2));
process.exit(failed.length ? 1 : 0);
