/* ============================================================================
   senko-github-delete.js - Exclusao de layouts no GitHub

   RESPONSABILIDADE:
     Exibe o botao de excluir no modal de layout, confirma a acao e remove
     o bloco marcado no arquivo layouts/layouts001.js.

   EXPOE (globais):
     ghDeleteInjectButton() -> revela/binda botao de exclusao
     ghDeleteOpenModal(layoutId) -> abre confirmacao

   DEPENDENCIAS:
     senko-github-v2.js, modal-edit.js, col-modals.js.

   ORDEM DE CARREGAMENTO:
     Depois de senko-github-variants.js.
============================================================================ */

function ghDeleteInjectButton() {
  var btn = document.getElementById('editDeleteBtn');
  if (!btn) return;
  btn.style.display = 'inline-flex';
  if (btn.getAttribute('data-gh-delete-bound')) return;
  btn.setAttribute('data-gh-delete-bound', '1');
  btn.addEventListener('click', function () {
    var data = getEditFormData();
    if (data) ghDeleteOpenModal(data.id);
  });
}

function ghDeleteLayout(layoutId) {
  var path = 'layouts/layouts001.js';
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile(path).then(function (file) {
    if (!file) throw new Error('Arquivo de layouts nao encontrado');
    return githubPutFile(path, ghRemoveMarkedBlock(ghDecodeBase64(file.content), layoutId), file.sha, 'Remove layout ' + layoutId);
  }).then(function () {
    if (SenkoLib.removeLayout) SenkoLib.removeLayout(layoutId);
    closeEditModal();
    renderGrid();
    showToast('Layout removido');
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghDeleteOpenModal(layoutId) {
  if (!window.colOpenConfirm) return;
  colOpenConfirm({
    title: 'Excluir layout',
    body: 'Remover "' + layoutId + '" de layouts/layouts001.js?',
    labelOk: 'Excluir',
    danger: true,
    onConfirm: function () {
      ghDeleteLayout(layoutId);
    }
  });
}

document.addEventListener('DOMContentLoaded', ghDeleteInjectButton);
