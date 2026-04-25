/*
 * SenkoLib Service Worker
 * Responsabilidade: cache Network First para recursos locais.
 * Dependencias: Cache Storage API.
 * Expoe: eventos install/activate/fetch do Service Worker.
 */
var CACHE_NAME = 'senkolib-cache-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
        return Promise.resolve();
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  var url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req, { cache: 'no-store' }).then(function (fresh) {
      var copy = fresh.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(req, copy);
      });
      return fresh;
    }).catch(function () {
      return caches.match(req);
    })
  );
});
