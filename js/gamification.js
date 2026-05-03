// ============================================
// GAMIFICATION ENGINE — XP, Badges, Leaderboard
// Maestro HVACR — April 2026
// ============================================
(function() {
  'use strict';

  // ── XP Rewards ─────────────────────────────────────────────
  var XP_CORRECT   = 10;
  var XP_INCORRECT = 2;
  var XP_MODULE_COMPLETE = 50;
  var XP_STREAK_7  = 100;
  var XP_STREAK_30 = 500;
  var XP_TOOL_USE  = 5;

  // ── Level thresholds ───────────────────────────────────────
  var LEVELS = [
    0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500,
    7500, 10000, 13000, 17000, 22000, 28000, 35000, 43000, 52000, 65000
  ];

  // ── Badge definitions ──────────────────────────────────────
  var BADGES = {
    first_answer:    { name: 'Primera Respuesta',   icon: '🎯', desc: 'Responde tu primera pregunta' },
    streak_7:        { name: 'Semana Fuego',        icon: '🔥', desc: '7 días consecutivos estudiando' },
    streak_30:       { name: 'Mes Imparable',       icon: '💎', desc: '30 días consecutivos estudiando' },
    questions_100:   { name: 'Centurión',           icon: '💯', desc: '100 preguntas respondidas' },
    questions_500:   { name: 'Medio Millar',        icon: '🏅', desc: '500 preguntas respondidas' },
    questions_1000:  { name: 'El Mil',              icon: '👑', desc: '1,000 preguntas respondidas' },
    perfect_quiz:    { name: 'Perfección',          icon: '⭐', desc: '100% en un quiz' },
    all_modules:     { name: 'Maestro Completo',    icon: '🎓', desc: 'Estudia los 8 módulos' },
    tools_5:         { name: 'Técnico Equipado',    icon: '🔧', desc: 'Usa 5 herramientas diferentes' },
    xp_10000:        { name: 'Leyenda HVACR',       icon: '🏆', desc: 'Alcanza 10,000 XP' },
    // Social badges
    first_en_vivo:   { name: 'Primera Vez EN VIVO', icon: '🟢', desc: 'Aparece EN VIVO por primera vez' },
    first_friend:    { name: 'Primer Amigo',        icon: '🤝', desc: 'Agrega tu primer amigo' },
    helpers_5:       { name: 'Buen Compañero',      icon: '🙌', desc: 'Ayuda a 5 técnicos' },
    helpers_25:      { name: 'Mentor',               icon: '🎓', desc: 'Ayuda a 25 técnicos' },
    helpers_100:     { name: 'Leyenda Comunitaria',  icon: '🌟', desc: 'Ayuda a 100 técnicos' },
    friends_10:      { name: 'Social',               icon: '🫂', desc: 'Conecta con 10 amigos' },
    friends_50:      { name: 'Influencer HVACR',     icon: '📢', desc: 'Conecta con 50 amigos' },
    study_together:  { name: 'Estudiar Juntos',      icon: '👥', desc: 'Participa en una sesión grupal' },
    job_posted:      { name: 'Emprendedor',          icon: '💼', desc: 'Publica en la bolsa de trabajo' },
    social_butterfly:{ name: 'Mariposa Social',      icon: '🦋', desc: 'Amigos, EN VIVO, chat y trabajo publicado' }
  };

  // ── Cached state ───────────────────────────────────────────
  var _userId = null;
  var _userEmail = null;
  var _userIdChecked = false;
  var _stats = null;
  var _earnedBadges = {};
  var _confettiLoaded = false;
  var _streakXPAwarded = {}; // Track which streak XP levels have been awarded

  // ── Get user ID from Supabase ──────────────────────────────
  // Note: App uses anon key, so auth.getUser() always fails.
  // Use supabaseUserId from supabase-init.js instead when available.
  function _getUserId() {
    if (_userId) return Promise.resolve(_userId);
    // Check if supabaseUserId is available (set by supabase-init.js)
    if (window.supabaseUserId) { _userId = window.supabaseUserId; return Promise.resolve(_userId); }
    if (_userIdChecked) return Promise.resolve(null);
    _userEmail = _userEmail || localStorage.getItem('tecnico_email');
    if (!window.supabaseClient) return Promise.resolve(null);
    _userIdChecked = true;
    return window.supabaseClient.auth.getUser().then(function(res) {
      if (res.data && res.data.user) {
        _userId = res.data.user.id;
        _userEmail = _userEmail || res.data.user.email;
        return _userId;
      }
      return null;
    }).catch(function() { return null; });
  }

  // ── Ensure user_stats row exists ───────────────────────────
  var _ensureStatsPromise = null; // prevent concurrent calls
  function _ensureStats() {
    if (_stats) return Promise.resolve(_stats);
    if (_ensureStatsPromise) return _ensureStatsPromise;
    _ensureStatsPromise = _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) { _ensureStatsPromise = null; return null; }
      if (_stats) { _ensureStatsPromise = null; return _stats; }
      return window.supabaseClient.from('user_stats')
        .select('*').eq('user_id', uid).maybeSingle()
        .then(function(res) {
          if (res.data) { _stats = res.data; return _stats; }
          // Create initial row
          return window.supabaseClient.from('user_stats')
            .insert({ user_id: uid, xp: 0, level: 1, questions_total: 0, questions_correct: 0, modules_completed: 0, tools_used: 0 })
            .select().single()
            .then(function(ins) { _stats = ins.data; _ensureStatsPromise = null; return _stats; })
            .catch(function(e) { console.warn('[Gamification] insert stats:', e); _ensureStatsPromise = null; return null; });
        });
    }).catch(function(e) { console.warn('[Gamification] ensureStats:', e); _ensureStatsPromise = null; return null; });
    return _ensureStatsPromise;
  }

  // ── Award XP ───────────────────────────────────────────────
  function awardXP(amount, reason) {
    if (!amount || amount < 0) return Promise.resolve();
    return _ensureStats().then(function(stats) {
      if (!stats || !_userId || !window.supabaseClient) return;
      var newXP = (stats.xp || 0) + amount;
      var newLevel = 1;
      for (var i = LEVELS.length - 1; i >= 0; i--) {
        if (newXP >= LEVELS[i]) { newLevel = i + 1; break; }
      }
      var updates = { xp: newXP, level: newLevel, updated_at: new Date().toISOString() };
      if (reason === 'correct') {
        updates.questions_total = (stats.questions_total || 0) + 1;
        updates.questions_correct = (stats.questions_correct || 0) + 1;
      } else if (reason === 'incorrect') {
        updates.questions_total = (stats.questions_total || 0) + 1;
      } else if (reason === 'module_complete') {
        updates.modules_completed = (stats.modules_completed || 0) + 1;
      } else if (reason === 'tool_use') {
        updates.tools_used = (stats.tools_used || 0) + 1;
      }
      _stats = Object.assign({}, stats, updates);
      // Check for level up
      if (newLevel > (stats.level || 1)) {
        _showLevelUp(newLevel);
      }
      return window.supabaseClient.from('user_stats')
        .update(updates).eq('user_id', _userId)
        .then(function(res) { if (res.error) console.warn('[Gamification] update error:', res.error.message); _checkBadges(); })
        .catch(function(e) { console.warn('[Gamification] update failed:', e); });
    }).catch(function(e) { console.warn('[Gamification] awardXP error:', e); });
  }

  // ── Record answer for study_progress ───────────────────────
  function recordAnswer(module, category, isCorrect) {
    var xpAmount = isCorrect ? XP_CORRECT : XP_INCORRECT;
    awardXP(xpAmount, isCorrect ? 'correct' : 'incorrect');
    // Upsert study_progress
    _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) return;
      window.supabaseClient.from('study_progress')
        .select('*').eq('user_id', uid).eq('module', module).eq('category', category || '_all').maybeSingle()
        .then(function(res) {
          if (res.data) {
            var row = res.data;
            var newCorrect = (row.correct || 0) + (isCorrect ? 1 : 0);
            var newTotal = (row.total || 0) + 1;
            var pct = Math.round((newCorrect / newTotal) * 10000) / 100;
            window.supabaseClient.from('study_progress')
              .update({ correct: newCorrect, total: newTotal, best_pct: Math.max(pct, row.best_pct || 0), last_at: new Date().toISOString() })
              .eq('id', row.id).then(function(r) { if (r.error) console.warn('[Gamification] progress update:', r.error.message); }).catch(function(e) { console.warn('[Gamification] progress update:', e); });
          } else {
            window.supabaseClient.from('study_progress')
              .insert({ user_id: uid, module: module, category: category || '_all', correct: isCorrect ? 1 : 0, total: 1, best_pct: isCorrect ? 100 : 0 })
              .then(function(r) { if (r.error) console.warn('[Gamification] progress insert:', r.error.message); }).catch(function(e) { console.warn('[Gamification] progress insert:', e); });
          }
        }).catch(function(e) { console.warn('[Gamification] recordAnswer:', e); });
    });
  }

  // ── Record tool usage ──────────────────────────────────────
  function recordToolUse(toolName) {
    awardXP(XP_TOOL_USE, 'tool_use');
    _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) return;
      window.supabaseClient.from('tool_usage')
        .insert({ user_id: uid, tool_name: toolName }).then(function() {}).catch(function(e) { console.warn('[Gamification] tool_usage insert failed:', e && e.message); });
    });
  }

  // ── Sync streak to Supabase ────────────────────────────────
  function syncStreak(currentStreak) {
    _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) return;
      var today = new Date().toISOString().slice(0, 10);
      window.supabaseClient.from('user_streaks')
        .select('*').eq('user_id', uid).maybeSingle()
        .then(function(res) {
          if (res.data) {
            var longest = Math.max(res.data.longest_streak || 0, currentStreak);
            window.supabaseClient.from('user_streaks')
              .update({ current_streak: currentStreak, longest_streak: longest, last_active: today, updated_at: new Date().toISOString() })
              .eq('user_id', uid).then(function() {}).catch(function(e) { console.warn('[Gamification] streak update failed:', e && e.message); });
          } else {
            window.supabaseClient.from('user_streaks')
              .insert({ user_id: uid, current_streak: currentStreak, longest_streak: currentStreak, last_active: today })
              .then(function() {}).catch(function(e) { console.warn('[Gamification] streak insert failed:', e && e.message); });
          }
        }).catch(function(e) { console.warn('[Gamification] streak select failed:', e && e.message); });
      // Check streak badges
      if (currentStreak >= 7) _awardBadge('streak_7');
      if (currentStreak >= 30) _awardBadge('streak_30');
      // Award streak XP (deduplicate to prevent double-award on rapid calls)
      if (currentStreak >= 7 && !_streakXPAwarded['streak_7']) {
        _streakXPAwarded['streak_7'] = true;
        awardXP(XP_STREAK_7, 'streak');
      }
      if (currentStreak >= 30 && !_streakXPAwarded['streak_30']) {
        _streakXPAwarded['streak_30'] = true;
        awardXP(XP_STREAK_30, 'streak');
      }
    });
  }

  // ── Badge checking ─────────────────────────────────────────
  function _checkBadges() {
    if (!_stats) return;
    if (_stats.questions_total >= 1) _awardBadge('first_answer');
    if (_stats.questions_total >= 100) _awardBadge('questions_100');
    if (_stats.questions_total >= 500) _awardBadge('questions_500');
    if (_stats.questions_total >= 1000) _awardBadge('questions_1000');
    if (_stats.xp >= 10000) _awardBadge('xp_10000');
    // Check all modules
    if (_stats.modules_completed >= 8) _awardBadge('all_modules');
    // Check tools
    if (_stats.tools_used >= 5) _awardBadge('tools_5');
  }

  // ── Social badge checks (called from social-system.js) ────
  function checkSocialBadges(data) {
    if (!data) return;
    if (data.first_en_vivo) _awardBadge('first_en_vivo');
    if (data.friends >= 1) _awardBadge('first_friend');
    if (data.friends >= 10) _awardBadge('friends_10');
    if (data.friends >= 50) _awardBadge('friends_50');
    if (data.helpers >= 5) _awardBadge('helpers_5');
    if (data.helpers >= 25) _awardBadge('helpers_25');
    if (data.helpers >= 100) _awardBadge('helpers_100');
    if (data.study_together) _awardBadge('study_together');
    if (data.job_posted) _awardBadge('job_posted');
    if (data.friends >= 1 && data.first_en_vivo && data.study_together && data.job_posted) _awardBadge('social_butterfly');
  }

  function _awardBadge(badgeId) {
    if (_earnedBadges[badgeId]) return; // Already earned
    _earnedBadges[badgeId] = true; // Set immediately to prevent race condition
    _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) { _earnedBadges[badgeId] = false; return; }
      window.supabaseClient.from('user_achievements')
        .upsert({ user_id: uid, badge_id: badgeId }, { onConflict: 'user_id,badge_id' })
        .then(function(res) {
          var badge = BADGES[badgeId];
          if (badge) _showBadgePopup(badge);
        }).catch(function() { _earnedBadges[badgeId] = false; });
    });
  }

  // Award perfect quiz badge
  function checkPerfectQuiz(correct, total) {
    if (correct === total && total > 0) _awardBadge('perfect_quiz');
  }

  // ── Load earned badges on init ─────────────────────────────
  function _loadEarnedBadges() {
    _getUserId().then(function(uid) {
      if (!uid || !window.supabaseClient) return;
      window.supabaseClient.from('user_achievements')
        .select('badge_id').eq('user_id', uid)
        .then(function(res) {
          if (res.data) {
            res.data.forEach(function(row) {
              _earnedBadges[row.badge_id] = true;
              // Sync streak XP cache so we don't re-award on reload
              if (row.badge_id === 'streak_7') _streakXPAwarded['streak_7'] = true;
              if (row.badge_id === 'streak_30') _streakXPAwarded['streak_30'] = true;
            });
          }
        }).catch(function(e) { console.warn('[Gamification] badges select failed:', e && e.message); });
    });
  }

  // ── Confetti + Popup ───────────────────────────────────────
  function _showBadgePopup(badge) {
    _fireConfetti();
    // Create popup
    var popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.5);z-index:99999;background:linear-gradient(135deg,rgba(15,23,42,0.97),rgba(30,41,59,0.95));border:2px solid rgba(250,204,21,0.5);border-radius:20px;padding:32px 40px;text-align:center;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(250,204,21,0.2);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s;opacity:0;';
    popup.innerHTML = '<div style="font-size:56px;margin-bottom:12px;filter:drop-shadow(0 0 12px rgba(250,204,21,0.5));">' + badge.icon + '</div>' +
      '<div style="font-size:22px;font-weight:900;color:#fbbf24;text-shadow:0 0 16px rgba(250,204,21,0.4);margin-bottom:6px;">LOGRO DESBLOQUEADO</div>' +
      '<div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px;">' + badge.name + '</div>' +
      '<div style="font-size:14px;color:rgba(203,213,225,0.8);">' + badge.desc + '</div>';
    document.body.appendChild(popup);
    // Animate in
    requestAnimationFrame(function() {
      popup.style.transform = 'translate(-50%,-50%) scale(1)';
      popup.style.opacity = '1';
    });
    // Auto dismiss
    setTimeout(function() {
      popup.style.transform = 'translate(-50%,-50%) scale(0.8)';
      popup.style.opacity = '0';
      setTimeout(function() { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 400);
    }, 3500);
  }

  function _showLevelUp(newLevel) {
    _fireConfetti();
    var popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.5);z-index:99999;background:linear-gradient(135deg,rgba(15,23,42,0.97),rgba(30,41,59,0.95));border:2px solid rgba(56,189,248,0.5);border-radius:20px;padding:32px 40px;text-align:center;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(56,189,248,0.2);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s;opacity:0;';
    popup.innerHTML = '<div style="font-size:48px;margin-bottom:8px;">⬆️</div>' +
      '<div style="font-size:22px;font-weight:900;color:#38bdf8;text-shadow:0 0 16px rgba(56,189,248,0.4);margin-bottom:4px;">NIVEL ' + newLevel + '</div>' +
      '<div style="font-size:14px;color:rgba(203,213,225,0.8);">Sigue así, técnico</div>';
    document.body.appendChild(popup);
    requestAnimationFrame(function() {
      popup.style.transform = 'translate(-50%,-50%) scale(1)';
      popup.style.opacity = '1';
    });
    setTimeout(function() {
      popup.style.transform = 'translate(-50%,-50%) scale(0.8)';
      popup.style.opacity = '0';
      setTimeout(function() { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 400);
    }, 3000);
  }

  function _fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#38bdf8', '#22c55e', '#f87171', '#a855f7'] });
      setTimeout(function() {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 250);
    }
  }

  // ── Top 3 Banner (dashboard preview) ────────────────────────
  var _avatarColors = ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6','#6366f1','#8b5cf6','#a855f7','#ec4899','#f43f5e'];
  function _avColor(email) {
    if (!email) return _avatarColors[0];
    var h = 0;
    for (var i = 0; i < email.length; i++) h = ((h << 5) - h) + email.charCodeAt(i);
    return _avatarColors[Math.abs(h) % _avatarColors.length];
  }
  function _avInitials(name) {
    if (!name) return '??';
    var p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  function renderTop3Banner(containerId) {
    var container = document.getElementById(containerId);
    if (!container || !window.supabaseClient) return;
    container.innerHTML = '';
    window.supabaseClient.from('leaderboard_top')
      .select('*').limit(10)
      .then(function(res) {
        if (!res.data || res.data.length === 0) {
          container.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);font-size:clamp(10px,1.3vw,13px);">Sé el primero en la tabla</div>';
          return;
        }
        var rows = res.data;
        var emails = rows.map(function(r) { return r.email; }).filter(Boolean);
        var photoPromise = emails.length > 0
          ? usersDataSelf('public_user_lookup', { emails: emails })
          : Promise.resolve({ data: [] });
        photoPromise.then(function(photoRes) {
          var nameMap = {};
          (photoRes.data || []).forEach(function(u) {
            if (u.nombre) nameMap[u.email] = u.nombre;
          });
          _buildTop10Html(container, rows, nameMap);
        }).catch(function() {
          _buildTop10Html(container, rows, {});
        });
      }).catch(function() {
        container.innerHTML = '';
      });
  }

  function _buildTop10Html(container, rows, nameMap) {
    var medals = ['🥇','🥈','🥉'];
    var nameColors = ['#ffd700','#e2e8f0','#f0a060'];
    var html = '';
    rows.forEach(function(row, i) {
      var email = row.email || '';
      var name = nameMap[email] || row.nombre || 'Técnico';
      if (name.length > 20) name = name.substring(0, 20) + '…';
      var score = row.avg_score || 0;
      var isTop3 = i < 3;
      var nameCol = isTop3 ? nameColors[i] : 'rgba(226,232,240,0.85)';
      var rankStr = isTop3 ? medals[i] : '<span style="color:rgba(148,163,184,0.6);font-weight:700;">' + (i + 1) + '</span>';
      var bg = isTop3 ? 'background:rgba(56,189,248,0.06);border-radius:8px;' : '';

      html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;' + bg + '">';
      html += '<span style="font-size:14px;flex-shrink:0;width:22px;text-align:center;">' + rankStr + '</span>';
      html += '<span style="font-size:13px;font-weight:600;color:' + nameCol + ';flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.6);">' + name + '</span>';
      html += '<span style="font-size:12px;font-weight:600;color:rgba(56,189,248,0.8);flex-shrink:0;min-width:42px;text-align:right;">' + score + '%</span>';
      html += '</div>';
    });
    container.innerHTML = html;
  }

  // ── Full Leaderboard (top10RachaScreen) ──────────────────
  var MODULE_BADGES = {
    epa608StudyScreen:       '📚 EPA 608',
    a2lStudyScreen:          '🧊 A2L',
    calefaccionStudyScreen:  '🔥 Calefacción',
    refriStudyScreen:        '❄️ Refrigeración',
    nateStudyScreen:         '🎓 NATE',
    nateSeniorStudyScreen:   '🎓 NATE Sr',
    oshaStudyScreen:         '⚠️ OSHA',
    etStudyScreen:           '⚡ Electricidad'
  };

  function renderFullLeaderboard(containerId) {
    var container = document.getElementById(containerId);
    if (!container || !window.supabaseClient) return;
    container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(148,163,184,0.7);font-size:14px;">Cargando leaderboard...</div>';
    var email = _userEmail || localStorage.getItem('tecnico_email');

    // Fetch leaderboard + screen_events for module badges in parallel
    Promise.all([
      window.supabaseClient.from('leaderboard_top').select('*').limit(10),
      window.supabaseClient.from('screen_events').select('user_email, screen_id').in('screen_id', Object.keys(MODULE_BADGES))
    ]).then(function(results) {
      var lbRes = results[0];
      var seRes = results[1];

      if (!lbRes.data || lbRes.data.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(148,163,184,0.7);font-size:14px;">No hay datos aún. ¡Sé el primero!</div>';
        return;
      }

      // Build module badge map: email → Set of screen_ids
      var modulesMap = {};
      if (seRes.data) {
        seRes.data.forEach(function(ev) {
          if (!ev.user_email) return;
          var key = ev.user_email.toLowerCase();
          if (!modulesMap[key]) modulesMap[key] = {};
          modulesMap[key][ev.screen_id] = true;
        });
      }

      var medals = ['🥇', '🥈', '🥉'];
      var html = '';
      lbRes.data.forEach(function(row, i) {
        var medal = i < 3 ? medals[i] : '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(148,163,184,0.15);font-size:13px;font-weight:800;color:rgba(148,163,184,0.8);">' + (i + 1) + '</span>';
        var name = row.nombre || 'Técnico';
        if (name.length > 20) name = name.substring(0, 20) + '…';
        var isMe = email && row.email && row.email.toLowerCase() === email.toLowerCase();
        var certs = row.total_certificates || 0;
        var avg = row.avg_score || 0;
        var streak = row.current_streak || 0;
        var xp = row.total_xp || 0;
        var attempts = row.total_attempts || 0;

        // Card style — gold for #1, highlight for current user
        var isFirst = i === 0;
        var cardBg = isFirst ? 'linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.04))' : (isMe ? 'linear-gradient(135deg,rgba(56,189,248,0.12),rgba(56,189,248,0.04))' : 'rgba(15,23,42,0.6)');
        var cardBorder = isFirst ? '1px solid rgba(255,215,0,0.4)' : (isMe ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(148,163,184,0.1)');
        var glow = isFirst ? 'box-shadow:0 0 24px rgba(255,215,0,0.15);' : (isMe ? 'box-shadow:0 0 16px rgba(56,189,248,0.1);' : '');

        // Glare ONLY on #1
        var glareHtml = isFirst ? '<div style="position:absolute;top:-50%;left:0;width:60%;height:200%;background:linear-gradient(105deg,transparent 40%,rgba(255,215,0,0.15) 45%,rgba(255,240,180,0.25) 50%,rgba(255,215,0,0.15) 55%,transparent 60%);transform:translateX(-120%) skewX(-15deg);animation:rowGlare 3s ease-in-out infinite;pointer-events:none;"></div>' : '';

        html += '<div style="position:relative;overflow:hidden;background:' + cardBg + ';border:' + cardBorder + ';border-radius:14px;padding:14px 16px;margin-bottom:10px;' + glow + '">';
        html += glareHtml;
        // Row 1: medal + name + certs
        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;position:relative;z-index:1;">';
        html += '<div style="font-size:24px;min-width:32px;text-align:center;">' + medal + '</div>';
        html += '<div style="flex:1;">';
        html += '<div style="font-size:15px;font-weight:800;color:' + (isFirst ? '#ffd700' : isMe ? '#38bdf8' : '#e2e8f0') + ';">' + name + (isMe ? ' (Tú)' : '') + '</div>';
        html += '<div style="font-size:13px;color:rgba(148,163,184,0.6);margin-top:1px;">🏅 ' + certs + ' certificados · ' + attempts + ' exámenes</div>';
        html += '</div>';
        html += '<div style="text-align:right;">';
        html += '<div style="font-size:16px;font-weight:900;color:#fbbf24;">📊 ' + avg + '%</div>';
        html += '<div style="font-size:13px;color:rgba(148,163,184,0.5);">promedio</div>';
        html += '</div>';
        html += '</div>';
        // Row 2: streak + XP
        html += '<div style="display:flex;gap:12px;font-size:12px;margin-bottom:6px;position:relative;z-index:1;">';
        html += '<span style="color:#f97316;">🔥 ' + streak + ' días racha</span>';
        html += '<span style="color:#fbbf24;">⭐ ' + xp.toLocaleString() + ' XP</span>';
        html += '</div>';
        // Row 3: module badges
        var userModules = modulesMap[(row.email || '').toLowerCase()] || {};
        var badgeHtml = '';
        Object.keys(MODULE_BADGES).forEach(function(screenId) {
          if (userModules[screenId]) {
            badgeHtml += '<span style="background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.2);color:#7dd3fc;font-size:13px;padding:2px 6px;border-radius:6px;white-space:nowrap;">' + MODULE_BADGES[screenId] + '</span>';
          }
        });
        if (badgeHtml) {
          html += '<div style="display:flex;flex-wrap:wrap;gap:4px;position:relative;z-index:1;">' + badgeHtml + '</div>';
        }
        html += '</div>';
      });
      container.innerHTML = html;
    }).catch(function() {
      container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(239,68,68,0.7);font-size:14px;">Error cargando leaderboard</div>';
    });
  }

  // ── Dashboard XP bar ───────────────────────────────────────
  function renderXPBar(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    _ensureStats().then(function(stats) {
      if (!stats) { container.innerHTML = ''; return; }
      var level = stats.level || 1;
      var xp = stats.xp || 0;
      var currentLevelXP = LEVELS[level - 1] || 0;
      var nextLevelXP = LEVELS[level] || LEVELS[LEVELS.length - 1];
      var progress = nextLevelXP > currentLevelXP ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;
      if (progress > 100) progress = 100;

      container.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin:8px 0;">' +
        '<div style="font-size:13px;font-weight:800;color:#38bdf8;min-width:44px;">Nv.' + level + '</div>' +
        '<div style="flex:1;height:8px;background:rgba(30,41,59,0.8);border-radius:4px;overflow:hidden;border:1px solid rgba(56,189,248,0.2);">' +
        '<div style="width:' + progress.toFixed(1) + '%;height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8);border-radius:4px;transition:width 0.6s;"></div>' +
        '</div>' +
        '<div style="font-size:13px;color:rgba(148,163,184,0.7);min-width:60px;text-align:right;">' + xp.toLocaleString() + ' XP</div>' +
        '</div>';
    });
  }

  // ── Init ───────────────────────────────────────────────────
  function initGamification() {
    _loadEarnedBadges();
    _ensureStats();
    renderTop3Banner('leaderboardTop10');
    renderXPBar('xpBarContainer');
  }

  // ── Expose globally ────────────────────────────────────────
  window.Gamification = {
    init: initGamification,
    awardXP: awardXP,
    recordAnswer: recordAnswer,
    recordToolUse: recordToolUse,
    syncStreak: syncStreak,
    checkPerfectQuiz: checkPerfectQuiz,
    checkSocialBadges: checkSocialBadges,
    renderTop3Banner: renderTop3Banner,
    renderFullLeaderboard: renderFullLeaderboard,
    renderXPBar: renderXPBar,
    BADGES: BADGES
  };

})();
