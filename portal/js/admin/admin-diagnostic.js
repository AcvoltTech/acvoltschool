// ============================================
// ADMIN: DIAGNOSTICO DE ESTUDIANTES
// ============================================
if (typeof _addTranslations === 'function') _addTranslations({
  adm_dg_analyzing: { es: 'Analizando estudiantes...', en: 'Analyzing students...' },
  adm_dg_no_data: { es: 'No hay datos', en: 'No data' },
  adm_dg_name: { es: 'Nombre', en: 'Name' },
  adm_dg_email: { es: 'Email', en: 'Email' },
  adm_dg_phone: { es: 'Tel\u00E9fono', en: 'Phone' },
  adm_dg_registered: { es: 'Registro', en: 'Registered' },
  adm_dg_last_access: { es: '\u00DAltimo Acceso', en: 'Last Access' },
  adm_dg_status: { es: 'Estado', en: 'Status' },
  adm_dg_never: { es: 'Nunca', en: 'Never' },
  adm_dg_active: { es: 'Activo', en: 'Active' },
  adm_dg_no_activity: { es: 'Sin actividad', en: 'No activity' },
  adm_dg_progress: { es: 'Progreso', en: 'Progress' },
  adm_dg_quizzes: { es: 'Quizzes', en: 'Quizzes' },
  adm_dg_certificates: { es: 'Certificados', en: 'Certificates' },
  adm_dg_no_name: { es: 'sin nombre', en: 'no name' },
  adm_dg_no_duplicates: { es: 'No se encontraron registros duplicados', en: 'No duplicate records found' },
  adm_dg_dup_group: { es: 'Grupo duplicado #', en: 'Duplicate group #' },
  adm_dg_records: { es: ' registros', en: ' records' },
  adm_dg_activity: { es: 'Actividad', en: 'Activity' },
  adm_dg_same_name: { es: 'Mismo nombre', en: 'Same name' },
  adm_dg_same_phone: { es: 'Mismo tel\u00E9fono', en: 'Same phone' },
  adm_dg_yes: { es: 'S\u00ED', en: 'Yes' },
  adm_dg_no: { es: 'No', en: 'No' },
});
var _diagData = { all: [], active: [], inactive: [], duplicates: [] };

