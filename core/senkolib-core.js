/* ============================================================================
   senkolib-core.js - Registro em memoria da biblioteca

   RESPONSABILIDADE:
     Mantem layouts e variantes registrados por arquivos de dados.
     Entrega copias rasas para a UI sem depender de backend.

   EXPOE (globais):
     SenkoLib.register(arr) -> adiciona layouts
     SenkoLib.getAll() -> retorna todos os layouts
     SenkoLib.registerVariant(layoutName, arr) -> adiciona variantes
     SenkoLib.getVariants(layoutName) -> retorna variantes de um layout
     SenkoLib.upsertVariant(layoutName, variant) -> atualiza/adiciona variante
     SenkoLib.removeVariant(layoutName, name) -> remove variante
     SenkoLib.removeLayout(id) -> remove layout em memoria

   DEPENDENCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Primeiro script da aplicacao, antes de layouts e variantes.
============================================================================ */

(function (global) {
  var _layouts = [];
  var _variants = {};

  function normalizeKey(value) {
    return String(value || '').toLowerCase();
  }

  function register(arr) {
    if (!arr || !arr.length) return;
    arr.forEach(function (item) {
      if (!item || !item.id) return;
      _layouts.push(item);
    });
  }

  function getAll() {
    return _layouts.slice();
  }

  function registerVariant(layoutName, arr) {
    var key = normalizeKey(layoutName);
    if (!key || !arr || !arr.length) return;
    if (!_variants[key]) _variants[key] = [];
    arr.forEach(function (item) {
      if (item && item.name) _variants[key].push(item);
    });
  }

  function getVariants(layoutName) {
    var key = normalizeKey(layoutName);
    return (_variants[key] || []).slice();
  }

  function upsertVariant(layoutName, variant) {
    var key = normalizeKey(layoutName);
    var list;
    var i;
    if (!key || !variant || !variant.name) return;
    if (!_variants[key]) _variants[key] = [];
    list = _variants[key];
    for (i = 0; i < list.length; i += 1) {
      if (list[i].name === variant.name) {
        list[i] = { name: variant.name, html: variant.html, css: variant.css };
        return;
      }
    }
    list.push({ name: variant.name, html: variant.html, css: variant.css });
  }

  function removeVariant(layoutName, variantName) {
    var key = normalizeKey(layoutName);
    if (!_variants[key]) return;
    _variants[key] = _variants[key].filter(function (variant) {
      return variant.name !== variantName;
    });
  }

  function removeLayout(layoutId) {
    _layouts = _layouts.filter(function (layout) {
      return layout.id !== layoutId;
    });
  }

  global.SenkoLib = {
    register: register,
    getAll: getAll,
    registerVariant: registerVariant,
    getVariants: getVariants,
    upsertVariant: upsertVariant,
    removeVariant: removeVariant,
    removeLayout: removeLayout
  };
})(window);
