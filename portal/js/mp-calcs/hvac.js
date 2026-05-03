// Maestro Pro · HVAC Complementario calculators
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
  // 1) Manual J simplified — residential cooling/heating load
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['manualJSimple'] = {
    i18n: {
      es: {
        mp_mjs_title: 'Manual J Simplificado',
        mp_mjs_sub: 'Carga residencial rápida',
        mp_mjs_sqft: 'Área',
        mp_mjs_sqft_u: 'pies²',
        mp_mjs_zone: 'Zona Climática',
        mp_mjs_zone_u: 'CZ1–CZ8',
        mp_mjs_ins: 'Aislamiento',
        mp_mjs_ins_u: 'calidad',
        mp_mjs_ins_poor: 'Pobre',
        mp_mjs_ins_avg: 'Promedio',
        mp_mjs_ins_good: 'Bueno',
        mp_mjs_cz1: 'CZ1 Muy caliente/húmedo',
        mp_mjs_cz2: 'CZ2 Caliente/húmedo',
        mp_mjs_cz3: 'CZ3 Templado',
        mp_mjs_cz4: 'CZ4 Mixto',
        mp_mjs_cz5: 'CZ5 Frío',
        mp_mjs_cz6: 'CZ6 Muy frío',
        mp_mjs_cz7: 'CZ7 Helado',
        mp_mjs_cz8: 'CZ8 Ártico',
        mp_mjs_res_lbl: 'Carga estimada',
        mp_mjs_cool: 'Enfriamiento',
        mp_mjs_heat: 'Calefacción',
        mp_mjs_ton: 'Tonelaje recomendado',
        mp_mjs_case: 'Ejemplo: Casa 1,800 pies² en CZ2 (Houston) con aislamiento promedio → ~60,000 BTU/hr enfriamiento, ~5 ton nominales.',
        mp_mjs_tip: 'Tip Chaka: Esto es un estimado rápido. Para equipos finales siempre haz un Manual J completo — sobredimensionar mata eficiencia y confort.'
      },
      en: {
        mp_mjs_title: 'Manual J Simplified',
        mp_mjs_sub: 'Quick residential load',
        mp_mjs_sqft: 'Area',
        mp_mjs_sqft_u: 'sq ft',
        mp_mjs_zone: 'Climate Zone',
        mp_mjs_zone_u: 'CZ1–CZ8',
        mp_mjs_ins: 'Insulation',
        mp_mjs_ins_u: 'quality',
        mp_mjs_ins_poor: 'Poor',
        mp_mjs_ins_avg: 'Average',
        mp_mjs_ins_good: 'Good',
        mp_mjs_cz1: 'CZ1 Very hot/humid',
        mp_mjs_cz2: 'CZ2 Hot/humid',
        mp_mjs_cz3: 'CZ3 Warm',
        mp_mjs_cz4: 'CZ4 Mixed',
        mp_mjs_cz5: 'CZ5 Cold',
        mp_mjs_cz6: 'CZ6 Very cold',
        mp_mjs_cz7: 'CZ7 Subarctic',
        mp_mjs_cz8: 'CZ8 Arctic',
        mp_mjs_res_lbl: 'Estimated load',
        mp_mjs_cool: 'Cooling',
        mp_mjs_heat: 'Heating',
        mp_mjs_ton: 'Recommended tonnage',
        mp_mjs_case: 'Example: 1,800 sq ft home in CZ2 (Houston) with average insulation → ~60,000 BTU/hr cooling, ~5 nominal tons.',
        mp_mjs_tip: 'Chaka Tip: This is a quick estimate. Always run a full Manual J for final sizing — oversizing kills efficiency and comfort.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.manualJSimple) || {};
      var sqft = num(s.sqft, 1500);
      var zone = s.zone || 'CZ4';
      var ins = s.ins || 'avg';
      // Climate multipliers (cooling vs heating BTU/sqft baselines)
      var cz = {
        CZ1: { cool: 38, heat: 15 },
        CZ2: { cool: 35, heat: 20 },
        CZ3: { cool: 32, heat: 25 },
        CZ4: { cool: 28, heat: 32 },
        CZ5: { cool: 25, heat: 40 },
        CZ6: { cool: 22, heat: 48 },
        CZ7: { cool: 20, heat: 55 },
        CZ8: { cool: 18, heat: 65 }
      };
      var czKey = cz[zone] ? zone : 'CZ4';
      var base = cz[czKey];
      var insMul = ins === 'poor' ? 1.20 : (ins === 'good' ? 0.80 : 1.00);
      var coolBtu = Math.round(sqft * base.cool * insMul);
      var heatBtu = Math.round(sqft * base.heat * insMul);
      var tons = coolBtu / 12000;
      // Snap to quarter-ton
      var tonsRounded = Math.ceil(tons * 4) / 4;
      var zones = ['CZ1','CZ2','CZ3','CZ4','CZ5','CZ6','CZ7','CZ8'];
      var zOpts = '';
      for (var i=0;i<zones.length;i++){
        var z = zones[i];
        zOpts += '<option value="'+z+'"'+(z===czKey?' selected':'')+'>'+esc(t('mp_mjs_'+z.toLowerCase(), z))+'</option>';
      }
      var insOpts =
        '<option value="poor"'+(ins==='poor'?' selected':'')+'>'+esc(t('mp_mjs_ins_poor','Pobre'))+'</option>'+
        '<option value="avg"'+(ins==='avg'?' selected':'')+'>'+esc(t('mp_mjs_ins_avg','Promedio'))+'</option>'+
        '<option value="good"'+(ins==='good'?' selected':'')+'>'+esc(t('mp_mjs_ins_good','Bueno'))+'</option>';
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_mjs_sqft','Área'))+'</span><span class="mp-unit">'+esc(t('mp_mjs_sqft_u','pies²'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="manualJSimple.sqft" value="'+sqft+'" step="50" min="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_mjs_zone','Zona Climática'))+'</span><span class="mp-unit">'+esc(t('mp_mjs_zone_u','CZ1–CZ8'))+'</span></div>'+
            '<select class="mp-in" data-in="manualJSimple.zone">'+zOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_mjs_ins','Aislamiento'))+'</span><span class="mp-unit">'+esc(t('mp_mjs_ins_u','calidad'))+'</span></div>'+
            '<select class="mp-in" data-in="manualJSimple.ins">'+insOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_mjs_res_lbl','Carga estimada'))+'</div>'+
          '<div class="mp-res-main">'+esc(coolBtu.toLocaleString())+'<span class="mp-res-unit">BTU/hr</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_mjs_cool','Enfriamiento'))+' · '+esc(czKey)+' · '+esc(t('mp_mjs_ins_'+ins, ins))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_mjs_heat','Calefacción'))+'</div><div class="mp-res-val">'+esc(heatBtu.toLocaleString())+' BTU/hr</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_mjs_ton','Tonelaje recomendado'))+'</div><div class="mp-res-val">'+fmt(tonsRounded,2)+' ton</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_mjs_case','mp_mjs_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 2) SEER / EER / COP converter
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['seerEerCop'] = {
    i18n: {
      es: {
        mp_sec_title: 'SEER / EER / COP',
        mp_sec_sub: 'Convertidor de eficiencias',
        mp_sec_mode: 'Entrada',
        mp_sec_mode_u: 'métrica',
        mp_sec_value: 'Valor',
        mp_sec_value_u: 'número',
        mp_sec_res_lbl: 'Equivalencias',
        mp_sec_seer: 'SEER',
        mp_sec_eer: 'EER',
        mp_sec_cop: 'COP',
        mp_sec_note: 'EER ≈ SEER × 0.875 · COP = EER ÷ 3.412',
        mp_sec_case: 'Ejemplo: SEER 16 → EER 14.0 → COP 4.10. Útil para comparar splits residenciales vs chillers comerciales.',
        mp_sec_tip: 'Tip Chaka: SEER es estacional, EER es a 95°F de pico. Un SEER alto no garantiza buen EER en Texas — revisa ambos.'
      },
      en: {
        mp_sec_title: 'SEER / EER / COP',
        mp_sec_sub: 'Efficiency converter',
        mp_sec_mode: 'Input metric',
        mp_sec_mode_u: 'metric',
        mp_sec_value: 'Value',
        mp_sec_value_u: 'number',
        mp_sec_res_lbl: 'Equivalents',
        mp_sec_seer: 'SEER',
        mp_sec_eer: 'EER',
        mp_sec_cop: 'COP',
        mp_sec_note: 'EER ≈ SEER × 0.875 · COP = EER ÷ 3.412',
        mp_sec_case: 'Example: SEER 16 → EER 14.0 → COP 4.10. Handy to compare residential splits vs commercial chillers.',
        mp_sec_tip: 'Chaka Tip: SEER is seasonal, EER is at 95°F peak. High SEER doesn\u2019t guarantee good EER in Texas — check both.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.seerEerCop) || {};
      var mode = s.mode || 'seer';
      var val = num(s.value, mode==='seer'?16:(mode==='eer'?14:4.10));
      var seer, eer, cop;
      if (mode === 'seer') { seer = val; eer = val * 0.875; cop = eer / 3.412; }
      else if (mode === 'eer') { eer = val; seer = eer / 0.875; cop = eer / 3.412; }
      else { cop = val; eer = cop * 3.412; seer = eer / 0.875; }
      var modeOpts =
        '<option value="seer"'+(mode==='seer'?' selected':'')+'>SEER</option>'+
        '<option value="eer"'+(mode==='eer'?' selected':'')+'>EER</option>'+
        '<option value="cop"'+(mode==='cop'?' selected':'')+'>COP</option>';
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sec_mode','Entrada'))+'</span><span class="mp-unit">'+esc(t('mp_sec_mode_u','métrica'))+'</span></div>'+
            '<select class="mp-in" data-in="seerEerCop.mode">'+modeOpts+'</select>'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_sec_value','Valor'))+'</span><span class="mp-unit">'+esc(mode.toUpperCase())+'</span></div>'+
            '<input type="number" class="mp-in" data-in="seerEerCop.value" value="'+val+'" step="0.1" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_sec_res_lbl','Equivalencias'))+'</div>'+
          '<div class="mp-res-main">'+fmt(seer,2)+'<span class="mp-res-unit">SEER</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_sec_note','EER ≈ SEER × 0.875 · COP = EER ÷ 3.412'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_sec_eer','EER'))+'</div><div class="mp-res-val">'+fmt(eer,2)+'</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_sec_cop','COP'))+'</div><div class="mp-res-val">'+fmt(cop,2)+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_sec_case','mp_sec_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 3) SEER2 / HSPF2 converter (DOE 2023)
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['seer2hspf2'] = {
    i18n: {
      es: {
        mp_s2_title: 'SEER2 / HSPF2',
        mp_s2_sub: 'Estándar DOE 2023',
        mp_s2_seer: 'SEER antiguo',
        mp_s2_seer_u: 'M1 2017',
        mp_s2_hspf: 'HSPF antiguo',
        mp_s2_hspf_u: 'M1 2017',
        mp_s2_res_lbl: 'Valores nuevos (M1 2023)',
        mp_s2_seer2: 'SEER2',
        mp_s2_hspf2: 'HSPF2',
        mp_s2_note: 'SEER2 ≈ SEER × 0.95 · HSPF2 ≈ HSPF × 0.85',
        mp_s2_case: 'Ejemplo: Un split SEER 14 / HSPF 8.2 del 2022 equivale aprox. a SEER2 13.3 / HSPF2 6.97 bajo la norma 2023.',
        mp_s2_tip: 'Tip Chaka: Los mínimos federales cambiaron en enero 2023. Si ves SEER2 en la placa, ya es equipo nuevo — no mezcles métricas en una misma cotización.'
      },
      en: {
        mp_s2_title: 'SEER2 / HSPF2',
        mp_s2_sub: 'DOE 2023 standard',
        mp_s2_seer: 'Old SEER',
        mp_s2_seer_u: 'M1 2017',
        mp_s2_hspf: 'Old HSPF',
        mp_s2_hspf_u: 'M1 2017',
        mp_s2_res_lbl: 'New values (M1 2023)',
        mp_s2_seer2: 'SEER2',
        mp_s2_hspf2: 'HSPF2',
        mp_s2_note: 'SEER2 ≈ SEER × 0.95 · HSPF2 ≈ HSPF × 0.85',
        mp_s2_case: 'Example: A 2022 SEER 14 / HSPF 8.2 split maps to roughly SEER2 13.3 / HSPF2 6.97 under the 2023 rule.',
        mp_s2_tip: 'Chaka Tip: Federal minimums changed Jan 2023. If the nameplate shows SEER2, it\u2019s new-spec gear — don\u2019t mix metrics on one quote.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.seer2hspf2) || {};
      var seer = num(s.seer, 14);
      var hspf = num(s.hspf, 8.2);
      var seer2 = seer * 0.95;
      var hspf2 = hspf * 0.85;
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_s2_seer','SEER antiguo'))+'</span><span class="mp-unit">'+esc(t('mp_s2_seer_u','M1 2017'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="seer2hspf2.seer" value="'+seer+'" step="0.1" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_s2_hspf','HSPF antiguo'))+'</span><span class="mp-unit">'+esc(t('mp_s2_hspf_u','M1 2017'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="seer2hspf2.hspf" value="'+hspf+'" step="0.1" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_s2_res_lbl','Valores nuevos (M1 2023)'))+'</div>'+
          '<div class="mp-res-main">'+fmt(seer2,2)+'<span class="mp-res-unit">SEER2</span></div>'+
          '<div class="mp-res-desc">'+esc(t('mp_s2_note','SEER2 ≈ SEER × 0.95 · HSPF2 ≈ HSPF × 0.85'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_s2_hspf2','HSPF2'))+'</div><div class="mp-res-val">'+fmt(hspf2,2)+'</div></div>'+
            '<div><div class="mp-res-item">Δ SEER</div><div class="mp-res-val">−'+fmt(seer-seer2,2)+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_s2_case','mp_s2_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 4) SHR — Sensible Heat Ratio
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['shr'] = {
    i18n: {
      es: {
        mp_shr_title: 'SHR (Sensible Heat Ratio)',
        mp_shr_sub: 'Relación de calor sensible',
        mp_shr_sens: 'BTU Sensible',
        mp_shr_sens_u: 'BTU/hr',
        mp_shr_total: 'BTU Total',
        mp_shr_total_u: 'BTU/hr',
        mp_shr_res_lbl: 'SHR = Sensible ÷ Total',
        mp_shr_latent: 'Carga latente',
        mp_shr_flag: 'Clasificación',
        mp_shr_humid: 'Alta humedad',
        mp_shr_dry: 'Clima seco',
        mp_shr_normal: 'Normal',
        mp_shr_case: 'Ejemplo: 18,000 sensible / 24,000 total = SHR 0.75 → ambiente con mucha humedad latente, considera reheat o VRF con control de humedad.',
        mp_shr_tip: 'Tip Chaka: Si SHR < 0.75 en Texas costa, tu equipo sopla aire frío pero no seca — revisa CFM/ton hacia 350 y baja velocidad.'
      },
      en: {
        mp_shr_title: 'SHR (Sensible Heat Ratio)',
        mp_shr_sub: 'Sensible vs total load',
        mp_shr_sens: 'Sensible BTU',
        mp_shr_sens_u: 'BTU/hr',
        mp_shr_total: 'Total BTU',
        mp_shr_total_u: 'BTU/hr',
        mp_shr_res_lbl: 'SHR = Sensible ÷ Total',
        mp_shr_latent: 'Latent load',
        mp_shr_flag: 'Classification',
        mp_shr_humid: 'High humidity',
        mp_shr_dry: 'Dry climate',
        mp_shr_normal: 'Normal',
        mp_shr_case: 'Example: 18,000 sensible / 24,000 total = SHR 0.75 → heavy latent load, consider reheat or VRF with humidity control.',
        mp_shr_tip: 'Chaka Tip: If SHR < 0.75 on the Gulf Coast the system blows cold but won\u2019t dry — dial CFM/ton toward 350 and slow the blower.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.shr) || {};
      var sens = num(s.sens, 18000);
      var total = num(s.total, 24000);
      if (total <= 0) total = 1;
      var shr = sens / total;
      var latent = total - sens;
      var flagKey, flagColor;
      if (shr < 0.75) { flagKey = 'mp_shr_humid'; flagColor = '#F87171'; }
      else if (shr >= 0.80) { flagKey = 'mp_shr_dry'; flagColor = '#FBBF24'; }
      else { flagKey = 'mp_shr_normal'; flagColor = '#4ADE80'; }
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_shr_sens','BTU Sensible'))+'</span><span class="mp-unit">'+esc(t('mp_shr_sens_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="shr.sens" value="'+sens+'" step="500" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_shr_total','BTU Total'))+'</span><span class="mp-unit">'+esc(t('mp_shr_total_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="shr.total" value="'+total+'" step="500" min="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_shr_res_lbl','SHR = Sensible ÷ Total'))+'</div>'+
          '<div class="mp-res-main">'+fmt(shr,2)+'</div>'+
          '<div class="mp-res-desc" style="color:'+flagColor+' !important;font-weight:600;">'+esc(t(flagKey,''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_shr_latent','Carga latente'))+'</div><div class="mp-res-val">'+esc(Math.round(latent).toLocaleString())+' BTU/hr</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_shr_flag','Clasificación'))+'</div><div class="mp-res-val" style="color:'+flagColor+' !important;">'+fmt(shr*100,0)+'%</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_shr_case','mp_shr_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 5) CFM per ton
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['cfmPerTon'] = {
    i18n: {
      es: {
        mp_cfm_title: 'CFM por Tonelada',
        mp_cfm_sub: 'Flujo de aire requerido',
        mp_cfm_tons: 'Toneladas',
        mp_cfm_tons_u: 'ton',
        mp_cfm_target: 'CFM / ton',
        mp_cfm_target_u: 'objetivo',
        mp_cfm_regs: 'N° de registros',
        mp_cfm_regs_u: 'salidas',
        mp_cfm_std: 'Estándar (400)',
        mp_cfm_dry: 'Seco (350)',
        mp_cfm_humid: 'Húmedo (450)',
        mp_cfm_res_lbl: 'CFM Total del Sistema',
        mp_cfm_per_reg: 'Por registro',
        mp_cfm_guide: 'Guía',
        mp_cfm_case: 'Ejemplo: 4 ton × 400 CFM/ton = 1,600 CFM total, dividido entre 10 registros = 160 CFM c/u.',
        mp_cfm_tip: 'Tip Chaka: En costa del Golfo usa 350 CFM/ton para mejorar deshumidificación; en Arizona seco sube a 450 para bajar temperatura rápido.'
      },
      en: {
        mp_cfm_title: 'CFM per Ton',
        mp_cfm_sub: 'Required airflow',
        mp_cfm_tons: 'Tons',
        mp_cfm_tons_u: 'ton',
        mp_cfm_target: 'CFM / ton',
        mp_cfm_target_u: 'target',
        mp_cfm_regs: 'Registers',
        mp_cfm_regs_u: 'outlets',
        mp_cfm_std: 'Standard (400)',
        mp_cfm_dry: 'Dry (350)',
        mp_cfm_humid: 'Humid (450)',
        mp_cfm_res_lbl: 'Total System CFM',
        mp_cfm_per_reg: 'Per register',
        mp_cfm_guide: 'Guide',
        mp_cfm_case: 'Example: 4 ton × 400 CFM/ton = 1,600 total CFM, split across 10 registers = 160 CFM each.',
        mp_cfm_tip: 'Chaka Tip: On the Gulf Coast run 350 CFM/ton for better dehumidification; in dry Arizona bump to 450 to pull temp down fast.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.cfmPerTon) || {};
      var tons = num(s.tons, 3);
      var target = num(s.target, 400);
      var regs = Math.max(1, Math.round(num(s.regs, 8)));
      var total = tons * target;
      var perReg = total / regs;
      var guide;
      if (target <= 360) guide = t('mp_cfm_dry','Seco (350)');
      else if (target >= 440) guide = t('mp_cfm_humid','Húmedo (450)');
      else guide = t('mp_cfm_std','Estándar (400)');
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cfm_tons','Toneladas'))+'</span><span class="mp-unit">'+esc(t('mp_cfm_tons_u','ton'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="cfmPerTon.tons" value="'+tons+'" step="0.5" min="0.5" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cfm_target','CFM / ton'))+'</span><span class="mp-unit">'+esc(t('mp_cfm_target_u','objetivo'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="cfmPerTon.target" value="'+target+'" step="10" min="200" max="500" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_cfm_regs','N° de registros'))+'</span><span class="mp-unit">'+esc(t('mp_cfm_regs_u','salidas'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="cfmPerTon.regs" value="'+regs+'" step="1" min="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_cfm_res_lbl','CFM Total del Sistema'))+'</div>'+
          '<div class="mp-res-main">'+fmt(total,0)+'<span class="mp-res-unit">CFM</span></div>'+
          '<div class="mp-res-desc">'+esc(guide)+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_cfm_per_reg','Por registro'))+'</div><div class="mp-res-val">'+fmt(perReg,0)+' CFM</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_cfm_guide','Guía'))+'</div><div class="mp-res-val">'+fmt(target,0)+'/ton</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_cfm_case','mp_cfm_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 6) Heat pump balance point
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['balancePoint'] = {
    i18n: {
      es: {
        mp_bp_title: 'Punto de Balance',
        mp_bp_sub: 'Bomba de calor vs aux',
        mp_bp_design: 'Temp. diseño',
        mp_bp_design_u: '°F',
        mp_bp_load: 'Carga de calor',
        mp_bp_load_u: 'BTU/hr',
        mp_bp_cap47: 'Capacidad @ 47°F',
        mp_bp_cap47_u: 'BTU/hr',
        mp_bp_cap17: 'Capacidad @ 17°F',
        mp_bp_cap17_u: 'BTU/hr',
        mp_bp_res_lbl: 'Temp. de balance',
        mp_bp_aux: 'Aux necesario bajo',
        mp_bp_deficit: 'Déficit a diseño',
        mp_bp_ok: 'Cubre diseño',
        mp_bp_case: 'Ejemplo: Carga 36,000 BTU @ 10°F, HP rinde 42,000@47 y 24,000@17 → balance ≈ 24°F, aux por debajo.',
        mp_bp_tip: 'Tip Chaka: Dimensiona el aux eléctrico solo para el déficit en la temp de diseño, no la carga completa — ahorra breaker y kWh.'
      },
      en: {
        mp_bp_title: 'Balance Point',
        mp_bp_sub: 'Heat pump vs aux heat',
        mp_bp_design: 'Design temp',
        mp_bp_design_u: '°F',
        mp_bp_load: 'Heat load',
        mp_bp_load_u: 'BTU/hr',
        mp_bp_cap47: 'Capacity @ 47°F',
        mp_bp_cap47_u: 'BTU/hr',
        mp_bp_cap17: 'Capacity @ 17°F',
        mp_bp_cap17_u: 'BTU/hr',
        mp_bp_res_lbl: 'Balance temperature',
        mp_bp_aux: 'Aux needed below',
        mp_bp_deficit: 'Deficit at design',
        mp_bp_ok: 'Covers design',
        mp_bp_case: 'Example: 36,000 BTU load @ 10°F, HP makes 42,000@47 and 24,000@17 → balance ≈ 24°F, aux below that.',
        mp_bp_tip: 'Chaka Tip: Size aux electric only for the deficit at design temp, not the full load — saves breaker size and kWh.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.balancePoint) || {};
      var designT = num(s.design, 10);
      var load = num(s.load, 36000);
      var cap47 = num(s.cap47, 42000);
      var cap17 = num(s.cap17, 24000);
      var indoorT = 65; // classic no-load ambient
      // HP capacity line: cap = A + B*T
      var B_hp = (cap47 - cap17) / (47 - 17);
      var A_hp = cap47 - B_hp * 47;
      // Building load line: load=0 at indoorT, =load at designT
      var B_bld = (load - 0) / (designT - indoorT);
      var A_bld = 0 - B_bld * indoorT;
      // Solve A_hp + B_hp*T = A_bld + B_bld*T  →  T = (A_bld - A_hp)/(B_hp - B_bld)
      var balanceT;
      var denom = (B_hp - B_bld);
      if (Math.abs(denom) < 1e-6) balanceT = NaN;
      else balanceT = (A_bld - A_hp) / denom;
      var capAtDesign = A_hp + B_hp * designT;
      var deficit = Math.max(0, load - capAtDesign);
      var covers = capAtDesign >= load;
      var statusColor = covers ? '#4ADE80' : '#FBBF24';
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bp_design','Temp. diseño'))+'</span><span class="mp-unit">'+esc(t('mp_bp_design_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="balancePoint.design" value="'+designT+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bp_load','Carga de calor'))+'</span><span class="mp-unit">'+esc(t('mp_bp_load_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="balancePoint.load" value="'+load+'" step="500" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bp_cap47','Capacidad @ 47°F'))+'</span><span class="mp-unit">'+esc(t('mp_bp_cap47_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="balancePoint.cap47" value="'+cap47+'" step="500" min="0" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_bp_cap17','Capacidad @ 17°F'))+'</span><span class="mp-unit">'+esc(t('mp_bp_cap17_u','BTU/hr'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="balancePoint.cap17" value="'+cap17+'" step="500" min="0" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_bp_res_lbl','Temp. de balance'))+'</div>'+
          '<div class="mp-res-main">'+(isFinite(balanceT)?fmt(balanceT,1):'—')+'<span class="mp-res-unit">°F</span></div>'+
          '<div class="mp-res-desc" style="color:'+statusColor+' !important;font-weight:600;">'+esc(covers?t('mp_bp_ok','Cubre diseño'):t('mp_bp_aux','Aux necesario bajo'))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_bp_deficit','Déficit a diseño'))+'</div><div class="mp-res-val">'+esc(Math.round(deficit).toLocaleString())+' BTU/hr</div></div>'+
            '<div><div class="mp-res-item">HP @ '+fmt(designT,0)+'°F</div><div class="mp-res-val">'+esc(Math.round(capAtDesign).toLocaleString())+' BTU/hr</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_bp_case','mp_bp_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 7) Defrost cycle timing
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['defrostCycle'] = {
    i18n: {
      es: {
        mp_df_title: 'Ciclo de Defrost',
        mp_df_sub: 'Intervalo recomendado',
        mp_df_temp: 'Temp. exterior',
        mp_df_temp_u: '°F',
        mp_df_rh: 'Humedad relativa',
        mp_df_rh_u: '%',
        mp_df_coil: 'Tipo de coil',
        mp_df_coil_u: 'serpentín',
        mp_df_micro: 'Microchannel',
        mp_df_fin: 'Fin-tube',
        mp_df_res_lbl: 'Intervalo recomendado',
        mp_df_dur: 'Duración',
        mp_df_risk: 'Riesgo de escarcha',
        mp_df_low: 'Bajo',
        mp_df_med: 'Medio',
        mp_df_high: 'Alto',
        mp_df_case: 'Ejemplo: 32°F y 85% RH en coil fin-tube → ciclos cada 30 min, duración 10 min. Demand-defrost ayuda a no desperdiciar energía.',
        mp_df_tip: 'Tip Chaka: Si escuchas el reversing valve muy seguido, revisa sensor de defrost antes de subir el temporizador — muchas veces es falla de sonda, no de programación.'
      },
      en: {
        mp_df_title: 'Defrost Cycle',
        mp_df_sub: 'Recommended interval',
        mp_df_temp: 'Outdoor temp',
        mp_df_temp_u: '°F',
        mp_df_rh: 'Relative humidity',
        mp_df_rh_u: '%',
        mp_df_coil: 'Coil type',
        mp_df_coil_u: 'coil',
        mp_df_micro: 'Microchannel',
        mp_df_fin: 'Fin-tube',
        mp_df_res_lbl: 'Recommended interval',
        mp_df_dur: 'Duration',
        mp_df_risk: 'Frost risk',
        mp_df_low: 'Low',
        mp_df_med: 'Medium',
        mp_df_high: 'High',
        mp_df_case: 'Example: 32°F and 85% RH on a fin-tube coil → 30-min cycle, 10-min duration. Demand defrost cuts wasted energy.',
        mp_df_tip: 'Chaka Tip: If the reversing valve clicks too often, check the defrost sensor before extending the timer — it\u2019s usually the probe, not the program.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.defrostCycle) || {};
      var tempF = num(s.temp, 32);
      var rh = num(s.rh, 75);
      var coil = s.coil || 'fin';
      // Frost risk scoring — worst near 28-38°F, high RH
      var tempScore = 0;
      if (tempF < 17) tempScore = 1;            // too cold, less moisture
      else if (tempF < 28) tempScore = 2;
      else if (tempF < 40) tempScore = 3;       // peak frost window
      else if (tempF < 50) tempScore = 1;
      else tempScore = 0;
      var rhScore = rh >= 80 ? 2 : (rh >= 60 ? 1 : 0);
      var coilBonus = coil === 'fin' ? 1 : 0;   // fin-tube frosts faster
      var risk = tempScore + rhScore + coilBonus; // 0..6
      var interval, duration, riskKey, riskColor;
      if (risk >= 5)      { interval = 30; duration = 12; riskKey='mp_df_high'; riskColor='#F87171'; }
      else if (risk >= 3) { interval = 60; duration = 10; riskKey='mp_df_med';  riskColor='#FBBF24'; }
      else                { interval = 90; duration = 8;  riskKey='mp_df_low';  riskColor='#4ADE80'; }
      if (tempF >= 50) { interval = 90; duration = 8; riskKey='mp_df_low'; riskColor='#4ADE80'; }
      var coilOpts =
        '<option value="fin"'+(coil==='fin'?' selected':'')+'>'+esc(t('mp_df_fin','Fin-tube'))+'</option>'+
        '<option value="micro"'+(coil==='micro'?' selected':'')+'>'+esc(t('mp_df_micro','Microchannel'))+'</option>';
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_df_temp','Temp. exterior'))+'</span><span class="mp-unit">'+esc(t('mp_df_temp_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="defrostCycle.temp" value="'+tempF+'" step="1" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_df_rh','Humedad relativa'))+'</span><span class="mp-unit">'+esc(t('mp_df_rh_u','%'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="defrostCycle.rh" value="'+rh+'" step="1" min="0" max="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_df_coil','Tipo de coil'))+'</span><span class="mp-unit">'+esc(t('mp_df_coil_u','serpentín'))+'</span></div>'+
            '<select class="mp-in" data-in="defrostCycle.coil">'+coilOpts+'</select>'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_df_res_lbl','Intervalo recomendado'))+'</div>'+
          '<div class="mp-res-main">'+interval+'<span class="mp-res-unit">min</span></div>'+
          '<div class="mp-res-desc" style="color:'+riskColor+' !important;font-weight:600;">'+esc(t('mp_df_risk','Riesgo de escarcha'))+': '+esc(t(riskKey,''))+'</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_df_dur','Duración'))+'</div><div class="mp-res-val">'+duration+' min</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_df_coil','Tipo de coil'))+'</div><div class="mp-res-val">'+esc(t(coil==='fin'?'mp_df_fin':'mp_df_micro',coil))+'</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_df_case','mp_df_tip');
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 8) Whole-house humidifier sizing
  // ─────────────────────────────────────────────────────────────────
  window.MP_CALCS['humidifierSize'] = {
    i18n: {
      es: {
        mp_hum_title: 'Humidificador Casa Completa',
        mp_hum_sub: 'Capacidad GPD',
        mp_hum_sqft: 'Área',
        mp_hum_sqft_u: 'pies²',
        mp_hum_ceil: 'Altura techo',
        mp_hum_ceil_u: 'pies',
        mp_hum_rh_tgt: 'RH objetivo',
        mp_hum_rh_tgt_u: '%',
        mp_hum_rh_now: 'RH actual interior',
        mp_hum_rh_now_u: '%',
        mp_hum_out: 'Temp. exterior',
        mp_hum_out_u: '°F',
        mp_hum_res_lbl: 'Capacidad requerida',
        mp_hum_gpd: 'GPD',
        mp_hum_vol: 'Volumen',
        mp_hum_deficit: 'Déficit RH',
        mp_hum_case: 'Ejemplo: 2,000 pies² × 9 ft con objetivo 40% y actual 20% a 20°F exterior → ~9 GPD → bypass de flujo alto o steam 12 GPD.',
        mp_hum_tip: 'Tip Chaka: No rebases 35-40% RH en invierno si las ventanas son viejas — te va a sudar vidrio y a criar moho.'
      },
      en: {
        mp_hum_title: 'Whole-House Humidifier',
        mp_hum_sub: 'GPD sizing',
        mp_hum_sqft: 'Area',
        mp_hum_sqft_u: 'sq ft',
        mp_hum_ceil: 'Ceiling height',
        mp_hum_ceil_u: 'ft',
        mp_hum_rh_tgt: 'Target RH',
        mp_hum_rh_tgt_u: '%',
        mp_hum_rh_now: 'Current indoor RH',
        mp_hum_rh_now_u: '%',
        mp_hum_out: 'Outdoor temp',
        mp_hum_out_u: '°F',
        mp_hum_res_lbl: 'Required capacity',
        mp_hum_gpd: 'GPD',
        mp_hum_vol: 'Volume',
        mp_hum_deficit: 'RH deficit',
        mp_hum_case: 'Example: 2,000 sq ft × 9 ft, target 40% vs current 20% at 20°F outdoor → ~9 GPD → high-flow bypass or 12 GPD steam.',
        mp_hum_tip: 'Chaka Tip: Don\u2019t push past 35-40% RH in winter if windows are old — you\u2019ll sweat glass and grow mold.'
      }
    },
    render: function(state){
      var s = (state && state.inputs && state.inputs.humidifierSize) || {};
      var sqft = num(s.sqft, 2000);
      var ceil = num(s.ceil, 9);
      var rhT = num(s.rh_tgt, 40);
      var rhN = num(s.rh_now, 20);
      var outF = num(s.out, 20);
      var vol = sqft * ceil;                     // ft³
      var deficit = Math.max(0, rhT - rhN);      // %RH points
      // ACH assumption scaled by outdoor temp (colder = leakier driving pressure)
      var ach;
      if (outF <= 0)       ach = 1.0;
      else if (outF <= 20) ach = 0.8;
      else if (outF <= 40) ach = 0.6;
      else                 ach = 0.4;
      // Each %RH point ≈ ~0.00055 lb water per ft³ at 70°F indoor (approx).
      // GPD = vol * ACH * 24 * deficit% * k / 8.33 lb/gal
      var lbPerHr = vol * ach * (deficit/100) * 0.00055;
      var gpd = (lbPerHr * 24) / 8.33;
      // Minimum practical sizing bump
      if (gpd > 0 && gpd < 2) gpd = 2;
      return '<div class="mp-sec">'+
          '<div class="mp-sec-lbl"><span class="dot">◆</span> '+esc(t('mp_inputs','Entradas'))+'</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hum_sqft','Área'))+'</span><span class="mp-unit">'+esc(t('mp_hum_sqft_u','pies²'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="humidifierSize.sqft" value="'+sqft+'" step="50" min="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hum_ceil','Altura techo'))+'</span><span class="mp-unit">'+esc(t('mp_hum_ceil_u','pies'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="humidifierSize.ceil" value="'+ceil+'" step="0.5" min="6" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hum_rh_tgt','RH objetivo'))+'</span><span class="mp-unit">'+esc(t('mp_hum_rh_tgt_u','%'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="humidifierSize.rh_tgt" value="'+rhT+'" step="1" min="0" max="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hum_rh_now','RH actual interior'))+'</span><span class="mp-unit">'+esc(t('mp_hum_rh_now_u','%'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="humidifierSize.rh_now" value="'+rhN+'" step="1" min="0" max="100" />'+
          '</div>'+
          '<div class="mp-ig">'+
            '<div class="mp-lbl"><span>'+esc(t('mp_hum_out','Temp. exterior'))+'</span><span class="mp-unit">'+esc(t('mp_hum_out_u','°F'))+'</span></div>'+
            '<input type="number" class="mp-in" data-in="humidifierSize.out" value="'+outF+'" step="1" />'+
          '</div>'+
        '</div>'+
        '<div class="mp-res">'+
          '<div class="mp-res-lbl">◆ '+esc(t('mp_hum_res_lbl','Capacidad requerida'))+'</div>'+
          '<div class="mp-res-main">'+fmt(gpd,1)+'<span class="mp-res-unit">'+esc(t('mp_hum_gpd','GPD'))+'</span></div>'+
          '<div class="mp-res-desc">ACH '+fmt(ach,2)+' · Δ'+fmt(deficit,0)+'% RH</div>'+
          '<div class="mp-res-grid">'+
            '<div><div class="mp-res-item">'+esc(t('mp_hum_vol','Volumen'))+'</div><div class="mp-res-val">'+esc(Math.round(vol).toLocaleString())+' ft³</div></div>'+
            '<div><div class="mp-res-item">'+esc(t('mp_hum_deficit','Déficit RH'))+'</div><div class="mp-res-val">'+fmt(deficit,0)+'%</div></div>'+
          '</div>'+
        '</div>'+
        exampleTip('mp_hum_case','mp_hum_tip');
    }
  };

})();
