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

  // ── Quiz al final del video ──
  async function leccion(lesson) {
    if (!sb() || !lesson || lesson.lesson_type !== 0) return;
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
      estado[lesson.id] = Object.assign({}, estado[lesson.id], { aprobada: true });
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

  window.AcvQuizLeccion = { detalle: detalle, leccion: leccion, certificado: certificado };
})();
