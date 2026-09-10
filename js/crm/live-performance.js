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
  // 🔒 LEY: una pantalla NUNCA dice "0 / no hay nada" cuando la consulta falló.
  // Estos textos son para el caso "no pude medir", que es distinto de "no hay".
  perf_load_failed: { es: 'No pude cargar las evaluaciones', en: 'Could not load the evaluations' },
  perf_retry: { es: 'Reintentar', en: 'Retry' },
  perf_stats_unknown: { es: 'Los números de arriba no se pudieron medir.', en: 'The numbers above could not be measured.' },
  perf_detail_load_failed: { es: 'No pude cargar las calificaciones de esta evaluación. NO están en cero — simplemente no las pude leer.', en: 'Could not load this evaluation\'s grades. They are NOT zero — they just could not be read.' },
  perf_export_failed: { es: 'No pude leer las evaluaciones para exportar. No se descargó nada (un CSV vacío parecería que no hay datos).', en: 'Could not read the evaluations to export. Nothing was downloaded (an empty CSV would look like there is no data).' },
  perf_save_partial: { es: 'NO se guardaron todas las calificaciones. Fallaron: ', en: 'Not all grades were saved. Failed: ' },
  perf_save_keep_open: { es: 'La evaluación sigue abierta y las calificaciones siguen en pantalla. Vuelve a presionar Finalizar.', en: 'The evaluation is still open and the grades are still on screen. Press Finalize again.' },
  perf_session_close_failed: { es: 'Las calificaciones SÍ se guardaron, pero no pude cerrar la sesión. Vuelve a presionar Finalizar.', en: 'Grades WERE saved, but the session could not be closed. Press Finalize again.' },
  perf_cancel_failed: { es: 'No pude cancelar la evaluación en el servidor. Sigue activa — vuelve a intentar.', en: 'Could not cancel the evaluation on the server. It is still active — try again.' },
  perf_delete_failed: { es: 'No pude eliminar la sesión. Sigue ahí — vuelve a intentar.', en: 'Could not delete the session. It is still there — try again.' },
  perf_students_load_failed: { es: 'No pude cargar la lista de estudiantes (no es que no haya).', en: 'Could not load the student list (it is not that there are none).' },
  perf_active_check_failed: { es: 'No pude confirmar tu evaluación en curso. NO se borró: revisa tu conexión y vuelve a entrar.', en: 'Could not confirm your evaluation in progress. It was NOT deleted: check your connection and come back.' },
});

