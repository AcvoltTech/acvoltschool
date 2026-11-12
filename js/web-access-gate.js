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

  // ── 12-nov-2026 · GRABACIONES DE ZOOM SIN ENLACES (MaestroZoomSeguro) ───────────────────────
  // Mario: «Ponles las clases así como les salen a los estudiantes presenciales, a TODOS los de las
  // membresías. No quiero los enlaces. Que no bajen nada ni hagan click en un enlace.»
  // El servidor (RPC zoom_mis_grabaciones, identidad = JWT) da la lista YA filtrada y SIN enlace:
  //   stream (uid de Cloudflare Stream) → se reproduce AQUÍ: video-token firma 2 h + iframe privado
  //                                        (el mismo mecanismo que abrirZoom del aula).
  //   pronto                            → «⏳ Disponible pronto». Nunca el enlace.
  // Nunca <a href> a zoom.us ni window.open para quien no es personal (staff:true sí ve «Abrir en Zoom»).
  // Compatibilidad: si la RPC no existe todavía (PGRST202 / 404) → estado 'viejo' y cada pantalla
  // sigue su camino de antes. Cualquier otro error → estado 'error' (la pantalla ofrece reintentar;
  // ley «nunca negar sin saber»: jamás una lista vacía muda como si no hubiera pagado).
  // Vive aquí porque este archivo se carga en TODAS las páginas (index.html) y lo usan también
  // js/crm/zoom-recordings.js y js/crm/zm-navigation.js (pantalla «Clases de Zoom»).
  var SB_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var STREAM_URL = 'https://customer-ehgr1pt7ma9kf78k.cloudflarestream.com/';

  function _enIngles() {
    try { if (global._lang === 'en' || global._lang === 'es') return global._lang === 'en'; } catch (_) {}
    return ((navigator.language || 'es').toLowerCase().indexOf('en') === 0);
  }

  function _rpcNoExiste(res) {
    var e = res && res.error;
    if (!e) return false;
    var code = String(e.code || '');
    return code === 'PGRST202' || code === '42883' || res.status === 404 || e.status === 404;
  }

  // Normaliza un objeto del servidor. Quien no es personal NUNCA conserva 'link' (aunque llegara).
  function _limpia(g, staff) {
    g = g || {};
    var uid = (typeof g.stream === 'string' && /^[A-Za-z0-9_-]{6,64}$/.test(g.stream)) ? g.stream : null;
    var o = {
      id: String(g.id == null ? '' : g.id),
      fecha: g.fecha || g.date || '',
      titulo: g.titulo || g.title || '',
      categoria: g.categoria || g.category || '',
      dia: g.dia || g.day_label || '',
      minutos: Number(g.minutos || g.duration_min) || 0,
      stream: uid,
      pronto: !uid
    };
    // alias de siempre para las pantallas viejas
    o.date = o.fecha; o.title = o.titulo; o.category = o.categoria; o.day_label = o.dia; o.duration_min = o.minutos;
    if (staff) {
      if (typeof g.link === 'string' && /^https:\/\//i.test(g.link)) o.link = g.link;
      if (Array.isArray(g.groups)) o.groups = g.groups;
      if (g.visible === false) o.visible = false;
    }
    return o;
  }

  // → Promise real que SIEMPRE resuelve:
  //   {estado:'nuevo', staff, grabaciones[]} | {estado:'viejo'} | {estado:'sin_sesion'} | {estado:'error', error}
  function cargarMisGrabaciones(sb) {
    return new Promise(function (resolve) {
      try {
        sb = sb || global.supabaseClient;
        if (!sb || !sb.rpc) { resolve({ estado: 'error', error: 'sin cliente de Supabase' }); return; }
        // NOTA: el builder de Supabase NO es Promise real — 2º arg de then(), nunca .catch().
        sb.rpc('zoom_mis_grabaciones', {}).then(function (res) {
          if (_rpcNoExiste(res)) { resolve({ estado: 'viejo' }); return; }
          if (res && res.error) { resolve({ estado: 'error', error: res.error }); return; }
          var d = res && res.data;
          if (typeof d === 'string') { try { d = JSON.parse(d); } catch (_) { d = null; } }
          if (!d || typeof d !== 'object') { resolve({ estado: 'error', error: 'respuesta vacía' }); return; }
          if (d.sesion === false) { resolve({ estado: 'sin_sesion' }); return; }
          var staff = d.staff === true;
          var lista = (Array.isArray(d.grabaciones) ? d.grabaciones : []).map(function (g) { return _limpia(g, staff); });
          resolve({ estado: 'nuevo', staff: staff, grabaciones: lista });
        }, function (err) {
          if (_rpcNoExiste({ error: err, status: err && err.status })) { resolve({ estado: 'viejo' }); return; }
          resolve({ estado: 'error', error: err });
        });
      } catch (e) { resolve({ estado: 'error', error: e }); }
    });
  }

  function _msg(caja, texto, reintentar, en) {
    caja.replaceChildren();
    var p = document.createElement('p');
    p.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'gap:12px;margin:0;padding:12px;text-align:center;color:#fff;font-size:15px;line-height:1.45;';
    p.appendChild(document.createTextNode(texto));
    if (reintentar) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = en ? 'Try again' : 'Intentar de nuevo';
      b.style.cssText = 'min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#efd180;color:#0f2342;font-weight:800;font-size:15px;cursor:pointer;';
      b.addEventListener('click', reintentar);
      p.appendChild(b);
    }
    caja.appendChild(p);
  }

  // Marca de agua: nombre o correo de la sesión, semitransparente, sin capturar clics, cambia de
  // lugar cada ~20 s. Disuasivo (no es DRM): si alguien graba la pantalla, se ve de quién es.
  function _marcaDeAgua(cont, quien) {
    var m = document.createElement('div');
    m.className = 'mh-zoom-marca';
    m.setAttribute('aria-hidden', 'true');
    m.textContent = quien;
    m.style.cssText = 'position:absolute;z-index:3;pointer-events:none;user-select:none;-webkit-user-select:none;' +
      'color:rgba(255,255,255,.38);font:700 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      'text-shadow:0 0 3px rgba(0,0,0,.65);white-space:nowrap;transform:rotate(-12deg);transition:left 1.2s,top 1.2s;';
    var mover = function () {
      m.style.left = (4 + Math.floor(Math.random() * 56)) + '%';
      m.style.top = (8 + Math.floor(Math.random() * 74)) + '%';
    };
    mover();
    cont.appendChild(m);
    var iv = setInterval(function () {
      if (!m.isConnected) { clearInterval(iv); return; }
      mover();
    }, 20000);
    return m;
  }

  // Pinta el reproductor dentro de 'caja' (se vacía). g = objeto de cargarMisGrabaciones.
  function reproducir(caja, g, opts) {
    opts = opts || {};
    var en = typeof opts.en === 'boolean' ? opts.en : _enIngles();
    if (!caja) return;
    caja.replaceChildren();
    var marco = document.createElement('div');
    marco.className = 'mh-zoom-marco';
    marco.style.cssText = 'position:relative;width:100%;padding-top:56.25%;background:#000;border-radius:10px;overflow:hidden;';
    caja.appendChild(marco);
    var otraVez = function () { reproducir(caja, g, opts); };

    if (!g || !g.stream) {
      _msg(marco, en ? '⏳ Available soon' : '⏳ Disponible pronto', null, en);
      return;
    }
    _msg(marco, en ? 'Checking your access…' : 'Comprobando tu acceso…', null, en);

    var sb = opts.sb || global.supabaseClient;
    if (!sb || !sb.auth || !sb.auth.getSession || typeof fetch !== 'function') {
      _msg(marco, en ? 'We could not open the video. Try again.' : 'No pudimos abrir el video. Intenta de nuevo.', otraVez, en);
      return;
    }
    sb.auth.getSession().then(function (s) {
      var ses = s && s.data && s.data.session;
      var tk = ses && ses.access_token;
      if (!tk) { _msg(marco, en ? 'Sign in to watch your class.' : 'Inicia sesión para ver tu clase.', otraVez, en); return; }
      var u = ses.user || {};
      var md = u.user_metadata || {};
      var quien = String(md.full_name || md.name || md.nombre || u.email || '').trim() || 'Maestro HVACR';
      if (u.email && quien !== u.email) quien += ' · ' + u.email;
      fetch(SB_URL + '/functions/v1/video-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk },
        body: JSON.stringify({ uid: g.stream })
      }).then(function (r) {
        return r.json().then(function (d) { return { r: r, d: d || {} }; }, function () { return { r: r, d: {} }; });
      }).then(function (x) {
        var d = x.d;
        if (!x.r.ok || typeof d.token !== 'string' || !/^[A-Za-z0-9_.-]+$/.test(d.token)) {
          // 503 = algo del servidor: reintentar. NUNCA decir «no pagaste» por un error.
          _msg(marco, d.error || (en ? 'We could not open the video. Try again.' : 'No pudimos abrir el video. Intenta de nuevo.'), otraVez, en);
          return;
        }
        if (!marco.isConnected) return; // lo cerraron o lo reemplazaron mientras cargaba
        var portada = STREAM_URL + d.token + '/thumbnails/thumbnail.jpg?time=180s&height=720';
        var f = document.createElement('iframe');
        f.title = g.titulo || g.title || 'Clase';
        // Pantalla completa: la del CONTENEDOR (así la marca de agua sigue encima). Solo si el
        // navegador no la soporta (iPhone) se deja la del reproductor.
        var fsCont = !!(marco.requestFullscreen || marco.webkitRequestFullscreen) && document.fullscreenEnabled !== false;
        f.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture' + (fsCont ? '' : '; fullscreen');
        f.allowFullscreen = !fsCont;
        f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        f.src = STREAM_URL + d.token + '/iframe?preload=auto' + (en ? '&defaultTextTrack=en' : '') + '&poster=' + encodeURIComponent(portada);
        marco.replaceChildren(f);
        _marcaDeAgua(marco, quien);
        if (fsCont) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = en ? '⛶ Full screen' : '⛶ Pantalla completa';
          b.style.cssText = 'margin-top:8px;min-height:40px;padding:0 14px;border:1px solid #d6dde8;border-radius:10px;background:#fff;color:#0f2342;font-weight:700;font-size:14px;cursor:pointer;';
          b.addEventListener('click', function () {
            try { (marco.requestFullscreen || marco.webkitRequestFullscreen).call(marco); } catch (e) { console.warn('[ZoomSeguro] pantalla completa:', (e && e.message) || e); }
          });
          caja.appendChild(b);
        }
      }, function (e) {
        console.warn('[ZoomSeguro] video-token falló:', (e && e.message) || e);
        _msg(marco, en ? 'We could not open the video. Check your connection and try again.' : 'No pudimos abrir el video. Revisa tu conexión e intenta de nuevo.', otraVez, en);
      });
    }, function (e) {
      console.warn('[ZoomSeguro] no se pudo leer la sesión:', (e && e.message) || e);
      _msg(marco, en ? 'We could not open the video. Try again.' : 'No pudimos abrir el video. Intenta de nuevo.', otraVez, en);
    });
  }

  global.MaestroZoomSeguro = { cargar: cargarMisGrabaciones, reproducir: reproducir, rpcNoExiste: _rpcNoExiste };

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
        out: 'Cerrar sesión',
        pronto: '⏳ Disponible pronto',
        retry: 'Intentar de nuevo',
        errNuevo: 'No pudimos cargar tus grabaciones. Intenta de nuevo.',
        zoomStaff: 'Abrir en Zoom (personal)',
        cerrar: '✕ Cerrar video',
        en: false
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
        out: 'Sign out',
        pronto: '⏳ Available soon',
        retry: 'Try again',
        errNuevo: 'We could not load your recordings. Please try again.',
        zoomStaff: 'Open in Zoom (staff)',
        cerrar: '✕ Close video',
        en: true
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
            '<section id="webGrabPlayer" hidden style="margin:0 0 16px;padding:12px;border-radius:14px;background:#0b1b33;color:#fff;">' +
              '<p class="web-grab-player-titulo" style="margin:0 0 8px;font-weight:800;font-size:15px;"></p>' +
              '<div class="web-grab-player-video"></div>' +
              '<button type="button" id="webGrabPlayerCerrar" style="margin-top:8px;min-height:40px;padding:0 14px;border:0;' +
                'border-radius:10px;background:#efd180;color:#0f2342;font-weight:800;font-size:14px;cursor:pointer;">' + t.cerrar + '</button>' +
            '</section>' +
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

      var cerrar = document.getElementById('webGrabPlayerCerrar');
      if (cerrar) cerrar.addEventListener('click', _cerrarReproductor);

      _cargarGrabaciones(t);
    } catch (e) { console.warn('[WebGate] pantalla de grabaciones:', (e && e.message) || e); }
  }

  // 12-nov-2026: primero la RPC segura (sin enlaces). Solo si NO existe todavía (ventana entre
  // publicar este código y aplicar el paso A en la base) se usa el camino viejo.
  function _cargarGrabaciones(t) {
    var list = document.getElementById('webGrabList');
    if (!list) return;
    var fail = function (msg, reintentar) {
      list.innerHTML = '<p style="margin:0;font-size:15px;color:#3d4d63;">' + _esc(msg) + '</p>';
      if (reintentar) {
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'webGrabRetry';
        b.textContent = t.retry;
        b.style.cssText = 'align-self:flex-start;min-height:44px;padding:0 18px;border:0;border-radius:10px;' +
          'background:#0f2342;color:#fff;font-weight:700;font-size:15px;cursor:pointer;';
        b.addEventListener('click', function () { _cargarGrabaciones(t); });
        list.appendChild(b);
      }
    };
    list.innerHTML = '<p style="margin:0;font-size:15px;color:#3d4d63;">' + _esc(t.loading) + '</p>';
    var Z = global.MaestroZoomSeguro;
    try {
      Z.cargar(global.supabaseClient).then(function (r) {
        if (r.estado === 'viejo') { _cargarGrabacionesViejo(t, list, fail); return; }
        if (r.estado !== 'nuevo') {
          console.warn('[WebGate] zoom_mis_grabaciones:', r.estado, (r.error && (r.error.message || r.error.code)) || r.error || '');
          fail(t.errNuevo, true);
          return;
        }
        _pintarGrabaciones(t, list, r);
      });
    } catch (e) {
      console.warn('[WebGate] no se pudieron cargar las grabaciones:', (e && e.message) || e);
      fail(t.errNuevo, true);
    }
  }

  function _pintarGrabaciones(t, list, r) {
    var mias = r.grabaciones.filter(function (g) { return g && g.visible !== false; })
      .sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
    if (!mias.length) { list.innerHTML = '<p style="margin:0;font-size:15px;color:#3d4d63;">' + _esc(t.empty) + '</p>'; return; }
    list.replaceChildren();
    mias.forEach(function (g) {
      var fila = document.createElement('div');
      fila.className = 'web-grab-fila';
      fila.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:12px;background:#fff;border:1px solid #d6dde8;' +
        'border-radius:12px;padding:12px 14px;';
      fila.innerHTML =
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:15px;font-weight:700;color:#0f2342;">' + _esc(g.dia) + ' ' + _esc(g.fecha) + '</div>' +
          '<div style="font-size:13px;color:#5b6b82;">' + _esc(g.categoria || g.titulo) +
            (g.minutos ? ' · ' + _esc(g.minutos) + ' ' + t.min : '') + '</div>' +
        '</div>';
      if (g.stream) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'web-grab-ver';
        b.textContent = '▶ ' + t.ver;
        b.style.cssText = 'flex:none;min-height:44px;padding:0 16px;background:#0f2342;color:#fff;border:0;border-radius:10px;' +
          'font-weight:700;font-size:14px;cursor:pointer;';
        b.addEventListener('click', function () { _abrirEnPagina(t, g); });
        fila.appendChild(b);
      } else {
        var s = document.createElement('span');
        s.className = 'web-grab-pronto';
        s.textContent = t.pronto;
        s.style.cssText = 'flex:none;padding:8px 12px;background:#fff7e0;color:#7a5a00;border-radius:10px;font-weight:700;font-size:14px;';
        fila.appendChild(s);
      }
      // Solo el PERSONAL (staff:true, lo decide el servidor) conserva el botón a Zoom.
      if (r.staff && g.link) {
        var a = document.createElement('a');
        a.href = g.link; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = t.zoomStaff;
        a.style.cssText = 'flex:none;font-size:13px;color:#0b5cff;';
        fila.appendChild(a);
      }
      list.appendChild(fila);
    });
  }

  function _abrirEnPagina(t, g) {
    var box = document.getElementById('webGrabPlayer');
    if (!box) return;
    box.hidden = false;
    box.querySelector('.web-grab-player-titulo').textContent = '🎥 ' + [g.dia, g.fecha, g.categoria || g.titulo].filter(Boolean).join(' · ');
    global.MaestroZoomSeguro.reproducir(box.querySelector('.web-grab-player-video'), g, { en: t.en });
    try { box.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { console.warn('[WebGate] scroll:', (e && e.message) || e); }
  }

  function _cerrarReproductor() {
    var box = document.getElementById('webGrabPlayer');
    if (!box) return;
    box.querySelector('.web-grab-player-video').replaceChildren();
    box.hidden = true;
  }

  // Camino de ANTES (2-nov): solo mientras la RPC zoom_mis_grabaciones no exista en la base.
  function _cargarGrabacionesViejo(t, list, fail) {
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
            if (r && r.error) { fail(t.err, true); return; }
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
          }, function () { fail(t.err, true); });
        }, function () { fail(t.err, true); });
      }, function () { fail(t.err, true); });
    } catch (e) {
      console.warn('[WebGate] camino viejo de grabaciones:', (e && e.message) || e);
      fail(t.err, true);
    }
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
