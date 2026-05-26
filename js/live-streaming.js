/* ===================================================================
   Live Streaming — Student view for watching live streams + VOD
   Follows tech-chat.js pattern (buildHTML, realtime, init).
   =================================================================== */

var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
var _lsChatSubscription = null;
var _lsStatusSubscription = null;
var _lsChatMessages = [];
var _lsCurrentStreamId = null;
var _lsViewerChannel = null;
var _lsAttendanceId = null; // current attendance log row ID
var _lsHlsPlayer = null; // hls.js instance for HLS playback
var _lsEndedGraceTimer = null; // 90s grace period before showing "stream ended"
var _lsCurrentPlaybackUrl = null; // track current playback URL for device-switch detection
var _lsUrlPollInterval = null; // playback URL polling interval

/* ── VOD Quiz state ─────────────────────────────────────────── */
var _lsVodQuizPassed = {};        // recordingId → true if student passed
var _lsCurrentVodQuiz = null;     // active quiz state
var _lsVodRecordingsCache = [];   // cache recordings with quiz_questions
var _lsLastVodQuizRecId = null;   // for retry

// Helper: lock/unlock viewport zoom for streaming (prevents pinch-zoom instability on iPhone/Android)
function _lsLockViewportZoom() {
  var vp = document.querySelector('meta[name="viewport"]');
  if (vp) {
    // If admin view already locked the viewport, capture the ORIGINAL content instead
    vp._lsOrigContent = (vp._lsaOrigContent) ? vp._lsaOrigContent : vp.getAttribute('content');
    vp.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
}
function _lsUnlockViewportZoom() {
  var vp = document.querySelector('meta[name="viewport"]');
  if (vp && vp._lsOrigContent) {
    vp.setAttribute('content', vp._lsOrigContent);
    delete vp._lsOrigContent;
  }
}

/* ── Media upload state ────────────────────────────────────── */
var _lsChatMediaFile = null;
var _lsChatMediaPreviewUrl = null;
var _LS_MAX_IMG_MB = 5;
var _LS_MAX_VID_MB = 20;

/* ── Moderation state ──────────────────────────────────────── */
var _lsIsModerator = false;
var _lsIsBanned = false;
var _lsModeratorEmails = [];
var _lsKicked = false; // kicked from stream by admin
var _lsKickedStreamIds = {}; // persistent kick tracking per session

/* ── Cached student groups from Supabase (fallback when zoom-recordings.js not loaded) ── */
var _lsCachedStudentGroups = null;

/* ── Preload student groups from Supabase (for non-admin users) ── */
async function _lsPreloadStudentGroups() {
  if (typeof getStudentGroupsForEmail === 'function') return; // zoom-recordings.js loaded, no need
  if (_lsCachedStudentGroups !== null && _lsCachedStudentGroups.length > 0) return; // already cached with data
  var email = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
  if (!email) return;

  // Try localStorage cache first (instant, survives refresh)
  try {
    var lsKey = 'maestroac_student_groups_' + email;
    var lsCached = JSON.parse(localStorage.getItem(lsKey));
    if (lsCached && Array.isArray(lsCached) && lsCached.length > 0) {
      _lsCachedStudentGroups = lsCached;
    }
  } catch(e) { /* ignore */ }

  // Fetch fresh data from Supabase (async update)
  if (!supabaseClient) return;
  try {
    var res = await supabaseClient.from('zoom_recordings').select('data').eq('id', 'student_groups').maybeSingle();
    if (res.data && res.data.data) {
      var all = JSON.parse(res.data.data);
      var found = all.find(function(s) { return s.email && s.email.toLowerCase() === email; });
      var groups = found ? (found.groups || []) : [];
      _lsCachedStudentGroups = groups;
      // Persist to localStorage for next time
      if (groups.length > 0) {
        try { localStorage.setItem('maestroac_student_groups_' + email, JSON.stringify(groups)); } catch(e) { /* ignore */ }
      }
    } else if (!_lsCachedStudentGroups) {
      _lsCachedStudentGroups = [];
    }
  } catch(e) {
    console.warn('[LiveStream] Could not fetch student groups:', e);
    if (!_lsCachedStudentGroups) _lsCachedStudentGroups = [];
  }
}

/* ── Init (called from navigation.js when screen shown) ─────── */
async function initLiveStreaming() {
  var screen = document.getElementById('liveStreamingScreen');
  if (!screen) return;
  if (!screen.querySelector('#lsStreamList')) {
    screen.innerHTML = buildLiveStreamingHTML();
  }
  // Load kicked stream IDs from sessionStorage (persists across page navigations)
  try {
    var stored = sessionStorage.getItem('_lsKickedStreamIds');
    if (stored) _lsKickedStreamIds = JSON.parse(stored);
  } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  await _lsPreloadStudentGroups();
  lsRenderMyGroupBadge();
  loadLiveStreams();
  subscribeToLiveStreamStatus();
}

/* ── Build HTML ─────────────────────────────────────────────── */
function buildLiveStreamingHTML() {
  return '' +
    // Header (hidden when watching live)
    '<div id="lsHeader" style="background:#FFFFFF;border-bottom:1px solid rgba(0,0,0,0.08);padding:10px 12px;display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
      '<button onclick="leaveLiveStreaming()" style="background:none;border:none;color:#111111;font-size:20px;cursor:pointer;padding:2px;font-weight:700;">←</button>' +
      '<div style="flex:1;">' +
        '<div style="color:#111111;font-weight:800;font-size:15px;">' + _t('ls_specialty_classes','Clases de Especialidad') + '</div>' +
      '</div>' +
      '<div id="lsLiveIndicator" style="display:none;width:8px;height:8px;background:#34c759;border-radius:50%;box-shadow:0 0 6px #34c759;"></div>' +
    '</div>' +

    // Content area
    '<div id="lsContentArea" style="flex:1;overflow-y:auto;padding:12px;-webkit-overflow-scrolling:touch;background:#F5F5F7;touch-action:manipulation;">' +

      // Player container (hidden until watching)
      '<div id="lsPlayerSection" style="display:none;touch-action:manipulation;">' +
        '<div id="lsPlayerContainer" style="position:relative;width:100%;padding-bottom:56.25%;background:#000;border-radius:10px;overflow:hidden;touch-action:manipulation;cursor:pointer;">' +
          '<video id="lsPlayerVideo" autoplay playsinline muted style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;z-index:1;touch-action:manipulation;"></video>' +
          '<style>' +
          'div#lsPlayerContainer:fullscreen{padding-bottom:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;border-radius:0!important;background:#000!important;}' +
          'div#lsPlayerContainer:fullscreen video{width:100%!important;height:100%!important;object-fit:contain!important;}' +
          'div#lsPlayerContainer:-webkit-full-screen{padding-bottom:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;border-radius:0!important;background:#000!important;}' +
          'div#lsPlayerContainer:-webkit-full-screen video{width:100%!important;height:100%!important;object-fit:contain!important;}' +
          'div#lsPlayerContainer:-moz-full-screen{padding-bottom:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;border-radius:0!important;background:#000!important;}' +
          'div#lsPlayerContainer:-moz-full-screen video{width:100%!important;height:100%!important;object-fit:contain!important;}' +
          '</style>' +
          '<iframe id="lsPlayerIframe" src="" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen" allowfullscreen webkitallowfullscreen></iframe>' +
          // Floating reload button ALWAYS visible on video
          '<button id="lsFloatingReload" onclick="lsReloadPlayer()" style="display:none;position:absolute;top:12px;right:12px;z-index:65;background:rgba(239,68,68,0.9);color:#fff;border:none;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:20px;box-shadow:0 4px 12px rgba(0,0,0,0.5);-webkit-tap-highlight-color:transparent;line-height:44px;text-align:center;">🔄</button>' +
          // Break timer overlay (students see this)
          '<div id="lsBreakOverlay" style="display:none;position:absolute;inset:0;background:rgba(15,23,42,0.9);z-index:35;flex-direction:column;align-items:center;justify-content:center;">' +
            '<div style="font-size:48px;margin-bottom:8px;">☕</div>' +
            '<div style="color:#fbbf24;font-size:16px;font-weight:700;">DESCANSO</div>' +
            '<div id="lsBreakTimer" style="color:#fff;font-size:56px;font-weight:700;font-family:monospace;margin-top:8px;">05:00</div>' +
          '</div>' +
        '</div>' +
        // Controls below video: raise hand + reload player
        '<div id="lsPlayerToolsBar" style="display:flex;align-items:center;gap:8px;padding:6px 0;flex-wrap:wrap;">' +
          '<button id="lsRaiseHandBtn" onclick="lsToggleRaiseHand()" style="display:none;background:#22c55e;color:#fff;border:none;padding:8px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;">🙋 Pedir la Palabra</button>' +
          '<button id="lsCameraBtn" onclick="lsToggleCamera()" style="display:none;background:#3b82f6;color:#fff;border:none;padding:8px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;">📹 Prender Cámara</button>' +
          '<button id="lsCamToggleBtn" onclick="lsCamToggle()" style="display:none;background:#22c55e;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:13px;">📹</button>' +
          '<button id="lsMicToggleBtn" onclick="lsMicToggle()" style="display:none;background:#22c55e;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:13px;">🎤</button>' +
          '<button id="lsCamFlipBtn" onclick="lsCamFlip()" style="display:none;background:#6366f1;color:#fff;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:13px;">🔄</button>' +
          '<span id="lsParticipationStatus" style="display:none;color:#22c55e;font-size:12px;font-weight:600;"></span>' +
          '<button id="lsFullscreenBtn" onclick="_lsToggleFullscreen()" style="background:rgba(255,255,255,0.15);border:none;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;cursor:pointer;margin-left:auto;-webkit-tap-highlight-color:transparent;min-width:44px;min-height:44px;">\u26F6 Completa</button>' +
          '<button id="lsReloadBtn" onclick="lsReloadPlayer()" style="background:#ef4444;color:#fff;border:none;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;-webkit-tap-highlight-color:transparent;min-width:44px;min-height:44px;">🔄 Recargar</button>' +
          '<button id="lsTbChatBtn" onclick="lsToggleChat()" style="background:#8b5cf6;color:#fff;border:none;padding:8px 14px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;-webkit-tap-highlight-color:transparent;min-width:44px;min-height:44px;">💬 Chat</button>' +
        '</div>' +
        '<div id="lsSelfPreview" style="display:none;position:relative;width:120px;margin:4px 0;">' +
          '<video id="lsSelfVideo" autoplay playsinline muted style="width:120px;height:90px;object-fit:cover;border-radius:8px;border:2px solid #3b82f6;background:#000;"></video>' +
          '<div style="position:absolute;bottom:2px;left:4px;color:#fff;font-size:9px;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.8);">Tu cámara</div>' +
        '</div>' +
        '<div id="lsPlayerTitle" style="display:none;"></div>' +
        '<div id="lsPlayerDesc" style="display:none;"></div>' +
      '</div>' +

      // Chat toggle button (visible when chat is hidden)
      '<button id="lsChatToggleBtn" onclick="lsToggleChat()" style="display:none;position:fixed;top:200px;right:16px;z-index:9999;background:#ef4444;color:#fff;border:3px solid #fff;width:50px;height:50px;border-radius:50%;cursor:pointer;font-size:22px;box-shadow:0 4px 20px rgba(0,0,0,0.5);-webkit-tap-highlight-color:transparent;animation:lsa-pulse 2s ease-in-out infinite;">💬</button>' +

      // Chat section (shown when watching live) — fills remaining space
      '<div id="lsChatSection" style="display:none;background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:12px;overflow:hidden;flex-direction:column;touch-action:manipulation;box-shadow:0 2px 8px rgba(0,0,0,0.06);">' +
        '<div style="background:#F5F5F7;border-bottom:1px solid rgba(0,0,0,0.08);padding:10px 12px;display:flex;align-items:center;gap:8px;">' +
          '<span style="color:#111111;font-weight:700;font-size:14px;">Chat en Vivo</span>' +
          '<div style="width:8px;height:8px;background:#34c759;border-radius:50%;"></div>' +
          '<button onclick="lsToggleChat()" style="margin-left:auto;background:#FF3B30;border:none;color:#ffffff;font-size:20px;font-weight:700;cursor:pointer;padding:0;width:36px;height:36px;min-width:36px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:31;" title="Cerrar chat">✕</button>' +
        '</div>' +
        '<div id="lsChatMessages" style="flex:1;min-height:60px;max-height:300px;overflow-y:auto;padding:6px 10px;display:flex;flex-direction:column;gap:4px;-webkit-overflow-scrolling:touch;background:#FFFFFF;"></div>' +
        // Media preview bar (hidden until file selected)
        '<div id="lsChatMediaPreview" style="display:none;padding:6px 10px;background:#F5F5F7;border-top:1px solid rgba(0,0,0,0.08);">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<div id="lsChatMediaThumb" style="width:48px;height:48px;border-radius:6px;overflow:hidden;background:#E5E5EA;display:flex;align-items:center;justify-content:center;flex-shrink:0;"></div>' +
            '<div id="lsChatMediaName" style="flex:1;color:#111111;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>' +
            '<button onclick="lsChatClearMedia()" style="background:none;border:none;color:#FF3B30;font-size:16px;cursor:pointer;padding:2px;">✕</button>' +
          '</div>' +
        '</div>' +
        // Slow mode indicator + Q&A bar
        '<div id="lsSlowModeIndicator" style="display:none;text-align:center;padding:3px 0;font-size:11px;color:#b45309;background:rgba(245,158,11,0.12);border-top:1px solid rgba(245,158,11,0.25);"></div>' +
        '<div style="display:flex;gap:4px;padding:6px 10px;border-top:1px solid rgba(0,0,0,0.06);">' +
          '<input id="lsQAInput" type="text" placeholder="Hacer pregunta al instructor..." maxlength="300" autocomplete="off" enterkeyhint="send" style="flex:1;background:#F5F5F7;border:1px solid rgba(0,0,0,0.1);border-radius:16px;padding:8px 12px;color:#111111;font-size:15px;outline:none;">' +
          '<button onclick="_lsSubmitQuestion()" style="background:#007AFF;border:none;color:#fff;padding:6px 12px;border-radius:12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;">Preguntar</button>' +
        '</div>' +
        '<div style="display:flex;gap:6px;padding:6px 10px;padding-bottom:max(8px, env(safe-area-inset-bottom, 8px));border-top:1px solid rgba(0,0,0,0.06);background:#FFFFFF;">' +
          // Attach media button
          '<label style="cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<input type="file" accept="image/*,video/*" onchange="lsChatFileSelected(event)" style="display:none;" id="lsChatFileInput">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>' +
          '</label>' +
          '<input id="lsChatInput" type="text" placeholder="Escribe un mensaje..." maxlength="500" autocomplete="off" enterkeyhint="send" style="flex:1;background:#F5F5F7;border:1px solid rgba(0,0,0,0.1);border-radius:20px;padding:8px 14px;color:#111111;font-size:15px;outline:none;">' +
          '<button onclick="sendStreamChatMessage()" id="lsChatSendBtn" style="background:#ef4444;border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9z"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +

      // Media overlay (fullscreen viewer)
      '<div id="lsChatMediaOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99998;align-items:center;justify-content:center;flex-direction:column;">' +
        '<button onclick="lsChatCloseMedia()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#fff;font-size:28px;cursor:pointer;z-index:99999;">✕</button>' +
        '<div id="lsChatMediaOverlayContent" style="max-width:95vw;max-height:90vh;"></div>' +
      '</div>' +

      // My group indicator
      '<div id="lsMyGroupBadge" style="margin-bottom:12px;"></div>' +

      // Live-only banner (no recordings) — pulses to grab attention
      '<style>@keyframes lsBannerPulse{0%,100%{box-shadow:0 2px 8px rgba(0,0,0,0.06),0 0 0 0 rgba(255,59,48,0.45);border-color:rgba(255,59,48,0.3)}50%{box-shadow:0 2px 14px rgba(255,59,48,0.35),0 0 0 8px rgba(255,59,48,0)}}</style>' +
      '<div id="lsLiveBanner" style="background:#FFFFFF;border:1px solid rgba(255,59,48,0.3);border-left:4px solid #FF3B30;border-radius:12px;padding:14px;margin-bottom:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.06);animation:lsBannerPulse 1.6s ease-in-out infinite;">' +
        '<div style="text-align:right;margin:-4px -4px 0 0;"><button onclick="document.getElementById(\'lsLiveBanner\').style.display=\'none\'" style="background:#eee;border:none;font-size:20px;color:#333;cursor:pointer;padding:2px 10px;line-height:1.2;border-radius:8px;font-weight:bold;" aria-label="Cerrar">✕</button></div>' +
        '<div style="font-size:24px;margin-bottom:6px;">🔴</div>' +
        '<p style="color:#FF3B30;font-size:15px;font-weight:800;margin-bottom:4px;">Las clases son EN VIVO y NO se graban</p>' +
        '<p style="color:#111111;font-size:14px;">Si no atiendes, no hay segundas oportunidades. Conéctate a la hora programada.</p>' +
      '</div>' +

      // Tabs: Live / Grabaciones
      '<div id="lsTabsContainer" style="display:none;gap:8px;margin-bottom:12px;">' +
        '<button id="lsTabLive" onclick="lsSwitchTab(\'live\')" style="flex:1;padding:10px;border-radius:10px;border:none;cursor:pointer;font-weight:700;font-size:14px;background:#FF3B30;color:#fff;">En Vivo</button>' +
        '<button id="lsTabVod" onclick="lsSwitchTab(\'vod\')" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);cursor:pointer;font-weight:700;font-size:14px;background:#FFFFFF;color:#111111;">Grabaciones</button>' +
      '</div>' +

      // Live streams list
      '<div id="lsStreamList"></div>' +

      // VOD list (hidden for app store)
      '<div id="lsVodList" style="display:none;"></div>' +

    '</div>';
}

/* ── My group badge ────────────────────────────────────────── */
function lsRenderMyGroupBadge() {
  var el = document.getElementById('lsMyGroupBadge');
  if (!el) return;
  el.style.display = 'none';
  el.innerHTML = '';
}

/* ── Dashboard group badge (main dashboard) — hidden by request ── */
function lsRenderDashboardGroupBadge() {
  var el = document.getElementById('dashboardGroupBadge');
  if (!el) return;
  el.style.display = 'none';
  el.innerHTML = '';
}

/* ── Chat notification sound (different from waiting room) ── */
var _lsChatUnreadCount = 0;
function _lsChatNotifySound() {
  try {
    var ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume().catch(function(){});
    // Soft "pop" sound — 520Hz descending to 360Hz
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(360, ac.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.15);
    setTimeout(function() { ac.close(); }, 300);
  } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
}
/* ── EN VIVO alert sound (loud, plays 3 times even on silent) ── */
function _lsLiveAlertSound() {
  // Vibrate immediately (works without user gesture on Android)
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500, 100, 500]);

  // Try AudioContext for loud beeps
  try {
    var ac = new (window.AudioContext || window.webkitAudioContext)();
    // iOS requires resume() after user gesture — try anyway
    ac.resume().catch(function(){});
    function burst(delay) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ac.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + delay + 0.3);
      gain.gain.setValueAtTime(1.0, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + delay + 0.35);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + 0.35);
    }
    burst(0);
    burst(0.5);
    burst(1.0);
    setTimeout(function() { ac.close(); }, 2500);
  } catch(e) { console.warn('[LiveStream] AudioContext sound failed:', e); }

  // Backup: browser Notification API (shows OS notification even if tab is background)
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔴 CLASE EN VIVO', {
        body: _t('ls_push_live_now','Maestro Mario está transmitiendo ahora. ¡Entra a ver!'),
        icon: './icon-192.png',
        tag: 'live-stream-alert',
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 500]
      });
    }
  } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
}

/* ── Full-screen EN VIVO alert overlay ─────────────────────── */
function _lsShowLiveAlert(stream) {
  // Don't show if already watching a stream
  if (_lsCurrentStreamId) return;
  // Don't show if already alerted for this stream IN THIS SESSION
  // Use sessionStorage (not localStorage) so alert re-appears if student reopens app
  var alertKey = '_lsLiveAlerted_' + stream.id;
  if (sessionStorage.getItem(alertKey)) return;
  sessionStorage.setItem(alertKey, '1');

  // Remove any existing alert
  var old = document.getElementById('lsLiveAlert');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'lsLiveAlert';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:lsAlertFadeIn 0.3s ease;';

  var title = stream.title || 'Clase en Vivo';
  var instructor = stream.instructor_name || '';
  overlay.innerHTML =
    '<style>' +
      '@keyframes lsAlertFadeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes lsAlertPulse{0%,100%{box-shadow:0 0 30px rgba(239,68,68,0.4)}50%{box-shadow:0 0 60px rgba(239,68,68,0.8),0 0 100px rgba(239,68,68,0.3)}}' +
      '@keyframes lsAlertDot{0%,100%{opacity:1}50%{opacity:0.3}}' +
    '</style>' +
    '<div style="background:linear-gradient(135deg,#991b1b,#dc2626,#ef4444);border-radius:24px;padding:32px 28px;max-width:380px;width:100%;text-align:center;animation:lsAlertPulse 2s infinite;border:2px solid rgba(255,255,255,0.2);">' +
      '<div style="font-size:48px;margin-bottom:12px;animation:lsAlertDot 1s infinite;">🔴</div>' +
      '<div style="color:#fff;font-size:28px;font-weight:900;letter-spacing:1px;margin-bottom:8px;">CLASE EN VIVO</div>' +
      (instructor ? '<div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:4px;">' + _lsEsc(instructor) + '</div>' : '') +
      '<div style="color:#fef2f2;font-size:16px;font-weight:600;margin-bottom:24px;">' + _lsEsc(title) + '</div>' +
      '<button onclick="_lsAlertEnter(\'' + stream.id + '\')" style="background:#fff;color:#dc2626;border:none;padding:14px 36px;border-radius:50px;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);letter-spacing:0.5px;margin-bottom:12px;display:block;width:100%;">ENTRAR A CLASE</button>' +
      '<button onclick="document.getElementById(\'lsLiveAlert\').remove()" style="background:none;border:1px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.7);padding:8px 24px;border-radius:50px;font-size:13px;cursor:pointer;display:block;width:100%;">Cerrar</button>' +
    '</div>';

  document.body.appendChild(overlay);
  _lsLiveAlertSound();
}

/* ── Enter stream from alert ──────────────────────────────── */
function _lsAlertEnter(streamId) {
  // Dismiss alert
  var alert = document.getElementById('lsLiveAlert');
  if (alert) alert.remove();
  // Find stream in cached dashboard data
  var stream = null;
  for (var i = 0; i < _lsDashLiveStreams.length; i++) {
    if (_lsDashLiveStreams[i].id === streamId) { stream = _lsDashLiveStreams[i]; break; }
  }
  if (!stream) {
    // Fallback: navigate to live streaming screen
    showScreen('liveStreamingScreen');
    return;
  }
  // Same logic as old FAB onclick
  if (_lsApprovedStreamIds[stream.id] ||
      (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) ||
      (typeof isAdminStudent === 'function' && isAdminStudent())) {
    showScreen('liveStreamingScreen');
    _lsHideImmersiveElements();
    setTimeout(function() {
      if (stream.playback_url) _lsWatchStreamDirect(stream.id, stream.playback_url);
    }, 200);
  } else {
    if (stream.playback_url) watchStream(stream.id, stream.playback_url);
  }
}

function _lsChatUpdateBadge() {
  // Tools-bar chat button is the primary target; legacy floating toggle is now hidden via CSS.
  var btn = document.getElementById('lsTbChatBtn') || document.getElementById('lsChatToggleBtn');
  if (!btn) return;
  var badge = document.getElementById('lsChatUnreadBadge');
  if (_lsChatUnreadCount > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'lsChatUnreadBadge';
      badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#22c55e;color:#fff;font-size:11px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;';
      btn.style.position = 'relative';
      btn.appendChild(badge);
    }
    badge.textContent = _lsChatUnreadCount > 9 ? '9+' : _lsChatUnreadCount;
  } else if (badge) {
    badge.remove();
  }
}

/* ── Toggle chat visibility (student can hide to see stream bigger) ── */
var _lsChatHidden = false;
function lsToggleChat() {
  _lsChatUnreadCount = 0;
  _lsChatUpdateBadge();
  _lsChatHidden = !_lsChatHidden;
  var chatSection = document.getElementById('lsChatSection');
  var toggleBtn = document.getElementById('lsChatToggleBtn');
  var playerContainer = document.getElementById('lsPlayerContainer');
  var tbChatBtn = document.getElementById('lsTbChatBtn');
  if (_lsChatHidden) {
    if (chatSection) chatSection.style.setProperty('display', 'none', 'important');
    if (toggleBtn) toggleBtn.style.setProperty('display', 'flex', 'important');
    if (tbChatBtn) tbChatBtn.textContent = '💬 Abrir Chat';
    // Expand video: use viewport height in both portrait and landscape
    if (playerContainer) {
      playerContainer.style.setProperty('padding-bottom', '0', 'important');
      playerContainer.style.setProperty('height', '100vh', 'important');
      playerContainer.style.setProperty('height', '100dvh', 'important');
    }
  } else {
    if (chatSection) { chatSection.style.setProperty('display', 'flex', 'important'); chatSection.style.flexDirection = 'column'; }
    if (toggleBtn) toggleBtn.style.setProperty('display', 'none', 'important');
    if (tbChatBtn) tbChatBtn.textContent = '💬 Chat';
    // Restore 16:9
    if (playerContainer) {
      playerContainer.style.paddingBottom = '56.25%';
      playerContainer.style.removeProperty('height');
    }
  }
}

