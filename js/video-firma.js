/* ============================================================================
 * video-firma.js — pide a Cloudflare una URL FIRMADA para los videos del curso
 * ----------------------------------------------------------------------------
 * POR QUÉ EXISTE (Mario 2026-08-17, "plan B"):
 * Se midió que `acvolt_lessons` era legible SIN CUENTA y soltaba el `stream_uid` de 394 videos,
 * y que ese uid **reproducía directo** en `videodelivery.net/<uid>/manifest/video.m3u8` (HTTP 200).
 * Cerrar la tabla cortó al anónimo, pero el registrado gratis todavía puede leer los uid.
 * La única forma de matarlo de raíz es que el uid NO BASTE.
 *
 * CÓMO: la edge `video-token` verifica la sesión y el derecho, y devuelve un token firmado de
 * Cloudflare. La URL de reproducción usa **el token en lugar del uid**, así que un uid suelto
 * ya no sirve para nada.
 *
 * 🔴 EL RESPALDO "UID PELÓN" SE MURIÓ (9-sep-2026). Antes, si la firma fallaba se devolvía el
 * uid crudo: era seguro MIENTRAS `requireSignedURLs` estuviera apagado. **Esa premisa ya es
 * falsa**: la migración copia cada video con `requireSignedURLs: true`. Devolver el uid hoy no
 * rescata a nadie — garantiza un iframe NEGRO y MUDO, que es peor que un error.
 * Ahora se devuelve '' y se guarda el PORQUÉ, para que quien reproduce lo pueda decir.
 *
 * ========================================================================== */
