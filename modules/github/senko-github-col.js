/* ═══════════════════════════════════════════════════════════════════════
   senko-github-col.js — Coleções no GitHub

   RESPONSABILIDADE:
     Gerencia persistência de coleções no repositório: criar, editar,
     excluir coleções e seus layouts. Injeta botões nas âncoras dos
     modais de coleção. Atualiza index.html com novos <script> tags.

   EXPÕE (globais):
     Nenhuma (autoexecutado no DOMContentLoaded).

   DEPENDÊNCIAS:
     senko-github-v2.js, col-modals.js, col-script.js, col-core.js,
     col-groups.js

   ORDEM DE CARREGAMENTO:
     Último script carregado
═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(_ghcInjectAllButtons, 500);
});

function _ghcInjectAllButtons() {
  _ghcInjectCreateButton();
  _ghcInjectEditButton();
  _ghcInjectAddLayoutButton();
  _ghcInjectEditLayoutButton();
  _ghcInjectDeleteButtons();
}

/* ── Serializar coleção para JS ─────────────────────────────────────── */

function _ghcSerializeCollection(col) {
  var layouts = (col.layouts || []).map(function (l) {
    return '    {\n' +
      '      id:   \'' + l.id   + '\',\n' +
      '      name: \'' + l.name.replace(/'/g, "\\'") + '\',\n' +
      '      html: `' + (l.html || '') + '`,\n' +
      '      css:  `' + (l.css  || '') + '`,\n' +
      '    }';
  }).join(',\n');

  return 'ColLib.register({\n' +
    '  slug:    \'' + col.slug  + '\',\n' +
    '  name:    \'' + col.name.replace(/'/g, "\\'") + '\',\n' +
    '  group:   \'' + (col.group || '') + '\',\n' +
    '  tags:    '  + JSON.stringify(col.tags || []) + ',\n' +
    '  layouts: [\n' + layouts + '\n  ],\n' +
    '});\n';
}

/* ── Atualizar index.html com novo <script> tag ─────────────────────── */

function _ghcAddScriptToIndex(slug, onSuccess) {
  githubGetFile('index.html').then(function (data) {
    var content = ghDecodeBase64(data.content.replace(/\n/g, ''));
    var tag     = '<script src="colecoes/data/' + slug + '.js"><\/script>';
    // Insere antes do col-script.js
    var marker  = '<script src="colecoes/col-script.js">';
    var updated = content.includes(tag)
      ? content
      : content.replace(marker, tag + '\n' + marker);
    return githubPutFile('index.html', updated, data.sha, 'SenkoLib: add collection ' + slug);
  }).then(function () {
    if (typeof onSuccess === 'function') onSuccess();
  }).catch(function (err) { alert('Erro ao atualizar index.html: ' + err.message); });
}

function _ghcRemoveScriptFromIndex(slug, onSuccess) {
  githubGetFile('index.html').then(function (data) {
    var content = ghDecodeBase64(data.content.replace(/\n/g, ''));
    var tag     = '<script src="colecoes/data/' + slug + '.js"><\/script>\n';
    var updated = content.replace(tag, '');
    return githubPutFile('index.html', updated, data.sha, 'SenkoLib: remove collection ' + slug);
  }).then(function () {
    if (typeof onSuccess === 'function') onSuccess();
  }).catch(function (err) { alert('Erro ao atualizar index.html: ' + err.message); });
}

/* ── Criar coleção ──────────────────────────────────────────────────── */

function _ghcInjectCreateButton() {
  var anchor = document.getElementById('colCreateGhAnchor');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn col-btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var data = colGetCreateFormData();
    if (!data) return;

    if (!ghEnsureToken()) return;

    var filePath = 'colecoes/data/' + data.slug + '.js';
    var newCol   = { slug: data.slug, name: data.name, group: data.group, tags: data.tags, layouts: [] };
    var content  = _ghcSerializeCollection(newCol);

    // 1) Criar arquivo da coleção
    githubPutFile(filePath, content, null, 'SenkoLib: create collection ' + data.slug)
      .then(function () {
        // 2) Se há grupos pendentes, regenerar col-groups-data.js
        var pending = ColGroups.getPending();
        if (pending.length > 0) {
          var all = ColGroups.getAll();
          var groupsContent = 'ColGroups.load(' + JSON.stringify(all, null, 2) + ');\n';
          return githubGetFile('colecoes/col-groups-data.js').then(function (gd) {
            return githubPutFile('colecoes/col-groups-data.js', groupsContent, gd.sha, 'SenkoLib: update groups');
          }).catch(function () {
            return githubPutFile('colecoes/col-groups-data.js', groupsContent, null, 'SenkoLib: create groups data');
          });
        }
      })
      .then(function () {
        // 3) Atualizar index.html
        return new Promise(function (resolve) {
          _ghcAddScriptToIndex(data.slug, resolve);
        });
      })
      .then(function () {
        ColGroups.clearPending();
        ColLib.register(newCol);
        colMarkGridDirty();
        colSwitchTab('colecoes');
        _colHideOverlay('colCreateOverlay');
        showToast();
      })
      .catch(function (err) { alert('Erro ao criar coleção: ' + err.message); });
  });
  anchor.appendChild(btn);
}

