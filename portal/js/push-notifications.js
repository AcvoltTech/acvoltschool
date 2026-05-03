(function(){
  'use strict';
  var _tp = window._tp = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
  function _sb() { return window.supabaseClient; }

  // ---- VAPID Public Key ----
  var VAPID_PUBLIC_KEY = 'BD_QiIYgrLvt37XDTBZux6HQETOQbbiexI4L-5bedBqVq-M4Wi-7uUv9B7NHt5miNtFaGBT5NABd_Z3wSpLTefQ';

  // ---- Helpers ----
  function _isPushSubscribed() {
    if (localStorage.getItem('maestroac_push_subscribed') === 'true') return true;
    return false;
  }
  function _isAdmin() {
    return localStorage.getItem('maestroac_role') === 'admin' || localStorage.getItem('isAdmin') === 'true';
  }
  function _pushSupported() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    // iOS Safari browser (non-PWA): PushManager exists on iOS 16.4+ but subscribe() fails
    // unless the app is added to the home screen (standalone mode)
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !window.navigator.standalone) return false;
    return true;
  }

  // ---- Push Subscription ----
  window.subscribeToPush = async function() {
    if (!_pushSupported()) {
      console.warn('Push not supported');
      return false;
    }
    try {
      var permission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
      // Only request permission if not yet decided — Safari requires user gesture
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      if (permission !== 'granted') {
        console.warn('Push permission denied');
        _showDeniedInstructions();
        return false;
      }

      var reg = await navigator.serviceWorker.ready;
      var sub;
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      } catch(subErr) {
        console.warn('Push subscribe error (InvalidStateError?):', subErr.message || subErr);
        // Try to get existing subscription instead
        sub = await reg.pushManager.getSubscription();
        if (!sub) { console.warn('Push: no existing subscription either'); return false; }
      }

      // Mark subscribed immediately after browser confirms — Supabase sync is secondary.
      // This prevents the mandatory gate from re-appearing if the network call fails.
      localStorage.setItem('maestroac_push_subscribed', 'true');
      localStorage.removeItem('push_unsubscribed');

      var email = '';
      try {
        var session = _sb() ? (await _sb().auth.getSession()).data.session : null;
        email = session ? session.user.email : (localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || '');
      } catch(e) { email = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || ''; }

      // Verify permission is still granted before persisting to DB
      if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        console.warn('[Push] Permission no longer granted after subscribe — aborting DB save');
        localStorage.removeItem('maestroac_push_subscribed');
        return false;
      }

      var keys = sub.toJSON().keys;
      if (!_sb()) { console.warn('Push: no supabase client'); return true; }

      // Deactivate old endpoints for this user before registering new one
      if (email) {
        try {
          await _sb().from('push_subscriptions')
            .update({ active: false })
            .eq('user_email', email)
            .neq('endpoint', sub.endpoint);
        } catch(e) { console.warn('[Push] cleanup old endpoints:', e); }
      }

      await _sb().from('push_subscriptions').upsert({
        user_email: email,
        endpoint: sub.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: navigator.userAgent,
        active: true
      }, { onConflict: 'endpoint' });
      // Remove all push prompts
      _removeMandatoryGate();
      _removeDashboardPushBanner();
      return true;
    } catch(e) {
      console.warn('Push subscribe error:', e);
      return false;
    }
  };

  function urlBase64ToUint8Array(base64String) {
    if (!base64String) return new Uint8Array(0);
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var raw = window.atob(base64);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  // ==================================================================
  // PUSH GATE — Disabled in v3.0. Notifications are now optional.
  // Students enter freely; push is encouraged but not required.
  // ==================================================================

  function _showMandatoryGate() {
    // v3.0: No longer block app entry for push notifications
    // Still auto-subscribe silently if already granted
    if (_isPushSubscribed()) return;
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      subscribeToPush();
    }
    return; // <-- gate disabled, don't show blocking overlay
    // Don't overlay the onboarding gate — let user complete profile first
    if (document.getElementById('onboardingGateModal')) return;
    if (_isAdmin()) {
      // Auto-subscribe silently if already granted
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') { subscribeToPush(); return; }
    }
    if (!_pushSupported()) return; // can't force on unsupported browsers

    // If permission already granted but not subscribed, auto-subscribe
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      subscribeToPush();
      return;
    }

    var gate = document.getElementById('pushMandatoryGate');
    if (gate) { gate.style.display = 'flex'; return; }

    gate = document.createElement('div');
    gate.id = 'pushMandatoryGate';
    gate.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);';

    // Check if permission was previously denied
    var isDenied = typeof Notification !== 'undefined' && Notification.permission === 'denied';

    if (isDenied) {
      gate.innerHTML =
        '<div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:2px solid rgba(239,68,68,0.5);border-radius:20px;padding:32px 24px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);">' +
          '<div style="font-size:56px;margin-bottom:12px;">🚫</div>' +
          '<div style="color:#ef4444;font-size:20px;font-weight:800;margin-bottom:8px;">' + _tp('pn_notifications_blocked', 'Notificaciones Bloqueadas') + '</div>' +
          '<div style="color:#cbd5e1;font-size:14px;line-height:1.6;margin-bottom:20px;">' +
            _tp('pn_blocked_instructions', 'Las notificaciones fueron bloqueadas en tu navegador. Para usar la app necesitas activarlas manualmente:') +
          '</div>' +
          '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:12px;padding:16px;text-align:left;margin-bottom:20px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
            '<div style="color:#E8591C;font-weight:700;font-size:13px;margin-bottom:8px;">' + _tp('pn_how_to_activate', 'Como activarlas:') + '</div>' +
            '<div style="color:#6B6B66;font-weight:500;font-size:12px;line-height:1.8;">' +
              _tp('pn_step1_lock', '1. Toca el icono de candado 🔒 en la barra de tu navegador') + '<br>' +
              _tp('pn_step2_notifications', '2. Busca "Notificaciones"') + '<br>' +
              _tp('pn_step3_allow', '3. Cambialo a "Permitir"') + '<br>' +
              _tp('pn_step4_reload', '4. Recarga esta pagina') +
            '</div>' +
          '</div>' +
          '<button onclick="location.reload()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(59,130,246,0.4);">' +
            _tp('pn_already_activated_reload', 'Ya las active — Recargar') +
          '</button>' +
        '</div>';
    } else {
      gate.innerHTML =
        '<div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:2px solid rgba(239,68,68,0.5);border-radius:20px;padding:32px 24px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);">' +
          '<div style="font-size:56px;margin-bottom:12px;">🔔</div>' +
          '<div style="color:#ef4444;font-size:22px;font-weight:800;margin-bottom:6px;">' + _tp('pn_activate_notifications', 'ACTIVA LAS NOTIFICACIONES') + '</div>' +
          '<div style="color:#fbbf24;font-size:15px;font-weight:600;margin-bottom:16px;">' + _tp('pn_required_for_app', 'Requerido para usar Maestro Mario') + '</div>' +
          '<div style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:24px;">' +
            _tp('pn_activate_reason', 'Para poder avisarte de clases en vivo, grabaciones nuevas, y actualizaciones importantes, necesitamos que actives las notificaciones.') + ' <b style="color:#e2e8f0;">' + _tp('pn_mandatory', 'Es obligatorio para continuar.') + '</b>' +
          '</div>' +
          '<button id="pushMandatoryBtn" style="width:100%;padding:16px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border:none;border-radius:12px;font-size:17px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(239,68,68,0.5);transition:transform 0.15s;animation:pushMandPulse 2s infinite;"' +
            ' onmouseover="this.style.transform=\'scale(1.03)\'" onmouseout="this.style.transform=\'scale(1)\'">' +
            _tp('pn_activate_btn', '🔔 Activar Notificaciones') +
          '</button>' +
          '<div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:10px;margin-top:14px;font-size:12px;color:#fbbf24;line-height:1.6;">' + _tp('pn_browser_prompt_hint', '⚠️ Después de tocar el botón, <b>aparecerá un aviso del navegador</b> arriba o abajo de la pantalla.<br>Toca <b style="color:#4ade80;">PERMITIR</b> o <b style="color:#4ade80;">ALLOW</b> para continuar.') + '</div>' +
        '</div>';

      // Pulse animation
      var style = document.createElement('style');
      style.textContent = '@keyframes pushMandPulse{0%,100%{box-shadow:0 4px 20px rgba(239,68,68,0.5)}50%{box-shadow:0 6px 35px rgba(239,68,68,0.8)}}';
      gate.appendChild(style);
    }

    document.body.appendChild(gate);

    // Activate button handler (only for non-denied state)
    var btn = document.getElementById('pushMandatoryBtn');
    if (btn) {
      btn.addEventListener('click', async function() {
        btn.disabled = true;
        btn.textContent = _tp('pn_find_browser_prompt', '👆 Busca el aviso del navegador y toca PERMITIR');
        btn.style.fontSize = '13px';
        var success = await subscribeToPush();
        if (!success) {
          btn.disabled = false;
          btn.textContent = _tp('pn_activate_btn', '🔔 Activar Notificaciones');
          btn.style.fontSize = '';
          // If now denied, rebuild the gate with denied instructions
          if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
            gate.remove();
            _showMandatoryGate();
          }
        }
      });
    }
  }

  function _removeMandatoryGate() {
    var gate = document.getElementById('pushMandatoryGate');
    if (gate) gate.remove();
    // Also remove old modals if they exist
    var old1 = document.getElementById('pushOptinBanner');
    if (old1) old1.remove();
    var old2 = document.getElementById('pushGateLive');
    if (old2) old2.remove();
  }

  // Show denied instructions inline (called when user clicks activate but denies)
  function _showDeniedInstructions() {
    // Rebuild gate with denied state
    var gate = document.getElementById('pushMandatoryGate');
    if (gate) gate.remove();
    _showMandatoryGate();
  }

  // Legacy compatibility — old code may call these
  function hidePushBanner() { _removeMandatoryGate(); }
  window.hidePushBanner = hidePushBanner;
  window.checkPushBeforeLive = function() {
    if (_isPushSubscribed()) return true;
    if (_isAdmin()) return true;
    if (!_pushSupported()) return true;
    _showMandatoryGate();
    return false;
  };

  // ==================================================================
  // STRATEGY 3: Persistent dashboard banner (backup — always visible)
  // ==================================================================
  function _showDashboardPushBanner() {
    if (_isPushSubscribed()) return;
    if (!_pushSupported()) return;
    // Don't nag users who explicitly unsubscribed (they can re-enable from settings)
    if (localStorage.getItem('push_unsubscribed') === 'true') return;
    if (_isAdmin()) { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') { subscribeToPush(); return; } }
    if (document.getElementById('pushDashBanner')) return;

    var dash = document.getElementById('dashboardScreen');
    if (!dash) return;

    var banner = document.createElement('div');
    banner.id = 'pushDashBanner';
    banner.style.cssText = 'background:linear-gradient(135deg,#dc2626,#b91c1c);padding:12px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0;';
    banner.innerHTML =
      '<span style="font-size:22px;">🔔</span>' +
      '<div style="flex:1;">' +
        '<div style="color:#fff;font-weight:700;font-size:13px;">' + _tp('pn_notifications_disabled', 'Notificaciones desactivadas') + '</div>' +
        '<div style="color:rgba(255,255,255,0.8);font-size:11px;">' + _tp('pn_tap_to_enable', 'Toca aqui para no perderte las clases EN VIVO') + '</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.2);padding:6px 12px;border-radius:8px;color:#fff;font-size:12px;font-weight:600;">' + _tp('pn_activate_short', 'Activar') + '</div>';

    banner.addEventListener('click', async function() {
      // If permission was previously denied, show instructions
      if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
        _showDeniedInstructions();
        return;
      }
      var success = await subscribeToPush();
      if (!success && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        _showDeniedInstructions();
      }
    });

    dash.insertBefore(banner, dash.firstChild);
  }

  function _removeDashboardPushBanner() {
    var b = document.getElementById('pushDashBanner');
    if (b) b.remove();
  }
  window._removeDashboardPushBanner = _removeDashboardPushBanner;
  window._showDashboardPushBanner = _showDashboardPushBanner;

  // ---- Exports expected by auth.js (_showMandatoryPushGate, _validatePushSubscription) ----
  window._showMandatoryPushGate = function() { _showMandatoryGate(); };

  window._validatePushSubscription = async function() {
    if (!_pushSupported()) return;
    // If user revoked notification permission, clean up DB subscription
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      if (_isPushSubscribed()) {
        localStorage.removeItem('maestroac_push_subscribed');
        // Deactivate subscription in DB so server stops sending
        try {
          var email = '';
          try {
            var session = _sb() ? (await _sb().auth.getSession()).data.session : null;
            email = session ? session.user.email : (localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || '');
          } catch(e) { email = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || ''; }
          if (email && _sb()) {
            await _sb().from('push_subscriptions').update({ active: false }).eq('user_email', email);
            console.log('[Push] Permission revoked — deactivated subscriptions for', email);
          }
        } catch(e) { console.warn('[Push] cleanup on revoke:', e); }
      }
      return;
    }
    try {
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription();
      if (!sub) {
        // Subscription expired — re-subscribe automatically
        localStorage.removeItem('maestroac_push_subscribed');
        console.log('[Push] Subscription expired, re-subscribing...');
        await subscribeToPush();
      }
    } catch(e) { /* ignore — keep existing flag */ }
  };

  // ---- Unsubscribe from Push ----
  window.unsubscribeFromPush = async function() {
    try {
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      localStorage.removeItem('maestroac_push_subscribed');
      localStorage.setItem('push_unsubscribed', 'true');
      // Deactivate all subscriptions for this user in DB
      var email = '';
      try {
        var session = _sb() ? (await _sb().auth.getSession()).data.session : null;
        email = session ? session.user.email : (localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || '');
      } catch(e) { email = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || ''; }
      if (email && _sb()) {
        await _sb().from('push_subscriptions').update({ active: false }).eq('user_email', email);
      }
      console.log('[Push] Unsubscribed successfully');
      _showDashboardPushBanner(); // Show re-subscribe banner
      return true;
    } catch(e) {
      console.warn('[Push] Unsubscribe error:', e);
      return false;
    }
  };

  // If auth.js registered a ready callback before this module loaded, invoke it now
  if (typeof window._onPushModuleReady === 'function') {
    try { window._onPushModuleReady(); window._onPushModuleReady = null; } catch(e) {}
  }

  // ---- Universal Install + Location Banners (Android/Desktop/iOS) ----
  var _deferredInstallPrompt = null;
  var _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var _isAndroid = /Android/.test(navigator.userAgent);
  var _isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  // Detect native WKWebView wrapper (Xcode app) — suppress install/location modals
  var _isNativeApp = !!(window.webkit && window.webkit.messageHandlers) || document.cookie.indexOf('app-platform') !== -1;

  // Show correct location steps in modal based on platform
  function _showPlatformLocSteps() {
    var ios = document.getElementById('locStepsIOS');
    var and = document.getElementById('locStepsAndroid');
    var desk = document.getElementById('locStepsDesktop');
    if (ios) ios.style.display = _isIOS ? 'block' : 'none';
    if (and) and.style.display = _isAndroid ? 'block' : 'none';
    if (desk) desk.style.display = (!_isIOS && !_isAndroid) ? 'block' : 'none';
  }

  // Show location banner if location not yet granted
  function _showLocationBanner() {
    if (_isNativeApp) return; // Native app handles location via iOS permissions
    if (localStorage.getItem('maestro_location_granted') === 'true') return;
    try {
      var w = localStorage.getItem('maestro_weather');
      if (w) { var d = JSON.parse(w); if (d.lat && d.lon) return; }
    } catch(e) {}
    var b = document.getElementById('locationBanner');
    if (b) b.style.display = 'flex';
  }

  // Android/Desktop: Chrome fires beforeinstallprompt
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    _deferredInstallPrompt = e;
    // Show install banner — always shows until user actually installs
    var banner = document.getElementById('installAppBanner');
    if (banner) banner.style.display = 'flex';
  });

  // App was successfully installed — hide banner and persist flag
  window.addEventListener('appinstalled', function() {
    console.log('[MaestroHVACR] App installed successfully');
    _deferredInstallPrompt = null;
    localStorage.setItem('maestro_app_installed', '1');
    var banner = document.getElementById('installAppBanner');
    if (banner) banner.style.display = 'none';
  });

  // iOS: No beforeinstallprompt — show banner manually if not installed (standalone)
  // Skip entirely if running inside native WKWebView wrapper
  if (_isIOS && !_isStandalone && !_isNativeApp) {
    setTimeout(function() {
      var banner = document.getElementById('installAppBanner');
      if (banner) {
        var desc = document.getElementById('installBannerDesc');
        if (desc) {
          var lang = (localStorage.getItem('maestro_lang') || 'es');
          desc.textContent = _tp('pn_ios_install_desc', 'Toca para ver cómo agregarla a tu pantalla de inicio');
        }
        banner.style.display = 'flex';
      }
    }, 2000);
  }

  // Android that hasn't triggered beforeinstallprompt yet (Samsung, Firefox, etc.)
  if (!_isIOS && !_isStandalone && !_isNativeApp && !('onbeforeinstallprompt' in window)) {
    setTimeout(function() {
      var banner = document.getElementById('installAppBanner');
      if (banner && banner.style.display === 'none') {
        var desc = document.getElementById('installBannerDesc');
        if (desc) {
          var lang = (localStorage.getItem('maestro_lang') || 'es');
          desc.textContent = _tp('pn_android_install_desc', 'Usa el menú del navegador para instalar la app');
        }
        banner.style.display = 'flex';
      }
    }, 3000);
  }

  // Show location banner after a delay (give install banner priority)
  setTimeout(function() { _showLocationBanner(); }, 4000);

  window.installApp = async function() {
    // Already inside native app — no install needed
    if (_isNativeApp) return;
    // Android/Desktop with native prompt
    if (_deferredInstallPrompt) {
      _deferredInstallPrompt.prompt();
      var result = await _deferredInstallPrompt.userChoice;
      if (result.outcome === 'accepted') {
        var banner = document.getElementById('installAppBanner');
        if (banner) banner.style.display = 'none';
        localStorage.setItem('maestro_app_installed', '1');
      }
      _deferredInstallPrompt = null;
      return;
    }
    // iOS / non-Chrome: Show step-by-step instructions modal
    var modal = document.getElementById('iosInstallModal');
    if (modal) {
      // Hide install steps if already installed (standalone) — only show location
      var installSteps = document.getElementById('iosInstallSteps');
      if (_isStandalone && installSteps) installSteps.style.display = 'none';
      _showPlatformLocSteps();
      modal.style.display = 'block';
    }
  };

  // Request location from banner tap
  window.requestLocationFromBanner = function() {
    var b = document.getElementById('locationBanner');
    // If location API not available, just dismiss everything
    if (!navigator.geolocation) {
      var modal = document.getElementById('iosInstallModal');
      if (modal) modal.style.display = 'none';
      if (b) b.style.display = 'none';
      return;
    }
    // Try requesting location directly
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        localStorage.setItem('maestro_location_granted', 'true');
        if (b) b.style.display = 'none';
        if (typeof initWeatherWidget === 'function') initWeatherWidget();
        if (typeof MaestroErrorTracker !== 'undefined' && MaestroErrorTracker.toast) {
          MaestroErrorTracker.toast(_tp('pn_location_activated', 'Ubicación activada!'));
        }
      },
      function(err) {
        // Permission denied or failed — just dismiss, don't re-show modal (causes infinite loop on HTTP)
        console.log('[Location] Geolocation denied or blocked:', err && err.message || err);
        var modal = document.getElementById('iosInstallModal');
        if (modal) modal.style.display = 'none';
        if (b) b.style.display = 'none';
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  // Re-check location when user returns to app (after visiting Settings)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState !== 'visible') return;
    if (localStorage.getItem('maestro_location_granted') === 'true') return;
    if (!navigator.geolocation) return;
    var locBanner = document.getElementById('locationBanner');
    var modal = document.getElementById('iosInstallModal');
    // Only re-try if banner or modal is visible (user was in location flow)
    var inFlow = (locBanner && locBanner.style.display !== 'none') || (modal && modal.style.display !== 'none');
    if (!inFlow) return;
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        localStorage.setItem('maestro_location_granted', 'true');
        if (locBanner) locBanner.style.display = 'none';
        if (modal) modal.style.display = 'none';
        if (typeof initWeatherWidget === 'function') initWeatherWidget();
        if (typeof MaestroErrorTracker !== 'undefined' && MaestroErrorTracker.toast) {
          MaestroErrorTracker.toast(_tp('pn_location_activated', 'Ubicación activada!'));
        }
      },
      function() { /* still denied, do nothing */ },
      { timeout: 5000, maximumAge: 0 }
    );
  });

  // Hide install banner if app becomes standalone (user just installed)
  window.matchMedia('(display-mode: standalone)').addEventListener('change', function(e) {
    if (e.matches) {
      var banner = document.getElementById('installAppBanner');
      if (banner) banner.style.display = 'none';
      localStorage.setItem('maestro_app_installed', '1');
    }
  });

  // ---- Screen Transition + MANDATORY PUSH GATE on ALL screens ----
  var _origShowScreen = window.showScreen;
  if (typeof _origShowScreen === 'function') {
    window.showScreen = function(screenId) {
      // MANDATORY GATE: Block ALL navigation for non-subscribed users
      // Only allow: loginScreen, registerScreen, resetPasswordScreen
      var exemptScreens = ['loginScreen', 'registerScreen', 'resetPasswordScreen'];
      if (exemptScreens.indexOf(screenId) === -1 && !document.getElementById('onboardingGateModal')) {
        if (!_isPushSubscribed() && !_isAdmin() && _pushSupported()) {
          // If permission already granted, auto-subscribe silently
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            subscribeToPush(); // async but let them through
          } else {
            // Show mandatory gate
            _showMandatoryGate();
            // Still navigate — but gate covers everything
          }
        }
      }

      _origShowScreen(screenId);
      var screen = document.getElementById(screenId);
      if (screen) {
        screen.classList.remove('screen-entering');
        void screen.offsetWidth;
        screen.classList.add('screen-entering');
      }

      if (screenId === 'dashboardScreen') {
        setTimeout(_showDashboardPushBanner, 500);
      }
    };
  }

  // ---- Auto-refresh push subscription on every load ----
  async function _refreshPushSubscription() {
    if (!_pushSupported()) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try {
      var reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription();
      if (!sub) {
        localStorage.removeItem('maestroac_push_subscribed');
        await subscribeToPush();
        return;
      }
      var email = '';
      try {
        var session = _sb() ? (await _sb().auth.getSession()).data.session : null;
        email = session ? session.user.email : (localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || '');
      } catch(e) { email = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || ''; }
      if (!email || !_sb()) return;
      var keys = sub.toJSON().keys;
      await _sb().from('push_subscriptions').upsert({
        user_email: email,
        endpoint: sub.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: navigator.userAgent,
        active: true
      }, { onConflict: 'endpoint' });
      localStorage.setItem('maestroac_push_subscribed', 'true');
    } catch(e) { console.warn('Push refresh error:', e); }
  }

  // ---- Check admin force re-prompt flag ----
  async function _checkForceReprompt() {
    if (_isPushSubscribed()) return;
    if (_isAdmin()) return;
    try {
      var sb = _sb();
      if (!sb) return;
      var res = await sb.from('app_config').select('value').eq('key', 'force_push_reprompt').maybeSingle();
      if (!res.data || !res.data.value) return;
      var serverTs = res.data.value;
      var lastSeen = localStorage.getItem('maestroac_reprompt_seen') || '';
      if (serverTs !== lastSeen) {
        // Admin triggered a re-prompt — clear skip flags and force re-prompt
        var email = (localStorage.getItem('tecnico_email') || '').toLowerCase();
        localStorage.removeItem('maestro_notif_skipped');
        localStorage.removeItem('maestroac_push_subscribed');
        localStorage.setItem('maestroac_reprompt_seen', serverTs);
        _showMandatoryGate();
      }
    } catch(e) { /* ignore — non-critical */ }
  }

  // ---- Daily in-app reminder for students without push ----
  async function _checkDailyReminder() {
    if (_isPushSubscribed()) return;
    if (_isAdmin()) return;
    if (!_pushSupported()) return;
    try {
      var sb = _sb();
      if (!sb) return;
      var res = await sb.from('app_config').select('value').eq('key', 'daily_push_reminder').maybeSingle();
      if (!res.data || res.data.value !== 'on') return;

      // Check if already shown today
      var today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem('maestroac_daily_push_shown') === today) return;
      localStorage.setItem('maestroac_daily_push_shown', today);

      // Show daily reminder popup
      var popup = document.createElement('div');
      popup.id = 'dailyPushReminder';
      popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);';
      popup.innerHTML =
        '<div style="background:linear-gradient(135deg,#1e293b,#0f172a);border:2px solid rgba(251,191,36,0.4);border-radius:20px;padding:28px 24px;max-width:380px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);">' +
          '<div style="font-size:48px;margin-bottom:10px;">🔔</div>' +
          '<div style="color:#fbbf24;font-size:18px;font-weight:800;margin-bottom:6px;">' + _tp('pn_activate_notifications_title', '¡Activa las Notificaciones!') + '</div>' +
          '<div style="color:#cbd5e1;font-size:13px;line-height:1.6;margin-bottom:20px;">' +
            _tp('pn_daily_reminder_body', 'Sin notificaciones te pierdes avisos de <b style="color:#22c55e;">clases EN VIVO</b>, grabaciones nuevas, y mensajes importantes del Maestro Mario.') +
          '</div>' +
          '<button id="dailyPushActivateBtn" style="width:100%;padding:14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:10px;">' + _tp('pn_activate_now', '🔔 Activar Ahora') + '</button>' +
          '<button onclick="document.getElementById(\'dailyPushReminder\').remove()" style="width:100%;padding:10px;background:none;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#64748b;font-size:12px;cursor:pointer;">' + _tp('pn_not_now', 'Ahora no') + '</button>' +
        '</div>';

      document.body.appendChild(popup);
      var activateBtn = document.getElementById('dailyPushActivateBtn');
      if (activateBtn) {
        activateBtn.addEventListener('click', async function() {
          activateBtn.disabled = true;
          activateBtn.textContent = _tp('pn_tap_allow_browser', '👆 Toca PERMITIR en el aviso del navegador');
          activateBtn.style.fontSize = '12px';
          var success = await subscribeToPush();
          if (success) {
            popup.remove();
          } else {
            activateBtn.disabled = false;
            activateBtn.textContent = _tp('pn_activate_now', '🔔 Activar Ahora');
            activateBtn.style.fontSize = '';
          }
        });
      }
    } catch(e) { /* ignore */ }
  }

  // ---- Activate after login ----
  var _checkBottomNav = setInterval(function() {
    var dash = document.getElementById('dashboardScreen');
    if (dash && dash.style.display !== 'none' && dash.offsetParent !== null) {
      var nav = document.getElementById('mobileBottomNav');
      if (nav) nav.classList.add('active');
      clearInterval(_checkBottomNav);
      // Auto-refresh push subscription
      setTimeout(_refreshPushSubscription, 2000);
      // Show dashboard persistent banner
      setTimeout(_showDashboardPushBanner, 1000);
      // Show MANDATORY gate after brief delay (gives time for auto-subscribe)
      setTimeout(_showMandatoryGate, 3000);
      // Check admin force re-prompt flag
      setTimeout(_checkForceReprompt, 4000);
      // Check daily in-app reminder
      setTimeout(_checkDailyReminder, 5000);
    }
  }, 2000);

})();
