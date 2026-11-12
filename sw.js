/* Dr. Murshida K K — app helper.
   Always loads the latest website from the internet; keeps a copy of the main pages
   so the app still opens (with a "you're offline" note) when there is no connection. */
const CACHE = 'drmk-v1';
const CORE = ['/', '/index.html', '/consult.html', '/qrcode.min.js', '/portrait.jpg', '/icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // booking, payments, video: always live
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('/index.html') : undefined))));
});
