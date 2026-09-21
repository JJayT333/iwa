/* ============================================================================
   INTO ACTION GROUP — service worker

   Update model
   - CACHE_VERSION is the single cache name. Bump it (and the matching ?v=
     numbers here and in index.html) for every deploy: `scripts/release.sh 29`.
   - install: precache the app shell, then skipWaiting so the new worker
     takes over without waiting for old tabs to close.
   - activate: delete every cache that is not CACHE_VERSION, then claim clients.
     The page reloads once on controllerchange (see js/app.js).
   - fetch: navigation/HTML, CSS, JS, JSON and the manifest are network-first
     with an offline fallback. Images, fonts and icons are cache-first with a
     background refresh (stale-while-revalidate).
   ============================================================================ */
const CACHE_VERSION = "iag-v28";
const NETWORK_TIMEOUT_MS = 6000;

// PDFs and their viewer cache on first use; they are not needed to open the app.
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css?v=28",
  "./assets/fonts/lora-latin-variable.woff2",
  "./assets/fonts/source-sans-3-latin-variable.woff2",
  "./js/content.js?v=28",
  "./js/app.js?v=28",
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

const STATIC_ASSET = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|otf)$/i;

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
        .filter((key) => key !== CACHE_VERSION)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Allow the page to ask a waiting worker to activate immediately.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

async function remember(cache, request, response) {
  if (response && response.ok && response.status !== 206) {
    // Keep the worker alive until the write completes. A full cache must not
    // prevent a successfully fetched page from opening.
    try { await cache.put(request, response.clone()); } catch (e) {}
  }
  return response;
}

// Bound the wait on an unreliable connection so the offline copy can be used.
async function fetchWithTimeout(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  try {
    return await fetch(request, { cache: "no-cache", signal: controller.signal });
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Images, fonts, icons: serve the cached copy at once and refresh it in the
// background; fetch from the network when there is no cached copy yet.
async function staleWhileRevalidate(cache, request) {
  const cached = await cache.match(request);
  const refresh = fetch(request).then((response) => remember(cache, request, response)).catch(() => null);
  if (cached) return cached;
  const response = await refresh;
  return response || offlineResponse();
}

// HTML, CSS, JS, JSON, manifest: the network copy wins; the cached copy is the
// offline fallback; a navigation with nothing cached gets the app shell.
async function networkFirst(cache, request) {
  const response = await fetchWithTimeout(request);
  if (response && response.ok) return remember(cache, request, response);
  const cached = await cache.match(request);
  if (cached) return cached;
  if (request.mode === "navigate") {
    const shell = (await cache.match("./index.html")) || (await cache.match("./"));
    if (shell) return shell;
  }
  return response || offlineResponse();
}

function offlineResponse() {
  return new Response("This file is not available offline yet.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

async function respond(request) {
  const cache = await caches.open(CACHE_VERSION);
  const url = new URL(request.url);
  if (request.mode !== "navigate" && STATIC_ASSET.test(url.pathname)) {
    return staleWhileRevalidate(cache, request);
  }
  return networkFirst(cache, request);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  // Outbound requests (Zoom, aa.org, the Google Sheet) use the browser normally.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(request));
});
