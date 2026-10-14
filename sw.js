self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.pathname.endsWith('/api/status')) {
        event.respondWith(
            new Response(JSON.stringify({ status: "online", protocol: "HTTP/1.1" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );
    } 
    else if (url.pathname.endsWith('/api/hello')) {
        event.respondWith(
            new Response("Hello World!", {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            })
        );
    }
});
