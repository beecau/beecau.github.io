let customHtmlContent = "<h1>Default Server Page</h1>";

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_CONTENT') {
        customHtmlContent = event.data.payload;
    }
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname === '/virtual-server') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'HTTP_LOG',
                    method: event.request.method,
                    url: url.href,
                    headers: [...event.request.headers.entries()]
                });
            });
        });

        event.respondWith(new Response(customHtmlContent, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Powered-By': 'Browser-ServiceWorker-HTTP/1.1',
                'Server': 'Custom-JS-SW-Engine'
            }
        }));
    }
});
