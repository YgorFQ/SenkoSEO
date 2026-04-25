/*
 * Senko GitHub Variants
 * Responsabilidade: criar, editar e excluir variantes em variants/[layout].js.
 * Dependencias: senko-github-v2.js e core/script.js.
 * Expoe: ghvOpenDeleteModal e ghvInjectDeleteButtons.
 */
(function (global) {
  var _saving = false;
  var _deleteParentId = null;
  var _deleteVariantName = null;

  function $(id) {
    return document.getElementById(id);
  }

  function variantsPath(parentId) {
    return 'variants/' + parentId + '.js';
  }

  function createVariantFile(parentId) {
    return "/*\n * Variantes de " + parentId + "\n */\nSenkoLib.registerVariant('" + parentId + "', [\n]);\n";
  }

  function updateMemory(parentId, variant, oldName) {
    var list = SenkoLib.getVariants(parentId);
    var i;
    var done = false;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].name === (oldName || variant.name)) {
        list[i] = { name: variant.name, html: variant.html, css: variant.css };
        done = true;
        break;
      }
    }
    if (!done) list.push({ name: variant.name, html: variant.html, css: variant.css });
    SenkoLib.registerVariant(parentId, list);
  }

  function removeFromMemory(parentId, variantName) {
    var list = SenkoLib.getVariants(parentId);
    var out = [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].name !== variantName) out.push(list[i]);
    }
    SenkoLib.registerVariant(parentId, out);
  }

  function ghvSaveNewVariant() {
    var data = global.getNewVariantFormData ? global.getNewVariantFormData() : null;
    var path;
    if (!data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    path = variantsPath(data.parentId);
    global.githubGetFile(path).then(function (file) {
      var content = file ? global.ghDecodeBase64(file.content) : createVariantFile(data.parentId);
      var next = global.ghReplaceOrAppendBlock(content, data.name, global.formatVariantBlock(data));
      return global.githubPutFile(path, next, file && file.sha, 'Add variant ' + data.name);
    }).then(function () {
      updateMemory(data.parentId, data);
      global.showToast('✓ Variante criada no GitHub!');
      if (global.closeNewVariantModal) global.closeNewVariantModal();
      if (global.renderVariantsGrid) global.renderVariantsGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao criar variante.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghvSaveEditedVariant() {
    var data = global.getEditVariantFormData ? global.getEditVariantFormData() : null;
    var path;
    if (!data) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    path = variantsPath(data.parentId);
    global.githubGetFile(path).then(function (file) {
      var content = file ? global.ghDecodeBase64(file.content) : createVariantFile(data.parentId);
      var next = global.ghReplaceOrAppendBlock(content, data.oldName, global.formatVariantBlock(data));
      return global.githubPutFile(path, next, file && file.sha, 'Update variant ' + data.name);
    }).then(function () {
      updateMemory(data.parentId, data, data.oldName);
      if (global.state) global.state.currentEditVariant = { name: data.name, html: data.html, css: data.css };
      global.showToast('✓ Variante salva no GitHub!');
      if (global.closeEditVariantModal) global.closeEditVariantModal();
      if (global.renderVariantsGrid) global.renderVariantsGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao salvar variante.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghvDeleteVariant() {
    var parentId = _deleteParentId;
    var variantName = _deleteVariantName;
    var path = variantsPath(parentId);
    if (!parentId || !variantName) return;
    if (_saving) return global.showToast('Salvamento em andamento.');
    _saving = true;
    global.githubGetFile(path).then(function (file) {
      var content;
      var next;
      if (!file) throw new Error('Arquivo de variantes nao encontrado.');
      content = global.ghDecodeBase64(file.content);
      next = global.ghRemoveMarkedBlock(content, variantName);
      return global.githubPutFile(path, next, file.sha, 'Delete variant ' + variantName);
    }).then(function () {
      removeFromMemory(parentId, variantName);
      global.showToast('✓ Variante excluída!');
      ghvCloseDeleteModal();
      if (global.closeEditVariantModal) global.closeEditVariantModal();
      if (global.renderVariantsGrid) global.renderVariantsGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao excluir variante.');
    }).then(function () {
      _saving = false;
    });
  }

  function ghvCopyNewVariant() {
    var data = global.getNewVariantFormData ? global.getNewVariantFormData() : null;
    if (!data) return;
    global.copyToClipboard(global.formatVariantBlock(data), this, '✓ Código copiado!');
  }

  function ghvCopyEditVariant() {
    var data = global.getEditVariantFormData ? global.getEditVariantFormData() : null;
    if (!data) return;
    global.copyToClipboard(global.formatVariantBlock(data), this, '✓ Código copiado!');
  }

  function ghvEnsureDeleteModal() {
    var overlay = $('ghvDeleteOverlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'ghvDeleteOverlay';
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML =
      '<div class="modal col-confirm-modal" role="dialog" aria-modal="true">' +
        '<div class="col-form-header"><h2 class="col-confirm-title">Excluir variante</h2><button class="modal-close" id="ghvDeleteCloseBtn" type="button">×</button></div>' +
        '<p class="col-confirm-body" id="ghvDeleteBody"></p>' +
        '<div class="col-confirm-actions"><button class="col-btn-cancel" id="ghvDeleteCancelBtn" type="button">Cancelar</button><button class="col-btn-delete" id="ghvDeleteOkBtn" type="button">Excluir</button></div>' +
      '</div>';
    document.body.appendChild(overlay);
    $('ghvDeleteCloseBtn').addEventListener('click', ghvCloseDeleteModal);
    $('ghvDeleteCancelBtn').addEventListener('click', ghvCloseDeleteModal);
    $('ghvDeleteOkBtn').addEventListener('click', ghvDeleteVariant);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) ghvCloseDeleteModal();
    });
    return overlay;
  }

  function ghvOpenDeleteModal(parentId, variantName) {
    var overlay = ghvEnsureDeleteModal();
    _deleteParentId = parentId;
    _deleteVariantName = variantName;
    $('ghvDeleteBody').textContent = 'A variante "' + variantName + '" será removida de variants/' + parentId + '.js.';
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function ghvCloseDeleteModal() {
    var overlay = $('ghvDeleteOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (!document.querySelector('.modal-overlay:not(.hidden)')) document.body.style.overflow = '';
  }

  function ghvInjectVariantButtons() {
    var editAnchor = $('saveVarToFileBtn');
    var newAnchor = $('newVarCopyBtn');
    var btn;
    var copy;
    if (editAnchor && !editAnchor.querySelector('[data-gh-save-var]')) {
      copy = document.createElement('button');
      copy.className = 'btn btn-ghost';
      copy.type = 'button';
      copy.textContent = 'Copiar';
      copy.addEventListener('click', ghvCopyEditVariant);
      btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.type = 'button';
      btn.setAttribute('data-gh-save-var', '1');
      btn.textContent = 'GitHub';
      btn.addEventListener('click', ghvSaveEditedVariant);
      editAnchor.appendChild(copy);
      editAnchor.appendChild(btn);
    }
    if (newAnchor && !newAnchor.querySelector('[data-gh-new-var]')) {
      copy = document.createElement('button');
      copy.className = 'btn btn-ghost';
      copy.type = 'button';
      copy.textContent = 'Copiar';
      copy.addEventListener('click', ghvCopyNewVariant);
      btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.type = 'button';
      btn.setAttribute('data-gh-new-var', '1');
      btn.textContent = 'GitHub';
      btn.addEventListener('click', ghvSaveNewVariant);
      newAnchor.appendChild(copy);
      newAnchor.appendChild(btn);
    }
  }

  function ghvInjectDeleteButtons() {
    var buttons = document.querySelectorAll('.btn-delete-variant-card');
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].classList.remove('hidden');
      if (!buttons[i]._ghvBound) {
        buttons[i]._ghvBound = true;
        buttons[i].addEventListener('click', function () {
          ghvOpenDeleteModal(this.getAttribute('data-parent-id'), this.getAttribute('data-variant-name'));
        });
      }
    }
  }

  function init() {
    ghvInjectVariantButtons();
    ghvInjectDeleteButtons();
  }

  global.ghvOpenDeleteModal = ghvOpenDeleteModal;
  global.ghvInjectDeleteButtons = ghvInjectDeleteButtons;

  document.addEventListener('DOMContentLoaded', init);
}(window));
