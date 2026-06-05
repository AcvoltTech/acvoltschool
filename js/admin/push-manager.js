if (typeof _addTranslations === 'function') _addTranslations({
  adm_pm_title: { es: 'Gestión de Notificaciones Push', en: 'Push Notification Management' },
  adm_pm_reload: { es: 'Recargar', en: 'Reload' },
  adm_pm_loading: { es: 'Cargando datos de notificaciones...', en: 'Loading notification data...' },
  adm_pm_no_name: { es: 'Sin nombre', en: 'No name' },
  adm_pm_with_push: { es: 'Con Push Activo', en: 'With Active Push' },
  adm_pm_without_push: { es: 'Sin Push', en: 'Without Push' },
  adm_pm_total_students: { es: 'Total Estudiantes', en: 'Total Students' },
  adm_pm_coverage: { es: 'Cobertura Push', en: 'Push Coverage' },
  adm_pm_force_reprompt: { es: 'Forzar Re-prompt a Todos', en: 'Force Re-prompt for All' },
  adm_pm_reset_skip: { es: 'Resetea el skip de notificaciones', en: 'Resets notification skip flag' },
  adm_pm_send_reminder: { es: 'Enviar Recordatorio Push', en: 'Send Push Reminder' },
  adm_pm_to_active: { es: 'A los que YA tienen push activo', en: 'To those who already have active push' },
  adm_pm_broadcast: { es: 'Broadcast Personalizado', en: 'Custom Broadcast' },
  adm_pm_custom_msg: { es: 'Enviar mensaje custom a todos', en: 'Send custom message to all' },
  adm_pm_daily_reminder: { es: 'Recordatorio Diario In-App', en: 'Daily In-App Reminder' },
  adm_pm_loading_status: { es: 'Cargando estado...', en: 'Loading status...' },
  adm_pm_students_no_push: { es: 'Estudiantes sin Push', en: 'Students without Push' },
  adm_pm_search: { es: 'Buscar...', en: 'Search...' },
  adm_pm_all_have_push: { es: 'Todos los estudiantes tienen push activo', en: 'All students have active push' },
  adm_pm_confirm_reprompt: { es: 'Esto va a forzar que TODOS los estudiantes vean el prompt de notificaciones otra vez al abrir la app.\n\n¿Continuar?', en: 'This will force ALL students to see the notification prompt again when they open the app.\n\nContinue?' },
  adm_pm_saving_flag: { es: 'Guardando flag de re-prompt...', en: 'Saving re-prompt flag...' },
  adm_pm_reprompt_activated: { es: 'Re-prompt activado. Todos los estudiantes verán el prompt al abrir la app.', en: 'Re-prompt activated. All students will see the prompt when opening the app.' },
  adm_pm_confirm_reminder: { es: 'Enviar recordatorio push a los {n} estudiantes que tienen push activo?\n\nEl mensaje les pedirá que compartan con compañeros que activen notificaciones.', en: 'Send push reminder to the {n} students who have active push?\n\nThe message will ask them to share with peers to enable notifications.' },
  adm_pm_sending_reminder: { es: 'Enviando recordatorio...', en: 'Sending reminder...' },
  adm_pm_no_push_users: { es: 'No hay usuarios con push activo.', en: 'No users with active push.' },
  adm_pm_sent_to: { es: 'Enviado a {n} dispositivos. Fallidos: {f}', en: 'Sent to {n} devices. Failed: {f}' },
  adm_pm_daily_on: { es: 'ACTIVADO — los estudiantes ven popup diario', en: 'ENABLED — students see daily popup' },
  adm_pm_daily_off: { es: 'Desactivado', en: 'Disabled' },
  adm_pm_daily_off_tap: { es: 'Desactivado — toca para activar', en: 'Disabled — tap to enable' },
  adm_pm_daily_activated: { es: 'Recordatorio diario IN-APP activado', en: 'Daily IN-APP reminder enabled' },
  adm_pm_daily_deactivated: { es: 'Recordatorio diario IN-APP desactivado', en: 'Daily IN-APP reminder disabled' },
  adm_pm_reminder_push_title: { es: '\uD83D\uDD14 \u00A1Activa las Notificaciones!', en: '\uD83D\uDD14 Turn On Notifications!' },
  adm_pm_reminder_push_body: { es: '\u00BFTienes compa\u00F1eros que no reciben avisos de clases? Diles que activen notificaciones en maestrohvacr.com para no perderse las clases EN VIVO.', en: 'Know peers who don\'t get class alerts? Tell them to enable notifications at maestrohvacr.com so they don\'t miss LIVE classes.' },
});

