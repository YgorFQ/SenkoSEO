/* ═══════════════════════════════════════════════════════════════════════
   modal-edit-variant.js — Modal de editar variante existente

   RESPONSABILIDADE:
     Cria e gerencia o modal de edição de uma variante. Abre em modo
     Preview por padrão. Expõe âncora #saveVarToFileBtn e
     #editVarGeneratedCode para o módulo GitHub. Não muta
     state.currentEditVariant durante edição — só após confirmar save.

   EXPÕE (globais):
     openEditVariantModal(layout, variant) → void
     closeEditVariantModal()               → void
     switchEditVarMode(mode)               → void
     updateEditVarCode(field, value)       → void

   DEPENDÊNCIAS:
     utils.js, modal-edit.js (overlayClick)

   ORDEM DE CARREGAMENTO:
     Após modal-variants.js
═══════════════════════════════════════════════════════════════════════ */

function _buildEditVarModal() {
  if (document.getElementById('editVarOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id        = 'editVarOverlay';
  overlay.className = 'modal-overlay hidden';
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal edit-modal" id="editVarModal">' +
      '<div class="modal-header">' +
        '<div class="modal-header-left">' +
          '<span class="modal-category">Variante</span>' +
          '<h2 class="modal-title" id="editVarTitle">Editar Variante</h2>' +
        '</div>' +
        '<div class="modal-header-right">' +
          '<button class="btn btn-ghost btn-delete-var-modal" id="editVarDeleteBtn" style="display:none;">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
            ' Excluir' +
          '</button>' +
          '<span id="saveVarToFileBtn"></span>' +
          '<button class="modal-close" id="closeEditVarBtn">✕</button>' +
        '</div>' +
      '</div>' +

      '<div class="add-fields" style="padding:.75rem 1rem 0;">' +
        '<div class="field-group">' +
          '<label>Nome <span class="hint">(só letras minúsculas, números, hífen, ponto)</span></label>' +
          '<input type="text" id="editVarName">' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-bar" style="margin:.75rem 1rem 0;">' +
        '<button class="edit-mode-btn" data-evar-mode="html">HTML</button>' +
        '<button class="edit-mode-btn" data-evar-mode="css">CSS</button>' +
        '<button class="edit-mode-btn active" data-evar-mode="preview">Visualizar</button>' +
      '</div>' +

      '<div class="edit-mode-panel" id="editVarPanelHtml" style="padding:.75rem 1rem 0;">' +
        '<textarea class="edit-textarea" id="editVarHtml" placeholder="HTML da variante..."></textarea>' +
      '</div>' +
      '<div class="edit-mode-panel" id="editVarPanelCss" style="padding:.75rem 1rem 0;">' +
        '<textarea class="edit-textarea" id="editVarCss" placeholder="CSS da variante..."></textarea>' +
      '</div>' +
      '<div class="edit-mode-panel active" id="editVarPanelPreview" style="padding:.75rem 1rem 1rem;">' +
        '<iframe class="edit-preview-iframe" id="editVarIframe" frameborder="0"></iframe>' +
      '</div>' +

      '<div style="display:none;" id="editVarGeneratedCode"></div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.querySelector('#closeEditVarBtn').addEventListener('click', closeEditVariantModal);
  overlayClick('editVarOverlay', 'editVarModal', closeEditVariantModal);

  overlay.querySelectorAll('[data-evar-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () { switchEditVarMode(btn.dataset.evarMode); });
  });
}

/* ── Abrir / fechar ─────────────────────────────────────────────────── */

function openEditVariantModal(layout, variant) {
  _buildEditVarModal();
  // Armazena referência sem mutar até save confirmado
  state.currentEditVariant = { layout: layout, variant: variant };

  document.getElementById('editVarTitle').textContent = variant.name;
  document.getElementById('editVarName').value        = variant.name;
  document.getElementById('editVarHtml').value        = variant.html || '';
  document.getElementById('editVarCss').value         = variant.css  || '';

  document.getElementById('editVarOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  setTimeout(function () { switchEditVarMode('preview'); }, 10);
}

function closeEditVariantModal() {
  var overlay = document.getElementById('editVarOverlay');
  if (overlay) overlay.classList.add('hidden');
  state.currentEditVariant = null;
  var iframe = document.getElementById('editVarIframe');
  if (iframe) iframe.srcdoc = '';
}

/* ── Troca de modo ──────────────────────────────────────────────────── */

function switchEditVarMode(mode) {
  var overlay = document.getElementById('editVarOverlay');
  if (!overlay) return;

  overlay.querySelectorAll('[data-evar-mode]').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.evarMode === mode);
  });

  var panels = { html: 'editVarPanelHtml', css: 'editVarPanelCss', preview: 'editVarPanelPreview' };
  Object.keys(panels).forEach(function (key) {
    var panel = document.getElementById(panels[key]);
    if (panel) panel.classList.toggle('active', key === mode);
  });

  if (mode === 'preview') {
    var iframe = document.getElementById('editVarIframe');
    var html   = document.getElementById('editVarHtml').value;
    var css    = document.getElementById('editVarCss').value;
    iframe.srcdoc = '';
    requestAnimationFrame(function () { iframe.srcdoc = buildSrcDoc(html, css); });
  }
}

/* ── Atualizar campos (GitHub callback) ─────────────────────────────── */

function updateEditVarCode(field, value) {
  if (field === 'html') document.getElementById('editVarHtml').value = value;
  if (field === 'css')  document.getElementById('editVarCss').value  = value;
}
