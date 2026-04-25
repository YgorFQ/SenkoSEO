/* ═══════════════════════════════════════════════════════════════════════
   col-modals.js — 7 modais do sistema de Coleções (todos dinâmicos)

   RESPONSABILIDADE:
     Cria e gerencia os 7 modais de Coleção (visualizar, criar, editar,
     novo grupo, adicionar layout, editar layout, confirmação). Todos
     são gerados via createElement na primeira abertura (lazy build com
     guard de id). Após construção, abrir/fechar é apenas classList.

   EXPÕE (globais):
     colOpenCollectionModal(col)       → void
     colOpenCreateModal()              → void
     colOpenEditModal(col)             → void
     colOpenNewGroupModal(callback)    → void
     colOpenAddLayoutModal(col)        → void
     colOpenEditLayoutModal(col, lay)  → void
     colOpenConfirm(opts)              → void
     colCloseAllModals()               → void
     colGetCreateFormData()            → object | null
     colGetEditFormData()              → object | null
     colGetAddLayoutFormData()         → object | null
     colGetEditLayoutFormData()        → object | null

   DEPENDÊNCIAS:
     utils.js, col-groups.js, col-core.js, col-script.js

   ORDEM DE CARREGAMENTO:
     Após col-script.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Estado interno ─────────────────────────────────────────────────── */
var _colCurrentCollection = null;
var _colCurrentLayout     = null;

/* ── Paleta de cores preset para grupos ────────────────────────────── */
var _COL_COLORS = [
  '#1a9e52','#06b6d4','#f59e0b','#e03030','#8b5cf6',
  '#ec4899','#f97316','#0ea5e9','#14b8a6','#6366f1',
];

/* ── Helpers internos ───────────────────────────────────────────────── */

function _colMakeOverlay(id) {
  var el = document.createElement('div');
  el.id        = id;
  el.className = 'modal-overlay hidden';
  document.body.appendChild(el);
  return el;
}

function _colShowOverlay(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}

function _colHideOverlay(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('hidden');
  if (!document.querySelector('.modal-overlay:not(.hidden)'))
    document.body.style.overflow = '';
}

// Fecha ao clicar fora do modal (duplo clique em 400ms)
function _colOverlayClick(overlayId, modalId, closeFn) {
  var count = 0, timer;
  var overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.addEventListener('click', function (e) {
    var modal = document.getElementById(modalId);
    if (modal && modal.contains(e.target)) return;
    count++;
    if (count === 1) { timer = setTimeout(function () { count = 0; }, 400); }
    else { clearTimeout(timer); count = 0; closeFn(); }
  });
}

function colCloseAllModals() {
  ['colCollectionOverlay','colCreateOverlay','colEditOverlay','colNewGroupOverlay',
   'colAddLayoutOverlay','colEditLayoutOverlay','colConfirmOverlay'].forEach(_colHideOverlay);
}

function _colSlugify(name) {
  if (typeof ColGroups !== 'undefined') return ColGroups.slugify(name);
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function _colValidSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2;
}

function _colRefreshPreview(iframeId, html, css) {
  var iframe = document.getElementById(iframeId);
  if (!iframe) return;
  iframe.srcdoc = '';
  setTimeout(function () { iframe.srcdoc = buildSrcDoc(html, css); }, 50);
}

