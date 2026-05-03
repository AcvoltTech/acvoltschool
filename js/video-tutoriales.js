// ============================================
// VIDEO TUTORIALES — Student Library + Paywall + Watermarked Player
// Depends on: tutorial-videos.js (TV_CATEGORIES, TV_TIERS, tvCheckStudentAccess, tvLoadStudentLibrary)
// ============================================

var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

// ---- LocalStorage helpers ----
function getVtDonation() {
  try {
    return JSON.parse(localStorage.getItem('maestroac_video_donation') || 'null');
  } catch(e) { return null; }
}

function saveVtDonation(d) {
  try { localStorage.setItem('maestroac_video_donation', JSON.stringify(d)); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
}

// ---- Stripe return detection ----
function checkVtStripeReturn() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('video_donation') === 'success') {
    var d = getVtDonation() || {};
    d.active = true;
    d.activated_at = new Date().toISOString();
    saveVtDonation(d);
    window.history.replaceState({}, '', window.location.pathname);
    var nombre = '';
    try { var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); nombre = t.nombre || 'técnico'; } catch(e) { nombre = 'técnico'; }
    setTimeout(function() {
      if (typeof window.showToast === 'function') window.showToast(_tc('vt_thanks_access', '¡Gracias, ') + nombre + _tc('vt_thanks_suffix', '! Ya tienes acceso completo a Online HVAC Certification de ACVOLT.'), 'success'); else window.MaestroDialog.alert({title: '', message: _tc('vt_thanks_access', '🎉 ¡Gracias, ') + nombre + _tc('vt_thanks_suffix', '! Ya tienes acceso completo a Online HVAC Certification de ACVOLT. 🎬'), kind: 'success'});
    }, 500);
    try { showScreen('videoTutorialesScreen'); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
  }
}

// ---- Access check ----
var _vtAccessCache = null;
async function vtCheckAccess() {
  // Clon $59.99 unlocks all videos — always grant full access.
  _vtAccessCache = { type: 'clon', tier: 'platino' };
  return _vtAccessCache;
  // 0. iOS App Store — full access
  if (window.isIOSAppStore) { _vtAccessCache = { type: 'ios', tier: 'platino' }; return _vtAccessCache; }
  // Fallback: direct cookie/UA check
  try { if(document.cookie.indexOf('iOS App Store')!==-1||(navigator.userAgent||'').indexOf('PWAShell')!==-1){ window.isIOSAppStore=true; _vtAccessCache={type:'ios',tier:'platino'}; return _vtAccessCache; } } catch(e){}
  // 0b. Admin infiltrado — full access
  if (typeof isAdminStudent === 'function' && isAdminStudent()) { _vtAccessCache = { type: 'admin', tier: 'platino' }; return _vtAccessCache; }
  // 1. Check localStorage (Stripe donor)
  var d = getVtDonation();
  if (d && d.active) { _vtAccessCache = { type: 'donation', tier: 'platino' }; return _vtAccessCache; }

  // 2. CRM group students (grandfathered) get full video access
  var email = '';
  try { var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); email = (t.email || '').toLowerCase().trim(); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
  if (email) {
    // Check if student has CRM groups (existing grandfathered students)
    var tierLvl = (typeof getMembershipTierLevel === 'function') ? getMembershipTierLevel() : 0;
    if (tierLvl >= 2) { _vtAccessCache = { type: 'granted', tier: 'platino' }; return _vtAccessCache; }

    // Check video_access table (admin-granted)
    if (typeof tvCheckStudentAccess === 'function') {
      var access = await tvCheckStudentAccess(email);
      if (access) { _vtAccessCache = { type: 'granted', tier: access.tier_granted || 'basico', data: access }; return _vtAccessCache; }
    }
  }

  _vtAccessCache = null;
  return null;
}

// ---- Progress helpers (reuses tv_progress key from admin player) ----
function vtGetProgress(videoId) {
  try {
    var all = JSON.parse(localStorage.getItem('tv_progress') || '{}');
    return all[videoId] || 0;
  } catch(e) { return 0; }
}

function vtSaveProgress(videoId, time) {
  try {
    var all = JSON.parse(localStorage.getItem('tv_progress') || '{}');
    all[videoId] = Math.round(time);
    localStorage.setItem('tv_progress', JSON.stringify(all));
  } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
}

function vtFormatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function _escHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ---- State ----
var _vtVideos = [];
var _vtFilter = 'all';
var _vtSearch = '';
var _vtQuizPassed = {}; // { videoId: true } — quizzes the student has passed
var _vtCurrentQuiz = null; // active quiz state
var _vtCurrentView = 'bubbles'; // 'bubbles' | 'series'
var _vtCurrentSeries = null;    // category id when in series view

// ---- Series stats helper ----
function vtGetSeriesStats(catId) {
  var catVideos = _vtVideos.filter(function(v) { return (v.category || 'general') === catId; });
  var totalVideos = catVideos.length;
  var totalSeconds = 0;
  var watchedCount = 0;
  var quizzesPassed = 0;
  var quizzesTotal = 0;
  var watchedSeconds = 0;

  catVideos.forEach(function(v) {
    var dur = v.duration_seconds || 0;
    totalSeconds += dur;
    var prog = vtGetProgress(v.id);
    watchedSeconds += Math.min(prog, dur);
    // Video counts as watched if 90%+ viewed OR quiz passed
    if ((dur > 0 && prog >= dur * 0.90) || _vtQuizPassed[v.id]) {
      watchedCount++;
    }
    if (v.quiz_questions && Array.isArray(v.quiz_questions) && v.quiz_questions.length > 0) {
      quizzesTotal++;
      if (_vtQuizPassed[v.id]) quizzesPassed++;
    }
  });

  var progressPct = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  var seriesComplete = totalVideos > 0 && watchedCount >= totalVideos && (quizzesTotal === 0 || quizzesPassed >= quizzesTotal);
  var totalHours = totalSeconds / 3600;
  var hours = watchedSeconds / 3600;
  var credits = Math.floor(hours);
  var points = credits * 100;

  return {
    totalVideos: totalVideos,
    totalSeconds: totalSeconds,
    totalHours: totalHours,
    watchedCount: watchedCount,
    watchedSeconds: watchedSeconds,
    quizzesPassed: quizzesPassed,
    quizzesTotal: quizzesTotal,
    progressPct: progressPct,
    seriesComplete: seriesComplete,
    hours: hours,
    credits: credits,
    points: points
  };
}

// ============================================
// WELCOME SCREEN — shown once before accessing courses
// ============================================
function vtHasSeenWelcome() {
  try { return localStorage.getItem('vt_welcome_seen') === '1'; } catch(e) { return false; }
}

