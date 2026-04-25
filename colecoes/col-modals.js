/* ============================================================================
   col-modals.js - Modais dinamicos de Colecoes

   RESPONSABILIDADE:
     Cria e controla os sete modais do sistema de colecoes, incluindo
     visualizacao, formularios, layouts internos, novo grupo e confirmacao.

   EXPOE (globais):
     colOpenCollectionModal(), colOpenCreateModal(), colOpenEditModal()
     colOpenAddLayoutModal(), colOpenEditLayoutModal(), colOpenConfirm()
     colGetCreateFormData(), colGetEditFormData()
     colGetAddLayoutFormData(), colGetEditLayoutFormData()

   DEPENDENCIAS:
     utils.js, col-groups.js, col-core.js, col-script.js.

   ORDEM DE CARREGAMENTO:
     Depois de col-script.js e antes dos modulos GitHub.
============================================================================ */

var _colCurrentCollection = null;
var _colCurrentLayout = null;
var _colNewGroupCallback = null;
var _colConfirmCallback = null;
var _colPalette = ['#1a9e52', '#06b6d4', '#f59e0b', '#ff6b00', '#8b5cf6', '#ef4444', '#14b8a6', '#64748b', '#ec4899', '#84cc16'];

function _colMakeOverlay(id, html) {
  var overlay = document.getElementById(id);
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = id;
  overlay.className = 'modal-overlay hidden';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  return overlay;
}

function _colShowOverlay(id) {
  document.getElementById(id).classList.remove('hidden');
  setBodyLocked(true);
}

function _colHideOverlay(id) {
  var overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('hidden');
  setBodyLocked(_colAnyOpen());
}

function _colAnyOpen() {
  var ids = ['colCollectionOverlay', 'colCreateOverlay', 'colEditOverlay', 'colNewGroupOverlay', 'colAddLayoutOverlay', 'colEditLayoutOverlay', 'colConfirmOverlay'];
  var i;
  for (i = 0; i < ids.length; i += 1) {
    if (document.getElementById(ids[i]) && !document.getElementById(ids[i]).classList.contains('hidden')) return true;
  }
  return false;
}

function _colSlugify(name) {
  return ColGroups.slugify(name);
}

function _colValidSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2;
}

function _colRefreshPreview(iframeId, html, css) {
  refreshModalPreview(document.getElementById(iframeId), html, css);
}

function _colPopulateGroupSelect(selectEl, selectedSlug) {
  selectEl.textContent = '';
  ColGroups.getAll().forEach(function (group) {
    var option = document.createElement('option');
    option.value = group.slug;
    option.textContent = group.name;
    if (group.slug === selectedSlug) option.selected = true;
    selectEl.appendChild(option);
  });
}

function _colShowFieldError(id, show) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('show', !!show);
}

function colCloseAllModals() {
  ['colConfirmOverlay', 'colEditLayoutOverlay', 'colAddLayoutOverlay', 'colNewGroupOverlay', 'colEditOverlay', 'colCreateOverlay', 'colCollectionOverlay'].forEach(function (id) {
    var overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('hidden');
  });
  setBodyLocked(false);
}

function _colBuildCollectionModal() {
  var overlay;
  if (document.getElementById('colCollectionOverlay')) return;
  overlay = _colMakeOverlay('colCollectionOverlay',
    '<div class="modal col-modal" id="colCollectionModal" role="dialog" aria-modal="true" aria-labelledby="colCollectionTitle">' +
      '<div class="modal-header col-modal-header">' +
        '<div class="col-modal-header-left"><div class="col-modal-category">Colecao</div><h2 class="col-modal-title" id="colCollectionTitle">Colecao</h2><span class="col-modal-group-badge" id="colCollectionGroup">Grupo</span></div>' +
        '<div class="col-modal-header-right"><button class="btn btn-ghost" id="colEditMetaBtn" type="button">' + iconSvg('edit') + '<span>Editar</span></button><button class="modal-close" id="colCollectionCloseBtn" type="button">&times;</button></div>' +
      '</div>' +
      '<div class="modal-body"><div class="col-modal-layouts-wrap"><div class="col-modal-layouts-grid" id="colLayoutsGrid"></div></div></div>' +
    '</div>');
  document.getElementById('colCollectionCloseBtn').addEventListener('click', function () { _colHideOverlay('colCollectionOverlay'); });
  document.getElementById('colEditMetaBtn').addEventListener('click', function () {
    if (_colCurrentCollection) colOpenEditModal(_colCurrentCollection);
  });
  overlayClick('colCollectionOverlay', function () { _colHideOverlay('colCollectionOverlay'); });
}

