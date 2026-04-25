/* ═══════════════════════════════════════════════════════════════════════
   script.js — Bootstrap da interface da Biblioteca

   RESPONSABILIDADE:
     Inicialização do DOMContentLoaded: conecta todos os módulos,
     registra listeners globais (busca, escape, tema, logo) e
     pré-constrói os modais críticos. Máximo ~80 linhas — zero lógica
     de negócio aqui; toda a lógica fica nos módulos de core/.

   EXPÕE (globais):
     state                 → objeto de estado global da Biblioteca
     copiarBasics()        → void (copia HTML base de PDP)

   DEPENDÊNCIAS:
     Todos os módulos de core/ carregados antes.

   ORDEM DE CARREGAMENTO:
     Último dos arquivos de core/
═══════════════════════════════════════════════════════════════════════ */

/* ── Estado global da Biblioteca ────────────────────────────────────── */
var state = {
  search:             '',
  currentEdit:        null,
  currentForVariant:  null,
  currentEditVariant: null,
};

/* ── Bootstrap ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }

  // Aplicar tema salvo
  initTheme();

  // Pré-construir modais críticos (evita jank na primeira abertura)
  _buildEditModal();
  _buildVariantsModal();

  // Renderizar grid inicial
  renderGrid();

  /* ── Busca com debounce ─────────────────────────────────────────── */
  var _searchTimeout;
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(_searchTimeout);
      var q = this.value.trim();
      _searchTimeout = setTimeout(function () {
        if (getActiveTab() === 'biblioteca') {
          state.search = q;
          renderGrid();
        }
      }, 150);
    });
  }

  /* ── Botão "+ Adicionar" → abre Picker ─────────────────────────── */
  var openAddBtn = document.getElementById('openAddModal');
  if (openAddBtn) openAddBtn.addEventListener('click', openAdicionarPicker);

  /* ── Toggle de tema ─────────────────────────────────────────────── */
  var themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* ── Logo: reseta busca e volta ao início ───────────────────────── */
  var logoHome = document.getElementById('logoHome');
  if (logoHome) {
    logoHome.addEventListener('click', function () {
      state.search = '';
      if (searchInput) searchInput.value = '';
      renderGrid();
    });
  }

  /* ── Escape: fecha modais do interno para o externo ─────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!_isHidden('pickerOverlay'))   { closeAdicionarPicker();     return; }
    if (!_isHidden('editVarOverlay'))  { closeEditVariantModal();    return; }
    if (!_isHidden('newVarOverlay'))   { closeNewVariantModal();     return; }
    if (!_isHidden('variantsOverlay')) { closeVariantsModal();       return; }
    if (!_isHidden('editModalOverlay')){ closeEditModal();           return; }
    if (!_isHidden('addModalOverlay')) { closeAddModal();            return; }
  });
});

/* ── Helpers ────────────────────────────────────────────────────────── */
function _isHidden(id) {
  var el = document.getElementById(id);
  return !el || el.classList.contains('hidden');
}

// Copia estrutura HTML base de PDP para o clipboard
function copiarBasics() {
  var html =
    '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <title>PDP</title>\n</head>\n<body>\n\n' +
    '  <!-- Seções do produto aqui -->\n\n' +
    '</body>\n</html>';
  copyToClipboard(html, null, '');
}
