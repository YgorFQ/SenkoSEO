/*
 * UI da aba Colecoes
 * Responsabilidade: inserir abas, dashboard, filtros e grid de colecoes.
 * Dependencias: ColGroups, ColLib e helpers globais da Biblioteca.
 * Expoe: colSwitchTab, colRenderGrid, colOpenCollection.
 */
var colState = { activeGroup: null, search: '' };

(function (global) {
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getGroup(slug) {
    return ColGroups.getBySlug(slug) || { slug: slug || '', name: slug || 'Sem grupo', cor: '#e36a00' };
  }

  function initTabs() {
    var header = document.querySelector('.site-header');
    var tabs;
    if ($('colTabBar') || !header) return;
    tabs = document.createElement('div');
    tabs.id = 'colTabBar';
    tabs.className = 'col-tab-bar';
    tabs.innerHTML =
      '<button id="colTabBiblioteca" class="col-tab-btn active" type="button">Biblioteca</button>' +
      '<button id="colTabColecoes" class="col-tab-btn" type="button">Coleções</button>';
    header.parentNode.insertBefore(tabs, header.nextSibling);
    $('colTabBiblioteca').addEventListener('click', function () { colSwitchTab('biblioteca'); });
    $('colTabColecoes').addEventListener('click', function () { colSwitchTab('colecoes'); });
  }

  function initDashboard() {
    var dashboard = $('dashboard');
    var colDashboard;
    if ($('colDashboard') || !dashboard) return;
    colDashboard = document.createElement('main');
    colDashboard.id = 'colDashboard';
    colDashboard.className = 'col-dashboard';
    colDashboard.style.display = 'none';
    colDashboard.innerHTML =
      '<div class="col-filter-bar" id="colFilterBar"></div>' +
      '<div class="col-stats-bar" id="colStatsBar"></div>' +
      '<div class="col-grid" id="colGrid"></div>';
    dashboard.parentNode.insertBefore(colDashboard, dashboard.nextSibling);
  }

  function colSwitchTab(tab) {
    var dashboard = $('dashboard');
    var colDashboard = $('colDashboard');
    var search = $('searchInput');
    var isCol = tab === 'colecoes';

    if (!dashboard || !colDashboard) return;
    dashboard.style.display = isCol ? 'none' : '';
    colDashboard.style.display = isCol ? '' : 'none';
    $('colTabBiblioteca').classList.toggle('active', !isCol);
    $('colTabColecoes').classList.toggle('active', isCol);

    if (search) {
      search.placeholder = isCol ? 'Buscar coleções...' : 'Buscar layouts...';
      if (isCol) {
        colState.search = search.value;
      } else {
        global.state.search = search.value;
        if (global.renderGrid) global.renderGrid();
      }
    }

    if (isCol) colRenderGrid();
  }

  function groupsWithCollections() {
    var collections = ColLib.getAll();
    var used = {};
    var out = [];
    var i;
    var group;
    for (i = 0; i < collections.length; i += 1) {
      if (collections[i].group) used[collections[i].group] = true;
    }
    for (i = 0; i < collections.length; i += 1) {
      group = getGroup(collections[i].group);
      if (used[group.slug]) {
        out.push(group);
        used[group.slug] = false;
      }
    }
    out.sort(function (a, b) {
      return global.naturalCompare ? global.naturalCompare(a.name, b.name) : a.name.localeCompare(b.name);
    });
    return out;
  }

  function colRenderFilterBar() {
    var bar = $('colFilterBar');
    var groups = groupsWithCollections();
    var html = '<span class="col-filter-label">Grupo</span>';
    var i;

    if (!bar) return;

    html += '<button class="col-pill' + (!colState.activeGroup ? ' active' : '') + '" type="button" data-col-group="" style="--col-pill-color: var(--accent)">' +
      '<span class="col-pill-dot"></span>Todos</button>';

    for (i = 0; i < groups.length; i += 1) {
      html += '<button class="col-pill' + (colState.activeGroup === groups[i].slug ? ' active' : '') + '" type="button" data-col-group="' + escapeHtml(groups[i].slug) + '" style="--col-pill-color: ' + escapeHtml(groups[i].cor) + '">' +
        '<span class="col-pill-dot"></span>' + escapeHtml(groups[i].name) + '</button>';
    }

    bar.innerHTML = html;
    bar.onclick = function (event) {
      var btn = event.target.closest('[data-col-group]');
      if (!btn) return;
      colState.activeGroup = btn.getAttribute('data-col-group') || null;
      colRenderGrid();
    };
  }

  function getFilteredCollections() {
    var all = ColLib.getAll();
    var term = String(colState.search || '').toLowerCase();
    var out = [];
    var i;
    var col;
    var group;
    var haystack;
    for (i = 0; i < all.length; i += 1) {
      col = all[i];
      group = getGroup(col.group);
      haystack = (col.name + ' ' + group.name + ' ' + (col.tags || []).join(' ')).toLowerCase();
      if (colState.activeGroup && col.group !== colState.activeGroup) continue;
      if (term && haystack.indexOf(term) < 0) continue;
      out.push(col);
    }
    out.sort(function (a, b) {
      return global.naturalCompare ? global.naturalCompare(a.name, b.name) : a.name.localeCompare(b.name);
    });
    return out;
  }

  function colRenderGrid() {
    var grid = $('colGrid');
    var stats = $('colStatsBar');
    var filtered = getFilteredCollections();
    var total = ColLib.getAll().length;
    var i;

    colRenderFilterBar();
    if (!grid) return;
    grid.innerHTML = '';
    if (stats) stats.textContent = filtered.length + ' de ' + total + ' coleções';

    if (!filtered.length) {
      grid.innerHTML = '<div class="col-empty"><svg class="col-empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M6 7l1-3h10l1 3M6 7v13h12V7"></path></svg><strong>Nenhuma coleção encontrada</strong><span class="col-empty-hint">Ajuste a busca ou grupo ativo.</span></div>';
      return;
    }

    for (i = 0; i < filtered.length; i += 1) {
      grid.appendChild(colCreateCard(filtered[i]));
    }

    if (global.ghcolInjectButtons) global.ghcolInjectButtons();
  }

  function colCreateCard(col) {
    var group = getGroup(col.group);
    var card = document.createElement('article');
    var tags = col.tags || [];
    var html = '';
    var i;

    html += '<span class="tag col-card-group-pill">' + escapeHtml(group.name) + '</span>';
    for (i = 0; i < tags.length; i += 1) {
      html += '<span class="tag">' + escapeHtml(tags[i]) + '</span>';
    }

    card.className = 'col-card';
    card.style.setProperty('--col-color', group.cor);
    card.innerHTML =
      '<div class="col-card-tags">' + html + '</div>' +
      '<div class="col-card-body">' +
        '<h3 class="col-card-name">' + escapeHtml(col.name) + '</h3>' +
        '<div class="col-card-meta">' + (col.layouts ? col.layouts.length : 0) + ' layouts</div>' +
      '</div>' +
      '<div class="col-card-actions">' +
        '<button class="btn btn-ghost col-edit-card-btn" type="button">Editar</button>' +
        '<span class="col-delete-anchor" data-col-slug="' + escapeHtml(col.slug) + '"></span>' +
      '</div>';

    card.addEventListener('click', function () {
      colOpenCollection(col);
    });
    card.querySelector('.col-edit-card-btn').addEventListener('click', function (event) {
      event.stopPropagation();
      if (global.colOpenEditModal) global.colOpenEditModal(col);
    });
    card.querySelector('.col-delete-anchor').addEventListener('click', function (event) {
      event.stopPropagation();
    });

    return card;
  }

  function colOpenCollection(col) {
    if (global.colOpenCollectionModal) global.colOpenCollectionModal(col);
  }

  function bindSearch() {
    var search = $('searchInput');
    if (!search) return;
    search.addEventListener('input', function () {
      var colDashboard = $('colDashboard');
      if (!colDashboard || colDashboard.style.display === 'none') return;
      colState.search = search.value;
      colRenderGrid();
    });
  }

  function init() {
    initTabs();
    initDashboard();
    bindSearch();
  }

  global.colSwitchTab = colSwitchTab;
  global.colRenderGrid = colRenderGrid;
  global.colCreateCard = colCreateCard;
  global.colOpenCollection = colOpenCollection;

  document.addEventListener('DOMContentLoaded', init);
}(window));
