if (typeof _addTranslations === 'function') _addTranslations({
  zr_total_assigned: { es: ' estudiantes asignados', en: ' students assigned' },
  zr_group_mgmt: { es: 'Gestión de Grupos de Estudiantes', en: 'Student Group Management' },
  zr_add_student: { es: 'Agregar Estudiante', en: 'Add Student' },
  zr_name_ph: { es: 'Nombre', en: 'Name' },
  zr_email_ph: { es: 'Email', en: 'Email' },
  zr_bulk_import: { es: 'Importación Masiva', en: 'Bulk Import' },
  zr_import_active: { es: 'Importar al Grupo Activo', en: 'Import to Active Group' },
  zr_import_supa: { es: 'Importar desde Supabase', en: 'Import from Supabase' },
  zr_search_name: { es: 'Buscar por nombre...', en: 'Search by name...' },
  zr_search_btn: { es: 'Buscar', en: 'Search' },
  zr_search_in_group: { es: 'Buscar estudiante en grupo...', en: 'Search student in group...' },
  zr_no_students: { es: 'No hay estudiantes en este grupo', en: 'No students in this group' },
  zr_name_email_req: { es: 'Nombre y email son requeridos', en: 'Name and email are required' },
  zr_paste_list: { es: 'Pega una lista de estudiantes', en: 'Paste a student list' },
  zr_imported: { es: ' importados', en: ' imported' },
  zr_type_2: { es: 'Escribe al menos 2 letras para buscar', en: 'Type at least 2 characters to search' },
  zr_db_unavail: { es: 'Base de datos no disponible', en: 'Database not available' },
  zr_searching: { es: 'Buscando...', en: 'Searching...' },
  zr_not_found: { es: 'No se encontraron estudiantes con "', en: 'No students found with "' },
  zr_already_in: { es: 'Ya en grupo', en: 'Already in group' },
  zr_add: { es: 'Agregar', en: 'Add' },
  zr_verify_enter: { es: 'Por favor ingresa tu nombre y email', en: 'Please enter your name and email' },
  zr_no_access: { es: 'No tienes acceso a las clases. Contacta a Maestro Mario para obtener acceso.', en: 'You do not have access to classes. Contact Maestro Mario for access.' },
});

// ==================== ZOOM RECORDINGS SYSTEM ====================

// --- Data helpers ---
// === ZOOM RECORDINGS: Supabase + localStorage sync ===
var _zoomRecsCache = null;
var _zoomVerifiedCache = null;

function getZoomRecs() { 
  try { return JSON.parse(localStorage.getItem('maestroac_zoom_recs') || '[]'); } catch(e) { return []; } 
}
function saveZoomRecs(r) { 
  localStorage.setItem('maestroac_zoom_recs', JSON.stringify(r)); 
  // Sync to Supabase
  syncZoomRecsToSupabase(r);
}

function getZoomVerified() { 
  try { return JSON.parse(localStorage.getItem('maestroac_zoom_verified') || '[]'); } catch(e) { return []; } 
}
function saveZoomVerified(v) {
  localStorage.setItem('maestroac_zoom_verified', JSON.stringify(v));
  // Sync to Supabase
  syncZoomVerifiedToSupabase(v);
}

