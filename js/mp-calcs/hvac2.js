// Maestro Pro · HVAC 2 calculators
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

  // ─────────────────────────────────────────────────────────────────
  // 1) Static Pressure (ESP/TESP)
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['staticPressure'] = {
    i18n: {
      es: {
        mp_sp_title: 'Presión Estática (ESP/TESP)',
        mp_sp_sub: 'Diagnóstico de blower',
        mp_sp_supply: 'SP Suministro (+)',
        mp_sp_supply_u: '" WC',
        mp_sp_return: 'SP Retorno (−)',
        mp_sp_return_u: '" WC',
        mp_sp_filter: 'Caída filtro',
        mp_sp_filter_u: '" WC',
        mp_sp_coil: 'Caída coil',
        mp_sp_coil_u: '" WC',
        mp_sp_rated: 'SP nominal blower',
        mp_sp_rated_u: '" WC',
        mp_sp_res_lbl: 'TESP Total',
        mp_sp_esp: 'ESP (externa)',
        mp_sp_status: 'Estado',
        mp_sp_ok: 'Dentro de rango',
        mp_sp_high: 'Alta — revisa ducto/filtro',
        mp_sp_low: 'Baja — revisa fugas',
        mp_sp_table: 'Referencia típica residencial',
        mp_sp_case: 'Ejemplo: Supply +0.40, Return −0.35, filtro 0.15, coil 0.20 → TESP 0.75" WC. Si blower es 0.5" nominal, estás 50% sobre — bandera roja.',
        mp_sp_tip: 'Tip Chaka: Mide siempre con magnehelic o manómetro BLE antes y después del filtro y del coil. Si TESP pasa de 0.8" WC, el motor calienta y mueres en eficiencia.'
      },
      en: {
        mp_sp_title: 'Static Pressure (ESP/TESP)',
        mp_sp_sub: 'Blower diagnostic',
        mp_sp_supply: 'Supply SP (+)',
        mp_sp_supply_u: '" WC',
        mp_sp_return: 'Return SP (−)',
        mp_sp_return_u: '" WC',
        mp_sp_filter: 'Filter drop',
        mp_sp_filter_u: '" WC',
        mp_sp_coil: 'Coil drop',
        mp_sp_coil_u: '" WC',
        mp_sp_rated: 'Blower rated SP',
        mp_sp_rated_u: '" WC',
        mp_sp_res_lbl: 'Total TESP',
        mp_sp_esp: 'ESP (external)',
        mp_sp_status: 'Status',
        mp_sp_ok: 'Within range',
        mp_sp_high: 'High — check duct/filter',
        mp_sp_low: 'Low — check leakage',
        mp_sp_table: 'Typical residential reference',
        mp_sp_case: 'Example: Supply +0.40, Return −0.35, filter 0.15, coil 0.20 → TESP 0.75" WC. If blower is 0.5" rated, you are 50% over — red flag.',
        mp_sp_tip: 'Chaka Tip: Always measure with a magnehelic or BLE manometer before and after filter and coil. If TESP crosses 0.8" WC the motor overheats and efficiency tanks.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.staticPressure) || {};
      var supply = num(s.supply, 0.40);
      var ret = num(s.ret, 0.35);
      var filterD = num(s.filter, 0.15);
      var coilD = num(s.coil, 0.20);
      var rated = num(s.rated, 0.50);
      var tesp = supply + ret;
      var esp = tesp - (filterD + coilD);
      if (esp < 0) esp = 0;
      var statusKey, statusColor;
      if (tesp > rated * 1.20) { statusKey = 'mp_sp_high'; statusColor = '#F87171'; }
      else if (tesp < rated * 0.60) { statusKey = 'mp_sp_low'; statusColor = '#FBBF24'; }
      else { statusKey = 'mp_sp_ok'; statusColor = '#4ADE80'; }
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_supply','SP Suministro (+)'))+'</span><span class="mp-unit">'+esc(t('mp_sp_supply_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="staticPressure.supply" value="'+supply+'" step="0.01" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_return','SP Retorno (−)'))+'</span><span class="mp-unit">'+esc(t('mp_sp_return_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="staticPressure.ret" value="'+ret+'" step="0.01" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_filter','Caída filtro'))+'</span><span class="mp-unit">'+esc(t('mp_sp_filter_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="staticPressure.filter" value="'+filterD+'" step="0.01" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_coil','Caída coil'))+'</span><span class="mp-unit">'+esc(t('mp_sp_coil_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="staticPressure.coil" value="'+coilD+'" step="0.01" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sp_rated','SP nominal blower'))+'</span><span class="mp-unit">'+esc(t('mp_sp_rated_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="staticPressure.rated" value="'+rated+'" step="0.05" min="0.1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_sp_res_lbl','TESP Total'))+'</div>'+
          '<div class="mp-res-main">'+fmt(tesp,2)+'<span class="mp-res-unit">" WC</span></div>'+
          '<div class="mp-res-desc" style="color:'+statusColor+' !important;font-weight:600;">'+esc(t(statusKey,''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_sp_esp','ESP (externa)'))+'</div><div class="mp-res-val">'+fmt(esp,2)+'" WC</div></div>'+
            '<div><div class="mp-res-item">% del nominal</div><div class="mp-res-val" style="color:'+statusColor+' !important;">'+fmt((tesp/rated)*100,0)+'%</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_sp_table','Referencia típica residencial'))+'</strong><br/>'+
          '0.30–0.50" WC = ideal · 0.50–0.80" WC = aceptable · &gt; 0.80" WC = alto · 0.5" WC = PSC estándar · 0.8" WC = ECM moderno'+
        '</div>'+
        exampleTip('mp_sp_case','mp_sp_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 2) Duct sizing (equal friction)
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['ductSize'] = {
    i18n: {
      es: {
        mp_ds_title: 'Dimensión de Ducto',
        mp_ds_sub: 'Fricción igual (residencial)',
        mp_ds_cfm: 'CFM',
        mp_ds_cfm_u: 'pies³/min',
        mp_ds_fric: 'Fricción',
        mp_ds_fric_u: '" WC/100ft',
        mp_ds_res_lbl: 'Diámetro redondo recomendado',
        mp_ds_rect: 'Rectangular equivalente',
        mp_ds_vel: 'Velocidad estimada',
        mp_ds_table: 'Tabla rápida CFM → Ø',
        mp_ds_case: 'Ejemplo: 800 CFM a 0.10"/100ft → 14" redondo o 12×10 rectangular, velocidad ~750 FPM.',
        mp_ds_tip: 'Tip Chaka: Residencial usa 0.08–0.10" WC/100ft. Nunca uses una sola medida para todo — divide en zonas y reduce troncal según ramales.'
      },
      en: {
        mp_ds_title: 'Duct Sizing',
        mp_ds_sub: 'Equal friction (residential)',
        mp_ds_cfm: 'CFM',
        mp_ds_cfm_u: 'cu ft/min',
        mp_ds_fric: 'Friction',
        mp_ds_fric_u: '" WC/100ft',
        mp_ds_res_lbl: 'Recommended round diameter',
        mp_ds_rect: 'Rectangular equivalent',
        mp_ds_vel: 'Estimated velocity',
        mp_ds_table: 'Quick CFM → Ø table',
        mp_ds_case: 'Example: 800 CFM at 0.10"/100ft → 14" round or 12×10 rectangular, ~750 FPM velocity.',
        mp_ds_tip: 'Chaka Tip: Residential runs 0.08–0.10" WC/100ft. Don\u2019t use one size for everything — split zones and taper the trunk per branches.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.ductSize) || {};
      var cfm = num(s.cfm, 800);
      var fric = num(s.fric, 0.10);
      if (fric <= 0) fric = 0.1;
      // Lookup-style approximation
      var table = [
        { cfm:100,  d:6 },
        { cfm:150,  d:7 },
        { cfm:220,  d:8 },
        { cfm:300,  d:9 },
        { cfm:400,  d:10 },
        { cfm:550,  d:12 },
        { cfm:800,  d:14 },
        { cfm:1100, d:16 },
        { cfm:1500, d:18 },
        { cfm:2000, d:20 },
        { cfm:2500, d:22 },
        { cfm:3000, d:24 }
      ];
      var diam = 6;
      for (var i=0;i<table.length;i++){ if (cfm >= table[i].cfm) diam = table[i].d; }
      // Adjust for friction target (higher friction → smaller duct)
      var scale = Math.pow(0.10 / fric, 0.20);
      var diamAdj = diam * scale;
      // Round up to nearest even inch
      var diamFinal = Math.ceil(diamAdj / 2) * 2;
      if (diamFinal < 6) diamFinal = 6;
      var areaFt2 = Math.PI * Math.pow(diamFinal/12/2, 2);
      var vel = cfm / areaFt2;
      // Rectangular equivalent (simple): pick a pair that matches area
      var h_in = Math.max(6, Math.round(diamFinal * 0.78));
      var w_in = Math.max(6, Math.round(diamFinal * 1.10));
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ds_cfm','CFM'))+'</span><span class="mp-unit">'+esc(t('mp_ds_cfm_u','pies³/min'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="ductSize.cfm" value="'+cfm+'" step="25" min="50" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ds_fric','Fricción'))+'</span><span class="mp-unit">'+esc(t('mp_ds_fric_u','" WC/100ft'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="ductSize.fric" value="'+fric+'" step="0.01" min="0.05" max="0.20" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ds_res_lbl','Diámetro redondo recomendado'))+'</div>'+
          '<div class="mp-res-main">'+diamFinal+'<span class="mp-res-unit">in Ø</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_ds_rect','Rectangular equivalente'))+': '+w_in+'×'+h_in+' in</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ds_vel','Velocidad estimada'))+'</div><div class="mp-res-val">'+fmt(vel,0)+' FPM</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ds_fric','Fricción'))+'</div><div class="mp-res-val">'+fmt(fric,2)+'"/100ft</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_ds_table','Tabla rápida CFM → Ø'))+'</strong><br/>'+
          '400 → 10" · 600 → 12" · 800 → 14" · 1000 → 14–16" · 1200 → 16" · 1600 → 18" · 2000 → 20"'+
        '</div>'+
        exampleTip('mp_ds_case','mp_ds_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 3) Duct velocity (FPM)
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['ductVelocity'] = {
    i18n: {
      es: {
        mp_dv_title: 'Velocidad en Ducto',
        mp_dv_sub: 'FPM = CFM ÷ área',
        mp_dv_cfm: 'CFM',
        mp_dv_cfm_u: 'pies³/min',
        mp_dv_shape: 'Forma',
        mp_dv_shape_u: 'geometría',
        mp_dv_round: 'Redondo',
        mp_dv_rect: 'Rectangular',
        mp_dv_diam: 'Diámetro',
        mp_dv_diam_u: 'in',
        mp_dv_w: 'Ancho',
        mp_dv_w_u: 'in',
        mp_dv_h: 'Alto',
        mp_dv_h_u: 'in',
        mp_dv_res_lbl: 'Velocidad',
        mp_dv_area: 'Área',
        mp_dv_class: 'Clasificación',
        mp_dv_main: 'Troncal',
        mp_dv_branch: 'Ramal',
        mp_dv_reg: 'Registro',
        mp_dv_over: 'Alta — ruido',
        mp_dv_case: 'Ejemplo: 1,200 CFM en ducto 16" redondo → área 1.40 ft² → 857 FPM (troncal OK).',
        mp_dv_tip: 'Tip Chaka: &gt; 900 FPM en registro = silbido. Si el cliente se queja del ruido, primero mide velocidad antes de cambiar el blower.'
      },
      en: {
        mp_dv_title: 'Duct Velocity',
        mp_dv_sub: 'FPM = CFM ÷ area',
        mp_dv_cfm: 'CFM',
        mp_dv_cfm_u: 'cu ft/min',
        mp_dv_shape: 'Shape',
        mp_dv_shape_u: 'geometry',
        mp_dv_round: 'Round',
        mp_dv_rect: 'Rectangular',
        mp_dv_diam: 'Diameter',
        mp_dv_diam_u: 'in',
        mp_dv_w: 'Width',
        mp_dv_w_u: 'in',
        mp_dv_h: 'Height',
        mp_dv_h_u: 'in',
        mp_dv_res_lbl: 'Velocity',
        mp_dv_area: 'Area',
        mp_dv_class: 'Classification',
        mp_dv_main: 'Main trunk',
        mp_dv_branch: 'Branch',
        mp_dv_reg: 'Register',
        mp_dv_over: 'High — noise',
        mp_dv_case: 'Example: 1,200 CFM in a 16" round duct → 1.40 ft² → 857 FPM (trunk OK).',
        mp_dv_tip: 'Chaka Tip: &gt; 900 FPM at a register = whistle. If the customer complains about noise, measure velocity before swapping the blower.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.ductVelocity) || {};
      var cfm = num(s.cfm, 1200);
      var shape = s.shape || 'round';
      var diam = num(s.diam, 16);
      var w = num(s.w, 14);
      var hh = num(s.h, 10);
      var areaFt2;
      if (shape === 'round') {
        areaFt2 = Math.PI * Math.pow(diam/12/2, 2);
      } else {
        areaFt2 = (w * hh) / 144;
      }
      if (areaFt2 <= 0) areaFt2 = 0.01;
      var vel = cfm / areaFt2;
      var classKey, classColor;
      if (vel > 1200) { classKey = 'mp_dv_over'; classColor = '#F87171'; }
      else if (vel >= 900) { classKey = 'mp_dv_main'; classColor = '#4ADE80'; }
      else if (vel >= 600) { classKey = 'mp_dv_branch'; classColor = '#4ADE80'; }
      else if (vel >= 400) { classKey = 'mp_dv_reg'; classColor = '#4ADE80'; }
      else { classKey = 'mp_dv_reg'; classColor = '#FBBF24'; }
      var shapeOpts =
        '<option value="round"'+(shape==='round'?' selected':'')+'>'+esc(t('mp_dv_round','Redondo'))+'</option>'+
        '<option value="rect"'+(shape==='rect'?' selected':'')+'>'+esc(t('mp_dv_rect','Rectangular'))+'</option>';
      var dimInputs;
      if (shape === 'round') {
        dimInputs = '<div class="mp-ig">'+
          '<div class="mp-lbl"><span>'+esc(t('mp_dv_diam','Diámetro'))+'</span><span class="mp-unit">'+esc(t('mp_dv_diam_u','in'))+'</span></div>'+
          '<input type="number" class="mp-in" data-in="ductVelocity.diam" value="'+diam+'" step="1" min="4" />'+
        '</div>';
      } else {
        dimInputs = '<div class="mp-ig">'+
          '<div class="mp-lbl"><span>'+esc(t('mp_dv_w','Ancho'))+'</span><span class="mp-unit">'+esc(t('mp_dv_w_u','in'))+'</span></div>'+
          '<input type="number" class="mp-in" data-in="ductVelocity.w" value="'+w+'" step="1" min="4" />'+
        '</div>'+
        '<div class="mp-ig">'+
          '<div class="mp-lbl"><span>'+esc(t('mp_dv_h','Alto'))+'</span><span class="mp-unit">'+esc(t('mp_dv_h_u','in'))+'</span></div>'+
          '<input type="number" class="mp-in" data-in="ductVelocity.h" value="'+hh+'" step="1" min="4" />'+
        '</div>';
      }
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_dv_cfm','CFM'))+'</span><span class="mp-unit">'+esc(t('mp_dv_cfm_u','pies³/min'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="ductVelocity.cfm" value="'+cfm+'" step="25" min="50" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_dv_shape','Forma'))+'</span><span class="mp-unit">'+esc(t('mp_dv_shape_u','geometría'))+'</span></div>'+
            '<select class="mp-in" data-in="ductVelocity.shape">'+shapeOpts+'</select>'+
          '</div>'+
          dimInputs+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_dv_res_lbl','Velocidad'))+'</div>'+
          '<div class="mp-res-main">'+fmt(vel,0)+'<span class="mp-res-unit">FPM</span></div>'+
          '<div class="mp-res-desc" style="color:'+classColor+' !important;font-weight:600;">'+esc(t(classKey,''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_dv_area','Área'))+'</div><div class="mp-res-val">'+fmt(areaFt2,2)+' ft²</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_dv_class','Clasificación'))+'</div><div class="mp-res-val" style="color:'+classColor+' !important;">'+esc(t(classKey,''))+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_dv_class','Clasificación'))+'</strong><br/>'+
          esc(t('mp_dv_main','Troncal'))+' 900–1200 FPM · '+esc(t('mp_dv_branch','Ramal'))+' 600–900 FPM · '+esc(t('mp_dv_reg','Registro'))+' 500–700 FPM'+
        '</div>'+
        exampleTip('mp_dv_case','mp_dv_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 4) Fan Laws 1/2/3
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['fanLaws'] = {
    i18n: {
      es: {
        mp_fl_title: 'Leyes del Ventilador',
        mp_fl_sub: 'Ley 1/2/3 con RPM',
        mp_fl_cfm1: 'CFM base',
        mp_fl_cfm1_u: 'pies³/min',
        mp_fl_sp1: 'SP base',
        mp_fl_sp1_u: '" WC',
        mp_fl_hp1: 'HP base',
        mp_fl_hp1_u: 'HP',
        mp_fl_rpm1: 'RPM base',
        mp_fl_rpm1_u: 'rpm',
        mp_fl_rpm2: 'RPM nuevo',
        mp_fl_rpm2_u: 'rpm',
        mp_fl_res_lbl: 'CFM nuevo (Ley 1)',
        mp_fl_sp2: 'SP nuevo (Ley 2)',
        mp_fl_hp2: 'HP nuevo (Ley 3)',
        mp_fl_ratio: 'Relación RPM',
        mp_fl_laws: 'Fórmulas',
        mp_fl_case: 'Ejemplo: 1,000 CFM @ 0.5" WC @ 0.5 HP a 900 RPM. Si subes a 1,080 RPM → 1,200 CFM, 0.72" WC, 0.864 HP. Ese 20% más RPM te cuesta 73% más HP.',
        mp_fl_tip: 'Tip Chaka: La Ley 3 es traicionera — pequeños ajustes de polea o RPM mueven el consumo al cubo. Por eso los ECM modulantes te ahorran dinero real.'
      },
      en: {
        mp_fl_title: 'Fan Laws',
        mp_fl_sub: 'Laws 1/2/3 by RPM',
        mp_fl_cfm1: 'Baseline CFM',
        mp_fl_cfm1_u: 'cu ft/min',
        mp_fl_sp1: 'Baseline SP',
        mp_fl_sp1_u: '" WC',
        mp_fl_hp1: 'Baseline HP',
        mp_fl_hp1_u: 'HP',
        mp_fl_rpm1: 'Baseline RPM',
        mp_fl_rpm1_u: 'rpm',
        mp_fl_rpm2: 'New RPM',
        mp_fl_rpm2_u: 'rpm',
        mp_fl_res_lbl: 'New CFM (Law 1)',
        mp_fl_sp2: 'New SP (Law 2)',
        mp_fl_hp2: 'New HP (Law 3)',
        mp_fl_ratio: 'RPM ratio',
        mp_fl_laws: 'Formulas',
        mp_fl_case: 'Example: 1,000 CFM @ 0.5" WC @ 0.5 HP at 900 RPM. Bump to 1,080 RPM → 1,200 CFM, 0.72" WC, 0.864 HP. 20% more RPM costs 73% more HP.',
        mp_fl_tip: 'Chaka Tip: Law 3 is brutal — small pulley/RPM tweaks cube the power draw. That\u2019s why modulating ECMs save real money.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.fanLaws) || {};
      var cfm1 = num(s.cfm1, 1000);
      var sp1 = num(s.sp1, 0.50);
      var hp1 = num(s.hp1, 0.50);
      var rpm1 = num(s.rpm1, 900);
      var rpm2 = num(s.rpm2, 1080);
      if (rpm1 <= 0) rpm1 = 1;
      var r = rpm2 / rpm1;
      var cfm2 = cfm1 * r;
      var sp2 = sp1 * r * r;
      var hp2 = hp1 * r * r * r;
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fl_cfm1','CFM base'))+'</span><span class="mp-unit">'+esc(t('mp_fl_cfm1_u','pies³/min'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="fanLaws.cfm1" value="'+cfm1+'" step="50" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fl_sp1','SP base'))+'</span><span class="mp-unit">'+esc(t('mp_fl_sp1_u','" WC'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="fanLaws.sp1" value="'+sp1+'" step="0.01" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fl_hp1','HP base'))+'</span><span class="mp-unit">'+esc(t('mp_fl_hp1_u','HP'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="fanLaws.hp1" value="'+hp1+'" step="0.05" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fl_rpm1','RPM base'))+'</span><span class="mp-unit">'+esc(t('mp_fl_rpm1_u','rpm'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="fanLaws.rpm1" value="'+rpm1+'" step="10" min="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_fl_rpm2','RPM nuevo'))+'</span><span class="mp-unit">'+esc(t('mp_fl_rpm2_u','rpm'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="fanLaws.rpm2" value="'+rpm2+'" step="10" min="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_fl_res_lbl','CFM nuevo (Ley 1)'))+'</div>'+
          '<div class="mp-res-main">'+fmt(cfm2,0)+'<span class="mp-res-unit">CFM</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_fl_ratio','Relación RPM'))+': '+fmt(r,3)+' ×</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_fl_sp2','SP nuevo (Ley 2)'))+'</div><div class="mp-res-val">'+fmt(sp2,2)+'" WC</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_fl_hp2','HP nuevo (Ley 3)'))+'</div><div class="mp-res-val">'+fmt(hp2,3)+' HP</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_fl_laws','Fórmulas'))+'</strong><br/>'+
          'Ley 1: CFM₂ = CFM₁ × (RPM₂/RPM₁) · Ley 2: SP₂ = SP₁ × (RPM₂/RPM₁)² · Ley 3: HP₂ = HP₁ × (RPM₂/RPM₁)³'+
        '</div>'+
        exampleTip('mp_fl_case','mp_fl_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 5) Psychrometric quick calc
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['psychro'] = {
    i18n: {
      es: {
        mp_ps_title: 'Psicrometría Rápida',
        mp_ps_sub: 'RH, rocío, entalpía',
        mp_ps_db: 'Bulbo seco (DB)',
        mp_ps_db_u: '°F',
        mp_ps_wb: 'Bulbo húmedo (WB)',
        mp_ps_wb_u: '°F',
        mp_ps_p: 'Presión atm.',
        mp_ps_p_u: 'psia',
        mp_ps_res_lbl: 'Humedad relativa',
        mp_ps_dp: 'Punto de rocío',
        mp_ps_w: 'Relación W',
        mp_ps_h: 'Entalpía',
        mp_ps_table: 'Referencias comunes',
        mp_ps_case: 'Ejemplo: 75°F DB, 63°F WB → RH ≈ 50%, dew 55°F, W ≈ 65 gr/lb, h ≈ 28.5 BTU/lb. Condición de confort interior.',
        mp_ps_tip: 'Tip Chaka: En verano Texas interior a 75/50% y afuera 95/55% hay 10 BTU/lb de latente que tu equipo debe quitar. Siempre revisa el ΔH, no solo ΔT.'
      },
      en: {
        mp_ps_title: 'Psychrometric Quick Calc',
        mp_ps_sub: 'RH, dew point, enthalpy',
        mp_ps_db: 'Dry bulb (DB)',
        mp_ps_db_u: '°F',
        mp_ps_wb: 'Wet bulb (WB)',
        mp_ps_wb_u: '°F',
        mp_ps_p: 'Atm pressure',
        mp_ps_p_u: 'psia',
        mp_ps_res_lbl: 'Relative humidity',
        mp_ps_dp: 'Dew point',
        mp_ps_w: 'Humidity ratio W',
        mp_ps_h: 'Enthalpy',
        mp_ps_table: 'Common references',
        mp_ps_case: 'Example: 75°F DB, 63°F WB → RH ~50%, dew 55°F, W ~65 gr/lb, h ~28.5 BTU/lb. Indoor comfort condition.',
        mp_ps_tip: 'Chaka Tip: Texas summer indoor 75/50% vs outdoor 95/55% carries 10 BTU/lb of latent load to remove. Always check ΔH, not just ΔT.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.psychro) || {};
      var dbF = num(s.db, 75);
      var wbF = num(s.wb, 63);
      var psia = num(s.p, 14.7);
      if (wbF > dbF) wbF = dbF;
      // Convert °F → °C for Magnus
      function satP_kPa(tC){ return 0.6108 * Math.exp(17.27 * tC / (tC + 237.3)); }
      var tdbC = (dbF - 32) * 5/9;
      var twbC = (wbF - 32) * 5/9;
      var pAtmKPa = psia * 6.89476;
      var esDB = satP_kPa(tdbC);
      var esWB = satP_kPa(twbC);
      // Carrier approximation for actual vapor pressure
      var e = esWB - (pAtmKPa * (tdbC - twbC) * 0.000662);
      if (e < 0) e = 0;
      var rh = Math.max(0, Math.min(100, (e / esDB) * 100));
      // Humidity ratio W (lb water / lb dry air)
      var W_ratio = 0.622 * e / (pAtmKPa - e);
      var W_gr = W_ratio * 7000; // grains per lb
      // Dew point (Magnus inverse)
      var lnRatio = Math.log(e / 0.6108);
      var dewC;
      if (e > 0) dewC = (237.3 * lnRatio) / (17.27 - lnRatio);
      else dewC = -40;
      var dewF = dewC * 9/5 + 32;
      // Enthalpy in BTU/lb dry air
      var enth = 0.24 * dbF + W_ratio * (1061 + 0.444 * dbF);
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ps_db','Bulbo seco (DB)'))+'</span><span class="mp-unit">'+esc(t('mp_ps_db_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="psychro.db" value="'+dbF+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ps_wb','Bulbo húmedo (WB)'))+'</span><span class="mp-unit">'+esc(t('mp_ps_wb_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="psychro.wb" value="'+wbF+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ps_p','Presión atm.'))+'</span><span class="mp-unit">'+esc(t('mp_ps_p_u','psia'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="psychro.p" value="'+psia+'" step="0.1" min="10" max="16" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ps_res_lbl','Humedad relativa'))+'</div>'+
          '<div class="mp-res-main">'+fmt(rh,0)+'<span class="mp-res-unit">% RH</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_ps_dp','Punto de rocío'))+': '+fmt(dewF,1)+' °F</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ps_w','Relación W'))+'</div><div class="mp-res-val">'+fmt(W_gr,1)+' gr/lb</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_ps_h','Entalpía'))+'</div><div class="mp-res-val">'+fmt(enth,1)+' BTU/lb</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_ps_table','Referencias comunes'))+'</strong><br/>'+
          '75°F/50% RH → h ≈ 28.1 BTU/lb · 80°F/50% → h ≈ 31.3 · 95°F/50% → h ≈ 45.1 · 95°F/40% → h ≈ 39.6'+
        '</div>'+
        exampleTip('mp_ps_case','mp_ps_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 6) Mixed air temperature
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['mixedAir'] = {
    i18n: {
      es: {
        mp_ma_title: 'Temperatura de Aire Mezclado',
        mp_ma_sub: 'Retorno + OA',
        mp_ma_ra_pct: '% Retorno (RA)',
        mp_ma_ra_pct_u: '%',
        mp_ma_oa_pct: '% Aire exterior (OA)',
        mp_ma_oa_pct_u: '%',
        mp_ma_ra_db: 'RA bulbo seco',
        mp_ma_ra_db_u: '°F',
        mp_ma_oa_db: 'OA bulbo seco',
        mp_ma_oa_db_u: '°F',
        mp_ma_ra_wb: 'RA bulbo húmedo',
        mp_ma_ra_wb_u: '°F',
        mp_ma_oa_wb: 'OA bulbo húmedo',
        mp_ma_oa_wb_u: '°F',
        mp_ma_res_lbl: 'Mezcla bulbo seco',
        mp_ma_mwb: 'Mezcla bulbo húmedo',
        mp_ma_sum: 'Suma',
        mp_ma_warn: 'RA + OA debe = 100%',
        mp_ma_case: 'Ejemplo: 80% RA a 75°F / 63°F WB + 20% OA a 95°F / 78°F WB → Mezcla 79°F DB / 66°F WB. Esto golpea al coil.',
        mp_ma_tip: 'Tip Chaka: En verano Texas una mezcla con 20% OA baja SHR del equipo rápido — considera precool o entalpic recovery wheel.'
      },
      en: {
        mp_ma_title: 'Mixed Air Temperature',
        mp_ma_sub: 'Return + OA blend',
        mp_ma_ra_pct: 'Return % (RA)',
        mp_ma_ra_pct_u: '%',
        mp_ma_oa_pct: 'Outside Air % (OA)',
        mp_ma_oa_pct_u: '%',
        mp_ma_ra_db: 'RA dry bulb',
        mp_ma_ra_db_u: '°F',
        mp_ma_oa_db: 'OA dry bulb',
        mp_ma_oa_db_u: '°F',
        mp_ma_ra_wb: 'RA wet bulb',
        mp_ma_ra_wb_u: '°F',
        mp_ma_oa_wb: 'OA wet bulb',
        mp_ma_oa_wb_u: '°F',
        mp_ma_res_lbl: 'Mixed dry bulb',
        mp_ma_mwb: 'Mixed wet bulb',
        mp_ma_sum: 'Sum',
        mp_ma_warn: 'RA + OA must = 100%',
        mp_ma_case: 'Example: 80% RA at 75°F / 63°F WB + 20% OA at 95°F / 78°F WB → Mix 79°F DB / 66°F WB. That hits the coil.',
        mp_ma_tip: 'Chaka Tip: A 20% OA mix in Texas summer tanks system SHR fast — consider pre-cool or an enthalpy recovery wheel.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.mixedAir) || {};
      var raPct = num(s.raPct, 80);
      var oaPct = num(s.oaPct, 20);
      var raDb = num(s.raDb, 75);
      var oaDb = num(s.oaDb, 95);
      var raWb = num(s.raWb, 63);
      var oaWb = num(s.oaWb, 78);
      var sum = raPct + oaPct;
      var mDb = (raPct * raDb + oaPct * oaDb) / (sum || 1);
      var mWb = (raPct * raWb + oaPct * oaWb) / (sum || 1);
      var warn = Math.abs(sum - 100) > 0.5;
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_ra_pct','% Retorno (RA)'))+'</span><span class="mp-unit">'+esc(t('mp_ma_ra_pct_u','%'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.raPct" value="'+raPct+'" step="1" min="0" max="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_oa_pct','% Aire exterior (OA)'))+'</span><span class="mp-unit">'+esc(t('mp_ma_oa_pct_u','%'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.oaPct" value="'+oaPct+'" step="1" min="0" max="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_ra_db','RA bulbo seco'))+'</span><span class="mp-unit">'+esc(t('mp_ma_ra_db_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.raDb" value="'+raDb+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_oa_db','OA bulbo seco'))+'</span><span class="mp-unit">'+esc(t('mp_ma_oa_db_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.oaDb" value="'+oaDb+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_ra_wb','RA bulbo húmedo'))+'</span><span class="mp-unit">'+esc(t('mp_ma_ra_wb_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.raWb" value="'+raWb+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ma_oa_wb','OA bulbo húmedo'))+'</span><span class="mp-unit">'+esc(t('mp_ma_oa_wb_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="mixedAir.oaWb" value="'+oaWb+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ma_res_lbl','Mezcla bulbo seco'))+'</div>'+
          '<div class="mp-res-main">'+fmt(mDb,1)+'<span class="mp-res-unit">°F DB</span></div>'+
          '<div class="mp-res-desc"'+(warn?' style="color:#FBBF24 !important;font-weight:600;"':'')+'>'+esc(t('mp_ma_sum','Suma'))+': '+fmt(sum,0)+'% '+(warn?'— '+esc(t('mp_ma_warn','RA + OA debe = 100%')):'')+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ma_mwb','Mezcla bulbo húmedo'))+'</div><div class="mp-res-val">'+fmt(mWb,1)+' °F WB</div></div>'+
            '<div><div class="mp-res-item">ΔDB (OA−RA)</div><div class="mp-res-val">'+fmt(oaDb-raDb,1)+' °F</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_ma_case','mp_ma_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 7) Air changes per hour / Room CFM
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['airChanges'] = {
    i18n: {
      es: {
        mp_ac_title: 'Cambios de Aire (ACH)',
        mp_ac_sub: 'CFM por cuarto',
        mp_ac_l: 'Largo',
        mp_ac_l_u: 'ft',
        mp_ac_w: 'Ancho',
        mp_ac_w_u: 'ft',
        mp_ac_h: 'Altura',
        mp_ac_h_u: 'ft',
        mp_ac_ach: 'ACH objetivo',
        mp_ac_ach_u: 'cambios/hr',
        mp_ac_res_lbl: 'CFM requerido',
        mp_ac_vol: 'Volumen',
        mp_ac_typical: 'ACH típicos',
        mp_ac_case: 'Ejemplo: Cocina comercial 20×15×10 ft = 3,000 ft³ × 20 ACH ÷ 60 = 1,000 CFM de extracción + reposición.',
        mp_ac_tip: 'Tip Chaka: Balance siempre extract vs make-up. Si la cocina extrae 1,000 CFM y no devuelves lo mismo, el negocio se te llena de humo y el comal no enciende.'
      },
      en: {
        mp_ac_title: 'Air Changes (ACH)',
        mp_ac_sub: 'Room CFM',
        mp_ac_l: 'Length',
        mp_ac_l_u: 'ft',
        mp_ac_w: 'Width',
        mp_ac_w_u: 'ft',
        mp_ac_h: 'Height',
        mp_ac_h_u: 'ft',
        mp_ac_ach: 'Target ACH',
        mp_ac_ach_u: 'changes/hr',
        mp_ac_res_lbl: 'Required CFM',
        mp_ac_vol: 'Volume',
        mp_ac_typical: 'Typical ACH',
        mp_ac_case: 'Example: Commercial kitchen 20×15×10 ft = 3,000 ft³ × 20 ACH ÷ 60 = 1,000 CFM exhaust plus make-up.',
        mp_ac_tip: 'Chaka Tip: Always balance exhaust vs make-up air. Pull 1,000 CFM without replacement and the kitchen fills with smoke and burners won\u2019t light.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.airChanges) || {};
      var L = num(s.L, 20);
      var W = num(s.W, 15);
      var H = num(s.H, 10);
      var ach = num(s.ach, 10);
      var vol = L * W * H;
      var cfm = (vol * ach) / 60;
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_l','Largo'))+'</span><span class="mp-unit">'+esc(t('mp_ac_l_u','ft'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="airChanges.L" value="'+L+'" step="1" min="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_w','Ancho'))+'</span><span class="mp-unit">'+esc(t('mp_ac_w_u','ft'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="airChanges.W" value="'+W+'" step="1" min="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_h','Altura'))+'</span><span class="mp-unit">'+esc(t('mp_ac_h_u','ft'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="airChanges.H" value="'+H+'" step="0.5" min="6" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_ac_ach','ACH objetivo'))+'</span><span class="mp-unit">'+esc(t('mp_ac_ach_u','cambios/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="airChanges.ach" value="'+ach+'" step="1" min="1" max="60" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_ac_res_lbl','CFM requerido'))+'</div>'+
          '<div class="mp-res-main">'+fmt(cfm,0)+'<span class="mp-res-unit">CFM</span></div>'+
          '<div class="mp-res-desc">'+fmt(ach,0)+' ACH × '+esc(Math.round(vol).toLocaleString())+' ft³</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_ac_vol','Volumen'))+'</div><div class="mp-res-val">'+esc(Math.round(vol).toLocaleString())+' ft³</div></div>'+
            '<div><div class="mp-res-item">ACH</div><div class="mp-res-val">'+fmt(ach,0)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_ac_typical','ACH típicos'))+'</strong><br/>'+
          'Oficina 4–10 · Cocina 15–30 · Baño 6–12 · Garaje 4–6 · Sala mecánica 10–20 · Laboratorio 6–12 · Aula 4–8'+
        '</div>'+
        exampleTip('mp_ac_case','mp_ac_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 8) Condensate rate
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['condensate'] = {
    i18n: {
      es: {
        mp_cd_title: 'Condensado',
        mp_cd_sub: 'Galones por hora',
        mp_cd_tons: 'Toneladas',
        mp_cd_tons_u: 'ton',
        mp_cd_lf: 'Fracción latente',
        mp_cd_lf_u: '0–1',
        mp_cd_res_lbl: 'Condensado',
        mp_cd_gph: 'gal/hr',
        mp_cd_gpd: 'gal/día',
        mp_cd_slope: 'Pendiente mínima',
        mp_cd_pipe: 'Diámetro mínimo',
        mp_cd_notes: 'Notas de instalación',
        mp_cd_case: 'Ejemplo: 4 ton × 25% latente × 12,000 BTU/ton = 12,000 BTU/hr latente → ~1.36 gal/hr o 32.6 gal/día. Usa tubería ¾" mínimo con 1/8"/ft.',
        mp_cd_tip: 'Tip Chaka: Siempre coloca trampa tipo P y abertura de aire cerca del plenum. Sin trampa, el blower absorbe agua del drenaje o sopla aire fuera.'
      },
      en: {
        mp_cd_title: 'Condensate',
        mp_cd_sub: 'Gallons per hour',
        mp_cd_tons: 'Tons',
        mp_cd_tons_u: 'ton',
        mp_cd_lf: 'Latent fraction',
        mp_cd_lf_u: '0–1',
        mp_cd_res_lbl: 'Condensate rate',
        mp_cd_gph: 'gal/hr',
        mp_cd_gpd: 'gal/day',
        mp_cd_slope: 'Min. slope',
        mp_cd_pipe: 'Min. pipe size',
        mp_cd_notes: 'Install notes',
        mp_cd_case: 'Example: 4 tons × 25% latent × 12,000 BTU/ton = 12,000 BTU/hr latent → ~1.36 gal/hr or 32.6 gal/day. Use ¾" min pipe at 1/8"/ft slope.',
        mp_cd_tip: 'Chaka Tip: Always install a P-trap and vent near the plenum. Without a trap, the blower either sucks water up the drain or blows air out.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.condensate) || {};
      var tons = num(s.tons, 4);
      var lf = num(s.lf, 0.25);
      if (lf < 0) lf = 0;
      if (lf > 1) lf = 1;
      var totalBtu = tons * 12000;
      var latentBtu = totalBtu * lf;
      // gal/hr = latent BTU/hr ÷ 1054 (latent heat BTU/lb) ÷ 8.34 (lb/gal)
      var gph = latentBtu / 1054 / 8.34;
      var gpd = gph * 24;
      var pipe = tons <= 3 ? '3/4"' : (tons <= 10 ? '3/4" a 1"' : '1 1/4"');
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cd_tons','Toneladas'))+'</span><span class="mp-unit">'+esc(t('mp_cd_tons_u','ton'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="condensate.tons" value="'+tons+'" step="0.5" min="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cd_lf','Fracción latente'))+'</span><span class="mp-unit">'+esc(t('mp_cd_lf_u','0–1'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="condensate.lf" value="'+lf+'" step="0.05" min="0" max="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_cd_res_lbl','Condensado'))+'</div>'+
          '<div class="mp-res-main">'+fmt(gph,2)+'<span class="mp-res-unit">'+esc(t('mp_cd_gph','gal/hr'))+'</span></div>'+
          '<div class="mp-res-desc">'+esc(Math.round(latentBtu).toLocaleString())+' BTU/hr latente</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_cd_gpd','gal/día'))+'</div><div class="mp-res-val">'+fmt(gpd,1)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cd_pipe','Diámetro mínimo'))+'</div><div class="mp-res-val">'+esc(pipe)+'</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_cd_notes','Notas de instalación'))+'</strong><br/>'+
          esc(t('mp_cd_slope','Pendiente mínima'))+' 1/8" por pie · trampa P obligatoria · vent después de la trampa · tubería PVC sch 40 · secundario con float switch'+
        '</div>'+
        exampleTip('mp_cd_case','mp_cd_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 9) Ton ↔ BTU ↔ kW
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['tonBtu'] = {
    i18n: {
      es: {
        mp_tb_title: 'Ton / BTU / kW',
        mp_tb_sub: 'Convertidor de capacidad',
        mp_tb_mode: 'Unidad entrada',
        mp_tb_mode_u: 'tipo',
        mp_tb_value: 'Valor',
        mp_tb_value_u: 'número',
        mp_tb_ton: 'Toneladas',
        mp_tb_btu: 'BTU/hr',
        mp_tb_kw: 'kW',
        mp_tb_res_lbl: 'Equivalencias',
        mp_tb_note: '1 ton = 12,000 BTU/hr = 3.517 kW',
        mp_tb_case: 'Ejemplo: 3 ton → 36,000 BTU/hr → 10.55 kW. Útil para convertir especificaciones europeas (kW) a placas americanas (ton/BTU).',
        mp_tb_tip: 'Tip Chaka: Minis europeas vienen en kW. Un equipo de 7 kW se vende como "2 ton" pero son realmente 24,000 BTU — casi 2 ton exactas. Cuidado con la conversión.'
      },
      en: {
        mp_tb_title: 'Ton / BTU / kW',
        mp_tb_sub: 'Capacity converter',
        mp_tb_mode: 'Input unit',
        mp_tb_mode_u: 'type',
        mp_tb_value: 'Value',
        mp_tb_value_u: 'number',
        mp_tb_ton: 'Tons',
        mp_tb_btu: 'BTU/hr',
        mp_tb_kw: 'kW',
        mp_tb_res_lbl: 'Equivalents',
        mp_tb_note: '1 ton = 12,000 BTU/hr = 3.517 kW',
        mp_tb_case: 'Example: 3 tons → 36,000 BTU/hr → 10.55 kW. Useful to convert European specs (kW) to US nameplates (ton/BTU).',
        mp_tb_tip: 'Chaka Tip: European minis spec in kW. A 7 kW unit is sold as "2 tons" but is really 24,000 BTU — almost exactly 2 tons. Watch the conversion.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.tonBtu) || {};
      var mode = s.mode || 'ton';
      var val = num(s.value, mode==='ton'?3:(mode==='btu'?36000:10.55));
      var tons, btu, kw;
      if (mode === 'ton') { tons = val; btu = tons * 12000; kw = btu / 3412; }
      else if (mode === 'btu') { btu = val; tons = btu / 12000; kw = btu / 3412; }
      else { kw = val; btu = kw * 3412; tons = btu / 12000; }
      var modeOpts =
        '<option value="ton"'+(mode==='ton'?' selected':'')+'>'+esc(t('mp_tb_ton','Toneladas'))+'</option>'+
        '<option value="btu"'+(mode==='btu'?' selected':'')+'>'+esc(t('mp_tb_btu','BTU/hr'))+'</option>'+
        '<option value="kw"'+(mode==='kw'?' selected':'')+'>'+esc(t('mp_tb_kw','kW'))+'</option>';
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tb_mode','Unidad entrada'))+'</span><span class="mp-unit">'+esc(t('mp_tb_mode_u','tipo'))+'</span></div>'+
            '<select class="mp-in" data-in="tonBtu.mode">'+modeOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_tb_value','Valor'))+'</span><span class="mp-unit">'+esc(mode.toUpperCase())+'</span></div>'+
            '<input type="number" class="mp-in" data-in="tonBtu.value" value="'+val+'" step="0.1" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_tb_res_lbl','Equivalencias'))+'</div>'+
          '<div class="mp-res-main">'+fmt(tons,2)+'<span class="mp-res-unit">ton</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_tb_note','1 ton = 12,000 BTU/hr = 3.517 kW'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_tb_btu','BTU/hr'))+'</div><div class="mp-res-val">'+esc(Math.round(btu).toLocaleString())+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_tb_kw','kW'))+'</div><div class="mp-res-val">'+fmt(kw,2)+' kW</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_tb_case','mp_tb_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 10) Heat strip sizing
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['heatStrip'] = {
    i18n: {
      es: {
        mp_hs_title: 'Dimensión Resistencia Eléctrica',
        mp_hs_sub: 'Aux para HP',
        mp_hs_cap47: 'Capacidad HP @ 47°F',
        mp_hs_cap47_u: 'BTU/hr',
        mp_hs_capd: 'Capacidad HP a diseño',
        mp_hs_capd_u: 'BTU/hr',
        mp_hs_design: 'Temp. diseño (99%)',
        mp_hs_design_u: '°F',
        mp_hs_load: 'Pérdida de calor',
        mp_hs_load_u: 'BTU/hr',
        mp_hs_res_lbl: 'Aux requerido',
        mp_hs_kw: 'kW necesarios',
        mp_hs_amps: 'Amps @ 240V',
        mp_hs_breaker: 'Breaker (NEC ×1.25)',
        mp_hs_common: 'Tamaños comunes',
        mp_hs_case: 'Ejemplo: Pérdida 36,000 BTU @ 10°F, HP da 22,000 → déficit 14,000 BTU ÷ 3,412 = 4.1 kW. Usa strip de 5 kW, amps 20.8, breaker 30 A.',
        mp_hs_tip: 'Tip Chaka: NEC 424.3(B) pide breaker al 125% de la corriente. Si pones 10 kW a 240V son 41.7 A × 1.25 = 52 A — breaker de 60 A es lo correcto.'
      },
      en: {
        mp_hs_title: 'Heat Strip Sizing',
        mp_hs_sub: 'Heat pump aux',
        mp_hs_cap47: 'HP capacity @ 47°F',
        mp_hs_cap47_u: 'BTU/hr',
        mp_hs_capd: 'HP capacity at design',
        mp_hs_capd_u: 'BTU/hr',
        mp_hs_design: 'Design temp (99%)',
        mp_hs_design_u: '°F',
        mp_hs_load: 'Heat loss',
        mp_hs_load_u: 'BTU/hr',
        mp_hs_res_lbl: 'Aux required',
        mp_hs_kw: 'kW needed',
        mp_hs_amps: 'Amps @ 240V',
        mp_hs_breaker: 'Breaker (NEC ×1.25)',
        mp_hs_common: 'Common sizes',
        mp_hs_case: 'Example: 36,000 BTU loss @ 10°F, HP delivers 22,000 → 14,000 BTU deficit ÷ 3,412 = 4.1 kW. Use a 5 kW strip, 20.8 A, 30 A breaker.',
        mp_hs_tip: 'Chaka Tip: NEC 424.3(B) requires breakers at 125% of current. A 10 kW strip at 240V is 41.7 A × 1.25 = 52 A — a 60 A breaker is correct.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.heatStrip) || {};
      var cap47 = num(s.cap47, 36000);
      var capD = num(s.capD, 22000);
      var designT = num(s.design, 10);
      var load = num(s.load, 36000);
      var deficit = Math.max(0, load - capD);
      var kwNeeded = deficit / 3412;
      // Snap to common strip size
      var commons = [5, 7.5, 10, 15, 20];
      var chosen = commons[commons.length-1];
      for (var i=0;i<commons.length;i++){ if (kwNeeded <= commons[i]) { chosen = commons[i]; break; } }
      var amps = (chosen * 1000) / 240;
      var breaker = amps * 1.25;
      // Round breaker up to common size
      var brkSizes = [15,20,25,30,35,40,45,50,60,70,80,90,100];
      var brk = brkSizes[brkSizes.length-1];
      for (var j=0;j<brkSizes.length;j++){ if (breaker <= brkSizes[j]) { brk = brkSizes[j]; break; } }
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hs_cap47','Capacidad HP @ 47°F'))+'</span><span class="mp-unit">'+esc(t('mp_hs_cap47_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="heatStrip.cap47" value="'+cap47+'" step="500" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hs_capd','Capacidad HP a diseño'))+'</span><span class="mp-unit">'+esc(t('mp_hs_capd_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="heatStrip.capD" value="'+capD+'" step="500" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hs_design','Temp. diseño (99%)'))+'</span><span class="mp-unit">'+esc(t('mp_hs_design_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="heatStrip.design" value="'+designT+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hs_load','Pérdida de calor'))+'</span><span class="mp-unit">'+esc(t('mp_hs_load_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="heatStrip.load" value="'+load+'" step="500" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_hs_res_lbl','Aux requerido'))+'</div>'+
          '<div class="mp-res-main">'+fmt(chosen,1)+'<span class="mp-res-unit">kW</span></div>'+
          '<div class="mp-res-desc">'+fmt(kwNeeded,2)+' kW calculados · resistencia comercial '+fmt(chosen,1)+' kW</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_hs_amps','Amps @ 240V'))+'</div><div class="mp-res-val">'+fmt(amps,1)+' A</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_hs_breaker','Breaker (NEC ×1.25)'))+'</div><div class="mp-res-val">'+brk+' A</div></div>'+
          '</div>'+
        '</div>'+
        '<div class="mp-qr">'+
          '<strong>'+esc(t('mp_hs_common','Tamaños comunes'))+'</strong><br/>'+
          '5 kW (20.8 A) · 7.5 kW (31.3 A) · 10 kW (41.7 A) · 15 kW (62.5 A) · 20 kW (83.3 A) a 240V · NEC 424.3(B) breaker ×1.25'+
        '</div>'+
        exampleTip('mp_hs_case','mp_hs_tip');
    }
  };

})();