function vtMarkWelcomeSeen() {
  try { localStorage.setItem('vt_welcome_seen', '1'); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
}

function vtRenderWelcome(screen, onContinue) {
  // Get real name: try nombre first, fallback to first part of email, then 'Técnico'
  var nombre = 'Técnico';
  try {
    var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
    if (t.nombre && t.nombre !== t.email && !t.nombre.includes('@')) {
      nombre = t.nombre.split(' ')[0]; // First name only
    } else if (t.email) {
      nombre = 'Técnico';
    }
  } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }

  // Try to fetch real name from Supabase in background
  var titleEl = null;
  function _vtUpdateName() {
    try {
      var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
      var email = (t.email || '').toLowerCase().trim();
      if (email && typeof supabaseClient !== 'undefined' && supabaseClient) {
        usersDataSelf('public_user_lookup', { emails: [email] }).then(function(res) {
          if (res.data && res.data[0] && res.data[0].nombre) {
            var realName = res.data[0].nombre.split(' ')[0];
            titleEl = document.querySelector('.vt-welcome-title');
            if (titleEl) titleEl.textContent = (typeof _t === 'function' ? _t('acvolt_welcome_name') : '¡Bienvenido') + ', ' + realName + '!';
          }
        });
      }
    } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
  }

  screen.innerHTML =
    '<div class="vt-welcome-overlay">' +
      '<div class="vt-welcome-card">' +

        // Header with ACVOLT logo
        '<div class="vt-welcome-header">' +
          '<img src="acvolt-school-logo.jpg" alt="ACVOLT Tech School" class="vt-welcome-logo" onerror="this.style.display=\'none\'">' +
          '<h1 class="vt-welcome-title">' + _tc('vt_welcome', '¡Bienvenido') + ', ' + _escHtml(nombre) + '!</h1>' +
          '<p class="vt-welcome-subtitle">Online HVAC Certification — AC VOLT Tech School</p>' +
        '</div>' +

        // Welcome video (Cloudflare Stream)
        '<div class="vt-welcome-video-wrap">' +
          '<iframe src="https://iframe.videodelivery.net/f94f72bea33b09dbd092967d7f1ed10a" style="border:none;width:100%;aspect-ratio:16/9;border-radius:12px;" allow="autoplay;fullscreen;encrypted-media" allowfullscreen></iframe>' +
        '</div>' +

        // Why certifications matter
        '<div class="vt-welcome-message">' +
          '<p style="font-size:16px;font-weight:600;color:#e6edf3;margin-bottom:16px;">' + _tc('vt_why_certs', '¿Por qué necesitas estas certificaciones?') + '</p>' +

          '<div class="vt-welcome-cert-item">' +
            '<div class="vt-welcome-cert-icon">🦺</div>' +
            '<div class="vt-welcome-cert-text">' +
              '<strong style="color:#f87171;">OSHA 10 / OSHA 30</strong><br>' +
              _tc('vt_osha_desc', 'Sin OSHA no puedes pisar un sitio de trabajo comercial. Los empleadores lo exigen — es tu licencia para trabajar seguro.') +
            '</div>' +
          '</div>' +

          '<div class="vt-welcome-cert-item">' +
            '<div class="vt-welcome-cert-icon">📋</div>' +
            '<div class="vt-welcome-cert-text">' +
              '<strong style="color:#34d399;">EPA Sección 608</strong><br>' +
              _tc('vt_epa_desc', 'La ley federal exige esta certificación para manejar refrigerantes. Sin ella no puedes comprar refrigerante ni hacer recovery — multas de hasta $44,539 por día.') +
            '</div>' +
          '</div>' +

          '<div class="vt-welcome-cert-item">' +
            '<div class="vt-welcome-cert-icon">❄️</div>' +
            '<div class="vt-welcome-cert-text">' +
              '<strong style="color:#22d3ee;">' + _tc('vt_hvac_course', 'Curso Completo HVAC') + '</strong><br>' +
              _tc('vt_hvac_desc', 'Herramientas, refrigeración, electricidad, soldadura, diagnóstico, mini splits, heat pumps, sistemas centrales y más.') +
            '</div>' +
          '</div>' +

          '<div class="vt-welcome-cert-item">' +
            '<div class="vt-welcome-cert-icon">⚡</div>' +
            '<div class="vt-welcome-cert-text">' +
              '<strong style="color:#a78bfa;">' + _tc('vt_advanced_specialties', 'Especialidades Avanzadas') + '</strong><br>' +
              _tc('vt_advanced_desc', 'A2L refrigerantes, controles eléctricos, diseño de ductos, cálculos de carga — lo que te separa del resto y te da los mejores trabajos.') +
            '</div>' +
          '</div>' +

        '</div>' +

        // Motivational close
        '<p style="text-align:center;color:#22d3ee;font-weight:600;font-size:15px;margin:0 0 24px;padding:0 8px;">' + _tc('vt_motivational', 'Estudia a tu ritmo, completa los quizzes, obtén tus certificados. ¡Échale ganas! 💪') + '</p>' +

        // CTA button
        '<button class="vt-welcome-btn" id="vtWelcomeBtn">' +
          '🚀 ' + _tc('vt_start_certification', 'Comenzar Mi Certificación') +
        '</button>' +

        // Skip link
        '<div style="margin-top:16px;">' +
          '<a href="#" id="vtWelcomeSkip" class="vt-welcome-skip">' + _tc('vt_skip_to_courses', 'Saltar e ir directo a los cursos →') + '</a>' +
        '</div>' +

      '</div>' +
    '</div>';

  // Fetch real name from DB
  _vtUpdateName();

  // Inject styles for welcome screen
  if (!document.getElementById('vtWelcomeStyles')) {
    var style = document.createElement('style');
    style.id = 'vtWelcomeStyles';
    style.textContent =
      '.vt-welcome-overlay{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:20px;background:#0d1117;}' +
      '.vt-welcome-card{max-width:600px;width:100%;background:linear-gradient(145deg,#161b22,#1c2333);border-radius:20px;padding:36px 28px;text-align:center;border:1px solid #30363d;box-shadow:0 8px 32px rgba(0,0,0,.4);}' +
      '.vt-welcome-header{margin-bottom:24px;}' +
      '.vt-welcome-logo{width:100px;height:100px;object-fit:contain;border-radius:50%;background:#fff;padding:6px;margin-bottom:14px;box-shadow:0 4px 20px rgba(34,211,238,.25);}' +
      '.vt-welcome-title{color:#e6edf3;font-size:24px;font-weight:700;margin:0 0 6px;}' +
      '.vt-welcome-subtitle{color:#22d3ee;font-size:14px;font-weight:500;margin:0;letter-spacing:.5px;text-transform:uppercase;}' +
      '.vt-welcome-video-wrap{margin:0 auto 24px;max-width:480px;}' +
      '.vt-welcome-video-wrap iframe{width:100%;border-radius:12px;aspect-ratio:16/9;}' +
      '.vt-welcome-message{text-align:left;color:#c9d1d9;font-size:14px;line-height:1.6;margin-bottom:20px;padding:0 8px;}' +
      '.vt-welcome-message p{margin:0 0 14px;}' +
      '.vt-welcome-cert-item{display:flex;align-items:flex-start;gap:12px;background:#0d1117;border:1px solid #1f2937;border-radius:12px;padding:14px;margin-bottom:10px;}' +
      '.vt-welcome-cert-icon{font-size:28px;flex-shrink:0;width:36px;text-align:center;padding-top:2px;}' +
      '.vt-welcome-cert-text{font-size:13px;line-height:1.5;color:#c9d1d9;}' +
      '.vt-welcome-cert-text strong{font-size:14px;display:inline-block;margin-bottom:3px;}' +
      '.vt-welcome-btn{display:inline-block;background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#0d1117;font-size:17px;font-weight:700;border:none;border-radius:12px;padding:16px 40px;cursor:pointer;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 16px rgba(34,211,238,.3);}' +
      '.vt-welcome-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(34,211,238,.45);}' +
      '.vt-welcome-btn:active{transform:translateY(0);}' +
      '.vt-welcome-skip{color:#586069;font-size:13px;text-decoration:none;transition:color .2s;}' +
      '.vt-welcome-skip:hover{color:#94a3b8;text-decoration:underline;}' +
      '@media(max-width:480px){.vt-welcome-card{padding:24px 16px;}.vt-welcome-title{font-size:20px;}.vt-welcome-message{font-size:14px;}}';
    document.head.appendChild(style);
  }

  document.getElementById('vtWelcomeBtn').addEventListener('click', function() {
    vtMarkWelcomeSeen();
    onContinue();
  });
  document.getElementById('vtWelcomeSkip').addEventListener('click', function(e) {
    e.preventDefault();
    vtMarkWelcomeSeen();
    onContinue();
  });
}

