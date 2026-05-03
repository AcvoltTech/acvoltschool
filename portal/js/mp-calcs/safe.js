// Maestro Pro · Seguridad (Safety) tools
(function(){
  'use strict';
  window.MP_CALCS = window.MP_CALCS || {};
  var h = function(){ return window.MP_HELPERS || {}; };
  function esc(s){ var H=h(); return H.esc?H.esc(s):String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function t(k,fb){ var H=h(); return H.t?H.t(k,fb):(fb||k); }
  function exampleTip(caseKey,tipKey){ var H=h(); return H.exampleTip?H.exampleTip(caseKey,tipKey):''; }
  function num(v,d){ var n=parseFloat(v); return isNaN(n)?(d||0):n; }
  function getIn(state, tool){ return (state && state.inputs && state.inputs[tool]) || {}; }
  function isOn(v){ return v === 'on' || v === true || v === 'true' || v === '1'; }
  function lang(){ var H=h(); return (H.lang && H.lang()) || (window.currentLang || 'es'); }
  function ES(){ return lang() === 'es'; }

  // ── Tool 1: Arc Flash Boundary (NFPA 70E) ──────────────────────────
  window.MP_CALCS['arcFlash'] = {
    i18n: {
      es: {
        mp_af_title: 'Arc Flash — NFPA 70E',
        mp_af_sub:   'Energía incidente · Categoría PPE · Distancia de frontera',
        mp_af_voltage: 'Voltaje del sistema',
        mp_af_fault:   'Corriente de falla disponible',
        mp_af_time:    'Tiempo de arco',
        mp_af_ie:      'Energía incidente',
        mp_af_cat:     'Categoría PPE',
        mp_af_boundary:'Frontera de arco',
        mp_af_cyc:     'ciclos (60 Hz)',
        mp_af_ka:      'kA',
        mp_af_ft:      'ft',
        mp_af_cal:     'cal/cm²',
        mp_af_ppe_0:   'CAT 0 · Ropa no fundible (4.5 oz/yd²)',
        mp_af_ppe_1:   'CAT 1 · AR 4 cal/cm²',
        mp_af_ppe_2:   'CAT 2 · AR 8 cal/cm² · Balaclava · Face Shield',
        mp_af_ppe_3:   'CAT 3 · AR 25 cal/cm² · Arc Flash Hood',
        mp_af_ppe_4:   'CAT 4 · AR 40 cal/cm² · Full Arc Flash Suit',
        mp_af_danger:  'PELIGRO — Trabajo energizado prohibido sin permiso',
        mp_af_note:    'Tabla simplificada NFPA 70E 130.7(C)(15)(a). Para cálculo formal use IEEE 1584.',
        mp_arcFlash_case: 'Caso: RTU 480V 65kA, breaker despeja en 6 ciclos (100 ms).',
        mp_arcFlash_tip:  'Tip: Cada ciclo extra duplica el riesgo. Revise curvas TCC del breaker upstream.'
      },
      en: {
        mp_af_title: 'Arc Flash — NFPA 70E',
        mp_af_sub:   'Incident energy · PPE Category · Boundary distance',
        mp_af_voltage: 'System voltage',
        mp_af_fault:   'Available fault current',
        mp_af_time:    'Arcing time',
        mp_af_ie:      'Incident energy',
        mp_af_cat:     'PPE Category',
        mp_af_boundary:'Arc flash boundary',
        mp_af_cyc:     'cycles (60 Hz)',
        mp_af_ka:      'kA',
        mp_af_ft:      'ft',
        mp_af_cal:     'cal/cm²',
        mp_af_ppe_0:   'CAT 0 · Non-melting clothing (4.5 oz/yd²)',
        mp_af_ppe_1:   'CAT 1 · AR 4 cal/cm²',
        mp_af_ppe_2:   'CAT 2 · AR 8 cal/cm² · Balaclava · Face shield',
        mp_af_ppe_3:   'CAT 3 · AR 25 cal/cm² · Arc flash hood',
        mp_af_ppe_4:   'CAT 4 · AR 40 cal/cm² · Full arc flash suit',
        mp_af_danger:  'DANGER — Energized work prohibited without permit',
        mp_af_note:    'Simplified NFPA 70E 130.7(C)(15)(a) table. For formal calc use IEEE 1584.',
        mp_arcFlash_case: 'Case: 480V RTU, 65 kA, breaker clears in 6 cycles (100 ms).',
        mp_arcFlash_tip:  'Tip: Each extra cycle doubles risk. Check upstream breaker TCC curves.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'arcFlash');
      var v   = num(ins.voltage, 480);
      var kA  = num(ins.fault, 65);
      var cyc = num(ins.cycles, 6);
      // Simplified IE = 1.3 * kA * (cycles/60) + base  (empirical for 480V class)
      var tSec = cyc / 60;
      var ie = 1.3 * kA * tSec * (v/480);
      // Scale rough: add 1.5 for open-air air-gap
      ie = ie + 1.5;
      if (ie < 0) ie = 0;
      var ieStr = ie.toFixed(1);
      var cat, ppeKey;
      if (ie < 1.2)       { cat = 0; ppeKey = 'mp_af_ppe_0'; }
      else if (ie <= 4)   { cat = 1; ppeKey = 'mp_af_ppe_1'; }
      else if (ie <= 8)   { cat = 2; ppeKey = 'mp_af_ppe_2'; }
      else if (ie <= 25)  { cat = 3; ppeKey = 'mp_af_ppe_3'; }
      else                { cat = 4; ppeKey = 'mp_af_ppe_4'; }
      // Boundary distance (ft) simplified: sqrt(IE/1.2) * working-distance-factor
      var wd = 1.5; // 18" working distance in ft
      var boundaryFt = Math.sqrt(ie/1.2) * wd;
      var boundStr = boundaryFt.toFixed(1);
      var catColor = cat >= 3 ? '#DC2626' : (cat === 2 ? '#F59E0B' : '#4ADE80');
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('arcFlash','mp_af_title','mp_af_sub','⚡',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_af_voltage','Voltaje')) + '</span><span class="mp-unit">V</span></div>' +
              '<input type="number" class="mp-in" data-in="arcFlash.voltage" value="' + v + '" step="1" />' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_af_fault','Falla disponible')) + '</span><span class="mp-unit">' + esc(t('mp_af_ka','kA')) + '</span></div>' +
              '<input type="number" class="mp-in" data-in="arcFlash.fault" value="' + kA + '" step="1" />' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_af_time','Tiempo de arco')) + '</span><span class="mp-unit">' + esc(t('mp_af_cyc','ciclos')) + '</span></div>' +
              '<input type="number" class="mp-in" data-in="arcFlash.cycles" value="' + cyc + '" step="1" />' +
            '</div>' +
          '</div>' +
          '<div class="mp-res">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_af_ie','Energía incidente')) + '</div>' +
            '<div class="mp-res-main">' + esc(ieStr) + '<span class="mp-res-unit">' + esc(t('mp_af_cal','cal/cm²')) + '</span></div>' +
            '<div class="mp-res-desc" style="color:' + catColor + ' !important;font-weight:700;">' + esc(t(ppeKey,'')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_af_cat','Categoría PPE')) + '</div><div class="mp-res-val">CAT ' + cat + '</div></div>' +
              '<div><div class="mp-res-item">' + esc(t('mp_af_boundary','Frontera')) + '</div><div class="mp-res-val">' + esc(boundStr) + ' ' + esc(t('mp_af_ft','ft')) + '</div></div>' +
            '</div>' +
            (cat >= 3 ? '<div style="margin-top:10px;padding:10px;background:#FEE2E2;border-left:4px solid #DC2626;color:#7F1D1D;font-weight:700;font-size:13px;">⚠ ' + esc(t('mp_af_danger','')) + '</div>' : '') +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> NFPA 70E</div>' +
            '<div style="font-size:12px;color:#111;line-height:1.5;">' + esc(t('mp_af_note','')) + '</div>' +
          '</div>' +
          exampleTip('mp_arcFlash_case','mp_arcFlash_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 2: LOTO Checklist ──────────────────────────────────────────
  window.MP_CALCS['loto'] = {
    i18n: {
      es: {
        mp_loto_title: 'LOTO — Lockout/Tagout',
        mp_loto_sub:   '10 pasos · OSHA 29 CFR 1910.147',
        mp_loto_s1: '1. Preparar — Identificar todas las fuentes de energía (eléctrica, mecánica, neumática, hidráulica, térmica, química)',
        mp_loto_s2: '2. Notificar — Avisar a los trabajadores afectados antes y después del LOTO',
        mp_loto_s3: '3. Apagar — Detener el equipo usando los controles normales (shutdown de operación)',
        mp_loto_s4: '4. Aislar — Abrir desconectores, cerrar válvulas, aislar todas las fuentes de energía',
        mp_loto_s5: '5. Lockout — Aplicar candado personal en cada punto de aislamiento',
        mp_loto_s6: '6. Tagout — Colocar tarjeta con nombre, fecha y razón del bloqueo',
        mp_loto_s7: '7. Liberar energía almacenada — Descargar capacitores, drenar presión, bleed residual',
        mp_loto_s8: '8. Verificar energía cero — Probar con multímetro/manómetro que no hay energía',
        mp_loto_s9: '9. Trabajar — Realizar mantenimiento de forma segura',
        mp_loto_s10:'10. Remoción — Inspeccionar área, retirar herramientas, quitar candados en orden inverso',
        mp_loto_reset: 'Reiniciar',
        mp_loto_done:  'Completado',
        mp_loto_prog:  'Progreso',
        mp_loto_case:  'Caso: Cambiar capacitor en condensador 208V 3∅. Aplicar LOTO al disconnect de techo antes de tocar.',
        mp_loto_tip:   'Tip: Cada técnico debe tener su PROPIO candado. Nunca comparta llaves. OSHA multa hasta $16,131 por infracción.'
      },
      en: {
        mp_loto_title: 'LOTO — Lockout/Tagout',
        mp_loto_sub:   '10 steps · OSHA 29 CFR 1910.147',
        mp_loto_s1: '1. Prepare — Identify all energy sources (electrical, mechanical, pneumatic, hydraulic, thermal, chemical)',
        mp_loto_s2: '2. Notify — Inform affected workers before and after LOTO',
        mp_loto_s3: '3. Shut down — Stop equipment using normal controls (operational shutdown)',
        mp_loto_s4: '4. Isolate — Open disconnects, close valves, isolate all energy sources',
        mp_loto_s5: '5. Lockout — Apply personal lock at each isolation point',
        mp_loto_s6: '6. Tagout — Attach tag with name, date and reason',
        mp_loto_s7: '7. Release stored energy — Discharge capacitors, drain pressure, bleed residual',
        mp_loto_s8: '8. Verify zero energy — Test with meter/gauge to confirm no energy',
        mp_loto_s9: '9. Work — Perform maintenance safely',
        mp_loto_s10:'10. Removal — Inspect area, remove tools, remove locks in reverse order',
        mp_loto_reset: 'Reset',
        mp_loto_done:  'Complete',
        mp_loto_prog:  'Progress',
        mp_loto_case:  'Case: Replace capacitor on 208V 3∅ condenser. Apply LOTO at rooftop disconnect before touching.',
        mp_loto_tip:   'Tip: Every tech must have their OWN lock. Never share keys. OSHA fines up to $16,131 per violation.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'loto');
      var total = 10, done = 0;
      var items = '';
      for (var i = 1; i <= total; i++) {
        var on = isOn(ins['step'+i]);
        if (on) done++;
        items +=
          '<label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;margin-bottom:6px;background:#fff;border:1.5px solid ' + (on?'#4ADE80':'#E5E7EB') + ';border-radius:8px;cursor:pointer;' + (on?'background:#F0FDF4;':'') + '">' +
            '<input type="checkbox" class="mp-in" data-in="loto.step' + i + '" ' + (on?'checked':'') + ' style="margin-top:2px;width:18px;height:18px;flex-shrink:0;" />' +
            '<span style="font-size:13px;color:#111;line-height:1.45;' + (on?'text-decoration:line-through;color:#6B7280;':'') + '">' + esc(t('mp_loto_s'+i,'Step '+i)) + '</span>' +
          '</label>';
      }
      var pct = Math.round((done/total)*100);
      var barColor = pct === 100 ? '#16A34A' : (pct >= 50 ? '#F59E0B' : '#DC2626');
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('loto','mp_loto_title','mp_loto_sub','🔒',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_loto_prog','Progreso')) + '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
              '<div style="flex:1;height:10px;background:#E5E7EB;border-radius:5px;overflow:hidden;">' +
                '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';transition:width .3s;"></div>' +
              '</div>' +
              '<div style="font-size:15px;font-weight:700;color:#111;">' + done + '/' + total + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Pasos LOTO':'LOTO Steps') + '</div>' +
            items +
          '</div>' +
          '<div class="mp-res">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_loto_done','Completado')) + '</div>' +
            '<div class="mp-res-main">' + pct + '<span class="mp-res-unit">%</span></div>' +
            '<div class="mp-res-desc">' + (pct===100?(ES()?'Energía cero verificada — seguro para trabajar':'Zero energy verified — safe to work'):(ES()?'Continúe con los pasos pendientes':'Continue with pending steps')) + '</div>' +
          '</div>' +
          exampleTip('mp_loto_case','mp_loto_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 3: PPE per Task ────────────────────────────────────────────
  window.MP_CALCS['ppePorTarea'] = {
    i18n: {
      es: {
        mp_ppe_title: 'PPE por Tarea',
        mp_ppe_sub:   'Equipo de protección personal · ANSI/NIOSH/OSHA',
        mp_ppe_task:  'Tarea',
        mp_ppe_eye:   'Ojos/Cara',
        mp_ppe_hand:  'Manos',
        mp_ppe_foot:  'Pies',
        mp_ppe_resp:  'Respiratorio',
        mp_ppe_body:  'Cuerpo',
        mp_ppe_ear:   'Oídos',
        mp_ppe_t_solder:'Soldadura/brazing',
        mp_ppe_t_charge:'Carga de refrigerante',
        mp_ppe_t_a2l:   'Fuga A2L (ligeramente inflamable)',
        mp_ppe_t_conf:  'Espacio confinado',
        mp_ppe_t_hv:    'Troubleshoot alto voltaje',
        mp_ppe_t_rtu:   'Techo / RTU',
        mp_ppe_t_attic: 'Ductos en ático',
        mp_ppe_t_coil:  'Limpieza química de coil',
        mp_ppePorTarea_case: 'Caso: Brazear línea de succión 3/4" con antorcha de acetileno en sala mecánica.',
        mp_ppePorTarea_tip:  'Tip: PPE no reemplaza controles de ingeniería. Primero ventilación, luego equipo.'
      },
      en: {
        mp_ppe_title: 'PPE per Task',
        mp_ppe_sub:   'Personal protective equipment · ANSI/NIOSH/OSHA',
        mp_ppe_task:  'Task',
        mp_ppe_eye:   'Eye/Face',
        mp_ppe_hand:  'Hands',
        mp_ppe_foot:  'Feet',
        mp_ppe_resp:  'Respiratory',
        mp_ppe_body:  'Body',
        mp_ppe_ear:   'Hearing',
        mp_ppe_t_solder:'Solder/Braze',
        mp_ppe_t_charge:'Refrigerant charge',
        mp_ppe_t_a2l:   'A2L leak (mildly flammable)',
        mp_ppe_t_conf:  'Confined space',
        mp_ppe_t_hv:    'High-voltage troubleshoot',
        mp_ppe_t_rtu:   'Rooftop / RTU',
        mp_ppe_t_attic: 'Ductwork in attic',
        mp_ppe_t_coil:  'Chemical coil cleaning',
        mp_ppePorTarea_case: 'Case: Braze 3/4" suction line with acetylene torch in mechanical room.',
        mp_ppePorTarea_tip:  'Tip: PPE does not replace engineering controls. Ventilation first, then gear.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'ppePorTarea');
      var task = ins.task || 'solder';
      var es = ES();
      // PPE map per task
      var map = {
        solder: {
          eye:  'Z87.1+ IR-5 shade goggles',
          hand: 'Welding gloves, leather cuff',
          foot: 'ASTM F2413 steel-toe, leather',
          resp: 'N95 (flux fumes) / P100 if galvanized',
          body: 'FR cotton long sleeve, no synthetics',
          ear:  '—'
        },
        charge: {
          eye:  'ANSI Z87.1 splash goggles',
          hand: 'Nitrile gloves + insulated refrigerant gloves',
          foot: 'ASTM F2413 steel-toe',
          resp: (es?'No requerido (área ventilada)':'Not required (ventilated area)'),
          body: 'FR long sleeve',
          ear:  '—'
        },
        a2l: {
          eye:  'ANSI Z87.1 sealed goggles',
          hand: 'Cryogenic-rated gloves',
          foot: 'Static-dissipative ASTM F2413',
          resp: 'SCBA if release > 5 lb / confined',
          body: 'FR suit, no static-generating fabric',
          ear:  '—'
        },
        conf: {
          eye:  'ANSI Z87.1 goggles + face shield',
          hand: 'Cut-resistant A4 + chemical liner',
          foot: 'ASTM F2413 steel-toe, puncture resistant',
          resp: 'SAR or SCBA (OSHA 1910.146)',
          body: 'FR coverall + harness (ANSI Z359)',
          ear:  (es?'Tapones si >85 dBA':'Plugs if >85 dBA')
        },
        hv: {
          eye:  'ANSI Z87.1 + arc flash face shield',
          hand: 'Class 0 rubber gloves (1000 V) + leather protectors',
          foot: 'ASTM F2413 EH rated (dielectric)',
          resp: '—',
          body: 'AR CAT 2 (8 cal/cm²) minimum',
          ear:  '—'
        },
        rtu: {
          eye:  'ANSI Z87.1 safety glasses',
          hand: 'Cut A3, grip palm',
          foot: 'ASTM F2413 slip-resistant',
          resp: 'N95 (outdoor dust)',
          body: 'FR long sleeve + high-vis Class 2',
          ear:  '—'
        },
        attic: {
          eye:  'ANSI Z87.1 goggles',
          hand: 'Cut A3 + fiberglass gloves',
          foot: 'ASTM F2413 steel-toe',
          resp: 'N95 or P100 (fiberglass, rodent waste)',
          body: 'Disposable Tyvek + hood',
          ear:  '—'
        },
        coil: {
          eye:  'ANSI Z87.1 chemical splash goggles + face shield',
          hand: 'Neoprene or butyl chemical gloves',
          foot: 'Chemical-resistant rubber boots',
          resp: 'APR w/ acid-gas cartridge (NIOSH)',
          body: 'Chemical-resistant apron + Tyvek',
          ear:  '—'
        }
      };
      var p = map[task] || map.solder;
      function row(lblKey, val){
        return '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:10px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;">' +
                 '<span style="font-weight:700;color:#111;font-size:13px;flex-shrink:0;">' + esc(t(lblKey,'')) + '</span>' +
                 '<span style="color:#111;font-size:13px;text-align:right;">' + esc(val) + '</span>' +
               '</div>';
      }
      var tasks = ['solder','charge','a2l','conf','hv','rtu','attic','coil'];
      var labels = {
        solder:'mp_ppe_t_solder', charge:'mp_ppe_t_charge', a2l:'mp_ppe_t_a2l', conf:'mp_ppe_t_conf',
        hv:'mp_ppe_t_hv', rtu:'mp_ppe_t_rtu', attic:'mp_ppe_t_attic', coil:'mp_ppe_t_coil'
      };
      var opts = '';
      for (var i=0;i<tasks.length;i++){
        var k = tasks[i];
        opts += '<option value="' + k + '" ' + (task===k?'selected':'') + '>' + esc(t(labels[k],'')) + '</option>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('ppePorTarea','mp_ppe_title','mp_ppe_sub','🦺',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_ppe_task','Tarea')) + '</span></div>' +
              '<select class="mp-in" data-in="ppePorTarea.task">' + opts + '</select>' +
            '</div>' +
          '</div>' +
          '<div class="mp-res">' +
            '<div class="mp-res-lbl">◆ ' + esc(ES()?'PPE Requerido':'Required PPE') + '</div>' +
            '<div style="margin-top:10px;">' +
              row('mp_ppe_eye',  p.eye) +
              row('mp_ppe_hand', p.hand) +
              row('mp_ppe_foot', p.foot) +
              row('mp_ppe_resp', p.resp) +
              row('mp_ppe_body', p.body) +
              row('mp_ppe_ear',  p.ear) +
            '</div>' +
          '</div>' +
          exampleTip('mp_ppePorTarea_case','mp_ppePorTarea_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 4: First Aid — Electric shock ──────────────────────────────
  window.MP_CALCS['firstAidElec'] = {
    i18n: {
      es: {
        mp_fae_title: 'Primeros Auxilios — Shock Eléctrico',
        mp_fae_sub:   'OSHA 1910.269 · AHA CPR 2020',
        mp_fae_s1: '1. NO TOQUE a la víctima si todavía está en contacto con la fuente eléctrica',
        mp_fae_s2: '2. Des-energize — corte el breaker principal o disconnect antes de intervenir',
        mp_fae_s3: '3. Llame al 911 inmediatamente',
        mp_fae_s4: '4. Revise respiración y pulso (10 segundos máximo)',
        mp_fae_s5: '5. Inicie CPR si no hay pulso — compresiones 100–120/min, 2" profundidad',
        mp_fae_s6: '6. Use AED tan pronto esté disponible — siga las instrucciones de voz',
        mp_fae_s7: '7. Trate quemaduras eléctricas con gasa seca estéril, no agua fría',
        mp_fae_s8: '8. Monitoree 24–48h por arritmia tardía — envío obligatorio al hospital',
        mp_fae_aed:   'Cuándo usar AED',
        mp_fae_aed_d: 'Víctima inconsciente, no respira o respira anormalmente, sin pulso palpable. Encienda el AED y siga las instrucciones de voz. Continúe CPR entre descargas.',
        mp_fae_int:   'Señales de lesión interna',
        mp_fae_int_d: '• Puntos de entrada/salida (quemaduras en manos/pies)\n• Arritmia cardíaca o dolor torácico\n• Confusión, debilidad muscular\n• Orina color marrón (rabdomiólisis)\n• Convulsiones',
        mp_firstAidElec_case: 'Caso: Técnico agarró cable vivo 240V en unit box. Sigue consciente pero confundido.',
        mp_firstAidElec_tip:  'Tip: Toda exposición >50V requiere evaluación médica aunque la víctima diga estar bien.'
      },
      en: {
        mp_fae_title: 'First Aid — Electric Shock',
        mp_fae_sub:   'OSHA 1910.269 · AHA CPR 2020',
        mp_fae_s1: '1. DO NOT TOUCH the victim if still in contact with the electrical source',
        mp_fae_s2: '2. De-energize — shut off main breaker or disconnect before intervening',
        mp_fae_s3: '3. Call 911 immediately',
        mp_fae_s4: '4. Check breathing and pulse (10 seconds max)',
        mp_fae_s5: '5. Start CPR if no pulse — compressions 100–120/min, 2" deep',
        mp_fae_s6: '6. Use AED as soon as available — follow voice prompts',
        mp_fae_s7: '7. Treat electrical burns with dry sterile gauze, not cold water',
        mp_fae_s8: '8. Monitor 24–48h for delayed arrhythmia — mandatory hospital transport',
        mp_fae_aed:   'When to use AED',
        mp_fae_aed_d: 'Victim unconscious, not breathing or breathing abnormally, no palpable pulse. Power on the AED and follow voice prompts. Continue CPR between shocks.',
        mp_fae_int:   'Signs of internal injury',
        mp_fae_int_d: '• Entry/exit points (burns on hands/feet)\n• Cardiac arrhythmia or chest pain\n• Confusion, muscle weakness\n• Brown-colored urine (rhabdomyolysis)\n• Seizures',
        mp_firstAidElec_case: 'Case: Tech grabbed live 240V wire in unit box. Still conscious but confused.',
        mp_firstAidElec_tip:  'Tip: Any >50V exposure requires medical evaluation even if victim feels fine.'
      }
    },
    render: function(state, helpers){
      var H = h();
      var steps = '';
      for (var i=1;i<=8;i++){
        steps +=
          '<div style="display:flex;gap:10px;padding:10px 12px;background:#fff;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;margin-bottom:6px;">' +
            '<span style="font-size:13px;color:#111;line-height:1.5;">' + esc(t('mp_fae_s'+i,'')) + '</span>' +
          '</div>';
      }
      var intD = String(t('mp_fae_int_d','')).replace(/\n/g,'<br>');
      if (H.renderCalcShell) {
        return H.renderCalcShell('firstAidElec','mp_fae_title','mp_fae_sub','⚡',
          '<div class="mp-res" style="background:#FEE2E2;border:2px solid #DC2626;">' +
            '<div class="mp-res-lbl" style="color:#7F1D1D;">◆ ' + esc(ES()?'EMERGENCIA — Llame al 911':'EMERGENCY — Call 911') + '</div>' +
            '<div class="mp-res-main" style="color:#7F1D1D;font-size:28px;">911</div>' +
            '<div class="mp-res-desc" style="color:#7F1D1D;font-weight:600;">' + esc(ES()?'Des-energize ANTES de tocar la víctima':'De-energize BEFORE touching victim') + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Pasos':'Steps') + '</div>' +
            steps +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fae_aed','')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.5;padding:10px 12px;background:#F0F9FF;border:1px solid #3B82F6;border-radius:8px;">' + esc(t('mp_fae_aed_d','')) + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fae_int','')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.7;padding:10px 12px;background:#FFFBEB;border:1px solid #F59E0B;border-radius:8px;">' + intD + '</div>' +
          '</div>' +
          exampleTip('mp_firstAidElec_case','mp_firstAidElec_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 5: First Aid — Refrigerant exposure ────────────────────────
  window.MP_CALCS['firstAidRefrig'] = {
    i18n: {
      es: {
        mp_far_title: 'Primeros Auxilios — Exposición a Refrigerante',
        mp_far_sub:   'EPA 608 · OSHA 1910.1000 · SDS del fabricante',
        mp_far_inh:   'Inhalación',
        mp_far_inh_d: '1. Llevar a víctima a aire fresco inmediatamente\n2. Aflojar ropa apretada (cuello, cintura)\n3. Si hay dificultad respiratoria, administrar oxígeno al 100%\n4. Si no respira, iniciar respiración de rescate\n5. Llamar 911 — NO usar epinefrina (puede causar arritmia fatal)',
        mp_far_skin:  'Piel / Quemadura por frío (frostbite)',
        mp_far_skin_d:'1. NO frote el área afectada (daña tejido)\n2. Sumerja en agua TIBIA (100–104°F / 38–40°C), no caliente\n3. Mantenga 20–30 minutos hasta recolorar\n4. Cubra con gasa estéril suelta\n5. Busque atención médica — riesgo de necrosis',
        mp_far_eye:   'Ojo (salpicadura)',
        mp_far_eye_d: '1. Enjuagar con agua tibia durante MÍNIMO 15 minutos\n2. Mantener párpados abiertos, enjuagar de nariz hacia fuera\n3. Remover lentes de contacto si es posible\n4. NO vendar el ojo\n5. Transporte inmediato a emergencias con oftalmólogo',
        mp_far_ing:   'Ingestión (raro)',
        mp_far_ing_d: '1. NO induzca vómito\n2. NO dé nada por boca si inconsciente\n3. Enjuague la boca con agua\n4. Llamar Centro de Veneno: 1-800-222-1222\n5. Llevar SDS del refrigerante al hospital',
        mp_far_sds:   'Referencia SDS',
        mp_far_sds_d: 'Todo sitio de trabajo debe tener la Hoja de Datos de Seguridad (SDS) del refrigerante presente. OSHA 1910.1200 requiere acceso inmediato. Identifique el refrigerante por color de cilindro y etiqueta antes de cualquier acción.',
        mp_firstAidRefrig_case: 'Caso: Línea de líquido R-410A reventó y salpicó en brazo del técnico — área blanca, dolorosa.',
        mp_firstAidRefrig_tip:  'Tip: NUNCA use agua caliente en frostbite. El recalentamiento rápido daña más tejido.'
      },
      en: {
        mp_far_title: 'First Aid — Refrigerant Exposure',
        mp_far_sub:   'EPA 608 · OSHA 1910.1000 · Manufacturer SDS',
        mp_far_inh:   'Inhalation',
        mp_far_inh_d: '1. Move victim to fresh air immediately\n2. Loosen tight clothing (collar, waist)\n3. If breathing difficulty, give 100% oxygen\n4. If not breathing, start rescue breathing\n5. Call 911 — DO NOT use epinephrine (risk of fatal arrhythmia)',
        mp_far_skin:  'Skin / Cold burn (frostbite)',
        mp_far_skin_d:'1. DO NOT rub affected area (damages tissue)\n2. Immerse in WARM water (100–104°F / 38–40°C), not hot\n3. Keep 20–30 minutes until recolored\n4. Cover with loose sterile gauze\n5. Seek medical care — necrosis risk',
        mp_far_eye:   'Eye (splash)',
        mp_far_eye_d: '1. Flush with tepid water for MINIMUM 15 minutes\n2. Hold eyelids open, flush from nose outward\n3. Remove contact lenses if possible\n4. DO NOT bandage the eye\n5. Immediate transport to ER with ophthalmologist',
        mp_far_ing:   'Ingestion (rare)',
        mp_far_ing_d: '1. DO NOT induce vomiting\n2. DO NOT give anything by mouth if unconscious\n3. Rinse mouth with water\n4. Call Poison Control: 1-800-222-1222\n5. Bring refrigerant SDS to hospital',
        mp_far_sds:   'SDS Reference',
        mp_far_sds_d: 'Every jobsite must have the Safety Data Sheet (SDS) for refrigerants present. OSHA 1910.1200 requires immediate access. Identify the refrigerant by cylinder color and label before any action.',
        mp_firstAidRefrig_case: 'Case: R-410A liquid line burst and splashed on tech\'s arm — white, painful area.',
        mp_firstAidRefrig_tip:  'Tip: NEVER use hot water on frostbite. Rapid rewarming damages more tissue.'
      }
    },
    render: function(state, helpers){
      var H = h();
      function block(title, body, color){
        var bodyHtml = String(body).replace(/\n/g,'<br>');
        return '<div class="mp-sec">' +
                 '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(title) + '</div>' +
                 '<div style="font-size:13px;color:#111;line-height:1.7;padding:10px 12px;background:#fff;border-left:4px solid ' + color + ';border-radius:0 8px 8px 0;">' + bodyHtml + '</div>' +
               '</div>';
      }
      if (H.renderCalcShell) {
        return H.renderCalcShell('firstAidRefrig','mp_far_title','mp_far_sub','❄',
          '<div class="mp-res" style="background:#EFF6FF;border:2px solid #3B82F6;">' +
            '<div class="mp-res-lbl" style="color:#1E3A8A;">◆ ' + esc(ES()?'Centro de Veneno':'Poison Control') + '</div>' +
            '<div class="mp-res-main" style="color:#1E3A8A;font-size:22px;">1-800-222-1222</div>' +
            '<div class="mp-res-desc" style="color:#1E3A8A;">' + esc(ES()?'Tenga la SDS del refrigerante a la mano':'Have refrigerant SDS ready') + '</div>' +
          '</div>' +
          block(t('mp_far_inh',''),  t('mp_far_inh_d',''),  '#DC2626') +
          block(t('mp_far_skin',''), t('mp_far_skin_d',''), '#3B82F6') +
          block(t('mp_far_eye',''),  t('mp_far_eye_d',''),  '#F59E0B') +
          block(t('mp_far_ing',''),  t('mp_far_ing_d',''),  '#8B5CF6') +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_far_sds','')) + '</div>' +
            '<div style="font-size:12px;color:#111;line-height:1.5;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;">' + esc(t('mp_far_sds_d','')) + '</div>' +
          '</div>' +
          exampleTip('mp_firstAidRefrig_case','mp_firstAidRefrig_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 6: First Aid — Burns ───────────────────────────────────────
  window.MP_CALCS['firstAidBurns'] = {
    i18n: {
      es: {
        mp_fab_title: 'Primeros Auxilios — Quemaduras',
        mp_fab_sub:   'Térmica · Química · Eléctrica · Frío',
        mp_fab_type:  'Tipo de quemadura',
        mp_fab_degree:'Grado',
        mp_fab_t_thermal: 'Térmica (calor/llama)',
        mp_fab_t_chem:    'Química',
        mp_fab_t_elec:    'Eléctrica',
        mp_fab_t_cold:    'Frío / Frostbite',
        mp_fab_d1: '1er grado (epidermis)',
        mp_fab_d2: '2do grado (dermis parcial)',
        mp_fab_d3: '3er grado (espesor completo)',
        mp_fab_steps: 'Pasos',
        mp_fab_er:    'Acuda a Emergencias si…',
        mp_firstAidBurns_case:'Caso: Técnico tocó línea caliente al soldar — ampolla 2" en antebrazo.',
        mp_firstAidBurns_tip: 'Tip: NUNCA aplique hielo, mantequilla, pasta de dientes o remedios caseros. Agua fresca (no helada) es la regla.'
      },
      en: {
        mp_fab_title: 'First Aid — Burns',
        mp_fab_sub:   'Thermal · Chemical · Electrical · Cold',
        mp_fab_type:  'Burn type',
        mp_fab_degree:'Degree',
        mp_fab_t_thermal: 'Thermal (heat/flame)',
        mp_fab_t_chem:    'Chemical',
        mp_fab_t_elec:    'Electrical',
        mp_fab_t_cold:    'Cold / Frostbite',
        mp_fab_d1: '1st degree (epidermis)',
        mp_fab_d2: '2nd degree (partial dermis)',
        mp_fab_d3: '3rd degree (full thickness)',
        mp_fab_steps: 'Steps',
        mp_fab_er:    'Go to ER if…',
        mp_firstAidBurns_case:'Case: Tech touched hot line while brazing — 2" blister on forearm.',
        mp_firstAidBurns_tip: 'Tip: NEVER apply ice, butter, toothpaste or home remedies. Cool (not cold) water is the rule.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'firstAidBurns');
      var type = ins.type || 'thermal';
      var deg  = ins.degree || 'd2';
      var es = ES();
      // Build steps per type
      var stepsMap = {
        thermal: {
          d1: es?['Enjuague con agua fresca 10–15 min','No reviente ampollas','Cubra con gasa estéril suelta','Ibuprofeno para dolor','Aloe vera después de 24h']
                :['Cool with fresh water 10–15 min','Do not pop blisters','Cover with loose sterile gauze','Ibuprofen for pain','Aloe vera after 24h'],
          d2: es?['Enjuague con agua fresca 20 min','NO reviente ampollas','Cubra con gasa estéril NO-adherente','Eleve la extremidad','Busque atención médica si >3 pulgadas o en cara/manos/genitales']
                :['Cool with fresh water 20 min','DO NOT pop blisters','Cover with sterile NON-stick gauze','Elevate the limb','Seek medical care if >3 inches or face/hands/genitals'],
          d3: es?['Llame al 911 inmediatamente','NO remueva ropa pegada','Cubra con sábana limpia seca','NO sumerja en agua','Monitoree shock — eleve piernas','Mantenga víctima caliente']
                :['Call 911 immediately','DO NOT remove stuck clothing','Cover with clean dry sheet','DO NOT immerse in water','Monitor for shock — elevate legs','Keep victim warm']
        },
        chem: {
          d1: es?['Remueva ropa contaminada','Enjuague con agua MÍNIMO 20 minutos','Consulte SDS del producto','NO neutralice (ácido+base = calor)','Llame al Centro de Veneno 1-800-222-1222']
                :['Remove contaminated clothing','Flush with water MINIMUM 20 min','Consult product SDS','DO NOT neutralize (acid+base = heat)','Call Poison Control 1-800-222-1222'],
          d2: es?['Remueva ropa contaminada','Enjuague con agua 20–30 minutos','NO reviente ampollas','Cubra con gasa estéril','Transporte a ER con SDS en mano']
                :['Remove contaminated clothing','Flush with water 20–30 min','DO NOT pop blisters','Cover with sterile gauze','Transport to ER with SDS in hand'],
          d3: es?['Llame al 911','Enjuague continuo hasta llegada de EMS','NO remueva ropa pegada','Lleve SDS al hospital','Monitoree vía aérea si quemadura facial']
                :['Call 911','Continuous flushing until EMS arrival','DO NOT remove stuck clothing','Bring SDS to hospital','Monitor airway if facial burn']
        },
        elec: {
          d1: es?['Des-energize antes de tocar','Llame al 911 — toda quemadura eléctrica es ER','Revise pulso/respiración','Cubra con gasa seca estéril','Monitoree 24–48h por arritmia']
                :['De-energize before touching','Call 911 — all electric burns are ER','Check pulse/breathing','Cover with dry sterile gauze','Monitor 24–48h for arrhythmia'],
          d2: es?['Des-energize la fuente','911 inmediato','CPR/AED si no hay pulso','Busque puntos entrada/salida','Cubra ambas quemaduras con gasa seca']
                :['De-energize source','911 immediately','CPR/AED if no pulse','Check entry/exit points','Cover both burns with dry gauze'],
          d3: es?['Des-energize (breaker principal)','911 — crítico','CPR/AED según indicado','NO use agua (conductividad residual)','Cubra con sábana seca limpia','Transporte a centro de quemados']
                :['De-energize (main breaker)','911 — critical','CPR/AED as indicated','DO NOT use water (residual conductivity)','Cover with clean dry sheet','Transport to burn center']
        },
        cold: {
          d1: es?['Mueva víctima a área caliente','Remueva joyas/ropa mojada','Sumerja en agua tibia 100–104°F','NO frote el área','Envuelva en paño suave']
                :['Move victim to warm area','Remove jewelry/wet clothing','Immerse in warm water 100–104°F','DO NOT rub the area','Wrap in soft cloth'],
          d2: es?['Recalentamiento gradual 20–30 min agua tibia','NO uso agua caliente','NO reviente ampollas','Separe dedos con gasa','ER para evaluación']
                :['Gradual rewarming 20–30 min warm water','DO NOT use hot water','DO NOT pop blisters','Separate fingers with gauze','ER for evaluation'],
          d3: es?['911 — hipotermia posible','Recalentamiento HOSPITALARIO solamente','NO frote','Cubra con mantas secas','Monitoree CPR si necesario']
                :['911 — possible hypothermia','HOSPITAL rewarming only','DO NOT rub','Cover with dry blankets','Monitor CPR if needed']
        }
      };
      var st = stepsMap[type] && stepsMap[type][deg] ? stepsMap[type][deg] : [];
      var stepsHtml = '';
      for (var i=0;i<st.length;i++){
        stepsHtml +=
          '<div style="display:flex;gap:10px;padding:10px 12px;background:#fff;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;margin-bottom:6px;">' +
            '<span style="font-weight:700;color:#DC2626;font-size:13px;flex-shrink:0;">' + (i+1) + '.</span>' +
            '<span style="font-size:13px;color:#111;line-height:1.5;">' + esc(st[i]) + '</span>' +
          '</div>';
      }
      var erFlags = es?[
        'Quemadura >3 pulgadas o >9% del cuerpo',
        'Cara, manos, pies, genitales o articulaciones mayores',
        '3er grado (cualquier tamaño)',
        'Quemadura eléctrica o química',
        'Dificultad respiratoria o inhalación de humo',
        'Víctima niño, anciano o embarazada'
      ]:[
        'Burn >3 inches or >9% of body',
        'Face, hands, feet, genitals or major joints',
        '3rd degree (any size)',
        'Electrical or chemical burn',
        'Respiratory difficulty or smoke inhalation',
        'Victim is child, elderly or pregnant'
      ];
      var erHtml = '';
      for (var j=0;j<erFlags.length;j++){
        erHtml += '<li style="margin-bottom:4px;">' + esc(erFlags[j]) + '</li>';
      }
      var typeOpts = '';
      var tArr = ['thermal','chem','elec','cold'];
      var tLbls = {thermal:'mp_fab_t_thermal',chem:'mp_fab_t_chem',elec:'mp_fab_t_elec',cold:'mp_fab_t_cold'};
      for (var k=0;k<tArr.length;k++){
        typeOpts += '<option value="' + tArr[k] + '" ' + (type===tArr[k]?'selected':'') + '>' + esc(t(tLbls[tArr[k]],'')) + '</option>';
      }
      var degOpts = '';
      var dArr = ['d1','d2','d3'];
      for (var m=0;m<dArr.length;m++){
        degOpts += '<option value="' + dArr[m] + '" ' + (deg===dArr[m]?'selected':'') + '>' + esc(t('mp_fab_'+dArr[m],'')) + '</option>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('firstAidBurns','mp_fab_title','mp_fab_sub','🔥',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_fab_type','Tipo')) + '</span></div>' +
              '<select class="mp-in" data-in="firstAidBurns.type">' + typeOpts + '</select>' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_fab_degree','Grado')) + '</span></div>' +
              '<select class="mp-in" data-in="firstAidBurns.degree">' + degOpts + '</select>' +
            '</div>' +
          '</div>' +
          '<div class="mp-res">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_fab_steps','Pasos')) + '</div>' +
            '<div style="margin-top:10px;">' + stepsHtml + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fab_er','')) + '</div>' +
            '<ul style="font-size:13px;color:#111;line-height:1.5;padding:12px 12px 12px 30px;background:#FEE2E2;border:1px solid #DC2626;border-radius:8px;margin:0;">' + erHtml + '</ul>' +
          '</div>' +
          exampleTip('mp_firstAidBurns_case','mp_firstAidBurns_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 7: Confined Space Entry Checklist ──────────────────────────
  window.MP_CALCS['confinedSpace'] = {
    i18n: {
      es: {
        mp_cs_title: 'Espacio Confinado — Checklist de Entrada',
        mp_cs_sub:   'OSHA 29 CFR 1910.146',
        mp_cs_c1:  'Oxígeno probado · 19.5–23.5%',
        mp_cs_c2:  'LEL (límite inferior de explosión) < 10%',
        mp_cs_c3:  'Gases tóxicos < PEL (CO < 35 ppm, H2S < 10 ppm)',
        mp_cs_c4:  'Ventilación mecánica continua · 20 ACH mínimo',
        mp_cs_c5:  'Attendant (vigilante) afuera, capacitado',
        mp_cs_c6:  'Comunicación continua (radio/visual) establecida',
        mp_cs_c7:  'PPE completo: harness Z359, SAR/SCBA si requerido',
        mp_cs_c8:  'Permiso de entrada firmado por supervisor',
        mp_cs_c9:  'Sistema de rescate/retrieval (tripod + winch)',
        mp_cs_c10: 'Plan de emergencia revisado · EMS notificado',
        mp_cs_pass:  'APROBADO — Entrada autorizada',
        mp_cs_fail:  'NO APROBADO — Entrada prohibida',
        mp_cs_progress: 'Ítems completados',
        mp_cs_o2_note: 'Pruebe en este orden: O₂ → LEL → Tóxicos. Re-pruebe cada 30 min o si cambia condición.',
        mp_confinedSpace_case: 'Caso: Entrar a tanque de condensación 8x8x6 ft para limpiar coil — nunca abierto sin ventilación.',
        mp_confinedSpace_tip:  'Tip: NUNCA confíe en el olfato. H₂S satura al 100 ppm — muerte en 1 respiración.'
      },
      en: {
        mp_cs_title: 'Confined Space — Entry Checklist',
        mp_cs_sub:   'OSHA 29 CFR 1910.146',
        mp_cs_c1:  'Oxygen tested · 19.5–23.5%',
        mp_cs_c2:  'LEL (lower explosive limit) < 10%',
        mp_cs_c3:  'Toxic gases < PEL (CO < 35 ppm, H2S < 10 ppm)',
        mp_cs_c4:  'Continuous mechanical ventilation · 20 ACH minimum',
        mp_cs_c5:  'Attendant outside, trained',
        mp_cs_c6:  'Continuous communication (radio/visual) established',
        mp_cs_c7:  'Full PPE: Z359 harness, SAR/SCBA if required',
        mp_cs_c8:  'Entry permit signed by supervisor',
        mp_cs_c9:  'Rescue/retrieval system (tripod + winch)',
        mp_cs_c10: 'Emergency plan reviewed · EMS notified',
        mp_cs_pass:  'PASS — Entry authorized',
        mp_cs_fail:  'FAIL — Entry prohibited',
        mp_cs_progress: 'Items completed',
        mp_cs_o2_note: 'Test in this order: O₂ → LEL → Toxics. Re-test every 30 min or if conditions change.',
        mp_confinedSpace_case: 'Case: Enter 8x8x6 ft condensation tank to clean coil — never open without ventilation.',
        mp_confinedSpace_tip:  'Tip: NEVER trust your nose. H₂S saturates nose at 100 ppm — death in 1 breath.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'confinedSpace');
      var total = 10, done = 0;
      var items = '';
      for (var i = 1; i <= total; i++) {
        var on = isOn(ins['c'+i]);
        if (on) done++;
        items +=
          '<label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;margin-bottom:6px;background:#fff;border:1.5px solid ' + (on?'#4ADE80':'#E5E7EB') + ';border-radius:8px;cursor:pointer;' + (on?'background:#F0FDF4;':'') + '">' +
            '<input type="checkbox" class="mp-in" data-in="confinedSpace.c' + i + '" ' + (on?'checked':'') + ' style="margin-top:2px;width:18px;height:18px;flex-shrink:0;" />' +
            '<span style="font-size:13px;color:#111;line-height:1.45;' + (on?'text-decoration:line-through;color:#6B7280;':'') + '">' + esc(t('mp_cs_c'+i,'')) + '</span>' +
          '</label>';
      }
      var pass = done === total;
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('confinedSpace','mp_cs_title','mp_cs_sub','🕳',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Condiciones de entrada':'Entry conditions') + '</div>' +
            items +
          '</div>' +
          '<div class="mp-res" style="background:' + (pass?'#F0FDF4':'#FEE2E2') + ';border:2px solid ' + (pass?'#16A34A':'#DC2626') + ';">' +
            '<div class="mp-res-lbl" style="color:' + (pass?'#14532D':'#7F1D1D') + ';">◆ ' + esc(ES()?'Estado del permiso':'Permit status') + '</div>' +
            '<div class="mp-res-main" style="color:' + (pass?'#14532D':'#7F1D1D') + ';">' + (pass?'✓':'✗') + '<span class="mp-res-unit"></span></div>' +
            '<div class="mp-res-desc" style="color:' + (pass?'#14532D':'#7F1D1D') + ';font-weight:700;">' + esc(t(pass?'mp_cs_pass':'mp_cs_fail','')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_cs_progress','Ítems')) + '</div><div class="mp-res-val">' + done + '/' + total + '</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Resultado':'Result') + '</div><div class="mp-res-val" style="color:' + (pass?'#16A34A':'#DC2626') + ' !important;">' + (pass?'OK':'STOP') + '</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Orden de pruebas':'Test order') + '</div>' +
            '<div style="font-size:12px;color:#111;line-height:1.5;padding:10px 12px;background:#FFFBEB;border:1px solid #F59E0B;border-radius:8px;">' + esc(t('mp_cs_o2_note','')) + '</div>' +
          '</div>' +
          exampleTip('mp_confinedSpace_case','mp_confinedSpace_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 8: Ladder Safety ───────────────────────────────────────────
  window.MP_CALCS['ladderSafety'] = {
    i18n: {
      es: {
        mp_ld_title: 'Escaleras — Inspección y Uso Seguro',
        mp_ld_sub:   'OSHA 29 CFR 1926.1053 · ANSI A14',
        mp_ld_pre:   'Pre-uso (inspección)',
        mp_ld_setup: 'Instalación',
        mp_ld_use:   'Uso',
        mp_ld_p1: 'Rieles sin fisuras, torceduras ni corrosión',
        mp_ld_p2: 'Peldaños limpios, sin grasa ni óxido, todos presentes',
        mp_ld_p3: 'Pies (zapatas) intactos, antideslizantes',
        mp_ld_p4: 'Separadores (spreaders) de escalera tijera bloquean firmes',
        mp_ld_p5: 'Etiquetas de carga y fabricante legibles',
        mp_ld_s1: 'Relación 4:1 — 1 pie de base por cada 4 pies de altura',
        mp_ld_s2: 'Extiende 3 ft (3 peldaños) sobre el punto de apoyo superior',
        mp_ld_s3: 'Amarrada arriba o con persona sujetándola',
        mp_ld_s4: 'Terreno nivelado y firme (no cartón, no alfombra)',
        mp_ld_s5: 'Lejos de líneas eléctricas (mín 10 ft si >50 kV)',
        mp_ld_u1: 'Contacto de 3 puntos siempre (2 manos + 1 pie, o 2 pies + 1 mano)',
        mp_ld_u2: 'No exceder capacidad de carga (Tipo IA = 300 lb, IAA = 375 lb)',
        mp_ld_u3: 'Cara hacia la escalera al subir y bajar',
        mp_ld_u4: 'No pararse en los 3 peldaños superiores (tijera) o 4 superiores (extensión)',
        mp_ld_u5: 'Herramientas en cinto o cubeta con soga — nunca en las manos',
        mp_ld_diag:  'Diagrama 4:1',
        mp_ld_diag_d:'Altura (H) = 16 ft\nBase (B) = H ÷ 4 = 4 ft\nLa base se separa 4 ft de la pared cuando la parte superior apoya a 16 ft de altura. Ángulo de apoyo ≈ 75°.',
        mp_ld_score: 'Puntuación',
        mp_ladderSafety_case:'Caso: Subir al techo para revisar RTU a 14 ft. Escalera de extensión de 24 ft.',
        mp_ladderSafety_tip: 'Tip: El 20% de caídas fatales en construcción son de escaleras. Amarre arriba SIEMPRE si está >10 ft.'
      },
      en: {
        mp_ld_title: 'Ladder — Inspection & Safe Use',
        mp_ld_sub:   'OSHA 29 CFR 1926.1053 · ANSI A14',
        mp_ld_pre:   'Pre-use (inspection)',
        mp_ld_setup: 'Setup',
        mp_ld_use:   'Use',
        mp_ld_p1: 'Rails free of cracks, bends, corrosion',
        mp_ld_p2: 'Rungs clean, no grease or rust, all present',
        mp_ld_p3: 'Feet (shoes) intact, non-slip',
        mp_ld_p4: 'Spreaders on step ladder lock firmly',
        mp_ld_p5: 'Load and manufacturer labels legible',
        mp_ld_s1: '4:1 ratio — 1 ft base per 4 ft height',
        mp_ld_s2: 'Extends 3 ft (3 rungs) above upper support point',
        mp_ld_s3: 'Tied off at top or held by person',
        mp_ld_s4: 'Level, firm ground (no cardboard, no carpet)',
        mp_ld_s5: 'Away from power lines (min 10 ft if >50 kV)',
        mp_ld_u1: '3-point contact always (2 hands + 1 foot, or 2 feet + 1 hand)',
        mp_ld_u2: 'Do not exceed load capacity (Type IA = 300 lb, IAA = 375 lb)',
        mp_ld_u3: 'Face the ladder when climbing up and down',
        mp_ld_u4: 'Do not stand on top 3 rungs (step) or top 4 (extension)',
        mp_ld_u5: 'Tools in belt or hoist bucket — never in hands',
        mp_ld_diag:  '4:1 Diagram',
        mp_ld_diag_d:'Height (H) = 16 ft\nBase (B) = H ÷ 4 = 4 ft\nBase sits 4 ft from wall when top rests 16 ft up. Support angle ≈ 75°.',
        mp_ld_score: 'Score',
        mp_ladderSafety_case:'Case: Climb to roof to service RTU at 14 ft. 24-ft extension ladder.',
        mp_ladderSafety_tip: 'Tip: 20% of fatal construction falls are from ladders. ALWAYS tie off at top if >10 ft.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'ladderSafety');
      function section(titleKey, prefix, count){
        var html = '<div class="mp-sec">' +
                     '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t(titleKey,'')) + '</div>';
        for (var i=1;i<=count;i++){
          var key = prefix + i;
          var on = isOn(ins[key]);
          html +=
            '<label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;margin-bottom:6px;background:#fff;border:1.5px solid ' + (on?'#4ADE80':'#E5E7EB') + ';border-radius:8px;cursor:pointer;' + (on?'background:#F0FDF4;':'') + '">' +
              '<input type="checkbox" class="mp-in" data-in="ladderSafety.' + key + '" ' + (on?'checked':'') + ' style="margin-top:2px;width:18px;height:18px;flex-shrink:0;" />' +
              '<span style="font-size:13px;color:#111;line-height:1.45;' + (on?'text-decoration:line-through;color:#6B7280;':'') + '">' + esc(t('mp_ld_'+key,'')) + '</span>' +
            '</label>';
        }
        html += '</div>';
        return html;
      }
      function count(prefix, n){
        var c = 0;
        for (var i=1;i<=n;i++) if (isOn(ins[prefix+i])) c++;
        return c;
      }
      var doneP = count('p',5), doneS = count('s',5), doneU = count('u',5);
      var total = 15, done = doneP + doneS + doneU;
      var pct = Math.round((done/total)*100);
      var pass = done === total;
      var diagBody = String(t('mp_ld_diag_d','')).replace(/\n/g,'<br>');
      // ASCII-ish visual 4:1 diagram
      var diagram =
        '<div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#111;line-height:1.3;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;white-space:pre;">' +
'┌─ Top (3 ft above landing)\n' +
'│\n' +
'│ \\\n' +
'│  \\   Angle ≈ 75°\n' +
'│   \\\n' +
'│    \\  H = 16 ft\n' +
'│     \\\n' +
'│      \\\n' +
'│       \\\n' +
'└────────┴─── B = 4 ft (H ÷ 4)' +
        '</div>';
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('ladderSafety','mp_ld_title','mp_ld_sub','🪜',
          section('mp_ld_pre','p',5) +
          section('mp_ld_setup','s',5) +
          section('mp_ld_use','u',5) +
          '<div class="mp-res" style="background:' + (pass?'#F0FDF4':'#FFFBEB') + ';border:2px solid ' + (pass?'#16A34A':'#F59E0B') + ';">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_ld_score','Puntuación')) + '</div>' +
            '<div class="mp-res-main">' + pct + '<span class="mp-res-unit">%</span></div>' +
            '<div class="mp-res-desc" style="font-weight:700;">' + (pass?(ES()?'Listo para usar':'Ready to use'):(ES()?'Complete inspección antes de subir':'Complete inspection before climbing')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_ld_pre','Pre-uso')) + '</div><div class="mp-res-val">' + doneP + '/5</div></div>' +
              '<div><div class="mp-res-item">' + esc(t('mp_ld_setup','Setup')) + '</div><div class="mp-res-val">' + doneS + '/5</div></div>' +
            '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_ld_use','Uso')) + '</div><div class="mp-res-val">' + doneU + '/5</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Total':'Total') + '</div><div class="mp-res-val">' + done + '/' + total + '</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_ld_diag','Diagrama 4:1')) + '</div>' +
            diagram +
            '<div style="font-size:12px;color:#111;line-height:1.6;padding:10px 12px;margin-top:8px;background:#F0F9FF;border:1px solid #3B82F6;border-radius:8px;">' + diagBody + '</div>' +
          '</div>' +
          exampleTip('mp_ladderSafety_case','mp_ladderSafety_tip')
        );
      }
      return '';
    }
  };

})();
