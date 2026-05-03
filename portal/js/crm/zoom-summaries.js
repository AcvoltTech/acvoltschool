if (typeof _addTranslations === 'function') _addTranslations({
  zs_no_sections:      { es: 'No hay secciones creadas. Haz clic en "+ Nueva Sección" para comenzar.', en: 'No sections created. Click "+ New Section" to start.' },
  zs_sin_nombre:       { es: 'Sin nombre', en: 'No name' },
  zs_estudiantes:      { es: ' estudiantes', en: ' students' },
  zs_error_sections:   { es: 'Error cargando secciones: ', en: 'Error loading sections: ' },
  zs_all_sections:     { es: 'Todas las secciones', en: 'All sections' },
  zs_new_section:      { es: 'Nueva Sección', en: 'New Section' },
  zs_sec_name_ph:      { es: 'Nombre de la sección (ej: HVAC Básico Marzo)', en: 'Section name (e.g. HVAC Basic March)' },
  zs_sec_code_ph:      { es: 'Código (ej: SEC-2026-03)', en: 'Code (e.g. SEC-2026-03)' },
  zs_create_section:   { es: 'Crear Sección', en: 'Create Section' },
  zs_cancel:           { es: 'Cancelar', en: 'Cancel' },
  zs_name_req:         { es: 'Ingresa el nombre de la sección', en: 'Enter the section name' },
  zs_code_req:         { es: 'Ingresa el código de la sección', en: 'Enter the section code' },
  zs_section_created:  { es: 'Sección "', en: 'Section "' },
  zs_section_created2: { es: '" creada', en: '" created' },
  zs_confirm_del_sec:  { es: '¿Eliminar esta sección? Los resúmenes y preguntas asociadas NO se borrarán.', en: 'Delete this section? Associated summaries and questions will NOT be deleted.' },
  zs_edit_soon:        { es: 'Editar sección: Próximamente', en: 'Edit section: Coming soon' },
  zs_no_summaries:     { es: 'No hay resúmenes. Sube el primer resumen de clase.', en: 'No summaries. Upload the first class summary.' },
  zs_no_title:         { es: 'Sin título', en: 'No title' },
  zs_no_date:          { es: 'Sin fecha', en: 'No date' },
  zs_week:             { es: 'Semana ', en: 'Week ' },
  zs_q_generated:      { es: ' preguntas generadas', en: ' questions generated' },
  zs_approved:         { es: 'Aprobado', en: 'Approved' },
  zs_used:             { es: 'Usado', en: 'Used' },
  zs_pending:          { es: 'Pendiente', en: 'Pending' },
  zs_upload_summary:   { es: 'Subir Resumen de Clase Zoom', en: 'Upload Zoom Class Summary' },
  zs_title_ph:         { es: 'Título (ej: Clase 5 - Diagnóstico de Compresores)', en: 'Title (e.g. Class 5 - Compressor Diagnosis)' },
  zs_select_section:   { es: 'Seleccionar sección...', en: 'Select section...' },
  zs_summary_ph:       { es: 'Pega aquí el resumen de la clase...', en: 'Paste the class summary here...' },
  zs_save_summary:     { es: 'Guardar Resumen', en: 'Save Summary' },
  zs_title_req:        { es: 'Ingresa el título de la clase', en: 'Enter the class title' },
  zs_content_req:      { es: 'Ingresa el resumen de la clase', en: 'Enter the class summary' },
  zs_summary_saved:    { es: 'Resumen guardado. Ahora puedes generar preguntas con el botón 🤖', en: 'Summary saved. You can now generate questions with the 🤖 button' },
  zs_view_soon:        { es: 'Ver resumen completo: Próximamente', en: 'View full summary: Coming soon' },
  zs_gen_questions:    { es: 'Generando preguntas con IA... Esto puede tomar 15-30 segundos.', en: 'Generating questions with AI... This may take 15-30 seconds.' },
  zs_gen_ok:           { es: ' preguntas generadas exitosamente!', en: ' questions generated successfully!' },
  zs_gen_err:          { es: 'Error generando preguntas: ', en: 'Error generating questions: ' },
  zs_gen_btn:          { es: 'Generando preguntas...', en: 'Generating questions...' },
  zs_enero:            { es: 'Enero', en: 'January' },
  zs_febrero:          { es: 'Febrero', en: 'February' },
  zs_marzo:            { es: 'Marzo', en: 'March' },
  zs_abril:            { es: 'Abril', en: 'April' },
  zs_mayo:             { es: 'Mayo', en: 'May' },
  zs_junio:            { es: 'Junio', en: 'June' },
  zs_julio:            { es: 'Julio', en: 'July' },
  zs_agosto:           { es: 'Agosto', en: 'August' },
  zs_septiembre:       { es: 'Septiembre', en: 'September' },
  zs_octubre:          { es: 'Octubre', en: 'October' },
  zs_noviembre:        { es: 'Noviembre', en: 'November' },
  zs_diciembre:        { es: 'Diciembre', en: 'December' },
});

