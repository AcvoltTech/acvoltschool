if (typeof _addTranslations === 'function') _addTranslations({
  qb_selected: { es: ' seleccionadas', en: ' selected' },
  qb_question_s: { es: ' pregunta', en: ' question' },
  qb_questions_s: { es: ' preguntas', en: ' questions' },
  qb_confirm_del_bulk: { es: ' permanentemente?', en: ' permanently?' },
  qb_deleted_bulk: { es: ' preguntas eliminadas', en: ' questions deleted' },
  qb_approved_bulk: { es: ' preguntas aprobadas', en: ' questions approved' },
  qb_rejected_bulk: { es: ' preguntas rechazadas', en: ' questions rejected' },
  qb_no_questions: { es: 'No hay preguntas. Genera preguntas desde resúmenes de Zoom o créalas manualmente.', en: 'No questions. Generate questions from Zoom summaries or create them manually.' },
  qb_select_all: { es: 'Seleccionar todas', en: 'Select all' },
  qb_approve: { es: 'Aprobar', en: 'Approve' },
  qb_reject: { es: 'Rechazar', en: 'Reject' },
  qb_delete: { es: 'Eliminar', en: 'Delete' },
  qb_with_image: { es: 'Con imagen', en: 'With image' },
  qb_correct: { es: 'Correcta', en: 'Correct' },
  qb_explanation: { es: 'Explicación', en: 'Explanation' },
  qb_instructor_notes: { es: 'Notas del Instructor', en: 'Instructor Notes' },
  qb_edit: { es: 'Editar', en: 'Edit' },
  qb_consult_ai: { es: 'Consultar IA', en: 'Consult AI' },
  qb_confirm_del: { es: '¿Eliminar esta pregunta permanentemente?', en: 'Delete this question permanently?' },
  qb_deleted: { es: 'Pregunta eliminada', en: 'Question deleted' },
  qb_del_err: { es: 'Error eliminando pregunta: ', en: 'Error deleting question: ' },
  qb_analyzing: { es: 'Analizando preguntas...', en: 'Analyzing questions...' },
  qb_need_2: { es: 'Se necesitan al menos 2 preguntas para comparar.', en: 'At least 2 questions are needed to compare.' },
  qb_dup_title: { es: 'Detección de Duplicados', en: 'Duplicate Detection' },
  qb_analyzed: { es: 'Analizadas: ', en: 'Analyzed: ' },
  qb_groups: { es: 'Grupos: ', en: 'Groups: ' },
  qb_duplicates: { es: 'Duplicados: ', en: 'Duplicates: ' },
  qb_no_dups: { es: 'No se encontraron preguntas duplicadas.', en: 'No duplicate questions found.' },
  qb_select_all_btn: { es: 'Seleccionar Todo', en: 'Select All' },
  qb_deselect: { es: 'Deseleccionar', en: 'Deselect' },
  qb_del_selected: { es: 'Eliminar Seleccionados', en: 'Delete Selected' },
  qb_group_label: { es: 'Grupo ', en: 'Group ' },
  qb_original: { es: 'Original', en: 'Original' },
  qb_dup_err: { es: 'Error detectando duplicados: ', en: 'Error detecting duplicates: ' },
  qb_no_sel_del: { es: 'No hay preguntas seleccionadas para eliminar.', en: 'No questions selected to delete.' },
  qb_confirm_del_sel: { es: ' preguntas seleccionadas? Esta acción no se puede deshacer.', en: ' selected questions? This action cannot be undone.' },
  qb_dups_deleted: { es: ' duplicados eliminados', en: ' duplicates deleted' },
  qb_dup_del_err: { es: 'Error eliminando duplicados: ', en: 'Error deleting duplicates: ' },
  qb_create_q: { es: 'Crear Pregunta', en: 'Create Question' },
  qb_edit_q: { es: 'Editar Pregunta', en: 'Edit Question' },
  qb_not_found: { es: 'Pregunta no encontrada en caché', en: 'Question not found in cache' },
  qb_question_label: { es: 'Pregunta', en: 'Question' },
  qb_img_label: { es: 'Imagen de la pregunta (opcional — para identificación de partes/productos)', en: 'Question image (optional — for identifying parts/products)' },
  qb_upload_img: { es: 'Subir imagen', en: 'Upload image' },
  qb_remove_img: { es: 'Quitar imagen', en: 'Remove image' },
  qb_option_a: { es: 'Opción A', en: 'Option A' },
  qb_option_b: { es: 'Opción B', en: 'Option B' },
  qb_option_c: { es: 'Opción C', en: 'Option C' },
  qb_option_d: { es: 'Opción D', en: 'Option D' },
  qb_correct_answer: { es: 'Respuesta Correcta', en: 'Correct Answer' },
  qb_category: { es: 'Categoría', en: 'Category' },
  qb_difficulty: { es: 'Dificultad', en: 'Difficulty' },
  qb_beginner: { es: 'Principiante', en: 'Beginner' },
  qb_intermediate: { es: 'Intermedio', en: 'Intermediate' },
  qb_advanced: { es: 'Avanzado', en: 'Advanced' },
  qb_elite: { es: 'Elite', en: 'Elite' },
  qb_expl_label: { es: 'Explicación', en: 'Explanation' },
  qb_notes_label: { es: 'Notas / Referencias del Instructor', en: 'Instructor Notes / References' },
  qb_notes_ph: { es: 'Notas, referencias bibliográficas, enlaces...', en: 'Notes, bibliographic references, links...' },
  qb_cancel: { es: 'Cancelar', en: 'Cancel' },
  qb_save: { es: 'Guardar', en: 'Save' },
  qb_img_max: { es: 'Imagen máximo 10MB', en: 'Image max 10MB' },
  qb_uploading: { es: 'Subiendo imagen...', en: 'Uploading image...' },
  qb_img_uploaded: { es: 'Imagen subida', en: 'Image uploaded' },
  qb_q_required: { es: 'La pregunta es obligatoria', en: 'The question is required' },
  qb_opts_required: { es: 'Todas las opciones son obligatorias', en: 'All options are required' },
  qb_save_err: { es: 'Error al guardar: ', en: 'Error saving: ' },
  qb_export_soon: { es: 'Exportar preguntas a JSON: Próximamente', en: 'Export questions to JSON: Coming soon' },
});

