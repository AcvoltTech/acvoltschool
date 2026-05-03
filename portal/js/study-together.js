// ============================================
// STUDY TOGETHER — Social panel for study modules
// Maestro HVACR — April 2026
// ============================================
(function() {
  'use strict';

  var SB = window.supabaseClient;
  var _chatChannel = null;
  var _syncChannel = null;
  var _currentModule = null;
  var _messages = [];
  var MAX_MESSAGES = 50;
  var _sessionCode = null;
  var _panelOpen = true;

  function enter(module) {
    SB = window.supabaseClient;
    if (!SB || !module) return;
    _currentModule = module;
    _messages = [];

    // Render the panel
    _renderPanel(module);

    // Chat channel (Realtime broadcast)
    var chatName = 'study-chat-' + module.replace(/[^a-zA-Z0-9]/g, '-');
    _chatChannel = SB.channel(chatName);
    _chatChannel.on('broadcast', { event: 'msg' }, function(payload) {
      if (payload.payload) {
        _messages.push(payload.payload);
        if (_messages.length > MAX_MESSAGES) _messages.shift();
        _renderChatMessages();
      }
    });
    _chatChannel.subscribe();
  }

  function leave() {
    if (_chatChannel) {
      try { SB.removeChannel(_chatChannel); } catch(e) {}
      _chatChannel = null;
    }
    if (_syncChannel) {
      try { SB.removeChannel(_syncChannel); } catch(e) {}
      _syncChannel = null;
    }
    _currentModule = null;
    _messages = [];
    _sessionCode = null;
    // Remove panel
    var panel = document.getElementById('studyTogetherPanel');
    if (panel) panel.remove();
  }

  function _renderPanel(module) {
    // Find the study screen
    var screen = document.getElementById(module);
    if (!screen) return;

    // Remove existing panel
    var existing = document.getElementById('studyTogetherPanel');
    if (existing) existing.remove();

    var panel = document.createElement('div');
    panel.id = 'studyTogetherPanel';
    panel.style.cssText = 'background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.9));border:1px solid rgba(56,189,248,0.15);border-radius:14px;margin:8px 12px;overflow:hidden;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);';

    // Header (collapsible)
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;';
    header.innerHTML = '<div style="display:flex;align-items:center;gap:8px;">' +
      '<span style="font-size:14px;">👥</span>' +
      '<span style="font-size:13px;font-weight:800;color:#7dd3fc;">Estudiar Juntos</span>' +
      '<span id="stOnlineCount" style="font-size:10px;color:#4ade80;font-weight:700;"></span>' +
    '</div>' +
    '<span id="stToggleArrow" style="color:rgba(148,163,184,0.5);font-size:14px;">' + (_panelOpen ? '▼' : '▶') + '</span>';
    header.addEventListener('click', function() {
      _panelOpen = !_panelOpen;
      var body = document.getElementById('stBody');
      if (body) body.style.display = _panelOpen ? 'block' : 'none';
      var arrow = document.getElementById('stToggleArrow');
      if (arrow) arrow.textContent = _panelOpen ? '▼' : '▶';
    });
    panel.appendChild(header);

    // Body
    var body = document.createElement('div');
    body.id = 'stBody';
    body.style.display = _panelOpen ? 'block' : 'none';

    // Tabs
    body.innerHTML = '<div style="display:flex;gap:2px;padding:0 10px 8px;">' +
      '<button class="st-tab active" data-tab="live" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;background:rgba(56,189,248,0.2);color:#7dd3fc;">En Vivo</button>' +
      '<button class="st-tab" data-tab="chat" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.05);color:rgba(148,163,184,0.6);">Chat</button>' +
      '<button class="st-tab" data-tab="sync" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.05);color:rgba(148,163,184,0.6);">Juntos</button>' +
    '</div>' +
    '<div id="stTabContent" style="padding:0 10px 10px;max-height:220px;overflow-y:auto;"></div>';

    panel.appendChild(body);

    // Insert before voice chat or at top of screen content
    var voiceChat = screen.querySelector('#studyVoiceChatPanel, [id*="voiceChat"]');
    var navBar = screen.querySelector('.sticky-nav-bar');
    if (voiceChat) {
      voiceChat.parentNode.insertBefore(panel, voiceChat);
    } else if (navBar && navBar.nextSibling) {
      navBar.parentNode.insertBefore(panel, navBar.nextSibling);
    } else {
      screen.insertBefore(panel, screen.firstChild);
    }

    // Tab handlers
    panel.querySelectorAll('.st-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        panel.querySelectorAll('.st-tab').forEach(function(b) {
          b.style.background = 'rgba(255,255,255,0.05)';
          b.style.color = 'rgba(148,163,184,0.6)';
          b.classList.remove('active');
        });
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#7dd3fc';
        btn.classList.add('active');
        _renderTab(btn.dataset.tab);
      });
    });

    _renderTab('live');
    _updateOnlineCount();
  }

  function _updateOnlineCount() {
    var countEl = document.getElementById('stOnlineCount');
    if (!countEl || !_currentModule || !window.SocialSystem) return;
    var users = SocialSystem.getModuleUsers(_currentModule);
    countEl.textContent = users.length > 0 ? users.length + ' aquí' : '';
  }

  function _renderTab(tab) {
    var container = document.getElementById('stTabContent');
    if (!container) return;

    if (tab === 'live') {
      // Show users in this module
      if (!window.SocialSystem) { container.innerHTML = '<div style="color:rgba(148,163,184,0.5);font-size:12px;padding:8px;">Cargando...</div>'; return; }
      var users = SocialSystem.getModuleUsers(_currentModule);
      if (users.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:16px;"><div style="font-size:28px;margin-bottom:8px;">👀</div><div style="color:rgba(148,163,184,0.5);font-size:12px;">Nadie más está aquí... ¡por ahora!</div></div>';
        return;
      }
      var html = '';
      users.forEach(function(u) {
        var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
        var isMe = u.email === email;
        html += '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;">' +
          SocialSystem.renderAvatar(u.email, u.name, 28) +
          '<span style="font-size:12px;font-weight:600;color:#e2e8f0;">' + (u.name || u.email).split(' ')[0] + (isMe ? ' (Tú)' : '') + '</span>' +
          '<span style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;"></span>' +
        '</div>';
      });
      container.innerHTML = html;
    } else if (tab === 'chat') {
      _renderChatTab(container);
    } else if (tab === 'sync') {
      _renderSyncTab(container);
    }
  }

  function _renderChatTab(container) {
    var html = '<div id="stChatMessages" style="max-height:150px;overflow-y:auto;margin-bottom:8px;">';
    if (_messages.length === 0) {
      html += '<div style="text-align:center;color:rgba(148,163,184,0.4);font-size:11px;padding:12px;">No hay mensajes aún</div>';
    }
    _messages.forEach(function(m) {
      html += _renderChatBubble(m);
    });
    html += '</div>';
    // Input
    html += '<div style="display:flex;gap:6px;">';
    html += '<input id="stChatInput" type="text" placeholder="Escribe un mensaje..." maxlength="200" style="flex:1;padding:8px 10px;border:1px solid rgba(148,163,184,0.15);border-radius:8px;background:rgba(15,23,42,0.6);color:#e2e8f0;font-size:12px;outline:none;" />';
    html += '<button onclick="window._stSendChat()" style="padding:8px 12px;border:none;border-radius:8px;background:rgba(56,189,248,0.2);color:#7dd3fc;font-size:12px;font-weight:700;cursor:pointer;">Enviar</button>';
    html += '</div>';
    // Help button
    html += '<div style="margin-top:8px;text-align:center;"><button onclick="window._stHelpMe()" style="padding:6px 14px;border:none;border-radius:8px;background:rgba(250,204,21,0.15);color:#fbbf24;font-size:11px;font-weight:700;cursor:pointer;">🙌 Me ayudó (+50 XP)</button></div>';
    container.innerHTML = html;

    // Enter to send
    var input = document.getElementById('stChatInput');
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); window._stSendChat(); }
      });
    }
    // Scroll to bottom
    var msgs = document.getElementById('stChatMessages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function _renderChatMessages() {
    var msgs = document.getElementById('stChatMessages');
    if (!msgs) return;
    if (_messages.length === 0) {
      msgs.innerHTML = '<div style="text-align:center;color:rgba(148,163,184,0.4);font-size:11px;padding:12px;">No hay mensajes aún</div>';
      return;
    }
    var html = '';
    _messages.forEach(function(m) { html += _renderChatBubble(m); });
    msgs.innerHTML = html;
    msgs.scrollTop = msgs.scrollHeight;
  }

  function _renderChatBubble(m) {
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    var isMe = m.email === email;
    var align = isMe ? 'flex-end' : 'flex-start';
    var bg = isMe ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)';
    var nameColor = isMe ? '#7dd3fc' : '#a7f3d0';
    return '<div style="display:flex;justify-content:' + align + ';margin-bottom:4px;">' +
      '<div style="max-width:80%;padding:6px 10px;background:' + bg + ';border-radius:10px;">' +
        '<div style="font-size:10px;font-weight:700;color:' + nameColor + ';">' + ((m.name || '').split(' ')[0] || 'Técnico') + '</div>' +
        '<div style="font-size:12px;color:#e2e8f0;word-break:break-word;">' + _escapeHtml(m.text || '') + '</div>' +
      '</div></div>';
  }

  function _escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function _renderSyncTab(container) {
    var html = '<div style="text-align:center;padding:8px;">';
    if (_sessionCode) {
      html += '<div style="font-size:12px;color:rgba(148,163,184,0.6);margin-bottom:8px;">Sesión activa:</div>';
      html += '<div style="font-size:28px;font-weight:900;color:#fbbf24;letter-spacing:4px;margin-bottom:12px;">' + _sessionCode + '</div>';
      html += '<button onclick="window._stLeaveSession()" style="padding:6px 14px;border:none;border-radius:8px;background:rgba(239,68,68,0.2);color:#fca5a5;font-size:11px;font-weight:700;cursor:pointer;">Salir de sesión</button>';
    } else {
      html += '<div style="font-size:12px;color:rgba(148,163,184,0.6);margin-bottom:12px;">Crea o únete a una sesión de estudio sincronizada</div>';
      html += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;">';
      html += '<button onclick="window._stCreateSession()" style="padding:8px 16px;border:none;border-radius:8px;background:rgba(34,197,94,0.2);color:#4ade80;font-size:12px;font-weight:700;cursor:pointer;">Crear sesión</button>';
      html += '</div>';
      html += '<div style="display:flex;gap:6px;justify-content:center;">';
      html += '<input id="stJoinCode" type="text" placeholder="Código de 4 dígitos" maxlength="4" style="width:140px;padding:8px;border:1px solid rgba(148,163,184,0.15);border-radius:8px;background:rgba(15,23,42,0.6);color:#e2e8f0;font-size:14px;text-align:center;letter-spacing:4px;outline:none;" />';
      html += '<button onclick="window._stJoinSession()" style="padding:8px 16px;border:none;border-radius:8px;background:rgba(56,189,248,0.2);color:#7dd3fc;font-size:12px;font-weight:700;cursor:pointer;">Unirse</button>';
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // ── Chat send ───────────────────────────────────────────────
  window._stSendChat = function() {
    var input = document.getElementById('stChatInput');
    if (!input || !input.value.trim() || !_chatChannel) return;
    var text = input.value.trim();
    input.value = '';
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    var name = localStorage.getItem('tecnico_nombre') || 'Técnico';
    var msg = { email: email, name: name, text: text, ts: Date.now() };
    _messages.push(msg);
    if (_messages.length > MAX_MESSAGES) _messages.shift();
    _renderChatMessages();
    _chatChannel.send({ type: 'broadcast', event: 'msg', payload: msg });
  };

  // ── Help button → +50 XP ───────────────────────────────────
  window._stHelpMe = function() {
    if (!SB) return;
    // Show a list of users in this module to select who helped
    var users = window.SocialSystem ? SocialSystem.getModuleUsers(_currentModule) : [];
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    var helpers = users.filter(function(u) { return u.email !== email; });
    if (helpers.length === 0) {
      window.showToast('No hay otros técnicos aquí para dar XP.', 'info');
      return;
    }
    // Simple selection — give XP to the first other user (simplified)
    var helperEmail = helpers[0].email;
    SB.rpc('award_help_xp', { p_helper_email: helperEmail, p_amount: 50 }).then(function() {
      // Send chat message
      if (_chatChannel) {
        var name = localStorage.getItem('tecnico_nombre') || 'Técnico';
        _chatChannel.send({ type: 'broadcast', event: 'msg', payload: { email: email, name: name, text: '🙌 Le dio +50 XP a ' + helpers[0].name + ' por ayudar!', ts: Date.now() } });
      }
      if (typeof window.showToast === 'function') window.showToast('¡+50 XP para ' + helpers[0].name + '!', 'success'); else window.MaestroDialog.alert({title: '', message: '¡+50 XP para ' + helpers[0].name + '!', kind: 'success'});
    }).catch(function(e) {
      console.warn('[StudyTogether] award_help_xp error:', e);
    });
  };

  // ── Session management ───────────────────────────────��──────
  window._stCreateSession = function() {
    if (!SB || !_currentModule) return;
    var code = String(Math.floor(1000 + Math.random() * 9000));
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
    SB.from('study_sessions').insert({
      host_email: email,
      module: _currentModule,
      session_code: code,
      is_active: true
    }).then(function(res) {
      if (res.error) { window.MaestroDialog.alert({title: 'Error', message: 'Error creando sesión: ' + res.error.message, kind: 'error'}); return; }
      _sessionCode = code;
      _joinSyncChannel(code);
      _renderTab('sync');
      // Badge
      if (window.Gamification) {
        try { window.Gamification.awardXP(10, 'social'); } catch(e) {}
      }
    });
  };

  window._stJoinSession = function() {
    var codeInput = document.getElementById('stJoinCode');
    if (!codeInput || !codeInput.value.trim() || !SB) return;
    var code = codeInput.value.trim();
    SB.from('study_sessions').select('*').eq('session_code', code).eq('is_active', true).maybeSingle().then(function(res) {
      if (!res.data) { window.MaestroDialog.alert({title: 'Atención', message: 'Sesión no encontrada o inactiva.', kind: 'warning'}); return; }
      _sessionCode = code;
      _joinSyncChannel(code);
      _renderTab('sync');
    });
  };

  window._stLeaveSession = function() {
    if (_syncChannel) {
      try { SB.removeChannel(_syncChannel); } catch(e) {}
      _syncChannel = null;
    }
    _sessionCode = null;
    _renderTab('sync');
  };

  function _joinSyncChannel(code) {
    if (_syncChannel) {
      try { SB.removeChannel(_syncChannel); } catch(e) {}
    }
    _syncChannel = SB.channel('study-sync-' + code);
    _syncChannel.on('broadcast', { event: 'question' }, function(payload) {
      if (payload.payload && payload.payload.idx !== undefined) {
        // Sync question index — emit event for study module to pick up
        window.dispatchEvent(new CustomEvent('studySyncQuestion', { detail: { idx: payload.payload.idx } }));
      }
    });
    _syncChannel.subscribe();
  }

  // ── Expose globally ─────────────────────────────────────────
  window.StudyTogether = {
    enter: enter,
    leave: leave
  };

})();
