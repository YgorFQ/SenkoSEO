/* ═══════════════════════════════════════════════════════════════════════
   utils.js — Utilitários compartilhados entre todos os módulos

   RESPONSABILIDADE:
     Funções puras reutilizáveis: montagem de srcdoc, clipboard, toast,
     comparação natural, escala de iframe e lazy loading com
     IntersectionObserver. Também gerencia o estado da aba ativa
     (biblioteca | colecoes) para busca contextual sem checar display.

   EXPÕE (globais):
     buildSrcDoc(html, css)          → string (HTML completo para srcdoc)
     showToast()                     → void
     copyToClipboard(text, btn, lbl) → void
     naturalCompare(a, b)            → number
     scaleCardIframe(iframe)         → void
     lazyIframe(iframe, html, css)   → void
     setActiveTab(tab)               → void
     getActiveTab()                  → string

   DEPENDÊNCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Após senkolib-core.js, antes de qualquer módulo de UI.
═══════════════════════════════════════════════════════════════════════ */

/* ── Gerenciador de aba ativa ───────────────────────────────────────── */

var _activeTab = 'biblioteca'; // 'biblioteca' | 'colecoes'

function setActiveTab(tab) { _activeTab = tab; }
function getActiveTab()    { return _activeTab; }

/* ── srcdoc ─────────────────────────────────────────────────────────── */

// Monta documento HTML completo para exibição em iframe (srcdoc)
function buildSrcDoc(html, css) {
  var styleBlock = css ? '<style>' + css + '</style>' : '';
  return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    styleBlock + '</head><body style="margin:0;padding:0;">' +
    html + '</body></html>';
}

/* ── Toast ───────────────────────────────────────────────────────────── */

// Exibe toast de confirmação por 2 segundos
function showToast() {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 2000);
}

/* ── Clipboard ───────────────────────────────────────────────────────── */

// Copia texto para clipboard e anima o botão com feedback visual
function copyToClipboard(text, btn, label) {
  navigator.clipboard.writeText(text).then(function () {
    showToast();
    if (!btn) return;
    var original = btn.textContent;
    btn.textContent = '✓ Copiado!';
    setTimeout(function () { btn.textContent = label || original; }, 1800);
  });
}

/* ── Ordenação natural ───────────────────────────────────────────────── */

// Compara strings com segmentos numéricos (section-2 < section-9 < section-10)
function naturalCompare(a, b) {
  var re = /(\d+)|(\D+)/g;
  var ta = String(a).match(re) || [];
  var tb = String(b).match(re) || [];
  for (var i = 0; i < Math.max(ta.length, tb.length); i++) {
    if (ta[i] === undefined) return -1;
    if (tb[i] === undefined) return  1;
    var na = parseInt(ta[i], 10);
    var nb = parseInt(tb[i], 10);
    if (!isNaN(na) && !isNaN(nb)) {
      if (na !== nb) return na - nb;
    } else {
      if (ta[i] < tb[i]) return -1;
      if (ta[i] > tb[i]) return  1;
    }
  }
  return 0;
}

/* ── Escala de iframe ────────────────────────────────────────────────── */

// Calcula e aplica transform scale para iframe caber no container (base 1280px)
function scaleCardIframe(iframe) {
  var container = iframe.parentElement;
  if (!container) return;
  var w = container.offsetWidth || 280;
  var scale = w / 1280;
  iframe.style.transform = 'scale(' + scale + ')';
  iframe.style.transformOrigin = 'top left';
  iframe.style.width  = '1280px';
  iframe.style.height = Math.round(container.offsetHeight / scale) + 'px';
}

/* ── Lazy loading de iframes com IntersectionObserver ───────────────── */

// Observer global único — reutilizado para todos os iframes do projeto
var _iframeObserver = (function () {
  if (typeof IntersectionObserver === 'undefined') return null;
  return new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var iframe = entry.target;
      if (iframe.dataset.src) {
        iframe.srcdoc = iframe.dataset.src;
        delete iframe.dataset.src;
        scaleCardIframe(iframe);
      }
      _iframeObserver.unobserve(iframe);
    });
  }, { rootMargin: '200px' });
}());

// Registra iframe para lazy loading; armazena srcdoc em dataset até ficar visível
function lazyIframe(iframe, html, css) {
  iframe.dataset.src = buildSrcDoc(html, css);
  if (_iframeObserver) {
    _iframeObserver.observe(iframe);
  } else {
    // Fallback para ambientes sem suporte ao observer
    iframe.srcdoc = iframe.dataset.src;
    delete iframe.dataset.src;
    scaleCardIframe(iframe);
  }
}
