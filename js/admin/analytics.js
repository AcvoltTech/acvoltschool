// ==================== #15 ANALYTICS AVANZADOS — DASHBOARD COMPLETO ====================
// Self-injecting panel with 6 tabs: Overview, Retention, Screen Engagement,
// Student Profile, Churn Risk, Feature Usage
if (typeof _addTranslations === 'function') _addTranslations({
  adm_an_overview: { es: 'Vista General', en: 'Overview' },
  adm_an_retention: { es: 'Retenci\u00F3n', en: 'Retention' },
  adm_an_screens: { es: 'Pantallas', en: 'Screens' },
  adm_an_profile: { es: 'Perfil Estudiante', en: 'Student Profile' },
  adm_an_churn: { es: 'Riesgo Abandono', en: 'Churn Risk' },
  adm_an_features: { es: 'Uso Features', en: 'Feature Usage' },
  adm_an_reload: { es: 'Recargar', en: 'Reload' },
  adm_an_loading: { es: 'Cargando datos...', en: 'Loading data...' },
  adm_an_loading_cohorts: { es: 'Cargando cohortes...', en: 'Loading cohorts...' },
  adm_an_loading_screens: { es: 'Cargando datos de pantallas...', en: 'Loading screen data...' },
  adm_an_loading_profile: { es: 'Cargando perfil...', en: 'Loading profile...' },
  adm_an_loading_risk: { es: 'Analizando riesgo...', en: 'Analyzing risk...' },
  adm_an_loading_features: { es: 'Cargando uso de features...', en: 'Loading feature usage...' },
  adm_an_error_loading: { es: 'Error cargando datos: ', en: 'Error loading data: ' },
  adm_an_dau_today: { es: 'DAU (Hoy)', en: 'DAU (Today)' },
  adm_an_wau: { es: 'WAU (7d)', en: 'WAU (7d)' },
  adm_an_mau: { es: 'MAU (30d)', en: 'MAU (30d)' },
  adm_an_sessions_user: { es: 'Sesiones/Usuario', en: 'Sessions/User' },
  adm_an_avg_time: { es: 'Tiempo Promedio', en: 'Average Time' },
  adm_an_retention_7d: { es: 'Retenci\u00F3n 7d', en: '7d Retention' },
  adm_an_trend_14d: { es: 'Tendencia DAU (14 d\u00EDas)', en: 'DAU Trend (14 days)' },
  adm_an_14d_ago: { es: 'Hace 14d', en: '14d ago' },
  adm_an_today: { es: 'Hoy', en: 'Today' },
  adm_an_top_screens: { es: 'Top Pantallas Hoy', en: 'Top Screens Today' },
  adm_an_no_data_today: { es: 'Sin datos hoy', en: 'No data today' },
  adm_an_cohort_title: { es: 'Retenci\u00F3n por Cohorte Semanal', en: 'Weekly Cohort Retention' },
  adm_an_cohort: { es: 'Cohorte', en: 'Cohort' },
  adm_an_users: { es: 'Usuarios', en: 'Users' },
  adm_an_no_cohort: { es: 'Sin datos de cohorte disponibles. Se necesita la tabla screen_events con datos.', en: 'No cohort data available. The screen_events table needs data.' },
  adm_an_cohort_legend: { es: 'Verde: >60% | Amarillo: 30-60% | Rojo: <30%. Cohortes basadas en fecha de registro.', en: 'Green: >60% | Yellow: 30-60% | Red: <30%. Cohorts based on registration date.' },
  adm_an_screen_title: { es: 'Engagement por Pantalla (\u00FAltimos 30 d\u00EDas)', en: 'Screen Engagement (last 30 days)' },
  adm_an_visits: { es: 'Visitas', en: 'Visits' },
  adm_an_time: { es: 'Tiempo', en: 'Time' },
  adm_an_exit_rate: { es: 'Tasa Salida', en: 'Exit Rate' },
  adm_an_screen_label: { es: 'Pantalla', en: 'Screen' },
  adm_an_avg_time_label: { es: 'Tiempo Prom.', en: 'Avg Time' },
  adm_an_no_screen_data: { es: 'Sin datos de pantallas. Navega por la app para generar datos en screen_events.', en: 'No screen data. Navigate the app to generate data in screen_events.' },
  adm_an_profile_title: { es: 'Perfil Individual de Estudiante', en: 'Individual Student Profile' },
  adm_an_search: { es: 'Buscar por nombre o email...', en: 'Search by name or email...' },
  adm_an_no_name: { es: 'Sin nombre', en: 'No name' },
  adm_an_never: { es: 'Nunca', en: 'Never' },
  adm_an_not_found: { es: 'Estudiante no encontrado', en: 'Student not found' },
  adm_an_back: { es: '\u2190 Volver', en: '\u2190 Back' },
  adm_an_registered: { es: 'Registrado: ', en: 'Registered: ' },
  adm_an_sessions: { es: 'Sesiones', en: 'Sessions' },
  adm_an_total_time: { es: 'Tiempo Total', en: 'Total Time' },
  adm_an_streak: { es: 'Racha Actual', en: 'Current Streak' },
  adm_an_avg_score: { es: 'Score Prom.', en: 'Avg Score' },
  adm_an_quizzes: { es: 'Quizzes', en: 'Quizzes' },
  adm_an_certificates: { es: 'Certificados', en: 'Certificates' },
  adm_an_engagement: { es: 'Engagement', en: 'Engagement' },
  adm_an_recent: { es: 'Actividad Reciente', en: 'Recent Activity' },
  adm_an_no_activity: { es: 'Sin actividad registrada', en: 'No recorded activity' },
  adm_an_top_visited: { es: 'Pantallas M\u00E1s Visitadas', en: 'Most Visited Screens' },
  adm_an_risk_title: { es: 'Riesgo de Abandono', en: 'Churn Risk' },
  adm_an_active: { es: 'Activo', en: 'Active' },
  adm_an_at_risk: { es: 'En Riesgo', en: 'At Risk' },
  adm_an_inactive: { es: 'Inactivo', en: 'Inactive' },
  adm_an_lost: { es: 'Perdido', en: 'Lost' },
  adm_an_name: { es: 'Nombre', en: 'Name' },
  adm_an_last_access: { es: '\u00DAltimo Acceso', en: 'Last Access' },
  adm_an_days_inactive: { es: 'D\u00EDas Inactivo', en: 'Days Inactive' },
  adm_an_risk: { es: 'Riesgo', en: 'Risk' },
  adm_an_actions: { es: 'Acciones', en: 'Actions' },
  adm_an_view: { es: 'Ver', en: 'View' },
  adm_an_adoption_title: { es: 'Adopci\u00F3n de Features (\u00FAltimos 30 d\u00EDas)', en: 'Feature Adoption (last 30 days)' },
  adm_an_total_students: { es: ' estudiantes totales | Comparaci\u00F3n vs mes anterior', en: ' total students | Comparison vs previous month' },
  adm_an_no_feature_data: { es: 'Sin datos de uso. Se necesita la tabla screen_events con datos.', en: 'No usage data. The screen_events table needs data.' },
  // Screen-name labels (Feature Usage bar chart + top-screens list)
  adm_an_scr_dashboard: { es: 'Dashboard', en: 'Dashboard' },
  adm_an_scr_levels: { es: 'Niveles', en: 'Levels' },
  adm_an_scr_quiz: { es: 'Quiz', en: 'Quiz' },
  adm_an_scr_quiz_fast: { es: 'Quiz R\u00E1pido', en: 'Quick Quiz' },
  adm_an_scr_welcome: { es: 'Bienvenida', en: 'Welcome' },
  adm_an_scr_profile: { es: 'Mi Perfil', en: 'My Profile' },
  adm_an_scr_chat: { es: 'Chat', en: 'Chat' },
  adm_an_scr_live: { es: 'Live Stream', en: 'Live Stream' },
  adm_an_scr_feed: { es: 'HVAC Feed', en: 'HVAC Feed' },
  adm_an_scr_marketplace: { es: 'Marketplace', en: 'Marketplace' },
  adm_an_scr_exams: { es: 'Ex\u00E1menes', en: 'Exams' },
  adm_an_scr_progress: { es: 'Mi Progreso', en: 'My Progress' },
  adm_an_scr_calendar: { es: 'Calendario', en: 'Calendar' },
  adm_an_scr_referrals: { es: 'Referidos', en: 'Referrals' },
  adm_an_scr_radio: { es: 'Radio/Podcast', en: 'Radio/Podcast' },
  adm_an_scr_suggestions: { es: 'Sugerencias', en: 'Suggestions' },
  adm_an_scr_videos: { es: 'Video Tutoriales', en: 'Video Tutorials' },
  adm_an_scr_admin: { es: 'Admin Dashboard', en: 'Admin Dashboard' },
  adm_an_scr_certs: { es: 'Certificados', en: 'Certificates' },
  // Feature names in featureMap (Feature Usage tab)
  adm_an_feat_quizzes: { es: 'Quizzes', en: 'Quizzes' },
});

