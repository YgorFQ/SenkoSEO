/* ============================================================================
   senko-github-col.js - GitHub API para Colecoes

   RESPONSABILIDADE:
     Persiste colecoes, grupos pendentes e layouts internos em arquivos JS,
     atualizando tambem o index.html quando colecoes sao criadas/removidas.

   EXPOE (globais):
     ghColInjectButtons(), ghColInjectDeleteButtons()
     ghColInjectLayoutDeleteButtons()

   DEPENDENCIAS:
     senko-github-v2.js, colecoes/col-modals.js, colecoes/col-script.js.

   ORDEM DE CARREGAMENTO:
     Depois dos demais modulos GitHub.
============================================================================ */

function ghColQuote(value) {
  return "'" + String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function ghColGenerateCollectionFile(col) {
  var lines = [];
  lines.push("/* Gerado pelo SenkoLib. Edite pela interface quando possivel. */");
  lines.push('ColLib.register({');
  lines.push('  slug: ' + ghColQuote(col.slug) + ',');
  lines.push('  name: ' + ghColQuote(col.name) + ',');
  lines.push('  group: ' + ghColQuote(col.group) + ',');
  lines.push('  tags: ' + JSON.stringify(col.tags || []) + ',');
  lines.push('  layouts: [');
  (col.layouts || []).forEach(function (layout, index) {
    lines.push('    {');
    lines.push('      id: ' + ghColQuote(layout.id) + ',');
    lines.push('      name: ' + ghColQuote(layout.name) + ',');
    lines.push('      html: `' + escapeTemplate(layout.html || '') + '`,');
    lines.push('      css: `' + escapeTemplate(layout.css || '') + '`');
    lines.push('    }' + (index < col.layouts.length - 1 ? ',' : ''));
  });
  lines.push('  ]');
  lines.push('});');
  return lines.join('\n') + '\n';
}

function ghColGenerateGroupsFile() {
  var groups = ColGroups.getAll();
  var lines = [];
  lines.push("/* Gerado pelo SenkoLib. Edite pela interface quando possivel. */");
  lines.push('ColGroups.load([');
  groups.forEach(function (group, index) {
    lines.push('  { slug: ' + ghColQuote(group.slug) + ', name: ' + ghColQuote(group.name) + ', cor: ' + ghColQuote(group.cor) + ' }' + (index < groups.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  return lines.join('\n') + '\n';
}

function ghColCloseOverlay(id) {
  var overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('hidden');
  setBodyLocked(false);
}

function ghColCommitGroupsIfNeeded() {
  var pending = ColGroups.getPending();
  if (!pending.length) return Promise.resolve();
  return githubGetFile('colecoes/col-groups-data.js').then(function (file) {
    return githubPutFile('colecoes/col-groups-data.js', ghColGenerateGroupsFile(), file ? file.sha : null, 'Atualiza grupos de colecoes');
  }).then(function () {
    ColGroups.clearPending();
  });
}

function ghColUpdateIndex(slug, add) {
  var script = '  <script src="colecoes/data/' + slug + '.js"></script>';
  return githubGetFile('index.html').then(function (file) {
    var html;
    var updated;
    if (!file) return null;
    html = ghDecodeBase64(file.content);
    updated = html.replace(/\s*<script src="colecoes\/data\/[^"]+\.js"><\/script>/g, function (match) {
      return match.indexOf('colecoes/data/' + slug + '.js') !== -1 && !add ? '' : match;
    });
    if (add && updated.indexOf('colecoes/data/' + slug + '.js') === -1) {
      updated = updated.replace('  <script src="colecoes/col-script.js"></script>', script + '\n  <script src="colecoes/col-script.js"></script>');
    }
    if (updated === html) return null;
    return githubPutFile('index.html', updated, file.sha, (add ? 'Adiciona' : 'Remove') + ' script da colecao ' + slug);
  });
}

function ghColCreateCollection() {
  var data = colGetCreateFormData();
  var col;
  if (!data) {
    showToast('Dados da colecao invalidos');
    return;
  }
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  col = { slug: data.slug, name: data.name, group: data.group, tags: data.tags, layouts: [] };
  ghSetSaving(true);
  githubGetFile('colecoes/data/' + col.slug + '.js').then(function (file) {
    return githubPutFile('colecoes/data/' + col.slug + '.js', ghColGenerateCollectionFile(col), file ? file.sha : null, 'Cria colecao ' + col.slug);
  }).then(function () {
    return ghColCommitGroupsIfNeeded();
  }).then(function () {
    return ghColUpdateIndex(col.slug, true);
  }).then(function () {
    ColLib.register(col);
    colMarkDirty();
    colRenderGrid();
    ghColCloseOverlay('colCreateOverlay');
    showToast('Colecao salva');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghColEditCollection() {
  var data = colGetEditFormData();
  var col;
  if (!data) {
    showToast('Dados da colecao invalidos');
    return;
  }
  col = ColLib.getBySlug(data.slug);
  if (!col) return;
  col = { slug: col.slug, name: data.name, group: data.group, tags: data.tags, layouts: col.layouts || [] };
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile('colecoes/data/' + col.slug + '.js').then(function (file) {
    return githubPutFile('colecoes/data/' + col.slug + '.js', ghColGenerateCollectionFile(col), file ? file.sha : null, 'Atualiza colecao ' + col.slug);
  }).then(function () {
    return ghColCommitGroupsIfNeeded();
  }).then(function () {
    ColLib.updateCollection(col.slug, { name: col.name, group: col.group, tags: col.tags });
    colMarkDirty();
    colRenderGrid();
    ghColCloseOverlay('colEditOverlay');
    showToast('Colecao atualizada');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghColSaveLayout(isEdit) {
  var col = _colCurrentCollection;
  var layout = isEdit ? colGetEditLayoutFormData() : colGetAddLayoutFormData();
  var next;
  if (!col || !layout) {
    showToast('Dados do layout invalidos');
    return;
  }
  next = {
    slug: col.slug,
    name: col.name,
    group: col.group,
    tags: col.tags || [],
    layouts: (col.layouts || []).slice()
  };
  if (isEdit) {
    next.layouts = next.layouts.map(function (item) {
      return item.id === layout.id ? layout : item;
    });
  } else {
    next.layouts.push(layout);
  }
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile('colecoes/data/' + col.slug + '.js').then(function (file) {
    return githubPutFile('colecoes/data/' + col.slug + '.js', ghColGenerateCollectionFile(next), file ? file.sha : null, (isEdit ? 'Atualiza' : 'Adiciona') + ' layout em ' + col.slug);
  }).then(function () {
    if (isEdit) ColLib.updateLayout(col.slug, layout.id, layout);
    else ColLib.addLayout(col.slug, layout);
    _colCurrentCollection = ColLib.getBySlug(col.slug);
    colRenderLayoutsGrid();
    ghColCloseOverlay(isEdit ? 'colEditLayoutOverlay' : 'colAddLayoutOverlay');
    showToast('Layout salvo');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghColDeleteCollection(slug) {
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile('colecoes/data/' + slug + '.js').then(function (file) {
    if (!file) throw new Error('Arquivo da colecao nao encontrado');
    return githubDeleteFile('colecoes/data/' + slug + '.js', file.sha, 'Remove colecao ' + slug);
  }).then(function () {
    return ghColUpdateIndex(slug, false);
  }).then(function () {
    ColLib.removeCollection(slug);
    colMarkDirty();
    colRenderGrid();
    showToast('Colecao removida');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghColDeleteLayout(layoutId) {
  var col = _colCurrentCollection;
  var next;
  if (!col) return;
  next = {
    slug: col.slug,
    name: col.name,
    group: col.group,
    tags: col.tags || [],
    layouts: (col.layouts || []).filter(function (layout) { return layout.id !== layoutId; })
  };
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile('colecoes/data/' + col.slug + '.js').then(function (file) {
    return githubPutFile('colecoes/data/' + col.slug + '.js', ghColGenerateCollectionFile(next), file ? file.sha : null, 'Remove layout ' + layoutId + ' de ' + col.slug);
  }).then(function () {
    ColLib.removeLayout(col.slug, layoutId);
    _colCurrentCollection = ColLib.getBySlug(col.slug);
    colRenderLayoutsGrid();
    showToast('Layout removido');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghColInjectButtons() {
  var createAnchor = document.getElementById('colCreateGhAnchor');
  var editAnchor = document.getElementById('colEditGhAnchor');
  var addLayoutAnchor = document.getElementById('colAddLayoutGhAnchor');
  var editLayoutAnchor = document.getElementById('colEditLayoutGhAnchor');
  var btn;

  if (createAnchor && !document.getElementById('ghColCreateBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Salvar colecao');
    btn.id = 'ghColCreateBtn';
    btn.addEventListener('click', ghColCreateCollection);
    createAnchor.appendChild(btn);
  }
  if (editAnchor && !document.getElementById('ghColEditBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Atualizar colecao');
    btn.id = 'ghColEditBtn';
    btn.addEventListener('click', ghColEditCollection);
    editAnchor.appendChild(btn);
  }
  if (addLayoutAnchor && !document.getElementById('ghColAddLayoutBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Salvar layout');
    btn.id = 'ghColAddLayoutBtn';
    btn.addEventListener('click', function () { ghColSaveLayout(false); });
    addLayoutAnchor.appendChild(btn);
  }
  if (editLayoutAnchor && !document.getElementById('ghColEditLayoutBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Atualizar layout');
    btn.id = 'ghColEditLayoutBtn';
    btn.addEventListener('click', function () { ghColSaveLayout(true); });
    editLayoutAnchor.appendChild(btn);
  }
}

function ghColInjectDeleteButtons() {
  Array.prototype.forEach.call(document.querySelectorAll('.col-delete-anchor'), function (anchor) {
    var slug = anchor.getAttribute('data-col-slug');
    var btn;
    if (anchor.querySelector('button')) return;
    btn = makeButton('btn btn-danger', iconSvg('trash'), 'Excluir colecao');
    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      colOpenConfirm({
        title: 'Excluir colecao',
        body: 'Remover a colecao "' + slug + '" e seu arquivo?',
        labelOk: 'Excluir',
        danger: true,
        onConfirm: function () { ghColDeleteCollection(slug); }
      });
    });
    anchor.appendChild(btn);
  });
}

function ghColInjectLayoutDeleteButtons() {
  Array.prototype.forEach.call(document.querySelectorAll('.col-layout-delete-anchor'), function (anchor) {
    var layoutId = anchor.getAttribute('data-layout-id');
    var btn;
    if (anchor.querySelector('button')) return;
    btn = makeButton('btn btn-danger', iconSvg('trash'), 'Excluir layout da colecao');
    btn.addEventListener('click', function () {
      colOpenConfirm({
        title: 'Excluir layout',
        body: 'Remover "' + layoutId + '" desta colecao?',
        labelOk: 'Excluir',
        danger: true,
        onConfirm: function () { ghColDeleteLayout(layoutId); }
      });
    });
    anchor.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  ghColInjectButtons();
  ghColInjectDeleteButtons();
});