/* ── Editar coleção ─────────────────────────────────────────────────── */

function _ghcInjectEditButton() {
  var anchor = document.getElementById('colEditGhAnchor');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn col-btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var data = colGetEditFormData();
    if (!data) return;
    if (!ghEnsureToken()) return;

    var col = ColLib.getBySlug(data.slug);
    if (!col) return;

    var updated = Object.assign({}, col, { name: data.name, group: data.group, tags: data.tags });
    var content = _ghcSerializeCollection(updated);
    var filePath = 'colecoes/data/' + data.slug + '.js';

    githubGetFile(filePath).then(function (fd) {
      return githubPutFile(filePath, content, fd.sha, 'SenkoLib: edit collection ' + data.slug);
    }).then(function () {
      ColLib.updateCollection(data.slug, { name: data.name, group: data.group, tags: data.tags });
      colMarkGridDirty();
      colRenderGrid();
      _colHideOverlay('colEditOverlay');
      showToast();
    }).catch(function (err) { alert('Erro ao editar: ' + err.message); });
  });
  anchor.appendChild(btn);
}

/* ── Adicionar layout à coleção ─────────────────────────────────────── */

function _ghcInjectAddLayoutButton() {
  var anchor = document.getElementById('colAddLayoutGhAnchor');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn col-btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var data = colGetAddLayoutFormData();
    if (!data) { alert('Preencha ID e Nome.'); return; }
    if (!ghEnsureToken()) return;

    var col = _colCurrentCollection;
    if (!col) return;

    ColLib.addLayout(col.slug, data);
    var updated  = ColLib.getBySlug(col.slug);
    var content  = _ghcSerializeCollection(updated);
    var filePath = 'colecoes/data/' + col.slug + '.js';

    githubGetFile(filePath).then(function (fd) {
      return githubPutFile(filePath, content, fd.sha, 'SenkoLib: add layout to ' + col.slug);
    }).then(function () {
      _colHideOverlay('colAddLayoutOverlay');
      _colRenderLayoutsGrid(updated);
      showToast();
    }).catch(function (err) { alert('Erro ao adicionar layout: ' + err.message); });
  });
  anchor.appendChild(btn);
}

/* ── Editar layout da coleção ───────────────────────────────────────── */

function _ghcInjectEditLayoutButton() {
  var anchor = document.getElementById('colEditLayoutGhAnchor');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn col-btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var data = colGetEditLayoutFormData();
    if (!data) return;
    if (!ghEnsureToken()) return;

    var col = _colCurrentCollection;
    if (!col) return;

    ColLib.updateLayout(col.slug, data.id, { name: data.name, html: data.html, css: data.css });
    var updated  = ColLib.getBySlug(col.slug);
    var content  = _ghcSerializeCollection(updated);
    var filePath = 'colecoes/data/' + col.slug + '.js';

    githubGetFile(filePath).then(function (fd) {
      return githubPutFile(filePath, content, fd.sha, 'SenkoLib: edit layout in ' + col.slug);
    }).then(function () {
      _colHideOverlay('colEditLayoutOverlay');
      _colRenderLayoutsGrid(updated);
      showToast();
    }).catch(function (err) { alert('Erro ao editar layout: ' + err.message); });
  });
  anchor.appendChild(btn);
}

/* ── Injetar botões de excluir nos cards ────────────────────────────── */

function _ghcInjectDeleteButtons() {
  // Observer para injetar em cards gerados dinamicamente
  var observer = new MutationObserver(function () {
    document.querySelectorAll('.col-delete-anchor:not([data-gh-injected])').forEach(function (anchor) {
      anchor.setAttribute('data-gh-injected', '1');
      var slug = anchor.dataset.colSlug;
      if (!slug) return;

      var btn = document.createElement('button');
      btn.className   = 'btn btn-ghost';
      btn.style.color       = 'var(--red)';
      btn.style.borderColor = 'var(--red)';
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
      btn.title = 'Excluir coleção';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var col = ColLib.getBySlug(slug);
        if (!col) return;
        colOpenConfirm({
          title:     'Excluir coleção',
          body:      'Excluir "' + col.name + '" permanentemente? Esta ação não pode ser desfeita.',
          labelOk:   'Excluir',
          danger:    true,
          onConfirm: function () { _ghcDeleteCollection(slug); },
        });
      });
      anchor.appendChild(btn);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function _ghcDeleteCollection(slug) {
  if (!ghEnsureToken()) return;
  var filePath = 'colecoes/data/' + slug + '.js';

  githubGetFile(filePath).then(function (fd) {
    // Apaga o arquivo (GitHub API: PUT com conteúdo vazio não funciona; usa DELETE)
    var url = 'https://api.github.com/repos/' + _ghOwner + '/' + _ghRepo + '/contents/' + filePath;
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'token ' + ghGetToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'SenkoLib: delete collection ' + slug, sha: fd.sha }),
    });
  }).then(function () {
    return new Promise(function (resolve) { _ghcRemoveScriptFromIndex(slug, resolve); });
  }).then(function () {
    ColLib.removeCollection(slug);
    colMarkGridDirty();
    colRenderGrid();
    showToast();
  }).catch(function (err) { alert('Erro ao excluir coleção: ' + err.message); });
}
