const CACHE_NAME = 'fridge-tycoon-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install the service worker and cache your 3 core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve the files from the cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