/* ── Tab switching ──────────────────────────────────────────── */
function lsSwitchTab(tab) {
  var tabLive = document.getElementById('lsTabLive');
  var tabVod = document.getElementById('lsTabVod');
  var streamList = document.getElementById('lsStreamList');
  var vodList = document.getElementById('lsVodList');

  if (tab === 'live') {
    if (tabLive) { tabLive.style.background = '#FF3B30'; tabLive.style.color = '#fff'; tabLive.style.border = 'none'; }
    if (tabVod) { tabVod.style.background = '#FFFFFF'; tabVod.style.color = '#111111'; tabVod.style.border = '1px solid rgba(0,0,0,0.1)'; }
    if (streamList) streamList.style.display = '';
    if (vodList) vodList.style.display = 'none';
  } else {
    if (tabVod) { tabVod.style.background = '#007AFF'; tabVod.style.color = '#fff'; tabVod.style.border = 'none'; }
    if (tabLive) { tabLive.style.background = '#FFFFFF'; tabLive.style.color = '#111111'; tabLive.style.border = '1px solid rgba(0,0,0,0.1)'; }
    if (streamList) streamList.style.display = 'none';
    if (vodList) vodList.style.display = '';
    loadRecordings();
  }
}

/* ── Get student's allowed groups ────────────────────────────── */
function _lsGetMyGroups() {
  var email = localStorage.getItem('tecnico_email') || '';
  if (!email) return ['todos'];

  // If admin (CRM or infiltrado), show all — check FIRST
  if ((typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) ||
      (typeof isAdminStudent === 'function' && isAdminStudent())) {
    return ['todos', 'mar_mie', 'sab_dom'];
  }

  var myGroups = ['todos']; // Everyone sees 'todos'

  // === Source 1: CRM student groups (admin-assigned) ===
  // Use zoom-recordings.js if loaded, otherwise use Supabase-cached groups, then localStorage
  var studentGroups = [];
  if (typeof getStudentGroupsForEmail === 'function') {
    studentGroups = getStudentGroupsForEmail(email);
  } else if (_lsCachedStudentGroups && _lsCachedStudentGroups.length > 0) {
    studentGroups = _lsCachedStudentGroups;
  } else {
    // Fallback: read persisted CRM groups from localStorage
    try {
      var _lsStoredGroups = JSON.parse(localStorage.getItem('maestroac_student_groups_' + email.toLowerCase()));
      if (_lsStoredGroups && Array.isArray(_lsStoredGroups) && _lsStoredGroups.length > 0) {
        studentGroups = _lsStoredGroups;
      }
    } catch(e) { /* ignore */ }
  }
  if (studentGroups.length > 0) {
    // Blocked students get NO class access — only 'todos'
    if (studentGroups.indexOf('bloqueado') !== -1) return myGroups;

    // mar_mie: Híbridos + WhatsApp $99 + Telegram
    var marMieIds = ['hibridos', 'hibridos_presencial', 'hibridos_enlinea', 'whatsapp_99', 'telegram'];
    for (var i = 0; i < marMieIds.length; i++) {
      if (studentGroups.indexOf(marMieIds[i]) !== -1) {
        if (myGroups.indexOf('mar_mie') === -1) myGroups.push('mar_mie');
        break;
      }
    }
    // sab_dom: Trinidad + WhatsApp $299 (all Sáb/Dom students)
    var sabDomIds = ['trinidad', 'trinidad_presencial', 'trinidad_enlinea', 'whatsapp_299'];
    for (var i = 0; i < sabDomIds.length; i++) {
      if (studentGroups.indexOf(sabDomIds[i]) !== -1) {
        if (myGroups.indexOf('sab_dom') === -1) myGroups.push('sab_dom');
        if (myGroups.indexOf('trinidad') === -1) myGroups.push('trinidad');
        break;
      }
    }
    // whatsapp_299 also gets mar_mie
    if (studentGroups.indexOf('whatsapp_299') !== -1) {
      if (myGroups.indexOf('mar_mie') === -1) myGroups.push('mar_mie');
    }

    // === Tier groups (auto-assigned by Stripe webhook) ===
    // membresia_119 → mar_mie access
    if (studentGroups.indexOf('membresia_119') !== -1) {
      if (myGroups.indexOf('mar_mie') === -1) myGroups.push('mar_mie');
    }
    // membresia_299 → all groups (VIP $299+)
    if (studentGroups.indexOf('membresia_299') !== -1) {
      if (myGroups.indexOf('mar_mie') === -1) myGroups.push('mar_mie');
      if (myGroups.indexOf('sab_dom') === -1) myGroups.push('sab_dom');
      if (myGroups.indexOf('trinidad') === -1) myGroups.push('trinidad');
    }
  }

  // === Source 2: Active membership fallback (Stripe/manual) ===
  // If student has active membership but isn't in CRM groups yet, grant access by amount
  // Skip if student is blocked
  if (studentGroups.indexOf('bloqueado') !== -1) return myGroups;
  var amt = 0;
  if (typeof currentMembership !== 'undefined' && currentMembership && currentMembership.activa) {
    amt = parseFloat(currentMembership.amount) || 0;
  }
  if (!amt) {
    try {
      var _lsCache = JSON.parse(localStorage.getItem('maestroac_membership_cache_' + email.toLowerCase()));
      if (_lsCache && _lsCache.activa) amt = parseFloat(_lsCache.amount) || 0;
    } catch(e) { /* ignore */ }
  }
  // $149+ → mar_mie (Premium tier — live classes Tue/Wed)
  if (amt >= 140 && myGroups.indexOf('mar_mie') === -1) {
    myGroups.push('mar_mie');
  }
  // $299+ → sab_dom (VIP tier — all live classes)
  if (amt >= 250) {
    if (myGroups.indexOf('sab_dom') === -1) myGroups.push('sab_dom');
    if (myGroups.indexOf('mar_mie') === -1) myGroups.push('mar_mie');
  }

  return myGroups;
}

/* ── Load live streams ──────────────────────────────────────── */
async function loadLiveStreams() {
  var list = document.getElementById('lsStreamList');
  if (!list) return;

  if (!supabaseClient) {
    list.innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:48px;margin-bottom:12px;">📡</div><div style="color:#111111;font-size:15px;font-weight:600;">' + _t('ls_connecting','Conectando...') + '</div></div>';
    return;
  }

  try {
    var { data, error } = await supabaseClient
      .from('live_streams')
      .select('*')
      .in('status', ['scheduled', 'live'])
      .order('scheduled_at', { ascending: true, nullsFirst: false });

    if (error) throw error;

    // Use real CRM groups — students only see streams for their assigned group
    var myGroups = _lsGetMyGroups();
    var allStreams = data || [];

    if (allStreams.length === 0) {
      list.innerHTML =
        '<div style="text-align:center;padding:40px;">' +
          '<div style="font-size:48px;margin-bottom:12px;">📅</div>' +
          '<div style="color:#111111;font-size:16px;font-weight:700;">' + _t('ls_no_streams_scheduled','No hay clases programadas') + '</div>' +
          '<div style="color:#111111;font-size:13px;margin-top:4px;">' + _t('ls_check_recordings','Revisa las grabaciones o vuelve después') + '</div>' +
        '</div>';
      return;
    }

    // AUTO-ENTER: If there's exactly one live stream the user CAN access, go directly
    var accessibleLive = allStreams.filter(function(s) {
      return s.status === 'live' && (!s.class_group || myGroups.indexOf(s.class_group) !== -1);
    });
    if (accessibleLive.length === 1) {
      watchStream(accessibleLive[0].id, accessibleLive[0].playback_url || '');
      return;
    }

    var html = '';
    for (var i = 0; i < allStreams.length; i++) {
      var s = allStreams[i];
      var isLive = s.status === 'live';
      var canAccess = !s.class_group || myGroups.indexOf(s.class_group) !== -1;
      var badge = isLive
        ? '<span style="background:#34c759;color:#fff;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:800;animation:lsa-pulse 1.5s infinite;letter-spacing:0.5px;">' + _t('ls_badge_live','EN VIVO') + '</span>'
        : '<span style="background:rgba(234,179,8,0.15);color:#b45309;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:700;">' + _t('ls_badge_scheduled','Programado') + '</span>';

      var clickAction = '';
      if (isLive && canAccess) {
        clickAction = 'watchStream(\'' + _lsJsEsc(s.id) + '\',\'' + _lsJsEsc(s.playback_url || '') + '\')';
      }

      var cardBorder = isLive ? (canAccess ? '1px solid rgba(52,199,89,0.35);border-left:4px solid #34c759;' : '1px solid rgba(255,59,48,0.2);') : '1px solid rgba(0,0,0,0.08);';
      html += '<div onclick="' + clickAction + '" style="background:#FFFFFF;' + cardBorder + 'border-radius:16px;padding:14px;margin-bottom:10px;cursor:' + (isLive ? 'pointer' : 'default') + ';transition:border-color .2s,transform .15s;box-shadow:0 2px 8px rgba(0,0,0,0.06);' + (!canAccess ? 'opacity:0.85;' : '') + '">' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">' +
          badge +
          '<span style="color:#111111;font-weight:700;font-size:15px;">' + _lsEsc(s.title) + '</span>' +
        '</div>' +
        (s.description ? '<div style="color:#111111;font-size:14px;margin-bottom:6px;">' + _lsEsc(s.description) + '</div>' : '') +
        '<div style="color:#111111;font-size:13px;">' +
          (s.instructor_name ? '👨‍🏫 ' + _lsEsc(s.instructor_name) + ' · ' : '') +
          (s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString((localStorage.getItem('app_language')||(navigator.language||'es')).indexOf('en')===0?'en-US':'es-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '') +
        '</div>' +
        (isLive && canAccess ? '<div style="color:#FF3B30;font-size:13px;margin-top:8px;font-weight:700;">' + _t('ls_tap_watch_live','▶ Toca para ver el stream en vivo') + '</div>' : '') +
        (isLive && !canAccess ? '<div style="color:#4338ca;font-size:13px;margin-top:8px;font-weight:700;">🎓 ' + _t('ls_contact_enroll', 'Contacta para inscribirte') + '</div>' : '') +
      '</div>';
    }

    list.innerHTML = html;
  } catch (e) {
    console.error('[LiveStreaming] Load error:', e);
    list.innerHTML = '<div style="text-align:center;padding:40px;color:#ef4444;">' + (typeof _t === 'function' ? _t('ls_error_loading_streams') : 'Error cargando streams') + '</div>';
  }
}

/* ── Load VOD recordings ────────────────────────────────────── */
async function loadRecordings() {
  var list = document.getElementById('lsVodList');
  if (!list) return;

  if (!supabaseClient) {
    list.innerHTML = '<div style="text-align:center;padding:20px;color:#111111;font-size:14px;font-weight:600;">Conectando...</div>';
    return;
  }

  try {
    var { data, error } = await supabaseClient
      .from('stream_recordings')
      .select('*, live_streams(title, description, instructor_name, class_group)')
      .eq('status', 'ready')
      .eq('visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter by student's groups
    var myGroups = _lsGetMyGroups();
    data = (data || []).filter(function(r) {
      var group = r.live_streams ? r.live_streams.class_group : 'todos';
      return !group || myGroups.indexOf(group) !== -1;
    });

    // Cache recordings and preload quiz progress
    _lsVodRecordingsCache = data;
    await _lsLoadVodQuizPassed();

    if (!data || data.length === 0) {
      list.innerHTML =
        '<div style="text-align:center;padding:40px;">' +
          '<div style="font-size:48px;margin-bottom:12px;">🎬</div>' +
          '<div style="color:#111111;font-size:16px;font-weight:700;">No hay grabaciones disponibles</div>' +
        '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var stream = r.live_streams || {};
      var dur = r.duration_seconds ? Math.round(r.duration_seconds / 60) + ' min' : '';
      var date = new Date(r.created_at).toLocaleDateString('es-US', { month: 'short', day: 'numeric', year: 'numeric' });
      var hasQuiz = r.quiz_questions && r.quiz_questions.length > 0;
      var quizPassed = hasQuiz && _lsVodQuizPassed[r.id];
      var quizBadge = '';
      if (hasQuiz) {
        quizBadge = quizPassed
          ? '<span style="background:rgba(5,150,105,0.15);color:#059669;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:800;">✅ Quiz aprobado</span>'
          : '<span style="background:rgba(59,130,246,0.15);color:#3b82f6;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:800;">📝 Quiz</span>';
      }

      html += '<div onclick="watchRecording(\'' + _lsJsEsc(r.playback_url || '') + '\',\'' + _lsJsEsc(stream.title || 'Grabación') + '\',\'' + _lsJsEsc(r.stream_id || '') + '\',\'' + _lsJsEsc(r.id || '') + '\')" style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-left:4px solid #7c3aed;border-radius:16px;padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color .2s,transform .15s;box-shadow:0 2px 8px rgba(0,0,0,0.06);">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">' +
          '<span style="background:rgba(124,58,237,0.15);color:#7c3aed;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:800;letter-spacing:0.5px;">VOD</span>' +
          quizBadge +
          '<span style="color:#111111;font-weight:700;font-size:15px;">' + _lsEsc(stream.title || 'Grabación') + '</span>' +
        '</div>' +
        '<div style="color:#111111;font-size:13px;display:flex;gap:12px;">' +
          (dur ? '<span>⏱ ' + _lsEsc(dur) + '</span>' : '') +
          '<span>📅 ' + date + '</span>' +
          (stream.instructor_name ? '<span>👨‍🏫 ' + _lsEsc(stream.instructor_name) + '</span>' : '') +
        '</div>' +
        '<div style="color:#007AFF;font-size:13px;margin-top:8px;font-weight:700;">' + _t('ls_watch_recording','▶ Ver grabación') + '</div>' +
      '</div>';
    }

    list.innerHTML = html;
  } catch (e) {
    console.error('[LiveStreaming] Recordings error:', e);
    list.innerHTML = '<div style="text-align:center;padding:40px;color:#ef4444;">' + (typeof _t === 'function' ? _t('ls_error_loading_recordings') : 'Error cargando grabaciones') + '</div>';
  }
}

/* ── Watch live stream (GATED — requires verification + waiting room) ── */
function watchStream(streamId, playbackUrl) {
  // Admin bypass — admins enter without verification
  if ((typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) ||
      (typeof isAdminStudent === 'function' && isAdminStudent())) {
    if (playbackUrl) {
      _lsWatchStreamDirect(streamId, playbackUrl);
    } else {
      _lsWaitForPlaybackUrl(streamId);
    }
    return;
  }

  // Already approved for this stream in this session? Enter directly
  if (_lsApprovedStreamIds[streamId]) {
    if (playbackUrl) {
      _lsWatchStreamDirect(streamId, playbackUrl);
    } else {
      _lsWaitForPlaybackUrl(streamId);
    }
    return;
  }

  // Not verified — load stream info and show verification modal
  // (does NOT require playback URL — students enter waiting room first)
  if (!supabaseClient) return;
  supabaseClient.from('live_streams')
    .select('id, title, playback_url, class_group, instructor_name')
    .eq('id', streamId).single().then(function(res) {
      if (res.data) {
        _lsVerifyStream = res.data;
        _lsShowVerifyModal(res.data);
      }
    }).catch(function(e) { console.warn('[LiveStream] Error loading stream info for verify:', e); });
}

/* ── Wait for playback URL to appear in Supabase (polls every 3s) ── */
function _lsWaitForPlaybackUrl(streamId) {
  var playerSection = document.getElementById('lsPlayerSection');
  var chatSection = document.getElementById('lsChatSection');
  if (playerSection) playerSection.style.display = '';
  if (chatSection) { chatSection.style.setProperty('display', 'flex', 'important'); chatSection.style.flexDirection = 'column'; }
  _lsHideImmersiveElements();

  // Show waiting overlay on top of player (do NOT destroy video/iframe with innerHTML!)
  var container = document.getElementById('lsPlayerContainer');
  var oldOverlay = document.getElementById('lsWaitOverlay');
  if (oldOverlay) oldOverlay.remove();
  if (container) {
    var overlay = document.createElement('div');
    overlay.id = 'lsWaitOverlay';
    overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a;z-index:5;';
    overlay.innerHTML =
      '<div style="font-size:48px;margin-bottom:12px;animation:lsa-pulse 1.5s infinite;">📡</div>' +
      '<div style="color:#fbbf24;font-size:16px;font-weight:700;">Stream iniciando...</div>' +
      '<div style="color:#e2e8f0;font-size:14px;margin-top:6px;">' + _t('ls_preparing','El instructor está preparando la transmisión') + '</div>' +
      '<div id="lsUrlWaitDots" style="color:#cbd5e1;font-size:24px;margin-top:12px;">...</div>';
    container.appendChild(overlay);
  }

  // Subscribe to chat while waiting
  subscribeToStreamChat(streamId);
  loadStreamChatHistory(streamId);
  lsJoinViewerPresence(streamId);
  try { lsInitParticipation(streamId); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  // Subscribe to console channels (polls, Q&A, countdown, slow mode)
  if (typeof _lsSubscribeConsole === 'function') _lsSubscribeConsole(streamId);

  // Poll Supabase for playback_url every 3s
  if (_lsUrlPollInterval) { clearInterval(_lsUrlPollInterval); _lsUrlPollInterval = null; }
  var _urlPollCount = 0;
  var _urlPollMax = 60; // 3 minutes max
  _lsUrlPollInterval = setInterval(function() {
    _urlPollCount++;
    var dots = document.getElementById('lsUrlWaitDots');
    if (dots) dots.textContent = '.'.repeat((_urlPollCount % 3) + 1);

    supabaseClient.from('live_streams').select('playback_url').eq('id', streamId).single().then(function(res) {
      if (res.data && res.data.playback_url) {
        clearInterval(_lsUrlPollInterval); _lsUrlPollInterval = null;
        console.log('[LiveStream] Playback URL arrived:', res.data.playback_url);
        // Remove waiting overlay (video/iframe preserved underneath)
        var waitOverlay = document.getElementById('lsWaitOverlay');
        if (waitOverlay) waitOverlay.remove();
        // Re-enter with the URL
        _lsCurrentStreamId = null; // Reset to allow re-entry
        _lsWatchStreamDirect(streamId, res.data.playback_url);
      }
    }).catch(function(e) {});

    if (_urlPollCount >= _urlPollMax) {
      clearInterval(_lsUrlPollInterval); _lsUrlPollInterval = null;
      var waitOv = document.getElementById('lsWaitOverlay');
      if (waitOv) waitOv.innerHTML =
        '<div style="color:#ef4444;font-size:16px;">No se pudo conectar al stream</div>' +
        '<button onclick="location.reload()" style="margin-top:12px;background:#3b82f6;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">Recargar</button>';
    }
  }, 3000);
}

/* ── Hide all non-essential UI for immersive stream view ──── */
function _lsHideImmersiveElements() {
  var hideIds = ['lsHeader', 'lsMyGroupBadge', 'lsTabsContainer', 'lsStreamList', 'lsVodList', 'lsLiveAlert', 'notifBellContainer'];
  hideIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.cssText += ';display:none!important';
  });
  var bottomNav = document.querySelector('.mobile-bottom-nav');
  if (bottomNav) bottomNav.style.cssText += ';display:none!important';
  var homeFab = document.querySelector('.home-fab');
  if (homeFab) homeFab.style.cssText += ';display:none!important';
  var contentArea = document.getElementById('lsContentArea');
  if (contentArea) contentArea.style.padding = '0';
}

/* ── Fullscreen toggle for student player ──────────────────── */
function _lsIsIPhone() { return /iPhone/.test(navigator.userAgent) && !window.MSStream; }

function _lsToggleFullscreen() {
  var vid = document.getElementById('lsPlayerVideo');
  var pc = document.getElementById('lsPlayerContainer');

  // Check if already fullscreen (including iOS native)
  var isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
  if (isFS) {
    // Exit fullscreen — unlock orientation
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    return;
  }

  // iPhone: ONLY video.webkitEnterFullscreen works (no requestFullscreen on divs)
  if (_lsIsIPhone() && vid && vid.webkitEnterFullscreen) {
    vid.webkitEnterFullscreen();
    return;
  }

  // All other platforms: fullscreen the player container
  if (!pc) return;
  // Clear inline height/padding that might conflict with :fullscreen CSS
  pc.style.removeProperty('height');

  var fsPromise = null;
  if (pc.requestFullscreen) fsPromise = pc.requestFullscreen();
  else if (pc.webkitRequestFullscreen) { pc.webkitRequestFullscreen(); fsPromise = Promise.resolve(); }
  else if (pc.mozRequestFullScreen) { pc.mozRequestFullScreen(); fsPromise = Promise.resolve(); }
  else if (vid && vid.webkitEnterFullscreen) { vid.webkitEnterFullscreen(); return; }

  // After fullscreen confirmed, lock to landscape (Android)
  var lockLandscape = function() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function(e) { console.warn('[LS] orientation lock:', e.message); });
      }
    } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  };
  if (fsPromise && fsPromise.then) {
    fsPromise.then(function() {
      lockLandscape();
      // Fix Android partial rendering bug
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 150);
    }).catch(function(e) {
      console.warn('[LS] fullscreen failed:', e);
      lockLandscape(); // try anyway
    });
  } else {
    setTimeout(lockLandscape, 300);
  }
}
// Tap video to toggle fullscreen (mobile UX)
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'lsPlayerVideo' && e.target.style.display !== 'none') {
    _lsToggleFullscreen();
  }
});
function _lsUpdateFullscreenBtn() {
  var btn = document.getElementById('lsFullscreenBtn');
  if (btn) {
    var isFS = document.fullscreenElement || document.webkitFullscreenElement;
    btn.textContent = isFS ? _tc('ls_fullscreen_exit', '\u26F6 Salir') : _tc('ls_fullscreen_enter', '\u26F6 Completa');
  }
}
// Restore container after exit fullscreen
function _lsOnFullscreenExit() {
  _lsUpdateFullscreenBtn();
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    var pc = document.getElementById('lsPlayerContainer');
    if (pc) {
      if (_lsChatHidden) {
        pc.style.setProperty('padding-bottom', '0', 'important');
        pc.style.setProperty('height', '100dvh', 'important');
      } else {
        pc.style.paddingBottom = '56.25%';
        pc.style.removeProperty('height');
      }
    }
  }
}
document.addEventListener('fullscreenchange', _lsOnFullscreenExit);
document.addEventListener('webkitfullscreenchange', _lsOnFullscreenExit);
document.addEventListener('mozfullscreenchange', _lsOnFullscreenExit);

/* ── Offline detection — immediate banner on network loss ───── */
var _lsOfflineBanner = null;
function _lsShowOfflineBanner() {
  if (_lsOfflineBanner) return;
  _lsOfflineBanner = document.createElement('div');
  _lsOfflineBanner.id = 'lsOfflineBanner';
  _lsOfflineBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999998;background:#ef4444;color:#fff;text-align:center;padding:10px 16px;font-size:14px;font-weight:700;';
  _lsOfflineBanner.textContent = _tc('ls_offline_reconnecting', 'Sin conexión a internet — reconectando...');
  document.body.appendChild(_lsOfflineBanner);
}
function _lsHideOfflineBanner() {
  if (_lsOfflineBanner) { _lsOfflineBanner.remove(); _lsOfflineBanner = null; }
}
window.addEventListener('offline', _lsShowOfflineBanner);
window.addEventListener('online', function() {
  _lsHideOfflineBanner();
  // Auto-reload player when back online
  if (_lsHlsPlayer && _lsCurrentStreamId) {
    setTimeout(function() { lsReloadPlayer(); }, 1500);
  }
});

/* ── Optimized HLS.js config for live streams ─────────────── */
var _LS_HLS_LIVE_CONFIG = {
  enableWorker: true,
  lowLatencyMode: true,
  liveSyncDurationCount: 3,        // Stay 3 segments behind live edge
  liveMaxLatencyDurationCount: 10, // Max 10 segments before forced catch-up (was 8)
  maxBufferLength: 30,             // Buffer up to 30s ahead (was 10 — too aggressive)
  maxMaxBufferLength: 60,          // Absolute max buffer (was 30)
  backBufferLength: 15,            // Keep 15s of back-buffer for smooth rewinds (was 5)
  capLevelOnFPSDrop: true,         // Auto-downgrade quality on frame drops
  capLevelToPlayerSize: true,      // Don't decode higher res than player size
  startLevel: -1,                  // Auto-select initial quality
  progressive: true,               // Progressive segment loading
  liveSyncOnStallIncrease: 2,      // Add 2 segments on stall for faster recovery (was 1)
  nudgeMaxRetry: 10,               // More retries before erroring (was 5)
  fragLoadingTimeOut: 20000,       // 20s timeout for fragment loading (default 60s too long)
  fragLoadingMaxRetry: 6,          // Retry fragment load 6 times
  fragLoadingRetryDelay: 1000,     // 1s between retries
  levelLoadingTimeOut: 15000,      // 15s timeout for level/playlist loading
  levelLoadingMaxRetry: 4,         // Retry level load 4 times
  manifestLoadingTimeOut: 15000,   // 15s timeout for manifest loading
  manifestLoadingMaxRetry: 4,      // Retry manifest load 4 times
};

/* ── Shared HLS error handler ──────────────────────────────── */
var _lsHlsConsecutiveErrors = 0;
var _LS_HLS_MAX_RETRIES = 5;

function _lsDestroyAndRecreateHls() {
  var videoEl = document.getElementById('lsPlayerVideo');
  var url = _lsCurrentPlaybackUrl;
  if (!videoEl || !url) return;
  console.warn('[LiveStream] Destroying HLS player and recreating with URL:', url);
  if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
  _lsHlsPlayer = new Hls(_LS_HLS_LIVE_CONFIG);
  _lsHlsPlayer.loadSource(url);
  _lsHlsPlayer.attachMedia(videoEl);
  _lsHlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
    videoEl.play().catch(function(e) { console.warn('[LiveStream] HLS autoplay blocked on recreate:', e); });
  });
  _lsAttachHlsErrorHandler(_lsHlsPlayer);
  _lsStartLatencyCatchup(videoEl);
}

