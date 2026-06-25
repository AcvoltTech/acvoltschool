// ============================================================
// DeviceGuard — Anti-sharing: country check + 2-device limit
// IIFE — fail-open (if Edge Function fails, student can still use app)
// ============================================================
var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
var DeviceGuard = (function() {
  'use strict';

  var SB_URL = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
  var ENDPOINT = SB_URL + '/functions/v1/device-guard';
  var DEVICE_ID_KEY = 'maestroac_device_id';
  var _checking = false;

  // ── Generate stable device fingerprint ──
  function _generateFingerprint() {
    var parts = [];
    try { parts.push(navigator.userAgent || ''); } catch(e) {}
    try { parts.push(screen.width + 'x' + screen.height + 'x' + screen.colorDepth); } catch(e) {}
    try { parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch(e) {}
    try { parts.push(navigator.language || ''); } catch(e) {}
    try { parts.push(navigator.hardwareConcurrency || ''); } catch(e) {}
    // Canvas fingerprint (lightweight)
    try {
      var c = document.createElement('canvas');
      c.width = 200; c.height = 50;
      var ctx = c.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 200, 50);
        ctx.fillStyle = '#069';
        ctx.fillText('MaestroAC:dg', 2, 15);
        parts.push(c.toDataURL().slice(-50));
      }
    } catch(e) {}

    // Add a random salt (persisted) so clearing canvas alone doesn't reset fingerprint
    var salt = localStorage.getItem(DEVICE_ID_KEY + '_salt');
    if (!salt) {
      salt = Math.random().toString(36).substring(2) + Date.now().toString(36);
      try { localStorage.setItem(DEVICE_ID_KEY + '_salt', salt); } catch(e) {}
    }
    parts.push(salt);

    // Simple hash
    var str = parts.join('|');
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'dg_' + Math.abs(hash).toString(36) + '_' + salt.substring(0, 8);
  }

  function getDeviceId() {
    var stored = localStorage.getItem(DEVICE_ID_KEY);
    if (stored) return stored;
    var id = _generateFingerprint();
    try { localStorage.setItem(DEVICE_ID_KEY, id); } catch(e) {}
    return id;
  }

  function _getDeviceName() {
    var ua = navigator.userAgent || '';
    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua)) return 'iPad';
    if (/Android/i.test(ua)) return 'Android';
    if (/Mac/i.test(ua)) return 'Mac';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown';
  }

  function _call(payload) {
    var headers = { 'Content-Type': 'application/json' };
    // Add auth token for CSRF protection + apikey for Supabase routing
    var sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '');
    if (sbKey) { headers['apikey'] = sbKey; headers['Authorization'] = 'Bearer ' + sbKey; }
    // Try to get user JWT for stronger auth
    try {
      if (window.supabaseClient && window.supabaseClient.auth) {
        return window.supabaseClient.auth.getSession().then(function(sess) {
          if (sess && sess.data && sess.data.session && sess.data.session.access_token) {
            headers['Authorization'] = 'Bearer ' + sess.data.session.access_token;
          }
          return fetch(ENDPOINT, { method: 'POST', headers: headers, body: JSON.stringify(payload) }).then(function(res) { return res.json(); });
        }).catch(function() {
          return fetch(ENDPOINT, { method: 'POST', headers: headers, body: JSON.stringify(payload) }).then(function(res) { return res.json(); });
        });
      }
    } catch(e) {}
    return fetch(ENDPOINT, { method: 'POST', headers: headers, body: JSON.stringify(payload) }).then(function(res) { return res.json(); });
  }

  // ── Country block modal ──
  function _showBlockModal(countryName) {
    // Remove existing if any
    var existing = document.getElementById('deviceGuardBlockModal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'deviceGuardBlockModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML =
      '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;border:1px solid rgba(231,76,60,0.4);box-shadow:0 0 40px rgba(231,76,60,0.2);">' +
        '<div style="font-size:48px;margin-bottom:16px;">🚫</div>' +
        '<h2 style="color:#e74c3c;margin:0 0 12px;font-size:20px;">' + _tc('dg_access_blocked', 'Acceso Bloqueado') + '</h2>' +
        '<p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 8px;">' + _tc('dg_login_detected_from', 'Se detectó un inicio de sesión desde') + ' <strong style="color:#f39c12;">' + (countryName || _tc('dg_another_country', 'otro país')) + '</strong>.</p>' +
        '<p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0 0 20px;">' + _tc('dg_account_registered_elsewhere', 'Tu cuenta está registrada en otro país. Si crees que esto es un error, contacta al instructor.') + '</p>' +
        '<p style="color:#e74c3c;font-size:13px;margin:0 0 16px;" id="dgBlockCountdown">' + _tc('device_closing_session', 'Cerrando sesión en') + ' 5s...</p>' +
        '<button onclick="if(typeof cerrarSesion===\'function\')cerrarSesion()" style="width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#e74c3c,#c0392b);color:white;font-weight:bold;font-size:15px;cursor:pointer;">' + _tc('dg_close_session_now', 'Cerrar Sesión Ahora') + '</button>' +
      '</div>';
    document.body.appendChild(modal);

    // Countdown
    var secs = 5;
    var interval = setInterval(function() {
      secs--;
      var el = document.getElementById('dgBlockCountdown');
      if (el) el.textContent = _tc('device_closing_session', 'Cerrando sesión en') + ' ' + secs + 's...';
      if (secs <= 0) {
        clearInterval(interval);
        if (typeof cerrarSesion === 'function') cerrarSesion();
      }
    }, 1000);
  }

  // ── Device kicked modal ──
  function _showKickedModal(reason) {
    var existing = document.getElementById('deviceGuardKickedModal');
    if (existing) existing.remove();

    var msg = reason === 'device_limit_exceeded'
      ? _tc('dg_device_limit_exceeded', 'Se inició sesión en otro dispositivo y se superó el límite de 2 dispositivos.')
      : reason === 'admin_kick'
        ? _tc('dg_admin_kick', 'El administrador cerró la sesión en este dispositivo.')
        : _tc('dg_session_closed', 'Tu sesión fue cerrada en este dispositivo.');

    var modal = document.createElement('div');
    modal.id = 'deviceGuardKickedModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML =
      '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;max-width:400px;width:100%;text-align:center;border:1px solid rgba(243,156,18,0.4);box-shadow:0 0 40px rgba(243,156,18,0.2);">' +
        '<div style="font-size:48px;margin-bottom:16px;">📱</div>' +
        '<h2 style="color:#f39c12;margin:0 0 12px;font-size:20px;">' + _tc('dg_session_closed_title', 'Sesión Cerrada') + '</h2>' +
        '<p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 20px;">' + msg + '</p>' +
        '<button onclick="if(typeof cerrarSesion===\'function\')cerrarSesion();else{var m=document.getElementById(\'deviceGuardKickedModal\');if(m)m.remove();}" style="width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#f39c12,#e67e22);color:white;font-weight:bold;font-size:15px;cursor:pointer;">' + _tc('dg_accept', 'Aceptar') + '</button>' +
      '</div>';
    document.body.appendChild(modal);
  }

  // ── Public API ──
  return {
    getDeviceId: getDeviceId,

    /**
     * Called post-login and on session recovery.
     * Registers device, checks country, enforces limit.
     */
    onLogin: function(email) {
      if (!email) return;
      // Admins EXENTOS del límite de dispositivos (Mario 6-25: "no puedo estar bloqueado como admin").
      if (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) return;
      try {
        _call({
          action: 'register_device',
          user_email: email.toLowerCase().trim(),
          device_id: getDeviceId(),
          device_name: _getDeviceName(),
          user_agent: (navigator.userAgent || '').substring(0, 200),
        }).then(function(res) {
          if (!res) return;
          if (res.blocked && res.reason === 'country_mismatch') {
            // Skip country block inside iOS WKWebView (App Store reviewers are in another country)
            if (window.webkit && window.webkit.messageHandlers) {
              console.warn('[DeviceGuard] Country mismatch inside iOS app — skipping block:', res.current_country_name);
              return;
            }
            console.warn('[DeviceGuard] Country mismatch — blocking:', res.current_country_name);
            _showBlockModal(res.current_country_name);
            return;
          }
          if (res.kicked && res.kicked.length > 0) {
            console.log('[DeviceGuard] Kicked older devices:', res.kicked);
          }
          console.log('[DeviceGuard] Device registered. Country:', res.country_code || 'unknown');
        }).catch(function(e) {
          console.warn('[DeviceGuard] register_device failed (fail-open):', e.message || e);
        });
      } catch(e) {
        console.warn('[DeviceGuard] onLogin error (fail-open):', e.message || e);
      }
    },

    /**
     * Called on visibilitychange (tab focus).
     * Checks if this device was deactivated while away.
     */
    checkDevice: function(email) {
      if (!email || _checking) return;
      // Admins EXENTOS: nunca se les muestra "Sesión Cerrada" ni se les patea (Mario 6-25).
      if (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) return;
      _checking = true;
      try {
        _call({
          action: 'check_device',
          user_email: email.toLowerCase().trim(),
          device_id: getDeviceId(),
        }).then(function(res) {
          _checking = false;
          if (!res) return;
          if (res.active === false && res.reason && res.reason !== 'not_found') {
            console.warn('[DeviceGuard] Device deactivated:', res.reason);
            _showKickedModal(res.reason);
          }
        }).catch(function(e) {
          _checking = false;
          console.warn('[DeviceGuard] check_device failed (fail-open):', e.message || e);
        });
      } catch(e) {
        _checking = false;
        console.warn('[DeviceGuard] checkDevice error (fail-open):', e.message || e);
      }
    },

    /**
     * Called on logout. Fire-and-forget.
     */
    onLogout: function(email) {
      if (!email) return;
      try {
        _call({
          action: 'deactivate_device',
          user_email: email.toLowerCase().trim(),
          device_id: getDeviceId(),
        }).catch(function() {});
      } catch(e) {}
    }
  };
})();
