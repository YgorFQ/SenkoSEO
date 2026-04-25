/* ═══════════════════════════════════════════════════════════════════════
   modal-edit.js — Modal de editar layout

   RESPONSABILIDADE:
     Cria o modal de edição dinamicamente (uma única vez), abre/fecha,
     popula campos com os dados do layout e gerencia troca de modo
     (HTML | CSS | Visualizar). Expõe âncora #saveToFileBtn para o
     módulo GitHub injetar o botão de salvar.

   EXPÕE (globais):
     openEditModal(layout)          → void
     closeEditModal()               → void
     switchEditMode(mode)           → void
     updateEditCode(field, value)   → void  (chamado por GitHub ao salvar)

   DEPENDÊNCIAS:
     utils.js, favorites.js

   ORDEM DE CARREGAMENTO:
     Após grid.js, antes de script.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Build único do modal ───────────────────────────────────────────── */

// Cria o modal no DOM uma única vez; chamadas seguintes retornam imediatamente
function _buildEditModal() {
  if (document.getElementById('editModalOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id        = 'editModalOverlay';
  overlay.className = 'modal-overlay hidden';

  overlay.innerHTML =
    '<div class="modal edit-modal" id="editModal">' +
      '<div class="modal-header">' +
        '<div class="modal-header-left">' +
          '<span class="modal-category">Layout</span>' +
          '<h2 class="modal-title" id="editModalTitle">Editar Layout</h2>' +
        '</div>' +
        '<div class="modal-header-right">' +
          '<button class="btn btn-fav-header" id="editFavBtn" title="Favoritar">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
            ' Favorito' +
          '</button>' +
          '<span id="saveToFileBtn"></span>' +
          '<button class="modal-close" id="closeEditBtn">✕</button>' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-bar">' +
        '<button class="edit-mode-btn" data-mode="html">HTML</button>' +
        '<button class="edit-mode-btn" data-mode="css">CSS</button>' +
        '<button class="edit-mode-btn active" data-mode="preview">Visualizar</button>' +
      '</div>' +

      '<div class="edit-mode-panel" id="editPanelHtml">' +
        '<div class="add-fields" style="padding:1rem;">' +
          '<div class="field-group">' +
            '<label>ID <span class="hint">(não editável)</span></label>' +
            '<input type="text" id="editLayoutId" readonly style="opacity:.5;">' +
          '</div>' +
          '<div class="field-group">' +
            '<label>Nome</label>' +
            '<input type="text" id="editLayoutName">' +
          '</div>' +
          '<div class="field-group">' +
            '<label>Tags <span class="hint">(separadas por vírgula)</span></label>' +
            '<input type="text" id="editLayoutTags">' +
          '</div>' +
        '</div>' +
        '<div style="padding:0 1rem 1rem;">' +
          '<textarea class="edit-textarea" id="editHtmlTextarea" placeholder="HTML do layout..."></textarea>' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-panel" id="editPanelCss">' +
        '<div style="padding:1rem;">' +
          '<textarea class="edit-textarea" id="editCssTextarea" placeholder="CSS do layout..."></textarea>' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-panel active" id="editPanelPreview">' +
        '<iframe class="edit-preview-iframe" id="editPreviewIframe" frameborder="0"></iframe>' +
      '</div>' +

      '<div style="display:none;" id="editGeneratedCode"></div>' +
    '</div>';

  document.body.appendChild(overlay);

  // Botão fechar
  overlay.querySelector('#closeEditBtn').addEventListener('click', closeEditModal);

  // Clique no overlay (duplo em 400ms)
  overlayClick('editModalOverlay', 'editModal', closeEditModal);

  // Troca de modo
  overlay.querySelectorAll('.edit-mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchEditMode(btn.dataset.mode);
    });
  });

  // Favoritar pelo modal
  overlay.querySelector('#editFavBtn').addEventListener('click', function () {
    if (!state.currentEdit) return;
    var active = toggleFav(state.currentEdit.id);
    var btn = overlay.querySelector('#editFavBtn');
    btn.classList.toggle('active', active);
    var svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    renderGrid();
  });

  // Sincroniza inputs de nome/tags com state ao digitar
  overlay.querySelector('#editLayoutName').addEventListener('input', function () {
    if (state.currentEdit) state.currentEdit.name = this.value;
  });
  overlay.querySelector('#editLayoutTags').addEventListener('input', function () {
    if (state.currentEdit) {
      state.currentEdit.tags = this.value.split(',').map(function (t) {
        return t.trim();
      }).filter(Boolean);
    }
  });
}