async function loadStudentPerformance() {
  if (!supabaseClient) return;
  try {
    // Check for active session first
    var hasActive = await _checkActivePerfSession();
    if (hasActive === true) return;
    // 🔒 'unknown' = no pudimos confirmar si la evaluación en curso sigue viva. Se
    // muestra la vista normal PERO sin borrar la copia local: las calificaciones ya
    // tecleadas se quedan para el próximo intento (ver `_checkActivePerfSession`).
    _showPerfDefaultView(hasActive === 'unknown');
    loadPerfSessionHistory();
  } catch(e) {
    console.warn('[LivePerformance] no se pudo abrir Desempeño: ' + ((e && e.message) || e), e);
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

    // 🔴 ANTES: `var sessions = res.data || []`. supabase-js NO LANZA — una consulta
    // rechazada (RLS, red, token vencido) RESUELVE con {data:null, error:{...}}, así que
    // el `try/catch` de abajo era zona muerta y la falla se convertía en lista vacía.
    // Síntoma real: el instructor abre Desempeño y lee "No hay evaluaciones aún" con las
    // 4 tarjetas en 0 — cree que se le perdió el historial completo de la escuela, cuando
    // en realidad ni se pudo preguntar.
    // 🔒 "No pude cargar" ≠ "no hay nada". Se dice cuál de las dos es, con Reintentar.
    if (res && res.error) {
      console.warn('[LivePerformance] no se pudo leer zm_perf_sessions: ' + (res.error.message || '?'), res.error);
      var _statIds = ['zmPerfTotalSessions', 'zmPerfTotalStudents', 'zmPerfGlobalAvg', 'zmPerfLastSession'];
      _statIds.forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = '--'; });
      container.innerHTML = '<div style="text-align:center;padding:26px 16px;color:#dc2626;font-size:13px;">' +
        '<div style="font-size:30px;margin-bottom:8px;">⚠️</div>' +
        '<div style="font-weight:600;">' + _t('perf_load_failed', 'No pude cargar las evaluaciones') + '</div>' +
        '<div style="font-size:11px;color:#94a3b8;margin-top:4px;">' + _t('perf_stats_unknown', 'Los números de arriba no se pudieron medir.') + ' ' + _escHtml(res.error.message || '') + '</div>' +
        '<button onclick="loadPerfSessionHistory()" style="margin-top:12px;padding:8px 18px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">🔄 ' + _t('perf_retry', 'Reintentar') + '</button>' +
      '</div>';
      return;
    }

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
    // 🪤 Este catch ya no cubre el fallo de la consulta (ese se lee en `res.error`
    // arriba): queda para un error de pintado. Aun así lleva Reintentar — dejar al
    // instructor con un "Error:" seco y sin salida es lo mismo que dejarlo ciego.
    console.warn('[LivePerformance] no se pudo pintar el historial de evaluaciones: ' + ((e && e.message) || e), e);
    container.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;font-size:12px;">' +
      _t('perf_load_failed', 'No pude cargar las evaluaciones') + ': ' + _escHtml((e && e.message) || '') +
      '<br><button onclick="loadPerfSessionHistory()" style="margin-top:10px;padding:6px 16px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">🔄 ' + _t('perf_retry', 'Reintentar') + '</button>' +
    '</div>';
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
    // 🔴 `usersDataAdmin` devuelve { data, error } y TAMPOCO lanza (ver js/users-data-client.js:
    // hasta un HTTP 500 vuelve como `{error:'HTTP 500'}`). Con `res.data || []` el modal
    // pintaba "No se encontraron estudiantes". Síntoma real: el instructor va a abrir una
    // evaluación en vivo con el grupo enfrente, ve la lista vacía y cree que se borraron
    // los 7,000 técnicos — cuando solo falló una llamada.
    if (res && res.error) {
      console.warn('[LivePerformance] no se pudo listar estudiantes: ' + (res.error.message || res.error), res.error);
      container.innerHTML = '<div style="padding:12px;color:#dc2626;font-size:11px;text-align:center;">' +
        _t('perf_students_load_failed', 'No pude cargar la lista de estudiantes (no es que no haya).') +
        '<br><button onclick="_loadStudentsForPerfSession()" style="margin-top:8px;padding:6px 14px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">🔄 ' + _t('perf_retry', 'Reintentar') + '</button>' +
      '</div>';
      return;
    }
    _perfAllStudents = (res.data || []).map(function(s) { return { id: s.id, email: s.email, full_name: s.nombre || s.email || '' }; });
    _perfSelectedStudents = new Set();
    _renderPerfStudents();
  } catch(e) {
    console.warn('[LivePerformance] no se pudo cargar la lista de estudiantes: ' + ((e && e.message) || e), e);
    container.innerHTML = '<div style="padding:12px;color:#dc2626;font-size:11px;text-align:center;">' + _t('perf_load_stu_err') +
      '<br><button onclick="_loadStudentsForPerfSession()" style="margin-top:8px;padding:6px 14px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">🔄 ' + _t('perf_retry', 'Reintentar') + '</button>' +
    '</div>';
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

function _showPerfDefaultView(conservarSesionGuardada) {
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
  // 🪤 `conservarSesionGuardada` existe por una razón concreta: `_perfActiveSession` en
  // localStorage es LA ÚNICA copia de las calificaciones que el instructor ya tecleó.
  // Borrarla cuando solo sospechamos —pero no sabemos— que la sesión terminó, es tirar
  // el trabajo de un grupo entero. Solo se borra cuando el servidor ya lo confirmó.
  if (!conservarSesionGuardada) localStorage.removeItem('_perfActiveSession');
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
    // ══════════════════════════════════════════════════════════════════════════
    // 🔴 RAÍZ (10-sep-2026): SE PERDÍAN LAS CALIFICACIONES DE UN GRUPO ENTERO.
    // ══════════════════════════════════════════════════════════════════════════
    // supabase-js NO LANZA: cada `update` rechazado (RLS, red, sesión vencida) RESUELVE
    // con {data:null, error:{...}}. Este `try/catch` nunca se disparaba, así que el
    // bucle "guardaba" 30 calificaciones sin guardar ninguna, se seguía derecho y
    // `_showPerfDefaultView()` —que hace `localStorage.removeItem('_perfActiveSession')`
    // y vacía `_perfActiveGrades`— BORRABA la única copia que quedaba.
    // Síntoma real: el instructor termina un examen práctico en vivo con todo el grupo,
    // la pantalla vuelve tan tranquila al listado como si todo hubiera quedado
    // guardado, y las calificaciones de TODOS los estudiantes ya no existen en ningún
    // lado. No hay forma de recuperarlas: hay que volver a examinar al grupo.
    // 🔒 Ahora se revisa CADA escritura, se cuentan las que fallaron y, si falló
    // aunque sea una, NO se navega, NO se limpia nada y se dice exactamente cuántas
    // y de quién.
    var fallidos = [];
    for (var i = 0; i < _perfActiveGrades.length; i++) {
      var g = _perfActiveGrades[i];
      var finalScore = g.score !== null ? g.score : 0;
      var _gr = null;
      try {
        _gr = await supabaseClient.from('zm_perf_grades')
          .update({ score: finalScore, graded_at: new Date().toISOString() })
          .eq('session_id', _perfActiveSessionId)
          .eq('student_id', g.student_id);
      } catch (e1) {
        _gr = { error: { message: (e1 && e1.message) || 'fallo de red' } };
      }
      if (!_gr || _gr.error) {
        var _gm = (_gr && _gr.error && _gr.error.message) || 'fallo de red';
        console.warn('[LivePerformance] no se guardó la calificación de ' + (g.student_name || g.student_id) + ' (sesión ' + _perfActiveSessionId + '): ' + _gm, _gr && _gr.error);
        fallidos.push(g.student_name || g.student_email || g.student_id);
      }
    }

    if (fallidos.length > 0) {
      // 🔒 Ni una palabra de "guardado", ni un `_showPerfDefaultView()`: la evaluación
      // se queda abierta con las calificaciones en pantalla y en localStorage, que es
      // lo único que le permite al instructor volver a intentar sin re-examinar.
      var _detalle = fallidos.slice(0, 8).join(', ') + (fallidos.length > 8 ? ' …(+' + (fallidos.length - 8) + ')' : '');
      var _msgP = _t('perf_save_partial', 'NO se guardaron todas las calificaciones. Fallaron: ') +
                  fallidos.length + '/' + _perfActiveGrades.length + ' — ' + _detalle + '\n\n' +
                  _t('perf_save_keep_open', 'La evaluación sigue abierta y las calificaciones siguen en pantalla. Vuelve a presionar Finalizar.');
      if (window.showToast) window.showToast(_msgP, 'error');
      alert('⚠️ ' + _msgP);
      return;
    }

    // Compute average
    var scores = _perfActiveGrades.map(function(g2) { return g2.score !== null ? g2.score : 0; });
    var avg = scores.length > 0 ? (scores.reduce(function(a, b) { return a + b; }, 0) / scores.length).toFixed(2) : 0;

    // Update session. 🔴 Este update tampoco se revisaba: si fallaba, las
    // calificaciones quedaban guardadas pero la sesión seguía 'active' para siempre —
    // no aparecía en el historial ni se podía ver su detalle, y al recargar el CRM
    // reabría la evaluación como si nunca hubiera terminado.
    var _ses = null;
    try {
      _ses = await supabaseClient.from('zm_perf_sessions').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_seconds: _perfTimerSeconds,
        avg_score: avg
      }).eq('id', _perfActiveSessionId);
    } catch (e2) {
      _ses = { error: { message: (e2 && e2.message) || 'fallo de red' } };
    }
    if (!_ses || _ses.error) {
      var _sm = (_ses && _ses.error && _ses.error.message) || 'fallo de red';
      console.warn('[LivePerformance] las calificaciones se guardaron pero no se cerró la sesión ' + _perfActiveSessionId + ': ' + _sm, _ses && _ses.error);
      if (window.showToast) window.showToast(_t('perf_session_close_failed', 'Las calificaciones SÍ se guardaron, pero no pude cerrar la sesión. Vuelve a presionar Finalizar.'), 'error');
      alert('⚠️ ' + _t('perf_session_close_failed', 'Las calificaciones SÍ se guardaron, pero no pude cerrar la sesión. Vuelve a presionar Finalizar.'));
      return;
    }

    // Recién aquí es verdad que quedó todo guardado: ya se puede soltar la copia local.
    _showPerfDefaultView();
    loadPerfSessionHistory();
  } catch(e) {
    console.warn('[LivePerformance] error inesperado al finalizar la evaluación: ' + ((e && e.message) || e), e);
    alert(_t('perf_final_err') + e.message);
  }
}

