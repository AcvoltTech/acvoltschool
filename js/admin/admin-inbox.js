    // ADMIN INBOX - BANDEJA DE ENTRADA
    // ============================================
    if (typeof _addTranslations === 'function') _addTranslations({
      adm_in_loading: { es: 'Cargando...', en: 'Loading...' },
      adm_in_task_sent: { es: 'Tarea Enviada', en: 'Task Submitted' },
      adm_in_files: { es: ' archivos', en: ' files' },
      adm_in_document: { es: 'Documento', en: 'Document' },
      adm_in_student: { es: 'Estudiante', en: 'Student' },
      adm_in_payment_req: { es: 'Solicitud de Pago', en: 'Payment Request' },
      adm_in_payment_local: { es: 'Solicitud de Pago (Local)', en: 'Payment Request (Local)' },
      adm_in_concept: { es: 'Concepto: ', en: 'Concept: ' },
      adm_in_not_specified: { es: 'No especificado', en: 'Not specified' },
      adm_in_tax_form: { es: 'Solicitud Forma de Taxes', en: 'Tax Form Request' },
      adm_in_year: { es: 'A\u00F1o ', en: 'Year ' },
      adm_in_renewal_req: { es: 'Solicitud de Renovaci\u00F3n', en: 'Renewal Request' },
      adm_in_certification: { es: 'Certificaci\u00F3n', en: 'Certification' },
      adm_in_support_ticket: { es: 'Ticket de Soporte', en: 'Support Ticket' },
      adm_in_no_subject: { es: 'Sin asunto', en: 'No subject' },
      adm_in_pending_count: { es: ' pendientes', en: ' pending' },
      adm_in_no_items: { es: 'No hay items en esta categor\u00EDa', en: 'No items in this category' },
      adm_in_pending: { es: 'Pendiente', en: 'Pending' },
      adm_in_attended: { es: 'Atendido', en: 'Attended' },
      adm_in_attend: { es: 'Atender', en: 'Attend' },
      adm_in_feedback_ia: { es: 'Feedback IA', en: 'AI Feedback' },
      adm_in_grade_ia: { es: 'Calificar IA', en: 'AI Grade' },
      adm_in_note: { es: 'Nota', en: 'Note' },
      adm_in_contact: { es: 'Contactar', en: 'Contact' },
      adm_in_error_loading: { es: 'Error cargando datos', en: 'Error loading data' },
      adm_in_db_unavailable: { es: 'Base de datos no disponible', en: 'Database unavailable' },
      adm_in_no_feedback: { es: 'No se pudo cargar el feedback', en: 'Could not load feedback' },
      adm_in_no_ai_feedback: { es: 'Sin feedback de IA disponible', en: 'No AI feedback available' },
      adm_in_enter_grade: { es: 'Ingresa la nueva calificaci\u00F3n (0-100):', en: 'Enter the new grade (0-100):' },
      adm_in_grade_range: { es: 'La calificaci\u00F3n debe ser un n\u00FAmero entre 0 y 100', en: 'Grade must be a number between 0 and 100' },
      adm_in_note_prompt: { es: 'Nota para el estudiante (opcional):', en: 'Note for the student (optional):' },
      adm_in_grade_updated: { es: 'Calificaci\u00F3n actualizada a ', en: 'Grade updated to ' },
      adm_in_grade_update_error: { es: 'Error actualizando calificaci\u00F3n: ', en: 'Error updating grade: ' },
      adm_in_grading: { es: 'Calificando...', en: 'Grading...' },
      adm_in_no_files: { es: 'No se encontraron archivos para calificar', en: 'No files found to grade' },
      adm_in_video_no_frames: { es: 'Este archivo es un video sin frames extra\u00EDdos. La IA necesita im\u00E1genes para calificar.', en: 'This file is a video without extracted frames. AI needs images to grade.' },
      adm_in_no_images: { es: 'No se encontraron im\u00E1genes para calificar. Formatos soportados: JPG, PNG, HEIC, WebP, GIF', en: 'No images found to grade. Supported formats: JPG, PNG, HEIC, WebP, GIF' },
      adm_in_ai_grade: { es: 'Calificaci\u00F3n IA: ', en: 'AI Grade: ' },
      adm_in_grade_error: { es: 'Error calificando: ', en: 'Error grading: ' },
      adm_in_marked_attended: { es: 'Marcado como atendido', en: 'Marked as attended' },
      adm_in_marked_local: { es: 'Marcado como atendido (local)', en: 'Marked as attended (local)' },
      adm_in_all_attended: { es: 'Todos los items marcados como atendidos', en: 'All items marked as attended' },
      adm_in_followup: { es: 'ACVOLT Tech School - Seguimiento', en: 'ACVOLT Tech School - Follow-up' },
      adm_in_contact_student: { es: 'Contactar Estudiante', en: 'Contact Student' },
      adm_in_renewal_sent: { es: 'Solicitud de renovacion ', en: 'Renewal request ' },
      adm_in_renewal_sent2: { es: ' enviada', en: ' sent' },
      adm_in_error_sending: { es: 'Error enviando solicitud: ', en: 'Error sending request: ' },
      adm_in_csv_type: { es: 'Tipo', en: 'Type' },
      adm_in_csv_title: { es: 'Titulo', en: 'Title' },
      adm_in_csv_student: { es: 'Estudiante', en: 'Student' },
      adm_in_csv_date: { es: 'Fecha', en: 'Date' },
      adm_in_csv_status: { es: 'Estado', en: 'Status' },
      adm_in_csv_notes: { es: 'Notas', en: 'Notes' },
    });
    let adminInboxItems = [];
    let currentInboxFilter = 'all';

    async function loadAdminInbox() {
      const container = document.getElementById('adminInboxList');
      if (!container) return;
      
      container.innerHTML = '<div style="color: #f39c12; text-align: center; padding: 20px;">\u23F3 ' + _t('adm_in_loading', 'Cargando...') + '</div>';
      adminInboxItems = [];
      
      try {
        // 1. Cargar TAREAS ENVIADAS
        if (supabaseClient && isOnline) {
          try {
            const { data: tareas } = await supabaseClient
              .from('submitted_tasks')
              .select('*')
              .order('submitted_at', { ascending: false });
            if (tareas) {
              tareas.forEach(t => {
                const fileCount = t.file_count || (t.file_urls ? t.file_urls.length : (t.file_url ? 1 : 0));
                adminInboxItems.push({
                  type: 'tareas',
                  icon: '📝',
                  title: _t('adm_in_task_sent', 'Tarea Enviada') + (fileCount > 1 ? ' (' + fileCount + _t('adm_in_files', ' archivos') + ')' : ''),
                  subtitle: t.task_type || _t('adm_in_document', 'Documento'),
                  student: t.student_name || _t('adm_in_student', 'Estudiante'),
                  email: t.student_email || '',
                  date: t.submitted_at,
                  status: t.status || 'pending',
                  notes: t.notes || '',
                  file: t.file_url || null,
                  fileUrls: t.file_urls || (t.file_url ? [t.file_url] : []),
                  fileNames: t.file_names || [],
                  fileCount: fileCount,
                  id: t.id,
                  grade: t.grade,
                  adminOverrideGrade: t.admin_override_grade,
                  aiFeedback: t.ai_feedback,
                  aiCategoryScores: t.ai_category_scores,
                  adminNotes: t.admin_notes,
                  raw: t
                });
              });
            }
          } catch(e) { console.log('No tasks table:', e); }
          
          // 2. Cargar SOLICITUDES DE PAGO
          try {
            const _sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
            const _sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (window.SUPABASE_KEY || ''));
            const _adminEmail = sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '';
            const _resp = await fetch(_sbUrl + '/functions/v1/admin-payments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': _sbKey, 'Authorization': 'Bearer ' + _sbKey },
              body: JSON.stringify({ action: 'admin_list_intents', admin_email: _adminEmail }),
            });
            const _json = await _resp.json();
            const pagos = _json.data || null;
            if (pagos) {
              pagos.forEach(p => {
                adminInboxItems.push({
                  type: 'pagos',
                  icon: '💰',
                  title: _t('adm_in_payment_req', 'Solicitud de Pago'),
                  subtitle: '$' + (p.amount || 0).toFixed(2) + ' - ' + (p.payment_method || 'N/A').toUpperCase(),
                  student: p.student_name || _t('adm_in_student', 'Estudiante'),
                  email: p.student_email || '',
                  date: p.created_at,
                  status: p.status || 'pending',
                  notes: _t('adm_in_concept', 'Concepto: ') + (p.concept || _t('adm_in_not_specified', 'No especificado')),
                  id: p.id,
                  raw: p
                });
              });
            }
          } catch(e) { console.log('No payments table:', e); }

          // 3. Cargar SOLICITUDES DE TAXES
          try {
            const { data: taxes } = await supabaseClient
              .from('tax_form_requests')
              .select('*')
              .order('requested_at', { ascending: false });
            if (taxes) {
              taxes.forEach(t => {
                adminInboxItems.push({
                  type: 'taxes',
                  icon: '\uD83D\uDCC4',
                  title: _t('adm_in_tax_form', 'Solicitud Forma de Taxes'),
                  subtitle: _t('adm_in_year', 'A\u00F1o ') + (t.year || new Date().getFullYear()),
                  student: t.student_name || _t('adm_in_student', 'Estudiante'),
                  email: t.student_email || '',
                  date: t.requested_at,
                  status: t.status || 'pending',
                  id: t.id,
                  raw: t
                });
              });
            }
          } catch(e) { console.log('No taxes table:', e); }
          
          // 4. Cargar SOLICITUDES DE RENOVACIÓN
          try {
            const { data: renovaciones } = await supabaseClient
              .from('cert_renewal_requests')
              .select('*')
              .order('requested_at', { ascending: false });
            if (renovaciones) {
              renovaciones.forEach(r => {
                adminInboxItems.push({
                  type: 'renovaciones',
                  icon: '🏅',
                  title: _t('adm_in_renewal_req', 'Solicitud de Renovaci\u00F3n'),
                  subtitle: r.cert_type || _t('adm_in_certification', 'Certificaci\u00F3n'),
                  student: r.student_name || _t('adm_in_student', 'Estudiante'),
                  email: r.student_email || '',
                  date: r.requested_at,
                  status: r.status || 'pending',
                  id: r.id,
                  raw: r
                });
              });
            }
          } catch(e) { console.log('No renewals table:', e); }

          // 5. Cargar TICKETS DE SOPORTE
          try {
            const { data: soporteTickets } = await supabaseClient
              .from('soporte_tickets')
              .select('*')
              .order('created_at', { ascending: false });
            if (soporteTickets) {
              soporteTickets.forEach(s => {
                adminInboxItems.push({
                  type: 'soporte',
                  icon: '🔧',
                  title: _t('adm_in_support_ticket', 'Ticket de Soporte'),
                  subtitle: s.subject || _t('adm_in_no_subject', 'Sin asunto'),
                  student: s.student_name || _t('adm_in_student', 'Estudiante'),
                  email: s.student_email || '',
                  date: s.created_at,
                  status: s.estado === 'abierto' ? 'pending' : (s.estado === 'resuelto' || s.estado === 'cerrado' ? 'completed' : 'in_progress'),
                  notes: (s.category || 'general') + (s.equipment_brand ? ' · ' + s.equipment_brand : ''),
                  id: s.id,
                  raw: s
                });
              });
            }
          } catch(e) { console.log('No soporte_tickets table:', e); }
        }

        // También cargar de localStorage como backup
        const localPayments = JSON.parse(localStorage.getItem('maestroac_payment_intents') || '[]');
        localPayments.forEach(p => {
          if (!adminInboxItems.find(i => i.type === 'pagos' && i.raw && i.raw.created_at === p.created_at)) {
            adminInboxItems.push({
              type: 'pagos',
              icon: '💰',
              title: _t('adm_in_payment_local', 'Solicitud de Pago (Local)'),
              subtitle: '$' + (p.amount || 0).toFixed(2) + ' - ' + (p.payment_method || 'N/A').toUpperCase(),
              student: p.student_name || _t('adm_in_student', 'Estudiante'),
              email: p.student_email || '',
              date: p.created_at,
              status: p.status || 'pending',
              notes: _t('adm_in_concept', 'Concepto: ') + (p.concept || _t('adm_in_not_specified', 'No especificado')),
              raw: p
            });
          }
        });
        
        // Ordenar por fecha (más reciente primero)
        adminInboxItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Actualizar contadores
        updateInboxCounts();
        
        // Renderizar
        renderInboxItems();
        
      } catch(e) {
        console.error('Error loading inbox:', e);
        container.innerHTML = '<div style="color: #e74c3c; text-align: center; padding: 20px;">\u274C ' + _t('adm_in_error_loading', 'Error cargando datos') + '</div>';
      }
    }

    function updateInboxCounts() {
      const counts = {
        tareas: adminInboxItems.filter(i => i.type === 'tareas').length,
        pagos: adminInboxItems.filter(i => i.type === 'pagos').length,
        taxes: adminInboxItems.filter(i => i.type === 'taxes').length,
        renovaciones: adminInboxItems.filter(i => i.type === 'renovaciones').length,
        soporte: adminInboxItems.filter(i => i.type === 'soporte').length
      };

      document.getElementById('countTareas').textContent = counts.tareas;
      document.getElementById('countPagos').textContent = counts.pagos;
      document.getElementById('countTaxes').textContent = counts.taxes;
      document.getElementById('countRenovaciones').textContent = counts.renovaciones;
      var countSoporteEl = document.getElementById('countSoporte');
      if (countSoporteEl) countSoporteEl.textContent = counts.soporte;

      const total = counts.tareas + counts.pagos + counts.taxes + counts.renovaciones + counts.soporte;
      const pendingCount = adminInboxItems.filter(i => i.status === 'pending' || i.status === 'pending_verification').length;
      document.getElementById('inboxTotalCount').textContent = pendingCount + _t('adm_in_pending_count', ' pendientes');
    }

    function filterInbox(filter) {
      currentInboxFilter = filter;
      
      // Update button styles
      document.querySelectorAll('.inbox-filter-btn').forEach(btn => {
        btn.style.background = 'rgba(255,255,255,0.1)';
        btn.style.color = '#fff';
      });
      const activeBtn = document.getElementById('inboxFilter' + filter.charAt(0).toUpperCase() + filter.slice(1));
      if (activeBtn) {
        activeBtn.style.background = '#f39c12';
        activeBtn.style.color = '#000';
      }
      
      renderInboxItems();
    }

    function renderInboxItems() {
      const container = document.getElementById('adminInboxList');
      if (!container) return;
      
      let items = adminInboxItems;
      if (currentInboxFilter !== 'all') {
        items = adminInboxItems.filter(i => i.type === currentInboxFilter);
      }
      
      if (items.length === 0) {
        container.innerHTML = '<div style="color: #888; text-align: center; padding: 40px;"><div style="font-size: 3em; margin-bottom: 15px;">\uD83D\uDCED</div><p>' + _t('adm_in_no_items', 'No hay items en esta categor\u00EDa') + '</p></div>';
        return;
      }
      
      let html = '';
      items.forEach((item, idx) => {
        const statusColor = item.status === 'pending' || item.status === 'pending_verification' ? '#e74c3c' : '#2ecc71';
        const statusText = item.status === 'pending' || item.status === 'pending_verification' ? '\u23F3 ' + _t('adm_in_pending', 'Pendiente') : '\u2705 ' + _t('adm_in_attended', 'Atendido');
        const dateStr = item.date ? new Date(item.date).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
        
        // Build file links HTML outside template literal to avoid regex/backtick conflicts
        var fileLinksHtml = '';
        if (item.type === 'tareas' && item.fileUrls && item.fileUrls.length > 0) {
          var linkParts = [];
          for (var fi = 0; fi < item.fileUrls.length; fi++) {
            var fname = (item.fileNames && item.fileNames[fi]) ? item.fileNames[fi] : 'Archivo ' + (fi + 1);
            var fext = fname.toLowerCase().split('.').pop();
            var isImg = (fext === 'jpg' || fext === 'jpeg' || fext === 'png' || fext === 'heic');
            var ficon = isImg ? '🖼️' : '📄';
            var shortName = fname.length > 20 ? fname.substring(0, 20) + '...' : fname;
            linkParts.push('<a href="' + _escHtml(item.fileUrls[fi]) + '" target="_blank" style="padding:4px 8px;background:rgba(52,152,219,0.15);color:#3498db;border-radius:6px;font-size:0.75em;text-decoration:none;display:inline-flex;align-items:center;gap:3px;">' + ficon + ' ' + _escHtml(shortName) + '</a>');
          }
          fileLinksHtml = '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">' + linkParts.join('') + '</div>';
        }
        
        html += '<div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; margin-bottom: 10px; border-left: 4px solid ' + statusColor + ';">' +
            '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">' +
              '<div style="flex: 1; min-width: 200px;">' +
                '<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">' +
                  '<span style="font-size: 1.5em;">' + item.icon + '</span>' +
                  '<div>' +
                    '<div style="color: #fff; font-weight: bold;">' + _escHtml(item.title) + '</div>' +
                    '<div style="color: #f39c12; font-size: 0.85em;">' + _escHtml(item.subtitle) + '</div>' +
                  '</div>' +
                '</div>' +
                '<div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">' +
                  '👤 <strong>' + _escHtml(item.student) + '</strong> ' + (item.email ? '| 📧 ' + _escHtml(item.email) : '') +
                '</div>' +
                (item.notes ? '<div style="color: #888; font-size: 0.8em; margin-top: 5px;">📝 ' + _escHtml(item.notes) + '</div>' : '') +
                fileLinksHtml +
              '</div>' +
              '<div style="text-align: right; min-width: 140px;">' +
                (function() {
                  // AI Grade badge for tasks
                  if (item.type === 'tareas' && item.grade != null) {
                    var displayGrade = item.adminOverrideGrade != null ? item.adminOverrideGrade : item.grade;
                    var gBadgeColor = displayGrade >= 90 ? '#2ecc71' : displayGrade >= 80 ? '#27ae60' : displayGrade >= 70 ? '#f39c12' : displayGrade >= 60 ? '#e67e22' : '#e74c3c';
                    var gradeLabel = item.adminOverrideGrade != null ? '✏️' : '🤖';
                    return '<div style="background:' + gBadgeColor + ';color:#fff;padding:4px 10px;border-radius:8px;font-weight:bold;font-size:0.9em;margin-bottom:6px;display:inline-block;">' + gradeLabel + ' ' + displayGrade + '/100</div><br>';
                  }
                  return '';
                })() +
                '<div style="color: ' + statusColor + '; font-size: 0.85em; font-weight: bold; margin-bottom: 5px;">' + statusText + '</div>' +
                '<div style="color: #666; font-size: 0.75em;">' + dateStr + '</div>' +
                '<div style="margin-top: 10px; display: flex; gap: 5px; justify-content: flex-end; flex-wrap: wrap;">' +
                  (item.status === 'pending' || item.status === 'pending_verification' ?
                    '<button onclick="markItemAsAttended(\'' + item.type + '\', \'' + item.id + '\')" style="padding: 5px 10px; background: #2ecc71; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75em;">\u2705 ' + _t('adm_in_attend', 'Atender') + '</button>' : '') +
                  (item.type === 'tareas' && item.grade != null ?
                    '<button onclick="showAiFeedbackAdmin(\'' + item.id + '\')" style="padding: 5px 10px; background: #9b59b6; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75em;">\uD83D\uDCCB ' + _t('adm_in_feedback_ia', 'Feedback IA') + '</button>' : '') +
                  (item.type === 'tareas' && item.grade == null ?
                    '<button id="aiGradeBtn_' + item.id + '" onclick="adminAiGradeTask(\'' + item.id + '\')" style="padding: 5px 10px; background: linear-gradient(135deg,#8b5cf6,#6d28d9); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75em;">\uD83E\uDD16 ' + _t('adm_in_grade_ia', 'Calificar IA') + '</button>' : '') +
                  (item.type === 'tareas' ?
                    '<button onclick="overrideGrade(\'' + item.id + '\')" style="padding: 5px 10px; background: #e67e22; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75em;">\u270F\uFE0F ' + _t('adm_in_note', 'Nota') + '</button>' : '') +
                  (item.email ? '<button class="js-contact-student" data-email="' + _escHtml(item.email) + '" data-student="' + _escHtml(item.student) + '" style="padding: 5px 10px; background: #3498db; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75em;">\uD83D\uDCE7 ' + _t('adm_in_contact', 'Contactar') + '</button>' : '') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      });
      
      container.innerHTML = html;

      // Delegated click handler for contact-student buttons (XSS-safe)
      container.querySelectorAll('.js-contact-student').forEach(function(btn) {
        btn.addEventListener('click', function() {
          contactStudent(btn.getAttribute('data-email'), btn.getAttribute('data-student'));
        });
      });
    }

    // Admin: Show AI feedback for a task in a modal
    async function showAiFeedbackAdmin(taskId) {
      if (!supabaseClient) { alert(_t('adm_in_db_unavailable', 'Base de datos no disponible')); return; }
      try {
        const { data, error } = await supabaseClient.from('submitted_tasks')
          .select('grade, ai_feedback, ai_category_scores, admin_override_grade, admin_notes, student_name, task_type')
          .eq('id', taskId)
          .single();

        if (error || !data) { alert(_t('adm_in_no_feedback', 'No se pudo cargar el feedback')); return; }

        var result = {
          grade: data.admin_override_grade != null ? data.admin_override_grade : data.grade,
          feedback: data.ai_feedback || _t('adm_in_no_ai_feedback', 'Sin feedback de IA disponible'),
          categories: (data.ai_category_scores && data.ai_category_scores.categories) ? data.ai_category_scores.categories : {},
          strengths: (data.ai_category_scores && data.ai_category_scores.strengths) ? data.ai_category_scores.strengths : [],
          improvements: (data.ai_category_scores && data.ai_category_scores.improvements) ? data.ai_category_scores.improvements : []
        };

        showGradeCard(result);
      } catch(e) {
        alert('Error: ' + e.message);
      }
    }

    // Admin: Override AI grade with manual grade
    async function overrideGrade(taskId) {
      var newGrade = prompt(_t('adm_in_enter_grade', 'Ingresa la nueva calificaci\u00F3n (0-100):'));
      if (newGrade === null) return;
      newGrade = parseInt(newGrade);
      if (isNaN(newGrade) || newGrade < 0 || newGrade > 100) {
        alert(_t('adm_in_grade_range', 'La calificaci\u00F3n debe ser un n\u00FAmero entre 0 y 100'));
        return;
      }

      var adminNote = prompt(_t('adm_in_note_prompt', 'Nota para el estudiante (opcional):')) || '';

      if (!supabaseClient) { alert(_t('adm_in_db_unavailable', 'Base de datos no disponible')); return; }
      try {
        const { error } = await supabaseClient.from('submitted_tasks')
          .update({
            admin_override_grade: newGrade,
            admin_notes: adminNote || null
          })
          .eq('id', taskId);

        if (error) throw error;

        alert(_t('adm_in_grade_updated', 'Calificaci\u00F3n actualizada a ') + newGrade + '/100');
        loadAdminInbox();
      } catch(e) {
        alert(_t('adm_in_grade_update_error', 'Error actualizando calificaci\u00F3n: ') + e.message);
      }
    }

    async function adminAiGradeTask(taskId) {
      var btn = document.getElementById('aiGradeBtn_' + taskId);
      if (btn) { btn.disabled = true; btn.textContent = '\uD83E\uDD16 ' + _t('adm_in_grading', 'Calificando...'); }
      try {
        // Get task data with file URLs
        var item = adminInboxItems.find(function(i) { return i.id === taskId; });
        if (!item || !item.fileUrls || item.fileUrls.length === 0) {
          alert(_t('adm_in_no_files', 'No se encontraron archivos para calificar'));
          if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDD16 ' + _t('adm_in_grade_ia', 'Calificar IA'); }
          return;
        }
        // Filter image URLs (include HEIC/HEIF — edge function converts them)
        var imageUrls = item.fileUrls.filter(function(u) { return u && u.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff|tif)/i); });
        // Check for video frame URLs stored in DB (extracted during upload)
        var videoFrameUrls = (item.raw && item.raw.video_frame_urls) ? item.raw.video_frame_urls : [];
        if (typeof videoFrameUrls === 'string') { try { videoFrameUrls = JSON.parse(videoFrameUrls); } catch(e) { videoFrameUrls = []; } }
        if (imageUrls.length === 0 && videoFrameUrls.length === 0) {
          // Check if files are videos without extracted frames
          var hasVideo = item.fileUrls.some(function(u) { return u && u.match(/\.(mp4|mov|avi|webm|3gp|mkv|wmv)/i); });
          if (hasVideo) {
            alert(_t('adm_in_video_no_frames', 'Este archivo es un video sin frames extra\u00EDdos. La IA necesita im\u00E1genes para calificar.'));
          } else {
            alert(_t('adm_in_no_images', 'No se encontraron im\u00E1genes para calificar. Formatos soportados: JPG, PNG, HEIC, WebP, GIF'));
          }
          if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDD16 ' + _t('adm_in_grade_ia', 'Calificar IA'); }
          return;
        }
        if (!supabaseClient) { alert(_t('adm_in_db_unavailable', 'Base de datos no disponible')); if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDD16 ' + _t('adm_in_grade_ia', 'Calificar IA'); } return; }
        var gradeRes = await supabaseClient.functions.invoke('grade-task', {
          body: {
            taskId: taskId,
            imageUrls: imageUrls.slice(0, 5),
            videoFrameUrls: videoFrameUrls.slice(0, 5),
            taskType: item.subtitle || 'tarea',
            studentNotes: item.notes || '',
            studentName: item.student || 'Estudiante'
          }
        });
        console.log('[AI Grade] Response received, success:', !!(gradeRes.data && gradeRes.data.success));
        if (gradeRes.error) {
          var detail = (gradeRes.data && gradeRes.data.error) ? gradeRes.data.error : (gradeRes.error.message || gradeRes.error);
          throw new Error(detail || 'Edge function error');
        }
        if (gradeRes.data && gradeRes.data.success) {
          alert(_t('adm_in_ai_grade', 'Calificaci\u00F3n IA: ') + gradeRes.data.grade + '/100');
          loadAdminInbox();
        } else {
          throw new Error(gradeRes.data?.error || 'La función no retornó success. Data: ' + JSON.stringify(gradeRes.data));
        }
      } catch(e) {
        alert(_t('adm_in_grade_error', 'Error calificando: ') + e.message);
        if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDD16 ' + _t('adm_in_grade_ia', 'Calificar IA'); }
      }
    }

    async function markItemAsAttended(type, id) {
      if (!id) {
        alert(_t('adm_in_marked_attended', 'Marcado como atendido'));
        return;
      }
      
      try {
        let tableName = '';
        let statusField = 'status';
        
        switch(type) {
          case 'tareas': tableName = 'submitted_tasks'; break;
          case 'pagos': tableName = 'payment_intents'; break;
          case 'taxes': tableName = 'tax_form_requests'; break;
          case 'renovaciones': tableName = 'cert_renewal_requests'; break;
        }
        
        if (tableName && supabaseClient && isOnline) {
          await supabaseClient.from(tableName).update({ status: 'attended' }).eq('id', id);
        }
        
        // Update local state
        const item = adminInboxItems.find(i => i.id === id);
        if (item) item.status = 'attended';
        
        updateInboxCounts();
        renderInboxItems();
        
        alert('\u2705 ' + _t('adm_in_marked_attended', 'Marcado como atendido'));
      } catch(e) {
        console.error('Error updating status:', e);
        alert('\u2705 ' + _t('adm_in_marked_local', 'Marcado como atendido (local)'));
      }
    }

    function contactStudent(email, name) {
      const subject = encodeURIComponent(_t('adm_in_followup', 'ACVOLT Tech School - Seguimiento'));
      const body = encodeURIComponent('Hola ' + name + ',\n\nGracias por tu solicitud. Te contactamos respecto a...\n\nSaludos,\nMaestro Mario\nACVOLT Tech School');
      openEmailComposer(email, decodeURIComponent(subject), decodeURIComponent(body), '\uD83D\uDCE7 ' + _t('adm_in_contact_student', 'Contactar Estudiante'));
    }

    async function markAllAsRead() {
      if (!supabaseClient) return;
      var pending = adminInboxItems.filter(function(i) { return i.status === 'pending'; });
      for (var i = 0; i < pending.length; i++) {
        try { await markItemAsAttended(pending[i].type, pending[i].id); } catch(e) { console.warn('[AdminInbox]', e.message || e); }
      }
      loadAdminInbox();
      alert('\u2705 ' + _t('adm_in_all_attended', 'Todos los items marcados como atendidos'));
    }

    function exportInboxToCSV() {
      let csv = _t('adm_in_csv_type', 'Tipo') + ',' + _t('adm_in_csv_title', 'Titulo') + ',' + _t('adm_in_csv_student', 'Estudiante') + ',Email,' + _t('adm_in_csv_date', 'Fecha') + ',' + _t('adm_in_csv_status', 'Estado') + ',' + _t('adm_in_csv_notes', 'Notas') + '\n';
      
      var csvEsc = function(s) { return (s || '').replace(/"/g, '""'); };
      adminInboxItems.forEach(item => {
        csv += `"${csvEsc(item.type)}","${csvEsc(item.title)} - ${csvEsc(item.subtitle)}","${csvEsc(item.student)}","${csvEsc(item.email)}","${csvEsc(item.date)}","${csvEsc(item.status)}","${csvEsc(item.notes)}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bandeja_entrada_' + new Date().toISOString().slice(0,10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    // ============================================
    // END ADMIN INBOX
    // ============================================

    async function requestCertRenewal(certType) {
      const email = localStorage.getItem('tecnico_email') || (typeof currentUser !== 'undefined' && currentUser ? currentUser.email : '') || '';
      const name = localStorage.getItem('tecnico_name') || (typeof currentUser !== 'undefined' && currentUser ? currentUser.nombre : '') || '';
      if (!supabaseClient) { alert(_t('adm_in_db_unavailable', 'Base de datos no disponible')); return; }
      try {
        await supabaseClient.from('cert_renewal_requests').insert([{
          student_name: name,
          student_email: email,
          cert_type: certType,
          requested_at: new Date().toISOString(),
          status: 'pending'
        }]);
        alert(_t('adm_in_renewal_sent', 'Solicitud de renovacion ') + certType + _t('adm_in_renewal_sent2', ' enviada'));
        if (typeof notifyAdmin === 'function') notifyAdmin('Solicitud Renovacion', name + ' solicita renovacion ' + certType, 'renewal');
      } catch(e) {
        alert(_t('adm_in_error_sending', 'Error enviando solicitud: ') + (e.message || e));
      }
    }

    // Go back to top of Mi Perfil, hiding all open sections
    function profileGoHome() {
      profileSectionIds.forEach(function(id) {
        var s = document.getElementById(id);
        if (s) s.style.display = 'none';
      });
      var screen = document.getElementById('miPerfilScreen');
      if (screen) screen.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // scrollToProfileSection moved to js/profile.js (Tier 1)