var _anCache = {};
var _anActiveTab = 'overview';

// Screen name mapping for human-readable labels (key -> translation key)
var _anScreenKeys = {
  dashboardScreen: ['adm_an_scr_dashboard', 'Dashboard'],
  levelsScreen: ['adm_an_scr_levels', 'Niveles'],
  quizScreen: ['adm_an_scr_quiz', 'Quiz'],
  quizOnlyScreen: ['adm_an_scr_quiz_fast', 'Quiz Rápido'],
  welcomeScreen: ['adm_an_scr_welcome', 'Bienvenida'],
  miPerfilScreen: ['adm_an_scr_profile', 'Mi Perfil'],
  techChatScreen: ['adm_an_scr_chat', 'Chat'],
  liveStreamingScreen: ['adm_an_scr_live', 'Live Stream'],
  hvacFeedScreen: ['adm_an_scr_feed', 'HVAC Feed'],
  marketplaceScreen: ['adm_an_scr_marketplace', 'Marketplace'],
  studentExamsScreen: ['adm_an_scr_exams', 'Exámenes'],
  studentProgressScreen: ['adm_an_scr_progress', 'Mi Progreso'],
  studentCalendarScreen: ['adm_an_scr_calendar', 'Calendario'],
  referidosScreen: ['adm_an_scr_referrals', 'Referidos'],
  radioPodcastScreen: ['adm_an_scr_radio', 'Radio/Podcast'],
  sugerenciasScreen: ['adm_an_scr_suggestions', 'Sugerencias'],
  videoTutorialesScreen: ['adm_an_scr_videos', 'Video Tutoriales'],
  adminDashboardScreen: ['adm_an_scr_admin', 'Admin Dashboard'],
  certificatesScreen: ['adm_an_scr_certs', 'Certificados']
};

function _anScreenLabel(id) {
  var entry = _anScreenKeys[id];
  if (entry) return (typeof _t === 'function') ? _t(entry[0], entry[1]) : entry[1];
  return id.replace('Screen', '').replace(/([A-Z])/g, ' $1').trim();
}

async function loadAnalytics() {
  if (!supabaseClient) return;
  var root = document.getElementById('analyticsRoot');
  if (!root) return;

  // Show the parent container
  var container = document.getElementById('adminAnalytics');
  if (container) container.style.display = '';

  _anCache = {};
  _anRenderTabs(root);
  _anLoadOverview();
}

// ==================== TAB SYSTEM ====================
function _anRenderTabs(root) {
  var tabs = [
    { id: 'overview', label: _t('adm_an_overview', 'Vista General') },
    { id: 'retention', label: _t('adm_an_retention', 'Retenci\u00F3n') },
    { id: 'screens', label: _t('adm_an_screens', 'Pantallas') },
    { id: 'profile', label: _t('adm_an_profile', 'Perfil Estudiante') },
    { id: 'churn', label: _t('adm_an_churn', 'Riesgo Abandono') },
    { id: 'features', label: _t('adm_an_features', 'Uso Features') }
  ];

  var tabHtml = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px;">' +
    '<div style="display:flex;gap:4px;flex-wrap:wrap;">';
  tabs.forEach(function(t) {
    var active = t.id === _anActiveTab;
    tabHtml += '<button onclick="_anSwitchTab(\'' + t.id + '\')" style="padding:6px 12px;border-radius:8px;font-size:11px;font-weight:' + (active ? '700' : '500') + ';cursor:pointer;border:1px solid ' + (active ? '#3b82f6' : '#e2e8f0') + ';background:' + (active ? '#3b82f6' : '#f8fafc') + ';color:' + (active ? '#fff' : '#475569') + ';transition:all 0.2s;">' + t.label + '</button>';
  });
  tabHtml += '</div>' +
    '<button onclick="loadAnalytics()" style="background:#f1f5f9;padding:5px 10px;border-radius:6px;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-size:10px;">' + _t('adm_an_reload', 'Recargar') + '</button>' +
    '</div>' +
    '<div id="anTabContent" style="min-height:200px;"></div>';

  root.innerHTML = tabHtml;
}

function _anSwitchTab(tabId) {
  _anActiveTab = tabId;
  var root = document.getElementById('analyticsRoot');
  if (root) _anRenderTabs(root);

  if (tabId === 'overview') _anLoadOverview();
  else if (tabId === 'retention') _anLoadRetention();
  else if (tabId === 'screens') _anLoadScreenEngagement();
  else if (tabId === 'profile') _anLoadStudentProfile();
  else if (tabId === 'churn') _anLoadChurnRisk();
  else if (tabId === 'features') _anLoadFeatureUsage();
}

