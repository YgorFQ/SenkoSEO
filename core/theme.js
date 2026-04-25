/* ============================================================================
   theme.js - Tema claro/escuro

   RESPONSABILIDADE:
     Aplica o tema salvo, atualiza o botao de alternancia e persiste a
     preferencia no localStorage.

   EXPOE (globais):
     initTheme() -> aplica tema inicial
     toggleTheme() -> alterna tema atual

   DEPENDENCIAS:
     utils.js.

   ORDEM DE CARREGAMENTO:
     Depois de utils.js e antes do bootstrap.
============================================================================ */

function renderThemeButton(theme) {
  var btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? iconSvg('sun') : iconSvg('moon');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('senkolib_theme', theme);
  renderThemeButton(theme);
}

function initTheme() {
  var saved = localStorage.getItem('senkolib_theme') || 'dark';
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
