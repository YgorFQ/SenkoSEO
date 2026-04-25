/* ═══════════════════════════════════════════════════════════════════════
   senko-github-variants.js — Variantes no GitHub

   RESPONSABILIDADE:
     Injeta botões de save/delete nas âncoras dos modais de variantes.
     Lê/escreve arquivos variants/[id].js usando o parser @@@@Senko.
     Exibe botões de excluir nos cards de variante e no modal de edição.

   EXPÕE (globais):
     ghvOpenDeleteModal(parentId, variantName) → void

   DEPENDÊNCIAS:
     senko-github-v2.js, modal-variants.js, modal-edit-variant.js,
     modal-new-variant.js

   ORDEM DE CARREGAMENTO:
     Após senko-github-v2.js
═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  // Aguarda os modais serem construídos antes de injetar
  setTimeout(function () {
    _ghvInjectNewVarButton();
    _ghvInjectEditVarButton();
    _ghvInjectDeleteVarButton();
  }, 300);
});

/* ── Parser de variantes ────────────────────────────────────────────── */

// Localiza e substitui um bloco de variante no arquivo de variantes
function _ghvParseAndReplace(content, name, newBlock) {
  var marker = '/*@@@@Senko - ' + name + ' */';
  var start  = content.indexOf(marker);
  if (start === -1) {
    // Não existe: insere antes do ]); final
    var insertBefore = content.lastIndexOf(']);');
    if (insertBefore === -1) return content + '\n' + marker + '\n' + newBlock + ',\n';
    return content.slice(0, insertBefore) + '\n' + marker + '\n' + newBlock + ',\n\n' + content.slice(insertBefore);
  }
  // Substitui o objeto existente
  var objStart = content.indexOf('{', start + marker.length);
  if (objStart === -1) return content;

  var depth = 0, inBt = false, i = objStart;
  while (i < content.length) {
    var ch = content[i];
    if (ch === '`' && !inBt)  { inBt = true;  i++; continue; }
    if (ch === '`' &&  inBt)  { inBt = false; i++; continue; }
    if (ch === '\\' && inBt)  { i += 2; continue; }
    if (!inBt) {
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
    }
    i++;
  }
  return content.slice(0, start) + marker + '\n' + newBlock + content.slice(i + 1);
}

// Remove o bloco de uma variante do arquivo
function _ghvRemoveVariant(content, name) {
  var marker = '/*@@@@Senko - ' + name + ' */';
  var start  = content.indexOf(marker);
  if (start === -1) return content;

  var objStart = content.indexOf('{', start + marker.length);
  if (objStart === -1) return content;

  var depth = 0, inBt = false, i = objStart;
  while (i < content.length) {
    var ch = content[i];
    if (ch === '`' && !inBt)  { inBt = true;  i++; continue; }
    if (ch === '`' &&  inBt)  { inBt = false; i++; continue; }
    if (ch === '\\' && inBt)  { i += 2; continue; }
    if (!inBt) {
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
    }
    i++;
  }

  // Remove até a vírgula seguinte (se houver)
  var end = i + 1;
  if (content[end] === ',') end++;

  return (content.slice(0, start) + content.slice(end)).replace(/\n{3,}/g, '\n\n');
}

/* ── Salvar variante ────────────────────────────────────────────────── */

function _ghvSaveVariant(layout, variant, onSuccess) {
  if (!ghEnsureToken()) return;
  var filePath = 'variants/' + layout.id + '.js';

  var newBlock =
    '{\n' +
    '  name: \'' + variant.name + '\',\n' +
    '  html: `' + (variant.html || '') + '`,\n' +
    '  css:  `' + (variant.css  || '') + '`,\n' +
    '}';

  githubGetFile(filePath)
    .then(function (data) {
      var current = ghDecodeBase64(data.content.replace(/\n/g, ''));
      var updated = _ghvParseAndReplace(current, variant.name, newBlock);
      return githubPutFile(filePath, updated, data.sha, 'SenkoLib: variant ' + variant.name);
    })
    .catch(function () {
      // Arquivo não existe ainda: cria do zero
      var template =
        'SenkoLib.registerVariant(\'' + layout.id + '\', [\n\n' +
        '/*@@@@Senko - ' + variant.name + ' */\n' + newBlock + ',\n\n]);\n';
      return githubPutFile(filePath, template, null, 'SenkoLib: create variants/' + layout.id + '.js');
    })
    .then(function () {
      showToast();
      // Atualiza registro em memória
      var variants = SenkoLib.getVariants(layout.id);
      var existing = variants.find(function (v) { return v.name === variant.name; });
      if (existing) { existing.html = variant.html; existing.css = variant.css; }
      else SenkoLib.registerVariant(layout.id, [variant]);
      if (typeof onSuccess === 'function') onSuccess();
    })
    .catch(function (err) { alert('Erro ao salvar variante: ' + err.message); });
}

