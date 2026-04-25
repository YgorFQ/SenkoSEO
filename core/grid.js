/* ═══════════════════════════════════════════════════════════════════════
   grid.js — Renderização do grid de layouts e criação de cards

   RESPONSABILIDADE:
     Filtra layouts por busca e favoritos, ordena (favoritos primeiro,
     depois alfanumérica natural), renderiza o grid usando DocumentFragment
     para minimizar reflows. Cada card tem preview lazy-loaded, tags,
     botões de ação.

   EXPÕE (globais):
     getFilteredLayouts() → Array<Layout>
     renderGrid()         → void
     updateStatsBar(n)    → void
     createCard(layout, index) → HTMLElement

   DEPENDÊNCIAS:
     senkolib-core.js, utils.js, favorites.js

   ORDEM DE CARREGAMENTO:
     Após favorites.js, antes de modal-*.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Filtro e ordenação ─────────────────────────────────────────────── */

// Filtra por busca (nome + tags), ordena favoritos primeiro, depois natural
function getFilteredLayouts() {
  var all    = SenkoLib.getAll();
  var search = (state.search || '').toLowerCase();
  var favs   = getFavs();

  var filtered = search
    ? all.filter(function (l) {
        var inName = l.name.toLowerCase().indexOf(search) !== -1;
        var inId   = l.id.toLowerCase().indexOf(search) !== -1;
        var inTags = (l.tags || []).some(function (t) {
          return t.toLowerCase().indexOf(search) !== -1;
        });
        return inName || inId || inTags;
      })
    : all;

  filtered.sort(function (a, b) {
    var fa = favs.indexOf(a.id) !== -1;
    var fb = favs.indexOf(b.id) !== -1;
    if (fa && !fb) return -1;
    if (!fa && fb) return  1;
    return naturalCompare(a.id, b.id);
  });

  return filtered;
}

/* ── Stats bar ──────────────────────────────────────────────────────── */

// Atualiza contadores "X de Y layouts · Z favorito(s)"
function updateStatsBar(count) {
  var bar = document.getElementById('statsBar');
  if (!bar) return;
  var total = SenkoLib.getAll().length;
  var favCount = getFavs().filter(function (id) {
    return SenkoLib.getAll().some(function (l) { return l.id === id; });
  }).length;
  bar.textContent = count + ' de ' + total + ' layouts' +
    (favCount ? ' · ' + favCount + ' favorito' + (favCount > 1 ? 's' : '') : '');
}

/* ── Renderização do grid ───────────────────────────────────────────── */

// Limpa e re-renderiza #layoutGrid usando DocumentFragment (um único reflow)
function renderGrid() {
  var grid = document.getElementById('layoutGrid');
  if (!grid) return;

  var filtered = getFilteredLayouts();
  var fragment = document.createDocumentFragment();

  if (filtered.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'no-results';
    empty.innerHTML = '<p>Nenhum layout encontrado para "<strong>' +
      (state.search || '') + '</strong>".</p>';
    grid.innerHTML = '';
    grid.appendChild(empty);
    updateStatsBar(0);
    return;
  }

  filtered.forEach(function (layout, i) {
    fragment.appendChild(createCard(layout, i));
  });

  grid.innerHTML = '';
  grid.appendChild(fragment);
  updateStatsBar(filtered.length);
}

/* ── Criação de card ────────────────────────────────────────────────── */

// Cria e retorna o elemento de card completo para um layout
function createCard(layout, index) {
  var card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = (index * 40) + 'ms';

  var variants  = SenkoLib.getVariants(layout.id);
  var varCount  = variants.length;
  var fav       = isFav(layout.id);
  var tagsHtml  = (layout.tags || []).slice().sort().map(function (t) {
    return '<span class="tag">' + t + '</span>';
  }).join('');

  card.innerHTML =
    '<div class="card-preview">' +
      '<iframe class="card-iframe" frameborder="0" scrolling="no" tabindex="-1"></iframe>' +
      '<div class="card-preview-overlay"></div>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="card-name">' + layout.name + '</div>' +
      '<div class="card-tags">' + tagsHtml + '</div>' +
    '</div>' +
    '<div class="card-actions">' +
      '<button class="btn btn-ghost" data-copy="html" title="Copiar HTML">HTML</button>' +
      '<button class="btn btn-ghost" data-copy="css" title="Copiar CSS">CSS</button>' +
      '<button class="btn btn-fav' + (fav ? ' active' : '') + '" title="Favoritar">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (fav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
      '</button>' +
      '<button class="btn btn-edit-icon" title="Editar layout">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '</button>' +
      '<button class="btn btn-variants" title="Variantes">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        (varCount > 0 ? '<span class="variant-badge">' + varCount + '</span>' : '') +
      '</button>' +
    '</div>';

  // Lazy load do preview
  var iframe = card.querySelector('.card-iframe');
  lazyIframe(iframe, layout.html || '', layout.css || '');

  // Clicar no card inteiro abre modal de edição
  var overlay = card.querySelector('.card-preview-overlay');
  overlay.addEventListener('click', function (e) {
    e.stopPropagation();
    openEditModal(layout);
  });
  card.querySelector('.card-body').addEventListener('click', function () {
    openEditModal(layout);
  });

  // Copiar HTML
  card.querySelector('[data-copy="html"]').addEventListener('click', function (e) {
    e.stopPropagation();
    copyToClipboard(layout.html || '', e.target, 'HTML');
  });

  // Copiar CSS
  card.querySelector('[data-copy="css"]').addEventListener('click', function (e) {
    e.stopPropagation();
    copyToClipboard(layout.css || '', e.target, 'CSS');
  });

  // Favoritar
  var btnFav = card.querySelector('.btn-fav');
  btnFav.addEventListener('click', function (e) {
    e.stopPropagation();
    var active = toggleFav(layout.id);
    btnFav.classList.toggle('active', active);
    var starSvg = btnFav.querySelector('svg');
    if (starSvg) starSvg.setAttribute('fill', active ? 'currentColor' : 'none');
    updateStatsBar(getFilteredLayouts().length);
  });

  // Editar
  card.querySelector('.btn-edit-icon').addEventListener('click', function (e) {
    e.stopPropagation();
    openEditModal(layout);
  });

  // Variantes
  card.querySelector('.btn-variants').addEventListener('click', function (e) {
    e.stopPropagation();
    openVariantsModal(layout);
  });

  return card;
}
