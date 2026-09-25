/* ============================================================================
 * acvolt-quiz-leccion.js — quiz al final de CADA lección, candado de avance y
 * certificado del curso (Mario 25-sep-2026: "todo video deberá llevar un quiz al final…
 * los videos no deberán estar disponibles hasta que el técnico haya pasado el quiz…
 * necesitamos darles un premio a los estudiantes por haberlo logrado").
 * ----------------------------------------------------------------------------
 * 🔒 El navegador NUNCA ve la respuesta correcta: pide las preguntas (acvolt_quiz_leccion)
 *    y el SERVIDOR califica (acvolt_calificar_leccion), guarda el intento, abre la siguiente
 *    lección y emite el certificado al terminar el curso. video-token también respeta el
 *    candado. Aprobar = 4 de 5.
 * 🟢 Si algo falla al consultar, NO se bloquea al alumno (se deja como estaba).
 * El personal (admin_staff) ve todo abierto.
 * ========================================================================== */
(function () {
  'use strict';
  var sb = function () { return window.supabaseClient; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var mmss = function (s) { s = Math.max(0, parseInt(s, 10) || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  var estado = {};   // lesson_id -> {desbloqueada, aprobada, tiene_quiz}

  function aviso(txt) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:#0F172A;color:#fff;padding:12px 18px;border-radius:12px;font:600 14px/1.4 -apple-system,Segoe UI,sans-serif;max-width:90vw;box-shadow:0 8px 30px rgba(0,0,0,.35)';
    d.textContent = txt; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 3500);
  }

  // ── Lista de lecciones: candados 🔒 y palomitas ✓ ──
  async function detalle(course) {
    if (!sb() || !course) return;
    var r = await sb().rpc('acvolt_estado_curso', { p_course_id: course.id });
    if (r.error || !Array.isArray(r.data) || !r.data.length) return;          // sin datos: no se toca nada
    r.data.forEach(function (x) { estado[x.lesson_id] = x; });
    barraXP(document.querySelector('#acvoltCourseScreen .acvolt-wrap'));
    var hayQuiz = r.data.some(function (x) { return x.tiene_quiz; });
    document.querySelectorAll('#acvoltCourseScreen [data-lesson]').forEach(function (row) {
      var x = estado[+row.getAttribute('data-lesson')]; if (!x) return;
      if (!x.desbloqueada) {
        row.style.opacity = '0.55';
        row.insertAdjacentHTML('beforeend', '<span title="Bloqueada" style="font-size:16px;flex-shrink:0">🔒</span>');
        row.onclick = function () { aviso('🔒 Aprueba el quiz de la lección anterior para abrir esta.'); };
      } else if (x.aprobada && x.tiene_quiz && !row.querySelector('.acvq-ok')) {
        row.insertAdjacentHTML('beforeend', '<span class="acvq-ok" title="Quiz aprobado" style="color:#059669;font-weight:800;flex-shrink:0">✓</span>');
      }
    });
    if (hayQuiz) {
      var total = r.data.length, ok = r.data.filter(function (x) { return x.aprobada; }).length;
      var cab = document.querySelector('#acvoltCourseScreen .acvolt-wrap h2');
      if (cab && !document.getElementById('acvqAvance')) {
        cab.insertAdjacentHTML('afterend', '<div id="acvqAvance" style="margin:6px 0 14px;background:#F1F5F9;border-radius:10px;padding:10px 12px;font-size:13px;color:#334155">' +
          '<b>' + ok + ' de ' + total + '</b> lecciones aprobadas · cada video termina con un quiz de 5 preguntas (4 para pasar) que abre la siguiente lección.' +
          '<div style="height:6px;background:#E2E8F0;border-radius:6px;margin-top:8px;overflow:hidden"><div style="height:100%;width:' + Math.round(ok * 100 / total) + '%;background:#10b981"></div></div></div>');
        if (ok === total) mostrarBotonCertificado(course, cab);
      }
    }
  }

  async function mostrarBotonCertificado(course, cab) {
    var r = await sb().rpc('acvolt_mis_certificados'); if (r.error) return;
    var c = (r.data || []).find(function (x) { return x.course_id === course.id; }); if (!c) return;
    var b = document.createElement('button');
    b.style.cssText = 'width:100%;margin:0 0 14px;padding:14px;border:0;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;font-weight:800;font-size:15px;cursor:pointer';
    b.textContent = '🏆 Ver mi certificado'; b.onclick = function () { certificado(c); };
    document.getElementById('acvqAvance').after(b);
  }

  // ── Reproductor controlable (SDK de Cloudflare Stream): saltar a capítulos, reanudar, guardar ──
  var jugador = null, leccionActiva = null, guardado = 0;
  function sdk() {
    return new Promise(function (ok) {
      if (window.Stream) return ok(window.Stream);
      var sc = document.createElement('script'); sc.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
      sc.onload = function () { ok(window.Stream || null); }; sc.onerror = function () { ok(null); }; document.head.appendChild(sc);
    });
  }
  async function conectarJugador(lesson) {
    var f = null;
    for (var i = 0; i < 40 && !(f && f.src); i++) { f = document.querySelector('#acvoltLessonScreen iframe[data-vf-uid]'); if (!(f && f.src)) await new Promise(function (r) { setTimeout(r, 250); }); }
    var S = await sdk(); if (!f || !f.src || !S || leccionActiva !== lesson.id) return;
    try { jugador = S(f); } catch (_) { jugador = null; return; }
    var pos = await sb().rpc('acvolt_posicion', { p_lesson_id: lesson.id });
    var seg = (!pos.error && pos.data) || 0;
    if (seg > 20) { jugador.addEventListener('loadedmetadata', function () { try { jugador.currentTime = seg; } catch (_) {} }); aviso('▶ Continúas donde te quedaste (' + mmss(seg) + ').'); }
    jugador.addEventListener('timeupdate', function () { var t = Math.floor(jugador.currentTime || 0); if (Math.abs(t - guardado) >= 15) guardar(lesson.id, t); });
    jugador.addEventListener('pause', function () { guardar(lesson.id, Math.floor(jugador.currentTime || 0)); });
  }
  function guardar(id, t) { guardado = t; if (sb() && t > 0) sb().rpc('acvolt_guardar_posicion', { p_lesson_id: id, p_segundo: t }).then(function () {}, function () {}); }
  function soltarJugador() {
    try { if (jugador && leccionActiva) { guardar(leccionActiva, Math.floor(jugador.currentTime || 0)); jugador.pause(); } } catch (_) {}
    jugador = null;
  }
  window.acvqIrA = function (seg) {
    if (!jugador) { aviso('El video todavía está cargando.'); return; }
    try { jugador.currentTime = seg; jugador.play(); var f = document.querySelector('#acvoltLessonScreen iframe[data-vf-uid]'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
  };
  document.addEventListener('visibilitychange', function () { if (document.hidden && jugador && leccionActiva) guardar(leccionActiva, Math.floor(jugador.currentTime || 0)); });

  // ── Enlace propio de cada lección (?leccion=ID): sobrevive a recargar y se puede compartir ──
  function marcarUrl(id) { try { var u = new URL(location.href); if (id) u.searchParams.set('leccion', id); else u.searchParams.delete('leccion'); history.replaceState(history.state, '', u); } catch (_) {} }
  (function abrirDesdeUrl() {
    var id = +(new URLSearchParams(location.search).get('leccion') || 0); if (!id) return;
    var n = 0, t = setInterval(function () {
      var L = window._acvoltData && _acvoltData.lessons || [];
      var l = L.find(function (x) { return x.id === id; });
      if (document.getElementById('webAccessGate')) { clearInterval(t); return; }   // sin acceso: no se abre nada
      if (l && window.supabaseClient && typeof window._acvoltOpenLesson === 'function') {
        clearInterval(t);
        try { window._acvoltCurrentCourse = (_acvoltData.courses || []).find(function (c) { return c.id === l.course_id; }) || window._acvoltCurrentCourse; } catch (_) {}
        _acvoltOpenLesson(id);
      } else if (++n > 120) clearInterval(t);
    }, 500);
    // si los datos del curso aún no se cargan, pedirle al módulo que los cargue
    try { if (typeof showScreen === 'function' && !(window._acvoltData && _acvoltData.lessons && _acvoltData.lessons.length)) showScreen('acvoltCertScreen'); } catch (_) {}
  })();

  // ── Cabecera del aula: curso / módulo, anterior / siguiente, volver al temario ──
  function orden(lesson) {
    var todas = (window._acvoltData && _acvoltData.lessons || []).filter(function (l) { return l.course_id === lesson.course_id && l.status === 1; });
    var secc = (window._acvoltData && _acvoltData.sections || []);
    var k = function (l) { var s = secc.find(function (x) { return x.id === l.section_id; }); return [(s ? s.sort_order : 9999), l.sort_order || 0, l.id]; };
    return todas.sort(function (a, b) { var x = k(a), y = k(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
  }
  function cabecera(lesson, pant) {
    var lista = orden(lesson), i = lista.findIndex(function (l) { return l.id === lesson.id; });
    var ant = i > 0 ? lista[i - 1] : null, sig = i >= 0 ? lista[i + 1] : null;
    var curso = ((window._acvoltData && _acvoltData.courses) || []).find(function (c) { return c.id === lesson.course_id; });
    var mod = ((window._acvoltData && _acvoltData.sections) || []).find(function (x) { return x.id === lesson.section_id; });
    var h = pant && pant.querySelector('h3'); if (!h || document.getElementById('acvqCab')) return;
    h.insertAdjacentHTML('beforebegin', '<div id="acvqCab" style="font-size:12px;color:#64748B;font-weight:600;margin:0 0 4px">' + esc(curso ? curso.title : '') + (mod ? ' · ' + esc(mod.title) : '') + ' · Lección ' + (i + 1) + ' de ' + lista.length + '</div>');
    var nav = '<div id="acvqNav" style="display:flex;gap:8px;padding:10px 16px 0">' +
      (ant ? '<button onclick="_acvoltOpenLesson(' + ant.id + ')" style="flex:1;padding:10px;border:1px solid #CBD5E1;border-radius:10px;background:#fff;font-weight:700;cursor:pointer">← Anterior</button>' : '') +
      '<button onclick="_acvoltBackToCourse()" style="flex:1;padding:10px;border:1px solid #CBD5E1;border-radius:10px;background:#fff;font-weight:700;cursor:pointer">☰ Temario</button>' +
      (sig ? '<button onclick="_acvoltOpenLesson(' + sig.id + ')" style="flex:1;padding:10px;border:0;border-radius:10px;background:#0B2545;color:#fff;font-weight:700;cursor:pointer">Siguiente →</button>' : '') + '</div>';
    var vid = pant.querySelector('iframe[data-vf-uid]'); (vid && vid.parentElement ? vid.parentElement : h).insertAdjacentHTML('afterend', nav);
  }

  // ── Barra de XP (el mismo XP y nivel del app Maestro HVACR) ──
  async function barraXP(dentro, ganado) {
    if (!sb() || !dentro) return;
    var r = await sb().rpc('acvolt_mi_xp'); if (r.error || !r.data) return;
    var x = r.data, rango = (x.hasta || x.xp + 1) - x.desde, pct = Math.min(100, Math.round((x.xp - x.desde) * 100 / Math.max(1, rango)));
    var html = '<div style="display:flex;justify-content:space-between;font:700 12.5px -apple-system,Segoe UI,sans-serif;color:#1E293B"><span>⚡ Nivel ' + x.nivel + '</span><span>' + x.xp.toLocaleString('es-MX') + ' XP' + (x.hasta ? ' · faltan ' + (x.hasta - x.xp).toLocaleString('es-MX') + ' para nivel ' + (x.nivel + 1) : '') + '</span></div>' +
      '<div style="height:8px;background:#E2E8F0;border-radius:8px;margin-top:6px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#F59E0B,#EF4444);transition:width .8s"></div></div>' +
      (ganado ? '<div style="font:800 13px -apple-system,sans-serif;color:#D97706;margin-top:6px">+' + ganado + ' XP ganados 🎉</div>' : '');
    var b = dentro.querySelector('.acvq-xp');
    if (!b) { b = document.createElement('div'); b.className = 'acvq-xp'; b.style.cssText = 'background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:10px 12px;margin:10px 0'; dentro.prepend(b); }
    b.innerHTML = html;
  }

  // ── Manual de trabajo debajo del video ──
  var ICON = { equipo: '🧰 Equipo que se enseña', herramientas: '🔧 Herramientas necesarias', materiales: '📦 Materiales', componentes: '⚙️ Componentes mencionados', pasos: '🪜 Procedimiento paso a paso', datos_clave: '📏 Datos y valores clave', seguridad: '⚠️ Seguridad', glosario: '📖 Glosario' };
  function filas(m, k) {
    var v = m[k] || []; if (!v.length) return '';
    var li = v.map(function (x) {
      if (typeof x === 'string') return '<li>' + esc(x) + '</li>';
      var min = x.segundo != null ? ' <button onclick="acvqIrA(' + (+x.segundo || 0) + ')" style="border:0;background:#EFF6FF;color:#2563EB;font-weight:700;border-radius:6px;padding:1px 6px;cursor:pointer;white-space:nowrap">▶ ' + mmss(x.segundo) + '</button>' : '';
      var a = x.nombre || x.paso || x.dato || x.termino || '', bb = x.descripcion || x.para_que || x.detalle || x.funcion || x.valor || x.definicion || '';
      return '<li><b>' + esc(a) + '</b>' + (bb ? ' — ' + esc(bb) : '') + min + '</li>';
    }).join('');
    return '<details' + (k === 'herramientas' || k === 'pasos' ? ' open' : '') + ' style="border:1px solid #E7E5DE;border-radius:12px;padding:10px 12px;margin:0 0 8px;background:#fff">' +
      '<summary style="font-weight:800;color:#0F172A;cursor:pointer">' + ICON[k] + ' <span style="color:#64748B;font-weight:600">(' + v.length + ')</span></summary>' +
      '<' + (k === 'pasos' ? 'ol' : 'ul') + ' style="margin:8px 0 0;padding-left:20px;color:#1F2937;font-size:14px;line-height:1.5">' + li + '</' + (k === 'pasos' ? 'ol' : 'ul') + '></details>';
  }
  async function material(lesson, dentro) {
    var r = await sb().rpc('acvolt_material_leccion', { p_lesson_id: lesson.id });
    if (r.error || !r.data) return;
    var m = r.data, cont = document.createElement('div'); cont.id = 'acvqManual'; cont.style.cssText = 'padding:0 16px';
    var borrador = m._estado && m._estado !== 'aprobado';
    cont.innerHTML = '<div style="border-top:1px solid #E7E5DE;margin-top:12px;padding-top:16px">' +
      (borrador ? '<div style="background:#FEF3C7;border:1px dashed #D97706;border-radius:10px;padding:8px 10px;margin-bottom:8px;font-size:13px;color:#92400E"><b>BORRADOR</b> generado de la clase — solo lo ve el personal hasta que se apruebe.</div>' : '') +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px"><h4 style="margin:0;color:#0F0F0F;font-size:17px">📘 Manual de trabajo y guía de estudio</h4>' +
      '<button id="acvqPdf" style="border:1px solid #2563EB;background:#fff;color:#2563EB;border-radius:999px;padding:8px 14px;font-weight:800;cursor:pointer">Descargar manual (PDF)</button></div>' +
      (m.objetivo ? '<p style="margin:0 0 10px;color:#334155;font-size:14px">' + esc(m.objetivo) + '</p>' : '') +
      ['equipo', 'herramientas', 'materiales', 'componentes', 'pasos', 'datos_clave', 'seguridad', 'glosario'].map(function (k) { return filas(m, k); }).join('') + '</div>';
    var q = document.getElementById('acvqQuiz'); if (q) q.before(cont); else dentro.appendChild(cont);
    document.getElementById('acvqPdf').onclick = function () { pdf(m, lesson); };
  }
  function pdf(m, lesson) {
    var h = document.createElement('div'); h.id = 'acvqManualHoja';
    h.style.cssText = 'position:fixed;left:-99999px;top:0;width:780px;background:#fff;color:#0F172A;font:13px/1.5 -apple-system,Segoe UI,sans-serif;padding:24px';
    h.innerHTML = '<div style="border-bottom:3px solid #0B2545;padding-bottom:8px;margin-bottom:12px"><div style="font-size:11px;letter-spacing:2px;color:#475569">ACVOLT TECH SCHOOL · MAESTRO HVACR · MANUAL DE TRABAJO</div>' +
      '<div style="font-size:20px;font-weight:800">' + esc(m.titulo || lesson.title) + '</div>' + (m.objetivo ? '<div style="color:#334155">' + esc(m.objetivo) + '</div>' : '') + '</div>' +
      ['equipo', 'herramientas', 'materiales', 'componentes', 'pasos', 'datos_clave', 'seguridad', 'glosario'].map(function (k) { return filas(m, k).replace('<details', '<div').replace('</details>', '</div>').replace(/<summary[^>]*>/, '<div style="font-weight:800">').replace('</summary>', '</div>'); }).join('') +
      '<div style="margin-top:14px;font-size:11px;color:#64748B">Material de estudio personal del alumno. Tomado de la clase grabada; los minutos indican dónde se explica en el video.</div>';
    document.body.appendChild(h);
    document.body.classList.add('pc-imprimir-manual'); window.print();
    setTimeout(function () { document.body.classList.remove('pc-imprimir-manual'); h.remove(); }, 800);
  }

  // ── Quiz al final del video ──
  async function leccion(lesson) {
    if (!sb() || !lesson || lesson.lesson_type !== 0) return;
    var pant = document.querySelector('#acvoltLessonScreen .acvolt-wrap');
    // El video queda fijo arriba mientras el alumno lee el manual y el quiz.
    var vid = pant && pant.querySelector('iframe[data-vf-uid]'); if (vid && vid.parentElement) { vid.parentElement.style.position = 'sticky'; vid.parentElement.style.top = '0'; vid.parentElement.style.zIndex = '5'; }
    soltarJugador(); leccionActiva = lesson.id; marcarUrl(lesson.id);
    cabecera(lesson, pant);
    conectarJugador(lesson);
    barraXP(pant);
    material(lesson, pant);
    var r = await sb().rpc('acvolt_quiz_leccion', { p_lesson_id: lesson.id });
    if (r.error || !Array.isArray(r.data) || !r.data.length) return;         // sin quiz: queda el de antes
    var viejo = document.getElementById('acvoltAiQuizSection'); if (viejo) viejo.style.display = 'none';
    var marcar = document.querySelector('#acvoltLessonScreen button[onclick^="_acvoltMarkComplete"]'); if (marcar) marcar.style.display = 'none';
    var cont = document.createElement('div'); cont.id = 'acvqQuiz'; cont.style.cssText = 'padding:0 16px 24px';
    var x = estado[lesson.id];
    cont.innerHTML = '<div style="border-top:1px solid #E7E5DE;margin-top:12px;padding-top:18px">' +
      '<h4 style="margin:0 0 4px;color:#0F0F0F;font-size:17px">📝 Quiz de la lección</h4>' +
      '<p style="margin:0 0 14px;color:#6B6B66;font-size:13px">Termina el video y contesta. Necesitas <b>4 de 5</b> para abrir la siguiente lección.' + (x && x.aprobada ? ' <b style="color:#059669">Ya lo aprobaste ✓</b>' : '') + '</p>' +
      r.data.map(function (q) {
        return '<fieldset data-q="' + q.i + '" style="border:1px solid #E7E5DE;border-radius:12px;padding:12px;margin:0 0 10px;background:#fff">' +
          '<legend style="font-weight:700;color:#0F0F0F;font-size:14px;padding:0 4px">' + (q.i + 1) + '. ' + esc(q.pregunta) + '</legend>' +
          (q.opciones || []).map(function (o, k) {
            return '<label style="display:flex;gap:10px;align-items:flex-start;padding:8px;border-radius:8px;cursor:pointer;font-size:14px;color:#1F2937">' +
              '<input type="radio" name="acvq' + q.i + '" value="' + k + '" style="margin-top:3px;width:18px;height:18px;flex:none"><span>' + esc(o) + '</span></label>';
          }).join('') + '<div class="acvq-res" style="font-size:13px;margin-top:4px"></div></fieldset>';
      }).join('') +
      '<button id="acvqEnviar" style="width:100%;padding:14px;border:0;border-radius:10px;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:#fff;font-weight:800;font-size:15px;cursor:pointer;min-height:48px">Calificar mi quiz</button>' +
      '<div id="acvqResultado" style="margin-top:12px"></div></div>';
    var wrap = document.querySelector('#acvoltLessonScreen .acvolt-wrap'); (wrap || document.getElementById('acvoltLessonScreen')).appendChild(cont);
    document.getElementById('acvqEnviar').onclick = function () { enviar(lesson, r.data.length); };
  }

  async function enviar(lesson, total) {
    var resp = [], falta = 0;
    for (var i = 0; i < total; i++) {
      var s = document.querySelector('input[name="acvq' + i + '"]:checked');
      resp.push(s ? +s.value : null); if (!s) falta++;
    }
    var out = document.getElementById('acvqResultado');
    if (falta) { out.innerHTML = '<p style="color:#B91C1C;font-weight:700">Te faltan ' + falta + ' pregunta(s) por contestar.</p>'; return; }
    var btn = document.getElementById('acvqEnviar'); btn.disabled = true; btn.textContent = 'Calificando…';
    var r = await sb().rpc('acvolt_calificar_leccion', { p_lesson_id: lesson.id, p_respuestas: resp });
    btn.disabled = false; btn.textContent = 'Calificar otra vez';
    if (r.error) { out.innerHTML = '<p style="color:#B91C1C">No se pudo calificar: ' + esc(r.error.message) + '. Intenta de nuevo.</p>'; return; }
    var d = r.data || {};
    (d.detalle || []).forEach(function (x) {
      var f = document.querySelector('fieldset[data-q="' + x.i + '"] .acvq-res'); if (!f) return;
      f.innerHTML = x.bien ? '<span style="color:#059669;font-weight:700">✓ Correcta.</span> ' + esc(x.explicacion)
                           : '<span style="color:#B91C1C;font-weight:700">✗ Incorrecta.</span> Repasa el video en el minuto <b>' + mmss(x.segundo) + '</b>.';
    });
    if (d.aprobado) {
      var ya = estado[lesson.id] && estado[lesson.id].aprobada;
      estado[lesson.id] = Object.assign({}, estado[lesson.id], { aprobada: true });
      barraXP(document.querySelector('#acvoltLessonScreen .acvolt-wrap'), ya ? 0 : (d.certificado ? 550 : 50));
      var sig = siguiente(lesson);
      out.innerHTML = '<div style="background:#ECFDF5;border:1px solid #10b981;border-radius:12px;padding:14px;color:#065F46">' +
        '<b style="font-size:16px">🎉 ¡Aprobado! ' + d.correctas + ' de ' + d.total + '</b><br>Ya se abrió la siguiente lección.</div>' +
        (sig ? '<button onclick="_acvoltOpenLesson(' + sig.id + ')" style="width:100%;margin-top:10px;padding:14px;border:0;border-radius:10px;background:#10b981;color:#fff;font-weight:800;font-size:15px;cursor:pointer">Siguiente lección →</button>' : '');
      try { if (typeof _acvSaveProgress === 'function') _acvSaveProgress(lesson.id); } catch (_) {}
      if (d.certificado) {
        var c = await sb().rpc('acvolt_mis_certificados');
        var cc = (c.data || []).find(function (x) { return x.folio === d.certificado; });
        if (cc) certificado(cc, true);
      }
    } else {
      out.innerHTML = '<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:12px;padding:14px;color:#7F1D1D">' +
        '<b>' + d.correctas + ' de ' + d.total + '.</b> Necesitas 4 para pasar. Repasa los minutos marcados y vuelve a intentarlo.</div>';
    }
  }

  function siguiente(lesson) {
    var todas = (window._acvoltData && _acvoltData.lessons || []).filter(function (l) { return l.course_id === lesson.course_id && l.status === 1; });
    var secc = (window._acvoltData && _acvoltData.sections || []);
    var ord = function (l) { var s = secc.find(function (x) { return x.id === l.section_id; }); return [(s ? s.sort_order : 9999), l.sort_order || 0, l.id]; };
    todas.sort(function (a, b) { var x = ord(a), y = ord(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
    var i = todas.findIndex(function (l) { return l.id === lesson.id; });
    return i >= 0 ? todas[i + 1] : null;
  }

  // ── Certificado (el premio) ──
  function certificado(c, nuevo) {
    var nombre = '';
    try { var u = JSON.parse(localStorage.getItem('tecnico_user') || 'null'); nombre = (u && (u.nombre || u.name)) || ''; } catch (_) {}
    var fecha = new Date(c.emitido || Date.now()).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    var d = document.createElement('div'); d.id = 'acvqCert';
    d.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(15,23,42,.75);display:flex;align-items:center;justify-content:center;padding:16px';
    d.innerHTML = '<div style="background:#fff;max-width:720px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4)">' +
      '<div id="acvqCertHoja" style="padding:28px 26px;text-align:center;border:10px solid #0B2545;margin:12px;border-radius:8px;font-family:Georgia,serif;color:#0B2545">' +
      (nuevo ? '<div style="font:700 13px -apple-system,sans-serif;color:#D97706;letter-spacing:1px">🏆 ¡LO LOGRASTE!</div>' : '') +
      '<div style="font-size:13px;letter-spacing:3px;margin-top:8px">ACVOLT TECH SCHOOL · MAESTRO HVACR</div>' +
      '<div style="font-size:30px;font-weight:700;margin:10px 0 4px">Certificado de Terminación</div>' +
      '<div style="font-size:14px;color:#475569">Se otorga a</div>' +
      '<div style="font-size:26px;font-weight:700;margin:6px 0;border-bottom:1px solid #CBD5E1;padding-bottom:6px">' + esc(nombre || 'Técnico') + '</div>' +
      '<div style="font-size:14px;color:#475569">por aprobar todas las lecciones y quizzes del curso</div>' +
      '<div style="font-size:21px;font-weight:700;margin:8px 0">' + esc(c.curso) + '</div>' +
      '<div style="font:13px -apple-system,sans-serif;color:#475569;margin-top:10px">Colton, California · ' + esc(fecha) + ' · Folio <b>' + esc(c.folio) + '</b></div></div>' +
      '<div style="display:flex;gap:10px;padding:0 12px 12px"><button id="acvqImprimir" style="flex:1;padding:12px;border:0;border-radius:10px;background:#0B2545;color:#fff;font-weight:800;cursor:pointer">Imprimir / Guardar PDF</button>' +
      '<button id="acvqCerrar" style="flex:1;padding:12px;border:1px solid #CBD5E1;border-radius:10px;background:#fff;font-weight:700;cursor:pointer">Cerrar</button></div></div>';
    document.body.appendChild(d);
    document.getElementById('acvqCerrar').onclick = function () { d.remove(); };
    document.getElementById('acvqImprimir').onclick = function () {
      document.body.classList.add('pc-imprimir-cert'); window.print();
      setTimeout(function () { document.body.classList.remove('pc-imprimir-cert'); }, 800);
    };
  }

  // Al volver a la lista del curso: se detiene el video y se guarda la posición.
  var detalleOriginal = detalle;
  detalle = function (course) { soltarJugador(); leccionActiva = null; marcarUrl(null); return detalleOriginal(course); };
  window.AcvQuizLeccion = { detalle: detalle, leccion: leccion, certificado: certificado };
})();