async function cancelPerfSession() {
  if (!confirm(_t('perf_confirm_cancel'))) return;
  try {
    // 🔴 Sin revisar `.error` este update "cancelaba" sin cancelar: la sesión quedaba
    // 'active' en la base mientras `_showPerfDefaultView()` borraba la copia local.
    // Síntoma real: al volver a abrir el CRM, `_checkActivePerfSession` ya no tiene la
    // copia local pero la sesión zombi sigue activa en la base, bloqueando el arranque
    // de la siguiente evaluación con un grupo esperando.
    var _c = null;
    try {
      _c = await supabaseClient.from('zm_perf_sessions').update({
        status: 'cancelled',
        ended_at: new Date().toISOString(),
        duration_seconds: _perfTimerSeconds
      }).eq('id', _perfActiveSessionId);
    } catch (e1) {
      _c = { error: { message: (e1 && e1.message) || 'fallo de red' } };
    }
    if (!_c || _c.error) {
      var _cm = (_c && _c.error && _c.error.message) || 'fallo de red';
      console.warn('[LivePerformance] no se pudo cancelar la sesión ' + _perfActiveSessionId + ': ' + _cm, _c && _c.error);
      if (window.showToast) window.showToast(_t('perf_cancel_failed', 'No pude cancelar la evaluación en el servidor. Sigue activa — vuelve a intentar.'), 'error');
      alert('⚠️ ' + _t('perf_cancel_failed', 'No pude cancelar la evaluación en el servidor. Sigue activa — vuelve a intentar.'));
      return;
    }
    _showPerfDefaultView();
    loadPerfSessionHistory();
  } catch(e) {
    console.warn('[LivePerformance] error inesperado al cancelar la evaluación: ' + ((e && e.message) || e), e);
    alert(_t('perf_cancel_err') + e.message);
  }
}