/* ── Botão de salvar nova variante ──────────────────────────────────── */

function _ghvInjectNewVarButton() {
  var anchor = document.getElementById('newVarCopyBtn');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn btn-primary';
  btn.style.fontSize = 'var(--font-size-xs)';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var layout = state.currentForVariant;
    if (!layout) return;
    updateNewVarCode();
    var name = (document.getElementById('newVarName') || {}).value || '';
    var html = (document.getElementById('newVarHtml') || {}).value || '';
    var css  = (document.getElementById('newVarCss')  || {}).value || '';
    if (!name || !/^[a-z0-9.\-]+$/.test(name)) { alert('Nome inválido.'); return; }
    _ghvSaveVariant(layout, { name: name, html: html, css: css }, function () {
      closeNewVariantModal();
      renderVariantBlocks();
    });
  });
  anchor.appendChild(btn);
}

/* ── Botão de salvar variante editada ───────────────────────────────── */

function _ghvInjectEditVarButton() {
  var anchor = document.getElementById('saveVarToFileBtn');
  if (!anchor || anchor.querySelector('button')) return;

  var btn = document.createElement('button');
  btn.className   = 'btn btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    if (!state.currentEditVariant) return;
    var layout  = state.currentEditVariant.layout;
    var name    = (document.getElementById('editVarName') || {}).value || '';
    var html    = (document.getElementById('editVarHtml') || {}).value || '';
    var css     = (document.getElementById('editVarCss')  || {}).value || '';
    if (!name) return;
    _ghvSaveVariant(layout, { name: name, html: html, css: css }, function () {
      closeEditVariantModal();
      renderVariantBlocks();
    });
  });
  anchor.appendChild(btn);

  // Exibir botão de excluir no modal de editar
  var deleteBtn = document.getElementById('editVarDeleteBtn');
  if (deleteBtn) deleteBtn.style.display = '';
  if (deleteBtn) deleteBtn.addEventListener('click', function () {
    if (!state.currentEditVariant) return;
    ghvOpenDeleteModal(
      state.currentEditVariant.layout.id,
      state.currentEditVariant.variant.name
    );
  });
}

/* ── Botão de excluir em cards de variante ──────────────────────────── */

function _ghvInjectDeleteVarButton() {
  // Exibe botões .btn-delete-variant-card quando módulo está ativo
  document.querySelectorAll('.btn-delete-variant-card').forEach(function (btn) {
    btn.style.display = '';
  });
}

/* ── Modal de confirmação de exclusão ───────────────────────────────── */

function ghvOpenDeleteModal(parentId, variantName) {
  colOpenConfirm({
    title:     'Excluir variante',
    body:      'Tem certeza que deseja excluir "' + variantName + '"? Esta ação não pode ser desfeita.',
    labelOk:   'Excluir',
    danger:    true,
    onConfirm: function () { _ghvDeleteVariant(parentId, variantName); },
  });
}

function _ghvDeleteVariant(layoutId, variantName) {
  if (!ghEnsureToken()) return;
  var filePath = 'variants/' + layoutId + '.js';

  githubGetFile(filePath)
    .then(function (data) {
      var current = ghDecodeBase64(data.content.replace(/\n/g, ''));
      var updated = _ghvRemoveVariant(current, variantName);
      return githubPutFile(filePath, updated, data.sha, 'SenkoLib: delete variant ' + variantName);
    })
    .then(function () {
      showToast();
      // Remove da memória
      var variants = SenkoLib.getVariants(layoutId);
      var idx = variants.findIndex(function (v) { return v.name === variantName; });
      if (idx !== -1) variants.splice(idx, 1);
      closeEditVariantModal();
      renderVariantBlocks();
    })
    .catch(function (err) { alert('Erro ao excluir: ' + err.message); });
}
