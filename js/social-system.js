// ============================================
// SOCIAL SYSTEM — Presence, Friends, Jobs, Dashboard
// Maestro HVACR — April 2026
// ============================================
(function() {
  'use strict';

  var SB = window.supabaseClient;
  var _channel = null;
  var _presenceUsers = {};
  var _friendsCache = null;
  var _friendsCacheTs = 0;
  var FRIENDS_TTL = 5 * 60 * 1000; // 5 min
  var JOBS_TTL = 2 * 60 * 1000; // 2 min
  var _lastPresenceUpsert = 0;
  var _jobsCache = null;
  var _jobsCacheTs = 0;
  var _jobsCacheKey = '';
  var _searchTimer = null;
  var _initialized = false;
  var _onboardShown = false;
  var _photoCache = {};       // email → photo_url
  var _photoCacheFetched = false;

  // ── Photo cache: batch-fetch from users table ──────────────
  function _fetchPhotos(emails, callback) {
    if (!SB || !emails || emails.length === 0) { if (callback) callback(); return; }
    // Filter out already cached
    var needed = emails.filter(function(e) { return e && !_photoCache.hasOwnProperty(e); });
    if (needed.length === 0) { if (callback) callback(); return; }
    usersDataSelf('public_user_lookup', { emails: needed }).then(function(res) {
      (res.data || []).forEach(function(u) {
        _photoCache[u.email] = u.photo_url || null;
      });
      // Mark missing ones as null so we don't re-fetch
      needed.forEach(function(e) { if (!_photoCache.hasOwnProperty(e)) _photoCache[e] = null; });
      if (callback) callback();
    }).catch(function() { if (callback) callback(); });
  }

  // ── Avatar helpers ──────────────────────────────────────────
  var AVATAR_COLORS = [
    '#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4',
    '#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899','#f43f5e'
  ];

  function avatarColor(email) {
    if (!email) return AVATAR_COLORS[0];
    var h = 0;
    for (var i = 0; i < email.length; i++) h = ((h << 5) - h) + email.charCodeAt(i);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }

  function avatarInitials(name) {
    if (!name) return '??';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function _renderAvatar(email, name, size) {
    size = size || 36;
    // Check photo cache (all users) + localStorage (own user)
    if (email) {
      var photo = _photoCache[email]
        || localStorage.getItem('maestroac_photo_' + email)
        || localStorage.getItem('maestroac_photo_default');
      // For localStorage fallback, only use maestroac_photo_default for own email
      if (!_photoCache[email] && photo === localStorage.getItem('maestroac_photo_default')) {
        var ownEmail = (localStorage.getItem('tecnico_email') || '').toLowerCase();
        if (email !== ownEmail) photo = null;
      }
      if (photo) {
        return '<img src="' + _esc(photo) + '" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid rgba(56,189,248,0.3);" />';
      }
    }
    var color = avatarColor(email);
    var initials = avatarInitials(name);
    var fs = Math.round(size * 0.4);
    return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color +
      ';display:inline-flex;align-items:center;justify-content:center;font-size:' + fs + 'px;font-weight:800;color:#fff;flex-shrink:0;">' +
      initials + '</div>';
  }

  // ── XSS protection ─────────────────────────────────────────
  function _esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ── Email helper ────────────────────────────────────────────
  function _email() {
    return (localStorage.getItem('tecnico_email') || '').toLowerCase();
  }
  function _name() {
    var n = localStorage.getItem('tecnico_nombre');
    if (n) return n;
    // Fallback: read from tecnico_user JSON (login may not have set tecnico_nombre yet)
    try { var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); if (u.nombre) { localStorage.setItem('tecnico_nombre', u.nombre); return u.nombre; } } catch(e) {}
    return 'Técnico';
  }

  // ── Presence ────────────────────────────────────────────────
  function init() {
    SB = window.supabaseClient;
    if (_initialized || !SB) return;
    _initialized = true;
    var email = _email();
    if (!email) return;

    // Single Realtime channel for all social features
    _channel = SB.channel('social-presence', { config: { presence: { key: email } } });

    _channel.on('presence', { event: 'sync' }, function() {
      var state = _channel.presenceState();
      _presenceUsers = {};
      Object.keys(state).forEach(function(key) {
        var entries = state[key];
        if (entries && entries.length > 0) {
          _presenceUsers[key] = entries[0];
        }
      });
      // Re-render dashboard widgets if visible (fetch new user photos first)
      var dash = document.getElementById('dashboardScreen');
      if (dash && dash.classList.contains('active')) {
        var newEmails = Object.keys(_presenceUsers).filter(function(e) { return !_photoCache.hasOwnProperty(e); });
        _fetchPhotos(newEmails, function() {
          _renderProfileCard('socialProfileCard');
          _renderEnVivoBar('socialEnVivoBar');
          _renderFriendsBanner('socialFriendsBanner');
        });
      }
    });

    _channel.subscribe(function(status) {
      if (status === 'SUBSCRIBED') {
        var _initLive = !!(window.StudyVoiceChat && window.StudyVoiceChat.isConnected && window.StudyVoiceChat.isConnected());
        _channel.track({ screen: 'dashboardScreen', module: 'dashboardScreen', module_label: null, is_live: _initLive, name: _name() });
      }
    });

    // Cleanup on tab close (pagehide more reliable on iOS Safari)
    window.addEventListener('beforeunload', function() { setOffline(); });
    window.addEventListener('pagehide', function() { setOffline(); });

    // Show onboarding for new users
    _checkOnboarding();
  }

  function updatePresence(screenId) {
    if (!_channel || !_email()) return;
    // EN VIVO = true if connected to voice chat (global room, like Discord)
    var isLive = !!(window.StudyVoiceChat && window.StudyVoiceChat.isConnected && window.StudyVoiceChat.isConnected());
    _channel.track({
      screen: screenId || 'dashboardScreen',
      module: screenId || 'dashboardScreen',
      module_label: null,
      is_live: isLive,
      name: _name()
    });
    // DB upsert max 1/60s
    var now = Date.now();
    if (now - _lastPresenceUpsert > 60000) {
      _lastPresenceUpsert = now;
      SB.from('user_presence').upsert({
        user_email: _email(),
        user_name: _name(),
        screen: screenId || 'dashboardScreen',
        module: screenId || 'dashboardScreen',
        module_label: null,
        is_live: isLive,
        last_seen: new Date().toISOString()
      }, { onConflict: 'user_email' }).then(function() {}).catch(function() {});
    }
  }

  function setLive(module, moduleLabel) {
    if (!_channel || !_email()) return;
    _channel.track({ screen: module, module: module, module_label: moduleLabel || module, is_live: true, name: _name() });
    SB.from('user_presence').upsert({
      user_email: _email(),
      user_name: _name(),
      screen: module,
      module: module,
      module_label: moduleLabel || module,
      is_live: true,
      last_seen: new Date().toISOString()
    }, { onConflict: 'user_email' }).then(function() {}).catch(function() {});
    _lastPresenceUpsert = Date.now();
    // Badge: first_en_vivo
    _checkSocialBadges({ first_en_vivo: true });
  }

  function setOffline() {
    if (_channel) {
      try { _channel.untrack(); } catch(e) {}
    }
    if (SB && _email()) {
      SB.from('user_presence').upsert({
        user_email: _email(),
        user_name: _name(),
        screen: null,
        module: null,
        is_live: false,
        last_seen: new Date().toISOString()
      }, { onConflict: 'user_email' }).then(function() {}).catch(function() {});
    }
  }

  function getLiveNow() {
    var live = [];
    Object.keys(_presenceUsers).forEach(function(key) {
      if (_presenceUsers[key] && _presenceUsers[key].is_live) {
        live.push({ email: key, name: _presenceUsers[key].name || key, module: _presenceUsers[key].module, module_label: _presenceUsers[key].module_label });
      }
    });
    return live;
  }

  function getModuleUsers(module) {
    var users = [];
    Object.keys(_presenceUsers).forEach(function(key) {
      if (_presenceUsers[key] && _presenceUsers[key].module === module) {
        users.push({ email: key, name: _presenceUsers[key].name || key });
      }
    });
    return users;
  }

  function getOnlineCount() {
    return Object.keys(_presenceUsers).length;
  }

  // ── Friends ─────────────────────────────────────────────────
  function sendFriendRequest(receiverEmail) {
    if (!SB || !_email()) return Promise.resolve(null);
    return SB.from('friendships').insert({
      requester_email: _email(),
      receiver_email: receiverEmail.toLowerCase(),
      status: 'pending'
    }).then(function(res) {
      _friendsCache = null;
      return res;
    });
  }

  function acceptFriend(id) {
    if (!SB) return Promise.resolve(null);
    return SB.from('friendships').update({ status: 'accepted' }).eq('id', id).then(function(res) {
      _friendsCache = null;
      // Check social badges after accepting a friend
      _checkSocialBadges();
      return res;
    });
  }

  function rejectFriend(id) {
    if (!SB) return Promise.resolve(null);
    return SB.from('friendships').update({ status: 'rejected' }).eq('id', id).then(function(res) {
      _friendsCache = null;
      return res;
    });
  }

  function getFriends() {
    if (!SB || !_email()) return Promise.resolve([]);
    if (_friendsCache && Date.now() - _friendsCacheTs < FRIENDS_TTL) return Promise.resolve(_friendsCache);
    var email = _email();
    return SB.from('friendships')
      .select('*')
      .or('requester_email.eq.' + email + ',receiver_email.eq.' + email)
      .eq('status', 'accepted')
      .limit(200)
      .then(function(res) {
        var friends = (res.data || []).map(function(f) {
          return f.requester_email === email ? f.receiver_email : f.requester_email;
        });
        _friendsCache = friends;
        _friendsCacheTs = Date.now();
        return friends;
      });
  }

  function getPendingRequests() {
    if (!SB || !_email()) return Promise.resolve([]);
    return SB.from('friendships')
      .select('*')
      .eq('receiver_email', _email())
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(function(res) { return res.data || []; });
  }

  function getFriendsOnline() {
    return getFriends().then(function(friends) {
      return friends.filter(function(email) { return !!_presenceUsers[email]; }).map(function(email) {
        var p = _presenceUsers[email];
        return { email: email, name: p.name || email, screen: p.screen, is_live: p.is_live, module_label: p.module_label };
      });
    });
  }

  function searchTechnician(query) {
    if (!SB || !query || query.length < 2) return Promise.resolve([]);
    // Sanitize query to prevent PostgREST filter injection
    var safeQ = query.replace(/[%_\\,().']/g, '');
    if (!safeQ || safeQ.length < 2) return Promise.resolve([]);
    return usersDataSelf('public_user_search', { query: safeQ }).then(function(res) { return res.data || []; });
  }

  // ── Jobs API ────────────────────────────────────────────────
  function postJob(data) {
    if (!SB || !_email()) return Promise.resolve(null);
    data.poster_email = _email();
    _jobsCache = null; // Invalidate cache
    return SB.from('job_listings').insert(data).select().single().then(function(res) {
      _checkSocialBadges({ job_posted: true });
      return res.data;
    });
  }

  function getJobs(type, page) {
    if (!SB) return Promise.resolve([]);
    page = page || 0;
    var cacheKey = (type || 'all') + ':' + page;
    if (_jobsCache && _jobsCacheKey === cacheKey && Date.now() - _jobsCacheTs < JOBS_TTL) return Promise.resolve(_jobsCache);
    var q = SB.from('job_listings').select('*').eq('active', true).order('created_at', { ascending: false }).range(page * 20, (page + 1) * 20 - 1);
    if (type) q = q.eq('type', type);
    return q.then(function(res) {
      _jobsCache = res.data || [];
      _jobsCacheTs = Date.now();
      _jobsCacheKey = cacheKey;
      return _jobsCache;
    });
  }

  function getMyListings() {
    if (!SB || !_email()) return Promise.resolve([]);
    return SB.from('job_listings').select('*').eq('poster_email', _email()).order('created_at', { ascending: false }).then(function(res) { return res.data || []; });
  }

  function deactivateListing(id) {
    if (!SB) return Promise.resolve(null);
    return SB.from('job_listings').update({ active: false }).eq('id', id);
  }

  // ── Social badge helper ──────────────────────────────────────
  function _checkSocialBadges(extra) {
    if (!window.Gamification || typeof window.Gamification.checkSocialBadges !== 'function') return;
    // Build badge data from current state + extra triggers
    var data = extra || {};
    getFriends().then(function(friends) {
      data.friends = friends.length;
      // Count help events
      if (SB && _email()) {
        SB.from('help_events').select('id', { count: 'exact', head: true }).eq('helper_email', _email()).then(function(res) {
          data.helpers = (res.count || 0);
          window.Gamification.checkSocialBadges(data);
        }).catch(function() { window.Gamification.checkSocialBadges(data); });
      } else {
        window.Gamification.checkSocialBadges(data);
      }
    }).catch(function() { window.Gamification.checkSocialBadges(data); });
  }

  // ── Dashboard Rendering ─────────────────────────────────────

  function _renderEnVivoBar(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var live = getLiveNow();
    var total = getOnlineCount();
    if (total === 0) { el.innerHTML = ''; el.style.display = 'none'; return; }

    el.style.display = 'block';
    var maxAvatars = 6;
    var shown = live.slice(0, maxAvatars);
    var extra = live.length - maxAvatars;

    var avatarsHtml = '';
    shown.forEach(function(u) {
      avatarsHtml += '<div style="margin-left:-8px;border:2px solid #064e3b;border-radius:50%;" title="' + _esc(u.name) + '">' + _renderAvatar(u.email, u.name, 32) + '</div>';
    });
    if (extra > 0) {
      avatarsHtml += '<div style="margin-left:-8px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.15);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#a7f3d0;border:2px solid #064e3b;">+' + extra + '</div>';
    }

    // Show all online (not just live)
    var allAvatarsHtml = '';
    var allUsers = Object.keys(_presenceUsers).slice(0, maxAvatars);
    allUsers.forEach(function(key) {
      var u = _presenceUsers[key];
      allAvatarsHtml += '<div style="margin-left:-8px;border:2px solid #064e3b;border-radius:50%;" title="' + _esc(u.name || key) + '">' + _renderAvatar(key, u.name, 32) + '</div>';
    });
    var allExtra = Object.keys(_presenceUsers).length - maxAvatars;
    if (allExtra > 0) {
      allAvatarsHtml += '<div style="margin-left:-8px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.15);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#a7f3d0;border:2px solid #064e3b;">+' + allExtra + '</div>';
    }

    var liveLabel = live.length > 0
      ? '<span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:liveDot 1s ease-in-out infinite;"></span> ' + live.length + ' estudiando</span>'
      : '';

    el.innerHTML = '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:linear-gradient(135deg,rgba(6,78,59,0.4),rgba(4,47,46,0.3));border:1px solid rgba(52,211,153,0.25);border-radius:14px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;" onclick="showScreen(\'friendsScreen\')">' +
      '<div style="font-size:20px;">🟢</div>' +
      '<div style="flex:1;">' +
        '<div style="font-size:14px;font-weight:800;color:#a7f3d0;">EN VIVO AHORA — ' + total + ' técnico' + (total !== 1 ? 's' : '') + '</div>' +
        '<div style="font-size:11px;color:rgba(167,243,208,0.7);margin-top:2px;">' + liveLabel + '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;margin-left:auto;">' + (live.length > 0 ? avatarsHtml : allAvatarsHtml) + '</div>' +
    '</div>';
  }

  function _renderProfileCard(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var email = _email();
    if (!email) { el.style.display = 'none'; return; }

    var name = _name();
    var firstName = name.split(' ')[0];
    var isLive = _presenceUsers[email] && _presenceUsers[email].is_live;

    // Avatar: photo (from cache, localStorage, or DB) or initials
    var photo = _photoCache[email] || localStorage.getItem('maestroac_photo_' + email) || localStorage.getItem('maestroac_photo_default');
    var avatarHtml;
    if (photo) {
      avatarHtml = '<img src="' + photo + '" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />';
    } else {
      var color = avatarColor(email);
      var initials = avatarInitials(name);
      avatarHtml = '<div style="width:48px;height:48px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;color:#fff;">' + initials + '</div>';
    }

    // Border: green pulsing if EN VIVO, white if offline
    var borderStyle = isLive
      ? 'border:2.5px solid #22c55e;box-shadow:0 0 10px rgba(34,197,94,0.4);animation:liveDot 1.5s ease-in-out infinite;'
      : 'border:2px solid rgba(255,255,255,0.3);';

    el.innerHTML =
      '<div style="width:48px;height:48px;border-radius:50%;' + borderStyle + 'overflow:hidden;">' + avatarHtml + '</div>' +
      '<div style="font-size:11px;color:rgba(200,220,255,0.7);font-weight:600;margin-top:3px;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _esc(firstName) + '</div>';
    el.style.display = 'block';
  }

  function _renderFriendsBanner(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    getFriendsOnline().then(function(online) {
      if (online.length === 0) { el.innerHTML = ''; el.style.display = 'none'; return; }
      el.style.display = 'block';
      var html = '<div style="padding:10px 16px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.1));border:1px solid rgba(99,102,241,0.2);border-radius:12px;margin:6px 0;">';
      html += '<div style="font-size:12px;font-weight:700;color:#93c5fd;margin-bottom:8px;">Amigos conectados (' + online.length + ')</div>';
      html += '<div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;">';
      online.slice(0, 8).forEach(function(f) {
        var liveTag = f.is_live ? '<div style="font-size:8px;color:#4ade80;font-weight:700;text-align:center;">EN VIVO</div>' : '';
        html += '<div style="display:flex;flex-direction:column;align-items:center;min-width:56px;cursor:pointer;" onclick="window.viewProfile(\'' + _esc(f.email) + '\')">' +
          _renderAvatar(f.email, f.name, 36) +
          '<div style="font-size:10px;color:#cbd5e1;margin-top:3px;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _esc((f.name || '').split(' ')[0]) + '</div>' +
          liveTag +
        '</div>';
      });
      html += '</div></div>';
      el.innerHTML = html;
    });
  }

  function _renderJobBoardBanner(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '<div onclick="showScreen(\'jobBoardScreen\')" style="cursor:pointer;position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#0ea5e9 100%);border:1px solid rgba(255,255,255,0.25);box-shadow:0 8px 32px rgba(30,64,175,0.45),inset 0 1px 0 rgba(255,255,255,0.3);padding:18px 20px;margin:8px 0;-webkit-tap-highlight-color:transparent;">' +
      '<div style="position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);animation:jbGlare 3s ease-in-out infinite;pointer-events:none;"></div>' +
      '<style>@keyframes jbGlare{0%{left:-75%}50%{left:125%}100%{left:125%}}</style>' +
      '<div style="position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%);pointer-events:none;"></div>' +
      '<div style="display:flex;align-items:center;gap:14px;">' +
        '<div style="width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.15);overflow:hidden;padding:0;">' +
          '<img src="bolsa-trabajo-icon.png?v=3" alt="Bolsa de Trabajo" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" loading="lazy" />' +
        '</div>' +
        '<div style="flex:1;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">' +
            '<span style="color:#fff;font-size:16px;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,0.2);">Bolsa de Trabajo HVACR</span>' +
            '<span style="background:rgba(255,255,255,0.2);color:#fff;font-size:8px;font-weight:900;padding:2px 8px;border-radius:12px;letter-spacing:0.8px;border:1px solid rgba(255,255,255,0.15);">HVAC JOBS</span>' +
          '</div>' +
          '<div style="color:rgba(255,255,255,0.85);font-size:11px;font-weight:500;line-height:1.4;">Busca trabajo o contrata técnicos HVACR</div>' +
        '</div>' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</div>' +
    '</div>';
  }

  // ── Friends Screen ──────────────────────────────────────────
  function initFriendsScreen() {
    var screen = document.getElementById('friendsScreen');
    if (!screen) return;
    if (screen.querySelector('.social-friends-loaded')) return;

    var html = '<div class="sticky-nav-bar sticky-nav-bar--light">' +
      '<button class="btn-nav-back" data-nav="dashboardScreen">← Volver</button>' +
      '<span class="nav-bar-title">Comunidad</span>' +
    '</div>';
    html += '<div style="padding:16px;">';
    // Tabs
    html += '<div id="friendsTabs" style="display:flex;gap:4px;margin-bottom:16px;">';
    html += '<button class="social-tab active" data-tab="friends" style="flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(56,189,248,0.2);color:#7dd3fc;">Amigos</button>';
    html += '<button class="social-tab" data-tab="requests" style="flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.05);color:rgba(148,163,184,0.7);">Solicitudes</button>';
    html += '<button class="social-tab" data-tab="search" style="flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:rgba(255,255,255,0.05);color:rgba(148,163,184,0.7);">Buscar</button>';
    html += '</div>';
    html += '<div id="friendsTabContent"></div>';
    html += '</div>';
    html += '<div class="social-friends-loaded" style="display:none;"></div>';

    screen.innerHTML = html;

    // Tab click handlers
    screen.querySelectorAll('.social-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        screen.querySelectorAll('.social-tab').forEach(function(b) {
          b.style.background = 'rgba(255,255,255,0.05)';
          b.style.color = 'rgba(148,163,184,0.7)';
          b.classList.remove('active');
        });
        btn.style.background = 'rgba(56,189,248,0.2)';
        btn.style.color = '#7dd3fc';
        btn.classList.add('active');
        _renderFriendsTab(btn.dataset.tab);
      });
    });

    _renderFriendsTab('friends');
  }

  function _renderFriendsTab(tab) {
    var container = document.getElementById('friendsTabContent');
    if (!container) return;

    if (tab === 'friends') {
      container.innerHTML = '<div style="text-align:center;color:rgba(148,163,184,0.5);padding:20px;">Cargando...</div>';
      getFriends().then(function(friends) {
        if (friends.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:40px;margin-bottom:12px;">🤝</div><div style="color:rgba(148,163,184,0.6);font-size:14px;">Aún no tienes amigos.<br>Busca técnicos en la pestaña "Buscar".</div></div>';
          return;
        }
        // Fetch names for friends
        usersDataSelf('public_user_lookup', { emails: friends }).then(function(res) {
          var nameMap = {};
          (res.data || []).forEach(function(u) { nameMap[u.email] = u.nombre; });
          var html = '';
          friends.forEach(function(email) {
            var name = nameMap[email] || email;
            var online = !!_presenceUsers[email];
            var isLive = _presenceUsers[email] && _presenceUsers[email].is_live;
            var statusDot = online ? '<span style="width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;display:inline-block;"></span>' : '<span style="width:8px;height:8px;border-radius:50%;background:rgba(148,163,184,0.3);display:inline-block;"></span>';
            var liveTag = isLive ? ' <span style="font-size:9px;color:#4ade80;font-weight:700;">EN VIVO</span>' : '';
            html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(15,23,42,0.5);border:1px solid rgba(148,163,184,0.1);border-radius:12px;margin-bottom:8px;cursor:pointer;" onclick="window.viewProfile(\'' + _esc(email) + '\')">' +
              _renderAvatar(email, name, 40) +
              '<div style="flex:1;min-width:0;">' +
                '<div style="font-size:14px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _esc(name) + '</div>' +
                '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;font-size:11px;color:rgba(148,163,184,0.6);">' + statusDot + (online ? ' Conectado' : ' Desconectado') + liveTag + '</div>' +
              '</div>' +
            '</div>';
          });
          container.innerHTML = html;
        });
      });
    } else if (tab === 'requests') {
      container.innerHTML = '<div style="text-align:center;color:rgba(148,163,184,0.5);padding:20px;">Cargando...</div>';
      getPendingRequests().then(function(requests) {
        if (requests.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:40px;margin-bottom:12px;">📬</div><div style="color:rgba(148,163,184,0.6);font-size:14px;">No hay solicitudes pendientes.</div></div>';
          return;
        }
        // Get names
        var emails = requests.map(function(r) { return r.requester_email; });
        usersDataSelf('public_user_lookup', { emails: emails }).then(function(res) {
          var nameMap = {};
          (res.data || []).forEach(function(u) { nameMap[u.email] = u.nombre; });
          var html = '';
          requests.forEach(function(r) {
            var name = nameMap[r.requester_email] || r.requester_email;
            html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(15,23,42,0.5);border:1px solid rgba(148,163,184,0.1);border-radius:12px;margin-bottom:8px;">' +
              _renderAvatar(r.requester_email, name, 40) +
              '<div style="flex:1;min-width:0;">' +
                '<div style="font-size:14px;font-weight:700;color:#e2e8f0;">' + _esc(name) + '</div>' +
                '<div style="font-size:11px;color:rgba(148,163,184,0.5);">Quiere ser tu amigo</div>' +
              '</div>' +
              '<button onclick="event.stopPropagation();SocialSystem.acceptFriend(\'' + _esc(r.id) + '\').then(function(){SocialSystem.initFriendsScreen();document.querySelector(\'[data-tab=requests]\').click();})" style="padding:6px 12px;border:none;border-radius:8px;background:#22c55e;color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Aceptar</button>' +
              '<button onclick="event.stopPropagation();SocialSystem.rejectFriend(\'' + _esc(r.id) + '\').then(function(){document.querySelector(\'[data-tab=requests]\').click();})" style="padding:6px 12px;border:none;border-radius:8px;background:rgba(239,68,68,0.3);color:#fca5a5;font-size:11px;font-weight:700;cursor:pointer;">Rechazar</button>' +
            '</div>';
          });
          container.innerHTML = html;
        });
      });
    } else if (tab === 'search') {
      container.innerHTML = '<div style="margin-bottom:16px;">' +
        '<input id="socialSearchInput" type="text" placeholder="Buscar por nombre o email..." style="width:100%;padding:10px 14px;border:1px solid rgba(148,163,184,0.2);border-radius:10px;background:rgba(15,23,42,0.6);color:#e2e8f0;font-size:14px;outline:none;box-sizing:border-box;" />' +
      '</div>' +
      '<div id="socialSearchResults" style="color:rgba(148,163,184,0.5);font-size:13px;text-align:center;padding:20px;">Escribe para buscar técnicos...</div>';
      // Debounced search
      var input = document.getElementById('socialSearchInput');
      if (input) {
        input.addEventListener('input', function() {
          clearTimeout(_searchTimer);
          var query = input.value.trim();
          if (query.length < 2) {
            document.getElementById('socialSearchResults').innerHTML = '<div style="text-align:center;padding:20px;color:rgba(148,163,184,0.5);">Escribe al menos 2 caracteres...</div>';
            return;
          }
          _searchTimer = setTimeout(function() {
            document.getElementById('socialSearchResults').innerHTML = '<div style="text-align:center;padding:20px;color:rgba(148,163,184,0.5);">Buscando...</div>';
            searchTechnician(query).then(function(results) {
              var resultsEl = document.getElementById('socialSearchResults');
              if (!resultsEl) return;
              if (results.length === 0) {
                resultsEl.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(148,163,184,0.5);">No se encontraron técnicos.</div>';
                return;
              }
              var html = '';
              results.forEach(function(u) {
                if (u.email === _email()) return; // skip self
                html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(15,23,42,0.5);border:1px solid rgba(148,163,184,0.1);border-radius:12px;margin-bottom:8px;">' +
                  _renderAvatar(u.email, u.nombre, 40) +
                  '<div style="flex:1;min-width:0;">' +
                    '<div style="font-size:14px;font-weight:700;color:#e2e8f0;">' + _esc(u.nombre || u.email) + '</div>' +
                    '<div style="font-size:11px;color:rgba(148,163,184,0.5);">' + _esc(u.email) + '</div>' +
                  '</div>' +
                  '<button onclick="event.stopPropagation();SocialSystem.sendFriendRequest(\'' + _esc(u.email) + '\').then(function(){this.textContent=\'Enviada\';this.disabled=true;}.bind(this))" style="padding:6px 12px;border:none;border-radius:8px;background:rgba(56,189,248,0.2);color:#7dd3fc;font-size:11px;font-weight:700;cursor:pointer;">Agregar</button>' +
                '</div>';
              });
              resultsEl.innerHTML = html;
            });
          }, 400);
        });
        setTimeout(function() { input.focus(); }, 100);
      }
    }
  }

  // ── Onboarding ──────────────────────────────────────────────
  function _checkOnboarding() {
    if (_onboardShown) return;
    if (localStorage.getItem('maestroac_onboarded')) return;
    _onboardShown = true;
    // Wait for presence to populate
    setTimeout(function() {
      var count = getOnlineCount();
      var overlay = document.createElement('div');
      overlay.id = 'socialOnboarding';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
      overlay.innerHTML = '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(56,189,248,0.3);border-radius:20px;padding:32px 24px;text-align:center;max-width:360px;width:100%;">' +
        '<div style="font-size:48px;margin-bottom:16px;">👋</div>' +
        '<div style="font-size:20px;font-weight:900;color:#e2e8f0;margin-bottom:8px;">Bienvenido a la Comunidad</div>' +
        '<div style="font-size:14px;color:rgba(148,163,184,0.8);margin-bottom:4px;">Maestro HVACR</div>' +
        (count > 0 ? '<div style="font-size:13px;color:#4ade80;margin:12px 0;">🟢 ' + count + ' técnico' + (count !== 1 ? 's' : '') + ' conectado' + (count !== 1 ? 's' : '') + ' ahora</div>' : '') +
        '<div style="font-size:12px;color:rgba(148,163,184,0.6);margin:12px 0;">Estudia con amigos, ayuda a otros técnicos, encuentra trabajo y gana XP.</div>' +
        '<button onclick="localStorage.setItem(\'maestroac_onboarded\',\'1\');this.closest(\'#socialOnboarding\').remove();" style="margin-top:16px;padding:12px 32px;border:none;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">Empezar</button>' +
      '</div>';
      document.body.appendChild(overlay);
    }, 2000);
  }

  // ── Cleanup ─────────────────────────────────────────────────
  function cleanup() {
    setOffline();
    if (_channel) {
      try { SB.removeChannel(_channel); } catch(e) {}
      _channel = null;
    }
    _initialized = false;
    _presenceUsers = {};
    _friendsCache = null;
  }

  // ── Render all dashboard widgets ────────────────────────────
  function renderDashboard() {
    // Collect all emails that need photos (own + online users)
    var emails = [];
    var ownEmail = _email();
    if (ownEmail) emails.push(ownEmail);
    Object.keys(_presenceUsers).forEach(function(e) { if (emails.indexOf(e) === -1) emails.push(e); });

    // Fetch photos first, then render everything
    _fetchPhotos(emails, function() {
      _renderProfileCard('socialProfileCard');
      _renderEnVivoBar('socialEnVivoBar');
      _renderFriendsBanner('socialFriendsBanner');
      _renderJobBoardBanner('socialJobBoardBanner');
    });
  }

  // ── Expose globally ─────────────────────────────────────────
  window.SocialSystem = {
    init: init,
    updatePresence: updatePresence,
    setLive: setLive,
    setOffline: setOffline,
    getLiveNow: getLiveNow,
    getModuleUsers: getModuleUsers,
    getOnlineCount: getOnlineCount,
    avatarColor: avatarColor,
    avatarInitials: avatarInitials,
    renderAvatar: _renderAvatar,
    fetchPhotos: _fetchPhotos,
    sendFriendRequest: sendFriendRequest,
    acceptFriend: acceptFriend,
    rejectFriend: rejectFriend,
    getFriends: getFriends,
    getFriendsOnline: getFriendsOnline,
    getPendingRequests: getPendingRequests,
    searchTechnician: searchTechnician,
    postJob: postJob,
    getJobs: getJobs,
    getMyListings: getMyListings,
    deactivateListing: deactivateListing,
    initFriendsScreen: initFriendsScreen,
    renderDashboard: renderDashboard,
    cleanup: cleanup
  };

})();