function colCreateLayoutBlock(layout) {
  var block = document.createElement('article');
  var preview = document.createElement('div');
  var iframe = document.createElement('iframe');
  var overlay = document.createElement('span');
  var body = document.createElement('div');
  var name = document.createElement('div');
  var footer = document.createElement('div');
  var copyBtn = makeButton('btn btn-ghost', iconSvg('copy') + '<span>Copiar tudo</span>', 'Copiar tudo');
  var editBtn = makeButton('btn btn-edit-icon', iconSvg('edit'), 'Editar layout');
  var deleteAnchor = document.createElement('span');

  block.className = 'col-layout-block';
  preview.className = 'col-layout-preview';
  iframe.className = 'card-iframe';
  overlay.className = 'col-layout-preview-overlay';
  body.className = 'col-layout-body';
  name.className = 'col-layout-name';
  footer.className = 'col-layout-footer';
  deleteAnchor.className = 'col-layout-delete-anchor';
  deleteAnchor.setAttribute('data-layout-id', layout.id);
  name.textContent = layout.name;

  iframe.addEventListener('load', function () { scaleCardIframe(iframe); });
  lazyIframe(iframe, layout.html, layout.css);
  copyBtn.addEventListener('click', function () {
    copyToClipboard((layout.css || '') + '\n' + (layout.html || ''), copyBtn, 'Layout copiado!');
  });
  editBtn.addEventListener('click', function () {
    colOpenEditLayoutModal(layout);
  });

  preview.appendChild(iframe);
  preview.appendChild(overlay);
  footer.appendChild(copyBtn);
  footer.appendChild(editBtn);
  footer.appendChild(deleteAnchor);
  body.appendChild(name);
  body.appendChild(footer);
  block.appendChild(preview);
  block.appendChild(body);
  return block;
}

function colRenderLayoutsGrid() {
  var grid = document.getElementById('colLayoutsGrid');
  var fragment = document.createDocumentFragment();
  var addCard = document.createElement('button');
  if (!grid || !_colCurrentCollection) return;
  (_colCurrentCollection.layouts || []).forEach(function (layout) {
    fragment.appendChild(colCreateLayoutBlock(layout));
  });
  addCard.type = 'button';
  addCard.className = 'col-layout-add-card';
  addCard.innerHTML = '<div><span class="col-layout-add-icon">' + iconSvg('plus') + '</span><strong>Adicionar Layout</strong></div>';
  addCard.addEventListener('click', colOpenAddLayoutModal);
  fragment.appendChild(addCard);
  grid.textContent = '';
  grid.appendChild(fragment);
  if (window.ghColInjectLayoutDeleteButtons) window.ghColInjectLayoutDeleteButtons();
}

function colOpenCollectionModal(col) {
  var group = ColGroups.getBySlug(col.group) || { name: 'Sem grupo', cor: '#ff7a1a' };
  _colBuildCollectionModal();
  _colCurrentCollection = ColLib.getBySlug(col.slug) || col;
  document.getElementById('colCollectionTitle').textContent = _colCurrentCollection.name;
  document.getElementById('colCollectionGroup').textContent = group.name;
  document.getElementById('colCollectionGroup').style.color = group.cor;
  document.getElementById('colCollectionModal').style.borderTopColor = group.cor;
  colRenderLayoutsGrid();
  _colShowOverlay('colCollectionOverlay');
}

