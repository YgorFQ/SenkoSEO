/* ═══════════════════════════════════════════════════════════════════════
   modal-new-variant.js — Modal de criar nova variante

   RESPONSABILIDADE:
     Cria e gerencia o modal de nova variante. Valida nome em tempo real
     (só letras minúsculas, números, hífen e ponto). Gera código com
     marcador @@@@Senko. Expõe âncora #newVarCopyBtn para o GitHub.

   EXPÕE (globais):
     openNewVariantModal(layout) → void
     closeNewVariantModal()      → void
     updateNewVarCode()          → void

   DEPENDÊNCIAS:
     utils.js, modal-edit.js (overlayClick)

   ORDEM DE CARREGAMENTO:
     Após modal-edit-variant.js
═══════════════════════════════════════════════════════════════════════ */

function _buildNewVarModal() {
  if (document.getElementById('newVarOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id        = 'newVarOverlay';
  overlay.className = 'modal-overlay hidden';
  overlay.style.zIndex = '1100';

  overlay.innerHTML =
    '<div class="modal" id="newVarModal" style="max-width:680px;width:95%;">' +
      '<div class="modal-header">' +
        '<div>' +
          '<span class="modal-category">Variante</span>' +
          '<h2 class="modal-title" id="newVarTitle">Nova Variante</h2>' +
        '</div>' +
        '<button class="modal-close" id="closeNewVarBtn">✕</button>' +
      '</div>' +

      '<div class="add-fields" style="padding:.75rem 1rem 0;">' +
        '<div class="field-group">' +
          '<label>Nome <span class="req">*</span>' +
            '<span class="hint"> — só letras minúsculas, números, hífen e ponto</span>' +
          '</label>' +
          '<input type="text" id="newVarName" placeholder="ex: hero-dark">' +
          '<span class="field-desc" id="newVarNameHint"></span>' +
        '</div>' +
      '</div>' +

      '<div class="edit-mode-bar" style="margin:.75rem 1rem 0;">' +
        '<button class="edit-mode-btn active" data-nv-mode="html">HTML</button>' +
        '<button class="edit-mode-btn" data-nv-mode="css">CSS</button>' +
        '<button class="edit-mode-btn" data-nv-mode="preview">Preview</button>' +
      '</div>' +

      '<div class="edit-mode-panel active" id="newVarPanelHtml" style="padding:.75rem 1rem 0;">' +
        '<textarea class="edit-textarea" id="newVarHtml" placeholder="HTML da variante..."></textarea>' +
      '</div>' +
      '<div class="edit-mode-panel" id="newVarPanelCss" style="padding:.75rem 1rem 0;">' +
        '<textarea class="edit-textarea" id="newVarCss" placeholder="CSS da variante..."></textarea>' +
      '</div>' +
      '<div class="edit-mode-panel" id="newVarPanelPreview" style="padding:.75rem 1rem 1rem;">' +
        '<iframe class="edit-preview-iframe" id="newVarIframe" frameborder="0"></iframe>' +
      '</div>' +

      '<div class="add-result-section" style="padding:.75rem 1rem 1rem;">' +
        '<div class="code-toolbar">' +
          '<span class="code-lang">JS gerado (@@@@Senko)</span>' +
          '<span id="newVarCopyBtn" style="display:none;"></span>' +
        '</div>' +
        '<pre class="code-block" id="newVarGeneratedCode" style="display:none;"></pre>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.querySelector('#closeNewVarBtn').addEventListener('click', closeNewVariantModal);
  overlayClick('newVarOverlay', 'newVarModal', closeNewVariantModal);

  // Troca de modo
  overlay.querySelectorAll('[data-nv-mode]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.nvMode;
      overlay.querySelectorAll('[data-nv-mode]').forEach(function (b) {
        b.classList.toggle('active', b.dataset.nvMode === mode);
      });
      ['newVarPanelHtml','newVarPanelCss','newVarPanelPreview'].forEach(function (pid) {
        var panel = document.getElementById(pid);
        if (panel) panel.classList.toggle('active', pid === 'newVarPanel' + mode.charAt(0).toUpperCase() + mode.slice(1));
      });
      if (mode === 'preview') {
        var iframe = document.getElementById('newVarIframe');
        var html   = document.getElementById('newVarHtml').value;
        var css    = document.getElementById('newVarCss').value;
        iframe.srcdoc = '';
        requestAnimationFrame(function () { iframe.srcdoc = buildSrcDoc(html, css); });
      }
    });
  });

  // Validação de nome em tempo real + geração de código
  ['newVarName','newVarHtml','newVarCss'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateNewVarCode);
  });
}

/* ── Abrir / fechar ─────────────────────────────────────────────────── */

function openNewVariantModal(layout) {
  _buildNewVarModal();
  document.getElementById('newVarTitle').textContent = 'Nova Variante — ' + layout.name;
  document.getElementById('newVarName').value = '';
  document.getElementById('newVarHtml').value = '';
  document.getElementById('newVarCss').value  = '';
  var code = document.getElementById('newVarGeneratedCode');
  if (code) code.style.display = 'none';

  // Armazena layout atual para o GitHub saber onde salvar
  state.currentForVariant = layout;

  document.getElementById('newVarOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeNewVariantModal() {
  var overlay = document.getElementById('newVarOverlay');
  if (overlay) overlay.classList.add('hidden');
  var iframe = document.getElementById('newVarIframe');
  if (iframe) iframe.srcdoc = '';
}

/* ── Validação e geração de código ──────────────────────────────────── */

function updateNewVarCode() {
  var nameEl = document.getElementById('newVarName');
  var htmlEl = document.getElementById('newVarHtml');
  var cssEl  = document.getElementById('newVarCss');
  if (!nameEl) return;

  var name = nameEl.value.trim();
  var html = htmlEl ? htmlEl.value : '';
  var css  = cssEl  ? cssEl.value  : '';

  // Validação de nome
  var valid   = /^[a-z0-9.\-]+$/.test(name);
  var hintEl  = document.getElementById('newVarNameHint');
  var codeEl  = document.getElementById('newVarGeneratedCode');

  if (hintEl) {
    hintEl.textContent = name && !valid ? 'Nome inválido — use apenas letras minúsculas, números, hífen e ponto.' : '';
    hintEl.style.color = name && !valid ? 'var(--red)' : '';
  }

  if (!name || !valid) {
    if (codeEl) codeEl.style.display = 'none';
    return;
  }

  var code =
    '/*@@@@Senko - ' + name + ' */\n' +
    '{\n' +
    '  name: \'' + name + '\',\n' +
    '  html: `' + html + '`,\n' +
    '  css:  `' + css  + '`,\n' +
    '},';

  if (codeEl) {
    codeEl.textContent  = code;
    codeEl.style.display = 'block';
  }
}
