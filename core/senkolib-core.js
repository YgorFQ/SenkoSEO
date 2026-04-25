/*
 * SenkoLib core
 * Responsabilidade: manter o registro em memoria dos layouts e variantes.
 * Dependencias: nenhuma.
 * Expoe: window.SenkoLib.register/getAll/remove/registerVariant/getVariants.
 */
(function (global) {
  var _layouts = [];
  var _variants = {};

  function normalizeKey(value) {
    return String(value || '').toLowerCase();
  }

  function cloneArray(arr) {
    return arr ? arr.slice(0) : [];
  }

  function register(arr) {
    var i;
    if (!arr || !arr.length) return;

    for (i = 0; i < arr.length; i += 1) {
      if (arr[i] && arr[i].id) {
        _layouts.push(arr[i]);
      }
    }
  }

  function getAll() {
    return cloneArray(_layouts);
  }

  function remove(id) {
    var i;
    for (i = _layouts.length - 1; i >= 0; i -= 1) {
      if (_layouts[i] && _layouts[i].id === id) {
        _layouts.splice(i, 1);
      }
    }
  }

  function registerVariant(layoutName, arr) {
    var key = normalizeKey(layoutName);
    if (!key) return;
    _variants[key] = cloneArray(arr);
  }

  function getVariants(layoutName) {
    return cloneArray(_variants[normalizeKey(layoutName)]);
  }

  global.SenkoLib = {
    register: register,
    getAll: getAll,
    remove: remove,
    registerVariant: registerVariant,
    getVariants: getVariants
  };
}(window));
