if (typeof _addTranslations === 'function') _addTranslations({
  perf_no_sessions: { es: 'No hay evaluaciones aún. Presiona "+ Nueva Evaluación" para crear una sesión en vivo.', en: 'No evaluations yet. Press "+ New Evaluation" to create a live session.' },
  perf_completed: { es: 'Completada', en: 'Completed' },
  perf_cancelled: { es: 'Cancelada', en: 'Cancelled' },
  perf_active_status: { es: 'Activa', en: 'Active' },
  perf_at: { es: 'a las', en: 'at' },
  perf_students: { es: 'Estudiantes', en: 'Students' },
  perf_average: { es: 'Promedio', en: 'Average' },
  perf_duration: { es: 'Duración', en: 'Duration' },
  perf_view_detail: { es: 'Ver Detalle', en: 'View Detail' },
  perf_delete: { es: 'Eliminar', en: 'Delete' },
  perf_new_eval: { es: 'Nueva Evaluación en Vivo', en: 'New Live Evaluation' },
  perf_area_label: { es: 'Área de Evaluación', en: 'Evaluation Area' },
  perf_res_electric: { es: 'Electricidad Residencial', en: 'Residential Electrical' },
  perf_com_electric: { es: 'Electricidad Comercial', en: 'Commercial Electrical' },
  perf_ac: { es: 'Aire Acondicionado', en: 'Air Conditioning' },
  perf_refrig: { es: 'Refrigeración', en: 'Refrigeration' },
  perf_install: { es: 'Instalación', en: 'Installation' },
  perf_service: { es: 'Llamadas de Servicio', en: 'Service Calls' },
  perf_title_label: { es: 'Título (opcional)', en: 'Title (optional)' },
  perf_title_ph: { es: 'Ej: Evaluación práctica semana 12...', en: 'e.g. Practical evaluation week 12...' },
  perf_select_stu: { es: 'Seleccionar Estudiantes (máx. 30)', en: 'Select Students (max. 30)' },
  perf_select_all: { es: 'Seleccionar Todos', en: 'Select All' },
  perf_search_ph: { es: 'Buscar por nombre o email...', en: 'Search by name or email...' },
  perf_loading_stu: { es: 'Cargando estudiantes...', en: 'Loading students...' },
  perf_stu_selected: { es: ' estudiantes seleccionados', en: ' students selected' },
  perf_start: { es: 'Iniciar Evaluación', en: 'Start Evaluation' },
  perf_no_students: { es: 'No se encontraron estudiantes', en: 'No students found' },
  perf_no_name: { es: 'Sin nombre', en: 'No name' },
  perf_max_30: { es: 'Máximo 30 estudiantes por sesión.', en: 'Maximum 30 students per session.' },
  perf_select_1: { es: 'Selecciona al menos un estudiante.', en: 'Select at least one student.' },
  perf_create_err: { es: 'Error al crear sesión: ', en: 'Error creating session: ' },
  perf_resume: { es: 'Reanudar', en: 'Resume' },
  perf_pause: { es: 'Pausar', en: 'Pause' },
  perf_ungraded_warn: { es: ' estudiante(s) sin calificar. Los no calificados se guardarán con 0%. ¿Finalizar?', en: ' student(s) ungraded. Ungraded students will be saved with 0%. Finalize?' },
  perf_confirm_final: { es: '¿Finalizar esta evaluación?', en: 'Finalize this evaluation?' },
  perf_final_err: { es: 'Error al finalizar: ', en: 'Error finalizing: ' },
  perf_confirm_cancel: { es: '¿Cancelar esta evaluación? Los datos no se guardarán.', en: 'Cancel this evaluation? Data will not be saved.' },
  perf_cancel_err: { es: 'Error al cancelar: ', en: 'Error cancelling: ' },
  perf_detail_title: { es: 'Detalle de Evaluación', en: 'Evaluation Detail' },
  perf_area: { es: 'Área:', en: 'Area:' },
  perf_date: { es: 'Fecha:', en: 'Date:' },
  perf_dur: { es: 'Duración:', en: 'Duration:' },
  perf_avg: { es: 'Promedio:', en: 'Average:' },
  perf_student_col: { es: 'Estudiante', en: 'Student' },
  perf_email_col: { es: 'Email', en: 'Email' },
  perf_grade_col: { es: 'Calificación', en: 'Grade' },
  perf_detail_err: { es: 'Error al cargar detalle: ', en: 'Error loading detail: ' },
  perf_no_sessions_exp: { es: 'No hay sesiones completadas para exportar.', en: 'No completed sessions to export.' },
  perf_confirm_del: { es: '¿Eliminar esta sesión de evaluación? Esta acción no se puede deshacer.', en: 'Delete this evaluation session? This action cannot be undone.' },
  perf_del_err: { es: 'Error al eliminar: ', en: 'Error deleting: ' },
  perf_load_stu_err: { es: 'Error cargando estudiantes', en: 'Error loading students' },
  perf_loading_data: { es: 'Cargando datos...', en: 'Loading data...' },
  perf_db_unavail: { es: 'Base de datos no disponible', en: 'Database not available' },
  perf_ungraded_confirm: { es: 'estudiante(s) sin calificar. Los no calificados se guardarán con 0%. ¿Finalizar?', en: 'ungraded student(s). Ungraded entries will be saved as 0%. Finalize?' },
});

