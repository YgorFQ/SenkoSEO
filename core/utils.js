/* ============================================================================
   utils.js - Utilitarios compartilhados da SenkoLib

   RESPONSABILIDADE:
     Centraliza preview iframe, clipboard, ordenacao natural, estado da aba,
     formatacao de codigo e comportamento de overlay reutilizado.

   EXPOE (globais):
     buildSrcDoc(html, css) -> html completo para iframe
     copyToClipboard(text, btn, label) -> copia texto e mostra feedback
     lazyIframe(iframe, html, css) -> agenda preview com IntersectionObserver
     setActiveTab(tab), getActiveTab() -> gerencia aba contextual

   DEPENDENCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Depois de SenkoLib e antes dos modulos de UI.
============================================================================ */

var state = {
  search: '',
  currentEdit: null,
  currentForVariant: null,
  currentEditVariant: null
};

var _activeTab = 'biblioteca';
var _iframeObserver = null;
var _toastTimer = null;

function setActiveTab(tab) {
  _activeTab = tab === 'colecoes' ? 'colecoes' : 'biblioteca';
}

function getActiveTab() {
  return _activeTab;
}

function buildSrcDoc(html, css) {
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>html,body{margin:0;background:#fff;color:#111;font-family:Arial,sans-serif;}*{box-sizing:border-box;}' +
    String(css || '') + '</style></head><body>' + String(html || '') + '</body></html>';
}

function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message || 'Copiado!';
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2000);
}

function copyToClipboard(text, btn, label) {
  var original = btn ? btn.innerHTML : '';
  var done = function () {
    if (btn) {
      btn.innerHTML = label || 'Copiado!';
      setTimeout(function () { btn.innerHTML = original; }, 1200);
    }
    showToast(label || 'Copiado!');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(String(text || '')).then(done);
    return;
  }
  var textarea = document.createElement('textarea');
  textarea.value = String(text || '');
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  done();
}

function naturalCompare(a, b) {
  var ax = String(a || '').toLowerCase().match(/\d+|\D+/g) || [];
  var bx = String(b || '').toLowerCase().match(/\d+|\D+/g) || [];
  var len = Math.max(ax.length, bx.length);
  var i;
  for (i = 0; i < len; i += 1) {
    if (ax[i] === undefined) return -1;
    if (bx[i] === undefined) return 1;
    if (ax[i] !== bx[i]) {
      var an = Number(ax[i]);
      var bn = Number(bx[i]);
      if (!isNaN(an) && !isNaN(bn)) return an - bn;
      return ax[i] > bx[i] ? 1 : -1;
    }
  }
  return 0;
}

function scaleCardIframe(iframe) {
  var wrap = iframe && iframe.parentNode;
  if (!wrap) return;
  var scale = wrap.clientWidth / 1280;
  var targetHeight = Math.max(720, Math.ceil(wrap.clientHeight / Math.max(scale, 0.01)));
  iframe.style.width = '1280px';
  iframe.style.height = targetHeight + 'px';
  iframe.style.transform = 'scale(' + scale + ')';
}

function lazyIframe(iframe, html, css) {
  iframe.dataset.src = buildSrcDoc(html, css);
  if (!('IntersectionObserver' in window)) {
    iframe.srcdoc = iframe.dataset.src;
    scaleCardIframe(iframe);
    return;
  }
  if (!_iframeObserver) {
    _iframeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var target = entry.target;
        if (!entry.isIntersecting || target.srcdoc) return;
        target.srcdoc = target.dataset.src || '';
        scaleCardIframe(target);
        _iframeObserver.unobserve(target);
      });
    }, { rootMargin: '200px' });
  }
  _iframeObserver.observe(iframe);
}

function refreshModalPreview(iframe, html, css) {
  if (!iframe) return;
  iframe.srcdoc = '';
  requestAnimationFrame(function () {
    iframe.srcdoc = buildSrcDoc(html, css);
  });
}

function parseTags(value) {
  return String(value || '').split(',').map(function (tag) {
    return tag.trim();
  }).filter(function (tag) {
    return !!tag;
  });
}

function escapeTemplate(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function formatLayoutObject(layout) {
  return '/*@@@@Senko - ' + layout.id + ' */\n' +
    '{\n' +
    "  id: '" + layout.id + "',\n" +
    "  name: '" + String(layout.name || '').replace(/'/g, "\\'") + "',\n" +
    '  tags: ' + JSON.stringify(layout.tags || []) + ',\n' +
    '  html: `' + escapeTemplate(layout.html) + '`,\n' +
    '  css: `' + escapeTemplate(layout.css) + '`,\n' +
    '}';
}

function formatVariantObject(variant) {
  return '/*@@@@Senko - ' + variant.name + ' */\n' +
    '{\n' +
    "  name: '" + String(variant.name || '').replace(/'/g, "\\'") + "',\n" +
    '  html: `' + escapeTemplate(variant.html) + '`,\n' +
    '  css: `' + escapeTemplate(variant.css) + '`,\n' +
    '}';
}

function overlayClick(overlayId, closeFn) {
  var overlay = document.getElementById(overlayId);
  var last = 0;
  if (!overlay) return;
  overlay.addEventListener('click', function (event) {
    if (event.target !== overlay) return;
    var now = Date.now();
    if (now - last < 400) closeFn();
    last = now;
  });
}

function setBodyLocked(locked) {
  document.body.classList.toggle('modal-open', !!locked);
}

function iconSvg(name) {
  var icons = {
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M5 15V5h10"></path></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"></path></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M21 12.7A8 8 0 1 1 11.3 3 6.4 6.4 0 0 0 21 12.7Z"></path></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.3 17.7-1.4 1.4"></path><path d="m19.1 4.9-1.4 1.4"></path></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 6.5h7l2 2H21v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>',
    unlock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 7.5-2"></path></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path><path d="M4 12h2"></path><path d="M18 12h2"></path><path d="m6.3 6.3 1.4 1.4"></path><path d="m16.3 16.3 1.4 1.4"></path><path d="m6.3 17.7 1.4-1.4"></path><path d="m16.3 7.7 1.4-1.4"></path></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m6 6 1 15h10l1-15"></path></svg>'
  };
  return icons[name] || '';
}

function copiarBasics() {
  var html = '<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Produto</title>\n</head>\n<body>\n  <main class="pdp">\n    <section class="pdp-section">\n      <h1>Titulo do Produto</h1>\n      <p>Descricao base da PDP.</p>\n    </section>\n  </main>\n</body>\n</html>';
  copyToClipboard(html, document.getElementById('copyAllBtn'), 'HTML copiado!');
}