function filterByStatCard(type) {
  var catDD = document.getElementById('zmQFilterCategory');
  var statusDD = document.getElementById('zmQFilterStatus');
  if (type === 'total') {
    if (catDD) catDD.value = 'all';
    if (statusDD) statusDD.value = 'all';
    _zmActiveStatFilter = null;
  } else if (type === 'approved') {
    if (catDD) catDD.value = 'all';
    if (statusDD) statusDD.value = 'approved';
    _zmActiveStatFilter = 'approved';
  } else if (type === 'pending') {
    if (catDD) catDD.value = 'all';
    if (statusDD) statusDD.value = 'pending';
    _zmActiveStatFilter = 'pending';
  } else if (type === 'from_zoom') {
    if (catDD) catDD.value = 'all';
    if (statusDD) statusDD.value = 'all';
    _zmActiveStatFilter = 'from_zoom';
  }
  _updateStatCardStyles();
  loadGeneratedQuestions();
}

function _updateStatCardStyles() {
  var cards = {
    total: { id: 'zmStatCardTotal', defaultBorder: '#bbf7d0', activeBorder: '#16a34a' },
    approved: { id: 'zmStatCardApproved', defaultBorder: '#bfdbfe', activeBorder: '#2563eb' },
    pending: { id: 'zmStatCardPending', defaultBorder: '#fde68a', activeBorder: '#d97706' },
    from_zoom: { id: 'zmStatCardFromZoom', defaultBorder: '#e9d5ff', activeBorder: '#7c3aed' }
  };
  for (var key in cards) {
    var el = document.getElementById(cards[key].id);
    if (el) {
      el.style.borderColor = (_zmActiveStatFilter === key) ? cards[key].activeBorder : cards[key].defaultBorder;
      el.style.boxShadow = (_zmActiveStatFilter === key) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none';
    }
  }
}

// ===== BULK SELECTION STATE =====
var _zmSelectedQuestionIds = new Set();

function _updateBulkToolbar() {
  var toolbar = document.getElementById('zmBulkToolbar');
  if (!toolbar) return;
  var count = _zmSelectedQuestionIds.size;
  if (count === 0) {
    toolbar.style.display = 'none';
    return;
  }
  toolbar.style.display = 'flex';
  var countEl = document.getElementById('zmBulkCount');
  if (countEl) countEl.textContent = count + (count > 1 ? _t('qbank_q_count_plural',' preguntas seleccionadas') : _t('qbank_q_count_singular',' pregunta seleccionada'));
}

function toggleBulkQuestion(id, ev) {
  if (ev) ev.stopPropagation();
  if (_zmSelectedQuestionIds.has(id)) _zmSelectedQuestionIds.delete(id);
  else _zmSelectedQuestionIds.add(id);
  var cb = document.getElementById('zmQCheck-' + id);
  if (cb) cb.checked = _zmSelectedQuestionIds.has(id);
  _updateSelectAllCheckbox();
  _updateBulkToolbar();
}

function toggleSelectAllQuestions() {
  var masterCb = document.getElementById('zmSelectAllCb');
  var checkAll = masterCb ? masterCb.checked : true;
  var allCbs = document.querySelectorAll('.zmQBulkCheck');
  allCbs.forEach(function(cb) {
    var id = cb.getAttribute('data-qid');
    if (checkAll) _zmSelectedQuestionIds.add(id);
    else _zmSelectedQuestionIds.delete(id);
    cb.checked = checkAll;
  });
  _updateBulkToolbar();
}

function _updateSelectAllCheckbox() {
  var masterCb = document.getElementById('zmSelectAllCb');
  if (!masterCb) return;
  var allCbs = document.querySelectorAll('.zmQBulkCheck');
  if (allCbs.length === 0) { masterCb.checked = false; return; }
  var allChecked = true;
  allCbs.forEach(function(cb) { if (!cb.checked) allChecked = false; });
  masterCb.checked = allChecked;
}

