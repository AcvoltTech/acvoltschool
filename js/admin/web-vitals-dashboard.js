if (typeof _addTranslations === 'function') _addTranslations({
  adm_wv_loading: { es: 'Cargando...', en: 'Loading...' },
  adm_wv_no_data: { es: 'Sin datos en este periodo', en: 'No data in this period' },
  adm_wv_no_revenue: { es: 'Sin datos de revenue mensual', en: 'No monthly revenue data' },
});

/* ===================================================================
   Web Vitals Dashboard — LCP, CLS, INP monitoring from error_logs
   Self-contained: injects HTML into #crm-section-webVitals
   Data source: error_logs where metadata->>type = 'web-vital'

   REQUIRED SQL (run once in Supabase SQL Editor):
   -----------------------------------------------
   CREATE OR REPLACE FUNCTION get_web_vitals(p_since timestamptz)
   RETURNS SETOF error_logs
   LANGUAGE sql SECURITY DEFINER STABLE
   AS $$ SELECT * FROM error_logs
          WHERE metadata->>'type' = 'web-vital'
            AND created_at >= p_since
          ORDER BY created_at DESC
          LIMIT 5000; $$;
   =================================================================== */

var _wvData = [];
var _wvPeriod = '7d';
var _wvLoading = false;

var _wvThresholds = {
  LCP: { good: 2500, poor: 4000, unit: 'ms', fmt: function(v) { return Math.round(v) + ' ms'; } },
  CLS: { good: 0.1,  poor: 0.25, unit: '',   fmt: function(v) { return v.toFixed(3); } },
  INP: { good: 200,  poor: 500,  unit: 'ms', fmt: function(v) { return Math.round(v) + ' ms'; } }
};

/* ── Main entry point ────────────────────────────────────── */
async function loadWebVitalsDashboard() {
  var shell = document.getElementById('crm-section-webVitals');
  if (!shell || !supabaseClient) return;

  shell.innerHTML =
    '<div style="max-width:900px;margin:0 auto;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px;">' +
        '<h2 style="color:#f1f5f9;margin:0;font-size:22px;">Web Vitals</h2>' +
        '<div id="wvFilters" style="display:flex;gap:6px;"></div>' +
      '</div>' +
      '<div id="wvCards" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;"></div>' +
      '<div id="wvBars" style="display:flex;flex-direction:column;gap:14px;"></div>' +
    '</div>';

  _wvRenderFilters();
  await _wvFetch();
}

/* ── Time filter buttons ─────────────────────────────────── */
function _wvRenderFilters() {
  var el = document.getElementById('wvFilters');
  if (!el) return;
  var opts = [['24h','24 h'],['7d','7 d'],['30d','30 d']];
  var html = '';
  for (var i = 0; i < opts.length; i++) {
    var active = _wvPeriod === opts[i][0];
    html += '<button onclick="_wvSetPeriod(\'' + opts[i][0] + '\')" style="' +
      'padding:6px 14px;border-radius:8px;border:1px solid ' +
      (active ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)') + ';' +
      'background:' + (active ? 'rgba(59,130,246,0.2)' : '#1e293b') + ';' +
      'color:' + (active ? '#93c5fd' : '#94a3b8') + ';' +
      'cursor:pointer;font-size:13px;font-weight:600;">' + opts[i][1] + '</button>';
  }
  el.innerHTML = html;
}

function _wvSetPeriod(p) { _wvPeriod = p; _wvRenderFilters(); _wvFetch(); }

/* ── Fetch data via RPC ──────────────────────────────────── */
async function _wvFetch() {
  if (_wvLoading) return;
  _wvLoading = true;
  var cards = document.getElementById('wvCards');
  if (cards) cards.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;">' + _t('adm_wv_loading') + '</div>';

  try {
    var since = new Date();
    if (_wvPeriod === '24h') since.setHours(since.getHours() - 24);
    else if (_wvPeriod === '7d') since.setDate(since.getDate() - 7);
    else since.setDate(since.getDate() - 30);

    var res = await supabaseClient.rpc('get_web_vitals', { p_since: since.toISOString() });
    _wvData = (res.data || []).filter(function(r) {
      return r.metadata && r.metadata.metric && r.metadata.value !== undefined;
    });
    _wvRender();
  } catch (e) {
    if (cards) cards.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">Error: ' + _escHtml(String(e.message || e)) + '</div>';
  } finally {
    _wvLoading = false;
  }
}

