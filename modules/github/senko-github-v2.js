/*
 * Senko GitHub v2
 * Responsabilidade: configuracao, token, API de contents e salvar layouts.
 * Dependencias: core/script.js.
 * Expoe: githubGetFile/githubPutFile/githubDeleteFile e helpers gh*.
 */
(function (global) {
  var _ghSaving = false;
  var _layoutFiles = ['layouts/layouts001.js'];
  var _pollTimer = null;

  function $(id) {
    return document.getElementById(id);
  }

  function ghEncodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function ghDecodeBase64(b64) {
    return decodeURIComponent(escape(atob(String(b64 || '').replace(/\n/g, ''))));
  }

  function ghGetToken() {
    return localStorage.getItem('senkolib_github_token') || '';
  }

  function ghSetToken(token) {
    if (token) localStorage.setItem('senkolib_github_token', token);
    else localStorage.removeItem('senkolib_github_token');
    ghUpdateLockButton();
  }

  function ghDetectConfig() {
    var host = location.hostname;
    var path = location.pathname.replace(/^\/+/, '').split('/')[0];
    if (/\.github\.io$/i.test(host) && path) {
      return { owner: host.split('.')[0], repo: path, branch: 'main' };
    }
    return null;
  }

  function ghGetConfig() {
    var detected = ghDetectConfig();
    var saved;
    if (detected) return detected;
    try {
      saved = JSON.parse(localStorage.getItem('senkolib_github_config') || '{}');
    } catch (err) {
      saved = {};
    }
    return {
      owner: saved.owner || '',
      repo: saved.repo || '',
      branch: saved.branch || 'main'
    };
  }

  function ghSetConfig(config) {
    localStorage.setItem('senkolib_github_config', JSON.stringify({
      owner: config.owner || '',
      repo: config.repo || '',
      branch: config.branch || 'main'
    }));
  }

  function ghEnsureToken() {
    var token = ghGetToken();
    if (!token) {
      ghOpenConfigModal();
      global.showToast('Configure o token GitHub.');
      return null;
    }
    return token;
  }

  function ghEnsureConfig() {
    var config = ghGetConfig();
    if (!config.owner || !config.repo) {
      ghOpenConfigModal();
      global.showToast('Configure owner e repo.');
      return null;
    }
    return config;
  }

  function ghApiUrl(path) {
    var config = ghGetConfig();
    return 'https://api.github.com/repos/' + encodeURIComponent(config.owner) + '/' + encodeURIComponent(config.repo) + '/contents/' + path.replace(/^\/+/, '');
  }

  function ghHeaders() {
    var token = ghGetToken();
    var headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (token) headers.Authorization = 'Bearer ' + token;
    return headers;
  }

  function githubGetFile(path) {
    var config = ghEnsureConfig();
    if (!config) return Promise.reject(new Error('GitHub config ausente.'));
    return fetch(ghApiUrl(path) + '?ref=' + encodeURIComponent(config.branch || 'main'), {
      method: 'GET',
      headers: ghHeaders()
    }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('GET ' + path + ' falhou (' + res.status + ')');
      return res.json();
    });
  }

  function githubPutFile(path, content, sha, message) {
    var config = ghEnsureConfig();
    var token = ghEnsureToken();
    var body;
    if (!config || !token) return Promise.reject(new Error('GitHub nao configurado.'));
    body = {
      message: message || 'Update ' + path,
      content: ghEncodeBase64(content),
      branch: config.branch || 'main'
    };
    if (sha) body.sha = sha;
    return fetch(ghApiUrl(path), {
      method: 'PUT',
      headers: ghHeaders(),
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (txt) {
          throw new Error('PUT ' + path + ' falhou (' + res.status + '): ' + txt);
        });
      }
      return res.json();
    });
  }

  function githubDeleteFile(path, sha, message) {
    var config = ghEnsureConfig();
    var token = ghEnsureToken();
    if (!config || !token) return Promise.reject(new Error('GitHub nao configurado.'));
    return fetch(ghApiUrl(path), {
      method: 'DELETE',
      headers: ghHeaders(),
      body: JSON.stringify({
        message: message || 'Delete ' + path,
        sha: sha,
        branch: config.branch || 'main'
      })
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (txt) {
          throw new Error('DELETE ' + path + ' falhou (' + res.status + '): ' + txt);
        });
      }
      return res.json();
    });
  }

  function ghFindObjectEnd(content, braceStart) {
    var depth = 0;
    var quote = null;
    var escaped = false;
    var i;
    var ch;
    for (i = braceStart; i < content.length; i += 1) {
      ch = content.charAt(i);
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          quote = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
      } else if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0) return i + 1;
      }
    }
    return -1;
  }

  function ghFindMarkedBlock(content, id) {
    var marker = '/*@@@@Senko - ' + id + ' */';
    var start = content.indexOf(marker);
    var braceStart;
    var objectEnd;
    var end;
    var hasComma = false;
    if (start < 0) return null;
    braceStart = content.indexOf('{', start + marker.length);
    if (braceStart < 0) return null;
    objectEnd = ghFindObjectEnd(content, braceStart);
    if (objectEnd < 0) return null;
    end = objectEnd;
    while (/\s/.test(content.charAt(end))) end += 1;
    if (content.charAt(end) === ',') {
      hasComma = true;
      end += 1;
    }
    return { start: start, end: end, objectEnd: objectEnd, hasComma: hasComma };
  }

  function ghReplaceOrAppendBlock(content, id, block) {
    var found = ghFindMarkedBlock(content, id);
    var insertAt;
    var before;
    var needsComma;
    if (found) {
      return content.slice(0, found.start) + block + (found.hasComma ? ',' : '') + content.slice(found.end);
    }
    insertAt = content.lastIndexOf('\n]);');
    if (insertAt < 0) insertAt = content.lastIndexOf(']);');
    if (insertAt < 0) return content + '\n' + block + '\n';
    before = content.slice(0, insertAt).replace(/\s+$/, '');
    needsComma = before.lastIndexOf('{') > before.lastIndexOf('[') && !/,\s*$/.test(before);
    return before + (needsComma ? ',\n' : '\n') + block + '\n' + content.slice(insertAt);
  }

  function ghRemoveMarkedBlock(content, id) {
    var found = ghFindMarkedBlock(content, id);
    var before;
    var after;
    if (!found) return content;
    before = content.slice(0, found.start).replace(/[ \t]*$/, '');
    after = content.slice(found.end).replace(/^\s*,?/, '\n');
    if (/,\s*$/.test(before) && /^\s*\]/.test(after)) {
      before = before.replace(/,\s*$/, '\n');
    }
    return before + after;
  }

  function ghSetSaving(isSaving) {
    var dot = $('ghStatusDot');
    _ghSaving = isSaving;
    if (dot) dot.classList.toggle('saving', !!isSaving);
  }

  function ghSaveEditedLayout() {
    var data = global.getCurrentEditLayoutData ? global.getCurrentEditLayoutData() : null;
    var path = 'layouts/layouts001.js';
    if (!data || !data.id) return;
    if (_ghSaving) return global.showToast('Salvamento em andamento.');
    ghSetSaving(true);
    githubGetFile(path).then(function (file) {
      var content = file ? ghDecodeBase64(file.content) : 'SenkoLib.register([\n]);\n';
      var next = ghReplaceOrAppendBlock(content, data.id, global.formatLayoutBlock(data));
      return githubPutFile(path, next, file && file.sha, 'Update layout ' + data.id);
    }).then(function () {
      if (global.state.currentEdit) {
        global.state.currentEdit.name = data.name;
        global.state.currentEdit.tags = data.tags;
        global.state.currentEdit.html = data.html;
        global.state.currentEdit.css = data.css;
      }
      global.showToast('✓ Layout salvo no GitHub!');
      if (global.renderGrid) global.renderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao salvar layout.');
    }).then(function () {
      ghSetSaving(false);
    });
  }

  function ghSaveNewLayout() {
    var data = global.getAddLayoutFormData ? global.getAddLayoutFormData() : null;
    var select = $('ghAddLayoutFileSelect');
    var path = select ? select.value : 'layouts/layouts001.js';
    if (!data) return;
    if (_ghSaving) return global.showToast('Salvamento em andamento.');
    ghSetSaving(true);
    githubGetFile(path).then(function (file) {
      var content = file ? ghDecodeBase64(file.content) : '/*\n * Pacote de layouts\n */\nSenkoLib.register([\n]);\n';
      var next = ghReplaceOrAppendBlock(content, data.id, global.formatLayoutBlock(data));
      return githubPutFile(path, next, file && file.sha, 'Add layout ' + data.id);
    }).then(function () {
      SenkoLib.register([data]);
      global.showToast('✓ Layout criado no GitHub!');
      if (global.closeAddModal) global.closeAddModal();
      if (global.renderGrid) global.renderGrid();
    }).catch(function (err) {
      console.error(err);
      global.showToast('Falha ao criar layout.');
    }).then(function () {
      ghSetSaving(false);
    });
  }

  function ghCopyGeneratedLayout() {
    var data = global.getAddLayoutFormData ? global.getAddLayoutFormData() : null;
    if (!data) return;
    global.copyToClipboard(global.formatLayoutBlock(data), this, '✓ Código copiado!');
  }

  function ghOpenConfigModal() {
    var overlay = $('ghConfigOverlay');
    var config = ghGetConfig();
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ghConfigOverlay';
      overlay.className = 'modal-overlay hidden';
      overlay.innerHTML =
        '<div class="modal gh-config-modal" role="dialog" aria-modal="true">' +
          '<div class="modal-header"><div><div class="modal-category">GitHub</div><h2 class="modal-title">Configuração</h2></div><button class="modal-close" id="ghConfigCloseBtn" type="button">×</button></div>' +
          '<div class="modal-body">' +
            '<label class="field-group">Owner <input id="ghOwnerInput" type="text"></label>' +
            '<label class="field-group">Repo <input id="ghRepoInput" type="text"></label>' +
            '<label class="field-group">Branch <input id="ghBranchInput" type="text"></label>' +
            '<label class="field-group">Token <input id="ghTokenInput" type="password" autocomplete="off"></label>' +
            '<div class="modal-footer"><button class="btn btn-ghost" id="ghClearTokenBtn" type="button">Limpar token</button><button class="btn btn-primary" id="ghSaveConfigBtn" type="button">Salvar</button></div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      $('ghConfigCloseBtn').addEventListener('click', ghCloseConfigModal);
      $('ghClearTokenBtn').addEventListener('click', function () {
        $('ghTokenInput').value = '';
        ghSetToken('');
      });
      $('ghSaveConfigBtn').addEventListener('click', function () {
        ghSetConfig({
          owner: $('ghOwnerInput').value.trim(),
          repo: $('ghRepoInput').value.trim(),
          branch: $('ghBranchInput').value.trim() || 'main'
        });
        ghSetToken($('ghTokenInput').value.trim());
        ghCloseConfigModal();
        global.showToast('✓ Configuração salva!');
      });
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) ghCloseConfigModal();
      });
    }
    $('ghOwnerInput').value = config.owner || '';
    $('ghRepoInput').value = config.repo || '';
    $('ghBranchInput').value = config.branch || 'main';
    $('ghTokenInput').value = ghGetToken();
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function ghCloseConfigModal() {
    var overlay = $('ghConfigOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    if (!document.querySelector('.modal-overlay:not(.hidden)')) document.body.style.overflow = '';
  }

  function ghUpdateLockButton() {
    var btn = $('ghLockBtn');
    if (!btn) return;
    btn.textContent = ghGetToken() ? '🔓' : '🔒';
    btn.title = ghGetToken() ? 'Token configurado' : 'Configurar token';
  }

  function ghInjectHeaderButtons() {
    var controls = document.querySelector('.header-controls');
    var lock;
    var gear;
    var dot;
    if (!controls || $('ghLockBtn')) return;
    dot = document.createElement('span');
    dot.id = 'ghStatusDot';
    dot.className = 'gh-status-dot';
    dot.title = 'Status de deploy';
    lock = document.createElement('button');
    lock.id = 'ghLockBtn';
    lock.className = 'theme-toggle';
    lock.type = 'button';
    gear = document.createElement('button');
    gear.id = 'ghConfigBtn';
    gear.className = 'theme-toggle';
    gear.type = 'button';
    gear.textContent = '⚙';
    gear.title = 'Configurar GitHub';
    controls.appendChild(dot);
    controls.appendChild(lock);
    controls.appendChild(gear);
    lock.addEventListener('click', ghOpenConfigModal);
    gear.addEventListener('click', ghOpenConfigModal);
    ghUpdateLockButton();
  }

  function ghInjectLayoutButtons() {
    var editAnchor = $('saveToFileBtn');
    var addAnchor = $('copyGeneratedBtn');
    var btn;
    var copy;
    var select;
    var i;
    if (editAnchor && !editAnchor.querySelector('[data-gh-save-layout]')) {
      btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.type = 'button';
      btn.setAttribute('data-gh-save-layout', '1');
      btn.textContent = 'GitHub';
      btn.addEventListener('click', ghSaveEditedLayout);
      editAnchor.appendChild(btn);
    }
    if (addAnchor && !addAnchor.querySelector('[data-gh-add-layout]')) {
      select = document.createElement('select');
      select.id = 'ghAddLayoutFileSelect';
      for (i = 0; i < _layoutFiles.length; i += 1) {
        select.appendChild(new Option(_layoutFiles[i], _layoutFiles[i]));
      }
      copy = document.createElement('button');
      copy.className = 'btn btn-ghost';
      copy.type = 'button';
      copy.textContent = 'Copiar';
      copy.addEventListener('click', ghCopyGeneratedLayout);
      btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.type = 'button';
      btn.setAttribute('data-gh-add-layout', '1');
      btn.textContent = 'GitHub';
      btn.addEventListener('click', ghSaveNewLayout);
      addAnchor.appendChild(select);
      addAnchor.appendChild(copy);
      addAnchor.appendChild(btn);
    }
  }

  function ghPollDeployStatus() {
    if (!ghGetConfig().owner || !ghGetConfig().repo) return;
    githubGetFile('deploy-status.json').then(function (file) {
      var data;
      var dot = $('ghStatusDot');
      if (!file || !dot) return;
      data = JSON.parse(ghDecodeBase64(file.content));
      dot.classList.toggle('saving', !!data.saving);
    }).catch(function () {});
  }

  function init() {
    ghInjectHeaderButtons();
    ghInjectLayoutButtons();
    if (_pollTimer) clearInterval(_pollTimer);
    _pollTimer = setInterval(ghPollDeployStatus, 15000);
  }

  global.ghEncodeBase64 = ghEncodeBase64;
  global.ghDecodeBase64 = ghDecodeBase64;
  global.ghGetToken = ghGetToken;
  global.ghSetToken = ghSetToken;
  global.ghEnsureToken = ghEnsureToken;
  global.ghGetConfig = ghGetConfig;
  global.githubGetFile = githubGetFile;
  global.githubPutFile = githubPutFile;
  global.githubDeleteFile = githubDeleteFile;
  global.ghFindMarkedBlock = ghFindMarkedBlock;
  global.ghReplaceOrAppendBlock = ghReplaceOrAppendBlock;
  global.ghRemoveMarkedBlock = ghRemoveMarkedBlock;
  global.ghInjectLayoutButtons = ghInjectLayoutButtons;

  document.addEventListener('DOMContentLoaded', init);
}(window));
