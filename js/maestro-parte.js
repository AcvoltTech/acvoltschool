// maestro-parte.js — EL PARTE MATUTINO, HABLADO.
//
// Mario (9-sep-2026): *"que temprano en la mañana me levante y me diga hola
// Mario qué hacemos hoy, yo le diga genérame el reporte de mi app y dime las
// zonas muertas, las zonas con actividad, las zonas en peligro de falla y las
// zonas fallando, pero que todo sea con box... en mi casa tengo 4 pantallas...
// yo quiero que sea hablado sin tener que yo escribir"*.
//
// CÓMO ESTÁ HECHO, y por qué así:
//  · Los datos salen de lo que la app YA mide: la vista `v_zonas_resumen`
//    (entradas, técnicos, segundos, rebote, "hizo algo") y `get_error_logs`.
//    Nada inventado, nada estimado.
//  · Las zonas MUERTAS no salen de la vista —una zona sin entradas no tiene
//    fila—. Se sacan restando: las declaradas menos las que aparecen.
//  · Habla con la voz del navegador (`speechSynthesis`, es-MX) y escucha con
//    el mismo dictado que ya funciona en el curso de inglés.
//  · Las cajas están hechas para PANTALLA GRANDE: `clamp()` en todo, cuatro
//    columnas en monitor y una en teléfono.
(function (global) {
  'use strict';

  var ID = 'maestroParteOv';
  var TINTA = '#0b1326', CREMA = '#fff6e0', SOL = '#ffc43d';

  // ── CÓMO SE CLASIFICA UNA ZONA (reglas, no corazonadas) ──────────────────
  // 🪤 Estos números se pueden discutir, pero tienen que estar ESCRITOS: un
  // tablero que clasifica "a ojo" no se puede auditar ni corregir.
  var REGLA = {
    reboteAlto: 60,      // % que entra y se sale sin hacer nada
    hizoAlgoBajo: 15,    // % que sí hizo algo adentro
    segundosCorto: 12    // menos de esto es "ni alcanzó a ver qué era"
  };

  function _zonasDeclaradas() {
    try {
      if (global.ZonaRastro && global.ZonaRastro.ZONAS) return global.ZonaRastro.ZONAS;
    } catch (_) {}
    return [];
  }

  function _sb() { return global.supabaseClient || null; }

  // ── LOS DATOS ────────────────────────────────────────────────────────────
  function datos(dias) {
    dias = dias || 7;
    var sb = _sb();
    if (!sb) return Promise.reject(new Error('sin conexión a la base'));
    var desde = new Date(Date.now() - dias * 86400000).toISOString();

    return Promise.all([
      sb.from('v_zonas_resumen').select('*'),
      sb.rpc('get_error_logs', { p_since: new Date(Date.now() - 86400000).toISOString() })
    ]).then(function (r) {
      var vista = r[0], errs = r[1];
      // 🪤 supabase-js NO truena: el error viene en `.error`. Si esto se
      // ignorara, el parte diría "todo bien" con la base caída.
      if (vista && vista.error) throw new Error('no se pudo leer las zonas: ' + vista.error.message);
      var filas = (vista && vista.data) || [];
      var errores = (errs && !errs.error && errs.data) || [];

      var porZona = {};
      filas.forEach(function (f) { if (f.zona) porZona[f.zona] = f; });

      // errores de las últimas 24 h, contados por zona mencionada
      var fallasPorZona = {}, fallasGenerales = [];
      errores.forEach(function (e) {
        var txt = ((e.message || '') + ' ' + JSON.stringify(e.metadata || {})).toLowerCase();
        var pegó = false;
        _zonasDeclaradas().forEach(function (z) {
          if (txt.indexOf(z.id) >= 0) { fallasPorZona[z.id] = (fallasPorZona[z.id] || 0) + 1; pegó = true; }
        });
        if (!pegó) fallasGenerales.push(e.message || '');
      });

      var muertas = [], vivas = [], peligro = [], fallando = [];
      _zonasDeclaradas().forEach(function (z) {
        var f = porZona[z.id];
        var nom = z.es || z.id;
        if (fallasPorZona[z.id]) {
          fallando.push({ zona: nom, id: z.id, nota: fallasPorZona[z.id] + ' errores en 24 h',
                          entradas: f ? f.entradas : 0 });
          return;
        }
        if (!f || !f.entradas) { muertas.push({ zona: nom, id: z.id, nota: 'nadie entró en ' + dias + ' días' }); return; }
        var razones = [];
        if (f.pct_rebote !== null && f.pct_rebote >= REGLA.reboteAlto) razones.push(f.pct_rebote + '% se sale sin hacer nada');
        if (f.pct_hizo_algo !== null && f.pct_hizo_algo <= REGLA.hizoAlgoBajo) razones.push('solo ' + f.pct_hizo_algo + '% hace algo');
        if (f.segundos_promedio !== null && f.segundos_promedio < REGLA.segundosCorto) razones.push('aguantan ' + f.segundos_promedio + ' segundos');
        var base = { zona: nom, id: z.id, entradas: f.entradas, tecnicos: f.tecnicos,
                     segundos: f.segundos_promedio, rebote: f.pct_rebote, hizoAlgo: f.pct_hizo_algo };
        if (razones.length) { base.nota = razones.join(' · '); peligro.push(base); }
        else { base.nota = f.tecnicos + ' técnicos · ' + f.entradas + ' entradas'; vivas.push(base); }
      });

      return { dias: dias, muertas: muertas, vivas: vivas, peligro: peligro,
               fallando: fallando, otrosErrores: fallasGenerales.slice(0, 5),
               totalErrores: errores.length };
    });
  }

  // ── LO QUE SE DICE EN VOZ ALTA ───────────────────────────────────────────
  function guion(d) {
    var p = [];
    p.push('Buenos días Mario. Aquí está el parte de tu app.');
    if (d.fallando.length) {
      p.push('Tienes ' + d.fallando.length + (d.fallando.length === 1 ? ' zona fallando: ' : ' zonas fallando: ') +
             d.fallando.map(function (z) { return z.zona; }).join(', ') + '.');
    } else {
      p.push('Ninguna zona está fallando.');
    }
    if (d.peligro.length) {
      p.push(d.peligro.length + (d.peligro.length === 1 ? ' zona está en peligro: ' : ' zonas están en peligro: ') +
             d.peligro.map(function (z) { return z.zona + ', porque ' + z.nota; }).join('; ') + '.');
    }
    if (d.muertas.length) {
      p.push(d.muertas.length + (d.muertas.length === 1 ? ' zona muerta: ' : ' zonas muertas: ') +
             d.muertas.map(function (z) { return z.zona; }).join(', ') +
             '. Ahí nadie entró en ' + d.dias + ' días.');
    }
    if (d.vivas.length) {
      var top = d.vivas.slice(0, 3).map(function (z) { return z.zona + ' con ' + z.tecnicos + ' técnicos'; });
      p.push('Con actividad sana: ' + d.vivas.length + ' zonas. Las que más jalan: ' + top.join(', ') + '.');
    }
    p.push('Es todo. ¿Qué hacemos hoy?');
    return p.join(' ');
  }

  // ── LA VOZ ───────────────────────────────────────────────────────────────
  var _hablando = false;
  function hablar(txt) {
    try {
      if (!global.speechSynthesis) return false;
      global.speechSynthesis.cancel();
      var u = new global.SpeechSynthesisUtterance(txt);
      u.lang = 'es-MX'; u.rate = 1.0; u.pitch = 1.0;
      // 🪤 La voz en español no siempre es la primera: se busca a propósito.
      var vs = global.speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++) {
        if (/es[-_]MX/i.test(vs[i].lang)) { u.voice = vs[i]; break; }
        if (/^es/i.test(vs[i].lang) && !u.voice) u.voice = vs[i];
      }
      _hablando = true;
      u.onend = function () { _hablando = false; _pinta(); };
      global.speechSynthesis.speak(u);
      return true;
    } catch (_) { _hablando = false; return false; }
  }
  function callar() { try { global.speechSynthesis.cancel(); } catch (_) {} _hablando = false; _pinta(); }

  // ── EL OÍDO ──────────────────────────────────────────────────────────────
  var _rec = null, _oyendo = false;
  function escuchar() {
    var SR = global.SpeechRecognition || global.webkitSpeechRecognition;
    if (!SR) { _decirEnPantalla('Este navegador no oye. Usa los botones.'); return false; }
    try {
      if (_rec) { try { _rec.abort(); } catch (_) {} }
      _rec = new SR();
      _rec.lang = 'es-MX'; _rec.interimResults = false; _rec.maxAlternatives = 1;
      _rec.onresult = function (e) {
        var t = '';
        try { t = e.results[0][0].transcript || ''; } catch (_) {}
        _oyendo = false; _pinta();
        obedecer(t);
      };
      _rec.onerror = function () { _oyendo = false; _pinta(); };
      _rec.onend = function () { _oyendo = false; _pinta(); };
      _rec.start(); _oyendo = true; _pinta();
      return true;
    } catch (_) { _oyendo = false; return false; }
  }

  // ── LO QUE ENTIENDE ──────────────────────────────────────────────────────
  // 🪤 Nada de "IA que adivina": frases concretas, y si no entiende lo DICE.
  function obedecer(frase) {
    var t = (frase || '').toLowerCase();
    _ultimoDicho = frase;
    // 🪤 Se llama por el objeto público a propósito: así se puede probar y
    // así el CRM de la escuela puede sustituir `generar` por el suyo.
    if (/report|parte|informe|zonas|c[oó]mo va|estatus/.test(t)) { global.MaestroParte.generar(); return; }
    if (/muert/.test(t)) { _leerSolo('muertas'); return; }
    if (/fall/.test(t)) { _leerSolo('fallando'); return; }
    if (/peligro|riesgo/.test(t)) { _leerSolo('peligro'); return; }
    if (/activ|sana|jal/.test(t)) { _leerSolo('vivas'); return; }
    if (/repite|otra vez|de nuevo/.test(t)) { if (_ultimo) hablar(guion(_ultimo)); return; }
    if (/c[aá]llate|para|silencio|basta/.test(t)) { callar(); return; }
    if (/cerrar|salir|adi[oó]s/.test(t)) { cerrar(); return; }
    _decirEnPantalla('No te entendí: "' + frase + '"');
    hablar('No te entendí. Puedes decir: genera el reporte, o dime las zonas muertas.');
  }

  var _ultimo = null, _cargando = false, _error = '', _dicho = '', _ultimoDicho = '';
  function _decirEnPantalla(t) { _dicho = t; _pinta(); }

  function _leerSolo(cual) {
    if (!_ultimo) { generar(); return; }
    var g = { muertas: 'zonas muertas', fallando: 'zonas fallando',
              peligro: 'zonas en peligro', vivas: 'zonas con actividad' }[cual];
    var lista = _ultimo[cual] || [];
    if (!lista.length) { hablar('No hay ' + g + '. Buenas noticias.'); return; }
    hablar(g + ': ' + lista.map(function (z) { return z.zona + ', ' + z.nota; }).join('. ') + '.');
  }

  function generar() {
    _cargando = true; _error = ''; _pinta();
    return datos(7).then(function (d) {
      _ultimo = d; _cargando = false; _pinta();
      hablar(guion(d));
      return d;
    }).catch(function (e) {
      _cargando = false;
      _error = (e && e.message) || 'no se pudo';
      _pinta();
      hablar('No pude generar el parte. ' + _error);
    });
  }

  // ── LA PANTALLA, EN CAJAS ────────────────────────────────────────────────
  function _caja(titulo, ico, color, items, vacio) {
    var h = '<div style="background:rgba(255,255,255,.045);border:2px solid ' + color + ';' +
      'border-radius:18px;padding:clamp(14px,1.6vw,22px);display:flex;flex-direction:column;min-height:0;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<span style="font-size:clamp(20px,2.2vw,30px);line-height:1;">' + ico + '</span>' +
        '<span style="font-size:clamp(12px,1.1vw,16px);letter-spacing:1.6px;font-weight:900;color:' + color + ';">' +
          titulo + '</span>' +
        '<span style="margin-left:auto;font-size:clamp(24px,2.6vw,40px);font-weight:900;color:' + CREMA + ';">' +
          items.length + '</span></div>';
    if (!items.length) {
      h += '<div style="font-size:clamp(12px,1vw,15px);color:rgba(255,246,224,.5);">' + vacio + '</div>';
    } else {
      h += '<div style="display:flex;flex-direction:column;gap:7px;overflow:auto;">' +
        items.map(function (z) {
          return '<div style="background:rgba(0,0,0,.28);border-radius:11px;padding:9px 12px;">' +
            '<div style="font-size:clamp(13px,1.15vw,18px);font-weight:800;color:' + CREMA + ';">' +
              _esc(z.zona) + '</div>' +
            '<div style="font-size:clamp(10.5px,.85vw,13px);color:rgba(255,246,224,.62);margin-top:2px;">' +
              _esc(z.nota || '') + '</div></div>';
        }).join('') + '</div>';
    }
    return h + '</div>';
  }

  function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function _pinta() {
    var ov = document.getElementById(ID);
    if (!ov) return;
    var d = _ultimo;
    var h = '<div style="max-width:1900px;margin:0 auto;padding:clamp(14px,2vw,34px);">' +
      // encabezado
      '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:clamp(12px,1.6vw,24px);">' +
        '<div style="font-size:clamp(22px,2.6vw,40px);font-weight:900;color:' + CREMA + ';">' +
          '🩺 Parte de tu app</div>' +
        '<div style="font-size:clamp(11px,1vw,15px);color:rgba(255,246,224,.6);">' +
          (d ? ('últimos ' + d.dias + ' días · ' + d.totalErrores + ' errores en 24 h') : 'sin generar') + '</div>' +
        '<button onclick="window.MaestroParte.cerrar()" style="margin-left:auto;background:transparent;' +
          'border:2px solid rgba(255,246,224,.3);color:' + CREMA + ';border-radius:12px;' +
          'width:52px;height:52px;font-size:22px;cursor:pointer;font-family:inherit;">✕</button>' +
      '</div>';

    // la barra de voz: los botones grandes, para verlos desde lejos
    h += '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:clamp(12px,1.6vw,24px);">' +
      '<button onclick="window.MaestroParte.escuchar()" style="flex:1;min-width:220px;' +
        'background:' + (_oyendo ? '#c0392b' : SOL) + ';color:' + TINTA + ';border:none;border-radius:16px;' +
        'padding:clamp(14px,1.4vw,22px);font-size:clamp(15px,1.4vw,22px);font-weight:900;cursor:pointer;' +
        'font-family:inherit;">' + (_oyendo ? '🔴 Te escucho…' : '🎙️ Háblame') + '</button>' +
      '<button onclick="window.MaestroParte.generar()" style="flex:1;min-width:220px;' +
        'background:rgba(255,246,224,.1);color:' + CREMA + ';border:2px solid rgba(255,246,224,.3);' +
        'border-radius:16px;padding:clamp(14px,1.4vw,22px);font-size:clamp(15px,1.4vw,22px);' +
        'font-weight:900;cursor:pointer;font-family:inherit;">🔄 Generar el parte</button>' +
      (_hablando ? '<button onclick="window.MaestroParte.callar()" style="flex:none;min-width:150px;' +
        'background:rgba(255,93,93,.2);color:' + CREMA + ';border:2px solid rgba(255,93,93,.5);' +
        'border-radius:16px;padding:clamp(14px,1.4vw,22px);font-size:clamp(15px,1.4vw,22px);' +
        'font-weight:900;cursor:pointer;font-family:inherit;">🔇 Cállate</button>' : '') +
      '</div>';

    if (_ultimoDicho) {
      h += '<div style="font-size:clamp(11px,1vw,15px);color:rgba(255,246,224,.5);margin-bottom:10px;">' +
        'dijiste: “' + _esc(_ultimoDicho) + '”</div>';
    }
    if (_dicho) {
      h += '<div style="background:rgba(255,196,61,.14);border:1px solid rgba(255,196,61,.4);' +
        'border-radius:12px;padding:12px 15px;margin-bottom:14px;font-size:clamp(12px,1.05vw,16px);' +
        'color:' + CREMA + ';">' + _esc(_dicho) + '</div>';
    }
    if (_error) {
      h += '<div style="background:rgba(255,93,93,.14);border:1px solid rgba(255,93,93,.45);' +
        'border-radius:12px;padding:14px 17px;font-size:clamp(12px,1.05vw,16px);color:' + CREMA + ';">' +
        '🔴 ' + _esc(_error) + '</div>';
    }
    if (_cargando) {
      h += '<div style="font-size:clamp(14px,1.3vw,20px);color:rgba(255,246,224,.7);padding:26px 0;">' +
        'Leyendo lo que midió tu app…</div>';
    }

    if (d) {
      // 🪤 Cuatro columnas en monitor, una en teléfono. `auto-fit` lo resuelve
      // sin media queries y aguanta las 4 pantallas de la casa de Mario.
      h += '<div style="display:grid;gap:clamp(10px,1.2vw,18px);' +
        'grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start;">' +
        _caja('FALLANDO', '🔴', '#ff5d5d', d.fallando, 'Ninguna. Todo respondiendo.') +
        _caja('EN PELIGRO', '🟡', SOL, d.peligro, 'Ninguna en riesgo.') +
        _caja('MUERTAS', '⚫', '#8a93a6', d.muertas, 'Todas tuvieron visitas.') +
        _caja('CON ACTIVIDAD', '🟢', '#3ddc84', d.vivas, 'Sin actividad todavía.') +
        '</div>';
      if (d.otrosErrores.length) {
        h += '<div style="margin-top:clamp(12px,1.4vw,20px);background:rgba(0,0,0,.25);border-radius:14px;' +
          'padding:14px 17px;">' +
          '<div style="font-size:clamp(10px,.9vw,13px);letter-spacing:1.5px;font-weight:900;color:' + SOL + ';">' +
          'ERRORES QUE NO CAEN EN NINGUNA ZONA</div>' +
          d.otrosErrores.map(function (e) {
            return '<div style="font-size:clamp(11px,.95vw,14px);color:rgba(255,246,224,.7);margin-top:5px;' +
              'font-family:ui-monospace,monospace;">' + _esc(String(e).slice(0, 160)) + '</div>';
          }).join('') + '</div>';
      }
    }
    ov.innerHTML = h + '</div>';
  }

  // ── ABRIR / CERRAR ───────────────────────────────────────────────────────
  function abrir(opts) {
    opts = opts || {};
    cerrar();
    var ov = document.createElement('div');
    ov.id = ID;
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483600;overflow:auto;' +
      'background:linear-gradient(180deg,#0b1326 0%,#111d38 100%);color:' + CREMA + ';' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;' +
      '-webkit-font-smoothing:antialiased;';
    document.body.appendChild(ov);
    _ultimoDicho = ''; _dicho = ''; _error = '';
    _pinta();
    // 🎙️ El saludo que pidió Mario. Solo si él lo abrió a propósito o si es la
    // ronda de la mañana; nunca de sorpresa.
    if (opts.saludar !== false) {
      hablar('Hola Mario. ¿Qué hacemos hoy? Dime "genera el reporte" y te lo leo.');
    }
    if (opts.generar) generar();
    return true;
  }

  function cerrar() {
    callar();
    try { if (_rec) _rec.abort(); } catch (_) {}
    var ov = document.getElementById(ID);
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  }

  global.MaestroParte = {
    abrir: abrir, cerrar: cerrar, generar: generar, datos: datos, guion: guion,
    hablar: hablar, callar: callar, escuchar: escuchar, obedecer: obedecer,
    REGLA: REGLA
  };
})(window);