async function bulkDeleteQuestions() {
  var ids = Array.from(_zmSelectedQuestionIds);
  if (ids.length === 0) return;
  if (!confirm('¿Eliminar ' + ids.length + _t('qb_questions_s') + _t('qb_confirm_del_bulk'))) return;
  try {
    for (var i = 0; i < ids.length; i += 20) {
      var batch = ids.slice(i, i + 20);
      var res = await supabaseClient.from('zm_generated_questions').delete().in('id', batch);
      if (res.error) throw res.error;
    }
    _zmSelectedQuestionIds.clear();
    if (typeof showNotification === 'function') showNotification('🗑️ ' + ids.length + _t('qb_deleted_bulk'), 'success');
    loadGeneratedQuestions();
  } catch(e) { alert('Error: ' + e.message); }
}

async function bulkApproveQuestions() {
  var ids = Array.from(_zmSelectedQuestionIds);
  if (ids.length === 0) return;
  try {
    for (var i = 0; i < ids.length; i += 20) {
      var batch = ids.slice(i, i + 20);
      await supabaseClient.from('zm_generated_questions').update({ status: 'approved', updated_at: new Date().toISOString() }).in('id', batch);
    }
    _zmSelectedQuestionIds.clear();
    if (typeof showNotification === 'function') showNotification('✅ ' + ids.length + _t('qb_approved_bulk'), 'success');
    loadGeneratedQuestions();
  } catch(e) { alert('Error: ' + e.message); }
}

async function bulkRejectQuestions() {
  var ids = Array.from(_zmSelectedQuestionIds);
  if (ids.length === 0) return;
  try {
    for (var i = 0; i < ids.length; i += 20) {
      var batch = ids.slice(i, i + 20);
      await supabaseClient.from('zm_generated_questions').update({ status: 'rejected', updated_at: new Date().toISOString() }).in('id', batch);
    }
    _zmSelectedQuestionIds.clear();
    if (typeof showNotification === 'function') showNotification('❌ ' + ids.length + _t('qb_rejected_bulk'), 'success');
    loadGeneratedQuestions();
  } catch(e) { alert('Error: ' + e.message); }
}

