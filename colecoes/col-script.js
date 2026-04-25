/* ============================================================================
   col-script.js - UI da aba Colecoes

   RESPONSABILIDADE:
     Injeta a barra de abas, cria o dashboard de colecoes, renderiza filtros,
     stats e cards sem depender do estado visual para a busca contextual.

   EXPOE (globais):
     colSwitchTab(tab), colRenderGrid(), colSetSearch(value)
     colMarkDirty(), colOpenCollection(col)

   DEPENDENCIAS:
     col-groups.js, col-core.js, utils.js, grid.js.

   ORDEM DE CARREGAMENTO:
     Depois dos dados de colecao e antes de col-modals.js.
============================================================================ */

var colState = {
  activeGroup: null,
  search: ''
};

var _colGridRendered = false;
var _colGridDirty = true;

function colMarkDirty() {
  _colGridDirty = true;
}

function colSetSearch(value) {
  colState.search = String(value || '').trim();
  colMarkDirty();
  colRenderGrid();
}

function colInjectTabBar() {
  var header = document.querySelector('.site-header');
  var bar;
  if (document.getElementById('colTabBar') || !header) return;
  bar = document.createElement('div');
  bar.id = 'colTabBar';
  bar.className = 'col-tab-bar';
  bar.innerHTML =
    '<button id="colTabBiblioteca" class="col-tab-btn active" type="button">Biblioteca</button>' +
    '<button id="colTabColecoes" class="col-tab-btn" type="button">Colecoes</button>';
  header.parentNode.insertBefore(bar, header.nextSibling);
  document.getElementById('colTabBiblioteca').addEventListener('click', function () {
    colSwitchTab('biblioteca');
  });
  document.getElementById('colTabColecoes').addEventListener('click', function () {
    colSwitchTab('colecoes');
  });
}

function colBuildDashboard() {
  var dashboard = document.getElementById('dashboard');
  var colDashboard;
  if (document.getElementById('colDashboard') || !dashboard) return;
  colDashboard = document.createElement('main');
  colDashboard.id = 'colDashboard';
  colDashboard.className = 'col-dashboard';
  colDashboard.style.display = 'none';
  colDashboard.innerHTML =
    '<div class="col-filter-bar" id="colFilterBar"></div>' +
    '<div class="col-stats-bar" id="colStatsBar"></div>' +
    '<div class="col-grid" id="colGrid"></div>' +
    '<div class="col-empty hidden" id="colEmpty">' +
      '<div><div class="col-empty-icon">' + iconSvg('folder') + '</div><strong>Nenhuma colecao encontrada.</strong><div class="col-empty-hint">Ajuste os filtros ou crie uma nova colecao pelo botao Adicionar.</div></div>' +
    '</div>';
  dashboard.parentNode.insertBefore(colDashboard, dashboard.nextSibling);
}

function colGroupsWithCollections() {
  var collections = ColLib.getAll();
  var used = {};
  collections.forEach(function (col) {
    used[col.group] = true;
  });
  return ColGroups.getAll().filter(function (group) {
    return used[group.slug];
  });
}

function colRenderFilterBar() {
  var bar = document.getElementById('colFilterBar');
  var groups = colGroupsWithCollections();
  var all = document.createElement('button');
  if (!bar) return;
  bar.textContent = '';
  all.type = 'button';
  all.className = 'col-pill' + (!colState.activeGroup ? ' active' : '');
  all.innerHTML = '<span class="col-pill-dot"></span><span>Todos</span>';
  all.addEventListener('click', function () {
    colState.activeGroup = null;
    colMarkDirty();
    colRenderGrid();
  });
  bar.appendChild(document.createElement('span')).className = 'col-filter-label';
  bar.querySelector('.col-filter-label').textContent = 'Grupo';
  bar.appendChild(all);

  groups.forEach(function (group) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'col-pill' + (colState.activeGroup === group.slug ? ' active' : '');
    btn.innerHTML = '<span class="col-pill-dot"></span><span>' + group.name + '</span>';
    btn.style.setProperty('--accent', group.cor);
    btn.addEventListener('click', function () {
      colState.activeGroup = group.slug;
      colMarkDirty();
      colRenderGrid();
    });
    bar.appendChild(btn);
  });
}

