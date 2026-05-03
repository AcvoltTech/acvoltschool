/**
 * Manómetro HVAC — Herramienta Interactiva de Calefacción
 * Tabs: Gas Valve, Low Pressure Switch, Static Pressure, CFM/VP/Velocidad, Área de Ducto
 */
(function() {
  'use strict';
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  // ───────── Maestro Premium Design Tokens (shared across every tool) ─────────
  var BG = '#FAFAF7';
  var BG2 = '#FFFFFF';
  var ACCENT = '#E8591C';
  var ACCENT2 = '#C2410C';
  var GREEN = '#059669';
  var YELLOW = '#D97706';
  var RED = '#DC2626';
  var BLUE = '#1E3A8A';
  var TEXT = '#0F0F0F';
  var MUTED = '#6B6B66';
  var HAIRLINE = '#E7E5DE';
  var LCD = "'Courier New',monospace";
  var _activeTab = 0;
  var _pumpTimer = null;
  var _pumpSpeed = 0.02;
  var _pumpActive = false;
  var _pumpPressure = 0;
  var _psUnitIdx = 0;
  var _btnS = 'width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#3a4050,#252a35);border:2px solid #4a5060;color:#8a9ab0;font-size:8px;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.4);';
  var _clockTimer = null;
  var _clockStartTime = 0;
  var _clockElapsed = 0;
  var _clockRunning = false;

  // ============================
  // EQUIPMENT/CLIENT/TECH STATE
  // ============================
  function _initEquip() {
    if (!window._mhEquip) {
      var tn = '', tnum = '', te = '';
      try { var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        tn = u.nombre || u.name || '';
        tnum = u.technicianNumber || localStorage.getItem('tecnico_number_' + (u.email || '')) || localStorage.getItem('tecnico_number') || '';
        te = u.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._mhEquip = { model:'', serial:'', clientName:'', clientAddr:'', techName:tn, techNum:tnum, techEmail:te };
    }
  }
  window._mhSaveEquip = function() {
    var eq = window._mhEquip; if (!eq) return;
    var ids = [['mhEqModel','model'],['mhEqSerial','serial'],['mhEqClient','clientName'],['mhEqAddr','clientAddr'],['mhEqTech','techName'],['mhEqTechNum','techNum']];
    for (var i = 0; i < ids.length; i++) { var el = document.getElementById(ids[i][0]); if (el) eq[ids[i][1]] = el.value; }
  };
  function _equipHTML() {
    var eq = window._mhEquip || {};
    var h = '<div style="background:rgba(255,107,53,0.06);border:1.5px solid rgba(255,107,53,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:10px;font-weight:800;color:' + ACCENT + ';letter-spacing:0.5px;margin-bottom:8px;border-left:3px solid ' + ACCENT + ';padding-left:6px;">INFORMACI\u00D3N DEL SERVICIO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:' + ACCENT + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Modelo</label>';
    h += '<input id="mhEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 58STA090" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(255,107,53,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + ACCENT + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Serie</label>';
    h += '<input id="mhEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 4921A12345" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(255,107,53,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Nombre del Cliente</label>';
    h += '<input id="mhEqClient" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Direcci\u00F3n</label>';
    h += '<input id="mhEqAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 0.8fr 1.2fr;gap:8px;">';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">T\u00E9cnico</label>';
    h += '<input id="mhEqTech" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;"># T\u00E9cnico</label>';
    h += '<input id="mhEqTechNum" value="' + (eq.techNum||'') + '" placeholder="Lic #" oninput="_mhSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">Email</label>';
    h += '<input id="mhEqEmail" value="' + (eq.techEmail||'') + '" readonly style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#22c55e;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div></div>';
    return h;
  }

  // ============================
  // INIT
  // ============================
  window.initManometerHvac = function() {
    var s = document.getElementById('manometerHvacScreen');
    if (!s) return;
    if (window.Gamification) window.Gamification.recordToolUse('manometer');
    _activeTab = 0;
    _initEquip();
    _render(s);
  };

  // ============================
  // MAIN RENDER
  // ============================
  function _render(s) {
    var tabs = [
      { icon: '\uD83D\uDD25', label: 'Gas Valve' },
      { icon: '\u26A1', label: 'Inducer PS' },
      { icon: '\uD83D\uDCCA', label: 'Static P' },
      { icon: '\uD83D\uDCA8', label: 'CFM/VP' },
      { icon: '\uD83D\uDCD0', label: 'Ductos' },
      { icon: '\u23F1', label: 'Clock Meter' },
      { icon: '\uD83D\uDCCB', label: 'Sys Perf' }
    ];
    var h = '<div style="background:' + BG + ';min-height:100vh;color:' + TEXT + ';display:flex;flex-direction:column;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:20;background:' + BG + ';border-bottom:1px solid rgba(255,107,53,0.15);padding:10px 12px 0;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<button onclick="showScreen(\'dashboardScreen\')" style="background:rgba(255,107,53,0.12);border:none;color:' + ACCENT + ';width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;"><div style="font-size:17px;font-weight:800;color:#111111;">' + _t('mn_title','Man\u00F3metro HVAC') + '</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';font-weight:500;">' + _t('mn_subtitle','Gas Valve \u00B7 Inducer PS \u00B7 Static \u00B7 CFM \u00B7 Clock Meter \u00B7 System Performance') + '</div></div></div>';
    // Tabs
    h += '<div style="display:flex;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:0;">';
    for (var i = 0; i < tabs.length; i++) {
      var active = i === _activeTab;
      var bg = active ? 'rgba(255,107,53,0.18)' : 'transparent';
      var bc = active ? ACCENT : 'transparent';
      var tc = active ? ACCENT : MUTED;
      h += '<button onclick="window._mhSwitchTab(' + i + ')" style="flex-shrink:0;background:' + bg + ';border:none;border-bottom:2px solid ' + bc + ';color:' + tc + ';padding:8px 10px 6px;cursor:pointer;font-size:13px;font-weight:' + (active ? '700' : '600') + ';white-space:nowrap;display:flex;align-items:center;gap:4px;transition:all .2s;">';
      h += '<span style="font-size:14px;">' + tabs[i].icon + '</span>' + tabs[i].label + '</button>';
    }
    h += '</div></div>';
    // Equipment/Client/Tech info
    h += '<div style="padding:12px 12px 0;">' + _equipHTML() + '</div>';
    // Content
    h += '<div id="mhContent" style="flex:1;overflow-y:auto;padding:12px;"></div>';
    h += '</div>';
    s.innerHTML = h;
    _renderTab();
  }

  window._mhSwitchTab = function(idx) {
    if (_pumpActive) { _pumpActive = false; if (_pumpTimer) { clearInterval(_pumpTimer); _pumpTimer = null; } }
    _activeTab = idx;
    var s = document.getElementById('manometerHvacScreen');
    if (s) _render(s);
  };

  function _renderTab() {
    var c = document.getElementById('mhContent');
    if (!c) return;
    if (_activeTab === 0) _renderGasValve(c);
    else if (_activeTab === 1) _renderLowPressSwitch(c);
    else if (_activeTab === 2) _renderStaticPressure(c);
    else if (_activeTab === 3) _renderCFM(c);
    else if (_activeTab === 4) _renderDuctArea(c);
    else if (_activeTab === 5) _renderClockMeter(c);
    else if (_activeTab === 6) _renderSystemPerf(c);
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
    return '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + value + '" step="' + (step || 0.1) + '" ' +
      'oninput="' + oninput + '" style="width:100%;accent-color:' + ACCENT + ';height:6px;cursor:pointer;margin:4px 0;">';
  }

  function _statusBadge(id, text, color) {
    return '<div id="' + id + '" style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44;">' + text + '</div>';
  }

  // Shared SDMN6 device display for tabs 3-5
  function _sdmn6(prefix, subtitle, p1lbl, p2lbl, p1v, p2v, unit) {
    var h = '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    h += '<div style="text-align:center;margin-bottom:8px;">';
    h += '<div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">FIELDPIECE</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">SDMN6 \u2014 ' + subtitle + '</div></div>';
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;margin-bottom:10px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">' + p1lbl + '</span>';
    h += '<div><span id="' + prefix + 'P1" style="font-family:' + LCD + ';font-size:32px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.4);">' + p1v + '</span>';
    h += '<span id="' + prefix + 'Unit" style="font-size:10px;color:#4a7a4a;margin-left:4px;">' + unit + '</span></div></div>';
    h += '<div style="border-top:1px solid #1a2a1a;margin:4px 0;"></div>';
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">' + p2lbl + '</span>';
    h += '<div><span id="' + prefix + 'P2" style="font-family:' + LCD + ';font-size:28px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 8px rgba(51,255,51,0.3);">' + p2v + '</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">' + unit + '</span></div></div>';
    h += '<div style="display:flex;justify-content:space-between;margin-top:6px;">';
    h += '<div style="font-size:8px;color:#4a7a4a;">APO</div>';
    h += '<div style="font-size:8px;color:#1a3a1a;">HOLD</div>';
    h += '<div style="font-size:8px;color:#4a7a4a;">MAX/MIN</div>';
    h += '</div></div>';
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:10px 0 4px;">';
    h += '<button style="' + _btnS + '">ZERO</button>';
    h += '<button style="' + _btnS + '">P1/P2</button>';
    h += '<button style="' + _btnS + '">UNIT</button>';
    h += '<button style="' + _btnS + '">HOLD</button>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:2px 0 6px;">';
    h += '<button onclick="window._mhSwitchTab(1)" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#4a3020,#352218);border:2px solid rgba(255,107,53,0.5);color:' + ACCENT + ';font-size:8px;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.4);">TEST</button>';
    h += '<button style="' + _btnS + '">\u25B2</button>';
    h += '<button style="' + _btnS + '">\u25BC</button>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:center;gap:40px;margin-top:4px;">';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P1</div></div>';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P2</div></div>';
    h += '</div></div></div>';
    return h;
  }

  // AI diagnostic helper — calls tutor-ia-chat Edge Function
  var _iaBtn = 'width:100%;padding:14px;background:linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,107,53,0.1));border:1.5px solid rgba(255,107,53,0.3);color:' + ACCENT + ';border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:0.3px;';
  function _mhAIButton(id, label, onclick) {
    return '<div style="margin-top:12px;margin-bottom:8px;"><button id="' + id + '" data-label="' + label + '" onclick="' + onclick + '" style="' + _iaBtn + '">' + label + '</button>' +
      '<div id="' + id + 'Result" style="margin-top:8px;"></div></div>';
  }
  function _mhCallIA(prompt, resultId, btnId) {
    var rEl = document.getElementById(resultId);
    var bEl = document.getElementById(btnId);
    if (!rEl) return;
    if (bEl) { bEl.disabled = true; bEl.textContent = _t('mn_analyzing','Analizando...'); bEl.style.opacity = '0.6'; }
    rEl.innerHTML = '<div style="padding:16px;text-align:center;"><div style="display:inline-block;width:24px;height:24px;border:3px solid rgba(255,107,53,0.2);border-top-color:' + ACCENT + ';border-radius:50%;animation:mhSpin 0.8s linear infinite;"></div><div style="margin-top:8px;font-size:10px;color:#111111;">' + _t('mn_consulting_ai','Consultando IA...') + '</div></div>';
    if (!document.getElementById('mhSpinStyle')) {
      var st = document.createElement('style'); st.id = 'mhSpinStyle';
      st.textContent = '@keyframes mhSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');
    var _getToken = (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth)
      ? supabaseClient.auth.getSession().then(function(s) { return (s && s.data && s.data.session) ? s.data.session.access_token : sbKey; }).catch(function() { return sbKey; })
      : Promise.resolve(sbKey);
    _getToken.then(function(_tk) {
      fetch(sbUrl + '/functions/v1/tutor-ia-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tk, 'apikey': sbKey },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], system: 'Eres un t\u00E9cnico HVAC master con 20+ a\u00F1os de experiencia especializado en gas heating, furnaces, y diagn\u00F3stico de calefacci\u00F3n. Responde siempre en espa\u00F1ol, de forma directa y profesional. Usa terminolog\u00EDa t\u00E9cnica HVAC.', max_tokens: 2048, email: localStorage.getItem('tecnico_email') || '' })
      }).then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        var text = data.reply || data.text || data.response || JSON.stringify(data);
        text = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b style="color:#111111;">$1</b>').replace(/(\d+)\.\s/g, '<span style="color:' + ACCENT + ';font-weight:700;">$1.</span> ');
        rEl.innerHTML = '<div style="padding:12px;background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.15);border-radius:10px;font-size:13px;color:#111111;line-height:1.8;">' +
          '<div style="font-size:12px;font-weight:800;color:' + ACCENT + ';margin-bottom:6px;">' + _t('mn_ai_diag_header','\uD83E\uDD16 Diagn\u00F3stico IA \u2014 Gas Heat') + '</div>' + text + '</div>';
        if (bEl) { bEl.disabled = false; bEl.innerHTML = bEl.getAttribute('data-label') || _t('mn_diagnose_ai','Diagnosticar con IA'); bEl.style.opacity = '1'; }
      }).catch(function(err) {
        rEl.innerHTML = '<div style="padding:10px;background:rgba(255,107,53,0.1);border-radius:8px;font-size:11px;color:#f87171;">Error: ' + err.message + '. ' + _t('mn_check_connection','Verifica tu conexi\u00F3n.') + '</div>';
        if (bEl) { bEl.disabled = false; bEl.textContent = _t('mn_retry','Reintentar'); bEl.style.opacity = '1'; }
      });
    });
  }

  function _selectDropdown(id, options, onchange) {
    var h = '<select id="' + id + '" onchange="' + onchange + '" style="width:100%;padding:8px 10px;border-radius:8px;background:#ffffff;color:#111111;border:1px solid rgba(255,107,53,0.2);font-size:14px;cursor:pointer;">';
    for (var i = 0; i < options.length; i++) {
      h += '<option value="' + options[i].v + '">' + options[i].l + '</option>';
    }
    h += '</select>';
    return h;
  }

  // ============================
  // TAB 1: GAS VALVE
  // ============================
  function _renderGasValve(c) {
    var h = '';
    // Fuel type toggle
    h += _card(_t('mn_fuel_type','\uD83D\uDD25 TIPO DE COMBUSTIBLE'), '' +
      '<div style="display:flex;gap:6px;margin-bottom:12px;">' +
      '<button id="mhFuelNG" onclick="window._mhSetFuel(\'ng\')" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + ACCENT + ';background:rgba(255,107,53,0.15);color:' + ACCENT + ';font-weight:700;font-size:13px;cursor:pointer;">Natural Gas</button>' +
      '<button id="mhFuelLP" onclick="window._mhSetFuel(\'lp\')" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:13px;cursor:pointer;">LP Propane</button>' +
      '</div>' +
      '<div id="mhFuelInfo" style="font-size:13px;color:' + MUTED + ';text-align:center;"></div>'
    );
    // SDMN6-style dual port manometer
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    // Device body
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    // Brand header
    h += '<div style="text-align:center;margin-bottom:8px;">';
    h += '<div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">FIELDPIECE</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">SDMN6 \u2014 DUAL PORT MANOMETER</div>';
    h += '</div>';
    // LCD Screen
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;margin-bottom:10px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    // P1 line
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">P1</span>';
    h += '<div><span id="mhGasP1" style="font-family:' + LCD + ';font-size:32px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.4);">7.00</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;" id="mhGasUnit">inWC</span></div></div>';
    // Divider
    h += '<div style="border-top:1px solid #1a2a1a;margin:4px 0;"></div>';
    // P2 / P1-P2 line
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;" id="mhGasP2Label">P1-P2</span>';
    h += '<div><span id="mhGasP2" style="font-family:' + LCD + ';font-size:28px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 8px rgba(51,255,51,0.3);">3.50</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">inWC</span></div></div>';
    // Status indicators
    h += '<div style="display:flex;justify-content:space-between;margin-top:6px;">';
    h += '<div id="mhGasAPO" style="font-size:8px;color:#1a3a1a;">APO</div>';
    h += '<div id="mhGasHold" style="font-size:8px;color:#1a3a1a;">HOLD</div>';
    h += '<div id="mhGasClosed" style="font-size:8px;color:#1a3a1a;">CLOSED</div>';
    h += '<div style="font-size:8px;color:#4a7a4a;">MAX/MIN</div>';
    h += '</div></div>';
    // Buttons row
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:10px 0 4px;">';
    h += '<button onclick="window._mhGasZero()" style="' + _btnS + '">ZERO</button>';
    h += '<button onclick="window._mhGasToggleP()" style="' + _btnS + '">P1/P2</button>';
    h += '<button onclick="window._mhGasToggleUnit()" style="' + _btnS + '">UNIT</button>';
    h += '<button onclick="window._mhGasHold()" style="' + _btnS + '">HOLD</button>';
    h += '</div>';
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:2px 0 6px;">';
    h += '<button onclick="window._mhSwitchTab(1)" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#4a3020,#352218);border:2px solid rgba(255,107,53,0.5);color:' + ACCENT + ';font-size:8px;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.4);">TEST</button>';
    h += '<button onclick="window._mhGasInc()" style="' + _btnS + '">\u25B2</button>';
    h += '<button onclick="window._mhGasDec()" style="' + _btnS + '">\u25BC</button>';
    h += '</div>';
    // Hose ports
    h += '<div style="display:flex;justify-content:center;gap:40px;margin-top:6px;">';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P1</div></div>';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P2</div></div>';
    h += '</div>';
    h += '</div>'; // device body
    // Conversion display
    h += '<div id="mhGasConv" style="text-align:center;font-size:13px;color:' + MUTED + ';margin-top:8px;"></div>';
    h += '</div>'; // outer card
    // Incoming pressure slider
    h += _card(_t('mn_incoming_pressure','INCOMING PRESSURE (ENTRADA)'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_inlet_pressure','Presi\u00F3n de entrada') + '</span>' +
      '<span id="mhIncomingVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">7.0"WC</span></div>' +
      _slider('mhIncomingSlider', 0, 14, 7, 0.1, 'window._mhUpdateGas()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>0"WC</span><span>14"WC</span></div>' +
      '<div id="mhIncomingStatus" style="margin-top:6px;text-align:center;"></div>'
    );
    // Manifold pressure slider
    h += _card(_t('mn_manifold_pressure','MANIFOLD PRESSURE (COLECTOR)'), '' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_manifold_label','Presi\u00F3n del colector') + '</span>' +
      '<span id="mhManifoldVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">3.5"WC</span></div>' +
      _slider('mhManifoldSlider', 0, 14, 3.5, 0.1, 'window._mhUpdateGas()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>0"WC</span><span>14"WC</span></div>' +
      '<div id="mhManifoldStatus" style="margin-top:6px;text-align:center;"></div>'
    );
    // Reference + 2-stage
    h += _card(_t('mn_reference','\uD83D\uDCCB REFERENCIA'), '' +
      '<div id="mhGasRef" style="font-size:13px;line-height:1.8;color:' + TEXT + ';"></div>'
    );
    // AI Diagnostic
    h += _mhAIButton('mhGasIA', _t('mn_ai_gas_valve','\uD83E\uDD16 Diagn\u00F3stico Gas Valve con IA'), 'window._mhGasDiagnose()');
    c.innerHTML = h;
    window._mhFuel = 'ng';
    window._mhSetFuel = function(f) {
      window._mhFuel = f;
      var ngBtn = document.getElementById('mhFuelNG');
      var lpBtn = document.getElementById('mhFuelLP');
      if (f === 'ng') {
        ngBtn.style.borderColor = ACCENT; ngBtn.style.background = 'rgba(255,107,53,0.15)'; ngBtn.style.color = ACCENT;
        lpBtn.style.borderColor = 'rgba(0,0,0,0.1)'; lpBtn.style.background = 'transparent'; lpBtn.style.color = MUTED;
        document.getElementById('mhManifoldSlider').value = 3.5;
      } else {
        lpBtn.style.borderColor = ACCENT; lpBtn.style.background = 'rgba(255,107,53,0.15)'; lpBtn.style.color = ACCENT;
        ngBtn.style.borderColor = 'rgba(0,0,0,0.1)'; ngBtn.style.background = 'transparent'; ngBtn.style.color = MUTED;
        document.getElementById('mhManifoldSlider').value = 10;
      }
      window._mhUpdateGas();
    };
    window._mhGasUnitIdx = 0;
    window._mhGasShowDiff = true;
    var _units = ['inWC', 'mmWC', 'mbar', 'psi'];
    var _unitConv = [1, 25.4, 2.49, 0.0361];
    window._mhGasZero = function() {
      document.getElementById('mhIncomingSlider').value = 0;
      document.getElementById('mhManifoldSlider').value = 0;
      window._mhUpdateGas();
    };
    window._mhGasToggleP = function() {
      window._mhGasShowDiff = !window._mhGasShowDiff;
      window._mhUpdateGas();
    };
    window._mhGasToggleUnit = function() {
      window._mhGasUnitIdx = (window._mhGasUnitIdx + 1) % _units.length;
      window._mhUpdateGas();
    };
    window._mhGasHold = function() {
      var h = document.getElementById('mhGasHold');
      if (h) h.style.color = h.style.color === 'rgb(51, 255, 51)' ? '#1a3a1a' : '#33ff33';
    };
    window._mhGasInc = function() {
      var s = document.getElementById('mhIncomingSlider');
      if (s) { s.value = Math.min(parseFloat(s.value) + 0.01, 14).toFixed(2); window._mhUpdateGas(); }
    };
    window._mhGasDec = function() {
      var s = document.getElementById('mhIncomingSlider');
      if (s) { s.value = Math.max(parseFloat(s.value) - 0.01, 0).toFixed(2); window._mhUpdateGas(); }
    };
    window._mhUpdateGas = function() {
      var fuel = window._mhFuel;
      var incoming = parseFloat(document.getElementById('mhIncomingSlider').value);
      var manifold = parseFloat(document.getElementById('mhManifoldSlider').value);
      var uIdx = window._mhGasUnitIdx;
      var conv = _unitConv[uIdx];
      var uLabel = _units[uIdx];
      // SDMN6 LCD — P1 = incoming, P2 = manifold, P1-P2 = difference
      var p1Val = (incoming * conv).toFixed(2);
      var p2Val = window._mhGasShowDiff ? ((incoming - manifold) * conv).toFixed(2) : (manifold * conv).toFixed(2);
      var p2Label = window._mhGasShowDiff ? 'P1-P2' : 'P2';
      document.getElementById('mhGasP1').textContent = p1Val;
      document.getElementById('mhGasP2').textContent = p2Val;
      document.getElementById('mhGasP2Label').textContent = p2Label;
      document.getElementById('mhGasUnit').textContent = uLabel;
      // Update slider labels
      document.getElementById('mhIncomingVal').textContent = incoming.toFixed(1) + '"WC';
      document.getElementById('mhManifoldVal').textContent = manifold.toFixed(1) + '"WC';
      // Conversion display
      document.getElementById('mhGasConv').textContent = 'P1: ' + (incoming * 2.49).toFixed(1) + ' mbar | Manifold: ' + (manifold * 2.49).toFixed(1) + ' mbar | ' + (manifold * 0.0361).toFixed(3) + ' psi';
      // Specs
      var specs;
      if (fuel === 'ng') {
        specs = { manifoldTarget: 3.5, manifoldLow: 3.2, manifoldHigh: 3.8, incomingMin: 5, incomingMax: 10.5, label: 'Natural Gas' };
      } else {
        specs = { manifoldTarget: 10, manifoldLow: 9.5, manifoldHigh: 10.5, incomingMin: 11, incomingMax: 14, label: 'LP Propane' };
      }
      // Fuel info
      document.getElementById('mhFuelInfo').textContent = specs.label + ' \u2014 Manifold target: ' + specs.manifoldTarget + '"WC';
      // Incoming status
      var inStat = document.getElementById('mhIncomingStatus');
      if (incoming >= specs.incomingMin && incoming <= specs.incomingMax) {
        inStat.innerHTML = _statusBadge('', _t('mn_within_range','\u2713 Dentro de rango') + ' (' + specs.incomingMin + '-' + specs.incomingMax + '"WC)', GREEN);
      } else if (incoming < specs.incomingMin) {
        inStat.innerHTML = _statusBadge('', _t('mn_pressure_low','\u26A0 Presi\u00F3n baja') + ' (M\u00EDn: ' + specs.incomingMin + '"WC)', RED);
      } else {
        inStat.innerHTML = _statusBadge('', _t('mn_pressure_high','\u26A0 Presi\u00F3n alta') + ' (M\u00E1x: ' + specs.incomingMax + '"WC)', YELLOW);
      }
      // Manifold status
      var mStat = document.getElementById('mhManifoldStatus');
      if (manifold >= specs.manifoldLow && manifold <= specs.manifoldHigh) {
        mStat.innerHTML = _statusBadge('', _t('mn_correct','\u2713 Correcto') + ' (' + specs.manifoldTarget + '"WC \u00B1 0.3)', GREEN);
      } else if (manifold < specs.manifoldLow) {
        mStat.innerHTML = _statusBadge('', _t('mn_very_low_adjust','\u2193 Muy baja \u2014 ajustar v\u00E1lvula'), RED);
      } else {
        mStat.innerHTML = _statusBadge('', _t('mn_very_high_check','\u2191 Muy alta \u2014 verificar regulador'), RED);
      }
      // Reference table
      var ref = document.getElementById('mhGasRef');
      if (ref) {
        ref.innerHTML =
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">' +
          '<div><b style="color:' + ACCENT + ';">Natural Gas:</b></div><div></div>' +
          '<div style="color:' + MUTED + ';">Manifold</div><div>3.5"WC (3.2\u20133.8)</div>' +
          '<div style="color:' + MUTED + ';">Incoming</div><div>5.0\u201310.5"WC</div>' +
          '<div style="color:' + MUTED + ';">2-Stage High</div><div>3.5"WC</div>' +
          '<div style="color:' + MUTED + ';">2-Stage Low</div><div>1.7"WC</div>' +
          '<div style="margin-top:6px;"><b style="color:' + ACCENT2 + ';">LP Propane:</b></div><div style="margin-top:6px;"></div>' +
          '<div style="color:' + MUTED + ';">Manifold</div><div>10.0"WC (9.5\u201310.5)</div>' +
          '<div style="color:' + MUTED + ';">Incoming</div><div>11.0\u201314.0"WC</div>' +
          '<div style="color:' + MUTED + ';">2-Stage High</div><div>10.0"WC</div>' +
          '<div style="color:' + MUTED + ';">2-Stage Low</div><div>5.0"WC</div>' +
          '<div style="margin-top:6px;"><b style="color:' + BLUE + ';">Modulating:</b></div><div style="margin-top:6px;"></div>' +
          '<div style="color:' + MUTED + ';">NG Range</div><div>1.0\u20133.5"WC</div>' +
          '<div style="color:' + MUTED + ';">LP Range</div><div>4.0\u201310.0"WC</div>' +
          '</div>';
      }
    };
    window._mhGasDiagnose = function() {
      var fuel = window._mhFuel === 'lp' ? 'LP Propane' : 'Natural Gas';
      var inc = parseFloat(document.getElementById('mhIncomingSlider').value);
      var man = parseFloat(document.getElementById('mhManifoldSlider').value);
      var p = 'Analiza estas lecturas de gas valve de un horno:\n\n' +
        'Combustible: ' + fuel + '\n' +
        'Presi\u00F3n de entrada (incoming): ' + inc.toFixed(1) + '"WC\n' +
        'Presi\u00F3n del colector (manifold): ' + man.toFixed(1) + '"WC\n' +
        'Diferencial (P1-P2): ' + (inc - man).toFixed(1) + '"WC\n\n' +
        'Responde con:\n1. DIAGN\u00D3STICO \u2014 \u00BFLas presiones est\u00E1n dentro de especificaci\u00F3n?\n2. PROBLEMAS DETECTADOS \u2014 qu\u00E9 est\u00E1 mal y por qu\u00E9\n3. CAUSAS PROBABLES \u2014 lista numerada\n4. PASOS DE REPARACI\u00D3N \u2014 qu\u00E9 hacer paso a paso\n5. SEGURIDAD \u2014 advertencias importantes para gas';
      _mhCallIA(p, 'mhGasIAResult', 'mhGasIA');
    };
    window._mhUpdateGas();
  }


  // ============================
  // TAB 2: INDUCER PRESSURE SWITCH
  // ============================
  // Common inducer pressure switch ratings by furnace type (negative "WC)
  var _psFurnaceTypes = [
    { v: 'single80', l: 'Single Stage 80% AFUE', rating: -0.65, range: [-0.40, -1.10], desc: _t('mn_furnace_single80','Horno convencional tiro natural asistido') },
    { v: 'single90', l: 'Single Stage 90%+ Condensing', rating: -1.13, range: [-0.60, -2.00], desc: _t('mn_furnace_single90','Horno de condensaci\u00F3n, tuber\u00EDa PVC') },
    { v: 'two80', l: 'Two Stage 80% (Low Fire)', rating: -0.40, range: [-0.25, -0.70], desc: _t('mn_furnace_two80low','Etapa baja \u2014 draft reducido') },
    { v: 'two80hi', l: 'Two Stage 80% (High Fire)', rating: -0.70, range: [-0.45, -1.20], desc: _t('mn_furnace_two80hi','Etapa alta \u2014 draft completo') },
    { v: 'two90', l: 'Two Stage 90%+ (Low Fire)', rating: -0.70, range: [-0.40, -1.20], desc: _t('mn_furnace_two90low','Condensing baja \u2014 PVC vent') },
    { v: 'two90hi', l: 'Two Stage 90%+ (High Fire)', rating: -1.25, range: [-0.80, -2.00], desc: _t('mn_furnace_two90hi','Condensing alta \u2014 draft completo') },
    { v: 'custom', l: _t('mn_custom_read_stamp','Personalizado (leer estampa)'), rating: -1.00, range: [-0.20, -3.00], desc: _t('mn_furnace_custom','Ingresa el rating de la estampa del switch') }
  ];

  function _renderLowPressSwitch(c) {
    var h = '';
    // SDMN6 Dual Port Manometer — Pressure Switch Tester
    h += '<div style="background:#0d1117;border:2px solid rgba(255,107,53,0.25);border-radius:16px;padding:16px;margin-bottom:12px;">';
    h += '<div style="max-width:300px;margin:0 auto;background:linear-gradient(180deg,#1a1f2e,#12161f);border-radius:14px;border:2px solid #2a3040;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,0,0,0.03);">';
    // Brand
    h += '<div style="text-align:center;margin-bottom:8px;">';
    h += '<div style="font-size:14px;font-weight:900;color:' + ACCENT + ';letter-spacing:2px;">FIELDPIECE</div>';
    h += '<div style="font-size:9px;color:' + MUTED + ';letter-spacing:1px;">SDMN6 \u2014 PRESSURE SWITCH TESTER</div></div>';
    // LCD
    h += '<div style="background:#0a0f0a;border:2px solid #1a2a1a;border-radius:8px;padding:10px 14px;margin-bottom:10px;box-shadow:inset 0 2px 8px rgba(0,0,0,0.8);">';
    // P1 — measured induced pressure
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">P1</span>';
    h += '<div><span id="mhPSDevP1" style="font-family:' + LCD + ';font-size:32px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.4);">-1.30</span>';
    h += '<span id="mhPSDevUnit" style="font-size:10px;color:#4a7a4a;margin-left:4px;">inWC</span></div></div>';
    h += '<div style="border-top:1px solid #1a2a1a;margin:4px 0;"></div>';
    // P2 — switch rating reference
    h += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
    h += '<span style="font-size:9px;color:#4a7a4a;font-weight:600;">RATING</span>';
    h += '<div><span id="mhPSDevP2" style="font-family:' + LCD + ';font-size:28px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 8px rgba(51,255,51,0.3);">-1.13</span>';
    h += '<span style="font-size:10px;color:#4a7a4a;margin-left:4px;">inWC</span></div></div>';
    // Indicators
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">';
    h += '<div id="mhPSDevTest" style="font-size:8px;color:#1a3a1a;font-weight:700;">TEST</div>';
    h += '<div id="mhPSDevHold" style="font-size:8px;color:#1a3a1a;">HOLD</div>';
    h += '<div id="mhPSDevClosed" style="font-size:8px;color:#1a3a1a;padding:2px 8px;border-radius:3px;font-weight:700;">CLOSED</div>';
    h += '<div style="font-size:8px;color:#4a7a4a;">PUMP</div>';
    h += '</div></div>';
    // Buttons row 1
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:10px 0 4px;">';
    h += '<button onclick="window._mhPSZero()" style="' + _btnS + '">ZERO</button>';
    h += '<button onclick="" style="' + _btnS + '">P1/P2</button>';
    h += '<button onclick="window._mhPSToggleUnit()" style="' + _btnS + '">UNIT</button>';
    h += '<button onclick="" style="' + _btnS + '">HOLD</button>';
    h += '</div>';
    // Buttons row 2 — TEST + pump speed
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:2px 0 6px;">';
    h += '<button id="mhPSTestBtn" onclick="window._mhPSTest()" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(180deg,#4a3020,#352218);border:2px solid rgba(255,107,53,0.5);color:' + ACCENT + ';font-size:8px;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.4);">TEST</button>';
    h += '<button onclick="window._mhPSPumpInc()" style="' + _btnS + '">\u25B2</button>';
    h += '<button onclick="window._mhPSPumpDec()" style="' + _btnS + '">\u25BC</button>';
    h += '</div>';
    // Pump info
    h += '<div id="mhPSPumpInfo" style="text-align:center;font-size:13px;color:' + MUTED + ';margin-bottom:4px;min-height:16px;"></div>';
    // Ports
    h += '<div style="display:flex;justify-content:center;gap:40px;margin-top:4px;">';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P1</div></div>';
    h += '<div style="text-align:center;"><div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,#e44,#b22);margin:0 auto 2px;border:1.5px solid #f66;box-shadow:0 0 6px rgba(255,50,50,0.3);"></div><div style="font-size:8px;color:' + MUTED + ';">P2</div></div>';
    h += '</div>';
    h += '</div></div>'; // device + outer
    // Furnace type selector
    var opts = [];
    for (var i = 0; i < _psFurnaceTypes.length; i++) opts.push({ v: _psFurnaceTypes[i].v, l: _psFurnaceTypes[i].l });
    h += _card(_t('mn_ps_furnace_type','\uD83D\uDD25 TIPO DE HORNO'), '' +
      _selectDropdown('mhPSFurnace', opts, 'window._mhUpdatePS()') +
      '<div id="mhPSDesc" style="font-size:13px;color:' + MUTED + ';margin-top:6px;text-align:center;"></div>'
    );
    // Switch rating
    h += _card(_t('mn_ps_switch_rating','\uD83D\uDCCB SWITCH RATING (ESTAMPA)'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">' + _t('mn_ps_rating_desc','Presi\u00F3n estampada en el switch (normalmente en "WC negativo)') + '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Switch Rating</span>' +
      '<span id="mhPSRatingVal" style="font-family:' + LCD + ';font-size:18px;font-weight:700;color:' + ACCENT + ';">-1.13"WC</span></div>' +
      _slider('mhPSRatingSlider', -3.0, -0.1, -1.13, 0.01, 'window._mhUpdatePS()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>-3.0"WC</span><span>-0.1"WC</span></div>'
    );
    // Measured induced pressure (what the inducer is actually producing)
    h += _card(_t('mn_ps_induced_pressure','\uD83C\uDF00 PRESI\u00D3N INDUCIDA (MEDIDA)'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">' + _t('mn_ps_induced_desc','Presi\u00F3n negativa creada por el inducer motor') + '</div>' +
      _lcdDisplay('mhPSMeasuredLCD', '-1.30', '"WC', 36) +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Induced Pressure</span>' +
      '<span id="mhPSMeasuredVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">-1.30"WC</span></div>' +
      _slider('mhPSMeasuredSlider', -4.0, 0, -1.30, 0.01, 'window._mhUpdatePS()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';">' +
      '<span>-4.0"WC</span><span>0"WC</span></div>' +
      '<div id="mhPSConv" style="text-align:center;font-size:13px;color:' + MUTED + ';margin-top:4px;"></div>'
    );
    // Visual bar — close/open zone
    h += _card(_t('mn_ps_switch_state','\u26A1 ESTADO DEL SWITCH'), '' +
      '<div id="mhPSBar" style="margin-bottom:8px;"></div>' +
      '<div id="mhPSClosedLED" style="text-align:center;margin:10px 0;"></div>' +
      '<div id="mhPSStatus" style="text-align:center;margin-top:6px;"></div>'
    );
    // Tolerance info
    h += _card(_t('mn_ps_tolerance','\uD83D\uDCCF TOLERANCIA (\u00B110%)'), '' +
      '<div id="mhPSTolerance" style="font-size:12px;line-height:1.8;color:' + TEXT + ';text-align:center;"></div>'
    );
    // Troubleshooting
    h += _card(_t('mn_ps_quick_diag','\uD83D\uDD27 DIAGN\u00D3STICO R\u00C1PIDO'), '' +
      '<div id="mhPSDiag" style="font-size:13px;line-height:1.7;color:' + TEXT + ';"></div>'
    );
    // Reference
    h += _card(_t('mn_ps_reference','\uD83D\uDCCB REFERENCIA: INDUCER PRESSURE SWITCH'), '' +
      '<div style="font-size:13px;line-height:1.8;color:' + TEXT + ';">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">' +
      '<div style="color:' + ACCENT + ';font-weight:700;grid-column:1/-1;margin-bottom:2px;">' + _t('mn_ps_how_works','C\u00F3mo funciona:') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_ref1','1. Control board energiza inducer motor') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_ref2','2. Inducer crea vac\u00EDo (presi\u00F3n negativa)') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_ref3','3. Pressure switch CIERRA al alcanzar su rating') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_ref4','4. Board confirma draft \u2192 abre gas valve') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_ref5','5. Si switch NO cierra \u2192 lockout (3 intentos)') + '</div>' +
      '<div style="margin-top:6px;color:' + ACCENT2 + ';font-weight:700;grid-column:1/-1;">' + _t('mn_ps_common_causes','Causas comunes de falla:') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause1','\u2022 Flue/vent bloqueado o restringido') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause2','\u2022 Condensate drain tapado (90%+)') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause3','\u2022 Inducer motor d\u00E9bil o fallando') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause4','\u2022 Diafragma del switch da\u00F1ado') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause5','\u2022 Bleed port/hose obstruido') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause6','\u2022 Heat exchanger agrietado (exceso de presi\u00F3n)') + '</div>' +
      '<div style="grid-column:1/-1;color:' + MUTED + ';">' + _t('mn_ps_cause7','\u2022 Tubo del switch roto o desconectado') + '</div>' +
      '</div></div>'
    );
    // AI Diagnostic
    h += _mhAIButton('mhPSIA', _t('mn_ps_ai_btn','\uD83E\uDD16 Diagn\u00F3stico Inducer Switch con IA'), 'window._mhPSDiagnose()');
    c.innerHTML = h;

    window._mhUpdatePS = function() {
      var sel = document.getElementById('mhPSFurnace').value;
      var furnace = _psFurnaceTypes[0];
      for (var i = 0; i < _psFurnaceTypes.length; i++) {
        if (_psFurnaceTypes[i].v === sel) { furnace = _psFurnaceTypes[i]; break; }
      }
      // If not custom, snap rating slider to furnace preset
      if (sel !== 'custom') {
        document.getElementById('mhPSRatingSlider').value = furnace.rating;
      }
      var rating = parseFloat(document.getElementById('mhPSRatingSlider').value);
      var measured = parseFloat(document.getElementById('mhPSMeasuredSlider').value);
      // Update displays
      document.getElementById('mhPSDesc').textContent = furnace.desc;
      document.getElementById('mhPSRatingVal').textContent = rating.toFixed(2) + '"WC';
      document.getElementById('mhPSMeasuredVal').textContent = measured.toFixed(2) + '"WC';
      document.getElementById('mhPSMeasuredLCD').textContent = measured.toFixed(2);
      // Unit conversion (1"WC = 2.49 mbar = 249 Pa)
      document.getElementById('mhPSConv').textContent = (measured * 2.49).toFixed(2) + ' mbar | ' + (measured * 249).toFixed(0) + ' Pa | ' + (measured * 0.0361).toFixed(4) + ' psi';
      // Tolerance (±10% per manufacturer spec)
      var tolHigh = rating * 0.9;  // less negative = closer to 0
      var tolLow = rating * 1.1;   // more negative = further from 0
      document.getElementById('mhPSTolerance').innerHTML =
        'Rating: <b style="color:' + ACCENT + ';">' + rating.toFixed(2) + '"WC</b><br>' +
        'Close range: <b>' + tolLow.toFixed(2) + '</b> a <b>' + tolHigh.toFixed(2) + '"WC</b> (\u00B110%)';
      // Switch is N.O. (normally open) — closes when induced pressure exceeds (is more negative than) rating
      var switchClosed = measured <= rating; // more negative = exceeds rating
      var withinTolerance = measured <= tolHigh && measured >= tolLow;
      var wayBeyond = measured < rating * 1.5; // inducer pulling way too much
      // LED indicator
      var ledEl = document.getElementById('mhPSClosedLED');
      if (switchClosed) {
        ledEl.innerHTML = '<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:20px;background:' + GREEN + '22;border:1px solid ' + GREEN + '55;">' +
          '<div style="width:14px;height:14px;border-radius:50%;background:' + GREEN + ';box-shadow:0 0 12px ' + GREEN + ';"></div>' +
          '<span style="font-size:13px;font-weight:700;color:' + GREEN + ';">' + _t('mn_ps_closed','CLOSED \u2014 Switch cerrado') + '</span></div>';
      } else {
        ledEl.innerHTML = '<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:20px;background:' + RED + '22;border:1px solid ' + RED + '55;">' +
          '<div style="width:14px;height:14px;border-radius:50%;background:' + RED + ';box-shadow:0 0 12px ' + RED + ';"></div>' +
          '<span style="font-size:13px;font-weight:700;color:' + RED + ';">' + _t('mn_ps_open','OPEN \u2014 Switch abierto') + '</span></div>';
      }
      // Status badge
      var statusEl = document.getElementById('mhPSStatus');
      if (!switchClosed && measured > rating * 0.5) {
        statusEl.innerHTML = _statusBadge('', _t('mn_ps_no_draft','\u26D4 Inducer NO genera suficiente draft \u2014 switch no cierra'), RED);
      } else if (!switchClosed) {
        statusEl.innerHTML = _statusBadge('', _t('mn_ps_insuf_pressure','\u26A0 Presi\u00F3n insuficiente \u2014 verificar inducer y ventilaci\u00F3n'), YELLOW);
      } else if (wayBeyond) {
        statusEl.innerHTML = _statusBadge('', _t('mn_ps_excess_draft','\u26A0 Draft excesivo \u2014 verificar vent sizing o heat exchanger'), YELLOW);
      } else if (switchClosed && !withinTolerance) {
        statusEl.innerHTML = _statusBadge('', _t('mn_ps_out_tolerance','\u2713 Cerrado pero fuera de tolerancia \u00B110%'), YELLOW);
      } else {
        statusEl.innerHTML = _statusBadge('', _t('mn_ps_correct','\u2713 Correcto \u2014 switch cerrado dentro de tolerancia'), GREEN);
      }
      // Visual bar
      _drawPSBar(measured, rating, tolLow, tolHigh);
      // Diagnostic
      var diagEl = document.getElementById('mhPSDiag');
      var diag = '';
      if (!switchClosed) {
        diag += '<div style="color:' + RED + ';font-weight:700;margin-bottom:4px;">' + _t('mn_ps_diag_no_close','Switch NO cierra:') + '</div>';
        diag += '<div>' + _t('mn_ps_diag1','\u2022 Verificar que el inducer est\u00E9 funcionando') + '</div>';
        diag += '<div>' + _t('mn_ps_diag2','\u2022 Revisar tubo de hule entre inducer y switch') + '</div>';
        diag += '<div>' + _t('mn_ps_diag3','\u2022 Inspeccionar flue/vent por bloqueos') + '</div>';
        diag += '<div>' + _t('mn_ps_diag4','\u2022 Revisar condensate drain (hornos 90%+)') + '</div>';
        diag += '<div>' + _t('mn_ps_diag5','\u2022 Verificar diafragma del switch con SDMN6') + '</div>';
        diag += '<div>' + _t('mn_ps_diag6','\u2022 Verificar bleed port por obstrucci\u00F3n') + '</div>';
      } else if (wayBeyond) {
        diag += '<div style="color:' + YELLOW + ';font-weight:700;margin-bottom:4px;">' + _t('mn_ps_diag_excess','Draft excesivo:') + '</div>';
        diag += '<div>' + _t('mn_ps_diag7','\u2022 Posible heat exchanger agrietado') + '</div>';
        diag += '<div>' + _t('mn_ps_diag8','\u2022 Vent pipe undersized') + '</div>';
        diag += '<div>' + _t('mn_ps_diag9','\u2022 Wind effect en chimney/flue') + '</div>';
        diag += '<div>' + _t('mn_ps_diag10','\u2022 Verificar con combustion analyzer') + '</div>';
      } else {
        diag += '<div style="color:' + GREEN + ';font-weight:700;margin-bottom:4px;">' + _t('mn_ps_diag_normal','Operaci\u00F3n normal:') + '</div>';
        diag += '<div>' + _t('mn_ps_diag11','\u2022 Inducer crea draft adecuado') + '</div>';
        diag += '<div>' + _t('mn_ps_diag12','\u2022 Switch cierra correctamente') + '</div>';
        diag += '<div>' + _t('mn_ps_diag13','\u2022 Secuencia de ignici\u00F3n puede continuar') + '</div>';
      }
      diagEl.innerHTML = diag;
      // Update SDMN6 LCD
      var _psUnits = ['inWC', 'mmWC', 'mbar', 'psi'];
      var _psConv = [1, 25.4, 2.49, 0.0361];
      var pconv = _psConv[_psUnitIdx];
      var devP1 = document.getElementById('mhPSDevP1');
      if (devP1) devP1.textContent = (measured * pconv).toFixed(2);
      var devP2 = document.getElementById('mhPSDevP2');
      if (devP2) devP2.textContent = (rating * pconv).toFixed(2);
      var devUnit = document.getElementById('mhPSDevUnit');
      if (devUnit) devUnit.textContent = _psUnits[_psUnitIdx];
      var devClosed = document.getElementById('mhPSDevClosed');
      if (devClosed) {
        if (switchClosed) {
          devClosed.style.color = '#33ff33';
          devClosed.style.background = 'rgba(51,255,51,0.15)';
          devClosed.style.textShadow = '0 0 6px rgba(51,255,51,0.5)';
        } else {
          devClosed.style.color = '#1a3a1a';
          devClosed.style.background = 'transparent';
          devClosed.style.textShadow = 'none';
        }
      }
    };
    // Pump simulation handlers
    window._mhPSTest = function() {
      if (_pumpActive) {
        _pumpActive = false;
        if (_pumpTimer) { clearInterval(_pumpTimer); _pumpTimer = null; }
        var tb = document.getElementById('mhPSTestBtn');
        if (tb) { tb.style.background = 'linear-gradient(180deg,#4a3020,#352218)'; tb.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)'; }
        var ti = document.getElementById('mhPSDevTest');
        if (ti) ti.style.color = '#1a3a1a';
        var pi = document.getElementById('mhPSPumpInfo');
        if (pi) pi.textContent = '';
      } else {
        _pumpActive = true;
        _pumpPressure = 0;
        _pumpSpeed = 0.02;
        var tb = document.getElementById('mhPSTestBtn');
        if (tb) { tb.style.background = 'linear-gradient(180deg,#6a4020,#553018)'; tb.style.boxShadow = '0 0 12px rgba(255,107,53,0.4)'; }
        var ti = document.getElementById('mhPSDevTest');
        if (ti) ti.style.color = '#33ff33';
        _pumpTimer = setInterval(function() {
          _pumpPressure -= _pumpSpeed;
          if (_pumpPressure < -4.0) _pumpPressure = -4.0;
          var sl = document.getElementById('mhPSMeasuredSlider');
          if (sl) sl.value = _pumpPressure;
          window._mhUpdatePS();
          var pi = document.getElementById('mhPSPumpInfo');
          if (pi) pi.textContent = '\u25CF PUMP ACTIVE \u2014 Speed: ' + Math.round(_pumpSpeed * 1000) + ' | ' + _pumpPressure.toFixed(2) + '"WC';
        }, 100);
      }
    };
    window._mhPSPumpInc = function() {
      _pumpSpeed = Math.min(_pumpSpeed + 0.005, 0.1);
      if (_pumpActive) {
        var pi = document.getElementById('mhPSPumpInfo');
        if (pi) pi.textContent = '\u25CF PUMP ACTIVE \u2014 Speed: ' + Math.round(_pumpSpeed * 1000) + ' | ' + _pumpPressure.toFixed(2) + '"WC';
      }
    };
    window._mhPSPumpDec = function() {
      _pumpSpeed = Math.max(_pumpSpeed - 0.005, 0.005);
      if (_pumpActive) {
        var pi = document.getElementById('mhPSPumpInfo');
        if (pi) pi.textContent = '\u25CF PUMP ACTIVE \u2014 Speed: ' + Math.round(_pumpSpeed * 1000) + ' | ' + _pumpPressure.toFixed(2) + '"WC';
      }
    };
    window._mhPSZero = function() {
      if (_pumpActive) window._mhPSTest();
      _pumpPressure = 0;
      var sl = document.getElementById('mhPSMeasuredSlider');
      if (sl) sl.value = 0;
      window._mhUpdatePS();
    };
    window._mhPSToggleUnit = function() {
      _psUnitIdx = (_psUnitIdx + 1) % 4;
      window._mhUpdatePS();
    };
    window._mhPSDiagnose = function() {
      var sel = document.getElementById('mhPSFurnace');
      var furnaceName = sel ? sel.options[sel.selectedIndex].text : 'Desconocido';
      var rating = parseFloat(document.getElementById('mhPSRatingSlider').value);
      var measured = parseFloat(document.getElementById('mhPSMeasuredSlider').value);
      var closed = measured <= rating;
      var p = 'Analiza este diagn\u00F3stico de inducer pressure switch:\n\n' +
        'Tipo de horno: ' + furnaceName + '\n' +
        'Rating del switch (estampa): ' + rating.toFixed(2) + '"WC\n' +
        'Presi\u00F3n inducida medida: ' + measured.toFixed(2) + '"WC\n' +
        'Estado del switch: ' + (closed ? 'CERRADO (funcionando)' : 'ABIERTO (no cierra)') + '\n' +
        'Tolerancia \u00B110%: ' + (rating * 1.1).toFixed(2) + ' a ' + (rating * 0.9).toFixed(2) + '"WC\n\n' +
        'Responde con:\n1. DIAGN\u00D3STICO \u2014 \u00BFEl switch est\u00E1 operando correctamente?\n2. AN\u00C1LISIS \u2014 relaci\u00F3n entre rating y presi\u00F3n medida\n3. CAUSAS si el switch no cierra o cierra fuera de tolerancia\n4. PROCEDIMIENTO de prueba con SDMN6\n5. REPARACI\u00D3N paso a paso\n6. SEGURIDAD \u2014 peligros de gas/CO';
      _mhCallIA(p, 'mhPSIAResult', 'mhPSIA');
    };
    window._mhUpdatePS();
  }

  function _drawPSBar(measured, rating, tolLow, tolHigh) {
    var el = document.getElementById('mhPSBar');
    if (!el) return;
    // Scale: 0 at right, -3.0 at left (more negative = more vacuum)
    var maxNeg = -3.5;
    var ratingPct = (rating / maxNeg) * 100;
    var tolLowPct = (tolLow / maxNeg) * 100;
    var tolHighPct = (tolHigh / maxNeg) * 100;
    var measuredPct = Math.min(Math.max((measured / maxNeg) * 100, 0), 100);
    var h = '<div style="position:relative;height:36px;background:rgba(0,0,0,0.03);border-radius:8px;overflow:hidden;">';
    // Red zone (0 to tolerance high = insufficient draft)
    h += '<div style="position:absolute;right:0;top:0;bottom:0;width:' + (100 - tolHighPct) + '%;background:' + RED + '18;"></div>';
    // Green zone (tolerance range)
    h += '<div style="position:absolute;left:' + tolLowPct + '%;top:0;bottom:0;width:' + (tolHighPct - tolLowPct) + '%;background:' + GREEN + '18;border-left:1px dashed ' + GREEN + '55;border-right:1px dashed ' + GREEN + '55;"></div>';
    // Yellow zone (beyond tolerance = excessive draft)
    h += '<div style="position:absolute;left:0;top:0;bottom:0;width:' + tolLowPct + '%;background:' + YELLOW + '12;"></div>';
    // Rating line
    h += '<div style="position:absolute;left:' + ratingPct + '%;top:0;bottom:0;width:2px;background:' + ACCENT + ';"></div>';
    // Needle (measured pressure)
    var needleColor = measured > tolHigh ? RED : measured < tolLow ? YELLOW : GREEN;
    if (measured > rating) needleColor = RED; // hasn't reached rating
    h += '<div style="position:absolute;left:' + measuredPct + '%;top:0;bottom:0;width:3px;background:' + needleColor + ';transform:translateX(-1.5px);box-shadow:0 0 8px ' + needleColor + ';">';
    h += '<div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:700;color:' + needleColor + ';white-space:nowrap;">' + measured.toFixed(2) + '</div></div>';
    h += '</div>';
    // Labels
    h += '<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:9px;">';
    h += '<span style="color:' + YELLOW + ';">' + _t('mn_ps_more_vacuum','M\u00E1s vac\u00EDo \u2190') + '</span>';
    h += '<span style="color:' + ACCENT + ';">Rating: ' + rating.toFixed(2) + '</span>';
    h += '<span style="color:' + RED + ';">' + _t('mn_ps_no_draft_label','\u2192 0"WC (sin draft)') + '</span>';
    h += '</div>';
    el.innerHTML = h;
  }

  // ============================
  // TAB 3: STATIC PRESSURE
  // ============================
  function _renderStaticPressure(c) {
    var h = '';
    h += _sdmn6('mhSPDev', 'STATIC PRESSURE', 'SUPPLY', 'TESP', '0.30', '0.50', 'inWC');
    // System type
    h += _card(_t('mn_sp_system_type','\uD83C\uDFE0 TIPO DE SISTEMA'), '' +
      '<div style="display:flex;gap:6px;">' +
      '<button id="mhSPRes" onclick="window._mhSPType=\'res\';window._mhUpdateSP()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + ACCENT + ';background:rgba(255,107,53,0.15);color:' + ACCENT + ';font-weight:700;font-size:12px;cursor:pointer;">' + _t('mn_sp_residential','Residencial') + '</button>' +
      '<button id="mhSPCom" onclick="window._mhSPType=\'com\';window._mhUpdateSP()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:12px;cursor:pointer;">' + _t('mn_sp_commercial','Comercial') + '</button>' +
      '</div>'
    );
    // TESP inputs
    h += _card(_t('mn_sp_tesp_calc','\uD83D\uDCCA TESP CALCULATOR'), '' +
      '<div style="margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Supply Static (+)</span>' +
      '<span id="mhSPSupVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.30"WC</span></div>' +
      _slider('mhSPSupSlider', 0, 1.5, 0.3, 0.01, 'window._mhUpdateSP()') +
      '</div>' +
      '<div style="margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Return Static (-)</span>' +
      '<span id="mhSPRetVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.20"WC</span></div>' +
      _slider('mhSPRetSlider', 0, 1.5, 0.2, 0.01, 'window._mhUpdateSP()') +
      '</div>' +
      '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Nameplate Rated ESP</span>' +
      '<span id="mhSPRatedVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.50"WC</span></div>' +
      _slider('mhSPRatedSlider', 0.1, 1.5, 0.5, 0.01, 'window._mhUpdateSP()') +
      '</div>'
    );
    // TESP result
    h += _card(_t('mn_sp_tesp_result','TESP RESULTADO'), '' +
      _lcdDisplay('mhSPTESP', '0.50', '"WC', 40) +
      '<div id="mhSPBar" style="margin:8px 0;"></div>' +
      '<div id="mhSPDiag" style="text-align:center;margin-top:6px;"></div>'
    );
    // Component drops
    h += _card(_t('mn_sp_component_drops','\uD83D\uDD27 CA\u00CDDAS DE PRESI\u00D3N POR COMPONENTE'), '' +
      '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">\uD83D\uDDC2\uFE0F Filtro</span>' +
      '<span id="mhSPFilterVal" style="font-family:' + LCD + ';font-size:12px;color:#111111;">0.10"WC</span></div>' +
      _slider('mhSPFilter', 0, 0.5, 0.1, 0.01, 'window._mhUpdateSP()') +
      '</div>' +
      '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">\u2744\uFE0F Coil</span>' +
      '<span id="mhSPCoilVal" style="font-family:' + LCD + ';font-size:12px;color:#111111;">0.20"WC</span></div>' +
      _slider('mhSPCoil', 0, 0.8, 0.2, 0.01, 'window._mhUpdateSP()') +
      '</div>' +
      '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">\uD83D\uDD73\uFE0F Grilles/Registers</span>' +
      '<span id="mhSPGrilleVal" style="font-family:' + LCD + ';font-size:12px;color:#111111;">0.03"WC</span></div>' +
      _slider('mhSPGrille', 0, 0.3, 0.03, 0.01, 'window._mhUpdateSP()') +
      '</div>' +
      '<div id="mhSPRemaining" style="text-align:center;margin-top:6px;font-size:12px;font-weight:700;"></div>'
    );
    // FRICTION RATE CALCULATOR
    h += _card(_t('mn_sp_fr_calc','\uD83D\uDCCF FRICTION RATE CALCULATOR'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">' + _t('mn_sp_fr_formula','FR = (ASP \u00D7 100) / TEL &nbsp;|&nbsp; Residencial ideal: 0.08\u20130.10 in.wg/100ft') + '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">\uD83D\uDCCF T.E.L. (Total Effective Length)</span>' +
      '<span id="mhSPTELVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">200 ft</span></div>' +
      _slider('mhSPTELSlider', 50, 1000, 200, 10, 'window._mhUpdateSP()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';margin-bottom:8px;"><span>50 ft</span><span>1000 ft</span></div>' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:6px;">' + _t('mn_sp_add_fittings','Sumar equivalentes de fittings:') + '</div>' +
      '<div id="mhSPFittings" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">' +
      '<button onclick="window._mhSPAddFit(15)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">90\u00B0 Elbow +15ft</button>' +
      '<button onclick="window._mhSPAddFit(7)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">45\u00B0 Elbow +7ft</button>' +
      '<button onclick="window._mhSPAddFit(35)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Tee +35ft</button>' +
      '<button onclick="window._mhSPAddFit(5)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Transition +5ft</button>' +
      '<button onclick="window._mhSPAddFit(50)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Flex +50ft</button>' +
      '</div>' +
      '<div style="text-align:center;padding:12px 0;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">FRICTION RATE</div>' +
      '<div id="mhSPFRLCD" style="font-family:' + LCD + ';font-size:42px;font-weight:900;color:#111111;letter-spacing:2px;">--</div>' +
      '<div style="font-size:13px;color:' + MUTED + ';">in.wg/100ft</div>' +
      '<div id="mhSPFRStatus" style="margin-top:6px;"></div></div>' +
      '<div style="font-size:9px;color:' + MUTED + ';text-align:center;">Residencial: 0.08\u20130.10 | Comercial: hasta 0.15 in.wg/100ft</div>'
    );
    // AI Diagnostic
    h += _mhAIButton('mhSPIA', _t('mn_sp_ai_btn','\uD83E\uDD16 Diagn\u00F3stico Static Pressure con IA'), 'window._mhSPDiagnose()');
    c.innerHTML = h;
    window._mhSPType = 'res';
    window._mhSPAddFit = function(ft) {
      var sl = document.getElementById('mhSPTELSlider');
      if (!sl) return;
      var cur = parseFloat(sl.value) || 200;
      sl.value = Math.min(cur + ft, 1000);
      window._mhUpdateSP();
    };
    window._mhUpdateSP = function() {
      var sup = parseFloat(document.getElementById('mhSPSupSlider').value);
      var ret = parseFloat(document.getElementById('mhSPRetSlider').value);
      var rated = parseFloat(document.getElementById('mhSPRatedSlider').value);
      var filter = parseFloat(document.getElementById('mhSPFilter').value);
      var coil = parseFloat(document.getElementById('mhSPCoil').value);
      var grille = parseFloat(document.getElementById('mhSPGrille').value);
      var tesp = sup + ret;
      // Update display values
      document.getElementById('mhSPSupVal').textContent = sup.toFixed(2) + '"WC';
      document.getElementById('mhSPRetVal').textContent = ret.toFixed(2) + '"WC';
      document.getElementById('mhSPRatedVal').textContent = rated.toFixed(2) + '"WC';
      document.getElementById('mhSPFilterVal').textContent = filter.toFixed(2) + '"WC';
      document.getElementById('mhSPCoilVal').textContent = coil.toFixed(2) + '"WC';
      document.getElementById('mhSPGrilleVal').textContent = grille.toFixed(2) + '"WC';
      document.getElementById('mhSPTESP').textContent = tesp.toFixed(2);
      // Type toggle styling
      var resBtn = document.getElementById('mhSPRes');
      var comBtn = document.getElementById('mhSPCom');
      if (window._mhSPType === 'res') {
        resBtn.style.borderColor = ACCENT; resBtn.style.background = 'rgba(255,107,53,0.15)'; resBtn.style.color = ACCENT;
        comBtn.style.borderColor = 'rgba(0,0,0,0.1)'; comBtn.style.background = 'transparent'; comBtn.style.color = MUTED;
      } else {
        comBtn.style.borderColor = ACCENT; comBtn.style.background = 'rgba(255,107,53,0.15)'; comBtn.style.color = ACCENT;
        resBtn.style.borderColor = 'rgba(0,0,0,0.1)'; resBtn.style.background = 'transparent'; resBtn.style.color = MUTED;
      }
      // TESP vs rated bar
      var pct = Math.min((tesp / rated) * 100, 150);
      var barColor = tesp <= rated * 0.9 ? GREEN : tesp <= rated ? YELLOW : RED;
      var barEl = document.getElementById('mhSPBar');
      barEl.innerHTML = '<div style="position:relative;height:24px;background:rgba(0,0,0,0.03);border-radius:6px;overflow:hidden;">' +
        '<div style="height:100%;width:' + Math.min(pct, 100) + '%;background:' + barColor + '33;transition:width .3s;"></div>' +
        '<div style="position:absolute;left:' + Math.min(100 / (rated > 0 ? 1 : 1) * 100 / 150, 100) + '%;top:0;bottom:0;width:2px;background:' + MUTED + ';"></div>' +
        '<div style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:13px;color:' + MUTED + ';">Rated: ' + rated.toFixed(2) + '</div>' +
        '</div>';
      // Diagnostic
      var diagEl = document.getElementById('mhSPDiag');
      var maxESP = window._mhSPType === 'res' ? 0.5 : 0.75;
      if (tesp > rated) {
        diagEl.innerHTML = _statusBadge('', _t('mn_sp_over_pressure','\u26D4 Over-pressured \u2014 TESP excede rated ESP'), RED);
      } else if (tesp > rated * 0.9) {
        diagEl.innerHTML = _statusBadge('', _t('mn_sp_near_limit','\u26A0 L\u00EDmite \u2014 TESP cerca del m\u00E1ximo'), YELLOW);
      } else {
        diagEl.innerHTML = _statusBadge('', _t('mn_sp_within_spec','\u2713 Within spec \u2014 TESP dentro de rango'), GREEN);
      }
      // Remaining
      var componentDrops = filter + coil + grille;
      var remaining = rated - componentDrops;
      var remEl = document.getElementById('mhSPRemaining');
      remEl.style.color = remaining >= 0 ? GREEN : RED;
      remEl.textContent = _t('mn_sp_avail_pressure','Presi\u00F3n disponible para ductos (ASP)') + ': ' + remaining.toFixed(2) + '"WC' + (remaining < 0 ? ' \u26A0 ' + _t('mn_sp_insufficient','INSUFICIENTE') : '');
      // Friction Rate
      var tel = parseFloat(document.getElementById('mhSPTELSlider').value) || 200;
      document.getElementById('mhSPTELVal').textContent = tel + ' ft';
      var frLCD = document.getElementById('mhSPFRLCD');
      var frStatus = document.getElementById('mhSPFRStatus');
      if (remaining > 0 && tel > 0) {
        var fr = (remaining * 100) / tel;
        frLCD.textContent = fr.toFixed(3);
        var frColor = fr <= 0.10 ? GREEN : fr <= 0.12 ? YELLOW : RED;
        frLCD.style.color = frColor;
        var frMsg = fr <= 0.10 ? _t('mn_fr_ideal','\u2713 Ideal residencial') : fr <= 0.12 ? _t('mn_fr_acceptable','\u26A0 Aceptable') : _t('mn_fr_high','\u26D4 Alto \u2014 ductos subdimensionados');
        frStatus.innerHTML = _statusBadge('', frMsg, frColor);
      } else {
        frLCD.textContent = '--'; frLCD.style.color = MUTED;
        frStatus.innerHTML = remaining <= 0 ? _statusBadge('', _t('mn_fr_no_pressure','\u26D4 Sin presi\u00F3n disponible'), RED) : '';
      }
      // Update SDMN6 LCD
      var sp1 = document.getElementById('mhSPDevP1');
      if (sp1) sp1.textContent = sup.toFixed(2);
      var sp2 = document.getElementById('mhSPDevP2');
      if (sp2) sp2.textContent = tesp.toFixed(2);
    };
    window._mhSPDiagnose = function() {
      var sup = parseFloat(document.getElementById('mhSPSupSlider').value);
      var ret = parseFloat(document.getElementById('mhSPRetSlider').value);
      var rated = parseFloat(document.getElementById('mhSPRatedSlider').value);
      var filter = parseFloat(document.getElementById('mhSPFilter').value);
      var coil = parseFloat(document.getElementById('mhSPCoil').value);
      var grille = parseFloat(document.getElementById('mhSPGrille').value);
      var tesp = sup + ret;
      var sysType = window._mhSPType === 'com' ? 'Comercial' : 'Residencial';
      var p = 'Analiza estas lecturas de presi\u00F3n est\u00E1tica de un sistema de calefacci\u00F3n/aire:\n\n' +
        'Sistema: ' + sysType + '\n' +
        'Supply Static: +' + sup.toFixed(2) + '"WC\n' +
        'Return Static: -' + ret.toFixed(2) + '"WC\n' +
        'TESP (Total External Static Pressure): ' + tesp.toFixed(2) + '"WC\n' +
        'Nameplate Rated ESP: ' + rated.toFixed(2) + '"WC\n' +
        'Ca\u00EDda filtro: ' + filter.toFixed(2) + '"WC\n' +
        'Ca\u00EDda coil: ' + coil.toFixed(2) + '"WC\n' +
        'Ca\u00EDda grilles: ' + grille.toFixed(2) + '"WC\n' +
        'Presi\u00F3n disponible ductos (ASP): ' + (rated - filter - coil - grille).toFixed(2) + '"WC\n' +
        'T.E.L. (Total Effective Length): ' + (parseFloat(document.getElementById('mhSPTELSlider').value) || 200) + ' ft\n' +
        'Friction Rate: ' + ((rated - filter - coil - grille) > 0 ? (((rated - filter - coil - grille) * 100) / (parseFloat(document.getElementById('mhSPTELSlider').value) || 200)).toFixed(3) : 'N/A') + ' in.wg/100ft\n\n' +
        'Responde con:\n1. DIAGN\u00D3STICO \u2014 \u00BFEl sistema est\u00E1 dentro de especificaci\u00F3n?\n2. FRICTION RATE \u2014 \u00BFEs adecuado para el tipo de sistema?\n3. PROBLEMAS \u2014 airflow alto/bajo, restricciones\n4. COMPONENTES a revisar (filtro, coil, ductos, dampers)\n5. SOLUCIONES paso a paso\n6. IMPACTO en eficiencia y comfort si no se corrige';
      _mhCallIA(p, 'mhSPIAResult', 'mhSPIA');
    };
    window._mhUpdateSP();
  }

  // ============================
  // TAB 4: CFM / VP / VELOCIDAD
  // ============================
  function _renderCFM(c) {
    var h = '';
    h += _sdmn6('mhCFMDev', 'VELOCITY / AIRFLOW', 'VP', 'VEL', '0.050', '895', 'inWC');
    // Mode selector
    h += _card(_t('mn_cfm_calculator','\uD83D\uDCA8 CALCULADORA CFM / VP / VELOCIDAD'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:10px;text-align:center;">' + _t('mn_cfm_formula','F\u00F3rmula: V = 4005 \u00D7 \u221AVP &nbsp;|&nbsp; CFM = V \u00D7 Area') + '</div>' +
      '<div style="display:flex;gap:4px;margin-bottom:12px;">' +
      '<button id="mhCFMMode1" onclick="window._mhCFMMode=1;window._mhUpdateCFM()" style="flex:1;padding:8px 4px;border-radius:6px;border:1.5px solid ' + ACCENT + ';background:rgba(255,107,53,0.15);color:' + ACCENT + ';font-weight:700;font-size:10px;cursor:pointer;">VP\u2192Vel\u2192CFM</button>' +
      '<button id="mhCFMMode2" onclick="window._mhCFMMode=2;window._mhUpdateCFM()" style="flex:1;padding:8px 4px;border-radius:6px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:10px;cursor:pointer;">CFM\u2192Vel\u2192VP</button>' +
      '<button id="mhCFMMode3" onclick="window._mhCFMMode=3;window._mhUpdateCFM()" style="flex:1;padding:8px 4px;border-radius:6px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:10px;cursor:pointer;">FPM+Area\u2192CFM</button>' +
      '</div>'
    );
    // Duct area input
    h += _card(_t('mn_cfm_duct_area','\uD83D\uDCD0 \u00C1REA DEL DUCTO'), '' +
      '<div style="display:flex;gap:6px;margin-bottom:8px;">' +
      '<button id="mhDuctRound" onclick="window._mhDuctShape=\'round\';window._mhUpdateCFM()" style="flex:1;padding:8px;border-radius:6px;border:1.5px solid ' + BLUE + ';background:rgba(59,130,246,0.12);color:' + BLUE + ';font-weight:700;font-size:11px;cursor:pointer;">' + _t('mn_cfm_round','Redondo') + '</button>' +
      '<button id="mhDuctRect" onclick="window._mhDuctShape=\'rect\';window._mhUpdateCFM()" style="flex:1;padding:8px;border-radius:6px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:11px;cursor:pointer;">' + _t('mn_cfm_rectangular','Rectangular') + '</button>' +
      '</div>' +
      '<div id="mhDuctInputs"></div>' +
      '<div id="mhDuctAreaResult" style="text-align:center;font-size:12px;color:' + ACCENT + ';font-weight:700;margin-top:6px;"></div>'
    );
    // VP / CFM / FPM inputs
    h += _card(_t('mn_cfm_values','\uD83D\uDD27 VALORES'), '' +
      '<div id="mhCFMInputs"></div>'
    );
    // Results
    h += _card(_t('mn_cfm_results','\uD83D\uDCCA RESULTADOS'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">' +
      '<div style="background:rgba(255,107,53,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">VELOCITY</div>' +
      '<div id="mhCFMResVel" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div>' +
      '<div style="font-size:9px;color:' + MUTED + ';">FPM</div></div>' +
      '<div style="background:rgba(59,130,246,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">AIRFLOW</div>' +
      '<div id="mhCFMResCFM" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div>' +
      '<div style="font-size:9px;color:' + MUTED + ';">CFM</div></div>' +
      '<div style="background:rgba(34,197,94,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">PRESSURE</div>' +
      '<div id="mhCFMResVP" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div>' +
      '<div style="font-size:9px;color:' + MUTED + ';">"WC VP</div></div>' +
      '</div>'
    );
    // Reference
    h += _card(_t('mn_cfm_vel_reference','\uD83D\uDCCB VELOCIDAD RECOMENDADA POR UBICACI\u00D3N'), '' +
      '<div style="font-size:13px;line-height:2;color:' + TEXT + ';">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;">' +
      '<div style="color:' + MUTED + ';">Main trunk</div><div>700\u2013900 FPM</div>' +
      '<div style="color:' + MUTED + ';">Branch duct</div><div>600\u2013700 FPM</div>' +
      '<div style="color:' + MUTED + ';">Supply register</div><div>500\u2013750 FPM</div>' +
      '<div style="color:' + MUTED + ';">Return grille</div><div>300\u2013500 FPM</div>' +
      '<div style="color:' + MUTED + ';">Flex duct</div><div>600 FPM max</div>' +
      '<div style="color:' + MUTED + ';">Filter grille</div><div>300\u2013400 FPM</div>' +
      '</div></div>'
    );
    // Friction Rate Reference
    h += _card(_t('mn_cfm_fr_reference','\uD83D\uDCCF FRICTION RATE REFERENCE'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">' + _t('mn_cfm_fr_desc','FR = ASP \u00D7 100 / TEL &nbsp;|&nbsp; Determina la velocidad m\u00E1xima en ductos') + '</div>' +
      '<div style="font-size:13px;line-height:2;color:' + TEXT + ';">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px 12px;">' +
      '<div style="color:' + ACCENT + ';font-weight:700;">FR</div><div style="color:' + ACCENT + ';font-weight:700;">Velocidad</div><div style="color:' + ACCENT + ';font-weight:700;">Uso</div>' +
      '<div>0.06</div><div>~500 FPM</div><div style="color:' + MUTED + ';">Return</div>' +
      '<div>0.08</div><div>~700 FPM</div><div style="color:' + MUTED + ';">Supply res.</div>' +
      '<div>0.10</div><div>~900 FPM</div><div style="color:' + MUTED + ';">Trunk</div>' +
      '<div>0.12</div><div>~1000 FPM</div><div style="color:' + MUTED + ';">Comercial</div>' +
      '</div></div>' +
      '<div style="margin-top:8px;padding:6px 8px;background:rgba(255,107,53,0.06);border-radius:6px;font-size:13px;color:' + MUTED + ';text-align:center;">' +
      _t('mn_cfm_fr_hint','\uD83D\uDCA1 Calcula tu Friction Rate en el tab <b style="color:#ff6b35;">Static P</b> o <b style="color:#ff6b35;">Ductos</b>') + '</div>'
    );
    // AI Diagnostic
    h += _mhAIButton('mhCFMIA', _t('mn_cfm_ai_btn','\uD83E\uDD16 An\u00E1lisis CFM/Velocidad con IA'), 'window._mhCFMDiagnose()');
    c.innerHTML = h;
    window._mhCFMMode = 1;
    window._mhDuctShape = 'round';

    window._mhUpdateCFM = function() {
      // Mode button styling
      for (var m = 1; m <= 3; m++) {
        var btn = document.getElementById('mhCFMMode' + m);
        if (m === window._mhCFMMode) {
          btn.style.borderColor = ACCENT; btn.style.background = 'rgba(255,107,53,0.15)'; btn.style.color = ACCENT;
        } else {
          btn.style.borderColor = 'rgba(0,0,0,0.1)'; btn.style.background = 'transparent'; btn.style.color = MUTED;
        }
      }
      // Duct shape styling
      var rndBtn = document.getElementById('mhDuctRound');
      var rctBtn = document.getElementById('mhDuctRect');
      if (window._mhDuctShape === 'round') {
        rndBtn.style.borderColor = BLUE; rndBtn.style.background = 'rgba(59,130,246,0.12)'; rndBtn.style.color = BLUE;
        rctBtn.style.borderColor = 'rgba(0,0,0,0.1)'; rctBtn.style.background = 'transparent'; rctBtn.style.color = MUTED;
      } else {
        rctBtn.style.borderColor = BLUE; rctBtn.style.background = 'rgba(59,130,246,0.12)'; rctBtn.style.color = BLUE;
        rndBtn.style.borderColor = 'rgba(0,0,0,0.1)'; rndBtn.style.background = 'transparent'; rndBtn.style.color = MUTED;
      }
      // Duct inputs
      var ductDiv = document.getElementById('mhDuctInputs');
      if (window._mhDuctShape === 'round') {
        var dVal = 10;
        var existD = document.getElementById('mhDuctDia');
        if (existD) dVal = parseFloat(existD.value) || 10;
        ductDiv.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cfm_diameter','Di\u00E1metro (in)') + '</span>' +
          '<span id="mhDuctDiaVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">' + dVal + '"</span></div>' +
          _slider('mhDuctDia', 4, 36, dVal, 1, 'window._mhCalcCFM()');
      } else {
        var wVal = 12, hVal = 8;
        var existW = document.getElementById('mhDuctW');
        var existH = document.getElementById('mhDuctH');
        if (existW) wVal = parseFloat(existW.value) || 12;
        if (existH) hVal = parseFloat(existH.value) || 8;
        ductDiv.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cfm_width','Ancho W (in)') + '</span>' +
          '<span id="mhDuctWVal" style="font-family:' + LCD + ';font-size:13px;font-weight:700;color:#111111;">' + wVal + '"</span></div>' +
          _slider('mhDuctW', 4, 48, wVal, 1, 'window._mhCalcCFM()') +
          '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:8px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cfm_height','Alto H (in)') + '</span>' +
          '<span id="mhDuctHVal" style="font-family:' + LCD + ';font-size:13px;font-weight:700;color:#111111;">' + hVal + '"</span></div>' +
          _slider('mhDuctH', 4, 48, hVal, 1, 'window._mhCalcCFM()');
      }
      // CFM mode inputs
      var cfmDiv = document.getElementById('mhCFMInputs');
      if (window._mhCFMMode === 1) {
        var vpV = 0.05;
        var exVP = document.getElementById('mhVPSlider');
        if (exVP) vpV = parseFloat(exVP.value) || 0.05;
        cfmDiv.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Velocity Pressure (VP)</span>' +
          '<span id="mhVPVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">' + vpV.toFixed(3) + '"WC</span></div>' +
          _slider('mhVPSlider', 0.001, 1.0, vpV, 0.001, 'window._mhCalcCFM()');
      } else if (window._mhCFMMode === 2) {
        var cfmV = 400;
        var exCFM = document.getElementById('mhCFMInput');
        if (exCFM) cfmV = parseFloat(exCFM.value) || 400;
        cfmDiv.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">CFM (Airflow)</span>' +
          '<span id="mhCFMInputVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">' + cfmV + ' CFM</span></div>' +
          _slider('mhCFMInput', 50, 5000, cfmV, 10, 'window._mhCalcCFM()');
      } else {
        var fpmV = 700;
        var exFPM = document.getElementById('mhFPMInput');
        if (exFPM) fpmV = parseFloat(exFPM.value) || 700;
        cfmDiv.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span style="font-size:13px;color:' + MUTED + ';">Velocity (FPM)</span>' +
          '<span id="mhFPMInputVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">' + fpmV + ' FPM</span></div>' +
          _slider('mhFPMInput', 100, 4000, fpmV, 10, 'window._mhCalcCFM()');
      }
      setTimeout(function() { window._mhCalcCFM(); }, 10);
    };

    window._mhCalcCFM = function() {
      // Get duct area in sq ft
      var areaSqIn, areaSqFt;
      if (window._mhDuctShape === 'round') {
        var dia = parseFloat(document.getElementById('mhDuctDia').value) || 10;
        var diaEl = document.getElementById('mhDuctDiaVal');
        if (diaEl) diaEl.textContent = dia + '"';
        areaSqIn = Math.PI * Math.pow(dia / 2, 2);
      } else {
        var w = parseFloat(document.getElementById('mhDuctW').value) || 12;
        var ht = parseFloat(document.getElementById('mhDuctH').value) || 8;
        var wEl = document.getElementById('mhDuctWVal');
        var hEl = document.getElementById('mhDuctHVal');
        if (wEl) wEl.textContent = w + '"';
        if (hEl) hEl.textContent = ht + '"';
        areaSqIn = w * ht;
      }
      areaSqFt = areaSqIn / 144;
      document.getElementById('mhDuctAreaResult').textContent = areaSqIn.toFixed(1) + ' sq in | ' + areaSqFt.toFixed(3) + ' sq ft';

      var velocity, cfm, vp;
      if (window._mhCFMMode === 1) {
        vp = parseFloat(document.getElementById('mhVPSlider').value) || 0.05;
        var vpEl = document.getElementById('mhVPVal');
        if (vpEl) vpEl.textContent = vp.toFixed(3) + '"WC';
        velocity = 4005 * Math.sqrt(vp);
        cfm = velocity * areaSqFt;
      } else if (window._mhCFMMode === 2) {
        cfm = parseFloat(document.getElementById('mhCFMInput').value) || 400;
        var cfmEl = document.getElementById('mhCFMInputVal');
        if (cfmEl) cfmEl.textContent = cfm + ' CFM';
        velocity = areaSqFt > 0 ? cfm / areaSqFt : 0;
        vp = Math.pow(velocity / 4005, 2);
      } else {
        velocity = parseFloat(document.getElementById('mhFPMInput').value) || 700;
        var fpmEl = document.getElementById('mhFPMInputVal');
        if (fpmEl) fpmEl.textContent = velocity + ' FPM';
        cfm = velocity * areaSqFt;
        vp = Math.pow(velocity / 4005, 2);
      }
      document.getElementById('mhCFMResVel').textContent = Math.round(velocity);
      document.getElementById('mhCFMResCFM').textContent = Math.round(cfm);
      document.getElementById('mhCFMResVP').textContent = vp.toFixed(3);
      // Update SDMN6 LCD
      var cp1 = document.getElementById('mhCFMDevP1');
      if (cp1) cp1.textContent = vp.toFixed(3);
      var cp2 = document.getElementById('mhCFMDevP2');
      if (cp2) cp2.textContent = Math.round(velocity);
    };

    window._mhCFMDiagnose = function() {
      var vel = document.getElementById('mhCFMResVel');
      var cfm = document.getElementById('mhCFMResCFM');
      var vp = document.getElementById('mhCFMResVP');
      var velVal = vel ? vel.textContent : '--';
      var cfmVal = cfm ? cfm.textContent : '--';
      var vpVal = vp ? vp.textContent : '--';
      var shape = window._mhDuctShape === 'rect' ? 'Rectangular' : 'Redondo';
      var area = document.getElementById('mhDuctAreaResult');
      var areaVal = area ? area.textContent : '--';
      var p = 'Analiza estas mediciones de airflow en un sistema de calefacci\u00F3n/aire:\n\n' +
        'Velocity Pressure (VP): ' + vpVal + '"WC\n' +
        'Velocidad: ' + velVal + ' FPM\n' +
        'Airflow: ' + cfmVal + ' CFM\n' +
        'Ducto: ' + shape + ' \u2014 ' + areaVal + '\n\n' +
        'Responde con:\n1. DIAGN\u00D3STICO \u2014 \u00BFEl airflow es adecuado?\n2. VELOCIDAD \u2014 \u00BFEs apropiada para la ubicaci\u00F3n del ducto?\n3. CFM \u2014 \u00BFEs suficiente para la capacidad del equipo?\n4. FRICTION RATE \u2014 Explica c\u00F3mo el FR (ASP\u00D7100/TEL) determina la velocidad aceptable en ductos\n5. RECOMENDACIONES para mejorar airflow si es necesario\n6. F\u00D3RMULAS y c\u00E1lculos de referencia';
      _mhCallIA(p, 'mhCFMIAResult', 'mhCFMIA');
    };
    window._mhUpdateCFM();
  }

  // ============================
  // TAB 5: ÁREA DE DUCTO
  // ============================
  function _renderDuctArea(c) {
    var h = '';
    h += _sdmn6('mhDADev', 'DUCT SIZING', 'AREA', 'CFM', '78.5', '379', 'sq in');
    // Round duct
    h += _card(_t('mn_da_round_duct','\u2B55 DUCTO REDONDO'), '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Di\u00E1metro (in)</span>' +
      '<span id="mhDADiaVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">10"</span></div>' +
      _slider('mhDADiaSlider', 4, 36, 10, 1, 'window._mhUpdateDuct()') +
      '<div id="mhDARoundResult" style="text-align:center;margin-top:8px;"></div>'
    );
    // Rectangular duct
    h += _card(_t('mn_da_rect_duct','\u25AD DUCTO RECTANGULAR'), '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Ancho W (in)</span>' +
      '<span id="mhDAWVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">12"</span></div>' +
      _slider('mhDAWSlider', 4, 48, 12, 1, 'window._mhUpdateDuct()') +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Alto H (in)</span>' +
      '<span id="mhDAHVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">8"</span></div>' +
      _slider('mhDAHSlider', 4, 48, 8, 1, 'window._mhUpdateDuct()') +
      '<div id="mhDARectResult" style="text-align:center;margin-top:8px;"></div>'
    );
    // Visual comparison
    h += _card(_t('mn_da_visual_compare','\uD83D\uDD0D COMPARACI\u00D3N VISUAL'), '' +
      '<div id="mhDACompare" style="display:flex;justify-content:center;gap:24px;align-items:center;padding:10px 0;"></div>'
    );
    // CFM → Size
    h += _card(_t('mn_da_cfm_to_duct','\uD83D\uDCA8 CFM \u2192 TAMA\u00D1O DE DUCTO'), '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">CFM deseado</span>' +
      '<span id="mhDACFMVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">400 CFM</span></div>' +
      _slider('mhDACFMSlider', 50, 3000, 400, 10, 'window._mhUpdateDuct()') +
      '<div style="margin-top:8px;">' +
      _selectDropdown('mhDALocation', [
        { v: '700', l: 'Main trunk (700 FPM)' },
        { v: '900', l: 'Main trunk high (900 FPM)' },
        { v: '600', l: 'Branch duct (600 FPM)' },
        { v: '500', l: 'Supply register (500 FPM)' },
        { v: '400', l: 'Return grille (400 FPM)' }
      ], 'window._mhUpdateDuct()') +
      '</div>' +
      '<div id="mhDARecommended" style="margin-top:10px;"></div>'
    );
    // Quick reference grid
    h += _card(_t('mn_da_quick_ref','\uD83D\uDCCB REFERENCIA R\u00C1PIDA: DUCTOS'), '' +
      '<div style="font-size:10px;overflow-x:auto;">' +
      '<table style="width:100%;border-collapse:collapse;min-width:260px;">' +
      '<tr style="border-bottom:1px solid rgba(0,0,0,0.05);">' +
      '<th style="text-align:left;padding:4px 6px;color:' + ACCENT + ';font-weight:700;">Duct</th>' +
      '<th style="text-align:right;padding:4px 6px;color:' + MUTED + ';">Area (sq in)</th>' +
      '<th style="text-align:right;padding:4px 6px;color:' + MUTED + ';">@700 FPM</th>' +
      '<th style="text-align:right;padding:4px 6px;color:' + MUTED + ';">@900 FPM</th></tr>' +
      _ductRefRow('6" round', 28.3) +
      _ductRefRow('8" round', 50.3) +
      _ductRefRow('10" round', 78.5) +
      _ductRefRow('12" round', 113.1) +
      _ductRefRow('14" round', 153.9) +
      _ductRefRow('8\u00D78 rect', 64) +
      _ductRefRow('10\u00D78 rect', 80) +
      _ductRefRow('12\u00D78 rect', 96) +
      _ductRefRow('14\u00D710 rect', 140) +
      _ductRefRow('16\u00D710 rect', 160) +
      '</table></div>'
    );
    // FRICTION RATE → DUCT SIZE
    h += _card(_t('mn_da_fr_to_duct','\uD83D\uDCCF FRICTION RATE \u2192 DUCT SIZE'), '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">' + _t('mn_da_fr_desc','FR = (ASP \u00D7 100) / TEL &nbsp;|&nbsp; Dado FR + CFM = tama\u00F1o de ducto \u00F3ptimo') + '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">A.S.P. (Available Static Pressure)</span>' +
      '<span id="mhDAFRASPVal" style="font-family:' + LCD + ';font-size:12px;font-weight:700;color:#111111;">0.18"WC</span></div>' +
      _slider('mhDAFRASP', 0.01, 0.50, 0.18, 0.01, 'window._mhUpdateDuctFR()') +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:6px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">T.E.L. (Total Effective Length)</span>' +
      '<span id="mhDAFRTELVal" style="font-family:' + LCD + ';font-size:12px;font-weight:700;color:#111111;">200 ft</span></div>' +
      _slider('mhDAFRTEL', 50, 1000, 200, 10, 'window._mhUpdateDuctFR()') +
      '<div style="font-size:13px;color:' + MUTED + ';margin:6px 0 4px;">' + _t('mn_da_add_fittings','Sumar equivalentes de fittings:') + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">' +
      '<button onclick="window._mhDAAddFit(15)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">90\u00B0 +15ft</button>' +
      '<button onclick="window._mhDAAddFit(7)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">45\u00B0 +7ft</button>' +
      '<button onclick="window._mhDAAddFit(35)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Tee +35ft</button>' +
      '<button onclick="window._mhDAAddFit(5)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Trans +5ft</button>' +
      '<button onclick="window._mhDAAddFit(50)" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,53,0.2);background:rgba(255,107,53,0.08);color:' + ACCENT + ';font-size:10px;font-weight:600;cursor:pointer;">Flex +50ft</button>' +
      '</div>' +
      '<div style="text-align:center;padding:10px 0;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">FRICTION RATE</div>' +
      '<div id="mhDAFRLCD" style="font-family:' + LCD + ';font-size:42px;font-weight:900;color:#111111;letter-spacing:2px;">--</div>' +
      '<div style="font-size:13px;color:' + MUTED + ';">in.wg/100ft</div>' +
      '<div id="mhDAFRStatus" style="margin-top:6px;"></div></div>' +
      '<div id="mhDAFRDuct" style="margin-top:8px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;text-align:center;font-size:12px;color:' + MUTED + ';">' + _t('mn_da_calc_fr_hint','Calcula FR para ver ducto recomendado por Friction Rate') + '</div>' +
      '<div style="margin-top:6px;font-size:9px;color:' + MUTED + ';text-align:center;">Residencial: 0.08\u20130.10 | Comercial: hasta 0.15 in.wg/100ft</div>'
    );
    // AI Diagnostic
    h += _mhAIButton('mhDAIA', _t('mn_da_ai_btn','\uD83E\uDD16 Recomendaci\u00F3n de Ductos con IA'), 'window._mhDADiagnose()');
    c.innerHTML = h;

    window._mhUpdateDuct = function() {
      var dia = parseFloat(document.getElementById('mhDADiaSlider').value) || 10;
      var w = parseFloat(document.getElementById('mhDAWSlider').value) || 12;
      var ht = parseFloat(document.getElementById('mhDAHSlider').value) || 8;
      var cfm = parseFloat(document.getElementById('mhDACFMSlider').value) || 400;
      var fpm = parseFloat(document.getElementById('mhDALocation').value) || 700;
      document.getElementById('mhDADiaVal').textContent = dia + '"';
      document.getElementById('mhDAWVal').textContent = w + '"';
      document.getElementById('mhDAHVal').textContent = ht + '"';
      document.getElementById('mhDACFMVal').textContent = cfm + ' CFM';
      // Round results
      var rArea = Math.PI * Math.pow(dia / 2, 2);
      var rAreaFt = rArea / 144;
      var rCFM700 = Math.round(rAreaFt * 700);
      var rCFM900 = Math.round(rAreaFt * 900);
      document.getElementById('mhDARoundResult').innerHTML =
        '<div style="font-size:13px;font-weight:700;color:#111111;">' + rArea.toFixed(1) + ' sq in | ' + rAreaFt.toFixed(3) + ' sq ft</div>' +
        '<div style="font-size:13px;color:' + MUTED + ';margin-top:2px;">CFM @700: ' + rCFM700 + ' | @900: ' + rCFM900 + '</div>';
      // Rect results
      var rectArea = w * ht;
      var rectAreaFt = rectArea / 144;
      var eqDia = 1.3 * Math.pow(w * ht, 0.625) / Math.pow(w + ht, 0.25);
      var rectCFM700 = Math.round(rectAreaFt * 700);
      var rectCFM900 = Math.round(rectAreaFt * 900);
      document.getElementById('mhDARectResult').innerHTML =
        '<div style="font-size:13px;font-weight:700;color:#111111;">' + rectArea.toFixed(1) + ' sq in | ' + rectAreaFt.toFixed(3) + ' sq ft</div>' +
        '<div style="font-size:13px;color:' + MUTED + ';margin-top:2px;">Eq. round: ' + eqDia.toFixed(1) + '" | CFM @700: ' + rectCFM700 + ' | @900: ' + rectCFM900 + '</div>';
      // Visual comparison
      var maxDim = 48;
      var rSize = Math.max(30, (dia / maxDim) * 90);
      var wSize = Math.max(25, (w / maxDim) * 90);
      var hSize = Math.max(20, (ht / maxDim) * 90);
      var cmpEl = document.getElementById('mhDACompare');
      cmpEl.innerHTML =
        '<div style="text-align:center;">' +
        '<div style="width:' + rSize + 'px;height:' + rSize + 'px;border-radius:50%;border:2px solid ' + BLUE + ';background:' + BLUE + '15;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:10px;color:' + BLUE + ';font-weight:700;">' + dia + '"</div>' +
        '<div style="font-size:13px;color:' + MUTED + ';">' + _t('mn_da_round_label','Redondo') + '</div></div>' +
        '<div style="font-size:12px;color:' + MUTED + ';">vs</div>' +
        '<div style="text-align:center;">' +
        '<div style="width:' + wSize + 'px;height:' + hSize + 'px;border-radius:4px;border:2px solid ' + ACCENT + ';background:' + ACCENT + '15;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:10px;color:' + ACCENT + ';font-weight:700;">' + w + '\u00D7' + ht + '</div>' +
        '<div style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cfm_rectangular','Rectangular') + '</div></div>';
      // CFM → recommended size
      var neededArea = cfm / fpm; // sq ft
      var neededSqIn = neededArea * 144;
      var neededDia = 2 * Math.sqrt(neededSqIn / Math.PI);
      var recEl = document.getElementById('mhDARecommended');
      // Round up to nearest standard size
      var stdSizes = [6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 30, 36];
      var recDia = stdSizes[stdSizes.length - 1];
      for (var i = 0; i < stdSizes.length; i++) {
        if (stdSizes[i] >= neededDia) { recDia = stdSizes[i]; break; }
      }
      // Rectangular options
      var rectOpts = [];
      var pairs = [[8,8],[10,8],[12,8],[12,10],[14,8],[14,10],[16,8],[16,10],[16,12],[18,10],[18,12],[20,10],[20,12],[24,12],[24,14],[28,14],[30,14],[36,14]];
      for (var p = 0; p < pairs.length; p++) {
        if (pairs[p][0] * pairs[p][1] >= neededSqIn) {
          rectOpts.push(pairs[p][0] + '\u00D7' + pairs[p][1]);
          if (rectOpts.length >= 3) break;
        }
      }
      recEl.innerHTML =
        '<div style="background:rgba(255,107,53,0.08);border-radius:8px;padding:10px;">' +
        '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">' + _t('mn_da_needed_area','\u00C1rea necesaria') + ': ' + neededSqIn.toFixed(1) + ' sq in (' + neededArea.toFixed(3) + ' sq ft)</div>' +
        '<div style="font-size:13px;font-weight:700;color:#111111;">' + _t('mn_da_round_label','Redondo') + ': <span style="color:' + BLUE + ';">' + recDia + '"</span> ' + _t('mn_da_diameter','di\u00E1metro') + '</div>' +
        (rectOpts.length > 0 ? '<div style="font-size:13px;font-weight:700;color:#111111;margin-top:2px;">Rectangular: <span style="color:' + ACCENT + ';">' + rectOpts.join(' / ') + '"</span></div>' : '') +
        '</div>';
      // Update SDMN6 LCD
      var dp1 = document.getElementById('mhDADevP1');
      if (dp1) dp1.textContent = rArea.toFixed(1);
      var dp2 = document.getElementById('mhDADevP2');
      if (dp2) dp2.textContent = rCFM700;
    };
    window._mhDAAddFit = function(ft) {
      var sl = document.getElementById('mhDAFRTEL');
      if (!sl) return;
      sl.value = Math.min(parseFloat(sl.value) + ft, 1000);
      window._mhUpdateDuctFR();
    };
    window._mhUpdateDuctFR = function() {
      var asp = parseFloat(document.getElementById('mhDAFRASP').value) || 0.18;
      var tel = parseFloat(document.getElementById('mhDAFRTEL').value) || 200;
      document.getElementById('mhDAFRASPVal').textContent = asp.toFixed(2) + '"WC';
      document.getElementById('mhDAFRTELVal').textContent = tel + ' ft';
      var frLCD = document.getElementById('mhDAFRLCD');
      var frStatus = document.getElementById('mhDAFRStatus');
      var frDuct = document.getElementById('mhDAFRDuct');
      if (asp > 0 && tel > 0) {
        var fr = (asp * 100) / tel;
        var frColor = fr <= 0.10 ? GREEN : fr <= 0.12 ? YELLOW : RED;
        frLCD.textContent = fr.toFixed(3); frLCD.style.color = frColor;
        var frMsg = fr <= 0.10 ? _t('mn_fr_ideal','\u2713 Ideal residencial') : fr <= 0.12 ? _t('mn_fr_acceptable','\u26A0 Aceptable') : _t('mn_fr_high','\u26D4 Alto \u2014 ductos subdimensionados');
        frStatus.innerHTML = _statusBadge('', frMsg, frColor);
        // FR-based duct sizing using CFM from the slider above
        var cfm = parseFloat(document.getElementById('mhDACFMSlider').value) || 400;
        // Velocity from FR lookup (approximate)
        var vel = fr <= 0.06 ? 500 : fr <= 0.08 ? 700 : fr <= 0.10 ? 900 : fr <= 0.12 ? 1000 : 1100;
        var neededSqIn = (cfm / vel) * 144;
        var neededDia = 2 * Math.sqrt(neededSqIn / Math.PI);
        var stdSizes = [6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 30, 36];
        var recDia = stdSizes[stdSizes.length - 1];
        for (var i = 0; i < stdSizes.length; i++) { if (stdSizes[i] >= neededDia) { recDia = stdSizes[i]; break; } }
        var pairs = [[8,8],[10,8],[12,8],[12,10],[14,8],[14,10],[16,8],[16,10],[16,12],[18,10],[18,12],[20,10],[20,12],[24,12],[24,14],[28,14]];
        var rectOpt = '';
        for (var p = 0; p < pairs.length; p++) { if (pairs[p][0] * pairs[p][1] >= neededSqIn) { rectOpt = pairs[p][0] + '\u00D7' + pairs[p][1]; break; } }
        frDuct.innerHTML = '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;">CFM: ' + cfm + ' | Vel @FR: ~' + vel + ' FPM</div>' +
          '<div style="font-size:16px;font-weight:900;color:#111111;">' + _t('mn_da_round_label','Redondo') + ': <span style="color:' + BLUE + ';">' + recDia + '"</span></div>' +
          (rectOpt ? '<div style="font-size:13px;font-weight:700;color:#111111;margin-top:2px;">' + _t('mn_cfm_rectangular','Rectangular') + ': <span style="color:' + ACCENT + ';">' + rectOpt + '"</span></div>' : '');
      } else {
        frLCD.textContent = '--'; frLCD.style.color = MUTED;
        frStatus.innerHTML = '';
        frDuct.innerHTML = '<div style="font-size:12px;color:' + MUTED + ';">' + _t('mn_da_enter_asp_tel','Ingresa ASP y TEL para calcular') + '</div>';
      }
    };
    window._mhDADiagnose = function() {
      var dia = parseFloat(document.getElementById('mhDADiaSlider').value) || 10;
      var w = parseFloat(document.getElementById('mhDAWSlider').value) || 12;
      var ht = parseFloat(document.getElementById('mhDAHSlider').value) || 8;
      var cfm = parseFloat(document.getElementById('mhDACFMSlider').value) || 400;
      var loc = document.getElementById('mhDALocation');
      var locText = loc ? loc.options[loc.selectedIndex].text : 'Main trunk';
      var rArea = Math.PI * Math.pow(dia / 2, 2);
      var rectArea = w * ht;
      var frASP = parseFloat((document.getElementById('mhDAFRASP') || {}).value) || 0;
      var frTEL = parseFloat((document.getElementById('mhDAFRTEL') || {}).value) || 200;
      var frVal = (frASP > 0 && frTEL > 0) ? ((frASP * 100) / frTEL).toFixed(3) : 'N/A';
      var p = 'Analiza este dimensionamiento de ductos para un sistema de calefacci\u00F3n/aire:\n\n' +
        'Ducto redondo: ' + dia + '" di\u00E1metro (' + rArea.toFixed(1) + ' sq in)\n' +
        'Ducto rectangular: ' + w + '\u00D7' + ht + '" (' + rectArea + ' sq in)\n' +
        'CFM requerido: ' + cfm + ' CFM\n' +
        'Ubicaci\u00F3n: ' + locText + '\n' +
        'Friction Rate: ' + frVal + ' in.wg/100ft (ASP=' + frASP.toFixed(2) + ', TEL=' + frTEL + 'ft)\n\n' +
        'Responde con:\n1. DIAGN\u00D3STICO \u2014 \u00BFEl tama\u00F1o del ducto es adecuado para el CFM?\n2. FRICTION RATE \u2014 \u00BFEl FR es apropiado? \u00BFQu\u00E9 velocidad sugiere?\n3. TAMA\u00D1O RECOMENDADO \u2014 redondo y rectangular ideales basados en FR\n4. VELOCIDAD resultante \u2014 \u00BFes apropiada para la ubicaci\u00F3n?\n5. PROBLEMAS si el ducto es muy peque\u00F1o o muy grande\n6. BEST PRACTICES para instalaci\u00F3n de ductos';
      _mhCallIA(p, 'mhDAIAResult', 'mhDAIA');
    };
    window._mhUpdateDuct();
    window._mhUpdateDuctFR();
  }

  function _ductRefRow(label, areaSqIn) {
    var areaFt = areaSqIn / 144;
    var cfm700 = Math.round(areaFt * 700);
    var cfm900 = Math.round(areaFt * 900);
    return '<tr style="border-bottom:1px solid rgba(0,0,0,0.03);">' +
      '<td style="padding:4px 6px;color:#111111;">' + label + '</td>' +
      '<td style="text-align:right;padding:4px 6px;color:' + MUTED + ';">' + areaSqIn.toFixed(1) + '</td>' +
      '<td style="text-align:right;padding:4px 6px;color:' + GREEN + ';">' + cfm700 + '</td>' +
      '<td style="text-align:right;padding:4px 6px;color:' + BLUE + ';">' + cfm900 + '</td></tr>';
  }

  // ============================
  // TAB 6: CLOCK METER
  // ============================
  function _renderClockMeter(c) {
    var h = '';
    h += _sdmn6('mhCMDev', 'CLOCK METER', 'CFH', 'BTU/HR', '0', '0', 'cf/hr');
    // Gas type
    h += _card(_t('mn_cm_gas_type','\uD83D\uDD25 TIPO DE GAS'), '' +
      '<div style="display:flex;gap:6px;margin-bottom:8px;">' +
      '<button id="mhCMNG" onclick="window._mhCMGas=\'ng\';window._mhUpdateCM()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid ' + ACCENT + ';background:rgba(255,107,53,0.15);color:' + ACCENT + ';font-weight:700;font-size:13px;cursor:pointer;">Natural Gas</button>' +
      '<button id="mhCMLP" onclick="window._mhCMGas=\'lp\';window._mhUpdateCM()" style="flex:1;padding:10px;border-radius:8px;border:1.5px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-weight:600;font-size:13px;cursor:pointer;">LP Propane</button>' +
      '</div>' +
      '<div id="mhCMGasInfo" style="font-size:13px;color:' + MUTED + ';text-align:center;">Natural Gas = 1,000 BTU/cf</div>'
    );
    // Meter CF per revolution
    h += _card(_t('mn_cm_meter_config','\u2699\uFE0F CONFIGURACI\u00D3N DEL MEDIDOR'), '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cm_cf_per_rev','CF por revoluci\u00F3n') + '</span>' +
      '<span id="mhCMCFVal" style="font-family:' + LCD + ';font-size:15px;font-weight:700;color:#111111;">1.0 cf</span></div>' +
      _slider('mhCMCFSlider', 0.5, 5, 1, 0.5, 'window._mhUpdateCM()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>0.5 cf</span><span>5.0 cf</span></div>'
    );
    // Timer
    h += _card(_t('mn_cm_timer','\u23F1\uFE0F CRON\u00D3METRO'), '' +
      '<div style="text-align:center;padding:10px 0;">' +
      '<div id="mhCMTimer" style="font-family:' + LCD + ';font-size:48px;font-weight:900;color:#33ff33;letter-spacing:3px;text-shadow:0 0 10px rgba(51,255,51,0.3);">0.0</div>' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-top:4px;">' + _t('mn_cm_sec_per_rev','segundos por revoluci\u00F3n') + '</div></div>' +
      '<div style="display:flex;gap:8px;margin-top:10px;">' +
      '<button id="mhCMStartBtn" onclick="window._mhCMStart()" style="flex:1;padding:12px;border-radius:8px;border:none;background:' + GREEN + ';color:#fff;font-weight:800;font-size:14px;cursor:pointer;">\u25B6 START</button>' +
      '<button onclick="window._mhCMStop()" style="flex:1;padding:12px;border-radius:8px;border:none;background:' + RED + ';color:#fff;font-weight:800;font-size:14px;cursor:pointer;">\u25A0 STOP</button>' +
      '<button onclick="window._mhCMReset()" style="flex:0.6;padding:12px;border-radius:8px;border:none;background:rgba(0,0,0,0.1);color:' + MUTED + ';font-weight:700;font-size:12px;cursor:pointer;">RESET</button>' +
      '</div>' +
      '<div style="margin-top:12px;font-size:13px;color:' + MUTED + ';text-align:center;">' + _t('mn_cm_manual_time','O ingresar tiempo manualmente:') + '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:6px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">' + _t('mn_cm_seconds_per_rev','Segundos por rev') + '</span>' +
      '<span id="mhCMSecVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">30 sec</span></div>' +
      _slider('mhCMSecSlider', 5, 300, 30, 1, 'window._mhUpdateCM()')
    );
    // Nameplate
    h += _card(_t('mn_cm_nameplate','\uD83D\uDCCB NAMEPLATE INPUT'), '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">BTU/hr Input (nameplate)</span>' +
      '<span id="mhCMNameVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">80,000</span></div>' +
      _slider('mhCMNameSlider', 20000, 200000, 80000, 1000, 'window._mhUpdateCM()') +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:' + MUTED + ';"><span>20K</span><span>200K BTU/hr</span></div>'
    );
    // Results
    h += _card(_t('mn_cm_results','\uD83D\uDCCA RESULTADOS'), '' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center;">' +
      '<div style="background:rgba(255,107,53,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">CF/HOUR</div>' +
      '<div id="mhCMResCFH" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div></div>' +
      '<div style="background:rgba(59,130,246,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">BTU/HR INPUT</div>' +
      '<div id="mhCMResBTU" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div></div>' +
      '<div style="background:rgba(34,197,94,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">NAMEPLATE</div>' +
      '<div id="mhCMResName" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div></div>' +
      '<div style="background:rgba(234,179,8,0.08);border-radius:8px;padding:10px;">' +
      '<div style="font-size:9px;color:' + MUTED + ';margin-bottom:4px;">VARIANCE</div>' +
      '<div id="mhCMResVar" style="font-family:' + LCD + ';font-size:22px;font-weight:900;color:#111111;">--</div></div>' +
      '</div>' +
      '<div id="mhCMDiag" style="text-align:center;margin-top:10px;"></div>'
    );
    // Reference
    h += _card(_t('mn_cm_reference','\uD83D\uDCCB REFERENCIA: CLOCK METER'), '' +
      '<div style="font-size:13px;line-height:1.8;color:' + TEXT + ';">' +
      '<div style="color:' + ACCENT + ';font-weight:700;">' + _t('mn_cm_procedure','Procedimiento:') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step1','1. Apagar TODOS los aparatos de gas excepto el horno') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step2','2. Encender el horno a fuego m\u00E1ximo') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step3','3. Localizar el medidor de gas exterior') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step4','4. Identificar la aguja m\u00E1s peque\u00F1a (test dial)') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step5','5. Cronometrar 1 revoluci\u00F3n completa') + '</div>' +
      '<div style="color:' + MUTED + ';">' + _t('mn_cm_step6','6. Calcular BTU/hr input') + '</div>' +
      '<div style="margin-top:6px;color:' + ACCENT2 + ';font-weight:700;">' + _t('mn_cm_formula_label','F\u00F3rmula:') + '</div>' +
      '<div style="color:' + TEXT + ';">CFH = (3600 \u00F7 segundos) \u00D7 cf/rev</div>' +
      '<div style="color:' + TEXT + ';">BTU/hr = CFH \u00D7 BTU/cf</div>' +
      '<div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;">' +
      '<div style="color:' + BLUE + ';font-weight:700;grid-column:1/-1;">BTU por cubic foot:</div>' +
      '<div style="color:' + MUTED + ';">Natural Gas</div><div>1,000 BTU/cf</div>' +
      '<div style="color:' + MUTED + ';">LP Propane</div><div>2,516 BTU/cf</div>' +
      '</div></div>'
    );
    // AI
    h += _mhAIButton('mhCMIA', _t('mn_cm_ai_btn','\uD83E\uDD16 Diagn\u00F3stico Clock Meter con IA'), 'window._mhCMDiagnose()');
    c.innerHTML = h;
    window._mhCMGas = 'ng';
    window._mhUpdateCM = function() {
      var gas = window._mhCMGas;
      var cfRev = parseFloat(document.getElementById('mhCMCFSlider').value);
      var sec = parseFloat(document.getElementById('mhCMSecSlider').value);
      var nameplate = parseFloat(document.getElementById('mhCMNameSlider').value);
      var btuPerCF = gas === 'lp' ? 2516 : 1000;
      document.getElementById('mhCMCFVal').textContent = cfRev.toFixed(1) + ' cf';
      document.getElementById('mhCMSecVal').textContent = sec + ' sec';
      document.getElementById('mhCMNameVal').textContent = nameplate.toLocaleString();
      // Toggle styling
      var ngB = document.getElementById('mhCMNG'), lpB = document.getElementById('mhCMLP');
      if (gas === 'ng') {
        ngB.style.borderColor = ACCENT; ngB.style.background = 'rgba(255,107,53,0.15)'; ngB.style.color = ACCENT;
        lpB.style.borderColor = 'rgba(0,0,0,0.1)'; lpB.style.background = 'transparent'; lpB.style.color = MUTED;
        document.getElementById('mhCMGasInfo').textContent = 'Natural Gas = 1,000 BTU/cf';
      } else {
        lpB.style.borderColor = ACCENT; lpB.style.background = 'rgba(255,107,53,0.15)'; lpB.style.color = ACCENT;
        ngB.style.borderColor = 'rgba(0,0,0,0.1)'; ngB.style.background = 'transparent'; ngB.style.color = MUTED;
        document.getElementById('mhCMGasInfo').textContent = 'LP Propane = 2,516 BTU/cf';
      }
      // Calculate
      var cfh = sec > 0 ? (3600 / sec) * cfRev : 0;
      var btuInput = cfh * btuPerCF;
      var variance = nameplate > 0 ? ((btuInput - nameplate) / nameplate * 100) : 0;
      document.getElementById('mhCMResCFH').textContent = Math.round(cfh);
      document.getElementById('mhCMResBTU').textContent = Math.round(btuInput).toLocaleString();
      document.getElementById('mhCMResName').textContent = nameplate.toLocaleString();
      var varEl = document.getElementById('mhCMResVar');
      varEl.textContent = (variance >= 0 ? '+' : '') + variance.toFixed(1) + '%';
      varEl.style.color = Math.abs(variance) <= 5 ? GREEN : Math.abs(variance) <= 10 ? YELLOW : RED;
      var diagEl = document.getElementById('mhCMDiag');
      if (Math.abs(variance) <= 5) diagEl.innerHTML = _statusBadge('', _t('mn_cm_within_5','\u2713 Dentro de \u00B15% \u2014 firing rate correcto'), GREEN);
      else if (variance > 5) diagEl.innerHTML = _statusBadge('', '\u26A0 Over-fired +' + variance.toFixed(1) + '% \u2014 ' + _t('mn_cm_adjust_valve','ajustar gas valve'), RED);
      else diagEl.innerHTML = _statusBadge('', '\u26A0 Under-fired ' + variance.toFixed(1) + '% \u2014 ' + _t('mn_cm_check_pressure','verificar gas pressure'), YELLOW);
      // SDMN6
      var dp1 = document.getElementById('mhCMDevP1'); if (dp1) dp1.textContent = Math.round(cfh);
      var dp2 = document.getElementById('mhCMDevP2'); if (dp2) dp2.textContent = Math.round(btuInput);
    };
    // Timer
    window._mhCMStart = function() {
      if (_clockRunning) return;
      _clockRunning = true;
      _clockStartTime = Date.now() - (_clockElapsed * 1000);
      var btn = document.getElementById('mhCMStartBtn');
      if (btn) { btn.style.background = YELLOW; btn.textContent = '\u23F1 RUNNING...'; }
      _clockTimer = setInterval(function() {
        _clockElapsed = (Date.now() - _clockStartTime) / 1000;
        var t = document.getElementById('mhCMTimer');
        if (t) t.textContent = _clockElapsed.toFixed(1);
      }, 100);
    };
    window._mhCMStop = function() {
      if (!_clockRunning) return;
      _clockRunning = false;
      if (_clockTimer) { clearInterval(_clockTimer); _clockTimer = null; }
      var btn = document.getElementById('mhCMStartBtn');
      if (btn) { btn.style.background = GREEN; btn.textContent = '\u25B6 START'; }
      document.getElementById('mhCMSecSlider').value = Math.max(5, Math.min(300, Math.round(_clockElapsed)));
      window._mhUpdateCM();
    };
    window._mhCMReset = function() {
      _clockRunning = false; _clockElapsed = 0;
      if (_clockTimer) { clearInterval(_clockTimer); _clockTimer = null; }
      var t = document.getElementById('mhCMTimer'); if (t) t.textContent = '0.0';
      var btn = document.getElementById('mhCMStartBtn');
      if (btn) { btn.style.background = GREEN; btn.textContent = '\u25B6 START'; }
    };
    window._mhCMDiagnose = function() {
      var gas = window._mhCMGas === 'lp' ? 'LP Propane' : 'Natural Gas';
      var sec = parseFloat(document.getElementById('mhCMSecSlider').value);
      var cfRev = parseFloat(document.getElementById('mhCMCFSlider').value);
      var np = parseFloat(document.getElementById('mhCMNameSlider').value);
      var bpc = window._mhCMGas === 'lp' ? 2516 : 1000;
      var cfh = sec > 0 ? (3600 / sec) * cfRev : 0;
      var btu = cfh * bpc;
      var v = np > 0 ? ((btu - np) / np * 100) : 0;
      var p = 'Analiza esta medici\u00F3n de clock meter de un horno:\n\nGas: ' + gas + '\nCF/rev: ' + cfRev + '\nTiempo/rev: ' + sec + ' seg\nCFH: ' + Math.round(cfh) + '\nBTU/hr calculado: ' + Math.round(btu).toLocaleString() + '\nNameplate: ' + np.toLocaleString() + '\nVariaci\u00F3n: ' + v.toFixed(1) + '%\n\nResponde:\n1. DIAGN\u00D3STICO \u2014 \u00BFfiring rate correcto?\n2. AN\u00C1LISIS \u2014 over/under-fired\n3. CAUSAS posibles\n4. AJUSTE del gas valve\n5. SEGURIDAD';
      _mhCallIA(p, 'mhCMIAResult', 'mhCMIA');
    };
    window._mhUpdateCM();
  }

  // ============================
  // TAB 7: SYSTEM PERFORMANCE (HeatMaxx NCI Method)
  // ============================
  function _renderSystemPerf(c) {
    var h = '';
    // Header
    h += '<div style="text-align:center;padding:10px 0 14px;border-bottom:1px solid rgba(255,107,53,0.15);margin-bottom:12px;">';
    h += '<div style="font-size:16px;font-weight:900;color:#111111;">' + _t('mn_spf_title','Heating System Performance') + '</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';">' + _t('mn_spf_subtitle','Initial Test \u2014 NCI Method (HeatMaxx\u2122)') + '</div></div>';
    // 1) SYSTEM PRESSURES
    h += _card('1\uFE0F\u20E3 SYSTEM PRESSURES', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:10px;">Rated fan total static pressure vs measured TESP</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Max pressure rating</span>' +
      '<span id="spfMaxVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.50"WC</span></div>' +
      _slider('spfMax', 0.1, 1.5, 0.5, 0.01, 'window._mhUpdateSPF()') +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Measured static pressure</span>' +
      '<span id="spfMeasVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.42"WC</span></div>' +
      _slider('spfMeas', 0, 1.5, 0.42, 0.01, 'window._mhUpdateSPF()') +
      '<div id="spf1Status" style="text-align:center;margin-top:6px;"></div>'
    );
    // 2) FILTER RESISTANCE
    h += _card('2\uFE0F\u20E3 FILTER RESISTANCE', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:10px;">Max filter drop by fan type</div>' +
      '<div style="display:flex;gap:4px;margin-bottom:10px;">' +
      '<button id="spfFanCS" onclick="window._spfFan=20;window._mhUpdateSPF()" style="flex:1;padding:6px;border-radius:6px;border:1px solid ' + ACCENT + ';background:rgba(255,107,53,0.12);color:' + ACCENT + ';font-size:9px;font-weight:700;cursor:pointer;">CSF 20%</button>' +
      '<button id="spfFanVS" onclick="window._spfFan=40;window._mhUpdateSPF()" style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-size:9px;font-weight:600;cursor:pointer;">VSF 40%</button>' +
      '<button id="spfFanHP" onclick="window._spfFan=50;window._mhUpdateSPF()" style="flex:1;padding:6px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-size:9px;font-weight:600;cursor:pointer;">HP 50%</button>' +
      '</div>' +
      '<div id="spf2MaxDrop" style="font-size:12px;color:' + TEXT + ';text-align:center;margin-bottom:8px;"></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Actual filter drop</span>' +
      '<span id="spfFilterVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">0.08"WC</span></div>' +
      _slider('spfFilter', 0, 0.8, 0.08, 0.01, 'window._mhUpdateSPF()') +
      '<div id="spf2Status" style="text-align:center;margin-top:6px;"></div>'
    );
    // 3) FAN AIRFLOW
    h += _card('3\uFE0F\u20E3 FAN AIRFLOW', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:10px;">Required airflow by furnace type</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">' +
      '<button id="spfTypeND" onclick="window._spfType=100;window._mhUpdateSPF()" style="padding:6px 8px;border-radius:6px;border:1px solid ' + ACCENT + ';background:rgba(255,107,53,0.12);color:' + ACCENT + ';font-size:9px;font-weight:700;cursor:pointer;">Nat Draft 100</button>' +
      '<button id="spfTypeID" onclick="window._spfType=130;window._mhUpdateSPF()" style="padding:6px 8px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-size:9px;font-weight:600;cursor:pointer;">Induced 130</button>' +
      '<button id="spfTypeCF" onclick="window._spfType=150;window._mhUpdateSPF()" style="padding:6px 8px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:transparent;color:' + MUTED + ';font-size:9px;font-weight:600;cursor:pointer;">Condensing 150</button>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Rated BTU Input</span>' +
      '<span id="spfBTUInVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">80,000</span></div>' +
      _slider('spfBTUIn', 20000, 200000, 80000, 1000, 'window._mhUpdateSPF()') +
      '<div id="spf3Calc" style="font-size:11px;color:' + TEXT + ';text-align:center;margin:8px 0;"></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Plotted fan airflow (CFM)</span>' +
      '<span id="spfPlotVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">1,200</span></div>' +
      _slider('spfPlot', 200, 5000, 1200, 10, 'window._mhUpdateSPF()') +
      '<div id="spf3Status" style="text-align:center;margin-top:6px;"></div>'
    );
    // 4) TEMPERATURES
    h += _card('4\uFE0F\u20E3 TEMPERATURES', '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Outdoor temperature</span>' +
      '<span id="spfOutVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">35\u00B0F</span></div>' +
      _slider('spfOut', -20, 80, 35, 1, 'window._mhUpdateSPF()') +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Avg supply register temp</span>' +
      '<span id="spfSupTVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">120\u00B0F</span></div>' +
      _slider('spfSupT', 80, 180, 120, 1, 'window._mhUpdateSPF()') +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;margin-top:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Avg return grille temp</span>' +
      '<span id="spfRetTVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">70\u00B0F</span></div>' +
      _slider('spfRetT', 50, 100, 70, 1, 'window._mhUpdateSPF()') +
      '<div style="text-align:center;margin-top:10px;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">TEMPERATURE RISE</div>' +
      '<div id="spfRise" style="font-family:' + LCD + ';font-size:36px;font-weight:900;color:#111111;">50\u00B0F</div>' +
      '<div id="spf4Status" style="margin-top:4px;"></div></div>'
    );
    // 5) BTU/HR DELIVERY
    h += _card('5\uFE0F\u20E3 HEATING BTU/HR DELIVERY', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">Fan Plotted Airflow \u00D7 Temp Rise \u00D7 1.08 = Delivered BTU/hr</div>' +
      '<div id="spf5Calc" style="font-size:12px;color:' + TEXT + ';text-align:center;line-height:2;"></div>' +
      '<div style="text-align:center;margin-top:8px;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">DELIVERED BTU/HR</div>' +
      '<div id="spfDelivered" style="font-family:' + LCD + ';font-size:36px;font-weight:900;color:' + ACCENT + ';">--</div></div>'
    );
    // 6) EQUIPMENT CAPACITY
    h += _card('6\uFE0F\u20E3 HEATING EQUIPMENT CAPACITY', '' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Rated BTU Output</span>' +
      '<span id="spfOutputVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">64,000</span></div>' +
      _slider('spfOutput', 15000, 180000, 64000, 1000, 'window._mhUpdateSPF()') +
      '<div style="font-size:9px;color:' + MUTED + ';text-align:center;margin-top:4px;">Gas furnace rated BTU output | HP: rated BTU under current outdoor conditions | Heat strips: kW \u00D7 3,413</div>'
    );
    // 7) EFFICIENCY
    h += _card('7\uFE0F\u20E3 SYSTEM HEATING EFFECTIVE EFFICIENCY', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">Delivered BTU \u00F7 Rated BTU Output \u00D7 100</div>' +
      '<div id="spf7Calc" style="font-size:12px;color:' + TEXT + ';text-align:center;line-height:2;"></div>' +
      '<div style="text-align:center;margin-top:8px;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">SYSTEM EFFECTIVE EFFICIENCY</div>' +
      '<div id="spfEff" style="font-family:' + LCD + ';font-size:48px;font-weight:900;color:#111111;">--</div>' +
      '<div id="spf7Status" style="margin-top:6px;"></div></div>' +
      '<div style="margin-top:10px;padding:8px;background:rgba(255,107,53,0.06);border-radius:8px;font-size:13px;color:' + MUTED + ';text-align:center;line-height:1.6;">' + _t('mn_spf_nci_note','Seg\u00FAn NCI Standards, el BTU delivery aceptable debe alcanzar o superar el 90% de la capacidad BTU/HR del equipo.') + '</div>'
    );
    // 8) FRICTION RATE CHECK
    h += _card('8\uFE0F\u20E3 FRICTION RATE CHECK', '' +
      '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">FR valida que los ductos puedan entregar el airflow calculado</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">Coil Drop (default)</span>' +
      '<span style="font-size:11px;color:#111111;font-weight:600;">0.20"WC</span></div>' +
      '<div id="spfFRASP" style="font-size:12px;color:' + MUTED + ';margin-bottom:8px;text-align:center;">ASP = Rated ESP - Filter - Coil = --</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';">T.E.L. (Total Effective Length)</span>' +
      '<span id="spfTELVal" style="font-family:' + LCD + ';font-size:14px;font-weight:700;color:#111111;">200 ft</span></div>' +
      _slider('spfTEL', 50, 1000, 200, 10, 'window._mhUpdateSPF()') +
      '<div style="text-align:center;padding:10px 0;">' +
      '<div style="font-size:13px;color:' + MUTED + ';">FRICTION RATE</div>' +
      '<div id="spfFRLCD" style="font-family:' + LCD + ';font-size:42px;font-weight:900;color:#111111;letter-spacing:2px;">--</div>' +
      '<div style="font-size:13px;color:' + MUTED + ';">in.wg/100ft</div>' +
      '<div id="spfFRStatus" style="margin-top:6px;"></div></div>'
    );
    // AI
    h += _mhAIButton('spfIA', _t('mn_spf_ai_btn','\uD83E\uDD16 System Performance Analysis con IA'), 'window._mhSPFDiagnose()');
    c.innerHTML = h;
    window._spfFan = 20;
    window._spfType = 100;
    window._mhUpdateSPF = function() {
      var maxP = parseFloat(document.getElementById('spfMax').value);
      var measP = parseFloat(document.getElementById('spfMeas').value);
      var fDrop = parseFloat(document.getElementById('spfFilter').value);
      var btuIn = parseFloat(document.getElementById('spfBTUIn').value);
      var plotted = parseFloat(document.getElementById('spfPlot').value);
      var outT = parseFloat(document.getElementById('spfOut').value);
      var supT = parseFloat(document.getElementById('spfSupT').value);
      var retT = parseFloat(document.getElementById('spfRetT').value);
      var ratedOut = parseFloat(document.getElementById('spfOutput').value);
      var fanPct = window._spfFan;
      var cfm10k = window._spfType;
      // Labels
      document.getElementById('spfMaxVal').textContent = maxP.toFixed(2) + '"WC';
      document.getElementById('spfMeasVal').textContent = measP.toFixed(2) + '"WC';
      document.getElementById('spfFilterVal').textContent = fDrop.toFixed(2) + '"WC';
      document.getElementById('spfBTUInVal').textContent = btuIn.toLocaleString();
      document.getElementById('spfPlotVal').textContent = plotted.toLocaleString();
      document.getElementById('spfOutputVal').textContent = ratedOut.toLocaleString();
      document.getElementById('spfOutVal').textContent = outT + '\u00B0F';
      document.getElementById('spfSupTVal').textContent = supT + '\u00B0F';
      document.getElementById('spfRetTVal').textContent = retT + '\u00B0F';
      // Button styling
      [['spfFanCS',20],['spfFanVS',40],['spfFanHP',50]].forEach(function(b) {
        var el = document.getElementById(b[0]);
        if (fanPct === b[1]) { el.style.borderColor = ACCENT; el.style.background = 'rgba(255,107,53,0.12)'; el.style.color = ACCENT; }
        else { el.style.borderColor = 'rgba(0,0,0,0.1)'; el.style.background = 'transparent'; el.style.color = MUTED; }
      });
      [['spfTypeND',100],['spfTypeID',130],['spfTypeCF',150]].forEach(function(b) {
        var el = document.getElementById(b[0]);
        if (cfm10k === b[1]) { el.style.borderColor = ACCENT; el.style.background = 'rgba(255,107,53,0.12)'; el.style.color = ACCENT; }
        else { el.style.borderColor = 'rgba(0,0,0,0.1)'; el.style.background = 'transparent'; el.style.color = MUTED; }
      });
      // 1) Pressures
      var s1 = document.getElementById('spf1Status');
      s1.innerHTML = measP <= maxP ? _statusBadge('', '\u2713 Dentro de spec (' + measP.toFixed(2) + ' \u2264 ' + maxP.toFixed(2) + ')', GREEN) : _statusBadge('', '\u26D4 Over-pressured (' + measP.toFixed(2) + ' > ' + maxP.toFixed(2) + ')', RED);
      // 2) Filter
      var maxFD = maxP * (fanPct / 100);
      document.getElementById('spf2MaxDrop').innerHTML = 'Max drop: ' + maxP.toFixed(2) + ' \u00D7 ' + fanPct + '% = <b style="color:' + ACCENT + ';">' + maxFD.toFixed(2) + '"WC</b>';
      document.getElementById('spf2Status').innerHTML = fDrop <= maxFD ? _statusBadge('', _t('mn_spf_filter_ok','\u2713 Filter OK'), GREEN) : _statusBadge('', _t('mn_spf_filter_excess','\u26A0 Filtro excesivo \u2014 cambiar'), RED);
      // 3) Airflow
      var reqCFM = (btuIn / 10000) * cfm10k;
      document.getElementById('spf3Calc').innerHTML = btuIn.toLocaleString() + ' \u00F7 10,000 \u00D7 ' + cfm10k + ' = <b style="color:' + ACCENT + ';">' + Math.round(reqCFM) + ' CFM req</b>';
      document.getElementById('spf3Status').innerHTML = plotted >= reqCFM * 0.9 ? _statusBadge('', _t('mn_spf_airflow_ok','\u2713 Airflow adecuado'), GREEN) : _statusBadge('', _t('mn_spf_airflow_low','\u26A0 Airflow insuficiente'), RED);
      // 4) Temps
      var rise = supT - retT;
      document.getElementById('spfRise').textContent = rise + '\u00B0F';
      var s4 = document.getElementById('spf4Status');
      if (rise >= 35 && rise <= 75) s4.innerHTML = _statusBadge('', _t('mn_spf_rise_normal','\u2713 Temp rise normal (35-75\u00B0F)'), GREEN);
      else if (rise < 35) s4.innerHTML = _statusBadge('', _t('mn_spf_rise_low','\u26A0 Rise bajo \u2014 excess airflow o low fire'), YELLOW);
      else s4.innerHTML = _statusBadge('', _t('mn_spf_rise_high','\u26A0 Rise alto \u2014 low airflow o over-fired'), RED);
      // 5) Delivery
      var delivered = plotted * rise * 1.08;
      document.getElementById('spf5Calc').innerHTML = plotted.toLocaleString() + ' CFM \u00D7 ' + rise + '\u00B0F \u00D7 1.08<br>= <b style="color:' + ACCENT + ';">' + Math.round(delivered).toLocaleString() + ' BTU/hr</b>';
      document.getElementById('spfDelivered').textContent = Math.round(delivered).toLocaleString();
      // 7) Efficiency
      var eff = ratedOut > 0 ? (delivered / ratedOut * 100) : 0;
      document.getElementById('spf7Calc').innerHTML = Math.round(delivered).toLocaleString() + ' \u00F7 ' + ratedOut.toLocaleString() + ' \u00D7 100';
      var effEl = document.getElementById('spfEff');
      effEl.textContent = eff.toFixed(1) + '%';
      effEl.style.color = eff >= 90 ? GREEN : eff >= 80 ? YELLOW : RED;
      var s7 = document.getElementById('spf7Status');
      if (eff >= 90) s7.innerHTML = _statusBadge('', _t('mn_spf_nci_met','\u2713 NCI Standard met \u2014 \u226590%'), GREEN);
      else if (eff >= 80) s7.innerHTML = _statusBadge('', _t('mn_spf_below_nci','\u26A0 Below NCI 90% \u2014 investigate'), YELLOW);
      else s7.innerHTML = _statusBadge('', _t('mn_spf_critical','\u26D4 Critical deficiency') + ' \u2014 ' + eff.toFixed(1) + '%', RED);
      // 8) Friction Rate
      var coilDrop = 0.20;
      var spfASP = maxP - fDrop - coilDrop;
      var spfTEL = parseFloat(document.getElementById('spfTEL').value) || 200;
      document.getElementById('spfTELVal').textContent = spfTEL + ' ft';
      document.getElementById('spfFRASP').textContent = 'ASP = ' + maxP.toFixed(2) + ' - ' + fDrop.toFixed(2) + ' - ' + coilDrop.toFixed(2) + ' = ' + spfASP.toFixed(2) + '"WC';
      var spfFRLCD = document.getElementById('spfFRLCD');
      var spfFRS = document.getElementById('spfFRStatus');
      if (spfASP > 0 && spfTEL > 0) {
        var spfFR = (spfASP * 100) / spfTEL;
        var spfFRC = spfFR <= 0.10 ? GREEN : spfFR <= 0.12 ? YELLOW : RED;
        spfFRLCD.textContent = spfFR.toFixed(3); spfFRLCD.style.color = spfFRC;
        var spfFRMsg = spfFR <= 0.10 ? _t('mn_spf_fr_ideal','\u2713 FR ideal para residencial') : spfFR <= 0.12 ? _t('mn_spf_fr_acceptable','\u26A0 FR aceptable') : _t('mn_spf_fr_high','\u26D4 FR alto \u2014 ductos pueden estar subdimensionados');
        spfFRS.innerHTML = _statusBadge('', spfFRMsg, spfFRC);
      } else {
        spfFRLCD.textContent = '--'; spfFRLCD.style.color = MUTED;
        spfFRS.innerHTML = spfASP <= 0 ? _statusBadge('', _t('mn_spf_no_pressure','\u26D4 Sin presi\u00F3n disponible para ductos'), RED) : '';
      }
    };
    window._mhSPFDiagnose = function() {
      var maxP = parseFloat(document.getElementById('spfMax').value);
      var measP = parseFloat(document.getElementById('spfMeas').value);
      var fDrop = parseFloat(document.getElementById('spfFilter').value);
      var btuIn = parseFloat(document.getElementById('spfBTUIn').value);
      var plotted = parseFloat(document.getElementById('spfPlot').value);
      var supT = parseFloat(document.getElementById('spfSupT').value);
      var retT = parseFloat(document.getElementById('spfRetT').value);
      var ratedOut = parseFloat(document.getElementById('spfOutput').value);
      var rise = supT - retT;
      var delivered = plotted * rise * 1.08;
      var eff = ratedOut > 0 ? (delivered / ratedOut * 100) : 0;
      var p = 'Analiza este Heating System Performance Test completo (m\u00E9todo NCI HeatMaxx):\n\n' +
        '1) STATIC PRESSURE: Max=' + maxP.toFixed(2) + ', Measured=' + measP.toFixed(2) + '"WC\n' +
        '2) FILTER: Max allowed=' + (maxP * window._spfFan / 100).toFixed(2) + ', Actual=' + fDrop.toFixed(2) + '"WC\n' +
        '3) AIRFLOW: Required=' + Math.round((btuIn / 10000) * window._spfType) + ' CFM, Plotted=' + plotted + ' CFM\n' +
        '4) TEMPS: Supply=' + supT + '\u00B0F, Return=' + retT + '\u00B0F, Rise=' + rise + '\u00B0F\n' +
        '5) DELIVERED: ' + Math.round(delivered).toLocaleString() + ' BTU/hr\n' +
        '6) RATED OUTPUT: ' + ratedOut.toLocaleString() + ' BTU/hr\n' +
        '7) EFFICIENCY: ' + eff.toFixed(1) + '%\n' +
        '8) FRICTION RATE: ASP=' + (maxP - fDrop - 0.20).toFixed(2) + '"WC, TEL=' + (parseFloat(document.getElementById('spfTEL').value) || 200) + 'ft, FR=' + ((maxP - fDrop - 0.20) > 0 ? (((maxP - fDrop - 0.20) * 100) / (parseFloat(document.getElementById('spfTEL').value) || 200)).toFixed(3) : 'N/A') + ' in.wg/100ft\n\n' +
        'Responde con:\n1. RESUMEN GENERAL del sistema\n2. DEFICIENCIAS en cada secci\u00F3n\n3. FRICTION RATE \u2014 \u00BFLos ductos pueden entregar el airflow necesario?\n4. CAUSA RA\u00CDZ de p\u00E9rdida de rendimiento\n5. PLAN DE ACCI\u00D3N espec\u00EDfico\n6. AHORRO ESTIMADO si se corrige\n7. RECOMENDACIONES al cliente';
      _mhCallIA(p, 'spfIAResult', 'spfIA');
    };
    window._mhUpdateSPF();
  }

})();
