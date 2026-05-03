// ============================================
// ADMIN: LIBROS, EXAMENES, PAGOS
// ============================================
if (typeof _addTranslations === 'function') _addTranslations({
  adm_be_select_student: { es: 'Seleccionar estudiante...', en: 'Select student...' },
  adm_be_all_students: { es: 'Todos los estudiantes', en: 'All students' },
  adm_be_no_file: { es: 'Ning\u00FAn archivo seleccionado', en: 'No file selected' },
  adm_be_write_title: { es: 'Escribe un t\u00EDtulo para el material', en: 'Enter a title for the material' },
  adm_be_select_file: { es: 'Selecciona un archivo', en: 'Select a file' },
  adm_be_file_too_big: { es: 'El archivo es muy grande (m\u00E1x ', en: 'File is too large (max ' },
  adm_be_your_file: { es: 'Tu archivo: ', en: 'Your file: ' },
  adm_be_uploading: { es: 'Subiendo ', en: 'Uploading ' },
  adm_be_uploading_progress: { es: 'Subiendo... ', en: 'Uploading... ' },
  adm_be_server_error: { es: 'Error del servidor: ', en: 'Server error: ' },
  adm_be_connection_error: { es: 'Error de conexi\u00F3n. Verifica tu internet y vuelve a intentar.', en: 'Connection error. Check your internet and try again.' },
  adm_be_timeout_error: { es: 'Tiempo agotado. El archivo es muy grande para tu conexi\u00F3n actual.', en: 'Timeout. The file is too large for your current connection.' },
  adm_be_saving_record: { es: 'Guardando registro...', en: 'Saving record...' },
  adm_be_upload_success: { es: 'Material subido exitosamente!', en: 'Material uploaded successfully!' },
  adm_be_loading: { es: 'Cargando...', en: 'Loading...' },
  adm_be_no_material: { es: 'No hay material disponible a\u00FAn', en: 'No material available yet' },
  adm_be_for: { es: 'Para: ', en: 'For: ' },
  adm_be_view: { es: 'Ver', en: 'View' },
  adm_be_error_books: { es: 'Error cargando libros', en: 'Error loading books' },
  adm_be_delete_material: { es: '\u00BFEliminar este material?', en: 'Delete this material?' },
  adm_be_error_delete: { es: 'Error al eliminar: ', en: 'Error deleting: ' },
  adm_be_select_student_alert: { es: 'Selecciona un estudiante', en: 'Select a student' },
  adm_be_write_exam_title: { es: 'Escribe un t\u00EDtulo para el examen', en: 'Enter a title for the exam' },
  adm_be_exam_assigned: { es: 'Examen asignado a ', en: 'Exam assigned to ' },
  adm_be_no_exams: { es: 'No hay ex\u00E1menes asignados', en: 'No assigned exams' },
  adm_be_no_deadline: { es: 'Sin fecha l\u00EDmite', en: 'No deadline' },
  adm_be_deadline: { es: 'L\u00EDmite: ', en: 'Deadline: ' },
  adm_be_complete: { es: 'Completar', en: 'Complete' },
  adm_be_error_exams: { es: 'Error cargando ex\u00E1menes', en: 'Error loading exams' },
  adm_be_grade_prompt: { es: 'Calificaci\u00F3n (0-100):', en: 'Grade (0-100):' },
  adm_be_delete_exam: { es: '\u00BFEliminar este examen? Esta acci\u00F3n no se puede deshacer.', en: 'Delete this exam? This action cannot be undone.' },
  adm_be_valid_amount: { es: 'Ingresa un monto v\u00E1lido', en: 'Enter a valid amount' },
  adm_be_write_concept: { es: 'Escribe un concepto de pago', en: 'Enter a payment concept' },
  adm_be_payment_registered: { es: 'Pago de $', en: 'Payment of $' },
  adm_be_registered_for: { es: ' registrado para ', en: ' registered for ' },
  adm_be_no_payments: { es: 'No hay records de pagos', en: 'No payment records' },
  adm_be_total: { es: 'Total: $', en: 'Total: $' },
  adm_be_payments: { es: ' pagos', en: ' payments' },
  adm_be_error_payments: { es: 'Error cargando pagos', en: 'Error loading payments' },
  adm_be_delete_payment: { es: '\u00BFEliminar este registro de pago? Esta acci\u00F3n no se puede deshacer.', en: 'Delete this payment record? This action cannot be undone.' },
  adm_be_no_books: { es: 'No hay libros disponibles a\u00FAn', en: 'No books available yet' },
  adm_be_download: { es: 'Descargar', en: 'Download' },
  adm_be_error_loading_books: { es: 'Error cargando libros', en: 'Error loading books' },
  adm_be_no_assigned_exams: { es: 'No tienes ex\u00E1menes asignados', en: 'You have no assigned exams' },
  adm_be_grade: { es: 'Calificaci\u00F3n: ', en: 'Grade: ' },
  adm_be_error_loading_exams: { es: 'Error cargando ex\u00E1menes', en: 'Error loading exams' },
  adm_be_error_loading_payments: { es: 'Error cargando pagos', en: 'Error loading payments' },
});

