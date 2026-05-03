    if (typeof _addTranslations === 'function') _addTranslations({
      adm_ia_scanning: { es: 'Buscando actividad de estudiantes...', en: 'Searching student activity...' },
      adm_ia_no_name: { es: 'Sin nombre', en: 'No name' },
      adm_ia_all_active: { es: '¡Todos los estudiantes están activos!', en: 'All students are active!' },
      adm_ia_critical_header: { es: 'CRÍTICO', en: 'CRITICAL' },
      adm_ia_students: { es: 'estudiantes', en: 'students' },
      adm_ia_14plus: { es: '14+ días sin actividad', en: '14+ days without activity' },
      adm_ia_alert_header: { es: 'ALERTA', en: 'ALERT' },
      adm_ia_7_13: { es: '7-13 días sin actividad', en: '7-13 days without activity' },
      adm_ia_days: { es: 'días', en: 'days' },
      adm_ia_no_inactive: { es: 'No hay estudiantes inactivos detectados. Primero haz clic en "Buscar".', en: 'No inactive students detected. Click "Find" first.' },
      adm_ia_confirm_tickets: { es: '¿Crear {n} tickets de Student Success para estudiantes inactivos?', en: 'Create {n} Student Success tickets for inactive students?' },
      adm_ia_table_missing: { es: 'La tabla student_success_tickets no existe en Supabase. Créala primero.', en: 'The student_success_tickets table does not exist in Supabase. Create it first.' },
      adm_ia_tickets_created: { es: '{n} tickets creados en Student Success', en: '{n} tickets created in Student Success' },
      adm_ia_errors: { es: 'errores', en: 'errors' },
      adm_ia_no_inactive_scan: { es: 'No hay estudiantes inactivos. Primero haz clic en 🔄 para buscar.', en: 'No inactive students. Click 🔄 to search first.' },
      adm_ia_no_emails: { es: 'No hay emails disponibles.', en: 'No emails available.' },
      adm_ia_bulk_header: { es: 'Hay {n} estudiantes inactivos.', en: 'There are {n} inactive students.' },
      adm_ia_wa_opened: { es: 'Se abrió WhatsApp con el mensaje de recordatorio.\nEnvíalo a cada estudiante desde tu lista de contactos.', en: 'WhatsApp opened with the reminder message.\nSend it to each student from your contact list.' },
      adm_ia_critical_students: { es: 'Estudiantes críticos (14+ días):', en: 'Critical students (14+ days):' },
      adm_ia_student_inactive: { es: 'Estudiante inactivo por', en: 'Student inactive for' },
      adm_ia_last_activity: { es: 'Última actividad', en: 'Last activity' },
      adm_ia_contact_before_cancel: { es: 'Contactar ANTES de que cancele.', en: 'Contact BEFORE they cancel.' },
    });

    // ==================== ALERTAS DE INACTIVIDAD — AUDITORÍA #4 ====================
    var inactiveStudentsList = [];
    
    async function loadInactivityAlerts() {
      if (!supabaseClient) return;
      var container = document.getElementById('inactivityList');
      if (!container) return;
      container.innerHTML = '<div style="text-align:center;color:#f39c12;padding:15px;">⏳ ' + _t('adm_ia_scanning') + '</div>';
      
      try {
        var users = [], _iaOff = 0, _iaMore = true;
        while (_iaMore) {
          var _iaRes = await usersDataAdmin('admin_list', { offset: _iaOff, limit: 1000, fields: ["id","nombre","email","ultimo_acceso","fecha_registro"] });
          var _iaBatch = _iaRes.data || [];
          users = users.concat(_iaBatch);
          if (_iaBatch.length < 1000) _iaMore = false; else _iaOff += 1000;
        }
        
        var now = new Date();
        var sevenDays = 7 * 24 * 60 * 60 * 1000;
        var fourteenDays = 14 * 24 * 60 * 60 * 1000;
        
        var critical = []; // 14+ days
        var warning = []; // 7-13 days
        var activeCount = 0;
        
        users.forEach(function(u) {
          var lastActive = u.ultimo_acceso ? new Date(u.ultimo_acceso) : (u.fecha_registro ? new Date(u.fecha_registro) : null);
          if (!lastActive) return;
          
          var daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (24*60*60*1000));
          
          if (daysSince >= 14) {
            critical.push({ id: u.id, nombre: u.nombre || u.email || _t('adm_ia_no_name'), email: u.email, days: daysSince, lastActive: lastActive });
          } else if (daysSince >= 7) {
            warning.push({ id: u.id, nombre: u.nombre || u.email || _t('adm_ia_no_name'), email: u.email, days: daysSince, lastActive: lastActive });
          } else {
            activeCount++;
          }
        });
        
        inactiveStudentsList = critical.concat(warning);
        
        // Sort by days inactive (most inactive first)
        critical.sort(function(a,b) { return b.days - a.days; });
        warning.sort(function(a,b) { return b.days - a.days; });
        
        document.getElementById('inactCritical').textContent = critical.length;
        document.getElementById('inactWarning').textContent = warning.length;
        document.getElementById('inactActive').textContent = activeCount;
        
        if (critical.length === 0 && warning.length === 0) {
          container.innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:40px;">🎉</div><p style="color:#27ae60;font-size:14px;">' + _t('adm_ia_all_active') + '</p></div>';
          return;
        }
        
        var html = '';
        
        function _inactRow(s, bgColor) {
          var waMsg = encodeURIComponent('Hola ' + (s.nombre || '') + ', te extrañamos en ACVOLT Tech School! 📚 Han pasado ' + s.days + ' días desde tu última sesión. Entra a maestrohvacr.com y sigue avanzando en tu certificación HVAC. ¡Tú puedes! 💪 - Maestro Mario');
          var emailSubject = encodeURIComponent('Te extrañamos en ACVOLT Tech School');
          var emailBody = encodeURIComponent('Hola ' + (s.nombre || '') + ',\n\nHan pasado ' + s.days + ' días desde tu última sesión en Maestro HVACR.\n\nEntra a maestrohvacr.com y sigue avanzando en tu certificación HVAC.\n\n¡Te esperamos!\nMaestro Mario\nACVOLT Tech School');
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);background:' + bgColor + ';border-radius:6px;margin:3px 0;gap:8px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;"><strong style="color:#1e293b;font-size:12px;">' + _escHtml(s.nombre) + '</strong><br><span style="color:#64748b;font-size:10px;">' + _escHtml(s.email || '') + '</span></div>' +
            '<div style="display:flex;gap:4px;align-items:center;">' +
              '<a href="https://wa.me/?text=' + waMsg + '" target="_blank" style="background:#25D366;color:#fff;padding:4px 8px;border-radius:6px;font-size:10px;text-decoration:none;font-weight:bold;white-space:nowrap;">💬 WhatsApp</a>' +
              (s.email ? '<a href="https://mail.google.com/mail/?view=cm&fs=1&to=' + _escHtml(s.email) + '&su=' + emailSubject + '&body=' + emailBody + '" target="_blank" style="background:#3498db;color:#fff;padding:4px 8px;border-radius:6px;font-size:10px;text-decoration:none;font-weight:bold;white-space:nowrap;">📧 Email</a>' : '') +
            '</div>' +
            '<div style="text-align:right;min-width:65px;"><span style="color:' + (s.days >= 14 ? '#dc2626' : '#f39c12') + ';font-weight:bold;font-size:14px;">' + s.days + ' ' + _t('adm_ia_days') + '</span><br><span style="color:#64748b;font-size:9px;">' + s.lastActive.toLocaleDateString('es-MX') + '</span></div>' +
          '</div>';
        }

        if (critical.length > 0) {
          html += '<div style="color:#e74c3c;font-size:12px;font-weight:bold;padding:8px 0;">🔴 ' + _t('adm_ia_critical_header') + ' — ' + critical.length + ' ' + _t('adm_ia_students') + ' (' + _t('adm_ia_14plus') + ')</div>';
          critical.forEach(function(s) { html += _inactRow(s, 'rgba(231,76,60,0.08)'); });
        }

        if (warning.length > 0) {
          html += '<div style="color:#f39c12;font-size:12px;font-weight:bold;padding:8px 0;margin-top:8px;">🟡 ' + _t('adm_ia_alert_header') + ' — ' + warning.length + ' ' + _t('adm_ia_students') + ' (' + _t('adm_ia_7_13') + ')</div>';
          warning.forEach(function(s) { html += _inactRow(s, 'rgba(243,156,18,0.06)'); });
        }
        
        container.innerHTML = html;
        console.log('[Inactividad] Crítico: ' + critical.length + ' | Alerta: ' + warning.length + ' | Activos: ' + activeCount);
      } catch(e) {
        console.error('[Inactividad] Error:', e);
        container.innerHTML = '<div style="color:#e74c3c;padding:15px;text-align:center;">Error: ' + _escHtml(e.message) + '</div>';
      }
    }
    
    async function createInactivityTickets() {
      if (!supabaseClient || inactiveStudentsList.length === 0) {
        alert(_t('adm_ia_no_inactive'));
        return;
      }

      if (!confirm(_t('adm_ia_confirm_tickets').replace('{n}', inactiveStudentsList.length))) return;

      // Verify table exists before looping
      var { error: tableCheck } = await supabaseClient.from('student_success_tickets').select('id').limit(1);
      if (tableCheck) {
        alert(_t('adm_ia_table_missing'));
        console.error('[Inactivity] Table not available:', tableCheck.message);
        return;
      }

      var created = 0;
      var errors = 0;
      for (var i = 0; i < inactiveStudentsList.length; i++) {
        var s = inactiveStudentsList[i];
        try {
          var severity = s.days >= 14 ? _t('adm_ia_critical_header') : _t('adm_ia_alert_header');
          var { error: insErr } = await supabaseClient.from('student_success_tickets').insert({
            student_name: s.nombre,
            student_email: s.email || '',
            tipo: 'inactividad',
            estado: 'abierto',
            prioridad: s.days >= 14 ? 'alta' : 'media',
            descripcion: '⚠️ [' + severity + '] ' + _t('adm_ia_student_inactive') + ' ' + s.days + ' ' + _t('adm_ia_days') + '. ' + _t('adm_ia_last_activity') + ': ' + s.lastActive.toLocaleDateString('es-MX') + '. ' + _t('adm_ia_contact_before_cancel'),
            fecha_limite: new Date(Date.now() + (s.days >= 14 ? 2 : 5) * 24*60*60*1000).toISOString(),
            email_enviado_estudiante: false
          });
          if (insErr) { console.warn('[Ticket] Insert error for ' + s.nombre + ':', insErr.message); errors++; }
          else { created++; }
        } catch(e) { console.error('[Ticket] Error para ' + s.nombre + ':', e); errors++; }
      }

      alert(_t('adm_ia_tickets_created').replace('{n}', created) + (errors > 0 ? ' (' + errors + ' ' + _t('adm_ia_errors') + ')' : ''));
      inactiveStudentsList = [];
      loadInactivityAlerts();
    }

    function sendBulkInactivityReminder() {
      if (!inactiveStudentsList || inactiveStudentsList.length === 0) {
        alert(_t('adm_ia_no_inactive_scan'));
        return;
      }
      var msg = 'Hola! 📚 Te extrañamos en ACVOLT Tech School. Entra a maestrohvacr.com y sigue avanzando en tu certificación HVAC. ¡Tú puedes! 💪 - Maestro Mario';
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
      alert('📋 ' + _t('adm_ia_bulk_header').replace('{n}', inactiveStudentsList.length) + '\n\n' + _t('adm_ia_wa_opened') + '\n\n' + _t('adm_ia_critical_students') + '\n' +
        inactiveStudentsList.filter(function(s){ return s.days >= 14; }).slice(0,10).map(function(s){ return '• ' + s.nombre + ' (' + s.days + 'd) - ' + (s.email||''); }).join('\n'));
    }

    function sendBulkEmailReminder() {
      if (!inactiveStudentsList || inactiveStudentsList.length === 0) {
        alert(_t('adm_ia_no_inactive_scan'));
        return;
      }
      var emails = inactiveStudentsList.filter(function(s){ return s.email; }).map(function(s){ return s.email; });
      if (emails.length === 0) { alert(_t('adm_ia_no_emails')); return; }
      var subject = encodeURIComponent('Te extrañamos en ACVOLT Tech School - ¡Regresa!');
      var body = encodeURIComponent('Hola estudiante de ACVOLT,\n\nNotamos que no has entrado a la app recientemente.\n\nRecuerda que puedes acceder a:\n✅ +3,500 preguntas de práctica\n✅ Clases grabadas de Zoom\n✅ Certificaciones HVAC\n\nEntra ahora: maestrohvacr.com\n\n¡Te esperamos!\nMaestro Mario\nACVOLT Tech School');
      var bcc = emails.join(',');
      // Use Gmail compose URL (handles long BCC lists)
      window.open('https://mail.google.com/mail/?view=cm&fs=1&bcc=' + bcc + '&su=' + subject + '&body=' + body, '_blank');
    }

