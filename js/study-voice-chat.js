/* ============================================================
   Study Voice Chat — Roblox-style PTT for study modules
   Uses 100ms WebRTC (existing SDK) + Supabase Realtime presence
   ============================================================ */
(function() {
  'use strict';

  // ── Module → room name mapping ──
  var MODULE_MAP = {
    dashboardScreen:        'lobby-general',
    epa608StudyScreen:      'study-epa608',
    a2lStudyScreen:         'study-a2l',
    oshaStudyScreen:        'study-osha',
    calefaccionStudyScreen: 'study-calefaccion',
    refriStudyScreen:       'study-refri',
    nateStudyScreen:        'study-nate',
    etStudyScreen:          'study-et',
    nateSeniorStudyScreen:  'study-nate-senior'
  };

  // Friendly labels for UI
  var MODULE_LABELS = {
    'lobby-general': 'Lobby General',
    'study-epa608': 'EPA 608',
    'study-a2l': 'A2L',
    'study-osha': 'OSHA',
    'study-calefaccion': 'Calefacción',
    'study-refri': 'Refrigeración',
    'study-nate': 'NATE',
    'study-et': 'ET',
    'study-nate-senior': 'NATE Senior'
  };

  // ── Private state ──
  var _vcHmsActions = null;
  var _vcHmsStore = null;
  var _vcHmsInited = false;
  var _vcCurrentModule = null;   // e.g. 'study-epa608'
  var _vcCurrentScreenId = null;
  var _vcRoomId = null;
  var _vcJoined = false;
  var _vcPresenceChannel = null;
  var _vcTalking = false;
  var _vcRoomCache = {};
  var _vcPeers = [];             // presence peer list
  var _vcPanelEl = null;
  var _vcExpanded = false;
  var _vcPeerUnsub = null;       // 100ms peer subscription unsub
  var _vcDashChannels = [];      // dashboard presence subscriptions
  var _vcStyleInjected = false;
  var _vcLobbyBroadcastChannel = null;  // lobby talking broadcast
  var _vcLastLobbyNotify = 0;          // throttle: 1 per 30s
  var _vcVolumeInterval = null;   // interval to keep audio at max volume
  var _vcMicPermGranted = false;  // track if getUserMedia was already called

  // Tab ID for beforeunload ownership check (prevent multi-tab hijacking)
  var _vcTabId = Date.now() + '_' + Math.random().toString(36).slice(2);

  var SB_URL = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var SB_KEY = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';

  // Get auth headers (user JWT + apikey) matching live-stream-admin.js pattern
  function _vcGetAuthHeaders() {
    return new Promise(function(resolve) {
      var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_KEY, 'apikey': SB_KEY };
      try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) {
          supabaseClient.auth.getSession().then(function(sess) {
            if (sess && sess.data && sess.data.session && sess.data.session.access_token) {
              headers['Authorization'] = 'Bearer ' + sess.data.session.access_token;
            }
            resolve(headers);
          }).catch(function() { resolve(headers); });
        } else {
          resolve(headers);
        }
      } catch(e) { resolve(headers); }
    });
  }

  // ── Helpers ──
  function _vcGetUser() {
    var u = window.currentUser;
    if (!u) return null;
    return {
      email: u.email || '',
      name: u.nombre || u.user_metadata && u.user_metadata.nombre || u.email || 'Estudiante'
    };
  }

  function _vcInitials(name) {
    if (!name) return '??';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  // ── CSS Injection ──
  function _vcInjectStyles() {
    if (_vcStyleInjected) return;
    _vcStyleInjected = true;
    var css = document.createElement('style');
    css.id = 'study-voice-chat-styles';
    css.textContent = [
      '.svc-panel{position:fixed;top:calc(80px + env(safe-area-inset-top, 0px));right:12px;left:auto;transform:none;width:calc(100% - 24px);max-width:420px;z-index:900;font-family:Inter,system-ui,sans-serif;pointer-events:auto}',
      '.svc-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(10,22,40,0.95);border-radius:14px;cursor:pointer;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(56,189,248,0.15);transition:border-radius 0.2s}',
      '.svc-header.svc-open{border-radius:14px 14px 0 0;border-bottom:1px solid rgba(56,189,248,0.08)}',
      '.svc-header-left{display:flex;align-items:center;gap:8px;color:#e2e8f0;font-size:13px;font-weight:600}',
      '.svc-header-count{color:#38bdf8;font-size:12px;font-weight:500}',
      '.svc-body{display:none;background:rgba(10,22,40,0.95);border-radius:0 0 14px 14px;padding:12px 14px 16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(56,189,248,0.15);border-top:none}',
      '.svc-body.svc-open{display:block}',
      '.svc-peers{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;min-height:36px;align-items:center}',
      '.svc-peer{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#e2e8f0;background:rgba(30,41,59,0.9);border:2px solid rgba(100,116,139,0.3);transition:all 0.25s;position:relative}',
      '.svc-peer.svc-talking{border-color:#22c55e;box-shadow:0 0 8px rgba(34,197,94,0.5);animation:svcPulse 1s ease-in-out infinite}',
      '.svc-peer-empty{color:#475569;font-size:12px;font-style:italic}',
      '@keyframes svcPulse{0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.4)}50%{box-shadow:0 0 16px rgba(34,197,94,0.7)}}',
      /* Big green mic button */
      '.svc-mic-btn{width:100%;padding:12px;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;transition:all 0.2s;letter-spacing:0.3px}',
      '.svc-mic-btn.svc-mic-off{background:linear-gradient(135deg,#15803d,#166534);color:#fff;box-shadow:0 4px 15px rgba(34,197,94,0.3)}',
      '.svc-mic-btn.svc-mic-on{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;box-shadow:0 4px 15px rgba(220,38,38,0.3);animation:svcMicPulse 2s ease-in-out infinite}',
      '.svc-mic-btn.svc-mic-connecting{background:linear-gradient(135deg,#1e3a5f,#0f2847);color:#94a3b8;cursor:wait}',
      '@keyframes svcMicPulse{0%,100%{box-shadow:0 4px 15px rgba(220,38,38,0.3)}50%{box-shadow:0 4px 25px rgba(220,38,38,0.5)}}',
      '.svc-close-btn{width:100%;padding:10px;border:1px solid rgba(148,163,184,0.15);border-radius:10px;background:transparent;color:rgba(148,163,184,0.5);font-size:12px;font-weight:600;cursor:pointer;margin-top:8px;-webkit-tap-highlight-color:transparent}',
      '.svc-ptt-hint{text-align:center;color:#475569;font-size:11px;margin-top:8px}',
      '.svc-tooltip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:8px;padding:10px 16px;background:linear-gradient(135deg,#1e3a5f,#0f2847);border:1px solid rgba(34,197,94,0.3);border-radius:12px;color:#e2e8f0;font-size:12px;white-space:nowrap;pointer-events:none;animation:svcTooltipIn 0.3s ease-out;box-shadow:0 4px 20px rgba(0,0,0,0.4)}',
      '@keyframes svcTooltipIn{0%{opacity:0;transform:translateX(-50%) translateY(8px)}100%{opacity:1;transform:translateX(-50%) translateY(0)}}',
      /* Dashboard badges */
      '.svc-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#22c55e;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;z-index:5;box-shadow:0 1px 4px rgba(0,0,0,0.3);pointer-events:none}'
    ].join('\n');
    document.head.appendChild(css);
  }

  // ── Room ID Management ──
  function _vcGetRoomId(moduleName) {
    return new Promise(function(resolve, reject) {
      // Check cache first
      if (_vcRoomCache[moduleName]) {
        resolve(_vcRoomCache[moduleName]);
        return;
      }
      // Query Supabase
      if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        reject(new Error('No supabaseClient'));
        return;
      }
      supabaseClient.from('study_voice_rooms').select('hms_room_id').eq('module', moduleName).limit(1)
        .then(function(res) {
          if (res.data && res.data.length > 0) {
            _vcRoomCache[moduleName] = res.data[0].hms_room_id;
            resolve(res.data[0].hms_room_id);
          } else {
            // Create room via Edge Function
            _vcCreateRoom(moduleName).then(resolve).catch(reject);
          }
        })
        .catch(reject);
    });
  }

  function _vcCreateRoom(moduleName) {
    return new Promise(function(resolve, reject) {
      _vcGetAuthHeaders().then(function(hdrs) {
      fetch(SB_URL + '/functions/v1/hms-token', {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ action: 'create_room', name: moduleName, description: 'Study voice chat: ' + moduleName })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var roomId = data.room && data.room.id;
        if (!roomId) { reject(new Error('No room ID from create_room')); return; }
        console.log('[StudyVoice] Got room for ' + moduleName + ': ' + roomId);
        // Edge Function does GET-OR-CREATE: searches by name first, only creates if not found.
        // All users calling create_room('lobby-general') get the SAME room ID.
        _vcRoomCache[moduleName] = roomId;
        // Try to store in DB for faster lookups (fire-and-forget)
        try {
          if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            supabaseClient.from('study_voice_rooms').upsert(
              { module: moduleName, hms_room_id: roomId },
              { onConflict: 'module' }
            ).then(function() {}).catch(function() {});
          }
        } catch(e) {}
        resolve(roomId);
      })
      .catch(reject);
      }); // end _vcGetAuthHeaders
    });
  }

  // ── Presence (Supabase Realtime) ──
  function _vcJoinPresence(moduleName) {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
    var user = _vcGetUser();
    if (!user) return;

    var channelName = 'study-voice-' + moduleName;
    _vcPresenceChannel = supabaseClient.channel(channelName, { config: { presence: { key: user.email } } });

    _vcPresenceChannel
      .on('presence', { event: 'sync' }, function() {
        var state = _vcPresenceChannel.presenceState();
        _vcPeers = [];
        Object.keys(state).forEach(function(key) {
          var entries = state[key];
          if (entries && entries.length > 0) {
            _vcPeers.push({
              email: key,
              name: entries[0].name || key,
              talking: entries[0].talking || false
            });
          }
        });
        _vcRenderPeers();
        _vcUpdateHeaderCount();
      })
      .subscribe(function(status) {
        if (status === 'SUBSCRIBED') {
          _vcPresenceChannel.track({ name: user.name, email: user.email, talking: false });
        }
      });
  }

  function _vcLeavePresence() {
    if (_vcPresenceChannel) {
      try { _vcPresenceChannel.untrack(); } catch(e) {}
      try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          supabaseClient.removeChannel(_vcPresenceChannel);
        }
      } catch(e) {}
      _vcPresenceChannel = null;
    }
    _vcPeers = [];
  }

  function _vcUpdatePresenceTalking(talking) {
    if (!_vcPresenceChannel) return;
    var user = _vcGetUser();
    if (!user) return;
    _vcPresenceChannel.track({ name: user.name, email: user.email, talking: talking });
  }

  // ── Keep audio elements at max volume (no Web Audio API — it breaks navigation) ──
  function _vcStartVolumeBoost() {
    if (_vcVolumeInterval) return;
    _vcVolumeInterval = setInterval(function() {
      var audios = document.querySelectorAll('audio');
      audios.forEach(function(el) {
        if (el.volume < 1.0) el.volume = 1.0;
      });
    }, 2000);
  }

  function _vcStopVolumeBoost() {
    if (_vcVolumeInterval) {
      clearInterval(_vcVolumeInterval);
      _vcVolumeInterval = null;
    }
  }

  // ── 100ms Join — auto-join as listener (mic muted), no permission needed ──
  function _vcJoinRoom() {
    return new Promise(function(resolve, reject) {
      if (_vcJoined) { resolve(); return; }
      if (!_vcRoomId) { reject(new Error('No room ID')); return; }

      // Init 100ms SDK if needed
      if (!_vcHmsInited) {
        if (!window.HMSReactiveStore) { reject(new Error('100ms SDK not loaded')); return; }
        try {
          var hms = new window.HMSReactiveStore();
          _vcHmsStore = hms.getStore();
          _vcHmsActions = hms.getHMSActions();
          _vcHmsInited = true;
        } catch(e) { reject(e); return; }
      }

      var user = _vcGetUser();
      if (!user) { reject(new Error('No user')); return; }

      _vcGetAuthHeaders().then(function(hdrs) {
        fetch(SB_URL + '/functions/v1/hms-token', {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify({
            action: 'get_token',
            role: 'co-broadcaster',
            room_id: _vcRoomId,
            user_id: user.email,
            user_name: user.name
          })
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!data.token) { reject(new Error('No token received')); return; }
          // NOTE: 100ms tokens typically expire after 24 hours. For sessions
          // approaching that duration, the SDK will emit a disconnection event
          // which is handled by the reconnect logic above. A proactive refresh
          // before expiry is not implemented — acceptable given typical session
          // lengths of < 2 hours.
          return _vcHmsActions.join({
            userName: user.name,
            authToken: data.token,
            initEndpoint: 'https://prod-init.100ms.live',
            settings: { isAudioMuted: true, isVideoMuted: true },
            rememberDeviceSelection: false
          });
        })
        .then(function() {
          _vcJoined = true;
          console.log('[StudyVoice] Joined room ' + _vcRoomId + ' as listener (mic muted)');
          // Max volume for all remote peers via 100ms SDK
          if (_vcHmsStore && _vcHmsStore.subscribe) {
            _vcPeerUnsub = _vcHmsStore.subscribe(function(peers) {
              if (_vcHmsActions) {
                Object.values(peers).forEach(function(peer) {
                  if (peer.audioTrack) {
                    try { _vcHmsActions.setVolume(100, peer.audioTrack); } catch(e) {}
                  }
                });
              }
            }, function(state) { return state.peers; });
          }
          // Listen for connection state changes to handle network drops
          if (_vcHmsStore && _vcHmsStore.subscribe) {
            _vcHmsStore.subscribe(function(connectionState) {
              if (connectionState === 'Disconnected' && _vcJoined) {
                _vcJoined = false;
                console.warn('[StudyVoice] Disconnected from room — network drop detected');
                _vcShowReconnectButton();
              }
            }, function(state) { return state.room && state.room.roomState; });
          }
          // Keep audio elements at max native volume
          _vcStartVolumeBoost();
          // Update UI hint
          var hint = _vcPanelEl && _vcPanelEl.querySelector('.svc-ptt-hint');
          if (hint) hint.textContent = 'Conectado \u2014 escuchando. Toca para hablar.';
          resolve();
        })
        .catch(reject);
      }).catch(reject);
    });
  }

  // ── Reconnect after network drop ──
  function _vcShowReconnectButton() {
    var hint = _vcPanelEl && _vcPanelEl.querySelector('.svc-ptt-hint');
    if (hint) hint.textContent = 'Conexión perdida';
    var btn = _vcPanelEl && _vcPanelEl.querySelector('.svc-mic-btn');
    if (btn) {
      btn.className = 'svc-mic-btn svc-mic-off';
      btn.innerHTML = '🔄 RECONECTAR';
      btn.disabled = false;
      btn.onclick = function(e) {
        e.preventDefault();
        btn.innerHTML = 'Reconectando...';
        btn.disabled = true;
        btn.className = 'svc-mic-btn svc-mic-connecting';
        _vcJoinRoom().then(function() {
          btn.className = 'svc-mic-btn svc-mic-off';
          btn.innerHTML = '\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR MICRÓFONO';
          btn.disabled = false;
          if (hint) hint.textContent = 'Reconectado — escuchando.';
          // Restore normal click handler
          btn.onclick = null;
          btn.addEventListener('click', function(ev) { ev.preventDefault(); _vcToggleMic(); });
        }).catch(function(err) {
          console.warn('[StudyVoice] Reconnect failed:', err.message || err);
          btn.className = 'svc-mic-btn svc-mic-off';
          btn.innerHTML = '🔄 REINTENTAR CONEXIÓN';
          btn.disabled = false;
          if (hint) hint.textContent = 'Error al reconectar — intenta de nuevo';
        });
      };
    }
  }

  // ── Toggle Mic ──
  function _vcToggleMic() {
    var btn = _vcPanelEl && _vcPanelEl.querySelector('.svc-mic-btn');
    var hint = _vcPanelEl && _vcPanelEl.querySelector('.svc-ptt-hint');

    if (_vcTalking) {
      // Turn OFF mic (still connected, can hear others)
      _vcTalking = false;
      if (_vcHmsActions) {
        try { _vcHmsActions.setLocalAudioEnabled(false); } catch(e) {}
      }
      _vcUpdatePresenceTalking(false);
      if (btn) { btn.className = 'svc-mic-btn svc-mic-off'; btn.innerHTML = '\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR MICR\u00d3FONO'; }
      if (hint) hint.textContent = 'Mic apagado \u2014 a\u00fan escuchas a los dem\u00e1s';
      return;
    }

    // Turn ON mic
    if (btn) { btn.className = 'svc-mic-btn svc-mic-connecting'; btn.innerHTML = 'Conectando...'; btn.disabled = true; }

    // Only call getUserMedia on FIRST activation (iOS gesture requirement).
    // Subsequent toggles just use setLocalAudioEnabled — no interruption to existing audio.
    var permPromise;
    if (!_vcMicPermGranted) {
      permPromise = navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          stream.getTracks().forEach(function(t) { t.stop(); });
          _vcMicPermGranted = true;
        });
    } else {
      permPromise = Promise.resolve();
    }

    permPromise
    .then(function() {
      return _vcJoined ? Promise.resolve() : _vcJoinRoom();
    }).then(function() {
      _vcTalking = true;
      if (_vcHmsActions) {
        try { _vcHmsActions.setLocalAudioEnabled(true); } catch(e) { console.warn('[StudyVoice] setLocalAudioEnabled error:', e); }
      }
      _vcUpdatePresenceTalking(true);
      _vcBroadcastLobbyTalking();
      if (btn) { btn.className = 'svc-mic-btn svc-mic-on'; btn.innerHTML = '\uD83D\uDD34 ACTIVO \u2014 TOCA PARA SILENCIAR'; btn.disabled = false; }
      if (hint) hint.textContent = 'Los dem\u00e1s t\u00e9cnicos pueden escucharte';
    }).catch(function(e) {
      console.warn('[StudyVoice] Mic activation failed:', e.message || e);
      if (btn) { btn.className = 'svc-mic-btn svc-mic-off'; btn.innerHTML = '\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR MICR\u00d3FONO'; btn.disabled = false; }
      if (hint) hint.textContent = e.name === 'NotAllowedError' ? 'Permiso de micr\u00f3fono denegado \u2014 revisa ajustes del navegador' : 'Error al conectar \u2014 intenta de nuevo';
    });
  }

  function _vcStopTalk() {
    if (!_vcTalking) return;
    _vcTalking = false;
    if (_vcHmsActions) {
      try { _vcHmsActions.setLocalAudioEnabled(false); } catch(e) {}
    }
    _vcUpdatePresenceTalking(false);
    var btn = _vcPanelEl && _vcPanelEl.querySelector('.svc-mic-btn');
    if (btn) { btn.className = 'svc-mic-btn svc-mic-off'; btn.innerHTML = '\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR MICR\u00d3FONO'; }
  }

  // Disconnect from voice chat but stay in study module
  function _vcDisconnectVoice() {
    if (_vcTalking) _vcStopTalk();
    _vcStopVolumeBoost();
    // Untrack presence BEFORE leaving HMS so peers see departure promptly
    _vcLeavePresence();
    if (_vcPeerUnsub) {
      try { _vcPeerUnsub(); } catch(e) {}
      _vcPeerUnsub = null;
    }
    if (_vcJoined && _vcHmsActions) {
      try { _vcHmsActions.leave().catch(function(){}); } catch(e) {}
      _vcJoined = false;
    }
    // Update UI — show mic button as "Activar", hide disconnect
    var btn = _vcPanelEl && _vcPanelEl.querySelector('.svc-ptt');
    var dcBtn = _vcPanelEl && _vcPanelEl.querySelector('.svc-disconnect');
    var hint = _vcPanelEl && _vcPanelEl.querySelector('.svc-ptt-hint');
    if (btn) { btn.classList.remove('svc-active'); btn.textContent = 'Activar Micr\u00f3fono'; }
    if (dcBtn) dcBtn.style.display = 'none';
    if (hint) hint.textContent = 'Desconectado del voice chat';
  }

  // ── UI Rendering ──
  function _vcRenderPanel(screenId) {
    _vcInjectStyles();
    _vcRemovePanel();

    var panel = document.createElement('div');
    panel.className = 'svc-panel';
    panel.id = 'svcPanel';

    // Header
    var header = document.createElement('div');
    header.className = 'svc-header';
    header.innerHTML = '<div class="svc-header-left"><span>\uD83C\uDF99 Voice Chat</span> <span class="svc-header-count" id="svcHeaderCount">0 t\u00e9cnicos</span></div>';

    header.addEventListener('click', function() {
      _vcExpanded = !_vcExpanded;
      var bd = panel.querySelector('.svc-body');
      if (_vcExpanded) {
        header.classList.add('svc-open');
        if (bd) bd.classList.add('svc-open');
      } else {
        header.classList.remove('svc-open');
        if (bd) bd.classList.remove('svc-open');
      }
    });

    // Body — always starts expanded on render
    var body = document.createElement('div');
    body.className = 'svc-body svc-open';
    header.classList.add('svc-open');
    _vcExpanded = true;

    body.innerHTML =
      '<div class="svc-peers" id="svcPeers"><span class="svc-peer-empty">Nadie en el canal</span></div>' +
      '<button class="svc-mic-btn svc-mic-off" id="svcMicBtn">\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR MICR\u00d3FONO</button>' +
      '<div class="svc-ptt-hint" id="svcHint">Escuchando el canal de voz...</div>' +
      '<button class="svc-close-btn" id="svcCloseBtn">CERRAR VOICE CHAT</button>';

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    _vcPanelEl = panel;

    // Big mic button
    var micBtn = panel.querySelector('#svcMicBtn');
    if (micBtn) {
      micBtn.addEventListener('click', function(e) {
        e.preventDefault();
        _vcToggleMic();
      });
    }
    // Close button
    var closeBtn = panel.querySelector('#svcCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) { e.preventDefault(); _vcHidePanel(); });
    }

    // First-time tooltip (only once per session)
    if (!sessionStorage.getItem('svc_tooltip_shown')) {
      sessionStorage.setItem('svc_tooltip_shown', '1');
      var tooltip = document.createElement('div');
      tooltip.className = 'svc-tooltip';
      tooltip.textContent = '\uD83D\uDCA1 Toca el bot\u00f3n verde para hablar con los t\u00e9cnicos en l\u00ednea';
      panel.appendChild(tooltip);
      setTimeout(function() {
        if (tooltip.parentNode) {
          tooltip.style.opacity = '0';
          tooltip.style.transition = 'opacity 0.5s';
          setTimeout(function() { if (tooltip.parentNode) tooltip.remove(); }, 500);
        }
      }, 4000);
    }
  }

  // Hide panel (X button) — disconnect voice, leave presence, remove UI
  function _vcHidePanel() {
    if (_vcTalking) _vcStopTalk();
    _vcStopVolumeBoost();
    if (_vcJoined && _vcHmsActions) {
      try { _vcHmsActions.leave().catch(function(){}); } catch(e) {}
      _vcJoined = false;
    }
    if (_vcPeerUnsub) { try { _vcPeerUnsub(); } catch(e) {} _vcPeerUnsub = null; }
    _vcLeavePresence();
    _vcRemovePanel();
    _vcCurrentModule = null;
    _vcCurrentScreenId = null;
    _vcRoomId = null;
    _vcTalking = false;
    // Reset dashboard mic button color
    var dashMicBtn = document.getElementById('dashMicBtn');
    if (dashMicBtn) { dashMicBtn.style.background = 'linear-gradient(135deg,#15803d,#166534)'; dashMicBtn.style.borderColor = 'rgba(34,197,94,0.4)'; }
  }

  function _vcRemovePanel() {
    if (_vcPanelEl && _vcPanelEl.parentNode) {
      _vcPanelEl.parentNode.removeChild(_vcPanelEl);
    }
    _vcPanelEl = null;
  }

  function _vcRenderPeers() {
    var container = document.getElementById('svcPeers');
    if (!container) return;
    container.innerHTML = '';

    if (_vcPeers.length === 0) {
      container.innerHTML = '<span class="svc-peer-empty">Nadie en el canal</span>';
      return;
    }

    _vcPeers.forEach(function(p) {
      var el = document.createElement('div');
      el.className = 'svc-peer' + (p.talking ? ' svc-talking' : '');
      el.textContent = _vcInitials(p.name);
      el.title = p.name;
      container.appendChild(el);
    });
  }

  function _vcUpdateHeaderCount() {
    var el = document.getElementById('svcHeaderCount');
    if (!el) return;
    var n = _vcPeers.length;
    el.textContent = n + ' técnico' + (n !== 1 ? 's' : '');
  }

  // ── Dashboard Badges ──
  function _vcGetDashboardCounts() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

    // Clean up previous dashboard subscriptions
    _vcCleanDashChannels();

    var modules = Object.keys(MODULE_MAP);
    modules.forEach(function(screenId) {
      if (screenId === 'dashboardScreen') return; // skip lobby for dashboard badges
      var moduleName = MODULE_MAP[screenId];
      var channelName = 'study-voice-' + moduleName;

      var ch = supabaseClient.channel(channelName, { config: { presence: { key: '_dashboard_' + Math.random().toString(36).slice(2) } } });

      ch.on('presence', { event: 'sync' }, function() {
        var state = ch.presenceState();
        var count = Object.keys(state).length;
        _vcUpdateDashBadge(screenId, count);
      })
      .subscribe();

      _vcDashChannels.push(ch);
    });
  }

  function _vcCleanDashChannels() {
    _vcDashChannels.forEach(function(ch) {
      try {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          supabaseClient.removeChannel(ch);
        }
      } catch(e) {}
    });
    _vcDashChannels = [];
  }

  function _vcUpdateDashBadge(screenId, count) {
    // Find dashboard card that navigates to this study screen
    var cards = document.querySelectorAll('[onclick*="' + screenId + '"], [data-screen="' + screenId + '"]');
    cards.forEach(function(card) {
      var badge = card.querySelector('.svc-badge');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'svc-badge';
          if (!card.style.position && getComputedStyle(card).position === 'static') card.style.position = 'relative';
          card.appendChild(badge);
        }
        badge.textContent = count;
      } else {
        if (badge) badge.parentNode.removeChild(badge);
      }
    });
  }

  // ── Lobby Broadcast: notify all online users when someone talks ──
  function _vcInitLobbyBroadcast() {
    if (_vcLobbyBroadcastChannel) return;
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

    _vcLobbyBroadcastChannel = supabaseClient.channel('lobby-voice-notify');
    _vcLobbyBroadcastChannel
      .on('broadcast', { event: 'lobby_talking' }, function(payload) {
        var data = payload && payload.payload;
        if (!data) return;
        var user = _vcGetUser();
        // Don't show toast to the person who started talking
        if (user && data.email === user.email) return;
        // Don't show if already in lobby voice chat
        if (_vcCurrentModule === 'lobby-general' && _vcJoined) return;
        _vcShowLobbyToast(data.name);
      })
      .subscribe();
  }

  function _vcCleanLobbyBroadcast() {
    if (_vcLobbyBroadcastChannel) {
      try { supabaseClient.removeChannel(_vcLobbyBroadcastChannel); } catch(e) {}
      _vcLobbyBroadcastChannel = null;
    }
  }

  function _vcBroadcastLobbyTalking() {
    var now = Date.now();
    if (now - _vcLastLobbyNotify < 30000) return; // throttle 30s
    _vcLastLobbyNotify = now;

    if (!_vcLobbyBroadcastChannel) return;
    var user = _vcGetUser();
    if (!user) return;
    _vcLobbyBroadcastChannel.send({
      type: 'broadcast',
      event: 'lobby_talking',
      payload: { name: user.name, email: user.email }
    });
  }

  function _vcShowLobbyToast(talkerName) {
    // Remove existing toast
    var old = document.getElementById('lobbyVoiceToast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.id = 'lobbyVoiceToast';
    toast.style.cssText = 'position:fixed;top:calc(80px + env(safe-area-inset-top, 0px));left:50%;transform:translateX(-50%);max-width:380px;width:calc(100% - 24px);padding:14px 16px;background:linear-gradient(135deg,rgba(15,23,42,0.97),rgba(30,41,59,0.97));border:1.5px solid rgba(59,130,246,0.4);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:99999;animation:lobbyToastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);';

    toast.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:28px;flex-shrink:0;">🎙️</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:14px;font-weight:800;color:#e2e8f0;">\uD83C\uDF99\uFE0F ' + ((talkerName || 'Un t\u00e9cnico').replace(/[<>"'&]/g, '')) + ' activ\u00f3 su micr\u00f3fono</div>' +
          '<div style="font-size:11px;color:rgba(148,163,184,0.7);margin-top:2px;">\u00bfQuieres unirte a la conversaci\u00f3n?</div>' +
        '</div>' +
        '<button id="lobbyToastClose" style="background:none;border:none;color:rgba(148,163,184,0.4);font-size:18px;cursor:pointer;padding:4px;flex-shrink:0;">✕</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:10px;">' +
        '<button id="lobbyToastJoin" style="flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#15803d,#166534);color:#fff;font-size:14px;font-weight:800;cursor:pointer;-webkit-tap-highlight-color:transparent;">\uD83C\uDF99\uFE0F TOCA PARA ACTIVAR EL TUYO</button>' +
      '</div>';

    // Inject animation if needed
    if (!document.getElementById('lobbyToastStyle')) {
      var s = document.createElement('style');
      s.id = 'lobbyToastStyle';
      s.textContent = '@keyframes lobbyToastIn{0%{opacity:0;transform:translateX(-50%) translateY(20px);}100%{opacity:1;transform:translateX(-50%) translateY(0);}}';
      document.head.appendChild(s);
    }

    document.body.appendChild(toast);

    // Auto-dismiss after 10s
    var dismissTimer = setTimeout(function() { _vcDismissLobbyToast(); }, 10000);

    // Close button
    document.getElementById('lobbyToastClose').addEventListener('click', function() {
      clearTimeout(dismissTimer);
      _vcDismissLobbyToast();
    });

    // Join button — voice is global, just activate mic on current screen
    document.getElementById('lobbyToastJoin').addEventListener('click', function() {
      clearTimeout(dismissTimer);
      _vcDismissLobbyToast();
      // Voice is global — just activate mic, no need to navigate
      if (_vcCurrentModule === GLOBAL_ROOM) {
        _vcToggleMic();
      } else {
        // If voice chat not yet initialized, enter and then toggle
        enterModule(_vcCurrentScreenId || 'dashboardScreen');
        setTimeout(function() { _vcToggleMic(); }, 1000);
      }
    });
  }

  function _vcDismissLobbyToast() {
    var toast = document.getElementById('lobbyVoiceToast');
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
    }
  }

  // ── Public API ──
  // SINGLE ROOM for ALL users — like Discord. Everyone is in 'lobby-general'
  // regardless of which screen they're on. Voice persists across all navigation.
  var GLOBAL_ROOM = 'lobby-general';

  function enterModule(screenId) {
    // Always use the global room — everyone talks in the same channel
    _vcCurrentScreenId = screenId;

    // Already connected to the global room — just re-render panel with new label
    if (_vcCurrentModule === GLOBAL_ROOM && _vcJoined) {
      // Update panel if it was removed (e.g. CERRAR pressed)
      if (!_vcPanelEl || !_vcPanelEl.parentNode) {
        _vcRenderPanel(screenId);
      }
      return;
    }

    _vcCurrentModule = GLOBAL_ROOM;

    // Render panel immediately
    _vcRenderPanel(screenId);

    // Get room ID (async) then join presence + auto-join 100ms as listener
    _vcGetRoomId(GLOBAL_ROOM)
      .then(function(roomId) {
        _vcRoomId = roomId;
        _vcJoinPresence(GLOBAL_ROOM);
        // Auto-join 100ms room as listener (mic muted) so users can hear each other
        _vcJoinRoom().catch(function(e) {
          console.warn('[StudyVoice] Auto-join listener failed (will join on mic click):', e.message || e);
        });
      })
      .catch(function(e) {
        console.warn('[StudyVoice] Room setup failed:', e.message || e);
        _vcJoinPresence(GLOBAL_ROOM);
      });
  }

  function leaveModule() {
    // Stop talking if active
    if (_vcTalking) _vcStopTalk();
    _vcStopVolumeBoost();

    // Leave 100ms
    if (_vcJoined && _vcHmsActions) {
      try { _vcHmsActions.leave().catch(function(){}); } catch(e) {}
      _vcJoined = false;
    }
    if (_vcPeerUnsub) {
      try { _vcPeerUnsub(); } catch(e) {}
      _vcPeerUnsub = null;
    }

    // Leave presence
    _vcLeavePresence();

    // Remove UI
    _vcRemovePanel();

    // Reset
    _vcCurrentModule = null;
    _vcCurrentScreenId = null;
    _vcRoomId = null;
    _vcTalking = false;
  }

  // ── Tab close / navigate away cleanup ──
  // Store tab ID so only the owning tab cleans up the session
  try { sessionStorage.setItem('svc_tab_id', _vcTabId); } catch(e) {}

  window.addEventListener('beforeunload', function() {
    try { if (sessionStorage.getItem('svc_tab_id') !== _vcTabId) return; } catch(e) {}
    if (_vcCurrentModule) leaveModule();
  });
  window.addEventListener('pagehide', function() {
    try { if (sessionStorage.getItem('svc_tab_id') !== _vcTabId) return; } catch(e) {}
    if (_vcCurrentModule) leaveModule();
  });

  // ── Auto-init lobby broadcast listener (for ALL users, on script load) ──
  // Delay to ensure supabaseClient is available
  setTimeout(function() { _vcInitLobbyBroadcast(); }, 2000);

  // ── Update screen tracking without re-rendering panel ──
  function updateScreenId(screenId) {
    _vcCurrentScreenId = screenId;
    // Update presence with new screen
    if (_vcPresenceChannel && _vcJoined) {
      var user = _vcGetUser();
      if (user) {
        try {
          _vcPresenceChannel.track({ name: user.name, email: user.email, screen: screenId, module: _vcCurrentModule });
        } catch(e) {}
      }
    }
  }

  // ── Expose ──
  window.StudyVoiceChat = {
    enterModule: enterModule,
    leaveModule: leaveModule,
    getDashboardCounts: _vcGetDashboardCounts,
    isConnected: function() { return _vcJoined; },
    isTalking: function() { return _vcTalking; }
  };
  window._vcUpdateScreenId = updateScreenId;

})();
