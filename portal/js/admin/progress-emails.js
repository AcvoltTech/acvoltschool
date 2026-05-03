    if (typeof _addTranslations === 'function') _addTranslations({
      adm_pe_no_students: { es: 'No hay estudiantes cargados', en: 'No students loaded' },
      adm_pe_no_progress: { es: 'Sin progreso aún', en: 'No progress yet' },
      adm_pe_preview_label: { es: 'Vista Previa del Email (Ejemplo: {name})', en: 'Email Preview (Example: {name})' },
      adm_pe_weekly_summary: { es: 'Aquí está tu resumen semanal de Maestro HVACR', en: 'Here is your weekly summary from Maestro HVACR' },
      adm_pe_your_progress: { es: 'Tu Progreso:', en: 'Your Progress:' },
      adm_pe_next_goal: { es: 'Próximo Objetivo:', en: 'Next Goal:' },
      adm_pe_complete_level: { es: 'Completa tu nivel actual con 80%+ para obtener tu certificado verificable', en: 'Complete your current level with 80%+ to get your verifiable certificate' },
      adm_pe_keep_studying: { es: 'Seguir Estudiando', en: 'Keep Studying' },
      adm_pe_no_connection: { es: 'Sin conexión a Supabase', en: 'No Supabase connection' },
      adm_pe_confirm_send: { es: '¿Enviar email de progreso semanal a todos los estudiantes activos?\n\nSe enviará via Resend a cada estudiante con su progreso personalizado.', en: 'Send weekly progress email to all active students?\n\nWill be sent via Resend to each student with their personalized progress.' },
      adm_pe_sending: { es: 'Enviando...', en: 'Sending...' },
      adm_pe_send: { es: 'Enviar', en: 'Send' },
      adm_pe_success: { es: 'Emails enviados!', en: 'Emails sent!' },
      adm_pe_sent_label: { es: 'Enviados', en: 'Sent' },
      adm_pe_failed_label: { es: 'Fallidos', en: 'Failed' },
      adm_pe_default_name: { es: 'T\u00E9cnico', en: 'Technician' },
      adm_pe_hello_prefix: { es: '\u00A1Hola', en: 'Hi' },
    });

    // ==================== EMAILS DE PROGRESO SEMANAL — #4 ====================
    async function previewWeeklyEmail() {
      var preview = document.getElementById('weeklyEmailPreview');
      if (!window.allTechnicians || window.allTechnicians.length === 0) {
        preview.style.display = 'block';
        preview.innerHTML = '<p style="color:#e74c3c;">' + _t('adm_pe_no_students') + '</p>';
        return;
      }

      var withProgress = window.allTechnicians.filter(function(t) {
        return t.progress && Object.values(t.progress).some(function(p) { return p.completed > 0; });
      });

      document.getElementById('weActiveStudents').textContent = window.allTechnicians.length;
      document.getElementById('weWithProgress').textContent = withProgress.length;

      // Sample email preview
      var sample = withProgress[0] || window.allTechnicians[0];
      var _defName = _t('adm_pe_default_name', 'T\u00E9cnico');
      var nombre = _escHtml(sample ? (sample.nombre || _defName).split(' ')[0] : _defName);
      var nivelesInfo = '';
      if (sample && sample.progress) {
        Object.entries(sample.progress).forEach(function(entry) {
          var nivel = entry[0], p = entry[1];
          if (p.completed > 0) {
            var pct = p.total > 0 ? Math.round((p.score/p.total)*100) : 0;
            nivelesInfo += '<div style="padding:4px 0;color:#e2e8f0;font-size:12px;">' + _escHtml(nivel) + ': ' + pct + '% (' + p.completed + '/' + p.total + ')</div>';
          }
        });
      }
      if (!nivelesInfo) nivelesInfo = '<div style="color:#64748b;font-size:12px;">' + _t('adm_pe_no_progress') + '</div>';
      
      preview.style.display = 'block';
      preview.innerHTML = 
        '<div style="color:#3498db;font-size:12px;font-weight:bold;margin-bottom:8px;">📧 ' + _t('adm_pe_preview_label').replace('{name}', nombre) + '</div>' +
        '<div style="background:#1a1a2e;border-radius:10px;padding:15px;border:1px solid rgba(52,152,219,0.3);">' +
          '<div style="text-align:center;margin-bottom:10px;"><span style="font-size:30px;">🔧</span></div>' +
          '<h3 style="color:#f39c12;text-align:center;margin:0 0 5px;">' + _t('adm_pe_hello_prefix', '\u00A1Hola') + ' ' + nombre + '!</h3>' +
          '<p style="color:#e2e8f0;text-align:center;font-size:13px;margin-bottom:15px;">' + _t('adm_pe_weekly_summary') + '</p>' +
          '<div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px;margin-bottom:10px;">' +
            '<div style="color:#f39c12;font-size:11px;font-weight:bold;margin-bottom:5px;">📊 ' + _t('adm_pe_your_progress') + '</div>' +
            nivelesInfo +
          '</div>' +
          '<div style="background:rgba(39,174,96,0.1);border-radius:8px;padding:10px;margin-bottom:10px;">' +
            '<div style="color:#27ae60;font-size:11px;font-weight:bold;">🎯 ' + _t('adm_pe_next_goal') + '</div>' +
            '<div style="color:#e2e8f0;font-size:12px;">' + _t('adm_pe_complete_level') + '</div>' +
          '</div>' +
          '<div style="text-align:center;padding:10px;">' +
            '<div style="display:inline-block;background:#f39c12;color:#333;padding:10px 25px;border-radius:8px;font-weight:bold;font-size:13px;">🚀 ' + _t('adm_pe_keep_studying') + '</div>' +
          '</div>' +
          '<p style="color:#64748b;font-size:10px;text-align:center;margin-top:10px;">ACVOLT Tech School — Nivel 33 | maestrohvacr.com</p>' +
        '</div>';
    }
    
    async function sendWeeklyEmails(evt) {
      if (!supabaseClient) { alert(_t('adm_pe_no_connection')); return; }
      if (!confirm(_t('adm_pe_confirm_send'))) return;

      try {
        var btn = evt && evt.target ? evt.target : null;
        if (btn) { btn.disabled = true; btn.textContent = '📤 ' + _t('adm_pe_sending'); }
        
        var _peKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
        var response = await fetch('https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/send-weekly-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': _peKey,
            'Authorization': 'Bearer ' + _peKey
          },
          body: JSON.stringify({ admin_email: getAdminEmail() })
        });
        
        var result = await response.json();
        
        if (result.success) {
          document.getElementById('weLastSent').textContent = new Date().toLocaleDateString('es-MX');
          alert('✅ ' + _t('adm_pe_success') + '\n\n📤 ' + _t('adm_pe_sent_label') + ': ' + result.sent + '\n❌ ' + _t('adm_pe_failed_label') + ': ' + result.failed + '\n📊 Total: ' + result.total);
        } else {
          alert('Error: ' + (result.error || 'Unknown error'));
        }
        
        if (btn) { btn.disabled = false; btn.textContent = '📤 ' + _t('adm_pe_send'); }
      } catch(e) {
        alert('Error: ' + e.message);
        if (btn) { btn.disabled = false; btn.textContent = '📤 ' + _t('adm_pe_send'); }
      }
    }

