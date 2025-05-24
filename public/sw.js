self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installed');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activated');
  self.clients.claim(); // Control clients right away
});

self.addEventListener('fetch', event => {
  // Optional caching logic placeholder
  // Example: add offline fallback in future
  // event.respondWith(fetch(event.request));
});