function _lsAttachHlsErrorHandler(hls) {
  hls.on(Hls.Events.ERROR, function(event, data) {
    if (data.fatal) {
      _lsHlsConsecutiveErrors++;
      console.error('[LiveStream] HLS fatal #' + _lsHlsConsecutiveErrors + ':', data.type, data.details);
      if (_lsHlsConsecutiveErrors > _LS_HLS_MAX_RETRIES) {
        console.error('[LiveStream] Max HLS retries reached (' + _LS_HLS_MAX_RETRIES + '). Giving up.');
        _lsChatToast('Error de video persistente. Toca Recargar para reintentar.', 'error');
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        if (_lsHlsConsecutiveErrors <= 2) {
          var delay = 2000 * Math.pow(2, _lsHlsConsecutiveErrors - 1);
          console.warn('[LiveStream] NETWORK_ERROR attempt ' + _lsHlsConsecutiveErrors + ', retrying startLoad in ' + delay + 'ms');
          setTimeout(function() { if (hls && hls.media) { try { hls.startLoad(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } } }, delay);
        } else {
          console.warn('[LiveStream] NETWORK_ERROR attempt ' + _lsHlsConsecutiveErrors + ', destroying and recreating HLS player');
          setTimeout(function() { _lsDestroyAndRecreateHls(); }, 1000);
        }
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        try {
          hls.recoverMediaError();
        } catch(e) {
          console.warn('[LiveStream] recoverMediaError threw, destroying and recreating:', e);
          setTimeout(function() { _lsDestroyAndRecreateHls(); }, 1000);
        }
      }
    }
  });
  // Reset consecutive error counter on successful fragment load
  hls.on(Hls.Events.FRAG_LOADED, function() {
    if (_lsHlsConsecutiveErrors > 0) {
      console.log('[LiveStream] Fragment loaded successfully, resetting error counter');
      _lsHlsConsecutiveErrors = 0;
    }
  });
}

/* ── Latency catch-up: gradual speed-up or seek to live edge ── */
var _lsLatencyTimer = null;
function _lsStartLatencyCatchup(videoEl) {
  _lsStopLatencyCatchup();
  _lsLatencyTimer = setInterval(function() {
    if (!videoEl || videoEl.paused || videoEl.ended || !_lsHlsPlayer) return;
    try {
      var liveEdge = _lsHlsPlayer.liveSyncPosition;
      if (liveEdge && !isNaN(liveEdge) && videoEl.currentTime > 0) {
        var drift = liveEdge - videoEl.currentTime;
        if (drift > 20) {
          // Extreme drift: hard seek to live edge (unavoidable)
          console.warn('[LiveStream] Latency drift ' + drift.toFixed(1) + 's — seeking to live edge');
          videoEl.currentTime = liveEdge - 2;
          videoEl.playbackRate = 1.0;
          _lsChatToast(_t('ls_syncing','Sincronizando con transmisión en vivo...'), 'info');
        } else if (drift > 8) {
          // Moderate drift: speed up playback to catch up gradually (no audio cut)
          if (videoEl.playbackRate < 1.05) {
            console.log('[LiveStream] Drift ' + drift.toFixed(1) + 's — speeding up to 1.05x');
            videoEl.playbackRate = 1.05;
          }
        } else if (drift < 5 && videoEl.playbackRate !== 1.0) {
          // Caught up: restore normal speed
          videoEl.playbackRate = 1.0;
        }
      }
    } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  }, 5000);
}
function _lsStopLatencyCatchup() {
  if (_lsLatencyTimer) { clearInterval(_lsLatencyTimer); _lsLatencyTimer = null; }
  // Restore normal playback rate on cleanup
  var v = document.getElementById('lsPlayerVideo');
  if (v) v.playbackRate = 1.0;
}

/* ── Buffering spinner overlay ─────────────────────────────── */
function _lsShowBufferingSpinner() {
  var c = document.getElementById('lsPlayerContainer');
  if (!c || document.getElementById('lsBufferingSpinner')) return;
  var sp = document.createElement('div');
  sp.id = 'lsBufferingSpinner';
  sp.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:45;background:rgba(0,0,0,0.3);pointer-events:none;';
  sp.innerHTML = '<div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:lsBufSpin .8s linear infinite;"></div>';
  if (!document.getElementById('lsBufSpinStyle')) {
    var s = document.createElement('style'); s.id = 'lsBufSpinStyle';
    s.textContent = '@keyframes lsBufSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }
  c.appendChild(sp);
}
function _lsHideBufferingSpinner() {
  var sp = document.getElementById('lsBufferingSpinner');
  if (sp) sp.remove();
}
var _lsBufferStallTimeout = null;
function _lsAttachBufferingEvents(videoEl) {
  videoEl._lsWaiting = function() {
    _lsShowBufferingSpinner();
    // Safety: if buffering lasts >25s, auto-reload the player
    if (_lsBufferStallTimeout) clearTimeout(_lsBufferStallTimeout);
    _lsBufferStallTimeout = setTimeout(function() {
      _lsBufferStallTimeout = null;
      if (document.getElementById('lsBufferingSpinner')) {
        console.warn('[LiveStream] Buffering stuck >25s — auto-reloading');
        _lsChatToast('Reconectando...', 'warning');
        lsReloadPlayer();
      }
    }, 25000);
  };
  videoEl._lsPlaying = function() {
    _lsHideBufferingSpinner();
    if (_lsBufferStallTimeout) { clearTimeout(_lsBufferStallTimeout); _lsBufferStallTimeout = null; }
  };
  videoEl.addEventListener('waiting', videoEl._lsWaiting);
  videoEl.addEventListener('playing', videoEl._lsPlaying);
}
function _lsDetachBufferingEvents(videoEl) {
  if (videoEl._lsWaiting) { videoEl.removeEventListener('waiting', videoEl._lsWaiting); videoEl._lsWaiting = null; }
  if (videoEl._lsPlaying) { videoEl.removeEventListener('playing', videoEl._lsPlaying); videoEl._lsPlaying = null; }
  if (_lsBufferStallTimeout) { clearTimeout(_lsBufferStallTimeout); _lsBufferStallTimeout = null; }
  _lsHideBufferingSpinner();
}

/* ── Freeze detection: nudge first, then reload if still stuck ── */
var _lsFreezeTimer = null;
var _lsFreezeLastTime = -1;
var _lsFreezeCheckCount = 0;
var _LS_FREEZE_CHECK_INTERVAL = 3000; // check every 3s (was 5s)
var _LS_FREEZE_NUDGE_AT = 2;  // 2 checks = 6s → try nudge/seek first
var _LS_FREEZE_RELOAD_AT = 4; // 4 checks = 12s → full reload

function _lsStartFreezeDetection(videoEl) {
  _lsStopFreezeDetection();
  if (!videoEl) return;
  _lsFreezeLastTime = -1;
  _lsFreezeCheckCount = 0;
  _lsFreezeTimer = setInterval(function() {
    if (!videoEl || videoEl.paused || videoEl.ended) return;
    var ct = videoEl.currentTime;
    if (_lsFreezeLastTime >= 0 && Math.abs(ct - _lsFreezeLastTime) < 0.1) {
      _lsFreezeCheckCount++;
      console.warn('[LiveStream] Freeze detected (' + _lsFreezeCheckCount + '), currentTime stuck at', ct.toFixed(1));
      if (_lsFreezeCheckCount === _LS_FREEZE_NUDGE_AT) {
        // First attempt: nudge player — seek forward slightly + restart load
        console.warn('[LiveStream] Freeze at 6s — attempting nudge recovery');
        try {
          if (_lsHlsPlayer && _lsHlsPlayer.liveSyncPosition) {
            videoEl.currentTime = _lsHlsPlayer.liveSyncPosition - 2;
            _lsHlsPlayer.startLoad();
          } else {
            videoEl.currentTime = ct + 0.5;
          }
          videoEl.play().catch(function(e){});
        } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
      } else if (_lsFreezeCheckCount >= _LS_FREEZE_RELOAD_AT) {
        // Second attempt: full reload
        console.error('[LiveStream] Stream frozen for ' + (_lsFreezeCheckCount * _LS_FREEZE_CHECK_INTERVAL / 1000) + 's — auto-reloading');
        _lsFreezeCheckCount = 0;
        _lsFreezeLastTime = -1;
        _lsChatToast('Video congelado — recargando...', 'warning');
        lsReloadPlayer();
      }
    } else {
      _lsFreezeCheckCount = 0;
    }
    _lsFreezeLastTime = ct;
  }, _LS_FREEZE_CHECK_INTERVAL);
}

function _lsStopFreezeDetection() {
  if (_lsFreezeTimer) { clearInterval(_lsFreezeTimer); _lsFreezeTimer = null; }
  _lsFreezeCheckCount = 0;
  _lsFreezeLastTime = -1;
}

/* ── Visibility recovery: resume playback when student returns to tab/app ── */
function _lsAttachVisibilityRecovery(videoEl) {
  _lsDetachVisibilityRecovery(); // clean up any previous handler
  window._lsVisHandler = function() {
    if (document.visibilityState !== 'visible') return;
    if (!videoEl || !_lsCurrentStreamId) return;
    console.log('[LiveStream] Tab/app visible again — checking playback health');
    // Resume if paused (iOS suspends media in background)
    if (videoEl.paused && !videoEl.ended) {
      videoEl.play().catch(function(e) { console.warn('[LiveStream] Resume play failed:', e); });
    }
    // Seek to live edge if drifted while in background
    if (_lsHlsPlayer && _lsHlsPlayer.liveSyncPosition) {
      var drift = _lsHlsPlayer.liveSyncPosition - videoEl.currentTime;
      if (drift > 10) {
        console.warn('[LiveStream] Drifted ' + drift.toFixed(1) + 's while hidden — seeking to live');
        videoEl.currentTime = _lsHlsPlayer.liveSyncPosition - 2;
        _lsHlsPlayer.startLoad();
        _lsChatToast('Reconectando al en vivo...', 'info');
      }
    } else if (!_lsHlsPlayer && videoEl.src) {
      // Native HLS (Safari) — poke playback
      videoEl.play().catch(function(e){});
    }
  };
  document.addEventListener('visibilitychange', window._lsVisHandler);
}
function _lsDetachVisibilityRecovery() {
  if (window._lsVisHandler) {
    document.removeEventListener('visibilitychange', window._lsVisHandler);
    window._lsVisHandler = null;
  }
}

function lsReloadPlayer() {
  // HLS mode: destroy and re-create
  var videoEl = document.getElementById('lsPlayerVideo');
  if (videoEl && videoEl.style.display !== 'none' && _lsHlsPlayer) {
    var hlsSrc = _lsHlsPlayer.url || _lsCurrentPlaybackUrl;
    if (!hlsSrc) { console.warn('[LiveStream] No HLS URL available for reload'); return; }
    _lsHlsPlayer.destroy();
    _lsHlsPlayer = new Hls(_LS_HLS_LIVE_CONFIG);
    _lsHlsPlayer.loadSource(hlsSrc);
    _lsHlsPlayer.attachMedia(videoEl);
    _lsHlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
      videoEl.play().catch(function(e) {});
    });
    _lsAttachHlsErrorHandler(_lsHlsPlayer);
    _lsStartLatencyCatchup(videoEl);
  } else if (videoEl && videoEl.style.display !== 'none' && videoEl.src) {
    // Native HLS (Safari) — remove old error handler before reload
    if (videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); videoEl._lsErrorHandler = null; }
    var nativeSrc = videoEl.src;
    videoEl.src = '';
    setTimeout(function() { videoEl.src = nativeSrc; videoEl.play().catch(function(e){}); }, 300);
  }
  // Remove unmute overlay so it re-appears
  var um = document.getElementById('lsUnmuteOverlay');
  if (um) um.remove();
  setTimeout(function() { _lsShowUnmuteOverlay(); }, 2500);
}

/* ── Unmute overlay — shown after autoplay starts muted ──── */
function _lsShowUnmuteOverlay() {
  var existing = document.getElementById('lsUnmuteOverlay');
  if (existing) return; // already shown
  var container = document.getElementById('lsPlayerContainer');
  if (!container) return;
  var overlay = document.createElement('div');
  overlay.id = 'lsUnmuteOverlay';
  overlay.style.cssText = 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:50;' +
    'background:rgba(239,68,68,0.95);color:#fff;padding:12px 28px;border-radius:12px;cursor:pointer;' +
    'font-size:15px;font-weight:700;box-shadow:0 4px 20px rgba(0,0,0,0.5);' +
    'animation:lsUnmutePulse 1.5s infinite;-webkit-tap-highlight-color:transparent;';
  overlay.innerHTML = _tc('ls_tap_activate_audio', '🔊 TOCA PARA ACTIVAR AUDIO');
  overlay.onclick = function() {
    // HLS mode: unmute <video> directly
    var videoEl = document.getElementById('lsPlayerVideo');
    if (videoEl && videoEl.style.display !== 'none') {
      videoEl.muted = false;
      videoEl.play().catch(function(e) {});
    }
    overlay.remove();
  };
  container.appendChild(overlay);
  // Add pulse animation
  if (!document.getElementById('lsUnmuteStyle')) {
    var s = document.createElement('style');
    s.id = 'lsUnmuteStyle';
    s.textContent = '@keyframes lsUnmutePulse{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.05);}}';
    document.head.appendChild(s);
  }
}

/* ── Reconnecting overlay (device switch) ──────────────────── */
/* Semi-transparent spinner over video — does NOT destroy player */
function _lsShowReconnectingOverlay() {
  var container = document.getElementById('lsPlayerContainer');
  if (!container || document.getElementById('lsReconnectingOverlay')) return;
  var ov = document.createElement('div');
  ov.id = 'lsReconnectingOverlay';
  ov.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(15,23,42,0.75);z-index:55;gap:10px;';
  ov.innerHTML = '<div style="font-size:36px;margin-bottom:4px;">📡</div>' +
    '<div style="color:#e2e8f0;font-size:16px;font-weight:700;">' + _t('ls_stream_ended', 'El live streaming ha terminado') + '</div>' +
    '<div style="color:#e2e8f0;font-size:14px;margin-top:4px;">' + _t('ls_waiting_confirm', 'Esperando confirmación...') + '</div>';
  container.appendChild(ov);
  // Add spin animation
  if (!document.getElementById('lsReconSpinStyle')) {
    var s = document.createElement('style');
    s.id = 'lsReconSpinStyle';
    s.textContent = '@keyframes lsReconSpin{to{transform:rotate(360deg);}}';
    document.head.appendChild(s);
  }
}
function _lsRemoveReconnectingOverlay() {
  var ov = document.getElementById('lsReconnectingOverlay');
  if (ov) ov.remove();
}

/* ── Reload player with new HLS URL (after device switch) ──── */
function _lsReloadWithNewUrl(newUrl) {
  var videoEl = document.getElementById('lsPlayerVideo');
  if (!videoEl) return;
  // Destroy existing hls.js instance
  if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
  // Clear native error handler
  if (videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); videoEl._lsErrorHandler = null; }
  videoEl.pause(); videoEl.src = '';

  _lsCurrentPlaybackUrl = newUrl;

  if (typeof Hls !== 'undefined' && Hls.isSupported()) {
    _lsHlsPlayer = new Hls(_LS_HLS_LIVE_CONFIG);
    _lsHlsPlayer.loadSource(newUrl);
    _lsHlsPlayer.attachMedia(videoEl);
    _lsHlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
      videoEl.play().catch(function(e) {});
    });
    _lsAttachHlsErrorHandler(_lsHlsPlayer);
    _lsStartLatencyCatchup(videoEl);
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    // Native Safari HLS with retry logic
    videoEl.src = newUrl;
    var _reloadRetryCount = 0;
    var _reloadMaxRetries = 10;
    if (videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); }
    videoEl._lsErrorHandler = function() {
      if (_reloadRetryCount < _reloadMaxRetries) {
        _reloadRetryCount++;
        console.warn('[LiveStream] Reload native HLS error, retry ' + _reloadRetryCount + '/' + _reloadMaxRetries);
        setTimeout(function() {
          videoEl.src = '';
          setTimeout(function() { videoEl.src = newUrl; videoEl.play().catch(function(e) {}); }, 500);
        }, 2000 * _reloadRetryCount);
      }
    };
    videoEl.addEventListener('error', videoEl._lsErrorHandler);
    videoEl.play().catch(function(e) {});
  }
  // Show unmute overlay after reload
  setTimeout(function() { if (typeof _lsShowUnmuteOverlay === 'function') _lsShowUnmuteOverlay(); }, 2000);
  console.log('[LiveStream] Reloaded player with new URL:', newUrl);
}

/* ── Direct stream access (post-verification) ────────────── */
function _lsWatchStreamDirect(streamId, playbackUrl) {
  // Prevent duplicate calls for the same stream (iOS can trigger multiple times)
  if (_lsCurrentStreamId === streamId) return;
  _lsCurrentStreamId = streamId;

  // Stop radio to prevent audio conflict during live class
  if (typeof stopRadio === 'function') stopRadio();
  // Fallback: force-pause radio audio element directly
  var _radioEl = document.getElementById('radioAudioPlayer');
  if (_radioEl) { try { _radioEl.pause(); _radioEl.src = ''; } catch(e){} }
  var _radioWidget = document.getElementById('dashRadioWidget');
  if (_radioWidget) _radioWidget.style.display = 'none';
  var _podPill = document.getElementById('dashPodcastPill');
  if (_podPill) _podPill.style.display = 'none';

  var playerSection = document.getElementById('lsPlayerSection');
  var iframe = document.getElementById('lsPlayerIframe');
  var chatSection = document.getElementById('lsChatSection');

  var liveBanner = document.getElementById('lsLiveBanner');
  if (liveBanner) liveBanner.style.display = 'none';
  var tabsContainer = document.getElementById('lsTabsContainer');
  if (tabsContainer) tabsContainer.style.display = 'none';
  var streamList = document.getElementById('lsStreamList');
  if (streamList) streamList.style.display = 'none';

  // Hide floating dashboard icons entirely while watching the stream so they never block the video.
  var _lsFloatCompactCss = document.getElementById('lsFloatCompactCss');
  if (!_lsFloatCompactCss) {
    _lsFloatCompactCss = document.createElement('style');
    _lsFloatCompactCss.id = 'lsFloatCompactCss';
    _lsFloatCompactCss.textContent =
      'body.ls-watching-stream #dashProfilePhoto,' +
      'body.ls-watching-stream #dashProfileInitial,' +
      'body.ls-watching-stream #dashMicBtn,' +
      'body.ls-watching-stream #dashXpBadge,' +
      'body.ls-watching-stream #dashXpBadge *,' +
      'body.ls-watching-stream #dashNotifBell,' +
      'body.ls-watching-stream #dashSearchFab,' +
      'body.ls-watching-stream #lsGlobalLiveBadge' +
      '{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(_lsFloatCompactCss);
  }
  document.body.classList.add('ls-watching-stream');

  // Check if student was kicked from this stream (persistent across navigation)
  if (_lsKicked || _lsKickedStreamIds[streamId]) {
    _lsChatToast('Has sido removido de esta clase por el instructor', 'error');
    return;
  }

  // HLS playback via 100ms
  var url = playbackUrl;
  _lsCurrentPlaybackUrl = url; // Track for device-switch URL change detection
  var videoEl = document.getElementById('lsPlayerVideo');

  if (!url) {
    console.warn('[LiveStream] No playback URL yet — falling back to polling');
    _lsCurrentStreamId = null; // Reset to allow re-entry when URL arrives
    _lsWaitForPlaybackUrl(streamId);
    return;
  }

  if (iframe) iframe.style.display = 'none';
  if (videoEl) {
    videoEl.style.display = '';
    videoEl.muted = true; // required for autoplay

    // Cleanup any prior hls.js instance
    if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      _lsHlsPlayer = new Hls(_LS_HLS_LIVE_CONFIG);
      _lsHlsPlayer.loadSource(url);
      _lsHlsPlayer.attachMedia(videoEl);
      _lsHlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
        videoEl.play().catch(function(e) { console.warn('[LiveStream] HLS autoplay blocked:', e); });
      });
      _lsAttachHlsErrorHandler(_lsHlsPlayer);
      _lsStartLatencyCatchup(videoEl);
      _lsAttachBufferingEvents(videoEl);
      _lsShowBufferingSpinner(); // Show spinner immediately while HLS initializes
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari / iOS) with retry logic
      videoEl.src = url;
      var _nativeRetryCount = 0;
      var _nativeMaxRetries = 10; // ~95s window — covers device-switch gap
      videoEl._lsErrorHandler = function() {
        if (_nativeRetryCount < _nativeMaxRetries) {
          _nativeRetryCount++;
          console.warn('[LiveStream] Native HLS error, retry ' + _nativeRetryCount + '/' + _nativeMaxRetries);
          setTimeout(function() {
            videoEl.src = '';
            setTimeout(function() {
              videoEl.src = url;
              videoEl.play().catch(function(e) {});
            }, 500);
          }, 2000 * _nativeRetryCount);
        } else {
          console.error('[LiveStream] Native HLS failed after ' + _nativeMaxRetries + ' retries');
          _lsChatToast('Error de video. Toca Recargar para reintentar.', 'error');
        }
      };
      videoEl.addEventListener('error', videoEl._lsErrorHandler);
      videoEl.play().catch(function(e) { console.warn('[LiveStream] Native HLS autoplay blocked:', e); });
    } else {
      console.error('[LiveStream] HLS not supported in this browser');
      _lsChatToast('Tu navegador no soporta HLS. Usa Safari o Chrome.', 'error');
      return;
    }
    // Detect actual video orientation and adapt container
    // iOS cameras send portrait frames even in landscape; 100ms HLS may not rotate
    videoEl._lsMetaHandler = function() {
      var vw = videoEl.videoWidth || 0;
      var vh = videoEl.videoHeight || 0;
      if (vw && vh) {
        var pc = document.getElementById('lsPlayerContainer');
        if (pc) {
          var isPortrait = vh > vw;
          var ratio = isPortrait ? ((vw / vh) * 100) : ((vh / vw) * 100);
          // Only override if NOT in landscape media query (CSS handles landscape layout)
          if (window.matchMedia && window.matchMedia('(orientation:landscape)').matches) {
            // In landscape: container uses flex:1, no padding-bottom needed
            pc.style.paddingBottom = '0';
          } else {
            // In portrait phone: adapt container to actual video aspect ratio
            pc.style.paddingBottom = ratio.toFixed(2) + '%';
          }
          console.log('[LiveStream] Video dimensions:', vw + 'x' + vh, isPortrait ? '(PORTRAIT)' : '(landscape)', 'ratio:', ratio.toFixed(1) + '%');
        }
      }
    };
    videoEl.addEventListener('loadedmetadata', videoEl._lsMetaHandler);
    // Also check on resize (video may change dimensions mid-stream after device flip)
    videoEl.addEventListener('resize', videoEl._lsMetaHandler);

    // Show floating reload button on the video
    var floatReload = document.getElementById('lsFloatingReload');
    if (floatReload) floatReload.style.display = '';

    // Auto-freeze detection: if video.currentTime doesn't advance, auto-recover
    _lsStartFreezeDetection(videoEl);

    // Recover playback when student returns to tab/app after backgrounding
    _lsAttachVisibilityRecovery(videoEl);

    // Show unmute overlay
    setTimeout(function() { _lsShowUnmuteOverlay(); }, 2000);
  }
  if (playerSection) playerSection.style.display = '';
  if (chatSection) { chatSection.style.setProperty('display', 'flex', 'important'); chatSection.style.flexDirection = 'column'; }

  // HIDE everything except video + chat for clean immersive view
  _lsHideImmersiveElements();

  // Lock viewport zoom to prevent pinch-zoom instability on iPhone/Android
  _lsLockViewportZoom();
  // Prevent iOS Safari gesturestart (two-finger zoom)
  if (!window._lsGestureHandler) {
    window._lsGestureHandler = function(e) { e.preventDefault(); };
    document.addEventListener('gesturestart', window._lsGestureHandler, { passive: false });
  }
  // Force reflow on orientation change + auto-hide chat in landscape for immersive video
  if (!window._lsOrientationHandler) {
    window._lsOrientationHandler = function() {
      setTimeout(function() {
        // iOS Safari reflow hack
        var ca = document.getElementById('lsContentArea');
        if (ca) { void ca.offsetHeight; ca.style.display = 'none'; void ca.offsetHeight; ca.style.display = ''; }
        var pc = document.getElementById('lsPlayerContainer');
        if (pc) { void pc.offsetHeight; }

        // Auto-hide chat in landscape for immersive video
        var isLandscape = window.matchMedia && window.matchMedia('(orientation:landscape)').matches;
        var chatSection = document.getElementById('lsChatSection');
        if (chatSection && window.innerWidth <= 900) {
          if (isLandscape) {
            // Landscape: hide chat for full video, show small toggle
            if (!_lsChatHidden) {
              var chatBtn = document.getElementById('lsChatToggleBtn');
              if (chatBtn) chatBtn.click();
            }
          }
        }

        // Update video container sizing
        if (typeof videoEl !== 'undefined' && videoEl && videoEl._lsMetaHandler) {
          videoEl._lsMetaHandler();
        }
      }, 200);
    };
    window.addEventListener('orientationchange', window._lsOrientationHandler);
    window.addEventListener('resize', window._lsOrientationHandler);
  }

  // Set title
  supabaseClient.from('live_streams').select('title, description').eq('id', streamId).single().then(function(res) {
    if (res.data) {
      var titleEl = document.getElementById('lsPlayerTitle');
      if (titleEl) titleEl.textContent = res.data.title;
    }
  }).catch(function(e) { console.warn('[LiveStream] Error fetching stream title:', e); });

  // Load moderation state before subscribing to chat
  lsLoadModerationState(streamId);

  // Subscribe to chat + console channels
  subscribeToStreamChat(streamId);
  loadStreamChatHistory(streamId);
  if (typeof _lsSubscribeConsole === 'function') _lsSubscribeConsole(streamId);

  // Join viewer presence (for viewer count)
  lsJoinViewerPresence(streamId);

  // Init participation system (raise hand, break timer)
  try { lsInitParticipation(streamId); } catch(e) { console.error('[LiveStream] lsInitParticipation error:', e); }

  // Fallback: ensure camera button is visible for live streams
  setTimeout(function() {
    var camBtn = document.getElementById('lsCameraBtn');
    if (camBtn && camBtn.style.display === 'none') {
      camBtn.style.display = '';
      console.log('[Gallery-Student] Camera button shown via fallback');
    }
  }, 500);

  // Scroll to top
  var content = document.getElementById('lsContentArea');
  if (content) content.scrollTop = 0;

  // Show rotate hint on portrait phone
  if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
    if (typeof _lsChatToast === 'function') {
      setTimeout(function() { _lsChatToast('Gira tu tel\u00e9fono para pantalla completa', 'info'); }, 2000);
    }
  }
}

