/* ============================================================================
   INTO ACTION GROUP — service worker
   Online opens fetch current app code; the last successful copy works offline.
   For a shell release, bump CACHE_VERSION and the ?v= URLs here and in index.html.
   ============================================================================ */
const CACHE_VERSION = "iag-v27";

// PDFs and their viewer cache on first use; they are not needed to open the app.
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css?v=27",
  "./assets/fonts/lora-latin-variable.woff2",
  "./assets/fonts/source-sans-3-latin-variable.woff2",
  "./js/content.js?v=27",
  "./js/app.js?v=27",
  "./manifest.webmanifest",
  "./assets/dawn-bg.png",
  "./assets/sun-corona-v1.webp",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-16.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // A new shell must not be populated from an old browser HTTP cache.
      .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("iag-v") && key !== CACHE_VERSION)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function remember(cache, request, response) {
  if (response.ok && response.status !== 206) {
    // Keep the worker alive until the write completes. A full cache must not
    // prevent a successfully fetched page from opening.
    try { await cache.put(request, response.clone()); } catch (e) {}
  }
  return response;
}

async function respond(request) {
  const cache = await caches.open(CACHE_VERSION);
  const url = new URL(request.url);
  const cached = await cache.match(request);
  const isStaticAsset = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
  if (isStaticAsset && cached) return cached;

  // App HTML, code and content must be fresh on this open, not the next one.
  // Bound the wait on an unreliable connection, then use the offline copy.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  let response;
  try {
    response = await fetch(request, { cache: "no-cache", signal: controller.signal });
  } catch (e) {
    // Offline or timed out: fall through to the cached copy below.
  } finally {
    clearTimeout(timeout);
  }
  if (response && response.ok) return remember(cache, request, response);
  if (cached) return cached;
  if (request.mode === "navigate") {
    const shell = await cache.match("./index.html");
    if (shell) return shell;
  }
  return response || new Response("This file is not available offline yet.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  // Outbound requests (Zoom, aa.org, the Google Sheet) use the browser normally.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(request));
});
