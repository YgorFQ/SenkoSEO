/* ============================================================================
   col-core.js - Registro em memoria de colecoes

   RESPONSABILIDADE:
     Mantem colecoes e layouts internos em memoria, permitindo mutacoes locais
     apos commits na GitHub API.

   EXPOE (globais):
     ColLib.register(obj), getAll(), getBySlug(slug)
     ColLib.updateCollection(), removeCollection()
     ColLib.addLayout(), updateLayout(), removeLayout()

   DEPENDENCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Antes dos arquivos colecoes/data/*.js.
============================================================================ */

(function (global) {
  var _collections = [];

  function cloneCollection(col) {
    return {
      slug: col.slug,
      name: col.name,
      group: col.group,
      tags: (col.tags || []).slice(),
      layouts: (col.layouts || []).map(function (layout) {
        return {
          id: layout.id,
          name: layout.name,
          html: layout.html,
          css: layout.css || ''
        };
      })
    };
  }

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
    index = findIndex(obj.slug);
    if (index === -1) _collections.push(cloneCollection(obj));
    else _collections[index] = cloneCollection(obj);
  }

  function getAll() {
    return _collections.map(cloneCollection);
  }

  function getBySlug(slug) {
    var index = findIndex(slug);
    return index === -1 ? null : _collections[index];
  }

  function updateCollection(slug, patch) {
    var col = getBySlug(slug);
    if (!col) return;
    if (patch.name !== undefined) col.name = patch.name;
    if (patch.group !== undefined) col.group = patch.group;
    if (patch.tags !== undefined) col.tags = patch.tags.slice();
  }

  function removeCollection(slug) {
    var index = findIndex(slug);
    if (index !== -1) _collections.splice(index, 1);
  }

  function addLayout(slug, layout) {
    var col = getBySlug(slug);
    var exists;
    if (!col || !layout || !layout.id) return;
    exists = col.layouts.some(function (item) { return item.id === layout.id; });
    if (!exists) col.layouts.push({
      id: layout.id,
      name: layout.name,
      html: layout.html,
      css: layout.css || ''
    });
  }

  function updateLayout(slug, layoutId, patch) {
    var col = getBySlug(slug);
    if (!col) return;
    col.layouts.forEach(function (layout) {
      if (layout.id !== layoutId) return;
      if (patch.name !== undefined) layout.name = patch.name;
      if (patch.html !== undefined) layout.html = patch.html;
      if (patch.css !== undefined) layout.css = patch.css;
    });
  }

  function removeLayout(slug, layoutId) {
    var col = getBySlug(slug);
    if (!col) return;
    col.layouts = col.layouts.filter(function (layout) {
      return layout.id !== layoutId;
    });
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
})(window);
