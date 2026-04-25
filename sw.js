/* ============================================================================
   sw.js - Service Worker Network First

   RESPONSABILIDADE:
     Intercepta recursos locais do GitHub Pages e tenta rede primeiro.
     Usa cache apenas como fallback offline, sempre com fetch no-store.

   EXPOE (globais):
     Nenhum global de aplicacao.

   DEPENDENCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Registrado no head do index.html.
============================================================================ */

var SENKOLIB_CACHE = 'senkolib-cache-v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== SENKOLIB_CACHE) return caches.delete(key);
        return Promise.resolve();
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request, { cache: 'no-store' }).then(function (response) {
      var responseClone = response.clone();
      caches.open(SENKOLIB_CACHE).then(function (cache) {
        cache.put(request, responseClone);
      });
      return response;
    }).catch(function () {
      return caches.match(request);
    })
  );
});