/* ── Stream ended overlay — shown when instructor stops streaming ── */
function _lsShowStreamEndedOverlay() {
  // Stop HLS playback
  if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
  var videoEl = document.getElementById('lsPlayerVideo');
  if (videoEl) {
    if (videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); videoEl._lsErrorHandler = null; }
    videoEl.pause(); videoEl.src = '';
  }
  // Show overlay
  var playerContainer = document.getElementById('lsPlayerContainer');
  if (playerContainer && !document.getElementById('lsStreamEndedOverlay')) {
    var overlay = document.createElement('div');
    overlay.id = 'lsStreamEndedOverlay';
    overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a;border-radius:12px;z-index:60;gap:12px;';
    overlay.innerHTML = '<div style="color:#ffffff;font-size:18px;font-weight:700;">' + _tc('ls_stream_ended', 'La transmision ha terminado') + '</div>' +
      '<button onclick="lsClosePlayer()" style="background:#3b82f6;color:#fff;border:none;padding:8px 24px;border-radius:8px;font-size:14px;cursor:pointer;">' + _tc('ls_back', 'Volver') + '</button>';
    playerContainer.appendChild(overlay);
  }
  // Restore radio widget + podcast pill after broadcast ends
  var _radioWidget = document.getElementById('dashRadioWidget');
  if (_radioWidget) _radioWidget.style.display = '';
  var _podPill2 = document.getElementById('dashPodcastPill');
  if (_podPill2) _podPill2.style.display = '';
  _lsChatToast(_t('ls_live_ended', 'La transmision en vivo ha terminado'), 'info');
}

/* ── Watch VOD recording ────────────────────────────────────── */
function watchRecording(playbackUrl, title, streamId, recordingId) {
  if (!playbackUrl) { window.showToast(_t('ls_playback_unavailable', 'URL de playback no disponible'), 'warning'); return; }

  _lsCurrentStreamId = null;

  var playerSection = document.getElementById('lsPlayerSection');
  var iframe = document.getElementById('lsPlayerIframe');
  var videoEl = document.getElementById('lsPlayerVideo');
  var chatSection = document.getElementById('lsChatSection');
  var titleEl = document.getElementById('lsPlayerTitle');

  // Cleanup previous HLS player
  if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
  // Clean up native HLS error handler from live stream before VOD
  if (videoEl && videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); videoEl._lsErrorHandler = null; }

  var isDirectVideo = playbackUrl.indexOf('.mp4') !== -1 || playbackUrl.indexOf('.m3u8') !== -1 || playbackUrl.indexOf('.webm') !== -1 || playbackUrl.indexOf('/storage/') !== -1;
  var isDriveVideo = playbackUrl.indexOf('drive.google.com') !== -1;
  var isCfStream = playbackUrl.indexOf('cloudflarestream.com') !== -1;

  if (isDriveVideo) {
    // Google Drive recording — open in new tab (iframe embedding blocked by Google CSP)
    var driveView = playbackUrl.replace('/preview', '/view');
    window.open(driveView, '_blank');
    return;
  } else if (isCfStream && iframe) {
    // Cloudflare Stream recording — use iframe embed or convert to HLS for <video>
    if (videoEl) videoEl.style.display = 'none';
    // Ensure URL ends in /iframe for proper embed
    var cfUrl = playbackUrl;
    if (cfUrl.indexOf('/iframe') === -1) cfUrl = cfUrl.replace(/\/?$/, '/iframe');
    iframe.style.display = '';
    iframe.src = cfUrl;
  } else if (isDirectVideo && videoEl) {
    // Use <video> tag for direct video files (100ms recordings, mp4, m3u8, webm)
    if (iframe) iframe.style.display = 'none';
    videoEl.style.display = '';
    videoEl.muted = false;

    if (playbackUrl.indexOf('.m3u8') !== -1 && typeof Hls !== 'undefined' && Hls.isSupported()) {
      _lsHlsPlayer = new Hls({ enableWorker: true });
      _lsHlsPlayer.loadSource(playbackUrl);
      _lsHlsPlayer.attachMedia(videoEl);
      _lsHlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
        videoEl.play().catch(function(e) {});
      });
      _lsHlsPlayer.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setTimeout(function() { if (_lsHlsPlayer) _lsHlsPlayer.startLoad(); }, 3000);
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            _lsHlsPlayer.recoverMediaError();
          }
        }
      });
    } else if (playbackUrl.indexOf('.m3u8') !== -1 && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = playbackUrl;
      videoEl.play().catch(function(e) {});
    } else {
      videoEl.src = playbackUrl;
      videoEl.play().catch(function(e) {});
    }
  } else if (videoEl) {
    // Fallback: try playing any URL directly in <video> element
    if (iframe) iframe.style.display = 'none';
    videoEl.style.display = '';
    videoEl.muted = false;
    videoEl.src = playbackUrl;
    videoEl.play().catch(function(e) {});
  }

  if (playerSection) playerSection.style.display = '';
  if (chatSection) chatSection.style.setProperty('display', 'none', 'important');
  if (titleEl) titleEl.textContent = title || _tc('ls_recording', 'Grabación');

  var content = document.getElementById('lsContentArea');
  if (content) content.scrollTop = 0;

  // Log VOD view attendance
  if (streamId) {
    try {
      var email = localStorage.getItem('tecnico_email') || '';
      var name = ''; try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } name = name || 'Estudiante';
      if (email) {
        supabaseClient.from('stream_attendance').insert({
          stream_id: streamId,
          student_email: email,
          student_name: name,
          joined_at: new Date().toISOString(),
          source: 'vod'
        }).then(function() {}).catch(function(e) { console.warn('[LiveStream] VOD attendance log failed:', e); });
      }
    } catch(e) { console.warn('[LiveStream] VOD attendance error:', e); }
  }

  // Remove previous quiz CTA if exists
  var oldCta = document.getElementById('lsVodQuizCta');
  if (oldCta) oldCta.remove();

  // Inject quiz CTA below player if recording has quiz
  if (recordingId) {
    var rec = _lsVodRecordingsCache.find(function(r) { return r.id === recordingId; });
    if (rec && rec.quiz_questions && rec.quiz_questions.length > 0) {
      var qPassed = _lsVodQuizPassed[recordingId];
      var ctaDiv = document.createElement('div');
      ctaDiv.id = 'lsVodQuizCta';
      ctaDiv.style.cssText = 'text-align:center;padding:14px 12px;';
      ctaDiv.innerHTML = qPassed
        ? '<div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">' +
            '<span style="color:#059669;font-weight:700;font-size:14px;">✅ Quiz aprobado</span>' +
            '<button onclick="lsStartVodQuiz(\'' + _lsJsEsc(recordingId) + '\')" style="background:transparent;border:1px solid #3b82f6;color:#3b82f6;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Repetir Quiz</button>' +
          '</div>'
        : '<button onclick="lsStartVodQuiz(\'' + _lsJsEsc(recordingId) + '\')" style="background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(37,99,235,0.3);">📝 Tomar Quiz</button>';
      if (playerSection) playerSection.insertAdjacentElement('afterend', ctaDiv);
    }
  }
}

/* ── Close player ───────────────────────────────────────────── */
function lsClosePlayer() {
  _lsCurrentStreamId = null; // Reset so re-entering same stream triggers immersive mode
  _lsChatHidden = false; // Reset chat visibility state
  _lsKicked = false; // Reset in-memory flag (sessionStorage persists the real kick state)
  var _liveBanner = document.getElementById('lsLiveBanner');
  if (_liveBanner) _liveBanner.style.display = '';
  var _tabsContainer = document.getElementById('lsTabsContainer');
  if (_tabsContainer) _tabsContainer.style.display = '';
  var _streamList = document.getElementById('lsStreamList');
  if (_streamList) _streamList.style.display = '';

  // Remove compact-float class so dashboard icons return to their normal layout.
  document.body.classList.remove('ls-watching-stream');
  // Clean up URL poll interval (prevents zombie polling after player close)
  if (_lsUrlPollInterval) { clearInterval(_lsUrlPollInterval); _lsUrlPollInterval = null; }
  // Clean up console channels (polls, Q&A, countdown, slow mode)
  if (typeof _lsCleanupConsole === 'function') _lsCleanupConsole();
  // Stop freeze detection, latency catch-up, buffering events, visibility recovery
  _lsStopFreezeDetection();
  _lsStopLatencyCatchup();
  _lsDetachVisibilityRecovery();
  var _closeVid = document.getElementById('lsPlayerVideo');
  if (_closeVid) _lsDetachBufferingEvents(_closeVid);
  // Hide floating reload
  var floatReload = document.getElementById('lsFloatingReload');
  if (floatReload) floatReload.style.display = 'none';
  // Cancel device-switch grace timer if active
  if (_lsEndedGraceTimer) { clearTimeout(_lsEndedGraceTimer); _lsEndedGraceTimer = null; }
  _lsCurrentPlaybackUrl = null;
  // Restore viewport zoom
  _lsUnlockViewportZoom();
  // Remove gesture handler
  if (window._lsGestureHandler) {
    document.removeEventListener('gesturestart', window._lsGestureHandler);
    window._lsGestureHandler = null;
  }
  // Remove orientation handler
  if (window._lsOrientationHandler) {
    window.removeEventListener('orientationchange', window._lsOrientationHandler);
    window.removeEventListener('resize', window._lsOrientationHandler);
    window._lsOrientationHandler = null;
  }
  _lsRemoveReconnectingOverlay();
  var um = document.getElementById('lsUnmuteOverlay'); if (um) um.remove();
  // Remove kicked/ended overlays if present
  var kickedOverlay = document.getElementById('lsKickedOverlay');
  if (kickedOverlay) kickedOverlay.remove();
  var endedOverlay = document.getElementById('lsStreamEndedOverlay');
  if (endedOverlay) endedOverlay.remove();
  // Clean up VOD quiz elements
  var vodQuizCta = document.getElementById('lsVodQuizCta');
  if (vodQuizCta) vodQuizCta.remove();
  var vodQuizOverlay = document.getElementById('lsVodQuizOverlay');
  if (vodQuizOverlay) vodQuizOverlay.remove();
  _lsCurrentVodQuiz = null;

  var playerSection = document.getElementById('lsPlayerSection');
  var iframe = document.getElementById('lsPlayerIframe');
  var chatSection = document.getElementById('lsChatSection');
  var chatToggle = document.getElementById('lsChatToggleBtn');

  // Cleanup HLS player
  if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
  var videoEl = document.getElementById('lsPlayerVideo');
  if (videoEl) {
    if (videoEl._lsErrorHandler) { videoEl.removeEventListener('error', videoEl._lsErrorHandler); videoEl._lsErrorHandler = null; }
    if (videoEl._lsMetaHandler) { videoEl.removeEventListener('loadedmetadata', videoEl._lsMetaHandler); videoEl.removeEventListener('resize', videoEl._lsMetaHandler); videoEl._lsMetaHandler = null; }
    videoEl.pause(); videoEl.src = ''; videoEl.style.display = 'none';
  }

  if (iframe) { iframe.src = ''; iframe.style.display = ''; }
  if (playerSection) playerSection.style.display = 'none';
  if (chatSection) chatSection.style.setProperty('display', 'none', 'important');
  if (chatToggle) chatToggle.style.setProperty('display', 'none', 'important');
  // Restore 16:9 aspect ratio
  var playerContainer = document.getElementById('lsPlayerContainer');
  if (playerContainer) { playerContainer.style.paddingBottom = '56.25%'; playerContainer.style.removeProperty('height'); }

  // Clean up media upload state
  lsChatClearMedia();
  lsChatCloseMedia();

  // RESTORE all sections hidden during watching
  var restoreIds = ['lsHeader', 'lsMyGroupBadge', 'lsTabsContainer', 'lsStreamList', 'lsVodList', 'lsLiveAlert', 'notifBellContainer'];
  restoreIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.cssText = el.style.cssText.replace(/;?display:\s*none\s*!important/gi, '');
  });
  var bottomNav = document.querySelector('.mobile-bottom-nav');
  if (bottomNav) bottomNav.style.cssText = bottomNav.style.cssText.replace(/;?display:\s*none\s*!important/gi, '');
  var homeFab = document.querySelector('.home-fab');
  if (homeFab) homeFab.style.cssText = homeFab.style.cssText.replace(/;?display:\s*none\s*!important/gi, '');
  // Restore dashboard radio widget + podcast pill after leaving stream
  var _drwRestore = document.getElementById('dashRadioWidget');
  if (_drwRestore) { _drwRestore.style.display = 'flex'; if (typeof _syncDashRadio === 'function') _syncDashRadio(); }
  var _dppRestore = document.getElementById('dashPodcastPill');
  if (_dppRestore) _dppRestore.style.display = 'flex';
  var contentArea = document.getElementById('lsContentArea');
  if (contentArea) contentArea.style.padding = '12px';

  if (_lsChatSubscription) {
    supabaseClient.removeChannel(_lsChatSubscription);
    _lsChatSubscription = null;
  }
  if (_lsStatusSubscription) { try { supabaseClient.removeChannel(_lsStatusSubscription); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsStatusSubscription = null; }
  lsLeaveViewerPresence();
  lsCleanupParticipation();
  // Hide raise hand button and status
  var raiseBtn = document.getElementById('lsRaiseHandBtn');
  if (raiseBtn) raiseBtn.style.display = 'none';
  var partStatus = document.getElementById('lsParticipationStatus');
  if (partStatus) partStatus.style.display = 'none';
  // Hide break overlay
  var breakOverlay = document.getElementById('lsBreakOverlay');
  if (breakOverlay) breakOverlay.style.display = 'none';
  _lsCurrentStreamId = null;
  _lsChatMessages = [];
}

/* ── Stream chat ────────────────────────────────────────────── */
async function loadStreamChatHistory(streamId) {
  _lsChatMessages = [];

  try {
    var { data, error } = await supabaseClient
      .from('stream_chat_messages')
      .select('*')
      .eq('stream_id', streamId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    _lsChatMessages = data || [];
    // Cap at 50 messages — only keep the most recent
    if (_lsChatMessages.length > 50) _lsChatMessages = _lsChatMessages.slice(-50);
    renderStreamChat();

    var chatBox = document.getElementById('lsChatMessages');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  } catch (e) {
    console.error('[LiveStreaming] Chat history error:', e);
  }
}

function subscribeToStreamChat(streamId) {
  if (_lsChatSubscription) {
    supabaseClient.removeChannel(_lsChatSubscription);
  }

  _lsChatSubscription = supabaseClient
    .channel('stream-chat-' + streamId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'stream_chat_messages',
      filter: 'stream_id=eq.' + streamId
    }, function(payload) {
      var msg = payload.new;
      if (msg.deleted) return;
      var currentEmail = localStorage.getItem('tecnico_email') || '';
      var exists = _lsChatMessages.some(function(m) { return m.id === msg.id; });
      if (!exists) {
        _lsChatMessages.push(msg);
        // Cap at 50 — auto-flow: remove oldest messages
        if (_lsChatMessages.length > 50) _lsChatMessages.shift();
        var chatBox = document.getElementById('lsChatMessages');
        var nearBottom = chatBox ? (chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight) < 80 : true;
        renderStreamChat();
        if (chatBox && nearBottom) chatBox.scrollTop = chatBox.scrollHeight;
        // Unread badge + notification sound when chat is hidden
        if ((msg.user_email || '') !== currentEmail && _lsChatHidden) {
          _lsChatUnreadCount++;
          _lsChatUpdateBadge();
          _lsChatNotifySound();
        }
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'stream_chat_messages',
      filter: 'stream_id=eq.' + streamId
    }, function(payload) {
      var msg = payload.new;
      if (msg.deleted) {
        _lsChatMessages = _lsChatMessages.filter(function(m) { return m.id !== msg.id; });
        renderStreamChat();
      }
    })
    .subscribe(function(status) {
      if (status === 'CHANNEL_ERROR') {
        console.warn('[LS] Chat channel error — reconnecting in 3s');
        setTimeout(function() {
          if (_lsChatSubscription && _lsCurrentStreamId) {
            try { supabaseClient.removeChannel(_lsChatSubscription); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
            _lsChatSubscription = null;
            subscribeToStreamChat(_lsCurrentStreamId);
          }
        }, 3000);
      }
    });
}

function renderStreamChat() {
  var container = document.getElementById('lsChatMessages');
  if (!container) return;

  var currentEmail = localStorage.getItem('tecnico_email') || '';
  var isAdmin = typeof isAdminAuthenticated === 'function' && isAdminAuthenticated();
  var canModerate = isAdmin || _lsIsModerator;
  var html = '';

  for (var i = 0; i < _lsChatMessages.length; i++) {
    var msg = _lsChatMessages[i];
    // Skip deleted or corrupt messages
    if (!msg || msg.deleted) continue;

    var isOwn = (msg.user_email || '') === currentEmail;
    var align = isOwn ? 'flex-end' : 'flex-start';
    var bg = isOwn ? 'background:#FF3B30;color:#fff;' : 'background:#F5F5F7;color:#111111;border:1px solid rgba(0,0,0,0.06);';
    var time = '';
    try { time = new Date(msg.created_at).toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit' }); } catch(e) { time = ''; }
    var isMsgFromMod = _lsModeratorEmails.indexOf(msg.user_email || '') !== -1;
    var modBadge = isMsgFromMod ? '<span class="ls-mod-badge" title="Moderador">🛡</span>' : '';

    html += '<div class="ls-chat-msg" style="display:flex;flex-direction:column;align-items:' + align + ';">';
    if (!isOwn) {
      html += '<div style="font-size:11px;color:#111111;font-weight:700;margin-bottom:2px;padding-left:4px;">' + modBadge + _lsEsc(msg.user_name || 'Estudiante') + '</div>';
    }
    html += '<div style="' + bg + 'padding:6px 10px;border-radius:12px;max-width:80%;word-break:break-word;font-size:13px;">';

    // Media content (image or video) — uses data attributes + delegated handlers (XSS-safe)
    if (msg.message_type === 'image' && msg.media_url) {
      var _imgSafe = _lsSanitizeUrl(msg.media_url);
      if (_imgSafe) html += '<img src="' + _imgSafe + '" class="js-ls-chat-media" data-media-url="' + _imgSafe + '" data-media-type="image" style="max-width:100%;border-radius:8px;cursor:pointer;display:block;margin-bottom:' + (msg.message ? '4px' : '0') + ';" loading="lazy">';
    }
    if (msg.message_type === 'video' && msg.media_url) {
      var _thumbSafe = _lsSanitizeUrl(msg.media_thumbnail_url);
      var _vidSafe = _lsSanitizeUrl(msg.media_url);
      html += '<div class="js-ls-chat-media" data-media-url="' + _vidSafe + '" data-media-type="video" style="position:relative;cursor:pointer;margin-bottom:' + (msg.message ? '4px' : '0') + ';">';
      if (_thumbSafe) {
        html += '<img src="' + _thumbSafe + '" style="max-width:100%;border-radius:8px;display:block;" loading="lazy">';
      } else {
        html += '<div style="width:180px;height:100px;background:#E5E5EA;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#111111;font-weight:600;">Video</div>';
      }
      html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="width:36px;height:36px;background:rgba(0,0,0,0.6);border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg></div></div>';
      html += '</div>';
    }

    // Text content
    if (msg.message) {
      html += _lsEsc(msg.message);
    }

    html += '<span style="font-size:9px;opacity:0.6;margin-left:6px;">' + time + '</span>' +
    '</div>';

    // Mod/admin actions (delete + ban) — don't show on own messages
    if (canModerate && !isOwn) {
      html += '<div style="display:flex;gap:2px;margin-top:1px;">' +
        '<button class="ls-mod-action" onclick="lsDeleteChatMsg(\'' + _lsJsEsc(msg.id) + '\')" title="Eliminar">🗑</button>' +
        '<button class="ls-mod-action js-ls-ban-user" data-email="' + _lsEsc(msg.user_email || '') + '" data-name="' + _lsEsc(msg.user_name || '') + '" title="Banear del chat">🚫</button>' +
      '</div>';
    }
    html += '</div>';
  }

  container.innerHTML = html;

  // Delegated click handlers for ban buttons (XSS-safe)
  container.querySelectorAll('.js-ls-ban-user').forEach(function(btn) {
    btn.addEventListener('click', function() {
      lsBanUser(btn.getAttribute('data-email'), btn.getAttribute('data-name'));
    });
  });

  // Delegated click handlers for media elements (XSS-safe — no inline onclick with user URLs)
  container.querySelectorAll('.js-ls-chat-media').forEach(function(el) {
    el.addEventListener('click', function() {
      var mediaUrl = el.getAttribute('data-media-url');
      var mediaType = el.getAttribute('data-media-type');
      if (mediaUrl && mediaType) lsChatOpenMedia(mediaUrl, mediaType);
    });
  });
}

var _lsChatLastSentAt = 0;
var _LS_CHAT_THROTTLE_MS = 1000; // Min 1s between messages
function sendStreamChatMessage() {
  // Rate limit: prevent spam (1 message per second, or slow mode if active)
  // Applied BEFORE media check so media messages are also throttled
  var now = Date.now();
  var throttle = _LS_CHAT_THROTTLE_MS;
  // Slow mode: admin can set a longer delay between messages
  if (typeof _lsSlowModeSeconds !== 'undefined' && _lsSlowModeSeconds > 0) {
    throttle = Math.max(throttle, _lsSlowModeSeconds * 1000);
  }
  if (now - _lsChatLastSentAt < throttle) {
    if (_lsSlowModeSeconds > 0) {
      var wait = Math.ceil((throttle - (now - _lsChatLastSentAt)) / 1000);
      if (typeof _lsChatToast === 'function') _lsChatToast('Slow mode — espera ' + wait + 's', 'warn');
    }
    return;
  }
  _lsChatLastSentAt = now;

  // If media file is attached, handle media send
  if (_lsChatMediaFile) {
    _lsSendMediaMessage();
    return;
  }

  var input = document.getElementById('lsChatInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text || !_lsCurrentStreamId) return;

  // Block banned users
  if (_lsIsBanned) {
    input.value = '';
    input.placeholder = '🚫 Has sido bloqueado del chat';
    input.disabled = true;
    return;
  }

  var email = localStorage.getItem('tecnico_email') || '';
  var userName = '';
  try { userName = JSON.parse(localStorage.getItem('tecnico_user')).nombre || 'Estudiante'; } catch(e) { userName = 'Estudiante'; }

  input.value = '';

  supabaseClient.from('stream_chat_messages').insert({
    stream_id: _lsCurrentStreamId,
    user_email: email,
    user_name: userName,
    message: text,
    message_type: 'text'
  }).then(function(res) {
    if (res.error) {
      console.error('[LiveStreaming] Chat send error:', res.error);
      _lsChatToast('No se pudo enviar el mensaje', 'error');
    }
  });
}

// Enter key to send chat
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    var qaInput = document.getElementById('lsQAInput');
    if (qaInput && document.activeElement === qaInput) {
      e.preventDefault();
      _lsSubmitQuestion();
      return;
    }
    var input = document.getElementById('lsChatInput');
    if (input && document.activeElement === input) {
      e.preventDefault();
      sendStreamChatMessage();
    }
  }
});

/* ── Media upload functions ─────────────────────────────────── */
function lsChatFileSelected(event) {
  var file = event.target.files[0];
  if (!file) return;

  var isVideo = file.type.startsWith('video/');
  var isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) {
    _lsChatToast(_t('ls_file_type_error','Solo imágenes y videos permitidos'), 'error');
    event.target.value = '';
    return;
  }

  var maxMB = isVideo ? _LS_MAX_VID_MB : _LS_MAX_IMG_MB;
  if (file.size > maxMB * 1024 * 1024) {
    _lsChatToast(_t('ls_file_too_large','Archivo muy grande. Máximo ') + maxMB + 'MB', 'error');
    event.target.value = '';
    return;
  }

  _lsChatMediaFile = file;
  var preview = document.getElementById('lsChatMediaPreview');
  var thumb = document.getElementById('lsChatMediaThumb');
  var name = document.getElementById('lsChatMediaName');
  if (preview) preview.style.display = '';
  if (name) name.textContent = file.name;

  if (thumb) {
    if (isImage) {
      if (_lsChatMediaPreviewUrl) URL.revokeObjectURL(_lsChatMediaPreviewUrl);
      _lsChatMediaPreviewUrl = URL.createObjectURL(file);
      thumb.innerHTML = '<img src="' + _lsChatMediaPreviewUrl + '" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      thumb.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2"><polygon points="5,3 19,12 5,21"/></svg>';
    }
  }
}

function lsChatClearMedia() {
  _lsChatMediaFile = null;
  if (_lsChatMediaPreviewUrl) {
    URL.revokeObjectURL(_lsChatMediaPreviewUrl);
    _lsChatMediaPreviewUrl = null;
  }
  var preview = document.getElementById('lsChatMediaPreview');
  if (preview) preview.style.display = 'none';
  var fileInput = document.getElementById('lsChatFileInput');
  if (fileInput) fileInput.value = '';
}

