/* ============================================================================
   col-groups.js - Motor de grupos de colecoes

   RESPONSABILIDADE:
     Mantem grupos confirmados e pendentes em memoria, com slugify centralizado
     para criacao de grupos pela interface.

   EXPOE (globais):
     ColGroups.load(arr), getAll(), getBySlug(slug)
     ColGroups.addPending(grupo), getPending(), clearPending()
     ColGroups.slugify(name)

   DEPENDENCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Antes de col-groups-data.js e col-core.js.
============================================================================ */

(function (global) {
  var _groups = [];
  var _pending = [];

  function cloneGroup(group) {
    return { slug: group.slug, name: group.name, cor: group.cor };
  }

  function slugify(name) {
    return String(name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function load(arr) {
    _groups = (arr || []).map(cloneGroup);
  }

  function getAll() {
    return _groups.concat(_pending).map(cloneGroup);
  }

  function getBySlug(slug) {
    var all = _groups.concat(_pending);
    var i;
    for (i = 0; i < all.length; i += 1) {
      if (all[i].slug === slug) return all[i];
    }
    return null;
  }

  function addPending(group) {
    if (!group || !group.slug || getBySlug(group.slug)) return;
    _pending.push(cloneGroup(group));
  }

  function getPending() {
    return _pending.map(cloneGroup);
  }

  function clearPending() {
    _pending.forEach(function (group) {
      _groups.push(cloneGroup(group));
    });
    _pending = [];
  }

  global.ColGroups = {
    load: load,
    getAll: getAll,
    getBySlug: getBySlug,
    addPending: addPending,
    getPending: getPending,
    clearPending: clearPending,
    slugify: slugify
  };
})(window);
