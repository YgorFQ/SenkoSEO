/* ============================================================================
   senko-github-v2.js - GitHub API para layouts

   RESPONSABILIDADE:
     Configura owner/repo/token, faz GET/PUT/DELETE no endpoint contents e
     salva layouts novos/editados usando marcadores @@@@Senko.

   EXPOE (globais):
     ghGetToken(), ghSetToken(token), ghEnsureToken()
     githubGetFile(path), githubPutFile(path, content, sha, message)
     githubDeleteFile(path, sha, message), ghUpsertMarkedBlock()
     senkoGithubInjectButtons()

   DEPENDENCIAS:
     utils.js, modal-edit.js, modal-add.js.

   ORDEM DE CARREGAMENTO:
     Depois do bootstrap para injetar botoes nos modais ja criados.
============================================================================ */

var _ghSaving = false;

function ghEncodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function ghDecodeBase64(b64) {
  return decodeURIComponent(escape(atob(String(b64 || '').replace(/\n/g, ''))));
}

function ghGetStoredConfig() {
  try {
    return JSON.parse(localStorage.getItem('senkolib_github_config') || '{}');
  } catch (error) {
    return {};
  }
}

function ghDetectConfig() {
  var host = window.location.hostname;
  var parts;
  var stored = ghGetStoredConfig();
  if (host.indexOf('.github.io') !== -1) {
    parts = window.location.pathname.split('/').filter(function (part) { return !!part; });
    return {
      owner: host.replace('.github.io', ''),
      repo: parts[0] || host.replace('.github.io', '') + '.github.io'
    };
  }
  return {
    owner: stored.owner || '',
    repo: stored.repo || ''
  };
}

function ghSaveConfig(owner, repo) {
  localStorage.setItem('senkolib_github_config', JSON.stringify({ owner: owner, repo: repo }));
}

function ghGetToken() {
  return localStorage.getItem('senkolib_github_token') || '';
}

function ghSetToken(token) {
  if (token) localStorage.setItem('senkolib_github_token', token);
  else localStorage.removeItem('senkolib_github_token');
  senkoGithubInjectButtons();
}

function ghEnsureToken() {
  if (ghGetToken()) return true;
  ghOpenConfigModal();
  showToast('Configure o token do GitHub');
  return false;
}

function ghGetConfig() {
  return ghDetectConfig();
}

function ghApiUrl(path) {
  var config = ghGetConfig();
  if (!config.owner || !config.repo) return '';
  return 'https://api.github.com/repos/' + encodeURIComponent(config.owner) + '/' + encodeURIComponent(config.repo) + '/contents/' + path.replace(/^\/+/, '');
}

