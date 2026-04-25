/*
 * ColLib core
 * Responsabilidade: registrar e atualizar colecoes em memoria.
 * Dependencias: nenhuma.
 * Expoe: window.ColLib.
 */
(function (global) {
  var _collections = [];

  function findIndex(slug) {
    var i;
    for (i = 0; i < _collections.length; i += 1) {
      if (_collections[i].slug === slug) return i;
    }
    return -1;
  }

  function register(obj) {
    var index;
    if (!obj || !obj.slug) return;
    if (!obj.layouts) obj.layouts = [];
    if (!obj.tags) obj.tags = [];

    index = findIndex(obj.slug);
    if (index >= 0) {
      _collections[index] = obj;
    } else {
      _collections.push(obj);
    }
  }

  function getAll() {
    return _collections.slice(0);
  }

  function getBySlug(slug) {
    var index = findIndex(slug);
    return index >= 0 ? _collections[index] : null;
  }

  function updateCollection(slug, patch) {
    var col = getBySlug(slug);
    if (!col || !patch) return;
    if (typeof patch.name !== 'undefined') col.name = patch.name;
    if (typeof patch.group !== 'undefined') col.group = patch.group;
    if (typeof patch.tags !== 'undefined') col.tags = patch.tags;
  }

  function removeCollection(slug) {
    var index = findIndex(slug);
    if (index >= 0) _collections.splice(index, 1);
  }

  function findLayoutIndex(col, layoutId) {
    var i;
    if (!col || !col.layouts) return -1;
    for (i = 0; i < col.layouts.length; i += 1) {
      if (col.layouts[i].id === layoutId) return i;
    }
    return -1;
  }

  function addLayout(slug, layout) {
    var col = getBySlug(slug);
    var index;
    if (!col || !layout || !layout.id) return;
    index = findLayoutIndex(col, layout.id);
    if (index >= 0) {
      col.layouts[index] = layout;
    } else {
      col.layouts.push(layout);
    }
  }

  function updateLayout(slug, layoutId, patch) {
    var col = getBySlug(slug);
    var index = findLayoutIndex(col, layoutId);
    if (!col || index < 0 || !patch) return;
    if (typeof patch.name !== 'undefined') col.layouts[index].name = patch.name;
    if (typeof patch.html !== 'undefined') col.layouts[index].html = patch.html;
    if (typeof patch.css !== 'undefined') col.layouts[index].css = patch.css;
  }

  function removeLayout(slug, layoutId) {
    var col = getBySlug(slug);
    var index = findLayoutIndex(col, layoutId);
    if (col && index >= 0) col.layouts.splice(index, 1);
  }

  global.ColLib = {
    register: register,
    getAll: getAll,
    getBySlug: getBySlug,
    updateCollection: updateCollection,
    removeCollection: removeCollection,
    addLayout: addLayout,
    updateLayout: updateLayout,
    removeLayout: removeLayout
  };
}(window));
