/* ============================================================================
   modal-add.js - Picker e modal de adicionar layout

   RESPONSABILIDADE:
     Renderiza o picker orientado a dados e cria dinamicamente o modal de
     novo layout com validacao, preview e codigo gerado.

   EXPOE (globais):
     PICKER_OPTIONS -> opcoes escalaveis do picker
     openAdicionarPicker(), closeAdicionarPicker() -> picker
     openAddModal(), closeAddModal() -> modal de novo layout
     updateGeneratedCode(), getAddFormData() -> codigo e dados

   DEPENDENCIAS:
     utils.js.

   ORDEM DE CARREGAMENTO:
     Depois de modal-edit.js e antes do bootstrap.
============================================================================ */

var PICKER_OPTIONS = [
  {
    id: 'layout',
    label: 'Layout',
    icon: iconSvg('grid'),
    onSelect: function () { openAddModal(); }
  },
  {
    id: 'colecao',
    label: 'Colecao',
    icon: iconSvg('folder'),
    onSelect: function () {
      if (window.colOpenCreateModal) window.colOpenCreateModal();
      else showToast('Modulo de colecoes indisponivel');
    }
  }
];

function renderPickerOptions() {
  var wrap = document.getElementById('pickerTabs');
  var title = document.getElementById('pickerTitle');
  if (!wrap) return;
  wrap.textContent = '';
  PICKER_OPTIONS.forEach(function (option, index) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'picker-tab' + (index === 0 ? ' active' : '');
    btn.innerHTML = option.icon + '<span>' + option.label + '</span>';
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(wrap.querySelectorAll('.picker-tab'), function (item) {
        item.classList.remove('active');
      });
      btn.classList.add('active');
      if (title) title.textContent = 'Adicionar ' + option.label;
      closeAdicionarPicker();
      option.onSelect();
    });
    wrap.appendChild(btn);
  });
}

function openAdicionarPicker() {
  renderPickerOptions();
  document.getElementById('pickerTitle').textContent = 'Adicionar Layout';
  document.getElementById('pickerOverlay').classList.remove('hidden');
  setBodyLocked(true);
}

function closeAdicionarPicker() {
  document.getElementById('pickerOverlay').classList.add('hidden');
  setBodyLocked(false);
}

function _buildAddModal() {
  var overlay;
  if (document.getElementById('addModalOverlay')) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay hidden';
  overlay.id = 'addModalOverlay';
  overlay.innerHTML =
    '<div class="modal edit-modal" id="addModal" role="dialog" aria-modal="true" aria-labelledby="addModalTitle">' +
      '<div class="modal-header">' +
        '<div><div class="modal-category">Novo layout</div><h2 class="modal-title" id="addModalTitle">Adicionar Layout</h2></div>' +
        '<button class="modal-close" id="closeAddModalBtn" type="button" aria-label="Fechar">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="add-fields">' +
          '<div class="field-row">' +
            '<div class="field-group"><label for="addId">ID <span class="req">*</span></label><input id="addId" type="text" placeholder="section-22"><div class="field-desc" id="addIdHint">variants/[id].js</div></div>' +
            '<div class="field-group"><label for="addName">Nome <span class="req">*</span></label><input id="addName" type="text" placeholder="Section-22"></div>' +
          '</div>' +
          '<div class="field-group"><label for="addTags">Tags</label><input id="addTags" type="text" placeholder="hero, banner, section 22"></div>' +
        '</div>' +
        '<div class="edit-mode-bar">' +
          '<button class="edit-mode-btn" type="button" data-add-mode="html">HTML</button>' +
          '<button class="edit-mode-btn" type="button" data-add-mode="css">CSS</button>' +
          '<button class="edit-mode-btn" type="button" data-add-mode="preview">Preview</button>' +
        '</div>' +
        '<div class="add-code-panel" id="addPanelHtml"><textarea class="code-textarea" id="addHtml"></textarea></div>' +
        '<div class="add-code-panel" id="addPanelCss"><textarea class="code-textarea" id="addCss"></textarea></div>' +
        '<div class="add-code-panel" id="addPanelPreview"><iframe class="edit-preview-iframe" id="addPreviewIframe" title="Preview do novo layout"></iframe></div>' +
        '<pre class="code-block hidden" id="generatedCode"></pre>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<span id="copyGeneratedBtn"></span>' +
        '<button class="btn btn-ghost" id="copyAddCodeBtn" type="button">' + iconSvg('copy') + '<span>Copiar codigo</span></button>' +
        '<button class="btn btn-primary" id="closeAddDoneBtn" type="button">Concluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('closeAddModalBtn').addEventListener('click', closeAddModal);
  document.getElementById('closeAddDoneBtn').addEventListener('click', closeAddModal);
  document.getElementById('copyAddCodeBtn').addEventListener('click', function () {
    updateGeneratedCode();
    if (this.classList.contains('btn-blocked')) return;
    copyToClipboard(document.getElementById('generatedCode').textContent, this, 'Codigo copiado!');
  });

  Array.prototype.forEach.call(overlay.querySelectorAll('[data-add-mode]'), function (btn) {
    btn.addEventListener('click', function () {
      switchAddMode(btn.getAttribute('data-add-mode'));
    });
  });

  ['addId', 'addName', 'addTags', 'addHtml', 'addCss'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateGeneratedCode);
  });

  overlayClick('addModalOverlay', closeAddModal);
  if (window.senkoGithubInjectButtons) window.senkoGithubInjectButtons();
}

