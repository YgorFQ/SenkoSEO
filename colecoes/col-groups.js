/*
 * ColGroups
 * Responsabilidade: manter grupos confirmados e grupos pendentes criados na UI.
 * Dependencias: nenhuma.
 * Expoe: window.ColGroups.
 */
(function (global) {
  var _confirmed = [];
  var _pending = [];

  function cloneGroup(group) {
    return {
      slug: group.slug,
      name: group.name,
      cor: group.cor
    };
  }

  function slugify(name) {
    return String(name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function load(arr) {
    var i;
    _confirmed = [];
    if (!arr) return;
    for (i = 0; i < arr.length; i += 1) {
      if (arr[i] && arr[i].slug) {
        _confirmed.push(cloneGroup(arr[i]));
      }
    }
  }

  function getAll() {
    return _confirmed.concat(_pending);
  }

  function getBySlug(slug) {
    var all = getAll();
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
    return _pending.slice(0);
  }

  function clearPending() {
    _confirmed = _confirmed.concat(_pending);
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
}(window));