// ==================== HELPERS ====================
function _anSparkline(data, w, h) {
  if (!data || data.length < 2) return '';
  w = w || 120; h = h || 30;
  var max = Math.max.apply(null, data) || 1;
  var min = Math.min.apply(null, data);
  var range = max - min || 1;
  var points = data.map(function(v, i) {
    var x = (i / (data.length - 1)) * w;
    var y = h - ((v - min) / range) * (h - 4) - 2;
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  var trend = data[data.length - 1] >= data[0] ? '#22c55e' : '#ef4444';
  return '<svg width="' + w + '" height="' + h + '" style="vertical-align:middle;"><polyline points="' + points + '" fill="none" stroke="' + trend + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function _anColorScale(pct) {
  if (pct >= 60) return { bg: '#f0fdf4', text: '#166534' };
  if (pct >= 30) return { bg: '#fffbeb', text: '#92400e' };
  return { bg: '#fef2f2', text: '#991b1b' };
}

function _anDaysBetween(d1, d2) {
  return Math.floor(Math.abs(d2 - d1) / (24 * 60 * 60 * 1000));
}

function _anDateStr(d) {
  return d.toISOString().split('T')[0];
}

function _anWeekStart(d) {
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

// ==================== TAB 1: VISTA GENERAL ====================
async function _anLoadOverview() {
  var el = document.getElementById('anTabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading', 'Cargando datos...') + '</div>';

  try {
    var now = new Date();
    var todayStr = _anDateStr(now);
    var weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    var monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch users
    if (!_anCache.users) {
      var _anAll = [], _anOff = 0, _anMore = true;
      while (_anMore) {
        var r = await usersDataAdmin('admin_list', { offset: _anOff, limit: 1000, fields: ["ultimo_acceso","nombre","email","fecha_registro"] });
        var _anBatch = r.data || [];
        _anAll = _anAll.concat(_anBatch);
        if (_anBatch.length < 1000) _anMore = false; else _anOff += 1000;
      }
      _anCache.users = _anAll;
    }
    var users = _anCache.users;

    var dau = users.filter(function(u) { return u.ultimo_acceso && u.ultimo_acceso.startsWith(todayStr); }).length;
    var wau = users.filter(function(u) { return u.ultimo_acceso && u.ultimo_acceso >= weekAgo; }).length;
    var mau = users.filter(function(u) { return u.ultimo_acceso && u.ultimo_acceso >= monthAgo; }).length;

    // Fetch screen events for last 14 days for sparkline + session stats
    var twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();
    if (!_anCache.recentEvents) {
      var r2 = await supabaseClient.from('screen_events')
        .select('user_email, screen_id, entered_at, duration_sec, session_id')
        .gte('entered_at', twoWeeksAgo)
        .order('entered_at', { ascending: true });
      _anCache.recentEvents = (r2.data || []);
    }
    var events = _anCache.recentEvents;

    // DAU sparkline (14 days)
    var dailyCounts = {};
    for (var d = 13; d >= 0; d--) {
      var dt = new Date(now - d * 24 * 60 * 60 * 1000);
      dailyCounts[_anDateStr(dt)] = new Set();
    }
    events.forEach(function(e) {
      var day = e.entered_at.split('T')[0];
      if (dailyCounts[day]) dailyCounts[day].add(e.user_email);
    });
    var sparkData = Object.values(dailyCounts).map(function(s) { return s.size; });

    // Sessions per user (unique session_ids per user in last 7 days)
    var weekEvents = events.filter(function(e) { return e.entered_at >= weekAgo; });
    var userSessions = {};
    weekEvents.forEach(function(e) {
      if (!userSessions[e.user_email]) userSessions[e.user_email] = new Set();
      if (e.session_id) userSessions[e.user_email].add(e.session_id);
    });
    var sessionCounts = Object.values(userSessions).map(function(s) { return s.size; });
    var avgSessions = sessionCounts.length > 0 ? (sessionCounts.reduce(function(a, b) { return a + b; }, 0) / sessionCounts.length).toFixed(1) : '0';

    // Avg time in app per session (sum duration_sec grouped by session_id)
    var sessionDurations = {};
    weekEvents.forEach(function(e) {
      if (e.session_id && e.duration_sec > 0) {
        sessionDurations[e.session_id] = (sessionDurations[e.session_id] || 0) + e.duration_sec;
      }
    });
    var durVals = Object.values(sessionDurations);
    var avgDuration = durVals.length > 0 ? Math.round(durVals.reduce(function(a, b) { return a + b; }, 0) / durVals.length) : 0;
    var avgDurMin = (avgDuration / 60).toFixed(1);

    // 7-day retention rate
    var sevenDaysAgoDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    var oldUsers = users.filter(function(u) {
      return u.fecha_registro && new Date(u.fecha_registro) <= sevenDaysAgoDate;
    });
    var retainedCount = oldUsers.filter(function(u) {
      return u.ultimo_acceso && u.ultimo_acceso >= weekAgo;
    }).length;
    var retentionRate = oldUsers.length > 0 ? Math.round(retainedCount / oldUsers.length * 100) : 0;

    // Top screens today
    var todayEvents = events.filter(function(e) { return e.entered_at.startsWith(todayStr); });
    var screenHits = {};
    todayEvents.forEach(function(e) {
      screenHits[e.screen_id] = (screenHits[e.screen_id] || 0) + 1;
    });
    var topScreens = Object.entries(screenHits).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8);

    // Build HTML
    var html = '';
    // KPI cards
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px;">';
    var kpis = [
      { label: _t('adm_an_dau_today', 'DAU (Hoy)'), value: dau, color: '#3b82f6', icon: '' },
      { label: _t('adm_an_wau', 'WAU (7d)'), value: wau, color: '#8b5cf6', icon: '' },
      { label: _t('adm_an_mau', 'MAU (30d)'), value: mau, color: '#06b6d4', icon: '' },
      { label: _t('adm_an_sessions_user', 'Sesiones/Usuario'), value: avgSessions, color: '#f59e0b', icon: '' },
      { label: _t('adm_an_avg_time', 'Tiempo Promedio'), value: avgDurMin + ' min', color: '#10b981', icon: '' },
      { label: _t('adm_an_retention_7d', 'Retenci\u00F3n 7d'), value: retentionRate + '%', color: retentionRate >= 50 ? '#22c55e' : '#ef4444', icon: '' }
    ];
    kpis.forEach(function(k) {
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;">' +
        '<div style="font-size:9px;color:#64748b;font-weight:500;margin-bottom:4px;">' + k.label + '</div>' +
        '<div style="font-size:22px;font-weight:bold;color:' + k.color + ';">' + k.value + '</div>' +
        '</div>';
    });
    html += '</div>';

    // Trend sparkline
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
    html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">' +
      '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_trend_14d', 'Tendencia DAU (14 d\u00EDas)') + '</div>' +
      '<div style="text-align:center;">' + _anSparkline(sparkData, 200, 50) + '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-top:4px;"><span>' + _t('adm_an_14d_ago', 'Hace 14d') + '</span><span>' + _t('adm_an_today', 'Hoy') + '</span></div>' +
      '</div>';

    // Top screens today
    html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">' +
      '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_top_screens', 'Top Pantallas Hoy') + '</div>';
    if (topScreens.length === 0) {
      html += '<div style="text-align:center;color:#94a3b8;font-size:12px;padding:10px;">' + _t('adm_an_no_data_today', 'Sin datos hoy') + '</div>';
    } else {
      var maxHits = topScreens[0][1] || 1;
      topScreens.forEach(function(s) {
        var pct = Math.round(s[1] / maxHits * 100);
        html += '<div style="margin:4px 0;display:flex;align-items:center;gap:8px;">' +
          '<div style="flex:1;font-size:10px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _anScreenLabel(s[0]) + '</div>' +
          '<div style="flex:2;height:12px;background:#e2e8f0;border-radius:6px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:#3b82f6;border-radius:6px;"></div></div>' +
          '<div style="font-size:10px;color:#64748b;min-width:24px;text-align:right;">' + s[1] + '</div></div>';
      });
    }
    html += '</div></div>';

    el.innerHTML = html;
  } catch (e) {
    console.error('[Analytics Overview]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">' + _t('adm_an_error_loading', 'Error cargando datos: ') + _escHtml(e.message || '') + '</div>';
  }
}

// ==================== TAB 2: RETENCIÓN POR COHORTE ====================
async function _anLoadRetention() {
  var el = document.getElementById('anTabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading_cohorts', 'Cargando cohortes...') + '</div>';

  try {
    if (!_anCache.users) {
      var _anAll = [], _anOff = 0, _anMore = true;
      while (_anMore) {
        var r = await usersDataAdmin('admin_list', { offset: _anOff, limit: 1000, fields: ["ultimo_acceso","nombre","email","fecha_registro"] });
        var _anBatch = r.data || [];
        _anAll = _anAll.concat(_anBatch);
        if (_anBatch.length < 1000) _anMore = false; else _anOff += 1000;
      }
      _anCache.users = _anAll;
    }
    var users = _anCache.users;

    // Get screen events for last ~9 weeks
    var now = new Date();
    var nineWeeksAgo = new Date(now - 63 * 24 * 60 * 60 * 1000).toISOString();
    if (!_anCache.retentionEvents) {
      var r2 = await supabaseClient.from('screen_events')
        .select('user_email, entered_at')
        .gte('entered_at', nineWeeksAgo);
      _anCache.retentionEvents = (r2.data || []);
    }
    var events = _anCache.retentionEvents;

    // Build email->set of active weeks
    var emailWeeks = {};
    events.forEach(function(e) {
      if (!emailWeeks[e.user_email]) emailWeeks[e.user_email] = new Set();
      var ws = _anWeekStart(new Date(e.entered_at));
      emailWeeks[e.user_email].add(_anDateStr(ws));
    });

    // Build cohorts (weekly based on fecha_registro)
    var cohorts = {};
    users.forEach(function(u) {
      if (!u.fecha_registro) return;
      var regWeek = _anDateStr(_anWeekStart(new Date(u.fecha_registro)));
      if (!cohorts[regWeek]) cohorts[regWeek] = [];
      cohorts[regWeek].push(u.email);
    });

    // Sort cohorts by week (newest first), take last 8
    var cohortKeys = Object.keys(cohorts).sort().reverse().slice(0, 8).reverse();

    var html = '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_cohort_title', 'Retenci\u00F3n por Cohorte Semanal') + '</div>';
    html += '<div style="overflow-x:auto;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
    html += '<tr style="background:#f1f5f9;"><th style="padding:6px 8px;text-align:left;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_cohort', 'Cohorte') + '</th><th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_users', 'Usuarios') + '</th>';
    for (var w = 0; w <= 8; w++) {
      html += '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">S' + w + '</th>';
    }
    html += '</tr>';

    cohortKeys.forEach(function(ck) {
      var cohortEmails = cohorts[ck];
      var cohortSize = cohortEmails.length;
      var cohortStart = new Date(ck);

      html += '<tr><td style="padding:6px 8px;color:#1e293b;border:1px solid #e2e8f0;white-space:nowrap;font-weight:500;">' + ck + '</td>';
      html += '<td style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + cohortSize + '</td>';

      for (var w = 0; w <= 8; w++) {
        var weekDate = new Date(cohortStart.getTime() + w * 7 * 24 * 60 * 60 * 1000);
        var weekStr = _anDateStr(_anWeekStart(weekDate));

        // Only show if this week has passed
        if (weekDate > now) {
          html += '<td style="padding:6px;text-align:center;color:#cbd5e1;border:1px solid #e2e8f0;">-</td>';
          continue;
        }

        var retained = 0;
        cohortEmails.forEach(function(email) {
          if (emailWeeks[email] && emailWeeks[email].has(weekStr)) retained++;
        });
        var pct = cohortSize > 0 ? Math.round(retained / cohortSize * 100) : 0;
        var color = _anColorScale(pct);

        html += '<td style="padding:6px;text-align:center;font-weight:600;color:' + color.text + ';background:' + color.bg + ';border:1px solid #e2e8f0;">' + pct + '%</td>';
      }
      html += '</tr>';
    });

    html += '</table></div>';

    if (cohortKeys.length === 0) {
      html += '<div style="text-align:center;padding:20px;color:#94a3b8;">' + _t('adm_an_no_cohort', 'Sin datos de cohorte disponibles. Se necesita la tabla screen_events con datos.') + '</div>';
    }

    html += '<div style="margin-top:8px;font-size:9px;color:#94a3b8;">' + _t('adm_an_cohort_legend', 'Verde: >60% | Amarillo: 30-60% | Rojo: <30%. Cohortes basadas en fecha de registro.') + '</div>';

    el.innerHTML = html;
  } catch (e) {
    console.error('[Analytics Retention]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">Error: ' + _escHtml(e.message || '') + '</div>';
  }
}