// --- Populate student dropdowns ---
async function populateStudentDropdowns(){
  try {
    var res = await usersDataAdmin('admin_list', { fields: ['email','nombre'], limit: 5000 });
    if(res.data && res.data.length > 0){
      var opts = '<option value="">' + _t('adm_be_select_student', 'Seleccionar estudiante...') + '</option>';
      var optsAll = '<option value="todos">\uD83D\uDC65 ' + _t('adm_be_all_students', 'Todos los estudiantes') + '</option>';
      res.data.forEach(function(s){
        var label = _escHtml((s.nombre || '') + ' (' + s.email + ')');
        var safeEmail = _escHtml(s.email);
        opts += '<option value="' + safeEmail + '">' + label + '</option>';
        optsAll += '<option value="' + safeEmail + '">' + label + '</option>';
      });
      var examSel = document.getElementById('examStudentEmail');
      var paySel = document.getElementById('paymentStudentEmail');
      var bookSel = document.getElementById('bookAssignTo');
      if(examSel) examSel.innerHTML = opts;
      if(paySel) paySel.innerHTML = opts;
      if(bookSel) bookSel.innerHTML = optsAll;
    }
  } catch(e){ console.log('populateStudentDropdowns error:', e); }
}

// --- LIBROS / PDFs ---
function previewBookFile(input){
  var span = document.getElementById('bookFileName');
  if(input.files && input.files[0]){
    var f = input.files[0];
    var sizeMB = (f.size / 1024 / 1024).toFixed(2);
    span.textContent = f.name + ' (' + sizeMB + ' MB)';
    span.style.color = '#3498db';
  } else {
    span.textContent = _t('adm_be_no_file', 'Ning\u00FAn archivo seleccionado');
    span.style.color = '#94a3b8';
  }
}

