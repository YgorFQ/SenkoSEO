/* ============================================================================
   modal-new-variant.js - Modal de nova variante

   RESPONSABILIDADE:
     Cria variantes novas para o layout atual, com validacao de nome,
     preview e codigo gerado para persistencia no GitHub.

   EXPOE (globais):
     openNewVariantModal(), closeNewVariantModal()
     switchNewVarMode(mode), updateNewVarCode()
     getNewVariantFormData()

   DEPENDENCIAS:
     utils.js, modal-variants.js.

   ORDEM DE CARREGAMENTO:
     Depois de modal-edit-variant.js.
============================================================================ */

function _buildNewVarModal() {
  var overlay;
  if (document.getElementById('newVarOverlay')) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay hidden';
  overlay.id = 'newVarOverlay';
  overlay.innerHTML =
    '<div class="modal edit-modal" id="newVarModal" role="dialog" aria-modal="true" aria-labelledby="newVarTitle">' +
      '<div class="modal-header">' +
        '<div><div class="modal-category">Nova variante</div><h2 class="modal-title" id="newVarTitle">Adicionar Variante</h2></div>' +
        '<button class="modal-close" id="closeNewVarBtn" type="button" aria-label="Fechar">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="field-group"><label for="newVarName">Nome <span class="req">*</span></label><input id="newVarName" type="text" placeholder="teste4"><div class="field-desc">Use minusculas, numeros, hifen ou ponto.</div></div>' +
        '<div class="edit-mode-bar">' +
          '<button class="edit-mode-btn" type="button" data-new-var-mode="html">HTML</button>' +
          '<button class="edit-mode-btn" type="button" data-new-var-mode="css">CSS</button>' +
          '<button class="edit-mode-btn" type="button" data-new-var-mode="preview">Preview</button>' +
        '</div>' +
        '<div class="edit-mode-panel" id="newVarPanelHtml"><textarea class="edit-textarea" id="newVarHtml"></textarea></div>' +
        '<div class="edit-mode-panel" id="newVarPanelCss"><textarea class="edit-textarea" id="newVarCss"></textarea></div>' +
        '<div class="edit-mode-panel" id="newVarPanelPreview"><iframe class="edit-preview-iframe" id="newVarPreviewIframe" title="Preview da nova variante"></iframe></div>' +
        '<pre class="code-block hidden" id="newVarGeneratedCode"></pre>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<span id="newVarCopyBtn"></span>' +
        '<button class="btn btn-ghost" id="copyNewVarCodeBtn" type="button">' + iconSvg('copy') + '<span>Copiar codigo</span></button>' +
        '<button class="btn btn-primary" id="closeNewVarDoneBtn" type="button">Concluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('closeNewVarBtn').addEventListener('click', closeNewVariantModal);
  document.getElementById('closeNewVarDoneBtn').addEventListener('click', closeNewVariantModal);
  document.getElementById('copyNewVarCodeBtn').addEventListener('click', function () {
    updateNewVarCode();
    if (this.classList.contains('btn-blocked')) return;
    copyToClipboard(document.getElementById('newVarGeneratedCode').textContent, this, 'Codigo copiado!');
  });

  Array.prototype.forEach.call(overlay.querySelectorAll('[data-new-var-mode]'), function (btn) {
    btn.addEventListener('click', function () {
      switchNewVarMode(btn.getAttribute('data-new-var-mode'));
    });
  });

  ['newVarName', 'newVarHtml', 'newVarCss'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateNewVarCode);
  });

  overlayClick('newVarOverlay', closeNewVariantModal);
  if (window.ghvInjectButtons) window.ghvInjectButtons();
}

function getNewVariantFormData() {
  var layout = state.currentForVariant;
  var name = document.getElementById('newVarName');
  var html = document.getElementById('newVarHtml');
  var css = document.getElementById('newVarCss');
  if (!layout || !name || !html || !css) return null;
  if (!/^[a-z0-9.-]{2,}$/.test(name.value.trim())) return null;
  return {
    layoutId: layout.id,
    name: name.value.trim(),
    html: html.value,
    css: css.value
  };
}

function updateNewVarCode() {
  var name = document.getElementById('newVarName');
  var copy = document.getElementById('copyNewVarCodeBtn');
  var code = document.getElementById('newVarGeneratedCode');
  var valid = name && /^[a-z0-9.-]{2,}$/.test(name.value.trim());
  var data = {
    name: name ? name.value.trim() : '',
    html: (document.getElementById('newVarHtml') || {}).value || '',
    css: (document.getElementById('newVarCss') || {}).value || ''
  };
  if (copy) copy.classList.toggle('btn-blocked', !valid);
  if (code) code.textContent = formatVariantObject(data);
}

function switchNewVarMode(mode) {
  var html = document.getElementById('newVarHtml').value;
  var css = document.getElementById('newVarCss').value;
  Array.prototype.forEach.call(document.querySelectorAll('#newVarOverlay .edit-mode-btn'), function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-new-var-mode') === mode);
  });
  Array.prototype.forEach.call(document.querySelectorAll('#newVarOverlay .edit-mode-panel'), function (panel) {
    panel.classList.remove('active');
  });
  document.getElementById('newVarPanel' + (mode === 'css' ? 'Css' : mode === 'html' ? 'Html' : 'Preview')).classList.add('active');
  if (mode === 'preview') refreshModalPreview(document.getElementById('newVarPreviewIframe'), html, css);
}

function openNewVariantModal() {
  _buildNewVarModal();
  document.getElementById('newVarName').value = '';
  document.getElementById('newVarHtml').value = '';
  document.getElementById('newVarCss').value = '';
  document.getElementById('newVarOverlay').classList.remove('hidden');
  setBodyLocked(true);
  updateNewVarCode();
  switchNewVarMode('html');
  if (window.ghvInjectButtons) window.ghvInjectButtons();
}

function closeNewVariantModal() {
  var overlay = document.getElementById('newVarOverlay');
  if (overlay) overlay.classList.add('hidden');
  setBodyLocked(!document.getElementById('variantsOverlay').classList.contains('hidden'));
}
