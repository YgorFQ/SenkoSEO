/* ═══════════════════════════════════════════════════════════════════════
   theme.js — Gerenciamento de tema claro/escuro

   RESPONSABILIDADE:
     Lê preferência de tema do localStorage, aplica via data-theme no
     <html> e expõe função para toggle. O botão de toggle no header
     é atualizado via updateThemeBtn().

   EXPÕE (globais):
     initTheme()   → void (chamar no DOMContentLoaded)
     toggleTheme() → void

   DEPENDÊNCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Antes de script.js.
═══════════════════════════════════════════════════════════════════════ */

var _THEME_KEY = 'senkolib_theme';

/* ── Inicialização ──────────────────────────────────────────────────── */

// Aplica o tema salvo (ou 'dark' como padrão se nada salvo)
function initTheme() {
  var saved = localStorage.getItem(_THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

/* ── Toggle ─────────────────────────────────────────────────────────── */

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  var next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(_THEME_KEY, next);
  updateThemeBtn(next);
}

/* ── Atualizar ícone do botão ───────────────────────────────────────── */

function updateThemeBtn(theme) {
  var btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  btn.title = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
}
