// ============================================
// DESAFÍO CERTIFICADOS ADMIN — Search/edit/print student certificates
// Self-bootstrapping: injects sidebar item + panel div
// ============================================

if (typeof _addTranslations === 'function') _addTranslations({
  dca_sidebar:      { es: 'Certificados Desafío', en: 'Challenge Certificates' },
  dca_title:        { es: 'Certificados Desafío — Administración', en: 'Challenge Certificates — Admin' },
  dca_search_ph:    { es: 'Buscar por email o nombre...', en: 'Search by email or name...' },
  dca_search_btn:   { es: 'Buscar', en: 'Search' },
  dca_student:      { es: 'Estudiante', en: 'Student' },
  dca_name:         { es: 'Nombre', en: 'Name' },
  dca_save_name:    { es: 'Guardar', en: 'Save' },
  dca_saving:       { es: 'Guardando...', en: 'Saving...' },
  dca_saved:        { es: 'Nombre actualizado', en: 'Name updated' },
  dca_save_err:     { es: 'Error al guardar nombre', en: 'Error saving name' },
  dca_no_results:   { es: 'No se encontraron certificados para este estudiante', en: 'No certificates found for this student' },
  dca_no_student:   { es: 'Estudiante no encontrado', en: 'Student not found' },
  dca_corrida:      { es: 'Corrida', en: 'Run' },
  dca_nivel:        { es: 'Nivel', en: 'Level' },
  dca_score:        { es: 'Score', en: 'Score' },
  dca_date:         { es: 'Fecha', en: 'Date' },
  dca_actions:      { es: 'Acciones', en: 'Actions' },
  dca_print:        { es: 'Imprimir', en: 'Print' },
  dca_print_all:    { es: 'Imprimir Todos', en: 'Print All' },
  dca_certs_found:  { es: 'certificado(s) obtenido(s)', en: 'certificate(s) earned' },
  dca_searching:    { es: 'Buscando...', en: 'Searching...' },
  dca_enter_search: { es: 'Ingresa un email o nombre para buscar', en: 'Enter an email or name to search' },
});

(function _dcaBootstrap() {
  // Insert sidebar item after desafioAdmin
  var desafioItem = document.querySelector('[data-crm-section="desafioAdmin"]');
  if (desafioItem && !document.querySelector('[data-crm-section="desafioCerts"]')) {
    var a = document.createElement('a');
    a.className = 'crm-sidebar-item';
    a.setAttribute('data-crm-section', 'desafioCerts');
    a.setAttribute('data-crm-mode', 'admin');
    a.setAttribute('onclick', "if(typeof showCrmSection==='function')showCrmSection('desafioCerts',this)");
    a.innerHTML = '<span class="crm-icon">\uD83D\uDCDC</span> ' + (typeof _t === 'function' ? _t('dca_sidebar') : 'Certificados Desafío');
    desafioItem.insertAdjacentElement('afterend', a);
  }
  // Create panel div
  var pageContent = document.querySelector('.crm-page-content') || document.getElementById('crmMain');
  if (pageContent && !document.getElementById('crm-section-desafioCerts')) {
    var div = document.createElement('div');
    div.className = 'crm-section-panel';
    div.id = 'crm-section-desafioCerts';
    pageContent.appendChild(div);
  }
})();

// Register in crmSectionTitles if available
if (typeof crmSectionTitles !== 'undefined') {
  crmSectionTitles.desafioCerts = typeof _t === 'function' ? _t('dca_title') : 'Certificados Desafío — Administración';
}