/* ===================================================================
   Push Notification Manager — Admin CRM Panel
   Shows push subscription stats, lets admin force re-prompt,
   and send daily reminders to students without push enabled.
   Self-contained: injects HTML into #crm-section-pushManager.
   =================================================================== */

var _pmData = { total: 0, withPush: 0, withoutPush: 0, users: [], pushEmails: new Set() };
var _pmLoading = false;

function _pmSb() { return window.supabaseClient; }

/* ── Load all data ─────────────────────────────────────── */
async function loadPushManager() {
  var shell = document.getElementById('crm-section-pushManager');
  if (!shell) return;

  shell.innerHTML =
    '<div style="padding:24px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">' +
        '<h2 style="margin:0;color:#e2e8f0;font-size:22px;">🔔 ' + _t('adm_pm_title') + '</h2>' +
        '<button onclick="loadPushManager()" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 16px;color:#60a5fa;cursor:pointer;font-size:13px;">🔄 ' + _t('adm_pm_reload') + '</button>' +
      '</div>' +
      '<div style="text-align:center;padding:40px;color:#94a3b8;">⏳ ' + _t('adm_pm_loading') + '</div>' +
    '</div>';

  if (_pmLoading) return;
  _pmLoading = true;

  try {
    var sb = _pmSb();
    if (!sb) throw new Error('Supabase not available');

    // Fetch all users and all push subscriptions in parallel
    var usersPromise = usersDataAdmin('admin_list', { limit: 5000, fields: ["email","nombre","telefono","fecha_registro"] });
    var pushPromise = sb.from('push_subscriptions').select('user_email, active, created_at').eq('active', true);

    var results = await Promise.all([usersPromise, pushPromise]);
    var users = (results[0].data || []);
    var pushSubs = (results[1].data || []);

    // Build push email set
    var pushEmails = {};
    pushSubs.forEach(function(p) { if (p.user_email) pushEmails[p.user_email.toLowerCase()] = true; });

    _pmData.total = users.length;
    _pmData.pushEmails = pushEmails;
    _pmData.withPush = 0;
    _pmData.withoutPush = 0;
    _pmData.users = [];

    users.forEach(function(u) {
      var email = (u.email || '').toLowerCase();
      var hasPush = !!pushEmails[email];
      if (hasPush) _pmData.withPush++;
      else _pmData.withoutPush++;
      _pmData.users.push({
        email: u.email,
        nombre: u.nombre || _t('adm_pm_no_name'),
        telefono: u.telefono || '',
        fecha: u.fecha_registro,
        hasPush: hasPush
      });
    });

    // Sort: without push first
    _pmData.users.sort(function(a, b) {
      if (a.hasPush === b.hasPush) return (a.nombre || '').localeCompare(b.nombre || '');
      return a.hasPush ? 1 : -1;
    });

    _pmRender(shell);
  } catch(e) {
    shell.innerHTML = '<div style="padding:24px;color:#ef4444;">Error: ' + (e.message || e) + '</div>';
  } finally {
    _pmLoading = false;
  }
}

