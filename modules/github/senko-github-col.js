/*
 * Senko GitHub Colecoes
 * Responsabilidade: persistir colecoes, grupos e layouts de colecao no GitHub.
 * Dependencias: senko-github-v2.js, ColGroups, ColLib e col-modals.js.
 * Expoe: ghcolInjectButtons.
 */
(function (global) {
  var _saving = false;

  function $(id) {
    return document.getElementById(id);
  }

  function quote(value) {
    return "'" + String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }

  function tpl(value) {
    return '`' + String(value || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
  }

  function collectionPath(slug) {
    return 'colecoes/data/' + slug + '.js';
  }

  function serializeTags(tags) {
    var out = [];
    var i;
    tags = tags || [];
    for (i = 0; i < tags.length; i += 1) out.push(quote(tags[i]));
    return '[' + out.join(', ') + ']';
  }

  function serializeLayout(layout, indent) {
    return indent + '{\n' +
      indent + '  id: ' + quote(layout.id) + ',\n' +
      indent + '  name: ' + quote(layout.name) + ',\n' +
      indent + '  html: ' + tpl(layout.html) + ',\n' +
      indent + '  css: ' + tpl(layout.css) + '\n' +
      indent + '}';
  }

  function serializeCollection(col) {
    var layouts = col.layouts || [];
    var body = [];
    var i;
    for (i = 0; i < layouts.length; i += 1) {
      body.push(serializeLayout(layouts[i], '    '));
    }
    return "/*\n" +
      " * Colecao " + col.name + "\n" +
      " * Gerado pelo SenkoLib.\n" +
      " */\n" +
      "ColLib.register({\n" +
      "  slug: " + quote(col.slug) + ",\n" +
      "  name: " + quote(col.name) + ",\n" +
      "  group: " + quote(col.group) + ",\n" +
      "  tags: " + serializeTags(col.tags) + ",\n" +
      "  layouts: [\n" + body.join(',\n') + "\n  ]\n" +
      "});\n";
  }

  function parseCollection(content) {
    var holder = null;
    var fake = {
      register: function (obj) {
        holder = obj;
      }
    };
    try {
      new Function('ColLib', content)(fake);
    } catch (err) {
      console.error(err);
    }
    if (!holder) throw new Error('Nao foi possivel ler a colecao.');
    if (!holder.layouts) holder.layouts = [];
    if (!holder.tags) holder.tags = [];
    return holder;
  }

  function serializeGroupsData() {
    var groups = ColGroups.getAll();
    var lines = [];
    var i;
    for (i = 0; i < groups.length; i += 1) {
      lines.push("  { slug: " + quote(groups[i].slug) + ", name: " + quote(groups[i].name) + ", cor: " + quote(groups[i].cor) + " }");
    }
    return "/*\n" +
      " * Dados de grupos\n" +
      " * Gerado pelo modulo GitHub de colecoes.\n" +
      " */\n" +
      "ColGroups.load([\n" + lines.join(',\n') + "\n]);\n";
  }

  function addCollectionScript(indexContent, slug) {
    var src = '<script src="colecoes/data/' + slug + '.js"></script>';
    var marker = '<script src="colecoes/col-script.js"></script>';
    var pos;
    if (indexContent.indexOf(src) >= 0) return indexContent;
    pos = indexContent.indexOf(marker);
    if (pos < 0) return indexContent + '\n  ' + src + '\n';
    return indexContent.slice(0, pos) + src + '\n  ' + indexContent.slice(pos);
  }

  function removeCollectionScript(indexContent, slug) {
    var re = new RegExp('\\s*<script src="colecoes/data/' + slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\.js"></script>', 'g');
    return indexContent.replace(re, '');
  }

  function readCollection(slug) {
    return global.githubGetFile(collectionPath(slug)).then(function (file) {
      if (!file) throw new Error('Colecao nao encontrada.');
      return {
        file: file,
        col: parseCollection(global.ghDecodeBase64(file.content))
      };
    });
  }

  function saveCollectionFile(col, sha, message) {
    return global.githubPutFile(collectionPath(col.slug), serializeCollection(col), sha, message);
  }

  function savePendingGroupsIfNeeded() {
    var pending = ColGroups.getPending();
    if (!pending.length) return Promise.resolve(false);
    return global.githubGetFile('colecoes/col-groups-data.js').then(function (file) {
      return global.githubPutFile('colecoes/col-groups-data.js', serializeGroupsData(), file && file.sha, 'Update collection groups');
    }).then(function () {
      ColGroups.clearPending();
      return true;
    });
  }

  function updateIndexForCollection(slug, add) {
    return global.githubGetFile('index.html').then(function (file) {
      var content;
      var next;
      if (!file) throw new Error('index.html nao encontrado.');
      content = global.ghDecodeBase64(file.content);
      next = add ? addCollectionScript(content, slug) : removeCollectionScript(content, slug);
      if (next === content) return null;
      return global.githubPutFile('index.html', next, file.sha, (add ? 'Add' : 'Remove') + ' collection script ' + slug);
    });
  }

  function ghcolCreateCollection() {
    var data = global.colGetCreateFormData ? global.colGetCreateFormData() : null;
    var col;
    if (!data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    col = { slug: data.slug, name: data.name, group: data.group, tags: data.tags, layouts: [] };
    global.githubGetFile(collectionPath(col.slug)).then(function (file) {
      return saveCollectionFile(col, file && file.sha, 'Create collection ' + col.slug);
    }).then(function () {
      return savePendingGroupsIfNeeded();
    }).then(function () {
      return updateIndexForCollection(col.slug, true);
    }).then(function () {
      ColLib.register(col);
      global.showToast('✓ Coleção criada!');
      if (global.colCloseCreateModal) global.colCloseCreateModal();
      if (global.colRenderGrid) global.colRenderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao criar coleção.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghcolEditCollection() {
    var data = global.colGetEditFormData ? global.colGetEditFormData() : null;
    if (!data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    readCollection(data.slug).then(function (res) {
      res.col.name = data.name;
      res.col.group = data.group;
      res.col.tags = data.tags;
      return saveCollectionFile(res.col, res.file.sha, 'Update collection ' + data.slug);
    }).then(function () {
      return savePendingGroupsIfNeeded();
    }).then(function () {
      ColLib.updateCollection(data.slug, { name: data.name, group: data.group, tags: data.tags });
      global.showToast('✓ Coleção salva!');
      if (global.colCloseEditModal) global.colCloseEditModal();
      if (global.colRenderGrid) global.colRenderGrid();
      if (global.colGetCurrentCollection && global.colGetCurrentCollection() && global.colGetCurrentCollection().slug === data.slug && global.colOpenCollectionModal) {
        global.colOpenCollectionModal(global.colGetCurrentCollection());
      }
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao salvar coleção.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghcolDeleteCollection(slug) {
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    global.githubGetFile(collectionPath(slug)).then(function (file) {
      if (!file) throw new Error('Colecao nao encontrada.');
      return global.githubDeleteFile(collectionPath(slug), file.sha, 'Delete collection ' + slug);
    }).then(function () {
      return updateIndexForCollection(slug, false);
    }).then(function () {
      ColLib.removeCollection(slug);
      global.showToast('✓ Coleção excluída!');
      if (global.colCloseCollectionModal) global.colCloseCollectionModal();
      if (global.colRenderGrid) global.colRenderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao excluir coleção.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghcolAddLayout() {
    var current = global.colGetCurrentCollection ? global.colGetCurrentCollection() : null;
    var data = global.colGetAddLayoutFormData ? global.colGetAddLayoutFormData() : null;
    if (!current || !data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    readCollection(current.slug).then(function (res) {
      var i;
      var done = false;
      for (i = 0; i < res.col.layouts.length; i += 1) {
        if (res.col.layouts[i].id === data.id) {
          res.col.layouts[i] = data;
          done = true;
        }
      }
      if (!done) res.col.layouts.push(data);
      return saveCollectionFile(res.col, res.file.sha, 'Add collection layout ' + data.id);
    }).then(function () {
      ColLib.addLayout(current.slug, data);
      global.showToast('✓ Layout adicionado!');
      if (global.colCloseAddLayoutModal) global.colCloseAddLayoutModal();
      if (global.colRenderCurrentLayouts) global.colRenderCurrentLayouts();
      if (global.colRenderGrid) global.colRenderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao adicionar layout.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghcolEditLayout() {
    var current = global.colGetCurrentCollection ? global.colGetCurrentCollection() : null;
    var data = global.colGetEditLayoutFormData ? global.colGetEditLayoutFormData() : null;
    if (!current || !data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    readCollection(current.slug).then(function (res) {
      var i;
      for (i = 0; i < res.col.layouts.length; i += 1) {
        if (res.col.layouts[i].id === data.id) {
          res.col.layouts[i] = data;
        }
      }
      return saveCollectionFile(res.col, res.file.sha, 'Update collection layout ' + data.id);
    }).then(function () {
      ColLib.updateLayout(current.slug, data.id, { name: data.name, html: data.html, css: data.css });
      global.showToast('✓ Layout salvo!');
      if (global.colCloseEditLayoutModal) global.colCloseEditLayoutModal();
      if (global.colRenderCurrentLayouts) global.colRenderCurrentLayouts();
      if (global.colRenderGrid) global.colRenderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao salvar layout.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghcolDeleteLayout(slug, layoutId) {
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    readCollection(slug).then(function (res) {
      var out = [];
      var i;
      for (i = 0; i < res.col.layouts.length; i += 1) {
        if (res.col.layouts[i].id !== layoutId) out.push(res.col.layouts[i]);
      }
      res.col.layouts = out;
      return saveCollectionFile(res.col, res.file.sha, 'Delete collection layout ' + layoutId);
    }).then(function () {
      ColLib.removeLayout(slug, layoutId);
      global.showToast('✓ Layout excluído!');
      if (global.colRenderCurrentLayouts) global.colRenderCurrentLayouts();
      if (global.colRenderGrid) global.colRenderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao excluir layout.');
    }).then(function () {
      _saving = false;
    });
  }

  function injectButton(anchor, key, label, handler, cls) {
    var btn;
    if (!anchor || anchor.querySelector('[data-ghcol="' + key + '"]')) return;
    btn = document.createElement('button');
    btn.className = cls || 'btn btn-primary';
    btn.type = 'button';
    btn.setAttribute('data-ghcol', key);
    btn.textContent = label;
    btn.addEventListener('click', handler);
    anchor.appendChild(btn);
  }

  function ghcolInjectButtons() {
    var anchors;
    var layoutAnchors;
    var i;
    injectButton($('colCreateGhAnchor'), 'create-col', 'GitHub', ghcolCreateCollection, 'col-btn-primary');
    injectButton($('colEditGhAnchor'), 'edit-col', 'GitHub', ghcolEditCollection, 'col-btn-primary');
    injectButton($('colAddLayoutGhAnchor'), 'add-layout', 'GitHub', ghcolAddLayout, 'col-btn-primary');
    injectButton($('colEditLayoutGhAnchor'), 'edit-layout', 'GitHub', ghcolEditLayout, 'col-btn-primary');

    anchors = document.querySelectorAll('.col-delete-anchor[data-col-slug]');
    for (i = 0; i < anchors.length; i += 1) {
      injectButton(anchors[i], 'delete-col', 'Excluir', function (event) {
        var slug = this.parentNode.getAttribute('data-col-slug');
        event.stopPropagation();
        global.colOpenConfirm({
          title: 'Excluir coleção',
          body: 'A coleção "' + slug + '" será removida do GitHub.',
          labelOk: 'Excluir',
          danger: true,
          onConfirm: function () { ghcolDeleteCollection(slug); }
        });
      }, 'btn btn-danger');
    }

    layoutAnchors = document.querySelectorAll('.col-layout-delete-anchor[data-layout-id]');
    for (i = 0; i < layoutAnchors.length; i += 1) {
      injectButton(layoutAnchors[i], 'delete-layout', 'Excluir', function () {
        var slug = this.parentNode.getAttribute('data-col-slug');
        var layoutId = this.parentNode.getAttribute('data-layout-id');
        global.colOpenConfirm({
          title: 'Excluir layout',
          body: 'O layout "' + layoutId + '" será removido desta coleção.',
          labelOk: 'Excluir',
          danger: true,
          onConfirm: function () { ghcolDeleteLayout(slug, layoutId); }
        });
      }, 'btn btn-danger');
    }
  }

  function init() {
    ghcolInjectButtons();
  }

  global.ghcolInjectButtons = ghcolInjectButtons;

  document.addEventListener('DOMContentLoaded', init);
}(window));