async function _lsSendMediaMessage() {
  if (!_lsChatMediaFile || !_lsCurrentStreamId) return;

  // Block banned users
  if (_lsIsBanned) {
    lsChatClearMedia();
    return;
  }

  var file = _lsChatMediaFile;
  var isVideo = file.type.startsWith('video/');
  var isImage = file.type.startsWith('image/');

  var email = localStorage.getItem('tecnico_email') || '';
  var userName = '';
  try { userName = JSON.parse(localStorage.getItem('tecnico_user')).nombre || 'Estudiante'; } catch(e) { userName = 'Estudiante'; }

  var input = document.getElementById('lsChatInput');
  var caption = input ? input.value.trim() : '';
  var sendBtn = document.getElementById('lsChatSendBtn');
  if (sendBtn) sendBtn.disabled = true;
  _lsChatToast('Subiendo archivo...', 'warning');

  try {
    var ext = file.name.split('.').pop();
    var filePath = 'live-chat/' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) + '.' + ext;

    // Upload file to Supabase Storage
    var uploadRes = await supabaseClient.storage
      .from('school-files')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadRes.error) throw uploadRes.error;

    var urlData = supabaseClient.storage.from('school-files').getPublicUrl(filePath);
    var mediaUrl = urlData.data.publicUrl;

    // Extract video thumbnail
    var thumbnailUrl = null;
    if (isVideo && typeof extractVideoFrame === 'function') {
      try {
        var thumbFile = await extractVideoFrame(file);
        var thumbPath = 'live-chat/' + Date.now() + '_thumb.jpg';
        var thumbRes = await supabaseClient.storage
          .from('school-files')
          .upload(thumbPath, thumbFile, { cacheControl: '3600', upsert: false });
        if (!thumbRes.error) {
          var thumbUrlData = supabaseClient.storage.from('school-files').getPublicUrl(thumbPath);
          thumbnailUrl = thumbUrlData.data.publicUrl;
        }
      } catch(te) {
        console.warn('[LiveStreaming] Thumbnail extraction failed:', te);
      }
    }

    // Insert message
    var insertRes = await supabaseClient.from('stream_chat_messages').insert({
      stream_id: _lsCurrentStreamId,
      user_email: email,
      user_name: userName,
      message: caption || null,
      message_type: isVideo ? 'video' : 'image',
      media_url: mediaUrl,
      media_thumbnail_url: thumbnailUrl
    });

    if (insertRes.error) throw insertRes.error;

    // Clear
    lsChatClearMedia();
    if (input) input.value = '';
    _lsChatToast('Archivo enviado', 'success');

  } catch(e) {
    console.error('[LiveStreaming] Media send error:', e);
    _lsChatToast('Error subiendo archivo', 'error');
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ── Media viewer (fullscreen) ─────────────────────────────── */
function lsChatOpenMedia(url, type) {
  var overlay = document.getElementById('lsChatMediaOverlay');
  var content = document.getElementById('lsChatMediaOverlayContent');
  if (!overlay || !content) return;

  var safeUrl = _lsSanitizeUrl(url);
  if (!safeUrl) return;
  if (type === 'video') {
    content.innerHTML = '<video src="' + safeUrl + '" controls autoplay style="max-width:95vw;max-height:85vh;border-radius:8px;"></video>';
  } else {
    content.innerHTML = '<img src="' + safeUrl + '" style="max-width:95vw;max-height:85vh;border-radius:8px;object-fit:contain;">';
  }
  overlay.style.display = 'flex';
}

function lsChatCloseMedia() {
  var overlay = document.getElementById('lsChatMediaOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    var content = document.getElementById('lsChatMediaOverlayContent');
    if (content) {
      // Pause any playing video/audio before clearing
      var mediaEls = content.querySelectorAll('video, audio');
      mediaEls.forEach(function(el) { try { el.pause(); el.src = ''; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } });
      content.innerHTML = '';
    }
  }
}

/* ── URL sanitizer ─────────────────────────────────────────── */
function _lsSanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  var s = url.trim();
  if (/^https?:\/\//i.test(s)) {
    return _lsEsc(s).replace(/'/g, '&#39;');
  }
  return '';
}

/* ── Toast helper (ephemeral, live-chat-specific) ──────────── */
function _lsChatToast(msg, type) {
  var existing = document.getElementById('lsChatToast');
  if (existing) existing.remove();
  var bg = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#f59e0b';
  var toast = document.createElement('div');
  toast.id = 'lsChatToast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:8px 18px;border-radius:10px;font-size:13px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);text-align:center;max-width:90%;transition:opacity 0.3s;';
  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

/* ── Viewer presence (for viewer count) + attendance logging ── */
function lsJoinViewerPresence(streamId) {
  lsLeaveViewerPresence();
  try {
    var email = localStorage.getItem('tecnico_email') || 'anonymous';
    var name = ''; try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } name = name || 'Estudiante';
    _lsViewerChannel = supabaseClient.channel('viewers-' + streamId, { config: { presence: { key: email } } });

    // Listen for kick broadcast from admin
    _lsViewerChannel.on('broadcast', { event: 'kick_viewer' }, function(payload) {
      var msg = payload.payload;
      if (msg && msg.email === email) {
        _lsKicked = true;
        // Persist kick for this stream in sessionStorage
        if (_lsCurrentStreamId) {
          _lsKickedStreamIds[_lsCurrentStreamId] = true;
          delete _lsApprovedStreamIds[_lsCurrentStreamId];
          try { sessionStorage.setItem('_lsKickedStreamIds', JSON.stringify(_lsKickedStreamIds)); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
        }
        // Stop HLS player
        if (_lsHlsPlayer) { try { _lsHlsPlayer.destroy(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } _lsHlsPlayer = null; }
        var kickVideoEl = document.getElementById('lsPlayerVideo');
        if (kickVideoEl) { kickVideoEl.pause(); kickVideoEl.src = ''; kickVideoEl.style.display = 'none'; }
        // Stop iframe
        var iframe = document.getElementById('lsPlayerIframe');
        if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
        // Show kicked overlay WITHOUT destroying DOM (preserves video element for future use)
        var playerContainer = document.getElementById('lsPlayerContainer');
        if (playerContainer) {
          var kickMsg = document.createElement('div');
          kickMsg.id = 'lsKickedOverlay';
          kickMsg.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;border-radius:12px;z-index:60;';
          kickMsg.innerHTML = '<div style="text-align:center;color:#ef4444;font-size:18px;font-weight:700;">🚫 ' + _t('ls_kicked_msg', 'Has sido removido de esta clase por el instructor') + '</div>';
          playerContainer.appendChild(kickMsg);
        }
        // Disable chat
        var chatInput = document.getElementById('lsChatInput');
        if (chatInput) { chatInput.disabled = true; chatInput.placeholder = '🚫 ' + _t('ls_removed_class', 'Removido de la clase'); }
        var chatSend = document.getElementById('lsChatSendBtn');
        if (chatSend) chatSend.disabled = true;
        // Leave presence
        lsLeaveViewerPresence();
        // Stop participation
        lsCleanupParticipation();
        _lsChatToast(_t('ls_kicked_msg', 'Has sido removido de esta clase por el instructor'), 'error');
      }
    });

    _lsViewerChannel.subscribe(function(status) {
      if (status === 'SUBSCRIBED') {
        _lsViewerChannel.track({ name: name, role: 'student', joined: new Date().toISOString() });
      }
    });

    // Register page-close cleanup to prevent zombie presence entries
    if (window._lsViewerPageCleanup) {
      window.removeEventListener('pagehide', window._lsViewerPageCleanup);
      window.removeEventListener('beforeunload', window._lsViewerPageCleanup);
    }
    {
      window._lsViewerPageCleanup = function() {
        // Update attendance leave time via keepalive fetch (survives page close)
        if (_lsAttendanceId) {
          var _sbUrl = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
          var _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : ''));
          try {
            fetch(_sbUrl + '/rest/v1/stream_attendance?id=eq.' + _lsAttendanceId, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey, 'Prefer': 'return=minimal' },
              body: JSON.stringify({ left_at: new Date().toISOString() }),
              keepalive: true
            }).catch(function() {});
          } catch(e) { /* best effort */ }
        }
        // Untrack presence (best-effort, channel may not complete)
        if (_lsViewerChannel) {
          try { _lsViewerChannel.untrack(); } catch(e) { /* best effort */ }
        }
      };
      window.addEventListener('pagehide', window._lsViewerPageCleanup);
      window.addEventListener('beforeunload', window._lsViewerPageCleanup);
    }

    // Log attendance to DB (persistent)
    if (email !== 'anonymous') {
      supabaseClient.from('stream_attendance').insert({
        stream_id: streamId,
        student_email: email,
        student_name: name,
        joined_at: new Date().toISOString(),
        source: 'live'
      }).select('id').single().then(function(res) {
        if (res.data) _lsAttendanceId = res.data.id;
      }).catch(function(e) { console.warn('[LS] Attendance insert error:', e); });
    }
  } catch(e) { console.error('[LiveStreaming] Presence error:', e); }
}

function lsLeaveViewerPresence() {
  // Remove page-close handlers
  if (window._lsViewerPageCleanup) {
    window.removeEventListener('pagehide', window._lsViewerPageCleanup);
    window.removeEventListener('beforeunload', window._lsViewerPageCleanup);
    window._lsViewerPageCleanup = null;
  }
  // Update attendance with leave time
  if (_lsAttendanceId) {
    try {
      supabaseClient.from('stream_attendance').update({
        left_at: new Date().toISOString()
      }).eq('id', _lsAttendanceId).then(function() {}).catch(function() {});
    } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    _lsAttendanceId = null;
  }
  if (_lsViewerChannel) {
    try { supabaseClient.removeChannel(_lsViewerChannel); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    _lsViewerChannel = null;
  }
}

/* ===================================================================
   Student Participation — WebRTC (Student Side)
   =================================================================== */
var _lsParticipationChannel = null;
var _lsStudentPC = null;
var _lsStudentStream = null;
var _lsHandRaised = false;
var _lsParticipating = false;
var _lsBreakChannel = null;

function lsInitParticipation(streamId) {
  lsCleanupParticipation(true);
  var email = localStorage.getItem('tecnico_email') || '';
  var name = ''; try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } name = name || 'Estudiante';

  _lsParticipationChannel = supabaseClient.channel('participation-' + streamId);

  _lsParticipationChannel.on('broadcast', { event: 'signal' }, function(payload) {
    var msg = payload.payload;
    if (!msg) return;

    if (msg.type === 'approve' && msg.email === email) {
      // Admin approved us! Start WebRTC
      lsStartParticipating();
    } else if (msg.type === 'deny' && msg.email === email) {
      _lsHandRaised = false;
      var btn = document.getElementById('lsRaiseHandBtn');
      if (btn) { btn.textContent = '🙋 Pedir la Palabra'; btn.style.background = '#22c55e'; }
      var status = document.getElementById('lsParticipationStatus');
      if (status) { status.style.display = ''; status.textContent = _tc('ls_request_denied', 'Solicitud denegada'); status.style.color = '#ef4444'; setTimeout(function() { status.style.display = 'none'; }, 3000); }
    } else if (msg.type === 'kick' && msg.email === email) {
      lsStopParticipating();
      var status2 = document.getElementById('lsParticipationStatus');
      if (status2) { status2.style.display = ''; status2.textContent = _tc('ls_disconnected_by_instructor', 'Desconectado por el instructor'); status2.style.color = '#f97316'; setTimeout(function() { status2.style.display = 'none'; }, 3000); }
    } else if (msg.type === 'mute_audio' && msg.email === email) {
      if (_lsStudentStream) {
        _lsStudentStream.getAudioTracks().forEach(function(t) { t.enabled = !msg.muted; });
      }
      var status3 = document.getElementById('lsParticipationStatus');
      if (status3) { status3.style.display = ''; status3.textContent = msg.muted ? _tc('ls_mic_muted_by_instructor', 'Micrófono silenciado por instructor') : _tc('ls_mic_activated', 'Micrófono activado'); status3.style.color = msg.muted ? '#f97316' : '#22c55e'; }
    } else if (msg.type === 'toggle_cam' && msg.email === email) {
      if (_lsStudentStream) {
        _lsStudentStream.getVideoTracks().forEach(function(t) { t.enabled = !msg.camOff; });
      }
    } else if (msg.type === 'answer' && msg.email === email) {
      lsHandleAnswer(msg);
    } else if (msg.type === 'ice_candidate_admin') {
      if (_lsStudentPC && msg.candidate) {
        _lsStudentPC.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch(function() {});
      }
    }
  });

  _lsParticipationChannel.subscribe();

  // Show raise hand button
  var btn = document.getElementById('lsRaiseHandBtn');
  if (btn) btn.style.display = '';

  // Subscribe to break timer
  try { lsSubscribeBreakTimer(streamId); } catch(e) { console.error('[LiveStream] Break timer error:', e); }

  // Subscribe to gallery channel (student cameras)
  try { lsInitGalleryChannel(streamId); } catch(e) { console.error('[LiveStream] Gallery channel error:', e); }
}

function lsToggleRaiseHand() {
  if (_lsParticipating) {
    lsStopParticipating();
    return;
  }

  var email = localStorage.getItem('tecnico_email') || '';
  var name = ''; try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } name = name || 'Estudiante';

  _lsHandRaised = !_lsHandRaised;
  var btn = document.getElementById('lsRaiseHandBtn');

  if (_lsHandRaised) {
    if (_lsParticipationChannel) {
      _lsParticipationChannel.send({
        type: 'broadcast', event: 'signal',
        payload: { type: 'raise_hand', email: email, name: name }
      });
    }
    if (btn) { btn.textContent = '✋ Bajar la mano'; btn.style.background = '#f97316'; }
    var status = document.getElementById('lsParticipationStatus');
    if (status) { status.style.display = ''; status.textContent = _tc('ls_waiting_approval', 'Esperando aprobación...'); status.style.color = '#fbbf24'; }
  } else {
    if (_lsParticipationChannel) {
      _lsParticipationChannel.send({
        type: 'broadcast', event: 'signal',
        payload: { type: 'lower_hand', email: email }
      });
    }
    if (btn) { btn.textContent = '🙋 Pedir la Palabra'; btn.style.background = '#22c55e'; }
    var status2 = document.getElementById('lsParticipationStatus');
    if (status2) status2.style.display = 'none';
  }
}

async function lsStartParticipating() {
  var email = localStorage.getItem('tecnico_email') || '';
  var name = ''; try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); } name = name || 'Estudiante';

  try {
    _lsStudentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    _lsParticipating = true;
    _lsHandRaised = false;

    var btn = document.getElementById('lsRaiseHandBtn');
    if (btn) { btn.textContent = '🔴 Desconectar'; btn.style.background = '#ef4444'; }
    var status = document.getElementById('lsParticipationStatus');
    if (status) { status.style.display = ''; status.textContent = _tc('ls_connected_live', 'Conectado — estás en vivo'); status.style.color = '#22c55e'; }

    _lsStudentPC = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    _lsStudentStream.getTracks().forEach(function(track) {
      _lsStudentPC.addTrack(track, _lsStudentStream);
    });

    _lsStudentPC.onicecandidate = function(event) {
      if (event.candidate && _lsParticipationChannel) {
        _lsParticipationChannel.send({
          type: 'broadcast', event: 'signal',
          payload: { type: 'ice_candidate', email: email, candidate: event.candidate.toJSON() }
        });
      }
    };

    _lsStudentPC.oniceconnectionstatechange = function() {
      if (!_lsStudentPC) return;
      if (_lsStudentPC.iceConnectionState === 'disconnected' || _lsStudentPC.iceConnectionState === 'failed') {
        lsStopParticipating();
      }
    };

    var offer = await _lsStudentPC.createOffer();
    await _lsStudentPC.setLocalDescription(offer);

    // Wait for ICE gathering (with 10s timeout to prevent hanging)
    await new Promise(function(resolve) {
      if (_lsStudentPC.iceGatheringState === 'complete') { resolve(); return; }
      var _iceTimeout = setTimeout(function() {
        console.warn('[LiveStream] ICE gathering timed out after 10s, proceeding with partial candidates');
        resolve();
      }, 10000);
      _lsStudentPC.addEventListener('icegatheringstatechange', function() {
        if (_lsStudentPC.iceGatheringState === 'complete') { clearTimeout(_iceTimeout); resolve(); }
      });
    });

    _lsParticipationChannel.send({
      type: 'broadcast', event: 'signal',
      payload: { type: 'offer', email: email, name: name, sdp: _lsStudentPC.localDescription.sdp }
    });

  } catch(e) {
    console.error('[LiveStreaming] Participation error:', e);
    var status2 = document.getElementById('lsParticipationStatus');
    if (status2) { status2.style.display = ''; status2.textContent = 'Error: ' + (e.message || 'Permiso denegado'); status2.style.color = '#ef4444'; }
    lsStopParticipating();
  }
}

async function lsHandleAnswer(msg) {
  try {
    if (_lsStudentPC) {
      await _lsStudentPC.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
    }
  } catch(e) { console.error('[LiveStreaming] Answer error:', e); }
}

function lsStopParticipating() {
  var email = localStorage.getItem('tecnico_email') || '';
  _lsParticipating = false;
  _lsHandRaised = false;

  if (_lsStudentPC) { _lsStudentPC.close(); _lsStudentPC = null; }
  if (_lsStudentStream) { _lsStudentStream.getTracks().forEach(function(t) { t.stop(); }); _lsStudentStream = null; }

  // Notify admin
  if (_lsParticipationChannel) {
    _lsParticipationChannel.send({
      type: 'broadcast', event: 'signal',
      payload: { type: 'student_disconnected', email: email }
    });
  }

  var btn = document.getElementById('lsRaiseHandBtn');
  if (btn) { btn.textContent = '🙋 Pedir la Palabra'; btn.style.background = '#22c55e'; }
  var status = document.getElementById('lsParticipationStatus');
  if (status) { status.style.display = ''; status.textContent = _tc('ls_disconnected', 'Desconectado'); setTimeout(function() { status.style.display = 'none'; }, 2000); }
}

function lsCleanupParticipation(keepGalleryBtn) {
  if (keepGalleryBtn) { lsStopCamera(); } else { lsCleanupGallery(); }
  if (_lsStudentPC) { _lsStudentPC.close(); _lsStudentPC = null; }
  if (_lsStudentStream) { _lsStudentStream.getTracks().forEach(function(t) { t.stop(); }); _lsStudentStream = null; }
  if (_lsParticipationChannel) { supabaseClient.removeChannel(_lsParticipationChannel); _lsParticipationChannel = null; }
  if (_lsBreakChannel) { supabaseClient.removeChannel(_lsBreakChannel); _lsBreakChannel = null; }
  _lsHandRaised = false;
  _lsParticipating = false;
}

/* ===================================================================
   Gallery View — Student Camera Publishing via WebRTC
   Student publishes low-res video → CF Calls SFU → Admin receives
   =================================================================== */
var _lsGalleryChannel = null;
var _lsGalleryChannelReady = false; // Track subscription state
var _lsCameraSession = null;    // CF Calls session ID for this student
var _lsCameraPC = null;         // RTCPeerConnection (sends video)
var _lsCameraStream = null;     // MediaStream from getUserMedia
var _lsCameraActive = false;
var _lsCameraTrackName = null;
var _lsCamOn = true;          // Camera track enabled
var _lsMicOn = true;          // Mic track enabled
var _lsFacingMode = 'user';   // 'user' (front) or 'environment' (back)
var _lsCameraRebroadcast = null; // Interval for re-broadcasting

async function _cfCallsStudentProxy(body) {
  body.user_email = localStorage.getItem('tecnico_email') || '';
  var res = await supabaseClient.functions.invoke('cf-calls-proxy', { body: body });
  // Normalize: if invoke-level error, put it in data.error so callers see it
  if (res.error) {
    var msg = res.error.message || res.error.context?.statusText || String(res.error);
    console.error('[cf-calls-proxy] invoke error:', msg, res.error);
    return { data: { error: msg } };
  }
  return res;
}

function lsInitGalleryChannel(streamId) {
  if (_lsGalleryChannel) {
    supabaseClient.removeChannel(_lsGalleryChannel);
  }

  // Show camera button immediately when watching a live stream
  var camBtn = document.getElementById('lsCameraBtn');
  if (camBtn) camBtn.style.display = '';
  console.log('[Gallery-Student] Camera button shown for stream:', streamId);

  _lsGalleryChannelReady = false;
  _lsGalleryChannel = supabaseClient.channel('gallery-' + streamId);

  _lsGalleryChannel.on('broadcast', { event: 'gallery_signal' }, function(payload) {
    var msg = payload.payload;
    if (!msg) return;

    if (msg.type === 'room_ready') {
      var btn = document.getElementById('lsCameraBtn');
      if (btn) btn.style.display = '';
      console.log('[Gallery-Student] Room ready confirmed');
    } else if (msg.type === 'room_closed') {
      lsStopCamera();
      var btn2 = document.getElementById('lsCameraBtn');
      if (btn2) btn2.style.display = 'none';
      console.log('[Gallery-Student] Room closed, cleaned up');
    } else if (msg.type === 'force_stop') {
      var myEmail = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
      if (msg.email && msg.email.toLowerCase().trim() === myEmail) {
        lsStopCamera();
        var statusEl = document.getElementById('lsParticipationStatus');
        if (statusEl) {
          statusEl.style.display = '';
          statusEl.textContent = _tc('ls_instructor_stopped_camera', 'El instructor apagó tu cámara');
          statusEl.style.color = '#ef4444';
          setTimeout(function() { statusEl.style.display = 'none'; }, 5000);
        }
        console.log('[Gallery-Student] Instructor force-stopped camera');
      }
    }
  });

  _lsGalleryChannel.subscribe(function(status) {
    if (status === 'SUBSCRIBED') {
      _lsGalleryChannelReady = true;
      console.log('[Gallery-Student] Channel SUBSCRIBED, ready to broadcast');
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      console.error('[Gallery-Student] Channel subscription failed:', status);
    }
  });
}

function lsToggleCamera() {
  if (_lsCameraActive) {
    lsStopCamera();
  } else {
    lsStartCamera();
  }
}

async function lsStartCamera() {
  var email = localStorage.getItem('tecnico_email') || '';
  var name = '';
  try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre; } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  name = name || 'Estudiante';

  var btn = document.getElementById('lsCameraBtn');
  var statusEl = document.getElementById('lsParticipationStatus');

  function showStatus(msg, color) {
    if (statusEl) { statusEl.style.display = ''; statusEl.textContent = msg; statusEl.style.color = color || '#0ea5e9'; }
    console.log('[Gallery-Student]', msg);
  }
  function showError(msg, detail) {
    var full = msg + (detail ? ': ' + (typeof detail === 'object' ? JSON.stringify(detail) : detail) : '');
    if (statusEl) { statusEl.style.display = ''; statusEl.textContent = full; statusEl.style.color = '#ef4444'; }
    console.error('[Gallery-Student]', full);
  }

  try {
    showStatus(_t('ls_camera_accessing','Accediendo a cámara...'));

    // 1. Get user camera + microphone
    _lsCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 160 }, height: { ideal: 120 }, frameRate: { ideal: 10 }, facingMode: _lsFacingMode },
      audio: true
    });

    // Clean up camera on page close (iOS uses pagehide, not beforeunload)
    if (!window._lsCameraCleanup) {
      window._lsCameraCleanup = function() { try { lsStopCamera(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); } };
      window.addEventListener('pagehide', window._lsCameraCleanup);
      window.addEventListener('beforeunload', window._lsCameraCleanup);
    }

    // Show self-preview
    var selfPreview = document.getElementById('lsSelfPreview');
    var selfVideo = document.getElementById('lsSelfVideo');
    if (selfPreview && selfVideo) {
      selfVideo.srcObject = _lsCameraStream;
      selfPreview.style.display = '';
      selfVideo.play().catch(function(){});
    }
    _lsCamOn = true;
    _lsMicOn = true;

    showStatus(_t('ls_creating_session','Creando sesión...'));

    // 2. Create session on CF Calls
    var res = await _cfCallsStudentProxy({ action: 'create_session' });
    if (!res.data || res.data.error) {
      showError('Error sesión', res.data ? (res.data.error || res.data.details || JSON.stringify(res.data)) : 'sin datos');
      if (_lsCameraStream) { _lsCameraStream.getTracks().forEach(function(t) { t.stop(); }); _lsCameraStream = null; }
      return;
    }
    _lsCameraSession = res.data.sessionId;

    showStatus('Conectando video...');

    // 3. Create PeerConnection and add video + audio tracks
    _lsCameraPC = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      bundlePolicy: 'max-bundle',
    });

    _lsCameraStream.getTracks().forEach(function(track) {
      _lsCameraPC.addTrack(track, _lsCameraStream);
    });

    // Generate unique track name base
    var trackBase = 'cam_' + email.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now();
    _lsCameraTrackName = trackBase + '_video';

    // 4. Create offer and send to CF Calls
    var offer = await _lsCameraPC.createOffer();
    await _lsCameraPC.setLocalDescription(offer);

    // Build tracks array with mid from each transceiver
    var transceivers = _lsCameraPC.getTransceivers();
    var cfTracks = [];
    for (var i = 0; i < transceivers.length; i++) {
      var t = transceivers[i];
      if (t.mid !== null && t.sender && t.sender.track) {
        cfTracks.push({
          location: 'local',
          mid: t.mid,
          trackName: trackBase + '_' + t.sender.track.kind,
        });
      }
    }

    showStatus('Publicando ' + cfTracks.length + ' tracks...');

    var trackRes = await _cfCallsStudentProxy({
      action: 'add_tracks',
      session_id: _lsCameraSession,
      sdp_offer: _lsCameraPC.localDescription.sdp,
      tracks: cfTracks
    });

    if (!trackRes.data || trackRes.data.error) {
      showError('Error tracks', trackRes.data ? (trackRes.data.error || trackRes.data.details || JSON.stringify(trackRes.data)) : 'sin datos');
      _lsCameraPC.close(); _lsCameraPC = null;
      _lsCameraStream.getTracks().forEach(function(t) { t.stop(); }); _lsCameraStream = null;
      return;
    }

    // 5. Set remote description
    if (trackRes.data.sdp_answer) {
      await _lsCameraPC.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: trackRes.data.sdp_answer
      }));
    }

    // Handle immediate renegotiation if required
    if (trackRes.data.require_negotiation) {
      showStatus('Renegociando...');
      var reOffer = await _lsCameraPC.createOffer();
      await _lsCameraPC.setLocalDescription(reOffer);
      var reRes = await _cfCallsStudentProxy({
        action: 'renegotiate',
        session_id: _lsCameraSession,
        sdp_offer: _lsCameraPC.localDescription.sdp
      });
      if (reRes.data && reRes.data.sdp_answer) {
        await _lsCameraPC.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: reRes.data.sdp_answer
        }));
      }
    }

    _lsCameraActive = true;

    // 6. Broadcast to gallery channel that we're publishing
    // Must wait for channel to be SUBSCRIBED or .send() silently fails
    var _publishPayload = {
      type: 'student_publishing',
      email: email,
      name: name,
      session_id: _lsCameraSession,
      track_name: _lsCameraTrackName
    };
    function _broadcastPublishing() {
      if (!_lsGalleryChannel) return;
      _lsGalleryChannel.send({ type: 'broadcast', event: 'gallery_signal', payload: _publishPayload });
    }
    if (_lsGalleryChannelReady) {
      _broadcastPublishing();
      console.log('[Gallery-Student] Broadcast sent immediately');
    } else {
      // Wait up to 5s for subscription, checking every 100ms
      var _waitCount = 0;
      var _waitInt = setInterval(function() {
        _waitCount++;
        if (_lsGalleryChannelReady || _waitCount > 50) {
          clearInterval(_waitInt);
          if (_lsGalleryChannelReady) {
            _broadcastPublishing();
            console.log('[Gallery-Student] Broadcast sent after wait (' + (_waitCount * 100) + 'ms)');
          } else {
            console.error('[Gallery-Student] Channel not ready after 5s, aborting broadcast');
            return;
          }
        }
      }, 100);
    }

    // 7. Re-broadcast every 10s for late joiners (was 30s, too slow for self-healing)
    _lsCameraRebroadcast = setInterval(function() {
      if (_lsGalleryChannel && _lsCameraActive && _lsGalleryChannelReady) {
        _lsGalleryChannel.send({
          type: 'broadcast',
          event: 'gallery_signal',
          payload: _publishPayload
        });
      }
    }, 10000);

    // 8. Update buttons — main becomes "Desconectar", show cam/mic toggles
    if (btn) {
      btn.textContent = '⏹ Desconectar';
      btn.style.background = '#ef4444';
    }
    var camToggle = document.getElementById('lsCamToggleBtn');
    var micToggle = document.getElementById('lsMicToggleBtn');
    var flipBtn = document.getElementById('lsCamFlipBtn');
    if (camToggle) { camToggle.style.display = ''; camToggle.style.background = '#22c55e'; }
    if (micToggle) { micToggle.style.display = ''; micToggle.style.background = '#22c55e'; }
    if (flipBtn) flipBtn.style.display = '';

    showStatus(_t('ls_camera_active','Cámara activa ✓'), '#22c55e');
    setTimeout(function() { if (statusEl) statusEl.style.display = 'none'; }, 3000);

  } catch (e) {
    var errMsg = e && e.name === 'NotAllowedError' ? _t('ls_camera_denied','Permiso de cámara denegado') :
                 e && e.name === 'NotFoundError' ? _t('ls_camera_not_found','No se encontró cámara') :
                 'Error: ' + (e ? e.message || e.name || String(e) : 'desconocido');
    showError(errMsg);
    if (_lsCameraStream) { _lsCameraStream.getTracks().forEach(function(t) { t.stop(); }); _lsCameraStream = null; }
    if (_lsCameraPC) { _lsCameraPC.close(); _lsCameraPC = null; }
  }
}

