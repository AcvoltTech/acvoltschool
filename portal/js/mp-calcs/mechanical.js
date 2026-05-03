// Maestro Pro · Mechanical Code calculators (IMC / UMC / IFGC / NFPA 54)
// 10 tools — CA 2026 references, bilingual ES/EN, offline
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
  function lang(){ var H=h(); return (typeof H.currentLang==='function'?H.currentLang():H.currentLang)||'es'; }
  function pick(obj){ var L=lang(); return obj && (obj[L]||obj.es||obj.en||'') || ''; }

  // Premium dark-navy result card w/ gold accents
  var CARD = 'background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #C9A961;border-radius:12px;padding:18px;color:#FFFFFF;margin:12px 0;box-shadow:0 6px 18px rgba(0,0,0,0.25);';
  var GOLD = '#C9A961';
  var WHITE = '#FFFFFF';
  var LIGHT = '#E5E7EB';

  function goldCard(title, mainVal, mainUnit, rows){
    var html = '<div style="'+CARD+'">'+
      '<div style="font-size:13px;color:'+GOLD+';font-weight:800;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px;">'+esc(title)+'</div>'+
      '<div style="font-size:34px;font-weight:900;color:'+GOLD+';line-height:1.1;margin-bottom:10px;">'+esc(mainVal)+'<span style="font-size:16px;color:'+WHITE+';font-weight:600;margin-left:6px;">'+esc(mainUnit)+'</span></div>';
    if (rows && rows.length){
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">';
      for (var i=0;i<rows.length;i++){
        html += '<div style="background:#0F1830;border-radius:7px;padding:8px 10px;">'+
          '<div style="font-size:11px;color:'+LIGHT+';font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">'+esc(rows[i][0])+'</div>'+
          '<div style="font-size:15px;color:'+WHITE+';font-weight:700;margin-top:2px;">'+esc(rows[i][1])+'</div>'+
        '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function shell(id,tk,sk,ic,body){
    var H = h();
    if (H.renderCalcShell) return H.renderCalcShell(id,tk,sk,ic,body);
    return '<div class="mp-calc">'+body+'</div>';
  }

  function inputRow(label, unit, dataKey, value, minV, stepV){
    return '<div class="mp-ig">'+
      '<div class="mp-lbl"><span>'+esc(label)+'</span><span class="mp-unit">'+esc(unit)+'</span></div>'+
      '<input type="number" class="mp-in" data-in="'+esc(dataKey)+'" value="'+esc(String(value))+'" min="'+esc(String(minV))+'" step="'+esc(String(stepV))+'" />'+
    '</div>';
  }

  function selectRow(label, unit, dataKey, value, opts){
    var o = '';
    for (var i=0;i<opts.length;i++){
      o += '<option value="'+esc(opts[i][0])+'"'+(String(value)===String(opts[i][0])?' selected':'')+'>'+esc(opts[i][1])+'</option>';
    }
    return '<div class="mp-ig">'+
      '<div class="mp-lbl"><span>'+esc(label)+'</span><span class="mp-unit">'+esc(unit)+'</span></div>'+
      '<select class="mp-in" data-in="'+esc(dataKey)+'">'+o+'</select>'+
    '</div>';
  }

  // ═══════════════════════════════════════════════════════════════
  // TOOL 1: Duct Sizing — Equal Friction (ACCA Manual D / SMACNA)
  // ═══════════════════════════════════════════════════════════════
  // Round duct diameter from CFM @ friction rate via D-Harris approx:
  // D = (CFM^0.3802 * 0.109136) / ((SP/100)^0.19)  [in], target 0.08–0.10 in wc/100 ft
  function roundDuctDia(cfm, fr100){
    if (cfm<=0 || fr100<=0) return 0;
    return 0.109136 * Math.pow(cfm,0.3802) / Math.pow(fr100,0.19);
  }
  // Equivalent rectangular = 1.30 * (a*b)^0.625 / (a+b)^0.25
  function rectEquiv(a,b){ if(a<=0||b<=0) return 0; return 1.30 * Math.pow(a*b,0.625) / Math.pow(a+b,0.25); }
  function velocityFPM(cfm, diaIn){ if(diaIn<=0) return 0; var aFt = Math.PI*Math.pow(diaIn/12,2)/4; return cfm/aFt; }

  window.MP_CALCS['ductSizeEF'] = {
    i18n: {
      mp_de_title:{ es:'Sizing de ducto · Equal Friction', en:'Duct sizing · Equal Friction' },
      mp_de_sub:  { es:'ACCA Manual D · SMACNA · 0.08–0.10"wc/100ft', en:'ACCA Manual D · SMACNA · 0.08–0.10"wc/100ft' },
      mp_de_cfm:  { es:'CFM de diseño', en:'Design CFM' },
      mp_de_fr:   { es:'Fricción', en:'Friction rate' },
      mp_de_shape:{ es:'Forma', en:'Shape' },
      mp_de_round:{ es:'Redondo', en:'Round' },
      mp_de_rect: { es:'Rectangular', en:'Rectangular' },
      mp_de_width:{ es:'Ancho preferido', en:'Preferred width' },
      mp_de_dia:  { es:'Diámetro redondo', en:'Round diameter' },
      mp_de_rectv:{ es:'Rect equivalente', en:'Equivalent rect' },
      mp_de_vel:  { es:'Velocidad', en:'Velocity' },
      mp_de_note: { es:'Supply troncal: 700–900 FPM residencial, ≤1200 FPM comercial. Ramales: 600 FPM res / 800 FPM com. Returns: –100 FPM. Velocidad alta = ruido + TESP. NFPA 90B permite flex ≤14 ft con mínimo pandeo.', en:'Trunk supply: 700–900 FPM res, ≤1200 FPM comm. Branches: 600 FPM res / 800 FPM comm. Returns: –100 FPM. High velocity = noise + TESP. NFPA 90B allows flex ≤14 ft with minimal sag.' },
      mp_de_case: { es:'Sistema 3-ton 1200 CFM a 0.08"wc/100 ft: D ≈ 14.2" redondo. Rect equivalente 12×14 (AR 1.17) mantiene velocidad 880 FPM. Troncal principal bajo ACCA Manual D — ver apéndice 3.', en:'3-ton 1200 CFM at 0.08"wc/100 ft: D ≈ 14.2" round. Equivalent rect 12×14 (AR 1.17) holds velocity at 880 FPM. Main trunk per ACCA Manual D — see appendix 3.' },
      mp_de_tip:  { es:'Si la velocidad > 900 FPM en residencial, el cliente va a escuchar el sistema en la cama. Sube una talla — cuesta $40 de metal y evita callback por "ruido".', en:'If velocity > 900 FPM in residential, the homeowner will hear the system from bed. Upsize one — costs $40 of metal and avoids a "noise" callback.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ductSizeEF) || {};
      var cfm = num(s.cfm, 400);
      var fr = num(s.fr, 0.08);
      var shape = s.shape || 'round';
      var width = num(s.width, 10);
      var dia = roundDuctDia(cfm, fr);
      var diaRound = Math.ceil(dia*2)/2; // nearest 0.5"
      var height = 0;
      if (shape==='rect' && width>0){
        // iterate height for equivalent
        for (var hh=4; hh<=36; hh+=0.5){
          if (rectEquiv(width, hh) >= dia){ height = hh; break; }
        }
      }
      var vel = velocityFPM(cfm, dia);

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_de_cfm','CFM'), 'CFM', 'ductSizeEF.cfm', cfm, 10, 10)+
        inputRow(t('mp_de_fr','Fricción'), 'inwc/100ft', 'ductSizeEF.fr', fr, 0.01, 0.01)+
        selectRow(t('mp_de_shape','Forma'), 'shape', 'ductSizeEF.shape', shape, [
          ['round', t('mp_de_round','Redondo')],
          ['rect', t('mp_de_rect','Rectangular')]
        ])+
        (shape==='rect' ? inputRow(t('mp_de_width','Ancho'), 'in', 'ductSizeEF.width', width, 4, 1) : '')+
      '</div>'+
      goldCard(
        t('mp_de_dia','Diámetro redondo'),
        fmt(diaRound,1), 'in',
        [
          [t('mp_de_rectv','Rect equiv'), shape==='rect' && height>0 ? (fmt(width,0)+' × '+fmt(height,1)+' in') : '—'],
          [t('mp_de_vel','Velocidad'), fmt(vel,0)+' FPM'],
          ['Δp', fmt(fr,2)+' "wc/100ft'],
          ['CFM', fmt(cfm,0)]
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> ACCA Manual D · SMACNA</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_de_note',''))+'</div>'+
      '</div>'+
      exampleTip('mp_de_case','mp_de_tip');
      return shell('ductSizeEF','mp_de_title','mp_de_sub','🌀', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 2: Gas Pipe Sizing — IFGC 402.4
  // Table 402.4(2): Schedule 40 black iron, 0.5" wc drop, natural gas (1030 BTU/ft³)
  // Capacity in CFH by pipe size & length
  // ═══════════════════════════════════════════════════════════════
  var SCH40_NG_CFH = {
    // length ft: { "1/2":c, "3/4":c, "1":c, "1-1/4":c, "1-1/2":c, "2":c, "2-1/2":c, "3":c, "4":c }
    10:  { '1/2':172, '3/4':360, '1':678, '1-1/4':1390, '1-1/2':2090, '2':4020, '2-1/2':6400, '3':11300, '4':23100 },
    20:  { '1/2':118, '3/4':247, '1':466, '1-1/4':957,  '1-1/2':1430, '2':2760, '2-1/2':4410, '3':7780,  '4':15900 },
    30:  { '1/2': 95, '3/4':199, '1':374, '1-1/4':768,  '1-1/2':1150, '2':2220, '2-1/2':3540, '3':6250,  '4':12800 },
    40:  { '1/2': 81, '3/4':170, '1':320, '1-1/4':657,  '1-1/2':985,  '2':1900, '2-1/2':3030, '3':5350,  '4':10900 },
    50:  { '1/2': 72, '3/4':151, '1':284, '1-1/4':583,  '1-1/2':873,  '2':1680, '2-1/2':2680, '3':4740,  '4': 9660 },
    60:  { '1/2': 65, '3/4':137, '1':257, '1-1/4':528,  '1-1/2':791,  '2':1520, '2-1/2':2430, '3':4290,  '4': 8760 },
    80:  { '1/2': 56, '3/4':117, '1':220, '1-1/4':452,  '1-1/2':677,  '2':1300, '2-1/2':2080, '3':3670,  '4': 7490 },
    100: { '1/2': 50, '3/4':104, '1':195, '1-1/4':400,  '1-1/2':600,  '2':1160, '2-1/2':1840, '3':3260,  '4': 6640 },
    125: { '1/2': 44, '3/4': 92, '1':173, '1-1/4':355,  '1-1/2':532,  '2':1020, '2-1/2':1630, '3':2890,  '4': 5890 },
    150: { '1/2': 40, '3/4': 83, '1':157, '1-1/4':322,  '1-1/2':482,  '2':928,  '2-1/2':1480, '3':2610,  '4': 5330 },
    200: { '1/2': 34, '3/4': 71, '1':134, '1-1/4':275,  '1-1/2':412,  '2':794,  '2-1/2':1260, '3':2240,  '4': 4560 }
  };
  // CSST (IFGC 402.4 manufacturer tables, 0.5" drop, representative values)
  var CSST_CFH = {
    10:  { '3/8':80,  '1/2':158, '3/4':395, '1':795, '1-1/4':1575, '1-1/2':2360, '2':3920 },
    25:  { '3/8':50,  '1/2':100, '3/4':250, '1':504, '1-1/4':995,  '1-1/2':1495, '2':2480 },
    50:  { '3/8':35,  '1/2': 71, '3/4':178, '1':357, '1-1/4':705,  '1-1/2':1060, '2':1760 },
    75:  { '3/8':29,  '1/2': 58, '3/4':145, '1':291, '1-1/4':575,  '1-1/2':863,  '2':1435 },
    100: { '3/8':25,  '1/2': 50, '3/4':125, '1':252, '1-1/4':497,  '1-1/2':747,  '2':1240 },
    150: { '3/8':20,  '1/2': 41, '3/4':102, '1':206, '1-1/4':406,  '1-1/2':610,  '2':1010 },
    200: { '3/8':17,  '1/2': 35, '3/4': 88, '1':178, '1-1/4':351,  '1-1/2':527,  '2':876  }
  };

  function lookupCapacity(table, length){
    var keys = Object.keys(table).map(function(k){return +k;}).sort(function(a,b){return a-b;});
    var chosen = keys[keys.length-1];
    for (var i=0;i<keys.length;i++){
      if (length <= keys[i]){ chosen = keys[i]; break; }
    }
    return { row: table[chosen], lenRow: chosen };
  }

  function pickPipeSize(row, required){
    var order = ['3/8','1/2','3/4','1','1-1/4','1-1/2','2','2-1/2','3','4'];
    for (var i=0;i<order.length;i++){
      var k = order[i];
      if (row[k] != null && row[k] >= required) return { size:k, capacity:row[k] };
    }
    return { size: order[order.length-1], capacity: row[order[order.length-1]]||0 };
  }

  window.MP_CALCS['gasPipeSize'] = {
    i18n: {
      mp_gp_title:{ es:'Gas Pipe Sizing · IFGC 402.4', en:'Gas Pipe Sizing · IFGC 402.4' },
      mp_gp_sub:  { es:'Sch 40 & CSST · NG 0.5"wc drop', en:'Sch 40 & CSST · NG 0.5"wc drop' },
      mp_gp_load: { es:'Carga total (BTU/h)', en:'Total load (BTU/h)' },
      mp_gp_len:  { es:'Longitud al aparato más lejano', en:'Length to farthest appliance' },
      mp_gp_mat:  { es:'Material', en:'Material' },
      mp_gp_sch40:{ es:'Tubo Sch 40 (acero negro)', en:'Sch 40 (black iron)' },
      mp_gp_csst: { es:'CSST (flex)', en:'CSST (flex)' },
      mp_gp_size: { es:'Diámetro mínimo', en:'Minimum size' },
      mp_gp_cfh:  { es:'CFH requerido', en:'Required CFH' },
      mp_gp_cap:  { es:'Capacidad tabla', en:'Table capacity' },
      mp_gp_note: { es:'Tabla IFGC 402.4(2) Sch 40 NG ·1030 BTU/ft³. CSST debe seguir tabla del fabricante (Gastite, TracPipe). Siempre incluye tee + elbows en longitud equivalente: 90° ell = 2 ft, tee run = 2 ft, tee branch = 4 ft (Sch 40).', en:'Table IFGC 402.4(2) Sch 40 NG · 1030 BTU/ft³. CSST must follow the manufacturer table (Gastite, TracPipe). Always add tees + elbows as equivalent length: 90° ell = 2 ft, tee run = 2 ft, tee branch = 4 ft (Sch 40).' },
      mp_gp_case: { es:'Casa CA 2026: furnace 80k BTU + stove 65k + WH 40k + dryer 30k = 215k BTU/h ÷ 1030 = 209 CFH. Longitud 55 ft → tabla 60 ft: 1" Sch 40 (257 CFH) ✓. Con CSST → 1" (291 CFH @ 25 ft derated).', en:'CA 2026 home: 80k furnace + 65k stove + 40k WH + 30k dryer = 215k BTU/h ÷ 1030 = 209 CFH. Length 55 ft → use 60 ft row: 1" Sch 40 (257 CFH) ✓. With CSST → 1" (291 CFH @ 25 ft derated).' },
      mp_gp_tip:  { es:'Nunca olvides el FUTURO — el cliente va a meter fire pit o grill de exterior. Sube al siguiente tamaño. Y el regulador 2 lb requiere tabla aparte (402.4(32)) — no confundir con 0.5"wc system.', en:'Never forget the FUTURE — the homeowner will add a fire pit or outdoor grill. Upsize one. And 2-psi regulator systems use a separate table (402.4(32)) — don\'t confuse with 0.5"wc system.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.gasPipeSize) || {};
      var btu = num(s.btu, 200000);
      var len = num(s.len, 50);
      var mat = s.mat || 'sch40';
      var cfhRequired = btu / 1030;
      var table = (mat==='csst') ? CSST_CFH : SCH40_NG_CFH;
      var lu = lookupCapacity(table, len);
      var pick = pickPipeSize(lu.row, cfhRequired);

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_gp_load','BTU/h'), 'BTU/h', 'gasPipeSize.btu', btu, 1000, 1000)+
        inputRow(t('mp_gp_len','Longitud'), 'ft', 'gasPipeSize.len', len, 1, 5)+
        selectRow(t('mp_gp_mat','Material'), 'mat', 'gasPipeSize.mat', mat, [
          ['sch40', t('mp_gp_sch40','Sch 40')],
          ['csst',  t('mp_gp_csst','CSST')]
        ])+
      '</div>'+
      goldCard(
        t('mp_gp_size','Diámetro mínimo'),
        pick.size, 'in',
        [
          [t('mp_gp_cfh','CFH req'), fmt(cfhRequired,0)+' CFH'],
          [t('mp_gp_cap','Cap tabla'), fmt(pick.capacity,0)+' CFH'],
          ['Longitud', lu.lenRow+' ft'],
          ['Material', mat==='csst'?'CSST':'Sch 40']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> IFGC 402.4 · NFPA 54</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_gp_note',''))+'</div>'+
        '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Equiv length:</strong> 90° ell = 2 ft · tee run = 2 ft · tee branch = 4 ft · gate valve = 0.5 ft (Sch 40).</div>'+
      '</div>'+
      exampleTip('mp_gp_case','mp_gp_tip');
      return shell('gasPipeSize','mp_gp_title','mp_gp_sub','🔥', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 3: Combustion Air — IFGC 304 / NFPA 54 §9
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['combAir'] = {
    i18n: {
      mp_ca_title:{ es:'Aire de Combustión · IFGC 304', en:'Combustion Air · IFGC 304' },
      mp_ca_sub:  { es:'Direct, indirect, confined/unconfined', en:'Direct, indirect, confined/unconfined' },
      mp_ca_btu:  { es:'Carga total aparatos', en:'Total appliance input' },
      mp_ca_vol:  { es:'Volumen del cuarto', en:'Room volume' },
      mp_ca_method:{ es:'Método', en:'Method' },
      mp_ca_std:  { es:'Standard (2 aberturas)', en:'Standard (2 openings)' },
      mp_ca_kis:  { es:'Known-Air-Infiltration', en:'Known-Air-Infiltration' },
      mp_ca_outa: { es:'Abertura requerida (cada una)', en:'Opening required (each)' },
      mp_ca_check:{ es:'Confined / Unconfined', en:'Confined / Unconfined' },
      mp_ca_confined:{ es:'Confinado · requiere aire exterior', en:'Confined · outdoor air required' },
      mp_ca_unconf:{ es:'No confinado', en:'Unconfined' },
      mp_ca_note: { es:'IFGC 304.5.1: cada abertura = 1 in²/4,000 BTU/h (directo al exterior por pared), 1 in²/2,000 BTU/h (vertical via ducto). Mínimo 100 in² por abertura. Un espacio es "confinado" si volumen < 50 ft³/1,000 BTU/h (304.1).', en:'IFGC 304.5.1: each opening = 1 in²/4,000 BTU/h (direct to outdoors thru wall), 1 in²/2,000 BTU/h (vertical via duct). 100 in² minimum each. A space is "confined" when volume < 50 ft³/1,000 BTU/h (304.1).' },
      mp_ca_case: { es:'CA 2026 garage: furnace 100k + WH 40k = 140k BTU/h en cuarto 900 ft³. 50 × 140 = 7,000 ft³ requerido ≫ 900 → CONFINADO. Dos aberturas al exterior = 140,000/4,000 = 35 in² c/u (sube a 100 in² min). Louvers 12×12 netos en pared exterior.', en:'CA 2026 garage: 100k furnace + 40k WH = 140k BTU/h in a 900 ft³ room. 50 × 140 = 7,000 ft³ required ≫ 900 → CONFINED. Two outdoor openings = 140,000/4,000 = 35 in² each (bump to 100 in² min). 12×12 net louvers in exterior wall.' },
      mp_ca_tip:  { es:'Los louvers tienen free-area 25–50%, no 100%. Si la hoja dice "12×12 = 144 in²" pero la louver es 40% free-area, solo tienes 58 in² reales. Pide spec del fabricante antes de comprar.', en:'Louvers have 25–50% free-area, not 100%. If the sheet says "12×12 = 144 in²" but the louver is 40% free-area, you only get 58 in² effective. Pull the manufacturer spec before you buy.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.combAir) || {};
      var btu = num(s.btu, 140000);
      var vol = num(s.vol, 900);
      var method = s.method || 'direct';
      var required = 50 * (btu/1000);
      var confined = vol < required;
      var openingArea = 0;
      if (method==='direct') openingArea = btu/4000;
      else if (method==='vertical') openingArea = btu/2000;
      else openingArea = btu/4000;
      if (openingArea < 100) openingArea = 100;

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_ca_btu','BTU/h'), 'BTU/h', 'combAir.btu', btu, 10000, 5000)+
        inputRow(t('mp_ca_vol','Volumen'), 'ft³', 'combAir.vol', vol, 50, 50)+
        selectRow(t('mp_ca_method','Método'), '§304.5', 'combAir.method', method, [
          ['direct',   'Direct horizontal (1 in²/4,000)'],
          ['vertical', 'Vertical duct (1 in²/2,000)']
        ])+
      '</div>'+
      goldCard(
        t('mp_ca_outa','Abertura c/u'),
        fmt(openingArea,0), 'in² free-area',
        [
          [t('mp_ca_check','Estado'), confined ? t('mp_ca_confined','Confinado') : t('mp_ca_unconf','No confinado')],
          ['50 ft³/1k BTU', fmt(required,0)+' ft³'],
          ['Volumen', fmt(vol,0)+' ft³'],
          ['BTU total', fmt(btu,0)+' BTU/h']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> IFGC 304.5 · NFPA 54 §9.3</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_ca_note',''))+'</div>'+
        '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Opciones:</strong> 304.6 one-opening (1 in²/3,000 BTU/h), 304.6.1 engineered, 304.7 direct-vent (ninguna abertura interior).</div>'+
      '</div>'+
      exampleTip('mp_ca_case','mp_ca_tip');
      return shell('combAir','mp_ca_title','mp_ca_sub','💨', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 4: B-Vent Sizing — NFPA 54 Table 13.2 (Cat I single appliance)
  // Capacity in BTU/h by vent diameter & total height
  // ═══════════════════════════════════════════════════════════════
  // Simplified NFPA 54 Table 13.2(a) — Type B DV, single appliance, 5-ft lateral
  // Cols = height (ft), rows = vent diameter (in)
  var BVENT_TABLE = {
    // dia: { height: [fan-min, fan-max, nat-max] BTU/h ×1000 }
    '3': {  6:[ 38, 77, 45],  8:[ 39, 83, 50], 10:[ 40, 87, 53], 15:[ 42, 95, 58], 20:[ 44,100, 61], 30:[ 45,108, 64] },
    '4': {  6:[ 59,151, 85],  8:[ 60,163, 93], 10:[ 62,171, 99], 15:[ 64,186,108], 20:[ 66,197,113], 30:[ 71,213,120] },
    '5': {  6:[ 85,249,140],  8:[ 86,273,155], 10:[ 89,290,166], 15:[ 93,321,181], 20:[ 97,342,193], 30:[105,377,210] },
    '6': {  6:[126,373,204],  8:[128,415,229], 10:[130,448,246], 15:[138,502,270], 20:[146,540,289], 30:[159,602,320] },
    '7': {  6:[165,528,284],  8:[175,599,319], 10:[182,654,343], 15:[194,733,378], 20:[204,793,407], 30:[222,886,450] },
    '8': {  6:[216,732,394],  8:[225,830,444], 10:[234,916,477], 15:[250,1035,528], 20:[260,1118,562], 30:[283,1253,622] }
  };

  function bventPick(btu, heightFt, draft){
    var dias = ['3','4','5','6','7','8'];
    var heights = [6,8,10,15,20,30];
    var hUse = heights[0];
    for (var j=0;j<heights.length;j++){ if (heightFt >= heights[j]) hUse = heights[j]; }
    for (var i=0;i<dias.length;i++){
      var row = BVENT_TABLE[dias[i]][hUse];
      if (!row) continue;
      var cap = draft==='fan' ? row[1] : row[2];
      if (btu/1000 <= cap) return { dia: dias[i], cap: cap*1000, hUse: hUse };
    }
    return { dia: '10+', cap: 0, hUse: hUse };
  }

  window.MP_CALCS['ventTableB'] = {
    i18n: {
      mp_vb_title:{ es:'B-Vent Sizing · NFPA 54 Tabla 13.2', en:'B-Vent Sizing · NFPA 54 Table 13.2' },
      mp_vb_sub:  { es:'Cat I · aparato único · 5 ft lateral', en:'Cat I · single appliance · 5 ft lateral' },
      mp_vb_btu:  { es:'Carga del aparato', en:'Appliance input' },
      mp_vb_h:    { es:'Altura total del vent', en:'Total vent height' },
      mp_vb_draft:{ es:'Tipo de tiro', en:'Draft type' },
      mp_vb_nat:  { es:'Natural (Cat I)', en:'Natural (Cat I)' },
      mp_vb_fan:  { es:'Fan-assisted (Cat I FAN)', en:'Fan-assisted (Cat I FAN)' },
      mp_vb_dia:  { es:'Diámetro mínimo B-vent', en:'Minimum B-vent diameter' },
      mp_vb_cap:  { es:'Capacidad tabla', en:'Table capacity' },
      mp_vb_note: { es:'NFPA 54 Tabla 13.2(a/b) cubre Type B doble-pared. Categoría I condensante REQUIERE venting no-metálico (UL 1738 PVC/CPVC/PPs). Nunca mezcles fan-assisted + natural draft en el mismo vent sin bafle.', en:'NFPA 54 Table 13.2(a/b) covers Type B double-wall. Condensing Cat IV REQUIRES non-metallic vent (UL 1738 PVC/CPVC/PPs). Never mix fan-assisted + natural draft in one vent without a barometric damper.' },
      mp_vb_case: { es:'Furnace 80k BTU Cat I fan-assisted, 15 ft de altura: diámetro 4" B-vent (cap 186k) ✓ con margen 2x. Terminación mínima 3 ft sobre techo + 2 ft sobre cualquier estructura dentro de 10 ft (13.2.8.1).', en:'80k BTU Cat I fan-assisted furnace, 15 ft height: 4" B-vent (cap 186k) ✓ with 2x margin. Termination min 3 ft above roof + 2 ft above any structure within 10 ft (13.2.8.1).' },
      mp_vb_tip:  { es:'Cat I fan-assisted mínimo 4" — nunca 3". Si ves un vent viejo 3" en un furnace nuevo fan-assisted, es violación de código y sartén de condensado dentro del vent (corrosion). Cambia a 4" o instala liner.', en:'Cat I fan-assisted minimum 4" — never 3". If you see an old 3" vent on a new fan-assisted furnace, it\'s a code violation and you\'ll get condensate inside the vent (corrosion). Upsize to 4" or install a liner.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ventTableB) || {};
      var btu = num(s.btu, 100000);
      var hF = num(s.h, 15);
      var draft = s.draft || 'fan';
      var p = bventPick(btu, hF, draft);

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_vb_btu','BTU/h'), 'BTU/h', 'ventTableB.btu', btu, 20000, 5000)+
        inputRow(t('mp_vb_h','Altura'), 'ft', 'ventTableB.h', hF, 6, 1)+
        selectRow(t('mp_vb_draft','Tiro'), 'draft', 'ventTableB.draft', draft, [
          ['nat', t('mp_vb_nat','Natural')],
          ['fan', t('mp_vb_fan','Fan-assisted')]
        ])+
      '</div>'+
      goldCard(
        t('mp_vb_dia','Diámetro mínimo B-vent'),
        p.dia, 'in',
        [
          [t('mp_vb_cap','Capacidad'), fmt(p.cap,0)+' BTU/h'],
          ['Altura usada', p.hUse+' ft'],
          ['Entrada', fmt(btu,0)+' BTU/h'],
          ['Lateral', '5 ft (estándar)']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> NFPA 54 · 2024 ed.</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_vb_note',''))+'</div>'+
        '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Regla 3/2/10:</strong> terminal ≥3 ft sobre techo + ≥2 ft sobre cualquier superficie dentro de 10 ft (IFGC 503.6.4).</div>'+
      '</div>'+
      exampleTip('mp_vb_case','mp_vb_tip');
      return shell('ventTableB','mp_vb_title','mp_vb_sub','🏭', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 5: Masonry Chimney Sizing — NFPA 211 / IFGC 503
  // Effective area = 0.20 × flue-collar area (round) for typical draft
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['chimneySize'] = {
    i18n: {
      mp_ch_title:{ es:'Chimenea de mampostería · NFPA 211', en:'Masonry Chimney · NFPA 211' },
      mp_ch_sub:  { es:'IFGC 503 · con liner metálico', en:'IFGC 503 · with metal liner' },
      mp_ch_btu:  { es:'Carga del aparato', en:'Appliance input' },
      mp_ch_h:    { es:'Altura de chimenea', en:'Chimney height' },
      mp_ch_appl: { es:'Aparato', en:'Appliance' },
      mp_ch_res:  { es:'Área efectiva requerida', en:'Effective area required' },
      mp_ch_dia:  { es:'Liner redondo equivalente', en:'Round liner equivalent' },
      mp_ch_note: { es:'IFGC 503.5.5 prohíbe chimenea de mampostería sin liner para Cat I gas ≥100k BTU/h. El liner SS316L es estándar; AL29-4C solo para Cat IV. Área del liner = flue-collar × factor de altura (tabla 13.1).', en:'IFGC 503.5.5 prohibits unlined masonry chimney for Cat I gas ≥100k BTU/h. SS316L liner is standard; AL29-4C only for Cat IV. Liner area = flue-collar × height factor (Table 13.1).' },
      mp_ch_case: { es:'Casa vieja CA: furnace 120k BTU Cat I en chimenea 20 ft tipo exterior. Liner flexible SS316L 5" (área 19.6 in²) — supera 3x flue-collar. Rematar con rain-cap + spark-arrestor.', en:'Old CA home: 120k BTU Cat I furnace in 20 ft exterior chimney. 5" SS316L flex liner (area 19.6 in²) — 3x flue-collar. Top with rain-cap + spark-arrestor.' },
      mp_ch_tip:  { es:'Chimenea exterior pierde 30–50% de tiro vs. interior. Si el furnace cycla corto o hay olor a producto de combustión en el cuarto mecánico → mide CO ambiente antes de salir del job.', en:'An exterior chimney loses 30–50% of draft vs. interior. If the furnace short-cycles or there\'s combustion-product smell in the mech room → test ambient CO before you leave the job.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.chimneySize) || {};
      var btu = num(s.btu, 100000);
      var hF = num(s.h, 20);
      var appl = s.appl || 'furn';
      // Simplified: effective area per 1,000 BTU/h natural-draft: 0.011 in² (Cat I fan), 0.030 in² (nat draft)
      var coef = appl==='boilerNat' ? 0.030 : 0.011;
      var areaReq = (btu/1000) * coef;
      // Height correction
      if (hF < 10) areaReq *= 1.20;
      if (hF >= 20) areaReq *= 0.90;
      var dia = Math.sqrt(4*areaReq/Math.PI);
      var diaRound = Math.ceil(dia*2)/2;

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_ch_btu','BTU/h'), 'BTU/h', 'chimneySize.btu', btu, 20000, 5000)+
        inputRow(t('mp_ch_h','Altura'), 'ft', 'chimneySize.h', hF, 6, 1)+
        selectRow(t('mp_ch_appl','Aparato'), 'type', 'chimneySize.appl', appl, [
          ['furn',      'Furnace Cat I fan-asst'],
          ['boilerNat', 'Boiler natural draft'],
          ['wh',        'Water heater Cat I']
        ])+
      '</div>'+
      goldCard(
        t('mp_ch_dia','Liner redondo'),
        fmt(diaRound,1), 'in',
        [
          [t('mp_ch_res','Área req'), fmt(areaReq,1)+' in²'],
          ['Altura', hF+' ft'],
          ['Coef', fmt(coef,3)],
          ['Material', 'SS316L flex']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> NFPA 211 · IFGC 503</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_ch_note',''))+'</div>'+
      '</div>'+
      exampleTip('mp_ch_case','mp_ch_tip');
      return shell('chimneySize','mp_ch_title','mp_ch_sub','🏛', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 6: Exhaust CFM — IMC Table 403.3.1.1 (occupancy)
  // ═══════════════════════════════════════════════════════════════
  var OCCUPANCY_VENT = {
    office:     { es:'Oficina',                en:'Office',                  peoplePer1000:5,  cfmPerson:5,  cfmPerFt2:0.06 },
    classroom:  { es:'Aula (K-12)',           en:'Classroom (K-12)',         peoplePer1000:25, cfmPerson:10, cfmPerFt2:0.12 },
    retail:     { es:'Tienda retail',          en:'Retail store',            peoplePer1000:15, cfmPerson:7.5,cfmPerFt2:0.12 },
    restaurant: { es:'Restaurante (dining)',   en:'Restaurant dining',        peoplePer1000:70, cfmPerson:7.5,cfmPerFt2:0.18 },
    lobby:      { es:'Lobby hotel',            en:'Hotel lobby',              peoplePer1000:30, cfmPerson:7.5,cfmPerFt2:0.06 },
    gym:        { es:'Gimnasio / weight',      en:'Gym / weight room',        peoplePer1000:10, cfmPerson:20, cfmPerFt2:0.06 },
    hospital:   { es:'Hospital (paciente)',    en:'Hospital (patient room)',  peoplePer1000:10, cfmPerson:25, cfmPerFt2:0.18 },
    warehouse:  { es:'Almacén',                en:'Warehouse',                peoplePer1000:0,  cfmPerson:0,  cfmPerFt2:0.06 },
    residence:  { es:'Sala dwelling',          en:'Dwelling living',          peoplePer1000:2,  cfmPerson:5,  cfmPerFt2:0.03 },
    barber:     { es:'Barbería / salón',       en:'Barber / beauty salon',    peoplePer1000:25, cfmPerson:7.5,cfmPerFt2:0.12 }
  };

  window.MP_CALCS['exhaustCFM'] = {
    i18n: {
      mp_ex_title:{ es:'CFM de extracción · IMC 403.3.1.1', en:'Exhaust CFM · IMC 403.3.1.1' },
      mp_ex_sub:  { es:'Aire exterior por ocupación', en:'Outdoor air by occupancy' },
      mp_ex_area: { es:'Área del espacio', en:'Floor area' },
      mp_ex_occ:  { es:'Tipo de ocupación', en:'Occupancy type' },
      mp_ex_ppl:  { es:'Ocupantes reales', en:'Actual occupants' },
      mp_ex_people:{ es:'CFM por persona', en:'CFM per person' },
      mp_ex_floor:{ es:'CFM por ft²', en:'CFM per ft²' },
      mp_ex_total:{ es:'OA total requerido', en:'Total OA required' },
      mp_ex_note: { es:'IMC Tabla 403.3.1.1 combina carga por persona + carga por área. Si no conoces ocupantes reales usa la densidad default (columna people/1000 ft²). ASHRAE 62.1 es la base técnica. Áreas "limpias" (hospital OR, lab BSL-3) tienen requisitos más altos — esta tabla cubre los típicos.', en:'IMC Table 403.3.1.1 combines people rate + area rate. If you don\'t know actual occupants use the default density (people/1000 ft² column). ASHRAE 62.1 is the technical basis. "Clean" spaces (hospital OR, lab BSL-3) have higher requirements — this table covers typical occupancies.' },
      mp_ex_case: { es:'Restaurante CA 2026 · 3,500 ft² dining, 130 asientos: Rp = 7.5 × 130 = 975, Ra = 0.18 × 3500 = 630 → total 1,605 CFM OA. RTU debe tener economizer + dampers modulating (T24 Part 6).', en:'CA 2026 restaurant · 3,500 ft² dining, 130 seats: Rp = 7.5 × 130 = 975, Ra = 0.18 × 3500 = 630 → total 1,605 CFM OA. RTU needs economizer + modulating dampers (T24 Part 6).' },
      mp_ex_tip:  { es:'Los dampers de OA se quedan cerrados en 80% de los RTU viejos — mide CFM real con balometer. Si no, el dueño te paga por código pero nadie respira bien. Commissioning > cumplimiento.', en:'OA dampers are stuck closed on 80% of old RTUs — measure real CFM with a balometer. Otherwise the owner paid for code but nobody breathes right. Commissioning > compliance.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.exhaustCFM) || {};
      var area = num(s.area, 3000);
      var occKey = s.occ || 'office';
      var people = num(s.ppl, -1);
      var occ = OCCUPANCY_VENT[occKey] || OCCUPANCY_VENT.office;
      if (people < 0) people = Math.round((occ.peoplePer1000 * area) / 1000);
      var rp = occ.cfmPerson * people;
      var ra = occ.cfmPerFt2 * area;
      var total = rp + ra;

      var occOpts = [];
      var keys = ['office','classroom','retail','restaurant','lobby','gym','hospital','warehouse','residence','barber'];
      for (var i=0;i<keys.length;i++){ occOpts.push([keys[i], pick(OCCUPANCY_VENT[keys[i]])]); }

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        selectRow(t('mp_ex_occ','Ocupación'), 'occ', 'exhaustCFM.occ', occKey, occOpts)+
        inputRow(t('mp_ex_area','Área'), 'ft²', 'exhaustCFM.area', area, 100, 50)+
        inputRow(t('mp_ex_ppl','Ocupantes'), '#', 'exhaustCFM.ppl', people, 0, 1)+
      '</div>'+
      goldCard(
        t('mp_ex_total','OA total requerido'),
        fmt(total,0), 'CFM',
        [
          [t('mp_ex_people','CFM/persona'), fmt(occ.cfmPerson,1)+' × '+people+' = '+fmt(rp,0)],
          [t('mp_ex_floor','CFM/ft²'), fmt(occ.cfmPerFt2,2)+' × '+fmt(area,0)+' = '+fmt(ra,0)],
          ['Densidad', occ.peoplePer1000+'/1000 ft²'],
          ['Ocupantes', people+' pers']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> IMC 403 · ASHRAE 62.1</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_ex_note',''))+'</div>'+
      '</div>'+
      exampleTip('mp_ex_case','mp_ex_tip');
      return shell('exhaustCFM','mp_ex_title','mp_ex_sub','🌬', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 7: Type I Hood — IMC 507 (commercial kitchen)
  // CFM por ft de perímetro / por equipo duty
  // ═══════════════════════════════════════════════════════════════
  var HOOD_RATES = {
    light:    { label:{es:'Ligera (steam kettle, pasta)',  en:'Light duty (steam kettle, pasta)'},   cfmFt:150 },
    medium:   { label:{es:'Media (range, fryer, griddle)', en:'Medium duty (range, fryer, griddle)'},cfmFt:300 },
    heavy:    { label:{es:'Pesada (char-broiler, wok)',    en:'Heavy duty (char-broiler, wok)'},     cfmFt:400 },
    extra:    { label:{es:'Extra pesada (leña, mesquite)', en:'Extra heavy (wood, mesquite)'},       cfmFt:550 }
  };

  window.MP_CALCS['hoodType1'] = {
    i18n: {
      mp_h1_title:{ es:'Campana Tipo I · IMC 507', en:'Type I Hood · IMC 507' },
      mp_h1_sub:  { es:'Cocina comercial grease-laden', en:'Commercial kitchen grease-laden' },
      mp_h1_len:  { es:'Largo de campana', en:'Hood length' },
      mp_h1_depth:{ es:'Profundidad', en:'Depth' },
      mp_h1_duty: { es:'Duty del equipo', en:'Equipment duty' },
      mp_h1_style:{ es:'Estilo', en:'Style' },
      mp_h1_wall: { es:'Pared (canopy)', en:'Wall canopy' },
      mp_h1_island:{ es:'Isla (island)', en:'Island' },
      mp_h1_cfm:  { es:'CFM de extracción', en:'Exhaust CFM' },
      mp_h1_make: { es:'Make-up air', en:'Make-up air' },
      mp_h1_note: { es:'IMC 507.2.1 exige Tipo I para grease-laden. CFM = cfm/ft × largo × factor (canopy 1.0, island 1.25). Make-up air = 80–100% del exhaust (IMC 508). Filtros UL 1046 grasa, 18" mínimo arriba del equipo. Duct 18ga acero ≥18" clearance o con wrap 2-hr.', en:'IMC 507.2.1 requires Type I for grease-laden. CFM = cfm/ft × length × factor (canopy 1.0, island 1.25). Make-up = 80–100% of exhaust (IMC 508). UL 1046 grease filters, 18" minimum above equipment. 18-ga steel duct with ≥18" clearance or 2-hr wrap.' },
      mp_h1_case: { es:'Restaurante CA: campana 10 ft × 4 ft sobre 2 fryers + 1 griddle + 1 range (medium duty), wall canopy: 300 × 10 × 1.0 = 3,000 CFM exhaust. Make-up 2,700 CFM (90%) con tempered outside air.', en:'CA restaurant: 10 ft × 4 ft hood over 2 fryers + griddle + range (medium duty), wall canopy: 300 × 10 × 1.0 = 3,000 CFM exhaust. 2,700 CFM make-up (90%) with tempered outside air.' },
      mp_h1_tip:  { es:'Nunca sugieras ≥50 HP de exhaust sin VFD + ASD control. El cliente va a quemar $800/mes en energía. Y la campana SIN make-up air tempered causa burner flame lift en invierno — el cocinero va a sacar la chispera y llamarte a las 6 am.', en:'Never spec ≥50 HP exhaust without VFD + ASD control. The owner will burn $800/mo in energy. And a hood WITHOUT tempered make-up air causes burner flame lift in winter — the cook will yank the pilot and call you at 6 a.m.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.hoodType1) || {};
      var len = num(s.len, 10);
      var depth = num(s.depth, 4);
      var duty = s.duty || 'medium';
      var style = s.style || 'wall';
      var rate = (HOOD_RATES[duty]||HOOD_RATES.medium).cfmFt;
      var factor = style==='island' ? 1.25 : 1.00;
      var cfm = rate * len * factor;
      var make = cfm * 0.90;

      var dutyOpts = [];
      var dkeys = ['light','medium','heavy','extra'];
      for (var i=0;i<dkeys.length;i++){ dutyOpts.push([dkeys[i], pick(HOOD_RATES[dkeys[i]].label)]); }

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_h1_len','Largo'), 'ft', 'hoodType1.len', len, 2, 1)+
        inputRow(t('mp_h1_depth','Profundidad'), 'ft', 'hoodType1.depth', depth, 3, 0.5)+
        selectRow(t('mp_h1_duty','Duty'), 'cfm/ft', 'hoodType1.duty', duty, dutyOpts)+
        selectRow(t('mp_h1_style','Estilo'), 'style', 'hoodType1.style', style, [
          ['wall', t('mp_h1_wall','Wall canopy')],
          ['island', t('mp_h1_island','Island')]
        ])+
      '</div>'+
      goldCard(
        t('mp_h1_cfm','CFM extracción'),
        fmt(cfm,0), 'CFM',
        [
          [t('mp_h1_make','Make-up 90%'), fmt(make,0)+' CFM'],
          ['Rate', rate+' CFM/ft'],
          ['Factor', fmt(factor,2)+' ('+style+')'],
          ['Largo', len+' ft']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> IMC 507 · NFPA 96</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_h1_note',''))+'</div>'+
      '</div>'+
      exampleTip('mp_h1_case','mp_h1_tip');
      return shell('hoodType1','mp_h1_title','mp_h1_sub','🍳', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 8: Clearances to Combustibles — IMC 308 / NFPA 54
  // ═══════════════════════════════════════════════════════════════
  var CLEARANCE_TABLE = {
    furnFan:    { es:'Furnace fan-assisted Cat I',  en:'Cat I fan-assisted furnace',     top:6, front:6, back:6, sides:6, sec:'IMC 308.6' },
    furnDV:     { es:'Furnace direct-vent Cat IV',  en:'Cat IV direct-vent furnace',     top:1, front:6, back:1, sides:1, sec:'IMC 308.7' },
    whTank:     { es:'Water heater tank gas',        en:'Tank gas water heater',          top:12, front:24, back:6, sides:6, sec:'IMC 308.6' },
    whTankless: { es:'Water heater tankless',         en:'Tankless water heater',          top:12, front:12, back:0, sides:0, sec:'Mfr listing' },
    boilerCast: { es:'Boiler hierro colado',          en:'Cast-iron boiler',               top:18, front:24, back:6, sides:6, sec:'IMC 308.6' },
    stoveWood:  { es:'Estufa de leña',                en:'Wood stove',                     top:36, front:36, back:36, sides:36, sec:'NFPA 211' },
    ventB:      { es:'B-vent (Type B single wall)',  en:'B-vent (single wall run)',       top:1,  front:1, back:1, sides:1, sec:'UL 441 · IMC 308.2' },
    ventSSL:    { es:'Listed Cat IV vent (PVC/CPVC)',en:'Listed Cat IV vent (PVC/CPVC)',  top:0,  front:0, back:0, sides:0, sec:'UL 1738 listing' },
    flueSingle: { es:'Flue single-wall',               en:'Single-wall metal flue',         top:18, front:18, back:18, sides:18, sec:'IMC 308.9' }
  };

  window.MP_CALCS['clearances'] = {
    i18n: {
      mp_cl_title:{ es:'Clearances a combustibles · IMC 308', en:'Clearances to combustibles · IMC 308' },
      mp_cl_sub:  { es:'Distancias mínimas en pulgadas', en:'Minimum distances in inches' },
      mp_cl_eq:   { es:'Equipo', en:'Equipment' },
      mp_cl_top:  { es:'Arriba', en:'Top' },
      mp_cl_front:{ es:'Frente', en:'Front' },
      mp_cl_back: { es:'Atrás', en:'Back' },
      mp_cl_sides:{ es:'Lados', en:'Sides' },
      mp_cl_ref:  { es:'Referencia', en:'Reference' },
      mp_cl_note: { es:'El listing del fabricante REEMPLAZA la tabla IMC (IMC 308.1). Si la placa dice "0" clearance, respeta la placa. Clearance reducible con shield (IMC Tabla 308.4): sheet metal + 1" air gap = 50% reducción, sheet metal spaced 1" del muro = 66% reducción.', en:'Manufacturer listing OVERRIDES IMC table (IMC 308.1). If nameplate says "0" clearance, follow nameplate. Clearance reducible with shield (IMC Table 308.4): sheet metal + 1" air gap = 50% reduction, sheet metal spaced 1" from wall = 66% reduction.' },
      mp_cl_case: { es:'Reemplazo de furnace viejo 18" clearance por modelo nuevo 80% Cat I fan-asst: nuevo requiere 6" top/front/back/sides → cabe con 2" extra en cada lado. Si es tight install, considera Cat IV con 1" clearance.', en:'Replacing old 18" clearance furnace with new 80% Cat I fan-asst: new needs 6" top/front/back/sides → fits with 2" extra each side. If tight install, consider Cat IV with 1" clearance.' },
      mp_cl_tip:  { es:'Nunca confíes en la memoria del helper — siempre abre el installation manual del equipo específico. Dos modelos del mismo fabricante pueden tener clearances diferentes según si tienen línea de gas trasera o lateral.', en:'Never trust the helper\'s memory — always open the specific unit\'s installation manual. Two models from the same manufacturer can have different clearances depending on whether gas line enters rear or side.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.clearances) || {};
      var eq = s.eq || 'furnFan';
      var entry = CLEARANCE_TABLE[eq] || CLEARANCE_TABLE.furnFan;

      var opts = [];
      var ekeys = Object.keys(CLEARANCE_TABLE);
      for (var i=0;i<ekeys.length;i++){ opts.push([ekeys[i], pick(CLEARANCE_TABLE[ekeys[i]])]); }

      // Full matrix table
      var rows = '<tr style="background:#F1F5F9;">'+
        '<th style="padding:6px 8px;text-align:left;font-size:12px;color:#111;">'+esc(t('mp_cl_eq','Equipo'))+'</th>'+
        '<th style="padding:6px 8px;font-size:12px;color:#111;">'+esc(t('mp_cl_top','Arriba'))+'</th>'+
        '<th style="padding:6px 8px;font-size:12px;color:#111;">'+esc(t('mp_cl_front','Frente'))+'</th>'+
        '<th style="padding:6px 8px;font-size:12px;color:#111;">'+esc(t('mp_cl_back','Atrás'))+'</th>'+
        '<th style="padding:6px 8px;font-size:12px;color:#111;">'+esc(t('mp_cl_sides','Lados'))+'</th>'+
        '<th style="padding:6px 8px;font-size:11px;color:#111;">§</th></tr>';
      for (var j=0;j<ekeys.length;j++){
        var e = CLEARANCE_TABLE[ekeys[j]];
        rows += '<tr style="border-top:1px solid #E2E8F0;'+(eq===ekeys[j]?'background:#FEF3C7;':'')+'">'+
          '<td style="padding:6px 8px;font-size:12px;color:#111;">'+esc(pick(e))+'</td>'+
          '<td style="padding:6px 8px;text-align:center;font-size:12px;color:#111;font-weight:700;">'+e.top+'"</td>'+
          '<td style="padding:6px 8px;text-align:center;font-size:12px;color:#111;font-weight:700;">'+e.front+'"</td>'+
          '<td style="padding:6px 8px;text-align:center;font-size:12px;color:#111;font-weight:700;">'+e.back+'"</td>'+
          '<td style="padding:6px 8px;text-align:center;font-size:12px;color:#111;font-weight:700;">'+e.sides+'"</td>'+
          '<td style="padding:6px 8px;font-size:10.5px;color:#111;">'+esc(e.sec)+'</td>'+
        '</tr>';
      }

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        selectRow(t('mp_cl_eq','Equipo'), 'type', 'clearances.eq', eq, opts)+
      '</div>'+
      goldCard(
        pick(entry),
        entry.top+'"', t('mp_cl_top','Top'),
        [
          [t('mp_cl_front','Frente'), entry.front+'"'],
          [t('mp_cl_back','Atrás'),   entry.back+'"'],
          [t('mp_cl_sides','Lados'),  entry.sides+'"'],
          [t('mp_cl_ref','Ref'),      entry.sec]
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_cl_note','').substring(0,40))+'…</div>'+
        '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:6px;overflow:hidden;">'+rows+'</table></div>'+
        '<div style="margin-top:10px;font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_cl_note',''))+'</div>'+
      '</div>'+
      exampleTip('mp_cl_case','mp_cl_tip');
      return shell('clearances','mp_cl_title','mp_cl_sub','📏', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 9: Total External Static Pressure — SMACNA / ACCA Manual D
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['staticPressureMech'] = {
    i18n: {
      mp_sp_title:{ es:'Presión Estática Total (TESP)', en:'Total External Static (TESP)' },
      mp_sp_sub:  { es:'SMACNA · ACCA Manual D', en:'SMACNA · ACCA Manual D' },
      mp_sp_supLen:{es:'Supply trunk (ft)', en:'Supply trunk (ft)' },
      mp_sp_retLen:{es:'Return trunk (ft)', en:'Return trunk (ft)' },
      mp_sp_fr:   { es:'Fricción diseño', en:'Design friction rate' },
      mp_sp_filter:{ es:'Filtro', en:'Filter' },
      mp_sp_coilW:{ es:'Coil wet (cooling)', en:'Wet coil (cooling)' },
      mp_sp_reg:  { es:'Pérdida registers (sup+ret)', en:'Register loss (sup+ret)' },
      mp_sp_elb:  { es:'Elbows/fittings extra (EL ft)', en:'Elbows/fittings (EL ft)' },
      mp_sp_tesp: { es:'TESP calculado', en:'Computed TESP' },
      mp_sp_note: { es:'Blowers residenciales PSC están ratings @ 0.50"wc. ECM tolera hasta 0.80–1.00"wc pero pierde eficiencia. Si tu TESP calculado > 0.70"wc → upsize ductos o cambia blower. Cada 0.10"wc extra reduce ~8% CFM en PSC.', en:'Residential PSC blowers are rated at 0.50"wc. ECM tolerates up to 0.80–1.00"wc but loses efficiency. If calculated TESP > 0.70"wc → upsize ducts or change blower. Each 0.10"wc extra drops ~8% CFM on PSC.' },
      mp_sp_case: { es:'Casa CA 2026 · 3-ton 1200 CFM, supply 40 ft + return 25 ft @ 0.08"wc/100 ft: ductos 0.052 + filtro 0.25 (pleated MERV 11) + coil wet 0.25 + registers 0.05 = 0.60"wc. PSC blower saturado; cambia a pleated MERV 8 (0.15) → 0.50"wc ✓.', en:'CA 2026 home · 3-ton 1200 CFM, 40 ft supply + 25 ft return @ 0.08"wc/100 ft: duct 0.052 + filter 0.25 (pleated MERV 11) + wet coil 0.25 + registers 0.05 = 0.60"wc. PSC blower maxed out; change to pleated MERV 8 (0.15) → 0.50"wc ✓.' },
      mp_sp_tip:  { es:'MIDE TESP SIEMPRE al terminar un install — 20% de los sistemas salen >0.80"wc por filtros 1" MERV 13 puestos por el dueño. Deja al cliente filtros 4" 5" que caen a 0.10"wc y no reventan el blower.', en:'ALWAYS measure TESP at install turnover — 20% of systems ship >0.80"wc because the owner installs 1" MERV 13 filters. Leave the customer 4"–5" media filters that stay at 0.10"wc and don\'t kill the blower.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.staticPressureMech) || {};
      var supLen = num(s.supLen, 40);
      var retLen = num(s.retLen, 25);
      var fr = num(s.fr, 0.08);
      var filter = num(s.filter, 0.15);
      var coil = num(s.coil, 0.25);
      var reg = num(s.reg, 0.05);
      var elb = num(s.elb, 30);
      var lenTot = supLen + retLen + elb;
      var duct = lenTot * fr / 100;
      var tesp = duct + filter + coil + reg;
      var status = tesp <= 0.50 ? '✓ OK (PSC)' : tesp <= 0.80 ? 'ECM only' : '⚠ Upsize';

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_sp_supLen','Supply'), 'ft', 'staticPressureMech.supLen', supLen, 0, 5)+
        inputRow(t('mp_sp_retLen','Return'), 'ft', 'staticPressureMech.retLen', retLen, 0, 5)+
        inputRow(t('mp_sp_elb','Fittings EL'), 'ft', 'staticPressureMech.elb', elb, 0, 5)+
        inputRow(t('mp_sp_fr','Fricción'), 'inwc/100ft', 'staticPressureMech.fr', fr, 0.01, 0.01)+
        inputRow(t('mp_sp_filter','Filtro'), 'inwc', 'staticPressureMech.filter', filter, 0, 0.05)+
        inputRow(t('mp_sp_coilW','Coil wet'), 'inwc', 'staticPressureMech.coil', coil, 0, 0.05)+
        inputRow(t('mp_sp_reg','Registers'), 'inwc', 'staticPressureMech.reg', reg, 0, 0.01)+
      '</div>'+
      goldCard(
        t('mp_sp_tesp','TESP'),
        fmt(tesp,2), '"wc',
        [
          ['Ducto', fmt(duct,2)+' "wc ('+lenTot+' ft)'],
          ['Filtro', fmt(filter,2)+' "wc'],
          ['Coil', fmt(coil,2)+' "wc'],
          ['Estado', status]
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> SMACNA · ACCA D</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_sp_note',''))+'</div>'+
        '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Pérdidas típicas:</strong> coil dry 0.10 / wet 0.25 · filter 1" fiber 0.10 / pleated 0.20 / 4" media 0.10 · register 0.03–0.05 c/u.</div>'+
      '</div>'+
      exampleTip('mp_sp_case','mp_sp_tip');
      return shell('staticPressureMech','mp_sp_title','mp_sp_sub','📉', body);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 10: Condensate Drain — IMC 307
  // Pipe size por CFM, slope, trap sizing
  // ═══════════════════════════════════════════════════════════════
  function condPipe(cfm){
    if (cfm <= 20)  return { size:'3/4', gph:3 };
    if (cfm <= 40)  return { size:'1',   gph:5 };   // IMC 307.2.2 típico
    if (cfm <= 90)  return { size:'1',   gph:9 };
    if (cfm <= 125) return { size:'1-1/4', gph:12 };
    if (cfm <= 250) return { size:'1-1/2', gph:16 };
    return { size:'2', gph:24 };
  }

  window.MP_CALCS['condensateMech'] = {
    i18n: {
      mp_cd2_title:{ es:'Drenaje de condensado · IMC 307', en:'Condensate drain · IMC 307' },
      mp_cd2_sub:  { es:'Size, trap, slope, secondary', en:'Size, trap, slope, secondary' },
      mp_cd2_tons: { es:'Capacidad del equipo', en:'Equipment capacity' },
      mp_cd2_climate:{es:'Clima', en:'Climate' },
      mp_cd2_arid: { es:'Árido (low latent)', en:'Arid (low latent)' },
      mp_cd2_humid:{ es:'Húmedo (high latent)', en:'Humid (high latent)' },
      mp_cd2_mixed:{ es:'Mixto', en:'Mixed' },
      mp_cd2_cfm:  { es:'CFM', en:'CFM' },
      mp_cd2_size: { es:'Tamaño de drenaje', en:'Drain size' },
      mp_cd2_trap: { es:'Trap depth', en:'Trap depth' },
      mp_cd2_slope:{ es:'Pendiente mínima', en:'Minimum slope' },
      mp_cd2_rate: { es:'Tasa de condensado', en:'Condensate rate' },
      mp_cd2_note: { es:'IMC 307.2.2 exige drenaje primario + secundario (o safe pan) para todo equipo con pan > 2" sobre pasillo habitable o sobre material dañable. Trap depth ≥ 2× ESP negativa del blower (típico 3–5"). Slope ≥ 1/8"/ft (IMC 307.2.3). Nunca conectes a drenaje sanitario sin air-gap.', en:'IMC 307.2.2 requires primary drain + secondary (or safe pan) for any equipment whose pan is >2" above usable space or damageable material. Trap depth ≥ 2× negative ESP (typical 3–5"). Slope ≥ 1/8"/ft (IMC 307.2.3). Never tie to sanitary drain without air-gap.' },
      mp_cd2_case: { es:'AHU 5-ton attic CA 2026 (húmedo verano): 2000 CFM → 1" PVC primary + 3/4" secondary a safe pan con float switch (UL 508 EZ-Trap). Trap 4" profundo, slope 1/4"/ft a vent exterior. IMC 307.2.3.1 requiere shutoff switch.', en:'CA 2026 5-ton attic AHU (humid summer): 2000 CFM → 1" PVC primary + 3/4" secondary to safe pan with UL 508 float switch. 4" trap, 1/4"/ft slope to exterior termination. IMC 307.2.3.1 requires shutoff switch.' },
      mp_cd2_tip:  { es:'90% de los callbacks de "agua en el techo" son trap sin ventilar (crea slug lock) o drenaje pegado con shop-vac limpiado por años. Instala clean-out tee + venteo inmediatamente después del trap — ahorra 3 horas cada verano.', en:'90% of "water on ceiling" callbacks are unvented traps (slug-lock) or drains cleared with shop-vac year after year. Install a clean-out tee + vent immediately past the trap — saves you 3 hours every summer.' }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.condensateMech) || {};
      var tons = num(s.tons, 3);
      var climate = s.climate || 'mixed';
      var cfm = tons * 400;
      // Condensate rate rough: pint/hr/ton by climate
      var pintsTon = climate==='humid' ? 4.0 : climate==='arid' ? 1.0 : 2.5;
      var pints = pintsTon * tons;
      var gph = pints / 8;
      var pipe = condPipe(cfm);

      var body = '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
        inputRow(t('mp_cd2_tons','Tons'), 'tons', 'condensateMech.tons', tons, 0.5, 0.5)+
        selectRow(t('mp_cd2_climate','Clima'), 'latent', 'condensateMech.climate', climate, [
          ['arid',  t('mp_cd2_arid','Árido')],
          ['mixed', t('mp_cd2_mixed','Mixto')],
          ['humid', t('mp_cd2_humid','Húmedo')]
        ])+
      '</div>'+
      goldCard(
        t('mp_cd2_size','Tamaño drenaje'),
        pipe.size+'"', 'PVC',
        [
          [t('mp_cd2_cfm','CFM'), fmt(cfm,0)+' CFM'],
          [t('mp_cd2_rate','Condensado'), fmt(pints,1)+' pt/hr · '+fmt(gph,2)+' gph'],
          [t('mp_cd2_trap','Trap'), '4" profundo + vent'],
          [t('mp_cd2_slope','Slope'), '1/8"/ft min']
        ]
      )+
      '<div class="mp-sec">'+
        '<div class="mp-sec-lbl"><span class="dot">◆</span> IMC 307 · ANSI A40</div>'+
        '<div style="font-size:12.5px;color:#111;line-height:1.55;">'+esc(t('mp_cd2_note',''))+'</div>'+
        '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Protecciones obligatorias:</strong> float switch en pan secundario (307.2.3.1) · clean-out tee · air-gap al desagüe · aislamiento en zona fría (evita condensación externa).</div>'+
      '</div>'+
      exampleTip('mp_cd2_case','mp_cd2_tip');
      return shell('condensateMech','mp_cd2_title','mp_cd2_sub','💧', body);
    }
  };

})();