// Popula <select> com grupos disponíveis no ColGroups
function _colPopulateGroupSelect(selectEl, selectedSlug) {
  selectEl.innerHTML = '<option value="">— Selecione um grupo —</option>';
  ColGroups.getAll().forEach(function (g) {
    var opt = document.createElement('option');
    opt.value       = g.slug;
    opt.textContent = g.name;
    if (g.slug === selectedSlug) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

function _colShowFieldError(id, show) {
  var el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 1 — Visualizar Coleção
═══════════════════════════════════════════════════════════════════════ */

function _buildCollectionModal() {
  if (document.getElementById('colCollectionOverlay')) return;

  var overlay = _colMakeOverlay('colCollectionOverlay');
  overlay.style.zIndex = '1000';

  overlay.innerHTML =
    '<div class="modal col-modal" id="colCollectionModal">' +
      '<div class="col-modal-header">' +
        '<div class="col-modal-header-left">' +
          '<span class="col-modal-category">Coleção</span>' +
          '<h2 class="col-modal-title" id="colModalTitle">–</h2>' +
          '<span class="col-modal-group-badge" id="colModalGroupBadge"></span>' +
        '</div>' +
        '<div class="col-modal-header-right">' +
          '<button class="btn btn-ghost btn-edit-icon" id="colModalEditBtn" title="Editar metadados">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            ' Editar' +
          '</button>' +
          '<button class="modal-close" id="colCloseCollectionBtn">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="col-modal-layouts-wrap">' +
        '<div class="col-modal-layouts-grid" id="colLayoutsGrid"></div>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colCloseCollectionBtn').addEventListener('click', function () {
    _colHideOverlay('colCollectionOverlay');
    _colCurrentCollection = null;
  });

  overlay.querySelector('#colModalEditBtn').addEventListener('click', function () {
    if (_colCurrentCollection) colOpenEditModal(_colCurrentCollection);
  });

  _colOverlayClick('colCollectionOverlay', 'colCollectionModal', function () {
    _colHideOverlay('colCollectionOverlay');
  });
}

function colOpenCollectionModal(col) {
  _buildCollectionModal();
  _colCurrentCollection = col;

  var grupo = ColGroups.getBySlug(col.group) || {};
  var cor   = grupo.cor || 'var(--accent)';

  document.getElementById('colCollectionModal').style.borderTopColor = cor;
  document.getElementById('colModalTitle').textContent = col.name;

  var badge = document.getElementById('colModalGroupBadge');
  badge.textContent   = grupo.name || col.group || '';
  badge.style.background = cor;

  _colRenderLayoutsGrid(col);
  _colShowOverlay('colCollectionOverlay');
}

// Renderiza o grid de layouts dentro da coleção
function _colRenderLayoutsGrid(col) {
  var grid = document.getElementById('colLayoutsGrid');
  if (!grid) return;

  var layouts  = (col.layouts || []).slice();
  var fragment = document.createDocumentFragment();

  layouts.forEach(function (lay, i) {
    var block = document.createElement('div');
    block.className = 'col-layout-block';
    block.style.animationDelay = (i * 30) + 'ms';

    var combined = (lay.css ? lay.css + '\n' : '') + (lay.html || '');

    block.innerHTML =
      '<div class="col-layout-preview">' +
        '<iframe class="card-iframe" frameborder="0" scrolling="no" tabindex="-1"></iframe>' +
        '<div class="col-layout-preview-overlay"></div>' +
      '</div>' +
      '<div class="col-layout-body">' +
        '<div class="col-layout-name">' + lay.name + '</div>' +
      '</div>' +
      '<div class="col-layout-footer">' +
        '<button class="btn btn-ghost" title="Copiar tudo">Copiar tudo</button>' +
        '<button class="btn btn-ghost btn-edit-icon" title="Editar">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</button>' +
        '<span class="col-layout-delete-anchor" data-layout-id="' + lay.id + '"></span>' +
      '</div>';

    // Lazy load preview
    var iframe = block.querySelector('.card-iframe');
    lazyIframe(iframe, lay.html || '', lay.css || '');

    // Copiar tudo (css + html concatenados)
    block.querySelector('[title="Copiar tudo"]').addEventListener('click', function () {
      copyToClipboard(combined, null, '');
    });

    // Editar layout
    block.querySelector('.btn-edit-icon').addEventListener('click', function () {
      colOpenEditLayoutModal(col, lay);
    });

    fragment.appendChild(block);
  });

  // Card "+ Adicionar Layout"
  var addCard = document.createElement('div');
  addCard.className = 'col-layout-add-card';
  addCard.innerHTML = '<div class="col-layout-add-icon">+</div><span>Adicionar Layout</span>';
  addCard.addEventListener('click', function () { colOpenAddLayoutModal(col); });
  fragment.appendChild(addCard);

  grid.innerHTML = '';
  grid.appendChild(fragment);
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 2 — Criar Coleção
═══════════════════════════════════════════════════════════════════════ */

function _buildCreateModal() {
  if (document.getElementById('colCreateOverlay')) return;

  var overlay = _colMakeOverlay('colCreateOverlay');
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal col-form-modal" id="colCreateModal">' +
      '<div class="col-form-header">' +
        '<div><span class="modal-category">Nova Coleção</span><h2 class="modal-title">Criar Coleção</h2></div>' +
        '<button class="modal-close" id="colCloseCreateBtn">✕</button>' +
      '</div>' +
      '<div class="col-form-body">' +
        '<div class="col-field">' +
          '<label>Nome <span class="req">*</span></label>' +
          '<input type="text" id="colCreateName" placeholder="Kit Lançamento 2026">' +
          '<span class="col-field-error" id="colCreateNameError">Nome mínimo 3 caracteres.</span>' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Slug <span class="hint">(gerado automaticamente)</span></label>' +
          '<input type="text" id="colCreateSlug" placeholder="kit-lancamento-2026">' +
          '<span class="col-field-hint" id="colCreateSlugHint">colecoes/data/[slug].js</span>' +
          '<span class="col-field-error" id="colCreateSlugError">Slug inválido (mín. 2 chars, só a-z, 0-9, hífen).</span>' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Grupo <span class="req">*</span></label>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<select class="col-group-select" id="colCreateGroup" style="flex:1;"></select>' +
            '<button class="col-group-new-btn" id="colCreateNewGroupBtn">+ Novo grupo</button>' +
          '</div>' +
          '<span class="col-field-error" id="colCreateGroupError">Selecione um grupo.</span>' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Tags <span class="hint">(separadas por vírgula)</span></label>' +
          '<input type="text" id="colCreateTags" placeholder="responsivo, hero">' +
        '</div>' +
      '</div>' +
      '<div class="col-form-footer">' +
        '<span id="colCreateGhAnchor"></span>' +
        '<button class="btn col-btn-cancel" id="colCreateCancelBtn">Cancelar</button>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colCloseCreateBtn').addEventListener('click', function () { _colHideOverlay('colCreateOverlay'); });
  overlay.querySelector('#colCreateCancelBtn').addEventListener('click', function () { _colHideOverlay('colCreateOverlay'); });
  _colOverlayClick('colCreateOverlay', 'colCreateModal', function () { _colHideOverlay('colCreateOverlay'); });

  // Auto-slug a partir do nome
  overlay.querySelector('#colCreateName').addEventListener('input', function () {
    var slug = _colSlugify(this.value);
    document.getElementById('colCreateSlug').value = slug;
    document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/' + (slug || '[slug]') + '.js';
    _colShowFieldError('colCreateNameError', this.value.length > 0 && this.value.trim().length < 3);
    _colShowFieldError('colCreateSlugError', slug.length > 0 && !_colValidSlug(slug));
  });

  overlay.querySelector('#colCreateSlug').addEventListener('input', function () {
    var slug = this.value.trim();
    document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/' + (slug || '[slug]') + '.js';
    _colShowFieldError('colCreateSlugError', !_colValidSlug(slug));
  });

  overlay.querySelector('#colCreateNewGroupBtn').addEventListener('click', function () {
    colOpenNewGroupModal(function () {
      _colPopulateGroupSelect(document.getElementById('colCreateGroup'), document.getElementById('colCreateGroup').value);
    });
  });
}

function colOpenCreateModal() {
  _buildCreateModal();
  document.getElementById('colCreateName').value = '';
  document.getElementById('colCreateSlug').value = '';
  document.getElementById('colCreateTags').value = '';
  document.getElementById('colCreateSlugHint').textContent = 'colecoes/data/[slug].js';
  ['colCreateNameError','colCreateSlugError','colCreateGroupError'].forEach(function (id) {
    _colShowFieldError(id, false);
  });
  _colPopulateGroupSelect(document.getElementById('colCreateGroup'), null);
  _colShowOverlay('colCreateOverlay');
}

function colGetCreateFormData() {
  var name  = (document.getElementById('colCreateName')  || {}).value || '';
  var slug  = (document.getElementById('colCreateSlug')  || {}).value || '';
  var group = (document.getElementById('colCreateGroup') || {}).value || '';
  var tags  = ((document.getElementById('colCreateTags') || {}).value || '')
    .split(',').map(function (t) { return t.trim(); }).filter(Boolean);

  var ok = name.trim().length >= 3 && _colValidSlug(slug) && group;
  _colShowFieldError('colCreateNameError',  name.trim().length < 3);
  _colShowFieldError('colCreateSlugError',  !_colValidSlug(slug));
  _colShowFieldError('colCreateGroupError', !group);
  return ok ? { name: name.trim(), slug: slug.trim(), group: group, tags: tags } : null;
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 3 — Editar Coleção
═══════════════════════════════════════════════════════════════════════ */

function _buildEditModal_col() {
  if (document.getElementById('colEditOverlay')) return;

  var overlay = _colMakeOverlay('colEditOverlay');
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal col-form-modal" id="colEditModal">' +
      '<div class="col-form-header">' +
        '<div><span class="modal-category">Coleção</span><h2 class="modal-title">Editar Coleção</h2></div>' +
        '<button class="modal-close" id="colCloseEditBtn">✕</button>' +
      '</div>' +
      '<div class="col-form-body">' +
        '<input type="hidden" id="colEditSlug">' +
        '<div class="col-field">' +
          '<label>Nome <span class="req">*</span></label>' +
          '<input type="text" id="colEditName">' +
          '<span class="col-field-error" id="colEditNameError">Nome mínimo 3 caracteres.</span>' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Grupo <span class="req">*</span></label>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<select class="col-group-select" id="colEditGroup" style="flex:1;"></select>' +
            '<button class="col-group-new-btn" id="colEditNewGroupBtn">+ Novo grupo</button>' +
          '</div>' +
          '<span class="col-field-error" id="colEditGroupError">Selecione um grupo.</span>' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Tags <span class="hint">(separadas por vírgula)</span></label>' +
          '<input type="text" id="colEditTags">' +
        '</div>' +
      '</div>' +
      '<div class="col-form-footer">' +
        '<span id="colEditGhAnchor"></span>' +
        '<button class="btn col-btn-cancel" id="colEditCancelBtn">Cancelar</button>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colCloseEditBtn').addEventListener('click',  function () { _colHideOverlay('colEditOverlay'); });
  overlay.querySelector('#colEditCancelBtn').addEventListener('click', function () { _colHideOverlay('colEditOverlay'); });
  _colOverlayClick('colEditOverlay', 'colEditModal', function () { _colHideOverlay('colEditOverlay'); });

  overlay.querySelector('#colEditNewGroupBtn').addEventListener('click', function () {
    colOpenNewGroupModal(function () {
      _colPopulateGroupSelect(document.getElementById('colEditGroup'), document.getElementById('colEditGroup').value);
    });
  });
}

function colOpenEditModal(col) {
  _buildEditModal_col();
  document.getElementById('colEditSlug').value = col.slug;
  document.getElementById('colEditName').value = col.name;
  document.getElementById('colEditTags').value = (col.tags || []).join(', ');
  _colPopulateGroupSelect(document.getElementById('colEditGroup'), col.group);
  ['colEditNameError','colEditGroupError'].forEach(function (id) { _colShowFieldError(id, false); });
  _colShowOverlay('colEditOverlay');
}

function colGetEditFormData() {
  var slug  = (document.getElementById('colEditSlug')  || {}).value || '';
  var name  = (document.getElementById('colEditName')  || {}).value || '';
  var group = (document.getElementById('colEditGroup') || {}).value || '';
  var tags  = ((document.getElementById('colEditTags') || {}).value || '')
    .split(',').map(function (t) { return t.trim(); }).filter(Boolean);

  var ok = name.trim().length >= 3 && group;
  _colShowFieldError('colEditNameError',  name.trim().length < 3);
  _colShowFieldError('colEditGroupError', !group);
  return ok ? { slug: slug, name: name.trim(), group: group, tags: tags } : null;
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 4 — Novo Grupo
═══════════════════════════════════════════════════════════════════════ */

function _buildNewGroupModal() {
  if (document.getElementById('colNewGroupOverlay')) return;

  var overlay = _colMakeOverlay('colNewGroupOverlay');
  overlay.style.zIndex = '1200';

  var swatchesHtml = _COL_COLORS.map(function (cor, i) {
    return '<button class="col-color-swatch' + (i === 0 ? ' active' : '') + '" style="background:' + cor + '" data-cor="' + cor + '"></button>';
  }).join('');

  overlay.innerHTML =
    '<div class="modal col-newgroup-modal" id="colNewGroupModal">' +
      '<div class="col-form-header">' +
        '<div><span class="modal-category">Novo Grupo</span><h2 class="modal-title">Criar Grupo</h2></div>' +
        '<button class="modal-close" id="colCloseNewGroupBtn">✕</button>' +
      '</div>' +
      '<div class="col-form-body">' +
        '<div class="col-field">' +
          '<label>Nome <span class="req">*</span></label>' +
          '<input type="text" id="colNewGroupName" placeholder="Ex: Projetos 2026">' +
        '</div>' +
        '<div class="col-field">' +
          '<label>Cor</label>' +
          '<div class="col-color-palette">' + swatchesHtml + '</div>' +
          '<div class="col-color-custom-wrap">' +
            '<div class="col-color-preview" id="colGroupColorPreview" style="background:' + _COL_COLORS[0] + '"></div>' +
            '<input type="text" class="col-color-hex-input" id="colGroupColorHex" value="' + _COL_COLORS[0] + '" maxlength="7">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="col-form-footer">' +
        '<button class="btn col-btn-cancel" id="colNewGroupCancelBtn">Cancelar</button>' +
        '<button class="btn col-btn-primary" id="colNewGroupConfirmBtn">Criar grupo</button>' +
      '</div>' +
    '</div>';

  // Fechar
  overlay.querySelector('#colCloseNewGroupBtn').addEventListener('click',  function () { _colHideOverlay('colNewGroupOverlay'); });
  overlay.querySelector('#colNewGroupCancelBtn').addEventListener('click', function () { _colHideOverlay('colNewGroupOverlay'); });

  // Swatches
  overlay.querySelectorAll('.col-color-swatch').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      overlay.querySelectorAll('.col-color-swatch').forEach(function (s) { s.classList.remove('active'); });
      swatch.classList.add('active');
      var cor = swatch.dataset.cor;
      document.getElementById('colGroupColorHex').value     = cor;
      document.getElementById('colGroupColorPreview').style.background = cor;
    });
  });

  // Hex manual
  overlay.querySelector('#colGroupColorHex').addEventListener('input', function () {
    var cor = this.value;
    if (/^#[0-9a-fA-F]{6}$/.test(cor))
      document.getElementById('colGroupColorPreview').style.background = cor;
  });
}

function colOpenNewGroupModal(callback) {
  _buildNewGroupModal();
  document.getElementById('colNewGroupName').value = '';

  var confirmBtn = document.getElementById('colNewGroupConfirmBtn');
  // Remove listener anterior e adiciona novo com callback atual
  var newBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
  newBtn.addEventListener('click', function () {
    var name = document.getElementById('colNewGroupName').value.trim();
    if (!name) return;
    var cor  = document.getElementById('colGroupColorHex').value || _COL_COLORS[0];
    var slug = ColGroups.slugify(name);
    ColGroups.addPending({ slug: slug, name: name, cor: cor });
    _colHideOverlay('colNewGroupOverlay');
    if (typeof callback === 'function') callback();
  });

  _colShowOverlay('colNewGroupOverlay');
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 5 — Adicionar Layout à Coleção
═══════════════════════════════════════════════════════════════════════ */

function _buildAddLayoutModal() {
  if (document.getElementById('colAddLayoutOverlay')) return;

  var overlay = _colMakeOverlay('colAddLayoutOverlay');
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal col-layout-form-modal" id="colAddLayoutModal">' +
      '<div class="col-form-header">' +
        '<div><span class="modal-category">Layout</span><h2 class="modal-title">Adicionar Layout</h2></div>' +
        '<button class="modal-close" id="colCloseAddLayoutBtn">✕</button>' +
      '</div>' +
      '<div style="padding:.75rem 1.25rem 0;">' +
        '<div class="col-field-row">' +
          '<div class="col-field">' +
            '<label>ID <span class="req">*</span></label>' +
            '<input type="text" id="colAddLayoutId" placeholder="hero-secao">' +
          '</div>' +
          '<div class="col-field">' +
            '<label>Nome <span class="req">*</span></label>' +
            '<input type="text" id="colAddLayoutName" placeholder="Hero Seção">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="col-edit-mode-bar">' +
        '<button class="col-edit-mode-btn active" data-al-mode="content">Conteúdo</button>' +
        '<button class="col-edit-mode-btn"        data-al-mode="preview">Preview</button>' +
      '</div>' +
      '<div class="col-edit-main">' +
        '<div class="col-edit-panel active" id="colAddPanelContent">' +
          '<textarea class="col-edit-textarea" id="colAddLayoutContent" placeholder="Cole aqui o HTML (e CSS embutido) do layout..."></textarea>' +
        '</div>' +
        '<div class="col-edit-panel" id="colAddPanelPreview">' +
          '<iframe class="col-edit-iframe" id="colAddLayoutIframe" frameborder="0"></iframe>' +
        '</div>' +
      '</div>' +
      '<div class="col-form-footer">' +
        '<span id="colAddLayoutGhAnchor"></span>' +
        '<button class="btn col-btn-cancel" id="colAddLayoutCancelBtn">Cancelar</button>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colCloseAddLayoutBtn').addEventListener('click',  function () { _colHideOverlay('colAddLayoutOverlay'); });
  overlay.querySelector('#colAddLayoutCancelBtn').addEventListener('click', function () { _colHideOverlay('colAddLayoutOverlay'); });
  _colOverlayClick('colAddLayoutOverlay', 'colAddLayoutModal', function () { _colHideOverlay('colAddLayoutOverlay'); });

  overlay.querySelectorAll('[data-al-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.alMode;
      overlay.querySelectorAll('[data-al-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.alMode === mode);
      });
      overlay.querySelectorAll('.col-edit-panel').forEach(function (p) {
        p.classList.toggle('active', p.id === 'colAddPanel' + mode.charAt(0).toUpperCase() + mode.slice(1));
      });
      if (mode === 'preview') {
        _colRefreshPreview('colAddLayoutIframe', document.getElementById('colAddLayoutContent').value, '');
      }
    });
  });
}