// === STUDENT GROUPS SYSTEM ===
var STUDENT_GROUP_DEFS = [
  { id: 'hibridos', name: 'Híbridos', emoji: '🟣', color: '#8b5cf6', bg: '#f5f3ff', border: '#c4b5fd', desc: 'Martes/Miércoles presenciales', parent: null },
  { id: 'hibridos_presencial', name: 'Híbridos Presencial', emoji: '🟣', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', desc: 'Híbridos — modalidad presencial', parent: 'hibridos' },
  { id: 'hibridos_enlinea', name: 'Híbridos En Línea', emoji: '🟣', color: '#a78bfa', bg: '#f5f3ff', border: '#c4b5fd', desc: 'Híbridos — modalidad en línea', parent: 'hibridos' },
  { id: 'whatsapp_99', name: 'WhatsApp $99', emoji: '💚', color: '#27ae60', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Membresía $99/mes', parent: null },
  { id: 'trinidad', name: 'Trinidad del Oficio', emoji: '🟡', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', desc: 'Presenciales Trinidad', parent: null },
  { id: 'trinidad_presencial', name: 'Trinidad Presencial', emoji: '🟡', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Trinidad — modalidad presencial', parent: 'trinidad' },
  { id: 'trinidad_enlinea', name: 'Trinidad En Línea', emoji: '🟡', color: '#fbbf24', bg: '#fffbeb', border: '#fde68a', desc: 'Trinidad — modalidad en línea', parent: 'trinidad' },
  { id: 'whatsapp_299', name: 'WhatsApp $299', emoji: '💎', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', desc: 'Premium $299/mes', parent: null },
  { id: 'telegram', name: 'Telegram', emoji: '✈️', color: '#0088cc', bg: '#f0f9ff', border: '#90cdf4', desc: 'Grupo de Telegram', parent: null },
  // ── Tier groups (auto-assigned by Stripe webhook) ──
  { id: 'trial_14', name: 'Trial 14 Días', emoji: '🎁', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', desc: 'Prueba gratuita 14 días', parent: null },
  { id: 'membresia_119', name: 'Membresía $119', emoji: '💚', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', desc: 'AC y Refrigeración — Mar/Mié', parent: null },
  { id: 'membresia_299', name: 'Membresía $299', emoji: '💎', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', desc: 'Premium Completo — Incluye Sáb/Dom', parent: null },
  { id: 'bloqueado', name: 'Bloqueado', emoji: '🚫', color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', desc: 'Sin acceso — Pago requerido', parent: null }
];

function getGroupAndChildren(groupId) {
  if (groupId === 'all') return null;
  var ids = [groupId];
  STUDENT_GROUP_DEFS.forEach(function(g) {
    if (g.parent === groupId) ids.push(g.id);
  });
  return ids;
}

function getStudentGroups() {
  try { return JSON.parse(localStorage.getItem('maestroac_student_groups') || '[]'); } catch(e) { return []; }
}

function saveStudentGroups(groups) {
  localStorage.setItem('maestroac_student_groups', JSON.stringify(groups));
  syncStudentGroupsToSupabase(groups);
}

function getStudentGroupsForEmail(email) {
  if (!email) return [];
  var allStudents = getStudentGroups();
  var lowerEmail = email.toLowerCase();
  var student = allStudents.find(function(s) { return s.email.toLowerCase() === lowerEmail; });
  return student ? (student.groups || []) : [];
}

async function syncStudentGroupsToSupabase(groups) {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  try {
    await supabaseClient.from('zoom_recordings').upsert({
      id: 'student_groups',
      data: JSON.stringify(groups),
      updated_at: new Date().toISOString()
    });
  } catch(e) { console.warn('Student groups sync failed:', e); }
}

function updateAdminGroupCounts() {
  var allStudents = getStudentGroups();
  STUDENT_GROUP_DEFS.forEach(function(g) {
    var count = allStudents.filter(function(s) { return s.groups && s.groups.indexOf(g.id) !== -1; }).length;
    var el = document.getElementById('sgCount_' + g.id);
    if (el) el.textContent = count;
  });
  var totalEl = document.getElementById('sgTotalCount');
  if (totalEl) totalEl.textContent = _t('zrec_total_prefix') + allStudents.length + _t('zr_total_assigned');
}

// --- ADMIN: Student Groups Management Modal ---
var _sgActiveTab = 'hibridos';

function showStudentGroupsModal() {
  var modal = document.createElement('div');
  modal.id = 'studentGroupsModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';

  var allStudents = getStudentGroups();
  var html = '<div style="background:#fff;border-radius:16px;max-width:650px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;"><h3 style="margin:0;color:#1e293b;">' + _t('zrec_group_mgmt_heading') + '</h3><button onclick="document.getElementById(\'studentGroupsModal\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;">✕</button></div>';

  // Tabs
  html += '<div style="display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;">';
  STUDENT_GROUP_DEFS.forEach(function(g) {
    var isActive = g.id === _sgActiveTab;
    var count = allStudents.filter(function(s) { return s.groups && s.groups.indexOf(g.id) !== -1; }).length;
    html += '<button onclick="sgSwitchTab(\'' + g.id + '\')" id="sgTab_' + g.id + '" style="flex:1;min-width:80px;padding:8px 4px;border:2px solid ' + (isActive ? g.color : '#e2e8f0') + ';background:' + (isActive ? g.bg : '#fff') + ';color:' + (isActive ? g.color : '#64748b') + ';border-radius:8px;font-size:10px;font-weight:700;cursor:pointer;text-align:center;">' + g.emoji + ' ' + g.name + ' (' + count + ')</button>';
  });
  html += '</div>';

  // Add individual
  html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px;">';
  html += '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#475569;">' + _t('zrec_add_student_heading') + '</p>';
  html += '<div style="display:flex;gap:6px;">';
  html += '<input id="sgAddName" type="text" placeholder="' + _t('zr_name_ph') + '" style="flex:1;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;">';
  html += '<input id="sgAddEmail" type="email" placeholder="' + _t('zr_email_ph') + '" style="flex:1;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;">';
  html += '<button onclick="sgAddStudent()" style="background:#27ae60;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;cursor:pointer;white-space:nowrap;">➕</button>';
  html += '</div></div>';

  // Bulk import
  html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px;">';
  html += '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#475569;">' + _t('zrec_bulk_import_heading') + '</p>';
  html += '<textarea id="sgBulkText" placeholder="Nombre, Email (uno por línea)&#10;Juan Pérez, juan@email.com&#10;María López, maria@email.com" style="width:100%;height:80px;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:11px;font-family:monospace;resize:vertical;box-sizing:border-box;"></textarea>';
  html += '<div style="display:flex;gap:8px;margin-top:6px;"><button onclick="sgBulkImport()" style="padding:8px 14px;background:#8b5cf6;color:#fff;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">' + _t('zrec_import_active_btn') + '</button><span id="sgBulkResult" style="font-size:11px;color:#64748b;display:flex;align-items:center;"></span></div>';
  html += '</div>';

  // Import from Supabase
  html += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:12px;margin-bottom:10px;">';
  html += '<p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#2D8CFF;">' + _t('zrec_import_supa_heading') + '</p>';
  html += '<div style="display:flex;gap:6px;">';
  html += '<input id="sgSupaSearch" type="text" placeholder="' + _t('zrec_search_name_ph') + '" style="flex:1;padding:8px;border:1px solid #bfdbfe;border-radius:8px;font-size:12px;">';
  html += '<button onclick="sgSearchSupabase()" style="background:#2D8CFF;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;cursor:pointer;white-space:nowrap;">' + _t('zrec_search_btn_icon') + '</button>';
  html += '</div>';
  html += '<div id="sgSupaResults" style="max-height:200px;overflow-y:auto;margin-top:8px;"></div>';
  html += '</div>';

  // Search
  html += '<div style="margin-bottom:8px;"><input id="sgSearchInput" type="text" placeholder="' + _t('zrec_search_in_group_ph') + '" oninput="sgRenderList()" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;"></div>';

  // Student list
  html += '<div id="sgStudentList" style="max-height:300px;overflow-y:auto;"></div>';
  html += '</div>';

  modal.innerHTML = html;
  document.body.appendChild(modal);
  sgRenderList();
}

function sgSwitchTab(groupId) {
  _sgActiveTab = groupId;
  // Update tab styles
  STUDENT_GROUP_DEFS.forEach(function(g) {
    var btn = document.getElementById('sgTab_' + g.id);
    if (!btn) return;
    var isActive = g.id === groupId;
    var count = getStudentGroups().filter(function(s) { return s.groups && s.groups.indexOf(g.id) !== -1; }).length;
    btn.style.border = '2px solid ' + (isActive ? g.color : '#e2e8f0');
    btn.style.background = isActive ? g.bg : '#fff';
    btn.style.color = isActive ? g.color : '#64748b';
    btn.textContent = g.emoji + ' ' + g.name + ' (' + count + ')';
  });
  sgRenderList();
}

function sgRenderList() {
  var container = document.getElementById('sgStudentList');
  if (!container) return;
  var allStudents = getStudentGroups();
  var search = (document.getElementById('sgSearchInput') ? document.getElementById('sgSearchInput').value : '').toLowerCase();
  var groupStudents = allStudents.filter(function(s) {
    if (!s.groups || s.groups.indexOf(_sgActiveTab) === -1) return false;
    if (search) {
      var nm = (s.name || '').toLowerCase();
      var em = (s.email || '').toLowerCase();
      if (nm.indexOf(search) === -1 && em.indexOf(search) === -1) return false;
    }
    return true;
  });
  var gDef = STUDENT_GROUP_DEFS.find(function(g) { return g.id === _sgActiveTab; });

  if (groupStudents.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:12px;">' + _t('zr_no_students','No hay estudiantes en este grupo') + (search ? _t('zrec_with_filter_suffix') : '') + '</div>';
    return;
  }

  var html = '<div style="display:flex;flex-direction:column;gap:4px;">';
  groupStudents.forEach(function(s) {
    // Show all groups this student belongs to
    var badges = '';
    if (s.groups) {
      s.groups.forEach(function(gid) {
        var gd = STUDENT_GROUP_DEFS.find(function(x) { return x.id === gid; });
        if (gd) badges += '<span style="background:' + gd.bg + ';color:' + gd.color + ';border:1px solid ' + gd.border + ';padding:1px 5px;border-radius:4px;font-size:9px;font-weight:600;">' + gd.emoji + '</span> ';
      });
    }
    html += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">';
    html += '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:#1e293b;">' + _escHtml(s.name) + '</div><div style="font-size:10px;color:#94a3b8;">' + _escHtml(s.email) + ' ' + badges + '</div></div>';

    // Move to other group buttons
    var otherGroups = STUDENT_GROUP_DEFS.filter(function(g) { return g.id !== _sgActiveTab && (!s.groups || s.groups.indexOf(g.id) === -1); });
    if (otherGroups.length > 0) {
      html += '<select onchange="sgMoveStudent(\'' + s.email.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\', this.value); this.selectedIndex=0;" style="padding:4px;border:1px solid #e2e8f0;border-radius:6px;font-size:9px;color:#64748b;cursor:pointer;max-width:90px;"><option value="">+Grupo</option>';
      otherGroups.forEach(function(og) {
        html += '<option value="' + og.id + '">' + og.emoji + ' ' + og.name + '</option>';
      });
      html += '</select>';
    }
    html += '<button onclick="sgRemoveStudent(\'' + s.email.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')" style="background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;" title="' + _t('zrec_remove_from_group_tip') + '">✕</button>';
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function sgAddStudent() {
  var name = (document.getElementById('sgAddName').value || '').trim();
  var email = (document.getElementById('sgAddEmail').value || '').trim().toLowerCase();
  if (!name || !email) { alert(_t('zr_name_email_req')); return; }

  var allStudents = getStudentGroups();
  var existing = allStudents.find(function(s) { return s.email.toLowerCase() === email; });
  if (existing) {
    if (!existing.groups) existing.groups = [];
    if (existing.groups.indexOf(_sgActiveTab) === -1) {
      existing.groups.push(_sgActiveTab);
    }
    existing.name = name;
  } else {
    allStudents.push({ name: name, email: email, groups: [_sgActiveTab] });
  }

  saveStudentGroups(allStudents);
  document.getElementById('sgAddName').value = '';
  document.getElementById('sgAddEmail').value = '';
  sgSwitchTab(_sgActiveTab);
  sgRenderList();
  updateAdminGroupCounts();
}

function sgBulkImport() {
  var text = (document.getElementById('sgBulkText').value || '').trim();
  if (!text) { alert(_t('zr_paste_list')); return; }
  var lines = text.split('\n').filter(function(l) { return l.trim(); });
  var allStudents = getStudentGroups();
  var added = 0;

  lines.forEach(function(line) {
    var parts = line.split(',');
    if (parts.length < 2) return;
    var name = parts[0].trim();
    var email = parts[1].trim().toLowerCase();
    if (!name || !email || email.indexOf('@') === -1) return;

    var existing = allStudents.find(function(s) { return s.email.toLowerCase() === email; });
    if (existing) {
      if (!existing.groups) existing.groups = [];
      if (existing.groups.indexOf(_sgActiveTab) === -1) {
        existing.groups.push(_sgActiveTab);
        added++;
      }
    } else {
      allStudents.push({ name: name, email: email, groups: [_sgActiveTab] });
      added++;
    }
  });

  saveStudentGroups(allStudents);
  document.getElementById('sgBulkText').value = '';
  var resultEl = document.getElementById('sgBulkResult');
  if (resultEl) resultEl.textContent = '✅ ' + added + _t('zrec_imported_ok');
  sgSwitchTab(_sgActiveTab);
  sgRenderList();
  updateAdminGroupCounts();
}

function sgRemoveStudent(email) {
  var allStudents = getStudentGroups();
  var student = allStudents.find(function(s) { return s.email.toLowerCase() === email.toLowerCase(); });
  if (!student) return;

  if (student.groups) {
    student.groups = student.groups.filter(function(g) { return g !== _sgActiveTab; });
    // If student has no more groups, remove entirely
    if (student.groups.length === 0) {
      allStudents = allStudents.filter(function(s) { return s.email.toLowerCase() !== email.toLowerCase(); });
    }
  }

  saveStudentGroups(allStudents);
  sgSwitchTab(_sgActiveTab);
  sgRenderList();
  updateAdminGroupCounts();
}

async function sgSearchSupabase() {
  var query = (document.getElementById('sgSupaSearch').value || '').trim().toLowerCase();
  var container = document.getElementById('sgSupaResults');
  if (!container) return;
  if (!query || query.length < 2) { container.innerHTML = '<div style="color:#94a3b8;font-size:11px;padding:8px;">' + _t('zr_type_2','Escribe al menos 2 letras para buscar') + '</div>'; return; }
  if (!supabaseClient) { container.innerHTML = '<div style="color:#ef4444;font-size:11px;padding:8px;">' + _t('zr_db_unavail','Base de datos no disponible') + '</div>'; return; }
  container.innerHTML = '<div style="color:#2D8CFF;font-size:11px;padding:8px;">' + _t('zrec_searching_msg') + '</div>';

  try {
    var _ud_zr = await usersDataAdmin('admin_list', { search: query, fields: ['nombre','email','telefono'], limit: 20 }); var data = _ud_zr.data; var error = _ud_zr.error;
    if (error || !data || data.length === 0) {
      container.innerHTML = '<div style="color:#94a3b8;font-size:11px;padding:8px;">' + _t('zr_not_found','No se encontraron estudiantes con') + ' "' + _escHtml(query) + '"</div>';
      return;
    }
    var allStudents = getStudentGroups();
    var html = '';
    data.forEach(function(t) {
      var alreadyInGroup = allStudents.some(function(s) { return s.email.toLowerCase() === t.email.toLowerCase() && s.groups && s.groups.indexOf(_sgActiveTab) !== -1; });
      var gDef = STUDENT_GROUP_DEFS.find(function(g) { return g.id === _sgActiveTab; });
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:4px;">';
      html += '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:#1e293b;">' + _escHtml(t.nombre || '') + '</div><div style="font-size:10px;color:#94a3b8;">' + _escHtml(t.email || '') + (t.telefono ? ' · ' + _escHtml(t.telefono) : '') + '</div></div>';
      if (alreadyInGroup) {
        html += '<span style="font-size:10px;color:' + gDef.color + ';font-weight:600;">' + _t('zrec_already_in_group') + '</span>';
      } else {
        html += '<button onclick="sgAddFromSupabase(\'' + (t.nombre || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\', \'' + (t.email || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')" style="background:' + gDef.bg + ';border:1px solid ' + gDef.border + ';color:' + gDef.color + ';padding:4px 10px;border-radius:6px;font-size:10px;cursor:pointer;font-weight:700;white-space:nowrap;">' + gDef.emoji + _t('zrec_add_btn') + '</button>';
      }
      html += '</div>';
    });
    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<div style="color:#dc2626;font-size:11px;padding:8px;">Error: ' + _escHtml(e.message) + '</div>';
  }
}

function sgAddFromSupabase(name, email) {
  if (!email) return;
  var allStudents = getStudentGroups();
  var existing = allStudents.find(function(s) { return s.email.toLowerCase() === email.toLowerCase(); });
  if (existing) {
    if (!existing.groups) existing.groups = [];
    if (existing.groups.indexOf(_sgActiveTab) === -1) existing.groups.push(_sgActiveTab);
    existing.name = name;
  } else {
    allStudents.push({ name: name, email: email, groups: [_sgActiveTab] });
  }
  saveStudentGroups(allStudents);
  sgSearchSupabase(); // Re-render search results to show "Ya en grupo"
  sgSwitchTab(_sgActiveTab);
  sgRenderList();
  updateAdminGroupCounts();
}

function sgMoveStudent(email, targetGroup) {
  if (!targetGroup) return;
  var allStudents = getStudentGroups();
  var student = allStudents.find(function(s) { return s.email.toLowerCase() === email.toLowerCase(); });
  if (!student) return;
  if (!student.groups) student.groups = [];
  if (student.groups.indexOf(targetGroup) === -1) {
    student.groups.push(targetGroup);
  }
  saveStudentGroups(allStudents);
  sgSwitchTab(_sgActiveTab);
  sgRenderList();
  updateAdminGroupCounts();
}

// Sync recordings TO Supabase (admin saves)
async function syncZoomRecsToSupabase(recs) {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  try {
    await supabaseClient.from('zoom_recordings').upsert({ 
      id: 'master', 
      data: JSON.stringify(recs), 
      updated_at: new Date().toISOString() 
    });
  } catch(e) { console.warn('Zoom recs sync failed:', e); }
}

// Sync verified list TO Supabase (admin saves)
async function syncZoomVerifiedToSupabase(verified) {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  try {
    await supabaseClient.from('zoom_recordings').upsert({ 
      id: 'verified', 
      data: JSON.stringify(verified), 
      updated_at: new Date().toISOString() 
    });
  } catch(e) { console.warn('Zoom verified sync failed:', e); }
}

// Load recordings FROM Supabase (all devices)
async function loadZoomRecsFromSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  try {
    var { data, error } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'master').single();
    if (data && data.data && !error) {
      var recs = JSON.parse(data.data);
      if (recs.length > 0) {
        var local = getZoomRecs();
        // Use Supabase data if it has more or equal recordings (source of truth)
        if (recs.length >= local.length) {
          localStorage.setItem('maestroac_zoom_recs', JSON.stringify(recs));
          console.log('Zoom recs synced from Supabase:', recs.length, 'recordings');
        }
      }
    }
  } catch(e) { console.warn('Load zoom recs from Supabase failed:', e); }
  
  // Also load verified list
  try {
    var { data: vData, error: vErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'verified').single();
    if (vData && vData.data && !vErr) {
      var verified = JSON.parse(vData.data);
      if (verified.length > 0) {
        var localV = getZoomVerified();
        if (verified.length >= localV.length) {
          localStorage.setItem('maestroac_zoom_verified', JSON.stringify(verified));
          console.log('Zoom verified synced from Supabase:', verified.length, 'technicians');
        }
      }
    }
  } catch(e) { console.warn('Load zoom verified from Supabase failed:', e); }

  // Also load student groups
  try {
    var { data: gData, error: gErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'student_groups').maybeSingle();
    if (!gErr && gData && gData.data) {
      var groups = JSON.parse(gData.data);
      if (Array.isArray(groups) && groups.length > 0) {
        var localG = getStudentGroups();
        if (groups.length >= localG.length) {
          localStorage.setItem('maestroac_student_groups', JSON.stringify(groups));
          console.log('Student groups synced from Supabase:', groups.length, 'entries');
        }
      }
    }
  } catch(e) { /* student groups sync silently fails if row doesn't exist */ }
}

// Auto-load on app start and re-render zoom sections after sync
setTimeout(function() {
  loadZoomRecsFromSupabase().then(function() {
    try { if (typeof renderAdminZoomRecs === 'function') renderAdminZoomRecs(); } catch(e) { console.warn('[ZoomRecordings]', e.message || e); }
    try { if (typeof renderZoomRecordings === 'function') renderZoomRecordings(); } catch(e) { console.warn('[ZoomRecordings]', e.message || e); }
    try { if (typeof updateAdminGroupCounts === 'function') updateAdminGroupCounts(); } catch(e) { console.warn('[ZoomRecordings]', e.message || e); }
  });
}, 2000);

// Reload zoom data fresh from Supabase when entering zoom screens
async function refreshZoomFromSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  try {
    var { data, error } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'master').single();
    if (data && data.data && !error) {
      var recs = JSON.parse(data.data);
      if (recs.length > 0) {
        localStorage.setItem('maestroac_zoom_recs', JSON.stringify(recs));
      }
    }
    var { data: vData, error: vErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'verified').single();
    if (vData && vData.data && !vErr) {
      var verified = JSON.parse(vData.data);
      if (verified.length > 0) {
        localStorage.setItem('maestroac_zoom_verified', JSON.stringify(verified));
      }
    }
    // Also refresh student groups
    var { data: gData, error: gErr } = await supabaseClient.from('zoom_recordings').select('*').eq('id', 'student_groups').maybeSingle();
    if (!gErr && gData && gData.data) {
      var groups = JSON.parse(gData.data);
      if (Array.isArray(groups) && groups.length > 0) {
        localStorage.setItem('maestroac_student_groups', JSON.stringify(groups));
      }
    }
  } catch(e) { console.warn('Refresh zoom from Supabase failed:', e); }
}
function getZoomSession() { try { return JSON.parse(sessionStorage.getItem('zoom_verified_user') || 'null'); } catch(e) { return null; } }
function setZoomSession(u) { sessionStorage.setItem('zoom_verified_user', JSON.stringify(u)); }
function getZoomWatched() { try { return JSON.parse(localStorage.getItem('maestroac_zoom_watched') || '[]'); } catch(e) { return []; } }
function saveZoomWatched(w) { localStorage.setItem('maestroac_zoom_watched', JSON.stringify(w)); }

// --- Verification ---
// Acceso a pregrabadas (Mario 2026-06-25): nombre+email (paga Stripe) O token válido.
async function verifyZoomAccess() {
  var nameEl = document.getElementById('zoomVerifyName');
  var emailEl = document.getElementById('zoomVerifyEmail');
  var tokenEl = document.getElementById('zoomVerifyToken');
  var errDiv = document.getElementById('zoomVerifyError');
  var name = (nameEl && nameEl.value || '').trim();
  var email = (emailEl && emailEl.value || '').trim().toLowerCase();
  var token = (tokenEl && tokenEl.value || '').trim().toUpperCase();

  if (!token && (!name || !email)) {
    errDiv.style.display = 'block'; errDiv.style.color = '#dc2626';
    errDiv.textContent = _t('zr_need_email_or_token', 'Pon tu nombre + email (si pagas), o tu token de acceso.');
    return;
  }
  // Admins siempre pasan
  var isAdmin = (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated());
  if (isAdmin) {
    errDiv.style.display = 'none';
    setZoomSession({ name: name || email || 'Admin', email: email, ts: Date.now(), access: true });
    showZoomRecordings();
    return;
  }

  errDiv.style.display = 'block'; errDiv.style.color = '#64748b';
  errDiv.textContent = _t('zr_checking', 'Verificando tu acceso…');

  var ok = false;
  try {
    var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '');
    var bodyObj = token ? { token: token } : { email: email };
    var r = await fetch(sbUrl + '/functions/v1/school-access-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey },
      body: JSON.stringify(bodyObj)
    });
    var d = await r.json();
    ok = !!(d && d.access);
  } catch (_) { ok = false; }

  if (ok) {
    errDiv.style.display = 'none';
    setZoomSession({ name: name || email || 'Estudiante', email: email, ts: Date.now(), access: true });
    showZoomRecordings();
  } else {
    errDiv.style.display = 'block'; errDiv.style.color = '#dc2626';
    errDiv.textContent = token
      ? _t('zr_bad_token', '❌ Token inválido. Verifícalo o solicita uno con la escuela.')
      : _t('zr_no_sub', '❌ No hallamos suscripción activa con ese email. Usa tu token o solicítalo con la escuela.');
  }
}

// Auto-verify if user is already logged in when entering Zoom screen
function autoVerifyZoomIfLoggedIn() {
  // Admins always pass
  var isAdmin = (typeof isAdminAuthenticated === 'function' && isAdminAuthenticated());
  if (isAdmin) {
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
      var session = getZoomSession();
      if (!session) {
        setZoomSession({ name: currentUser.nombre || currentUser.email, email: currentUser.email, ts: Date.now() });
      }
    }
    showZoomRecordings();
    return true;
  }
  // REVERTIDO 2026-06-26: el candado de Stripe bloqueaba a estudiantes con token (no pagan Stripe).
  // Vuelve a lo de antes: cualquier usuario logueado entra. (Estudiantes desbloqueados.)
  if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
    var session = getZoomSession();
    if (!session) {
      setZoomSession({ name: currentUser.nombre || currentUser.email, email: currentUser.email, ts: Date.now() });
    }
    showZoomRecordings();
    return true;
  }
  return false;
}

// ── Verificación de acceso por Stripe (suscripción activa) — Mario 2026-06-25 ──
async function _zoomCheckStripeAccess() {
  try {
    var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '');
    var tok = sbKey;
    try { var s = await supabaseClient.auth.getSession(); if (s && s.data && s.data.session && s.data.session.access_token) tok = s.data.session.access_token; } catch (_) {}
    var r = await fetch(sbUrl + '/functions/v1/school-access-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + tok },
      body: '{}'
    });
    var d = await r.json();
    return !!(d && d.access);
  } catch (_) { return false; }
}
function _zoomAccessOverlay(html) {
  var ex = document.getElementById('zoomAccessOverlay'); if (ex) ex.remove();
  var d = document.createElement('div'); d.id = 'zoomAccessOverlay';
  d.style.cssText = 'position:fixed;inset:0;z-index:999998;background:rgba(8,12,24,.97);display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;';
  d.innerHTML = '<div style="max-width:420px;text-align:center;color:#e7eefb;">' + html + '</div>';
  document.body.appendChild(d);
}
function _zoomShowChecking() {
  _zoomAccessOverlay('<div style="font-size:40px;">⏳</div><div style="font-size:16px;font-weight:700;margin-top:12px;">Verificando tu acceso…</div>');
}
function _zoomShowNoAccess() {
  // El usuario logueado NO paga por Stripe → muestra el GATE para que entre con su TOKEN
  // (o el email con que paga) o solicite un token. Mario 2026-06-25.
  var g = document.getElementById('zoomVerifyGate');
  var l = document.getElementById('zoomRecordingsList');
  if (g) g.style.display = 'block';
  if (l) l.style.display = 'none';
}

function showZoomRecordings() {
  // Conceder acceso de ESCUELA (abre todas las zonas de estudio en la web) — Mario 2026-06-25.
  try { sessionStorage.setItem('school_access', '1'); } catch (_) {}
  var gate = document.getElementById('zoomVerifyGate');
  var list = document.getElementById('zoomRecordingsList');
  var welcome = document.getElementById('zoomWelcomeName');
  var container = document.getElementById('zoomRecordingsContainer');
  var searchInput = document.getElementById('zoomSearchInput');
  if (gate) gate.style.display = 'none';
  if (list) list.style.display = 'block';
  var session = getZoomSession();
  if (welcome) welcome.textContent = session ? session.name : '';
  // Reset card filter state on screen show
  zoomCardFilter = 'none';
  if (container) container.style.display = 'none';
  if (searchInput) searchInput.style.display = 'none';
  var cards = document.querySelectorAll('#zoomCardsGrid .zoom-nav-card');
  cards.forEach(function(c) { c.classList.remove('active'); });
  var floatBtn = document.getElementById('zoomFloatingBtn');
  if (floatBtn) floatBtn.style.display = 'none';
  updateZoomCardCounts();
}

