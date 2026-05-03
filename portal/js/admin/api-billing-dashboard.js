/* ===================================================================
   API Billing Dashboard — Centralized monitoring of 10 API/SaaS services
   Self-contained: injects HTML + CSS into #crm-section-apiBilling
   Follows live-stream-admin.js pattern
   =================================================================== */
if (typeof _addTranslations === 'function') _addTranslations({
  adm_bill_title: { es: 'API Billing Monitor', en: 'API Billing Monitor' },
  adm_bill_refresh: { es: 'Refrescar', en: 'Refresh' },
  adm_bill_check_all: { es: 'Check All APIs', en: 'Check All APIs' },
  adm_bill_loading: { es: 'Cargando...', en: 'Loading...' },
  adm_bill_monthly_spend: { es: 'Gasto mensual total', en: 'Total Monthly Spend' },
  adm_bill_calculating: { es: 'Calculando...', en: 'Calculating...' },
  adm_bill_detail: { es: 'Detalle', en: 'Detail' },
  adm_bill_manual_entry: { es: 'Manual Entry', en: 'Manual Entry' },
  adm_bill_events: { es: 'Eventos', en: 'Events' },
  adm_bill_api: { es: 'API', en: 'API' },
  adm_bill_status: { es: 'Status', en: 'Status' },
  adm_bill_usage: { es: 'Uso', en: 'Usage' },
  adm_bill_cost: { es: 'Costo/Mo', en: 'Cost/Mo' },
  adm_bill_auto_recharge: { es: 'Auto-Recharge', en: 'Auto-Recharge' },
  adm_bill_actions_label: { es: 'Acciones', en: 'Actions' },
  adm_bill_no_apis: { es: 'No hay APIs configuradas', en: 'No APIs configured' },
  adm_bill_no_data: { es: 'Sin datos', en: 'No data' },
  adm_bill_manual_title: { es: 'Manual Spend Entry', en: 'Manual Spend Entry' },
  adm_bill_manual_desc: { es: 'Para APIs sin endpoint de billing (Anthropic, Runway, Google AI Studio)', en: 'For APIs without billing endpoint (Anthropic, Runway, Google AI Studio)' },
  adm_bill_no_manual: { es: 'No hay APIs manuales configuradas', en: 'No manual APIs configured' },
  adm_bill_save: { es: 'Guardar', en: 'Save' },
  adm_bill_event_log: { es: 'Event Log', en: 'Event Log' },
  adm_bill_all: { es: 'Todos', en: 'All' },
  adm_bill_loading_events: { es: 'Cargando eventos...', en: 'Loading events...' },
  adm_bill_no_events: { es: 'No hay eventos', en: 'No events' },
  adm_bill_checking: { es: 'Checking...', en: 'Checking...' },
  adm_bill_last_check: { es: 'Ultima revision: ', en: 'Last check: ' },
  adm_bill_no_data_check: { es: 'Sin datos \u2014 presiona "Check All APIs" para iniciar', en: 'No data \u2014 press "Check All APIs" to start' },
  adm_bill_valid_amount: { es: 'Ingresa un monto valido', en: 'Enter a valid amount' },
  adm_bill_ago_s: { es: 'hace ', en: '' },
  adm_bill_ago_s2: { es: 's', en: 's ago' },
  adm_bill_ago_min: { es: ' min', en: ' min ago' },
  adm_bill_ago_h: { es: 'h', en: 'h ago' },
  adm_bill_ago_d: { es: 'd', en: 'd ago' },
});

var _billingApis = [];
var _billingEvents = [];
var _billingLoading = false;
var _billingInitDone = false;
var _billingRefreshTimer = null;

// ── Edge Function call helper ──
function _billingCall(body) {
  body.admin_email = getAdminEmail();
  return supabaseClient.functions.invoke('monitor-api-billing', { body: body });
}

