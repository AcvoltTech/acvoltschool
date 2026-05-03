// Maestro Pro · Refrigeration 2 calculators
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};
  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }
  function num(v,d){ var n=parseFloat(v); return isNaN(n)?(d||0):n; }
  function round(n,p){ var f=Math.pow(10,p||0); return Math.round(n*f)/f; }
  function fmt(n,p){ if(!isFinite(n)) return '—'; return round(n,p==null?1:p).toFixed(p==null?1:p); }

  // ── PT CHART DATA ───────────────────────────────────────────────
  // Saturation pressure (psig) at listed Fahrenheit temperatures.
  // Approximate NIST/ASHRAE bubble-point data for educational use.
  var PT_TEMPS = [-40,-20,0,20,40,60,80,100,120,140];
  var PT_DATA = {
    'R-22':     [0.5,10.1,24.0,43.0,68.5,101.6,143.7,196.0,260.1,337.3],
    'R-410A':   [10.9,27.9,50.0,78.3,118.0,165.6,225.5,299.8,389.3,496.8],
    'R-32':     [12.7,31.1,55.1,86.0,127.8,179.5,244.2,323.1,418.0,531.4],
    'R-454B':   [9.8,26.1,47.5,75.1,112.0,158.9,217.5,289.5,376.7,481.1],
    'R-404A':   [4.4,18.7,38.1,63.8,97.1,139.6,192.6,257.6,336.0,429.2],
    'R-134a':   [-7.2,2.4,16.7,35.8,60.2,91.1,129.5,176.2,233.0,301.6],
    'R-407C':   [0.7,13.5,31.1,54.7,85.0,123.5,171.5,230.3,301.2,385.5],
    'R-448A':   [2.1,15.8,34.9,60.3,93.1,134.6,186.0,248.5,323.8,413.1],
    'R-449A':   [1.8,15.3,34.2,59.4,91.9,133.1,184.2,246.4,321.4,410.3],
    'R-1234yf': [-5.1,5.0,19.7,39.5,65.0,97.3,137.3,186.1,245.1,315.6],
    'R-290':    [-8.4,3.8,19.6,39.8,65.5,97.6,137.1,185.2,243.1,312.2],
    'R-600a':   [-13.9,-5.9,4.7,18.2,35.5,57.3,84.2,117.1,156.8,203.9]
  };
  var PT_REFRIGS = ['R-22','R-410A','R-32','R-454B','R-404A','R-134a','R-407C','R-448A','R-449A','R-1234yf','R-290','R-600a'];

  // Net Refrigerating Effect (BTU/lb) at ~40°F evap / 125°F cond standard.
  var NRE = {
    'R-22': 70,
    'R-410A': 70,
    'R-32': 110,
    'R-454B': 72,
    'R-404A': 54,
    'R-134a': 75,
    'R-407C': 73,
    'R-448A': 72,
    'R-449A': 72,
    'R-1234yf': 58,
    'R-290': 145,
    'R-600a': 140
  };

  // Linear interp helpers for PT chart lookups.
  function satTempFromPsig(ref, psig){
    var arr = PT_DATA[ref]; if (!arr) return null;
    if (psig <= arr[0]) return PT_TEMPS[0];
    if (psig >= arr[arr.length-1]) return PT_TEMPS[arr.length-1];
    for (var i=0;i<arr.length-1;i++){
      if (psig >= arr[i] && psig <= arr[i+1]){
        var f = (psig - arr[i]) / (arr[i+1] - arr[i]);
        return PT_TEMPS[i] + f * (PT_TEMPS[i+1] - PT_TEMPS[i]);
      }
    }
    return null;
  }
  function satPsigFromTemp(ref, tempF){
    var arr = PT_DATA[ref]; if (!arr) return null;
    if (tempF <= PT_TEMPS[0]) return arr[0];
    if (tempF >= PT_TEMPS[PT_TEMPS.length-1]) return arr[arr.length-1];
    for (var i=0;i<PT_TEMPS.length-1;i++){
      if (tempF >= PT_TEMPS[i] && tempF <= PT_TEMPS[i+1]){
        var f = (tempF - PT_TEMPS[i]) / (PT_TEMPS[i+1] - PT_TEMPS[i]);
        return arr[i] + f * (arr[i+1] - arr[i]);
      }
    }
    return null;
  }

  function refrigOpts(list, sel){
    var out = '';
    for (var i=0;i<list.length;i++){
      var r = list[i];
      out += '<option value="' + r + '"' + (r===sel?' selected':'') + '>' + r + '</option>';
    }
    return out;
  }

  // ═══════════════════════════════════════════════════════════════
  // 1) SUPERHEAT — measured superheat with classification
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['superheat'] = {
    i18n: {
      es: {
        mp_sh_title:'Superheat medido',
        mp_sh_sub:'Sobrecalentamiento real en la línea de succión',
        mp_sh_ref:'Refrigerante',
        mp_sh_sp:'Presión de succión',
        mp_sh_sp_u:'psig',
        mp_sh_st:'Temp. línea de succión',
        mp_sh_st_u:'°F',
        mp_sh_dev:'Tipo de metering',
        mp_sh_txv:'TXV',
        mp_sh_fix:'Orificio fijo',
        mp_sh_res_lbl:'Superheat actual',
        mp_sh_u:'°F',
        mp_sh_desc:'SH = Temp. succión − Temp. saturación',
        mp_sh_sat:'Temp. saturación',
        mp_sh_target:'Rango objetivo',
        mp_sh_class:'Clasificación',
        mp_sh_ok:'✓ Normal',
        mp_sh_low:'⚠ Bajo — riesgo de flood (líquido al compresor)',
        mp_sh_high:'⚠ Alto — baja carga / restricción / TXV abierto',
        mp_sh_case:'Split R-410A, baja 118 psig (~40°F sat), succión medida 52°F → SH = 12°F. Con TXV = normal. Con orificio fijo y 95°F/67°F IWB = también OK.',
        mp_sh_tip:'Medí superheat SIEMPRE a 6" del compresor, nunca en el evap. Envolvé el sensor con aislante cerrado para no leer aire ambiente.'
      },
      en: {
        mp_sh_title:'Measured Superheat',
        mp_sh_sub:'Actual superheat at the suction line',
        mp_sh_ref:'Refrigerant',
        mp_sh_sp:'Suction pressure',
        mp_sh_sp_u:'psig',
        mp_sh_st:'Suction line temp',
        mp_sh_st_u:'°F',
        mp_sh_dev:'Metering device',
        mp_sh_txv:'TXV',
        mp_sh_fix:'Fixed orifice',
        mp_sh_res_lbl:'Actual superheat',
        mp_sh_u:'°F',
        mp_sh_desc:'SH = Suction temp − Saturation temp',
        mp_sh_sat:'Saturation temp',
        mp_sh_target:'Target range',
        mp_sh_class:'Classification',
        mp_sh_ok:'✓ Normal',
        mp_sh_low:'⚠ Low — flood risk (liquid to compressor)',
        mp_sh_high:'⚠ High — undercharge / restriction / TXV open',
        mp_sh_case:'R-410A split, low 118 psig (~40°F sat), measured suction 52°F → SH = 12°F. With TXV = normal. With fixed orifice at 95°F/67°F IWB also OK.',
        mp_sh_tip:'Always measure superheat 6" from the compressor, never at the evap. Wrap the sensor with closed-cell insulation so you do not read ambient.'
      }
    },
    render: function(state, H){
      var s = state.inputs.superheat || {};
      var ref = s.ref || 'R-410A';
      if (!PT_DATA[ref]) ref = 'R-410A';
      var sp = num(s.sp, 118);
      var st = num(s.st, 52);
      var dev = s.dev || 'txv';
      var satT = satTempFromPsig(ref, sp);
      var sh = (satT!=null) ? (st - satT) : 0;
      var target = (dev==='txv') ? [8,12] : [10,15];
      var statusKey = 'mp_sh_ok';
      if (sh < target[0]-2) statusKey = 'mp_sh_low';
      else if (sh > target[1]+3) statusKey = 'mp_sh_high';
      var isOk = (statusKey === 'mp_sh_ok');

      var devOpts = '' +
        '<option value="txv"' + (dev==='txv'?' selected':'') + '>' + esc(t('mp_sh_txv','TXV')) + '</option>' +
        '<option value="fix"' + (dev==='fix'?' selected':'') + '>' + esc(t('mp_sh_fix','Orificio fijo')) + '</option>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sh_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="superheat.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sh_sp','Presión de succión')) + '</span><span class="mp-unit">' + esc(t('mp_sh_sp_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="superheat.sp" value="' + sp + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sh_st','Temp. línea de succión')) + '</span><span class="mp-unit">' + esc(t('mp_sh_st_u','°F')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="superheat.st" value="' + st + '" step="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sh_dev','Tipo de metering')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="superheat.dev">' + devOpts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_sh_res_lbl','Superheat actual')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(sh,1)) + '<span class="mp-res-unit">' + esc(t('mp_sh_u','°F')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_sh_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_sh_sat','Temp. saturación')) + '</div><div class="mp-res-val">' + esc(fmt(satT==null?0:satT,1)) + ' °F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sh_target','Rango objetivo')) + '</div><div class="mp-res-val">' + target[0] + '–' + target[1] + ' °F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sh_class','Clasificación')) + '</div><div class="mp-res-val" style="color:' + (isOk?'#16A34A':'#DC2626') + ' !important;">' + esc(t(statusKey,'')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_sh_case','mp_sh_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 2) SUBCOOLING — liquid line subcooling
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['subcooling'] = {
    i18n: {
      es: {
        mp_sc_title:'Subcooling medido',
        mp_sc_sub:'Subenfriamiento en la línea de líquido',
        mp_sc_ref:'Refrigerante',
        mp_sc_lp:'Presión línea de líquido',
        mp_sc_lp_u:'psig',
        mp_sc_lt:'Temp. línea de líquido',
        mp_sc_lt_u:'°F',
        mp_sc_res_lbl:'Subcooling actual',
        mp_sc_u:'°F',
        mp_sc_desc:'SC = Temp. saturación − Temp. líquido',
        mp_sc_sat:'Temp. saturación',
        mp_sc_target:'Rango TXV típico',
        mp_sc_class:'Clasificación',
        mp_sc_ok:'✓ Normal (8–12 °F)',
        mp_sc_low:'⚠ Bajo — baja carga / TXV hambriento',
        mp_sc_high:'⚠ Alto — sobrecarga / restricción',
        mp_sc_case:'Split R-410A, alta 400 psig (~120°F sat), línea de líquido 110°F → SC = 10°F. Carga correcta con TXV. Si SC = 3°F, falta refrigerante.',
        mp_sc_tip:'Subcool SOLO es válido con TXV. Con orificio fijo usá superheat objetivo. En clima caliente extremo agregá 2°F al SC objetivo por cada 10°F sobre 95°F ambiente.'
      },
      en: {
        mp_sc_title:'Measured Subcooling',
        mp_sc_sub:'Subcooling at the liquid line',
        mp_sc_ref:'Refrigerant',
        mp_sc_lp:'Liquid line pressure',
        mp_sc_lp_u:'psig',
        mp_sc_lt:'Liquid line temp',
        mp_sc_lt_u:'°F',
        mp_sc_res_lbl:'Actual subcooling',
        mp_sc_u:'°F',
        mp_sc_desc:'SC = Saturation temp − Liquid temp',
        mp_sc_sat:'Saturation temp',
        mp_sc_target:'Typical TXV range',
        mp_sc_class:'Classification',
        mp_sc_ok:'✓ Normal (8–12 °F)',
        mp_sc_low:'⚠ Low — undercharge / starved TXV',
        mp_sc_high:'⚠ High — overcharge / restriction',
        mp_sc_case:'R-410A split, high 400 psig (~120°F sat), liquid line 110°F → SC = 10°F. Correct charge with TXV. If SC = 3°F, you need refrigerant.',
        mp_sc_tip:'Subcool is only valid with a TXV. With a fixed orifice use target superheat. In extreme heat add 2°F to SC target for each 10°F above 95°F ambient.'
      }
    },
    render: function(state, H){
      var s = state.inputs.subcooling || {};
      var ref = s.ref || 'R-410A';
      if (!PT_DATA[ref]) ref = 'R-410A';
      var lp = num(s.lp, 400);
      var lt = num(s.lt, 110);
      var satT = satTempFromPsig(ref, lp);
      var sc = (satT!=null) ? (satT - lt) : 0;
      var statusKey = 'mp_sc_ok';
      if (sc < 6) statusKey = 'mp_sc_low';
      else if (sc > 14) statusKey = 'mp_sc_high';
      var isOk = (statusKey === 'mp_sc_ok');

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sc_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="subcooling.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sc_lp','Presión línea de líquido')) + '</span><span class="mp-unit">' + esc(t('mp_sc_lp_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="subcooling.lp" value="' + lp + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sc_lt','Temp. línea de líquido')) + '</span><span class="mp-unit">' + esc(t('mp_sc_lt_u','°F')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="subcooling.lt" value="' + lt + '" step="1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_sc_res_lbl','Subcooling actual')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(sc,1)) + '<span class="mp-res-unit">' + esc(t('mp_sc_u','°F')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_sc_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_sc_sat','Temp. saturación')) + '</div><div class="mp-res-val">' + esc(fmt(satT==null?0:satT,1)) + ' °F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sc_target','Rango TXV típico')) + '</div><div class="mp-res-val">8–12 °F</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sc_class','Clasificación')) + '</div><div class="mp-res-val" style="color:' + (isOk?'#16A34A':'#DC2626') + ' !important;">' + esc(t(statusKey,'')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_sc_case','mp_sc_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 3) TARGET SH — target superheat for fixed-orifice systems
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['targetSH'] = {
    i18n: {
      es: {
        mp_tsh_title:'Target Superheat',
        mp_tsh_sub:'SH objetivo para orificio fijo',
        mp_tsh_iwb:'Temp. bulbo húmedo interior',
        mp_tsh_iwb_u:'°F WB',
        mp_tsh_odb:'Temp. bulbo seco exterior',
        mp_tsh_odb_u:'°F DB',
        mp_tsh_res_lbl:'Superheat objetivo',
        mp_tsh_u:'°F',
        mp_tsh_desc:'TSH = (3×IWB − 80 − ODB) / 2 (Carrier/Emerson)',
        mp_tsh_tbl:'Tabla rápida',
        mp_tsh_note:'Si SH medido > objetivo + 3°F → baja carga. Si < objetivo − 3°F → sobrecarga.',
        mp_tsh_case:'Split R-410A orificio fijo, IWB=67°F, ODB=95°F → TSH = (201−80−95)/2 = 13°F. Medí 20°F → falta refrigerante, cargá hasta bajar SH.',
        mp_tsh_tip:'Target SH SOLO aplica para orificio fijo. Con TXV usá subcool. Medí IWB real con higrómetro o psychrometer, NO asumas 50% RH.'
      },
      en: {
        mp_tsh_title:'Target Superheat',
        mp_tsh_sub:'Target SH for fixed-orifice systems',
        mp_tsh_iwb:'Indoor wet-bulb temp',
        mp_tsh_iwb_u:'°F WB',
        mp_tsh_odb:'Outdoor dry-bulb temp',
        mp_tsh_odb_u:'°F DB',
        mp_tsh_res_lbl:'Target superheat',
        mp_tsh_u:'°F',
        mp_tsh_desc:'TSH = (3×IWB − 80 − ODB) / 2 (Carrier/Emerson)',
        mp_tsh_tbl:'Quick-reference table',
        mp_tsh_note:'If measured SH > target + 3°F → undercharge. If < target − 3°F → overcharge.',
        mp_tsh_case:'R-410A fixed-orifice split, IWB=67°F, ODB=95°F → TSH = (201−80−95)/2 = 13°F. Measured 20°F → undercharged, add refrigerant until SH drops.',
        mp_tsh_tip:'Target SH only applies to fixed-orifice. With TXV use subcool. Measure actual IWB with a hygrometer or psychrometer — do NOT assume 50% RH.'
      }
    },
    render: function(state, H){
      var s = state.inputs.targetSH || {};
      var iwb = num(s.iwb, 67);
      var odb = num(s.odb, 95);
      var tsh = (3*iwb - 80 - odb) / 2;
      if (tsh < 0) tsh = 0;

      // Quick-reference table
      var iwbRow = [60,63,65,67,70,72,75];
      var odbCol = [75,85,95,105,115];
      var tbl = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#111;">';
      tbl += '<tr><th style="padding:6px 4px;border-bottom:2px solid #111;text-align:left;">IWB \\ ODB</th>';
      for (var c=0;c<odbCol.length;c++){ tbl += '<th style="padding:6px 4px;border-bottom:2px solid #111;">' + odbCol[c] + '°F</th>'; }
      tbl += '</tr>';
      for (var r=0;r<iwbRow.length;r++){
        tbl += '<tr>';
        tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;font-weight:700;">' + iwbRow[r] + '°F WB</td>';
        for (var c2=0;c2<odbCol.length;c2++){
          var v = (3*iwbRow[r] - 80 - odbCol[c2]) / 2;
          if (v < 0) v = 0;
          var cell = v.toFixed(0);
          tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;text-align:center;">' + cell + '°F</td>';
        }
        tbl += '</tr>';
      }
      tbl += '</table></div>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_tsh_iwb','Temp. bulbo húmedo interior')) + '</span><span class="mp-unit">' + esc(t('mp_tsh_iwb_u','°F WB')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="targetSH.iwb" value="' + iwb + '" step="1" min="50" max="85" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_tsh_odb','Temp. bulbo seco exterior')) + '</span><span class="mp-unit">' + esc(t('mp_tsh_odb_u','°F DB')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="targetSH.odb" value="' + odb + '" step="1" min="65" max="125" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_tsh_res_lbl','Superheat objetivo')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(tsh,0)) + '<span class="mp-res-unit">' + esc(t('mp_tsh_u','°F')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_tsh_desc','')) + '</div>' +
          '<div class="mp-res-grid"><div style="grid-column:1/-1;"><div class="mp-res-item">' + esc(t('mp_tsh_note','Nota')) + '</div><div class="mp-res-val" style="font-size:13px;">' + esc(t('mp_tsh_note','')) + '</div></div></div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_tsh_tbl','Tabla rápida')) + '</div>' +
          tbl +
        '</div>' +
        exampleTip('mp_tsh_case','mp_tsh_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 4) PT CHART — full pressure-temperature lookup
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['ptChart'] = {
    i18n: {
      es: {
        mp_pt_title:'PT Chart',
        mp_pt_sub:'Presión ↔ temperatura de saturación',
        mp_pt_ref:'Refrigerante',
        mp_pt_mode:'Modo',
        mp_pt_mode_p:'Presión → Temp',
        mp_pt_mode_t:'Temp → Presión',
        mp_pt_p:'Presión (psig)',
        mp_pt_p_u:'psig',
        mp_pt_tval:'Temperatura',
        mp_pt_tval_u:'°F',
        mp_pt_res_lbl:'Resultado',
        mp_pt_u:'',
        mp_pt_desc:'Datos aproximados NIST/ASHRAE para uso en campo',
        mp_pt_tbl:'Tabla completa',
        mp_pt_case:'R-454B operando en invierno con baja 50 psig → ~23°F sat. Si tu evap está a 45°F, SH = 22°F — probablemente TXV hambriento o baja carga.',
        mp_pt_tip:'Memorizá estas 3: R-410A a 40°F = 118 psig, R-22 a 40°F = 68 psig, R-404A a 0°F = 38 psig. Con esas referencias resolvés 80% de los jobs.'
      },
      en: {
        mp_pt_title:'PT Chart',
        mp_pt_sub:'Pressure ↔ saturation temperature',
        mp_pt_ref:'Refrigerant',
        mp_pt_mode:'Mode',
        mp_pt_mode_p:'Pressure → Temp',
        mp_pt_mode_t:'Temp → Pressure',
        mp_pt_p:'Pressure (psig)',
        mp_pt_p_u:'psig',
        mp_pt_tval:'Temperature',
        mp_pt_tval_u:'°F',
        mp_pt_res_lbl:'Result',
        mp_pt_u:'',
        mp_pt_desc:'Approximate NIST/ASHRAE data for field use',
        mp_pt_tbl:'Full table',
        mp_pt_case:'R-454B in winter with 50 psig low → ~23°F sat. If your evap is at 45°F, SH = 22°F — probably a starved TXV or undercharge.',
        mp_pt_tip:'Memorize these three: R-410A at 40°F = 118 psig, R-22 at 40°F = 68 psig, R-404A at 0°F = 38 psig. Those references solve 80% of jobs.'
      }
    },
    render: function(state, H){
      var s = state.inputs.ptChart || {};
      var ref = s.ref || 'R-410A';
      if (!PT_DATA[ref]) ref = 'R-410A';
      var mode = s.mode || 'p';
      var pIn = num(s.p, 118);
      var tIn = num(s.tval, 40);
      var result, resUnit;
      if (mode === 'p'){
        var tt = satTempFromPsig(ref, pIn);
        result = (tt==null) ? 0 : tt;
        resUnit = '°F';
      } else {
        var pp = satPsigFromTemp(ref, tIn);
        result = (pp==null) ? 0 : pp;
        resUnit = 'psig';
      }

      var modeOpts = '' +
        '<option value="p"' + (mode==='p'?' selected':'') + '>' + esc(t('mp_pt_mode_p','Presión → Temp')) + '</option>' +
        '<option value="t"' + (mode==='t'?' selected':'') + '>' + esc(t('mp_pt_mode_t','Temp → Presión')) + '</option>';

      var inputField;
      if (mode === 'p'){
        inputField = '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_pt_p','Presión (psig)')) + '</span><span class="mp-unit">' + esc(t('mp_pt_p_u','psig')) + '</span></div>' +
          '<input type="number" class="mp-in" data-in="ptChart.p" value="' + pIn + '" step="1" />' +
        '</div>';
      } else {
        inputField = '<div class="mp-ig">' +
          '<div class="mp-lbl"><span>' + esc(t('mp_pt_tval','Temperatura')) + '</span><span class="mp-unit">' + esc(t('mp_pt_tval_u','°F')) + '</span></div>' +
          '<input type="number" class="mp-in" data-in="ptChart.tval" value="' + tIn + '" step="1" />' +
        '</div>';
      }

      // Full table for selected refrigerant
      var tbl = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#111;">';
      tbl += '<tr><th style="padding:6px 4px;border-bottom:2px solid #111;text-align:left;">°F</th>';
      for (var i=0;i<PT_TEMPS.length;i++){ tbl += '<th style="padding:6px 4px;border-bottom:2px solid #111;">' + PT_TEMPS[i] + '</th>'; }
      tbl += '</tr>';
      tbl += '<tr><td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;font-weight:700;">psig</td>';
      for (var j=0;j<PT_DATA[ref].length;j++){
        tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;text-align:center;">' + PT_DATA[ref][j].toFixed(1) + '</td>';
      }
      tbl += '</tr></table></div>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_pt_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="ptChart.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_pt_mode','Modo')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="ptChart.mode">' + modeOpts + '</select>' +
          '</div>' +
          inputField +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_pt_res_lbl','Resultado')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(result,1)) + '<span class="mp-res-unit">' + esc(resUnit) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_pt_desc','')) + ' · ' + esc(ref) + '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_pt_tbl','Tabla completa')) + ' — ' + esc(ref) + '</div>' +
          tbl +
        '</div>' +
        exampleTip('mp_pt_case','mp_pt_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 5) LINE SIZE — suction / liquid / discharge sizing
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['lineSize'] = {
    i18n: {
      es: {
        mp_ls_title:'Line Sizing',
        mp_ls_sub:'Succión / líquido / descarga',
        mp_ls_tons:'Capacidad',
        mp_ls_tons_u:'ton',
        mp_ls_ref:'Refrigerante',
        mp_ls_len:'Longitud equivalente',
        mp_ls_len_u:'ft',
        mp_ls_lift:'Elevación vertical',
        mp_ls_lift_u:'ft',
        mp_ls_res_lbl:'Tamaños recomendados',
        mp_ls_u:'OD',
        mp_ls_desc:'ACCA Manual 10 · caída ≤2°F sat por tramo',
        mp_ls_suct:'Succión (OD)',
        mp_ls_liq:'Líquido (OD)',
        mp_ls_dis:'Descarga (OD)',
        mp_ls_note:'Elevación ajuste',
        mp_ls_ok:'Normal',
        mp_ls_up:'Sube 1 paso (elevación >30ft)',
        mp_ls_case:'Split 3 ton R-410A, lineset 50 ft, 15 ft de elevación → succión 3/4" OD, líquido 3/8" OD, descarga 3/4" OD. Si subís a 40 ft vertical, pasá succión a 7/8".',
        mp_ls_tip:'Línea de succión sobredimensionada = aceite atrapado = compresor quemado. Subdimensionada = pérdida de capacidad + baja presión falsa. Seguí Manual 10.'
      },
      en: {
        mp_ls_title:'Line Sizing',
        mp_ls_sub:'Suction / liquid / discharge',
        mp_ls_tons:'Capacity',
        mp_ls_tons_u:'ton',
        mp_ls_ref:'Refrigerant',
        mp_ls_len:'Equivalent length',
        mp_ls_len_u:'ft',
        mp_ls_lift:'Vertical lift',
        mp_ls_lift_u:'ft',
        mp_ls_res_lbl:'Recommended sizes',
        mp_ls_u:'OD',
        mp_ls_desc:'ACCA Manual 10 · ≤2°F sat drop per run',
        mp_ls_suct:'Suction (OD)',
        mp_ls_liq:'Liquid (OD)',
        mp_ls_dis:'Discharge (OD)',
        mp_ls_note:'Lift adjustment',
        mp_ls_ok:'Normal',
        mp_ls_up:'Step up 1 size (lift >30 ft)',
        mp_ls_case:'3-ton R-410A split, 50 ft lineset, 15 ft lift → suction 3/4" OD, liquid 3/8" OD, discharge 3/4" OD. If lift climbs to 40 ft, step suction to 7/8".',
        mp_ls_tip:'Oversized suction = oil trapping = burnt compressor. Undersized = capacity loss + false low pressure. Follow Manual 10.'
      }
    },
    render: function(state, H){
      var s = state.inputs.lineSize || {};
      var tons = num(s.tons, 3);
      var ref = s.ref || 'R-410A';
      if (!PT_DATA[ref]) ref = 'R-410A';
      var len = num(s.len, 50);
      var lift = num(s.lift, 15);

      // Line size tables (OD inches, Manual 10 typical ranges per tons)
      function pickSuction(t){
        if (t < 1) return '3/8"';
        if (t < 1.5) return '1/2"';
        if (t < 2.5) return '5/8"';
        if (t < 4) return '3/4"';
        if (t < 6) return '7/8"';
        if (t < 9) return '1-1/8"';
        if (t < 15) return '1-3/8"';
        return '1-5/8"';
      }
      function pickLiquid(t){
        if (t < 1.5) return '1/4"';
        if (t < 3) return '3/8"';
        if (t < 6) return '1/2"';
        if (t < 10) return '5/8"';
        if (t < 18) return '7/8"';
        return '1-1/8"';
      }
      function pickDischarge(t){
        if (t < 1.5) return '3/8"';
        if (t < 3) return '1/2"';
        if (t < 5) return '5/8"';
        if (t < 8) return '3/4"';
        if (t < 12) return '7/8"';
        return '1-1/8"';
      }
      var suct = pickSuction(tons);
      var liq = pickLiquid(tons);
      var dis = pickDischarge(tons);
      var liftUp = lift > 30;
      if (liftUp){ suct = pickSuction(tons + 1.5); } // step up suction one size for tall risers

      // Quick table for all tonnages
      var tblTons = [1,2,3,4,5,7.5,10,15];
      var tbl = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#111;">';
      tbl += '<tr><th style="padding:6px 4px;border-bottom:2px solid #111;text-align:left;">ton</th><th style="padding:6px 4px;border-bottom:2px solid #111;">Suct</th><th style="padding:6px 4px;border-bottom:2px solid #111;">Liq</th><th style="padding:6px 4px;border-bottom:2px solid #111;">Disc</th></tr>';
      for (var i=0;i<tblTons.length;i++){
        tbl += '<tr><td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;font-weight:700;">' + tblTons[i] + '</td>';
        tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;text-align:center;">' + pickSuction(tblTons[i]) + '</td>';
        tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;text-align:center;">' + pickLiquid(tblTons[i]) + '</td>';
        tbl += '<td style="padding:6px 4px;border-bottom:1px solid #E5E7EB;text-align:center;">' + pickDischarge(tblTons[i]) + '</td>';
        tbl += '</tr>';
      }
      tbl += '</table></div>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ls_tons','Capacidad')) + '</span><span class="mp-unit">' + esc(t('mp_ls_tons_u','ton')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="lineSize.tons" value="' + tons + '" step="0.5" min="0.5" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ls_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="lineSize.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ls_len','Longitud equivalente')) + '</span><span class="mp-unit">' + esc(t('mp_ls_len_u','ft')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="lineSize.len" value="' + len + '" step="5" min="5" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ls_lift','Elevación vertical')) + '</span><span class="mp-unit">' + esc(t('mp_ls_lift_u','ft')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="lineSize.lift" value="' + lift + '" step="1" min="0" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ls_res_lbl','Tamaños recomendados')) + '</div>' +
          '<div class="mp-res-main" style="font-size:22px;">' + esc(suct) + ' / ' + esc(liq) + ' / ' + esc(dis) + '<span class="mp-res-unit">' + esc(t('mp_ls_u','OD')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_ls_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ls_suct','Succión')) + '</div><div class="mp-res-val">' + esc(suct) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ls_liq','Líquido')) + '</div><div class="mp-res-val">' + esc(liq) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ls_dis','Descarga')) + '</div><div class="mp-res-val">' + esc(dis) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ls_note','Elevación ajuste')) + '</div><div class="mp-res-val" style="color:' + (liftUp?'#DC2626':'#16A34A') + ' !important;">' + esc(liftUp ? t('mp_ls_up','') : t('mp_ls_ok','Normal')) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ACCA Manual 10 — ' + esc(t('mp_ls_sub','')) + '</div>' +
          tbl +
        '</div>' +
        exampleTip('mp_ls_case','mp_ls_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 6) CHARGE BY WEIGHT — additional charge per liquid line length
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['chargeByWeight'] = {
    i18n: {
      es: {
        mp_cw_title:'Charge by Line Length',
        mp_cw_sub:'Oz adicional por línea de líquido',
        mp_cw_fac:'Carga de fábrica',
        mp_cw_fac_u:'oz',
        mp_cw_len:'Longitud línea líquido',
        mp_cw_len_u:'ft',
        mp_cw_dia:'Diámetro línea líquido',
        mp_cw_ref:'Refrigerante',
        mp_cw_res_lbl:'Carga total calculada',
        mp_cw_u:'oz',
        mp_cw_desc:'Factura + (ft − 15) × oz/ft',
        mp_cw_per:'Oz por pie',
        mp_cw_add:'Carga adicional',
        mp_cw_base:'Carga base (≤15 ft)',
        mp_cw_case:'Split 3 ton R-410A, fábrica 120 oz, línea 3/8" × 50 ft. Exceso = 50 − 15 = 35 ft × 0.6 oz/ft = 21 oz. Total = 141 oz (8 lb 13 oz).',
        mp_cw_tip:'Pesá TODA carga con báscula digital. Cargar por "presión" es adivinar. Si linea >15 ft, agregá según placa del condensador — cada fabricante tiene su oz/ft.'
      },
      en: {
        mp_cw_title:'Charge by Line Length',
        mp_cw_sub:'Additional oz per liquid line length',
        mp_cw_fac:'Factory charge',
        mp_cw_fac_u:'oz',
        mp_cw_len:'Liquid line length',
        mp_cw_len_u:'ft',
        mp_cw_dia:'Liquid line diameter',
        mp_cw_ref:'Refrigerant',
        mp_cw_res_lbl:'Total calculated charge',
        mp_cw_u:'oz',
        mp_cw_desc:'Factory + (ft − 15) × oz/ft',
        mp_cw_per:'Oz per foot',
        mp_cw_add:'Additional charge',
        mp_cw_base:'Base charge (≤15 ft)',
        mp_cw_case:'3-ton R-410A split, factory 120 oz, 3/8" × 50 ft line. Excess = 50 − 15 = 35 ft × 0.6 oz/ft = 21 oz. Total = 141 oz (8 lb 13 oz).',
        mp_cw_tip:'Weigh EVERY charge with a digital scale. Charging by "pressure" is guessing. If line >15 ft add per condenser nameplate — each manufacturer has its own oz/ft.'
      }
    },
    render: function(state, H){
      var s = state.inputs.chargeByWeight || {};
      var fac = num(s.fac, 120);
      var len = num(s.len, 50);
      var dia = s.dia || '3/8';
      var ref = s.ref || 'R-410A';
      if (!PT_DATA[ref]) ref = 'R-410A';

      // Oz per foot table by OD (approximate halocarbon liquid density)
      var ozPerFtTable = {
        '1/4': { 'R-410A':0.31, 'R-22':0.29, 'R-32':0.22, 'R-454B':0.30, 'R-404A':0.30, 'R-134a':0.29, 'R-407C':0.29, 'R-448A':0.30, 'R-449A':0.30, 'R-1234yf':0.28, 'R-290':0.14, 'R-600a':0.14 },
        '5/16':{ 'R-410A':0.43, 'R-22':0.41, 'R-32':0.32, 'R-454B':0.42, 'R-404A':0.42, 'R-134a':0.41, 'R-407C':0.41, 'R-448A':0.42, 'R-449A':0.42, 'R-1234yf':0.40, 'R-290':0.20, 'R-600a':0.20 },
        '3/8': { 'R-410A':0.60, 'R-22':0.57, 'R-32':0.45, 'R-454B':0.59, 'R-404A':0.59, 'R-134a':0.58, 'R-407C':0.58, 'R-448A':0.59, 'R-449A':0.59, 'R-1234yf':0.56, 'R-290':0.28, 'R-600a':0.28 },
        '1/2': { 'R-410A':1.15, 'R-22':1.10, 'R-32':0.85, 'R-454B':1.13, 'R-404A':1.13, 'R-134a':1.10, 'R-407C':1.10, 'R-448A':1.13, 'R-449A':1.13, 'R-1234yf':1.08, 'R-290':0.54, 'R-600a':0.54 },
        '5/8': { 'R-410A':1.85, 'R-22':1.77, 'R-32':1.36, 'R-454B':1.82, 'R-404A':1.82, 'R-134a':1.77, 'R-407C':1.77, 'R-448A':1.82, 'R-449A':1.82, 'R-1234yf':1.72, 'R-290':0.87, 'R-600a':0.87 },
        '3/4': { 'R-410A':2.70, 'R-22':2.58, 'R-32':2.00, 'R-454B':2.66, 'R-404A':2.66, 'R-134a':2.58, 'R-407C':2.58, 'R-448A':2.66, 'R-449A':2.66, 'R-1234yf':2.52, 'R-290':1.27, 'R-600a':1.27 }
      };
      if (!ozPerFtTable[dia]) dia = '3/8';
      var ozFt = ozPerFtTable[dia][ref] || 0.60;
      var addFt = Math.max(0, len - 15);
      var addOz = addFt * ozFt;
      var total = fac + addOz;

      var diaOpts = '';
      var diaList = ['1/4','5/16','3/8','1/2','5/8','3/4'];
      for (var i=0;i<diaList.length;i++){
        diaOpts += '<option value="' + diaList[i] + '"' + (diaList[i]===dia?' selected':'') + '>' + diaList[i] + '" OD</option>';
      }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cw_fac','Carga de fábrica')) + '</span><span class="mp-unit">' + esc(t('mp_cw_fac_u','oz')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="chargeByWeight.fac" value="' + fac + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cw_len','Longitud línea líquido')) + '</span><span class="mp-unit">' + esc(t('mp_cw_len_u','ft')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="chargeByWeight.len" value="' + len + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cw_dia','Diámetro línea líquido')) + '</span><span class="mp-unit">OD</span></div>' +
            '<select class="mp-in" data-in="chargeByWeight.dia">' + diaOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cw_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="chargeByWeight.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_cw_res_lbl','Carga total calculada')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(total,1)) + '<span class="mp-res-unit">' + esc(t('mp_cw_u','oz')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_cw_desc','')) + ' · ' + esc(fmt(total/16,2)) + ' lb</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_cw_base','Carga base')) + '</div><div class="mp-res-val">' + esc(fmt(fac,1)) + ' oz</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cw_per','Oz por pie')) + '</div><div class="mp-res-val">' + esc(fmt(ozFt,2)) + ' oz/ft</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cw_add','Carga adicional')) + '</div><div class="mp-res-val">' + esc(fmt(addOz,1)) + ' oz (' + esc(fmt(addFt,0)) + ' ft)</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_cw_case','mp_cw_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 7) COMPRESSION RATIO — CR = Pabs_d / Pabs_s
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['compRatio'] = {
    i18n: {
      es: {
        mp_cr_title:'Compression Ratio',
        mp_cr_sub:'CR = P_abs descarga / P_abs succión',
        mp_cr_pd:'Presión de descarga',
        mp_cr_pd_u:'psig',
        mp_cr_ps:'Presión de succión',
        mp_cr_ps_u:'psig',
        mp_cr_res_lbl:'Compression Ratio',
        mp_cr_u:':1',
        mp_cr_desc:'CR = (Pd + 14.7) / (Ps + 14.7)',
        mp_cr_class:'Clasificación',
        mp_cr_pd_abs:'Pd absoluta',
        mp_cr_ps_abs:'Ps absoluta',
        mp_cr_ex:'Excelente (<3)',
        mp_cr_good:'Buena (3–5)',
        mp_cr_ok:'Aceptable (5–8)',
        mp_cr_marg:'Marginal (8–10)',
        mp_cr_fail:'Fallando (>10)',
        mp_cr_case:'Walk-in R-404A, descarga 260 psig, succión 10 psig → CR = 274.7/24.7 = 11.1 → compresor fallando. Revisá válvula de descarga o cambiá compresor.',
        mp_cr_tip:'CR alto = calentamiento = falla de aceite = compresor muerto. Para refrigeración ≥2 etapas (CR>10) usá low-temp compound o booster system.'
      },
      en: {
        mp_cr_title:'Compression Ratio',
        mp_cr_sub:'CR = P_abs discharge / P_abs suction',
        mp_cr_pd:'Discharge pressure',
        mp_cr_pd_u:'psig',
        mp_cr_ps:'Suction pressure',
        mp_cr_ps_u:'psig',
        mp_cr_res_lbl:'Compression Ratio',
        mp_cr_u:':1',
        mp_cr_desc:'CR = (Pd + 14.7) / (Ps + 14.7)',
        mp_cr_class:'Classification',
        mp_cr_pd_abs:'Pd absolute',
        mp_cr_ps_abs:'Ps absolute',
        mp_cr_ex:'Excellent (<3)',
        mp_cr_good:'Good (3–5)',
        mp_cr_ok:'Acceptable (5–8)',
        mp_cr_marg:'Marginal (8–10)',
        mp_cr_fail:'Failing (>10)',
        mp_cr_case:'R-404A walk-in, discharge 260 psig, suction 10 psig → CR = 274.7/24.7 = 11.1 → compressor failing. Check discharge valve or replace compressor.',
        mp_cr_tip:'High CR = heat = oil breakdown = dead compressor. For refrigeration ≥2 stages (CR>10) use low-temp compound or booster system.'
      }
    },
    render: function(state, H){
      var s = state.inputs.compRatio || {};
      var pd = num(s.pd, 400);
      var ps = num(s.ps, 118);
      var pdAbs = pd + 14.7;
      var psAbs = ps + 14.7;
      var cr = (psAbs > 0) ? (pdAbs / psAbs) : 0;
      var classKey = 'mp_cr_ok';
      var color = '#16A34A';
      if (cr < 3){ classKey = 'mp_cr_ex'; color = '#16A34A'; }
      else if (cr < 5){ classKey = 'mp_cr_good'; color = '#16A34A'; }
      else if (cr < 8){ classKey = 'mp_cr_ok'; color = '#16A34A'; }
      else if (cr < 10){ classKey = 'mp_cr_marg'; color = '#D97706'; }
      else { classKey = 'mp_cr_fail'; color = '#DC2626'; }

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cr_pd','Presión de descarga')) + '</span><span class="mp-unit">' + esc(t('mp_cr_pd_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="compRatio.pd" value="' + pd + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cr_ps','Presión de succión')) + '</span><span class="mp-unit">' + esc(t('mp_cr_ps_u','psig')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="compRatio.ps" value="' + ps + '" step="1" min="0" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_cr_res_lbl','Compression Ratio')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(cr,2)) + '<span class="mp-res-unit">' + esc(t('mp_cr_u',':1')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_cr_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_cr_pd_abs','Pd absoluta')) + '</div><div class="mp-res-val">' + esc(fmt(pdAbs,1)) + ' psia</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cr_ps_abs','Ps absoluta')) + '</div><div class="mp-res-val">' + esc(fmt(psAbs,1)) + ' psia</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cr_class','Clasificación')) + '</div><div class="mp-res-val" style="color:' + color + ' !important;">' + esc(t(classKey,'')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_cr_case','mp_cr_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 8) MASS FLOW — refrigerant mass flow rate
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['massFlow'] = {
    i18n: {
      es: {
        mp_mf_title:'Mass Flow Rate',
        mp_mf_sub:'Flujo másico del refrigerante',
        mp_mf_tons:'Capacidad',
        mp_mf_tons_u:'ton',
        mp_mf_ref:'Refrigerante',
        mp_mf_evap:'Temp. evap',
        mp_mf_evap_u:'°F',
        mp_mf_res_lbl:'Flujo másico',
        mp_mf_u:'lb/hr',
        mp_mf_desc:'ṁ = BTU/hr ÷ NRE (efecto refrigerante neto)',
        mp_mf_btu:'Capacidad BTU/hr',
        mp_mf_nre:'NRE (BTU/lb)',
        mp_mf_kg:'Flujo másico (kg/s)',
        mp_mf_case:'A/C split 3 ton R-410A @ 40°F evap → 36 000 BTU/hr ÷ 70 BTU/lb = 514 lb/hr (0.065 kg/s). Usalo para chequear capacidad real del compresor.',
        mp_mf_tip:'NRE varía con temp de evap: baja el evap → baja NRE → sube flujo másico para la misma capacidad. Por eso refrig de baja temp requiere compresores más grandes.'
      },
      en: {
        mp_mf_title:'Mass Flow Rate',
        mp_mf_sub:'Refrigerant mass flow',
        mp_mf_tons:'Capacity',
        mp_mf_tons_u:'ton',
        mp_mf_ref:'Refrigerant',
        mp_mf_evap:'Evap temp',
        mp_mf_evap_u:'°F',
        mp_mf_res_lbl:'Mass flow',
        mp_mf_u:'lb/hr',
        mp_mf_desc:'ṁ = BTU/hr ÷ NRE (net refrigerating effect)',
        mp_mf_btu:'Capacity BTU/hr',
        mp_mf_nre:'NRE (BTU/lb)',
        mp_mf_kg:'Mass flow (kg/s)',
        mp_mf_case:'3-ton R-410A A/C split @ 40°F evap → 36 000 BTU/hr ÷ 70 BTU/lb = 514 lb/hr (0.065 kg/s). Use it to check actual compressor capacity.',
        mp_mf_tip:'NRE varies with evap temp: lower evap → lower NRE → higher mass flow for same capacity. That is why low-temp refrigeration needs bigger compressors.'
      }
    },
    render: function(state, H){
      var s = state.inputs.massFlow || {};
      var tons = num(s.tons, 3);
      var ref = s.ref || 'R-410A';
      if (!NRE[ref]) ref = 'R-410A';
      var evap = num(s.evap, 40);
      // Adjust NRE with evap temp: ~1% per °F below 40°F
      var nre = NRE[ref] * (1 + (evap - 40) * 0.01);
      if (nre < 20) nre = 20;
      var btu = tons * 12000;
      var lbhr = (nre > 0) ? (btu / nre) : 0;
      var kgs = lbhr * 0.453592 / 3600;

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_mf_tons','Capacidad')) + '</span><span class="mp-unit">' + esc(t('mp_mf_tons_u','ton')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="massFlow.tons" value="' + tons + '" step="0.5" min="0.5" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_mf_ref','Refrigerante')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="massFlow.ref">' + refrigOpts(PT_REFRIGS, ref) + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_mf_evap','Temp. evap')) + '</span><span class="mp-unit">' + esc(t('mp_mf_evap_u','°F')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="massFlow.evap" value="' + evap + '" step="5" min="-40" max="55" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_mf_res_lbl','Flujo másico')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(lbhr,0)) + '<span class="mp-res-unit">' + esc(t('mp_mf_u','lb/hr')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_mf_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_mf_btu','Capacidad BTU/hr')) + '</div><div class="mp-res-val">' + esc(fmt(btu,0)) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_mf_nre','NRE')) + '</div><div class="mp-res-val">' + esc(fmt(nre,1)) + ' BTU/lb</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_mf_kg','Flujo másico (kg/s)')) + '</div><div class="mp-res-val">' + esc(fmt(kgs,4)) + ' kg/s</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_mf_case','mp_mf_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 9) COP ↔ EER CONVERTER
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['copEer'] = {
    i18n: {
      es: {
        mp_ce_title:'COP ↔ EER',
        mp_ce_sub:'Conversor de eficiencia',
        mp_ce_mode:'Entrada',
        mp_ce_mode_cop:'COP → EER',
        mp_ce_mode_eer:'EER → COP',
        mp_ce_val:'Valor',
        mp_ce_cop:'COP',
        mp_ce_eer:'EER',
        mp_ce_seer:'SEER (aprox)',
        mp_ce_res_lbl:'Equivalencias',
        mp_ce_u:'',
        mp_ce_desc:'EER = COP × 3.412 · SEER ≈ EER × 1.25',
        mp_ce_class:'Nivel',
        mp_ce_min:'Mínimo actual (DOE 2023)',
        mp_ce_note:'Nota',
        mp_ce_note_val:'COP: W_util / W_elec. EER: BTU/hr por W.',
        mp_ce_case:'Inverter 18 SEER = EER ~14.4 = COP ~4.2. Vs. unidad vieja 10 SEER (EER 8, COP 2.35): ahorro de 40% energía en las mismas horas.',
        mp_ce_tip:'SEER2 (2023) es ~4.5% menor que SEER1 mismo equipo. DOE SEER mínimo: 14.3 norte / 15.2 sur. Verificá la etiqueta AHRI, no la caja.'
      },
      en: {
        mp_ce_title:'COP ↔ EER',
        mp_ce_sub:'Efficiency converter',
        mp_ce_mode:'Input',
        mp_ce_mode_cop:'COP → EER',
        mp_ce_mode_eer:'EER → COP',
        mp_ce_val:'Value',
        mp_ce_cop:'COP',
        mp_ce_eer:'EER',
        mp_ce_seer:'SEER (approx)',
        mp_ce_res_lbl:'Equivalents',
        mp_ce_u:'',
        mp_ce_desc:'EER = COP × 3.412 · SEER ≈ EER × 1.25',
        mp_ce_class:'Tier',
        mp_ce_min:'Current minimum (DOE 2023)',
        mp_ce_note:'Note',
        mp_ce_note_val:'COP: W_useful / W_input. EER: BTU/hr per W.',
        mp_ce_case:'Inverter 18 SEER = EER ~14.4 = COP ~4.2. Vs. old 10 SEER unit (EER 8, COP 2.35): 40% energy savings at the same runtime.',
        mp_ce_tip:'SEER2 (2023) is ~4.5% lower than SEER1 for the same equipment. DOE min SEER: 14.3 north / 15.2 south. Check the AHRI label, not the box.'
      }
    },
    render: function(state, H){
      var s = state.inputs.copEer || {};
      var mode = s.mode || 'cop';
      var val = num(s.val, (mode==='cop'?4.0:13.5));
      var cop, eer, seer;
      if (mode === 'cop'){
        cop = val;
        eer = cop * 3.412;
      } else {
        eer = val;
        cop = eer / 3.412;
      }
      seer = eer * 1.25;
      var tierKey = 'mp_ce_good';
      var tierColor = '#16A34A';
      var tierLabel = '';
      if (cop < 2.5){ tierLabel = (mode==='cop'?'Basic':'Básico'); tierColor = '#DC2626'; }
      else if (cop < 3.5){ tierLabel = 'Standard'; tierColor = '#D97706'; }
      else if (cop < 4.5){ tierLabel = (mode==='cop'?'High efficiency':'Alta eficiencia'); tierColor = '#16A34A'; }
      else { tierLabel = 'Inverter / Premium'; tierColor = '#059669'; }

      var modeOpts = '' +
        '<option value="cop"' + (mode==='cop'?' selected':'') + '>' + esc(t('mp_ce_mode_cop','COP → EER')) + '</option>' +
        '<option value="eer"' + (mode==='eer'?' selected':'') + '>' + esc(t('mp_ce_mode_eer','EER → COP')) + '</option>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ce_mode','Entrada')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="copEer.mode">' + modeOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ce_val','Valor')) + '</span><span class="mp-unit">' + esc(mode==='cop'?'COP':'EER') + '</span></div>' +
            '<input type="number" class="mp-in" data-in="copEer.val" value="' + val + '" step="0.1" min="0.1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ce_res_lbl','Equivalencias')) + '</div>' +
          '<div class="mp-res-main">' + esc(fmt(cop,2)) + ' COP / ' + esc(fmt(eer,2)) + ' EER' + '</div>' +
          '<div class="mp-res-desc">' + esc(t('mp_ce_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_cop','COP')) + '</div><div class="mp-res-val">' + esc(fmt(cop,2)) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_eer','EER')) + '</div><div class="mp-res-val">' + esc(fmt(eer,2)) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_seer','SEER (aprox)')) + '</div><div class="mp-res-val">' + esc(fmt(seer,1)) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_class','Nivel')) + '</div><div class="mp-res-val" style="color:' + tierColor + ' !important;">' + esc(tierLabel) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_min','Mínimo DOE')) + '</div><div class="mp-res-val">14.3 SEER2 / COP 3.3</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ce_note','Nota')) + '</div><div class="mp-res-val" style="font-size:12px;">' + esc(t('mp_ce_note_val','')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_ce_case','mp_ce_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 10) OIL TRAP — P-trap count and sizing for suction risers
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['oilTrap'] = {
    i18n: {
      es: {
        mp_ot_title:'Oil Trap / P-Trap',
        mp_ot_sub:'Trampas de aceite en línea de succión vertical',
        mp_ot_rise:'Altura vertical de succión',
        mp_ot_rise_u:'ft',
        mp_ot_oil:'Tipo de aceite',
        mp_ot_poe:'POE (sintético HFC/HFO)',
        mp_ot_mo:'Mineral (CFC/HCFC)',
        mp_ot_size:'Tamaño línea succión',
        mp_ot_size_u:'OD',
        mp_ot_comp:'Compresor',
        mp_ot_single:'Single-stage',
        mp_ot_multi:'Multi-capacidad / inverter',
        mp_ot_res_lbl:'Trampas requeridas',
        mp_ot_u:'P-traps',
        mp_ot_desc:'Una P-trap cada 20 ft para halocarbonos',
        mp_ot_spacing:'Espaciado',
        mp_ot_depth:'Profundidad mínima',
        mp_ot_double:'Doble riser',
        mp_ot_double_yes:'✓ Requerido',
        mp_ot_double_no:'No requerido',
        mp_ot_bottom:'Trampa inicial (base)',
        mp_ot_bottom_val:'Siempre en la base del riser',
        mp_ot_case:'Walk-in con compresor multi-capacidad en azotea. Riser 28 ft, succión 7/8" OD, aceite POE → 2 P-traps (base + mitad) + doble riser 5/8"+7/8" porque desciende a 20% de capacidad.',
        mp_ot_tip:'Si el compresor pierde aceite y trae alarma de bajo nivel, tu línea de succión vertical probablemente no tiene trampas suficientes. Multi-capacidad SIEMPRE lleva doble riser.'
      },
      en: {
        mp_ot_title:'Oil Trap / P-Trap',
        mp_ot_sub:'Oil traps in vertical suction risers',
        mp_ot_rise:'Vertical suction rise',
        mp_ot_rise_u:'ft',
        mp_ot_oil:'Oil type',
        mp_ot_poe:'POE (synthetic HFC/HFO)',
        mp_ot_mo:'Mineral (CFC/HCFC)',
        mp_ot_size:'Suction line size',
        mp_ot_size_u:'OD',
        mp_ot_comp:'Compressor',
        mp_ot_single:'Single-stage',
        mp_ot_multi:'Multi-capacity / inverter',
        mp_ot_res_lbl:'P-traps required',
        mp_ot_u:'P-traps',
        mp_ot_desc:'One P-trap every 20 ft for halocarbons',
        mp_ot_spacing:'Spacing',
        mp_ot_depth:'Minimum trap depth',
        mp_ot_double:'Double riser',
        mp_ot_double_yes:'✓ Required',
        mp_ot_double_no:'Not required',
        mp_ot_bottom:'Bottom trap',
        mp_ot_bottom_val:'Always at the base of the riser',
        mp_ot_case:'Walk-in with multi-capacity compressor on roof. 28-ft riser, 7/8" OD suction, POE oil → 2 P-traps (base + midpoint) + double riser 5/8"+7/8" because it drops to 20% capacity.',
        mp_ot_tip:'If the compressor burns oil and trips a low-level alarm, your vertical suction probably lacks traps. Multi-capacity ALWAYS requires a double riser.'
      }
    },
    render: function(state, H){
      var s = state.inputs.oilTrap || {};
      var rise = num(s.rise, 28);
      var oil = s.oil || 'poe';
      var size = s.size || '7/8';
      var comp = s.comp || 'multi';

      // Number of traps: one at base + one every 20 ft for halocarbons.
      var traps = 1;
      if (rise > 20) traps = 1 + Math.floor(rise / 20);
      // Minimum trap depth ≈ 3× line OD, inches.
      var sizeInches = { '1/2':0.5, '5/8':0.625, '3/4':0.75, '7/8':0.875, '1-1/8':1.125, '1-3/8':1.375, '1-5/8':1.625 };
      var od = sizeInches[size] || 0.875;
      var depth = 3 * od; // inches
      var doubleRiser = (comp === 'multi' && rise >= 8);

      var oilOpts = '' +
        '<option value="poe"' + (oil==='poe'?' selected':'') + '>' + esc(t('mp_ot_poe','POE (sintético HFC/HFO)')) + '</option>' +
        '<option value="mo"' + (oil==='mo'?' selected':'') + '>' + esc(t('mp_ot_mo','Mineral (CFC/HCFC)')) + '</option>';
      var sizeOpts = '';
      var sizeList = ['1/2','5/8','3/4','7/8','1-1/8','1-3/8','1-5/8'];
      for (var i=0;i<sizeList.length;i++){
        sizeOpts += '<option value="' + sizeList[i] + '"' + (sizeList[i]===size?' selected':'') + '>' + sizeList[i] + '" OD</option>';
      }
      var compOpts = '' +
        '<option value="single"' + (comp==='single'?' selected':'') + '>' + esc(t('mp_ot_single','Single-stage')) + '</option>' +
        '<option value="multi"' + (comp==='multi'?' selected':'') + '>' + esc(t('mp_ot_multi','Multi-capacidad / inverter')) + '</option>';

      return '' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ot_rise','Altura vertical de succión')) + '</span><span class="mp-unit">' + esc(t('mp_ot_rise_u','ft')) + '</span></div>' +
            '<input type="number" class="mp-in" data-in="oilTrap.rise" value="' + rise + '" step="1" min="0" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ot_oil','Tipo de aceite')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="oilTrap.oil">' + oilOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ot_size','Tamaño línea succión')) + '</span><span class="mp-unit">' + esc(t('mp_ot_size_u','OD')) + '</span></div>' +
            '<select class="mp-in" data-in="oilTrap.size">' + sizeOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ot_comp','Compresor')) + '</span><span class="mp-unit">—</span></div>' +
            '<select class="mp-in" data-in="oilTrap.comp">' + compOpts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ot_res_lbl','Trampas requeridas')) + '</div>' +
          '<div class="mp-res-main">' + esc(traps) + '<span class="mp-res-unit">' + esc(t('mp_ot_u','P-traps')) + '</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_ot_desc','')) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ot_spacing','Espaciado')) + '</div><div class="mp-res-val">20 ft máx.</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ot_depth','Profundidad mínima')) + '</div><div class="mp-res-val">' + esc(fmt(depth,2)) + ' in (3×OD)</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ot_bottom','Trampa inicial')) + '</div><div class="mp-res-val">' + esc(t('mp_ot_bottom_val','Siempre en la base')) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ot_double','Doble riser')) + '</div><div class="mp-res-val" style="color:' + (doubleRiser?'#DC2626':'#16A34A') + ' !important;">' + esc(doubleRiser ? t('mp_ot_double_yes','✓ Requerido') : t('mp_ot_double_no','No requerido')) + '</div></div>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_ot_case','mp_ot_tip');
    }
  };

})();
