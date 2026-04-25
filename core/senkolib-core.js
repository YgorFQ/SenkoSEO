/* ═══════════════════════════════════════════════════════════════════════
   senkolib-core.js — Motor de registro de layouts e variantes em memória

   RESPONSABILIDADE:
     Mantém o registro central de todos os layouts e suas variantes.
     Expõe a API global SenkoLib para que arquivos de layout/variante
     registrem seus dados, e que a UI consulte o catálogo.

   EXPÕE (globais):
     SenkoLib.register(arr)                   → void
     SenkoLib.getAll()                         → Array<Layout>
     SenkoLib.registerVariant(layoutId, arr)  → void
     SenkoLib.getVariants(layoutId)           → Array<Variant>

   DEPENDÊNCIAS:
     Nenhuma — deve ser o primeiro script carregado.

   ORDEM DE CARREGAMENTO:
     1º script no index.html
═══════════════════════════════════════════════════════════════════════ */

var SenkoLib = (function () {
  'use strict';

  /* ── Armazenamento privado ──────────────────────────────────────── */
  var _layouts  = [];
  var _variants = {}; // { 'section-1': [ {name, html, css}, ... ] }

  /* ── Layouts ────────────────────────────────────────────────────── */

  // Adiciona um array de layouts ao registro; duplicatas por id são ignoradas
  function register(arr) {
    if (!Array.isArray(arr)) return;
    arr.forEach(function (layout) {
      if (!layout || !layout.id) return;
      var exists = _layouts.some(function (l) { return l.id === layout.id; });
      if (!exists) _layouts.push(layout);
    });
  }

  // Retorna cópia do array completo de layouts registrados
  function getAll() {
    return _layouts.slice();
  }

  /* ── Variantes ──────────────────────────────────────────────────── */

  // Registra variantes para um layout (identificado pelo id em lowercase)
  function registerVariant(layoutId, arr) {
    if (!layoutId || !Array.isArray(arr)) return;
    var key = layoutId.toLowerCase();
    if (!_variants[key]) _variants[key] = [];
    arr.forEach(function (v) {
      if (!v || !v.name) return;
      var exists = _variants[key].some(function (x) { return x.name === v.name; });
      if (!exists) _variants[key].push(v);
    });
  }

  // Retorna variantes de um layout; busca pelo id em lowercase
  function getVariants(layoutId) {
    if (!layoutId) return [];
    var key = layoutId.toLowerCase();
    return (_variants[key] || []).slice();
  }

  /* ── API pública ────────────────────────────────────────────────── */
  return {
    register:        register,
    getAll:          getAll,
    registerVariant: registerVariant,
    getVariants:     getVariants,
  };
}());
