// ============================================
// DESAFÍO ADMIN — Admin panel for Desafío MaestroAC
// Self-bootstrapping: injects sidebar item + panel div
// Replaces old game-analytics.js
// ============================================

if (typeof _addTranslations === 'function') _addTranslations({
  dsa_sidebar: { es: 'Desafío Maestro HVACR', en: 'Maestro HVACR Challenge' },
  dsa_supabase_err: { es: 'Supabase no conectado.', en: 'Supabase not connected.' },
  dsa_loading: { es: 'Cargando datos del Desafío...', en: 'Loading Challenge data...' },
  dsa_load_error: { es: 'No se pudo cargar', en: 'Could not load' },
  dsa_table_prompt: { es: '¿Ya creaste la tabla desafio_progress?', en: 'Have you created the desafio_progress table?' },
  dsa_panel_title: { es: '🎮 Desafío Maestro HVACR — Panel de Administración', en: '🎮 Maestro HVACR Challenge — Admin Panel' },
  dsa_active_students: { es: 'Estudiantes Activos', en: 'Active Students' },
  dsa_certs_issued: { es: 'Certificados Emitidos', en: 'Certificates Issued' },
  dsa_avg_score: { es: 'Promedio General', en: 'Overall Average' },
  dsa_corrida_funnel: { es: '📊 Embudo de Corridas', en: '📊 Run Funnel' },
  dsa_corrida_apprentice: { es: 'Aprendiz', en: 'Apprentice' },
  dsa_corrida_performance: { es: 'Técnico en Desempeño', en: 'Performance Technician' },
  dsa_corrida_advanced: { es: 'Técnico Avanzado', en: 'Advanced Technician' },
  dsa_corrida_specialist: { es: 'T\u00E9cnico Especialista', en: 'Specialist Technician' },
  dsa_corrida_platinum: { es: 'T\u00E9cnico Platino', en: 'Platinum Technician' },
  dsa_completion_map: { es: '🗺️ Mapa de Completación', en: '🗺️ Completion Map' },
  dsa_level: { es: 'Nivel', en: 'Level' },
  dsa_leaderboard: { es: '🏆 Leaderboard — Top 20', en: '🏆 Leaderboard — Top 20' },
  dsa_no_data: { es: 'Sin datos aún', en: 'No data yet' },
  dsa_student: { es: 'Estudiante', en: 'Student' },
  dsa_certificates: { es: 'Certificados', en: 'Certificates' },
  dsa_average: { es: 'Promedio', en: 'Average' },
  dsa_attempts: { es: 'Intentos', en: 'Attempts' },
  dsa_recent: { es: '📋 Completaciones Recientes', en: '📋 Recent Completions' },
  dsa_date: { es: 'Fecha', en: 'Date' },
  dsa_corrida: { es: 'Corrida', en: 'Run' },
  dsa_result: { es: 'Resultado', en: 'Result' },
  dsa_certificate: { es: 'Certificado', en: 'Certificate' },
  dsa_view_print: { es: '🖨️ Ver/Imprimir', en: '🖨️ View/Print' },
  dsa_cert_not_loaded: { es: 'Sistema de certificados no cargado. Recarga la página.', en: 'Certificate system not loaded. Reload the page.' },
});

(function _dsaBootstrap() {
  var analyticsItem = document.querySelector('[data-crm-section="analytics"]');
  if (analyticsItem && !document.querySelector('[data-crm-section="desafioAdmin"]')) {
    var a = document.createElement('a');
    a.className = 'crm-sidebar-item';
    a.setAttribute('data-crm-section', 'desafioAdmin');
    a.setAttribute('data-crm-mode', 'admin');
    a.setAttribute('onclick', "if(typeof showCrmSection==='function')showCrmSection('desafioAdmin',this)");
    a.innerHTML = '<span class="crm-icon">🎮</span> ' + _t('dsa_sidebar');
    analyticsItem.insertAdjacentElement('afterend', a);
  }
  var pageContent = document.querySelector('.crm-page-content') || document.getElementById('crmMain');
  if (pageContent && !document.getElementById('crm-section-desafioAdmin')) {
    var div = document.createElement('div');
    div.className = 'crm-section-panel';
    div.id = 'crm-section-desafioAdmin';
    pageContent.appendChild(div);
  }
})();

var _dsaData = [];

