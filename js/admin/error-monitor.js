/* ===================================================================
   Error Monitor — Admin dashboard for error_logs table
   Self-contained: injects HTML into #crm-section-errorMonitor
   =================================================================== */

if (typeof _addTranslations === 'function') _addTranslations({
  em_title: { es: 'Error Monitor', en: 'Error Monitor' },
  em_error_groups: { es: 'Error Groups', en: 'Error Groups' },
  em_message: { es: 'Message', en: 'Message' },
  em_count: { es: 'Count', en: 'Count' },
  em_users: { es: 'Users', en: 'Users' },
  em_severity: { es: 'Severity', en: 'Severity' },
  em_last_seen: { es: 'Last Seen', en: 'Last Seen' },
  em_loading: { es: 'Cargando...', en: 'Loading...' },
  em_total_errors: { es: 'Total Errores', en: 'Total Errors' },
  em_unique_errors: { es: 'Errores Únicos', en: 'Unique Errors' },
  em_affected_users: { es: 'Usuarios Afectados', en: 'Affected Users' },
  em_trend: { es: 'Tendencia', en: 'Trend' },
  em_no_change: { es: 'Sin cambio', en: 'No change' },
  em_vs_prev: { es: 'vs anterior', en: 'vs prev' },
  em_no_errors: { es: 'Sin errores en este período', en: 'No errors in this period' },
  em_spike_detected: { es: 'PICO DETECTADO (últimos 5 min):', en: 'SPIKE DETECTED (last 5 min):' },
  em_no_message: { es: '(sin mensaje)', en: '(no message)' },
});

var _errMonData = [];
var _errMonFilter = '24h';
var _errMonTimer = null;
var _errMonLoading = false;

/* ── Time range helpers ─────────────────────────────────── */
function _errMonRangeMs() {
  var map = { '1h': 3600000, '6h': 21600000, '24h': 86400000, '7d': 604800000 };
  return map[_errMonFilter] || 86400000;
}

function _errMonSince() {
  return new Date(Date.now() - _errMonRangeMs()).toISOString();
}

