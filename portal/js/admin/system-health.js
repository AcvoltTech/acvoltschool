/* ===================================================================
   System Health — Admin dashboard for app-wide monitoring
   Reads from health_log table (populated by system-sentinel cron every 5m)
   Self-contained: injects HTML into #crm-section-systemHealth
   =================================================================== */

if (typeof _addTranslations === 'function') _addTranslations({
  sh_title: { es: '🩺 System Health', en: '🩺 System Health' },
  sh_subtitle: { es: 'Monitoreo en tiempo real de la app — Web · iOS · Android', en: 'Realtime monitoring — Web · iOS · Android' },
  sh_loading: { es: 'Cargando últimos resultados...', en: 'Loading latest results...' },
  sh_run_now: { es: '🩺 Run Now', en: '🩺 Run Now' },
  sh_running: { es: '⏳ Ejecutando...', en: '⏳ Running...' },
  sh_last_run: { es: 'Última ejecución', en: 'Last run' },
  sh_no_data: { es: 'Sin datos. Espera 5 minutos al primer cron, o oprime "Run Now".', en: 'No data yet. Wait 5min for first cron, or hit "Run Now".' },
});

var _shTimer = null;
var _shData = [];

function _shFmtAgo(iso) {
  if (!iso) return '—';
  var diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return Math.round(diff) + 's atrás';
  if (diff < 3600) return Math.floor(diff / 60) + 'm atrás';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h atrás';
  return Math.floor(diff / 86400) + 'd atrás';
}

function _shStatusColor(status) {
  if (status === 'OK') return { bg: 'rgba(34,197,94,0.18)', border: 'rgba(34,197,94,0.55)', text: '#22c55e', label: '✅ OK' };
  if (status === 'WARN') return { bg: 'rgba(234,179,8,0.18)', border: 'rgba(234,179,8,0.55)', text: '#facc15', label: '⚠️ WARN' };
  if (status === 'FAIL') return { bg: 'rgba(239,68,68,0.18)', border: 'rgba(239,68,68,0.55)', text: '#ef4444', label: '❌ FAIL' };
  return { bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.4)', text: '#94a3b8', label: '— N/A' };
}

async function loadSystemHealth() {
  var shell = document.getElementById('crm-section-systemHealth');
  if (!shell) return;

  shell.innerHTML =
    '<div style="max-width:1200px;margin:0 auto;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:8px;">' +
        '<div>' +
          '<h2 style="color:#f1f5f9;margin:0;font-size:22px;">' + _t('sh_title') + '</h2>' +
          '<div style="color:#94a3b8;font-size:12px;margin-top:4px;">' + _t('sh_subtitle') + '</div>' +
        '</div>' +
        '<button id="shRunNowBtn" onclick="_shRunNow()" style="background:#3b82f6;border:none;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">' + _t('sh_run_now') + '</button>' +
      '</div>' +
      '<div id="shLastRun" style="color:#94a3b8;font-size:11px;margin-bottom:14px;">—</div>' +
      '<div id="shGrid" style="display:grid;gap:10px;">' +
        '<div style="text-align:center;color:#64748b;padding:30px;">' + _t('sh_loading') + '</div>' +
      '</div>' +
    '</div>';

  await _shLoad();

  if (_shTimer) clearInterval(_shTimer);
  _shTimer = setInterval(function() {
    var el = document.getElementById('crm-section-systemHealth');
    if (el && el.offsetParent !== null) _shLoad();
  }, 30000);
}

