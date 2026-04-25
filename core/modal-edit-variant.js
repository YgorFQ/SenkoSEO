/* ============================================================================
   modal-edit-variant.js - Modal de editar variante

   RESPONSABILIDADE:
     Edita uma variante sem mutar o objeto original ate o salvamento externo,
     alternando HTML/CSS/Preview e gerando codigo com marcador @@@@Senko.

   EXPOE (globais):
     openEditVariantModal(layout, variant), closeEditVariantModal()
     switchEditVarMode(mode), updateEditVarCode()
     getEditVariantFormData()

   DEPENDENCIAS:
     utils.js.

   ORDEM DE CARREGAMENTO:
     Depois de modal-variants.js.
============================================================================ */

function _buildEditVarModal() {
  var overlay;
  if (document.getElementById('editVarOverlay')) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay hidden';
  overlay.id = 'editVarOverlay';
  overlay.innerHTML =
    '<div class="modal edit-modal" id="editVarModal" role="dialog" aria-modal="true" aria-labelledby="editVarTitle">' +
      '<div class="modal-header">' +
        '<div><div class="modal-category">Editar variante</div><h2 class="modal-title" id="editVarTitle">Variante</h2></div>' +
        '<button class="modal-close" id="closeEditVarBtn" type="button" aria-label="Fechar">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="field-group"><label for="editVarName">Nome <span class="req">*</span></label><input id="editVarName" type="text"></div>' +
        '<div class="edit-mode-bar">' +
          '<button class="edit-mode-btn" type="button" data-edit-var-mode="html">HTML</button>' +
          '<button class="edit-mode-btn" type="button" data-edit-var-mode="css">CSS</button>' +
          '<button class="edit-mode-btn" type="button" data-edit-var-mode="preview">Visualizar</button>' +
        '</div>' +
        '<div class="edit-mode-panel" id="editVarPanelHtml"><textarea class="edit-textarea" id="editVarHtml"></textarea></div>' +
        '<div class="edit-mode-panel" id="editVarPanelCss"><textarea class="edit-textarea" id="editVarCss"></textarea></div>' +
        '<div class="edit-mode-panel" id="editVarPanelPreview"><iframe class="edit-preview-iframe" id="editVarPreviewIframe" title="Preview da variante"></iframe></div>' +
        '<pre class="code-block hidden" id="editVarGeneratedCode"></pre>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<div class="modal-actions-left"><button class="btn btn-danger btn-delete-var-modal" id="editVarDeleteBtn" type="button">' + iconSvg('trash') + '<span>Excluir</span></button></div>' +
        '<span id="saveVarToFileBtn"></span>' +
        '<button class="btn btn-ghost" id="copyEditVarCodeBtn" type="button">' + iconSvg('copy') + '<span>Copiar codigo</span></button>' +
        '<button class="btn btn-primary" id="closeEditVarDoneBtn" type="button">Concluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('closeEditVarBtn').addEventListener('click', closeEditVariantModal);
  document.getElementById('closeEditVarDoneBtn').addEventListener('click', closeEditVariantModal);
  document.getElementById('copyEditVarCodeBtn').addEventListener('click', function () {
    updateEditVarCode();
    copyToClipboard(document.getElementById('editVarGeneratedCode').textContent, this, 'Codigo copiado!');
  });
  document.getElementById('editVarDeleteBtn').addEventListener('click', function () {
    var data = getEditVariantFormData();
    if (data && window.ghvOpenDeleteModal) window.ghvOpenDeleteModal(data.layoutId, data.originalName);
  });

  Array.prototype.forEach.call(overlay.querySelectorAll('[data-edit-var-mode]'), function (btn) {
    btn.addEventListener('click', function () {
      switchEditVarMode(btn.getAttribute('data-edit-var-mode'));
    });
  });

  ['editVarName', 'editVarHtml', 'editVarCss'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateEditVarCode);
  });

  overlayClick('editVarOverlay', closeEditVariantModal);
  if (window.ghvInjectButtons) window.ghvInjectButtons();
}

function getEditVariantFormData() {
  var current = state.currentEditVariant;
  var name = document.getElementById('editVarName');
  var html = document.getElementById('editVarHtml');
  var css = document.getElementById('editVarCss');
  if (!current || !name || !html || !css) return null;
  return {
    layoutId: current.layoutId,
    originalName: current.originalName,
    name: name.value.trim(),
    html: html.value,
    css: css.value
  };
}

function updateEditVarCode() {
  var data = getEditVariantFormData();
  var code = document.getElementById('editVarGeneratedCode');
  if (!data || !code) return;
  code.textContent = formatVariantObject(data);
}

function switchEditVarMode(mode) {
  var data = getEditVariantFormData();
  Array.prototype.forEach.call(document.querySelectorAll('#editVarOverlay .edit-mode-btn'), function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-edit-var-mode') === mode);
  });
  Array.prototype.forEach.call(document.querySelectorAll('#editVarOverlay .edit-mode-panel'), function (panel) {
    panel.classList.remove('active');
  });
  document.getElementById('editVarPanel' + (mode === 'css' ? 'Css' : mode === 'html' ? 'Html' : 'Preview')).classList.add('active');
  if (mode === 'preview' && data) refreshModalPreview(document.getElementById('editVarPreviewIframe'), data.html, data.css);
}

function openEditVariantModal(layout, variant) {
  _buildEditVarModal();
  state.currentEditVariant = {
    layoutId: layout.id,
    originalName: variant.name,
    name: variant.name,
    html: variant.html,
    css: variant.css
  };
  document.getElementById('editVarTitle').textContent = variant.name;
  document.getElementById('editVarName').value = variant.name || '';
  document.getElementById('editVarHtml').value = variant.html || '';
  document.getElementById('editVarCss').value = variant.css || '';
  updateEditVarCode();
  document.getElementById('editVarOverlay').classList.remove('hidden');
  setBodyLocked(true);
  switchEditVarMode('preview');
  if (window.ghvInjectButtons) window.ghvInjectButtons();
}

function closeEditVariantModal() {
  var overlay = document.getElementById('editVarOverlay');
  if (overlay) overlay.classList.add('hidden');
  state.currentEditVariant = null;
  setBodyLocked(!document.getElementById('variantsOverlay').classList.contains('hidden'));
}
