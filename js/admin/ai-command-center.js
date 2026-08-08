/* ============================================================
   Centro de Comando IA — Daily AI Briefing para CRM
   Reutiliza: instructor-ai-chat, grade-task, send-push-notification
   ============================================================ */
(function() {
  'use strict';

  if (typeof _addTranslations === 'function') _addTranslations({
    adm_ai_title: { es: 'Centro de Comando IA', en: 'AI Command Center' },
    adm_ai_analyzing: { es: 'Analizando datos de la escuela...', en: 'Analyzing school data...' },
    adm_ai_actions: { es: 'Acciones Prioritarias', en: 'Priority Actions' },
    adm_ai_go: { es: 'Ir \u2192', en: 'Go \u2192' },
    adm_ai_auto: { es: '\u26A1 Auto', en: '\u26A1 Auto' },
    adm_ai_weekly: { es: '\uD83D\uDCCA Reporte Semanal', en: '\uD83D\uDCCA Weekly Report' },
    adm_ai_chat: { es: '\uD83D\uDCAC Chat IA', en: '\uD83D\uDCAC AI Chat' },
    adm_ai_refresh: { es: 'Actualizar', en: 'Refresh' },
    adm_ai_error_title: { es: 'Error al cargar briefing', en: 'Error loading briefing' },
    adm_ai_retry: { es: '\uD83D\uDD04 Reintentar', en: '\uD83D\uDD04 Retry' },
    adm_ai_report_title: { es: '\uD83D\uDCCA Reporte Semanal IA', en: '\uD83D\uDCCA AI Weekly Report' },
    adm_ai_generating: { es: 'Generando reporte...', en: 'Generating report...' },
    adm_ai_report_error: { es: 'Error generando reporte: ', en: 'Error generating report: ' },
    adm_ai_confirm_payments: { es: '\u00BFEnviar recordatorios de pago a todos los estudiantes con pago vencido?', en: 'Send payment reminders to all students with overdue payments?' },
    adm_ai_no_reminders: { es: 'El m\u00F3dulo de recordatorios no est\u00E1 cargado. Ve a Finanzas primero.', en: 'Reminders module not loaded. Go to Finance first.' },
    adm_ai_confirm_inactivity: { es: '\u00BFEnviar notificaci\u00F3n "Te extra\u00F1amos" a estudiantes inactivos 14+ d\u00EDas?', en: 'Send "We miss you" notification to students inactive 14+ days?' },
    adm_ai_no_inactive: { es: 'No hay estudiantes inactivos 14+ d\u00EDas.', en: 'No students inactive 14+ days.' },
    adm_ai_sent_to: { es: 'Enviado a ', en: 'Sent to ' },
    adm_ai_inactive_students: { es: ' estudiantes inactivos.', en: ' inactive students.' },
    adm_ai_confirm_grade: { es: '\u00BFCalificar autom\u00E1ticamente con IA todas las tareas pendientes?', en: 'Auto-grade all pending tasks with AI?' },
    adm_ai_no_pending: { es: 'No hay tareas pendientes por calificar.', en: 'No pending tasks to grade.' },
    adm_ai_graded: { es: 'Calificadas: ', en: 'Graded: ' },
    adm_ai_tasks: { es: ' tareas', en: ' tasks' },
    adm_ai_errors: { es: ' errores', en: ' errors' },
  });

  var INSTRUCTOR_AI_URL = 'https://htklsowiyjwsjnacnvnr.supabase.co/functions/v1/instructor-ai-chat';
  var _aiccCache = { data: null, ts: 0 };
  var CACHE_TTL = 30 * 60 * 1000; // 30 min

  function _sb() { return window.supabaseClient; }

  // ── 2a. Data Gathering ──────────────────────────────────────
  async function _aiccGatherBriefingData() {
    var now = new Date();
    var sevenDaysAgo = new Date(now - 7 * 86400000).toISOString();
    var fourteenDaysAgo = new Date(now - 14 * 86400000).toISOString();
    var thirtyDaysAgo = new Date(now - 30 * 86400000).toISOString();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    var results = await Promise.all([
      (async function() { var all = [], off = 0, more = true; while (more) { var r = await usersDataAdmin('admin_list', { offset: off, limit: 1000, fields: ["id","nombre","email","ultimo_acceso","fecha_registro"] }); var b = r.data || []; all = all.concat(b); if (b.length < 1000) more = false; else off += 1000; } return { data: all }; })(),
      MaestroMemberships.list('*'),
      _sb().from('student_success_tickets').select('id, estado, prioridad, tipo, created_at').eq('estado', 'abierto'),
      _sb().from('submitted_tasks').select('id, student_email, task_type, submitted_at, grade').is('grade', null).order('submitted_at', { ascending: false }),
      _sb().from('attendance').select('id, student_id, check_in, check_out').gte('check_in', sevenDaysAgo),
      _sb().from('screen_events').select('user_email, screen_id, entered_at').gte('entered_at', sevenDaysAgo)
    ]);

    var users = results[0].data || [];
    var memberships = results[1].data || [];
    var tickets = results[2].data || [];
    var ungradedTasks = results[3].data || [];
    var attendance = results[4].data || [];
    var screenEvents = results[5].data || [];
    // Derive recent payments from full memberships (already fetched above)
    var recentPayments = memberships.filter(function(m) { return m.created_at && new Date(m.created_at) >= new Date(thirtyDaysAgo); });

    // Process users
    var totalUsers = users.length;
    var activosHoy = 0, inactivos7d = 0, inactivos14d = 0;
    users.forEach(function(u) {
      if (!u.ultimo_acceso) { inactivos14d++; return; }
      var lastAccess = new Date(u.ultimo_acceso);
      if (lastAccess >= new Date(todayStart)) activosHoy++;
      if (lastAccess < new Date(sevenDaysAgo)) inactivos7d++;
      if (lastAccess < new Date(fourteenDaysAgo)) inactivos14d++;
    });

    // Process memberships
    var memActivas = memberships.filter(function(m) { return m.activa; });
    var memCanceladas30d = memberships.filter(function(m) {
      return !m.activa && m.created_at && new Date(m.created_at) >= new Date(thirtyDaysAgo);
    });
    var mrr = 0;
    memActivas.forEach(function(m) { mrr += parseFloat(m.amount || 0); });

    // Tickets urgentes
    var ticketsAlta = tickets.filter(function(t) { return t.prioridad === 'alta'; });

    return {
      total_estudiantes: totalUsers,
      activos_hoy: activosHoy,
      inactivos_7d: inactivos7d,
      inactivos_14d: inactivos14d,
      memberships_activas: memActivas.length,
      memberships_canceladas_30d: memCanceladas30d.length,
      mrr: mrr.toFixed(2),
      tickets_abiertos: tickets.length,
      tickets_urgentes: ticketsAlta.length,
      tareas_sin_calificar: ungradedTasks.length,
      asistencia_7d: attendance.length,
      pagos_recientes_30d: recentPayments.length,
      sesiones_7d: screenEvents.length,
      fecha: now.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  }

  // ── 2b. AI Call ─────────────────────────────────────────────
  async function _aiccCallAI(data) {
    var systemPrompt = 'Eres el asistente IA de gestión de ACVOLT, una escuela de técnicos de HVAC. ' +
      'Mario y su esposa administran 344+ estudiantes solos. Analiza los datos y responde SOLO con JSON válido (sin markdown, sin ```). ' +
      'Formato exacto:\n' +
      '{\n' +
      '  "saludo": "Buenos días Mario...",\n' +
      '  "health_score": 78,\n' +
      '  "health_label": "Bueno",\n' +
      '  "acciones_prioritarias": [\n' +
      '    {"titulo": "...", "tipo": "pago|inactividad|tarea|ticket", "urgencia": "alta|media|baja", "accion_id": "send_payment_reminders", "detalle": "..."}\n' +
      '  ],\n' +
      '  "metricas": [\n' +
      '    {"label": "Activos Hoy", "valor": "12", "trend": "up|down|stable", "alerta": false}\n' +
      '  ],\n' +
      '  "revenue_alerta": "Mensaje o null",\n' +
      '  "tip_del_dia": "Consejo práctico"\n' +
      '}\n\n' +
      'Acciones válidas para accion_id: send_payment_reminders, send_inactivity_followups, auto_grade_tasks, generate_weekly_report, view_tickets, view_inbox.\n' +
      'Health score: 0-100 (verde >=70, amarillo >=40, rojo <40).\n' +
      'Siempre incluye al menos 3 métricas y 2 acciones prioritarias. Sé específico con números reales.';

    var userMsg = 'Datos de hoy (' + data.fecha + '):\n' +
      '- Total estudiantes: ' + data.total_estudiantes + '\n' +
      '- Activos hoy: ' + data.activos_hoy + '\n' +
      '- Inactivos 7+ días: ' + data.inactivos_7d + '\n' +
      '- Inactivos 14+ días: ' + data.inactivos_14d + '\n' +
      '- Membresías activas: ' + data.memberships_activas + '\n' +
      '- Cancelaciones últimos 30d: ' + data.memberships_canceladas_30d + '\n' +
      '- MRR estimado: $' + data.mrr + '\n' +
      '- Tickets abiertos: ' + data.tickets_abiertos + ' (urgentes: ' + data.tickets_urgentes + ')\n' +
      '- Tareas sin calificar: ' + data.tareas_sin_calificar + '\n' +
      '- Check-ins últimos 7d: ' + data.asistencia_7d + '\n' +
      '- Pagos recientes 30d: ' + data.pagos_recientes_30d + '\n' +
      '- Sesiones app 7d: ' + data.sesiones_7d;

    var response = await fetch(INSTRUCTOR_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (_sb().supabaseKey || '')
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMsg }],
        system: systemPrompt,
        max_tokens: 1500,
        admin_email: getAdminEmail()
      })
    });

    if (!response.ok) throw new Error('AI Error ' + response.status);
    var result = await response.json();
    var text = (result.reply || result.content || '').trim();

    // Clean markdown fences if present
    text = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();

    return JSON.parse(text);
  }

  // ── 2c. UI Rendering ───────────────────────────────────────
  function _aiccRenderLoading(container) {
    container.innerHTML =
      '<div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:24px;color:#fff;margin-bottom:16px;">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
          '<div style="width:48px;height:48px;border-radius:50%;background:rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:24px;">🤖</div>' +
          '<div>' +
            '<div style="font-size:16px;font-weight:700;">' + _t('adm_ai_title', 'Centro de Comando IA') + '</div>' +
            '<div style="font-size:12px;color:#94a3b8;">' + _t('adm_ai_analyzing', 'Analizando datos de la escuela...') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;justify-content:center;padding:20px 0;">' +
          '<div class="aicc-dot" style="width:8px;height:8px;border-radius:50%;background:#6366f1;animation:aiccPulse 1.4s ease-in-out infinite;"></div>' +
          '<div class="aicc-dot" style="width:8px;height:8px;border-radius:50%;background:#6366f1;animation:aiccPulse 1.4s ease-in-out 0.2s infinite;"></div>' +
          '<div class="aicc-dot" style="width:8px;height:8px;border-radius:50%;background:#6366f1;animation:aiccPulse 1.4s ease-in-out 0.4s infinite;"></div>' +
        '</div>' +
      '</div>' +
      '<style>@keyframes aiccPulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1.2)}}</style>';
  }

  function _aiccRender(container, briefing) {
    var hs = briefing.health_score || 0;
    var hsColor = hs >= 70 ? '#22c55e' : hs >= 40 ? '#eab308' : '#ef4444';
    var hsBg = hs >= 70 ? 'rgba(34,197,94,0.15)' : hs >= 40 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)';

    var html = '<div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:24px;color:#fff;margin-bottom:16px;">';

    // Header with health score
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">' +
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="width:48px;height:48px;border-radius:50%;background:rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:24px;">🤖</div>' +
        '<div>' +
          '<div style="font-size:16px;font-weight:700;">' + _t('adm_ai_title', 'Centro de Comando IA') + '</div>' +
          '<div style="font-size:12px;color:#94a3b8;">' + _escHtml(briefing.saludo || '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="width:64px;height:64px;border-radius:50%;background:' + hsBg + ';border:3px solid ' + hsColor + ';display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
          '<div style="font-size:20px;font-weight:900;color:' + hsColor + ';">' + hs + '</div>' +
          '<div style="font-size:8px;color:' + hsColor + ';font-weight:600;">' + _escHtml(briefing.health_label || '') + '</div>' +
        '</div>' +
        '<button onclick="_aiccRefresh()" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:11px;" title="' + _t('adm_ai_refresh', 'Actualizar') + '">\uD83D\uDD04</button>' +
      '</div>' +
    '</div>';

    // Metrics row
    var metricas = briefing.metricas || [];
    if (metricas.length) {
      html += '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:16px;-webkit-overflow-scrolling:touch;">';
      metricas.forEach(function(m) {
        var trendIcon = m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→';
        var trendColor = m.trend === 'up' ? '#22c55e' : m.trend === 'down' ? '#ef4444' : '#94a3b8';
        var alertBg = m.alerta ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)';
        var alertBorder = m.alerta ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)';
        html += '<div style="flex:0 0 auto;min-width:100px;background:' + alertBg + ';border:' + alertBorder + ';border-radius:10px;padding:12px;text-align:center;">' +
          '<div style="font-size:9px;color:#94a3b8;font-weight:600;margin-bottom:4px;white-space:nowrap;">' + _escHtml(m.label) + '</div>' +
          '<div style="font-size:20px;font-weight:800;color:#fff;">' + _escHtml(m.valor) + '</div>' +
          '<div style="font-size:10px;color:' + trendColor + ';font-weight:600;">' + trendIcon + '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    // Priority actions
    var acciones = briefing.acciones_prioritarias || [];
    if (acciones.length) {
      html += '<div style="margin-bottom:16px;">' +
        '<div style="font-size:11px;color:#94a3b8;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">' + _t('adm_ai_actions', 'Acciones Prioritarias') + '</div>';
      acciones.forEach(function(a) {
        var urgColor = a.urgencia === 'alta' ? '#ef4444' : a.urgencia === 'media' ? '#eab308' : '#22c55e';
        var tipoIcon = a.tipo === 'pago' ? '💰' : a.tipo === 'inactividad' ? '👻' : a.tipo === 'tarea' ? '📝' : a.tipo === 'ticket' ? '🎯' : '📋';
        var navSection = _aiccGetNavSection(a.accion_id);
        var canAuto = ['send_payment_reminders', 'send_inactivity_followups', 'auto_grade_tasks', 'generate_weekly_report'].indexOf(a.accion_id) !== -1;

        html += '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-left:3px solid ' + urgColor + ';border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
          '<div style="flex:1;min-width:150px;">' +
            '<div style="font-size:13px;font-weight:600;">' + tipoIcon + ' ' + _escHtml(a.titulo) + '</div>' +
            (a.detalle ? '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' + _escHtml(a.detalle) + '</div>' : '') +
          '</div>' +
          '<div style="display:flex;gap:4px;">';

        if (navSection) {
          html += '<button onclick="showCrmSection(\'' + navSection + '\',document.querySelector(\'[data-crm-section=' + navSection + ']\'))" style="background:rgba(99,102,241,0.3);border:1px solid rgba(99,102,241,0.5);color:#a5b4fc;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;white-space:nowrap;">' + _t('adm_ai_go', 'Ir \u2192') + '</button>';
        }
        if (canAuto) {
          html += '<button onclick="_aiccAutoAction(\'' + a.accion_id + '\')" style="background:rgba(234,179,8,0.3);border:1px solid rgba(234,179,8,0.5);color:#fde047;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;white-space:nowrap;">' + _t('adm_ai_auto', '\u26A1 Auto') + '</button>';
        }

        html += '</div></div>';
      });
      html += '</div>';
    }

    // Revenue alert
    if (briefing.revenue_alerta) {
      html += '<div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;">' +
        '⚠️ ' + _escHtml(briefing.revenue_alerta) +
      '</div>';
    }

    // Tip of the day
    if (briefing.tip_del_dia) {
      html += '<div style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;">' +
        '💡 ' + _escHtml(briefing.tip_del_dia) +
      '</div>';
    }

    // Bottom buttons
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<button onclick="_aiccAutoAction(\'generate_weekly_report\')" style="flex:1;min-width:120px;background:rgba(99,102,241,0.3);border:1px solid rgba(99,102,241,0.5);color:#a5b4fc;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:12px;font-weight:600;">' + _t('adm_ai_weekly', '\uD83D\uDCCA Reporte Semanal') + '</button>' +
      '<button onclick="if(typeof toggleAdminAIPanel===\'function\'){toggleAdminAIPanel();}else{showCrmSection(\'zonaMaestro\',document.querySelector(\'[data-crm-section=zonaMaestro]\'));}" style="flex:1;min-width:120px;background:rgba(34,197,94,0.3);border:1px solid rgba(34,197,94,0.5);color:#86efac;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:12px;font-weight:600;">' + _t('adm_ai_chat', '\uD83D\uDCAC Chat IA') + '</button>' +
    '</div>';

    html += '</div>';
    container.innerHTML = html;
  }

  function _aiccRenderError(container, msg) {
    container.innerHTML =
      '<div style="background:linear-gradient(135deg,#1e293b,#334155);border-radius:16px;padding:24px;color:#fff;margin-bottom:16px;">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
          '<div style="width:48px;height:48px;border-radius:50%;background:rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;font-size:24px;">🤖</div>' +
          '<div>' +
            '<div style="font-size:16px;font-weight:700;">' + _t('adm_ai_title', 'Centro de Comando IA') + '</div>' +
            '<div style="font-size:12px;color:#f87171;">' + _t('adm_ai_error_title', 'Error al cargar briefing') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="color:#fca5a5;font-size:12px;margin-bottom:12px;">' + _escHtml(msg) + '</div>' +
        '<button onclick="_aiccRefresh()" style="background:rgba(99,102,241,0.3);border:1px solid rgba(99,102,241,0.5);color:#a5b4fc;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:12px;">' + _t('adm_ai_retry', '\uD83D\uDD04 Reintentar') + '</button>' +
      '</div>';
  }

  // ── Helper: map accion_id to CRM section ────────────────────
  function _aiccGetNavSection(accionId) {
    var map = {
      send_payment_reminders: 'ingresos',
      send_inactivity_followups: 'alertas',
      auto_grade_tasks: 'bandeja',
      view_tickets: 'success',
      view_inbox: 'bandeja',
      generate_weekly_report: null
    };
    return map[accionId] || null;
  }

  // ── 2d. Auto-Actions ───────────────────────────────────────
  window._aiccAutoAction = async function(accionId) {
    if (accionId === 'send_payment_reminders') {
      if (!confirm(_t('adm_ai_confirm_payments', '\u00BFEnviar recordatorios de pago a todos los estudiantes con pago vencido?'))) return;
      try {
        if (typeof sendAllReminders === 'function') {
          await sendAllReminders();
        } else {
          alert(_t('adm_ai_no_reminders', 'El m\u00F3dulo de recordatorios no est\u00E1 cargado. Ve a Finanzas primero.'));
        }
      } catch(e) {
        console.error('[AICC] Error payment reminders:', e);
        alert('Error: ' + e.message);
      }
    }

    else if (accionId === 'send_inactivity_followups') {
      if (!confirm(_t('adm_ai_confirm_inactivity', '\u00BFEnviar notificaci\u00F3n "Te extra\u00F1amos" a estudiantes inactivos 14+ d\u00EDas?'))) return;
      try {
        var fourteenAgo = new Date(Date.now() - 14 * 86400000).toISOString();
        var _ud_inactivos = await usersDataAdmin('admin_list', { filters: { inactive_since: fourteenAgo }, fields: ['email','nombre'], limit: 5000 }); var inactivos = _ud_inactivos.data || [];
        inactivos = (inactivos || []).filter(function(u) { return u.email; });
        if (!inactivos.length) { alert(_t('adm_ai_no_inactive', 'No hay estudiantes inactivos 14+ d\u00EDas.')); return; }

        var emails = inactivos.map(function(u) { return u.email; });
        await _sb().functions.invoke('send-push-notification', {
          body: {
            recipient_emails: emails,
            title: '¡Te extrañamos en ACVOLT! 💪',
            body: 'Han pasado más de 2 semanas. Tus compañeros siguen avanzando — ¡no te quedes atrás! Entra hoy y retoma tu progreso.',
            type: 'inactivity_followup',
            admin_email: getAdminEmail()
          }
        });
        alert(_t('adm_ai_sent_to', 'Enviado a ') + emails.length + _t('adm_ai_inactive_students', ' estudiantes inactivos.'));
      } catch(e) {
        console.error('[AICC] Error inactivity followups:', e);
        alert('Error: ' + e.message);
      }
    }

    else if (accionId === 'auto_grade_tasks') {
      if (!confirm(_t('adm_ai_confirm_grade', '\u00BFCalificar autom\u00E1ticamente con IA todas las tareas pendientes?'))) return;
      try {
        var { data: pending } = await _sb().from('submitted_tasks').select('id, task_type, file_urls, grade').is('grade', null).order('submitted_at', { ascending: false }).limit(20);
        pending = pending || [];
        if (!pending.length) { alert(_t('adm_ai_no_pending', 'No hay tareas pendientes por calificar.')); return; }

        var graded = 0, errors = 0;
        for (var i = 0; i < pending.length; i++) {
          var task = pending[i];
          var imageUrls = [];
          try { imageUrls = JSON.parse(task.file_urls || '[]'); } catch(e) { console.warn('[AiCommandCenter]', e.message || e); }
          try {
            await _sb().functions.invoke('grade-task', {
              body: {
                taskId: task.id,
                imageUrls: imageUrls.slice(0, 5),
                videoFrameUrls: [],
                taskType: task.task_type || 'tarea',
                studentMessage: ''
              }
            });
            graded++;
          } catch(e) {
            console.error('[AICC] Grade error task ' + task.id + ':', e);
            errors++;
          }
        }
        alert(_t('adm_ai_graded', 'Calificadas: ') + graded + _t('adm_ai_tasks', ' tareas') + (errors ? ' (' + errors + _t('adm_ai_errors', ' errores') + ')' : ''));
        if (typeof loadInbox === 'function') loadInbox();
      } catch(e) {
        console.error('[AICC] Error auto grade:', e);
        alert('Error: ' + e.message);
      }
    }

    else if (accionId === 'generate_weekly_report') {
      _aiccGenerateWeeklyReport();
    }
  };

  // ── Weekly Report Modal ─────────────────────────────────────
  async function _aiccGenerateWeeklyReport() {
    var overlay = document.createElement('div');
    overlay.id = 'aiccReportModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML =
      '<div style="background:#1e293b;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;padding:24px;color:#fff;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<h3 style="margin:0;font-size:18px;">' + _t('adm_ai_report_title', '\uD83D\uDCCA Reporte Semanal IA') + '</h3>' +
          '<button onclick="document.getElementById(\'aiccReportModal\').remove()" style="background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;">✕</button>' +
        '</div>' +
        '<div id="aiccReportContent" style="font-size:13px;line-height:1.6;">' +
          '<div style="text-align:center;padding:30px;color:#94a3b8;">' + _t('adm_ai_generating', 'Generando reporte...') + '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

    try {
      var data = await _aiccGatherBriefingData();
      var systemPrompt = 'Eres el asistente IA de ACVOLT. Genera un REPORTE SEMANAL completo en español con formato HTML inline (sin markdown). ' +
        'Incluye: resumen ejecutivo, métricas clave con comparativas, salud financiera, engagement estudiantil, tickets pendientes, ' +
        'tareas sin calificar, recomendaciones concretas para la semana. Usa <h4>, <p>, <ul>, <li>, <strong>, <span style="color:..."> para formato. ' +
        'Sé específico con números.';

      var userMsg = 'Genera el reporte semanal con estos datos:\n' +
        '- Estudiantes totales: ' + data.total_estudiantes + '\n' +
        '- Activos hoy: ' + data.activos_hoy + '\n' +
        '- Inactivos 7d: ' + data.inactivos_7d + ' | 14d: ' + data.inactivos_14d + '\n' +
        '- Membresías activas: ' + data.memberships_activas + '\n' +
        '- Cancelaciones 30d: ' + data.memberships_canceladas_30d + '\n' +
        '- MRR: $' + data.mrr + '\n' +
        '- Tickets abiertos: ' + data.tickets_abiertos + ' (urgentes: ' + data.tickets_urgentes + ')\n' +
        '- Tareas sin calificar: ' + data.tareas_sin_calificar + '\n' +
        '- Check-ins 7d: ' + data.asistencia_7d + '\n' +
        '- Sesiones app 7d: ' + data.sesiones_7d;

      var response = await fetch(INSTRUCTOR_AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (_sb().supabaseKey || '')
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMsg }],
          system: systemPrompt,
          max_tokens: 2000,
          admin_email: getAdminEmail()
        })
      });

      if (!response.ok) throw new Error('Error ' + response.status);
      var result = await response.json();
      var reportHtml = (result.reply || result.content || 'Sin respuesta').trim();
      // Sanitize AI-generated HTML to prevent XSS (strip scripts, event handlers, iframes)
      document.getElementById('aiccReportContent').innerHTML = (typeof _sanitizeHtml === 'function') ? _sanitizeHtml(reportHtml) : _escHtml(reportHtml);
    } catch(e) {
      console.error('[AICC] Report error:', e);
      document.getElementById('aiccReportContent').innerHTML = '<div style="color:#f87171;">' + _t('adm_ai_report_error', 'Error generando reporte: ') + _escHtml(e.message) + '</div>';
    }
  }

  // ── 2e. Init + Cache ───────────────────────────────────────
  window._aiccRefresh = function() {
    _aiccCache = { data: null, ts: 0 };
    _aiccInit();
  };

  var _aiccInitRunning = false;

  function _aiccIsDashboardVisible() {
    // Only show on dashboard section, not other CRM sections
    var active = document.querySelector('.crm-sidebar-item.crm-active');
    if (active) {
      var sec = active.getAttribute('data-crm-section');
      return sec === 'dashboard';
    }
    // Fallback: check if welcome banner is visible (dashboard indicator)
    var wb = document.querySelector('.crm-welcome');
    return wb && wb.style.display !== 'none';
  }

  async function _aiccInit() {
    var container = document.getElementById('aiCommandCenter');
    if (!container) { console.warn('[AICC] No container found'); return; }
    if (!_sb()) { console.warn('[AICC] Supabase not ready'); return; }
    if (_aiccInitRunning) return;

    // Only run on dashboard
    if (!_aiccIsDashboardVisible()) {
      console.log('[AICC] Not on dashboard, skipping');
      return;
    }

    // Show container
    container.style.display = '';

    // Check role — only master/admin (empty = not set yet, allow it)
    var role = sessionStorage.getItem('admin_role') || '';
    if (role && role !== 'master') {
      container.style.display = 'none';
      return;
    }

    // Cache check
    if (_aiccCache.data && (Date.now() - _aiccCache.ts < CACHE_TTL)) {
      _aiccRender(container, _aiccCache.data);
      return;
    }

    _aiccInitRunning = true;
    _aiccRenderLoading(container);

    try {
      var rawData = await _aiccGatherBriefingData();
      var briefing = await _aiccCallAI(rawData);
      _aiccCache = { data: briefing, ts: Date.now() };
      _aiccRender(container, briefing);
      console.log('[AICC] Briefing loaded, health:', briefing.health_score);
    } catch(e) {
      console.error('[AICC] Init error:', e);
      _aiccRenderError(container, e.message);
    }
    _aiccInitRunning = false;
  }

  // Hook: patch showCrmSection after all scripts load
  var _aiccPatched = false;
  function _aiccPatchNav() {
    if (_aiccPatched) return;
    if (typeof window.showCrmSection !== 'function') return;
    _aiccPatched = true;
    var _orig = window.showCrmSection;
    window.showCrmSection = function(sectionId, clickedItem) {
      _orig(sectionId, clickedItem);
      if (sectionId === 'dashboard') {
        setTimeout(_aiccInit, 200);
      }
    };
    console.log('[AICC] Patched showCrmSection');
  }

  // Retry init until supabase + CRM are ready
  function _aiccBootstrap() {
    _aiccPatchNav();
    // Check if admin dashboard is visible (CRM loaded + logged in)
    var adminScreen = document.getElementById('adminDashboardScreen');
    if (adminScreen && adminScreen.style.display !== 'none' && _sb()) {
      console.log('[AICC] Bootstrap: admin screen detected, initializing...');
      _aiccInit();
      return;
    }
    // Also check if container is in a visible panel
    var container = document.getElementById('aiCommandCenter');
    if (container && _sb()) {
      var dashPanel = document.getElementById('crm-section-dashboard');
      if (dashPanel && dashPanel.classList.contains('crm-visible')) {
        console.log('[AICC] Bootstrap: dashboard panel visible, initializing...');
        _aiccInit();
        return;
      }
    }
  }

  // Try multiple times to catch the right moment
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(_aiccBootstrap, 2000);
    setTimeout(_aiccBootstrap, 5000);
    setTimeout(_aiccBootstrap, 10000);
  });
  // Also try on window load (later)
  window.addEventListener('load', function() {
    setTimeout(_aiccBootstrap, 3000);
  });

})();