// --- Main load function ---
window.loadDesafioCertsAdmin = function() {
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };
  var panel = document.getElementById('crm-section-desafioCerts');
  if (!panel) return;

  var CORRIDA_NAMES = ['Aprendiz', 'Técnico en Desempeño', 'Técnico Avanzado', 'Técnico Especialista', 'Técnico Platino'];
  var CORRIDA_ICONS = ['\uD83D\uDFE2', '\uD83D\uDD35', '\uD83D\uDFE3', '\uD83D\uDFE0', '\uD83C\uDFC6'];
  var NIVEL_IDS = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  panel.innerHTML =
    '<div style="padding:20px;max-width:900px;margin:0 auto;">' +
      '<h2 style="color:#FFD700;margin:0 0 20px;font-size:20px;">\uD83D\uDCDC ' + _t('dca_title', 'Certificados Desafío — Administración') + '</h2>' +
      // Search bar
      '<div style="display:flex;gap:8px;margin-bottom:20px;">' +
        '<input id="dcaSearchInput" type="text" placeholder="' + _t('dca_search_ph', 'Buscar por email o nombre...') + '" style="flex:1;padding:10px 14px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-size:14px;" onkeydown="if(event.key===\'Enter\')_dcaSearch()">' +
        '<button onclick="_dcaSearch()" style="padding:10px 18px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">\uD83D\uDD0D ' + _t('dca_search_btn', 'Buscar') + '</button>' +
      '</div>' +
      // Results area
      '<div id="dcaResults" style="color:#94a3b8;font-size:14px;text-align:center;padding:40px 0;">' +
        _t('dca_enter_search', 'Ingresa un email o nombre para buscar') +
      '</div>' +
    '</div>';
};