function colOpenAddLayoutModal(col) {
  _buildAddLayoutModal();
  _colCurrentCollection = col;
  document.getElementById('colAddLayoutId').value      = '';
  document.getElementById('colAddLayoutName').value    = '';
  document.getElementById('colAddLayoutContent').value = '';
  _colShowOverlay('colAddLayoutOverlay');
}

function colGetAddLayoutFormData() {
  var id      = (document.getElementById('colAddLayoutId')      || {}).value || '';
  var name    = (document.getElementById('colAddLayoutName')    || {}).value || '';
  var content = (document.getElementById('colAddLayoutContent') || {}).value || '';
  if (!id.trim() || !name.trim()) return null;
  return { id: id.trim(), name: name.trim(), html: content, css: '' };
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 6 — Editar Layout da Coleção
═══════════════════════════════════════════════════════════════════════ */

function _buildEditLayoutModal() {
  if (document.getElementById('colEditLayoutOverlay')) return;

  var overlay = _colMakeOverlay('colEditLayoutOverlay');
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal col-layout-form-modal" id="colEditLayoutModal">' +
      '<div class="col-form-header">' +
        '<div><span class="modal-category">Layout</span><h2 class="modal-title" id="colEditLayoutTitle">Editar Layout</h2></div>' +
        '<button class="modal-close" id="colCloseEditLayoutBtn">✕</button>' +
      '</div>' +
      '<div style="padding:.75rem 1.25rem 0;">' +
        '<input type="hidden" id="colEditLayoutId">' +
        '<div class="col-field">' +
          '<label>Nome</label>' +
          '<input type="text" id="colEditLayoutName">' +
        '</div>' +
      '</div>' +
      '<div class="col-edit-mode-bar">' +
        '<button class="col-edit-mode-btn" data-el-mode="content">Conteúdo</button>' +
        '<button class="col-edit-mode-btn active" data-el-mode="preview">Visualizar</button>' +
      '</div>' +
      '<div class="col-edit-main">' +
        '<div class="col-edit-panel" id="colEditPanelContent">' +
          '<textarea class="col-edit-textarea" id="colEditLayoutContent"></textarea>' +
        '</div>' +
        '<div class="col-edit-panel active" id="colEditPanelPreview">' +
          '<iframe class="col-edit-iframe" id="colEditLayoutIframe" frameborder="0"></iframe>' +
        '</div>' +
      '</div>' +
      '<div class="col-form-footer">' +
        '<span id="colEditLayoutGhAnchor"></span>' +
        '<button class="btn col-btn-cancel" id="colEditLayoutCancelBtn">Cancelar</button>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colCloseEditLayoutBtn').addEventListener('click',  function () { _colHideOverlay('colEditLayoutOverlay'); });
  overlay.querySelector('#colEditLayoutCancelBtn').addEventListener('click', function () { _colHideOverlay('colEditLayoutOverlay'); });
  _colOverlayClick('colEditLayoutOverlay', 'colEditLayoutModal', function () { _colHideOverlay('colEditLayoutOverlay'); });

  overlay.querySelectorAll('[data-el-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.elMode;
      overlay.querySelectorAll('[data-el-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.elMode === mode);
      });
      overlay.querySelectorAll('.col-edit-panel').forEach(function (p) {
        p.classList.toggle('active', p.id === 'colEditPanel' + mode.charAt(0).toUpperCase() + mode.slice(1));
      });
      if (mode === 'preview') {
        _colRefreshPreview('colEditLayoutIframe', document.getElementById('colEditLayoutContent').value, '');
      }
    });
  });
}

