const CACHE_NAME = "parks-report-v1";
const FILES_TO_CACHE = [
  "index.html",
  "history.html",
  "login.html",
  "admin.html",
  "style.css",
  "supabase.js",
  "app.js",
  "history.js",
  "login.js",
  "admin.js",
  "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