/* ── Compute stats per metric ────────────────────────────── */
function _wvStats(metric) {
  var vals = [];
  var good = 0, needs = 0, poor = 0;
  var th = _wvThresholds[metric];
  for (var i = 0; i < _wvData.length; i++) {
    var m = _wvData[i].metadata;
    if (m.metric !== metric) continue;
    var v = Number(m.value);
    if (isNaN(v)) continue;
    vals.push(v);
    if (v <= th.good) good++;
    else if (v <= th.poor) needs++;
    else poor++;
  }
  vals.sort(function(a, b) { return a - b; });
  var n = vals.length;
  return {
    n: n,
    p50: n ? vals[Math.floor(n * 0.5)] : null,
    p75: n ? vals[Math.floor(n * 0.75)] : null,
    good: good, needs: needs, poor: poor
  };
}

function _wvRatingColor(metric, value) {
  if (value === null) return '#64748b';
  var th = _wvThresholds[metric];
  return value <= th.good ? '#22c55e' : value <= th.poor ? '#f59e0b' : '#ef4444';
}

/* ── Render everything ───────────────────────────────────── */
function _wvRender() {
  var metrics = ['LCP', 'CLS', 'INP'];
  var labels = { LCP: 'Largest Contentful Paint', CLS: 'Cumulative Layout Shift', INP: 'Interaction to Next Paint' };
  var cardsEl = document.getElementById('wvCards');
  var barsEl = document.getElementById('wvBars');
  if (!cardsEl || !barsEl) return;

  var cardsHtml = '';
  var barsHtml = '';

  for (var i = 0; i < metrics.length; i++) {
    var met = metrics[i];
    var s = _wvStats(met);
    var th = _wvThresholds[met];
    var p75Color = _wvRatingColor(met, s.p75);
    var p50Color = _wvRatingColor(met, s.p50);

    // Metric card
    cardsHtml +=
      '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;">' +
        '<div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">' + labels[met] + '</div>' +
        '<div style="font-size:28px;font-weight:700;color:' + p75Color + ';margin-bottom:2px;">' +
          (s.p75 !== null ? th.fmt(s.p75) : '--') +
        '</div>' +
        '<div style="color:#64748b;font-size:11px;margin-bottom:10px;">p75' +
          (s.p50 !== null ? ' &nbsp;|&nbsp; <span style="color:' + p50Color + ';">p50 ' + th.fmt(s.p50) + '</span>' : '') +
        '</div>' +
        '<div style="color:#64748b;font-size:11px;">' + s.n + ' sample' + (s.n !== 1 ? 's' : '') + '</div>' +
      '</div>';

    // Rating distribution bar
    var total = s.good + s.needs + s.poor;
    if (total > 0) {
      var gP = ((s.good / total) * 100).toFixed(1);
      var nP = ((s.needs / total) * 100).toFixed(1);
      var pP = ((s.poor / total) * 100).toFixed(1);
      barsHtml +=
        '<div style="background:#1e293b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
            '<span style="color:#f1f5f9;font-weight:600;font-size:14px;">' + met + '</span>' +
            '<span style="color:#64748b;font-size:11px;">' +
              '<span style="color:#22c55e;">' + gP + '% good</span> · ' +
              '<span style="color:#f59e0b;">' + nP + '% meh</span> · ' +
              '<span style="color:#ef4444;">' + pP + '% poor</span>' +
            '</span>' +
          '</div>' +
          '<div style="display:flex;height:10px;border-radius:5px;overflow:hidden;">' +
            (s.good ? '<div style="width:' + gP + '%;background:#22c55e;"></div>' : '') +
            (s.needs ? '<div style="width:' + nP + '%;background:#f59e0b;"></div>' : '') +
            (s.poor ? '<div style="width:' + pP + '%;background:#ef4444;"></div>' : '') +
          '</div>' +
        '</div>';
    }
  }

  cardsEl.innerHTML = cardsHtml || '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;">' + _t('adm_wv_no_data') + '</div>';
  barsEl.innerHTML = barsHtml;
}
