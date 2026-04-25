/* ============================================================================
   modal-edit.js - Modal de editar layout

   RESPONSABILIDADE:
     Cria dinamicamente o modal de edicao, alterna HTML/CSS/Preview e gera
     o objeto JS usado pelos modulos GitHub.

   EXPOE (globais):
     _buildEditModal() -> pre-cria estrutura
     openEditModal(layout), closeEditModal() -> controla exibicao
     switchEditMode(mode), updateEditCode() -> painel e codigo
     getEditFormData() -> dados validados do formulario

   DEPENDENCIAS:
     utils.js.

   ORDEM DE CARREGAMENTO:
     Depois de grid.js e antes do bootstrap.
============================================================================ */

function _buildEditModal() {
  var overlay;
  if (document.getElementById('editModalOverlay')) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay hidden';
  overlay.id = 'editModalOverlay';
  overlay.innerHTML =
    '<div class="modal edit-modal" id="editModal" role="dialog" aria-modal="true" aria-labelledby="editModalTitle">' +
      '<div class="modal-header">' +
        '<div><div class="modal-category">Editar layout</div><h2 class="modal-title" id="editModalTitle">Layout</h2></div>' +
        '<button class="modal-close" id="closeEditModalBtn" type="button" aria-label="Fechar">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<input type="hidden" id="editId">' +
        '<div class="field-row">' +
          '<div class="field-group"><label for="editName">Nome <span class="req">*</span></label><input id="editName" type="text"></div>' +
          '<div class="field-group"><label for="editTags">Tags</label><input id="editTags" type="text"><div class="field-desc">Separe por virgulas.</div></div>' +
        '</div>' +
        '<div class="edit-mode-bar">' +
          '<button class="edit-mode-btn" type="button" data-edit-mode="html">HTML</button>' +
          '<button class="edit-mode-btn" type="button" data-edit-mode="css">CSS</button>' +
          '<button class="edit-mode-btn" type="button" data-edit-mode="preview">Visualizar</button>' +
        '</div>' +
        '<div class="edit-mode-panel" id="editPanelHtml"><textarea class="edit-textarea" id="editHtml"></textarea></div>' +
        '<div class="edit-mode-panel" id="editPanelCss"><textarea class="edit-textarea" id="editCss"></textarea></div>' +
        '<div class="edit-mode-panel" id="editPanelPreview"><iframe class="edit-preview-iframe" id="editPreviewIframe" title="Preview do layout"></iframe></div>' +
        '<pre class="code-block hidden" id="editGeneratedCode"></pre>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<div class="modal-actions-left"><button class="btn btn-danger" id="editDeleteBtn" type="button" style="display:none">' + iconSvg('trash') + '<span>Excluir</span></button></div>' +
        '<span id="saveToFileBtn"></span>' +
        '<button class="btn btn-ghost" id="copyEditCodeBtn" type="button">' + iconSvg('copy') + '<span>Copiar codigo</span></button>' +
        '<button class="btn btn-primary" id="closeEditDoneBtn" type="button">Concluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  document.getElementById('closeEditModalBtn').addEventListener('click', closeEditModal);
  document.getElementById('closeEditDoneBtn').addEventListener('click', closeEditModal);
  document.getElementById('copyEditCodeBtn').addEventListener('click', function () {
    updateEditCode();
    copyToClipboard(document.getElementById('editGeneratedCode').textContent, this, 'Codigo copiado!');
  });

  Array.prototype.forEach.call(overlay.querySelectorAll('[data-edit-mode]'), function (btn) {
    btn.addEventListener('click', function () {
      switchEditMode(btn.getAttribute('data-edit-mode'));
    });
  });

  ['editName', 'editTags', 'editHtml', 'editCss'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateEditCode);
  });

  overlayClick('editModalOverlay', closeEditModal);
  if (window.senkoGithubInjectButtons) window.senkoGithubInjectButtons();
  if (window.ghDeleteInjectButton) window.ghDeleteInjectButton();
}

function getEditFormData() {
  var id = document.getElementById('editId');
  var name = document.getElementById('editName');
  var tags = document.getElementById('editTags');
  var html = document.getElementById('editHtml');
  var css = document.getElementById('editCss');
  if (!id || !name || !html || !css) return null;
  return {
    id: id.value,
    name: name.value.trim(),
    tags: parseTags(tags.value),
    html: html.value,
    css: css.value
  };
}

function updateEditCode() {
  var data = getEditFormData();
  var code = document.getElementById('editGeneratedCode');
  if (!data || !code) return;
  code.textContent = formatLayoutObject(data);
}

function switchEditMode(mode) {
  var iframe = document.getElementById('editPreviewIframe');
  var data = getEditFormData();
  Array.prototype.forEach.call(document.querySelectorAll('#editModalOverlay .edit-mode-btn'), function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-edit-mode') === mode);
  });
  Array.prototype.forEach.call(document.querySelectorAll('#editModalOverlay .edit-mode-panel'), function (panel) {
    panel.classList.remove('active');
  });
  document.getElementById('editPanel' + (mode === 'css' ? 'Css' : mode === 'html' ? 'Html' : 'Preview')).classList.add('active');
  if (mode === 'preview' && data) {
    setTimeout(function () {
      refreshModalPreview(iframe, data.html, data.css);
    }, 50);
  }
}

function openEditModal(layout) {
  _buildEditModal();
  state.currentEdit = layout;
  document.getElementById('editId').value = layout.id || '';
  document.getElementById('editName').value = layout.name || '';
  document.getElementById('editTags').value = (layout.tags || []).join(', ');
  document.getElementById('editHtml').value = layout.html || '';
  document.getElementById('editCss').value = layout.css || '';
  document.getElementById('editModalTitle').textContent = layout.name || 'Layout';
  updateEditCode();
  document.getElementById('editModalOverlay').classList.remove('hidden');
  setBodyLocked(true);
  setTimeout(function () {
    switchEditMode('preview');
  }, 10);
  if (window.senkoGithubInjectButtons) window.senkoGithubInjectButtons();
  if (window.ghDeleteInjectButton) window.ghDeleteInjectButton();
}

function closeEditModal() {
  var overlay = document.getElementById('editModalOverlay');
  if (overlay) overlay.classList.add('hidden');
  state.currentEdit = null;
  setBodyLocked(false);
}
