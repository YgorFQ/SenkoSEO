/*
 * UI da Biblioteca
 * Responsabilidade: renderizar layouts, modais, favoritos, busca, tema e variantes.
 * Dependencias: core/senkolib-core.js e dados de layouts/variantes ja carregados.
 * Expoe: helpers globais usados pelos modulos GitHub e pelo sistema de Colecoes.
 */
var state = {
  search: '',
  currentEdit: null,
  currentForVariant: null,
  currentEditVariant: null
};

(function (global) {
  var _lazyObserver = null;
  var _overlayClicks = {};
  var _toastTimer = null;

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

  function escapeTemplate(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
  }

  function parseTags(value) {
    var raw = String(value || '').split(',');
    var tags = [];
    var i;
    var tag;
    for (i = 0; i < raw.length; i += 1) {
      tag = raw[i].trim();
      if (tag) tags.push(tag);
    }
    return tags;
  }

  function formatTags(tags) {
    var list = tags || [];
    var out = [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      out.push("'" + String(list[i]).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'");
    }
    return '[' + out.join(', ') + ']';
  }

  function formatLayoutBlock(layout) {
    return "  /*@@@@Senko - " + layout.id + " */\n" +
      "  {\n" +
      "    id: '" + layout.id + "',\n" +
      "    name: '" + String(layout.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',\n" +
      "    tags: " + formatTags(layout.tags) + ",\n" +
      "    html: `" + escapeTemplate(layout.html) + "`,\n" +
      "    css: `" + escapeTemplate(layout.css) + "`\n" +
      "  }";
  }

  function formatVariantBlock(variant) {
    return "  /*@@@@Senko - " + variant.name + " */\n" +
      "  {\n" +
      "    name: '" + String(variant.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "',\n" +
      "    html: `" + escapeTemplate(variant.html) + "`,\n" +
      "    css: `" + escapeTemplate(variant.css) + "`\n" +
      "  }";
  }

  function buildSrcDoc(html, css) {
    return '<!doctype html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<style>html,body{margin:0;min-height:100%;}body{overflow:hidden;}' + (css || '') + '</style>' +
      '</head><body>' + (html || '') + '</body></html>';
  }

  function showToast(message) {
    var toast = $('toast');
    if (!toast) return;
    toast.textContent = message || '✓ Copiado!';
    toast.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  function copyToClipboard(text, btn, label) {
    function done() {
      var old = btn ? btn.textContent : '';
      showToast(label || '✓ Copiado!');
      if (btn) {
        btn.textContent = '✓ Copiado!';
        setTimeout(function () {
          btn.textContent = old;
        }, 1600);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text || '').then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, callback) {
    var input = document.createElement('textarea');
    input.value = text || '';
    input.setAttribute('readonly', 'readonly');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(input);
    if (callback) callback();
  }

  function naturalCompare(a, b) {
    var ax = String(a || '').toLowerCase().match(/\d+|\D+/g) || [];
    var bx = String(b || '').toLowerCase().match(/\d+|\D+/g) || [];
    var len = Math.max(ax.length, bx.length);
    var i;
    var na;
    var nb;

    for (i = 0; i < len; i += 1) {
      if (typeof ax[i] === 'undefined') return -1;
      if (typeof bx[i] === 'undefined') return 1;
      na = parseInt(ax[i], 10);
      nb = parseInt(bx[i], 10);
      if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
      if (ax[i] !== bx[i]) return ax[i] > bx[i] ? 1 : -1;
    }
    return 0;
  }

  function scaleCardIframe(iframe) {
    var parent;
    var width;
    var height;
    var scale;
    if (!iframe || !iframe.parentNode) return;
    parent = iframe.parentNode;
    width = parent.clientWidth || 320;
    height = parent.clientHeight || 180;
    scale = width / 1280;
    iframe.style.width = '1280px';
    iframe.style.height = Math.ceil(height / scale) + 'px';
    iframe.style.transform = 'scale(' + scale + ')';
  }

  function loadIframe(iframe) {
    if (!iframe || iframe._senkoLoaded) return;
    iframe._senkoLoaded = true;
    iframe.srcdoc = buildSrcDoc(iframe._senkoHtml, iframe._senkoCss);
    iframe.onload = function () {
      scaleCardIframe(iframe);
    };
    setTimeout(function () {
      scaleCardIframe(iframe);
    }, 80);
  }

  function lazyIframe(iframe, html, css) {
    iframe._senkoHtml = html || '';
    iframe._senkoCss = css || '';

    if (!('IntersectionObserver' in window)) {
      loadIframe(iframe);
      return;
    }

    if (!_lazyObserver) {
      _lazyObserver = new IntersectionObserver(function (entries) {
        var i;
        for (i = 0; i < entries.length; i += 1) {
          if (entries[i].isIntersecting) {
            loadIframe(entries[i].target);
            _lazyObserver.unobserve(entries[i].target);
          }
        }
      }, { rootMargin: '200px' });
    }

    _lazyObserver.observe(iframe);
  }

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (err) {
      return fallback;
    }
  }

  function getFavs() {
    return readJSON('senkolib_favs', []);
  }

  function saveFavs(favs) {
    localStorage.setItem('senkolib_favs', JSON.stringify(favs || []));
  }

  function isFav(id) {
    return getFavs().indexOf(id) >= 0;
  }

  function toggleFav(id) {
    var favs = getFavs();
    var index = favs.indexOf(id);
    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(id);
    }
    saveFavs(favs);
    renderGrid();
  }

  function getVarFavs() {
    return readJSON('senkolib_var_favs', {});
  }

  function saveVarFavs(favs) {
    localStorage.setItem('senkolib_var_favs', JSON.stringify(favs || {}));
  }

  function isVarFav(layoutId, variantName) {
    var all = getVarFavs();
    return all[layoutId] && all[layoutId].indexOf(variantName) >= 0;
  }

  function toggleVarFav(layoutId, variantName) {
    var all = getVarFavs();
    var list = all[layoutId] || [];
    var index = list.indexOf(variantName);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(variantName);
    }
    all[layoutId] = list;
    saveVarFavs(all);
    renderVariantsGrid();
  }

  function getFilteredLayouts() {
    var all = SenkoLib.getAll();
    var term = state.search.toLowerCase();
    var favs = getFavs();
    var filtered = [];
    var i;
    var layout;
    var haystack;

    for (i = 0; i < all.length; i += 1) {
      layout = all[i];
      haystack = (layout.name + ' ' + (layout.tags || []).join(' ')).toLowerCase();
      if (!term || haystack.indexOf(term) >= 0) filtered.push(layout);
    }

    filtered.sort(function (a, b) {
      var af = favs.indexOf(a.id) >= 0;
      var bf = favs.indexOf(b.id) >= 0;
      if (af !== bf) return af ? -1 : 1;
      return naturalCompare(a.id || a.name, b.id || b.name);
    });

    return filtered;
  }

  function updateStatsBar(count) {
    var stats = $('statsBar');
    var total = SenkoLib.getAll().length;
    var favs = getFavs().length;
    if (stats) stats.textContent = count + ' de ' + total + ' layouts · ' + favs + ' favorito(s)';
  }

  function renderGrid() {
    var grid = $('layoutGrid');
    var noResults = $('noResults');
    var layouts = getFilteredLayouts();
    var i;

    if (!grid) return;
    grid.innerHTML = '';
    updateStatsBar(layouts.length);

    if (noResults) noResults.classList.toggle('hidden', layouts.length !== 0);

    for (i = 0; i < layouts.length; i += 1) {
      grid.appendChild(createCard(layouts[i], i));
    }

    if (global.ghInjectLayoutDeleteButton) global.ghInjectLayoutDeleteButton();
  }

  function createIcon(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>';
  }

  function createCard(layout) {
    var card = document.createElement('article');
    var tags = (layout.tags || []).slice(0).sort();
    var tagHtml = '';
    var variants = SenkoLib.getVariants(layout.id);
    var i;
    var iframe;

    for (i = 0; i < tags.length; i += 1) {
      tagHtml += '<span class="tag">' + escapeHtml(tags[i]) + '</span>';
    }

    card.className = 'card';
    card.setAttribute('tabindex', '0');
    card.innerHTML =
      '<div class="card-preview">' +
        '<iframe class="card-iframe" title="Preview de ' + escapeHtml(layout.name) + '"></iframe>' +
        '<div class="card-preview-overlay" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-name">' + escapeHtml(layout.name) + '</h3>' +
        '<div class="card-tags">' + tagHtml + '</div>' +
      '</div>' +
      '<div class="card-actions">' +
        '<button class="btn btn-ghost btn-fav' + (isFav(layout.id) ? ' active' : '') + '" type="button" title="Favorito">★</button>' +
        '<button class="btn btn-ghost btn-edit-icon" type="button" title="Editar">' + createIcon('<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>') + '</button>' +
        '<button class="btn btn-ghost btn-variants" type="button" title="Variantes">+ <span class="variant-badge">' + variants.length + '</span></button>' +
      '</div>';

    iframe = card.querySelector('iframe');
    lazyIframe(iframe, layout.html, layout.css);

    card.addEventListener('click', function () {
      openEditModal(layout);
    });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') openEditModal(layout);
    });
    card.querySelector('.btn-fav').addEventListener('click', function (event) {
      event.stopPropagation();
      toggleFav(layout.id);
    });
    card.querySelector('.btn-edit-icon').addEventListener('click', function (event) {
      event.stopPropagation();
      openEditModal(layout);
    });
    card.querySelector('.btn-variants').addEventListener('click', function (event) {
      event.stopPropagation();
      openVariantsModal(layout);
    });

    return card;
  }

  function anyOverlayOpen() {
    return !!document.querySelector('.modal-overlay:not(.hidden)');
  }

  function showOverlay(id) {
    var overlay = $(id);
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideOverlay(id) {
    var overlay = $(id);
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (!anyOverlayOpen()) document.body.style.overflow = '';
  }

  function overlayClick(id, closeFn) {
    var overlay = $(id);
    if (!overlay) return;
    overlay.addEventListener('click', function (event) {
      var now;
      if (event.target !== overlay) return;
      now = Date.now();
      if (_overlayClicks[id] && now - _overlayClicks[id] < 400) {
        closeFn();
        _overlayClicks[id] = 0;
        return;
      }
      _overlayClicks[id] = now;
    });
  }

  function switchPanel(btnAttr, panelAttr, mode, previewFn) {
    var buttons = document.querySelectorAll('[' + btnAttr + ']');
    var panels = document.querySelectorAll('[' + panelAttr + ']');
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      if (buttons[i].getAttribute(btnAttr) === mode) buttons[i].classList.add('active');
      else buttons[i].classList.remove('active');
    }
    for (i = 0; i < panels.length; i += 1) {
      if (panels[i].getAttribute(panelAttr) === mode) panels[i].classList.add('active');
      else panels[i].classList.remove('active');
    }
    if ((mode === 'preview' || mode === 'visualizar') && previewFn) previewFn();
  }

  function getCurrentEditLayoutData() {
    return {
      id: $('editId') ? $('editId').value.trim() : '',
      name: $('editName') ? $('editName').value.trim() : '',
      tags: parseTags($('editTags') ? $('editTags').value : ''),
      html: $('editHtml') ? $('editHtml').value : '',
      css: $('editCss') ? $('editCss').value : ''
    };
  }

  function updateEditGeneratedCode() {
    var out = $('editGeneratedCode');
    if (out) out.textContent = formatLayoutBlock(getCurrentEditLayoutData());
  }

  function refreshEditPreview() {
    var frame = $('editPreviewFrame');
    var data = getCurrentEditLayoutData();
    if (!frame) return;
    frame.srcdoc = '';
    setTimeout(function () {
      frame.srcdoc = buildSrcDoc(data.html, data.css);
    }, 50);
  }

  function switchEditMode(mode) {
    switchPanel('data-edit-mode', 'data-edit-panel', mode, refreshEditPreview);
  }

  function openEditModal(layout) {
    state.currentEdit = layout;
    $('editId').value = layout.id || '';
    $('editName').value = layout.name || '';
    $('editTags').value = (layout.tags || []).join(', ');
    $('editHtml').value = layout.html || '';
    $('editCss').value = layout.css || '';
    updateEditGeneratedCode();
    showOverlay('editModalOverlay');
    setTimeout(function () {
      switchEditMode('preview');
    }, 10);
  }

  function closeEditModal() {
    hideOverlay('editModalOverlay');
    state.currentEdit = null;
  }

  function validLayoutId(value) {
    return /^[a-z0-9-]{3,}$/.test(value || '');
  }

  function getAddLayoutFormData() {
    var data = {
      id: $('addId') ? $('addId').value.trim() : '',
      name: $('addName') ? $('addName').value.trim() : '',
      tags: parseTags($('addTags') ? $('addTags').value : ''),
      html: $('addHtml') ? $('addHtml').value : '',
      css: $('addCss') ? $('addCss').value : ''
    };
    if (!validLayoutId(data.id) || !data.name) {
      showToast('Revise ID e nome.');
      return null;
    }
    return data;
  }

  function getAddLayoutDraft() {
    return {
      id: $('addId') ? $('addId').value.trim() : '',
      name: $('addName') ? $('addName').value.trim() : '',
      tags: parseTags($('addTags') ? $('addTags').value : ''),
      html: $('addHtml') ? $('addHtml').value : '',
      css: $('addCss') ? $('addCss').value : ''
    };
  }

  function updateGeneratedCode() {
    var data = getAddLayoutDraft();
    var out = $('generatedCode');
    var hint = $('variantFileHint');
    if (out) out.textContent = formatLayoutBlock(data);
    if (hint) hint.textContent = 'Arquivo de variantes: variants/' + (data.id || '[id]') + '.js';
  }

  function refreshAddPreview() {
    var frame = $('addPreviewFrame');
    var data = getAddLayoutDraft();
    if (!frame) return;
    frame.srcdoc = '';
    setTimeout(function () {
      frame.srcdoc = buildSrcDoc(data.html, data.css);
    }, 50);
  }

  function switchAddMode(mode) {
    switchPanel('data-add-mode', 'data-add-panel', mode, refreshAddPreview);
  }

  function openAddModal() {
    $('addId').value = '';
    $('addName').value = '';
    $('addTags').value = '';
    $('addHtml').value = '';
    $('addCss').value = '';
    updateGeneratedCode();
    showOverlay('addModalOverlay');
    switchAddMode('html');
  }

  function closeAddModal() {
    hideOverlay('addModalOverlay');
  }

  function getVariantsSearch() {
    var input = $('variantsSearchInput');
    return input ? input.value.toLowerCase().trim() : '';
  }

  function getFilteredVariants() {
    var parent = state.currentForVariant;
    var variants = parent ? SenkoLib.getVariants(parent.id) : [];
    var search = getVariantsSearch();
    var favs = parent ? ((getVarFavs()[parent.id]) || []) : [];
    var out = [];
    var i;

    for (i = 0; i < variants.length; i += 1) {
      if (!search || String(variants[i].name || '').toLowerCase().indexOf(search) >= 0) {
        out.push(variants[i]);
      }
    }

    out.sort(function (a, b) {
      var af = favs.indexOf(a.name) >= 0;
      var bf = favs.indexOf(b.name) >= 0;
      if (af !== bf) return af ? -1 : 1;
      return naturalCompare(a.name, b.name);
    });

    return out;
  }

  function renderVariantsGrid() {
    var grid = $('variantsGrid');
    var parent = state.currentForVariant;
    var variants = getFilteredVariants();
    var allVariants = parent ? SenkoLib.getVariants(parent.id) : [];
    var favCount = 0;
    var favs = parent ? ((getVarFavs()[parent.id]) || []) : [];
    var i;

    if (!grid || !parent) return;
    grid.innerHTML = '';
    for (i = 0; i < favs.length; i += 1) {
      if (favs[i]) favCount += 1;
    }
    $('variantsStatsBadge').textContent = allVariants.length + ' variante(s) · ' + favCount + ' favorito(s)';

    for (i = 0; i < variants.length; i += 1) {
      grid.appendChild(createVariantBlock(parent, variants[i]));
    }

    grid.appendChild(createAddVariantCard());

    if (global.ghvInjectDeleteButtons) global.ghvInjectDeleteButtons();
  }

  function createVariantBlock(parent, variant) {
    var block = document.createElement('article');
    var iframe;
    block.className = 'variant-block';
    block.innerHTML =
      '<div class="variant-preview">' +
        '<iframe title="Preview da variante ' + escapeHtml(variant.name) + '"></iframe>' +
        '<div class="variant-preview-overlay" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="variant-body"><h3 class="variant-name">' + escapeHtml(variant.name) + '</h3></div>' +
      '<div class="variant-footer">' +
        '<button class="btn btn-ghost btn-fav' + (isVarFav(parent.id, variant.name) ? ' active' : '') + '" type="button">★</button>' +
        '<button class="btn btn-ghost btn-edit-var-card" type="button">Editar</button>' +
        '<button class="btn btn-delete-variant-card hidden" type="button" data-parent-id="' + escapeHtml(parent.id) + '" data-variant-name="' + escapeHtml(variant.name) + '">Excluir</button>' +
      '</div>';

    iframe = block.querySelector('iframe');
    lazyIframe(iframe, variant.html, variant.css);

    block.querySelector('.btn-fav').addEventListener('click', function () {
      toggleVarFav(parent.id, variant.name);
    });
    block.querySelector('.btn-edit-var-card').addEventListener('click', function () {
      openEditVariantModal(variant);
    });
    return block;
  }

  function createAddVariantCard() {
    var card = document.createElement('article');
    card.className = 'variant-add-card';
    card.innerHTML = '<button id="openNewVariantBtn" type="button"><span class="variant-add-icon">+</span><span>Adicionar Nova Variante</span></button>';
    card.querySelector('button').addEventListener('click', openNewVariantModal);
    return card;
  }

  function openVariantsModal(layout) {
    state.currentForVariant = layout;
    $('variantsTitle').textContent = layout.name + ' · Variantes';
    $('variantsHint').textContent = 'Arquivo: variants/' + layout.id + '.js';
    $('variantsSearchInput').value = '';
    showOverlay('variantsOverlay');
    renderVariantsGrid();
  }

  function closeVariantsModal() {
    hideOverlay('variantsOverlay');
    state.currentForVariant = null;
  }

  function validVariantName(value) {
    return /^[a-z0-9.-]+$/.test(value || '');
  }

  function getNewVariantDraft() {
    return {
      name: $('newVarName') ? $('newVarName').value.trim() : '',
      html: $('newVarHtml') ? $('newVarHtml').value : '',
      css: $('newVarCss') ? $('newVarCss').value : ''
    };
  }

  function getNewVariantFormData() {
    var data = getNewVariantDraft();
    if (!state.currentForVariant || !validVariantName(data.name)) {
      showToast('Revise o nome da variante.');
      return null;
    }
    data.parentId = state.currentForVariant.id;
    return data;
  }

  function updateNewVariantCode() {
    var out = $('newVarGeneratedCode');
    if (out) out.textContent = formatVariantBlock(getNewVariantDraft());
  }

  function refreshNewVarPreview() {
    var frame = $('newVarPreviewFrame');
    var data = getNewVariantDraft();
    if (!frame) return;
    frame.srcdoc = '';
    setTimeout(function () {
      frame.srcdoc = buildSrcDoc(data.html, data.css);
    }, 50);
  }

  function switchNewVarMode(mode) {
    switchPanel('data-new-var-mode', 'data-new-var-panel', mode, refreshNewVarPreview);
  }

  function openNewVariantModal() {
    $('newVarName').value = '';
    $('newVarHtml').value = '';
    $('newVarCss').value = '';
    updateNewVariantCode();
    showOverlay('newVarOverlay');
    switchNewVarMode('html');
  }

  function closeNewVariantModal() {
    hideOverlay('newVarOverlay');
  }

  function getEditVariantDraft() {
    return {
      name: $('editVarName') ? $('editVarName').value.trim() : '',
      html: $('editVarHtml') ? $('editVarHtml').value : '',
      css: $('editVarCss') ? $('editVarCss').value : ''
    };
  }

  function getEditVariantFormData() {
    var data = getEditVariantDraft();
    if (!state.currentForVariant || !state.currentEditVariant || !validVariantName(data.name)) {
      showToast('Revise a variante.');
      return null;
    }
    data.parentId = state.currentForVariant.id;
    data.oldName = state.currentEditVariant.name;
    return data;
  }

  function updateEditVariantCode() {
    var out = $('editVarGeneratedCode');
    if (out) out.textContent = formatVariantBlock(getEditVariantDraft());
  }

  function refreshEditVarPreview() {
    var frame = $('editVarPreviewFrame');
    var data = getEditVariantDraft();
    if (!frame) return;
    frame.srcdoc = '';
    setTimeout(function () {
      frame.srcdoc = buildSrcDoc(data.html, data.css);
    }, 50);
  }

  function switchEditVarMode(mode) {
    switchPanel('data-edit-var-mode', 'data-edit-var-panel', mode, refreshEditVarPreview);
  }

  function openEditVariantModal(variant) {
    state.currentEditVariant = {
      name: variant.name,
      html: variant.html,
      css: variant.css
    };
    $('editVarName').value = variant.name || '';
    $('editVarHtml').value = variant.html || '';
    $('editVarCss').value = variant.css || '';
    updateEditVariantCode();
    showOverlay('editVarOverlay');
    setTimeout(function () {
      switchEditVarMode('preview');
    }, 10);
  }

  function closeEditVariantModal() {
    hideOverlay('editVarOverlay');
    state.currentEditVariant = null;
  }

  function openPicker() {
    var tabs = document.querySelectorAll('[data-picker]');
    var i;
    for (i = 0; i < tabs.length; i += 1) {
      if (tabs[i].getAttribute('data-picker') === 'layout') tabs[i].classList.add('active');
      else tabs[i].classList.remove('active');
    }
    $('pickerTitle').textContent = 'Adicionar Layout';
    showOverlay('pickerOverlay');
  }

  function closePicker() {
    hideOverlay('pickerOverlay');
  }

  function applyTheme(theme) {
    var btn = $('themeToggleBtn');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('senkolib_theme', theme);
    if (btn) {
      btn.innerHTML = theme === 'light'
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path><circle cx="12" cy="12" r="4"></circle></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"></path></svg>';
      btn.querySelector('svg').style.width = '19px';
      btn.querySelector('svg').style.height = '19px';
      btn.querySelector('svg').style.fill = 'none';
      btn.querySelector('svg').style.stroke = 'currentColor';
      btn.querySelector('svg').style.strokeWidth = '2';
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  function copiarBasics() {
    var code = '<!doctype html>\n' +
      '<html lang="pt-BR">\n' +
      '<head>\n' +
      '  <meta charset="utf-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <title>PDP</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <main class="pdp">\n' +
      '    <section class="pdp-section"></section>\n' +
      '  </main>\n' +
      '</body>\n' +
      '</html>';
    copyToClipboard(code, $('copyAllBtn'), '✓ HTML copiado!');
  }

  function isCollectionsVisible() {
    var colDashboard = $('colDashboard');
    return !!(colDashboard && colDashboard.style.display !== 'none');
  }

  function bindControls() {
    var search = $('searchInput');
    var idFields = ['editName', 'editTags', 'editHtml', 'editCss'];
    var addFields = ['addId', 'addName', 'addTags', 'addHtml', 'addCss'];
    var newVarFields = ['newVarName', 'newVarHtml', 'newVarCss'];
    var editVarFields = ['editVarName', 'editVarHtml', 'editVarCss'];
    var nodes;
    var i;

    if (search) {
      search.addEventListener('input', function () {
        if (isCollectionsVisible()) return;
        state.search = search.value;
        renderGrid();
      });
    }

    $('logoHome').addEventListener('click', function () {
      if (search) search.value = '';
      state.search = '';
      if (global.colSwitchTab) global.colSwitchTab('biblioteca');
      renderGrid();
    });

    $('openAddModal').addEventListener('click', openPicker);
    $('themeToggleBtn').addEventListener('click', toggleTheme);
    document.querySelector('[data-close-picker]').addEventListener('click', closePicker);
    document.querySelector('[data-close-edit]').addEventListener('click', closeEditModal);
    document.querySelector('[data-close-add]').addEventListener('click', closeAddModal);
    document.querySelector('[data-close-variants]').addEventListener('click', closeVariantsModal);
    document.querySelector('[data-close-new-var]').addEventListener('click', closeNewVariantModal);
    document.querySelector('[data-close-edit-var]').addEventListener('click', closeEditVariantModal);

    document.querySelector('[data-picker="layout"]').addEventListener('click', function () {
      closePicker();
      openAddModal();
    });
    document.querySelector('[data-picker="colecao"]').addEventListener('click', function () {
      closePicker();
      if (global.colOpenCreateModal) global.colOpenCreateModal();
    });

    document.addEventListener('click', function (event) {
      if (event.target && event.target.getAttribute('data-picker')) {
        var title = event.target.getAttribute('data-picker') === 'colecao' ? 'Adicionar Coleção' : 'Adicionar Layout';
        $('pickerTitle').textContent = title;
      }
    });

    nodes = document.querySelectorAll('[data-edit-mode]');
    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].addEventListener('click', function () { switchEditMode(this.getAttribute('data-edit-mode')); });
    }
    nodes = document.querySelectorAll('[data-add-mode]');
    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].addEventListener('click', function () { switchAddMode(this.getAttribute('data-add-mode')); });
    }
    nodes = document.querySelectorAll('[data-new-var-mode]');
    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].addEventListener('click', function () { switchNewVarMode(this.getAttribute('data-new-var-mode')); });
    }
    nodes = document.querySelectorAll('[data-edit-var-mode]');
    for (i = 0; i < nodes.length; i += 1) {
      nodes[i].addEventListener('click', function () { switchEditVarMode(this.getAttribute('data-edit-var-mode')); });
    }

    for (i = 0; i < idFields.length; i += 1) {
      $(idFields[i]).addEventListener('input', updateEditGeneratedCode);
    }
    for (i = 0; i < addFields.length; i += 1) {
      $(addFields[i]).addEventListener('input', updateGeneratedCode);
    }
    for (i = 0; i < newVarFields.length; i += 1) {
      $(newVarFields[i]).addEventListener('input', updateNewVariantCode);
    }
    for (i = 0; i < editVarFields.length; i += 1) {
      $(editVarFields[i]).addEventListener('input', updateEditVariantCode);
    }

    $('variantsSearchInput').addEventListener('input', renderVariantsGrid);
    $('editVarDeleteBtn').addEventListener('click', function () {
      if (global.ghvOpenDeleteModal && state.currentForVariant && state.currentEditVariant) {
        global.ghvOpenDeleteModal(state.currentForVariant.id, state.currentEditVariant.name);
      }
    });

    overlayClick('pickerOverlay', closePicker);
    overlayClick('editModalOverlay', closeEditModal);
    overlayClick('addModalOverlay', closeAddModal);
    overlayClick('variantsOverlay', closeVariantsModal);
    overlayClick('newVarOverlay', closeNewVariantModal);
    overlayClick('editVarOverlay', closeEditVariantModal);

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (!$('pickerOverlay').classList.contains('hidden')) return closePicker();
      if (!$('editVarOverlay').classList.contains('hidden')) return closeEditVariantModal();
      if (!$('newVarOverlay').classList.contains('hidden')) return closeNewVariantModal();
      if (!$('variantsOverlay').classList.contains('hidden')) return closeVariantsModal();
      if (!$('editModalOverlay').classList.contains('hidden')) return closeEditModal();
      if (!$('addModalOverlay').classList.contains('hidden')) return closeAddModal();
    });

    window.addEventListener('resize', function () {
      var iframes = document.querySelectorAll('.card-iframe, .variant-preview iframe, .col-layout-preview iframe');
      var j;
      for (j = 0; j < iframes.length; j += 1) {
        scaleCardIframe(iframes[j]);
      }
    });
  }

  function init() {
    applyTheme(localStorage.getItem('senkolib_theme') || 'dark');
    bindControls();
    renderGrid();
  }

  global.buildSrcDoc = buildSrcDoc;
  global.showToast = showToast;
  global.copyToClipboard = copyToClipboard;
  global.naturalCompare = naturalCompare;
  global.scaleCardIframe = scaleCardIframe;
  global.lazyIframe = lazyIframe;
  global.renderGrid = renderGrid;
  global.createCard = createCard;
  global.openEditModal = openEditModal;
  global.closeEditModal = closeEditModal;
  global.openAddModal = openAddModal;
  global.closeAddModal = closeAddModal;
  global.openVariantsModal = openVariantsModal;
  global.closeVariantsModal = closeVariantsModal;
  global.renderVariantsGrid = renderVariantsGrid;
  global.openNewVariantModal = openNewVariantModal;
  global.closeNewVariantModal = closeNewVariantModal;
  global.openEditVariantModal = openEditVariantModal;
  global.closeEditVariantModal = closeEditVariantModal;
  global.getCurrentEditLayoutData = getCurrentEditLayoutData;
  global.getAddLayoutFormData = getAddLayoutFormData;
  global.getNewVariantFormData = getNewVariantFormData;
  global.getEditVariantFormData = getEditVariantFormData;
  global.formatLayoutBlock = formatLayoutBlock;
  global.formatVariantBlock = formatVariantBlock;
  global.parseTags = parseTags;
  global.overlayClick = overlayClick;
  global.showOverlay = showOverlay;
  global.hideOverlay = hideOverlay;
  global.copiarBasics = copiarBasics;

  document.addEventListener('DOMContentLoaded', init);
}(window));
