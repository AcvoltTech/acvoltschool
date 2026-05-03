// ============================================
// PAYWALL iOS — Apple-compliant IAP subscription modal
// Requires: window.IAP (iap-bridge.js)
// Shown ONLY inside iOS App Store build.
//
// Apple 3.1.2(a) / 3.1.1 required disclosures:
//   - Title + length + price per period
//   - Trial length if any, followed by renewal price
//   - Auto-renewal terms (user can manage / cancel in App Store)
//   - Privacy Policy link
//   - Terms of Service (EULA) link
// ============================================
(function(global) {
  'use strict';

  if (!global.isIOSAppStore) {
    // Web / Android — this file is inert. Stripe paywalls (maestrohvacr.com)
    // and Google Play IAP (future) handle their own flows.
    return;
  }

  var state = {
    open: false,
    offering: null,
    packages: [],
    loading: false,
    processing: false,
    lastError: null
  };

  var MODAL_ID = 'iosPaywallModal';
  var PRIVACY_URL = 'https://maestrohvacr.com/privacy.html';
  var TERMS_URL   = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

  function css() {
    if (document.getElementById('iosPaywallCSS')) return;
    var s = document.createElement('style');
    s.id = 'iosPaywallCSS';
    s.textContent = [
      '#iosPaywallModal{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.65);',
      '  display:flex;align-items:flex-end;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif}',
      '#iosPaywallModal.closed{display:none}',
      '#iosPaywallSheet{background:#fff;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;',
      '  border-radius:20px 20px 0 0;padding:24px 22px 32px;color:#111;position:relative;',
      '  box-shadow:0 -8px 32px rgba(0,0,0,.3)}',
      '#iosPaywallClose{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:17px;',
      '  border:0;background:#f0f0f0;color:#111;font-size:18px;cursor:pointer;line-height:1}',
      '.iosPaywall-hero{text-align:center;padding:12px 0 18px}',
      '.iosPaywall-hero h2{margin:0 0 6px;font-size:22px;font-weight:700;color:#111}',
      '.iosPaywall-hero .sub{color:#555;font-size:14px;margin:0}',
      '.iosPaywall-features{list-style:none;padding:0;margin:16px 0 20px}',
      '.iosPaywall-features li{padding:10px 0;border-bottom:1px solid #eee;font-size:15px;color:#111;',
      '  display:flex;gap:10px;align-items:flex-start}',
      '.iosPaywall-features li:last-child{border-bottom:0}',
      '.iosPaywall-features li .chk{color:#007AFF;font-weight:700;flex-shrink:0}',
      '.iosPaywall-price{background:#F5F7FA;border-radius:14px;padding:16px;text-align:center;margin-bottom:16px}',
      '.iosPaywall-price .big{font-size:20px;font-weight:700;color:#111}',
      '.iosPaywall-price .lil{font-size:13px;color:#555;margin-top:4px}',
      '.iosPaywall-cta{width:100%;background:#007AFF;color:#fff;border:0;padding:16px;border-radius:12px;',
      '  font-size:17px;font-weight:600;cursor:pointer;margin-bottom:10px}',
      '.iosPaywall-cta:disabled{opacity:.5;cursor:not-allowed}',
      '.iosPaywall-restore{background:none;border:0;color:#007AFF;font-size:15px;width:100%;padding:10px;cursor:pointer}',
      '.iosPaywall-disclaimer{font-size:11px;color:#666;line-height:1.5;margin-top:14px;text-align:center}',
      '.iosPaywall-disclaimer a{color:#007AFF;text-decoration:none}',
      '.iosPaywall-error{background:#FFE5E5;color:#B00020;padding:10px 12px;border-radius:8px;',
      '  font-size:13px;margin-bottom:12px;text-align:center}',
      '.iosPaywall-loading{text-align:center;padding:40px 20px;color:#555;font-size:14px}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function buildFeatures() {
    return [
      '51 herramientas Maestro Pro (PT Chart, Manual J, Psychrometric, Duct Design, +48)',
      'Simuladores exclusivos: SC680, SDMN6, Chiller & Cooling Tower',
      'Banco completo de preguntas EPA 608, NATE, CSLB Prep',
      'Maestro Mario AI — diagnóstico con foto de placa',
      '400+ videos tutoriales premium',
      'Clases en vivo exclusivas + Bolsa de Trabajo HVACR',
      'Maestro Invoices CRM + Chaka Tips',
      'Desafío Maestro — modo completo sin límite de preguntas'
    ];
  }

  function ensureModal() {
    var el = document.getElementById(MODAL_ID);
    if (el) return el;
    css();
    el = document.createElement('div');
    el.id = MODAL_ID;
    el.className = 'closed';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.addEventListener('click', function(ev) { if (ev.target === el) close(); });
    document.body.appendChild(el);
    return el;
  }

  function render() {
    var el = ensureModal();
    if (!state.open) { el.className = 'closed'; return; }
    el.className = '';

    if (state.loading) {
      el.innerHTML = '<div id="iosPaywallSheet">' +
        '<button id="iosPaywallClose" aria-label="Cerrar">&times;</button>' +
        '<div class="iosPaywall-loading">Cargando planes…</div>' +
      '</div>';
      document.getElementById('iosPaywallClose').addEventListener('click', close);
      return;
    }

    var pkg = state.packages[0];
    var priceLine, trialLine, renewLine;
    if (pkg) {
      priceLine = pkg.priceString + ' / mes';
      trialLine = '14 días gratis, luego ' + pkg.priceString + ' al mes.';
      renewLine = 'Renovación automática mensual de ' + pkg.priceString + ' hasta que canceles.';
    } else {
      priceLine = '$59.99 / mes';
      trialLine = '14 días gratis, luego $59.99 al mes.';
      renewLine = 'Renovación automática mensual hasta que canceles.';
    }

    var featureHTML = buildFeatures().map(function(f) {
      return '<li><span class="chk">✓</span><span>' + f + '</span></li>';
    }).join('');

    var errorHTML = state.lastError
      ? '<div class="iosPaywall-error">' + escapeHtml(state.lastError) + '</div>'
      : '';

    el.innerHTML = '<div id="iosPaywallSheet">' +
      '<button id="iosPaywallClose" aria-label="Cerrar">&times;</button>' +
      '<div class="iosPaywall-hero">' +
        '<h2>Maestro HVACR Premium</h2>' +
        '<p class="sub">Acceso completo a todo el ecosistema de formación HVACR</p>' +
      '</div>' +
      errorHTML +
      '<ul class="iosPaywall-features">' + featureHTML + '</ul>' +
      '<div class="iosPaywall-price">' +
        '<div class="big">' + trialLine + '</div>' +
        '<div class="lil">' + renewLine + '</div>' +
      '</div>' +
      '<button class="iosPaywall-cta" id="iosPaywallBuy"' + (state.processing ? ' disabled' : '') + '>' +
        (state.processing ? 'Procesando…' : 'Empezar prueba gratis') +
      '</button>' +
      '<button class="iosPaywall-restore" id="iosPaywallRestore"' + (state.processing ? ' disabled' : '') + '>' +
        'Restaurar compra' +
      '</button>' +
      '<div class="iosPaywall-disclaimer">' +
        'Pago a tu cuenta Apple ID. La suscripción se renueva automáticamente al mismo precio cada mes ' +
        'a menos que se cancele al menos 24 h antes del final del período. Puedes gestionar y cancelar ' +
        'en los Ajustes de tu cuenta Apple ID después de la compra.<br><br>' +
        '<a href="' + PRIVACY_URL + '" target="_blank" rel="noopener">Política de privacidad</a>' +
        ' · ' +
        '<a href="' + TERMS_URL + '" target="_blank" rel="noopener">Términos (EULA)</a>' +
      '</div>' +
    '</div>';

    document.getElementById('iosPaywallClose').addEventListener('click', close);
    document.getElementById('iosPaywallBuy').addEventListener('click', handleBuy);
    document.getElementById('iosPaywallRestore').addEventListener('click', handleRestore);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function loadOfferings() {
    if (!global.IAP || !global.IAP.isAvailable()) {
      state.lastError = 'IAP no disponible. Reinstala la app desde la App Store.';
      state.loading = false;
      render();
      return;
    }
    state.loading = true;
    state.lastError = null;
    render();
    global.IAP.getOfferings().then(function(data) {
      state.offering = data.offering || 'default';
      state.packages = Array.isArray(data.packages) ? data.packages : [];
      state.loading = false;
      render();
    }).catch(function(err) {
      console.error('[paywall-ios] getOfferings failed', err);
      state.lastError = 'No se pudo cargar el plan: ' + (err.message || err);
      state.loading = false;
      render();
    });
  }

  function handleBuy() {
    if (state.processing) return;
    state.processing = true;
    state.lastError = null;
    render();
    var pkgId = (state.packages[0] && state.packages[0].identifier) || '$rc_monthly';
    console.log('[paywall-ios] handleBuy →', pkgId);
    // Safety timeout: if native bridge never posts back (Apple IAP sheet quirk,
    // cancelled sandbox purchase, or any other black hole), unstick the UI after
    // 90s so the user can close the modal with X or retry.
    var safetyTimer = setTimeout(function() {
      if (!state.processing) return;
      console.warn('[paywall-ios] handleBuy safety timeout — native never responded');
      state.processing = false;
      state.lastError = 'La compra no respondió. Cierra con ✕ e intenta de nuevo.';
      render();
    }, 90000);
    global.IAP.purchase(pkgId).then(function(info) {
      clearTimeout(safetyTimer);
      state.processing = false;
      console.log('[paywall-ios] handleBuy resolved:', info && info.active);
      if (info && info.active) {
        onPurchaseSuccess(info);
      } else {
        state.lastError = 'La compra no se completó. Intenta de nuevo.';
        render();
        setTimeout(forceWebViewRepaint, 150);
      }
    }).catch(function(err) {
      clearTimeout(safetyTimer);
      state.processing = false;
      console.warn('[paywall-ios] handleBuy rejected:', err && err.code, err && err.message);
      if (err && err.code === 'USER_CANCELLED') {
        render();
        setTimeout(forceWebViewRepaint, 150);
        return;
      }
      state.lastError = 'Error en la compra: ' + (err.message || err);
      render();
      setTimeout(forceWebViewRepaint, 150);
    });
  }

  function handleRestore() {
    if (state.processing) return;
    state.processing = true;
    state.lastError = null;
    render();
    console.log('[paywall-ios] handleRestore');
    var safetyTimer = setTimeout(function() {
      if (!state.processing) return;
      console.warn('[paywall-ios] handleRestore safety timeout');
      state.processing = false;
      state.lastError = 'Restaurar no respondió. Cierra con ✕ e intenta de nuevo.';
      render();
    }, 60000);
    global.IAP.restore().then(function(info) {
      clearTimeout(safetyTimer);
      state.processing = false;
      if (info && info.active) {
        onPurchaseSuccess(info);
      } else {
        state.lastError = 'No encontramos compras anteriores en esta cuenta Apple ID.';
        render();
        setTimeout(forceWebViewRepaint, 150);
      }
    }).catch(function(err) {
      clearTimeout(safetyTimer);
      state.processing = false;
      state.lastError = 'Error al restaurar: ' + (err.message || err);
      render();
      setTimeout(forceWebViewRepaint, 150);
    });
  }

  // Shared repaint routine — runs after the Apple IAP sheet (or any native modal)
  // dismisses. Fires on success, cancel, error, and X button alike. Apple's IAP
  // sheet leaves the WKWebView in "visible" state the whole time, so no
  // visibilitychange event ever fires. We have to poke the compositor ourselves.
  function forceWebViewRepaint() {
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    try {
      var hash = (window.location.hash || '#dashboardScreen').replace('#', '');
      if (typeof global.showScreen === 'function') global.showScreen(hash);
    } catch (_e) {}
    try { void document.body.offsetHeight; } catch (_e) {}
    try {
      var de = document.documentElement;
      var origDe = de.style.transform;
      de.style.transform = 'translateZ(0)';
      requestAnimationFrame(function() {
        de.style.transform = origDe || '';
        var active = document.querySelector('.screen.active') || document.getElementById('dashboardScreen');
        if (active) {
          var origAct = active.style.transform;
          active.style.transform = 'translateZ(0)';
          requestAnimationFrame(function(){ active.style.transform = origAct || ''; });
        }
      });
    } catch (_e) {}
  }

  function onPurchaseSuccess(info) {
    global.__premiumActive = true;
    try {
      localStorage.setItem('iap_active', '1');
      localStorage.setItem('iap_last_check', String(Date.now()));
    } catch (_e) {}
    try { document.dispatchEvent(new CustomEvent('iap:premium-granted', { detail: info })); } catch (_e) {}
    close();
    // After successful purchase, always land the user on the dashboard so they
    // can immediately use the premium tools they just unlocked. The close()
    // above already scheduled forceWebViewRepaint; we additionally force
    // navigation to dashboardScreen instead of whatever screen they came from
    // (which may still be showing the gated-tool stub).
    setTimeout(function() {
      try {
        if (typeof global.showScreen === 'function') global.showScreen('dashboardScreen');
        try { window.location.hash = '#dashboardScreen'; } catch (_e) {}
      } catch (_e) {}
    }, 200);
    try {
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
        'background:#0a7a3e;color:#fff;padding:12px 20px;border-radius:12px;z-index:100000;' +
        'font-size:15px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.3);' +
        'font-family:-apple-system,BlinkMacSystemFont,sans-serif;';
      toast.textContent = '✓ Premium activado — ya puedes usar todas las herramientas';
      document.body.appendChild(toast);
      setTimeout(function() { try { toast.remove(); } catch(_){} }, 3000);
    } catch (_e) {}
  }

  function open(reason) {
    state.open = true;
    state.lastError = null;
    console.log('[paywall-ios] open (reason=' + (reason || 'unknown') + ')');
    render();
    loadOfferings();
  }

  function close() {
    state.open = false;
    state.processing = false;
    state.lastError = null;
    render();
    // Navigate to dashboard — current screen's requirePremium() gate would
    // re-open this paywall if we let forceWebViewRepaint re-enter that hash.
    setTimeout(function() {
      try {
        if (typeof global.showScreen === 'function') global.showScreen('dashboardScreen');
        try { window.location.hash = '#dashboardScreen'; } catch (_e) {}
      } catch (_e) {}
      try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
      try { void document.body.offsetHeight; } catch (_e) {}
    }, 150);
  }

  global.showIOSPaywall = open;
  global.closeIOSPaywall = close;

  // Cache-warm status at startup so requirePremium() has fast path
  if (global.IAP && global.IAP.isAvailable()) {
    global.IAP.getStatus().then(function(info) {
      if (info && info.active) {
        global.__premiumActive = true;
        try { localStorage.setItem('iap_active', '1'); } catch (_e) {}
      } else {
        global.__premiumActive = false;
        try { localStorage.removeItem('iap_active'); } catch (_e) {}
      }
    }).catch(function() {});
  }
})(window);