async function loadGeneratedQuestions() {
  var container = document.getElementById('zmQuestionsList');
  if (!container || !supabaseClient) return;
  _zmSelectedQuestionIds.clear();
  try {
    var query = supabaseClient.from('zm_generated_questions').select('*').order('created_at', { ascending: false });
    var catFilter = (document.getElementById('zmQFilterCategory') || {}).value || 'all';
    var statusFilter = (document.getElementById('zmQFilterStatus') || {}).value || 'all';
    if (catFilter !== 'all') query = query.eq('category', catFilter);
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (_zmActiveStatFilter === 'from_zoom') query = query.not('summary_id', 'is', null);
    // Run filtered query + 4 count queries in parallel (no row data downloaded for stats)
    var results = await Promise.all([
      query.limit(50),
      supabaseClient.from('zm_generated_questions').select('*', { count: 'exact', head: true }),
      supabaseClient.from('zm_generated_questions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('zm_generated_questions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('zm_generated_questions').select('*', { count: 'exact', head: true }).not('summary_id', 'is', null)
    ]);
    var res = results[0];
    var data = res.data || [];
    // Cache questions for detail views
    data.forEach(function(q) { _zmQuestionsCache[q.id] = q; });
    // Update stats from parallel count queries (no JS filtering needed)
    document.getElementById('zmQTotal').textContent = results[1].count || 0;
    document.getElementById('zmQApproved').textContent = results[2].count || 0;
    document.getElementById('zmQPending').textContent = results[3].count || 0;
    document.getElementById('zmQFromZoom').textContent = results[4].count || 0;

    if (data.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px;font-size:13px;">' + _t('qb_no_questions','No hay preguntas. Genera preguntas desde resúmenes de Zoom o créalas manualmente.') + '</div>';
      _updateBulkToolbar();
      return;
    }
    // Select-all header + bulk action toolbar
    var html = '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f1f5f9;border-radius:10px 10px 0 0;border:1px solid #e2e8f0;border-bottom:none;">' +
      '<input type="checkbox" id="zmSelectAllCb" onchange="toggleSelectAllQuestions()" style="width:16px;height:16px;cursor:pointer;" title="' + _t('qb_select_all','Seleccionar todas') + '">' +
      '<span style="font-size:12px;color:#475569;font-weight:600;">' + _t('qbank_select_all_count','Seleccionar todas') + ' (' + data.length + ')</span>' +
    '</div>' +
    '<div id="zmBulkToolbar" style="display:none;align-items:center;gap:8px;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-bottom:none;flex-wrap:wrap;">' +
      '<span id="zmBulkCount" style="font-size:12px;color:#2563eb;font-weight:600;">' + _t('qbank_zero_selected','0 seleccionadas') + '</span>' +
      '<div style="display:flex;gap:6px;margin-left:auto;">' +
        '<button onclick="bulkApproveQuestions()" style="padding:4px 10px;border:none;border-radius:6px;background:#22c55e;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "✅ " + _t('qb_approve') + '</button>' +
        '<button onclick="bulkRejectQuestions()" style="padding:4px 10px;border:none;border-radius:6px;background:#f59e0b;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "❌ " + _t('qb_reject') + '</button>' +
        '<button onclick="bulkDeleteQuestions()" style="padding:4px 10px;border:none;border-radius:6px;background:#dc2626;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "🗑️ " + _t('qb_delete') + '</button>' +
      '</div>' +
    '</div>';
    data.forEach(function(q) {
      var sBg = q.status === 'approved' ? '#f0fdf4' : q.status === 'rejected' ? '#fef2f2' : '#fffbeb';
      var sColor = q.status === 'approved' ? '#16a34a' : q.status === 'rejected' ? '#dc2626' : '#d97706';
      var sIcon = q.status === 'approved' ? '✅' : q.status === 'rejected' ? '❌' : '⏳';
      var opts = Array.isArray(q.options) ? q.options : [];
      var correctIdx = typeof q.correct === 'number' ? q.correct : -1;
      var letters = ['A','B','C','D'];

      html += '<div id="zmQ-' + q.id + '" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;overflow:hidden;">' +
        '<div style="display:flex;align-items:flex-start;gap:8px;padding:12px;">' +
          '<input type="checkbox" class="zmQBulkCheck" id="zmQCheck-' + q.id + '" data-qid="' + q.id + '" onclick="toggleBulkQuestion(\'' + q.id + '\', event)" style="width:16px;height:16px;cursor:pointer;flex-shrink:0;margin-top:2px;">' +
          '<div onclick="toggleQuestionDetail(\'' + q.id + '\')" style="flex:1;cursor:pointer;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">' +
            '<div style="flex:1;">' +
              '<div style="font-size:13px;color:#1e293b;font-weight:500;margin-bottom:4px;">' + _escHtml((q.question || '').substring(0, 120)) + (q.question && q.question.length > 120 ? '...' : '') + '</div>' +
              '<div style="font-size:10px;color:#64748b;">📂 ' + _escHtml(q.category || 'General') + ' · 📊 ' + _escHtml(q.difficulty || 'N/A') + (q.image_url ? ' · 🖼️ ' + _t('qb_with_image','Con imagen') : '') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:4px;flex-shrink:0;align-items:center;">' +
              '<span style="background:' + sBg + ';color:' + sColor + ';padding:2px 6px;border-radius:6px;font-size:10px;">' + sIcon + '</span>' +
              '<span id="zmQArrow-' + q.id + '" style="font-size:12px;color:#94a3b8;transition:transform 0.2s;">▼</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="zmQDetail-' + q.id + '" style="display:none;padding:0 12px 12px;border-top:1px solid #e2e8f0;">' +
          '<div style="padding-top:10px;">' +
            '<div style="font-size:13px;color:#1e293b;margin-bottom:10px;line-height:1.5;">' + _escHtml(q.question) + '</div>';
      // Show image if present
      if (q.image_url) {
        html += '<div style="margin-bottom:10px;text-align:center;"><img src="' + _escHtml(q.image_url) + '" style="max-width:100%;max-height:250px;border-radius:8px;border:1px solid #e2e8f0;" onerror="this.style.display=\'none\'"></div>';
      }
      html += '<div style="display:grid;gap:6px;margin-bottom:10px;">';
      opts.forEach(function(opt, i) {
        var isCorrect = i === correctIdx;
        html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;border:1px solid ' + (isCorrect ? '#22c55e' : '#e2e8f0') + ';background:' + (isCorrect ? '#f0fdf4' : '#fff') + ';">' +
          '<span style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:' + (isCorrect ? '#22c55e' : '#94a3b8') + ';">' + letters[i] + '</span>' +
          '<span style="font-size:12px;color:' + (isCorrect ? '#15803d' : '#334155') + ';' + (isCorrect ? 'font-weight:600;' : '') + '">' + _escHtml(opt) + '</span>' +
          (isCorrect ? '<span style="margin-left:auto;font-size:10px;color:#22c55e;font-weight:600;">' + _t('qbank_correct_mark','✓ Correcta') + '</span>' : '') +
        '</div>';
      });
      html += '</div>';
      if (q.explanation) {
        html += '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:8px 10px;margin-bottom:10px;">' +
          '<div style="font-size:10px;color:#3b82f6;font-weight:600;margin-bottom:2px;">' + _t('qbank_expl_heading','💡 Explicación') + '</div>' +
          '<div style="font-size:12px;color:#1e40af;line-height:1.4;">' + _escHtml(q.explanation) + '</div>' +
        '</div>';
      }
      if (q.instructor_notes) {
        html += '<div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:8px 10px;margin-bottom:10px;">' +
          '<div style="font-size:10px;color:#ca8a04;font-weight:600;margin-bottom:2px;">' + _t('qbank_notes_heading','📝 Notas del Instructor') + '</div>' +
          '<div style="font-size:12px;color:#854d0e;line-height:1.4;">' + _escHtml(q.instructor_notes) + '</div>' +
        '</div>';
      }
      // Action buttons
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
      if (q.status === 'pending') {
        html += '<button onclick="event.stopPropagation();approveQuestion(\'' + q.id + '\')" style="padding:5px 12px;border-radius:6px;border:none;background:#22c55e;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "✅ " + _t('qb_approve') + '</button>' +
          '<button onclick="event.stopPropagation();rejectQuestion(\'' + q.id + '\')" style="padding:5px 12px;border-radius:6px;border:none;background:#ef4444;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "❌ " + _t('qb_reject') + '</button>';
      }
      html += '<button onclick="event.stopPropagation();openEditQuestionModal(\'' + q.id + '\')" style="padding:5px 12px;border-radius:6px;border:none;background:#6366f1;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "✏️ " + _t('qb_edit') + '</button>' +
        '<button onclick="event.stopPropagation();openQuestionAIChat(\'' + q.id + '\')" style="padding:5px 12px;border-radius:6px;border:none;background:#8b5cf6;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "🤖 " + _t('qb_consult_ai') + '</button>' +
        '<button onclick="event.stopPropagation();deleteQuestion(\'' + q.id + '\')" style="padding:5px 12px;border-radius:6px;border:none;background:#dc2626;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + "🗑️ " + _t('qb_delete') + '</button>' +
      '</div>';
      // AI Chat container (hidden by default)
      html += '<div id="zmQChat-' + q.id + '" style="display:none;margin-top:10px;"></div>';
      html += '</div></div></div>';
    });
    container.innerHTML = html;
    _updateBulkToolbar();
  } catch(e) {
    console.error('[ZM] Error loading questions:', e);
    container.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:20px;font-size:12px;">Error: ' + _escHtml(e.message) + '</div>';
  }
}

function toggleQuestionDetail(id) {
  var detail = document.getElementById('zmQDetail-' + id);
  var arrow = document.getElementById('zmQArrow-' + id);
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
}

async function approveQuestion(id) {
  try {
    await supabaseClient.from('zm_generated_questions').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id);
    loadGeneratedQuestions();
  } catch(e) { alert('Error: ' + e.message); }
}

