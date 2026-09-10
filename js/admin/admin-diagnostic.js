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
  adm_dg_load_failed: { es: 'No pude leer una de las fuentes. Los conteos ser\u00EDan mentira, as\u00ED que no se pintan.', en: 'Could not read one of the sources. The counts would be a lie, so they are not shown.' },
  adm_dg_retry: { es: 'Reintentar', en: 'Retry' },
  adm_dg_floor: { es: 'Lectura INCOMPLETA: \u201Csin actividad\u201D es un TECHO, no un dato firme.', en: 'INCOMPLETE read: \u201Cno activity\u201D is a ceiling, not a firm number.' },
  adm_dg_src_missing: { es: 'Falta una fuente de actividad: la tabla `activity_log` NO EXISTE en esta base. Un usuario cuya \u00FAnica huella viviera ah\u00ED sale aqu\u00ED como \u201Csin actividad\u201D. El conteo de inactivos es un TECHO.', en: 'One activity source is missing: table `activity_log` DOES NOT EXIST in this database. A user whose only trace lived there shows here as \u201Cno activity\u201D. The inactive count is a ceiling.' },
});
var _diagData = { all: [], active: [], inactive: [], duplicates: [], completo: true, fuenteFaltante: true };

async function runStudentDiagnostic(){
  var container = document.getElementById('diagResults');
  container.innerHTML = '<div style="text-align:center;padding:30px;"><div style="font-size:2em;margin-bottom:10px;">\u23F3</div>' + _t('adm_dg_analyzing', 'Analizando estudiantes...') + '</div>';

  try {
    // 1. Get all registered users
    var users = [], _dgOff = 0, _dgMore = true;
    while (_dgMore) {
      var usersRes = await usersDataAdmin('admin_list', { offset: _dgOff, limit: 1000, fields: ["*"], order_by: 'fecha_registro', ascending: false });
      // 🔒 El paginado ya estaba bien, pero `usersRes.data || []` convertía un fallo en
      // "se acabó la lista": una página rota daba un roster corto (o vacío) sin una sola
      // señal, y de ahí salían "inactivos" que ni siquiera se habían leído.
      if (usersRes.error) throw new Error('users (offset ' + _dgOff + '): ' + (usersRes.error.message || usersRes.error));
      var _dgBatch = usersRes.data || [];
      users = users.concat(_dgBatch);
      if (_dgBatch.length < 1000) _dgMore = false; else _dgOff += 1000;
    }

    // 🔴 RAÍZ (10-sep-2026): las lecturas 2-4 eran `.select('user_id')` PELONES.
    // PostgREST corta TODO select en 1,000 filas sin avisar (HTTP 200, sin error), y
    // `user_progress` tiene 48,959 filas MEDIDAS ese día. O sea: el diagnóstico veía 1,000
    // de 48,959 registros de progreso (2%) y por eso reportaba MILES de "registrados que
    // nunca entraron" que en realidad llevan meses estudiando. MaestroPagina.todo() lee la
    // tabla COMPLETA y, a diferencia del `|| []`, distingue "falló" de "no hay filas".
    // (quiz_attempts 44 y certificates 21 hoy no llegan al tope, pero se paginan igual: el
    //  día que crezcan nadie va a volver aquí, y el `|| []` tapaba también sus errores.)
    var _dgLeer = function(tabla) {
      return window.MaestroPagina.todo(tabla, 'id, user_id');
    };
    var fuentes = await Promise.all([_dgLeer('user_progress'), _dgLeer('quiz_attempts'), _dgLeer('certificates')]);

    // 🔒 LEY: si una fuente falló, esta pantalla NO pinta conteos. Un cero aquí se lee
    // como "nadie tiene actividad" y con eso se toman decisiones de a quién dar de baja.
    var _dgNombres = ['user_progress', 'quiz_attempts', 'certificates'];
    for (var _f = 0; _f < fuentes.length; _f++) {
      if (fuentes[_f].error) throw new Error(_dgNombres[_f] + ': ' + (fuentes[_f].error.message || fuentes[_f].error));
    }
    var _dgCompleto = fuentes.every(function(r){ return r.completo !== false; });

    var progressUserIds = new Set((fuentes[0].data || []).map(function(p){ return p.user_id; }));
    var quizUserIds     = new Set((fuentes[1].data || []).map(function(q){ return q.user_id; }));
    var certUserIds     = new Set((fuentes[2].data || []).map(function(c){ return c.user_id; }));

    // 🪤 TRAMPA (10-sep-2026): aquí se leía `activity_log`, y esa tabla NO EXISTE en esta
    // base. PostgREST responde 400, el `(actRes.data || [])` de antes lo convertía en "no hay
    // filas" y la unión de actividad se quedaba sin una fuente entera, EN SILENCIO: gente
    // activa clasificada como "sin actividad". Verificado contra information_schema.columns.
    // NO se adivina reemplazo: `last_activity` sí tiene `user_id` pero está VACÍA (0 filas
    // medidas) y `daily_activity` va por `email`, no por `user_id` — ninguna es la misma
    // cosa. Se retira la consulta fantasma y se DICE en pantalla que falta esa fuente, para
    // que el conteo de inactivos se lea como TECHO y no como verdad.
    var _dgFuenteFaltante = true;

    // Combine all activity
    var activeIds = new Set();
    [progressUserIds, quizUserIds, certUserIds].forEach(function(s){
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
      duplicates: duplicateGroups,
      completo: _dgCompleto,
      fuenteFaltante: _dgFuenteFaltante
    };

    // Update stats
    document.getElementById('diagTotalCount').textContent = users.length;
    document.getElementById('diagActiveCount').textContent = activeUsers.length;
    document.getElementById('diagInactiveCount').textContent = inactiveUsers.length;
    document.getElementById('diagDuplicateCount').textContent = duplicateGroups.length;
    document.getElementById('diagStats').style.display = 'grid';

    showDiagFilter('all');
  } catch(e){
    // 🔒 LEY: "no pude leer" se DICE y se ofrece Reintentar. Antes salía un
    // "Error: ..." pelado sin salida, y los mosaicos de arriba se quedaban con los números
    // viejos como si nada hubiera pasado.
    console.warn('[Diagnostico] carga: ' + (e.message || e), e);
    var _dgStats = document.getElementById('diagStats');
    if (_dgStats) _dgStats.style.display = 'none';
    container.innerHTML =
      '<div style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.35);border-radius:12px;padding:16px;">' +
        '<div style="color:#e74c3c;font-weight:bold;margin-bottom:6px;">\u26A0\uFE0F ' + _escHtml(_t('adm_dg_load_failed', 'No pude leer una de las fuentes. Los conteos ser\u00EDan mentira, as\u00ED que no se pintan.')) + '</div>' +
        '<div style="color:#94a3b8;font-size:0.85em;margin-bottom:12px;">' + _escHtml(e.message || String(e)) + '</div>' +
        '<button onclick="runStudentDiagnostic()" style="background:#e74c3c;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:0.9em;font-weight:bold;cursor:pointer;">\uD83D\uDD04 ' + _escHtml(_t('adm_dg_retry', 'Reintentar')) + '</button>' +
      '</div>';
    if (typeof window.showToast === 'function') window.showToast(_t('adm_dg_load_failed', 'No pude leer una de las fuentes.'), 'error');
  }
}

// Aviso que va ARRIBA de cualquier vista del diagnóstico: dice qué tan confiable es lo que
// se está viendo. Sin esto, "1,234 sin actividad" se lee como un hecho cuando es un techo.
function _diagAvisoHtml(){
  var h = '';
  if (_diagData.fuenteFaltante) {
    h += '<div style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.35);border-radius:10px;padding:10px 14px;margin-bottom:10px;color:#f39c12;font-size:0.85em;">\u26A0\uFE0F ' + _t('adm_dg_src_missing', 'Falta una fuente de actividad: la tabla activity_log NO EXISTE en esta base. El conteo de inactivos es un TECHO.') + '</div>';
  }
  if (_diagData.completo === false) {
    h += '<div style="background:rgba(243,156,18,0.12);border:1px solid rgba(243,156,18,0.35);border-radius:10px;padding:10px 14px;margin-bottom:10px;color:#f39c12;font-size:0.85em;">\u26A0\uFE0F ' + _t('adm_dg_floor', 'Lectura INCOMPLETA: "sin actividad" es un TECHO, no un dato firme.') + '</div>';
  }
  return h;
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
    container.innerHTML = _diagAvisoHtml() + '<span style="color:#64748b;">' + _t('adm_dg_no_data', 'No hay datos') + '</span>';
    return;
  }

  var html = _diagAvisoHtml() + '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85em;">';
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
    container.innerHTML = _diagAvisoHtml() + '<span style="color:#2ecc71;">\u2705 ' + _t('adm_dg_no_duplicates', 'No se encontraron registros duplicados') + '</span>';
    return;
  }
  var html = _diagAvisoHtml();
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