function colGetFilteredCollections() {
  var search = String(colState.search || '').toLowerCase();
  var collections = ColLib.getAll().filter(function (col) {
    var group = ColGroups.getBySlug(col.group);
    var haystack = (col.name + ' ' + (col.tags || []).join(' ') + ' ' + (group ? group.name : '')).toLowerCase();
    if (colState.activeGroup && col.group !== colState.activeGroup) return false;
    return !search || haystack.indexOf(search) !== -1;
  });
  collections.sort(function (a, b) {
    return naturalCompare(a.name, b.name);
  });
  return collections;
}

function colTag(text) {
  var span = document.createElement('span');
  span.className = 'tag';
  span.textContent = text;
  return span;
}

function colCreateCard(col) {
  var group = ColGroups.getBySlug(col.group) || { name: 'Sem grupo', cor: '#ff7a1a' };
  var card = document.createElement('article');
  var tags = document.createElement('div');
  var groupTag = document.createElement('span');
  var body = document.createElement('div');
  var title = document.createElement('h3');
  var meta = document.createElement('div');
  var actions = document.createElement('div');
  var editBtn = makeButton('btn btn-edit-icon', iconSvg('edit'), 'Editar colecao');
  var deleteAnchor = document.createElement('span');

  card.className = 'col-card';
  card.style.borderTopColor = group.cor;
  tags.className = 'col-card-tags';
  groupTag.className = 'col-card-group-pill';
  groupTag.textContent = group.name;
  groupTag.style.color = group.cor;
  groupTag.style.borderColor = group.cor;
  groupTag.style.background = group.cor + '20';
  body.className = 'col-card-body';
  title.className = 'col-card-name';
  title.textContent = col.name;
  meta.className = 'col-card-meta';
  meta.textContent = (col.layouts || []).length + ' layout(s)';
  actions.className = 'col-card-actions';
  deleteAnchor.className = 'col-delete-anchor';
  deleteAnchor.setAttribute('data-col-slug', col.slug);

  editBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    colOpenEditModal(col);
  });
  card.addEventListener('click', function () {
    colOpenCollection(col);
  });

  tags.appendChild(groupTag);
  (col.tags || []).forEach(function (tag) {
    tags.appendChild(colTag(tag));
  });
  body.appendChild(title);
  body.appendChild(meta);
  actions.appendChild(editBtn);
  actions.appendChild(deleteAnchor);
  card.appendChild(tags);
  card.appendChild(body);
  card.appendChild(actions);
  return card;
}

function colRenderGrid() {
  var grid = document.getElementById('colGrid');
  var stats = document.getElementById('colStatsBar');
  var empty = document.getElementById('colEmpty');
  var fragment = document.createDocumentFragment();
  var collections;
  if (!grid) return;
  if (_colGridRendered && !_colGridDirty) return;

  colRenderFilterBar();
  collections = colGetFilteredCollections();
  collections.forEach(function (col) {
    fragment.appendChild(colCreateCard(col));
  });

  grid.textContent = '';
  grid.appendChild(fragment);
  if (stats) stats.textContent = collections.length + ' de ' + ColLib.getAll().length + ' colecao(oes)';
  if (empty) empty.classList.toggle('hidden', collections.length !== 0);
  _colGridRendered = true;
  _colGridDirty = false;
  if (window.ghColInjectDeleteButtons) window.ghColInjectDeleteButtons();
}

function colSwitchTab(tab) {
  var dashboard = document.getElementById('dashboard');
  var colDashboard = document.getElementById('colDashboard');
  var search = document.getElementById('searchInput');
  var isCol = tab === 'colecoes';
  setActiveTab(isCol ? 'colecoes' : 'biblioteca');
  if (dashboard) dashboard.style.display = isCol ? 'none' : 'block';
  if (colDashboard) colDashboard.style.display = isCol ? 'block' : 'none';
  document.getElementById('colTabBiblioteca').classList.toggle('active', !isCol);
  document.getElementById('colTabColecoes').classList.toggle('active', isCol);
  if (search) search.placeholder = isCol ? 'Buscar colecoes...' : 'Buscar layouts...';
  if (isCol) colRenderGrid();
  else renderGrid();
}

function colOpenCollection(col) {
  if (window.colOpenCollectionModal) window.colOpenCollectionModal(col);
}

document.addEventListener('DOMContentLoaded', function () {
  colInjectTabBar();
  colBuildDashboard();
  colRenderFilterBar();
});
