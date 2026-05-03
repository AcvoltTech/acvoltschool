// Maestro Pro · Electrical 2 calculators
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

  var SQRT3 = Math.sqrt(3);

  // ─────────────────────────────────────────────────────────────────
  // NEC Chapter 9 Table 8 — Conductor circular mils (CM) stranded Cu/Al
  // ─────────────────────────────────────────────────────────────────
  var CM_TABLE = {
    '14':  4110,
    '12':  6530,
    '10':  10380,
    '8':   16510,
    '6':   26240,
    '4':   41740,
    '3':   52620,
    '2':   66360,
    '1':   83690,
    '1/0': 105600,
    '2/0': 133100,
    '3/0': 167800,
    '4/0': 211600,
    '250': 250000,
    '300': 300000,
    '350': 350000,
    '400': 400000,
    '500': 500000
  };
  var AWG_LIST = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500'];

  // ─────────────────────────────────────────────────────────────────
  // NEC Chapter 9 Table 5 — Wire cross-sectional area (in²) by AWG + insulation
  // ─────────────────────────────────────────────────────────────────
  var WIRE_AREA = {
    'THHN': {'14':0.0097,'12':0.0133,'10':0.0211,'8':0.0366,'6':0.0507,'4':0.0824,'3':0.0973,'2':0.1158,'1':0.1562,'1/0':0.1855,'2/0':0.2223,'3/0':0.2679,'4/0':0.3237},
    'THWN': {'14':0.0097,'12':0.0133,'10':0.0211,'8':0.0366,'6':0.0507,'4':0.0824,'3':0.0973,'2':0.1158,'1':0.1562,'1/0':0.1855,'2/0':0.2223,'3/0':0.2679,'4/0':0.3237},
    'XHHW': {'14':0.0139,'12':0.0181,'10':0.0243,'8':0.0437,'6':0.0590,'4':0.0814,'3':0.0962,'2':0.1146,'1':0.1534,'1/0':0.1825,'2/0':0.2190,'3/0':0.2642,'4/0':0.3197}
  };

  // ─────────────────────────────────────────────────────────────────
  // NEC Chapter 9 Table 4 — Internal raceway area (in²), 100%, common trade sizes
  // Values approximate Article 9 Table 4 columns for listed raceway types
  // ─────────────────────────────────────────────────────────────────
  var CONDUIT_AREA = {
    'EMT':    {'1/2':0.304,'3/4':0.533,'1':0.864,'1-1/4':1.496,'1-1/2':2.036,'2':3.356,'2-1/2':5.858,'3':8.846,'4':14.753},
    'RMC':    {'1/2':0.314,'3/4':0.549,'1':0.887,'1-1/4':1.526,'1-1/2':2.071,'2':3.408,'2-1/2':4.866,'3':7.499,'4':12.554},
    'IMC':    {'1/2':0.342,'3/4':0.586,'1':0.959,'1-1/4':1.647,'1-1/2':2.225,'2':3.630,'2-1/2':5.135,'3':7.922,'4':13.090},
    'PVC40':  {'1/2':0.285,'3/4':0.508,'1':0.832,'1-1/4':1.453,'1-1/2':1.986,'2':3.291,'2-1/2':4.695,'3':7.268,'4':12.554},
    'PVC80':  {'1/2':0.217,'3/4':0.409,'1':0.688,'1-1/4':1.237,'1-1/2':1.711,'2':2.874,'2-1/2':4.119,'3':6.442,'4':11.258},
    'FMC':    {'1/2':0.317,'3/4':0.533,'1':0.817,'1-1/4':1.277,'1-1/2':1.858,'2':3.269,'2-1/2':4.909,'3':7.069,'4':12.566},
    'LFNC':   {'1/2':0.314,'3/4':0.541,'1':0.873,'1-1/4':1.528,'1-1/2':1.981,'2':3.246}
  };

  // ─────────────────────────────────────────────────────────────────
  // NEC 310.16 — Ampacity @ 75°C and 90°C (Cu/Al) for common sizes
  // ─────────────────────────────────────────────────────────────────
  var AMPACITY = {
    'Cu': {
      '75':  {'14':20,'12':25,'10':35,'8':50,'6':65,'4':85,'3':100,'2':115,'1':130,'1/0':150,'2/0':175,'3/0':200,'4/0':230,'250':255,'300':285,'350':310,'400':335,'500':380},
      '90':  {'14':25,'12':30,'10':40,'8':55,'6':75,'4':95,'3':115,'2':130,'1':145,'1/0':170,'2/0':195,'3/0':225,'4/0':260,'250':290,'300':320,'350':350,'400':380,'500':430}
    },
    'Al': {
      '75':  {'12':20,'10':30,'8':40,'6':50,'4':65,'3':75,'2':90,'1':100,'1/0':120,'2/0':135,'3/0':155,'4/0':180,'250':205,'300':230,'350':250,'400':270,'500':310},
      '90':  {'12':25,'10':35,'8':45,'6':60,'4':75,'3':85,'2':100,'1':115,'1/0':135,'2/0':150,'3/0':175,'4/0':205,'250':230,'300':260,'350':280,'400':305,'500':350}
    }
  };

  // NEC 310.15(B)(1) — Ambient correction (90°C column), C ranges midpoint
  // Key = ambient °C (upper bound), value = correction factor
  var AMBIENT_90 = [
    {maxC:25,  f:1.04},
    {maxC:30,  f:1.00},
    {maxC:35,  f:0.96},
    {maxC:40,  f:0.91},
    {maxC:45,  f:0.87},
    {maxC:50,  f:0.82},
    {maxC:55,  f:0.76},
    {maxC:60,  f:0.71},
    {maxC:65,  f:0.65},
    {maxC:70,  f:0.58}
  ];

  // NEC 240.6(A) — Standard ampere ratings for fuses and inverse-time breakers
  var STD_OCPD = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400,450,500,600,700,800,1000,1200];
  function nextStd(a){
    var i; for(i=0;i<STD_OCPD.length;i++){ if(STD_OCPD[i] >= a) return STD_OCPD[i]; }
    return STD_OCPD[STD_OCPD.length-1];
  }

  // ═════════════════════════════════════════════════════════════════
  // 1. voltageDrop — NEC Ch.9 T.8 CM method
  // VD = (2*K*L*I)/CM  (1φ)  ·  VD = (1.732*K*L*I)/CM  (3φ)
  // K = 12.9 Cu · 21.2 Al
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['voltageDrop'] = {
    i18n: {
      es: {
        mp_vd_title:'Caída de voltaje',
        mp_vd_sub:'NEC Cap. 9 Tabla 8 · método CM',
        mp_vd_len:'Longitud (un sentido)',
        mp_vd_amps:'Corriente de carga',
        mp_vd_v:'Voltaje del sistema',
        mp_vd_phase:'Fase',
        mp_vd_awg:'Calibre',
        mp_vd_mat:'Material',
        mp_vd_res:'Caída de voltaje',
        mp_vd_pct:'Porcentaje de caída',
        mp_vd_vend:'Voltaje en la carga',
        mp_vd_branch:'Ramal (≤3%)',
        mp_vd_feeder:'Alimentador (≤5%)',
        mp_vd_pass:'Aprobado',
        mp_vd_fail:'Excede límite NEC',
        mp_vd_desc:'VD = (2·K·L·I)/CM (1Φ) · VD = (√3·K·L·I)/CM (3Φ)',
        mp_vd_ktbl:'K: Cu 12.9 · Al 21.2',
        mp_vd_case:'Condensador 5 ton 220V 1Φ 30 A → VD en 150 ft de #8 Cu = (2·12.9·150·30)/16510 = 7.0 V = 3.2%. Subir a #6 para cumplir 3%.',
        mp_vd_tip:'NEC 210.19/215.2 FPN recomienda ≤3% en ramales y ≤5% combinado ramal + alimentador.'
      },
      en: {
        mp_vd_title:'Voltage drop',
        mp_vd_sub:'NEC Ch.9 Table 8 · CM method',
        mp_vd_len:'One-way length',
        mp_vd_amps:'Load current',
        mp_vd_v:'System voltage',
        mp_vd_phase:'Phase',
        mp_vd_awg:'AWG/kcmil',
        mp_vd_mat:'Material',
        mp_vd_res:'Voltage drop',
        mp_vd_pct:'Drop percentage',
        mp_vd_vend:'Voltage at load',
        mp_vd_branch:'Branch (≤3%)',
        mp_vd_feeder:'Feeder (≤5%)',
        mp_vd_pass:'Pass',
        mp_vd_fail:'Exceeds NEC limit',
        mp_vd_desc:'VD = (2·K·L·I)/CM (1Φ) · VD = (√3·K·L·I)/CM (3Φ)',
        mp_vd_ktbl:'K: Cu 12.9 · Al 21.2',
        mp_vd_case:'5-ton condenser 220V 1φ 30 A → VD over 150 ft of #8 Cu = (2·12.9·150·30)/16510 = 7.0 V = 3.2%. Step up to #6 to meet 3%.',
        mp_vd_tip:'NEC 210.19/215.2 FPN recommends ≤3% branch and ≤5% branch+feeder combined.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.voltageDrop) || {};
      var L = num(s.length, 150);
      var I = num(s.amps, 30);
      var V = num(s.v, 220);
      var ph = s.phase || '1';
      var awg = s.awg || '8';
      var mat = s.mat || 'Cu';
      var K = (mat === 'Al') ? 21.2 : 12.9;
      var CM = CM_TABLE[awg] || CM_TABLE['8'];
      var vd = (ph === '3') ? (SQRT3 * K * L * I) / CM : (2 * K * L * I) / CM;
      var pct = (V > 0) ? (vd / V) * 100 : 0;
      var vLoad = V - vd;
      var branchPass = pct <= 3;
      var feederPass = pct <= 5;
      var awgOpts='', matOpts='', phOpts='', i;
      for(i=0;i<AWG_LIST.length;i++) awgOpts += '<option value="'+AWG_LIST[i]+'"'+(awg===AWG_LIST[i]?' selected':'')+'>#'+AWG_LIST[i]+'</option>';
      var mats = ['Cu','Al'];
      for(i=0;i<mats.length;i++) matOpts += '<option value="'+mats[i]+'"'+(mat===mats[i]?' selected':'')+'>'+mats[i]+'</option>';
      var phs = [['1','1Φ'],['3','3Φ']];
      for(i=0;i<phs.length;i++) phOpts += '<option value="'+phs[i][0]+'"'+(ph===phs[i][0]?' selected':'')+'>'+phs[i][1]+'</option>';
      var color = branchPass ? '#059669' : (feederPass ? '#D97706' : '#DC2626');

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_len','Length'))+'</span><span class="mp-unit">ft</span></div>'+
            '<input type="number" class="mp-in" data-in="voltageDrop.length" value="'+L+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_amps','Load current'))+'</span><span class="mp-unit">A</span></div>'+
            '<input type="number" class="mp-in" data-in="voltageDrop.amps" value="'+I+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_v','Voltage'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="voltageDrop.v" value="'+V+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_phase','Phase'))+'</span><span class="mp-unit">Φ</span></div>'+
            '<select class="mp-in" data-in="voltageDrop.phase">'+phOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_awg','AWG'))+'</span><span class="mp-unit">CM='+CM+'</span></div>'+
            '<select class="mp-in" data-in="voltageDrop.awg">'+awgOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_vd_mat','Material'))+'</span><span class="mp-unit">K='+K+'</span></div>'+
            '<select class="mp-in" data-in="voltageDrop.mat">'+matOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_vd_res','Voltage drop'))+'</div>'+
          '<div class="mp-res-main">'+fmt(vd,2)+'<span class="mp-res-unit">V</span></div>'+
          '<div class="mp-res-desc" style="color:'+color+' !important;font-weight:600;">'+fmt(pct,2)+'% · '+esc(branchPass?t('mp_vd_pass','Pass'):t('mp_vd_fail','Exceeds'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_vd_vend','V at load'))+'</div><div class="mp-res-val">'+fmt(vLoad,1)+' V</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_vd_branch','Branch ≤3%'))+'</div><div class="mp-res-val">'+(branchPass?'✓':'✗')+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_vd_feeder','Feeder ≤5%'))+'</div><div class="mp-res-val">'+(feederPass?'✓':'✗')+'</div></div>'+
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">210.19 FPN</div></div>'+
          '</div>'+
          '<div class="mp-res-desc" style="margin-top:10px;">'+esc(t('mp_vd_desc',''))+' · '+esc(t('mp_vd_ktbl',''))+'</div>'+
        '</div>'+
        exampleTip('mp_vd_case','mp_vd_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 2. conduitFill — NEC Ch.9 Tables 4 & 5
  // Max fill: 1 wire = 53% · 2 wires = 31% · ≥3 wires = 40%
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['conduitFill'] = {
    i18n: {
      es: {
        mp_cf_title:'Llenado de tubería',
        mp_cf_sub:'NEC Cap. 9 Tablas 4 y 5',
        mp_cf_type:'Tipo de tubería',
        mp_cf_size:'Tamaño comercial',
        mp_cf_ins:'Aislamiento',
        mp_cf_n14:'# 14 AWG',
        mp_cf_n12:'# 12 AWG',
        mp_cf_n10:'# 10 AWG',
        mp_cf_n8:'# 8 AWG',
        mp_cf_n6:'# 6 AWG',
        mp_cf_area:'Área ocupada',
        mp_cf_max:'Área máxima permitida',
        mp_cf_pct:'% de llenado',
        mp_cf_pass:'Aprobado',
        mp_cf_fail:'Excede permitido',
        mp_cf_total:'Conductores',
        mp_cf_rule:'Regla',
        mp_cf_desc:'1 conductor ≤53% · 2 conductores ≤31% · 3+ ≤40%',
        mp_cf_quick:'Referencia rápida',
        mp_cf_case:'3× #12 THHN en EMT 1/2": 3×0.0133 = 0.040 in² ÷ 0.304 × 100 = 13% · aprueba holgadamente.',
        mp_cf_tip:'Cuenta el conductor de tierra como un conductor de corriente para llenado (aunque no para ampacidad).'
      },
      en: {
        mp_cf_title:'Conduit fill',
        mp_cf_sub:'NEC Ch.9 Tables 4 & 5',
        mp_cf_type:'Conduit type',
        mp_cf_size:'Trade size',
        mp_cf_ins:'Insulation',
        mp_cf_n14:'# 14 AWG',
        mp_cf_n12:'# 12 AWG',
        mp_cf_n10:'# 10 AWG',
        mp_cf_n8:'# 8 AWG',
        mp_cf_n6:'# 6 AWG',
        mp_cf_area:'Fill area',
        mp_cf_max:'Max allowed',
        mp_cf_pct:'Fill %',
        mp_cf_pass:'Pass',
        mp_cf_fail:'Exceeds allowed',
        mp_cf_total:'Conductors',
        mp_cf_rule:'Rule',
        mp_cf_desc:'1 wire ≤53% · 2 wires ≤31% · 3+ wires ≤40%',
        mp_cf_quick:'Quick reference',
        mp_cf_case:'3× #12 THHN in 1/2" EMT: 3×0.0133 = 0.040 in² ÷ 0.304 × 100 = 13% · passes easily.',
        mp_cf_tip:'Count the equipment ground as a current-carrying wire for fill (not for ampacity).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.conduitFill) || {};
      var ctype = s.ctype || 'EMT';
      var size = s.size || '1/2';
      var ins = s.ins || 'THHN';
      var n14 = num(s.n14, 0);
      var n12 = num(s.n12, 3);
      var n10 = num(s.n10, 0);
      var n8  = num(s.n8, 0);
      var n6  = num(s.n6, 0);
      var W = WIRE_AREA[ins] || WIRE_AREA.THHN;
      var fillArea = n14*W['14'] + n12*W['12'] + n10*W['10'] + n8*W['8'] + n6*W['6'];
      var totalN = n14+n12+n10+n8+n6;
      var rule = (totalN <= 0) ? 0.40 : (totalN === 1 ? 0.53 : (totalN === 2 ? 0.31 : 0.40));
      var caMap = CONDUIT_AREA[ctype] || CONDUIT_AREA.EMT;
      var cA = caMap[size] || 0;
      var maxA = cA * rule;
      var pct = (cA > 0) ? (fillArea / cA) * 100 : 0;
      var pass = (fillArea <= maxA);
      var color = pass ? '#059669' : '#DC2626';
      var types = ['EMT','RMC','IMC','PVC40','PVC80','FMC','LFNC'];
      var tOpts='', szOpts='', inOpts='', i;
      for(i=0;i<types.length;i++) tOpts += '<option value="'+types[i]+'"'+(ctype===types[i]?' selected':'')+'>'+types[i]+'</option>';
      var sizes = Object.keys(caMap);
      for(i=0;i<sizes.length;i++) szOpts += '<option value="'+sizes[i]+'"'+(size===sizes[i]?' selected':'')+'>'+sizes[i]+'"</option>';
      var inss = ['THHN','THWN','XHHW'];
      for(i=0;i<inss.length;i++) inOpts += '<option value="'+inss[i]+'"'+(ins===inss[i]?' selected':'')+'>'+inss[i]+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_type','Type'))+'</span><span class="mp-unit">Ch.9 T.4</span></div>'+
            '<select class="mp-in" data-in="conduitFill.ctype">'+tOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_size','Size'))+'</span><span class="mp-unit">in</span></div>'+
            '<select class="mp-in" data-in="conduitFill.size">'+szOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_ins','Insulation'))+'</span><span class="mp-unit">Ch.9 T.5</span></div>'+
            '<select class="mp-in" data-in="conduitFill.ins">'+inOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_n14','#14'))+'</span><span class="mp-unit">×'+fmt(W['14'],4)+' in²</span></div>'+
            '<input type="number" class="mp-in" data-in="conduitFill.n14" value="'+n14+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_n12','#12'))+'</span><span class="mp-unit">×'+fmt(W['12'],4)+' in²</span></div>'+
            '<input type="number" class="mp-in" data-in="conduitFill.n12" value="'+n12+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_n10','#10'))+'</span><span class="mp-unit">×'+fmt(W['10'],4)+' in²</span></div>'+
            '<input type="number" class="mp-in" data-in="conduitFill.n10" value="'+n10+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_n8','#8'))+'</span><span class="mp-unit">×'+fmt(W['8'],4)+' in²</span></div>'+
            '<input type="number" class="mp-in" data-in="conduitFill.n8" value="'+n8+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cf_n6','#6'))+'</span><span class="mp-unit">×'+fmt(W['6'],4)+' in²</span></div>'+
            '<input type="number" class="mp-in" data-in="conduitFill.n6" value="'+n6+'" step="1" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_cf_pct','Fill %'))+'</div>'+
          '<div class="mp-res-main">'+fmt(pct,1)+'<span class="mp-res-unit">%</span></div>'+
          '<div class="mp-res-desc" style="color:'+color+' !important;font-weight:600;">'+esc(pass?t('mp_cf_pass','Pass'):t('mp_cf_fail','Exceeds'))+' · '+esc(t('mp_cf_rule','Rule'))+' '+fmt(rule*100,0)+'%</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_cf_area','Fill'))+'</div><div class="mp-res-val">'+fmt(fillArea,3)+' in²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cf_max','Max'))+'</div><div class="mp-res-val">'+fmt(maxA,3)+' in²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cf_total','Conductors'))+'</div><div class="mp-res-val">'+totalN+'</div></div>'+
            '<div><div class="mp-res-item">Conduit ID</div><div class="mp-res-val">'+fmt(cA,3)+' in²</div></div>'+
          '</div>'+
          '<div class="mp-res-desc" style="margin-top:10px;">'+esc(t('mp_cf_desc',''))+'</div>'+
          '<div class="mp-res-desc" style="margin-top:6px;opacity:.9;">'+esc(t('mp_cf_quick','Quick'))+': 3×#12 THHN 1/2" EMT ≈ 13% · 4×#10 THHN 3/4" EMT ≈ 16% · 3×#6 THHN 1" EMT ≈ 18% · 4×#4 THHN 1-1/4" EMT ≈ 22%.</div>'+
        '</div>'+
        exampleTip('mp_cf_case','mp_cf_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 3. wireAmpacity — NEC 310.16 + 310.15(B)(1) ambient correction
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['wireAmpacity'] = {
    i18n: {
      es: {
        mp_wa_title:'Ampacidad del conductor',
        mp_wa_sub:'NEC 310.16 · derateo 310.15(B)(1)',
        mp_wa_awg:'Calibre',
        mp_wa_mat:'Material',
        mp_wa_temp:'Temperatura aisl.',
        mp_wa_amb:'Ambiente',
        mp_wa_unit:'Unidad',
        mp_wa_base:'Ampacidad base',
        mp_wa_cf:'Factor de corrección',
        mp_wa_der:'Ampacidad derateada',
        mp_wa_desc:'Ampacidad @ 30°C · factor aplicado por temperatura ambiente',
        mp_wa_case:'#6 Cu THHN @ 90°C, base 75 A. Espacio mecánico a 45°C → factor 0.87 → derateado 65.3 A.',
        mp_wa_tip:'Usa columna 75°C de 310.16 al conectarse a terminales 75°C típicas; el 90°C solo sirve para iniciar el derateo.'
      },
      en: {
        mp_wa_title:'Conductor ampacity',
        mp_wa_sub:'NEC 310.16 · 310.15(B)(1) derate',
        mp_wa_awg:'AWG/kcmil',
        mp_wa_mat:'Material',
        mp_wa_temp:'Ins. temp',
        mp_wa_amb:'Ambient',
        mp_wa_unit:'Unit',
        mp_wa_base:'Base ampacity',
        mp_wa_cf:'Correction factor',
        mp_wa_der:'Derated ampacity',
        mp_wa_desc:'Ampacity @ 30°C · factor applied per ambient temperature',
        mp_wa_case:'#6 Cu THHN @ 90°C, base 75 A. Mechanical room at 45°C → 0.87 factor → 65.3 A derated.',
        mp_wa_tip:'Use 75°C column of 310.16 when connected to typical 75°C terminals; 90°C is only the starting point for derating.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.wireAmpacity) || {};
      var awg = s.awg || '6';
      var mat = s.mat || 'Cu';
      var temp = s.temp || '90';
      var amb = num(s.amb, 45);
      var unit = s.unit || 'C';
      var ambC = (unit === 'F') ? (amb - 32) * 5/9 : amb;
      var base = ((AMPACITY[mat] || {})[temp] || {})[awg];
      var cf = 1.0, i;
      for (i=0;i<AMBIENT_90.length;i++){
        if (ambC <= AMBIENT_90[i].maxC){ cf = AMBIENT_90[i].f; break; }
      }
      if (ambC > AMBIENT_90[AMBIENT_90.length-1].maxC) cf = AMBIENT_90[AMBIENT_90.length-1].f;
      var derated = (base != null) ? (base * cf) : null;
      var awgOpts='', matOpts='', tOpts='', uOpts='';
      for(i=0;i<AWG_LIST.length;i++) awgOpts += '<option value="'+AWG_LIST[i]+'"'+(awg===AWG_LIST[i]?' selected':'')+'>#'+AWG_LIST[i]+'</option>';
      var mats=['Cu','Al']; for(i=0;i<mats.length;i++) matOpts += '<option value="'+mats[i]+'"'+(mat===mats[i]?' selected':'')+'>'+mats[i]+'</option>';
      var temps=['75','90']; for(i=0;i<temps.length;i++) tOpts += '<option value="'+temps[i]+'"'+(temp===temps[i]?' selected':'')+'>'+temps[i]+'°C</option>';
      var units=['C','F']; for(i=0;i<units.length;i++) uOpts += '<option value="'+units[i]+'"'+(unit===units[i]?' selected':'')+'>°'+units[i]+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wa_awg','AWG'))+'</span><span class="mp-unit">310.16</span></div>'+
            '<select class="mp-in" data-in="wireAmpacity.awg">'+awgOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wa_mat','Material'))+'</span><span class="mp-unit">Cu/Al</span></div>'+
            '<select class="mp-in" data-in="wireAmpacity.mat">'+matOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wa_temp','Temp'))+'</span><span class="mp-unit">°C</span></div>'+
            '<select class="mp-in" data-in="wireAmpacity.temp">'+tOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wa_amb','Ambient'))+'</span><span class="mp-unit">°'+unit+'</span></div>'+
            '<input type="number" class="mp-in" data-in="wireAmpacity.amb" value="'+amb+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wa_unit','Unit'))+'</span><span class="mp-unit">°C/°F</span></div>'+
            '<select class="mp-in" data-in="wireAmpacity.unit">'+uOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_wa_der','Derated ampacity'))+'</div>'+
          '<div class="mp-res-main">'+(derated!=null?fmt(derated,1):'—')+'<span class="mp-res-unit">A</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_wa_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_wa_base','Base'))+'</div><div class="mp-res-val">'+(base!=null?fmt(base,0)+' A':'—')+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_wa_cf','CF'))+'</div><div class="mp-res-val">'+fmt(cf,2)+'</div></div>'+
            '<div><div class="mp-res-item">Ambient</div><div class="mp-res-val">'+fmt(ambC,0)+'°C</div></div>'+
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">310.16</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_wa_case','mp_wa_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 4. motorBreaker — NEC 430.52 max OCPD sizing
  // ITB 250% · NTD fuse 300% · TD fuse 175% · Inst trip 800%
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['motorBreaker'] = {
    i18n: {
      es: {
        mp_mb_title:'Protección de motor',
        mp_mb_sub:'NEC 430.52 · tamaño máximo',
        mp_mb_fla:'FLA del motor',
        mp_mb_type:'Tipo de protección',
        mp_mb_itb:'Breaker tiempo inverso (250%)',
        mp_mb_ntd:'Fusible sin retardo (300%)',
        mp_mb_td:'Fusible con retardo (175%)',
        mp_mb_inst:'Disparo instantáneo (800%)',
        mp_mb_calc:'Cálculo',
        mp_mb_std:'Próximo estándar superior',
        mp_mb_pct:'Porcentaje aplicado',
        mp_mb_desc:'Máximo permitido · siguiente tamaño estándar NEC 240.6',
        mp_mb_case:'Compresor 3φ FLA 28 A + breaker ITB: 28×2.5 = 70 A · próximo estándar = 70 A exacto (o subir a 80 A si no arranca).',
        mp_mb_tip:'Si el motor no arranca con el máximo, NEC 430.52(C)(1) Ex.2 permite subir ITB a 400% antes de fallar la inspección.'
      },
      en: {
        mp_mb_title:'Motor branch protection',
        mp_mb_sub:'NEC 430.52 · max sizing',
        mp_mb_fla:'Motor FLA',
        mp_mb_type:'Protection type',
        mp_mb_itb:'Inverse-time breaker (250%)',
        mp_mb_ntd:'Non-time-delay fuse (300%)',
        mp_mb_td:'Time-delay fuse (175%)',
        mp_mb_inst:'Instantaneous trip (800%)',
        mp_mb_calc:'Calculation',
        mp_mb_std:'Next standard size',
        mp_mb_pct:'Applied percent',
        mp_mb_desc:'Maximum permitted · next standard size per NEC 240.6',
        mp_mb_case:'3φ compressor FLA 28 A + ITB: 28×2.5 = 70 A · next std = 70 A exactly (or bump to 80 A if it won\'t start).',
        mp_mb_tip:'If motor won\'t start at max, NEC 430.52(C)(1) Ex.2 allows ITB up to 400% before failing inspection.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.motorBreaker) || {};
      var fla = num(s.fla, 28);
      var type = s.type || 'ITB';
      var pctMap = {ITB:2.50, NTD:3.00, TD:1.75, INST:8.00};
      var pct = pctMap[type] || 2.50;
      var calc = fla * pct;
      var std = nextStd(calc);
      var opts = [['ITB', t('mp_mb_itb','Inverse-time breaker (250%)')], ['NTD', t('mp_mb_ntd','Non-time-delay fuse (300%)')], ['TD', t('mp_mb_td','Time-delay fuse (175%)')], ['INST', t('mp_mb_inst','Instantaneous trip (800%)')]];
      var tOpts='', i;
      for(i=0;i<opts.length;i++) tOpts += '<option value="'+opts[i][0]+'"'+(type===opts[i][0]?' selected':'')+'>'+esc(opts[i][1])+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_mb_fla','Motor FLA'))+'</span><span class="mp-unit">A</span></div>'+
            '<input type="number" class="mp-in" data-in="motorBreaker.fla" value="'+fla+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_mb_type','Type'))+'</span><span class="mp-unit">430.52</span></div>'+
            '<select class="mp-in" data-in="motorBreaker.type">'+tOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_mb_std','Next standard size'))+'</div>'+
          '<div class="mp-res-main">'+std+'<span class="mp-res-unit">A</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_mb_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_mb_calc','Calc'))+'</div><div class="mp-res-val">'+fmt(calc,1)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_mb_pct','%'))+'</div><div class="mp-res-val">'+fmt(pct*100,0)+'%</div></div>'+
            '<div><div class="mp-res-item">FLA</div><div class="mp-res-val">'+fmt(fla,1)+' A</div></div>'+
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">430.52 · 240.6</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_mb_case','mp_mb_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 5. ohmsLaw — V = I·R  (AC variant uses impedance Z)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['ohmsLaw'] = {
    i18n: {
      es: {
        mp_ol_title:'Ley de Ohm',
        mp_ol_sub:'V = I · R · AC: V = I · Z',
        mp_ol_solve:'Resolver por',
        mp_ol_v:'Voltaje',
        mp_ol_i:'Corriente',
        mp_ol_r:'Resistencia / Impedancia',
        mp_ol_ac:'Corriente alterna',
        mp_ol_desc:'Dos variables conocidas resuelven la tercera',
        mp_ol_case:'Calentador 240 V con 12 Ω → I = 240/12 = 20 A · P = 240×20 = 4,800 W (usa Watts Law).',
        mp_ol_tip:'En AC, la Z incluye reactancia: Z=√(R²+X²). Motores y transformadores tienen Z mayor que R pura.'
      },
      en: {
        mp_ol_title:"Ohm's Law",
        mp_ol_sub:'V = I · R · AC: V = I · Z',
        mp_ol_solve:'Solve for',
        mp_ol_v:'Voltage',
        mp_ol_i:'Current',
        mp_ol_r:'Resistance / Impedance',
        mp_ol_ac:'Alternating current',
        mp_ol_desc:'Any two knowns solve the third',
        mp_ol_case:'240 V heater with 12 Ω → I = 240/12 = 20 A · P = 240×20 = 4,800 W (use Watts Law).',
        mp_ol_tip:'In AC, Z includes reactance: Z=√(R²+X²). Motors and transformers have Z greater than pure R.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ohmsLaw) || {};
      var solve = s.solve || 'I';
      var V = num(s.v, 240);
      var I = num(s.i, 20);
      var R = num(s.r, 12);
      var ac = s.ac === 'true' || s.ac === true;
      var label = ac ? 'Z' : 'R';
      if (solve === 'V') V = I * R;
      else if (solve === 'I') I = (R > 0) ? V / R : 0;
      else if (solve === 'R') R = (I > 0) ? V / I : 0;
      var solveOpts = '', opts = [['V','V = I · '+label], ['I','I = V / '+label], ['R', label+' = V / I']], i;
      for(i=0;i<opts.length;i++) solveOpts += '<option value="'+opts[i][0]+'"'+(solve===opts[i][0]?' selected':'')+'>'+esc(opts[i][1])+'</option>';
      var acOpts = '<option value="false"'+(!ac?' selected':'')+'>DC (R)</option><option value="true"'+(ac?' selected':'')+'>AC (Z)</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ol_solve','Solve'))+'</span><span class="mp-unit">—</span></div>'+
            '<select class="mp-in" data-in="ohmsLaw.solve">'+solveOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ol_ac','AC/DC'))+'</span><span class="mp-unit">—</span></div>'+
            '<select class="mp-in" data-in="ohmsLaw.ac">'+acOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ol_v','V'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="ohmsLaw.v" value="'+fmt(V,2)+'" step="0.1" '+(solve==='V'?'readonly':'')+' />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ol_i','I'))+'</span><span class="mp-unit">A</span></div>'+
            '<input type="number" class="mp-in" data-in="ohmsLaw.i" value="'+fmt(I,3)+'" step="0.01" '+(solve==='I'?'readonly':'')+' />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ol_r',label))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="ohmsLaw.r" value="'+fmt(R,3)+'" step="0.01" '+(solve==='R'?'readonly':'')+' />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ol_sub','V = I · R'))+'</div>'+
          '<div class="mp-res-main">'+fmt(V,2)+'<span class="mp-res-unit">V</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_ol_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">V</div><div class="mp-res-val">'+fmt(V,2)+' V</div></div>'+
            '<div><div class="mp-res-item">I</div><div class="mp-res-val">'+fmt(I,3)+' A</div></div>'+
            '<div><div class="mp-res-item">'+label+'</div><div class="mp-res-val">'+fmt(R,3)+' Ω</div></div>'+
            '<div><div class="mp-res-item">Mode</div><div class="mp-res-val">'+(ac?'AC':'DC')+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ol_case','mp_ol_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 6. wattsLaw — P = V·I ; P = I²·R ; P = V²/R ; V = P/I ; I = P/V
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['wattsLaw'] = {
    i18n: {
      es: {
        mp_wl_title:'Ley de Watts',
        mp_wl_sub:'P = V·I = I²R = V²/R',
        mp_wl_known:'Conocidas',
        mp_wl_p:'Potencia',
        mp_wl_v:'Voltaje',
        mp_wl_i:'Corriente',
        mp_wl_r:'Resistencia',
        mp_wl_desc:'Dos cantidades resuelven todo el triángulo de potencia',
        mp_wl_case:'Resistencia 10 kW 240V → I = 10,000/240 = 41.7 A · R = 240²/10,000 = 5.76 Ω.',
        mp_wl_tip:'Para cargas AC no resistivas (motores), usa P = V·I·PF; la fórmula pura aplica a cargas resistivas (calefacción).'
      },
      en: {
        mp_wl_title:"Watts' Law",
        mp_wl_sub:'P = V·I = I²R = V²/R',
        mp_wl_known:'Knowns',
        mp_wl_p:'Power',
        mp_wl_v:'Voltage',
        mp_wl_i:'Current',
        mp_wl_r:'Resistance',
        mp_wl_desc:'Any two quantities solve the full power triangle',
        mp_wl_case:'10 kW heater at 240 V → I = 10,000/240 = 41.7 A · R = 240²/10,000 = 5.76 Ω.',
        mp_wl_tip:'For non-resistive AC loads (motors), use P = V·I·PF; pure formula applies to resistive loads (heating).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.wattsLaw) || {};
      var known = s.known || 'VI';
      var V = num(s.v, 240);
      var I = num(s.i, 41.67);
      var R = num(s.r, 5.76);
      var P = num(s.p, 10000);
      if (known === 'VI'){ P = V*I; R = (I>0) ? V/I : 0; }
      else if (known === 'VR'){ I = (R>0) ? V/R : 0; P = (R>0) ? V*V/R : 0; }
      else if (known === 'IR'){ V = I*R; P = I*I*R; }
      else if (known === 'PV'){ I = (V>0) ? P/V : 0; R = (P>0 && V>0) ? V*V/P : 0; }
      else if (known === 'PI'){ V = (I>0) ? P/I : 0; R = (I>0) ? P/(I*I) : 0; }
      else if (known === 'PR'){ V = Math.sqrt(Math.max(0,P*R)); I = (R>0) ? Math.sqrt(Math.max(0,P/R)) : 0; }
      var kOpts='', opts = [['VI','V + I'],['VR','V + R'],['IR','I + R'],['PV','P + V'],['PI','P + I'],['PR','P + R']], i;
      for(i=0;i<opts.length;i++) kOpts += '<option value="'+opts[i][0]+'"'+(known===opts[i][0]?' selected':'')+'>'+opts[i][1]+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wl_known','Knowns'))+'</span><span class="mp-unit">—</span></div>'+
            '<select class="mp-in" data-in="wattsLaw.known">'+kOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wl_v','V'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="wattsLaw.v" value="'+fmt(V,2)+'" step="0.1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wl_i','I'))+'</span><span class="mp-unit">A</span></div>'+
            '<input type="number" class="mp-in" data-in="wattsLaw.i" value="'+fmt(I,3)+'" step="0.01" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wl_r','R'))+'</span><span class="mp-unit">Ω</span></div>'+
            '<input type="number" class="mp-in" data-in="wattsLaw.r" value="'+fmt(R,3)+'" step="0.01" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_wl_p','P'))+'</span><span class="mp-unit">W</span></div>'+
            '<input type="number" class="mp-in" data-in="wattsLaw.p" value="'+fmt(P,1)+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_wl_p','Power'))+'</div>'+
          '<div class="mp-res-main">'+fmt(P,1)+'<span class="mp-res-unit">W</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_wl_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">V</div><div class="mp-res-val">'+fmt(V,2)+' V</div></div>'+
            '<div><div class="mp-res-item">I</div><div class="mp-res-val">'+fmt(I,3)+' A</div></div>'+
            '<div><div class="mp-res-item">R</div><div class="mp-res-val">'+fmt(R,3)+' Ω</div></div>'+
            '<div><div class="mp-res-item">kW</div><div class="mp-res-val">'+fmt(P/1000,3)+' kW</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_wl_case','mp_wl_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 7. runCap — Run capacitor MFD estimate for PSC motors
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['runCap'] = {
    i18n: {
      es: {
        mp_rc_title:'Capacitor de marcha',
        mp_rc_sub:'Motor PSC · rango estimado MFD',
        mp_rc_hp:'Potencia',
        mp_rc_v:'Voltaje',
        mp_rc_hz:'Frecuencia',
        mp_rc_res:'MFD estimado',
        mp_rc_lo:'Mínimo (−10%)',
        mp_rc_hi:'Máximo (+10%)',
        mp_rc_tol:'Tolerancia típica ±5% a ±10%',
        mp_rc_desc:'PSC · motores de condensador permanente · valores nominales',
        mp_rc_quick:'Referencia rápida HP→MFD (PSC):',
        mp_rc_case:'Motor ventilador 1/4 HP 240V PSC → 7.5 MFD (rango 6.8–8.3 MFD). Si mides 5 MFD con capacímetro, reemplaza.',
        mp_rc_tip:'Mide siempre con capacímetro descargando antes. Un cap de marcha viejo suele caer 20–40% sin verse inflado.'
      },
      en: {
        mp_rc_title:'Run capacitor',
        mp_rc_sub:'PSC motor · MFD estimate range',
        mp_rc_hp:'Power',
        mp_rc_v:'Voltage',
        mp_rc_hz:'Frequency',
        mp_rc_res:'Estimated MFD',
        mp_rc_lo:'Min (−10%)',
        mp_rc_hi:'Max (+10%)',
        mp_rc_tol:'Typical tolerance ±5% to ±10%',
        mp_rc_desc:'PSC · permanent split capacitor motors · nominal values',
        mp_rc_quick:'Quick reference HP→MFD (PSC):',
        mp_rc_case:'1/4 HP 240V PSC fan motor → 7.5 MFD (range 6.8–8.3 MFD). If capmeter reads 5 MFD, replace it.',
        mp_rc_tip:'Always discharge and measure with capacitance meter. A tired run cap often drops 20–40% without visible bulging.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.runCap) || {};
      var hp = s.hp || '1/4';
      var v = num(s.v, 240);
      var hz = s.hz || '60';
      // HP -> nominal MFD lookup (PSC motors at ~230-240V)
      var MAP = {'1/6':5, '1/4':7.5, '1/3':10, '1/2':15, '3/4':20, '1':30, '1.5':40, '2':45, '3':50, '5':60};
      var nominal = MAP[hp] || 7.5;
      // Voltage scaling: capacitance inversely proportional to V² (approx) for similar reactance target
      // Keep nominal for 230–240 V; scale to 115 V by ×4
      var adj = (v < 160) ? 4 : 1;
      var mfd = nominal * adj;
      var lo = mfd * 0.90;
      var hi = mfd * 1.10;
      var hps = ['1/6','1/4','1/3','1/2','3/4','1','1.5','2','3','5'];
      var hpOpts='', hzOpts='', i;
      for(i=0;i<hps.length;i++) hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>';
      var hzs = ['60','50'];
      for(i=0;i<hzs.length;i++) hzOpts += '<option value="'+hzs[i]+'"'+(hz===hzs[i]?' selected':'')+'>'+hzs[i]+' Hz</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rc_hp','HP'))+'</span><span class="mp-unit">HP</span></div>'+
            '<select class="mp-in" data-in="runCap.hp">'+hpOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rc_v','V'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="runCap.v" value="'+v+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_rc_hz','Hz'))+'</span><span class="mp-unit">Hz</span></div>'+
            '<select class="mp-in" data-in="runCap.hz">'+hzOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_rc_res','Estimated MFD'))+'</div>'+
          '<div class="mp-res-main">'+fmt(mfd,1)+'<span class="mp-res-unit">µF</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_rc_tol',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_rc_lo','Min'))+'</div><div class="mp-res-val">'+fmt(lo,1)+' µF</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_rc_hi','Max'))+'</div><div class="mp-res-val">'+fmt(hi,1)+' µF</div></div>'+
            '<div><div class="mp-res-item">Volt</div><div class="mp-res-val">'+v+' V</div></div>'+
            '<div><div class="mp-res-item">Hz</div><div class="mp-res-val">'+hz+'</div></div>'+
          '</div>'+
          '<div class="mp-res-desc" style="margin-top:10px;">'+esc(t('mp_rc_quick',''))+' 1/6→5 · 1/4→7.5 · 1/3→10 · 1/2→15 · 3/4→20 · 1→25-30 · 1.5→35-45 · 2→40-50 µF</div>'+
        '</div>'+
        exampleTip('mp_rc_case','mp_rc_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 8. startCap — Start capacitor sizing (CSIR / CSCR motors)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['startCap'] = {
    i18n: {
      es: {
        mp_sc_title:'Capacitor de arranque',
        mp_sc_sub:'Motor CSIR/CSCR 1Φ · rango MFD',
        mp_sc_hp:'Potencia',
        mp_sc_v:'Voltaje',
        mp_sc_lo:'Mínimo',
        mp_sc_hi:'Máximo',
        mp_sc_res:'MFD arranque',
        mp_sc_desc:'Cap. de arranque se desconecta al ~75% de RPM vía relé',
        mp_sc_quick:'Referencia rápida HP→MFD (arranque):',
        mp_sc_case:'Compresor 1/2 HP CSIR 115V: arranque 189–227 MFD 125VAC · 1 HP 230V: 161–193 MFD 330VAC.',
        mp_sc_tip:'Si falla el relé potencial/SPP, el cap de arranque queda en circuito y se quema en segundos — verifica el relé junto al cap.'
      },
      en: {
        mp_sc_title:'Start capacitor',
        mp_sc_sub:'1Φ CSIR/CSCR motor · MFD range',
        mp_sc_hp:'Power',
        mp_sc_v:'Voltage',
        mp_sc_lo:'Min',
        mp_sc_hi:'Max',
        mp_sc_res:'Start MFD',
        mp_sc_desc:'Start cap switches out at ~75% RPM via relay',
        mp_sc_quick:'Quick reference HP→MFD (start):',
        mp_sc_case:'1/2 HP 115V CSIR compressor: start 189–227 MFD 125VAC · 1 HP 230V: 161–193 MFD 330VAC.',
        mp_sc_tip:'If the potential/SPP relay fails, the start cap stays in circuit and burns in seconds — always check the relay next to the cap.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.startCap) || {};
      var hp = s.hp || '1/2';
      var v = num(s.v, 115);
      // HP -> start cap MFD ranges (single-phase CSIR/CSCR)
      var MAP115 = {'1/6':[88,108],'1/4':[108,130],'1/3':[130,156],'1/2':[189,227],'3/4':[270,324],'1':[378,450]};
      var MAP230 = {'1/3':[64,77],'1/2':[86,103],'3/4':[124,149],'1':[161,193],'1.5':[189,227],'2':[216,260],'3':[270,324],'5':[378,450]};
      var MAP = (v < 160) ? MAP115 : MAP230;
      var rng = MAP[hp] || [0,0];
      var hps = (v < 160) ? ['1/6','1/4','1/3','1/2','3/4','1'] : ['1/3','1/2','3/4','1','1.5','2','3','5'];
      var hpOpts='', i;
      for(i=0;i<hps.length;i++) hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_hp','HP'))+'</span><span class="mp-unit">HP</span></div>'+
            '<select class="mp-in" data-in="startCap.hp">'+hpOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sc_v','V'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="startCap.v" value="'+v+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_sc_res','Start MFD'))+'</div>'+
          '<div class="mp-res-main">'+rng[0]+'–'+rng[1]+'<span class="mp-res-unit">µF</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_sc_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_sc_lo','Min'))+'</div><div class="mp-res-val">'+rng[0]+' µF</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_sc_hi','Max'))+'</div><div class="mp-res-val">'+rng[1]+' µF</div></div>'+
            '<div><div class="mp-res-item">V</div><div class="mp-res-val">'+v+' V</div></div>'+
            '<div><div class="mp-res-item">HP</div><div class="mp-res-val">'+hp+'</div></div>'+
          '</div>'+
          '<div class="mp-res-desc" style="margin-top:10px;">'+esc(t('mp_sc_quick',''))+' 115V 1/4→108-130 · 1/2→189-227 · 3/4→270-324 · 1→378-450 · 230V 1/2→86-103 · 1→161-193 · 2→216-260 · 3→270-324 µF</div>'+
        '</div>'+
        exampleTip('mp_sc_case','mp_sc_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 9. kwHpConv — kW ↔ HP ↔ BHP with motor efficiency
  // 1 HP = 0.7457 kW · BHP = HP / efficiency
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['kwHpConv'] = {
    i18n: {
      es: {
        mp_kh_title:'kW ↔ HP ↔ BHP',
        mp_kh_sub:'1 HP = 0.7457 kW · BHP = HP/η',
        mp_kh_val:'Valor',
        mp_kh_unit:'Unidad origen',
        mp_kh_eff:'Eficiencia del motor',
        mp_kh_kw:'kW (potencia eléctrica)',
        mp_kh_hp:'HP (potencia mecánica)',
        mp_kh_bhp:'BHP (al eje)',
        mp_kh_desc:'BHP es la potencia demandada al eje; HP de placa es mayor por pérdidas de eficiencia',
        mp_kh_case:'Motor 10 HP 92% eficiencia → 10×0.7457/0.92 = 8.1 kW eléctrico · BHP = 10/0.92 = 10.87 BHP.',
        mp_kh_tip:'kW eléctrico de entrada = HP × 0.7457 ÷ eff. Una caída de eficiencia del 5% en un 100 HP = ~4 kW extra (12 k MXN/año).'
      },
      en: {
        mp_kh_title:'kW ↔ HP ↔ BHP',
        mp_kh_sub:'1 HP = 0.7457 kW · BHP = HP/η',
        mp_kh_val:'Value',
        mp_kh_unit:'Source unit',
        mp_kh_eff:'Motor efficiency',
        mp_kh_kw:'kW (electrical input)',
        mp_kh_hp:'HP (mechanical output)',
        mp_kh_bhp:'BHP (shaft demand)',
        mp_kh_desc:'BHP is demand at the shaft; nameplate HP is higher due to efficiency losses',
        mp_kh_case:'10 HP motor at 92% efficiency → 10×0.7457/0.92 = 8.1 kW electrical · BHP = 10/0.92 = 10.87 BHP.',
        mp_kh_tip:'kW input = HP × 0.7457 ÷ eff. A 5% efficiency drop on a 100 HP motor = ~4 kW extra (significant utility cost).'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.kwHpConv) || {};
      var val = num(s.val, 10);
      var unit = s.unit || 'HP';
      var eff = num(s.eff, 92);
      var effD = Math.max(1, Math.min(100, eff)) / 100;
      var hp, kwOut, kwIn, bhp;
      if (unit === 'HP'){
        hp = val;
        kwOut = hp * 0.7457;
        kwIn = kwOut / effD;
        bhp = hp / effD;
      } else if (unit === 'kW'){
        kwIn = val;
        kwOut = kwIn * effD;
        hp = kwOut / 0.7457;
        bhp = hp / effD;
      } else { // BHP
        bhp = val;
        hp = bhp * effD;
        kwOut = hp * 0.7457;
        kwIn = kwOut / effD;
      }
      var units = ['HP','kW','BHP'];
      var uOpts='', i;
      for(i=0;i<units.length;i++) uOpts += '<option value="'+units[i]+'"'+(unit===units[i]?' selected':'')+'>'+units[i]+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_kh_val','Value'))+'</span><span class="mp-unit">'+unit+'</span></div>'+
            '<input type="number" class="mp-in" data-in="kwHpConv.val" value="'+val+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_kh_unit','Unit'))+'</span><span class="mp-unit">—</span></div>'+
            '<select class="mp-in" data-in="kwHpConv.unit">'+uOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_kh_eff','Eff'))+'</span><span class="mp-unit">%</span></div>'+
            '<input type="number" class="mp-in" data-in="kwHpConv.eff" value="'+eff+'" step="0.5" min="1" max="100" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_kh_sub',''))+'</div>'+
          '<div class="mp-res-main">'+fmt(hp,2)+'<span class="mp-res-unit">HP</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_kh_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_kh_kw','kW in'))+'</div><div class="mp-res-val">'+fmt(kwIn,3)+' kW</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_kh_hp','HP out'))+'</div><div class="mp-res-val">'+fmt(hp,2)+' HP</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_kh_bhp','BHP'))+'</div><div class="mp-res-val">'+fmt(bhp,2)+' BHP</div></div>'+
            '<div><div class="mp-res-item">η</div><div class="mp-res-val">'+fmt(eff,1)+' %</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_kh_case','mp_kh_tip');
    }
  };

  // ═════════════════════════════════════════════════════════════════
  // 10. genSize — Generator sizing
  // Running kVA = runningW / (PF·1000) · Peak kVA = (runW + LRA surge) / (PF·1000)
  // ═════════════════════════════════════════════════════════════════
  window.MP_CALCS['genSize'] = {
    i18n: {
      es: {
        mp_gs_title:'Tamaño de generador',
        mp_gs_sub:'Arranque + corrida · kVA recomendada',
        mp_gs_run:'Watts en operación',
        mp_gs_start:'Watts adicionales de arranque',
        mp_gs_v:'Voltaje',
        mp_gs_phase:'Fase',
        mp_gs_pf:'Factor de potencia',
        mp_gs_runkva:'kVA marcha',
        mp_gs_peakkva:'kVA pico (arranque)',
        mp_gs_rec:'Generador recomendado',
        mp_gs_rec_kw:'kW recomendado',
        mp_gs_desc:'kVA = W / (PF×1000) · pico incluye LRA del motor mayor',
        mp_gs_quick:'Guía LRA AC → generador:',
        mp_gs_case:'Casa con AC 3-ton (LRA 90 A 240V = 21.6 kVA) + 5 kW carga base → pico 26.6 kVA · gen 30 kW mínimo.',
        mp_gs_tip:'Soft-starter o VFD reducen LRA hasta 70% y permiten un generador una talla menor — paga solo el primer año.'
      },
      en: {
        mp_gs_title:'Generator sizing',
        mp_gs_sub:'Starting + running · recommended kVA',
        mp_gs_run:'Running watts',
        mp_gs_start:'Starting surge watts',
        mp_gs_v:'Voltage',
        mp_gs_phase:'Phase',
        mp_gs_pf:'Power factor',
        mp_gs_runkva:'Running kVA',
        mp_gs_peakkva:'Peak kVA (start)',
        mp_gs_rec:'Recommended genset',
        mp_gs_rec_kw:'Recommended kW',
        mp_gs_desc:'kVA = W / (PF×1000) · peak includes largest motor LRA',
        mp_gs_quick:'AC LRA → genset guide:',
        mp_gs_case:'House with 3-ton AC (LRA 90 A 240V = 21.6 kVA) + 5 kW base load → peak 26.6 kVA · 30 kW genset minimum.',
        mp_gs_tip:'Soft-starter or VFD cut LRA by up to 70% and let you size down one genset frame — pays back in year one.'
      }
    },
    render: function(state){
      var s = (state.inputs && state.inputs.genSize) || {};
      var runW = num(s.run, 5000);
      var startW = num(s.start, 21600);
      var V = num(s.v, 240);
      var ph = s.phase || '1';
      var pf = num(s.pf, 0.85);
      if (pf <= 0 || pf > 1) pf = 0.85;
      var runKva = runW / (pf * 1000);
      var peakKva = (runW + startW) / (pf * 1000);
      var recKw = Math.ceil(peakKva * pf / 5) * 5; // round up to next 5 kW
      if (recKw < 7) recKw = 7;
      var phOpts='', i;
      var phs = [['1','1Φ'],['3','3Φ']];
      for(i=0;i<phs.length;i++) phOpts += '<option value="'+phs[i][0]+'"'+(ph===phs[i][0]?' selected':'')+'>'+phs[i][1]+'</option>';

      return ''+
        '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gs_run','Running W'))+'</span><span class="mp-unit">W</span></div>'+
            '<input type="number" class="mp-in" data-in="genSize.run" value="'+runW+'" step="100" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gs_start','Surge W'))+'</span><span class="mp-unit">W</span></div>'+
            '<input type="number" class="mp-in" data-in="genSize.start" value="'+startW+'" step="100" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gs_v','V'))+'</span><span class="mp-unit">V</span></div>'+
            '<input type="number" class="mp-in" data-in="genSize.v" value="'+V+'" step="1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gs_phase','Phase'))+'</span><span class="mp-unit">Φ</span></div>'+
            '<select class="mp-in" data-in="genSize.phase">'+phOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_gs_pf','PF'))+'</span><span class="mp-unit">0–1</span></div>'+
            '<input type="number" class="mp-in" data-in="genSize.pf" value="'+pf+'" step="0.01" min="0.1" max="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_gs_rec','Recommended genset'))+'</div>'+
          '<div class="mp-res-main">'+recKw+'<span class="mp-res-unit">kW</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_gs_desc',''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_gs_runkva','Running kVA'))+'</div><div class="mp-res-val">'+fmt(runKva,2)+' kVA</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_gs_peakkva','Peak kVA'))+'</div><div class="mp-res-val">'+fmt(peakKva,2)+' kVA</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_gs_rec_kw','kW'))+'</div><div class="mp-res-val">'+recKw+' kW</div></div>'+
            '<div><div class="mp-res-item">Phase</div><div class="mp-res-val">'+ph+'Φ</div></div>'+
          '</div>'+
          '<div class="mp-res-desc" style="margin-top:10px;">'+esc(t('mp_gs_quick',''))+' AC 1.5-ton LRA ~45 A 240V ≈ 11 kVA surge → 15 kW · 2-ton ~60 A ≈ 14 kVA → 20 kW · 3-ton ~90 A ≈ 22 kVA → 30 kW · 5-ton ~135 A ≈ 32 kVA → 40-45 kW.</div>'+
        '</div>'+
        exampleTip('mp_gs_case','mp_gs_tip');
    }
  };

})();
