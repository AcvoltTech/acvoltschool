/* ===================================================================
   Acvolt.school Admin — Student Progress + Content Editor
   Tab 1 (Estudiantes): Shows all imported students and their progress.
   Tab 2 (Contenido): Course/section/lesson editor with video preview.
   Self-contained: injects HTML + CSS into #crm-section-acvoltSchool.
   =================================================================== */

if (typeof _addTranslations === 'function') _addTranslations({
  adm_as_students: { es: 'Estudiantes', en: 'Students' },
  adm_as_content: { es: 'Contenido', en: 'Content' },
  adm_as_title: { es: 'Acvolt.school \u2014 Estudiantes', en: 'Acvolt.school \u2014 Students' },
  adm_as_refresh: { es: 'Actualizar', en: 'Refresh' },
  adm_as_total_users: { es: 'Total Usuarios', en: 'Total Users' },
  adm_as_active: { es: 'Activos', en: 'Active' },
  adm_as_completed_lessons: { es: 'Lecciones Completadas', en: 'Completed Lessons' },
  adm_as_checks_done: { es: 'Checks Realizados', en: 'Checks Completed' },
  adm_as_search_placeholder: { es: 'Buscar por nombre, email o tel\u00E9fono...', en: 'Search by name, email or phone...' },
  adm_as_name: { es: 'Nombre', en: 'Name' },
  adm_as_email: { es: 'Email', en: 'Email' },
  adm_as_phone: { es: 'Tel\u00E9fono', en: 'Phone' },
  adm_as_lessons: { es: 'Lecciones', en: 'Lessons' },
  adm_as_checks: { es: 'Checks', en: 'Checks' },
  adm_as_status: { es: 'Estado', en: 'Status' },
  adm_as_loading: { es: 'Cargando datos...', en: 'Loading data...' },
  adm_as_content_title: { es: 'Contenido \u2014 Editor de Cursos', en: 'Content \u2014 Course Editor' },
  adm_as_courses: { es: 'Cursos', en: 'Courses' },
  adm_as_sections: { es: 'Secciones', en: 'Sections' },
  adm_as_lessons_stat: { es: 'Lecciones', en: 'Lessons' },
  adm_as_videos_mapped: { es: 'Videos Mapeados', en: 'Mapped Videos' },
  adm_as_search_content: { es: 'Buscar curso, secci\u00F3n o lecci\u00F3n...', en: 'Search course, section or lesson...' },
  adm_as_loading_content: { es: 'Cargando contenido...', en: 'Loading content...' },
  adm_as_load_error: { es: 'Error al cargar datos: ', en: 'Error loading data: ' },
  adm_as_no_name: { es: '(sin nombre)', en: '(no name)' },
  adm_as_active_status: { es: 'Activo', en: 'Active' },
  adm_as_inactive_status: { es: 'Inactivo', en: 'Inactive' },
  adm_as_no_results: { es: 'No se encontraron resultados para "', en: 'No results found for "' },
  adm_as_no_data: { es: 'No hay datos', en: 'No data' },
  adm_as_students_label: { es: 'estudiantes', en: 'students' },
  adm_as_page: { es: 'P\u00E1g', en: 'Page' },
  adm_as_no_profile: { es: 'Sin perfil asociado', en: 'No associated profile' },
  adm_as_progress_by_course: { es: 'Progreso por Curso', en: 'Progress by Course' },
  adm_as_no_activity: { es: 'Este estudiante no tiene actividad registrada', en: 'This student has no recorded activity' },
  adm_as_hidden: { es: 'Oculto', en: 'Hidden' },
  adm_as_edit: { es: 'Editar', en: 'Edit' },
  adm_as_no_sections: { es: 'Sin secciones', en: 'No sections' },
  adm_as_no_courses: { es: 'No se encontraron cursos', en: 'No courses found' },
  adm_as_for_search: { es: ' para "', en: ' for "' },
  adm_as_no_video: { es: 'Sin video asignado', en: 'No video assigned' },
  adm_as_edit_lesson: { es: 'Editar Lecci\u00F3n #', en: 'Edit Lesson #' },
  adm_as_title_label: { es: 'T\u00EDtulo', en: 'Title' },
  adm_as_description: { es: 'Descripci\u00F3n', en: 'Description' },
  adm_as_type: { es: 'Tipo', en: 'Type' },
  adm_as_dur_hrs: { es: 'Duraci\u00F3n (hrs)', en: 'Duration (hrs)' },
  adm_as_dur_min: { es: 'Duraci\u00F3n (min)', en: 'Duration (min)' },
  adm_as_cancel: { es: 'Cancelar', en: 'Cancel' },
  adm_as_save: { es: 'Guardar', en: 'Save' },
  adm_as_saving: { es: 'Guardando...', en: 'Saving...' },
  adm_as_lesson_saved: { es: 'Lecci\u00F3n guardada correctamente', en: 'Lesson saved successfully' },
  adm_as_not_authorized: { es: 'No autorizado', en: 'Not authorized' },
  adm_as_save_error: { es: 'Error al guardar', en: 'Error saving' },
  adm_as_edit_course: { es: 'Editar Curso #', en: 'Edit Course #' },
  adm_as_order: { es: 'Orden', en: 'Order' },
  adm_as_course_saved: { es: 'Curso guardado correctamente', en: 'Course saved successfully' },
  adm_as_edit_section: { es: 'Editar Secci\u00F3n #', en: 'Edit Section #' },
  adm_as_section_saved: { es: 'Secci\u00F3n guardada correctamente', en: 'Section saved successfully' },
  adm_as_content_load_error: { es: 'Error al cargar: ', en: 'Error loading: ' },
  adm_as_video: { es: 'Video', en: 'Video' },
  adm_as_text: { es: 'Texto', en: 'Text' },
  adm_as_quiz: { es: 'Quiz', en: 'Quiz' },
});

var _asData = { users: [], profiles: [], progress: [], checks: [], courses: [] };
var _asSearch = '';
var _asLoading = false;
var _asInitDone = false;
var _asExpandedRow = null;

/* ── Content Editor state ─────────────────────────────────────── */
var _ascData = { courses: [], sections: [], lessons: [] };
var _ascLoaded = false;
var _ascLoading = false;
var _ascSearch = '';
var _ascExpanded = {};
var _ascSecExpanded = {};
var _ascEditId = null;

/* ── Supabase REST helper ─────────────────────────────────────── */
function _asQuery(table, params) {
  var url = SUPABASE_URL + '/rest/v1/' + table + '?' + params;
  return fetch(url, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  }).then(function(r) { return r.json(); });
}