function _errMonTimeAgo(iso) {
  var diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return Math.floor(diff) + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

/* ── Main entry point ───────────────────────────────────── */
async function loadErrorMonitor() {
  var shell = document.getElementById('crm-section-errorMonitor');
  if (!shell) return;

  shell.innerHTML =
    '<div style="max-width:960px;margin:0 auto;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px;">' +
        '<h2 style="color:#f1f5f9;margin:0;font-size:22px;">' + _t('em_title') + '</h2>' +
        '<div id="errMonFilters" style="display:flex;gap:6px;"></div>' +
      '</div>' +
      '<div id="errMonSpike" style="display:none;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.5);border-radius:12px;padding:14px 18px;margin-bottom:16px;color:#fca5a5;font-size:13px;font-weight:600;"></div>' +
      '<div id="errMonCards" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;"></div>' +
      '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;">' +
        '<h3 style="color:#f1f5f9;margin:0 0 14px;font-size:15px;">' + _t('em_error_groups') + '</h3>' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
          '<thead><tr>' +
            '<th style="text-align:left;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;letter-spacing:.5px;">' + _t('em_message') + '</th>' +
            '<th style="text-align:center;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;">' + _t('em_count') + '</th>' +
            '<th style="text-align:center;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;">' + _t('em_users') + '</th>' +
            '<th style="text-align:center;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;">' + _t('em_severity') + '</th>' +
            '<th style="text-align:right;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;">' + _t('em_last_seen') + '</th>' +
          '</tr></thead>' +
          '<tbody id="errMonTableBody"><tr><td colspan="5" style="text-align:center;color:#64748b;padding:30px;">' + _t('em_loading') + '</td></tr></tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

  _errMonRenderFilters();
  await _errMonLoad();

  if (_errMonTimer) clearInterval(_errMonTimer);
  _errMonTimer = setInterval(function() {
    var el = document.getElementById('crm-section-errorMonitor');
    if (el && el.offsetParent !== null) _errMonLoad();
  }, 60000);
}

/* ── Filter buttons ─────────────────────────────────────── */
function _errMonRenderFilters() {
  var wrap = document.getElementById('errMonFilters');
  if (!wrap) return;
  var opts = ['1h', '6h', '24h', '7d'];
  var html = '';
  for (var i = 0; i < opts.length; i++) {
    var active = opts[i] === _errMonFilter;
    html += '<button onclick="_errMonSetFilter(\'' + opts[i] + '\')" style="' +
      'padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid ' +
      (active ? 'rgba(59,130,246,0.5);background:rgba(59,130,246,0.2);color:#93c5fd' : 'rgba(255,255,255,0.1);background:#1e293b;color:#94a3b8') +
      ';transition:all .15s;">' + opts[i] + '</button>';
  }
  wrap.innerHTML = html;
}

function _errMonSetFilter(val) {
  _errMonFilter = val;
  _errMonRenderFilters();
  _errMonLoad();
}

/* ── Fetch data ─────────────────────────────────────────── */
async function _errMonLoad() {
  if (_errMonLoading || !supabaseClient) return;
  _errMonLoading = true;

  try {
    var since = _errMonSince();
    var res = await supabaseClient.rpc('get_error_logs', { p_since: since });
    if (res.error) throw res.error;
    _errMonData = res.data || [];

    // Yesterday comparison (for trend)
    var rangeMs = _errMonRangeMs();
    var yesterdaySince = new Date(Date.now() - rangeMs * 2).toISOString();
    var prevRes = await supabaseClient.rpc('get_error_logs', { p_since: yesterdaySince });
    var prevData = (prevRes.data || []).filter(function(r) {
      return new Date(r.created_at).getTime() < new Date(since).getTime();
    });
    var yesterdayCount = prevData.length;

    _errMonRenderAll(yesterdayCount);
  } catch (e) {
    console.error('[error-monitor] Load failed:', e);
    var tbody = document.getElementById('errMonTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#ef4444;padding:20px;">Error: ' + _escHtml(e.message || String(e)) + '</td></tr>';
  } finally {
    _errMonLoading = false;
  }
}

/* ── Render everything ──────────────────────────────────── */
function _errMonRenderAll(yesterdayCount) {
  var rows = _errMonData;
  var groups = _errMonGroupErrors(rows);
  var uniqueUsers = {};
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].user_email) uniqueUsers[rows[i].user_email] = true;
  }
  var totalErrors = rows.length;
  var uniqueCount = groups.length;
  var usersAffected = Object.keys(uniqueUsers).length;

  // Trend
  var trendUp = totalErrors > yesterdayCount;
  var trendSame = totalErrors === yesterdayCount;
  var trendColor = trendSame ? '#94a3b8' : trendUp ? '#ef4444' : '#22c55e';
  var trendArrow = trendSame ? '~' : trendUp ? 'UP' : 'DOWN';
  var trendLabel = trendSame ? _t('em_no_change') : (trendUp ? '+' : '') + (totalErrors - yesterdayCount) + ' ' + _t('em_vs_prev');

  // Summary cards
  var cards = document.getElementById('errMonCards');
  if (cards) {
    cards.innerHTML = _errMonCard(_t('em_total_errors'), totalErrors, totalErrors > 50 ? '#ef4444' : totalErrors > 10 ? '#f59e0b' : '#22c55e') +
      _errMonCard(_t('em_unique_errors'), uniqueCount, uniqueCount > 20 ? '#ef4444' : '#f1f5f9') +
      _errMonCard(_t('em_affected_users'), usersAffected, usersAffected > 10 ? '#f59e0b' : '#f1f5f9') +
      '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;text-align:center;">' +
        '<div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">' + _t('em_trend') + '</div>' +
        '<div style="font-size:24px;font-weight:700;color:' + trendColor + ';">' + trendArrow + '</div>' +
        '<div style="color:#94a3b8;font-size:11px;margin-top:4px;">' + trendLabel + '</div>' +
      '</div>';
  }

  // Spike detection
  _errMonDetectSpike(rows);

  // Table
  _errMonRenderTable(groups);
}

function _errMonCard(label, value, color) {
  return '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;text-align:center;">' +
    '<div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">' + label + '</div>' +
    '<div style="font-size:28px;font-weight:700;color:' + color + ';">' + value + '</div>' +
  '</div>';
}