async function loadDesafioAdmin() {
  var panel = document.getElementById('crm-section-desafioAdmin');
  if (!panel) return;
  if (!supabaseClient) {
    panel.innerHTML = '<div style="color:#f87171;padding:20px;">' + _t('dsa_supabase_err') + '</div>';
    return;
  }

  panel.innerHTML = '<div style="color:#94a3b8;padding:20px;">' + _t('dsa_loading') + '</div>';

  try {
    var res = await supabaseClient.from('desafio_progress').select('*').order('completed_at', { ascending: false }).limit(500);
    _dsaData = res.data || [];
  } catch(e) {
    panel.innerHTML = '<div style="color:#f87171;padding:20px;">Error: ' + _dsaEsc(e.message || _t('dsa_load_error')) + '. ' + _t('dsa_table_prompt') + '</div>';
    return;
  }

  _dsaRender(panel);
}

function _dsaRender(panel) {
  if (!panel) panel = document.getElementById('crm-section-desafioAdmin');
  if (!panel) return;

  var data = _dsaData;

  // Unique students
  var students = {};
  data.forEach(function(r) {
    var email = (r.user_email || '').toLowerCase();
    if (!students[email]) students[email] = { certs: 0, total_pct: 0, count: 0, maxCorrida: 0 };
    students[email].count++;
    students[email].total_pct += (r.porcentaje || 0);
    if (r.porcentaje >= 70 && r.certificate_id) students[email].certs++;
    if (r.corrida > students[email].maxCorrida) students[email].maxCorrida = r.corrida;
  });

  var uniqueStudents = Object.keys(students).length;
  var totalCerts = data.filter(function(r) { return r.porcentaje >= 70 && r.certificate_id; }).length;
  var avgScore = data.length > 0 ? Math.round(data.reduce(function(s, r) { return s + (r.porcentaje || 0); }, 0) / data.length) : 0;

  var html = '<style>' +
    '.dsa-title{font-size:20px;font-weight:bold;color:#e2e8f0;margin-bottom:16px}' +
    '.dsa-cards{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}' +
    '.dsa-card{background:#1e293b;border-radius:10px;padding:14px 18px;flex:1;min-width:120px;text-align:center}' +
    '.dsa-card-val{font-size:24px;font-weight:bold;color:#f59e0b}' +
    '.dsa-card-label{font-size:11px;color:#94a3b8;margin-top:2px}' +
    '.dsa-section{font-size:15px;font-weight:700;color:#e2e8f0;margin:20px 0 10px}' +
    '.dsa-funnel{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}' +
    '.dsa-funnel-item{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px;text-align:center;flex:1;min-width:80px}' +
    '.dsa-funnel-count{font-size:22px;font-weight:bold;color:#3b82f6}' +
    '.dsa-funnel-label{font-size:11px;color:#94a3b8}' +
    '.dsa-heatmap{display:grid;grid-template-columns:auto repeat(5,1fr);gap:4px;margin-bottom:20px}' +
    '.dsa-hm-cell{padding:8px;text-align:center;border-radius:6px;font-size:12px;font-weight:600}' +
    '.dsa-hm-header{color:#64748b;font-size:10px;text-transform:uppercase}' +
    '.dsa-hm-label{color:#94a3b8;font-size:11px;text-align:right;padding-right:8px}' +
    '.dsa-table{width:100%;border-collapse:collapse}' +
    '.dsa-table th{text-align:left;padding:8px 10px;font-size:11px;color:#64748b;border-bottom:1px solid #334155;text-transform:uppercase}' +
    '.dsa-table td{padding:8px 10px;font-size:13px;color:#e2e8f0;border-bottom:1px solid rgba(255,255,255,0.04)}' +
    '.dsa-table tr:hover td{background:rgba(255,255,255,0.02)}' +
    '.dsa-pct{font-weight:bold}' +
    '.dsa-pct.high{color:#22c55e}.dsa-pct.mid{color:#f59e0b}.dsa-pct.low{color:#ef4444}' +
    '.dsa-recent{max-height:400px;overflow-y:auto}' +
    '</style>';

  // Title + summary cards
  html += '<div class="dsa-title">' + _t('dsa_panel_title') + '</div>';
  html += '<div class="dsa-cards">' +
    '<div class="dsa-card"><div class="dsa-card-val">' + uniqueStudents + '</div><div class="dsa-card-label">' + _t('dsa_active_students') + '</div></div>' +
    '<div class="dsa-card"><div class="dsa-card-val">' + totalCerts + '</div><div class="dsa-card-label">' + _t('dsa_certs_issued') + '</div></div>' +
    '<div class="dsa-card"><div class="dsa-card-val">' + avgScore + '%</div><div class="dsa-card-label">' + _t('dsa_avg_score') + '</div></div>' +
  '</div>';

  // Corrida funnel
  var corridaNames = [_t('dsa_corrida_apprentice'), _t('dsa_corrida_performance'), _t('dsa_corrida_advanced'), _t('dsa_corrida_specialist'), _t('dsa_corrida_platinum')];
  var corridaCounts = [0, 0, 0, 0, 0];
  Object.values(students).forEach(function(s) {
    if (s.maxCorrida >= 1 && s.maxCorrida <= 5) corridaCounts[s.maxCorrida - 1]++;
  });

  html += '<div class="dsa-section">' + _t('dsa_corrida_funnel') + '</div>';
  html += '<div class="dsa-funnel">';
  corridaNames.forEach(function(name, i) {
    var colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ffd700'];
    html += '<div class="dsa-funnel-item"><div class="dsa-funnel-count" style="color:' + colors[i] + '">' + corridaCounts[i] + '</div><div class="dsa-funnel-label">' + name + '</div></div>';
  });
  html += '</div>';

  // Level heatmap
  html += '<div class="dsa-section">' + _t('dsa_completion_map') + '</div>';
  html += '<div class="dsa-heatmap">';
  html += '<div class="dsa-hm-cell dsa-hm-header"></div>';
  for (var n = 1; n <= 5; n++) html += '<div class="dsa-hm-cell dsa-hm-header">' + _t('dsa_level') + ' ' + n + '</div>';

  for (var c = 1; c <= 5; c++) {
    html += '<div class="dsa-hm-cell dsa-hm-label">C' + c + '</div>';
    for (var n = 1; n <= 5; n++) {
      var completed = data.filter(function(r) { return r.corrida === c && r.nivel === n && r.porcentaje >= 70; }).length;
      var attempted = data.filter(function(r) { return r.corrida === c && r.nivel === n; }).length;
      var intensity = uniqueStudents > 0 ? completed / uniqueStudents : 0;
      var bg = 'rgba(34,197,94,' + (0.1 + intensity * 0.6) + ')';
      if (attempted === 0) bg = 'rgba(255,255,255,0.03)';
      html += '<div class="dsa-hm-cell" style="background:' + bg + ';color:' + (completed > 0 ? '#22c55e' : '#64748b') + '">' + completed + '/' + attempted + '</div>';
    }
  }
  html += '</div>';

  // Leaderboard
  html += '<div class="dsa-section">' + _t('dsa_leaderboard') + '</div>';
  var ranked = Object.entries(students).map(function(e) {
    return { email: e[0], certs: e[1].certs, avg: Math.round(e[1].total_pct / e[1].count), count: e[1].count };
  });
  ranked.sort(function(a, b) { return b.certs - a.certs || b.avg - a.avg; });

  if (ranked.length === 0) {
    html += '<div style="color:#64748b;padding:10px;">' + _t('dsa_no_data') + '</div>';
  } else {
    html += '<table class="dsa-table"><thead><tr><th>#</th><th>' + _t('dsa_student') + '</th><th>' + _t('dsa_certificates') + '</th><th>' + _t('dsa_average') + '</th><th>' + _t('dsa_attempts') + '</th></tr></thead><tbody>';
    ranked.slice(0, 20).forEach(function(r, i) {
      var medal = i === 0 ? '🥇 ' : (i === 1 ? '🥈 ' : (i === 2 ? '🥉 ' : (i + 1) + '. '));
      var pctClass = r.avg >= 70 ? 'high' : (r.avg >= 50 ? 'mid' : 'low');
      html += '<tr><td>' + medal + '</td><td>' + _dsaEsc(r.email) + '</td><td style="font-weight:bold;color:#ffd700;">' + r.certs + ' 🏅</td><td><span class="dsa-pct ' + pctClass + '">' + r.avg + '%</span></td><td>' + r.count + '</td></tr>';
    });
    html += '</tbody></table>';
  }

  // Recent completions
  html += '<div class="dsa-section">' + _t('dsa_recent') + '</div>';
  html += '<div class="dsa-recent"><table class="dsa-table"><thead><tr><th>' + _t('dsa_date') + '</th><th>' + _t('dsa_student') + '</th><th>' + _t('dsa_corrida') + '</th><th>' + _t('dsa_level') + '</th><th>' + _t('dsa_result') + '</th><th>' + _t('dsa_certificate') + '</th></tr></thead><tbody>';
  data.slice(0, 20).forEach(function(r, idx) {
    var date = r.completed_at ? new Date(r.completed_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    var pctClass = r.porcentaje >= 70 ? 'high' : (r.porcentaje >= 50 ? 'mid' : 'low');
    var certCell = '—';
    if (r.certificate_id && r.porcentaje >= 70) {
      certCell = '<button data-dsa-cert="' + idx + '" style="padding:4px 10px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#333;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">' + _t('dsa_view_print') + '</button>';
    }
    html += '<tr><td style="font-size:11px;color:#94a3b8;white-space:nowrap">' + date + '</td>' +
      '<td>' + _dsaEsc(r.user_email) + '</td>' +
      '<td>C' + r.corrida + '</td>' +
      '<td>N' + r.nivel + '</td>' +
      '<td><span class="dsa-pct ' + pctClass + '">' + r.correct_answers + '/' + r.total_questions + ' (' + Math.round(r.porcentaje) + '%)</span></td>' +
      '<td>' + certCell + '</td></tr>';
  });
  html += '</tbody></table></div>';

  panel.innerHTML = html;

  // Attach click handler for admin cert print buttons (once only)
  if (!panel._dsaCertHandler) {
    panel._dsaCertHandler = function(e) {
      var btn = e.target.closest('[data-dsa-cert]');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-dsa-cert'));
      var r = _dsaData[idx];
      if (!r || !r.certificate_id) return;
      _dsaAdminPrintCert(r);
    };
    panel.addEventListener('click', panel._dsaCertHandler);
  }
}

// Admin certificate print — bypasses payment gate
function _dsaAdminPrintCert(record) {
  var corridaNames = [
    _t('dsa_corrida_apprentice', 'Aprendiz'),
    _t('dsa_corrida_performance', 'T\u00E9cnico en Desempe\u00F1o'),
    _t('dsa_corrida_advanced', 'T\u00E9cnico Avanzado'),
    _t('dsa_corrida_specialist', 'T\u00E9cnico Especialista'),
    _t('dsa_corrida_platinum', 'T\u00E9cnico Platino')
  ];
  var nivelIds = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
  var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  var c = record.corrida || 1;
  var n = record.nivel || 1;
  var levelId = nivelIds[c - 1] || 'principiante';
  var levelName = (corridaNames[c - 1] || 'Corrida ' + c) + ' — Nivel ' + n;

  // Format date from completed_at or fallback to today
  var dt = record.completed_at ? new Date(record.completed_at) : new Date();
  var certDate = dt.getDate() + ' de ' + meses[dt.getMonth()] + ' de ' + dt.getFullYear();

  // Use email as name (admin context)
  var userName = record.user_email || 'Estudiante';

  // Try to look up student name from users cache
  if (typeof supabaseClient !== 'undefined' && supabaseClient && record.user_email) {
    usersDataAdmin('admin_get', { email: record.user_email, fields: ['nombre'] }).then(function(res) {
      var nombre = (res.data && res.data.nombre) ? res.data.nombre : userName;
      if (typeof executeCertPrint === 'function') {
        executeCertPrint(levelId, levelName, '', nombre, Math.round(record.porcentaje), certDate, record.certificate_id);
      } else {
        alert(_t('dsa_cert_not_loaded'));
      }
    }).catch(function() {
      if (typeof executeCertPrint === 'function') {
        executeCertPrint(levelId, levelName, '', userName, Math.round(record.porcentaje), certDate, record.certificate_id);
      }
    });
    return;
  }

  if (typeof executeCertPrint === 'function') {
    executeCertPrint(levelId, levelName, '', userName, Math.round(record.porcentaje), certDate, record.certificate_id);
  } else {
    alert(_t('dsa_cert_not_loaded'));
  }
}

function _dsaEsc(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Auto-load when section is clicked
document.addEventListener('click', function(e) {
  var item = e.target.closest('[data-crm-section="desafioAdmin"]');
  if (item) {
    setTimeout(function() { loadDesafioAdmin(); }, 50);
  }
});