/* ── Init: inject CSS + HTML shell ────────────────────────────── */
function _asInit() {
  if (_asInitDone) return;
  _asInitDone = true;

  var style = document.createElement('style');
  style.textContent =
    '#as-panel{max-width:1200px;margin:0 auto;font-family:inherit;}' +
    '.as-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}' +
    '.as-stat{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px;text-align:center;}' +
    '.as-stat-val{font-size:28px;font-weight:700;color:#e2e8f0;}' +
    '.as-stat-lbl{font-size:12px;color:#64748b;margin-top:4px;}' +
    '.as-search{width:100%;padding:10px 14px;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:14px;margin-bottom:16px;box-sizing:border-box;}' +
    '.as-search::placeholder{color:#475569;}' +
    '.as-search:focus{outline:none;border-color:#3b82f6;}' +
    '.as-table{width:100%;border-collapse:collapse;}' +
    '.as-table th{text-align:left;padding:10px 12px;color:#94a3b8;font-size:12px;font-weight:600;text-transform:uppercase;border-bottom:1px solid #334155;position:sticky;top:0;background:#0f172a;z-index:1;}' +
    '.as-table td{padding:10px 12px;color:#e2e8f0;font-size:13px;border-bottom:1px solid #1e293b;}' +
    '.as-row{cursor:pointer;transition:background .15s;}' +
    '.as-row:hover{background:rgba(59,130,246,0.08);}' +
    '.as-row-expanded{background:rgba(59,130,246,0.05);}' +
    '.as-detail{background:#1e293b;border-radius:8px;padding:16px;margin:8px 12px 12px;}' +
    '.as-detail h4{color:#e2e8f0;margin:0 0 12px;font-size:14px;}' +
    '.as-course-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #334155;}' +
    '.as-course-row:last-child{border-bottom:none;}' +
    '.as-course-name{flex:1;color:#cbd5e1;font-size:13px;}' +
    '.as-course-stat{color:#94a3b8;font-size:12px;min-width:80px;text-align:right;}' +
    '.as-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;}' +
    '.as-badge-green{background:rgba(34,197,94,0.15);color:#22c55e;}' +
    '.as-badge-gray{background:rgba(100,116,139,0.15);color:#94a3b8;}' +
    '.as-badge-blue{background:rgba(59,130,246,0.15);color:#3b82f6;}' +
    '.as-empty{text-align:center;color:#64748b;padding:40px 20px;font-size:14px;}' +
    '.as-pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;}' +
    '.as-page-btn{background:#1e293b;color:#e2e8f0;border:1px solid #334155;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;}' +
    '.as-page-btn:hover{background:#334155;}' +
    '.as-page-btn.active{background:#3b82f6;border-color:#3b82f6;font-weight:600;}' +
    '.as-page-btn:disabled{opacity:0.4;cursor:default;}' +
    '.as-page-info{color:#94a3b8;font-size:13px;}' +
    '@media(max-width:768px){.as-stats{grid-template-columns:repeat(2,1fr);}.as-table th:nth-child(4),.as-table td:nth-child(4),.as-table th:nth-child(5),.as-table td:nth-child(5){display:none;}}';
  document.head.appendChild(style);

  /* ── Content Editor + Tabs CSS ─────────────────────────────── */
  var style2 = document.createElement('style');
  style2.textContent =
    '.as-tab-bar{display:flex;gap:0;margin-bottom:20px;border-bottom:2px solid #334155;}' +
    '.as-tab{background:none;border:none;color:#64748b;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s;}' +
    '.as-tab:hover{color:#94a3b8;}' +
    '.as-tab.as-tab-active{color:#3b82f6;border-bottom-color:#3b82f6;}' +
    '.asc-course{border-bottom:1px solid #334155;}' +
    '.asc-course:last-child{border-bottom:none;}' +
    '.asc-hdr{display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;transition:background .15s;}' +
    '.asc-hdr:hover{background:rgba(59,130,246,0.08);}' +
    '.asc-arrow{font-size:10px;color:#64748b;transition:transform .2s;display:inline-block;width:14px;text-align:center;}' +
    '.asc-arrow.open{transform:rotate(90deg);}' +
    '.asc-c-title{flex:1;color:#e2e8f0;font-size:14px;font-weight:600;}' +
    '.asc-meta{color:#64748b;font-size:12px;white-space:nowrap;}' +
    '.asc-edit-btn{background:none;border:1px solid #334155;color:#94a3b8;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:11px;white-space:nowrap;}' +
    '.asc-edit-btn:hover{background:#334155;color:#e2e8f0;}' +
    '.asc-section{border-top:1px solid #1e293b;}' +
    '.asc-s-hdr{display:flex;align-items:center;gap:10px;padding:10px 16px 10px 36px;cursor:pointer;transition:background .15s;}' +
    '.asc-s-hdr:hover{background:rgba(59,130,246,0.05);}' +
    '.asc-s-title{flex:1;color:#cbd5e1;font-size:13px;font-weight:500;}' +
    '.asc-lesson{display:flex;align-items:center;gap:10px;padding:8px 16px 8px 56px;cursor:pointer;transition:background .15s;border-top:1px solid rgba(51,65,85,0.5);}' +
    '.asc-lesson:hover{background:rgba(59,130,246,0.05);}' +
    '.asc-l-icon{font-size:14px;width:20px;text-align:center;}' +
    '.asc-l-title{flex:1;color:#94a3b8;font-size:13px;}' +
    '.asc-l-vid{font-size:13px;}' +
    '.asc-l-dur{color:#475569;font-size:12px;min-width:50px;text-align:right;}' +
    '.asc-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;}' +
    '.asc-modal{background:#1e293b;border:1px solid #334155;border-radius:12px;width:560px;max-width:95vw;max-height:90vh;overflow-y:auto;}' +
    '.asc-modal-hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #334155;}' +
    '.asc-modal-hdr h3{color:#e2e8f0;margin:0;font-size:16px;}' +
    '.asc-modal-x{background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;padding:4px 8px;}' +
    '.asc-modal-x:hover{color:#e2e8f0;}' +
    '.asc-modal-body{padding:20px;}' +
    '.asc-modal-body label{display:block;color:#94a3b8;font-size:12px;font-weight:600;margin:12px 0 4px;text-transform:uppercase;}' +
    '.asc-modal-body label:first-child{margin-top:0;}' +
    '.asc-modal-body input,.asc-modal-body textarea,.asc-modal-body select{width:100%;padding:8px 12px;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:13px;box-sizing:border-box;font-family:inherit;}' +
    '.asc-modal-body input:focus,.asc-modal-body textarea:focus,.asc-modal-body select:focus{outline:none;border-color:#3b82f6;}' +
    '.asc-modal-body textarea{min-height:60px;resize:vertical;}' +
    '.asc-modal-body input[readonly]{opacity:0.6;cursor:default;}' +
    '.asc-modal-foot{display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid #334155;}' +
    '.asc-btn{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;}' +
    '.asc-btn-cancel{background:#334155;color:#e2e8f0;}' +
    '.asc-btn-cancel:hover{background:#475569;}' +
    '.asc-btn-save{background:#3b82f6;color:#fff;}' +
    '.asc-btn-save:hover{background:#2563eb;}' +
    '.asc-btn-save:disabled{opacity:0.5;cursor:default;}' +
    '.asc-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}' +
    '.asc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}' +
    '.asc-preview{margin-top:8px;border-radius:8px;overflow:hidden;background:#0f172a;text-align:center;}' +
    '.asc-preview iframe{border:0;border-radius:8px;}' +
    '.asc-toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;color:#fff;font-size:13px;font-weight:600;z-index:10000;animation:asc-fade-in .3s;}' +
    '@keyframes asc-fade-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}';
  document.head.appendChild(style2);

  var shell = document.getElementById('crm-section-acvoltSchool');
  if (!shell) return;
  shell.innerHTML =
    '<div id="as-panel">' +
      '<div class="as-tab-bar">' +
        '<button class="as-tab as-tab-active" id="as-tab-btn-students" onclick="_asTabSwitch(\'students\')">' + _t('adm_as_students', 'Estudiantes') + '</button>' +
        '<button class="as-tab" id="as-tab-btn-content" onclick="_asTabSwitch(\'content\')">' + _t('adm_as_content', 'Contenido') + '</button>' +
      '</div>' +
      /* ── Students tab (existing) ── */
      '<div id="as-tab-students">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
          '<h2 style="color:#e2e8f0;margin:0;font-size:22px;">\uD83C\uDFEB ' + _t('adm_as_title', 'Acvolt.school \u2014 Estudiantes') + '</h2>' +
          '<button onclick="loadAcvoltSchoolAdmin()" style="background:#334155;color:#e2e8f0;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;">\uD83D\uDD04 ' + _t('adm_as_refresh', 'Actualizar') + '</button>' +
        '</div>' +
        '<div class="as-stats">' +
          '<div class="as-stat"><div class="as-stat-val" id="as-stat-total">--</div><div class="as-stat-lbl">' + _t('adm_as_total_users', 'Total Usuarios') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="as-stat-active">--</div><div class="as-stat-lbl">' + _t('adm_as_active', 'Activos') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="as-stat-lessons">--</div><div class="as-stat-lbl">' + _t('adm_as_completed_lessons', 'Lecciones Completadas') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="as-stat-checks">--</div><div class="as-stat-lbl">' + _t('adm_as_checks_done', 'Checks Realizados') + '</div></div>' +
        '</div>' +
        '<input class="as-search" id="as-search" type="text" placeholder="\uD83D\uDD0D ' + _t('adm_as_search_placeholder', 'Buscar por nombre, email o tel\u00E9fono...') + '" oninput="_asOnSearch(this.value)">' +
        '<div style="max-height:600px;overflow-y:auto;border:1px solid #334155;border-radius:10px;">' +
          '<table class="as-table">' +
            '<thead><tr><th>' + _t('adm_as_name', 'Nombre') + '</th><th>' + _t('adm_as_email', 'Email') + '</th><th>' + _t('adm_as_phone', 'Tel\u00E9fono') + '</th><th>' + _t('adm_as_lessons', 'Lecciones') + '</th><th>' + _t('adm_as_checks', 'Checks') + '</th><th>' + _t('adm_as_status', 'Estado') + '</th></tr></thead>' +
            '<tbody id="as-tbody"><tr><td colspan="6" class="as-empty">' + _t('adm_as_loading', 'Cargando datos...') + '</td></tr></tbody>' +
          '</table>' +
        '</div>' +
        '<div class="as-pagination" id="as-pagination"></div>' +
      '</div>' +
      /* ── Content Editor tab ── */
      '<div id="as-tab-content" style="display:none;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
          '<h2 style="color:#e2e8f0;margin:0;font-size:22px;">' + _t('adm_as_content_title', 'Contenido \u2014 Editor de Cursos') + '</h2>' +
          '<button onclick="_ascLoadData()" style="background:#334155;color:#e2e8f0;border:1px solid #475569;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;">\uD83D\uDD04 ' + _t('adm_as_refresh', 'Actualizar') + '</button>' +
        '</div>' +
        '<div class="as-stats">' +
          '<div class="as-stat"><div class="as-stat-val" id="asc-stat-courses">--</div><div class="as-stat-lbl">' + _t('adm_as_courses', 'Cursos') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="asc-stat-sections">--</div><div class="as-stat-lbl">' + _t('adm_as_sections', 'Secciones') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="asc-stat-lessons">--</div><div class="as-stat-lbl">' + _t('adm_as_lessons_stat', 'Lecciones') + '</div></div>' +
          '<div class="as-stat"><div class="as-stat-val" id="asc-stat-videos">--</div><div class="as-stat-lbl">' + _t('adm_as_videos_mapped', 'Videos Mapeados') + '</div></div>' +
        '</div>' +
        '<input class="as-search" id="asc-search-input" type="text" placeholder="\uD83D\uDD0D ' + _t('adm_as_search_content', 'Buscar curso, secci\u00F3n o lecci\u00F3n...') + '" oninput="_ascOnSearch(this.value)">' +
        '<div id="asc-accordion" style="max-height:600px;overflow-y:auto;border:1px solid #334155;border-radius:10px;">' +
          '<div class="as-empty">' + _t('adm_as_loading_content', 'Cargando contenido...') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ── Pagination state ─────────────────────────────────────────── */
var _asPage = 1;
var _asPerPage = 50;

/* ── Load all data ────────────────────────────────────────────── */
async function loadAcvoltSchoolAdmin() {
  _asInit();
  if (_asLoading) return;
  _asLoading = true;

  try {
    var results = await Promise.all([
      _asQuery('acvolt_school_users', 'select=id,name,username,email,status,created_at&order=id&limit=5000'),
      _asQuery('acvolt_school_profiles', 'select=id,user_id,name,lastname,phone&limit=5000'),
      _asQuery('acvolt_school_progress', 'select=id,profile_id,course_id,lesson_id,date,status&limit=50000'),
      _asQuery('acvolt_school_checks', 'select=id,profile_id,course_id,lesson_id,date,status&limit=50000'),
      _asQuery('acvolt_courses', 'select=id,old_id,title&order=sort_order,old_id')
    ]);

    _asData.users = results[0] || [];
    _asData.profiles = results[1] || [];
    _asData.progress = results[2] || [];
    _asData.checks = results[3] || [];
    _asData.courses = results[4] || [];

    _asPage = 1;
    _asUpdateStats();
    _asRenderTable();
  } catch (e) {
    console.error('Acvolt.school admin load error:', e);
    var tbody = document.getElementById('as-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="as-empty">' + _t('adm_as_load_error', 'Error al cargar datos: ') + _asEsc(e.message) + '</td></tr>';
  }
  _asLoading = false;
}

/* ── Build merged user list ───────────────────────────────────── */
function _asMergedUsers() {
  var profileMap = {};
  _asData.profiles.forEach(function(p) { profileMap[p.user_id] = p; });

  // Pre-compute progress/checks counts per profile
  var progressCount = {};
  _asData.progress.forEach(function(p) {
    progressCount[p.profile_id] = (progressCount[p.profile_id] || 0) + 1;
  });
  var checksCount = {};
  _asData.checks.forEach(function(c) {
    checksCount[c.profile_id] = (checksCount[c.profile_id] || 0) + 1;
  });

  // Map profile_id → user_id
  var profileToUser = {};
  _asData.profiles.forEach(function(p) { profileToUser[p.id] = p.user_id; });

  return _asData.users.map(function(u) {
    var prof = profileMap[u.id] || {};
    var fullName = '';
    if (prof.name || prof.lastname) {
      fullName = ((prof.name || '') + ' ' + (prof.lastname || '')).trim();
    }
    if (!fullName) fullName = u.name || u.username || _t('adm_as_no_name', '(sin nombre)');

    var profId = prof.id;
    return {
      id: u.id,
      profileId: profId,
      name: fullName,
      email: u.email || '',
      phone: prof.phone || '',
      lessons: profId ? (progressCount[profId] || 0) : 0,
      checks: profId ? (checksCount[profId] || 0) : 0,
      status: u.status,
      created: u.created_at || ''
    };
  });
}

/* ── Update stats bar ─────────────────────────────────────────── */
function _asUpdateStats() {
  var el = function(id) { return document.getElementById(id); };
  var total = _asData.users.length;
  var active = _asData.users.filter(function(u) { return u.status === 1; }).length;
  var lessons = _asData.progress.length;
  var checks = _asData.checks.length;

  if (el('as-stat-total')) el('as-stat-total').textContent = total.toLocaleString();
  if (el('as-stat-active')) el('as-stat-active').textContent = active.toLocaleString();
  if (el('as-stat-lessons')) el('as-stat-lessons').textContent = lessons.toLocaleString();
  if (el('as-stat-checks')) el('as-stat-checks').textContent = checks.toLocaleString();
}

/* ── Filter by search ─────────────────────────────────────────── */
function _asOnSearch(val) {
  _asSearch = (val || '').toLowerCase().trim();
  _asPage = 1;
  _asRenderTable();
}

function _asFilteredUsers() {
  var merged = _asMergedUsers();
  if (!_asSearch) return merged;
  return merged.filter(function(u) {
    return u.name.toLowerCase().indexOf(_asSearch) !== -1 ||
           u.email.toLowerCase().indexOf(_asSearch) !== -1 ||
           u.phone.indexOf(_asSearch) !== -1;
  });
}

/* ── Render table ─────────────────────────────────────────────── */
function _asRenderTable() {
  var tbody = document.getElementById('as-tbody');
  if (!tbody) return;

  var filtered = _asFilteredUsers();
  var totalPages = Math.max(1, Math.ceil(filtered.length / _asPerPage));
  if (_asPage > totalPages) _asPage = totalPages;

  var start = (_asPage - 1) * _asPerPage;
  var pageData = filtered.slice(start, start + _asPerPage);

  if (pageData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="as-empty">' +
      (_asSearch ? _t('adm_as_no_results', 'No se encontraron resultados para "') + _asEsc(_asSearch) + '"' : _t('adm_as_no_data', 'No hay datos')) +
      '</td></tr>';
    _asRenderPagination(0, 0);
    return;
  }

  var html = '';
  pageData.forEach(function(u) {
    var statusBadge = u.status === 1
      ? '<span class="as-badge as-badge-green">' + _t('adm_as_active_status', 'Activo') + '</span>'
      : '<span class="as-badge as-badge-gray">' + _t('adm_as_inactive_status', 'Inactivo') + '</span>';

    html += '<tr class="as-row" onclick="_asToggleDetail(' + u.id + ', this)">' +
      '<td>' + _asEsc(u.name) + '</td>' +
      '<td>' + _asEsc(u.email) + '</td>' +
      '<td>' + _asEsc(u.phone) + '</td>' +
      '<td>' + u.lessons + '</td>' +
      '<td>' + u.checks + '</td>' +
      '<td>' + statusBadge + '</td>' +
      '</tr>' +
      '<tr id="as-detail-' + u.id + '" style="display:none;"><td colspan="6" style="padding:0;"></td></tr>';
  });

  tbody.innerHTML = html;
  _asRenderPagination(filtered.length, totalPages);
}

/* ── Pagination controls ──────────────────────────────────────── */
function _asRenderPagination(total, totalPages) {
  var container = document.getElementById('as-pagination');
  if (!container) return;

  if (totalPages <= 1) { container.innerHTML = '<span class="as-page-info">' + total + ' ' + _t('adm_as_students_label', 'estudiantes') + '</span>'; return; }

  var html = '<button class="as-page-btn" onclick="_asGoPage(1)" ' + (_asPage === 1 ? 'disabled' : '') + '>&laquo;</button>';
  html += '<button class="as-page-btn" onclick="_asGoPage(' + (_asPage - 1) + ')" ' + (_asPage === 1 ? 'disabled' : '') + '>&lsaquo;</button>';

  // Show max 5 page buttons around current
  var startP = Math.max(1, _asPage - 2);
  var endP = Math.min(totalPages, startP + 4);
  if (endP - startP < 4) startP = Math.max(1, endP - 4);

  for (var i = startP; i <= endP; i++) {
    html += '<button class="as-page-btn' + (i === _asPage ? ' active' : '') + '" onclick="_asGoPage(' + i + ')">' + i + '</button>';
  }

  html += '<button class="as-page-btn" onclick="_asGoPage(' + (_asPage + 1) + ')" ' + (_asPage === totalPages ? 'disabled' : '') + '>&rsaquo;</button>';
  html += '<button class="as-page-btn" onclick="_asGoPage(' + totalPages + ')" ' + (_asPage === totalPages ? 'disabled' : '') + '>&raquo;</button>';
  html += '<span class="as-page-info">' + total + ' ' + _t('adm_as_students_label', 'estudiantes') + ' &middot; ' + _t('adm_as_page', 'P\u00E1g') + ' ' + _asPage + '/' + totalPages + '</span>';

  container.innerHTML = html;
}

function _asGoPage(p) {
  _asPage = p;
  _asRenderTable();
  // Scroll table to top
  var tableContainer = document.querySelector('#crm-section-acvoltSchool .as-table');
  if (tableContainer && tableContainer.parentElement) tableContainer.parentElement.scrollTop = 0;
}

/* ── Expand/collapse student detail ───────────────────────────── */
function _asToggleDetail(userId, rowEl) {
  var detailRow = document.getElementById('as-detail-' + userId);
  if (!detailRow) return;

  // Collapse previous
  if (_asExpandedRow && _asExpandedRow !== userId) {
    var prev = document.getElementById('as-detail-' + _asExpandedRow);
    if (prev) { prev.style.display = 'none'; prev.querySelector('td').innerHTML = ''; }
    var prevRow = prev ? prev.previousElementSibling : null;
    if (prevRow) prevRow.classList.remove('as-row-expanded');
  }

  if (detailRow.style.display === 'none') {
    detailRow.style.display = '';
    rowEl.classList.add('as-row-expanded');
    _asExpandedRow = userId;
    _asRenderDetail(userId, detailRow.querySelector('td'));
  } else {
    detailRow.style.display = 'none';
    detailRow.querySelector('td').innerHTML = '';
    rowEl.classList.remove('as-row-expanded');
    _asExpandedRow = null;
  }
}

/* ── Render course-by-course detail ───────────────────────────── */
function _asRenderDetail(userId, container) {
  // Find profile id
  var prof = _asData.profiles.find(function(p) { return p.user_id === userId; });
  if (!prof) {
    container.innerHTML = '<div class="as-detail"><p style="color:#64748b;">' + _t('adm_as_no_profile', 'Sin perfil asociado') + '</p></div>';
    return;
  }
  var profId = prof.id;

  // Group progress by course
  var courseProgress = {};
  _asData.progress.forEach(function(p) {
    if (p.profile_id === profId) {
      if (!courseProgress[p.course_id]) courseProgress[p.course_id] = [];
      courseProgress[p.course_id].push(p);
    }
  });

  var courseChecks = {};
  _asData.checks.forEach(function(c) {
    if (c.profile_id === profId) {
      if (!courseChecks[c.course_id]) courseChecks[c.course_id] = [];
      courseChecks[c.course_id].push(c);
    }
  });

  // Build course map by old_id (progress references old_id)
  var courseMap = {};
  _asData.courses.forEach(function(c) {
    courseMap[c.old_id || c.id] = c.title;
    courseMap[c.id] = c.title;
  });

  // Collect all course IDs this student touched
  var touchedCourses = {};
  Object.keys(courseProgress).forEach(function(k) { touchedCourses[k] = true; });
  Object.keys(courseChecks).forEach(function(k) { touchedCourses[k] = true; });

  var courseIds = Object.keys(touchedCourses);

  if (courseIds.length === 0) {
    container.innerHTML = '<div class="as-detail"><p style="color:#64748b;">' + _t('adm_as_no_activity', 'Este estudiante no tiene actividad registrada') + '</p></div>';
    return;
  }

  var html = '<div class="as-detail"><h4>\uD83D\uDCDA ' + _t('adm_as_progress_by_course', 'Progreso por Curso') + '</h4>';
  courseIds.forEach(function(cid) {
    var lessons = courseProgress[cid] || [];
    var checks = courseChecks[cid] || [];
    var courseName = courseMap[cid] || 'Curso #' + cid;

    // Last activity date
    var dates = lessons.map(function(l) { return l.date; }).concat(checks.map(function(c) { return c.date; })).filter(Boolean);
    dates.sort();
    var lastDate = dates.length > 0 ? dates[dates.length - 1] : '';
    var dateStr = lastDate ? new Date(lastDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    html += '<div class="as-course-row">' +
      '<span class="as-badge as-badge-blue">\uD83D\uDCD6</span>' +
      '<span class="as-course-name">' + _asEsc(courseName) + '</span>' +
      '<span class="as-course-stat">' + lessons.length + ' lecc.</span>' +
      '<span class="as-course-stat">' + checks.length + ' checks</span>' +
      (dateStr ? '<span class="as-course-stat" style="color:#64748b;font-size:11px;">' + dateStr + '</span>' : '') +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

/* ── Escape HTML ──────────────────────────────────────────────── */
function _asEsc(s) {
  if (!s) return '';
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/* ── Escape for HTML attributes ──────────────────────────────── */
function _ascAttr(s) {
  return _asEsc(s).replace(/"/g, '&quot;');
}

/* =================================================================
   Content Editor — Tab Switching + Accordion + Modals
   ================================================================= */

/* ── Tab switching ────────────────────────────────────────────── */
function _asTabSwitch(tab) {
  var tabs = ['students', 'content'];
  tabs.forEach(function(t) {
    var panel = document.getElementById('as-tab-' + t);
    var btn = document.getElementById('as-tab-btn-' + t);
    if (panel) panel.style.display = (t === tab) ? '' : 'none';
    if (btn) {
      if (t === tab) btn.classList.add('as-tab-active');
      else btn.classList.remove('as-tab-active');
    }
  });
  if (tab === 'content' && !_ascLoaded && !_ascLoading) {
    _ascLoadData();
  }
}

/* ── Load content data ────────────────────────────────────────── */
async function _ascLoadData() {
  if (_ascLoading) return;
  _ascLoading = true;
  try {
    var results = await Promise.all([
      _asQuery('acvolt_courses', 'select=*&order=sort_order,old_id'),
      _asQuery('acvolt_sections', 'select=*&order=course_id,sort_order,old_id'),
      _asQuery('acvolt_lessons', 'select=*&order=section_id,sort_order,old_id')
    ]);
    _ascData.courses = results[0] || [];
    _ascData.sections = results[1] || [];
    _ascData.lessons = results[2] || [];
    _ascLoaded = true;
    _ascUpdateStats();
    _ascRenderAccordion();
  } catch (e) {
    console.error('Content editor load error:', e);
    var acc = document.getElementById('asc-accordion');
    if (acc) acc.innerHTML = '<div class="as-empty">' + _t('adm_as_content_load_error', 'Error al cargar: ') + _asEsc(e.message) + '</div>';
  }
  _ascLoading = false;
}

/* ── Update content stats ─────────────────────────────────────── */
function _ascUpdateStats() {
  var el = function(id) { return document.getElementById(id); };
  var videos = _ascData.lessons.filter(function(l) { return l.stream_uid; }).length;
  if (el('asc-stat-courses')) el('asc-stat-courses').textContent = _ascData.courses.length;
  if (el('asc-stat-sections')) el('asc-stat-sections').textContent = _ascData.sections.length;
  if (el('asc-stat-lessons')) el('asc-stat-lessons').textContent = _ascData.lessons.length;
  if (el('asc-stat-videos')) el('asc-stat-videos').textContent = videos;
}

/* ── Search filter ────────────────────────────────────────────── */
function _ascOnSearch(val) {
  _ascSearch = (val || '').toLowerCase().trim();
  _ascRenderAccordion();
}

/* ── Render accordion tree ────────────────────────────────────── */
function _ascRenderAccordion() {
  var acc = document.getElementById('asc-accordion');
  if (!acc) return;

  var secByCourse = {};
  _ascData.sections.forEach(function(s) {
    var cid = s.course_id;
    if (!secByCourse[cid]) secByCourse[cid] = [];
    secByCourse[cid].push(s);
  });
  var lessonsBySec = {};
  _ascData.lessons.forEach(function(l) {
    var sid = l.section_id;
    if (!lessonsBySec[sid]) lessonsBySec[sid] = [];
    lessonsBySec[sid].push(l);
  });

  var courses = _ascData.courses;
  if (_ascSearch) {
    courses = courses.filter(function(c) {
      if (c.title && c.title.toLowerCase().indexOf(_ascSearch) !== -1) return true;
      var secs = secByCourse[c.id] || [];
      for (var i = 0; i < secs.length; i++) {
        if (secs[i].title && secs[i].title.toLowerCase().indexOf(_ascSearch) !== -1) return true;
        var les = lessonsBySec[secs[i].id] || [];
        for (var j = 0; j < les.length; j++) {
          if (les[j].title && les[j].title.toLowerCase().indexOf(_ascSearch) !== -1) return true;
        }
      }
      return false;
    });
  }

  if (courses.length === 0) {
    acc.innerHTML = '<div class="as-empty">' + _t('adm_as_no_courses', 'No se encontraron cursos') +
      (_ascSearch ? _t('adm_as_for_search', ' para "') + _asEsc(_ascSearch) + '"' : '') + '</div>';
    return;
  }

  var html = '';
  courses.forEach(function(c) {
    var secs = secByCourse[c.id] || [];
    var lessonCount = 0;
    secs.forEach(function(s) { lessonCount += (lessonsBySec[s.id] || []).length; });
    var expanded = !!_ascExpanded[c.id];
    var statusBadge = c.status === 1
      ? '<span class="as-badge as-badge-green">' + _t('adm_as_active_status', 'Activo') + '</span>'
      : '<span class="as-badge as-badge-gray">' + _t('adm_as_hidden', 'Oculto') + '</span>';

    html += '<div class="asc-course">' +
      '<div class="asc-hdr" onclick="_ascToggleCourse(' + c.id + ')">' +
        '<span class="asc-arrow' + (expanded ? ' open' : '') + '" id="asc-arrow-c' + c.id + '">\u25B6</span>' +
        '<span class="asc-c-title">' + _asEsc(c.title) + '</span>' +
        '<span class="asc-meta">' + secs.length + ' secc. \u00B7 ' + lessonCount + ' lecc.</span>' +
        statusBadge +
        '<button class="asc-edit-btn" onclick="event.stopPropagation();_ascEditCourse(' + c.id + ')">' + _t('adm_as_edit', 'Editar') + '</button>' +
      '</div>' +
      '<div id="asc-cbody-' + c.id + '" style="display:' + (expanded ? '' : 'none') + ';">';

    secs.forEach(function(s) {
      var lessons = lessonsBySec[s.id] || [];
      var secExpanded = !!_ascSecExpanded[s.id];

      html += '<div class="asc-section">' +
        '<div class="asc-s-hdr" onclick="_ascToggleSection(' + s.id + ')">' +
          '<span class="asc-arrow' + (secExpanded ? ' open' : '') + '" id="asc-arrow-s' + s.id + '">\u25B6</span>' +
          '<span class="asc-s-title">' + _asEsc(s.title) + '</span>' +
          '<span class="asc-meta">' + lessons.length + ' lecc.</span>' +
          '<button class="asc-edit-btn" onclick="event.stopPropagation();_ascEditSection(' + s.id + ')">' + _t('adm_as_edit', 'Editar') + '</button>' +
        '</div>' +
        '<div id="asc-sbody-' + s.id + '" style="display:' + (secExpanded ? '' : 'none') + ';">';

      lessons.forEach(function(l) {
        var typeIcon = l.type === 2 ? '\u2753' : (l.type === 1 ? '\uD83D\uDCC4' : '\uD83C\uDFAC');
        var vidStatus = l.stream_uid
          ? '<span style="color:#22c55e;">\u2705</span>'
          : '<span style="color:#ef4444;">\u274C</span>';
        var dur = '';
        if (l.duration_hours || l.duration_minutes) {
          dur = (l.duration_hours || 0) + 'h ' + (l.duration_minutes || 0) + 'm';
        }
        html += '<div class="asc-lesson" onclick="_ascEditLesson(' + l.id + ')">' +
          '<span class="asc-l-icon">' + typeIcon + '</span>' +
          '<span class="asc-l-title">' + _asEsc(l.title) + '</span>' +
          '<span class="asc-l-vid">' + vidStatus + '</span>' +
          '<span class="asc-l-dur">' + dur + '</span>' +
        '</div>';
      });

      html += '</div></div>';
    });

    if (secs.length === 0) {
      html += '<div style="padding:12px 36px;color:#475569;font-size:13px;">' + _t('adm_as_no_sections', 'Sin secciones') + '</div>';
    }

    html += '</div></div>';
  });

  acc.innerHTML = html;
}

/* ── Toggle course expand/collapse ────────────────────────────── */
function _ascToggleCourse(id) {
  _ascExpanded[id] = !_ascExpanded[id];
  var body = document.getElementById('asc-cbody-' + id);
  var arrow = document.getElementById('asc-arrow-c' + id);
  if (body) body.style.display = _ascExpanded[id] ? '' : 'none';
  if (arrow) arrow.classList.toggle('open', _ascExpanded[id]);
}

/* ── Toggle section expand/collapse ───────────────────────────── */
function _ascToggleSection(id) {
  _ascSecExpanded[id] = !_ascSecExpanded[id];
  var body = document.getElementById('asc-sbody-' + id);
  var arrow = document.getElementById('asc-arrow-s' + id);
  if (body) body.style.display = _ascSecExpanded[id] ? '' : 'none';
  if (arrow) arrow.classList.toggle('open', _ascSecExpanded[id]);
}

/* ── Close modal ──────────────────────────────────────────────── */
function _ascCloseModal() {
  var overlay = document.getElementById('asc-modal-overlay');
  if (overlay) overlay.remove();
  _ascEditId = null;
}

/* ── Stream preview ───────────────────────────────────────────── */
function _ascPreviewStream(uid) {
  var container = document.getElementById('asc-ed-preview');
  if (!container) return;
  uid = (uid || '').trim();
  if (uid) {
    container.innerHTML = '<iframe src="https://iframe.videodelivery.net/' +
      encodeURIComponent(uid) + '" style="width:100%;height:180px;" allow="autoplay;fullscreen"></iframe>';
  } else {
    container.innerHTML = '<div style="color:#475569;padding:20px;font-size:13px;">' + _t('adm_as_no_video', 'Sin video asignado') + '</div>';
  }
}

/* ── Toast notification ───────────────────────────────────────── */
function _ascToast(msg, color) {
  var toast = document.createElement('div');
  toast.className = 'asc-toast';
  toast.style.background = color || '#3b82f6';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}

/* ── Auth guard — prevents console calls by non-admins ─────────── */
function _ascRequireAdmin() {
  if (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated()) return true;
  console.warn('[AcvoltSchool] Unauthorized access attempt');
  return false;
}

/* ── Generic save via edge function ───────────────────────────── */
async function _ascSave(table, id, data) {
  if (!_ascRequireAdmin()) throw new Error(_t('adm_as_not_authorized', 'No autorizado'));
  var resp = await fetch(SUPABASE_URL + '/functions/v1/map-stream-uids', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_KEY
    },
    body: JSON.stringify({ table: table, updates: [{ id: id, data: data }], admin_email: getAdminEmail() })
  });
  var result = await resp.json();
  if (!resp.ok) throw new Error(result.error || _t('adm_as_save_error', 'Error al guardar'));
  return result;
}

/* ── Edit Lesson modal ────────────────────────────────────────── */
function _ascEditLesson(id) {
  var lesson = _ascData.lessons.find(function(l) { return l.id === id; });
  if (!lesson) return;
  _ascEditId = id;

  var overlay = document.createElement('div');
  overlay.className = 'asc-overlay';
  overlay.id = 'asc-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) _ascCloseModal(); };

  var streamPreview = lesson.stream_uid
    ? '<iframe src="https://iframe.videodelivery.net/' + encodeURIComponent(lesson.stream_uid) + '" style="width:100%;height:180px;" allow="autoplay;fullscreen"></iframe>'
    : '<div style="color:#475569;padding:20px;font-size:13px;">' + _t('adm_as_no_video', 'Sin video asignado') + '</div>';

  overlay.innerHTML =
    '<div class="asc-modal" onclick="event.stopPropagation()">' +
      '<div class="asc-modal-hdr">' +
        '<h3>' + _t('adm_as_edit_lesson', 'Editar Lecci\u00F3n #') + id + '</h3>' +
        '<button class="asc-modal-x" onclick="_ascCloseModal()">\u2715</button>' +
      '</div>' +
      '<div class="asc-modal-body">' +
        '<label>' + _t('adm_as_title_label', 'T\u00EDtulo') + '</label>' +
        '<input id="asc-ed-title" type="text" value="' + _ascAttr(lesson.title || '') + '">' +
        '<button type="button" id="asc-transcribe-btn" onclick="_ascTranscribe()" style="margin:6px 0 8px;padding:8px 14px;background:#f59e0b;color:#000;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">\uD83C\uDF99\uFE0F ' + _t('adm_as_transcribe_btn', 'Transcribir con IA (para titular)') + '</button>' +
        '<div id="asc-transcribe-status" style="display:none;font-size:12px;margin-bottom:6px;"></div>' +
        '<textarea id="asc-transcript" readonly placeholder="' + _t('adm_as_transcript_ph', 'La transcripci\u00F3n aparecer\u00E1 aqu\u00ED \u2014 \u00FAsala para escribir un buen t\u00EDtulo arriba.') + '" style="width:100%;min-height:120px;font-size:12.5px;line-height:1.5;display:none;margin-bottom:8px;"></textarea>' +
        '<label>' + _t('adm_as_description', 'Descripci\u00F3n') + '</label>' +
        '<textarea id="asc-ed-desc">' + _asEsc(lesson.description || '') + '</textarea>' +
        '<label>Stream UID</label>' +
        '<input id="asc-ed-stream" type="text" value="' + _ascAttr(lesson.stream_uid || '') + '" oninput="_ascPreviewStream(this.value)">' +
        '<div class="asc-preview" id="asc-ed-preview">' + streamPreview + '</div>' +
        '<label>Video Filename</label>' +
        '<input id="asc-ed-filename" type="text" value="' + _ascAttr(lesson.video_filename || '') + '" readonly>' +
        '<div class="asc-grid3">' +
          '<div>' +
            '<label>' + _t('adm_as_type', 'Tipo') + '</label>' +
            '<select id="asc-ed-type">' +
              '<option value="0"' + (lesson.type === 0 || !lesson.type ? ' selected' : '') + '>' + _t('adm_as_video', 'Video') + '</option>' +
              '<option value="1"' + (lesson.type === 1 ? ' selected' : '') + '>' + _t('adm_as_text', 'Texto') + '</option>' +
              '<option value="2"' + (lesson.type === 2 ? ' selected' : '') + '>' + _t('adm_as_quiz', 'Quiz') + '</option>' +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label>' + _t('adm_as_dur_hrs', 'Duraci\u00F3n (hrs)') + '</label>' +
            '<input id="asc-ed-durh" type="number" min="0" value="' + (lesson.duration_hours || 0) + '">' +
          '</div>' +
          '<div>' +
            '<label>' + _t('adm_as_dur_min', 'Duraci\u00F3n (min)') + '</label>' +
            '<input id="asc-ed-durm" type="number" min="0" max="59" value="' + (lesson.duration_minutes || 0) + '">' +
          '</div>' +
        '</div>' +
        '<label>' + _t('adm_as_status', 'Estado') + '</label>' +
        '<select id="asc-ed-status">' +
          '<option value="1"' + (lesson.status === 1 ? ' selected' : '') + '>' + _t('adm_as_active_status', 'Activo') + '</option>' +
          '<option value="0"' + (lesson.status !== 1 ? ' selected' : '') + '>' + _t('adm_as_hidden', 'Oculto') + '</option>' +
        '</select>' +
      '</div>' +
      '<div class="asc-modal-foot">' +
        '<button class="asc-btn asc-btn-cancel" onclick="_ascCloseModal()">' + _t('adm_as_cancel', 'Cancelar') + '</button>' +
        '<button class="asc-btn asc-btn-save" id="asc-ed-save" onclick="_ascSaveLesson()">' + _t('adm_as_save', 'Guardar') + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
}

/* ── Transcribir el video con IA (Deepgram) para ayudar a titular ──── */
async function _ascTranscribe() {
  var uid = ((document.getElementById('asc-ed-stream') || {}).value || '').trim();
  var st = document.getElementById('asc-transcribe-status');
  var ta = document.getElementById('asc-transcript');
  var btn = document.getElementById('asc-transcribe-btn');
  function status(msg, color) { if (st) { st.style.display = 'block'; st.style.color = color || '#64748b'; st.textContent = msg; } }
  if (!uid) { status('Esta lección no tiene video (Stream UID).', '#dc2626'); return; }
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Procesando...'; }
  status('🤖 Preparando y transcribiendo el video con IA… (puede tardar 1–2 min)', '#3b82f6');
  try {
    var url = (window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co') + '/functions/v1/transcribe-video';
    var key = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    var email = '';
    try { email = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || ''; } catch (_) {}
    var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key, 'apikey': key, 'x-admin-email': email }, body: JSON.stringify({ stream_uid: uid, language: 'es' }) });
    var d = await r.json().catch(function () { return {}; });
    if (!r.ok || d.error) throw new Error(d.error || ('HTTP ' + r.status));
    var text = (d.text || '').trim();
    if (!text) throw new Error('La transcripción salió vacía.');
    if (ta) { ta.style.display = 'block'; ta.value = text; }
    status('✅ Transcripción lista (' + text.split(/\s+/).length + ' palabras). Léela y escribe un buen título arriba.', '#16a34a');
  } catch (e) {
    status('Error: ' + ((e && e.message) || e), '#dc2626');
  }
  if (btn) { btn.disabled = false; btn.textContent = '🎙️ Transcribir con IA (para titular)'; }
}

/* ── Save lesson ──────────────────────────────────────────────── */
async function _ascSaveLesson() {
  if (!_ascEditId) return;
  var btn = document.getElementById('asc-ed-save');
  if (btn) { btn.disabled = true; btn.textContent = _t('adm_as_saving', 'Guardando...'); }

  try {
    var data = {
      title: document.getElementById('asc-ed-title').value.trim(),
      description: document.getElementById('asc-ed-desc').value.trim(),
      stream_uid: document.getElementById('asc-ed-stream').value.trim() || null,
      video_filename: document.getElementById('asc-ed-filename').value.trim() || null,
      type: parseInt(document.getElementById('asc-ed-type').value),
      duration_hours: parseInt(document.getElementById('asc-ed-durh').value) || 0,
      duration_minutes: parseInt(document.getElementById('asc-ed-durm').value) || 0,
      status: parseInt(document.getElementById('asc-ed-status').value)
    };

    await _ascSave('acvolt_lessons', _ascEditId, data);
    var lesson = _ascData.lessons.find(function(l) { return l.id === _ascEditId; });
    if (lesson) Object.assign(lesson, data);
    _ascCloseModal();
    _ascRenderAccordion();
    _ascUpdateStats();
    _ascToast(_t('adm_as_lesson_saved', 'Lecci\u00F3n guardada correctamente'), '#22c55e');
  } catch (e) {
    console.error('Save lesson error:', e);
    _ascToast('Error: ' + e.message, '#ef4444');
    if (btn) { btn.disabled = false; btn.textContent = _t('adm_as_save', 'Guardar'); }
  }
}

/* ── Edit Course modal ────────────────────────────────────────── */
function _ascEditCourse(id) {
  var course = _ascData.courses.find(function(c) { return c.id === id; });
  if (!course) return;
  _ascEditId = id;

  var overlay = document.createElement('div');
  overlay.className = 'asc-overlay';
  overlay.id = 'asc-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) _ascCloseModal(); };

  overlay.innerHTML =
    '<div class="asc-modal" onclick="event.stopPropagation()">' +
      '<div class="asc-modal-hdr">' +
        '<h3>' + _t('adm_as_edit_course', 'Editar Curso #') + id + '</h3>' +
        '<button class="asc-modal-x" onclick="_ascCloseModal()">\u2715</button>' +
      '</div>' +
      '<div class="asc-modal-body">' +
        '<label>' + _t('adm_as_title_label', 'T\u00EDtulo') + '</label>' +
        '<input id="asc-ed-title" type="text" value="' + _ascAttr(course.title || '') + '">' +
        '<div class="asc-grid2">' +
          '<div>' +
            '<label>' + _t('adm_as_status', 'Estado') + '</label>' +
            '<select id="asc-ed-status">' +
              '<option value="1"' + (course.status === 1 ? ' selected' : '') + '>' + _t('adm_as_active_status', 'Activo') + '</option>' +
              '<option value="0"' + (course.status !== 1 ? ' selected' : '') + '>' + _t('adm_as_hidden', 'Oculto') + '</option>' +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label>' + _t('adm_as_order', 'Orden') + '</label>' +
            '<input id="asc-ed-sort" type="number" min="0" value="' + (course.sort_order || 0) + '">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="asc-modal-foot">' +
        '<button class="asc-btn asc-btn-cancel" onclick="_ascCloseModal()">' + _t('adm_as_cancel', 'Cancelar') + '</button>' +
        '<button class="asc-btn asc-btn-save" id="asc-ed-save" onclick="_ascSaveCourse()">' + _t('adm_as_save', 'Guardar') + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
}

/* ── Save course ──────────────────────────────────────────────── */
async function _ascSaveCourse() {
  if (!_ascEditId) return;
  var btn = document.getElementById('asc-ed-save');
  if (btn) { btn.disabled = true; btn.textContent = _t('adm_as_saving', 'Guardando...'); }

  try {
    var data = {
      title: document.getElementById('asc-ed-title').value.trim(),
      status: parseInt(document.getElementById('asc-ed-status').value),
      sort_order: parseInt(document.getElementById('asc-ed-sort').value) || 0
    };
    await _ascSave('acvolt_courses', _ascEditId, data);
    var course = _ascData.courses.find(function(c) { return c.id === _ascEditId; });
    if (course) Object.assign(course, data);
    _ascCloseModal();
    _ascRenderAccordion();
    _ascToast(_t('adm_as_course_saved', 'Curso guardado correctamente'), '#22c55e');
  } catch (e) {
    console.error('Save course error:', e);
    _ascToast('Error: ' + e.message, '#ef4444');
    if (btn) { btn.disabled = false; btn.textContent = _t('adm_as_save', 'Guardar'); }
  }
}

/* ── Edit Section modal ───────────────────────────────────────── */
function _ascEditSection(id) {
  var section = _ascData.sections.find(function(s) { return s.id === id; });
  if (!section) return;
  _ascEditId = id;

  var overlay = document.createElement('div');
  overlay.className = 'asc-overlay';
  overlay.id = 'asc-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) _ascCloseModal(); };

  overlay.innerHTML =
    '<div class="asc-modal" onclick="event.stopPropagation()">' +
      '<div class="asc-modal-hdr">' +
        '<h3>' + _t('adm_as_edit_section', 'Editar Secci\u00F3n #') + id + '</h3>' +
        '<button class="asc-modal-x" onclick="_ascCloseModal()">\u2715</button>' +
      '</div>' +
      '<div class="asc-modal-body">' +
        '<label>' + _t('adm_as_title_label', 'T\u00EDtulo') + '</label>' +
        '<input id="asc-ed-title" type="text" value="' + _ascAttr(section.title || '') + '">' +
        '<label>' + _t('adm_as_order', 'Orden') + '</label>' +
        '<input id="asc-ed-sort" type="number" min="0" value="' + (section.sort_order || 0) + '">' +
      '</div>' +
      '<div class="asc-modal-foot">' +
        '<button class="asc-btn asc-btn-cancel" onclick="_ascCloseModal()">' + _t('adm_as_cancel', 'Cancelar') + '</button>' +
        '<button class="asc-btn asc-btn-save" id="asc-ed-save" onclick="_ascSaveSection()">' + _t('adm_as_save', 'Guardar') + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
}

/* ── Save section ─────────────────────────────────────────────── */
async function _ascSaveSection() {
  if (!_ascEditId) return;
  var btn = document.getElementById('asc-ed-save');
  if (btn) { btn.disabled = true; btn.textContent = _t('adm_as_saving', 'Guardando...'); }

  try {
    var data = {
      title: document.getElementById('asc-ed-title').value.trim(),
      sort_order: parseInt(document.getElementById('asc-ed-sort').value) || 0
    };
    await _ascSave('acvolt_sections', _ascEditId, data);
    var section = _ascData.sections.find(function(s) { return s.id === _ascEditId; });
    if (section) Object.assign(section, data);
    _ascCloseModal();
    _ascRenderAccordion();
    _ascToast(_t('adm_as_section_saved', 'Secci\u00F3n guardada correctamente'), '#22c55e');
  } catch (e) {
    console.error('Save section error:', e);
    _ascToast('Error: ' + e.message, '#ef4444');
    if (btn) { btn.disabled = false; btn.textContent = _t('adm_as_save', 'Guardar'); }
  }
}
