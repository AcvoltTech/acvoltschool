/**
 * Web Access Gate v1.0 — acvoltschool.com
 *
 * Mario 2026-07-20: "solo los que pagan, si no no entran."
 *
 * ENTRA quien: paga por CUALQUIER vía (Stripe web o compra IAP de Apple/Google),
 * tiene un token de escuela vigente, o es admin/staff. Todos los demás ven el muro.
 *
 * La decisión es SIEMPRE del servidor (`web_access_check`, SECURITY DEFINER, lee el email
 * del JWT) — el navegador no puede falsificarla. Aquí solo se pinta el resultado.
 *
 * El muro empuja a la APP (opción A de Mario): se cobra por Apple/Google vía RevenueCat,
 * NO por Stripe en la web. Ver regla "TODO por la app + RevenueCat, NADA por Stripe".
 *
 * REGLA DURA: un fallo de red NUNCA bloquea. Si el RPC truena, se deja pasar y se
 * reintenta en el próximo arranque. Preferimos que se cuele uno a sacar a quien paga.
 */
(function (global) {
  'use strict';

  var MODAL_ID = 'webAccessGateModal';
  var IOS_URL = 'https://apps.apple.com/app/id6761862324';
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.maestromario.twa';
  var _checked = false;

  // Solo aplica en la web de escritorio/móvil. Dentro de la app nativa el gate
  // es premium-gate.js (eje IAP) — aquí no debemos meternos o saldría doble muro.
  function _isNativeShell() {
    try {
      if (global.__IS_NATIVE_APP === true) return true;
      var ua = navigator.userAgent || '';
      if (/MaestroHVACR/i.test(ua)) return true;                 // WKWebView iOS
      if (global.AndroidIAP || global.RevenueCatBridge) return true; // puente Android
      return false;
    } catch (_) { return false; }
  }

  function _removeWall() {
    try {
      var m = document.getElementById(MODAL_ID);
      if (m) m.remove();
      document.documentElement.style.overflow = '';
      if (document.body) document.body.style.overflow = '';
    } catch (_) {}
  }

  function _showWall() {
    try {
      if (document.getElementById(MODAL_ID)) return; // ya está puesto
      var esFirst = ((navigator.language || 'es').toLowerCase().indexOf('en') !== 0);
      var t = esFirst ? {
        title: 'Tu acceso está en la app',
        body: 'Maestro HVACR ahora vive en la app. Descárgala e inicia sesión con este mismo correo para entrar a tus herramientas, cursos y certificaciones.',
        note: '¿Ya pagas o eres alumno de la escuela? Entra con el mismo correo y se desbloquea solo.',
        ios: 'Descargar para iPhone',
        play: 'Descargar para Android',
        out: 'Cerrar sesión'
      } : {
        title: 'Your access is in the app',
        body: 'Maestro HVACR now lives in the app. Download it and sign in with this same email to reach your tools, courses and certifications.',
        note: 'Already paying, or a school student? Sign in with the same email and it unlocks automatically.',
        ios: 'Download for iPhone',
        play: 'Download for Android',
        out: 'Sign out'
      };

      var d = document.createElement('div');
      d.id = MODAL_ID;
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-modal', 'true');
      // Fondo OPACO (no rgba) — en iOS un fondo translúcido deja ver el dashboard
      // animándose atrás y se repinta mal. Ver [[feedback_legibility_js_dark_screens]].
      d.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#0f2342;' +
        'display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto;';
      d.innerHTML =
        '<div style="max-width:480px;width:100%;background:#f4f6f9;border-radius:18px;padding:32px 26px;' +
        'box-shadow:0 24px 60px rgba(0,0,0,.45);text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">' +
          '<div style="font-size:46px;line-height:1;margin-bottom:14px;">🔒</div>' +
          '<h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#0f2342;">' + t.title + '</h2>' +
          '<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#3d4d63;">' + t.body + '</p>' +
          '<a href="' + IOS_URL + '" target="_blank" rel="noopener" style="display:block;margin:0 0 10px;padding:14px;' +
            'background:#0f2342;color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;">' + t.ios + '</a>' +
          '<a href="' + PLAY_URL + '" target="_blank" rel="noopener" style="display:block;margin:0 0 18px;padding:14px;' +
            'background:#c9a14a;color:#0f2342;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;">' + t.play + '</a>' +
          '<p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#5b6b82;">' + t.note + '</p>' +
          '<button id="webGateSignOut" style="background:none;border:none;color:#5b6b82;font-size:13px;' +
            'text-decoration:underline;cursor:pointer;padding:6px;">' + t.out + '</button>' +
        '</div>';
      (document.body || document.documentElement).appendChild(d);
      document.documentElement.style.overflow = 'hidden';
      if (document.body) document.body.style.overflow = 'hidden';

      var btn = document.getElementById('webGateSignOut');
      if (btn) btn.addEventListener('click', function () {
        try {
          var sb = global.supabaseClient;
          if (sb && sb.auth && sb.auth.signOut) sb.auth.signOut();
        } catch (_) {}
        try { location.reload(); } catch (_) {}
      });
    } catch (_) {}
  }

  function check(force) {
    try {
      if (_checked && !force) return;
      if (_isNativeShell()) { _checked = true; return; }
      var sb = global.supabaseClient;
      if (!sb || !sb.rpc || !sb.auth || !sb.auth.getSession) return; // cliente aún no listo

      // NOTA: el builder de Supabase NO es Promise real — nunca .catch(), 2º arg de then().
      sb.auth.getSession().then(function (s) {
        var hasSession = !!(s && s.data && s.data.session);
        if (!hasSession) return; // sin sesión, la pantalla de login ya manda

        sb.rpc('web_access_check').then(function (res) {
          _checked = true;
          var d = res && res.data;
          if (!d) return;                       // respuesta rara → no bloquear
          if (d.access === true) { _removeWall(); return; }
          _showWall();
        }, function () {
          // Fallo de red/RPC → NO bloquear. Se reintenta al próximo arranque.
        });
      }, function () {});
    } catch (_) {}
  }

  global.MaestroWebGate = { check: check, showWall: _showWall, removeWall: _removeWall };

  // Revisar al cargar y en cada cambio de sesión (login / cambio de cuenta).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { check(); });
  } else {
    check();
  }
  document.addEventListener('maestroac:signed-in', function () { _checked = false; check(true); });
  document.addEventListener('maestroac:signed-out', function () { _checked = false; _removeWall(); });
})(window);