function getAddFormData() {
  var id = document.getElementById('addId');
  var name = document.getElementById('addName');
  var tags = document.getElementById('addTags');
  var html = document.getElementById('addHtml');
  var css = document.getElementById('addCss');
  var valid;
  if (!id || !name || !html || !css) return null;
  valid = /^[a-z0-9-]{3,}$/.test(id.value.trim());
  if (!valid || !name.value.trim()) return null;
  return {
    id: id.value.trim(),
    name: name.value.trim(),
    tags: parseTags(tags.value),
    html: html.value,
    css: css.value
  };
}

function updateGeneratedCode() {
  var id = document.getElementById('addId');
  var hint = document.getElementById('addIdHint');
  var code = document.getElementById('generatedCode');
  var copy = document.getElementById('copyAddCodeBtn');
  var valid = id && /^[a-z0-9-]{3,}$/.test(id.value.trim());
  var data;

  if (hint && id) hint.textContent = 'variants/' + (id.value.trim() || '[id]') + '.js';
  if (copy) copy.classList.toggle('btn-blocked', !valid);

  data = {
    id: id ? id.value.trim() : '',
    name: (document.getElementById('addName') || {}).value || '',
    tags: parseTags((document.getElementById('addTags') || {}).value || ''),
    html: (document.getElementById('addHtml') || {}).value || '',
    css: (document.getElementById('addCss') || {}).value || ''
  };
  if (code) code.textContent = formatLayoutObject(data);
}

function switchAddMode(mode) {
  var data = {
    html: document.getElementById('addHtml').value,
    css: document.getElementById('addCss').value
  };
  Array.prototype.forEach.call(document.querySelectorAll('#addModalOverlay .edit-mode-btn'), function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-add-mode') === mode);
  });
  Array.prototype.forEach.call(document.querySelectorAll('#addModalOverlay .add-code-panel'), function (panel) {
    panel.classList.remove('active');
  });
  document.getElementById('addPanel' + (mode === 'css' ? 'Css' : mode === 'html' ? 'Html' : 'Preview')).classList.add('active');
  if (mode === 'preview') refreshModalPreview(document.getElementById('addPreviewIframe'), data.html, data.css);
}

function openAddModal() {
  _buildAddModal();
  document.getElementById('addModalOverlay').classList.remove('hidden');
  setBodyLocked(true);
  switchAddMode('html');
  updateGeneratedCode();
  if (window.senkoGithubInjectButtons) window.senkoGithubInjectButtons();
}

function closeAddModal() {
  var overlay = document.getElementById('addModalOverlay');
  if (overlay) overlay.classList.add('hidden');
  setBodyLocked(false);
}
