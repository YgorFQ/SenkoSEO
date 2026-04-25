/* ============================================================================
   favorites.js - Favoritos de layouts e variantes

   RESPONSABILIDADE:
     Persiste favoritos no localStorage e fornece consultas rapidas para
     ordenacao do grid e estados visuais dos botoes.

   EXPOE (globais):
     isFav(id), toggleFav(id) -> favoritos de layouts
     isVarFav(layoutId, name), toggleVarFav(layoutId, name) -> variantes

   DEPENDENCIAS:
     utils.js.

   ORDEM DE CARREGAMENTO:
     Depois de utils.js e antes de grid/modais.
============================================================================ */

function getFavs() {
  try {
    return JSON.parse(localStorage.getItem('senkolib_favs') || '[]');
  } catch (error) {
    return [];
  }
}

function saveFavs(favs) {
  localStorage.setItem('senkolib_favs', JSON.stringify(favs || []));
}

function isFav(id) {
  return getFavs().indexOf(id) !== -1;
}

function toggleFav(id) {
  var favs = getFavs();
  var index = favs.indexOf(id);
  if (index === -1) favs.push(id);
  else favs.splice(index, 1);
  saveFavs(favs);
  return index === -1;
}

function getVarFavs() {
  try {
    return JSON.parse(localStorage.getItem('senkolib_var_favs') || '{}');
  } catch (error) {
    return {};
  }
}

function saveVarFavs(favs) {
  localStorage.setItem('senkolib_var_favs', JSON.stringify(favs || {}));
}

function isVarFav(layoutId, name) {
  var favs = getVarFavs();
  var list = favs[layoutId] || [];
  return list.indexOf(name) !== -1;
}

function toggleVarFav(layoutId, name) {
  var favs = getVarFavs();
  var list = favs[layoutId] || [];
  var index = list.indexOf(name);
  if (index === -1) list.push(name);
  else list.splice(index, 1);
  favs[layoutId] = list;
  saveVarFavs(favs);
  return index === -1;
}
