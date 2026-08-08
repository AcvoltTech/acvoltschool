if (typeof _addTranslations === 'function') _addTranslations({
  sr_student_mgmt: { es: 'Gestión de Estudiantes', en: 'Student Management' },
  sr_reload: { es: 'Recargar', en: 'Reload' },
  sr_export_csv: { es: 'Exportar CSV', en: 'Export CSV' },
  sr_loading: { es: 'Cargando datos...', en: 'Loading data...' },
  sr_db_unavail: { es: 'Base de datos no disponible', en: 'Database not available' },
  sr_no_students: { es: 'No se encontraron estudiantes', en: 'No students found' },
  sr_students: { es: ' estudiantes', en: ' students' },
  sr_selected: { es: ' seleccionados', en: ' selected' },
  sr_select_all: { es: 'Seleccionar Todos', en: 'Select All' },
  sr_deselect: { es: 'Deseleccionar', en: 'Deselect' },
  sr_activate: { es: 'Activar', en: 'Activate' },
  sr_block: { es: 'Bloquear', en: 'Block' },
  sr_status: { es: 'Status', en: 'Status' },
  sr_group: { es: 'Grupo', en: 'Group' },
  sr_change_status: { es: 'Cambiar Status', en: 'Change Status' },
  sr_assign_group: { es: 'Asignar Grupo', en: 'Assign Group' },
  sr_error_loading: { es: 'Error cargando datos: ', en: 'Error loading data: ' },
  sr_status_error: { es: 'Error actualizando status: ', en: 'Error updating status: ' },
  sr_current: { es: ' (actual)', en: ' (current)' },
  sr_cancel: { es: 'Cancelar', en: 'Cancel' },
  sr_assign_groups: { es: 'Asignar Grupos', en: 'Assign Groups' },
  sr_save: { es: 'Guardar', en: 'Save' },
  sr_confirm_bulk: { es: '¿Cambiar status a "', en: 'Change status to "' },
  sr_confirm_bulk2: { es: '" para ', en: '" for ' },
  sr_confirm_bulk3: { es: ' estudiantes?', en: ' students?' },
  sr_bulk_status: { es: 'Cambiar Status Masivo', en: 'Bulk Change Status' },
  sr_bulk_group: { es: 'Asignar Grupo Masivo', en: 'Bulk Assign Group' },
  sr_assign: { es: 'Asignar', en: 'Assign' },
  sr_select_group: { es: 'Selecciona al menos un grupo.', en: 'Select at least one group.' },
  sr_no_export: { es: 'No hay datos para exportar.', en: 'No data to export.' },
  sr_all: { es: 'Todos', en: 'All' },
  sr_no_group: { es: 'Sin Grupo', en: 'No Group' },
  sr_presencial: { es: 'Presencial', en: 'In-Person' },
  sr_online: { es: 'En Línea', en: 'Online' },
  sr_search_ph: { es: 'Buscar por nombre, email o teléfono...', en: 'Search by name, email or phone...' },
});

/* ===================================================================
   Student Roster — Unified Student Management Tab (Zona de Maestro)
   Self-contained: injects HTML + CSS into #zmTabEstudiantes.
   =================================================================== */

var _srData = [];
var _srFilterStatus = 'all';
var _srFilterGroup = 'all';
var _srSearch = '';
var _srSelected = new Set();
var _srLoading = false;
var _srInitDone = false;
var _srPageSize = 50;
var _srDisplayedCount = 50;