async function uploadBook(){
  var title = document.getElementById('bookTitle').value.trim();
  var fileInput = document.getElementById('bookFileInput');
  if(!title){ alert(_t('adm_be_write_title', 'Escribe un t\u00EDtulo para el material')); return; }
  if(!fileInput.files || !fileInput.files[0]){ alert(_t('adm_be_select_file', 'Selecciona un archivo')); return; }
  var file = fileInput.files[0];
  var maxMB = 250;
  if(file.size > maxMB * 1024 * 1024){ alert(_t('adm_be_file_too_big', 'El archivo es muy grande (m\u00E1x ') + maxMB + 'MB). ' + _t('adm_be_your_file', 'Tu archivo: ') + (file.size / 1024 / 1024).toFixed(1) + 'MB'); return; }

  var prog = document.getElementById('bookUploadProgress');
  var bar = document.getElementById('bookProgressBar');
  var status = document.getElementById('bookUploadStatus');
  prog.style.display = 'block';
  bar.style.width = '0%';
  bar.style.background = '#3498db';
  var sizeMB = (file.size / 1024 / 1024).toFixed(1);
  status.textContent = _t('adm_be_uploading', 'Subiendo ') + sizeMB + ' MB...';
  status.style.color = '#3498db';

  try {
    var fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    var path = 'books/' + fileName;

    // Use XHR for real progress tracking on large files
    var uploadUrl = SUPABASE_URL + '/storage/v1/object/school-files/' + path;
    await new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_KEY);
      xhr.setRequestHeader('x-upsert', 'false');

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          var pct = Math.round((e.loaded / e.total) * 90); // 0-90% for upload
          bar.style.width = pct + '%';
          var loadedMB = (e.loaded / 1024 / 1024).toFixed(1);
          status.textContent = _t('adm_be_uploading_progress', 'Subiendo... ') + loadedMB + ' / ' + sizeMB + ' MB (' + pct + '%)';
        }
      };

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          var errMsg = _t('adm_be_server_error', 'Error del servidor: ') + xhr.status;
          try { var errData = JSON.parse(xhr.responseText); errMsg = errData.message || errData.error || errMsg; } catch(e) { console.warn('[AdminBooksExams]', e.message || e); }
          reject(new Error(errMsg));
        }
      };

      xhr.onerror = function() { reject(new Error(_t('adm_be_connection_error', 'Error de conexi\u00F3n. Verifica tu internet y vuelve a intentar.'))); };
      xhr.ontimeout = function() { reject(new Error(_t('adm_be_timeout_error', 'Tiempo agotado. El archivo es muy grande para tu conexi\u00F3n actual.'))); };
      xhr.timeout = 600000; // 10 minutes for large files

      xhr.send(file);
    });

    bar.style.width = '95%';
    status.textContent = _t('adm_be_saving_record', 'Guardando registro...');
    var publicUrl = supabaseClient.storage.from('school-files').getPublicUrl(path).data.publicUrl;

    var desc = document.getElementById('bookDescription').value.trim();
    var cat = document.getElementById('bookCategory').value;
    var assignTo = document.getElementById('bookAssignTo').value;

    var insertRes = await supabaseClient.from('student_books').insert({
      titulo: title,
      descripcion: desc || null,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      categoria: cat,
      asignado_a: assignTo,
      subido_por: 'admin'
    });
    if(insertRes.error) throw insertRes.error;

    bar.style.width = '100%';
    bar.style.background = '#2ecc71';
    status.textContent = '\u2705 ' + _t('adm_be_upload_success', 'Material subido exitosamente!') + ' (' + sizeMB + ' MB)';
    status.style.color = '#2ecc71';
    var pushRecipient = assignTo === 'todos' ? 'all' : (assignTo ? [assignTo] : 'all');
    notifyStudents('Nuevo Material', title, 'material', pushRecipient);
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookDescription').value = '';
    fileInput.value = '';
    document.getElementById('bookFileName').textContent = _t('adm_be_no_file', 'Ning\u00FAn archivo seleccionado');
    document.getElementById('bookFileName').style.color = '#94a3b8';
    setTimeout(function(){ prog.style.display = 'none'; status.style.color = '#3498db'; }, 3000);
    loadAdminBooks();
  } catch(e){
    bar.style.width = '100%';
    bar.style.background = '#e74c3c';
    status.textContent = '❌ Error: ' + (e.message || e);
    status.style.color = '#e74c3c';
    console.error('uploadBook error:', e);
  }
}

