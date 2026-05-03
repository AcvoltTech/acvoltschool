// Maestro Pro · Refrigeración Diagnóstica calculators
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};

  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }
  function num(v,d){ var n=parseFloat(v); return isNaN(n)?(d||0):n; }
  function pick(obj, path, def){
    if (!obj) return def;
    var parts = path.split('.');
    var cur = obj;
    for (var i=0;i<parts.length;i++){
      if (cur == null) return def;
      cur = cur[parts[i]];
    }
    return (cur == null) ? def : cur;
  }

  // ── Typical operating pressure constants ────────────────────────
  // Slopes approximate high-side and low-side PSIG scaling with
  // ambient °F for a properly-charged residential system running at
  // design load. These are field rules-of-thumb, not lab-exact.
  var OP_PRESS = {
    'R-410A': { highPerF: 2.15, lowPerF: 1.05, highBase:  35, lowBase:  40, superheat: 10, subcool: 10, satLow:  118, satHigh: 350 },
    'R-22':   { highPerF: 1.55, lowPerF: 0.85, highBase:  25, lowBase:  18, superheat: 10, subcool: 10, satLow:   69, satHigh: 240 },
    'R-32':   { highPerF: 2.30, lowPerF: 1.15, highBase:  40, lowBase:  45, superheat: 10, subcool: 10, satLow:  128, satHigh: 380 },
    'R-454B': { highPerF: 2.05, lowPerF: 1.00, highBase:  32, lowBase:  38, superheat: 10, subcool: 10, satLow:  112, satHigh: 335 },
    'R-407C': { highPerF: 1.60, lowPerF: 0.90, highBase:  22, lowBase:  22, superheat: 10, subcool: 10, satLow:   75, satHigh: 260 },
    'R-134a': { highPerF: 1.05, lowPerF: 0.55, highBase:   5, lowBase:   5, superheat: 10, subcool: 10, satLow:   40, satHigh: 160 }
  };
  var REFRIG_LIST_ALL = ['R-410A','R-22','R-32','R-454B','R-407C','R-134a'];
  var REFRIG_LIST_OP  = ['R-410A','R-22','R-32','R-454B','R-407C','R-134a'];
  var REFRIG_LIST_DIAG= ['R-410A','R-22','R-32','R-454B','R-407C','R-134a'];

  // ── A2L refrigerant safety constants (IEC 60335-2-40 / UL 60335-2-40)
  // RCL = Refrigerant Concentration Limit (kg/m³). Max charge per room
  // for comfort cooling uses m1 / m2 / m3 thresholds; here we surface
  // the practical max charge = RCL × room volume × 0.5 safety factor.
  var A2L_LIMITS = {
    'R-32':    { rcl: 0.061, lfl: 0.307, gwp:  675, class:'A2L', m1: 1.84 },
    'R-454B':  { rcl: 0.059, lfl: 0.299, gwp:  466, class:'A2L', m1: 1.78 },
    'R-1234yf':{ rcl: 0.058, lfl: 0.289, gwp:    1, class:'A2L', m1: 1.73 },
    'R-452B':  { rcl: 0.060, lfl: 0.304, gwp:  698, class:'A2L', m1: 1.81 }
  };
  var A2L_LIST = ['R-32','R-454B','R-1234yf','R-452B'];

  // ── EPA §608 Subpart F leak-rate thresholds (annualized) ────────
  var EPA_THRESHOLDS = {
    'commercial':  { pct: 20, labelEs:'Refrigeración comercial', labelEn:'Commercial refrigeration' },
    'comfort':     { pct: 10, labelEs:'Confort (comfort cooling)', labelEn:'Comfort cooling' },
    'industrial':  { pct: 30, labelEs:'Proceso industrial', labelEn:'Industrial process refrigeration' }
  };
  // Note: 2019 EPA rollback reset comfort to 10% for appliances ≥50 lb;
  // 20/30/35 were pre-rollback. We expose both: threshold used is the
  // current enforceable one for §608 appliances ≥50 lb.

  function fmt(n, d){
    if (!isFinite(n)) return '—';
    d = (d==null) ? 1 : d;
    return (Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toFixed(d);
  }

  // ═══════════════════════════════════════════════════════════════
  // 1) EVACUATION — time estimate + <500µ standard
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['evacuation'] = {
    i18n: {
      es: {
        mp_ev_title:'Evacuación',
        mp_ev_sub:'Micrones objetivo + tiempo estimado',
        mp_ev_tons:'Tonelaje del sistema',
        mp_ev_tons_u:'toneladas',
        mp_ev_cfm:'CFM de la bomba',
        mp_ev_cfm_u:'CFM',
        mp_ev_mi:'Micrones iniciales',
        mp_ev_mi_u:'µ',
        mp_ev_mt:'Micrones objetivo',
        mp_ev_mt_u:'µ (default 500)',
        mp_ev_res_lbl:'Tiempo estimado',
        mp_ev_u:'min',
        mp_ev_desc:'Basado en volumen de cobre + aceite + carga',
        mp_ev_std:'Estándar HVAC',
        mp_ev_std_val:'<500µ y mantener 15 min',
        mp_ev_status:'Estado',
        mp_ev_pass:'✓ PASA (holds <500µ 15 min)',
        mp_ev_fail:'⚠ FALLA (humedad/fuga presente)',
        mp_ev_vol:'Volumen del sistema',
        mp_ev_vol_u:'pies³',
        mp_ev_case:'RTU 5 ton en azotea, carga fresca. Bomba de 6 CFM empezó en 8,000µ — debe llegar a 500µ en ~18 min. Si tarda más, hay humedad o una fuga.',
        mp_ev_tip:'Triple evacuación con N2 seco entre ciclos elimina humedad 10× más rápido que un solo jalón largo. Medí con micrómetro calibrado, NO con el manifold.'
      },
      en: {
        mp_ev_title:'Evacuation',
        mp_ev_sub:'Target microns + estimated time',
        mp_ev_tons:'System tonnage',
        mp_ev_tons_u:'tons',
        mp_ev_cfm:'Pump CFM',
        mp_ev_cfm_u:'CFM',
        mp_ev_mi:'Initial microns',
        mp_ev_mi_u:'µ',
        mp_ev_mt:'Target microns',
        mp_ev_mt_u:'µ (default 500)',
        mp_ev_res_lbl:'Estimated time',
        mp_ev_u:'min',
        mp_ev_desc:'Based on copper + oil + charge volume',
        mp_ev_std:'HVAC standard',
        mp_ev_std_val:'<500µ and hold for 15 min',
        mp_ev_status:'Status',
        mp_ev_pass:'✓ PASS (holds <500µ for 15 min)',
        mp_ev_fail:'⚠ FAIL (moisture/leak present)',
        mp_ev_vol:'System volume',
        mp_ev_vol_u:'ft³',
        mp_ev_case:'5-ton rooftop, virgin charge. A 6-CFM pump starting at 8,000µ should hit 500µ in ~18 min. If it takes longer you have moisture or a leak.',
        mp_ev_tip:'Triple evac with dry N2 between pulls removes moisture 10× faster than one long pull. Measure with a calibrated micron gauge — NOT the manifold.'
      }
    },
    render: function(state, H){
      var s = state.inputs.evacuation || {};
      var tons = num(s.tons, 3);
      var cfm  = num(s.cfm, 6);
      var mi   = num(s.mi, 8000);
      var mt   = num(s.mt, 500);
      // Approx system internal volume ft³: ~0.15 ft³ per ton (line-set + coils + oil)
      var volFt3 = tons * 0.15;
      // Pump-down time (min) = V/CFM · ln(Pi/Pt). Volume in ft³, CFM in ft³/min.
      var timeMin = (cfm > 0 && mi > mt) ? (volFt3 / cfm) * Math.log(mi / Math.max(mt,1)) * 2.3 : 0;
      if (timeMin < 1) timeMin = 1;
      // Pass criterion: target reachable and ≤30 min on a healthy pump
      var pass = (mt <= 500 && timeMin <= 30 && cfm >= 3);

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_tons','Tonelaje del sistema')) + '</span><span class="mp-unit">' + esc(t('mp_ev_tons_u','toneladas')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="evacuation.tons" value="' + tons + '" step="0.5" min="0.5" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_cfm','CFM de la bomba')) + '</span><span class="mp-unit">' + esc(t('mp_ev_cfm_u','CFM')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="evacuation.cfm" value="' + cfm + '" step="0.5" min="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_mi','Micrones iniciales')) + '</span><span class="mp-unit">' + esc(t('mp_ev_mi_u','µ')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="evacuation.mi" value="' + mi + '" step="100" min="500" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_mt','Micrones objetivo')) + '</span><span class="mp-unit">' + esc(t('mp_ev_mt_u','µ (default 500)')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="evacuation.mt" value="' + mt + '" step="50" min="100" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ev_res_lbl','Tiempo estimado')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(timeMin,0)) + '<span class="mp-res-unit">' + esc(t('mp_ev_u','min')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_ev_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_std','Estándar HVAC')) + '</div><div class="mp-res-val">' + esc(t('mp_ev_std_val','<500µ / 15 min')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_vol','Volumen del sistema')) + '</div><div class="mp-res-val">' + esc(fmt(volFt3,2)) + ' ' + esc(t('mp_ev_vol_u','pies³')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_status','Estado')) + '</div><div class="mp-res-val" style="color:' + (pass?'#16A34A':'#DC2626') + ' !important;">' + esc(pass ? t('mp_ev_pass','✓ PASA') : t('mp_ev_fail','⚠ FALLA')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_ev_case', 'mp_ev_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 2) A2L LIMITS — IEC/UL 60335-2-40 max charge per room volume
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['a2lLimits'] = {
    i18n: {
      es: {
        mp_a2l_title:'A2L Charge Limits',
        mp_a2l_sub:'IEC/UL 60335-2-40 por m³',
        mp_a2l_ref:'Refrigerante A2L',
        mp_a2l_vol:'Volumen del cuarto',
        mp_a2l_vol_u:'m³',
        mp_a2l_res_lbl:'Carga máxima',
        mp_a2l_u:'kg',
        mp_a2l_desc:'mmax = RCL × V × 0.5 (factor de seguridad)',
        mp_a2l_rcl:'RCL',
        mp_a2l_rcl_u:'kg/m³',
        mp_a2l_lfl:'LFL',
        mp_a2l_lfl_u:'kg/m³',
        mp_a2l_class:'Clasificación',
        mp_a2l_gwp:'GWP',
        mp_a2l_m1:'Umbral m1 (sin detector)',
        mp_a2l_status:'Estado',
        mp_a2l_ok:'✓ Dentro de límite',
        mp_a2l_warn:'⚠ Excede m1 — requiere detector',
        mp_a2l_case:'Mini-split 24 000 BTU con R-454B en recámara de 30 m³. Carga de fábrica 1.2 kg. RCL × V × 0.5 = 0.059 × 30 × 0.5 = 0.885 kg → excede, requiere detector de fuga A2L.',
        mp_a2l_tip:'A2L NO es "no inflamable". Sin chispa + LFL bajo = seguro bajo condiciones normales. Pero NUNCA soldés con carga dentro: purgá con N2 primero.'
      },
      en: {
        mp_a2l_title:'A2L Charge Limits',
        mp_a2l_sub:'IEC/UL 60335-2-40 per m³',
        mp_a2l_ref:'A2L refrigerant',
        mp_a2l_vol:'Room volume',
        mp_a2l_vol_u:'m³',
        mp_a2l_res_lbl:'Max charge',
        mp_a2l_u:'kg',
        mp_a2l_desc:'mmax = RCL × V × 0.5 (safety factor)',
        mp_a2l_rcl:'RCL',
        mp_a2l_rcl_u:'kg/m³',
        mp_a2l_lfl:'LFL',
        mp_a2l_lfl_u:'kg/m³',
        mp_a2l_class:'Class',
        mp_a2l_gwp:'GWP',
        mp_a2l_m1:'m1 threshold (no detector)',
        mp_a2l_status:'Status',
        mp_a2l_ok:'✓ Within limit',
        mp_a2l_warn:'⚠ Exceeds m1 — detector required',
        mp_a2l_case:'24 000 BTU mini-split with R-454B in a 30 m³ bedroom. Factory charge 1.2 kg. RCL × V × 0.5 = 0.059 × 30 × 0.5 = 0.885 kg → exceeded, A2L leak detector required.',
        mp_a2l_tip:'A2L is NOT "non-flammable". No ignition source + low LFL = safe in normal ops. But NEVER braze with charge inside: purge with N2 first.'
      }
    },
    render: function(state, H){
      var s = state.inputs.a2lLimits || {};
      var ref = s.ref || 'R-454B';
      if (!A2L_LIMITS[ref]) ref = 'R-454B';
      var vol = num(s.vol, 30);
      var L = A2L_LIMITS[ref];
      var maxCharge = L.rcl * vol * 0.5;
      var m1 = L.m1; // bare system allowed charge w/o mitigation (approx kg for typical ceiling height)
      var exceedsM1 = maxCharge > m1;

      var opts = '';
      for (var i=0;i<A2L_LIST.length;i++){
        var r = A2L_LIST[i];
        opts += '<option value="' + r + '"' + (r===ref?' selected':'') + '>' + r + '</option>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_a2l_ref','Refrigerante A2L')) + '</span><span class="mp-unit">A2L</span></div>' +
            '<select class="mp-in" data-in="a2lLimits.ref">' + opts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_a2l_vol','Volumen del cuarto')) + '</span><span class="mp-unit">' + esc(t('mp_a2l_vol_u','m³')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="a2lLimits.vol" value="' + vol + '" step="1" min="1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_a2l_res_lbl','Carga máxima')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(maxCharge,3)) + '<span class="mp-res-unit">' + esc(t('mp_a2l_u','kg')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_a2l_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_rcl','RCL')) + '</div><div class="mp-res-val">' + esc(fmt(L.rcl,3)) + ' ' + esc(t('mp_a2l_rcl_u','kg/m³')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_lfl','LFL')) + '</div><div class="mp-res-val">' + esc(fmt(L.lfl,3)) + ' ' + esc(t('mp_a2l_lfl_u','kg/m³')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_class','Clasificación')) + '</div><div class="mp-res-val">' + esc(L.class) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_gwp','GWP')) + '</div><div class="mp-res-val">' + esc(L.gwp) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_m1','Umbral m1')) + '</div><div class="mp-res-val">' + esc(fmt(m1,2)) + ' kg</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_a2l_status','Estado')) + '</div><div class="mp-res-val" style="color:' + (exceedsM1?'#DC2626':'#16A34A') + ' !important;">' + esc(exceedsM1 ? t('mp_a2l_warn','⚠ Excede m1') : t('mp_a2l_ok','✓ Dentro de límite')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_a2l_case', 'mp_a2l_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 3) LEAK RATE EPA — annualized leak % vs EPA §608 threshold
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['leakRateEPA'] = {
    i18n: {
      es: {
        mp_lr_title:'Leak Rate EPA',
        mp_lr_sub:'EPA §608 Subpart F',
        mp_lr_charge:'Carga total',
        mp_lr_charge_u:'lbs',
        mp_lr_leak:'Fuga detectada',
        mp_lr_leak_u:'lbs',
        mp_lr_days:'Período',
        mp_lr_days_u:'días',
        mp_lr_app:'Aplicación',
        mp_lr_comm:'Refrig. comercial',
        mp_lr_comfort:'Confort (A/C)',
        mp_lr_indust:'Proceso industrial',
        mp_lr_res_lbl:'Tasa anual',
        mp_lr_u:'%',
        mp_lr_desc:'(fuga / carga) × (365 / días) × 100',
        mp_lr_threshold:'Umbral EPA',
        mp_lr_status:'Estado',
        mp_lr_pass:'✓ PASA — bajo umbral',
        mp_lr_fail:'⚠ FALLA — reparar en 30 días',
        mp_lr_days_per:'Días de operación',
        mp_lr_case:'Walk-in comercial con carga de 80 lb R-448A. Perdió 12 lb en 90 días → (12/80)×(365/90)×100 = 60.8% anual. Excede 20% comercial → reparación obligatoria y reporte a EPA si ≥50 lb.',
        mp_lr_tip:'EPA 608 exige bitácora de fugas para equipos ≥50 lb. Si pasa el umbral, reparás en 30 días o retirás el equipo. Documentá con foto + lb recuperadas.'
      },
      en: {
        mp_lr_title:'Leak Rate EPA',
        mp_lr_sub:'EPA §608 Subpart F',
        mp_lr_charge:'Full charge',
        mp_lr_charge_u:'lbs',
        mp_lr_leak:'Leaked amount',
        mp_lr_leak_u:'lbs',
        mp_lr_days:'Time period',
        mp_lr_days_u:'days',
        mp_lr_app:'Application',
        mp_lr_comm:'Commercial refrig',
        mp_lr_comfort:'Comfort cooling',
        mp_lr_indust:'Industrial process',
        mp_lr_res_lbl:'Annualized rate',
        mp_lr_u:'%',
        mp_lr_desc:'(leak / charge) × (365 / days) × 100',
        mp_lr_threshold:'EPA threshold',
        mp_lr_status:'Status',
        mp_lr_pass:'✓ PASS — below threshold',
        mp_lr_fail:'⚠ FAIL — repair within 30 days',
        mp_lr_days_per:'Operating days',
        mp_lr_case:'Commercial walk-in with 80 lb R-448A. Lost 12 lb over 90 days → (12/80)×(365/90)×100 = 60.8% annual. Exceeds 20% commercial → mandatory repair and EPA report if ≥50 lb.',
        mp_lr_tip:'EPA 608 requires a leak log for appliances ≥50 lb. Above threshold you repair within 30 days or retire the equipment. Document with photos + lb recovered.'
      }
    },
    render: function(state, H){
      var s = state.inputs.leakRateEPA || {};
      var charge = num(s.charge, 80);
      var leak   = num(s.leak, 12);
      var days   = num(s.days, 90);
      var app    = s.app || 'commercial';
      if (!EPA_THRESHOLDS[app]) app = 'commercial';
      var rate = (charge > 0 && days > 0) ? (leak / charge) * (365 / days) * 100 : 0;
      var thr = EPA_THRESHOLDS[app].pct;
      var pass = rate <= thr;

      var appLabels = { commercial:t('mp_lr_comm','Refrig. comercial'), comfort:t('mp_lr_comfort','Confort (A/C)'), industrial:t('mp_lr_indust','Proceso industrial') };
      var appOpts = '';
      var appKeys = ['commercial','comfort','industrial'];
      for (var i=0;i<appKeys.length;i++){
        var k = appKeys[i];
        appOpts += '<option value="' + k + '"' + (k===app?' selected':'') + '>' + esc(appLabels[k]) + ' · ' + EPA_THRESHOLDS[k].pct + '%</option>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_lr_charge','Carga total')) + '</span><span class="mp-unit">' + esc(t('mp_lr_charge_u','lbs')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="leakRateEPA.charge" value="' + charge + '" step="1" min="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_lr_leak','Fuga detectada')) + '</span><span class="mp-unit">' + esc(t('mp_lr_leak_u','lbs')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="leakRateEPA.leak" value="' + leak + '" step="0.5" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_lr_days','Período')) + '</span><span class="mp-unit">' + esc(t('mp_lr_days_u','días')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="leakRateEPA.days" value="' + days + '" step="1" min="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_lr_app','Aplicación')) + '</span><span class="mp-unit">EPA</span></div>' +
            '<select class="mp-in" data-in="leakRateEPA.app">' + appOpts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_lr_res_lbl','Tasa anual')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(rate,1)) + '<span class="mp-res-unit">' + esc(t('mp_lr_u','%')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_lr_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_lr_threshold','Umbral EPA')) + '</div><div class="mp-res-val">' + esc(thr) + '%</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_lr_days_per','Días de operación')) + '</div><div class="mp-res-val">' + esc(days) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_lr_status','Estado')) + '</div><div class="mp-res-val" style="color:' + (pass?'#16A34A':'#DC2626') + ' !important;">' + esc(pass ? t('mp_lr_pass','✓ PASA') : t('mp_lr_fail','⚠ FALLA')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_lr_case', 'mp_lr_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 4) OPERATING PRESSURES — typical PSIG per refrigerant + ambient
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['opPressures'] = {
    i18n: {
      es: {
        mp_op_title:'Operating Pressures',
        mp_op_sub:'Presiones típicas por refrigerante',
        mp_op_ref:'Refrigerante',
        mp_op_amb:'Temperatura ambiente',
        mp_op_amb_u:'°F',
        mp_op_res_lbl:'Alta / Baja esperada',
        mp_op_u:'psig',
        mp_op_desc:'Sistema cargado correctamente a plena carga',
        mp_op_hi:'Alta (liquid)',
        mp_op_lo:'Baja (suction)',
        mp_op_sh:'Superheat objetivo',
        mp_op_sc:'Subcool objetivo',
        mp_op_sat_hi:'Sat. alta (cond ~ ambiente+30)',
        mp_op_sat_lo:'Sat. baja (evap ~40)',
        mp_op_case:'Split R-410A, 95°F ambiente → alta ~400 psig, baja ~118 psig. Si la alta sube a 475, revisá condensador sucio o aire recirculado.',
        mp_op_tip:'La regla Chaka: alta = ambiente + 30°F convertido a presión; baja = 40°F evap convertido a presión. Si está fuera ±10%, hay problema.'
      },
      en: {
        mp_op_title:'Operating Pressures',
        mp_op_sub:'Typical pressures per refrigerant',
        mp_op_ref:'Refrigerant',
        mp_op_amb:'Ambient temperature',
        mp_op_amb_u:'°F',
        mp_op_res_lbl:'Expected high / low',
        mp_op_u:'psig',
        mp_op_desc:'Properly-charged system at full load',
        mp_op_hi:'High (liquid)',
        mp_op_lo:'Low (suction)',
        mp_op_sh:'Superheat target',
        mp_op_sc:'Subcool target',
        mp_op_sat_hi:'Sat. high (cond ~ amb+30)',
        mp_op_sat_lo:'Sat. low (evap ~40)',
        mp_op_case:'R-410A split at 95°F ambient → high ~400 psig, low ~118 psig. If high climbs to 475, check for a dirty condenser or recirculated air.',
        mp_op_tip:'Chaka rule: high = ambient + 30°F converted to pressure; low = 40°F evap converted to pressure. Off by more than ±10%? Something is wrong.'
      }
    },
    render: function(state, H){
      var s = state.inputs.opPressures || {};
      var ref = s.ref || 'R-410A';
      if (!OP_PRESS[ref]) ref = 'R-410A';
      var amb = num(s.amb, 95);
      var P = OP_PRESS[ref];
      var high = P.highBase + P.highPerF * amb;
      var low  = P.lowBase + P.lowPerF * 40; // low is tied to evap ~40°F, not ambient
      var satHi = P.satHigh; // reference @ 125°F cond for R-410A family
      var satLo = P.satLow;  // reference @ 40°F evap

      var opts = '';
      for (var i=0;i<REFRIG_LIST_OP.length;i++){
        var r = REFRIG_LIST_OP[i];
        opts += '<option value="' + r + '"' + (r===ref?' selected':'') + '>' + r + '</option>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_op_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="opPressures.ref">' + opts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_op_amb','Temperatura ambiente')) + '</span><span class="mp-unit">' + esc(t('mp_op_amb_u','°F')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="opPressures.amb" value="' + amb + '" step="1" min="40" max="130" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_op_res_lbl','Alta / Baja esperada')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(high,0)) + ' / ' + esc(fmt(low,0)) + '<span class="mp-res-unit">' + esc(t('mp_op_u','psig')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_op_desc','')) + ' · ' + esc(ref) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_hi','Alta (liquid)')) + '</div><div class="mp-res-val">' + esc(fmt(high,0)) + ' psig</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_lo','Baja (suction)')) + '</div><div class="mp-res-val">' + esc(fmt(low,0)) + ' psig</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_sh','Superheat objetivo')) + '</div><div class="mp-res-val">' + esc(P.superheat) + '°F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_sc','Subcool objetivo')) + '</div><div class="mp-res-val">' + esc(P.subcool) + '°F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_sat_hi','Sat. alta')) + '</div><div class="mp-res-val">' + esc(satHi) + ' psig</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_op_sat_lo','Sat. baja')) + '</div><div class="mp-res-val">' + esc(satLo) + ' psig</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_op_case', 'mp_op_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 5) DIAGNOSIS BY PRESSURE — compare readings to typical, flag fault
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['diagByPress'] = {
    i18n: {
      es: {
        mp_dp_title:'Diagnosis by Pressure',
        mp_dp_sub:'High/Low → problema probable',
        mp_dp_ref:'Refrigerante',
        mp_dp_amb:'Ambiente',
        mp_dp_amb_u:'°F',
        mp_dp_hi:'Lectura de alta',
        mp_dp_hi_u:'psig',
        mp_dp_lo:'Lectura de baja',
        mp_dp_lo_u:'psig',
        mp_dp_res_lbl:'Diagnóstico',
        mp_dp_u:'',
        mp_dp_desc:'Desviación contra presiones típicas',
        mp_dp_ok:'Sistema normal',
        mp_dp_over:'Sobrecarga (alta↑ baja↑)',
        mp_dp_under:'Baja carga / fuga (alta↓ baja↓)',
        mp_dp_dirty:'Condensador sucio (alta↑ baja normal)',
        mp_dp_airflow:'Poco flujo evap (alta normal baja↓)',
        mp_dp_restr:'Restricción líquido (alta↑ baja↓)',
        mp_dp_weak:'Compresor débil (alta↓ baja↑)',
        mp_dp_exp_hi:'Alta esperada',
        mp_dp_exp_lo:'Baja esperada',
        mp_dp_dev_hi:'Desviación alta',
        mp_dp_dev_lo:'Desviación baja',
        mp_dp_case:'R-410A, 95°F, alta 470 / baja 115. Esperado 400/118 → alta +17%, baja normal = condensador sucio. Lavá con agua a baja presión.',
        mp_dp_tip:'Nunca diagnostiqués con una sola lectura. Anotá alta/baja/superheat/subcool/ΔT supply-return y AMP del compresor — los 5 cuentan la historia completa.'
      },
      en: {
        mp_dp_title:'Diagnosis by Pressure',
        mp_dp_sub:'High/Low → likely fault',
        mp_dp_ref:'Refrigerant',
        mp_dp_amb:'Ambient',
        mp_dp_amb_u:'°F',
        mp_dp_hi:'High-side reading',
        mp_dp_hi_u:'psig',
        mp_dp_lo:'Low-side reading',
        mp_dp_lo_u:'psig',
        mp_dp_res_lbl:'Diagnosis',
        mp_dp_u:'',
        mp_dp_desc:'Deviation vs typical pressures',
        mp_dp_ok:'System normal',
        mp_dp_over:'Overcharge (high↑ low↑)',
        mp_dp_under:'Undercharge / leak (high↓ low↓)',
        mp_dp_dirty:'Dirty condenser (high↑ low normal)',
        mp_dp_airflow:'Low evap airflow (high normal low↓)',
        mp_dp_restr:'Liquid restriction (high↑ low↓)',
        mp_dp_weak:'Weak compressor (high↓ low↑)',
        mp_dp_exp_hi:'Expected high',
        mp_dp_exp_lo:'Expected low',
        mp_dp_dev_hi:'High deviation',
        mp_dp_dev_lo:'Low deviation',
        mp_dp_case:'R-410A, 95°F, high 470 / low 115. Expected 400/118 → high +17%, low normal = dirty condenser. Wash coil with low-pressure water.',
        mp_dp_tip:'Never diagnose from one reading. Log high/low/superheat/subcool/supply-return ΔT and compressor amps — all 5 tell the full story.'
      }
    },
    render: function(state, H){
      var s = state.inputs.diagByPress || {};
      var ref = s.ref || 'R-410A';
      if (!OP_PRESS[ref]) ref = 'R-410A';
      var amb = num(s.amb, 95);
      var P = OP_PRESS[ref];
      var expHi = P.highBase + P.highPerF * amb;
      var expLo = P.lowBase + P.lowPerF * 40;
      var hi = num(s.hi, Math.round(expHi * 1.17));
      var lo = num(s.lo, Math.round(expLo * 0.97));

      var devHi = (hi - expHi) / expHi; // fraction
      var devLo = (lo - expLo) / expLo;
      var THR = 0.08; // ±8% is "normal"
      var hiState = devHi > THR ? 'up' : (devHi < -THR ? 'down' : 'ok');
      var loState = devLo > THR ? 'up' : (devLo < -THR ? 'down' : 'ok');

      var diagKey = 'mp_dp_ok';
      if (hiState==='up' && loState==='up')      diagKey='mp_dp_over';
      else if (hiState==='down' && loState==='down') diagKey='mp_dp_under';
      else if (hiState==='up' && loState==='ok')   diagKey='mp_dp_dirty';
      else if (hiState==='ok' && loState==='down') diagKey='mp_dp_airflow';
      else if (hiState==='up' && loState==='down') diagKey='mp_dp_restr';
      else if (hiState==='down' && loState==='up') diagKey='mp_dp_weak';
      var isOk = (diagKey==='mp_dp_ok');

      var opts = '';
      for (var i=0;i<REFRIG_LIST_DIAG.length;i++){
        var r = REFRIG_LIST_DIAG[i];
        opts += '<option value="' + r + '"' + (r===ref?' selected':'') + '>' + r + '</option>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_dp_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="diagByPress.ref">' + opts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_dp_amb','Ambiente')) + '</span><span class="mp-unit">' + esc(t('mp_dp_amb_u','°F')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="diagByPress.amb" value="' + amb + '" step="1" min="40" max="130" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_dp_hi','Lectura de alta')) + '</span><span class="mp-unit">' + esc(t('mp_dp_hi_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="diagByPress.hi" value="' + hi + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_dp_lo','Lectura de baja')) + '</span><span class="mp-unit">' + esc(t('mp_dp_lo_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="diagByPress.lo" value="' + lo + '" step="1" min="0" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_dp_res_lbl','Diagnóstico')) + '</div>' +
          '<div class="mp-res-main" style="font-size:22px;color:' + (isOk?'#16A34A':'#DC2626') + ' !important;">' + esc(t(diagKey,'')) + '</div>' +
          '<div class="mp-res-desc">' + esc(t('mp_dp_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_dp_exp_hi','Alta esperada')) + '</div><div class="mp-res-val">' + esc(fmt(expHi,0)) + ' psig</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_dp_exp_lo','Baja esperada')) + '</div><div class="mp-res-val">' + esc(fmt(expLo,0)) + ' psig</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_dp_dev_hi','Desviación alta')) + '</div><div class="mp-res-val" style="color:' + (hiState==='ok'?'#16A34A':'#DC2626') + ' !important;">' + (devHi>=0?'+':'') + esc(fmt(devHi*100,1)) + '%</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_dp_dev_lo','Desviación baja')) + '</div><div class="mp-res-val" style="color:' + (loState==='ok'?'#16A34A':'#DC2626') + ' !important;">' + (devLo>=0?'+':'') + esc(fmt(devLo*100,1)) + '%</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_dp_case', 'mp_dp_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 6) TXV vs CAP TUBE — metering device comparison
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['txvVsCap'] = {
    i18n: {
      es: {
        mp_tc_title:'TXV vs Cap Tube',
        mp_tc_sub:'Comparación de metering devices',
        mp_tc_sys:'Tipo de sistema',
        mp_tc_split:'Split',
        mp_tc_pkg:'Paquete',
        mp_tc_tons:'Tonelaje',
        mp_tc_tons_u:'ton',
        mp_tc_app:'Aplicación',
        mp_tc_comfort:'Confort (A/C residencial)',
        mp_tc_refrig:'Refrigeración (comercial)',
        mp_tc_res_lbl:'Recomendación',
        mp_tc_txv:'TXV (Válvula de Expansión Termostática)',
        mp_tc_cap:'Cap Tube (tubo capilar / orificio)',
        mp_tc_col_txv:'TXV',
        mp_tc_col_cap:'Cap Tube',
        mp_tc_h_ctrl:'Control de superheat',
        mp_tc_h_cost:'Costo',
        mp_tc_h_eff:'Eficiencia (SEER)',
        mp_tc_h_load:'Carga variable',
        mp_tc_h_ideal:'Uso ideal',
        mp_tc_v_ctrl_txv:'Activo · modula con carga',
        mp_tc_v_ctrl_cap:'Fijo · no modula',
        mp_tc_v_cost_txv:'$80–$250',
        mp_tc_v_cost_cap:'$8–$30',
        mp_tc_v_eff_txv:'+10–15% SEER',
        mp_tc_v_eff_cap:'Eficiencia base',
        mp_tc_v_load_txv:'Excelente',
        mp_tc_v_load_cap:'Pobre',
        mp_tc_v_ideal_txv:'≥2.5 ton, refrig, inverter, cargas variables',
        mp_tc_v_ideal_cap:'<2.5 ton, ventanas, minibar, carga fija',
        mp_tc_reco:'Recomendación para tu caso',
        mp_tc_case:'Split residencial 3 ton R-410A para casa en clima caliente. TXV recomendado: modula con carga parcial, gana 12% SEER y protege compresor cuando el condensador se ensucia.',
        mp_tc_tip:'¿Ves escarcha solo en la succión cerca del compresor? Probablemente TXV atorado abierto. ¿Escarcha en toda la línea de succión? Bajo carga o evap con poco aire.'
      },
      en: {
        mp_tc_title:'TXV vs Cap Tube',
        mp_tc_sub:'Metering device comparison',
        mp_tc_sys:'System type',
        mp_tc_split:'Split',
        mp_tc_pkg:'Package',
        mp_tc_tons:'Tonnage',
        mp_tc_tons_u:'ton',
        mp_tc_app:'Application',
        mp_tc_comfort:'Comfort (residential A/C)',
        mp_tc_refrig:'Refrigeration (commercial)',
        mp_tc_res_lbl:'Recommendation',
        mp_tc_txv:'TXV (Thermostatic Expansion Valve)',
        mp_tc_cap:'Cap Tube (capillary / orifice)',
        mp_tc_col_txv:'TXV',
        mp_tc_col_cap:'Cap Tube',
        mp_tc_h_ctrl:'Superheat control',
        mp_tc_h_cost:'Cost',
        mp_tc_h_eff:'Efficiency (SEER)',
        mp_tc_h_load:'Variable load',
        mp_tc_h_ideal:'Ideal use',
        mp_tc_v_ctrl_txv:'Active · modulates with load',
        mp_tc_v_ctrl_cap:'Fixed · no modulation',
        mp_tc_v_cost_txv:'$80–$250',
        mp_tc_v_cost_cap:'$8–$30',
        mp_tc_v_eff_txv:'+10–15% SEER',
        mp_tc_v_eff_cap:'Baseline efficiency',
        mp_tc_v_load_txv:'Excellent',
        mp_tc_v_load_cap:'Poor',
        mp_tc_v_ideal_txv:'≥2.5 ton, refrig, inverter, variable loads',
        mp_tc_v_ideal_cap:'<2.5 ton, windows, minibar, fixed load',
        mp_tc_reco:'Recommendation for your case',
        mp_tc_case:'3-ton R-410A residential split in a hot climate. TXV recommended: modulates at part-load, gains 12% SEER and protects compressor when condenser gets dirty.',
        mp_tc_tip:'Frost only on suction near compressor? Probably TXV stuck open. Frost along the whole suction line? Undercharge or low evap airflow.'
      }
    },
    render: function(state, H){
      var s = state.inputs.txvVsCap || {};
      var sys = s.sys || 'split';
      var tons = num(s.tons, 3);
      var app = s.app || 'comfort';
      // Recommendation logic: ≥2.5 ton OR refrig app → TXV; else cap tube acceptable.
      var rec = (tons >= 2.5 || app === 'refrig') ? 'txv' : 'cap';
      var recLabelKey = rec==='txv' ? 'mp_tc_txv' : 'mp_tc_cap';

      var sysOpts = '' +
        '<option value="split"' + (sys==='split'?' selected':'') + '>' + esc(t('mp_tc_split','Split')) + '</option>' +
        '<option value="package"' + (sys==='package'?' selected':'') + '>' + esc(t('mp_tc_pkg','Paquete')) + '</option>';
      var appOpts = '' +
        '<option value="comfort"' + (app==='comfort'?' selected':'') + '>' + esc(t('mp_tc_comfort','Confort (A/C residencial)')) + '</option>' +
        '<option value="refrig"' + (app==='refrig'?' selected':'') + '>' + esc(t('mp_tc_refrig','Refrigeración (comercial)')) + '</option>';

      function row(hKey, txvKey, capKey){
        return '' +
          '<div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:8px;padding:8px 6px;border-bottom:1px solid #E5E7EB;font-size:13px;">' +
            '<div style="font-weight:600;color:#111;">' + esc(t(hKey,'')) + '</div>' +
            '<div style="color:#111;' + (rec==='txv'?'font-weight:700;':'') + '">' + esc(t(txvKey,'')) + '</div>' +
            '<div style="color:#111;' + (rec==='cap'?'font-weight:700;':'') + '">' + esc(t(capKey,'')) + '</div>' +
          '</div>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_tc_sys','Tipo de sistema')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="txvVsCap.sys">' + sysOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_tc_tons','Tonelaje')) + '</span><span class="mp-unit">' + esc(t('mp_tc_tons_u','ton')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="txvVsCap.tons" value="' + tons + '" step="0.5" min="0.5" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_tc_app','Aplicación')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="txvVsCap.app">' + appOpts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_tc_res_lbl','Recomendación')) + '</div>' +
          '<div class="mp-res-main" style="font-size:20px;">' + esc(t(recLabelKey,'')) + '</div>' +
          '<div class="mp-res-desc">' + esc(t('mp_tc_reco','Recomendación para tu caso')) + '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_tc_title','Comparación')) + '</div>' +
          '<div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:8px;padding:8px 6px;border-bottom:2px solid #111;font-size:13px;font-weight:700;color:#111;">' +
            '<div>—</div>' +
            '<div>' + esc(t('mp_tc_col_txv','TXV')) + '</div>' +
            '<div>' + esc(t('mp_tc_col_cap','Cap Tube')) + '</div>' +
          '</div>' +
          row('mp_tc_h_ctrl',  'mp_tc_v_ctrl_txv',  'mp_tc_v_ctrl_cap') +
          row('mp_tc_h_cost',  'mp_tc_v_cost_txv',  'mp_tc_v_cost_cap') +
          row('mp_tc_h_eff',   'mp_tc_v_eff_txv',   'mp_tc_v_eff_cap') +
          row('mp_tc_h_load',  'mp_tc_v_load_txv',  'mp_tc_v_load_cap') +
          row('mp_tc_h_ideal', 'mp_tc_v_ideal_txv', 'mp_tc_v_ideal_cap') +
        '</div>' +
        exampleTip('mp_tc_case', 'mp_tc_tip');
    }
  };

})();