/* ── Render panel ─────────────────────────────────────── */
function _pmRender(shell) {
  var pct = _pmData.total > 0 ? Math.round((_pmData.withPush / _pmData.total) * 100) : 0;

  var h = '<div style="padding:24px;">';

  // Header
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">';
  h += '<h2 style="margin:0;color:#e2e8f0;font-size:22px;">🔔 ' + _t('adm_pm_title') + '</h2>';
  h += '<button onclick="loadPushManager()" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 16px;color:#60a5fa;cursor:pointer;font-size:13px;">🔄 ' + _t('adm_pm_reload') + '</button>';
  h += '</div>';

  // Stats cards
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px;">';

  h += '<div style="background:linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.05));border:1px solid rgba(34,197,94,0.25);border-radius:14px;padding:20px;text-align:center;">';
  h += '<div style="font-size:32px;font-weight:800;color:#22c55e;">' + _pmData.withPush + '</div>';
  h += '<div style="font-size:12px;color:#86efac;margin-top:4px;">' + _t('adm_pm_with_push') + '</div>';
  h += '</div>';

  h += '<div style="background:linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.05));border:1px solid rgba(239,68,68,0.25);border-radius:14px;padding:20px;text-align:center;">';
  h += '<div style="font-size:32px;font-weight:800;color:#ef4444;">' + _pmData.withoutPush + '</div>';
  h += '<div style="font-size:12px;color:#fca5a5;margin-top:4px;">' + _t('adm_pm_without_push') + '</div>';
  h += '</div>';

  h += '<div style="background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(59,130,246,0.05));border:1px solid rgba(59,130,246,0.25);border-radius:14px;padding:20px;text-align:center;">';
  h += '<div style="font-size:32px;font-weight:800;color:#3b82f6;">' + _pmData.total + '</div>';
  h += '<div style="font-size:12px;color:#93c5fd;margin-top:4px;">' + _t('adm_pm_total_students') + '</div>';
  h += '</div>';

  h += '<div style="background:linear-gradient(135deg,rgba(168,85,247,0.1),rgba(168,85,247,0.05));border:1px solid rgba(168,85,247,0.25);border-radius:14px;padding:20px;text-align:center;">';
  h += '<div style="font-size:32px;font-weight:800;color:#a855f7;">' + pct + '%</div>';
  h += '<div style="font-size:12px;color:#c4b5fd;margin-top:4px;">' + _t('adm_pm_coverage') + '</div>';
  h += '</div>';

  h += '</div>';

  // Progress bar
  h += '<div style="background:rgba(239,68,68,0.2);border-radius:8px;height:12px;margin-bottom:24px;overflow:hidden;">';
  h += '<div style="background:linear-gradient(90deg,#22c55e,#16a34a);height:100%;width:' + pct + '%;border-radius:8px;transition:width 0.5s;"></div>';
  h += '</div>';

  // Alcance de la última alerta EN VIVO (recibió / usó) — se llena vía RPC
  h += '<div id="pmLastAlert" style="margin-bottom:24px;"><div style="color:#94a3b8;font-size:13px;">⏳ Cargando alcance de la última alerta…</div></div>';

  // Action buttons
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;">';

  h += '<button onclick="_pmForceReprompt()" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border:none;border-radius:12px;padding:16px;font-size:14px;font-weight:700;cursor:pointer;">';
  h += '🔄 ' + _t('adm_pm_force_reprompt') + '<br><span style="font-size:11px;font-weight:400;opacity:0.8;">' + _t('adm_pm_reset_skip') + '</span>';
  h += '</button>';

  h += '<button onclick="_pmSendReminder()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:12px;padding:16px;font-size:14px;font-weight:700;cursor:pointer;">';
  h += '📢 ' + _t('adm_pm_send_reminder') + '<br><span style="font-size:11px;font-weight:400;opacity:0.8;">' + _t('adm_pm_to_active') + '</span>';
  h += '</button>';

  h += '<button onclick="showBroadcastPushModal()" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;border:none;border-radius:12px;padding:16px;font-size:14px;font-weight:700;cursor:pointer;">';
  h += '📣 ' + _t('adm_pm_broadcast') + '<br><span style="font-size:11px;font-weight:400;opacity:0.8;">' + _t('adm_pm_custom_msg') + '</span>';
  h += '</button>';

  h += '<button onclick="_pmToggleDailyReminder()" id="pmDailyBtn" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:12px;padding:16px;font-size:14px;font-weight:700;cursor:pointer;">';
  h += '⏰ ' + _t('adm_pm_daily_reminder') + '<br><span style="font-size:11px;font-weight:400;opacity:0.8;" id="pmDailyStatus">' + _t('adm_pm_loading_status') + '</span>';
  h += '</button>';

  h += '</div>';

  // Result area
  h += '<div id="pmResultMsg" style="display:none;padding:12px;border-radius:10px;margin-bottom:20px;font-size:13px;"></div>';

  // Student list
  h += '<div style="margin-bottom:12px;display:flex;align-items:center;gap:12px;">';
  h += '<h3 style="margin:0;color:#e2e8f0;font-size:16px;flex:1;">' + _t('adm_pm_students_no_push') + ' (' + _pmData.withoutPush + ')</h3>';
  h += '<input type="text" id="pmSearch" oninput="_pmFilterList()" placeholder="' + _t('adm_pm_search') + '" style="background:#0f172a;border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:8px 12px;color:#e2e8f0;font-size:13px;width:200px;">';
  h += '</div>';

  h += '<div id="pmStudentList" style="max-height:400px;overflow-y:auto;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">';
  h += _pmRenderStudentRows(_pmData.users.filter(function(u) { return !u.hasPush; }));
  h += '</div>';

  h += '</div>';
  shell.innerHTML = h;

  // Check daily reminder status
  _pmCheckDailyStatus();
  // Alcance de la última alerta (recibió/usó)
  _pmLoadLastAlert();
}

