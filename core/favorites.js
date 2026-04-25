/* ═══════════════════════════════════════════════════════════════════════
   favorites.js — Gerenciamento de favoritos de layouts e variantes

   RESPONSABILIDADE:
     Lê e persiste favoritos no localStorage. Favoritos de layouts ficam
     em 'senkolib_favs' (array de ids). Favoritos de variantes ficam em
     'senkolib_var_favs' (objeto { layoutId: [variantName, ...] }).

   EXPÕE (globais):
     getFavs()                         → string[]
     saveFavs(favs)                    → void
     isFav(id)                         → boolean
     toggleFav(id)                     → boolean (novo estado)
     getVarFavs()                      → object
     saveVarFavs(favs)                 → void
     isVarFav(layoutId, variantName)   → boolean
     toggleVarFav(layoutId, variantName) → boolean (novo estado)

   DEPENDÊNCIAS:
     Nenhuma.

   ORDEM DE CARREGAMENTO:
     Após utils.js.
═══════════════════════════════════════════════════════════════════════ */

/* ── Chaves de localStorage ─────────────────────────────────────────── */
var _FAVS_KEY     = 'senkolib_favs';
var _VAR_FAVS_KEY = 'senkolib_var_favs';

/* ── Favoritos de layouts ───────────────────────────────────────────── */

function getFavs() {
  try { return JSON.parse(localStorage.getItem(_FAVS_KEY)) || []; }
  catch (e) { return []; }
}

function saveFavs(favs) {
  localStorage.setItem(_FAVS_KEY, JSON.stringify(favs));
}

function isFav(id) {
  return getFavs().indexOf(id) !== -1;
}

// Alterna favorito e retorna o novo estado (true = favoritado)
function toggleFav(id) {
  var favs = getFavs();
  var idx  = favs.indexOf(id);
  if (idx === -1) { favs.push(id); saveFavs(favs); return true; }
  favs.splice(idx, 1); saveFavs(favs); return false;
}

/* ── Favoritos de variantes ─────────────────────────────────────────── */

function getVarFavs() {
  try { return JSON.parse(localStorage.getItem(_VAR_FAVS_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveVarFavs(favs) {
  localStorage.setItem(_VAR_FAVS_KEY, JSON.stringify(favs));
}

function isVarFav(layoutId, variantName) {
  var favs = getVarFavs();
  return !!(favs[layoutId] && favs[layoutId].indexOf(variantName) !== -1);
}

// Alterna favorito de variante e retorna o novo estado
function toggleVarFav(layoutId, variantName) {
  var favs = getVarFavs();
  if (!favs[layoutId]) favs[layoutId] = [];
  var idx = favs[layoutId].indexOf(variantName);
  if (idx === -1) { favs[layoutId].push(variantName); saveVarFavs(favs); return true; }
  favs[layoutId].splice(idx, 1); saveVarFavs(favs); return false;
}
