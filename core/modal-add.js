/* ═══════════════════════════════════════════════════════════════════════
   modal-add.js — Modal de adicionar layout e Picker orientado a dados

   RESPONSABILIDADE:
     Cria dinamicamente o modal de adicionar layout e o picker de seleção
     de tipo. O picker é orientado a dados via PICKER_OPTIONS — adicionar
     nova opção exige apenas inserir um objeto no array.

   EXPÕE (globais):
     openAddModal()             → void
     closeAddModal()            → void
     openAdicionarPicker()      → void
     closeAdicionarPicker()     → void
     updateGeneratedCode()      → void
     PICKER_OPTIONS             → Array (configuração do picker)

   DEPENDÊNCIAS:
     utils.js, modal-edit.js (overlayClick)

   ORDEM DE CARREGAMENTO:
     Após modal-edit.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Picker orientado a dados ───────────────────────────────────────── */

var PICKER_OPTIONS = [
  {
    id:    'layout',
    label: 'Layout',
    icon:  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    onSelect: function () { closeAdicionarPicker(); setTimeout(openAddModal, 80); },
  },
  {
    id:    'colecao',
    label: 'Coleção',
    icon:  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    onSelect: function () {
      closeAdicionarPicker();
      setTimeout(function () {
        if (typeof colOpenCreateModal === 'function') colOpenCreateModal();
      }, 80);
    },
  },
];

/* ── Build do Picker ────────────────────────────────────────────────── */

function _buildPicker() {
  // O picker pode estar no HTML estático — não recria se já existir
  var existing = document.getElementById('pickerOverlay');
  if (existing) return;

  var overlay = document.createElement('div');
  overlay.id        = 'pickerOverlay';
  overlay.className = 'modal-overlay hidden';

  var tabsHtml = PICKER_OPTIONS.map(function (opt, i) {
    return '<button class="btn picker-tab' + (i === 0 ? ' active' : '') + '" data-picker-id="' + opt.id + '">' +
      opt.icon + '<span>' + opt.label + '</span>' +
    '</button>';
  }).join('');

  overlay.innerHTML =
    '<div class="modal picker-modal" id="pickerModal">' +
      '<div class="modal-header" style="padding:.75rem 1.25rem .5rem;">' +
        '<div>' +
          '<span class="modal-category">NOVO ITEM</span>' +
          '<h2 class="modal-title" id="pickerTitle">Adicionar Layout</h2>' +
        '</div>' +
        '<button class="modal-close" id="closePicker">✕</button>' +
      '</div>' +
      '<div class="picker-tabs">' + tabsHtml + '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.querySelector('#closePicker').addEventListener('click', closeAdicionarPicker);
  overlayClick('pickerOverlay', 'pickerModal', closeAdicionarPicker);

  // Vincular tabs ao PICKER_OPTIONS
  overlay.querySelectorAll('.picker-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id  = btn.dataset.pickerId;
      var opt = PICKER_OPTIONS.find(function (o) { return o.id === id; });
      if (opt && typeof opt.onSelect === 'function') opt.onSelect();
    });
  });
}

/* ── Abrir / fechar Picker ──────────────────────────────────────────── */

function openAdicionarPicker() {
  _buildPicker();
  var overlay = document.getElementById('pickerOverlay');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Reseta para primeira opção ativa
  overlay.querySelectorAll('.picker-tab').forEach(function (btn, i) {
    btn.classList.toggle('active', i === 0);
  });
  var title = document.getElementById('pickerTitle');
  if (title) title.textContent = 'Adicionar ' + PICKER_OPTIONS[0].label;
}