function loadZonaMaestroData() {
  loadSections();
}

// ===== SECCIONES =====
async function loadSections() {
  var grid = document.getElementById('zmSectionsGrid');
  if (!grid || !supabaseClient) return;
  try {
    var res = await supabaseClient.from('zm_sections').select('*').order('created_at', { ascending: false });
    var data = res.data || [];
    if (data.length === 0) {
      grid.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;grid-column:1/-1;">' + _t('zs_no_sections') + '</div>';
      return;
    }
    var html = '';
    data.forEach(function(s) {
      var studCount = s.student_count || 0;
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;position:relative;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<span style="font-weight:700;color:#1e293b;font-size:14px;">' + _escHtml(s.name || _t('zs_sin_nombre')) + '</span>' +
          '<span style="background:#dbeafe;color:#2563eb;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;">' + _escHtml(s.code || '---') + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:#64748b;">👥 ' + studCount + _t('zs_estudiantes') + '</div>' +
        '<div style="font-size:11px;color:#64748b;">📅 ' + (s.month || '') + '/' + (s.year || '') + '</div>' +
        '<div style="margin-top:8px;display:flex;gap:4px;">' +
          '<button onclick="editSection(\'' + s.id + '\')" style="padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;color:#475569;cursor:pointer;font-size:10px;">✏️</button>' +
          '<button onclick="deleteSection(\'' + s.id + '\')" style="padding:4px 8px;border-radius:6px;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;cursor:pointer;font-size:10px;">🗑️</button>' +
        '</div>' +
      '</div>';
    });
    grid.innerHTML = html;
    // Update section filters in other tabs
    updateSectionFilters(data);
  } catch(e) {
    console.error('[ZM] Error loading sections:', e);
    grid.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;font-size:12px;grid-column:1/-1;">' + _t('zs_error_sections') + _escHtml(e.message) + '</div>';
  }
}

function updateSectionFilters(sections) {
  var filters = ['zmSummaryFilter', 'zmPerfSection'];
  filters.forEach(function(fid) {
    var sel = document.getElementById(fid);
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = '<option value="all">' + _t('zs_all_sections') + '</option>';
    sections.forEach(function(s) {
      sel.innerHTML += '<option value="' + _escHtml(s.id) + '">' + _escHtml(s.name) + ' (' + _escHtml(s.code) + ')</option>';
    });
    sel.value = current;
  });
}

function openCreateSectionModal() {
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();
  var code = 'SEC-' + currentYear + '-' + String(currentMonth).padStart(2, '0');
  
  var modal = document.createElement('div');
  modal.id = 'zmSectionModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
  modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:25px;max-width:420px;width:100%;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;">📚 ' + _t('zs_new_section') + '</h3>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
      '<input id="zmSecName" placeholder="' + _t('zs_sec_name_ph') + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">' +
      '<div style="display:flex;gap:8px;">' +
        '<input id="zmSecCode" value="' + code + '" placeholder="' + _t('zs_sec_code_ph') + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;flex:1;">' +
        '<button onclick="document.getElementById(\'zmSecCode\').value=\'SEC-\'+Date.now().toString(36).toUpperCase()" style="padding:8px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-size:11px;">🔄 Auto</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<select id="zmSecMonth" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;flex:1;">' +
          '<option value="1">' + _t('zs_enero') + '</option><option value="2">' + _t('zs_febrero') + '</option><option value="3">' + _t('zs_marzo') + '</option>' +
          '<option value="4">' + _t('zs_abril') + '</option><option value="5">' + _t('zs_mayo') + '</option><option value="6">' + _t('zs_junio') + '</option>' +
          '<option value="7">' + _t('zs_julio') + '</option><option value="8">' + _t('zs_agosto') + '</option><option value="9">' + _t('zs_septiembre') + '</option>' +
          '<option value="10">' + _t('zs_octubre') + '</option><option value="11">' + _t('zs_noviembre') + '</option><option value="12">' + _t('zs_diciembre') + '</option>' +
        '</select>' +
        '<input id="zmSecYear" type="number" value="' + currentYear + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;width:90px;">' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:5px;">' +
        '<button onclick="saveNewSection()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#27ae60;color:#fff;font-weight:bold;cursor:pointer;font-size:14px;">✅ ' + _t('zs_create_section') + '</button>' +
        '<button onclick="document.getElementById(\'zmSectionModal\').remove()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#f1f5f9;color:#475569;cursor:pointer;font-size:14px;">' + _t('zs_cancel') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(modal);
  document.getElementById('zmSecMonth').value = currentMonth;
}