async function loadStudentPerformance() {
  if (!supabaseClient) return;
  try {
    // Check for active session first
    var hasActive = await _checkActivePerfSession();
    if (hasActive) return;
    _showPerfDefaultView();
    loadPerfSessionHistory();
  } catch(e) {
    console.log('[Admin] Error loading perf:', e.message);
  }
}

async function loadPerfSessionHistory() {
  var container = document.getElementById('zmPerfSessionList');
  if (!container || !supabaseClient) return;
  var areaFilter = (document.getElementById('zmPerfAreaFilter') || {}).value || 'all';
  try {
    var query = supabaseClient.from('zm_perf_sessions').select('*').order('started_at', { ascending: false }).limit(50);
    if (areaFilter !== 'all') query = query.eq('area', areaFilter);
    var res = await query;
    var sessions = res.data || [];

    // Stats
    var completed = sessions.filter(function(s) { return s.status === 'completed'; });
    var totalStudents = completed.reduce(function(a, s) { return a + (s.student_count || 0); }, 0);
    var avgScores = completed.filter(function(s) { return s.avg_score > 0; }).map(function(s) { return parseFloat(s.avg_score); });
    var globalAvg = avgScores.length > 0 ? Math.round(avgScores.reduce(function(a, b) { return a + b; }, 0) / avgScores.length) : 0;
    var lastDate = completed.length > 0 ? new Date(completed[0].started_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '--';

    var elSessions = document.getElementById('zmPerfTotalSessions');
    var elStudents = document.getElementById('zmPerfTotalStudents');
    var elAvg = document.getElementById('zmPerfGlobalAvg');
    var elLast = document.getElementById('zmPerfLastSession');
    if (elSessions) elSessions.textContent = completed.length;
    if (elStudents) elStudents.textContent = totalStudents;
    if (elAvg) elAvg.textContent = globalAvg + '%';
    if (elLast) elLast.textContent = lastDate;

    if (sessions.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;">' + _t('perf_no_sessions','No hay evaluaciones aún. Presiona "+ Nueva Evaluación" para crear una sesión en vivo.') + '</div>';
      return;
    }

    var html = '';
    sessions.forEach(function(s) {
      var date = new Date(s.started_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
      var time = new Date(s.started_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      var dur = s.duration_seconds ? Math.floor(s.duration_seconds / 60) + ':' + String(s.duration_seconds % 60).padStart(2, '0') : '--';
      var avgColor = (s.avg_score || 0) >= 80 ? '#16a34a' : (s.avg_score || 0) >= 70 ? '#d97706' : '#dc2626';
      var statusBadge = s.status === 'completed' ? '<span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">' + _t('perf_completed') + '</span>' :
        s.status === 'cancelled' ? '<span style="background:#fef2f2;color:#dc2626;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">' + _t('perf_cancelled') + '</span>' :
        '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">' + _t('perf_active_status') + '</span>';

      html += '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' +
          '<div>' +
            '<div style="font-size:13px;font-weight:600;color:#1e293b;">' + _escHtml(s.area) + ' ' + statusBadge + '</div>' +
            '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' + date + ' ' + _t('perf_at') + ' ' + time + (s.title ? ' — ' + _escHtml(s.title) : '') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:12px;align-items:center;font-size:12px;">' +
            '<div style="text-align:center;"><div style="color:#94a3b8;font-size:10px;">' + _t('perf_students') + '</div><div style="font-weight:700;color:#1e293b;">' + (s.student_count || 0) + '</div></div>' +
            '<div style="text-align:center;"><div style="color:#94a3b8;font-size:10px;">' + _t('perf_average') + '</div><div style="font-weight:700;color:' + avgColor + ';">' + (s.avg_score ? parseFloat(s.avg_score).toFixed(0) + '%' : '--') + '</div></div>' +
            '<div style="text-align:center;"><div style="color:#94a3b8;font-size:10px;">' + _t('perf_duration') + '</div><div style="font-weight:700;color:#64748b;">' + dur + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end;">' +
          (s.status === 'completed' ? '<button onclick="viewPerfSessionDetail(\'' + s.id + '\')" style="padding:4px 12px;border-radius:6px;border:1px solid #bfdbfe;background:#eff6ff;color:#2563eb;cursor:pointer;font-size:11px;font-weight:600;">' + _t('perf_view_detail') + '</button>' : '') +
          '<button onclick="deletePerfSession(\'' + s.id + '\')" style="padding:4px 12px;border-radius:6px;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;cursor:pointer;font-size:11px;font-weight:600;">' + _t('perf_delete') + '</button>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;font-size:12px;">Error: ' + _escHtml(e.message) + '</div>';
  }
}

function openNewPerfSessionModal() {
  var overlay = document.createElement('div');
  overlay.id = 'perfSessionOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
      '<h3 style="margin:0;color:#1e293b;font-size:16px;">' + _t('lperf_new_eval_title') + '</h3>' +
      '<button onclick="document.getElementById(\'perfSessionOverlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;">✕</button>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:12px;">' +
      '<div>' +
        '<label style="display:block;font-size:12px;color:#475569;font-weight:600;margin-bottom:4px;">' + _t('perf_area_label') + '</label>' +
        '<select id="perfArea" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;box-sizing:border-box;">' +
          '<option value="Electricidad Residencial">' + "⚡ " + _t('perf_res_electric') + '</option>' +
          '<option value="Electricidad Comercial">' + "🏢 " + _t('perf_com_electric') + '</option>' +
          '<option value="Aire Acondicionado">' + "❄️ " + _t('perf_ac') + '</option>' +
          '<option value="Refrigeración">' + "🧊 " + _t('perf_refrig') + '</option>' +
          '<option value="Instalación">' + "🔧 " + _t('perf_install') + '</option>' +
          '<option value="Llamadas de Servicio">' + "📞 " + _t('perf_service') + '</option>' +
        '</select>' +
      '</div>' +
      '<div>' +
        '<label style="display:block;font-size:12px;color:#475569;font-weight:600;margin-bottom:4px;">' + _t('perf_title_label') + '</label>' +
        '<input type="text" id="perfTitle" placeholder="' + _t('perf_title_ph') + '" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;box-sizing:border-box;">' +
      '</div>' +
      '<div style="border-top:1px solid #e2e8f0;padding-top:12px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<label style="font-size:12px;color:#475569;font-weight:600;">' + _t('perf_select_stu') + '</label>' +
          '<button onclick="toggleSelectAllPerfStudents()" style="padding:3px 10px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">' + _t('perf_select_all') + '</button>' +
        '</div>' +
        '<input id="perfStudentSearch" placeholder="' + _t('perf_search_ph') + '" oninput="filterPerfStudents()" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:12px;box-sizing:border-box;margin-bottom:6px;">' +
        '<div id="perfStudentsList" style="max-height:200px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;">' + _t('perf_loading_stu') + '</div>' +
        '<div id="perfStudentsCount" style="font-size:11px;color:#64748b;margin-top:4px;">0' + _t('perf_stu_selected') + '</div>' +
      '</div>' +
      '<button onclick="startPerfSession()" style="padding:12px 28px;background:linear-gradient(135deg,#f39c12,#e67e22);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(243,156,18,0.3);width:100%;">' + _t('lperf_start_btn') + '</button>' +
    '</div>' +
  '</div>';

  overlay.onclick = function(ev) { if (ev.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
  _loadStudentsForPerfSession();
}

async function _loadStudentsForPerfSession() {
  var container = document.getElementById('perfStudentsList');
  if (!container) return;
  try {
    var res = await usersDataAdmin('admin_list', { fields: ['id','email','nombre'], order_by: 'nombre', ascending: true, limit: 5000 });
    _perfAllStudents = (res.data || []).map(function(s) { return { id: s.id, email: s.email, full_name: s.nombre || s.email || '' }; });
    _perfSelectedStudents = new Set();
    _renderPerfStudents();
  } catch(e) {
    container.innerHTML = '<div style="padding:8px;color:#e74c3c;font-size:11px;">' + _t('perf_load_stu_err') + '</div>';
  }
}

function _renderPerfStudents() {
  var container = document.getElementById('perfStudentsList');
  if (!container) return;
  var search = ((document.getElementById('perfStudentSearch') || {}).value || '').toLowerCase();
  var filtered = _perfAllStudents.filter(function(s) {
    var name = (s.full_name || s.nombre || '').toLowerCase();
    var email = (s.email || '').toLowerCase();
    return name.indexOf(search) >= 0 || email.indexOf(search) >= 0;
  });
  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:10px;text-align:center;color:#94a3b8;font-size:11px;">' + _t('perf_no_students') + '</div>';
    return;
  }
  var html = '';
  filtered.forEach(function(s) {
    var checked = _perfSelectedStudents.has(s.id) ? 'checked' : '';
    var name = s.full_name || s.nombre || s.email || _t('perf_no_name');
    html += '<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid #f1f5f9;cursor:pointer;font-size:12px;">' +
      '<input type="checkbox" ' + checked + ' onchange="togglePerfStudent(\'' + s.id + '\')" style="margin:0;">' +
      '<span style="color:#1e293b;">' + _escHtml(name) + '</span>' +
      '<span style="color:#94a3b8;font-size:10px;">' + _escHtml(s.email || '') + '</span>' +
    '</label>';
  });
  container.innerHTML = html;
}

function togglePerfStudent(id) {
  if (_perfSelectedStudents.has(id)) {
    _perfSelectedStudents.delete(id);
  } else {
    if (_perfSelectedStudents.size >= 30) { alert(_t('perf_max_30')); return; }
    _perfSelectedStudents.add(id);
  }
  _renderPerfStudents();
  var el = document.getElementById('perfStudentsCount');
  if (el) el.textContent = _perfSelectedStudents.size + (_perfSelectedStudents.size !== 1 ? _t('lperf_stu_count_suffix_plural') : _t('lperf_stu_count_suffix_singular'));
}

function filterPerfStudents() { _renderPerfStudents(); }

function toggleSelectAllPerfStudents() {
  var search = ((document.getElementById('perfStudentSearch') || {}).value || '').toLowerCase();
  var filtered = _perfAllStudents.filter(function(s) {
    var name = (s.full_name || s.nombre || '').toLowerCase();
    var email = (s.email || '').toLowerCase();
    return name.indexOf(search) >= 0 || email.indexOf(search) >= 0;
  });
  // If all visible are selected, deselect all visible
  var allSelected = filtered.every(function(s) { return _perfSelectedStudents.has(s.id); });
  if (allSelected) {
    filtered.forEach(function(s) { _perfSelectedStudents.delete(s.id); });
  } else {
    filtered.forEach(function(s) {
      if (_perfSelectedStudents.size < 30) _perfSelectedStudents.add(s.id);
    });
  }
  _renderPerfStudents();
  var el = document.getElementById('perfStudentsCount');
  if (el) el.textContent = _perfSelectedStudents.size + (_perfSelectedStudents.size !== 1 ? _t('lperf_stu_count_suffix_plural') : _t('lperf_stu_count_suffix_singular'));
}

async function startPerfSession() {
  if (_perfSelectedStudents.size === 0) { alert(_t('perf_select_1')); return; }
  var area = (document.getElementById('perfArea') || {}).value || 'Aire Acondicionado';
  var title = (document.getElementById('perfTitle') || {}).value || '';
  var adminEmail = '';
  try { adminEmail = JSON.parse(localStorage.getItem('tecnico_user') || '{}').email || ''; } catch(e) { console.warn('[LivePerformance]', e.message || e); }

  // Build student list
  var students = [];
  _perfAllStudents.forEach(function(s) {
    if (_perfSelectedStudents.has(s.id)) {
      students.push({ student_id: s.id, student_name: s.full_name || s.nombre || _t('perf_no_name'), student_email: s.email || '' });
    }
  });

  try {
    // Insert session
    var sesRes = await supabaseClient.from('zm_perf_sessions').insert({
      area: area,
      title: title || null,
      status: 'active',
      created_by: adminEmail,
      student_count: students.length
    }).select().single();
    if (sesRes.error) throw sesRes.error;
    var session = sesRes.data;

    // Insert grade rows
    var gradeRows = students.map(function(st) {
      return { session_id: session.id, student_id: st.student_id, student_name: st.student_name, student_email: st.student_email };
    });
    var grRes = await supabaseClient.from('zm_perf_grades').insert(gradeRows);
    if (grRes.error) throw grRes.error;

    // Close modal
    var overlay = document.getElementById('perfSessionOverlay');
    if (overlay) overlay.remove();

    // Store active session in localStorage for recovery
    _perfActiveSessionId = session.id;
    _perfActiveGrades = students.map(function(st) {
      return { student_id: st.student_id, student_name: st.student_name, student_email: st.student_email, score: null };
    });
    localStorage.setItem('_perfActiveSession', JSON.stringify({
      id: session.id, area: area, title: title, startedAt: session.started_at, students: _perfActiveGrades
    }));

    _showPerfActiveView(area);
    _startPerfTimer();
  } catch(e) {
    alert(_t('perf_create_err') + e.message);
  }
}

function _showPerfActiveView(area) {
  var defaultView = document.getElementById('zmPerfDefaultView');
  var activeView = document.getElementById('zmPerfActiveView');
  if (defaultView) defaultView.style.display = 'none';
  if (activeView) activeView.style.display = 'block';

  var areaEl = document.getElementById('zmPerfActiveArea');
  if (areaEl) areaEl.textContent = area;

  var totalEl = document.getElementById('zmPerfTotalCount');
  if (totalEl) totalEl.textContent = _perfActiveGrades.length;

  // Render grading cards
  var cardsContainer = document.getElementById('zmPerfGradingCards');
  if (!cardsContainer) return;
  var html = '';
  _perfActiveGrades.forEach(function(g, idx) {
    var scoreVal = g.score !== null ? g.score : '';
    html += '<div id="perfCard_' + idx + '" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;transition:border-color 0.2s;">' +
      '<div style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:2px;">' + _escHtml(g.student_name) + '</div>' +
      '<div style="font-size:10px;color:#94a3b8;margin-bottom:8px;">' + _escHtml(g.student_email) + '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<input type="number" id="perfGrade_' + idx + '" min="0" max="100" value="' + scoreVal + '" placeholder="0-100" oninput="onPerfGradeInput(' + idx + ')" style="width:80px;padding:8px;border:2px solid #e2e8f0;border-radius:8px;font-size:16px;font-weight:700;text-align:center;">' +
        '<span style="font-size:14px;color:#94a3b8;">%</span>' +
        '<span id="perfGradeEmoji_' + idx + '" style="font-size:18px;"></span>' +
      '</div>' +
    '</div>';
  });
  cardsContainer.innerHTML = html;
  _updatePerfGradingProgress();
}

function _showPerfDefaultView() {
  var defaultView = document.getElementById('zmPerfDefaultView');
  var activeView = document.getElementById('zmPerfActiveView');
  if (defaultView) defaultView.style.display = 'block';
  if (activeView) activeView.style.display = 'none';
  // Clear timer
  if (_perfTimerInterval) { clearInterval(_perfTimerInterval); _perfTimerInterval = null; }
  _perfTimerSeconds = 0;
  _perfTimerPaused = false;
  _perfActiveSessionId = null;
  _perfActiveGrades = [];
  localStorage.removeItem('_perfActiveSession');
}

function _startPerfTimer() {
  _perfTimerSeconds = 0;
  _perfTimerPaused = false;
  if (_perfTimerInterval) clearInterval(_perfTimerInterval);
  _perfTimerInterval = setInterval(function() {
    if (!_perfTimerPaused) {
      _perfTimerSeconds++;
      _updatePerfTimerDisplay();
    }
  }, 1000);
  _updatePerfTimerDisplay();
}

function pausePerfTimer() {
  _perfTimerPaused = !_perfTimerPaused;
  var btn = document.getElementById('zmPerfPauseBtn');
  if (btn) {
    btn.innerHTML = _perfTimerPaused ? '▶ ' + _t('perf_resume') : '⏸ ' + _t('perf_pause');
    btn.style.background = _perfTimerPaused ? '#f59e0b' : 'transparent';
  }
}

function _updatePerfTimerDisplay() {
  var h = Math.floor(_perfTimerSeconds / 3600);
  var m = Math.floor((_perfTimerSeconds % 3600) / 60);
  var s = _perfTimerSeconds % 60;
  var display = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  var el = document.getElementById('zmPerfTimer');
  if (el) el.textContent = display;
}

function onPerfGradeInput(idx) {
  var input = document.getElementById('perfGrade_' + idx);
  if (!input) return;
  var val = input.value.trim();
  var score = val === '' ? null : Math.min(100, Math.max(0, parseInt(val) || 0));
  if (score !== null) input.value = score;
  _perfActiveGrades[idx].score = score;

  // Color coding
  var card = document.getElementById('perfCard_' + idx);
  var emoji = document.getElementById('perfGradeEmoji_' + idx);
  if (score !== null) {
    if (score >= 80) {
      input.style.borderColor = '#16a34a'; input.style.color = '#16a34a';
      if (card) card.style.borderColor = '#bbf7d0';
      if (emoji) emoji.textContent = '🟢';
    } else if (score >= 70) {
      input.style.borderColor = '#d97706'; input.style.color = '#d97706';
      if (card) card.style.borderColor = '#fcd34d';
      if (emoji) emoji.textContent = '🟡';
    } else {
      input.style.borderColor = '#dc2626'; input.style.color = '#dc2626';
      if (card) card.style.borderColor = '#fecaca';
      if (emoji) emoji.textContent = '🔴';
    }
  } else {
    input.style.borderColor = '#e2e8f0'; input.style.color = '#1e293b';
    if (card) card.style.borderColor = '#e2e8f0';
    if (emoji) emoji.textContent = '';
  }

  _updatePerfGradingProgress();

  // Save to localStorage for recovery
  var stored = JSON.parse(localStorage.getItem('_perfActiveSession') || '{}');
  if (stored.students) { stored.students = _perfActiveGrades; localStorage.setItem('_perfActiveSession', JSON.stringify(stored)); }
}

function _updatePerfGradingProgress() {
  var graded = _perfActiveGrades.filter(function(g) { return g.score !== null; });
  var total = _perfActiveGrades.length;
  var countEl = document.getElementById('zmPerfGradedCount');
  if (countEl) countEl.textContent = graded.length;
  var totalEl = document.getElementById('zmPerfTotalCount');
  if (totalEl) totalEl.textContent = total;

  var avg = graded.length > 0 ? Math.round(graded.reduce(function(a, g) { return a + g.score; }, 0) / graded.length) : 0;
  var avgEl = document.getElementById('zmPerfLiveAvg');
  if (avgEl) avgEl.textContent = graded.length > 0 ? avg + '%' : '--';

  var pct = total > 0 ? Math.round((graded.length / total) * 100) : 0;
  var fill = document.getElementById('zmPerfProgressFill');
  if (fill) fill.style.width = pct + '%';
}

async function finalizePerfSession() {
  var ungraded = _perfActiveGrades.filter(function(g) { return g.score === null; });
  if (ungraded.length > 0) {
    if (!confirm(_t('perf_there_are', 'Hay') + ' ' + ungraded.length + ' ' + _t('perf_ungraded_confirm', 'estudiante(s) sin calificar. Los no calificados se guardarán con 0%. ¿Finalizar?'))) return;
  } else {
    if (!confirm(_t('perf_confirm_final'))) return;
  }

  try {
    // Save each grade
    for (var i = 0; i < _perfActiveGrades.length; i++) {
      var g = _perfActiveGrades[i];
      var finalScore = g.score !== null ? g.score : 0;
      await supabaseClient.from('zm_perf_grades')
        .update({ score: finalScore, graded_at: new Date().toISOString() })
        .eq('session_id', _perfActiveSessionId)
        .eq('student_id', g.student_id);
    }

    // Compute average
    var scores = _perfActiveGrades.map(function(g) { return g.score !== null ? g.score : 0; });
    var avg = scores.length > 0 ? (scores.reduce(function(a, b) { return a + b; }, 0) / scores.length).toFixed(2) : 0;

    // Update session
    await supabaseClient.from('zm_perf_sessions').update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      duration_seconds: _perfTimerSeconds,
      avg_score: avg
    }).eq('id', _perfActiveSessionId);

    _showPerfDefaultView();
    loadPerfSessionHistory();
  } catch(e) {
    alert(_t('perf_final_err') + e.message);
  }
}

async function cancelPerfSession() {
  if (!confirm(_t('perf_confirm_cancel'))) return;
  try {
    await supabaseClient.from('zm_perf_sessions').update({
      status: 'cancelled',
      ended_at: new Date().toISOString(),
      duration_seconds: _perfTimerSeconds
    }).eq('id', _perfActiveSessionId);
    _showPerfDefaultView();
    loadPerfSessionHistory();
  } catch(e) {
    alert(_t('perf_cancel_err') + e.message);
  }
}

async function viewPerfSessionDetail(sessionId) {
  try {
    var res = await supabaseClient.from('zm_perf_grades').select('*').eq('session_id', sessionId).order('student_name');
    var grades = res.data || [];
    var sesRes = await supabaseClient.from('zm_perf_sessions').select('*').eq('id', sessionId).single();
    var session = sesRes.data || {};

    var overlay = document.createElement('div');
    overlay.id = 'perfDetailOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

    var date = new Date(session.started_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    var dur = session.duration_seconds ? Math.floor(session.duration_seconds / 60) + ' min ' + (session.duration_seconds % 60) + ' seg' : '--';

    var gradeRows = '';
    grades.forEach(function(g, idx) {
      var sc = g.score !== null ? parseFloat(g.score) : 0;
      var color = sc >= 80 ? '#16a34a' : sc >= 70 ? '#d97706' : '#dc2626';
      var emoji = sc >= 80 ? '🟢' : sc >= 70 ? '🟡' : '🔴';
      gradeRows += '<tr style="border-bottom:1px solid #f1f5f9;">' +
        '<td style="padding:8px;font-size:12px;color:#1e293b;">' + (idx + 1) + '</td>' +
        '<td style="padding:8px;font-size:12px;color:#1e293b;font-weight:600;">' + _escHtml(g.student_name || '') + '</td>' +
        '<td style="padding:8px;font-size:11px;color:#94a3b8;">' + _escHtml(g.student_email || '') + '</td>' +
        '<td style="padding:8px;font-size:14px;font-weight:700;color:' + color + ';text-align:center;">' + emoji + ' ' + sc.toFixed(0) + '%</td>' +
      '</tr>';
    });

    overlay.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:650px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="margin:0;color:#1e293b;font-size:16px;">' + _t('lperf_detail_title_icon') + '</h3>' +
        '<button onclick="document.getElementById(\'perfDetailOverlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;">✕</button>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:12px;">' +
        '<div><span style="color:#94a3b8;">' + _t('perf_area') + '</span> <strong>' + _escHtml(session.area || '') + '</strong></div>' +
        '<div><span style="color:#94a3b8;">' + _t('perf_date') + '</span> <strong>' + date + '</strong></div>' +
        '<div><span style="color:#94a3b8;">' + _t('perf_dur') + '</span> <strong>' + dur + '</strong></div>' +
        '<div><span style="color:#94a3b8;">' + _t('perf_avg') + '</span> <strong style="color:#2563eb;">' + (session.avg_score ? parseFloat(session.avg_score).toFixed(0) + '%' : '--') + '</strong></div>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;">' +
        '<thead><tr style="background:#f1f5f9;"><th style="padding:8px;text-align:left;color:#475569;font-size:11px;">#</th><th style="padding:8px;text-align:left;color:#475569;font-size:11px;">' + _t('perf_student_col') + '</th><th style="padding:8px;text-align:left;color:#475569;font-size:11px;">' + _t('perf_email_col') + '</th><th style="padding:8px;text-align:center;color:#475569;font-size:11px;">' + _t('perf_grade_col') + '</th></tr></thead>' +
        '<tbody>' + gradeRows + '</tbody>' +
      '</table>' +
    '</div>';

    overlay.onclick = function(ev) { if (ev.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
  } catch(e) {
    alert(_t('perf_detail_err') + e.message);
  }
}

function exportPerfSessionsCSV() {
  if (!supabaseClient) return;
  supabaseClient.from('zm_perf_sessions').select('*').eq('status', 'completed').order('started_at', { ascending: false }).then(function(res) {
    var sessions = res.data || [];
    if (sessions.length === 0) { alert(_t('perf_no_sessions_exp')); return; }

    // Fetch all grades for completed sessions
    var sessionIds = sessions.map(function(s) { return s.id; });
    supabaseClient.from('zm_perf_grades').select('*').in('session_id', sessionIds).order('student_name').then(function(grRes) {
      var grades = grRes.data || [];
      var csv = 'Fecha,Área,Título,Estudiante,Email,Calificación,Duración (seg)\n';
      // CSV-safe escaping: double quotes inside values, strip formula injection chars
      function _csvSafe(val) {
        var s = String(val || '');
        // Prevent formula injection in Excel (=, +, -, @, tab, CR)
        if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
        return '"' + s.replace(/"/g, '""') + '"';
      }
      grades.forEach(function(g) {
        var session = sessions.find(function(s) { return s.id === g.session_id; });
        if (!session) return;
        var date = new Date(session.started_at).toLocaleDateString('es-MX');
        csv += _csvSafe(date) + ',' + _csvSafe(session.area) + ',' + _csvSafe(session.title) + ',' + _csvSafe(g.student_name) + ',' + _csvSafe(g.student_email) + ',' + (g.score || 0) + ',' + (session.duration_seconds || 0) + '\n';
      });
      var blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'evaluaciones_desempeno_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
    });
  });
}

async function _checkActivePerfSession() {
  // Check localStorage for an active session
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem('_perfActiveSession') || 'null'); } catch(e) { console.warn('[LivePerformance]', e.message || e); }
  if (!stored || !stored.id) return false;

  // Verify session is still active in DB
  try {
    var res = await supabaseClient.from('zm_perf_sessions').select('*').eq('id', stored.id).eq('status', 'active').single();
    if (!res.data) {
      localStorage.removeItem('_perfActiveSession');
      return false;
    }

    // Restore session
    _perfActiveSessionId = stored.id;
    _perfActiveGrades = stored.students || [];

    // Calculate elapsed time
    var startedAt = new Date(res.data.started_at || stored.startedAt);
    _perfTimerSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);

    _showPerfActiveView(stored.area || res.data.area);

    // Restore grades into inputs
    _perfActiveGrades.forEach(function(g, idx) {
      if (g.score !== null) {
        var input = document.getElementById('perfGrade_' + idx);
        if (input) { input.value = g.score; onPerfGradeInput(idx); }
      }
    });

    // Resume timer
    _perfTimerPaused = false;
    if (_perfTimerInterval) clearInterval(_perfTimerInterval);
    _perfTimerInterval = setInterval(function() {
      if (!_perfTimerPaused) { _perfTimerSeconds++; _updatePerfTimerDisplay(); }
    }, 1000);
    _updatePerfTimerDisplay();
    return true;
  } catch(e) {
    localStorage.removeItem('_perfActiveSession');
    return false;
  }
}

async function deletePerfSession(sessionId) {
  if (!confirm(_t('perf_confirm_del'))) return;
  try {
    await supabaseClient.from('zm_perf_sessions').delete().eq('id', sessionId);
    loadPerfSessionHistory();
  } catch(e) {
    alert(_t('perf_del_err') + e.message);
  }
}

// ============================================
// END ZONA DE MAESTRO
// ============================================

var crmSectionTitles = new Proxy({}, {
  get: function(_t_target, sectionId) {
    // Resolve at access time so language switches update titles on next render
    var key = 'lperf_section_' + sectionId;
    var fallbacks = {
      dashboard: '📊 Dashboard',
      bandeja: '📥 Bandeja de Entrada',
      tecnicos: '👥 Técnicos',
      success: '🎫 Student Success',
      asistencia: '📋 Asistencia',
      alertas: '⚠️ Alertas',
      ingresos: '💰 Ingresos / Stripe',
      centro: '🎯 Centro de Mando',
      embajadores: '🤝 Embajadores',
      clases: '📅 Clases',
      emails: '📧 Emails',
      certificados: '🏆 Certificados',
      analytics: '📈 Analytics',
      zonaMaestro: '🎓 Zona de Maestro',
      zoomResumenes: '📝 Resúmenes de Clases Zoom',
      pagosUnificados: '📊 Pagos Unificados',
      recordatorios: '🔔 Recordatorios de Pago',
      chatAdmin: '💬 Gestión de Chats',
      userMonitor: '👥 Monitor de Usuarios',
      citas: '📅 Citas Programadas',
      deviceViewer: '📱 Device Viewer',
      staffAdmin: '👥 Usuarios Admin',
      gatekeeper: '🛡️ Control de Acceso',
      streaming: '📡 Live Streaming',
      acvoltSchool: '🏫 Acvolt.school',
      tutorialVideos: '🎓 Online HVAC Certification',
      desafioAdmin: '🎮 Desafío Maestro HVACR',
      apiBilling: '💳 API Billing Monitor',
      errorMonitor: '🔴 Error Monitor',
      webVitals: '⚡ Web Vitals'
    };
    var fb = fallbacks[sectionId];
    if (!fb) return undefined;
    return (typeof _t === 'function') ? _t(key, fb) : fb;
  },
  has: function(_t_target, sectionId) {
    // Needed so `crmSectionTitles[sectionId]` truthy check works
    return ['dashboard','bandeja','tecnicos','success','asistencia','alertas','ingresos','centro','embajadores','clases','emails','certificados','analytics','zonaMaestro','zoomResumenes','pagosUnificados','recordatorios','chatAdmin','userMonitor','citas','deviceViewer','staffAdmin','gatekeeper','streaming','acvoltSchool','tutorialVideos','desafioAdmin','apiBilling','errorMonitor','webVitals'].indexOf(sectionId) !== -1;
  }
});

// Map sidebar sections to admin section IDs to scroll to
var crmSectionTargets = {
  dashboard: null, // show all (scroll top)
  bandeja: 'adminBandejaSection',
  tecnicos: 'adminTecnicos',
  success: 'adminStudentSuccess',
  asistencia: 'adminAsistencia',
  alertas: 'adminInactivityAlerts',
  ingresos: 'adminFinanzas',
  centro: 'adminCentroMando',
  embajadores: 'adminReferidos',
  clases: 'adminCalendario',
  emails: 'adminWeeklyEmails',
  certificados: 'adminCertificados',
  analytics: 'adminAnalytics',
  zonaMaestro: 'adminZonaMaestro',
  zoomResumenes: 'adminZonaMaestro',
  chatAdmin: null,
  staffAdmin: null,
  tutorialVideos: null,
  apiBilling: null
};

// Admin section IDs grouped by CRM sidebar section
var crmSectionGroups = {
  dashboard: ['adminStatsGrid','statDetailPanel','adminBandejaSection','adminTecnicos','adminExamSolicitudes','adminCentroMando','adminLibros','adminRecords','adminAsistencia','adminStudentSuccess','adminFinanzas','adminPagosUnificados','adminRecordatorios','adminWeeklyEmails','adminReferidos','adminCalendario','adminZoomRecs','adminAnalytics','adminCertificados','adminInactivityAlerts','adminZonaMaestro'],
  bandeja: ['adminBandejaSection'],
  tecnicos: ['adminTecnicos','adminExamSolicitudes'],
  success: ['adminStudentSuccess'],
  asistencia: ['adminAsistencia'],
  alertas: ['adminInactivityAlerts'],
  ingresos: ['adminFinanzas'],
  centro: ['adminCentroMando','adminLibros','adminRecords'],
  embajadores: ['adminReferidos'],
  clases: ['adminCalendario','adminZoomRecs'],
  emails: ['adminWeeklyEmails'],
  certificados: ['adminCertificados'],
  analytics: ['adminAnalytics'],
  zonaMaestro: ['adminZonaMaestro'],
  zoomResumenes: ['adminZonaMaestro'],
  pagosUnificados: ['adminPagosUnificados'],
  recordatorios: ['adminRecordatorios'],
  chatAdmin: [],
  userMonitor: [],
  streaming: ['adminLiveStreamPanel'],
  acvoltSchool: [],
  tutorialVideos: [],
  apiBilling: []
};

