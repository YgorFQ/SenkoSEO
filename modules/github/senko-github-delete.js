/* ═══════════════════════════════════════════════════════════════════════
   senko-github-delete.js — Exclusão de layouts do GitHub

   RESPONSABILIDADE:
     Injeta botão de excluir no modal de editar layout. Ao confirmar,
     remove o bloco @@@@Senko do arquivo de layouts e commita.

   EXPÕE (globais):
     Nenhuma (autoexecutado no DOMContentLoaded).

   DEPENDÊNCIAS:
     senko-github-v2.js, modal-edit.js, col-modals.js (colOpenConfirm)

   ORDEM DE CARREGAMENTO:
     Após senko-github-variants.js
═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(_ghdInjectDeleteButton, 400);
});

/* ── Injeção do botão de excluir ────────────────────────────────────── */

function _ghdInjectDeleteButton() {
  var headerRight = document.querySelector('#editModal .modal-header-right');
  if (!headerRight || document.getElementById('ghDeleteLayoutBtn')) return;

  var btn = document.createElement('button');
  btn.id        = 'ghDeleteLayoutBtn';
  btn.className = 'btn btn-ghost';
  btn.style.color       = 'var(--red)';
  btn.style.borderColor = 'var(--red)';
  btn.innerHTML =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<polyline points="3 6 5 6 21 6"/>' +
    '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' +
    '<path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> Excluir';
  btn.addEventListener('click', _ghdConfirmDelete);

  // Insere antes do botão de fechar
  var closeBtn = headerRight.querySelector('.modal-close');
  headerRight.insertBefore(btn, closeBtn);
}

/* ── Confirmação e exclusão ─────────────────────────────────────────── */

function _ghdConfirmDelete() {
  if (!state.currentEdit) return;
  var layout = state.currentEdit;

  colOpenConfirm({
    title:     'Excluir layout',
    body:      'Excluir "' + layout.name + '" (ID: ' + layout.id + ') permanentemente do arquivo de layouts? Esta ação não pode ser desfeita.',
    labelOk:   'Excluir',
    danger:    true,
    onConfirm: function () { _ghdDeleteLayout(layout); },
  });
}

function _ghdDeleteLayout(layout) {
  if (!ghEnsureToken()) return;
  var filePath = 'layouts/layouts001.js';

  githubGetFile(filePath)
    .then(function (data) {
      var content = ghDecodeBase64(data.content.replace(/\n/g, ''));
      var sha     = data.sha;

      // Remove bloco do layout pelo marcador @@@@Senko
      var marker = '/*@@@@Senko - ' + layout.id + ' */';
      var start  = content.indexOf(marker);
      if (start === -1) throw new Error('Layout não encontrado no arquivo.');

      var objStart = content.indexOf('{', start + marker.length);
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
      var end = i + 1;
      if (content[end] === ',') end++;

      var updated = (content.slice(0, start) + content.slice(end)).replace(/\n{3,}/g, '\n\n');
      return githubPutFile(filePath, updated, sha, 'SenkoLib: delete ' + layout.id);
    })
    .then(function () {
      showToast();
      closeEditModal();
      // Remove da memória e re-renderiza
      var all = SenkoLib.getAll();
      var idx = all.findIndex(function (l) { return l.id === layout.id; });
      // SenkoLib não tem removeLayout, mas podemos marcar internamente
      // Re-renderiza o grid (o layout removido não aparece mais pois está no arquivo)
      renderGrid();
    })
    .catch(function (err) { alert('Erro ao excluir: ' + err.message); });
}
