/* ============================================================================
   senko-github-variants.js - GitHub API para variantes

   RESPONSABILIDADE:
     Injeta botoes de salvar/criar/excluir variantes e atualiza arquivos
     variants/[layoutId].js usando marcadores @@@@Senko.

   EXPOE (globais):
     ghvInjectButtons() -> injeta botoes nos modais/cards
     ghvOpenDeleteModal(parentId, variantName) -> confirma exclusao

   DEPENDENCIAS:
     senko-github-v2.js, modais de variantes.

   ORDEM DE CARREGAMENTO:
     Depois de senko-github-v2.js.
============================================================================ */

function ghvInjectButtons() {
  var editAnchor = document.getElementById('saveVarToFileBtn');
  var newAnchor = document.getElementById('newVarCopyBtn');
  var editDelete = document.getElementById('editVarDeleteBtn');
  var btn;

  if (editAnchor && !document.getElementById('ghSaveVarBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Salvar variante no GitHub');
    btn.id = 'ghSaveVarBtn';
    btn.addEventListener('click', ghvSaveEditedVariant);
    editAnchor.appendChild(btn);
  }

  if (newAnchor && !document.getElementById('ghNewVarBtn')) {
    btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Criar variante no GitHub');
    btn.id = 'ghNewVarBtn';
    btn.addEventListener('click', ghvSaveNewVariant);
    newAnchor.appendChild(btn);
  }

  if (editDelete) editDelete.style.display = 'inline-flex';
  Array.prototype.forEach.call(document.querySelectorAll('.btn-delete-variant-card'), function (deleteBtn) {
    deleteBtn.style.display = 'inline-flex';
  });
}

function ghvSaveVariant(data, originalName, isNew) {
  var path;
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  path = 'variants/' + data.layoutId + '.js';
  ghSetSaving(true);
  githubGetFile(path).then(function (file) {
    var current = file ? ghDecodeBase64(file.content) : '';
    var updated = current;
    if (originalName && originalName !== data.name) updated = ghRemoveMarkedBlock(updated, originalName);
    updated = ghUpsertMarkedBlock(updated, data.name, formatVariantObject(data), 'variant', data.layoutId);
    return githubPutFile(path, updated, file ? file.sha : null, (isNew ? 'Adiciona variante ' : 'Atualiza variante ') + data.name);
  }).then(function () {
    showToast('Variante salva');
    if (SenkoLib.upsertVariant) SenkoLib.upsertVariant(data.layoutId, data);
    renderVariantBlocks();
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghvSaveEditedVariant() {
  var data = getEditVariantFormData();
  if (!data || !/^[a-z0-9.-]{2,}$/.test(data.name)) {
    showToast('Nome de variante invalido');
    return;
  }
  ghvSaveVariant(data, data.originalName, false);
}

function ghvSaveNewVariant() {
  var data = getNewVariantFormData();
  if (!data) {
    showToast('Nome de variante invalido');
    return;
  }
  ghvSaveVariant(data, null, true);
}

function ghvDeleteVariant(parentId, variantName) {
  var path = 'variants/' + parentId + '.js';
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile(path).then(function (file) {
    if (!file) throw new Error('Arquivo de variantes nao encontrado');
    return githubPutFile(path, ghRemoveMarkedBlock(ghDecodeBase64(file.content), variantName), file.sha, 'Remove variante ' + variantName);
  }).then(function () {
    if (SenkoLib.removeVariant) SenkoLib.removeVariant(parentId, variantName);
    showToast('Variante removida');
    if (isOverlayOpen('editVarOverlay')) closeEditVariantModal();
    renderVariantBlocks();
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghvOpenDeleteModal(parentId, variantName) {
  if (window.colOpenConfirm) {
    colOpenConfirm({
      title: 'Excluir variante',
      body: 'Remover "' + variantName + '" de variants/' + parentId + '.js?',
      labelOk: 'Excluir',
      danger: true,
      onConfirm: function () {
        ghvDeleteVariant(parentId, variantName);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', ghvInjectButtons);
