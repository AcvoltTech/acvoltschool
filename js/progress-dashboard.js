(function(){
  'use strict';
  var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
  function _sb() { return window.supabaseClient; }

  // ══════════════════════════════════════════════════════════════════════════
  // 🔴 ESTE TABLERO PINTABA CEROS QUE NADIE MIDIÓ (10-sep-2026)
  // Dos raíces distintas, mismo daño:
  //  1) `zm_exam_attempts` NO tiene la columna `passing_score` (vive en `zm_exams`).
  //     Pedirla daba 400 → `exams` llegaba `undefined` → `(exams||[]).filter(...)`
  //     = 0. SÍNTOMA MEDIDO: la tarjeta "Exámenes aprobados" marcaba 0 aunque el
  //     alumno hubiera aprobado 12, y la ruta de certificación lo devolvía al
  //     nivel 0. El `|| 70` estaba puesto para un valor nulo y tapaba la intención.
  //     (Tampoco existe `created_at` en esa tabla: son `started_at`/`completed_at`.)
  //  2) Cada lectura hacía `res.data || []` dentro de un `catch` que pintaba 0.
  //     supabase-js NUNCA lanza: el fallo llega en `res.error` y ese `|| []` lo
  //     convertía en "no tienes nada".
  // REGLA: "no pude medir" NO es "no hay datos". Un dato que no se pudo leer se
  // pinta '—' (nunca 0) y se avisa una sola vez por carga.
  // ══════════════════════════════════════════════════════════════════════════
  var UMBRAL_DEFAULT = 70;      // los 5 exámenes de zm_exams marcan 70 (medido 10-sep-2026)
  var _umbrales = null;         // promesa de { exam_id -> passing_score }, cacheada por sesión
  var _yaAvise = false;         // un solo aviso por carga del tablero

  function _esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function _avisarFallo(donde, err) {
    var msg = (err && err.message) || 'consulta rechazada';
    console.warn('[ProgressDashboard] ' + donde + ': ' + msg, err);
    if (_yaAvise) return;
    _yaAvise = true;
    if (typeof window.showToast === 'function') {
      window.showToast(_tc('pd_no_pude_medir', 'No pude cargar parte de tu progreso. Los datos con “—” no se pudieron leer.'), 'error');
    }
  }

  // Marca una tarjeta como NO MEDIDA. '—' no es 0: 0 es una afirmación.
  function _elFallo(id) {
    var e = document.getElementById(id);
    if (!e) return;
    e.textContent = '—';
    e.title = _tc('pd_no_pude_cargar_dato', 'No pude cargar este dato');
  }

  // Caja honesta + botón de reintento. `html_retry` ya existe en i18n.js
  // (es: Reintentar / en: Retry): se reusa porque i18n.js está cerrado a claves nuevas.
  function _cajaNoPudeCargar(texto, detalle, reintentoJs) {
    return '<div style="text-align:center;padding:20px;color:#b45309;font-size:13px;">' +
      '<div style="font-size:22px;margin-bottom:4px;">⚠️</div>' +
      '<div style="font-weight:700;">' + texto + '</div>' +
      (detalle ? '<div style="font-size:11px;color:#57574F;margin-top:4px;">' + _esc(detalle) + '</div>' : '') +
      '<button onclick="' + reintentoJs + '" style="margin-top:10px;padding:7px 16px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🔄 ' +
      _tc('html_retry', 'Reintentar') + '</button></div>';
  }

  // El umbral de aprobación vive en `zm_exams.passing_score`, NO en el intento.
  // 🪤 Si esta lectura falla (por ejemplo sin sesión: zm_exams sólo lo lee
  // `authenticated`), se usa 70 — y eso SÍ es un respaldo legítimo: es un umbral,
  // no un dato del alumno. Lo que jamás se inventa es el resultado del examen.
  // 🪤 Se cachea la PROMESA, no el resultado: las tarjetas y la ruta se disparan
  // en paralelo desde loadProgressDashboard y si no, pedirían zm_exams dos veces.
  function _umbralesExamen() {
    if (!_umbrales) _umbrales = _leerUmbrales();
    return _umbrales;
  }

  async function _leerUmbrales() {
    var mapa = {};
    try {
      var res = await _sb().from('zm_exams').select('id,passing_score');
      if (res.error) {
        console.warn('[ProgressDashboard] umbrales zm_exams: ' + (res.error.message || 'consulta rechazada') + ' — se usa ' + UMBRAL_DEFAULT, res.error);
      } else {
        (res.data || []).forEach(function(x) { if (x.passing_score != null) mapa[x.id] = x.passing_score; });
      }
    } catch(e) {
      console.warn('[ProgressDashboard] umbrales zm_exams: ' + (e.message || e) + ' — se usa ' + UMBRAL_DEFAULT, e);
    }
    return mapa;
  }

  function _aprobo(intento, umbrales) {
    var umbral = (umbrales && umbrales[intento.exam_id] != null) ? umbrales[intento.exam_id] : UMBRAL_DEFAULT;
    // `score` y `percentage` coinciden en las 398 filas medidas; `score` es el que
    // llenan todos los intentos, así que es el que manda.
    var nota = intento.score != null ? intento.score : intento.percentage;
    return nota != null && nota >= umbral;
  }

  // ---- Master Loader ----
  window.loadProgressDashboard = async function() {
    _yaAvise = false;
    var email = '', userId = '';
    try {
      var session = _sb() ? (await _sb().auth.getSession()).data.session : null;
      email = session ? session.user.email : (localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || '');
      userId = session ? session.user.id : '';
    } catch(e) { email = localStorage.getItem('tecnico_email') || localStorage.getItem('maestroac_email') || ''; }
    if (!email) { console.warn('Progress: no email'); return; }

    renderProgressStats(email, userId);
    renderScoreTrendChart(email, userId);
    renderCategoryChart(email, userId);
    renderCertProgress(email, userId);
    renderActivityHeatmap(email);
  };

  // Helper: query quiz_results by email OR user_id (existing records may only have user_id)
  // 🔴 Antes devolvía sólo `data` con `res.data || []`: un 400 y un alumno sin
  // quizzes se veían EXACTAMENTE igual. Ahora devuelve { data, error } y quien
  // llama decide si dice "no pude" o "no hay".
  async function queryQuizResults(selectCols, email, userId) {
    var data = [], error = null;
    try {
      var res = await _sb().from('quiz_results').select(selectCols).eq('email', email);
      if (res.error) error = res.error; else data = res.data || [];
    } catch(e) { error = e; }
    if (!error && data.length === 0 && userId) {
      try {
        var res2 = await _sb().from('quiz_results').select(selectCols).eq('user_id', userId);
        if (res2.error) error = res2.error; else data = res2.data || [];
      } catch(e) { error = e; }
    }
    return { data: data, error: error };
  }

  // ---- Stat Cards ----
  async function renderProgressStats(email, userId) {
    var stats = typeof getActivityStats === 'function' ? getActivityStats(email) : { totalMinutes:0, totalSessions:0, quizzes:0, questionsAnswered:0 };
    var el = function(id,v) { var e = document.getElementById(id); if(e) e.textContent = v; };
    el('pStatQuestions', stats.questionsAnswered || 0);
    el('pStatHours', Math.round((stats.totalMinutes || 0) / 60));

    // Streak
    var streak = calcStreak(email);
    el('pStatStreak', streak);

    // Exams passed + certs from Supabase
    try {
      var umbrales = await _umbralesExamen();
      var resEx = await _sb().from('zm_exam_attempts').select('exam_id,score,percentage').eq('student_email', email);
      if (resEx.error) { _avisarFallo('exámenes de ' + email, resEx.error); _elFallo('pStatPassed'); }
      else {
        el('pStatPassed', (resEx.data || []).filter(function(a) { return _aprobo(a, umbrales); }).length);
      }
    } catch(e) { _avisarFallo('exámenes de ' + email, e); _elFallo('pStatPassed'); }

    try {
      if (userId) {
        var resC = await _sb().from('certificates').select('id').eq('user_id', userId);
        if (resC.error) { _avisarFallo('certificados', resC.error); _elFallo('pStatCerts'); }
        else { el('pStatCerts', (resC.data || []).length); }
      } else {
        // Sin userId no hay con qué buscar: tampoco se puede afirmar 0.
        _elFallo('pStatCerts');
      }
    } catch(e) { _avisarFallo('certificados', e); _elFallo('pStatCerts'); }
  }

  function calcStreak(email) {
    var log = typeof getActivityLog === 'function' ? getActivityLog(email) : [];
    if (!log.length) return 0;
    var days = {};
    log.forEach(function(e) { days[e.date ? e.date.slice(0,10) : ''] = true; });
    var streak = 0;
    var d = new Date();
    for (var i = 0; i < 365; i++) {
      var key = d.toISOString().slice(0,10);
      if (days[key]) { streak++; } else if (i > 0) { break; }
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ---- Score Trend SVG Chart ----
  async function renderScoreTrendChart(email, userId) {
    var container = document.getElementById('scoreTrendChart');
    if (!container) return;
    var scores = [];
    var fallo = false;
    var rq = await queryQuizResults('score,created_at', email, userId);
    if (rq.error) { fallo = true; _avisarFallo('quizzes de ' + email + ' (tendencia)', rq.error); }
    rq.data.forEach(function(q) { scores.push({ score: q.score, date: q.created_at }); });
    try {
      // 🔴 Aquí se ordenaba por `created_at`, que TAMPOCO existe en
      // `zm_exam_attempts` (400 silencioso): los exámenes nunca entraban a la
      // gráfica. Las fechas reales son `started_at` (siempre llena) y
      // `completed_at` (nula en los 56 intentos en curso).
      var resEx = await _sb().from('zm_exam_attempts')
        .select('score,percentage,started_at,completed_at')
        .eq('student_email', email)
        .order('started_at', { ascending: true })
        .limit(20);
      if (resEx.error) { fallo = true; _avisarFallo('exámenes de ' + email + ' (tendencia)', resEx.error); }
      else {
        (resEx.data || []).forEach(function(e) {
          scores.push({ score: e.score != null ? e.score : e.percentage, date: e.completed_at || e.started_at });
        });
      }
    } catch(e) { fallo = true; _avisarFallo('exámenes de ' + email + ' (tendencia)', e); }
    scores.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
    scores = scores.slice(-20);

    if (scores.length < 2) {
      // 🔒 "Necesitas al menos 2 resultados" es una AFIRMACIÓN sobre el alumno:
      // sólo se puede decir si de verdad se pudo leer. Si falló, se dice que falló.
      container.innerHTML = fallo
        ? _cajaNoPudeCargar(_tc('pd_trend_no_pude', 'No pude cargar tu tendencia de calificaciones.'), '', 'loadProgressDashboard()')
        : '<p style="text-align:center;color:#57574F;font-size:13px;padding:20px;">' + _tc('pd_need_2_results', 'Necesitas al menos 2 resultados para ver la tendencia') + '</p>';
      return;
    }

    var W = 520, H = 160, pad = 30;
    var maxS = 100, minS = 0;
    var pts = scores.map(function(s, i) {
      var x = pad + (i / (scores.length - 1)) * (W - pad * 2);
      var y = H - pad - ((s.score - minS) / (maxS - minS)) * (H - pad * 2);
      return { x: x, y: y, score: s.score };
    });

    var polyline = pts.map(function(p) { return p.x + ',' + p.y; }).join(' ');
    var circles = pts.map(function(p) {
      var color = p.score >= 80 ? '#10b981' : (p.score >= 60 ? '#f59e0b' : '#ef4444');
      return '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="'+color+'" stroke="#fff" stroke-width="2"/>';
    }).join('');

    // Grid lines
    var gridLines = '';
    [0, 25, 50, 75, 100].forEach(function(v) {
      var y = H - pad - (v / 100) * (H - pad * 2);
      gridLines += '<line x1="'+pad+'" y1="'+y+'" x2="'+(W-pad)+'" y2="'+y+'" stroke="#E7E5DE" stroke-width="1"/>';
      gridLines += '<text x="'+(pad-4)+'" y="'+(y+4)+'" fill="#57574F" font-size="9" text-anchor="end">'+v+'</text>';
    });

    var svg = '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;">'+
      gridLines+
      '<polyline points="'+polyline+'" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'+
      circles+
      '</svg>';
    // Se pudo dibujar algo, pero una de las dos fuentes falló: la curva está incompleta y se avisa.
    if (fallo) {
      svg = '<div style="text-align:center;color:#b45309;font-size:11px;margin-bottom:4px;">⚠️ ' +
        _tc('pd_trend_parcial', 'Tendencia incompleta: no pude leer todos tus resultados.') + '</div>' + svg;
    }
    container.innerHTML = svg;
  }

  // ---- Category Strengths Chart ----
  async function renderCategoryChart(email, userId) {
    var container = document.getElementById('categoryChart');
    if (!container) return;
    var categories = {};
    categories[_tc('cat_electricity', 'Electricidad')] = { total: 0, correct: 0 };
    categories[_tc('cat_air_conditioning', 'Aire Acondicionado')] = { total: 0, correct: 0 };
    categories[_tc('cat_refrigeration', 'Refrigeración')] = { total: 0, correct: 0 };
    categories[_tc('cat_tools', 'Herramientas')] = { total: 0, correct: 0 };
    categories[_tc('cat_safety', 'Seguridad')] = { total: 0, correct: 0 };
    categories[_tc('cat_general_hvac', 'General HVAC')] = { total: 0, correct: 0 };

    var rc = await queryQuizResults('category_scores,score,level', email, userId);
    if (rc.error) {
      // Antes esto caía en "Completa quizzes para ver tus fortalezas" — un consejo
      // dirigido a alguien que quizá ya los completó todos.
      _avisarFallo('quizzes de ' + email + ' (fortalezas)', rc.error);
      container.innerHTML = _cajaNoPudeCargar(_tc('pd_cat_no_pude', 'No pude cargar tus fortalezas por área.'), '', 'loadProgressDashboard()');
      return;
    }
    try {
      var results = rc.data;
      (results || []).forEach(function(r) {
        if (r.category_scores && typeof r.category_scores === 'object') {
          Object.keys(r.category_scores).forEach(function(cat) {
            if (categories[cat]) {
              categories[cat].total += r.category_scores[cat].total || 1;
              categories[cat].correct += r.category_scores[cat].correct || 0;
            }
          });
        } else {
          // Approximate from level
          var cat = _tc('cat_general_hvac', 'General HVAC');
          if (r.level && r.level.toLowerCase().includes('electric')) cat = _tc('cat_electricity', 'Electricidad');
          else if (r.level && (r.level.toLowerCase().includes('ac') || r.level.toLowerCase().includes('aire'))) cat = _tc('cat_air_conditioning', 'Aire Acondicionado');
          else if (r.level && r.level.toLowerCase().includes('refrig')) cat = _tc('cat_refrigeration', 'Refrigeración');
          categories[cat].total += 10;
          categories[cat].correct += Math.round((r.score || 0) / 10);
        }
      });
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }

    var html = '';
    var hasData = false;
    Object.keys(categories).forEach(function(cat) {
      var c = categories[cat];
      var pct = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
      if (c.total > 0) hasData = true;
      var color = pct >= 80 ? '#10b981' : (pct >= 60 ? '#f59e0b' : '#ef4444');
      html += '<div class="category-bar-row">'+
        '<div class="category-bar-label">' + cat + '</div>'+
        '<div class="category-bar-track"><div class="category-bar-fill" style="width:'+pct+'%;background:'+color+';"><span>'+pct+'%</span></div></div>'+
        '</div>';
    });

    if (!hasData) {
      container.innerHTML = '<p style="text-align:center;color:#57574F;font-size:13px;padding:20px;">' + _tc('pd_complete_quizzes', 'Completa quizzes para ver tus fortalezas por área') + '</p>';
      return;
    }
    container.innerHTML = html;
  }

  // ---- Certification Progress Timeline ----
  async function renderCertProgress(email, userId) {
    var container = document.getElementById('certProgressTimeline');
    if (!container) return;
    var levels = [
      { name: _tc('level_beginner', 'Principiante'), desc: _tc('level_beginner_desc', 'Completar registro y primer quiz'), key: 'principiante' },
      { name: _tc('level_bronze', 'Bronce'), desc: _tc('level_bronze_desc', '10+ quizzes aprobados'), key: 'bronce' },
      { name: _tc('level_silver', 'Plata'), desc: _tc('level_silver_desc', '25+ quizzes + 1 examen'), key: 'plata' },
      { name: _tc('level_gold', 'Oro'), desc: _tc('level_gold_desc', '50+ quizzes + certificado oficial'), key: 'oro' },
      { name: _tc('level_platinum', 'Platino'), desc: _tc('level_platinum_desc', 'Todas las certificaciones completadas'), key: 'platino' }
    ];

    var quizCount = 0, examCount = 0, certCount = 0;
    // 🔒 La ruta de certificación es un JUICIO sobre el alumno ("estás en nivel 0").
    // Si cualquiera de las tres cuentas falló, ese juicio no se puede emitir: antes
    // un 400 en exámenes lo regresaba a Principiante aunque tuviera 12 aprobados.
    var fallo = false;
    var rq = await queryQuizResults('id', email, userId);
    if (rq.error) { fallo = true; _avisarFallo('quizzes de ' + email + ' (ruta)', rq.error); }
    quizCount = rq.data.length;
    try {
      var umbrales = await _umbralesExamen();
      var resEx = await _sb().from('zm_exam_attempts').select('id,exam_id,score,percentage').eq('student_email', email);
      if (resEx.error) { fallo = true; _avisarFallo('exámenes de ' + email + ' (ruta)', resEx.error); }
      else { examCount = (resEx.data || []).filter(function(a) { return _aprobo(a, umbrales); }).length; }
    } catch(e) { fallo = true; _avisarFallo('exámenes de ' + email + ' (ruta)', e); }
    try {
      if (userId) {
        var resC = await _sb().from('certificates').select('id').eq('user_id', userId);
        if (resC.error) { fallo = true; _avisarFallo('certificados (ruta)', resC.error); }
        else { certCount = (resC.data || []).length; }
      }
    } catch(e) { fallo = true; _avisarFallo('certificados (ruta)', e); }

    if (fallo) {
      container.innerHTML = _cajaNoPudeCargar(_tc('pd_ruta_no_pude', 'No pude cargar tu ruta de certificación.'), '', 'loadProgressDashboard()');
      return;
    }

    // Determine achieved level
    var achieved = 0;
    if (quizCount >= 1) achieved = 1; // principiante
    if (quizCount >= 10) achieved = 2; // bronce
    if (quizCount >= 25 && examCount >= 1) achieved = 3; // plata
    if (quizCount >= 50 && certCount >= 1) achieved = 4; // oro
    if (certCount >= 5) achieved = 5; // platino

    var html = '<div class="cert-timeline">';
    levels.forEach(function(lv, i) {
      var cls = (i < achieved) ? 'completed' : ((i === achieved) ? 'active' : '');
      var dot = (i < achieved) ? '✓' : (i + 1);
      html += '<div class="cert-step ' + cls + '">'+
        '<div class="cert-dot">' + dot + '</div>'+
        '<div class="cert-info"><h4>' + lv.name + '</h4><p>' + lv.desc + '</p></div>'+
        '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ---- Activity Heatmap ----
  function renderActivityHeatmap(email) {
    var container = document.getElementById('activityHeatmap');
    if (!container) return;
    var log = typeof getActivityLog === 'function' ? getActivityLog(email) : [];

    // Count activities per day for last 84 days
    var dayCounts = {};
    log.forEach(function(e) {
      var key = e.date ? e.date.slice(0,10) : '';
      if (key) dayCounts[key] = (dayCounts[key] || 0) + 1;
    });

    var cells = '';
    var today = new Date();
    for (var i = 83; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var key = d.toISOString().slice(0,10);
      var count = dayCounts[key] || 0;
      var level = count === 0 ? '' : (count <= 2 ? 'level-1' : (count <= 5 ? 'level-2' : (count <= 10 ? 'level-3' : 'level-4')));
      cells += '<div class="heatmap-cell ' + level + '" title="' + key + ': ' + count + ' ' + _tc('pd_activities', 'actividades') + '"></div>';
    }
    container.innerHTML = cells;
  }
})();