async function loadAdminBooks(){
  var container = document.getElementById('adminBooksList');
  if(!container) return;
  container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_loading', 'Cargando...') + '</span>';
  try {
    var res = await supabaseClient.from('student_books').select('*').eq('activo', true).order('created_at', {ascending: false});
    if(!res.data || res.data.length === 0){
      container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_no_material', 'No hay material disponible a\u00FAn') + '</span>';
      return;
    }
    var html = '<div style="display:grid;gap:10px;">';
    res.data.forEach(function(b){
      var sizeMB = b.file_size ? (b.file_size / 1024 / 1024).toFixed(1) + ' MB' : '';
      var fecha = new Date(b.created_at).toLocaleDateString('es-MX');
      html += '<div style="background:rgba(52,152,219,0.08);border:1px solid rgba(52,152,219,0.2);border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">';
      html += '<div><strong style="color:#3498db;">' + _escHtml(b.titulo) + '</strong>';
      html += '<div style="font-size:0.8em;color:#64748b;">' + _escHtml(b.categoria) + ' \u2022 ' + sizeMB + ' \u2022 ' + fecha + ' \u2022 ' + _t('adm_be_for', 'Para: ') + _escHtml(b.asignado_a) + '</div>';
      if(b.descripcion) html += '<div style="font-size:0.8em;color:#94a3b8;margin-top:4px;">' + _escHtml(b.descripcion) + '</div>';
      html += '</div>';
      html += '<div style="display:flex;gap:6px;">';
      html += '<a href="' + _escHtml(b.file_url) + '" target="_blank" style="padding:6px 12px;background:#3498db;color:#fff;border-radius:6px;text-decoration:none;font-size:0.85em;">\uD83D\uDCE5 ' + _t('adm_be_view', 'Ver') + '</a>';
      html += '<button onclick="deleteBook(\'' + b.id + '\')" style="padding:6px 12px;background:#e74c3c;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85em;">🗑️</button>';
      html += '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  } catch(e){ container.innerHTML = '<span style="color:#e74c3c;">' + _t('adm_be_error_books', 'Error cargando libros') + '</span>'; }
}

async function deleteBook(id){
  if(!confirm(_t('adm_be_delete_material', '\u00BFEliminar este material?'))) return;
  try {
    var res = await supabaseClient.from('student_books').update({activo: false}).eq('id', id);
    if(res.error) throw res.error;
  } catch(e){ alert(_t('adm_be_error_delete', 'Error al eliminar: ') + (e.message || e)); }
  loadAdminBooks();
}

// --- EXAMENES ASIGNADOS ---
async function assignExam(){
  var email = document.getElementById('examStudentEmail').value;
  var title = document.getElementById('examTitle').value.trim();
  if(!email){ alert(_t('adm_be_select_student_alert', 'Selecciona un estudiante')); return; }
  if(!title){ alert(_t('adm_be_write_exam_title', 'Escribe un t\u00EDtulo para el examen')); return; }

  var desc = document.getElementById('examDescription').value.trim();
  var deadline = document.getElementById('examDeadline').value;
  var selEl = document.getElementById('examStudentEmail');
  var selOpt = selEl && selEl.selectedIndex >= 0 ? selEl.options[selEl.selectedIndex] : null;
  var studentName = selOpt ? (selOpt.text || '').split('(')[0].trim() : email;

  try {
    var res = await supabaseClient.from('assigned_exams').insert({
      student_email: email,
      student_name: studentName,
      titulo: title,
      descripcion: desc || null,
      fecha_limite: deadline ? new Date(deadline).toISOString() : null
    });
    if(res.error) throw res.error;
    alert('\u2705 ' + _t('adm_be_exam_assigned', 'Examen asignado a ') + studentName);
    notifyStudents('Examen Asignado', title, 'examen', [email]);
    document.getElementById('examTitle').value = '';
    document.getElementById('examDescription').value = '';
    document.getElementById('examDeadline').value = '';
    loadAdminExams();
  } catch(e){ alert('Error: ' + (e.message || e)); }
}

async function loadAdminExams(){
  var container = document.getElementById('adminExamsList');
  if(!container) return;
  container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_loading', 'Cargando...') + '</span>';
  try {
    var res = await supabaseClient.from('assigned_exams').select('*').order('created_at', {ascending: false}).limit(50);
    if(!res.data || res.data.length === 0){
      container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_no_exams', 'No hay ex\u00E1menes asignados') + '</span>';
      return;
    }
    var html = '<div style="display:grid;gap:10px;">';
    res.data.forEach(function(e){
      var fecha = new Date(e.created_at).toLocaleDateString('es-MX');
      var deadline = e.fecha_limite ? new Date(e.fecha_limite).toLocaleDateString('es-MX') : _t('adm_be_no_deadline', 'Sin fecha l\u00EDmite');
      var estadoColors = {pendiente:'#f39c12', completado:'#2ecc71', vencido:'#e74c3c'};
      var estadoColor = estadoColors[e.estado] || '#94a3b8';
      html += '<div style="background:rgba(155,89,182,0.08);border:1px solid rgba(155,89,182,0.2);border-radius:10px;padding:12px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">';
      html += '<div><strong style="color:#9b59b6;">' + _escHtml(e.titulo) + '</strong>';
      html += '<div style="font-size:0.8em;color:#64748b;">\uD83D\uDC64 ' + _escHtml(e.student_name || e.student_email) + ' \u2022 \uD83D\uDCC5 ' + fecha + ' \u2022 ' + _t('adm_be_deadline', 'L\u00EDmite: ') + deadline + '</div>';
      if(e.descripcion) html += '<div style="font-size:0.8em;color:#94a3b8;margin-top:4px;">' + _escHtml(e.descripcion) + '</div>';
      html += '</div>';
      html += '<div style="display:flex;gap:6px;align-items:center;">';
      html += '<span style="padding:4px 10px;background:' + estadoColor + ';color:#fff;border-radius:12px;font-size:0.75em;font-weight:bold;">' + _escHtml(e.estado || '').toUpperCase() + '</span>';
      if(e.estado === 'pendiente'){
        html += '<button onclick="markExamComplete(\'' + e.id + '\')" style="padding:4px 10px;background:#2ecc71;color:#000;border:none;border-radius:6px;font-size:0.8em;cursor:pointer;">\u2705 ' + _t('adm_be_complete', 'Completar') + '</button>';
      }
      html += '<button onclick="deleteExam(\'' + e.id + '\')" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-size:0.8em;cursor:pointer;">🗑️</button>';
      html += '</div></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  } catch(e){ container.innerHTML = '<span style="color:#e74c3c;">' + _t('adm_be_error_exams', 'Error cargando ex\u00E1menes') + '</span>'; }
}

async function markExamComplete(id){
  var cal = prompt(_t('adm_be_grade_prompt', 'Calificaci\u00F3n (0-100):'));
  if(cal === null) return;
  var calNum = parseInt(cal) || 0;
  if(calNum < 0) calNum = 0;
  if(calNum > 100) calNum = 100;
  try {
    var res = await supabaseClient.from('assigned_exams').update({estado: 'completado', calificacion: calNum, updated_at: new Date().toISOString()}).eq('id', id);
    if(res.error) throw res.error;
  } catch(e){ alert('Error: ' + (e.message || e)); }
  loadAdminExams();
}

async function deleteExam(id){
  if(!confirm(_t('adm_be_delete_exam', '\u00BFEliminar este examen? Esta acci\u00F3n no se puede deshacer.'))) return;
  try {
    var res = await supabaseClient.from('assigned_exams').delete().eq('id', id);
    if(res.error) throw res.error;
  } catch(e){ alert(_t('adm_be_error_delete', 'Error al eliminar: ') + (e.message || e)); }
  loadAdminExams();
}

// --- RECORDS DE PAGOS ---
async function registerPayment(){
  var email = document.getElementById('paymentStudentEmail').value;
  var amount = parseFloat(document.getElementById('paymentAmount').value);
  var concept = document.getElementById('paymentConcept').value.trim();
  if(!email){ alert(_t('adm_be_select_student_alert', 'Selecciona un estudiante')); return; }
  if(!amount || amount <= 0){ alert(_t('adm_be_valid_amount', 'Ingresa un monto v\u00E1lido')); return; }
  if(!concept){ alert(_t('adm_be_write_concept', 'Escribe un concepto de pago')); return; }

  var method = document.getElementById('paymentMethod').value;
  var note = document.getElementById('paymentNote').value.trim();
  var selEl = document.getElementById('paymentStudentEmail');
  var selOpt = selEl && selEl.selectedIndex >= 0 ? selEl.options[selEl.selectedIndex] : null;
  var studentName = selOpt ? (selOpt.text || '').split('(')[0].trim() : email;

  try {
    var _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    var _adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
    var _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
      body: JSON.stringify({
        action: 'admin_insert',
        admin_email: _adminEmail,
        payment: {
          student_email: email,
          student_name: studentName,
          monto: amount,
          concepto: concept,
          metodo_pago: method,
          nota: note || null,
          fecha_pago: new Date().toISOString()
        }
      }),
    });
    var res = await _resp.json();
    if(!_resp.ok || res.error) throw new Error(res.error || 'insert failed');
    alert('\u2705 ' + _t('adm_be_payment_registered', 'Pago de $') + amount.toFixed(2) + _t('adm_be_registered_for', ' registrado para ') + studentName);
    notifyStudents('Pago Confirmado', 'Pago de $' + amount.toFixed(2) + ' confirmado — ' + concept, 'payment', [email]);
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentConcept').value = '';
    document.getElementById('paymentNote').value = '';
    loadAdminPayments();
  } catch(e){ alert('Error: ' + (e.message || e)); }
}

async function loadAdminPayments(){
  var container = document.getElementById('adminPaymentsList');
  if(!container) return;
  container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_loading', 'Cargando...') + '</span>';
  try {
    var searchEmail = (document.getElementById('paymentSearchEmail') || {}).value || '';
    var _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    var _adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
    var _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
      body: JSON.stringify({ action: 'admin_list', admin_email: _adminEmail, search_email: searchEmail.trim() }),
    });
    var res = await _resp.json();
    if(!res.data || res.data.length === 0){
      container.innerHTML = '<span style="color:#64748b;">' + _t('adm_be_no_payments', 'No hay records de pagos') + '</span>';
      return;
    }
    var total = 0;
    var html = '';
    res.data.forEach(function(p){ total += parseFloat(p.monto) || 0; });
    html += '<div style="background:rgba(46,204,113,0.15);border-radius:10px;padding:10px;margin-bottom:10px;text-align:center;">';
    html += '<span style="color:#2ecc71;font-size:1.3em;font-weight:bold;">' + _t('adm_be_total', 'Total: $') + total.toFixed(2) + '</span>';
    html += '<span style="color:#64748b;font-size:0.85em;margin-left:10px;">(' + res.data.length + _t('adm_be_payments', ' pagos') + ')</span></div>';
    html += '<div style="display:grid;gap:8px;">';
    res.data.forEach(function(p){
      var fecha = new Date(p.fecha_pago).toLocaleDateString('es-MX');
      var methodIcons = {efectivo:'💵',stripe:'💳',zelle:'📱',check:'🏦',otro:'📝'};
      var icon = methodIcons[p.metodo_pago] || '💰';
      html += '<div style="background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.2);border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">';
      html += '<div><strong style="color:#2ecc71;">$' + parseFloat(p.monto).toFixed(2) + '</strong> ' + icon;
      html += '<div style="font-size:0.8em;color:#64748b;">👤 ' + _escHtml(p.student_name || p.student_email) + ' • ' + _escHtml(p.concepto) + ' • ' + fecha + '</div>';
      if(p.nota) html += '<div style="font-size:0.75em;color:#94a3b8;">📝 ' + _escHtml(p.nota) + '</div>';
      html += '</div>';
      html += '<button onclick="deletePayment(\'' + p.id + '\')" style="padding:4px 10px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-size:0.8em;cursor:pointer;">🗑️</button>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  } catch(e){ container.innerHTML = '<span style="color:#e74c3c;">' + _t('adm_be_error_payments', 'Error cargando pagos') + '</span>'; }
}

async function deletePayment(id){
  if(!confirm(_t('adm_be_delete_payment', '\u00BFEliminar este registro de pago? Esta acci\u00F3n no se puede deshacer.'))) return;
  try {
    var _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    var _adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
    var _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
      body: JSON.stringify({ action: 'admin_delete', admin_email: _adminEmail, id: id }),
    });
    var res = await _resp.json();
    if(!_resp.ok || res.error) throw new Error(res.error || 'delete failed');
  } catch(e){ alert(_t('adm_be_error_delete', 'Error al eliminar: ') + (e.message || e)); }
  loadAdminPayments();
}

// --- Load student data in student profile ---
async function loadStudentBooks(email){
  var container = document.getElementById('studentWorkbooks');
  if(!container) return;
  try {
    var res = await supabaseClient.from('student_books').select('*').eq('activo', true).or('asignado_a.eq.todos,asignado_a.eq.' + email).order('created_at', {ascending: false});
    if(!res.data || res.data.length === 0){
      container.innerHTML = _t('adm_be_no_books', 'No hay libros disponibles a\u00FAn');
      return;
    }
    var html = '';
    res.data.forEach(function(b){
      html += '<div style="background:#f8fafc;border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
      html += '<div><strong>' + _escHtml(b.titulo) + '</strong><br><span style="font-size:0.8em;color:#64748b;">' + _escHtml(b.categoria) + '</span></div>';
      html += '<a href="' + _escHtml(b.file_url) + '" target="_blank" style="padding:8px 16px;background:#3498db;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">\uD83D\uDCE5 ' + _t('adm_be_download', 'Descargar') + '</a>';
      html += '</div>';
    });
    container.innerHTML = html;
    checkNewContent('student_books', res.data, function(item) {
      return { type: 'material', message: '📚 Nuevo material: ' + (item.titulo || 'Material'), icon: '📚' };
    });
  } catch(e){ container.innerHTML = _t('adm_be_error_loading_books', 'Error cargando libros'); }
}

async function loadStudentAssignedExams(email){
  var container = document.getElementById('studentExamsList');
  if(!container) return;
  try {
    var res = await supabaseClient.from('assigned_exams').select('*').eq('student_email', email).order('created_at', {ascending: false});
    if(!res.data || res.data.length === 0){
      container.innerHTML = _t('adm_be_no_assigned_exams', 'No tienes ex\u00E1menes asignados');
      return;
    }
    var html = '';
    res.data.forEach(function(e){
      var estadoColors = {pendiente:'#f39c12', completado:'#2ecc71', vencido:'#e74c3c'};
      var color = estadoColors[e.estado] || '#94a3b8';
      html += '<div style="background:#f8fafc;border-radius:10px;padding:12px;margin-bottom:8px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html += '<strong>' + _escHtml(e.titulo) + '</strong>';
      html += '<span style="padding:3px 10px;background:' + color + ';color:#fff;border-radius:12px;font-size:0.75em;">' + _escHtml(e.estado || '').toUpperCase() + '</span></div>';
      if(e.descripcion) html += '<p style="font-size:0.85em;color:#64748b;margin:6px 0 0 0;">' + _escHtml(e.descripcion) + '</p>';
      if(e.calificacion !== null && e.estado === 'completado') html += '<p style="font-size:0.9em;color:#2ecc71;margin:4px 0 0 0;font-weight:bold;">' + _t('adm_be_grade', 'Calificaci\u00F3n: ') + e.calificacion + '/100</p>';
      html += '</div>';
    });
    container.innerHTML = html;
  } catch(e){ container.innerHTML = _t('adm_be_error_loading_exams', 'Error cargando ex\u00E1menes'); }
}

async function loadStudentPaymentsLegacy(email){
  var container = document.getElementById('studentPaymentRecords');
  if(!container) return;
  try {
    var _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
    var _adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
    var _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
      body: JSON.stringify({ action: 'admin_get_for_student', admin_email: _adminEmail, student_email: email }),
    });
    var res = await _resp.json();
    if(!res.data || res.data.length === 0){
      container.innerHTML = _t('adm_be_no_payments', 'No hay records de pagos');
      return;
    }
    var html = '';
    res.data.forEach(function(p){
      var fecha = new Date(p.fecha_pago).toLocaleDateString('es-MX');
      html += '<div style="background:#f8fafc;border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">';
      html += '<div><strong style="color:#2ecc71;">$' + parseFloat(p.monto).toFixed(2) + '</strong> - ' + _escHtml(p.concepto);
      html += '<div style="font-size:0.8em;color:#64748b;">' + fecha + ' \u2022 ' + _escHtml(p.metodo_pago) + '</div></div>';
      html += '</div>';
    });
    container.innerHTML = html;
  } catch(e){ container.innerHTML = _t('adm_be_error_loading_payments', 'Error cargando pagos'); }
}

// Hook into admin dashboard load
var _origLoadAdmin = window.loadAdminDashboard;
window.loadAdminDashboard = function(){
  if(typeof _origLoadAdmin === 'function') _origLoadAdmin();
  populateStudentDropdowns();
  loadAdminBooks();
  loadAdminExams();
  loadAdminPayments();
};
// Auto-load handled by loadAdminDashboard() wrapper above
