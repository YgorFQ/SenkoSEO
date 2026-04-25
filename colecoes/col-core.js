/* ═══════════════════════════════════════════════════════════════════════
   col-core.js — Motor de registro de Coleções em memória

   RESPONSABILIDADE:
     Mantém o catálogo de coleções e expõe API CRUD em memória.
     Coleções são identificadas por slug único. Layouts dentro de cada
     coleção são identificados por id único dentro da coleção.

   EXPÕE (globais):
     ColLib.register(obj)                    → void
     ColLib.getAll()                          → Array<Colecao>
     ColLib.getBySlug(slug)                  → Colecao | undefined
     ColLib.updateCollection(slug, patch)    → void
     ColLib.removeCollection(slug)           → void
     ColLib.addLayout(slug, layout)          → void
     ColLib.updateLayout(slug, lid, patch)   → void
     ColLib.removeLayout(slug, lid)          → void

   DEPENDÊNCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Após col-groups-data.js, antes de col-script.js
═══════════════════════════════════════════════════════════════════════ */

var ColLib = (function () {
  'use strict';

  var _collections = [];

  /* ── Coleções ───────────────────────────────────────────────────── */

  // Registra ou substitui uma coleção (upsert por slug)
  function register(obj) {
    if (!obj || !obj.slug) return;
    var idx = _collections.findIndex(function (c) { return c.slug === obj.slug; });
    if (idx !== -1) { _collections[idx] = obj; }
    else            { _collections.push(obj); }
  }

  function getAll() { return _collections.slice(); }

  function getBySlug(slug) {
    return _collections.find(function (c) { return c.slug === slug; });
  }

  // Atualiza name, group e/ou tags de uma coleção
  function updateCollection(slug, patch) {
    var col = getBySlug(slug);
    if (!col) return;
    if (patch.name  !== undefined) col.name  = patch.name;
    if (patch.group !== undefined) col.group = patch.group;
    if (patch.tags  !== undefined) col.tags  = patch.tags;
  }

  function removeCollection(slug) {
    _collections = _collections.filter(function (c) { return c.slug !== slug; });
  }

  /* ── Layouts dentro de uma coleção ─────────────────────────────── */

  // Adiciona layout à coleção; ignora se id já existe
  function addLayout(slug, layout) {
    var col = getBySlug(slug);
    if (!col) return;
    if (!col.layouts) col.layouts = [];
    var exists = col.layouts.some(function (l) { return l.id === layout.id; });
    if (!exists) col.layouts.push(layout);
  }

  // Atualiza campos de um layout existente na coleção
  function updateLayout(slug, layoutId, patch) {
    var col = getBySlug(slug);
    if (!col || !col.layouts) return;
    var layout = col.layouts.find(function (l) { return l.id === layoutId; });
    if (!layout) return;
    if (patch.name !== undefined) layout.name = patch.name;
    if (patch.html !== undefined) layout.html = patch.html;
    if (patch.css  !== undefined) layout.css  = patch.css;
  }

  function removeLayout(slug, layoutId) {
    var col = getBySlug(slug);
    if (!col || !col.layouts) return;
    col.layouts = col.layouts.filter(function (l) { return l.id !== layoutId; });
  }

  return {
    register:         register,
    getAll:           getAll,
    getBySlug:        getBySlug,
    updateCollection: updateCollection,
    removeCollection: removeCollection,
    addLayout:        addLayout,
    updateLayout:     updateLayout,
    removeLayout:     removeLayout,
  };
}());