/* ── Alcance de la última alerta EN VIVO (recibió / usó) ── */
async function _pmLoadLastAlert() {
  var box = document.getElementById('pmLastAlert');
  if (!box) return;
  try {
    var sb = _pmSb();
    if (!sb) return;
    var res = await sb.rpc('live_alert_stats');
    var d = (res && res.data) || null;
    if (!d || !d.last_at) { box.innerHTML = '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;color:#94a3b8;font-size:13px;">Aún no hay alertas EN VIVO registradas.</div>'; return; }
    var when = '';
    try { when = new Date(d.last_at).toLocaleString('es-US', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }); } catch(e) { when = String(d.last_at); }
    var pushDeliv = Number(d.push_sent || 0);
    var pushFail = Number(d.push_failed || 0);
    var noSub = Number(d.push_no_sub || 0);
    var emailC = Number(d.email || 0);
    var smsS = Number(d.sms_sent || 0);
    var smsF = Number(d.sms_failed || 0);
    var used = Number(d.used || 0);
    function card(color, big, label) {
      return '<div style="flex:1;min-width:110px;text-align:center;background:#0f172a;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;">' +
        '<div style="font-size:24px;font-weight:800;color:' + color + ';">' + big + '</div>' +
        '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' + label + '</div></div>';
    }
    box.innerHTML =
      '<div style="background:#1e293b;border:1px solid rgba(14,165,233,0.3);border-radius:14px;padding:16px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:6px;">' +
          '<span style="color:#0ea5e9;font-weight:800;font-size:15px;">📊 Alcance de la última alerta</span>' +
          '<span style="color:#94a3b8;font-size:12px;">' + when + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          card('#22c55e', pushDeliv.toLocaleString(), '🔔 Push entregado') +
          card('#ef4444', pushFail.toLocaleString(), '🔔 Push falló') +
          card('#3b82f6', emailC.toLocaleString(), '📧 Email') +
          card('#10b981', smsS.toLocaleString(), '💬 SMS enviado') +
          card('#f59e0b', used.toLocaleString(), '👆 Entraron por la alerta') +
        '</div>' +
        '<div style="margin-top:10px;color:#64748b;font-size:11px;">' +
          'Sin push activo (no les llegó push): <b style="color:#cbd5e1;">' + noSub.toLocaleString() + '</b>' +
          (smsF ? ' · SMS fallidos: <b style="color:#cbd5e1;">' + smsF.toLocaleString() + '</b>' : '') +
        '</div>' +
      '</div>';
  } catch(e) {
    box.innerHTML = '<div style="background:#1e293b;border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:14px;color:#fca5a5;font-size:12px;">No se pudo cargar el alcance: ' + (e.message || e) + '</div>';
  }
}

/* ── Render student rows ─────────────────────────────── */
function _pmRenderStudentRows(users) {
  if (users.length === 0) return '<div style="padding:20px;text-align:center;color:#64748b;">' + _t('adm_pm_all_have_push') + ' 🎉</div>';
  var h = '';
  users.forEach(function(u, i) {
    var bg = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
    h += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:' + bg + ';border-bottom:1px solid rgba(255,255,255,0.05);">';
    h += '<span style="font-size:14px;">' + (u.hasPush ? '🟢' : '🔴') + '</span>';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div style="color:#e2e8f0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _pmEsc(u.nombre) + '</div>';
    h += '<div style="color:#64748b;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + _pmEsc(u.email || '') + '</div>';
    h += '</div>';
    h += '</div>';
  });
  return h;
}

/* ── Filter student list ────────────────────────────── */
function _pmFilterList() {
  var q = (document.getElementById('pmSearch') || {}).value || '';
  q = q.toLowerCase();
  var filtered = _pmData.users.filter(function(u) {
    if (u.hasPush) return false;
    if (!q) return true;
    return (u.nombre && u.nombre.toLowerCase().indexOf(q) !== -1) ||
           (u.email && u.email.toLowerCase().indexOf(q) !== -1);
  });
  var list = document.getElementById('pmStudentList');
  if (list) list.innerHTML = _pmRenderStudentRows(filtered);
}

