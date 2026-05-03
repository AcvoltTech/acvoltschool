// ============================================================
// Device Viewer — Admin panel for managing student devices
// Loaded lazily via MaestroLoader when admin navigates to CRM
// ============================================================
if (typeof _addTranslations === 'function') _addTranslations({
  dv_title: { es: '\uD83D\uDCF1 Device Viewer', en: '\uD83D\uDCF1 Device Viewer' },
  dv_active_devices: { es: 'Devices Activos', en: 'Active Devices' },
  dv_users_with_devices: { es: 'Usuarios con Devices', en: 'Users with Devices' },
  dv_over_limit: { es: 'Sobre L\u00edmite (>2)', en: 'Over Limit (>2)' },
  dv_country_blocks_7d: { es: 'Bloqueos Pa\u00eds (7d)', en: 'Country Blocks (7d)' },
  dv_pending_ids: { es: 'IDs Pendientes', en: 'Pending IDs' },
  dv_search_placeholder: { es: 'Buscar por email del estudiante...', en: 'Search by student email...' },
  dv_search_btn: { es: 'Buscar', en: 'Search' },
  dv_over_limit_title: { es: '\u26A0\uFE0F Usuarios sobre l\u00edmite', en: '\u26A0\uFE0F Users over limit' },
  dv_country_blocks_title: { es: '\uD83D\uDEAB Bloqueos por pa\u00eds recientes', en: '\uD83D\uDEAB Recent country blocks' },
  dv_duplicates_title: { es: '\uD83D\uDD0D Cuentas Duplicadas', en: '\uD83D\uDD0D Duplicate Accounts' },
  dv_scan_duplicates: { es: 'Buscar Duplicados', en: 'Find Duplicates' },
  dv_scan_prompt: { es: 'Presiona "Buscar Duplicados" para detectar cuentas compartidas.', en: 'Press "Find Duplicates" to detect shared accounts.' },
  dv_pending_ids_title: { es: '\uD83E\uDEAA IDs Pendientes de Revisi\u00f3n', en: '\uD83E\uDEAA IDs Pending Review' },
  dv_refresh: { es: 'Actualizar', en: 'Refresh' },
  dv_loading_ids: { es: 'Cargando IDs pendientes...', en: 'Loading pending IDs...' },
  dv_now: { es: 'ahora', en: 'now' },
  dv_enter_email: { es: 'Ingresa un email para buscar.', en: 'Enter an email to search.' },
  dv_searching: { es: 'Buscando...', en: 'Searching...' },
  dv_no_devices_for: { es: 'No se encontraron dispositivos para', en: 'No devices found for' },
  dv_devices_found: { es: 'dispositivo(s) encontrado(s) para', en: 'device(s) found for' },
  dv_active: { es: 'Activo', en: 'Active' },
  dv_inactive_label: { es: 'Inactivo', en: 'Inactive' },
  dv_closed: { es: 'cerrado', en: 'closed' },
  dv_seen: { es: 'Visto:', en: 'Seen:' },
  dv_first_use: { es: 'Primer uso:', en: 'First use:' },
  dv_connection_failed: { es: 'Conexi\u00f3n fallida', en: 'Connection failed' },
  dv_deactivate_confirm: { es: '\u00bfDesactivar este dispositivo para', en: 'Deactivate this device for' },
  dv_could_not_deactivate: { es: 'No se pudo desactivar', en: 'Could not deactivate' },
  dv_scanning: { es: 'Buscando...', en: 'Searching...' },
  dv_no_duplicates: { es: '\u2705 No se detectaron cuentas duplicadas.', en: '\u2705 No duplicate accounts detected.' },
  dv_suspicious_pairs: { es: 'par(es) sospechoso(s) detectado(s)', en: 'suspicious pair(s) detected' },
  dv_loading: { es: 'Cargando...', en: 'Loading...' },
  dv_no_pending_ids: { es: '\u2705 No hay IDs pendientes de revisi\u00f3n.', en: '\u2705 No IDs pending review.' },
  dv_approve: { es: '\u2713 Aprobar', en: '\u2713 Approve' },
  dv_reject: { es: '\u2717 Rechazar', en: '\u2717 Reject' },
  dv_no_photo: { es: 'Sin foto disponible', en: 'No photo available' },
  dv_confirm_review: { es: 'el ID de', en: 'the ID of' },
  dv_approve_label: { es: 'APROBAR', en: 'APPROVE' },
  dv_reject_label: { es: 'RECHAZAR', en: 'REJECT' },
  dv_could_not_process: { es: 'No se pudo procesar', en: 'Could not process' },
});

