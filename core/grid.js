/* ============================================================================
   grid.js - Grid principal de layouts

   RESPONSABILIDADE:
     Filtra, ordena e renderiza os cards da biblioteca com previews lazy,
     acoes de copia, favoritos, edicao e variantes.

   EXPOE (globais):
     getFilteredLayouts() -> layouts filtrados e ordenados
     renderGrid() -> redesenha o grid
     updateStatsBar(count) -> atualiza contador
     createCard(layout, index) -> cria card DOM

   DEPENDENCIAS:
     senkolib-core.js, utils.js, favorites.js.

   ORDEM DE CARREGAMENTO:
     Depois de favorites.js e antes dos modais/bootstrap.
============================================================================ */

function getFilteredLayouts() {
  var search = String(state.search || '').toLowerCase();
  var layouts = SenkoLib.getAll().filter(function (layout) {
    var haystack = (layout.name + ' ' + (layout.tags || []).join(' ')).toLowerCase();
    return !search || haystack.indexOf(search) !== -1;
  });

  layouts.sort(function (a, b) {
    var af = isFav(a.id) ? 1 : 0;
    var bf = isFav(b.id) ? 1 : 0;
    if (af !== bf) return bf - af;
    return naturalCompare(a.id || a.name, b.id || b.name);
  });

  return layouts;
}

function updateStatsBar(count) {
  var total = SenkoLib.getAll().length;
  var favCount = getFavs().length;
  var bar = document.getElementById('statsBar');
  if (!bar) return;
  bar.innerHTML = '<strong>' + count + '</strong><span>de</span><strong>' + total + '</strong><span>layouts</span>' +
    (favCount ? '<span>· ' + favCount + ' favorito(s)</span>' : '');
}

function makeButton(className, html, title) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.innerHTML = html;
  if (title) btn.title = title;
  return btn;
}

function makeTag(text) {
  var span = document.createElement('span');
  span.className = 'tag';
  span.textContent = text;
  return span;
}

function createPreview(layout) {
  var preview = document.createElement('div');
  var iframe = document.createElement('iframe');
  var overlay = document.createElement('button');

  preview.className = 'card-preview';
  iframe.className = 'card-iframe';
  iframe.setAttribute('title', 'Preview de ' + layout.name);
  iframe.addEventListener('load', function () {
    scaleCardIframe(iframe);
  });

  overlay.type = 'button';
  overlay.className = 'card-preview-overlay';
  overlay.setAttribute('aria-label', 'Editar ' + layout.name);
  overlay.addEventListener('click', function () {
    openEditModal(layout);
  });

  preview.appendChild(iframe);
  preview.appendChild(overlay);
  lazyIframe(iframe, layout.html, layout.css);
  return preview;
}

function createCard(layout, index) {
  var card = document.createElement('article');
  var body = document.createElement('div');
  var name = document.createElement('h3');
  var tags = document.createElement('div');
  var actions = document.createElement('div');
  var htmlBtn = makeButton('btn btn-ghost', iconSvg('copy') + '<span>HTML</span>', 'Copiar HTML');
  var cssBtn = makeButton('btn btn-ghost', iconSvg('copy') + '<span>CSS</span>', 'Copiar CSS');
  var favBtn = makeButton('btn btn-fav', iconSvg('star'), 'Favoritar');
  var editBtn = makeButton('btn btn-edit-icon', iconSvg('edit'), 'Editar');
  var varBtn = makeButton('btn btn-variants', iconSvg('plus'), 'Variantes');
  var variantCount = SenkoLib.getVariants(layout.id).length;

  card.className = 'card';
  card.style.animationDelay = (index * 40) + 'ms';

  body.className = 'card-body';
  name.className = 'card-name';
  name.textContent = layout.name;
  tags.className = 'card-tags';

  (layout.tags || []).slice().sort(naturalCompare).forEach(function (tag) {
    tags.appendChild(makeTag(tag));
  });

  if (isFav(layout.id)) favBtn.classList.add('active');
  if (variantCount) {
    var badge = document.createElement('span');
    badge.className = 'variant-badge';
    badge.textContent = variantCount;
    varBtn.appendChild(badge);
  }

  htmlBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    copyToClipboard(layout.html, htmlBtn, 'HTML copiado!');
  });

  cssBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    copyToClipboard(layout.css, cssBtn, 'CSS copiado!');
  });

  favBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    toggleFav(layout.id);
    renderGrid();
  });

  editBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    openEditModal(layout);
  });

  varBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    openVariantsModal(layout);
  });

  card.addEventListener('click', function () {
    openEditModal(layout);
  });

  body.appendChild(name);
  body.appendChild(tags);
  actions.className = 'card-actions';
  actions.appendChild(htmlBtn);
  actions.appendChild(cssBtn);
  actions.appendChild(favBtn);
  actions.appendChild(editBtn);
  actions.appendChild(varBtn);

  card.appendChild(createPreview(layout));
  card.appendChild(body);
  card.appendChild(actions);
  return card;
}

function renderGrid() {
  var grid = document.getElementById('layoutGrid');
  var noResults = document.getElementById('noResults');
  var fragment = document.createDocumentFragment();
  var filtered = getFilteredLayouts();

  if (!grid) return;
  filtered.forEach(function (layout, index) {
    fragment.appendChild(createCard(layout, index));
  });

  grid.textContent = '';
  grid.appendChild(fragment);
  updateStatsBar(filtered.length);

  if (noResults) {
    noResults.classList.toggle('hidden', filtered.length !== 0);
  }
}
