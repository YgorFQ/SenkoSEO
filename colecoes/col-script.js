/* ═══════════════════════════════════════════════════════════════════════
   col-script.js — UI da aba Coleções

   RESPONSABILIDADE:
     Injeta a barra de abas no DOM, cria o #colDashboard dinâmico,
     gerencia troca entre abas (Biblioteca ↔ Coleções) e renderiza
     o grid de cards de coleção com filtros por grupo. Usa
     getActiveTab() para busca contextual sem checar display do DOM.

   EXPÕE (globais):
     colSwitchTab(tab)        → void
     colRenderGrid()          → void
     colRenderFilterBar()     → void
     colOpenCollection(col)   → void  (abre modal de visualização)

   DEPENDÊNCIAS:
     utils.js, col-groups.js, col-core.js, col-modals.js

   ORDEM DE CARREGAMENTO:
     Após col-core.js, antes de col-modals.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Estado ─────────────────────────────────────────────────────────── */
var colState = { activeGroup: null, search: '' };

// Flag de performance: só re-renderiza se houver mutação de dados
var _colGridDirty   = true;
var _colGridRendered = false;

/* ── Init: injetar barra de abas e #colDashboard ────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  _injectTabBar();
  _createColDashboard();
  _hookSearchInput();
});

/* ── Barra de abas ──────────────────────────────────────────────────── */

function _injectTabBar() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var bar = document.createElement('div');
  bar.className = 'tab-bar';
  bar.innerHTML =
    '<button class="tab-btn active" data-tab="biblioteca">Biblioteca</button>' +
    '<button class="tab-btn"        data-tab="colecoes">Coleções</button>';

  header.insertAdjacentElement('afterend', bar);

  bar.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      colSwitchTab(btn.dataset.tab);
    });
  });
}

/* ── Criar #colDashboard ────────────────────────────────────────────── */

function _createColDashboard() {
  if (document.getElementById('colDashboard')) return;

  var dash = document.createElement('div');
  dash.id        = 'colDashboard';
  dash.className = 'col-dashboard';
  dash.style.display = 'none';

  dash.innerHTML =
    '<div class="col-filter-bar" id="colFilterBar"></div>' +
    '<div class="col-stats-bar"  id="colStatsBar"></div>' +
    '<div class="col-grid"       id="colGrid"></div>';

  var libDash = document.getElementById('dashboard');
  if (libDash) libDash.insertAdjacentElement('afterend', dash);
  else         document.body.appendChild(dash);
}

/* ── Troca de aba ───────────────────────────────────────────────────── */