async function rejectQuestion(id) {
  try {
    await supabaseClient.from('zm_generated_questions').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id);
    loadGeneratedQuestions();
  } catch(e) { alert('Error: ' + e.message); }
}

async function deleteQuestion(id) {
  if (!confirm(_t('qb_confirm_del'))) return;
  try {
    var res = await supabaseClient.from('zm_generated_questions').delete().eq('id', id);
    if (res.error) throw res.error;
    if (typeof showNotification === 'function') showNotification('🗑️ ' + _t('qb_deleted'), 'success');
    loadGeneratedQuestions();
  } catch(e) { alert(_t('qb_del_err') + e.message); }
}

// ===== EDIT QUESTION MODAL =====
function _escAttr(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/\x3c/g,'&lt;').replace(/>/g,'&gt;');
}

// ===== DUPLICATE DETECTION =====
function _normalizeQuestionText(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:'"()\-\/\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function _textSimilarity(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  var bigramsA = [], bigramsB = [];
  for (var i = 0; i < a.length - 1; i++) bigramsA.push(a.substring(i, i + 2));
  for (var j = 0; j < b.length - 1; j++) bigramsB.push(b.substring(j, j + 2));
  if (bigramsA.length === 0 || bigramsB.length === 0) return 0;
  var setB = {};
  bigramsB.forEach(function(bg) { setB[bg] = (setB[bg] || 0) + 1; });
  var intersection = 0;
  bigramsA.forEach(function(bg) {
    if (setB[bg] && setB[bg] > 0) { intersection++; setB[bg]--; }
  });
  return (2 * intersection) / (bigramsA.length + bigramsB.length);
}

async function detectDuplicateQuestions() {
  if (typeof showNotification === 'function') showNotification('🔍 ' + _t('qb_analyzing'), 'info');
  try {
    var res = await supabaseClient.from('zm_generated_questions').select('id,question,category,status,created_at').order('created_at', { ascending: true });
    if (res.error) throw res.error;
    var questions = res.data || [];
    if (questions.length < 2) { alert(_t('qb_need_2')); return; }

    var normalized = questions.map(function(q) {
      return { id: q.id, original: q.question, norm: _normalizeQuestionText(q.question), category: q.category, status: q.status, created_at: q.created_at };
    });

    var visited = {};
    var groups = [];
    for (var i = 0; i < normalized.length; i++) {
      if (visited[normalized[i].id]) continue;
      var group = [normalized[i]];
      visited[normalized[i].id] = true;
      for (var j = i + 1; j < normalized.length; j++) {
        if (visited[normalized[j].id]) continue;
        if (_textSimilarity(normalized[i].norm, normalized[j].norm) >= 0.85) {
          group.push(normalized[j]);
          visited[normalized[j].id] = true;
        }
      }
      if (group.length > 1) groups.push(group);
    }

    _showDuplicatesModal(groups, questions.length);
  } catch(e) {
    alert(_t('qb_dup_err') + e.message);
  }
}