// ============================================
// MAIN INIT — always shows full library (the "menu")
// ============================================
var _vtInitInProgress = false;
async function initVideoTutoriales() {
  if (_vtInitInProgress) return;
  _vtInitInProgress = true;

  // Reset series state before cleanup to prevent wasteful re-render
  _vtCurrentView = 'bubbles';
  _vtCurrentSeries = null;
  // Clean up any open player before replacing DOM
  try { vtClosePlayer(); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }

  var screen = document.getElementById('videoTutorialesScreen');
  if (!screen) { _vtInitInProgress = false; return; }

  // Show welcome screen on first visit
  if (!vtHasSeenWelcome()) {
    _vtInitInProgress = false;
    vtRenderWelcome(screen, function() {
      // After welcome, load the library
      _vtInitInProgress = false;
      initVideoTutoriales();
    });
    return;
  }

  screen.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;min-height:60vh;color:#94a3b8;font-size:16px;">' + (typeof _t === 'function' ? _t('loading') : 'Cargando...') + '</div>';

  try {
    // Check access in background (caches result for play-time check)
    await vtCheckAccess();
    // Always load ALL videos so students can browse the full catalog
    await vtRenderLibrary(screen);
  } catch(err) {
    console.error('[VideoTutoriales] init error:', err);
    screen.innerHTML = '<div class="vt-library"><div class="vt-lib-header"><button class="vt-back-btn" onclick="showScreen(\'dashboardScreen\')">&larr;</button><h2 class="vt-lib-title">Online HVAC Certification</h2></div><div style="text-align:center;color:#f87171;padding:40px 20px;">' + _tc('vt_load_error', 'Error al cargar videos. Intenta de nuevo.') + '<br><button onclick="initVideoTutoriales()" style="margin-top:16px;padding:10px 24px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:14px;cursor:pointer;">🔄 Reintentar</button></div></div>';
  } finally {
    _vtInitInProgress = false;
  }
}

// ============================================
// VIDEO LIBRARY — always shown, full catalog
// ============================================
async function vtRenderLibrary(screen) {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) {
    screen.innerHTML = '<div class="vt-library"><div class="vt-lib-header"><button class="vt-back-btn" onclick="showScreen(\'dashboardScreen\')">&larr;</button><h2 class="vt-lib-title">Online HVAC Certification</h2></div><div style="text-align:center;color:#f87171;padding:40px 20px;">' + _tc('vt_connection_error', 'Error: No se pudo conectar al servidor. Intenta de nuevo.') + '</div></div>';
    return;
  }

  // Always load full catalog so students can browse everything
  try {
    var res = await supabaseClient.from('tutorial_videos').select('*').eq('active', true).order('sort_order').order('created_at', { ascending: false });
    _vtVideos = (res.data || []);
  } catch(e) { _vtVideos = []; }

  // Load quiz progress for this student
  _vtQuizPassed = {};
  try {
    var stuEmail = '';
    try { stuEmail = (JSON.parse(localStorage.getItem('tecnico_user') || '{}').email || '').toLowerCase().trim(); } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }
    if (stuEmail) {
      var qRes = await supabaseClient.from('video_quiz_attempts').select('video_id').eq('student_email', stuEmail).eq('passed', true);
      if (qRes.data) {
        qRes.data.forEach(function(r) { _vtQuizPassed[r.video_id] = true; });
      }
    }
  } catch(e) { /* quiz progress load failed, non-blocking */ }

  _vtFilter = 'all';
  _vtSearch = '';
  _vtCurrentView = 'bubbles';
  _vtCurrentSeries = null;

  // Collect categories that have videos
  var activeCats = TV_CATEGORIES.filter(function(c) {
    return _vtVideos.some(function(v) { return (v.category || 'general') === c.id; });
  });

  screen.innerHTML =
    '<div class="vt-library">' +
      '<div class="vt-lib-header">' +
        '<button class="vt-back-btn" onclick="showScreen(\'dashboardScreen\')">&larr;</button>' +
        '<h2 class="vt-lib-title">Online HVAC Certification</h2>' +
      '</div>' +
      '<div id="vtGlobalStats"></div>' +
      '<div class="vt-search-wrap">' +
        '<input type="text" class="vt-search" placeholder="' + _tc('vt_search_course', 'Buscar curso...') + '" oninput="vtSearchBubbles(this.value)" />' +
      '</div>' +
      '<div id="vtBubbleContainer"></div>' +
    '</div>' +
    '<div class="vt-player-overlay" id="vtPlayerOverlay" style="display:none;"></div>';

  vtRenderGlobalStats(activeCats);
  vtRenderBubbleGrid(activeCats);
}

// ============================================
// GLOBAL STATS BAR
// ============================================
function vtRenderGlobalStats(activeCats) {
  var el = document.getElementById('vtGlobalStats');
  if (!el) return;

  var totalHours = 0, totalPoints = 0, certsEarned = 0, certsTotal = activeCats.length;
  activeCats.forEach(function(c) {
    var s = vtGetSeriesStats(c.id);
    totalHours += s.hours;
    totalPoints += s.points;
    if (s.seriesComplete) certsEarned++;
  });

  el.innerHTML =
    '<div class="vt-series-stats">' +
      '<div class="vt-global-stat">' +
        '<div class="vt-global-stat-val">' + totalHours.toFixed(1) + '</div>' +
        '<div class="vt-global-stat-label">' + _tc('vt_hours_studied', 'Horas Estudiadas') + '</div>' +
      '</div>' +
      '<div class="vt-global-stat">' +
        '<div class="vt-global-stat-val">' + totalPoints + '</div>' +
        '<div class="vt-global-stat-label">' + _tc('vt_points', 'Puntos') + '</div>' +
      '</div>' +
      '<div class="vt-global-stat">' +
        '<div class="vt-global-stat-val">' + certsEarned + '/' + certsTotal + '</div>' +
        '<div class="vt-global-stat-label">' + _tc('vt_certificates', 'Certificados') + '</div>' +
      '</div>' +
    '</div>';
}

