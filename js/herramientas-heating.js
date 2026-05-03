/**
 * Herramientas HVAC — Heating System Performance Diagnostic
 * Calefaccion — System Performance: Heat pumps, VRF, water heaters
 * Self-contained module exposing window.initHeatingScreen
 */
(function() {
  'use strict';

  // ============================
  // MODULE STATE
  // ============================
  var _sysType = 'hp';            // Current equipment type
  var _meteringDevice = 'txv';    // Current metering device
  var _rvStatus = 'heating';      // Reversing valve status
  var _auxHeat = 'off';           // Aux heat: off | on | emergency
  var _defrostStatus = 'none';    // none | active | post
  var _isWaterType = false;       // true for waterht / waterhp
  var _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };

  // Normal ranges per system type (heating mode)
  var HEAT_RANGES = {
    minihp:   { shMin: 4,  shMax: 10, scMin: 4,  scMax: 10, csMin: 15, csMax: 20, dtMin: 15, dtMax: 25 },
    hp:       { shMin: 8,  shMax: 14, scMin: 8,  scMax: 14, csMin: 15, csMax: 25, dtMin: 15, dtMax: 25 },
    vrf:      { shMin: 4,  shMax: 8,  scMin: 4,  scMax: 8,  csMin: 10, csMax: 18, dtMin: 15, dtMax: 25 },
    centralhp:{ shMin: 8,  shMax: 14, scMin: 8,  scMax: 14, csMin: 15, csMax: 25, dtMin: 15, dtMax: 25 },
    pkghp:    { shMin: 8,  shMax: 14, scMin: 8,  scMax: 14, csMin: 15, csMax: 25, dtMin: 15, dtMax: 25 },
    waterht:  { riseMin: 40, riseMax: 70, gasNat: 3.5, gasLP: 10, flueMin: 300, flueMax: 500 },
    waterhp:  { copMin: 2.5, copMax: 4.0, riseMin: 40, riseMax: 70, shMin: 4, shMax: 10, scMin: 4, scMax: 10 }
  };

  // Metering device ranges (heating mode — slightly different from cooling)
  var MD_SH_RANGES = { txv: [8,12], piston: [10,20], cap: [10,20], eev: [5,8] };
  var MD_SC_RANGES = { txv: [8,14], piston: [5,10], cap: [5,10], eev: [8,14] };

  // ============================
  // PSYCHROMETRIC HELPERS (local copies)
  // ============================
  function _calcEnthalpy(dbF, rhPct) {
    if (dbF === null || rhPct === null || isNaN(dbF) || isNaN(rhPct)) return null;
    var tC = (dbF - 32) * 5 / 9;
    var es = 6.112 * Math.exp(17.67 * tC / (tC + 243.5));
    var e = (rhPct / 100) * es;
    var ePsi = e * 0.0145038;
    var W = 0.62198 * ePsi / (14.696 - ePsi);
    return 0.240 * dbF + W * (1061 + 0.444 * dbF);
  }

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

  function _dpFromRH(dbF, rhPct) {
    if (dbF === null || rhPct === null || isNaN(dbF) || isNaN(rhPct) || rhPct <= 0) return null;
    var tC = (dbF - 32) * 5 / 9;
    var gamma = Math.log(rhPct / 100) + (17.67 * tC / (tC + 243.5));
    var dpC = 243.5 * gamma / (17.67 - gamma);
    return dpC * 9 / 5 + 32;
  }

  function _psySatP(tF) {
    var tC = (tF - 32) * 5 / 9;
    var tK = tC + 273.15;
    if (tC >= 0) {
      var lnP = -5800.2206 / tK + 1.3914993 - 0.048640239 * tK +
                0.000041764768 * tK * tK - 0.000000014452093 * tK * tK * tK + 6.5459673 * Math.log(tK);
      return Math.exp(lnP) / 6894.76;
    } else {
      var lnPi = -5674.5359 / tK + 6.3925247 - 0.009677843 * tK +
                 0.00000062215701 * tK * tK + 2.0747825e-9 * tK * tK * tK - 9.484024e-13 * tK * tK * tK * tK + 4.1635019 * Math.log(tK);
      return Math.exp(lnPi) / 6894.76;
    }
  }

  function _psyDewPoint(Pw) {
    if (Pw <= 0) return -60;
    var PwPa = Pw * 6894.76;
    var alpha = Math.log(PwPa);
    var tC = (alpha < Math.log(611.2))
      ? -60.45 + 7.0322 * alpha + 0.3700 * alpha * alpha
      : -35.957 - 1.8726 * alpha + 1.1689 * alpha * alpha;
    return tC * 9 / 5 + 32;
  }

  function _psyWetBulb(db, W, P) {
    var lo = -60, hi = db, mid;
    for (var it = 0; it < 50; it++) {
      mid = (lo + hi) / 2;
      var PwsMid = _psySatP(mid);
      var WsMid = 0.62198 * PwsMid / (P - PwsMid);
      var Wcalc = ((1093 - 0.556 * mid) * WsMid - 0.240 * (db - mid)) / (1093 + 0.444 * db - mid);
      if (Wcalc > W) hi = mid; else lo = mid;
    }
    return mid;
  }

  // ============================
  // REVERSE PT LOOKUP
  // ============================
  function _htReversePT(refName, psig) {
    // Use global if available, otherwise local
    if (typeof window._htReversePT === 'function') {
      return window._htReversePT(refName, psig);
    }
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
  // SAFE VALUE GETTER
  // ============================
  function _htHeatGetVal(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
      if (el.value === '' || el.value === '--') return null;
      return parseFloat(el.value);
    }
    var txt = el.textContent || el.innerText || '';
    if (txt === '--' || txt === '') return null;
    return parseFloat(txt);
  }
  window._htHeatGetVal = _htHeatGetVal;

  // ============================
  // STAT BOX RENDERER
  // ============================
  function _htHeatStatBox(label, val, unit, color) {
    var display = val !== null && val !== undefined
      ? (typeof val === 'string' ? val : (typeof val === 'number' ? val.toFixed(1) + unit : '--'))
      : '--';
    return '<div style="background:rgba(0,0,0,0.03);border-radius:8px;padding:7px 4px;text-align:center;">' +
      '<div style="font-size:12px;color:#111111;font-weight:700;letter-spacing:0.3px;">' + label + '</div>' +
      '<div style="font-size:14px;font-weight:900;color:' + color + ';margin-top:2px;">' + display + '</div></div>';
  }
  window._htHeatStatBox = _htHeatStatBox;

  // ============================
  // INIT — MAIN ENTRY POINT
  // ============================
  window.initHeatingScreen = function() {
    var s = document.getElementById('heatingScreen');
    if (!s) {
      // Try finding or creating the screen container
      s = document.getElementById('manifoldScreen') || document.getElementById('herramientasScreen');
      if (!s) return;
    }
    _htShowHeating(s, true);
  };

  // ============================
  // MAIN RENDER FUNCTION
  // ============================
  function _htShowHeating(s, standalone) {
    _th = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    var backAction = standalone ? "showScreen('dashboardScreen')" : "_htBackToMenu()";

    // Set BLE active tool
    window._htActiveTool = 'heating';
    window._htHeatSysType = _sysType;
    window._htHeatMeteringDevice = _meteringDevice;

    // Auto-fill equipment/client/tech info from profile
    if (!window._htHeatEquip) {
      var _techName = '', _techNum = '', _techEmail = '';
      try { var _tu = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        _techName = _tu.nombre || _tu.name || '';
        _techNum = _tu.technicianNumber || localStorage.getItem('tecnico_number_' + (_tu.email || '')) || localStorage.getItem('tecnico_number') || '';
        _techEmail = _tu.email || localStorage.getItem('tecnico_email') || '';
      } catch(e) {}
      window._htHeatEquip = { model:'', serial:'', clientName:'', clientAddr:'', techName: _techName, techNum: _techNum, techEmail: _techEmail };
    }

    var h = '';
    h += '<div style="background:#FFFFFF;min-height:100vh;color:#111111;padding-bottom:80px;">';

    // ============================================================
    // SECTION 1: HEADER
    // ============================================================
    h += '<div style="position:sticky;top:0;z-index:10;background:#FFFFFF;padding:12px;border-bottom:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="display:flex;align-items:center;gap:10px;">';
    h += '<button onclick="' + backAction + '" style="background:rgba(249,115,22,0.12);border:none;color:#fb923c;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;">\u2039</button>';
    h += '<div><div style="font-size:16px;font-weight:800;color:#111111;">Calefacci\u00F3n \u2014 System Performance</div>';
    h += '<div style="font-size:13px;color:#111111;">Diagn\u00F3stico de sistemas de calefacci\u00F3n en tiempo real</div></div></div></div>';

    h += '<div style="padding:12px;">';

    // ============================================================
    // SECTION 1B: EQUIPMENT / CLIENT / TECHNICIAN INFO
    // ============================================================
    var eq = window._htHeatEquip;
    h += '<div style="background:rgba(249,115,22,0.06);border:1.5px solid rgba(249,115,22,0.2);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    h += '<div style="font-size:13px;font-weight:800;color:#f97316;letter-spacing:0.5px;border-left:3px solid #f97316;padding-left:6px;">INFORMACI\u00D3N DEL SERVICIO</div>';
    h += '<div style="font-size:12px;color:#111111;font-weight:600;">Auto-populated from profile</div></div>';

    // Row 1: Model + Serial
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:#fb923c;font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Modelo</label>';
    h += '<input id="htHeatEqModel" value="' + (eq.model||'') + '" placeholder="Ej: Carrier 58STA090" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(249,115,22,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:#fb923c;font-weight:700;display:block;margin-bottom:2px;">N\u00FAmero de Serie</label>';
    h += '<input id="htHeatEqSerial" value="' + (eq.serial||'') + '" placeholder="Ej: 4921A12345" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(249,115,22,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';

    // Row 2: Client Name + Client Address
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">';
    h += '<div><label style="font-size:12px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Nombre del Cliente</label>';
    h += '<input id="htHeatEqClient" value="' + (eq.clientName||'') + '" placeholder="Nombre completo" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:#111111;font-weight:700;display:block;margin-bottom:2px;">Direcci\u00F3n</label>';
    h += '<input id="htHeatEqAddr" value="' + (eq.clientAddr||'') + '" placeholder="Direcci\u00F3n del servicio" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(59,130,246,0.15);color:#111111;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '</div>';

    // Row 3: Technician Name + Technician Number + Email
    h += '<div style="display:grid;grid-template-columns:1fr 0.8fr 1.2fr;gap:8px;">';
    h += '<div><label style="font-size:12px;color:#34d399;font-weight:700;display:block;margin-bottom:2px;">T\u00E9cnico</label>';
    h += '<input id="htHeatEqTech" value="' + (eq.techName||'') + '" placeholder="Tu nombre" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#34d399;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:#34d399;font-weight:700;display:block;margin-bottom:2px;"># T\u00E9cnico</label>';
    h += '<input id="htHeatEqTechNum" value="' + (eq.techNum||'') + '" placeholder="Lic/Cert #" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#34d399;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;"></div>';
    h += '<div><label style="font-size:12px;color:#34d399;font-weight:700;display:block;margin-bottom:2px;">Email</label>';
    h += '<input id="htHeatEqEmail" value="' + (eq.techEmail||'') + '" placeholder="email@ejemplo.com" oninput="_htHeatSaveEquip()" style="width:100%;background:#ffffff;border:1px solid rgba(34,197,94,0.15);color:#34d399;padding:7px 8px;border-radius:6px;font-size:13px;font-weight:700;box-sizing:border-box;outline:none;" readonly></div>';
    h += '</div>';
    h += '</div>';

    // ============================================================
    // SECTION 2: SYSTEM TYPE SELECTOR
    // ============================================================
    h += '<div style="margin-bottom:10px;">';
    h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:5px;letter-spacing:0.5px;border-left:3px solid #f97316;padding-left:6px;">TIPO DE SISTEMA</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">';
    var sysTypes = [
      ['minihp', '\uD83D\uDD25', 'Mini Split HP', 'Bomba de calor inverter'],
      ['hp',     '\u2668\uFE0F', 'Heat Pump',     'Bomba de calor est\u00E1ndar'],
      ['vrf',    '\uD83C\uDFE2', 'VRF',           'Variable Refrigerant Flow'],
      ['centralhp', '\uD83C\uDF21\uFE0F', 'Central HP', 'Central ducted heat pump'],
      ['pkghp',  '\uD83D\uDCE6', 'Package HP',    'Package unit heat pump'],
      ['waterht','\uD83D\uDEBF', 'Water Heater',  'Gas / Electric / Tankless'],
      ['waterhp', '\uD83D\uDCA7', 'Water HP',     'Heat pump water heater']
    ];
    for (var sti = 0; sti < sysTypes.length; sti++) {
      var st = sysTypes[sti];
      var selSt = st[0] === _sysType
        ? 'background:rgba(249,115,22,0.25);border-color:#f97316;color:#fb923c;'
        : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htHeatSys_' + st[0] + '" onclick="_htHeatSetSys(\'' + st[0] + '\')" style="padding:8px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + selSt + '">';
      h += st[1] + ' ' + st[2];
      h += '<div style="font-size:12px;opacity:0.7;margin-top:1px;">' + st[3] + '</div>';
      h += '</button>';
    }
    h += '</div></div>';

    // ============================================================
    // SECTION 3: REFRIGERANT SELECTOR
    // ============================================================
    h += '<div id="htHeatRefSection" style="margin-bottom:10px;display:flex;gap:8px;align-items:center;' + (_isWaterType && _sysType !== 'waterhp' ? 'display:none;' : '') + '">';
    h += '<label style="font-size:13px;color:#111111;font-weight:600;white-space:nowrap;">Refrigerante:</label>';
    h += '<select id="htHeatRef" onchange="_htHeatUpdate()" style="flex:1;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:8px;font-size:12px;outline:none;">';
    var ptKeys = window.PT_DATA ? Object.keys(window.PT_DATA) : ['R-410A','R-22','R-134a','R-404A','R-407C','R-32'];
    for (var ki = 0; ki < ptKeys.length; ki++) {
      var sel = ptKeys[ki] === 'R-410A' ? ' selected' : '';
      h += '<option value="' + ptKeys[ki] + '"' + sel + '>' + ptKeys[ki] + '</option>';
    }
    h += '</select></div>';

    // ============================================================
    // SECTION 4: METERING DEVICE SELECTOR
    // ============================================================
    h += '<div id="htHeatMDSection" style="margin-bottom:10px;' + (_isWaterType && _sysType !== 'waterhp' ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:5px;letter-spacing:0.5px;border-left:3px solid #f97316;padding-left:6px;">METERING DEVICE</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;">';
    var mDevices = [
      ['txv', 'TXV/TEV'],
      ['piston', 'Pist\u00F3n'],
      ['cap', 'Cap Tube'],
      ['eev', 'EEV']
    ];
    for (var mdi = 0; mdi < mDevices.length; mdi++) {
      var md = mDevices[mdi];
      var mSel = md[0] === _meteringDevice
        ? 'background:rgba(52,211,153,0.2);border-color:#34d399;color:#34d399;'
        : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htHeatMD_' + md[0] + '" onclick="_htHeatSetMD(\'' + md[0] + '\')" style="padding:7px 2px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + mSel + '">' + md[1] + '</button>';
    }
    h += '</div>';
    h += '<div id="htHeatMDInfo" style="margin-top:4px;font-size:12px;color:#34d399;">In heating mode, the outdoor coil is the EVAPORATOR. TXV: SH 8-12\u00B0F, SC for charge verification.</div>';
    h += '</div>';

    // ============================================================
    // SECTION 5: REVERSING VALVE STATUS (NEW)
    // ============================================================
    h += '<div id="htHeatRVSection" style="margin-bottom:10px;' + (_isWaterType && _sysType !== 'waterhp' ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:700;color:#111111;margin-bottom:5px;letter-spacing:0.5px;border-left:3px solid #f97316;padding-left:6px;">REVERSING VALVE STATUS</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">';
    var rvStates = [
      ['heating', '\uD83D\uDD25', 'Heating'],
      ['cooling', '\u2744\uFE0F', 'Cooling'],
      ['defrost', '\uD83C\uDF28\uFE0F', 'Defrost']
    ];
    for (var rvi = 0; rvi < rvStates.length; rvi++) {
      var rv = rvStates[rvi];
      var rvSel = rv[0] === _rvStatus
        ? 'background:rgba(249,115,22,0.25);border-color:#f97316;color:#fb923c;'
        : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htHeatRV_' + rv[0] + '" onclick="_htHeatSetRV(\'' + rv[0] + '\')" style="padding:8px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + rvSel + '">' + rv[1] + ' ' + rv[2] + '</button>';
    }
    h += '</div>';
    h += '<div id="htHeatRVInfo" style="margin-top:4px;font-size:12px;color:#fb923c;padding:4px 6px;background:rgba(249,115,22,0.06);border-radius:6px;">';
    h += _getRVInfoText(_rvStatus);
    h += '</div></div>';

    // ============================================================
    // SECTION 6: DIGITAL PRESSURE DISPLAYS
    // ============================================================
    h += '<div id="htHeatPressSection" style="' + (_isWaterType && _sysType !== 'waterhp' ? 'display:none;' : '') + '">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';

    // LOW SIDE (Outdoor Evaporator in heating mode)
    h += '<div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:10px;text-align:center;">';
    h += '<div style="font-size:13px;font-weight:800;color:#111111;margin-bottom:3px;letter-spacing:0.5px;">LOW SIDE</div>';
    h += '<div style="font-size:12px;color:#111111;margin-bottom:4px;">EVAPORADOR (Exterior)</div>';
    h += '<div style="background:#ffffff;border:1px solid rgba(59,130,246,0.25);border-radius:10px;padding:12px 6px;margin-bottom:6px;">';
    h += '<div id="htHeatLoLCD" style="font-size:36px;font-weight:900;color:#111111;font-family:monospace;line-height:1;text-shadow:0 0 12px rgba(96,165,250,0.4);">68.0</div>';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;margin-top:2px;">PSIG</div></div>';
    h += '<input id="htHeatLoPsi" type="range" min="0" max="350" value="68" oninput="_htHeatSyncSlider(\'lo\')" style="width:100%;accent-color:#3b82f6;">';
    h += '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:4px;">';
    h += '<input id="htHeatLoInput" type="number" value="68" oninput="_htHeatSyncInput(\'lo\')" style="width:80px;background:#FFFFFF;color:#111111;border:1px solid rgba(59,130,246,0.3);border-radius:6px;padding:6px;font-size:14px;font-weight:900;text-align:center;outline:none;font-family:monospace;">';
    h += '<span style="font-size:13px;color:#111111;font-weight:600;">psig</span></div>';
    h += '<div style="font-size:13px;color:#111111;margin-top:4px;font-weight:700;" id="htHeatLoTemp">--</div></div>';

    // HIGH SIDE (Indoor Condenser in heating mode)
    h += '<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:10px;text-align:center;">';
    h += '<div style="font-size:13px;font-weight:800;color:#f87171;margin-bottom:3px;letter-spacing:0.5px;">HIGH SIDE</div>';
    h += '<div style="font-size:12px;color:#111111;margin-bottom:4px;">CONDENSADOR (Interior)</div>';
    h += '<div style="background:#ffffff;border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:12px 6px;margin-bottom:6px;">';
    h += '<div id="htHeatHiLCD" style="font-size:36px;font-weight:900;color:#f87171;font-family:monospace;line-height:1;text-shadow:0 0 12px rgba(248,113,113,0.4);">280.0</div>';
    h += '<div style="font-size:13px;color:#111111;font-weight:700;margin-top:2px;">PSIG</div></div>';
    h += '<input id="htHeatHiPsi" type="range" min="0" max="700" value="280" oninput="_htHeatSyncSlider(\'hi\')" style="width:100%;accent-color:#ef4444;">';
    h += '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-top:4px;">';
    h += '<input id="htHeatHiInput" type="number" value="280" oninput="_htHeatSyncInput(\'hi\')" style="width:80px;background:#FFFFFF;color:#f87171;border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:6px;font-size:14px;font-weight:900;text-align:center;outline:none;font-family:monospace;">';
    h += '<span style="font-size:13px;color:#111111;font-weight:600;">psig</span></div>';
    h += '<div style="font-size:13px;color:#111111;margin-top:4px;font-weight:700;" id="htHeatHiTemp">--</div></div>';

    h += '</div></div>';

    // ============================================================
    // SECTION 7: SUPERHEAT / SUBCOOLING LIVE DISPLAY
    // ============================================================
    h += '<div id="htHeatSHSCSection" style="' + (_isWaterType && _sysType !== 'waterhp' ? 'display:none;' : '') + '">';
    h += '<div id="htHeatSHSCBar" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">';
    h += '<div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:8px;text-align:center;">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;letter-spacing:0.4px;">SH (Evap Exterior)</div>';
    h += '<div id="htHeatSHLive" style="font-size:22px;font-weight:900;color:#34d399;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div id="htHeatSHRange" style="font-size:12px;color:#111111;font-weight:600;">Rango: --</div></div>';
    h += '<div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;padding:8px;text-align:center;">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;letter-spacing:0.4px;">SC (Cond Interior)</div>';
    h += '<div id="htHeatSCLive" style="font-size:22px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div id="htHeatSCRange" style="font-size:12px;color:#111111;font-weight:600;">Rango: --</div></div>';
    h += '</div></div>';

    // ============================================================
    // SECTION 8: LIVE WEATHER CONDITIONS (GPS)
    // ============================================================
    var _wx = window.MaestroWeather || {};
    var _wxReady = _wx.tempF !== null && _wx.tempF !== undefined;
    h += '<div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:12px;padding:10px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">';
    h += '<div style="font-size:13px;font-weight:800;color:#f97316;letter-spacing:0.5px;">CONDICIONES EXTERIORES (GPS)</div>';
    h += '<div id="htHeatWxCity" style="font-size:12px;color:#111111;font-weight:600;">' + (_wx.city || 'Ubicaci\u00F3n...') + '</div>';
    h += '</div>';
    if (_wxReady) {
      h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;">';
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(249,115,22,0.1);">';
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
      h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px 4px;border:1px solid rgba(249,115,22,0.1);">';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">ELEVACI\u00D3N</div>';
      h += '<div style="font-size:16px;font-weight:900;color:#111111;font-family:monospace;">' + (_wx.elevationFt !== null && _wx.elevationFt !== undefined ? Math.round(_wx.elevationFt) : '--') + '</div>';
      h += '<div style="font-size:12px;color:#111111;font-weight:700;">ft</div></div>';
      h += '</div>';
    } else {
      h += '<div style="text-align:center;color:#111111;font-size:13px;padding:6px;">Otorgue permiso de ubicaci\u00F3n para datos clim\u00E1ticos en vivo</div>';
    }
    h += '</div>';

    // ============================================================
    // SECTION 9A: FIELD TEMPERATURES — HEAT PUMP TYPES
    // ============================================================
    h += '<div id="htHeatFieldTempsHP" style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:12px;margin-bottom:10px;' + (_isWaterType ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px;">TEMPERATURAS DE CAMPO (\u00B0F) \u2014 HEATING MODE</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    var hpTempFields = [
      ['htHeatSuctionT',   'Suction Line (Outdoor)',  '35',  '#60a5fa', false],
      ['htHeatLiquidT',    'Liquid Line',             '100', '#f87171', false],
      ['htHeatDischargeT', 'Discharge Line',          '170', '#ef4444', false],
      ['htHeatOutdoorT',   'Outdoor Ambient',         (_wxReady ? _wx.tempF.toFixed(1) : '35'), '#fb923c', false],
      ['htHeatIndoorT',    'Indoor Return',           '68',  '#34d399', false],
      ['htHeatSupplyT',    'Supply Air',              '95',  '#f97316', false],
      ['htHeatDeltaT',     'Delta-T (auto)',          '--',  '#c084fc', true],
      ['htHeatDefrostT',   'Coil/Defrost Temp',       '32',  '#22d3ee', false]
    ];
    for (var tfi = 0; tfi < hpTempFields.length; tfi++) {
      var tf = hpTempFields[tfi];
      h += '<div><label style="font-size:12px;color:' + tf[3] + ';font-weight:600;display:block;margin-bottom:2px;">' + tf[1] + '</label>';
      if (tf[4]) {
        h += '<div id="' + tf[0] + '" style="background:#FFFFFF;color:' + tf[3] + ';border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:7px;font-size:13px;font-weight:800;text-align:center;">--</div>';
      } else {
        h += '<input id="' + tf[0] + '" type="number" step="0.1" placeholder="' + tf[2] + '" oninput="_htHeatUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:13px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;">';
      }
      h += '</div>';
    }
    h += '</div></div>';

    // ============================================================
    // SECTION 9B: FIELD TEMPERATURES — WATER HEATER TYPES
    // ============================================================
    h += '<div id="htHeatFieldTempsWater" style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:12px;margin-bottom:10px;' + (!_isWaterType ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px;">WATER HEATER READINGS</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    var waterTempFields = [
      ['htHeatWaterIn',      'Inlet Water Temp (\u00B0F)',      '55',  '#60a5fa', false],
      ['htHeatWaterOut',     'Outlet Water Temp (\u00B0F)',     '120', '#f87171', false],
      ['htHeatWaterRise',    'Temperature Rise (auto)',          '--',  '#f97316', true],
      ['htHeatThermostat',   'Thermostat Setting (\u00B0F)',    '120', '#fbbf24', false],
      ['htHeatFlowGPM',     'Flow Rate (GPM)',                  '--',  '#34d399', false],
      ['htHeatGasPressure',  'Gas Manifold Pressure (inWC)',    '--',  '#c084fc', false],
      ['htHeatFlueTempF',   'Flue Temperature (\u00B0F)',       '--',  '#ef4444', false],
      ['htHeatAmbientT',    'Ambient Air Temp (\u00B0F)',       (_wxReady ? _wx.tempF.toFixed(1) : '68'), '#fb923c', false]
    ];
    for (var wfi = 0; wfi < waterTempFields.length; wfi++) {
      var wf = waterTempFields[wfi];
      h += '<div><label style="font-size:12px;color:' + wf[3] + ';font-weight:600;display:block;margin-bottom:2px;">' + wf[1] + '</label>';
      if (wf[4]) {
        h += '<div id="' + wf[0] + '" style="background:#FFFFFF;color:' + wf[3] + ';border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:7px;font-size:13px;font-weight:800;text-align:center;">--</div>';
      } else {
        h += '<input id="' + wf[0] + '" type="number" step="0.1" placeholder="' + wf[2] + '" oninput="_htHeatUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:13px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;">';
      }
      h += '</div>';
    }
    h += '</div></div>';

    // ============================================================
    // SECTION 10: AUXILIARY / EMERGENCY HEAT (NEW)
    // ============================================================
    h += '<div id="htHeatAuxSection" style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.18);border-radius:12px;padding:12px;margin-bottom:10px;' + (_isWaterType ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:800;color:#ef4444;margin-bottom:8px;border-left:3px solid #ef4444;padding-left:6px;">AUXILIARY / EMERGENCY HEAT</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
    var auxStates = [
      ['off', 'Aux Heat OFF'],
      ['on', 'Aux Heat ON'],
      ['emergency', 'Emergency Heat']
    ];
    for (var axi = 0; axi < auxStates.length; axi++) {
      var ax = auxStates[axi];
      var axSel = ax[0] === _auxHeat
        ? 'background:rgba(239,68,68,0.25);border-color:#ef4444;color:#f87171;'
        : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htHeatAux_' + ax[0] + '" onclick="_htHeatSetAux(\'' + ax[0] + '\')" style="padding:7px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + axSel + '">' + ax[1] + '</button>';
    }
    h += '</div>';
    // Aux heat fields (shown when aux is on or emergency)
    h += '<div id="htHeatAuxFields" style="display:' + (_auxHeat === 'off' ? 'none' : 'grid') + ';grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div><label style="font-size:12px;color:#f87171;font-weight:600;display:block;margin-bottom:2px;">Aux kW Rating</label>';
    h += '<input id="htHeatAuxKW" type="number" step="0.1" placeholder="10" oninput="_htHeatUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:12px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:12px;color:#111111;font-weight:600;display:block;margin-bottom:2px;">Aux Amps</label>';
    h += '<div id="htHeatAuxAmps" style="background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:7px;font-size:12px;font-weight:800;text-align:center;">--</div></div>';
    h += '<div><label style="font-size:12px;color:#f97316;font-weight:600;display:block;margin-bottom:2px;">Total BTU/hr</label>';
    h += '<div id="htHeatTotalBTU" style="background:#ffffff;color:#f97316;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:7px;font-size:12px;font-weight:800;text-align:center;">--</div></div>';
    h += '</div></div>';

    // ============================================================
    // SECTION 11: DEFROST CYCLE MONITOR (NEW)
    // ============================================================
    h += '<div id="htHeatDefrostSection" style="background:rgba(34,211,238,0.06);border:1px solid rgba(34,211,238,0.18);border-radius:12px;padding:12px;margin-bottom:10px;' + (_isWaterType ? 'display:none;' : '') + '">';
    h += '<div style="font-size:13px;font-weight:800;color:#22d3ee;margin-bottom:8px;border-left:3px solid #22d3ee;padding-left:6px;">DEFROST CYCLE MONITOR</div>';
    // Status selector
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
    var defStates = [
      ['none', '\u2705', 'No Defrost'],
      ['active', '\u2744\uFE0F', 'Defrost Active'],
      ['post', '\uD83D\uDD04', 'Post-Defrost']
    ];
    for (var dfi = 0; dfi < defStates.length; dfi++) {
      var df = defStates[dfi];
      var dfSel = df[0] === _defrostStatus
        ? 'background:rgba(34,211,238,0.25);border-color:#22d3ee;color:#22d3ee;'
        : 'background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.1);color:#111111;';
      h += '<button id="htHeatDef_' + df[0] + '" onclick="_htHeatSetDefrost(\'' + df[0] + '\')" style="padding:7px 4px;border:1.5px solid;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;text-align:center;' + dfSel + '">' + df[1] + ' ' + df[2] + '</button>';
    }
    h += '</div>';
    // Defrost fields
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    h += '<div><label style="font-size:12px;color:#22d3ee;font-weight:600;display:block;margin-bottom:2px;">Defrost Interval (min)</label>';
    h += '<input id="htHeatDefrostInterval" type="number" step="1" placeholder="30-90" oninput="_htHeatUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:12px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;"></div>';
    h += '<div><label style="font-size:12px;color:#22d3ee;font-weight:600;display:block;margin-bottom:2px;">Defrost Duration (min)</label>';
    h += '<input id="htHeatDefrostDuration" type="number" step="0.5" placeholder="2-10" oninput="_htHeatUpdate()" style="width:100%;background:#FFFFFF;color:#111111;border:1px solid rgba(0,0,0,0.12);border-radius:6px;padding:7px;font-size:12px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;"></div>';
    h += '</div>';
    // Visual frost indicator
    h += '<div id="htHeatFrostIndicator" style="margin-top:8px;text-align:center;padding:6px;border-radius:8px;font-size:13px;font-weight:700;' + (_defrostStatus === 'active' ? 'background:rgba(34,211,238,0.15);color:#22d3ee;' : 'background:rgba(0,0,0,0.02);color:#111111;') + '">';
    h += _defrostStatus === 'active' ? '\u2744\uFE0F DEFROST CYCLE ACTIVE \u2014 Reversing valve energized to cooling mode' : (_defrostStatus === 'post' ? '\uD83D\uDD04 POST-DEFROST \u2014 System returning to heating mode' : 'Outdoor coil operating normally');
    h += '</div></div>';

    // ============================================================
    // SECTION 12: SC680 ELECTRICAL DATA
    // ============================================================
    h += '<div id="htHeatElecSection" style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.18);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    h += '<div style="font-size:13px;font-weight:800;color:#34d399;letter-spacing:0.5px;border-left:3px solid #34d399;padding-left:6px;">SC680 ELECTRICAL</div>';
    h += '<div id="htHeatElecStatus" style="font-size:12px;color:#111111;font-weight:600;">Esperando SC680...</div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    var elecFields = [
      ['htHeatVoltage', 'Voltage (V)',  '230',  '#fbbf24'],
      ['htHeatAmps',    'Amps (A)',     '--',   '#60a5fa'],
      ['htHeatWatts',   'Watts',        '--',   '#f97316'],
      ['htHeatCapuF',   'Cap (\u00B5F)','--',   '#c084fc'],
      ['htHeatOhms',    'Ohms (\u03A9)','--',   '#34d399'],
      ['htHeatTempF',   'Temp (\u00B0F)','--',  '#fb923c']
    ];
    for (var ei = 0; ei < elecFields.length; ei++) {
      var ef = elecFields[ei];
      h += '<div><label style="font-size:12px;color:' + ef[3] + ';font-weight:700;display:block;margin-bottom:2px;">' + ef[1] + '</label>';
      h += '<input id="' + ef[0] + '" type="number" step="0.1" placeholder="' + ef[2] + '" readonly style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:6px;font-size:12px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;"></div>';
    }
    h += '</div></div>';

    // ============================================================
    // SECTION 13: COP / EFFICIENCY CALCULATOR (NEW)
    // ============================================================
    h += '<div id="htHeatCOPSection" style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px;">COP / EFFICIENCY</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:8px;border:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;">COP</div>';
    h += '<div id="htHeatCOP" style="font-size:20px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div style="font-size:6px;color:#111111;">Coefficient of Performance</div></div>';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:8px;border:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;">HSPF (est.)</div>';
    h += '<div id="htHeatHSPF" style="font-size:20px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div style="font-size:6px;color:#111111;">Heating Seasonal PF</div></div>';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:8px;border:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;">BALANCE PT</div>';
    h += '<div id="htHeatBalancePoint" style="font-size:20px;font-weight:900;color:#111111;font-family:monospace;margin:2px 0;">--</div>';
    h += '<div style="font-size:6px;color:#111111;">Outdoor \u00B0F</div></div>';
    h += '</div></div>';

    // ============================================================
    // SECTION 14: COMPREHENSIVE AIR ANALYSIS
    // ============================================================
    h += '<div id="htHeatAirAnalysis" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.18);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<span style="font-size:13px;font-weight:900;color:#f97316;letter-spacing:0.5px;border-left:3px solid #f97316;padding-left:6px;">AN\u00C1LISIS DE AIRE COMPLETO</span></div>';
    h += '<div id="htHeatAirStatus" style="font-size:12px;color:#111111;font-weight:600;">Manual / BLE</div>';
    h += '</div>';
    // Column headers — for heating, Leaving should be warmer
    h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:4px;margin-bottom:6px;">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;text-align:center;"></div>';
    h += '<div style="font-size:12px;color:#3b82f6;font-weight:800;text-align:center;letter-spacing:0.5px;">ENTERING (Return)</div>';
    h += '<div style="font-size:12px;color:#f97316;font-weight:800;text-align:center;letter-spacing:0.5px;">LEAVING (Supply)</div>';
    h += '</div>';
    var airRows = [
      ['Dry Bulb (\u00B0F)',     'htHeatAirEnterDB', 'htHeatAirLeaveDB', '#34d399'],
      ['Wet Bulb (\u00B0F)',     'htHeatAirEnterWB', 'htHeatAirLeaveWB', '#22d3ee'],
      ['Dew Point (\u00B0F)',    'htHeatAirEnterDP', 'htHeatAirLeaveDP', '#a78bfa'],
      ['RH %',                    'htHeatAirEnterRH', 'htHeatAirLeaveRH', '#60a5fa'],
      ['Enthalpy (BTU/lb)',      'htHeatAirEnterH',  'htHeatAirLeaveH',  '#c084fc'],
      ['Pressure (inWC)',        'htHeatAirEnterWC', 'htHeatAirLeaveWC', '#fbbf24']
    ];
    h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:4px;">';
    for (var ai = 0; ai < airRows.length; ai++) {
      var ar = airRows[ai];
      h += '<div style="font-size:12px;color:' + ar[3] + ';font-weight:700;display:flex;align-items:center;padding-left:4px;">' + ar[0] + '</div>';
      h += '<input id="' + ar[1] + '" type="number" step="0.01" placeholder="--" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:5px;font-size:13px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;" oninput="_htHeatAirCalc()">';
      h += '<input id="' + ar[2] + '" type="number" step="0.01" placeholder="--" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.05);border-radius:6px;padding:5px;font-size:13px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;" oninput="_htHeatAirCalc()">';
    }
    h += '</div>';
    // Totals row
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px;border:1px solid rgba(249,115,22,0.15);">';
    h += '<div style="font-size:12px;color:#f97316;font-weight:700;letter-spacing:0.3px;">CALOR ENTREGADO (BTU/lb)</div>';
    h += '<div id="htHeatTotalEnthalpy" style="font-size:16px;font-weight:900;color:#f97316;font-family:monospace;">--</div>';
    h += '<div style="font-size:6px;color:#111111;">Leaving H \u2212 Entering H</div></div>';
    h += '<div style="text-align:center;background:#ffffff;border-radius:8px;padding:6px;border:1px solid rgba(251,191,36,0.15);">';
    h += '<div style="font-size:12px;color:#fbbf24;font-weight:700;letter-spacing:0.3px;">TOTAL ESP (inWC)</div>';
    h += '<div id="htHeatTotalESP" style="font-size:16px;font-weight:900;color:#fbbf24;font-family:monospace;">--</div>';
    h += '<div style="font-size:6px;color:#111111;">|Supply| + |Return|</div></div>';
    h += '</div></div>';

    // ============================================================
    // SECTION 15: CARBON MONOXIDE & COMBUSTION ANALYSIS
    // ============================================================
    h += '<div id="htHeatCOSection" style="background:rgba(239,68,68,0.08);border:1.5px solid rgba(239,68,68,0.25);border-radius:12px;padding:12px;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    h += '<div style="display:flex;align-items:center;gap:6px;">';
    h += '<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,rgba(239,68,68,0.3),rgba(220,38,38,0.15));display:flex;align-items:center;justify-content:center;font-size:14px;">\u26A0\uFE0F</div>';
    h += '<div><div style="font-size:13px;font-weight:900;color:#f87171;letter-spacing:0.5px;">MON\u00D3XIDO DE CARBONO (CO)</div>';
    h += '<div style="font-size:12px;color:#111111;font-weight:600;">Combustion Safety Analysis</div></div></div>';
    h += '<div id="htHeatCOStatus" style="font-size:12px;padding:3px 8px;border-radius:6px;font-weight:700;background:rgba(100,116,139,0.15);color:#111111;">SIN DATOS</div>';
    h += '</div>';

    // CO Ambient Readings
    h += '<div style="font-size:12px;font-weight:700;color:#f87171;margin-bottom:5px;letter-spacing:0.3px;border-left:2px solid #ef4444;padding-left:5px;">LECTURAS DE CO (ppm)</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:5px;margin-bottom:8px;">';
    var coFields = [
      ['htHeatCOAmbient',  'Ambiente',      '0',   '#fbbf24', 'Nivel en \u00E1rea de trabajo'],
      ['htHeatCOFlue',     'Flue/Chimney',  '0',   '#f87171', 'Gases de combusti\u00F3n'],
      ['htHeatCOSupply',   'Supply Air',    '0',   '#fb923c', 'Aire de suministro'],
      ['htHeatCOReturn',   'Return Air',    '0',   '#60a5fa', 'Aire de retorno']
    ];
    for (var ci = 0; ci < coFields.length; ci++) {
      var cf = coFields[ci];
      h += '<div>';
      h += '<label style="font-size:12px;color:' + cf[3] + ';font-weight:700;display:block;margin-bottom:2px;">' + cf[1] + '</label>';
      h += '<input id="' + cf[0] + '" type="number" step="1" placeholder="' + cf[2] + '" oninput="_htHeatCOUpdate()" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(239,68,68,0.2);border-radius:6px;padding:6px;font-size:13px;font-weight:900;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;">';
      h += '<div style="font-size:6px;color:#111111;text-align:center;margin-top:1px;">' + cf[4] + '</div>';
      h += '</div>';
    }
    h += '</div>';

    // CO Action Level Indicator
    h += '<div id="htHeatCOLevel" style="padding:8px;border-radius:8px;margin-bottom:8px;text-align:center;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);">';
    h += '<div style="font-size:12px;color:#111111;font-weight:700;margin-bottom:3px;">NIVEL DE ACCI\u00D3N CO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:3px;font-size:12px;">';
    h += '<div style="padding:4px;border-radius:4px;background:rgba(34,197,94,0.15);color:#34d399;font-weight:700;">0-9 ppm<div style="font-size:6px;opacity:0.7;">Normal</div></div>';
    h += '<div style="padding:4px;border-radius:4px;background:rgba(251,191,36,0.15);color:#fbbf24;font-weight:700;">9-35 ppm<div style="font-size:6px;opacity:0.7;">Precauci\u00F3n</div></div>';
    h += '<div style="padding:4px;border-radius:4px;background:rgba(249,115,22,0.15);color:#fb923c;font-weight:700;">35-100 ppm<div style="font-size:6px;opacity:0.7;">Peligro</div></div>';
    h += '<div style="padding:4px;border-radius:4px;background:rgba(239,68,68,0.15);color:#f87171;font-weight:700;">100+ ppm<div style="font-size:6px;opacity:0.7;">EVACUAR</div></div>';
    h += '</div></div>';

    // Combustion Analysis
    h += '<div style="font-size:12px;font-weight:700;color:#fb923c;margin-bottom:5px;margin-top:10px;letter-spacing:0.3px;border-left:2px solid #f97316;padding-left:5px;">AN\u00C1LISIS DE COMBUSTI\u00D3N</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:8px;">';
    var combFields = [
      ['htHeatCombO2',       'O\u2082 %',          '--', '#60a5fa', 'Normal: 4-9%'],
      ['htHeatCombCO2',      'CO\u2082 %',         '--', '#c084fc', 'NG: 8-10% / LP: 10-12%'],
      ['htHeatCombExcessAir','Exceso de Aire %',  '--', '#fbbf24', 'Normal: 15-50%'],
      ['htHeatCombStackT',   'Stack Temp (\u00B0F)','--','#f87171', 'Normal: 300-500\u00B0F'],
      ['htHeatCombEffic',    'Eficiencia %',      '--', '#34d399', 'Comb. efficiency'],
      ['htHeatCombCOAdj',    'CO Air-Free (ppm)', '--', '#ef4444', 'Max: 100 ppm AF']
    ];
    for (var cbi = 0; cbi < combFields.length; cbi++) {
      var cb = combFields[cbi];
      h += '<div>';
      h += '<label style="font-size:12px;color:' + cb[3] + ';font-weight:700;display:block;margin-bottom:2px;">' + cb[1] + '</label>';
      h += '<input id="' + cb[0] + '" type="number" step="0.1" placeholder="' + cb[2] + '" oninput="_htHeatCOUpdate()" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(0,0,0,0.1);border-radius:6px;padding:6px;font-size:12px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;">';
      h += '<div style="font-size:6px;color:#111111;text-align:center;margin-top:1px;">' + cb[4] + '</div>';
      h += '</div>';
    }
    h += '</div>';

    // Draft Measurement
    h += '<div style="font-size:12px;font-weight:700;color:#22d3ee;margin-bottom:5px;margin-top:6px;letter-spacing:0.3px;border-left:2px solid #22d3ee;padding-left:5px;">DRAFT / TIRO</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:8px;">';
    h += '<div><label style="font-size:12px;color:#22d3ee;font-weight:700;display:block;margin-bottom:2px;">Draft (" WC)</label>';
    h += '<input id="htHeatDraft" type="number" step="0.01" placeholder="-0.02" oninput="_htHeatCOUpdate()" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(34,211,238,0.2);border-radius:6px;padding:6px;font-size:12px;font-weight:800;text-align:center;outline:none;box-sizing:border-box;font-family:monospace;">';
    h += '<div style="font-size:6px;color:#111111;text-align:center;margin-top:1px;">Neg = natural draft OK</div></div>';
    h += '<div><label style="font-size:12px;color:#22d3ee;font-weight:700;display:block;margin-bottom:2px;">Gas Type</label>';
    h += '<select id="htHeatGasType" onchange="_htHeatCOUpdate()" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(34,211,238,0.2);border-radius:6px;padding:6px;font-size:13px;font-weight:700;outline:none;box-sizing:border-box;">';
    h += '<option value="ng">Natural Gas</option><option value="lp">LP/Propano</option></select>';
    h += '<div style="font-size:6px;color:#111111;text-align:center;margin-top:1px;">Tipo de combustible</div></div>';
    h += '<div><label style="font-size:12px;color:#22d3ee;font-weight:700;display:block;margin-bottom:2px;">Heat Exchanger</label>';
    h += '<select id="htHeatHXType" onchange="_htHeatCOUpdate()" style="width:100%;background:#ffffff;color:#111111;border:1px solid rgba(34,211,238,0.2);border-radius:6px;padding:6px;font-size:13px;font-weight:700;outline:none;box-sizing:border-box;">';
    h += '<option value="conventional">Convencional</option><option value="condensing">Condensing (90%+)</option><option value="boiler">Boiler</option></select>';
    h += '<div style="font-size:6px;color:#111111;text-align:center;margin-top:1px;">Tipo de equipo</div></div>';
    h += '</div>';

    // CO Diagnostics area
    h += '<div id="htHeatCODiag" style="margin-top:8px;"></div>';
    h += '</div>';

    // ============================================================
    // SECTION 15B: ANALYSIS DASHBOARD (9 stat boxes)
    // ============================================================
    h += '<div id="htHeatAnalysis" style="margin-bottom:10px;"></div>';

    // ============================================================
    // SECTION 16: REAL-TIME DIAGNOSTICS
    // ============================================================
    h += '<div id="htHeatDiag" style="margin-bottom:10px;"></div>';

    // ============================================================
    // SECTION 17: IA DEEP ANALYSIS BUTTON
    // ============================================================
    h += '<button id="htHeatIABtn" onclick="_htHeatIADiagnose()" style="width:100%;padding:14px;background:linear-gradient(135deg,#f97316,#ea580c);border:none;color:#fff;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:8px;">Diagn\u00F3stico Profundo con IA \u2014 Calefacci\u00F3n</button>';
    h += '<div id="htHeatIA" style="margin-bottom:10px;"></div>';

    // ============================================================
    // SECTION 18: REPORT GENERATION BUTTONS
    // ============================================================
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';

    // System Performance Report button
    h += '<button onclick="_htHeatGenReport(\'system\')" style="padding:14px 8px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(34,197,94,0.08));border:1.5px solid rgba(59,130,246,0.3);color:#111111;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;text-align:center;">';
    h += '<div style="font-size:18px;margin-bottom:4px;">\uD83D\uDCCA</div>';
    h += 'Reporte System<br>Performance';
    h += '<div style="font-size:12px;color:#111111;margin-top:3px;">PDF completo del sistema</div>';
    h += '</button>';

    // CO Report button
    h += '<button onclick="_htHeatGenReport(\'co\')" style="padding:14px 8px;background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(251,191,36,0.08));border:1.5px solid rgba(239,68,68,0.3);color:#f87171;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;text-align:center;">';
    h += '<div style="font-size:18px;margin-bottom:4px;">\u26A0\uFE0F</div>';
    h += 'Reporte Mon\u00F3xido<br>de Carbono';
    h += '<div style="font-size:12px;color:#111111;margin-top:3px;">CO Safety Report</div>';
    h += '</button>';

    h += '</div>';

    // Share/Print bar for reports
    h += '<div id="htHeatReportBar" style="margin-bottom:10px;"></div>';

    // ============================================================
    // SECTION 19: REFERENCE TABLE
    // ============================================================
    h += '<div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);border-radius:12px;padding:12px;">';
    h += '<div style="font-size:13px;font-weight:700;color:#f97316;margin-bottom:6px;border-left:3px solid #f97316;padding-left:6px;">Rangos Normales por Sistema (Heating Mode)</div>';
    var norms = [
      ['Mini Split HP',  'SH: 4-10\u00B0F',  'SC: 4-10\u00B0F',  'CS: 15-20\u00B0F', '\u0394T: 15-25\u00B0F'],
      ['Heat Pump',      'SH: 8-14\u00B0F',  'SC: 8-14\u00B0F',  'CS: 15-25\u00B0F', '\u0394T: 15-25\u00B0F'],
      ['VRF',            'SH: 4-8\u00B0F',   'SC: 4-8\u00B0F',   'CS: 10-18\u00B0F', '\u0394T: 15-25\u00B0F'],
      ['Central HP',     'SH: 8-14\u00B0F',  'SC: 8-14\u00B0F',  'CS: 15-25\u00B0F', '\u0394T: 15-25\u00B0F'],
      ['Package HP',     'SH: 8-14\u00B0F',  'SC: 8-14\u00B0F',  'CS: 15-25\u00B0F', '\u0394T: 15-25\u00B0F'],
      ['Water Heater',   'Rise: 40-70\u00B0F','Gas: 3.5" WC',     'Flue: 300-500\u00B0F', '--'],
      ['Water HP',       'COP: 2.5-4.0',     'Rise: 40-70\u00B0F','--',                '--']
    ];
    h += '<div style="font-size:12px;color:#111111;margin-bottom:4px;">SH=Superheat, SC=Subcooling, CS=Condenser Split, \u0394T=Delta-T (Supply-Return)</div>';
    for (var ni = 0; ni < norms.length; ni++) {
      var n = norms[ni];
      h += '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 0.8fr;gap:3px;padding:4px;background:rgba(0,0,0,0.02);border-radius:5px;font-size:12px;margin-bottom:2px;">';
      h += '<div style="color:#111111;font-weight:600;">' + n[0] + '</div>';
      h += '<div style="color:#fb923c;">' + n[1] + '</div>';
      h += '<div style="color:#38bdf8;">' + n[2] + '</div>';
      h += '<div style="color:#111111;">' + n[3] + '</div>';
      h += '<div style="color:#34d399;">' + n[4] + '</div>';
      h += '</div>';
    }
    h += '</div>';

    h += '</div></div>'; // close padding div + root div

    s.innerHTML = h;

    // Post-render setup
    window._htHeatSysType = _sysType;
    window._htHeatMeteringDevice = _meteringDevice;

    // Auto-fill outdoor temp from GPS weather
    if (_wxReady) {
      var oEl = document.getElementById('htHeatOutdoorT');
      if (oEl && !oEl.value) {
        oEl.value = _wx.tempF.toFixed(1);
        oEl.style.boxShadow = '0 0 6px rgba(249,115,22,0.4)';
        oEl.style.borderColor = 'rgba(249,115,22,0.3)';
      }
      var aEl = document.getElementById('htHeatAmbientT');
      if (aEl && !aEl.value) {
        aEl.value = _wx.tempF.toFixed(1);
        aEl.style.boxShadow = '0 0 6px rgba(249,115,22,0.4)';
        aEl.style.borderColor = 'rgba(249,115,22,0.3)';
      }
    }

    // Add BLE pulse animation if not exists
    if (!document.getElementById('htHeatSpinStyle')) {
      var stEl = document.createElement('style');
      stEl.id = 'htHeatSpinStyle';
      stEl.textContent = '@keyframes htHeatPulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes htHeatSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(stEl);
    }

    // Trigger initial calculation
    setTimeout(function() { _htHeatUpdate(); }, 100);
  }
  window._htShowHeating = _htShowHeating;

  // ============================
  // REVERSING VALVE INFO TEXT
  // ============================
  function _getRVInfoText(status) {
    switch (status) {
      case 'heating':
        return '\uD83D\uDD25 Heating Mode \u2014 Most units: reversing valve DE-ENERGIZED in heating. Indoor coil = condenser, outdoor coil = evaporator. High-side pressure indoors.';
      case 'cooling':
        return '\u2744\uFE0F Cooling Mode \u2014 Reversing valve ENERGIZED. Normal A/C operation. Indoor coil = evaporator, outdoor coil = condenser.';
      case 'defrost':
        return '\uD83C\uDF28\uFE0F Defrost Mode \u2014 Reversing valve switches to cooling temporarily. Hot gas flows to outdoor coil to melt ice. Indoor fan typically OFF during defrost.';
      default:
        return '';
    }
  }

  // ============================
  // SYSTEM TYPE CHANGE
  // ============================
  window._htHeatSetSys = function(type) {
    _sysType = type;
    window._htHeatSysType = type;
    _isWaterType = (type === 'waterht' || type === 'waterhp');

    var types = ['minihp','hp','vrf','centralhp','pkghp','waterht','waterhp'];
    for (var i = 0; i < types.length; i++) {
      var btn = document.getElementById('htHeatSys_' + types[i]);
      if (btn) {
        if (types[i] === type) {
          btn.style.background = 'rgba(249,115,22,0.25)';
          btn.style.borderColor = '#f97316';
          btn.style.color = '#fb923c';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#6b7280';
        }
      }
    }

    // Toggle section visibility based on water type
    var hideForWater = ['htHeatRefSection','htHeatMDSection','htHeatRVSection','htHeatPressSection','htHeatSHSCSection','htHeatAuxSection','htHeatDefrostSection'];
    // For waterhp, we still show refrigerant + pressure sections
    var showForWaterHP = ['htHeatRefSection','htHeatPressSection','htHeatSHSCSection'];

    for (var si = 0; si < hideForWater.length; si++) {
      var secEl = document.getElementById(hideForWater[si]);
      if (secEl) {
        if (_isWaterType && type === 'waterht') {
          secEl.style.display = 'none';
        } else if (_isWaterType && type === 'waterhp' && showForWaterHP.indexOf(hideForWater[si]) >= 0) {
          secEl.style.display = '';
        } else if (_isWaterType && type === 'waterhp') {
          secEl.style.display = 'none';
        } else {
          secEl.style.display = '';
        }
      }
    }

    // Toggle field temp sections
    var hpFields = document.getElementById('htHeatFieldTempsHP');
    var waterFields = document.getElementById('htHeatFieldTempsWater');
    if (hpFields) hpFields.style.display = _isWaterType ? 'none' : '';
    if (waterFields) waterFields.style.display = _isWaterType ? '' : 'none';

    _htHeatUpdate();
  };

  // ============================
  // SAVE EQUIPMENT / CLIENT / TECH INFO
  // ============================
  window._htHeatSaveEquip = function() {
    var eq = window._htHeatEquip;
    if (!eq) return;
    var m = document.getElementById('htHeatEqModel');
    var s = document.getElementById('htHeatEqSerial');
    var c = document.getElementById('htHeatEqClient');
    var a = document.getElementById('htHeatEqAddr');
    var t = document.getElementById('htHeatEqTech');
    var tn = document.getElementById('htHeatEqTechNum');
    if (m) eq.model = m.value;
    if (s) eq.serial = s.value;
    if (c) eq.clientName = c.value;
    if (a) eq.clientAddr = a.value;
    if (t) eq.techName = t.value;
    if (tn) eq.techNum = tn.value;
  };

  // ============================
  // METERING DEVICE CHANGE
  // ============================
  window._htHeatSetMD = function(md) {
    _meteringDevice = md;
    window._htHeatMeteringDevice = md;
    var types = ['txv','piston','cap','eev'];
    for (var i = 0; i < types.length; i++) {
      var btn = document.getElementById('htHeatMD_' + types[i]);
      if (btn) {
        if (types[i] === md) {
          btn.style.background = 'rgba(52,211,153,0.2)';
          btn.style.borderColor = '#34d399';
          btn.style.color = '#34d399';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#6b7280';
        }
      }
    }
    var info = document.getElementById('htHeatMDInfo');
    var msgs = {
      txv: 'In heating mode, outdoor coil is EVAPORATOR. TXV: SH 8-12\u00B0F, SC for charge verification.',
      piston: 'Pist\u00F3n/Orificio: SH 10-20\u00B0F (varies with conditions), SC 5-10\u00B0F. Fixed metering.',
      cap: 'Cap Tube: SH 10-20\u00B0F, SC 5-10\u00B0F. Critical fixed charge. Common in small systems.',
      eev: 'EEV: SH 5-8\u00B0F (precise electronic control), SC 8-14\u00B0F. Common in VRF and inverters.'
    };
    if (info) info.textContent = msgs[md] || '';
    _htHeatUpdate();
  };

  // ============================
  // REVERSING VALVE CHANGE
  // ============================
  window._htHeatSetRV = function(status) {
    _rvStatus = status;
    var states = ['heating','cooling','defrost'];
    for (var i = 0; i < states.length; i++) {
      var btn = document.getElementById('htHeatRV_' + states[i]);
      if (btn) {
        if (states[i] === status) {
          btn.style.background = 'rgba(249,115,22,0.25)';
          btn.style.borderColor = '#f97316';
          btn.style.color = '#fb923c';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#6b7280';
        }
      }
    }
    var rvInfo = document.getElementById('htHeatRVInfo');
    if (rvInfo) rvInfo.innerHTML = _getRVInfoText(status);

    // Update frost indicator
    var frostEl = document.getElementById('htHeatFrostIndicator');
    if (frostEl) {
      if (status === 'defrost') {
        frostEl.style.background = 'rgba(34,211,238,0.15)';
        frostEl.style.color = '#22d3ee';
        frostEl.textContent = '\u2744\uFE0F DEFROST CYCLE ACTIVE \u2014 Reversing valve energized to cooling mode';
      } else if (status === 'cooling') {
        frostEl.style.background = 'rgba(56,189,248,0.1)';
        frostEl.style.color = '#38bdf8';
        frostEl.textContent = '\u2744\uFE0F Cooling mode selected \u2014 Normal A/C operation';
      } else {
        frostEl.style.background = 'rgba(0,0,0,0.02)';
        frostEl.style.color = '#57574F';
        frostEl.textContent = 'Outdoor coil operating normally in heating mode';
      }
    }
    _htHeatUpdate();
  };

  // ============================
  // AUXILIARY HEAT CHANGE
  // ============================
  window._htHeatSetAux = function(mode) {
    _auxHeat = mode;
    var states = ['off','on','emergency'];
    for (var i = 0; i < states.length; i++) {
      var btn = document.getElementById('htHeatAux_' + states[i]);
      if (btn) {
        if (states[i] === mode) {
          btn.style.background = 'rgba(239,68,68,0.25)';
          btn.style.borderColor = '#ef4444';
          btn.style.color = '#f87171';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#6b7280';
        }
      }
    }
    var auxFields = document.getElementById('htHeatAuxFields');
    if (auxFields) auxFields.style.display = mode === 'off' ? 'none' : 'grid';
    _htHeatUpdate();
  };

  // ============================
  // DEFROST STATUS CHANGE
  // ============================
  window._htHeatSetDefrost = function(status) {
    _defrostStatus = status;
    var states = ['none','active','post'];
    for (var i = 0; i < states.length; i++) {
      var btn = document.getElementById('htHeatDef_' + states[i]);
      if (btn) {
        if (states[i] === status) {
          btn.style.background = 'rgba(34,211,238,0.25)';
          btn.style.borderColor = '#22d3ee';
          btn.style.color = '#22d3ee';
        } else {
          btn.style.background = 'rgba(0,0,0,0.03)';
          btn.style.borderColor = 'rgba(0,0,0,0.1)';
          btn.style.color = '#6b7280';
        }
      }
    }
    var frostEl = document.getElementById('htHeatFrostIndicator');
    if (frostEl) {
      if (status === 'active') {
        frostEl.style.background = 'rgba(34,211,238,0.15)';
        frostEl.style.color = '#22d3ee';
        frostEl.innerHTML = '\u2744\uFE0F DEFROST CYCLE ACTIVE \u2014 Reversing valve energized to cooling mode';
      } else if (status === 'post') {
        frostEl.style.background = 'rgba(249,115,22,0.1)';
        frostEl.style.color = '#fb923c';
        frostEl.innerHTML = '\uD83D\uDD04 POST-DEFROST \u2014 System returning to heating mode';
      } else {
        frostEl.style.background = 'rgba(0,0,0,0.02)';
        frostEl.style.color = '#57574F';
        frostEl.innerHTML = 'Outdoor coil operating normally';
      }
    }
    _htHeatUpdate();
  };

  // ============================
  // PRESSURE SLIDER / INPUT SYNC
  // ============================
  window._htHeatSyncSlider = function(side) {
    var slider = document.getElementById(side === 'lo' ? 'htHeatLoPsi' : 'htHeatHiPsi');
    var input = document.getElementById(side === 'lo' ? 'htHeatLoInput' : 'htHeatHiInput');
    if (slider && input) input.value = slider.value;
    _htHeatUpdate();
  };

  window._htHeatSyncInput = function(side) {
    var slider = document.getElementById(side === 'lo' ? 'htHeatLoPsi' : 'htHeatHiPsi');
    var input = document.getElementById(side === 'lo' ? 'htHeatLoInput' : 'htHeatHiInput');
    if (slider && input) slider.value = input.value;
    _htHeatUpdate();
  };

  // ============================
  // AIR ANALYSIS CALCULATOR
  // ============================
  window._htHeatAirCalc = function() {
    var enterDB = parseFloat((document.getElementById('htHeatAirEnterDB') || {}).value || '');
    var enterWB = parseFloat((document.getElementById('htHeatAirEnterWB') || {}).value || '');
    var enterRH = parseFloat((document.getElementById('htHeatAirEnterRH') || {}).value || '');
    var enterDP = parseFloat((document.getElementById('htHeatAirEnterDP') || {}).value || '');
    var leaveDB = parseFloat((document.getElementById('htHeatAirLeaveDB') || {}).value || '');
    var leaveWB = parseFloat((document.getElementById('htHeatAirLeaveWB') || {}).value || '');
    var leaveRH = parseFloat((document.getElementById('htHeatAirLeaveRH') || {}).value || '');
    var leaveDP = parseFloat((document.getElementById('htHeatAirLeaveDP') || {}).value || '');
    var enterWC = parseFloat((document.getElementById('htHeatAirEnterWC') || {}).value || '');
    var leaveWC = parseFloat((document.getElementById('htHeatAirLeaveWC') || {}).value || '');

    // If we have DB+WB but no RH, estimate RH
    if (!isNaN(enterDB) && !isNaN(enterWB) && isNaN(enterRH)) {
      enterRH = _rhFromWB(enterDB, enterWB);
      var el = document.getElementById('htHeatAirEnterRH');
      if (el && enterRH !== null) { el.value = enterRH.toFixed(1); el.style.color = '#6b7280'; }
    }
    if (!isNaN(leaveDB) && !isNaN(leaveWB) && isNaN(leaveRH)) {
      leaveRH = _rhFromWB(leaveDB, leaveWB);
      var el2 = document.getElementById('htHeatAirLeaveRH');
      if (el2 && leaveRH !== null) { el2.value = leaveRH.toFixed(1); el2.style.color = '#6b7280'; }
    }
    // If we have DB+RH but no DP, calculate dew point
    if (!isNaN(enterDB) && !isNaN(enterRH) && isNaN(enterDP)) {
      enterDP = _dpFromRH(enterDB, enterRH);
      var dpEl = document.getElementById('htHeatAirEnterDP');
      if (dpEl && enterDP !== null) { dpEl.value = enterDP.toFixed(1); dpEl.style.color = '#6b7280'; }
    }
    if (!isNaN(leaveDB) && !isNaN(leaveRH) && isNaN(leaveDP)) {
      leaveDP = _dpFromRH(leaveDB, leaveRH);
      var dpEl2 = document.getElementById('htHeatAirLeaveDP');
      if (dpEl2 && leaveDP !== null) { dpEl2.value = leaveDP.toFixed(1); dpEl2.style.color = '#6b7280'; }
    }

    // Calculate enthalpy
    var hEnter = _calcEnthalpy(enterDB, enterRH);
    var hLeave = _calcEnthalpy(leaveDB, leaveRH);
    var hEnterEl = document.getElementById('htHeatAirEnterH');
    var hLeaveEl = document.getElementById('htHeatAirLeaveH');
    if (hEnterEl && hEnter !== null) { hEnterEl.value = hEnter.toFixed(2); hEnterEl.style.color = '#c084fc'; }
    if (hLeaveEl && hLeave !== null) { hLeaveEl.value = hLeave.toFixed(2); hLeaveEl.style.color = '#c084fc'; }

    // Total Enthalpy for heating = Leaving - Entering (heating adds heat)
    var totalH = document.getElementById('htHeatTotalEnthalpy');
    if (totalH) {
      if (hEnter !== null && hLeave !== null) {
        var diff = hLeave - hEnter;
        totalH.textContent = diff.toFixed(2);
        totalH.style.color = diff > 0 ? '#4ade80' : '#f87171';
      } else {
        totalH.textContent = '--';
        totalH.style.color = '#f97316';
      }
    }
    // Total ESP
    var totalESP = document.getElementById('htHeatTotalESP');
    if (totalESP) {
      if (!isNaN(enterWC) && !isNaN(leaveWC)) {
        totalESP.textContent = (Math.abs(enterWC) + Math.abs(leaveWC)).toFixed(3);
      } else {
        totalESP.textContent = '--';
        totalESP.style.color = '#fbbf24';
      }
    }
  };

  // ============================
  // MASTER RECALCULATION
  // ============================
  function _htHeatUpdate() {
    // Determine if water type
    _isWaterType = (_sysType === 'waterht' || _sysType === 'waterhp');

    if (_isWaterType && _sysType === 'waterht') {
      _htHeatUpdateWater();
      return;
    }

    // Read pressures
    var refEl = document.getElementById('htHeatRef');
    if (!refEl) return;
    var refName = refEl.value;
    var loInput = document.getElementById('htHeatLoInput');
    var hiInput = document.getElementById('htHeatHiInput');
    var loPsi = loInput ? parseFloat(loInput.value) || 0 : 0;
    var hiPsi = hiInput ? parseFloat(hiInput.value) || 0 : 0;

    // Update LCD displays
    var loLCD = document.getElementById('htHeatLoLCD');
    var hiLCD = document.getElementById('htHeatHiLCD');
    if (loLCD) loLCD.textContent = loPsi.toFixed(1);
    if (hiLCD) hiLCD.textContent = hiPsi.toFixed(1);

    // Reverse PT lookup
    var evapSat = _htReversePT(refName, loPsi);
    var condSat = _htReversePT(refName, hiPsi);
    var loTempEl = document.getElementById('htHeatLoTemp');
    var hiTempEl = document.getElementById('htHeatHiTemp');
    if (loTempEl) loTempEl.textContent = evapSat !== null ? 'Sat: ' + evapSat.toFixed(1) + '\u00B0F' : 'Fuera de rango';
    if (hiTempEl) hiTempEl.textContent = condSat !== null ? 'Sat: ' + condSat.toFixed(1) + '\u00B0F' : 'Fuera de rango';

    // Read field temperatures
    var suctionT = _htHeatGetVal('htHeatSuctionT');
    var liquidT = _htHeatGetVal('htHeatLiquidT');
    var dischargeT = _htHeatGetVal('htHeatDischargeT');
    var outdoorT = _htHeatGetVal('htHeatOutdoorT');
    var indoorT = _htHeatGetVal('htHeatIndoorT');
    var supplyT = _htHeatGetVal('htHeatSupplyT');
    var defrostT = _htHeatGetVal('htHeatDefrostT');

    // Auto-calc Delta-T (for heating: supply - return, supply should be warmer)
    var deltaEl = document.getElementById('htHeatDeltaT');
    var dtVal = null;
    if (deltaEl) {
      if (supplyT !== null && indoorT !== null) {
        dtVal = supplyT - indoorT;
        deltaEl.textContent = dtVal.toFixed(1) + '\u00B0F';
        deltaEl.style.color = (dtVal >= 15 && dtVal <= 30) ? '#34d399' : (dtVal < 15 ? '#fbbf24' : '#f87171');
      } else {
        deltaEl.textContent = '--';
        deltaEl.style.color = '#6b7280';
      }
    }

    // Calculate core diagnostics
    var sh = null, sc = null, cr = null, condSplit = null, evapSplit = null, td = null;

    // In heating mode:
    // SH = Suction Line Temp - Evap Sat (outdoor evaporator)
    // SC = Cond Sat - Liquid Line Temp (indoor condenser)
    if (evapSat !== null && suctionT !== null) sh = suctionT - evapSat;
    if (condSat !== null && liquidT !== null) sc = condSat - liquidT;
    if (loPsi > 0) cr = (hiPsi + 14.696) / (loPsi + 14.696);

    // Condenser split in heating: Cond Sat - Indoor Return (indoor condenser)
    if (condSat !== null && indoorT !== null) condSplit = condSat - indoorT;

    // Evaporator split in heating: Outdoor Ambient - Evap Sat (outdoor evaporator)
    if (outdoorT !== null && evapSat !== null) evapSplit = outdoorT - evapSat;

    // Temperature difference (cond sat - evap sat)
    if (condSat !== null && evapSat !== null) td = condSat - evapSat;

    // ---- SH/SC LIVE DISPLAY ----
    var mdType = _meteringDevice || 'txv';
    var shR = MD_SH_RANGES[mdType] || [8,12];
    var scR = MD_SC_RANGES[mdType] || [8,14];

    // Override with system-specific ranges if available
    var sysRanges = HEAT_RANGES[_sysType];
    if (sysRanges && sysRanges.shMin !== undefined) {
      shR = [sysRanges.shMin, sysRanges.shMax];
      scR = [sysRanges.scMin, sysRanges.scMax];
    }

    var shLive = document.getElementById('htHeatSHLive');
    var scLive = document.getElementById('htHeatSCLive');
    var shRange = document.getElementById('htHeatSHRange');
    var scRange = document.getElementById('htHeatSCRange');

    if (shLive) {
      if (sh !== null) {
        shLive.textContent = sh.toFixed(1) + '\u00B0F';
        shLive.style.color = (sh >= shR[0] && sh <= shR[1]) ? '#34d399' : (sh < shR[0] - 3 || sh > shR[1] + 10) ? '#f87171' : '#fbbf24';
      } else {
        shLive.textContent = '--';
        shLive.style.color = '#57574F';
      }
    }
    if (scLive) {
      if (sc !== null) {
        scLive.textContent = sc.toFixed(1) + '\u00B0F';
        scLive.style.color = (sc >= scR[0] && sc <= scR[1]) ? '#34d399' : (sc < scR[0] - 2 || sc > scR[1] + 6) ? '#f87171' : '#fbbf24';
      } else {
        scLive.textContent = '--';
        scLive.style.color = '#57574F';
      }
    }
    if (shRange) shRange.textContent = _sysType.toUpperCase() + ' / ' + mdType.toUpperCase() + ': ' + shR[0] + '-' + shR[1] + '\u00B0F';
    if (scRange) scRange.textContent = _sysType.toUpperCase() + ' / ' + mdType.toUpperCase() + ': ' + scR[0] + '-' + scR[1] + '\u00B0F';

    // ---- AUX HEAT CALCULATIONS ----
    if (_auxHeat !== 'off') {
      var auxKW = _htHeatGetVal('htHeatAuxKW');
      var voltage = _htHeatGetVal('htHeatVoltage') || 230;
      var auxAmpsEl = document.getElementById('htHeatAuxAmps');
      var totalBTUEl = document.getElementById('htHeatTotalBTU');

      if (auxKW !== null && auxKW > 0) {
        var auxAmps = (auxKW * 1000) / voltage;
        var auxBTU = auxKW * 3412.14;
        if (auxAmpsEl) auxAmpsEl.textContent = auxAmps.toFixed(1) + ' A';
        if (totalBTUEl) totalBTUEl.textContent = Math.round(auxBTU).toLocaleString() + ' BTU/hr';
      } else {
        if (auxAmpsEl) auxAmpsEl.textContent = '--';
        if (totalBTUEl) totalBTUEl.textContent = '--';
      }
    }

    // ---- COP / EFFICIENCY CALCULATOR ----
    _htHeatCalcCOP(sh, sc, evapSat, condSat, outdoorT, indoorT, supplyT, dtVal, loPsi, hiPsi);

    // ---- Store calculated values globally ----
    window._htHeatCalcValues = {
      sh: sh, sc: sc, cr: cr, condSplit: condSplit, evapSplit: evapSplit, td: td,
      evapSat: evapSat, condSat: condSat, loPsi: loPsi, hiPsi: hiPsi,
      suctionT: suctionT, liquidT: liquidT, dischargeT: dischargeT,
      outdoorT: outdoorT, indoorT: indoorT, supplyT: supplyT,
      defrostT: defrostT, deltaT: dtVal,
      refrigerant: refName, meteringDevice: mdType,
      sysType: _sysType, rvStatus: _rvStatus, auxHeat: _auxHeat,
      defrostStatus: _defrostStatus
    };

    // ---- ANALYSIS DASHBOARD (9 stat boxes) ----
    var analysisEl = document.getElementById('htHeatAnalysis');
    if (analysisEl) {
      var ah = '<div style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:12px;">';
      ah += '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px;">AN\u00C1LISIS DEL SISTEMA \u2014 HEATING</div>';
      ah += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">';

      // Row 1: SH, SC, Compression Ratio
      var shLabel = 'SH (Evap)';
      var scLabel = 'SC (Cond)';
      ah += _htHeatStatBox(shLabel, sh, '\u00B0F',
        sh !== null ? (sh >= shR[0] && sh <= shR[1] ? '#34d399' : (sh < shR[0] - 3 || sh > shR[1] + 10 ? '#f87171' : '#fbbf24')) : '#57574F');
      ah += _htHeatStatBox(scLabel, sc, '\u00B0F',
        sc !== null ? (sc >= scR[0] && sc <= scR[1] ? '#34d399' : (sc < scR[0] - 2 || sc > scR[1] + 6 ? '#f87171' : '#fbbf24')) : '#57574F');
      var crColor = '#57574F';
      if (cr !== null) crColor = cr >= 2.0 && cr <= 3.5 ? '#34d399' : cr > 4.5 ? '#f87171' : '#fbbf24';
      ah += _htHeatStatBox('COMP. RATIO', cr !== null ? cr.toFixed(2) + ':1' : null, '', crColor);

      // Row 2: Condenser Split, Evaporator Split, TD
      var csNormMin = sysRanges ? sysRanges.csMin : 15;
      var csNormMax = sysRanges ? sysRanges.csMax : 25;
      ah += _htHeatStatBox('COND. SPLIT', condSplit, '\u00B0F',
        condSplit !== null ? (condSplit >= csNormMin && condSplit <= csNormMax ? '#34d399' : (condSplit > csNormMax + 10 ? '#f87171' : '#fbbf24')) : '#57574F');
      ah += _htHeatStatBox('EVAP. SPLIT', evapSplit, '\u00B0F',
        evapSplit !== null ? (evapSplit >= 15 && evapSplit <= 25 ? '#34d399' : (evapSplit > 35 || evapSplit < 10 ? '#f87171' : '#fbbf24')) : '#57574F');
      ah += _htHeatStatBox('TD', td, '\u00B0F',
        td !== null ? (td >= 30 && td <= 60 ? '#34d399' : '#fbbf24') : '#57574F');

      // Row 3: Evap Sat, Cond Sat, Delta-T
      ah += _htHeatStatBox('EVAP SAT', evapSat, '\u00B0F', '#60a5fa');
      ah += _htHeatStatBox('COND SAT', condSat, '\u00B0F', '#f87171');
      ah += _htHeatStatBox('DELTA-T', dtVal, '\u00B0F',
        dtVal !== null ? (dtVal >= 15 && dtVal <= 30 ? '#34d399' : '#fbbf24') : '#57574F');

      ah += '</div></div>';
      analysisEl.innerHTML = ah;
    }

    // ---- REAL-TIME DIAGNOSTICS ----
    var diagEl = document.getElementById('htHeatDiag');
    if (diagEl) {
      var diags = _htHeatDiagnoseSystem(
        _sysType, refName, loPsi, hiPsi, evapSat, condSat,
        sh, sc, cr, condSplit, evapSplit, outdoorT, indoorT, supplyT,
        dischargeT, defrostT, dtVal
      );
      if (diags.length > 0) {
        var dh = '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:12px;">';
        dh += '<div style="font-size:13px;font-weight:800;color:#fbbf24;margin-bottom:6px;border-left:3px solid #fbbf24;padding-left:6px;">DIAGN\u00D3STICO EN TIEMPO REAL \u2014 HEATING</div>';
        for (var di = 0; di < diags.length; di++) {
          var d = diags[di];
          var ic = d[0] === 'error' ? '#f87171' : d[0] === 'warn' ? '#fbbf24' : '#34d399';
          var sym = d[0] === 'error' ? '\u274C' : d[0] === 'warn' ? '\u26A0\uFE0F' : '\u2705';
          dh += '<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:5px;padding:6px;background:' + ic + '10;border-radius:6px;">';
          dh += '<span style="font-size:12px;flex-shrink:0;">' + sym + '</span>';
          dh += '<div><div style="font-size:13px;font-weight:700;color:' + ic + ';">' + d[1] + '</div>';
          dh += '<div style="font-size:12px;color:#111111;margin-top:1px;">' + d[2] + '</div></div></div>';
        }
        dh += '</div>';
        // PDF export bar
        dh += typeof window.hvacPdfBar === 'function' ? window.hvacPdfBar('heating') : '';
        diagEl.innerHTML = dh;
      } else {
        diagEl.innerHTML = '<div style="text-align:center;color:#111111;font-size:13px;padding:8px;">Ingrese presiones y temperaturas para diagn\u00F3stico de calefacci\u00F3n</div>';
      }
    }
  }
  window._htHeatUpdate = _htHeatUpdate;

  // ============================
  // WATER HEATER UPDATE
  // ============================
  function _htHeatUpdateWater() {
    var waterIn = _htHeatGetVal('htHeatWaterIn');
    var waterOut = _htHeatGetVal('htHeatWaterOut');
    var thermostat = _htHeatGetVal('htHeatThermostat');
    var flowGPM = _htHeatGetVal('htHeatFlowGPM');
    var gasPressure = _htHeatGetVal('htHeatGasPressure');
    var flueTempF = _htHeatGetVal('htHeatFlueTempF');
    var ambientT = _htHeatGetVal('htHeatAmbientT');

    // Auto-calc temperature rise
    var riseEl = document.getElementById('htHeatWaterRise');
    var rise = null;
    if (riseEl) {
      if (waterIn !== null && waterOut !== null) {
        rise = waterOut - waterIn;
        riseEl.textContent = rise.toFixed(1) + '\u00B0F';
        riseEl.style.color = (rise >= 40 && rise <= 70) ? '#34d399' : (rise < 40 ? '#fbbf24' : '#f87171');
      } else {
        riseEl.textContent = '--';
        riseEl.style.color = '#f97316';
      }
    }

    // Calculate BTU/hr: Q = flow(GPM) * 500 * deltaT
    var btuHr = null;
    if (flowGPM !== null && rise !== null && flowGPM > 0) {
      btuHr = flowGPM * 500 * rise;
    }

    // Calculate efficiency (approximate for gas)
    var efficiency = null;
    if (flueTempF !== null && ambientT !== null && flueTempF > ambientT) {
      // Rough efficiency: lower flue temp = higher efficiency
      // Typical: 300F flue = ~80%, 400F = ~75%, 500F = ~70%, 200F = ~90% (condensing)
      var flueRise = flueTempF - ambientT;
      efficiency = Math.max(50, Math.min(98, 95 - (flueRise - 100) * 0.08));
    }

    // Recovery rate (GPH) = BTU/hr / (8.33 * rise)
    var recoveryRate = null;
    if (btuHr !== null && rise !== null && rise > 0) {
      recoveryRate = btuHr / (8.33 * rise);
    }

    // Store water calc values
    window._htHeatCalcValues = {
      sysType: _sysType, waterIn: waterIn, waterOut: waterOut, rise: rise,
      thermostat: thermostat, flowGPM: flowGPM, gasPressure: gasPressure,
      flueTempF: flueTempF, ambientT: ambientT, btuHr: btuHr,
      efficiency: efficiency, recoveryRate: recoveryRate
    };

    // COP section for water heater
    var copEl = document.getElementById('htHeatCOP');
    var hspfEl = document.getElementById('htHeatHSPF');
    var bpEl = document.getElementById('htHeatBalancePoint');
    if (copEl) { copEl.textContent = '--'; copEl.style.color = '#57574F'; }
    if (hspfEl) {
      if (efficiency !== null) {
        hspfEl.textContent = efficiency.toFixed(0) + '%';
        hspfEl.style.color = efficiency >= 90 ? '#34d399' : efficiency >= 80 ? '#fbbf24' : '#f87171';
      } else {
        hspfEl.textContent = '--';
        hspfEl.style.color = '#57574F';
      }
    }
    if (bpEl) { bpEl.textContent = 'N/A'; bpEl.style.color = '#57574F'; }

    // ---- ANALYSIS DASHBOARD for water heater ----
    var analysisEl = document.getElementById('htHeatAnalysis');
    if (analysisEl) {
      var ah = '<div style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:12px;">';
      ah += '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:8px;border-left:3px solid #f97316;padding-left:6px;">AN\u00C1LISIS \u2014 WATER HEATER</div>';
      ah += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">';

      // Row 1
      ah += _htHeatStatBox('TEMP RISE', rise, '\u00B0F',
        rise !== null ? (rise >= 40 && rise <= 70 ? '#34d399' : '#fbbf24') : '#57574F');
      ah += _htHeatStatBox('FLOW RATE', flowGPM, ' GPM',
        flowGPM !== null ? (flowGPM >= 1 && flowGPM <= 5 ? '#34d399' : '#fbbf24') : '#57574F');
      ah += _htHeatStatBox('BTU/hr', btuHr !== null ? Math.round(btuHr).toLocaleString() : null, '',
        btuHr !== null ? '#f97316' : '#57574F');

      // Row 2
      ah += _htHeatStatBox('GAS PRESS.', gasPressure, '" WC',
        gasPressure !== null ? (gasPressure >= 3.0 && gasPressure <= 4.0 ? '#34d399' : (gasPressure >= 9 && gasPressure <= 11 ? '#34d399' : '#fbbf24')) : '#57574F');
      ah += _htHeatStatBox('FLUE TEMP', flueTempF, '\u00B0F',
        flueTempF !== null ? (flueTempF >= 300 && flueTempF <= 500 ? '#34d399' : (flueTempF < 200 ? '#60a5fa' : '#f87171')) : '#57574F');
      ah += _htHeatStatBox('EFFICIENCY', efficiency !== null ? efficiency.toFixed(0) + '%' : null, '',
        efficiency !== null ? (efficiency >= 90 ? '#34d399' : efficiency >= 80 ? '#fbbf24' : '#f87171') : '#57574F');

      // Row 3
      ah += _htHeatStatBox('RECOVERY', recoveryRate !== null ? recoveryRate.toFixed(1) + ' GPH' : null, '',
        recoveryRate !== null ? '#60a5fa' : '#57574F');
      ah += _htHeatStatBox('AMBIENT', ambientT, '\u00B0F', '#fb923c');
      ah += _htHeatStatBox('STATUS',
        _sysType === 'waterht' ? 'Gas/Elec' : 'HP',
        '', '#c084fc');

      ah += '</div></div>';
      analysisEl.innerHTML = ah;
    }

    // ---- DIAGNOSTICS for water heater ----
    var diagEl = document.getElementById('htHeatDiag');
    if (diagEl) {
      var diags = _htHeatDiagnoseWater(waterIn, waterOut, rise, thermostat, flowGPM, gasPressure, flueTempF, ambientT, btuHr, efficiency);
      if (diags.length > 0) {
        var dh = '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:12px;">';
        dh += '<div style="font-size:13px;font-weight:800;color:#fbbf24;margin-bottom:6px;border-left:3px solid #fbbf24;padding-left:6px;">DIAGN\u00D3STICO \u2014 WATER HEATER</div>';
        for (var di = 0; di < diags.length; di++) {
          var d = diags[di];
          var ic2 = d[0] === 'error' ? '#f87171' : d[0] === 'warn' ? '#fbbf24' : '#34d399';
          var sym2 = d[0] === 'error' ? '\u274C' : d[0] === 'warn' ? '\u26A0\uFE0F' : '\u2705';
          dh += '<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:5px;padding:6px;background:' + ic2 + '10;border-radius:6px;">';
          dh += '<span style="font-size:12px;flex-shrink:0;">' + sym2 + '</span>';
          dh += '<div><div style="font-size:13px;font-weight:700;color:' + ic2 + ';">' + d[1] + '</div>';
          dh += '<div style="font-size:12px;color:#111111;margin-top:1px;">' + d[2] + '</div></div></div>';
        }
        dh += '</div>';
        diagEl.innerHTML = dh;
      } else {
        diagEl.innerHTML = '<div style="text-align:center;color:#111111;font-size:13px;padding:8px;">Ingrese datos del water heater para diagn\u00F3stico</div>';
      }
    }
  }

  // ============================
  // COP / EFFICIENCY CALCULATOR
  // ============================
  function _htHeatCalcCOP(sh, sc, evapSat, condSat, outdoorT, indoorT, supplyT, dtVal, loPsi, hiPsi) {
    var copEl = document.getElementById('htHeatCOP');
    var hspfEl = document.getElementById('htHeatHSPF');
    var bpEl = document.getElementById('htHeatBalancePoint');

    var cop = null;
    var hspf = null;
    var balancePoint = null;

    // COP estimation from saturation temperatures (Carnot-based approximation with efficiency factor)
    if (evapSat !== null && condSat !== null && condSat > evapSat) {
      var evapR = (evapSat - 32) * 5 / 9 + 273.15; // Kelvin
      var condR = (condSat - 32) * 5 / 9 + 273.15;
      var carnotCOP = condR / (condR - evapR);
      // Real systems operate at about 40-55% of Carnot
      cop = carnotCOP * 0.45;
      // Clamp to realistic range
      cop = Math.max(1.0, Math.min(6.0, cop));
    }

    // Alternative COP from electrical data if available
    var watts = _htHeatGetVal('htHeatWatts');
    if (watts !== null && watts > 0 && dtVal !== null && dtVal > 0) {
      // Estimate BTU output: assume 400 CFM per ton, use delta-T
      // This is approximate: BTU/hr = 1.08 * CFM * deltaT
      // For a typical 3-ton system at 1200 CFM:
      var estCFM = 1200; // default assumption
      var estBTU = 1.08 * estCFM * dtVal;
      var inputBTU = watts * 3.41214;
      if (inputBTU > 0) {
        var copFromElec = estBTU / inputBTU;
        // Use electrical COP if we have watts data, as it's more accurate
        if (copFromElec > 0.5 && copFromElec < 8) cop = copFromElec;
      }
    }

    // HSPF estimate: HSPF ~= COP * 3.412 (simplified seasonal estimate, derate ~15%)
    if (cop !== null) {
      hspf = cop * 3.412 * 0.85;
    }

    // Balance point estimation
    // Balance point = outdoor temp where heat pump capacity equals building heat loss
    // Rough estimation: at 47F outdoor, HP produces rated capacity
    // At balance point, capacity = 0 (simplified linear model)
    if (cop !== null && outdoorT !== null && indoorT !== null) {
      // Simplified: balance point is where COP approaches 1.0
      // Using linear extrapolation from current conditions
      var currentEvapT = evapSat || (outdoorT - 20);
      // As outdoor drops, evap drops, COP drops
      // Estimate: every 1F drop in outdoor = ~0.03 drop in COP
      if (cop > 1.0) {
        var degreesDrop = (cop - 1.0) / 0.03;
        balancePoint = outdoorT - degreesDrop;
        balancePoint = Math.max(-20, Math.min(60, balancePoint));
      }
    }

    // Update display
    if (copEl) {
      if (cop !== null) {
        copEl.textContent = cop.toFixed(2);
        copEl.style.color = cop > 3.0 ? '#34d399' : cop >= 2.0 ? '#fbbf24' : '#f87171';
      } else {
        copEl.textContent = '--';
        copEl.style.color = '#57574F';
      }
    }
    if (hspfEl) {
      if (hspf !== null) {
        hspfEl.textContent = hspf.toFixed(1);
        hspfEl.style.color = hspf > 10 ? '#34d399' : hspf >= 8 ? '#fbbf24' : '#f87171';
      } else {
        hspfEl.textContent = '--';
        hspfEl.style.color = '#57574F';
      }
    }
    if (bpEl) {
      if (balancePoint !== null) {
        bpEl.textContent = balancePoint.toFixed(0) + '\u00B0F';
        bpEl.style.color = balancePoint < 20 ? '#34d399' : balancePoint < 35 ? '#fbbf24' : '#f87171';
      } else {
        bpEl.textContent = '--';
        bpEl.style.color = '#57574F';
      }
    }

    return { cop: cop, hspf: hspf, balancePoint: balancePoint };
  }

  // ============================
  // HEAT PUMP DIAGNOSTIC ENGINE
  // ============================
  function _htHeatDiagnoseSystem(sysType, ref, loPsi, hiPsi, evapSat, condSat, sh, sc, cr, condSplit, evapSplit, outdoorT, indoorT, supplyT, dischargeT, defrostT, dtVal) {
    var d = [];
    if (loPsi <= 0 && hiPsi <= 0) return d;

    var mdType = _meteringDevice || 'txv';
    var mdLabels = { txv: 'TXV', piston: 'Pist\u00F3n', cap: 'Cap Tube', eev: 'EEV' };
    var mdLabel = mdLabels[mdType] || 'TXV';

    // Get system-specific ranges
    var sysR = HEAT_RANGES[sysType] || HEAT_RANGES.hp;
    var shMin = sysR.shMin !== undefined ? sysR.shMin : (MD_SH_RANGES[mdType] || [8,12])[0];
    var shMax = sysR.shMax !== undefined ? sysR.shMax : (MD_SH_RANGES[mdType] || [8,12])[1];
    var scMin = sysR.scMin !== undefined ? sysR.scMin : (MD_SC_RANGES[mdType] || [8,14])[0];
    var scMax = sysR.scMax !== undefined ? sysR.scMax : (MD_SC_RANGES[mdType] || [8,14])[1];
    var csMin = sysR.csMin || 15;
    var csMax = sysR.csMax || 25;
    var dtMin = sysR.dtMin || 15;
    var dtMax = sysR.dtMax || 25;

    // ---- SUPERHEAT ANALYSIS (heating mode) ----
    if (sh !== null) {
      if (sh < 3) {
        d.push(['error',
          'Superheat muy bajo (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ']',
          'HEATING MODE: Riesgo de flood-back al compresor. En calefacci\u00F3n, el evaporador exterior puede estar recibiendo demasiado refrigerante. Verificar metering device, carga, y flujo de aire exterior.']);
      } else if (sh > shMax + 10) {
        d.push(['error',
          'Superheat muy alto (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']',
          'Evaporador exterior hambriento. Posible baja carga, restricci\u00F3n en l\u00EDnea de l\u00EDquido, ' + mdLabel + ' bloqueado, o filtro drier obstruido. En heating, baja temp exterior agrava el problema.']);
      } else if (sh > shMax) {
        d.push(['warn',
          'Superheat elevado (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']',
          'Por encima del rango normal para heating mode con ' + mdLabel + '. Verificar carga y condiciones exteriores.']);
      } else if (sh < shMin) {
        d.push(['warn',
          'Superheat bajo (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']',
          'Por debajo del rango. Posible exceso de refrigerante o metering device permitiendo demasiado flujo.']);
      } else {
        d.push(['ok',
          'Superheat normal (' + sh.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + shMin + '-' + shMax + ']',
          'Dentro del rango aceptable para heating mode.']);
      }
    }

    // ---- SUBCOOLING ANALYSIS (heating mode, indoor condenser) ----
    if (sc !== null) {
      if (sc < 2) {
        d.push(['error',
          'Subcooling muy bajo (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']',
          'Posible baja carga de refrigerante o flash gas. En heating, el condensador interior debe subfoliar adecuadamente para transferir calor al espacio.']);
      } else if (sc > scMax + 6) {
        d.push(['error',
          'Subcooling muy alto (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']',
          'Posible sobrecarga, restricci\u00F3n despu\u00E9s del condensador interior, o bajo flujo de aire interior.']);
      } else if (sc > scMax) {
        d.push(['warn',
          'Subcooling elevado (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']',
          'Un poco alto para ' + mdLabel + '. Verificar flujo de aire interior y carga.']);
      } else if (sc >= scMin && sc <= scMax) {
        d.push(['ok',
          'Subcooling normal (' + sc.toFixed(1) + '\u00B0F) [' + mdLabel + ': ' + scMin + '-' + scMax + ']',
          'Condensador interior funcionando correctamente para heating.']);
      }
    }

    // ---- COMPRESSION RATIO ----
    if (cr !== null) {
      if (cr > 5) {
        d.push(['error',
          'Compression ratio extremo (' + cr.toFixed(2) + ':1)',
          'Estr\u00E9s severo en compresor. Com\u00FAn en heating con baja temp exterior. Verificar defrost, presiones, y condiciones.']);
      } else if (cr > 4) {
        d.push(['warn',
          'Compression ratio alto (' + cr.toFixed(2) + ':1)',
          'Compresor trabajando duro. Normal en heating con exterior fr\u00EDo, pero monitorear. Rango ideal: 2.5-3.5:1.']);
      } else if (cr < 1.5 && cr > 0) {
        d.push(['warn',
          'Compression ratio bajo (' + cr.toFixed(2) + ':1)',
          'Verificar si el compresor est\u00E1 funcionando o si las presiones son correctas.']);
      }
    }

    // ---- CONDENSER SPLIT (indoor, heating: Cond Sat - Indoor Return) ----
    if (condSplit !== null) {
      if (condSplit > csMax + 10) {
        d.push(['error',
          'Condenser split alto (' + condSplit.toFixed(1) + '\u00B0F) [Normal: ' + csMin + '-' + csMax + '\u00B0F]',
          'Bajo flujo de aire interior. Filtro sucio, blower d\u00E9bil, o ductos restringidos impiden la transferencia de calor.']);
      } else if (condSplit > csMax) {
        d.push(['warn',
          'Condenser split elevado (' + condSplit.toFixed(1) + '\u00B0F)',
          'Verificar filtro de aire y velocidad del blower. Rango normal: ' + csMin + '-' + csMax + '\u00B0F.']);
      } else if (condSplit < csMin - 5) {
        d.push(['warn',
          'Condenser split bajo (' + condSplit.toFixed(1) + '\u00B0F)',
          'Posible baja carga, compresor d\u00E9bil, o flujo de aire excesivo.']);
      } else if (condSplit >= csMin && condSplit <= csMax) {
        d.push(['ok',
          'Condenser split normal (' + condSplit.toFixed(1) + '\u00B0F)',
          'Transferencia de calor interior adecuada: ' + csMin + '-' + csMax + '\u00B0F.']);
      }
    }

    // ---- EVAPORATOR SPLIT (outdoor, heating: Outdoor Ambient - Evap Sat) ----
    if (evapSplit !== null) {
      if (evapSplit > 35) {
        d.push(['warn',
          'Evaporator split alto (' + evapSplit.toFixed(1) + '\u00B0F)',
          'Coil exterior sucio, ventilador defectuoso, o escarcha acumulada. Normal: 15-25\u00B0F.']);
      } else if (evapSplit < 10) {
        d.push(['warn',
          'Evaporator split bajo (' + evapSplit.toFixed(1) + '\u00B0F)',
          'Posible sobrecarga o alta carga de refrigerante en evaporador exterior.']);
      } else if (evapSplit >= 15 && evapSplit <= 25) {
        d.push(['ok',
          'Evaporator split normal (' + evapSplit.toFixed(1) + '\u00B0F)',
          'Coil exterior operando correctamente: 15-25\u00B0F.']);
      }
    }

    // ---- DELTA-T (Supply - Return, heating) ----
    if (dtVal !== null) {
      if (dtVal < dtMin) {
        d.push(['warn',
          'Delta-T bajo (' + dtVal.toFixed(1) + '\u00B0F) [Normal: ' + dtMin + '-' + dtMax + '\u00B0F]',
          'Baja capacidad de calefacci\u00F3n. Verificar carga, operaci\u00F3n del compresor, y flujo de aire.']);
      } else if (dtVal > dtMax + 10) {
        d.push(['warn',
          'Delta-T muy alto (' + dtVal.toFixed(1) + '\u00B0F)',
          'Flujo de aire insuficiente. Verificar filtro, blower, y ductos.']);
      } else if (dtVal > dtMax) {
        d.push(['warn',
          'Delta-T elevado (' + dtVal.toFixed(1) + '\u00B0F)',
          'Ligeramente alto. Si aux heat est\u00E1 activo, puede ser normal. Verificar flujo de aire.']);
      } else {
        d.push(['ok',
          'Delta-T normal (' + dtVal.toFixed(1) + '\u00B0F)',
          'Rango correcto para calefacci\u00F3n: ' + dtMin + '-' + dtMax + '\u00B0F.']);
      }
    }

    // ---- LOW OUTDOOR AMBIENT WARNINGS ----
    if (outdoorT !== null) {
      if (outdoorT < 0) {
        d.push(['error',
          'Temperatura exterior extrema (' + outdoorT.toFixed(1) + '\u00B0F)',
          'Sub-zero: Heat pump operating at minimum capacity. Aux/emergency heat likely required. Monitor compressor amps and oil return.']);
      } else if (outdoorT < 25) {
        d.push(['warn',
          'Temperatura exterior baja (' + outdoorT.toFixed(1) + '\u00B0F)',
          'Heat pump capacity significantly reduced. Defrost cycles will be more frequent. Consider aux heat. COP drops below 2.0 at these temps.']);
      } else if (outdoorT < 40) {
        d.push(['warn',
          'Outdoor temp moderadamente baja (' + outdoorT.toFixed(1) + '\u00B0F)',
          'Operar cerca del punto de equilibrio. Monitorear rendimiento y ciclos de defrost.']);
      }
    }

    // ---- DEFROST INDICATORS ----
    if (evapSat !== null && evapSat < 30) {
      d.push(['warn',
        'Evap Sat bajo punto de congelamiento (' + evapSat.toFixed(1) + '\u00B0F)',
        'Formaci\u00F3n de escarcha probable en coil exterior. Verificar que el sistema de defrost est\u00E9 operando. Normal que Evap Sat baje a ~20-30\u00B0F en heating.']);
    }
    if (defrostT !== null && defrostT < 28) {
      d.push(['warn',
        'Coil/defrost temp muy baja (' + defrostT.toFixed(1) + '\u00B0F)',
        'Escarcha significativa en coil exterior. Si no est\u00E1 defrosteando, verificar board de defrost, sensor, y temporizador.']);
    }

    // ---- DISCHARGE LINE TEMP ----
    if (dischargeT !== null) {
      if (dischargeT > 250) {
        d.push(['error',
          'Discharge line temp excesiva (' + dischargeT.toFixed(1) + '\u00B0F)',
          'Compresor en estr\u00E9s t\u00E9rmico. M\u00E1ximo t\u00EDpico: 225\u00B0F. Posible baja carga, alto compression ratio, o v\u00E1lvula defectuosa.']);
      } else if (dischargeT > 220) {
        d.push(['warn',
          'Discharge line temp elevada (' + dischargeT.toFixed(1) + '\u00B0F)',
          'Monitorear. Alta pero dentro de l\u00EDmites. Verificar carga y condiciones.']);
      } else if (dischargeT < 100 && dischargeT > 0) {
        d.push(['warn',
          'Discharge line temp baja (' + dischargeT.toFixed(1) + '\u00B0F)',
          'Compresor puede no estar comprimiendo adecuadamente. Verificar v\u00E1lvulas internas.']);
      }
    }

    // ---- CHARGE PATTERN ANALYSIS ----
    if (sh !== null && sc !== null) {
      if (sh > shMax + 5 && sc < scMin - 3) {
        d.push(['error',
          'SH alto + SC bajo = BAJA CARGA (Heating)',
          'Patr\u00F3n cl\u00E1sico de fuga o baja carga. En heating mode, la fuga puede ser m\u00E1s evidente. Realizar leak test en todas las conexiones incluyendo reversing valve.']);
      }
      if (sh < shMin - 3 && sc > scMax + 5) {
        d.push(['error',
          'SH bajo + SC alto = SOBRECARGA (Heating)',
          'Exceso de refrigerante. En heating, el condensador interior se sobrecarga. Recuperar refrigerante hasta valores normales.']);
      }
      if (sh > shMax + 5 && sc > scMax + 5) {
        d.push(['warn',
          'SH alto + SC alto = RESTRICCI\u00D3N',
          'Restricci\u00F3n en l\u00EDnea de l\u00EDquido, filtro drier tapado, o problema en reversing valve. Verificar ca\u00EDda de temperatura en l\u00EDnea de l\u00EDquido.']);
      }
      if (sh < shMin - 3 && sc < scMin - 3) {
        d.push(['warn',
          'SH bajo + SC bajo',
          'Verificar metering device y flujo de aire. Posible metering device stuck open con baja carga.']);
      }
    }

    // ---- AUXILIARY HEAT RECOMMENDATIONS ----
    if (outdoorT !== null && dtVal !== null) {
      if (outdoorT < 35 && dtVal < dtMin && _auxHeat === 'off') {
        d.push(['warn',
          'Considerar activar Aux Heat',
          'Outdoor temp ' + outdoorT.toFixed(0) + '\u00B0F con Delta-T insuficiente (' + dtVal.toFixed(1) + '\u00B0F). Aux heat puede ser necesario para mantener confort.']);
      }
      if (_auxHeat === 'emergency' && outdoorT > 40) {
        d.push(['warn',
          'Emergency heat activo con outdoor > 40\u00B0F',
          'El heat pump deber\u00EDa poder mantener carga a esta temperatura. Verificar por qu\u00E9 se activ\u00F3 emergency heat.']);
      }
    }

    // ---- BALANCE POINT ESTIMATION ----
    var cv = window._htHeatCalcValues || {};
    if (outdoorT !== null && outdoorT < 35 && cv && cv.cop !== undefined) {
      // Already estimated in COP calc
    }

    // ---- DEFROST CYCLE ANALYSIS ----
    var defInterval = _htHeatGetVal('htHeatDefrostInterval');
    var defDuration = _htHeatGetVal('htHeatDefrostDuration');
    if (defInterval !== null) {
      if (defInterval < 20) {
        d.push(['warn',
          'Defrost demasiado frecuente (cada ' + defInterval + ' min)',
          'Ciclos de defrost muy seguidos reducen eficiencia. Verificar coil exterior, sensor de defrost, y l\u00F3gica del board.']);
      } else if (defInterval > 120) {
        d.push(['warn',
          'Intervalo de defrost largo (' + defInterval + ' min)',
          'Si hay escarcha visible, el defrost puede no estar activando correctamente.']);
      }
    }
    if (defDuration !== null) {
      if (defDuration > 15) {
        d.push(['warn',
          'Defrost prolongado (' + defDuration + ' min)',
          'Ciclo de defrost largo indica acumulaci\u00F3n excesiva de hielo. Verificar flujo de aire, nivel de refrigerante, y sensor de terminaci\u00F3n.']);
      } else if (defDuration < 1) {
        d.push(['warn',
          'Defrost muy corto (' + defDuration + ' min)',
          'Puede no estar completando el defrost. Verificar sensor de terminaci\u00F3n y board de defrost.']);
      }
    }

    // ---- REVERSING VALVE CHECK ----
    if (_rvStatus === 'heating' && condSat !== null && evapSat !== null) {
      if (condSat < evapSat) {
        d.push(['error',
          'Presiones invertidas para heating mode',
          'En heating, la presi\u00F3n high-side (interior) debe ser mayor que low-side (exterior). Verificar reversing valve, puede estar stuck o energizado incorrectamente.']);
      }
    }

    return d;
  }
  window._htHeatDiagnoseSystem = _htHeatDiagnoseSystem;

  // ============================
  // WATER HEATER DIAGNOSTIC ENGINE
  // ============================
  function _htHeatDiagnoseWater(waterIn, waterOut, rise, thermostat, flowGPM, gasPressure, flueTempF, ambientT, btuHr, efficiency) {
    var d = [];
    var hasData = (waterIn !== null || waterOut !== null || gasPressure !== null || flueTempF !== null);
    if (!hasData) return d;

    // Temperature rise analysis
    if (rise !== null) {
      if (rise < 20) {
        d.push(['error',
          'Temperature rise muy bajo (' + rise.toFixed(1) + '\u00B0F)',
          'Calentador no est\u00E1 produciendo suficiente calor. Verificar burner/element, termostato, y dip tube. Normal: 40-70\u00B0F.']);
      } else if (rise < 40) {
        d.push(['warn',
          'Temperature rise bajo (' + rise.toFixed(1) + '\u00B0F)',
          'Por debajo del rango normal (40-70\u00B0F). Posible elemento d\u00E9bil, termostato bajo, alto flujo, o sedimento en tanque.']);
      } else if (rise > 80) {
        d.push(['warn',
          'Temperature rise alto (' + rise.toFixed(1) + '\u00B0F)',
          'Posible bajo flujo, termostato muy alto, o problema de mezclado. Riesgo de quemaduras > 120\u00B0F outlet.']);
      } else if (rise >= 40 && rise <= 70) {
        d.push(['ok',
          'Temperature rise normal (' + rise.toFixed(1) + '\u00B0F)',
          'Dentro del rango esperado: 40-70\u00B0F.']);
      }
    }

    // Outlet temperature safety
    if (waterOut !== null) {
      if (waterOut > 140) {
        d.push(['error',
          'Temperatura de salida peligrosa (' + waterOut.toFixed(0) + '\u00B0F)',
          'RIESGO DE QUEMADURAS. M\u00E1ximo recomendado: 120\u00B0F. Verificar termostato y mixing valve.']);
      } else if (waterOut > 125) {
        d.push(['warn',
          'Temperatura de salida alta (' + waterOut.toFixed(0) + '\u00B0F)',
          'Considerar reducir a 120\u00B0F para seguridad. A 130\u00B0F+ hay riesgo de quemaduras en < 30 segundos.']);
      }
    }

    // Gas pressure analysis
    if (gasPressure !== null) {
      // Natural gas: 3.5" WC (range 3.2-4.0)
      // LP gas: 10" WC (range 9-11)
      if (gasPressure >= 2.5 && gasPressure <= 5.0) {
        // Natural gas range
        if (gasPressure >= 3.2 && gasPressure <= 4.0) {
          d.push(['ok',
            'Gas pressure normal \u2014 Natural Gas (' + gasPressure.toFixed(1) + '" WC)',
            'Presi\u00F3n de manifold correcta para gas natural: 3.5" WC nominal.']);
        } else if (gasPressure < 3.2) {
          d.push(['warn',
            'Gas pressure bajo (' + gasPressure.toFixed(1) + '" WC)',
            'Presi\u00F3n de gas baja. Verificar regulador, l\u00EDnea de gas, y sizing de tuber\u00EDa. Normal NG: 3.5" WC.']);
        } else {
          d.push(['warn',
            'Gas pressure alto (' + gasPressure.toFixed(1) + '" WC)',
            'Ligeramente alto para gas natural. Verificar regulador. Normal: 3.5" WC.']);
        }
      } else if (gasPressure >= 8.0 && gasPressure <= 13.0) {
        // LP gas range
        if (gasPressure >= 9.0 && gasPressure <= 11.0) {
          d.push(['ok',
            'Gas pressure normal \u2014 LP Gas (' + gasPressure.toFixed(1) + '" WC)',
            'Presi\u00F3n correcta para LP/Propano: 10" WC nominal.']);
        } else {
          d.push(['warn',
            'Gas pressure fuera de rango LP (' + gasPressure.toFixed(1) + '" WC)',
            'Normal LP: 10" WC. Verificar regulador.']);
        }
      } else if (gasPressure < 2.5) {
        d.push(['error',
          'Gas pressure muy bajo (' + gasPressure.toFixed(1) + '" WC)',
          'Presi\u00F3n insuficiente. Burner puede no encender o producir llama amarilla. Verificar suministro de gas.']);
      }
    }

    // Flue temperature analysis
    if (flueTempF !== null) {
      if (flueTempF < 100) {
        d.push(['warn',
          'Flue temp muy baja (' + flueTempF.toFixed(0) + '\u00B0F)',
          'Si es condensing unit, puede ser normal. Si es atm\u00F3sfico convencional, indica que no est\u00E1 operando o sensor incorrecto.']);
      } else if (flueTempF < 200) {
        d.push(['ok',
          'Flue temp baja \u2014 Condensing (' + flueTempF.toFixed(0) + '\u00B0F)',
          'T\u00EDpico de unidad de alta eficiencia (condensing). Eficiencia > 90%.']);
      } else if (flueTempF >= 300 && flueTempF <= 500) {
        d.push(['ok',
          'Flue temp normal (' + flueTempF.toFixed(0) + '\u00B0F)',
          'Rango normal para water heater atmosf\u00E9rico: 300-500\u00B0F.']);
      } else if (flueTempF > 500) {
        d.push(['warn',
          'Flue temp alta (' + flueTempF.toFixed(0) + '\u00B0F)',
          'Ineficiente \u2014 calor desperdiciado por el flue. Normal: 300-500\u00B0F. Verificar heat exchanger y draft.']);
      } else if (flueTempF >= 200 && flueTempF < 300) {
        d.push(['warn',
          'Flue temp moderada (' + flueTempF.toFixed(0) + '\u00B0F)',
          'En rango bajo para convencional. Posible riesgo de condensaci\u00F3n en flue si < 250\u00B0F.']);
      }
    }

    // Flow rate analysis
    if (flowGPM !== null) {
      if (flowGPM < 0.5) {
        d.push(['warn',
          'Flow rate muy bajo (' + flowGPM.toFixed(1) + ' GPM)',
          'Flujo insuficiente. Verificar v\u00E1lvulas, tuber\u00EDa, y presi\u00F3n de agua.']);
      } else if (flowGPM > 6) {
        d.push(['warn',
          'Flow rate muy alto (' + flowGPM.toFixed(1) + ' GPM)',
          'Flujo excesivo puede reducir temperature rise. Tankless units tienen l\u00EDmite de GPM vs rise.']);
      }
    }

    // Efficiency analysis
    if (efficiency !== null) {
      if (efficiency >= 90) {
        d.push(['ok',
          'Alta eficiencia estimada (' + efficiency.toFixed(0) + '%)',
          'Operando eficientemente. T\u00EDpico de condensing units.']);
      } else if (efficiency >= 80) {
        d.push(['ok',
          'Eficiencia est\u00E1ndar (' + efficiency.toFixed(0) + '%)',
          'Normal para water heater convencional.']);
      } else if (efficiency < 70) {
        d.push(['warn',
          'Baja eficiencia estimada (' + efficiency.toFixed(0) + '%)',
          'Unidad perdiendo demasiado calor. Verificar heat exchanger, draft, y aislamiento.']);
      }
    }

    // Thermostat check
    if (thermostat !== null && waterOut !== null) {
      var diff = Math.abs(thermostat - waterOut);
      if (diff > 15) {
        d.push(['warn',
          'Outlet temp no alcanza thermostat (' + waterOut.toFixed(0) + '\u00B0F vs ' + thermostat.toFixed(0) + '\u00B0F set)',
          'Diferencia de ' + diff.toFixed(0) + '\u00B0F. Posible elemento d\u00E9bil, alto demand, sedimento, o thermostat defectuoso.']);
      }
    }

    return d;
  }
  window._htHeatDiagnoseWater = _htHeatDiagnoseWater;

  // ============================
  // IA DEEP DIAGNOSIS
  // ============================
  window._htHeatIADiagnose = function() {
    var cv = window._htHeatCalcValues || {};
    var sysLabels = {
      minihp: 'Mini Split Heat Pump (Inverter)',
      hp: 'Heat Pump Est\u00E1ndar',
      vrf: 'VRF (Variable Refrigerant Flow)',
      centralhp: 'Central Ducted Heat Pump',
      pkghp: 'Package Unit Heat Pump',
      waterht: 'Water Heater (Gas/Electric/Tankless)',
      waterhp: 'Heat Pump Water Heater'
    };
    var mdLabels = { txv: 'TXV', piston: 'Pist\u00F3n/Orificio', cap: 'Cap Tube', eev: 'EEV' };

    var eqInfo = window._htHeatEquip || {};
    var prompt = 'Eres un t\u00E9cnico HVAC master con 30 a\u00F1os de experiencia en SISTEMAS DE CALEFACCI\u00D3N. IMPORTANTE: Analiza TODOS los datos proporcionados antes de dar tu diagn\u00F3stico. No ignores ninguna lectura. NO inventes datos que no est\u00E9n listados.\n\n';
    prompt += 'EQUIPO:\n';
    prompt += '- Sistema: ' + (sysLabels[_sysType] || _sysType) + '\n';
    if (eqInfo.model) prompt += '- Modelo: ' + eqInfo.model + '\n';
    if (eqInfo.serial) prompt += '- Serial: ' + eqInfo.serial + '\n';
    prompt += '\nMODO: CALEFACCI\u00D3N (HEATING)\n';
    prompt += 'Reversing Valve: ' + _rvStatus.toUpperCase() + '\n';
    prompt += 'Aux Heat: ' + _auxHeat.toUpperCase() + '\n';
    prompt += 'Defrost Status: ' + _defrostStatus.toUpperCase() + '\n\n';

    if (_isWaterType && _sysType === 'waterht') {
      // Water heater specific prompt
      prompt += 'DATOS DEL WATER HEATER:\n';
      prompt += '- Inlet Water Temp: ' + (cv.waterIn !== null ? cv.waterIn + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Outlet Water Temp: ' + (cv.waterOut !== null ? cv.waterOut + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Temperature Rise: ' + (cv.rise !== null ? cv.rise.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Thermostat Setting: ' + (cv.thermostat !== null ? cv.thermostat + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Flow Rate: ' + (cv.flowGPM !== null ? cv.flowGPM + ' GPM' : 'N/A') + '\n';
      prompt += '- Gas Manifold Pressure: ' + (cv.gasPressure !== null ? cv.gasPressure + '" WC' : 'N/A') + '\n';
      prompt += '- Flue Temperature: ' + (cv.flueTempF !== null ? cv.flueTempF + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Ambient: ' + (cv.ambientT !== null ? cv.ambientT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- BTU/hr estimado: ' + (cv.btuHr !== null ? Math.round(cv.btuHr) : 'N/A') + '\n';
      prompt += '- Eficiencia estimada: ' + (cv.efficiency !== null ? cv.efficiency.toFixed(0) + '%' : 'N/A') + '\n';
    } else {
      // Heat pump specific prompt
      var refName = cv.refrigerant || 'R-410A';
      prompt += 'Refrigerante: ' + refName + '\n';
      prompt += 'Metering Device: ' + (mdLabels[cv.meteringDevice] || 'TXV') + '\n\n';

      prompt += 'PRESIONES:\n';
      prompt += '- Low side (evaporador exterior): ' + (cv.loPsi || 0) + ' psig\n';
      prompt += '- High side (condensador interior): ' + (cv.hiPsi || 0) + ' psig\n\n';

      prompt += 'TEMPERATURAS SATURADAS:\n';
      prompt += '- Evap Sat (exterior): ' + (cv.evapSat !== null ? cv.evapSat.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Cond Sat (interior): ' + (cv.condSat !== null ? cv.condSat.toFixed(1) + '\u00B0F' : 'N/A') + '\n\n';

      prompt += 'TEMPERATURAS DE CAMPO:\n';
      prompt += '- Suction Line (outdoor): ' + (cv.suctionT !== null ? cv.suctionT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Liquid Line: ' + (cv.liquidT !== null ? cv.liquidT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Discharge Line: ' + (cv.dischargeT !== null ? cv.dischargeT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Outdoor Ambient: ' + (cv.outdoorT !== null ? cv.outdoorT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Indoor Return: ' + (cv.indoorT !== null ? cv.indoorT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Supply Air: ' + (cv.supplyT !== null ? cv.supplyT + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Delta-T: ' + (cv.deltaT !== null ? cv.deltaT.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Defrost/Coil Temp: ' + (cv.defrostT !== null ? cv.defrostT + '\u00B0F' : 'N/A') + '\n\n';

      prompt += 'C\u00C1LCULOS:\n';
      prompt += '- Superheat: ' + (cv.sh !== null ? cv.sh.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Subcooling: ' + (cv.sc !== null ? cv.sc.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Compression Ratio: ' + (cv.cr !== null ? cv.cr.toFixed(2) + ':1' : 'N/A') + '\n';
      prompt += '- Condenser Split (indoor): ' + (cv.condSplit !== null ? cv.condSplit.toFixed(1) + '\u00B0F' : 'N/A') + '\n';
      prompt += '- Evaporator Split (outdoor): ' + (cv.evapSplit !== null ? cv.evapSplit.toFixed(1) + '\u00B0F' : 'N/A') + '\n\n';

      // Add electrical data if available
      var watts = _htHeatGetVal('htHeatWatts');
      var amps = _htHeatGetVal('htHeatAmps');
      var voltage = _htHeatGetVal('htHeatVoltage');
      if (watts !== null || amps !== null || voltage !== null) {
        prompt += 'DATOS EL\u00C9CTRICOS (SC680):\n';
        if (voltage !== null) prompt += '- Voltage: ' + voltage + ' V\n';
        if (amps !== null) prompt += '- Amps: ' + amps + ' A\n';
        if (watts !== null) prompt += '- Watts: ' + watts + ' W\n';
        prompt += '\n';
      }

      // Aux heat info
      if (_auxHeat !== 'off') {
        var auxKW = _htHeatGetVal('htHeatAuxKW');
        prompt += 'AUX HEAT: ' + _auxHeat.toUpperCase() + '\n';
        if (auxKW) prompt += '- Aux kW: ' + auxKW + '\n';
        prompt += '\n';
      }

      // Defrost info
      var defInterval = _htHeatGetVal('htHeatDefrostInterval');
      var defDuration = _htHeatGetVal('htHeatDefrostDuration');
      if (defInterval !== null || defDuration !== null) {
        prompt += 'DEFROST:\n';
        if (defInterval !== null) prompt += '- Interval: ' + defInterval + ' min\n';
        if (defDuration !== null) prompt += '- Duration: ' + defDuration + ' min\n';
        prompt += '\n';
      }
    }

    // Weather data
    var _wx = window.MaestroWeather || {};
    if (_wx.tempF !== null && _wx.tempF !== undefined) {
      prompt += 'CONDICIONES CLIM\u00C1TICAS (GPS):\n';
      prompt += '- Outdoor Temp: ' + _wx.tempF.toFixed(1) + '\u00B0F\n';
      if (_wx.rhPct !== null) prompt += '- Humidity: ' + Math.round(_wx.rhPct) + '% RH\n';
      if (_wx.windMph !== null) prompt += '- Wind: ' + _wx.windMph.toFixed(0) + ' mph\n';
      if (_wx.city) prompt += '- Location: ' + _wx.city + '\n';
      prompt += '\n';
    }

    // Air analysis data
    var airEnterDB = _htHeatGetVal('htHeatAirEnterDB');
    var airLeaveDB = _htHeatGetVal('htHeatAirLeaveDB');
    var airEnterWB = _htHeatGetVal('htHeatAirEnterWB');
    var airLeaveWB = _htHeatGetVal('htHeatAirLeaveWB');
    var airEnterRH = _htHeatGetVal('htHeatAirEnterRH');
    var airLeaveRH = _htHeatGetVal('htHeatAirLeaveRH');
    var airEnterWC = _htHeatGetVal('htHeatAirEnterWC');
    var airLeaveWC = _htHeatGetVal('htHeatAirLeaveWC');
    var hasAir = airEnterDB !== null || airLeaveDB !== null || airEnterWC !== null;
    if (hasAir) {
      prompt += 'AN\u00C1LISIS DE AIRE (Entering/Leaving):\n';
      if (airEnterDB !== null) prompt += '- Entering DB: ' + airEnterDB + '\u00B0F\n';
      if (airLeaveDB !== null) prompt += '- Leaving DB: ' + airLeaveDB + '\u00B0F\n';
      if (airEnterWB !== null) prompt += '- Entering WB: ' + airEnterWB + '\u00B0F\n';
      if (airLeaveWB !== null) prompt += '- Leaving WB: ' + airLeaveWB + '\u00B0F\n';
      if (airEnterRH !== null) prompt += '- Entering RH: ' + airEnterRH + '%\n';
      if (airLeaveRH !== null) prompt += '- Leaving RH: ' + airLeaveRH + '%\n';
      if (airEnterWC !== null) prompt += '- Return Static: ' + airEnterWC + ' inWC\n';
      if (airLeaveWC !== null) prompt += '- Supply Static: ' + airLeaveWC + ' inWC\n';
      var totalEnthEl = document.getElementById('htHeatTotalEnthalpy');
      var totalEnth = totalEnthEl ? totalEnthEl.textContent : null;
      if (totalEnth && totalEnth !== '--') prompt += '- Calor Entregado: ' + totalEnth + ' BTU/lb\n';
      var totalESPEl = document.getElementById('htHeatTotalESP');
      var totalESP = totalESPEl ? totalESPEl.textContent : null;
      if (totalESP && totalESP !== '--') prompt += '- Total ESP: ' + totalESP + ' inWC\n';
      prompt += '\n';
    }

    // Capacitor, ohms, micro-amps (flame sensor) if available
    var capuF = _htHeatGetVal('htHeatCapuF');
    var ohmsVal = _htHeatGetVal('htHeatOhms');
    var microAmps = _htHeatGetVal('htHeatMicroAmps');
    if (capuF !== null || ohmsVal !== null || microAmps !== null) {
      if (capuF !== null) prompt += '- Capacitor: ' + capuF + ' \u00B5F\n';
      if (ohmsVal !== null) prompt += '- Ohms: ' + ohmsVal + ' \u03A9\n';
      if (microAmps !== null) prompt += '- Flame Sensor \u00B5A: ' + microAmps + ' \u00B5A (min 2-6\u00B5A para mantener llama)\n';
      prompt += '\n';
    }

    prompt += 'IMPORTANTE: Este es un sistema en modo CALEFACCI\u00D3N (HEATING). En heating mode:\n';
    prompt += '- El coil exterior es el EVAPORADOR (absorbe calor del aire exterior)\n';
    prompt += '- El coil interior es el CONDENSADOR (entrega calor al espacio)\n';
    prompt += '- La v\u00E1lvula reversible est\u00E1 en posici\u00F3n de heating\n';
    prompt += '- Supply air debe ser M\u00C1S CALIENTE que return air\n\n';

    // CO/Combustion data
    var coVals = window._htHeatCOValues || {};
    if (coVals.coAmbient !== null || coVals.coFlue !== null || coVals.o2 !== null || coVals.draft !== null) {
      prompt += 'MON\u00D3XIDO DE CARBONO / COMBUSTI\u00D3N:\n';
      if (coVals.coAmbient !== null) prompt += '- CO Ambiente: ' + coVals.coAmbient + ' ppm\n';
      if (coVals.coFlue !== null) prompt += '- CO Flue: ' + coVals.coFlue + ' ppm\n';
      if (coVals.coSupply !== null) prompt += '- CO Supply Air: ' + coVals.coSupply + ' ppm\n';
      if (coVals.coReturn !== null) prompt += '- CO Return Air: ' + coVals.coReturn + ' ppm\n';
      if (coVals.coAirFree !== null) prompt += '- CO Air-Free: ' + coVals.coAirFree + ' ppm\n';
      if (coVals.o2 !== null) prompt += '- O2: ' + coVals.o2 + '%\n';
      if (coVals.co2 !== null) prompt += '- CO2: ' + coVals.co2 + '%\n';
      if (coVals.excessAir !== null) prompt += '- Exceso de Aire: ' + coVals.excessAir + '%\n';
      if (coVals.stackT !== null) prompt += '- Stack Temp: ' + coVals.stackT + '\u00B0F\n';
      if (coVals.combEffic !== null) prompt += '- Eficiencia Combusti\u00F3n: ' + coVals.combEffic + '%\n';
      if (coVals.draft !== null) prompt += '- Draft: ' + coVals.draft + '" WC\n';
      prompt += '- Gas: ' + (coVals.gasType === 'lp' ? 'LP/Propano' : 'Natural Gas') + '\n';
      prompt += '- Equipo: ' + (coVals.hxType || 'conventional') + '\n\n';
    }

    prompt += 'Responde EN ESPA\u00D1OL con:\n';
    prompt += '1. Diagn\u00F3stico principal del sistema de calefacci\u00F3n\n';
    prompt += '2. Posibles causas ra\u00EDz (ordenadas de m\u00E1s probable a menos)\n';
    prompt += '3. Pasos de verificaci\u00F3n espec\u00EDficos para heating mode\n';
    prompt += '4. Soluci\u00F3n recomendada paso a paso\n';
    prompt += '5. An\u00E1lisis de eficiencia y COP\n';
    prompt += '6. Recomendaciones sobre aux heat y defrost\n';
    prompt += '7. An\u00E1lisis de mon\u00F3xido de carbono y seguridad de combusti\u00F3n (si hay datos CO)\n';
    prompt += '8. Advertencias de seguridad si aplica';

    _htCallIA(prompt, 'htHeatIA', 'htHeatIABtn');
  };

  // ============================
  // IA CALL HELPER
  // ============================
  function _htCallIA(prompt, resultId, btnId) {
    // Reuse global _htCallIA if available from herramientas.js
    // Otherwise implement locally
    var resultEl = document.getElementById(resultId);
    var btnEl = document.getElementById(btnId);
    if (!resultEl) return;

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'Analizando...';
      btnEl.style.opacity = '0.6';
    }
    resultEl.innerHTML = '<div style="padding:16px;text-align:center;">' +
      '<div style="display:inline-block;width:24px;height:24px;border:3px solid rgba(249,115,22,0.2);border-top-color:#f97316;border-radius:50%;animation:htHeatSpin 0.8s linear infinite;"></div>' +
      '<div style="margin-top:8px;font-size:13px;color:#111111;">Consultando IA para diagn\u00F3stico de calefacci\u00F3n...</div></div>';

    var sbUrl = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'https://htklsowiyjwsjnacnvnr.supabase.co';
    var sbKey = typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : (typeof SB_KEY !== 'undefined' ? SB_KEY : '');

    var _getToken = (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth)
      ? supabaseClient.auth.getSession().then(function(s) { return (s && s.data && s.data.session) ? s.data.session.access_token : sbKey; }).catch(function() { return sbKey; })
      : Promise.resolve(sbKey);

    _getToken.then(function(_tk) {
      fetch(sbUrl + '/functions/v1/tutor-ia-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + _tk,
          'apikey': sbKey
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          system: 'Eres un t\u00E9cnico HVAC master con 20+ a\u00F1os de experiencia en SISTEMAS DE CALEFACCI\u00D3N (heat pumps, furnaces, water heaters). Responde siempre en espa\u00F1ol, de forma directa y profesional.',
          max_tokens: 2048,
          email: localStorage.getItem('tecnico_email') || ''
        })
      }).then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        var text = data.reply || data.text || data.response || JSON.stringify(data);
        text = text.replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<b style="color:#111111;">$1</b>')
          .replace(/(\d+)\.\s/g, '<span style="color:#f97316;font-weight:700;">$1.</span> ');
        resultEl.innerHTML = '<div style="padding:12px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.15);border-radius:10px;font-size:13px;color:#374151;line-height:1.8;">' +
          '<div style="font-size:13px;font-weight:800;color:#f97316;margin-bottom:6px;">Diagn\u00F3stico IA \u2014 Calefacci\u00F3n</div>' + text + '</div>';
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.textContent = 'Diagn\u00F3stico Profundo con IA \u2014 Calefacci\u00F3n';
          btnEl.style.opacity = '1';
        }
      }).catch(function(err) {
        resultEl.innerHTML = '<div style="padding:10px;background:rgba(249,115,22,0.1);border-radius:8px;font-size:13px;color:#f97316;">Error: ' + err.message + '. Verifica tu conexi\u00F3n.</div>';
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.textContent = 'Reintentar';
          btnEl.style.opacity = '1';
        }
      });
    });
  }

  // ============================
  // CO MONITORING & COMBUSTION ANALYSIS
  // ============================
  window._htHeatCOUpdate = function() {
    var coAmb = _htHeatGetVal('htHeatCOAmbient');
    var coFlue = _htHeatGetVal('htHeatCOFlue');
    var coSupply = _htHeatGetVal('htHeatCOSupply');
    var coReturn = _htHeatGetVal('htHeatCOReturn');
    var o2 = _htHeatGetVal('htHeatCombO2');
    var co2 = _htHeatGetVal('htHeatCombCO2');
    var excessAir = _htHeatGetVal('htHeatCombExcessAir');
    var stackT = _htHeatGetVal('htHeatCombStackT');
    var combEffic = _htHeatGetVal('htHeatCombEffic');
    var coAF = _htHeatGetVal('htHeatCombCOAdj');
    var draft = _htHeatGetVal('htHeatDraft');
    var gasType = (document.getElementById('htHeatGasType') || {}).value || 'ng';
    var hxType = (document.getElementById('htHeatHXType') || {}).value || 'conventional';

    // Determine max CO from all readings
    var maxCO = 0;
    if (coAmb !== null && coAmb > maxCO) maxCO = coAmb;
    if (coSupply !== null && coSupply > maxCO) maxCO = coSupply;
    if (coReturn !== null && coReturn > maxCO) maxCO = coReturn;

    // Update status badge
    var statusEl = document.getElementById('htHeatCOStatus');
    if (statusEl) {
      if (maxCO === 0 && coFlue === null) {
        statusEl.textContent = 'SIN DATOS';
        statusEl.style.background = 'rgba(100,116,139,0.15)';
        statusEl.style.color = '#57574F';
      } else if (maxCO > 100) {
        statusEl.textContent = 'PELIGRO — EVACUAR';
        statusEl.style.background = 'rgba(239,68,68,0.3)';
        statusEl.style.color = '#f87171';
      } else if (maxCO > 35) {
        statusEl.textContent = 'NIVEL ALTO';
        statusEl.style.background = 'rgba(249,115,22,0.25)';
        statusEl.style.color = '#fb923c';
      } else if (maxCO > 9) {
        statusEl.textContent = 'PRECAUCI\u00D3N';
        statusEl.style.background = 'rgba(251,191,36,0.25)';
        statusEl.style.color = '#fbbf24';
      } else {
        statusEl.textContent = 'NORMAL';
        statusEl.style.background = 'rgba(34,197,94,0.2)';
        statusEl.style.color = '#34d399';
      }
    }

    // Store CO values globally
    window._htHeatCOValues = {
      coAmbient: coAmb, coFlue: coFlue, coSupply: coSupply, coReturn: coReturn,
      o2: o2, co2: co2, excessAir: excessAir, stackT: stackT,
      combEffic: combEffic, coAirFree: coAF, draft: draft,
      gasType: gasType, hxType: hxType, maxCO: maxCO
    };

    // CO Diagnostics
    var diagEl = document.getElementById('htHeatCODiag');
    if (!diagEl) return;
    var d = [];
    var hasData = (coAmb !== null || coFlue !== null || coSupply !== null || o2 !== null || draft !== null);
    if (!hasData) { diagEl.innerHTML = ''; return; }

    // Ambient CO analysis
    if (coAmb !== null) {
      if (coAmb >= 200) {
        d.push(['error', 'CO AMBIENT EXTREMO: ' + coAmb + ' ppm \u2014 EVACUAR INMEDIATAMENTE',
          'Nivel letal. Evacuar edificio, ventilar, NO operar equipo. Llamar emergencias. OSHA IDLH: 1200 ppm. A 200+ ppm: dolor de cabeza severo, peligro de muerte en horas.']);
      } else if (coAmb >= 100) {
        d.push(['error', 'CO Ambient peligroso: ' + coAmb + ' ppm',
          'Dolor de cabeza en 1-2 hrs. Apagar equipo, ventilar \u00E1rea, identificar fuente. EPA Action Level: 9 ppm (8-hr TWA). OSHA PEL: 50 ppm.']);
      } else if (coAmb >= 35) {
        d.push(['error', 'CO Ambient alto: ' + coAmb + ' ppm',
          'Excede OSHA Short-Term (35 ppm 1hr). Ventilar y buscar fuente de CO. Posible heat exchanger agrietado, back-drafting, o ventilaci\u00F3n insuficiente.']);
      } else if (coAmb >= 9) {
        d.push(['warn', 'CO Ambient elevado: ' + coAmb + ' ppm',
          'Excede EPA 8-hr TWA (9 ppm). Investigar fuente. Posible combusti\u00F3n incompleta o back-drafting leve.']);
      } else if (coAmb >= 0) {
        d.push(['ok', 'CO Ambient normal: ' + coAmb + ' ppm',
          'Dentro de l\u00EDmites seguros. EPA max 8-hr: 9 ppm.']);
      }
    }

    // Flue CO analysis
    if (coFlue !== null) {
      if (coFlue > 400) {
        d.push(['error', 'CO en flue extremo: ' + coFlue + ' ppm',
          'Combusti\u00F3n muy pobre. Posible heat exchanger da\u00F1ado, burner sucio, gas pressure incorrecto, o aire insuficiente para combusti\u00F3n.']);
      } else if (coFlue > 100) {
        d.push(['warn', 'CO en flue alto: ' + coFlue + ' ppm',
          'Combusti\u00F3n ineficiente. Limpiar burner, verificar gas pressure, check air shutter adjustment. ' + (gasType === 'ng' ? 'NG ideal: <50 ppm AF' : 'LP ideal: <50 ppm AF')]);
      } else if (coFlue <= 100) {
        d.push(['ok', 'CO en flue aceptable: ' + coFlue + ' ppm',
          'Combusti\u00F3n limpia. Nivel ideal: <50 ppm air-free.']);
      }
    }

    // Supply vs Return CO comparison (heat exchanger leak test)
    if (coSupply !== null && coReturn !== null) {
      var coDiff = coSupply - coReturn;
      if (coDiff > 5) {
        d.push(['error', 'POSIBLE FUGA DE HEAT EXCHANGER — CO en supply ' + coDiff + ' ppm mayor que return',
          'Supply CO (' + coSupply + ') vs Return CO (' + coReturn + '): diferencia de ' + coDiff + ' ppm indica posible grieta en heat exchanger. Diferencia >5 ppm es sospechosa. APAGAR EQUIPO y realizar inspecci\u00F3n visual del heat exchanger.']);
      } else if (coDiff > 2) {
        d.push(['warn', 'CO elevado en supply vs return (dif: ' + coDiff + ' ppm)',
          'Monitorear. Supply: ' + coSupply + ' ppm, Return: ' + coReturn + ' ppm. Diferencia peque\u00F1a pero inusual.']);
      } else if (coSupply <= 5 && coReturn <= 5) {
        d.push(['ok', 'Supply/Return CO normal — Heat exchanger OK',
          'Supply: ' + coSupply + ' ppm, Return: ' + coReturn + ' ppm. Sin indicaci\u00F3n de fuga.']);
      }
    }

    // CO Air-Free analysis
    if (coAF !== null) {
      if (coAF > 400) {
        d.push(['error', 'CO Air-Free extremo: ' + coAF + ' ppm',
          'Combusti\u00F3n peligrosa. M\u00E1ximo recomendado: 100 ppm AF para ' + hxType + '. Servicio urgente requerido.']);
      } else if (coAF > 100) {
        d.push(['warn', 'CO Air-Free alto: ' + coAF + ' ppm',
          'Excede l\u00EDmite recomendado de 100 ppm AF. Ajustar combusti\u00F3n: gas pressure, air shutter, burner limpieza.']);
      } else if (coAF <= 100 && coAF >= 0) {
        d.push(['ok', 'CO Air-Free aceptable: ' + coAF + ' ppm',
          'Dentro del l\u00EDmite de 100 ppm AF para equipo ' + hxType + '.']);
      }
    }

    // O2 analysis
    if (o2 !== null) {
      if (o2 < 3) {
        d.push(['error', 'O\u2082 muy bajo: ' + o2.toFixed(1) + '%',
          'Combusti\u00F3n con poco exceso de aire. Riesgo de CO alto. ' + (gasType === 'ng' ? 'NG ideal: 6-9% O\u2082' : 'LP ideal: 5-8% O\u2082')]);
      } else if (o2 > 12) {
        d.push(['warn', 'O\u2082 alto: ' + o2.toFixed(1) + '% — Exceso de aire',
          'Demasiado aire diluyendo los gases. Reduce eficiencia. Verificar air shutter y sellos.']);
      } else if ((gasType === 'ng' && o2 >= 4 && o2 <= 9) || (gasType === 'lp' && o2 >= 4 && o2 <= 8)) {
        d.push(['ok', 'O\u2082 normal: ' + o2.toFixed(1) + '%',
          'Combusti\u00F3n balanceada para ' + (gasType === 'ng' ? 'gas natural' : 'LP/propano') + '.']);
      }
    }

    // CO2 analysis
    if (co2 !== null) {
      var co2Min = gasType === 'ng' ? 8 : 10;
      var co2Max = gasType === 'ng' ? 10 : 12;
      if (co2 < co2Min - 2) {
        d.push(['warn', 'CO\u2082 bajo: ' + co2.toFixed(1) + '% [Normal: ' + co2Min + '-' + co2Max + '%]',
          'Exceso de aire diluyendo productos de combusti\u00F3n. Reduce eficiencia.']);
      } else if (co2 > co2Max + 1) {
        d.push(['warn', 'CO\u2082 alto: ' + co2.toFixed(1) + '% — Posible combusti\u00F3n rica',
          'Puede indicar insuficiente aire para combusti\u00F3n. Riesgo de CO elevado.']);
      } else if (co2 >= co2Min && co2 <= co2Max) {
        d.push(['ok', 'CO\u2082 normal: ' + co2.toFixed(1) + '% [' + co2Min + '-' + co2Max + '%]',
          'Nivel \u00F3ptimo para ' + (gasType === 'ng' ? 'gas natural' : 'LP/propano') + '.']);
      }
    }

    // Draft analysis
    if (draft !== null) {
      if (hxType === 'condensing') {
        // Condensing units use positive pressure venting
        d.push(['ok', 'Unidad condensing — Ventilaci\u00F3n de presi\u00F3n positiva',
          'Unidades 90%+ usan PVC vent con presi\u00F3n positiva. Draft reading: ' + draft.toFixed(3) + '" WC.']);
      } else {
        if (draft > 0) {
          d.push(['error', 'Draft positivo: ' + draft.toFixed(3) + '" WC — BACK-DRAFTING',
            'Gases de combusti\u00F3n entrando al espacio. APAGAR equipo. Verificar chimney, blockages, CAZ (Combustion Air Zone), y exhaust fans.']);
        } else if (draft > -0.01) {
          d.push(['warn', 'Draft insuficiente: ' + draft.toFixed(3) + '" WC',
            'Borderline. M\u00EDnimo recomendado: -0.02" WC. Verificar flue sizing, cap, y obstrucciones.']);
        } else if (draft >= -0.05 && draft <= -0.01) {
          d.push(['ok', 'Draft normal: ' + draft.toFixed(3) + '" WC',
            'Tiro negativo adecuado. Gases evacuando correctamente.']);
        } else if (draft < -0.05) {
          d.push(['warn', 'Draft excesivo: ' + draft.toFixed(3) + '" WC',
            'Tiro muy fuerte puede enfriar heat exchanger y reducir eficiencia. Considerar barometric damper.']);
        }
      }
    }

    // Stack temperature analysis (relative to combustion)
    if (stackT !== null) {
      if (hxType === 'condensing') {
        if (stackT > 150) {
          d.push(['warn', 'Stack temp alta para condensing: ' + stackT.toFixed(0) + '\u00B0F',
            'Unidades condensing deben tener stack temp <150\u00B0F. Verificar heat exchanger secundario.']);
        } else {
          d.push(['ok', 'Stack temp normal para condensing: ' + stackT.toFixed(0) + '\u00B0F',
            'Operando correctamente. Condensando gases de combusti\u00F3n.']);
        }
      } else {
        if (stackT > 500) {
          d.push(['warn', 'Stack temp alta: ' + stackT.toFixed(0) + '\u00B0F',
            'Calor desperdiciado. Heat exchanger puede estar sucio o hay over-fire.']);
        } else if (stackT < 250 && stackT > 0) {
          d.push(['warn', 'Stack temp baja: ' + stackT.toFixed(0) + '\u00B0F',
            'Riesgo de condensaci\u00F3n en flue. Puede da\u00F1ar chimney liner.']);
        } else if (stackT >= 300 && stackT <= 500) {
          d.push(['ok', 'Stack temp normal: ' + stackT.toFixed(0) + '\u00B0F',
            'Rango esperado para equipo convencional: 300-500\u00B0F.']);
        }
      }
    }

    // Render diagnostics
    if (d.length > 0) {
      var dh = '<div style="border-top:1px solid rgba(239,68,68,0.15);padding-top:8px;">';
      dh += '<div style="font-size:12px;font-weight:800;color:#f87171;margin-bottom:5px;letter-spacing:0.3px;">DIAGN\u00D3STICO CO / COMBUSTI\u00D3N</div>';
      for (var di = 0; di < d.length; di++) {
        var dd = d[di];
        var ic = dd[0] === 'error' ? '#f87171' : dd[0] === 'warn' ? '#fbbf24' : '#34d399';
        var sym = dd[0] === 'error' ? '\u274C' : dd[0] === 'warn' ? '\u26A0\uFE0F' : '\u2705';
        dh += '<div style="display:flex;gap:5px;align-items:flex-start;margin-bottom:4px;padding:5px;background:' + ic + '10;border-radius:5px;">';
        dh += '<span style="font-size:13px;flex-shrink:0;">' + sym + '</span>';
        dh += '<div><div style="font-size:13px;font-weight:700;color:' + ic + ';">' + dd[1] + '</div>';
        dh += '<div style="font-size:12px;color:#111111;margin-top:1px;">' + dd[2] + '</div></div></div>';
      }
      dh += '</div>';
      diagEl.innerHTML = dh;
    } else {
      diagEl.innerHTML = '';
    }
  };

  // ============================
  // REPORT GENERATION
  // ============================
  window._htHeatGenReport = function(type) {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      if (typeof window.showToast === 'function') window.showToast('Cargando librer\u00EDa PDF... intenta de nuevo en 2 segundos.'); else window.MaestroDialog.alert({title: '', message: 'Cargando librer\u00EDa PDF... intenta de nuevo en 2 segundos.', kind: 'info'});
      // Try to load jsPDF dynamically
      if (typeof MaestroLoader !== 'undefined') {
        MaestroLoader.load(['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js']);
      }
      return;
    }
    var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4' });
    var y = 0;

    // Colors
    var BRAND = [249, 115, 22];
    var DARK = [10, 22, 40];
    var HDR = [15, 30, 55];
    var TXT = [226, 232, 240];
    var GRN = [34, 197, 94];
    var BLU = [59, 130, 246];
    var RED = [239, 68, 68];
    var YEL = [251, 191, 36];
    var MUT = [100, 116, 139];

    // Helper: section header
    function secHeader(title, color) {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(10, y, 3, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(title, 16, y + 5);
      y += 10;
    }

    // Helper: data row
    function dataRow(label, value, color) {
      if (y > 270) { doc.addPage(); y = 15; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      doc.text(label, 14, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(color ? color[0] : TXT[0], color ? color[1] : TXT[1], color ? color[2] : TXT[2]);
      doc.text(String(value || '--'), 90, y);
      y += 5;
    }

    // Helper: status row with pass/fail
    function statusRow(label, value, status) {
      if (y > 270) { doc.addPage(); y = 15; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      doc.text(label, 14, y);
      doc.setFont('helvetica', 'bold');
      var sc = status === 'ok' ? GRN : status === 'warn' ? YEL : RED;
      doc.setTextColor(sc[0], sc[1], sc[2]);
      doc.text(String(value || '--'), 90, y);
      var badge = status === 'ok' ? 'PASS' : status === 'warn' ? 'CHECK' : 'FAIL';
      doc.setFillColor(sc[0], sc[1], sc[2]);
      doc.roundedRect(150, y - 3.5, 18, 5, 1.5, 1.5, 'F');
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text(badge, 159, y - 0.5, { align: 'center' });
      y += 6;
    }

    // Get technician + equipment info from form
    var eqInfo = window._htHeatEquip || {};
    var techName = eqInfo.techName || 'T\u00E9cnico HVAC';
    var techEmail = eqInfo.techEmail || '';
    var techNum = eqInfo.techNum || '';
    try {
      if (!techName || techName === 'T\u00E9cnico HVAC') {
        var u = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
        techName = u.nombre || u.name || u.email || techName;
        techEmail = techEmail || localStorage.getItem('tecnico_email') || '';
      }
    } catch(e) {}
    var _wx = window.MaestroWeather || {};

    // ========== HEADER (shared) ==========
    doc.setFillColor(DARK[0], DARK[1], DARK[2]);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setFillColor(BRAND[0], BRAND[1], BRAND[2]);
    doc.rect(0, 38, 210, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('MAESTRO HVACR', 15, 14);

    var sysLabels = {
      minihp: 'Mini Split Heat Pump', hp: 'Heat Pump', vrf: 'VRF',
      centralhp: 'Central HP', pkghp: 'Package HP',
      waterht: 'Water Heater', waterhp: 'Water HP'
    };

    if (type === 'co') {
      // ===================================
      // CO SAFETY REPORT
      // ===================================
      doc.setFontSize(11);
      doc.setTextColor(RED[0], RED[1], RED[2]);
      doc.text('REPORTE DE MON\u00D3XIDO DE CARBONO (CO)', 15, 22);
      doc.setFontSize(8);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      doc.text('Carbon Monoxide Safety Report \u2014 Combustion Analysis', 15, 28);

      // Tech + date info
      doc.setTextColor(TXT[0], TXT[1], TXT[2]);
      doc.setFontSize(7);
      doc.text('T\u00E9cnico: ' + techName + (techNum ? ' #' + techNum : '') + (techEmail ? ' (' + techEmail + ')' : ''), 15, 34);
      var now = new Date();
      doc.text('Fecha: ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString(), 130, 34);

      y = 44;
      var co = window._htHeatCOValues || {};

      // Equipment + Client info
      secHeader('INFORMACI\u00D3N DEL EQUIPO Y CLIENTE', BRAND);
      dataRow('Modelo', eqInfo.model || 'N/A');
      dataRow('N\u00FAmero de Serie', eqInfo.serial || 'N/A');
      dataRow('Cliente', eqInfo.clientName || 'N/A');
      dataRow('Direcci\u00F3n', eqInfo.clientAddr || 'N/A');
      dataRow('Tipo de Sistema', sysLabels[_sysType] || _sysType);
      dataRow('Tipo de Gas', co.gasType === 'lp' ? 'LP/Propano' : 'Gas Natural');
      dataRow('Heat Exchanger', co.hxType === 'condensing' ? 'Condensing (90%+)' : co.hxType === 'boiler' ? 'Boiler' : 'Convencional');
      if (_wx.city) dataRow('Ubicaci\u00F3n', _wx.city);
      y += 3;

      // CO Readings
      secHeader('LECTURAS DE CO (ppm)', RED);
      statusRow('CO Ambiente', co.coAmbient !== null ? co.coAmbient + ' ppm' : 'N/A',
        co.coAmbient === null ? 'warn' : co.coAmbient > 35 ? 'error' : co.coAmbient > 9 ? 'warn' : 'ok');
      statusRow('CO Flue/Chimney', co.coFlue !== null ? co.coFlue + ' ppm' : 'N/A',
        co.coFlue === null ? 'warn' : co.coFlue > 400 ? 'error' : co.coFlue > 100 ? 'warn' : 'ok');
      statusRow('CO Supply Air', co.coSupply !== null ? co.coSupply + ' ppm' : 'N/A',
        co.coSupply === null ? 'warn' : co.coSupply > 35 ? 'error' : co.coSupply > 9 ? 'warn' : 'ok');
      statusRow('CO Return Air', co.coReturn !== null ? co.coReturn + ' ppm' : 'N/A',
        co.coReturn === null ? 'warn' : co.coReturn > 35 ? 'error' : co.coReturn > 9 ? 'warn' : 'ok');
      statusRow('CO Air-Free', co.coAirFree !== null ? co.coAirFree + ' ppm AF' : 'N/A',
        co.coAirFree === null ? 'warn' : co.coAirFree > 100 ? 'error' : co.coAirFree > 50 ? 'warn' : 'ok');
      y += 3;

      // Heat Exchanger Integrity
      secHeader('INTEGRIDAD DEL HEAT EXCHANGER', YEL);
      if (co.coSupply !== null && co.coReturn !== null) {
        var hxDiff = co.coSupply - co.coReturn;
        statusRow('CO Supply vs Return', 'Dif: ' + hxDiff + ' ppm (S:' + co.coSupply + ' / R:' + co.coReturn + ')',
          hxDiff > 5 ? 'error' : hxDiff > 2 ? 'warn' : 'ok');
        dataRow('Resultado', hxDiff > 5 ? 'POSIBLE FUGA EN HEAT EXCHANGER' : hxDiff > 2 ? 'MONITOREAR' : 'SIN INDICACI\u00D3N DE FUGA',
          hxDiff > 5 ? RED : hxDiff > 2 ? YEL : GRN);
      } else {
        dataRow('Heat Exchanger Test', 'Datos insuficientes \u2014 Requiere CO Supply y Return', YEL);
      }
      y += 3;

      // Combustion Analysis
      secHeader('AN\u00C1LISIS DE COMBUSTI\u00D3N', BRAND);
      var co2Ref = co.gasType === 'ng' ? '8-10%' : '10-12%';
      statusRow('O\u2082', co.o2 !== null ? co.o2.toFixed(1) + '%' : 'N/A',
        co.o2 === null ? 'warn' : co.o2 < 3 ? 'error' : co.o2 > 12 ? 'warn' : 'ok');
      statusRow('CO\u2082', co.co2 !== null ? co.co2.toFixed(1) + '% (Ref: ' + co2Ref + ')' : 'N/A',
        co.co2 === null ? 'warn' : (co.gasType === 'ng' ? (co.co2 >= 8 && co.co2 <= 10 ? 'ok' : 'warn') : (co.co2 >= 10 && co.co2 <= 12 ? 'ok' : 'warn')));
      statusRow('Exceso de Aire', co.excessAir !== null ? co.excessAir.toFixed(1) + '%' : 'N/A',
        co.excessAir === null ? 'warn' : co.excessAir >= 15 && co.excessAir <= 50 ? 'ok' : 'warn');
      statusRow('Stack Temp', co.stackT !== null ? co.stackT.toFixed(0) + '\u00B0F' : 'N/A',
        co.stackT === null ? 'warn' : (co.hxType === 'condensing' ? (co.stackT < 150 ? 'ok' : 'warn') : (co.stackT >= 300 && co.stackT <= 500 ? 'ok' : 'warn')));
      statusRow('Eficiencia Combusti\u00F3n', co.combEffic !== null ? co.combEffic.toFixed(1) + '%' : 'N/A',
        co.combEffic === null ? 'warn' : co.combEffic >= 80 ? 'ok' : 'warn');
      y += 3;

      // Draft
      secHeader('DRAFT / TIRO', BLU);
      statusRow('Draft', co.draft !== null ? co.draft.toFixed(3) + '" WC' : 'N/A',
        co.draft === null ? 'warn' : (co.hxType === 'condensing' ? 'ok' : (co.draft > 0 ? 'error' : co.draft > -0.01 ? 'warn' : 'ok')));
      y += 3;

      // Reference table
      secHeader('EST\u00C1NDARES DE REFERENCIA CO', MUT);
      doc.setFontSize(7);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      var refs = [
        'EPA 8-hr TWA: 9 ppm | OSHA PEL: 50 ppm (8-hr) | OSHA STEL: 200 ppm (15 min)',
        'ASHRAE 62.1: 9 ppm | ACGIH TLV-TWA: 25 ppm | NIOSH REL: 35 ppm',
        'UL 2034 Alarm: 70 ppm (1-4 hrs), 150 ppm (10-50 min), 400 ppm (4-15 min)',
        'CO Air-Free Max: 100 ppm (convencional), 50 ppm (condensing)',
        'Draft Natural: -0.02 to -0.05" WC | Condensing: positive pressure OK'
      ];
      for (var ri = 0; ri < refs.length; ri++) {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(refs[ri], 14, y);
        y += 4;
      }

    } else {
      // ===================================
      // SYSTEM PERFORMANCE REPORT
      // ===================================
      doc.setFontSize(11);
      doc.setTextColor(BRAND[0], BRAND[1], BRAND[2]);
      doc.text('REPORTE SYSTEM PERFORMANCE \u2014 CALEFACCI\u00D3N', 15, 22);
      doc.setFontSize(8);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      doc.text('Heating System Diagnostic Report', 15, 28);

      doc.setTextColor(TXT[0], TXT[1], TXT[2]);
      doc.setFontSize(7);
      doc.text('T\u00E9cnico: ' + techName + (techNum ? ' #' + techNum : '') + (techEmail ? ' (' + techEmail + ')' : ''), 15, 34);
      var now2 = new Date();
      doc.text('Fecha: ' + now2.toLocaleDateString() + ' ' + now2.toLocaleTimeString(), 130, 34);

      y = 44;
      var cv = window._htHeatCalcValues || {};
      var mdLabels = { txv: 'TXV', piston: 'Pist\u00F3n', cap: 'Cap Tube', eev: 'EEV' };

      // Equipment + Client info
      secHeader('INFORMACI\u00D3N DEL EQUIPO Y CLIENTE', BRAND);
      dataRow('Modelo', eqInfo.model || 'N/A');
      dataRow('N\u00FAmero de Serie', eqInfo.serial || 'N/A');
      dataRow('Cliente', eqInfo.clientName || 'N/A');
      dataRow('Direcci\u00F3n', eqInfo.clientAddr || 'N/A');
      dataRow('Tipo de Sistema', sysLabels[cv.sysType] || cv.sysType);
      if (!_isWaterType) {
        dataRow('Refrigerante', cv.refrigerant || 'R-410A');
        dataRow('Metering Device', mdLabels[cv.meteringDevice] || 'TXV');
        dataRow('Reversing Valve', (cv.rvStatus || 'heating').toUpperCase());
        dataRow('Aux Heat', (cv.auxHeat || 'off').toUpperCase());
        dataRow('Defrost Status', (cv.defrostStatus || 'none').toUpperCase());
      }
      if (_wx.city) dataRow('Ubicaci\u00F3n', _wx.city);
      if (_wx.tempF !== null && _wx.tempF !== undefined) dataRow('Outdoor Temp (GPS)', _wx.tempF.toFixed(1) + '\u00B0F');
      y += 3;

      if (!_isWaterType || cv.sysType === 'waterhp') {
        // Pressures
        secHeader('PRESIONES Y TEMPERATURAS SATURADAS', BLU);
        dataRow('Low Side (Evap Exterior)', (cv.loPsi || 0) + ' psig', BLU);
        dataRow('High Side (Cond Interior)', (cv.hiPsi || 0) + ' psig', RED);
        dataRow('Evap Sat', cv.evapSat !== null ? cv.evapSat.toFixed(1) + '\u00B0F' : 'N/A', BLU);
        dataRow('Cond Sat', cv.condSat !== null ? cv.condSat.toFixed(1) + '\u00B0F' : 'N/A', RED);
        y += 3;

        // Field temps
        secHeader('TEMPERATURAS DE CAMPO', BRAND);
        dataRow('Suction Line (Outdoor)', cv.suctionT !== null ? cv.suctionT + '\u00B0F' : 'N/A');
        dataRow('Liquid Line', cv.liquidT !== null ? cv.liquidT + '\u00B0F' : 'N/A');
        dataRow('Discharge Line', cv.dischargeT !== null ? cv.dischargeT + '\u00B0F' : 'N/A');
        dataRow('Outdoor Ambient', cv.outdoorT !== null ? cv.outdoorT + '\u00B0F' : 'N/A');
        dataRow('Indoor Return', cv.indoorT !== null ? cv.indoorT + '\u00B0F' : 'N/A');
        dataRow('Supply Air', cv.supplyT !== null ? cv.supplyT + '\u00B0F' : 'N/A');
        dataRow('Delta-T', cv.deltaT !== null ? cv.deltaT.toFixed(1) + '\u00B0F' : 'N/A');
        y += 3;

        // Diagnostics
        secHeader('AN\u00C1LISIS DEL SISTEMA', GRN);
        var sysR = HEAT_RANGES[cv.sysType] || HEAT_RANGES.hp;
        statusRow('Superheat', cv.sh !== null ? cv.sh.toFixed(1) + '\u00B0F' : 'N/A',
          cv.sh === null ? 'warn' : (cv.sh >= sysR.shMin && cv.sh <= sysR.shMax) ? 'ok' : (cv.sh < 3 || cv.sh > sysR.shMax + 10) ? 'error' : 'warn');
        statusRow('Subcooling', cv.sc !== null ? cv.sc.toFixed(1) + '\u00B0F' : 'N/A',
          cv.sc === null ? 'warn' : (cv.sc >= sysR.scMin && cv.sc <= sysR.scMax) ? 'ok' : (cv.sc < 2 || cv.sc > sysR.scMax + 6) ? 'error' : 'warn');
        statusRow('Compression Ratio', cv.cr !== null ? cv.cr.toFixed(2) + ':1' : 'N/A',
          cv.cr === null ? 'warn' : cv.cr >= 2.0 && cv.cr <= 3.5 ? 'ok' : cv.cr > 5 ? 'error' : 'warn');
        statusRow('Delta-T', cv.deltaT !== null ? cv.deltaT.toFixed(1) + '\u00B0F' : 'N/A',
          cv.deltaT === null ? 'warn' : cv.deltaT >= (sysR.dtMin || 15) && cv.deltaT <= (sysR.dtMax || 25) ? 'ok' : 'warn');
      }

      if (_isWaterType && cv.sysType === 'waterht') {
        secHeader('DATOS DEL WATER HEATER', BRAND);
        dataRow('Inlet Water Temp', cv.waterIn !== null ? cv.waterIn + '\u00B0F' : 'N/A');
        dataRow('Outlet Water Temp', cv.waterOut !== null ? cv.waterOut + '\u00B0F' : 'N/A');
        statusRow('Temperature Rise', cv.rise !== null ? cv.rise.toFixed(1) + '\u00B0F' : 'N/A',
          cv.rise === null ? 'warn' : cv.rise >= 40 && cv.rise <= 70 ? 'ok' : 'warn');
        dataRow('Flow Rate', cv.flowGPM !== null ? cv.flowGPM + ' GPM' : 'N/A');
        statusRow('Gas Pressure', cv.gasPressure !== null ? cv.gasPressure + '" WC' : 'N/A',
          cv.gasPressure === null ? 'warn' : (cv.gasPressure >= 3.2 && cv.gasPressure <= 4.0) || (cv.gasPressure >= 9 && cv.gasPressure <= 11) ? 'ok' : 'warn');
        dataRow('Flue Temp', cv.flueTempF !== null ? cv.flueTempF + '\u00B0F' : 'N/A');
        dataRow('BTU/hr', cv.btuHr !== null ? Math.round(cv.btuHr).toLocaleString() : 'N/A');
        statusRow('Eficiencia', cv.efficiency !== null ? cv.efficiency.toFixed(0) + '%' : 'N/A',
          cv.efficiency === null ? 'warn' : cv.efficiency >= 90 ? 'ok' : cv.efficiency >= 80 ? 'ok' : 'warn');
      }

      // CO section in system report (if data exists)
      var co2 = window._htHeatCOValues || {};
      if (co2.coAmbient !== null || co2.coFlue !== null || co2.draft !== null) {
        if (y > 230) { doc.addPage(); y = 15; }
        secHeader('MON\u00D3XIDO DE CARBONO (CO)', RED);
        if (co2.coAmbient !== null) statusRow('CO Ambiente', co2.coAmbient + ' ppm',
          co2.coAmbient > 35 ? 'error' : co2.coAmbient > 9 ? 'warn' : 'ok');
        if (co2.coFlue !== null) statusRow('CO Flue', co2.coFlue + ' ppm',
          co2.coFlue > 400 ? 'error' : co2.coFlue > 100 ? 'warn' : 'ok');
        if (co2.coSupply !== null) dataRow('CO Supply', co2.coSupply + ' ppm');
        if (co2.coReturn !== null) dataRow('CO Return', co2.coReturn + ' ppm');
        if (co2.coAirFree !== null) statusRow('CO Air-Free', co2.coAirFree + ' ppm AF',
          co2.coAirFree > 100 ? 'error' : co2.coAirFree > 50 ? 'warn' : 'ok');
        if (co2.draft !== null) dataRow('Draft', co2.draft.toFixed(3) + '" WC');
      }
    }

    // Footer
    if (y > 265) { doc.addPage(); y = 15; }
    var pageCount = doc.getNumberOfPages();
    for (var p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFillColor(DARK[0], DARK[1], DARK[2]);
      doc.rect(0, 287, 210, 10, 'F');
      doc.setFontSize(6);
      doc.setTextColor(MUT[0], MUT[1], MUT[2]);
      doc.text('Generado por Maestro HVACR \u2014 maestrohvacr.com', 15, 293);
      doc.text('P\u00E1gina ' + p + ' de ' + pageCount, 185, 293);
    }

    // Save
    var fname = type === 'co' ? 'CO-Safety-Report' : 'System-Performance-Heating';
    var name = 'ACVOLT-' + fname + '-' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(name);

    // Show share bar
    var barEl = document.getElementById('htHeatReportBar');
    if (barEl) {
      barEl.innerHTML = '<div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:10px;padding:10px;text-align:center;margin-top:4px;">' +
        '<div style="font-size:13px;color:#34d399;font-weight:700;margin-bottom:6px;">\u2705 Reporte generado: ' + name + '</div>' +
        '<div style="display:flex;gap:6px;justify-content:center;">' +
        '<button onclick="_htHeatShareReport(\'' + type + '\')" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(34,197,94,0.3);background:rgba(34,197,94,0.1);color:#4ade80;font-size:13px;font-weight:700;cursor:pointer;">Compartir</button>' +
        '<button onclick="_htHeatPrintReport(\'' + type + '\')" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(168,85,247,0.3);background:rgba(168,85,247,0.1);color:#111111;font-size:13px;font-weight:700;cursor:pointer;">Imprimir</button>' +
        '</div></div>';
    }
  };

  // Share report
  window._htHeatShareReport = function(type) {
    window._htHeatGenReportBlob(type, function(blob, name) {
      var file = new File([blob], name, { type: 'application/pdf' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Reporte HVAC \u2014 Maestro HVACR' }).catch(function() {});
      } else {
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
      }
    });
  };

  // Print report
  window._htHeatPrintReport = function(type) {
    window._htHeatGenReportBlob(type, function(blob) {
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
    });
  };

  // Helper to regenerate as blob
  window._htHeatGenReportBlob = function(type, cb) {
    // Temporarily redirect doc.save to capture blob
    var origSave = window._htHeatGenReport;
    // Re-generate but capture blob instead of saving
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') return;
    var jsPDF2 = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    // Just regenerate via same flow but intercept
    // Simplest: call _htHeatGenReport which saves, then user uses share from OS
    // For now, trigger the download which user can then share
    window._htHeatGenReport(type);
  };

  // ============================
  // BLE AUTO-POPULATE SUPPORT
  // ============================
  // This function is called by ble-manager.js when new data arrives
  // It checks if the heating screen is active and populates the right fields
  window._htHeatBLEPopulate = function(field, value) {
    if (window._htActiveTool !== 'heating') return;

    var el = document.getElementById(field);
    if (!el) return;

    if (el.tagName === 'INPUT') {
      el.value = value;
    } else {
      el.textContent = value;
    }

    // Green glow feedback for BLE-populated fields
    el.style.boxShadow = '0 0 8px rgba(52,211,153,0.5)';
    el.style.borderColor = 'rgba(52,211,153,0.4)';
    setTimeout(function() {
      el.style.boxShadow = '';
      el.style.borderColor = '';
    }, 3000);

    // Trigger recalculation
    _htHeatUpdate();
  };

  // BLE field mapping for heating screen
  // Pressure fields
  window._htHeatBLEFieldMap = {
    // SM480V / SMAN pressures
    lowPressure: 'htHeatLoInput',
    highPressure: 'htHeatHiInput',
    // Pipe clamp temperatures
    suctionTemp: 'htHeatSuctionT',
    liquidTemp: 'htHeatLiquidT',
    dischargeTemp: 'htHeatDischargeT',
    // SC680 electrical
    voltage: 'htHeatVoltage',
    amps: 'htHeatAmps',
    watts: 'htHeatWatts',
    capacitance: 'htHeatCapuF',
    resistance: 'htHeatOhms',
    temperature: 'htHeatTempF',
    // JL3RH psychrometer
    enterDB: 'htHeatAirEnterDB',
    enterWB: 'htHeatAirEnterWB',
    enterRH: 'htHeatAirEnterRH',
    leaveDB: 'htHeatAirLeaveDB',
    leaveWB: 'htHeatAirLeaveWB',
    leaveRH: 'htHeatAirLeaveRH'
  };

  // Handle Fieldpiece device data for heating
  window._htHeatOnFPData = function(deviceType, data) {
    if (window._htActiveTool !== 'heating') return;
    var map = window._htHeatBLEFieldMap;

    if (deviceType === 'SM480V' || deviceType === 'SMAN') {
      if (data.lowPsi !== undefined) {
        window._htHeatBLEPopulate(map.lowPressure, data.lowPsi.toFixed(1));
        // Also sync slider
        var slider = document.getElementById('htHeatLoPsi');
        if (slider) slider.value = Math.round(data.lowPsi);
        var lcd = document.getElementById('htHeatLoLCD');
        if (lcd) lcd.textContent = data.lowPsi.toFixed(1);
      }
      if (data.highPsi !== undefined) {
        window._htHeatBLEPopulate(map.highPressure, data.highPsi.toFixed(1));
        var slider2 = document.getElementById('htHeatHiPsi');
        if (slider2) slider2.value = Math.round(data.highPsi);
        var lcd2 = document.getElementById('htHeatHiLCD');
        if (lcd2) lcd2.textContent = data.highPsi.toFixed(1);
      }
      if (data.suctionTempF !== undefined) {
        window._htHeatBLEPopulate(map.suctionTemp, data.suctionTempF.toFixed(1));
      }
      if (data.liquidTempF !== undefined) {
        window._htHeatBLEPopulate(map.liquidTemp, data.liquidTempF.toFixed(1));
      }
    }

    if (deviceType === 'SC680') {
      if (data.voltage !== undefined) window._htHeatBLEPopulate(map.voltage, data.voltage.toFixed(1));
      if (data.amps !== undefined) window._htHeatBLEPopulate(map.amps, data.amps.toFixed(2));
      if (data.watts !== undefined) window._htHeatBLEPopulate(map.watts, data.watts.toFixed(0));
      if (data.capacitance !== undefined) window._htHeatBLEPopulate(map.capacitance, data.capacitance.toFixed(1));
      if (data.resistance !== undefined) window._htHeatBLEPopulate(map.resistance, data.resistance.toFixed(1));
      if (data.tempF !== undefined) window._htHeatBLEPopulate(map.temperature, data.tempF.toFixed(1));

      // Update status indicator
      var statusEl = document.getElementById('htHeatElecStatus');
      if (statusEl) {
        statusEl.innerHTML = '<span style="color:#34d399;">SC680 Connected</span>';
      }
    }

    if (deviceType === 'JL3RH') {
      if (data.db !== undefined) {
        window._htHeatBLEPopulate(map.enterDB, data.db.toFixed(1));
      }
      if (data.wb !== undefined) {
        window._htHeatBLEPopulate(map.enterWB, data.wb.toFixed(1));
      }
      if (data.rh !== undefined) {
        window._htHeatBLEPopulate(map.enterRH, data.rh.toFixed(1));
      }
    }
  };

  // ============================
  // EXPOSE GLOBALS
  // ============================
  // All window-scoped function assignments are already done inline above.
  // Summary of exposed globals:
  // window.initHeatingScreen — Main entry point
  // window._htShowHeating — Render function
  // window._htHeatUpdate — Master recalculation
  // window._htHeatSetSys — System type change
  // window._htHeatSetMD — Metering device change
  // window._htHeatSetRV — Reversing valve change
  // window._htHeatSetAux — Aux heat change
  // window._htHeatSetDefrost — Defrost status change
  // window._htHeatSyncSlider — Pressure slider sync
  // window._htHeatSyncInput — Input sync
  // window._htHeatGetVal — Safe value getter
  // window._htHeatAirCalc — Air analysis calculator
  // window._htHeatCOUpdate — CO monitoring & combustion analysis
  // window._htHeatGenReport — Report generator (system/co)
  // window._htHeatShareReport — Share report
  // window._htHeatPrintReport — Print report
  // window._htHeatDiagnoseSystem — Heat pump diagnostic engine
  // window._htHeatDiagnoseWater — Water heater diagnostic engine
  // window._htHeatIADiagnose — AI diagnosis
  // window._htHeatStatBox — Stat box renderer
  // window._htHeatBLEPopulate — BLE auto-populate handler
  // window._htHeatBLEFieldMap — BLE field mapping
  // window._htHeatOnFPData — Fieldpiece device data handler
  // window._htHeatSysType — Current system type
  // window._htHeatMeteringDevice — Current metering device
  // window._htHeatCalcValues — All calculated values
  // window._htHeatCOValues — CO and combustion values

})();