// ── Status helpers ──
var _billingStatusColors = {
  ok:       { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  dot: '#22c55e', label: 'OK' },
  warning:  { bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.4)',  dot: '#eab308', label: 'LOW' },
  critical: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', dot: '#f97316', label: 'CRIT' },
  depleted: { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  dot: '#ef4444', label: 'LIM' },
  manual:   { bg: 'rgba(148,163,184,0.10)',border: 'rgba(148,163,184,0.3)',dot: '#94a3b8', label: 'Man' },
  unknown:  { bg: 'rgba(148,163,184,0.10)',border: 'rgba(148,163,184,0.3)',dot: '#64748b', label: '—' },
  error:    { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.3)',  dot: '#ef4444', label: 'ERR' },
};

function _billingStatusInfo(status) {
  return _billingStatusColors[status] || _billingStatusColors.unknown;
}

/* ── Render dashboard ─────────────────────────────────────── */
function renderApiBillingDashboard() {
  if (_billingInitDone) {
    _billingLoadStatus();
    return;
  }
  _billingInitDone = true;

  // CSS injection
  var style = document.createElement('style');
  style.textContent =
    '.bill-card{border-radius:12px;padding:14px;text-align:center;min-width:120px;flex:1;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;}' +
    '.bill-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.3);}' +
    '.bill-card-icon{font-size:24px;margin-bottom:4px;}' +
    '.bill-card-name{font-size:12px;color:#e2e8f0;font-weight:600;margin-bottom:4px;}' +
    '.bill-card-status{font-size:11px;font-weight:700;letter-spacing:0.5px;}' +
    '.bill-card-cost{font-size:11px;color:#94a3b8;margin-top:2px;}' +
    '.bill-btn{background:#334155;color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;transition:background 0.15s;}' +
    '.bill-btn:hover{background:#475569;}' +
    '.bill-btn-sm{padding:4px 10px;font-size:11px;border-radius:6px;}' +
    '.bill-btn-green{background:rgba(34,197,94,0.2);border-color:rgba(34,197,94,0.4);color:#22c55e;}' +
    '.bill-btn-green:hover{background:rgba(34,197,94,0.35);}' +
    '.bill-btn-red{background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.4);color:#ef4444;}' +
    '.bill-btn-red:hover{background:rgba(239,68,68,0.35);}' +
    '.bill-table{width:100%;border-collapse:collapse;font-size:13px;}' +
    '.bill-table th{text-align:left;padding:10px 8px;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}' +
    '.bill-table td{padding:10px 8px;border-bottom:1px solid rgba(255,255,255,0.05);color:#e2e8f0;}' +
    '.bill-table tr:hover td{background:rgba(255,255,255,0.03);}' +
    '.bill-event{padding:10px 12px;border-radius:8px;margin-bottom:6px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;}' +
    '.bill-progress-bar{height:8px;border-radius:4px;background:#1e293b;overflow:hidden;width:100%;}' +
    '.bill-progress-fill{height:100%;border-radius:4px;transition:width 0.5s;}' +
    '.bill-section{background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:16px;}' +
    '.bill-tab{display:inline-block;padding:8px 16px;cursor:pointer;color:#94a3b8;border-bottom:2px solid transparent;font-size:13px;transition:color 0.15s;}' +
    '.bill-tab.active{color:#e2e8f0;border-bottom-color:#3b82f6;}' +
    '.bill-tab:hover{color:#e2e8f0;}' +
    '@media(max-width:700px){.bill-cards-grid{grid-template-columns:repeat(3,1fr)!important;}.bill-card{min-width:90px;padding:10px;}}';
  document.head.appendChild(style);

  var shell = document.getElementById('crm-section-apiBilling');
  if (!shell) return;

  shell.innerHTML =
    '<div style="max-width:960px;margin:0 auto;">' +
      // Header
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">' +
        '<h2 style="color:#e2e8f0;margin:0;font-size:22px;">' + _t('adm_bill_title', 'API Billing Monitor') + '</h2>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="bill-btn" onclick="_billingRefreshAll()" id="billRefreshBtn">' + _t('adm_bill_refresh', 'Refrescar') + '</button>' +
          '<button class="bill-btn bill-btn-green" onclick="_billingCheckAll()" id="billCheckBtn">' + _t('adm_bill_check_all', 'Check All APIs') + '</button>' +
        '</div>' +
      '</div>' +
      '<div id="billLastCheck" style="color:#64748b;font-size:12px;margin-bottom:16px;"></div>' +

      // API Cards grid
      '<div id="billCardsGrid" class="bill-cards-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px;">' +
        '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#64748b;">' + _t('adm_bill_loading', 'Cargando...') + '</div>' +
      '</div>' +

      // Monthly spend bar
      '<div class="bill-section" id="billSpendSection">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
          '<span style="color:#e2e8f0;font-weight:600;font-size:14px;">' + _t('adm_bill_monthly_spend', 'Gasto mensual total') + '</span>' +
          '<span id="billSpendText" style="color:#94a3b8;font-size:13px;">' + _t('adm_bill_calculating', 'Calculando...') + '</span>' +
        '</div>' +
        '<div class="bill-progress-bar" style="height:12px;">' +
          '<div id="billSpendBar" class="bill-progress-fill" style="width:0%;background:#3b82f6;"></div>' +
        '</div>' +
      '</div>' +

      // Tabs
      '<div style="margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1);">' +
        '<span class="bill-tab active" onclick="_billingShowTab(\'detail\',this)">' + _t('adm_bill_detail', 'Detalle') + '</span>' +
        '<span class="bill-tab" onclick="_billingShowTab(\'manual\',this)">' + _t('adm_bill_manual_entry', 'Manual Entry') + '</span>' +
        '<span class="bill-tab" onclick="_billingShowTab(\'events\',this)">' + _t('adm_bill_events', 'Eventos') + '</span>' +
      '</div>' +

      // Detail table
      '<div id="billTabDetail" class="bill-section">' +
        '<table class="bill-table">' +
          '<thead><tr><th>' + _t('adm_bill_api', 'API') + '</th><th>' + _t('adm_bill_status', 'Status') + '</th><th>' + _t('adm_bill_usage', 'Uso') + '</th><th>' + _t('adm_bill_cost', 'Costo/Mo') + '</th><th>' + _t('adm_bill_auto_recharge', 'Auto-Recharge') + '</th><th>' + _t('adm_bill_actions_label', 'Acciones') + '</th></tr></thead>' +
          '<tbody id="billDetailBody"><tr><td colspan="6" style="text-align:center;color:#64748b;padding:20px;">' + _t('adm_bill_loading', 'Cargando...') + '</td></tr></tbody>' +
        '</table>' +
      '</div>' +

      // Manual entry section
      '<div id="billTabManual" class="bill-section" style="display:none;">' +
        '<h3 style="color:#e2e8f0;margin:0 0 14px 0;font-size:15px;">' + _t('adm_bill_manual_title', 'Manual Spend Entry') + '</h3>' +
        '<p style="color:#94a3b8;font-size:12px;margin-bottom:14px;">' + _t('adm_bill_manual_desc', 'Para APIs sin endpoint de billing (Anthropic, Runway, Google AI Studio)') + '</p>' +
        '<div id="billManualList" style="display:flex;flex-direction:column;gap:10px;"></div>' +
      '</div>' +

      // Events log
      '<div id="billTabEvents" class="bill-section" style="display:none;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
          '<h3 style="color:#e2e8f0;margin:0;font-size:15px;">' + _t('adm_bill_event_log', 'Event Log') + '</h3>' +
          '<select id="billEventFilter" onchange="_billingLoadEvents()" style="background:#0f172a;color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:4px 8px;font-size:12px;">' +
            '<option value="">' + _t('adm_bill_all', 'Todos') + '</option>' +
            '<option value="warning">Warnings</option>' +
            '<option value="critical">Critical</option>' +
            '<option value="recharge_success">Recharges</option>' +
            '<option value="config_change">Config Changes</option>' +
            '<option value="manual_update">Manual Updates</option>' +
          '</select>' +
        '</div>' +
        '<div id="billEventsList"></div>' +
      '</div>' +
    '</div>';

  _billingLoadStatus();

  // Auto-refresh every 30 min
  if (_billingRefreshTimer) clearInterval(_billingRefreshTimer);
  _billingRefreshTimer = setInterval(function() {
    if (document.getElementById('crm-section-apiBilling') &&
        document.getElementById('crm-section-apiBilling').classList.contains('crm-visible')) {
      _billingLoadStatus();
    }
  }, 30 * 60 * 1000);
}

