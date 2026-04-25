/* ═══════════════════════════════════════════════════════════════════════
   senko-github-v2.js — Integração GitHub para salvar layouts e variantes

   RESPONSABILIDADE:
     Detecta owner/repo pelo hostname do GitHub Pages, gerencia token
     via localStorage, expõe funções de leitura/escrita na API REST v3.
     Injeta botão de cadeado e engrenagem no header. Injeta botão
     "GitHub" nas âncoras dos modais de editar/adicionar layout.
     Implementa deploy status polling com ponto pulsante.

   EXPÕE (globais):
     ghGetToken()               → string
     ghSetToken(token)          → void
     ghEncodeBase64(str)        → string
     ghDecodeBase64(b64)        → string
     githubGetFile(path)        → Promise<{content, sha}>
     githubPutFile(path, content, sha, msg) → Promise
     ghEnsureToken()            → boolean
     ghReadDeployStatus()       → void  (inicia polling)

   DEPENDÊNCIAS:
     utils.js (showToast)

   ORDEM DE CARREGAMENTO:
     Após script.js
═══════════════════════════════════════════════════════════════════════ */

/* ── Configuração automática ────────────────────────────────────────── */

var _ghOwner = '';
var _ghRepo  = '';
var _ghSaving = false; // Race condition lock

// Detecta owner/repo pelo hostname do GitHub Pages
(function () {
  var host = window.location.hostname;
  if (host.endsWith('.github.io')) {
    _ghOwner = host.replace('.github.io', '');
    var parts = window.location.pathname.split('/').filter(Boolean);
    _ghRepo  = parts[0] || '';
  }
  // Fallback: lê do localStorage (útil em localhost)
  if (!_ghOwner || !_ghRepo) {
    try {
      var cfg = JSON.parse(localStorage.getItem('senkolib_github_config') || '{}');
      _ghOwner = cfg.owner || _ghOwner;
      _ghRepo  = cfg.repo  || _ghRepo;
    } catch (e) {}
  }
}());

/* ── Token ──────────────────────────────────────────────────────────── */

function ghGetToken() {
  return localStorage.getItem('senkolib_github_token') || '';
}

function ghSetToken(token) {
  localStorage.setItem('senkolib_github_token', token.trim());
  _ghUpdateLockBtn();
}

function ghEnsureToken() {
  if (ghGetToken()) return true;
  _ghOpenConfigModal();
  return false;
}

/* ── Encoding UTF-8 seguro para Base64 ──────────────────────────────── */

function ghEncodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function ghDecodeBase64(b64) {
  try { return decodeURIComponent(escape(atob(b64))); }
  catch (e) { return atob(b64); }
}

/* ── API base ───────────────────────────────────────────────────────── */

// GET de um arquivo no repositório — retorna { content (base64), sha }
function githubGetFile(path) {
  var url = 'https://api.github.com/repos/' + _ghOwner + '/' + _ghRepo + '/contents/' + path;
  return fetch(url, {
    headers: {
      'Authorization': 'token ' + ghGetToken(),
      'Accept': 'application/vnd.github.v3+json',
    },
  }).then(function (res) {
    if (!res.ok) throw new Error('GET falhou: ' + res.status);
    return res.json();
  });
}

// PUT (criar ou atualizar) um arquivo — sha é obrigatório para update
function githubPutFile(path, content, sha, message) {
  var url  = 'https://api.github.com/repos/' + _ghOwner + '/' + _ghRepo + '/contents/' + path;
  var body = { message: message || 'SenkoLib: update ' + path, content: ghEncodeBase64(content) };
  if (sha) body.sha = sha;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + ghGetToken(),
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(function (res) {
    if (!res.ok) return res.json().then(function (d) { throw new Error(d.message || 'PUT falhou'); });
    return res.json();
  });
}

/* ── Parser @@@@Senko ───────────────────────────────────────────────── */

// Encontra e substitui o bloco de um layout no arquivo JS
// Respeita template literals (backticks) para não confundir delimitadores
function ghParseAndReplace(fileContent, id, newBlock) {
  var marker = '/*@@@@Senko - ' + id + ' */';
  var start  = fileContent.indexOf(marker);
  if (start === -1) {
    // Não encontrado: appenda antes do ]);  final
    var insertBefore = fileContent.lastIndexOf(']);');
    if (insertBefore === -1) return fileContent + '\n' + marker + '\n' + newBlock + ',\n';
    return fileContent.slice(0, insertBefore) + '\n' + marker + '\n' + newBlock + ',\n\n' + fileContent.slice(insertBefore);
  }

  // Localiza o objeto {…} após o marcador, respeitando template literals
  var objStart = fileContent.indexOf('{', start + marker.length);
  if (objStart === -1) return fileContent;

  var depth   = 0;
  var inBt    = false; // dentro de backtick
  var i       = objStart;

  while (i < fileContent.length) {
    var ch = fileContent[i];
    if (ch === '`' && !inBt)        { inBt = true;  i++; continue; }
    if (ch === '`' &&  inBt)        { inBt = false; i++; continue; }
    if (ch === '\\' && inBt)        { i += 2; continue; } // escape dentro de BT
    if (!inBt) {
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) break; }
    }
    i++;
  }

  var objEnd = i + 1; // inclui o '}'
  return fileContent.slice(0, start) + marker + '\n' + newBlock + fileContent.slice(objEnd);
}

