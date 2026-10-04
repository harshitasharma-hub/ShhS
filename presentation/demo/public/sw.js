// Offline copy of Kagua Jani. The demo is static, so after one visit with internet it works with no connection.
// - The page itself goes network-first, with a 3 second wait, then falls back to the saved copy (good on a weak link).
// - Photos and voice clips go cache-first. The page asks for the voice clips in the background after the worker starts.
// - No skipWaiting: a new version waits until old tabs close, so one visit never mixes old and new files.
// tools/build.py writes the version below from a hash of every cached file.
const VERSION = "kj-7e558d6a";
const CORE = [
  "./",
  "manifest.webmanifest",
  "favicon.svg",
  "samples/rust_yes_fi_01050.jpg",
  "samples/no_rust_fi_00422.jpg",
  "samples/not_sure_1_fi_00758.jpg",
  "samples/not_sure_2_fi_01524.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(CORE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Phones ask for audio in byte ranges. The cache holds whole files, so cut the range out here.
async function rangeFrom(request, cached) {
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") || "");
  if (!match) return cached;
  const body = await cached.arrayBuffer();
  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? Math.min(parseInt(match[2], 10), body.byteLength - 1) : body.byteLength - 1;
  return new Response(body.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${body.byteLength}`,
      "Content-Length": String(end - start + 1),
    },
  });
}

function pageNetworkFirst(request) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (response) => { if (!done) { done = true; resolve(response); } };
    const fallback = () => caches.match("./").then((cached) => finish(cached || Response.error()));
    const timer = setTimeout(fallback, 3000);
    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        const copy = response.clone();
        caches.open(VERSION).then((cache) => cache.put("./", copy));
        finish(response);
      })
      .catch(() => { clearTimeout(timer); fallback(); });
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(pageNetworkFirst(request));
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return request.headers.has("range") ? rangeFrom(request, cached) : cached;
      return fetch(request).then((response) => {
        if (response.ok && response.status === 200) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
