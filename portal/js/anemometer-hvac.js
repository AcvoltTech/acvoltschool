/**
 * Anemómetro HVAC — Herramienta Interactiva de Air Balancing
 * 6 Tabs: Vane Anemometer, Hot Wire, Flowhood, Pitot Tube, Balance, Temp/BTU
 */
(function() {
  'use strict';
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  // ───────── Maestro Premium Design Tokens (shared across every tool) ─────────
  var BG = '#FAFAF7';           // warm canvas
  var BG2 = '#FFFFFF';          // sub-card
  var ACCENT = '#E8591C';       // single premium accent
  var ACCENT2 = '#C2410C';      // accent pressed
  var GREEN = '#059669';
  var YELLOW = '#D97706';
  var RED = '#DC2626';
  var BLUE = '#1E3A8A';
  var TEXT = '#0F0F0F';         // primary ink
  var MUTED = '#6B6B66';        // secondary ink
  var HAIRLINE = '#E7E5DE';
  var LCD = "'Courier New',monospace";
  var _inputSt = 'border-radius:6px;background:#ffffff;color:#111111;border:1px solid rgba(255,107,53,0.35);font-family:' + LCD + ';font-size:14px;font-weight:700;';

  var _activeTab = 0;
  // Tab 0: Vane
  var _vnReadings = [0, 0, 0];
  var _vnCount = 3;
  var _vnCustom = false;
  var _vnW = 10, _vnH = 6, _vnAk = 75;
  // Tab 1: Hot Wire
  var _hwMode = 'traverse';
  var _hwShape = 'round';
  var _hwPoints = [];
  var _hwFR = [0, 0, 0];
  var _hwFC = 3;
  var _hwW = 10, _hwH = 6, _hwAk = 75;
  // Tab 3: Pitot
  var _ptShape = 'round';
  var _ptMode = 'single';
  var _ptPoints = [];
  // Tab 4: Balance
  var _balRegisters = [];
  var _balCount = 4;
  // Tab 5: Temp
  var _tempMode = 'cooling';

  var _REG_SIZES = [
    {l:'6\u00D76', w:6, h:6}, {l:'8\u00D74', w:8, h:4}, {l:'10\u00D76', w:10, h:6},
    {l:'12\u00D76', w:12, h:6}, {l:'14\u00D76', w:14, h:6}, {l:'20\u00D720', w:20, h:20}
  ];

  // ============================
  // EQUIPMENT/CLIENT/TECH STATE
  // ============================
  function _initEquip() {
    if (!window._anEquip) {
      var tn = '', tnum = '', te = '';
      try { var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        tn = u.nombre || u.name || '';
        tnum = u.technicianNumber || localStorage.getItem('tecnico_number_' + (u.email || '')) || localStorage.getItem('tecnico_number') || '';
        te = u.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._anEquip = { model:'', serial:'', clientName:'', clientAddr:'', techName:tn, techNum:tnum, techEmail:te };
    }
  }
  window._anSaveEquip = function() {
    var eq = window._anEquip; if (!eq) return;
    var ids = [['anEqModel','model'],['anEqSerial','serial'],['anEqClient','clientName'],['anEqAddr','clientAddr'],['anEqTech','techName'],['anEqTechNum','techNum']];
    for (var i = 0; i < ids.length; i++) { var el = document.getElementById(ids[i][0]); if (el) eq[ids[i][1]] = el.value; }
  };
  function _equipHTML() {
    var eq = window._anEquip || {};
    var h = '<div style="background:rgba(255,107,53,0.06);border:1.5px solid rgba(255,107,53,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:10px;font-weight:800;color:' + ACCENT + ';letter-spacing:0.5px;margin-bottom:8px;border-left:3px solid ' + ACCENT + ';padding-left:6px;">INFORMACI\u00D3N DEL SERVICIO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:' + ACCENT + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Modelo</label>';
    h += '<input id="anEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 24ACC636" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(255,107,53,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + ACCENT + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Serie</label>';
    h += '<input id="anEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 1234ABC567" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(255,107,53,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Nombre del Cliente</label>';
    h += '<input id="anEqClient" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Direcci\u00F3n</label>';
    h += '<input id="anEqAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 0.8fr 1.2fr;gap:8px;">';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">T\u00E9cnico</label>';
    h += '<input id="anEqTech" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;"># T\u00E9cnico</label>';
    h += '<input id="anEqTechNum" value="' + (eq.techNum||'') + '" placeholder="Lic #" oninput="_anSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">Email</label>';
    h += '<input id="anEqEmail" value="' + (eq.techEmail||'') + '" readonly style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div></div>';
    return h;
  }

  // ============================
  // INIT
  // ============================
  window.initAnemometerHvac = function() {
    var s = document.getElementById('anemometerHvacScreen');
    if (!s) return;
    if (window.Gamification) window.Gamification.recordToolUse('anemometer');
    _initEquip();
    _activeTab = 0;
    _vnReadings = [0,0,0]; _vnCount = 3; _vnCustom = false; _vnW = 10; _vnH = 6; _vnAk = 75;
    _hwMode = 'traverse'; _hwShape = 'round'; _hwPoints = []; _hwFR = [0,0,0]; _hwFC = 3; _hwW = 10; _hwH = 6; _hwAk = 75;
    _ptShape = 'round'; _ptMode = 'single'; _ptPoints = [];
    _balRegisters = []; _balCount = 4; _tempMode = 'cooling';
    _render(s);
  };

  // ============================
  // MAIN RENDER
  // ============================
  function _render(s) {
    var tabs = [
      {icon:'\uD83C\uDF00',label:'Vane'}, {icon:'\uD83D\uDD25',label:'Hot Wire'},
      {icon:'\uD83D\uDCE6',label:'Flowhood'}, {icon:'\uD83D\uDCCF',label:'Pitot'},
      {icon:'\u2696\uFE0F',label:'Balance'}, {icon:'\uD83C\uDF21\uFE0F',label:'Temp/BTU'}
    ];
    var h = '<div style="background:' + BG + ';min-height:100vh;color:#111111;display:flex;flex-direction:column;">';
    h += '<div style="position:sticky;top:0;z-index:20;background:' + BG + ';border-bottom:1px solid rgba(255,107,53,0.15);padding:10px 12px 0;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<button onclick="window._toolBack && window._toolBack(\'dashboardScreen\')" style="background:rgba(255,107,53,0.12);border:none;color:' + ACCENT + ';width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;"><div style="font-size:17px;font-weight:800;color:#111111;">' + _t('an_title','\uD83C\uDF00 Anem\u00F3metro HVAC') + '</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';font-weight:500;">' + _t('an_subtitle','Testing Air & Balancing \u00B7 4 Instrumentos \u00B7 CFM \u00B7 \u0394T') + '</div></div></div>';
    h += '<div style="display:flex;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:0;">';
    for (var i = 0; i < tabs.length; i++) {
      var act = i === _activeTab;
      h += '<button onclick="window._anSwitchTab(' + i + ')" style="flex-shrink:0;background:' + (act ? 'rgba(255,107,53,0.18)' : 'transparent') + ';border:none;border-bottom:2px solid ' + (act ? ACCENT : 'transparent') + ';color:' + (act ? ACCENT : MUTED) + ';padding:8px 10px 6px;cursor:pointer;font-size:11px;font-weight:' + (act ? '700' : '500') + ';white-space:nowrap;display:flex;align-items:center;gap:4px;transition:all .2s;">';
      h += '<span style="font-size:14px;">' + tabs[i].icon + '</span>' + tabs[i].label + '</button>';
    }
    h += '</div></div>';
    h += '<div style="padding:12px 12px 0;">' + _equipHTML() + '</div>';
    h += '<div id="anContent" style="flex:1;overflow-y:auto;padding:12px;"></div>';
    h += '</div>';
    s.innerHTML = h;
    _renderTab();
  }

  window._anSwitchTab = function(idx) {
    _activeTab = idx;
    var s = document.getElementById('anemometerHvacScreen');
    if (s) _render(s);
  };

  function _renderTab() {
    var c = document.getElementById('anContent');
    if (!c) return;
    if (_activeTab === 0) _renderVane(c);
    else if (_activeTab === 1) _renderHotWire(c);
    else if (_activeTab === 2) _renderFlowhood(c);
    else if (_activeTab === 3) _renderPitot(c);
    else if (_activeTab === 4) _renderRegBalancing(c);
    else if (_activeTab === 5) _renderTempDeltaT(c);
    // Sync weather data into tool sliders
    _syncWeatherDefaults();
  }

  // ============================
  // WEATHER SYNC — auto-populate sliders from MaestroWeather
  // ============================
  function _syncWeatherDefaults() {
    var MW = window.MaestroWeather;
    if (!MW || !MW.ready) return;

    // Show live conditions badge at top of content
    var c = document.getElementById('anContent');
    if (c && !document.getElementById('anWeatherBadge')) {
      var badge = document.createElement('div');
      badge.id = 'anWeatherBadge';
      badge.style.cssText = 'background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(34,197,94,0.08));border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:8px 12px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;';
      badge.innerHTML =
        '<span style="font-size:13px;font-weight:700;color:#111111;">' + _t('an_live_conditions','\uD83D\uDCE1 CONDICIONES EN VIVO') + '</span>' +
        '<span style="font-size:14px;color:#111111;font-weight:700;">' + Math.round(MW.tempF) + '°F</span>' +
        '<span style="font-size:14px;color:#111111;font-weight:600;">💧' + MW.rhPct + '%</span>' +
        '<span style="font-size:14px;color:#111111;font-weight:600;">⛰️' + MW.elevationFt + ' ft</span>' +
        (MW.getDensityFactor() !== 1.0 ? '<span style="font-size:9px;color:#f59e0b;">ρ=' + MW.getDensityFactor().toFixed(3) + '</span>' : '');
      c.insertBefore(badge, c.firstChild);
    }

    // Tab 1: Hot Wire — temperature slider
    if (_activeTab === 1) {
      var hwT = document.getElementById('hwTempS');
      if (hwT && MW.tempF) {
        var t = Math.round(MW.tempF);
        if (t >= 40 && t <= 120) {
          hwT.value = t;
          if (typeof window._hwTempDisp === 'function') window._hwTempDisp();
        }
      }
    }

    // Tab 2: Flowhood — temperature + humidity sliders
    if (_activeTab === 2) {
      var fhT = document.getElementById('fhTmpS');
      if (fhT && MW.tempF) {
        var tf = Math.min(120, Math.max(40, MW.tempF));
        fhT.value = tf.toFixed(1);
      }
      var fhR = document.getElementById('fhRhS');
      if (fhR && MW.rhPct) {
        var rh = Math.min(95, Math.max(10, MW.rhPct));
        fhR.value = rh;
      }
      if (typeof window._fhUp === 'function') window._fhUp();
    }

    // Tab 5: Temp/BTU — return temp ≈ room temp ≈ outdoor temp
    if (_activeTab === 5 && MW.tempF) {
      var retS = document.getElementById('anTempReturn');
      if (retS) {
        var retT = Math.round(MW.tempF);
        var mn = parseInt(retS.min), mx = parseInt(retS.max);
        if (retT >= mn && retT <= mx) {
          retS.value = retT;
          if (typeof window._anTempUpdate === 'function') window._anTempUpdate();
        }
      }
    }
  }

  // ============================
  // HELPERS
  // ============================
  function _card(title, content) {
    return '<div style="background:' + BG2 + ';border:1px solid rgba(255,107,53,0.12);border-radius:12px;padding:14px;margin-bottom:12px;">' +
      (title ? '<div style="font-size:12px;font-weight:700;color:' + ACCENT + ';margin-bottom:10px;letter-spacing:0.5px;">' + title + '</div>' : '') +
      content + '</div>';
  }
  function _lcdDisplay(id, value, unit, size) {
    size = size || 36;
    return '<div style="text-align:center;padding:10px 0;">' +
      '<span id="' + id + '" style="font-family:' + LCD + ';font-size:' + size + 'px;font-weight:900;color:#111111;letter-spacing:2px;">' + value + '</span>' +
      '<span style="font-size:12px;color:' + MUTED + ';margin-left:6px;">' + unit + '</span></div>';
  }
  function _slider(id, min, max, value, step, oninput) {
    return '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + value + '" step="' + (step || 1) + '" ' +
      'oninput="' + oninput + '" style="width:100%;accent-color:' + ACCENT + ';height:6px;cursor:pointer;margin:4px 0;">';
  }
  function _statusBadge(id, text, color) {
    return '<div id="' + id + '" style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44;">' + text + '</div>';
  }
  var _iaBtn = 'width:100%;padding:14px;background:linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,107,53,0.1));border:1.5px solid rgba(255,107,53,0.3);color:' + ACCENT + ';border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:0.3px;';
  function _anAIButton(id, label, onclick) {
    return '<div style="margin-top:12px;margin-bottom:8px;"><button id="' + id + '" data-label="' + label + '" onclick="' + onclick + '" style="' + _iaBtn + '">' + label + '</button>' +
      '<div id="' + id + 'Result" style="margin-top:8px;"></div></div>';
  }
  function _anCallIA(prompt, resultId, btnId) {
    var rEl = document.getElementById(resultId);
    var bEl = document.getElementById(btnId);
    if (!rEl) return;
    if (bEl) { bEl.disabled = true; bEl.textContent = _t('an_analyzing','Analizando...'); bEl.style.opacity = '0.6'; }
    rEl.innerHTML = '<div style="padding:16px;text-align:center;"><div style="display:inline-block;width:24px;height:24px;border:3px solid rgba(255,107,53,0.2);border-top-color:' + ACCENT + ';border-radius:50%;animation:anSpin 0.8s linear infinite;"></div><div style="margin-top:8px;font-size:13px;color:#111111;">' + _t('an_consulting_ai','Consultando IA...') + '</div></div>';
    if (!document.getElementById('anSpinStyle')) {
      var st = document.createElement('style'); st.id = 'anSpinStyle';
      st.textContent = '@keyframes anSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');
    var _getToken = (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth)
      ? supabaseClient.auth.getSession().then(function(ses) { return (ses && ses.data && ses.data.session) ? ses.data.session.access_token : sbKey; }).catch(function() { return sbKey; })
      : Promise.resolve(sbKey);
    _getToken.then(function(_tk) {
      fetch(sbUrl + '/functions/v1/tutor-ia-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tk, 'apikey': sbKey },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], system: 'Eres un t\u00E9cnico HVAC master con 20+ a\u00F1os de experiencia especializado en air balancing, anem\u00F3metros, duct traverses, y medici\u00F3n de flujo de aire. Responde siempre en espa\u00F1ol, de forma directa y profesional. Usa terminolog\u00EDa t\u00E9cnica HVAC. Incluye rangos ASHRAE cuando aplique.', max_tokens: 2048, email: localStorage.getItem('tecnico_email') || '' })
      }).then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        var text = data.reply || data.text || data.response || JSON.stringify(data);
        text = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b style="color:#111111;">$1</b>').replace(/(\d+)\.\s/g, '<span style="color:' + ACCENT + ';font-weight:700;">$1.</span> ');
        rEl.innerHTML = '<div style="padding:12px;background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.15);border-radius:10px;font-size:11px;color:#3D3D3A;line-height:1.8;">' +
          '<div style="font-size:12px;font-weight:800;color:' + ACCENT + ';margin-bottom:6px;">' + _t('an_ai_diag_header','\uD83E\uDD16 Diagn\u00F3stico IA \u2014 Air Balancing') + '</div>' + text + '</div>';
        if (bEl) { bEl.disabled = false; bEl.innerHTML = bEl.getAttribute('data-label') || _t('an_diagnose_ai','Diagnosticar con IA'); bEl.style.opacity = '1'; }
      }).catch(function(err) {
        rEl.innerHTML = '<div style="padding:10px;background:rgba(255,107,53,0.1);border-radius:8px;font-size:11px;color:#f87171;">Error: ' + err.message + '. ' + _t('an_check_connection','Verifica tu conexi\u00F3n.') + '</div>';
        if (bEl) { bEl.disabled = false; bEl.textContent = _t('an_retry','Reintentar'); bEl.style.opacity = '1'; }
      });
    });
  }
  function _formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function _calcWetBulb(tf, rh) {
    var t = (tf - 32) * 5 / 9;
    var tw = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh) - Math.atan(rh - 1.676331) + 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;
    return tw * 9 / 5 + 32;
  }
  function _calcDewPoint(tf, rh) {
    var t = (tf - 32) * 5 / 9;
    var gamma = Math.log(rh / 100) + (17.625 * t) / (243.04 + t);
    var td = 243.04 * gamma / (17.625 - gamma);
    return td * 9 / 5 + 32;
  }
  function _getTraverseCount(dia) {
    if (dia <= 12) return 6;
    if (dia <= 24) return 8;
    return 10;
  }
  function _ensureAnim() {
    if (!document.getElementById('anVaneStyle')) {
      var st = document.createElement('style'); st.id = 'anVaneStyle';
      st.textContent = '@keyframes anVane{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
  }

  // ============================
  // TAB 0: VANE ANEMOMETER (Testo 417)
  // ============================
  function _renderVane(c) {
    _ensureAnim();
    var h = '';
    // Device LCD
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;">';
    h += '<div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">TESTO 417</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">VANE ANEMOMETER</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:12px 14px;margin-bottom:10px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">AVG VEL</span>';
    h += '<div><span id="vnDevVel" style="font-family:' + LCD + ';font-size:28px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.4);">---</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">FPM</span></div></div>';
    h += '<div style="border-top:1px solid #1a2a1a;margin:4px 0;"></div>';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">CFM</span>';
    h += '<div><span id="vnDevCFM" style="font-family:' + LCD + ';font-size:24px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 8px rgba(51,255,51,0.3);">---</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">ft\u00B3/min</span></div></div>';
    h += '<div style="display:flex;justify-content:center;margin-top:8px;">';
    h += '<div style="width:44px;height:44px;border-radius:50%;border:2px solid #2a3a2a;display:flex;align-items:center;justify-content:center;font-size:24px;animation:anVane 1.5s linear infinite;">\uD83C\uDF00</div>';
    h += '</div></div></div></div>';

    // Register size
    var selOpts = '';
    for (var i = 0; i < _REG_SIZES.length; i++) {
      var sel = (!_vnCustom && _vnW === _REG_SIZES[i].w && _vnH === _REG_SIZES[i].h) ? ' selected' : '';
      selOpts += '<option value="' + i + '"' + sel + '>' + _REG_SIZES[i].l + '"</option>';
    }
    selOpts += '<option value="custom"' + (_vnCustom ? ' selected' : '') + '>Custom</option>';
    var sC = '<select id="vnSizeSelect" onchange="window._vnSetSize()" style="width:100%;padding:10px;border-radius:8px;background:#1a2744;color:' + TEXT + ';border:1px solid rgba(255,107,53,0.2);font-size:13px;cursor:pointer;">' + selOpts + '</select>';
    if (_vnCustom) {
      sC += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
      sC += '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Ancho (W)"</div>';
      sC += '<input type="number" id="vnCustW" value="' + _vnW + '" min="2" max="48" oninput="window._vnCustCh()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div>';
      sC += '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Alto (H)"</div>';
      sC += '<input type="number" id="vnCustH" value="' + _vnH + '" min="2" max="48" oninput="window._vnCustCh()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div></div>';
    }
    var gross = (_vnW * _vnH) / 144;
    var free = gross * (_vnAk / 100);
    sC += '<div id="vnAreaDisp" style="margin-top:8px;font-size:13px;color:#111111;text-align:center;">Gross: <b>' + gross.toFixed(4) + ' ft\u00B2</b> (' + _vnW + '\u00D7' + _vnH + '") | Free: <b>' + free.toFixed(4) + ' ft\u00B2</b></div>';
    h += _card(_t('an_register_size','\uD83D\uDCD0 TAMA\u00D1O DEL REGISTRO'), sC);

    // Ak factor
    h += _card(_t('an_free_area_factor','\uD83D\uDD27 FREE AREA FACTOR (Ak)'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Ak Factor</span>' +
      '<span id="vnAkVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">' + _vnAk + '%</span></div>' +
      _slider('vnAkSlider', 50, 100, _vnAk, 1, 'window._vnUpdate()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>50%</span><span>100%</span></div>' +
      '<div style="margin-top:8px;font-size:13px;color:' + MUTED + ';line-height:1.7;">Stamped face: 70-85% \u2022 Bar type: 75-85% \u2022 Perforated: 20-50%</div>'
    );

    // Velocity readings
    h += _card(_t('an_velocity_readings','\uD83D\uDCCA LECTURAS DE VELOCIDAD (FPM)'), '' +
      '<div id="vnRdContainer"></div>' +
      '<div style="display:flex;gap:8px;margin-top:10px;">' +
      '<button onclick="window._vnAddR()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + GREEN + ';background:rgba(34,197,94,0.1);color:' + GREEN + ';font-weight:700;font-size:12px;cursor:pointer;">' + _t('an_add','+ Agregar') + '</button>' +
      '<button onclick="window._vnRemR()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + RED + ';background:rgba(239,68,68,0.1);color:' + RED + ';font-weight:700;font-size:12px;cursor:pointer;">' + _t('an_remove','\u2212 Quitar') + '</button></div>' +
      '<div style="margin-top:6px;font-size:9px;color:' + MUTED + ';text-align:center;">' + _t('an_max_readings','M\u00E1ximo 10 lecturas \u2022 ASHRAE: \u00B110% tolerancia') + '</div>'
    );

    // Statistics
    h += _card(_t('an_statistics','\uD83D\uDCC8 ESTAD\u00CDSTICAS'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
      _statBox('vnMin', _t('an_minimum','M\u00CDNIMO')) + _statBox('vnMax', _t('an_maximum','M\u00C1XIMO')) +
      _statBox('vnAvg', _t('an_average','PROMEDIO'), ACCENT) + _statBox('vnStd', 'STD DEV') +
      '</div><div id="vnTolWrap" style="margin-top:10px;text-align:center;"></div>'
    );

    // CFM result
    h += _card(_t('an_cfm_result','\uD83C\uDFAF CFM RESULTADO'), '' +
      _lcdDisplay('vnCFM', '--', 'CFM', 42) +
      '<div style="text-align:center;margin-top:4px;" id="vnStatWrap"></div>' +
      '<div style="margin-top:10px;font-size:13px;color:' + MUTED + ';text-align:center;">CFM = Avg Velocity \u00D7 Free Area (Ak)</div>'
    );

    // Reference
    h += _card(_t('an_ref_cfm_room','\uD83D\uDCD6 REFERENCIA \u2014 CFM POR TIPO DE CUARTO'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;font-size:11px;line-height:1.8;">' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_bath','Ba\u00F1o') + '</div><div>50\u201380 CFM</div>' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_kitchen','Cocina') + '</div><div>100\u2013150 CFM</div>' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_bedroom','Dormitorio') + '</div><div>75\u2013125 CFM</div>' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_living','Sala / Living') + '</div><div>150\u2013300 CFM</div>' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_office','Oficina') + '</div><div>100\u2013200 CFM</div>' +
      '<div style="color:' + MUTED + ';">' + _t('an_room_master','Cuarto maestro') + '</div><div>150\u2013250 CFM</div></div>'
    );

    // AI
    h += _anAIButton('vnIA', _t('an_ai_vane','\uD83E\uDD16 Diagn\u00F3stico Vane Anemometer con IA'), 'window._vnDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(0);
    c.innerHTML = h;
    _vnBuildRd();

    window._vnSetSize = function() {
      var sel = document.getElementById('vnSizeSelect');
      if (!sel) return;
      if (sel.value === 'custom') { _vnCustom = true; }
      else { _vnCustom = false; var idx = parseInt(sel.value); _vnW = _REG_SIZES[idx].w; _vnH = _REG_SIZES[idx].h; }
      var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s);
    };
    window._vnCustCh = function() {
      var w = document.getElementById('vnCustW'), ht = document.getElementById('vnCustH');
      if (w) _vnW = parseFloat(w.value) || 10; if (ht) _vnH = parseFloat(ht.value) || 6;
      window._vnUpdate();
    };
    window._vnAddR = function() { if (_vnCount >= 10) return; _vnCount++; _vnReadings.push(0); _vnBuildRd(); };
    window._vnRemR = function() { if (_vnCount <= 2) return; _vnCount--; _vnReadings.pop(); _vnBuildRd(); window._vnUpdate(); };

    window._vnUpdate = function() {
      var akEl = document.getElementById('vnAkSlider');
      if (akEl) _vnAk = parseInt(akEl.value);
      var akV = document.getElementById('vnAkVal'); if (akV) akV.textContent = _vnAk + '%';
      var readings = [];
      for (var i = 0; i < _vnCount; i++) {
        var el = document.getElementById('vnR' + i);
        var v = el ? parseFloat(el.value) || 0 : 0;
        _vnReadings[i] = v; if (v > 0) readings.push(v);
      }
      var gr = (_vnW * _vnH) / 144, fr = gr * (_vnAk / 100);
      var ad = document.getElementById('vnAreaDisp');
      if (ad) ad.innerHTML = 'Gross: <b>' + gr.toFixed(4) + ' ft\u00B2</b> (' + _vnW + '\u00D7' + _vnH + '") | Free: <b>' + fr.toFixed(4) + ' ft\u00B2</b>';
      if (readings.length === 0) {
        _setIds(['vnMin','vnMax','vnAvg','vnStd','vnCFM','vnDevVel','vnDevCFM'], '--');
        var tw = document.getElementById('vnTolWrap'); if (tw) tw.innerHTML = '';
        var sw = document.getElementById('vnStatWrap'); if (sw) sw.innerHTML = '';
        return;
      }
      var min = Math.min.apply(null, readings), max = Math.max.apply(null, readings);
      var sum = 0; for (var j = 0; j < readings.length; j++) sum += readings[j];
      var avg = sum / readings.length;
      var sqS = 0; for (var k = 0; k < readings.length; k++) sqS += Math.pow(readings[k] - avg, 2);
      var std = Math.sqrt(sqS / readings.length);
      var cfm = avg * fr;
      _setId('vnMin', Math.round(min)); _setId('vnMax', Math.round(max));
      _setId('vnAvg', Math.round(avg)); _setId('vnStd', Math.round(std));
      _setId('vnCFM', Math.round(cfm)); _setId('vnDevVel', Math.round(avg)); _setId('vnDevCFM', Math.round(cfm));
      var within = true;
      for (var m = 0; m < readings.length; m++) { if (Math.abs(readings[m] - avg) / avg * 100 > 10) { within = false; break; } }
      var tw2 = document.getElementById('vnTolWrap');
      if (tw2) tw2.innerHTML = within ? _statusBadge('', _t('an_within_10','\u2705 Dentro de \u00B110% ASHRAE'), GREEN) : _statusBadge('', _t('an_outside_10','\u26A0\uFE0F Fuera de \u00B110% \u2014 verificar posici\u00F3n'), YELLOW);
      var sw2 = document.getElementById('vnStatWrap');
      if (sw2) {
        if (cfm < 50) sw2.innerHTML = _statusBadge('', _t('an_very_low','\u26A0\uFE0F Muy bajo \u2014 <50 CFM'), RED);
        else if (cfm <= 400) sw2.innerHTML = _statusBadge('', _t('an_typical','\u2705 T\u00EDpico \u2014 registro individual'), GREEN);
        else sw2.innerHTML = _statusBadge('', _t('an_high_cfm','\u26A1 Alto \u2014 >400 CFM'), YELLOW);
      }
    };

    window._vnDiagnose = function() {
      var readings = []; for (var i = 0; i < _vnCount; i++) { var el = document.getElementById('vnR' + i); var v = el ? parseFloat(el.value) || 0 : 0; if (v > 0) readings.push(v); }
      var gr = (_vnW * _vnH) / 144, fr = gr * (_vnAk / 100);
      var avg = 0; if (readings.length > 0) { var s = 0; for (var j = 0; j < readings.length; j++) s += readings[j]; avg = s / readings.length; }
      var cfm = avg * fr;
      var p = 'Analiza esta medici\u00F3n con Vane Anemometer (tipo Testo 417):\n\nRegistro: ' + _vnW + '\u00D7' + _vnH + '"\nAk factor: ' + _vnAk + '%\n\u00C1rea bruta: ' + gr.toFixed(4) + ' ft\u00B2\n\u00C1rea libre: ' + fr.toFixed(4) + ' ft\u00B2\nLecturas (FPM): ' + (readings.length > 0 ? readings.join(', ') : 'Sin datos') + '\nVelocidad promedio: ' + Math.round(avg) + ' FPM\nCFM: ' + Math.round(cfm) + '\n\n\u00BFEs correcto el Ak factor? \u00BFEl CFM es adecuado? \u00BFLas lecturas son consistentes (\u00B110%)? Recomienda acciones.';
      _anCallIA(p, 'vnIAResult', 'vnIA');
    };
  }

  function _vnBuildRd() {
    var ct = document.getElementById('vnRdContainer'); if (!ct) return;
    var h = '';
    for (var i = 0; i < _vnCount; i++) {
      var val = _vnReadings[i] || 0;
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">';
      h += '<span style="font-size:13px;color:' + MUTED + ';width:24px;text-align:right;">#' + (i + 1) + '</span>';
      h += '<input type="number" id="vnR' + i + '" value="' + (val > 0 ? val : '') + '" min="0" max="5000" placeholder="FPM" oninput="window._vnUpdate()" style="flex:1;padding:8px 10px;font-size:14px;' + _inputSt + '">';
      h += '<span style="font-size:13px;color:' + MUTED + ';">FPM</span></div>';
    }
    ct.innerHTML = h;
  }

  // ============================
  // TAB 1: HOT WIRE ANEMOMETER
  // ============================
  function _renderHotWire(c) {
    _ensureAnim();
    var h = '';
    // Mode toggle
    h += _card(_t('an_measurement_mode','\uD83D\uDD25 MODO DE MEDICI\u00D3N'), '' +
      '<div style="display:flex;gap:6px;">' +
      _togBtn('window._hwSetMode(\'free\')', _t('an_free_area','\uD83D\uDCCF Free Area'), _hwMode === 'free') +
      _togBtn('window._hwSetMode(\'traverse\')', _t('an_in_duct_traverse','\uD83D\uDD32 In-Duct Traverse'), _hwMode === 'traverse') +
      '</div>'
    );

    // Device LCD
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;"><div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">HOT WIRE</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">THERMAL ANEMOMETER</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += _lcdRow('hwDevVel', 'VELOCITY', '---', 'FPM', 28);
    h += '<div style="border-top:1px solid #1a2a1a;margin:2px 0;"></div>';
    h += _lcdRow('hwDevCFM', 'CFM', '---', '', 22);
    h += '</div></div></div>';

    if (_hwMode === 'free') {
      // Free area mode
      h += _card(_t('an_dimensions_ak','\uD83D\uDCD0 DIMENSIONES + Ak'), '' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Ancho (W)"</div>' +
        '<input type="number" id="hwFW" value="' + _hwW + '" min="2" max="48" oninput="window._hwFreeUp()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div>' +
        '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Alto (H)"</div>' +
        '<input type="number" id="hwFH" value="' + _hwH + '" min="2" max="48" oninput="window._hwFreeUp()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div></div>' +
        '<div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
        '<span style="font-size:13px;color:' + MUTED + ';">Ak Factor</span>' +
        '<span id="hwAkVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">' + _hwAk + '%</span></div>' +
        _slider('hwAkSlider', 50, 100, _hwAk, 1, 'window._hwFreeUp()') +
        '<div id="hwFreeArea" style="margin-top:8px;font-size:13px;color:#111111;text-align:center;"></div>'
      );
      // Velocity readings
      h += _card(_t('an_velocity_readings','\uD83D\uDCCA LECTURAS DE VELOCIDAD (FPM)'), '' +
        '<div id="hwFRContainer"></div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;">' +
        '<button onclick="window._hwAddR()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + GREEN + ';background:rgba(34,197,94,0.1);color:' + GREEN + ';font-weight:700;font-size:12px;cursor:pointer;">' + _t('an_add','+ Agregar') + '</button>' +
        '<button onclick="window._hwRemR()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + RED + ';background:rgba(239,68,68,0.1);color:' + RED + ';font-weight:700;font-size:12px;cursor:pointer;">' + _t('an_remove','\u2212 Quitar') + '</button></div>'
      );
      h += _card(_t('an_cfm_result','\uD83C\uDFAF CFM RESULTADO'), '' +
        _lcdDisplay('hwFreeCFM', '--', 'CFM', 42) +
        '<div style="text-align:center;margin-top:4px;" id="hwFreeStatW"></div>' +
        '<div style="margin-top:8px;font-size:13px;color:' + MUTED + ';text-align:center;">CFM = Avg Velocity \u00D7 Free Area (Ak)</div>'
      );
    } else {
      // Traverse mode
      h += _card(_t('an_duct_shape','\uD83D\uDD32 FORMA DEL DUCTO'), '<div style="display:flex;gap:6px;">' +
        _togBtn('window._hwSetShape(\'round\')', _t('an_round','\u2B55 Redondo'), _hwShape === 'round') +
        _togBtn('window._hwSetShape(\'rect\')', _t('an_rectangular','\u25AC Rectangular'), _hwShape === 'rect') + '</div>');
      if (_hwShape === 'round') {
        h += _card(_t('an_diameter','\uD83D\uDCD0 DI\u00C1METRO'), '' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Di\u00E1metro</span>' +
          '<span id="hwTDiaV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">12"</span></div>' +
          _slider('hwTDiaS', 6, 48, 12, 1, 'window._hwTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>6"</span><span>48"</span></div>' +
          '<div id="hwTPtInfo" style="margin-top:8px;font-size:13px;color:' + MUTED + ';text-align:center;"></div>'
        );
      } else {
        h += _card(_t('an_dimensions','\uD83D\uDCD0 DIMENSIONES (W \u00D7 H)'), '' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Ancho (W)</span>' +
          '<span id="hwTWV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">12"</span></div>' +
          _slider('hwTWS', 4, 48, 12, 1, 'window._hwTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';margin-bottom:10px;"><span>4"</span><span>48"</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Alto (H)</span>' +
          '<span id="hwTHV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">8"</span></div>' +
          _slider('hwTHS', 4, 48, 8, 1, 'window._hwTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>4"</span><span>48"</span></div>'
        );
      }
      h += _card(_t('an_measurement_points','\uD83C\uDFAF PUNTOS DE MEDICI\u00D3N (Equal Area Method)'), '' +
        '<div id="hwTGridCt"></div>' +
        '<div style="margin-top:8px;text-align:center;">' +
        '<button onclick="window._hwTClear()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(0,0,0,0.1);background:rgba(0,0,0,0.03);color:' + MUTED + ';font-size:11px;cursor:pointer;">' + _t('an_clear_all','Limpiar Todo') + '</button></div>'
      );
      h += _card(_t('an_traverse_result','\uD83D\uDCCB RESULTADO TRAVERSE'), '' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        _statBox('hwTMeas', _t('an_points_measured','PUNTOS MEDIDOS')) + _statBox('hwTAvgV', 'AVG VELOCITY', ACCENT) +
        '</div>' + _lcdDisplay('hwTCFM', '--', 'CFM', 42) +
        '<div style="text-align:center;" id="hwTAreaI"></div>'
      );
    }

    // Temperature (both modes)
    h += _card(_t('an_air_temp','\uD83C\uDF21\uFE0F TEMPERATURA DEL AIRE'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Air Temperature</span>' +
      '<span id="hwTempV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">72\u00B0F</span></div>' +
      _slider('hwTempS', 40, 120, 72, 1, 'window._hwTempDisp()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>40\u00B0F</span><span>120\u00B0F</span></div>'
    );

    // AI
    h += _anAIButton('hwIA', _t('an_ai_hotwire','\uD83E\uDD16 Diagn\u00F3stico Hot Wire con IA'), 'window._hwDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(1);
    c.innerHTML = h;

    if (_hwMode === 'free') { _hwBuildFR(); window._hwFreeUp(); }
    else { _hwBuildGrid(); }

    window._hwSetMode = function(m) { _hwMode = m; var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s); };
    window._hwSetShape = function(sh) { _hwShape = sh; _hwPoints = []; var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s); };
    window._hwTempDisp = function() { var e = document.getElementById('hwTempV'); var s = document.getElementById('hwTempS'); if (e && s) e.textContent = s.value + '\u00B0F'; };
    window._hwAddR = function() { if (_hwFC >= 10) return; _hwFC++; _hwFR.push(0); _hwBuildFR(); };
    window._hwRemR = function() { if (_hwFC <= 2) return; _hwFC--; _hwFR.pop(); _hwBuildFR(); window._hwFreeUp(); };

    window._hwFreeUp = function() {
      var wE = document.getElementById('hwFW'), hE = document.getElementById('hwFH');
      if (wE) _hwW = parseFloat(wE.value) || 10; if (hE) _hwH = parseFloat(hE.value) || 6;
      var akE = document.getElementById('hwAkSlider'); if (akE) _hwAk = parseInt(akE.value);
      var akV = document.getElementById('hwAkVal'); if (akV) akV.textContent = _hwAk + '%';
      var gr = (_hwW * _hwH) / 144, fr = gr * (_hwAk / 100);
      var aE = document.getElementById('hwFreeArea');
      if (aE) aE.innerHTML = 'Gross: <b>' + gr.toFixed(4) + ' ft\u00B2</b> | Free (Ak): <b>' + fr.toFixed(4) + ' ft\u00B2</b>';
      var readings = [];
      for (var i = 0; i < _hwFC; i++) { var el = document.getElementById('hwFR' + i); var v = el ? parseFloat(el.value) || 0 : 0; _hwFR[i] = v; if (v > 0) readings.push(v); }
      if (readings.length === 0) { _setIds(['hwFreeCFM','hwDevVel','hwDevCFM'], '--'); var sw = document.getElementById('hwFreeStatW'); if (sw) sw.innerHTML = ''; return; }
      var sum = 0; for (var j = 0; j < readings.length; j++) sum += readings[j]; var avg = sum / readings.length;
      var cfm = avg * fr;
      _setId('hwFreeCFM', Math.round(cfm)); _setId('hwDevVel', Math.round(avg)); _setId('hwDevCFM', Math.round(cfm));
      var sw2 = document.getElementById('hwFreeStatW');
      if (sw2) {
        if (cfm < 50) sw2.innerHTML = _statusBadge('', _t('an_very_low_short','\u26A0\uFE0F Muy bajo'), RED);
        else if (cfm <= 400) sw2.innerHTML = _statusBadge('', _t('an_typical_range','\u2705 Rango t\u00EDpico'), GREEN);
        else sw2.innerHTML = _statusBadge('', _t('an_high_cfm','\u26A1 Alto \u2014 >400 CFM'), YELLOW);
      }
    };

    window._hwTBuild = function() { _hwPoints = []; _hwBuildGrid(); _hwCalcTrav(); };
    window._hwTSetPt = function(idx) {
      var el = document.getElementById('hwPt' + idx); if (el) _hwPoints[idx] = parseFloat(el.value) || 0;
      var dot = document.getElementById('hwDot' + idx);
      if (dot) { dot.style.background = _hwPoints[idx] > 0 ? GREEN : '#334155'; dot.style.borderColor = _hwPoints[idx] > 0 ? GREEN : '#475569'; }
      _hwCalcTrav();
    };
    window._hwTClear = function() { for (var i = 0; i < _hwPoints.length; i++) _hwPoints[i] = 0; _hwBuildGrid(); _hwCalcTrav(); };

    window._hwDiagnose = function() {
      var temp = document.getElementById('hwTempS') ? document.getElementById('hwTempS').value : '72';
      var p = '';
      if (_hwMode === 'free') {
        var readings = []; for (var i = 0; i < _hwFC; i++) { var el = document.getElementById('hwFR' + i); var v = el ? parseFloat(el.value) || 0 : 0; if (v > 0) readings.push(v); }
        var gr = (_hwW * _hwH) / 144, fr = gr * (_hwAk / 100);
        var avg = 0; if (readings.length > 0) { var s = 0; for (var j = 0; j < readings.length; j++) s += readings[j]; avg = s / readings.length; }
        p = 'Analiza medici\u00F3n Hot Wire (Free Area):\nRegistro: ' + _hwW + '\u00D7' + _hwH + '"\nAk: ' + _hwAk + '% | \u00C1rea libre: ' + fr.toFixed(4) + ' ft\u00B2\nLecturas (FPM): ' + (readings.length > 0 ? readings.join(', ') : 'Sin datos') + '\nCFM: ' + Math.round(avg * fr) + '\nTemp: ' + temp + '\u00B0F\n\n\u00BFLas lecturas son normales para baja velocidad? Recomienda acciones.';
      } else {
        var tr = []; for (var k = 0; k < _hwPoints.length; k++) { if (_hwPoints[k] > 0) tr.push(_hwPoints[k]); }
        var dim = _hwShape === 'round' ? 'Di\u00E1metro: ' + (document.getElementById('hwTDiaS') ? document.getElementById('hwTDiaS').value : '12') + '"' :
          'W: ' + (document.getElementById('hwTWS') ? document.getElementById('hwTWS').value : '12') + '" \u00D7 H: ' + (document.getElementById('hwTHS') ? document.getElementById('hwTHS').value : '8') + '"';
        p = 'Analiza duct traverse Hot Wire:\nForma: ' + (_hwShape === 'round' ? 'Redondo' : 'Rectangular') + '\n' + dim + '\nPuntos: ' + _hwPoints.length + ' | Medidos: ' + tr.length + '\nLecturas (FPM): ' + (tr.length > 0 ? tr.join(', ') : 'Sin datos') + '\nTemp: ' + temp + '\u00B0F\n\n\u00BFLas lecturas son aceptables? \u00BFHay turbulencia? Procedimiento ASHRAE.';
      }
      _anCallIA(p, 'hwIAResult', 'hwIA');
    };
  }

  function _hwBuildFR() {
    var ct = document.getElementById('hwFRContainer'); if (!ct) return;
    var h = '';
    for (var i = 0; i < _hwFC; i++) {
      var val = _hwFR[i] || 0;
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">';
      h += '<span style="font-size:13px;color:' + MUTED + ';width:24px;text-align:right;">#' + (i + 1) + '</span>';
      h += '<input type="number" id="hwFR' + i + '" value="' + (val > 0 ? val : '') + '" min="0" max="5000" placeholder="FPM" oninput="window._hwFreeUp()" style="flex:1;padding:8px 10px;font-size:14px;' + _inputSt + '">';
      h += '<span style="font-size:13px;color:' + MUTED + ';">FPM</span></div>';
    }
    ct.innerHTML = h;
  }

  function _hwBuildGrid() {
    var ct = document.getElementById('hwTGridCt'); if (!ct) return;
    var h = '';
    if (_hwShape === 'round') {
      var ds = document.getElementById('hwTDiaS'), dia = ds ? parseFloat(ds.value) : 12;
      var dv = document.getElementById('hwTDiaV'); if (dv) dv.textContent = dia + '"';
      var np = _getTraverseCount(dia);
      var pi = document.getElementById('hwTPtInfo'); if (pi) pi.textContent = 'ASHRAE: ' + np + ' puntos para ' + dia + '"';
      while (_hwPoints.length < np) _hwPoints.push(0);
      while (_hwPoints.length > np) _hwPoints.pop();
      h += _drawCircleGrid('hw', np, _hwPoints);
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      for (var i = 0; i < np; i++) {
        h += '<div style="display:flex;align-items:center;gap:4px;"><span style="font-size:13px;color:' + MUTED + ';width:20px;">P' + (i+1) + '</span>';
        h += '<input type="number" id="hwPt' + i + '" value="' + (_hwPoints[i] > 0 ? _hwPoints[i] : '') + '" min="0" max="5000" placeholder="FPM" oninput="window._hwTSetPt(' + i + ')" style="flex:1;padding:6px 8px;font-size:12px;min-width:0;' + _inputSt + '"></div>';
      }
      h += '</div>';
    } else {
      var wS = document.getElementById('hwTWS'), hS = document.getElementById('hwTHS');
      var w = wS ? parseFloat(wS.value) : 12, ht = hS ? parseFloat(hS.value) : 8;
      var wv = document.getElementById('hwTWV'); if (wv) wv.textContent = w + '"';
      var hv = document.getElementById('hwTHV'); if (hv) hv.textContent = ht + '"';
      var cols = w <= 12 ? 3 : (w <= 24 ? 4 : 5), rows = ht <= 12 ? 3 : (ht <= 24 ? 4 : 5);
      var tp = cols * rows;
      while (_hwPoints.length < tp) _hwPoints.push(0);
      while (_hwPoints.length > tp) _hwPoints.pop();
      h += _drawRectGrid('hw', cols, rows, w, ht, _hwPoints);
      h += '<div style="text-align:center;font-size:13px;color:' + MUTED + ';margin-bottom:8px;">' + cols + '\u00D7' + rows + ' = ' + tp + ' puntos</div>';
      var gc = Math.min(cols, 3);
      h += '<div style="display:grid;grid-template-columns:repeat(' + gc + ',1fr);gap:6px;">';
      for (var j = 0; j < tp; j++) {
        h += '<div style="display:flex;align-items:center;gap:3px;"><span style="font-size:9px;color:' + MUTED + ';width:18px;">' + (j+1) + '</span>';
        h += '<input type="number" id="hwPt' + j + '" value="' + (_hwPoints[j] > 0 ? _hwPoints[j] : '') + '" min="0" max="5000" placeholder="FPM" oninput="window._hwTSetPt(' + j + ')" style="flex:1;padding:5px 6px;font-size:11px;min-width:0;' + _inputSt + '"></div>';
      }
      h += '</div>';
    }
    ct.innerHTML = h;
  }

  function _hwCalcTrav() {
    var readings = [];
    for (var i = 0; i < _hwPoints.length; i++) { if (_hwPoints[i] > 0) readings.push(_hwPoints[i]); }
    _setId('hwTMeas', readings.length + '/' + _hwPoints.length);
    if (readings.length === 0) {
      _setIds(['hwTAvgV','hwTCFM','hwDevVel','hwDevCFM'], '--');
      var ai = document.getElementById('hwTAreaI'); if (ai) ai.innerHTML = '';
      return;
    }
    var sum = 0; for (var j = 0; j < readings.length; j++) sum += readings[j]; var avg = sum / readings.length;
    _setId('hwTAvgV', Math.round(avg)); _setId('hwDevVel', Math.round(avg));
    var area = 0;
    if (_hwShape === 'round') { var ds = document.getElementById('hwTDiaS'); var dia = ds ? parseFloat(ds.value) : 12; area = Math.PI * Math.pow(dia / 24, 2); }
    else { var wS = document.getElementById('hwTWS'), hS = document.getElementById('hwTHS'); area = ((wS ? parseFloat(wS.value) : 12) * (hS ? parseFloat(hS.value) : 8)) / 144; }
    var cfm = avg * area;
    _setId('hwTCFM', Math.round(cfm)); _setId('hwDevCFM', Math.round(cfm));
    var ai2 = document.getElementById('hwTAreaI');
    if (ai2) ai2.innerHTML = '<div style="font-size:13px;color:' + MUTED + ';">\u00C1rea: ' + area.toFixed(4) + ' ft\u00B2 | ' + Math.round(avg) + ' FPM \u00D7 ' + area.toFixed(4) + ' = ' + Math.round(cfm) + ' CFM</div>';
  }

  // ============================
  // TAB 2: FLOWHOOD / CAPTURE HOOD (EBT731)
  // ============================
  function _renderFlowhood(c) {
    var h = '';
    // EBT731 LCD
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:320px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;"><div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">ALNOR EBT731</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">BALOMETER / CAPTURE HOOD</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 12px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += _lcdRow('fhDvCFM', 'CFM', '0', '', 28);
    h += _lcdSep() + _lcdRow('fhDvFPM', 'FPM', '0', '', 18);
    h += _lcdSep() + _lcdRow('fhDvTemp', '\u00B0F DB', '72.0', '', 18);
    h += _lcdSep() + _lcdRow('fhDvRH', '%RH', '50', '', 18);
    h += _lcdSep() + _lcdRow('fhDvWB', '\u00B0F WB', '--', '', 18);
    h += _lcdSep() + _lcdRow('fhDvDP', '\u00B0F DP', '--', '', 18);
    h += '</div></div></div>';

    // Hood size
    h += _card(_t('an_hood_size','\uD83D\uDCE6 TAMA\u00D1O DEL HOOD'), '' +
      '<div style="display:flex;gap:6px;">' +
      '<button id="fhS22" onclick="window._fhSize(2,2)" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + ACCENT + ';background:rgba(255,107,53,0.15);color:' + ACCENT + ';font-weight:700;font-size:13px;cursor:pointer;">2\u00D72 ft</button>' +
      '<button id="fhS24" onclick="window._fhSize(2,4)" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:13px;cursor:pointer;">2\u00D74 ft</button></div>' +
      '<div id="fhHoodA" style="margin-top:8px;text-align:center;font-size:13px;color:#111111;">Hood: <b>4 ft\u00B2</b> (2\u00D72 ft)</div>'
    );

    // CFM
    h += _card(_t('an_cfm_reading','\uD83D\uDCA8 CFM READING'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">CFM</span>' +
      '<span id="fhCfmV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">200 CFM</span></div>' +
      _slider('fhCfmS', 0, 2000, 200, 5, 'window._fhUp()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>0</span><span>2,000 CFM</span></div>'
    );

    // K-factor
    h += _card(_t('an_kfactor','\uD83D\uDD27 K-FACTOR (Backpressure Correction)'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">K-Factor</span>' +
      '<span id="fhKV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">1.00</span></div>' +
      _slider('fhKS', 0.90, 1.10, 1.00, 0.01, 'window._fhUp()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>0.90</span><span>1.10</span></div>' +
      '<div id="fhCorrCFM" style="margin-top:8px;text-align:center;"></div>'
    );

    // Temperature
    h += _card(_t('an_air_temp','\uD83C\uDF21\uFE0F TEMPERATURA DEL AIRE'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Dry Bulb</span>' +
      '<span id="fhTmpV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">72.0\u00B0F</span></div>' +
      _slider('fhTmpS', 40, 120, 72, 0.5, 'window._fhUp()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>40\u00B0F</span><span>120\u00B0F</span></div>'
    );

    // RH
    h += _card(_t('an_relative_humidity','\uD83D\uDCA7 HUMEDAD RELATIVA'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">%RH</span>' +
      '<span id="fhRhV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">50%</span></div>' +
      _slider('fhRhS', 10, 95, 50, 1, 'window._fhUp()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>10%</span><span>95%</span></div>'
    );

    // Psychrometric results
    h += _card(_t('an_psychrometric','\uD83D\uDCCA LECTURAS PSICROM\u00C9TRICAS'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
      _statBox('fhWB', 'WET BULB', null, '\u00B0F') + _statBox('fhDP', 'DEW POINT', null, '\u00B0F') + _statBox('fhVel', 'VELOCITY', ACCENT, 'FPM') +
      '</div><div id="fhBadges" style="margin-top:10px;text-align:center;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;"></div>'
    );

    // Reference
    h += _card(_t('an_ref_flowhood','\uD83D\uDCD6 REFERENCIA \u2014 FLOWHOOD'), '' +
      '<div style="font-size:13px;line-height:1.8;color:#111111;">' +
      '<div>' + _t('an_fh_step1','\u2022 Colocar hood directamente sobre el registro') + '</div>' +
      '<div>' + _t('an_fh_step2','\u2022 Sellar bordes para lectura precisa') + '</div>' +
      '<div>' + _t('an_fh_step3','\u2022 K-factor corrige backpressure del hood') + '</div>' +
      '<div>' + _t('an_fh_step4','\u2022 Rango residencial: 50\u2013300 CFM por registro') + '</div></div>'
    );

    // AI
    h += _anAIButton('fhIA', _t('an_ai_flowhood','\uD83E\uDD16 Diagn\u00F3stico Flowhood con IA'), 'window._fhDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(2);
    c.innerHTML = h;

    var _fhW = 2, _fhH = 2;
    window._fhSize = function(w, ht) {
      _fhW = w; _fhH = ht;
      var b22 = document.getElementById('fhS22'), b24 = document.getElementById('fhS24');
      if (b22) { b22.style.borderColor = (w===2&&ht===2)?ACCENT:'rgba(0,0,0,0.1)'; b22.style.background = (w===2&&ht===2)?'rgba(255,107,53,0.15)':'transparent'; b22.style.color = (w===2&&ht===2)?ACCENT:MUTED; }
      if (b24) { b24.style.borderColor = (w===2&&ht===4)?ACCENT:'rgba(0,0,0,0.1)'; b24.style.background = (w===2&&ht===4)?'rgba(255,107,53,0.15)':'transparent'; b24.style.color = (w===2&&ht===4)?ACCENT:MUTED; }
      window._fhUp();
    };

    window._fhUp = function() {
      var cfm = parseFloat(document.getElementById('fhCfmS').value);
      var kf = parseFloat(document.getElementById('fhKS').value);
      var temp = parseFloat(document.getElementById('fhTmpS').value);
      var rh = parseFloat(document.getElementById('fhRhS').value);
      _setId('fhCfmV', Math.round(cfm) + ' CFM');
      _setId('fhKV', kf.toFixed(2));
      _setId('fhTmpV', temp.toFixed(1) + '\u00B0F');
      _setId('fhRhV', Math.round(rh) + '%');
      var corr = cfm * kf;
      var hoodA = _fhW * _fhH;
      var vel = hoodA > 0 ? corr / hoodA : 0;
      var hEl = document.getElementById('fhHoodA');
      if (hEl) hEl.innerHTML = 'Hood: <b>' + hoodA + ' ft\u00B2</b> (' + _fhW + '\u00D7' + _fhH + ' ft)';
      var cEl = document.getElementById('fhCorrCFM');
      if (cEl) cEl.innerHTML = 'Corrected CFM: <span style="font-family:' + LCD + ';font-weight:900;font-size:18px;color:#111111;">' + Math.round(corr) + '</span>';
      var wb = _calcWetBulb(temp, rh), dp = _calcDewPoint(temp, rh);
      _setId('fhDvCFM', Math.round(corr)); _setId('fhDvFPM', Math.round(vel));
      _setId('fhDvTemp', temp.toFixed(1)); _setId('fhDvRH', Math.round(rh));
      _setId('fhDvWB', wb.toFixed(1)); _setId('fhDvDP', dp.toFixed(1));
      _setId('fhWB', wb.toFixed(1)); _setId('fhDP', dp.toFixed(1)); _setId('fhVel', Math.round(vel));
      var badges = document.getElementById('fhBadges');
      if (badges) {
        var bh = '';
        bh += corr < 50 ? _statusBadge('',_t('an_cfm_low','CFM Bajo'),RED) : (corr <= 300 ? _statusBadge('',_t('an_cfm_normal','CFM Normal'),GREEN) : _statusBadge('',_t('an_cfm_high','CFM Alto'),YELLOW));
        bh += (temp >= 55 && temp <= 85) ? _statusBadge('',_t('an_temp_normal','Temp Normal'),GREEN) : _statusBadge('',_t('an_temp_out_range','Temp Fuera Rango'),YELLOW);
        bh += (rh >= 30 && rh <= 60) ? _statusBadge('',_t('an_rh_normal','RH Normal'),GREEN) : (rh < 30 ? _statusBadge('',_t('an_rh_low','RH Bajo'),YELLOW) : _statusBadge('',_t('an_rh_high','RH Alto'),RED));
        badges.innerHTML = bh;
      }
    };
    window._fhUp();

    window._fhDiagnose = function() {
      var cfm = parseFloat(document.getElementById('fhCfmS').value);
      var kf = parseFloat(document.getElementById('fhKS').value);
      var temp = parseFloat(document.getElementById('fhTmpS').value);
      var rh = parseFloat(document.getElementById('fhRhS').value);
      var corr = cfm * kf, wb = _calcWetBulb(temp, rh), dp = _calcDewPoint(temp, rh);
      var p = 'Analiza lecturas Flowhood (Alnor EBT731):\n\nCFM directo: ' + Math.round(cfm) + '\nK-factor: ' + kf.toFixed(2) + '\nCFM corregido: ' + Math.round(corr) + '\nDry Bulb: ' + temp.toFixed(1) + '\u00B0F\nRH: ' + Math.round(rh) + '%\nWet Bulb: ' + wb.toFixed(1) + '\u00B0F\nDew Point: ' + dp.toFixed(1) + '\u00B0F\n\n\u00BFCondiciones normales? \u00BFRiesgo de condensaci\u00F3n? \u00BFCFM adecuado? Recomienda acciones.';
      _anCallIA(p, 'fhIAResult', 'fhIA');
    };
  }

  // ============================
  // TAB 3: PITOT TUBE + MANOMETER
  // ============================
  function _renderPitot(c) {
    var h = '';
    // Mode toggle
    h += _card(_t('an_measurement_mode','\uD83D\uDCCF MODO DE MEDICI\u00D3N'), '<div style="display:flex;gap:6px;">' +
      _togBtn('window._ptSetMode(\'single\')', '\u2022 Single Point', _ptMode === 'single') +
      _togBtn('window._ptSetMode(\'traverse\')', '\uD83D\uDD32 Traverse', _ptMode === 'traverse') + '</div>');

    // Manometer LCD
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;"><div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">MANOMETER</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">PITOT TUBE \u2014 VELOCITY PRESSURE</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += _lcdRow('ptDvVP', 'VP', '0.000', 'in.WC', 26);
    h += _lcdSep() + _lcdRow('ptDvVel', 'VEL', '0', 'FPM', 22);
    h += _lcdSep() + _lcdRow('ptDvCFM', 'CFM', '0', '', 22);
    h += '</div></div></div>';

    if (_ptMode === 'single') {
      // VP slider
      h += _card(_t('an_velocity_pressure','\uD83D\uDCCA VELOCITY PRESSURE (VP)'), '' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
        '<span style="font-size:13px;color:' + MUTED + ';">VP</span>' +
        '<span id="ptVPV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">0.100 in.WC</span></div>' +
        _slider('ptVPS', 0, 2.0, 0.1, 0.001, 'window._ptSUp()') +
        '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>0</span><span>2.0 in.WC</span></div>' +
        '<div id="ptVelDisp" style="margin-top:8px;text-align:center;font-size:14px;font-weight:700;color:#111111;"></div>'
      );

      // Duct
      h += _card(_t('an_duct','\uD83D\uDD32 DUCTO'), '' +
        '<div style="display:flex;gap:6px;margin-bottom:10px;">' +
        _togBtn('window._ptSetShape(\'round\')', _t('an_round','\u2B55 Redondo'), _ptShape === 'round') +
        _togBtn('window._ptSetShape(\'rect\')', _t('an_rect','\u25AC Rect'), _ptShape === 'rect') + '</div>' +
        '<div id="ptDuctIn"></div>' +
        '<div id="ptAreaD" style="margin-top:8px;text-align:center;font-size:13px;color:#111111;"></div>'
      );

      // CFM result
      h += _card(_t('an_cfm_calculated','\uD83C\uDFAF CFM CALCULADO'), '' +
        _lcdDisplay('ptCFM', '0', 'CFM', 42) +
        '<div style="margin-top:8px;font-size:13px;color:' + MUTED + ';text-align:center;">V = 4005 \u00D7 \u221AVP &nbsp;|&nbsp; CFM = V \u00D7 Area</div>'
      );
    } else {
      // Traverse mode
      h += _card(_t('an_duct_shape','\uD83D\uDD32 FORMA DEL DUCTO'), '<div style="display:flex;gap:6px;">' +
        _togBtn('window._ptSetShape(\'round\')', _t('an_round','\u2B55 Redondo'), _ptShape === 'round') +
        _togBtn('window._ptSetShape(\'rect\')', _t('an_rectangular','\u25AC Rectangular'), _ptShape === 'rect') + '</div>');
      if (_ptShape === 'round') {
        h += _card(_t('an_diameter','\uD83D\uDCD0 DI\u00C1METRO'), '' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Di\u00E1metro</span>' +
          '<span id="ptTDiaV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">12"</span></div>' +
          _slider('ptTDiaS', 6, 48, 12, 1, 'window._ptTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>6"</span><span>48"</span></div>' +
          '<div id="ptTPtInfo" style="margin-top:8px;font-size:13px;color:' + MUTED + ';text-align:center;"></div>'
        );
      } else {
        h += _card(_t('an_dimensions','\uD83D\uDCD0 DIMENSIONES (W \u00D7 H)'), '' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Ancho (W)</span>' +
          '<span id="ptTWV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">12"</span></div>' +
          _slider('ptTWS', 4, 48, 12, 1, 'window._ptTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';margin-bottom:10px;"><span>4"</span><span>48"</span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Alto (H)</span>' +
          '<span id="ptTHV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">8"</span></div>' +
          _slider('ptTHS', 4, 48, 8, 1, 'window._ptTBuild()') +
          '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>4"</span><span>48"</span></div>'
        );
      }
      h += _card(_t('an_vp_points','\uD83C\uDFAF PUNTOS VP (Velocity Pressure in.WC)'), '' +
        '<div id="ptTGridCt"></div>' +
        '<div style="margin-top:8px;text-align:center;">' +
        '<button onclick="window._ptTClear()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(0,0,0,0.1);background:rgba(0,0,0,0.03);color:' + MUTED + ';font-size:11px;cursor:pointer;">' + _t('an_clear_all','Limpiar Todo') + '</button></div>'
      );
      h += _card(_t('an_traverse_result','\uD83D\uDCCB RESULTADO TRAVERSE'), '' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        _statBox('ptTMeas', _t('an_points_measured','PUNTOS MEDIDOS')) + _statBox('ptTAvgV', 'AVG VELOCITY', ACCENT) +
        '</div>' + _lcdDisplay('ptTCFM', '--', 'CFM', 42) +
        '<div style="text-align:center;" id="ptTAreaI"></div>'
      );
    }

    // Reference
    h += _card(_t('an_ref_pitot','\uD83D\uDCD6 REFERENCIA \u2014 PITOT TUBE'), '' +
      '<div style="font-size:13px;line-height:1.8;color:#111111;">' +
      '<div style="margin-bottom:6px;"><b style="color:#111111;">Total P = Static P + Velocity P</b></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">' +
      '<div style="color:' + MUTED + ';">V = 4005\u00D7\u221AVP</div><div>Standard air (70\u00B0F)</div>' +
      '<div style="color:' + MUTED + ';">VP 0.01</div><div>= 400 FPM</div>' +
      '<div style="color:' + MUTED + ';">VP 0.10</div><div>= 1,266 FPM</div>' +
      '<div style="color:' + MUTED + ';">VP 0.25</div><div>= 2,003 FPM</div>' +
      '<div style="color:' + MUTED + ';">VP 1.00</div><div>= 4,005 FPM</div></div>' +
      '<div style="margin-top:6px;font-size:13px;color:' + MUTED + ';">\u2022 Insertar pitot con abertura hacia el flujo<br>\u2022 M\u00EDnimo 7.5D de ducto recto antes del punto</div></div>'
    );

    // AI
    h += _anAIButton('ptIA', _t('an_ai_pitot','\uD83E\uDD16 Diagn\u00F3stico Pitot Tube con IA'), 'window._ptDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(3);
    c.innerHTML = h;

    window._ptSetMode = function(m) { _ptMode = m; _ptPoints = []; var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s); };
    window._ptSetShape = function(sh) { _ptShape = sh; _ptPoints = []; var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s); };

    window._ptSUp = function() {
      var vps = document.getElementById('ptVPS'), vp = vps ? parseFloat(vps.value) : 0.1;
      var vel = 4005 * Math.sqrt(vp);
      _setId('ptVPV', vp.toFixed(3) + ' in.WC');
      _setId('ptDvVP', vp.toFixed(3)); _setId('ptDvVel', Math.round(vel));
      var vd = document.getElementById('ptVelDisp');
      if (vd) vd.innerHTML = 'Velocity: <span style="color:' + ACCENT + ';font-family:' + LCD + ';">' + Math.round(vel) + ' FPM</span>';
      var area = _ptGetArea();
      var aEl = document.getElementById('ptAreaD');
      if (aEl) aEl.innerHTML = '\u00C1rea: <b>' + area.toFixed(4) + ' ft\u00B2</b>';
      var cfm = vel * area;
      _setId('ptCFM', Math.round(cfm)); _setId('ptDvCFM', Math.round(cfm));
    };

    window._ptTBuild = function() { _ptPoints = []; _ptBuildGrid(); _ptCalcTrav(); };
    window._ptTSetPt = function(idx) {
      var el = document.getElementById('ptPt' + idx); if (el) _ptPoints[idx] = parseFloat(el.value) || 0;
      var dot = document.getElementById('ptDot' + idx);
      if (dot) { dot.style.background = _ptPoints[idx] > 0 ? GREEN : '#334155'; dot.style.borderColor = _ptPoints[idx] > 0 ? GREEN : '#475569'; }
      _ptCalcTrav();
    };
    window._ptTClear = function() { for (var i = 0; i < _ptPoints.length; i++) _ptPoints[i] = 0; _ptBuildGrid(); _ptCalcTrav(); };

    if (_ptMode === 'single') { _ptBuildDuctIn(); window._ptSUp(); }
    else { _ptBuildGrid(); }

    window._ptDiagnose = function() {
      var p = '';
      if (_ptMode === 'single') {
        var vp = parseFloat(document.getElementById('ptVPS').value), vel = 4005 * Math.sqrt(vp), area = _ptGetArea(), cfm = vel * area;
        p = 'Analiza medici\u00F3n Pitot Tube:\n\nVP: ' + vp.toFixed(3) + ' in.WC\nVelocidad: ' + Math.round(vel) + ' FPM\n\u00C1rea: ' + area.toFixed(4) + ' ft\u00B2\nCFM: ' + Math.round(cfm) + '\n\n\u00BFVP normal para ducto residencial? Explica Total P = Static P + VP.';
      } else {
        var tr = []; for (var i = 0; i < _ptPoints.length; i++) { if (_ptPoints[i] > 0) tr.push(_ptPoints[i]); }
        var dim = _ptShape === 'round' ? 'Di\u00E1metro: ' + (document.getElementById('ptTDiaS') ? document.getElementById('ptTDiaS').value : '12') + '"' :
          'W: ' + (document.getElementById('ptTWS') ? document.getElementById('ptTWS').value : '12') + '" \u00D7 H: ' + (document.getElementById('ptTHS') ? document.getElementById('ptTHS').value : '8') + '"';
        p = 'Analiza Pitot Tube traverse:\nForma: ' + (_ptShape === 'round' ? 'Redondo' : 'Rectangular') + '\n' + dim + '\nVP readings (in.WC): ' + (tr.length > 0 ? tr.map(function(v){return v.toFixed(3);}).join(', ') : 'Sin datos') + '\n\n\u00BFLecturas VP consistentes? \u00BFTurbulencia? Procedimiento correcto.';
      }
      _anCallIA(p, 'ptIAResult', 'ptIA');
    };
  }

  function _ptBuildDuctIn() {
    var ct = document.getElementById('ptDuctIn'); if (!ct) return;
    var h = '';
    if (_ptShape === 'round') {
      h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
      h += '<span style="font-size:13px;color:' + MUTED + ';">Di\u00E1metro</span>';
      h += '<span id="ptDiaV" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">12"</span></div>';
      h += _slider('ptDiaS', 4, 48, 12, 1, 'window._ptSUp()');
      h += '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>4"</span><span>48"</span></div>';
    } else {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
      h += '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Ancho (W)"</div>';
      h += '<input type="number" id="ptDW" value="12" min="4" max="48" oninput="window._ptSUp()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div>';
      h += '<div><div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">Alto (H)"</div>';
      h += '<input type="number" id="ptDH" value="8" min="4" max="48" oninput="window._ptSUp()" style="width:100%;padding:8px;font-size:14px;' + _inputSt + '"></div></div>';
    }
    ct.innerHTML = h;
  }

  function _ptGetArea() {
    if (_ptShape === 'round') {
      var ds = document.getElementById('ptDiaS'), dia = ds ? parseFloat(ds.value) : 12;
      var dv = document.getElementById('ptDiaV'); if (dv) dv.textContent = dia + '"';
      return Math.PI * Math.pow(dia / 24, 2);
    }
    var wE = document.getElementById('ptDW'), hE = document.getElementById('ptDH');
    return ((wE ? parseFloat(wE.value) : 12) * (hE ? parseFloat(hE.value) : 8)) / 144;
  }

  function _ptBuildGrid() {
    var ct = document.getElementById('ptTGridCt'); if (!ct) return;
    var h = '';
    if (_ptShape === 'round') {
      var ds = document.getElementById('ptTDiaS'), dia = ds ? parseFloat(ds.value) : 12;
      var dv = document.getElementById('ptTDiaV'); if (dv) dv.textContent = dia + '"';
      var np = _getTraverseCount(dia);
      var pi = document.getElementById('ptTPtInfo'); if (pi) pi.textContent = 'ASHRAE: ' + np + ' puntos para ' + dia + '"';
      while (_ptPoints.length < np) _ptPoints.push(0);
      while (_ptPoints.length > np) _ptPoints.pop();
      h += _drawCircleGrid('pt', np, _ptPoints);
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      for (var i = 0; i < np; i++) {
        h += '<div style="display:flex;align-items:center;gap:4px;"><span style="font-size:13px;color:' + MUTED + ';width:20px;">P' + (i+1) + '</span>';
        h += '<input type="number" id="ptPt' + i + '" value="' + (_ptPoints[i] > 0 ? _ptPoints[i] : '') + '" min="0" max="2" step="0.001" placeholder="in.WC" oninput="window._ptTSetPt(' + i + ')" style="flex:1;padding:6px 8px;font-size:12px;min-width:0;' + _inputSt + '"></div>';
      }
      h += '</div>';
    } else {
      var wS = document.getElementById('ptTWS'), hS = document.getElementById('ptTHS');
      var w = wS ? parseFloat(wS.value) : 12, ht = hS ? parseFloat(hS.value) : 8;
      var wv = document.getElementById('ptTWV'); if (wv) wv.textContent = w + '"';
      var hv = document.getElementById('ptTHV'); if (hv) hv.textContent = ht + '"';
      var cols = w <= 12 ? 3 : (w <= 24 ? 4 : 5), rows = ht <= 12 ? 3 : (ht <= 24 ? 4 : 5);
      var tp = cols * rows;
      while (_ptPoints.length < tp) _ptPoints.push(0);
      while (_ptPoints.length > tp) _ptPoints.pop();
      h += _drawRectGrid('pt', cols, rows, w, ht, _ptPoints);
      h += '<div style="text-align:center;font-size:13px;color:' + MUTED + ';margin-bottom:8px;">' + cols + '\u00D7' + rows + ' = ' + tp + ' puntos</div>';
      var gc = Math.min(cols, 3);
      h += '<div style="display:grid;grid-template-columns:repeat(' + gc + ',1fr);gap:6px;">';
      for (var j = 0; j < tp; j++) {
        h += '<div style="display:flex;align-items:center;gap:3px;"><span style="font-size:9px;color:' + MUTED + ';width:18px;">' + (j+1) + '</span>';
        h += '<input type="number" id="ptPt' + j + '" value="' + (_ptPoints[j] > 0 ? _ptPoints[j] : '') + '" min="0" max="2" step="0.001" placeholder="in.WC" oninput="window._ptTSetPt(' + j + ')" style="flex:1;padding:5px 6px;font-size:11px;min-width:0;' + _inputSt + '"></div>';
      }
      h += '</div>';
    }
    ct.innerHTML = h;
  }

  function _ptCalcTrav() {
    var readings = [], velocities = [];
    for (var i = 0; i < _ptPoints.length; i++) { if (_ptPoints[i] > 0) { readings.push(_ptPoints[i]); velocities.push(4005 * Math.sqrt(_ptPoints[i])); } }
    _setId('ptTMeas', readings.length + '/' + _ptPoints.length);
    if (readings.length === 0) {
      _setIds(['ptTAvgV','ptTCFM','ptDvVP','ptDvVel','ptDvCFM'], '--');
      var ai = document.getElementById('ptTAreaI'); if (ai) ai.innerHTML = '';
      return;
    }
    var sumVP = 0; for (var j = 0; j < readings.length; j++) sumVP += readings[j]; var avgVP = sumVP / readings.length;
    var sumV = 0; for (var k = 0; k < velocities.length; k++) sumV += velocities[k]; var avgV = sumV / velocities.length;
    _setId('ptTAvgV', Math.round(avgV)); _setId('ptDvVP', avgVP.toFixed(3)); _setId('ptDvVel', Math.round(avgV));
    var area = 0;
    if (_ptShape === 'round') { var ds = document.getElementById('ptTDiaS'); var dia = ds ? parseFloat(ds.value) : 12; area = Math.PI * Math.pow(dia / 24, 2); }
    else { var wS = document.getElementById('ptTWS'), hS = document.getElementById('ptTHS'); area = ((wS ? parseFloat(wS.value) : 12) * (hS ? parseFloat(hS.value) : 8)) / 144; }
    var cfm = avgV * area;
    _setId('ptTCFM', Math.round(cfm)); _setId('ptDvCFM', Math.round(cfm));
    var ai2 = document.getElementById('ptTAreaI');
    if (ai2) ai2.innerHTML = '<div style="font-size:13px;color:' + MUTED + ';">Avg VP: ' + avgVP.toFixed(3) + ' \u2192 ' + Math.round(avgV) + ' FPM \u00D7 ' + area.toFixed(4) + ' ft\u00B2 = ' + Math.round(cfm) + ' CFM</div>';
  }

  // ============================
  // TAB 4: REGISTER BALANCING (KEPT)
  // ============================
  function _renderRegBalancing(c) {
    var h = '';
    h += _card(_t('an_total_cfm','\uD83C\uDFE0 CFM TOTAL DEL SISTEMA'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Total CFM (Manual J / Nameplate)</span>' +
      '<span id="anBalTotalVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">1200 CFM</span></div>' +
      _slider('anBalTotalSlider', 200, 5000, 1200, 50, 'window._anBalUpdate()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>200</span><span>5,000 CFM</span></div>' +
      '<div style="margin-top:6px;text-align:center;font-size:13px;color:' + MUTED + ';">' + _t('an_rule_400cfm','Regla: 400 CFM por tonelada de capacidad') + '</div>'
    );

    h += _card(_t('an_number_registers','\uD83D\uDCCB N\u00DAMERO DE REGISTROS'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Registros</span>' +
      '<span id="anBalCountVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">' + _balCount + '</span></div>' +
      _slider('anBalCountSlider', 2, 20, _balCount, 1, 'window._anBalSetCount()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>2</span><span>20</span></div>'
    );

    h += _card(_t('an_balance_per_reg','\u2696\uFE0F BALANCE POR REGISTRO'), '<div id="anBalRegistersContainer"></div>');

    h += _card(_t('an_balance_score','\uD83C\uDFAF SYSTEM BALANCE SCORE'), '' +
      '<div style="text-align:center;">' +
      '<div id="anBalScoreLCD" style="font-family:' + LCD + ';font-size:48px;font-weight:900;color:#111111;letter-spacing:2px;">--</div>' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;">' + _t('an_balance_score_desc','% Balance Score (100% = perfecto)') + '</div>' +
      '<div id="anBalScoreStatus" style="margin-bottom:8px;"></div></div>' +
      '<div id="anBalBarChart"></div>' +
      '<div style="margin-top:8px;font-size:9px;color:' + MUTED + ';text-align:center;">Verde: \u00B110% | Amarillo: \u00B110-20% | Rojo: >20% desviaci\u00F3n</div>'
    );

    h += _card(_t('an_balance_procedure','\uD83D\uDCD6 PROCEDIMIENTO DE BALANCEO'), '' +
      '<div style="font-size:13px;line-height:1.9;color:#111111;">' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">1.</span> ' + _t('an_bal_step1','Medir CFM en cada registro con anem\u00F3metro/balometer') + '</div>' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">2.</span> ' + _t('an_bal_step2','Comparar vs. CFM requerido por Manual J') + '</div>' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">3.</span> ' + _t('an_bal_step3','Empezar por el registro m\u00E1s lejano del equipo') + '</div>' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">4.</span> ' + _t('an_bal_step4','Ajustar dampers \u2014 cerrar en registros con exceso') + '</div>' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">5.</span> ' + _t('an_bal_step5','Re-medir todos despu\u00E9s de cada ajuste') + '</div>' +
      '<div><span style="color:' + ACCENT + ';font-weight:700;">6.</span> ' + _t('an_bal_step6','Objetivo: todos dentro de \u00B110% del requerido') + '</div></div>'
    );

    h += _anAIButton('anBalIA', _t('an_ai_balance','\uD83E\uDD16 Diagn\u00F3stico de Balance con IA'), 'window._anBalDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(4);
    c.innerHTML = h;
    _anBuildRegisterInputs();

    window._anBalSetCount = function() {
      var slider = document.getElementById('anBalCountSlider');
      _balCount = slider ? parseInt(slider.value) : 4;
      var countEl = document.getElementById('anBalCountVal');
      if (countEl) countEl.textContent = _balCount;
      while (_balRegisters.length < _balCount) _balRegisters.push({ name: '', required: 0, measured: 0 });
      while (_balRegisters.length > _balCount) _balRegisters.pop();
      _anBuildRegisterInputs();
      window._anBalUpdate();
    };

    window._anBalUpdate = function() {
      var totalSlider = document.getElementById('anBalTotalSlider');
      var totalCFM = totalSlider ? parseFloat(totalSlider.value) : 1200;
      var totalEl = document.getElementById('anBalTotalVal');
      if (totalEl) totalEl.textContent = Math.round(totalCFM) + ' CFM';
      var totalRequired = 0, totalMeasured = 0, deviations = [];
      for (var i = 0; i < _balCount; i++) {
        var nameEl = document.getElementById('anBalName' + i);
        var reqEl = document.getElementById('anBalReq' + i);
        var measEl = document.getElementById('anBalMeas' + i);
        _balRegisters[i] = {
          name: nameEl ? nameEl.value : '',
          required: reqEl ? parseFloat(reqEl.value) || 0 : 0,
          measured: measEl ? parseFloat(measEl.value) || 0 : 0
        };
        var req = _balRegisters[i].required, meas = _balRegisters[i].measured;
        totalRequired += req; totalMeasured += meas;
        var devEl = document.getElementById('anBalDev' + i);
        if (devEl) {
          if (req > 0 && meas > 0) {
            var dev = ((meas - req) / req) * 100;
            deviations.push(Math.abs(dev));
            var devColor = Math.abs(dev) <= 10 ? GREEN : (Math.abs(dev) <= 20 ? YELLOW : RED);
            devEl.innerHTML = '<span style="color:' + devColor + ';font-weight:700;">' + (dev >= 0 ? '+' : '') + dev.toFixed(1) + '%</span>';
          } else { devEl.innerHTML = '<span style="color:' + MUTED + ';">--</span>'; }
        }
      }
      var score = 0;
      if (deviations.length > 0) { var sumDev = 0; for (var k = 0; k < deviations.length; k++) sumDev += deviations[k]; score = Math.max(0, 100 - sumDev / deviations.length); }
      var scoreLCD = document.getElementById('anBalScoreLCD');
      if (scoreLCD) scoreLCD.textContent = deviations.length > 0 ? score.toFixed(1) : '--';
      if (scoreLCD && deviations.length > 0) { scoreLCD.style.color = score >= 90 ? GREEN : (score >= 80 ? YELLOW : RED); }
      else if (scoreLCD) { scoreLCD.style.color = '#f8fafc'; }
      var scoreStatus = document.getElementById('anBalScoreStatus');
      if (scoreStatus) {
        if (deviations.length > 0) {
          if (score >= 90) scoreStatus.innerHTML = _statusBadge('', _t('an_excellent_bal','\u2705 Excelente balance'), GREEN);
          else if (score >= 80) scoreStatus.innerHTML = _statusBadge('', _t('an_acceptable_bal','\u26A1 Balance aceptable \u2014 ajuste menor'), YELLOW);
          else scoreStatus.innerHTML = _statusBadge('', _t('an_poor_bal','\u26A0\uFE0F Balance deficiente \u2014 ajustar dampers'), RED);
        } else { scoreStatus.innerHTML = ''; }
      }
      _anBuildBalBarChart(totalRequired, totalMeasured);
    };

    window._anBalDiagnose = function() {
      var totalCFM = parseFloat(document.getElementById('anBalTotalSlider').value);
      var details = '';
      for (var i = 0; i < _balCount; i++) {
        var r = _balRegisters[i];
        if (r.required > 0 || r.measured > 0) details += (r.name || 'Registro ' + (i + 1)) + ': Required=' + r.required + ' CFM, Measured=' + r.measured + ' CFM\n';
      }
      var p = 'Analiza este reporte de balance de registros:\n\nCFM Total del Sistema: ' + totalCFM + '\nN\u00FAmero de registros: ' + _balCount + '\n\nDetalle por registro:\n' + (details || 'Sin datos ingresados') + '\n\n\u00BFEl sistema est\u00E1 balanceado? \u00BFQu\u00E9 registros necesitan ajuste? \u00BFC\u00F3mo ajustar los dampers? Procedimiento paso a paso.';
      _anCallIA(p, 'anBalIAResult', 'anBalIA');
    };
    window._anBalUpdate();
  }

  function _anBuildRegisterInputs() {
    var container = document.getElementById('anBalRegistersContainer'); if (!container) return;
    var h = '';
    h += '<div style="display:grid;grid-template-columns:1fr 65px 65px 55px;gap:6px;margin-bottom:6px;font-size:9px;font-weight:700;color:' + MUTED + ';">';
    h += '<div>CUARTO</div><div style="text-align:center;">REQ</div><div style="text-align:center;">MED</div><div style="text-align:center;">DEV</div></div>';
    var defaultRooms = ['Sala', 'Cocina', 'Dormitorio 1', 'Dormitorio 2', 'Ba\u00F1o', 'Dormitorio 3', 'Oficina', 'Cuarto maestro', 'Comedor', 'Lavander\u00EDa', 'Garaje', 'Pasillo', 'Rec Room', 'S\u00F3tano', 'Cuarto 5', 'Cuarto 6', 'Cuarto 7', 'Cuarto 8', 'Cuarto 9', 'Cuarto 10'];
    for (var i = 0; i < _balCount; i++) {
      var reg = _balRegisters[i] || {};
      var name = reg.name || defaultRooms[i] || '', req = reg.required || '', meas = reg.measured || '';
      h += '<div style="display:grid;grid-template-columns:1fr 65px 65px 55px;gap:6px;margin-bottom:4px;align-items:center;">';
      h += '<input type="text" id="anBalName' + i + '" value="' + name + '" placeholder="Cuarto" style="padding:6px;border-radius:6px;background:#1a2744;color:' + TEXT + ';border:1px solid rgba(255,107,53,0.15);font-size:11px;min-width:0;">';
      h += '<input type="number" id="anBalReq' + i + '" value="' + req + '" placeholder="CFM" min="0" oninput="window._anBalUpdate()" style="padding:6px;border-radius:6px;background:#1a2744;color:' + TEXT + ';border:1px solid rgba(255,107,53,0.15);font-size:11px;text-align:center;min-width:0;">';
      h += '<input type="number" id="anBalMeas' + i + '" value="' + meas + '" placeholder="CFM" min="0" oninput="window._anBalUpdate()" style="padding:6px;border-radius:6px;background:#1a2744;color:' + TEXT + ';border:1px solid rgba(255,107,53,0.15);font-size:11px;text-align:center;min-width:0;">';
      h += '<div id="anBalDev' + i + '" style="text-align:center;font-size:11px;font-family:' + LCD + ';">--</div></div>';
    }
    container.innerHTML = h;
  }

  function _anBuildBalBarChart(totalRequired, totalMeasured) {
    var chart = document.getElementById('anBalBarChart'); if (!chart) return;
    if (totalRequired <= 0 && totalMeasured <= 0) { chart.innerHTML = ''; return; }
    var maxVal = Math.max(totalRequired, totalMeasured, 1);
    var reqW = (totalRequired / maxVal) * 100, measW = (totalMeasured / maxVal) * 100;
    var measColor = totalRequired > 0 ? (Math.abs(totalMeasured - totalRequired) / totalRequired <= 0.1 ? GREEN : (Math.abs(totalMeasured - totalRequired) / totalRequired <= 0.2 ? YELLOW : RED)) : MUTED;
    var h = '<div style="margin-top:10px;">';
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">';
    h += '<span style="font-size:13px;color:' + MUTED + ';width:65px;">Required</span>';
    h += '<div style="flex:1;background:rgba(0,0,0,0.2);border-radius:4px;height:22px;overflow:hidden;">';
    h += '<div style="width:' + reqW + '%;height:100%;background:' + BLUE + ';border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;min-width:30px;">';
    h += '<span style="font-size:9px;font-weight:700;color:#fff;">' + Math.round(totalRequired) + '</span></div></div></div>';
    h += '<div style="display:flex;align-items:center;gap:8px;">';
    h += '<span style="font-size:13px;color:' + MUTED + ';width:65px;">Measured</span>';
    h += '<div style="flex:1;background:rgba(0,0,0,0.2);border-radius:4px;height:22px;overflow:hidden;">';
    h += '<div style="width:' + measW + '%;height:100%;background:' + measColor + ';border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;min-width:30px;">';
    h += '<span style="font-size:9px;font-weight:700;color:#fff;">' + Math.round(totalMeasured) + '</span></div></div></div></div>';
    chart.innerHTML = h;
  }

  // ============================
  // TAB 5: TEMPERATURE / DELTA T / BTU (KEPT)
  // ============================
  function _renderTempDeltaT(c) {
    var h = '';
    h += _card(_t('an_operation_mode','\uD83C\uDF21\uFE0F MODO DE OPERACI\u00D3N'), '' +
      '<div style="display:flex;gap:6px;">' +
      '<button id="anTempCoolBtn" onclick="window._anTempToggleMode(\'cooling\')" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + (_tempMode === 'cooling' ? BLUE : 'rgba(0,0,0,0.1)') + ';background:' + (_tempMode === 'cooling' ? 'rgba(59,130,246,0.15)' : 'transparent') + ';color:' + (_tempMode === 'cooling' ? BLUE : MUTED) + ';font-weight:700;font-size:13px;cursor:pointer;">\u2744\uFE0F Cooling</button>' +
      '<button id="anTempHeatBtn" onclick="window._anTempToggleMode(\'heating\')" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + (_tempMode === 'heating' ? RED : 'rgba(0,0,0,0.1)') + ';background:' + (_tempMode === 'heating' ? 'rgba(239,68,68,0.15)' : 'transparent') + ';color:' + (_tempMode === 'heating' ? RED : MUTED) + ';font-weight:600;font-size:13px;cursor:pointer;">\uD83D\uDD25 Heating</button></div>'
    );

    // Device display
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;"><div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">TEMP ANALYZER</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">\u0394T \u00B7 BTU/h \u00B7 TONNAGE</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">\u0394T</span>';
    h += '<div><span id="anTempDevDT" style="font-family:' + LCD + ';font-size:32px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.4);">20</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">\u00B0F</span></div></div>';
    h += '<div style="border-top:1px solid #1a2a1a;margin:4px 0;"></div>';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">BTU/h</span>';
    h += '<div><span id="anTempDevBTU" style="font-family:' + LCD + ';font-size:24px;font-weight:900;color:#33ff33;letter-spacing:2px;text-shadow:0 0 8px rgba(51,255,51,0.3);">0</span></div></div>';
    h += '</div></div></div>';

    var supDef = _tempMode === 'cooling' ? 55 : 120;
    var supMin = _tempMode === 'cooling' ? 40 : 80;
    var supMax = _tempMode === 'cooling' ? 80 : 160;
    h += _card('\u2744\uFE0F SUPPLY TEMPERATURE', '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('an_supply_temp','Temp. de suministro') + '</span>' +
      '<span id="anTempSupVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">' + supDef + '\u00B0F</span></div>' +
      _slider('anTempSupply', supMin, supMax, supDef, 1, 'window._anTempUpdate()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>' + supMin + '\u00B0F</span><span>' + supMax + '\u00B0F</span></div>'
    );

    var retDef = _tempMode === 'cooling' ? 75 : 70;
    var retMin = _tempMode === 'cooling' ? 60 : 55;
    var retMax = _tempMode === 'cooling' ? 90 : 80;
    h += _card('\uD83D\uDD25 RETURN TEMPERATURE', '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('an_return_temp','Temp. de retorno') + '</span>' +
      '<span id="anTempRetVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">' + retDef + '\u00B0F</span></div>' +
      _slider('anTempReturn', retMin, retMax, retDef, 1, 'window._anTempUpdate()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>' + retMin + '\u00B0F</span><span>' + retMax + '\u00B0F</span></div>'
    );

    h += _card(_t('an_delta_t','\uD83D\uDCCB DELTA T'), '' +
      _lcdDisplay('anTempDT', '--', '\u00B0F', 42) +
      '<div style="text-align:center;" id="anTempDTStatus"></div>' +
      '<div style="margin-top:6px;font-size:13px;color:' + MUTED + ';text-align:center;">\u0394T = ' + (_tempMode === 'cooling' ? 'Return \u2212 Supply' : 'Supply \u2212 Return') + '</div>'
    );

    h += _card(_t('an_system_cfm','\uD83D\uDCA8 CFM DEL SISTEMA'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Airflow (CFM)</span>' +
      '<span id="anTempCFMVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">800 CFM</span></div>' +
      _slider('anTempCFMSlider', 100, 3000, 800, 10, 'window._anTempUpdate()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>100</span><span>3,000 CFM</span></div>'
    );

    h += _card(_t('an_calculated_capacity','\u26A1 CAPACIDAD CALCULADA'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
      '<div style="text-align:center;background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;">' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">BTU/h</div>' +
      '<div id="anTempBTU" style="font-family:' + LCD + ';font-size:26px;font-weight:900;color:#111111;letter-spacing:1px;">--</div></div>' +
      '<div style="text-align:center;background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;">' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">TONS</div>' +
      '<div id="anTempTons" style="font-family:' + LCD + ';font-size:26px;font-weight:900;color:' + ACCENT + ';letter-spacing:1px;">--</div></div></div>' +
      '<div style="margin-top:10px;font-size:13px;color:' + MUTED + ';text-align:center;">BTU/h = CFM \u00D7 1.08 \u00D7 \u0394T &nbsp;|&nbsp; Tons = BTU/h \u00F7 12,000</div>'
    );

    h += _card(_t('an_ref_delta_t','\uD83D\uDCD6 REFERENCIA \u2014 RANGOS NORMALES \u0394T'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11px;line-height:1.8;">' +
      '<div style="color:' + MUTED + ';">Cooling \u0394T</div><div>14\u201322\u00B0F (normal)</div>' +
      '<div style="color:' + MUTED + ';">Cooling <14\u00B0F</div><div style="color:' + YELLOW + ';">High airflow / low charge</div>' +
      '<div style="color:' + MUTED + ';">Cooling >22\u00B0F</div><div style="color:' + RED + ';">Low airflow / dirty filter</div>' +
      '<div style="color:' + MUTED + ';">Heating \u0394T (gas)</div><div>15\u201335\u00B0F (gas furnace)</div>' +
      '<div style="color:' + MUTED + ';">Heat Pump \u0394T</div><div>15\u201325\u00B0F</div>' +
      '<div style="color:' + MUTED + ';">400 CFM/ton</div><div>Regla est\u00E1ndar de dise\u00F1o</div>' +
      '<div style="color:' + MUTED + ';">1 Ton</div><div>12,000 BTU/h</div></div>'
    );

    h += _anAIButton('anTempIA', _t('an_ai_temp','\uD83E\uDD16 Diagn\u00F3stico Temperatura/BTU con IA'), 'window._anTempDiagnose()');
    if (typeof window.hvacPdfBar === 'function') h += window.hvacPdfBar(5);
    c.innerHTML = h;

    window._anTempToggleMode = function(mode) {
      _tempMode = mode;
      var s = document.getElementById('anemometerHvacScreen'); if (s) _render(s);
    };

    window._anTempUpdate = function() {
      var sup = parseFloat(document.getElementById('anTempSupply').value);
      var ret = parseFloat(document.getElementById('anTempReturn').value);
      var cfm = parseFloat(document.getElementById('anTempCFMSlider').value);
      _setId('anTempSupVal', sup + '\u00B0F');
      _setId('anTempRetVal', ret + '\u00B0F');
      _setId('anTempCFMVal', Math.round(cfm) + ' CFM');
      var deltaT = _tempMode === 'cooling' ? (ret - sup) : (sup - ret);
      var absDT = Math.abs(deltaT);
      var btu = cfm * 1.08 * absDT;
      var tons = btu / 12000;
      _setId('anTempDT', absDT.toFixed(1));
      _setId('anTempDevDT', absDT.toFixed(1));
      _setId('anTempDevBTU', _formatNumber(Math.round(btu)));
      _setId('anTempBTU', _formatNumber(Math.round(btu)));
      _setId('anTempTons', tons.toFixed(2));
      var statusEl = document.getElementById('anTempDTStatus');
      if (statusEl) {
        if (_tempMode === 'cooling') {
          if (absDT >= 14 && absDT <= 22) statusEl.innerHTML = _statusBadge('', _t('an_dt_normal_cool','\u2705 \u0394T normal (cooling 14\u201322\u00B0F)'), GREEN);
          else if (absDT < 14) statusEl.innerHTML = _statusBadge('', _t('an_dt_low_cool','\u26A1 \u0394T bajo \u2014 high airflow o low charge'), YELLOW);
          else statusEl.innerHTML = _statusBadge('', _t('an_dt_high_cool','\u26A0\uFE0F \u0394T alto \u2014 low airflow o dirty filter'), RED);
        } else {
          if (absDT >= 15 && absDT <= 35) statusEl.innerHTML = _statusBadge('', _t('an_dt_normal_heat','\u2705 \u0394T normal (heating 15\u201335\u00B0F)'), GREEN);
          else if (absDT < 15) statusEl.innerHTML = _statusBadge('', _t('an_dt_low_heat','\u26A1 \u0394T bajo \u2014 check ignition/gas valve'), YELLOW);
          else statusEl.innerHTML = _statusBadge('', _t('an_dt_high_heat','\u26A0\uFE0F \u0394T alto \u2014 low airflow o over-fire'), RED);
        }
      }
    };
    window._anTempUpdate();

    window._anTempDiagnose = function() {
      var sup = parseFloat(document.getElementById('anTempSupply').value);
      var ret = parseFloat(document.getElementById('anTempReturn').value);
      var cfm = parseFloat(document.getElementById('anTempCFMSlider').value);
      var deltaT = _tempMode === 'cooling' ? (ret - sup) : (sup - ret);
      var btu = cfm * 1.08 * Math.abs(deltaT);
      var tons = btu / 12000;
      var p = 'Analiza estas lecturas de temperatura y capacidad:\n\nModo: ' + (_tempMode === 'cooling' ? 'Cooling' : 'Heating') + '\nSupply: ' + sup + '\u00B0F\nReturn: ' + ret + '\u00B0F\n\u0394T: ' + Math.abs(deltaT).toFixed(1) + '\u00B0F\nCFM: ' + cfm + '\nBTU/h: ' + _formatNumber(Math.round(btu)) + '\nTons: ' + tons.toFixed(2) + '\n\n\u00BFEl \u0394T est\u00E1 normal? \u00BFLa capacidad coincide con la nominal? Explica 400 CFM/ton.';
      _anCallIA(p, 'anTempIAResult', 'anTempIA');
    };
  }

  // ============================
  // SHARED MICRO-HELPERS
  // ============================
  function _setId(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  function _setIds(ids, val) { for (var i = 0; i < ids.length; i++) _setId(ids[i], val); }

  function _statBox(id, label, color, unit) {
    return '<div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">' + label + '</div>' +
      '<div id="' + id + '" style="font-family:' + LCD + ';font-size:20px;font-weight:900;color:' + (color || '#f8fafc') + ';">--</div>' +
      (unit ? '<div style="font-size:9px;color:' + MUTED + ';">' + unit + '</div>' : '<div style="font-size:9px;color:' + MUTED + ';">FPM</div>') + '</div>';
  }

  function _togBtn(onclick, label, active) {
    return '<button onclick="' + onclick + '" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + (active ? ACCENT : 'rgba(0,0,0,0.1)') + ';background:' + (active ? 'rgba(255,107,53,0.15)' : 'transparent') + ';color:' + (active ? ACCENT : MUTED) + ';font-weight:' + (active ? '700' : '600') + ';font-size:13px;cursor:pointer;">' + label + '</button>';
  }

  function _lcdRow(id, label, value, unit, size) {
    return '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:3px 0;">' +
      '<span style="font-size:' + (size > 22 ? '10' : '9') + 'px;color:#4a7a4a;font-weight:600;width:50px;">' + label + '</span>' +
      '<div><span id="' + id + '" style="font-family:' + LCD + ';font-size:' + size + 'px;font-weight:900;color:#33ff33;letter-spacing:2px;text-shadow:0 0 8px rgba(51,255,51,0.4);">' + value + '</span>' +
      (unit ? '<span style="font-size:9px;color:#4a7a4a;margin-left:4px;">' + unit + '</span>' : '') + '</div></div>';
  }
  function _lcdSep() { return '<div style="border-top:1px solid #1a2a1a;margin:2px 0;"></div>'; }

  function _drawCircleGrid(prefix, numPoints, points) {
    var h = '<div style="position:relative;width:160px;height:160px;margin:0 auto 12px;border:2px solid ' + ACCENT + ';border-radius:50%;background:rgba(255,107,53,0.05);">';
    h += '<div style="position:absolute;top:50%;left:5%;width:90%;height:1px;background:rgba(255,107,53,0.2);"></div>';
    h += '<div style="position:absolute;left:50%;top:5%;width:1px;height:90%;background:rgba(255,107,53,0.2);"></div>';
    var ppd = numPoints / 2;
    for (var d = 0; d < 2; d++) {
      for (var p = 0; p < ppd; p++) {
        var frac = (p + 1) / (ppd + 1);
        var idx = d * ppd + p;
        var dc = points[idx] > 0 ? GREEN : '#334155';
        var db = points[idx] > 0 ? GREEN : '#475569';
        var cx = d === 0 ? 10 + frac * 140 : 80;
        var cy = d === 0 ? 80 : 10 + frac * 140;
        h += '<div id="' + prefix + 'Dot' + idx + '" style="position:absolute;left:' + (cx-6) + 'px;top:' + (cy-6) + 'px;width:12px;height:12px;border-radius:50%;background:' + dc + ';border:1.5px solid ' + db + ';z-index:2;"></div>';
      }
    }
    h += '</div>';
    return h;
  }

  function _drawRectGrid(prefix, cols, rows, w, ht, points) {
    var rectW = Math.min(280, Math.max(140, w * 7));
    var rectH = Math.min(200, Math.max(100, ht * 7));
    var h = '<div style="position:relative;width:' + rectW + 'px;height:' + rectH + 'px;margin:0 auto 12px;border:2px solid ' + ACCENT + ';border-radius:4px;background:rgba(255,107,53,0.05);">';
    for (var r = 0; r < rows; r++) {
      for (var cc = 0; cc < cols; cc++) {
        var idx = r * cols + cc;
        var dotX = (cc + 0.5) / cols * rectW;
        var dotY = (r + 0.5) / rows * rectH;
        var dc = points[idx] > 0 ? GREEN : '#334155';
        var db = points[idx] > 0 ? GREEN : '#475569';
        h += '<div id="' + prefix + 'Dot' + idx + '" style="position:absolute;left:' + (dotX-5) + 'px;top:' + (dotY-5) + 'px;width:10px;height:10px;border-radius:50%;background:' + dc + ';border:1.5px solid ' + db + ';"></div>';
      }
    }
    h += '</div>';
    return h;
  }

})();
