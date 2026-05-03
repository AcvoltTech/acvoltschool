// Maestro Pro · Math & Construction calculators (10 tools)
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};
  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }

  function num(v,d){ var n=parseFloat(v); if(isNaN(n)) return (d==null?0:d); return n; }
  function pick(state,tool,field,dflt){
    if (state && state.inputs && state.inputs[tool] && state.inputs[tool][field] != null && state.inputs[tool][field] !== '') {
      return state.inputs[tool][field];
    }
    return dflt;
  }
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var tmp=b; b=a%b; a=tmp; } return a||1; }
  function reduceFrac(n,d){
    if (d < 0) { n=-n; d=-d; }
    var g = gcd(Math.round(Math.abs(n)), Math.round(Math.abs(d)));
    return { n: Math.round(n/g), d: Math.round(d/g) };
  }
  function fmtFrac(n,d){
    if (d === 0) return '—';
    var r = reduceFrac(n,d);
    if (r.d === 1) return String(r.n);
    var whole = 0;
    if (Math.abs(r.n) >= r.d) {
      whole = (r.n < 0 ? -1 : 1) * Math.floor(Math.abs(r.n)/r.d);
      var remN = Math.abs(r.n) - Math.floor(Math.abs(r.n)/r.d)*r.d;
      if (remN === 0) return String(whole);
      return whole + ' ' + remN + '/' + r.d;
    }
    return r.n + '/' + r.d;
  }
  function round2(x){ return Math.round(x*100)/100; }
  function round3(x){ return Math.round(x*1000)/1000; }
  function round4(x){ return Math.round(x*10000)/10000; }

  // ─────────────────────────── fracCalc ───────────────────────────
  window.MP_CALCS['fracCalc'] = {
    i18n: {
      mp_fc_a:         { es:'Fracción A', en:'Fraction A' },
      mp_fc_b:         { es:'Fracción B', en:'Fraction B' },
      mp_fc_whole:     { es:'Entero',     en:'Whole' },
      mp_fc_num:       { es:'Numerador',  en:'Numerator' },
      mp_fc_denom:     { es:'Denominador',en:'Denominator' },
      mp_fc_op:        { es:'Operación',  en:'Operation' },
      mp_fc_op_add:    { es:'Suma (+)',   en:'Add (+)' },
      mp_fc_op_sub:    { es:'Resta (−)',  en:'Subtract (−)' },
      mp_fc_op_mul:    { es:'× Multiplicar', en:'× Multiply' },
      mp_fc_res_lbl:   { es:'Resultado',  en:'Result' },
      mp_fc_decimal:   { es:'En decimal', en:'As decimal' },
      mp_fc_inches:    { es:'En pulgadas',en:'In inches' },
      mp_fc_case:      { es:'Cortas un tubo de 2 1/2" y uniste con 3/4" más: 2 1/2 + 3/4 = 3 1/4".', en:'You cut 2 1/2" of pipe and joined with 3/4" more: 2 1/2 + 3/4 = 3 1/4".' },
      mp_fc_tip:       { es:'Convierte a dieciseisavos mentalmente: 1/2 = 8/16, 3/4 = 12/16. Sumas 20/16 = 1 4/16 = 1 1/4".', en:'Think in sixteenths: 1/2 = 8/16, 3/4 = 12/16. Add → 20/16 = 1 4/16 = 1 1/4".' }
    },
    render: function(state){
      var aw = num(pick(state,'fracCalc','aw',2),2);
      var an = num(pick(state,'fracCalc','an',1),1);
      var ad = num(pick(state,'fracCalc','ad',2),2);
      var bw = num(pick(state,'fracCalc','bw',0),0);
      var bn = num(pick(state,'fracCalc','bn',3),3);
      var bd = num(pick(state,'fracCalc','bd',4),4);
      var op = pick(state,'fracCalc','op','add');
      if (ad === 0) ad = 1;
      if (bd === 0) bd = 1;
      // Convert mixed → improper
      var A_n = aw*ad + (aw<0?-Math.abs(an):Math.abs(an));
      var A_d = ad;
      var B_n = bw*bd + (bw<0?-Math.abs(bn):Math.abs(bn));
      var B_d = bd;
      var R_n, R_d;
      if (op === 'sub')      { R_n = A_n*B_d - B_n*A_d; R_d = A_d*B_d; }
      else if (op === 'mul') { R_n = A_n*B_n;           R_d = A_d*B_d; }
      else                   { R_n = A_n*B_d + B_n*A_d; R_d = A_d*B_d; op='add'; }
      var resFrac = fmtFrac(R_n, R_d);
      var resDec = R_d === 0 ? 0 : (R_n / R_d);
      var decStr = (Math.abs(resDec - Math.round(resDec)) < 0.0005) ? String(Math.round(resDec)) : resDec.toFixed(4);
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fc_a','Fracción A'))+'</span><span class="mp-unit">'+esc(t('mp_fc_whole','Entero'))+' · '+esc(t('mp_fc_num','Numerador'))+' / '+esc(t('mp_fc_denom','Denominador'))+'</span></div>'+
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'+
              '<input type="number" class="mp-in" data-in="fracCalc.aw" value="'+aw+'" step="1" />'+
              '<input type="number" class="mp-in" data-in="fracCalc.an" value="'+an+'" step="1" />'+
              '<input type="number" class="mp-in" data-in="fracCalc.ad" value="'+ad+'" step="1" />'+
            '</div>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fc_op','Operación'))+'</span></div>'+
            '<select class="mp-in" data-in="fracCalc.op">'+
              '<option value="add"'+(op==='add'?' selected':'')+'>'+esc(t('mp_fc_op_add','Suma (+)'))+'</option>'+
              '<option value="sub"'+(op==='sub'?' selected':'')+'>'+esc(t('mp_fc_op_sub','Resta (−)'))+'</option>'+
              '<option value="mul"'+(op==='mul'?' selected':'')+'>'+esc(t('mp_fc_op_mul','× Multiplicar'))+'</option>'+
            '</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fc_b','Fracción B'))+'</span><span class="mp-unit">'+esc(t('mp_fc_whole','Entero'))+' · '+esc(t('mp_fc_num','Numerador'))+' / '+esc(t('mp_fc_denom','Denominador'))+'</span></div>'+
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'+
              '<input type="number" class="mp-in" data-in="fracCalc.bw" value="'+bw+'" step="1" />'+
              '<input type="number" class="mp-in" data-in="fracCalc.bn" value="'+bn+'" step="1" />'+
              '<input type="number" class="mp-in" data-in="fracCalc.bd" value="'+bd+'" step="1" />'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_fc_res_lbl','Resultado'))+'</div>'+
          '<div class="mp-res-main">'+esc(resFrac)+'</div>'+
          '<div class="mp-res-desc">A '+(op==='sub'?'−':(op==='mul'?'×':'+'))+' B</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_fc_decimal','En decimal'))+'</div><div class="mp-res-val">'+esc(decStr)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_fc_inches','En pulgadas'))+'</div><div class="mp-res-val">'+esc(decStr)+'"</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_fc_case','mp_fc_tip');
    }
  };

  // ─────────────────────────── tapeMeasure ───────────────────────────
  window.MP_CALCS['tapeMeasure'] = {
    i18n: {
      mp_tm_in:        { es:'Pulgadas decimal', en:'Decimal inches' },
      mp_tm_res_lbl:   { es:'Lectura en cinta', en:'Tape reading' },
      mp_tm_to_16:     { es:'Al 1/16"',         en:'To 1/16"' },
      mp_tm_to_8:      { es:'Al 1/8"',          en:'To 1/8"' },
      mp_tm_to_4:      { es:'Al 1/4"',          en:'To 1/4"' },
      mp_tm_to_2:      { es:'Al 1/2"',          en:'To 1/2"' },
      mp_tm_ticks:     { es:'Desglose visual',  en:'Visual breakdown' },
      mp_tm_case:      { es:'Mides 3.4375" en un ducto: la cinta marca 3 7/16".', en:'You measure 3.4375" on a duct: the tape reads 3 7/16".' },
      mp_tm_tip:       { es:'La línea MÁS larga entre números = 1/2". La siguiente = 1/4". Luego 1/8", después 1/16" (la más cortita).', en:'Longest line between numbers = 1/2". Next = 1/4". Then 1/8", then 1/16" (tiniest).' }
    },
    render: function(state){
      var v = num(pick(state,'tapeMeasure','inches',3.4375),3.4375);
      function toFracStr(val, denom){
        var whole = Math.floor(val);
        var frac = val - whole;
        var num1 = Math.round(frac * denom);
        if (num1 === denom) { whole += 1; num1 = 0; }
        if (num1 === 0) return String(whole) + '"';
        var r = reduceFrac(num1, denom);
        return whole + ' ' + r.n + '/' + r.d + '"';
      }
      var s16 = toFracStr(v,16);
      var s8  = toFracStr(v,8);
      var s4  = toFracStr(v,4);
      var s2  = toFracStr(v,2);
      // Visual ticks: 16 segments per inch
      var segs = Math.max(0, Math.min(16, Math.round((v - Math.floor(v))*16)));
      var bars = '';
      for (var i=0;i<16;i++){
        var hgt;
        if (i===0 || i===16) hgt=22;
        else if (i===8) hgt=18;
        else if (i===4 || i===12) hgt=14;
        else if (i%2===0) hgt=10;
        else hgt=6;
        var color = (i<=segs) ? '#111' : '#D6D3D1';
        bars += '<div style="display:inline-block;width:4px;height:'+hgt+'px;background:'+color+';margin-right:2px;vertical-align:bottom;"></div>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tm_in','Pulgadas decimal'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="tapeMeasure.inches" value="'+v+'" step="0.0625" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_tm_res_lbl','Lectura en cinta'))+'</div>'+
          '<div class="mp-res-main">'+esc(s16)+'</div>'+
          '<div class="mp-res-desc">'+esc(t('mp_tm_to_16','Al 1/16"'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_tm_to_8','Al 1/8"'))+'</div><div class="mp-res-val">'+esc(s8)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_tm_to_4','Al 1/4"'))+'</div><div class="mp-res-val">'+esc(s4)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_tm_to_2','Al 1/2"'))+'</div><div class="mp-res-val">'+esc(s2)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_tm_ticks','Desglose visual'))+'</div>'+
          '<div style="padding:8px 4px;text-align:left;">'+bars+'</div>'+
          '<div style="font-size:12px;color:#44403C;margin-top:4px;">0" &nbsp;·&nbsp; 1/4" &nbsp;·&nbsp; 1/2" &nbsp;·&nbsp; 3/4" &nbsp;·&nbsp; 1"</div>'+
        '</div>'+
        exampleTip('mp_tm_case','mp_tm_tip');
    }
  };

  // ─────────────────────────── plumbBob ───────────────────────────
  window.MP_CALCS['plumbBob'] = {
    i18n: {
      mp_pb_h:         { es:'Altura',           en:'Height' },
      mp_pb_off:       { es:'Desviación',       en:'Offset' },
      mp_pb_res_lbl:   { es:'Grados fuera de plomo', en:'Degrees off plumb' },
      mp_pb_plumb:     { es:'A plomo ✓',        en:'Plumb ✓' },
      mp_pb_off_lbl:   { es:'Fuera de plomo ⚠', en:'Off plumb ⚠' },
      mp_pb_ratio:     { es:'Relación off/alto',en:'Offset/height ratio' },
      mp_pb_inchft:    { es:'Pulgadas por pie', en:'Inches per foot' },
      mp_pb_case:      { es:'Montas un condensador a 8 ft con 0.5" fuera: ≈ 0.30°. Por NEC/ACCA sigue siendo aceptable.', en:'You mount a condenser 8 ft tall with 0.5" offset: ≈ 0.30°. Still acceptable per ACCA.' },
      mp_pb_tip:       { es:'Regla Chaka: 1/4" fuera en 10 ft ≈ 0.12° — imperceptible. Más de 1° y la unidad vibra.', en:'Chaka rule: 1/4" off in 10 ft ≈ 0.12° — invisible. Over 1° and the unit vibrates.' }
    },
    render: function(state){
      var hft = num(pick(state,'plumbBob','height',8),8);
      var offIn = num(pick(state,'plumbBob','offset',0.5),0.5);
      var hIn = hft * 12;
      var deg = (hIn > 0) ? (Math.atan2(offIn, hIn) * 180 / Math.PI) : 0;
      var isPlumb = Math.abs(deg) < 0.25;
      var color = isPlumb ? '#15803D' : (Math.abs(deg) < 1 ? '#CA8A04' : '#B91C1C');
      var ratio = hIn > 0 ? (offIn / hIn) : 0;
      var inPerFt = hft > 0 ? (offIn / hft) : 0;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pb_h','Altura'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="plumbBob.height" value="'+hft+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pb_off','Desviación'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="plumbBob.offset" value="'+offIn+'" step="0.0625" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_pb_res_lbl','Grados fuera de plomo'))+'</div>'+
          '<div class="mp-res-main">'+deg.toFixed(2)+'<span class="mp-res-unit">°</span></div>'+
          '<div class="mp-res-desc" style="color:'+color+' !important;font-weight:600;">'+esc(isPlumb?t('mp_pb_plumb','A plomo ✓'):t('mp_pb_off_lbl','Fuera de plomo ⚠'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_ratio','Relación off/alto'))+'</div><div class="mp-res-val">'+round4(ratio).toFixed(4)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_inchft','Pulgadas por pie'))+'</div><div class="mp-res-val">'+inPerFt.toFixed(3)+'"/ft</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_pb_case','mp_pb_tip');
    }
  };

  // ─────────────────────────── levels ───────────────────────────
  window.MP_CALCS['levels'] = {
    i18n: {
      mp_lv_rise:      { es:'Subida (rise)',    en:'Rise' },
      mp_lv_run:       { es:'Recorrido (run)',  en:'Run' },
      mp_lv_res_lbl:   { es:'Pendiente',        en:'Slope' },
      mp_lv_pct:       { es:'Porcentaje',       en:'Percent' },
      mp_lv_deg:       { es:'Grados',           en:'Degrees' },
      mp_lv_level:     { es:'A nivel ✓',        en:'Level ✓' },
      mp_lv_notlvl:    { es:'No nivel ⚠',       en:'Not level ⚠' },
      mp_lv_case:      { es:'Línea de condensado de 20" con 1/4" de caída: pendiente 1.25%, ideal para drenar.', en:'20" condensate line with 1/4" drop: 1.25% slope, drains nicely.' },
      mp_lv_tip:       { es:'Para condensado busca 1/8" por ft mínimo (1%). Para un evaporador queremos 0° — usa nivel de 2 ft.', en:'Condensate needs at least 1/8" per ft (1%). Evaporator wants 0° — use a 2 ft level.' }
    },
    render: function(state){
      var rise = num(pick(state,'levels','rise',0.25),0.25);
      var run  = num(pick(state,'levels','run',20),20);
      var pct = run !== 0 ? (rise / run) * 100 : 0;
      var deg = run !== 0 ? (Math.atan2(rise, run) * 180 / Math.PI) : 0;
      var isLevel = Math.abs(deg) < 0.1;
      var color = isLevel ? '#15803D' : (Math.abs(deg) < 2 ? '#CA8A04' : '#B91C1C');
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lv_rise','Subida (rise)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="levels.rise" value="'+rise+'" step="0.0625" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lv_run','Recorrido (run)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="levels.run" value="'+run+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_lv_res_lbl','Pendiente'))+'</div>'+
          '<div class="mp-res-main">'+pct.toFixed(2)+'<span class="mp-res-unit">%</span></div>'+
          '<div class="mp-res-desc" style="color:'+color+' !important;font-weight:600;">'+esc(isLevel?t('mp_lv_level','A nivel ✓'):t('mp_lv_notlvl','No nivel ⚠'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_lv_deg','Grados'))+'</div><div class="mp-res-val">'+deg.toFixed(2)+'°</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_lv_pct','Porcentaje'))+'</div><div class="mp-res-val">'+pct.toFixed(2)+'%</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_lv_case','mp_lv_tip');
    }
  };

  // ─────────────────────────── unitConverter ───────────────────────────
  window.MP_CALCS['unitConverter'] = {
    i18n: {
      mp_uc_cat:       { es:'Categoría',       en:'Category' },
      mp_uc_from:      { es:'De',              en:'From' },
      mp_uc_to:        { es:'A',               en:'To' },
      mp_uc_value:     { es:'Valor',           en:'Value' },
      mp_uc_res_lbl:   { es:'Convertido',      en:'Converted' },
      mp_uc_length:    { es:'Longitud',        en:'Length' },
      mp_uc_area:      { es:'Área',            en:'Area' },
      mp_uc_volume:    { es:'Volumen',         en:'Volume' },
      mp_uc_weight:    { es:'Peso',            en:'Weight' },
      mp_uc_temp:      { es:'Temperatura',     en:'Temperature' },
      mp_uc_press:     { es:'Presión',         en:'Pressure' },
      mp_uc_factor:    { es:'Factor',          en:'Factor' },
      mp_uc_case:      { es:'El SDS del R-410A indica 400 psi. Lo conviertes a kPa para un manual europeo: 400 psi = 2,758 kPa.', en:'The R-410A SDS says 400 psi. You convert to kPa for a European manual: 400 psi = 2,758 kPa.' },
      mp_uc_tip:       { es:'psi → kPa multiplica por 6.895. °F → °C resta 32, multiplica por 5/9. gal → L multiplica por 3.785.', en:'psi → kPa multiply by 6.895. °F → °C subtract 32, times 5/9. gal → L times 3.785.' }
    },
    render: function(state){
      // Each unit is defined by factor to a base (for category). Temp is handled separately.
      var categories = {
        length:   { base:'m',    units:{ 'in':0.0254, 'ft':0.3048, 'm':1, 'cm':0.01, 'mm':0.001 } },
        area:     { base:'sqm',  units:{ 'sqft':0.092903, 'sqm':1 } },
        volume:   { base:'L',    units:{ 'cuft':28.3168, 'cum':1000, 'gal':3.78541, 'L':1 } },
        weight:   { base:'kg',   units:{ 'lb':0.453592, 'kg':1 } },
        temp:     { base:'C',    units:{ 'F':null, 'C':null } },
        pressure: { base:'kPa',  units:{ 'psi':6.89476, 'kPa':1, 'bar':100 } }
      };
      var catLabels = {
        length:   t('mp_uc_length','Longitud'),
        area:     t('mp_uc_area','Área'),
        volume:   t('mp_uc_volume','Volumen'),
        weight:   t('mp_uc_weight','Peso'),
        temp:     t('mp_uc_temp','Temperatura'),
        pressure: t('mp_uc_press','Presión')
      };
      var cat = pick(state,'unitConverter','cat','pressure');
      if (!categories[cat]) cat = 'pressure';
      var unitKeys = [];
      for (var k in categories[cat].units) unitKeys.push(k);
      var defaults = { length:['in','mm'], area:['sqft','sqm'], volume:['gal','L'], weight:['lb','kg'], temp:['F','C'], pressure:['psi','kPa'] };
      var fromU = pick(state,'unitConverter','from', defaults[cat][0]);
      var toU   = pick(state,'unitConverter','to',   defaults[cat][1]);
      if (unitKeys.indexOf(fromU) < 0) fromU = defaults[cat][0];
      if (unitKeys.indexOf(toU)   < 0) toU   = defaults[cat][1];
      var val = num(pick(state,'unitConverter','value',400),400);
      var out = 0, factor = 1;
      if (cat === 'temp') {
        var c;
        if (fromU === 'F') c = (val - 32) * 5/9;
        else c = val;
        if (toU === 'F') out = c * 9/5 + 32;
        else out = c;
        factor = NaN;
      } else {
        var baseVal = val * categories[cat].units[fromU];
        out = baseVal / categories[cat].units[toU];
        factor = categories[cat].units[fromU] / categories[cat].units[toU];
      }
      function buildOpts(selected){
        var html = '';
        for (var i=0;i<unitKeys.length;i++){
          var u = unitKeys[i];
          html += '<option value="'+esc(u)+'"'+(u===selected?' selected':'')+'>'+esc(u)+'</option>';
        }
        return html;
      }
      var catOpts = '';
      for (var c2 in categories) {
        catOpts += '<option value="'+esc(c2)+'"'+(c2===cat?' selected':'')+'>'+esc(catLabels[c2])+'</option>';
      }
      var outStr = (Math.abs(out) < 0.01 && out !== 0) ? out.toExponential(3) : (Math.abs(out) >= 1000 ? out.toFixed(1) : out.toFixed(4));
      var factorStr = isNaN(factor) ? '—' : (Math.abs(factor) >= 1000 ? factor.toFixed(2) : factor.toFixed(5));
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_uc_cat','Categoría'))+'</span></div>'+
            '<select class="mp-in" data-in="unitConverter.cat">'+catOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_uc_value','Valor'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="unitConverter.value" value="'+val+'" step="any" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_uc_from','De'))+'</span></div>'+
            '<select class="mp-in" data-in="unitConverter.from">'+buildOpts(fromU)+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_uc_to','A'))+'</span></div>'+
            '<select class="mp-in" data-in="unitConverter.to">'+buildOpts(toU)+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_uc_res_lbl','Convertido'))+'</div>'+
          '<div class="mp-res-main">'+esc(outStr)+'<span class="mp-res-unit">'+esc(toU)+'</span></div>'+
          '<div class="mp-res-desc">'+val+' '+esc(fromU)+' → '+esc(outStr)+' '+esc(toU)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_uc_factor','Factor'))+'</div><div class="mp-res-val">× '+esc(factorStr)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(catLabels[cat])+'</div><div class="mp-res-val">'+esc(fromU)+' → '+esc(toU)+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_uc_case','mp_uc_tip');
    }
  };

  // ─────────────────────────── areas ───────────────────────────
  window.MP_CALCS['areas'] = {
    i18n: {
      mp_ar_shape:     { es:'Forma',           en:'Shape' },
      mp_ar_rect:      { es:'Rectángulo',      en:'Rectangle' },
      mp_ar_circle:    { es:'Círculo',         en:'Circle' },
      mp_ar_tri:       { es:'Triángulo',       en:'Triangle' },
      mp_ar_w:         { es:'Ancho',           en:'Width' },
      mp_ar_h:         { es:'Alto',            en:'Height' },
      mp_ar_r:         { es:'Radio',           en:'Radius' },
      mp_ar_b:         { es:'Base',            en:'Base' },
      mp_ar_res_lbl:   { es:'Área',            en:'Area' },
      mp_ar_sqft:      { es:'Pies²',           en:'Sq ft' },
      mp_ar_sqm:       { es:'Metros²',         en:'Sq m' },
      mp_ar_perim:     { es:'Perímetro',       en:'Perimeter' },
      mp_ar_case:      { es:'Cuarto 12 × 14 ft = 168 sqft — así dimensionas el retorno y la carga térmica rápida.', en:'Room 12 × 14 ft = 168 sqft — sets your return and quick heat load.' },
      mp_ar_tip:       { es:'Para redondear CFM: 1 CFM por sqft en residencial estándar, 1.5 CFM/sqft con vidrio abundante.', en:'Quick CFM: 1 CFM per sqft standard residential, 1.5 CFM/sqft if heavy glass.' }
    },
    render: function(state){
      var shape = pick(state,'areas','shape','rect');
      var area_sqft = 0, perim = 0, detail = '';
      var shapeOpts = '';
      var opts = [['rect',t('mp_ar_rect','Rectángulo')],['circle',t('mp_ar_circle','Círculo')],['triangle',t('mp_ar_tri','Triángulo')]];
      for (var i=0;i<opts.length;i++){
        shapeOpts += '<option value="'+opts[i][0]+'"'+(shape===opts[i][0]?' selected':'')+'>'+esc(opts[i][1])+'</option>';
      }
      var fields = '';
      if (shape === 'circle') {
        var r = num(pick(state,'areas','r',6),6);
        area_sqft = Math.PI * r * r;
        perim = 2 * Math.PI * r;
        detail = 'π × '+r+'² = '+area_sqft.toFixed(2)+' sqft';
        fields = ''+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_r','Radio'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="areas.r" value="'+r+'" step="0.5" />'+
          '</div>';
      } else if (shape === 'triangle') {
        var b = num(pick(state,'areas','b',10),10);
        var thg = num(pick(state,'areas','h',8),8);
        area_sqft = 0.5 * b * thg;
        perim = 0;
        detail = '½ × '+b+' × '+thg+' = '+area_sqft.toFixed(2)+' sqft';
        fields = ''+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_b','Base'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="areas.b" value="'+b+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_h','Alto'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="areas.h" value="'+thg+'" step="0.5" />'+
          '</div>';
      } else {
        var w = num(pick(state,'areas','w',12),12);
        var hh = num(pick(state,'areas','h',14),14);
        area_sqft = w * hh;
        perim = 2*(w+hh);
        detail = w+' × '+hh+' = '+area_sqft.toFixed(2)+' sqft';
        fields = ''+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_w','Ancho'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="areas.w" value="'+w+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_h','Alto'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="areas.h" value="'+hh+'" step="0.5" />'+
          '</div>';
      }
      var area_sqm = area_sqft * 0.092903;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ar_shape','Forma'))+'</span></div>'+
            '<select class="mp-in" data-in="areas.shape">'+shapeOpts+'</select>'+
          '</div>'+
          fields+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ar_res_lbl','Área'))+'</div>'+
          '<div class="mp-res-main">'+area_sqft.toFixed(2)+'<span class="mp-res-unit">sqft</span></div>'+
          '<div class="mp-res-desc">'+esc(detail)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ar_sqm','Metros²'))+'</div><div class="mp-res-val">'+area_sqm.toFixed(2)+' m²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ar_perim','Perímetro'))+'</div><div class="mp-res-val">'+(perim>0?perim.toFixed(2)+' ft':'—')+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ar_case','mp_ar_tip');
    }
  };

  // ─────────────────────────── volumes ───────────────────────────
  window.MP_CALCS['volumes'] = {
    i18n: {
      mp_vl_shape:     { es:'Forma',           en:'Shape' },
      mp_vl_cube:      { es:'Cubo',            en:'Cube' },
      mp_vl_cyl:       { es:'Cilindro',        en:'Cylinder' },
      mp_vl_cone:      { es:'Cono',            en:'Cone' },
      mp_vl_side:      { es:'Lado',            en:'Side' },
      mp_vl_r:         { es:'Radio',           en:'Radius' },
      mp_vl_h:         { es:'Altura',          en:'Height' },
      mp_vl_res_lbl:   { es:'Volumen',         en:'Volume' },
      mp_vl_cuft:      { es:'Pies³',           en:'Cu ft' },
      mp_vl_gal:       { es:'Galones',         en:'Gallons' },
      mp_vl_liters:    { es:'Litros',          en:'Liters' },
      mp_vl_cum:       { es:'Metros³',         en:'Cu m' },
      mp_vl_case:      { es:'Tinaco cilíndrico 2 ft r × 5 ft h = 62.8 cuft ≈ 469 gal de agua.', en:'Cylindrical tank 2 ft r × 5 ft h = 62.8 cuft ≈ 469 gal of water.' },
      mp_vl_tip:       { es:'1 cuft = 7.48 gal = 28.32 L. Un cuarto de 10×10×8 ft tiene 800 cuft — útil para dimensionar equipo.', en:'1 cuft = 7.48 gal = 28.32 L. A 10×10×8 room has 800 cuft — handy for sizing gear.' }
    },
    render: function(state){
      var shape = pick(state,'volumes','shape','cyl');
      var opts = [['cube',t('mp_vl_cube','Cubo')],['cyl',t('mp_vl_cyl','Cilindro')],['cone',t('mp_vl_cone','Cono')]];
      var shapeOpts = '';
      for (var i=0;i<opts.length;i++){
        shapeOpts += '<option value="'+opts[i][0]+'"'+(shape===opts[i][0]?' selected':'')+'>'+esc(opts[i][1])+'</option>';
      }
      var vol_cuft = 0, detail = '';
      var fields = '';
      if (shape === 'cube') {
        var sd = num(pick(state,'volumes','s',4),4);
        vol_cuft = sd*sd*sd;
        detail = sd+'³ = '+vol_cuft.toFixed(2)+' cuft';
        fields = '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_vl_side','Lado'))+'</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="volumes.s" value="'+sd+'" step="0.5" /></div>';
      } else if (shape === 'cone') {
        var rc = num(pick(state,'volumes','r',2),2);
        var hc = num(pick(state,'volumes','h',5),5);
        vol_cuft = (1/3) * Math.PI * rc * rc * hc;
        detail = '⅓ × π × '+rc+'² × '+hc+' = '+vol_cuft.toFixed(2)+' cuft';
        fields = ''+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_vl_r','Radio'))+'</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="volumes.r" value="'+rc+'" step="0.5" /></div>'+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_vl_h','Altura'))+'</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="volumes.h" value="'+hc+'" step="0.5" /></div>';
      } else {
        var r2 = num(pick(state,'volumes','r',2),2);
        var h2 = num(pick(state,'volumes','h',5),5);
        vol_cuft = Math.PI * r2 * r2 * h2;
        detail = 'π × '+r2+'² × '+h2+' = '+vol_cuft.toFixed(2)+' cuft';
        fields = ''+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_vl_r','Radio'))+'</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="volumes.r" value="'+r2+'" step="0.5" /></div>'+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_vl_h','Altura'))+'</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="volumes.h" value="'+h2+'" step="0.5" /></div>';
      }
      var gallons = vol_cuft * 7.48052;
      var liters  = vol_cuft * 28.3168;
      var cum     = vol_cuft * 0.0283168;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vl_shape','Forma'))+'</span></div>'+
            '<select class="mp-in" data-in="volumes.shape">'+shapeOpts+'</select>'+
          '</div>'+
          fields+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_vl_res_lbl','Volumen'))+'</div>'+
          '<div class="mp-res-main">'+vol_cuft.toFixed(2)+'<span class="mp-res-unit">cuft</span></div>'+
          '<div class="mp-res-desc">'+esc(detail)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_vl_gal','Galones'))+'</div><div class="mp-res-val">'+gallons.toFixed(1)+' gal</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_vl_liters','Litros'))+'</div><div class="mp-res-val">'+liters.toFixed(1)+' L</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_vl_cum','Metros³'))+'</div><div class="mp-res-val">'+cum.toFixed(3)+' m³</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_vl_case','mp_vl_tip');
    }
  };

  // ─────────────────────────── planScales ───────────────────────────
  window.MP_CALCS['planScales'] = {
    i18n: {
      mp_ps_meas:      { es:'Medida en plano', en:'Plan measurement' },
      mp_ps_scale:     { es:'Escala',          en:'Scale' },
      mp_ps_res_lbl:   { es:'Real',            en:'Real world' },
      mp_ps_ft:        { es:'Pies',            en:'Feet' },
      mp_ps_ftin:      { es:'Pies + pulgadas', en:'Feet + inches' },
      mp_ps_m:         { es:'Metros',          en:'Meters' },
      mp_ps_case:      { es:'En un plano a 1/4" = 1 ft mides 3.5" de un muro: la pared real es 14 ft.', en:'On a 1/4" = 1 ft plan you read 3.5" of wall: actual wall is 14 ft.' },
      mp_ps_tip:       { es:'1/4" = 1 ft es la escala arquitectónica estándar. Multiplica las pulgadas medidas × 4 para obtener pies.', en:'1/4" = 1 ft is standard architectural scale. Multiply measured inches × 4 to get feet.' }
    },
    render: function(state){
      var meas = num(pick(state,'planScales','meas',3.5),3.5);
      var scale = pick(state,'planScales','scale','q'); // q=1/4, e=1/8, s=1/16, h=1/2
      // factor: inches-on-plan → feet-in-reality
      var factors = { q:4, e:8, s:16, h:2 };
      var labels = { q:'1/4" = 1\'', e:'1/8" = 1\'', s:'1/16" = 1\'', h:'1/2" = 1\'' };
      if (!factors[scale]) scale = 'q';
      var ft = meas * factors[scale];
      var wholeFt = Math.floor(ft);
      var remIn = Math.round((ft - wholeFt) * 12 * 16) / 16;
      var m = ft * 0.3048;
      var scaleOpts = '';
      var keys = ['q','e','s','h'];
      for (var i=0;i<keys.length;i++){
        scaleOpts += '<option value="'+keys[i]+'"'+(scale===keys[i]?' selected':'')+'>'+esc(labels[keys[i]])+'</option>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ps_meas','Medida en plano'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="planScales.meas" value="'+meas+'" step="0.0625" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ps_scale','Escala'))+'</span></div>'+
            '<select class="mp-in" data-in="planScales.scale">'+scaleOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ps_res_lbl','Real'))+'</div>'+
          '<div class="mp-res-main">'+ft.toFixed(2)+'<span class="mp-res-unit">ft</span></div>'+
          '<div class="mp-res-desc">'+esc(labels[scale])+' · '+meas+'" × '+factors[scale]+' = '+ft.toFixed(2)+' ft</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ps_ftin','Pies + pulgadas'))+'</div><div class="mp-res-val">'+wholeFt+'\' '+remIn+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ps_m','Metros'))+'</div><div class="mp-res-val">'+m.toFixed(2)+' m</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ps_case','mp_ps_tip');
    }
  };

  // ─────────────────────────── percentages ───────────────────────────
  window.MP_CALCS['percentages'] = {
    i18n: {
      mp_pc_price:     { es:'Precio original', en:'Original price' },
      mp_pc_pct:       { es:'Porcentaje',      en:'Percent' },
      mp_pc_res_lbl:   { es:'Descuento',       en:'Discount' },
      mp_pc_disc_amt:  { es:'Ahorro',          en:'Savings' },
      mp_pc_after_disc:{ es:'Precio con desc.',en:'Price after disc.' },
      mp_pc_mk_amt:    { es:'Incremento',      en:'Markup amount' },
      mp_pc_after_mk:  { es:'Precio con markup',en:'Price after markup' },
      mp_pc_tax:       { es:'Con impuesto (CA 9.5%)', en:'With tax (CA 9.5%)' },
      mp_pc_case:      { es:'Un compresor de $450 con 15% de descuento queda en $382.50; con impuesto CA sube a $418.84.', en:'A $450 compressor at 15% off = $382.50; with CA tax it becomes $418.84.' },
      mp_pc_tip:       { es:'Para markup HVAC, 30% sobre costo ≈ 23% de margen. Nunca confundas: 40% markup ≠ 40% margen.', en:'HVAC markup of 30% on cost ≈ 23% margin. Never confuse: 40% markup ≠ 40% margin.' }
    },
    render: function(state){
      var price = num(pick(state,'percentages','price',450),450);
      var pct = num(pick(state,'percentages','pct',15),15);
      var discAmt = price * pct / 100;
      var afterDisc = price - discAmt;
      var mkAmt = price * pct / 100;
      var afterMk = price + mkAmt;
      var withTax = afterDisc * 1.095;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pc_price','Precio original'))+'</span><span class="mp-unit">USD</span></div>'+
            '<input type="number" class="mp-in" data-in="percentages.price" value="'+price+'" step="0.01" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pc_pct','Porcentaje'))+'</span><span class="mp-unit">%</span></div>'+
            '<input type="number" class="mp-in" data-in="percentages.pct" value="'+pct+'" step="0.5" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_pc_res_lbl','Descuento'))+'</div>'+
          '<div class="mp-res-main">$'+discAmt.toFixed(2)+'</div>'+
          '<div class="mp-res-desc">'+pct+'% de $'+price.toFixed(2)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_pc_after_disc','Precio con desc.'))+'</div><div class="mp-res-val">$'+afterDisc.toFixed(2)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pc_mk_amt','Incremento'))+'</div><div class="mp-res-val">$'+mkAmt.toFixed(2)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pc_after_mk','Precio con markup'))+'</div><div class="mp-res-val">$'+afterMk.toFixed(2)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pc_tax','Con impuesto (CA 9.5%)'))+'</div><div class="mp-res-val">$'+withTax.toFixed(2)+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_pc_case','mp_pc_tip');
    }
  };

  // ─────────────────────────── wasteFactor ───────────────────────────
  window.MP_CALCS['wasteFactor'] = {
    i18n: {
      mp_wf_qty:       { es:'Cantidad base',   en:'Base quantity' },
      mp_wf_pct:       { es:'Desperdicio %',   en:'Waste %' },
      mp_wf_res_lbl:   { es:'Cantidad a ordenar', en:'Order quantity' },
      mp_wf_extra:     { es:'Extra',           en:'Extra' },
      mp_wf_unit:      { es:'Por unidad',      en:'Per unit' },
      mp_wf_factor:    { es:'Factor multiplicador', en:'Multiplier' },
      mp_wf_case:      { es:'Para 100 ft de tubería en cobre pides 110 ft (10% waste) — así no corres a la ferretería el sábado.', en:'For 100 ft of copper you order 110 ft (10% waste) — no Saturday runs to the supplier.' },
      mp_wf_tip:       { es:'Cobre y refnet: 10%. Ducto flex y aislante: 15%. Cable bajo voltaje en ático: 20% (los pájaros te cobran).', en:'Copper and refnet: 10%. Flex duct and insulation: 15%. Low-voltage wire in attic: 20% (birds charge rent).' }
    },
    render: function(state){
      var qty = num(pick(state,'wasteFactor','qty',100),100);
      var pct = num(pick(state,'wasteFactor','pct',10),10);
      var factor = 1 + pct/100;
      var order = qty * factor;
      var extra = order - qty;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wf_qty','Cantidad base'))+'</span><span class="mp-unit">'+esc(t('mp_wf_unit','Por unidad'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="wasteFactor.qty" value="'+qty+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wf_pct','Desperdicio %'))+'</span><span class="mp-unit">%</span></div>'+
            '<input type="number" class="mp-in" data-in="wasteFactor.pct" value="'+pct+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_wf_res_lbl','Cantidad a ordenar'))+'</div>'+
          '<div class="mp-res-main">'+order.toFixed(1)+'</div>'+
          '<div class="mp-res-desc">'+qty+' × '+factor.toFixed(2)+' = '+order.toFixed(1)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_wf_extra','Extra'))+'</div><div class="mp-res-val">+'+extra.toFixed(1)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_wf_factor','Factor multiplicador'))+'</div><div class="mp-res-val">× '+factor.toFixed(3)+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_wf_case','mp_wf_tip');
    }
  };

})();