function ghHeaders() {
  var token = ghGetToken();
  var headers = {
    Accept: 'application/vnd.github+json'
  };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

function ghJsonHeaders() {
  var headers = ghHeaders();
  headers['Content-Type'] = 'application/json';
  return headers;
}

function githubGetFile(path) {
  var url = ghApiUrl(path);
  if (!url) return Promise.reject(new Error('Configure owner/repo do GitHub.'));
  return fetch(url, { headers: ghHeaders(), cache: 'no-store' }).then(function (res) {
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('GitHub GET falhou: ' + res.status);
    return res.json();
  });
}

function githubPutFile(path, content, sha, message) {
  var url = ghApiUrl(path);
  var body = {
    message: message,
    content: ghEncodeBase64(content)
  };
  if (!url) return Promise.reject(new Error('Configure owner/repo do GitHub.'));
  if (sha) body.sha = sha;
  return fetch(url, {
    method: 'PUT',
    headers: ghJsonHeaders(),
    body: JSON.stringify(body)
  }).then(function (res) {
    if (!res.ok) throw new Error('GitHub PUT falhou: ' + res.status);
    return res.json();
  });
}

function githubDeleteFile(path, sha, message) {
  var url = ghApiUrl(path);
  if (!url) return Promise.reject(new Error('Configure owner/repo do GitHub.'));
  return fetch(url, {
    method: 'DELETE',
    headers: ghJsonHeaders(),
    body: JSON.stringify({ message: message, sha: sha })
  }).then(function (res) {
    if (!res.ok) throw new Error('GitHub DELETE falhou: ' + res.status);
    return res.json();
  });
}

function ghArrayWrapper(kind, key) {
  if (kind === 'variant') return {
    start: "SenkoLib.registerVariant('" + key + "', [\n",
    end: '\n]);\n'
  };
  return {
    start: 'SenkoLib.register([\n',
    end: '\n]);\n'
  };
}

function ghUpsertMarkedBlock(source, markerName, objectCode, kind, key) {
  var wrapper = ghArrayWrapper(kind, key);
  var marker = '/*@@@@Senko - ' + markerName + ' */';
  var text = source || (wrapper.start + wrapper.end);
  var start = text.indexOf(marker);
  var close = text.lastIndexOf(']);');
  var next;
  var insert;
  if (close === -1) text = wrapper.start + wrapper.end;
  close = text.lastIndexOf(']);');
  if (start !== -1) {
    next = text.indexOf('/*@@@@Senko - ', start + marker.length);
    if (next === -1 || next > close) next = close;
    insert = objectCode + (next === close ? '\n' : ',\n  ');
    return text.slice(0, start) + insert + text.slice(next);
  }
  insert = text.slice(0, close).replace(/\s*$/, '');
  if (insert.indexOf('/*@@@@Senko - ') !== -1) insert += ',';
  insert += '\n  ' + objectCode + '\n';
  return insert + text.slice(close);
}

function ghRemoveMarkedBlock(source, markerName) {
  var marker = '/*@@@@Senko - ' + markerName + ' */';
  var start = source.indexOf(marker);
  var close = source.lastIndexOf(']);');
  var next;
  var before;
  var after;
  if (start === -1 || close === -1) return source;
  next = source.indexOf('/*@@@@Senko - ', start + marker.length);
  if (next === -1 || next > close) next = close;
  before = source.slice(0, start).replace(/,\s*$/, '');
  after = source.slice(next);
  if (after.indexOf('/*@@@@Senko - ') === 0 && !/,\s*$/.test(before)) before += ',\n  ';
  return before + after;
}

function ghSetSaving(saving) {
  var dot = document.getElementById('ghDeployDot');
  _ghSaving = !!saving;
  if (dot) dot.classList.toggle('saving', _ghSaving);
}

function ghOpenConfigModal() {
  var config = ghGetConfig();
  var overlay = document.getElementById('ghConfigOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.id = 'ghConfigOverlay';
    overlay.innerHTML =
      '<div class="modal col-form-modal" role="dialog" aria-modal="true">' +
        '<div class="modal-header"><div><div class="modal-category">GitHub</div><h2 class="modal-title">Configuracao</h2></div><button class="modal-close" id="ghConfigClose" type="button">&times;</button></div>' +
        '<div class="modal-body">' +
          '<div class="field-row"><div class="field-group"><label for="ghOwner">Owner</label><input id="ghOwner" type="text"></div><div class="field-group"><label for="ghRepo">Repo</label><input id="ghRepo" type="text"></div></div>' +
          '<div class="field-group"><label for="ghToken">Token</label><input id="ghToken" type="password" placeholder="github_pat_..."><div class="field-desc">O token fica apenas no localStorage deste navegador.</div></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-ghost" id="ghConfigCancel" type="button">Cancelar</button><button class="btn btn-primary" id="ghConfigSave" type="button">Salvar</button></div>' +
      '</div>';
    document.body.appendChild(overlay);
    document.getElementById('ghConfigClose').addEventListener('click', ghCloseConfigModal);
    document.getElementById('ghConfigCancel').addEventListener('click', ghCloseConfigModal);
    document.getElementById('ghConfigSave').addEventListener('click', function () {
      ghSaveConfig(document.getElementById('ghOwner').value.trim(), document.getElementById('ghRepo').value.trim());
      ghSetToken(document.getElementById('ghToken').value.trim());
      ghCloseConfigModal();
      showToast('GitHub configurado');
    });
    overlayClick('ghConfigOverlay', ghCloseConfigModal);
  }
  document.getElementById('ghOwner').value = config.owner || '';
  document.getElementById('ghRepo').value = config.repo || '';
  document.getElementById('ghToken').value = ghGetToken();
  overlay.classList.remove('hidden');
  setBodyLocked(true);
}

function ghCloseConfigModal() {
  document.getElementById('ghConfigOverlay').classList.add('hidden');
  setBodyLocked(false);
}

function ghInjectHeaderButtons() {
  var wrap = document.getElementById('githubHeaderActions');
  var lock;
  var gear;
  var dot;
  if (!wrap || document.getElementById('ghTokenBtn')) return;
  lock = document.createElement('button');
  gear = document.createElement('button');
  dot = document.createElement('span');
  lock.id = 'ghTokenBtn';
  gear.id = 'ghConfigBtn';
  dot.id = 'ghDeployDot';
  lock.type = 'button';
  gear.type = 'button';
  lock.className = 'github-icon-btn';
  gear.className = 'github-icon-btn';
  dot.className = 'deploy-dot';
  lock.title = 'Token GitHub';
  gear.title = 'Configurar GitHub';
  lock.addEventListener('click', ghOpenConfigModal);
  gear.addEventListener('click', ghOpenConfigModal);
  wrap.appendChild(dot);
  wrap.appendChild(lock);
  wrap.appendChild(gear);
}

function ghRefreshHeaderButtons() {
  var tokenBtn = document.getElementById('ghTokenBtn');
  var gearBtn = document.getElementById('ghConfigBtn');
  if (tokenBtn) tokenBtn.innerHTML = ghGetToken() ? iconSvg('unlock') : iconSvg('lock');
  if (gearBtn) gearBtn.innerHTML = iconSvg('gear');
}

function ghInjectEditSaveButton() {
  var anchor = document.getElementById('saveToFileBtn');
  var btn;
  if (!anchor || document.getElementById('ghSaveLayoutBtn')) return;
  btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Salvar layout no GitHub');
  btn.id = 'ghSaveLayoutBtn';
  btn.addEventListener('click', ghSaveEditedLayout);
  anchor.appendChild(btn);
}

function ghInjectAddSaveButton() {
  var anchor = document.getElementById('copyGeneratedBtn');
  var select;
  var btn;
  if (!anchor || document.getElementById('ghAddLayoutBtn')) return;
  select = document.createElement('select');
  btn = makeButton('btn btn-primary', '<span>GitHub</span>', 'Adicionar layout no GitHub');
  select.id = 'ghLayoutFileSelect';
  select.className = 'btn btn-ghost';
  select.innerHTML = '<option value="layouts/layouts001.js">layouts001.js</option>';
  btn.id = 'ghAddLayoutBtn';
  btn.addEventListener('click', ghSaveNewLayout);
  anchor.appendChild(select);
  anchor.appendChild(btn);
}

function senkoGithubInjectButtons() {
  ghInjectHeaderButtons();
  ghRefreshHeaderButtons();
  ghInjectEditSaveButton();
  ghInjectAddSaveButton();
}

function ghSaveLayoutToPath(path, data, isNew) {
  if (_ghSaving) {
    showToast('Aguarde o save atual terminar');
    return;
  }
  if (!ghEnsureToken()) return;
  ghSetSaving(true);
  githubGetFile(path).then(function (file) {
    var current = file ? ghDecodeBase64(file.content) : '';
    var updated = ghUpsertMarkedBlock(current, data.id, formatLayoutObject(data), 'layout');
    return githubPutFile(path, updated, file ? file.sha : null, (isNew ? 'Adiciona ' : 'Atualiza ') + data.id);
  }).then(function () {
    showToast('Salvo no GitHub');
    if (isNew) {
      SenkoLib.register([data]);
      renderGrid();
    } else if (state.currentEdit) {
      state.currentEdit.name = data.name;
      state.currentEdit.tags = data.tags;
      state.currentEdit.html = data.html;
      state.currentEdit.css = data.css;
      renderGrid();
    }
  }).catch(function (error) {
    showToast(error.message);
  }).then(function () {
    ghSetSaving(false);
  });
}

function ghSaveEditedLayout() {
  var data = getEditFormData();
  if (!data) {
    showToast('Dados invalidos');
    return;
  }
  ghSaveLayoutToPath('layouts/layouts001.js', data, false);
}

function ghSaveNewLayout() {
  var data = getAddFormData();
  var select = document.getElementById('ghLayoutFileSelect');
  if (!data) {
    showToast('ID ou nome invalido');
    return;
  }
  ghSaveLayoutToPath(select ? select.value : 'layouts/layouts001.js', data, true);
}

document.addEventListener('DOMContentLoaded', senkoGithubInjectButtons);