function lsStopCamera() {
  var email = localStorage.getItem('tecnico_email') || '';

  // Clear re-broadcast interval
  if (_lsCameraRebroadcast) {
    clearInterval(_lsCameraRebroadcast);
    _lsCameraRebroadcast = null;
  }

  // Broadcast stop
  if (_lsGalleryChannel && _lsCameraActive) {
    _lsGalleryChannel.send({
      type: 'broadcast',
      event: 'gallery_signal',
      payload: { type: 'student_stopped', email: email }
    });
  }

  // Close PeerConnection
  if (_lsCameraPC) {
    _lsCameraPC.close();
    _lsCameraPC = null;
  }

  // Stop camera stream
  if (_lsCameraStream) {
    _lsCameraStream.getTracks().forEach(function(t) { t.stop(); });
    _lsCameraStream = null;
  }

  _lsCameraSession = null;
  _lsCameraTrackName = null;
  _lsCameraActive = false;
  _lsCamOn = true;
  _lsMicOn = true;

  // Remove page-close camera cleanup listeners
  if (window._lsCameraCleanup) {
    window.removeEventListener('pagehide', window._lsCameraCleanup);
    window.removeEventListener('beforeunload', window._lsCameraCleanup);
    window._lsCameraCleanup = null;
  }

  // Update buttons
  var btn = document.getElementById('lsCameraBtn');
  if (btn) {
    btn.textContent = '📹 ' + _tc('ls_turn_on_camera', 'Prender Cámara');
    btn.style.background = '#3b82f6';
  }
  var camToggle = document.getElementById('lsCamToggleBtn');
  var micToggle = document.getElementById('lsMicToggleBtn');
  var flipBtn = document.getElementById('lsCamFlipBtn');
  var selfPreview = document.getElementById('lsSelfPreview');
  if (camToggle) camToggle.style.display = 'none';
  if (micToggle) micToggle.style.display = 'none';
  if (flipBtn) flipBtn.style.display = 'none';
  if (selfPreview) selfPreview.style.display = 'none';
}

function lsCamToggle() {
  if (!_lsCameraStream) return;
  _lsCamOn = !_lsCamOn;
  _lsCameraStream.getVideoTracks().forEach(function(t) { t.enabled = _lsCamOn; });
  var btn = document.getElementById('lsCamToggleBtn');
  if (btn) btn.style.background = _lsCamOn ? '#22c55e' : '#ef4444';
}

function lsMicToggle() {
  if (!_lsCameraStream) return;
  _lsMicOn = !_lsMicOn;
  _lsCameraStream.getAudioTracks().forEach(function(t) { t.enabled = _lsMicOn; });
  var btn = document.getElementById('lsMicToggleBtn');
  if (btn) btn.style.background = _lsMicOn ? '#22c55e' : '#ef4444';
}

async function lsCamFlip() {
  if (!_lsCameraStream || !_lsCameraPC) return;
  var oldFacing = _lsFacingMode;
  _lsFacingMode = _lsFacingMode === 'user' ? 'environment' : 'user';

  var statusEl = document.getElementById('lsParticipationStatus');
  try {
    // Get new camera stream with flipped facing mode
    var newStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 160 }, height: { ideal: 120 }, frameRate: { ideal: 10 }, facingMode: { ideal: _lsFacingMode } },
      audio: false
    });
    var newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) {
      _lsFacingMode = oldFacing;
      return;
    }

    // Stop old video track first
    var oldVideoTracks = _lsCameraStream.getVideoTracks();
    for (var oi = 0; oi < oldVideoTracks.length; oi++) {
      _lsCameraStream.removeTrack(oldVideoTracks[oi]);
      oldVideoTracks[oi].stop();
    }

    // Add new video track to stream
    _lsCameraStream.addTrack(newVideoTrack);

    // Replace video track in PeerConnection
    var senders = _lsCameraPC.getSenders();
    for (var i = 0; i < senders.length; i++) {
      if (senders[i].track && senders[i].track.kind === 'video') {
        await senders[i].replaceTrack(newVideoTrack);
        break;
      }
    }

    // Update self-preview
    var selfVideo = document.getElementById('lsSelfVideo');
    if (selfVideo) {
      selfVideo.srcObject = _lsCameraStream;
      selfVideo.play().catch(function(){});
    }
  } catch (e) {
    console.error('[Gallery-Student] Flip camera error:', e.message);
    _lsFacingMode = oldFacing;
    // Show error — likely no back camera on this device
    if (statusEl) {
      statusEl.style.display = '';
      statusEl.textContent = _tc('ls_cannot_switch_camera', 'No se puede cambiar cámara');
      statusEl.style.color = '#f59e0b';
      setTimeout(function() { statusEl.style.display = 'none'; }, 3000);
    }
  }
}

function lsCleanupGallery() {
  lsStopCamera();
  if (_lsGalleryChannel) {
    supabaseClient.removeChannel(_lsGalleryChannel);
    _lsGalleryChannel = null;
  }
  var btn = document.getElementById('lsCameraBtn');
  if (btn) btn.style.display = 'none';
}

/* ── Break timer (student side) ────────────────────────────── */
var _lsBreakLocalSeconds = 0;
var _lsBreakLocalInterval = null;

function _lsBreakUpdateDisplay() {
  var overlay = document.getElementById('lsBreakOverlay');
  var timer = document.getElementById('lsBreakTimer');
  if (_lsBreakLocalSeconds <= 0) {
    if (overlay) overlay.style.display = 'none';
    if (_lsBreakLocalInterval) { clearInterval(_lsBreakLocalInterval); _lsBreakLocalInterval = null; }
    return;
  }
  if (overlay) overlay.style.display = 'flex';
  if (timer) {
    var m = Math.floor(_lsBreakLocalSeconds / 60);
    var s = _lsBreakLocalSeconds % 60;
    timer.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
}

function lsSubscribeBreakTimer(streamId) {
  if (_lsBreakChannel) supabaseClient.removeChannel(_lsBreakChannel);
  if (_lsBreakLocalInterval) { clearInterval(_lsBreakLocalInterval); _lsBreakLocalInterval = null; }

  _lsBreakChannel = supabaseClient.channel('break-' + streamId);
  _lsBreakChannel.on('broadcast', { event: 'break_timer' }, function(payload) {
    var seconds = payload.payload ? payload.payload.seconds : 0;

    // Sync local countdown with server value
    _lsBreakLocalSeconds = seconds;
    _lsBreakUpdateDisplay();

    if (seconds > 0 && !_lsBreakLocalInterval) {
      // Start local countdown for smooth display between broadcasts
      _lsBreakLocalInterval = setInterval(function() {
        _lsBreakLocalSeconds--;
        _lsBreakUpdateDisplay();
        if (_lsBreakLocalSeconds <= 0) {
          clearInterval(_lsBreakLocalInterval);
          _lsBreakLocalInterval = null;
        }
      }, 1000);
    }
  });
  _lsBreakChannel.subscribe();
}

/* ── Check if stream belongs to my group ─────────────────────── */
function _lsStreamIsForMe(stream) {
  if (!stream.class_group || stream.class_group === 'todos') return true;
  var myGroups = _lsGetMyGroups();
  return myGroups.indexOf(stream.class_group) !== -1;
}

/* ── Global live stream status subscription (FAB) ───────────── */
var _lsStatusRetryCount = 0;
var _LS_STATUS_MAX_RETRIES = 10;
var _lsStatusPollInterval = null;
function _lsStartStatusPolling() {
  // 20-second polling backup — guarantees the EN VIVO pill shows even when Supabase realtime
  // is blocked by RLS, ad-blockers, captive portals or carrier WebSocket interference.
  if (_lsStatusPollInterval) return;
  _lsStatusPollInterval = setInterval(function() {
    if (typeof checkLiveStreamsFab === 'function') {
      try { checkLiveStreamsFab(); } catch(e) { console.warn('[LiveStream] poll error', e); }
    }
  }, 20000);
  console.log('[LiveStream] status polling started (20s interval)');
}
function subscribeToLiveStreamStatus() {
  if (!supabaseClient) return;
  if (_lsStatusSubscription) {
    try { supabaseClient.removeChannel(_lsStatusSubscription); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  }
  _lsStartStatusPolling();

  _lsStatusSubscription = supabaseClient
    .channel('live-stream-status')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'live_streams'
    }, function(payload) {
      var stream = payload.new;
      if (stream.status === 'live') {
        showLiveFab(stream);
        // Cancel grace timer if stream came back to life (device switch success)
        if (_lsEndedGraceTimer && _lsCurrentStreamId && stream.id === _lsCurrentStreamId) {
          clearTimeout(_lsEndedGraceTimer);
          _lsEndedGraceTimer = null;
          _lsRemoveReconnectingOverlay();
          console.log('[LiveStream] Stream back to live — device switch successful');
          // Check if playback_url changed (new HLS beam)
          if (stream.playback_url && _lsCurrentPlaybackUrl && stream.playback_url !== _lsCurrentPlaybackUrl) {
            console.log('[LiveStream] Playback URL changed, reloading player');
            _lsReloadWithNewUrl(stream.playback_url);
          }
        }
      } else {
        checkHideLiveFab();
        // Stream-ended detection
        if (_lsCurrentStreamId && stream.id === _lsCurrentStreamId && (stream.status === 'ended' || stream.status === 'offline')) {
          if (stream.status === 'ended') {
            // Instructor deliberately finalized — end immediately for students
            if (_lsEndedGraceTimer) { clearTimeout(_lsEndedGraceTimer); _lsEndedGraceTimer = null; }
            _lsRemoveReconnectingOverlay();
            _lsShowStreamEndedOverlay();
            console.log('[LiveStream] Stream ended by instructor — showing ended immediately');
          } else if (!_lsEndedGraceTimer) {
            // Offline (device switch / connection lost) — 90s grace period
            _lsShowReconnectingOverlay();
            console.log('[LiveStream] Stream status → offline — starting 90s grace period');
            _lsEndedGraceTimer = setTimeout(function() {
              _lsEndedGraceTimer = null;
              _lsRemoveReconnectingOverlay();
              _lsShowStreamEndedOverlay();
              console.log('[LiveStream] Grace period expired — showing stream ended');
            }, 90000);
          }
        }
      }
    })
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'live_streams'
    }, function(payload) {
      if (payload.new.status === 'live') {
        showLiveFab(payload.new);
      }
    })
    .subscribe(function(status) {
      if (status === 'SUBSCRIBED') {
        _lsStatusRetryCount = 0; // Reset on success
      } else if (status === 'CHANNEL_ERROR') {
        _lsStatusRetryCount++;
        if (_lsStatusRetryCount <= _LS_STATUS_MAX_RETRIES) {
          var delay = Math.min(10000 * _lsStatusRetryCount, 60000); // Exponential backoff, max 60s
          console.warn('[LiveStream] Realtime status channel error — retry ' + _lsStatusRetryCount + '/' + _LS_STATUS_MAX_RETRIES + ' in ' + (delay / 1000) + 's');
          setTimeout(function() { subscribeToLiveStreamStatus(); }, delay);
        } else {
          console.error('[LiveStream] Realtime status channel failed after ' + _LS_STATUS_MAX_RETRIES + ' retries — falling back to polling only');
        }
      }
    });

  // Check on init if any stream is live FOR MY GROUP
  checkLiveStreamsFab();
}

async function checkLiveStreamsFab() {
  try {
    var { data } = await supabaseClient
      .from('live_streams')
      .select('id, title, playback_url, class_group, instructor_name')
      .eq('status', 'live');

    if (!data || data.length === 0) { hideLiveFab(); return; }

    // Show alert for ANY live stream — group filtering happens on watch screen
    showLiveFab(data[0]);
  } catch(e) {
    // silent
  }
}

function showLiveFab(stream) {
  // Fullscreen _lsShowLiveAlert intentionally omitted — the floating global pill is the primary entry point.
  lsUpdateDashboardLiveBanner();
  _lsShowGlobalLiveBadge(stream);
}

function hideLiveFab() {
  var fab = document.getElementById('lsLiveFab');
  if (fab) fab.remove();
  var alert = document.getElementById('lsLiveAlert');
  if (alert) alert.remove();
  _lsHideDashLiveBanner();
  _lsHideGlobalLiveBadge();
}

/* ── Global sticky "EN VIVO" badge — visible on every screen ── */
var _lsGlobalBadgeStream = null;
function _lsShowGlobalLiveBadge(stream) {
  if (!stream || !stream.id) return;
  if (_lsCurrentStreamId === stream.id) { _lsHideGlobalLiveBadge(); return; }
  // Dismiss flag intentionally NOT checked here — Mario wants the pill to always reappear while a class is live.
  _lsGlobalBadgeStream = stream;
  var existing = document.getElementById('lsGlobalLiveBadge');
  if (existing) existing.remove();
  var bar = document.createElement('div');
  bar.id = 'lsGlobalLiveBadge';
  bar.style.cssText = 'position:fixed;top:calc(max(10px, env(safe-area-inset-top, 10px)));left:50%;transform:translateX(-50%);z-index:2147483600;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;padding:12px 20px;border-radius:999px;font-size:14px;font-weight:900;letter-spacing:0.4px;cursor:pointer;box-shadow:0 8px 28px rgba(220,38,38,0.55),0 0 0 3px rgba(255,255,255,0.2);display:flex;align-items:center;gap:10px;max-width:calc(100vw - 24px);animation:lsGlobalBadgePulse 1.4s ease-in-out infinite;-webkit-tap-highlight-color:transparent;';
  bar.innerHTML =
    '<style>@keyframes lsGlobalBadgePulse{0%,100%{box-shadow:0 8px 28px rgba(220,38,38,0.55),0 0 0 0 rgba(239,68,68,0.8),0 0 0 3px rgba(255,255,255,0.2)}50%{box-shadow:0 10px 34px rgba(220,38,38,0.8),0 0 0 14px rgba(239,68,68,0),0 0 0 3px rgba(255,255,255,0.25)}}@keyframes lsBadgeDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.85)}}</style>' +
    '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#fff;animation:lsBadgeDot 0.9s infinite;box-shadow:0 0 8px #fff;"></span>' +
    '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60vw;">EN VIVO: ' + _lsEsc(stream.title || 'Clase') + '</span>' +
    '<span style="opacity:0.95;font-weight:800;">Toca ›</span>';
  bar.onclick = function() {
    _lsShowGlobalLiveModal(stream);
  };
  document.body.appendChild(bar);
}

function _lsHideGlobalLiveBadge() {
  var el = document.getElementById('lsGlobalLiveBadge');
  if (el) el.remove();
  _lsGlobalBadgeStream = null;
}