function _showDuplicatesModal(groups, totalAnalyzed) {
  var totalDupes = 0;
  groups.forEach(function(g) { totalDupes += g.length - 1; });

  var overlay = document.createElement('div');
  overlay.id = 'zmDupOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var html = '<div style="background:#fff;border-radius:16px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
    '<div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">' +
      '<h3 style="margin:0;font-size:16px;color:#1e293b;">' + _t('qbank_dup_title_icon','🔍 Detección de Duplicados') + '</h3>' +
      '<button onclick="document.getElementById(\'zmDupOverlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;">✕</button>' +
    '</div>' +
    '<div style="padding:16px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">' +
      '<div style="display:flex;gap:16px;font-size:13px;color:#475569;">' +
        '<span>' + _t('qbank_analyzed_line','📊 Analizadas: ') + '<b>' + totalAnalyzed + '</b></span>' +
        '<span>' + _t('qbank_groups_line','📁 Grupos: ') + '<b>' + groups.length + '</b></span>' +
        '<span>' + _t('qbank_duplicates_line','🔁 Duplicados: ') + '<b style="color:#dc2626;">' + totalDupes + '</b></span>' +
      '</div>' +
    '</div>' +
    '<div style="padding:16px 20px;">';

  if (groups.length === 0) {
    html += '<div style="text-align:center;padding:30px;color:#16a34a;font-size:14px;">' + _t('qbank_no_dups_check','✅ No se encontraron preguntas duplicadas.') + '</div>';
  } else {
    html += '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
      '<button onclick="_selectAllDuplicates(true)" style="padding:5px 12px;border-radius:6px;border:1px solid #e2e8f0;background:#f1f5f9;color:#475569;cursor:pointer;font-size:11px;">' + _t('qbank_select_all_btn_label','Seleccionar Todo') + '</button>' +
      '<button onclick="_selectAllDuplicates(false)" style="padding:5px 12px;border-radius:6px;border:1px solid #e2e8f0;background:#f1f5f9;color:#475569;cursor:pointer;font-size:11px;">' + _t('qbank_deselect_btn','Deseleccionar') + '</button>' +
      '<button onclick="_deleteSelectedDuplicates()" style="padding:5px 12px;border-radius:6px;border:none;background:#dc2626;color:#fff;cursor:pointer;font-size:11px;font-weight:600;">' + _t('qbank_del_selected_btn','🗑️ Eliminar Seleccionados') + '</button>' +
    '</div>';

    groups.forEach(function(group, gi) {
      html += '<div style="margin-bottom:12px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">' +
        '<div style="padding:8px 12px;background:#f1f5f9;font-size:12px;font-weight:600;color:#475569;">' + _t('qb_group_label','Grupo ') + (gi + 1) + ' (' + group.length + _t('qbank_group_count_suffix',' preguntas)') + '</div>';
      group.forEach(function(q, qi) {
        var isOriginal = qi === 0;
        var bg = isOriginal ? '#f0fdf4' : '#fff';
        var borderLeft = isOriginal ? '3px solid #22c55e' : '3px solid #fbbf24';
        html += '<div style="padding:10px 12px;background:' + bg + ';border-left:' + borderLeft + ';border-bottom:1px solid #f1f5f9;display:flex;align-items:flex-start;gap:8px;">' +
          '<input type="checkbox" class="zmDupCheck" value="' + q.id + '"' + (isOriginal ? '' : ' checked') + ' style="margin-top:3px;flex-shrink:0;" />' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:12px;color:#1e293b;line-height:1.4;">' + _escHtml((q.original || '').substring(0, 150)) + (q.original && q.original.length > 150 ? '...' : '') + '</div>' +
            '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' +
              (isOriginal ? '<span style="color:#16a34a;font-weight:600;">' + _t('qbank_original_badge','📌 Original') + '</span> · ' : '') +
              '📂 ' + _escHtml(q.category || 'N/A') + ' · ' + (q.status === 'approved' ? '✅' : '⏳') + ' ' + (q.status || 'pending') +
            '</div>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    });
  }

  html += '</div></div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function _selectAllDuplicates(checked) {
  var checks = document.querySelectorAll('.zmDupCheck');
  checks.forEach(function(cb) { cb.checked = checked; });
}

async function _deleteSelectedDuplicates() {
  var checks = document.querySelectorAll('.zmDupCheck:checked');
  var ids = [];
  checks.forEach(function(cb) { ids.push(cb.value); });
  if (ids.length === 0) { alert(_t('qb_no_sel_del')); return; }
  if (!confirm('¿Eliminar ' + ids.length + _t('qb_confirm_del_sel'))) return;

  try {
    // Delete in chunks of 20
    for (var i = 0; i < ids.length; i += 20) {
      var batch = ids.slice(i, i + 20);
      var res = await supabaseClient.from('zm_generated_questions').delete().in('id', batch);
      if (res.error) throw res.error;
    }
    var overlay = document.getElementById('zmDupOverlay');
    if (overlay) overlay.remove();
    if (typeof showNotification === 'function') showNotification('🗑️ ' + ids.length + _t('qb_dups_deleted'), 'success');
    loadGeneratedQuestions();
  } catch(e) {
    alert(_t('qb_dup_del_err') + e.message);
  }
}

function openCreateQuestionModal() {
  _showQuestionModal({
    id: null,
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    category: 'HVAC',
    difficulty: 'intermedio',
    instructor_notes: '',
    image_url: ''
  }, '➕ ' + _t('qb_create_q'));
}

function openEditQuestionModal(id) {
  var q = _zmQuestionsCache[id];
  if (!q) { alert(_t('qb_not_found')); return; }
  _showQuestionModal(q, '✏️ ' + _t('qb_edit_q'));
}

function _showQuestionModal(data, title) {
  var opts = Array.isArray(data.options) ? data.options : ['', '', '', ''];
  while (opts.length < 4) opts.push('');
  var correctIdx = typeof data.correct === 'number' ? data.correct : 0;
  var categories = ZM_MASTER_CATEGORIES.map(function(c) { return c.value; });
  var difficulties = ['principiante', 'intermedio', 'avanzado', 'elite'];
  var diffLabels = ['Principiante', 'Intermedio', 'Avanzado', 'Elite'];

  var overlay = document.createElement('div');
  overlay.id = 'zmQEditOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var catOpts = '';
  categories.forEach(function(c) {
    catOpts += '<option value="' + _escAttr(c) + '"' + (data.category === c ? ' selected' : '') + '>' + _escHtml(c) + '</option>';
  });

  var diffOpts = '';
  difficulties.forEach(function(d, i) {
    diffOpts += '<option value="' + _escAttr(d) + '"' + ((data.difficulty || '').toLowerCase() === d ? ' selected' : '') + '>' + diffLabels[i] + '</option>';
  });

  var correctOpts = '';
  ['A','B','C','D'].forEach(function(l, i) {
    correctOpts += '<option value="' + i + '"' + (correctIdx === i ? ' selected' : '') + '>' + _t('qbank_option_prefix','Opción ') + l + '</option>';
  });

  var existingImageUrl = data.image_url || '';

  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
    '<div style="padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">' +
      '<h3 style="margin:0;font-size:16px;color:#1e293b;">' + title + '</h3>' +
      '<button onclick="document.getElementById(\'zmQEditOverlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;">✕</button>' +
    '</div>' +
    '<div style="padding:20px;display:grid;gap:12px;">' +
      '<div>' +
        '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_question_label') + '</label>' +
        '<textarea id="zmQEditQuestion" rows="3" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;resize:vertical;box-sizing:border-box;">' + _escHtml(data.question) + '</textarea>' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qbank_img_label_full','🖼️ Imagen de la pregunta (opcional — para identificación de partes/productos)') + '</label>' +
        '<div style="display:flex;gap:8px;align-items:flex-start;">' +
          '<div style="flex:1;">' +
            '<input id="zmQEditImageUrl" value="' + _escAttr(existingImageUrl) + '" placeholder="' + _t('qbank_img_url_ph','URL de la imagen o sube una abajo') + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;margin-bottom:6px;" />' +
            '<div style="display:flex;gap:6px;">' +
              '<label style="padding:5px 10px;border:1px dashed #e2e8f0;border-radius:6px;cursor:pointer;font-size:11px;color:#475569;background:#f8fafc;display:inline-flex;align-items:center;gap:4px;">' +
                _t('qbank_upload_img_btn','📤 Subir imagen') +
                '<input type="file" id="zmQEditImageFile" accept=".jpg,.jpeg,.png,.gif,.webp" style="display:none;" onchange="uploadQuestionImage(this)">' +
              '</label>' +
              (existingImageUrl ? '<button onclick="document.getElementById(\'zmQEditImageUrl\').value=\'\';var p=document.getElementById(\'zmQEditImagePreview\');if(p)p.style.display=\'none\';" style="padding:5px 10px;border:1px solid #fecaca;border-radius:6px;background:#fff;color:#ef4444;cursor:pointer;font-size:11px;">' + _t('qbank_remove_img_btn','Quitar imagen') + '</button>' : '') +
            '</div>' +
          '</div>' +
          '<div id="zmQEditImagePreview" style="flex-shrink:0;' + (existingImageUrl ? '' : 'display:none;') + '">' +
            '<img src="' + _escAttr(existingImageUrl) + '" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;" onerror="this.parentElement.style.display=\'none\'">' +
          '</div>' +
        '</div>' +
        '<div id="zmQEditImageStatus" style="font-size:10px;color:#94a3b8;margin-top:2px;"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_option_a') + '</label>' +
          '<input id="zmQEditOpt0" value="' + _escAttr(opts[0]) + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;" />' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_option_b') + '</label>' +
          '<input id="zmQEditOpt1" value="' + _escAttr(opts[1]) + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;" />' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_option_c') + '</label>' +
          '<input id="zmQEditOpt2" value="' + _escAttr(opts[2]) + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;" />' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_option_d') + '</label>' +
          '<input id="zmQEditOpt3" value="' + _escAttr(opts[3]) + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;box-sizing:border-box;" />' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_correct_answer') + '</label>' +
          '<select id="zmQEditCorrect" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;">' + correctOpts + '</select>' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_category') + '</label>' +
          '<select id="zmQEditCategory" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;">' + catOpts + '</select>' +
        '</div>' +
        '<div>' +
          '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_difficulty') + '</label>' +
          '<select id="zmQEditDifficulty" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;">' + diffOpts + '</select>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qb_expl_label') + '</label>' +
        '<textarea id="zmQEditExplanation" rows="2" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;resize:vertical;box-sizing:border-box;">' + _escHtml(data.explanation || '') + '</textarea>' +
      '</div>' +
      '<div>' +
        '<label style="font-size:11px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">' + _t('qbank_notes_ref_heading','📝 Notas / Referencias del Instructor') + '</label>' +
        '<textarea id="zmQEditNotes" rows="2" placeholder="' + _t('qb_notes_ph') + '" style="width:100%;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;resize:vertical;box-sizing:border-box;">' + _escHtml(data.instructor_notes || '') + '</textarea>' +
      '</div>' +
    '</div>' +
    '<div style="padding:12px 20px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px;">' +
      '<button onclick="document.getElementById(\'zmQEditOverlay\').remove()" style="padding:8px 16px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;color:#475569;cursor:pointer;font-size:12px;">' + _t('qb_cancel') + '</button>' +
      '<button onclick="saveQuestionEdit(\'' + (data.id || '') + '\')" style="padding:8px 16px;border-radius:8px;border:none;background:#6366f1;color:#fff;cursor:pointer;font-size:12px;font-weight:600;">' + _t('qbank_save_btn_icon','💾 Guardar') + '</button>' +
    '</div>' +
  '</div>';

  document.body.appendChild(overlay);
}