async function runStudentDiagnostic(){
  var container = document.getElementById('diagResults');
  container.innerHTML = '<div style="text-align:center;padding:30px;"><div style="font-size:2em;margin-bottom:10px;">\u23F3</div>' + _t('adm_dg_analyzing', 'Analizando estudiantes...') + '</div>';

  try {
    // 1. Get all registered users
    var users = [], _dgOff = 0, _dgMore = true;
    while (_dgMore) {
      var usersRes = await usersDataAdmin('admin_list', { offset: _dgOff, limit: 1000, fields: ["*"], order_by: 'fecha_registro', ascending: false });
      var _dgBatch = usersRes.data || [];
      users = users.concat(_dgBatch);
      if (_dgBatch.length < 1000) _dgMore = false; else _dgOff += 1000;
    }

    // 2. Get all progress records (who has activity)
    var progressRes = await supabaseClient.from('user_progress').select('user_id');
    var progressUserIds = new Set((progressRes.data || []).map(function(p){ return p.user_id; }));

    // 3. Get all quiz attempts
    var quizRes = await supabaseClient.from('quiz_attempts').select('user_id');
    var quizUserIds = new Set((quizRes.data || []).map(function(q){ return q.user_id; }));

    // 4. Get all certificates
    var certRes = await supabaseClient.from('certificates').select('user_id');
    var certUserIds = new Set((certRes.data || []).map(function(c){ return c.user_id; }));

    // 5. Get activity log
    var actRes = await supabaseClient.from('activity_log').select('user_id');
    var actUserIds = new Set((actRes.data || []).map(function(a){ return a.user_id; }));

    // Combine all activity
    var activeIds = new Set();
    [progressUserIds, quizUserIds, certUserIds, actUserIds].forEach(function(s){
      s.forEach(function(id){ activeIds.add(id); });
    });

    // Classify users
    var activeUsers = [];
    var inactiveUsers = [];
    users.forEach(function(u){
      u._hasActivity = activeIds.has(u.id);
      u._hasProgress = progressUserIds.has(u.id);
      u._hasQuiz = quizUserIds.has(u.id);
      u._hasCert = certUserIds.has(u.id);
      if(u._hasActivity){
        activeUsers.push(u);
      } else {
        inactiveUsers.push(u);
      }
    });

    // Find duplicates by nombre (case-insensitive) or telefono
    var nameGroups = {};
    var phoneGroups = {};
    users.forEach(function(u){
      var nameKey = (u.nombre || '').trim().toLowerCase();
      if(nameKey){
        if(!nameGroups[nameKey]) nameGroups[nameKey] = [];
        nameGroups[nameKey].push(u);
      }
      var phone = (u.telefono || '').replace(/\D/g, '');
      if(phone && phone.length >= 7){
        if(!phoneGroups[phone]) phoneGroups[phone] = [];
        phoneGroups[phone].push(u);
      }
    });

    var duplicateGroups = [];
    var seenIds = new Set();
    // Name duplicates
    Object.keys(nameGroups).forEach(function(key){
      if(nameGroups[key].length > 1){
        var group = nameGroups[key].filter(function(u){ return !seenIds.has(u.id); });
        if(group.length > 1){
          duplicateGroups.push({reason: _t('adm_dg_same_name', 'Mismo nombre'), users: nameGroups[key]});
          nameGroups[key].forEach(function(u){ seenIds.add(u.id); });
        }
      }
    });
    // Phone duplicates
    Object.keys(phoneGroups).forEach(function(key){
      if(phoneGroups[key].length > 1){
        var hasNew = phoneGroups[key].some(function(u){ return !seenIds.has(u.id); });
        if(hasNew){
          duplicateGroups.push({reason: _t('adm_dg_same_phone', 'Mismo tel\u00E9fono'), users: phoneGroups[key]});
          phoneGroups[key].forEach(function(u){ seenIds.add(u.id); });
        }
      }
    });

    _diagData = {
      all: users,
      active: activeUsers,
      inactive: inactiveUsers,
      duplicates: duplicateGroups
    };

    // Update stats
    document.getElementById('diagTotalCount').textContent = users.length;
    document.getElementById('diagActiveCount').textContent = activeUsers.length;
    document.getElementById('diagInactiveCount').textContent = inactiveUsers.length;
    document.getElementById('diagDuplicateCount').textContent = duplicateGroups.length;
    document.getElementById('diagStats').style.display = 'grid';

    showDiagFilter('all');
  } catch(e){
    container.innerHTML = '<span style="color:#e74c3c;">Error: ' + _escHtml(e.message || e) + '</span>';
    console.error('Diagnostic error:', e);
  }
}

function showDiagFilter(filter){
  // Update button styles
  ['all','inactive','duplicates','active'].forEach(function(f){
    var btn = document.getElementById('diagFilter' + f.charAt(0).toUpperCase() + f.slice(1));
    if(btn){
      if(f === filter){
        var colors = {all:'#3498db', inactive:'#e74c3c', duplicates:'#f39c12', active:'#2ecc71'};
        btn.style.background = colors[f];
        btn.style.color = '#fff';
        btn.style.border = 'none';
      } else {
        var colors2 = {all:'#3498db', inactive:'#e74c3c', duplicates:'#f39c12', active:'#2ecc71'};
        btn.style.background = 'transparent';
        btn.style.color = colors2[f];
        btn.style.border = '1px solid ' + colors2[f];
      }
    }
  });

  var container = document.getElementById('diagResults');

  if(filter === 'duplicates'){
    renderDuplicates(container);
    return;
  }

  var list = filter === 'all' ? _diagData.all : filter === 'active' ? _diagData.active : _diagData.inactive;
  if(!list || list.length === 0){
    container.innerHTML = '<span style="color:#64748b;">' + _t('adm_dg_no_data', 'No hay datos') + '</span>';
    return;
  }

  var html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85em;">';
  html += '<tr style="background:rgba(255,255,255,0.05);"><th style="padding:8px;text-align:left;color:#94a3b8;">' + _t('adm_dg_name', 'Nombre') + '</th><th style="padding:8px;text-align:left;color:#94a3b8;">' + _t('adm_dg_email', 'Email') + '</th><th style="padding:8px;text-align:left;color:#94a3b8;">' + _t('adm_dg_phone', 'Tel\u00E9fono') + '</th><th style="padding:8px;text-align:center;color:#94a3b8;">' + _t('adm_dg_registered', 'Registro') + '</th><th style="padding:8px;text-align:center;color:#94a3b8;">' + _t('adm_dg_last_access', '\u00DAltimo Acceso') + '</th><th style="padding:8px;text-align:center;color:#94a3b8;">' + _t('adm_dg_status', 'Estado') + '</th></tr>';

  list.forEach(function(u){
    var regDate = u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString('es-MX') : 'N/A';
    var lastAccess = u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleDateString('es-MX') : _t('adm_dg_never', 'Nunca');
    var statusColor = u._hasActivity ? '#2ecc71' : '#e74c3c';
    var statusText = u._hasActivity ? '\uD83D\uDFE2 ' + _t('adm_dg_active', 'Activo') : '\uD83D\uDD34 ' + _t('adm_dg_no_activity', 'Sin actividad');
    var details = [];
    if(u._hasProgress) details.push('\uD83D\uDCCA ' + _t('adm_dg_progress', 'Progreso'));
    if(u._hasQuiz) details.push('\uD83D\uDCDD ' + _t('adm_dg_quizzes', 'Quizzes'));
    if(u._hasCert) details.push('\uD83C\uDF93 ' + _t('adm_dg_certificates', 'Certificados'));

    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">';
    html += '<td style="padding:8px;color:#fff;">' + _escHtml(u.nombre || _t('adm_dg_no_name', 'sin nombre')) + '</td>';
    html += '<td style="padding:8px;color:#94a3b8;font-size:0.9em;">' + _escHtml(u.email || '-') + '</td>';
    html += '<td style="padding:8px;color:#94a3b8;">' + _escHtml(u.telefono || '-') + '</td>';
    html += '<td style="padding:8px;text-align:center;color:#64748b;">' + regDate + '</td>';
    html += '<td style="padding:8px;text-align:center;color:#64748b;">' + lastAccess + '</td>';
    html += '<td style="padding:8px;text-align:center;"><span style="color:' + statusColor + ';font-size:0.85em;">' + statusText + '</span>';
    if(details.length > 0) html += '<div style="font-size:0.7em;color:#64748b;">' + details.join(' ') + '</div>';
    html += '</td></tr>';
  });
  html += '</table></div>';
  container.innerHTML = html;
}

