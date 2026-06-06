/**
 * Onboarding Gate v3.0
 * Only requires profile completion (nombre, email, teléfono, ciudad, estado)
 * Location and notifications are optional — prompted contextually when needed
 * v3.0: Removed mandatory location/notification steps from gate
 */
(function() {
  'use strict';

  var GATE_FIELDS = ['nombre', 'email', 'telefono', 'ciudad', 'estado'];
  var MODAL_ID = 'onboardingGateModal';

  // HTML-escape user values to prevent broken HTML from special chars (quotes, <, >)
  function _esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ============================
  // CHECK IF GATE IS NEEDED
  // ============================
  function _getUser() {
    try { return JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) { return {}; }
  }

  // Gate bypass — now DB-backed only via admin_staff table
  var GATE_BYPASS_EMAILS = ['floresmario30@gmail.com'];

  function _isAdmin() {
    var email = (localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
    if (GATE_BYPASS_EMAILS.indexOf(email) !== -1) return true;
    // Also check DB-backed admin status (cached sync check)
    if (typeof isAdminStudent === 'function' && isAdminStudent()) return true;
    return false;
  }

  function _profileComplete() {
    var u = _getUser();
    for (var i = 0; i < GATE_FIELDS.length; i++) {
      var val = u[GATE_FIELDS[i]];
      if (!val || String(val).trim() === '' || val === '-') return false;
    }
    return true;
  }

  function _locationGranted() {
    if (localStorage.getItem('maestro_location_granted') === 'true') return true;
    try {
      var cached = localStorage.getItem('maestro_weather');
      if (cached) {
        var data = JSON.parse(cached);
        if (data.lat && data.lon) return true;
      }
    } catch(e) {}
    return false;
  }

  function _notificationsGranted() {
    if (!('Notification' in window)) return true; // no support = skip
    // Device doesn't support push (old iPads, iOS Safari not in PWA mode, old Android)
    if (typeof _pushSupported === 'function' && !_pushSupported()) return true;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return true;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) return true; // iOS Safari needs PWA mode
    // If user denied permission, don't block forever — let them in
    // Chrome/Android won't re-show the prompt after 'denied'
    if (Notification.permission === 'denied') return true;
    return Notification.permission === 'granted';
  }

  // ============================
  // MAIN GATE CHECK
  // ============================
  window.checkOnboardingGate = function(callback) {
    // KILL-SWITCH (Mario 2026-06-05): el gate de perfil (nombre/email/teléfono/
    // ciudad/estado) es para la APP, NO para acvoltschool.com. En el web bloqueaba
    // a TODOS los estudiantes (no tienen ciudad/estado) → "nadie puede entrar".
    // Desactivado en el web: siempre deja pasar. Quita cualquier modal ya abierto.
    try { var _m = document.getElementById(MODAL_ID); if (_m) _m.remove(); } catch (_) {}
    if (callback) callback();
    return false;
    // Admin bypasses gate
    if (_isAdmin()) { if (callback) callback(); return false; }
    // iOS App Store: skip gate — Apple reviewers shouldn't be blocked by profile form
    if (window.isIOSAppStore) { if (callback) callback(); return false; }

    var needsProfile = !_profileComplete();

    if (!needsProfile) {
      // Profile complete — let them in
      if (callback) callback();
      return false;
    }

    // Show gate modal (profile only)
    _showGateModal(needsProfile, callback);
    return true;
  };

  // ============================
  // GATE MODAL UI
  // ============================
  function _showGateModal(needsProfile, callback) {
    // Remove existing
    var existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();

    var user = _getUser();

    // Remove any push notification gate that might overlay us
    var _pushGate = document.getElementById('pushMandatoryGate');
    if (_pushGate) _pushGate.remove();

    var h = '';
    h += '<div id="' + MODAL_ID + '" style="position:fixed;inset:0;z-index:2147483647;background:#0a1628;padding:24px 16px;box-sizing:border-box;overflow-y:auto;animation:gateFadeIn 320ms cubic-bezier(0.34,1.56,0.64,1);">';
    h += '<div style="max-width:400px;width:100%;margin:0 auto;">';

    // Header
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:40px;margin-bottom:8px;">\uD83D\uDD10</div>';
    h += '<div style="font-size:19px;font-weight:900;color:rgba(255,255,255,0.95);letter-spacing:-0.3px;">' + (typeof _t === 'function' ? _t('gate_complete_profile') : 'Completa tu Perfil') + '</div>';
    h += '<div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:4px;line-height:1.5;">' + (typeof _t === 'function' ? _t('gate_subtitle') : 'Para usar Maestro HVACR completa tu información') + '</div>';
    h += '</div>';

    // === Profile Form ===
    h += '<div style="background:rgba(232,89,28,0.08);border:1px solid rgba(232,89,28,0.25);border-radius:14px;padding:14px;margin-bottom:12px;">';
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
    h += '<span style="font-size:20px;">\uD83D\uDCCB</span>';
    h += '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.95);">' + (typeof _t === 'function' ? _t('gate_personal_info') : 'Información Personal') + '</div>';
    h += '<div style="font-size:13px;color:rgba(255,255,255,0.7);">' + (typeof _t === 'function' ? _t('gate_personal_fields') : 'Nombre, email, teléfono, ciudad, estado') + '</div></div>';
    h += '</div>';

    // Use a placeholder div — inputs will be created via DOM (safer than innerHTML)
    h += '<div id="gateInputsContainer"></div>';
    // Primary CTA — solid accent orange #E8591C
    h += '<button onclick="window._gateSaveProfile()" style="width:100%;padding:13px;border-radius:10px;border:none;background:#E8591C;color:#fff;font-weight:800;font-size:14px;cursor:pointer;margin-top:4px;letter-spacing:0.1px;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),box-shadow 200ms cubic-bezier(0.32,0.72,0,1);box-shadow:0 4px 14px rgba(232,89,28,0.35);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">\uD83D\uDE80 ' + (typeof _t === 'function' ? _t('gate_save_enter') : 'Guardar y Entrar') + '</button>';
    h += '<div id="gateProfileMsg" style="text-align:center;font-size:13px;margin-top:6px;min-height:18px;"></div>';
    h += '</div>';

    h += '<div style="text-align:center;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">';
    // Secondary CTA — transparent + translucent border, bright text
    h += '<button onclick="window._gateHardRefresh(event)" style="background:transparent;border:1px solid rgba(255,255,255,0.25);border-radius:8px;color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;cursor:pointer;padding:9px 14px;transition:transform 90ms cubic-bezier(0.32,0.72,0,1),background 200ms cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;" onmousedown="this.style.transform=\'scale(0.97)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'" ontouchstart="this.style.transform=\'scale(0.97)\'" ontouchend="this.style.transform=\'scale(1)\'">🔄 ' + (typeof _t === 'function' ? _t('gate_refresh') : '¿Problemas para entrar? Actualizar App') + '</button>';
    h += '</div>';

    h += '</div></div>';

    document.body.insertAdjacentHTML('beforeend', h);

    // Inject entry-animation keyframes (once)
    if (!document.getElementById('gateMotionStyles')) {
      var gateStyle = document.createElement('style');
      gateStyle.id = 'gateMotionStyles';
      gateStyle.textContent = '@keyframes gateFadeIn{0%{opacity:0;transform:scale(0.96);}100%{opacity:1;transform:scale(1);}}';
      document.head.appendChild(gateStyle);
    }

    // Create inputs via DOM (not innerHTML) for safety
    var container = document.getElementById('gateInputsContainer');
    if (container) {
      var _email = '';
      try { _email = user.email || localStorage.getItem('tecnico_email') || ''; } catch(e) { _email = ''; }
      var _t_ = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
      var _fields = [
        { name: 'nombre', type: 'text', ph: _t_('gate_full_name', 'Nombre completo *'), val: user.nombre || '', ro: false },
        { name: 'email', type: 'email', ph: _t_('gate_email', 'Correo electr\u00f3nico *'), val: _email, ro: true },
        { name: 'telefono', type: 'tel', ph: _t_('gate_phone', 'Tel\u00e9fono * (ej. 305-555-1234)'), val: user.telefono || '', ro: false },
        { name: 'ciudad', type: 'text', ph: _t_('gate_city', 'Ciudad *'), val: user.ciudad || '', ro: false },
        { name: 'estado', type: 'text', ph: _t_('gate_state', 'Estado / State *'), val: user.estado || '', ro: false }
      ];
      _fields.forEach(function(f) {
        var inp = document.createElement('input');
        inp.type = f.type;
        inp.name = f.name;
        inp.id = 'gate_' + f.name;
        inp.placeholder = f.ph;
        inp.value = f.val;
        if (f.ro) inp.readOnly = true;
        inp.style.cssText = 'width:100%;padding:11px 12px;border-radius:8px;background:#1a2744;color:rgba(255,255,255,0.95);border:1px solid rgba(255,255,255,0.15);font-size:16px;margin-bottom:8px;box-sizing:border-box;outline:none;font-family:sans-serif;-webkit-appearance:none;appearance:none;transition:border-color 200ms cubic-bezier(0.32,0.72,0,1);';
        inp.autocomplete = 'off';
        container.appendChild(inp);
      });
    }

    // NOTE: Do NOT set body overflow:hidden — it blocks iOS Safari keyboard scroll-to-input

    // Kill any overlays that try to appear over the gate (push gate, device guard, etc.)
    if (!window._gateOverlayGuard) {
      window._gateOverlayGuard = new MutationObserver(function(mutations) {
        if (!document.getElementById(MODAL_ID)) {
          if (window._gateOverlayGuard) { window._gateOverlayGuard.disconnect(); window._gateOverlayGuard = null; }
          return;
        }
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.id !== MODAL_ID) {
              var cs = window.getComputedStyle(node);
              if (cs.position === 'fixed' && cs.zIndex && parseInt(cs.zIndex) >= 99999) {
                console.warn('[Gate] Blocked overlay:', node.id || node.className);
                node.style.display = 'none';
              }
            }
          });
        });
      });
      window._gateOverlayGuard.observe(document.body, { childList: true });
    }

    // Store callback
    window._gateCallback = callback;

    console.log('[Gate] Profile-only gate shown');
  }

  // Location and notification helper functions kept for external use (HVAC tools, etc.)
  // but no longer part of the onboarding gate

  // ============================
  // GATE ACTIONS
  // ============================

  // Helper: read input values from gate form
  function _gateReadInputs() {
    var data = { nombre: '', email: '', telefono: '', ciudad: '', estado: '' };
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      var inp = document.getElementById('gate_' + keys[i]);
      if (inp) data[keys[i]] = (inp.value || '').trim();
    }
    return data;
  }

  // Save profile
  window._gateSaveProfile = function() {
    var d = _gateReadInputs();
    var nombre = d.nombre;
    var email = d.email;
    var telefono = d.telefono;
    var ciudad = d.ciudad;
    var estado = d.estado;
    var msgEl = document.getElementById('gateProfileMsg');

    if (!nombre || !email || !telefono || !ciudad || !estado) {
      if (msgEl) { msgEl.style.color = '#ef4444'; msgEl.textContent = (typeof _t === 'function' ? _t('gate_all_required') : '\u26A0\uFE0F Todos los campos son obligatorios'); }
      return;
    }

    // Save to localStorage
    var user = _getUser();
    user.nombre = nombre;
    user.email = email;
    user.telefono = telefono;
    user.ciudad = ciudad;
    user.estado = estado;
    localStorage.setItem('tecnico_user', JSON.stringify(user));
    localStorage.setItem('tecnico_user_backup', JSON.stringify(user));

    // Sync to Supabase (use the global supabaseClient from supabase-init.js)
    try {
      var SB = (typeof supabaseClient !== 'undefined') ? supabaseClient : null;
      if (SB) {
        usersDataSelf('upsert_self', {
          email: email,
          data: { nombre: nombre, telefono: telefono, ciudad: ciudad, estado: estado }
        }).then(function(res) {
          if (res.error) console.warn('[Gate] Supabase upsert error:', res.error.message);
          else console.log('[Gate] Profile synced to Supabase');
        });
      } else {
        console.warn('[Gate] supabaseClient not available');
      }
    } catch(e) { console.warn('[Gate] Supabase sync error:', e); }
    // Also sync via supabaseRegisterUser if available
    if (typeof supabaseRegisterUser === 'function') {
      try { supabaseRegisterUser(user); } catch(e) {}
    }

    if (msgEl) { msgEl.style.color = '#22c55e'; msgEl.textContent = (typeof _t === 'function' ? _t('gate_saved_entering') : '\u2705 Datos guardados — entrando...'); }

    // Update currentUser global
    if (typeof window.currentUser !== 'undefined') {
      window.currentUser = user;
    }

    // Profile is the only requirement — enter the app
    setTimeout(function() {
      window._gateContinue();
    }, 800);
  };

  // Location request — kept as global for use by HVAC tools
  window._requestLocationForTools = function(onSuccess, onSkip) {
    if (_locationGranted()) {
      if (onSuccess) onSuccess();
      return;
    }
    if (!navigator.geolocation) {
      if (onSkip) onSkip();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        localStorage.setItem('maestro_location_granted', 'true');
        if (typeof initWeatherWidget === 'function') initWeatherWidget();
        if (onSuccess) onSuccess();
      },
      function() {
        if (onSkip) onSkip();
      },
      { timeout: 15000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  // Hard refresh — clears SW cache and reloads (for students stuck on old version)
  window._gateHardRefresh = function(e) {
    var btn = e && e.target;
    if (btn) { btn.textContent = (typeof _t === 'function' ? _t('gate_clearing_cache') : '⏳ Limpiando caché...'); btn.disabled = true; }
    var done = function() { window.location.reload(true); };
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistrations().then(function(regs) {
          var promises = regs.map(function(r) { return r.unregister(); });
          return Promise.all(promises);
        }).then(function() {
          if ('caches' in window) {
            return caches.keys().then(function(keys) {
              return Promise.all(keys.map(function(k) { return caches.delete(k); }));
            });
          }
        }).then(done).catch(done);
      } else if ('caches' in window) {
        caches.keys().then(function(keys) {
          return Promise.all(keys.map(function(k) { return caches.delete(k); }));
        }).then(done).catch(done);
      } else {
        done();
      }
    } catch(e) { done(); }
  };

  // Continue to app
  window._gateContinue = function() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();
    // Stop overlay guard
    if (window._gateOverlayGuard) { window._gateOverlayGuard.disconnect(); window._gateOverlayGuard = null; }
    if (typeof window._gateCallback === 'function') {
      window._gateCallback();
      window._gateCallback = null;
    }
  };

})();
