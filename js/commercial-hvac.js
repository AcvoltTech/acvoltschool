/**
 * Commercial HVAC Diagnostic Tool — Herramienta Comercial HVAC
 * Tabs: Chillers, Torres de Enfriamiento, Evap Coolers, Ventilacion/IAQ, AHU, IA+Reportes
 */
(function() {
  'use strict';
  var _t = typeof window._t === 'function' ? window._t : function(k, fb) { return fb || k; };

  // ───────── Maestro Premium Design Tokens (shared across every tool) ─────────
  var BG = '#FAFAF7';
  var BG2 = '#FFFFFF';
  var ACCENT = '#E8591C';
  var GREEN = '#059669';
  var YELLOW = '#D97706';
  var RED = '#DC2626';
  var BLUE = '#1E3A8A';
  var ORANGE = '#E8591C';
  var TEXT = '#0F0F0F';
  var MUTED = '#6B6B66';
  var HAIRLINE = '#E7E5DE';
  var LCD = "'Courier New',monospace";
  var _activeTab = 0;

  // Chiller type + refrigerant state
  var _chChillerType = 'water-centrifugal';
  var _chRefrigerant = 'R-134a';

  // Cooling tower type
  var _ctType = 'crossflow-induced';

  // Evap cooler type
  var _ecType = 'directo';

  // AHU filter MERV
  var _ahuMERV = '13';

  // Input style constant
  var INP = 'width:100%;background:#FFFFFF;border:1px solid rgba(0,0,0,0.2);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;';
  var INP_BLUE = 'width:100%;background:#FFFFFF;border:1px solid rgba(59,130,246,0.25);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;';
  var INP_GREEN = 'width:100%;background:#FFFFFF;border:1px solid rgba(34,197,94,0.25);color:#111111;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;';
  var SEL = 'width:100%;padding:8px 10px;border-radius:6px;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.2);font-size:14px;font-weight:700;cursor:pointer;outline:none;';

  // ============================
  // SPIN ANIMATION
  // ============================
  function _ensureSpin() {
    if (!document.getElementById('chSpinStyle')) {
      var st = document.createElement('style'); st.id = 'chSpinStyle';
      st.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
  }

  // ============================
  // EQUIPMENT/CLIENT/TECH STATE
  // ============================
  function _initEquip() {
    if (!window._chEquip) {
      var tn = '', tnum = '', te = '';
      try {
        var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        tn = u.nombre || u.name || '';
        tnum = u.technicianNumber || localStorage.getItem('tecnico_number_' + (u.email || '')) || localStorage.getItem('tecnico_number') || '';
        te = u.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._chEquip = { model:'', serial:'', clientName:'', clientAddr:'', techName:tn, techNum:tnum, techEmail:te };
    }
  }

  window._chSaveEquip = function() {
    var eq = window._chEquip; if (!eq) return;
    var ids = [['chEqModel','model'],['chEqSerial','serial'],['chEqClient','clientName'],['chEqAddr','clientAddr'],['chEqTech','techName'],['chEqTechNum','techNum']];
    for (var i = 0; i < ids.length; i++) { var el = document.getElementById(ids[i][0]); if (el) eq[ids[i][1]] = el.value; }
  };

  function _equipHTML() {
    var eq = window._chEquip || {};
    var h = '<div style="background:#FFFFFF;border:1.5px solid rgba(0,0,0,0.08);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:10px;font-weight:800;color:' + ACCENT + ';letter-spacing:0.5px;margin-bottom:8px;border-left:3px solid ' + ACCENT + ';padding-left:6px;">INFORMACI\u00D3N DEL SERVICIO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:8px;color:' + ORANGE + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Modelo</label>';
    h += '<input id="chEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 30XA" oninput="_chSaveEquip()" style="' + INP + '"></div>';
    h += '<div><label style="font-size:8px;color:' + ORANGE + ';font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Serie</label>';
    h += '<input id="chEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 4921A12345" oninput="_chSaveEquip()" style="' + INP + '"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:8px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Nombre del Cliente</label>';
    h += '<input id="chEqClient" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_chSaveEquip()" style="' + INP_BLUE + '"></div>';
    h += '<div><label style="font-size:8px;color:' + BLUE + ';font-weight:700;display:block;margin-bottom:2px;">Direcci\u00F3n</label>';
    h += '<input id="chEqAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_chSaveEquip()" style="' + INP_BLUE + '"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 0.8fr 1.2fr;gap:8px;">';
    h += '<div><label style="font-size:8px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">T\u00E9cnico</label>';
    h += '<input id="chEqTech" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_chSaveEquip()" style="' + INP_GREEN + '"></div>';
    h += '<div><label style="font-size:8px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;"># T\u00E9cnico</label>';
    h += '<input id="chEqTechNum" value="' + (eq.techNum||'') + '" placeholder="Lic #" oninput="_chSaveEquip()" style="' + INP_GREEN + '"></div>';
    h += '<div><label style="font-size:8px;color:' + GREEN + ';font-weight:700;display:block;margin-bottom:2px;">Email</label>';
    h += '<input id="chEqEmail" value="' + (eq.techEmail||'') + '" readonly style="' + INP_GREEN + '"></div>';
    h += '</div></div>';
    return h;
  }

  // ============================
  // HELPERS
  // ============================
  function _card(title, content) {
    return '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:12px;padding:14px;margin-bottom:12px;">' +
      (title ? '<div style="font-size:11px;font-weight:800;color:' + ACCENT + ';margin-bottom:10px;letter-spacing:0.5px;border-left:3px solid ' + ACCENT + ';padding-left:6px;">' + title + '</div>' : '') +
      content + '</div>';
  }

  function _subHeader(text) {
    return '<div style="font-size:10px;font-weight:800;color:' + ACCENT + ';letter-spacing:0.5px;margin:14px 0 8px;padding:4px 8px;background:#FFFFFF;border-radius:6px;border-left:3px solid ' + ACCENT + ';">' + text + '</div>';
  }

  function _lcdDisplay(id, value, unit, size) {
    size = size || 28;
    return '<div style="text-align:center;padding:6px 0;">' +
      '<span id="' + id + '" style="font-family:' + LCD + ';font-size:' + size + 'px;font-weight:900;color:#111111;letter-spacing:2px;">' + value + '</span>' +
      '<span style="font-size:13px;color:' + MUTED + ';margin-left:6px;">' + unit + '</span></div>';
  }

  function _lcdBox(id, label, value, unit, color) {
    color = color || '#111111';
    return '<div style="background:#FFFFFF;border:1px solid ' + color + '33;border-radius:8px;padding:8px;text-align:center;">' +
      '<div style="font-size:12px;color:' + MUTED + ';font-weight:600;margin-bottom:3px;">' + label + '</div>' +
      '<span id="' + id + '" style="font-family:' + LCD + ';font-size:20px;font-weight:900;color:' + color + ';letter-spacing:1px;">' + value + '</span>' +
      '<span style="font-size:13px;color:' + MUTED + ';margin-left:3px;">' + unit + '</span></div>';
  }

  function _inputRow(id, label, unit, placeholder, extra) {
    extra = extra || '';
    return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
      '<label style="font-size:13px;color:' + MUTED + ';font-weight:600;min-width:100px;flex-shrink:0;">' + label + '</label>' +
      '<input id="' + id + '" type="number" step="any" placeholder="' + (placeholder||'') + '" oninput="window._chUpdate()" style="flex:1;' + INP + '" ' + extra + '>' +
      (unit ? '<span style="font-size:13px;color:' + MUTED + ';min-width:30px;">' + unit + '</span>' : '') +
      '</div>';
  }

  function _statusBox(id, text, color) {
    color = color || ACCENT;
    return '<div id="' + id + '" style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:700;background:' + color + '22;color:' + color + ';border:1px solid ' + color + '44;">' + text + '</div>';
  }

  function _gv(id) {
    var el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
  }

  function _sv(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _sh(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // ============================
  // P-T LOOKUP FOR CHILLER REFRIGERANTS
  // ============================
  // Internal P-T data for refrigerants not commonly in PT_DATA (R-123, R-514A, R-1234ze)
  var _chPTData = {
    'R-123': {
      // Low-pressure refrigerant, operates in vacuum
      // Reference: Carrier/Trane chiller docs
      pts: [
        {t:30,p:-7.0},{t:35,p:-6.1},{t:40,p:-5.0},{t:45,p:-3.8},{t:50,p:-2.4},
        {t:55,p:-0.8},{t:60,p:0.9},{t:65,p:2.9},{t:70,p:5.0},{t:75,p:7.4},
        {t:80,p:10.0},{t:85,p:12.9},{t:90,p:16.1},{t:95,p:19.6},{t:100,p:23.5},
        {t:105,p:27.7},{t:110,p:32.3},{t:115,p:37.3},{t:120,p:42.8},{t:125,p:48.7},
        {t:130,p:55.1},{t:135,p:62.0},{t:140,p:69.5},{t:145,p:77.6},{t:150,p:86.3}
      ]
    },
    'R-514A': {
      // Low-pressure HFO replacement for R-123
      pts: [
        {t:30,p:-8.0},{t:35,p:-7.0},{t:40,p:-5.8},{t:45,p:-4.5},{t:50,p:-3.0},
        {t:55,p:-1.3},{t:60,p:0.6},{t:65,p:2.6},{t:70,p:4.8},{t:75,p:7.2},
        {t:80,p:9.8},{t:85,p:12.7},{t:90,p:15.9},{t:95,p:19.4},{t:100,p:23.2},
        {t:105,p:27.4},{t:110,p:32.0},{t:115,p:37.0},{t:120,p:42.5},{t:125,p:48.4},
        {t:130,p:54.8},{t:135,p:61.7},{t:140,p:69.2},{t:145,p:77.3},{t:150,p:86.0}
      ]
    },
    'R-1234ze': {
      // Medium-pressure HFO
      pts: [
        {t:-20,p:-4.5},{t:-10,p:-1.5},{t:0,p:2.0},{t:10,p:6.2},{t:20,p:11.2},
        {t:30,p:17.0},{t:40,p:23.9},{t:50,p:32.0},{t:60,p:41.3},{t:70,p:52.1},
        {t:80,p:64.4},{t:90,p:78.3},{t:100,p:94.0},{t:110,p:111.5},{t:120,p:131.2},
        {t:130,p:153.0},{t:140,p:177.2},{t:150,p:203.8}
      ]
    }
  };

  function _ptLookup(refrig, psig) {
    // Try global PT_REVERSE first
    if (window.PT_REVERSE) {
      var result = window.PT_REVERSE(refrig, psig);
      if (result) return result.temp_f;
    }
    // Fallback to local chiller PT data
    var local = _chPTData[refrig];
    if (local && local.pts) {
      var pts = local.pts;
      var closest = null, minDiff = Infinity;
      for (var i = 0; i < pts.length; i++) {
        var diff = Math.abs(pts[i].p - psig);
        if (diff < minDiff) { minDiff = diff; closest = pts[i]; }
      }
      if (closest) return closest.t;
    }
    return null;
  }

  // ============================
  // AI DIAGNOSIS
  // ============================
  function _chCallIA(prompt, containerId, btnId) {
    var btn = document.getElementById(btnId);
    var c = document.getElementById(containerId);
    if (btn) { btn.disabled = true; btn.textContent = 'Analizando...'; }
    if (c) c.innerHTML = '<div style="text-align:center;padding:20px;"><div style="border:3px solid rgba(55,65,81,0.2);border-top:3px solid #374151;border-radius:50%;width:32px;height:32px;animation:spin 1s linear infinite;margin:0 auto;"></div><div style="color:#374151;font-size:11px;margin-top:8px;">Consultando IA...</div></div>';

    var sbUrl = '';
    try { sbUrl = window.supabaseClient ? (window.supabaseClient.supabaseUrl || 'https://htklsowiyjwsjnacnvnr.supabase.co') : (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co'); } catch(e) { sbUrl = 'https://htklsowiyjwsjnacnvnr.supabase.co'; }
    var sbKey = '';
    try { sbKey = (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : '') || (window.supabaseClient ? (window.supabaseClient.supabaseKey || (window.supabaseClient.rest && window.supabaseClient.rest.headers ? window.supabaseClient.rest.headers.apikey : '') || '') : ''); } catch(e) {}

    var body = JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      system: 'Eres un ingeniero de HVAC comercial con 25+ a\u00F1os de experiencia en chillers, torres de enfriamiento, manejadoras de aire, y sistemas de ventilaci\u00F3n. Responde siempre en espa\u00F1ol con terminolog\u00EDa t\u00E9cnica profesional.',
      max_tokens: 3000,
      language: 'es',
      email: localStorage.getItem('tecnico_email') || ''
    });

    var _getToken = (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth)
      ? supabaseClient.auth.getSession().then(function(s) { return (s && s.data && s.data.session) ? s.data.session.access_token : sbKey; }).catch(function() { return sbKey; })
      : Promise.resolve(sbKey);

    _getToken.then(function(_tk) {
      fetch(sbUrl + '/functions/v1/tutor-ia-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tk, 'apikey': sbKey },
        body: body
      }).then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        var txt = data.response || data.reply || data.text || data.message || JSON.stringify(data);
        if (c) {
          c.innerHTML = '<div style="background:#FFFFFF;border:1.5px solid rgba(0,0,0,0.08);border-radius:12px;padding:14px;margin-top:8px;">' +
            '<div style="font-size:14px;font-weight:800;color:#111111;margin-bottom:8px;">\uD83E\uDDE0 DIAGN\u00D3STICO IA \u2014 COMMERCIAL HVAC</div>' +
            '<div style="font-size:14px;color:#111111;line-height:1.6;white-space:pre-wrap;">' + txt.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#111111;">$1</strong>').replace(/\n/g, '<br>') + '</div></div>';
        }
        if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDDE0 Diagn\u00F3stico IA'; }
      }).catch(function(e) {
        if (c) c.innerHTML = '<div style="color:#991b1b;font-size:13px;padding:10px;">Error: ' + e.message + '</div>';
        if (btn) { btn.disabled = false; btn.textContent = '\uD83E\uDDE0 Diagn\u00F3stico IA'; }
      });
    });
  }

  // ============================
  // INIT
  // ============================
  window.initCommercialHvacScreen = function() {
    var s = document.getElementById('commercialHvacScreen');
    if (!s) return;
    if (window.Gamification) window.Gamification.recordToolUse('commercial-hvac');
    _activeTab = 0;
    _initEquip();
    _ensureSpin();
    _render(s);
  };

  // ============================
  // MAIN RENDER
  // ============================
  function _render(s) {
    var tabs = [
      { icon: '\uD83C\uDFED', label: 'Chillers' },
      { icon: '\uD83D\uDDFC', label: 'Torres' },
      { icon: '\uD83D\uDCA7', label: 'Evap' },
      { icon: '\uD83C\uDF2C\uFE0F', label: 'IAQ' },
      { icon: '\uD83C\uDFD7\uFE0F', label: 'AHU' },
      { icon: '\uD83E\uDDE0', label: 'IA+Rep' }
    ];
    var h = '<div style="background:' + BG + ';min-height:100vh;color:' + TEXT + ';display:flex;flex-direction:column;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:20;background:' + BG + ';border-bottom:1px solid rgba(0,0,0,0.08);padding:10px 12px 0;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<button onclick="window._toolBack && window._toolBack(\'dashboardScreen\')" style="background:rgba(0,0,0,0.04);border:none;color:' + ACCENT + ';width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;"><div style="font-size:17px;font-weight:800;color:#111111;">\uD83C\uDFED HVAC Comercial</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';font-weight:500;">Chillers \u00B7 Torres \u00B7 Evap \u00B7 IAQ \u00B7 AHU \u00B7 IA</div></div></div>';
    // Tabs
    h += '<div style="display:flex;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:0;">';
    for (var i = 0; i < tabs.length; i++) {
      var active = i === _activeTab;
      h += '<button onclick="window._chSwitchTab(' + i + ')" style="flex-shrink:0;background:' + (active ? 'rgba(0,0,0,0.04)' : 'transparent') + ';border:none;border-bottom:2px solid ' + (active ? '#111111' : 'transparent') + ';color:#111111;padding:8px 10px 6px;cursor:pointer;font-size:13px;font-weight:' + (active ? '700' : '600') + ';white-space:nowrap;display:flex;align-items:center;gap:4px;transition:all .2s;">';
      h += '<span style="font-size:14px;">' + tabs[i].icon + '</span>' + tabs[i].label + '</button>';
    }
    h += '</div></div>';
    // Equipment info
    h += '<div style="padding:12px 12px 0;">' + _equipHTML() + '</div>';
    // Content
    h += '<div id="chContent" style="flex:1;overflow-y:auto;padding:12px;"></div>';
    h += '</div>';
    s.innerHTML = h;
    _renderTab();
  }

  window._chSwitchTab = function(idx) {
    _activeTab = idx;
    var s = document.getElementById('commercialHvacScreen');
    if (s) _render(s);
  };

  function _renderTab() {
    var c = document.getElementById('chContent');
    if (!c) return;
    if (_activeTab === 0) _renderChillers(c);
    else if (_activeTab === 1) _renderCoolingTower(c);
    else if (_activeTab === 2) _renderEvapCooler(c);
    else if (_activeTab === 3) _renderIAQ(c);
    else if (_activeTab === 4) _renderAHU(c);
    else if (_activeTab === 5) _renderAIReport(c);
  }

  // ============================
  // MASTER UPDATE FUNCTION
  // ============================
  window._chUpdate = function() {
    _updateChiller();
    _updateCT();
    _updateEC();
    _updateIAQ();
    _updateAHU();
  };

  // ============================
  // TAB 0: CHILLERS
  // ============================
  window._chSetChillerType = function(val) { _chChillerType = val; window._chUpdate(); };
  window._chSetRefrigerant = function(val) { _chRefrigerant = val; window._chUpdate(); };

  function _isWaterCooled() {
    return _chChillerType === 'water-centrifugal' || _chChillerType === 'water-screw';
  }

  function _renderChillers(c) {
    var h = '';

    // Type selector
    h += _card('\uD83C\uDFED TIPO DE CHILLER',
      '<select id="chTypeSelect" onchange="window._chSetChillerType(this.value)" style="' + SEL + '">' +
      '<option value="water-centrifugal"' + (_chChillerType==='water-centrifugal'?' selected':'') + '>Centr\u00EDfugo enfriado por agua</option>' +
      '<option value="water-screw"' + (_chChillerType==='water-screw'?' selected':'') + '>Tornillo enfriado por agua</option>' +
      '<option value="air-screw"' + (_chChillerType==='air-screw'?' selected':'') + '>Tornillo enfriado por aire</option>' +
      '<option value="air-scroll"' + (_chChillerType==='air-scroll'?' selected':'') + '>Scroll enfriado por aire</option>' +
      '<option value="absorption"' + (_chChillerType==='absorption'?' selected':'') + '>Absorci\u00F3n</option>' +
      '</select>' +
      '<div style="margin-top:8px;">' +
      '<label style="font-size:13px;color:' + MUTED + ';font-weight:600;">Refrigerante</label>' +
      '<select id="chRefSelect" onchange="window._chSetRefrigerant(this.value)" style="' + SEL + ';margin-top:3px;">' +
      '<option value="R-134a"' + (_chRefrigerant==='R-134a'?' selected':'') + '>R-134a</option>' +
      '<option value="R-410A"' + (_chRefrigerant==='R-410A'?' selected':'') + '>R-410A</option>' +
      '<option value="R-123"' + (_chRefrigerant==='R-123'?' selected':'') + '>R-123</option>' +
      '<option value="R-514A"' + (_chRefrigerant==='R-514A'?' selected':'') + '>R-514A</option>' +
      '<option value="R-1234ze"' + (_chRefrigerant==='R-1234ze'?' selected':'') + '>R-1234ze</option>' +
      '<option value="R-407C"' + (_chRefrigerant==='R-407C'?' selected':'') + '>R-407C</option>' +
      '<option value="R-22"' + (_chRefrigerant==='R-22'?' selected':'') + '>R-22</option>' +
      '</select></div>'
    );

    // LCD metrics display
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">';
    h += _lcdBox('chLCDTons', 'TONELAJE', '---', 'Tons', ACCENT);
    h += _lcdBox('chLCDkwTon', 'kW/TON', '---', '', YELLOW);
    h += _lcdBox('chLCDCOP', 'COP', '---', '', GREEN);
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">';
    h += _lcdBox('chLCDEER', 'EER', '---', '', BLUE);
    h += _lcdBox('chLCDLoad', '% CARGA', '---', '%', ORANGE);
    h += _lcdBox('chLCDVImb', 'V DESBAL', '---', '%', RED);
    h += '</div>';

    // EVAPORATOR SECTION
    h += _subHeader('EVAPORADOR');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('chEvapEWT', 'EWT', '\u00B0F', '54') + '</div>';
    h += '<div>' + _inputRow('chEvapLWT', 'LWT', '\u00B0F', '44') + '</div>';
    h += '</div>';
    h += _inputRow('chEvapGPM', 'Flujo Agua', 'GPM', '2400');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('chEvapDT', '\u0394T Evap', '---', '\u00B0F', ACCENT);
    h += _lcdBox('chEvapTons', 'Tonelaje', '---', 'Tons', GREEN);
    h += _lcdBox('chEvapApproach', 'Approach', '---', '\u00B0F', YELLOW);
    h += '</div>';
    h += _inputRow('chSuctP', 'Presi\u00F3n Succi\u00F3n', 'psig', '');
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';min-width:100px;">Sat Temp Succi\u00F3n</span>' +
      '<div id="chSuctSat" style="font-family:' + LCD + ';font-size:14px;color:' + ACCENT + ';font-weight:700;">--- \u00B0F</div></div>';

    // CONDENSER SECTION
    h += _subHeader('CONDENSADOR');
    if (_isWaterCooled()) {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      h += '<div>' + _inputRow('chCondECWT', 'ECWT', '\u00B0F', '85') + '</div>';
      h += '<div>' + _inputRow('chCondLCWT', 'LCWT', '\u00B0F', '95') + '</div>';
      h += '</div>';
      h += _inputRow('chCondGPM', 'Flujo Cond', 'GPM', '3000');
    } else {
      h += _inputRow('chCondOAT', 'Temp Ambient', '\u00B0F', '95');
    }
    h += _inputRow('chDischP', 'Presi\u00F3n Descarga', 'psig', '');
    h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">' +
      '<span style="font-size:13px;color:' + MUTED + ';min-width:100px;">Sat Temp Descarga</span>' +
      '<div id="chDischSat" style="font-family:' + LCD + ';font-size:14px;color:' + ORANGE + ';font-weight:700;">--- \u00B0F</div></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('chCondApproach', 'Cond Approach', '---', '\u00B0F', YELLOW);
    h += _lcdBox('chCondDT', '\u0394T Cond', '---', '\u00B0F', ORANGE);
    h += '</div>';

    // COMPRESSOR SECTION
    h += _subHeader('COMPRESOR');
    h += '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;font-weight:600;">Voltaje 3-Fases</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('chVL12', 'L1-L2', 'V', '460') + '</div>';
    h += '<div>' + _inputRow('chVL23', 'L2-L3', 'V', '460') + '</div>';
    h += '<div>' + _inputRow('chVL13', 'L1-L3', 'V', '460') + '</div>';
    h += '</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';margin-bottom:4px;font-weight:600;">Amperaje 3-Fases</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('chAL1', 'L1', 'A', '') + '</div>';
    h += '<div>' + _inputRow('chAL2', 'L2', 'A', '') + '</div>';
    h += '<div>' + _inputRow('chAL3', 'L3', 'A', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('chVoltImb', 'Desbalance V', '---', '%', YELLOW);
    h += _lcdBox('chAmpImb', 'Desbalance A', '---', '%', YELLOW);
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('chOilP', 'Presi\u00F3n Aceite', 'psig', '') + '</div>';
    h += '<div>' + _inputRow('chOilT', 'Temp Aceite', '\u00B0F', '') + '</div>';
    h += '<div>' + _inputRow('chDischT', 'Temp Desc', '\u00B0F', '') + '</div>';
    h += '</div>';

    // EFFICIENCY SECTION
    h += _subHeader('EFICIENCIA');
    h += _inputRow('chKW', 'kW Entrada', 'kW', '');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('chEffKWTon', 'kW/Ton', '---', '', ACCENT);
    h += _lcdBox('chEffCOP', 'COP', '---', '', GREEN);
    h += _lcdBox('chEffEER', 'EER', '---', '', BLUE);
    h += _lcdBox('chEffLoad', '% Carga', '---', '%', ORANGE);
    h += '</div>';
    h += '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:8px;margin-top:6px;">';
    h += '<div style="font-size:9px;color:' + ACCENT + ';font-weight:700;margin-bottom:4px;">REFERENCIA IPLV T\u00CDPICO</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';line-height:1.5;">';
    h += 'Centr\u00EDfugo agua: 0.50-0.62 kW/Ton<br>';
    h += 'Tornillo agua: 0.55-0.70 kW/Ton<br>';
    h += 'Tornillo aire: 0.90-1.15 kW/Ton<br>';
    h += 'Scroll aire: 1.00-1.30 kW/Ton<br>';
    h += 'Absorci\u00F3n: COP 0.7-1.2</div></div>';

    // AI Button
    h += '<div style="margin-top:12px;">';
    h += '<button id="chAIBtn0" onclick="window._chRunAI(0)" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA - Chiller</button>';
    h += '<div id="chAIResult0"></div></div>';

    c.innerHTML = h;
    _updateChiller();
  }

  function _updateChiller() {
    var ewt = _gv('chEvapEWT'), lwt = _gv('chEvapLWT'), gpm = _gv('chEvapGPM');
    var dt = ewt - lwt;
    var tons = gpm > 0 && dt > 0 ? (gpm * dt / 24) : 0;
    _sv('chEvapDT', dt > 0 ? dt.toFixed(1) : '---');
    _sv('chEvapTons', tons > 0 ? tons.toFixed(1) : '---');
    _sv('chLCDTons', tons > 0 ? tons.toFixed(0) : '---');

    // Suction sat temp
    var suctP = _gv('chSuctP');
    if (suctP > 0) {
      var suctSat = _ptLookup(_chRefrigerant, suctP);
      _sv('chSuctSat', suctSat !== null ? suctSat.toFixed(1) + ' \u00B0F' : '--- \u00B0F');
      // Evap approach = LWT - suction sat temp
      if (lwt > 0 && suctSat !== null) {
        _sv('chEvapApproach', (lwt - suctSat).toFixed(1));
      } else {
        _sv('chEvapApproach', '---');
      }
    } else {
      _sv('chSuctSat', '--- \u00B0F');
      _sv('chEvapApproach', '---');
    }

    // Discharge sat temp
    var dischP = _gv('chDischP');
    if (dischP > 0) {
      var dischSat = _ptLookup(_chRefrigerant, dischP);
      _sv('chDischSat', dischSat !== null ? dischSat.toFixed(1) + ' \u00B0F' : '--- \u00B0F');
      // Condenser approach
      if (_isWaterCooled()) {
        var lcwt = _gv('chCondLCWT');
        if (lcwt > 0 && dischSat !== null) {
          _sv('chCondApproach', (dischSat - lcwt).toFixed(1));
        } else {
          _sv('chCondApproach', '---');
        }
        var ecwt = _gv('chCondECWT');
        _sv('chCondDT', (lcwt > 0 && ecwt > 0) ? (lcwt - ecwt).toFixed(1) : '---');
      } else {
        var oat = _gv('chCondOAT');
        if (oat > 0 && dischSat !== null) {
          _sv('chCondApproach', (dischSat - oat).toFixed(1));
        } else {
          _sv('chCondApproach', '---');
        }
        _sv('chCondDT', '---');
      }
    } else {
      _sv('chDischSat', '--- \u00B0F');
      _sv('chCondApproach', '---');
      _sv('chCondDT', '---');
    }

    // Voltage imbalance
    var v12 = _gv('chVL12'), v23 = _gv('chVL23'), v13 = _gv('chVL13');
    if (v12 > 0 && v23 > 0 && v13 > 0) {
      var vavg = (v12 + v23 + v13) / 3;
      var vmax = Math.max(Math.abs(v12-vavg), Math.abs(v23-vavg), Math.abs(v13-vavg));
      var vimb = (vmax / vavg * 100);
      _sv('chVoltImb', vimb.toFixed(1));
      _sv('chLCDVImb', vimb.toFixed(1));
    } else {
      _sv('chVoltImb', '---');
      _sv('chLCDVImb', '---');
    }

    // Current imbalance
    var a1 = _gv('chAL1'), a2 = _gv('chAL2'), a3 = _gv('chAL3');
    if (a1 > 0 && a2 > 0 && a3 > 0) {
      var aavg = (a1 + a2 + a3) / 3;
      var amax = Math.max(Math.abs(a1-aavg), Math.abs(a2-aavg), Math.abs(a3-aavg));
      _sv('chAmpImb', (amax / aavg * 100).toFixed(1));
    } else {
      _sv('chAmpImb', '---');
    }

    // Efficiency
    var kw = _gv('chKW');
    if (kw > 0 && tons > 0) {
      var kwTon = kw / tons;
      var cop = tons * 3.517 / kw;
      var eer = tons * 12 / kw;
      _sv('chEffKWTon', kwTon.toFixed(3));
      _sv('chEffCOP', cop.toFixed(2));
      _sv('chEffEER', eer.toFixed(1));
      _sv('chLCDkwTon', kwTon.toFixed(3));
      _sv('chLCDCOP', cop.toFixed(2));
      _sv('chLCDEER', eer.toFixed(1));
      // Estimate load % based on typical full load kW/Ton
      var fullLoadKWTon = 0.65;
      if (_chChillerType === 'water-centrifugal') fullLoadKWTon = 0.56;
      else if (_chChillerType === 'water-screw') fullLoadKWTon = 0.63;
      else if (_chChillerType === 'air-screw') fullLoadKWTon = 1.02;
      else if (_chChillerType === 'air-scroll') fullLoadKWTon = 1.15;
      else if (_chChillerType === 'absorption') fullLoadKWTon = 0.01; // COP based
      var loadPct = Math.min(150, (kwTon / fullLoadKWTon) * 100);
      _sv('chEffLoad', loadPct.toFixed(0));
      _sv('chLCDLoad', loadPct.toFixed(0));
    } else {
      _sv('chEffKWTon', '---'); _sv('chEffCOP', '---'); _sv('chEffEER', '---'); _sv('chEffLoad', '---');
      _sv('chLCDkwTon', '---'); _sv('chLCDCOP', '---'); _sv('chLCDEER', '---'); _sv('chLCDLoad', '---');
    }
  }

  // ============================
  // TAB 1: TORRES DE ENFRIAMIENTO
  // ============================
  window._chSetCTType = function(val) { _ctType = val; };

  function _renderCoolingTower(c) {
    var h = '';
    h += _card('\uD83D\uDDFC TIPO DE TORRE',
      '<select id="chCTType" onchange="window._chSetCTType(this.value)" style="' + SEL + '">' +
      '<option value="crossflow-induced"' + (_ctType==='crossflow-induced'?' selected':'') + '>Crossflow inducido</option>' +
      '<option value="counterflow-induced"' + (_ctType==='counterflow-induced'?' selected':'') + '>Counterflow inducido</option>' +
      '<option value="forced-draft"' + (_ctType==='forced-draft'?' selected':'') + '>Tiro forzado</option>' +
      '<option value="natural-draft"' + (_ctType==='natural-draft'?' selected':'') + '>Tiro natural</option>' +
      '</select>'
    );

    // LCD metrics
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">';
    h += _lcdBox('ctLCDRange', 'RANGE', '---', '\u00B0F', ACCENT);
    h += _lcdBox('ctLCDApproach', 'APPROACH', '---', '\u00B0F', YELLOW);
    h += _lcdBox('ctLCDTons', 'TONS', '---', '', GREEN);
    h += '</div>';

    // WATER PERFORMANCE
    h += _subHeader('RENDIMIENTO DEL AGUA');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ctHotIn', 'Agua Caliente', '\u00B0F', '95') + '</div>';
    h += '<div>' + _inputRow('ctColdOut', 'Agua Fr\u00EDa', '\u00B0F', '85') + '</div>';
    h += '</div>';
    h += _inputRow('ctWB', 'Bulbo H\u00FAmedo', '\u00B0F', '78');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ctRange', 'Range', '---', '\u00B0F', ACCENT);
    h += _lcdBox('ctApproach', 'Approach', '---', '\u00B0F', YELLOW);
    h += _lcdBox('ctHeatRej', 'Rechazo BTU/hr', '---', '', ORANGE);
    h += '</div>';

    // FLOW
    h += _subHeader('FLUJO');
    h += _inputRow('ctGPM', 'Flujo Agua', 'GPM', '3000');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ctTons', 'Tonelaje', '---', 'Tons', GREEN);
    h += _lcdBox('ctEvapRate', 'Evaporaci\u00F3n', '---', 'GPM', BLUE);
    h += _lcdBox('ctMakeup', 'Agua Repuesto', '---', 'GPM', MUTED);
    h += '</div>';

    // FAN/MOTOR
    h += _subHeader('VENTILADOR');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ctFanA', 'Fan Amps', 'A', '') + '</div>';
    h += '<div>' + _inputRow('ctFanV', 'Fan Volts', 'V', '') + '</div>';
    h += '<div>' + _inputRow('ctVFD', 'VFD Speed', '%', '100') + '</div>';
    h += '</div>';

    // WATER TREATMENT
    h += _subHeader('TRATAMIENTO DE AGUA');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ctCond', 'Conductividad', '\u00B5S/cm', '') + '</div>';
    h += '<div>' + _inputRow('ctPH', 'pH', '', '7.5') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ctCOC', 'Ciclos Conc.', '', '5') + '</div>';
    h += '<div>' + _inputRow('ctTDS', 'TDS', 'ppm', '') + '</div>';
    h += '</div>';
    h += '<div id="ctLegionella" style="margin-top:8px;"></div>';

    // AI Button
    h += '<div style="margin-top:12px;">';
    h += '<button id="chAIBtn1" onclick="window._chRunAI(1)" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA - Torre</button>';
    h += '<div id="chAIResult1"></div></div>';

    c.innerHTML = h;
    _updateCT();
  }

  function _updateCT() {
    var hot = _gv('ctHotIn'), cold = _gv('ctColdOut'), wb = _gv('ctWB'), gpm = _gv('ctGPM');
    var range = hot - cold;
    var approach = cold - wb;
    _sv('ctRange', range > 0 ? range.toFixed(1) : '---');
    _sv('ctApproach', approach >= 0 ? approach.toFixed(1) : '---');
    _sv('ctLCDRange', range > 0 ? range.toFixed(1) : '---');
    _sv('ctLCDApproach', approach >= 0 ? approach.toFixed(1) : '---');

    // Heat rejection: GPM x Range x 500
    var heatRej = gpm > 0 && range > 0 ? gpm * range * 500 : 0;
    _sv('ctHeatRej', heatRej > 0 ? (heatRej / 1000).toFixed(0) + 'k' : '---');

    // Tons
    var tons = heatRej > 0 ? heatRej / 12000 : 0;
    _sv('ctTons', tons > 0 ? tons.toFixed(0) : '---');
    _sv('ctLCDTons', tons > 0 ? tons.toFixed(0) : '---');

    // Evaporation rate ~ 1% of GPM per 10F range
    var evapRate = gpm > 0 && range > 0 ? gpm * range * 0.001 : 0;
    _sv('ctEvapRate', evapRate > 0 ? evapRate.toFixed(1) : '---');

    // Makeup water (evap + blowdown + drift)
    var coc = _gv('ctCOC') || 5;
    var blowdown = evapRate > 0 ? evapRate / (coc - 1) : 0;
    var drift = gpm * 0.0002;
    var makeup = evapRate + blowdown + drift;
    _sv('ctMakeup', makeup > 0 ? makeup.toFixed(1) : '---');

    // Legionella risk
    var legEl = document.getElementById('ctLegionella');
    if (legEl) {
      var risk = 'Bajo';
      var riskColor = GREEN;
      if (hot > 0 && cold > 0) {
        if (cold >= 68 && cold <= 113) {
          risk = 'MODERADO - Rango de crecimiento'; riskColor = YELLOW;
        }
        if (cold >= 77 && cold <= 108 && ((_gv('ctPH') < 6.5) || (_gv('ctPH') > 8.5))) {
          risk = 'ALTO - Temp + pH fuera de rango'; riskColor = RED;
        }
        if (cold < 68 || cold > 131) {
          risk = 'Bajo - Fuera rango de crecimiento'; riskColor = GREEN;
        }
      }
      legEl.innerHTML = '<div style="padding:8px 12px;border-radius:8px;background:' + riskColor + '15;border:1px solid ' + riskColor + '44;">' +
        '<div style="font-size:9px;font-weight:700;color:' + riskColor + ';">RIESGO LEGIONELLA: ' + risk + '</div></div>';
    }
  }

  // ============================
  // TAB 2: EVAP COOLERS
  // ============================
  window._chSetECType = function(val) { _ecType = val; };

  function _renderEvapCooler(c) {
    var h = '';
    h += _card('\uD83D\uDCA7 TIPO DE ENFRIAMIENTO EVAPORATIVO',
      '<select id="chECType" onchange="window._chSetECType(this.value)" style="' + SEL + '">' +
      '<option value="directo"' + (_ecType==='directo'?' selected':'') + '>Directo</option>' +
      '<option value="indirecto"' + (_ecType==='indirecto'?' selected':'') + '>Indirecto</option>' +
      '<option value="hibrido"' + (_ecType==='hibrido'?' selected':'') + '>H\u00EDbrido</option>' +
      '</select>'
    );

    // LCD metrics
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">';
    h += _lcdBox('ecLCDEff', 'EFICIENCIA', '---', '%', GREEN);
    h += _lcdBox('ecLCDDep', 'DEPRESI\u00D3N', '---', '\u00B0F', ACCENT);
    h += _lcdBox('ecLCDSAT', 'SUMINISTRO', '---', '\u00B0F', BLUE);
    h += '</div>';

    // PERFORMANCE
    h += _subHeader('RENDIMIENTO');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ecODB', 'Outdoor DB', '\u00B0F', '105') + '</div>';
    h += '<div>' + _inputRow('ecOWB', 'Outdoor WB', '\u00B0F', '72') + '</div>';
    h += '</div>';
    h += _inputRow('ecSAT', 'Supply Air Temp', '\u00B0F', '78');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ecEff', 'Efectividad', '---', '%', GREEN);
    h += _lcdBox('ecDep', 'Depresi\u00F3n WB', '---', '\u00B0F', ACCENT);
    h += _lcdBox('ecHumidity', 'Humedad A\u00F1adida', '---', 'gr/lb', BLUE);
    h += '</div>';

    // SYSTEM
    h += _subHeader('SISTEMA');
    h += '<div style="margin-bottom:8px;">';
    h += '<label style="font-size:13px;color:' + MUTED + ';font-weight:600;display:block;margin-bottom:3px;">Condici\u00F3n del Pad</label>';
    h += '<select id="ecPadCond" onchange="window._chUpdate()" style="' + SEL + '">' +
      '<option value="nuevo">Nuevo</option><option value="bueno" selected>Bueno</option><option value="regular">Regular</option><option value="reemplazar">Reemplazar</option></select></div>';
    h += '<div style="margin-bottom:8px;">';
    h += '<label style="font-size:13px;color:' + MUTED + ';font-weight:600;display:block;margin-bottom:3px;">Distribuci\u00F3n de Agua</label>';
    h += '<select id="ecWaterDist" onchange="window._chUpdate()" style="' + SEL + '">' +
      '<option value="buena" selected>Buena</option><option value="irregular">Irregular</option><option value="bloqueada">Bloqueada</option></select></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ecPumpA', 'Bomba Amps', 'A', '') + '</div>';
    h += '<div>' + _inputRow('ecFanA', 'Fan Amps', 'A', '') + '</div>';
    h += '<div>' + _inputRow('ecFanV', 'Fan Volts', 'V', '') + '</div>';
    h += '</div>';

    // Pad status indicator
    h += '<div id="ecPadStatus" style="margin-top:8px;"></div>';

    // AI Button
    h += '<div style="margin-top:12px;">';
    h += '<button id="chAIBtn2" onclick="window._chRunAI(2)" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA - Evap Cooler</button>';
    h += '<div id="chAIResult2"></div></div>';

    c.innerHTML = h;
    _updateEC();
  }

  function _updateEC() {
    var odb = _gv('ecODB'), owb = _gv('ecOWB'), sat = _gv('ecSAT');
    var depression = odb - owb;
    var eff = (odb > 0 && owb > 0 && sat > 0 && (odb - owb) > 0) ? ((odb - sat) / (odb - owb) * 100) : 0;
    _sv('ecEff', eff > 0 ? eff.toFixed(1) : '---');
    _sv('ecDep', depression > 0 ? depression.toFixed(1) : '---');
    _sv('ecLCDEff', eff > 0 ? eff.toFixed(0) : '---');
    _sv('ecLCDDep', depression > 0 ? depression.toFixed(1) : '---');
    _sv('ecLCDSAT', sat > 0 ? sat.toFixed(0) : '---');

    // Approximate humidity added (grains/lb)
    // Rough estimate: ~7 grains/lb per degree of cooling
    var humAdded = (odb > 0 && sat > 0 && sat < odb) ? ((odb - sat) * 7).toFixed(0) : '---';
    _sv('ecHumidity', humAdded);

    // Pad status
    var padEl = document.getElementById('ecPadStatus');
    if (padEl) {
      var padSel = document.getElementById('ecPadCond');
      var waterSel = document.getElementById('ecWaterDist');
      var padVal = padSel ? padSel.value : 'bueno';
      var waterVal = waterSel ? waterSel.value : 'buena';
      var color = GREEN; var msg = 'Sistema en buenas condiciones';
      if (padVal === 'regular' || waterVal === 'irregular') { color = YELLOW; msg = 'Mantenimiento recomendado pronto'; }
      if (padVal === 'reemplazar' || waterVal === 'bloqueada') { color = RED; msg = 'ATENCI\u00D3N: Requiere servicio inmediato'; }
      if (eff > 0 && eff < 60) { color = YELLOW; msg = 'Efectividad baja - verificar pad y distribuci\u00F3n'; }
      if (eff > 0 && eff < 40) { color = RED; msg = 'Efectividad cr\u00EDtica - reemplazar pad'; }
      padEl.innerHTML = '<div style="padding:8px 12px;border-radius:8px;background:' + color + '15;border:1px solid ' + color + '44;">' +
        '<div style="font-size:9px;font-weight:700;color:' + color + ';">' + msg + '</div></div>';
    }
  }

  // ============================
  // TAB 3: VENTILACION / IAQ
  // ============================
  function _renderIAQ(c) {
    var h = '';

    // CO2 MONITORING
    h += _subHeader('MONITOREO CO\u2082');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqCO2Out', 'CO\u2082 Exterior', 'ppm', '420') + '</div>';
    h += '<div>' + _inputRow('iaqCO2In', 'CO\u2082 Interior', 'ppm', '') + '</div>';
    h += '</div>';
    h += '<div id="iaqCO2Status" style="margin:8px 0;text-align:center;"></div>';

    // FRESH AIR
    h += _subHeader('AIRE FRESCO / ASHRAE 62.1');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqOACFM', 'OA CFM', '', '') + '</div>';
    h += '<div>' + _inputRow('iaqRACFM', 'RA CFM', '', '') + '</div>';
    h += '<div>' + _inputRow('iaqSACFM', 'SA CFM', '', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('iaqOAPct', 'OA %', '---', '%', ACCENT);
    h += _lcdBox('iaqMinOA', 'M\u00EDn Requerido', '15-20', '%', MUTED);
    h += '</div>';

    // AIR CHANGES
    h += _subHeader('CAMBIOS DE AIRE');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqRoomL', 'Largo', 'ft', '') + '</div>';
    h += '<div>' + _inputRow('iaqRoomW', 'Ancho', 'ft', '') + '</div>';
    h += '<div>' + _inputRow('iaqRoomH', 'Alto', 'ft', '10') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('iaqVolume', 'Volumen', '---', 'ft\u00B3', MUTED);
    h += _lcdBox('iaqACH', 'ACH', '---', '/hr', ACCENT);
    h += '</div>';
    h += '<div style="background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:8px;margin-bottom:8px;">';
    h += '<div style="font-size:9px;color:' + ACCENT + ';font-weight:700;margin-bottom:4px;">ACH T\u00CDPICO POR ESPACIO</div>';
    h += '<div style="font-size:13px;color:' + MUTED + ';line-height:1.5;">';
    h += 'Oficina: 4-6 ACH | Retail: 6-8 ACH<br>';
    h += 'Restaurante: 8-12 ACH | Hospital: 6-12 ACH<br>';
    h += 'Laboratorio: 6-15 ACH | Bodega: 2-4 ACH<br>';
    h += 'Gimnasio: 6-8 ACH | Escuela: 6-8 ACH</div></div>';

    // ECONOMIZER
    h += _subHeader('ECONOMIZADOR');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqOADmpr', 'OA Damper', '%', '') + '</div>';
    h += '<div>' + _inputRow('iaqRADmpr', 'RA Damper', '%', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqMAT', 'Mixed Air Temp', '\u00B0F', '') + '</div>';
    h += '<div>' + _inputRow('iaqCOSP', 'Changeover SP', '\u00B0F', '65') + '</div>';
    h += '</div>';
    h += '<div id="iaqEconStatus" style="margin:8px 0;"></div>';

    // IAQ SENSORS
    h += _subHeader('SENSORES IAQ');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqPM25', 'PM2.5', '\u00B5g/m\u00B3', '') + '</div>';
    h += '<div>' + _inputRow('iaqVOC', 'VOC', 'ppb', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('iaqTemp', 'Temp Interior', '\u00B0F', '') + '</div>';
    h += '<div>' + _inputRow('iaqRH', 'HR Interior', '%', '') + '</div>';
    h += '</div>';
    h += '<div id="iaqAQI" style="margin:8px 0;"></div>';

    // AI Button
    h += '<div style="margin-top:12px;">';
    h += '<button id="chAIBtn3" onclick="window._chRunAI(3)" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA - IAQ</button>';
    h += '<div id="chAIResult3"></div></div>';

    c.innerHTML = h;
    _updateIAQ();
  }

  function _updateIAQ() {
    // CO2 status
    var co2In = _gv('iaqCO2In');
    var co2El = document.getElementById('iaqCO2Status');
    if (co2El && co2In > 0) {
      var status, color;
      if (co2In < 600) { status = 'EXCELENTE'; color = GREEN; }
      else if (co2In < 800) { status = 'BUENO'; color = GREEN; }
      else if (co2In < 1000) { status = 'ACEPTABLE'; color = YELLOW; }
      else if (co2In < 2000) { status = 'POBRE - Aumentar ventilaci\u00F3n'; color = ORANGE; }
      else { status = 'PELIGROSO - Evacuar y ventilar'; color = RED; }
      co2El.innerHTML = '<div style="padding:10px 14px;border-radius:10px;background:' + color + '15;border:1.5px solid ' + color + '44;text-align:center;">' +
        '<div style="font-family:' + LCD + ';font-size:24px;font-weight:900;color:' + color + ';">' + co2In + ' ppm</div>' +
        '<div style="font-size:10px;font-weight:700;color:' + color + ';margin-top:4px;">CO\u2082: ' + status + '</div></div>';
    } else if (co2El) {
      co2El.innerHTML = '';
    }

    // OA%
    var oaCfm = _gv('iaqOACFM'), saCfm = _gv('iaqSACFM');
    var oaPct = (oaCfm > 0 && saCfm > 0) ? (oaCfm / saCfm * 100) : 0;
    _sv('iaqOAPct', oaPct > 0 ? oaPct.toFixed(1) : '---');

    // Volume & ACH
    var l = _gv('iaqRoomL'), w = _gv('iaqRoomW'), ht = _gv('iaqRoomH');
    var vol = l * w * ht;
    _sv('iaqVolume', vol > 0 ? vol.toFixed(0) : '---');
    var cfm = saCfm > 0 ? saCfm : oaCfm;
    var ach = (cfm > 0 && vol > 0) ? (cfm * 60 / vol) : 0;
    _sv('iaqACH', ach > 0 ? ach.toFixed(1) : '---');

    // Economizer status
    var econEl = document.getElementById('iaqEconStatus');
    if (econEl) {
      var mat = _gv('iaqMAT'), cosp = _gv('iaqCOSP');
      var oaDmpr = _gv('iaqOADmpr');
      var h = '';
      if (mat > 0 && cosp > 0) {
        if (mat < cosp) {
          h = '<div style="padding:8px;border-radius:8px;background:' + GREEN + '15;border:1px solid ' + GREEN + '44;font-size:10px;color:' + GREEN + ';font-weight:700;">Economizador: ENFRIAMIENTO GRATIS disponible - Abrir dampers OA</div>';
        } else {
          h = '<div style="padding:8px;border-radius:8px;background:' + YELLOW + '15;border:1px solid ' + YELLOW + '44;font-size:10px;color:' + YELLOW + ';font-weight:700;">Economizador: Temp exterior alta - Usar m\u00EDnimo OA</div>';
        }
      }
      if (oaDmpr > 0 && mat > 0 && cosp > 0 && mat >= cosp && oaDmpr > 30) {
        h = '<div style="padding:8px;border-radius:8px;background:' + RED + '15;border:1px solid ' + RED + '44;font-size:10px;color:' + RED + ';font-weight:700;">ALERTA: Damper OA abierto con temp exterior alta - Verificar control economizador</div>';
      }
      econEl.innerHTML = h;
    }

    // AQI status
    var aqiEl = document.getElementById('iaqAQI');
    if (aqiEl) {
      var pm25 = _gv('iaqPM25'), voc = _gv('iaqVOC'), rh = _gv('iaqRH');
      var msgs = [];
      if (pm25 > 0) {
        if (pm25 <= 12) msgs.push('<span style="color:' + GREEN + ';">PM2.5: ' + pm25 + ' - Bueno</span>');
        else if (pm25 <= 35) msgs.push('<span style="color:' + YELLOW + ';">PM2.5: ' + pm25 + ' - Moderado</span>');
        else if (pm25 <= 55) msgs.push('<span style="color:' + ORANGE + ';">PM2.5: ' + pm25 + ' - Insalubre Sensible</span>');
        else msgs.push('<span style="color:' + RED + ';">PM2.5: ' + pm25 + ' - Insalubre</span>');
      }
      if (voc > 0) {
        if (voc < 250) msgs.push('<span style="color:' + GREEN + ';">VOC: ' + voc + ' ppb - Bueno</span>');
        else if (voc < 500) msgs.push('<span style="color:' + YELLOW + ';">VOC: ' + voc + ' ppb - Moderado</span>');
        else msgs.push('<span style="color:' + RED + ';">VOC: ' + voc + ' ppb - Alto</span>');
      }
      if (rh > 0) {
        if (rh >= 30 && rh <= 60) msgs.push('<span style="color:' + GREEN + ';">HR: ' + rh + '% - \u00D3ptimo</span>');
        else if (rh < 30) msgs.push('<span style="color:' + YELLOW + ';">HR: ' + rh + '% - Muy seco</span>');
        else msgs.push('<span style="color:' + ORANGE + ';">HR: ' + rh + '% - Muy h\u00FAmedo</span>');
      }
      if (msgs.length > 0) {
        aqiEl.innerHTML = '<div style="padding:8px 12px;border-radius:8px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);">' +
          '<div style="font-size:9px;font-weight:700;color:' + ACCENT + ';margin-bottom:4px;">ESTADO IAQ</div>' +
          '<div style="font-size:10px;line-height:1.6;">' + msgs.join('<br>') + '</div></div>';
      } else {
        aqiEl.innerHTML = '';
      }
    }
  }

  // ============================
  // TAB 4: AHU (MANEJADORAS)
  // ============================
  window._chSetMERV = function(val) { _ahuMERV = val; window._chUpdate(); };

  function _renderAHU(c) {
    var h = '';

    // LCD metrics
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:12px;">';
    h += _lcdBox('ahuLCDTotal', 'TOTAL BTU/hr', '---', '', ACCENT);
    h += _lcdBox('ahuLCDSHR', 'SHR', '---', '', GREEN);
    h += _lcdBox('ahuLCDESP', 'ESP', '---', '"WC', BLUE);
    h += '</div>';

    // COIL PERFORMANCE
    h += _subHeader('RENDIMIENTO DEL SERPENT\u00CDN');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuEADB', 'Entering DB', '\u00B0F', '80') + '</div>';
    h += '<div>' + _inputRow('ahuEAWB', 'Entering WB', '\u00B0F', '67') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuLADB', 'Leaving DB', '\u00B0F', '55') + '</div>';
    h += '<div>' + _inputRow('ahuLAWB', 'Leaving WB', '\u00B0F', '54') + '</div>';
    h += '</div>';
    h += _inputRow('ahuCFM', 'CFM', '', '5000');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ahuSensible', 'Sensible', '---', 'BTU/hr', ACCENT);
    h += _lcdBox('ahuLatent', 'Latente', '---', 'BTU/hr', BLUE);
    h += _lcdBox('ahuTotal', 'Total', '---', 'BTU/hr', GREEN);
    h += _lcdBox('ahuSHR', 'SHR', '---', '', YELLOW);
    h += '</div>';

    // FILTERS
    h += _subHeader('FILTROS');
    h += '<div style="margin-bottom:8px;">';
    h += '<label style="font-size:13px;color:' + MUTED + ';font-weight:600;display:block;margin-bottom:3px;">MERV Rating</label>';
    h += '<select id="ahuMERVSel" onchange="window._chSetMERV(this.value)" style="' + SEL + '">' +
      '<option value="8"' + (_ahuMERV==='8'?' selected':'') + '>MERV 8</option>' +
      '<option value="11"' + (_ahuMERV==='11'?' selected':'') + '>MERV 11</option>' +
      '<option value="13"' + (_ahuMERV==='13'?' selected':'') + '>MERV 13</option>' +
      '<option value="14"' + (_ahuMERV==='14'?' selected':'') + '>MERV 14</option>' +
      '<option value="16"' + (_ahuMERV==='16'?' selected':'') + '>MERV 16</option>' +
      '</select></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuFilterClean', '\u0394P Limpio', '"WC', '0.25') + '</div>';
    h += '<div>' + _inputRow('ahuFilterCurrent', '\u0394P Actual', '"WC', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ahuFilterLife', 'Vida Filtro', '---', '%', GREEN);
    h += '<div id="ahuFilterRec" style=""></div>';
    h += '</div>';

    // FAN/MOTOR
    h += _subHeader('VENTILADOR / MOTOR');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuSFAmps', 'SF Amps', 'A', '') + '</div>';
    h += '<div>' + _inputRow('ahuSFVolts', 'SF Volts', 'V', '') + '</div>';
    h += '<div>' + _inputRow('ahuVFD', 'VFD Speed', '%', '100') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuSSP', 'Supply SP', '"WC', '') + '</div>';
    h += '<div>' + _inputRow('ahuRSP', 'Return SP', '"WC', '') + '</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr;gap:6px;margin:8px 0;">';
    h += _lcdBox('ahuESP', 'Total ESP', '---', '"WC', ACCENT);
    h += '</div>';

    // DAMPERS
    h += _subHeader('COMPUERTAS');
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div>' + _inputRow('ahuOAD', 'OA Damper', '%', '') + '</div>';
    h += '<div>' + _inputRow('ahuRAD', 'RA Damper', '%', '') + '</div>';
    h += '<div>' + _inputRow('ahuEAD', 'EA Damper', '%', '') + '</div>';
    h += '</div>';
    h += _inputRow('ahuMAT', 'Mixed Air Temp', '\u00B0F', '');

    // AI Button
    h += '<div style="margin-top:12px;">';
    h += '<button id="chAIBtn4" onclick="window._chRunAI(4)" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA - AHU</button>';
    h += '<div id="chAIResult4"></div></div>';

    c.innerHTML = h;
    _updateAHU();
  }

  function _updateAHU() {
    var eadb = _gv('ahuEADB'), eawb = _gv('ahuEAWB'), ladb = _gv('ahuLADB'), lawb = _gv('ahuLAWB'), cfm = _gv('ahuCFM');

    // Sensible BTU/hr = 1.08 x CFM x DeltaT_DB
    var dtDB = eadb - ladb;
    var sensible = (cfm > 0 && dtDB > 0) ? (1.08 * cfm * dtDB) : 0;
    _sv('ahuSensible', sensible > 0 ? (sensible/1000).toFixed(1) + 'k' : '---');

    // Latent BTU/hr = 0.68 x CFM x Delta_grains (approx from WB difference)
    // Approximate: delta grains ~ 7 x (EWB - LWB) for typical conditions
    var dtWB = eawb - lawb;
    var deltaGrains = dtWB * 7; // rough approximation
    var latent = (cfm > 0 && dtWB > 0) ? (0.68 * cfm * deltaGrains) : 0;
    _sv('ahuLatent', latent > 0 ? (latent/1000).toFixed(1) + 'k' : '---');

    var total = sensible + latent;
    _sv('ahuTotal', total > 0 ? (total/1000).toFixed(1) + 'k' : '---');
    _sv('ahuLCDTotal', total > 0 ? (total/1000).toFixed(0) + 'k' : '---');

    var shr = total > 0 ? sensible / total : 0;
    _sv('ahuSHR', shr > 0 ? shr.toFixed(2) : '---');
    _sv('ahuLCDSHR', shr > 0 ? shr.toFixed(2) : '---');

    // Total ESP = |SSP| + |RSP|
    var ssp = _gv('ahuSSP'), rsp = _gv('ahuRSP');
    var esp = Math.abs(ssp) + Math.abs(rsp);
    _sv('ahuESP', (ssp > 0 || rsp > 0) ? esp.toFixed(2) : '---');
    _sv('ahuLCDESP', (ssp > 0 || rsp > 0) ? esp.toFixed(2) : '---');

    // Filter life
    // MaxDP depends on MERV: MERV8=0.80, MERV11=1.0, MERV13=1.2, MERV14=1.4, MERV16=1.6
    var maxDP = { '8': 0.80, '11': 1.0, '13': 1.2, '14': 1.4, '16': 1.6 };
    var cleanDP = _gv('ahuFilterClean');
    var currDP = _gv('ahuFilterCurrent');
    var maxVal = maxDP[_ahuMERV] || 1.2;
    if (cleanDP > 0 && currDP > 0 && currDP >= cleanDP) {
      var life = (1 - (currDP - cleanDP) / (maxVal - cleanDP)) * 100;
      life = Math.max(0, Math.min(100, life));
      _sv('ahuFilterLife', life.toFixed(0));
      var recEl = document.getElementById('ahuFilterRec');
      if (recEl) {
        var recColor = GREEN; var recMsg = 'Filtro OK';
        if (life < 50) { recColor = YELLOW; recMsg = 'Programar reemplazo'; }
        if (life < 20) { recColor = RED; recMsg = 'REEMPLAZAR AHORA'; }
        if (life <= 0) { recColor = RED; recMsg = 'FILTRO AGOTADO'; }
        recEl.innerHTML = '<div style="background:#FFFFFF;border:1px solid ' + recColor + '33;border-radius:8px;padding:8px;text-align:center;">' +
          '<div style="font-size:12px;color:' + MUTED + ';font-weight:600;margin-bottom:3px;">RECOMENDACI\u00D3N</div>' +
          '<div style="font-size:10px;font-weight:700;color:' + recColor + ';">' + recMsg + '</div></div>';
      }
    } else {
      _sv('ahuFilterLife', '---');
    }
  }

  // ============================
  // TAB 5: IA + REPORTES
  // ============================
  function _renderAIReport(c) {
    var h = '';

    // Summary dashboard
    h += _card('\uD83D\uDCCA RESUMEN GENERAL', _buildSummaryHTML());

    // AI Deep Diagnosis
    h += '<div style="margin-bottom:12px;">';
    h += '<button id="chAIBtnDeep" onclick="window._chRunDeepAI()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83E\uDDE0 Diagn\u00F3stico Profundo IA</button>';
    h += '<div id="chAIResultDeep" style="margin-top:8px;"></div></div>';

    // Generate Report
    h += '<div style="margin-bottom:12px;">';
    h += '<button id="chReportBtn" onclick="window._chGenerateReport()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(59,130,246,0.3);">\uD83D\uDCCB Generar Reporte</button>';
    h += '</div>';

    c.innerHTML = h;
  }

  function _buildSummaryHTML() {
    var h = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">';
    // Pull live calculated values
    var tons = _getCalcVal('chLCDTons');
    var kwTon = _getCalcVal('chLCDkwTon');
    var cop = _getCalcVal('chLCDCOP');
    h += _lcdBox('sumTons', 'Tonelaje', tons || '---', 'Tons', ACCENT);
    h += _lcdBox('sumKWTon', 'kW/Ton', kwTon || '---', '', YELLOW);
    h += _lcdBox('sumCOP', 'COP', cop || '---', '', GREEN);
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">';
    h += _lcdBox('sumCTRange', 'CT Range', _getCalcVal('ctLCDRange') || '---', '\u00B0F', ACCENT);
    h += _lcdBox('sumCTApproach', 'CT Approach', _getCalcVal('ctLCDApproach') || '---', '\u00B0F', YELLOW);
    h += _lcdBox('sumECEff', 'Evap Eff', _getCalcVal('ecLCDEff') || '---', '%', GREEN);
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += _lcdBox('sumACH', 'ACH', _getCalcVal('iaqACH') || '---', '/hr', ACCENT);
    h += _lcdBox('sumESP', 'AHU ESP', _getCalcVal('ahuLCDESP') || '---', '"WC', BLUE);
    h += _lcdBox('sumSHR', 'AHU SHR', _getCalcVal('ahuLCDSHR') || '---', '', GREEN);
    h += '</div>';
    return h;
  }

  function _getCalcVal(id) {
    var el = document.getElementById(id);
    if (el) {
      var v = el.textContent || el.innerText || '';
      return (v && v !== '---') ? v : null;
    }
    return null;
  }

  // ============================
  // AI RUN PER TAB
  // ============================
  window._chRunAI = function(tabIdx) {
    var prompt = '';
    if (tabIdx === 0) {
      prompt = _buildChillerPrompt();
    } else if (tabIdx === 1) {
      prompt = _buildCTPrompt();
    } else if (tabIdx === 2) {
      prompt = _buildECPrompt();
    } else if (tabIdx === 3) {
      prompt = _buildIAQPrompt();
    } else if (tabIdx === 4) {
      prompt = _buildAHUPrompt();
    }
    prompt += '\n\nIMPORTANTE: Basa tu diagn\u00F3stico \u00DANICAMENTE en los datos proporcionados. NO inventes datos.';
    _chCallIA(prompt, 'chAIResult' + tabIdx, 'chAIBtn' + tabIdx);
  };

  window._chRunDeepAI = function() {
    var prompt = 'DIAGN\u00D3STICO PROFUNDO - SISTEMA HVAC COMERCIAL COMPLETO\n\n';
    prompt += _buildChillerPrompt() + '\n\n';
    prompt += _buildCTPrompt() + '\n\n';
    prompt += _buildECPrompt() + '\n\n';
    prompt += _buildIAQPrompt() + '\n\n';
    prompt += _buildAHUPrompt() + '\n\n';
    prompt += 'Equipo: ' + (window._chEquip ? window._chEquip.model : 'N/A') + ' S/N: ' + (window._chEquip ? window._chEquip.serial : 'N/A') + '\n';
    prompt += '\nIMPORTANTE: Basa tu diagn\u00F3stico \u00DANICAMENTE en los datos proporcionados. NO inventes datos. Analiza TODOS los subsistemas en conjunto y detecta correlaciones entre problemas.';
    _chCallIA(prompt, 'chAIResultDeep', 'chAIBtnDeep');
  };

  function _buildChillerPrompt() {
    return 'CHILLER - Tipo: ' + _chChillerType + ', Refrigerante: ' + _chRefrigerant + '\n' +
      'EVAPORADOR: EWT=' + _gv('chEvapEWT') + '\u00B0F, LWT=' + _gv('chEvapLWT') + '\u00B0F, GPM=' + _gv('chEvapGPM') + ', Succi\u00F3n=' + _gv('chSuctP') + ' psig\n' +
      'CONDENSADOR: ' + (_isWaterCooled() ? 'ECWT=' + _gv('chCondECWT') + '\u00B0F, LCWT=' + _gv('chCondLCWT') + '\u00B0F, GPM=' + _gv('chCondGPM') : 'OAT=' + _gv('chCondOAT') + '\u00B0F') + ', Descarga=' + _gv('chDischP') + ' psig\n' +
      'COMPRESOR: V(L1-L2)=' + _gv('chVL12') + ', V(L2-L3)=' + _gv('chVL23') + ', V(L1-L3)=' + _gv('chVL13') + ', A(L1)=' + _gv('chAL1') + ', A(L2)=' + _gv('chAL2') + ', A(L3)=' + _gv('chAL3') +
      ', Aceite P=' + _gv('chOilP') + ' psig, Aceite T=' + _gv('chOilT') + '\u00B0F, Disch T=' + _gv('chDischT') + '\u00B0F\n' +
      'EFICIENCIA: kW=' + _gv('chKW');
  }

  function _buildCTPrompt() {
    return 'TORRE DE ENFRIAMIENTO - Tipo: ' + _ctType + '\n' +
      'Agua: Hot=' + _gv('ctHotIn') + '\u00B0F, Cold=' + _gv('ctColdOut') + '\u00B0F, WB=' + _gv('ctWB') + '\u00B0F, GPM=' + _gv('ctGPM') + '\n' +
      'Fan: ' + _gv('ctFanA') + 'A, ' + _gv('ctFanV') + 'V, VFD=' + _gv('ctVFD') + '%\n' +
      'Agua: Conductividad=' + _gv('ctCond') + '\u00B5S/cm, pH=' + _gv('ctPH') + ', COC=' + _gv('ctCOC') + ', TDS=' + _gv('ctTDS') + 'ppm';
  }

  function _buildECPrompt() {
    var padSel = document.getElementById('ecPadCond');
    var waterSel = document.getElementById('ecWaterDist');
    return 'EVAP COOLER - Tipo: ' + _ecType + '\n' +
      'ODB=' + _gv('ecODB') + '\u00B0F, OWB=' + _gv('ecOWB') + '\u00B0F, SAT=' + _gv('ecSAT') + '\u00B0F\n' +
      'Pad: ' + (padSel ? padSel.value : 'N/A') + ', Agua: ' + (waterSel ? waterSel.value : 'N/A') + '\n' +
      'Bomba: ' + _gv('ecPumpA') + 'A, Fan: ' + _gv('ecFanA') + 'A/' + _gv('ecFanV') + 'V';
  }

  function _buildIAQPrompt() {
    return 'IAQ / VENTILACI\u00D3N\n' +
      'CO2: Exterior=' + _gv('iaqCO2Out') + 'ppm, Interior=' + _gv('iaqCO2In') + 'ppm\n' +
      'Aire: OA=' + _gv('iaqOACFM') + 'CFM, RA=' + _gv('iaqRACFM') + 'CFM, SA=' + _gv('iaqSACFM') + 'CFM\n' +
      'Cuarto: L=' + _gv('iaqRoomL') + 'ft, W=' + _gv('iaqRoomW') + 'ft, H=' + _gv('iaqRoomH') + 'ft\n' +
      'Economizador: OA Dmpr=' + _gv('iaqOADmpr') + '%, RA Dmpr=' + _gv('iaqRADmpr') + '%, MAT=' + _gv('iaqMAT') + '\u00B0F, COSP=' + _gv('iaqCOSP') + '\u00B0F\n' +
      'Sensores: PM2.5=' + _gv('iaqPM25') + '\u00B5g/m\u00B3, VOC=' + _gv('iaqVOC') + 'ppb, Temp=' + _gv('iaqTemp') + '\u00B0F, RH=' + _gv('iaqRH') + '%';
  }

  function _buildAHUPrompt() {
    return 'AHU (MANEJADORA)\n' +
      'Serp\u00EDn: EA DB=' + _gv('ahuEADB') + '\u00B0F, EA WB=' + _gv('ahuEAWB') + '\u00B0F, LA DB=' + _gv('ahuLADB') + '\u00B0F, LA WB=' + _gv('ahuLAWB') + '\u00B0F, CFM=' + _gv('ahuCFM') + '\n' +
      'Filtro: MERV ' + _ahuMERV + ', \u0394P Limpio=' + _gv('ahuFilterClean') + ', \u0394P Actual=' + _gv('ahuFilterCurrent') + '\n' +
      'Fan: ' + _gv('ahuSFAmps') + 'A, ' + _gv('ahuSFVolts') + 'V, VFD=' + _gv('ahuVFD') + '%, SSP=' + _gv('ahuSSP') + '"WC, RSP=' + _gv('ahuRSP') + '"WC\n' +
      'Compuertas: OA=' + _gv('ahuOAD') + '%, RA=' + _gv('ahuRAD') + '%, EA=' + _gv('ahuEAD') + '%, MAT=' + _gv('ahuMAT') + '\u00B0F';
  }

  // ============================
  // REPORT GENERATION
  // ============================
  window._chGenerateReport = function() {
    var eq = window._chEquip || {};
    var now = new Date();
    var dateStr = now.toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' }) + ' ' + now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });

    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte HVAC Comercial</title>';
    html += '<style>';
    html += 'body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0;background:#FFFFFF;color:#111111;}';
    html += '.header{background:linear-gradient(135deg,#f8f9fa,#ffffff);padding:24px 30px;border-bottom:3px solid #111827;}';
    html += '.header h1{margin:0;font-size:22px;color:#111111;letter-spacing:1px;}';
    html += '.header h2{margin:4px 0 0;font-size:13px;color:#111111;font-weight:600;}';
    html += '.header .meta{font-size:10px;color:#111111;margin-top:6px;}';
    html += '.section{padding:16px 30px;}';
    html += '.section-title{font-size:14px;font-weight:800;color:#111111;border-left:4px solid #111827;padding-left:8px;margin:16px 0 10px;}';
    html += '.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;}';
    html += '.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}';
    html += '.stat{background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:10px;text-align:center;}';
    html += '.stat .label{font-size:9px;color:#111111;font-weight:600;margin-bottom:3px;}';
    html += '.stat .value{font-size:18px;font-weight:900;color:#111111;font-family:Courier New,monospace;}';
    html += '.stat .unit{font-size:9px;color:#111111;}';
    html += '.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.03);font-size:11px;}';
    html += '.row .lbl{color:#111111;}.row .val{color:#111111;font-weight:700;}';
    html += '.status-good{color:#22c55e;}.status-warn{color:#eab308;}.status-bad{color:#ef4444;}';
    html += '.info-box{background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:10px;margin-bottom:12px;}';
    html += '.footer{text-align:center;padding:20px;font-size:9px;color:#111111;border-top:1px solid rgba(0,0,0,0.08);}';
    html += '@media print{body{background:#fff;color:#0F0F0F;}.header{background:#FAFAF7;border-bottom-color:#111111;}.header h1{color:#0F0F0F;}.stat{background:#FAFAF7;border-color:#111111;}.stat .value{color:#111111;}.row{border-bottom-color:#111111;}.row .lbl{color:#111111;}.row .val{color:#0F0F0F;}}';
    html += '</style></head><body>';

    // Header
    html += '<div class="header">';
    html += '<h1>MAESTRO HVACR</h1>';
    html += '<h2>\uD83C\uDFED Reporte HVAC Comercial</h2>';
    html += '<div class="meta">' + dateStr + '</div>';
    html += '</div>';

    // Equipment info
    html += '<div class="section">';
    html += '<div class="info-box">';
    html += '<div class="grid2">';
    html += '<div class="row"><span class="lbl">Modelo:</span><span class="val">' + (eq.model || 'N/A') + '</span></div>';
    html += '<div class="row"><span class="lbl">Serie:</span><span class="val">' + (eq.serial || 'N/A') + '</span></div>';
    html += '<div class="row"><span class="lbl">Cliente:</span><span class="val">' + (eq.clientName || 'N/A') + '</span></div>';
    html += '<div class="row"><span class="lbl">Direcci\u00F3n:</span><span class="val">' + (eq.clientAddr || 'N/A') + '</span></div>';
    html += '<div class="row"><span class="lbl">T\u00E9cnico:</span><span class="val">' + (eq.techName || 'N/A') + ' (#' + (eq.techNum || 'N/A') + ')</span></div>';
    html += '<div class="row"><span class="lbl">Email:</span><span class="val">' + (eq.techEmail || 'N/A') + '</span></div>';
    html += '</div></div>';

    // Chiller section
    html += '<div class="section-title">CHILLER - ' + _chChillerType.toUpperCase() + ' / ' + _chRefrigerant + '</div>';
    html += '<div class="grid">';
    html += _reportStat('Tonelaje', _gv('chEvapGPM') > 0 ? ((_gv('chEvapGPM') * (_gv('chEvapEWT') - _gv('chEvapLWT'))) / 24).toFixed(1) : '---', 'Tons');
    html += _reportStat('kW/Ton', _gv('chKW') > 0 && _gv('chEvapGPM') > 0 ? (_gv('chKW') / ((_gv('chEvapGPM') * (_gv('chEvapEWT') - _gv('chEvapLWT'))) / 24)).toFixed(3) : '---', '');
    html += _reportStat('COP', _gv('chKW') > 0 && _gv('chEvapGPM') > 0 ? (((_gv('chEvapGPM') * (_gv('chEvapEWT') - _gv('chEvapLWT'))) / 24) * 3.517 / _gv('chKW')).toFixed(2) : '---', '');
    html += '</div>';
    html += _reportRow('EWT / LWT', _gv('chEvapEWT') + ' / ' + _gv('chEvapLWT') + ' \u00B0F');
    html += _reportRow('Evap GPM', _gv('chEvapGPM') + ' GPM');
    html += _reportRow('Succi\u00F3n', _gv('chSuctP') + ' psig');
    html += _reportRow('Descarga', _gv('chDischP') + ' psig');
    if (_isWaterCooled()) {
      html += _reportRow('ECWT / LCWT', _gv('chCondECWT') + ' / ' + _gv('chCondLCWT') + ' \u00B0F');
      html += _reportRow('Cond GPM', _gv('chCondGPM') + ' GPM');
    } else {
      html += _reportRow('Ambient', _gv('chCondOAT') + ' \u00B0F');
    }
    html += _reportRow('Voltaje', _gv('chVL12') + ' / ' + _gv('chVL23') + ' / ' + _gv('chVL13') + ' V');
    html += _reportRow('Amperaje', _gv('chAL1') + ' / ' + _gv('chAL2') + ' / ' + _gv('chAL3') + ' A');
    html += _reportRow('Aceite', _gv('chOilP') + ' psig / ' + _gv('chOilT') + ' \u00B0F');
    html += _reportRow('Temp Descarga', _gv('chDischT') + ' \u00B0F');
    html += _reportRow('kW', _gv('chKW') + ' kW');

    // Cooling Tower section
    html += '<div class="section-title">TORRE DE ENFRIAMIENTO - ' + _ctType.toUpperCase() + '</div>';
    var ctRange = _gv('ctHotIn') - _gv('ctColdOut');
    var ctApproach = _gv('ctColdOut') - _gv('ctWB');
    html += '<div class="grid">';
    html += _reportStat('Range', ctRange > 0 ? ctRange.toFixed(1) : '---', '\u00B0F');
    html += _reportStat('Approach', ctApproach >= 0 ? ctApproach.toFixed(1) : '---', '\u00B0F');
    html += _reportStat('Heat Rej', (ctRange > 0 && _gv('ctGPM') > 0) ? ((_gv('ctGPM') * ctRange * 500) / 1000).toFixed(0) + 'k' : '---', 'BTU/hr');
    html += '</div>';
    html += _reportRow('Hot In / Cold Out', _gv('ctHotIn') + ' / ' + _gv('ctColdOut') + ' \u00B0F');
    html += _reportRow('Bulbo H\u00FAmedo', _gv('ctWB') + ' \u00B0F');
    html += _reportRow('GPM', _gv('ctGPM'));
    html += _reportRow('pH / Conductividad', _gv('ctPH') + ' / ' + _gv('ctCond') + ' \u00B5S/cm');
    html += _reportRow('TDS / COC', _gv('ctTDS') + ' ppm / ' + _gv('ctCOC'));

    // Evap Cooler section
    html += '<div class="section-title">ENFRIAMIENTO EVAPORATIVO - ' + _ecType.toUpperCase() + '</div>';
    var ecEff = (_gv('ecODB') > 0 && _gv('ecOWB') > 0 && _gv('ecSAT') > 0 && (_gv('ecODB') - _gv('ecOWB')) > 0) ? ((_gv('ecODB') - _gv('ecSAT')) / (_gv('ecODB') - _gv('ecOWB')) * 100) : 0;
    html += '<div class="grid">';
    html += _reportStat('Efectividad', ecEff > 0 ? ecEff.toFixed(1) : '---', '%');
    html += _reportStat('Depresi\u00F3n', (_gv('ecODB') - _gv('ecOWB')).toFixed(1), '\u00B0F');
    html += _reportStat('Supply Air', _gv('ecSAT') || '---', '\u00B0F');
    html += '</div>';

    // IAQ section
    html += '<div class="section-title">CALIDAD DE AIRE INTERIOR (IAQ)</div>';
    var oaPct = (_gv('iaqOACFM') > 0 && _gv('iaqSACFM') > 0) ? (_gv('iaqOACFM') / _gv('iaqSACFM') * 100) : 0;
    html += '<div class="grid">';
    html += _reportStat('CO\u2082 Interior', _gv('iaqCO2In') || '---', 'ppm');
    html += _reportStat('OA %', oaPct > 0 ? oaPct.toFixed(1) : '---', '%');
    var vol = _gv('iaqRoomL') * _gv('iaqRoomW') * _gv('iaqRoomH');
    var cfmIaq = _gv('iaqSACFM') || _gv('iaqOACFM');
    var achVal = (cfmIaq > 0 && vol > 0) ? (cfmIaq * 60 / vol) : 0;
    html += _reportStat('ACH', achVal > 0 ? achVal.toFixed(1) : '---', '/hr');
    html += '</div>';
    html += _reportRow('PM2.5 / VOC', _gv('iaqPM25') + ' \u00B5g/m\u00B3 / ' + _gv('iaqVOC') + ' ppb');
    html += _reportRow('Temp / HR', _gv('iaqTemp') + ' \u00B0F / ' + _gv('iaqRH') + '%');

    // AHU section
    html += '<div class="section-title">MANEJADORA DE AIRE (AHU)</div>';
    var dtDBr = _gv('ahuEADB') - _gv('ahuLADB');
    var sensR = (_gv('ahuCFM') > 0 && dtDBr > 0) ? (1.08 * _gv('ahuCFM') * dtDBr) : 0;
    html += '<div class="grid">';
    html += _reportStat('Sensible', sensR > 0 ? (sensR / 1000).toFixed(1) + 'k' : '---', 'BTU/hr');
    html += _reportStat('ESP', (Math.abs(_gv('ahuSSP')) + Math.abs(_gv('ahuRSP'))).toFixed(2), '"WC');
    html += _reportStat('MERV', _ahuMERV, '');
    html += '</div>';
    html += _reportRow('Entering DB/WB', _gv('ahuEADB') + ' / ' + _gv('ahuEAWB') + ' \u00B0F');
    html += _reportRow('Leaving DB/WB', _gv('ahuLADB') + ' / ' + _gv('ahuLAWB') + ' \u00B0F');
    html += _reportRow('CFM', _gv('ahuCFM'));
    html += _reportRow('SSP / RSP', _gv('ahuSSP') + ' / ' + _gv('ahuRSP') + ' "WC');
    html += _reportRow('Dampers OA/RA/EA', _gv('ahuOAD') + '% / ' + _gv('ahuRAD') + '% / ' + _gv('ahuEAD') + '%');
    html += _reportRow('Mixed Air Temp', _gv('ahuMAT') + ' \u00B0F');

    html += '</div>';

    // Footer
    html += '<div class="footer">';
    html += 'Generado por MAESTRO HVACR \u2014 Herramienta HVAC Comercial<br>';
    html += dateStr + ' \u2014 ' + (eq.techName || 'T\u00E9cnico') + ' (' + (eq.techEmail || '') + ')';
    html += '</div>';

    html += '<script>window.onload=function(){window.print();}<\/script>';
    html += '</body></html>';

    var w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  function _reportStat(label, value, unit) {
    return '<div class="stat"><div class="label">' + label + '</div><div class="value">' + value + '</div><div class="unit">' + unit + '</div></div>';
  }

  function _reportRow(label, value) {
    return '<div class="row"><span class="lbl">' + label + '</span><span class="val">' + value + '</span></div>';
  }

})();
