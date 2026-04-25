/* ═══════════════════════════════════════════════════════════════════════
   sw.js — Service Worker (Network First)

   RESPONSABILIDADE:
     Intercepta requisições GET do mesmo origin e implementa estratégia
     Network First: tenta buscar da rede, atualiza o cache com a resposta
     fresca e usa o cache apenas como fallback offline.

   EXPÕE (globais):
     Nenhuma — roda em contexto de Service Worker isolado.

   DEPENDÊNCIAS:
     Nenhuma.
═══════════════════════════════════════════════════════════════════════ */

var CACHE_NAME = 'senkolib-v1';

/* ── Instalação ─────────────────────────────────────────────────────── */
self.addEventListener('install', function (event) {
  // Ativa imediatamente sem esperar abas antigas fecharem
  self.skipWaiting();
});

/* ── Ativação ───────────────────────────────────────────────────────── */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      // Assume controle de todas as abas abertas imediatamente
      return self.clients.claim();
    })
  );
});

/* ── Fetch — Network First ──────────────────────────────────────────── */
self.addEventListener('fetch', function (event) {
  var req = event.request;

  // Só intercepta GET do mesmo origin; deixa APIs externas passarem
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(function (networkResponse) {
        // Atualiza o cache com a resposta fresca
        var clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(req, clone);
        });
        return networkResponse;
      })
      .catch(function () {
        // Falha de rede: usa cache como fallback offline
        return caches.match(req);
      })
  );
});