/* ── Force re-prompt for ALL students ─────────────── */
async function _pmForceReprompt() {
  if (!confirm(_t('adm_pm_confirm_reprompt'))) return;

  var msg = document.getElementById('pmResultMsg');
  if (msg) { msg.style.display = ''; msg.style.background = 'rgba(59,130,246,0.15)'; msg.style.color = '#60a5fa'; msg.textContent = '⏳ ' + _t('adm_pm_saving_flag'); }

  try {
    var sb = _pmSb();
    // Upsert a config flag that clients will check
    await sb.from('app_config').upsert({
      key: 'force_push_reprompt',
      value: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

    if (msg) { msg.style.background = 'rgba(34,197,94,0.15)'; msg.style.color = '#22c55e'; msg.textContent = '✅ ' + _t('adm_pm_reprompt_activated'); }
  } catch(e) {
    if (msg) { msg.style.background = 'rgba(239,68,68,0.15)'; msg.style.color = '#ef4444'; msg.textContent = '❌ Error: ' + (e.message || e); }
  }
}

/* ── Send push reminder to those WITH push ────────── */
async function _pmSendReminder() {
  if (!confirm(_t('adm_pm_confirm_reminder').replace('{n}', _pmData.withPush))) return;

  var msg = document.getElementById('pmResultMsg');
  if (msg) { msg.style.display = ''; msg.style.background = 'rgba(59,130,246,0.15)'; msg.style.color = '#60a5fa'; msg.textContent = '⏳ ' + _t('adm_pm_sending_reminder'); }

  try {
    var sb = _pmSb();
    var emails = Object.keys(_pmData.pushEmails);
    if (emails.length === 0) { if (msg) { msg.textContent = '⚠️ ' + _t('adm_pm_no_push_users'); } return; }

    var resp = await sb.functions.invoke('send-push-notification', {
      body: {
        recipient_emails: emails,
        title: _t('adm_pm_reminder_push_title', '\uD83D\uDD14 \u00A1Activa las Notificaciones!'),
        body: _t('adm_pm_reminder_push_body', '\u00BFTienes compa\u00F1eros que no reciben avisos de clases? Diles que activen notificaciones en maestrohvacr.com para no perderse las clases EN VIVO.'),
        type: 'general',
        admin_email: typeof getAdminEmail === 'function' ? getAdminEmail() : ''
      }
    });
    var data = resp.data || {};
    if (msg) { msg.style.background = 'rgba(34,197,94,0.15)'; msg.style.color = '#22c55e'; msg.textContent = '✅ ' + _t('adm_pm_sent_to').replace('{n}', data.sent || 0).replace('{f}', data.failed || 0); }
  } catch(e) {
    if (msg) { msg.style.background = 'rgba(239,68,68,0.15)'; msg.style.color = '#ef4444'; msg.textContent = '❌ Error: ' + (e.message || e); }
  }
}

/* ── Toggle daily in-app reminder ────────────────── */
async function _pmToggleDailyReminder() {
  var sb = _pmSb();
  if (!sb) return;
  try {
    var res = await sb.from('app_config').select('value').eq('key', 'daily_push_reminder').maybeSingle();
    var current = res.data ? res.data.value : 'off';
    var newVal = current === 'on' ? 'off' : 'on';

    await sb.from('app_config').upsert({
      key: 'daily_push_reminder',
      value: newVal,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });

    var statusEl = document.getElementById('pmDailyStatus');
    if (statusEl) statusEl.textContent = newVal === 'on' ? '🟢 ' + _t('adm_pm_daily_on') : '⭕ ' + _t('adm_pm_daily_off');

    var msg = document.getElementById('pmResultMsg');
    if (msg) { msg.style.display = ''; msg.style.background = 'rgba(34,197,94,0.15)'; msg.style.color = '#22c55e'; msg.textContent = newVal === 'on' ? '✅ ' + _t('adm_pm_daily_activated') : '✅ ' + _t('adm_pm_daily_deactivated'); }
  } catch(e) {
    var msg2 = document.getElementById('pmResultMsg');
    if (msg2) { msg2.style.display = ''; msg2.style.background = 'rgba(239,68,68,0.15)'; msg2.style.color = '#ef4444'; msg2.textContent = '❌ Error: ' + (e.message || e); }
  }
}

async function _pmCheckDailyStatus() {
  try {
    var sb = _pmSb();
    if (!sb) return;
    var res = await sb.from('app_config').select('value').eq('key', 'daily_push_reminder').maybeSingle();
    var statusEl = document.getElementById('pmDailyStatus');
    if (statusEl) statusEl.textContent = (res.data && res.data.value === 'on') ? '🟢 ' + _t('adm_pm_daily_on') : '⭕ ' + _t('adm_pm_daily_off_tap');
  } catch(e) { /* ignore */ }
}

/* ── Escape HTML ─────────────────────────────────── */
function _pmEsc(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
