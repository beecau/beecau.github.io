const SCOPE_PREFIX = '/virtual-forum/';
let memoryPosts = [
    { text: "System initialized. Supervised Autocracy protocols standing by.", time: Date.now() }
];
const MAX_MEMORY_POSTS = 50; // Auto-eviction limit when buffer gets full

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith(SCOPE_PREFIX)) {
        event.respondWith(handleServerRequest(event.request));
    }
});

async function handleServerRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(SCOPE_PREFIX, '');
    const method = request.method;

    if (path === 'api/posts') {
        if (method === 'GET') {
            return new Response(JSON.stringify(memoryPosts), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'X-Http-Server': 'BrowserSW/1.1' }
            });
        } 
        
        if (method === 'POST') {
            try {
                const body = await request.json();
                if (body.text) {
                    memoryPosts.push({ text: body.text, time: Date.now() });
                    
                    // Evict oldest messages if memory quota approaches limit
                    if (memoryPosts.length > MAX_MEMORY_POSTS) {
                        memoryPosts.shift();
                    }
                }
                return new Response(JSON.stringify({ status: 'saved', count: memoryPosts.length }), {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: 'Malformed payload' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
    }

    return new Response('<h1>404 Not Found in Service Worker Memory</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
    });
}
