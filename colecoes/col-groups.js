/* ═══════════════════════════════════════════════════════════════════════
   col-groups.js — Motor de grupos de Coleções

   RESPONSABILIDADE:
     Mantém o registro central de grupos confirmados (vindos do GitHub)
     e grupos pendentes (criados na UI, ainda não commitados). Expõe
     slugify para geração consistente de slugs.

   EXPÕE (globais):
     ColGroups.load(arr)          → void
     ColGroups.getAll()           → Array<Grupo>
     ColGroups.getBySlug(slug)    → Grupo | undefined
     ColGroups.addPending(grupo)  → void
     ColGroups.getPending()       → Array<Grupo>
     ColGroups.clearPending()     → void
     ColGroups.slugify(name)      → string

   DEPENDÊNCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Antes de col-groups-data.js e col-core.js
═══════════════════════════════════════════════════════════════════════ */

var ColGroups = (function () {
  'use strict';

  /* ── Armazenamento privado ──────────────────────────────────────── */
  var _confirmed = [];
  var _pending   = [];

  /* ── API pública ────────────────────────────────────────────────── */

  // Substitui os grupos confirmados (chamado por col-groups-data.js)
  function load(arr) {
    if (!Array.isArray(arr)) return;
    _confirmed = arr.slice();
  }

  // Retorna todos os grupos (confirmados + pendentes), sem duplicar por slug
  function getAll() {
    var all   = _confirmed.slice();
    var slugs = all.map(function (g) { return g.slug; });
    _pending.forEach(function (g) {
      if (slugs.indexOf(g.slug) === -1) all.push(g);
    });
    return all;
  }

  // Busca grupo por slug em confirmados e pendentes
  function getBySlug(slug) {
    return _confirmed.find(function (g) { return g.slug === slug; }) ||
           _pending.find(function (g) { return g.slug === slug; });
  }

  // Adiciona grupo pendente criado na UI (ainda não commitado no GitHub)
  function addPending(grupo) {
    if (!grupo || !grupo.slug) return;
    var exists = _pending.some(function (g) { return g.slug === grupo.slug; });
    if (!exists) _pending.push(grupo);
  }

  function getPending() { return _pending.slice(); }

  // Move pendentes para confirmados e limpa fila — chamado após commit bem-sucedido
  function clearPending() {
    _pending.forEach(function (g) {
      var exists = _confirmed.some(function (c) { return c.slug === g.slug; });
      if (!exists) _confirmed.push(g);
    });
    _pending = [];
  }

  /* ── Slugify ────────────────────────────────────────────────────── */

  // Gera slug URL-safe a partir de um nome (lowercase, sem acentos, espaço→hífen)
  function slugify(name) {
    return String(name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return {
    load:       load,
    getAll:     getAll,
    getBySlug:  getBySlug,
    addPending: addPending,
    getPending: getPending,
    clearPending: clearPending,
    slugify:    slugify,
  };
}());
