/* ============================================================================
   script.js - Bootstrap da aplicacao

   RESPONSABILIDADE:
     Conecta listeners globais, inicializa tema, busca contextual, grid e
     modais criticos pre-construidos.

   EXPOE (globais):
     Nenhum novo global; usa funcoes dos modulos carregados antes.

   DEPENDENCIAS:
     Todos os modulos core e colecoes.

   ORDEM DE CARREGAMENTO:
     Depois dos modulos de UI e antes dos modulos GitHub.
============================================================================ */

function isOverlayOpen(id) {
  return document.getElementById(id) && !document.getElementById(id).classList.contains('hidden');
}

function closeTopLibraryModal() {
  if (isOverlayOpen('pickerOverlay')) closeAdicionarPicker();
  else if (isOverlayOpen('editVarOverlay')) closeEditVariantModal();
  else if (isOverlayOpen('newVarOverlay')) closeNewVariantModal();
  else if (isOverlayOpen('variantsOverlay')) closeVariantsModal();
  else if (isOverlayOpen('editModalOverlay')) closeEditModal();
  else if (isOverlayOpen('addModalOverlay')) closeAddModal();
}

function scaleVisibleCardIframes() {
  Array.prototype.forEach.call(document.querySelectorAll('.card-iframe'), function (iframe) {
    scaleCardIframe(iframe);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('searchInput');
  var searchTimer;

  initTheme();
  renderGrid();
  _buildEditModal();
  _buildVariantsModal();
  if (window._colBuildCollectionModal) window._colBuildCollectionModal();
  renderPickerOptions();

  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
  document.getElementById('copyAllBtn').addEventListener('click', copiarBasics);
  document.getElementById('openAddModal').addEventListener('click', openAdicionarPicker);
  document.getElementById('pickerCloseBtn').addEventListener('click', closeAdicionarPicker);
  overlayClick('pickerOverlay', closeAdicionarPicker);

  document.getElementById('logoHome').addEventListener('click', function () {
    searchInput.value = '';
    state.search = '';
    if (getActiveTab() !== 'biblioteca') colSwitchTab('biblioteca');
    renderGrid();
  });

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      if (getActiveTab() === 'colecoes') colSetSearch(searchInput.value);
      else {
        state.search = searchInput.value.trim();
        renderGrid();
      }
    }, 150);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeTopLibraryModal();
  });

  window.addEventListener('resize', function () {
    clearTimeout(window._senkoResizeTimer);
    window._senkoResizeTimer = setTimeout(scaleVisibleCardIframes, 120);
  });
});
