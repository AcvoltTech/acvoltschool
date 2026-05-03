/**
 * Herramientas HVAC — Professional tools for HVAC technicians
 * Features: PT Chart, Reverse Lookup, Superheat/Subcooling Calc, Compare Mode, Refrigerant Guide
 */
(function() {
  'use strict';

  var _htRef = 'R-410A';
  var _htRef2 = '';
  var _htUnitF = true;
  var _htView = 'menu';
  var _htCompare = false;
  var _htHighlightedTemp = null;
  var _th = window._th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

  // ============================
  // SUNLIGHT LEGIBILITY CSS — injected once, overrides faded inline colors
  // across every tool card so techs can read the app against direct sun.
  // Uses attribute selectors on the inline style strings already in the code.
  // ============================
  function _htEnsureLegibleCss() {
    if (document.getElementById('htLegibleCss')) return;
    // Scope: only #herramientasScreen, and NEVER touch the BLE bar (dark-themed)
    // or anything explicitly opted-out via .htKeepColor
    var SCOPE = '#herramientasScreen';
    var EXCLUDE = ':not(.ble-bar-wrap):not(.ble-bar-wrap *):not(.htKeepColor):not(.htKeepColor *)';
    function sel(inner) { return SCOPE + ' ' + inner + EXCLUDE; }
    var faded = ['#4b5563','#6b7280','#8E8E93','#8e8e93','#94a3b8','#64748b','#9ca3af','#cbd5e1','#d1d5db','#e5e7eb','#3C3C43','#3c3c43','#111827','#1C1C1E','#1c1c1e','#475569','#374151','#334155','#60a5fa','#93c5fd','#c084fc','#d8b4fe','#c4b5fd','#a1a1aa','#a3a3a3','#d4d4d8'];
    var colorRules = faded.map(function(c){
      return sel('[style*="color:' + c + '"]') + ',' + sel('[style*="color: ' + c + '"]');
    }).join(',') + '{color:#111111 !important;}';
    var smallFontRules = '';
    for (var fs = 7; fs <= 12; fs++) {
      smallFontRules += sel('[style*="font-size:' + fs + 'px"]') + ',' + sel('[style*="font-size: ' + fs + 'px"]') + '{font-size:13px !important;}';
    }
    var commonRules = [
      sel('input') + ',' + sel('select') + ',' + sel('textarea') + '{color:#111111 !important;}',
      SCOPE + ' input:not(.ble-bar-wrap input)::placeholder,' + SCOPE + ' textarea:not(.ble-bar-wrap textarea)::placeholder{color:#111111 !important;opacity:0.75 !important;font-weight:600 !important;}',
      sel('th') + ',' + sel('td') + ',' + sel('label') + ',' + sel('p') + ',' + sel('li') + '{color:#111111 !important;}',
      SCOPE + ' table:not(.ble-bar-wrap table){font-size:14px !important;}'
    ].join('');
    var css = colorRules + smallFontRules + commonRules;
    var style = document.createElement('style');
    style.id = 'htLegibleCss';
    style.textContent = css;
    document.head.appendChild(style);
  }
  window._htEnsureLegibleCss = _htEnsureLegibleCss;

  // ============================
  // INIT
  // ============================
  window.initHerramientas = function() {
    var s = document.getElementById('herramientasScreen');
    if (!s) return;
    if (window._htPendingTool) {
      var tid = window._htPendingTool;
      window._htPendingTool = null;
      _htShowTool(tid);
      return;
    }
    _htView = 'menu';
    window._htActiveTool = null;
    _htRenderMenu(s);
  };

  window.initManifoldScreen = function() {
    var s = document.getElementById('manifoldScreen');
    if (!s) return;
    _htShowManifold(s, true);
  };

  // ============================
  // TOOL MENU
  // ============================
  function _htRenderMenu(s) {
    _htView = 'menu';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var sections = [
      { label: _th('ht_section_reference', 'REFERENCIA'), color: '#3b82f6', tools: [
        { id: 'ptchart', icon: '\uD83D\uDCCA', title: 'PT Chart', desc: _th('ht_ptchart_desc', 'Presi\u00F3n-Temperatura 16 refrigerantes'), ready: true },
        { id: 'refguide', icon: '\uD83E\uDDEA', title: _th('ht_refguide_title', 'Gu\u00EDa de Refrigerantes'), desc: _th('ht_refguide_desc', 'Propiedades, ASHRAE 34, aceite, GWP'), ready: true },
        { id: 'phdiagram', icon: '\uD83D\uDCC8', title: _th('ht_phdiagram_title', 'Diagrama P-h'), desc: _th('ht_phdiagram_desc', 'Presi\u00F3n-Entalp\u00EDa interactivo'), ready: true },
        { id: 'converter', icon: '\uD83D\uDD04', title: _th('ht_converter_title', 'Convertidor HVAC'), desc: _th('ht_converter_desc', 'Temp, presi\u00F3n, energ\u00EDa, flujo, longitud'), ready: true },
        { id: 'psychart', icon: '\uD83C\uDF21\uFE0F', title: _th('ht_psychart_title', 'Tabla Psicrom\u00E9trica'), desc: _th('ht_psychart_desc', 'Aire h\u00FAmedo: DB, WB, HR, entalp\u00EDa, dew point'), ready: true }
      ]},
      { label: _th('ht_section_field_calc', 'C\u00C1LCULOS DE CAMPO'), color: '#f59e0b', tools: [
        { id: 'shsc', icon: '\uD83D\uDD25', title: _th('ht_shsc_title', 'Superheat / Subcooling'), desc: _th('ht_shsc_desc', 'Recalentamiento y subenfriamiento'), ready: true },
        { id: 'ductulator', icon: '\uD83D\uDCA8', title: _th('ht_ductulator_title', 'Ductulator'), desc: _th('ht_ductulator_desc', 'Sizing de ductos: CFM, velocidad, fricci\u00F3n'), ready: true },
        { id: 'conduitfill', icon: '\uD83D\uDD33', title: _th('ht_conduitfill_title', 'Conduit Fill'), desc: _th('ht_conduitfill_desc', 'C\u00E1lculo NEC de llenado de conduit'), ready: true },
        { id: 'wiresizing', icon: '\u26A1', title: _th('ht_wiresizing_title', 'Wire Sizing / Voltage Drop'), desc: _th('ht_wiresizing_desc', 'Selector de cable, amperage, ca\u00EDda de voltaje'), ready: true },
        { id: 'refcharge', icon: '\uD83D\uDCCB', title: _th('ht_refcharge_title', 'Carga de Refrigerante'), desc: _th('ht_refcharge_desc', 'C\u00E1lculo de carga + recuperaci\u00F3n por sistema'), ready: true },
        { id: 'linesize', icon: '\uD83D\uDD27', title: _th('ht_linesize_title', 'Line Sizing'), desc: _th('ht_linesize_desc', 'Tuber\u00EDa succi\u00F3n/l\u00EDquido/descarga por capacidad'), ready: true },
        { id: 'elecload', icon: '<img src="elec-load-icon.png?v=3" style="width:56px;height:56px;border-radius:10px;">', title: _th('ht_elecload_title', 'Electrical Load Calculation'), desc: _th('ht_elecload_desc', 'C\u00E1lculo el\u00E9ctrico residencial NEC Art. 220'), ready: true }
      ]},
      { label: _th('ht_section_interactive', 'HERRAMIENTAS INTERACTIVAS'), color: '#a855f7', tools: [
        { id: 'powerwheel', icon: '\u2699\uFE0F', title: _th('ht_powerwheel_title', 'Power Wheel'), desc: _th('ht_powerwheel_desc', 'Rueda de Ohm\'s Law: V, I, R, P interactivo'), ready: true },
        { id: 'manifold', icon: '\uD83D\uDD34', title: _th('ht_manifold_title', 'Man\u00F3metro Interactivo'), desc: _th('ht_manifold_desc', 'Simulador de gauges con lectura de presiones'), ready: true },
        { id: 'multimeter', icon: '\uD83D\uDD0C', title: _th('ht_multimeter_title', 'Mult\u00EDmetro HVAC'), desc: _th('ht_multimeter_desc', 'Voltaje, amperaje, capacitor, windings, diagn\u00F3stico'), ready: true },
        { id: 'manometerhvac', icon: '\uD83D\uDD27', title: _th('ht_manometerhvac_title', 'Man\u00F3metro HVAC'), desc: _th('ht_manometer_desc', 'Gas valve, LPS, static, CFM, ductos'), ready: true }
      ]},
      { label: _th('ht_section_ai_diag', 'DIAGN\u00D3STICO CON IA'), color: '#ef4444', tools: [
        { id: 'sysanalyzer', icon: '\uD83E\uDDE0', title: _th('ht_sysanalyzer_title', 'System Analyzer'), desc: _th('ht_sysanalyzer_desc', 'An\u00E1lisis completo del sistema con IA'), ready: true },
        { id: 'troubleshoot', icon: '\uD83D\uDD0D', title: _th('ht_troubleshoot_title', 'Troubleshooting IA'), desc: _th('ht_troubleshoot_desc', 'S\u00EDntomas \u2192 diagn\u00F3stico paso a paso'), ready: true },
        { id: 'carga', icon: '<img src="hvac-sizing-icon.png?v=3" style="width:56px;height:56px;border-radius:10px;">', title: _th('ht_carga_title', 'HVAC Equipment Sizing'), desc: _th('ht_carga_desc', 'Manual J Room-by-Room con IA'), ready: true },
        { id: 'walkin', icon: '<img src="walkin-sizing-icon.png?v=3" style="width:56px;height:56px;border-radius:10px;">', title: _th('ht_walkin_title', 'Walk-in Sizing'), desc: _th('ht_walkin_desc', 'C\u00E1lculo de cuartos fr\u00EDos y congeladores'), ready: true }
      ]}
    ];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#111827;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:14px 16px 12px;">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<button onclick="showScreen(\'dashboardScreen\')" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:20px;font-weight:800;color:#111827;">' + _th('ht_title', 'Herramientas HVAC') + '</div>';
    h += '<div style="font-size:11px;color:#4b5563;font-weight:500;">' + _th('ht_subtitle', 'Referencia, c\u00E1lculos y diagn\u00F3stico profesional') + '</div></div></div></div>';

    // Location banner — show if location not granted
    var _locGranted = localStorage.getItem('maestro_location_granted') === 'true';
    if (!_locGranted) {
      h += '<div id="htLocBanner" style="margin:0 12px 8px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:10px 12px;">';
      h += '<div style="display:flex;align-items:center;gap:8px;">';
      h += '<span style="font-size:18px;">📍</span>';
      h += '<div style="flex:1;">';
      h += '<div style="font-size:11px;font-weight:700;color:#fbbf24;">' + _th('ht_loc_not_active', 'Ubicación no activada') + '</div>';
      h += '<div style="font-size:10px;color:#4b5563;line-height:1.4;">' + _th('ht_loc_desc', 'Para reportes más precisos, activa tu ubicación. Sin ella, las herramientas funcionan pero los datos del clima no estarán al 100%.') + '</div>';
      h += '</div></div>';
      h += '<button onclick="window._htRequestLocation()" id="htLocBannerBtn" style="margin-top:8px;width:100%;padding:8px;border-radius:8px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-weight:700;font-size:11px;cursor:pointer;">' + _th('ht_loc_activate', 'Activar Ubicación') + '</button>';
      h += '</div>';
    }

    h += '<div style="padding:0 12px 32px;">';
    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      h += '<div style="margin-bottom:16px;">';
      h += '<div style="font-size:10px;font-weight:800;color:' + sec.color + ';letter-spacing:1px;padding:6px 0 6px 4px;border-bottom:1px solid ' + sec.color + '30;margin-bottom:6px;">' + sec.label + '</div>';
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      for (var ti = 0; ti < sec.tools.length; ti++) {
        var t = sec.tools[ti];
        var oc = t.ready ? ' onclick="_htShowTool(\'' + t.id + '\')"' : '';
        var cs = t.ready ? 'cursor:pointer;' : 'cursor:default;opacity:0.45;';
        h += '<div' + oc + ' style="background:#FFFFFF;border:1px solid #e5e7eb;border-radius:12px;padding:12px 10px;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-top:3px solid ' + sec.color + ';' + cs + '">';
        h += '<div style="font-size:22px;margin-bottom:4px;">' + t.icon + '</div>';
        h += '<div style="font-size:11px;font-weight:700;color:#111827;margin-bottom:2px;">' + t.title + '</div>';
        h += '<div style="font-size:8px;color:#4b5563;line-height:1.4;">' + t.desc + '</div>';
        if (!t.ready) h += '<div style="margin-top:4px;font-size:7px;font-weight:600;color:#f59e0b;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:3px;padding:1px 5px;display:inline-block;">' + _th('ht_coming_soon', 'Pr\u00F3ximamente') + '</div>';
        h += '</div>';
      }
      h += '</div></div>';
    }
    h += '</div></div>';
    s.innerHTML = h;
  }

  // Request location from herramientas banner
  window._htRequestLocation = function() {
    var btn = document.getElementById('htLocBannerBtn');
    var _th2 = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    if (btn) { btn.textContent = _th2('ht_loc_requesting', 'Solicitando permiso...'); btn.disabled = true; }
    if (typeof _requestLocationForTools === 'function') {
      _requestLocationForTools(
        function() {
          // Success — remove banner
          var banner = document.getElementById('htLocBanner');
          if (banner) { banner.innerHTML = '<div style="text-align:center;padding:6px;color:#22c55e;font-size:11px;font-weight:700;">' + _th2('ht_loc_activated', 'Ubicación activada — datos del clima sincronizados') + '</div>'; }
          setTimeout(function() { if (banner) banner.remove(); }, 2000);
        },
        function() {
          // Denied/failed — update banner
          if (btn) { btn.textContent = _th2('ht_loc_retry', 'Reintentar'); btn.disabled = false; }
          var banner = document.getElementById('htLocBanner');
          if (banner) {
            var msg = banner.querySelector('div[style*="color:#4b5563"]');
            if (msg) msg.innerHTML = _th2('ht_loc_failed', 'No se pudo activar. Las herramientas siguen funcionando, pero los reportes no tendrán datos del clima al 100%.') + '<br><span style="font-size:9px;color:#4b5563;">' + _th2('ht_loc_android_hint', 'Android: Configuración > Apps > Chrome > Permisos > Ubicación') + '</span>';
          }
        }
      );
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          localStorage.setItem('maestro_location_granted', 'true');
          if (typeof initWeatherWidget === 'function') initWeatherWidget();
          var banner = document.getElementById('htLocBanner');
          if (banner) { banner.innerHTML = '<div style="text-align:center;padding:6px;color:#22c55e;font-size:11px;font-weight:700;">' + _th2('ht_loc_activated_short', 'Ubicación activada') + '</div>'; }
          setTimeout(function() { if (banner) banner.remove(); }, 2000);
        },
        function() {
          if (btn) { btn.textContent = '📍 Reintentar'; btn.disabled = false; }
        },
        { timeout: 15000, maximumAge: 60000 }
      );
    }
  };

  window._htShowTool = function(id) {
    var s = document.getElementById('herramientasScreen');
    if (!s) return;
    _htEnsureLegibleCss();
    if (id === 'ptchart') _htShowPT(s);
    if (id === 'refguide') _htShowRefGuide(s);
    if (id === 'shsc') _htShowSHSC(s);
    if (id === 'phdiagram') _htShowPH(s);
    if (id === 'converter') _htShowConverter(s);
    if (id === 'ductulator') _htShowDuctulator(s);
    if (id === 'conduitfill') _htShowConduitFill(s);
    if (id === 'wiresizing') _htShowWireSizing(s);
    if (id === 'powerwheel') _htShowPowerWheel(s);
    if (id === 'sysanalyzer') _htShowSysAnalyzer(s);
    if (id === 'troubleshoot') _htShowTroubleshoot(s);
    if (id === 'psychart') _htShowPsychart(s);
    if (id === 'manifold') _htShowManifold(s);
    if (id === 'carga') _htShowCargaTermica(s);
    if (id === 'walkin') _htShowWalkin(s);
    if (id === 'refcharge') _htShowRefCharge(s);
    if (id === 'linesize') _htShowLineSize(s);
    if (id === 'multimeter') _htShowMultimeter(s);
    if (id === 'elecload') _htShowElecLoad(s);
    if (id === 'manometerhvac') showScreen('manometerHvacScreen');
    // Track active herramientas tool for global BLE auto-populate
    window._htActiveTool = id;
    // Inject inline BLE connection bar on all HVAC tool screens
    if (id !== 'manometerhvac' && typeof _injectBLEBar === 'function') {
      _injectBLEBar('herramientasScreen', id);
    }
  };

  // ============================
  // PT CHART
  // ============================
  function _htShowPT(s) {
    _htView = 'ptchart'; _htCompare = false; _htRef2 = '';
    var h = '<div id="htPTRoot" style="background:#FFFFFF;min-height:100vh;color:#111111;display:flex;flex-direction:column;">';
    h += '<style>#htPTRoot select,#htPTRoot input,#htPTRoot option{color:#111111 !important;}#htPTRoot input::placeholder{color:#111111;opacity:0.85;font-weight:600;}#htPTRoot table{font-size:13px !important;}</style>';
    // Header
    h += '<div style="position:sticky;top:0;z-index:20;background:#FFFFFF;border-bottom:1px solid rgba(0,0,0,0.06);padding:10px 12px;">';
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#111111;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:17px;font-weight:800;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;min-width:0;"><div style="font-size:17px;font-weight:800;color:#111111;">PT Chart</div>';
    h += '<div id="htRefMeta" style="font-size:12px;color:#111111;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div></div>';
    h += '<button id="htUnitBtn" onclick="_htToggleUnits()" style="background:rgba(59,130,246,0.18);border:1px solid rgba(59,130,246,0.4);color:#111111;padding:6px 12px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">' + (_htUnitF ? '\u00B0F' : '\u00B0C') + '</button>';
    h += '<button id="htCmpBtn" onclick="_htToggleCompare()" style="background:rgba(168,85,247,0.18);border:1px solid rgba(168,85,247,0.4);color:#111111;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">' + (typeof _t === 'function' ? _t('ht_compare') : 'Comparar') + '</button>';
    h += '</div>';
    // Selectors row
    h += '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">';
    h += _htRefSelect('htRefSelect', '_htChangeRef', _htRef);
    h += '<div id="htRef2Wrap" style="display:none;">' + _htRefSelect('htRef2Select', '_htChangeRef2', '') + '</div>';
    h += '<input id="htTempSearch" type="number" placeholder="Temp \u00B0' + (_htUnitF ? 'F' : 'C') + '" oninput="_htSearchTemp(this.value)" class="htPTInput" style="width:78px;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.2);border-radius:8px;padding:7px 9px;font-size:14px;font-weight:700;outline:none;-moz-appearance:textfield;" />';
    h += '<input id="htPsigSearch" type="number" placeholder="psig" oninput="_htSearchPsig(this.value)" class="htPTInput" style="width:72px;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.2);border-radius:8px;padding:7px 9px;font-size:14px;font-weight:700;outline:none;-moz-appearance:textfield;" />';
    h += '</div>';
    // Temperature slider
    h += '<div style="margin-top:8px;display:flex;align-items:center;gap:8px;">';
    h += '<span style="font-size:13px;color:#111111;font-weight:700;">-60</span>';
    h += '<input id="htTempSlider" type="range" min="-60" max="160" value="40" step="1" oninput="_htSliderJump(this.value)" style="flex:1;accent-color:#111111;height:6px;" />';
    h += '<span style="font-size:13px;color:#111111;font-weight:700;">160</span>';
    h += '<span id="htSliderVal" style="font-size:14px;color:#111111;font-weight:800;min-width:40px;text-align:center;">40\u00B0</span>';
    h += '</div>';
    h += '</div>';
    // Table
    h += '<div id="htTableWrap" style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 0 80px;"></div>';
    h += '</div>';
    s.innerHTML = h;
    _htRenderTable();
    _htUpdateMeta();
  }

  function _htRefSelect(id, fn, val) {
    var order = window.PT_ORDER || [];
    var h = '<select id="' + id + '" onchange="' + fn + '(this.value)" style="flex:1;min-width:0;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.2);border-radius:8px;padding:7px 10px;font-size:14px;font-weight:800;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;">';
    if (fn === '_htChangeRef2') h += '<option value="">-- vs --</option>';
    for (var i = 0; i < order.length; i++) {
      var r = order[i], m = window.PT_META ? window.PT_META[r] : null;
      h += '<option value="' + r + '"' + (r === val ? ' selected' : '') + '>' + (m ? m.name : r) + '</option>';
    }
    return h + '</select>';
  }

  // Render table (single or compare)
  function _htRenderTable() {
    var w = document.getElementById('htTableWrap');
    if (!w) return;
    var d1 = window.PT_DATA ? window.PT_DATA[_htRef] : null;
    if (!d1 || !d1.length) { w.innerHTML = '<div style="text-align:center;padding:40px;color:#111111;font-weight:600;">' + (typeof _t === 'function' ? _t('ht_no_data') : 'No hay datos') + '</div>'; return; }

    var d2 = _htCompare && _htRef2 ? (window.PT_DATA[_htRef2] || null) : null;
    var d2Map = {};
    if (d2) for (var j = 0; j < d2.length; j++) d2Map[d2[j].temp_f] = d2[j];

    var isZeo1 = _htIsZeo(d1);
    var isZeo2 = d2 ? _htIsZeo(d2) : false;

    var h = '<table style="width:100%;border-collapse:collapse;font-size:14px;">';
    h += '<thead><tr style="position:sticky;top:0;z-index:5;background:#ffffff;">';
    var thS = 'padding:8px 6px;text-align:right;color:#111111;font-size:13px;font-weight:800;border-bottom:2px solid rgba(0,0,0,0.2);white-space:nowrap;';
    h += '<th style="' + thS + 'text-align:left;">T\u00B0</th>';
    h += '<th style="' + thS + '">' + _htRef + (isZeo1 ? ' Bub' : '') + '</th>';
    if (isZeo1) h += '<th style="' + thS + '">' + _htRef + ' Dew</th>';
    if (d2) {
      h += '<th style="' + thS + '">' + _htRef2 + (isZeo2 ? ' Bub' : '') + '</th>';
      if (isZeo2) h += '<th style="' + thS + '">' + _htRef2 + ' Dew</th>';
    }
    h += '</tr></thead><tbody>';

    for (var i = 0; i < d1.length; i++) {
      var r = d1[i];
      var td = _htUnitF ? r.temp_f : _htF2C(r.temp_f);
      var hl = _htHighlightedTemp === r.temp_f ? 'background:rgba(59,130,246,0.20);' : '';
      var bg = i % 2 === 0 ? 'rgba(0,0,0,0.04)' : '';
      var tdS = 'padding:8px 6px;text-align:right;font-variant-numeric:tabular-nums;font-weight:700;';
      var zoneDot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + _htZoneColor(r.temp_f) + ';margin-right:6px;vertical-align:middle;"></span>';

      h += '<tr id="htRow_' + r.temp_f + '" style="border-bottom:1px solid rgba(0,0,0,0.08);' + hl + (bg ? 'background:' + bg + ';' : '') + '" onclick="_htHighlightRow(this)">';
      h += '<td style="padding:8px 6px;font-weight:800;color:#111111;font-size:14px;">' + zoneDot + td + '\u00B0</td>';
      h += '<td style="' + tdS + 'color:#111111;">' + _htFP(r.psig_liquid) + '</td>';
      if (isZeo1) h += '<td style="' + tdS + 'color:#111111;">' + _htFP(r.psig_vapor) + '</td>';
      if (d2) {
        var r2 = d2Map[r.temp_f];
        h += '<td style="' + tdS + 'color:#111111;">' + (r2 ? _htFP(r2.psig_liquid) : '\u2014') + '</td>';
        if (isZeo2) h += '<td style="' + tdS + 'color:#111111;">' + (r2 ? _htFP(r2.psig_vapor) : '\u2014') + '</td>';
      }
      h += '</tr>';
    }
    h += '</tbody></table>';

    // Legend
    h += '<div style="padding:10px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">';
    var _tl = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var legs = [['#60a5fa',_tl('ht_cold','Fr\u00EDo')],['#34d399',_tl('ht_normal','Normal')],['#f97316',_tl('ht_high','Alta')],['#ef4444',_tl('ht_very_high','Muy Alta')]];
    for (var l = 0; l < legs.length; l++) h += '<div style="display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;"><span style="width:10px;height:10px;border-radius:50%;background:' + legs[l][0] + ';"></span><span style="color:#111111;">' + legs[l][1] + '</span></div>';
    h += '</div>';

    // Info card
    var meta = window.PT_META ? window.PT_META[_htRef] : null;
    if (meta) {
      h += '<div style="margin:0 12px 16px;padding:12px;background:rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.1);border-radius:10px;font-size:13px;line-height:1.5;">';
      h += '<span style="font-weight:800;color:#111111;">' + meta.name + '</span> ';
      h += '<span style="background:rgba(59,130,246,0.18);color:#111111;padding:2px 7px;border-radius:4px;font-weight:700;font-size:12px;">' + meta.type + '</span> ';
      h += '<span style="color:#111111;font-weight:500;">' + meta.apps + '</span></div>';
    }
    w.innerHTML = h;
  }

  function _htIsZeo(data) {
    for (var k = 0; k < Math.min(data.length, 5); k++) if (data[k].psig_liquid !== data[k].psig_vapor) return true;
    return false;
  }

  function _htUpdateMeta() {
    var el = document.getElementById('htRefMeta');
    if (!el) return;
    var m = window.PT_META ? window.PT_META[_htRef] : null;
    el.textContent = m ? m.type + ' \u00B7 ' + m.status + ' \u00B7 ' + m.apps : _htRef;
  }

  function _htZoneColor(tf) {
    if (tf <= 0) return '#60a5fa';
    if (tf <= 60) return '#34d399';
    if (tf <= 120) return '#f97316';
    return '#ef4444';
  }

  function _htFP(p) {
    if (p === null || p === undefined) return '\u2014';
    if (p < 0) return '<span style="color:#b91c1c;font-weight:800;">' + p.toFixed(1) + '</span>';
    return p.toFixed(1);
  }

  function _htF2C(f) { return Math.round((f - 32) * 5 / 9 * 10) / 10; }

  // Controls
  window._htToggleUnits = function() {
    _htUnitF = !_htUnitF;
    var b = document.getElementById('htUnitBtn');
    if (b) b.textContent = _htUnitF ? '\u00B0F' : '\u00B0C';
    var ts = document.getElementById('htTempSearch');
    if (ts) { ts.placeholder = 'Temp \u00B0' + (_htUnitF ? 'F' : 'C'); ts.value = ''; }
    _htRenderTable();
  };

  window._htChangeRef = function(r) { _htRef = r; _htRenderTable(); _htUpdateMeta(); };
  window._htChangeRef2 = function(r) { _htRef2 = r; _htRenderTable(); };

  window._htToggleCompare = function() {
    _htCompare = !_htCompare;
    var w = document.getElementById('htRef2Wrap');
    var b = document.getElementById('htCmpBtn');
    if (w) w.style.display = _htCompare ? '' : 'none';
    if (b) { b.style.background = _htCompare ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.15)'; b.textContent = _htCompare ? (typeof _t === 'function' ? _t('ht_close_compare') : 'x Cerrar') : (typeof _t === 'function' ? _t('ht_compare') : 'Comparar'); }
    if (!_htCompare) _htRef2 = '';
    _htRenderTable();
  };

  // Search by temp
  window._htSearchTemp = function(val) {
    _htHighlightedTemp = null;
    if (!val && val !== 0) { _htRenderTable(); return; }
    var target = parseFloat(val);
    if (isNaN(target)) return;
    if (!_htUnitF) target = target * 9 / 5 + 32;
    _htJumpToTemp(target);
  };

  // Reverse lookup — search by psig
  window._htSearchPsig = function(val) {
    _htHighlightedTemp = null;
    if (!val && val !== 0) { _htRenderTable(); return; }
    var psig = parseFloat(val);
    if (isNaN(psig)) return;
    var result = window.PT_REVERSE ? window.PT_REVERSE(_htRef, psig) : null;
    if (result) _htJumpToTemp(result.temp_f);
  };

  // Slider jump
  window._htSliderJump = function(val) {
    var t = parseInt(val, 10);
    var lbl = document.getElementById('htSliderVal');
    if (lbl) lbl.textContent = (_htUnitF ? t : _htF2C(t)) + '\u00B0';
    _htJumpToTemp(t);
  };

  function _htJumpToTemp(targetF) {
    var data = window.PT_DATA ? window.PT_DATA[_htRef] : null;
    if (!data) return;
    var closest = null, minD = Infinity;
    for (var i = 0; i < data.length; i++) {
      var d = Math.abs(data[i].temp_f - targetF);
      if (d < minD) { minD = d; closest = data[i].temp_f; }
    }
    if (closest !== null) {
      _htHighlightedTemp = closest;
      _htRenderTable();
      setTimeout(function() {
        var row = document.getElementById('htRow_' + closest);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 30);
    }
  }

  window._htHighlightRow = function(tr) {
    var prev = tr.parentElement.querySelector('.ht-act');
    if (prev) { prev.classList.remove('ht-act'); prev.style.background = ''; }
    tr.classList.add('ht-act');
    tr.style.background = 'rgba(59,130,246,0.15)';
  };

  window._htBackToMenu = function() {
    window._htActiveTool = null;
    showScreen('dashboardScreen');
  };

  // ============================
  // REFRIGERANT GUIDE
  // ============================
  function _htShowRefGuide(s) {
    _htView = 'refguide';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var order = window.PT_ORDER || [];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">' + _th('ht_rg_title_full', 'Gu\u00EDa de Refrigerantes') + '</div></div>';
    // Search
    h += '<input id="htRefSearch" type="text" placeholder="' + _th('ht_search_ref', 'Buscar refrigerante...') + '" oninput="_htFilterRefGuide(this.value)" style="width:100%;box-sizing:border-box;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px 12px;font-size:12px;outline:none;" />';
    h += '</div>';
    // Cards
    h += '<div id="htRefCards" style="padding:8px;">';
    for (var i = 0; i < order.length; i++) h += _htRefCard(order[i]);
    h += '</div>';
    // Educational note
    h += '<div style="margin:8px;padding:12px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:10px;font-size:10px;color:#4b5563;line-height:1.7;">';
    h += '<div style="font-weight:800;color:#60a5fa;font-size:11px;margin-bottom:6px;">' + _th('ht_rg_boiling_why', 'Por qu\u00E9 importa el Boiling Point?') + '</div>';
    h += _th('ht_rg_boiling_explain', 'El punto de ebullici\u00F3n determina a qu\u00E9 temperatura el refrigerante absorbe calor en el evaporador. Un BP m\u00E1s bajo = puede enfriar a temperaturas m\u00E1s bajas.') + ' ' + _th('ht_rg_boiling_example', 'Por ejemplo:') + '<br>';
    h += '\u2022 <b style="color:#111827;">R-404A</b> (BP -46\u00B0F) \u2192 ' + _th('ht_rg_r404a_use', 'ideal para congeladores y walk-in coolers') + '<br>';
    h += '\u2022 <b style="color:#111827;">R-134a</b> (BP -15\u00B0F) \u2192 ' + _th('ht_rg_r134a_use', 'refrigeraci\u00F3n media temperatura') + '<br>';
    h += '\u2022 <b style="color:#111827;">R-600a</b> (BP +11\u00B0F) \u2192 ' + _th('ht_rg_r600a_use', 'solo refrigeradores dom\u00E9sticos') + '<br><br>';
    h += '<div style="font-weight:800;color:#60a5fa;font-size:11px;margin-bottom:4px;">' + _th('ht_rg_ashrae_explain_title', 'Clasificaci\u00F3n ASHRAE 34') + '</div>';
    h += '<b style="color:#34d399;">A1</b> = ' + _th('ht_rg_a1_safe', 'No flamable, baja toxicidad (m\u00E1s seguro)') + '<br>';
    h += '<b style="color:#fbbf24;">A2L</b> = ' + _th('ht_rg_a2l_safe', 'Ligeramente flamable (&lt;10 cm/s), baja toxicidad') + '<br>';
    h += '<b style="color:#ef4444;">A3</b> = ' + _th('ht_rg_a3_safe', 'Altamente flamable (propano, isobutano)') + '<br>';
    h += '<b style="color:#c084fc;">B2L</b> = ' + _th('ht_rg_b2l_safe', 'Ligeramente flamable, ALTA toxicidad (amoniaco)');
    h += '</div>';
    h += '</div>';
    s.innerHTML = h;
  }

  function _htRefCard(ref) {
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var m = window.PT_META ? window.PT_META[ref] : null;
    if (!m) return '';
    var sc = m.safety_class || '?';
    var scColor = sc === 'A1' ? '#34d399' : sc === 'A2L' ? '#fbbf24' : sc === 'A3' ? '#ef4444' : sc === 'B2L' ? '#c084fc' : '#94a3b8';
    var scBg = sc === 'A1' ? 'rgba(52,211,153,0.12)' : sc === 'A2L' ? 'rgba(251,191,36,0.12)' : sc === 'A3' ? 'rgba(239,68,68,0.12)' : 'rgba(192,132,252,0.12)';
    var flamIcon = m.flammability === '3' ? '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25' : m.flammability === '2L' ? '\uD83D\uDD25' : '\u2714\uFE0F';
    var gwpColor = m.gwp <= 10 ? '#34d399' : m.gwp <= 700 ? '#22c55e' : m.gwp <= 2000 ? '#fbbf24' : '#ef4444';

    var h = '<div class="ht-ref-card" data-ref="' + ref + '" onclick="_htShowRefDetail(\'' + ref + '\')" style="margin-bottom:6px;padding:10px 12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;cursor:pointer;border-left:3px solid ' + (m.color || '#3b82f6') + ';">';
    // Row 1: Name + badges
    h += '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">';
    h += '<span style="font-size:13px;font-weight:800;color:#0F0F0F;">' + ref + '</span>';
    h += '<span style="font-size:8px;font-weight:700;color:' + scColor + ';background:' + scBg + ';padding:1px 5px;border-radius:3px;">' + sc + '</span>';
    h += '<span style="font-size:8px;font-weight:600;color:#4b5563;background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:3px;">' + (m.type || '') + '</span>';
    if (m.status && m.status.indexOf('Prohibido') >= 0) h += '<span style="font-size:7px;font-weight:700;color:#ef4444;background:rgba(239,68,68,0.12);padding:1px 4px;border-radius:3px;">' + _th('ht_rg_banned', 'PROHIBIDO') + '</span>';
    if (m.status && m.status.indexOf('Phase') >= 0) h += '<span style="font-size:7px;font-weight:700;color:#f59e0b;background:rgba(245,158,11,0.12);padding:1px 4px;border-radius:3px;">' + m.status.toUpperCase() + '</span>';
    if (m.status && m.status.indexOf('Nuevo') >= 0) h += '<span style="font-size:7px;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.12);padding:1px 4px;border-radius:3px;">' + _th('ht_rg_new', 'NUEVO') + '</span>';
    h += '</div>';
    // Row 2: Key stats
    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:9px;color:#4b5563;">';
    h += '<span>BP: <b style="color:#60a5fa;">' + m.boiling_f + '\u00B0F</b></span>';
    h += '<span>GWP: <b style="color:' + gwpColor + ';">' + m.gwp + '</b></span>';
    h += '<span>' + flamIcon + ' ' + (m.flammability === '1' ? _th('ht_rg_no_flam', 'No flam') : m.flammability === '2L' ? 'A2L' : 'A3') + '</span>';
    h += '<span>' + _th('ht_rg_oil_label', 'Aceite') + ': <b style="color:#111827;">' + (m.oil ? m.oil.join('/') : '?') + '</b></span>';
    if (m.latent_heat_btu_lb) h += '<span>' + _th('ht_rg_enthalpy', 'Entalp\u00EDa') + ': <b style="color:#c084fc;">' + m.latent_heat_btu_lb + '</b> BTU/lb</span>';
    h += '</div>';
    // Row 3: Apps
    h += '<div style="font-size:8px;color:#4b5563;margin-top:4px;">' + (m.apps || '') + '</div>';
    h += '</div>';
    return h;
  }

  window._htFilterRefGuide = function(q) {
    var cards = document.querySelectorAll('.ht-ref-card');
    q = (q || '').toLowerCase();
    for (var i = 0; i < cards.length; i++) {
      var ref = cards[i].getAttribute('data-ref');
      var m = window.PT_META ? window.PT_META[ref] : null;
      var text = (ref + ' ' + (m ? m.name + ' ' + m.chemical + ' ' + m.apps + ' ' + m.type + ' ' + m.safety_class + ' ' + (m.oil||[]).join(' ') : '')).toLowerCase();
      cards[i].style.display = !q || text.indexOf(q) >= 0 ? '' : 'none';
    }
  };

  window._htShowRefDetail = function(ref) {
    var s = document.getElementById('herramientasScreen');
    if (!s) return;
    var m = window.PT_META ? window.PT_META[ref] : null;
    if (!m) return;
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    _htView = 'refdetail';
    var sc = m.safety_class || '?';
    var scColor = sc === 'A1' ? '#34d399' : sc === 'A2L' ? '#fbbf24' : sc === 'A3' ? '#ef4444' : '#c084fc';
    var gwpColor = m.gwp <= 10 ? '#34d399' : m.gwp <= 700 ? '#22c55e' : m.gwp <= 2000 ? '#fbbf24' : '#ef4444';
    var gwpBar = Math.min(100, Math.round(m.gwp / 50));

    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htShowTool(\'refguide\')" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;"><div style="font-size:18px;font-weight:900;color:#111827;">' + ref + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;">' + (m.name || ref) + '</div></div>';
    h += '<span style="font-size:12px;font-weight:800;color:' + scColor + ';background:rgba(0,0,0,0.06);padding:4px 10px;border-radius:6px;border:1px solid ' + scColor + '30;">' + sc + '</span>';
    h += '</div></div>';

    h += '<div style="padding:8px 12px;">';
    // === IDENTITY CARD ===
    h += '<div style="padding:12px;background:linear-gradient(135deg,rgba(0,0,0,0.03),rgba(0,0,0,0.01));border:1px solid rgba(0,0,0,0.05);border-radius:12px;margin-bottom:8px;border-left:3px solid ' + (m.color || '#3b82f6') + ';">';
    h += '<div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">' + _th('ht_rg_identity', 'Identidad') + '</div>';
    h += _htPropRow(_th('ht_rg_chemical_name', 'Nombre qu\u00EDmico'), m.chemical || '\u2014');
    h += _htPropRow(_th('ht_rg_formula', 'F\u00F3rmula'), m.formula || '\u2014');
    if (m.composition) h += _htPropRow(_th('ht_rg_composition', 'Composici\u00F3n'), m.composition);
    h += _htPropRow(_th('ht_rg_type', 'Tipo'), m.type + (m.blend_type ? ' (' + m.blend_type + ')' : ''));
    h += _htPropRow(_th('ht_rg_mol_weight', 'Peso molecular'), m.mol_weight ? m.mol_weight + ' g/mol' : '\u2014');
    if (m.replaces && m.replaces !== '\u2014') h += _htPropRow(_th('ht_rg_replaces', 'Reemplaza a'), '<span style="color:#f59e0b;">' + m.replaces + '</span>');
    if (m.replaced_by && m.replaced_by !== '\u2014') h += _htPropRow(_th('ht_rg_replaced_by', 'Reemplazado por'), '<span style="color:#22c55e;">' + m.replaced_by + '</span>');
    h += '</div>';

    // === THERMAL PROPERTIES ===
    h += '<div style="padding:12px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:12px;margin-bottom:8px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">' + _th('ht_rg_thermal', 'Propiedades T\u00E9rmicas') + '</div>';
    h += _htPropRow(_th('ht_rg_boiling_point', 'Punto de ebullici\u00F3n'), '<span style="font-size:16px;font-weight:900;color:#60a5fa;">' + m.boiling_f + '\u00B0F</span> <span style="color:#4b5563;">(' + Math.round((m.boiling_f - 32) * 5 / 9 * 10) / 10 + '\u00B0C)</span>');
    if (m.latent_heat_btu_lb) h += _htPropRow(_th('ht_rg_latent_heat', 'Calor latente'), '<span style="font-size:14px;font-weight:800;color:#c084fc;">' + m.latent_heat_btu_lb + ' BTU/lb</span>');
    if (m.density_lb_ft3) h += _htPropRow(_th('ht_rg_liquid_density', 'Densidad l\u00EDquido'), m.density_lb_ft3 + ' lb/ft\u00B3');
    if (m.critical_temp_f) h += _htPropRow(_th('ht_rg_critical_point', 'Punto cr\u00EDtico'), m.critical_temp_f + '\u00B0F / ' + m.critical_psi + ' psig');
    if (m.glide_f > 0) h += _htPropRow(_th('ht_rg_temp_glide', 'Temperature glide'), '<span style="color:#fbbf24;">' + m.glide_f + '\u00B0F</span>');
    h += '</div>';

    // === SAFETY & ENVIRONMENTAL ===
    h += '<div style="padding:12px;background:' + (sc === 'A3' || sc === 'B2L' ? 'rgba(239,68,68,0.08)' : sc === 'A2L' ? 'rgba(251,191,36,0.06)' : 'rgba(52,211,153,0.06)') + ';border:1px solid ' + scColor + '25;border-radius:12px;margin-bottom:8px;">';
    h += '<div style="font-size:10px;font-weight:700;color:' + scColor + ';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">' + _th('ht_rg_safety', 'Seguridad y Medio Ambiente') + '</div>';
    h += _htPropRow(_th('ht_rg_ashrae_class', 'Clasificaci\u00F3n ASHRAE 34'), '<span style="font-size:16px;font-weight:900;color:' + scColor + ';">' + sc + '</span>');
    h += _htPropRow(_th('ht_rg_flammability', 'Flamabilidad'), m.flammability === '1' ? '<span style="color:#34d399;">' + _th('ht_rg_flam_class1', 'Clase 1 \u2014 No flamable') + '</span>' : m.flammability === '2L' ? '<span style="color:#fbbf24;">' + _th('ht_rg_flam_class2l', 'Clase 2L \u2014 Ligeramente flamable (&lt;10 cm/s)') + '</span>' : m.flammability === '3' ? '<span style="color:#ef4444;">' + _th('ht_rg_flam_class3', 'Clase 3 \u2014 Altamente flamable') + '</span>' : m.flammability);
    h += _htPropRow(_th('ht_rg_toxicity', 'Toxicidad'), m.toxicity === 'A' ? '<span style="color:#34d399;">' + _th('ht_rg_tox_a', 'Clase A \u2014 Baja toxicidad') + '</span>' : '<span style="color:#ef4444;">' + _th('ht_rg_tox_b', 'Clase B \u2014 Mayor toxicidad') + '</span>');
    // GWP bar
    h += '<div style="margin-top:6px;"><div style="display:flex;justify-content:space-between;font-size:9px;margin-bottom:3px;"><span style="color:#4b5563;">' + _th('ht_rg_gwp', 'GWP (Potencial Calentamiento Global)') + '</span><span style="font-weight:800;color:' + gwpColor + ';">' + m.gwp + '</span></div>';
    h += '<div style="height:6px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + gwpBar + '%;background:' + gwpColor + ';border-radius:3px;"></div></div></div>';
    if (m.odp > 0) h += _htPropRow(_th('ht_rg_odp', 'ODP (Da\u00F1o Ozono)'), '<span style="color:#ef4444;font-weight:800;">' + m.odp + '</span>');
    else h += _htPropRow('ODP', '<span style="color:#34d399;">' + _th('ht_rg_odp_zero', '0 (no da\u00F1a ozono)') + '</span>');
    if (m.rcl_ppm) h += _htPropRow(_th('ht_rg_rcl', 'RCL (L\u00EDmite concentraci\u00F3n)'), m.rcl_ppm.toLocaleString() + ' PPM');
    if (m.burn_velocity) h += _htPropRow(_th('ht_rg_burn_velocity', 'Velocidad de quema'), m.burn_velocity);
    if (m.ignition_temp_f) h += _htPropRow(_th('ht_rg_ignition_temp', 'Temp ignici\u00F3n'), m.ignition_temp_f + '\u00B0F');
    if (m.charge_limit) h += _htPropRow(_th('ht_rg_charge_limit', 'L\u00EDmite de carga'), '<span style="color:#fbbf24;">' + m.charge_limit + '</span>');
    h += '</div>';

    // === OIL & SERVICE ===
    h += '<div style="padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:12px;margin-bottom:8px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">' + _th('ht_rg_oil_service', 'Aceite y Servicio') + '</div>';
    h += _htPropRow(_th('ht_rg_compatible_oil', 'Aceite compatible'), '<span style="font-size:13px;font-weight:800;color:#111827;">' + (m.oil ? m.oil.join(' / ') : '?') + '</span>');
    // Oil type descriptions
    if (m.oil) {
      var oilDesc = { MO: 'Mineral Oil \u2014 natural, para CFC/HCFC', AB: 'Alkylbenzene \u2014 sint\u00E9tico, para CFC/HCFC', POE: 'Polyol Ester \u2014 sint\u00E9tico, para HFC/HFO (muy higrosc\u00F3pico)', PAG: 'Polyalkylene Glycol \u2014 automotriz solamente', PVE: 'Polyvinyl Ether \u2014 alternativa a POE para HFC' };
      for (var oi = 0; oi < m.oil.length; oi++) {
        var od = oilDesc[m.oil[oi]];
        if (od) h += '<div style="font-size:8px;color:#4b5563;margin-top:2px;padding-left:8px;">\u2022 ' + od + '</div>';
      }
    }
    h += _htPropRow(_th('ht_rg_applications', 'Aplicaciones'), m.apps || '\u2014');
    if (m.note) h += '<div style="margin-top:6px;padding:6px 8px;background:rgba(59,130,246,0.08);border-radius:6px;font-size:9px;color:#60a5fa;">\u24D8 ' + m.note + '</div>';
    h += '</div>';

    // === QUICK ACTION: Go to PT Chart ===
    h += '<button onclick="_htRef=\'' + ref + '\';_htShowTool(\'ptchart\')" style="width:100%;padding:12px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;margin-bottom:8px;">' + _th('ht_rg_view_pt', 'Ver PT Chart de') + ' ' + ref + ' \u2192</button>';

    h += '</div></div>';
    s.innerHTML = h;
  };

  function _htPropRow(label, value) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.02);font-size:10px;"><span style="color:#4b5563;min-width:100px;">' + label + '</span><span style="text-align:right;color:#111827;">' + value + '</span></div>';
  }

  // ============================
  // PRESSURE-ENTHALPY DIAGRAM
  // ============================
  function _htShowPH(s) {
    _htView = 'phdiagram';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var order = window.PT_ORDER || [];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">' + _th('ht_ph_title_full', 'Diagrama Presi\u00F3n-Entalp\u00EDa') + '</div></div>';
    // Ref selector
    h += '<select id="htPHRef" onchange="_htDrawPH(this.value)" style="width:100%;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px;font-size:12px;font-weight:600;outline:none;">';
    for (var i = 0; i < order.length; i++) {
      var r = order[i], m = window.PT_META ? window.PT_META[r] : null;
      h += '<option value="' + r + '"' + (r === _htRef ? ' selected' : '') + '>' + (m ? m.name : r) + '</option>';
    }
    h += '</select></div>';

    // Canvas
    h += '<div style="padding:8px;"><canvas id="htPHCanvas" width="360" height="300" style="width:100%;background:#0c1524;border:1px solid rgba(0,0,0,0.05);border-radius:10px;"></canvas></div>';

    // Info about current cycle
    h += '<div id="htPHInfo" style="padding:0 12px;"></div>';

    // Educational sections
    h += '<div style="padding:8px 12px;">';
    // Section 1: What is P-h
    h += '<div style="padding:12px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#60a5fa;margin-bottom:6px;">' + _th('ht_ph_what_is', 'Qu\u00E9 es el Diagrama P-h?') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;line-height:1.7;">';
    h += _th('ht_ph_intro', 'El diagrama Presi\u00F3n-Entalp\u00EDa muestra la relaci\u00F3n entre la <b style="color:#111827;">presi\u00F3n</b> (eje Y, psia) y el <b style="color:#111827;">contenido de calor</b> (eje X, BTU/lb) de un refrigerante. La curva en forma de herradura es la <b style="color:#60a5fa;">curva de saturaci\u00F3n</b> \u2014 dentro de ella el refrigerante est\u00E1 cambiando de fase (l\u00EDquido + vapor).');
    h += '</div></div>';

    // Section 2: Regions
    h += '<div style="padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#111827;margin-bottom:6px;">' + _th('ht_ph_regions', 'Regiones del Diagrama') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;line-height:1.8;">';
    h += '<span style="display:inline-block;width:10px;height:10px;background:#3b82f6;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>';
    h += _th('ht_ph_subcooled', '<b style="color:#3b82f6;">L\u00EDquido Subenfriado</b> \u2014 izquierda de la curva (100% l\u00EDquido, below sat temp)') + '<br>';
    h += '<span style="display:inline-block;width:10px;height:10px;background:#a855f7;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>';
    h += _th('ht_ph_mixture', '<b style="color:#a855f7;">Mezcla L\u00EDquido-Vapor</b> \u2014 dentro de la herradura (cambio de fase)') + '<br>';
    h += '<span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>';
    h += _th('ht_ph_superheated', '<b style="color:#ef4444;">Vapor Sobrecalentado</b> \u2014 derecha de la curva (100% vapor, above sat temp)') + '<br>';
    h += '<span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>';
    h += _th('ht_ph_critical', '<b style="color:#f59e0b;">Punto Cr\u00EDtico</b> \u2014 cima de la herradura (donde l\u00EDquido y vapor son indistinguibles)');
    h += '</div></div>';

    // Section 3: Cycle points
    h += '<div style="padding:12px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#f87171;margin-bottom:6px;">' + _th('ht_ph_cycle_title', 'Ciclo de Refrigeraci\u00F3n (4 Puntos)') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;line-height:1.8;">';
    h += _th('ht_ph_expansion', '<b style="color:#60a5fa;">A \u2192 B: V\u00E1lvula de Expansi\u00F3n</b> \u2014 ca\u00EDda de presi\u00F3n, flash gas (isoent\u00E1lpico, vertical)') + '<br>';
    h += _th('ht_ph_evaporator', '<b style="color:#34d399;">B \u2192 C: Evaporador</b> \u2014 absorbe calor, l\u00EDquido se evapora (isobara, horizontal)') + '<br>';
    h += _th('ht_ph_compressor', '<b style="color:#f87171;">C \u2192 D: Compresor</b> \u2014 aumenta presi\u00F3n y temperatura (l\u00EDnea diagonal)') + '<br>';
    h += _th('ht_ph_condenser', '<b style="color:#fbbf24;">D \u2192 A: Condensador</b> \u2014 rechaza calor, vapor se condensa (isobara, horizontal)');
    h += '</div></div>';

    // Section 4: Key concepts
    h += '<div style="padding:12px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.12);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#34d399;margin-bottom:6px;">' + _th('ht_ph_key_concepts', 'Conceptos Clave') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;line-height:1.8;">';
    h += _th('ht_ph_nre', '<b style="color:#111827;">NRE</b> (Net Refrigeration Effect) = entalp\u00EDa que absorbe el evaporador (B\u2192C)') + '<br>';
    h += _th('ht_ph_hoc', '<b style="color:#111827;">HOC</b> (Heat of Compression) = trabajo del compresor (C\u2192D)') + '<br>';
    h += _th('ht_ph_thor', '<b style="color:#111827;">THOR</b> (Total Heat of Rejection) = calor total rechazado (condensador) = NRE + HOC') + '<br>';
    h += _th('ht_ph_superheat', '<b style="color:#111827;">Superheat</b> = calor adicional despu\u00E9s de la l\u00EDnea de vapor saturado') + '<br>';
    h += _th('ht_ph_subcooling_def', '<b style="color:#111827;">Subcooling</b> = enfriamiento adicional despu\u00E9s de la l\u00EDnea de l\u00EDquido saturado') + '<br>';
    h += _th('ht_ph_quality', '<b style="color:#111827;">Quality Lines</b> = l\u00EDneas de % vapor constante (0.1, 0.2 ... 0.9) dentro de la herradura');
    h += '</div></div>';

    // Section 5: Zeotropic blends
    h += '<div style="padding:12px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.12);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:6px;">' + _th('ht_ph_zeotropic', 'Mezclas Zeotr\u00F3picas (Temperature Glide)') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;line-height:1.7;">';
    h += _th('ht_ph_zeotropic_text', 'En mezclas como <b style="color:#111827;">R-407C</b> (glide 9\u00B0F) y <b style="color:#111827;">R-448A</b> (glide 11\u00B0F), las isotermas NO son horizontales dentro de la herradura \u2014 est\u00E1n <b style="color:#fbbf24;">inclinadas hacia abajo</b>. Esto significa que el refrigerante tiene m\u00FAltiples temperaturas de saturaci\u00F3n a la misma presi\u00F3n. Por eso se miden <b style="color:#111827;">Bubble Point</b> (primera burbuja) y <b style="color:#111827;">Dew Point</b> (primera gota) por separado.');
    h += '</div></div>';

    // Reference note
    h += '<div style="padding:8px 12px;font-size:8px;color:#4b5563;text-align:center;line-height:1.5;">';
    h += _th('ht_ph_ref_note', 'Datos basados en ASHRAE Standard 34, NIST WebBook, y ESCO Institute EPA 608 Manual.<br>Diagramas esquem\u00E1ticos para referencia educativa.');
    h += '</div>';
    h += '</div></div>';
    s.innerHTML = h;
    _htDrawPH(_htRef);
  }

  /** Draw P-h diagram on canvas for a given refrigerant */
  window._htDrawPH = function(ref) {
    var c = document.getElementById('htPHCanvas');
    if (!c) return;
    var meta = window.PT_META ? window.PT_META[ref] : null;
    var data = window.PT_DATA ? window.PT_DATA[ref] : null;
    if (!meta || !data) return;

    // Responsive canvas sizing
    var dpr = window.devicePixelRatio || 1;
    var rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    var W = rect.width, H = rect.height;

    // Clear
    ctx.fillStyle = '#0c1524';
    ctx.fillRect(0, 0, W, H);

    var pad = { l: 48, r: 14, t: 30, b: 30 };
    var gW = W - pad.l - pad.r;
    var gH = H - pad.t - pad.b;

    // Determine pressure range from data
    var minP = Infinity, maxP = 0;
    for (var i = 0; i < data.length; i++) {
      var p = data[i].psig_liquid + 14.7; // convert to psia
      if (p < minP) minP = p;
      if (p > maxP) maxP = p;
    }
    minP = Math.max(2, minP * 0.5);
    maxP = maxP * 1.3;
    var critP = (meta.critical_psi || maxP) + 14.7;
    if (critP > maxP) maxP = critP * 1.15;

    // Enthalpy range (approximate)
    var latent = meta.latent_heat_btu_lb || 80;
    var minH = -20;
    var maxH = latent * 2.2;
    if (maxH < 140) maxH = 140;

    // Log scale for pressure
    var logMinP = Math.log10(minP);
    var logMaxP = Math.log10(maxP);
    function yFromP(psia) {
      var logP = Math.log10(Math.max(1, psia));
      return pad.t + gH - (logP - logMinP) / (logMaxP - logMinP) * gH;
    }
    function xFromH(hh) {
      return pad.l + (hh - minH) / (maxH - minH) * gW;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 0.5;
    var pGrids = [5, 10, 20, 50, 100, 200, 500, 1000, 2000];
    for (var gi = 0; gi < pGrids.length; gi++) {
      if (pGrids[gi] < minP || pGrids[gi] > maxP) continue;
      var gy = yFromP(pGrids[gi]);
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.font = '8px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(pGrids[gi].toFixed(0), pad.l - 4, gy + 3);
    }
    var hGrids = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 250, 300, 400, 500];
    for (var hi = 0; hi < hGrids.length; hi++) {
      if (hGrids[hi] < minH || hGrids[hi] > maxH) continue;
      var gx = xFromH(hGrids[hi]);
      ctx.beginPath(); ctx.moveTo(gx, pad.t); ctx.lineTo(gx, H - pad.b); ctx.stroke();
      ctx.fillStyle = '#475569'; ctx.font = '8px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(hGrids[hi], gx, H - pad.b + 12);
    }

    // Axis labels
    ctx.save();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui';
    ctx.translate(10, pad.t + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText((typeof _t === 'function' ? _t('ht_ph_pressure', 'Presi\u00F3n (psia)') : 'Presi\u00F3n (psia)'), 0, 0);
    ctx.restore();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText((typeof _t === 'function' ? _t('ht_ph_enthalpy', 'Entalp\u00EDa (BTU/lb)') : 'Entalp\u00EDa (BTU/lb)'), pad.l + gW / 2, H - 2);

    // Draw the saturation curve (horseshoe)
    // Saturated liquid line (left side) — enthalpy increases slowly with pressure
    // Saturated vapor line (right side) — enthalpy ~ liquid + latent heat
    var satLiqPts = [];
    var satVapPts = [];

    // Use PT data to build approximate saturation curve
    // Enthalpy of saturated liquid ~ approximate from boiling point reference
    var bpF = meta.boiling_f;
    var refH0 = 0; // enthalpy at boiling point = 0 reference

    for (var di = 0; di < data.length; di += 3) {
      var row = data[di];
      var psia = row.psig_liquid + 14.7;
      // Approximate saturated liquid enthalpy (increases ~0.3-0.5 BTU/lb per °F above boiling)
      var hLiq = refH0 + (row.temp_f - bpF) * 0.42;
      // Approximate saturated vapor enthalpy = liquid + latent heat (decreases near critical)
      var critFrac = psia / critP;
      var adjLatent = latent * Math.max(0, 1 - critFrac * critFrac);
      var hVap = hLiq + adjLatent;
      satLiqPts.push({ x: xFromH(hLiq), y: yFromP(psia), h: hLiq, p: psia, t: row.temp_f });
      satVapPts.push({ x: xFromH(hVap), y: yFromP(psia), h: hVap, p: psia, t: row.temp_f });
    }

    // Draw subcooled region fill (left of sat liquid line)
    ctx.fillStyle = 'rgba(59,130,246,0.06)';
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    for (var si = 0; si < satLiqPts.length; si++) ctx.lineTo(satLiqPts[si].x, satLiqPts[si].y);
    ctx.lineTo(pad.l, satLiqPts[satLiqPts.length - 1].y);
    ctx.closePath();
    ctx.fill();

    // Draw two-phase region fill (between liquid and vapor lines)
    ctx.fillStyle = 'rgba(168,85,247,0.06)';
    ctx.beginPath();
    for (var si = 0; si < satLiqPts.length; si++) ctx.lineTo(satLiqPts[si].x, satLiqPts[si].y);
    for (var si = satVapPts.length - 1; si >= 0; si--) ctx.lineTo(satVapPts[si].x, satVapPts[si].y);
    ctx.closePath();
    ctx.fill();

    // Draw superheated region fill (right of sat vapor line)
    ctx.fillStyle = 'rgba(239,68,68,0.04)';
    ctx.beginPath();
    for (var si = 0; si < satVapPts.length; si++) ctx.lineTo(satVapPts[si].x, satVapPts[si].y);
    ctx.lineTo(W - pad.r, satVapPts[satVapPts.length - 1].y);
    ctx.lineTo(W - pad.r, pad.t);
    ctx.lineTo(satVapPts[0].x, satVapPts[0].y);
    ctx.closePath();
    ctx.fill();

    // Draw saturated liquid line
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var si = 0; si < satLiqPts.length; si++) {
      if (si === 0) ctx.moveTo(satLiqPts[si].x, satLiqPts[si].y);
      else ctx.lineTo(satLiqPts[si].x, satLiqPts[si].y);
    }
    ctx.stroke();

    // Draw saturated vapor line
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var si = 0; si < satVapPts.length; si++) {
      if (si === 0) ctx.moveTo(satVapPts[si].x, satVapPts[si].y);
      else ctx.lineTo(satVapPts[si].x, satVapPts[si].y);
    }
    ctx.stroke();

    // Connect at critical point (top of horseshoe)
    if (satLiqPts.length > 0 && satVapPts.length > 0) {
      var lastL = satLiqPts[satLiqPts.length - 1];
      var lastV = satVapPts[satVapPts.length - 1];
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lastL.x, lastL.y);
      var midX = (lastL.x + lastV.x) / 2;
      var topY = Math.min(lastL.y, lastV.y) - 8;
      ctx.quadraticCurveTo(midX, topY, lastV.x, lastV.y);
      ctx.stroke();

      // Critical point dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(midX, topY + 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 7px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('CR\u00CDTICO', midX, topY - 2);
    }

    // Draw a sample refrigeration cycle
    // A = condenser outlet (subcooled liquid, high pressure)
    // B = evaporator inlet (after expansion valve, low pressure)
    // C = evaporator outlet (saturated/superheated vapor, low pressure)
    // D = compressor outlet (superheated vapor, high pressure)
    var condIdx = Math.min(Math.floor(satLiqPts.length * 0.75), satLiqPts.length - 2);
    var evapIdx = Math.floor(satLiqPts.length * 0.15);
    if (condIdx < 1) condIdx = 1;
    if (evapIdx < 0) evapIdx = 0;

    var ptA = { x: satLiqPts[condIdx].x - 6, y: satLiqPts[condIdx].y, h: satLiqPts[condIdx].h - 3 };
    var ptB = { x: ptA.x, y: satLiqPts[evapIdx].y }; // expansion = vertical drop (isenthalpic)
    var evapVap = satVapPts[evapIdx];
    var ptC = { x: evapVap.x + 12, y: evapVap.y }; // superheat past vapor line
    var ptD = { x: ptC.x + 10, y: ptA.y - 5 }; // compression up to high pressure

    // Draw cycle lines
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;

    // D -> A: Condensation (high pressure horizontal going left)
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath(); ctx.moveTo(ptD.x, ptD.y); ctx.lineTo(ptA.x, ptA.y); ctx.stroke();

    // A -> B: Expansion (vertical drop)
    ctx.strokeStyle = '#60a5fa';
    ctx.beginPath(); ctx.moveTo(ptA.x, ptA.y); ctx.lineTo(ptB.x, ptB.y); ctx.stroke();

    // B -> C: Evaporation (low pressure horizontal going right)
    ctx.strokeStyle = '#34d399';
    ctx.beginPath(); ctx.moveTo(ptB.x, ptB.y); ctx.lineTo(ptC.x, ptC.y); ctx.stroke();

    // C -> D: Compression (diagonal up-right)
    ctx.strokeStyle = '#f87171';
    ctx.beginPath(); ctx.moveTo(ptC.x, ptC.y); ctx.lineTo(ptD.x, ptD.y); ctx.stroke();

    ctx.setLineDash([]);

    // Cycle point labels
    var cyclePts = [
      { pt: ptA, label: 'A', color: '#60a5fa', desc: 'Condensador Out' },
      { pt: ptB, label: 'B', color: '#34d399', desc: 'Evaporador In' },
      { pt: ptC, label: 'C', color: '#f87171', desc: 'Compresor In' },
      { pt: ptD, label: 'D', color: '#fbbf24', desc: 'Compresor Out' }
    ];
    for (var ci = 0; ci < cyclePts.length; ci++) {
      var cp = cyclePts[ci];
      ctx.fillStyle = cp.color;
      ctx.beginPath(); ctx.arc(cp.pt.x, cp.pt.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0c1524';
      ctx.font = 'bold 7px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(cp.label, cp.pt.x, cp.pt.y + 2.5);
    }

    // Region labels
    ctx.font = '8px system-ui'; ctx.globalAlpha = 0.6;
    if (satLiqPts.length > 5) {
      ctx.fillStyle = '#3b82f6'; ctx.textAlign = 'center';
      ctx.fillText('L\u00CDQUIDO', pad.l + 18, pad.t + gH * 0.4);
      ctx.fillText('SUB\u2019D', pad.l + 18, pad.t + gH * 0.4 + 10);
    }
    ctx.fillStyle = '#a855f7'; ctx.textAlign = 'center';
    var midSatX = (satLiqPts.length > 5 && satVapPts.length > 5) ? (satLiqPts[Math.floor(satLiqPts.length * 0.3)].x + satVapPts[Math.floor(satVapPts.length * 0.3)].x) / 2 : pad.l + gW * 0.4;
    ctx.fillText('MEZCLA', midSatX, pad.t + gH * 0.65);
    ctx.fillText('L+V', midSatX, pad.t + gH * 0.65 + 10);

    ctx.fillStyle = '#ef4444'; ctx.textAlign = 'center';
    ctx.fillText('VAPOR', W - pad.r - 30, pad.t + gH * 0.3);
    ctx.fillText('SUPER\u2019D', W - pad.r - 30, pad.t + gH * 0.3 + 10);
    ctx.globalAlpha = 1.0;

    // Title
    ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(ref + ' \u2014 Diagrama P-h', pad.l + 2, 14);
    ctx.fillStyle = '#64748b'; ctx.font = '7px system-ui';
    ctx.fillText('BP: ' + meta.boiling_f + '\u00B0F | Latent: ' + (meta.latent_heat_btu_lb || '?') + ' BTU/lb | GWP: ' + meta.gwp, pad.l + 2, 24);

    // Update info card below canvas
    var info = document.getElementById('htPHInfo');
    if (info) {
      var ic = '';
      ic += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">';
      var items = [
        ['A\u2192B Expansi\u00F3n', 'Ca\u00EDda de presi\u00F3n (isoent\u00E1lpico)', '#60a5fa'],
        ['B\u2192C Evaporador', 'Absorbe NRE (BTU/lb)', '#34d399'],
        ['C\u2192D Compresor', 'Aumenta P y T (HOC)', '#f87171'],
        ['D\u2192A Condensador', 'Rechaza THOR (BTU/lb)', '#fbbf24']
      ];
      for (var ii = 0; ii < items.length; ii++) {
        ic += '<div style="padding:8px;background:rgba(0,0,0,0.02);border-radius:8px;border-left:3px solid ' + items[ii][2] + ';">';
        ic += '<div style="font-size:10px;font-weight:700;color:' + items[ii][2] + ';">' + items[ii][0] + '</div>';
        ic += '<div style="font-size:8px;color:#4b5563;">' + items[ii][1] + '</div>';
        ic += '</div>';
      }
      ic += '</div>';
      info.innerHTML = ic;
    }
  };

  // ============================
  // SUPERHEAT / SUBCOOLING CALC
  // ============================
  function _htShowSHSC(s) {
    _htView = 'shsc';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var order = window.PT_ORDER || [];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">Superheat / Subcooling</div></div></div>';

    // Refrigerant selector
    h += '<div style="padding:12px;">';
    h += '<label style="font-size:10px;color:#4b5563;font-weight:600;">' + _th('ht_refrigerant', 'REFRIGERANTE') + '</label>';
    h += '<select id="htSHRef" onchange="_htSHCalc()" style="display:block;width:100%;margin-top:4px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:13px;font-weight:600;outline:none;">';
    for (var i = 0; i < order.length; i++) {
      var r = order[i], m = window.PT_META ? window.PT_META[r] : null;
      h += '<option value="' + r + '"' + (r === _htRef ? ' selected' : '') + '>' + (m ? m.name : r) + '</option>';
    }
    h += '</select></div>';

    // SUPERHEAT card
    h += '<div style="margin:0 12px 12px;padding:16px;background:#FFFFFF;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">';
    h += '<div style="font-size:14px;font-weight:800;color:#111827;margin-bottom:10px;">' + _th('ht_sh_superheat', 'SUPERHEAT (Recalentamiento)') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;margin-bottom:10px;">' + _th('ht_sh_suction_pres', 'Presi\u00F3n de succi\u00F3n + Temp l\u00EDnea de succi\u00F3n') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htInput('htSHPres', _th('ht_sh_pres_label', 'Presi\u00F3n succi\u00F3n (psig)'), '_htSHCalc()');
    h += _htInput('htSHTemp', _th('ht_sh_temp_label', 'Temp l\u00EDnea succi\u00F3n (\u00B0F)'), '_htSHCalc()');
    h += '</div>';
    h += '<div id="htSHResult" style="margin-top:12px;padding:12px;background:rgba(0,0,0,0.04);border-radius:8px;text-align:center;font-size:28px;font-weight:900;color:#4b5563;">\u2014</div>';
    h += '<div id="htSHDetail" style="margin-top:6px;text-align:center;font-size:10px;color:#4b5563;"></div>';
    h += '</div>';

    // SUBCOOLING card
    h += '<div style="margin:0 12px 12px;padding:16px;background:#FFFFFF;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">';
    h += '<div style="font-size:14px;font-weight:800;color:#111827;margin-bottom:10px;">' + _th('ht_sc_subcooling', 'SUBCOOLING (Subenfriamiento)') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;margin-bottom:10px;">' + _th('ht_sc_liquid_pres', 'Presi\u00F3n de l\u00EDquido + Temp l\u00EDnea de l\u00EDquido') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htInput('htSCPres', _th('ht_sc_pres_label', 'Presi\u00F3n l\u00EDquido (psig)'), '_htSHCalc()');
    h += _htInput('htSCTemp', _th('ht_sc_temp_label', 'Temp l\u00EDnea l\u00EDquido (\u00B0F)'), '_htSHCalc()');
    h += '</div>';
    h += '<div id="htSCResult" style="margin-top:12px;padding:12px;background:rgba(0,0,0,0.04);border-radius:8px;text-align:center;font-size:28px;font-weight:900;color:#4b5563;">\u2014</div>';
    h += '<div id="htSCDetail" style="margin-top:6px;text-align:center;font-size:10px;color:#4b5563;"></div>';
    h += '</div>';

    // Reference ranges
    h += '<div style="margin:0 12px;padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;font-size:10px;color:#4b5563;line-height:1.8;">';
    h += '<div style="font-weight:700;color:#111827;margin-bottom:4px;">' + _th('ht_normal_ranges', 'Rangos normales:') + '</div>';
    h += 'Superheat (TXV): <span style="color:#34d399;font-weight:700;">8-12\u00B0F</span><br>';
    h += 'Superheat (Pist\u00F3n/Cap tube): <span style="color:#34d399;font-weight:700;">10-20\u00B0F</span><br>';
    h += 'Subcooling (TXV): <span style="color:#60a5fa;font-weight:700;">8-14\u00B0F</span><br>';
    h += 'Subcooling (Pist\u00F3n): <span style="color:#60a5fa;font-weight:700;">5-10\u00B0F</span>';
    h += '</div>';
    // IA Diagnosis button
    h += '<div style="margin:12px 12px 0;">';
    h += '<button id="htSHIABtn" onclick="_htSHIADiagnose()" style="width:100%;padding:14px;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;color:#fff;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;">' + _th('ht_diagnose_ia', 'Diagnosticar con IA') + '</button>';
    h += '<div id="htSHIA" style="margin-top:8px;"></div>';
    h += '<div id="htSHSCPdfBar" style="margin-top:8px;"></div>';
    h += '</div>';
    h += '</div>';
    s.innerHTML = h;
  }

  function _htInput(id, placeholder, oninput) {
    return '<input id="' + id + '" type="number" placeholder="' + placeholder + '" oninput="' + oninput + '" style="background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:13px;outline:none;width:100%;box-sizing:border-box;-moz-appearance:textfield;" />';
  }

  window._htSHCalc = function() {
    var ref = document.getElementById('htSHRef');
    var refName = ref ? ref.value : _htRef;

    // Superheat calc
    var shPres = parseFloat((document.getElementById('htSHPres') || {}).value);
    var shTemp = parseFloat((document.getElementById('htSHTemp') || {}).value);
    var shRes = document.getElementById('htSHResult');
    var shDet = document.getElementById('htSHDetail');
    if (!isNaN(shPres) && !isNaN(shTemp) && window.PT_REVERSE) {
      var sat = window.PT_REVERSE(refName, shPres);
      if (sat) {
        var sh = Math.round((shTemp - sat.temp_f) * 10) / 10;
        if (shRes) {
          shRes.textContent = sh.toFixed(1) + '\u00B0F';
          shRes.style.color = (sh >= 5 && sh <= 25) ? '#34d399' : '#f87171';
        }
        if (shDet) shDet.textContent = 'Sat temp @ ' + shPres.toFixed(0) + ' psig = ' + sat.temp_f + '\u00B0F | ' + _t('ht_mf_line','Línea') + ' = ' + shTemp + '\u00B0F';
      }
    } else if (shRes) { shRes.textContent = '\u2014'; shRes.style.color = '#3D3D3A'; if (shDet) shDet.textContent = ''; }

    // Subcooling calc
    var scPres = parseFloat((document.getElementById('htSCPres') || {}).value);
    var scTemp = parseFloat((document.getElementById('htSCTemp') || {}).value);
    var scRes = document.getElementById('htSCResult');
    var scDet = document.getElementById('htSCDetail');
    if (!isNaN(scPres) && !isNaN(scTemp) && window.PT_REVERSE) {
      var satSC = window.PT_REVERSE(refName, scPres);
      if (satSC) {
        var sc = Math.round((satSC.temp_f - scTemp) * 10) / 10;
        if (scRes) {
          scRes.textContent = sc.toFixed(1) + '\u00B0F';
          scRes.style.color = (sc >= 3 && sc <= 20) ? '#60a5fa' : '#f87171';
        }
        if (scDet) scDet.textContent = 'Sat temp @ ' + scPres.toFixed(0) + ' psig = ' + satSC.temp_f + '\u00B0F | ' + _t('ht_mf_line','Línea') + ' = ' + scTemp + '\u00B0F';
      }
    } else if (scRes) { scRes.textContent = '\u2014'; scRes.style.color = '#3D3D3A'; if (scDet) scDet.textContent = ''; }
    // PDF bar — show when at least one result is calculated
    var pdfBar = document.getElementById('htSHSCPdfBar');
    if (pdfBar) {
      var hasSH = shRes && shRes.textContent !== '\u2014';
      var hasSC = scRes && scRes.textContent !== '\u2014';
      pdfBar.innerHTML = (hasSH || hasSC) && typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('shsc') : '';
    }
  };

  window._htSHIADiagnose = function() {
    var ref = document.getElementById('htSHRef');
    var refName = ref ? ref.value : 'R-410A';
    var shPres = parseFloat((document.getElementById('htSHPres') || {}).value);
    var shTemp = parseFloat((document.getElementById('htSHTemp') || {}).value);
    var scPres = parseFloat((document.getElementById('htSCPres') || {}).value);
    var scTemp = parseFloat((document.getElementById('htSCTemp') || {}).value);
    var sh = null, sc = null, evapSat = null, condSat = null;
    if (!isNaN(shPres) && !isNaN(shTemp) && window.PT_REVERSE) {
      var s1 = window.PT_REVERSE(refName, shPres);
      if (s1) { evapSat = s1.temp_f; sh = shTemp - evapSat; }
    }
    if (!isNaN(scPres) && !isNaN(scTemp) && window.PT_REVERSE) {
      var s2 = window.PT_REVERSE(refName, scPres);
      if (s2) { condSat = s2.temp_f; sc = condSat - scTemp; }
    }
    if (sh === null && sc === null) {
      var r = document.getElementById('htSHIA');
      if (r) r.innerHTML = '<div style="padding:10px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:10px;color:#fbbf24;">' + (typeof _t === 'function' ? _t('ht_enter_values', 'Ingrese al menos un par de valores (presi\u00F3n + temperatura) para diagnosticar.') : 'Ingrese al menos un par de valores (presi\u00F3n + temperatura) para diagnosticar.') + '</div>';
      return;
    }
    var prompt = 'Eres un t\u00E9cnico HVAC master. Analiza estas lecturas con refrigerante ' + refName + ':\n\n';
    if (sh !== null) prompt += 'SUPERHEAT: ' + sh.toFixed(1) + '\u00B0F (Presi\u00F3n succi\u00F3n: ' + shPres + ' psig, Temp l\u00EDnea: ' + shTemp + '\u00B0F, Sat temp: ' + evapSat.toFixed(1) + '\u00B0F)\n';
    if (sc !== null) prompt += 'SUBCOOLING: ' + sc.toFixed(1) + '\u00B0F (Presi\u00F3n l\u00EDquido: ' + scPres + ' psig, Temp l\u00EDnea: ' + scTemp + '\u00B0F, Sat temp: ' + condSat.toFixed(1) + '\u00B0F)\n';
    prompt += '\nResponde EN ESPA\u00D1OL:\n1. \u00BFLos valores son normales o anormales?\n2. Posibles problemas del sistema basado en estos valores\n3. Qu\u00E9 deber\u00EDa verificar el t\u00E9cnico en campo\n4. Pasos correctivos recomendados';
    _htCallIA(prompt, 'htSHIA', 'htSHIABtn');
  };

  // ============================
  // HVAC UNIT CONVERTER
  // ============================
  function _htShowConverter(s) {
    _htView = 'converter';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var cats = [
      { id: 'temp', label: _th('ht_cv_temperature', 'Temperatura'), units: [
        { k: 'f', l: '\u00B0F' }, { k: 'c', l: '\u00B0C' }, { k: 'k', l: 'K' }, { k: 'r', l: '\u00B0R' }
      ]},
      { id: 'pres', label: _th('ht_cv_pressure', 'Presi\u00F3n'), units: [
        { k: 'psig', l: 'psig' }, { k: 'psia', l: 'psia' }, { k: 'kpa', l: 'kPa' }, { k: 'bar', l: 'bar' }, { k: 'inhg', l: 'inHg' }, { k: 'atm', l: 'atm' }
      ]},
      { id: 'energy', label: _th('ht_cv_energy', 'Energ\u00EDa'), units: [
        { k: 'btu', l: 'BTU/hr' }, { k: 'kw', l: 'kW' }, { k: 'ton', l: 'Ton' }, { k: 'hp', l: 'HP' }
      ]},
      { id: 'flow', label: _th('ht_cv_flow', 'Flujo'), units: [
        { k: 'cfm', l: 'CFM' }, { k: 'm3h', l: 'm\u00B3/h' }, { k: 'ls', l: 'L/s' }
      ]},
      { id: 'len', label: _th('ht_cv_length', 'Longitud'), units: [
        { k: 'ft', l: 'ft' }, { k: 'in', l: 'in' }, { k: 'm', l: 'm' }, { k: 'cm', l: 'cm' }
      ]}
    ];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#0F0F0F;">' + _th('ht_cv_title_full', 'Convertidor HVAC') + '</div></div>';
    // Category tabs
    h += '<div style="display:flex;gap:4px;overflow-x:auto;">';
    for (var ci = 0; ci < cats.length; ci++) {
      var sel = ci === 0 ? 'background:rgba(59,130,246,0.2);color:#60a5fa;border-color:rgba(59,130,246,0.4)' : 'background:rgba(0,0,0,0.03);color:#4b5563;border-color:rgba(0,0,0,0.05)';
      h += '<button id="cvTab_' + cats[ci].id + '" onclick="_htCvTab(\'' + cats[ci].id + '\')" style="border:1px solid;border-radius:6px;padding:5px 10px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;' + sel + '">' + cats[ci].label + '</button>';
    }
    h += '</div></div>';
    // Panels
    for (var ci = 0; ci < cats.length; ci++) {
      var cat = cats[ci];
      h += '<div id="cvPanel_' + cat.id + '" style="padding:12px;' + (ci > 0 ? 'display:none;' : '') + '">';
      for (var ui = 0; ui < cat.units.length; ui++) {
        var u = cat.units[ui];
        h += '<div style="margin-bottom:8px;"><label style="font-size:9px;color:#4b5563;font-weight:600;">' + u.l + '</label>';
        h += '<input id="cv_' + cat.id + '_' + u.k + '" type="number" step="any" oninput="_htCvCalc(\'' + cat.id + '\',\'' + u.k + '\',this.value)" style="display:block;width:100%;box-sizing:border-box;margin-top:2px;background:#ffffff;color:#0F0F0F;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:14px;font-weight:600;outline:none;-moz-appearance:textfield;" /></div>';
      }
      h += '</div>';
    }
    // Quick ref
    h += '<div style="margin:0 12px;padding:10px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;font-size:9px;color:#4b5563;line-height:1.8;">';
    h += '<div style="font-weight:700;color:#0F0F0F;margin-bottom:4px;">' + _th('ht_cv_common', 'Conversiones HVAC comunes:') + '</div>';
    h += '1 Ton = 12,000 BTU/hr = 3.517 kW<br>1 HP = 746 W = 2,545 BTU/hr<br>400 CFM por ton (residencial)<br>14.696 psia = 0 psig = 1 atm<br>-40\u00B0F = -40\u00B0C';
    h += '</div></div>';
    s.innerHTML = h;
  }
  window._htCvTab = function(id) {
    var tabs = ['temp','pres','energy','flow','len'];
    for (var i = 0; i < tabs.length; i++) {
      var p = document.getElementById('cvPanel_' + tabs[i]);
      var t = document.getElementById('cvTab_' + tabs[i]);
      if (p) p.style.display = tabs[i] === id ? '' : 'none';
      if (t) { t.style.background = tabs[i] === id ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.03)'; t.style.color = tabs[i] === id ? '#60a5fa' : '#3D3D3A'; }
    }
  };
  window._htCvCalc = function(cat, src, val) {
    var v = parseFloat(val); if (isNaN(v)) return;
    var sets = {};
    if (cat === 'temp') {
      var c = src === 'f' ? (v-32)*5/9 : src === 'c' ? v : src === 'k' ? v-273.15 : (v-491.67)*5/9;
      sets = { f: c*9/5+32, c: c, k: c+273.15, r: c*9/5+32+459.67 };
    } else if (cat === 'pres') {
      var psia = src === 'psig' ? v+14.696 : src === 'psia' ? v : src === 'kpa' ? v/6.89476 : src === 'bar' ? v/0.0689476 : src === 'inhg' ? v/2.03602 : v*14.696;
      sets = { psig: psia-14.696, psia: psia, kpa: psia*6.89476, bar: psia*0.0689476, inhg: psia*2.03602, atm: psia/14.696 };
    } else if (cat === 'energy') {
      var btu = src === 'btu' ? v : src === 'kw' ? v/0.000293071 : src === 'ton' ? v*12000 : v*2545;
      sets = { btu: btu, kw: btu*0.000293071, ton: btu/12000, hp: btu/2545 };
    } else if (cat === 'flow') {
      var cfm = src === 'cfm' ? v : src === 'm3h' ? v/1.69901 : v*2.11888;
      sets = { cfm: cfm, m3h: cfm*1.69901, ls: cfm*0.471947 };
    } else if (cat === 'len') {
      var ft = src === 'ft' ? v : src === 'in' ? v/12 : src === 'm' ? v/0.3048 : v/30.48;
      sets = { ft: ft, 'in': ft*12, m: ft*0.3048, cm: ft*30.48 };
    }
    var keys = Object.keys(sets);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === src) continue;
      var el = document.getElementById('cv_' + cat + '_' + keys[i]);
      if (el) el.value = Math.round(sets[keys[i]] * 10000) / 10000;
    }
  };

  // ============================
  // DUCTULATOR
  // ============================
  function _htShowDuctulator(s) {
    _htView = 'ductulator';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">Ductulator</div></div></div>';
    h += '<div style="padding:12px;">';
    // CFM to Duct Size
    h += '<div style="padding:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#f59e0b;margin-bottom:8px;">' + _th('ht_duct_cfm_to_size', 'CFM \u2192 Tama\u00F1o de Ducto') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += _htInput('htDuctCFM', 'CFM', '_htDuctCalc()');
    h += '<select id="htDuctVel" onchange="_htDuctCalc()" style="background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:12px;outline:none;"><option value="700">Supply 700 FPM</option><option value="900">Trunk 900 FPM</option><option value="500">Return 500 FPM</option><option value="600">Branch 600 FPM</option></select>';
    h += '</div>';
    h += '<div id="htDuctResult" style="margin-top:10px;padding:10px;background:rgba(0,0,0,0.04);border-radius:8px;font-size:11px;color:#4b5563;">' + _th('ht_duct_enter_cfm', 'Ingresa CFM para calcular') + '</div>';
    h += '</div>';
    // Rectangular equivalent
    h += '<div style="padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#111827;margin-bottom:8px;">' + _th('ht_duct_rect_round', 'Equivalente Rectangular \u2194 Redondo') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += _htInput('htDuctW', _th('ht_duct_width', 'Ancho (in)'), '_htDuctEq()');
    h += _htInput('htDuctH', _th('ht_duct_height', 'Alto (in)'), '_htDuctEq()');
    h += '<div id="htDuctEqR" style="background:rgba(0,0,0,0.04);border-radius:8px;padding:10px;font-size:12px;color:#60a5fa;font-weight:700;display:flex;align-items:center;justify-content:center;">\u2014</div>';
    h += '</div></div>';
    // Friction Rate Calculator
    h += '<div style="padding:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#f59e0b;margin-bottom:4px;">\uD83D\uDCCF ' + _th('ht_duct_friction_title', 'Friction Rate Calculator') + '</div>';
    h += '<div style="font-size:10px;color:#4b5563;margin-bottom:8px;">FR = (ASP \u00D7 100) / TEL</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += _htInput('htFRASP', 'A.S.P. (inWC)', '_htCalcFR()');
    h += _htInput('htFRTEL', 'T.E.L. (ft)', '_htCalcFR()');
    h += '</div>';
    h += '<button onclick="_htCalcFR()" style="width:100%;margin-top:6px;padding:8px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);color:#f59e0b;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">' + _th('ht_duct_calc_fr', 'Calcular Friction Rate') + '</button>';
    h += '<div id="htFRResult" style="margin-top:8px;padding:10px;background:rgba(0,0,0,0.04);border-radius:8px;text-align:center;font-size:11px;color:#4b5563;">' + _th('ht_duct_enter_asp_tel', 'Ingresa ASP y TEL para calcular') + '</div>';
    h += '<div style="margin-top:6px;font-size:9px;color:#4b5563;text-align:center;">Residencial: 0.08\u20130.10 | Comercial: hasta 0.15 in.wg/100ft</div>';
    h += '</div>';
    // Quick ref
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;font-size:9px;color:#4b5563;">';
    h += '<div style="font-weight:700;color:#111827;margin-bottom:4px;">' + _th('ht_duct_quick_ref', 'Referencia R\u00E1pida \u2014 Ductos Residenciales') + '</div>';
    var dref = [['6"',75],['8"',160],['10"',275],['12"',425],['14"',610],['16"',830],['18"',1100],['20"',1375]];
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;">';
    for (var i = 0; i < dref.length; i++) h += '<div style="text-align:center;padding:4px;background:rgba(245,158,11,0.06);border-radius:4px;"><div style="font-weight:700;color:#f59e0b;">' + dref[i][0] + '</div><div>' + dref[i][1] + ' CFM</div></div>';
    h += '</div>';
    h += '<div style="margin-top:6px;">Velocidades: Supply 600-900 FPM | Return 400-600 FPM | Trunk 700-1000 FPM<br>Usa la calculadora de Friction Rate arriba para determinar el FR correcto</div>';
    h += '</div></div></div>';
    s.innerHTML = h;
  }
  window._htDuctCalc = function() {
    var cfm = parseFloat((document.getElementById('htDuctCFM')||{}).value);
    var vel = parseFloat((document.getElementById('htDuctVel')||{}).value);
    var r = document.getElementById('htDuctResult');
    if (!r || isNaN(cfm) || cfm <= 0) return;
    var area = cfm / vel; // sq ft
    var dia = Math.sqrt(area * 4 / Math.PI) * 12; // inches
    var rects = [[8,dia*dia*Math.PI/(4*144*8/12)],[10,0],[12,0],[14,0]];
    var rectStr = '';
    var sizes = [6,8,10,12,14,16,18,20,22,24];
    for (var wi = 0; wi < sizes.length; wi++) {
      var w = sizes[wi];
      for (var hi = wi; hi < sizes.length; hi++) {
        var hh = sizes[hi];
        var de = 1.3 * Math.pow(w*hh, 0.625) / Math.pow(w+hh, 0.25);
        if (Math.abs(de - dia) < 1.5) { rectStr += w + '"x' + hh + '" '; if (rectStr.length > 40) break; }
      }
      if (rectStr.length > 40) break;
    }
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var rh = '<div style="font-size:20px;font-weight:900;color:#f59e0b;margin-bottom:4px;">' + Math.round(dia) + '" ' + _th('ht_duct_round', 'redondo') + '</div>' +
      '<div>' + _th('ht_duct_area', 'Area') + ': ' + (area*144).toFixed(1) + ' sq in | ' + _th('ht_duct_velocity', 'Velocidad') + ': ' + vel + ' FPM</div>' +
      (rectStr ? '<div style="margin-top:4px;color:#111827;">' + _th('ht_duct_rect_equiv', 'Equiv. rectangular') + ': <b>' + rectStr.trim() + '</b></div>' : '');
    rh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('ductulator') : '';
    r.innerHTML = rh;
  };
  window._htDuctEq = function() {
    var w = parseFloat((document.getElementById('htDuctW')||{}).value);
    var hh = parseFloat((document.getElementById('htDuctH')||{}).value);
    var r = document.getElementById('htDuctEqR');
    if (!r || isNaN(w) || isNaN(hh) || w <= 0 || hh <= 0) return;
    var de = 1.3 * Math.pow(w*hh, 0.625) / Math.pow(w+hh, 0.25);
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    r.innerHTML = Math.round(de * 10) / 10 + '"<br><span style="font-size:8px;color:#4b5563;">' + _th('ht_duct_round_eq', 'redondo eq.') + '</span>';
  };
  window._htCalcFR = function() {
    var asp = parseFloat((document.getElementById('htFRASP')||{}).value);
    var tel = parseFloat((document.getElementById('htFRTEL')||{}).value);
    var r = document.getElementById('htFRResult');
    if (!r || isNaN(asp) || isNaN(tel) || tel <= 0 || asp <= 0) {
      var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
      if (r) r.innerHTML = '<div style="font-size:12px;color:#4b5563;">' + _th('ht_duct_enter_valid', 'Ingresa ASP y TEL v\u00E1lidos') + '</div>';
      return;
    }
    var fr = (asp * 100) / tel;
    var color = fr <= 0.10 ? '#22c55e' : fr <= 0.12 ? '#eab308' : '#ef4444';
    var _th2 = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var status = fr <= 0.10 ? '\u2713 ' + _th2('ht_duct_ideal_res', 'Ideal residencial') : fr <= 0.12 ? '\u26A0 ' + _th2('ht_duct_acceptable', 'Aceptable') : '\u26D4 ' + _th2('ht_duct_high_undersized', 'Alto \u2014 ductos subdimensionados');
    var html = '<div style="font-size:28px;font-weight:900;color:' + color + ';">' + fr.toFixed(3) + '</div>' +
      '<div style="font-size:10px;color:#4b5563;">in.wg/100ft</div>' +
      '<div style="margin-top:6px;font-size:11px;color:' + color + ';">' + status + '</div>';
    // If CFM is entered above, show recommended duct size based on FR
    var cfm = parseFloat((document.getElementById('htDuctCFM')||{}).value);
    if (!isNaN(cfm) && cfm > 0) {
      var vel = fr <= 0.06 ? 500 : fr <= 0.08 ? 700 : fr <= 0.10 ? 900 : fr <= 0.12 ? 1000 : 1100;
      var neededSqIn = (cfm / vel) * 144;
      var neededDia = 2 * Math.sqrt(neededSqIn / Math.PI);
      var stdSizes = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 30, 36];
      var recDia = stdSizes[stdSizes.length - 1];
      for (var i = 0; i < stdSizes.length; i++) { if (stdSizes[i] >= neededDia) { recDia = stdSizes[i]; break; } }
      html += '<div style="margin-top:8px;padding:6px;background:rgba(245,158,11,0.08);border-radius:6px;font-size:11px;color:#111827;">' +
        'Con ' + cfm + ' CFM @~' + vel + ' FPM \u2192 <b style="color:#f59e0b;">' + recDia + '" ' + _th2('ht_duct_round', 'redondo') + '</b></div>';
    }
    r.innerHTML = html;
  };

  // ============================
  // CONDUIT FILL
  // ============================
  var _cfWires = window._cfWires = [];
  var _cfWireAreas = { '14': 0.0097, '12': 0.0133, '10': 0.0211, '8': 0.0366, '6': 0.0507, '4': 0.0824, '3': 0.0973, '2': 0.1158, '1': 0.1562, '1/0': 0.1855, '2/0': 0.2223, '3/0': 0.2679, '4/0': 0.3237 };
  var _cfConduitAreas = {
    'EMT': { '1/2': 0.304, '3/4': 0.533, '1': 0.864, '1-1/4': 1.496, '1-1/2': 2.036, '2': 3.356, '2-1/2': 5.858, '3': 8.846, '4': 14.753 },
    'RMC': { '1/2': 0.314, '3/4': 0.549, '1': 0.887, '1-1/4': 1.526, '1-1/2': 2.071, '2': 3.408, '2-1/2': 4.866, '3': 7.499, '4': 12.882 },
    'PVC40': { '1/2': 0.285, '3/4': 0.508, '1': 0.832, '1-1/4': 1.453, '1-1/2': 1.986, '2': 3.291, '2-1/2': 5.453, '3': 8.091, '4': 13.631 }
  };
  function _htShowConduitFill(s) {
    _htView = 'conduitfill'; _cfWires = window._cfWires = [{ gauge: '12', qty: 3 }];
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">Conduit Fill (NEC)</div></div></div>';
    h += '<div style="padding:12px;">';
    // Conduit selection
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;">' + _th('ht_cf_conduit_type', 'Tipo de Conduit') + '</label><select id="htCFType" onchange="_htCFCalc()" style="display:block;width:100%;margin-top:2px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:12px;outline:none;"><option value="EMT">EMT</option><option value="RMC">RMC</option><option value="PVC40">PVC Sch 40</option></select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;">' + _th('ht_cf_size', 'Tama\u00F1o') + '</label><select id="htCFSize" onchange="_htCFCalc()" style="display:block;width:100%;margin-top:2px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:12px;outline:none;"><option value="1/2">1/2"</option><option value="3/4" selected>3/4"</option><option value="1">1"</option><option value="1-1/4">1-1/4"</option><option value="1-1/2">1-1/2"</option><option value="2">2"</option><option value="2-1/2">2-1/2"</option><option value="3">3"</option><option value="4">4"</option></select></div>';
    h += '</div>';
    // Wire list
    h += '<div id="htCFWires"></div>';
    h += '<button onclick="_htCFAddWire()" style="width:100%;padding:8px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;margin-bottom:8px;">' + _th('ht_cf_add_wire', '+ Agregar Cable') + '</button>';
    // Result
    h += '<div id="htCFResult" style="padding:12px;background:rgba(0,0,0,0.04);border-radius:10px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
    _htCFRenderWires();
    _htCFCalc();
  }
  window._htCFRenderWires = _htCFRenderWires;
  function _htCFRenderWires() {
    var w = document.getElementById('htCFWires'); if (!w) return;
    var gauges = Object.keys(_cfWireAreas);
    var h = '';
    for (var i = 0; i < _cfWires.length; i++) {
      h += '<div style="display:flex;gap:4px;margin-bottom:4px;align-items:center;">';
      h += '<select onchange="_cfWires[' + i + '].gauge=this.value;_htCFCalc()" style="flex:1;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:6px;padding:8px;font-size:11px;outline:none;">';
      for (var g = 0; g < gauges.length; g++) h += '<option value="' + gauges[g] + '"' + (_cfWires[i].gauge === gauges[g] ? ' selected' : '') + '>' + gauges[g] + ' AWG</option>';
      h += '</select>';
      h += '<input type="number" min="1" value="' + _cfWires[i].qty + '" onchange="_cfWires[' + i + '].qty=parseInt(this.value)||1;_htCFCalc()" style="width:50px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:6px;padding:8px;font-size:11px;outline:none;text-align:center;" />';
      h += '<button onclick="_cfWires.splice(' + i + ',1);_htCFRenderWires();_htCFCalc()" style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#f87171;width:32px;height:32px;border-radius:6px;cursor:pointer;font-size:14px;">\u00D7</button>';
      h += '</div>';
    }
    w.innerHTML = h;
  }
  window._htCFAddWire = function() { _cfWires.push({ gauge: '12', qty: 1 }); window._htCFRenderWires(); window._htCFCalc(); };
  window._htCFCalc = function() {
    var r = document.getElementById('htCFResult'); if (!r) return;
    var type = (document.getElementById('htCFType')||{}).value || 'EMT';
    var size = (document.getElementById('htCFSize')||{}).value || '3/4';
    var condArea = (_cfConduitAreas[type]||{})[size] || 0;
    var totalWires = 0, totalArea = 0;
    for (var i = 0; i < _cfWires.length; i++) {
      var a = _cfWireAreas[_cfWires[i].gauge] || 0;
      totalArea += a * _cfWires[i].qty;
      totalWires += _cfWires[i].qty;
    }
    var maxFill = totalWires === 1 ? 0.53 : totalWires === 2 ? 0.31 : 0.40;
    var allowable = condArea * maxFill;
    var pct = condArea > 0 ? (totalArea / condArea * 100) : 0;
    var pass = totalArea <= allowable;
    var col = pass ? '#34d399' : '#ef4444';
    r.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
      '<span style="font-size:10px;color:#4b5563;">' + type + ' ' + size + '" | ' + totalWires + ' cables</span>' +
      '<span style="font-size:16px;font-weight:900;color:' + col + ';">' + (pass ? (typeof _t === 'function' ? _t('ht_pass') : 'PASA') : (typeof _t === 'function' ? _t('ht_fail') : 'NO PASA')) + '</span></div>' +
      '<div style="height:8px;background:rgba(0,0,0,0.06);border-radius:4px;overflow:hidden;margin-bottom:6px;">' +
      '<div style="height:100%;width:' + Math.min(100, pct) + '%;background:' + col + ';border-radius:4px;transition:width 0.3s;"></div></div>' +
      '<div style="font-size:10px;color:#4b5563;">' + (typeof _t === 'function' ? _t('ht_cf_fill') : 'Llenado') + ': <b style="color:' + col + ';">' + pct.toFixed(1) + '%</b> | ' + (typeof _t === 'function' ? _t('ht_cf_max_nec') : 'M\u00E1ximo NEC') + ': ' + (maxFill*100) + '% (' + totalWires + ' ' + (typeof _t === 'function' ? _t('ht_cf_cables') : 'cables') + ')<br>' +
      (typeof _t === 'function' ? _t('ht_cf_wire_area') : 'Area cables') + ': ' + totalArea.toFixed(4) + ' sq in | ' + (typeof _t === 'function' ? _t('ht_cf_conduit_area') : 'Area conduit') + ': ' + condArea.toFixed(3) + ' sq in | ' + (typeof _t === 'function' ? _t('ht_cf_available') : 'Disponible') + ': ' + allowable.toFixed(3) + ' sq in</div>' +
      (typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('conduitfill') : '');
  };

  // ============================
  // WIRE SIZING / VOLTAGE DROP
  // ============================
  var _wsData = [
    { awg: '14', amp75: 15, ohm: 3.14 }, { awg: '12', amp75: 20, ohm: 1.98 }, { awg: '10', amp75: 30, ohm: 1.24 },
    { awg: '8', amp75: 40, ohm: 0.778 }, { awg: '6', amp75: 55, ohm: 0.491 }, { awg: '4', amp75: 70, ohm: 0.308 },
    { awg: '3', amp75: 85, ohm: 0.245 }, { awg: '2', amp75: 95, ohm: 0.194 }, { awg: '1', amp75: 110, ohm: 0.154 },
    { awg: '1/0', amp75: 125, ohm: 0.122 }, { awg: '2/0', amp75: 145, ohm: 0.0967 }, { awg: '3/0', amp75: 165, ohm: 0.0766 }, { awg: '4/0', amp75: 195, ohm: 0.0608 }
  ];
  function _htShowWireSizing(s) {
    _htView = 'wiresizing';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">Wire Sizing / Voltage Drop</div></div></div>';
    h += '<div style="padding:12px;">';
    // Wire Selector
    h += '<div style="padding:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-size:11px;font-weight:800;color:#f59e0b;margin-bottom:8px;">' + _th('ht_ws_wire_selector', 'Selector de Cable') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += _htInput('htWSAmps', 'Amperes', '_htWSCalc()');
    h += _htInput('htWSDist', _th('ht_ws_distance', 'Distancia (ft)'), '_htWSCalc()');
    h += '<select id="htWSVolt" onchange="_htWSCalc()" style="background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:10px;font-size:12px;outline:none;"><option value="120">120V 1\u03C6</option><option value="208">208V 1\u03C6</option><option value="240" selected>240V 1\u03C6</option><option value="208-3">208V 3\u03C6</option><option value="480-3">480V 3\u03C6</option></select>';
    h += _htInput('htWSMaxDrop', _th('ht_ws_max_drop', 'Max V-Drop %'), '_htWSCalc()');
    h += '</div>';
    h += '<div id="htWSResult" style="margin-top:10px;padding:10px;background:rgba(0,0,0,0.04);border-radius:8px;font-size:11px;color:#4b5563;">' + _th('ht_ws_enter_amps', 'Ingresa amperes y distancia') + '</div>';
    h += '</div>';
    // Ampacity table
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;font-size:9px;color:#4b5563;">';
    h += '<div style="font-weight:700;color:#111827;margin-bottom:6px;">' + _th('ht_ws_ampacity_table', 'Tabla Ampacidad NEC (75\u00B0C THWN, Cobre)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;">';
    for (var i = 0; i < _wsData.length; i++) {
      var w = _wsData[i];
      h += '<div style="text-align:center;padding:3px;background:rgba(245,158,11,0.04);border-radius:3px;"><div style="font-weight:700;color:#f59e0b;">' + w.awg + '</div><div>' + w.amp75 + 'A</div></div>';
    }
    h += '</div></div></div></div>';
    s.innerHTML = h;
    var dd = document.getElementById('htWSMaxDrop'); if (dd) dd.value = '3';
  }
  window._htWSCalc = function() {
    var amps = parseFloat((document.getElementById('htWSAmps')||{}).value);
    var dist = parseFloat((document.getElementById('htWSDist')||{}).value);
    var voltSel = (document.getElementById('htWSVolt')||{}).value || '240';
    var maxDrop = parseFloat((document.getElementById('htWSMaxDrop')||{}).value) || 3;
    var r = document.getElementById('htWSResult'); if (!r || isNaN(amps) || isNaN(dist)) return;
    var is3ph = voltSel.indexOf('3') > -1;
    var volts = parseInt(voltSel, 10);
    var mult = is3ph ? 1.732 : 2;
    // Find smallest wire that: (1) handles ampacity, (2) meets voltage drop
    var rec = null;
    for (var i = 0; i < _wsData.length; i++) {
      var w = _wsData[i];
      if (w.amp75 < amps) continue;
      var vd = (mult * dist * amps * w.ohm) / 1000;
      var vdPct = (vd / volts) * 100;
      if (vdPct <= maxDrop) { rec = { awg: w.awg, amp: w.amp75, vd: vd, vdPct: vdPct }; break; }
    }
    if (!rec) {
      // Find wire that handles ampacity at least
      for (var i = 0; i < _wsData.length; i++) {
        if (_wsData[i].amp75 >= amps) {
          var vd = (mult * dist * amps * _wsData[i].ohm) / 1000;
          rec = { awg: _wsData[i].awg, amp: _wsData[i].amp75, vd: vd, vdPct: (vd/volts)*100, warn: true };
          break;
        }
      }
    }
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    if (!rec) { r.innerHTML = '<span style="color:#ef4444;">' + _th('ht_ws_exceeds_4_0', 'Carga excede 4/0 AWG').replace('{amps}', amps) + '</span>'; return; }
    var col = rec.warn ? '#ef4444' : '#34d399';
    var vAtLoad = volts - rec.vd;
    r.innerHTML = '<div style="font-size:18px;font-weight:900;color:' + col + ';margin-bottom:4px;">' + rec.awg + ' AWG' + (rec.warn ? ' \u26A0\uFE0F' : ' \u2713') + '</div>' +
      '<div>' + _th('ht_ws_ampacity', 'Ampacidad') + ': ' + rec.amp + 'A | ' + _th('ht_ws_load', 'Carga') + ': ' + amps + 'A</div>' +
      '<div>' + _th('ht_ws_drop', 'Ca\u00EDda') + ': <b style="color:' + (rec.vdPct > maxDrop ? '#ef4444' : '#34d399') + ';">' + rec.vdPct.toFixed(2) + '%</b> (' + rec.vd.toFixed(1) + 'V) | ' + _th('ht_ws_voltage_at_load', 'Voltaje en carga') + ': ' + vAtLoad.toFixed(1) + 'V</div>' +
      (rec.warn ? '<div style="margin-top:4px;color:#ef4444;font-weight:700;">' + _th('ht_ws_exceeds_drop', 'Excede v-drop.').replace('{max}', maxDrop) + '</div>' : '') +
      (typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('wiresizing') : '');
  };

  // ============================
  // POWER WHEEL (OHM'S LAW)
  // ============================
  function _htShowPowerWheel(s) {
    _htView = 'powerwheel';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">' + _th('ht_pw_ohm_law', 'Power Wheel \u2014 Ley de Ohm') + '</div></div></div>';
    h += '<div style="padding:12px;">';
    // Input fields
    h += '<div style="font-size:10px;color:#4b5563;margin-bottom:6px;font-weight:600;">' + _th('ht_pw_enter_2', 'Ingresa 2 valores, se calculan los otros 2:') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">';
    var pw = [['V',_th('ht_pw_voltage', 'Voltaje (V)'),'#eab308'],['I',_th('ht_pw_current', 'Corriente (A)'),'#22c55e'],['R',_th('ht_pw_resistance', 'Resistencia (\u03A9)'),'#3b82f6'],['P',_th('ht_pw_power', 'Potencia (W)'),'#ef4444']];
    for (var i = 0; i < pw.length; i++) {
      h += '<div style="padding:8px;background:rgba(0,0,0,0.02);border:1px solid ' + pw[i][2] + '30;border-radius:8px;border-left:3px solid ' + pw[i][2] + ';">';
      h += '<label style="font-size:9px;color:' + pw[i][2] + ';font-weight:700;">' + pw[i][1] + '</label>';
      h += '<input id="htPW' + pw[i][0] + '" type="number" step="any" oninput="_htPWCalc()" placeholder="' + pw[i][0] + '" style="display:block;width:100%;box-sizing:border-box;margin-top:3px;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:6px;padding:8px;font-size:16px;font-weight:700;outline:none;-moz-appearance:textfield;" />';
      h += '</div>';
    }
    h += '</div>';
    h += '<button onclick="_htPWClear()" style="width:100%;padding:8px;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.1);color:#4b5563;border-radius:8px;font-size:10px;font-weight:600;cursor:pointer;margin-bottom:10px;">' + _th('ht_clean', 'Limpiar') + '</button>';
    // Formula reference
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:10px;margin-bottom:8px;">';
    h += '<div style="font-weight:700;color:#111827;font-size:10px;margin-bottom:6px;">' + _th('ht_pw_formulas', '12 F\u00F3rmulas de Ohm\'s / Watt\'s Law') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:9px;">';
    var formulas = [
      ['V = I \u00D7 R','#eab308'],['V = P / I','#eab308'],['V = \u221A(P\u00D7R)','#eab308'],
      ['I = V / R','#22c55e'],['I = P / V','#22c55e'],['I = \u221A(P/R)','#22c55e'],
      ['R = V / I','#3b82f6'],['R = V\u00B2 / P','#3b82f6'],['R = P / I\u00B2','#3b82f6'],
      ['P = V \u00D7 I','#ef4444'],['P = V\u00B2 / R','#ef4444'],['P = I\u00B2 \u00D7 R','#ef4444']
    ];
    for (var i = 0; i < formulas.length; i++) h += '<div style="padding:3px 6px;background:rgba(0,0,0,0.02);border-radius:4px;color:' + formulas[i][1] + ';font-weight:600;">' + formulas[i][0] + '</div>';
    h += '</div></div>';
    // 3-phase
    h += '<div style="padding:10px;background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.15);border-radius:10px;font-size:10px;color:#4b5563;">';
    h += '<div style="font-weight:700;color:#c084fc;margin-bottom:4px;">' + _th('ht_pw_three_phase', 'Trif\u00E1sico (3\u03C6)') + '</div>';
    h += 'P = V \u00D7 I \u00D7 \u221A3 \u00D7 PF<br>Donde PF (Power Factor) t\u00EDpico = 0.85-0.95';
    h += '</div>';
    h += '<div id="htPWPdfBar" style="margin:0 12px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
  }
  window._htPWCalc = function() {
    var V = parseFloat((document.getElementById('htPWV')||{}).value);
    var I = parseFloat((document.getElementById('htPWI')||{}).value);
    var R = parseFloat((document.getElementById('htPWR')||{}).value);
    var P = parseFloat((document.getElementById('htPWP')||{}).value);
    var known = (!isNaN(V)?1:0)+(!isNaN(I)?1:0)+(!isNaN(R)?1:0)+(!isNaN(P)?1:0);
    if (known < 2) return;
    var nV=V,nI=I,nR=R,nP=P;
    if (!isNaN(V)&&!isNaN(I)) { nR=V/I; nP=V*I; }
    else if (!isNaN(V)&&!isNaN(R)) { nI=V/R; nP=V*V/R; }
    else if (!isNaN(V)&&!isNaN(P)) { nI=P/V; nR=V*V/P; }
    else if (!isNaN(I)&&!isNaN(R)) { nV=I*R; nP=I*I*R; }
    else if (!isNaN(I)&&!isNaN(P)) { nV=P/I; nR=P/(I*I); }
    else if (!isNaN(R)&&!isNaN(P)) { nV=Math.sqrt(P*R); nI=Math.sqrt(P/R); }
    var fields = [['V',nV],['I',nI],['R',nR],['P',nP]];
    for (var i = 0; i < fields.length; i++) {
      var el = document.getElementById('htPW' + fields[i][0]);
      if (el && isNaN(parseFloat(el.value))) el.value = Math.round(fields[i][1] * 1000) / 1000;
    }
    var pwPdfBar = document.getElementById('htPWPdfBar');
    if (pwPdfBar && typeof window.hvacPdfBar === 'function') pwPdfBar.innerHTML = window.hvacPdfBar('powerwheel');
  };
  window._htPWClear = function() {
    ['V','I','R','P'].forEach(function(k) { var el = document.getElementById('htPW'+k); if (el) el.value = ''; });
  };

  // ============================
  // SYSTEM PERFORMANCE ANALYZER
  // ============================
  function _htShowSysAnalyzer(s) {
    _htView = 'sysanalyzer';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var order = window.PT_ORDER || [];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">System Analyzer</div></div></div>';
    h += '<div style="padding:12px;">';
    // Selectors
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;">' + _th('ht_refrigerant_label', 'Refrigerante') + '</label>';
    h += '<select id="htSARef" onchange="_htSACalc()" style="display:block;width:100%;margin-top:2px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px;font-size:11px;outline:none;">';
    for (var i = 0; i < order.length; i++) h += '<option value="' + order[i] + '"' + (order[i] === 'R-410A' ? ' selected' : '') + '>' + order[i] + '</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;">' + _th('ht_sa_metering', 'Metering Device') + '</label>';
    h += '<select id="htSAMeter" style="display:block;width:100%;margin-top:2px;background:#ffffff;color:#111827;border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:8px;font-size:11px;outline:none;"><option value="TXV">TXV</option><option value="Piston">Pist\u00F3n/Orificio</option><option value="EEV">EEV</option></select></div>';
    h += '</div>';
    // Readings
    h += '<div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:4px;">' + _th('ht_sa_system_readings', 'LECTURAS DEL SISTEMA') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">';
    var inputs = [['htSASucP',_th('ht_sa_suction_pres', 'Presi\u00F3n Succi\u00F3n (psig)')],['htSADisP',_th('ht_sa_discharge_pres', 'Presi\u00F3n Descarga (psig)')],['htSASucT',_th('ht_sa_suction_temp', 'Temp L\u00EDnea Succi\u00F3n (\u00B0F)')],['htSALiqT',_th('ht_sa_liquid_temp', 'Temp L\u00EDnea L\u00EDquido (\u00B0F)')],['htSAOutT',_th('ht_sa_outdoor_temp', 'Temp Exterior (\u00B0F)')],['htSAInT',_th('ht_sa_indoor_temp', 'Temp Interior (\u00B0F)')]];
    for (var i = 0; i < inputs.length; i++) h += '<div><label style="font-size:8px;color:#4b5563;">' + inputs[i][1] + '</label>' + _htInput(inputs[i][0], '', '_htSACalc()').replace('width:100%;box-sizing:border-box;','width:100%;box-sizing:border-box;margin-top:2px;') + '</div>';
    h += '</div>';
    // Results
    h += '<div id="htSAResults" style="margin-bottom:8px;"></div>';
    // IA button
    h += '<button id="htSAIABtn" onclick="_htSADiagnose()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">' + _th('ht_analyze_ia', 'Analizar con IA') + '</button>';
    h += '<div id="htSAIAResult" style="margin-top:8px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
  }
  window._htSACalc = function() {
    var r = document.getElementById('htSAResults'); if (!r) return;
    var ref = (document.getElementById('htSARef')||{}).value||'R-410A';
    var sucP = parseFloat((document.getElementById('htSASucP')||{}).value);
    var disP = parseFloat((document.getElementById('htSADisP')||{}).value);
    var sucT = parseFloat((document.getElementById('htSASucT')||{}).value);
    var liqT = parseFloat((document.getElementById('htSALiqT')||{}).value);
    var outT = parseFloat((document.getElementById('htSAOutT')||{}).value);
    var inT = parseFloat((document.getElementById('htSAInT')||{}).value);
    if (isNaN(sucP) && isNaN(disP)) { r.innerHTML = ''; return; }
    var satEvap = window.PT_REVERSE ? window.PT_REVERSE(ref, sucP) : null;
    var satCond = window.PT_REVERSE ? window.PT_REVERSE(ref, disP) : null;
    var sh = (satEvap && !isNaN(sucT)) ? Math.round((sucT - satEvap.temp_f)*10)/10 : null;
    var sc = (satCond && !isNaN(liqT)) ? Math.round((satCond.temp_f - liqT)*10)/10 : null;
    var cr = (!isNaN(sucP) && !isNaN(disP) && sucP > -14.7) ? Math.round((disP+14.7)/(sucP+14.7)*10)/10 : null;
    var condSplit = (satCond && !isNaN(outT)) ? Math.round((satCond.temp_f - outT)*10)/10 : null;
    var evapSplit = (satEvap && !isNaN(inT)) ? Math.round((inT - satEvap.temp_f)*10)/10 : null;
    function _mc(val, lo, hi) { if (val === null) return '#3D3D3A'; return (val >= lo && val <= hi) ? '#34d399' : '#f87171'; }
    var h = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">';
    var metrics = [
      ['Superheat', sh !== null ? sh+'\u00B0F' : '\u2014', _mc(sh,5,20)],
      ['Subcooling', sc !== null ? sc+'\u00B0F' : '\u2014', _mc(sc,3,20)],
      ['Comp Ratio', cr !== null ? cr+':1' : '\u2014', _mc(cr,2,4.5)],
      ['Sat Evap', satEvap ? satEvap.temp_f+'\u00B0F' : '\u2014', '#60a5fa'],
      ['Sat Cond', satCond ? satCond.temp_f+'\u00B0F' : '\u2014', '#f59e0b'],
      ['Cond Split', condSplit !== null ? condSplit+'\u00B0F' : '\u2014', _mc(condSplit,10,35)]
    ];
    for (var i = 0; i < metrics.length; i++) {
      h += '<div style="padding:8px;background:rgba(0,0,0,0.04);border-radius:8px;text-align:center;">';
      h += '<div style="font-size:7px;color:#4b5563;text-transform:uppercase;letter-spacing:0.5px;">' + metrics[i][0] + '</div>';
      h += '<div style="font-size:16px;font-weight:900;color:' + metrics[i][2] + ';">' + metrics[i][1] + '</div></div>';
    }
    h += '</div>';
    h += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('sysanalyzer') : '';
    r.innerHTML = h;
  };
  window._htSADiagnose = function() {
    var ref = (document.getElementById('htSARef')||{}).value;
    var meter = (document.getElementById('htSAMeter')||{}).value;
    var sucP = (document.getElementById('htSASucP')||{}).value;
    var disP = (document.getElementById('htSADisP')||{}).value;
    var sucT = (document.getElementById('htSASucT')||{}).value;
    var liqT = (document.getElementById('htSALiqT')||{}).value;
    var outT = (document.getElementById('htSAOutT')||{}).value;
    var inT = (document.getElementById('htSAInT')||{}).value;
    var satE = window.PT_REVERSE ? window.PT_REVERSE(ref, parseFloat(sucP)) : null;
    var satC = window.PT_REVERSE ? window.PT_REVERSE(ref, parseFloat(disP)) : null;
    var sh = satE && sucT ? (parseFloat(sucT)-satE.temp_f).toFixed(1) : '?';
    var sc = satC && liqT ? (satC.temp_f-parseFloat(liqT)).toFixed(1) : '?';
    var prompt = _t('ht_ai_sa_system_prompt','Eres un técnico HVAC senior con 20 años de experiencia. Analiza estas lecturas del sistema y da un diagnóstico profesional en español.') + '\n\n' +
      'Refrigerante: ' + ref + '\nMetering device: ' + meter + '\n' + _t('ht_ai_suction_pres','Presión succión') + ': ' + sucP + ' psig\n' + _t('ht_ai_discharge_pres','Presión descarga') + ': ' + disP + ' psig\n' +
      _t('ht_ai_suction_temp','Temp línea succión') + ': ' + sucT + '\u00B0F\n' + _t('ht_ai_liquid_temp','Temp línea líquido') + ': ' + liqT + '\u00B0F\n' + _t('ht_ai_outdoor_temp','Temp exterior') + ': ' + outT + '\u00B0F\n' + _t('ht_ai_indoor_temp','Temp interior') + ': ' + inT + '\u00B0F\n' +
      'Superheat calculado: ' + sh + '\u00B0F\nSubcooling calculado: ' + sc + '\u00B0F\n' +
      (satE ? 'Sat evap: ' + satE.temp_f + '\u00B0F\n' : '') + (satC ? 'Sat cond: ' + satC.temp_f + '\u00B0F\n' : '') +
      '\n' + _t('ht_ai_sa_response_format','Responde con:\n1. DIAGNÓSTICO (qué está pasando)\n2. CAUSAS PROBABLES (lista numerada)\n3. ACCIONES RECOMENDADAS (pasos)\n4. COMPONENTES A REVISAR');
    _htCallIA(prompt, 'htSAIAResult', 'htSAIABtn');
  };

  // ============================
  // TROUBLESHOOTING IA
  // ============================
  function _htShowTroubleshoot(s) {
    _htView = 'troubleshoot';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">Troubleshooting IA</div></div></div>';
    h += '<div style="padding:12px;">';
    // System type
    h += '<div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:6px;">' + _th('ht_ts_system_type', 'TIPO DE SISTEMA') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:10px;">';
    var sys = ['Split AC','Heat Pump','Mini Split','Package Unit','Refrig. Comercial','Walk-in'];
    for (var i = 0; i < sys.length; i++) {
      h += '<label style="display:block;padding:8px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.05);border-radius:8px;text-align:center;cursor:pointer;font-size:9px;font-weight:600;">';
      h += '<input type="radio" name="htTSType" value="' + sys[i] + '"' + (i===0?' checked':'') + ' style="display:none;" onchange="this.parentElement.parentElement.querySelectorAll(\'label\').forEach(function(l){l.style.borderColor=\'rgba(0,0,0,0.05)\';l.style.color=\'#3D3D3A\'});this.parentElement.style.borderColor=\'#ef4444\';this.parentElement.style.color=\'#0F0F0F\'" />' + sys[i] + '</label>';
    }
    h += '</div>';
    // Symptoms
    h += '<div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:6px;">' + _th('ht_ts_symptoms', 'S\u00CDNTOMAS (selecciona todos los que apliquen)') + '</div>';
    var symGroups = [
      { label: _th('ht_ts_cooling', 'Enfriamiento'), items: [_th('ht_ts_no_cool','No enfr\u00EDa'),_th('ht_ts_low_cool','Enfr\u00EDa poco'),'Short cycling',_th('ht_ts_evap_ice','Hielo en evaporador'),_th('ht_ts_suct_ice','Hielo en l\u00EDnea succi\u00F3n')] },
      { label: _th('ht_ts_pressures', 'Presiones'), items: [_th('ht_ts_high_suction','Succi\u00F3n alta'),_th('ht_ts_low_suction','Succi\u00F3n baja'),_th('ht_ts_high_discharge','Descarga alta'),_th('ht_ts_low_discharge','Descarga baja'),_th('ht_ts_fluctuating','Presiones fluctuando')] },
      { label: _th('ht_ts_electrical', 'El\u00E9ctrico'), items: [_th('ht_ts_no_start','No enciende'),_th('ht_ts_breaker_trip','Breaker se dispara'),_th('ht_ts_noisy_comp','Compresor ruidoso'),_th('ht_ts_fan_no_start','Ventilador no arranca'),_th('ht_ts_contactor','Contactor no cierra')] },
      { label: _th('ht_ts_other', 'Otros'), items: [_th('ht_ts_water_leak','Fuga de agua'),_th('ht_ts_strange_noise','Ruidos extra\u00F1os'),_th('ht_ts_bad_smell','Mal olor'),_th('ht_ts_vibrations','Vibraciones'),_th('ht_ts_high_consumption','Alto consumo')] }
    ];
    for (var g = 0; g < symGroups.length; g++) {
      h += '<div style="font-size:8px;color:#4b5563;font-weight:600;margin:6px 0 3px;text-transform:uppercase;">' + symGroups[g].label + '</div>';
      h += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;">';
      for (var si = 0; si < symGroups[g].items.length; si++) {
        var sym = symGroups[g].items[si];
        h += '<label style="display:flex;align-items:center;gap:3px;padding:4px 8px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.05);border-radius:6px;cursor:pointer;font-size:9px;">';
        h += '<input type="checkbox" class="htTSSym" value="' + sym + '" style="accent-color:#ef4444;" /> ' + sym + '</label>';
      }
      h += '</div>';
    }
    // IA button
    h += '<button id="htTSIABtn" onclick="_htTSDiagnose()" style="width:100%;padding:14px;margin-top:10px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#FFFFFF;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.3);">' + _th('ht_diagnose_ia', 'Diagnosticar con IA') + '</button>';
    h += '<div id="htTSIAResult" style="margin-top:8px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
    // Trigger first radio visual
    var firstRadio = s.querySelector('input[name="htTSType"]:checked');
    if (firstRadio) { firstRadio.parentElement.style.borderColor = '#ef4444'; firstRadio.parentElement.style.color = '#0F0F0F'; }
  }
  window._htTSDiagnose = function() {
    var typeEl = document.querySelector('input[name="htTSType"]:checked');
    var sysType = typeEl ? typeEl.value : 'Split AC';
    var checks = document.querySelectorAll('.htTSSym:checked');
    var symptoms = [];
    for (var i = 0; i < checks.length; i++) symptoms.push(checks[i].value);
    if (symptoms.length === 0) { var _msg = typeof _t === 'function' ? _t('ht_select_symptom') : 'Selecciona al menos un s\u00EDntoma'; if (typeof window.showToast === 'function') window.showToast(_msg, 'warning'); else window.MaestroDialog.alert({title: 'Atención', message: _msg, kind: 'warning'}); return; }
    var prompt = _t('ht_ai_ts_system_prompt','Eres un técnico HVAC master con 20+ años de experiencia. Un técnico en campo te reporta los siguientes síntomas en un sistema ') + sysType + ':\n\n' +
      _t('ht_ai_symptoms','Síntomas') + ': ' + symptoms.join(', ') + '\n\n' +
      _t('ht_ai_ts_response_format','Responde en español con:\n1. DIAGNÓSTICO MÁS PROBABLE\n2. CAUSAS SECUNDARIAS POSIBLES\n3. PASOS DE DIAGNÓSTICO para confirmar\n4. PROCEDIMIENTO DE REPARACIÓN\n5. HERRAMIENTAS Y PARTES necesarias\n6. ADVERTENCIAS DE SEGURIDAD');
    _htCallIA(prompt, 'htTSIAResult', 'htTSIABtn');
  };

  // ============================
  // SHARED IA CALL HELPER
  // ============================
  function _htCallIA(prompt, resultId, btnId) {
    var resultEl = document.getElementById(resultId);
    var btnEl = document.getElementById(btnId);
    if (!resultEl) return;
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = _th('ht_analyzing', 'Analizando...'); btnEl.style.opacity = '0.6'; }
    resultEl.innerHTML = '<div style="padding:16px;text-align:center;"><div style="display:inline-block;width:24px;height:24px;border:3px solid rgba(239,68,68,0.2);border-top-color:#ef4444;border-radius:50%;animation:htSpin 0.8s linear infinite;"></div><div style="margin-top:8px;font-size:10px;color:#4b5563;">' + _th('ht_consulting_ia', 'Consultando IA...') + '</div></div>';
    // Add spinner animation if not exists
    if (!document.getElementById('htSpinStyle')) {
      var st = document.createElement('style');
      st.id = 'htSpinStyle';
      st.textContent = '@keyframes htSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');
    // Get user session JWT for reliable auth (same pattern as ai-maestro-mario.js)
    var _getToken = (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth)
      ? supabaseClient.auth.getSession().then(function(s) { return (s && s.data && s.data.session) ? s.data.session.access_token : sbKey; }).catch(function() { return sbKey; })
      : Promise.resolve(sbKey);
    _getToken.then(function(_tk) {
    fetch(sbUrl + '/functions/v1/tutor-ia-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tk, 'apikey': sbKey },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], system: _t('ht_ai_system_msg','Eres un técnico HVAC master con 20+ años de experiencia. Responde siempre en español, de forma directa y profesional.'), max_tokens: 2048, email: localStorage.getItem('tecnico_email') || '' })
    }).then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) throw new Error(data.error);
      var text = data.reply || data.text || data.response || JSON.stringify(data);
      // Format the response
      text = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b style="color:#111827;">$1</b>').replace(/(\d+)\.\s/g, '<span style="color:#ef4444;font-weight:700;">$1.</span> ');
      resultEl.innerHTML = '<div style="padding:12px;background:#FFFFFF;border:1px solid #e5e7eb;border-radius:10px;font-size:10px;color:#374151;line-height:1.8;box-shadow:0 1px 3px rgba(0,0,0,0.08);">' +
        '<div style="font-size:11px;font-weight:800;color:#111827;margin-bottom:6px;">' + _th('ht_ia_diagnosis', 'Diagn\u00F3stico IA') + '</div>' + text + '</div>';
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = _th('ht_analyze_ia', 'Analizar con IA'); btnEl.style.opacity = '1'; }
    }).catch(function(err) {
      resultEl.innerHTML = '<div style="padding:10px;background:#FFFFFF;border:1px solid #e5e7eb;border-radius:8px;font-size:10px;color:#991b1b;">Error: ' + err.message + '. ' + _th('ht_verify_connection', 'Verifica tu conexi\u00F3n.') + '</div>';
      if (btnEl) { btnEl.disabled = false; btnEl.textContent = _th('ht_retry', 'Reintentar'); btnEl.style.opacity = '1'; }
    });
    }); // end _getToken
  }

  // ============================
  // PSYCHROMETRIC CHART (TABLA PSICROMÉTRICA)
  // ============================
  function _htShowPsychart(s) {
    _htView = 'psychart';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="font-size:16px;font-weight:800;color:#111827;">' + _th('ht_psy_title_full', 'Tabla Psicrom\u00E9trica') + '</div></div>';
    h += '<div style="font-size:9px;color:#4b5563;padding:0 4px;">' + _th('ht_psy_subtitle', 'Propiedades del aire h\u00FAmedo a presi\u00F3n atmosf\u00E9rica est\u00E1ndar (14.696 psia)') + '</div></div>';
    // Input section
    h += '<div style="padding:12px;">';
    h += '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;margin-bottom:12px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#60a5fa;margin-bottom:10px;">' + _th('ht_psy_enter_known', 'Ingrese datos conocidos (2 de 3)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:3px;">Dry Bulb (\u00B0F)</label>';
    h += '<input id="htPsyDB" type="number" step="0.1" placeholder="75" oninput="_htPsyCalc()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:3px;">Wet Bulb (\u00B0F)</label>';
    h += '<input id="htPsyWB" type="number" step="0.1" placeholder="62" oninput="_htPsyCalc()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:3px;">' + _th('ht_psy_rh', '% Humedad Rel.') + '</label>';
    h += '<input id="htPsyRH" type="number" step="1" min="0" max="100" placeholder="50" oninput="_htPsyCalc()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:13px;outline:none;box-sizing:border-box;"></div>';
    h += '</div></div>';
    // Results
    h += '<div id="htPsyResults" style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:14px;">';
    h += '<div style="text-align:center;color:#4b5563;font-size:11px;padding:20px;">' + _th('ht_psy_enter_db_wb', 'Ingrese Dry Bulb + Wet Bulb \u00F3 Dry Bulb + %RH para calcular') + '</div></div>';
    // Quick reference table
    h += '<div style="margin-top:12px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:14px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#60a5fa;margin-bottom:8px;">' + _th('ht_psy_typical_ranges', 'Rangos T\u00EDpicos HVAC') + '</div>';
    var ranges = [
      ['Confort Verano', '73-79\u00B0F DB', '50-60% RH', '55-63\u00B0F DP'],
      ['Confort Invierno', '68-76\u00B0F DB', '30-50% RH', '37-55\u00B0F DP'],
      ['Supply Air', '52-58\u00B0F DB', '85-95% RH', '50-56\u00B0F DP'],
      ['Data Center', '64-80\u00B0F DB', '20-80% RH', '41-59\u00B0F DP'],
      ['Hospital OR', '68-73\u00B0F DB', '30-60% RH', '36-57\u00B0F DP']
    ];
    h += '<div style="display:grid;grid-template-columns:1fr;gap:4px;">';
    for (var ri = 0; ri < ranges.length; ri++) {
      var r = ranges[ri];
      h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:4px;padding:5px 4px;background:rgba(0,0,0,0.02);border-radius:6px;font-size:9px;">';
      h += '<div style="color:#111827;font-weight:600;">' + r[0] + '</div>';
      h += '<div style="color:#60a5fa;">' + r[1] + '</div>';
      h += '<div style="color:#34d399;">' + r[2] + '</div>';
      h += '<div style="color:#fbbf24;">' + r[3] + '</div>';
      h += '</div>';
    }
    h += '</div></div>';
    h += '</div></div>';
    s.innerHTML = h;
  }

  // Psychrometric calculation functions
  function _psySatP(tF) {
    // Saturation pressure (psia) from °F — ASHRAE Fundamentals 2017 Ch.1
    var tC = (tF - 32) * 5 / 9;
    var tK = tC + 273.15;
    var C8 = -5.8002206e3, C9 = 1.3914993, C10 = -4.8640239e-2, C11 = 4.1764768e-5, C12 = -1.4452093e-8, C13 = 6.5459673;
    var lnPw = C8 / tK + C9 + C10 * tK + C11 * tK * tK + C12 * tK * tK * tK + C13 * Math.log(tK);
    return Math.exp(lnPw) / 6894.76; // Pa to psia
  }

  window._htPsyCalc = function() {
    var dbEl = document.getElementById('htPsyDB');
    var wbEl = document.getElementById('htPsyWB');
    var rhEl = document.getElementById('htPsyRH');
    var resEl = document.getElementById('htPsyResults');
    if (!resEl) return;
    var db = dbEl && dbEl.value !== '' ? parseFloat(dbEl.value) : null;
    var wb = wbEl && wbEl.value !== '' ? parseFloat(wbEl.value) : null;
    var rh = rhEl && rhEl.value !== '' ? parseFloat(rhEl.value) : null;
    var P = 14.696; // standard atmospheric pressure psia
    var RH, W, h_ent, dp, v, wb_calc;
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    if (db === null) { resEl.innerHTML = '<div style="text-align:center;color:#4b5563;font-size:11px;padding:20px;">' + _th('ht_psy_db_required', 'Se requiere Dry Bulb como m\u00EDnimo') + '</div>'; return; }
    var Pws_db = _psySatP(db);
    if (db !== null && rh !== null) {
      RH = rh / 100;
      var Pw = RH * Pws_db;
      W = 0.62198 * Pw / (P - Pw);
      h_ent = 0.240 * db + W * (1061 + 0.444 * db);
      if (Pw > 0) { dp = _psyDewPoint(Pw); } else { dp = -60; }
      wb_calc = _psyWetBulb(db, W, P);
    } else if (db !== null && wb !== null) {
      var Pws_wb = _psySatP(wb);
      var Ws_wb = 0.62198 * Pws_wb / (P - Pws_wb);
      W = ((1093 - 0.556 * wb) * Ws_wb - 0.240 * (db - wb)) / (1093 + 0.444 * db - wb);
      if (W < 0) W = 0;
      var Pw2 = W * P / (0.62198 + W);
      RH = Pw2 / Pws_db;
      h_ent = 0.240 * db + W * (1061 + 0.444 * db);
      dp = _psyDewPoint(Pw2);
      wb_calc = wb;
    } else {
      resEl.innerHTML = '<div style="text-align:center;color:#4b5563;font-size:11px;padding:20px;">' + _th('ht_psy_enter_db_rh', 'Ingrese DB + WB \u00F3 DB + %RH') + '</div>'; return;
    }
    // Specific volume
    var Pw_final = (RH || 0) * Pws_db;
    v = 0.370486 * (db + 459.67) * (1 + 1.6078 * W) / P; // ft³/lb
    // Grains of moisture
    var grains = W * 7000;
    // Build results display
    var rr = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    var props = [
      [_th('ht_psy_humidity_ratio', 'Humidity Ratio'), (W * 7000).toFixed(1) + ' gr/lb', '#60a5fa'],
      ['Dew Point', dp.toFixed(1) + '\u00B0F', '#fbbf24'],
      [_th('ht_psy_rel_humidity', 'Humedad Relativa'), (RH * 100).toFixed(1) + '%', '#34d399'],
      ['Wet Bulb', (wb_calc || wb || 0).toFixed(1) + '\u00B0F', '#c084fc'],
      [_th('ht_rg_enthalpy', 'Entalp\u00EDa'), h_ent.toFixed(2) + ' BTU/lb', '#f87171'],
      [_th('ht_psy_spec_vol', 'Vol. Espec\u00EDfico'), v.toFixed(2) + ' ft\u00B3/lb', '#fb923c'],
      ['lb H\u2082O / lb aire', W.toFixed(5), '#38bdf8'],
      ['Dry Bulb', db.toFixed(1) + '\u00B0F', '#0F0F0F']
    ];
    for (var pi = 0; pi < props.length; pi++) {
      var p = props[pi];
      rr += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:10px;text-align:center;">';
      rr += '<div style="font-size:8px;color:#4b5563;font-weight:600;margin-bottom:4px;">' + p[0] + '</div>';
      rr += '<div style="font-size:16px;font-weight:800;color:' + p[2] + ';">' + p[1] + '</div>';
      rr += '</div>';
    }
    rr += '</div>';
    // Comfort indicator
    var comfortMsg = '', comfortColor = '#3D3D3A';
    if (RH >= 0.30 && RH <= 0.60 && db >= 68 && db <= 79) { comfortMsg = _th('ht_psy_comfort_ok', 'Zona de Confort (\u2713)'); comfortColor = '#34d399'; }
    else if (RH > 0.60) { comfortMsg = _th('ht_psy_high_humidity', 'Humedad Alta \u2014 riesgo de moho'); comfortColor = '#f87171'; }
    else if (RH < 0.30) { comfortMsg = _th('ht_psy_low_humidity', 'Humedad Baja \u2014 aire seco, irritaci\u00F3n'); comfortColor = '#fbbf24'; }
    else if (db > 79) { comfortMsg = _th('ht_psy_high_temp', 'Temperatura Alta \u2014 fuera de confort'); comfortColor = '#fb923c'; }
    else if (db < 68) { comfortMsg = _th('ht_psy_low_temp', 'Temperatura Baja \u2014 fuera de confort'); comfortColor = '#60a5fa'; }
    if (comfortMsg) {
      rr += '<div style="margin-top:8px;padding:8px;background:' + comfortColor + '15;border:1px solid ' + comfortColor + '30;border-radius:8px;text-align:center;font-size:10px;font-weight:700;color:' + comfortColor + ';">' + comfortMsg + '</div>';
    }
    rr += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('psychart') : '';
    resEl.innerHTML = rr;
  };

  function _psyDewPoint(Pw) {
    // Dew point from partial pressure of water vapor (psia) → °F
    var Pw_pa = Pw * 6894.76;
    var alpha = Math.log(Pw_pa);
    var tDP_C = 6.54 + 14.526 * alpha + 0.7389 * alpha * alpha + 0.09486 * alpha * alpha * alpha + 0.4569 * Math.pow(Pw_pa, 0.1984);
    if (tDP_C < 0) tDP_C = 6.09 + 12.608 * alpha + 0.4959 * alpha * alpha;
    return tDP_C * 9 / 5 + 32;
  }

  function _psyWetBulb(db, W, P) {
    // Iterative wet bulb from DB and humidity ratio
    var lo = -60, hi = db, mid;
    for (var i = 0; i < 50; i++) {
      mid = (lo + hi) / 2;
      var Pws_mid = _psySatP(mid);
      var Ws_mid = 0.62198 * Pws_mid / (P - Pws_mid);
      var W_test = ((1093 - 0.556 * mid) * Ws_mid - 0.240 * (db - mid)) / (1093 + 0.444 * db - mid);
      if (W_test > W) hi = mid; else lo = mid;
    }
    return mid;
  }

  // ============================
  // MANÓMETRO INTERACTIVO — ESTACIÓN DE DIAGNÓSTICO COMPLETA
  // ============================
  function _htShowManifold(s, standalone) {
    _htView = 'manifold';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var backAction = standalone ? "showScreen('dashboardScreen')" : "_htBackToMenu()";
    // Auto-fill equipment/client/tech info from profile
    if (!window._htMfEquip) {
      var _techName = '', _techNum = '', _techEmail = '';
      try { var _tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        _techName = _tu.nombre || _tu.name || '';
        _techNum = _tu.technicianNumber || localStorage.getItem('tecnico_number_' + (_tu.email || '')) || localStorage.getItem('tecnico_number') || '';
        _techEmail = _tu.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._htMfEquip = { model:'', serial:'', clientName:'', clientAddr:'', techName: _techName, techNum: _techNum, techEmail: _techEmail };
    }
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="' + backAction + '" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:17px;font-weight:800;color:#111111;">' + _th('ht_mf_diag_title', 'Diagn\u00F3stico HVACR') + '</div>';
    h += '<div style="font-size:12px;color:#111111;font-weight:600;">' + _th('ht_mf_diag_subtitle', 'Estaci\u00F3n de diagn\u00F3stico en tiempo real') + '</div></div></div></div>';
    h += '<div style="padding:12px;">';
    // ---- EQUIPMENT / CLIENT / TECHNICIAN INFO ----
    var eq = window._htMfEquip || {};
    h += '<div style="background:rgba(168,85,247,0.06);border:1.5px solid rgba(168,85,247,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:16px;font-weight:800;color:#111111;letter-spacing:0.5px;margin-bottom:8px;border-left:3px solid #a855f7;padding-left:6px;">INFORMACI\u00D3N DEL SERVICIO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Modelo</label>';
    h += '<input id="htMfEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 24ACC636" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(168,85,247,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Serie</label>';
    h += '<input id="htMfEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 1234ABC567" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(168,85,247,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Nombre del Cliente</label>';
    h += '<input id="htMfEqClient" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Direcci\u00F3n</label>';
    h += '<input id="htMfEqAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 0.8fr 1.2fr;gap:8px;">';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">T\u00E9cnico</label>';
    h += '<input id="htMfEqTech" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;"># T\u00E9cnico</label>';
    h += '<input id="htMfEqTechNum" value="' + (eq.techNum||'') + '" placeholder="Lic/Cert #" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Email</label>';
    h += '<input id="htMfEqEmail" value="' + (eq.techEmail||'') + '" placeholder="email@ejemplo.com" oninput="_htMfSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:14px;font-weight:700;box-sizing:border-box;outline:none;" readonly></div>';
    h += '</div></div>';
    // ---- SYSTEM TYPE SELECTOR ----
    h += '<div style="margin-bottom:10px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:5px;letter-spacing:0.5px;">' + _th('ht_mf_system_type', 'TIPO DE SISTEMA') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">';
    var sysTypes = [
      ['ac', '\u2744\uFE0F', 'A/C Central'],
      ['mini', '\uD83C\uDF2C\uFE0F', 'Mini Split'],
      ['hp', '\uD83D\uDD04', 'Heat Pump'],
      ['mt', '\uD83E\uDDCA', 'Refrig. M/T'],
      ['lt', '\u2744\uFE0F', 'Freezer/L.T.'],
      ['ptac', '\uD83C\uDFE8', 'PTAC/Package']
    ];
    for (var sti = 0; sti < sysTypes.length; sti++) {
      var st = sysTypes[sti];
      var selSt = st[0] === 'ac' ? 'background:rgba(168,85,247,0.25);border-color:#a855f7;color:#111111;' : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htMfSys_' + st[0] + '" onclick="_htMfSetSys(\'' + st[0] + '\')" style="padding:8px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + selSt + '">' + st[1] + ' ' + st[2] + '</button>';
    }
    h += '</div></div>';
    // ---- REFRIGERANT SELECTOR ----
    h += '<div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;">';
    h += '<label style="font-size:13px;color:#111111;font-weight:700;white-space:nowrap;">' + _th('ht_refrigerant_label', 'Refrigerante') + ':</label>';
    h += '<select id="htMfRef" onchange="_htMfUpdate()" style="flex:1;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:14px;font-weight:700;outline:none;">';
    var ptKeys = window.PT_DATA ? Object.keys(window.PT_DATA) : [];
    for (var ki = 0; ki < ptKeys.length; ki++) {
      var sel = ptKeys[ki] === 'R-410A' ? ' selected' : '';
      h += '<option value="' + ptKeys[ki] + '"' + sel + '>' + ptKeys[ki] + '</option>';
    }
    h += '</select></div>';
    // ---- METERING DEVICE SELECTOR ----
    h += '<div style="margin-bottom:10px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:5px;letter-spacing:0.5px;">METERING DEVICE</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;">';
    var mDevices = [
      ['txv', 'TXV/TEV'],
      ['piston', 'Pist\u00F3n'],
      ['cap', 'Cap Tube'],
      ['eev', 'EEV']
    ];
    for (var mdi = 0; mdi < mDevices.length; mdi++) {
      var md = mDevices[mdi];
      var mSel = md[0] === 'txv' ? 'background:rgba(52,211,153,0.2);border-color:#34d399;color:#111111;' : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htMfMD_' + md[0] + '" onclick="_htMfSetMD(\'' + md[0] + '\')" style="padding:7px 2px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + mSel + '">' + md[1] + '</button>';
    }
    h += '</div>';
    h += '<div id="htMfMDInfo" style="margin-top:4px;font-size:12px;color:#111111;font-weight:600;">TXV: SH 8-12\u00B0F, SC se usa para verificar carga</div>';
    h += '</div>';
    // ---- DIGITAL PRESSURE DISPLAYS (Low + High) ----
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
    // LOW SIDE — digital LCD style
    h += '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:10px;text-align:center;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:6px;letter-spacing:0.5px;">LOW SIDE</div>';
    h += '<div style="background:#ffffff;border:1px solid rgba(59,130,246,0.25);border-radius:10px;padding:12px 6px;margin-bottom:6px;">';
    h += '<div id="htMfLoLCD" style="font-size:36px;font-weight:900;color:#111111;font-family:monospace;line-height:1;text-shadow:0 0 12px rgba(96,165,250,0.4);">118.0</div>';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;margin-top:2px;">PSIG</div></div>';
    h += '<input id="htMfLoPsi" type="range" min="0" max="350" value="118" oninput="_htMfSyncSlider(\'lo\')" style="width:100%;accent-color:#3b82f6;">';
    h += '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:4px;">';
    h += '<input id="htMfLoInput" type="number" value="118" oninput="_htMfSyncInput(\'lo\')" style="width:80px;background:#FFFFFF;color:#111111;border:1px solid rgba(59,130,246,0.3);border-radius:6px;padding:6px;font-size:15px;font-weight:900;text-align:center;outline:none;font-family:monospace;">';
    h += '<span style="font-size:12px;color:#111111;font-weight:700;">psig</span></div>';
    h += '<div style="font-size:13px;color:#111111;margin-top:4px;font-weight:700;" id="htMfLoTemp">--</div></div>';
    // HIGH SIDE — digital LCD style
    h += '<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:10px;text-align:center;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:6px;letter-spacing:0.5px;">HIGH SIDE</div>';
    h += '<div style="background:#ffffff;border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:12px 6px;margin-bottom:6px;">';
    h += '<div id="htMfHiLCD" style="font-size:36px;font-weight:900;color:#111111;font-family:monospace;line-height:1;text-shadow:0 0 12px rgba(248,113,113,0.4);">340.0</div>';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;margin-top:2px;">PSIG</div></div>';
    h += '<input id="htMfHiPsi" type="range" min="0" max="700" value="340" oninput="_htMfSyncSlider(\'hi\')" style="width:100%;accent-color:#ef4444;">';
    h += '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:4px;">';
    h += '<input id="htMfHiInput" type="number" value="340" oninput="_htMfSyncInput(\'hi\')" style="width:80px;background:#FFFFFF;color:#111111;border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:6px;font-size:15px;font-weight:900;text-align:center;outline:none;font-family:monospace;">';
    h += '<span style="font-size:12px;color:#111111;font-weight:700;">psig</span></div>';
    h += '<div style="font-size:13px;color:#111111;margin-top:4px;font-weight:700;" id="htMfHiTemp">--</div></div>';
    h += '</div>';
    // ---- SH / SC LIVE DISPLAY (below pressures) ----
    h += '<div id="htMfSHSCBar" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">';
    h += '<div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:8px;text-align:center;">';
    h += '<div style="font-size:15px;color:#111111;font-weight:800;letter-spacing:0.4px;">SUPERHEAT</div>';
    h += '<div id="htMfSHLive" style="font-size:22px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div id="htMfSHRange" style="font-size:12px;color:#111111;font-weight:700;">Rango: --</div></div>';
    h += '<div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;padding:8px;text-align:center;">';
    h += '<div style="font-size:15px;color:#111111;font-weight:800;letter-spacing:0.4px;">SUBCOOLING</div>';
    h += '<div id="htMfSCLive" style="font-size:22px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div id="htMfSCRange" style="font-size:12px;color:#111111;font-weight:700;">Rango: --</div></div>';
    h += '</div>';
    // ---- LIVE WEATHER CONDITIONS (from GPS + Open-Meteo) ----
    var _wx = window.MaestroWeather || {};
    var _wxReady = _wx.tempF !== null && _wx.tempF !== undefined;
    h += '<div style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.18);border-radius:12px;padding:10px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;letter-spacing:0.5px;">CONDICIONES EXTERIORES (GPS)</div>';
    h += '<div id="htMfWxCity" style="font-size:12px;color:#111111;font-weight:700;">' + (_wx.city || 'Ubicaci\u00F3n...') + '</div>';
    h += '</div>';
    if (_wxReady) {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;">';
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(56,189,248,0.1);">';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">TEMP</div>';
      h += '<div style="font-size:16px;font-weight:900;color:#111111;font-family:monospace;">' + (_wx.tempF !== null ? _wx.tempF.toFixed(1) : '--') + '</div>';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">\u00B0F</div></div>';
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(34,211,238,0.1);">';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">HUMEDAD</div>';
      h += '<div style="font-size:16px;font-weight:900;color:#111111;font-family:monospace;">' + (_wx.rhPct !== null && _wx.rhPct !== undefined ? Math.round(_wx.rhPct) : '--') + '</div>';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">%RH</div></div>';
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(251,191,36,0.1);">';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">VIENTO</div>';
      h += '<div style="font-size:16px;font-weight:900;color:#111111;font-family:monospace;">' + (_wx.windMph !== null && _wx.windMph !== undefined ? _wx.windMph.toFixed(0) : '--') + '</div>';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">mph</div></div>';
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(168,85,247,0.1);">';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">ELEVACI\u00D3N</div>';
      h += '<div style="font-size:16px;font-weight:900;color:#111111;font-family:monospace;">' + (_wx.elevationFt !== null && _wx.elevationFt !== undefined ? Math.round(_wx.elevationFt) : '--') + '</div>';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">ft</div></div>';
      h += '</div>';
    } else {
      h += '<div style="text-align:center;color:#111111;font-size:13px;font-weight:600;padding:6px;">Otorgue permiso de ubicaci\u00F3n para datos clim\u00E1ticos en vivo</div>';
    }
    h += '</div>';
    // ---- FIELD TEMPERATURES ----
    h += '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:8px;">' + _th('ht_mf_field_temps', 'TEMPERATURAS DE CAMPO (\u00B0F)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    var tempFields = [
      ['htMfSuctionT', 'Suction Line', '55', '#60a5fa', _th('ht_mf_suction_line', 'Temperatura l\u00EDnea de succi\u00F3n')],
      ['htMfLiquidT', 'Liquid Line', '95', '#f87171', _th('ht_mf_liquid_line', 'Temperatura l\u00EDnea de l\u00EDquido')],
      ['htMfOutdoorT', 'Outdoor Ambient', (_wxReady ? _wx.tempF.toFixed(1) : '95'), '#fb923c', _th('ht_mf_outdoor_ambient', 'Temperatura exterior ambiente')],
      ['htMfIndoorT', 'Indoor Return', '75', '#34d399', _th('ht_mf_indoor_return', 'Temperatura retorno interior')],
      ['htMfSupplyT', 'Supply Air', '55', '#38bdf8', _th('ht_mf_supply_air', 'Temperatura del aire de suministro')],
      ['htMfDeltaT', 'Delta-T (auto)', '--', '#c084fc', _th('ht_mf_delta_t_auto', 'Diferencia Return - Supply')],
      ['htMfIndoorRH', 'Indoor RH%', '--', '#22d3ee'],
      ['htMfDewPoint', 'Dew Point (\u00B0F)', '--', '#a78bfa']
    ];
    var _autoFields = {'htMfDeltaT':true,'htMfIndoorRH':true,'htMfDewPoint':true};
    for (var tfi = 0; tfi < tempFields.length; tfi++) {
      var tf = tempFields[tfi];
      var isAuto = !!_autoFields[tf[0]];
      h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">' + tf[1] + '</label>';
      if (isAuto) {
        h += '<div id="' + tf[0] + '" style="background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:7px;font-size:14px;font-weight:800;text-align:center;">--</div>';
      } else {
        h += '<input id="' + tf[0] + '" type="number" step="0.1" placeholder="' + tf[2] + '" oninput="_htMfUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:14px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;">';
      }
      h += '</div>';
    }
    h += '</div></div>';
    // ---- PSYCHROMETRIC DATA ----
    h += '<div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:8px;">' + _th('ht_mf_psy_data', 'DATOS PSICROM\u00C9TRICOS (INDOOR)') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Indoor Wet Bulb (\u00B0F)</label>';
    h += '<input id="htMfWetBulb" type="number" step="0.1" placeholder="62" oninput="_htMfUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:14px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Indoor RH% (opcional)</label>';
    h += '<input id="htMfRH" type="number" step="1" min="0" max="100" placeholder="50" oninput="_htMfUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:14px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;"></div>';
    h += '</div>';
    h += '<div id="htMfPsyResults" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">';
    h += '<div style="text-align:center;color:#111111;font-size:13px;font-weight:600;padding:8px;grid-column:span 3;">' + _th('ht_mf_enter_return_wb', 'Ingrese Return Air + Wet Bulb \u00F3 RH% para calcular') + '</div>';
    h += '</div></div>';
    // ---- JL3RH PSYCHROMETER LIVE DATA ----
    h += '<div id="htMfPsyLive" style="display:none;background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.18);border-radius:12px;padding:10px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<div style="width:7px;height:7px;border-radius:50%;background:#a855f7;box-shadow:0 0 6px #a855f7;animation:blePulse 1.2s ease-in-out infinite;"></div>';
    h += '<span style="font-size:15px;font-weight:800;color:#111111;letter-spacing:0.5px;">JL3RH PSYCHROMETER EN VIVO</span></div>';
    h += '<div id="htMfPsyBat" style="font-size:12px;color:#111111;font-weight:700;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;" id="htMfPsyLiveGrid"></div>';
    h += '</div>';
    // ---- SC680 ELECTRICAL DATA (auto-populated from BLE) ----
    h += '<div id="htMfElecSection" style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.18);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;letter-spacing:0.5px;">SC680 ELECTRICAL</div>';
    h += '<div id="htMfElecStatus" style="font-size:12px;color:#111111;font-weight:700;">Esperando SC680...</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    var elecFields = [
      ['htMfVoltage','Voltage (V)','230','#fbbf24'],
      ['htMfAmps','Amps (A)','--','#60a5fa'],
      ['htMfWatts','Watts','--','#f97316'],
      ['htMfCapuF','Cap (\u00B5F)','--','#c084fc'],
      ['htMfOhms','Ohms (\u03A9)','--','#34d399'],
      ['htMfTempF','Temp (\u00B0F)','--','#fb923c']
    ];
    for (var ei = 0; ei < elecFields.length; ei++) {
      var ef = elecFields[ei];
      h += '<div><label style="font-size:13px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">' + ef[1] + '</label>';
      h += '<input id="' + ef[0] + '" type="number" step="0.1" placeholder="' + ef[2] + '" readonly style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:6px;font-size:14px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;"></div>';
    }
    h += '</div></div>';
    // ---- COMPREHENSIVE AIR ANALYSIS (Entering / Leaving) ----
    h += '<div id="htMfAirAnalysis" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="font-size:16px;font-weight:900;color:#111111;letter-spacing:0.5px;">AN\u00C1LISIS DE AIRE COMPLETO</span></div>';
    h += '<div id="htMfAirStatus" style="font-size:12px;color:#111111;font-weight:700;">Manual / BLE</div>';
    h += '</div>';
    // Column headers
    h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:4px;margin-bottom:6px;">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;text-align:center;"></div>';
    h += '<div style="font-size:14px;color:#111111;font-weight:800;text-align:center;letter-spacing:0.5px;">ENTERING (Return)</div>';
    h += '<div style="font-size:14px;color:#111111;font-weight:800;text-align:center;letter-spacing:0.5px;">LEAVING (Supply)</div>';
    h += '</div>';
    // Air analysis rows
    var airRows = [
      ['Dry Bulb (\u00B0F)', 'htMfAirEnterDB', 'htMfAirLeaveDB', '#34d399'],
      ['Wet Bulb (\u00B0F)', 'htMfAirEnterWB', 'htMfAirLeaveWB', '#22d3ee'],
      ['Dew Point (\u00B0F)', 'htMfAirEnterDP', 'htMfAirLeaveDP', '#a78bfa'],
      ['RH %', 'htMfAirEnterRH', 'htMfAirLeaveRH', '#60a5fa'],
      ['Enthalpy (BTU/lb)', 'htMfAirEnterH', 'htMfAirLeaveH', '#c084fc'],
      ['Pressure (inWC)', 'htMfAirEnterWC', 'htMfAirLeaveWC', '#fbbf24']
    ];
    h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:4px;">';
    for (var ai = 0; ai < airRows.length; ai++) {
      var ar = airRows[ai];
      h += '<div style="font-size:13px;color:#111111;font-weight:700;display:flex;align-items:center;padding-left:4px;">' + ar[0] + '</div>';
      h += '<input id="' + ar[1] + '" type="number" step="0.01" placeholder="--" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:5px;font-size:14px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;" oninput="_htMfAirCalc()">';
      h += '<input id="' + ar[2] + '" type="number" step="0.01" placeholder="--" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:5px;font-size:14px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;" oninput="_htMfAirCalc()">';
    }
    h += '</div>';
    // Totals row
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(59,130,246,0.15);">';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px;border:1px solid rgba(192,132,252,0.15);">';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;letter-spacing:0.3px;">CALOR TOTAL (BTU/lb)</div>';
    h += '<div id="htMfTotalEnthalpy" style="font-size:18px;font-weight:900;color:#111111;font-family:monospace;">--</div>';
    h += '<div style="font-size:12px;color:#111111;font-weight:600;">Entering H \u2212 Leaving H</div></div>';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px;border:1px solid rgba(251,191,36,0.15);">';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;letter-spacing:0.3px;">TOTAL ESP (inWC)</div>';
    h += '<div id="htMfTotalESP" style="font-size:18px;font-weight:900;color:#111111;font-family:monospace;">--</div>';
    h += '<div style="font-size:12px;color:#111111;font-weight:600;">|Supply| + |Return|</div></div>';
    h += '</div></div>';
    // ---- ANALYSIS DASHBOARD ----
    h += '<div id="htMfAnalysis" style="margin-bottom:10px;"></div>';
    // ---- REAL-TIME DIAGNOSTICS ----
    h += '<div id="htMfDiag" style="margin-bottom:10px;"></div>';
    // ---- IA DEEP ANALYSIS BUTTON ----
    h += '<button id="htMfIABtn" onclick="_htMfIADiagnose()" style="width:100%;padding:14px;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;color:#fff;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:8px;">' + _th('ht_mf_deep_ia', 'Diagn\u00F3stico Profundo con IA') + '</button>';
    h += '<div id="htMfIA" style="margin-bottom:10px;"></div>';
    // ---- REFERENCE TABLE ----
    h += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:12px;">';
    h += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:6px;">' + _th('ht_mf_normal_ranges', 'Rangos Normales por Sistema') + '</div>';
    var norms = [
      ['A/C Central (R-410A)', 'SH: 8-14\u00B0F', 'SC: 8-14\u00B0F', 'CS: 15-25\u00B0F'],
      ['Mini Split', 'SH: 5-10\u00B0F', 'SC: 5-10\u00B0F', 'CS: 15-20\u00B0F'],
      ['Heat Pump (Cool)', 'SH: 8-14\u00B0F', 'SC: 8-14\u00B0F', 'CS: 15-25\u00B0F'],
      ['Refrig. M/T', 'SH: 6-12\u00B0F', 'SC: 3-8\u00B0F', 'TD: 10-20\u00B0F'],
      ['Freezer', 'SH: 4-10\u00B0F', 'SC: 3-6\u00B0F', 'TD: 10-15\u00B0F']
    ];
    h += '<div style="font-size:12px;color:#111111;font-weight:600;margin-bottom:4px;">SH=Superheat, SC=Subcooling, CS=Condenser Split, TD=Evap TD</div>';
    for (var ni = 0; ni < norms.length; ni++) {
      var n = norms[ni];
      h += '<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:3px;padding:4px;background:rgba(0,0,0,0.02);border-radius:5px;font-size:13px;margin-bottom:2px;">';
      h += '<div style="color:#111111;font-weight:700;">' + n[0] + '</div>';
      h += '<div style="color:#111111;font-weight:600;">' + n[1] + '</div>';
      h += '<div style="color:#111111;font-weight:600;">' + n[2] + '</div>';
      h += '<div style="color:#111111;font-weight:600;">' + n[3] + '</div>';
      h += '</div>';
    }
    h += '</div>';
    h += '</div></div>';
    s.innerHTML = h;
    window._htMfSysType = 'ac';
    // Auto-fill outdoor temp from GPS weather
    if (_wxReady) {
      var _oEl = document.getElementById('htMfOutdoorT');
      if (_oEl && !_oEl.value) {
        _oEl.value = _wx.tempF.toFixed(1);
        _oEl.style.boxShadow = '0 0 6px rgba(56,189,248,0.4)';
        _oEl.style.borderColor = 'rgba(56,189,248,0.3)';
      }
    }
    setTimeout(function() { _htMfUpdate(); }, 100);
  }

  // Sync slider → input → update
  window._htMfSyncSlider = function(side) {
    var slider = document.getElementById(side === 'lo' ? 'htMfLoPsi' : 'htMfHiPsi');
    var input = document.getElementById(side === 'lo' ? 'htMfLoInput' : 'htMfHiInput');
    if (slider && input) input.value = slider.value;
    _htMfUpdate();
  };
  window._htMfSyncInput = function(side) {
    var slider = document.getElementById(side === 'lo' ? 'htMfLoPsi' : 'htMfHiPsi');
    var input = document.getElementById(side === 'lo' ? 'htMfLoInput' : 'htMfHiInput');
    if (slider && input) slider.value = input.value;
    _htMfUpdate();
  };

  // System type selector
  window._htMfSetSys = function(type) {
    window._htMfSysType = type;
    var types = ['ac','mini','hp','mt','lt','ptac'];
    for (var i = 0; i < types.length; i++) {
      var btn = document.getElementById('htMfSys_' + types[i]);
      if (btn) {
        if (types[i] === type) {
          btn.style.background = 'rgba(168,85,247,0.25)';
          btn.style.borderColor = '#a855f7';
          btn.style.color = '#111111';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#111111';
        }
      }
    }
    _htMfUpdate();
  };

  // Metering device selector
  window._htMfSetMD = function(md) {
    window._htMfMeteringDevice = md;
    var types = ['txv','piston','cap','eev'];
    for (var i = 0; i < types.length; i++) {
      var btn = document.getElementById('htMfMD_' + types[i]);
      if (btn) {
        if (types[i] === md) {
          btn.style.background = 'rgba(52,211,153,0.2)';
          btn.style.borderColor = '#34d399';
          btn.style.color = '#111111';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#111111';
        }
      }
    }
    var info = document.getElementById('htMfMDInfo');
    var msgs = {
      txv: 'TXV: SH 8-12\u00B0F (controla SH), SC se usa para verificar carga',
      piston: 'Pist\u00F3n/Orificio: SH 10-20\u00B0F (var\u00EDa con condiciones), SC 5-10\u00B0F',
      cap: 'Cap Tube: SH 10-20\u00B0F, SC 5-10\u00B0F, carga cr\u00EDtica fija',
      eev: 'EEV: SH 5-8\u00B0F (control electr\u00F3nico preciso), SC 8-14\u00B0F'
    };
    if (info) { info.textContent = msgs[md] || ''; }
    _htMfUpdate();
  };

  // Enthalpy calculation from Dry Bulb + RH (or WB)
  // h = 0.240 * T_db + W * (1061 + 0.444 * T_db) [BTU/lb dry air]
  function _calcEnthalpy(dbF, rhPct) {
    if (dbF === null || rhPct === null || isNaN(dbF) || isNaN(rhPct)) return null;
    var tC = (dbF - 32) * 5 / 9;
    var es = 6.112 * Math.exp(17.67 * tC / (tC + 243.5)); // saturation vapor pressure (mbar)
    var e = (rhPct / 100) * es;
    var ePsi = e * 0.0145038; // convert mbar to psi
    var W = 0.62198 * ePsi / (14.696 - ePsi); // humidity ratio lb/lb
    return 0.240 * dbF + W * (1061 + 0.444 * dbF);
  }
  // Estimate RH from DB + WB (Sprung formula approximation)
  function _rhFromWB(dbF, wbF) {
    if (dbF === null || wbF === null || isNaN(dbF) || isNaN(wbF)) return null;
    var tC = (dbF - 32) * 5 / 9;
    var twC = (wbF - 32) * 5 / 9;
    var esDB = 6.112 * Math.exp(17.67 * tC / (tC + 243.5));
    var esWB = 6.112 * Math.exp(17.67 * twC / (twC + 243.5));
    var e = esWB - 0.00066 * 1013.25 * (tC - twC) * (1 + 0.00115 * twC);
    var rh = (e / esDB) * 100;
    return Math.max(0, Math.min(100, rh));
  }
  // Dew point from DB + RH (Magnus formula)
  function _dpFromRH(dbF, rhPct) {
    if (dbF === null || rhPct === null || isNaN(dbF) || isNaN(rhPct) || rhPct <= 0) return null;
    var tC = (dbF - 32) * 5 / 9;
    var gamma = Math.log(rhPct / 100) + (17.67 * tC / (tC + 243.5));
    var dpC = 243.5 * gamma / (17.67 - gamma);
    return dpC * 9 / 5 + 32;
  }

  window._htMfAirCalc = function() {
    var enterDB = parseFloat(document.getElementById('htMfAirEnterDB') ? document.getElementById('htMfAirEnterDB').value : '');
    var enterWB = parseFloat(document.getElementById('htMfAirEnterWB') ? document.getElementById('htMfAirEnterWB').value : '');
    var enterRH = parseFloat(document.getElementById('htMfAirEnterRH') ? document.getElementById('htMfAirEnterRH').value : '');
    var enterDP = parseFloat(document.getElementById('htMfAirEnterDP') ? document.getElementById('htMfAirEnterDP').value : '');
    var leaveDB = parseFloat(document.getElementById('htMfAirLeaveDB') ? document.getElementById('htMfAirLeaveDB').value : '');
    var leaveWB = parseFloat(document.getElementById('htMfAirLeaveWB') ? document.getElementById('htMfAirLeaveWB').value : '');
    var leaveRH = parseFloat(document.getElementById('htMfAirLeaveRH') ? document.getElementById('htMfAirLeaveRH').value : '');
    var leaveDP = parseFloat(document.getElementById('htMfAirLeaveDP') ? document.getElementById('htMfAirLeaveDP').value : '');
    var enterWC = parseFloat(document.getElementById('htMfAirEnterWC') ? document.getElementById('htMfAirEnterWC').value : '');
    var leaveWC = parseFloat(document.getElementById('htMfAirLeaveWC') ? document.getElementById('htMfAirLeaveWC').value : '');

    // If we have DB+WB but no RH, estimate RH
    if (!isNaN(enterDB) && !isNaN(enterWB) && isNaN(enterRH)) {
      enterRH = _rhFromWB(enterDB, enterWB);
      var el = document.getElementById('htMfAirEnterRH');
      if (el && enterRH !== null) { el.value = enterRH.toFixed(1); el.style.color = '#111111'; }
    }
    if (!isNaN(leaveDB) && !isNaN(leaveWB) && isNaN(leaveRH)) {
      leaveRH = _rhFromWB(leaveDB, leaveWB);
      var el2 = document.getElementById('htMfAirLeaveRH');
      if (el2 && leaveRH !== null) { el2.value = leaveRH.toFixed(1); el2.style.color = '#111111'; }
    }
    // If we have DB+RH but no DP, calculate dew point
    if (!isNaN(enterDB) && !isNaN(enterRH) && isNaN(enterDP)) {
      enterDP = _dpFromRH(enterDB, enterRH);
      var dpEl = document.getElementById('htMfAirEnterDP');
      if (dpEl && enterDP !== null) { dpEl.value = enterDP.toFixed(1); dpEl.style.color = '#111111'; }
    }
    if (!isNaN(leaveDB) && !isNaN(leaveRH) && isNaN(leaveDP)) {
      leaveDP = _dpFromRH(leaveDB, leaveRH);
      var dpEl2 = document.getElementById('htMfAirLeaveDP');
      if (dpEl2 && leaveDP !== null) { dpEl2.value = leaveDP.toFixed(1); dpEl2.style.color = '#111111'; }
    }

    // Calculate enthalpy
    var hEnter = _calcEnthalpy(enterDB, enterRH);
    var hLeave = _calcEnthalpy(leaveDB, leaveRH);
    var hEnterEl = document.getElementById('htMfAirEnterH');
    var hLeaveEl = document.getElementById('htMfAirLeaveH');
    if (hEnterEl && hEnter !== null) { hEnterEl.value = hEnter.toFixed(2); hEnterEl.style.color = '#111111'; }
    if (hLeaveEl && hLeave !== null) { hLeaveEl.value = hLeave.toFixed(2); hLeaveEl.style.color = '#111111'; }

    // Total Enthalpy (Calor Total) = Entering - Leaving (cooling removes heat)
    var totalH = document.getElementById('htMfTotalEnthalpy');
    if (totalH) {
      if (hEnter !== null && hLeave !== null) {
        var diff = hEnter - hLeave;
        totalH.textContent = diff.toFixed(2);
        totalH.style.color = '#111111';
      } else { totalH.textContent = '--'; totalH.style.color = '#111111'; }
    }
    // Total ESP = |supply WC| + |return WC|
    var totalESP = document.getElementById('htMfTotalESP');
    if (totalESP) {
      if (!isNaN(enterWC) && !isNaN(leaveWC)) {
        totalESP.textContent = (Math.abs(enterWC) + Math.abs(leaveWC)).toFixed(3);
      } else { totalESP.textContent = '--'; totalESP.style.color = '#111111'; }
    }
  };

  window._htMfUpdate = function() {
    var ref = document.getElementById('htMfRef');
    if (!ref) return;
    var refName = ref.value;
    var loInput = document.getElementById('htMfLoInput');
    var hiInput = document.getElementById('htMfHiInput');
    var loPsi = loInput ? parseFloat(loInput.value) || 0 : 0;
    var hiPsi = hiInput ? parseFloat(hiInput.value) || 0 : 0;
    // Update digital LCD displays
    var loLCD = document.getElementById('htMfLoLCD');
    var hiLCD = document.getElementById('htMfHiLCD');
    if (loLCD) { loLCD.textContent = loPsi.toFixed(1); }
    if (hiLCD) { hiLCD.textContent = hiPsi.toFixed(1); }
    // Reverse PT lookup
    var evapSat = _htReversePT(refName, loPsi);
    var condSat = _htReversePT(refName, hiPsi);
    var loTempEl = document.getElementById('htMfLoTemp');
    var hiTempEl = document.getElementById('htMfHiTemp');
    if (loTempEl) loTempEl.textContent = evapSat !== null ? 'Sat: ' + evapSat.toFixed(1) + '\u00B0F' : _th('ht_out_of_range', 'Fuera de rango');
    if (hiTempEl) hiTempEl.textContent = condSat !== null ? 'Sat: ' + condSat.toFixed(1) + '\u00B0F' : _th('ht_out_of_range', 'Fuera de rango');
    // Read field temperatures
    var suctionT = _htMfGetVal('htMfSuctionT');
    var liquidT = _htMfGetVal('htMfLiquidT');
    var outdoorT = _htMfGetVal('htMfOutdoorT');
    var indoorT = _htMfGetVal('htMfIndoorT');
    var supplyT = _htMfGetVal('htMfSupplyT');
    // Auto-calc Delta-T
    var deltaEl = document.getElementById('htMfDeltaT');
    if (deltaEl) {
      if (indoorT !== null && supplyT !== null) {
        var dt = indoorT - supplyT;
        deltaEl.textContent = dt.toFixed(1) + '\u00B0F';
        deltaEl.style.color = '#111111';
      } else { deltaEl.textContent = '--'; deltaEl.style.color = '#111111'; }
    }
    // ---- DEW POINT + INDOOR RH (auto-calc display fields) ----
    var _dpEl = document.getElementById('htMfDewPoint');
    var _irhEl = document.getElementById('htMfIndoorRH');
    // Will be updated below after psychrometric calc
    // ---- PSYCHROMETRIC CALCULATIONS ----
    var psyEl = document.getElementById('htMfPsyResults');
    if (psyEl && indoorT !== null) {
      var wb = _htMfGetVal('htMfWetBulb');
      var rhInput = _htMfGetVal('htMfRH');
      var P = 14.696;
      var Pws_db = _psySatP(indoorT);
      var W = null, RH = null, dp_f = null, h_ent = null, grains = null, wb_calc = null;
      if (wb !== null) {
        var Pws_wb = _psySatP(wb);
        var Ws_wb = 0.62198 * Pws_wb / (P - Pws_wb);
        W = ((1093 - 0.556 * wb) * Ws_wb - 0.240 * (indoorT - wb)) / (1093 + 0.444 * indoorT - wb);
        if (W < 0) W = 0;
        var Pw2 = W * P / (0.62198 + W);
        RH = Pw2 / Pws_db;
        h_ent = 0.240 * indoorT + W * (1061 + 0.444 * indoorT);
        dp_f = _psyDewPoint(Pw2);
        grains = W * 7000;
        wb_calc = wb;
      } else if (rhInput !== null) {
        RH = rhInput / 100;
        var Pw = RH * Pws_db;
        W = 0.62198 * Pw / (P - Pw);
        h_ent = 0.240 * indoorT + W * (1061 + 0.444 * indoorT);
        dp_f = Pw > 0 ? _psyDewPoint(Pw) : -60;
        grains = W * 7000;
        wb_calc = _psyWetBulb(indoorT, W, P);
      }
      if (W !== null) {
        // Update dew point + indoor RH display in field temps section
        if (_dpEl) { _dpEl.textContent = dp_f.toFixed(1) + '\u00B0F'; _dpEl.style.color = '#111111'; }
        if (_irhEl) { _irhEl.textContent = (RH * 100).toFixed(1) + '%'; _irhEl.style.color = '#111111'; }
        var ph = '';
        var psyData = [
          ['Dry Bulb', indoorT.toFixed(1) + '\u00B0F', '#111111'],
          ['Wet Bulb', (wb_calc || 0).toFixed(1) + '\u00B0F', '#111111'],
          ['Dew Point', dp_f.toFixed(1) + '\u00B0F', '#111111'],
          ['RH%', (RH * 100).toFixed(1) + '%', '#111111'],
          ['Grains/lb', grains.toFixed(1), '#111111'],
          ['Entalp\u00EDa', h_ent.toFixed(2) + ' BTU/lb', '#111111']
        ];
        for (var psi = 0; psi < psyData.length; psi++) {
          var pd = psyData[psi];
          ph += '<div style="background:rgba(0,0,0,0.03);border-radius:6px;padding:5px;text-align:center;">';
          ph += '<div style="font-size:13px;color:#111111;font-weight:700;">' + pd[0] + '</div>';
          ph += '<div style="font-size:14px;font-weight:800;color:' + pd[2] + ';">' + pd[1] + '</div></div>';
        }
        psyEl.innerHTML = ph;
      } else {
        psyEl.innerHTML = '<div style="text-align:center;color:#111111;font-size:13px;font-weight:600;padding:8px;grid-column:span 3;">Ingrese Wet Bulb \u00F3 RH% para calcular</div>';
      }
    }
    // Calculate all diagnostics
    var sh = null, sc = null, cr = null, condSplit = null, evapSplit = null, tdCondEvap = null;
    if (evapSat !== null && suctionT !== null) sh = suctionT - evapSat;
    if (condSat !== null && liquidT !== null) sc = condSat - liquidT;
    if (loPsi > 0) cr = (hiPsi + 14.696) / (loPsi + 14.696);
    if (condSat !== null && outdoorT !== null) condSplit = condSat - outdoorT;
    if (indoorT !== null && evapSat !== null) evapSplit = indoorT - evapSat;
    if (condSat !== null && evapSat !== null) tdCondEvap = condSat - evapSat;
    // ---- SH/SC LIVE DISPLAY (below pressures) ----
    var mdType = window._htMfMeteringDevice || 'txv';
    var shRanges = { txv: [8,12], piston: [10,20], cap: [10,20], eev: [5,8] };
    var scRanges = { txv: [8,14], piston: [5,10], cap: [5,10], eev: [8,14] };
    var shR = shRanges[mdType] || [8,12];
    var scR = scRanges[mdType] || [8,14];
    var shLive = document.getElementById('htMfSHLive');
    var scLive = document.getElementById('htMfSCLive');
    var shRange = document.getElementById('htMfSHRange');
    var scRange = document.getElementById('htMfSCRange');
    if (shLive) {
      if (sh !== null) {
        shLive.textContent = sh.toFixed(1) + '\u00B0F';
        shLive.style.color = '#111111';
      } else { shLive.textContent = '--'; shLive.style.color = '#111111'; }
    }
    if (scLive) {
      if (sc !== null) {
        scLive.textContent = sc.toFixed(1) + '\u00B0F';
        scLive.style.color = '#111111';
      } else { scLive.textContent = '--'; scLive.style.color = '#111111'; }
    }
    if (shRange) shRange.textContent = mdType.toUpperCase() + ': ' + shR[0] + '-' + shR[1] + '\u00B0F';
    if (scRange) scRange.textContent = mdType.toUpperCase() + ': ' + scR[0] + '-' + scR[1] + '\u00B0F';
    // Store calculated values globally for the report
    window._htMfCalcValues = {
      sh: sh, sc: sc, cr: cr, condSplit: condSplit, evapSplit: evapSplit, td: tdCondEvap,
      evapSat: evapSat, condSat: condSat, loPsi: loPsi, hiPsi: hiPsi,
      suctionT: suctionT, liquidT: liquidT, outdoorT: outdoorT, indoorT: indoorT, supplyT: supplyT,
      refrigerant: refName, meteringDevice: mdType
    };
    // ---- ANALYSIS DASHBOARD ----
    var analysisEl = document.getElementById('htMfAnalysis');
    if (analysisEl) {
      var ah = '<div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:12px;">';
      ah += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:8px;">AN\u00C1LISIS DEL SISTEMA</div>';
      ah += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">';
      // Row 1: Superheat, Subcooling, Compression Ratio (metering device aware)
      var shLabel = 'SH (' + mdType.toUpperCase() + ')';
      var scLabel = 'SC (' + mdType.toUpperCase() + ')';
      ah += _mfStatBox(shLabel, sh, '\u00B0F', '#111111');
      ah += _mfStatBox(scLabel, sc, '\u00B0F', '#111111');
      ah += _mfStatBox('COMP. RATIO', cr !== null ? cr.toFixed(2) + ':1' : null, '', '#111111');
      // Row 2: Condenser Split, Evap Split, TD
      ah += _mfStatBox('COND. SPLIT', condSplit, '\u00B0F', '#111111');
      ah += _mfStatBox('EVAP. SPLIT', evapSplit, '\u00B0F', '#111111');
      ah += _mfStatBox('TD', tdCondEvap, '\u00B0F', '#111111');
      // Row 3: Sat temps
      ah += _mfStatBox('EVAP SAT', evapSat, '\u00B0F', '#111111');
      ah += _mfStatBox('COND SAT', condSat, '\u00B0F', '#111111');
      var dtVal = (indoorT !== null && supplyT !== null) ? indoorT - supplyT : null;
      ah += _mfStatBox('DELTA-T', dtVal, '\u00B0F', '#111111');
      ah += '</div></div>';
      analysisEl.innerHTML = ah;
    }
    // ---- REAL-TIME DIAGNOSTICS ----
    var diagEl = document.getElementById('htMfDiag');
    if (diagEl) {
      var sysType = window._htMfSysType || 'ac';
      var diags = _htMfDiagnoseSystem(sysType, refName, loPsi, hiPsi, evapSat, condSat, sh, sc, cr, condSplit, evapSplit, outdoorT, indoorT, supplyT);
      if (diags.length > 0) {
        var dh = '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:12px;">';
        dh += '<div style="font-size:15px;font-weight:800;color:#111111;margin-bottom:6px;">DIAGN\u00D3STICO EN TIEMPO REAL</div>';
        for (var di = 0; di < diags.length; di++) {
          var d = diags[di];
          var ic = d[0] === 'error' ? '#f87171' : d[0] === 'warn' ? '#fbbf24' : '#34d399';
          var sym = d[0] === 'error' ? '\u274C' : d[0] === 'warn' ? '\u26A0\uFE0F' : '\u2705';
          dh += '<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:5px;padding:6px;background:' + ic + '10;border-radius:6px;">';
          dh += '<span style="font-size:12px;flex-shrink:0;">' + sym + '</span>';
          dh += '<div><div style="font-size:13px;font-weight:800;color:#111111;">' + d[1] + '</div>';
          dh += '<div style="font-size:12px;color:#111111;font-weight:600;margin-top:1px;">' + d[2] + '</div></div></div>';
        }
        dh += '</div>';
        dh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('manifold') : '';
        diagEl.innerHTML = dh;
      } else {
        diagEl.innerHTML = '<div style="text-align:center;color:#111111;font-size:13px;font-weight:600;padding:8px;">Ingrese presiones y temperaturas para diagn\u00F3stico</div>';
      }
    }
  };

  function _mfStatBox(label, val, unit, color) {
    var display = val !== null ? (typeof val === 'string' ? val : val.toFixed(1) + unit) : '--';
    return '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:7px 4px;text-align:center;">' +
      '<div style="font-size:12px;color:#111111;font-weight:700;letter-spacing:0.3px;">' + label + '</div>' +
      '<div style="font-size:15px;font-weight:900;color:' + color + ';margin-top:2px;">' + display + '</div></div>';
  }

  function _htMfGetVal(id) {
    var el = document.getElementById(id);
    if (!el || el.value === '') return null;
    return parseFloat(el.value);
  }

  // Real-time diagnostic engine
  function _htMfDiagnoseSystem(sysType, ref, loPsi, hiPsi, evapSat, condSat, sh, sc, cr, condSplit, evapSplit, outdoorT, indoorT, supplyT) {
    var d = [];
    var isAC = sysType === 'ac' || sysType === 'mini' || sysType === 'hp' || sysType === 'ptac';
    var isRefrig = sysType === 'mt' || sysType === 'lt';
    // Need at least pressures
    if (loPsi <= 0 && hiPsi <= 0) return d;
    // Metering device ranges
    var mdType = window._htMfMeteringDevice || 'txv';
    var mdLabels = { txv: 'TXV', piston: _t('ht_md_piston','Pistón'), cap: 'Cap Tube', eev: 'EEV' };
    var shNorm = { txv: [8,12], piston: [10,20], cap: [10,20], eev: [5,8] };
    var scNorm = { txv: [8,14], piston: [5,10], cap: [5,10], eev: [8,14] };
    var shMin = (shNorm[mdType] || [8,12])[0], shMax = (shNorm[mdType] || [8,12])[1];
    var scMin = (scNorm[mdType] || [8,14])[0], scMax = (scNorm[mdType] || [8,14])[1];
    var mdLabel = mdLabels[mdType] || 'TXV';
    // Superheat analysis (metering device aware)
    if (sh !== null) {
      if (sh < 3) d.push(['error', _t('ht_diag_sh_very_low','Superheat muy bajo') + ' (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ']', _t('ht_diag_sh_very_low_desc','Riesgo de flood-back al compresor. Posible sobrecarga de refrigerante, ') + mdLabel + _t('ht_diag_sh_very_low_desc2',' abierto, o baja carga de aire en evaporador.')]);
      else if (sh > shMax + 10) d.push(['error', _t('ht_diag_sh_very_high','Superheat muy alto') + ' (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']', _t('ht_diag_sh_very_high_desc','Evaporador hambriento. Posible baja carga, restricción en línea de líquido, ') + mdLabel + _t('ht_diag_sh_very_high_desc2',' tapado, o filtro drier obstruido.')]);
      else if (sh > shMax) d.push(['warn', _t('ht_diag_sh_high','Superheat elevado') + ' (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']', _t('ht_diag_sh_high_desc','Por encima del rango normal para ') + mdLabel + _t('ht_diag_sh_high_desc2','. Verificar carga y flujo de aire.')]);
      else if (sh < shMin) d.push(['warn', _t('ht_diag_sh_low','Superheat bajo') + ' (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']', _t('ht_diag_sh_low_desc','Por debajo del rango normal para ') + mdLabel + _t('ht_diag_sh_low_desc2','. Verificar ') + mdLabel + _t('ht_diag_sh_low_desc3',' y carga.')]);
      else d.push(['ok', _t('ht_diag_sh_normal','Superheat normal') + ' (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']', _t('ht_diag_sh_normal_desc','Dentro del rango aceptable para ') + mdLabel + '.']);
    }
    // Subcooling analysis (metering device aware)
    if (sc !== null) {
      if (sc < 2) d.push(['error', _t('ht_diag_sc_very_low','Subcooling muy bajo') + ' (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']', _t('ht_diag_sc_very_low_desc','Posible baja carga de refrigerante o flash gas en línea de líquido.')]);
      else if (sc > scMax + 6) d.push(['error', _t('ht_diag_sc_very_high','Subcooling muy alto') + ' (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']', _t('ht_diag_sc_very_high_desc','Posible sobrecarga, restricción después del condensador, o condensador sobredimensionado.')]);
      else if (sc > scMax) d.push(['warn', _t('ht_diag_sc_high','Subcooling elevado') + ' (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']', _t('ht_diag_sc_high_desc','Un poco alto para ') + mdLabel + _t('ht_diag_sc_high_desc2','. Verificar carga y condensador.')]);
      else if (sc >= scMin && sc <= scMax) d.push(['ok', _t('ht_diag_sc_normal','Subcooling normal') + ' (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']', _t('ht_diag_sc_normal_desc','Condensador funcionando correctamente.')]);
    }
    // Compression ratio
    if (cr !== null) {
      if (cr > 5) d.push(['error', _t('ht_diag_cr_extreme','Compression ratio extremo') + ' (' + cr.toFixed(2) + ':1)', _t('ht_diag_cr_extreme_desc','Estrés severo en compresor. Verificar presiones, filtro aire, y condensador.')]);
      else if (cr > 4) d.push(['warn', _t('ht_diag_cr_high','Compression ratio alto') + ' (' + cr.toFixed(2) + ':1)', _t('ht_diag_cr_high_desc','Compresor trabajando duro. Normal: 2.5-3.5:1 para A/C.')]);
      else if (cr < 1.5 && cr > 0) d.push(['warn', _t('ht_diag_cr_low','Compression ratio bajo') + ' (' + cr.toFixed(2) + ':1)', _t('ht_diag_cr_low_desc','Verificar si el compresor está funcionando.')]);
    }
    // Condenser split
    if (condSplit !== null && isAC) {
      if (condSplit > 35) d.push(['error', _t('ht_diag_cs_high','Condenser split alto') + ' (' + condSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_cs_high_desc','Condensador sucio, ventilador defectuoso, o sobrecarga de refrigerante. Normal: 15-25°F.')]);
      else if (condSplit > 25) d.push(['warn', _t('ht_diag_cs_elevated','Condenser split elevado') + ' (' + condSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_cs_elevated_desc','Condensador puede necesitar limpieza. Normal: 15-25°F.')]);
      else if (condSplit < 10) d.push(['warn', _t('ht_diag_cs_low','Condenser split bajo') + ' (' + condSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_cs_low_desc','Posible baja carga o compresor débil.')]);
      else d.push(['ok', _t('ht_diag_cs_normal','Condenser split normal') + ' (' + condSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_cs_normal_desc','Condensador funcionando bien: 15-25°F.')]);
    }
    // Evaporator split (Indoor - Evap Sat)
    if (evapSplit !== null && isAC) {
      if (evapSplit > 45) d.push(['warn', _t('ht_diag_es_high','Evaporator split alto') + ' (' + evapSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_es_high_desc','Posible bajo flujo de aire, filtro sucio, o baja carga.')]);
      else if (evapSplit < 20) d.push(['warn', _t('ht_diag_es_low','Evaporator split bajo') + ' (' + evapSplit.toFixed(1) + '\u00B0F)', _t('ht_diag_es_low_desc','Evaporador puede estar sobredimensionado o alta carga de refrigerante.')]);
    }
    // Delta-T
    if (indoorT !== null && supplyT !== null && isAC) {
      var deltaT = indoorT - supplyT;
      if (deltaT < 14) d.push(['warn', _t('ht_diag_dt_low','Delta-T bajo') + ' (' + deltaT.toFixed(1) + '\u00B0F)', _t('ht_diag_dt_low_desc','Baja capacidad. Normal: 14-22°F. Verificar carga, airflow, y metering device.')]);
      else if (deltaT > 24) d.push(['warn', _t('ht_diag_dt_high','Delta-T alto') + ' (' + deltaT.toFixed(1) + '\u00B0F)', _t('ht_diag_dt_high_desc','Flujo de aire bajo. Verificar filtro, blower, y ductwork.')]);
      else d.push(['ok', _t('ht_diag_dt_normal','Delta-T normal') + ' (' + deltaT.toFixed(1) + '\u00B0F)', _t('ht_diag_dt_normal_desc','Rango correcto: 14-22°F.')]);
    }
    // Evap sat too low (freezing risk)
    if (evapSat !== null && isAC) {
      if (evapSat < 25) d.push(['error', _t('ht_diag_evap_freeze','Evaporador en riesgo de congelamiento') + ' (Sat: ' + evapSat.toFixed(1) + '\u00B0F)', _t('ht_diag_evap_freeze_desc','Sat temp bajo 32°F = hielo. Verificar airflow, filtro, blower, y carga.')]);
    }
    // Cond sat too high
    if (condSat !== null) {
      if (condSat > 150) d.push(['error', _t('ht_diag_cond_excessive','Temp condensación excesiva') + ' (Sat: ' + condSat.toFixed(1) + '\u00B0F)', _t('ht_diag_cond_excessive_desc','Posible condensador bloqueado, non-condensables, o sobrecarga severa.')]);
    }
    // Combined: High SH + Low SC = low charge
    if (sh !== null && sc !== null) {
      if (sh > 15 && sc < 5) d.push(['error', _t('ht_diag_sh_high_sc_low','SH alto + SC bajo = BAJA CARGA'), _t('ht_diag_sh_high_sc_low_desc','Patrón clásico de fuga o baja carga de refrigerante. Realizar leak test.')]);
      if (sh < 5 && sc > 15) d.push(['error', _t('ht_diag_sh_low_sc_high','SH bajo + SC alto = SOBRECARGA'), _t('ht_diag_sh_low_sc_high_desc','Exceso de refrigerante. Recuperar refrigerante hasta alcanzar valores normales.')]);
      if (sh > 15 && sc > 15) d.push(['warn', _t('ht_diag_sh_high_sc_high','SH alto + SC alto = RESTRICCIÓN'), _t('ht_diag_sh_high_sc_high_desc','Posible restricción en línea de líquido, filtro drier tapado, o TXV parcialmente cerrada.')]);
      if (sh < 5 && sc < 5) d.push(['warn', _t('ht_diag_sh_low_sc_low','SH bajo + SC bajo'), _t('ht_diag_sh_low_sc_low_desc','Verificar metering device y flujo de aire. Posible TXV stuck open con baja carga.')]);
    }
    return d;
  }

  // Save equipment/client/tech info
  window._htMfSaveEquip = function() {
    var eq = window._htMfEquip;
    if (!eq) return;
    var m = document.getElementById('htMfEqModel');
    var s = document.getElementById('htMfEqSerial');
    var c = document.getElementById('htMfEqClient');
    var a = document.getElementById('htMfEqAddr');
    var t = document.getElementById('htMfEqTech');
    var tn = document.getElementById('htMfEqTechNum');
    if (m) eq.model = m.value;
    if (s) eq.serial = s.value;
    if (c) eq.clientName = c.value;
    if (a) eq.clientAddr = a.value;
    if (t) eq.techName = t.value;
    if (tn) eq.techNum = tn.value;
  };

  // IA Deep Diagnosis — reads ALL populated fields before diagnosing
  window._htMfIADiagnose = function() {
    var ref = document.getElementById('htMfRef');
    var loInput = document.getElementById('htMfLoInput');
    var hiInput = document.getElementById('htMfHiInput');
    if (!ref) return;
    var refName = ref.value;
    var loPsi = loInput ? parseFloat(loInput.value) || 0 : 0;
    var hiPsi = hiInput ? parseFloat(hiInput.value) || 0 : 0;
    var evapSat = _htReversePT(refName, loPsi);
    var condSat = _htReversePT(refName, hiPsi);
    var suctionT = _htMfGetVal('htMfSuctionT');
    var liquidT = _htMfGetVal('htMfLiquidT');
    var outdoorT = _htMfGetVal('htMfOutdoorT');
    var indoorT = _htMfGetVal('htMfIndoorT');
    var supplyT = _htMfGetVal('htMfSupplyT');
    var sysType = window._htMfSysType || 'ac';
    var sysLabels = { ac: 'A/C Central', mini: 'Mini Split', hp: 'Heat Pump', mt: 'Refrigeraci\u00F3n Media Temperatura', lt: 'Freezer/Baja Temperatura', ptac: 'PTAC/Package Unit' };
    var sh = (evapSat !== null && suctionT !== null) ? suctionT - evapSat : null;
    var sc = (condSat !== null && liquidT !== null) ? condSat - liquidT : null;
    var cr = loPsi > 0 ? (hiPsi + 14.696) / (loPsi + 14.696) : null;
    var condSplit = (condSat !== null && outdoorT !== null) ? condSat - outdoorT : null;
    var evapSplit = (evapSat !== null && indoorT !== null) ? indoorT - evapSat : null;
    var deltaT = (indoorT !== null && supplyT !== null) ? indoorT - supplyT : null;
    var mdType2 = window._htMfMeteringDevice || 'txv';
    var mdLabels2 = { txv: 'TXV', piston: 'Pist\u00F3n/Orificio', cap: 'Cap Tube', eev: 'EEV' };

    // Read ALL psychrometric data
    var wb2 = _htMfGetVal('htMfWetBulb');
    var rh2 = _htMfGetVal('htMfRH');
    var dpEl = document.getElementById('htMfDewPoint');
    var dpVal = dpEl ? dpEl.textContent || dpEl.innerText : null;
    if (dpVal === '--' || !dpVal) dpVal = null;
    var indoorRHEl = document.getElementById('htMfIndoorRH');
    var indoorRHVal = indoorRHEl ? indoorRHEl.textContent || indoorRHEl.innerText : null;
    if (indoorRHVal === '--' || !indoorRHVal) indoorRHVal = null;

    // Read SC680 electrical data
    var voltage = _htMfGetVal('htMfVoltage');
    var amps = _htMfGetVal('htMfAmps');
    var watts = _htMfGetVal('htMfWatts');
    var capuF = _htMfGetVal('htMfCapuF');
    var ohms = _htMfGetVal('htMfOhms');
    var tempF = _htMfGetVal('htMfTempF');

    // Read air analysis data
    var airEnterDB = _htMfGetVal('htMfAirEnterDB');
    var airLeaveDB = _htMfGetVal('htMfAirLeaveDB');
    var airEnterWB = _htMfGetVal('htMfAirEnterWB');
    var airLeaveWB = _htMfGetVal('htMfAirLeaveWB');
    var airEnterRH = _htMfGetVal('htMfAirEnterRH');
    var airLeaveRH = _htMfGetVal('htMfAirLeaveRH');
    var airEnterWC = _htMfGetVal('htMfAirEnterWC');
    var airLeaveWC = _htMfGetVal('htMfAirLeaveWC');
    var totalEnthEl = document.getElementById('htMfTotalEnthalpy');
    var totalEnth = totalEnthEl ? totalEnthEl.textContent || totalEnthEl.innerText : null;
    if (totalEnth === '--' || !totalEnth) totalEnth = null;
    var totalESPEl = document.getElementById('htMfTotalESP');
    var totalESP = totalESPEl ? totalESPEl.textContent || totalESPEl.innerText : null;
    if (totalESP === '--' || !totalESP) totalESP = null;

    // Read weather data
    var _wx = window.MaestroWeather || {};

    // Read equipment info
    var eqInfo = window._htMfEquip || {};

    // Build comprehensive prompt with ALL data
    var prompt = 'Eres un t\u00E9cnico HVAC master con 30 a\u00F1os de experiencia. Un t\u00E9cnico en campo te consulta sobre estas lecturas. IMPORTANTE: Analiza TODOS los datos proporcionados antes de dar tu diagn\u00F3stico. No ignores ninguna lectura.\n\n';

    // Equipment info
    prompt += 'EQUIPO:\n';
    prompt += '- Sistema: ' + (sysLabels[sysType] || sysType) + '\n';
    prompt += '- Refrigerante: ' + refName + '\n';
    prompt += '- Metering Device: ' + (mdLabels2[mdType2] || 'TXV') + '\n';
    if (eqInfo.model) prompt += '- Modelo: ' + eqInfo.model + '\n';
    if (eqInfo.serial) prompt += '- Serial: ' + eqInfo.serial + '\n';

    // Pressures + sat temps
    prompt += '\nPRESIONES:\n- Low side: ' + loPsi + ' psig\n- High side: ' + hiPsi + ' psig\n';
    prompt += 'TEMPERATURAS SATURADAS:\n- Evap Sat: ' + (evapSat !== null ? evapSat.toFixed(1) + '\u00B0F' : 'N/A') + '\n- Cond Sat: ' + (condSat !== null ? condSat.toFixed(1) + '\u00B0F' : 'N/A') + '\n';

    // Field temps
    prompt += '\nTEMPERATURAS DE CAMPO:\n';
    prompt += '- Suction Line: ' + (suctionT !== null ? suctionT + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Liquid Line: ' + (liquidT !== null ? liquidT + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Outdoor Ambient: ' + (outdoorT !== null ? outdoorT + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Indoor Return: ' + (indoorT !== null ? indoorT + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Supply Air: ' + (supplyT !== null ? supplyT + '\u00B0F' : 'N/A') + '\n';

    // Calculations
    prompt += '\nC\u00C1LCULOS CLAVE:\n';
    prompt += '- Superheat: ' + (sh !== null ? sh.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Subcooling: ' + (sc !== null ? sc.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Compression Ratio: ' + (cr !== null ? cr.toFixed(2) + ':1' : 'N/A') + '\n';
    prompt += '- Condenser Split: ' + (condSplit !== null ? condSplit.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Evaporator Split: ' + (evapSplit !== null ? evapSplit.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
    prompt += '- Delta-T (Return-Supply): ' + (deltaT !== null ? deltaT.toFixed(1) + '\u00B0F' : 'N/A') + '\n';

    // Psychrometric data
    var hasPsy = wb2 !== null || rh2 !== null || dpVal || indoorRHVal;
    if (hasPsy) {
      prompt += '\nPSICROM\u00C9TRICOS:\n';
      if (wb2 !== null) prompt += '- Indoor Wet Bulb: ' + wb2 + '\u00B0F\n';
      if (rh2 !== null) prompt += '- Indoor RH (manual): ' + rh2 + '%\n';
      if (indoorRHVal) prompt += '- Indoor RH (calculado): ' + indoorRHVal + '\n';
      if (dpVal) prompt += '- Dew Point: ' + dpVal + '\n';
    }

    // Electrical data
    var hasElec = voltage !== null || amps !== null || watts !== null || capuF !== null || ohms !== null;
    if (hasElec) {
      prompt += '\nEL\u00C9CTRICOS (SC680):\n';
      if (voltage !== null) prompt += '- Voltaje: ' + voltage + ' V\n';
      if (amps !== null) prompt += '- Amperaje: ' + amps + ' A\n';
      if (watts !== null) prompt += '- Watts: ' + watts + ' W\n';
      if (capuF !== null) prompt += '- Capacitor: ' + capuF + ' \u00B5F\n';
      if (ohms !== null) prompt += '- Ohms: ' + ohms + ' \u03A9\n';
      if (tempF !== null) prompt += '- Temp SC680: ' + tempF + '\u00B0F\n';
    }

    // Air analysis data
    var hasAir = airEnterDB !== null || airLeaveDB !== null || airEnterWC !== null;
    if (hasAir) {
      prompt += '\nAN\u00C1LISIS DE AIRE (Entering/Leaving):\n';
      if (airEnterDB !== null) prompt += '- Entering DB: ' + airEnterDB + '\u00B0F\n';
      if (airLeaveDB !== null) prompt += '- Leaving DB: ' + airLeaveDB + '\u00B0F\n';
      if (airEnterWB !== null) prompt += '- Entering WB: ' + airEnterWB + '\u00B0F\n';
      if (airLeaveWB !== null) prompt += '- Leaving WB: ' + airLeaveWB + '\u00B0F\n';
      if (airEnterRH !== null) prompt += '- Entering RH: ' + airEnterRH + '%\n';
      if (airLeaveRH !== null) prompt += '- Leaving RH: ' + airLeaveRH + '%\n';
      if (airEnterWC !== null) prompt += '- Return Static Pressure: ' + airEnterWC + ' inWC\n';
      if (airLeaveWC !== null) prompt += '- Supply Static Pressure: ' + airLeaveWC + ' inWC\n';
      if (totalEnth) prompt += '- Total Enthalpy Diff: ' + totalEnth + ' BTU/lb\n';
      if (totalESP) prompt += '- Total ESP: ' + totalESP + ' inWC\n';
    }

    // Weather conditions
    if (_wx.tempF !== null && _wx.tempF !== undefined) {
      prompt += '\nCONDICIONES CLIM\u00C1TICAS (GPS):\n';
      prompt += '- Temp exterior: ' + _wx.tempF.toFixed(1) + '\u00B0F\n';
      if (_wx.rhPct !== null && _wx.rhPct !== undefined) prompt += '- Humedad exterior: ' + Math.round(_wx.rhPct) + '%\n';
      if (_wx.city) prompt += '- Ubicaci\u00F3n: ' + _wx.city + '\n';
      if (_wx.elevationFt) prompt += '- Elevaci\u00F3n: ' + Math.round(_wx.elevationFt) + ' ft\n';
    }

    prompt += '\nIMPORTANTE: Basa tu diagn\u00F3stico \u00DANICAMENTE en los datos proporcionados arriba. NO inventes datos que no est\u00E9n listados. Si un valor dice "N/A", no lo uses para calcular ni diagnosticar.\n\n';
    prompt += 'Responde EN ESPA\u00D1OL con:\n1. Diagn\u00F3stico principal (qu\u00E9 tiene el sistema)\n2. Posibles causas ra\u00EDz (ordenadas de m\u00E1s probable a menos)\n3. Pasos de verificaci\u00F3n espec\u00EDficos (qu\u00E9 medir, qu\u00E9 revisar)\n4. Soluci\u00F3n recomendada paso a paso\n5. Advertencias de seguridad si aplica\n6. An\u00E1lisis de datos el\u00E9ctricos si se proporcionaron (voltaje, amperaje, capacitor)\n7. An\u00E1lisis de airflow/presiones est\u00E1ticas si se proporcionaron\n8. An\u00E1lisis de condiciones psicrom\u00E9tricas del espacio si se proporcionaron datos';
    _htCallIA(prompt, 'htMfIA', 'htMfIABtn');
  };

  function _htReversePT(refName, psig) {
    var data = window.PT_DATA && window.PT_DATA[refName];
    if (!data || data.length === 0) return null;
    var closest = null, closestDiff = Infinity;
    for (var i = 0; i < data.length; i++) {
      var diff = Math.abs(data[i].psig_vapor - psig);
      if (diff < closestDiff) { closestDiff = diff; closest = i; }
    }
    if (closest === null) return null;
    if (closest > 0 && closest < data.length - 1) {
      var d0 = data[closest - 1], d1 = data[closest], d2 = data[closest + 1];
      var below = d0, above = d2;
      if (psig >= d1.psig_vapor) { below = d1; above = d2; }
      else { below = d0; above = d1; }
      if (above.psig_vapor === below.psig_vapor) return below.temp_f;
      var frac = (psig - below.psig_vapor) / (above.psig_vapor - below.psig_vapor);
      return below.temp_f + frac * (above.temp_f - below.temp_f);
    }
    return data[closest].temp_f;
  }

  // ============================
  // CARGA TÉRMICA PRO v2 (MANUAL J ROOM-BY-ROOM)
  // ============================

  // --- Reference Data: ~120 US Cities ---
  var _htCTCities = [
    // Texas (16)
    {n:'Houston, TX',tC:99,wb:78,tH:29,el:50,dr:18},{n:'Dallas, TX',tC:102,wb:76,tH:22,el:430,dr:20},
    {n:'San Antonio, TX',tC:100,wb:74,tH:28,el:650,dr:19},{n:'Austin, TX',tC:101,wb:75,tH:26,el:500,dr:20},
    {n:'El Paso, TX',tC:101,wb:64,tH:24,el:3740,dr:26},{n:'McAllen, TX',tC:99,wb:77,tH:38,el:107,dr:18},
    {n:'Laredo, TX',tC:103,wb:75,tH:35,el:508,dr:20},{n:'Corpus Christi, TX',tC:96,wb:79,tH:34,el:44,dr:15},
    {n:'Brownsville, TX',tC:96,wb:79,tH:39,el:22,dr:15},{n:'Lubbock, TX',tC:100,wb:68,tH:13,el:3254,dr:24},
    {n:'Fort Worth, TX',tC:102,wb:76,tH:22,el:650,dr:20},{n:'Arlington, TX',tC:102,wb:76,tH:22,el:600,dr:20},
    {n:'Amarillo, TX',tC:99,wb:66,tH:10,el:3607,dr:26},{n:'Midland, TX',tC:102,wb:67,tH:19,el:2779,dr:24},
    {n:'Beaumont, TX',tC:96,wb:79,tH:30,el:15,dr:16},{n:'Waco, TX',tC:101,wb:76,tH:24,el:470,dr:20},
    // Florida (11)
    {n:'Miami, FL',tC:93,wb:79,tH:47,el:11,dr:13},{n:'Orlando, FL',tC:95,wb:77,tH:36,el:89,dr:16},
    {n:'Tampa, FL',tC:93,wb:78,tH:38,el:10,dr:15},{n:'Jacksonville, FL',tC:96,wb:78,tH:30,el:24,dr:17},
    {n:'Ft. Lauderdale, FL',tC:93,wb:79,tH:46,el:9,dr:12},{n:'West Palm Beach, FL',tC:93,wb:79,tH:44,el:18,dr:13},
    {n:'Pensacola, FL',tC:95,wb:78,tH:28,el:30,dr:16},{n:'St. Petersburg, FL',tC:93,wb:78,tH:40,el:10,dr:14},
    {n:'Naples, FL',tC:93,wb:79,tH:42,el:8,dr:14},{n:'Gainesville, FL',tC:95,wb:78,tH:30,el:175,dr:17},
    {n:'Tallahassee, FL',tC:95,wb:78,tH:27,el:55,dr:17},
    // California (12)
    {n:'Los Angeles, CA',tC:92,wb:70,tH:43,el:325,dr:19},{n:'Riverside, CA',tC:104,wb:72,tH:33,el:840,dr:32},
    {n:'Fresno, CA',tC:104,wb:71,tH:30,el:335,dr:34},{n:'Sacramento, CA',tC:101,wb:71,tH:32,el:17,dr:32},
    {n:'San Diego, CA',tC:89,wb:69,tH:42,el:30,dr:12},{n:'Bakersfield, CA',tC:106,wb:72,tH:32,el:495,dr:34},
    {n:'San Jose, CA',tC:95,wb:68,tH:35,el:82,dr:26},{n:'San Francisco, CA',tC:84,wb:63,tH:38,el:16,dr:15},
    {n:'Oakland, CA',tC:88,wb:64,tH:36,el:42,dr:17},{n:'Stockton, CA',tC:103,wb:71,tH:31,el:23,dr:34},
    {n:'Modesto, CA',tC:103,wb:71,tH:31,el:91,dr:34},{n:'Redding, CA',tC:107,wb:69,tH:28,el:500,dr:36},
    // Arizona (6)
    {n:'Phoenix, AZ',tC:110,wb:71,tH:34,el:1085,dr:27},{n:'Tucson, AZ',tC:106,wb:66,tH:30,el:2388,dr:26},
    {n:'Mesa, AZ',tC:110,wb:71,tH:35,el:1240,dr:27},{n:'Yuma, AZ',tC:113,wb:72,tH:37,el:199,dr:27},
    {n:'Flagstaff, AZ',tC:86,wb:56,tH:0,el:6903,dr:28},{n:'Chandler, AZ',tC:110,wb:71,tH:35,el:1210,dr:27},
    // Nevada (3)
    {n:'Las Vegas, NV',tC:109,wb:66,tH:28,el:2001,dr:30},{n:'Reno, NV',tC:98,wb:62,tH:10,el:4400,dr:38},
    {n:'Henderson, NV',tC:109,wb:66,tH:28,el:1867,dr:30},
    // Georgia (4)
    {n:'Atlanta, GA',tC:95,wb:76,tH:21,el:1010,dr:18},{n:'Savannah, GA',tC:96,wb:78,tH:27,el:42,dr:17},
    {n:'Augusta, GA',tC:97,wb:77,tH:22,el:136,dr:19},{n:'Columbus, GA',tC:97,wb:77,tH:24,el:397,dr:19},
    // North Carolina (4)
    {n:'Charlotte, NC',tC:96,wb:76,tH:20,el:748,dr:18},{n:'Raleigh, NC',tC:95,wb:77,tH:19,el:400,dr:18},
    {n:'Wilmington, NC',tC:94,wb:79,tH:25,el:29,dr:16},{n:'Greensboro, NC',tC:94,wb:76,tH:17,el:897,dr:19},
    // Tennessee (4)
    {n:'Nashville, TN',tC:96,wb:76,tH:14,el:580,dr:19},{n:'Memphis, TN',tC:97,wb:78,tH:18,el:285,dr:18},
    {n:'Knoxville, TN',tC:94,wb:75,tH:16,el:980,dr:19},{n:'Chattanooga, TN',tC:96,wb:76,tH:17,el:683,dr:19},
    // Louisiana (3)
    {n:'New Orleans, LA',tC:95,wb:79,tH:33,el:4,dr:14},{n:'Baton Rouge, LA',tC:96,wb:79,tH:28,el:56,dr:17},
    {n:'Shreveport, LA',tC:99,wb:78,tH:22,el:254,dr:19},
    // South Carolina (2)
    {n:'Charleston, SC',tC:95,wb:78,tH:27,el:41,dr:16},{n:'Columbia, SC',tC:97,wb:77,tH:22,el:213,dr:19},
    // Virginia (2)
    {n:'Richmond, VA',tC:95,wb:77,tH:16,el:166,dr:18},{n:'Virginia Beach, VA',tC:93,wb:78,tH:22,el:12,dr:16},
    // Alabama (2)
    {n:'Birmingham, AL',tC:96,wb:76,tH:19,el:620,dr:18},{n:'Mobile, AL',tC:95,wb:79,tH:29,el:211,dr:16},
    // Mississippi (1)
    {n:'Jackson, MS',tC:97,wb:78,tH:22,el:297,dr:18},
    // Arkansas (1)
    {n:'Little Rock, AR',tC:98,wb:78,tH:17,el:311,dr:19},
    // Kentucky (1)
    {n:'Louisville, KY',tC:94,wb:76,tH:10,el:489,dr:19},
    // Illinois (2)
    {n:'Chicago, IL',tC:93,wb:75,tH:0,el:594,dr:18},{n:'Springfield, IL',tC:94,wb:76,tH:2,el:587,dr:20},
    // New York (3)
    {n:'New York, NY',tC:93,wb:75,tH:11,el:28,dr:16},{n:'Buffalo, NY',tC:89,wb:73,tH:5,el:705,dr:17},
    {n:'Albany, NY',tC:91,wb:74,tH:1,el:275,dr:19},
    // Colorado (3)
    {n:'Denver, CO',tC:95,wb:60,tH:1,el:5280,dr:28},{n:'Colorado Springs, CO',tC:93,wb:58,tH:0,el:6035,dr:28},
    {n:'Fort Collins, CO',tC:95,wb:60,tH:-2,el:5003,dr:28},
    // New Mexico (3)
    {n:'Albuquerque, NM',tC:98,wb:62,tH:14,el:5312,dr:27},{n:'Las Cruces, NM',tC:102,wb:63,tH:22,el:3900,dr:27},
    {n:'Santa Fe, NM',tC:92,wb:58,tH:6,el:7199,dr:28},
    // Oklahoma (2)
    {n:'Oklahoma City, OK',tC:100,wb:76,tH:13,el:1198,dr:22},{n:'Tulsa, OK',tC:100,wb:77,tH:13,el:677,dr:22},
    // Missouri (2)
    {n:'Kansas City, MO',tC:98,wb:76,tH:5,el:741,dr:20},{n:'St. Louis, MO',tC:97,wb:77,tH:6,el:465,dr:19},
    // Indiana (2)
    {n:'Indianapolis, IN',tC:93,wb:75,tH:4,el:793,dr:19},{n:'Fort Wayne, IN',tC:92,wb:74,tH:2,el:791,dr:20},
    // Ohio (3)
    {n:'Columbus, OH',tC:92,wb:74,tH:5,el:812,dr:19},{n:'Cincinnati, OH',tC:93,wb:75,tH:8,el:482,dr:19},
    {n:'Cleveland, OH',tC:91,wb:74,tH:5,el:777,dr:18},
    // Michigan (2)
    {n:'Detroit, MI',tC:91,wb:74,tH:6,el:619,dr:18},{n:'Grand Rapids, MI',tC:91,wb:74,tH:5,el:794,dr:20},
    // Minnesota (1)
    {n:'Minneapolis, MN',tC:92,wb:74,tH:-10,el:834,dr:20},
    // Wisconsin (1)
    {n:'Milwaukee, WI',tC:90,wb:74,tH:-2,el:672,dr:18},
    // Iowa (1)
    {n:'Des Moines, IA',tC:93,wb:76,tH:-2,el:948,dr:20},
    // Nebraska (1)
    {n:'Omaha, NE',tC:96,wb:76,tH:-1,el:978,dr:21},
    // Washington DC (1)
    {n:'Washington, DC',tC:95,wb:77,tH:17,el:14,dr:17},
    // Pennsylvania (2)
    {n:'Philadelphia, PA',tC:93,wb:76,tH:13,el:30,dr:16},{n:'Pittsburgh, PA',tC:90,wb:73,tH:7,el:1137,dr:18},
    // Massachusetts (2)
    {n:'Boston, MA',tC:91,wb:74,tH:9,el:15,dr:16},{n:'Worcester, MA',tC:89,wb:73,tH:3,el:1000,dr:18},
    // Washington (3)
    {n:'Seattle, WA',tC:88,wb:66,tH:26,el:433,dr:20},{n:'Spokane, WA',tC:95,wb:63,tH:5,el:1943,dr:28},
    {n:'Tacoma, WA',tC:87,wb:65,tH:24,el:70,dr:19},
    // Oregon (2)
    {n:'Portland, OR',tC:92,wb:67,tH:23,el:21,dr:23},{n:'Eugene, OR',tC:92,wb:66,tH:22,el:364,dr:26},
    // Utah (2)
    {n:'Salt Lake City, UT',tC:97,wb:63,tH:7,el:4226,dr:32},{n:'Provo, UT',tC:96,wb:62,tH:8,el:4551,dr:32},
    // Hawaii (1)
    {n:'Honolulu, HI',tC:90,wb:74,tH:60,el:7,dr:12},
    // Puerto Rico (4)
    {n:'San Juan, PR',tC:91,wb:79,tH:67,el:19,dr:10},{n:'Ponce, PR',tC:92,wb:78,tH:66,el:9,dr:12},
    {n:'Mayag\u00FCez, PR',tC:91,wb:79,tH:66,el:20,dr:10},{n:'Bayam\u00F3n, PR',tC:91,wb:79,tH:66,el:45,dr:10}
  ];

  // --- Construction reference tables ---
  var _htCTWalls = [
    {n:'Frame \u2014 sin aislar',r:4.5},{n:'Frame \u2014 R-13 Fiberglass',r:14.5},{n:'Frame \u2014 R-15 Mineral',r:16.5},
    {n:'Frame \u2014 R-21 Celulosa',r:22.5},{n:'Frame \u2014 Spray Foam R-20',r:23},{n:'Ladrillo \u2014 sin aislar',r:5},
    {n:'Ladrillo \u2014 R-13',r:16},{n:'Bloque \u2014 sin aislar',r:3.5},{n:'Bloque \u2014 R-13',r:15},
    {n:'Bloque \u2014 filled cores',r:8},{n:'ICF \u2014 R-23',r:24},{n:'Estuco \u2014 sin aislar',r:3},
    {n:'Estuco \u2014 R-13',r:14.5}
  ];
  var _htCTRoofs = [
    {n:'Shingles + R-19 (\u00E1tico)',r:22},{n:'Shingles + R-30 (\u00E1tico)',r:33},{n:'Shingles + R-38 (\u00E1tico)',r:41},
    {n:'Shingles + R-49 (\u00E1tico)',r:52},{n:'Teja + R-30',r:34},{n:'Teja + R-38',r:42},
    {n:'Metal + R-19',r:22},{n:'Metal + R-30',r:33},{n:'Plano + R-15',r:18},{n:'Plano + R-20',r:23},
    {n:'Spray Foam R-25 (roof deck)',r:28}
  ];
  var _htCTFloors = [
    {n:'Slab \u2014 sin aislar',r:0,m:'slab',f:0.81},{n:'Slab \u2014 edge insulated',r:0,m:'slab',f:0.55},
    {n:'Crawlspace \u2014 ventilado',r:11,m:'area'},{n:'Crawlspace \u2014 sellado',r:19,m:'area'},
    {n:'Basement \u2014 sin aislar',r:5,m:'area'},{n:'Basement \u2014 insulated',r:15,m:'area'},
    {n:'2do piso (sobre espacio condicionado)',r:0,m:'none'}
  ];
  var _htCTWindows = [
    {n:'Single Pane',u:1.04,shgc:0.86},{n:'Double Pane',u:0.49,shgc:0.76},
    {n:'Double Low-E',u:0.35,shgc:0.44},{n:'Double Low-E\u00B2 Argon',u:0.27,shgc:0.30},
    {n:'Triple Low-E',u:0.20,shgc:0.26}
  ];
  var _htCTSolar = [{d:'N',v:30},{d:'NE',v:72},{d:'E',v:116},{d:'SE',v:106},{d:'S',v:60},{d:'SW',v:106},{d:'W',v:116},{d:'NW',v:72}];
  var _htCTTight = [{n:'Muy permeable (casa vieja)',ach:1.5},{n:'Promedio',ach:0.5},{n:'Bien sellada',ach:0.35},{n:'Muy sellada (energy star)',ach:0.15}];
  var _htCTDoors = [{n:'Madera maciza',u:0.40,a:21},{n:'Metal aislada',u:0.25,a:21},{n:'Fibra de vidrio',u:0.20,a:21},{n:'Vidrio/Patio',u:0.50,a:40}];

  // --- Room Types (9) ---
  var _htCTRoomTypes = [
    {id:'sala',n:'Sala',icon:'\uD83D\uDECB\uFE0F',senI:500,latI:200,occ:3,defSqft:200,defExt:2},
    {id:'cocina',n:'Cocina',icon:'\uD83C\uDF73',senI:2400,latI:1200,occ:2,defSqft:120,defExt:1},
    {id:'dormitorio',n:'Dormitorio',icon:'\uD83D\uDECF\uFE0F',senI:300,latI:100,occ:2,defSqft:150,defExt:1},
    {id:'bano',n:'Ba\u00F1o',icon:'\uD83D\uDEBF',senI:200,latI:800,occ:1,defSqft:60,defExt:1},
    {id:'comedor',n:'Comedor',icon:'\uD83C\uDF7D\uFE0F',senI:400,latI:200,occ:4,defSqft:150,defExt:1},
    {id:'oficina',n:'Oficina',icon:'\uD83D\uDCBB',senI:800,latI:100,occ:1,defSqft:120,defExt:1},
    {id:'lavanderia',n:'Lavander\u00EDa',icon:'\uD83E\uDDFA',senI:1000,latI:1500,occ:0,defSqft:80,defExt:1},
    {id:'garage',n:'Garage',icon:'\uD83D\uDE97',senI:0,latI:0,occ:0,defSqft:240,defExt:3},
    {id:'otro',n:'Otro',icon:'\u2795',senI:500,latI:200,occ:2,defSqft:150,defExt:2}
  ];

  // --- State ---
  var _htCTRooms = [];
  var _htCTRoomId = 0;
  var _htCTOpenSec = {s1:true,s2:false,s3:false,s4:false};

  // --- UI Helpers ---
  window._htCTToggle = function(id) {
    _htCTOpenSec[id] = !_htCTOpenSec[id];
    var bd = document.getElementById('htCTBody_' + id);
    var chev = document.getElementById('htCTChev_' + id);
    if (bd) { bd.style.display = _htCTOpenSec[id] ? 'block' : 'none'; }
    if (chev) { chev.style.transform = _htCTOpenSec[id] ? 'rotate(90deg)' : 'rotate(0deg)'; }
  };

  // iOS-style card section with icon
  function _htCTSec(id, iconSvg, iconBg, title, subtitle, inner) {
    var open = _htCTOpenSec[id];
    var h = '<div style="background:#FFFFFF;border-radius:20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">';
    h += '<div onclick="_htCTToggle(\'' + id + '\')" style="display:flex;align-items:center;padding:16px 18px;cursor:pointer;-webkit-tap-highlight-color:transparent;">';
    h += '<div style="width:38px;height:38px;border-radius:11px;background:' + iconBg + ';display:flex;align-items:center;justify-content:center;margin-right:14px;flex-shrink:0;">' + iconSvg + '</div>';
    h += '<div style="flex:1;min-width:0;"><div style="font-size:16px;font-weight:700;color:#111111;">' + title + '</div>';
    if (subtitle) h += '<div id="htCTSub_' + id + '" style="font-size:13px;color:#111111;margin-top:2px;font-weight:500;">' + subtitle + '</div>';
    h += '</div>';
    h += '<svg id="htCTChev_' + id + '" width="8" height="14" viewBox="0 0 8 14" fill="none" style="flex-shrink:0;opacity:0.35;transform:rotate(' + (open ? '90' : '0') + 'deg);transition:transform 0.25s ease;"><path d="M1 1L7 7L1 13" stroke="#3C3C43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    h += '</div>';
    h += '<div id="htCTBody_' + id + '" style="display:' + (open ? 'block' : 'none') + ';padding:0 18px 18px;border-top:1px solid #F2F2F7;">' + inner + '</div></div>';
    return h;
  }

  // iOS settings-row input (label left, value right)
  function _htCTInput(id, label, ph, type) {
    return '<div style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid #F2F2F7;">' +
      '<span style="flex:1;font-size:15px;color:#111111;font-weight:600;">' + label + '</span>' +
      '<input id="' + id + '" type="' + (type||'number') + '" placeholder="' + ph + '" style="width:90px;text-align:right;border:none;background:transparent;font-size:16px;font-weight:700;color:#111111;outline:none;"></div>';
  }

  // Compact grid input for construction/room cards
  function _htCTInputCompact(id, label, ph, type) {
    return '<div><label style="font-size:13px;color:#111111;font-weight:600;display:block;margin-bottom:4px;">' + label + '</label>' +
      '<input id="' + id + '" type="' + (type||'number') + '" placeholder="' + ph + '" style="width:100%;background:#F2F2F7;color:#111111;border:none;border-radius:10px;padding:11px 12px;font-size:15px;font-weight:700;outline:none;box-sizing:border-box;"></div>';
  }

  function _htCTSelect(id, label, opts, selIdx) {
    var h = '<div style="padding:6px 0;"><label style="font-size:13px;color:#111111;font-weight:600;display:block;margin-bottom:4px;">' + label + '</label>';
    h += '<select id="' + id + '" style="width:100%;background:#F2F2F7;color:#111111;border:none;border-radius:10px;padding:11px 12px;font-size:15px;font-weight:700;outline:none;-webkit-appearance:none;">';
    for (var i = 0; i < opts.length; i++) {
      h += '<option value="' + i + '"' + (i === (selIdx||0) ? ' selected' : '') + '>' + opts[i] + '</option>';
    }
    h += '</select></div>';
    return h;
  }

  // iOS segmented control
  function _htCTToggleBtns(name, options, defIdx, color) {
    var h = '<div style="display:flex;gap:0;background:#F2F2F7;border-radius:10px;padding:3px;">';
    for (var i = 0; i < options.length; i++) {
      var sel = i === (defIdx||0);
      h += '<button onclick="_htCTSetToggle(\'' + name + '\',' + i + ',' + options.length + ')" id="htCTTgl_' + name + '_' + i + '" ' +
        'style="flex:1;min-width:0;padding:9px 4px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:none;' +
        'background:' + (sel ? '#FFFFFF' : 'transparent') + ';color:#111111;' +
        (sel ? 'box-shadow:0 1px 4px rgba(0,0,0,0.1);' : '') +
        '-webkit-tap-highlight-color:transparent;">' + options[i] + '</button>';
    }
    h += '</div>';
    return h;
  }

  window._htCTSetToggle = function(name, idx, total) {
    for (var i = 0; i < total; i++) {
      var b = document.getElementById('htCTTgl_' + name + '_' + i);
      if (!b) continue;
      var sel = i === idx;
      b.style.background = sel ? '#FFFFFF' : 'transparent';
      b.style.color = '#111111';
      b.style.boxShadow = sel ? '0 1px 4px rgba(0,0,0,0.1)' : 'none';
      b.style.border = 'none';
    }
    window['_htCTVal_' + name] = idx;
  };

  window._htCTCityChange = function() {
    var sel = document.getElementById('htCTCity');
    if (!sel) return;
    var idx = parseInt(sel.value);
    if (isNaN(idx) || idx < 0) return;
    var c = _htCTCities[idx];
    if (!c) return;
    var ids = [['htCTOutdoor', c.tC],['htCTWetBulb', c.wb],['htCTHeating', c.tH],['htCTElev', c.el],['htCTDailyRange', c.dr]];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i][0]);
      if (el) el.value = ids[i][1];
    }
  };

  function _htCTSubHdr(text, first) {
    return '<div style="font-size:12px;font-weight:800;color:#111111;text-transform:uppercase;letter-spacing:0.5px;margin:' + (first ? '0' : '14px') + ' 0 8px;' + (first ? '' : 'padding-top:10px;border-top:1px solid #F2F2F7;') + '">' + text + '</div>';
  }

  // --- Room Management ---
  function _htCTRoomInput(rid, field, label, val, type) {
    var tp = type || 'number';
    return '<div><label style="font-size:13px;color:#111111;font-weight:600;display:block;margin-bottom:4px;">' + label + '</label>' +
      '<input id="htCTR_' + rid + '_' + field + '" type="' + tp + '" value="' + (val === undefined ? '' : val) + '" ' +
      'style="width:100%;background:#F2F2F7;color:#111111;border:none;border-radius:10px;padding:10px 12px;font-size:15px;font-weight:700;outline:none;box-sizing:border-box;"></div>';
  }

  function _htCTSyncAllRooms() {
    for (var i = 0; i < _htCTRooms.length; i++) {
      var r = _htCTRooms[i];
      if (!r.expanded) continue;
      var nameEl = document.getElementById('htCTR_' + r.id + '_name');
      var sqftEl = document.getElementById('htCTR_' + r.id + '_sqft');
      var extEl = document.getElementById('htCTR_' + r.id + '_extWalls');
      var occEl = document.getElementById('htCTR_' + r.id + '_occ');
      var fenEl = document.getElementById('htCTR_' + r.id + '_fen');
      var oriEl = document.getElementById('htCTR_' + r.id + '_orient');
      if (nameEl) r.name = nameEl.value || r.name;
      if (sqftEl) r.sqft = Math.max(1, parseFloat(sqftEl.value) || r.sqft);
      if (extEl) r.extWalls = Math.min(4, Math.max(0, parseInt(extEl.value) || 0));
      if (occEl) { var ov = parseFloat(occEl.value); r.occOverride = ov >= 0 ? ov : null; }
      if (fenEl) { var fv = parseInt(fenEl.value); r.fenOverride = fv >= 0 ? fv : null; }
      if (oriEl) { var orv = parseInt(oriEl.value); r.orientOverride = orv >= 0 ? orv : null; }
    }
  }

  window._htCTAddRoom = function(typeIdx) {
    _htCTSyncAllRooms();
    for (var i = 0; i < _htCTRooms.length; i++) _htCTRooms[i].expanded = false;
    var rt = _htCTRoomTypes[typeIdx];
    var count = 0;
    for (var i = 0; i < _htCTRooms.length; i++) if (_htCTRooms[i].type === typeIdx) count++;
    _htCTRooms.push({
      id: ++_htCTRoomId,
      type: typeIdx,
      name: rt.n + (count > 0 ? ' ' + (count + 1) : ''),
      sqft: rt.defSqft,
      extWalls: rt.defExt,
      fenOverride: null,
      orientOverride: null,
      occOverride: null,
      expanded: true
    });
    _htCTRenderRoomList();
  };

  window._htCTRemoveRoom = function(rid) {
    _htCTSyncAllRooms();
    _htCTRooms = _htCTRooms.filter(function(r) { return r.id !== rid; });
    _htCTRenderRoomList();
  };

  window._htCTToggleRoom = function(rid) {
    _htCTSyncAllRooms();
    for (var i = 0; i < _htCTRooms.length; i++) {
      if (_htCTRooms[i].id === rid) { _htCTRooms[i].expanded = !_htCTRooms[i].expanded; break; }
    }
    _htCTRenderRoomList();
  };

  function _htCTRenderRoomCard(room) {
    var rt = _htCTRoomTypes[room.type];
    var h = '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.1);border-radius:8px;margin-bottom:6px;overflow:hidden;">';
    h += '<div onclick="_htCTToggleRoom(' + room.id + ')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;cursor:pointer;-webkit-tap-highlight-color:transparent;">';
    h += '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">';
    h += '<span style="font-size:16px;">' + rt.icon + '</span>';
    h += '<span style="font-size:14px;font-weight:700;color:#111111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + room.name + '</span>';
    h += '<span style="font-size:12px;color:#111111;font-weight:600;">' + room.sqft + ' sqft</span>';
    h += '<span style="font-size:12px;color:#111111;font-weight:600;">' + room.extWalls + ' walls ext</span>';
    h += '</div>';
    h += '<button onclick="event.stopPropagation();_htCTRemoveRoom(' + room.id + ')" style="background:rgba(239,68,68,0.2);border:none;color:#f87171;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:12px;flex-shrink:0;-webkit-tap-highlight-color:transparent;">\u2715</button>';
    h += '</div>';
    if (room.expanded) {
      h += '<div style="padding:4px 10px 10px;border-top:1px solid rgba(0,0,0,0.06);">';
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
      h += _htCTRoomInput(room.id, 'name', 'Nombre', room.name, 'text');
      h += _htCTRoomInput(room.id, 'sqft', '\u00C1rea (sq ft)', room.sqft);
      h += _htCTRoomInput(room.id, 'extWalls', 'Paredes ext (0\u20134)', room.extWalls);
      h += _htCTRoomInput(room.id, 'occ', 'Ocupantes', room.occOverride !== null ? room.occOverride : rt.occ);
      h += '</div>';
      var dirs = ['N','NE','E','SE','S','SW','W','NW'];
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">';
      h += '<div><label style="font-size:13px;color:#111111;font-weight:600;display:block;margin-bottom:4px;">% Ventanas</label>';
      h += '<select id="htCTR_' + room.id + '_fen" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.15);border-radius:8px;padding:9px;font-size:14px;font-weight:600;outline:none;">';
      h += '<option value="-1"' + (room.fenOverride === null ? ' selected' : '') + '>Default global</option>';
      for (var fp = 5; fp <= 40; fp += 5) h += '<option value="' + fp + '"' + (room.fenOverride === fp ? ' selected' : '') + '>' + fp + '%</option>';
      h += '</select></div>';
      h += '<div><label style="font-size:13px;color:#111111;font-weight:600;display:block;margin-bottom:4px;">Orientaci\u00F3n</label>';
      h += '<select id="htCTR_' + room.id + '_orient" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.15);border-radius:8px;padding:9px;font-size:14px;font-weight:600;outline:none;">';
      h += '<option value="-1"' + (room.orientOverride === null ? ' selected' : '') + '>Default global</option>';
      for (var di = 0; di < dirs.length; di++) h += '<option value="' + di + '"' + (room.orientOverride === di ? ' selected' : '') + '>' + dirs[di] + '</option>';
      h += '</select></div>';
      h += '</div></div>';
    }
    h += '</div>';
    return h;
  }

  function _htCTRenderRoomList() {
    var container = document.getElementById('htCTRoomList');
    if (!container) return;
    var h = '';
    for (var i = 0; i < _htCTRooms.length; i++) h += _htCTRenderRoomCard(_htCTRooms[i]);
    if (_htCTRooms.length === 0) {
      h = '<div style="text-align:center;padding:24px;color:#8E8E93;font-size:13px;font-weight:500;">' + (typeof _t === 'function' ? _t('ht_ct_add_rooms', 'Agrega habitaciones con los botones de arriba') : 'Agrega habitaciones con los botones de arriba') + '</div>';
    }
    container.innerHTML = h;
    var hdr = document.getElementById('htCTRoomCount');
    if (hdr) hdr.textContent = _t('ht_ct_rooms','Rooms');
    var subEl = document.getElementById('htCTSub_s3');
    if (subEl) subEl.textContent = _htCTRooms.length + ' ' + (_htCTRooms.length !== 1 ? _t('ht_ct_zones','Zones') : _t('ht_ct_zone','Zone'));
  }

  // --- Main UI ---
  function _htShowCargaTermica(s) {
    _htView = 'carga';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    _htCTOpenSec = {s1:true,s2:false,s3:false,s4:false};
    _htCTRooms = []; _htCTRoomId = 0;
    window._htCTVal_stories = 0; window._htCTVal_orient = 0; window._htCTVal_roofcolor = 0;
    window._htCTVal_tight = 1; window._htCTVal_appliance = 1; window._htCTVal_lighting = 0;

    // SVG icons for sections
    var _icoPin = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fff"/><circle cx="12" cy="9" r="2.5" fill="#FF3B30"/></svg>';
    var _icoBuild = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="7" height="14" rx="1" fill="#fff"/><rect x="14" y="3" width="7" height="18" rx="1" fill="#fff"/><rect x="5" y="9" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="7.5" y="9" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="5" y="12" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="7.5" y="12" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="16" y="5" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="18.5" y="5" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="16" y="8" width="1.5" height="1.5" rx=".3" fill="#007AFF"/><rect x="18.5" y="8" width="1.5" height="1.5" rx=".3" fill="#007AFF"/></svg>';
    var _icoHome = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-8 9 8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" stroke="#fff" stroke-width="2"/><path d="M9 21v-6h6v6" stroke="#fff" stroke-width="2"/></svg>';
    var _icoSlider = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="4" y1="8" x2="20" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="16" x2="20" y2="16" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="8" r="2.5" fill="#fff" stroke="#007AFF" stroke-width="1.5"/><circle cx="16" cy="16" r="2.5" fill="#fff" stroke="#007AFF" stroke-width="1.5"/></svg>';

    var h = '<div style="background:#F5F5F7;min-height:100vh;color:#111111;padding-bottom:80px;">';
    h += '<style>.htCTSearchInput::placeholder{color:#111111;opacity:1;font-weight:500;}#htCTRoot input::placeholder,#htCTRoot textarea::placeholder{color:#111111;opacity:0.85;}#htCTRoot select{color:#111111;}</style>';
    // ── Premium Header ──
    h += '<div id="htCTRoot" style="padding:14px 20px 0;">';
    h += '<button onclick="_htBackToMenu()" style="background:transparent;border:none;color:#111111;font-size:22px;cursor:pointer;padding:0;margin-bottom:6px;display:flex;align-items:center;gap:4px;-webkit-tap-highlight-color:transparent;"><svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    h += '<div style="font-size:28px;font-weight:800;color:#111111;letter-spacing:-0.5px;">' + _th('ht_carga_title', 'HVAC Equipment Sizing') + '</div>';
    h += '<div style="font-size:14px;color:#111111;margin-top:3px;font-weight:600;">' + _th('ht_ct_manual_j', 'Manual \u00B7 Hourly Method') + '</div>';
    h += '</div>';

    // ── Search Bar ──
    h += '<div style="padding:14px 20px 6px;">';
    h += '<div style="display:flex;gap:8px;">';
    h += '<div style="flex:1;background:#FFFFFF;border-radius:14px;display:flex;align-items:center;padding:0 14px;box-shadow:0 1px 4px rgba(0,0,0,0.05);">';
    h += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#8E8E93" stroke-width="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/></svg>';
    h += '<input id="htCTSearch" placeholder="Search equipment..." style="flex:1;border:none;background:transparent;padding:12px 10px;font-size:15px;color:#111111;outline:none;font-weight:600;" class="htCTSearchInput"></div>';
    h += '<button onclick="if(typeof _bleScan===\'function\')_bleScan();" style="background:#007AFF;color:#fff;border:none;border-radius:14px;padding:0 18px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap;-webkit-tap-highlight-color:transparent;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#fff" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#fff" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#fff" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#fff" stroke-width="2"/></svg> Scan</button>';
    h += '</div></div>';

    h += '<div style="padding:6px 20px 20px;">';

    // ===== SECTION 1: Location & Climate =====
    var s1 = '';
    s1 += '<div style="padding:6px 0 2px;">';
    s1 += '<select id="htCTCity" onchange="_htCTCityChange();var o=this.options[this.selectedIndex];var sub=document.getElementById(\'htCTSub_s1\');if(sub&&o.value>=0)sub.textContent=o.textContent;" style="width:100%;background:#F2F2F7;color:#1C1C1E;border:none;border-radius:12px;padding:12px 14px;font-size:14px;font-weight:600;outline:none;-webkit-appearance:none;margin-bottom:4px;">';
    s1 += '<option value="-1">' + _th('ht_ct_select_city', 'Selecciona ciudad...') + '</option>';
    for (var ci = 0; ci < _htCTCities.length; ci++) s1 += '<option value="' + ci + '">' + _htCTCities[ci].n + '</option>';
    s1 += '<option value="-2">' + _th('ht_ct_manual_other', 'Manual / Otra') + '</option></select></div>';
    s1 += _htCTInput('htCTOutdoor','Target Max Cooling','95');
    s1 += _htCTInput('htCTHeating','Target Min Heating','30');
    s1 += _htCTInput('htCTWetBulb','Wet Bulb','75');
    s1 += _htCTInput('htCTElev','Elevaci\u00F3n','500');
    s1 += _htCTInput('htCTDailyRange','Daily Range','20');
    s1 += _htCTInput('htCTIndoor','Temp Interior','75');
    h += _htCTSec('s1', _icoPin, '#FF3B30', _th('ht_ct_location_climate', 'Location & Climate'), _th('ht_ct_select_city','Selecciona ciudad'), s1);

    // ===== SECTION 2: Construction =====
    var s2 = '';
    s2 += _htCTSubHdr('ESTRUCTURA', true);
    s2 += _htCTInputCompact('htCTWallH','Altura Paredes (ft)','8');
    s2 += '<div style="margin-top:10px;"><label style="font-size:10px;color:#8E8E93;font-weight:600;display:block;margin-bottom:4px;">Pisos</label>';
    s2 += _htCTToggleBtns('stories',['1 Piso','2 Pisos'],0) + '</div>';
    s2 += '<div style="margin-top:10px;"><label style="font-size:10px;color:#8E8E93;font-weight:600;display:block;margin-bottom:4px;">Orientaci\u00F3n Principal</label>';
    s2 += _htCTToggleBtns('orient',['N','NE','E','SE','S','SW','W','NW'],0) + '</div>';

    s2 += _htCTSubHdr('ENVOLVENTE');
    var wallOpts = []; for (var wi = 0; wi < _htCTWalls.length; wi++) wallOpts.push(_htCTWalls[wi].n + ' (R-' + _htCTWalls[wi].r + ')');
    s2 += _htCTSelect('htCTWallType', _th('ht_ct_wall_type', 'Tipo de Pared'), wallOpts, 1);
    var roofOpts = []; for (var ri = 0; ri < _htCTRoofs.length; ri++) roofOpts.push(_htCTRoofs[ri].n + ' (R-' + _htCTRoofs[ri].r + ')');
    s2 += _htCTSelect('htCTRoofType', _th('ht_ct_roof_type', 'Tipo de Techo'), roofOpts, 1);
    s2 += '<div style="margin-top:8px;"><label style="font-size:10px;color:#8E8E93;font-weight:600;display:block;margin-bottom:4px;">' + _th('ht_ct_roof_color', 'Color del Techo') + '</label>';
    s2 += _htCTToggleBtns('roofcolor',['Oscuro','Medio','Claro'],0) + '</div>';
    var floorOpts = []; for (var fli = 0; fli < _htCTFloors.length; fli++) floorOpts.push(_htCTFloors[fli].n);
    s2 += _htCTSelect('htCTFloorType', _th('ht_ct_floor_type', 'Tipo de Piso'), floorOpts, 0);

    s2 += _htCTSubHdr('VENTANAS Y PUERTAS');
    var winOpts = []; for (var wni = 0; wni < _htCTWindows.length; wni++) winOpts.push(_htCTWindows[wni].n + ' (U=' + _htCTWindows[wni].u + ', SHGC=' + _htCTWindows[wni].shgc + ')');
    s2 += _htCTSelect('htCTWinType', _th('ht_ct_window_type', 'Tipo de Ventana'), winOpts, 2);
    s2 += '<div style="margin-top:10px;"><label style="font-size:10px;color:#8E8E93;font-weight:600;display:block;margin-bottom:4px;">% Fenestraci\u00F3n Default</label>';
    s2 += '<input id="htCTFenPct" type="range" min="5" max="40" value="15" oninput="document.getElementById(\'htCTFenLbl\').textContent=this.value+\'%\'" style="width:100%;accent-color:#007AFF;">';
    s2 += '<div style="display:flex;justify-content:space-between;font-size:10px;color:#8E8E93;"><span>5%</span><span id="htCTFenLbl" style="color:#1C1C1E;font-weight:700;">15%</span><span>40%</span></div></div>';
    s2 += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">';
    s2 += _htCTInputCompact('htCTDoors', _th('ht_ct_ext_doors', '# Puertas exteriores'), '2');
    var doorOpts = []; for (var di = 0; di < _htCTDoors.length; di++) doorOpts.push(_htCTDoors[di].n);
    s2 += _htCTSelect('htCTDoorType', _th('ht_ct_door_type', 'Tipo de Puerta'), doorOpts, 1);
    s2 += '</div>';

    s2 += _htCTSubHdr('INFILTRACI\u00D3N Y VENTILACI\u00D3N');
    s2 += '<label style="font-size:10px;color:#8E8E93;font-weight:600;display:block;margin-bottom:4px;">' + _th('ht_ct_airtightness', 'Hermeticidad') + '</label>';
    s2 += _htCTToggleBtns('tight',['Muy permeable','Promedio','Bien sellada','Muy sellada'],1);
    s2 += '<div style="margin-top:10px;">' + _htCTInputCompact('htCTACH','ACH Override (vac\u00EDo = auto)','') + '</div>';
    s2 += '<div style="margin-top:10px;"><label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#1C1C1E;cursor:pointer;font-weight:500;">';
    s2 += '<input type="checkbox" id="htCTMechVent" style="accent-color:#007AFF;width:18px;height:18px;"> Ventilaci\u00F3n mec\u00E1nica (ASHRAE 62.2)</label></div>';
    h += _htCTSec('s2', _icoBuild, '#007AFF', _th('ht_ct_construction', 'Construction'), 'Defaults & Details', s2);

    // ===== SECTION 3: Rooms =====
    var s3 = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">';
    for (var rti = 0; rti < _htCTRoomTypes.length; rti++) {
      var rt = _htCTRoomTypes[rti];
      s3 += '<button onclick="_htCTAddRoom(' + rti + ')" style="padding:10px 4px;background:#F2F2F7;border:none;border-radius:12px;color:#1C1C1E;cursor:pointer;font-size:11px;font-weight:600;display:flex;flex-direction:column;align-items:center;gap:3px;-webkit-tap-highlight-color:transparent;">';
      s3 += '<span style="font-size:20px;">' + rt.icon + '</span>';
      s3 += '<span>' + rt.n + '</span></button>';
    }
    s3 += '</div>';
    s3 += '<div id="htCTRoomList"></div>';
    h += _htCTSec('s3', _icoHome, '#007AFF', '<span id="htCTRoomCount">' + _th('ht_ct_rooms', 'Rooms') + '</span>', '0 ' + _th('ht_ct_zones', 'Zones'), s3);

    // ===== SECTION 4: Internal Loads =====
    var s4 = '<div><label style="font-size:12px;color:#3C3C43;font-weight:500;display:block;margin-bottom:6px;">Electrodom\u00E9sticos</label>';
    s4 += _htCTToggleBtns('appliance',['Baja (0.5x)','Normal (1x)','Alta (2x)'],1) + '</div>';
    s4 += '<div style="margin-top:12px;"><label style="font-size:12px;color:#3C3C43;font-weight:500;display:block;margin-bottom:6px;">Iluminaci\u00F3n</label>';
    s4 += _htCTToggleBtns('lighting',['LED','Fluorescente','Incandescente'],0) + '</div>';
    h += _htCTSec('s4', _icoSlider, '#007AFF', _th('ht_ct_internal_loads', 'Internal Loads'), _th('ht_ct_safety_factor', 'Safety Factor'), s4);

    // ── Safety Factor card ──
    h += '<div style="background:#FFFFFF;border-radius:20px;padding:16px 18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;">';
    h += '<div><div style="font-size:14px;color:#1C1C1E;font-weight:600;">' + _th('ht_ct_safety_factor', 'Safety Factor') + '</div><div style="font-size:12px;color:#8E8E93;margin-top:2px;">' + _th('ht_ct_safety_hint', 'Ductos en \u00E1tico = 15%, condicionado = 10%') + '</div></div>';
    h += '<select id="htCTSafety" style="background:#F2F2F7;color:#1C1C1E;border:none;border-radius:10px;padding:8px 12px;font-size:14px;font-weight:600;outline:none;-webkit-appearance:none;">';
    h += '<option value="1.10">10%</option><option value="1.15" selected>15%</option></select></div>';

    // ── Calculate Button (premium red gradient) ──
    h += '<button onclick="_htCTCalc()" style="width:100%;height:55px;background:linear-gradient(135deg,#FF3B30,#FF6A5A);border:none;color:#fff;border-radius:16px;font-size:16px;font-weight:800;cursor:pointer;margin-bottom:12px;box-shadow:0 4px 16px rgba(255,59,48,0.3);-webkit-tap-highlight-color:transparent;letter-spacing:0.2px;">' + _th('ht_ct_calculate', 'Calculate Thermal Load') + '</button>';
    h += '<div id="htCTResults"></div>';
    h += '<button id="htCTIABtn" onclick="_htCTDiagnose()" style="display:none;width:100%;height:50px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#fff;border-radius:16px;font-size:14px;font-weight:700;cursor:pointer;margin-top:10px;box-shadow:0 4px 14px rgba(59,130,246,0.3);-webkit-tap-highlight-color:transparent;">' + _th('ht_ct_ia_analyze', 'Analizar con IA \u2014 Recomendaci\u00F3n por Zona') + '</button>';
    h += '<div id="htCTIA" style="margin-top:10px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
    _htCTRenderRoomList();
  }

  // --- Per-Room Calculation Helper ---
  function _htCTCalcRoom(room, g) {
    var rt = _htCTRoomTypes[room.type];
    var sqft = room.sqft;
    var extWalls = room.extWalls;
    var wallSide = Math.sqrt(sqft);
    var wallArea = extWalls * wallSide * g.wallH;
    var fenPct = room.fenOverride !== null ? room.fenOverride : g.fenPct;
    var winArea = wallArea * fenPct / 100;
    var netWallArea = Math.max(0, wallArea - winArea);
    var orientIdx = room.orientOverride !== null ? room.orientOverride : g.orientIdx;
    var occ = room.occOverride !== null ? room.occOverride : rt.occ;

    // Walls
    var loadWalls = netWallArea * g.dt / g.wallR;
    // Roof
    var loadRoof = sqft * g.cltdAdj / g.roofR;
    // Floor
    var loadFloor = 0;
    if (g.floorM === 'slab') {
      var roomPerim = extWalls > 0 ? (extWalls * wallSide) : 0;
      loadFloor = roomPerim * g.floorF * g.dt;
    } else if (g.floorM === 'area' && g.floorR > 0) {
      loadFloor = sqft * g.dt / g.floorR;
    }
    // Windows
    var loadWinCond = winArea * g.winU * g.dt;
    var solarPeak = _htCTSolar[orientIdx] ? _htCTSolar[orientIdx].v : 60;
    var loadWinSolar = winArea * g.winSHGC * solarPeak;
    // Doors (proportional by extWalls)
    var loadDoors = (extWalls > 0 && g.totalExtWalls > 0) ? (g.totalDoorLoad * extWalls / g.totalExtWalls) : 0;
    // Infiltration
    var vol = sqft * g.wallH;
    var cfmInfil = vol * g.ach / 60;
    var loadInfilSens = 1.08 * cfmInfil * g.dt;
    var loadInfilLat = 0.68 * cfmInfil * g.dW;
    // Ventilation (ASHRAE 62.2)
    var ventCFM = g.mechVent ? (7.5 * occ + 0.01 * sqft) : 0;
    var loadVentSens = 1.08 * ventCFM * g.dt;
    var loadVentLat = 0.68 * ventCFM * g.dW;
    // People
    var loadPeopleSens = occ * 230;
    var loadPeopleLat = occ * 200;
    // Internal (type-based × appliance multiplier)
    var loadIntSens = rt.senI * g.appMult;
    var loadIntLat = rt.latI;
    // Lighting
    var loadLighting = sqft * g.lightFactor;

    var totalSens = loadWalls + loadRoof + loadFloor + loadWinCond + loadWinSolar + loadDoors +
      loadInfilSens + loadVentSens + loadPeopleSens + loadIntSens + loadLighting;
    var totalLat = loadInfilLat + loadVentLat + loadPeopleLat + loadIntLat;
    var totalBTU = totalSens + totalLat;
    var shr = totalBTU > 0 ? (totalSens / totalBTU) : 1;
    var cfm = totalSens > 0 ? (totalSens / (1.08 * 20)) : 0;

    return {
      name: room.name, icon: rt.icon, sqft: sqft, type: rt.id,
      totalSens: totalSens, totalLat: totalLat, totalBTU: totalBTU,
      shr: shr, cfm: cfm,
      loadWalls: loadWalls, loadRoof: loadRoof, loadFloor: loadFloor,
      loadWinCond: loadWinCond, loadWinSolar: loadWinSolar, loadDoors: loadDoors,
      loadInfilSens: loadInfilSens, loadInfilLat: loadInfilLat,
      loadVentSens: loadVentSens, loadVentLat: loadVentLat,
      loadPeopleSens: loadPeopleSens, loadPeopleLat: loadPeopleLat,
      loadIntSens: loadIntSens, loadIntLat: loadIntLat, loadLighting: loadLighting,
      occ: occ, ventCFM: ventCFM
    };
  }

  // --- Main Calculation Engine ---
  window._htCTCalc = function() {
    var resEl = document.getElementById('htCTResults');
    if (!resEl) return;
    _htCTSyncAllRooms();

    if (_htCTRooms.length === 0) {
      resEl.innerHTML = '<div style="padding:12px;color:#f87171;font-size:11px;text-align:center;">Agrega al menos 1 habitaci\u00F3n en la secci\u00F3n 3</div>';
      return;
    }

    // Gather global inputs
    var wallH = parseFloat(document.getElementById('htCTWallH').value) || 8;
    var outdoor = parseFloat(document.getElementById('htCTOutdoor').value) || 95;
    var indoor = parseFloat(document.getElementById('htCTIndoor').value) || 75;
    var wetBulb = parseFloat(document.getElementById('htCTWetBulb').value) || 75;
    var dailyRange = parseFloat(document.getElementById('htCTDailyRange').value) || 20;
    var dt = outdoor - indoor;
    if (dt <= 0) dt = 1;
    var stories = (window._htCTVal_stories || 0) === 0 ? 1 : 2;
    var orientIdx = window._htCTVal_orient || 0;
    var fenPct = parseFloat(document.getElementById('htCTFenPct').value) || 15;

    // Wall
    var wallIdx = parseInt(document.getElementById('htCTWallType').value) || 0;
    var wallR = _htCTWalls[wallIdx] ? _htCTWalls[wallIdx].r : 14.5;

    // Windows
    var winIdx = parseInt(document.getElementById('htCTWinType').value) || 0;
    var win = _htCTWindows[winIdx] || _htCTWindows[2];

    // Doors
    var numDoors = parseFloat(document.getElementById('htCTDoors').value) || 2;
    var doorIdx = parseInt(document.getElementById('htCTDoorType').value) || 0;
    var door = _htCTDoors[doorIdx] || _htCTDoors[1];
    var totalDoorLoad = numDoors * door.a * door.u * dt;

    // Roof
    var roofIdx = parseInt(document.getElementById('htCTRoofType').value) || 0;
    var roofR = _htCTRoofs[roofIdx] ? _htCTRoofs[roofIdx].r : 33;
    var roofColorIdx = window._htCTVal_roofcolor || 0;
    var cltdAdj = [38, 30, 22][roofColorIdx] || 30;
    cltdAdj = cltdAdj + (outdoor - 95) - (dailyRange - 20) * 0.5;

    // Floor
    var floorIdx = parseInt(document.getElementById('htCTFloorType').value) || 0;
    var floor = _htCTFloors[floorIdx] || _htCTFloors[0];

    // Infiltration
    var tightIdx = window._htCTVal_tight !== undefined ? window._htCTVal_tight : 1;
    var achDefault = _htCTTight[tightIdx] ? _htCTTight[tightIdx].ach : 0.5;
    var achOverride = parseFloat(document.getElementById('htCTACH').value);
    var ach = achOverride > 0 ? achOverride : achDefault;

    // Mechanical ventilation
    var mechVent = document.getElementById('htCTMechVent') && document.getElementById('htCTMechVent').checked;

    // Humidity ratio difference
    var dW = Math.max(0, (wetBulb - 62) * 0.5);

    // Internal loads global
    var appIdx = window._htCTVal_appliance !== undefined ? window._htCTVal_appliance : 1;
    var appMult = [0.5, 1.0, 2.0][appIdx] || 1.0;
    var lightIdx = window._htCTVal_lighting !== undefined ? window._htCTVal_lighting : 0;
    var lightFactor = [0.5, 1.0, 2.0][lightIdx] || 0.5;

    // Safety factor
    var safetyEl = document.getElementById('htCTSafety');
    var safety = safetyEl ? parseFloat(safetyEl.value) : 1.15;

    // Total ext walls across all rooms (for door distribution)
    var totalExtWalls = 0;
    for (var i = 0; i < _htCTRooms.length; i++) totalExtWalls += _htCTRooms[i].extWalls;

    // Build globals object
    var g = {
      wallH:wallH, dt:dt, orientIdx:orientIdx, fenPct:fenPct,
      wallR:wallR, roofR:roofR, cltdAdj:cltdAdj,
      floorM:floor.m, floorR:floor.r||0, floorF:floor.f||0,
      winU:win.u, winSHGC:win.shgc,
      totalDoorLoad:totalDoorLoad, totalExtWalls:totalExtWalls,
      ach:ach, dW:dW, mechVent:mechVent,
      appMult:appMult, lightFactor:lightFactor
    };

    // Calculate per-room
    var roomResults = [];
    var aggSens = 0, aggLat = 0, aggBTU = 0, totalSqft = 0, totalOcc = 0;
    for (var i = 0; i < _htCTRooms.length; i++) {
      var rr = _htCTCalcRoom(_htCTRooms[i], g);
      roomResults.push(rr);
      aggSens += rr.totalSens;
      aggLat += rr.totalLat;
      aggBTU += rr.totalBTU;
      totalSqft += rr.sqft;
      totalOcc += rr.occ;
    }

    // Apply safety factor
    var totalBTU = aggBTU * safety;
    var sensBTU = aggSens * safety;
    var latBTU = aggLat * safety;
    var tons = totalBTU / 12000;
    var shr = totalBTU > 0 ? (sensBTU / totalBTU) : 1;

    // Equipment sizing
    var eqTons = [1.5, 2, 2.5, 3, 3.5, 4, 5];
    var recTon = eqTons[eqTons.length - 1];
    for (var ei = 0; ei < eqTons.length; ei++) {
      if (eqTons[ei] * 12000 >= totalBTU) { recTon = eqTons[ei]; break; }
    }
    var oversized = recTon * 12000 > totalBTU * 1.3;

    // Store for IA
    window._htCTData = {
      totalSqft:totalSqft, wallH:wallH, outdoor:outdoor, indoor:indoor, wetBulb:wetBulb,
      dailyRange:dailyRange, dt:dt, stories:stories,
      orient:_htCTSolar[orientIdx]?_htCTSolar[orientIdx].d:'N',
      wallType:_htCTWalls[wallIdx]?_htCTWalls[wallIdx].n:'', wallR:wallR,
      roofType:_htCTRoofs[roofIdx]?_htCTRoofs[roofIdx].n:'', roofR:roofR,
      roofColor:['Oscuro','Medio','Claro'][roofColorIdx],
      floorType:_htCTFloors[floorIdx]?_htCTFloors[floorIdx].n:'',
      winType:_htCTWindows[winIdx]?_htCTWindows[winIdx].n:'', winU:win.u, winSHGC:win.shgc,
      fenPct:fenPct, numDoors:numDoors,
      doorType:_htCTDoors[doorIdx]?_htCTDoors[doorIdx].n:'',
      tightness:_htCTTight[tightIdx]?_htCTTight[tightIdx].n:'', ach:ach,
      mechVent:mechVent, occupants:totalOcc,
      appLevel:['Baja','Normal','Alta'][appIdx], lightType:['LED','Fluorescente','Incandescente'][lightIdx],
      totalBTU:totalBTU, sensBTU:sensBTU, latBTU:latBTU, tons:tons, shr:shr, safety:safety,
      roomResults:roomResults, recTon:recTon
    };

    // ===== RENDER RESULTS =====
    var rh = '<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    rh += '<div style="font-size:12px;font-weight:800;color:#f87171;margin-bottom:10px;">Resultado Manual J \u2014 Room-by-Room</div>';

    // Summary cards
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">CARGA TOTAL</div><div style="font-size:20px;font-weight:900;color:#f87171;">' + Math.round(totalBTU).toLocaleString() + '</div><div style="font-size:9px;color:#4b5563;">BTU/hr</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">TONELADAS</div><div style="font-size:20px;font-weight:900;color:#60a5fa;">' + tons.toFixed(1) + '</div><div style="font-size:9px;color:#4b5563;">Ton</div></div>';
    rh += '</div>';
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">SENSIBLE</div><div style="font-size:14px;font-weight:800;color:#fbbf24;">' + Math.round(sensBTU).toLocaleString() + '</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">LATENTE</div><div style="font-size:14px;font-weight:800;color:#38bdf8;">' + Math.round(latBTU).toLocaleString() + '</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">SHR</div><div style="font-size:14px;font-weight:800;color:' + (shr < 0.75 ? '#fbbf24' : '#34d399') + ';">' + (shr * 100).toFixed(0) + '%</div></div>';
    rh += '</div>';

    // ===== PER-ROOM TABLE =====
    rh += '<div style="font-size:9px;font-weight:700;color:#4b5563;margin-bottom:6px;">DESGLOSE POR HABITACI\u00D3N</div>';
    rh += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:12px;">';
    rh += '<table style="width:100%;border-collapse:collapse;font-size:10px;min-width:440px;">';
    rh += '<thead><tr style="border-bottom:1px solid rgba(0,0,0,0.1);">';
    rh += '<th style="text-align:left;padding:4px 6px;color:#4b5563;font-weight:700;">Habitaci\u00F3n</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#fbbf24;font-weight:700;">Sens</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#38bdf8;font-weight:700;">Lat</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#f87171;font-weight:700;">Total</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#34d399;font-weight:700;">SHR</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#c084fc;font-weight:700;">CFM</th>';
    rh += '<th style="text-align:right;padding:4px 4px;color:#4b5563;font-weight:700;">%</th>';
    rh += '</tr></thead><tbody>';
    for (var ri = 0; ri < roomResults.length; ri++) {
      var rr = roomResults[ri];
      var pct = aggBTU > 0 ? (rr.totalBTU / aggBTU * 100) : 0;
      var shrWarn = rr.shr < 0.75;
      var pctWarn = pct > 30;
      rh += '<tr style="border-bottom:1px solid rgba(0,0,0,0.03);">';
      rh += '<td style="padding:5px 6px;white-space:nowrap;">' + rr.icon + ' ' + rr.name + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:#fbbf24;">' + Math.round(rr.totalSens * safety).toLocaleString() + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:#38bdf8;">' + Math.round(rr.totalLat * safety).toLocaleString() + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:#f87171;font-weight:700;">' + Math.round(rr.totalBTU * safety).toLocaleString() + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:' + (shrWarn ? '#fbbf24' : '#34d399') + ';">' + (rr.shr * 100).toFixed(0) + '%' + (shrWarn ? ' \u26A0\uFE0F' : '') + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:#c084fc;">' + Math.round(rr.cfm) + '</td>';
      rh += '<td style="text-align:right;padding:5px 4px;color:' + (pctWarn ? '#fbbf24' : '#3D3D3A') + ';font-weight:700;">' + pct.toFixed(0) + '%' + (pctWarn ? ' \u26A0\uFE0F' : '') + '</td>';
      rh += '</tr>';
    }
    rh += '</tbody></table></div>';

    // ===== ZONE RECOMMENDATIONS =====
    var recs = [];
    for (var ri = 0; ri < roomResults.length; ri++) {
      var rr = roomResults[ri];
      var pct = aggBTU > 0 ? (rr.totalBTU / aggBTU * 100) : 0;
      if ((rr.type === 'cocina' || rr.type === 'lavanderia') && pct > 25) {
        recs.push({icon:'\uD83D\uDCA8',color:'#38bdf8',text:rr.icon + ' ' + rr.name + ' (' + pct.toFixed(0) + '% ' + _t('ht_ct_of_load','de carga') + ') \u2014 ' + _t('ht_ct_exhaust_rec','Instalar ventilación de escape dedicada')});
      }
      if (pct > 30) {
        recs.push({icon:'\u2744\uFE0F',color:'#c084fc',text:rr.icon + ' ' + rr.name + ' (' + pct.toFixed(0) + '%) \u2014 ' + _t('ht_ct_minisplit_rec','Considere mini-split dedicado para esta zona')});
      }
      if (rr.shr < 0.75) {
        recs.push({icon:'\uD83D\uDCA7',color:'#fbbf24',text:rr.icon + ' ' + rr.name + ' (SHR ' + (rr.shr * 100).toFixed(0) + '%) \u2014 ' + _t('ht_ct_humidity_rec','Riesgo humedad, considere dehumidificador')});
      }
    }
    if (recs.length > 0) {
      rh += '<div style="font-size:9px;font-weight:700;color:#fbbf24;margin-bottom:6px;">' + _t('ht_ct_zone_recommendations','RECOMENDACIONES POR ZONA') + '</div>';
      for (var rci = 0; rci < recs.length; rci++) {
        rh += '<div style="background:rgba(' + (recs[rci].color === '#fbbf24' ? '251,191,36' : recs[rci].color === '#38bdf8' ? '56,189,248' : '192,132,252') + ',0.1);border:1px solid rgba(' + (recs[rci].color === '#fbbf24' ? '251,191,36' : recs[rci].color === '#38bdf8' ? '56,189,248' : '192,132,252') + ',0.25);border-radius:8px;padding:8px 10px;margin-bottom:4px;font-size:10px;color:' + recs[rci].color + ';">' + recs[rci].icon + ' ' + recs[rci].text + '</div>';
      }
    }
    rh += '</div>';

    // ===== EQUIPMENT SELECTION (4 cards) =====
    rh += '<div style="font-size:12px;font-weight:800;color:#34d399;margin:14px 0 8px;">Selecci\u00F3n de Equipo</div>';
    var eqTypes = [
      {n:'Mini Split',icon:'\u2744\uFE0F',seer:[15,20,25],brands:'Mitsubishi, Daikin, Fujitsu, LG',price:[2800,5500]},
      {n:'Central A/C',icon:'\uD83C\uDFE0',seer:[14,16,20],brands:'Carrier, Trane, Lennox, Goodman',price:[3500,7500]},
      {n:'Heat Pump',icon:'\uD83D\uDD04',seer:[14,17,22],brands:'Carrier, Trane, Daikin, Bosch',price:[4000,9000]},
      {n:'Package Unit',icon:'\uD83D\uDCE6',seer:[14,15,17],brands:'Carrier, Trane, Goodman, York',price:[3000,6500]}
    ];
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    for (var eti = 0; eti < eqTypes.length; eti++) {
      var eq = eqTypes[eti];
      var annCosts = [];
      for (var si = 0; si < 3; si++) annCosts.push(Math.round(totalBTU * 1000 / (eq.seer[si] * 1000) * 0.12));
      rh += '<div style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.18);border-radius:10px;padding:10px;">';
      rh += '<div style="font-size:13px;margin-bottom:4px;">' + eq.icon + '</div>';
      rh += '<div style="font-size:11px;font-weight:800;color:#111827;margin-bottom:2px;">' + eq.n + '</div>';
      rh += '<div style="font-size:16px;font-weight:900;color:#34d399;">' + recTon + ' Ton</div>';
      rh += '<div style="font-size:8px;color:#4b5563;margin-top:4px;">SEER2: ';
      rh += '<span style="color:#fb7185;">' + eq.seer[0] + '</span> / ';
      rh += '<span style="color:#fbbf24;">' + eq.seer[1] + '</span> / ';
      rh += '<span style="color:#34d399;">' + eq.seer[2] + '</span></div>';
      rh += '<div style="font-size:8px;color:#4b5563;margin-top:2px;">~$' + annCosts[0] + ' / $' + annCosts[1] + ' / $' + annCosts[2] + ' /a\u00F1o</div>';
      rh += '<div style="font-size:8px;color:#4b5563;margin-top:2px;">' + eq.brands + '</div>';
      rh += '<div style="font-size:8px;color:#4b5563;margin-top:2px;">$' + eq.price[0].toLocaleString() + ' \u2013 $' + eq.price[1].toLocaleString() + '</div>';
      rh += '</div>';
    }
    rh += '</div>';
    if (oversized) {
      rh += '<div style="margin-top:8px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:8px;font-size:10px;color:#fbbf24;font-weight:600;">\u26A0\uFE0F El equipo de ' + recTon + ' Ton est\u00E1 >30% sobre la carga. Riesgo de short-cycling y humedad excesiva.</div>';
    }
    rh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('carga') : '';

    resEl.innerHTML = rh;
    var iaBtn = document.getElementById('htCTIABtn');
    if (iaBtn) iaBtn.style.display = 'block';
  };

  // --- IA Diagnosis (enhanced per-room prompt) ---
  window._htCTDiagnose = function() {
    var d = window._htCTData;
    if (!d) return;
    var prompt = 'Eres un experto HVAC certificado. Un t\u00E9cnico calcul\u00F3 carga t\u00E9rmica Manual J ROOM-BY-ROOM con estos datos:\n' +
      '\u00C1rea total: ' + d.totalSqft + ' sqft, Pisos: ' + d.stories + ', Paredes: ' + d.wallH + ' ft\n' +
      'Ubicaci\u00F3n: Temp dise\u00F1o ' + d.outdoor + '\u00B0F, Wet bulb ' + d.wetBulb + '\u00B0F, Daily range ' + d.dailyRange + '\u00B0F\n' +
      'Orientaci\u00F3n default: ' + d.orient + ', Interior: ' + d.indoor + '\u00B0F\n' +
      'Paredes: ' + d.wallType + ' (R-' + d.wallR + '), Techo: ' + d.roofType + ' (R-' + d.roofR + '), Color: ' + d.roofColor + '\n' +
      'Piso: ' + d.floorType + '\n' +
      'Ventanas: ' + d.winType + ' (U=' + d.winU + ', SHGC=' + d.winSHGC + '), Fenestraci\u00F3n default: ' + d.fenPct + '%\n' +
      'Puertas: ' + d.numDoors + 'x ' + d.doorType + '\n' +
      'Hermeticidad: ' + d.tightness + ' (' + d.ach + ' ACH)' + (d.mechVent ? ', Vent mec ASHRAE 62.2' : '') + '\n' +
      'Electrodom: ' + d.appLevel + ', Luz: ' + d.lightType + '\n' +
      'Factor seguridad: ' + ((d.safety - 1) * 100).toFixed(0) + '%\n\n' +
      '=== RESULTADO GLOBAL ===\n' +
      'Total: ' + Math.round(d.totalBTU) + ' BTU/hr (' + d.tons.toFixed(1) + ' Ton)\n' +
      'Sensible: ' + Math.round(d.sensBTU) + ', Latente: ' + Math.round(d.latBTU) + ', SHR: ' + (d.shr * 100).toFixed(0) + '%\n' +
      'Equipo recomendado: ' + d.recTon + ' Ton\n\n' +
      '=== DESGLOSE POR HABITACI\u00D3N ===\n';
    for (var i = 0; i < d.roomResults.length; i++) {
      var rr = d.roomResults[i];
      var pct = d.totalBTU > 0 ? (rr.totalBTU * d.safety / d.totalBTU * 100) : 0;
      prompt += rr.icon + ' ' + rr.name + ' (' + rr.sqft + ' sqft): Sens=' + Math.round(rr.totalSens * d.safety) +
        ', Lat=' + Math.round(rr.totalLat * d.safety) + ', Total=' + Math.round(rr.totalBTU * d.safety) +
        ', SHR=' + (rr.shr * 100).toFixed(0) + '%, CFM=' + Math.round(rr.cfm) + ', ' + pct.toFixed(0) + '%\n';
    }
    prompt += '\n' + _t('ht_ai_alerts','ALERTAS') + ':\n';
    var alerts = 0;
    for (var i = 0; i < d.roomResults.length; i++) {
      var rr = d.roomResults[i];
      var pct = d.totalBTU > 0 ? (rr.totalBTU * d.safety / d.totalBTU * 100) : 0;
      if (rr.shr < 0.75) { prompt += '- ' + rr.name + ': SHR ' + _t('ht_ai_low','bajo') + ' (' + (rr.shr*100).toFixed(0) + '%) \u2014 ' + _t('ht_ai_humidity_risk','riesgo humedad') + '\n'; alerts++; }
      if (pct > 30) { prompt += '- ' + rr.name + ': ' + pct.toFixed(0) + '% ' + _t('ht_ai_total_load','de carga total') + ' \u2014 ' + _t('ht_ai_dedicated_zone','posible zona dedicada') + '\n'; alerts++; }
    }
    if (alerts === 0) prompt += '- ' + _t('ht_ai_no_critical_alerts','Ninguna alerta crítica') + '\n';
    prompt += '\n' + _t('ht_ai_ct_response_format','Responde EN ESPAÑOL:\n1. ¿El cálculo por habitación es razonable?\n2. ¿Alguna habitación tiene carga anormalmente alta/baja?\n3. ¿Se necesita zonificación (multi-zone, mini-splits, dampers)?\n4. Recomienda modelos específicos (Carrier, Trane, Goodman, Daikin, Mitsubishi, Lennox)\n5. SEER2 recomendado según clima\n6. Consideraciones de humedad para habitaciones con SHR bajo\n7. Distribución de CFM por cuarto — ¿balanceado?\n8. Costo estimado equipo + instalación');
    _htCallIA(prompt, 'htCTIA', 'htCTIABtn');
  };

  // ============================
  // WALK-IN COOLER/FREEZER SIZING PRO
  // ============================

  // ASHRAE Product Database — ~85 products in 15 categories
  var _htWIProducts = {
    carnes: { icon: '\uD83E\uDD69', name: 'Carnes', items: {
      res:     { n: 'Res',     spA: 0.77, spB: 0.40, lat: 100, fp: 28.0 },
      cerdo:   { n: 'Cerdo',   spA: 0.68, spB: 0.38, lat: 86,  fp: 28.0 },
      cordero: { n: 'Cordero', spA: 0.73, spB: 0.39, lat: 93,  fp: 29.0 },
      cabra:   { n: 'Cabra',   spA: 0.73, spB: 0.39, lat: 92,  fp: 28.0 }
    }},
    aves: { icon: '\uD83C\uDF57', name: 'Aves', items: {
      pollo: { n: 'Pollo', spA: 0.79, spB: 0.42, lat: 106, fp: 27.0 },
      pavo:  { n: 'Pavo',  spA: 0.75, spB: 0.39, lat: 97,  fp: 28.0 },
      pato:  { n: 'Pato',  spA: 0.65, spB: 0.35, lat: 78,  fp: 28.0 }
    }},
    pescados: { icon: '\uD83D\uDC1F', name: 'Pescados', items: {
      salmon:  { n: 'Salm\u00F3n',  spA: 0.81, spB: 0.42, lat: 113, fp: 28.0 },
      tilapia: { n: 'Tilapia', spA: 0.82, spB: 0.42, lat: 114, fp: 28.0 },
      bagre:   { n: 'Bagre',   spA: 0.82, spB: 0.42, lat: 114, fp: 28.0 },
      bacalao: { n: 'Bacalao', spA: 0.86, spB: 0.43, lat: 121, fp: 28.0 },
      atun:    { n: 'At\u00FAn',    spA: 0.80, spB: 0.41, lat: 109, fp: 28.0 }
    }},
    mariscos: { icon: '\uD83E\uDD90', name: 'Mariscos', items: {
      camaron:  { n: 'Camar\u00F3n',  spA: 0.83, spB: 0.43, lat: 116, fp: 28.0 },
      langosta: { n: 'Langosta', spA: 0.82, spB: 0.42, lat: 114, fp: 28.0 },
      cangrejo: { n: 'Cangrejo', spA: 0.84, spB: 0.43, lat: 118, fp: 28.0 },
      ostras:   { n: 'Ostras',   spA: 0.87, spB: 0.44, lat: 124, fp: 28.0 },
      calamar:  { n: 'Calamar',  spA: 0.83, spB: 0.43, lat: 116, fp: 28.0 }
    }},
    embutidos: { icon: '\uD83C\uDF56', name: 'Embutidos', items: {
      jamon:     { n: 'Jam\u00F3n',     spA: 0.68, spB: 0.38, lat: 86, fp: 28.0 },
      salami:    { n: 'Salami',    spA: 0.52, spB: 0.32, lat: 56, fp: 28.0 },
      salchicha: { n: 'Salchicha', spA: 0.66, spB: 0.37, lat: 82, fp: 28.0 },
      tocino:    { n: 'Tocino',    spA: 0.42, spB: 0.28, lat: 38, fp: 28.0 },
      hotdogs:   { n: 'Hot Dogs',  spA: 0.64, spB: 0.36, lat: 79, fp: 28.0 }
    }},
    quesos: { icon: '\uD83E\uDDC0', name: 'Quesos', items: {
      cheddar:    { n: 'Cheddar',    spA: 0.57, spB: 0.33, lat: 63,  fp: 18.0 },
      mozzarella: { n: 'Mozzarella', spA: 0.62, spB: 0.35, lat: 72,  fp: 20.0 },
      americano:  { n: 'Americano',  spA: 0.57, spB: 0.33, lat: 63,  fp: 18.0 },
      crema_q:    { n: 'Crema',      spA: 0.65, spB: 0.36, lat: 79,  fp: 25.0 },
      requeson:   { n: 'Reques\u00F3n',   spA: 0.84, spB: 0.43, lat: 118, fp: 29.0 }
    }},
    lacteos: { icon: '\uD83E\uDD5B', name: 'L\u00E1cteos', items: {
      crema_lac:   { n: 'Crema',       spA: 0.72, spB: 0.39, lat: 92,  fp: 30.0 },
      leche:       { n: 'Leche',       spA: 0.93, spB: 0.47, lat: 138, fp: 31.0 },
      mantequilla: { n: 'Mantequilla', spA: 0.35, spB: 0.25, lat: 28,  fp: 27.0 },
      yogurt:      { n: 'Yogurt',      spA: 0.89, spB: 0.45, lat: 131, fp: 30.0 },
      huevos:      { n: 'Huevos',      spA: 0.76, spB: 0.40, lat: 98,  fp: 28.0 }
    }},
    verduras: { icon: '\uD83E\uDD66', name: 'Verduras', items: {
      lechuga:   { n: 'Lechuga',   spA: 0.96, spB: 0.48, lat: 143, fp: 31.5, resp: 7000 },
      tomate:    { n: 'Tomate',    spA: 0.95, spB: 0.48, lat: 142, fp: 31.1, resp: 4800 },
      cebolla:   { n: 'Cebolla',   spA: 0.90, spB: 0.46, lat: 133, fp: 30.4, resp: 2300 },
      zanahoria: { n: 'Zanahoria', spA: 0.90, spB: 0.46, lat: 133, fp: 29.5, resp: 5400 },
      pimiento:  { n: 'Pimiento',  spA: 0.94, spB: 0.47, lat: 140, fp: 30.4, resp: 4800 },
      brocoli:   { n: 'Br\u00F3coli',   spA: 0.92, spB: 0.47, lat: 137, fp: 30.9, resp: 10000 },
      apio:      { n: 'Apio',      spA: 0.95, spB: 0.48, lat: 142, fp: 31.1, resp: 4200 },
      elote:     { n: 'Elote',     spA: 0.84, spB: 0.43, lat: 118, fp: 30.9, resp: 11000 },
      papa:      { n: 'Papa',      spA: 0.82, spB: 0.42, lat: 114, fp: 30.9, resp: 2800 },
      pepino:    { n: 'Pepino',    spA: 0.97, spB: 0.48, lat: 144, fp: 31.1, resp: 4000 },
      repollo:   { n: 'Repollo',   spA: 0.93, spB: 0.47, lat: 138, fp: 30.4, resp: 2200 },
      espinaca:  { n: 'Espinaca',  spA: 0.94, spB: 0.47, lat: 140, fp: 31.5, resp: 9000 },
      hongos:    { n: 'Hongos',    spA: 0.93, spB: 0.47, lat: 138, fp: 30.4, resp: 8400 }
    }},
    frutas: { icon: '\uD83C\uDF4E', name: 'Frutas', items: {
      manzana:  { n: 'Manzana',  spA: 0.87, spB: 0.44, lat: 124, fp: 29.3, resp: 1800 },
      platano:  { n: 'Pl\u00E1tano',  spA: 0.80, spB: 0.42, lat: 109, fp: 30.6, resp: 5900 },
      naranja:  { n: 'Naranja',  spA: 0.90, spB: 0.46, lat: 133, fp: 30.5, resp: 2200 },
      uva:      { n: 'Uva',      spA: 0.86, spB: 0.44, lat: 121, fp: 28.1, resp: 1500 },
      fresa:    { n: 'Fresa',    spA: 0.93, spB: 0.47, lat: 138, fp: 30.6, resp: 5200 },
      sandia:   { n: 'Sand\u00EDa',   spA: 0.97, spB: 0.48, lat: 144, fp: 31.3, resp: 2700 },
      mango:    { n: 'Mango',    spA: 0.85, spB: 0.43, lat: 119, fp: 30.3, resp: 4800 },
      pina:     { n: 'Pi\u00F1a',     spA: 0.88, spB: 0.45, lat: 128, fp: 30.0, resp: 2200 },
      limon:    { n: 'Lim\u00F3n',    spA: 0.92, spB: 0.47, lat: 137, fp: 28.4, resp: 1300 },
      durazno:  { n: 'Durazno',  spA: 0.90, spB: 0.46, lat: 133, fp: 30.3, resp: 3400 },
      aguacate: { n: 'Aguacate', spA: 0.72, spB: 0.39, lat: 92,  fp: 31.5, resp: 10400 }
    }},
    legumbres: { icon: '\uD83E\uDED8', name: 'Legumbres', items: {
      ejotes:    { n: 'Ejotes',     spA: 0.91, spB: 0.47, lat: 136, fp: 30.7, resp: 7400 },
      lentejas:  { n: 'Lentejas',   spA: 0.37, spB: 0.26, lat: 31,  fp: 28.0 },
      garbanzos: { n: 'Garbanzos',  spA: 0.37, spB: 0.26, lat: 31,  fp: 28.0 },
      chicharos: { n: 'Ch\u00EDcharos',  spA: 0.81, spB: 0.42, lat: 113, fp: 30.9, resp: 8800 }
    }},
    bebidas: { icon: '\uD83C\uDF7A', name: 'Bebidas', items: {
      cerveza:     { n: 'Cerveza',      spA: 0.92, spB: 0.47, lat: 137, fp: 28.0 },
      vino:        { n: 'Vino',         spA: 0.90, spB: 0.46, lat: 133, fp: 24.0 },
      refresco:    { n: 'Refresco',     spA: 0.92, spB: 0.47, lat: 137, fp: 28.0 },
      jugo:        { n: 'Jugo',         spA: 0.93, spB: 0.47, lat: 138, fp: 28.0 },
      agua:        { n: 'Agua',         spA: 1.00, spB: 0.50, lat: 144, fp: 32.0 },
      leche_beb:   { n: 'Leche',        spA: 0.93, spB: 0.47, lat: 138, fp: 31.0 },
      energeticas: { n: 'Energ\u00E9ticas', spA: 0.92, spB: 0.47, lat: 137, fp: 28.0 }
    }},
    flores: { icon: '\uD83C\uDF39', name: 'Flores', items: {
      rosas:    { n: 'Rosas',          spA: 0.87, spB: 0.44, lat: 124, fp: 31.0, resp: 2800 },
      arreglos: { n: 'Arreglos Mixtos', spA: 0.87, spB: 0.44, lat: 124, fp: 31.0, resp: 3000 }
    }},
    helados: { icon: '\uD83C\uDF66', name: 'Helados', items: {
      helado:  { n: 'Helado',  spA: 0.68, spB: 0.45, lat: 82,  fp: 21.0 },
      gelato:  { n: 'Gelato',  spA: 0.74, spB: 0.47, lat: 95,  fp: 23.0 },
      nieve:   { n: 'Nieve',   spA: 0.85, spB: 0.45, lat: 119, fp: 26.0 },
      paletas: { n: 'Paletas', spA: 0.80, spB: 0.45, lat: 109, fp: 24.0 }
    }},
    panaderia: { icon: '\uD83C\uDF5E', name: 'Panader\u00EDa', items: {
      pan:       { n: 'Pan',       spA: 0.60, spB: 0.34, lat: 69, fp: 20.0 },
      pasteles:  { n: 'Pasteles',  spA: 0.55, spB: 0.32, lat: 59, fp: 18.0 },
      pastel:    { n: 'Pastel',    spA: 0.60, spB: 0.34, lat: 69, fp: 20.0 },
      tortillas: { n: 'Tortillas', spA: 0.58, spB: 0.33, lat: 65, fp: 22.0 }
    }},
    preparada: { icon: '\uD83C\uDF72', name: 'Preparada', items: {
      comida_prep: { n: 'Comida Preparada', spA: 0.80, spB: 0.41, lat: 109, fp: 28.0 },
      sopas:       { n: 'Sopas',            spA: 0.94, spB: 0.47, lat: 140, fp: 29.0 },
      salsas:      { n: 'Salsas',           spA: 0.87, spB: 0.44, lat: 124, fp: 28.0 },
      masa:        { n: 'Masa',             spA: 0.70, spB: 0.38, lat: 87,  fp: 26.0 }
    }}
  };

  // Application type presets (7 types)
  var _htWIAppTypes = [
    { id: 'cooler_gen',  name: 'Cooler General',  icon: '\u2744\uFE0F', temp: 35, td: 10, rval: 25, desc: 'Carnes, l\u00E1cteos, deli' },
    { id: 'cooler_veg',  name: 'Cooler Verduras', icon: '\uD83E\uDD6C', temp: 34, td: 10, rval: 25, desc: 'Frutas, verduras, marketas' },
    { id: 'cooler_flor', name: 'Cooler Flores',   icon: '\uD83C\uDF38', temp: 36, td: 8,  rval: 25, desc: 'Florer\u00EDas (TD bajo)' },
    { id: 'cooler_bev',  name: 'Cooler Bebidas',  icon: '\uD83C\uDF7A', temp: 36, td: 10, rval: 25, desc: 'Licorer\u00EDas, conveniencia' },
    { id: 'semi_freeze', name: 'Semi-Freezer',    icon: '\uD83E\uDDCA', temp: 20, td: 10, rval: 32, desc: 'Semi-congelados' },
    { id: 'mid_freeze',  name: 'Mid-Freezer',     icon: '\uD83C\uDF66', temp: 0,  td: 8,  rval: 32, desc: 'Never\u00EDas, helader\u00EDas' },
    { id: 'deep_freeze', name: 'Deep Freezer',    icon: '\u26C4',       temp: -10,td: 10, rval: 40, desc: 'Congelaci\u00F3n profunda' }
  ];

  // Walk-in state
  window._htWIState = { appType: 'cooler_gen', glassOn: false, products: [], glassDoors: 2, glassW: 2.5, glassH: 6.5, glassR: 2.0 };

  function _htShowWalkin(s) {
    _htView = 'walkin';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var st = window._htWIState;
    if (!st.products.length) st.products = [{ cat: '', prod: '', lbs: '', tempIn: '' }];
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // Header
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:16px;font-weight:800;color:#111827;">' + _th('ht_walkin_title', 'Walk-in Sizing') + ' PRO</div>';
    h += '<div style="font-size:9px;color:#4b5563;">' + _th('ht_wi_subtitle', 'Base ASHRAE \u00B7 81 productos \u00B7 7 aplicaciones') + '</div></div></div></div>';
    h += '<div style="padding:12px;">';
    // App Type Grid
    h += '<div style="margin-bottom:12px;">';
    h += '<div style="font-size:9px;font-weight:700;color:#4b5563;margin-bottom:6px;">' + _th('ht_wi_app_type', 'TIPO DE APLICACI\u00D3N') + '</div>';
    h += '<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;">';
    for (var ai = 0; ai < _htWIAppTypes.length; ai++) {
      var at = _htWIAppTypes[ai];
      var isSel = st.appType === at.id;
      h += '<button onclick="_htWISetAppType(\'' + at.id + '\')" style="min-width:85px;flex-shrink:0;padding:8px 6px;background:' + (isSel ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.03)') + ';border:2px solid ' + (isSel ? '#3b82f6' : 'rgba(0,0,0,0.1)') + ';color:' + (isSel ? '#60a5fa' : '#3D3D3A') + ';border-radius:10px;font-size:9px;font-weight:700;cursor:pointer;text-align:center;line-height:1.3;">';
      h += at.icon + '<br>' + at.name + '<br><span style="font-size:7px;opacity:0.7;">' + at.temp + '\u00B0F</span></button>';
    }
    h += '</div></div>';
    // Dimensions
    h += '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#60a5fa;margin-bottom:10px;">' + _th('ht_wi_dimensions', 'Dimensiones del Cuarto') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
    var dims = [['htWILength','Largo (ft)','10'],['htWIWidth','Ancho (ft)','8'],['htWIHeight','Alto (ft)','8']];
    for (var di = 0; di < dims.length; di++) {
      h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + dims[di][1] + '</label>';
      h += '<input id="' + dims[di][0] + '" type="number" placeholder="' + dims[di][2] + '" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    }
    h += '</div></div>';
    // Conditions
    var curApp = null;
    for (var ca = 0; ca < _htWIAppTypes.length; ca++) { if (_htWIAppTypes[ca].id === st.appType) { curApp = _htWIAppTypes[ca]; break; } }
    if (!curApp) curApp = _htWIAppTypes[0];
    h += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#fbbf24;margin-bottom:10px;">' + _th('ht_wi_conditions', 'Condiciones de Operaci\u00F3n') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + _th('ht_wi_interior_temp', 'Temp Interior (\u00B0F)') + '</label>';
    h += '<input id="htWITempIn" type="number" value="' + curApp.temp + '" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + _th('ht_wi_ambient_temp', 'Temp Ambiente (\u00B0F)') + '</label>';
    h += '<input id="htWITempAmb" type="number" placeholder="90" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + _th('ht_wi_evap_td', 'TD Evaporador (\u00B0F)') + '</label>';
    h += '<input id="htWITD" type="number" value="' + curApp.td + '" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + _th('ht_wi_insulation', 'Aislamiento (R-value)') + '</label>';
    h += '<select id="htWIRValue" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:11px;outline:none;">';
    h += '<option value="18"' + (curApp.rval === 18 ? ' selected' : '') + '>R-18 (2" panel)</option>';
    h += '<option value="25"' + (curApp.rval === 25 ? ' selected' : '') + '>R-25 (3" panel)</option>';
    h += '<option value="32"' + (curApp.rval === 32 ? ' selected' : '') + '>R-32 (4" panel)</option>';
    h += '<option value="40"' + (curApp.rval === 40 ? ' selected' : '') + '>R-40 (5" panel)</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Uso de Puerta</label>';
    h += '<select id="htWIDoor" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:11px;outline:none;">';
    h += '<option value="light">Liviano (&lt; 4 apert/hr)</option>';
    h += '<option value="medium" selected>Medio (4-8 apert/hr)</option>';
    h += '<option value="heavy">Pesado (&gt; 8 apert/hr)</option>';
    h += '</select></div>';
    h += '</div></div>';
    // Glass Door Toggle
    h += '<div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;' + (st.glassOn ? 'margin-bottom:10px;' : '') + '">';
    h += '<div><div style="font-size:11px;font-weight:700;color:#a78bfa;">' + _th('ht_wi_glass_doors', 'Puertas de Vidrio') + '</div>';
    h += '<div style="font-size:8px;color:#4b5563;">Licorer\u00EDas, display walk-ins</div></div>';
    h += '<button onclick="_htWIToggleGlass()" style="width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;background:' + (st.glassOn ? '#8b5cf6' : 'rgba(0,0,0,0.12)') + ';position:relative;">';
    h += '<div style="width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;left:' + (st.glassOn ? '23px' : '3px') + ';"></div></button>';
    h += '</div>';
    if (st.glassOn) {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;">';
      h += '<div><label style="font-size:8px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Cantidad</label>';
      h += '<input id="htWIGlassQty" type="number" value="' + st.glassDoors + '" onchange="_htWIGlassChange()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:7px;font-size:11px;outline:none;box-sizing:border-box;"></div>';
      h += '<div><label style="font-size:8px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Ancho (ft)</label>';
      h += '<input id="htWIGlassW" type="number" value="' + st.glassW + '" step="0.5" onchange="_htWIGlassChange()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:7px;font-size:11px;outline:none;box-sizing:border-box;"></div>';
      h += '<div><label style="font-size:8px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Alto (ft)</label>';
      h += '<input id="htWIGlassH" type="number" value="' + st.glassH + '" step="0.5" onchange="_htWIGlassChange()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:7px;font-size:11px;outline:none;box-sizing:border-box;"></div>';
      h += '<div><label style="font-size:8px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">R-Vidrio</label>';
      h += '<select id="htWIGlassR" onchange="_htWIGlassChange()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:7px;font-size:10px;outline:none;">';
      var grvs = [1.5, 2.0, 2.5, 3.0];
      for (var gi = 0; gi < grvs.length; gi++) {
        h += '<option value="' + grvs[gi] + '"' + (st.glassR === grvs[gi] ? ' selected' : '') + '>R-' + grvs[gi].toFixed(1) + '</option>';
      }
      h += '</select></div></div>';
    }
    h += '</div>';
    // Product Builder
    h += '<div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#34d399;">Productos (Base ASHRAE)</div>';
    h += '<button onclick="_htWIAddProduct()" style="background:rgba(52,211,153,0.2);border:1px solid #34d399;color:#34d399;border-radius:8px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;">+ Agregar</button>';
    h += '</div>';
    h += '<div id="htWIProductList">' + _htWIRenderProductRows() + '</div></div>';
    // Calculate
    h += '<button onclick="_htWICalc()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#fff;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px;">Calcular Refrigeraci\u00F3n</button>';
    h += '<div id="htWIResults"></div>';
    h += '</div></div>';
    s.innerHTML = h;
  }

  // Render product rows HTML
  function _htWIRenderProductRows() {
    var st = window._htWIState;
    var h = '';
    for (var pi = 0; pi < st.products.length; pi++) {
      var p = st.products[pi];
      h += '<div style="display:grid;grid-template-columns:1fr 1fr 55px 55px 26px;gap:4px;margin-bottom:6px;align-items:end;" data-pidx="' + pi + '">';
      // Category
      h += '<div>' + (pi === 0 ? '<label style="font-size:7px;color:#4b5563;font-weight:600;display:block;margin-bottom:1px;">Categor\u00EDa</label>' : '');
      h += '<select onchange="_htWICatChange(' + pi + ',this.value)" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:6px 2px;font-size:10px;outline:none;">';
      h += '<option value="">\u2014 Cat \u2014</option>';
      var catKeys = Object.keys(_htWIProducts);
      for (var ci = 0; ci < catKeys.length; ci++) {
        var ck = catKeys[ci], cat = _htWIProducts[ck];
        h += '<option value="' + ck + '"' + (p.cat === ck ? ' selected' : '') + '>' + cat.icon + ' ' + cat.name + '</option>';
      }
      h += '</select></div>';
      // Product
      h += '<div>' + (pi === 0 ? '<label style="font-size:7px;color:#4b5563;font-weight:600;display:block;margin-bottom:1px;">Producto</label>' : '');
      h += '<select onchange="_htWIProdChange(' + pi + ',this.value)" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:6px 2px;font-size:10px;outline:none;">';
      h += '<option value="">\u2014 Prod \u2014</option>';
      if (p.cat && _htWIProducts[p.cat]) {
        var items = _htWIProducts[p.cat].items;
        var itemKeys = Object.keys(items);
        for (var ii = 0; ii < itemKeys.length; ii++) {
          h += '<option value="' + itemKeys[ii] + '"' + (p.prod === itemKeys[ii] ? ' selected' : '') + '>' + items[itemKeys[ii]].n + '</option>';
        }
      }
      h += '</select></div>';
      // Lbs
      h += '<div>' + (pi === 0 ? '<label style="font-size:7px;color:#4b5563;font-weight:600;display:block;margin-bottom:1px;">lbs/d\u00EDa</label>' : '');
      h += '<input type="number" value="' + (p.lbs || '') + '" placeholder="500" onchange="_htWILbsChange(' + pi + ',this.value)" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:6px 2px;font-size:10px;outline:none;box-sizing:border-box;"></div>';
      // Temp
      h += '<div>' + (pi === 0 ? '<label style="font-size:7px;color:#4b5563;font-weight:600;display:block;margin-bottom:1px;">T\u00B0F in</label>' : '');
      h += '<input type="number" value="' + (p.tempIn || '') + '" placeholder="70" onchange="_htWITempChange(' + pi + ',this.value)" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:6px 2px;font-size:10px;outline:none;box-sizing:border-box;"></div>';
      // Remove
      h += '<div>' + (pi === 0 ? '<label style="font-size:7px;color:transparent;display:block;margin-bottom:1px;">x</label>' : '');
      h += '<button onclick="_htWIRemoveProduct(' + pi + ')" style="background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.3);color:#f87171;border-radius:6px;width:100%;height:28px;cursor:pointer;font-size:11px;">\u2715</button></div>';
      h += '</div>';
    }
    return h;
  }

  // Sync product inputs from DOM to state
  function _htWISyncProducts() {
    var st = window._htWIState;
    var rows = document.querySelectorAll('[data-pidx]');
    for (var i = 0; i < rows.length; i++) {
      var idx = parseInt(rows[i].getAttribute('data-pidx'));
      if (idx >= 0 && idx < st.products.length) {
        var sels = rows[i].querySelectorAll('select');
        var inps = rows[i].querySelectorAll('input');
        if (sels[0]) st.products[idx].cat = sels[0].value;
        if (sels[1]) st.products[idx].prod = sels[1].value;
        if (inps[0]) st.products[idx].lbs = inps[0].value;
        if (inps[1]) st.products[idx].tempIn = inps[1].value;
      }
    }
  }

  // Set application type
  window._htWISetAppType = function(id) {
    var st = window._htWIState;
    st.appType = id;
    var app = null;
    for (var i = 0; i < _htWIAppTypes.length; i++) { if (_htWIAppTypes[i].id === id) { app = _htWIAppTypes[i]; break; } }
    if (!app) return;
    var el;
    el = document.getElementById('htWITempIn'); if (el) el.value = app.temp;
    el = document.getElementById('htWITD'); if (el) el.value = app.td;
    el = document.getElementById('htWIRValue'); if (el) el.value = app.rval;
    // Update button styles
    var btns = document.querySelectorAll('[onclick^="_htWISetAppType"]');
    for (var b = 0; b < btns.length; b++) {
      var m = btns[b].getAttribute('onclick').match(/'([^']+)'/);
      if (m) {
        var s = m[1] === id;
        btns[b].style.background = s ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.03)';
        btns[b].style.borderColor = s ? '#3b82f6' : 'rgba(0,0,0,0.1)';
        btns[b].style.color = s ? '#60a5fa' : '#3D3D3A';
      }
    }
  };

  // Toggle glass doors
  window._htWIToggleGlass = function() {
    _htWISyncProducts();
    // Preserve all form values before re-render
    var dL = document.getElementById('htWILength');
    var dW = document.getElementById('htWIWidth');
    var dH = document.getElementById('htWIHeight');
    var tIn = document.getElementById('htWITempIn');
    var tAmb = document.getElementById('htWITempAmb');
    var tTD = document.getElementById('htWITD');
    var rVal = document.getElementById('htWIRValue');
    var dUse = document.getElementById('htWIDoor');
    var savedL = dL ? dL.value : '';
    var savedW = dW ? dW.value : '';
    var savedH = dH ? dH.value : '';
    var savedTIn = tIn ? tIn.value : '';
    var savedTAmb = tAmb ? tAmb.value : '';
    var savedTD = tTD ? tTD.value : '';
    var savedRVal = rVal ? rVal.value : '';
    var savedDoor = dUse ? dUse.value : '';
    window._htWIState.glassOn = !window._htWIState.glassOn;
    var scr = document.getElementById('herramientasScreen');
    if (scr) {
      _htShowWalkin(scr);
      // Restore values
      dL = document.getElementById('htWILength'); if (dL && savedL) dL.value = savedL;
      dW = document.getElementById('htWIWidth'); if (dW && savedW) dW.value = savedW;
      dH = document.getElementById('htWIHeight'); if (dH && savedH) dH.value = savedH;
      tIn = document.getElementById('htWITempIn'); if (tIn && savedTIn) tIn.value = savedTIn;
      tAmb = document.getElementById('htWITempAmb'); if (tAmb && savedTAmb) tAmb.value = savedTAmb;
      tTD = document.getElementById('htWITD'); if (tTD && savedTD) tTD.value = savedTD;
      rVal = document.getElementById('htWIRValue'); if (rVal && savedRVal) rVal.value = savedRVal;
      dUse = document.getElementById('htWIDoor'); if (dUse && savedDoor) dUse.value = savedDoor;
    }
  };

  // Glass door field change
  window._htWIGlassChange = function() {
    var st = window._htWIState;
    var v;
    v = document.getElementById('htWIGlassQty'); if (v) st.glassDoors = parseFloat(v.value) || 2;
    v = document.getElementById('htWIGlassW'); if (v) st.glassW = parseFloat(v.value) || 2.5;
    v = document.getElementById('htWIGlassH'); if (v) st.glassH = parseFloat(v.value) || 6.5;
    v = document.getElementById('htWIGlassR'); if (v) st.glassR = parseFloat(v.value) || 2.0;
  };

  // Add product row
  window._htWIAddProduct = function() {
    _htWISyncProducts();
    window._htWIState.products.push({ cat: '', prod: '', lbs: '', tempIn: '' });
    var el = document.getElementById('htWIProductList');
    if (el) el.innerHTML = _htWIRenderProductRows();
  };

  // Remove product row
  window._htWIRemoveProduct = function(idx) {
    _htWISyncProducts();
    var st = window._htWIState;
    if (st.products.length <= 1) return;
    st.products.splice(idx, 1);
    var el = document.getElementById('htWIProductList');
    if (el) el.innerHTML = _htWIRenderProductRows();
  };

  // Category change
  window._htWICatChange = function(idx, val) {
    _htWISyncProducts();
    window._htWIState.products[idx].cat = val;
    window._htWIState.products[idx].prod = '';
    var el = document.getElementById('htWIProductList');
    if (el) el.innerHTML = _htWIRenderProductRows();
  };

  // Product change
  window._htWIProdChange = function(idx, val) {
    _htWISyncProducts();
    window._htWIState.products[idx].prod = val;
  };

  // Lbs change
  window._htWILbsChange = function(idx, val) {
    _htWISyncProducts();
    window._htWIState.products[idx].lbs = val;
  };

  // Temp change
  window._htWITempChange = function(idx, val) {
    _htWISyncProducts();
    window._htWIState.products[idx].tempIn = val;
  };

  // Calculation engine
  window._htWICalc = function() {
    _htWISyncProducts();
    var L = parseFloat(document.getElementById('htWILength').value) || 0;
    var W = parseFloat(document.getElementById('htWIWidth').value) || 0;
    var H = parseFloat(document.getElementById('htWIHeight').value) || 0;
    var tempIn = parseFloat(document.getElementById('htWITempIn').value) || 35;
    var tempAmb = parseFloat(document.getElementById('htWITempAmb').value) || 90;
    var rValue = parseFloat(document.getElementById('htWIRValue').value) || 25;
    var doorUse = document.getElementById('htWIDoor').value;
    var td = parseFloat(document.getElementById('htWITD').value) || 10;
    var st = window._htWIState;
    var resEl = document.getElementById('htWIResults');
    if (!resEl) return;
    if (L <= 0 || W <= 0 || H <= 0) { resEl.innerHTML = '<div style="padding:10px;color:#f87171;font-size:11px;">Ingrese dimensiones v\u00E1lidas</div>'; return; }
    var isFreezer = tempIn <= 32;
    window._htWIType = isFreezer ? 'freezer' : 'cooler';
    var dt = tempAmb - tempIn;
    var volume = L * W * H;
    // Surface area
    var floorCeiling = 2 * L * W;
    var walls = 2 * (L * H + W * H);
    var totalSA = floorCeiling + walls;
    // Glass door area
    var glassDoorArea = 0, glassTransLoad = 0;
    if (st.glassOn) {
      glassDoorArea = st.glassDoors * st.glassW * st.glassH;
      glassTransLoad = glassDoorArea * dt * 24 / st.glassR;
    }
    // Panel transmission (wall area minus glass)
    var panelArea = totalSA - glassDoorArea;
    if (panelArea < 0) panelArea = 0;
    var panelTransLoad = panelArea * dt * 24 / rValue;
    var transmissionLoad = panelTransLoad + glassTransLoad;
    // Infiltration
    var airChanges;
    if (volume < 200) airChanges = isFreezer ? 14 : 17;
    else if (volume < 500) airChanges = isFreezer ? 9.5 : 12;
    else if (volume < 1000) airChanges = isFreezer ? 7 : 8.5;
    else if (volume < 2000) airChanges = isFreezer ? 5.5 : 6.5;
    else airChanges = isFreezer ? 4 : 5;
    var doorMult = { light: 0.8, medium: 1.0, heavy: 1.5 };
    airChanges *= doorMult[doorUse] || 1.0;
    var btuPerCuFt = isFreezer ? 3.5 : 1.8;
    var infiltrationLoad = volume * airChanges * btuPerCuFt;
    // Product load per item — ASHRAE data
    var totalProductLoad = 0, totalRespLoad = 0, productDetails = [];
    for (var pi = 0; pi < st.products.length; pi++) {
      var p = st.products[pi];
      var lbs = parseFloat(p.lbs) || 0;
      if (lbs <= 0) continue;
      var pTemp = parseFloat(p.tempIn) || 70;
      var data = null;
      if (p.cat && p.prod && _htWIProducts[p.cat] && _htWIProducts[p.cat].items[p.prod]) {
        data = _htWIProducts[p.cat].items[p.prod];
      }
      if (!data) data = { n: 'Gen\u00E9rico', spA: 0.80, spB: 0.40, lat: 144, fp: 30.0 };
      var pLoad = 0;
      if (pTemp <= tempIn) {
        pLoad = 0;
      } else if (tempIn >= data.fp) {
        // Case A: above freezing -> above freezing
        pLoad = lbs * data.spA * (pTemp - tempIn);
      } else if (pTemp > data.fp) {
        // Case B: crosses freezing point (3-stage)
        pLoad = lbs * data.spA * (pTemp - data.fp);
        pLoad += lbs * data.lat;
        pLoad += lbs * data.spB * (data.fp - tempIn);
      } else {
        // Case C: already frozen -> colder
        pLoad = lbs * data.spB * (pTemp - tempIn);
      }
      // Respiration (fruits, vegetables, flowers)
      var rLoad = 0;
      if (data.resp && tempIn > data.fp) {
        rLoad = (lbs / 2000) * data.resp;
      }
      totalProductLoad += pLoad;
      totalRespLoad += rLoad;
      productDetails.push({ name: data.n, lbs: lbs, btu: Math.round(pLoad + rLoad), resp: Math.round(rLoad) });
    }
    // Internal loads
    var lightLoad = volume * 1.2;
    var motorLoad = isFreezer ? 7000 : 4000;
    var miscLoad = volume * 0.5;
    // Total
    var subtotalDaily = transmissionLoad + infiltrationLoad + totalProductLoad + totalRespLoad + lightLoad + motorLoad + miscLoad;
    var safetyLoad = subtotalDaily * 0.10;
    var totalDaily = subtotalDaily + safetyLoad;
    var runtime = isFreezer ? 18 : 16;
    var btuHr = totalDaily / runtime;
    var tons = btuHr / 12000;
    var hp = tons * (isFreezer ? 2.0 : 1.5);
    var evapBTU = btuHr * (isFreezer ? 1.3 : 1.2);
    var coilTemp = tempIn - td;
    // Store for PDF
    window._htWILastResult = {
      appType: st.appType, tempIn: tempIn, tempAmb: tempAmb, rValue: rValue, td: td,
      L: L, W: W, H: H, volume: volume, totalSA: totalSA,
      glassOn: st.glassOn, glassDoorArea: glassDoorArea,
      btuHr: btuHr, tons: tons, hp: hp, evapBTU: evapBTU, coilTemp: coilTemp,
      runtime: runtime, isFreezer: isFreezer,
      panelTransLoad: panelTransLoad, glassTransLoad: glassTransLoad,
      transmissionLoad: transmissionLoad, infiltrationLoad: infiltrationLoad,
      totalProductLoad: totalProductLoad, totalRespLoad: totalRespLoad,
      lightLoad: lightLoad, motorLoad: motorLoad, miscLoad: miscLoad,
      safetyLoad: safetyLoad, totalDaily: totalDaily, productDetails: productDetails
    };
    // Render results
    var appName = '';
    for (var an = 0; an < _htWIAppTypes.length; an++) { if (_htWIAppTypes[an].id === st.appType) { appName = _htWIAppTypes[an].name; break; } }
    if (!appName) appName = 'Walk-in';
    var rh = '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;">';
    rh += '<div style="font-size:11px;font-weight:700;color:' + (isFreezer ? '#a78bfa' : '#60a5fa') + ';margin-bottom:10px;">Resultado \u2014 ' + appName + '</div>';
    // Main stats
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
    var ms = [
      ['CARGA TOTAL', Math.round(btuHr).toLocaleString() + ' BTU/hr', '#f87171'],
      ['TONELADAS', tons.toFixed(2) + ' Ton', '#60a5fa'],
      ['COMPRESOR', hp.toFixed(1) + ' HP', '#34d399']
    ];
    for (var mi = 0; mi < ms.length; mi++) {
      rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;">';
      rh += '<div style="font-size:7px;color:#4b5563;font-weight:600;">' + ms[mi][0] + '</div>';
      rh += '<div style="font-size:14px;font-weight:900;color:' + ms[mi][2] + ';">' + ms[mi][1] + '</div></div>';
    }
    rh += '</div>';
    // Secondary stats
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">EVAPORADOR</div><div style="font-size:12px;font-weight:800;color:#fbbf24;">' + Math.round(evapBTU).toLocaleString() + ' BTU</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">VOLUMEN</div><div style="font-size:12px;font-weight:800;color:#fb923c;">' + Math.round(volume) + ' ft\u00B3</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">COIL TEMP</div><div style="font-size:12px;font-weight:800;color:#c084fc;">' + coilTemp + '\u00B0F</div></div>';
    rh += '</div>';
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">SUPERFICIE</div><div style="font-size:12px;font-weight:800;color:#38bdf8;">' + Math.round(totalSA) + ' ft\u00B2</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">RUNTIME</div><div style="font-size:12px;font-weight:800;color:#fb923c;">' + runtime + ' hr/d\u00EDa</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">TD EVAP</div><div style="font-size:12px;font-weight:800;color:#a78bfa;">' + td + '\u00B0F</div></div>';
    rh += '</div>';
    // Breakdown
    rh += '<div style="font-size:9px;font-weight:700;color:#4b5563;margin-bottom:6px;">DESGLOSE (BTU/24hr)</div>';
    var bd = [
      ['Transmisi\u00F3n paneles', panelTransLoad, '#60a5fa'],
      ['Transmisi\u00F3n vidrio', glassTransLoad, '#a78bfa'],
      ['Infiltraci\u00F3n (aire)', infiltrationLoad, '#fbbf24'],
      ['Producto (enfriamiento)', totalProductLoad, '#34d399'],
      ['Respiraci\u00F3n', totalRespLoad, '#10b981'],
      ['Iluminaci\u00F3n', lightLoad, '#c084fc'],
      ['Motores evaporador', motorLoad, '#fb923c'],
      ['Miscel\u00E1neo', miscLoad, '#57574F'],
      ['Factor seguridad 10%', safetyLoad, '#57574F']
    ];
    for (var bdi = 0; bdi < bd.length; bdi++) {
      if (bd[bdi][1] <= 0) continue;
      var pct2 = totalDaily > 0 ? (bd[bdi][1] / totalDaily * 100) : 0;
      rh += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">';
      rh += '<div style="flex:1;font-size:8px;color:#4b5563;">' + bd[bdi][0] + '</div>';
      rh += '<div style="width:60px;text-align:right;font-size:9px;font-weight:700;color:' + bd[bdi][2] + ';">' + Math.round(bd[bdi][1]).toLocaleString() + '</div>';
      rh += '<div style="width:35px;"><div style="height:5px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + pct2 + '%;background:' + bd[bdi][2] + ';border-radius:3px;"></div></div></div>';
      rh += '</div>';
    }
    // Product detail table
    if (productDetails.length > 0) {
      rh += '<div style="margin-top:10px;font-size:9px;font-weight:700;color:#4b5563;margin-bottom:6px;">DETALLE POR PRODUCTO</div>';
      for (var pdi = 0; pdi < productDetails.length; pdi++) {
        var pd = productDetails[pdi];
        rh += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">';
        rh += '<div style="flex:1;font-size:8px;color:#111827;">' + pd.name + ' <span style="color:#4b5563;">(' + pd.lbs + ' lbs)</span></div>';
        rh += '<div style="font-size:9px;font-weight:700;color:#34d399;">' + pd.btu.toLocaleString() + ' BTU</div>';
        if (pd.resp > 0) rh += '<div style="font-size:7px;color:#10b981;width:55px;text-align:right;">resp: ' + pd.resp.toLocaleString() + '</div>';
        rh += '</div>';
      }
    }
    // TD / humidity note
    rh += '<div style="margin-top:10px;padding:8px;background:rgba(139,92,246,0.1);border-radius:8px;font-size:9px;color:#a78bfa;">';
    rh += 'TD = ' + td + '\u00B0F \u2192 Coil = ' + coilTemp + '\u00B0F \u00B7 ';
    if (td <= 8) rh += 'Humedad alta (~90%) \u2014 ideal flores/verduras';
    else if (td <= 10) rh += 'Humedad media (~85%) \u2014 uso general';
    else rh += 'Humedad baja (~75%) \u2014 puede resecar producto';
    rh += '</div>';
    rh += '</div>';
    rh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('walkin') : '';
    resEl.innerHTML = rh;
  };


  // ============================
  // REFRIGERANT CHARGE CALCULATOR + RECOVERY ESTIMATOR
  // ============================
  function _htShowRefCharge(s) {
    _htView = 'refcharge';
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:16px;font-weight:800;color:#111827;">Carga de Refrigerante</div>';
    h += '<div style="font-size:9px;color:#4b5563;">C\u00E1lculo de carga + estimaci\u00F3n de recuperaci\u00F3n</div></div></div></div>';
    h += '<div style="padding:12px;">';
    // Tab selector: Charge Calculator vs Recovery Estimator
    h += '<div style="display:flex;gap:4px;margin-bottom:12px;">';
    h += '<button id="htRCTabCharge" onclick="_htRCTab(\'charge\')" style="flex:1;padding:10px;background:rgba(251,191,36,0.2);border:2px solid #fbbf24;color:#fbbf24;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;">Carga del Sistema</button>';
    h += '<button id="htRCTabRecovery" onclick="_htRCTab(\'recovery\')" style="flex:1;padding:10px;background:rgba(0,0,0,0.03);border:2px solid rgba(0,0,0,0.1);color:#4b5563;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;">Recuperaci\u00F3n</button>';
    h += '</div>';
    // ---- CHARGE CALCULATOR ----
    h += '<div id="htRCChargePanel">';
    h += '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#fbbf24;margin-bottom:10px;">' + _th('ht_rc_system_data', 'Datos del Sistema') + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += '<div style="grid-column:span 2;"><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">' + _th('ht_rc_system_type', 'Tipo de Sistema') + '</label>';
    h += '<select id="htRCSysType" onchange="_htRCUpdateDefaults()" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    h += '<option value="split_ac">Split A/C (Residencial)</option>';
    h += '<option value="mini_split">Mini Split (Ductless)</option>';
    h += '<option value="heat_pump">Heat Pump</option>';
    h += '<option value="package">Package Unit</option>';
    h += '<option value="ptac">PTAC / Window Unit</option>';
    h += '<option value="reach_in">Reach-in Cooler</option>';
    h += '<option value="walkin_cooler">Walk-in Cooler</option>';
    h += '<option value="walkin_freezer">Walk-in Freezer</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Tonelaje</label>';
    h += '<select id="htRCTons" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    var tons = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 7.5, 10, 12.5, 15, 20];
    for (var ti = 0; ti < tons.length; ti++) { h += '<option value="' + tons[ti] + '"' + (tons[ti] === 3 ? ' selected' : '') + '>' + tons[ti] + ' Ton</option>'; }
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Refrigerante</label>';
    h += '<select id="htRCRef" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    var refs = ['R-410A','R-22','R-134a','R-404A','R-407C','R-32','R-290'];
    for (var ri = 0; ri < refs.length; ri++) { h += '<option value="' + refs[ri] + '"' + (ri === 0 ? ' selected' : '') + '>' + refs[ri] + '</option>'; }
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Lineset L\u00EDquido (ft)</label>';
    h += '<input id="htRCLineL" type="number" value="25" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Di\u00E1metro L\u00EDquido (in)</label>';
    h += '<select id="htRCDiaL" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    h += '<option value="0.25">1/4"</option><option value="0.3125" selected>5/16"</option><option value="0.375">3/8"</option><option value="0.5">1/2"</option><option value="0.625">5/8"</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Carga de f\u00E1brica incluida (ft)</label>';
    h += '<input id="htRCFactory" type="number" value="15" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '</div></div>';
    h += '<button onclick="_htRCCalcCharge()" style="width:100%;padding:14px;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;color:#fff;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px;">Calcular Carga</button>';
    h += '<div id="htRCChargeResult"></div>';
    h += '</div>';
    // ---- RECOVERY ESTIMATOR ----
    h += '<div id="htRCRecoveryPanel" style="display:none;">';
    h += '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#60a5fa;margin-bottom:10px;">Datos de Recuperaci\u00F3n</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Carga del Sistema (lbs)</label>';
    h += '<input id="htRCRecLbs" type="number" value="8" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Cilindro Disponible</label>';
    h += '<select id="htRCCylinder" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    h += '<option value="30">30 lb DOT (gris)</option><option value="50" selected>50 lb DOT (gris)</option>';
    h += '<option value="125">125 lb DOT</option><option value="400">400 lb recovery</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Refrigerante ya en cilindro (lbs)</label>';
    h += '<input id="htRCCylUsed" type="number" value="0" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Temp Ambiente (\u00B0F)</label>';
    h += '<input id="htRCRecTemp" type="number" value="80" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '</div></div>';
    h += '<button onclick="_htRCCalcRecovery()" style="width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;color:#fff;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px;">Calcular Recuperaci\u00F3n</button>';
    h += '<div id="htRCRecResult"></div>';
    // EPA rules reference
    h += '<div style="margin-top:10px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:12px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#f87171;margin-bottom:6px;">Reglas EPA de Recuperaci\u00F3n</div>';
    h += '<div style="font-size:9px;color:#4b5563;line-height:1.7;">';
    h += '\u2022 <b style="color:#111827;">80% Rule</b>: NUNCA llenar cilindro m\u00E1s del 80% de su capacidad<br>';
    h += '\u2022 <b style="color:#111827;">No mezclar</b>: NUNCA mezclar refrigerantes en el mismo cilindro<br>';
    h += '\u2022 <b style="color:#111827;">Recover before service</b>: Recuperar antes de reparar (venting = ilegal)<br>';
    h += '\u2022 <b style="color:#111827;">Aparatos peque\u00F1os</b>: < 200 lbs = recuperar 80% carga O 0 psig<br>';
    h += '\u2022 <b style="color:#111827;">High pressure</b>: \u2265 200 lbs = recuperar a 0 psig<br>';
    h += '\u2022 <b style="color:#111827;">Very high pressure</b>: R-410A, R-32 = recuperar a 0 psig';
    h += '</div></div>';
    h += '</div>';
    h += '</div></div>';
    s.innerHTML = h;
  }

  window._htRCTab = function(tab) {
    var chargePanel = document.getElementById('htRCChargePanel');
    var recoveryPanel = document.getElementById('htRCRecoveryPanel');
    var chargeBtn = document.getElementById('htRCTabCharge');
    var recoveryBtn = document.getElementById('htRCTabRecovery');
    if (tab === 'charge') {
      if (chargePanel) chargePanel.style.display = 'block';
      if (recoveryPanel) recoveryPanel.style.display = 'none';
      if (chargeBtn) { chargeBtn.style.background = 'rgba(251,191,36,0.2)'; chargeBtn.style.borderColor = '#fbbf24'; chargeBtn.style.color = '#fbbf24'; }
      if (recoveryBtn) { recoveryBtn.style.background = 'rgba(0,0,0,0.03)'; recoveryBtn.style.borderColor = 'rgba(0,0,0,0.1)'; recoveryBtn.style.color = '#3D3D3A'; }
    } else {
      if (chargePanel) chargePanel.style.display = 'none';
      if (recoveryPanel) recoveryPanel.style.display = 'block';
      if (recoveryBtn) { recoveryBtn.style.background = 'rgba(59,130,246,0.2)'; recoveryBtn.style.borderColor = '#3b82f6'; recoveryBtn.style.color = '#60a5fa'; }
      if (chargeBtn) { chargeBtn.style.background = 'rgba(0,0,0,0.03)'; chargeBtn.style.borderColor = 'rgba(0,0,0,0.1)'; chargeBtn.style.color = '#3D3D3A'; }
    }
  };

  window._htRCUpdateDefaults = function() {
    var sysType = document.getElementById('htRCSysType').value;
    var factoryEl = document.getElementById('htRCFactory');
    var defaults = { split_ac: 15, mini_split: 25, heat_pump: 15, package: 0, ptac: 0, reach_in: 0, walkin_cooler: 0, walkin_freezer: 0 };
    if (factoryEl && defaults[sysType] !== undefined) factoryEl.value = defaults[sysType];
  };

  window._htRCCalcCharge = function() {
    var sysType = document.getElementById('htRCSysType').value;
    var tonnage = parseFloat(document.getElementById('htRCTons').value) || 3;
    var refType = document.getElementById('htRCRef').value;
    var lineLength = parseFloat(document.getElementById('htRCLineL').value) || 0;
    var lineDia = parseFloat(document.getElementById('htRCDiaL').value) || 0.3125;
    var factoryFt = parseFloat(document.getElementById('htRCFactory').value) || 0;
    var resEl = document.getElementById('htRCChargeResult');
    if (!resEl) return;
    // Base charge per ton (oz) by system type
    var basePerTon = { split_ac: 34, mini_split: 28, heat_pump: 36, package: 38, ptac: 24, reach_in: 16, walkin_cooler: 32, walkin_freezer: 40 };
    var baseOz = (basePerTon[sysType] || 34) * tonnage;
    // Additional charge per foot of lineset beyond factory charge
    var extraFt = Math.max(0, lineLength - factoryFt);
    // Oz per foot based on liquid line diameter
    var ozPerFt = { 0.25: 0.3, 0.3125: 0.6, 0.375: 0.9, 0.5: 1.5, 0.625: 2.2 };
    var addOz = extraFt * (ozPerFt[lineDia] || 0.6);
    var totalOz = baseOz + addOz;
    var totalLbs = totalOz / 16;
    var rh = '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px;">';
    rh += '<div style="font-size:11px;font-weight:700;color:#fbbf24;margin-bottom:10px;">Resultado de Carga</div>';
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">CARGA TOTAL</div><div style="font-size:22px;font-weight:900;color:#fbbf24;">' + totalOz.toFixed(0) + ' oz</div><div style="font-size:10px;color:#4b5563;">' + totalLbs.toFixed(1) + ' lbs</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:8px;color:#4b5563;font-weight:600;">CARGA ADICIONAL</div><div style="font-size:22px;font-weight:900;color:#fb923c;">' + addOz.toFixed(1) + ' oz</div><div style="font-size:10px;color:#4b5563;">por ' + extraFt.toFixed(0) + ' ft extra</div></div>';
    rh += '</div>';
    // Breakdown
    rh += '<div style="font-size:9px;color:#4b5563;line-height:1.8;">';
    rh += 'Carga base (' + tonnage + ' ton): <span style="color:#111827;font-weight:700;">' + baseOz.toFixed(0) + ' oz</span><br>';
    rh += 'Lineset extra (' + extraFt.toFixed(0) + ' ft x ' + (ozPerFt[lineDia] || 0.6).toFixed(1) + ' oz/ft): <span style="color:#111827;font-weight:700;">' + addOz.toFixed(1) + ' oz</span><br>';
    rh += 'Carga f\u00E1brica incluye: <span style="color:#111827;font-weight:700;">' + factoryFt + ' ft de lineset</span>';
    rh += '</div>';
    // Note
    rh += '<div style="margin-top:8px;padding:8px;background:rgba(245,158,11,0.1);border-radius:8px;font-size:9px;color:#fbbf24;">';
    rh += '\u26A0\uFE0F Estos son valores estimados. Siempre verificar la placa del equipo (nameplate) para la carga exacta de f\u00E1brica y ajuste por lineset.</div>';
    rh += '</div>';
    rh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('refcharge') : '';
    resEl.innerHTML = rh;
  };

  window._htRCCalcRecovery = function() {
    var sysCharge = parseFloat(document.getElementById('htRCRecLbs').value) || 0;
    var cylSize = parseFloat(document.getElementById('htRCCylinder').value) || 50;
    var cylUsed = parseFloat(document.getElementById('htRCCylUsed').value) || 0;
    var ambTemp = parseFloat(document.getElementById('htRCRecTemp').value) || 80;
    var resEl = document.getElementById('htRCRecResult');
    if (!resEl) return;
    // 80% rule
    var maxCapacity = cylSize * 0.80;
    var available = maxCapacity - cylUsed;
    var canRecover = available >= sysCharge;
    var fillPct = cylUsed > 0 ? ((cylUsed + sysCharge) / cylSize * 100) : (sysCharge / cylSize * 100);
    var rh = '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;">';
    rh += '<div style="font-size:11px;font-weight:700;color:#60a5fa;margin-bottom:10px;">Resultado de Recuperaci\u00F3n</div>';
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">CAPACIDAD 80%</div><div style="font-size:14px;font-weight:900;color:#60a5fa;">' + maxCapacity.toFixed(1) + ' lb</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">DISPONIBLE</div><div style="font-size:14px;font-weight:900;color:' + (available >= sysCharge ? '#34d399' : '#f87171') + ';">' + available.toFixed(1) + ' lb</div></div>';
    rh += '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:7px;color:#4b5563;font-weight:600;">A RECUPERAR</div><div style="font-size:14px;font-weight:900;color:#fbbf24;">' + sysCharge.toFixed(1) + ' lb</div></div>';
    rh += '</div>';
    // Visual fill bar
    rh += '<div style="margin-bottom:10px;">';
    rh += '<div style="font-size:9px;color:#4b5563;margin-bottom:4px;">Llenado del cilindro despu\u00E9s de recuperar:</div>';
    rh += '<div style="height:24px;background:rgba(0,0,0,0.06);border-radius:12px;overflow:hidden;position:relative;">';
    var usedPct = (cylUsed / cylSize * 100);
    var newPct = Math.min(fillPct, 100);
    if (cylUsed > 0) {
      rh += '<div style="position:absolute;left:0;top:0;height:100%;width:' + usedPct + '%;background:#57574F;"></div>';
    }
    rh += '<div style="position:absolute;left:' + usedPct + '%;top:0;height:100%;width:' + Math.min(sysCharge / cylSize * 100, 100 - usedPct) + '%;background:' + (fillPct > 80 ? '#f87171' : '#3b82f6') + ';"></div>';
    // 80% line
    rh += '<div style="position:absolute;left:80%;top:0;height:100%;width:2px;background:#fbbf24;"></div>';
    rh += '<div style="position:absolute;right:4px;top:4px;font-size:8px;color:#fbbf24;font-weight:700;">80%</div>';
    rh += '</div>';
    rh += '<div style="font-size:10px;text-align:center;margin-top:4px;font-weight:800;color:' + (fillPct > 80 ? '#f87171' : '#34d399') + ';">' + fillPct.toFixed(1) + '% lleno</div>';
    rh += '</div>';
    // Status
    if (canRecover) {
      rh += '<div style="padding:10px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:8px;text-align:center;">';
      rh += '<div style="font-size:12px;font-weight:800;color:#34d399;">\u2705 CILINDRO TIENE CAPACIDAD</div>';
      rh += '<div style="font-size:9px;color:#4b5563;margin-top:2px;">Espacio disponible: ' + available.toFixed(1) + ' lbs | Necesario: ' + sysCharge.toFixed(1) + ' lbs</div></div>';
    } else {
      rh += '<div style="padding:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:8px;text-align:center;">';
      rh += '<div style="font-size:12px;font-weight:800;color:#f87171;">\u274C CILINDRO NO TIENE SUFICIENTE CAPACIDAD</div>';
      rh += '<div style="font-size:9px;color:#4b5563;margin-top:2px;">Necesita ' + (sysCharge - available).toFixed(1) + ' lbs m\u00E1s de espacio. Use un cilindro m\u00E1s grande o vac\u00EDe este.</div></div>';
    }
    rh += '</div>';
    resEl.innerHTML = rh;
  };

  // ============================
  // REFRIGERANT LINE SIZING REFERENCE
  // ============================
  function _htShowLineSize(s) {
    _htView = 'linesize';
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:16px;font-weight:800;color:#111827;">Line Sizing</div>';
    h += '<div style="font-size:9px;color:#4b5563;">Tuber\u00EDa de refrigerante por capacidad</div></div></div></div>';
    h += '<div style="padding:12px;">';
    // Inputs
    h += '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px;margin-bottom:10px;">';
    h += '<div style="font-size:11px;font-weight:700;color:#fbbf24;margin-bottom:10px;">Par\u00E1metros</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Refrigerante</label>';
    h += '<select id="htLSRef" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    h += '<option value="R-410A" selected>R-410A</option><option value="R-22">R-22</option><option value="R-134a">R-134a</option><option value="R-404A">R-404A</option><option value="R-32">R-32</option>';
    h += '</select></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Capacidad (Tons)</label>';
    h += '<input id="htLSTons" type="number" value="3" step="0.5" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Longitud equivalente (ft)</label>';
    h += '<input id="htLSLength" type="number" value="50" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Temp. Condensaci\u00F3n (\u00B0F)</label>';
    h += '<input id="htLSCondT" type="number" value="110" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Temp. Evaporaci\u00F3n (\u00B0F)</label>';
    h += '<input id="htLSEvapT" type="number" value="40" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:2px;">Elevaci\u00F3n vertical (ft)</label>';
    h += '<input id="htLSRise" type="number" value="0" style="width:100%;background:#FFFFFF;color:#111827;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;box-sizing:border-box;"></div>';
    h += '</div></div>';
    h += '<button onclick="_htLSCalc()" style="width:100%;padding:14px;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;color:#fff;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px;">Calcular Line Sizing</button>';
    h += '<div id="htLSResult"></div>';
    // Standard reference table
    h += '<div style="margin-top:10px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:12px;">';
    h += '<div style="font-size:10px;font-weight:700;color:#fb923c;margin-bottom:8px;">Referencia R\u00E1pida \u2014 R-410A (A/C, 100ft equiv.)</div>';
    var quickRef = [
      ['1.5', '3/8"', '3/4"', '5/8"'],
      ['2', '3/8"', '3/4"', '5/8"'],
      ['2.5', '3/8"', '7/8"', '3/4"'],
      ['3', '3/8"', '7/8"', '3/4"'],
      ['3.5', '3/8"', '7/8"', '3/4"'],
      ['4', '3/8"', '7/8"', '3/4"'],
      ['5', '3/8"', '1-1/8"', '7/8"'],
      ['7.5', '1/2"', '1-3/8"', '1-1/8"'],
      ['10', '1/2"', '1-3/8"', '1-1/8"']
    ];
    h += '<div style="display:grid;grid-template-columns:0.8fr 1fr 1fr 1fr;gap:2px;font-size:9px;">';
    h += '<div style="color:#4b5563;font-weight:700;padding:4px;">Tons</div>';
    h += '<div style="color:#38bdf8;font-weight:700;padding:4px;">L\u00EDquido</div>';
    h += '<div style="color:#fb923c;font-weight:700;padding:4px;">Succi\u00F3n</div>';
    h += '<div style="color:#f87171;font-weight:700;padding:4px;">Descarga</div>';
    for (var qi = 0; qi < quickRef.length; qi++) {
      var q = quickRef[qi];
      h += '<div style="color:#111827;font-weight:600;padding:3px 4px;background:rgba(0,0,0,0.02);border-radius:3px;">' + q[0] + '</div>';
      h += '<div style="color:#38bdf8;padding:3px 4px;background:rgba(0,0,0,0.02);border-radius:3px;">' + q[1] + '</div>';
      h += '<div style="color:#fb923c;padding:3px 4px;background:rgba(0,0,0,0.02);border-radius:3px;">' + q[2] + '</div>';
      h += '<div style="color:#f87171;padding:3px 4px;background:rgba(0,0,0,0.02);border-radius:3px;">' + q[3] + '</div>';
    }
    h += '</div></div>';
    h += '</div></div>';
    s.innerHTML = h;
  }

  window._htLSCalc = function() {
    var ref = document.getElementById('htLSRef').value;
    var tons = parseFloat(document.getElementById('htLSTons').value) || 3;
    var length = parseFloat(document.getElementById('htLSLength').value) || 50;
    var condT = parseFloat(document.getElementById('htLSCondT').value) || 110;
    var evapT = parseFloat(document.getElementById('htLSEvapT').value) || 40;
    var rise = parseFloat(document.getElementById('htLSRise').value) || 0;
    var resEl = document.getElementById('htLSResult');
    if (!resEl) return;
    var btuH = tons * 12000;
    // Line sizing lookup tables (OD in inches)
    // Based on ASHRAE Refrigeration Handbook sizing tables
    var sizing = {
      'R-410A': { liquid: [[2, 0.375],[3, 0.375],[4, 0.375],[5, 0.375],[7.5, 0.5],[10, 0.5],[15, 0.625],[20, 0.75]],
                  suction: [[1.5, 0.75],[2.5, 0.875],[4, 0.875],[5, 1.125],[7.5, 1.375],[10, 1.375],[15, 1.625],[20, 2.125]],
                  discharge: [[2, 0.625],[3, 0.75],[5, 0.875],[7.5, 1.125],[10, 1.125],[15, 1.375],[20, 1.625]] },
      'R-22': { liquid: [[2, 0.375],[3, 0.375],[5, 0.5],[7.5, 0.5],[10, 0.625],[15, 0.75],[20, 0.875]],
                suction: [[1.5, 0.75],[2.5, 0.875],[4, 1.125],[5, 1.125],[7.5, 1.375],[10, 1.625],[15, 2.125],[20, 2.625]],
                discharge: [[2, 0.625],[3, 0.75],[5, 0.875],[7.5, 1.125],[10, 1.375],[15, 1.625],[20, 2.125]] },
      'R-134a': { liquid: [[2, 0.375],[3, 0.5],[5, 0.5],[7.5, 0.625],[10, 0.75],[15, 0.875],[20, 1.125]],
                  suction: [[1.5, 0.875],[2.5, 1.125],[4, 1.375],[5, 1.375],[7.5, 1.625],[10, 2.125],[15, 2.625],[20, 3.125]],
                  discharge: [[2, 0.75],[3, 0.875],[5, 1.125],[7.5, 1.375],[10, 1.625],[15, 2.125],[20, 2.625]] },
      'R-404A': { liquid: [[2, 0.375],[3, 0.375],[5, 0.5],[7.5, 0.5],[10, 0.625],[15, 0.75],[20, 0.875]],
                  suction: [[1.5, 0.875],[2.5, 1.125],[4, 1.125],[5, 1.375],[7.5, 1.625],[10, 1.625],[15, 2.125],[20, 2.625]],
                  discharge: [[2, 0.625],[3, 0.75],[5, 0.875],[7.5, 1.125],[10, 1.375],[15, 1.625],[20, 2.125]] },
      'R-32': { liquid: [[2, 0.25],[3, 0.375],[5, 0.375],[7.5, 0.375],[10, 0.5],[15, 0.5],[20, 0.625]],
                suction: [[1.5, 0.625],[2.5, 0.75],[4, 0.875],[5, 0.875],[7.5, 1.125],[10, 1.375],[15, 1.625],[20, 2.125]],
                discharge: [[2, 0.5],[3, 0.625],[5, 0.75],[7.5, 0.875],[10, 1.125],[15, 1.375],[20, 1.625]] }
    };
    var refData = sizing[ref] || sizing['R-410A'];
    function pickSize(table, t) {
      var size = table[table.length - 1][1]; // default to largest
      for (var i = 0; i < table.length; i++) {
        if (t <= table[i][0]) { size = table[i][1]; break; }
      }
      return size;
    }
    var liqSize = pickSize(refData.liquid, tons);
    var sucSize = pickSize(refData.suction, tons);
    var disSize = pickSize(refData.discharge, tons);
    // Length correction: if > 100ft, may need to go up one size
    var longRun = length > 100;
    var liqCorr = longRun ? _lsUpsize(liqSize) : liqSize;
    var sucCorr = longRun ? _lsUpsize(sucSize) : sucSize;
    var disCorr = longRun ? _lsUpsize(disSize) : disSize;
    // Vertical rise penalty
    var riseNote = '';
    if (rise > 20) riseNote = 'Elevaci\u00F3n > 20ft: considerar doble riser o trampa de aceite cada 20ft.';
    var rh = '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px;">';
    rh += '<div style="font-size:11px;font-weight:700;color:#fbbf24;margin-bottom:10px;">Line Sizing \u2014 ' + ref + ' @ ' + tons + ' Ton</div>';
    rh += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">';
    // Liquid line
    rh += '<div style="background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:10px;text-align:center;">';
    rh += '<div style="font-size:9px;font-weight:700;color:#38bdf8;">L\u00CDNEA L\u00CDQUIDO</div>';
    rh += '<div style="font-size:22px;font-weight:900;color:#38bdf8;margin:4px 0;">' + _lsFraction(liqCorr) + '"</div>';
    rh += '<div style="font-size:8px;color:#4b5563;">OD cobre tipo ACR</div></div>';
    // Suction line
    rh += '<div style="background:rgba(251,146,60,0.1);border:1px solid rgba(251,146,60,0.2);border-radius:10px;padding:10px;text-align:center;">';
    rh += '<div style="font-size:9px;font-weight:700;color:#fb923c;">L\u00CDNEA SUCCI\u00D3N</div>';
    rh += '<div style="font-size:22px;font-weight:900;color:#fb923c;margin:4px 0;">' + _lsFraction(sucCorr) + '"</div>';
    rh += '<div style="font-size:8px;color:#4b5563;">OD cobre tipo ACR</div></div>';
    // Discharge line
    rh += '<div style="background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:10px;text-align:center;">';
    rh += '<div style="font-size:9px;font-weight:700;color:#f87171;">L\u00CDNEA DESCARGA</div>';
    rh += '<div style="font-size:22px;font-weight:900;color:#f87171;margin:4px 0;">' + _lsFraction(disCorr) + '"</div>';
    rh += '<div style="font-size:8px;color:#4b5563;">OD cobre tipo ACR</div></div>';
    rh += '</div>';
    // Details
    rh += '<div style="font-size:9px;color:#4b5563;line-height:1.8;">';
    rh += 'Refrigerante: <span style="color:#111827;font-weight:700;">' + ref + '</span><br>';
    rh += 'Capacidad: <span style="color:#111827;font-weight:700;">' + btuH.toLocaleString() + ' BTU/hr (' + tons + ' Ton)</span><br>';
    rh += 'Longitud equivalente: <span style="color:#111827;font-weight:700;">' + length + ' ft</span>';
    if (longRun) rh += ' <span style="color:#fbbf24;">(>100ft \u2014 tama\u00F1o incrementado)</span>';
    rh += '<br>Elevaci\u00F3n: <span style="color:#111827;font-weight:700;">' + rise + ' ft</span>';
    rh += '</div>';
    if (longRun) {
      rh += '<div style="margin-top:8px;padding:6px;background:rgba(245,158,11,0.1);border-radius:6px;font-size:9px;color:#fbbf24;">';
      rh += '\u26A0\uFE0F Longitud > 100ft: se increment\u00F3 un tama\u00F1o para compensar ca\u00EDda de presi\u00F3n adicional.</div>';
    }
    if (riseNote) {
      rh += '<div style="margin-top:6px;padding:6px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:9px;color:#f87171;">\u26A0\uFE0F ' + riseNote + '</div>';
    }
    rh += '</div>';
    rh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('linesize') : '';
    resEl.innerHTML = rh;
  };

  function _lsUpsize(od) {
    var sizes = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.125, 1.375, 1.625, 2.125, 2.625, 3.125];
    for (var i = 0; i < sizes.length; i++) {
      if (sizes[i] === od && i < sizes.length - 1) return sizes[i + 1];
    }
    return od;
  }

  function _lsFraction(od) {
    var fracs = { 0.25: '1/4', 0.3125: '5/16', 0.375: '3/8', 0.5: '1/2', 0.625: '5/8', 0.75: '3/4', 0.875: '7/8', 1.125: '1-1/8', 1.375: '1-3/8', 1.625: '1-5/8', 2.125: '2-1/8', 2.625: '2-5/8', 3.125: '3-1/8' };
    return fracs[od] || od.toString();
  }


  // ============================
  // MULT\u00CDMETRO INTERACTIVO HVAC \u2014 SC680
  // ============================
  var _mmIST = 'width:100%;background:#ffffff;color:#34d399;border:1px solid rgba(52,211,153,0.2);border-radius:8px;padding:10px;font-size:18px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;font-family:"Courier New",monospace;';
  var _mmLST = 'font-size:9px;color:#4b5563;font-weight:600;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px;';

  function _mmBeep(freq, dur) {
    try { var c = new (window.AudioContext || window.webkitAudioContext)(); var o = c.createOscillator(); var g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = freq; g.gain.value = 0.08; o.start(); setTimeout(function() { o.stop(); c.close(); }, dur); } catch(e) {}
  }

  function _htShowMultimeter(s, standalone) {
    _htView = 'multimeter';
    window._htMMMode = 'vac';
    window._htMMData = {};
    window._htMMComponent = 'comp';
    window._htMMStandalone = !!standalone;
    // Readings log: { comp: [{mode,value,unit,timestamp},...], condFan: [...] }
    if (!window._htMMReadings) window._htMMReadings = {};
    // Equipment info — auto-fill tech name + number + email from profile
    if (!window._htMMEquip) {
      var _techName = '', _techNum = '', _techEmail = '';
      try {
        var _tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        _techName = _tu.nombre || _tu.name || '';
        _techNum = _tu.technicianNumber || localStorage.getItem('tecnico_number_' + (_tu.email || '')) || localStorage.getItem('tecnico_number') || '';
        _techEmail = _tu.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._htMMEquip = {model:'',serial:'',clientName:'',clientAddr:'',techName:_techName,techNum:_techNum,techEmail:_techEmail};
    }
    var backAction = standalone ? "showScreen('dashboardScreen')" : "_htBackToMenu()";
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="' + backAction + '" style="background:rgba(0,0,0,0.05);border:none;color:#4b5563;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div style="flex:1;"><div style="font-size:16px;font-weight:800;color:#111827;">Mult\u00EDmetro Interactivo</div>';
    h += '<div style="font-size:9px;color:#4b5563;">Fieldpiece SC680 \u2022 Toque el dial para cambiar modo</div></div>';
    h += '<button onclick="_htMMToggleEquip()" style="background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.1);color:#4b5563;padding:4px 10px;border-radius:6px;font-size:8px;font-weight:700;cursor:pointer;">\uD83D\uDCCB Equipo</button>';
    h += '</div></div>';
    // EQUIPMENT INFO PANEL (collapsible) — full 7-field version
    var eq = window._htMMEquip;
    h += '<div id="htMMEquipPanel" style="display:none;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.15);margin:0 12px;border-radius:12px;padding:12px;">';
    h += '<div style="font-size:9px;font-weight:800;color:#60a5fa;letter-spacing:0.5px;margin-bottom:8px;">INFORMACI\u00D3N DEL EQUIPO Y SERVICIO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += '<div><label style="font-size:8px;color:#4b5563;font-weight:700;">N\u00FAmero de Modelo</label><input id="mmEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 24ACC636" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:8px;color:#4b5563;font-weight:700;">N\u00FAmero de Serie</label><input id="mmEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 1234ABC567" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:8px;color:#4b5563;font-weight:700;">Nombre del Cliente</label><input id="mmEqClientName" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div style="grid-column:1/-1;"><label style="font-size:8px;color:#4b5563;font-weight:700;">Direcci\u00F3n</label><input id="mmEqClientAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:8px;color:#4b5563;font-weight:700;">T\u00E9cnico</label><input id="mmEqTechName" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:8px;color:#4b5563;font-weight:700;"># T\u00E9cnico</label><input id="mmEqTechNum" value="' + (eq.techNum||'') + '" placeholder="N\u00FAmero" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '<div style="grid-column:1/-1;"><label style="font-size:8px;color:#4b5563;font-weight:700;">Email</label><input id="mmEqTechEmail" value="' + (eq.techEmail||'') + '" placeholder="correo@ejemplo.com" oninput="_htMMSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.05);color:#111827;padding:6px 8px;border-radius:6px;font-size:11px;box-sizing:border-box;"></div>';
    h += '</div></div>';
    h += '<div style="padding:12px;">';
    // LCD DISPLAY
    h += '<div style="background:#ffffff;border:2.5px solid #0F0F0F;border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:inset 0 2px 12px rgba(0,0,0,0.6),0 0 30px rgba(52,211,153,0.04);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">';
    h += '<div id="htMMComp" style="font-size:8px;color:#3D3D3A;font-weight:700;letter-spacing:1px;">COMPRESOR</div>';
    h += '<div id="htMMModeLbl" style="font-size:8px;color:#3D3D3A;font-weight:700;letter-spacing:1px;">VOLTAJE AC</div>';
    h += '</div>';
    h += '<div style="text-align:center;padding:8px 0;">';
    h += '<div id="htMMVal" style="font-family:\'Courier New\',monospace;font-size:52px;font-weight:900;color:#34d399;text-shadow:0 0 15px rgba(52,211,153,0.25);letter-spacing:3px;line-height:1;">---</div>';
    h += '<div id="htMMUnit" style="font-family:monospace;font-size:16px;font-weight:700;color:#34d399;opacity:0.6;margin-top:2px;">V AC</div>';
    h += '</div>';
    h += '<div style="height:4px;background:#FFFFFF;border-radius:2px;overflow:hidden;margin:6px 0;"><div id="htMMBarFill" style="height:100%;width:0%;background:#34d399;border-radius:2px;transition:width 0.3s;"></div></div>';
    h += '<div id="htMMStatus" style="text-align:center;font-size:8px;color:#3D3D3A;font-weight:600;">TOQUE EL DIAL PARA SELECCIONAR MODO</div>';
    h += '</div>';
    // ROTARY DIAL
    var modes = [['off','OFF',0,'#475569'],['vac','V\u223C',27.7,'#fbbf24'],['vdc','V\u2550',55.4,'#fbbf24'],['aac','A\u223C',83.1,'#60a5fa'],['ncv','NCV',110.8,'#ff6b6b'],['ohm','\u03A9',138.5,'#34d399'],['uf','\u00B5F',166.2,'#c084fc'],['hz','Hz',193.8,'#0ea5e9'],['watt','W',221.5,'#fbbf24'],['ua','\u00B5A',249.2,'#f97316'],['mohm','M\u03A9',276.9,'#f87171'],['temp','\u00B0F',304.6,'#f97316'],['ph3','3\u03C6',332.3,'#f59e0b']];
    h += '<div style="position:relative;width:230px;height:230px;margin:0 auto 14px auto;">';
    h += '<div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 40% 35%,#1e293b 0%,#0f172a 70%);border:3px solid #334155;box-shadow:0 4px 16px rgba(0,0,0,0.5),inset 0 1px 3px rgba(0,0,0,0.03);"></div>';
    h += '<div style="position:absolute;top:25px;left:25px;right:25px;bottom:25px;border-radius:50%;border:1px dashed rgba(0,0,0,0.03);"></div>';
    h += '<div style="position:absolute;top:50%;left:50%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#64748b,#334155);transform:translate(-50%,-50%);z-index:3;box-shadow:0 2px 8px rgba(0,0,0,0.6);border:1px solid rgba(0,0,0,0.1);"></div>';
    h += '<div id="htMMPtr" style="position:absolute;top:50%;left:50%;width:3px;height:60px;background:linear-gradient(to top,#dc2626,#ef4444,#fca5a5);transform-origin:bottom center;transform:translate(-50%,-100%) rotate(30deg);border-radius:2px;z-index:4;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 0 8px rgba(239,68,68,0.4);"></div>';
    var cx = 115, cy = 115, r = 96;
    for (var mi = 0; mi < modes.length; mi++) {
      var md = modes[mi];
      var ang = md[2] * Math.PI / 180;
      var mx = cx + r * Math.sin(ang);
      var my = cy - r * Math.cos(ang);
      var isAct = md[0] === 'vac' ? '1' : '0.45';
      h += '<div class="mm-lbl" data-mode="' + md[0] + '" onclick="_htMMSetMode(\'' + md[0] + '\')" ';
      h += 'style="position:absolute;left:' + (mx - 16).toFixed(0) + 'px;top:' + (my - 10).toFixed(0) + 'px;width:32px;height:20px;';
      h += 'display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;';
      h += 'color:' + md[3] + ';cursor:pointer;z-index:5;opacity:' + isAct + ';transition:all 0.3s;';
      h += 'user-select:none;-webkit-tap-highlight-color:transparent;">' + md[1] + '</div>';
    }
    h += '</div>';
    // COMPONENT SELECTOR
    h += '<div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;margin-bottom:14px;">';
    var comps = [['comp','\uD83D\uDCA0','Compresor'],['condFan','\uD83C\uDF00','Cond Fan'],['blower','\uD83D\uDCA8','Blower'],['contactor','\u26A1','Contactor'],['transformer','\uD83D\uDD0C','Transf.'],['capacitor','\uD83D\uDD0B','Capacitor'],['flame','\uD83D\uDD25','Flame'],['temps','\uD83C\uDF21','Temps']];
    for (var ci = 0; ci < comps.length; ci++) {
      var cp = comps[ci];
      var cSel = cp[0] === 'comp' ? 'background:rgba(251,191,36,0.12);border-color:rgba(251,191,36,0.4);color:#fbbf24;' : 'background:rgba(0,0,0,0.02);border-color:rgba(0,0,0,0.06);color:#4b5563;';
      h += '<button id="htMMC_' + cp[0] + '" onclick="_htMMSetComp(\'' + cp[0] + '\')" style="padding:5px 8px;border:1.5px solid;border-radius:6px;cursor:pointer;font-size:8px;font-weight:700;' + cSel + '">' + cp[1] + ' ' + cp[2] + '</button>';
    }
    h += '</div>';
    // SC680 BLE LIVE DASHBOARD — shows all channels in real-time
    h += '<div id="htMMBLELive" style="margin-bottom:14px;"></div>';
    // INPUT AREA
    h += '<div id="htMMInputs" style="margin-bottom:12px;"></div>';
    // SAVE READING BUTTON
    h += '<button onclick="_htMMSaveReading()" style="width:100%;padding:10px;background:linear-gradient(135deg,#FF6B35,#e55a2b);border:none;color:#fff;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;margin-bottom:8px;box-shadow:0 4px 12px rgba(255,107,53,0.3);display:flex;align-items:center;justify-content:center;gap:6px;"><span style="font-size:14px;">\uD83D\uDCBE</span> Guardar Lectura</button>';
    // SAVED READINGS LOG
    h += '<div id="htMMReadingsLog" style="margin-bottom:12px;"></div>';
    h += '<div id="htMMDiag" style="margin-bottom:12px;"></div>';
    // REPORT + IA BUTTONS
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">';
    h += '<button onclick="_htMMGenReport()" style="padding:12px;background:linear-gradient(135deg,#22d3ee,#0891b2);border:none;color:#fff;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(34,211,238,0.3);">\uD83D\uDCCB Generar Reporte</button>';
    h += '<button id="htMMIABtn" onclick="_htMMIADiagnose()" style="padding:12px;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;color:#fff;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,0.3);">\uD83E\uDDE0 Diagn\u00F3stico IA</button>';
    h += '</div>';
    h += '<div id="htMMReport" style="margin-bottom:12px;"></div>';
    h += '<div id="htMMIA" style="margin-bottom:10px;"></div>';
    h += '</div></div>';
    s.innerHTML = h;
    _htMMSetMode('vac');
  }

  window._htMMSetComp = function(comp) {
    window._htMMComponent = comp;
    var types = ['comp','condFan','blower','contactor','transformer','capacitor','flame','temps'];
    var labels = {comp:'COMPRESOR',condFan:'CONDENSER FAN',blower:'BLOWER',contactor:'CONTACTOR',transformer:'TRANSFORMADOR',capacitor:'CAPACITOR',flame:'FLAME SENSOR',temps:'TEMPERATURAS'};
    for (var i = 0; i < types.length; i++) {
      var btn = document.getElementById('htMMC_' + types[i]);
      if (btn) {
        var hasReadings = window._htMMReadings && window._htMMReadings[types[i]] && window._htMMReadings[types[i]].length > 0;
        if (types[i] === comp) { btn.style.background = 'rgba(251,191,36,0.12)'; btn.style.borderColor = 'rgba(251,191,36,0.4)'; btn.style.color = '#fbbf24'; }
        else if (hasReadings) { btn.style.background = 'rgba(74,222,128,0.08)'; btn.style.borderColor = 'rgba(74,222,128,0.3)'; btn.style.color = '#4ade80'; }
        else { btn.style.background = 'rgba(0,0,0,0.02)'; btn.style.borderColor = 'rgba(0,0,0,0.06)'; btn.style.color = '#57574F'; }
      }
    }
    var el = document.getElementById('htMMComp');
    if (el) el.textContent = labels[comp] || comp;
    if (typeof window._htMMRenderReadingsLog === 'function') window._htMMRenderReadingsLog();
  };

  function _mmSave() {
    var inputs = document.querySelectorAll('#htMMInputs input');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].id && inputs[i].value !== '') window._htMMData[inputs[i].id] = parseFloat(inputs[i].value);
      else if (inputs[i].id) delete window._htMMData[inputs[i].id];
    }
  }
  function _mmGv(id) { var d = window._htMMData || {}; return d[id] !== undefined ? d[id] : null; }
  function _mmInp(id, ph, step) {
    var d = window._htMMData || {};
    var val = d[id] !== undefined ? d[id] : '';
    return '<input id="' + id + '" type="number" placeholder="' + ph + '" step="' + (step || '0.1') + '" value="' + val + '" oninput="_htMMCalcMode()" style="' + _mmIST + '">';
  }
  function _mmLbl(t) { return '<label style="' + _mmLST + '">' + t + '</label>'; }

  window._htMMSetMode = function(mode) {
    _mmSave();
    window._htMMMode = mode;
    // Map sub-modes to parent dial position for pointer
    var _ohmSubModes = {ohm:true, cont:true, diode:true};
    var dialMode = _ohmSubModes[mode] ? 'ohm' : mode;
    var angles = {off:0,vac:27.7,vdc:55.4,aac:83.1,ncv:110.8,ohm:138.5,uf:166.2,hz:193.8,watt:221.5,ua:249.2,mohm:276.9,temp:304.6,ph3:332.3};
    var ptr = document.getElementById('htMMPtr');
    if (ptr) ptr.style.transform = 'translate(-50%,-100%) rotate(' + (angles[dialMode] || 0) + 'deg)';
    var lbls = document.querySelectorAll('.mm-lbl');
    for (var i = 0; i < lbls.length; i++) {
      var isA = lbls[i].getAttribute('data-mode') === dialMode;
      lbls[i].style.opacity = isA ? '1' : '0.45';
      lbls[i].style.fontSize = isA ? '13px' : '11px';
    }
    var units = {off:'',vac:'V AC',vdc:'V DC',aac:'A AC',ncv:'NCV',ohm:'\u03A9',cont:'\u03A9',diode:'V',uf:'\u00B5F',hz:'Hz',watt:'W',ua:'\u00B5A',mohm:'M\u03A9',temp:'\u00B0F',ph3:'V 3\u03C6'};
    var mNames = {off:'APAGADO',vac:'VOLTAJE AC',vdc:'VOLTAJE DC',aac:'AMPERAJE AC',ncv:'NON-CONTACT VOLTAGE',ohm:'RESISTENCIA / WINDINGS',cont:'CONTINUIDAD',diode:'DIODO TEST',uf:'CAPACITANCIA',hz:'FRECUENCIA',watt:'POTENCIA',ua:'MICRO AMPS',mohm:'INSULATION',temp:'TEMPERATURA',ph3:'TRIF\u00C1SICO L1-L2-L3'};
    var uEl = document.getElementById('htMMUnit');
    if (uEl) uEl.textContent = units[mode] || '';
    var mlEl = document.getElementById('htMMModeLbl');
    if (mlEl) mlEl.textContent = mNames[mode] || '';
    var vEl = document.getElementById('htMMVal');
    if (vEl) { vEl.textContent = mode === 'off' ? 'OFF' : '---'; vEl.style.color = '#34d399'; }
    var bfEl = document.getElementById('htMMBarFill');
    if (bfEl) { bfEl.style.width = '0%'; bfEl.style.background = '#34d399'; }
    var stEl = document.getElementById('htMMStatus');
    if (stEl) stEl.textContent = mode === 'off' ? _t('ht_mm_status_off','MULTÍMETRO APAGADO') : _t('ht_mm_enter_values','INGRESE VALORES');
    _mmRenderInputs(mode);
  };

  function _mmRenderInputs(mode) {
    var area = document.getElementById('htMMInputs');
    if (!area) return;
    var h = '';
    switch (mode) {
      case 'off':
        h += '<div style="text-align:center;padding:40px 20px;"><div style="font-size:36px;opacity:0.2;">OFF</div>';
        h += '<div style="font-size:11px;color:#3D3D3A;margin-top:8px;">' + _t('ht_mm_turn_dial','Gire el dial a un modo de medición') + '</div></div>';
        break;
      case 'vac':
        h += '<div style="background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#fbbf24;margin-bottom:10px;letter-spacing:0.5px;">VOLTAJE AC</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
        h += '<div>' + _mmLbl('Nameplate (V)') + _mmInp('mmVrated','230','1') + '</div>';
        h += '<div>' + _mmLbl('Medido (V)') + _mmInp('mmVmeas','228','0.1') + '</div>';
        h += '<div>' + _mmLbl('Control 24V') + _mmInp('mmV24','24','0.1') + '</div>';
        h += '<div id="mmVRes" style="display:flex;align-items:center;justify-content:center;background:#ffffff;border-radius:8px;border:1px solid rgba(0,0,0,0.03);font-size:14px;font-weight:800;color:#4b5563;font-family:monospace;">--</div>';
        h += '</div></div>';
        break;
      case 'vdc':
        h += '<div style="background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#fbbf24;margin-bottom:10px;">VOLTAJE DC</div>';
        h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('DC Voltage (V)') + _mmInp('mmVdc','12','0.1') + '</div></div>';
        break;
      case 'aac':
        h += '<div style="background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#60a5fa;margin-bottom:10px;">AMPERAJE AC (CLAMP)</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('RLA/FLA') + _mmInp('mmRLA','18','0.1') + '</div>';
        h += '<div>' + _mmLbl('LRA') + _mmInp('mmLRA','95','0.1') + '</div>';
        h += '<div>' + _mmLbl('Medido (A)') + _mmInp('mmAMeas','16.5','0.1') + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        h += '<div>' + _mmLbl('In-Rush (A)') + _mmInp('mmInrush','85','0.1') + '</div>';
        h += '<div id="mmInrRes" style="display:flex;align-items:center;justify-content:center;background:#ffffff;border-radius:8px;border:1px solid rgba(0,0,0,0.03);font-size:10px;font-weight:700;color:#4b5563;">--</div></div>';
        h += '<div id="mmAmpBar" style="margin-top:10px;"></div></div>';
        break;
      case 'ohm': case 'cont': case 'diode':
        h += '<div style="background:rgba(52,211,153,0.04);border:1px solid rgba(52,211,153,0.1);border-radius:14px;padding:14px;">';
        // Sub-mode tabs
        var _ohmSubs = [['ohm','\u03A9 Resistencia','#34d399'],['cont','\u25B6 Continuidad','#a78bfa'],['diode','\u25B7| Diodo','#c084fc']];
        h += '<div style="display:flex;gap:4px;margin-bottom:12px;">';
        for (var oi = 0; oi < _ohmSubs.length; oi++) {
          var os = _ohmSubs[oi];
          var oSel = os[0] === mode ? 'background:' + os[2] + '20;border-color:' + os[2] + '60;color:' + os[2] : 'background:rgba(0,0,0,0.02);border-color:rgba(0,0,0,0.05);color:#4b5563';
          h += '<button onclick="_htMMSetMode(\'' + os[0] + '\')" style="flex:1;padding:6px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:9px;font-weight:700;' + oSel + ';">' + os[1] + '</button>';
        }
        h += '</div>';
        if (mode === 'ohm') {
          h += '<div style="font-size:10px;font-weight:800;color:#34d399;margin-bottom:10px;">RESISTENCIA / WINDINGS</div>';
          h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">';
          h += '<div>' + _mmLbl('C\u2192S (\u03A9)') + _mmInp('mmCS','4.2','0.1') + '</div>';
          h += '<div>' + _mmLbl('C\u2192R (\u03A9)') + _mmInp('mmCR','2.8','0.1') + '</div>';
          h += '<div>' + _mmLbl('S\u2192R (\u03A9)') + _mmInp('mmSR','7.0','0.1') + '</div></div>';
          h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('General (\u03A9)') + _mmInp('mmOhms','0','0.1') + '</div>';
          h += '<div id="mmOhmRes" style="margin-top:10px;text-align:center;font-size:12px;font-weight:800;color:#4b5563;font-family:monospace;">--</div>';
        } else if (mode === 'cont') {
          h += '<div style="font-size:10px;font-weight:800;color:#a78bfa;margin-bottom:10px;">CONTINUIDAD</div>';
          h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('Resistencia (\u03A9)') + _mmInp('mmCont','0.5','0.1') + '</div>';
          h += '<div id="mmContRes" style="margin-top:12px;"></div>';
        } else {
          h += '<div style="font-size:10px;font-weight:800;color:#c084fc;margin-bottom:10px;">DIODO TEST</div>';
          h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('Forward V Drop') + _mmInp('mmDiode','0.6','0.01') + '</div>';
          h += '<div id="mmDiodeRes" style="margin-top:12px;text-align:center;font-size:14px;font-weight:800;color:#4b5563;">--</div>';
        }
        h += '</div>';
        break;
      case 'ncv':
        h += '<div style="background:rgba(255,107,107,0.04);border:1px solid rgba(255,107,107,0.15);border-radius:14px;padding:14px;text-align:center;">';
        h += '<div style="font-size:10px;font-weight:800;color:#ff6b6b;margin-bottom:12px;letter-spacing:0.5px;">NON-CONTACT VOLTAGE</div>';
        h += '<div style="font-size:56px;line-height:1;margin-bottom:8px;">\u26A1</div>';
        h += '<div id="mmNCVLevel" style="font-family:\'Courier New\',monospace;font-size:42px;font-weight:900;color:#3D3D3A;margin-bottom:6px;">---</div>';
        h += '<div style="height:8px;background:#FFFFFF;border-radius:4px;overflow:hidden;margin:8px 20px;"><div id="mmNCVBar" style="height:100%;width:0%;background:linear-gradient(90deg,#34d399,#fbbf24,#f87171);border-radius:4px;transition:width 0.3s;"></div></div>';
        h += '<div id="mmNCVStatus" style="font-size:10px;color:#4b5563;font-weight:700;margin-top:8px;">Acerque el mult\u00EDmetro al conductor</div>';
        h += '<div style="margin-top:12px;font-size:8px;color:#3D3D3A;line-height:1.5;">El SC680 detecta voltaje AC sin contacto.<br>La barra indica la intensidad del campo.</div>';
        h += '</div>';
        break;
      case 'uf':
        h += '<div style="background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#c084fc;margin-bottom:10px;">CAPACITOR TEST (DUAL)</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('COMP Rated \u00B5F') + _mmInp('mmCapR','45','0.1') + '</div>';
        h += '<div>' + _mmLbl('COMP Medido \u00B5F') + _mmInp('mmCapM','42','0.1') + '</div>';
        h += '<div>' + _mmLbl('FAN Rated \u00B5F') + _mmInp('mmCapFR','5','0.1') + '</div>';
        h += '<div>' + _mmLbl('FAN Medido \u00B5F') + _mmInp('mmCapFM','4.8','0.1') + '</div></div>';
        h += '<div id="mmCapRes"></div></div>';
        break;
      case 'hz':
        h += '<div style="background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#0ea5e9;margin-bottom:10px;">FRECUENCIA / DUTY CYCLE</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
        h += '<div>' + _mmLbl('Frecuencia (Hz)') + _mmInp('mmFreq','60','0.1') + '</div>';
        h += '<div>' + _mmLbl('Duty Cycle (%)') + _mmInp('mmDuty','50','0.1') + '</div></div></div>';
        break;
      case 'watt':
        h += '<div style="background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#fbbf24;margin-bottom:10px;">POTENCIA / POWER FACTOR</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('Voltaje (V)') + _mmInp('mmWV','230','0.1') + '</div>';
        h += '<div>' + _mmLbl('Amperaje (A)') + _mmInp('mmWA','18','0.1') + '</div>';
        h += '<div>' + _mmLbl('Power Factor') + _mmInp('mmWPF','0.85','0.01') + '</div>';
        h += '<div>' + _mmLbl('Fases (1 \u00F3 3)') + _mmInp('mmWPh','1','1') + '</div></div>';
        h += '<div id="mmWattRes" style="text-align:center;font-size:14px;font-weight:800;color:#4b5563;font-family:monospace;">--</div></div>';
        break;
      case 'ua':
        h += '<div style="background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#f97316;margin-bottom:10px;">MICRO AMPS \u2014 FLAME SENSOR</div>';
        h += '<div style="text-align:center;margin-bottom:10px;">';
        h += '<div style="font-size:48px;line-height:1;">\uD83D\uDD25</div>';
        h += '<div style="font-size:8px;color:#4b5563;margin-top:4px;">Conecte leads al sensor de flama</div></div>';
        h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('Lectura (\u00B5A)') + _mmInp('mmUA','3.5','0.1') + '</div>';
        h += '<div id="mmUARes" style="margin-top:12px;"></div></div>';
        break;
      /* ohm/cont/diode handled together above */
      case 'mohm':
        h += '<div style="background:rgba(248,113,113,0.04);border:1px solid rgba(248,113,113,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#f87171;margin-bottom:10px;">INSULATION TEST (Meg-Ohm)</div>';
        h += '<div style="max-width:200px;margin:0 auto;">' + _mmLbl('Meg-Ohm a Tierra (M\u03A9)') + _mmInp('mmMeg','500','1') + '</div>';
        h += '<div id="mmMegRes" style="margin-top:12px;text-align:center;font-size:14px;font-weight:800;color:#4b5563;">--</div></div>';
        break;
      case 'temp':
        h += '<div style="background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#f97316;margin-bottom:10px;">K-TYPE THERMOCOUPLE</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
        h += '<div>' + _mmLbl('T1 / Suction (\u00B0F)') + _mmInp('mmTemp1','55','0.1') + '</div>';
        h += '<div>' + _mmLbl('T2 / Liquid (\u00B0F)') + _mmInp('mmTemp2','95','0.1') + '</div></div>';
        h += '<div id="mmTempRes" style="margin-top:10px;text-align:center;font-size:13px;font-weight:800;color:#4b5563;font-family:monospace;">--</div></div>';
        break;
      case 'ph3':
        h += '<div style="background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.1);border-radius:14px;padding:14px;">';
        h += '<div style="font-size:10px;font-weight:800;color:#f59e0b;margin-bottom:10px;">TRIF\u00C1SICO / POWER FACTOR</div>';
        h += '<div style="font-size:8px;color:#4b5563;font-weight:700;margin-bottom:4px;">VOLTAJES ENTRE L\u00CDNEAS</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('L1-L2') + _mmInp('mmL12','230','0.1') + '</div>';
        h += '<div>' + _mmLbl('L2-L3') + _mmInp('mmL23','228','0.1') + '</div>';
        h += '<div>' + _mmLbl('L1-L3') + _mmInp('mmL13','231','0.1') + '</div></div>';
        h += '<div style="font-size:8px;color:#4b5563;font-weight:700;margin-bottom:4px;">AMPERAJE POR FASE</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('L1 (A)') + _mmInp('mmA1','17','0.1') + '</div>';
        h += '<div>' + _mmLbl('L2 (A)') + _mmInp('mmA2','16.5','0.1') + '</div>';
        h += '<div>' + _mmLbl('L3 (A)') + _mmInp('mmA3','17.2','0.1') + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
        h += '<div>' + _mmLbl('Power Factor') + _mmInp('mmPF','0.85','0.01') + '</div>';
        h += '<div id="mmPFRes" style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#ffffff;border-radius:8px;border:1px solid rgba(0,0,0,0.03);font-size:10px;font-weight:700;color:#4b5563;">--</div></div>';
        h += '<div style="font-size:8px;color:#4b5563;font-weight:700;margin-bottom:4px;">CA\u00CDDA DE VOLTAJE</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        h += '<div>' + _mmLbl('V Panel') + _mmInp('mmVsrc','240','0.1') + '</div>';
        h += '<div>' + _mmLbl('V Equipo') + _mmInp('mmVload','228','0.1') + '</div></div>';
        h += '<div id="mmPh3Res" style="margin-top:10px;"></div></div>';
        break;
    }
    area.innerHTML = h;
  }

  window._htMMCalcMode = function() {
    _mmSave();
    var mode = window._htMMMode;
    var vEl = document.getElementById('htMMVal');
    var bf = document.getElementById('htMMBarFill');
    var stEl = document.getElementById('htMMStatus');
    var diagEl = document.getElementById('htMMDiag');
    var diags = [];
    switch (mode) {
      case 'vac': {
        var vR = _mmGv('mmVrated'), vM = _mmGv('mmVmeas'), v24 = _mmGv('mmV24');
        if (vM !== null && vEl) { vEl.textContent = vM.toFixed(1); vEl.style.color = '#34d399'; }
        var rEl = document.getElementById('mmVRes');
        if (vR !== null && vM !== null && vR > 0) {
          var pct = ((vM - vR) / vR * 100), abs = Math.abs(pct);
          var col = abs <= 5 ? '#34d399' : abs <= 10 ? '#fbbf24' : '#f87171';
          if (vEl) vEl.style.color = col;
          if (bf) { bf.style.width = Math.min(abs * 10, 100) + '%'; bf.style.background = col; }
          if (rEl) rEl.innerHTML = '<span style="color:' + col + ';font-family:monospace;">' + (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%</span>';
          if (stEl) stEl.textContent = abs <= 5 ? _t('ht_mm_v_normal','VOLTAJE NORMAL') : abs <= 10 ? _t('ht_mm_v_limit','VOLTAJE LÍMITE') : _t('ht_mm_v_out_range','FUERA DE RANGO');
          if (abs <= 5) diags.push(['ok',_t('ht_mm_vac_normal','Voltaje AC normal') + ' ' + pct.toFixed(1) + '%',_t('ht_mm_within_10','Dentro de ±10%.')]);
          else if (abs <= 10) diags.push(['warn',_t('ht_mm_vac_limit','Voltaje AC límite') + ' ' + pct.toFixed(1) + '%','']);
          else diags.push(['error',_t('ht_mm_vac_out','Voltaje AC fuera de rango') + ' ' + pct.toFixed(1) + '%', pct > 0 ? _t('ht_mm_overvoltage','Sobrevoltaje.') : _t('ht_mm_undervoltage','Bajo voltaje.')]);
        }
        if (v24 !== null) {
          if (v24 >= 24 && v24 <= 28) diags.push(['ok',_t('ht_mm_ctrl_normal','Control 24V normal'),'']);
          else if (v24 < 20) diags.push(['error',_t('ht_mm_ctrl_low','Control bajo') + ' ' + v24 + 'V',_t('ht_mm_weak_transformer','Transformador débil.')]);
          else if (v24 > 30) diags.push(['warn',_t('ht_mm_ctrl_high','Control alto') + ' ' + v24 + 'V','']);
        }
        break; }
      case 'vdc': {
        var vdc = _mmGv('mmVdc');
        if (vdc !== null && vEl) { vEl.textContent = vdc.toFixed(1); vEl.style.color = '#34d399'; }
        if (vdc !== null) {
          if (vdc >= 10 && vdc <= 14) diags.push(['ok','DC ' + vdc + 'V normal','']);
          else if (vdc > 0 && vdc < 10) { diags.push(['warn',_t('ht_mm_dc_low','DC bajo') + ' ' + vdc + 'V','']); if (vEl) vEl.style.color = '#fbbf24'; }
          else if (vdc > 30) { diags.push(['warn',_t('ht_mm_dc_high','DC alto') + ' ' + vdc + 'V','']); if (vEl) vEl.style.color = '#fbbf24'; }
        }
        break; }
      case 'aac': {
        var rla = _mmGv('mmRLA'), lra = _mmGv('mmLRA'), aM = _mmGv('mmAMeas'), inr = _mmGv('mmInrush');
        if (aM !== null && vEl) { vEl.textContent = aM.toFixed(1); vEl.style.color = '#34d399'; }
        if (rla !== null && aM !== null && rla > 0) {
          var aPct = (aM / rla * 100);
          var aCol = aPct <= 100 ? '#34d399' : aPct <= 115 ? '#fbbf24' : '#f87171';
          if (vEl) vEl.style.color = aCol;
          if (bf) { bf.style.width = Math.min(aPct, 100) + '%'; bf.style.background = aCol; }
          if (stEl) stEl.textContent = aPct.toFixed(0) + _t('ht_mm_pct_rla','% DE RLA');
          var abEl = document.getElementById('mmAmpBar');
          if (abEl) {
            var bh = '<div style="height:28px;background:#ffffff;border-radius:14px;overflow:hidden;position:relative;border:1px solid rgba(0,0,0,0.06);">';
            bh += '<div style="height:100%;width:' + Math.min(aPct, 100) + '%;background:linear-gradient(90deg,' + aCol + ',' + aCol + 'cc);border-radius:14px;transition:width 0.3s;"></div>';
            if (aPct > 100) bh += '<div style="position:absolute;top:0;right:0;height:100%;width:' + Math.min(aPct - 100, 30) + '%;background:rgba(239,68,68,0.5);"></div>';
            bh += '<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:11px;font-weight:800;color:#111827;font-family:monospace;">' + aPct.toFixed(0) + '% RLA</div></div>';
            var vP = _mmGv('mmVmeas') || _mmGv('mmVrated');
            if (vP) { var w = vP * aM; bh += '<div style="margin-top:6px;text-align:center;font-size:10px;color:#4b5563;font-family:monospace;">' + _t('ht_mm_power','Potencia') + ': <span style="color:#fbbf24;font-weight:700;">' + w.toFixed(0) + 'W</span> (' + (w / 746).toFixed(2) + ' HP)</div>'; }
            abEl.innerHTML = bh;
          }
          if (aPct > 115) diags.push(['error',_t('ht_mm_amp_excessive','Amperaje excesivo') + ' ' + aPct.toFixed(0) + '% RLA',_t('ht_mm_overloaded','Sobrecargado.')]);
          else if (aPct > 100) diags.push(['warn',_t('ht_mm_over_rla','Sobre RLA') + ' ' + aPct.toFixed(0) + '%','']);
          else if (aPct < 40) diags.push(['warn',_t('ht_mm_amp_low','Amperaje bajo') + ' ' + aPct.toFixed(0) + '%',_t('ht_mm_no_load','Sin carga?')]);
          else diags.push(['ok',_t('ht_mm_amp_normal','Amperaje normal') + ' ' + aPct.toFixed(0) + '% RLA','']);
        }
        if (inr !== null && lra !== null && lra > 0) {
          var irP = (inr / lra * 100);
          var irEl = document.getElementById('mmInrRes');
          if (irP <= 100) { diags.push(['ok','In-Rush OK ' + irP.toFixed(0) + '% LRA','']); if (irEl) irEl.innerHTML = '<span style="color:#34d399;">' + irP.toFixed(0) + '% LRA</span>'; }
          else { diags.push(['error',_t('ht_mm_inrush_exceeds','In-Rush excede LRA'),'Seizure?']); if (irEl) irEl.innerHTML = '<span style="color:#f87171;">\u274C ' + irP.toFixed(0) + '%</span>'; }
        }
        break; }
      case 'ohm': {
        var cs = _mmGv('mmCS'), cr = _mmGv('mmCR'), sr = _mmGv('mmSR'), ohms = _mmGv('mmOhms');
        var oEl = document.getElementById('mmOhmRes');
        if (cs !== null && cr !== null && sr !== null) {
          var sum = cs + cr, diff = Math.abs(sum - sr), wP = sr > 0 ? (diff / sr * 100) : 0;
          if (vEl) { vEl.textContent = cs.toFixed(1); vEl.style.color = wP <= 5 ? '#34d399' : '#f87171'; }
          if (wP <= 5) { if (oEl) oEl.innerHTML = '<span style="color:#34d399;">\u2705 C-S+C-R=' + sum.toFixed(1) + ' \u2248 S-R=' + sr + '</span>'; diags.push(['ok','Windings OK','']); }
          else { if (oEl) oEl.innerHTML = '<span style="color:#f87171;">\u274C ' + sum.toFixed(1) + ' \u2260 S-R ' + sr + '</span>'; diags.push(['error',_t('ht_mm_windings_mismatch','Windings NO coinciden'),'Sum=' + sum.toFixed(1) + ' vs S-R=' + sr]); }
        }
        if (ohms !== null && vEl) vEl.textContent = ohms.toFixed(1);
        break; }
      case 'uf': {
        var capR = _mmGv('mmCapR'), capM = _mmGv('mmCapM'), capFR = _mmGv('mmCapFR'), capFM = _mmGv('mmCapFM');
        var cEl = document.getElementById('mmCapRes'); var ch = '';
        if (capR !== null && capM !== null && capR > 0) {
          var cPct = ((capM - capR) / capR * 100), cAbs = Math.abs(cPct);
          var cCol = cAbs <= 6 ? '#34d399' : cAbs <= 10 ? '#fbbf24' : '#f87171';
          var cSt = cAbs <= 6 ? _t('ht_mm_good','BUENO') : cAbs <= 10 ? _t('ht_mm_borderline','BORDERLINE') : _t('ht_mm_replace','REEMPLAZAR');
          if (vEl) { vEl.textContent = capM.toFixed(1); vEl.style.color = cCol; }
          if (stEl) stEl.textContent = 'COMP: ' + cSt;
          ch += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:' + cCol + '0a;border:1px solid ' + cCol + '20;border-radius:10px;">';
          ch += '<span style="font-size:18px;">' + (cAbs <= 6 ? '\u2705' : cAbs <= 10 ? '\u26A0\uFE0F' : '\u274C') + '</span>';
          ch += '<div style="flex:1;"><div style="font-size:11px;font-weight:800;color:' + cCol + ';">COMP: ' + cSt + ' (' + cPct.toFixed(1) + '%)</div>';
          ch += '<div style="font-size:9px;color:#4b5563;">' + capM + ' \u00B5F / ' + capR + ' \u00B5F</div></div></div>';
          if (cAbs > 10) diags.push(['error','Cap comp ' + cPct.toFixed(1) + '%',_t('ht_mm_replace_it','Reemplazar.')]);
          else if (cAbs > 6) diags.push(['warn','Cap comp borderline ' + cPct.toFixed(1) + '%','']);
          else diags.push(['ok','Cap comp OK','']);
        }
        if (capFR !== null && capFM !== null && capFR > 0) {
          var fPct = ((capFM - capFR) / capFR * 100), fAbs = Math.abs(fPct);
          var fCol = fAbs <= 6 ? '#34d399' : fAbs <= 10 ? '#fbbf24' : '#f87171';
          var fSt2 = fAbs <= 6 ? _t('ht_mm_good','BUENO') : fAbs <= 10 ? _t('ht_mm_borderline','BORDERLINE') : _t('ht_mm_replace','REEMPLAZAR');
          ch += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:' + fCol + '0a;border:1px solid ' + fCol + '20;border-radius:10px;margin-top:6px;">';
          ch += '<span style="font-size:18px;">' + (fAbs <= 6 ? '\u2705' : fAbs <= 10 ? '\u26A0\uFE0F' : '\u274C') + '</span>';
          ch += '<div style="flex:1;"><div style="font-size:11px;font-weight:800;color:' + fCol + ';">FAN: ' + fSt2 + ' (' + fPct.toFixed(1) + '%)</div>';
          ch += '<div style="font-size:9px;color:#4b5563;">' + capFM + ' \u00B5F / ' + capFR + ' \u00B5F</div></div></div>';
          if (fAbs > 10) diags.push(['error',_t('ht_mm_cap_fan_out','Cap fan fuera tolerancia'),'']);
        }
        if (cEl) cEl.innerHTML = ch;
        break; }
      case 'hz': {
        var freq = _mmGv('mmFreq'), duty = _mmGv('mmDuty');
        if (freq !== null && vEl) {
          vEl.textContent = freq.toFixed(1);
          if (freq >= 59 && freq <= 61) { vEl.style.color = '#34d399'; diags.push(['ok','60 Hz normal','']); if (stEl) stEl.textContent = _t('ht_mm_hz_standard','60 Hz ESTÁNDAR'); }
          else if (freq >= 49 && freq <= 51) { vEl.style.color = '#34d399'; diags.push(['ok','50 Hz','']); }
          else { vEl.style.color = '#fbbf24'; diags.push(['warn',_t('ht_mm_freq_unusual','Frecuencia inusual') + ' ' + freq + ' Hz','VFD?']); }
        }
        if (duty !== null && stEl && freq === null) stEl.textContent = 'DUTY: ' + duty + '%';
        break; }
      case 'watt': {
        var wV = _mmGv('mmWV'), wA = _mmGv('mmWA'), wPF = _mmGv('mmWPF'), wPh = _mmGv('mmWPh');
        var wEl = document.getElementById('mmWattRes');
        if (wV !== null && wA !== null) {
          var phases = (wPh !== null && wPh >= 3) ? 3 : 1;
          var pf2 = (wPF !== null && wPF > 0 && wPF <= 1) ? wPF : 1;
          var va, watts;
          if (phases === 3) { va = Math.sqrt(3) * wV * wA; watts = va * pf2; }
          else { va = wV * wA; watts = va * pf2; }
          var kw = watts / 1000, hp = watts / 746;
          var kvar = Math.sqrt(Math.max(0, va * va - watts * watts)) / 1000;
          if (vEl) { vEl.textContent = watts.toFixed(0); vEl.style.color = '#fbbf24'; }
          if (stEl) stEl.textContent = kw.toFixed(2) + ' kW / ' + hp.toFixed(2) + ' HP';
          var wh = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
          wh += '<div style="background:#ffffff;border:1px solid rgba(251,191,36,0.15);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;">WATTS</div><div style="font-size:16px;font-weight:900;color:#fbbf24;font-family:monospace;">' + watts.toFixed(0) + '</div></div>';
          wh += '<div style="background:#ffffff;border:1px solid rgba(52,211,153,0.15);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;">HP</div><div style="font-size:16px;font-weight:900;color:#34d399;font-family:monospace;">' + hp.toFixed(2) + '</div></div>';
          wh += '<div style="background:#ffffff;border:1px solid rgba(96,165,250,0.15);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;">kVA</div><div style="font-size:14px;font-weight:900;color:#60a5fa;font-family:monospace;">' + (va / 1000).toFixed(2) + '</div></div>';
          wh += '<div style="background:#ffffff;border:1px solid rgba(192,132,252,0.15);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:8px;color:#4b5563;">kVAR</div><div style="font-size:14px;font-weight:900;color:#c084fc;font-family:monospace;">' + kvar.toFixed(2) + '</div></div></div>';
          if (pf2 < 0.8) { wh += '<div style="margin-top:6px;padding:4px 6px;background:rgba(248,113,113,0.08);border-radius:6px;font-size:9px;color:#f87171;font-weight:700;text-align:center;">' + _t('ht_mm_pf_critical','PF Crítico — Penalidad eléctrica') + '</div>'; diags.push(['error',_t('ht_mm_pf_critical_diag','PF crítico') + ' ' + pf2,_t('ht_mm_penalty','Penalidad.')]); }
          else if (pf2 < 0.9) { diags.push(['warn',_t('ht_mm_pf_low','PF bajo') + ' ' + pf2,'']); }
          else { diags.push(['ok',_t('ht_mm_pf_good','PF bueno') + ' ' + pf2,'']); }
          diags.push(['ok',watts.toFixed(0) + 'W / ' + hp.toFixed(2) + 'HP / ' + (va / 1000).toFixed(2) + 'kVA','']);
          if (wEl) wEl.innerHTML = wh;
        }
        break; }
      case 'ua': {
        var uaV = _mmGv('mmUA'); var uaEl = document.getElementById('mmUARes');
        if (uaV !== null) {
          if (vEl) { vEl.textContent = uaV.toFixed(1); }
          var uah = '';
          if (uaV <= 0) {
            if (vEl) vEl.style.color = '#f87171';
            if (stEl) stEl.textContent = _t('ht_mm_no_flame','SIN LLAMA');
            uah = '<div style="padding:14px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\u274C</div><div style="font-size:14px;font-weight:900;color:#f87171;margin-top:4px;">' + _t('ht_mm_no_flame_signal','SIN SEÑAL DE LLAMA') + '</div><div style="font-size:9px;color:#4b5563;margin-top:2px;">0 \u00B5A \u2014 ' + _t('ht_mm_no_flame_desc','Sensor no detecta flama / válvula de gas cerrada') + '</div></div>';
            diags.push(['error','Flame sensor 0\u00B5A',_t('ht_mm_no_flame_diag','Sin llama.')]);
            _mmBeep(200, 300);
          } else if (uaV < 1) {
            if (vEl) vEl.style.color = '#f87171';
            if (stEl) stEl.textContent = _t('ht_mm_weak_signal','SEÑAL DÉBIL');
            uah = '<div style="padding:14px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\u26A0\uFE0F</div><div style="font-size:14px;font-weight:900;color:#f87171;margin-top:4px;">' + _t('ht_mm_very_weak_signal','SEÑAL MUY DÉBIL') + '</div><div style="font-size:9px;color:#4b5563;margin-top:2px;">' + uaV.toFixed(1) + ' \u00B5A \u2014 ' + _t('ht_mm_clean_sensor_desc','Limpiar sensor con lija fina / verificar ground') + '</div></div>';
            diags.push(['error',_t('ht_mm_flame_weak','Flame sensor débil') + ' ' + uaV + '\u00B5A',_t('ht_mm_clean_sensor','Limpiar sensor.')]);
          } else if (uaV < 3) {
            if (vEl) vEl.style.color = '#fbbf24';
            if (stEl) stEl.textContent = _t('ht_mm_acceptable','ACEPTABLE');
            uah = '<div style="padding:14px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\uD83D\uDD25</div><div style="font-size:14px;font-weight:900;color:#fbbf24;margin-top:4px;">' + _t('ht_mm_acceptable','ACEPTABLE') + '</div><div style="font-size:9px;color:#4b5563;margin-top:2px;">' + uaV.toFixed(1) + ' \u00B5A \u2014 ' + _t('ht_mm_functional_clean_soon','Funcional pero limpiar pronto') + '</div></div>';
            diags.push(['warn',_t('ht_mm_flame_acceptable','Flame sensor aceptable') + ' ' + uaV + '\u00B5A',_t('ht_mm_clean_soon','Limpiar pronto.')]);
          } else {
            if (vEl) vEl.style.color = '#34d399';
            if (stEl) stEl.textContent = _t('ht_mm_strong_signal','SEÑAL FUERTE');
            uah = '<div style="padding:14px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\uD83D\uDD25</div><div style="font-size:14px;font-weight:900;color:#34d399;margin-top:4px;">' + _t('ht_mm_strong_signal','SEÑAL FUERTE') + '</div><div style="font-size:9px;color:#4b5563;margin-top:2px;">' + uaV.toFixed(1) + ' \u00B5A \u2014 ' + _t('ht_mm_optimal_conditions','Flame sensor en óptimas condiciones') + '</div></div>';
            diags.push(['ok',_t('ht_mm_flame_strong','Flame sensor fuerte') + ' ' + uaV + '\u00B5A','']);
            _mmBeep(800, 150);
          }
          // µA scale bar
          var uaPct = Math.min(uaV / 6 * 100, 100);
          var uaCol = uaV < 1 ? '#f87171' : uaV < 3 ? '#fbbf24' : '#34d399';
          uah += '<div style="margin-top:8px;height:20px;background:#ffffff;border-radius:10px;overflow:hidden;position:relative;border:1px solid rgba(0,0,0,0.06);">';
          uah += '<div style="height:100%;width:' + uaPct + '%;background:linear-gradient(90deg,' + uaCol + ',' + uaCol + 'cc);border-radius:10px;transition:width 0.3s;"></div>';
          uah += '<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:9px;font-weight:800;color:#111827;font-family:monospace;">' + uaV.toFixed(1) + ' / 6.0 \u00B5A</div></div>';
          uah += '<div style="display:flex;justify-content:space-between;margin-top:3px;font-size:7px;color:#4b5563;font-weight:700;"><span>0 \u00B5A</span><span style="color:#f87171;">' + _t('ht_mm_weak','Débil') + ' &lt;1</span><span style="color:#fbbf24;">OK 1-3</span><span style="color:#34d399;">' + _t('ht_mm_strong','Fuerte') + ' 3-6</span></div>';
          if (uaEl) uaEl.innerHTML = uah;
          if (bf) { bf.style.width = uaPct + '%'; bf.style.background = uaCol; }
        }
        break; }
      case 'diode': {
        var dio = _mmGv('mmDiode'); var dEl = document.getElementById('mmDiodeRes');
        if (dio !== null) {
          if (vEl) vEl.textContent = dio.toFixed(2);
          if (dio >= 0.4 && dio <= 0.8) { if (vEl) vEl.style.color = '#34d399'; if (dEl) dEl.innerHTML = '<span style="color:#34d399;">\u2705 SILICON OK</span>'; diags.push(['ok','Diodo OK','']); }
          else if (dio < 0.1) { if (vEl) vEl.style.color = '#f87171'; if (dEl) dEl.innerHTML = '<span style="color:#f87171;">\u274C ' + _t('ht_mm_short','CORTO') + '</span>'; diags.push(['error',_t('ht_mm_diode_short','Diodo corto'),'']); }
          else if (dio > 2.0) { if (vEl) vEl.style.color = '#f87171'; if (dEl) dEl.innerHTML = '<span style="color:#f87171;">\u274C ' + _t('ht_mm_open_label','ABIERTO') + '</span>'; diags.push(['error',_t('ht_mm_diode_open','Diodo abierto'),'']); }
          else { if (vEl) vEl.style.color = '#fbbf24'; if (dEl) dEl.innerHTML = '<span style="color:#fbbf24;">\u26A0\uFE0F LED/Schottky?</span>'; diags.push(['warn',_t('ht_mm_atypical_drop','Drop atípico'),'']); }
        }
        break; }
      case 'cont': {
        var cont = _mmGv('mmCont'); var ctEl = document.getElementById('mmContRes');
        if (cont !== null) {
          if (vEl) vEl.textContent = cont.toFixed(1);
          if (cont < 50) {
            if (vEl) vEl.style.color = '#34d399';
            if (ctEl) ctEl.innerHTML = '<div style="padding:14px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\uD83D\uDD0A</div><div style="font-size:16px;font-weight:900;color:#34d399;margin-top:4px;">BEEP \u2014 ' + _t('ht_mm_continuity','CONTINUIDAD') + '</div><div style="font-size:10px;color:#4b5563;margin-top:2px;">' + cont + '\u03A9 ' + _t('ht_mm_closed_label','cerrado') + '</div></div>';
            diags.push(['ok',_t('ht_mm_continuity_ok','Continuidad OK'),_t('ht_mm_closed','Cerrado.')]); if (stEl) stEl.textContent = _t('ht_mm_circuit_closed','CIRCUITO CERRADO');
          } else {
            if (vEl) vEl.style.color = '#f87171';
            if (ctEl) ctEl.innerHTML = '<div style="padding:14px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:12px;text-align:center;"><div style="font-size:28px;">\uD83D\uDD07</div><div style="font-size:16px;font-weight:900;color:#f87171;margin-top:4px;">' + _t('ht_mm_no_continuity_label','SIN CONTINUIDAD') + '</div><div style="font-size:10px;color:#4b5563;margin-top:2px;">' + cont + '\u03A9 ' + _t('ht_mm_open_label2','abierto') + '</div></div>';
            diags.push(['error',_t('ht_mm_no_continuity','Sin continuidad'),_t('ht_mm_open','Abierto.')]); if (stEl) stEl.textContent = _t('ht_mm_circuit_open','CIRCUITO ABIERTO');
          }
        }
        break; }
      case 'mohm': {
        var meg = _mmGv('mmMeg'); var mgEl = document.getElementById('mmMegRes');
        if (meg !== null) {
          if (vEl) vEl.textContent = meg.toFixed(0);
          if (meg >= 50) { if (vEl) vEl.style.color = '#34d399'; if (mgEl) mgEl.innerHTML = '<span style="color:#34d399;">\u2705 ' + _t('ht_mm_insulation_good','AISLAMIENTO BUENO') + '</span>'; diags.push(['ok',_t('ht_mm_insulation','Aislamiento') + ' ' + meg + 'M\u03A9','']); if (stEl) stEl.textContent = _t('ht_mm_insulation_good','AISLAMIENTO BUENO'); }
          else if (meg >= 1) { if (vEl) vEl.style.color = '#fbbf24'; if (mgEl) mgEl.innerHTML = '<span style="color:#fbbf24;">\u26A0\uFE0F ' + _t('ht_mm_degraded','DEGRADADO') + '</span>'; diags.push(['warn',_t('ht_mm_megohm_low','Meg-Ohm bajo') + ' ' + meg,_t('ht_mm_monitor','Monitorear.')]); if (stEl) stEl.textContent = _t('ht_mm_degraded','DEGRADADO'); }
          else { if (vEl) vEl.style.color = '#f87171'; if (mgEl) mgEl.innerHTML = '<span style="color:#f87171;">\u274C GROUNDED \u2014 ' + _t('ht_mm_no_energize','NO ENERGIZAR') + '</span>'; diags.push(['error','GROUNDED ' + meg + 'M\u03A9',_t('ht_mm_no_energize','NO energizar.')]); if (stEl) stEl.textContent = 'GROUNDED'; }
        }
        break; }
      case 'temp': {
        var t1 = _mmGv('mmTemp1'), t2 = _mmGv('mmTemp2'); var tEl = document.getElementById('mmTempRes');
        if (t1 !== null && vEl) { vEl.textContent = t1.toFixed(1); vEl.style.color = '#f97316'; }
        if (t1 !== null && t2 !== null) {
          var dT = Math.abs(t1 - t2);
          if (tEl) tEl.innerHTML = '<span style="color:#f97316;">\u0394T: ' + dT.toFixed(1) + '\u00B0F</span> <span style="color:#4b5563;">(T1:' + t1 + ' / T2:' + t2 + ')</span>';
          if (stEl) stEl.textContent = '\u0394T: ' + dT.toFixed(1) + '\u00B0F';
        }
        break; }
      case 'ph3': {
        var l12 = _mmGv('mmL12'), l23 = _mmGv('mmL23'), l13 = _mmGv('mmL13');
        var a1 = _mmGv('mmA1'), a2 = _mmGv('mmA2'), a3 = _mmGv('mmA3');
        var pf = _mmGv('mmPF'), vSrc = _mmGv('mmVsrc'), vLoad = _mmGv('mmVload');
        var pfEl = document.getElementById('mmPFRes'); var phEl = document.getElementById('mmPh3Res');
        var phh = '';
        if (l12 !== null && l23 !== null && l13 !== null) {
          var vAvg = (l12 + l23 + l13) / 3;
          var vMxD = Math.max(Math.abs(l12 - vAvg), Math.abs(l23 - vAvg), Math.abs(l13 - vAvg));
          var vImb = vAvg > 0 ? (vMxD / vAvg * 100) : 0;
          var viC = vImb <= 2 ? '#34d399' : vImb <= 5 ? '#fbbf24' : '#f87171';
          if (vEl) { vEl.textContent = vAvg.toFixed(1); vEl.style.color = viC; }
          if (stEl) stEl.textContent = _t('ht_mm_v_imbalance','DESBALANCE V') + ': ' + vImb.toFixed(1) + '%';
          phh += '<div style="display:flex;align-items:center;gap:6px;padding:6px;background:' + viC + '0a;border:1px solid ' + viC + '15;border-radius:8px;margin-bottom:4px;">';
          phh += '<span>' + (vImb <= 2 ? '\u2705' : vImb <= 5 ? '\u26A0\uFE0F' : '\u274C') + '</span>';
          phh += '<div style="flex:1;font-size:10px;font-weight:700;color:' + viC + ';">' + _t('ht_mm_v_imbalance','Desbalance V') + ': ' + vImb.toFixed(1) + '% ' + (vImb <= 2 ? 'NEMA OK' : '>2%') + '</div></div>';
          if (vImb <= 2) diags.push(['ok',_t('ht_mm_v_imbalance','Desbalance V') + ' ' + vImb.toFixed(1) + '%','']);
          else if (vImb <= 5) diags.push(['warn',_t('ht_mm_v_imbalance','Desbalance V') + ' ' + vImb.toFixed(1) + '%','']);
          else diags.push(['error',_t('ht_mm_v_imbalance_critical','Desbalance V crítico'),_t('ht_mm_no_operate','NO operar.')]);
        }
        if (a1 !== null && a2 !== null && a3 !== null) {
          var aAvg = (a1 + a2 + a3) / 3;
          var aMxD = Math.max(Math.abs(a1 - aAvg), Math.abs(a2 - aAvg), Math.abs(a3 - aAvg));
          var aImb = aAvg > 0 ? (aMxD / aAvg * 100) : 0;
          var aiC = aImb <= 5 ? '#34d399' : aImb <= 10 ? '#fbbf24' : '#f87171';
          phh += '<div style="display:flex;align-items:center;gap:6px;padding:6px;background:' + aiC + '0a;border:1px solid ' + aiC + '15;border-radius:8px;margin-bottom:4px;">';
          phh += '<span>' + (aImb <= 5 ? '\u2705' : aImb <= 10 ? '\u26A0\uFE0F' : '\u274C') + '</span>';
          phh += '<div style="flex:1;font-size:10px;font-weight:700;color:' + aiC + ';">' + _t('ht_mm_a_imbalance','Desbalance A') + ': ' + aImb.toFixed(1) + '%</div></div>';
          if (aImb <= 5) diags.push(['ok',_t('ht_mm_a_imbalance','Desbalance A') + ' ' + aImb.toFixed(1) + '%','']);
          else if (aImb <= 10) diags.push(['warn',_t('ht_mm_a_imbalance','Desbalance A') + ' ' + aImb.toFixed(1) + '%','']);
          else diags.push(['error',_t('ht_mm_a_imbalance_critical','Desbalance A crítico'),_t('ht_mm_open_phase','Fase abierta?')]);
        }
        if (pf !== null) {
          var pfC = pf >= 0.9 ? '#34d399' : pf >= 0.8 ? '#fbbf24' : '#f87171';
          var pfS = pf >= 0.9 ? _t('ht_mm_good','BUENO') : pf >= 0.8 ? _t('ht_mm_low','BAJO') : _t('ht_mm_critical','CRÍTICO');
          var pfh = '<div style="font-size:11px;font-weight:800;color:' + pfC + ';">PF ' + pf.toFixed(2) + ' ' + pfS + '</div>';
          if (l12 !== null && a1 !== null && l23 !== null && a2 !== null && l13 !== null && a3 !== null) {
            var vA3 = (l12 + l23 + l13) / 3, aA3 = (a1 + a2 + a3) / 3;
            var kva = (Math.sqrt(3) * vA3 * aA3) / 1000, kw = kva * pf;
            pfh += '<div style="font-size:8px;color:#4b5563;">' + kw.toFixed(1) + 'kW | ' + kva.toFixed(1) + 'kVA</div>';
          }
          if (pfEl) pfEl.innerHTML = pfh;
          if (pf < 0.8) diags.push(['error','PF cr\u00EDtico','Penalidad.']);
          else if (pf < 0.9) diags.push(['warn','PF bajo','']);
          else diags.push(['ok','PF bueno','']);
        }
        if (vSrc !== null && vLoad !== null && vSrc > 0) {
          var vDr = vSrc - vLoad, vDrP = (vDr / vSrc * 100);
          var vdC = vDrP <= 3 ? '#34d399' : vDrP <= 5 ? '#fbbf24' : '#f87171';
          phh += '<div style="display:flex;align-items:center;gap:6px;padding:6px;background:' + vdC + '0a;border:1px solid ' + vdC + '15;border-radius:8px;">';
          phh += '<span>' + (vDrP <= 3 ? '\u2705' : vDrP <= 5 ? '\u26A0\uFE0F' : '\u274C') + '</span>';
          phh += '<div style="flex:1;font-size:10px;font-weight:700;color:' + vdC + ';">Ca\u00EDda: ' + vDr.toFixed(1) + 'V (' + vDrP.toFixed(1) + '%) ' + (vDrP <= 3 ? 'NEC OK' : '>3%') + '</div></div>';
          if (vDrP <= 3) diags.push(['ok','Ca\u00EDda V OK','']);
          else if (vDrP <= 5) diags.push(['warn','Ca\u00EDda V l\u00EDmite','']);
          else diags.push(['error','Ca\u00EDda V excesiva','Calibre wire.']);
        }
        if (phEl) phEl.innerHTML = phh;
        break; }
    }
    if (diagEl && diags.length > 0) {
      var dh = '<div style="background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.08);border-radius:14px;padding:12px;">';
      dh += '<div style="font-size:9px;font-weight:800;color:#fbbf24;margin-bottom:6px;letter-spacing:0.5px;">DIAGN\u00D3STICO</div>';
      for (var di = 0; di < diags.length; di++) {
        var dd = diags[di];
        var ic = dd[0] === 'error' ? '#f87171' : dd[0] === 'warn' ? '#fbbf24' : '#34d399';
        var sy = dd[0] === 'error' ? '\u274C' : dd[0] === 'warn' ? '\u26A0\uFE0F' : '\u2705';
        dh += '<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:3px;padding:4px 6px;background:' + ic + '08;border-radius:6px;">';
        dh += '<span style="font-size:10px;">' + sy + '</span>';
        dh += '<div><div style="font-size:9px;font-weight:700;color:' + ic + ';">' + dd[1] + '</div>';
        if (dd[2]) dh += '<div style="font-size:8px;color:#4b5563;">' + dd[2] + '</div>';
        dh += '</div></div>';
      }
      dh += '</div>';
      dh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('multimeter') : '';
      diagEl.innerHTML = dh;
    } else if (diagEl) { diagEl.innerHTML = ''; }
  };

  window._htMMIADiagnose = function() {
    _mmSave();
    var comp = window._htMMComponent || 'comp';
    var cL = {comp:'Compresor',condFan:'Condenser Fan',blower:'Blower',contactor:'Contactor',transformer:'Transformador',capacitor:'Capacitor'};
    var eqI = window._htMMEquip || {};
    var p = 'Eres t\u00E9cnico electricista HVAC master. Analiza mediciones del: ' + (cL[comp] || comp) + '. Modo: ' + (window._htMMMode || '') + '\n\n';
    p += '--- INFORMACI\u00D3N DEL EQUIPO Y SERVICIO ---\n';
    p += 'Modelo: ' + (eqI.model || 'N/A') + '\nSerie: ' + (eqI.serial || 'N/A') + '\n';
    p += 'Cliente: ' + (eqI.clientName || 'N/A') + '\nDirecci\u00F3n: ' + (eqI.clientAddr || 'N/A') + '\n';
    p += 'T\u00E9cnico: ' + (eqI.techName || 'N/A') + '\n# T\u00E9cnico: ' + (eqI.techNum || 'N/A') + '\nEmail: ' + (eqI.techEmail || 'N/A') + '\n\n';
    p += 'V-AC: Nameplate=' + (_mmGv('mmVrated') || 'N/A') + 'V Medido=' + (_mmGv('mmVmeas') || 'N/A') + 'V Control=' + (_mmGv('mmV24') || 'N/A') + 'V DC=' + (_mmGv('mmVdc') || 'N/A') + 'V\n';
    p += 'AMPS: RLA=' + (_mmGv('mmRLA') || 'N/A') + 'A LRA=' + (_mmGv('mmLRA') || 'N/A') + 'A Medido=' + (_mmGv('mmAMeas') || 'N/A') + 'A InRush=' + (_mmGv('mmInrush') || 'N/A') + 'A\n';
    p += 'CAP: Comp=' + (_mmGv('mmCapR') || 'N/A') + '/' + (_mmGv('mmCapM') || 'N/A') + '\u00B5F Fan=' + (_mmGv('mmCapFR') || 'N/A') + '/' + (_mmGv('mmCapFM') || 'N/A') + '\u00B5F\n';
    p += 'WINDINGS: C-S=' + (_mmGv('mmCS') || 'N/A') + '\u03A9 C-R=' + (_mmGv('mmCR') || 'N/A') + '\u03A9 S-R=' + (_mmGv('mmSR') || 'N/A') + '\u03A9 MegOhm=' + (_mmGv('mmMeg') || 'N/A') + 'M\u03A9\n';
    p += 'Hz=' + (_mmGv('mmFreq') || 'N/A') + ' Duty=' + (_mmGv('mmDuty') || 'N/A') + '% Diode=' + (_mmGv('mmDiode') || 'N/A') + 'V Cont=' + (_mmGv('mmCont') || 'N/A') + '\u03A9\n';
    p += 'TEMP: T1=' + (_mmGv('mmTemp1') || 'N/A') + '\u00B0F T2=' + (_mmGv('mmTemp2') || 'N/A') + '\u00B0F\n';
    var l12 = _mmGv('mmL12'), l23 = _mmGv('mmL23'), l13 = _mmGv('mmL13');
    var a1 = _mmGv('mmA1'), a2 = _mmGv('mmA2'), a3 = _mmGv('mmA3');
    p += '3\u03C6: L1-L2=' + (l12 || 'N/A') + 'V L2-L3=' + (l23 || 'N/A') + 'V L1-L3=' + (l13 || 'N/A') + 'V\n';
    p += 'A-FASE: L1=' + (a1 || 'N/A') + 'A L2=' + (a2 || 'N/A') + 'A L3=' + (a3 || 'N/A') + 'A\n';
    if (l12 && l23 && l13) { var va = (l12 + l23 + l13) / 3; var vd = Math.max(Math.abs(l12 - va), Math.abs(l23 - va), Math.abs(l13 - va)); p += 'Desbalance V: ' + (va > 0 ? (vd / va * 100).toFixed(1) : '0') + '%\n'; }
    if (a1 && a2 && a3) { var aa = (a1 + a2 + a3) / 3; var ad = Math.max(Math.abs(a1 - aa), Math.abs(a2 - aa), Math.abs(a3 - aa)); p += 'Desbalance A: ' + (aa > 0 ? (ad / aa * 100).toFixed(1) : '0') + '%\n'; }
    p += 'PF=' + (_mmGv('mmPF') || 'N/A');
    var vS = _mmGv('mmVsrc'), vL = _mmGv('mmVload');
    if (vS && vL && vS > 0) p += ' Ca\u00EDda V: ' + vS + '\u2192' + vL + 'V (' + ((vS - vL) / vS * 100).toFixed(1) + '%)';
    p += '\nWATTS: V=' + (_mmGv('mmWV') || 'N/A') + ' A=' + (_mmGv('mmWA') || 'N/A') + ' PF=' + (_mmGv('mmWPF') || 'N/A') + ' Fases=' + (_mmGv('mmWPh') || '1');
    var wv2 = _mmGv('mmWV'), wa2 = _mmGv('mmWA'), wpf2 = _mmGv('mmWPF');
    if (wv2 && wa2) { var w2 = wv2 * wa2 * (wpf2 || 1); p += ' =' + w2.toFixed(0) + 'W (' + (w2 / 746).toFixed(2) + 'HP)'; }
    p += '\nFLAME SENSOR: ' + (_mmGv('mmUA') || 'N/A') + '\u00B5A';
    p += '\n\nIMPORTANTE: Basa tu diagn\u00F3stico \u00DANICAMENTE en los datos proporcionados arriba. NO inventes datos que no est\u00E9n listados. Si un campo dice N/A, indica que ese dato no fue proporcionado.\n';
    p += '\nResponde EN ESPA\u00D1OL:\n1. Diagn\u00F3stico completo\n2. An\u00E1lisis de TODAS las mediciones\n3. Causa ra\u00EDz\n4. Soluci\u00F3n paso a paso\n5. Seguridad';
    _htCallIA(p, 'htMMIA', 'htMMIABtn');
  };

  // ============================
  // LEADS INTERACTIVOS — TAP & CONNECT
  // ============================
  // ── SC680 BLE Live Dashboard — shows all channels in real-time ──
  window._mmUpdateBLELive = function() {
    var el = document.getElementById('htMMBLELive');
    if (!el) return;
    var fp = window._fpDevices;
    if (!fp) { el.innerHTML = ''; return; }
    var meter = null;
    for (var uid in fp) {
      if (fp[uid].probeCategory === 'multimeter' && !fp[uid]._stale && fp[uid].meterMode) { meter = fp[uid]; break; }
    }
    if (!meter) { el.innerHTML = ''; return; }
    var h = '<div style="background:rgba(74,222,128,0.04);border:1.5px solid rgba(74,222,128,0.2);border-radius:14px;padding:12px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<div style="width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:blePulse 1.2s ease-in-out infinite;"></div>';
    h += '<span style="font-size:10px;font-weight:800;color:#4ade80;letter-spacing:0.5px;">SC680 EN VIVO</span></div>';
    if (meter.battery !== undefined) {
      var batCol = meter.battery > 50 ? '#4ade80' : meter.battery > 20 ? '#fbbf24' : '#f87171';
      h += '<span style="font-size:9px;color:' + batCol + ';font-weight:700;">' + meter.battery + '%</span>';
    }
    h += '</div>';
    // CH1 — Main reading
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += '<div style="background:#ffffff;border:1px solid rgba(52,211,153,0.15);border-radius:10px;padding:10px;">';
    h += '<div style="font-size:8px;font-weight:800;color:#4b5563;letter-spacing:0.5px;margin-bottom:4px;">CH1 \u2022 LEADS</div>';
    var ch1Val = '--', ch1Unit = '', ch1Col = '#34d399';
    if (meter.meterIsOL) { ch1Val = 'OL'; ch1Col = '#f87171'; }
    else if (meter.meterValue !== undefined && typeof meter.meterValue === 'number') { ch1Val = meter.meterValue.toFixed(1); }
    else if (meter.meterValue !== undefined) { ch1Val = String(meter.meterValue); }
    ch1Unit = meter.meterUnit || meter.meterMode || '';
    h += '<div style="font-family:\'Courier New\',monospace;font-size:28px;font-weight:900;color:' + ch1Col + ';line-height:1;">' + ch1Val + '</div>';
    h += '<div style="font-size:11px;color:' + ch1Col + ';font-weight:700;opacity:0.7;margin-top:2px;">' + ch1Unit + '</div>';
    // Named value
    var ch1Named = '';
    if (meter.voltageAC !== undefined) ch1Named = meter.voltageAC.toFixed(1) + ' VAC';
    else if (meter.voltageDC !== undefined) ch1Named = meter.voltageDC.toFixed(1) + ' VDC';
    else if (meter.resistanceOhms !== undefined) ch1Named = (typeof meter.resistanceOhms === 'number' ? meter.resistanceOhms.toFixed(1) + ' \u03A9' : meter.resistanceOhms);
    else if (meter.capacitanceUF !== undefined) ch1Named = meter.capacitanceUF.toFixed(2) + ' \u00B5F';
    else if (meter.frequencyHz !== undefined) ch1Named = meter.frequencyHz.toFixed(1) + ' Hz';
    else if (meter.temperatureF !== undefined) ch1Named = meter.temperatureF.toFixed(1) + ' \u00B0F';
    else if (meter.microAmps !== undefined) ch1Named = meter.microAmps.toFixed(1) + ' \u00B5A';
    else if (meter.powerFactor !== undefined) ch1Named = meter.powerFactor.toFixed(1) + ' PF%';
    if (ch1Named) h += '<div style="font-size:8px;color:#4b5563;margin-top:3px;">' + ch1Named + '</div>';
    h += '</div>';
    // CH2 — Clamp/secondary
    h += '<div style="background:#ffffff;border:1px solid rgba(96,165,250,0.15);border-radius:10px;padding:10px;">';
    h += '<div style="font-size:8px;font-weight:800;color:#4b5563;letter-spacing:0.5px;margin-bottom:4px;">CH2 \u2022 CLAMP</div>';
    var ch2Val = '--', ch2Unit = '', ch2Col = '#60a5fa';
    if (meter.ch2Mode && meter.ch2Mode !== '') {
      if (meter.ch2IsOL) { ch2Val = 'OL'; ch2Col = '#f87171'; }
      else if (meter.ch2Value !== undefined && typeof meter.ch2Value === 'number' && meter.ch2Value !== 0) { ch2Val = meter.ch2Value.toFixed(1); }
      ch2Unit = meter.ch2Unit || meter.ch2Mode || '';
      // Named CH2 values
      if (meter.ampsAC !== undefined) { ch2Val = meter.ampsAC.toFixed(1); ch2Unit = 'A AC'; }
      else if (meter.temperatureF_CH2 !== undefined) { ch2Val = meter.temperatureF_CH2.toFixed(1); ch2Unit = '\u00B0F'; }
    } else {
      ch2Val = '--'; ch2Unit = 'Sin clamp';  ch2Col = '#3D3D3A';
    }
    h += '<div style="font-family:\'Courier New\',monospace;font-size:28px;font-weight:900;color:' + ch2Col + ';line-height:1;">' + ch2Val + '</div>';
    h += '<div style="font-size:11px;color:' + ch2Col + ';font-weight:700;opacity:0.7;margin-top:2px;">' + ch2Unit + '</div>';
    if (meter.watts !== undefined) h += '<div style="font-size:8px;color:#fbbf24;margin-top:3px;">' + meter.watts.toFixed(0) + ' W</div>';
    h += '</div></div>';
    // Extra readings row
    var extras = [];
    if (meter.voltageAC !== undefined && meter.ampsAC !== undefined) {
      var w = meter.voltageAC * meter.ampsAC;
      extras.push({l:'Potencia', v:w.toFixed(0) + ' W', c:'#fbbf24'});
      extras.push({l:'HP', v:(w / 746).toFixed(2), c:'#fbbf24'});
    }
    if (meter.powerFactor !== undefined) extras.push({l:'PF', v:meter.powerFactor.toFixed(1) + '%', c:'#c084fc'});
    if (meter.frequencyHz !== undefined && meter.meterMode !== 'Hz') extras.push({l:'Hz', v:meter.frequencyHz.toFixed(1), c:'#0ea5e9'});
    if (extras.length > 0) {
      h += '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">';
      for (var ei = 0; ei < extras.length; ei++) {
        h += '<div style="flex:1;min-width:60px;background:#ffffff;border:1px solid rgba(0,0,0,0.06);border-radius:8px;padding:6px 8px;text-align:center;">';
        h += '<div style="font-size:7px;color:#4b5563;font-weight:700;">' + extras[ei].l + '</div>';
        h += '<div style="font-size:13px;font-weight:900;color:' + extras[ei].c + ';font-family:monospace;">' + extras[ei].v + '</div></div>';
      }
      h += '</div>';
    }
    h += '</div>';
    el.innerHTML = h;
  };

  window.initMultimeterScreen = function() {
    var s = document.getElementById('multimeterScreen');
    if (!s) return;
    try {
      _htShowMultimeter(s, true);
    } catch(e) {
      console.error('Multimeter error:', e);
      s.innerHTML = '<div style="padding:40px;color:#f87171;text-align:center;font-family:monospace;"><div style="font-size:28px;margin-bottom:10px;">\u26A0\uFE0F</div><div style="font-size:14px;font-weight:700;">Error cargando Mult\u00EDmetro</div><div style="font-size:11px;color:#3D3D3A;margin-top:8px;">' + (e.message || e) + '</div><button onclick="showScreen(\'dashboardScreen\')" style="margin-top:16px;padding:10px 20px;background:#0F0F0F;border:none;color:#FFFFFF;border-radius:8px;cursor:pointer;">Volver</button></div>';
    }
  };

  // ============================
  // MULTIMETER — Equipment, Save Readings, Report
  // ============================

  window._htMMToggleEquip = function() {
    var panel = document.getElementById('htMMEquipPanel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  };

  window._htMMSaveEquip = function() {
    var eq = window._htMMEquip;
    var m = document.getElementById('mmEqModel');
    var s = document.getElementById('mmEqSerial');
    var cn = document.getElementById('mmEqClientName');
    var ca = document.getElementById('mmEqClientAddr');
    var tn = document.getElementById('mmEqTechName');
    var tnum = document.getElementById('mmEqTechNum');
    var te = document.getElementById('mmEqTechEmail');
    if (m) eq.model = m.value;
    if (s) eq.serial = s.value;
    if (cn) eq.clientName = cn.value;
    if (ca) eq.clientAddr = ca.value;
    if (tn) eq.techName = tn.value;
    if (tnum) eq.techNum = tnum.value;
    if (te) eq.techEmail = te.value;
  };

  window._htMMSaveReading = function() {
    var mode = window._htMMMode;
    if (!mode || mode === 'off') return;
    var comp = window._htMMComponent || 'comp';
    if (!window._htMMReadings[comp]) window._htMMReadings[comp] = [];
    var vEl = document.getElementById('htMMVal');
    var uEl = document.getElementById('htMMUnit');
    var mlEl = document.getElementById('htMMModeLbl');
    var val = vEl ? vEl.textContent : '---';
    var unit = uEl ? uEl.textContent : '';
    var modeLabel = mlEl ? mlEl.textContent : mode;
    if (val === '---' || val === 'OFF') {
      // Try to get value from data store instead
      var d = window._htMMData || {};
      var keys = Object.keys(d);
      if (keys.length > 0) {
        var firstVal = d[keys[0]];
        if (firstVal !== undefined && firstVal !== null && firstVal !== '') {
          val = String(firstVal);
        }
      }
    }
    var reading = {
      mode: mode,
      modeLabel: modeLabel,
      value: val,
      unit: unit,
      timestamp: new Date().toLocaleString('es-MX', {hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}),
      fullTime: new Date().toISOString()
    };
    // Also capture all current input values for this mode
    var inputs = document.querySelectorAll('#htMMInputs input');
    var details = {};
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].id && inputs[i].value !== '') {
        details[inputs[i].id] = parseFloat(inputs[i].value) || inputs[i].value;
      }
    }
    reading.details = details;
    window._htMMReadings[comp].push(reading);
    // Flash save button green
    var btn = document.querySelector('[onclick="_htMMSaveReading()"]');
    if (btn) {
      btn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
      btn.textContent = 'Guardado!';
      setTimeout(function() {
        btn.style.background = 'linear-gradient(135deg,#FF6B35,#e55a2b)';
        btn.innerHTML = '<span style="font-size:14px;">\uD83D\uDCBE</span> Guardar Lectura';
      }, 1200);
    }
    // Update component tab to show green (has readings)
    var cBtn = document.getElementById('htMMC_' + comp);
    if (cBtn) {
      cBtn.style.background = 'rgba(251,191,36,0.12)';
      cBtn.style.borderColor = 'rgba(251,191,36,0.4)';
      cBtn.style.color = '#fbbf24';
    }
    window._htMMRenderReadingsLog();
  };

  window._htMMRenderReadingsLog = function() {
    var el = document.getElementById('htMMReadingsLog');
    if (!el) return;
    var comp = window._htMMComponent || 'comp';
    var readings = (window._htMMReadings && window._htMMReadings[comp]) ? window._htMMReadings[comp] : [];
    if (readings.length === 0) { el.innerHTML = ''; return; }
    var h = '<div style="background:rgba(74,222,128,0.03);border:1px solid rgba(74,222,128,0.12);border-radius:12px;padding:10px;">';
    h += '<div style="font-size:9px;font-weight:800;color:#4ade80;letter-spacing:0.5px;margin-bottom:8px;">LECTURAS GUARDADAS (' + readings.length + ')</div>';
    for (var i = readings.length - 1; i >= 0; i--) {
      var r = readings[i];
      h += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#ffffff;border-radius:8px;margin-bottom:4px;border:1px solid rgba(0,0,0,0.03);">';
      h += '<div style="flex:1;">';
      h += '<span style="font-size:11px;font-weight:800;color:#0F0F0F;font-family:monospace;">' + r.value + ' ' + r.unit + '</span>';
      h += '<span style="font-size:8px;color:#4b5563;margin-left:6px;">' + r.modeLabel + '</span>';
      h += '</div>';
      h += '<div style="display:flex;align-items:center;gap:6px;">';
      h += '<span style="font-size:8px;color:#3D3D3A;">' + r.timestamp + '</span>';
      h += '<button onclick="_htMMDeleteReading(\'' + comp + '\',' + i + ')" style="background:none;border:none;color:#4b5563;cursor:pointer;font-size:12px;padding:2px 4px;" title="Eliminar">\u00D7</button>';
      h += '</div></div>';
    }
    h += '</div>';
    el.innerHTML = h;
  };

  window._htMMDeleteReading = function(comp, idx) {
    if (window._htMMReadings && window._htMMReadings[comp]) {
      window._htMMReadings[comp].splice(idx, 1);
    }
    window._htMMRenderReadingsLog();
    // Update component tab color if no more readings
    var readings = (window._htMMReadings[comp] || []);
    if (readings.length === 0) {
      var cBtn = document.getElementById('htMMC_' + comp);
      if (cBtn && window._htMMComponent !== comp) {
        cBtn.style.background = 'rgba(0,0,0,0.02)';
        cBtn.style.borderColor = 'rgba(0,0,0,0.06)';
        cBtn.style.color = '#57574F';
      }
    }
  };

  window._htMMGenReport = function() {
    var eq = window._htMMEquip || {};
    var readings = window._htMMReadings || {};
    var compLabels = {comp:'Compresor',condFan:'Condenser Fan',blower:'Blower Motor',contactor:'Contactor',transformer:'Transformador',capacitor:'Capacitor',flame:'Flame Sensor',temps:'Temperaturas'};
    var now = new Date();
    var dateStr = now.toLocaleDateString('es-MX', {year:'numeric',month:'long',day:'numeric'});
    var timeStr = now.toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit',hour12:true});

    var css = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:20px;background:#fff;color:#1a1a2e;font-size:12px;}'
      + '.header{text-align:center;border-bottom:3px solid #FF6B35;padding-bottom:16px;margin-bottom:20px;}'
      + '.logo{font-size:22px;font-weight:900;color:#FF6B35;letter-spacing:1px;}'
      + '.sub{font-size:10px;color:#666;margin-top:4px;}'
      + '.section{margin-bottom:16px;}'
      + '.section-title{font-size:13px;font-weight:800;color:#FF6B35;border-bottom:1.5px solid #eee;padding-bottom:4px;margin-bottom:8px;}'
      + '.eq-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;}'
      + '.eq-item{display:flex;gap:4px;}'
      + '.eq-label{font-weight:700;color:#555;min-width:80px;}'
      + '.eq-val{color:#1a1a2e;}'
      + '.comp-block{margin-bottom:12px;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:10px;}'
      + '.comp-name{font-size:12px;font-weight:800;color:#333;margin-bottom:6px;}'
      + '.reading-row{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dotted #e5e5e5;}'
      + '.reading-val{font-family:monospace;font-weight:700;font-size:12px;}'
      + '.reading-meta{font-size:9px;color:#888;}'
      + '.footer{text-align:center;margin-top:24px;padding-top:12px;border-top:2px solid #eee;font-size:9px;color:#999;}'
      + '.no-readings{color:#aaa;font-style:italic;font-size:11px;}'
      + '@media print{body{padding:12px;}.comp-block{break-inside:avoid;}}';

    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte HVAC - Maestro</title>';
    html += '<style>' + css + '</style></head><body>';

    // Header
    html += '<div class="header">';
    html += '<div class="logo">MAESTRO HVACR</div>';
    html += '<div class="sub">Reporte de Diagn\u00F3stico \u2022 Fieldpiece SC680</div>';
    html += '<div class="sub">' + dateStr + ' \u2022 ' + timeStr + '</div>';
    html += '</div>';

    // Equipment & service info
    html += '<div class="section">';
    html += '<div class="section-title">Informaci\u00F3n del Equipo y Servicio</div>';
    html += '<div class="eq-grid">';
    html += '<div class="eq-item"><span class="eq-label">Modelo:</span><span class="eq-val">' + (eq.model || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label">Serie:</span><span class="eq-val">' + (eq.serial || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label">Cliente:</span><span class="eq-val">' + (eq.clientName || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label">Direcci\u00F3n:</span><span class="eq-val">' + (eq.clientAddr || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label">T\u00E9cnico:</span><span class="eq-val">' + (eq.techName || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label"># T\u00E9cnico:</span><span class="eq-val">' + (eq.techNum || 'N/A') + '</span></div>';
    html += '<div class="eq-item"><span class="eq-label">Email:</span><span class="eq-val">' + (eq.techEmail || 'N/A') + '</span></div>';
    html += '</div></div>';

    // Readings by component
    html += '<div class="section">';
    html += '<div class="section-title">Mediciones por Componente</div>';
    var hasAny = false;
    var compOrder = ['comp','condFan','blower','contactor','transformer','capacitor','flame','temps'];
    for (var ci = 0; ci < compOrder.length; ci++) {
      var ck = compOrder[ci];
      var rds = readings[ck];
      if (!rds || rds.length === 0) continue;
      hasAny = true;
      html += '<div class="comp-block">';
      html += '<div class="comp-name">' + (compLabels[ck] || ck) + ' (' + rds.length + ' lecturas)</div>';
      for (var ri = 0; ri < rds.length; ri++) {
        var rd = rds[ri];
        html += '<div class="reading-row">';
        html += '<span class="reading-val">' + rd.value + ' ' + rd.unit + '</span>';
        html += '<span class="reading-meta">' + rd.modeLabel + ' \u2022 ' + rd.timestamp + '</span>';
        html += '</div>';
        // Show detail values if available
        if (rd.details && Object.keys(rd.details).length > 1) {
          html += '<div style="padding-left:12px;margin-bottom:4px;">';
          var dkeys = Object.keys(rd.details);
          var detailParts = [];
          for (var di = 0; di < dkeys.length; di++) {
            var dk = dkeys[di];
            var shortLabel = dk.replace(/^mm/,'');
            detailParts.push(shortLabel + ': ' + rd.details[dk]);
          }
          html += '<span style="font-size:9px;color:#888;">' + detailParts.join(' | ') + '</span>';
          html += '</div>';
        }
      }
      html += '</div>';
    }
    if (!hasAny) {
      html += '<div class="no-readings">No hay lecturas guardadas. Use "Guardar Lectura" en cada componente.</div>';
    }
    html += '</div>';

    // Summary
    var totalReadings = 0;
    var compCount = 0;
    for (var sk in readings) {
      if (readings[sk] && readings[sk].length > 0) { totalReadings += readings[sk].length; compCount++; }
    }
    html += '<div class="section">';
    html += '<div class="section-title">Resumen</div>';
    html += '<div class="eq-grid">';
    html += '<div class="eq-item"><span class="eq-label">Componentes:</span><span class="eq-val">' + compCount + ' diagnosticados</span></div>';
    html += '<div class="eq-item"><span class="eq-label">Lecturas:</span><span class="eq-val">' + totalReadings + ' total</span></div>';
    html += '</div></div>';

    // Footer
    html += '<div class="footer">';
    html += 'Generado por Maestro HVACR \u2022 maestrohvacr.com \u2022 Fieldpiece SC680 BLE';
    html += '</div>';

    html += '<script>window.onload=function(){window.print();}<\/script>';
    html += '</body></html>';

    // Open in new tab for printing
    var w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    } else {
      // Fallback: render inline
      var rEl = document.getElementById('htMMReport');
      if (rEl) {
        rEl.innerHTML = '<div style="background:#fff;color:#1a1a2e;border-radius:12px;padding:16px;margin-top:8px;">'
          + '<div style="text-align:center;font-size:10px;color:#666;margin-bottom:8px;">No se pudo abrir nueva ventana. Reporte mostrado abajo:</div>'
          + html.replace(/<script.*?<\/script>/g,'')
          + '</div>';
      }
    }
  };


  // ============================
  // ELECTRICAL LOAD CALCULATION PRO — Data Tables
  // NEC Article 220 · 310 · 250 · 314 · Full Dwelling Calculator
  // ============================

  // NEC 310.16 — Ampacity Table (Copper + Aluminum)
  var _htELAmpacity = {
    cu60: {'14':15,'12':20,'10':30,'8':40,'6':55,'4':70,'3':85,'2':95,'1':110,'1/0':125,'2/0':145,'3/0':165,'4/0':195,'250':215,'300':240,'350':260,'400':280,'500':320},
    cu75: {'14':15,'12':20,'10':30,'8':50,'6':65,'4':85,'3':100,'2':115,'1':130,'1/0':150,'2/0':175,'3/0':200,'4/0':230,'250':255,'300':285,'350':310,'400':335,'500':380},
    cu90: {'14':15,'12':20,'10':30,'8':55,'6':75,'4':95,'3':115,'2':130,'1':150,'1/0':170,'2/0':195,'3/0':225,'4/0':260,'250':290,'300':320,'350':350,'400':380,'500':430},
    al75: {'12':20,'10':25,'8':30,'6':40,'4':55,'3':65,'2':75,'1':85,'1/0':100,'2/0':115,'3/0':130,'4/0':150,'250':170,'300':190,'350':210,'400':225,'500':260}
  };

  // NEC 314.16(B) — Box Fill Volume per Conductor (cu.in)
  var _htELBoxFill = {'14':2.00,'12':2.25,'10':2.50,'8':3.00,'6':5.00};

  // NEC 250.66 — Grounding Electrode Conductor sizing
  // Key = max service conductor AWG index, value = {cu, al}
  var _htELGEC = [
    {maxSvc:'2',   cu:'8',   al:'6'},
    {maxSvc:'1',   cu:'6',   al:'4'},
    {maxSvc:'2/0', cu:'4',   al:'2'},
    {maxSvc:'3/0', cu:'4',   al:'2'},
    {maxSvc:'350', cu:'2',   al:'1/0'},
    {maxSvc:'600', cu:'1/0', al:'3/0'},
    {maxSvc:'1100',cu:'2/0', al:'4/0'},
    {maxSvc:'over',cu:'3/0', al:'250'}
  ];

  // NEC 250.122 — Equipment Grounding Conductor
  var _htELEGC = [
    {ocpd:15,  cu:'14', al:'12'},
    {ocpd:20,  cu:'12', al:'10'},
    {ocpd:30,  cu:'10', al:'8'},
    {ocpd:40,  cu:'10', al:'8'},
    {ocpd:60,  cu:'10', al:'8'},
    {ocpd:100, cu:'8',  al:'6'},
    {ocpd:200, cu:'6',  al:'4'},
    {ocpd:300, cu:'4',  al:'2'},
    {ocpd:400, cu:'3',  al:'1'}
  ];

  // NEC 310.12 — Residential Service Entrance Conductors (83% rule)
  var _htELServiceCond = [
    {amps:100, cu:'4',   al:'2'},
    {amps:125, cu:'2',   al:'1/0'},
    {amps:150, cu:'1',   al:'2/0'},
    {amps:200, cu:'2/0', al:'4/0'},
    {amps:320, cu:'250', al:'350'},
    {amps:400, cu:'350', al:'500'}
  ];

  // NEC 220.55 Column C — Range Demand Factors
  var _htELRangeDemand = [0, 8, 11, 14, 17, 20]; // index = # ranges, value = kW demand

  // Dwelling Type Presets (expanded with garage sizes + luxury)
  var _htELDwellings = [
    {id:'studio',   label:'Studio',         sqft:500,  bed:0, bath:1, kitchen:1, laundry:0, garage:0, outdoor:0, office:0, closet:0, walkin:0, gameroom:0, gym:0, island:0},
    {id:'1br',      label:'1BR Apt',        sqft:750,  bed:1, bath:1, kitchen:1, laundry:0, garage:0, outdoor:0, office:0, closet:1, walkin:0, gameroom:0, gym:0, island:0},
    {id:'2br',      label:'2BR Apt',        sqft:1000, bed:2, bath:1, kitchen:1, laundry:1, garage:0, outdoor:0, office:0, closet:2, walkin:0, gameroom:0, gym:0, island:0},
    {id:'3br',      label:'3BR Apt',        sqft:1300, bed:3, bath:2, kitchen:1, laundry:1, garage:0, outdoor:0, office:0, closet:3, walkin:1, gameroom:0, gym:0, island:0},
    {id:'house1',   label:'1-Story House',  sqft:1800, bed:3, bath:2, kitchen:1, laundry:1, garage:1, outdoor:1, office:1, closet:3, walkin:1, gameroom:0, gym:0, island:0},
    {id:'house2',   label:'2-Story House',  sqft:2800, bed:4, bath:3, kitchen:1, laundry:1, garage:2, outdoor:1, office:1, closet:4, walkin:2, gameroom:1, gym:0, island:1},
    {id:'houselg',  label:'Large 2-Story',  sqft:4000, bed:5, bath:4, kitchen:1, laundry:1, garage:3, outdoor:1, office:1, closet:5, walkin:3, gameroom:1, gym:1, island:1},
    {id:'mansion',  label:'Mansion / Estate', sqft:6000, bed:6, bath:5, kitchen:1, laundry:1, garage:4, outdoor:1, office:2, closet:6, walkin:4, gameroom:1, gym:1, island:1}
  ];

  // Branch Circuit Master Database (expanded: 45+ circuit types with full NEC refs)
  var _htELCircuitDB = [
    // ── LIGHTING ──
    {name:'General Lighting',     v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'600sqft'},
    // ── KITCHEN ──
    {name:'Kitchen SABC #1',      v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(B)', w:1500, per:'fixed'},
    {name:'Kitchen SABC #2',      v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(B)', w:1500, per:'fixed'},
    {name:'Kitchen Island',       v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(B)', w:1500, per:'island'},
    {name:'Refrigerator',         v:120, brk:20, wire:'12-2', prot:'\u2014',nec:'210.52(B)', w:600,  per:'fixed'},
    {name:'Dishwasher',           v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'422.5',     w:1800, per:'fixed'},
    {name:'Disposal',             v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'422.31',    w:500,  per:'fixed'},
    {name:'Microwave',            v:120, brk:20, wire:'12-2', prot:'\u2014',nec:'210.52(B)', w:1500, per:'fixed'},
    // ── LIVING SPACES ──
    {name:'Living Room',          v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'fixed'},
    {name:'Dining Room',          v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'fixed'},
    {name:'Family Room',          v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'fixed'},
    {name:'Hallway/Foyer',        v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:600,  per:'fixed'},
    // ── BEDROOMS ──
    {name:'Bedroom',              v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'bed'},
    // ── BATHROOMS ──
    {name:'Bathroom',             v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(D)', w:1500, per:'bath'},
    // ── CLOSETS ──
    {name:'Closet',               v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'410.16',    w:180,  per:'closet'},
    {name:'Walk-in Closet',       v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'410.16',    w:360,  per:'walkin'},
    // ── UTILITY ──
    {name:'Laundry',              v:120, brk:20, wire:'12-2', prot:'\u2014',nec:'210.52(F)', w:1500, per:'fixed'},
    {name:'Attic',                v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'210.70(C)', w:600,  per:'fixed'},
    {name:'Smoke/CO Detectors',   v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'210.12',    w:100,  per:'fixed'},
    {name:'Doorbell/Buzzer',      v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'725.121',   w:50,   per:'fixed'},
    // ── SPECIAL ROOMS ──
    {name:'Home Office',          v:120, brk:20, wire:'12-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'office'},
    {name:'Game Room',            v:120, brk:20, wire:'12-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'gameroom'},
    {name:'Home Gym',             v:120, brk:20, wire:'12-2', prot:'AFCI',  nec:'210.12',    w:1800, per:'gym'},
    // ── GARAGE (per bay) ──
    {name:'Garage',               v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(G)', w:1800, per:'garage'},
    {name:'Garage Door Opener',   v:120, brk:20, wire:'12-2', prot:'\u2014',nec:'210.52(G)', w:600,  per:'garage'},
    // ── OUTDOOR ──
    {name:'Outdoor Receptacles',  v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(E)', w:1800, per:'outdoor'},
    {name:'Outdoor/Porch Lights', v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'210.70(A)', w:600,  per:'outdoor'},
    {name:'Landscape/Low Volt',   v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'411.4',     w:300,  per:'outdoor'},
    {name:'Motion Sensors',       v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'725.121',   w:200,  per:'fixed'},
    {name:'Security/Cameras',     v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'725.121',   w:300,  per:'fixed'},
    // ── MAJOR 240V LOADS ──
    {name:'Range/Oven',           v:240, brk:50, wire:'6-3',  prot:'\u2014',nec:'210.19(A)', w:12000,per:'fixed'},
    {name:'Cooktop (separate)',   v:240, brk:40, wire:'8-3',  prot:'\u2014',nec:'210.19(A)', w:7600, per:'fixed'},
    {name:'Wall Oven (separate)', v:240, brk:30, wire:'10-3', prot:'\u2014',nec:'210.19(A)', w:5000, per:'fixed'},
    {name:'Dryer',                v:240, brk:30, wire:'10-3', prot:'\u2014',nec:'220.54',    w:5500, per:'fixed'},
    {name:'Water Heater',         v:240, brk:30, wire:'10-2', prot:'\u2014',nec:'422.13',    w:4500, per:'fixed'},
    {name:'Tankless Water Heater',v:240, brk:40, wire:'8-2',  prot:'\u2014',nec:'422.13',    w:9000, per:'fixed'},
    {name:'A/C Condenser',        v:240, brk:30, wire:'10-2', prot:'\u2014',nec:'440.35',    w:5000, per:'fixed'},
    {name:'Heat Pump',            v:240, brk:30, wire:'10-2', prot:'\u2014',nec:'440.35',    w:5000, per:'fixed'},
    {name:'Electric Heat',        v:240, brk:20, wire:'12-2', prot:'\u2014',nec:'424.3',     w:3000, per:'fixed'},
    {name:'EV Charger (Level 2)', v:240, brk:50, wire:'6-3',  prot:'\u2014',nec:'625.40',    w:9600, per:'fixed'},
    {name:'Hot Tub/Spa',          v:240, brk:50, wire:'6-3',  prot:'GFCI',  nec:'680.44',    w:6000, per:'fixed'},
    {name:'Pool Pump',            v:240, brk:20, wire:'12-2', prot:'GFCI',  nec:'680.21',    w:2400, per:'fixed'},
    {name:'Sauna',                v:240, brk:40, wire:'8-2',  prot:'\u2014',nec:'680.12',    w:6000, per:'fixed'},
    // ── SEASONAL / SPECIALTY ──
    {name:'Holiday/Christmas Lights', v:120, brk:20, wire:'12-2', prot:'GFCI',  nec:'210.52(E)', w:1200, per:'outdoor'},
    {name:'Snow/Ice Melt Defrost',    v:240, brk:20, wire:'12-2', prot:'GFCI',  nec:'426.28',    w:3000, per:'fixed'},
    {name:'Dimmers/Smart Switches',   v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'404.22',    w:600,  per:'fixed'},
    {name:'Ceiling Fan',              v:120, brk:15, wire:'14-2', prot:'AFCI',  nec:'422.18',    w:180,  per:'bed'},
    {name:'Exhaust Fan (Bath)',       v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'210.11',    w:120,  per:'bath'},
    {name:'Range Hood/Vent',          v:120, brk:15, wire:'14-2', prot:'\u2014',nec:'210.11',    w:300,  per:'fixed'}
  ];

  // AWG sort order for lookups
  var _htELAwgOrder = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500','600','750','1000','1100'];

  // Expose data tables on window for cross-function access
  window._htELAmpacity = _htELAmpacity;
  window._htELBoxFill = _htELBoxFill;
  window._htELGEC = _htELGEC;
  window._htELEGC = _htELEGC;
  window._htELServiceCond = _htELServiceCond;
  window._htELRangeDemand = _htELRangeDemand;
  window._htELDwellings = _htELDwellings;
  window._htELCircuitDB = _htELCircuitDB;
  window._htELAwgOrder = _htELAwgOrder;

  // State object
  window._htELState = {
    dwelling: null,
    sqft: 0,
    voltage: 240,
    bedrooms: 3,
    bathrooms: 2,
    // General loads
    smallAppCircuits: 2,
    laundryCircuits: 1,
    // Kitchen
    rangeKW: 12, numRanges: 1, dryerKW: 5.5, dwKW: 1.8, dispKW: 0.5, microKW: 1.5, washerKW: 1.2,
    gasRange: false, gasDryer: false,
    // HVAC
    acKW: 5, heatPumpKW: 0, heatKW: 0,
    // Special
    whKW: 4.5, evKW: 0, hotTubKW: 0, christmasW: 0, snowW: 0, otherKW: 0,
    // Solar/Battery/Generator
    solarOn: false, solarKW: 0,
    batteryOn: false, batteryKWH: 0,
    generatorOn: false, generatorKW: 0,
    transferOn: false, transferType: 'auto', transferAmps: 200,
    // Grounding electrodes
    gndRod: false, gndPlate: false, gndUfer: false, gndWater: false,
    // Box fill
    boxConductors: [{awg:'14',qty:4}],
    boxClamps: false,
    boxDevices: 1,
    boxGrounds: true,
    // Branch circuits
    circuits: []
  };

  // Last calculation result (for PDF)
  window._htELLastResult = null;
  // ============================
  // ELECTRICAL LOAD PRO — UI Renderer (Visual PRO)
  // ============================
  function _htShowElecLoad(s) {
    _htView = 'elecload';
    var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var S = window._htELState;
    if (!S.circuits || S.circuits.length === 0) _htELBuildCircuits();
    var h = '<div style="background:#FFFFFF;min-height:100vh;color:#0F0F0F;padding-bottom:80px;">';
    // ── Gradient header banner ──
    h += '<div style="position:sticky;top:0;z-index:10;background:linear-gradient(135deg,#0c1829 0%,#162033 50%,#1a1a3e 100%);padding:14px 16px;border-bottom:1px solid rgba(251,191,36,0.15);box-shadow:0 4px 30px rgba(0,0,0,0.5);">';
    h += '<div style="display:flex;align-items:center;gap:12px;">';
    h += '<button onclick="_htBackToMenu()" style="background:rgba(0,0,0,0.06);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(0,0,0,0.1);color:#4b5563;width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">&#8249;</button>';
    h += '<div style="flex:1;"><div style="font-size:17px;font-weight:900;background:linear-gradient(135deg,#fbbf24,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.3px;">&#9889; ' + _th('ht_el_title', 'C\u00e1lculo El\u00e9ctrico PRO') + '</div>';
    h += '<div style="font-size:9px;color:#4b5563;margin-top:2px;letter-spacing:0.5px;">' + _th('ht_el_subtitle', 'NEC 220 &middot; 250 &middot; 310 &middot; 314 &middot; Title 24 &middot; Calculadora Completa de Vivienda') + '</div></div>';
    h += '<div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,rgba(251,191,36,0.2),rgba(239,68,68,0.15));border:1px solid rgba(251,191,36,0.25);display:flex;align-items:center;justify-content:center;font-size:20px;">&#9889;</div>';
    h += '</div></div>';
    h += '<div style="padding:14px;max-width:620px;margin:0 auto;">';

    // Dwelling type icons
    var dwIcons = {studio:'\uD83C\uDFE2',  '1br':'\uD83D\uDECF',  '2br':'\uD83C\uDFE0',  '3br':'\uD83C\uDFE1',  house1:'\uD83C\uDFE0',  house2:'\uD83C\uDFDA',  houselg:'\uD83C\uDFF0',  mansion:'\uD83C\uDFDB'};

    // ── Accordion helper (glass morphism) ──
    var accHead = function(num, title, color, icon, open) {
      var rgb = color;
      return '<div style="background:rgba(0,0,0,0.02);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(' + rgb + ',0.15);border-left:3px solid rgba(' + rgb + ',0.5);border-radius:14px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 15px rgba(0,0,0,0.2);">' +
        '<div onclick="_htELToggleAcc(\'elAcc' + num + '\')" style="display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:pointer;user-select:none;background:linear-gradient(90deg,rgba(' + rgb + ',0.04),transparent);">' +
        '<div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,rgba(' + rgb + ',0.2),rgba(' + rgb + ',0.08));border:1px solid rgba(' + rgb + ',0.2);display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(' + rgb + ',0.15);">' + icon + '</div>' +
        '<div style="flex:1;"><div style="font-size:12px;font-weight:800;color:#111827;letter-spacing:0.3px;">' + title + '</div></div>' +
        '<div id="elAccArr' + num + '" style="color:rgba(' + rgb + ',0.6);font-size:10px;font-weight:700;width:24px;height:24px;border-radius:6px;background:rgba(' + rgb + ',0.08);display:flex;align-items:center;justify-content:center;">' + (open ? '&#9660;' : '&#9654;') + '</div>' +
        '</div><div id="elAcc' + num + '" style="padding:0 16px ' + (open ? '16' : '0') + 'px;' + (open ? '' : 'display:none;') + '">';
    };
    var accEnd = '</div></div>';

    // ══════════════ Section 1: Dwelling Type ══════════════
    h += accHead(1, _th('ht_el_dwelling_type', 'TIPO DE VIVIENDA'), '251,191,36', '&#127968;', true);
    h += '<div style="font-size:9px;color:#4b5563;margin-bottom:10px;">' + _th('ht_el_dwelling_hint', 'Selecciona un tipo de vivienda para auto-llenar, o personaliza abajo.') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-bottom:14px;">';
    var dw = window._htELDwellings || [];
    for (var di = 0; di < dw.length; di++) {
      var sel = S.dwelling === dw[di].id;
      var dwIcon = dwIcons[dw[di].id] || '\uD83C\uDFE0';
      h += '<button onclick="_htELSetDwelling(\'' + dw[di].id + '\')" style="padding:12px 6px;border-radius:12px;border:1.5px solid ' + (sel ? 'rgba(251,191,36,0.6)' : 'rgba(0,0,0,0.05)') + ';background:' + (sel ? 'linear-gradient(135deg,rgba(251,191,36,0.12),rgba(245,158,11,0.06))' : 'rgba(0,0,0,0.02)') + ';color:' + (sel ? '#fbbf24' : '#3D3D3A') + ';cursor:pointer;text-align:center;transition:all 0.2s;' + (sel ? 'box-shadow:0 0 20px rgba(251,191,36,0.15);' : '') + '">';
      h += '<div style="font-size:22px;margin-bottom:4px;">' + dwIcon + '</div>';
      h += '<div style="font-size:10px;font-weight:800;' + (sel ? 'color:#fbbf24;' : '') + '">' + dw[di].label + '</div>';
      h += '<div style="font-size:8px;color:#4b5563;margin-top:2px;">' + dw[di].sqft.toLocaleString() + ' sqft</div>';
      h += '</button>';
    }
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;">';
    h += _htELInput('htELSqFt', _th('ht_el_sqft','Pies²'), S.sqft || '', 'number');
    h += _htELSelect('htELVoltage', _th('ht_el_voltage','Voltaje'), [['240','240V'],['120','120V']], S.voltage);
    h += _htELInput('htELBed', _th('ht_el_bedrooms','Recámaras'), S.bedrooms, 'number');
    h += _htELInput('htELBath', _th('ht_el_bathrooms','Baños'), S.bathrooms, 'number');
    h += '</div>';
    h += accEnd;

    // ══════════════ Section 2: General Loads ══════════════
    h += accHead(2, _th('ht_el_general_loads', 'CARGAS GENERALES (NEC 220.12, 220.52)'), '96,165,250', '&#9889;', false);
    h += '<div style="padding:10px;background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.12);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="font-size:9px;color:#60a5fa;line-height:1.6;">' + _th('ht_el_general_auto','<b>Auto-calculado:</b> Iluminación = sqft &times; 3 VA/sqft &middot; Electrodomésticos mín. 2 circuitos &times; 1500 VA &middot; Lavandería 1 circuito &times; 1500 VA<br><b>Factor de Demanda (NEC 220.42):</b> First 3,000 VA @ 100% | 3,001&ndash;120,000 VA @ 35% | Over 120,000 VA @ 25%') + '</div></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htELInput('htELSmallApp', _th('ht_el_small_app','Circuitos Electrodomésticos'), S.smallAppCircuits, 'number');
    h += _htELInput('htELLaundry', _th('ht_el_laundry','Circuitos Lavandería'), S.laundryCircuits, 'number');
    h += '</div>';
    h += '<div id="htELGenPreview" style="margin-top:8px;"></div>';
    h += accEnd;

    // ══════════════ Section 3: Kitchen & Laundry ══════════════
    h += accHead(3, _th('ht_el_kitchen_laundry', 'ELECTRODOM\u00c9STICOS COCINA Y LAVANDER\u00cdA'), '251,146,60', '&#127859;', false);
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htELInput('htELRange', _th('ht_el_range','Estufa/Horno (kW)'), S.rangeKW, 'number');
    h += _htELInput('htELNumRanges', _th('ht_el_num_ranges','# Estufas'), S.numRanges, 'number');
    h += _htELInput('htELDryer', _th('ht_el_dryer','Secadora (kW)'), S.dryerKW, 'number');
    h += _htELInput('htELDW', _th('ht_el_dishwasher','Lavavajillas (kW)'), S.dwKW, 'number');
    h += _htELInput('htELDisposal', _th('ht_el_disposal','Triturador (kW)'), S.dispKW, 'number');
    h += _htELInput('htELMicro', _th('ht_el_microwave','Microondas (kW)'), S.microKW, 'number');
    h += _htELInput('htELWasher', _th('ht_el_washer','Lavadora (kW)'), S.washerKW, 'number');
    h += '</div>';
    h += '<div style="display:flex;gap:16px;margin-top:10px;padding:10px;background:rgba(251,146,60,0.05);border-radius:10px;border:1px solid rgba(251,146,60,0.1);">';
    h += _htELToggle('htELGasRange', _th('ht_el_gas_range','Estufa de Gas (elimina eléctrica)'), S.gasRange);
    h += _htELToggle('htELGasDryer', _th('ht_el_gas_dryer','Secadora de Gas (elimina eléctrica)'), S.gasDryer);
    h += '</div>';
    h += accEnd;

    // ══════════════ Section 4: HVAC ══════════════
    h += accHead(4, _th('ht_el_hvac', 'CARGAS HVAC (NEC 220.60)'), '56,189,248', '&#10052;', false);
    h += '<div style="padding:10px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.12);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="font-size:9px;color:#38bdf8;">' + _th('ht_el_hvac_rule','<b>Regla de no-coincidencia (220.60):</b> Se usa el MAYOR entre enfriamiento y calefacción &mdash; nunca ambos a la vez.') + '</div></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">';
    h += _htELInput('htELAC', 'A/C (kW)', S.acKW, 'number');
    h += _htELInput('htELHP', _th('ht_el_heat_pump','Bomba de Calor (kW)'), S.heatPumpKW, 'number');
    h += _htELInput('htELHeat', _th('ht_el_elec_heat','Calefacción Eléctrica (kW)'), S.heatKW, 'number');
    h += '</div>';
    h += '<div id="htELHvacNote" style="margin-top:8px;"></div>';
    h += accEnd;

    // ══════════════ Section 5: Special Loads ══════════════
    h += accHead(5, _th('ht_el_special', 'CARGAS GRANDES Y ESPECIALES'), '168,85,247', '&#128268;', false);
    h += '<div style="padding:10px;background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.12);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="font-size:9px;color:#a855f7;">' + _th('ht_el_nec_220_53','<b>NEC 220.53:</b> Si &ge;4 electrodomésticos fijos (excluyendo estufa, secadora, A/C, calefacción) &rarr; se aplica 75% automáticamente.') + '</div></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htELInput('htELWH', _th('ht_el_water_heater','Calentador de Agua (kW)'), S.whKW, 'number');
    h += _htELInput('htELEV', _th('ht_el_ev_charger','Cargador EV (kW)'), S.evKW, 'number');
    h += _htELInput('htELHotTub', _th('ht_el_hot_tub','Jacuzzi / Bomba de Alberca (kW)'), S.hotTubKW, 'number');
    h += _htELInput('htELXmas', _th('ht_el_xmas_lights','Luces Navideñas (W)'), S.christmasW, 'number');
    h += _htELInput('htELSnow', _th('ht_el_snow_melt','Deshielo de Nieve (W)'), S.snowW, 'number');
    h += _htELInput('htELOther', _th('ht_el_other_loads','Otras Cargas (kW)'), S.otherKW, 'number');
    h += '</div>';
    h += accEnd;

    // ══════════════ Section 6: Solar / Battery / Generator ══════════════
    h += accHead(6, _th('ht_el_solar_battery', 'SOLAR / BATER\u00cdA / GENERADOR'), '34,197,94', '&#9728;', false);
    h += '<div style="padding:10px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.12);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="font-size:9px;color:#22c55e;"><b>NEC 690, 705, 706, 702</b> &middot; California Title 24 solar compliance &middot; 120% bus bar rule &middot; Battery storage credit</div></div>';
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border-radius:10px;margin-bottom:6px;">';
    h += _htELToggle('htELSolar', _th('ht_el_solar_pv','Sistema Solar PV'), S.solarOn);
    h += '<div id="htELSolarFields" style="' + (S.solarOn ? '' : 'display:none;') + 'margin-top:8px;">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htELInput('htELSolarKW', _th('ht_el_solar_kw','Tamaño del Sistema Solar (kW)'), S.solarKW, 'number');
    h += '<div style="font-size:8px;color:#34d399;padding:8px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.15);border-radius:8px;display:flex;align-items:center;line-height:1.4;"><b>Title 24:</b>&nbsp;kWpv = (CFA&times;0.554/1000) + (Ndu&times;1.784)</div>';
    h += '</div></div></div>';
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border-radius:10px;margin-bottom:6px;">';
    h += _htELToggle('htELBattery', _th('ht_el_battery','Almacenamiento de Batería (NEC 706)'), S.batteryOn);
    h += '<div id="htELBatteryFields" style="' + (S.batteryOn ? '' : 'display:none;') + 'margin-top:8px;">';
    h += _htELInput('htELBattKWH', _th('ht_el_battery_kwh','Capacidad de Batería (kWh)'), S.batteryKWH, 'number');
    h += '<div style="font-size:8px;color:#60a5fa;margin-top:4px;">&ge;7.5 kWh = 25% PV reduction credit</div>';
    h += '</div></div>';
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border-radius:10px;margin-bottom:6px;">';
    h += _htELToggle('htELGen', _th('ht_el_generator','Generador de Respaldo (NEC 702)'), S.generatorOn);
    h += '<div id="htELGenFields" style="' + (S.generatorOn ? '' : 'display:none;') + 'margin-top:8px;">';
    h += _htELInput('htELGenKW', _th('ht_el_gen_kw','Capacidad del Generador (kW)'), S.generatorKW, 'number');
    h += '</div></div>';
    h += '<div style="padding:10px;background:rgba(0,0,0,0.02);border-radius:10px;">';
    h += _htELToggle('htELTransfer', 'Transfer Switch', S.transferOn);
    h += '<div id="htELTransferFields" style="' + (S.transferOn ? '' : 'display:none;') + 'margin-top:8px;">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    h += _htELSelect('htELTransType', _th('ht_el_type','Tipo'), [['auto',_th('ht_el_auto_ats','Automático ATS')],['manual',_th('ht_el_manual_mts','Manual MTS')]], S.transferType);
    h += _htELInput('htELTransAmps', _th('ht_el_amperage','Amperaje'), S.transferAmps, 'number');
    h += '</div></div></div>';
    h += accEnd;

    // ══════════════ Section 7: Branch Circuit Schedule ══════════════
    h += accHead(7, _th('ht_el_circuits', 'CIRCUITOS DERIVADOS'), '59,130,246', '&#128203;', false);
    h += '<div style="font-size:9px;color:#4b5563;margin-bottom:10px;">' + _th('ht_el_circuits_desc','Auto-generado por tipo de vivienda. Cada fila muestra voltaje, breaker, calibre, protección AFCI/GFCI y referencia NEC.') + '</div>';
    h += '<div id="htELCircuitList"></div>';
    h += '<div style="display:flex;gap:8px;margin-top:10px;">';
    h += '<button onclick="_htELAddCircuit()" style="flex:1;padding:10px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.08));border:1px solid rgba(59,130,246,0.3);color:#60a5fa;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;">' + _th('ht_el_add_circuit','+ Agregar Circuito') + '</button>';
    h += '<button onclick="_htELResetCircuits()" style="padding:10px 16px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;">' + _th('ht_el_reset','Reiniciar') + '</button>';
    h += '</div>';
    h += '<div id="htELCircuitSummary" style="margin-top:10px;"></div>';
    h += accEnd;

    // ══════════════ Section 8: Grounding System ══════════════
    h += accHead(8, _th('ht_el_grounding', 'SISTEMA DE TIERRA (NEC 250)'), '245,158,11', '&#9879;', false);
    h += '<div style="padding:10px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="font-size:9px;color:#f59e0b;">' + _th('ht_el_grounding_auto','<b>Auto-calculado</b> del tamaño de servicio: Conductor de Servicio (310.12) &middot; GEC (250.66) &middot; EGC (250.122) &middot; Puente de Unión') + '</div></div>';
    h += '<div id="htELGroundingInfo" style="font-size:10px;color:#4b5563;padding:10px;background:rgba(0,0,0,0.02);border-radius:10px;">' + _th('ht_el_press_calc', 'Presiona "Calcular" abajo para ver requisitos de tierra.') + '</div>';
    h += '<div style="margin-top:12px;font-size:11px;font-weight:800;color:#fbbf24;">' + _th('ht_el_electrode_types', 'Tipos de Electrodo de Tierra') + ' <span style="font-size:8px;color:#4b5563;font-weight:600;">' + _th('ht_el_select_applicable', '(selecciona los que aplican)') + '</span></div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">';
    var gTypes = [['htELGndRod',_th('ht_el_gnd_rod','&#9954; Varilla de Tierra (Ground Rod)'),'NEC 250.52(A)(5)',_th('ht_el_gnd_rod_desc','8 pies mín, 5/8&quot; revestida de cobre')],['htELGndPlate',_th('ht_el_gnd_plate','&#9635; Placa de Tierra (Ground Plate)'),'NEC 250.52(A)(7)',_th('ht_el_gnd_plate_desc','Mín 2 pies² de área expuesta')],['htELGndUfer','&#9881; Ufer / CEE','NEC 250.52(A)(3)',_th('ht_el_gnd_ufer_desc','Electrodo encapsulado en concreto')],['htELGndWater',_th('ht_el_gnd_water','&#128167; Tubería de Agua (Water Pipe)'),'NEC 250.52(A)(1)',_th('ht_el_gnd_water_desc','Primeros 10 pies de tubería metálica')]];
    for (var gi = 0; gi < gTypes.length; gi++) {
      h += '<label for="' + gTypes[gi][0] + '" style="display:block;padding:10px;background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.1);border-radius:10px;cursor:pointer;transition:all .15s;" onclick="setTimeout(function(){window._htELUpdateGndStyle()},10)">';
      h += '<div style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="' + gTypes[gi][0] + '" style="accent-color:#fbbf24;width:16px;height:16px;cursor:pointer;">';
      h += '<div style="font-size:10px;font-weight:800;color:#fbbf24;">' + gTypes[gi][1] + '</div></div>';
      h += '<div style="font-size:8px;color:#f59e0b;margin-top:2px;margin-left:22px;">' + gTypes[gi][2] + '</div>';
      h += '<div style="font-size:7px;color:#4b5563;margin-top:2px;margin-left:22px;">' + gTypes[gi][3] + '</div></label>';
    }
    h += '</div>';
    h += accEnd;

    // ══════════════ Section 9: Box Fill & Conduit Fill ══════════════
    h += accHead(9, _th('ht_el_box_conduit', 'LLENADO DE CAJA Y CONDUIT'), '192,132,252', '&#128230;', false);
    h += '<div style="font-size:11px;font-weight:800;color:#c084fc;margin-bottom:8px;">' + _th('ht_el_box_fill_calc','Calculadora de Llenado de Caja (NEC 314.16)') + '</div>';
    h += '<div style="padding:12px;background:rgba(192,132,252,0.04);border:1px solid rgba(192,132,252,0.1);border-radius:10px;margin-bottom:10px;">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
    h += _htELSelect('htELBoxAWG', _th('ht_el_wire_gauge', 'Calibre de Cable'), [['14','14 AWG'],['12','12 AWG'],['10','10 AWG'],['8','8 AWG'],['6','6 AWG']], '14');
    h += _htELInput('htELBoxQty', '# Conductores', 4, 'number');
    h += _htELInput('htELBoxDevices', '# Dispositivos', 1, 'number');
    h += _htELInput('htELBoxVol', 'Volumen de Caja (pulg³)', 18, 'number');
    h += '</div>';
    h += '<div style="display:flex;gap:12px;margin-bottom:10px;">';
    h += '<label style="font-size:10px;color:#4b5563;display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="htELBoxClamps" style="accent-color:#c084fc;width:16px;height:16px;"> Abrazaderas Internas</label>';
    h += '<label style="font-size:10px;color:#4b5563;display:flex;align-items:center;gap:5px;cursor:pointer;"><input type="checkbox" id="htELBoxGnd" checked style="accent-color:#c084fc;width:16px;height:16px;"> Tierras de Equipo</label>';
    h += '</div>';
    h += '<button onclick="_htELCalcBoxFill()" style="width:100%;padding:10px;background:linear-gradient(135deg,rgba(192,132,252,0.2),rgba(168,85,247,0.15));border:1px solid rgba(192,132,252,0.3);color:#c084fc;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;">Calcular Llenado de Caja</button>';
    h += '</div>';
    h += '<div id="htELBoxResult"></div>';
    h += '<div style="margin-top:14px;font-size:11px;font-weight:800;color:#c084fc;margin-bottom:8px;">' + _th('ht_el_amp_ref','Referencia Rápida de Amperaje (NEC 310.16)') + '</div>';
    h += '<div style="font-size:8px;color:#4b5563;margin-bottom:6px;">' + _t('ht_wire_copper_common','Cobre, 75°C (THWN-2) — Más común en residencial') + '</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">';
    var ampRef = window._htELAmpacity ? window._htELAmpacity.cu75 : {};
    var ampKeys = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0'];
    for (var ai = 0; ai < ampKeys.length; ai++) {
      h += '<div style="padding:6px 4px;background:rgba(192,132,252,0.05);border:1px solid rgba(192,132,252,0.1);border-radius:8px;text-align:center;">';
      h += '<div style="font-size:8px;color:#4b5563;font-weight:600;">' + ampKeys[ai] + ' AWG</div>';
      h += '<div style="font-size:12px;font-weight:900;color:#c084fc;">' + (ampRef[ampKeys[ai]] || '—') + 'A</div></div>';
    }
    h += '</div>';
    h += accEnd;

    // ══════════════ Section 10: Results & Summary ══════════════
    h += accHead(10, _th('ht_el_results', 'RESULTADOS'), '34,197,94', '&#9889;', true);
    h += '<button onclick="_htELCalc()" style="width:100%;padding:16px;background:linear-gradient(135deg,#f59e0b,#d97706,#ea580c);border:none;color:#fff;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;margin-bottom:12px;letter-spacing:0.5px;box-shadow:0 4px 25px rgba(245,158,11,0.3);text-transform:uppercase;">&#9889; ' + _th('ht_el_calculate', 'CALCULAR CARGA EL\u00c9CTRICA') + '</button>';
    h += '<div id="htELResults"></div>';
    h += accEnd;

    h += '</div></div>';
    s.innerHTML = h;
    _htELRenderCircuits();
  }

  // ── UI Helper: Input Field (Enhanced) ──
  function _htELInput(id, label, val, type) {
    return '<div><label style="font-size:9px;color:#4b5563;font-weight:700;display:block;margin-bottom:3px;letter-spacing:0.3px;">' + label + '</label>' +
      '<input id="' + id + '" type="' + (type||'text') + '" value="' + (val===undefined||val===null?'':val) + '" style="width:100%;background:rgba(15,23,42,0.8);color:#111827;border:1px solid rgba(0,0,0,0.06);border-radius:10px;padding:10px;font-size:12px;font-weight:600;outline:none;box-sizing:border-box;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'rgba(251,191,36,0.5)\';this.style.boxShadow=\'0 0 12px rgba(251,191,36,0.1)\'" onblur="this.style.borderColor=\'rgba(0,0,0,0.06)\';this.style.boxShadow=\'none\'" /></div>';
  }

  // ── UI Helper: Select Field (Enhanced) ──
  function _htELSelect(id, label, opts, sel) {
    var h = '<div><label style="font-size:9px;color:#4b5563;font-weight:700;display:block;margin-bottom:3px;letter-spacing:0.3px;">' + label + '</label>';
    h += '<select id="' + id + '" style="width:100%;background:rgba(15,23,42,0.8);color:#111827;border:1px solid rgba(0,0,0,0.06);border-radius:10px;padding:10px;font-size:12px;font-weight:600;outline:none;">';
    for (var i = 0; i < opts.length; i++) {
      h += '<option value="' + opts[i][0] + '"' + (String(sel) === String(opts[i][0]) ? ' selected' : '') + '>' + opts[i][1] + '</option>';
    }
    h += '</select></div>';
    return h;
  }

  // ── UI Helper: Toggle Switch (Enhanced) ──
  function _htELToggle(id, label, on) {
    return '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;font-size:11px;color:#374151;font-weight:600;">' +
      '<div onclick="event.preventDefault();_htELToggleSwitch(\'' + id + '\')" style="width:42px;height:22px;border-radius:11px;background:' + (on ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(0,0,0,0.06)') + ';position:relative;cursor:pointer;transition:background 0.3s;border:1px solid ' + (on ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.05)') + ';' + (on ? 'box-shadow:0 0 12px rgba(34,197,94,0.2);' : '') + '" id="' + id + 'Track">' +
      '<div style="width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:1px;' + (on ? 'left:21px' : 'left:1px') + ';transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div></div>' +
      '<span>' + label + '</span><input type="hidden" id="' + id + '" value="' + (on ? '1' : '0') + '"></label>';
  }
  // ============================
  // ELECTRICAL LOAD PRO — Helper Functions
  // ============================

  // Toggle accordion section
  window._htELToggleAcc = function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var arr = document.getElementById(id.replace('elAcc','elAccArr'));
    if (el.style.display === 'none') {
      el.style.display = '';
      el.style.paddingBottom = '12px';
      if (arr) arr.innerHTML = '&#9660;';
    } else {
      el.style.display = 'none';
      el.style.paddingBottom = '0';
      if (arr) arr.innerHTML = '&#9654;';
    }
  };

  // Grounding electrode checkbox style updater
  window._htELUpdateGndStyle = function() {
    var ids = ['htELGndRod','htELGndPlate','htELGndUfer','htELGndWater'];
    for (var i = 0; i < ids.length; i++) {
      var cb = document.getElementById(ids[i]);
      if (!cb) continue;
      var lbl = cb.closest('label');
      if (!lbl) continue;
      if (cb.checked) {
        lbl.style.borderColor = 'rgba(251,191,36,0.5)';
        lbl.style.background = 'rgba(251,191,36,0.12)';
      } else {
        lbl.style.borderColor = 'rgba(245,158,11,0.1)';
        lbl.style.background = 'rgba(245,158,11,0.04)';
      }
    }
  };

  // Toggle switch handler
  window._htELToggleSwitch = function(id) {
    var inp = document.getElementById(id);
    var track = document.getElementById(id + 'Track');
    if (!inp) return;
    var on = inp.value === '1';
    inp.value = on ? '0' : '1';
    if (track) {
      track.style.background = on ? 'rgba(0,0,0,0.12)' : 'rgba(34,197,94,0.6)';
      var knob = track.querySelector('div');
      if (knob) knob.style.left = on ? '2px' : '18px';
    }
    // Show/hide related fields
    var fieldMap = {
      'htELSolar': 'htELSolarFields',
      'htELBattery': 'htELBatteryFields',
      'htELGen': 'htELGenFields',
      'htELTransfer': 'htELTransferFields'
    };
    if (fieldMap[id]) {
      var fields = document.getElementById(fieldMap[id]);
      if (fields) fields.style.display = on ? 'none' : '';
    }
  };

  // Set dwelling type and auto-fill fields
  window._htELSetDwelling = function(type) {
    var S = window._htELState;
    var dw = window._htELDwellings || [];
    var preset = null;
    for (var i = 0; i < dw.length; i++) { if (dw[i].id === type) { preset = dw[i]; break; } }
    if (!preset) return;
    S.dwelling = type;
    S.sqft = preset.sqft;
    S.bedrooms = preset.bed;
    S.bathrooms = preset.bath;
    // Update inputs
    var map = {htELSqFt: preset.sqft, htELBed: preset.bed, htELBath: preset.bath};
    for (var k in map) {
      var el = document.getElementById(k);
      if (el) el.value = map[k];
    }
    // Set default loads based on dwelling
    if (preset.laundry === 0) {
      S.laundryCircuits = 0;
      var lEl = document.getElementById('htELLaundry');
      if (lEl) lEl.value = 0;
    }
    // Rebuild circuits
    _htELBuildCircuits();
    _htELRenderCircuits();
    // Re-render dwelling buttons
    var screen = document.getElementById('herramientasScreen');
    if (screen) {
      var btns = screen.querySelectorAll('button[onclick^="_htELSetDwelling"]');
      for (var b = 0; b < btns.length; b++) {
        var bType = btns[b].getAttribute('onclick').match(/'([^']+)'/);
        if (bType) {
          var isSel = bType[1] === type;
          btns[b].style.border = '1.5px solid ' + (isSel ? 'rgba(251,191,36,0.6)' : 'rgba(0,0,0,0.1)');
          btns[b].style.background = isSel ? 'rgba(251,191,36,0.15)' : 'rgba(0,0,0,0.03)';
          btns[b].style.color = isSel ? '#fbbf24' : '#3D3D3A';
        }
      }
    }
  };

  // Build branch circuits from dwelling preset
  function _htELBuildCircuits() {
    var S = window._htELState;
    var db = window._htELCircuitDB || [];
    var bed = parseInt(document.getElementById('htELBed') ? document.getElementById('htELBed').value : S.bedrooms) || 3;
    var bath = parseInt(document.getElementById('htELBath') ? document.getElementById('htELBath').value : S.bathrooms) || 2;
    var sqft = parseInt(document.getElementById('htELSqFt') ? document.getElementById('htELSqFt').value : S.sqft) || 2000;
    var garage = 0, outdoor = 0, office = 0, closet = 0, walkin = 0, gameroom = 0, gym = 0, island = 0;
    if (S.dwelling) {
      var dw = window._htELDwellings || [];
      for (var d = 0; d < dw.length; d++) {
        if (dw[d].id === S.dwelling) {
          garage = dw[d].garage; outdoor = dw[d].outdoor;
          office = dw[d].office || 0; closet = dw[d].closet || 0;
          walkin = dw[d].walkin || 0; gameroom = dw[d].gameroom || 0;
          gym = dw[d].gym || 0; island = dw[d].island || 0;
          break;
        }
      }
    } else { garage = 1; outdoor = 1; office = 1; closet = 3; walkin = 1; }
    S.circuits = [];
    for (var i = 0; i < db.length; i++) {
      var c = db[i];
      var qty = 1;
      if (c.per === 'bed') qty = Math.max(1, bed);
      else if (c.per === 'bath') qty = Math.max(1, bath);
      else if (c.per === 'garage') qty = garage;
      else if (c.per === 'outdoor') qty = outdoor;
      else if (c.per === 'office') qty = office;
      else if (c.per === 'closet') qty = closet;
      else if (c.per === 'walkin') qty = walkin;
      else if (c.per === 'gameroom') qty = gameroom;
      else if (c.per === 'gym') qty = gym;
      else if (c.per === 'island') qty = island;
      else if (c.per === '600sqft') qty = Math.max(1, Math.ceil(sqft / 600));
      // Skip if qty = 0
      if (qty <= 0) continue;
      for (var q = 0; q < qty; q++) {
        S.circuits.push({
          name: c.name + (qty > 1 ? ' #' + (q + 1) : ''),
          v: c.v, brk: c.brk, wire: c.wire, prot: c.prot, nec: c.nec, w: c.w
        });
      }
    }
  }
  window._htELBuildCircuits = _htELBuildCircuits;

  // Render circuit schedule table
  function _htELRenderCircuits() {
    var el = document.getElementById('htELCircuitList');
    if (!el) return;
    var S = window._htELState;
    var cs = S.circuits || [];
    if (cs.length === 0) { el.innerHTML = '<div style="font-size:10px;color:#4b5563;padding:8px;">Sin circuitos. Selecciona un tipo de vivienda o agrega manualmente.</div>'; return; }
    var h = '<div style="max-height:300px;overflow-y:auto;border:1px solid rgba(0,0,0,0.06);border-radius:8px;">';
    h += '<table style="width:100%;border-collapse:collapse;font-size:8px;">';
    h += '<thead><tr style="background:rgba(0,0,0,0.06);">';
    h += '<th style="padding:5px;text-align:left;color:#4b5563;font-weight:700;">Circuito</th>';
    h += '<th style="padding:5px;text-align:center;color:#4b5563;font-weight:700;">V</th>';
    h += '<th style="padding:5px;text-align:center;color:#4b5563;font-weight:700;">Brk</th>';
    h += '<th style="padding:5px;text-align:center;color:#4b5563;font-weight:700;">Cable</th>';
    h += '<th style="padding:5px;text-align:center;color:#4b5563;font-weight:700;">Prot</th>';
    h += '<th style="padding:5px;text-align:center;color:#4b5563;font-weight:700;">NEC</th>';
    h += '<th style="padding:5px;width:24px;"></th>';
    h += '</tr></thead><tbody>';
    var totalSpaces = 0;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      totalSpaces += c.v === 240 ? 2 : 1;
      var rowBg = i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent';
      var protColor = c.prot === 'GFCI' ? '#34d399' : c.prot === 'AFCI' ? '#60a5fa' : '#57574F';
      h += '<tr style="background:' + rowBg + ';">';
      h += '<td style="padding:4px 5px;color:#111827;white-space:nowrap;">' + c.name + '</td>';
      h += '<td style="padding:4px;text-align:center;color:#4b5563;">' + c.v + '</td>';
      h += '<td style="padding:4px;text-align:center;color:#fbbf24;font-weight:700;">' + c.brk + 'A</td>';
      h += '<td style="padding:4px;text-align:center;color:#4b5563;">' + c.wire + '</td>';
      h += '<td style="padding:4px;text-align:center;color:' + protColor + ';font-weight:700;">' + c.prot + '</td>';
      h += '<td style="padding:4px;text-align:center;color:#4b5563;">' + c.nec + '</td>';
      h += '<td style="padding:4px;text-align:center;"><button onclick="_htELRemoveCircuit(' + i + ')" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px;padding:0;">&times;</button></td>';
      h += '</tr>';
    }
    h += '</tbody></table></div>';
    el.innerHTML = h;
    // Summary
    var sumEl = document.getElementById('htELCircuitSummary');
    if (sumEl) {
      var panelSize = totalSpaces <= 20 ? 20 : totalSpaces <= 30 ? 30 : totalSpaces <= 40 ? 40 : 42;
      sumEl.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<div style="padding:5px 10px;background:rgba(59,130,246,0.1);border-radius:6px;font-size:9px;color:#60a5fa;font-weight:700;">' + cs.length + ' Circuitos</div>' +
        '<div style="padding:5px 10px;background:rgba(251,191,36,0.1);border-radius:6px;font-size:9px;color:#fbbf24;font-weight:700;">' + totalSpaces + ' Espacios</div>' +
        '<div style="padding:5px 10px;background:rgba(34,197,94,0.1);border-radius:6px;font-size:9px;color:#34d399;font-weight:700;">Panel: ' + panelSize + ' Espacios</div>' +
        '</div>';
    }
  }
  window._htELRenderCircuits = _htELRenderCircuits;

  // Add a circuit
  window._htELAddCircuit = function() {
    var S = window._htELState;
    var db = window._htELCircuitDB || [];
    // Show a mini selector
    var el = document.getElementById('htELCircuitList');
    if (!el) return;
    var h = '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:8px;margin-bottom:8px;">';
    h += '<div style="font-size:9px;font-weight:700;color:#60a5fa;margin-bottom:6px;">Seleccionar Circuito:</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;max-height:200px;overflow-y:auto;">';
    for (var i = 0; i < db.length; i++) {
      h += '<button onclick="_htELDoAddCircuit(' + i + ')" style="padding:6px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.1);border-radius:6px;color:#111827;font-size:8px;cursor:pointer;text-align:left;">' + db[i].name + ' <span style="color:#4b5563;">' + db[i].v + 'V/' + db[i].brk + 'A</span></button>';
    }
    h += '</div></div>';
    el.insertAdjacentHTML('beforebegin', h);
  };

  window._htELDoAddCircuit = function(idx) {
    var S = window._htELState;
    var db = window._htELCircuitDB || [];
    if (!db[idx]) return;
    var c = db[idx];
    S.circuits.push({name: c.name, v: c.v, brk: c.brk, wire: c.wire, prot: c.prot, nec: c.nec, w: c.w});
    _htELRenderCircuits();
    // Remove the selector
    var screen = document.getElementById('herramientasScreen');
    if (screen) {
      var selectors = screen.querySelectorAll('div[style*="rgba(59,130,246,0.08)"]');
      for (var s = 0; s < selectors.length; s++) {
        if (selectors[s].textContent.indexOf('Seleccionar Circuito') !== -1) selectors[s].remove();
      }
    }
  };

  // Remove a circuit
  window._htELRemoveCircuit = function(idx) {
    var S = window._htELState;
    if (S.circuits && S.circuits[idx]) {
      S.circuits.splice(idx, 1);
      _htELRenderCircuits();
    }
  };

  // Reset circuits to dwelling defaults
  window._htELResetCircuits = function() {
    _htELBuildCircuits();
    _htELRenderCircuits();
  };

  // Box fill calculator
  window._htELCalcBoxFill = function() {
    var res = document.getElementById('htELBoxResult');
    if (!res) return;
    var bf = window._htELBoxFill || {};
    var awg = (document.getElementById('htELBoxAWG') || {}).value || '14';
    var qty = parseInt((document.getElementById('htELBoxQty') || {}).value) || 4;
    var devices = parseInt((document.getElementById('htELBoxDevices') || {}).value) || 1;
    var boxVol = parseFloat((document.getElementById('htELBoxVol') || {}).value) || 18;
    var hasClamps = document.getElementById('htELBoxClamps') ? document.getElementById('htELBoxClamps').checked : false;
    var hasGrounds = document.getElementById('htELBoxGnd') ? document.getElementById('htELBoxGnd').checked : true;
    var volPerCond = bf[awg] || 2.0;
    // NEC 314.16(B) rules:
    // Each conductor = 1x volume
    // All grounds combined = 1x largest
    // All clamps combined = 1x largest
    // Each device/yoke = 2x largest
    var totalCond = qty; // hot + neutral conductors
    var groundVol = hasGrounds ? volPerCond : 0; // all grounds = 1x
    var clampVol = hasClamps ? volPerCond : 0; // all clamps = 1x
    var deviceVol = devices * 2 * volPerCond; // each device = 2x
    var totalVol = (totalCond * volPerCond) + groundVol + clampVol + deviceVol;
    var pass = totalVol <= boxVol;
    var pct = boxVol > 0 ? (totalVol / boxVol * 100) : 0;
    var col = pass ? '#34d399' : '#ef4444';
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    h += '<span style="font-size:10px;color:#4b5563;">' + awg + ' AWG | ' + qty + ' ' + _t('ht_bf_conductors_lc','conductores') + ' | ' + devices + ' ' + _t('ht_bf_devices_lc','dispositivo(s)') + '</span>';
    h += '<span style="font-size:14px;font-weight:900;color:' + col + ';">' + (pass ? _t('ht_pass','PASA') : _t('ht_fail','FALLA')) + '</span></div>';
    h += '<div style="height:8px;background:rgba(0,0,0,0.06);border-radius:4px;overflow:hidden;margin-bottom:6px;">';
    h += '<div style="height:100%;width:' + Math.min(100, pct) + '%;background:' + col + ';border-radius:4px;"></div></div>';
    h += '<div style="font-size:9px;color:#4b5563;line-height:1.6;">';
    h += _t('ht_bf_conductors','Conductores') + ': ' + qty + ' &times; ' + volPerCond + ' = <b>' + (qty * volPerCond).toFixed(2) + '</b> pulg³<br>';
    if (hasGrounds) h += _t('ht_bf_grounds','Tierras (todas)') + ': 1 &times; ' + volPerCond + ' = <b>' + volPerCond.toFixed(2) + '</b> pulg³<br>';
    if (hasClamps) h += _t('ht_bf_clamps','Abrazaderas (todas)') + ': 1 &times; ' + volPerCond + ' = <b>' + volPerCond.toFixed(2) + '</b> pulg³<br>';
    h += _t('ht_bf_devices','Dispositivos') + ': ' + devices + ' &times; 2 &times; ' + volPerCond + ' = <b>' + deviceVol.toFixed(2) + '</b> pulg³<br>';
    h += '<b style="color:' + col + ';">Total: ' + totalVol.toFixed(2) + ' / ' + boxVol.toFixed(2) + ' pulg³ (' + pct.toFixed(1) + '%)</b>';
    h += '</div>';
    res.innerHTML = h;
  };

  // Sync state from DOM inputs
  function _htELSyncState() {
    var S = window._htELState;
    var getN = function(id, def) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || def || 0) : (def || 0); };
    var getV = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    S.sqft = getN('htELSqFt', 0);
    S.voltage = getN('htELVoltage', 240);
    S.bedrooms = getN('htELBed', 3);
    S.bathrooms = getN('htELBath', 2);
    S.smallAppCircuits = getN('htELSmallApp', 2);
    S.laundryCircuits = getN('htELLaundry', 1);
    S.rangeKW = getN('htELRange', 0);
    S.numRanges = getN('htELNumRanges', 1);
    S.dryerKW = getN('htELDryer', 0);
    S.dwKW = getN('htELDW', 0);
    S.dispKW = getN('htELDisposal', 0);
    S.microKW = getN('htELMicro', 0);
    S.washerKW = getN('htELWasher', 0);
    S.gasRange = getV('htELGasRange') === '1';
    S.gasDryer = getV('htELGasDryer') === '1';
    S.acKW = getN('htELAC', 0);
    S.heatPumpKW = getN('htELHP', 0);
    S.heatKW = getN('htELHeat', 0);
    S.whKW = getN('htELWH', 0);
    S.evKW = getN('htELEV', 0);
    S.hotTubKW = getN('htELHotTub', 0);
    S.christmasW = getN('htELXmas', 0);
    S.snowW = getN('htELSnow', 0);
    S.otherKW = getN('htELOther', 0);
    S.solarOn = getV('htELSolar') === '1';
    S.solarKW = getN('htELSolarKW', 0);
    S.batteryOn = getV('htELBattery') === '1';
    S.batteryKWH = getN('htELBattKWH', 0);
    S.generatorOn = getV('htELGen') === '1';
    S.generatorKW = getN('htELGenKW', 0);
    S.transferOn = getV('htELTransfer') === '1';
    S.transferType = getV('htELTransType') || 'auto';
    S.transferAmps = getN('htELTransAmps', 200);
    // Grounding electrodes
    var getCB = function(id) { var el = document.getElementById(id); return el ? el.checked : false; };
    S.gndRod = getCB('htELGndRod');
    S.gndPlate = getCB('htELGndPlate');
    S.gndUfer = getCB('htELGndUfer');
    S.gndWater = getCB('htELGndWater');
  }
  window._htELSyncState = _htELSyncState;
  // ============================
  // ELECTRICAL LOAD PRO — Calculation Engine
  // ============================

  // Lookup GEC size from service conductor
  function _htELLookupGEC(serviceAmps) {
    var tbl = window._htELGEC || [];
    var awgIdx = window._htELAwgOrder || [];
    // Find service conductor first
    var sc = _htELGetServiceCond(serviceAmps);
    var scIdx = awgIdx.indexOf(sc.cu);
    // Walk GEC table
    for (var i = 0; i < tbl.length; i++) {
      if (tbl[i].maxSvc === 'over') return tbl[i];
      var maxIdx = awgIdx.indexOf(tbl[i].maxSvc);
      if (scIdx <= maxIdx) return tbl[i];
    }
    return tbl[tbl.length - 1];
  }

  // Lookup EGC size from overcurrent device
  function _htELLookupEGC(ocpd) {
    var tbl = window._htELEGC || [];
    for (var i = 0; i < tbl.length; i++) {
      if (ocpd <= tbl[i].ocpd) return tbl[i];
    }
    return tbl[tbl.length - 1];
  }

  // Get service conductor from amps (NEC 310.12)
  function _htELGetServiceCond(amps) {
    var tbl = window._htELServiceCond || [];
    for (var i = 0; i < tbl.length; i++) {
      if (amps <= tbl[i].amps) return tbl[i];
    }
    return tbl[tbl.length - 1];
  }

  // Get service size bucket
  function _htELServiceSize(amps) {
    if (amps <= 100) return 100;
    if (amps <= 125) return 125;
    if (amps <= 150) return 150;
    if (amps <= 200) return 200;
    if (amps <= 320) return 320;
    return 400;
  }

  // NEC 220.55 Range Demand
  function _htELGetRangeDemand(numRanges, perRangeKW) {
    var tbl = window._htELRangeDemand || [];
    if (numRanges <= 0) return 0;
    if (numRanges <= 5) {
      var baseKW = tbl[numRanges] || 8;
      // If single range > 12kW, add 5% per kW over 12
      if (numRanges === 1 && perRangeKW > 12) {
        baseKW = baseKW + (baseKW * 0.05 * (perRangeKW - 12));
      }
      return baseKW * 1000;
    }
    // 6+ ranges: 20kW + 3kW per additional
    return (20 + (numRanges - 5) * 3) * 1000;
  }

  // Main calculation
  window._htELCalc = function() {
    _htELSyncState();
    var S = window._htELState;
    var resEl = document.getElementById('htELResults');
    if (!resEl) return;
    if (S.sqft <= 0) {
      resEl.innerHTML = '<div style="padding:12px;color:#f87171;font-size:11px;text-align:center;">&#9888; ' + _th('ht_el_enter_sqft','Ingrese los Sq Ft de la vivienda') + '</div>';
      return;
    }
    try { return _htELCalcInner(S, resEl); } catch(e) {
      console.error('[EL] Calc error:', e);
      resEl.innerHTML = '<div style="padding:12px;color:#f87171;font-size:11px;text-align:center;">&#9888; ' + _th('ht_el_calc_error','Error en cálculo') + ': ' + e.message + '</div>' +
        '<button onclick="_htELCalc()" style="width:100%;padding:14px;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;color:#fff;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;margin-top:8px;">&#9889; ' + _th('ht_el_retry','REINTENTAR') + '</button>';
    }
  };
  function _htELCalcInner(S, resEl) {
    var voltage = S.voltage || 240;

    // ═══ NEC 220 STANDARD METHOD ═══
    // 1. General Lighting (220.12)
    var lightingVA = S.sqft * 3;
    // 2. Small Appliance Circuits (220.52A)
    var smallAppVA = Math.max(2, S.smallAppCircuits) * 1500;
    // 3. Laundry Circuit (220.52B)
    var laundryVA = S.laundryCircuits * 1500;
    // 4. General subtotal
    var genSubtotal = lightingVA + smallAppVA + laundryVA;
    // 5. Demand Factor (220.42)
    var genDemand;
    if (genSubtotal <= 3000) {
      genDemand = genSubtotal;
    } else if (genSubtotal <= 120000) {
      genDemand = 3000 + (genSubtotal - 3000) * 0.35;
    } else {
      genDemand = 3000 + (120000 - 3000) * 0.35 + (genSubtotal - 120000) * 0.25;
    }
    // 6. Range Demand (220.55)
    var rangeKW = S.gasRange ? 0 : S.rangeKW;
    var rangeDemandW = _htELGetRangeDemand(S.numRanges, rangeKW);
    if (S.gasRange) rangeDemandW = 0;
    // 7. Dryer Demand (220.54)
    var dryerKW = S.gasDryer ? 0 : S.dryerKW;
    var dryerDemandW = dryerKW > 0 ? Math.max(5000, dryerKW * 1000) : 0;
    // 8. HVAC Non-coincident (220.60)
    var coolingW = Math.max(S.acKW, S.heatPumpKW) * 1000;
    var heatingW = S.heatKW * 1000;
    var hvacW = Math.max(coolingW, heatingW);
    var hvacWinner = coolingW >= heatingW ? 'Cooling' : 'Heating';
    // 9. Fixed Appliances (220.53)
    var fixedApps = [];
    if (S.whKW > 0) fixedApps.push({name:'Water Heater', w: S.whKW * 1000});
    if (S.dwKW > 0 && !S.gasRange) fixedApps.push({name:'Dishwasher', w: S.dwKW * 1000});
    if (S.dispKW > 0) fixedApps.push({name:'Disposal', w: S.dispKW * 1000});
    if (S.microKW > 0) fixedApps.push({name:'Microwave', w: S.microKW * 1000});
    if (S.washerKW > 0) fixedApps.push({name:'Washer', w: S.washerKW * 1000});
    var fixedTotal = 0;
    for (var fi = 0; fi < fixedApps.length; fi++) fixedTotal += fixedApps[fi].w;
    var fixedDemand = fixedApps.length >= 4 ? fixedTotal * 0.75 : fixedTotal;
    var fixed75 = fixedApps.length >= 4;
    // 10. Special loads
    var evW = S.evKW * 1000;
    var hotTubW = S.hotTubKW * 1000;
    var xmasW = S.christmasW;
    var snowW = S.snowW;
    var otherW = S.otherKW * 1000;
    var specialTotal = evW + hotTubW + xmasW + snowW + otherW;
    // 11. Total Standard
    var totalStd = genDemand + rangeDemandW + dryerDemandW + hvacW + fixedDemand + specialTotal;
    var ampsStd = totalStd / voltage;
    var serviceSizeStd = _htELServiceSize(ampsStd);

    // ═══ NEC 220 OPTIONAL METHOD (220.82/220.83) ═══
    var allGeneralVA = lightingVA + smallAppVA + laundryVA;
    var allApplianceW = (S.gasRange ? 0 : rangeKW * 1000) + (S.gasDryer ? 0 : dryerKW * 1000) + fixedTotal + specialTotal;
    var optSubtotal = allGeneralVA + allApplianceW;
    var optDemand;
    if (optSubtotal <= 10000) {
      optDemand = optSubtotal;
    } else {
      optDemand = 10000 + (optSubtotal - 10000) * 0.40;
    }
    optDemand += hvacW; // HVAC at 100%
    var ampsOpt = optDemand / voltage;
    var serviceSizeOpt = _htELServiceSize(ampsOpt);

    // ═══ NEUTRAL LOAD (220.61) ═══
    var neutralGen = genDemand;
    var neutralRange = rangeDemandW * 0.70;
    var neutralDryer = dryerDemandW * 0.70;
    var neutral120 = 0;
    for (var ni = 0; ni < fixedApps.length; ni++) neutral120 += fixedApps[ni].w;
    if (fixed75) neutral120 *= 0.75;
    neutral120 += xmasW + otherW;
    var neutralTotal = neutralGen + neutralRange + neutralDryer + neutral120;
    var neutralAmps = neutralTotal / voltage;
    // Over 200A: first 200A@100%, remainder@70%
    if (neutralAmps > 200) neutralAmps = 200 + (neutralAmps - 200) * 0.70;

    // ═══ SERVICE SIZING ═══
    var useAmps = Math.min(ampsStd, ampsOpt);
    var useMethod = ampsStd <= ampsOpt ? 'Standard' : 'Optional';
    var serviceSize = _htELServiceSize(useAmps);
    var svcCond = _htELGetServiceCond(serviceSize);
    var gec = _htELLookupGEC(serviceSize);
    var egc = _htELLookupEGC(serviceSize);

    // ═══ SOLAR (Title 24 + 120% Bus Rule) ═══
    var solarNote = '';
    if (S.solarOn && S.solarKW > 0) {
      var t24kw = (S.sqft * 0.554 / 1000) + 1.784;
      var battCredit = (S.batteryOn && S.batteryKWH >= 7.5) ? 0.75 : 1.0;
      var t24req = t24kw * battCredit;
      var maxSolarBrk = (serviceSize * 1.2) - serviceSize;
      var solarAmps = (S.solarKW * 1000) / voltage;
      var busPass = solarAmps <= maxSolarBrk;
      solarNote = '<div style="margin-top:8px;padding:10px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:8px;">';
      solarNote += '<div style="font-size:10px;font-weight:700;color:#34d399;margin-bottom:4px;">&#9728; ' + _t('ht_el_solar_analysis','Análisis Solar PV') + '</div>';
      solarNote += '<div style="font-size:9px;color:#4b5563;line-height:1.6;">';
      solarNote += _t('ht_el_required','Requerido') + ' Title 24: <b style="color:#34d399;">' + t24req.toFixed(2) + ' kW</b> (CFA=' + S.sqft + ' sqft)';
      if (battCredit < 1) solarNote += ' <span style="color:#60a5fa;">(' + _t('ht_el_battery_credit','crédito de batería aplicado') + ')</span>';
      solarNote += '<br>' + _t('ht_el_your_system','Tu Sistema') + ': <b>' + S.solarKW + ' kW</b> (' + (S.solarKW >= t24req ? '<span style="color:#34d399;">' + _t('ht_complies','CUMPLE') + '</span>' : '<span style="color:#f87171;">' + _t('ht_not_complies','NO CUMPLE') + '</span>') + ' ' + _t('ht_el_requirement','requisito') + ')<br>';
      solarNote += 'NEC 705.12(B)(2) 120% Bus Rule: Breaker solar máx = ' + maxSolarBrk.toFixed(0) + 'A | Solar = ' + solarAmps.toFixed(1) + 'A ';
      solarNote += busPass ? '<span style="color:#34d399;">&#10004; ' + _t('ht_pass','PASA') + '</span>' : '<span style="color:#f87171;">&#10008; ' + _t('ht_fail_solar','FALLA — reduce solar o sube panel') + '</span>';
      solarNote += '</div></div>';
    }

    // ═══ GENERATOR NOTE ═══
    var genNote = '';
    if (S.generatorOn && S.generatorKW > 0) {
      genNote = '<div style="margin-top:8px;padding:10px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:8px;">';
      genNote += '<div style="font-size:10px;font-weight:700;color:#fbbf24;margin-bottom:4px;">&#9889; ' + _t('ht_el_generator','Generador') + ': ' + S.generatorKW + ' kW</div>';
      genNote += '<div style="font-size:9px;color:#4b5563;">Transfer Switch: ' + (S.transferOn ? (S.transferType === 'auto' ? _t('ht_el_automatic','Automático') : 'Manual') + ' ' + S.transferAmps + 'A' : _t('ht_el_not_configured','No configurado')) + ' (NEC 702)</div>';
      genNote += '</div>';
    }

    // ═══ STORE RESULT FOR PDF ═══
    window._htELLastResult = {
      sqft: S.sqft, voltage: voltage, dwelling: S.dwelling,
      bedrooms: S.bedrooms, bathrooms: S.bathrooms,
      lightingVA: lightingVA, smallAppVA: smallAppVA, laundryVA: laundryVA,
      genSubtotal: genSubtotal, genDemand: genDemand,
      rangeDemandW: rangeDemandW, dryerDemandW: dryerDemandW,
      hvacW: hvacW, hvacWinner: hvacWinner,
      coolingW: coolingW, heatingW: heatingW,
      fixedApps: fixedApps, fixedTotal: fixedTotal, fixedDemand: fixedDemand, fixed75: fixed75,
      specialTotal: specialTotal, evW: evW, hotTubW: hotTubW, xmasW: xmasW, snowW: snowW, otherW: otherW,
      totalStd: totalStd, ampsStd: ampsStd, serviceSizeStd: serviceSizeStd,
      optDemand: optDemand, ampsOpt: ampsOpt, serviceSizeOpt: serviceSizeOpt,
      neutralTotal: neutralTotal, neutralAmps: neutralAmps,
      serviceSize: serviceSize, useMethod: useMethod,
      svcCond: svcCond, gec: gec, egc: egc,
      solar: S.solarOn ? {kw: S.solarKW, battery: S.batteryOn, battKWH: S.batteryKWH} : null,
      generator: S.generatorOn ? {kw: S.generatorKW, transfer: S.transferOn, type: S.transferType, amps: S.transferAmps} : null,
      circuits: S.circuits
    };

    // ═══ RENDER RESULTS ═══
    var r = '';
    // Main metrics
    r += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">';
    r += '<div style="background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:10px;text-align:center;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;letter-spacing:0.5px;">DEMANDA TOTAL</div>';
    r += '<div style="font-size:16px;font-weight:900;color:#f87171;">' + Math.round(totalStd).toLocaleString() + ' W</div></div>';
    r += '<div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:10px;text-align:center;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;letter-spacing:0.5px;">AMPERAJE</div>';
    r += '<div style="font-size:16px;font-weight:900;color:#fbbf24;">' + ampsStd.toFixed(1) + ' A</div></div>';
    r += '<div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:10px;padding:10px;text-align:center;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;letter-spacing:0.5px;">TAMAÑO DE SERVICIO</div>';
    r += '<div style="font-size:16px;font-weight:900;color:#34d399;">' + serviceSize + ' A</div></div>';
    r += '</div>';

    // Method comparison
    r += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">';
    r += '<div style="padding:10px;border-radius:8px;border:1.5px solid ' + (useMethod==='Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(0,0,0,0.05)') + ';background:' + (useMethod==='Standard' ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.02)') + ';">';
    r += '<div style="font-size:8px;font-weight:700;color:#60a5fa;">NEC 220 ESTÁNDAR</div>';
    r += '<div style="font-size:13px;font-weight:900;color:#111827;">' + Math.round(totalStd).toLocaleString() + ' W</div>';
    r += '<div style="font-size:9px;color:#4b5563;">' + ampsStd.toFixed(1) + 'A &rarr; ' + serviceSizeStd + 'A service</div>';
    r += (useMethod==='Standard' ? '<div style="font-size:7px;color:#34d399;font-weight:700;margin-top:2px;">&#10004; MENOR — USANDO ESTE</div>' : '') + '</div>';
    r += '<div style="padding:10px;border-radius:8px;border:1.5px solid ' + (useMethod==='Optional' ? 'rgba(168,85,247,0.4)' : 'rgba(0,0,0,0.05)') + ';background:' + (useMethod==='Optional' ? 'rgba(168,85,247,0.08)' : 'rgba(0,0,0,0.02)') + ';">';
    r += '<div style="font-size:8px;font-weight:700;color:#c084fc;">NEC 220 OPCIONAL</div>';
    r += '<div style="font-size:13px;font-weight:900;color:#111827;">' + Math.round(optDemand).toLocaleString() + ' W</div>';
    r += '<div style="font-size:9px;color:#4b5563;">' + ampsOpt.toFixed(1) + 'A &rarr; ' + serviceSizeOpt + 'A service</div>';
    r += (useMethod==='Optional' ? '<div style="font-size:7px;color:#34d399;font-weight:700;margin-top:2px;">&#10004; MENOR — USANDO ESTE</div>' : '') + '</div>';
    r += '</div>';

    // Standard Method Breakdown
    r += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:10px;padding:12px;margin-bottom:10px;">';
    r += '<div style="font-size:9px;font-weight:700;color:#4b5563;margin-bottom:8px;">DESGLOSE MÉTODO ESTÁNDAR NEC 220</div>';
    var bd = [
      [_t('ht_el_lighting','Iluminación General') + ' (' + S.sqft + ' sqft &times; 3 VA)', lightingVA, '#60a5fa'],
      [_t('ht_el_appliances','Electrodomésticos') + ' (' + Math.max(2,S.smallAppCircuits) + ' &times; 1500 VA)', smallAppVA, '#fbbf24'],
      [_t('ht_el_laundry','Lavandería') + ' (' + S.laundryCircuits + ' &times; 1500 VA)', laundryVA, '#c084fc'],
      ['Subtotal General', genSubtotal, '#57574F'],
      [_t('ht_el_after_demand','Después de Factor de Demanda') + ' (220.42)', genDemand, '#34d399'],
      [_t('ht_el_stove','Estufa/Horno') + ' (220.55) ' + (S.numRanges > 1 ? S.numRanges + ' ' + _t('ht_el_stoves','estufas') : ''), rangeDemandW, '#f87171'],
      [_t('ht_el_dryer','Secadora') + ' (220.54) mín 5kW', dryerDemandW, '#fb923c'],
      ['HVAC — ' + (hvacWinner === 'Cooling' ? _t('ht_el_cooling','Enfriamiento') : _t('ht_el_heating','Calefacción')) + ' (220.60)', hvacW, '#38bdf8'],
      [_t('ht_el_fixed_appliances','Electrodomésticos Fijos') + (fixed75 ? ' (75% of ' + Math.round(fixedTotal) + 'W)' : ''), fixedDemand, '#a78bfa'],
      [_t('ht_el_special_loads','Cargas Especiales') + ' (EV/Alberca/Navidad/Nieve)', specialTotal, '#f472b6']
    ];
    for (var bi = 0; bi < bd.length; bi++) {
      if (bd[bi][1] <= 0 && bi > 4) continue;
      var pct = totalStd > 0 ? (bd[bi][1] / totalStd * 100) : 0;
      var isSub = bi === 3;
      r += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;' + (isSub ? 'opacity:0.5;' : '') + '">';
      r += '<div style="flex:1;font-size:8px;color:#4b5563;">' + bd[bi][0] + '</div>';
      r += '<div style="width:60px;text-align:right;font-size:9px;font-weight:700;color:' + bd[bi][2] + ';">' + Math.round(bd[bi][1]).toLocaleString() + '</div>';
      if (!isSub) {
        r += '<div style="width:40px;"><div style="height:5px;background:rgba(0,0,0,0.06);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + Math.min(pct, 100) + '%;background:' + bd[bi][2] + ';border-radius:3px;"></div></div></div>';
      } else {
        r += '<div style="width:40px;"></div>';
      }
      r += '</div>';
    }
    r += '<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(0,0,0,0.05);display:flex;justify-content:space-between;">';
    r += '<span style="font-size:10px;font-weight:900;color:#111827;">DEMANDA TOTAL</span>';
    r += '<span style="font-size:10px;font-weight:900;color:#f87171;">' + Math.round(totalStd).toLocaleString() + ' W (' + ampsStd.toFixed(1) + 'A)</span>';
    r += '</div></div>';

    // Service Entrance & Wiring
    r += '<div style="background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.15);border-radius:10px;padding:12px;margin-bottom:10px;">';
    r += '<div style="font-size:9px;font-weight:700;color:#fbbf24;margin-bottom:8px;">&#9889; ACOMETIDA Y CABLEADO (NEC 310.12)</div>';
    r += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">TAMAÑO DE SERVICIO</div>';
    r += '<div style="font-size:14px;font-weight:900;color:#fbbf24;">' + serviceSize + 'A @ ' + voltage + 'V</div></div>';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">NEUTRO</div>';
    r += '<div style="font-size:14px;font-weight:900;color:#60a5fa;">' + neutralAmps.toFixed(1) + 'A</div></div>';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">CONDUCTOR COBRE</div>';
    r += '<div style="font-size:12px;font-weight:900;color:#fb923c;">' + svcCond.cu + ' AWG Cu</div></div>';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">CONDUCTOR ALUMINIO</div>';
    r += '<div style="font-size:12px;font-weight:900;color:#4b5563;">' + svcCond.al + ' AWG Al</div></div>';
    r += '</div></div>';

    // Grounding
    r += '<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:10px;padding:12px;margin-bottom:10px;">';
    r += '<div style="font-size:9px;font-weight:700;color:#f59e0b;margin-bottom:8px;">&#9879; SISTEMA DE TIERRA (NEC 250)</div>';
    r += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">GEC (250.66)</div>';
    r += '<div style="font-size:11px;font-weight:900;color:#f59e0b;">Cu: ' + gec.cu + ' | Al: ' + gec.al + '</div></div>';
    r += '<div style="padding:8px;background:rgba(0,0,0,0.03);border-radius:8px;">';
    r += '<div style="font-size:7px;color:#4b5563;font-weight:700;">EGC (250.122)</div>';
    r += '<div style="font-size:11px;font-weight:900;color:#f59e0b;">Cu: ' + egc.cu + ' | Al: ' + egc.al + '</div></div>';
    r += '</div>';
    // Selected grounding electrodes
    var gndSel = [];
    if (S.gndRod) gndSel.push(_th('ht_el_ground_rod', 'Varilla de Tierra'));
    if (S.gndPlate) gndSel.push(_th('ht_el_ground_plate', 'Placa de Tierra'));
    if (S.gndUfer) gndSel.push('Ufer/CEE');
    if (S.gndWater) gndSel.push(_th('ht_el_water_pipe', 'Tubería de Agua'));
    if (gndSel.length > 0) {
      r += '<div style="margin-top:6px;padding:8px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:8px;">';
      r += '<div style="font-size:8px;font-weight:700;color:#fbbf24;">&#10004; Electrodos Seleccionados: <span style="color:#111827;">' + gndSel.join(' &bull; ') + '</span></div>';
      if (S.gndRod && !S.gndUfer && !S.gndWater && !S.gndPlate) {
        r += '<div style="font-size:7px;color:#fb923c;margin-top:3px;">&#9888; NEC 250.53(A)(2): Single rod must be supplemented with a second electrode unless resistance ≤ 25 ohms</div>';
      }
      r += '</div>';
    }
    // Also update the grounding info section
    var gndEl = document.getElementById('htELGroundingInfo');
    if (gndEl) {
      gndEl.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div style="padding:6px;background:rgba(0,0,0,0.03);border-radius:6px;"><div style="font-size:7px;color:#4b5563;">Conductor de Servicio</div><div style="font-size:10px;font-weight:700;color:#fbbf24;">Cu: ' + svcCond.cu + ' | Al: ' + svcCond.al + '</div></div>' +
        '<div style="padding:6px;background:rgba(0,0,0,0.03);border-radius:6px;"><div style="font-size:7px;color:#4b5563;">GEC (250.66)</div><div style="font-size:10px;font-weight:700;color:#f59e0b;">Cu: ' + gec.cu + ' | Al: ' + gec.al + '</div></div>' +
        '<div style="padding:6px;background:rgba(0,0,0,0.03);border-radius:6px;"><div style="font-size:7px;color:#4b5563;">EGC (250.122)</div><div style="font-size:10px;font-weight:700;color:#f59e0b;">Cu: ' + egc.cu + ' | Al: ' + egc.al + '</div></div>' +
        '<div style="padding:6px;background:rgba(0,0,0,0.03);border-radius:6px;"><div style="font-size:7px;color:#4b5563;">' + _t('ht_el_bonding_jumper','Puente de Unión') + '</div><div style="font-size:10px;font-weight:700;color:#f59e0b;">' + _t('ht_el_same_as_gec','Igual que GEC') + '</div></div>' +
        '</div>';
    }
    r += '</div>';

    // Solar/Generator notes
    r += solarNote;
    r += genNote;

    // Branch circuit summary
    if (S.circuits && S.circuits.length > 0) {
      var totalSpaces = 0;
      for (var ci = 0; ci < S.circuits.length; ci++) totalSpaces += S.circuits[ci].v === 240 ? 2 : 1;
      var panelSize = totalSpaces <= 20 ? 20 : totalSpaces <= 30 ? 30 : totalSpaces <= 40 ? 40 : 42;
      r += '<div style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:10px;padding:12px;margin-bottom:10px;">';
      r += '<div style="font-size:9px;font-weight:700;color:#60a5fa;margin-bottom:6px;">&#128203; DISTRIBUCIÓN DE PANEL</div>';
      r += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
      r += '<div style="padding:6px 10px;background:rgba(59,130,246,0.1);border-radius:6px;font-size:9px;color:#60a5fa;font-weight:700;">' + S.circuits.length + ' Circuitos</div>';
      r += '<div style="padding:6px 10px;background:rgba(251,191,36,0.1);border-radius:6px;font-size:9px;color:#fbbf24;font-weight:700;">' + totalSpaces + ' Espacios</div>';
      r += '<div style="padding:6px 10px;background:rgba(34,197,94,0.1);border-radius:6px;font-size:9px;color:#34d399;font-weight:700;">' + panelSize + ' Espacios Panel</div>';
      r += '<div style="padding:6px 10px;background:rgba(248,113,113,0.1);border-radius:6px;font-size:9px;color:#f87171;font-weight:700;">' + serviceSize + 'A Breaker Principal</div>';
      r += '</div></div>';
    }

    // NEC reference
    r += '<div style="padding:10px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:8px;margin-bottom:10px;">';
    r += '<div style="font-size:8px;color:#4b5563;line-height:1.5;">';
    r += '<b style="color:#4b5563;">Referencias NEC:</b> 220.12 General Lighting &bull; 220.42 Demand Factors &bull; 220.52 Small Appliance/Laundry &bull; 220.53 Fixed Appliances &bull; 220.54 Dryer &bull; 220.55 Range &bull; 220.60 Non-coincident &bull; 220.61 Neutral &bull; 220.82/83 Optional Method &bull; 250.66 GEC &bull; 250.122 EGC &bull; 310.12 Service Conductors &bull; 314.16 Box Fill';
    if (S.solarOn) r += ' &bull; 690 Solar PV &bull; 705.12(B)(2) Bus Rule';
    if (S.generatorOn) r += ' &bull; 702 Standby Systems';
    r += '</div></div>';

    // PDF bar
    r += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('elecload') : '';

    // Recalculate button at the bottom of results
    r += '<button onclick="_htELCalc()" style="width:100%;padding:16px;background:linear-gradient(135deg,#f59e0b,#d97706,#ea580c);border:none;color:#fff;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;margin-top:12px;letter-spacing:0.5px;box-shadow:0 4px 25px rgba(245,158,11,0.3);text-transform:uppercase;">&#9889; RECALCULAR CARGA EL&Eacute;CTRICA</button>';

    resEl.innerHTML = r;
  }


})();
