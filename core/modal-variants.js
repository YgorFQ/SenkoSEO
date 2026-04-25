/* ═══════════════════════════════════════════════════════════════════════
   modal-variants.js — Modal de listagem de variantes

   RESPONSABILIDADE:
     Cria e gerencia o modal de variantes: lista todos os variantes do
     layout selecionado com preview lazy-loaded, busca por nome,
     favoritos e botões de ação. O card "+ Nova Variante" dispara
     openNewVariantModal(). Botões de excluir ficam ocultos por padrão
     e são ativados pelo módulo GitHub.

   EXPÕE (globais):
     openVariantsModal(layout)  → void
     closeVariantsModal()       → void
     renderVariantBlocks()      → void  (chamado após add/delete)

   DEPENDÊNCIAS:
     utils.js, favorites.js, modal-edit-variant.js, modal-new-variant.js

   ORDEM DE CARREGAMENTO:
     Após modal-add.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Build único do modal ───────────────────────────────────────────── */

function _buildVariantsModal() {
  if (document.getElementById('variantsOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id        = 'variantsOverlay';
  overlay.className = 'modal-overlay hidden';

  overlay.innerHTML =
    '<div class="modal variants-modal" id="variantsModal">' +
      '<div class="modal-header variants-modal-header">' +
        '<div class="variants-header-left">' +
          '<span class="modal-category">Variantes</span>' +
          '<h2 class="modal-title" id="variantsModalTitle">–</h2>' +
          '<span class="variants-hint" id="variantsFileHint"></span>' +
        '</div>' +
        '<div class="variants-header-right">' +
          '<span class="variants-stats-badge" id="variantsStatsBadge"></span>' +
          '<div class="variants-search-wrap">' +
            '<input type="text" id="variantsSearchInput" placeholder="Buscar variante…">' +
          '</div>' +
          '<button class="modal-close" id="closeVariantsBtn">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="variants-grid-wrap">' +
        '<div class="variants-grid" id="variantsGrid"></div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.querySelector('#closeVariantsBtn').addEventListener('click', closeVariantsModal);
  overlayClick('variantsOverlay', 'variantsModal', closeVariantsModal);

  // Busca de variantes com debounce
  var _vSearchTimeout;
  overlay.querySelector('#variantsSearchInput').addEventListener('input', function () {
    clearTimeout(_vSearchTimeout);
    var q = this.value;
    _vSearchTimeout = setTimeout(function () {
      renderVariantBlocks(q);
    }, 150);
  });
}

/* ── Abrir / fechar ─────────────────────────────────────────────────── */

function openVariantsModal(layout) {
  _buildVariantsModal();
  state.currentForVariant = layout;

  document.getElementById('variantsModalTitle').textContent = layout.name;
  document.getElementById('variantsFileHint').textContent   = 'variants/' + layout.id + '.js';
  document.getElementById('variantsSearchInput').value      = '';

  document.getElementById('variantsOverlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  renderVariantBlocks();
}

function closeVariantsModal() {
  var overlay = document.getElementById('variantsOverlay');
  if (overlay) overlay.classList.add('hidden');
  state.currentForVariant = null;
  document.body.style.overflow = '';
}

/* ── Renderização dos blocos de variantes ───────────────────────────── */

// Re-renderiza o grid de variantes (chama ao abrir, ao filtrar e após mutações)
function renderVariantBlocks(searchQuery) {
  var layout = state.currentForVariant;
  if (!layout) return;

  var grid   = document.getElementById('variantsGrid');
  if (!grid) return;

  var search   = (searchQuery || '').toLowerCase();
  var variants = SenkoLib.getVariants(layout.id);
  var filtered = search
    ? variants.filter(function (v) { return v.name.toLowerCase().indexOf(search) !== -1; })
    : variants;

  var fragment = document.createDocumentFragment();

  // Cards de variantes
  filtered.forEach(function (v, i) {
    var block = _createVariantBlock(layout, v, i);
    fragment.appendChild(block);
  });

  // Card "+ Adicionar Nova Variante"
  var addCard = document.createElement('div');
  addCard.className = 'variant-block variant-add-card';
  addCard.id        = 'openNewVariantBtn';
  addCard.innerHTML = '<div class="variant-add-icon">+</div><span>Nova Variante</span>';
  addCard.addEventListener('click', function () {
    if (typeof openNewVariantModal === 'function') openNewVariantModal(layout);
  });
  fragment.appendChild(addCard);

  grid.innerHTML = '';
  grid.appendChild(fragment);

  // Atualizar stats
  var total    = variants.length;
  var favCount = variants.filter(function (v) { return isVarFav(layout.id, v.name); }).length;
  var badge    = document.getElementById('variantsStatsBadge');
  if (badge) badge.textContent = total + ' variante' + (total !== 1 ? 's' : '') +
    (favCount ? ' · ' + favCount + ' ⭐' : '');
}

/* ── Card individual de variante ────────────────────────────────────── */

function _createVariantBlock(layout, variant, index) {
  var block = document.createElement('div');
  block.className = 'variant-block';
  block.style.animationDelay = (index * 30) + 'ms';

  var fav = isVarFav(layout.id, variant.name);

  block.innerHTML =
    '<div class="variant-preview">' +
      '<iframe class="card-iframe" frameborder="0" scrolling="no" tabindex="-1"></iframe>' +
      '<div class="variant-preview-overlay"></div>' +
    '</div>' +
    '<div class="variant-body">' +
      '<div class="variant-name">' + variant.name + '</div>' +
      '<div class="variant-footer">' +
        '<button class="btn btn-fav' + (fav ? ' active' : '') + '" title="Favoritar variante">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="' + (fav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
        '</button>' +
        '<button class="btn btn-ghost btn-edit-icon" title="Editar variante">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</button>' +
        '<button class="btn btn-ghost btn-delete-variant-card" title="Excluir variante" style="display:none;">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';

  // Lazy load preview
  var iframe = block.querySelector('.card-iframe');
  lazyIframe(iframe, variant.html || '', variant.css || '');

  // Favoritar
  var btnFav = block.querySelector('.btn-fav');
  btnFav.addEventListener('click', function (e) {
    e.stopPropagation();
    var active = toggleVarFav(layout.id, variant.name);
    btnFav.classList.toggle('active', active);
    var svg = btnFav.querySelector('svg');
    if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    renderVariantBlocks(document.getElementById('variantsSearchInput').value);
  });

  // Editar
  block.querySelector('.btn-edit-icon').addEventListener('click', function (e) {
    e.stopPropagation();
    if (typeof openEditVariantModal === 'function') openEditVariantModal(layout, variant);
  });

  return block;
}
