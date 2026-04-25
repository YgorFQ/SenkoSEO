/* ============================================================================
   modal-variants.js - Modal de variantes

   RESPONSABILIDADE:
     Lista variantes do layout atual com preview lazy, busca, favoritos,
     edicao e card para criar nova variante.

   EXPOE (globais):
     _buildVariantsModal() -> pre-cria estrutura
     openVariantsModal(layout), closeVariantsModal() -> controla exibicao
     renderVariantBlocks() -> redesenha variantes

   DEPENDENCIAS:
     senkolib-core.js, utils.js, favorites.js, modal-edit-variant.js.

   ORDEM DE CARREGAMENTO:
     Depois de modal-add.js.
============================================================================ */

function _buildVariantsModal() {
  var overlay;
  if (document.getElementById('variantsOverlay')) return;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay hidden';
  overlay.id = 'variantsOverlay';
  overlay.innerHTML =
    '<div class="modal variants-modal" id="variantsModal" role="dialog" aria-modal="true" aria-labelledby="variantsTitle">' +
      '<div class="modal-header variants-modal-header">' +
        '<div class="variants-header-left">' +
          '<div class="modal-category">Variantes</div>' +
          '<h2 class="modal-title" id="variantsTitle">Variantes</h2>' +
          '<div class="variants-hint" id="variantsHint">Arquivo: variants/[id].js</div>' +
        '</div>' +
        '<div class="variants-header-right">' +
          '<span class="variants-stats-badge" id="variantsStats">0 variantes</span>' +
          '<button class="modal-close" id="closeVariantsBtn" type="button" aria-label="Fechar">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="variants-search-wrap search-wrap">' +
          '<span class="search-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg></span>' +
          '<input type="text" id="variantsSearchInput" placeholder="Buscar variantes..." autocomplete="off">' +
        '</div>' +
        '<div class="variants-grid-wrap"><div class="variants-grid" id="variantsGrid"></div></div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('closeVariantsBtn').addEventListener('click', closeVariantsModal);
  document.getElementById('variantsSearchInput').addEventListener('input', renderVariantBlocks);
  overlayClick('variantsOverlay', closeVariantsModal);
}

function createVariantBlock(variant, layout) {
  var block = document.createElement('article');
  var preview = document.createElement('div');
  var iframe = document.createElement('iframe');
  var overlay = document.createElement('span');
  var body = document.createElement('div');
  var name = document.createElement('div');
  var footer = document.createElement('div');
  var favBtn = makeButton('btn btn-fav', iconSvg('star'), 'Favoritar variante');
  var editBtn = makeButton('btn btn-edit-icon', iconSvg('edit'), 'Editar variante');
  var deleteBtn = makeButton('btn btn-danger btn-delete-variant-card', iconSvg('trash'), 'Excluir variante');

  block.className = 'variant-block';
  preview.className = 'variant-preview';
  iframe.className = 'card-iframe';
  overlay.className = 'variant-preview-overlay';
  body.className = 'variant-body';
  name.className = 'variant-name';
  footer.className = 'variant-footer';
  name.textContent = variant.name;
  deleteBtn.setAttribute('data-layout-id', layout.id);
  deleteBtn.setAttribute('data-variant-name', variant.name);

  if (isVarFav(layout.id, variant.name)) favBtn.classList.add('active');

  iframe.addEventListener('load', function () {
    scaleCardIframe(iframe);
  });
  lazyIframe(iframe, variant.html, variant.css);

  favBtn.addEventListener('click', function () {
    toggleVarFav(layout.id, variant.name);
    renderVariantBlocks();
  });
  editBtn.addEventListener('click', function () {
    openEditVariantModal(layout, variant);
  });
  deleteBtn.addEventListener('click', function () {
    if (window.ghvOpenDeleteModal) window.ghvOpenDeleteModal(layout.id, variant.name);
  });

  preview.appendChild(iframe);
  preview.appendChild(overlay);
  footer.appendChild(favBtn);
  footer.appendChild(editBtn);
  footer.appendChild(deleteBtn);
  body.appendChild(name);
  body.appendChild(footer);
  block.appendChild(preview);
  block.appendChild(body);
  return block;
}

function createVariantAddCard() {
  var card = document.createElement('button');
  card.type = 'button';
  card.className = 'variant-add-card';
  card.id = 'openNewVariantBtn';
  card.innerHTML = '<div><span class="variant-add-icon">' + iconSvg('plus') + '</span><strong>Adicionar Nova Variante</strong></div>';
  card.addEventListener('click', openNewVariantModal);
  return card;
}

function renderVariantBlocks() {
  var grid = document.getElementById('variantsGrid');
  var searchInput = document.getElementById('variantsSearchInput');
  var stats = document.getElementById('variantsStats');
  var layout = state.currentForVariant;
  var fragment = document.createDocumentFragment();
  var search = searchInput ? searchInput.value.toLowerCase() : '';
  var variants;
  var favCount = 0;

  if (!grid || !layout) return;
  variants = SenkoLib.getVariants(layout.id).filter(function (variant) {
    return !search || String(variant.name || '').toLowerCase().indexOf(search) !== -1;
  });

  variants.forEach(function (variant) {
    if (isVarFav(layout.id, variant.name)) favCount += 1;
    fragment.appendChild(createVariantBlock(variant, layout));
  });
  fragment.appendChild(createVariantAddCard());

  grid.textContent = '';
  grid.appendChild(fragment);
  if (stats) stats.textContent = variants.length + ' variante(s) · ' + favCount + ' favorito(s)';
  if (window.ghvInjectButtons) window.ghvInjectButtons();
}

function openVariantsModal(layout) {
  _buildVariantsModal();
  state.currentForVariant = layout;
  document.getElementById('variantsTitle').textContent = layout.name;
  document.getElementById('variantsHint').textContent = 'Arquivo: variants/' + layout.id + '.js';
  document.getElementById('variantsSearchInput').value = '';
  document.getElementById('variantsOverlay').classList.remove('hidden');
  setBodyLocked(true);
  renderVariantBlocks();
}

function closeVariantsModal() {
  var overlay = document.getElementById('variantsOverlay');
  if (overlay) overlay.classList.add('hidden');
  state.currentForVariant = null;
  setBodyLocked(false);
}
