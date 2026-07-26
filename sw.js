/* ============================================================================
   INTO ACTION GROUP — service worker
   Caches the app shell so the app opens instantly and works offline.

   ★ When you change any file, bump CACHE_VERSION (e.g. v1 -> v2) so phones
     pick up the new version. That's the only edit you'll ever make here.
   ============================================================================ */
const CACHE_VERSION = "iag-v19";

// Precache the core app shell only. PDFs and the PDF.js viewer are large and
// cache on first use (they're not needed to boot the app).
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/content.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./assets/dawn-bg.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-16.png",
];

// Install: pre-cache the app shell.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: drop old caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy (chosen so content edits appear WITHOUT bumping CACHE_VERSION):
//  - Cross-origin (Zoom, aa.org, the Google Sheet, fonts): browser handles it.
//  - Static assets (icons, images, fonts): cache-first (they rarely change).
//  - Everything else — index.html, css, js incl. content.js, manifest, and
//    navigations: stale-while-revalidate. The cached copy loads instantly
//    (and offline), while a fresh copy is fetched in the background for next time.
function putInCache(req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // outbound + Google Sheet: let the browser handle it

  const isStaticAsset = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => putInCache(req, res)))
    );
    return;
  }

  // Stale-while-revalidate for app code/content and navigations.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fromNetwork = fetch(req).then((res) => putInCache(req, res)).catch(() => null);
      if (cached) { fromNetwork; return cached; }                         // instant; refresh in background
      return fromNetwork.then((res) => res || (req.mode === "navigate" ? caches.match("./index.html") : undefined));
    })
  );
});