async function uploadQuestionImage(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { alert(_t('qb_img_max')); input.value = ''; return; }
  var statusEl = document.getElementById('zmQEditImageStatus');
  if (statusEl) statusEl.textContent = '📤 ' + _t('qb_uploading');
  try {
    var timestamp = Date.now();
    var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    var filePath = 'question-images/' + timestamp + '_' + safeName;
    var xhr = new XMLHttpRequest();
    await new Promise(function(resolve, reject) {
      xhr.open('POST', SUPABASE_URL + '/storage/v1/object/school-files/' + filePath, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_KEY);
      xhr.setRequestHeader('Content-Type', file.type || 'image/jpeg');
      xhr.setRequestHeader('x-upsert', 'true');
      xhr.onload = function() { xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload error: ' + xhr.status)); };
      xhr.onerror = function() { reject(new Error('Conexión')); };
      xhr.send(file);
    });
    var urlRes = supabaseClient.storage.from('school-files').getPublicUrl(filePath);
    var imageUrl = urlRes.data.publicUrl;
    document.getElementById('zmQEditImageUrl').value = imageUrl;
    var preview = document.getElementById('zmQEditImagePreview');
    if (preview) {
      preview.style.display = '';
      preview.innerHTML = '<img src="' + _escHtml(imageUrl) + '" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0;">';
    }
    if (statusEl) statusEl.textContent = '✅ ' + _t('qb_img_uploaded');
  } catch(e) {
    if (statusEl) statusEl.textContent = '❌ Error: ' + e.message;
  }
}

async function saveQuestionEdit(id) {
  try {
    var imageUrlInput = document.getElementById('zmQEditImageUrl');
    var payload = {
      question: document.getElementById('zmQEditQuestion').value.trim(),
      options: [
        document.getElementById('zmQEditOpt0').value.trim(),
        document.getElementById('zmQEditOpt1').value.trim(),
        document.getElementById('zmQEditOpt2').value.trim(),
        document.getElementById('zmQEditOpt3').value.trim()
      ],
      correct: parseInt(document.getElementById('zmQEditCorrect').value),
      category: document.getElementById('zmQEditCategory').value,
      difficulty: document.getElementById('zmQEditDifficulty').value,
      explanation: document.getElementById('zmQEditExplanation').value.trim(),
      instructor_notes: document.getElementById('zmQEditNotes').value.trim(),
      image_url: imageUrlInput ? imageUrlInput.value.trim() || null : null,
      updated_at: new Date().toISOString()
    };
    if (!payload.question) { alert(_t('qb_q_required')); return; }
    if (payload.options.some(function(o) { return !o; })) { alert(_t('qb_opts_required')); return; }

    if (id) {
      await supabaseClient.from('zm_generated_questions').update(payload).eq('id', id);
    } else {
      payload.status = 'pending';
      await supabaseClient.from('zm_generated_questions').insert([payload]);
    }
    var overlay = document.getElementById('zmQEditOverlay');
    if (overlay) overlay.remove();
    loadGeneratedQuestions();
  } catch(e) {
    alert(_t('qb_save_err') + e.message);
  }
}

function exportQuestionsJSON() { alert(_t('qb_export_soon')); }