/* ── Salvar layout ──────────────────────────────────────────────────── */

// Lê o arquivo de layouts, substitui/adiciona o bloco e commita
function ghSaveLayout(layout, onSuccess) {
  if (_ghSaving) { alert('Aguarde, salvamento em andamento…'); return; }
  if (!ghEnsureToken()) return;
  _ghSaving = true;

  var filePath = 'layouts/layouts001.js';

  githubGetFile(filePath)
    .then(function (data) {
      var currentContent = ghDecodeBase64(data.content.replace(/\n/g, ''));
      var sha = data.sha;

      var newBlock =
        '{\n' +
        '  id:   \'' + layout.id + '\',\n' +
        '  name: \'' + layout.name.replace(/'/g, "\\'") + '\',\n' +
        '  tags: ' + JSON.stringify(layout.tags || []) + ',\n' +
        '  html: `' + (layout.html || '') + '`,\n' +
        '  css:  `' + (layout.css  || '') + '`,\n' +
        '}';

      var newContent = ghParseAndReplace(currentContent, layout.id, newBlock);
      return githubPutFile(filePath, newContent, sha, 'SenkoLib: save ' + layout.id);
    })
    .then(function () {
      _ghSaving = false;
      showToast();
      if (typeof onSuccess === 'function') onSuccess();
      _ghWriteDeployStatus(true);
      setTimeout(function () { _ghWriteDeployStatus(false); }, 3000);
    })
    .catch(function (err) {
      _ghSaving = false;
      alert('Erro ao salvar: ' + err.message);
    });
}

/* ── Deploy Status ──────────────────────────────────────────────────── */

var _ghDeployPollTimer;

// Escreve o status de deploy no arquivo JSON
function _ghWriteDeployStatus(saving) {
  if (!ghGetToken()) return;
  var content = JSON.stringify({ saving: saving, ts: Date.now() });
  githubGetFile('deploy-status.json')
    .then(function (data) {
      return githubPutFile('deploy-status.json', content, data.sha, 'deploy status');
    })
    .catch(function () {
      return githubPutFile('deploy-status.json', content, null, 'deploy status init');
    });
}

// Polling do arquivo de deploy status — exibe dot pulsante no header
function ghReadDeployStatus() {
  clearInterval(_ghDeployPollTimer);
  _ghDeployPollTimer = setInterval(function () {
    githubGetFile('deploy-status.json')
      .then(function (data) {
        var raw = ghDecodeBase64(data.content.replace(/\n/g, ''));
        var obj;
        try { obj = JSON.parse(raw); } catch (e) { return; }
        var dot = document.getElementById('deployDot');
        if (!dot) {
          dot = document.createElement('span');
          dot.id = 'deployDot';
          dot.className = 'deploy-dot';
          dot.title = 'Alguém está salvando…';
          dot.style.display = 'none';
          var headerRight = document.querySelector('.header-controls');
          if (headerRight) headerRight.prepend(dot);
        }
        dot.style.display = obj.saving ? 'inline-block' : 'none';
      })
      .catch(function () {});
  }, 8000);
}

/* ── Injeção no header ──────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  _ghInjectHeaderButtons();
  _ghInjectSaveButton();
  _ghInjectAddButton();
  ghReadDeployStatus();
});

function _ghInjectHeaderButtons() {
  var controls = document.querySelector('.header-controls');
  if (!controls) return;

  // Botão cadeado
  var lock = document.createElement('button');
  lock.id        = 'ghLockBtn';
  lock.className = 'btn-lock' + (ghGetToken() ? ' configured' : '');
  lock.title     = ghGetToken() ? 'Token configurado' : 'Configurar token GitHub';
  lock.innerHTML = ghGetToken()
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Conectado'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> Configurar';
  lock.addEventListener('click', _ghOpenConfigModal);
  controls.appendChild(lock);

  // Botão de engrenagem (localhost / config)
  if (!window.location.hostname.endsWith('.github.io')) {
    var gear = document.createElement('button');
    gear.className = 'theme-toggle';
    gear.title     = 'Configurar owner/repo';
    gear.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    gear.addEventListener('click', _ghOpenRepoConfigModal);
    controls.appendChild(gear);
  }
}

function _ghUpdateLockBtn() {
  var btn = document.getElementById('ghLockBtn');
  if (!btn) return;
  var ok = !!ghGetToken();
  btn.className = 'btn-lock' + (ok ? ' configured' : '');
  btn.innerHTML = ok
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Conectado'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> Configurar';
}

/* ── Modal de configuração de token ─────────────────────────────────── */

function _ghOpenConfigModal() {
  var existing = document.getElementById('ghConfigOverlay');
  if (existing) { existing.classList.remove('hidden'); return; }

  var overlay = document.createElement('div');
  overlay.id        = 'ghConfigOverlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML =
    '<div class="modal" style="max-width:440px;">' +
      '<div class="modal-header">' +
        '<div><span class="modal-category">GitHub</span><h2 class="modal-title">Configurar Token</h2></div>' +
        '<button class="modal-close" id="ghCloseConfigBtn">✕</button>' +
      '</div>' +
      '<div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">' +
        '<div class="field-group">' +
          '<label>Personal Access Token</label>' +
          '<input type="password" id="ghTokenInput" placeholder="ghp_…" value="' + ghGetToken() + '">' +
          '<span class="field-desc">Precisará de permissão <strong>repo</strong>. <a href="https://github.com/settings/tokens" target="_blank">Criar token</a></span>' +
        '</div>' +
        '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
          '<button class="btn btn-ghost" id="ghConfigCancelBtn">Cancelar</button>' +
          '<button class="btn btn-primary" id="ghConfigSaveBtn">Salvar</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.querySelector('#ghCloseConfigBtn').addEventListener('click',  function () { overlay.classList.add('hidden'); });
  overlay.querySelector('#ghConfigCancelBtn').addEventListener('click', function () { overlay.classList.add('hidden'); });
  overlay.querySelector('#ghConfigSaveBtn').addEventListener('click', function () {
    ghSetToken(document.getElementById('ghTokenInput').value);
    overlay.classList.add('hidden');
  });
}

function _ghOpenRepoConfigModal() {
  var owner = prompt('Owner (usuário/org GitHub):', _ghOwner);
  if (owner === null) return;
  var repo  = prompt('Repo:', _ghRepo);
  if (repo  === null) return;
  _ghOwner = owner.trim();
  _ghRepo  = repo.trim();
  localStorage.setItem('senkolib_github_config', JSON.stringify({ owner: _ghOwner, repo: _ghRepo }));
  showToast();
}

/* ── Injetar botão de salvar no modal de editar ─────────────────────── */

function _ghInjectSaveButton() {
  var anchor = document.getElementById('saveToFileBtn');
  if (!anchor) return;

  var btn = document.createElement('button');
  btn.className   = 'btn btn-primary';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    if (!state.currentEdit) return;
    var layout = state.currentEdit;
    layout.name = document.getElementById('editLayoutName').value.trim() || layout.name;
    layout.tags = (document.getElementById('editLayoutTags').value || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    layout.html = document.getElementById('editHtmlTextarea').value;
    layout.css  = document.getElementById('editCssTextarea').value;
    ghSaveLayout(layout, function () {
      renderGrid();
      closeEditModal();
    });
  });
  anchor.appendChild(btn);
}

/* ── Injetar select + botão de salvar no modal de adicionar ─────────── */

function _ghInjectAddButton() {
  var anchor = document.getElementById('copyGeneratedBtn');
  if (!anchor) return;

  var btn = document.createElement('button');
  btn.className   = 'btn btn-primary';
  btn.style.fontSize = 'var(--font-size-xs)';
  btn.textContent = 'Salvar no GitHub';
  btn.addEventListener('click', function () {
    var id   = (document.getElementById('newLayoutId')   || {}).value || '';
    var name = (document.getElementById('newLayoutName') || {}).value || '';
    var tags = ((document.getElementById('newLayoutTags') || {}).value || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var html = (document.getElementById('newLayoutHtml') || {}).value || '';
    var css  = (document.getElementById('newLayoutCss')  || {}).value || '';
    if (!id || !name) { alert('Preencha ID e Nome.'); return; }
    ghSaveLayout({ id: id, name: name, tags: tags, html: html, css: css }, function () {
      SenkoLib.register([{ id: id, name: name, tags: tags, html: html, css: css }]);
      renderGrid();
      closeAddModal();
    });
  });
  anchor.appendChild(btn);
}