function _colBuildCreateModal() {
  var overlay;
  if (document.getElementById('colCreateOverlay')) return;
  overlay = _colMakeOverlay('colCreateOverlay',
    '<div class="modal col-form-modal" id="colCreateModal" role="dialog" aria-modal="true" aria-labelledby="colCreateTitle">' +
      '<div class="col-form-header"><div><div class="modal-category">Nova colecao</div><h2 class="modal-title" id="colCreateTitle">Criar Colecao</h2></div><button class="modal-close" id="colCreateCloseBtn" type="button">&times;</button></div>' +
      '<div class="col-form-body">' +
        '<div class="col-field"><label for="colCreateName">Nome <span class="req">*</span></label><input id="colCreateName" type="text"><div class="col-field-error" id="colCreateNameError">Informe ao menos 3 caracteres.</div></div>' +
        '<div class="col-field"><label for="colCreateSlug">Slug <span class="req">*</span></label><input id="colCreateSlug" type="text"><div class="col-field-hint" id="colCreateSlugHint">colecoes/data/[slug].js</div><div class="col-field-error" id="colCreateSlugError">Use letras minusculas, numeros e hifen.</div></div>' +
        '<div class="col-field-row"><div class="col-field"><label for="colCreateGroup">Grupo <span class="req">*</span></label><select class="col-group-select" id="colCreateGroup"></select></div><div class="col-field"><label>&nbsp;</label><button class="col-group-new-btn" id="colCreateNewGroupBtn" type="button">+ Novo grupo</button></div></div>' +
        '<div class="col-field"><label for="colCreateTags">Tags</label><input id="colCreateTags" type="text"></div>' +
      '</div>' +
      '<div class="col-form-footer"><span id="colCreateGhAnchor"></span><button class="col-btn-cancel" id="colCreateCancelBtn" type="button">Cancelar</button></div>' +
    '</div>');
  document.getElementById('colCreateCloseBtn').addEventListener('click', function () { _colHideOverlay('colCreateOverlay'); });
  document.getElementById('colCreateCancelBtn').addEventListener('click', function () { _colHideOverlay('colCreateOverlay'); });
  document.getElementById('colCreateName').addEventListener('input', function () {
    document.getElementById('colCreateSlug').value = _colSlugify(this.value);
    document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/' + (document.getElementById('colCreateSlug').value || '[slug]') + '.js';
  });
  document.getElementById('colCreateSlug').addEventListener('input', function () {
    document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/' + (this.value || '[slug]') + '.js';
  });
  document.getElementById('colCreateNewGroupBtn').addEventListener('click', function () {
    colOpenNewGroupModal(function (slug) {
      _colPopulateGroupSelect(document.getElementById('colCreateGroup'), slug);
    });
  });
  overlayClick('colCreateOverlay', function () { _colHideOverlay('colCreateOverlay'); });
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colOpenCreateModal() {
  _colBuildCreateModal();
  document.getElementById('colCreateName').value = '';
  document.getElementById('colCreateSlug').value = '';
  document.getElementById('colCreateTags').value = '';
  document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/[slug].js';
  _colPopulateGroupSelect(document.getElementById('colCreateGroup'), null);
  _colShowOverlay('colCreateOverlay');
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colGetCreateFormData() {
  var name = document.getElementById('colCreateName').value.trim();
  var slug = document.getElementById('colCreateSlug').value.trim();
  var group = document.getElementById('colCreateGroup').value;
  _colShowFieldError('colCreateNameError', name.length < 3);
  _colShowFieldError('colCreateSlugError', !_colValidSlug(slug));
  if (name.length < 3 || !_colValidSlug(slug) || !group) return null;
  return {
    name: name,
    slug: slug,
    group: group,
    tags: parseTags(document.getElementById('colCreateTags').value)
  };
}

function _colBuildEditModal() {
  var overlay;
  if (document.getElementById('colEditOverlay')) return;
  overlay = _colMakeOverlay('colEditOverlay',
    '<div class="modal col-form-modal" id="colEditModal" role="dialog" aria-modal="true" aria-labelledby="colEditTitle">' +
      '<div class="col-form-header"><div><div class="modal-category">Editar colecao</div><h2 class="modal-title" id="colEditTitle">Editar Colecao</h2></div><button class="modal-close" id="colEditCloseBtn" type="button">&times;</button></div>' +
      '<div class="col-form-body">' +
        '<input type="hidden" id="colEditSlug">' +
        '<div class="col-field"><label for="colEditName">Nome <span class="req">*</span></label><input id="colEditName" type="text"><div class="col-field-error" id="colEditNameError">Informe ao menos 3 caracteres.</div></div>' +
        '<div class="col-field-row"><div class="col-field"><label for="colEditGroup">Grupo <span class="req">*</span></label><select class="col-group-select" id="colEditGroup"></select></div><div class="col-field"><label>&nbsp;</label><button class="col-group-new-btn" id="colEditNewGroupBtn" type="button">+ Novo grupo</button></div></div>' +
        '<div class="col-field"><label for="colEditTags">Tags</label><input id="colEditTags" type="text"></div>' +
      '</div>' +
      '<div class="col-form-footer"><span id="colEditGhAnchor"></span><button class="col-btn-cancel" id="colEditCancelBtn" type="button">Cancelar</button></div>' +
    '</div>');
  document.getElementById('colEditCloseBtn').addEventListener('click', function () { _colHideOverlay('colEditOverlay'); });
  document.getElementById('colEditCancelBtn').addEventListener('click', function () { _colHideOverlay('colEditOverlay'); });
  document.getElementById('colEditNewGroupBtn').addEventListener('click', function () {
    colOpenNewGroupModal(function (slug) {
      _colPopulateGroupSelect(document.getElementById('colEditGroup'), slug);
    });
  });
  overlayClick('colEditOverlay', function () { _colHideOverlay('colEditOverlay'); });
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colOpenEditModal(col) {
  var current = ColLib.getBySlug(col.slug) || col;
  _colBuildEditModal();
  document.getElementById('colEditSlug').value = current.slug;
  document.getElementById('colEditName').value = current.name || '';
  document.getElementById('colEditTags').value = (current.tags || []).join(', ');
  _colPopulateGroupSelect(document.getElementById('colEditGroup'), current.group);
  _colShowOverlay('colEditOverlay');
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colGetEditFormData() {
  var name = document.getElementById('colEditName').value.trim();
  _colShowFieldError('colEditNameError', name.length < 3);
  if (name.length < 3) return null;
  return {
    slug: document.getElementById('colEditSlug').value,
    name: name,
    group: document.getElementById('colEditGroup').value,
    tags: parseTags(document.getElementById('colEditTags').value)
  };
}

function _colBuildNewGroupModal() {
  var overlay;
  if (document.getElementById('colNewGroupOverlay')) return;
  overlay = _colMakeOverlay('colNewGroupOverlay',
    '<div class="modal col-newgroup-modal" id="colNewGroupModal" role="dialog" aria-modal="true" aria-labelledby="colNewGroupTitle">' +
      '<div class="col-form-header"><div><div class="modal-category">Novo grupo</div><h2 class="modal-title" id="colNewGroupTitle">Criar Grupo</h2></div><button class="modal-close" id="colNewGroupCloseBtn" type="button">&times;</button></div>' +
      '<div class="col-form-body">' +
        '<div class="col-field"><label for="colNewGroupName">Nome</label><input id="colNewGroupName" type="text"></div>' +
        '<div class="col-field"><label>Cor</label><div class="col-color-palette" id="colColorPalette"></div></div>' +
        '<div class="col-color-custom-wrap"><span class="col-color-preview" id="colColorPreview"></span><input class="col-color-hex-input" id="colColorHex" type="text" value="#1a9e52"></div>' +
      '</div>' +
      '<div class="col-form-footer"><button class="col-btn-cancel" id="colNewGroupCancelBtn" type="button">Cancelar</button><button class="col-btn-primary" id="colNewGroupSaveBtn" type="button">Adicionar</button></div>' +
    '</div>');
  document.getElementById('colNewGroupCloseBtn').addEventListener('click', function () { _colHideOverlay('colNewGroupOverlay'); });
  document.getElementById('colNewGroupCancelBtn').addEventListener('click', function () { _colHideOverlay('colNewGroupOverlay'); });
  document.getElementById('colColorHex').addEventListener('input', function () {
    document.getElementById('colColorPreview').style.background = this.value;
  });
  document.getElementById('colNewGroupSaveBtn').addEventListener('click', function () {
    var name = document.getElementById('colNewGroupName').value.trim();
    var cor = document.getElementById('colColorHex').value.trim() || '#1a9e52';
    var slug = _colSlugify(name);
    if (!name || !slug) return;
    ColGroups.addPending({ slug: slug, name: name, cor: cor });
    if (_colNewGroupCallback) _colNewGroupCallback(slug);
    _colHideOverlay('colNewGroupOverlay');
    colMarkDirty();
  });
  overlayClick('colNewGroupOverlay', function () { _colHideOverlay('colNewGroupOverlay'); });
}

function colRenderPalette(selected) {
  var wrap = document.getElementById('colColorPalette');
  if (!wrap) return;
  wrap.textContent = '';
  _colPalette.forEach(function (color) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'col-color-swatch' + (color === selected ? ' active' : '');
    btn.style.background = color;
    btn.addEventListener('click', function () {
      document.getElementById('colColorHex').value = color;
      document.getElementById('colColorPreview').style.background = color;
      colRenderPalette(color);
    });
    wrap.appendChild(btn);
  });
}

function colOpenNewGroupModal(callback) {
  _colBuildNewGroupModal();
  _colNewGroupCallback = callback;
  document.getElementById('colNewGroupName').value = '';
  document.getElementById('colColorHex').value = '#1a9e52';
  document.getElementById('colColorPreview').style.background = '#1a9e52';
  colRenderPalette('#1a9e52');
  _colShowOverlay('colNewGroupOverlay');
}

function _colBuildLayoutModal(kind) {
  var isEdit = kind === 'edit';
  var overlayId = isEdit ? 'colEditLayoutOverlay' : 'colAddLayoutOverlay';
  var modalTitle = isEdit ? 'Editar Layout' : 'Adicionar Layout';
  var prefix = isEdit ? 'colEditLayout' : 'colAddLayout';
  var overlay;
  if (document.getElementById(overlayId)) return;
  overlay = _colMakeOverlay(overlayId,
    '<div class="modal col-layout-form-modal" id="' + prefix + 'Modal" role="dialog" aria-modal="true" aria-labelledby="' + prefix + 'Title">' +
      '<div class="col-form-header"><div><div class="modal-category">' + modalTitle + '</div><h2 class="modal-title" id="' + prefix + 'Title">' + modalTitle + '</h2></div><button class="modal-close" id="' + prefix + 'CloseBtn" type="button">&times;</button></div>' +
      '<div class="col-form-body">' +
        (isEdit ? '<input type="hidden" id="colEditLayoutId">' : '<div class="col-field"><label for="colAddLayoutId">ID <span class="req">*</span></label><input id="colAddLayoutId" type="text"></div>') +
        '<div class="col-field"><label for="' + prefix + 'Name">Nome <span class="req">*</span></label><input id="' + prefix + 'Name" type="text"></div>' +
        '<div class="col-edit-mode-bar"><button class="col-edit-mode-btn" type="button" data-col-layout-mode="' + prefix + ':content">Conteudo</button><button class="col-edit-mode-btn" type="button" data-col-layout-mode="' + prefix + ':preview">Preview</button></div>' +
        '<div class="col-edit-panel" id="' + prefix + 'PanelContent"><textarea class="col-edit-textarea" id="' + prefix + 'Content"></textarea></div>' +
        '<div class="col-edit-panel" id="' + prefix + 'PanelPreview"><iframe class="col-edit-iframe" id="' + prefix + 'Preview" title="Preview"></iframe></div>' +
      '</div>' +
      '<div class="col-form-footer"><span id="' + (isEdit ? 'colEditLayoutGhAnchor' : 'colAddLayoutGhAnchor') + '"></span><button class="col-btn-cancel" id="' + prefix + 'CancelBtn" type="button">Cancelar</button></div>' +
    '</div>');
  document.getElementById(prefix + 'CloseBtn').addEventListener('click', function () { _colHideOverlay(overlayId); });
  document.getElementById(prefix + 'CancelBtn').addEventListener('click', function () { _colHideOverlay(overlayId); });
  Array.prototype.forEach.call(overlay.querySelectorAll('[data-col-layout-mode]'), function (btn) {
    btn.addEventListener('click', function () {
      var parts = btn.getAttribute('data-col-layout-mode').split(':');
      colSwitchLayoutMode(parts[0], parts[1]);
    });
  });
  overlayClick(overlayId, function () { _colHideOverlay(overlayId); });
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colSwitchLayoutMode(prefix, mode) {
  var content = document.getElementById(prefix + 'Content').value;
  Array.prototype.forEach.call(document.querySelectorAll('#' + prefix + 'Modal .col-edit-mode-btn'), function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-col-layout-mode') === prefix + ':' + mode);
  });
  document.getElementById(prefix + 'PanelContent').classList.toggle('active', mode === 'content');
  document.getElementById(prefix + 'PanelPreview').classList.toggle('active', mode === 'preview');
  if (mode === 'preview') _colRefreshPreview(prefix + 'Preview', content, '');
}

function colOpenAddLayoutModal() {
  _colBuildLayoutModal('add');
  document.getElementById('colAddLayoutId').value = '';
  document.getElementById('colAddLayoutName').value = '';
  document.getElementById('colAddLayoutContent').value = '';
  _colShowOverlay('colAddLayoutOverlay');
  colSwitchLayoutMode('colAddLayout', 'content');
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colOpenEditLayoutModal(layout) {
  _colBuildLayoutModal('edit');
  _colCurrentLayout = layout;
  document.getElementById('colEditLayoutId').value = layout.id;
  document.getElementById('colEditLayoutName').value = layout.name || '';
  document.getElementById('colEditLayoutContent').value = ((layout.css || '') + '\n' + (layout.html || '')).trim();
  _colShowOverlay('colEditLayoutOverlay');
  colSwitchLayoutMode('colEditLayout', 'preview');
  if (window.ghColInjectButtons) window.ghColInjectButtons();
}

function colGetAddLayoutFormData() {
  var id = document.getElementById('colAddLayoutId').value.trim();
  var name = document.getElementById('colAddLayoutName').value.trim();
  if (!/^[a-z0-9-]{2,}$/.test(id) || !name) return null;
  return {
    id: id,
    name: name,
    html: document.getElementById('colAddLayoutContent').value,
    css: ''
  };
}

function colGetEditLayoutFormData() {
  var id = document.getElementById('colEditLayoutId').value;
  var name = document.getElementById('colEditLayoutName').value.trim();
  if (!id || !name) return null;
  return {
    id: id,
    name: name,
    html: document.getElementById('colEditLayoutContent').value,
    css: ''
  };
}

function _colBuildConfirmModal() {
  if (document.getElementById('colConfirmOverlay')) return;
  _colMakeOverlay('colConfirmOverlay',
    '<div class="modal col-confirm-modal" id="colConfirmModal" role="dialog" aria-modal="true" aria-labelledby="colConfirmTitle">' +
      '<div class="modal-body"><h2 class="col-confirm-title" id="colConfirmTitle">Confirmar</h2><div class="col-confirm-body" id="colConfirmBody"></div><div class="col-confirm-actions"><button class="col-btn-cancel" id="colConfirmCancelBtn" type="button">Cancelar</button><button class="col-btn-primary" id="colConfirmOkBtn" type="button">OK</button></div></div>' +
    '</div>');
  document.getElementById('colConfirmCancelBtn').addEventListener('click', function () { _colHideOverlay('colConfirmOverlay'); });
  document.getElementById('colConfirmOkBtn').addEventListener('click', function () {
    if (_colConfirmCallback) _colConfirmCallback();
    _colHideOverlay('colConfirmOverlay');
  });
  overlayClick('colConfirmOverlay', function () { _colHideOverlay('colConfirmOverlay'); });
}

function colOpenConfirm(options) {
  _colBuildConfirmModal();
  _colConfirmCallback = options.onConfirm;
  document.getElementById('colConfirmTitle').textContent = options.title || 'Confirmar';
  document.getElementById('colConfirmBody').textContent = options.body || '';
  document.getElementById('colConfirmOkBtn').textContent = options.labelOk || 'OK';
  document.getElementById('colConfirmOkBtn').className = options.danger ? 'col-btn-delete' : 'col-btn-primary';
  _colShowOverlay('colConfirmOverlay');
}

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return;
  if (document.getElementById('colConfirmOverlay') && !document.getElementById('colConfirmOverlay').classList.contains('hidden')) _colHideOverlay('colConfirmOverlay');
  else if (document.getElementById('colEditLayoutOverlay') && !document.getElementById('colEditLayoutOverlay').classList.contains('hidden')) _colHideOverlay('colEditLayoutOverlay');
  else if (document.getElementById('colAddLayoutOverlay') && !document.getElementById('colAddLayoutOverlay').classList.contains('hidden')) _colHideOverlay('colAddLayoutOverlay');
  else if (document.getElementById('colNewGroupOverlay') && !document.getElementById('colNewGroupOverlay').classList.contains('hidden')) _colHideOverlay('colNewGroupOverlay');
  else if (document.getElementById('colEditOverlay') && !document.getElementById('colEditOverlay').classList.contains('hidden')) _colHideOverlay('colEditOverlay');
  else if (document.getElementById('colCreateOverlay') && !document.getElementById('colCreateOverlay').classList.contains('hidden')) _colHideOverlay('colCreateOverlay');
  else if (document.getElementById('colCollectionOverlay') && !document.getElementById('colCollectionOverlay').classList.contains('hidden')) _colHideOverlay('colCollectionOverlay');
});