window._dcaSearch = async function() {
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };
  var input = document.getElementById('dcaSearchInput');
  var results = document.getElementById('dcaResults');
  if (!input || !results) return;

  var query = input.value.trim();
  if (!query) return;

  results.innerHTML = '<div style="color:#94a3b8;padding:40px 0;text-align:center;">\u23F3 ' + _t('dca_searching', 'Buscando...') + '</div>';

  var CORRIDA_NAMES = ['Aprendiz', 'Técnico en Desempeño', 'Técnico Avanzado', 'Técnico Especialista', 'Técnico Platino'];
  var CORRIDA_ICONS = ['\uD83D\uDFE2', '\uD83D\uDD35', '\uD83D\uDFE3', '\uD83D\uDFE0', '\uD83C\uDFC6'];
  var NIVEL_IDS = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  try {
    // Step 1: Find the student — try exact email first, then flexible search
    var studentEmail = '';
    var studentName = '';

    if (query.indexOf('@') !== -1) {
      // Looks like email — direct lookup
      var userRes = await usersDataAdmin('admin_get', { email: query.toLowerCase() });
      if (userRes.data) {
        studentEmail = userRes.data.email;
        studentName = userRes.data.nombre || '';
      }
    }

    if (!studentEmail) {
      // Search by name or partial email
      var searchRes = await usersDataAdmin('admin_list', { search: query, fields: ['email', 'nombre'], limit: 1 });
      if (searchRes.data && searchRes.data.length > 0) {
        studentEmail = searchRes.data[0].email;
        studentName = searchRes.data[0].nombre || '';
      }
    }

    if (!studentEmail) {
      results.innerHTML = '<div style="color:#ef4444;padding:40px 0;text-align:center;">\u274C ' + _t('dca_no_student', 'Estudiante no encontrado') + '</div>';
      return;
    }

    // Step 2: Fetch certificates from desafio_progress
    if (!window.supabaseClient) {
      results.innerHTML = '<div style="color:#ef4444;padding:40px 0;text-align:center;">Supabase no conectado</div>';
      return;
    }

    var certRes = await supabaseClient.from('desafio_progress')
      .select('corrida,nivel,porcentaje,certificate_id,completed_at')
      .eq('user_email', studentEmail)
      .not('certificate_id', 'is', null)
      .gte('porcentaje', 70)
      .order('corrida', { ascending: true });

    var certs = (certRes.data || []).sort(function(a, b) {
      return a.corrida !== b.corrida ? a.corrida - b.corrida : a.nivel - b.nivel;
    });

    // Step 3: Render
    var html = '';

    // Student info + editable name
    html += '<div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:16px;">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
    html += '<span style="font-size:18px;">\uD83D\uDC64</span>';
    html += '<span style="color:#e2e8f0;font-size:15px;font-weight:600;">' + _t('dca_student', 'Estudiante') + ': <span style="color:#3b82f6;">' + _dcaEsc(studentEmail) + '</span></span>';
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<label style="color:#94a3b8;font-size:13px;white-space:nowrap;">' + _t('dca_name', 'Nombre') + ':</label>';
    html += '<input id="dcaNameInput" type="text" value="' + _dcaEsc(studentName) + '" style="flex:1;padding:8px 12px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:14px;">';
    html += '<button id="dcaSaveNameBtn" onclick="_dcaSaveName(\'' + _dcaEsc(studentEmail).replace(/'/g, "\\'") + '\')" style="padding:8px 16px;background:#22c55e;color:#fff;border:none;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">\uD83D\uDCBE ' + _t('dca_save_name', 'Guardar') + '</button>';
    html += '</div>';
    html += '</div>';

    if (certs.length === 0) {
      html += '<div style="color:#94a3b8;padding:40px 0;text-align:center;">' + _t('dca_no_results', 'No se encontraron certificados para este estudiante') + '</div>';
    } else {
      // Cert count
      html += '<div style="color:#e2e8f0;font-size:14px;margin-bottom:12px;font-weight:600;">' + certs.length + ' ' + _t('dca_certs_found', 'certificado(s) obtenido(s)') + '</div>';

      // Table
      html += '<div style="overflow-x:auto;">';
      html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
      html += '<thead><tr style="background:#1e293b;color:#94a3b8;text-align:left;">';
      html += '<th style="padding:10px 12px;border-bottom:1px solid #334155;">' + _t('dca_corrida', 'Corrida') + '</th>';
      html += '<th style="padding:10px 12px;border-bottom:1px solid #334155;">' + _t('dca_nivel', 'Nivel') + '</th>';
      html += '<th style="padding:10px 12px;border-bottom:1px solid #334155;">' + _t('dca_score', 'Score') + '</th>';
      html += '<th style="padding:10px 12px;border-bottom:1px solid #334155;">' + _t('dca_date', 'Fecha') + '</th>';
      html += '<th style="padding:10px 12px;border-bottom:1px solid #334155;">' + _t('dca_actions', 'Acciones') + '</th>';
      html += '</tr></thead><tbody>';

      certs.forEach(function(cert, idx) {
        var certDate = '';
        if (cert.completed_at) {
          var d = new Date(cert.completed_at);
          certDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
        }
        var cId = cert.corrida;
        var corridaName = CORRIDA_NAMES[cId - 1] || ('C' + cId);
        var bg = idx % 2 === 0 ? '#0f172a' : '#1e293b';

        html += '<tr style="background:' + bg + ';">';
        html += '<td style="padding:10px 12px;color:#e2e8f0;border-bottom:1px solid #1e293b;">' + CORRIDA_ICONS[cId - 1] + ' C' + cId + '</td>';
        html += '<td style="padding:10px 12px;color:#e2e8f0;border-bottom:1px solid #1e293b;">N' + cert.nivel + '</td>';
        html += '<td style="padding:10px 12px;border-bottom:1px solid #1e293b;"><span style="background:rgba(34,197,94,0.15);color:#22c55e;padding:2px 8px;border-radius:12px;font-weight:700;">' + Math.round(cert.porcentaje) + '%</span></td>';
        html += '<td style="padding:10px 12px;color:#94a3b8;border-bottom:1px solid #1e293b;">' + certDate + '</td>';
        html += '<td style="padding:10px 12px;border-bottom:1px solid #1e293b;">';
        // Print button — reads name from input at click time
        html += '<button onclick="_dcaPrintCert(' + cId + ',' + cert.nivel + ',' + Math.round(cert.porcentaje) + ',\'' + _dcaEsc(cert.certificate_id || '').replace(/'/g, "\\'") + '\',\'' + _dcaEsc(certDate).replace(/'/g, "\\'") + '\')" style="padding:6px 14px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">\uD83D\uDDA8\uFE0F ' + _t('dca_print', 'Imprimir') + '</button>';
        html += '</td></tr>';
      });

      html += '</tbody></table></div>';

      // Print All button
      if (certs.length > 1) {
        // Store certs in a global for Print All
        window._dcaCerts = certs;
        html += '<div style="text-align:center;margin-top:16px;">';
        html += '<button onclick="_dcaPrintAll()" style="padding:12px 24px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">\uD83D\uDDA8\uFE0F ' + _t('dca_print_all', 'Imprimir Todos') + '</button>';
        html += '</div>';
      }
    }

    results.innerHTML = html;

  } catch(e) {
    console.error('[DesafioCertsAdmin] Search error:', e);
    results.innerHTML = '<div style="color:#ef4444;padding:40px 0;text-align:center;">Error: ' + (e.message || e) + '</div>';
  }
};

// --- Save name to DB ---
window._dcaSaveName = async function(email) {
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };
  var nameInput = document.getElementById('dcaNameInput');
  var btn = document.getElementById('dcaSaveNameBtn');
  if (!nameInput || !btn) return;

  var newName = nameInput.value.trim();
  if (!newName) return;

  var origText = btn.innerHTML;
  btn.innerHTML = '\u23F3 ' + _t('dca_saving', 'Guardando...');
  btn.disabled = true;

  try {
    var res = await usersDataAdmin('admin_update', { email: email, data: { nombre: newName } });
    if (res.error) {
      alert(_t('dca_save_err', 'Error al guardar nombre') + ': ' + res.error);
    } else {
      btn.innerHTML = '\u2705 ' + _t('dca_saved', 'Nombre actualizado');
      btn.style.background = '#16a34a';
      setTimeout(function() {
        btn.innerHTML = origText;
        btn.style.background = '#22c55e';
      }, 2000);
    }
  } catch(e) {
    alert(_t('dca_save_err', 'Error al guardar nombre') + ': ' + (e.message || e));
  }
  btn.disabled = false;
};