// ==================== TAB 3: ENGAGEMENT POR PANTALLA ====================
async function _anLoadScreenEngagement() {
  var el = document.getElementById('anTabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading_screens', 'Cargando datos de pantallas...') + '</div>';

  try {
    var now = new Date();
    var monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

    if (!_anCache.screenEvents30d) {
      var r = await supabaseClient.from('screen_events')
        .select('user_email, screen_id, duration_sec, session_id, entered_at')
        .gte('entered_at', monthAgo);
      _anCache.screenEvents30d = (r.data || []);
    }
    var events = _anCache.screenEvents30d;

    // Aggregate per screen
    var screens = {};
    events.forEach(function(e) {
      if (!screens[e.screen_id]) screens[e.screen_id] = { visits: 0, users: new Set(), totalDur: 0, durCount: 0, lastInSession: {} };
      var s = screens[e.screen_id];
      s.visits++;
      s.users.add(e.user_email);
      if (e.duration_sec > 0) {
        s.totalDur += e.duration_sec;
        s.durCount++;
      }
    });

    // Calculate exit rate: for each session, find the last event — that screen is the "exit"
    var sessionLastEvent = {};
    events.forEach(function(e) {
      if (!sessionLastEvent[e.session_id] || e.entered_at > sessionLastEvent[e.session_id].entered_at) {
        sessionLastEvent[e.session_id] = e;
      }
    });
    var exitCounts = {};
    var totalSessions = Object.keys(sessionLastEvent).length;
    Object.values(sessionLastEvent).forEach(function(e) {
      exitCounts[e.screen_id] = (exitCounts[e.screen_id] || 0) + 1;
    });

    // Build sorted list
    var screenList = Object.entries(screens).map(function(entry) {
      var id = entry[0], s = entry[1];
      return {
        id: id,
        label: _anScreenLabel(id),
        visits: s.visits,
        uniqueUsers: s.users.size,
        avgDur: s.durCount > 0 ? Math.round(s.totalDur / s.durCount) : 0,
        exitRate: totalSessions > 0 ? Math.round((exitCounts[id] || 0) / s.visits * 100) : 0
      };
    });
    screenList.sort(function(a, b) { return b.visits - a.visits; });

    var html = '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_screen_title', 'Engagement por Pantalla (\u00FAltimos 30 d\u00EDas)') + '</div>';

    // Sort controls
    html += '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">';
    ['visits', 'uniqueUsers', 'avgDur', 'exitRate'].forEach(function(key) {
      var labels = { visits: _t('adm_an_visits', 'Visitas'), uniqueUsers: _t('adm_an_users', 'Usuarios'), avgDur: _t('adm_an_time', 'Tiempo'), exitRate: _t('adm_an_exit_rate', 'Tasa Salida') };
      html += '<button onclick="_anSortScreens(\'' + key + '\')" style="padding:4px 8px;border-radius:6px;font-size:9px;cursor:pointer;border:1px solid #e2e8f0;background:#f8fafc;color:#475569;">' + labels[key] + '</button>';
    });
    html += '</div>';

    html += '<div style="overflow-x:auto;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
    html += '<tr style="background:#f1f5f9;">' +
      '<th style="padding:6px 8px;text-align:left;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_screen_label', 'Pantalla') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_visits', 'Visitas') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_users', 'Usuarios') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_avg_time_label', 'Tiempo Prom.') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_exit_rate', 'Tasa Salida') + '</th></tr>';

    var maxVisits = screenList.length > 0 ? screenList[0].visits : 1;
    screenList.forEach(function(s) {
      var intensity = Math.min(Math.round(s.visits / maxVisits * 100), 100);
      var bgColor = 'rgba(59, 130, 246, ' + (intensity / 400) + ')';
      var durStr = s.avgDur >= 60 ? Math.round(s.avgDur / 60) + 'm ' + (s.avgDur % 60) + 's' : s.avgDur + 's';
      html += '<tr style="background:' + bgColor + ';">' +
        '<td style="padding:6px 8px;color:#1e293b;border:1px solid #e2e8f0;font-weight:500;">' + s.label + '</td>' +
        '<td style="padding:6px;text-align:center;color:#1e293b;border:1px solid #e2e8f0;">' + s.visits + '</td>' +
        '<td style="padding:6px;text-align:center;color:#1e293b;border:1px solid #e2e8f0;">' + s.uniqueUsers + '</td>' +
        '<td style="padding:6px;text-align:center;color:#1e293b;border:1px solid #e2e8f0;">' + durStr + '</td>' +
        '<td style="padding:6px;text-align:center;color:#1e293b;border:1px solid #e2e8f0;">' + s.exitRate + '%</td></tr>';
    });
    html += '</table></div>';

    if (screenList.length === 0) {
      html += '<div style="text-align:center;padding:20px;color:#94a3b8;">' + _t('adm_an_no_screen_data', 'Sin datos de pantallas. Navega por la app para generar datos en screen_events.') + '</div>';
    }

    el.innerHTML = html;

    // Store for sorting
    _anCache._screenList = screenList;
  } catch (e) {
    console.error('[Analytics Screens]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">Error: ' + _escHtml(e.message || '') + '</div>';
  }
}