function renderDuplicates(container){
  var groups = _diagData.duplicates;
  if(!groups || groups.length === 0){
    container.innerHTML = '<span style="color:#2ecc71;">\u2705 ' + _t('adm_dg_no_duplicates', 'No se encontraron registros duplicados') + '</span>';
    return;
  }
  var html = '';
  groups.forEach(function(g, idx){
    html += '<div style="background:rgba(243,156,18,0.1);border:1px solid rgba(243,156,18,0.3);border-radius:12px;padding:15px;margin-bottom:12px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
    html += '<span style="color:#f39c12;font-weight:bold;">\u26A0\uFE0F ' + _t('adm_dg_dup_group', 'Grupo duplicado #') + (idx+1) + ' \u2014 ' + g.reason + '</span>';
    html += '<span style="color:#64748b;font-size:0.85em;">' + g.users.length + _t('adm_dg_records', ' registros') + '</span></div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.85em;">';
    html += '<tr style="background:rgba(255,255,255,0.03);"><th style="padding:6px;text-align:left;color:#f39c12;">' + _t('adm_dg_name', 'Nombre') + '</th><th style="padding:6px;text-align:left;color:#f39c12;">' + _t('adm_dg_email', 'Email') + '</th><th style="padding:6px;text-align:left;color:#f39c12;">' + _t('adm_dg_phone', 'Tel\u00E9fono') + '</th><th style="padding:6px;text-align:center;color:#f39c12;">' + _t('adm_dg_registered', 'Registro') + '</th><th style="padding:6px;text-align:center;color:#f39c12;">' + _t('adm_dg_activity', 'Actividad') + '</th></tr>';
    g.users.forEach(function(u){
      var regDate = u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString('es-MX') : 'N/A';
      var hasAct = u._hasActivity;
      html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">';
      html += '<td style="padding:6px;color:#fff;">' + _escHtml(u.nombre || '-') + '</td>';
      html += '<td style="padding:6px;color:#94a3b8;">' + _escHtml(u.email || '-') + '</td>';
      html += '<td style="padding:6px;color:#94a3b8;">' + _escHtml(u.telefono || '-') + '</td>';
      html += '<td style="padding:6px;text-align:center;color:#64748b;">' + regDate + '</td>';
      html += '<td style="padding:6px;text-align:center;">' + (hasAct ? '<span style="color:#2ecc71;">\uD83D\uDFE2 ' + _t('adm_dg_yes', 'S\u00ED') + '</span>' : '<span style="color:#e74c3c;">\uD83D\uDD34 ' + _t('adm_dg_no', 'No') + '</span>') + '</td>';
      html += '</tr>';
    });
    html += '</table></div>';
  });
  container.innerHTML = html;
}