/* ── Status definitions ───────────────────────────────────────── */
var SR_STATUS_DEFS = {
  activo:   { label: 'Activo',    emoji: '\u2705', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  nuevo:    { label: 'Nuevo',     emoji: '\uD83C\uDD95', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  regreso:  { label: 'Regreso',   emoji: '\uD83D\uDD04', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  dropout:  { label: 'Dropout',   emoji: '\u26A0\uFE0F', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  bloqueado:{ label: 'Bloqueado', emoji: '\uD83D\uDEAB', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  sin_membresia: { label: 'Sin Membres\u00EDa', emoji: '\u2753', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  outsider: { label: 'Outsider',  emoji: '\uD83D\uDC64', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  pendiente:{ label: 'Pendiente', emoji: '\u23F3', color: '#eab308', bg: 'rgba(234,179,8,0.15)' }
};

/* ── Init: inject CSS ─────────────────────────────────────────── */
function _srInit() {
  if (_srInitDone) return;
  _srInitDone = true;

  var style = document.createElement('style');
  style.textContent =
    '.sr-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e2e8f0;transition:background .15s;}' +
    '.sr-row:hover{background:rgba(0,0,0,0.02);}' +
    '.sr-check{flex-shrink:0;}.sr-check input{width:16px;height:16px;cursor:pointer;}' +
    '.sr-info{flex:1;min-width:0;}' +
    '.sr-name{color:#1e293b;font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.sr-email{color:#64748b;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
    '.sr-actions{display:flex;gap:4px;flex-shrink:0;}' +
    '.sr-btn{width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}' +
    '.sr-btn:hover{opacity:0.8;}' +
    '.sr-badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;display:inline-block;margin-right:3px;}' +
    '.sr-stat-card{border-radius:10px;padding:14px;text-align:center;cursor:pointer;transition:transform .1s;}' +
    '.sr-stat-card:hover{transform:scale(1.03);}' +
    '.sr-filter-btn{padding:6px 14px;border-radius:20px;cursor:pointer;font-size:12px;border:1px solid;transition:all .15s;}' +
    '.sr-filter-btn.active{font-weight:bold!important;}' +
    '.sr-sub-btn{padding:4px 10px;border-radius:14px;cursor:pointer;font-size:11px;border:1px solid;margin-left:4px;}' +
    '@media(max-width:768px){.sr-row{flex-wrap:wrap;}.sr-actions{width:100%;justify-content:flex-end;margin-top:6px;}#sr-bulk-bar{flex-wrap:wrap;}}' +
    '@media(max-width:600px){.sr-stat-grid{grid-template-columns:repeat(3,1fr)!important;}}';
  document.head.appendChild(style);
}

/* ── Build shell HTML ─────────────────────────────────────────── */
function _srBuildShell() {
  var shell = document.getElementById('zmTabEstudiantes');
  if (!shell) return;

  shell.innerHTML =
    '<div style="max-width:1100px;margin:0 auto;">' +
      // Header
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px;">' +
        '<h3 style="margin:0;color:#1e293b;font-size:18px;">' + _t('sros_student_mgmt_icon','\uD83D\uDC65 Gesti\u00F3n de Estudiantes') + '</h3>' +
        '<div style="display:flex;gap:6px;">' +
          '<button onclick="loadStudentRoster()" style="background:#f1f5f9;padding:6px 14px;border-radius:8px;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-size:12px;">' + _t('sros_reload_btn','\uD83D\uDD04 Recargar') + '</button>' +
          '<button onclick="srExportCSV()" style="background:#f1f5f9;padding:6px 14px;border-radius:8px;color:#475569;border:1px solid #e2e8f0;cursor:pointer;font-size:12px;">' + _t('sros_export_csv_btn','\uD83D\uDCE5 Exportar CSV') + '</button>' +
        '</div>' +
      '</div>' +

      // Stat cards
      '<div class="sr-stat-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">' +
        _srStatCard('sr-stat-activo', '#22c55e', 'rgba(34,197,94,0.08)', _t('sros_stat_activos','\u2705 Activos')) +
        _srStatCard('sr-stat-nuevo', '#3b82f6', 'rgba(59,130,246,0.08)', _t('sros_stat_nuevos','\uD83C\uDD95 Nuevos')) +
        _srStatCard('sr-stat-regreso', '#8b5cf6', 'rgba(139,92,246,0.08)', _t('sros_stat_regreso','\uD83D\uDD04 Regreso')) +
        _srStatCard('sr-stat-dropout', '#f59e0b', 'rgba(245,158,11,0.08)', _t('sros_stat_dropout','\u26A0\uFE0F Dropout')) +
        _srStatCard('sr-stat-bloqueado', '#ef4444', 'rgba(239,68,68,0.08)', _t('sros_stat_bloqueados','\uD83D\uDEAB Bloqueados')) +
        _srStatCard('sr-stat-outsider', '#64748b', 'rgba(100,116,139,0.08)', _t('sros_stat_outsiders','\uD83D\uDC64 Outsiders')) +
        _srStatCard('sr-stat-total', '#475569', 'rgba(71,85,105,0.08)', _t('sros_stat_total','\uD83D\uDCCA Total')) +
        _srStatCard('sr-stat-engrupo', '#0ea5e9', 'rgba(14,165,233,0.08)', _t('sros_stat_engrupo','\uD83D\uDC65 En Grupo')) +
      '</div>' +

      // Status filters
      '<div id="sr-status-filters" style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;"></div>' +

      // Group filters
      '<div id="sr-group-filters" style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;align-items:center;"></div>' +

      // Search
      '<div style="margin-bottom:14px;">' +
        '<input type="text" id="sr-search-input" oninput="srSearchInput(this.value)" placeholder="' + _t('sros_search_placeholder','\uD83D\uDD0D Buscar por nombre, email o tel\u00E9fono...') + '" style="width:100%;padding:10px 14px;background:#f8fafc;color:#1e293b;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
      '</div>' +

      // Bulk action bar
      '<div id="sr-bulk-bar" style="display:none;align-items:center;gap:10px;background:#eff6ff;border:1px solid #3b82f6;border-radius:10px;padding:10px 16px;margin-bottom:14px;">' +
        '<span id="sr-bulk-count" style="color:#1d4ed8;font-size:13px;font-weight:bold;">' + _t('sros_zero_selected','0 seleccionados') + '</span>' +
        '<button onclick="srSelectAll()" style="background:transparent;color:#1d4ed8;border:1px solid #3b82f6;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:11px;">' + _t('sr_select_all','Seleccionar Todos') + '</button>' +
        '<button onclick="srDeselectAll()" style="background:transparent;color:#64748b;border:1px solid #cbd5e1;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:11px;">' + _t('sr_deselect','Deseleccionar') + '</button>' +
        '<div style="flex:1;"></div>' +
        '<button onclick="srBulkSetStatus(\'activo\')" style="background:#22c55e;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">' + _t('sros_activate_btn','\u2705 Activar') + '</button>' +
        '<button onclick="srBulkSetStatus(\'bloqueado\')" style="background:#ef4444;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">' + _t('sros_block_btn','\uD83D\uDEAB Bloquear') + '</button>' +
        '<button onclick="srBulkChangeStatus()" style="background:#8b5cf6;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">' + _t('sros_status_tag','\uD83C\uDFF7\uFE0F Status') + '</button>' +
        '<button onclick="srBulkAssignGroup()" style="background:#3b82f6;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:bold;">' + _t('sros_group_tag','\uD83D\uDC65 Grupo') + '</button>' +
      '</div>' +

      // Student list
      '<div id="sr-student-list" style="max-height:600px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:10px;">' +
        '<div style="text-align:center;color:#94a3b8;padding:40px;">' + _t('sr_loading') + '</div>' +
      '</div>' +
    '</div>' +

    // Modal
    '<div id="sr-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">' +
      '<div id="sr-modal-body" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2);"></div>' +
    '</div>';

  // Build filter buttons
  _srBuildStatusFilters();
  _srBuildGroupFilters();
}

function _srStatCard(id, color, bg, label) {
  return '<div class="sr-stat-card" style="background:' + bg + ';border:1px solid ' + color + '33;">' +
    '<div style="font-size:26px;font-weight:bold;color:' + color + ';" id="' + id + '">0</div>' +
    '<div style="color:' + color + ';font-size:11px;">' + label + '</div></div>';
}

function _srBuildStatusFilters() {
  var el = document.getElementById('sr-status-filters');
  if (!el) return;
  var statuses = [
    { id: 'all', label: _t('sr_all','Todos'), color: '#475569', border: '#cbd5e1' },
    { id: 'activo', label: _t('sros_stat_activos','\u2705 Activos'), color: '#22c55e', border: '#22c55e' },
    { id: 'nuevo', label: _t('sros_stat_nuevos','\uD83C\uDD95 Nuevos'), color: '#3b82f6', border: '#3b82f6' },
    { id: 'regreso', label: _t('sros_stat_regreso','\uD83D\uDD04 Regreso'), color: '#8b5cf6', border: '#8b5cf6' },
    { id: 'dropout', label: _t('sros_stat_dropout','\u26A0\uFE0F Dropout'), color: '#f59e0b', border: '#f59e0b' },
    { id: 'bloqueado', label: _t('sros_stat_bloqueados','\uD83D\uDEAB Bloqueados'), color: '#ef4444', border: '#ef4444' },
    { id: 'outsider', label: _t('sros_stat_outsiders','\uD83D\uDC64 Outsiders'), color: '#64748b', border: '#94a3b8' },
    { id: 'sin_membresia', label: _t('sros_filter_sin_membresia','\u2753 Sin Membres\u00EDa'), color: '#a855f7', border: '#a855f7' },
    { id: 'pendiente', label: _t('sros_filter_pendientes','\u23F3 Pendientes'), color: '#eab308', border: '#eab308' }
  ];
  el.innerHTML = statuses.map(function(s) {
    var active = s.id === _srFilterStatus;
    var bg = active ? s.color : 'transparent';
    var textColor = active ? '#fff' : s.color;
    return '<button class="sr-filter-btn' + (active ? ' active' : '') + '" data-sr-status="' + s.id + '" ' +
      'onclick="srFilterStatus(\'' + s.id + '\')" ' +
      'style="background:' + bg + ';color:' + textColor + ';border-color:' + s.border + ';">' + s.label + '</button>';
  }).join('');
}

function _srBuildGroupFilters() {
  var el = document.getElementById('sr-group-filters');
  if (!el) return;
  var groups = [
    { id: 'all', label: _t('sr_all','Todos'), color: '#475569', border: '#cbd5e1' },
    { id: 'whatsapp_99', label: '\uD83D\uDC9A WA $99', color: '#27ae60', border: '#27ae60' },
    { id: 'whatsapp_299', label: '\uD83D\uDC8E WA $299', color: '#0ea5e9', border: '#0ea5e9' },
    { id: 'hibridos', label: '\uD83D\uDFE3 H\u00EDbridos', color: '#8b5cf6', border: '#8b5cf6', children: ['hibridos_presencial', 'hibridos_enlinea'] },
    { id: 'trinidad', label: '\uD83D\uDFE1 Trinidad', color: '#f59e0b', border: '#f59e0b', children: ['trinidad_presencial', 'trinidad_enlinea'] },
    { id: 'telegram', label: '\u2708\uFE0F Telegram', color: '#0088cc', border: '#0088cc' },
    { id: 'none', label: _t('sr_no_group','Sin Grupo'), color: '#64748b', border: '#94a3b8' }
  ];
  var html = '';
  groups.forEach(function(g) {
    var active = g.id === _srFilterGroup;
    var bg = active ? g.color : 'transparent';
    var textColor = active ? '#fff' : g.color;
    html += '<button class="sr-filter-btn' + (active ? ' active' : '') + '" data-sr-group="' + g.id + '" ' +
      'onclick="srFilterGroup(\'' + g.id + '\')" ' +
      'style="background:' + bg + ';color:' + textColor + ';border-color:' + g.border + ';">' + g.label + '</button>';
    // Sub-group buttons for parent groups
    if (g.children && (active || _srFilterGroup === g.children[0] || _srFilterGroup === g.children[1])) {
      g.children.forEach(function(cid) {
        var cDef = STUDENT_GROUP_DEFS.find(function(d) { return d.id === cid; });
        if (!cDef) return;
        var cActive = _srFilterGroup === cid;
        var cLabel = cid.indexOf('presencial') !== -1 ? _t('sr_presencial','Presencial') : _t('sr_online','En L\u00EDnea');
        html += '<button class="sr-sub-btn' + (cActive ? ' active' : '') + '" data-sr-group="' + cid + '" ' +
          'onclick="srFilterGroup(\'' + cid + '\')" ' +
          'style="background:' + (cActive ? cDef.color : 'transparent') + ';color:' + (cActive ? '#fff' : cDef.color) + ';border-color:' + cDef.color + ';">' + cLabel + '</button>';
      });
    }
  });
  el.innerHTML = html;
}

/* ── Data Loading ─────────────────────────────────────────────── */
async function loadStudentRoster() {
  if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { console.warn('[StudentRoster] Unauthorized access attempt'); return; }
  _srInit();
  _srBuildShell();
  if (_srLoading) return;
  _srLoading = true;
  var listEl = document.getElementById('sr-student-list');
  if (listEl) listEl.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:40px;">' + _t('sr_loading') + '</div>';

  if (!supabaseClient) { _srLoading = false; if (listEl) listEl.innerHTML = '<div style="text-align:center;color:#ef4444;padding:40px;">' + _t('sr_db_unavail') + '</div>'; return; }
  try {
    // 1. Users
    var usrRes = await usersDataAdmin('admin_list', { fields: ['email','nombre','telefono','ciudad','estado'], limit: 5000 });
    if (usrRes.error) throw new Error('Users query failed: ' + (usrRes.error.message || usrRes.error));
    var users = (usrRes.data || []);

    // 2. Memberships (including student_status)
    var mbRes = await supabaseClient.from('memberships').select('*');
    if (mbRes.error) throw new Error('Memberships query failed: ' + (mbRes.error.message || mbRes.error));
    var memberships = (mbRes.data || []);

    // 3. Student groups
    var groups = getStudentGroups();

    // Build unified map
    var map = {};

    users.forEach(function(u) {
      var em = (u.email || '').toLowerCase().trim();
      if (!em) return;
      map[em] = {
        email: em,
        nombre: u.nombre || '',
        telefono: u.telefono || '',
        ciudad: u.ciudad || '',
        estado: u.estado || '',
        activa: null,
        plan_name: '',
        tipo: '',
        amount: 0,
        student_status: null,
        groups: [],
        membership_row: null
      };
    });

    memberships.forEach(function(m) {
      var em = (m.user_email || m.email || '').toLowerCase().trim();
      if (!em) return;
      if (!map[em]) {
        map[em] = { email: em, nombre: '', telefono: '', groups: [] };
      }
      // FIX (Mario 2026-07-28): un estudiante puede tener VARIAS membresías (una vieja
      // desactivada + la real activa). Antes "la última fila ganaba" → si la vieja (activa=false)
      // se procesaba al final, marcaba "bloqueado" a quien SÍ paga. Ahora una fila inactiva NO
      // sobreescribe una membresía ya activa (la activa gana + conserva sus detalles).
      if (map[em].activa === true && m.activa !== true) {
        // ya es activo por otra fila → ignorar esta fila vieja inactiva
      } else {
        map[em].activa = m.activa;
        map[em].plan_name = m.plan_name || '';
        map[em].tipo = m.tipo || '';
        map[em].amount = m.amount || 0;
        map[em].student_status = m.student_status || null;
        map[em].membership_row = m;
      }
    });

    groups.forEach(function(s) {
      var em = (s.email || '').toLowerCase().trim();
      if (!em) return;
      if (!map[em]) {
        map[em] = { email: em, nombre: s.name || '', telefono: '', activa: null, plan_name: '', tipo: '', amount: 0, student_status: null, membership_row: null };
      }
      map[em].groups = s.groups || [];
      if (!map[em].nombre && s.name) map[em].nombre = s.name;
    });

    // Derive display status
    _srData = Object.values(map).map(function(s) {
      s.status = _srDeriveStatus(s);
      return s;
    });

    // Sort: activo first, then nuevo, regreso, dropout, bloqueado, outsider last
    var order = { activo: 0, nuevo: 1, regreso: 2, dropout: 3, bloqueado: 4, sin_membresia: 5, outsider: 6, pendiente: 7 };
    _srData.sort(function(a, b) { return (order[a.status] || 9) - (order[b.status] || 9) || (a.nombre || a.email).localeCompare(b.nombre || b.email); });

    _srSelected.clear();
    _srRenderStats();
    srRenderList();
  } catch (err) {
    console.error('Student roster load error:', err);
    if (listEl) listEl.innerHTML = '<div style="text-align:center;color:#ef4444;padding:40px;">' + _t('sr_error_loading','Error cargando datos: ') + _srEsc(err.message || String(err)) + '</div>';
  } finally {
    _srLoading = false;
  }
}

function _srDeriveStatus(s) {
  var hasGroups = s.groups && s.groups.length > 0;
  // 1. Explicit student_status takes priority
  if (s.student_status === 'nuevo' || s.student_status === 'dropout' || s.student_status === 'regreso') return s.student_status;
  // 2. Membership active/blocked
  if (s.activa === true) return 'activo';
  if (s.activa === false) return 'bloqueado';
  // 3. Has groups but no membership
  if (hasGroups) return 'sin_membresia';
  // 4. No groups = Outsider (bajaron la app pero no están en ningún grupo)
  return 'outsider';
}

/* ── Stats ────────────────────────────────────────────────────── */
function _srRenderStats() {
  var counts = { activo: 0, nuevo: 0, regreso: 0, dropout: 0, bloqueado: 0, outsider: 0, sin_membresia: 0, total: 0, engrupo: 0 };
  _srData.forEach(function(s) {
    if (counts[s.status] !== undefined) counts[s.status]++;
    if (s.groups && s.groups.length > 0) counts.engrupo++;
    counts.total++;
  });
  _srSafeText('sr-stat-activo', counts.activo);
  _srSafeText('sr-stat-nuevo', counts.nuevo);
  _srSafeText('sr-stat-regreso', counts.regreso);
  _srSafeText('sr-stat-dropout', counts.dropout);
  _srSafeText('sr-stat-bloqueado', counts.bloqueado);
  _srSafeText('sr-stat-outsider', counts.outsider);
  _srSafeText('sr-stat-total', counts.total);
  _srSafeText('sr-stat-engrupo', counts.engrupo);
}

function _srSafeText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── Filtering ────────────────────────────────────────────────── */
function srFilterStatus(status) {
  _srFilterStatus = status;
  _srBuildStatusFilters();
  srRenderList();
}

function srFilterGroup(groupId) {
  _srFilterGroup = groupId;
  _srBuildGroupFilters();
  srRenderList();
}

function srSearchInput(val) {
  _srSearch = (val || '').toLowerCase().trim();
  srRenderList();
}

function _srFiltered() {
  return _srData.filter(function(s) {
    // Status filter
    if (_srFilterStatus !== 'all' && s.status !== _srFilterStatus) return false;
    // Group filter
    if (_srFilterGroup !== 'all') {
      if (_srFilterGroup === 'none') {
        if (s.groups && s.groups.length > 0) return false;
      } else {
        var matchIds = getGroupAndChildren(_srFilterGroup);
        if (matchIds) {
          var hasMatch = false;
          for (var i = 0; i < matchIds.length; i++) {
            if (s.groups && s.groups.indexOf(matchIds[i]) !== -1) { hasMatch = true; break; }
          }
          if (!hasMatch) return false;
        }
      }
    }
    // Search
    if (_srSearch) {
      var hay = ((s.nombre || '') + ' ' + s.email + ' ' + (s.telefono || '') + ' ' + (s.ciudad || '') + ' ' + (s.estado || '')).toLowerCase();
      if (hay.indexOf(_srSearch) === -1) return false;
    }
    return true;
  });
}

/* ── Render List ──────────────────────────────────────────────── */
function srRenderList() {
  _srDisplayedCount = _srPageSize; // reset pagination on filter/search change
  _srRenderPage();
}

function _srRenderPage() {
  var list = _srFiltered();
  var el = document.getElementById('sr-student-list');
  if (!el) return;

  if (list.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:#64748b;padding:40px;">' + _t('sr_no_students') + '</div>';
    _srUpdateBulkBar();
    return;
  }

  var visible = list.slice(0, _srDisplayedCount);
  var hasMore = list.length > _srDisplayedCount;

  var html = '<div style="padding:8px 16px;color:#94a3b8;font-size:11px;border-bottom:1px solid #e2e8f0;">' + list.length + _t('sr_students',' estudiantes') + (hasMore ? _t('sros_showing_prefix',' (mostrando ') + visible.length + _t('sros_showing_suffix',')') : '') + '</div>';
  visible.forEach(function(s) {
    var checked = _srSelected.has(s.email) ? ' checked' : '';
    var statusBadge = _srStatusBadge(s.status);
    var groupBadges = _srGroupBadges(s.groups);
    var planInfo = s.plan_name ? '<span style="color:#94a3b8;font-size:11px;">' + _srEsc(s.plan_name) + (s.amount ? ' \u00B7 $' + s.amount : '') + '</span>' : '';

    html += '<div class="sr-row" data-email="' + _srEsc(s.email) + '">' +
      '<label class="sr-check"><input type="checkbox" onchange="srToggleSelect(\'' + _srEsc(s.email) + '\', this.checked)"' + checked + '></label>' +
      '<div class="sr-info">' +
        '<div class="sr-name">' + _srEsc(s.nombre || s.email) + '</div>' +
        '<div class="sr-email">' + _srEsc(s.email) + (s.telefono ? ' \u00B7 ' + _srEsc(s.telefono) : '') + (s.ciudad || s.estado ? ' \u00B7 \uD83D\uDCCD' + _srEsc((s.ciudad || '') + (s.ciudad && s.estado ? ', ' : '') + (s.estado || '')) : '') + '</div>' +
        '<div style="margin-top:3px;">' + statusBadge + ' ' + groupBadges + ' ' + planInfo + '</div>' +
      '</div>' +
      '<div class="sr-actions">' +
        '<button onclick="srShowStatusMenu(\'' + _srEsc(s.email) + '\')" title="' + _t('sr_change_status','Cambiar Status') + '" class="sr-btn" style="background:rgba(139,92,246,0.1);">\uD83C\uDFF7\uFE0F</button>' +
        '<button onclick="srAssignGroup(\'' + _srEsc(s.email) + '\')" title="' + _t('sr_assign_group','Asignar Grupo') + '" class="sr-btn" style="background:rgba(59,130,246,0.1);">\uD83D\uDC65</button>' +
        (s.telefono ? '<button onclick="srWhatsApp(\'' + _srEsc(s.telefono) + '\',\'' + _srEsc(s.nombre || '') + '\')" title="WhatsApp" class="sr-btn" style="background:rgba(37,211,102,0.1);">\uD83D\uDCAC</button>' : '') +
      '</div>' +
    '</div>';
  });

  if (hasMore) {
    html += '<div style="text-align:center;padding:14px;"><button onclick="srLoadMore()" style="background:#3b82f6;color:#fff;border:none;padding:10px 28px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">' + _t('sros_load_more_btn','Cargar m\u00E1s (') + (list.length - _srDisplayedCount) + _t('sros_load_more_suffix',' restantes)') + '</button></div>';
  }

  el.innerHTML = html;
  _srUpdateBulkBar();
}

function srLoadMore() {
  _srDisplayedCount += _srPageSize;
  _srRenderPage();
}

function _srStatusBadge(status) {
  var def = SR_STATUS_DEFS[status];
  if (!def) return '';
  return '<span class="sr-badge" style="background:' + def.bg + ';color:' + def.color + ';">' + def.emoji + ' ' + def.label + '</span>';
}

function _srGroupBadges(groups) {
  if (!groups || groups.length === 0) return '';
  return groups.map(function(gid) {
    var def = STUDENT_GROUP_DEFS.find(function(d) { return d.id === gid; });
    if (!def) return '';
    return '<span style="background:' + def.bg + ';color:' + def.color + ';border:1px solid ' + def.border + ';padding:1px 6px;border-radius:10px;font-size:10px;display:inline-block;margin-right:3px;">' + def.emoji + ' ' + def.name + '</span>';
  }).join('');
}

function _srEsc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── Selection ────────────────────────────────────────────────── */
function srToggleSelect(email, checked) {
  if (checked) _srSelected.add(email);
  else _srSelected.delete(email);
  _srUpdateBulkBar();
}

function srSelectAll() {
  _srFiltered().forEach(function(s) { _srSelected.add(s.email); });
  srRenderList();
}

function srDeselectAll() {
  _srSelected.clear();
  srRenderList();
}

function _srUpdateBulkBar() {
  var bar = document.getElementById('sr-bulk-bar');
  var countEl = document.getElementById('sr-bulk-count');
  if (!bar) return;
  if (_srSelected.size > 0) {
    bar.style.display = 'flex';
    if (countEl) countEl.textContent = _srSelected.size + _t('sr_selected',' seleccionados');
  } else {
    bar.style.display = 'none';
  }
}

/* ── Set Student Status ───────────────────────────────────────── */
async function srSetStudentStatus(email, status) {
  if (!supabaseClient) { alert(_t('sr_db_unavail')); return; }
  try {
    // Upsert student_status in memberships + set activa accordingly
    var activa = (status === 'activo' || status === 'nuevo' || status === 'regreso') ? true : (status === 'bloqueado' ? false : null);
    var upsertData = {
      user_email: email,
      email: email,
      student_status: status
    };
    if (activa !== null) upsertData.activa = activa;
    // If activating, check if amount is missing and set default $100 (most common plan)
    if (activa === true) {
      var { data: existing } = await supabaseClient.from('memberships').select('amount').eq('email', email).limit(1);
      if (!existing || existing.length === 0 || !existing[0].amount || existing[0].amount === 0) {
        upsertData.amount = 100;
      }
    }
    await supabaseClient.from('memberships').upsert(upsertData, { onConflict: 'email' });

    // ── Sync CRM groups: add/remove "bloqueado" ──
    if (status === 'bloqueado' || status === 'activo' || status === 'nuevo' || status === 'regreso') {
      try {
        var allGroups = getStudentGroups();
        var studentEntry = allGroups.find(function(s) { return s.email && s.email.toLowerCase() === email.toLowerCase(); });
        if (status === 'bloqueado') {
          if (studentEntry) {
            if (studentEntry.groups.indexOf('bloqueado') === -1) studentEntry.groups.push('bloqueado');
          } else {
            var st = _srData.find(function(s) { return s.email === email; });
            allGroups.push({ email: email, name: st ? st.nombre : '', groups: ['bloqueado'] });
          }
        } else {
          // Activating — remove "bloqueado" from groups
          if (studentEntry && studentEntry.groups) {
            var idx = studentEntry.groups.indexOf('bloqueado');
            if (idx !== -1) studentEntry.groups.splice(idx, 1);
          }
        }
        saveStudentGroups(allGroups);
      } catch(e) { console.warn('[StudentRoster] CRM group sync error:', e); }
    }

    // Update local data
    var student = _srData.find(function(s) { return s.email === email; });
    if (student) {
      student.student_status = status;
      if (activa !== null) student.activa = activa;
      student.status = _srDeriveStatus(student);
    }
    _srRenderStats();
    srRenderList();
  } catch (err) {
    alert(_t('sr_status_error') + (err.message || err));
  }
}

/* ── Status Menu (per-student) ────────────────────────────────── */
function srShowStatusMenu(email) {
  var student = _srData.find(function(s) { return s.email === email; });
  if (!student) return;

  var statuses = ['activo', 'nuevo', 'regreso', 'dropout', 'bloqueado'];
  var html = '<div style="padding:20px;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;font-size:16px;">' + _t('sros_change_status_heading','\uD83C\uDFF7\uFE0F Cambiar Status \u2014 ') + _srEsc(student.nombre || email) + '</h3>' +
    '<div style="display:flex;flex-direction:column;gap:8px;">';
  statuses.forEach(function(st) {
    var def = SR_STATUS_DEFS[st];
    var isCurrent = student.status === st;
    html += '<button onclick="srSetStudentStatus(\'' + _srEsc(email) + '\',\'' + st + '\');_srCloseModal();" ' +
      'style="padding:12px;border-radius:8px;border:1px solid ' + def.color + ';background:' + (isCurrent ? def.bg : '#fff') + ';color:' + def.color + ';cursor:pointer;text-align:left;font-size:14px;font-weight:' + (isCurrent ? 'bold' : 'normal') + ';">' +
      def.emoji + ' ' + def.label + (isCurrent ? _t('sr_current',' (actual)') : '') + '</button>';
  });
  html += '</div>' +
    '<button onclick="_srCloseModal()" style="margin-top:15px;width:100%;padding:10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#64748b;cursor:pointer;">' + _t('sr_cancel','Cancelar') + '</button>' +
    '</div>';

  _srShowModal(html);
}

/* ── Assign Group (per-student) ───────────────────────────────── */
function srAssignGroup(email) {
  var student = _srData.find(function(s) { return s.email === email; });
  if (!student) return;
  var currentGroups = student.groups || [];

  var html = '<div style="padding:20px;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;font-size:16px;">' + _t('sros_assign_groups_heading','\uD83D\uDC65 Asignar Grupos \u2014 ') + _srEsc(student.nombre || email) + '</h3>';

  STUDENT_GROUP_DEFS.forEach(function(g) {
    var isIn = currentGroups.indexOf(g.id) !== -1;
    var indent = g.parent ? 'margin-left:20px;' : '';
    html += '<label style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;border:1px solid ' + (isIn ? g.color : '#e2e8f0') + ';background:' + (isIn ? g.bg : '#fff') + ';margin-bottom:6px;' + indent + '">' +
      '<input type="checkbox" id="sr-grp-' + g.id + '" ' + (isIn ? 'checked' : '') + ' style="width:16px;height:16px;">' +
      '<span style="color:' + g.color + ';font-weight:600;">' + g.emoji + ' ' + g.name + '</span>' +
      '<span style="color:#94a3b8;font-size:11px;margin-left:auto;">' + g.desc + '</span>' +
    '</label>';
  });

  html += '<div style="display:flex;gap:8px;margin-top:15px;">' +
    '<button onclick="_srSaveGroups(\'' + _srEsc(email) + '\')" style="flex:1;padding:10px;border-radius:8px;border:none;background:#3b82f6;color:#fff;cursor:pointer;font-weight:bold;">' + _t('sr_save','Guardar') + '</button>' +
    '<button onclick="_srCloseModal()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#64748b;cursor:pointer;">' + _t('sr_cancel','Cancelar') + '</button>' +
    '</div></div>';

  _srShowModal(html);
}

function _srSaveGroups(email) {
  var newGroups = [];
  STUDENT_GROUP_DEFS.forEach(function(g) {
    var cb = document.getElementById('sr-grp-' + g.id);
    if (cb && cb.checked) newGroups.push(g.id);
  });

  // Update student groups in localStorage + Supabase
  var allStudentGroups = getStudentGroups();
  var found = false;
  allStudentGroups.forEach(function(s) {
    if (s.email.toLowerCase() === email.toLowerCase()) {
      s.groups = newGroups;
      found = true;
    }
  });
  if (!found) {
    var student = _srData.find(function(s) { return s.email === email; });
    allStudentGroups.push({ email: email, name: student ? student.nombre : '', groups: newGroups });
  }
  saveStudentGroups(allStudentGroups);

  // Update local data
  var student = _srData.find(function(s) { return s.email === email; });
  if (student) {
    student.groups = newGroups;
    student.status = _srDeriveStatus(student);
  }

  _srCloseModal();
  _srRenderStats();
  srRenderList();
}

/* ── Bulk Actions ─────────────────────────────────────────────── */
async function srBulkSetStatus(status) {
  if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert(_t('sros_access_denied','Acceso denegado')); return; }
  if (_srSelected.size === 0) return;
  // Safety limit
  var BULK_LIMIT = 200;
  if (_srSelected.size > BULK_LIMIT) {
    alert(_t('sros_safety_limit','Limite de seguridad: maximo ') + BULK_LIMIT + _t('sros_safety_limit_suffix',' estudiantes por operacion masiva.'));
    return;
  }
  if (!confirm(_t('sr_confirm_bulk') + status + _t('sr_confirm_bulk2') + _srSelected.size + _t('sr_confirm_bulk3'))) return;

  var emails = Array.from(_srSelected);
  var errors = [];
  for (var i = 0; i < emails.length; i++) {
    try {
      await srSetStudentStatus(emails[i], status);
    } catch (err) {
      console.error('[StudentRoster] Bulk status error for ' + emails[i] + ':', err);
      errors.push(emails[i]);
    }
  }
  if (errors.length > 0) {
    alert(_t('sros_bulk_err_prefix','Error actualizando ') + errors.length + _t('sros_bulk_err_of',' de ') + emails.length + _t('sros_bulk_err_suffix',' estudiantes. Revisa la consola para detalles.'));
  }
  if (typeof auditLog === 'function') auditLog('student.bulk_status_change', { status: status, count: emails.length, errors: errors.length });
  _srSelected.clear();
  _srRenderStats();
  srRenderList();
}

function srBulkChangeStatus() {
  if (_srSelected.size === 0) return;
  var statuses = ['activo', 'nuevo', 'regreso', 'dropout', 'bloqueado'];
  var html = '<div style="padding:20px;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;font-size:16px;">' + _t('sros_bulk_status_heading','\uD83C\uDFF7\uFE0F Cambiar Status Masivo (') + _srSelected.size + _t('sros_bulk_count_suffix',' estudiantes)') + '</h3>' +
    '<div style="display:flex;flex-direction:column;gap:8px;">';
  statuses.forEach(function(st) {
    var def = SR_STATUS_DEFS[st];
    html += '<button onclick="srBulkSetStatus(\'' + st + '\');_srCloseModal();" ' +
      'style="padding:12px;border-radius:8px;border:1px solid ' + def.color + ';background:#fff;color:' + def.color + ';cursor:pointer;text-align:left;font-size:14px;">' +
      def.emoji + ' ' + def.label + '</button>';
  });
  html += '</div>' +
    '<button onclick="_srCloseModal()" style="margin-top:15px;width:100%;padding:10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#64748b;cursor:pointer;">' + _t('sr_cancel','Cancelar') + '</button>' +
    '</div>';
  _srShowModal(html);
}

function srBulkAssignGroup() {
  if (_srSelected.size === 0) return;

  var html = '<div style="padding:20px;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;font-size:16px;">' + _t('sros_bulk_group_heading','\uD83D\uDC65 Asignar Grupo Masivo (') + _srSelected.size + _t('sros_bulk_count_suffix',' estudiantes)') + '</h3>';

  STUDENT_GROUP_DEFS.forEach(function(g) {
    var indent = g.parent ? 'margin-left:20px;' : '';
    html += '<label style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;border:1px solid #e2e8f0;background:#fff;margin-bottom:6px;' + indent + '">' +
      '<input type="checkbox" id="sr-bulk-grp-' + g.id + '" style="width:16px;height:16px;">' +
      '<span style="color:' + g.color + ';font-weight:600;">' + g.emoji + ' ' + g.name + '</span>' +
    '</label>';
  });

  html += '<div style="display:flex;gap:8px;margin-top:15px;">' +
    '<button onclick="_srBulkSaveGroups()" style="flex:1;padding:10px;border-radius:8px;border:none;background:#3b82f6;color:#fff;cursor:pointer;font-weight:bold;">' + _t('sr_assign','Asignar') + '</button>' +
    '<button onclick="_srCloseModal()" style="flex:1;padding:10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#64748b;cursor:pointer;">' + _t('sr_cancel','Cancelar') + '</button>' +
    '</div></div>';

  _srShowModal(html);
}

function _srBulkSaveGroups() {
  var selectedGroupIds = [];
  STUDENT_GROUP_DEFS.forEach(function(g) {
    var cb = document.getElementById('sr-bulk-grp-' + g.id);
    if (cb && cb.checked) selectedGroupIds.push(g.id);
  });

  if (selectedGroupIds.length === 0) {
    alert(_t('sr_select_group'));
    return;
  }

  var allStudentGroups = getStudentGroups();
  var emails = Array.from(_srSelected);

  emails.forEach(function(email) {
    var found = false;
    allStudentGroups.forEach(function(s) {
      if (s.email.toLowerCase() === email.toLowerCase()) {
        // Add groups (union, no duplicates)
        selectedGroupIds.forEach(function(gid) {
          if (s.groups.indexOf(gid) === -1) s.groups.push(gid);
        });
        found = true;
      }
    });
    if (!found) {
      var student = _srData.find(function(st) { return st.email === email; });
      allStudentGroups.push({ email: email, name: student ? student.nombre : '', groups: selectedGroupIds.slice() });
    }

    // Update local _srData
    var student = _srData.find(function(st) { return st.email === email; });
    if (student) {
      selectedGroupIds.forEach(function(gid) {
        if (!student.groups) student.groups = [];
        if (student.groups.indexOf(gid) === -1) student.groups.push(gid);
      });
      student.status = _srDeriveStatus(student);
    }
  });

  saveStudentGroups(allStudentGroups);
  _srCloseModal();
  _srSelected.clear();
  _srRenderStats();
  srRenderList();
}

/* ── WhatsApp ─────────────────────────────────────────────────── */
function srWhatsApp(phone, name) {
  var clean = (phone || '').replace(/[^0-9]/g, '');
  if (!clean) return;
  var msg = 'Hola' + (name ? ' ' + name : '') + ', te contacto desde Maestro HVACR.';
  window.open('https://wa.me/' + clean + '?text=' + encodeURIComponent(msg), '_blank');
}

/* ── Export CSV ───────────────────────────────────────────────── */
function srExportCSV() {
  if (typeof isAdminAuthenticated === 'function' && !isAdminAuthenticated()) { alert(_t('sros_access_denied','Acceso denegado')); return; }
  var list = _srFiltered();
  if (list.length === 0) { alert(_t('sr_no_export')); return; }
  if (typeof auditLog === 'function') auditLog('data.export_csv', { type: 'student_roster', count: list.length });

  var rows = [['Nombre', 'Email', 'Tel\u00E9fono', 'Status', 'Grupos', 'Plan', 'Monto']];
  list.forEach(function(s) {
    var groupNames = (s.groups || []).map(function(gid) {
      var def = STUDENT_GROUP_DEFS.find(function(d) { return d.id === gid; });
      return def ? def.name : gid;
    }).join(', ');
    rows.push([
      s.nombre || '', s.email, s.telefono || '', s.status || '',
      groupNames, s.plan_name || '', s.amount || 0
    ]);
  });

  var csv = rows.map(function(r) {
    return r.map(function(cell) {
      var val = String(cell).replace(/"/g, '""');
      // Prevent CSV injection: prefix formula-triggering characters with a single quote
      if (/^[=+\-@\t\r]/.test(val)) val = "'" + val;
      return '"' + val + '"';
    }).join(',');
  }).join('\n');

  var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'estudiantes_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Modal helpers ────────────────────────────────────────────── */
function _srShowModal(innerHtml) {
  var modal = document.getElementById('sr-modal');
  var body = document.getElementById('sr-modal-body');
  if (!modal || !body) return;
  body.innerHTML = innerHtml;
  modal.style.display = 'flex';
  modal.onclick = function(e) { if (e.target === modal) _srCloseModal(); };
}

function _srCloseModal() {
  var modal = document.getElementById('sr-modal');
  if (modal) modal.style.display = 'none';
}