function _anSortScreens(key) {
  var list = _anCache._screenList;
  if (!list) return;
  list.sort(function(a, b) { return b[key] - a[key]; });
  _anCache._screenList = list;
  // Re-render via the same tab
  _anLoadScreenEngagement();
}

// ==================== TAB 4: PERFIL INDIVIDUAL ====================
async function _anLoadStudentProfile(selectedEmail) {
  var el = document.getElementById('anTabContent');
  if (!el) return;

  // Ensure users are loaded
  if (!_anCache.users) {
      var _anAll = [], _anOff = 0, _anMore = true;
      while (_anMore) {
        var r = await usersDataAdmin('admin_list', { offset: _anOff, limit: 1000, fields: ["ultimo_acceso","nombre","email","fecha_registro"] });
        var _anBatch = r.data || [];
        _anAll = _anAll.concat(_anBatch);
        if (_anBatch.length < 1000) _anMore = false; else _anOff += 1000;
      }
      _anCache.users = _anAll;
  }
  var users = _anCache.users;

  if (!selectedEmail) {
    // Show search/selector
    var html = '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_profile_title', 'Perfil Individual de Estudiante') + '</div>';
    html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">';
    html += '<input type="text" id="anStudentSearch" placeholder="' + _t('adm_an_search', 'Buscar por nombre o email...') + '" oninput="_anFilterStudents()" style="flex:1;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;outline:none;">';
    html += '</div>';
    html += '<div id="anStudentList" style="max-height:400px;overflow-y:auto;">';

    // Show all students sorted by name
    var sorted = users.slice().sort(function(a, b) { return (a.nombre || '').localeCompare(b.nombre || ''); });
    sorted.forEach(function(u) {
      var lastAccess = u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleDateString() : _t('adm_an_never', 'Nunca');
      html += '<div onclick="_anLoadStudentProfile(\'' + (u.email || '').replace(/'/g, "\\'") + '\')" style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'transparent\'">' +
        '<div><div style="font-size:12px;color:#1e293b;font-weight:500;">' + _escHtml(u.nombre || _t('adm_an_no_name', 'Sin nombre')) + '</div>' +
        '<div style="font-size:10px;color:#94a3b8;">' + _escHtml(u.email || '') + '</div></div>' +
        '<div style="font-size:10px;color:#94a3b8;">' + lastAccess + '</div></div>';
    });
    html += '</div>';
    el.innerHTML = html;
    return;
  }

  // Load full profile for selected student
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading_profile', 'Cargando perfil...') + '</div>';

  try {
    var user = users.find(function(u) { return u.email === selectedEmail; });
    if (!user) {
      el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">' + _t('adm_an_not_found', 'Estudiante no encontrado') + '</div>';
      return;
    }

    // Parallel queries
    var promises = [
      supabaseClient.from('screen_events').select('screen_id, entered_at, duration_sec, session_id').eq('user_email', selectedEmail).order('entered_at', { ascending: false }).limit(200),
      supabaseClient.from('quiz_results').select('score, nivel, created_at').eq('user_email', selectedEmail).order('created_at', { ascending: false }).limit(50),
      supabaseClient.from('exam_submissions').select('id, created_at, nivel, status').eq('user_email', selectedEmail).order('created_at', { ascending: false }).limit(20),
      supabaseClient.from('certificates').select('id, nivel, fecha_obtenido, certificate_number').eq('user_email', selectedEmail),
      supabaseClient.from('attendance_log').select('id, fecha, status').eq('user_email', selectedEmail).order('fecha', { ascending: false }).limit(30)
    ];

    var results = await Promise.all(promises);
    var screenEvts = results[0].data || [];
    var quizzes = results[1].data || [];
    var exams = results[2].data || [];
    var certs = results[3].data || [];
    var attendance = results[4].data || [];

    // Calculate metrics
    var sessions = new Set();
    var totalDur = 0;
    var screenSet = new Set();
    screenEvts.forEach(function(e) {
      if (e.session_id) sessions.add(e.session_id);
      if (e.duration_sec > 0) totalDur += e.duration_sec;
      screenSet.add(e.screen_id);
    });

    var avgQuizScore = 0;
    if (quizzes.length > 0) {
      avgQuizScore = Math.round(quizzes.reduce(function(a, q) { return a + (q.score || 0); }, 0) / quizzes.length);
    }

    // Streak calculation (consecutive days with screen events)
    var activeDays = new Set();
    screenEvts.forEach(function(e) { activeDays.add(e.entered_at.split('T')[0]); });
    var streak = 0;
    var checkDate = new Date();
    for (var i = 0; i < 365; i++) {
      if (activeDays.has(_anDateStr(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Engagement score
    var engScore = _anCalcEngagement({
      sessionCount: sessions.size,
      totalDur: totalDur,
      quizCount: quizzes.length,
      screenVariety: screenSet.size,
      lastAccess: user.ultimo_acceso,
      streak: streak
    });

    // Risk level
    var riskLevel = _anCalcRiskLevel(user, quizzes);
    var riskColors = { active: '#22c55e', at_risk: '#f59e0b', inactive: '#f97316', lost: '#ef4444' };
    var riskLabels = { active: _t('adm_an_active', 'Activo'), at_risk: _t('adm_an_at_risk', 'En Riesgo'), inactive: _t('adm_an_inactive', 'Inactivo'), lost: _t('adm_an_lost', 'Perdido') };

    // Build HTML
    var html = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
    html += '<button onclick="_anLoadStudentProfile()" style="background:#f1f5f9;padding:5px 10px;border-radius:6px;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-size:10px;">' + _t('adm_an_back', '\u2190 Volver') + '</button>';
    html += '<div style="font-size:14px;color:#1e293b;font-weight:700;">' + _escHtml(user.nombre || _t('adm_an_no_name', 'Sin nombre')) + '</div>';
    html += '<span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:9px;font-weight:600;color:white;background:' + (riskColors[riskLevel] || '#94a3b8') + ';">' + (riskLabels[riskLevel] || riskLevel) + '</span>';
    html += '</div>';
    html += '<div style="font-size:10px;color:#94a3b8;margin-bottom:12px;">' + _escHtml(user.email || '') + ' | ' + _t('adm_an_registered', 'Registrado: ') + (user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : 'N/A') + '</div>';

    // Metrics cards
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:6px;margin-bottom:12px;">';
    var metrics = [
      { label: _t('adm_an_sessions', 'Sesiones'), value: sessions.size, color: '#3b82f6' },
      { label: _t('adm_an_total_time', 'Tiempo Total'), value: Math.round(totalDur / 60) + 'm', color: '#8b5cf6' },
      { label: _t('adm_an_streak', 'Racha Actual'), value: streak + 'd', color: '#f59e0b' },
      { label: _t('adm_an_avg_score', 'Score Prom.'), value: avgQuizScore + '%', color: '#10b981' },
      { label: _t('adm_an_quizzes', 'Quizzes'), value: quizzes.length, color: '#06b6d4' },
      { label: _t('adm_an_certificates', 'Certificados'), value: certs.length, color: '#ec4899' },
      { label: _t('adm_an_engagement', 'Engagement'), value: engScore + '/100', color: engScore >= 60 ? '#22c55e' : (engScore >= 30 ? '#f59e0b' : '#ef4444') }
    ];
    metrics.forEach(function(m) {
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center;">' +
        '<div style="font-size:8px;color:#94a3b8;margin-bottom:2px;">' + m.label + '</div>' +
        '<div style="font-size:16px;font-weight:bold;color:' + m.color + ';">' + m.value + '</div></div>';
    });
    html += '</div>';

    // Timeline
    html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:8px;">';
    html += '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_recent', 'Actividad Reciente') + '</div>';
    html += '<div style="max-height:250px;overflow-y:auto;">';

    // Merge events into timeline
    var timeline = [];
    screenEvts.slice(0, 30).forEach(function(e) {
      timeline.push({ type: 'screen', label: _anScreenLabel(e.screen_id), date: e.entered_at, dur: e.duration_sec });
    });
    quizzes.slice(0, 10).forEach(function(q) {
      timeline.push({ type: 'quiz', label: 'Quiz ' + (q.nivel || '') + ': ' + q.score + ' pts', date: q.created_at });
    });
    exams.slice(0, 5).forEach(function(x) {
      timeline.push({ type: 'exam', label: 'Examen ' + (x.nivel || '') + ' (' + (x.status || 'enviado') + ')', date: x.created_at });
    });
    certs.forEach(function(c) {
      timeline.push({ type: 'cert', label: 'Certificado: ' + (c.nivel || '') + ' #' + (c.certificate_number || ''), date: c.fecha_obtenido });
    });
    timeline.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

    var typeIcons = { screen: '📱', quiz: '📝', exam: '📋', cert: '🏆' };
    var typeColors = { screen: '#3b82f6', quiz: '#8b5cf6', exam: '#f59e0b', cert: '#22c55e' };
    timeline.slice(0, 40).forEach(function(t) {
      var d = new Date(t.date);
      var dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      html += '<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f1f5f9;align-items:center;">' +
        '<div style="font-size:12px;">' + (typeIcons[t.type] || '') + '</div>' +
        '<div style="flex:1;font-size:10px;color:#1e293b;">' + t.label + (t.dur ? ' (' + t.dur + 's)' : '') + '</div>' +
        '<div style="font-size:9px;color:#94a3b8;white-space:nowrap;">' + dateStr + '</div></div>';
    });

    if (timeline.length === 0) {
      html += '<div style="text-align:center;color:#94a3b8;font-size:11px;padding:12px;">' + _t('adm_an_no_activity', 'Sin actividad registrada') + '</div>';
    }
    html += '</div></div>';

    // Pantallas más visitadas
    html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">';
    html += '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_top_visited', 'Pantallas M\u00E1s Visitadas') + '</div>';
    var screenCounts = {};
    screenEvts.forEach(function(e) { screenCounts[e.screen_id] = (screenCounts[e.screen_id] || 0) + 1; });
    var sortedScreens = Object.entries(screenCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8);
    var maxSV = sortedScreens.length > 0 ? sortedScreens[0][1] : 1;
    sortedScreens.forEach(function(s) {
      var pct = Math.round(s[1] / maxSV * 100);
      html += '<div style="margin:3px 0;display:flex;align-items:center;gap:6px;">' +
        '<div style="min-width:80px;font-size:10px;color:#475569;">' + _anScreenLabel(s[0]) + '</div>' +
        '<div style="flex:1;height:10px;background:#e2e8f0;border-radius:5px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:#8b5cf6;border-radius:5px;"></div></div>' +
        '<div style="font-size:9px;color:#64748b;min-width:20px;text-align:right;">' + s[1] + '</div></div>';
    });
    html += '</div>';

    el.innerHTML = html;
  } catch (e) {
    console.error('[Analytics Profile]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">Error: ' + _escHtml(e.message || '') + '</div>';
  }
}

function _anFilterStudents() {
  var search = (document.getElementById('anStudentSearch') || {}).value || '';
  search = search.toLowerCase();
  var list = document.getElementById('anStudentList');
  if (!list) return;
  var items = list.children;
  for (var i = 0; i < items.length; i++) {
    var text = items[i].textContent.toLowerCase();
    items[i].style.display = text.indexOf(search) >= 0 ? '' : 'none';
  }
}

// ==================== TAB 5: RIESGO DE ABANDONO ====================
async function _anLoadChurnRisk() {
  var el = document.getElementById('anTabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading_risk', 'Analizando riesgo...') + '</div>';

  try {
    if (!_anCache.users) {
      var _anAll = [], _anOff = 0, _anMore = true;
      while (_anMore) {
        var r = await usersDataAdmin('admin_list', { offset: _anOff, limit: 1000, fields: ["ultimo_acceso","nombre","email","fecha_registro"] });
        var _anBatch = r.data || [];
        _anAll = _anAll.concat(_anBatch);
        if (_anBatch.length < 1000) _anMore = false; else _anOff += 1000;
      }
      _anCache.users = _anAll;
    }
    var users = _anCache.users;

    // Get quiz activity in last 14 days
    var now = new Date();
    var twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();
    if (!_anCache.recentQuizzes) {
      var r2 = await supabaseClient.from('quiz_results').select('user_email, created_at').gte('created_at', twoWeeksAgo);
      _anCache.recentQuizzes = (r2.data || []);
    }
    var recentQuizEmails = new Set();
    (_anCache.recentQuizzes || []).forEach(function(q) { recentQuizEmails.add(q.user_email); });

    // Get memberships
    if (!_anCache.memberships) {
      var r3 = await supabaseClient.from('memberships').select('user_email, activa, plan_name');
      _anCache.memberships = (r3.data || []);
    }
    var membershipMap = {};
    (_anCache.memberships || []).forEach(function(m) {
      membershipMap[m.user_email || m.email] = m;
    });

    // Get weekly session counts per user from screen_events (last 4 weeks)
    var fourWeeksAgo = new Date(now - 28 * 24 * 60 * 60 * 1000).toISOString();
    if (!_anCache.churnEvents) {
      var r4 = await supabaseClient.from('screen_events')
        .select('user_email, entered_at, session_id')
        .gte('entered_at', fourWeeksAgo);
      _anCache.churnEvents = (r4.data || []);
    }
    var churnEvents = _anCache.churnEvents || [];

    // Weekly sessions per user
    var userWeeklySessions = {};
    churnEvents.forEach(function(e) {
      if (!userWeeklySessions[e.user_email]) userWeeklySessions[e.user_email] = [{}, {}, {}, {}];
      var weeksAgo = Math.floor((now - new Date(e.entered_at)) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo >= 0 && weeksAgo < 4 && e.session_id) {
        userWeeklySessions[e.user_email][weeksAgo][e.session_id] = true;
      }
    });

    // Build risk list
    var riskList = users.map(function(u) {
      var daysInactive = u.ultimo_acceso ? _anDaysBetween(new Date(u.ultimo_acceso), now) : 999;
      var hasRecentQuiz = recentQuizEmails.has(u.email);
      var membership = membershipMap[u.email];

      // Weekly trend
      var weeklySess = (userWeeklySessions[u.email] || [{}, {}, {}, {}]).map(function(w) { return Object.keys(w).length; });
      var declining = weeklySess[0] < weeklySess[1] && weeklySess[1] < weeklySess[2];

      var risk = _anCalcRiskLevel(u, []);
      var engScore = _anCalcEngagement({
        sessionCount: weeklySess.reduce(function(a, b) { return a + b; }, 0),
        totalDur: 0,
        quizCount: hasRecentQuiz ? 1 : 0,
        screenVariety: 0,
        lastAccess: u.ultimo_acceso,
        streak: 0
      });

      return {
        nombre: u.nombre || _t('adm_an_no_name', 'Sin nombre'),
        email: u.email,
        lastAccess: u.ultimo_acceso,
        daysInactive: daysInactive,
        risk: risk,
        engScore: engScore,
        hasRecentQuiz: hasRecentQuiz,
        declining: declining,
        hasMembership: membership && membership.activa
      };
    });

    // Sort by risk (lost > inactive > at_risk > active) then by daysInactive
    var riskOrder = { lost: 0, inactive: 1, at_risk: 2, active: 3 };
    riskList.sort(function(a, b) {
      var diff = (riskOrder[a.risk] || 4) - (riskOrder[b.risk] || 4);
      return diff !== 0 ? diff : b.daysInactive - a.daysInactive;
    });

    var riskColors = { active: '#22c55e', at_risk: '#f59e0b', inactive: '#f97316', lost: '#ef4444' };
    var riskLabels = { active: _t('adm_an_active', 'Activo'), at_risk: _t('adm_an_at_risk', 'En Riesgo'), inactive: _t('adm_an_inactive', 'Inactivo'), lost: _t('adm_an_lost', 'Perdido') };

    // Summary counts
    var counts = { active: 0, at_risk: 0, inactive: 0, lost: 0 };
    riskList.forEach(function(r) { counts[r.risk] = (counts[r.risk] || 0) + 1; });

    var html = '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_risk_title', 'Riesgo de Abandono') + '</div>';

    // Summary cards
    html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">';
    [
      { key: 'active', icon: '🟢' },
      { key: 'at_risk', icon: '🟡' },
      { key: 'inactive', icon: '🟠' },
      { key: 'lost', icon: '🔴' }
    ].forEach(function(r) {
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center;">' +
        '<div style="font-size:9px;color:#94a3b8;">' + r.icon + ' ' + riskLabels[r.key] + '</div>' +
        '<div style="font-size:18px;font-weight:bold;color:' + riskColors[r.key] + ';">' + (counts[r.key] || 0) + '</div></div>';
    });
    html += '</div>';

    // Table
    html += '<div style="max-height:400px;overflow-y:auto;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:10px;">';
    html += '<tr style="background:#f1f5f9;position:sticky;top:0;">' +
      '<th style="padding:6px 8px;text-align:left;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_name', 'Nombre') + '</th>' +
      '<th style="padding:6px;text-align:left;color:#475569;border:1px solid #e2e8f0;">Email</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_last_access', '\u00DAltimo Acceso') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_days_inactive', 'D\u00EDas Inactivo') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_risk', 'Riesgo') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_engagement', 'Engagement') + '</th>' +
      '<th style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + _t('adm_an_actions', 'Acciones') + '</th></tr>';

    riskList.forEach(function(r) {
      var lastStr = r.lastAccess ? new Date(r.lastAccess).toLocaleDateString() : _t('adm_an_never', 'Nunca');
      var daysStr = r.daysInactive >= 999 ? 'N/A' : r.daysInactive + 'd';
      html += '<tr>' +
        '<td style="padding:6px 8px;color:#1e293b;border:1px solid #e2e8f0;font-weight:500;">' + _escHtml(r.nombre) + '</td>' +
        '<td style="padding:6px;color:#64748b;border:1px solid #e2e8f0;font-size:9px;">' + _escHtml(r.email) + '</td>' +
        '<td style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + lastStr + '</td>' +
        '<td style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + daysStr + '</td>' +
        '<td style="padding:6px;text-align:center;border:1px solid #e2e8f0;"><span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:9px;font-weight:600;color:white;background:' + (riskColors[r.risk] || '#94a3b8') + ';">' + (riskLabels[r.risk] || r.risk) + '</span></td>' +
        '<td style="padding:6px;text-align:center;color:#475569;border:1px solid #e2e8f0;">' + r.engScore + '</td>' +
        '<td style="padding:6px;text-align:center;border:1px solid #e2e8f0;">' +
        '<button onclick="_anActiveTab=\'profile\';_anRenderTabs(document.getElementById(\'analyticsRoot\'));_anLoadStudentProfile(\'' + r.email.replace(/'/g, "\\'") + '\')" style="background:#3b82f6;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:9px;">' + _t('adm_an_view', 'Ver') + '</button>' +
        '</td></tr>';
    });
    html += '</table></div>';

    el.innerHTML = html;
  } catch (e) {
    console.error('[Analytics Churn]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">Error: ' + _escHtml(e.message || '') + '</div>';
  }
}

// ==================== TAB 6: USO DE FEATURES ====================
async function _anLoadFeatureUsage() {
  var el = document.getElementById('anTabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">' + _t('adm_an_loading_features', 'Cargando uso de features...') + '</div>';

  try {
    var now = new Date();
    var monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    var twoMonthsAgo = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString();

    if (!_anCache.users) {
      var _anAll = [], _anOff = 0, _anMore = true;
      while (_anMore) {
        var r = await usersDataAdmin('admin_list', { offset: _anOff, limit: 1000, fields: ["ultimo_acceso","nombre","email","fecha_registro"] });
        var _anBatch = r.data || [];
        _anAll = _anAll.concat(_anBatch);
        if (_anBatch.length < 1000) _anMore = false; else _anOff += 1000;
      }
      _anCache.users = _anAll;
    }
    var totalStudents = _anCache.users.length || 1;

    // Get events last 30 days and previous 30 days
    if (!_anCache.featureEvents) {
      var r2 = await supabaseClient.from('screen_events')
        .select('user_email, screen_id, entered_at')
        .gte('entered_at', twoMonthsAgo);
      _anCache.featureEvents = (r2.data || []);
    }
    var events = _anCache.featureEvents;

    // Features to track (map display label -> screen_ids). Labels go through _t for i18n.
    var featureMap = {};
    featureMap[_t('adm_an_scr_dashboard', 'Dashboard')] = ['dashboardScreen'];
    featureMap[_t('adm_an_feat_quizzes', 'Quizzes')] = ['quizScreen', 'quizOnlyScreen', 'levelsScreen'];
    featureMap[_t('adm_an_scr_exams', 'Ex\u00E1menes')] = ['studentExamsScreen'];
    featureMap[_t('adm_an_scr_chat', 'Chat')] = ['techChatScreen'];
    featureMap[_t('adm_an_scr_live', 'Live Stream')] = ['liveStreamingScreen'];
    featureMap[_t('adm_an_scr_feed', 'HVAC Feed')] = ['hvacFeedScreen'];
    featureMap[_t('adm_an_scr_marketplace', 'Marketplace')] = ['marketplaceScreen'];
    featureMap[_t('adm_an_scr_certs', 'Certificados')] = ['certificatesScreen'];
    featureMap[_t('adm_an_scr_profile', 'Mi Perfil')] = ['miPerfilScreen'];
    featureMap[_t('adm_an_scr_progress', 'Mi Progreso')] = ['studentProgressScreen'];
    featureMap[_t('adm_an_scr_calendar', 'Calendario')] = ['studentCalendarScreen'];
    featureMap[_t('adm_an_scr_referrals', 'Referidos')] = ['referidosScreen'];
    featureMap[_t('adm_an_scr_videos', 'Video Tutoriales')] = ['videoTutorialesScreen'];
    featureMap[_t('adm_an_scr_radio', 'Radio/Podcast')] = ['radioPodcastScreen'];
    featureMap[_t('adm_an_scr_suggestions', 'Sugerencias')] = ['sugerenciasScreen'];

    // Current month and previous month user sets per feature
    var currentMonth = {};
    var prevMonth = {};
    Object.keys(featureMap).forEach(function(f) {
      currentMonth[f] = new Set();
      prevMonth[f] = new Set();
    });

    events.forEach(function(e) {
      var isCurrentMonth = e.entered_at >= monthAgo;
      var isPrevMonth = e.entered_at >= twoMonthsAgo && e.entered_at < monthAgo;

      Object.entries(featureMap).forEach(function(entry) {
        var featureName = entry[0], screenIds = entry[1];
        if (screenIds.indexOf(e.screen_id) >= 0) {
          if (isCurrentMonth) currentMonth[featureName].add(e.user_email);
          if (isPrevMonth) prevMonth[featureName].add(e.user_email);
        }
      });
    });

    // Build feature list with adoption percentages
    var featureList = Object.keys(featureMap).map(function(name) {
      var current = currentMonth[name].size;
      var prev = prevMonth[name].size;
      var adoptionPct = Math.round(current / totalStudents * 100);
      var prevPct = Math.round(prev / totalStudents * 100);
      var diff = adoptionPct - prevPct;
      return { name: name, users: current, pct: adoptionPct, diff: diff };
    });

    // Sort by adoption
    featureList.sort(function(a, b) { return b.pct - a.pct; });

    var html = '<div style="font-size:11px;color:#475569;font-weight:600;margin-bottom:8px;">' + _t('adm_an_adoption_title', 'Adopci\u00F3n de Features (\u00FAltimos 30 d\u00EDas)') + '</div>';
    html += '<div style="font-size:9px;color:#94a3b8;margin-bottom:12px;">' + totalStudents + _t('adm_an_total_students', ' estudiantes totales | Comparaci\u00F3n vs mes anterior') + '</div>';

    featureList.forEach(function(f) {
      var barColor = f.pct >= 50 ? '#22c55e' : (f.pct >= 20 ? '#3b82f6' : '#94a3b8');
      var diffStr = '';
      if (f.diff > 0) diffStr = '<span style="color:#22c55e;font-size:10px;font-weight:600;">↑' + f.diff + '%</span>';
      else if (f.diff < 0) diffStr = '<span style="color:#ef4444;font-size:10px;font-weight:600;">↓' + Math.abs(f.diff) + '%</span>';
      else diffStr = '<span style="color:#94a3b8;font-size:10px;">→</span>';

      html += '<div style="margin:6px 0;display:flex;align-items:center;gap:8px;">' +
        '<div style="min-width:100px;font-size:11px;color:#1e293b;font-weight:500;">' + f.name + '</div>' +
        '<div style="flex:1;height:18px;background:#f1f5f9;border-radius:9px;overflow:hidden;position:relative;">' +
        '<div style="height:100%;width:' + Math.max(f.pct, 2) + '%;background:' + barColor + ';border-radius:9px;transition:width 0.3s;"></div>' +
        '<div style="position:absolute;right:6px;top:2px;font-size:9px;color:#475569;font-weight:600;">' + f.pct + '% (' + f.users + ')</div>' +
        '</div>' +
        '<div style="min-width:36px;text-align:right;">' + diffStr + '</div></div>';
    });

    if (featureList.length === 0 || events.length === 0) {
      html += '<div style="text-align:center;padding:20px;color:#94a3b8;">' + _t('adm_an_no_feature_data', 'Sin datos de uso. Se necesita la tabla screen_events con datos.') + '</div>';
    }

    el.innerHTML = html;
  } catch (e) {
    console.error('[Analytics Features]', e);
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#ef4444;">Error: ' + _escHtml(e.message || '') + '</div>';
  }
}

// ==================== ENGAGEMENT & RISK CALCULATIONS ====================
function _anCalcEngagement(data) {
  // Score 0-100 based on: frequency, duration, quizzes, variety, recency
  var score = 0;

  // Recency (max 30 pts)
  if (data.lastAccess) {
    var daysAgo = _anDaysBetween(new Date(data.lastAccess), new Date());
    if (daysAgo === 0) score += 30;
    else if (daysAgo <= 1) score += 25;
    else if (daysAgo <= 3) score += 20;
    else if (daysAgo <= 7) score += 15;
    else if (daysAgo <= 14) score += 8;
    else if (daysAgo <= 30) score += 3;
  }

  // Session frequency (max 25 pts)
  var sessions = data.sessionCount || 0;
  score += Math.min(sessions * 2, 25);

  // Quiz completion (max 20 pts)
  var quizzes = data.quizCount || 0;
  score += Math.min(quizzes * 4, 20);

  // Screen variety (max 15 pts)
  var variety = data.screenVariety || 0;
  score += Math.min(variety * 2, 15);

  // Streak bonus (max 10 pts)
  var streak = data.streak || 0;
  score += Math.min(streak * 2, 10);

  return Math.min(Math.round(score), 100);
}

function _anCalcRiskLevel(user, quizzes) {
  if (!user.ultimo_acceso) return 'lost';

  var daysInactive = _anDaysBetween(new Date(user.ultimo_acceso), new Date());

  if (daysInactive <= 3) return 'active';
  if (daysInactive <= 7) return 'at_risk';
  if (daysInactive <= 21) return 'inactive';
  return 'lost';
}
