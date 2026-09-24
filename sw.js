const CACHE_NAME = 'cheerpj-mc-server-v2';
const STATIC_ASSETS = [
    './index.html',
    './minecraft_server.jar'
];

// Install event: cache core files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event: clean up outdated cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: Runtime caching strategy for CheerpJ CDN components + Cache-first for local assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // If CheerpJ is fetching runtime binaries or jars from its CDN, cache them dynamically
    if (url.origin.includes('leaningtech.com')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => {
                        // Fallback to cache if network drops
                        return cachedResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else {
        // Standard cache-first strategy for local application files
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