function _lsShowGlobalLiveModal(stream) {
  var old = document.getElementById('lsGlobalLiveModal');
  if (old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'lsGlobalLiveModal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999995;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;padding:20px;';
  var title = stream.title || 'Clase en Vivo';
  var instructor = stream.instructor_name || '';
  overlay.innerHTML =
    '<div style="background:linear-gradient(135deg,#991b1b,#dc2626,#ef4444);border-radius:22px;padding:28px 24px;max-width:360px;width:100%;text-align:center;border:2px solid rgba(255,255,255,0.22);box-shadow:0 20px 60px rgba(0,0,0,0.5);">' +
      '<div style="font-size:44px;margin-bottom:10px;">🔴</div>' +
      '<div style="color:#fff;font-size:22px;font-weight:900;letter-spacing:0.5px;margin-bottom:6px;">Clase EN VIVO ahora</div>' +
      (instructor ? '<div style="color:rgba(255,255,255,0.85);font-size:13px;margin-bottom:2px;">' + _lsEsc(instructor) + '</div>' : '') +
      '<div style="color:#fef2f2;font-size:15px;font-weight:700;margin-bottom:20px;">' + _lsEsc(title) + '</div>' +
      '<div style="color:rgba(255,255,255,0.9);font-size:14px;margin-bottom:20px;">¿Quieres entrar o seguir estudiando?</div>' +
      '<button onclick="_lsGlobalModalEnter(\'' + _lsJsEsc(stream.id) + '\')" style="background:#fff;color:#dc2626;border:none;padding:13px 24px;border-radius:50px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:block;width:100%;margin-bottom:10px;">ENTRAR A LA CLASE</button>' +
      '<button onclick="_lsGlobalModalIgnore(\'' + _lsJsEsc(stream.id) + '\')" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.4);padding:11px 20px;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;display:block;width:100%;">Ignorar y seguir estudiando</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

function _lsGlobalModalEnter(streamId) {
  var overlay = document.getElementById('lsGlobalLiveModal');
  if (overlay) overlay.remove();
  _lsHideGlobalLiveBadge();
  if (typeof _lsAlertEnter === 'function') {
    _lsAlertEnter(streamId);
  } else if (typeof showScreen === 'function') {
    showScreen('liveStreamingScreen');
  }
}

function _lsGlobalModalIgnore(streamId) {
  // Don't persist dismissal — student should see the pill again on their next navigation.
  var overlay = document.getElementById('lsGlobalLiveModal');
  if (overlay) overlay.remove();
}

async function checkHideLiveFab() {
  try {
    var { data } = await supabaseClient
      .from('live_streams')
      .select('id')
      .eq('status', 'live');

    if (!data || data.length === 0) hideLiveFab();
  } catch(e) {
    // silent
  }
}

/* ── Verification gate state ────────────────────────────────── */
var _lsApprovedStreamIds = {};  // streamId → true once admin approves
var _lsDashLiveStreams = [];
var _lsVerifyStream = null;
var _lsWaitingChannel = null;

async function lsUpdateDashboardLiveBanner() {
  // Create banner container dynamically if it doesn't exist
  var banner = document.getElementById('dashboardLiveBanner');
  if (!banner) {
    var ref = document.getElementById('dashboardGroupBadge');
    if (!ref || !ref.parentNode) return;
    banner = document.createElement('div');
    banner.id = 'dashboardLiveBanner';
    banner.style.cssText = 'margin:10px 16px 0;display:none;';
    ref.parentNode.insertBefore(banner, ref);
  }

  if (!supabaseClient) { banner.style.display = 'none'; return; }

  try {
    var { data } = await supabaseClient
      .from('live_streams')
      .select('id, title, playback_url, class_group, instructor_name')
      .eq('status', 'live');

    if (!data || data.length === 0) {
      banner.style.display = 'none';
      _lsDashLiveStreams = [];
      return;
    }

    _lsDashLiveStreams = data;
    var groupLabels = { todos: _t('ls_all_students','Todos los Estudiantes'), mar_mie: _t('ls_tue_wed','Martes y Miércoles'), sab_dom: _t('ls_sat_sun','Sábado y Domingo') };

    var html = '';
    for (var i = 0; i < data.length; i++) {
      var s = data[i];
      var gLabel = groupLabels[s.class_group] || '';
      html +=
        '<div onclick="_lsDashJoinLive(' + i + ')" style="' +
          'background:linear-gradient(135deg,#dc2626 0%,#991b1b 50%,#dc2626 100%);' +
          'border:2px solid rgba(239,68,68,0.6);' +
          'border-radius:16px;' +
          'padding:18px 20px;' +
          'cursor:pointer;' +
          'margin-bottom:8px;' +
          'position:relative;overflow:hidden;' +
          'animation:lsDashLivePulse 2s ease-in-out infinite;' +
        '">' +
          '<div style="position:absolute;top:-50%;left:-60%;width:60%;height:200%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.1) 45%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.1) 55%,transparent 60%);transform:skewX(-15deg);animation:lsDashGlare 3s ease-in-out infinite;pointer-events:none;"></div>' +
          '<div style="display:flex;align-items:center;gap:14px;position:relative;z-index:1;">' +
            '<div style="flex-shrink:0;width:16px;height:16px;background:#fff;border-radius:50%;box-shadow:0 0 15px rgba(255,255,255,0.9);animation:lsa-pulse 1s infinite;"></div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="color:#fff;font-weight:900;font-size:20px;letter-spacing:1px;text-shadow:0 2px 8px rgba(0,0,0,0.3);">EN VIVO</div>' +
              '<div style="color:rgba(255,255,255,0.95);font-size:14px;font-weight:600;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _lsEsc(s.title || 'Clase en Directo') + '</div>' +
              (s.instructor_name ? '<div style="color:rgba(255,255,255,0.95);font-size:14px;margin-top:2px;">\uD83D\uDC68\u200D\uD83C\uDFEB ' + _lsEsc(s.instructor_name) + '</div>' : '') +
              (gLabel ? '<div style="color:rgba(255,255,255,0.9);font-size:13px;margin-top:2px;">' + gLabel + '</div>' : '') +
            '</div>' +
            '<div style="flex-shrink:0;background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);border-radius:12px;padding:10px 18px;">' +
              '<div style="color:#fff;font-weight:800;font-size:15px;white-space:nowrap;">ENTRAR \u2192</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    banner.innerHTML = html;
    banner.style.display = '';
  } catch(e) {
    banner.style.display = 'none';
  }
}

function _lsHideDashLiveBanner() {
  var banner = document.getElementById('dashboardLiveBanner');
  if (banner) banner.style.display = 'none';
  _lsDashLiveStreams = [];
}

/* ── Join live from dashboard ──────────────────────────────── */
function _lsDashJoinLive(idx) {
  var stream = _lsDashLiveStreams[idx];
  if (!stream) return;
  _lsVerifyStream = stream;
  _lsShowVerifyModal(stream);
}

/* ── Verify student modal ──────────────────────────────────── */
function _lsShowVerifyModal(stream) {
  var existing = document.getElementById('lsVerifyModal');
  if (existing) existing.remove();

  var email = localStorage.getItem('tecnico_email') || '';
  var nombre = localStorage.getItem('tecnico_nombre') || '';
  var prefill = nombre || email || '';

  var groupLabels = { mar_mie: _t('ls_tue_wed','Martes y Miércoles'), sab_dom: _t('ls_sat_sun','Sábado y Domingo') };
  var gLabel = groupLabels[stream.class_group] || '';

  var modal = document.createElement('div');
  modal.id = 'lsVerifyModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML =
    '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:20px;max-width:420px;width:100%;padding:32px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
      '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,59,48,0.1);border:1px solid rgba(255,59,48,0.3);border-radius:20px;padding:6px 16px;margin-bottom:16px;">' +
        '<div style="width:8px;height:8px;background:#FF3B30;border-radius:50%;animation:lsa-pulse 1s infinite;"></div>' +
        '<span style="color:#FF3B30;font-weight:800;font-size:13px;letter-spacing:0.5px;">EN VIVO AHORA</span>' +
      '</div>' +
      '<div style="color:#111111;font-weight:800;font-size:19px;margin-bottom:4px;">' + _lsEsc(stream.title || 'Clase en Directo') + '</div>' +
      (gLabel ? '<div style="color:#111111;font-size:14px;margin-bottom:20px;">Grupo: ' + gLabel + '</div>' : '<div style="margin-bottom:20px;"></div>') +
      '<div style="color:#111111;font-size:15px;margin-bottom:14px;font-weight:700;">Confirma tu identidad para entrar</div>' +
      '<div style="color:#111111;font-size:13px;margin-bottom:8px;">Ingresa tu nombre, correo electr\u00F3nico o tel\u00E9fono</div>' +
      '<input id="lsVerifyInput" type="text" placeholder="Ej: Mario Garc\u00EDa, mario@email.com, 555-1234" value="' + _lsEsc(prefill) + '" style="' +
        'width:100%;box-sizing:border-box;background:#F5F5F7;border:2px solid rgba(0,0,0,0.1);border-radius:12px;padding:14px 16px;color:#111111;font-size:15px;text-align:center;outline:none;margin-bottom:14px;transition:border-color .2s;' +
      '" onfocus="this.style.borderColor=\'rgba(255,59,48,0.5)\'" onblur="this.style.borderColor=\'rgba(0,0,0,0.1)\'">' +
      '<div id="lsVerifyError" style="display:none;color:#FF3B30;font-size:13px;margin-bottom:12px;padding:10px;background:rgba(255,59,48,0.08);border:1px solid rgba(255,59,48,0.2);border-radius:8px;font-weight:600;"></div>' +
      '<button onclick="_lsDoVerify()" id="lsVerifyBtn" style="' +
        'width:100%;background:#FF3B30;color:#fff;border:none;border-radius:12px;padding:16px;font-size:17px;font-weight:800;cursor:pointer;letter-spacing:0.5px;margin-bottom:12px;box-shadow:0 4px 15px rgba(255,59,48,0.35);transition:opacity .15s;' +
      '">ENTRAR A LA CLASE</button>' +
      '<button onclick="document.getElementById(\'lsVerifyModal\').remove()" style="' +
        'background:none;border:none;color:#111111;font-size:14px;cursor:pointer;padding:6px;font-weight:600;' +
      '">Cancelar</button>' +
    '</div>';

  document.body.appendChild(modal);

  var input = document.getElementById('lsVerifyInput');
  if (input) {
    input.focus();
    if (prefill) input.select();
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') _lsDoVerify();
    });
  }
}

/* ── Do verification ───────────────────────────────────────── */
async function _lsDoVerify() {
  var input = document.getElementById('lsVerifyInput');
  var errEl = document.getElementById('lsVerifyError');
  var btn = document.getElementById('lsVerifyBtn');
  var stream = _lsVerifyStream;
  if (!input || !stream) return;

  var val = input.value.trim();
  if (!val) {
    errEl.textContent = _tc('ls_enter_name_email', 'Ingresa tu nombre, email o teléfono');
    errEl.style.display = '';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Verificando...';
  btn.style.opacity = '0.6';
  errEl.style.display = 'none';

  try {
    // Flexible search: edge function tries email exact → nombre ilike → telefono ilike
    var _ud_user = await usersDataAdmin('admin_find_user_flexible', { value: val, fields: ['email','nombre','telefono'] });
    var user = _ud_user.data || null;

    if (!user) {
      errEl.innerHTML = '\u274C ' + _t('ls_user_not_found', 'No encontramos tu registro. Verifica que estés inscrito o contacta al administrador.');
      errEl.style.display = '';
      _lsResetVerifyBtn();
      return;
    }

    // User found — check group access
    if (stream.class_group && stream.class_group !== 'todos') {
      var hasAccess = await _lsCheckGroupAccess(user.email, stream.class_group);
      if (!hasAccess) {
        var gLabels = { mar_mie: _t('ls_group_tue_wed', 'Martes y Miércoles'), sab_dom: _t('ls_group_sat_sun', 'Sábado y Domingo') };
        errEl.innerHTML = '\uD83D\uDEAB ' + _t('ls_membership_no_group', 'Tu membresía no incluye el grupo') + ' <strong>' + _lsEsc(gLabels[stream.class_group] || stream.class_group) + '</strong>.';
        errEl.style.display = '';
        _lsResetVerifyBtn();
        return;
      }
    }

    // Access granted — save identity and enter waiting room
    localStorage.setItem('tecnico_email', user.email);
    if (user.nombre) localStorage.setItem('tecnico_nombre', user.nombre);

    var modal = document.getElementById('lsVerifyModal');
    if (modal) modal.remove();

    _lsEnterWaitingRoom(stream, user);

  } catch(e) {
    console.error('[LiveStream] Verify error:', e);
    errEl.textContent = (typeof _t === 'function' ? _t('ls_connection_error') : '\u26A0\uFE0F Error de conexi\u00F3n. Intenta de nuevo.');
    errEl.style.display = '';
    _lsResetVerifyBtn();
  }
}

function _lsResetVerifyBtn() {
  var btn = document.getElementById('lsVerifyBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'ENTRAR A LA CLASE';
    btn.style.opacity = '1';
  }
}

/* ── Check group access via memberships + CRM ──────────────── */
async function _lsCheckGroupAccess() {
  // Free native app — everyone has access to all live streams
  return true;
}

/* ── Waiting Room (student side) ───────────────────────────── */
var _lsWrPhotoDataUrl = null; // student photo for waiting room

function _lsEnterWaitingRoom(stream, user) {
  // Show pre-entry form: require full name + photo
  _lsShowPreEntryForm(stream, user);
}

function _lsShowPreEntryForm(stream, user) {
  var existing = document.getElementById('lsPreEntryForm');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'lsPreEntryForm';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML =
    '<div style="text-align:center;max-width:400px;width:100%;background:#FFFFFF;border-radius:20px;padding:24px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
      '<div style="font-size:32px;margin-bottom:8px;">🎓</div>' +
      '<div style="color:#111111;font-weight:800;font-size:19px;margin-bottom:4px;">Registro para Clase en Vivo</div>' +
      '<div style="color:#111111;font-size:14px;margin-bottom:20px;">' + _lsEsc(stream.title || 'Clase en Directo') + '</div>' +

      // Full name input
      '<div style="text-align:left;margin-bottom:16px;">' +
        '<label style="color:#111111;font-size:14px;font-weight:700;display:block;margin-bottom:6px;">Nombre Completo *</label>' +
        '<input type="text" id="lsPreEntryName" value="' + _lsEsc(user.nombre || '') + '" placeholder="' + _t('ls_name_example','Ej: Juan Pérez García') + '" style="width:100%;padding:10px 12px;background:#F5F5F7;border:1px solid rgba(0,0,0,0.1);border-radius:8px;color:#111111;font-size:15px;outline:none;box-sizing:border-box;">' +
        '<div style="color:#111111;font-size:13px;margin-top:4px;">Nombre y apellido como el instructor te conoce</div>' +
      '</div>' +

      // Photo section
      '<div style="text-align:left;margin-bottom:20px;">' +
        '<label style="color:#111111;font-size:14px;font-weight:700;display:block;margin-bottom:6px;">Tu Foto *</label>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
          '<div id="lsPreEntryPhotoPreview" style="width:80px;height:80px;border-radius:12px;background:#F5F5F7;border:2px dashed rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">' +
            '<span style="color:#111111;font-size:28px;">📷</span>' +
          '</div>' +
          '<div style="flex:1;">' +
            '<button onclick="_lsPreEntryTakePhoto()" style="width:100%;padding:10px;background:#007AFF;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:6px;">📸 Tomar Selfie</button>' +
            '<button onclick="document.getElementById(\'lsPreEntryFileInput\').click()" style="width:100%;padding:10px;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.15);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">📁 Subir Foto</button>' +
            '<input type="file" id="lsPreEntryFileInput" accept="image/*" onchange="_lsPreEntryHandleFile(this)" style="display:none;">' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Hidden video for camera capture
      '<video id="lsPreEntryCamVideo" autoplay playsinline muted style="display:none;width:200px;height:150px;border-radius:8px;margin:0 auto;"></video>' +
      '<canvas id="lsPreEntryCamCanvas" style="display:none;"></canvas>' +
      '<div id="lsPreEntryCamActions" style="display:none;margin-bottom:16px;">' +
        '<button onclick="_lsPreEntryCapturePhoto()" style="padding:10px 20px;background:#34c759;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">📸 Capturar</button> ' +
        '<button onclick="_lsPreEntryCancelCam()" style="padding:10px 20px;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.15);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Cancelar</button>' +
      '</div>' +

      // Error message
      '<div id="lsPreEntryError" style="display:none;color:#FF3B30;font-size:13px;margin-bottom:12px;font-weight:600;"></div>' +

      // Submit
      '<button onclick="_lsPreEntrySubmit()" id="lsPreEntrySubmitBtn" style="width:100%;padding:14px;background:#FF3B30;color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:800;cursor:pointer;margin-bottom:8px;box-shadow:0 4px 12px rgba(255,59,48,0.3);">Solicitar Entrada</button>' +
      '<button onclick="_lsPreEntryCancel()" style="width:100%;padding:10px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.12);color:#111111;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">Cancelar</button>' +
    '</div>';

  document.body.appendChild(overlay);

  // Store stream/user for later
  overlay._stream = stream;
  overlay._user = user;
  _lsWrPhotoDataUrl = null;
}

function _lsPreEntryTakePhoto() {
  var video = document.getElementById('lsPreEntryCamVideo');
  var actions = document.getElementById('lsPreEntryCamActions');
  if (!video || !actions) return;

  navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
    .then(function(stream) {
      video._stream = stream;
      video.srcObject = stream;
      video.style.display = 'block';
      actions.style.display = 'block';
    })
    .catch(function(e) {
      window.MaestroDialog.alert({title: 'Error', message: _tc('ls_camera_access_failed', 'No se pudo acceder a la cámara. Usa "Subir Foto" en su lugar.'), kind: 'error'});
    });
}

function _lsPreEntryCapturePhoto() {
  var video = document.getElementById('lsPreEntryCamVideo');
  var canvas = document.getElementById('lsPreEntryCamCanvas');
  if (!video || !canvas) return;

  canvas.width = 150;
  canvas.height = 150;
  var ctx = canvas.getContext('2d');
  // Center crop to square
  var size = Math.min(video.videoWidth, video.videoHeight);
  var sx = (video.videoWidth - size) / 2;
  var sy = (video.videoHeight - size) / 2;
  ctx.drawImage(video, sx, sy, size, size, 0, 0, 150, 150);

  _lsWrPhotoDataUrl = canvas.toDataURL('image/jpeg', 0.6);

  // Show preview
  var preview = document.getElementById('lsPreEntryPhotoPreview');
  if (preview) preview.innerHTML = '<img src="' + _lsWrPhotoDataUrl + '" style="width:100%;height:100%;object-fit:cover;">';

  // Stop camera
  _lsPreEntryCancelCam();
}

function _lsPreEntryCancelCam() {
  var video = document.getElementById('lsPreEntryCamVideo');
  var actions = document.getElementById('lsPreEntryCamActions');
  if (video) {
    if (video._stream) video._stream.getTracks().forEach(function(t) { t.stop(); });
    video.srcObject = null;
    video.style.display = 'none';
  }
  if (actions) actions.style.display = 'none';
}

function _lsPreEntryHandleFile(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  if (file.size > 5 * 1024 * 1024) { window.showToast(_t('ls_photo_too_large', 'La foto debe ser menor a 5 MB'), 'warning'); return; }

  var reader = new FileReader();
  reader.onload = function(e) {
    // Resize to 150x150 for efficiency
    var img = new Image();
    img.onload = function() {
      var canvas = document.getElementById('lsPreEntryCamCanvas');
      if (!canvas) return;
      canvas.width = 150;
      canvas.height = 150;
      var ctx = canvas.getContext('2d');
      var size = Math.min(img.width, img.height);
      var sx = (img.width - size) / 2;
      var sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 150, 150);
      _lsWrPhotoDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      var preview = document.getElementById('lsPreEntryPhotoPreview');
      if (preview) preview.innerHTML = '<img src="' + _lsWrPhotoDataUrl + '" style="width:100%;height:100%;object-fit:cover;">';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function _lsPreEntrySubmit() {
  var nameInput = document.getElementById('lsPreEntryName');
  var errorEl = document.getElementById('lsPreEntryError');
  var overlay = document.getElementById('lsPreEntryForm');
  if (!nameInput || !overlay) return;

  var nombre = nameInput.value.trim();

  // Validate: at least first + last name
  if (!nombre || nombre.split(/\s+/).length < 2) {
    if (errorEl) { errorEl.style.display = ''; errorEl.textContent = _tc('ls_enter_full_name', 'Escribe tu nombre completo (nombre y apellido)'); }
    nameInput.focus();
    return;
  }

  // Validate: photo required
  if (!_lsWrPhotoDataUrl) {
    if (errorEl) { errorEl.style.display = ''; errorEl.textContent = _tc('ls_upload_photo', 'Toma una selfie o sube tu foto para continuar'); }
    return;
  }

  // Update user name
  var stream = overlay._stream;
  var user = overlay._user;
  user.nombre = nombre;

  // Remove form and proceed to actual waiting room
  overlay.remove();
  _lsActualEnterWaitingRoom(stream, user);
}

function _lsPreEntryCancel() {
  _lsPreEntryCancelCam();
  var overlay = document.getElementById('lsPreEntryForm');
  if (overlay) overlay.remove();
}

function _lsActualEnterWaitingRoom(stream, user) {
  _lsShowWaitingRoomUI(stream, user);

  var channelName = 'waiting-room-' + stream.id;
  if (_lsWaitingChannel) {
    try { supabaseClient.removeChannel(_lsWaitingChannel); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  }

  _lsWaitingChannel = supabaseClient.channel(channelName, {
    config: { presence: { key: user.email } }
  });

  _lsWaitingChannel
    .on('broadcast', { event: 'admission' }, function(payload) {
      var data = payload.payload;
      if (data.email === user.email) {
        if (data.action === 'approve') {
          _lsWaitingApproved(stream);
        } else if (data.action === 'reject') {
          _lsWaitingRejected();
        }
      }
    })
    .subscribe(async function(status) {
      if (status === 'SUBSCRIBED') {
        await _lsWaitingChannel.track({
          email: user.email,
          nombre: user.nombre || '',
          telefono: user.telefono || '',
          photo: _lsWrPhotoDataUrl || '',
          requested_at: new Date().toISOString()
        });
      }
    });
}

function _lsShowWaitingRoomUI(stream, user) {
  var existing = document.getElementById('lsWaitingRoom');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'lsWaitingRoom';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML =
    '<div style="text-align:center;max-width:400px;width:100%;background:#FFFFFF;border-radius:20px;padding:28px 24px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
      '<div style="position:relative;width:100px;height:100px;margin:0 auto 24px;">' +
        '<div style="position:absolute;inset:0;border:3px solid transparent;border-top-color:#FF3B30;border-radius:50%;animation:lsWaitSpin 1s linear infinite;"></div>' +
        '<div style="position:absolute;inset:8px;border:3px solid transparent;border-top-color:#f97316;border-radius:50%;animation:lsWaitSpin 1.5s linear infinite reverse;"></div>' +
        '<div style="position:absolute;inset:16px;border:3px solid transparent;border-top-color:#eab308;border-radius:50%;animation:lsWaitSpin 2s linear infinite;"></div>' +
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;">\uD83C\uDF93</div>' +
      '</div>' +
      '<div style="color:#111111;font-weight:800;font-size:20px;margin-bottom:8px;">Sala de Espera</div>' +
      '<div style="color:#111111;font-size:15px;margin-bottom:6px;">Esperando aprobaci\u00F3n del instructor...</div>' +
      '<div id="lsWaitingStatus" style="color:#111111;font-size:13px;margin-bottom:24px;">Tu solicitud ha sido enviada</div>' +
      '<div style="background:#F5F5F7;border:1px solid rgba(0,0,0,0.08);border-radius:12px;padding:14px;margin-bottom:24px;">' +
        '<div style="color:#111111;font-size:14px;font-weight:700;">' + _lsEsc(user.nombre || user.email) + '</div>' +
        '<div style="color:#111111;font-size:13px;margin-top:4px;">' + _lsEsc(stream.title || 'Clase en Directo') + '</div>' +
      '</div>' +
      '<button onclick="_lsLeaveWaitingRoom()" style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.15);color:#111111;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">Cancelar</button>' +
    '</div>';

  document.body.appendChild(overlay);
}

function _lsWaitingApproved(stream) {
  // Mark this stream as approved for the session
  _lsApprovedStreamIds[stream.id] = true;

  var statusEl = document.getElementById('lsWaitingStatus');
  if (statusEl) {
    statusEl.innerHTML = '<span style="color:#34c759;font-weight:800;font-size:16px;">\u2705 ' + _t('ls_approved_entering', '¡Aprobado! Entrando a la clase...') + '</span>';
  }

  if (_lsWaitingChannel) {
    try { supabaseClient.removeChannel(_lsWaitingChannel); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    _lsWaitingChannel = null;
  }

  setTimeout(function() {
    var overlay = document.getElementById('lsWaitingRoom');
    if (overlay) overlay.remove();

    showScreen('liveStreamingScreen');

    // Pre-hide elements immediately so student never sees the header/tabs flash
    _lsHideImmersiveElements();

    setTimeout(function() {
      // Fetch latest playback_url (may have changed since waiting room entry)
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('live_streams').select('playback_url').eq('id', stream.id).single().then(function(res) {
          var url = (res.data && res.data.playback_url) || stream.playback_url || '';
          _lsWatchStreamDirect(stream.id, url);
        }).catch(function() {
          _lsWatchStreamDirect(stream.id, stream.playback_url || '');
        });
      } else {
        _lsWatchStreamDirect(stream.id, stream.playback_url || '');
      }
    }, 300);
  }, 1500);
}

function _lsWaitingRejected() {
  if (_lsWaitingChannel) {
    try { supabaseClient.removeChannel(_lsWaitingChannel); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    _lsWaitingChannel = null;
  }

  var overlay = document.getElementById('lsWaitingRoom');
  if (!overlay) return;

  overlay.innerHTML =
    '<div style="text-align:center;max-width:400px;width:100%;background:#FFFFFF;border-radius:20px;padding:28px 24px;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
      '<div style="font-size:64px;margin-bottom:16px;">\uD83D\uDEAB</div>' +
      '<div style="color:#FF3B30;font-weight:800;font-size:20px;margin-bottom:8px;">Acceso Denegado</div>' +
      '<div style="color:#111111;font-size:15px;margin-bottom:24px;">El instructor no aprob\u00F3 tu entrada en este momento.</div>' +
      '<button onclick="document.getElementById(\'lsWaitingRoom\').remove()" style="background:#FF3B30;color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(255,59,48,0.3);">Cerrar</button>' +
    '</div>';
}

function _lsLeaveWaitingRoom() {
  if (_lsWaitingChannel) {
    try { _lsWaitingChannel.untrack(); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    try { supabaseClient.removeChannel(_lsWaitingChannel); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
    _lsWaitingChannel = null;
  }
  var overlay = document.getElementById('lsWaitingRoom');
  if (overlay) overlay.remove();
}

/* ── Moderation helpers ──────────────────────────────────────── */
async function lsLoadModerationState(streamId) {
  var email = localStorage.getItem('tecnico_email') || '';
  _lsIsModerator = false;
  _lsIsBanned = false;
  _lsModeratorEmails = [];

  try {
    // Load moderator list
    var { data: mods } = await supabaseClient.from('stream_moderators').select('user_email');
    _lsModeratorEmails = (mods || []).map(function(m) { return m.user_email; });
    _lsIsModerator = _lsModeratorEmails.indexOf(email) !== -1;

    // Check if current user is banned in this stream
    var { data: bans } = await supabaseClient.from('stream_chat_bans')
      .select('id').eq('stream_id', streamId).eq('user_email', email).limit(1);
    _lsIsBanned = bans && bans.length > 0;

    if (_lsIsBanned) {
      var input = document.getElementById('lsChatInput');
      if (input) { input.placeholder = '🚫 Has sido bloqueado del chat'; input.disabled = true; }
    }
  } catch(e) {
    console.error('[LiveStreaming] Moderation state error:', e);
  }
}

function lsDeleteChatMsg(msgId) {
  if (!msgId) return;
  supabaseClient.from('stream_chat_messages').update({ deleted: true }).eq('id', msgId).then(function(res) {
    if (res.error) console.error('[LiveStreaming] Delete msg error:', res.error);
  });
}

function lsBanUser(email, name) {
  if (!email || !_lsCurrentStreamId) return;
  var _who = name || email;
  var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
    ? window.MaestroDialog.confirm({
        title: _t('ls_ban_title', 'Banear del chat'),
        message: _t('ls_ban_confirm', '¿Banear a ') + _who + _t('ls_ban_confirm2', ' del chat?'),
        okText: _t('ls_ban_ok', 'Banear'),
        cancelText: _t('ls_ban_cancel', 'Cancelar'),
        destructive: true,
        kind: 'warning'
      })
    : Promise.resolve(confirm(_t('ls_ban_confirm', '¿Banear a ') + _who + _t('ls_ban_confirm2', ' del chat?')));
  _ask.then(function(ok) {
    if (!ok) return;
    _lsDoBan(email, name);
  });
}
function _lsDoBan(email, name) {
  var bannedBy = localStorage.getItem('tecnico_email') || 'admin';
  supabaseClient.from('stream_chat_bans').insert({
    stream_id: _lsCurrentStreamId,
    user_email: email,
    user_name: name || '',
    banned_by: bannedBy
  }).then(function(res) {
    if (res.error) {
      if (res.error.code === '23505') window.showToast(_t('ls_already_banned', 'Este usuario ya está baneado'), 'warning');
      else console.error('[LiveStreaming] Ban error:', res.error);
    } else {
      window.showToast((name || email) + ' ' + _t('ls_user_banned', 'ha sido baneado del chat'), 'success');
    }
  });
}

/* ── Leave streaming screen ─────────────────────────────────── */
function leaveLiveStreaming() {
  lsClosePlayer();
  // Keep the global status subscription alive for the FAB
  showScreen('dashboardScreen');
}

/* ── Escape HTML helper ─────────────────────────────────────── */
function _lsEsc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── Escape for JS string inside onclick attributes ────────── */
function _lsJsEsc(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '\\x3c');
}

/* ── Inject pulse animation + landscape styles if not present ── */
(function() {
  if (!document.getElementById('lsPulseStyle')) {
    var s = document.createElement('style');
    s.id = 'lsPulseStyle';
    s.textContent = '@keyframes lsa-pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}' +
      '@keyframes lsChatFadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}' +
      '@keyframes lsDashLivePulse{0%,100%{box-shadow:0 4px 25px rgba(239,68,68,0.4);}50%{box-shadow:0 6px 40px rgba(239,68,68,0.8);}}' +
      '@keyframes lsDashGlare{0%{left:-60%}100%{left:160%}}' +
      '@keyframes lsWaitSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}' +
      '.ls-chat-msg{animation:lsChatFadeIn .25s ease-out;}' +
      '.ls-mod-badge{font-size:10px;margin-right:2px;}' +
      '.ls-mod-action{background:none;border:none;cursor:pointer;font-size:12px;padding:1px 3px;opacity:0.5;transition:opacity .15s;}' +
      '.ls-mod-action:hover{opacity:1;}' +
      /* Hide the legacy floating buttons in EVERY orientation — the tools bar at the bottom of the video now owns reload + chat toggle. */
      '#lsFloatingReload{display:none!important;}' +
      /* ── Landscape (ALL heights: iPhone, iPad, iPad Pro) ── */
      '@media(orientation:landscape){' +
        '#lsContentArea{padding:0!important;display:flex!important;flex-direction:row!important;position:fixed!important;inset:0!important;overflow:hidden!important;touch-action:manipulation!important;background:#000!important;}' +
        '#lsPlayerSection{display:flex!important;flex-direction:column!important;flex:1!important;min-width:0!important;position:relative!important;touch-action:manipulation!important;}' +
        '#lsPlayerContainer{padding-bottom:0!important;width:100%!important;height:100%!important;border-radius:0!important;flex:1!important;touch-action:manipulation!important;}' +
        '#lsPlayerIframe,#lsPlayerVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;background:#000!important;}' +
        /* Bottom tools bar — horizontally scrollable so nothing ever clips, safe-area aware */
        '#lsPlayerToolsBar{position:absolute!important;left:0!important;right:0!important;bottom:0!important;z-index:25!important;' +
          'padding:6px max(8px,env(safe-area-inset-right,8px)) max(6px,env(safe-area-inset-bottom,6px)) max(8px,env(safe-area-inset-left,8px))!important;' +
          'background:linear-gradient(transparent,rgba(0,0,0,0.8))!important;' +
          'display:flex!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;}' +
        '#lsPlayerToolsBar::-webkit-scrollbar{display:none!important;}' +
        '#lsPlayerToolsBar button{padding:8px 12px!important;font-size:12px!important;font-weight:700!important;border-radius:10px!important;min-width:auto!important;min-height:38px!important;flex-shrink:0!important;white-space:nowrap!important;margin:0!important;}' +
        '#lsFullscreenBtn{margin-left:auto!important;}' +
        /* Floating reload — top-right, safe-area respected */
        '#lsFloatingReload{position:absolute!important;top:max(8px,env(safe-area-inset-top,8px))!important;right:max(8px,env(safe-area-inset-right,8px))!important;width:42px!important;height:42px!important;font-size:18px!important;z-index:26!important;}' +
        /* Chat side panel — respect safe-area-inset-right so nothing inside clips */
        '#lsChatSection{position:fixed!important;top:0!important;right:0!important;bottom:0!important;' +
          'width:min(340px, 38vw)!important;max-width:38vw!important;' +
          'z-index:30!important;border-radius:0!important;flex-direction:column!important;' +
          'background:#FFFFFF!important;border-left:1px solid rgba(0,0,0,0.08)!important;' +
          'padding-right:env(safe-area-inset-right,0)!important;padding-bottom:env(safe-area-inset-bottom,0)!important;touch-action:manipulation!important;}' +
        '#lsChatSection *{box-sizing:border-box!important;}' +
        '#lsChatSection>div:first-child{flex-shrink:0!important;min-height:44px!important;padding:8px 10px!important;gap:6px!important;}' +
        '#lsChatSection>div:first-child button{min-width:32px!important;width:32px!important;height:32px!important;flex-shrink:0!important;font-size:16px!important;margin-left:auto!important;}' +
        '#lsChatMessages{flex:1!important;height:auto!important;max-height:none!important;}' +
        /* Chat input rows — shrink button padding so nothing clips */
        '#lsChatSection>div:nth-last-child(2){padding:6px 8px!important;gap:4px!important;}' +
        '#lsChatSection>div:last-child{padding:6px 8px!important;padding-bottom:max(8px,env(safe-area-inset-bottom,8px))!important;gap:4px!important;}' +
        '#lsQAInput,#lsChatInput{min-width:0!important;flex:1 1 0!important;font-size:14px!important;padding:7px 10px!important;}' +
        '#lsChatSection button[onclick="_lsSubmitQuestion()"]{padding:6px 10px!important;font-size:11px!important;flex-shrink:0!important;}' +
        '#lsChatSendBtn{width:34px!important;height:34px!important;flex-shrink:0!important;}' +
        /* Chat toggle (floating bubble when chat is hidden) — bottom-right, clear of tools bar */
        '#lsChatToggleBtn{top:auto!important;' +
          'bottom:max(62px, calc(env(safe-area-inset-bottom,8px) + 62px))!important;' +
          'right:max(12px,env(safe-area-inset-right,12px))!important;' +
          'width:46px!important;height:46px!important;font-size:20px!important;animation:none!important;z-index:27!important;}' +
        /* Self preview small + safe-area aware */
        '#lsSelfPreview{position:fixed!important;bottom:max(62px,calc(env(safe-area-inset-bottom,8px)+62px))!important;left:max(8px,env(safe-area-inset-left,8px))!important;z-index:26!important;margin:0!important;}' +
        '#lsSelfVideo{width:110px!important;height:80px!important;}' +
        /* Break + unmute overlays compact */
        '#lsBreakOverlay div:first-child{font-size:32px!important;}' +
        '#lsBreakTimer{font-size:36px!important;}' +
        '#lsUnmuteOverlay{padding:10px 18px!important;font-size:14px!important;bottom:80px!important;}' +
      '}' +
      /* ── Portrait: ensure bottom tools bar lays out cleanly, never clips buttons ── */
      '@media(orientation:portrait){' +
        '#lsPlayerToolsBar{display:flex!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;padding:6px 4px!important;}' +
        '#lsPlayerToolsBar::-webkit-scrollbar{display:none!important;}' +
        '#lsPlayerToolsBar button{flex-shrink:0!important;white-space:nowrap!important;min-height:40px!important;padding:8px 12px!important;font-size:12px!important;}' +
        '#lsFullscreenBtn{margin-left:auto!important;}' +
        '#lsChatToggleBtn{right:max(12px,env(safe-area-inset-right,12px))!important;}' +
        '#lsFloatingReload{right:max(12px,env(safe-area-inset-right,12px))!important;}' +
      '}';
    document.head.appendChild(s);
  }
})();

/* ═══════════════════════════════════════════════════════════════
   STUDENT-SIDE CONSOLE: Polls, Q&A, Countdown, Slow Mode
   ═══════════════════════════════════════════════════════════════ */

var _lsSlowModeSeconds = 0;
var _lsQALastSentAt = 0;
var _lsCountdownInterval = null;
var _lsCountdownLocalSeconds = 0;
var _lsConsoleChannels = [];

function _lsSubscribeConsole(streamId) {
  _lsCleanupConsole();

  // ── Slow Mode ──
  var chSettings = supabaseClient.channel('chat-settings-' + streamId);
  chSettings.on('broadcast', { event: 'slow_mode' }, function(payload) {
    var data = payload.payload;
    _lsSlowModeSeconds = (data && data.seconds) ? data.seconds : 0;
    var indicator = document.getElementById('lsSlowModeIndicator');
    if (indicator) {
      indicator.style.display = _lsSlowModeSeconds > 0 ? '' : 'none';
      indicator.textContent = 'Slow Mode: ' + _lsSlowModeSeconds + 's';
    }
  });
  chSettings.subscribe(function(status) {
    if (status === 'SUBSCRIBED') {
      // Request current slow mode state from admin (late-joiner sync)
      chSettings.send({ type: 'broadcast', event: 'request_state', payload: {} });
    }
  });
  _lsConsoleChannels.push(chSettings);

  // ── Polls ──
  var chPolls = supabaseClient.channel('polls-' + streamId);
  chPolls.on('broadcast', { event: 'new_poll' }, function(payload) {
    var data = payload.payload;
    if (data) _lsShowStudentPoll(data, streamId);
  });
  chPolls.on('broadcast', { event: 'close_poll' }, function(payload) {
    var card = document.getElementById('lsPollCard');
    if (card) {
      card.style.borderColor = '#ef4444';
      card.querySelector('.ls-poll-status').textContent = _tc('ls_poll_closed', 'Encuesta cerrada');
      setTimeout(function() { card.remove(); }, 5000);
    }
  });
  chPolls.subscribe(function(status) {
    if (status === 'SUBSCRIBED') {
      chPolls.send({ type: 'broadcast', event: 'request_poll', payload: {} });
    }
  });
  _lsConsoleChannels.push(chPolls);

  // ── Q&A ──
  var chQA = supabaseClient.channel('qa-' + streamId);
  chQA.on('broadcast', { event: 'question_answered' }, function(payload) {
    var data = payload.payload;
    if (data && data.questionId) {
      // Visual feedback: show "your question was answered" toast
      if (typeof _lsChatToast === 'function') _lsChatToast('Tu pregunta fue respondida', 'success');
    }
  });
  chQA.subscribe();
  _lsConsoleChannels.push(chQA);

  // ── Countdown ──
  var chCountdown = supabaseClient.channel('countdown-' + streamId);
  chCountdown.on('broadcast', { event: 'countdown' }, function(payload) {
    var data = payload.payload;
    if (data && data.seconds > 0) {
      _lsShowStudentCountdown(data.seconds);
    } else {
      _lsShowStudentCountdown(0);
    }
  });
  chCountdown.subscribe();
  _lsConsoleChannels.push(chCountdown);
}

function _lsCleanupConsole() {
  _lsSlowModeSeconds = 0;
  if (_lsCountdownInterval) { clearInterval(_lsCountdownInterval); _lsCountdownInterval = null; }
  _lsCountdownLocalSeconds = 0;
  _lsConsoleChannels.forEach(function(ch) {
    try { supabaseClient.removeChannel(ch); } catch(e) { console.warn('[LiveStreaming]', e.message || e); }
  });
  _lsConsoleChannels = [];
  var pollCard = document.getElementById('lsPollCard');
  if (pollCard) pollCard.remove();
  var countdown = document.getElementById('lsCountdownOverlay');
  if (countdown) countdown.remove();
}

// ── HTML escape (local, always available on student side) ──
function _lsEscHtml(str) { if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

// ── Student poll UI ──
function _lsShowStudentPoll(poll, streamId) {
  var old = document.getElementById('lsPollCard');
  if (old) old.remove();

  var card = document.createElement('div');
  card.id = 'lsPollCard';
  card.style.cssText = 'position:fixed;top:200px;left:50%;transform:translateX(-50%);z-index:99998;background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-left:4px solid #8b5cf6;border-radius:16px;padding:16px;width:320px;max-width:90vw;box-shadow:0 10px 40px rgba(0,0,0,0.25);animation:lsa-slideIn 0.3s;';

  var safePollId = (poll.id||'').toString().replace(/['"<>&]/g,'');
  var safeStreamId = (streamId||'').toString().replace(/['"<>&]/g,'');
  var optHtml = '';
  poll.options.forEach(function(opt, idx) {
    optHtml += '<button onclick="_lsVotePoll(\'' + safePollId + '\',' + idx + ',\'' + safeStreamId + '\',this)" style="display:block;width:100%;text-align:left;padding:10px 14px;margin-bottom:6px;background:#F5F5F7;border:1px solid rgba(0,0,0,0.08);border-radius:10px;color:#111111;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;" onmouseover="this.style.borderColor=\'#8b5cf6\'" onmouseout="this.style.borderColor=\'rgba(0,0,0,0.08)\'">' + _lsEscHtml(opt) + '</button>';
  });

  card.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
      '<div style="color:#7c3aed;font-weight:800;font-size:14px;letter-spacing:0.5px;">ENCUESTA</div>' +
      '<span class="ls-poll-status" style="color:#34c759;font-size:11px;font-weight:700;">Activa</span>' +
    '</div>' +
    '<div style="color:#111111;font-size:14px;font-weight:700;margin-bottom:12px;">' + _lsEscHtml(poll.question) + '</div>' +
    '<div id="lsPollOptions">' + optHtml + '</div>';

  document.body.appendChild(card);

  // Auto-remove after 5 minutes
  setTimeout(function() { var c = document.getElementById('lsPollCard'); if (c) c.remove(); }, 300000);
}

function _lsVotePoll(pollId, optionIndex, streamId, btn) {
  // Disable all buttons
  var container = document.getElementById('lsPollOptions');
  if (container) {
    container.querySelectorAll('button').forEach(function(b) {
      b.disabled = true;
      b.style.opacity = '0.5';
      b.style.cursor = 'default';
    });
  }
  if (btn) { btn.style.background = '#8b5cf6'; btn.style.color = '#fff'; btn.style.opacity = '1'; btn.style.fontWeight = '700'; }

  var email = localStorage.getItem('tecnico_email') || 'anonymous';
  // Send vote via broadcast
  var ch = supabaseClient.channel('polls-' + streamId);
  ch.subscribe(function(status) {
    if (status === 'SUBSCRIBED') {
      ch.send({ type: 'broadcast', event: 'poll_vote', payload: { pollId: pollId, optionIndex: optionIndex, email: email } });
      setTimeout(function() { supabaseClient.removeChannel(ch); }, 1000);
    }
  });

  if (typeof _lsChatToast === 'function') _lsChatToast('Voto registrado', 'success');
  // Remove card after 3s
  setTimeout(function() { var c = document.getElementById('lsPollCard'); if (c) c.remove(); }, 3000);
}

// ── Student Q&A submission ──
function _lsSubmitQuestion() {
  var input = document.getElementById('lsQAInput');
  if (!input || !input.value.trim() || !_lsCurrentStreamId) return;

  var now = Date.now();
  if (now - _lsQALastSentAt < 5000) { if (typeof _lsChatToast === 'function') _lsChatToast('Espera unos segundos', 'warn'); return; }
  _lsQALastSentAt = now;

  var email = localStorage.getItem('tecnico_email') || '';
  var name = '';
  try { name = JSON.parse(localStorage.getItem('tecnico_user')).nombre || 'Estudiante'; } catch (e) { name = 'Estudiante'; }

  var question = input.value.trim();
  input.value = '';

  var ch = supabaseClient.channel('qa-' + _lsCurrentStreamId);
  ch.subscribe(function(status) {
    if (status === 'SUBSCRIBED') {
      ch.send({
        type: 'broadcast',
        event: 'new_question',
        payload: { id: 'q-' + Date.now(), email: email, name: name, question: question }
      });
      setTimeout(function() { supabaseClient.removeChannel(ch); }, 1000);
    }
  });

  if (typeof _lsChatToast === 'function') _lsChatToast('Pregunta enviada al instructor', 'success');
}

// ── Student countdown overlay ──
function _lsShowStudentCountdown(seconds) {
  // Clear any existing local countdown interval
  if (_lsCountdownInterval) { clearInterval(_lsCountdownInterval); _lsCountdownInterval = null; }

  // If seconds <= 0, remove overlay and stop
  if (seconds <= 0) {
    _lsCountdownLocalSeconds = 0;
    var overlay = document.getElementById('lsCountdownOverlay');
    if (overlay) overlay.remove();
    return;
  }

  // Create overlay if it doesn't exist
  var existing = document.getElementById('lsCountdownOverlay');
  if (!existing) {
    existing = document.createElement('div');
    existing.id = 'lsCountdownOverlay';
    existing.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99997;background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-left:6px solid #f59e0b;border-radius:16px;padding:24px 40px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.25);';
    existing.innerHTML =
      '<div style="color:#b45309;font-size:13px;font-weight:800;margin-bottom:8px;letter-spacing:1px;">LA CLASE EMPIEZA EN</div>' +
      '<div id="lsCountdownTime" style="color:#111111;font-size:52px;font-weight:800;font-family:monospace;">--:--</div>';
    document.body.appendChild(existing);
  }

  // Set local seconds and update display immediately
  _lsCountdownLocalSeconds = seconds;
  _lsUpdateStudentCountdownDisplay();

  // Start local 1-second interval to decrement and update
  _lsCountdownInterval = setInterval(function() {
    _lsCountdownLocalSeconds--;
    if (_lsCountdownLocalSeconds <= 0) {
      clearInterval(_lsCountdownInterval);
      _lsCountdownInterval = null;
      _lsCountdownLocalSeconds = 0;
      var ol = document.getElementById('lsCountdownOverlay');
      if (ol) ol.remove();
      return;
    }
    _lsUpdateStudentCountdownDisplay();
  }, 1000);
}

function _lsUpdateStudentCountdownDisplay() {
  var timeEl = document.getElementById('lsCountdownTime');
  if (!timeEl) return;
  var m = Math.floor(_lsCountdownLocalSeconds / 60);
  var s = _lsCountdownLocalSeconds % 60;
  timeEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

/* ===================================================================
   VOD Quiz Engine — Student quiz for VOD recordings
   Follows video-tutoriales.js pattern (start, render, select, confirm, finish, retry)
   =================================================================== */

/* ── Preload passed quizzes for current student ────────────── */
async function _lsLoadVodQuizPassed() {
  _lsVodQuizPassed = {};
  try {
    var stuEmail = '';
    try { stuEmail = (JSON.parse(localStorage.getItem('tecnico_user') || '{}').email || '').toLowerCase().trim(); } catch(e) {}
    if (!stuEmail || !supabaseClient) return;
    var res = await supabaseClient.from('stream_recording_quiz_results')
      .select('recording_id').eq('student_email', stuEmail).eq('passed', true);
    if (res.data) {
      res.data.forEach(function(r) { _lsVodQuizPassed[r.recording_id] = true; });
    }
  } catch(e) { /* non-blocking */ }
}

/* ── Start VOD quiz ────────────────────────────────────────── */
function lsStartVodQuiz(recordingId) {
  var rec = _lsVodRecordingsCache.find(function(r) { return r.id === recordingId; });
  if (!rec || !rec.quiz_questions || rec.quiz_questions.length === 0) return;

  _lsLastVodQuizRecId = recordingId;
  _lsCurrentVodQuiz = {
    recordingId: recordingId,
    recording: rec,
    title: (rec.live_streams ? rec.live_streams.title : '') || 'Grabación',
    questions: rec.quiz_questions.slice(),
    currentIndex: 0,
    answers: [],
    correctCount: 0,
    selectedOption: -1,
    confirmed: false,
    startTime: Date.now()
  };

  _lsRenderVodQuizQuestion();
}

/* ── Render current quiz question ──────────────────────────── */
function _lsRenderVodQuizQuestion() {
  var q = _lsCurrentVodQuiz;
  if (!q) return;

  // Create or get overlay
  var overlay = document.getElementById('lsVodQuizOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lsVodQuizOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';

  var question = q.questions[q.currentIndex];
  var total = q.questions.length;
  var current = q.currentIndex + 1;
  var pct = Math.round((current / total) * 100);

  // Progress dots
  var dots = '';
  for (var i = 0; i < total; i++) {
    var dotColor = '#E7E5DE';
    if (i < q.answers.length) {
      dotColor = q.answers[i].correct ? '#059669' : '#DC2626';
    } else if (i === q.currentIndex) {
      dotColor = '#3b82f6';
    }
    dots += '<div style="width:10px;height:10px;border-radius:50%;background:' + dotColor + '"></div>';
  }

  // Options
  var optionsHtml = '';
  question.options.forEach(function(opt, idx) {
    var letter = ['A', 'B', 'C', 'D'][idx];
    optionsHtml += '<button class="lsq-option" data-idx="' + idx + '" onclick="lsSelectVodQuizOption(' + idx + ')" ' +
      'style="display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;background:#FFFFFF;border:2px solid #E7E5DE;border-radius:10px;color:#0F0F0F;font-size:14px;cursor:pointer;text-align:left;margin-bottom:8px;transition:all .2s">' +
      '<span style="min-width:28px;height:28px;border-radius:50%;background:#FAFAF7;border:2px solid #E7E5DE;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;color:#6B6B66">' + letter + '</span>' +
      '<span>' + _lsEsc(opt) + '</span></button>';
  });

  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;padding:28px;position:relative;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
        '<h3 style="color:#0F0F0F;font-size:16px;margin:0">📝 Quiz: ' + _lsEsc(q.title) + '</h3>' +
        '<span style="color:#6B6B66;font-size:13px;font-weight:600">' + current + '/' + total + '</span>' +
      '</div>' +
      '<div style="background:#E7E5DE;height:6px;border-radius:3px;margin-bottom:12px;overflow:hidden"><div style="height:100%;background:linear-gradient(90deg,#3b82f6,#2563eb);border-radius:3px;width:' + pct + '%;transition:width .3s"></div></div>' +
      '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">' + dots + '</div>' +
      '<div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:12px;padding:20px;margin-bottom:20px">' +
        '<p style="color:#0F0F0F;font-size:15px;margin:0;line-height:1.5;font-weight:500">' + _lsEsc(question.question) + '</p>' +
      '</div>' +
      '<div id="lsqOptions">' + optionsHtml + '</div>' +
      '<div id="lsqFeedback" style="display:none;margin-top:12px"></div>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
        '<button id="lsqConfirmBtn" onclick="lsConfirmVodQuizAnswer()" disabled style="flex:1;padding:12px;border-radius:10px;border:none;font-size:14px;font-weight:bold;cursor:pointer;background:#E7E5DE;color:#6B6B66">Confirmar Respuesta</button>' +
      '</div>' +
    '</div>';

  // Escape handler
  if (overlay._escHandler) document.removeEventListener('keydown', overlay._escHandler);
  overlay._escHandler = function(e) {
    if (e.key !== 'Escape') return;
    var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
      ? window.MaestroDialog.confirm({ title: 'Salir del quiz', message: '¿Salir del quiz? Tu progreso se perderá.', okText: 'Salir', cancelText: 'Continuar', destructive: true, kind: 'warning' })
      : Promise.resolve(confirm('¿Salir del quiz? Tu progreso se perderá.'));
    _ask.then(function(ok) {
      if (!ok) return;
      _lsCurrentVodQuiz = null;
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      document.removeEventListener('keydown', overlay._escHandler);
    });
  };
  document.addEventListener('keydown', overlay._escHandler);
}

/* ── Select quiz option ────────────────────────────────────── */
function lsSelectVodQuizOption(idx) {
  var q = _lsCurrentVodQuiz;
  if (!q || q.confirmed) return;

  q.selectedOption = idx;

  var options = document.querySelectorAll('.lsq-option');
  options.forEach(function(opt, i) {
    if (i === idx) {
      opt.style.borderColor = '#3b82f6';
      opt.style.background = '#EFF6FF';
      opt.querySelector('span').style.borderColor = '#3b82f6';
      opt.querySelector('span').style.color = '#3b82f6';
    } else {
      opt.style.borderColor = '#E7E5DE';
      opt.style.background = '#FFFFFF';
      opt.querySelector('span').style.borderColor = '#E7E5DE';
      opt.querySelector('span').style.color = '#6B6B66';
    }
  });

  var btn = document.getElementById('lsqConfirmBtn');
  if (btn) {
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
    btn.style.color = '#fff';
  }
}

/* ── Confirm answer ────────────────────────────────────────── */
function lsConfirmVodQuizAnswer() {
  var q = _lsCurrentVodQuiz;
  if (!q || q.confirmed || q.selectedOption < 0) return;
  q.confirmed = true;

  var question = q.questions[q.currentIndex];
  var isCorrect = q.selectedOption === question.correct;
  if (isCorrect) q.correctCount++;

  q.answers.push({
    questionIndex: q.currentIndex,
    selected: q.selectedOption,
    correct: isCorrect
  });

  // Show feedback on options
  var options = document.querySelectorAll('.lsq-option');
  options.forEach(function(opt, i) {
    opt.style.cursor = 'default';
    opt.onclick = null;
    if (i === question.correct) {
      opt.style.borderColor = '#059669';
      opt.style.background = '#D1FAE5';
    } else if (i === q.selectedOption && !isCorrect) {
      opt.style.borderColor = '#DC2626';
      opt.style.background = '#FEE2E2';
    }
  });

  // Show feedback message
  var fb = document.getElementById('lsqFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.innerHTML =
      '<div style="background:' + (isCorrect ? '#D1FAE5;border:1px solid #059669' : '#FEE2E2;border:1px solid #DC2626') + ';border-radius:10px;padding:12px 16px">' +
        '<div style="font-size:14px;font-weight:bold;color:' + (isCorrect ? '#065F46' : '#991B1B') + ';margin-bottom:4px">' +
          (isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto') +
        '</div>' +
        (question.explanation ? '<p style="color:#3D3D3A;font-size:13px;margin:0;line-height:1.4">' + _lsEsc(question.explanation) + '</p>' : '') +
      '</div>';
  }

  // Change confirm button to "Next"
  var btn = document.getElementById('lsqConfirmBtn');
  if (btn) {
    var isLast = q.currentIndex >= q.questions.length - 1;
    btn.textContent = isLast ? 'Ver Resultado' : 'Siguiente →';
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
    btn.style.color = '#fff';
    btn.onclick = function() {
      if (isLast) {
        lsFinishVodQuiz();
      } else {
        q.currentIndex++;
        q.selectedOption = -1;
        q.confirmed = false;
        _lsRenderVodQuizQuestion();
      }
    };
  }
}

/* ── Finish quiz — show results, save to Supabase ──────────── */
async function lsFinishVodQuiz() {
  var q = _lsCurrentVodQuiz;
  if (!q) return;

  var total = q.questions.length;
  var correct = q.correctCount;
  var percentage = Math.round((correct / total) * 100);
  var passingScore = 70;
  var passed = percentage >= passingScore;
  var timeTaken = Math.round((Date.now() - q.startTime) / 1000);

  // Get student info
  var stuEmail = '', stuName = '';
  try {
    var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
    stuEmail = (t.email || '').toLowerCase().trim();
    stuName = t.nombre || '';
  } catch(e) {}

  // Save attempt to database
  try {
    await supabaseClient.from('stream_recording_quiz_results').insert({
      recording_id: q.recordingId,
      student_email: stuEmail,
      student_name: stuName,
      total_questions: total,
      correct_answers: correct,
      percentage: percentage,
      passed: passed,
      answers: q.answers
    });
  } catch(e) { console.log('[LiveStreaming] Error saving quiz result:', e); }

  // Update local state
  if (passed) {
    _lsVodQuizPassed[q.recordingId] = true;
  }

  // Render result screen
  var overlay = document.getElementById('lsVodQuizOverlay');
  if (!overlay) return;

  var resultColor = passed ? '#059669' : '#DC2626';
  var resultBg = passed ? '#D1FAE5' : '#FEE2E2';
  var resultIcon = passed ? '🎉' : '😔';
  var resultTitle = passed ? '¡Felicidades, aprobaste!' : 'No aprobaste esta vez';

  // Score breakdown dots
  var scoreDots = '';
  q.answers.forEach(function(a, i) {
    scoreDots += '<div style="width:12px;height:12px;border-radius:50%;background:' + (a.correct ? '#059669' : '#DC2626') + '" title="Pregunta ' + (i + 1) + '"></div>';
  });

  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:16px;max-width:480px;width:100%;padding:32px;position:relative;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);text-align:center">' +
      '<div style="font-size:48px;margin-bottom:12px">' + resultIcon + '</div>' +
      '<h3 style="color:#0F0F0F;font-size:20px;margin:0 0 8px">' + resultTitle + '</h3>' +
      '<p style="color:#6B6B66;font-size:14px;font-weight:500;margin:0 0 20px">' + _lsEsc(q.title) + '</p>' +
      '<div style="background:' + resultBg + ';border:2px solid ' + resultColor + ';border-radius:16px;padding:20px;margin-bottom:20px">' +
        '<div style="font-size:42px;font-weight:bold;color:' + resultColor + '">' + percentage + '%</div>' +
        '<div style="color:#3D3D3A;font-size:13px;margin-top:4px">' + correct + ' de ' + total + ' correctas · Mínimo: ' + passingScore + '%</div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">' + scoreDots + '</div>' +
      '<div style="color:#6B6B66;font-size:12px;font-weight:500;margin-bottom:20px">Tiempo: ' + Math.floor(timeTaken / 60) + ':' + (timeTaken % 60 < 10 ? '0' : '') + (timeTaken % 60) + '</div>' +
      (passed
        ? '<div style="background:#D1FAE5;border:1px solid #059669;border-radius:10px;padding:12px;color:#065F46;font-size:14px;margin-bottom:8px">🏆 ¡Excelente trabajo!</div>'
        : '<button onclick="lsRetryVodQuiz()" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:8px">🔄 Reintentar Quiz</button>'
      ) +
      '<button onclick="_lsCloseVodQuizOverlay()" style="width:100%;padding:12px;border-radius:10px;border:1px solid #E7E5DE;background:transparent;color:#6B6B66;font-size:14px;font-weight:500;cursor:pointer">← Volver</button>' +
    '</div>';

  _lsCurrentVodQuiz = null;

  // Refresh the VOD list to update badges
  if (passed) {
    try { loadRecordings(); } catch(e) {}
  }
}

/* ── Close quiz overlay ────────────────────────────────────── */
function _lsCloseVodQuizOverlay() {
  var overlay = document.getElementById('lsVodQuizOverlay');
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
  _lsCurrentVodQuiz = null;
}

/* ── Retry quiz ────────────────────────────────────────────── */
function lsRetryVodQuiz() {
  if (_lsLastVodQuizRecId) {
    lsStartVodQuiz(_lsLastVodQuizRecId);
  }
}

/* ── Auto-start: check for live streams on page load ────────── */
/* This makes the EN VIVO FAB appear globally from any screen */
(function() {
  // Wait for supabaseClient to be ready, then subscribe
  var _lsAutoInitInterval = setInterval(function() {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      clearInterval(_lsAutoInitInterval);
      subscribeToLiveStreamStatus();
      lsRenderDashboardGroupBadge();
      lsUpdateDashboardLiveBanner();

      // Polling fallback: check every 30s in case Realtime fails silently
      setInterval(function() {
        if (typeof checkLiveStreamsFab === 'function') checkLiveStreamsFab();
        if (typeof lsUpdateDashboardLiveBanner === 'function') lsUpdateDashboardLiveBanner();
      }, 30000);
    }
  }, 500);
  // Safety: stop checking after 15s
  setTimeout(function() { clearInterval(_lsAutoInitInterval); }, 15000);
})();