function closeAdicionarPicker() {
  var overlay = document.getElementById('pickerOverlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ── Build do Modal de Adicionar ────────────────────────────────────── */

function _buildAddModal() {
  if (document.getElementById('addModalOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id        = 'addModalOverlay';
  overlay.className = 'modal-overlay hidden';

  overlay.innerHTML =
    '<div class="modal" id="addModal" style="max-width:700px;width:95%;">' +
      '<div class="modal-header">' +
        '<div>' +
          '<span class="modal-category">Layout</span>' +
          '<h2 class="modal-title">Adicionar Layout</h2>' +
        '</div>' +
        '<button class="modal-close" id="closeAddBtn">✕</button>' +
      '</div>' +

      '<div class="add-fields" style="padding:1rem 1.25rem 0;">' +
        '<div class="field-row">' +
          '<div class="field-group">' +
            '<label>ID <span class="req">*</span></label>' +
            '<input type="text" id="newLayoutId" placeholder="ex: section-58">' +
            '<span class="field-desc" id="newLayoutIdHint">Mín. 3 chars — só letras, números e hífen</span>' +
          '</div>' +
          '<div class="field-group">' +
            '<label>Nome <span class="req">*</span></label>' +
            '<input type="text" id="newLayoutName" placeholder="ex: Section 58">' +
          '</div>' +
        '</div>' +
        '<div class="field-group">' +
          '<label>Tags <span class="hint">(separadas por vírgula)</span></label>' +
          '<input type="text" id="newLayoutTags" placeholder="hero, banner, full-width">' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-bar" style="margin:.75rem 1.25rem 0;">' +
        '<button class="edit-mode-btn active" data-add-mode="html">HTML</button>' +
        '<button class="edit-mode-btn" data-add-mode="css">CSS</button>' +
        '<button class="edit-mode-btn" data-add-mode="preview">Preview</button>' +
      '</div>' +

      '<div class="add-code-panel active" id="addPanelHtml" style="padding:.75rem 1.25rem 0;">' +
        '<textarea class="edit-textarea" id="newLayoutHtml" placeholder="HTML do layout..."></textarea>' +
      '</div>' +
      '<div class="add-code-panel" id="addPanelCss" style="padding:.75rem 1.25rem 0;">' +
        '<textarea class="edit-textarea" id="newLayoutCss" placeholder="CSS do layout..."></textarea>' +
      '</div>' +
      '<div class="add-code-panel" id="addPanelPreview" style="padding:.75rem 1.25rem 0;">' +
        '<iframe class="edit-preview-iframe" id="addPreviewIframe" frameborder="0"></iframe>' +
      '</div>' +

      '<div class="add-result-section" style="padding:1rem 1.25rem;">' +
        '<div class="code-toolbar">' +
          '<span class="code-lang">JS gerado</span>' +
          '<span id="copyGeneratedBtn" style="display:none;"></span>' +
        '</div>' +
        '<pre class="code-block" id="generatedCode" style="display:none;"></pre>' +
        '<div style="margin-top:.5rem;">' +
          '<span class="field-desc" id="addVarFileHint"></span>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.querySelector('#closeAddBtn').addEventListener('click', closeAddModal);
  overlayClick('addModalOverlay', 'addModal', closeAddModal);

  // Troca de modo
  overlay.querySelectorAll('[data-add-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.addMode;
      overlay.querySelectorAll('[data-add-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.addMode === mode);
      });
      ['addPanelHtml','addPanelCss','addPanelPreview'].forEach(function (pid) {
        var panel = document.getElementById(pid);
        if (panel) panel.classList.toggle('active', pid === 'addPanel' + mode.charAt(0).toUpperCase() + mode.slice(1));
      });
      if (mode === 'preview') {
        var iframe = document.getElementById('addPreviewIframe');
        var html   = document.getElementById('newLayoutHtml').value;
        var css    = document.getElementById('newLayoutCss').value;
        iframe.srcdoc = '';
        requestAnimationFrame(function () { iframe.srcdoc = buildSrcDoc(html, css); });
      }
    });
  });

  // Atualizar código gerado ao digitar
  ['newLayoutId','newLayoutName','newLayoutTags','newLayoutHtml','newLayoutCss'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateGeneratedCode);
  });
}

/* ── Abrir / fechar Modal de Adicionar ──────────────────────────────── */

function openAddModal() {
  _buildAddModal();
  var overlay = document.getElementById('addModalOverlay');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Limpar campos
  ['newLayoutId','newLayoutName','newLayoutTags','newLayoutHtml','newLayoutCss'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  updateGeneratedCode();
}

function closeAddModal() {
  var overlay = document.getElementById('addModalOverlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ── Geração de código em tempo real ────────────────────────────────── */

// Valida o ID e atualiza o bloco de código JS gerado
function updateGeneratedCode() {
  var idEl   = document.getElementById('newLayoutId');
  var nameEl = document.getElementById('newLayoutName');
  var tagsEl = document.getElementById('newLayoutTags');
  var htmlEl = document.getElementById('newLayoutHtml');
  var cssEl  = document.getElementById('newLayoutCss');
  if (!idEl) return;

  var id   = idEl.value.trim();
  var name = nameEl ? nameEl.value.trim() : '';
  var tags = tagsEl ? tagsEl.value.split(',').map(function(t){return t.trim();}).filter(Boolean) : [];
  var html = htmlEl ? htmlEl.value : '';
  var css  = cssEl  ? cssEl.value  : '';

  // Validação de ID
  var validId = /^[a-z0-9-]{3,}$/.test(id);
  var hintEl  = document.getElementById('newLayoutIdHint');
  if (hintEl) hintEl.style.color = id && !validId ? 'var(--red)' : '';

  var codeBlock = document.getElementById('generatedCode');
  var varHint   = document.getElementById('addVarFileHint');
  if (!codeBlock) return;

  if (!id || !name) {
    codeBlock.style.display = 'none';
    if (varHint) varHint.textContent = '';
    return;
  }

  var tagsStr = JSON.stringify(tags);
  var code =
    '/*@@@@Senko - ' + id + ' */\n' +
    '{\n' +
    '  id:   \'' + id + '\',\n' +
    '  name: \'' + name.replace(/'/g, "\\'") + '\',\n' +
    '  tags: ' + tagsStr + ',\n' +
    '  html: `' + html + '`,\n' +
    '  css:  `' + css + '`,\n' +
    '},';

  codeBlock.textContent  = code;
  codeBlock.style.display = 'block';
  if (varHint) varHint.textContent = 'Arquivo de variantes: variants/' + id + '.js';
}