/* ── Group errors by message ────────────────────────────── */
function _errMonGroupErrors(rows) {
  var map = {};
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var key = r.message || _t('em_no_message');
    if (!map[key]) map[key] = { message: key, count: 0, users: {}, lastSeen: r.created_at, timestamps: [] };
    map[key].count++;
    if (r.user_email) map[key].users[r.user_email] = true;
    if (r.created_at > map[key].lastSeen) map[key].lastSeen = r.created_at;
    map[key].timestamps.push(new Date(r.created_at).getTime());
  }
  var groups = [];
  for (var k in map) groups.push(map[k]);
  groups.sort(function(a, b) { return b.count - a.count; });
  return groups;
}

/* ── Severity badge ─────────────────────────────────────── */
// Patrones BENIGNOS (no son errores reales): cierre de app normal, pantalla
// bloqueada/segundo plano, y ruido del navegador/extensiones. Se marcan INFO sin
// importar el conteo, para que el dashboard no grite CRÍTICO ante comportamiento
// normal. Mario 2026-06-03.
function _errMonIsBenign(message) {
  var m = String(message || '');
  return /ended without clean close/i.test(m)        // app cerrada/minimizada normal
    || /Main thread blocked/i.test(m)                 // casi siempre = app en segundo plano
    || /_AutofillCallbackHandler/i.test(m)            // autocompletar de iOS/gestor de contraseñas
    || /EmptyRanges/i.test(m)                         // interno de WebKit/Safari
    || /^Script error\.?$/i.test(m)                   // error opaco cross-origin (sin detalle)
    || /ResizeObserver loop/i.test(m);
}
function _errMonSeverity(count, message) {
  if (_errMonIsBenign(message)) return { label: 'INFO', bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
  if (count >= 50) return { label: 'CRITICAL', bg: 'rgba(239,68,68,0.2)', color: '#ef4444' };
  if (count >= 10) return { label: 'HIGH', bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' };
  if (count >= 3) return { label: 'MEDIUM', bg: 'rgba(59,130,246,0.2)', color: '#3b82f6' };
  return { label: 'LOW', bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' };
}

/* ── Render table ───────────────────────────────────────── */
function _errMonRenderTable(groups) {
  var tbody = document.getElementById('errMonTableBody');
  if (!tbody) return;

  if (groups.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#22c55e;padding:30px;font-weight:600;">' + _t('em_no_errors') + '</td></tr>';
    return;
  }

  var html = '';
  var limit = Math.min(groups.length, 50);
  for (var i = 0; i < limit; i++) {
    var g = groups[i];
    var sev = _errMonSeverity(g.count, g.message);
    var userCount = Object.keys(g.users).length;
    var msgTrunc = g.message.length > 80 ? g.message.substring(0, 80) + '...' : g.message;

    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">' +
      '<td style="padding:10px 8px;color:#e2e8f0;max-width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + _escHtml(g.message) + '">' + _escHtml(msgTrunc) + '</td>' +
      '<td style="padding:10px 8px;text-align:center;color:#f1f5f9;font-weight:700;">' + g.count + '</td>' +
      '<td style="padding:10px 8px;text-align:center;color:#94a3b8;">' + userCount + '</td>' +
      '<td style="padding:10px 8px;text-align:center;"><span style="background:' + sev.bg + ';color:' + sev.color + ';padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.5px;">' + sev.label + '</span></td>' +
      '<td style="padding:10px 8px;text-align:right;color:#64748b;font-size:12px;white-space:nowrap;">' + _errMonTimeAgo(g.lastSeen) + '</td>' +
    '</tr>';
  }
  tbody.innerHTML = html;
}

/* ── Spike detection ────────────────────────────────────── */
function _errMonDetectSpike(rows) {
  var banner = document.getElementById('errMonSpike');
  if (!banner) return;

  var fiveMin = 5 * 60 * 1000;
  var now = Date.now();
  var recent = {};
  for (var i = 0; i < rows.length; i++) {
    var t = new Date(rows[i].created_at).getTime();
    if (now - t > fiveMin) continue;
    var msg = rows[i].message || _t('em_no_message');
    recent[msg] = (recent[msg] || 0) + 1;
  }

  var spikes = [];
  for (var key in recent) {
    if (recent[key] > 10) spikes.push(key + ' (' + recent[key] + 'x)');
  }

  if (spikes.length > 0) {
    banner.style.display = 'block';
    banner.innerHTML = _t('em_spike_detected') + ' ' + _escHtml(spikes.join(', '));
  } else {
    banner.style.display = 'none';
  }
}