(function() {
  'use strict';

  var SB_URL = (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co');
  var ENDPOINT = SB_URL + '/functions/v1/device-guard';
  var _rendered = false;

  function _getAdminEmail() {
    return (sessionStorage.getItem('admin_email') || localStorage.getItem('tecnico_email') || '').toLowerCase().trim();
  }

  function _call(payload) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function(r) { return r.json(); });
  }

  function _esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function _timeAgo(ts) {
    if (!ts) return '—';
    var diff = Date.now() - new Date(ts).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return _t('dv_now');
    if (mins < 60) return mins + 'm';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h';
    var days = Math.floor(hrs / 24);
    return days + 'd';
  }

  function _countryFlag(code) {
    if (!code || code.length !== 2) return '';
    var offset = 127397;
    return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
  }

  // ── Render main panel ──
  function render() {
    var container = document.getElementById('crm-section-deviceViewer');
    if (!container) return;
    if (_rendered) return;
    _rendered = true;

    container.innerHTML =
      '<div style="padding:24px;max-width:900px;">' +
        '<h2 style="color:#1a1d21;margin:0 0 20px;font-size:22px;">' + _t('dv_title') + '</h2>' +

        // KPI cards
        '<div id="dvKpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px;">' +
          '<div style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.06);">' +
            '<div style="color:#4b5563;font-size:11px;text-transform:uppercase;margin-bottom:4px;">' + _t('dv_active_devices') + '</div>' +
            '<div style="color:#1a1d21;font-size:28px;font-weight:800;" id="dvKpiActive">\u2014</div>' +
          '</div>' +
          '<div style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.06);">' +
            '<div style="color:#4b5563;font-size:11px;text-transform:uppercase;margin-bottom:4px;">' + _t('dv_users_with_devices') + '</div>' +
            '<div style="color:#1a1d21;font-size:28px;font-weight:800;" id="dvKpiUsers">\u2014</div>' +
          '</div>' +
          '<div style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.06);">' +
            '<div style="color:#4b5563;font-size:11px;text-transform:uppercase;margin-bottom:4px;">' + _t('dv_over_limit') + '</div>' +
            '<div style="color:#f39c12;font-size:28px;font-weight:800;" id="dvKpiOverLimit">\u2014</div>' +
          '</div>' +
          '<div style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.06);">' +
            '<div style="color:#4b5563;font-size:11px;text-transform:uppercase;margin-bottom:4px;">' + _t('dv_country_blocks_7d') + '</div>' +
            '<div style="color:#e74c3c;font-size:28px;font-weight:800;" id="dvKpiBlocks">\u2014</div>' +
          '</div>' +
          '<div style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.06);">' +
            '<div style="color:#4b5563;font-size:11px;text-transform:uppercase;margin-bottom:4px;">' + _t('dv_pending_ids') + '</div>' +
            '<div style="color:#f59e0b;font-size:28px;font-weight:800;" id="dvKpiPendingIds">\u2014</div>' +
          '</div>' +
        '</div>' +

        // Search
        '<div style="display:flex;gap:10px;margin-bottom:20px;">' +
          '<input type="email" id="dvSearchEmail" placeholder="' + _t('dv_search_placeholder') + '" style="flex:1;padding:12px 16px;border:1px solid #e3e7ee;border-radius:10px;background:#ffffff;color:#1a1d21;font-size:14px;outline:none;" />' +
          '<button onclick="DeviceViewer.search()" style="padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;font-weight:600;cursor:pointer;font-size:14px;">' + _t('dv_search_btn') + '</button>' +
        '</div>' +

        // Results
        '<div id="dvResults"></div>' +

        // Over-limit users
        '<div id="dvOverLimitSection" style="margin-top:24px;display:none;">' +
          '<h3 style="color:#f39c12;margin:0 0 12px;font-size:16px;">' + _t('dv_over_limit_title') + '</h3>' +
          '<div id="dvOverLimitList"></div>' +
        '</div>' +

        // Recent country blocks
        '<div id="dvBlocksSection" style="margin-top:24px;display:none;">' +
          '<h3 style="color:#e74c3c;margin:0 0 12px;font-size:16px;">' + _t('dv_country_blocks_title') + '</h3>' +
          '<div id="dvBlocksList"></div>' +
        '</div>' +

        // Duplicates section
        '<div id="dvDuplicatesSection" style="margin-top:24px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<h3 style="color:#a855f7;margin:0;font-size:16px;">' + _t('dv_duplicates_title') + '</h3>' +
            '<button onclick="DeviceViewer.scanDuplicates()" style="padding:8px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:white;font-weight:600;cursor:pointer;font-size:12px;">' + _t('dv_scan_duplicates') + '</button>' +
          '</div>' +
          '<div id="dvDuplicatesList" style="color:#4b5563;font-size:13px;">' + _t('dv_scan_prompt') + '</div>' +
        '</div>' +

        // Pending IDs section
        '<div id="dvPendingIdsSection" style="margin-top:24px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<h3 style="color:#f59e0b;margin:0;font-size:16px;">' + _t('dv_pending_ids_title') + '</h3>' +
            '<button onclick="DeviceViewer.loadPendingIds()" style="padding:8px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-weight:600;cursor:pointer;font-size:12px;">' + _t('dv_refresh') + '</button>' +
          '</div>' +
          '<div id="dvPendingIdsList" style="color:#4b5563;font-size:13px;">' + _t('dv_loading_ids') + '</div>' +
        '</div>' +
      '</div>';

    // Enter key support for search
    var input = document.getElementById('dvSearchEmail');
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') DeviceViewer.search();
      });
    }

    // Load stats
    loadStats();
    loadPendingIds();
  }

  // ── Load KPI stats ──
  function loadStats() {
    _call({ action: 'admin_device_stats', admin_email: _getAdminEmail() })
      .then(function(res) {
        if (res.error) { console.warn('[DeviceViewer] Stats error:', res.error); return; }

        var el;
        el = document.getElementById('dvKpiActive');
        if (el) el.textContent = res.total_active_devices || 0;
        el = document.getElementById('dvKpiUsers');
        if (el) el.textContent = res.unique_users_with_devices || 0;
        el = document.getElementById('dvKpiOverLimit');
        if (el) el.textContent = (res.users_over_limit || []).length;
        el = document.getElementById('dvKpiBlocks');
        if (el) el.textContent = (res.recent_country_blocks || []).length;

        // Over-limit list
        if (res.users_over_limit && res.users_over_limit.length > 0) {
          var sect = document.getElementById('dvOverLimitSection');
          if (sect) sect.style.display = 'block';
          var list = document.getElementById('dvOverLimitList');
          if (list) {
            list.innerHTML = res.users_over_limit.map(function(u) {
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(243,156,18,0.08);border-radius:8px;margin-bottom:6px;border:1px solid rgba(243,156,18,0.2);">' +
                '<span style="color:#1a1d21;font-size:13px;">' + _esc(u.user_email) + '</span>' +
                '<span style="color:#f39c12;font-weight:700;font-size:14px;">' + u.active_count + ' devices</span>' +
              '</div>';
            }).join('');
          }
        }

        // Country blocks list
        if (res.recent_country_blocks && res.recent_country_blocks.length > 0) {
          var bsect = document.getElementById('dvBlocksSection');
          if (bsect) bsect.style.display = 'block';
          var blist = document.getElementById('dvBlocksList');
          if (blist) {
            blist.innerHTML = res.recent_country_blocks.map(function(b) {
              var meta = b.metadata || {};
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(231,76,60,0.08);border-radius:8px;margin-bottom:6px;border:1px solid rgba(231,76,60,0.2);">' +
                '<div>' +
                  '<span style="color:#1a1d21;font-size:13px;">' + _esc(b.user_email) + '</span>' +
                  '<span style="color:#4b5563;font-size:11px;margin-left:8px;">' + _countryFlag(meta.home_country || '') + ' \u2192 ' + _countryFlag(b.country_code || '') + ' ' + _esc(meta.attempted_country_name || b.country_code || '') + '</span>' +
                '</div>' +
                '<span style="color:#4b5563;font-size:11px;">' + _timeAgo(b.created_at) + '</span>' +
              '</div>';
            }).join('');
          }
        }
      })
      .catch(function(e) { console.warn('[DeviceViewer] Stats failed:', e); });
  }

  // ── Search devices by email ──
  function search() {
    var input = document.getElementById('dvSearchEmail');
    var resultsDiv = document.getElementById('dvResults');
    if (!input || !resultsDiv) return;

    var email = (input.value || '').trim().toLowerCase();
    if (!email) { resultsDiv.innerHTML = '<p style="color:#4b5563;font-size:13px;">' + _t('dv_enter_email') + '</p>'; return; }

    resultsDiv.innerHTML = '<p style="color:#4b5563;font-size:13px;">' + _t('dv_searching') + '</p>';

    _call({ action: 'list_devices', admin_email: _getAdminEmail(), target_email: email })
      .then(function(res) {
        if (res.error) { resultsDiv.innerHTML = '<p style="color:#e74c3c;">' + _esc(res.error) + '</p>'; return; }
        var devices = res.devices || [];
        if (devices.length === 0) {
          resultsDiv.innerHTML = '<p style="color:#4b5563;font-size:13px;">' + _t('dv_no_devices_for') + ' <strong>' + _esc(email) + '</strong>.</p>';
          return;
        }

        resultsDiv.innerHTML =
          '<div style="margin-bottom:8px;color:#4b5563;font-size:12px;">' + devices.length + ' ' + _t('dv_devices_found') + ' <strong style="color:#1a1d21;">' + _esc(email) + '</strong></div>' +
          devices.map(function(d) {
            var statusColor = d.is_active ? '#22c55e' : '#94a3b8';
            var statusText = d.is_active ? _t('dv_active') : _t('dv_inactive_label');
            var kickBtn = d.is_active
              ? '<button onclick="DeviceViewer.kick(\'' + _esc(email) + '\',\'' + _esc(d.device_id) + '\')" style="padding:6px 12px;border:1px solid rgba(231,76,60,0.3);border-radius:6px;background:rgba(231,76,60,0.1);color:#e74c3c;font-size:11px;cursor:pointer;font-weight:600;">Kick</button>'
              : '<span style="color:#94a3b8;font-size:11px;">' + _esc(d.deactivated_reason || _t('dv_closed')) + '</span>';

            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#ffffff;border-radius:10px;margin-bottom:8px;border:1px solid #e3e7ee;box-shadow:0 1px 3px rgba(0,0,0,0.04);">' +
              '<div style="flex:1;min-width:0;">' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                  '<span style="width:8px;height:8px;border-radius:50%;background:' + statusColor + ';flex-shrink:0;"></span>' +
                  '<span style="color:#1a1d21;font-size:13px;font-weight:600;">' + _esc(d.device_name || 'Unknown') + '</span>' +
                  '<span style="color:' + statusColor + ';font-size:11px;">' + statusText + '</span>' +
                '</div>' +
                '<div style="color:#4b5563;font-size:11px;display:flex;gap:12px;flex-wrap:wrap;">' +
                  '<span>' + _countryFlag(d.country_code || '') + ' ' + _esc(d.country_name || d.country_code || '\u2014') + '</span>' +
                  '<span>IP: ' + _esc(d.ip_address || '\u2014') + '</span>' +
                  '<span>' + _t('dv_seen') + ' ' + _timeAgo(d.last_seen_at) + '</span>' +
                  '<span>' + _t('dv_first_use') + ' ' + _timeAgo(d.first_seen_at) + '</span>' +
                '</div>' +
              '</div>' +
              '<div style="margin-left:12px;flex-shrink:0;">' + kickBtn + '</div>' +
            '</div>';
          }).join('');
      })
      .catch(function(e) {
        resultsDiv.innerHTML = '<p style="color:#e74c3c;">Error: ' + _esc(e.message || _t('dv_connection_failed')) + '</p>';
      });
  }

  // ── Kick a device ──
  function kick(email, deviceId) {
    if (!confirm('\u00bf' + _t('dv_deactivate_confirm') + ' ' + email + '?')) return;

    _call({ action: 'admin_kick_device', admin_email: _getAdminEmail(), target_email: email, device_id: deviceId })
      .then(function(res) {
        if (res.ok) {
          // Refresh search results
          search();
          loadStats();
        } else {
          alert('Error: ' + (res.error || _t('dv_could_not_deactivate')));
        }
      })
      .catch(function(e) { alert('Error: ' + (e.message || _t('dv_connection_failed'))); });
  }

  // ── Scan for duplicate accounts ──
  function scanDuplicates() {
    var listDiv = document.getElementById('dvDuplicatesList');
    if (!listDiv) return;
    listDiv.innerHTML = '<p style="color:#4b5563;font-size:13px;">' + _t('dv_scanning') + '</p>';

    _call({ action: 'admin_duplicates', admin_email: _getAdminEmail() })
      .then(function(res) {
        if (res.error) { listDiv.innerHTML = '<p style="color:#e74c3c;">' + _esc(res.error) + '</p>'; return; }
        var dupes = res.duplicates || [];
        if (dupes.length === 0) {
          listDiv.innerHTML = '<p style="color:#22c55e;font-size:13px;">' + _t('dv_no_duplicates') + '</p>';
          return;
        }

        listDiv.innerHTML = '<div style="color:#4b5563;font-size:12px;margin-bottom:8px;">' + dupes.length + ' ' + _t('dv_suspicious_pairs') + '</div>' +
          dupes.map(function(pair) {
            var matchTags = pair.matches.map(function(m) {
              var colors = { device_id: '#e74c3c', telefono: '#f39c12', ip_address: '#3b82f6' };
              var labels = { device_id: 'Device', telefono: 'Tel\u00e9fono', ip_address: 'IP' };
              return '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:' + (colors[m.type] || '#64748b') + '18;color:' + (colors[m.type] || '#64748b') + ';margin-right:4px;">' + (labels[m.type] || m.type) + ': ' + _esc(m.value).substring(0, 30) + '</span>';
            }).join('');

            return '<div style="padding:12px 16px;background:rgba(168,85,247,0.06);border-radius:10px;margin-bottom:8px;border:1px solid rgba(168,85,247,0.2);">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                '<div>' +
                  '<span style="color:#1a1d21;font-size:13px;font-weight:600;">' + _esc(pair.email_a) + '</span>' +
                  '<span style="color:#4b5563;margin:0 8px;">\u2194</span>' +
                  '<span style="color:#1a1d21;font-size:13px;font-weight:600;">' + _esc(pair.email_b) + '</span>' +
                '</div>' +
              '</div>' +
              '<div>' + matchTags + '</div>' +
            '</div>';
          }).join('');
      })
      .catch(function(e) { listDiv.innerHTML = '<p style="color:#e74c3c;">Error: ' + _esc(e.message || _t('dv_connection_failed')) + '</p>'; });
  }

  // ── Load pending ID reviews ──
  function loadPendingIds() {
    var listDiv = document.getElementById('dvPendingIdsList');
    if (!listDiv) return;
    listDiv.innerHTML = '<p style="color:#4b5563;font-size:13px;">' + _t('dv_loading') + '</p>';

    _call({ action: 'admin_list_pending_ids', admin_email: _getAdminEmail() })
      .then(function(res) {
        if (res.error) { listDiv.innerHTML = '<p style="color:#e74c3c;">' + _esc(res.error) + '</p>'; return; }
        var ids = res.pending_ids || [];

        // Update KPI
        var kpi = document.getElementById('dvKpiPendingIds');
        if (kpi) kpi.textContent = ids.length;

        if (ids.length === 0) {
          listDiv.innerHTML = '<p style="color:#22c55e;font-size:13px;">' + _t('dv_no_pending_ids') + '</p>';
          return;
        }

        listDiv.innerHTML = ids.map(function(u) {
          return '<div style="padding:14px 16px;background:rgba(245,158,11,0.06);border-radius:10px;margin-bottom:10px;border:1px solid rgba(245,158,11,0.2);">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">' +
              '<div style="flex:1;">' +
                '<div style="color:#1a1d21;font-size:14px;font-weight:600;margin-bottom:4px;">' + _esc(u.nombre || u.email) + '</div>' +
                '<div style="color:#4b5563;font-size:12px;">' + _esc(u.email) + (u.telefono ? ' \u00b7 ' + _esc(u.telefono) : '') + '</div>' +
              '</div>' +
              '<div style="display:flex;gap:6px;flex-shrink:0;">' +
                '<button onclick="DeviceViewer.reviewId(\'' + _esc(u.email) + '\',\'approved\')" style="padding:6px 14px;border:none;border-radius:6px;background:rgba(34,197,94,0.15);color:#16803c;font-size:12px;cursor:pointer;font-weight:600;">' + _t('dv_approve') + '</button>' +
                '<button onclick="DeviceViewer.reviewId(\'' + _esc(u.email) + '\',\'rejected\')" style="padding:6px 14px;border:none;border-radius:6px;background:rgba(231,76,60,0.15);color:#e74c3c;font-size:12px;cursor:pointer;font-weight:600;">' + _t('dv_reject') + '</button>' +
              '</div>' +
            '</div>' +
            (u.signed_photo_url
              ? '<div style="margin-top:10px;"><img src="' + _esc(u.signed_photo_url) + '" style="max-width:300px;max-height:200px;border-radius:8px;border:1px solid #e3e7ee;cursor:pointer;" onclick="window.open(this.src,\'_blank\')" alt="ID Photo" /></div>'
              : '<div style="margin-top:8px;color:#94a3b8;font-size:12px;">' + _t('dv_no_photo') + '</div>') +
          '</div>';
        }).join('');
      })
      .catch(function(e) { listDiv.innerHTML = '<p style="color:#e74c3c;">Error: ' + _esc(e.message || _t('dv_connection_failed')) + '</p>'; });
  }

  // ── Review (approve/reject) an ID ──
  function reviewId(email, decision) {
    var label = decision === 'approved' ? _t('dv_approve_label') : _t('dv_reject_label');
    if (!confirm('\u00bf' + label + ' ' + _t('dv_confirm_review') + ' ' + email + '?')) return;

    _call({ action: 'admin_review_id', admin_email: _getAdminEmail(), target_email: email, decision: decision })
      .then(function(res) {
        if (res.ok) {
          loadPendingIds();
        } else {
          alert('Error: ' + (res.error || _t('dv_could_not_process')));
        }
      })
      .catch(function(e) { alert('Error: ' + (e.message || _t('dv_connection_failed'))); });
  }

  // ── Expose global ──
  window.DeviceViewer = {
    render: render,
    search: search,
    kick: kick,
    scanDuplicates: scanDuplicates,
    loadPendingIds: loadPendingIds,
    reviewId: reviewId,
    refresh: function() { _rendered = false; render(); },
  };

  // Auto-render if container already exists
  if (document.getElementById('crm-section-deviceViewer')) {
    render();
  }
})();