// --- Print single cert ---
window._dcaPrintCert = function(corrida, nivel, score, certId, dateStr) {
  var CORRIDA_NAMES = ['Aprendiz', 'Técnico en Desempeño', 'Técnico Avanzado', 'Técnico Especialista', 'Técnico Platino'];
  var CORRIDA_ICONS = ['\uD83D\uDFE2', '\uD83D\uDD35', '\uD83D\uDFE3', '\uD83D\uDFE0', '\uD83C\uDFC6'];
  var NIVEL_IDS = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];

  // Read name from the editable input at print time
  var nameInput = document.getElementById('dcaNameInput');
  var userName = (nameInput && nameInput.value.trim()) || 'Técnico HVAC';
  var levelId = NIVEL_IDS[corrida - 1] || 'principiante';
  var levelName = CORRIDA_NAMES[corrida - 1] + ' — Nivel ' + nivel;
  var levelIcon = CORRIDA_ICONS[corrida - 1] || '';

  if (typeof executeCertPrint === 'function') {
    executeCertPrint(levelId, levelName, levelIcon, userName, score, dateStr, certId);
  } else {
    alert('Sistema de certificados no cargado. Recarga la página.');
  }
};

// --- Print All certs ---
window._dcaPrintAll = function() {
  var certs = window._dcaCerts;
  if (!certs || certs.length === 0) return;

  var CORRIDA_NAMES = ['Aprendiz', 'Técnico en Desempeño', 'Técnico Avanzado', 'Técnico Especialista', 'Técnico Platino'];
  var CORRIDA_ICONS = ['\uD83D\uDFE2', '\uD83D\uDD35', '\uD83D\uDFE3', '\uD83D\uDFE0', '\uD83C\uDFC6'];
  var NIVEL_IDS = ['principiante', 'intermedio', 'avanzado', 'elite', 'platino'];

  var nameInput = document.getElementById('dcaNameInput');
  var userName = (nameInput && nameInput.value.trim()) || 'Técnico HVAC';

  // Print sequentially with small delay so print dialogs don't overlap
  var idx = 0;
  function printNext() {
    if (idx >= certs.length) return;
    var cert = certs[idx];
    var cId = cert.corrida;
    var certDate = '';
    if (cert.completed_at) {
      var d = new Date(cert.completed_at);
      certDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }
    if (typeof executeCertPrint === 'function') {
      executeCertPrint(NIVEL_IDS[cId - 1] || 'principiante', CORRIDA_NAMES[cId - 1] + ' — Nivel ' + cert.nivel, CORRIDA_ICONS[cId - 1] || '', userName, Math.round(cert.porcentaje), certDate, cert.certificate_id);
    }
    idx++;
    if (idx < certs.length) setTimeout(printNext, 1500);
  }
  printNext();
};

// --- HTML escape helper ---
function _dcaEsc(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
