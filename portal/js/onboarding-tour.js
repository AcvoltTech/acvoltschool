// ============================================
// ONBOARDING TOUR v3 — Router to the big voice tour (app-tour.js)
// Maestro HVACR — April 2026
//
// Single entry point: OnboardingTour.startIfNeeded()
// - Shows ONE welcome + level picker modal (no duplicate modals)
// - Level choice → routes to startAppTour() at the right chapter:
//     nuevo      → chapter 0 (Bienvenida, full 25-min tour)
//     intermedio → chapter 2 (HVAC Tools — 12 tool steps)
//     avanzado   → chapter 7 (CRM / business stack)
// - Suppresses legacy welcomeModal in index.html by setting its flag.
// - Preserves the public API (startIfNeeded/restart) so existing
//   callers in navigation.js and profile.js keep working.
// ============================================
(function() {
  'use strict';

  var STORAGE_KEY = 'maestro_tour_v2';
  var LEVEL_KEY = 'maestro_user_level';
  var ONBOARDED_KEY = 'maestroac_onboarded';
  var LEGACY_WELCOME_KEY = 'maestro_welcome_shown_v3';

  // Chapter index inside app-tour.js CHAPTERS array.
  // Kept in sync with js/app-tour.js:
  //   0 intro, 1 dashboard, 2 tools, 3 ble, 4 study, 5 videos, 6 vip,
  //   7 crm, 8 network, 9 market, 10 radio, 11 ai, 12 challenge, 13 closing
  var LEVEL_CHAPTER = {
    nuevo:      0,
    intermedio: 2,
    avanzado:   7
  };

  var LEVELS = [
    {
      key: 'nuevo',
      emoji: '🌱',
      label: 'Soy Nuevo',
      hint: 'Apenas empiezo en HVAC',
      cta: 'Te llevo por toda la app — dashboard, estudio, certificaciones y herramientas. 25 min con mi voz.'
    },
    {
      key: 'intermedio',
      emoji: '⚡',
      label: 'Intermedio',
      hint: 'Ya tengo experiencia en campo',
      cta: 'Te enseño las 12 herramientas HVAC: Manual J, PT Chart, manifold, multímetro, TAB, chillers.'
    },
    {
      key: 'avanzado',
      emoji: '🏆',
      label: 'Avanzado',
      hint: 'Años en la industria',
      cta: 'Directo al CRM de facturas, marketplace, bolsa de trabajo y clases VIP — lo que te hace ganar más.'
    }
  ];

  function _setFlag(key, val) {
    try { localStorage.setItem(key, val); } catch(e) {}
  }
  function _getFlag(key) {
    try { return localStorage.getItem(key); } catch(e) { return null; }
  }

  function _suppressLegacyWelcomeModal() {
    _setFlag(LEGACY_WELCOME_KEY, '1');
    var legacy = document.getElementById('welcomeModal');
    if (legacy) legacy.style.display = 'none';
  }

  function _ensureAnimStyles() {
    if (document.getElementById('onboardingTourStyles')) return;
    var style = document.createElement('style');
    style.id = 'onboardingTourStyles';
    style.textContent =
      '@keyframes onbFadeIn{0%{opacity:0;transform:scale(0.94) translateY(6px);}100%{opacity:1;transform:scale(1) translateY(0);}}' +
      '.onb-level-btn{display:flex;align-items:center;gap:12px;text-align:left;padding:14px 14px;border:1.5px solid rgba(255,255,255,0.16);border-radius:14px;background:rgba(255,255,255,0.04);color:#fff;font-family:inherit;cursor:pointer;transition:transform 120ms cubic-bezier(0.32,0.72,0,1),border-color 180ms,background 180ms;-webkit-tap-highlight-color:transparent;width:100%;}' +
      '.onb-level-btn:hover{border-color:rgba(232,89,28,0.5);background:rgba(232,89,28,0.08);}' +
      '.onb-level-btn:active{transform:scale(0.98);}';
    document.head.appendChild(style);
  }

  function _showLevelWelcome(onDone) {
    _ensureAnimStyles();

    var existing = document.getElementById('onboardingTourModal');
    if (existing) existing.remove();

    var firstName = 'Técnico';
    try {
      var n = localStorage.getItem('tecnico_nombre') || '';
      if (!n) {
        var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        n = u.nombre || '';
      }
      if (n) firstName = String(n).split(' ')[0];
    } catch(e) {}

    var overlay = document.createElement('div');
    overlay.id = 'onboardingTourModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999998;background:rgba(5,10,20,0.94);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';

    var buttonsHtml = '';
    for (var i = 0; i < LEVELS.length; i++) {
      var lv = LEVELS[i];
      buttonsHtml +=
        '<button class="onb-level-btn" data-level="' + lv.key + '">' +
          '<span style="font-size:30px;flex-shrink:0;width:42px;text-align:center;">' + lv.emoji + '</span>' +
          '<span style="flex:1;min-width:0;">' +
            '<span style="display:block;font-size:15px;font-weight:800;color:#fff;letter-spacing:-0.1px;">' + lv.label + '</span>' +
            '<span style="display:block;font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);margin:2px 0 4px;">' + lv.hint + '</span>' +
            '<span style="display:block;font-size:12px;color:rgba(255,255,255,0.82);line-height:1.45;">' + lv.cta + '</span>' +
          '</span>' +
          '<span style="color:#E8591C;font-size:22px;flex-shrink:0;font-weight:900;">›</span>' +
        '</button>';
    }

    overlay.innerHTML =
      '<div style="max-width:420px;width:100%;padding:26px 22px;background:linear-gradient(145deg,#141824,#0f1420);border:1px solid rgba(232,89,28,0.4);border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:onbFadeIn 320ms cubic-bezier(0.34,1.56,0.64,1);">' +
        '<div style="text-align:center;margin-bottom:18px;">' +
          '<div style="width:72px;height:72px;margin:0 auto 12px;background:linear-gradient(135deg,#E8591C,#c0410e);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 8px 22px rgba(232,89,28,0.4);">👋</div>' +
          '<h2 style="margin:0 0 6px;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.3px;">¡Bienvenido, ' + firstName + '!</h2>' +
          '<p style="margin:0 0 4px;color:#E8591C;font-size:14px;font-weight:700;">¿Cuál es tu experiencia?</p>' +
          '<p style="margin:0;color:rgba(255,255,255,0.78);font-size:13px;line-height:1.55;">Vamos a personalizar la app según tu nivel. Así sabemos qué recomendarte — la app tiene herramientas para todos los niveles.</p>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">' + buttonsHtml + '</div>' +
        '<div style="text-align:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<button id="onbSkipBtn" style="background:transparent;border:none;color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;cursor:pointer;padding:8px 14px;border-radius:8px;-webkit-tap-highlight-color:transparent;">Ya conozco la app — saltar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var done = false;
    function finish(level) {
      if (done) return;
      done = true;
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 240ms cubic-bezier(0.32,0.72,0,1)';
      setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 260);
      if (typeof onDone === 'function') onDone(level);
    }

    var btns = overlay.querySelectorAll('.onb-level-btn');
    for (var j = 0; j < btns.length; j++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          finish(btn.getAttribute('data-level'));
        });
      })(btns[j]);
    }

    var skip = document.getElementById('onbSkipBtn');
    if (skip) skip.addEventListener('click', function() { finish(null); });
  }

  function _launchBigTour(chapterIdx) {
    function go() {
      if (typeof window.startAppTour === 'function') {
        setTimeout(function() {
          try { window.startAppTour({ chapterIdx: chapterIdx }); } catch(e) {
            console.warn('[OnboardingTour] startAppTour threw:', e && e.message);
          }
        }, 280);
      } else {
        console.warn('[OnboardingTour] startAppTour not available after load');
      }
    }
    if (typeof window.startAppTour === 'function') {
      go();
    } else if (window.MaestroLoader && typeof window.MaestroLoader.load === 'function') {
      window.MaestroLoader.load(['js/app-tour.js']).then(go).catch(function(e) {
        console.warn('[OnboardingTour] app-tour.js load failed:', e && e.message);
      });
    }
  }

  function startTourIfNeeded() {
    if (_getFlag(STORAGE_KEY)) return;
    if (_getFlag(ONBOARDED_KEY) === '1') return;

    _suppressLegacyWelcomeModal();

    setTimeout(function() {
      if (_getFlag(STORAGE_KEY)) return;
      _showLevelWelcome(function(level) {
        _setFlag(ONBOARDED_KEY, '1');
        if (level && LEVEL_CHAPTER[level] != null) {
          _setFlag(LEVEL_KEY, level);
          _setFlag(STORAGE_KEY, 'done');
          _launchBigTour(LEVEL_CHAPTER[level]);
        } else {
          _setFlag(STORAGE_KEY, 'skipped');
        }
      });
    }, 1200);
  }

  function restartTour() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    _suppressLegacyWelcomeModal();
    _showLevelWelcome(function(level) {
      if (level && LEVEL_CHAPTER[level] != null) {
        _setFlag(LEVEL_KEY, level);
        _setFlag(STORAGE_KEY, 'done');
        _launchBigTour(LEVEL_CHAPTER[level]);
      } else {
        _setFlag(STORAGE_KEY, 'skipped');
      }
    });
  }

  window.OnboardingTour = {
    startIfNeeded: startTourIfNeeded,
    restart: restartTour
  };

})();
