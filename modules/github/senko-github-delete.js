/*
 * Senko GitHub Delete
 * Responsabilidade: excluir layouts da biblioteca via GitHub API.
 * Dependencias: senko-github-v2.js e core/script.js.
 * Expoe: ghInjectLayoutDeleteButton.
 */
(function (global) {
  var _deleteLayoutId = null;
  var _saving = false;

  function $(id) {
    return document.getElementById(id);
  }

  function ghDeleteCurrentLayout() {
    var path = 'layouts/layouts001.js';
    var id = _deleteLayoutId;
    if (!id) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    global.githubGetFile(path).then(function (file) {
      var content;
      var next;
      if (!file) throw new Error('Arquivo de layouts nao encontrado.');
      content = global.ghDecodeBase64(file.content);
      next = global.ghRemoveMarkedBlock(content, id);
      return global.githubPutFile(path, next, file.sha, 'Delete layout ' + id);
    }).then(function () {
      if (SenkoLib.remove) SenkoLib.remove(id);
      global.showToast('✓ Layout excluído!');
      ghCloseLayoutDeleteModal();
      if (global.closeEditModal) global.closeEditModal();
      if (global.renderGrid) global.renderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao excluir layout.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghEnsureLayoutDeleteModal() {
    var overlay = $('ghLayoutDeleteOverlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'ghLayoutDeleteOverlay';
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML =
      '<div class="modal col-confirm-modal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><h2 class="col-confirm-title">Excluir layout</h2><button class="modal-close" id="ghLayoutDeleteCloseBtn" type="button">×</button></div>' +
        '<p class="col-confirm-body" id="ghLayoutDeleteBody"></p>' +
        '<div class="col-confirm-actions"><button class="col-btn-cancel" id="ghLayoutDeleteCancelBtn" type="button">Cancelar</button><button class="col-btn-delete" id="ghLayoutDeleteOkBtn" type="button">Excluir</button></div>' +
      '</div>';
    document.body.appendChild(overlay);
    $('ghLayoutDeleteCloseBtn').addEventListener('click', ghCloseLayoutDeleteModal);
    $('ghLayoutDeleteCancelBtn').addEventListener('click', ghCloseLayoutDeleteModal);
    $('ghLayoutDeleteOkBtn').addEventListener('click', ghDeleteCurrentLayout);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) ghCloseLayoutDeleteModal();
    });
    return overlay;
  }

  function ghOpenLayoutDeleteModal() {
    var current = global.getCurrentEditLayoutData ? global.getCurrentEditLayoutData() : null;
    var overlay;
    if (!current || !current.id) return;
    _deleteLayoutId = current.id;
    overlay = ghEnsureLayoutDeleteModal();
    $('ghLayoutDeleteBody').textContent = 'O layout "' + current.name + '" será removido de layouts/layouts001.js.';
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function ghCloseLayoutDeleteModal() {
    var overlay = $('ghLayoutDeleteOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (!document.querySelector('.modal-overlay:not(.hidden)')) document.body.style.overflow = '';
  }

  function ghInjectLayoutDeleteButton() {
    var btn = $('editLayoutDeleteBtn');
    if (!btn || btn._ghDeleteBound) return;
    btn._ghDeleteBound = true;
    btn.classList.remove('hidden');
    btn.addEventListener('click', ghOpenLayoutDeleteModal);
  }

  function init() {
    ghInjectLayoutDeleteButton();
  }

  global.ghInjectLayoutDeleteButton = ghInjectLayoutDeleteButton;

  document.addEventListener('DOMContentLoaded', init);
}(window));
