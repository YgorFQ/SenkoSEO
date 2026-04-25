/*
 * Modais de Colecoes
 * Responsabilidade: criar e controlar os 7 modais lazy do sistema de colecoes.
 * Dependencias: ColGroups, ColLib e helpers globais da Biblioteca.
 * Expoe: funcoes publicas colOpen*, colGet* usadas pela UI e GitHub.
 */
(function (global) {
  var _colCurrentCollection = null;
  var _colCurrentLayout = null;
  var _colNewGroupCallback = null;
  var _colConfirmCallback = null;
  var _overlayClicks = {};
  var _colors = ['#1a9e52', '#06b6d4', '#f59e0b', '#e36a00', '#8b5cf6', '#ef4444', '#14b8a6', '#64748b', '#f43f5e', '#84cc16'];

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function _colMakeOverlay(id) {
    var overlay = $(id);
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'modal-overlay hidden';
    document.body.appendChild(overlay);
    return overlay;
  }

  function _anyOverlayOpen() {
    return !!document.querySelector('.modal-overlay:not(.hidden)');
  }

  function _colShowOverlay(id) {
    var overlay = $(id);
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function _colHideOverlay(id) {
    var overlay = $(id);
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (!_anyOverlayOpen()) document.body.style.overflow = '';
  }

  function _colOverlayClick(overlayId, modalId, closeFn) {
    var overlay = $(overlayId);
    if (!overlay || overlay._colOverlayBound) return;
    overlay._colOverlayBound = true;
    overlay.addEventListener('click', function (event) {
      var now;
      if (event.target.id !== overlayId) return;
      now = Date.now();
      if (_overlayClicks[overlayId] && now - _overlayClicks[overlayId] < 400) {
        closeFn();
        _overlayClicks[overlayId] = 0;
        return;
      }
      _overlayClicks[overlayId] = now;
    });
  }

  function colCloseAllModals() {
    var ids = ['colConfirmOverlay', 'colEditLayoutOverlay', 'colAddLayoutOverlay', 'colNewGroupOverlay', 'colEditOverlay', 'colCreateOverlay', 'colCollectionOverlay'];
    var i;
    for (i = 0; i < ids.length; i += 1) _colHideOverlay(ids[i]);
  }

  function _colSlugify(name) {
    if (global.ColGroups && ColGroups.slugify) return ColGroups.slugify(name);
    return String(name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function _colValidSlug(slug) {
    return /^[a-z0-9-]+$/.test(slug || '') && String(slug || '').length >= 2;
  }

  function _colRefreshPreview(iframeId, html, css) {
    var frame = $(iframeId);
    if (!frame) return;
    frame.srcdoc = '';
    setTimeout(function () {
      frame.srcdoc = global.buildSrcDoc ? global.buildSrcDoc(html, css) : '<style>' + (css || '') + '</style>' + (html || '');
    }, 50);
  }

  function _colPopulateGroupSelect(selectEl, selectedSlug) {
    var groups = ColGroups.getAll();
    var html = '<option value="">Selecione um grupo</option>';
    var i;
    if (!selectEl) return;
    for (i = 0; i < groups.length; i += 1) {
      html += '<option value="' + escapeHtml(groups[i].slug) + '"' + (groups[i].slug === selectedSlug ? ' selected' : '') + '>' + escapeHtml(groups[i].name) + '</option>';
    }
    selectEl.innerHTML = html;
  }

  function _colShowFieldError(id, show) {
    var el = $(id);
    if (el) el.classList.toggle('show', !!show);
  }

  function _getGroup(slug) {
    return ColGroups.getBySlug(slug) || { slug: slug || '', name: slug || 'Sem grupo', cor: '#e36a00' };
  }

  function _parseTags(value) {
    return global.parseTags ? global.parseTags(value) : String(value || '').split(',');
  }

  function _layoutContent(layout) {
    if (!layout) return '';
    return (layout.css ? layout.css + '\n' : '') + (layout.html || '');
  }

  function _switchMode(rootId, mode) {
    var root = $(rootId);
    var buttons;
    var panels;
    var i;
    if (!root) return;
    buttons = root.querySelectorAll('[data-col-mode]');
    panels = root.querySelectorAll('[data-col-panel]');
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].classList.toggle('active', buttons[i].getAttribute('data-col-mode') === mode);
    }
    for (i = 0; i < panels.length; i += 1) {
      panels[i].classList.toggle('active', panels[i].getAttribute('data-col-panel') === mode);
    }
  }

  function _buildCollectionModal() {
    var overlay;
    if ($('colCollectionOverlay')) return;
    overlay = _colMakeOverlay('colCollectionOverlay');
    overlay.innerHTML =
      '<div class="modal col-modal" id="colCollectionModal" role="dialog" aria-modal="true">' +
        '<div class="col-modal-header">' +
          '<div class="col-modal-header-left">' +
            '<div class="col-modal-category">Coleção</div>' +
            '<h2 class="col-modal-title" id="colCollectionTitle"></h2>' +
          '</div>' +
          '<div class="col-modal-header-right">' +
            '<span class="col-modal-group-badge" id="colCollectionGroupBadge"></span>' +
            '<button class="btn btn-ghost" id="colCollectionEditBtn" type="button">Editar</button>' +
            '<button class="modal-close" id="colCollectionCloseBtn" type="button" aria-label="Fechar">×</button>' +
          '</div>' +
        '</div>' +
        '<div class="col-modal-layouts-wrap"><div class="col-modal-layouts-grid" id="colCollectionLayoutsGrid"></div></div>' +
      '</div>';
    $('colCollectionCloseBtn').addEventListener('click', colCloseCollectionModal);
    $('colCollectionEditBtn').addEventListener('click', function () {
      if (_colCurrentCollection) colOpenEditModal(_colCurrentCollection);
    });
    _colOverlayClick('colCollectionOverlay', 'colCollectionModal', colCloseCollectionModal);
  }

  function _colRenderLayoutsGrid() {
    var grid = $('colCollectionLayoutsGrid');
    var layouts = _colCurrentCollection && _colCurrentCollection.layouts ? _colCurrentCollection.layouts : [];
    var i;
    var block;
    var add;
    if (!grid) return;
    grid.innerHTML = '';
    for (i = 0; i < layouts.length; i += 1) {
      block = _createCollectionLayoutBlock(layouts[i]);
      grid.appendChild(block);
    }
    add = document.createElement('article');
    add.className = 'col-layout-add-card';
    add.innerHTML = '<button type="button" id="colOpenAddLayoutBtn"><span class="col-layout-add-icon">+</span><span>Adicionar Layout</span></button>';
    add.querySelector('button').addEventListener('click', colOpenAddLayoutModal);
    grid.appendChild(add);
    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function _createCollectionLayoutBlock(layout) {
    var block = document.createElement('article');
    var iframe;
    block.className = 'col-layout-block';
    block.innerHTML =
      '<div class="col-layout-preview">' +
        '<iframe title="Preview de ' + escapeHtml(layout.name) + '"></iframe>' +
        '<div class="col-layout-preview-overlay" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="col-layout-body"><h3 class="col-layout-name">' + escapeHtml(layout.name) + '</h3></div>' +
      '<div class="col-layout-footer">' +
        '<button class="btn btn-ghost col-copy-layout-btn" type="button">Copiar tudo</button>' +
        '<button class="btn btn-ghost col-edit-layout-btn" type="button">Editar</button>' +
        '<span class="col-layout-delete-anchor" data-col-slug="' + escapeHtml(_colCurrentCollection.slug) + '" data-layout-id="' + escapeHtml(layout.id) + '"></span>' +
      '</div>';
    iframe = block.querySelector('iframe');
    if (global.lazyIframe) global.lazyIframe(iframe, layout.html, layout.css);
    block.querySelector('.col-copy-layout-btn').addEventListener('click', function () {
      global.copyToClipboard(_layoutContent(layout), this, '✓ Layout copiado!');
    });
    block.querySelector('.col-edit-layout-btn').addEventListener('click', function () {
      colOpenEditLayoutModal(layout);
    });
    return block;
  }

  function colOpenCollectionModal(col) {
    var group;
    _buildCollectionModal();
    _colCurrentCollection = col;
    group = _getGroup(col.group);
    $('colCollectionModal').style.setProperty('--col-color', group.cor);
    $('colCollectionTitle').textContent = col.name;
    $('colCollectionGroupBadge').textContent = group.name;
    _colRenderLayoutsGrid();
    _colShowOverlay('colCollectionOverlay');
  }

  function colCloseCollectionModal() {
    _colHideOverlay('colCollectionOverlay');
  }

  function _buildCreateModal() {
    var overlay;
    if ($('colCreateOverlay')) return;
    overlay = _colMakeOverlay('colCreateOverlay');
    overlay.innerHTML =
      '<div class="modal col-form-modal" id="colCreateModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><div><div class="col-modal-category">Coleção</div><h2 class="col-modal-title">Criar Coleção</h2></div><button class="modal-close" id="colCreateCloseBtn" type="button">×</button></div>' +
        '<div class="col-form-body">' +
          '<label class="col-field">Nome <input id="colCreateName" type="text"><span class="col-field-error" id="colCreateNameError">Informe ao menos 3 caracteres.</span></label>' +
          '<label class="col-field">Slug <input id="colCreateSlug" type="text"><span class="col-field-hint" id="colCreateSlugHint">colecoes/data/[slug].js</span><span class="col-field-error" id="colCreateSlugError">Use letras minúsculas, números e hífen.</span></label>' +
          '<div class="col-field-row"><label class="col-field">Grupo <select class="col-group-select" id="colCreateGroup"></select><span class="col-field-error" id="colCreateGroupError">Escolha um grupo.</span></label><button class="col-group-new-btn" id="colCreateNewGroupBtn" type="button">+ Novo grupo</button></div>' +
          '<label class="col-field">Tags <input id="colCreateTags" type="text" placeholder="hero, responsivo"></label>' +
        '</div>' +
        '<div class="col-form-footer"><button class="col-btn-cancel" id="colCreateCancelBtn" type="button">Cancelar</button><span id="colCreateGhAnchor"></span></div>' +
      '</div>';
    $('colCreateCloseBtn').addEventListener('click', colCloseCreateModal);
    $('colCreateCancelBtn').addEventListener('click', colCloseCreateModal);
    $('colCreateName').addEventListener('input', function () {
      $('colCreateSlug').value = _colSlugify(this.value);
      $('colCreateSlugHint').textContent = 'colecoes/data/' + ($('colCreateSlug').value || '[slug]') + '.js';
    });
    $('colCreateSlug').addEventListener('input', function () {
      $('colCreateSlugHint').textContent = 'colecoes/data/' + (this.value || '[slug]') + '.js';
    });
    $('colCreateNewGroupBtn').addEventListener('click', function () {
      colOpenNewGroupModal(function (group) {
        _colPopulateGroupSelect($('colCreateGroup'), group.slug);
      });
    });
    _colOverlayClick('colCreateOverlay', 'colCreateModal', colCloseCreateModal);
  }

  function colOpenCreateModal() {
    _buildCreateModal();
    $('colCreateName').value = '';
    $('colCreateSlug').value = '';
    $('colCreateTags').value = '';
    $('colCreateSlugHint').textContent = 'colecoes/data/[slug].js';
    _colPopulateGroupSelect($('colCreateGroup'), '');
    _colShowFieldError('colCreateNameError', false);
    _colShowFieldError('colCreateSlugError', false);
    _colShowFieldError('colCreateGroupError', false);
    _colShowOverlay('colCreateOverlay');
    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function colCloseCreateModal() {
    _colHideOverlay('colCreateOverlay');
  }

  function colGetCreateFormData() {
    var data = {
      name: $('colCreateName') ? $('colCreateName').value.trim() : '',
      slug: $('colCreateSlug') ? $('colCreateSlug').value.trim() : '',
      group: $('colCreateGroup') ? $('colCreateGroup').value : '',
      tags: _parseTags($('colCreateTags') ? $('colCreateTags').value : '')
    };
    _colShowFieldError('colCreateNameError', data.name.length < 3);
    _colShowFieldError('colCreateSlugError', !_colValidSlug(data.slug));
    _colShowFieldError('colCreateGroupError', !data.group);
    if (data.name.length < 3 || !_colValidSlug(data.slug) || !data.group) return null;
    return data;
  }

  function _buildEditModal() {
    var overlay;
    if ($('colEditOverlay')) return;
    overlay = _colMakeOverlay('colEditOverlay');
    overlay.innerHTML =
      '<div class="modal col-form-modal" id="colEditModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><div><div class="col-modal-category">Coleção</div><h2 class="col-modal-title">Editar Coleção</h2></div><button class="modal-close" id="colEditCloseBtn" type="button">×</button></div>' +
        '<div class="col-form-body">' +
          '<input id="colEditSlug" type="hidden">' +
          '<label class="col-field">Nome <input id="colEditName" type="text"><span class="col-field-error" id="colEditNameError">Informe ao menos 3 caracteres.</span></label>' +
          '<div class="col-field-row"><label class="col-field">Grupo <select class="col-group-select" id="colEditGroup"></select><span class="col-field-error" id="colEditGroupError">Escolha um grupo.</span></label><button class="col-group-new-btn" id="colEditNewGroupBtn" type="button">+ Novo grupo</button></div>' +
          '<label class="col-field">Tags <input id="colEditTags" type="text"></label>' +
        '</div>' +
        '<div class="col-form-footer"><button class="col-btn-cancel" id="colEditCancelBtn" type="button">Cancelar</button><span id="colEditGhAnchor"></span></div>' +
      '</div>';
    $('colEditCloseBtn').addEventListener('click', colCloseEditModal);
    $('colEditCancelBtn').addEventListener('click', colCloseEditModal);
    $('colEditNewGroupBtn').addEventListener('click', function () {
      colOpenNewGroupModal(function (group) {
        _colPopulateGroupSelect($('colEditGroup'), group.slug);
      });
    });
    _colOverlayClick('colEditOverlay', 'colEditModal', colCloseEditModal);
  }

  function colOpenEditModal(col) {
    _buildEditModal();
    _colCurrentCollection = col;
    $('colEditSlug').value = col.slug;
    $('colEditName').value = col.name || '';
    $('colEditTags').value = (col.tags || []).join(', ');
    _colPopulateGroupSelect($('colEditGroup'), col.group);
    _colShowFieldError('colEditNameError', false);
    _colShowFieldError('colEditGroupError', false);
    _colShowOverlay('colEditOverlay');
    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function colCloseEditModal() {
    _colHideOverlay('colEditOverlay');
  }

  function colGetEditFormData() {
    var data = {
      slug: $('colEditSlug') ? $('colEditSlug').value : '',
      name: $('colEditName') ? $('colEditName').value.trim() : '',
      group: $('colEditGroup') ? $('colEditGroup').value : '',
      tags: _parseTags($('colEditTags') ? $('colEditTags').value : '')
    };
    _colShowFieldError('colEditNameError', data.name.length < 3);
    _colShowFieldError('colEditGroupError', !data.group);
    if (data.name.length < 3 || !data.group) return null;
    return data;
  }

  function _buildNewGroupModal() {
    var overlay;
    var i;
    var swatches = '';
    if ($('colNewGroupOverlay')) return;
    for (i = 0; i < _colors.length; i += 1) {
      swatches += '<button class="col-color-swatch' + (i === 0 ? ' active' : '') + '" type="button" data-color="' + _colors[i] + '" style="--swatch:' + _colors[i] + '"></button>';
    }
    overlay = _colMakeOverlay('colNewGroupOverlay');
    overlay.innerHTML =
      '<div class="modal col-newgroup-modal" id="colNewGroupModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><div><div class="col-modal-category">Grupo</div><h2 class="col-modal-title">Novo Grupo</h2></div><button class="modal-close" id="colNewGroupCloseBtn" type="button">×</button></div>' +
        '<div class="col-form-body">' +
          '<label class="col-field">Nome <input id="colNewGroupName" type="text"><span class="col-field-error" id="colNewGroupNameError">Informe um nome válido.</span></label>' +
          '<div class="col-field">Cor <div class="col-color-palette" id="colColorPalette">' + swatches + '</div></div>' +
          '<label class="col-field">Hex customizado <div class="col-color-custom-wrap"><span class="col-color-preview" id="colColorPreview"></span><input class="col-color-hex-input" id="colNewGroupColor" type="text" value="' + _colors[0] + '"></div></label>' +
        '</div>' +
        '<div class="col-form-footer"><button class="col-btn-cancel" id="colNewGroupCancelBtn" type="button">Cancelar</button><button class="col-btn-primary" id="colNewGroupSaveBtn" type="button">Criar grupo</button></div>' +
      '</div>';
    $('colNewGroupCloseBtn').addEventListener('click', colCloseNewGroupModal);
    $('colNewGroupCancelBtn').addEventListener('click', colCloseNewGroupModal);
    $('colNewGroupSaveBtn').addEventListener('click', _colCreateGroupFromModal);
    $('colNewGroupColor').addEventListener('input', function () {
      $('colColorPreview').style.background = this.value;
    });
    $('colColorPalette').addEventListener('click', function (event) {
      var btn = event.target.closest('[data-color]');
      var all;
      var i;
      if (!btn) return;
      all = $('colColorPalette').querySelectorAll('[data-color]');
      for (i = 0; i < all.length; i += 1) all[i].classList.remove('active');
      btn.classList.add('active');
      $('colNewGroupColor').value = btn.getAttribute('data-color');
      $('colColorPreview').style.background = btn.getAttribute('data-color');
    });
    _colOverlayClick('colNewGroupOverlay', 'colNewGroupModal', colCloseNewGroupModal);
  }

  function colOpenNewGroupModal(callback) {
    _buildNewGroupModal();
    _colNewGroupCallback = callback || null;
    $('colNewGroupName').value = '';
    $('colNewGroupColor').value = _colors[0];
    $('colColorPreview').style.background = _colors[0];
    _colShowFieldError('colNewGroupNameError', false);
    _colShowOverlay('colNewGroupOverlay');
  }

  function colCloseNewGroupModal() {
    _colHideOverlay('colNewGroupOverlay');
  }

  function _colCreateGroupFromModal() {
    var name = $('colNewGroupName').value.trim();
    var slug = _colSlugify(name);
    var color = $('colNewGroupColor').value.trim() || _colors[0];
    var group;
    _colShowFieldError('colNewGroupNameError', !_colValidSlug(slug));
    if (!_colValidSlug(slug)) return;
    group = { slug: slug, name: name, cor: color };
    ColGroups.addPending(group);
    if (_colNewGroupCallback) _colNewGroupCallback(group);
    colCloseNewGroupModal();
  }

  function _buildAddLayoutModal() {
    var overlay;
    if ($('colAddLayoutOverlay')) return;
    overlay = _colMakeOverlay('colAddLayoutOverlay');
    overlay.innerHTML =
      '<div class="modal col-layout-form-modal" id="colAddLayoutModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><div><div class="col-modal-category">Layout</div><h2 class="col-modal-title">Adicionar Layout</h2></div><button class="modal-close" id="colAddLayoutCloseBtn" type="button">×</button></div>' +
        '<div class="col-form-body">' +
          '<div class="col-field-row"><label class="col-field">ID <input id="colAddLayoutId" type="text"><span class="col-field-error" id="colAddLayoutIdError">Use letras minúsculas, números e hífen.</span></label><label class="col-field">Nome <input id="colAddLayoutName" type="text"><span class="col-field-error" id="colAddLayoutNameError">Informe um nome.</span></label></div>' +
          '<div class="col-edit-mode-bar"><button class="col-edit-mode-btn active" type="button" data-col-mode="content">Conteúdo</button><button class="col-edit-mode-btn" type="button" data-col-mode="preview">Preview</button></div>' +
          '<div class="col-edit-main" id="colAddLayoutMain">' +
            '<section class="col-edit-panel active" data-col-panel="content"><textarea class="col-edit-textarea" id="colAddLayoutContent" spellcheck="false"></textarea></section>' +
            '<section class="col-edit-panel" data-col-panel="preview"><iframe class="col-edit-iframe" id="colAddLayoutPreview" title="Preview"></iframe></section>' +
          '</div>' +
        '</div>' +
        '<div class="col-form-footer"><button class="col-btn-cancel" id="colAddLayoutCancelBtn" type="button">Cancelar</button><span id="colAddLayoutGhAnchor"></span></div>' +
      '</div>';
    $('colAddLayoutCloseBtn').addEventListener('click', colCloseAddLayoutModal);
    $('colAddLayoutCancelBtn').addEventListener('click', colCloseAddLayoutModal);
    _bindLayoutMode('colAddLayoutModal', 'colAddLayoutPreview', 'colAddLayoutContent');
    _colOverlayClick('colAddLayoutOverlay', 'colAddLayoutModal', colCloseAddLayoutModal);
  }

  function _bindLayoutMode(modalId, iframeId, textareaId) {
    var modal = $(modalId);
    var buttons = modal.querySelectorAll('[data-col-mode]');
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener('click', function () {
        var mode = this.getAttribute('data-col-mode');
        _switchMode(modalId, mode);
        if (mode === 'preview' || mode === 'visualizar') {
          _colRefreshPreview(iframeId, $(textareaId).value, '');
        }
      });
    }
  }

  function colOpenAddLayoutModal() {
    _buildAddLayoutModal();
    _colCurrentLayout = null;
    $('colAddLayoutId').value = '';
    $('colAddLayoutName').value = '';
    $('colAddLayoutContent').value = '';
    _colShowFieldError('colAddLayoutIdError', false);
    _colShowFieldError('colAddLayoutNameError', false);
    _switchMode('colAddLayoutModal', 'content');
    _colShowOverlay('colAddLayoutOverlay');
    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function colCloseAddLayoutModal() {
    _colHideOverlay('colAddLayoutOverlay');
  }

  function colGetAddLayoutFormData() {
    var data = {
      id: $('colAddLayoutId') ? $('colAddLayoutId').value.trim() : '',
      name: $('colAddLayoutName') ? $('colAddLayoutName').value.trim() : '',
      html: $('colAddLayoutContent') ? $('colAddLayoutContent').value : '',
      css: ''
    };
    _colShowFieldError('colAddLayoutIdError', !_colValidSlug(data.id));
    _colShowFieldError('colAddLayoutNameError', !data.name);
    if (!_colValidSlug(data.id) || !data.name) return null;
    return data;
  }

  function _buildEditLayoutModal() {
    var overlay;
    if ($('colEditLayoutOverlay')) return;
    overlay = _colMakeOverlay('colEditLayoutOverlay');
    overlay.innerHTML =
      '<div class="modal col-layout-form-modal" id="colEditLayoutModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><div><div class="col-modal-category">Layout</div><h2 class="col-modal-title">Editar Layout</h2></div><button class="modal-close" id="colEditLayoutCloseBtn" type="button">×</button></div>' +
        '<div class="col-form-body">' +
          '<input id="colEditLayoutId" type="hidden">' +
          '<label class="col-field">Nome <input id="colEditLayoutName" type="text"><span class="col-field-error" id="colEditLayoutNameError">Informe um nome.</span></label>' +
          '<div class="col-edit-mode-bar"><button class="col-edit-mode-btn" type="button" data-col-mode="content">Conteúdo</button><button class="col-edit-mode-btn active" type="button" data-col-mode="visualizar">Visualizar</button></div>' +
          '<div class="col-edit-main" id="colEditLayoutMain">' +
            '<section class="col-edit-panel" data-col-panel="content"><textarea class="col-edit-textarea" id="colEditLayoutContent" spellcheck="false"></textarea></section>' +
            '<section class="col-edit-panel active" data-col-panel="visualizar"><iframe class="col-edit-iframe" id="colEditLayoutPreview" title="Preview"></iframe></section>' +
          '</div>' +
        '</div>' +
        '<div class="col-form-footer"><button class="col-btn-cancel" id="colEditLayoutCancelBtn" type="button">Cancelar</button><span id="colEditLayoutGhAnchor"></span></div>' +
      '</div>';
    $('colEditLayoutCloseBtn').addEventListener('click', colCloseEditLayoutModal);
    $('colEditLayoutCancelBtn').addEventListener('click', colCloseEditLayoutModal);
    _bindLayoutMode('colEditLayoutModal', 'colEditLayoutPreview', 'colEditLayoutContent');
    _colOverlayClick('colEditLayoutOverlay', 'colEditLayoutModal', colCloseEditLayoutModal);
  }

  function colOpenEditLayoutModal(layout) {
    _buildEditLayoutModal();
    _colCurrentLayout = layout;
    $('colEditLayoutId').value = layout.id || '';
    $('colEditLayoutName').value = layout.name || '';
    $('colEditLayoutContent').value = _layoutContent(layout);
    _colShowFieldError('colEditLayoutNameError', false);
    _switchMode('colEditLayoutModal', 'visualizar');
    _colShowOverlay('colEditLayoutOverlay');
    _colRefreshPreview('colEditLayoutPreview', $('colEditLayoutContent').value, '');
    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function colCloseEditLayoutModal() {
    _colHideOverlay('colEditLayoutOverlay');
    _colCurrentLayout = null;
  }

  function colGetEditLayoutFormData() {
    var data = {
      id: $('colEditLayoutId') ? $('colEditLayoutId').value : '',
      name: $('colEditLayoutName') ? $('colEditLayoutName').value.trim() : '',
      html: $('colEditLayoutContent') ? $('colEditLayoutContent').value : '',
      css: ''
    };
    _colShowFieldError('colEditLayoutNameError', !data.name);
    if (!data.name) return null;
    return data;
  }

  function _buildConfirmModal() {
    var overlay;
    if ($('colConfirmOverlay')) return;
    overlay = _colMakeOverlay('colConfirmOverlay');
    overlay.innerHTML =
      '<div class="modal col-confirm-modal" id="colConfirmModal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><h2 class="col-confirm-title" id="colConfirmTitle"></h2><button class="modal-close" id="colConfirmCloseBtn" type="button">×</button></div>' +
        '<p class="col-confirm-body" id="colConfirmBody"></p>' +
        '<div class="col-confirm-actions"><button class="col-btn-cancel" id="colConfirmCancelBtn" type="button">Cancelar</button><button class="col-btn-primary" id="colConfirmOkBtn" type="button">OK</button></div>' +
      '</div>';
    $('colConfirmCloseBtn').addEventListener('click', colCloseConfirm);
    $('colConfirmCancelBtn').addEventListener('click', colCloseConfirm);
    $('colConfirmOkBtn').addEventListener('click', function () {
      var cb = _colConfirmCallback;
      colCloseConfirm();
      if (cb) cb();
    });
    _colOverlayClick('colConfirmOverlay', 'colConfirmModal', colCloseConfirm);
  }

  function colOpenConfirm(options) {
    var ok;
    _buildConfirmModal();
    options = options || {};
    _colConfirmCallback = options.onConfirm || null;
    $('colConfirmTitle').textContent = options.title || 'Confirmar ação';
    $('colConfirmBody').textContent = options.body || '';
    ok = $('colConfirmOkBtn');
    ok.textContent = options.labelOk || 'OK';
    ok.className = options.danger ? 'col-btn-delete' : 'col-btn-primary';
    _colShowOverlay('colConfirmOverlay');
  }

  function colCloseConfirm() {
    _colHideOverlay('colConfirmOverlay');
  }

  function bindEscape() {
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if ($('colConfirmOverlay') && !$('colConfirmOverlay').classList.contains('hidden')) return colCloseConfirm();
      if ($('colEditLayoutOverlay') && !$('colEditLayoutOverlay').classList.contains('hidden')) return colCloseEditLayoutModal();
      if ($('colAddLayoutOverlay') && !$('colAddLayoutOverlay').classList.contains('hidden')) return colCloseAddLayoutModal();
      if ($('colNewGroupOverlay') && !$('colNewGroupOverlay').classList.contains('hidden')) return colCloseNewGroupModal();
      if ($('colEditOverlay') && !$('colEditOverlay').classList.contains('hidden')) return colCloseEditModal();
      if ($('colCreateOverlay') && !$('colCreateOverlay').classList.contains('hidden')) return colCloseCreateModal();
      if ($('colCollectionOverlay') && !$('colCollectionOverlay').classList.contains('hidden')) return colCloseCollectionModal();
    });
  }

  function init() {
    bindEscape();
  }

  global.colOpenCollectionModal = colOpenCollectionModal;
  global.colCloseCollectionModal = colCloseCollectionModal;
  global.colOpenCreateModal = colOpenCreateModal;
  global.colCloseCreateModal = colCloseCreateModal;
  global.colOpenEditModal = colOpenEditModal;
  global.colCloseEditModal = colCloseEditModal;
  global.colOpenNewGroupModal = colOpenNewGroupModal;
  global.colOpenAddLayoutModal = colOpenAddLayoutModal;
  global.colCloseAddLayoutModal = colCloseAddLayoutModal;
  global.colOpenEditLayoutModal = colOpenEditLayoutModal;
  global.colCloseEditLayoutModal = colCloseEditLayoutModal;
  global.colOpenConfirm = colOpenConfirm;
  global.colCloseAllModals = colCloseAllModals;
  global.colGetCreateFormData = colGetCreateFormData;
  global.colGetEditFormData = colGetEditFormData;
  global.colGetAddLayoutFormData = colGetAddLayoutFormData;
  global.colGetEditLayoutFormData = colGetEditLayoutFormData;
  global.colGetCurrentCollection = function () { return _colCurrentCollection; };
  global.colGetCurrentLayout = function () { return _colCurrentLayout; };
  global.colRenderCurrentLayouts = _colRenderLayoutsGrid;

  document.addEventListener('DOMContentLoaded', init);
}(window));