// 🔒 Modal de "no pude leer" para el detalle: se ve DISTINTO de una evaluación sin
// calificaciones, y trae Reintentar. Nunca una hoja en blanco haciéndose pasar por dato.
function _showPerfDetailError(sessionId, detalle) {
  var prev = document.getElementById('perfDetailOverlay');
  if (prev) prev.remove();
  var overlay = document.createElement('div');
  overlay.id = 'perfDetailOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:460px;width:100%;padding:24px;text-align:center;">' +
    '<div style="font-size:34px;margin-bottom:8px;">⚠️</div>' +
    '<div style="color:#1e293b;font-size:14px;font-weight:600;margin-bottom:6px;">' + _t('perf_detail_load_failed', 'No pude cargar las calificaciones de esta evaluación. NO están en cero — simplemente no las pude leer.') + '</div>' +
    '<div style="color:#94a3b8;font-size:11px;margin-bottom:14px;">' + _escHtml(detalle || '') + '</div>' +
    '<button onclick="document.getElementById(\'perfDetailOverlay\').remove();viewPerfSessionDetail(\'' + _escHtml(String(sessionId)) + '\')" style="padding:9px 20px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;margin-right:8px;">🔄 ' + _t('perf_retry', 'Reintentar') + '</button>' +
    '<button onclick="document.getElementById(\'perfDetailOverlay\').remove()" style="padding:9px 20px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">✕</button>' +
  '</div>';
  overlay.onclick = function(ev) { if (ev.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

async function viewPerfSessionDetail(sessionId) {
  try {
    var res = await supabaseClient.from('zm_perf_grades').select('*').eq('session_id', sessionId).order('student_name');
    // 🔴 ANTES: `var grades = res.data || []`. Si la lectura fallaba se abría el modal
    // con la tabla de calificaciones VACÍA y el encabezado normal. Síntoma real: el
    // instructor abre "Ver Detalle" de una evaluación ya calificada y ve una hoja en
    // blanco — cree que se le borraron las calificaciones del grupo. Peor todavía si
    // la lee frente a un estudiante que reclama su nota.
    // 🔒 Hoja en blanco NO es una respuesta: o se muestran los datos, o se dice que no
    // se pudieron leer y se ofrece Reintentar.
    if (res && res.error) {
      console.warn('[LivePerformance] no se pudieron leer las calificaciones de la sesión ' + sessionId + ': ' + (res.error.message || '?'), res.error);
      if (window.showToast) window.showToast(_t('perf_detail_load_failed', 'No pude cargar las calificaciones de esta evaluación. NO están en cero — simplemente no las pude leer.'), 'error');
      _showPerfDetailError(sessionId, res.error.message || '');
      return;
    }
    var grades = res.data || [];
    var sesRes = await supabaseClient.from('zm_perf_sessions').select('*').eq('id', sessionId).single();
    // 🪤 Sin esto, un fallo aquí dejaba `session = {}` y el modal pintaba
    // "Invalid Date", área en blanco y Promedio "--" sobre calificaciones reales:
    // media verdad, que es peor que un error claro.
    if (sesRes && sesRes.error) {
      console.warn('[LivePerformance] no se pudo leer la sesión ' + sessionId + ': ' + (sesRes.error.message || '?'), sesRes.error);
      if (window.showToast) window.showToast(_t('perf_detail_load_failed', 'No pude cargar las calificaciones de esta evaluación. NO están en cero — simplemente no las pude leer.'), 'error');
      _showPerfDetailError(sessionId, sesRes.error.message || '');
      return;
    }
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
    // 🔴 ANTES: `res.data || []` y, con la lista vacía, el aviso "No hay sesiones
    // completadas para exportar". Síntoma real: el instructor pide el respaldo de todo
    // el semestre, la consulta falla y el CRM le asegura que NO EXISTE ninguna
    // evaluación completada. Eso no es un cero, es un "no pude preguntar".
    if (res && res.error) {
      console.warn('[LivePerformance] no se pudieron leer las sesiones para exportar: ' + (res.error.message || '?'), res.error);
      if (window.showToast) window.showToast(_t('perf_export_failed', 'No pude leer las evaluaciones para exportar. No se descargó nada (un CSV vacío parecería que no hay datos).'), 'error');
      return;
    }
    var sessions = res.data || [];
    if (sessions.length === 0) { alert(_t('perf_no_sessions_exp')); return; }

    // Fetch all grades for completed sessions
    var sessionIds = sessions.map(function(s) { return s.id; });
    supabaseClient.from('zm_perf_grades').select('*').in('session_id', sessionIds).order('student_name').then(function(grRes) {
      // 🔴 Igual de grave del otro lado: si fallaba ESTA lectura se descargaba un CSV con
      // puro encabezado. Un archivo que se abre bien y está vacío se archiva como si fuera
      // la verdad — el respaldo del semestre queda en blanco y nadie lo nota hasta que lo
      // necesita. 🔒 Mejor no entregar archivo que entregar uno que miente.
      if (grRes && grRes.error) {
        console.warn('[LivePerformance] no se pudieron leer las calificaciones para exportar: ' + (grRes.error.message || '?'), grRes.error);
        if (window.showToast) window.showToast(_t('perf_export_failed', 'No pude leer las evaluaciones para exportar. No se descargó nada (un CSV vacío parecería que no hay datos).'), 'error');
        return;
      }
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

    // ══════════════════════════════════════════════════════════════════════════
    // 🔴 ANTES: `if (!res.data) localStorage.removeItem('_perfActiveSession')`.
    // ══════════════════════════════════════════════════════════════════════════
    // supabase-js NO LANZA: si la lectura era rechazada (red, RLS, token vencido)
    // devolvía {data:null, error:{...}} y `!res.data` era verdadero. O sea: un parpadeo
    // de conexión BORRABA la copia local de la evaluación en curso.
    // Síntoma real: el instructor está calificando en vivo, se le va el WiFi un segundo,
    // recarga el CRM y la evaluación —con las calificaciones ya tecleadas— desapareció.
    // 🪤 `.single()` con CERO filas también trae `error`, con code 'PGRST116'. Ese SÍ es
    // un "ya no está activa" legítimo y ahí sí se limpia. Cualquier otro error es
    // "no pude preguntar" y NO se toca nada.
    var _noExiste = res && res.error && (res.error.code === 'PGRST116' || /0 rows|multiple \(or no\) rows/i.test(res.error.message || ''));
    if (res && res.error && !_noExiste) {
      console.warn('[LivePerformance] no se pudo confirmar la evaluación en curso ' + stored.id + ': ' + (res.error.message || '?'), res.error);
      if (window.showToast) window.showToast(_t('perf_active_check_failed', 'No pude confirmar tu evaluación en curso. NO se borró: revisa tu conexión y vuelve a entrar.'), 'warning');
      return 'unknown';
    }
    if (!res || !res.data) {
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
    // 🔴 Este catch BORRABA la evaluación en curso ante cualquier tropiezo — hasta un
    // error de pintado dejaba al instructor sin las calificaciones que ya había puesto.
    // 🔒 Duda = no destruir. Se conserva la copia local y se avisa.
    console.warn('[LivePerformance] error inesperado al restaurar la evaluación en curso ' + stored.id + ': ' + ((e && e.message) || e), e);
    if (window.showToast) window.showToast(_t('perf_active_check_failed', 'No pude confirmar tu evaluación en curso. NO se borró: revisa tu conexión y vuelve a entrar.'), 'warning');
    return 'unknown';
  }
}

async function deletePerfSession(sessionId) {
  if (!confirm(_t('perf_confirm_del'))) return;
  try {
    // 🔴 El delete tampoco se revisaba. Como supabase-js resuelve con {error}, un borrado
    // rechazado por RLS pasaba por bueno y se repintaba el historial. Síntoma real: el
    // admin borra una sesión, la fila reaparece ahí mismo sin explicación y él la vuelve
    // a borrar en círculos, sin enterarse nunca de que no tiene permiso.
    var _del = null;
    try {
      _del = await supabaseClient.from('zm_perf_sessions').delete().eq('id', sessionId);
    } catch (e1) {
      _del = { error: { message: (e1 && e1.message) || 'fallo de red' } };
    }
    if (!_del || _del.error) {
      var _dm = (_del && _del.error && _del.error.message) || 'fallo de red';
      console.warn('[LivePerformance] no se pudo eliminar la sesión ' + sessionId + ': ' + _dm, _del && _del.error);
      if (window.showToast) window.showToast(_t('perf_delete_failed', 'No pude eliminar la sesión. Sigue ahí — vuelve a intentar.'), 'error');
      alert('⚠️ ' + _t('perf_delete_failed', 'No pude eliminar la sesión. Sigue ahí — vuelve a intentar.'));
      return;
    }
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