/* ── Abrir / fechar ─────────────────────────────────────────────────── */

function openEditModal(layout) {
  _buildEditModal();
  state.currentEdit = layout;

  var overlay = document.getElementById('editModalOverlay');
  document.getElementById('editModalTitle').textContent = layout.name;
  document.getElementById('editLayoutId').value   = layout.id;
  document.getElementById('editLayoutName').value = layout.name;
  document.getElementById('editLayoutTags').value = (layout.tags || []).join(', ');
  document.getElementById('editHtmlTextarea').value = layout.html || '';
  document.getElementById('editCssTextarea').value  = layout.css  || '';

  // Favorito
  var btnFav = overlay.querySelector('#editFavBtn');
  var fav    = isFav(layout.id);
  btnFav.classList.toggle('active', fav);
  var svg = btnFav.querySelector('svg');
  if (svg) svg.setAttribute('fill', fav ? 'currentColor' : 'none');

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Abre em Preview por padrão (após micro-delay para o modal aparecer primeiro)
  setTimeout(function () { switchEditMode('preview'); }, 10);
}

function closeEditModal() {
  var overlay = document.getElementById('editModalOverlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  state.currentEdit = null;
  document.body.style.overflow = '';
  // Limpa iframe
  var iframe = document.getElementById('editPreviewIframe');
  if (iframe) iframe.srcdoc = '';
}

/* ── Troca de modo ──────────────────────────────────────────────────── */

// Ativa o painel correto e carrega preview quando necessário
function switchEditMode(mode) {
  var overlay = document.getElementById('editModalOverlay');
  if (!overlay) return;

  overlay.querySelectorAll('.edit-mode-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  var panels = { html: 'editPanelHtml', css: 'editPanelCss', preview: 'editPanelPreview' };
  Object.keys(panels).forEach(function (key) {
    var panel = document.getElementById(panels[key]);
    if (panel) panel.classList.toggle('active', key === mode);
  });

  if (mode === 'preview') {
    var iframe = document.getElementById('editPreviewIframe');
    var html   = document.getElementById('editHtmlTextarea').value;
    var css    = document.getElementById('editCssTextarea').value;
    iframe.srcdoc = '';
    requestAnimationFrame(function () {
      iframe.srcdoc = buildSrcDoc(html, css);
    });
  }
}

/* ── Atualizar campos (chamado por módulo GitHub após save) ─────────── */

function updateEditCode(field, value) {
  if (field === 'html') {
    document.getElementById('editHtmlTextarea').value = value;
    if (state.currentEdit) state.currentEdit.html = value;
  }
  if (field === 'css') {
    document.getElementById('editCssTextarea').value = value;
    if (state.currentEdit) state.currentEdit.css = value;
  }
}

/* ── Helper: fechar overlay com duplo clique ────────────────────────── */

// Registra handler de clique no overlay que exige dois cliques em 400ms
function overlayClick(overlayId, modalId, closeFn) {
  var clickCount = 0;
  var timer;
  var overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.addEventListener('click', function (e) {
    var modal = document.getElementById(modalId);
    if (modal && modal.contains(e.target)) return;
    clickCount++;
    if (clickCount === 1) {
      timer = setTimeout(function () { clickCount = 0; }, 400);
    } else {
      clearTimeout(timer);
      clickCount = 0;
      closeFn();
    }
  });
}