// Gerencia transição Biblioteca ↔ Coleções sem destruir o DOM
function colSwitchTab(tab) {
  setActiveTab(tab);

  var libDash = document.getElementById('dashboard');
  var colDash = document.getElementById('colDashboard');
  var searchInput = document.getElementById('searchInput');

  if (tab === 'biblioteca') {
    if (libDash) libDash.style.display = '';
    if (colDash) colDash.style.display = 'none';
    if (searchInput) searchInput.placeholder = 'Buscar layouts…';
  } else {
    if (libDash) libDash.style.display = 'none';
    if (colDash) colDash.style.display = '';
    if (searchInput) searchInput.placeholder = 'Buscar coleções…';
    // Renderiza grid apenas na primeira abertura ou quando há mutação
    if (!_colGridRendered || _colGridDirty) {
      colRenderFilterBar();
      colRenderGrid();
      _colGridRendered = true;
      _colGridDirty    = false;
    }
  }

  // Atualizar visual das tabs
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

/* ── Filter bar de grupos ───────────────────────────────────────────── */

function colRenderFilterBar() {
  var bar = document.getElementById('colFilterBar');
  if (!bar) return;

  // Quais grupos têm pelo menos uma coleção
  var allCols   = ColLib.getAll();
  var usedSlugs = {};
  allCols.forEach(function (c) { if (c.group) usedSlugs[c.group] = true; });

  var allGroups = ColGroups.getAll().filter(function (g) {
    return usedSlugs[g.slug];
  });

  var fragment = document.createDocumentFragment();

  // Pill "Todos"
  var todos = document.createElement('button');
  todos.className = 'col-pill' + (colState.activeGroup === null ? ' active' : '');
  todos.style.background = colState.activeGroup === null ? 'var(--accent)' : '';
  todos.textContent = 'Todos';
  todos.addEventListener('click', function () {
    colState.activeGroup = null;
    colRenderFilterBar();
    colRenderGrid();
  });
  fragment.appendChild(todos);

  // Pills por grupo
  allGroups.forEach(function (g) {
    var pill = document.createElement('button');
    pill.className = 'col-pill' + (colState.activeGroup === g.slug ? ' active' : '');
    if (colState.activeGroup === g.slug) pill.style.background = g.cor;
    pill.innerHTML =
      '<span class="col-pill-dot" style="background:' + g.cor + '"></span>' + g.name;
    pill.addEventListener('click', function () {
      colState.activeGroup = g.slug;
      colRenderFilterBar();
      colRenderGrid();
    });
    fragment.appendChild(pill);
  });

  bar.innerHTML = '';
  bar.appendChild(fragment);
}

/* ── Grid de cards ──────────────────────────────────────────────────── */

// Renderiza todos os cards de coleção filtrados por grupo e busca
function colRenderGrid() {
  var grid = document.getElementById('colGrid');
  if (!grid) return;

  var all = ColLib.getAll();

  // Filtro de grupo
  var filtered = colState.activeGroup
    ? all.filter(function (c) { return c.group === colState.activeGroup; })
    : all;

  // Filtro de busca
  var q = (colState.search || '').toLowerCase();
  if (q) {
    filtered = filtered.filter(function (c) {
      return c.name.toLowerCase().indexOf(q) !== -1 ||
        (c.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
    });
  }

  // Stats
  var statsBar = document.getElementById('colStatsBar');
  if (statsBar) {
    statsBar.textContent = filtered.length + ' de ' + all.length + ' coleção' +
      (all.length !== 1 ? 'ões' : '');
  }

  var fragment = document.createDocumentFragment();

  if (filtered.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'col-empty';
    empty.innerHTML =
      '<div class="col-empty-icon">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' +
      '</div>' +
      '<p class="col-empty-hint">Nenhuma coleção encontrada.</p>';
    grid.innerHTML = '';
    grid.appendChild(empty);
    return;
  }

  filtered.forEach(function (col, i) {
    fragment.appendChild(_colCreateCard(col, i));
  });

  grid.innerHTML = '';
  grid.appendChild(fragment);
}

/* ── Card de coleção ────────────────────────────────────────────────── */

function _colCreateCard(col, index) {
  var grupo = ColGroups.getBySlug(col.group) || {};
  var cor   = grupo.cor || 'var(--accent)';
  var nLayouts = (col.layouts || []).length;

  var card = document.createElement('div');
  card.className = 'col-card';
  card.style.animationDelay = (index * 40) + 'ms';
  card.style.borderTopColor = cor;

  var groupPill = '<span class="col-card-group-pill" style="background:' + cor + '">' +
    (grupo.name || col.group) + '</span>';

  var tagsHtml = (col.tags || []).map(function (t) {
    return '<span class="tag">' + t + '</span>';
  }).join('');

  card.innerHTML =
    '<div class="col-card-tags">' + groupPill + tagsHtml + '</div>' +
    '<div class="col-card-body">' +
      '<div class="col-card-name">' + col.name + '</div>' +
      '<div class="col-card-meta">' + nLayouts + ' layout' + (nLayouts !== 1 ? 's' : '') + '</div>' +
    '</div>' +
    '<div class="col-card-actions">' +
      '<button class="btn btn-ghost btn-edit-icon" title="Editar coleção">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '</button>' +
      '<span class="col-delete-anchor" data-col-slug="' + col.slug + '"></span>' +
    '</div>';

  // Clique no card abre modal de visualização
  card.querySelector('.col-card-body').addEventListener('click', function () {
    colOpenCollection(col);
  });
  card.querySelector('.col-card-tags').addEventListener('click', function () {
    colOpenCollection(col);
  });

  // Botão editar metadados
  card.querySelector('.btn-edit-icon').addEventListener('click', function (e) {
    e.stopPropagation();
    if (typeof colOpenEditModal === 'function') colOpenEditModal(col);
  });

  return card;
}

/* ── Abrir coleção ──────────────────────────────────────────────────── */

function colOpenCollection(col) {
  if (typeof colOpenCollectionModal === 'function') colOpenCollectionModal(col);
}

/* ── Hook na busca global ───────────────────────────────────────────── */

function _hookSearchInput() {
  var input = document.getElementById('searchInput');
  if (!input) return;
  var _t;
  input.addEventListener('input', function () {
    if (getActiveTab() !== 'colecoes') return;
    clearTimeout(_t);
    var q = this.value.trim();
    _t = setTimeout(function () {
      colState.search = q;
      colRenderGrid();
    }, 150);
  });
}

/* ── Marcar grid como sujo (chamar após criar/editar/excluir coleção) ── */
function colMarkGridDirty() { _colGridDirty = true; }