// ============================================
// BUBBLE GRID — Category cards
// ============================================
function vtRenderBubbleGrid(cats) {
  var container = document.getElementById('vtBubbleContainer');
  if (!container) return;

  if (cats.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:40px 20px;font-size:15px;">' + _tc('vt_no_courses', 'No hay cursos disponibles.') + '</div>';
    return;
  }

  var html = '<div class="vt-bubble-grid">';
  cats.forEach(function(c) {
    var s = vtGetSeriesStats(c.id);
    var certClass = s.seriesComplete ? 'vt-bubble-cert--earned' : (s.progressPct > 0 ? 'vt-bubble-cert--progress' : 'vt-bubble-cert--locked');
    var certText = s.seriesComplete ? '✅ ' + _tc('vt_cert_earned', 'Certificado Obtenido') : (s.progressPct > 0 ? s.progressPct + '% ' + _tc('vt_completed', 'completado') : '🔒 ' + _tc('vt_cert_locked', 'Certificado Bloqueado'));

    html +=
      '<div class="vt-bubble-card" onclick="vtOpenSeries(\'' + _escHtml(c.id) + '\')">' +
        '<div class="vt-bubble-emoji">' + c.emoji + '</div>' +
        '<div class="vt-bubble-name">' + _escHtml(c.name) + '</div>' +
        '<div class="vt-bubble-meta">' + s.totalVideos + ' videos · ' + s.totalHours.toFixed(1) + 'h</div>' +
        '<div class="vt-bubble-progress-bar"><div class="vt-bubble-progress-fill" style="width:' + s.progressPct + '%"></div></div>' +
        '<div class="vt-bubble-cert ' + certClass + '">' + certText + '</div>' +
      '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

// ---- Search bubbles ----
function vtSearchBubbles(val) {
  var term = (val || '').toLowerCase().trim();
  var activeCats = TV_CATEGORIES.filter(function(c) {
    var hasVideos = _vtVideos.some(function(v) { return (v.category || 'general') === c.id; });
    if (!hasVideos) return false;
    if (!term) return true;
    // Match category name or any video title in category
    if (c.name.toLowerCase().indexOf(term) !== -1) return true;
    return _vtVideos.some(function(v) {
      return (v.category || 'general') === c.id && (v.title || '').toLowerCase().indexOf(term) !== -1;
    });
  });
  vtRenderBubbleGrid(activeCats);
}

// ============================================
// SERIES DETAIL PAGE — Vertical list (Udemy-style)
// ============================================
function vtOpenSeries(catId) {
  _vtCurrentView = 'series';
  _vtCurrentSeries = catId;

  var catObj = TV_CATEGORIES.find(function(c) { return c.id === catId; });
  if (!catObj) return;

  var catVideos = _vtVideos.filter(function(v) { return (v.category || 'general') === catId; });
  var stats = vtGetSeriesStats(catId);

  var container = document.getElementById('vtBubbleContainer');
  var statsEl = document.getElementById('vtGlobalStats');
  var searchWrap = document.querySelector('.vt-search-wrap');
  if (statsEl) statsEl.style.display = 'none';
  if (searchWrap) searchWrap.style.display = 'none';
  if (!container) return;

  // Header
  var html =
    '<div class="vt-series-header">' +
      '<button class="vt-back-btn" onclick="vtBackToBubbles()" style="margin-right:10px">&larr;</button>' +
      '<div class="vt-bubble-emoji" style="font-size:32px">' + catObj.emoji + '</div>' +
      '<div style="flex:1">' +
        '<h3 style="color:#e2e8f0;margin:0;font-size:18px">' + _escHtml(catObj.name) + '</h3>' +
        '<div style="color:#94a3b8;font-size:13px">' + stats.totalVideos + ' videos · ' + stats.totalHours.toFixed(1) + 'h · ' + stats.quizzesTotal + ' quizzes</div>' +
      '</div>' +
    '</div>';

  // Progress card
  html +=
    '<div class="vt-series-progress-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
        '<span style="color:#0F0F0F;font-size:15px;font-weight:700">' + _tc('vt_your_progress', 'Tu Progreso') + '</span>' +
        '<span style="color:' + (stats.progressPct === 100 ? '#10b981' : '#3b82f6') + ';font-size:22px;font-weight:bold">' + stats.progressPct + '%</span>' +
      '</div>' +
      '<div class="vt-bubble-progress-bar" style="height:8px;margin-bottom:12px"><div class="vt-bubble-progress-fill" style="width:' + stats.progressPct + '%"></div></div>' +
      '<div style="display:flex;justify-content:space-around;text-align:center">' +
        '<div><div style="color:#0F0F0F;font-size:16px;font-weight:700">' + stats.watchedCount + '/' + stats.totalVideos + '</div><div style="color:#3D3D3A;font-size:11px">Videos</div></div>' +
        '<div><div style="color:#0F0F0F;font-size:16px;font-weight:700">' + stats.hours.toFixed(1) + '</div><div style="color:#3D3D3A;font-size:11px">' + _tc('vt_hours', 'Horas') + '</div></div>' +
        '<div><div style="color:#0F0F0F;font-size:16px;font-weight:700">' + stats.points + '</div><div style="color:#3D3D3A;font-size:11px">' + _tc('vt_points', 'Puntos') + '</div></div>' +
        '<div><div style="color:#0F0F0F;font-size:16px;font-weight:700">' + stats.quizzesPassed + '/' + stats.quizzesTotal + '</div><div style="color:#3D3D3A;font-size:11px">Quizzes</div></div>' +
      '</div>' +
    '</div>';

  // Vertical list
  html += '<div class="vt-series-list">';
  catVideos.forEach(function(v, idx) {
    var unlocked = vtIsVideoUnlocked(v);
    var quizStatus = vtGetQuizStatus(v);
    var dur = vtFormatDuration(v.duration_seconds);
    var prog = vtGetProgress(v.id);
    var durSec = v.duration_seconds || 0;
    var pct = (durSec > 0 && prog > 0) ? Math.min(100, Math.round((prog / durSec) * 100)) : 0;
    var watched = (durSec > 0 && prog >= durSec * 0.90) || _vtQuizPassed[v.id];

    // Status icon
    var statusIcon, statusClass;
    if (!unlocked) {
      statusIcon = '🔒';
      statusClass = 'vt-list-status--locked';
    } else if (watched) {
      statusIcon = '✓';
      statusClass = 'vt-list-status--done';
    } else {
      statusIcon = '' + (idx + 1);
      statusClass = 'vt-list-status--pending';
    }

    // Quiz badge
    var quizBadge = '';
    if (quizStatus === 'passed') {
      quizBadge = '<span class="vt-list-quiz vt-list-quiz--passed">✅ ' + _tc('vt_quiz_passed', 'Quiz aprobado') + '</span>';
    } else if (quizStatus === 'pending') {
      quizBadge = '<span class="vt-list-quiz vt-list-quiz--pending">📝 ' + _tc('vt_quiz_pending', 'Quiz pendiente') + '</span>';
    }

    var clickAttr = unlocked ? 'onclick="vtShowInfoCard(\'' + _escHtml(v.id) + '\')" style="cursor:pointer"' : 'style="opacity:0.5;cursor:not-allowed"';

    html +=
      '<div class="vt-list-item" ' + clickAttr + '>' +
        '<div class="vt-list-status ' + statusClass + '">' + statusIcon + '</div>' +
        '<div class="vt-list-item-body">' +
          '<div class="vt-list-item-title">' + _escHtml(v.title) + '</div>' +
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
            '<span style="color:#3D3D3A;font-size:12px">⏱ ' + dur + '</span>' +
            quizBadge +
          '</div>' +
          (pct > 0 && !watched ? '<div class="vt-bubble-progress-bar" style="height:4px;margin-top:6px"><div class="vt-bubble-progress-fill" style="width:' + pct + '%"></div></div>' : '') +
        '</div>' +
      '</div>';
  });
  html += '</div>';

  // Certificate section at bottom
  if (stats.seriesComplete) {
    html +=
      '<div class="vt-series-cert vt-series-cert--earned">' +
        '<div style="font-size:36px;margin-bottom:8px">🏆</div>' +
        '<div style="color:#FFD700;font-size:16px;font-weight:bold;margin-bottom:4px">' + _tc('vt_series_completed', '¡Serie Completada!') + '</div>' +
        '<div style="color:#3D3D3A;font-size:13px;margin-bottom:12px">' + stats.totalVideos + ' videos · ' + stats.totalHours.toFixed(1) + 'h · ' + stats.points + ' puntos</div>' +
        '<button onclick="vtShowSeriesCertificate(\'' + _escHtml(catId) + '\')" style="padding:10px 28px;border-radius:10px;border:none;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;font-size:14px;font-weight:bold;cursor:pointer">🏅 Ver Certificado</button>' +
      '</div>';
  } else {
    html +=
      '<div class="vt-series-cert vt-series-cert--locked">' +
        '<div style="font-size:28px;margin-bottom:6px">🔒</div>' +
        '<div style="color:#3D3D3A;font-size:14px;font-weight:600">' + _tc('vt_cert_locked', 'Certificado Bloqueado') + '</div>' +
        '<div style="color:#57574F;font-size:12px;margin-top:4px">' + _tc('vt_cert_locked_desc', 'Completa todos los videos y quizzes para obtener tu certificado') + '</div>' +
      '</div>';
  }

  container.innerHTML = html;
}

function vtBackToBubbles() {
  _vtCurrentView = 'bubbles';
  _vtCurrentSeries = null;
  var screen = document.getElementById('videoTutorialesScreen');
  if (screen) {
    var statsEl = document.getElementById('vtGlobalStats');
    var searchWrap = screen.querySelector('.vt-search-wrap');
    if (statsEl) statsEl.style.display = '';
    if (searchWrap) searchWrap.style.display = '';

    var activeCats = TV_CATEGORIES.filter(function(c) {
      return _vtVideos.some(function(v) { return (v.category || 'general') === c.id; });
    });
    vtRenderGlobalStats(activeCats);
    vtRenderBubbleGrid(activeCats);
  }
}

// ---- Category filter ----
function vtFilterCat(cat) {
  _vtFilter = cat;
  var allTabs = document.querySelectorAll('.vt-cat-tab');
  allTabs.forEach(function(t) {
    t.classList.toggle('active', t.getAttribute('data-cat') === cat);
  });
  vtRenderGrid();
}

// ---- Search ----
function vtSearchVideos(val) {
  _vtSearch = (val || '').toLowerCase().trim();
  vtRenderGrid();
}

// ---- Lock/unlock logic per category ----
function vtIsVideoUnlocked(video) {
  // Get all videos in this category, sorted by sort_order then created_at
  var cat = video.category || 'general';
  var catVideos = _vtVideos.filter(function(v) { return (v.category || 'general') === cat; });
  // catVideos are already sorted from the DB query (sort_order, then created_at desc)

  var idx = catVideos.findIndex(function(v) { return v.id === video.id; });
  // First video in category is always unlocked
  if (idx <= 0) return true;

  // Check if previous video in same category has a quiz
  var prevVideo = catVideos[idx - 1];
  if (!prevVideo.quiz_questions || !Array.isArray(prevVideo.quiz_questions) || prevVideo.quiz_questions.length === 0) {
    // Previous video has no quiz → this video is unlocked
    return true;
  }

  // Previous video has quiz → student must have passed it
  return _vtQuizPassed[prevVideo.id] === true;
}

function vtGetQuizStatus(video) {
  if (!video.quiz_questions || !Array.isArray(video.quiz_questions) || video.quiz_questions.length === 0) return 'none';
  if (_vtQuizPassed[video.id]) return 'passed';
  return 'pending';
}

// ---- Render video card grid ----
function vtRenderGrid() {
  var grid = document.getElementById('vtGrid');
  if (!grid) return;

  var filtered = _vtVideos.filter(function(v) {
    if (_vtFilter !== 'all' && v.category !== _vtFilter) return false;
    if (_vtSearch) {
      var title = (v.title || '').toLowerCase();
      var desc = (v.description || '').toLowerCase();
      if (title.indexOf(_vtSearch) === -1 && desc.indexOf(_vtSearch) === -1) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:40px 20px;font-size:15px;">' + _tc('vt_no_videos', 'No se encontraron videos.') + '</div>';
    return;
  }

  var html = '';
  filtered.forEach(function(v) {
    var thumb = v.thumbnail_url || '';
    var thumbStyle = thumb ? "background-image:url('" + _escHtml(thumb).replace(/'/g, "\\'").replace(/\)/g, '%29') + "')" : '';
    var catObj = TV_CATEGORIES.find(function(c) { return c.id === v.category; });
    var catLabel = catObj ? catObj.emoji + ' ' + catObj.name : '';
    var dur = vtFormatDuration(v.duration_seconds);
    var progress = vtGetProgress(v.id);
    var pct = (v.duration_seconds && progress > 0) ? Math.min(100, Math.round((progress / v.duration_seconds) * 100)) : 0;

    var unlocked = vtIsVideoUnlocked(v);
    var quizStatus = vtGetQuizStatus(v);

    // Quiz badge
    var quizBadge = '';
    if (quizStatus === 'passed') {
      quizBadge = '<span style="background:#065f46;color:#6ee7b7;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">✅ ' + _tc('vt_quiz_passed', 'Quiz aprobado') + '</span>';
    } else if (quizStatus === 'pending') {
      quizBadge = '<span style="background:#1e3a5f;color:#93c5fd;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">📝 ' + _tc('vt_quiz_pending', 'Quiz pendiente') + '</span>';
    }

    if (unlocked) {
      html +=
        '<div class="vt-card" onclick="vtShowInfoCard(\'' + _escHtml(v.id) + '\')" style="cursor:pointer">' +
          '<div class="vt-card-thumb"' + (thumbStyle ? ' style="' + thumbStyle + '"' : '') + '>' +
            (thumb ? '' : '<div class="vt-card-play-icon">▶</div>') +
            '<span class="vt-card-dur">' + dur + '</span>' +
          '</div>' +
          '<div class="vt-card-body">' +
            '<div class="vt-card-title">' + _escHtml(v.title) + '</div>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
              (catLabel ? '<span class="vt-card-badge">' + catLabel + '</span>' : '') +
              quizBadge +
            '</div>' +
            (pct > 0 ? '<div class="vt-card-progress"><div class="vt-card-progress-fill" style="width:' + pct + '%"></div></div>' : '') +
          '</div>' +
        '</div>';
    } else {
      // Locked card — grayed out with lock icon
      html +=
        '<div class="vt-card" style="opacity:0.5;cursor:not-allowed;position:relative" title="Completa el quiz del video anterior para desbloquear">' +
          '<div class="vt-card-thumb"' + (thumbStyle ? ' style="' + thumbStyle + ';filter:grayscale(80%)"' : ' style="filter:grayscale(80%)"') + '>' +
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:36px;z-index:2">🔒</div>' +
            '<span class="vt-card-dur">' + dur + '</span>' +
          '</div>' +
          '<div class="vt-card-body">' +
            '<div class="vt-card-title">' + _escHtml(v.title) + '</div>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' +
              (catLabel ? '<span class="vt-card-badge">' + catLabel + '</span>' : '') +
              '<span style="background:#3b1e1e;color:#fca5a5;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">🔒 ' + _tc('vt_locked', 'Bloqueado') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
  });

  grid.innerHTML = html;
}

// ============================================
// INFO CARD — shown before playing a video
// ============================================
function vtShowInfoCard(videoId) {
  var video = _vtVideos.find(function(v) { return v.id === videoId; });
  if (!video) return;

  // Check if unlocked
  if (!vtIsVideoUnlocked(video)) {
    window.MaestroDialog.alert({title: 'Atención', message: _tc('vt_video_locked', '🔒 Este video está bloqueado.\nCompleta el quiz del video anterior en esta categoría para desbloquearlo.'), kind: 'warning'});
    return;
  }

  var catObj = TV_CATEGORIES.find(function(c) { return c.id === (video.category || 'general'); });
  var catLabel = catObj ? catObj.emoji + ' ' + catObj.name : '';
  var dur = vtFormatDuration(video.duration_seconds);
  var quizStatus = vtGetQuizStatus(video);

  // Reinforced areas tags
  var areasHtml = '';
  if (video.reinforced_areas && video.reinforced_areas.length > 0) {
    areasHtml = '<div style="margin-top:12px"><div style="color:#3D3D3A;font-size:12px;margin-bottom:6px;font-weight:600">' + _tc('vt_reinforced_areas', 'Áreas que refuerza:') + '</div><div style="display:flex;flex-wrap:wrap;gap:6px">';
    video.reinforced_areas.forEach(function(aId) {
      var ac = TV_CATEGORIES.find(function(c) { return c.id === aId; });
      if (ac) areasHtml += '<span style="background:#1e3a5f;color:#93c5fd;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600">' + ac.emoji + ' ' + _escHtml(ac.name) + '</span>';
    });
    areasHtml += '</div></div>';
  }

  // Quiz info
  var quizHtml = '';
  if (quizStatus === 'passed') {
    quizHtml = '<div style="background:#065f46;border:1px solid #10b981;border-radius:10px;padding:10px 14px;margin-top:12px;display:flex;align-items:center;gap:8px">' +
      '<span style="font-size:20px">✅</span><span style="color:#6ee7b7;font-size:13px;font-weight:600">' + _tc('vt_quiz_passed', 'Quiz aprobado') + '</span></div>';
  } else if (quizStatus === 'pending') {
    var qCount = video.quiz_questions.length;
    quizHtml = '<div style="background:#DBEAFE;border:1px solid #93C5FD;border-radius:10px;padding:10px 14px;margin-top:12px;display:flex;align-items:center;gap:8px">' +
      '<span style="font-size:20px">📝</span><span style="color:#1E40AF;font-size:13px;font-weight:600">Este video incluye quiz de ' + qCount + ' preguntas (aprobar para desbloquear el siguiente)</span></div>';
  }

  var overlay = document.getElementById('vtPlayerOverlay');
  if (!overlay) return;

  overlay.style.display = 'flex';
  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:16px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;padding:28px;position:relative;margin:20px;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08)">' +
      '<button onclick="vtCloseInfoCard()" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#6B6B66;font-size:22px;cursor:pointer">&times;</button>' +
      '<h3 style="color:#0F0F0F;font-size:18px;margin:0 0 6px;padding-right:30px">' + _escHtml(video.title) + '</h3>' +
      '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap">' +
        (catLabel ? '<span style="background:#FFF7ED;color:#E8591C;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:600">' + catLabel + '</span>' : '') +
        '<span style="color:#6B6B66;font-size:13px;font-weight:500">⏱ ' + dur + '</span>' +
      '</div>' +
      (video.description ? '<p style="color:#3D3D3A;font-size:14px;margin:0 0 12px;line-height:1.5">' + _escHtml(video.description) + '</p>' : '') +
      (video.learning_objectives ? '<div style="margin-top:12px"><div style="color:#6B6B66;font-size:12px;margin-bottom:4px;font-weight:600">' + _tc('vt_what_learn', '¿Qué aprenderás?') + '</div><p style="color:#0F0F0F;font-size:13px;margin:0;line-height:1.5">' + _escHtml(video.learning_objectives) + '</p></div>' : '') +
      (video.target_audience ? '<div style="margin-top:12px"><div style="color:#6B6B66;font-size:12px;margin-bottom:4px;font-weight:600">' + _tc('vt_target_audience', '¿Para quién es?') + '</div><p style="color:#0F0F0F;font-size:13px;margin:0">' + _escHtml(video.target_audience) + '</p></div>' : '') +
      areasHtml +
      quizHtml +
      '<button onclick="vtPlayVideo(\'' + _escHtml(video.id) + '\')" style="width:100%;margin-top:20px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">' +
        '▶ Iniciar Video</button>' +
    '</div>';

  // Close on backdrop click
  overlay.onclick = function(e) { if (e.target === overlay) vtCloseInfoCard(); };
}

function vtCloseInfoCard() {
  var overlay = document.getElementById('vtPlayerOverlay');
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; overlay.onclick = null; }
}

// ============================================
// VIDEO PLAYER WITH WATERMARK + QUIZ TRIGGER
// ============================================
async function vtPlayVideo(videoId) {
  var video = _vtVideos.find(function(v) { return v.id === videoId; });
  if (!video) return;

  var access = _vtAccessCache;
  if (!access) {
    access = await vtCheckAccess();
  }
  if (!access) {
    access = { type: 'free', tier: 'platino' };
  }

  var overlay = document.getElementById('vtPlayerOverlay');
  if (!overlay) return;

  var videoUrl = video.video_url || '';
  if (!videoUrl) { window.showToast(_tc('vt_video_unavailable', 'Video no disponible.'), 'warning'); return; }

  var savedTime = vtGetProgress(videoId);

  overlay.style.display = 'flex';
  overlay.onclick = null;
  overlay.innerHTML =
    '<div class="vt-player-container">' +
      '<button class="vt-player-close" onclick="vtClosePlayer()">&times;</button>' +
      '<div class="vt-player-wrap">' +
        '<video id="vtVideoEl" controls controlslist="nodownload" disablepictureinpicture oncontextmenu="return false" playsinline crossorigin="anonymous">' +
          '<source src="' + _escHtml(videoUrl) + '" type="video/mp4">' +
          (video.subtitle_url_en ? '<track kind="subtitles" src="' + _escHtml(video.subtitle_url_en) + '" srclang="en" label="English" default>' : '') +
        '</video>' +
        '<div class="vt-watermark-br">ACVOLT</div>' +
        '<div class="vt-watermark-center">ACVOLT</div>' +
      '</div>' +
      '<div class="vt-player-title">' + _escHtml(video.title) + '</div>' +
    '</div>';

  var el = document.getElementById('vtVideoEl');
  if (!el) return;

  // Resume from saved position
  if (savedTime > 0) {
    el.addEventListener('loadedmetadata', function() {
      if (savedTime < el.duration - 2) {
        el.currentTime = savedTime;
      }
    }, { once: true });
  }

  // Auto-save progress (throttled to every 5s)
  var _vtProgTimer = null;
  el.addEventListener('timeupdate', function() {
    if (el.currentTime > 0 && !_vtProgTimer) {
      _vtProgTimer = setTimeout(function() {
        vtSaveProgress(videoId, Math.round(el.currentTime));
        _vtProgTimer = null;
      }, 5000);
    }
  });
  el.addEventListener('pause', function() {
    if (el.currentTime > 0) vtSaveProgress(videoId, Math.round(el.currentTime));
  });

  // Quiz trigger on video end
  el.addEventListener('ended', function() {
    vtSaveProgress(videoId, Math.round(el.duration || 0));
    var qs = vtGetQuizStatus(video);
    if (qs === 'pending') {
      // Small delay so the user sees the video ended
      setTimeout(function() { vtStartQuiz(videoId); }, 800);
    }
  });

  el.play().catch(function() {});

  // Close on Escape
  overlay._escHandler = function(e) {
    if (e.key === 'Escape') vtClosePlayer();
  };
  document.addEventListener('keydown', overlay._escHandler);
}

function vtClosePlayer() {
  var overlay = document.getElementById('vtPlayerOverlay');
  if (!overlay) return;

  var el = document.getElementById('vtVideoEl');
  if (el) {
    el.pause();
    el.src = '';
  }

  overlay.style.display = 'none';
  overlay.innerHTML = '';
  overlay.onclick = null;

  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
    overlay._escHandler = null;
  }

  // Return to series view if we were in one
  if (_vtCurrentView === 'series' && _vtCurrentSeries) {
    vtOpenSeries(_vtCurrentSeries);
  }
}

// ============================================
// QUIZ ENGINE
// ============================================

function vtStartQuiz(videoId) {
  var video = _vtVideos.find(function(v) { return v.id === videoId; });
  if (!video || !video.quiz_questions || video.quiz_questions.length === 0) return;

  // Close the player
  vtClosePlayer();

  _vtCurrentQuiz = {
    videoId: videoId,
    video: video,
    questions: video.quiz_questions.slice(), // copy
    currentIndex: 0,
    answers: [],
    correctCount: 0,
    selectedOption: -1,
    confirmed: false,
    startTime: Date.now()
  };

  vtRenderQuizQuestion();
}

function vtRenderQuizQuestion() {
  var q = _vtCurrentQuiz;
  if (!q) return;

  var overlay = document.getElementById('vtPlayerOverlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.onclick = null;

  var question = q.questions[q.currentIndex];
  var total = q.questions.length;
  var current = q.currentIndex + 1;
  var pct = Math.round((current / total) * 100);

  // Progress dots
  var dots = '';
  for (var i = 0; i < total; i++) {
    var dotColor = '#E7E5DE';
    if (i < q.answers.length) {
      dotColor = q.answers[i].correct ? '#059669' : '#DC2626';
    } else if (i === q.currentIndex) {
      dotColor = '#E8591C';
    }
    dots += '<div style="width:10px;height:10px;border-radius:50%;background:' + dotColor + '"></div>';
  }

  // Options
  var optionsHtml = '';
  question.options.forEach(function(opt, idx) {
    var letter = ['A', 'B', 'C', 'D'][idx];
    optionsHtml += '<button class="vtq-option" data-idx="' + idx + '" onclick="vtSelectQuizOption(' + idx + ')" ' +
      'style="display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;background:#FFFFFF;border:2px solid #E7E5DE;border-radius:10px;color:#0F0F0F;font-size:14px;cursor:pointer;text-align:left;margin-bottom:8px;transition:all .2s">' +
      '<span style="min-width:28px;height:28px;border-radius:50%;background:#FAFAF7;border:2px solid #E7E5DE;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;color:#6B6B66">' + letter + '</span>' +
      '<span>' + _escHtml(opt) + '</span></button>';
  });

  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;padding:28px;position:relative;margin:20px;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
        '<h3 style="color:#0F0F0F;font-size:16px;margin:0">📝 Quiz: ' + _escHtml(q.video.title) + '</h3>' +
        '<span style="color:#6B6B66;font-size:13px;font-weight:600">' + current + '/' + total + '</span>' +
      '</div>' +
      '<div style="background:#E7E5DE;height:6px;border-radius:3px;margin-bottom:12px;overflow:hidden"><div style="height:100%;background:linear-gradient(90deg,#E8591C,#D14F18);border-radius:3px;width:' + pct + '%;transition:width .3s"></div></div>' +
      '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">' + dots + '</div>' +
      '<div style="background:#FAFAF7;border:1px solid #E7E5DE;border-radius:12px;padding:20px;margin-bottom:20px">' +
        '<p style="color:#0F0F0F;font-size:15px;margin:0;line-height:1.5;font-weight:500">' + _escHtml(question.question) + '</p>' +
      '</div>' +
      '<div id="vtqOptions">' + optionsHtml + '</div>' +
      '<div id="vtqFeedback" style="display:none;margin-top:12px"></div>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
        '<button id="vtqConfirmBtn" onclick="vtConfirmQuizAnswer()" disabled style="flex:1;padding:12px;border-radius:10px;border:none;font-size:14px;font-weight:bold;cursor:pointer;background:#E7E5DE;color:#6B6B66">' + _tc('vt_confirm_answer', 'Confirmar Respuesta') + '</button>' +
      '</div>' +
    '</div>';

  // Escape handler — remove previous listener before adding new one
  if (overlay._escHandler) {
    document.removeEventListener('keydown', overlay._escHandler);
  }
  overlay._escHandler = function(e) {
    if (e.key !== 'Escape') return;
    var _ask = (window.MaestroDialog && window.MaestroDialog.confirm)
      ? window.MaestroDialog.confirm({
          title: _tc('vt_quit_quiz_title', 'Salir del quiz'),
          message: _tc('vt_quit_quiz', '¿Salir del quiz? Tu progreso se perderá.'),
          okText: _tc('vt_quit_ok', 'Salir'),
          cancelText: _tc('vt_quit_cancel', 'Continuar'),
          destructive: true,
          kind: 'warning'
        })
      : Promise.resolve(confirm(_tc('vt_quit_quiz', '¿Salir del quiz? Tu progreso se perderá.')));
    _ask.then(function(ok) {
      if (!ok) return;
      _vtCurrentQuiz = null;
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      document.removeEventListener('keydown', overlay._escHandler);
    });
  };
  document.addEventListener('keydown', overlay._escHandler);
}

function vtSelectQuizOption(idx) {
  var q = _vtCurrentQuiz;
  if (!q || q.confirmed) return;

  q.selectedOption = idx;

  // Update UI — highlight selected
  var options = document.querySelectorAll('.vtq-option');
  options.forEach(function(opt, i) {
    if (i === idx) {
      opt.style.borderColor = '#E8591C';
      opt.style.background = '#FFF7ED';
      opt.querySelector('span').style.borderColor = '#E8591C';
      opt.querySelector('span').style.color = '#E8591C';
    } else {
      opt.style.borderColor = '#E7E5DE';
      opt.style.background = '#FFFFFF';
      opt.querySelector('span').style.borderColor = '#E7E5DE';
      opt.querySelector('span').style.color = '#6B6B66';
    }
  });

  // Enable confirm button
  var btn = document.getElementById('vtqConfirmBtn');
  if (btn) {
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
    btn.style.color = '#fff';
  }
}

function vtConfirmQuizAnswer() {
  var q = _vtCurrentQuiz;
  if (!q || q.confirmed || q.selectedOption < 0) return;
  q.confirmed = true;

  var question = q.questions[q.currentIndex];
  var isCorrect = q.selectedOption === question.correct;
  if (isCorrect) q.correctCount++;

  q.answers.push({
    questionIndex: q.currentIndex,
    selected: q.selectedOption,
    correct: isCorrect
  });

  // Show feedback on options
  var options = document.querySelectorAll('.vtq-option');
  options.forEach(function(opt, i) {
    opt.style.cursor = 'default';
    opt.onclick = null;
    if (i === question.correct) {
      opt.style.borderColor = '#059669';
      opt.style.background = '#D1FAE5';
    } else if (i === q.selectedOption && !isCorrect) {
      opt.style.borderColor = '#DC2626';
      opt.style.background = '#FEE2E2';
    }
  });

  // Show feedback message
  var fb = document.getElementById('vtqFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.innerHTML =
      '<div style="background:' + (isCorrect ? '#D1FAE5;border:1px solid #059669' : '#FEE2E2;border:1px solid #DC2626') + ';border-radius:10px;padding:12px 16px">' +
        '<div style="font-size:14px;font-weight:bold;color:' + (isCorrect ? '#065F46' : '#991B1B') + ';margin-bottom:4px">' +
          (isCorrect ? '✅ ' + _tc('vt_correct', '¡Correcto!') : '❌ ' + _tc('vt_incorrect', 'Incorrecto')) +
        '</div>' +
        (question.explanation ? '<p style="color:#3D3D3A;font-size:13px;margin:0;line-height:1.4">' + _escHtml(question.explanation) + '</p>' : '') +
      '</div>';
  }

  // Change confirm button to "Next"
  var btn = document.getElementById('vtqConfirmBtn');
  if (btn) {
    var isLast = q.currentIndex >= q.questions.length - 1;
    btn.textContent = isLast ? _tc('vt_see_result', 'Ver Resultado') : _tc('vt_next', 'Siguiente →');
    btn.disabled = false;
    btn.style.background = 'linear-gradient(135deg,#3b82f6,#2563eb)';
    btn.style.color = '#fff';
    btn.onclick = function() {
      if (isLast) {
        vtFinishQuiz();
      } else {
        q.currentIndex++;
        q.selectedOption = -1;
        q.confirmed = false;
        vtRenderQuizQuestion();
      }
    };
  }
}

async function vtFinishQuiz() {
  var q = _vtCurrentQuiz;
  if (!q) return;

  var total = q.questions.length;
  var correct = q.correctCount;
  var percentage = Math.round((correct / total) * 100);
  var passingScore = q.video.quiz_passing_score || 70;
  var passed = percentage >= passingScore;
  var timeTaken = Math.round((Date.now() - q.startTime) / 1000);

  // Get student info
  var stuEmail = '', stuName = '';
  try {
    var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
    stuEmail = (t.email || '').toLowerCase().trim();
    stuName = t.nombre || '';
  } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }

  // Save attempt to database
  try {
    await supabaseClient.from('video_quiz_attempts').insert({
      video_id: q.videoId,
      student_email: stuEmail,
      student_name: stuName,
      total_questions: total,
      correct_answers: correct,
      percentage: percentage,
      passed: passed,
      answers: q.answers,
      time_taken: timeTaken
    });
  } catch(e) { console.log('Error saving quiz attempt:', e); }

  // If passed, update local state
  if (passed) {
    _vtQuizPassed[q.videoId] = true;
  }

  // Find next video in category
  var nextVideoId = null;
  if (passed) {
    var cat = (q.video.category || 'general');
    var catVideos = _vtVideos.filter(function(v) { return (v.category || 'general') === cat; });
    var curIdx = catVideos.findIndex(function(v) { return v.id === q.videoId; });
    if (curIdx >= 0 && curIdx < catVideos.length - 1) {
      nextVideoId = catVideos[curIdx + 1].id;
    }
  }

  // Store for retry
  _vtLastQuizVideoId = q.videoId;

  // Render result screen
  var overlay = document.getElementById('vtPlayerOverlay');
  if (!overlay) return;

  var resultColor = passed ? '#059669' : '#DC2626';
  var resultBg = passed ? '#D1FAE5' : '#FEE2E2';
  var resultIcon = passed ? '🎉' : '😔';
  var resultTitle = passed ? _tc('vt_congrats_passed', '¡Felicidades, aprobaste!') : _tc('vt_not_passed', 'No aprobaste esta vez');

  // Score breakdown dots
  var scoreDots = '';
  q.answers.forEach(function(a, i) {
    scoreDots += '<div style="width:12px;height:12px;border-radius:50%;background:' + (a.correct ? '#059669' : '#DC2626') + '" title="Pregunta ' + (i + 1) + '"></div>';
  });

  overlay.innerHTML =
    '<div style="background:#FFFFFF;border-radius:16px;max-width:480px;width:100%;padding:32px;position:relative;margin:20px;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);text-align:center">' +
      '<div style="font-size:48px;margin-bottom:12px">' + resultIcon + '</div>' +
      '<h3 style="color:#0F0F0F;font-size:20px;margin:0 0 8px">' + resultTitle + '</h3>' +
      '<p style="color:#6B6B66;font-size:14px;font-weight:500;margin:0 0 20px">' + _escHtml(q.video.title) + '</p>' +
      '<div style="background:' + resultBg + ';border:2px solid ' + resultColor + ';border-radius:16px;padding:20px;margin-bottom:20px">' +
        '<div style="font-size:42px;font-weight:bold;color:' + resultColor + '">' + percentage + '%</div>' +
        '<div style="color:#3D3D3A;font-size:13px;margin-top:4px">' + correct + ' ' + _tc('vt_of', 'de') + ' ' + total + ' ' + _tc('vt_correct_answers', 'correctas') + ' · ' + _tc('vt_minimum', 'Mínimo') + ': ' + passingScore + '%</div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">' + scoreDots + '</div>' +
      '<div style="color:#6B6B66;font-size:12px;font-weight:500;margin-bottom:20px">' + _tc('vt_time', 'Tiempo') + ': ' + Math.floor(timeTaken / 60) + ':' + (timeTaken % 60 < 10 ? '0' : '') + (timeTaken % 60) + '</div>' +
      (passed
        ? (nextVideoId
          ? '<button onclick="_vtCurrentQuiz=null;vtClosePlayer();vtShowInfoCard(\'' + _escHtml(nextVideoId) + '\')" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:8px">→ Siguiente Video</button>'
          : '<div style="background:#D1FAE5;border:1px solid #059669;border-radius:10px;padding:12px;color:#065F46;font-size:14px;margin-bottom:8px">🏆 ¡Completaste todos los videos de esta categoría!</div>'
        )
        : '<button onclick="vtRetryQuiz()" style="width:100%;padding:14px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:8px">🔄 Reintentar Quiz</button>'
      ) +
      '<button onclick="_vtCurrentQuiz=null;vtClosePlayer();if(!_vtCurrentSeries)vtBackToBubbles();" style="width:100%;padding:12px;border-radius:10px;border:1px solid #E7E5DE;background:transparent;color:#6B6B66;font-size:14px;font-weight:500;cursor:pointer">← Volver a Videos</button>' +
    '</div>';

  // Check series completion after quiz pass
  var _finishedCat = q.video.category || 'general';
  _vtCurrentQuiz = null;

  if (passed) {
    var _seriesStats = vtGetSeriesStats(_finishedCat);
    if (_seriesStats.seriesComplete) {
      setTimeout(function() { vtShowSeriesCertificate(_finishedCat); }, 2000);
    }
  }
}

var _vtLastQuizVideoId = null; // stored before quiz finishes for retry

function vtRetryQuiz() {
  if (_vtLastQuizVideoId) {
    vtStartQuiz(_vtLastQuizVideoId);
  }
}

// ============================================
// SERIES CERTIFICATE — Celebration modal
// ============================================
async function vtShowSeriesCertificate(catId) {
  var catObj = TV_CATEGORIES.find(function(c) { return c.id === catId; });
  if (!catObj) return;

  var stats = vtGetSeriesStats(catId);
  var stuName = '', stuEmail = '';
  try {
    var t = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
    stuName = t.nombre || 'Técnico HVAC';
    stuEmail = (t.email || '').toLowerCase().trim();
  } catch(e) { stuName = 'Técnico HVAC'; }

  var firstName = stuName.split(' ')[0].toUpperCase();
  var certId = 'VT-' + catId.toUpperCase() + '-' + Date.now();

  // Save cert to localStorage
  try {
    var certs = JSON.parse(localStorage.getItem('vt_series_certs') || '{}');
    certs[catId] = { certId: certId, earnedAt: new Date().toISOString(), catName: catObj.name };
    localStorage.setItem('vt_series_certs', JSON.stringify(certs));
  } catch(e) { console.warn('[VideoTutoriales]', e.message || e); }

  // Save cert to database
  try {
    await supabaseClient.from('video_quiz_attempts').insert({
      video_id: 'SERIES_CERT_' + catId,
      student_email: stuEmail,
      student_name: stuName,
      total_questions: stats.totalVideos,
      correct_answers: stats.totalVideos,
      percentage: 100,
      passed: true,
      answers: [{ certId: certId, catId: catId, hours: stats.hours, points: stats.points }],
      time_taken: 0
    });
  } catch(e) { console.log('Error saving series cert:', e); }

  // Confetti
  var confettiHTML = '';
  var colors = ['#f39c12','#e74c3c','#27ae60','#3498db','#9b59b6','#FFD700'];
  for (var i = 0; i < 30; i++) {
    confettiHTML += '<div class="confetti-piece" style="left:' + Math.round(Math.random()*100) + '%;animation-delay:' + Math.round(Math.random()*20)/10 + 's;background:' + colors[i%6] + ';width:' + (6+Math.round(Math.random()*8)) + 'px;height:' + (6+Math.round(Math.random()*8)) + 'px;border-radius:' + (Math.random()>0.5?'50%':'2px') + ';"></div>';
  }

  var modal = document.createElement('div');
  modal.className = 'cert-congrats-modal';
  modal.id = 'vtSeriesCertModal';
  modal.innerHTML = confettiHTML +
    '<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;max-width:420px;width:100%;text-align:center;border:2px solid #FFD700;max-height:90vh;overflow-y:auto;position:relative;z-index:1;">' +
      '<div style="font-size:70px;margin-bottom:5px;">🎉</div>' +
      '<h2 style="color:#FFD700;margin-bottom:5px;font-size:24px;">' + _tc('vt_congrats', '¡FELICIDADES') + ' ' + _escHtml(firstName) + '!</h2>' +
      '<div style="font-size:40px;margin-bottom:8px;">' + catObj.emoji + '</div>' +
      '<p style="color:#e2e8f0;font-size:16px;margin-bottom:15px;">' + _tc('vt_completed_series', 'Completaste la serie') + ' <strong style="color:#f39c12;">' + _escHtml(catObj.name) + '</strong></p>' +
      '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.3);border-radius:15px;padding:15px;margin-bottom:15px;">' +
        '<div style="display:flex;justify-content:space-around;text-align:center">' +
          '<div><div style="color:#FFD700;font-size:20px;font-weight:bold">' + stats.totalVideos + '</div><div style="color:#94a3b8;font-size:11px">Videos</div></div>' +
          '<div><div style="color:#FFD700;font-size:20px;font-weight:bold">' + stats.totalHours.toFixed(1) + '</div><div style="color:#94a3b8;font-size:11px">' + _tc('vt_hours', 'Horas') + '</div></div>' +
          '<div><div style="color:#FFD700;font-size:20px;font-weight:bold">' + stats.points + '</div><div style="color:#94a3b8;font-size:11px">' + _tc('vt_points', 'Puntos') + '</div></div>' +
        '</div>' +
        '<p style="color:#94a3b8;font-size:11px;margin-top:10px;margin-bottom:0;">ID: ' + certId + '</p>' +
      '</div>' +
      '<button onclick="document.getElementById(\'vtSeriesCertModal\').remove();' + (_vtCurrentSeries ? 'vtOpenSeries(\'' + _escHtml(catId) + '\')' : '') + '" style="width:100%;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;margin-top:10px;">🏅 ¡Genial!</button>' +
    '</div>';

  document.body.appendChild(modal);
  setTimeout(function() { var ps = modal.querySelectorAll('.confetti-piece'); ps.forEach(function(p) { p.remove(); }); }, 4000);
}

// ---- Init on load: check for Stripe return ----
checkVtStripeReturn();