function colOpenEditLayoutModal(col, layout) {
  _buildEditLayoutModal();
  _colCurrentCollection = col;
  _colCurrentLayout     = layout;

  document.getElementById('colEditLayoutTitle').textContent = layout.name;
  document.getElementById('colEditLayoutId').value          = layout.id;
  document.getElementById('colEditLayoutName').value        = layout.name;

  // Layout legado com CSS separado: mescla css + html na textarea
  var content = layout.css ? layout.css + '\n' + layout.html : (layout.html || '');
  document.getElementById('colEditLayoutContent').value = content;

  _colShowOverlay('colEditLayoutOverlay');
  setTimeout(function () { _colRefreshPreview('colEditLayoutIframe', content, ''); }, 10);
}

function colGetEditLayoutFormData() {
  var id      = (document.getElementById('colEditLayoutId')      || {}).value || '';
  var name    = (document.getElementById('colEditLayoutName')    || {}).value || '';
  var content = (document.getElementById('colEditLayoutContent') || {}).value || '';
  if (!id || !name.trim()) return null;
  return { id: id, name: name.trim(), html: content, css: '' };
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL 7 — Confirmação genérica
═══════════════════════════════════════════════════════════════════════ */

function _buildConfirmModal() {
  if (document.getElementById('colConfirmOverlay')) return;

  var overlay = _colMakeOverlay('colConfirmOverlay');
  overlay.style.zIndex = '1300';

  overlay.innerHTML =
    '<div class="modal col-confirm-modal" id="colConfirmModal" style="max-width:360px;">' +
      '<div style="padding:1.5rem 1.5rem 0;">' +
        '<h3 class="col-confirm-title" id="colConfirmTitle">Confirmar</h3>' +
        '<p class="col-confirm-body"  id="colConfirmBody"></p>' +
        '<div class="col-confirm-actions">' +
          '<button class="btn col-btn-cancel"  id="colConfirmCancelBtn">Cancelar</button>' +
          '<button class="btn col-btn-primary" id="colConfirmOkBtn">OK</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  overlay.querySelector('#colConfirmCancelBtn').addEventListener('click', function () {
    _colHideOverlay('colConfirmOverlay');
  });
}