(function (global) {
  'use strict';

  // 🪤 Este archivo va DENTRO del bundle tier0 (ver scripts/build.js), justo
  // después de config.js, así que ve su `const SUPABASE_KEY` por ámbito. En el
  // app grande esas mismas constantes sí son globales; el `typeof` cubre los dos.
  var SB_URL = (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) ||
               global.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
  var SB_KEY = (typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY) ||
               global.SUPABASE_KEY || '';
  var ENDPOINT = SB_URL + '/functions/v1/video-token';

  // Un token dura 2 h; se guarda en memoria 100 min para no pedirlo en cada toque.
  var VIDA_MS = 100 * 60 * 1000;
  var cache = {};   // uid -> { token, ts }

  // El porqué de la última falla, por uid. Sin esto, un negro no se puede diagnosticar.
  var falla = {};
  function _falla(uid, porque) { falla[uid] = porque; try { console.warn('[firma]', uid, porque); } catch (_) {} return ''; }
  function ultimaFalla(uid) { return uid ? (falla[String(uid)] || '') : (falla[Object.keys(falla).pop()] || ''); }

  // 🪤 ARRANQUE EN FRÍO: en WKWebView, abrir un video justo al abrir el app cae aquí antes de
  // que Supabase haya restaurado la sesión. Antes eso devolvía '' de inmediato → uid pelón →
  // negro. Ahora se espera un poco: la sesión suele llegar en menos de un segundo.
  function _sesionConEspera(msTotal) {
    var fin = Date.now() + (msTotal || 3000);
    function intentar() {
      return _sesion().then(function (tok) {
        if (tok || Date.now() > fin) return tok;
        return new Promise(function (ok) { setTimeout(ok, 250); }).then(intentar);
      });
    }
    return intentar();
  }

  function _sesion() {
    try {
      if (global.supabaseClient && global.supabaseClient.auth && global.supabaseClient.auth.getSession) {
        return global.supabaseClient.auth.getSession()
          .then(function (r) { return (r && r.data && r.data.session && r.data.session.access_token) || ''; })
          .catch(function () { return ''; });
      }
    } catch (_) {}
    return Promise.resolve('');
  }

  /**
   * Devuelve una promesa con el identificador que va en la URL de Cloudflare:
   * el TOKEN firmado si se pudo, o el uid pelón como respaldo (ver nota de arriba).
   */
  function idParaUrl(uid) {
    uid = String(uid || '').trim();
    if (!uid) return Promise.resolve('');
    // 🪤 La edge exige 32 hex. Un uid con otra forma da 400 y antes se servía igual → negro.
    if (!/^[a-f0-9]{32}$/i.test(uid)) {
      return Promise.resolve(_falla(uid, 'el uid del video no tiene forma de uid de Cloudflare'));
    }

    var c = cache[uid];
    if (c && (Date.now() - c.ts) < VIDA_MS) return Promise.resolve(c.token);

    return _sesionConEspera(3000).then(function (tok) {
      if (!tok) return _falla(uid, 'no hay sesión iniciada (o todavía no cargaba)');
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': 'Bearer ' + tok },
        body: JSON.stringify({ uid: uid }),
      })
        .then(function (r) {
          if (r.ok) return r.json();
          if (r.status === 402) return { _no: 'tu cuenta no tiene acceso a este video (402)' };
          if (r.status === 401) return { _no: 'la sesión no sirvió para firmar (401)' };
          return { _no: 'el servidor de firma respondió ' + r.status };
        })
        .then(function (j) {
          if (j && j.token) { cache[uid] = { token: j.token, ts: Date.now() }; return j.token; }
          return _falla(uid, (j && j._no) || 'el servidor no devolvió token');
        })
        .catch(function (e) { return _falla(uid, 'no se pudo hablar con el firmador: ' + ((e && e.message) || '?')); });
    }).catch(function (e) { return _falla(uid, (e && e.message) || 'error al firmar'); });
  }

  /** Arma la URL del iframe ya firmada. */
  function urlIframe(uid) {
    return idParaUrl(uid).then(function (id) {
      return id ? ('https://iframe.videodelivery.net/' + encodeURIComponent(id)) : '';
    });
  }

  /** Pinta el iframe dentro de un contenedor, ya con la URL firmada. */
  function montarIframe(contenedor, uid, estilo) {
    if (!contenedor) return Promise.resolve(false);
    return urlIframe(uid).then(function (src) {
      if (!src) return false;
      var f = document.createElement('iframe');
      f.src = src;
      f.setAttribute('allow', 'accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen');
      f.setAttribute('allowfullscreen', '');
      f.style.cssText = estilo || 'border:none;width:100%;aspect-ratio:16/9;border-radius:12px;';
      contenedor.innerHTML = '';
      contenedor.appendChild(f);
      return true;
    });
  }

  /**
   * Rellena el `src` de los iframes que quedaron marcados con `data-vf-uid`.
   *
   * 🪤 Por qué así y no armando la URL de una: los dos lugares que reproducen lecciones
   * (`acvolt-certification.js` y `curso-videos.js`) construyen su HTML como TEXTO, de golpe y
   * en forma síncrona. Pedir la firma es asíncrono. Reestructurar esos dos flujos completos
   * era mucho más riesgo que dejar el iframe marcado y llenarle el `src` en cuanto llega el
   * token — el reproductor ni se entera, y si algo falla el respaldo entra solo.
   */
  function firmarPendientes(raiz) {
    var scope = raiz || document;
    var pend = scope.querySelectorAll('iframe[data-vf-uid]');
    for (var i = 0; i < pend.length; i++) {
      (function (el) {
        var uid = el.getAttribute('data-vf-uid');
        el.removeAttribute('data-vf-uid');           // que no se pida dos veces
        urlIframe(uid).then(function (src) {
          if (src) { el.src = src; return; }
          // 🔴 Ya no se deja el iframe mudo: se avisa con el porqué, para que el
          // reproductor lo muestre en vez de un rectángulo negro.
          try {
            global.dispatchEvent(new CustomEvent('maestro:firma-fallo', {
              detail: { uid: uid, porque: ultimaFalla(uid), iframe: el }
            }));
          } catch (_) {}
        });
      })(pend[i]);
    }
    return pend.length;
  }

  global.MaestroVideoFirma = {
    idParaUrl: idParaUrl, urlIframe: urlIframe,
    montarIframe: montarIframe, firmarPendientes: firmarPendientes,
    ultimaFalla: ultimaFalla,
    // para el chequeo: pide un token DE VERDAD y dice si se pudo
    probar: function (uid) {
      return idParaUrl(uid).then(function (id) {
        return { ok: !!id && id !== uid, porque: ultimaFalla(uid) };
      });
    },
  };
})(window);