/* ── Tab switching ──────────────────────────────────────── */
function _billingShowTab(tabId, el) {
  document.querySelectorAll('.bill-tab').forEach(function(t) { t.classList.remove('active'); });
  if (el) el.classList.add('active');
  var tabs = ['detail', 'manual', 'events'];
  tabs.forEach(function(t) {
    var div = document.getElementById('billTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (div) div.style.display = t === tabId ? '' : 'none';
  });
  if (tabId === 'events') _billingLoadEvents();
}

/* ── Load status (dashboard data) ───────────────────────── */
async function _billingLoadStatus() {
  if (_billingLoading) return;
  _billingLoading = true;

  var btn = document.getElementById('billRefreshBtn');
  if (btn) { btn.disabled = true; btn.textContent = _t('adm_bill_loading', 'Cargando...'); }

  try {
    var resp = await _billingCall({ action: 'get_status' });
    if (resp.error) throw new Error(resp.error.message || resp.error);
    var data = resp.data;
    if (data.error) throw new Error(data.error);

    _billingApis = data.apis || [];
    _billingRenderCards();
    _billingRenderSpendBar();
    _billingRenderDetailTable();
    _billingRenderManualEntries();

    // Update last check time
    var lastEl = document.getElementById('billLastCheck');
    if (lastEl) {
      var latestSnap = null;
      for (var i = 0; i < _billingApis.length; i++) {
        var s = _billingApis[i].latest_snapshot;
        if (s && s.snapshot_at) {
          if (!latestSnap || s.snapshot_at > latestSnap) latestSnap = s.snapshot_at;
        }
      }
      if (latestSnap) {
        var ago = _billingTimeAgo(new Date(latestSnap));
        lastEl.textContent = _t('adm_bill_last_check', 'Ultima revision: ') + ago;
      } else {
        lastEl.textContent = _t('adm_bill_no_data_check', 'Sin datos \u2014 presiona "Check All APIs" para iniciar');
      }
    }
  } catch (e) {
    console.error('[billing-dashboard] Load error:', e);
    var grid = document.getElementById('billCardsGrid');
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#ef4444;">Error: ' + _escHtml(e.message) + '</div>';
  } finally {
    _billingLoading = false;
    if (btn) { btn.disabled = false; btn.textContent = _t('adm_bill_refresh', 'Refrescar'); }
  }
}

/* ── Render 10 API cards ────────────────────────────────── */
function _billingRenderCards() {
  var grid = document.getElementById('billCardsGrid');
  if (!grid) return;

  if (_billingApis.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;">' + _t('adm_bill_no_apis', 'No hay APIs configuradas') + '</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < _billingApis.length; i++) {
    var api = _billingApis[i];
    var snap = api.latest_snapshot;
    var status = snap ? snap.status : (api.has_api ? 'unknown' : 'manual');
    var info = _billingStatusInfo(status);
    var cost = snap ? snap.cost_usd : api.monthly_cost;

    html += '<div class="bill-card" style="background:' + info.bg + ';border:1px solid ' + info.border + ';" onclick="_billingShowApiDetail(\'' + _escHtml(api.api_name) + '\')">' +
      '<div class="bill-card-icon">' + (api.icon || '🔌') + '</div>' +
      '<div class="bill-card-name">' + _escHtml(api.display_name || api.api_name) + '</div>' +
      '<div class="bill-card-status" style="color:' + info.dot + ';">' + info.label + '</div>' +
      (cost > 0 ? '<div class="bill-card-cost">$' + Number(cost).toFixed(0) + '</div>' : '') +
    '</div>';
  }

  grid.innerHTML = html;
}

/* ── Render spend progress bar ──────────────────────────── */
function _billingRenderSpendBar() {
  var totalSpend = 0;
  var totalBudget = 0;
  for (var i = 0; i < _billingApis.length; i++) {
    var api = _billingApis[i];
    var snap = api.latest_snapshot;
    totalSpend += Number(snap ? snap.cost_usd : api.monthly_cost) || 0;
    totalBudget += Number(api.budget_limit) || 0;
  }

  if (totalBudget === 0) totalBudget = 1000; // fallback

  var pct = Math.min((totalSpend / totalBudget) * 100, 100);
  var color = pct >= 90 ? '#ef4444' : pct >= 75 ? '#f97316' : pct >= 50 ? '#eab308' : '#3b82f6';

  var bar = document.getElementById('billSpendBar');
  if (bar) { bar.style.width = pct.toFixed(1) + '%'; bar.style.background = color; }

  var txt = document.getElementById('billSpendText');
  if (txt) txt.textContent = '~$' + totalSpend.toFixed(0) + ' / $' + totalBudget.toFixed(0) + ' budget (' + pct.toFixed(0) + '%)';
}

/* ── Render detail table ────────────────────────────────── */
function _billingRenderDetailTable() {
  var body = document.getElementById('billDetailBody');
  if (!body) return;

  if (_billingApis.length === 0) {
    body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px;">' + _t('adm_bill_no_data', 'Sin datos') + '</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < _billingApis.length; i++) {
    var api = _billingApis[i];
    var snap = api.latest_snapshot;
    var status = snap ? snap.status : 'unknown';
    var info = _billingStatusInfo(status);
    var usagePct = snap ? Number(snap.usage_pct) : 0;
    var cost = snap ? Number(snap.cost_usd) : Number(api.monthly_cost);

    html += '<tr>' +
      '<td><span style="margin-right:6px;">' + (api.icon || '🔌') + '</span>' + _escHtml(api.display_name) + '</td>' +
      '<td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + info.dot + ';margin-right:6px;"></span>' + info.label + '</td>' +
      '<td>' + (status === 'manual' ? '—' : '<div style="display:flex;align-items:center;gap:6px;"><div class="bill-progress-bar" style="width:80px;"><div class="bill-progress-fill" style="width:' + Math.min(usagePct, 100) + '%;background:' + info.dot + ';"></div></div><span style="font-size:11px;color:#94a3b8;">' + usagePct.toFixed(0) + '%</span></div>') + '</td>' +
      '<td>$' + cost.toFixed(0) + '/mo</td>' +
      '<td>' +
        (api.has_api ?
          '<label style="cursor:pointer;display:flex;align-items:center;gap:4px;">' +
            '<input type="checkbox" ' + (api.auto_recharge_enabled ? 'checked' : '') +
            ' onchange="_billingToggleRecharge(\'' + _escHtml(api.api_name) + '\',this.checked)"' +
            ' style="accent-color:#22c55e;">' +
            '<span style="font-size:11px;color:#94a3b8;">' + (api.auto_recharge_amount > 0 ? '$' + Number(api.auto_recharge_amount).toFixed(0) : 'Off') + '</span>' +
          '</label>'
          : '<span style="color:#64748b;font-size:11px;">N/A</span>') +
      '</td>' +
      '<td>' +
        '<button class="bill-btn bill-btn-sm" onclick="_billingCheckOne(\'' + _escHtml(api.api_name) + '\')">Check</button>' +
      '</td>' +
    '</tr>';
  }

  body.innerHTML = html;
}

/* ── Render manual entry section ────────────────────────── */
function _billingRenderManualEntries() {
  var container = document.getElementById('billManualList');
  if (!container) return;

  var manualApis = _billingApis.filter(function(a) { return !a.has_api; });
  if (manualApis.length === 0) {
    container.innerHTML = '<div style="color:#64748b;font-size:13px;">' + _t('adm_bill_no_manual', 'No hay APIs manuales configuradas') + '</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < manualApis.length; i++) {
    var api = manualApis[i];
    var snap = api.latest_snapshot;
    var currentCost = snap ? Number(snap.cost_usd) : Number(api.monthly_cost);

    html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#0f172a;border-radius:8px;">' +
      '<span style="font-size:20px;">' + (api.icon || '🔌') + '</span>' +
      '<span style="color:#e2e8f0;font-weight:600;min-width:120px;">' + _escHtml(api.display_name) + '</span>' +
      '<span style="color:#94a3b8;font-size:12px;">Current: $' + currentCost.toFixed(0) + '</span>' +
      '<input type="number" id="billManual_' + api.api_name + '" placeholder="$ amount" value="' + currentCost.toFixed(2) + '" ' +
        'style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px 10px;width:100px;font-size:13px;">' +
      '<button class="bill-btn bill-btn-sm bill-btn-green" onclick="_billingSaveManual(\'' + api.api_name + '\')">' + _t('adm_bill_save', 'Guardar') + '</button>' +
    '</div>';
  }

  container.innerHTML = html;
}

/* ── Load events ────────────────────────────────────────── */
async function _billingLoadEvents() {
  var container = document.getElementById('billEventsList');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;">' + _t('adm_bill_loading_events', 'Cargando eventos...') + '</div>';

  try {
    var filter = document.getElementById('billEventFilter');
    var filterVal = filter ? filter.value : '';
    var body = { action: 'get_events', limit: 50 };
    if (filterVal) body.event_type = filterVal;

    var resp = await _billingCall(body);
    if (resp.error) throw new Error(resp.error.message || resp.error);
    var data = resp.data;
    if (data.error) throw new Error(data.error);

    _billingEvents = data.events || [];
    _billingRenderEvents();
  } catch (e) {
    container.innerHTML = '<div style="color:#ef4444;padding:10px;">Error: ' + _escHtml(e.message) + '</div>';
  }
}

function _billingRenderEvents() {
  var container = document.getElementById('billEventsList');
  if (!container) return;

  if (_billingEvents.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;">' + _t('adm_bill_no_events', 'No hay eventos') + '</div>';
    return;
  }

  var sevColors = { info: 'rgba(59,130,246,0.15)', warning: 'rgba(234,179,8,0.15)', critical: 'rgba(239,68,68,0.15)' };
  var sevBorders = { info: 'rgba(59,130,246,0.3)', warning: 'rgba(234,179,8,0.3)', critical: 'rgba(239,68,68,0.3)' };

  var html = '';
  for (var i = 0; i < _billingEvents.length; i++) {
    var ev = _billingEvents[i];
    var bg = sevColors[ev.severity] || sevColors.info;
    var border = sevBorders[ev.severity] || sevBorders.info;
    var time = _billingTimeAgo(new Date(ev.created_at));

    html += '<div class="bill-event" style="background:' + bg + ';border:1px solid ' + border + ';">' +
      '<div style="flex:1;">' +
        '<span style="font-weight:600;color:#e2e8f0;">' + _escHtml(ev.api_name) + '</span>' +
        '<span style="margin-left:8px;color:#94a3b8;font-size:11px;">' + _escHtml(ev.event_type) + '</span>' +
        '<div style="color:#cbd5e1;margin-top:2px;">' + _escHtml(ev.message) + '</div>' +
      '</div>' +
      '<div style="text-align:right;flex-shrink:0;">' +
        '<div style="color:#64748b;font-size:11px;">' + time + '</div>' +
        (ev.acknowledged ? '<span style="color:#22c55e;font-size:10px;">ACK</span>' :
          '<button class="bill-btn bill-btn-sm" onclick="_billingAckEvent(' + ev.id + ')" style="font-size:10px;padding:2px 8px;margin-top:4px;">ACK</button>') +
      '</div>' +
    '</div>';
  }

  container.innerHTML = html;
}

/* ── Actions ────────────────────────────────────────────── */
async function _billingCheckAll() {
  var btn = document.getElementById('billCheckBtn');
  if (btn) { btn.disabled = true; btn.textContent = _t('adm_bill_checking', 'Checking...'); }

  try {
    var resp = await _billingCall({ action: 'check_all' });
    if (resp.error) throw new Error(resp.error.message || resp.error);
    var data = resp.data;
    if (data.error) throw new Error(data.error);

    // Reload status after check
    await _billingLoadStatus();
  } catch (e) {
    alert('Error checking APIs: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = _t('adm_bill_check_all', 'Check All APIs'); }
  }
}

async function _billingRefreshAll() {
  await _billingLoadStatus();
}

async function _billingCheckOne(apiName) {
  try {
    var resp = await _billingCall({ action: 'check_one', api_name: apiName });
    if (resp.error) throw new Error(resp.error.message || resp.error);
    var data = resp.data;
    if (data.error) throw new Error(data.error);
    await _billingLoadStatus();
  } catch (e) {
    alert('Error checking ' + apiName + ': ' + e.message);
  }
}

async function _billingToggleRecharge(apiName, enabled) {
  try {
    var resp = await _billingCall({
      action: 'update_config',
      api_name: apiName,
      updates: { auto_recharge_enabled: enabled },
    });
    if (resp.error) throw new Error(resp.error.message || resp.error);
  } catch (e) {
    alert('Error: ' + e.message);
    _billingLoadStatus(); // reload to revert checkbox
  }
}

async function _billingSaveManual(apiName) {
  var input = document.getElementById('billManual_' + apiName);
  if (!input) return;
  var val = parseFloat(input.value);
  if (isNaN(val) || val < 0) { alert(_t('adm_bill_valid_amount', 'Ingresa un monto valido')); return; }

  try {
    var resp = await _billingCall({
      action: 'update_manual',
      api_name: apiName,
      cost_usd: val,
    });
    if (resp.error) throw new Error(resp.error.message || resp.error);
    var data = resp.data;
    if (data.error) throw new Error(data.error);
    await _billingLoadStatus();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}

async function _billingAckEvent(eventId) {
  try {
    var resp = await _billingCall({
      action: 'acknowledge_event',
      event_id: eventId,
    });
    if (resp.error) throw new Error(resp.error.message || resp.error);
    _billingLoadEvents();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}

function _billingShowApiDetail(apiName) {
  // For now, just check that one API and show the detail tab
  _billingShowTab('detail', document.querySelector('.bill-tab'));
  _billingCheckOne(apiName);
}

/* ── Time ago helper ────────────────────────────────────── */
function _billingTimeAgo(date) {
  var diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return _t('adm_bill_ago_s', 'hace ') + Math.floor(diff) + _t('adm_bill_ago_s2', 's');
  if (diff < 3600) return _t('adm_bill_ago_s', 'hace ') + Math.floor(diff / 60) + _t('adm_bill_ago_min', ' min');
  if (diff < 86400) return _t('adm_bill_ago_s', 'hace ') + Math.floor(diff / 3600) + _t('adm_bill_ago_h', 'h');
  return _t('adm_bill_ago_s', 'hace ') + Math.floor(diff / 86400) + _t('adm_bill_ago_d', 'd');
}
