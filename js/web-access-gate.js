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

  // ── 2-nov-2026 · MODO «SOLO GRABACIONES» ─────────────────────────────────────────────
  // Mario: la membresía vieja de Stripe ($99–$119, etiqueta membresia_119) ve SOLO las
  // grabaciones de sáb/dom 7–11 AM. Ni cursos, ni herramientas, ni app. Para todo lo demás:
  // los $149.99. El servidor decide (web_access_check → modo:'solo_grabaciones'); aquí se
  // pinta una pantalla completa con SUS grabaciones (las que traen una etiqueta suya).
  var GRAB_ID = 'webGrabacionesModal';
  var COMPRA_URL = 'https://maestrohvacr.com/estudiar';

  function _removeGrab() {
    try { var m = document.getElementById(GRAB_ID); if (m) m.remove(); } catch (_) {}
  }

  function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function _showGrabaciones() {
    try {
      _removeWall();
      if (document.getElementById(GRAB_ID)) return;
      var es = ((navigator.language || 'es').toLowerCase().indexOf('en') !== 0);
      var t = es ? {
        title: 'Tus clases grabadas',
        sub: 'Sábado y domingo · 7 a 11 AM',
        loading: 'Cargando tus clases…',
        empty: 'Todavía no hay clases grabadas para tu membresía.',
        err: 'No se pudieron cargar las clases. Revisa tu conexión y vuelve a intentar.',
        ver: 'Ver clase',
        min: 'min',
        upTitle: '¿Quieres todo?',
        upBody: 'Cursos completos, herramientas, la app y clases en vivo: $149.99 al mes.',
        upBtn: 'Ver el acceso completo',
        out: 'Cerrar sesión'
      } : {
        title: 'Your recorded classes',
        sub: 'Saturday & Sunday · 7 to 11 AM',
        loading: 'Loading your classes…',
        empty: 'There are no recorded classes for your membership yet.',
        err: 'Classes could not be loaded. Check your connection and try again.',
        ver: 'Watch class',
        min: 'min',
        upTitle: 'Want everything?',
        upBody: 'Full courses, tools, the app and live classes: $149.99 per month.',
        upBtn: 'See full access',
        out: 'Sign out'
      };

      var d = document.createElement('div');
      d.id = GRAB_ID;
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-modal', 'true');
      d.setAttribute('aria-labelledby', 'webGrabTitle');
      d.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#0f2342;overflow:auto;' +
        'padding:24px 16px;box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
      d.innerHTML =
        '<div style="max-width:640px;margin:0 auto;">' +
          '<div style="background:#f4f6f9;border-radius:18px;padding:24px 20px;box-shadow:0 24px 60px rgba(0,0,0,.45);">' +
            '<h2 id="webGrabTitle" style="margin:0 0 4px;font-size:23px;font-weight:800;color:#0f2342;">🎥 ' + t.title + '</h2>' +
            '<p style="margin:0 0 18px;font-size:15px;color:#3d4d63;">' + t.sub + '</p>' +
            '<div id="webGrabList" style="display:flex;flex-direction:column;gap:10px;">' +
              '<p style="margin:0;font-size:15px;color:#3d4d63;">' + t.loading + '</p>' +
            '</div>' +
          '</div>' +
          '<div style="background:#efd180;border-radius:18px;padding:20px;margin-top:16px;text-align:center;">' +
            '<div style="font-size:19px;font-weight:800;color:#0f2342;margin-bottom:6px;">' + t.upTitle + '</div>' +
            '<p style="margin:0 0 14px;font-size:15px;line-height:1.5;color:#0f2342;">' + t.upBody + '</p>' +
            '<a href="' + COMPRA_URL + '" target="_blank" rel="noopener" style="display:inline-block;min-height:48px;' +
              'line-height:48px;padding:0 24px;background:#0f2342;color:#fff;text-decoration:none;border-radius:12px;' +
              'font-weight:800;font-size:16px;">' + t.upBtn + '</a>' +
          '</div>' +
          '<div style="text-align:center;margin-top:14px;">' +
            '<button id="webGrabSignOut" style="background:none;border:none;color:#e2e8f0;font-size:14px;' +
              'text-decoration:underline;cursor:pointer;padding:10px;">' + t.out + '</button>' +
          '</div>' +
        '</div>';
      (document.body || document.documentElement).appendChild(d);
      document.documentElement.style.overflow = 'hidden';
      if (document.body) document.body.style.overflow = 'hidden';

      var btn = document.getElementById('webGrabSignOut');
      if (btn) btn.addEventListener('click', function () {
        try { var sb = global.supabaseClient; if (sb && sb.auth && sb.auth.signOut) sb.auth.signOut(); } catch (_) {}
        try { location.reload(); } catch (_) {}
      });

      _cargarGrabaciones(t);
    } catch (_) {}
  }

  function _cargarGrabaciones(t) {
    var list = document.getElementById('webGrabList');
    var fail = function (msg) {
      if (list) list.innerHTML = '<p style="margin:0;font-size:15px;color:#3d4d63;">' + msg + '</p>';
    };
    try {
      var sb = global.supabaseClient;
      sb.auth.getSession().then(function (s) {
        var email = s && s.data && s.data.session && s.data.session.user && s.data.session.user.email;
        if (!email) { fail(t.err); return; }
        // NOTA: el builder de Supabase NO es Promise real — 2º arg de then(), nunca .catch().
        sb.rpc('crm_mis_grupos', { p_email: email.toLowerCase() }).then(function (g) {
          var mis = g && g.data;
          if (typeof mis === 'string') { try { mis = JSON.parse(mis); } catch (_) { mis = []; } }
          if (!Array.isArray(mis)) mis = [];
          sb.from('zoom_recordings').select('data').eq('id', 'master').maybeSingle().then(function (r) {
            var recs = [];
            try {
              var raw = r && r.data && r.data.data;
              recs = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
            } catch (_) { recs = []; }
            if (r && r.error) { fail(t.err); return; }
            var mias = recs.filter(function (e) {
              if (!e || !e.link || e.visible === false) return false;
              var gs = Array.isArray(e.groups) ? e.groups : [];
              for (var i = 0; i < gs.length; i++) if (mis.indexOf(gs[i]) !== -1) return true;
              return false;
            }).sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
            if (!mias.length) { fail(t.empty); return; }
            list.innerHTML = mias.map(function (e) {
              var link = /^https:\/\//i.test(e.link) ? e.link : '#';
              return '<div style="display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #d6dde8;' +
                'border-radius:12px;padding:12px 14px;">' +
                  '<div style="flex:1;min-width:0;">' +
                    '<div style="font-size:15px;font-weight:700;color:#0f2342;">' + _esc(e.day_label || '') + ' ' + _esc(e.date || '') + '</div>' +
                    '<div style="font-size:13px;color:#5b6b82;">' + _esc(e.category || '') +
                      (e.duration_min ? ' · ' + _esc(e.duration_min) + ' ' + t.min : '') + '</div>' +
                  '</div>' +
                  '<a href="' + _esc(link) + '" target="_blank" rel="noopener" style="flex:none;min-height:44px;line-height:44px;' +
                    'padding:0 16px;background:#0f2342;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;' +
                    'font-size:14px;">' + t.ver + '</a>' +
                '</div>';
            }).join('');
          }, function () { fail(t.err); });
        }, function () { fail(t.err); });
      }, function () { fail(t.err); });
    } catch (_) { fail(t.err); }
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
          if (!d) {                             // respuesta rara → no bloquear
            console.warn('[WebGate] web_access_check no devolvió datos: se deja pasar (fail-open)', res && res.error);
            return;
          }
          if (d.access === true && d.modo === 'solo_grabaciones') { _showGrabaciones(); return; }
          if (d.access === true) { _removeWall(); _removeGrab(); return; }
          _removeGrab();
          _showWall();
        }, function (err) {
          // Fallo de red/RPC → NO bloquear. Se reintenta al próximo arranque.
          // 🔴 Fail-open A PROPÓSITO (ley: un candado nunca niega cuando la verdad
          // es "todavía no sé"). Pero antes era MUDO: desde afuera, "el muro dejó
          // pasar" y "el muro nunca corrió" se veían idénticos, así que un candado
          // caído podía llevar semanas sin que nadie lo notara. Ahora se oye.
          console.warn('[WebGate] no se pudo consultar web_access_check: se deja pasar (fail-open) —', (err && err.message) || err);
        });
      }, function (err) {
        console.warn('[WebGate] no se pudo leer la sesión: se deja pasar (fail-open) —', (err && err.message) || err);
      });
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
  document.addEventListener('maestroac:signed-out', function () { _checked = false; _removeWall(); _removeGrab(); });
})(window);
