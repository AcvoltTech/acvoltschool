// ============================================
// STUDY ACTIVITY TRACKER — Profile Progress & Study Leaderboard
// Maestro HVACR — April 2026
// Uses existing screen_events data to show study progress
// ============================================
(function() {
  'use strict';

  var STUDY_SCREENS = {
    'epa608StudyScreen':      { icon: '\uD83D\uDCDA', name: 'EPA 608' },
    'a2lStudyScreen':         { icon: '\uD83E\uDDCA', name: 'A2L' },
    'oshaStudyScreen':        { icon: '\u26A0\uFE0F', name: 'OSHA' },
    'calefaccionStudyScreen': { icon: '\uD83D\uDD25', name: 'Calefacci\u00f3n' },
    'refriStudyScreen':       { icon: '\u2744\uFE0F', name: 'Refrigeraci\u00f3n' },
    'nateStudyScreen':        { icon: '\uD83C\uDF93', name: 'NATE' },
    'nateSeniorStudyScreen':  { icon: '\uD83C\uDF93', name: 'NATE Sr' },
    'etStudyScreen':          { icon: '\u26A1', name: 'Electricidad' },
    'herramientasScreen':     { icon: '\uD83D\uDD27', name: 'Herramientas' },
    'videoLessonsScreen':     { icon: '\uD83C\uDFA5', name: 'Video Clases' },
    'desafioScreen':          { icon: '\uD83C\uDFC6', name: 'Desaf\u00edo' },
    'desafioQuizScreen':      { icon: '\uD83C\uDFC6', name: 'Desaf\u00edo Quiz' },
    'certCourseScreen':       { icon: '\uD83D\uDCDC', name: 'Certificaciones' },
    'certOficialesScreen':    { icon: '\uD83C\uDFC5', name: 'Cert. Oficiales' },
    'studentExamsScreen':     { icon: '\uD83D\uDCDD', name: 'Ex\u00e1menes' },
    'acvoltCourseScreen':     { icon: '\uD83C\uDF93', name: 'Curso ACVOLT' },
    'acvoltLessonScreen':     { icon: '\uD83D\uDCD5', name: 'Lecci\u00f3n ACVOLT' },
    'studySectionsScreen':    { icon: '\uD83D\uDCD6', name: 'Secciones' }
  };

  var STUDY_SCREEN_IDS = Object.keys(STUDY_SCREENS);
  var _t_ = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

  function _formatTime(sec) {
    if (!sec || sec <= 0) return '0 min';
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    return h > 0 ? h + 'h ' + m + 'min' : m + ' min';
  }

  // ========== PROFILE: Load study progress ==========
  window.loadStudyActivity = function() {
    var container = document.getElementById('studyActivityContainer');
    if (!container) return;
    _t_ = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var email = localStorage.getItem('tecnico_email');
    if (!email || !window.supabaseClient) { container.innerHTML = ''; return; }

    supabaseClient.from('screen_events')
      .select('screen_id, duration_sec, entered_at')
      .eq('user_email', email)
      .in('screen_id', STUDY_SCREEN_IDS)
      .order('entered_at', { ascending: false })
      .then(function(res) {
        if (!res.data || res.data.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:16px;color:#3D3D3A;font-size:12px;">' + _t_('study_no_activity', 'A\u00fan no tienes actividad de estudio. \u00a1Explora los m\u00f3dulos!') + '</div>';
          return;
        }
        _renderStudyProgress(container, res.data);
      }).catch(function() { container.innerHTML = ''; });
  };

  function _renderStudyProgress(container, events) {
    var totalSessions = events.length;
    var totalTimeSec = 0;
    var moduleVisits = {};
    var moduleTime = {};
    var uniqueDays = {};

    events.forEach(function(ev) {
      var dur = Math.min(ev.duration_sec || 0, 3600);
      totalTimeSec += dur;
      var sid = ev.screen_id;
      moduleVisits[sid] = (moduleVisits[sid] || 0) + 1;
      moduleTime[sid] = (moduleTime[sid] || 0) + dur;
      if (ev.entered_at) uniqueDays[ev.entered_at.substring(0, 10)] = true;
    });

    var totalDays = Object.keys(uniqueDays).length;
    var modulesStudied = Object.keys(moduleVisits).length;

    var html = '';
    // Summary grid
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
    html += _statCard(totalSessions, _t_('study_sessions', 'Sesiones'), '#38bdf8', 'rgba(56,189,248,');
    html += _statCard(_formatTime(totalTimeSec), _t_('study_time', 'Tiempo'), '#a855f7', 'rgba(168,85,247,');
    html += _statCard(modulesStudied + '/' + STUDY_SCREEN_IDS.length, _t_('study_modules', 'M\u00f3dulos'), '#22c55e', 'rgba(34,197,94,');
    html += _statCard(totalDays, _t_('study_days_active', 'D\u00edas Activo'), '#fbbf24', 'rgba(251,191,36,');
    html += '</div>';

    // Module bars (sorted by visits, top 8)
    var sorted = Object.keys(moduleVisits).sort(function(a, b) { return moduleVisits[b] - moduleVisits[a]; });
    var maxV = moduleVisits[sorted[0]] || 1;

    html += '<div style="font-size:11px;font-weight:700;color:#57574F;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">' + _t_('study_by_module', 'Por M\u00f3dulo') + '</div>';
    sorted.slice(0, 8).forEach(function(sid) {
      var info = STUDY_SCREENS[sid] || { icon: '\uD83D\uDCD8', name: sid };
      var v = moduleVisits[sid];
      var pct = Math.round((v / maxV) * 100);
      html += '<div style="margin-bottom:5px;">';
      html += '<div style="display:flex;justify-content:space-between;margin-bottom:1px;">';
      html += '<span style="font-size:11px;color:#3D3D3A;">' + info.icon + ' ' + info.name + '</span>';
      html += '<span style="font-size:10px;color:#57574F;">' + v + ' vis \u00b7 ' + _formatTime(moduleTime[sid]) + '</span>';
      html += '</div>';
      html += '<div style="height:5px;background:rgba(30,41,59,0.8);border-radius:3px;overflow:hidden;">';
      html += '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8);border-radius:3px;"></div>';
      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  function _statCard(value, label, color, rgbaBase) {
    return '<div style="background:' + rgbaBase + '0.08);border:1px solid ' + rgbaBase + '0.15);border-radius:10px;padding:10px;text-align:center;">' +
      '<div style="font-size:20px;font-weight:900;color:' + color + ';">' + value + '</div>' +
      '<div style="font-size:10px;color:#57574F;">' + label + '</div></div>';
  }

  // ========== LEADERBOARD: Study Ranking ==========
  window.renderStudyLeaderboard = function(containerId) {
    var container = document.getElementById(containerId);
    if (!container || !window.supabaseClient) return;
    container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(148,163,184,0.7);font-size:14px;">' + _t_('study_loading_ranking', 'Cargando ranking de estudio...') + '</div>';
    var myEmail = localStorage.getItem('tecnico_email');

    supabaseClient.from('screen_events')
      .select('user_email, screen_id, duration_sec')
      .in('screen_id', STUDY_SCREEN_IDS)
      .limit(50000)
      .then(function(res) {
        if (!res.data || res.data.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t_('study_no_data', 'No hay datos de estudio a\u00fan.') + '</div>';
          return;
        }

        // Aggregate by user
        var stats = {};
        res.data.forEach(function(ev) {
          if (!ev.user_email) return;
          var key = ev.user_email.toLowerCase();
          if (key === 'floresmario30@gmail.com') return;
          if (!stats[key]) stats[key] = { email: ev.user_email, sessions: 0, time: 0, modules: {} };
          stats[key].sessions++;
          stats[key].time += Math.min(ev.duration_sec || 0, 3600);
          stats[key].modules[ev.screen_id] = true;
        });

        // Get names
        var emails = Object.keys(stats);
        if (emails.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">No hay datos de estudio a\u00fan.</div>';
          return;
        }
        usersDataSelf('public_user_lookup', { emails: emails.slice(0, 100) })
          .then(function(nr) {
            var names = {};
            if (nr.data) nr.data.forEach(function(u) { names[u.email.toLowerCase()] = u.nombre; });
            // Sort by modules*100 + sessions
            var sorted = Object.values(stats).sort(function(a, b) {
              return (Object.keys(b.modules).length * 100 + b.sessions) - (Object.keys(a.modules).length * 100 + a.sessions);
            });
            _renderStudyRanking(container, sorted.slice(0, 10), names, myEmail);
          }).catch(function() {
            var sorted = Object.values(stats).sort(function(a, b) {
              return (Object.keys(b.modules).length * 100 + b.sessions) - (Object.keys(a.modules).length * 100 + a.sessions);
            });
            _renderStudyRanking(container, sorted.slice(0, 10), {}, myEmail);
          });
      }).catch(function() {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(239,68,68,0.7);">Error cargando ranking</div>';
      });
  };

  function _renderStudyRanking(container, rankings, names, myEmail) {
    if (!rankings.length) { container.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">No hay datos a\u00fan.</div>'; return; }
    var medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
    var html = '';

    rankings.forEach(function(user, i) {
      var medal = i < 3 ? '<span style="font-size:24px;">' + medals[i] + '</span>' :
        '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(148,163,184,0.15);font-size:13px;font-weight:800;color:rgba(148,163,184,0.8);">' + (i + 1) + '</span>';
      var name = names[user.email.toLowerCase()] || user.email.split('@')[0];
      if (name.length > 20) name = name.substring(0, 20) + '\u2026';
      var isMe = myEmail && user.email.toLowerCase() === myEmail.toLowerCase();
      var isFirst = i === 0;
      var mc = Object.keys(user.modules).length;

      var bg = isFirst ? 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(168,85,247,0.04))' : (isMe ? 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(56,189,248,0.04))' : 'rgba(15,23,42,0.6)');
      var border = isFirst ? '1px solid rgba(168,85,247,0.4)' : (isMe ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(148,163,184,0.1)');
      var glow = isFirst ? 'box-shadow:0 0 20px rgba(168,85,247,0.12);' : (isMe ? 'box-shadow:0 0 12px rgba(56,189,248,0.08);' : '');

      html += '<div style="position:relative;overflow:hidden;background:' + bg + ';border:' + border + ';border-radius:14px;padding:14px 16px;margin-bottom:10px;' + glow + '">';
      // Row 1: medal + name + time
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">';
      html += '<div style="min-width:32px;text-align:center;">' + medal + '</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-size:15px;font-weight:800;color:' + (isFirst ? '#a855f7' : isMe ? '#38bdf8' : '#e2e8f0') + ';">' + name + (isMe ? ' (T\u00fa)' : '') + '</div>';
      html += '<div style="font-size:11px;color:rgba(148,163,184,0.6);margin-top:1px;">\uD83D\uDCDA ' + mc + ' m\u00f3dulos \u00b7 ' + user.sessions + ' sesiones</div>';
      html += '</div>';
      html += '<div style="text-align:right;">';
      html += '<div style="font-size:14px;font-weight:900;color:#a855f7;">\u23F1\uFE0F ' + _formatTime(user.time) + '</div>';
      html += '</div></div>';

      // Module badges
      var badges = '';
      Object.keys(user.modules).forEach(function(sid) {
        var info = STUDY_SCREENS[sid];
        if (info) badges += '<span style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.2);color:#c084fc;font-size:10px;padding:2px 6px;border-radius:6px;white-space:nowrap;">' + info.icon + ' ' + info.name + '</span>';
      });
      if (badges) html += '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + badges + '</div>';
      html += '</div>';
    });

    container.innerHTML = html;
  }

  // ========== LEADERBOARD TAB TOGGLE ==========
  window.switchLeaderboardTab = function(tab) {
    var desafioBtn = document.getElementById('lbTabDesafio');
    var estudioBtn = document.getElementById('lbTabEstudio');
    var desafioList = document.getElementById('top10FullList');
    var estudioList = document.getElementById('studyRankingList');

    if (!desafioBtn || !estudioBtn || !desafioList || !estudioList) return;

    var baseStyle = 'flex:1;padding:8px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;';
    var activeStyle = baseStyle + 'background:rgba(56,189,248,0.2);border:1px solid rgba(56,189,248,0.4);color:#38bdf8;';
    var inactiveStyle = baseStyle + 'background:rgba(148,163,184,0.08);border:1px solid rgba(148,163,184,0.15);color:#64748b;';

    if (tab === 'estudio') {
      estudioBtn.style.cssText = activeStyle;
      desafioBtn.style.cssText = inactiveStyle;
      desafioList.style.display = 'none';
      estudioList.style.display = 'block';
      renderStudyLeaderboard('studyRankingList');
    } else {
      desafioBtn.style.cssText = activeStyle;
      estudioBtn.style.cssText = inactiveStyle;
      desafioList.style.display = 'block';
      estudioList.style.display = 'none';
    }
  };

})();
