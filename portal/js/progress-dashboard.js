(function(){
  'use strict';
  var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
  function _sb() { return window.supabaseClient; }

  // ---- Master Loader ----
  window.loadProgressDashboard = async function() {
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
  async function queryQuizResults(selectCols, email, userId) {
    var data = [];
    try {
      var res = await _sb().from('quiz_results').select(selectCols).eq('email', email);
      data = res.data || [];
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    if (data.length === 0 && userId) {
      try {
        var res2 = await _sb().from('quiz_results').select(selectCols).eq('user_id', userId);
        data = res2.data || [];
      } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    }
    return data;
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
      var { data: exams } = await _sb().from('zm_exam_attempts').select('score,passing_score').eq('student_email', email);
      var passed = (exams || []).filter(function(e) { return e.score >= (e.passing_score || 70); }).length;
      el('pStatPassed', passed);
    } catch(e) { el('pStatPassed', 0); }

    try {
      if (userId) {
        var { data: certs } = await _sb().from('certificates').select('id').eq('user_id', userId);
        el('pStatCerts', (certs || []).length);
      } else { el('pStatCerts', 0); }
    } catch(e) { el('pStatCerts', 0); }
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
    try {
      var quizzes = await queryQuizResults('score,created_at', email, userId);
      quizzes.forEach(function(q) { scores.push({ score: q.score, date: q.created_at }); });
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    try {
      var { data: exams } = await _sb().from('zm_exam_attempts').select('score,created_at').eq('student_email', email).order('created_at', {ascending:true}).limit(20);
      (exams || []).forEach(function(e) { scores.push({ score: e.score, date: e.created_at }); });
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    scores.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
    scores = scores.slice(-20);

    if (scores.length < 2) {
      container.innerHTML = '<p style="text-align:center;color:#57574F;font-size:13px;padding:20px;">' + _tc('pd_need_2_results', 'Necesitas al menos 2 resultados para ver la tendencia') + '</p>';
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

    try {
      var results = await queryQuizResults('category_scores,score,level', email, userId);
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
    try {
      var q = await queryQuizResults('id', email, userId);
      quizCount = (q || []).length;
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    try {
      var { data: ex } = await _sb().from('zm_exam_attempts').select('id,score,passing_score').eq('student_email', email);
      examCount = (ex || []).filter(function(e) { return e.score >= (e.passing_score || 70); }).length;
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }
    try {
      if (userId) {
        var { data: c } = await _sb().from('certificates').select('id').eq('user_id', userId);
        certCount = (c || []).length;
      }
    } catch(e) { console.warn('[ProgressDashboard]', e.message || e); }

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