function colOpenConfirm(opts) {
  _buildConfirmModal();
  document.getElementById('colConfirmTitle').textContent = opts.title || 'Confirmar';
  document.getElementById('colConfirmBody').textContent  = opts.body  || '';

  var okBtn = document.getElementById('colConfirmOkBtn');
  okBtn.textContent = opts.labelOk || 'OK';
  okBtn.className   = 'btn ' + (opts.danger ? 'col-btn-delete' : 'col-btn-primary');

  var newOk = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOk, okBtn);
  newOk.textContent = opts.labelOk || 'OK';
  newOk.className   = 'btn ' + (opts.danger ? 'col-btn-delete' : 'col-btn-primary');
  newOk.addEventListener('click', function () {
    _colHideOverlay('colConfirmOverlay');
    if (typeof opts.onConfirm === 'function') opts.onConfirm();
  });

  _colShowOverlay('colConfirmOverlay');
}

/* ── Escape handler de coleções ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var order = [
      'colConfirmOverlay','colEditLayoutOverlay','colAddLayoutOverlay',
      'colNewGroupOverlay','colEditOverlay','colCreateOverlay','colCollectionOverlay',
    ];
    for (var i = 0; i < order.length; i++) {
      var el = document.getElementById(order[i]);
      if (el && !el.classList.contains('hidden')) {
        _colHideOverlay(order[i]);
        return;
      }
    }
  });
});