async function saveNewSection() {
  var name = ((document.getElementById('zmSecName') || {}).value || '').trim();
  var code = ((document.getElementById('zmSecCode') || {}).value || '').trim();
  var month = (document.getElementById('zmSecMonth') || {}).value || '';
  var year = (document.getElementById('zmSecYear') || {}).value || '';
  if (!name) { alert(_t('zs_name_req')); return; }
  if (!code) { alert(_t('zs_code_req')); return; }
  try {
    var res = await supabaseClient.from('zm_sections').insert({
      name: name, code: code, month: parseInt(month), year: parseInt(year), student_count: 0
    });
    if (res.error) throw res.error;
    document.getElementById('zmSectionModal').remove();
    alert('✅ ' + _t('zs_section_created') + name + _t('zs_section_created2'));
    loadSections();
  } catch(e) {
    alert('Error: ' + e.message);
  }
}

async function deleteSection(id) {
  if (!confirm(_t('zs_confirm_del_sec'))) return;
  try {
    await supabaseClient.from('zm_sections').delete().eq('id', id);
    loadSections();
  } catch(e) { alert('Error: ' + e.message); }
}

function editSection(id) { alert(_t('zs_edit_soon')); }

// ===== RESÚMENES ZOOM =====

async function loadZoomSummaries() {
  var container = document.getElementById('zmSummariesList');
  if (!container || !supabaseClient) return;
  try {
    var query = supabaseClient.from('zm_zoom_summaries').select('*').order('class_date', { ascending: false });
    var filter = document.getElementById('zmSummaryFilter').value;
    if (filter !== 'all') query = query.eq('section_id', filter);
    var res = await query;
    var data = res.data || [];
    if (data.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;">' + _t('zs_no_summaries') + '</div>';
      return;
    }
    var html = '';
    data.forEach(function(s) {
      var statusBg = s.status === 'approved' ? '#f0fdf4' : s.status === 'used' ? '#eff6ff' : '#fffbeb';
      var statusColor = s.status === 'approved' ? '#16a34a' : s.status === 'used' ? '#2563eb' : '#d97706';
      var statusLabel = s.status === 'approved' ? '✅ ' + _t('zs_approved') : s.status === 'used' ? '📋 ' + _t('zs_used') : '⏳ ' + _t('zs_pending');
      var qCount = s.questions_generated || 0;
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">' +
          '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;color:#1e293b;font-size:13px;">' + _escHtml(s.title || _t('zs_no_title')) + '</div>' +
            '<div style="font-size:11px;color:#64748b;margin-top:4px;">📅 ' + _escHtml(s.class_date || _t('zs_no_date')) + ' · ' + _t('zs_week') + _escHtml(s.week_number || '?') + '</div>' +
            '<div style="font-size:11px;color:#64748b;">❓ ' + qCount + _t('zs_q_generated') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;">' +
            '<span style="background:' + statusBg + ';color:' + statusColor + ';padding:3px 8px;border-radius:8px;font-size:10px;font-weight:600;">' + statusLabel + '</span>' +
            '<button onclick="generateQuestionsFromSummary(\'' + s.id + '\')" style="padding:4px 10px;border-radius:6px;border:none;background:#8b5cf6;color:#fff;cursor:pointer;font-size:10px;" title="' + _t('zsum_generate_ai_tip') + '">' + _t('zsum_generate_btn') + '</button>' +
            '<button onclick="viewSummary(\'' + s.id + '\')" style="padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;color:#475569;cursor:pointer;font-size:10px;">👁️</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    container.innerHTML = html;
  } catch(e) {
    console.error('[ZM] Error loading summaries:', e);
    container.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;font-size:12px;">Error: ' + _escHtml(e.message) + '</div>';
  }
}

function openUploadSummaryModal() {
  var modal = document.createElement('div');
  modal.id = 'zmSummaryModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;overflow-y:auto;';
  modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:25px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;">' +
    '<h3 style="color:#1e293b;margin:0 0 15px;">📝 ' + _t('zs_upload_summary') + '</h3>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
      '<input id="zmSumTitle" placeholder="' + _t('zs_title_ph') + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">' +
      '<input id="zmSumDate" type="date" value="' + new Date().toISOString().split('T')[0] + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">' +
      '<div style="display:flex;gap:8px;">' +
        '<select id="zmSumSection" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;flex:1;"><option value="">' + _t('zs_select_section') + '</option></select>' +
        '<input id="zmSumWeek" type="number" placeholder="' + _t('zsum_week_placeholder') + '" min="1" max="52" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;width:100px;">' +
      '</div>' +
      '<textarea id="zmSumContent" rows="8" placeholder="' + _t('zs_summary_ph') + '" style="padding:10px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;resize:vertical;font-family:inherit;"></textarea>' +
      '<div style="display:flex;gap:8px;margin-top:5px;">' +
        '<button onclick="saveZoomSummary()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#2D8CFF;color:#fff;font-weight:bold;cursor:pointer;font-size:14px;">📝 ' + _t('zs_save_summary') + '</button>' +
        '<button onclick="document.getElementById(\'zmSummaryModal\').remove()" style="flex:1;padding:12px;border:none;border-radius:8px;background:#f1f5f9;color:#475569;cursor:pointer;font-size:14px;">' + _t('zs_cancel') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(modal);
  // Populate section dropdown
  loadSectionsForDropdown('zmSumSection');
}

async function loadSectionsForDropdown(selectId) {
  try {
    var res = await supabaseClient.from('zm_sections').select('id,name,code').order('name');
    var data = res.data || [];
    var sel = document.getElementById(selectId);
    if (!sel) return;
    data.forEach(function(s) {
      sel.innerHTML += '<option value="' + _escHtml(s.id) + '">' + _escHtml(s.name) + ' (' + _escHtml(s.code) + ')</option>';
    });
  } catch(e) { console.log('[ZM] Error loading sections for dropdown:', e); }
}

async function saveZoomSummary() {
  var title = ((document.getElementById('zmSumTitle') || {}).value || '').trim();
  var date = (document.getElementById('zmSumDate') || {}).value || '';
  var sectionId = (document.getElementById('zmSumSection') || {}).value || '';
  var week = (document.getElementById('zmSumWeek') || {}).value || '';
  var content = ((document.getElementById('zmSumContent') || {}).value || '').trim();
  if (!title) { alert(_t('zs_title_req')); return; }
  if (!content) { alert(_t('zs_content_req')); return; }
  try {
    var insertData = {
      title: title,
      content: content,
      class_date: date || null,
      section_id: sectionId || null,
      week_number: week ? parseInt(week) : null,
      month: date ? new Date(date).getMonth() + 1 : null,
      status: 'pending',
      questions_generated: 0
    };
    var res = await supabaseClient.from('zm_zoom_summaries').insert(insertData);
    if (res.error) throw res.error;
    document.getElementById('zmSummaryModal').remove();
    alert('✅ ' + _t('zs_summary_saved'));
    loadZoomSummaries();
  } catch(e) { alert('Error: ' + e.message); }
}

function viewSummary(id) { alert(_t('zs_view_soon')); }

async function generateQuestionsFromSummary(summaryId) {
  // AI-powered question generation from Zoom summaries
  var btn = event ? event.target : null;
  var originalText = btn ? btn.textContent : '';
  
  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ ' + _t('zs_gen_btn');
      btn.style.opacity = '0.6';
    }
    
    // Show loading notification
    if (typeof showNotification === 'function') {
      showNotification('🤖 ' + _t('zs_gen_questions'), 'info');
    }
    
    // Call the Edge Function
    var response = await fetch(SUPABASE_URL + '/functions/v1/generate-exam-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      },
      body: JSON.stringify({
        summaryId: summaryId,
        numQuestions: 10,
        admin_email: getAdminEmail()
      })
    });
    
    var result = await response.json();
    
    if (!response.ok || result.error) {
      throw new Error(result.error || result.details || 'Error generando preguntas');
    }
    
    // Success!
    if (typeof showNotification === 'function') {
      showNotification('✅ ' + result.questionsGenerated + _t('zs_gen_ok'), 'success');
    } else {
      alert('✅ ' + result.questionsGenerated + _t('zs_gen_ok'));
    }
    
    // Reload the questions list
    if (typeof loadGeneratedQuestions === 'function') {
      await loadGeneratedQuestions();
    }
    
    // Reload summaries to update the count
    if (typeof loadZoomSummaries === 'function') {
      await loadZoomSummaries();
    }
    
  } catch (error) {
    console.error('Error generating questions:', error);
    if (typeof showNotification === 'function') {
      showNotification('❌ Error: ' + error.message, 'error');
    } else {
      alert('❌ ' + _t('zs_gen_err') + error.message);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText || _t('zsum_generate_btn');
      btn.style.opacity = '1';
    }
  }
}

// ===== MATERIAL EDUCATIVO =====

// Lazy-load pdf.js
var _pdfJsLoaded = false;