async function _shLoad() {
  if (!supabaseClient) return;
  try {
    // Latest row per (subsystem, platform): pull last 200 and reduce client-side.
    var { data, error } = await supabaseClient
      .from('health_log')
      .select('subsystem, platform, status, details, duration_ms, checked_at')
      .order('checked_at', { ascending: false })
      .limit(500);
    if (error) throw error;

    // Reduce to latest per (subsystem, platform)
    var latest = {};
    (data || []).forEach(function(row) {
      var key = row.subsystem + '|' + (row.platform || '');
      if (!latest[key]) latest[key] = row;
    });
    _shData = Object.values(latest);
    _shRender();

    var newest = (data && data[0]) ? data[0].checked_at : null;
    var lastRunEl = document.getElementById('shLastRun');
    if (lastRunEl) lastRunEl.textContent = _t('sh_last_run') + ': ' + (newest ? _shFmtAgo(newest) + ' (' + new Date(newest).toLocaleString('es-MX') + ')' : '—');
  } catch (e) {
    console.error('[SystemHealth] load error:', e);
    var grid = document.getElementById('shGrid');
    if (grid) grid.innerHTML = '<div style="color:#ef4444;padding:20px;">Error: ' + (e.message || e) + '</div>';
  }
}

function _shRender() {
  var grid = document.getElementById('shGrid');
  if (!grid) return;

  if (_shData.length === 0) {
    grid.innerHTML = '<div style="color:#64748b;padding:30px;text-align:center;">' + _t('sh_no_data') + '</div>';
    return;
  }

  // Group by subsystem
  var bySubsystem = {};
  _shData.forEach(function(r) {
    if (!bySubsystem[r.subsystem]) bySubsystem[r.subsystem] = [];
    bySubsystem[r.subsystem].push(r);
  });

  // Build rows
  var html = '';
  // Summary bar
  var totals = { OK: 0, WARN: 0, FAIL: 0 };
  _shData.forEach(function(r) { totals[r.status] = (totals[r.status] || 0) + 1; });
  html += '<div style="display:flex;gap:10px;margin-bottom:8px;">';
  ['OK', 'WARN', 'FAIL'].forEach(function(s) {
    var c = _shStatusColor(s);
    html += '<div style="flex:1;background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:10px;padding:14px;text-align:center;">' +
      '<div style="color:' + c.text + ';font-size:11px;font-weight:700;text-transform:uppercase;">' + c.label + '</div>' +
      '<div style="color:#f1f5f9;font-size:28px;font-weight:900;margin-top:4px;">' + (totals[s] || 0) + '</div>' +
    '</div>';
  });
  html += '</div>';

  // Per subsystem
  Object.keys(bySubsystem).sort().forEach(function(sub) {
    var rows = bySubsystem[sub];
    html += '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">';
    html += '<div style="color:#f1f5f9;font-size:14px;font-weight:700;">' + sub + '</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    rows.forEach(function(r) {
      var c = _shStatusColor(r.status);
      var label = r.platform ? r.platform : 'global';
      html += '<div title="' + JSON.stringify(r.details || {}).replace(/"/g, '&quot;') + '" ' +
        'style="display:flex;align-items:center;gap:6px;background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:6px;padding:5px 10px;font-size:11px;color:' + c.text + ';font-weight:600;">' +
        '<span style="opacity:0.85;">' + label + '</span>' +
        '<span>' + c.label + '</span>' +
      '</div>';
    });
    html += '</div></div>';
    // Details row
    var failingRows = rows.filter(function(r) { return r.status !== 'OK'; });
    if (failingRows.length > 0) {
      html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.06);">';
      failingRows.forEach(function(r) {
        var c = _shStatusColor(r.status);
        html += '<div style="font-size:11px;color:' + c.text + ';margin-top:4px;">' +
          '• ' + (r.platform || 'global') + ': ' + JSON.stringify(r.details) +
        '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });

  grid.innerHTML = html;
}

async function _shRunNow() {
  var btn = document.getElementById('shRunNowBtn');
  if (btn) { btn.disabled = true; btn.textContent = _t('sh_running'); }
  try {
    var sbUrl = window.SUPABASE_URL || 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '';
    await fetch(sbUrl + '/functions/v1/system-sentinel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey },
      body: JSON.stringify({}),
    });
    // Wait a beat for the row to land before reloading.
    await new Promise(function(r) { setTimeout(r, 600); });
    await _shLoad();
  } catch (e) {
    console.error('[SystemHealth] run-now error:', e);
    alert('Error: ' + (e.message || e));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = _t('sh_run_now'); }
  }
}
