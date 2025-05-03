self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('weathrly-cache').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './main.js',
        './weatherbaground.jpg',
        'https://cdn.tailwindcss.com',
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
