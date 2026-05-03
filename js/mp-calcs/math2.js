// Maestro Pro · Math 2 calculators
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

  function pick(state,tool,field,dflt){
    if (state && state.inputs && state.inputs[tool] && state.inputs[tool][field] != null && state.inputs[tool][field] !== '') {
      return state.inputs[tool][field];
    }
    return dflt;
  }
  var DEG = 180/Math.PI;
  var RAD = Math.PI/180;

  // ─────────────────────────── rightTri ───────────────────────────
  window.MP_CALCS['rightTri'] = {
    i18n: {
      mp_rt_a:         { es:'Cateto a',              en:'Leg a' },
      mp_rt_b:         { es:'Cateto b',              en:'Leg b' },
      mp_rt_c:         { es:'Hipotenusa c',          en:'Hypotenuse c' },
      mp_rt_A:         { es:'Ángulo A (op. a)',      en:'Angle A (opp. a)' },
      mp_rt_B:         { es:'Ángulo B (op. b)',      en:'Angle B (opp. b)' },
      mp_rt_res_lbl:   { es:'Triángulo rectángulo',  en:'Right triangle' },
      mp_rt_ref:       { es:'Tabla de referencia',   en:'Reference table' },
      mp_rt_hyp:       { es:'Hipotenusa',            en:'Hypotenuse' },
      mp_rt_area:      { es:'Área',                  en:'Area' },
      mp_rt_perim:     { es:'Perímetro',             en:'Perimeter' },
      mp_rt_case:      { es:'Un line-set sube 6 ft y cruza 8 ft horizontal: la hipotenusa (recorrido real de cobre) es 10 ft exactos — triángulo 3-4-5 escalado.', en:'A line-set rises 6 ft and runs 8 ft horizontal: hypotenuse (actual copper path) is 10 ft — classic 3-4-5 scaled.' },
      mp_rt_tip:       { es:'Memoriza 3-4-5, 5-12-13 y 8-15-17. Si dos lados caen en esos tercios, el tercero sale sin calculadora.', en:'Memorize 3-4-5, 5-12-13, and 8-15-17. If two sides fit, the third lands without a calculator.' }
    },
    render: function(state){
      var a = num(pick(state,'rightTri','a',3),3);
      var b = num(pick(state,'rightTri','b',4),4);
      if (a<=0) a=3; if (b<=0) b=4;
      var c = Math.sqrt(a*a + b*b);
      var A = Math.atan2(a,b) * DEG;
      var B = Math.atan2(b,a) * DEG;
      var area = 0.5 * a * b;
      var perim = a + b + c;
      // Reference table of common Pythagorean triples
      var triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25]];
      var rowsHtml = '';
      for (var i=0;i<triples.length;i++){
        var ta = triples[i][0], tb = triples[i][1], tc = triples[i][2];
        var tA = fmt(Math.atan2(ta,tb)*DEG,2);
        var tB = fmt(Math.atan2(tb,ta)*DEG,2);
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+ta+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+tb+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+tc+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+tA+'°</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+tB+'°</td>'+
        '</tr>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rt_a','Cateto a'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="rightTri.a" value="'+a+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rt_b','Cateto b'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="rightTri.b" value="'+b+'" step="0.5" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_rt_res_lbl','Triángulo rectángulo'))+'</div>'+
          '<div class="mp-res-main">'+fmt(c,2)+'<span class="mp-res-unit">ft</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_rt_hyp','Hipotenusa'))+' = √('+a+'² + '+b+'²)</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_rt_A','Ángulo A (op. a)'))+'</div><div class="mp-res-val">'+fmt(A,2)+'°</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rt_B','Ángulo B (op. b)'))+'</div><div class="mp-res-val">'+fmt(B,2)+'°</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rt_area','Área'))+'</div><div class="mp-res-val">'+fmt(area,2)+' ft²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rt_perim','Perímetro'))+'</div><div class="mp-res-val">'+fmt(perim,2)+' ft</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_rt_ref','Tabla de referencia'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">a</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">b</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">c</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">A°</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">B°</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_rt_case','mp_rt_tip');
    }
  };

  // ─────────────────────────── riseRun ───────────────────────────
  window.MP_CALCS['riseRun'] = {
    i18n: {
      mp_rr_rise:      { es:'Subida (rise)',         en:'Rise' },
      mp_rr_run:       { es:'Recorrido (run)',       en:'Run' },
      mp_rr_res_lbl:   { es:'Pendiente de techo',    en:'Roof pitch' },
      mp_rr_pitch:     { es:'Pitch (X/12)',          en:'Pitch (X/12)' },
      mp_rr_pct:       { es:'Porcentaje',            en:'Percent' },
      mp_rr_deg:       { es:'Grados',                en:'Degrees' },
      mp_rr_ref:       { es:'Pitches comunes',       en:'Common pitches' },
      mp_rr_category:  { es:'Categoría',             en:'Category' },
      mp_rr_low:       { es:'Bajo',                  en:'Low' },
      mp_rr_std:       { es:'Estándar',              en:'Standard' },
      mp_rr_steep:     { es:'Empinado',              en:'Steep' },
      mp_rr_case:      { es:'Cliente pide condensador en techo 6/12: son 26.57° — usa arnés y rack anti-deslizante, ya cuenta como superficie inclinada.', en:'Customer wants rooftop condenser on 6/12 pitch: that is 26.57° — use a harness and slip-proof rack, already inclined surface.' },
      mp_rr_tip:       { es:'Pitch ≤ 4/12 = baja; 5/12–9/12 = estándar; ≥ 10/12 = empinada (OSHA exige arnés automático).', en:'Pitch ≤ 4/12 = low; 5/12–9/12 = standard; ≥ 10/12 = steep (OSHA requires automatic harness).' }
    },
    render: function(state){
      var rise = num(pick(state,'riseRun','rise',4),4);
      var run  = num(pick(state,'riseRun','run',12),12);
      if (run<=0) run=12;
      var pitchX = (rise/run)*12;
      var pct = (rise/run)*100;
      var deg = Math.atan2(rise,run)*DEG;
      var cat = deg < 18.43 ? t('mp_rr_low','Bajo') : (deg < 39.81 ? t('mp_rr_std','Estándar') : t('mp_rr_steep','Empinado'));
      var catColor = deg < 18.43 ? '#15803D' : (deg < 39.81 ? '#CA8A04' : '#B91C1C');
      var rows = [[1,12],[2,12],[3,12],[4,12],[6,12],[8,12],[10,12],[12,12]];
      var rowsHtml = '';
      for (var i=0;i<rows.length;i++){
        var r = rows[i][0], ru = rows[i][1];
        var d = Math.atan2(r,ru)*DEG;
        var p = (r/ru)*100;
        var c2 = d < 18.43 ? t('mp_rr_low','Bajo') : (d < 39.81 ? t('mp_rr_std','Estándar') : t('mp_rr_steep','Empinado'));
        var col = d < 18.43 ? '#15803D' : (d < 39.81 ? '#CA8A04' : '#B91C1C');
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+r+'/'+ru+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(p,1)+'%</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(d,2)+'°</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:'+col+';font-weight:600;">'+esc(c2)+'</td>'+
        '</tr>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rr_rise','Subida (rise)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="riseRun.rise" value="'+rise+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rr_run','Recorrido (run)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="riseRun.run" value="'+run+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_rr_res_lbl','Pendiente de techo'))+'</div>'+
          '<div class="mp-res-main">'+fmt(pitchX,1)+'<span class="mp-res-unit">/12</span></div>'+
          '<div class="mp-res-desc" style="color:'+catColor+' !important;font-weight:600;">'+esc(cat)+' · '+fmt(pct,1)+'% · '+fmt(deg,2)+'°</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_rr_pitch','Pitch (X/12)'))+'</div><div class="mp-res-val">'+fmt(pitchX,1)+'/12</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rr_pct','Porcentaje'))+'</div><div class="mp-res-val">'+fmt(pct,2)+'%</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rr_deg','Grados'))+'</div><div class="mp-res-val">'+fmt(deg,2)+'°</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rr_category','Categoría'))+'</div><div class="mp-res-val" style="color:'+catColor+';">'+esc(cat)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_rr_ref','Pitches comunes'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Pitch</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">%</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">°</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_rr_category','Categoría'))+'</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_rr_case','mp_rr_tip');
    }
  };

  // ─────────────────────────── offsetCalc ───────────────────────────
  window.MP_CALCS['offsetCalc'] = {
    i18n: {
      mp_oc_off:       { es:'Offset (desviación)',   en:'Offset distance' },
      mp_oc_ang:       { es:'Ángulo de dobles',      en:'Bend angle' },
      mp_oc_res_lbl:   { es:'Cálculo de offset',     en:'Offset calc' },
      mp_oc_travel:    { es:'Travel (entre dobles)', en:'Travel (between bends)' },
      mp_oc_shrink:    { es:'Shrink',                en:'Shrink' },
      mp_oc_mult:      { es:'Multiplier',            en:'Multiplier' },
      mp_oc_shrinkMult:{ es:'Shrink por in',         en:'Shrink per in' },
      mp_oc_ref:       { es:'Ángulos comunes',       en:'Common angles' },
      mp_oc_case:      { es:'EMT 1/2" hay que subir 6" para esquivar una viga: a 45° el travel = 8.49", shrink ≈ 2.49". Marcas y doblas con la Klein.', en:'1/2" EMT must rise 6" around a beam: at 45° travel = 8.49", shrink ≈ 2.49". Mark and bend with Klein.' },
      mp_oc_tip:       { es:'45° es el favorito del campo: multiplier 1.414 fácil de memorizar. Si el espacio es apretado usa 60° (mult 1.155) pero shrink alto.', en:'45° is the field favorite: 1.414 multiplier, easy to remember. If space is tight use 60° (mult 1.155) but higher shrink.' }
    },
    render: function(state){
      var off = num(pick(state,'offsetCalc','off',6),6);
      var ang = num(pick(state,'offsetCalc','ang',45),45);
      var angles = [10,22.5,30,45,60];
      // validate angle
      var found = false;
      for (var i=0;i<angles.length;i++){ if (Math.abs(angles[i]-ang)<0.01){ found=true; break; } }
      if (!found) ang = 45;
      var sinA = Math.sin(ang*RAD);
      var tanA = Math.tan(ang*RAD);
      var cosA = Math.cos(ang*RAD);
      var mult = sinA === 0 ? 0 : 1/sinA;
      var travel = off * mult;
      var shrinkPerIn = (1 - cosA) / sinA; // distance between bends reduction per inch of offset
      var shrink = off * shrinkPerIn;
      // shrink constants per inch (standard electrician table)
      var rowsHtml = '';
      for (var j=0;j<angles.length;j++){
        var a = angles[j];
        var s = Math.sin(a*RAD);
        var c = Math.cos(a*RAD);
        var m = 1/s;
        var sh = (1-c)/s;
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+a+'°</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(m,3)+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(sh,4)+'"/in</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(off*m,2)+'"</td>'+
        '</tr>';
      }
      var angOpts = '';
      for (var k=0;k<angles.length;k++){
        angOpts += '<option value="'+angles[k]+'"'+(angles[k]===ang?' selected':'')+'>'+angles[k]+'°</option>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_oc_off','Offset (desviación)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="offsetCalc.off" value="'+off+'" step="0.25" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_oc_ang','Ángulo de dobles'))+'</span><span class="mp-unit">°</span></div>'+
            '<select class="mp-in" data-in="offsetCalc.ang">'+angOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_oc_res_lbl','Cálculo de offset'))+'</div>'+
          '<div class="mp-res-main">'+fmt(travel,2)+'<span class="mp-res-unit">in</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_oc_travel','Travel (entre dobles)'))+' = '+off+'" × '+fmt(mult,3)+' (1/sin '+ang+'°)</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_oc_mult','Multiplier'))+'</div><div class="mp-res-val">× '+fmt(mult,3)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_oc_shrink','Shrink'))+'</div><div class="mp-res-val">'+fmt(shrink,3)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_oc_shrinkMult','Shrink por in'))+'</div><div class="mp-res-val">'+fmt(shrinkPerIn,4)+'"/in</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_oc_travel','Travel (entre dobles)'))+'</div><div class="mp-res-val">'+fmt(travel,2)+'"</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_oc_ref','Ángulos comunes'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_oc_ang','Ángulo de dobles'))+'</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_oc_mult','Multiplier'))+'</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_oc_shrinkMult','Shrink por in'))+'</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_oc_travel','Travel (entre dobles)'))+'</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_oc_case','mp_oc_tip');
    }
  };

  // ─────────────────────────── pipeBend ───────────────────────────
  window.MP_CALCS['pipeBend'] = {
    i18n: {
      mp_pb_ang:       { es:'Ángulo de dobles',      en:'Bend angle' },
      mp_pb_od:        { es:'Diámetro externo (OD)', en:'Outside diameter (OD)' },
      mp_pb_takeup:    { es:'Takeup (centro doble)', en:'Takeup (center of bend)' },
      mp_pb_res_lbl:   { es:'Cálculo de doblado',    en:'Pipe bending calc' },
      mp_pb_mult:      { es:'Multiplier (1/sin)',    en:'Multiplier (1/sin)' },
      mp_pb_shrink:    { es:'Shrink por doble',      en:'Shrink per bend' },
      mp_pb_devlen:    { es:'Largo desarrollado',    en:'Developed length' },
      mp_pb_radius:    { es:'Radio de doblado',      en:'Bend radius' },
      mp_pb_ref:       { es:'Takeup EMT estándar',   en:'Standard EMT takeup' },
      mp_pb_case:      { es:'EMT de 1/2" a 90° con takeup 5": marcas la cinta a L − 5 para que el codo quede a la medida exacta del plano.', en:'1/2" EMT at 90° with 5" takeup: mark your tape at L − 5 so the elbow lands exactly where the plan shows.' },
      mp_pb_tip:       { es:'Takeups típicos: 1/2"=5", 3/4"=6", 1"=8", 1-1/4"=11", 1-1/2"=13". Memorízalos y ahorras 3 minutos por doble.', en:'Typical takeups: 1/2"=5", 3/4"=6", 1"=8", 1-1/4"=11", 1-1/2"=13". Memorize them — save 3 min per bend.' }
    },
    render: function(state){
      var ang = num(pick(state,'pipeBend','ang',90),90);
      var od  = num(pick(state,'pipeBend','od',0.706),0.706); // 1/2" EMT OD
      var takeup = num(pick(state,'pipeBend','takeup',5),5);
      if (ang<=0) ang=90;
      var sinA = Math.sin(ang*RAD);
      var cosA = Math.cos(ang*RAD);
      var mult = sinA === 0 ? 0 : 1/sinA;
      var shrink = od * (1 - cosA);
      var radius = takeup / Math.tan((ang/2)*RAD);
      var devLen = (ang*RAD) * radius;
      var sizes = [
        ['1/2"',0.706,5,6],
        ['3/4"',0.922,6,8],
        ['1"',1.163,8,11],
        ['1-1/4"',1.510,11,14],
        ['1-1/2"',1.740,13,16],
        ['2"',2.197,16,21]
      ];
      var rowsHtml = '';
      for (var i=0;i<sizes.length;i++){
        var s = sizes[i];
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+esc(s[0])+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+s[1]+'"</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+s[2]+'"</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+s[3]+'"</td>'+
        '</tr>';
      }
      var angOpts = '';
      var angles = [10,22.5,30,45,60,90];
      for (var j=0;j<angles.length;j++){
        angOpts += '<option value="'+angles[j]+'"'+(Math.abs(angles[j]-ang)<0.01?' selected':'')+'>'+angles[j]+'°</option>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pb_ang','Ángulo de dobles'))+'</span><span class="mp-unit">°</span></div>'+
            '<select class="mp-in" data-in="pipeBend.ang">'+angOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pb_od','Diámetro externo (OD)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="pipeBend.od" value="'+od+'" step="0.01" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_pb_takeup','Takeup (centro doble)'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="pipeBend.takeup" value="'+takeup+'" step="0.5" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_pb_res_lbl','Cálculo de doblado'))+'</div>'+
          '<div class="mp-res-main">'+fmt(devLen,2)+'<span class="mp-res-unit">in</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_pb_devlen','Largo desarrollado'))+' a '+ang+'° con radio '+fmt(radius,2)+'"</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_mult','Multiplier (1/sin)'))+'</div><div class="mp-res-val">× '+fmt(mult,3)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_shrink','Shrink por doble'))+'</div><div class="mp-res-val">'+fmt(shrink,4)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_radius','Radio de doblado'))+'</div><div class="mp-res-val">'+fmt(radius,2)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_pb_devlen','Largo desarrollado'))+'</div><div class="mp-res-val">'+fmt(devLen,2)+'"</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_pb_ref','Takeup EMT estándar'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Size</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">OD</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Takeup 90°</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Stub-up</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_pb_case','mp_pb_tip');
    }
  };

  // ─────────────────────────── linearQty ───────────────────────────
  window.MP_CALCS['linearQty'] = {
    i18n: {
      mp_lq_l:         { es:'Largo del cuarto',      en:'Room length' },
      mp_lq_w:         { es:'Ancho del cuarto',      en:'Room width' },
      mp_lq_hgt:       { es:'Alto del cuarto',       en:'Room height' },
      mp_lq_unit:      { es:'Unidad de material',    en:'Material unit' },
      mp_lq_waste:     { es:'Desperdicio %',         en:'Waste %' },
      mp_lq_res_lbl:   { es:'Cantidad requerida',    en:'Required quantity' },
      mp_lq_base:      { es:'Cantidad base',         en:'Base quantity' },
      mp_lq_extra:     { es:'Extra waste',           en:'Extra waste' },
      mp_lq_total:     { es:'Total a ordenar',       en:'Total to order' },
      mp_lq_lin:       { es:'Lineal (perímetro)',    en:'Linear (perimeter)' },
      mp_lq_sq:        { es:'Cuadrado (piso)',       en:'Square (floor)' },
      mp_lq_cu:        { es:'Cúbico (volumen)',      en:'Cubic (volume)' },
      mp_lq_sqwall:    { es:'Cuadrado (muros)',      en:'Square (walls)' },
      mp_lq_ref:       { es:'Guía de desperdicio',   en:'Waste guide' },
      mp_lq_case:      { es:'Instalas 1,800 sqft de ducto flex en una casa: con 15% waste ordenas 2,070 sqft — los codos y grapas se comen ese margen.', en:'You install 1,800 sqft of flex duct in a house: at 15% waste you order 2,070 sqft — elbows and straps eat that margin.' },
      mp_lq_tip:       { es:'Cobre: 10%. Flex duct: 15%. Romex en ático: 20%. Insulation: 15%. Sheetmetal: 12%. Presupuesta con margen o paga del bolsillo.', en:'Copper: 10%. Flex duct: 15%. Romex in attic: 20%. Insulation: 15%. Sheetmetal: 12%. Bid with margin or eat the cost.' }
    },
    render: function(state){
      var L = num(pick(state,'linearQty','l',12),12);
      var W = num(pick(state,'linearQty','w',14),14);
      var Ht = num(pick(state,'linearQty','hgt',8),8);
      var unit = pick(state,'linearQty','unit','sq');
      var wastePct = num(pick(state,'linearQty','waste',10),10);
      var unitLabels = {
        lin:   t('mp_lq_lin','Lineal (perímetro)'),
        sq:    t('mp_lq_sq','Cuadrado (piso)'),
        cu:    t('mp_lq_cu','Cúbico (volumen)'),
        sqwall:t('mp_lq_sqwall','Cuadrado (muros)')
      };
      var unitShort = { lin:'ft', sq:'sqft', cu:'cuft', sqwall:'sqft' };
      var base = 0, detail = '';
      if (unit === 'lin') {
        base = 2*(L+W);
        detail = '2 × ('+L+' + '+W+') = '+fmt(base,1)+' ft';
      } else if (unit === 'cu') {
        base = L*W*Ht;
        detail = L+' × '+W+' × '+Ht+' = '+fmt(base,1)+' cuft';
      } else if (unit === 'sqwall') {
        base = 2*(L+W)*Ht;
        detail = '2 × ('+L+' + '+W+') × '+Ht+' = '+fmt(base,1)+' sqft';
      } else {
        base = L*W;
        detail = L+' × '+W+' = '+fmt(base,1)+' sqft';
        unit = 'sq';
      }
      var factor = 1 + wastePct/100;
      var total = base * factor;
      var extra = total - base;
      var unitOpts = '';
      var uk = ['lin','sq','sqwall','cu'];
      for (var i=0;i<uk.length;i++){
        unitOpts += '<option value="'+uk[i]+'"'+(unit===uk[i]?' selected':'')+'>'+esc(unitLabels[uk[i]])+'</option>';
      }
      // Waste guide rows
      var guide = [
        ['Copper / refnet','10%'],
        ['Flex duct','15%'],
        ['Sheetmetal','12%'],
        ['Insulation','15%'],
        ['Romex (attic)','20%'],
        ['Thermostat wire','15%']
      ];
      var rowsHtml = '';
      for (var j=0;j<guide.length;j++){
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+esc(guide[j][0])+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+esc(guide[j][1])+'</td>'+
        '</tr>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lq_l','Largo del cuarto'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="linearQty.l" value="'+L+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lq_w','Ancho del cuarto'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="linearQty.w" value="'+W+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lq_hgt','Alto del cuarto'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="linearQty.hgt" value="'+Ht+'" step="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lq_unit','Unidad de material'))+'</span></div>'+
            '<select class="mp-in" data-in="linearQty.unit">'+unitOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_lq_waste','Desperdicio %'))+'</span><span class="mp-unit">%</span></div>'+
            '<input type="number" class="mp-in" data-in="linearQty.waste" value="'+wastePct+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_lq_res_lbl','Cantidad requerida'))+'</div>'+
          '<div class="mp-res-main">'+fmt(total,1)+'<span class="mp-res-unit">'+esc(unitShort[unit])+'</span></div>'+
          '<div class="mp-res-desc">'+esc(detail)+' · +'+wastePct+'% waste</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_lq_base','Cantidad base'))+'</div><div class="mp-res-val">'+fmt(base,1)+' '+esc(unitShort[unit])+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_lq_extra','Extra waste'))+'</div><div class="mp-res-val">+'+fmt(extra,1)+' '+esc(unitShort[unit])+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_lq_total','Total a ordenar'))+'</div><div class="mp-res-val">'+fmt(total,1)+' '+esc(unitShort[unit])+'</div></div>'+
            '<div><div class="mp-res-item">×</div><div class="mp-res-val">× '+fmt(factor,3)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_lq_ref','Guía de desperdicio'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Material</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_lq_waste','Desperdicio %'))+'</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_lq_case','mp_lq_tip');
    }
  };

  // ─────────────────────────── angleConv ───────────────────────────
  window.MP_CALCS['angleConv'] = {
    i18n: {
      mp_ac_val:       { es:'Valor del ángulo',      en:'Angle value' },
      mp_ac_src:       { es:'Unidad origen',         en:'Source unit' },
      mp_ac_res_lbl:   { es:'Conversiones',          en:'Conversions' },
      mp_ac_deg:       { es:'Grados',                en:'Degrees' },
      mp_ac_rad:       { es:'Radianes',              en:'Radians' },
      mp_ac_grad:      { es:'Gradianes',             en:'Gradians' },
      mp_ac_bearing:   { es:'Rumbo (brújula)',       en:'Compass bearing' },
      mp_ac_ref:       { es:'Ángulos notables',      en:'Common angles' },
      mp_ac_case:      { es:'Un plano arquitectónico marca un muro a N 45° E: en grados matemáticos son 45°, pero en radianes π/4 — la tablet lo necesita así.', en:'An architectural plan marks a wall at N 45° E: in math degrees that is 45°, but in radians π/4 — your tablet wants it that way.' },
      mp_ac_tip:       { es:'Rumbo de brújula: 0°=N, 90°=E, 180°=S, 270°=W. Los gradianes solo los usan topógrafos europeos — 400 grad = círculo completo.', en:'Compass bearing: 0°=N, 90°=E, 180°=S, 270°=W. Gradians are European surveyor territory — 400 grad = full circle.' }
    },
    render: function(state){
      var val = num(pick(state,'angleConv','val',45),45);
      var src = pick(state,'angleConv','src','deg');
      var units = ['deg','rad','grad','bearing'];
      if (units.indexOf(src)<0) src='deg';
      var deg = 0;
      if (src === 'deg') deg = val;
      else if (src === 'rad') deg = val * DEG;
      else if (src === 'grad') deg = val * 0.9;
      else if (src === 'bearing') deg = val; // bearing numerically = degrees for display
      // normalize
      var rad = deg * RAD;
      var grad = deg / 0.9;
      var bearing = ((deg % 360) + 360) % 360;
      // cardinal
      var card = '';
      if (bearing >= 337.5 || bearing < 22.5) card = 'N';
      else if (bearing < 67.5) card = 'NE';
      else if (bearing < 112.5) card = 'E';
      else if (bearing < 157.5) card = 'SE';
      else if (bearing < 202.5) card = 'S';
      else if (bearing < 247.5) card = 'SW';
      else if (bearing < 292.5) card = 'W';
      else card = 'NW';
      var srcOpts = '';
      var srcLbl = { deg:t('mp_ac_deg','Grados'), rad:t('mp_ac_rad','Radianes'), grad:t('mp_ac_grad','Gradianes'), bearing:t('mp_ac_bearing','Rumbo (brújula)') };
      for (var i=0;i<units.length;i++){
        srcOpts += '<option value="'+units[i]+'"'+(src===units[i]?' selected':'')+'>'+esc(srcLbl[units[i]])+'</option>';
      }
      var rows = [
        ['0',0,0,0,'N'],
        ['30°',30,Math.PI/6,33.333,'NNE'],
        ['45°',45,Math.PI/4,50,'NE'],
        ['60°',60,Math.PI/3,66.667,'ENE'],
        ['90°',90,Math.PI/2,100,'E'],
        ['180°',180,Math.PI,200,'S'],
        ['270°',270,3*Math.PI/2,300,'W'],
        ['360°',360,2*Math.PI,400,'N']
      ];
      var rowsHtml = '';
      for (var j=0;j<rows.length;j++){
        var r = rows[j];
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+esc(r[0])+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(r[2],4)+' rad</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(r[3],1)+' grad</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+esc(r[4])+'</td>'+
        '</tr>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_val','Valor del ángulo'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="angleConv.val" value="'+val+'" step="any" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_src','Unidad origen'))+'</span></div>'+
            '<select class="mp-in" data-in="angleConv.src">'+srcOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ac_res_lbl','Conversiones'))+'</div>'+
          '<div class="mp-res-main">'+fmt(deg,3)+'<span class="mp-res-unit">°</span></div>'+
          '<div class="mp-res-desc">'+val+' '+esc(srcLbl[src])+' → '+fmt(deg,3)+'°</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ac_deg','Grados'))+'</div><div class="mp-res-val">'+fmt(deg,4)+'°</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ac_rad','Radianes'))+'</div><div class="mp-res-val">'+fmt(rad,5)+' rad</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ac_grad','Gradianes'))+'</div><div class="mp-res-val">'+fmt(grad,3)+' grad</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ac_bearing','Rumbo (brújula)'))+'</div><div class="mp-res-val">'+fmt(bearing,2)+'° '+esc(card)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_ac_ref','Ángulos notables'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">°</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">rad</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">grad</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_ac_bearing','Rumbo (brújula)'))+'</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ac_case','mp_ac_tip');
    }
  };

  // ─────────────────────────── circleCalc ───────────────────────────
  window.MP_CALCS['circleCalc'] = {
    i18n: {
      mp_cc_mode:      { es:'Entrada conocida',      en:'Known input' },
      mp_cc_val:       { es:'Valor',                 en:'Value' },
      mp_cc_arc:       { es:'Ángulo de arco',        en:'Arc angle' },
      mp_cc_r:         { es:'Radio',                 en:'Radius' },
      mp_cc_d:         { es:'Diámetro',              en:'Diameter' },
      mp_cc_c:         { es:'Circunferencia',        en:'Circumference' },
      mp_cc_res_lbl:   { es:'Círculo',               en:'Circle' },
      mp_cc_area:      { es:'Área',                  en:'Area' },
      mp_cc_arclen:    { es:'Largo del arco',        en:'Arc length' },
      mp_cc_sector:    { es:'Área del sector',       en:'Sector area' },
      mp_cc_ref:       { es:'Diámetros comunes de tubería', en:'Common pipe diameters' },
      mp_cc_case:      { es:'Necesitas tapar un orificio de 6" de diámetro en el ducto: área = 28.27 sqin. Compras parche de 30 sqin mínimo para dejar traslape.', en:'You must patch a 6" diameter hole in a duct: area = 28.27 sqin. Buy a 30 sqin patch minimum for overlap.' },
      mp_cc_tip:       { es:'Área de círculo = πr² (no πd²). Si te dan diámetro, divide entre 2 primero. Para CFM en tubería: velocidad × área (sqft).', en:'Circle area = πr² (not πd²). If given diameter, halve it first. For duct CFM: velocity × area (sqft).' }
    },
    render: function(state){
      var mode = pick(state,'circleCalc','mode','r');
      var val = num(pick(state,'circleCalc','val',6),6);
      var arcDeg = num(pick(state,'circleCalc','arc',90),90);
      if (['r','d','c'].indexOf(mode)<0) mode = 'r';
      var r = 0;
      if (mode === 'r') r = val;
      else if (mode === 'd') r = val/2;
      else if (mode === 'c') r = val/(2*Math.PI);
      if (r < 0) r = 0;
      var d = 2*r;
      var c = 2*Math.PI*r;
      var area = Math.PI*r*r;
      var arcLen = (arcDeg/360) * c;
      var sectorArea = (arcDeg/360) * area;
      var modeOpts = '';
      var modes = [['r',t('mp_cc_r','Radio')],['d',t('mp_cc_d','Diámetro')],['c',t('mp_cc_c','Circunferencia')]];
      for (var i=0;i<modes.length;i++){
        modeOpts += '<option value="'+modes[i][0]+'"'+(mode===modes[i][0]?' selected':'')+'>'+esc(modes[i][1])+'</option>';
      }
      var pipes = [['4"',4],['6"',6],['8"',8],['10"',10],['12"',12],['14"',14],['16"',16],['18"',18],['20"',20],['24"',24]];
      var rowsHtml = '';
      for (var j=0;j<pipes.length;j++){
        var pd = pipes[j][1];
        var pr = pd/2;
        var pa_in = Math.PI*pr*pr;
        var pa_ft = pa_in/144;
        var pc = Math.PI*pd;
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+esc(pipes[j][0])+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(pc,2)+'"</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(pa_in,2)+' in²</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(pa_ft,4)+' ft²</td>'+
        '</tr>';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cc_mode','Entrada conocida'))+'</span></div>'+
            '<select class="mp-in" data-in="circleCalc.mode">'+modeOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cc_val','Valor'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="number" class="mp-in" data-in="circleCalc.val" value="'+val+'" step="0.25" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cc_arc','Ángulo de arco'))+'</span><span class="mp-unit">°</span></div>'+
            '<input type="number" class="mp-in" data-in="circleCalc.arc" value="'+arcDeg+'" step="5" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_cc_res_lbl','Círculo'))+'</div>'+
          '<div class="mp-res-main">'+fmt(area,2)+'<span class="mp-res-unit">in²</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_cc_area','Área'))+' = π × '+fmt(r,2)+'² · r = '+fmt(r,2)+'"</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_r','Radio'))+'</div><div class="mp-res-val">'+fmt(r,3)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_d','Diámetro'))+'</div><div class="mp-res-val">'+fmt(d,3)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_c','Circunferencia'))+'</div><div class="mp-res-val">'+fmt(c,2)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_area','Área'))+'</div><div class="mp-res-val">'+fmt(area,2)+' in²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_arclen','Largo del arco'))+'</div><div class="mp-res-val">'+fmt(arcLen,2)+'"</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cc_sector','Área del sector'))+'</div><div class="mp-res-val">'+fmt(sectorArea,2)+' in²</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_cc_ref','Diámetros comunes de tubería'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_cc_d','Diámetro'))+'</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_cc_c','Circunferencia'))+'</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_cc_area','Área'))+' in²</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">'+esc(t('mp_cc_area','Área'))+' ft²</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_cc_case','mp_cc_tip');
    }
  };

  // ─────────────────────────── trigSolver ───────────────────────────
  window.MP_CALCS['trigSolver'] = {
    i18n: {
      mp_ts_ang:       { es:'Ángulo',                en:'Angle' },
      mp_ts_primary:   { es:'Función principal',    en:'Primary function' },
      mp_ts_res_lbl:   { es:'Las seis funciones',    en:'All six functions' },
      mp_ts_sin:       { es:'seno',                  en:'sine' },
      mp_ts_cos:       { es:'coseno',                en:'cosine' },
      mp_ts_tan:       { es:'tangente',              en:'tangent' },
      mp_ts_csc:       { es:'cosecante',             en:'cosecant' },
      mp_ts_sec:       { es:'secante',               en:'secant' },
      mp_ts_cot:       { es:'cotangente',            en:'cotangent' },
      mp_ts_ref:       { es:'Ángulos de referencia', en:'Reference angles' },
      mp_ts_case:      { es:'Para un line-set a 30° sobre horizontal: sin 30° = 0.5, por eso 10 ft de cobre solo suben 5 ft reales — compensa en la carga del sistema.', en:'For a line-set at 30° above horizontal: sin 30° = 0.5, so 10 ft of copper only rises 5 ft actual — account for it in charge.' },
      mp_ts_tip:       { es:'Memoriza sin/cos de 30-45-60. sin(30)=cos(60)=0.5, sin(45)=cos(45)=0.707, sin(60)=cos(30)=0.866. Tangente y compañía salen de la división.', en:'Memorize sin/cos of 30-45-60. sin(30)=cos(60)=0.5, sin(45)=cos(45)=0.707, sin(60)=cos(30)=0.866. The rest come from division.' }
    },
    render: function(state){
      var ang = num(pick(state,'trigSolver','ang',30),30);
      var primary = pick(state,'trigSolver','primary','sin');
      var funcs = ['sin','cos','tan','csc','sec','cot'];
      if (funcs.indexOf(primary)<0) primary='sin';
      var rad = ang * RAD;
      var sinV = Math.sin(rad);
      var cosV = Math.cos(rad);
      var tanV = Math.cos(rad) === 0 ? Infinity : Math.tan(rad);
      var cscV = sinV === 0 ? Infinity : 1/sinV;
      var secV = cosV === 0 ? Infinity : 1/cosV;
      var cotV = tanV === 0 ? Infinity : 1/tanV;
      var vals = { sin:sinV, cos:cosV, tan:tanV, csc:cscV, sec:secV, cot:cotV };
      var labels = { sin:t('mp_ts_sin','seno'), cos:t('mp_ts_cos','coseno'), tan:t('mp_ts_tan','tangente'), csc:t('mp_ts_csc','cosecante'), sec:t('mp_ts_sec','secante'), cot:t('mp_ts_cot','cotangente') };
      var primaryVal = vals[primary];
      var primaryStr = isFinite(primaryVal) ? fmt(primaryVal,5) : '∞';
      var opts = '';
      for (var i=0;i<funcs.length;i++){
        opts += '<option value="'+funcs[i]+'"'+(primary===funcs[i]?' selected':'')+'>'+esc(primary===funcs[i]?funcs[i]:funcs[i])+' ('+esc(labels[funcs[i]])+')</option>';
      }
      // Reference angles
      var refAngs = [0,30,45,60,90,120,135,150,180,270,360];
      var rowsHtml = '';
      for (var j=0;j<refAngs.length;j++){
        var a = refAngs[j];
        var rA = a*RAD;
        var s = Math.sin(rA);
        var c = Math.cos(rA);
        var ta = Math.abs(Math.cos(rA)) < 1e-10 ? '∞' : fmt(Math.tan(rA),4);
        rowsHtml += '<tr>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;color:#111;font-weight:600;">'+a+'°</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(s,4)+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+fmt(c,4)+'</td>'+
          '<td style="padding:6px 8px;border-bottom:1px solid #E7E5E4;">'+esc(ta)+'</td>'+
        '</tr>';
      }
      function fmtTrig(v){ return isFinite(v) ? fmt(v,5) : '∞'; }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ts_ang','Ángulo'))+'</span><span class="mp-unit">°</span></div>'+
            '<input type="number" class="mp-in" data-in="trigSolver.ang" value="'+ang+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ts_primary','Función principal'))+'</span></div>'+
            '<select class="mp-in" data-in="trigSolver.primary">'+opts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ts_res_lbl','Las seis funciones'))+'</div>'+
          '<div class="mp-res-main">'+esc(primaryStr)+'</div>'+
          '<div class="mp-res-desc">'+esc(primary)+'('+ang+'°) = '+esc(primaryStr)+' · '+esc(labels[primary])+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">sin '+ang+'°</div><div class="mp-res-val">'+fmtTrig(sinV)+'</div></div>'+
            '<div><div class="mp-res-item">cos '+ang+'°</div><div class="mp-res-val">'+fmtTrig(cosV)+'</div></div>'+
            '<div><div class="mp-res-item">tan '+ang+'°</div><div class="mp-res-val">'+fmtTrig(tanV)+'</div></div>'+
            '<div><div class="mp-res-item">csc '+ang+'°</div><div class="mp-res-val">'+fmtTrig(cscV)+'</div></div>'+
            '<div><div class="mp-res-item">sec '+ang+'°</div><div class="mp-res-val">'+fmtTrig(secV)+'</div></div>'+
            '<div><div class="mp-res-item">cot '+ang+'°</div><div class="mp-res-val">'+fmtTrig(cotV)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_ts_ref','Ángulos de referencia'))+'</div>'+
          '<div style="overflow-x:auto;">'+
            '<table style="width:100%;border-collapse:collapse;font-size:13px;color:#111;">'+
              '<thead><tr style="background:#F5F5F4;">'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">°</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">sin</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">cos</th>'+
                '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">tan</th>'+
              '</tr></thead>'+
              '<tbody>'+rowsHtml+'</tbody>'+
            '</table>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ts_case','mp_ts_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // Shared premium-card helpers for the NEW calcs (append-only)
  // ═════════════════════════════════════════════════════════════════
  var NAVY_CARD   = 'background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:14px;padding:20px;margin-bottom:14px;color:#fff;';
  var NAVY_LBL    = 'font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#C9A961;margin-bottom:10px;';
  var NAVY_MAIN   = 'font-size:34px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:-0.01em;margin-bottom:6px;';
  var NAVY_UNIT   = 'font-size:16px;font-weight:700;color:#C9A961;margin-left:6px;';
  var NAVY_DESC   = 'font-size:13px;color:#fff;margin-bottom:12px;opacity:0.92;';
  var NAVY_GRID   = 'border-top:1px solid #C9A961;padding-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;';
  var NAVY_ITEM   = 'font-size:11.5px;color:#C9A961;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;';
  var NAVY_VAL    = 'font-size:15px;font-weight:800;color:#fff;margin-top:2px;';
  var NAVY_NOTE   = 'font-size:12.5px;color:#fff;line-height:1.55;margin-top:10px;';
  var NAVY_WARN_OK= 'display:inline-block;padding:4px 10px;border-radius:999px;background:#16A34A;color:#fff;font-size:12px;font-weight:800;';
  var NAVY_WARN_B = 'display:inline-block;padding:4px 10px;border-radius:999px;background:#EAB308;color:#111;font-size:12px;font-weight:800;';
  var NAVY_WARN_R = 'display:inline-block;padding:4px 10px;border-radius:999px;background:#DC2626;color:#fff;font-size:12px;font-weight:800;';

  function navyCard(lblKey, lblFb, main, unit, desc, rows){
    var g = '';
    for (var i=0;i<rows.length;i++){
      g += '<div><div style="'+NAVY_ITEM+'">'+esc(rows[i][0])+'</div><div style="'+NAVY_VAL+'">'+rows[i][1]+'</div></div>';
    }
    return '<div style="'+NAVY_CARD+'">'+
      '<div style="'+NAVY_LBL+'">&#9670; '+esc(t(lblKey,lblFb))+'</div>'+
      '<div style="'+NAVY_MAIN+'">'+main+'<span style="'+NAVY_UNIT+'">'+esc(unit||'')+'</span></div>'+
      (desc?'<div style="'+NAVY_DESC+'">'+desc+'</div>':'')+
      (rows.length?'<div style="'+NAVY_GRID+'">'+g+'</div>':'')+
    '</div>';
  }

  function inputRow(tool, field, labelKey, labelFb, unit, val, step){
    return '<div class="mp-ig">'+
      '<div class="mp-lbl"><span>'+esc(t(labelKey,labelFb))+'</span><span class="mp-unit">'+esc(unit||'')+'</span></div>'+
      '<input type="number" class="mp-in" data-in="'+tool+'.'+field+'" value="'+val+'" step="'+(step||'any')+'" />'+
    '</div>';
  }
  function selectRow(tool, field, labelKey, labelFb, opts, current){
    var o='';
    for (var i=0;i<opts.length;i++){
      o += '<option value="'+esc(opts[i][0])+'"'+(String(opts[i][0])===String(current)?' selected':'')+'>'+esc(opts[i][1])+'</option>';
    }
    return '<div class="mp-ig">'+
      '<div class="mp-lbl"><span>'+esc(t(labelKey,labelFb))+'</span></div>'+
      '<select class="mp-in" data-in="'+tool+'.'+field+'">'+o+'</select>'+
    '</div>';
  }

  // ─────────────────────────── fracCalc ───────────────────────────
  function parseFrac(s){
    // Accepts '3 5/8', '5/8', '3.625'
    if (s==null) return 0;
    s = String(s).replace(/"/g,'').trim();
    if (!s) return 0;
    var neg = false;
    if (s.charAt(0)==='-'){ neg=true; s=s.substring(1).trim(); }
    var v=0;
    if (s.indexOf('/')>=0){
      var parts = s.split(/\s+/);
      var whole=0, frac=s;
      if (parts.length===2){ whole = parseFloat(parts[0])||0; frac = parts[1]; }
      var fp = frac.split('/');
      var n = parseFloat(fp[0])||0;
      var d = parseFloat(fp[1])||1;
      v = whole + (d?n/d:0);
    } else {
      v = parseFloat(s)||0;
    }
    return neg?-v:v;
  }
  function gcdI(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=b; b=a%b; a=t; } return a||1; }
  function toMixed(dec, denom){
    denom = denom||16;
    var sign = dec<0?'-':'';
    dec = Math.abs(dec);
    var whole = Math.floor(dec);
    var frac = dec - whole;
    var num = Math.round(frac*denom);
    if (num===denom){ whole+=1; num=0; }
    if (num===0) return sign + whole;
    var g = gcdI(num, denom);
    num = num/g; var dn = denom/g;
    if (whole===0) return sign + num + '/' + dn;
    return sign + whole + ' ' + num + '/' + dn;
  }

  window.MP_CALCS['fracCalc'] = {
    i18n: {
      mp_fc_title: { es:'Suma de Fracciones', en:'Fraction Math' },
      mp_fc_a:     { es:'Valor A',            en:'Value A' },
      mp_fc_b:     { es:'Valor B',            en:'Value B' },
      mp_fc_op:    { es:'Operación',          en:'Operation' },
      mp_fc_res:   { es:'Resultado',          en:'Result' },
      mp_fc_dec:   { es:'Decimal',            en:'Decimal' },
      mp_fc_mm:    { es:'Milímetros',         en:'Millimeters' },
      mp_fc_16:    { es:'En 1/16"',           en:'In 1/16"' },
      mp_fc_32:    { es:'En 1/32"',           en:'In 1/32"' },
      mp_fc_case:  { es:'Corte de cobre 3/8": 3 5/8" + 1 3/4" = 5 3/8" reales — la diferencia contra 5 1/2" estimado son 1/8" que no entran en el flare.', en:'Copper cut 3/8": 3 5/8" + 1 3/4" = 5 3/8" — vs an estimated 5 1/2" you lose 1/8" that does not fit the flare.' },
      mp_fc_tip:   { es:'En el field escribe siempre fracción + decimal en el sharpie: evita equivocar 5/8 con 5/16 en lectura rápida de cinta.', en:'In the field write both fraction + decimal on the sharpie tape: prevents misreading 5/8 vs 5/16 at a glance.' }
    },
    render: function(state){
      var aStr = pick(state,'fracCalc','a','3 5/8');
      var bStr = pick(state,'fracCalc','b','1 3/4');
      var op   = pick(state,'fracCalc','op','+');
      var a = parseFrac(aStr), b = parseFrac(bStr);
      var r = 0;
      if (op==='+') r = a+b;
      else if (op==='-') r = a-b;
      else if (op==='*') r = a*b;
      else if (op==='/') r = b===0?0:a/b;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_fc_a','Valor A'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="text" class="mp-in" data-in="fracCalc.a" value="'+esc(aStr)+'" /></div>'+
          selectRow('fracCalc','op','mp_fc_op','Operación',[['+','+ (suma / add)'],['-','- (resta / sub)'],['*','× (mult)'],['/','÷ (div)']],op)+
          '<div class="mp-ig"><div class="mp-lbl"><span>'+esc(t('mp_fc_b','Valor B'))+'</span><span class="mp-unit">in</span></div>'+
            '<input type="text" class="mp-in" data-in="fracCalc.b" value="'+esc(bStr)+'" /></div>'+
        '</div>'+
        navyCard('mp_fc_res','Resultado', esc(toMixed(r,16)), 'in',
          'A = '+fmt(a,4)+'" &nbsp;'+esc(op)+'&nbsp; B = '+fmt(b,4)+'"',
          [[t('mp_fc_dec','Decimal'), fmt(r,4)+' in'],
           [t('mp_fc_mm','Milímetros'), fmt(r*25.4,2)+' mm'],
           [t('mp_fc_16','En 1/16"'), esc(toMixed(r,16))],
           [t('mp_fc_32','En 1/32"'), esc(toMixed(r,32))]])+
        exampleTip('mp_fc_case','mp_fc_tip');
    }
  };

  // ─────────────────────────── tapeMeasure ───────────────────────────
  window.MP_CALCS['tapeMeasure'] = {
    i18n: {
      mp_tm_title: { es:'Cinta de Medir',  en:'Tape Measure' },
      mp_tm_ft:    { es:'Pies',            en:'Feet' },
      mp_tm_in:    { es:'Pulgadas',        en:'Inches' },
      mp_tm_num:   { es:'Numerador',       en:'Numerator' },
      mp_tm_den:   { es:'Denominador',     en:'Denominator' },
      mp_tm_res:   { es:'Medida total',    en:'Total measure' },
      mp_tm_totin: { es:'Total en pulgadas', en:'Total inches' },
      mp_tm_totft: { es:'Total en pies',   en:'Total feet' },
      mp_tm_totm:  { es:'Total en metros', en:'Total meters' },
      mp_tm_totmm: { es:'Total en mm',     en:'Total mm' },
      mp_tm_case:  { es:'Un line-set cortado a 12 ft 7 5/8" cabe en un chase de 3.855 m — confirma con cinta metric antes de soldar.', en:'A line-set cut at 12 ft 7 5/8" fits a 3.855 m chase — confirm with metric tape before brazing.' },
      mp_tm_tip:   { es:'Las marcas más largas en una cinta US son 1/2, las medianas 1/4, luego 1/8 y las cortas 1/16. Si ves 1/32, es cinta de machinist.', en:'The longest US-tape marks are 1/2, medium are 1/4, then 1/8, shortest 1/16. A 1/32 mark means it is a machinist tape.' }
    },
    render: function(state){
      var ft = num(pick(state,'tapeMeasure','ft',12),12);
      var inch = num(pick(state,'tapeMeasure','in',7),7);
      var n = num(pick(state,'tapeMeasure','num',5),5);
      var d = num(pick(state,'tapeMeasure','den',8),8);
      if (d<=0) d=16;
      var totIn = ft*12 + inch + n/d;
      var totFt = totIn/12;
      var totM  = totIn*0.0254;
      var totMm = totIn*25.4;
      var display = ft+"' "+ inch +' '+ Math.round(n) +'/'+ Math.round(d) +'"';
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('tapeMeasure','ft','mp_tm_ft','Pies','ft',ft,'1')+
          inputRow('tapeMeasure','in','mp_tm_in','Pulgadas','in',inch,'1')+
          inputRow('tapeMeasure','num','mp_tm_num','Numerador','',n,'1')+
          selectRow('tapeMeasure','den','mp_tm_den','Denominador',[['2','1/2'],['4','1/4'],['8','1/8'],['16','1/16'],['32','1/32']],d)+
        '</div>'+
        navyCard('mp_tm_res','Medida total', esc(display), '', fmt(totIn,4)+' in · '+fmt(totFt,4)+' ft · '+fmt(totM,4)+' m',
          [[t('mp_tm_totin','Total in'), fmt(totIn,4)+' in'],
           [t('mp_tm_totft','Total ft'), fmt(totFt,4)+' ft'],
           [t('mp_tm_totm','Total m'),   fmt(totM,4)+' m'],
           [t('mp_tm_totmm','Total mm'), fmt(totMm,2)+' mm']])+
        exampleTip('mp_tm_case','mp_tm_tip');
    }
  };

  // ─────────────────────────── unitConverter ───────────────────────────
  var UC = {
    length:  { base:'m',    units:{ 'in':0.0254,'ft':0.3048,'yd':0.9144,'mm':0.001,'cm':0.01,'m':1 } },
    area:    { base:'m2',   units:{ 'sq in':0.00064516,'sq ft':0.09290304,'sq yd':0.83612736,'sq m':1 } },
    volume:  { base:'m3',   units:{ 'cu in':0.000016387064,'cu ft':0.028316846592,'cu yd':0.764554857984,'gal (US)':0.003785411784,'L':0.001,'m³':1 } },
    weight:  { base:'kg',   units:{ 'oz':0.0283495,'lb':0.45359237,'kg':1,'ton (US)':907.18474 } },
    pressure:{ base:'Pa',   units:{ 'psi':6894.757,'inWC':248.84,'Pa':1,'kPa':1000,'bar':100000 } },
    energy:  { base:'J',    units:{ 'BTU':1055.056,'kWh':3600000,'therm':105480400,'kJ':1000,'J':1 } },
    power:   { base:'W',    units:{ 'W':1,'kW':1000,'HP':745.6999,'BTU/hr':0.293071,'ton (refrig)':3516.85 } },
    flow:    { base:'m3s',  units:{ 'CFM':0.000471947,'L/s':0.001,'m³/hr':1/3600,'GPM':0.0000630902,'m³/s':1 } }
    // temperature handled separately
  };
  function convertUC(val, fromU, toU, cat){
    if (cat==='temperature') return val; // separate
    var u = UC[cat]; if(!u) return val;
    var inBase = val * (u.units[fromU]||1);
    return inBase / (u.units[toU]||1);
  }
  function tempConv(v, from, to){
    var c;
    if (from==='F') c = (v-32)*5/9;
    else if (from==='K') c = v-273.15;
    else c = v;
    if (to==='F') return c*9/5+32;
    if (to==='K') return c+273.15;
    return c;
  }
  window.MP_CALCS['unitConverter'] = {
    i18n: {
      mp_uc_title: { es:'Conversor Universal', en:'Universal Converter' },
      mp_uc_cat:   { es:'Categoría',           en:'Category' },
      mp_uc_from:  { es:'De',                  en:'From' },
      mp_uc_to:    { es:'A',                   en:'To' },
      mp_uc_val:   { es:'Valor',               en:'Value' },
      mp_uc_res:   { es:'Resultado',           en:'Result' },
      mp_uc_case:  { es:'Un rooftop de 5 tons = 60,000 BTU/hr = 17.58 kW = 60,001 BTU/hr eléctricos — útil para verificar plaquitas en SI vs IP.', en:'A 5-ton rooftop = 60,000 BTU/hr = 17.58 kW — useful when cross-checking SI vs IP nameplates.' },
      mp_uc_tip:   { es:'Guarda de memoria: 1 ton = 12,000 BTU/hr = 3.517 kW, 1 inWC = 249 Pa, 1 psi ≈ 27.7 inWC. Con esos tres factores cubres 80% del field.', en:'Memorize: 1 ton = 12,000 BTU/hr = 3.517 kW, 1 inWC = 249 Pa, 1 psi ≈ 27.7 inWC. Those three cover 80% of field work.' }
    },
    render: function(state){
      var cat   = pick(state,'unitConverter','cat','length');
      var cats  = ['length','area','volume','weight','pressure','energy','power','flow','temperature'];
      var unitList;
      if (cat==='temperature') unitList = ['F','C','K'];
      else unitList = Object.keys(UC[cat] ? UC[cat].units : UC.length.units);
      var fromU = pick(state,'unitConverter','from', unitList[0]);
      var toU   = pick(state,'unitConverter','to',   unitList[unitList.length-1]);
      if (unitList.indexOf(fromU)<0) fromU=unitList[0];
      if (unitList.indexOf(toU)<0)   toU  =unitList[unitList.length-1];
      var val   = num(pick(state,'unitConverter','val',1),1);
      var out;
      if (cat==='temperature') out = tempConv(val, fromU, toU);
      else out = convertUC(val, fromU, toU, cat);
      var catOpts = [];
      for (var i=0;i<cats.length;i++){ catOpts.push([cats[i], cats[i]]); }
      var uOpts = [];
      for (var j=0;j<unitList.length;j++){ uOpts.push([unitList[j], unitList[j]]); }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('unitConverter','cat','mp_uc_cat','Categoría', catOpts, cat)+
          inputRow('unitConverter','val','mp_uc_val','Valor','',val,'any')+
          selectRow('unitConverter','from','mp_uc_from','De', uOpts, fromU)+
          selectRow('unitConverter','to','mp_uc_to','A', uOpts, toU)+
        '</div>'+
        navyCard('mp_uc_res','Resultado', fmt(out,6), toU,
          fmt(val,4)+' '+esc(fromU)+' &nbsp;=&nbsp; '+fmt(out,6)+' '+esc(toU),
          [['Categoría', esc(cat)],
           ['From', esc(fromU)],
           ['To',   esc(toU)],
           ['Input',fmt(val,4)]])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> Tabla de referencia · Reference</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Conversión · Conversion</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Valor · Value</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 ft</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.3048 m · 12 in · 304.8 mm</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 in</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">25.4 mm</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 gal (US)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">3.785 L · 231 in³</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 lb</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.4536 kg · 16 oz</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 psi</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">6.895 kPa · 27.71 inWC</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 inWC</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">248.84 Pa</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 BTU</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">1,055.06 J</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 kWh</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">3,412.14 BTU</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 therm</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">100,000 BTU · 29.3 kWh</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 HP</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.7457 kW · 2,545 BTU/hr</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">1 ton refrig</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">12,000 BTU/hr · 3.517 kW</td></tr>'+
              '<tr><td style="padding:5px 8px;">1 CFM</td><td style="padding:5px 8px;text-align:right;font-weight:700;">0.4719 L/s · 1.699 m³/hr</td></tr>'+
            '</tbody></table>'+
        '</div>'+
        exampleTip('mp_uc_case','mp_uc_tip');
    }
  };

  // ─────────────────────────── areas ───────────────────────────
  window.MP_CALCS['areas'] = {
    i18n: {
      mp_ar_title: { es:'Áreas',          en:'Areas' },
      mp_ar_shape: { es:'Figura',         en:'Shape' },
      mp_ar_a:     { es:'Dim A',          en:'Dim A' },
      mp_ar_b:     { es:'Dim B',          en:'Dim B' },
      mp_ar_c:     { es:'Dim C',          en:'Dim C' },
      mp_ar_n:     { es:'Lados (polígono)', en:'Sides (polygon)' },
      mp_ar_res:   { es:'Área',           en:'Area' },
      mp_ar_case:  { es:'Zona supply circular de 12 ft de diámetro = 113.1 ft² = 10.51 m²: útil para chequear CFM/ft² vs ASHRAE 62.1.', en:'Circular supply zone 12 ft diameter = 113.1 ft² = 10.51 m²: useful to cross-check CFM/ft² vs ASHRAE 62.1.' },
      mp_ar_tip:   { es:'Triángulo = ½·base·altura SOLO si la altura es perpendicular. Si te dan 3 lados usa Herón: A = √(s(s-a)(s-b)(s-c)), s=perim/2.', en:'Triangle = ½·base·height ONLY if height is perpendicular. With 3 sides use Heron: A = √(s(s-a)(s-b)(s-c)), s=perim/2.' }
    },
    render: function(state){
      var shape = pick(state,'areas','shape','rect');
      var A = num(pick(state,'areas','a',12),12);
      var B = num(pick(state,'areas','b',10),10);
      var C = num(pick(state,'areas','c',0),0);
      var n = Math.max(3, Math.floor(num(pick(state,'areas','n',6),6)));
      var area = 0, desc = '';
      if (shape==='rect'){       area = A*B;               desc = 'A = base × alto = '+A+' × '+B; }
      else if (shape==='tri'){   area = 0.5*A*B;           desc = 'A = ½ · base · altura'; }
      else if (shape==='circ'){  area = Math.PI*A*A;       desc = 'A = π · r² (r = '+A+' ft)'; }
      else if (shape==='trap'){  area = 0.5*(A+B)*C;       desc = 'A = ½(b1+b2)·h'; }
      else if (shape==='poly'){
        var s = A;
        area = (n*s*s) / (4*Math.tan(Math.PI/n));
        desc = 'A = n·s² / (4·tan(π/n)) · '+n+' lados';
      }
      var m2 = area * 0.09290304;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('areas','shape','mp_ar_shape','Figura',[['rect','Rectángulo / Rectangle'],['tri','Triángulo / Triangle'],['circ','Círculo / Circle'],['trap','Trapecio / Trapezoid'],['poly','Polígono regular / Regular polygon']], shape)+
          inputRow('areas','a','mp_ar_a','Dim A', (shape==='circ'?'ft (radio)':'ft'), A,'0.1')+
          (shape==='rect'||shape==='tri'||shape==='trap' ? inputRow('areas','b','mp_ar_b','Dim B','ft',B,'0.1') : '')+
          (shape==='trap' ? inputRow('areas','c','mp_ar_c','Altura h','ft',C,'0.1') : '')+
          (shape==='poly' ? inputRow('areas','n','mp_ar_n','Lados','',n,'1') : '')+
        '</div>'+
        navyCard('mp_ar_res','Área', fmt(area,2), 'ft²', desc,
          [['ft²', fmt(area,2)],
           ['m²',  fmt(m2,3)],
           ['in²', fmt(area*144,0)],
           ['yd²', fmt(area/9,2)]])+
        exampleTip('mp_ar_case','mp_ar_tip');
    }
  };

  // ─────────────────────────── volumes ───────────────────────────
  window.MP_CALCS['volumes'] = {
    i18n: {
      mp_vo_title: { es:'Volúmenes',     en:'Volumes' },
      mp_vo_shape: { es:'Figura',        en:'Shape' },
      mp_vo_a:     { es:'Dim A',         en:'Dim A' },
      mp_vo_b:     { es:'Dim B',         en:'Dim B' },
      mp_vo_c:     { es:'Dim C',         en:'Dim C' },
      mp_vo_res:   { es:'Volumen',       en:'Volume' },
      mp_vo_case:  { es:'Sala 14×12×9 ft = 1,512 ft³ → 1,512 / 9 = 168 CFM para 10 ACH (residencial alto). ASHRAE 62.2 exige menos.', en:'Room 14×12×9 ft = 1,512 ft³ → 1,512 / 9 = 168 CFM for 10 ACH (high residential). ASHRAE 62.2 asks less.' },
      mp_vo_tip:   { es:'1 ft³ de agua = 7.481 gal = 62.4 lb. Un cilindro de 3"Ø × 36" = 3.53 gal: útil para trampas de condensado.', en:'1 ft³ water = 7.481 gal = 62.4 lb. A 3"Ø × 36" cylinder = 3.53 gal: handy for condensate traps.' }
    },
    render: function(state){
      var shape = pick(state,'volumes','shape','rect');
      var A = num(pick(state,'volumes','a',14),14);
      var B = num(pick(state,'volumes','b',12),12);
      var C = num(pick(state,'volumes','c',9),9);
      var vol = 0, desc = '';
      if (shape==='cube'){     vol = A*A*A;                     desc = 's³'; }
      else if (shape==='rect'){vol = A*B*C;                     desc = 'L × W × H'; }
      else if (shape==='cyl'){ vol = Math.PI*A*A*B;             desc = 'π · r² · h'; }
      else if (shape==='cone'){vol = Math.PI*A*A*B/3;           desc = '⅓ · π · r² · h'; }
      else if (shape==='sph'){ vol = (4/3)*Math.PI*A*A*A;       desc = '4/3 · π · r³'; }
      else if (shape==='pyr'){ vol = (A*B*C)/3;                 desc = '⅓ · base · h'; }
      var gal = vol*7.480519;
      var m3  = vol*0.028316846592;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('volumes','shape','mp_vo_shape','Figura',[['cube','Cubo'],['rect','Rect. prisma'],['cyl','Cilindro'],['cone','Cono'],['sph','Esfera'],['pyr','Pirámide']], shape)+
          inputRow('volumes','a','mp_vo_a','Dim A','ft',A,'0.1')+
          (shape!=='cube'&&shape!=='sph' ? inputRow('volumes','b','mp_vo_b','Dim B','ft',B,'0.1') : '')+
          (shape==='rect'||shape==='pyr' ? inputRow('volumes','c','mp_vo_c','Dim C','ft',C,'0.1') : '')+
        '</div>'+
        navyCard('mp_vo_res','Volumen', fmt(vol,2), 'ft³', desc,
          [['ft³', fmt(vol,2)],
           ['gal US', fmt(gal,1)],
           ['m³', fmt(m3,3)],
           ['L',  fmt(m3*1000,1)]])+
        exampleTip('mp_vo_case','mp_vo_tip');
    }
  };

  // ─────────────────────────── rafterLen ───────────────────────────
  window.MP_CALCS['rafterLen'] = {
    i18n: {
      mp_rl_title: { es:'Longitud de Rafter', en:'Rafter Length' },
      mp_rl_width: { es:'Ancho edificio',   en:'Building width' },
      mp_rl_pitch: { es:'Pitch (X-in-12)',  en:'Pitch (X-in-12)' },
      mp_rl_eave:  { es:'Proyección alero', en:'Eave projection' },
      mp_rl_res:   { es:'Rafter común',     en:'Common rafter' },
      mp_rl_hip:   { es:'Hip / Valley',     en:'Hip / Valley' },
      mp_rl_ang:   { es:'Ángulo de techo',  en:'Roof angle' },
      mp_rl_case:  { es:'Casa 28 ft con pitch 6/12: run = 14 ft, rafter común = 14·1.1180 = 15.65 ft + alero 1 ft = 16.65 ft; hip = 14·1.5000 = 21 ft.', en:'28-ft house with 6/12 pitch: run = 14 ft, common rafter = 14·1.1180 = 15.65 ft + 1 ft eave = 16.65 ft; hip = 14·1.5 = 21 ft.' },
      mp_rl_tip:   { es:'Framing-square multipliers: multiplicador rafter = √(pitch²+144)/12. Hip/valley usa diagonal 17 en vez de 12: √(pitch²+288)/12.', en:'Framing-square multipliers: common = √(pitch²+144)/12. Hip/valley uses 17-diagonal: √(pitch²+288)/12.' }
    },
    render: function(state){
      var width = num(pick(state,'rafterLen','width',28),28);
      var pitch = num(pick(state,'rafterLen','pitch',6),6);
      var eave  = num(pick(state,'rafterLen','eave',1),1);
      var run   = width/2;
      var mult  = Math.sqrt(pitch*pitch + 144)/12;
      var hipMul= Math.sqrt(pitch*pitch + 288)/12;
      var common = run*mult + eave;
      var hip    = run*hipMul + eave;
      var angle  = Math.atan2(pitch,12) * DEG;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('rafterLen','width','mp_rl_width','Ancho edificio','ft',width,'0.5')+
          inputRow('rafterLen','pitch','mp_rl_pitch','Pitch X/12','',pitch,'0.5')+
          inputRow('rafterLen','eave','mp_rl_eave','Alero','ft',eave,'0.25')+
        '</div>'+
        navyCard('mp_rl_res','Rafter común', fmt(common,2), 'ft',
          'run = '+fmt(run,2)+' ft · mult = '+fmt(mult,4)+' · alero + '+eave+' ft',
          [[t('mp_rl_hip','Hip/Valley'), fmt(hip,2)+' ft'],
           [t('mp_rl_ang','Ángulo'), fmt(angle,2)+'°'],
           ['Mult común', fmt(mult,4)],
           ['Mult hip/valley', fmt(hipMul,4)]])+
        exampleTip('mp_rl_case','mp_rl_tip');
    }
  };

  // ─────────────────────────── cfmPerTon ───────────────────────────
  window.MP_CALCS['cfmPerTon'] = {
    i18n: {
      mp_cpt_title: { es:'CFM por Tonelada', en:'CFM per Ton' },
      mp_cpt_tons:  { es:'Toneladas',        en:'Tons' },
      mp_cpt_rate:  { es:'CFM / ton',        en:'CFM / ton' },
      mp_cpt_res:   { es:'CFM total',        en:'Total CFM' },
      mp_cpt_range: { es:'Rango ACCA',       en:'ACCA range' },
      mp_cpt_case:  { es:'Sistema 3 tons de A/C residencial: 3 × 400 = 1,200 CFM. Si el duct delivery solo arroja 950 CFM, tienes 20% de déficit — tapa, restricción o filtro sucio.', en:'3-ton residential A/C: 3 × 400 = 1,200 CFM. If duct delivery only yields 950 CFM, you are 20% short — blocked, restricted or dirty filter.' },
      mp_cpt_tip:   { es:'Regla del pulgar ACCA Manual D: 350 CFM/ton alta humedad, 400 CFM/ton estándar, 450 CFM/ton clima seco. Heat pump en heating sube a 450–500.', en:'ACCA Manual D rule of thumb: 350 CFM/ton high humidity, 400 standard, 450 dry climate. Heat pump in heating rises to 450–500.' }
    },
    render: function(state){
      var tons = num(pick(state,'cfmPerTon','tons',3),3); if(tons<=0) tons=3;
      var rate = num(pick(state,'cfmPerTon','rate',400),400); if(rate<=0) rate=400;
      var cfm = tons*rate;
      var status, statusStyle;
      if (rate<350){       status = 'BAJO · húmedo / humid+'; statusStyle = NAVY_WARN_R; }
      else if (rate<=450){ status = 'OK · rango ACCA';        statusStyle = NAVY_WARN_OK; }
      else if (rate<=500){ status = 'ALTO · heat pump / dry'; statusStyle = NAVY_WARN_B; }
      else {               status = 'FUERA DE RANGO';         statusStyle = NAVY_WARN_R; }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('cfmPerTon','tons','mp_cpt_tons','Toneladas','ton',tons,'0.5')+
          inputRow('cfmPerTon','rate','mp_cpt_rate','CFM/ton','CFM/ton',rate,'10')+
        '</div>'+
        navyCard('mp_cpt_res','CFM total', fmt(cfm,0), 'CFM',
          tons+' ton × '+rate+' CFM/ton = '+fmt(cfm,0)+' CFM &nbsp;<span style="'+statusStyle+'">'+esc(status)+'</span>',
          [['350 CFM/ton', fmt(tons*350,0)+' CFM · humid'],
           ['400 CFM/ton', fmt(tons*400,0)+' CFM · std'],
           ['450 CFM/ton', fmt(tons*450,0)+' CFM · dry'],
           ['ACCA', 'Manual D 2016']])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> CFM/ton · Guía ACCA Manual D</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Aplicación · Application</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">CFM/ton</th>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Nota · Note</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">High-humidity cooling (FL, TX Gulf)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">350</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Baja SHR, más dehumid</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Standard cooling</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">400</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Default Manual D</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Dry climate cooling (AZ, NM)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">450</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Sensible only, SHR alto</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Heat pump · heating</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">450–500</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Mayor airflow por ΔT menor</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">High-static ECM</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">varía</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Mide estática actual</td></tr>'+
              '<tr><td style="padding:5px 8px;">Compresor variable (inverter)</td><td style="padding:5px 8px;text-align:right;font-weight:700;">350–500</td><td style="padding:5px 8px;">Ajusta por capacidad parcial</td></tr>'+
            '</tbody></table>'+
          '<div style="margin-top:10px;font-size:12px;color:#111;"><strong>Fuente:</strong> ACCA Manual D · ASHRAE Handbook — HVAC Systems and Equipment, ch. 18. Confirma con medición real (flow hood, pitot, TrueFlow).</div>'+
        '</div>'+
        exampleTip('mp_cpt_case','mp_cpt_tip');
    }
  };

  // ─────────────────────────── cfmPerSqft ───────────────────────────
  var OCC_RATES = {
    office:     { rate:0.06, ppl:5,   label:{es:'Oficina', en:'Office'} },
    retail:     { rate:0.12, ppl:15,  label:{es:'Retail',  en:'Retail'} },
    restaurant: { rate:0.18, ppl:70,  label:{es:'Restaurante', en:'Restaurant'} },
    classroom:  { rate:0.12, ppl:35,  label:{es:'Aula',    en:'Classroom'} },
    gym:        { rate:0.06, ppl:7,   label:{es:'Gimnasio',en:'Gymnasium'} },
    lobby:      { rate:0.06, ppl:30,  label:{es:'Lobby',   en:'Lobby'} },
    conference: { rate:0.06, ppl:50,  label:{es:'Sala conf.', en:'Conference'} },
    kitchen:    { rate:0.12, ppl:20,  label:{es:'Cocina',  en:'Kitchen'} },
    hospital:   { rate:0.18, ppl:10,  label:{es:'Hospital',en:'Hospital'} },
    residential:{ rate:0.06, ppl:0,   label:{es:'Residencial',en:'Residential'} }
  };
  window.MP_CALCS['cfmPerSqft'] = {
    i18n: {
      mp_cps_title: { es:'CFM por ft²',    en:'CFM per ft²' },
      mp_cps_occ:   { es:'Tipo ocupación', en:'Occupancy type' },
      mp_cps_area:  { es:'Área',           en:'Area' },
      mp_cps_ppl:   { es:'Personas',       en:'People' },
      mp_cps_res:   { es:'OA requerido',   en:'Required OA' },
      mp_cps_rate:  { es:'Rate por ft²',   en:'Rate per ft²' },
      mp_cps_case:  { es:'Oficina 2,000 ft² con 10 personas: 0.06·2000 + 5·10 = 170 CFM OA (ASHRAE 62.1 Tabla 6-1) — NO 2000·0.12, ese factor es de retail.', en:'2,000 ft² office with 10 people: 0.06·2000 + 5·10 = 170 CFM OA (ASHRAE 62.1 Table 6-1) — NOT 2000·0.12, that factor is retail.' },
      mp_cps_tip:   { es:'ASHRAE 62.1 suma dos términos: Ra·área + Rp·personas. El sistema VAV aplica un factor Ev (eficiencia), típicamente 0.8.', en:'ASHRAE 62.1 sums two terms: Ra·area + Rp·people. VAV systems apply an Ev (efficiency) factor, typically 0.8.' }
    },
    render: function(state){
      var occ = pick(state,'cfmPerSqft','occ','office');
      var area = num(pick(state,'cfmPerSqft','area',2000),2000);
      var ppl  = num(pick(state,'cfmPerSqft','ppl',10),10);
      var cfg = OCC_RATES[occ] || OCC_RATES.office;
      var oaArea = cfg.rate * area;
      var oaPpl  = cfg.ppl  * ppl;
      var total  = oaArea + oaPpl;
      var opts=[]; for (var k in OCC_RATES){ if (OCC_RATES.hasOwnProperty(k)) opts.push([k, OCC_RATES[k].label.es+' / '+OCC_RATES[k].label.en]); }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('cfmPerSqft','occ','mp_cps_occ','Ocupación', opts, occ)+
          inputRow('cfmPerSqft','area','mp_cps_area','Área','ft²',area,'10')+
          inputRow('cfmPerSqft','ppl','mp_cps_ppl','Personas','',ppl,'1')+
        '</div>'+
        navyCard('mp_cps_res','Outside Air requerido', fmt(total,0), 'CFM',
          'Ra·área + Rp·personas = '+fmt(cfg.rate,2)+'·'+area+' + '+cfg.ppl+'·'+ppl+' = '+fmt(total,0)+' CFM · ASHRAE 62.1 Table 6-1',
          [['Por área', fmt(oaArea,0)+' CFM'],
           ['Por personas', fmt(oaPpl,0)+' CFM'],
           ['Ra (CFM/ft²)', fmt(cfg.rate,2)],
           ['Rp (CFM/persona)', cfg.ppl]])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> ASHRAE 62.1 Tabla 6-1 · OA rates</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Ocupación</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Ra · CFM/ft²</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Rp · CFM/persona</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Office space</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.06</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Retail sales</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.12</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">7.5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Restaurant dining</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.18</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">7.5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Classroom (ages 5-8)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.12</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Gymnasium</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.06</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">20</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Hotel lobby</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.06</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">7.5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Conference / meeting</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.06</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Commercial kitchen</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.12</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">7.5</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Hospital patient room</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">0.18</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">25</td></tr>'+
              '<tr><td style="padding:5px 8px;">Residencial (62.2)</td><td style="padding:5px 8px;text-align:right;font-weight:700;">0.03</td><td style="padding:5px 8px;text-align:right;font-weight:700;">7.5·(Nbr+1)</td></tr>'+
            '</tbody></table>'+
          '<div style="margin-top:10px;font-size:12px;color:#111;"><strong>Fórmula:</strong> Vbz = Rp·Pz + Ra·Az · ASHRAE 62.1-2022 §6.2.2.1. Para VAV aplica Ev (eficiencia de zona) típicamente 0.8.</div>'+
        '</div>'+
        exampleTip('mp_cps_case','mp_cps_tip');
    }
  };

  // ─────────────────────────── sqftPerTon ───────────────────────────
  var SQFT_TON = {
    'hot-humid':    { old:400, avg:500, new:600,  label:{es:'Cálido / Húmedo (Zona 1-2)', en:'Hot / Humid (Zone 1-2)'} },
    'hot-dry':      { old:450, avg:550, new:700,  label:{es:'Cálido / Seco (Zona 2-3)',   en:'Hot / Dry (Zone 2-3)'} },
    'mixed':        { old:500, avg:650, new:800,  label:{es:'Mixto (Zona 4)',             en:'Mixed (Zone 4)'} },
    'cold':         { old:600, avg:750, new:900,  label:{es:'Frío (Zona 5-6)',            en:'Cold (Zone 5-6)'} },
    'very-cold':    { old:700, avg:850, new:1000, label:{es:'Muy frío (Zona 7-8)',        en:'Very cold (Zone 7-8)'} }
  };
  window.MP_CALCS['sqftPerTon'] = {
    i18n: {
      mp_spt_title: { es:'ft² por Tonelada',   en:'sq ft per Ton' },
      mp_spt_area:  { es:'Área conditioned',   en:'Conditioned area' },
      mp_spt_zone:  { es:'Zona climática',     en:'Climate zone' },
      mp_spt_vint:  { es:'Construcción',       en:'Construction vintage' },
      mp_spt_res:   { es:'Toneladas estimadas', en:'Estimated tons' },
      mp_spt_warn:  { es:'SOLO pre-check — Manual J es obligatorio', en:'Rule-of-thumb ONLY — Manual J is required' },
      mp_spt_case:  { es:'Casa 2,400 ft² en Florida (hot-humid) construida 2015: 2400/600 = 4.0 ton. Nunca dimensiones un sistema final con este número — siempre Manual J.', en:'2,400 ft² Florida home (hot-humid) built 2015: 2400/600 = 4.0 ton. Never size a final system from this — always run Manual J.' },
      mp_spt_tip:   { es:'ACCA prohíbe vender por ft²/ton desde Manual J 8th. Úsalo como sanity-check: si tu Manual J cae fuera de ±20% de este número, revisa entradas.', en:'ACCA has banned ft²/ton sizing since Manual J 8th. Use only as a sanity check — if your Manual J is more than ±20% off, re-check inputs.' }
    },
    render: function(state){
      var area = num(pick(state,'sqftPerTon','area',2400),2400);
      var zone = pick(state,'sqftPerTon','zone','hot-humid');
      var vint = pick(state,'sqftPerTon','vint','avg'); // old/avg/new
      var cfg = SQFT_TON[zone] || SQFT_TON['mixed'];
      var sqftPerTon = cfg[vint] || cfg.avg;
      var tons = area / sqftPerTon;
      var zOpts = [];
      for (var k in SQFT_TON){ if (SQFT_TON.hasOwnProperty(k)) zOpts.push([k, SQFT_TON[k].label.es+' / '+SQFT_TON[k].label.en]); }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('sqftPerTon','area','mp_spt_area','Área','ft²',area,'10')+
          selectRow('sqftPerTon','zone','mp_spt_zone','Zona climática', zOpts, zone)+
          selectRow('sqftPerTon','vint','mp_spt_vint','Construcción',[['old','Antigua (pre-1990)'],['avg','Estándar (1990-2010)'],['new','Nueva / alta eficiencia (2010+)']], vint)+
        '</div>'+
        navyCard('mp_spt_res','Toneladas estimadas', fmt(tons,2), 'ton',
          area+' ft² / '+sqftPerTon+' ft²/ton = '+fmt(tons,2)+' ton &nbsp;<span style="'+NAVY_WARN_B+'">'+esc(t('mp_spt_warn','Pre-check only'))+'</span>',
          [['ft²/ton usado', sqftPerTon],
           ['Antigua', cfg.old+' ft²/ton'],
           ['Estándar', cfg.avg+' ft²/ton'],
           ['Nueva', cfg.new+' ft²/ton']])+
        exampleTip('mp_spt_case','mp_spt_tip');
    }
  };

  // ─────────────────────────── pipeVelocity ───────────────────────────
  window.MP_CALCS['pipeVelocity'] = {
    i18n: {
      mp_pv_title: { es:'Velocidad en Tubería', en:'Pipe Velocity' },
      mp_pv_gpm:   { es:'Flujo (GPM)',          en:'Flow (GPM)' },
      mp_pv_dia:   { es:'Diámetro interno',     en:'Inside diameter' },
      mp_pv_fluid: { es:'Fluido',               en:'Fluid' },
      mp_pv_res:   { es:'Velocidad',            en:'Velocity' },
      mp_pv_case:  { es:'20 GPM en cobre 1" (ID ≈ 0.995"): V = 0.4085·20/0.995² ≈ 8.26 ft/s — justo en el límite supply. Sube a 1-1/4" y caes a 5.3 ft/s.', en:'20 GPM in 1" copper (ID ≈ 0.995"): V = 0.4085·20/0.995² ≈ 8.26 ft/s — right at the supply limit. Upsize to 1-1/4" and you drop to 5.3 ft/s.' },
      mp_pv_tip:   { es:'Agua: <8 ft/s supply, <10 ft/s return (ASHRAE 2021 F22). Refrig: succión vertical 1,000-4,000 fpm (≈16.7-66.7 ft/s), descarga 2,500-3,500 fpm.', en:'Water: <8 ft/s supply, <10 ft/s return (ASHRAE 2021 F22). Refrig: vertical suction 1,000-4,000 fpm (≈16.7-66.7 ft/s), discharge 2,500-3,500 fpm.' }
    },
    render: function(state){
      var gpm = num(pick(state,'pipeVelocity','gpm',20),20);
      var dia = num(pick(state,'pipeVelocity','dia',1.0),1.0);  // in
      var fluid = pick(state,'pipeVelocity','fluid','water');
      if (dia<=0) dia=1.0;
      // V (ft/s) = 0.4085 · GPM / d²(in)
      var vFtS = 0.4085 * gpm / (dia*dia);
      var vFpm = vFtS*60;
      var band, bandStyle, limit;
      if (fluid==='water-supply'){
        limit='<8 ft/s supply';
        if (vFtS<=8){ band='OK supply'; bandStyle=NAVY_WARN_OK; } else { band='ALTO · erosión'; bandStyle=NAVY_WARN_R; }
      } else if (fluid==='water-return'){
        limit='<10 ft/s return';
        if (vFtS<=10){ band='OK return'; bandStyle=NAVY_WARN_OK; } else { band='ALTO · ruido'; bandStyle=NAVY_WARN_R; }
      } else if (fluid==='suction'){
        limit='15-20 ft/s suction';
        if (vFtS>=15 && vFtS<=20){ band='OK suction'; bandStyle=NAVY_WARN_OK; }
        else if (vFtS<15){ band='BAJO · oil return'; bandStyle=NAVY_WARN_B; }
        else { band='ALTO · drop excesivo'; bandStyle=NAVY_WARN_R; }
      } else { // discharge (fpm band)
        limit='800-1000 fpm discharge';
        if (vFpm>=800 && vFpm<=1000){ band='OK disch'; bandStyle=NAVY_WARN_OK; }
        else if (vFpm<800){ band='BAJO · oil hang'; bandStyle=NAVY_WARN_B; }
        else { band='ALTO · ruido'; bandStyle=NAVY_WARN_R; }
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('pipeVelocity','gpm','mp_pv_gpm','GPM','GPM',gpm,'0.5')+
          inputRow('pipeVelocity','dia','mp_pv_dia','Diámetro interno','in',dia,'0.125')+
          selectRow('pipeVelocity','fluid','mp_pv_fluid','Fluido',[['water-supply','Agua supply'],['water-return','Agua return'],['suction','Refrig. succión'],['discharge','Refrig. descarga']], fluid)+
        '</div>'+
        navyCard('mp_pv_res','Velocidad', fmt(vFtS,2), 'ft/s',
          'V = 0.4085·GPM / d² · d = '+fmt(dia,3)+'" &nbsp;<span style="'+bandStyle+'">'+esc(band)+'</span>',
          [['ft/s', fmt(vFtS,2)],
           ['ft/min', fmt(vFpm,0)],
           ['m/s', fmt(vFtS*0.3048,2)],
           ['Límite', esc(limit)]])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> Velocidades recomendadas · Recommended velocities</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Servicio · Service</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Velocidad</th>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Razón · Reason</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Agua supply (chilled/hot)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">4-8 ft/s</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Erosión, ruido</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Agua return</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">4-10 ft/s</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">ASHRAE Fund. 22</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Agua condensada</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">3-5 ft/s</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Drenaje por gravedad</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Refrig. succión horizontal</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">700-4000 fpm</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Oil return</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Refrig. succión vertical ↑</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">≥1500 fpm</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Oil carry-up</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Refrig. descarga</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">800-3500 fpm</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Ruido, drop</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Refrig. líquida</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">100-300 fpm</td><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Flash gas prevention</td></tr>'+
              '<tr><td style="padding:5px 8px;">Gas natural LP</td><td style="padding:5px 8px;text-align:right;font-weight:700;">≤25 ft/s</td><td style="padding:5px 8px;">Noise + erosion (NFPA 54)</td></tr>'+
            '</tbody></table>'+
          '<div style="margin-top:10px;font-size:12px;color:#111;"><strong>Nota:</strong> En refrigeración las velocidades se miden en fpm (ACHRE Std 34). La fórmula V(ft/s) = 0.4085·GPM/d² solo aplica a líquidos — para refrigerante en fase vapor usa ṁ/(ρ·A).</div>'+
        '</div>'+
        exampleTip('mp_pv_case','mp_pv_tip');
    }
  };

  // ─────────────────────────── ductEquivalent ───────────────────────────
  window.MP_CALCS['ductEquivalent'] = {
    i18n: {
      mp_de_title: { es:'Ducto Equivalente Round', en:'Equivalent Round Duct' },
      mp_de_a:     { es:'Lado a',                  en:'Side a' },
      mp_de_b:     { es:'Lado b',                  en:'Side b' },
      mp_de_res:   { es:'Diámetro equivalente',    en:'Equivalent diameter' },
      mp_de_area:  { es:'Área rectangular',        en:'Rectangular area' },
      mp_de_perim: { es:'Perímetro',               en:'Perimeter' },
      mp_de_case:  { es:'Un 20" × 8" rectangular tiene De = 1.3·(160)^0.625/(28)^0.25 ≈ 13.9" round — usa 14" pegado a la gráfica ASHRAE 35B.', en:'A 20" × 8" rectangular has De = 1.3·(160)^0.625/(28)^0.25 ≈ 13.9" round — use 14" per ASHRAE chart 35B.' },
      mp_de_tip:   { es:'De solo es válido en fricción equivalente — NO velocidad equivalente. Para CFM reales usa área real del ducto rectangular.', en:'De is only valid for equal friction — NOT equal velocity. For actual CFM use the real rectangular area.' }
    },
    render: function(state){
      var a = num(pick(state,'ductEquivalent','a',20),20);
      var b = num(pick(state,'ductEquivalent','b',8),8);
      if (a<=0) a=20; if (b<=0) b=8;
      var De = 1.3 * Math.pow(a*b, 0.625) / Math.pow(a+b, 0.25);
      var area = a*b;  // in²
      var perim = 2*(a+b);
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('ductEquivalent','a','mp_de_a','Lado a','in',a,'0.5')+
          inputRow('ductEquivalent','b','mp_de_b','Lado b','in',b,'0.5')+
        '</div>'+
        navyCard('mp_de_res','Diámetro equivalente', fmt(De,2), 'in round',
          'De = 1.3·(a·b)^0.625 / (a+b)^0.25 · ASHRAE Fund. 35B',
          [[t('mp_de_area','Área rect.'), fmt(area,0)+' in² · '+fmt(area/144,3)+' ft²'],
           [t('mp_de_perim','Perímetro'), fmt(perim,1)+' in'],
           ['Área round', fmt(Math.PI*De*De/4,0)+' in²'],
           ['Aspect ratio', fmt(a/b,2)+':1']])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> Rectangular → Round · ASHRAE Fund. 35B</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Rectangular (a × b)</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">De (round)</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Aspect</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">8 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">8.7"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">1:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">10 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">9.8"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">1.25:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">12 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10.7"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">1.5:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">14 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">11.5"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">1.75:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">16 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">12.2"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">2:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">20 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">13.9"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">2.5:1</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">24 × 8</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15.3"</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;">3:1</td></tr>'+
              '<tr><td style="padding:5px 8px;">30 × 10</td><td style="padding:5px 8px;text-align:right;font-weight:700;">18.6"</td><td style="padding:5px 8px;text-align:right;">3:1</td></tr>'+
            '</tbody></table>'+
          '<div style="margin-top:10px;font-size:12px;color:#111;"><strong>SMACNA HVAC Duct Construction Standards</strong> recomienda aspect máx 4:1 en trunks y 2:1 en branches para evitar friction penalty.</div>'+
        '</div>'+
        exampleTip('mp_de_case','mp_de_tip');
    }
  };

  // ─────────────────────────── ductVelocityPressure ───────────────────────────
  window.MP_CALCS['ductVelocityPressure'] = {
    i18n: {
      mp_dvp_title:{ es:'Velocity Pressure ↔ FPM', en:'Velocity Pressure ↔ FPM' },
      mp_dvp_mode: { es:'Modo',                    en:'Mode' },
      mp_dvp_vp:   { es:'VP (in wc)',              en:'VP (in wc)' },
      mp_dvp_v:    { es:'Velocidad',               en:'Velocity' },
      mp_dvp_res:  { es:'Resultado',               en:'Result' },
      mp_dvp_case: { es:'Pitot lee 0.25 in wc en un supply plenum: V = 4005·√0.25 = 2,002.5 fpm — arriba de 1,800 fpm ya estás en ruido de main trunk.', en:'Pitot reads 0.25 in wc in a supply plenum: V = 4005·√0.25 = 2,002.5 fpm — above 1,800 fpm you are in main-trunk noise range.' },
      mp_dvp_tip:  { es:'La fórmula 4005·√VP asume aire estándar (0.075 lb/ft³, 70°F, nivel del mar). En altura corrige ×√(ρstd/ρactual).', en:'The 4005·√VP formula assumes standard air (0.075 lb/ft³, 70°F, sea level). At altitude correct by ×√(ρstd/ρactual).' }
    },
    render: function(state){
      var mode = pick(state,'ductVelocityPressure','mode','vp2v');
      var vp = num(pick(state,'ductVelocityPressure','vp',0.25),0.25);
      var v  = num(pick(state,'ductVelocityPressure','v',2000),2000);
      var main, unit, desc;
      if (mode==='vp2v'){
        if (vp<0) vp=0;
        var outV = 4005*Math.sqrt(vp);
        main = fmt(outV,0); unit='fpm';
        desc = 'V = 4005·√VP = 4005·√'+fmt(vp,3)+' = '+fmt(outV,0)+' fpm';
      } else {
        if (v<0) v=0;
        var outVP = (v/4005)*(v/4005);
        main = fmt(outVP,3); unit='in wc';
        desc = 'VP = (V/4005)² = ('+fmt(v,0)+'/4005)² = '+fmt(outVP,3)+' in wc';
      }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('ductVelocityPressure','mode','mp_dvp_mode','Modo',[['vp2v','VP → Velocidad'],['v2vp','Velocidad → VP']], mode)+
          (mode==='vp2v' ? inputRow('ductVelocityPressure','vp','mp_dvp_vp','VP','in wc',vp,'0.01') : inputRow('ductVelocityPressure','v','mp_dvp_v','Velocidad','fpm',v,'50'))+
        '</div>'+
        navyCard('mp_dvp_res','Resultado', main, unit, desc,
          [['0.05 in wc', fmt(4005*Math.sqrt(0.05),0)+' fpm'],
           ['0.10 in wc', fmt(4005*Math.sqrt(0.10),0)+' fpm'],
           ['0.25 in wc', fmt(4005*Math.sqrt(0.25),0)+' fpm'],
           ['0.50 in wc', fmt(4005*Math.sqrt(0.50),0)+' fpm']])+
        exampleTip('mp_dvp_case','mp_dvp_tip');
    }
  };

  // ─────────────────────────── wasteFactor ───────────────────────────
  var WASTE_DEFAULT = {
    drywall:    { pct:10, label:{es:'Drywall / paneles',     en:'Drywall / panels'} },
    insulation: { pct:15, label:{es:'Aislamiento',           en:'Insulation'} },
    lumber:     { pct:7,  label:{es:'Madera (lumber)',       en:'Lumber'} },
    refrigTube: { pct:5,  label:{es:'Tubería refrigerante',  en:'Refrigerant tubing'} },
    duct:       { pct:10, label:{es:'Ducto / sheet metal',   en:'Duct / sheet metal'} },
    wire:       { pct:8,  label:{es:'Cable / wire',          en:'Wire / cable'} },
    conduit:    { pct:10, label:{es:'Conduit EMT/PVC',       en:'EMT/PVC conduit'} },
    custom:     { pct:10, label:{es:'Personalizado',         en:'Custom'} }
  };
  window.MP_CALCS['wasteFactor'] = {
    i18n: {
      mp_wf_title: { es:'Waste Factor',     en:'Waste Factor' },
      mp_wf_mat:   { es:'Material',         en:'Material' },
      mp_wf_qty:   { es:'Cantidad net',     en:'Net quantity' },
      mp_wf_unit:  { es:'Unidad',           en:'Unit' },
      mp_wf_pct:   { es:'% desperdicio',    en:'Waste %' },
      mp_wf_res:   { es:'Cantidad a ordenar', en:'Quantity to order' },
      mp_wf_case:  { es:'Run de cobre 3/8" de 45 ft reales × 1.05 (5% waste) = 47.25 ft → pide rollo de 50 ft. Sin margen, un corte mal hecho te detiene el trabajo.', en:'45 ft real 3/8" copper run × 1.05 (5% waste) = 47.25 ft → order a 50-ft roll. No margin and one bad cut stops the job.' },
      mp_wf_tip:   { es:'Remodelación y cortes complicados: +5% extra sobre el default. Trabajo nuevo lineal: -2% está bien. Nunca bajes del 3%.', en:'Remodel and complex cuts: add 5% over the default. Clean new linear runs: -2% is fine. Never go below 3%.' }
    },
    render: function(state){
      var mat = pick(state,'wasteFactor','mat','refrigTube');
      var qty = num(pick(state,'wasteFactor','qty',45),45);
      var unit = pick(state,'wasteFactor','unit','lf');
      var cfg = WASTE_DEFAULT[mat] || WASTE_DEFAULT.custom;
      var pct = num(pick(state,'wasteFactor','pct',cfg.pct),cfg.pct);
      var order = qty * (1 + pct/100);
      var opts=[]; for (var k in WASTE_DEFAULT){ if (WASTE_DEFAULT.hasOwnProperty(k)) opts.push([k, WASTE_DEFAULT[k].label.es+' / '+WASTE_DEFAULT[k].label.en+' ('+WASTE_DEFAULT[k].pct+'%)']); }
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          selectRow('wasteFactor','mat','mp_wf_mat','Material', opts, mat)+
          inputRow('wasteFactor','qty','mp_wf_qty','Cantidad','',qty,'0.1')+
          selectRow('wasteFactor','unit','mp_wf_unit','Unidad',[['lf','LF · ft lineal'],['sf','SF · ft²'],['cf','CF · ft³'],['ea','EA · cada uno']], unit)+
          inputRow('wasteFactor','pct','mp_wf_pct','% waste','%',pct,'1')+
        '</div>'+
        navyCard('mp_wf_res','Cantidad a ordenar', fmt(order,1), esc(unit),
          fmt(qty,1)+' × (1 + '+fmt(pct,1)+'%) = '+fmt(order,1)+' '+esc(unit),
          [['Drywall', '10%'],
           ['Insulation','15%'],
           ['Lumber','7%'],
           ['Refrig tubing','5%']])+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> Waste % · Recomendaciones por material</div>'+
          '<table style="width:100%;font-size:12.5px;color:#111;border-collapse:collapse;">'+
            '<thead><tr>'+
              '<th style="padding:6px 8px;text-align:left;border-bottom:2px solid #111;">Material</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Nuevo · New</th>'+
              '<th style="padding:6px 8px;text-align:right;border-bottom:2px solid #111;">Remodel</th>'+
            '</tr></thead><tbody>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Drywall</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Insulation batts</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">20%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Spray foam</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">8%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">12%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Lumber (framing)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">7%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Plywood / OSB</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Refrigerant tubing</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">5%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">8%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Flex duct</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Sheet metal duct</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">12%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Wire THHN</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">8%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">12%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">EMT conduit</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">10%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">15%</td></tr>'+
              '<tr><td style="padding:5px 8px;border-bottom:1px solid #E7E5E4;">Concrete (CF)</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">5%</td><td style="padding:5px 8px;text-align:right;border-bottom:1px solid #E7E5E4;font-weight:700;">8%</td></tr>'+
              '<tr><td style="padding:5px 8px;">Mortar / grout</td><td style="padding:5px 8px;text-align:right;font-weight:700;">15%</td><td style="padding:5px 8px;text-align:right;font-weight:700;">20%</td></tr>'+
            '</tbody></table>'+
          '<div style="margin-top:10px;font-size:12px;color:#111;"><strong>Fuente:</strong> RSMeans · NCMA · SMACNA Estimating Manual. Añade +5% si el corte requiere ángulos irregulares o si trabajas con aprendices nuevos.</div>'+
        '</div>'+
        exampleTip('mp_wf_case','mp_wf_tip');
    }
  };

  // ─────────────────────────── stairsCalc ───────────────────────────
  window.MP_CALCS['stairsCalc'] = {
    i18n: {
      mp_sc_title: { es:'Escaleras (IRC 2018)', en:'Stairs (IRC 2018)' },
      mp_sc_rise:  { es:'Altura total (rise)',  en:'Total rise' },
      mp_sc_run:   { es:'Run por peldaño',      en:'Tread run' },
      mp_sc_risers:{ es:'# de risers',          en:'# of risers' },
      mp_sc_res:   { es:'Rise por peldaño',     en:'Rise per step' },
      mp_sc_ok:    { es:'Cumple IRC R311.7',    en:'IRC R311.7 compliant' },
      mp_sc_case:  { es:'Sótano con 108" de rise: 108/14 = 7.71" por peldaño (OK, ≤7.75), con run 10" → tramo 130" horizontal.', en:'Basement with 108" rise: 108/14 = 7.71" per step (OK, ≤7.75), with 10" run → 130" horizontal run.' },
      mp_sc_tip:   { es:'IRC R311.7.5: rise máx 7¾", run mín 10", nariz (nosing) ¾"–1¼". Handrail 34–38" desde nose. Variación peldaño-a-peldaño ≤⅜".', en:'IRC R311.7.5: max 7¾" rise, min 10" run, nosing ¾"–1¼". Handrail 34–38" from nose. Step-to-step variation ≤⅜".' }
    },
    render: function(state){
      var rise = num(pick(state,'stairsCalc','rise',108),108);
      var run  = num(pick(state,'stairsCalc','run',10),10);
      var risers = Math.max(1, Math.floor(num(pick(state,'stairsCalc','risers',14),14)));
      var perRise = rise/risers;
      var treads = risers-1;
      var horiz = treads*run;
      var angle = Math.atan2(perRise, run)*DEG;
      var okRise = perRise<=7.75;
      var okRun  = run>=10;
      var status = (okRise&&okRun) ? 'CUMPLE IRC' : 'FUERA IRC';
      var statusStyle = (okRise&&okRun) ? NAVY_WARN_OK : NAVY_WARN_R;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('stairsCalc','rise','mp_sc_rise','Rise total','in',rise,'0.25')+
          inputRow('stairsCalc','risers','mp_sc_risers','# risers','',risers,'1')+
          inputRow('stairsCalc','run','mp_sc_run','Run','in',run,'0.25')+
        '</div>'+
        navyCard('mp_sc_res','Rise por peldaño', fmt(perRise,3), 'in',
          risers+' risers · '+treads+' treads · tramo horizontal = '+fmt(horiz,1)+'" · '+fmt(angle,1)+'° &nbsp;<span style="'+statusStyle+'">'+esc(status)+'</span>',
          [['Rise máx IRC', '7.75" &nbsp;'+(okRise?'OK':'X')],
           ['Run mín IRC',  '10" &nbsp;'+(okRun?'OK':'X')],
           ['Handrail',     '34–38" (R311.7.8)'],
           ['Ángulo rampa', fmt(angle,1)+'°']])+
        exampleTip('mp_sc_case','mp_sc_tip');
    }
  };

  // ─────────────────────────── ladderAngle ───────────────────────────
  window.MP_CALCS['ladderAngle'] = {
    i18n: {
      mp_la_title: { es:'Escalera · Regla 4:1',  en:'Ladder · 4:1 Rule' },
      mp_la_len:   { es:'Largo escalera',        en:'Ladder length' },
      mp_la_work:  { es:'Altura de trabajo',     en:'Working height' },
      mp_la_res:   { es:'Distancia del muro',    en:'Distance from wall' },
      mp_la_ang:   { es:'Ángulo',                en:'Angle' },
      mp_la_case:  { es:'Escalera 24 ft extendida: base a 24/4 = 6 ft del muro, altura de trabajo útil ~21 ft (top 3 ft reservados OSHA 1926.1053).', en:'24-ft extended ladder: base 24/4 = 6 ft from wall, usable working height ~21 ft (top 3 ft reserved per OSHA 1926.1053).' },
      mp_la_tip:   { es:'OSHA: nunca parar en los 3 peldaños superiores. El ángulo ideal es 75.5° (4:1). Menos de 65° se desliza, más de 80° cae hacia atrás.', en:'OSHA: never stand on the top 3 rungs. Ideal angle is 75.5° (4:1). Below 65° slides out, above 80° tips backward.' }
    },
    render: function(state){
      var len = num(pick(state,'ladderAngle','len',24),24);
      var work = num(pick(state,'ladderAngle','work',0),0);
      if (len<=0) len=24;
      var base = len/4;  // 4:1 rule
      // If user puts working height, recompute base accordingly
      var usableH = Math.max(0, len - 3); // top-3-rung rule
      var heightAtBase = Math.sqrt(Math.max(0, len*len - base*base));
      var angle = Math.atan2(heightAtBase, base) * DEG;
      var okAngle = angle>=70 && angle<=78;
      var status = okAngle ? 'Ángulo OK' : 'Re-ajusta';
      var statusStyle = okAngle ? NAVY_WARN_OK : NAVY_WARN_R;
      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">&#9670;</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          inputRow('ladderAngle','len','mp_la_len','Largo escalera','ft',len,'1')+
          inputRow('ladderAngle','work','mp_la_work','Altura de trabajo','ft',work,'0.5')+
        '</div>'+
        navyCard('mp_la_res','Distancia del muro (base)', fmt(base,2), 'ft',
          'Regla 4:1 → base = largo/4 · ángulo = '+fmt(angle,1)+'° &nbsp;<span style="'+statusStyle+'">'+esc(status)+'</span>',
          [[t('mp_la_ang','Ángulo'), fmt(angle,1)+'° · ideal 75.5°'],
           ['Altura en muro', fmt(heightAtBase,2)+' ft'],
           ['Altura útil', fmt(usableH,1)+' ft (top-3-rung)'],
           ['OSHA ref', '1926.1053(b)(5)(i)']])+
        exampleTip('mp_la_case','mp_la_tip');
    }
  };

})();
