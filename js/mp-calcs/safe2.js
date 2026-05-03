// Maestro Pro · Safety 2 tools
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
  function getIn(state, tool){ return (state && state.inputs && state.inputs[tool]) || {}; }
  function isOn(v){ return v === 'on' || v === true || v === 'true' || v === '1'; }
  function lang(){ var H=h(); return (H.lang && H.lang()) || (window.currentLang || 'es'); }
  function ES(){ return lang() === 'es'; }

  // ── Tool 1: JSA Builder ──────────────────────────────────────────────
  window.MP_CALCS['jsaBuilder'] = {
    i18n: {
      es: {
        mp_jsa_title: 'JSA — Análisis de Seguridad del Trabajo',
        mp_jsa_sub:   'Plantilla imprimible · OSHA 3071 · ANSI Z10',
        mp_jsa_task:  'Nombre de la tarea',
        mp_jsa_location: 'Ubicación / Sitio',
        mp_jsa_date:  'Fecha',
        mp_jsa_crew:  'Personal asignado',
        mp_jsa_preset: 'Plantilla pre-cargada',
        mp_jsa_preset_cond:   'Instalación de condensador',
        mp_jsa_preset_furnace:'Reemplazo de furnace',
        mp_jsa_preset_braze:  'Brazing en ático',
        mp_jsa_preset_rtu:    'Servicio de RTU en techo',
        mp_jsa_preset_recov:  'Recuperación de refrigerante',
        mp_jsa_step_col:      'Paso',
        mp_jsa_hazard_col:    'Peligro',
        mp_jsa_control_col:   'Control',
        mp_jsa_ppe_req:  'PPE requerido',
        mp_jsa_emerg:    'Contactos de emergencia',
        mp_jsa_emerg_911:'911 — Emergencias médicas/fuego',
        mp_jsa_emerg_poison: 'Centro de Veneno: 1-800-222-1222',
        mp_jsa_emerg_sup:'Supervisor del sitio (celular)',
        mp_jsa_emerg_osha:'OSHA: 1-800-321-OSHA',
        mp_jsa_sign:    'Firmas',
        mp_jsa_sign_tech:'Técnico ejecutor',
        mp_jsa_sign_sup: 'Supervisor',
        mp_jsa_sign_safety:'Oficial de seguridad',
        mp_jsa_sign_client:'Cliente (opcional)',
        mp_jsa_print:   'Listo para imprimir — pulse botón imprimir del navegador',
        mp_jsaBuilder_case: 'Caso: Instalación de condensador R-410A 3-ton en patio residencial con losa nueva.',
        mp_jsaBuilder_tip:  'Tip: El JSA debe completarse ANTES de llegar al sitio. Revise con la cuadrilla al llegar — OSHA 1926.20 requiere "competent person" inspection.'
      },
      en: {
        mp_jsa_title: 'JSA — Job Safety Analysis',
        mp_jsa_sub:   'Printable template · OSHA 3071 · ANSI Z10',
        mp_jsa_task:  'Task name',
        mp_jsa_location: 'Location / Site',
        mp_jsa_date:  'Date',
        mp_jsa_crew:  'Assigned crew',
        mp_jsa_preset: 'Pre-loaded template',
        mp_jsa_preset_cond:   'Condenser install',
        mp_jsa_preset_furnace:'Furnace replacement',
        mp_jsa_preset_braze:  'Brazing in attic',
        mp_jsa_preset_rtu:    'Rooftop RTU service',
        mp_jsa_preset_recov:  'Refrigerant recovery',
        mp_jsa_step_col:      'Step',
        mp_jsa_hazard_col:    'Hazard',
        mp_jsa_control_col:   'Control',
        mp_jsa_ppe_req:  'Required PPE',
        mp_jsa_emerg:    'Emergency contacts',
        mp_jsa_emerg_911:'911 — Medical / fire emergencies',
        mp_jsa_emerg_poison: 'Poison Control: 1-800-222-1222',
        mp_jsa_emerg_sup:'Site supervisor (cell)',
        mp_jsa_emerg_osha:'OSHA: 1-800-321-OSHA',
        mp_jsa_sign:    'Signatures',
        mp_jsa_sign_tech:'Performing technician',
        mp_jsa_sign_sup: 'Supervisor',
        mp_jsa_sign_safety:'Safety officer',
        mp_jsa_sign_client:'Client (optional)',
        mp_jsa_print:   'Ready to print — use browser print button',
        mp_jsaBuilder_case: 'Case: 3-ton R-410A condenser install on new residential pad.',
        mp_jsaBuilder_tip:  'Tip: JSA should be completed BEFORE arriving onsite. Review with crew on arrival — OSHA 1926.20 requires "competent person" inspection.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'jsaBuilder');
      var preset = ins.preset || 'cond';
      var es = ES();
      var presets = {
        cond: {
          title: es?'Instalación de condensador':'Condenser install',
          rows: [
            { step: es?'Descarga y posicionamiento del condensador':'Unload and position condenser',
              hazard: es?'Lesión de espalda/pie por carga >100 lb':'Back/foot injury from >100 lb load',
              control: es?'Carretilla de 2 ruedas + 2 personas + ASTM F2413 steel-toe':'2-wheel dolly + 2 persons + ASTM F2413 steel-toe' },
            { step: es?'Corte de disconnect eléctrico':'Disconnect electrical service',
              hazard: es?'Shock 240V · arc flash':'240V shock · arc flash',
              control: es?'LOTO · probar con Fluke antes · CAT 2 PPE':'LOTO · test with Fluke · CAT 2 PPE' },
            { step: es?'Conexión de líneas de refrigerante':'Connect refrigerant lines',
              hazard: es?'Quemadura por brazing · frostbite por refrigerante':'Brazing burn · refrigerant frostbite',
              control: es?'Gafas IR-5 · nitrógeno purga · guantes cuero':'IR-5 goggles · nitrogen purge · leather gloves' },
            { step: es?'Evacuación al vacío':'Pull vacuum',
              hazard: es?'Proyección de cilindro si se carga sin vacío':'Cylinder burst if charged without vacuum',
              control: es?'500 μm hold 10 min · micrón gauge calibrado':'500 μm 10-min hold · calibrated micron gauge' },
            { step: es?'Carga de refrigerante R-410A':'Charge R-410A refrigerant',
              hazard: es?'Exposición a alta presión · asfixia':'High-pressure exposure · asphyxiation',
              control: es?'Báscula digital · ventilación · SDS disponible':'Digital scale · ventilation · SDS available' }
          ],
          ppe: es?'Z87.1 gafas · guantes cuero+nitrilo · steel-toe · FR manga larga · protección auditiva':'Z87.1 goggles · leather+nitrile gloves · steel-toe · FR long sleeve · hearing protection'
        },
        furnace: {
          title: es?'Reemplazo de furnace':'Furnace replacement',
          rows: [
            { step: es?'Apagar gas y corriente':'Shut off gas and power',
              hazard: es?'Fuga de gas natural · shock 120V':'Natural gas leak · 120V shock',
              control: es?'Cierre válvula gas · LOTO · detector de gas':'Close gas valve · LOTO · gas sniffer' },
            { step: es?'Desconectar ductos y venteo':'Disconnect ducts and venting',
              hazard: es?'CO residual · partículas de fibra':'Residual CO · fiberglass particles',
              control: es?'Ventilador 20 min antes · N95 · gafas':'20-min fan purge · N95 · goggles' },
            { step: es?'Remover furnace viejo':'Remove old furnace',
              hazard: es?'Lesión de espalda · caída en escalera de ático':'Back strain · attic ladder fall',
              control: es?'2 personas · correa para descender · 3-puntos contacto':'2 persons · descent strap · 3-point contact' },
            { step: es?'Posicionar furnace nuevo':'Set new furnace',
              hazard: es?'Aplastamiento · bordes de lámina':'Crush injury · sheet metal edges',
              control: es?'Guantes A3 cut · soportes intermedios':'A3 cut gloves · intermediate supports' },
            { step: es?'Prueba de combustión':'Combustion test',
              hazard: es?'CO alto · llama inversa':'High CO · flame rollout',
              control: es?'Analizador combustión · CO < 100 ppm · draft OK':'Combustion analyzer · CO < 100 ppm · draft OK' }
          ],
          ppe: es?'Z87.1 gafas · guantes cut-A3 · steel-toe · N95 · detector CO personal':'Z87.1 goggles · A3 cut gloves · steel-toe · N95 · personal CO monitor'
        },
        braze: {
          title: es?'Brazing en ático':'Brazing in attic',
          rows: [
            { step: es?'Entrada al ático':'Attic access',
              hazard: es?'Caída en trampilla · golpe de calor >140°F':'Trapdoor fall · heat stroke >140°F',
              control: es?'Escalera amarrada · hidratación · hora temprana':'Tied-off ladder · hydration · early hours' },
            { step: es?'Preparación del área':'Area prep',
              hazard: es?'Fuego por fibra de vidrio o madera seca':'Fire from fiberglass or dry wood',
              control: es?'Manta retardante · humedecer zona · 35 ft radio limpio':'Fire blanket · wet area · 35 ft clear radius' },
            { step: es?'Purga con nitrógeno':'Nitrogen purge',
              hazard: es?'Asfixia · sobre-presión':'Asphyxiation · overpressure',
              control: es?'Regulador con alivio · 3–5 psig · monitor O₂':'Relief regulator · 3–5 psig · O₂ monitor' },
            { step: es?'Soldadura (brazing) de cobre':'Copper brazing',
              hazard: es?'Quemadura · humo tóxico de flux':'Burn · toxic flux fume',
              control: es?'IR-5 goggles · guantes soldador · vigía con extintor':'IR-5 goggles · welding gloves · fire watch with extinguisher' },
            { step: es?'Vigilancia de fuego':'Fire watch',
              hazard: es?'Ignición tardía (30 min)':'Delayed ignition (30 min)',
              control: es?'Permiso de trabajo en caliente · vigilancia 30 min post':'Hot work permit · 30-min post fire watch' }
          ],
          ppe: es?'IR-5 goggles · guantes cuero soldador · FR manga larga · N95 · ventilador auxiliar':'IR-5 goggles · leather welding gloves · FR long sleeve · N95 · auxiliary fan'
        },
        rtu: {
          title: es?'Servicio de RTU en techo':'Rooftop RTU service',
          rows: [
            { step: es?'Acceso al techo':'Roof access',
              hazard: es?'Caída de >6 ft':'Fall >6 ft',
              control: es?'Harness ANSI Z359 + lanyard · sistema anclaje':'ANSI Z359 harness + lanyard · anchor system' },
            { step: es?'Corte de poder':'Power disconnect',
              hazard: es?'Shock 480V 3∅ · arc flash':'480V 3∅ shock · arc flash',
              control: es?'LOTO · guantes Class 0 · AR CAT 2':'LOTO · Class 0 gloves · AR CAT 2' },
            { step: es?'Apertura de panel':'Panel opening',
              hazard: es?'Bordes filosos · capacitor cargado':'Sharp edges · charged capacitor',
              control: es?'Guantes A3 · descargar capacitor con resistor':'A3 gloves · bleed capacitor with resistor' },
            { step: es?'Limpieza de coil':'Coil cleaning',
              hazard: es?'Químico alcalino · salpicadura':'Alkaline chemical · splash',
              control: es?'Gafas químicas + face shield · delantal neopreno':'Chemical goggles + face shield · neoprene apron' },
            { step: es?'Descenso con herramientas':'Tool descent',
              hazard: es?'Caída de objetos al piso':'Falling objects to ground',
              control: es?'Cubeta con soga · zona cordón abajo':'Rope bucket · ground cordon zone' }
          ],
          ppe: es?'Harness Z359 · AR CAT 2 · guantes Class 0 · Z87.1 · high-vis Class 2':'Z359 harness · AR CAT 2 · Class 0 gloves · Z87.1 · Class 2 high-vis'
        },
        recov: {
          title: es?'Recuperación de refrigerante':'Refrigerant recovery',
          rows: [
            { step: es?'Identificación del refrigerante':'Identify refrigerant',
              hazard: es?'Mezcla cruzada en cilindro de recuperación':'Cross-contamination in recovery cylinder',
              control: es?'Leer etiqueta/color · cilindro dedicado por tipo':'Read label/color · dedicated cylinder per type' },
            { step: es?'Conexión de mangueras':'Hose connection',
              hazard: es?'Quemadura por frío · spray a ojos':'Frostbite · eye spray',
              control: es?'Gafas sellada Z87.1 · guantes criogénicos':'Sealed Z87.1 goggles · cryogenic gloves' },
            { step: es?'Arranque de máquina recuperadora':'Recovery machine startup',
              hazard: es?'Sobrepresión · falla eléctrica':'Overpressure · electrical fault',
              control: es?'Válvula alivio calibrada · GFCI en circuito':'Calibrated relief valve · GFCI on circuit' },
            { step: es?'Pesaje de cilindro':'Cylinder weigh-out',
              hazard: es?'Sobrellenado (>80% DOT 4BW)':'Overfill (>80% DOT 4BW)',
              control: es?'Báscula calibrada · detener al 80% tare+WC':'Calibrated scale · stop at 80% tare+WC' },
            { step: es?'Documentación EPA 608':'EPA 608 documentation',
              hazard: es?'Multa EPA hasta $44,539 por venteo':'EPA fine up to $44,539 per vent',
              control: es?'Registro de recuperación · serial de cilindro':'Recovery record · cylinder serial' }
          ],
          ppe: es?'Gafas sellada · guantes criogénicos · steel-toe · ventilación forzada':'Sealed goggles · cryogenic gloves · steel-toe · forced ventilation'
        }
      };
      var p = presets[preset] || presets.cond;
      var presetKeys = ['cond','furnace','braze','rtu','recov'];
      var presetLbls = {
        cond:'mp_jsa_preset_cond', furnace:'mp_jsa_preset_furnace',
        braze:'mp_jsa_preset_braze', rtu:'mp_jsa_preset_rtu', recov:'mp_jsa_preset_recov'
      };
      var opts = '';
      for (var i=0;i<presetKeys.length;i++){
        var k = presetKeys[i];
        opts += '<option value="' + k + '" ' + (preset===k?'selected':'') + '>' + esc(t(presetLbls[k],'')) + '</option>';
      }
      // Build rows table
      var rows = '';
      for (var r=0;r<p.rows.length;r++){
        var row = p.rows[r];
        rows +=
          '<tr>' +
            '<td style="padding:10px;border:1px solid #E5E7EB;vertical-align:top;font-size:12px;color:#111;font-weight:700;width:28%;">' + esc(row.step) + '</td>' +
            '<td style="padding:10px;border:1px solid #E5E7EB;vertical-align:top;font-size:12px;color:#111;width:34%;background:#FEF2F2;">' + esc(row.hazard) + '</td>' +
            '<td style="padding:10px;border:1px solid #E5E7EB;vertical-align:top;font-size:12px;color:#111;width:38%;background:#F0FDF4;">' + esc(row.control) + '</td>' +
          '</tr>';
      }
      function field(lblKey, placeholder){
        return '<div style="display:flex;flex-direction:column;gap:4px;padding:10px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;">' +
                 '<span style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;">' + esc(t(lblKey,'')) + '</span>' +
                 '<div style="font-size:13px;color:#111;border-bottom:1px dashed #D1D5DB;min-height:22px;padding:2px 0;">' + esc(placeholder||'_______________________') + '</div>' +
               '</div>';
      }
      function signRow(lblKey){
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;">' +
                 '<span style="font-size:12px;font-weight:700;color:#111;width:40%;">' + esc(t(lblKey,'')) + '</span>' +
                 '<span style="flex:1;border-bottom:1.5px solid #111;height:22px;"></span>' +
                 '<span style="font-size:11px;color:#6B7280;">' + (es?'Firma / Fecha':'Sign / Date') + '</span>' +
               '</div>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('jsaBuilder','mp_jsa_title','mp_jsa_sub','📋',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_jsa_preset','Plantilla')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_jsa_preset','Plantilla')) + '</span></div>' +
              '<select class="mp-in" data-in="jsaBuilder.preset">' + opts + '</select>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(es?'Encabezado':'Header') + '</div>' +
            field('mp_jsa_task', p.title) +
            field('mp_jsa_location') +
            field('mp_jsa_date') +
            field('mp_jsa_crew') +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(es?'Pasos · Peligros · Controles':'Steps · Hazards · Controls') + '</div>' +
            '<div style="overflow-x:auto;">' +
            '<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">' +
              '<thead><tr style="background:#F3F4F6;">' +
                '<th style="padding:10px;border:1px solid #E5E7EB;font-size:11px;text-align:left;color:#111;">' + esc(t('mp_jsa_step_col','Paso')) + '</th>' +
                '<th style="padding:10px;border:1px solid #E5E7EB;font-size:11px;text-align:left;color:#111;">' + esc(t('mp_jsa_hazard_col','Peligro')) + '</th>' +
                '<th style="padding:10px;border:1px solid #E5E7EB;font-size:11px;text-align:left;color:#111;">' + esc(t('mp_jsa_control_col','Control')) + '</th>' +
              '</tr></thead>' +
              '<tbody>' + rows + '</tbody>' +
            '</table>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_jsa_ppe_req','PPE requerido')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.6;padding:10px 12px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;">' + esc(p.ppe) + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_jsa_emerg','Contactos de emergencia')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.8;padding:10px 12px;background:#FEE2E2;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;">' +
              '• ' + esc(t('mp_jsa_emerg_911','')) + '<br>' +
              '• ' + esc(t('mp_jsa_emerg_poison','')) + '<br>' +
              '• ' + esc(t('mp_jsa_emerg_sup','')) + ': _______________________<br>' +
              '• ' + esc(t('mp_jsa_emerg_osha','')) +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_jsa_sign','Firmas')) + '</div>' +
            signRow('mp_jsa_sign_tech') +
            signRow('mp_jsa_sign_sup') +
            signRow('mp_jsa_sign_safety') +
            signRow('mp_jsa_sign_client') +
          '</div>' +
          '<div class="mp-res">' +
            '<div class="mp-res-lbl">◆ ' + esc(es?'Documento listo':'Document ready') + '</div>' +
            '<div class="mp-res-main">JSA<span class="mp-res-unit">OSHA 3071</span></div>' +
            '<div class="mp-res-desc">' + esc(t('mp_jsa_print','')) + '</div>' +
          '</div>' +
          exampleTip('mp_jsaBuilder_case','mp_jsaBuilder_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 2: Fall Protection / Swing Fall ─────────────────────────────
  window.MP_CALCS['fallProt'] = {
    i18n: {
      es: {
        mp_fp_title: 'Protección contra Caídas — Swing Fall',
        mp_fp_sub:   'OSHA 1926.502 · ANSI Z359.11 · Fall clearance',
        mp_fp_anchor:  'Altura del anclaje',
        mp_fp_worker:  'Estatura del trabajador',
        mp_fp_lanyard: 'Longitud de lanyard',
        mp_fp_decel:   'Distancia de desaceleración',
        mp_fp_harness: 'Estiramiento de harness',
        mp_fp_safety:  'Factor de seguridad',
        mp_fp_offset:  'Offset lateral al anclaje',
        mp_fp_rope:    'Longitud de cuerda',
        mp_fp_req:     'Claro requerido',
        mp_fp_pass:    'SEGURO — Claro suficiente',
        mp_fp_fail:    'PELIGRO — Claro insuficiente · impacto al suelo',
        mp_fp_swing:   'Distancia swing fall',
        mp_fp_swing_warn: 'Anclajes a más de 30° del path del trabajador añaden riesgo de swing fall — pueden duplicar la energía de impacto contra estructuras laterales.',
        mp_fp_calc:    'Cálculo',
        mp_fp_calc_d:  'Claro = Lanyard + Decel + Harness + Seguridad + Trabajador',
        mp_fp_ft:      'ft',
        mp_fallProt_case: 'Caso: Técnico sobre techo a 16 ft, anclaje a 18 ft, lanyard de 6 ft con absorbedor.',
        mp_fallProt_tip:  'Tip: Un lanyard de 6 ft requiere mínimo 18.5 ft de claro al suelo. Si el anclaje está bajo el D-ring dorsal, use retractable o un SRD.'
      },
      en: {
        mp_fp_title: 'Fall Protection — Swing Fall',
        mp_fp_sub:   'OSHA 1926.502 · ANSI Z359.11 · Fall clearance',
        mp_fp_anchor:  'Anchor height',
        mp_fp_worker:  'Worker height',
        mp_fp_lanyard: 'Lanyard length',
        mp_fp_decel:   'Deceleration distance',
        mp_fp_harness: 'Harness stretch',
        mp_fp_safety:  'Safety factor',
        mp_fp_offset:  'Lateral anchor offset',
        mp_fp_rope:    'Rope length',
        mp_fp_req:     'Required clearance',
        mp_fp_pass:    'SAFE — Clearance OK',
        mp_fp_fail:    'DANGER — Insufficient clearance · ground impact',
        mp_fp_swing:   'Swing fall distance',
        mp_fp_swing_warn: 'Anchors >30° from worker path add swing-fall hazard — can double impact energy against lateral structures.',
        mp_fp_calc:    'Calculation',
        mp_fp_calc_d:  'Clearance = Lanyard + Decel + Harness + Safety + Worker',
        mp_fp_ft:      'ft',
        mp_fallProt_case: 'Case: Tech on 16-ft roof, anchor at 18 ft, 6-ft lanyard with shock absorber.',
        mp_fallProt_tip:  'Tip: A 6-ft lanyard requires minimum 18.5 ft clearance to ground. If the anchor is below the dorsal D-ring, use a retractable or SRD.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'fallProt');
      var anchor = num(ins.anchor, 18);
      var worker = num(ins.worker, 6);
      var lanyard = num(ins.lanyard, 6);
      var decel = num(ins.decel, 3.5);
      var harness = num(ins.harness, 1);
      var safety = num(ins.safety, 2);
      var offsetDeg = num(ins.offset, 15);
      var rope = num(ins.rope, 6);
      var required = lanyard + decel + harness + safety + worker;
      var pass = anchor >= required;
      // Swing fall: 2 * tan(offset) * rope (simplified horizontal swing distance)
      var rad = (offsetDeg * Math.PI) / 180;
      var swing = 2 * Math.tan(rad) * rope;
      if (!isFinite(swing) || swing < 0) swing = 0;
      var swingRisk = offsetDeg > 30;
      var es = ES();
      function inpRow(lblKey, key, val, unit, step){
        return '<div class="mp-ig">' +
                 '<div class="mp-lbl"><span>' + esc(t(lblKey,'')) + '</span><span class="mp-unit">' + esc(unit) + '</span></div>' +
                 '<input type="number" class="mp-in" data-in="fallProt.' + key + '" value="' + val + '" step="' + (step||0.1) + '" />' +
               '</div>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('fallProt','mp_fp_title','mp_fp_sub','🪢',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(es?'Entradas · Claro de caída':'Inputs · Fall clearance') + '</div>' +
            inpRow('mp_fp_anchor','anchor',anchor,'ft',0.5) +
            inpRow('mp_fp_worker','worker',worker,'ft',0.1) +
            inpRow('mp_fp_lanyard','lanyard',lanyard,'ft',0.5) +
            inpRow('mp_fp_decel','decel',decel,'ft',0.1) +
            inpRow('mp_fp_harness','harness',harness,'ft',0.1) +
            inpRow('mp_fp_safety','safety',safety,'ft',0.5) +
          '</div>' +
          '<div class="mp-res" style="background:' + (pass?'#F0FDF4':'#FEE2E2') + ';border:2px solid ' + (pass?'#16A34A':'#DC2626') + ';">' +
            '<div class="mp-res-lbl" style="color:' + (pass?'#14532D':'#7F1D1D') + ';">◆ ' + esc(t('mp_fp_req','Claro requerido')) + '</div>' +
            '<div class="mp-res-main" style="color:' + (pass?'#14532D':'#7F1D1D') + ';">' + fmt(required,1) + '<span class="mp-res-unit">' + esc(t('mp_fp_ft','ft')) + '</span></div>' +
            '<div class="mp-res-desc" style="color:' + (pass?'#14532D':'#7F1D1D') + ';font-weight:700;">' + esc(t(pass?'mp_fp_pass':'mp_fp_fail','')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_fp_anchor','Anclaje')) + '</div><div class="mp-res-val">' + fmt(anchor,1) + ' ft</div></div>' +
              '<div><div class="mp-res-item">' + esc(es?'Diferencia':'Margin') + '</div><div class="mp-res-val">' + fmt(anchor-required,1) + ' ft</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fp_calc','Cálculo')) + '</div>' +
            '<div style="font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#111;line-height:1.7;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;">' +
              esc(t('mp_fp_calc_d','')) + '<br>' +
              'Lanyard   = ' + fmt(lanyard,1) + ' ft<br>' +
              'Decel     = ' + fmt(decel,1) + ' ft<br>' +
              'Harness   = ' + fmt(harness,1) + ' ft<br>' +
              'Safety    = ' + fmt(safety,1) + ' ft<br>' +
              'Worker    = ' + fmt(worker,1) + ' ft<br>' +
              '────────────────<br>' +
              'Total     = <strong>' + fmt(required,1) + ' ft</strong>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_fp_swing','Swing fall')) + '</div>' +
            inpRow('mp_fp_offset','offset',offsetDeg,'°',1) +
            inpRow('mp_fp_rope','rope',rope,'ft',0.5) +
            '<div style="margin-top:10px;padding:10px 12px;background:' + (swingRisk?'#FEE2E2':'#F0FDF4') + ';border-left:4px solid ' + (swingRisk?'#DC2626':'#16A34A') + ';border-radius:0 8px 8px 0;">' +
              '<div style="font-size:12px;font-weight:700;color:' + (swingRisk?'#7F1D1D':'#14532D') + ';margin-bottom:4px;">' + esc(t('mp_fp_swing','Swing fall')) + '</div>' +
              '<div style="font-size:14px;font-weight:800;color:#111;">' + fmt(swing,1) + ' ft</div>' +
              (swingRisk?'<div style="margin-top:6px;font-size:12px;color:#7F1D1D;line-height:1.5;">⚠ ' + esc(t('mp_fp_swing_warn','')) + '</div>':'') +
            '</div>' +
          '</div>' +
          exampleTip('mp_fallProt_case','mp_fallProt_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 3: Hot Work Permit ──────────────────────────────────────────
  window.MP_CALCS['hotWork'] = {
    i18n: {
      es: {
        mp_hw_title: 'Permiso de Trabajo en Caliente',
        mp_hw_sub:   'NFPA 51B · OSHA 1910.252 · Brazing/Welding',
        mp_hw_c1:  'Vigía de fuego (fire watch) asignado · entrenado · radio',
        mp_hw_c2:  'Extintor ABC mín. 20 lb al alcance (<10 ft)',
        mp_hw_c3:  'Combustibles removidos o cubiertos en radio de 35 ft',
        mp_hw_c4:  'Aberturas en piso/pared cubiertas con manta ignífuga',
        mp_hw_c5:  'Ductos y plenums evaluados (chispas viajan)',
        mp_hw_c6:  'Permiso firmado · autorización supervisor · 8-hr máx.',
        mp_hw_c7:  'LOTO completado en equipos adyacentes energizados',
        mp_hw_c8:  'PPE por tarea (IR-5 goggles, FR, cuero, N95 flux)',
        mp_hw_c9:  'Brazing/Welding: regulador, flashback arrestor, válvulas OK',
        mp_hw_c10: 'Vigilancia continua DURANTE + 30 min DESPUÉS del trabajo',
        mp_hw_c11: 'Sistema de alarma/fuego reactivado tras trabajo',
        mp_hw_c12: 'SDS de gas (acetileno, oxígeno, propano) presente',
        mp_hw_auth: 'AUTORIZADO',
        mp_hw_deny: 'NO AUTORIZADO — Complete todos los ítems',
        mp_hw_refs: 'Referencias NFPA / OSHA',
        mp_hw_refs_d: '• NFPA 51B (2024): Prevención de incendios en operaciones de trabajo en caliente\n• OSHA 29 CFR 1910.252: Requisitos generales soldadura y corte\n• OSHA 1926.352: Prevención de fuego en construcción\n• Todo trabajo caliente fuera de área designada requiere permiso POR ESCRITO',
        mp_hw_progress: 'Ítems completados',
        mp_hotWork_case: 'Caso: Brazear línea de cobre 1-1/8" en plenum de aire de retorno sobre oficina ocupada.',
        mp_hotWork_tip:  'Tip: Más del 50% de incendios de brazing ocurren DESPUÉS que el técnico se va. Los 30 min de vigilancia no son opcionales — NFPA 51B.'
      },
      en: {
        mp_hw_title: 'Hot Work Permit',
        mp_hw_sub:   'NFPA 51B · OSHA 1910.252 · Brazing/Welding',
        mp_hw_c1:  'Fire watch assigned · trained · radio',
        mp_hw_c2:  'ABC extinguisher min. 20 lb within reach (<10 ft)',
        mp_hw_c3:  'Combustibles removed or covered within 35 ft radius',
        mp_hw_c4:  'Floor/wall openings covered with fire blanket',
        mp_hw_c5:  'Ducts and plenums evaluated (sparks travel)',
        mp_hw_c6:  'Permit signed · supervisor authorization · 8-hr max',
        mp_hw_c7:  'LOTO completed on adjacent energized equipment',
        mp_hw_c8:  'PPE per task (IR-5 goggles, FR, leather, N95 flux)',
        mp_hw_c9:  'Brazing/Welding: regulator, flashback arrestor, valves OK',
        mp_hw_c10: 'Continuous fire watch DURING + 30 min AFTER work',
        mp_hw_c11: 'Alarm/fire system re-enabled after work',
        mp_hw_c12: 'Gas SDS (acetylene, oxygen, propane) present',
        mp_hw_auth: 'AUTHORIZED',
        mp_hw_deny: 'NOT AUTHORIZED — Complete all items',
        mp_hw_refs: 'NFPA / OSHA References',
        mp_hw_refs_d: '• NFPA 51B (2024): Fire prevention during hot work operations\n• OSHA 29 CFR 1910.252: General welding and cutting requirements\n• OSHA 1926.352: Fire prevention in construction\n• All hot work outside designated area requires WRITTEN permit',
        mp_hw_progress: 'Items completed',
        mp_hotWork_case: 'Case: Braze 1-1/8" copper in return air plenum above occupied office.',
        mp_hotWork_tip:  'Tip: Over 50% of brazing fires occur AFTER the tech leaves. The 30-min fire watch is not optional — NFPA 51B.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'hotWork');
      var total = 12, done = 0;
      var items = '';
      for (var i=1;i<=total;i++){
        var on = isOn(ins['c'+i]);
        if (on) done++;
        items +=
          '<label style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;margin-bottom:6px;background:#fff;border:1.5px solid ' + (on?'#4ADE80':'#E5E7EB') + ';border-radius:8px;cursor:pointer;' + (on?'background:#F0FDF4;':'') + '">' +
            '<input type="checkbox" class="mp-in" data-in="hotWork.c' + i + '" ' + (on?'checked':'') + ' style="margin-top:2px;width:18px;height:18px;flex-shrink:0;" />' +
            '<span style="font-size:13px;color:#111;line-height:1.45;' + (on?'text-decoration:line-through;color:#6B7280;':'') + '">' + esc(t('mp_hw_c'+i,'')) + '</span>' +
          '</label>';
      }
      var auth = done === total;
      var refs = String(t('mp_hw_refs_d','')).replace(/\n/g,'<br>');
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('hotWork','mp_hw_title','mp_hw_sub','🔥',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Checklist del permiso':'Permit checklist') + '</div>' +
            items +
          '</div>' +
          '<div class="mp-res" style="background:' + (auth?'#F0FDF4':'#FEE2E2') + ';border:2px solid ' + (auth?'#16A34A':'#DC2626') + ';">' +
            '<div class="mp-res-lbl" style="color:' + (auth?'#14532D':'#7F1D1D') + ';">◆ ' + esc(ES()?'Estado del permiso':'Permit status') + '</div>' +
            '<div class="mp-res-main" style="color:' + (auth?'#14532D':'#7F1D1D') + ';">' + (auth?'✓':'✗') + '<span class="mp-res-unit"></span></div>' +
            '<div class="mp-res-desc" style="color:' + (auth?'#14532D':'#7F1D1D') + ';font-weight:700;">' + esc(t(auth?'mp_hw_auth':'mp_hw_deny','')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_hw_progress','Ítems')) + '</div><div class="mp-res-val">' + done + '/' + total + '</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Vigilancia':'Fire watch') + '</div><div class="mp-res-val">30 min</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_hw_refs','Referencias')) + '</div>' +
            '<div style="font-size:12.5px;color:#111;line-height:1.7;padding:10px 12px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;">' + refs + '</div>' +
          '</div>' +
          exampleTip('mp_hotWork_case','mp_hotWork_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 4: SDS Lookup ───────────────────────────────────────────────
  window.MP_CALCS['sdsLookup'] = {
    i18n: {
      es: {
        mp_sds_title: 'SDS — Búsqueda Rápida Químicos HVAC',
        mp_sds_sub:   'OSHA 1910.1200 HazCom · NFPA 704 · DOT',
        mp_sds_chem:  'Químico',
        mp_sds_un:    'UN #',
        mp_sds_cls:   'Clase',
        mp_sds_hz:    'Peligros',
        mp_sds_ppe:   'PPE',
        mp_sds_fa:    'Primeros auxilios',
        mp_sds_spill: 'Derrame',
        mp_sds_pel:   'PEL/TLV',
        mp_sds_note:  'Nota: Toda instalación debe mantener SDS físicas o digitales disponibles para cada químico — OSHA 1910.1200(g). Estas son resúmenes; consulte la SDS completa del fabricante.',
        mp_sdsLookup_case: 'Caso: Derrame de limpiador alcalino KOH sobre concreto del pad de condensador. Tech sin guantes.',
        mp_sdsLookup_tip:  'Tip: KOH (hidróxido potásico) es MÁS peligroso que ácido — necrosis de licuefacción. Enjuague 30 min mínimo y busque ER.'
      },
      en: {
        mp_sds_title: 'SDS — HVAC Chemical Quick Lookup',
        mp_sds_sub:   'OSHA 1910.1200 HazCom · NFPA 704 · DOT',
        mp_sds_chem:  'Chemical',
        mp_sds_un:    'UN #',
        mp_sds_cls:   'Class',
        mp_sds_hz:    'Hazards',
        mp_sds_ppe:   'PPE',
        mp_sds_fa:    'First aid',
        mp_sds_spill: 'Spill',
        mp_sds_pel:   'PEL/TLV',
        mp_sds_note:  'Note: Every facility must keep physical or digital SDS available for each chemical — OSHA 1910.1200(g). These are summaries; consult full manufacturer SDS.',
        mp_sdsLookup_case: 'Case: Alkaline KOH cleaner spill on concrete condenser pad. Tech without gloves.',
        mp_sdsLookup_tip:  'Tip: KOH (potassium hydroxide) is WORSE than acid — liquefaction necrosis. Flush 30 min minimum and ER.'
      }
    },
    render: function(state, helpers){
      var es = ES();
      var data = [
        { name:'R-410A', un:'UN 3163', cls:'2.2 · A1', hz: es?'Alta presión · asfixia · frostbite':'High pressure · asphyxia · frostbite',
          ppe: es?'Gafas Z87 · guantes criogénicos':'Z87 goggles · cryogenic gloves',
          fa:  es?'Aire fresco · agua tibia en frostbite':'Fresh air · warm water for frostbite',
          spill: es?'Ventilar · evacuar':'Ventilate · evacuate', pel:'1000 ppm (R-125)' },
        { name:'R-32', un:'UN 3252', cls:'2.1 · A2L', hz: es?'Ligeramente inflamable · asfixia':'Mildly flammable · asphyxia',
          ppe: es?'Gafas · guantes · NO chispas':'Goggles · gloves · NO sparks',
          fa:  es?'Aire fresco · O₂ si sofocado':'Fresh air · O₂ if suffocated',
          spill: es?'Eliminar fuentes ignición · ventilar':'Remove ignition · ventilate', pel:'1000 ppm TWA' },
        { name:'R-454B', un:'UN 3161', cls:'2.1 · A2L', hz: es?'A2L inflamable · LFL 11.9%':'A2L flammable · LFL 11.9%',
          ppe: es?'Gafas sellada · FR · anti-estático':'Sealed goggles · FR · anti-static',
          fa:  es?'Aire fresco · CPR si no respira':'Fresh air · CPR if not breathing',
          spill: es?'Evacuar 25 ft · no fumar':'Evacuate 25 ft · no smoking', pel:'1000 ppm TWA' },
        { name:'R-22', un:'UN 1018', cls:'2.2 · A1', hz: es?'Asfixia · ODP 0.05 (prohibido venteo)':'Asphyxia · ODP 0.05 (vent prohibited)',
          ppe: es?'Gafas · guantes criogénicos':'Goggles · cryogenic gloves',
          fa:  es?'Aire fresco · recupere siempre':'Fresh air · always recover',
          spill: es?'Recuperar con máquina · multa EPA':'Recover with machine · EPA fine', pel:'1000 ppm TWA' },
        { name:'R-290 (propano)', un:'UN 1978', cls:'2.1 · A3', hz: es?'Altamente inflamable · LFL 2.1%':'Highly flammable · LFL 2.1%',
          ppe: es?'FR completo · gafas · sin electrónica chispa':'Full FR · goggles · no spark electronics',
          fa:  es?'Aire fresco · tratar quemadura':'Fresh air · treat burn',
          spill: es?'Evacuar 100 ft · detector LEL':'Evacuate 100 ft · LEL monitor', pel:'1000 ppm TWA' },
        { name:'R-1234yf', un:'UN 3161', cls:'2.1 · A2L', hz: es?'A2L · HF tóxico si quema':'A2L · toxic HF if burned',
          ppe: es?'Gafas sellada · SCBA en fuego':'Sealed goggles · SCBA in fire',
          fa:  es?'Aire fresco · descontaminar':'Fresh air · decontaminate',
          spill: es?'Ventilar · eliminar ignición':'Ventilate · remove ignition', pel:'500 ppm TWA' },
        { name:'R-134a', un:'UN 3159', cls:'2.2 · A1', hz: es?'Asfixia · GWP 1430':'Asphyxia · GWP 1430',
          ppe: es?'Gafas Z87 · guantes':'Z87 goggles · gloves',
          fa:  es?'Aire fresco · no epinefrina':'Fresh air · no epinephrine',
          spill: es?'Ventilar · recuperar':'Ventilate · recover', pel:'1000 ppm TWA' },
        { name:'Amoníaco NH₃ (R-717)', un:'UN 1005', cls:'2.3 · B2L', hz: es?'Tóxico · corrosivo · inflamable':'Toxic · corrosive · flammable',
          ppe: es?'SCBA · traje Nivel A':'SCBA · Level A suit',
          fa:  es?'Aire · ducha 15 min ojos/piel':'Air · 15-min shower eye/skin',
          spill: es?'Evacuar 300 ft · agua niebla':'Evacuate 300 ft · water fog', pel:'25 ppm TWA · 35 STEL' },
        { name:'CO₂ (R-744)', un:'UN 1013', cls:'2.2 · A1', hz: es?'Asfixia · alta presión (>1000 psi)':'Asphyxia · high pressure (>1000 psi)',
          ppe: es?'Gafas · O₂ monitor · guantes':'Goggles · O₂ monitor · gloves',
          fa:  es?'Aire fresco · O₂ si síntomas':'Fresh air · O₂ if symptoms',
          spill: es?'Ventilar · O₂ monitor':'Ventilate · O₂ monitor', pel:'5000 ppm TWA · 30000 STEL' },
        { name:'Nitrógeno N₂', un:'UN 1066', cls:'2.2', hz: es?'Asfixia simple · alta presión cilindro':'Simple asphyxiant · high cylinder pressure',
          ppe: es?'Regulador con alivio · O₂ monitor':'Relief regulator · O₂ monitor',
          fa:  es?'Aire fresco · O₂':'Fresh air · O₂',
          spill: es?'Ventilar · evacuar':'Ventilate · evacuate', pel:'—' },
        { name:'Acetileno C₂H₂', un:'UN 1001', cls:'2.1', hz: es?'Explosivo · inestable >15 psig':'Explosive · unstable >15 psig',
          ppe: es?'Flashback arrestor · válvula check · gafas IR-5':'Flashback arrestor · check valve · IR-5 goggles',
          fa:  es?'Aire · tratar quemadura':'Air · treat burn',
          spill: es?'Cerrar válvula · evacuar 300 ft':'Close valve · evacuate 300 ft', pel:'2500 ppm (LEL-based)' },
        { name:'Oxígeno O₂ (brazing)', un:'UN 1072', cls:'2.2 · oxidante', hz: es?'Acelera fuego · aceite=explosión':'Accelerates fire · oil=explosion',
          ppe: es?'NUNCA aceite/grasa · gafas · guantes limpios':'NEVER oil/grease · goggles · clean gloves',
          fa:  es?'Aire · tratar quemadura':'Air · treat burn',
          spill: es?'Eliminar combustibles · ventilar':'Remove combustibles · ventilate', pel:'—' },
        { name:'POE oil (éster polyol)', un:'—', cls:'no DOT', hz: es?'Higroscópico · irritante piel/ojos':'Hygroscopic · skin/eye irritant',
          ppe: es?'Nitrilo · gafas':'Nitrile · goggles',
          fa:  es?'Lavar con jabón · agua en ojos 15 min':'Wash with soap · 15-min eye flush',
          spill: es?'Absorbente · trapo':'Absorbent · rag', pel:'5 mg/m³ aerosol' },
        { name:'Aceite mineral (MO)', un:'—', cls:'no DOT', hz: es?'Irritante leve · resbaloso':'Mild irritant · slippery',
          ppe: es?'Nitrilo · gafas':'Nitrile · goggles',
          fa:  es?'Lavar con jabón':'Wash with soap',
          spill: es?'Absorbente · arena/vermiculita':'Absorbent · sand/vermiculite', pel:'5 mg/m³' },
        { name:'Limpiador alcalino (KOH) coil', un:'UN 1813', cls:'8 · corrosivo', hz: es?'Corrosivo · necrosis licuefacción':'Corrosive · liquefaction necrosis',
          ppe: es?'Gafas químicas + face shield · neopreno · botas':'Chemical goggles + face shield · neoprene · boots',
          fa:  es?'Agua 30 min · ER':'30-min water · ER',
          spill: es?'Neutralizar con ácido débil · absorber':'Neutralize with weak acid · absorb', pel:'2 mg/m³' },
        { name:'Limpiador evap (cítrico/alcalino)', un:'—', cls:'8 ligero', hz: es?'Irritante · pH 1-3 o 11-13':'Irritant · pH 1-3 or 11-13',
          ppe: es?'Gafas químicas · nitrilo · delantal':'Chemical goggles · nitrile · apron',
          fa:  es?'Agua 15 min':'15-min water',
          spill: es?'Diluir · trapo':'Dilute · rag', pel:'—' },
        { name:'Ácido clorhídrico HCl', un:'UN 1789', cls:'8', hz: es?'Corrosivo · humo tóxico':'Corrosive · toxic fume',
          ppe: es?'Face shield · butilo · respirador ácido':'Face shield · butyl · acid respirator',
          fa:  es?'Agua 20 min · ER':'20-min water · ER',
          spill: es?'Neutralizar NaHCO₃ · ventilar':'Neutralize NaHCO₃ · ventilate', pel:'5 ppm ceiling' },
        { name:'Dynasolve (drain cleaner)', un:'UN 1993', cls:'3', hz: es?'Inflamable · vapor tóxico':'Flammable · toxic vapor',
          ppe: es?'Gafas · nitrilo · respirador orgánico':'Goggles · nitrile · organic respirator',
          fa:  es?'Aire · lavar piel':'Air · wash skin',
          spill: es?'Absorbente · no al drenaje':'Absorbent · not to drain', pel:'varía por compuesto' },
        { name:'TSP (fosfato trisódico)', un:'—', cls:'8 ligero', hz: es?'Alcalino · irritante':'Alkaline · irritant',
          ppe: es?'Gafas · nitrilo · delantal':'Goggles · nitrile · apron',
          fa:  es?'Agua 15 min':'15-min water',
          spill: es?'Recoger seco · agua':'Dry sweep · water', pel:'—' },
        { name:'Refrigerant dye (UV)', un:'—', cls:'no DOT', hz: es?'Irritante · mancha permanente':'Irritant · permanent stain',
          ppe: es?'Gafas · guantes':'Goggles · gloves',
          fa:  es?'Agua ojos 15 min':'15-min eye water',
          spill: es?'Absorbente':'Absorbent', pel:'—' }
      ];
      var rows = '';
      for (var i=0;i<data.length;i++){
        var d = data[i];
        var bg = i % 2 === 0 ? '#fff' : '#F9FAFB';
        rows +=
          '<tr style="background:' + bg + ';">' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11.5px;color:#111;font-weight:700;vertical-align:top;">' + esc(d.name) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;white-space:nowrap;">' + esc(d.un) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;">' + esc(d.cls) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;background:#FEF2F2;">' + esc(d.hz) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;">' + esc(d.ppe) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;background:#F0FDF4;">' + esc(d.fa) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;">' + esc(d.spill) + '</td>' +
            '<td style="padding:8px 10px;border:1px solid #E5E7EB;font-size:11px;color:#111;vertical-align:top;white-space:nowrap;">' + esc(d.pel) + '</td>' +
          '</tr>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('sdsLookup','mp_sds_title','mp_sds_sub','🧪',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(es?'Tabla SDS rápida (20 químicos HVAC)':'Quick SDS table (20 HVAC chemicals)') + '</div>' +
            '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">' +
            '<table style="width:100%;min-width:900px;border-collapse:collapse;background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">' +
              '<thead><tr style="background:#1B2845;color:#fff;">' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_chem','Químico')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_un','UN #')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_cls','Clase')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_hz','Peligros')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_ppe','PPE')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_fa','Primeros auxilios')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_spill','Derrame')) + '</th>' +
                '<th style="padding:10px;border:1px solid #2d3d5e;font-size:11px;text-align:left;">' + esc(t('mp_sds_pel','PEL/TLV')) + '</th>' +
              '</tr></thead>' +
              '<tbody>' + rows + '</tbody>' +
            '</table>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> OSHA 1910.1200</div>' +
            '<div style="font-size:12.5px;color:#111;line-height:1.6;padding:10px 12px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;">' + esc(t('mp_sds_note','')) + '</div>' +
          '</div>' +
          exampleTip('mp_sdsLookup_case','mp_sdsLookup_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 5: Heat Stress (WBGT) ───────────────────────────────────────
  window.MP_CALCS['heatStress'] = {
    i18n: {
      es: {
        mp_hs_title: 'Estrés por Calor — Índice WBGT',
        mp_hs_sub:   'OSHA TED 01-00-015 · ACGIH TLV · NIOSH 2016-106',
        mp_hs_temp:  'Temperatura bulbo seco',
        mp_hs_rh:    'Humedad relativa',
        mp_hs_work:  'Intensidad de trabajo',
        mp_hs_accl:  'Aclimatizado (≥5 días de exposición)',
        mp_hs_light: 'Liviano (oficina, caminar lento)',
        mp_hs_mod:   'Moderado (caminar firme, brazing)',
        mp_hs_heavy: 'Pesado (cargar equipo, cavar)',
        mp_hs_vh:    'Muy pesado (demolición)',
        mp_hs_wbgt:  'WBGT estimado',
        mp_hs_action:'Nivel de acción',
        mp_hs_normal:'Normal — sin restricciones',
        mp_hs_caut:  'Precaución — aumente hidratación',
        mp_hs_modr:  'Moderado — 15 min descanso/hora · sombra',
        mp_hs_sev:   'Severo — 30 min descanso/hora · pareja obligatoria',
        mp_hs_extr:  'Extremo — DETENER trabajo exterior',
        mp_hs_water: 'Hidratación',
        mp_hs_water_d: '1 taza (8 oz) cada 15–20 min · 1 qt/hr mín.\nElectrolitos si >2 hr consecutivas\nAGUA fría (50–60°F), NO bebidas energéticas ni alcohol',
        mp_hs_signs: 'Señales peligro · PARE trabajo',
        mp_hs_signs_d: '• Confusión, pérdida de coordinación\n• Dejar de sudar (golpe de calor)\n• Piel caliente seca o muy enrojecida\n• Vómito, convulsiones\n• Pulso >140 bpm en reposo\n→ Llame 911, enfriar con agua/hielo',
        mp_heatStress_case: 'Caso: Brazing en ático de Houston · 95°F exterior · ático ~130°F · tech no aclimatizado · semana 1.',
        mp_heatStress_tip:  'Tip: Nuevos trabajadores tienen 35× más riesgo de golpe de calor en primeros 14 días. OSHA requiere aclimatización gradual — 20% día 1, 40% día 2, etc.'
      },
      en: {
        mp_hs_title: 'Heat Stress — WBGT Index',
        mp_hs_sub:   'OSHA TED 01-00-015 · ACGIH TLV · NIOSH 2016-106',
        mp_hs_temp:  'Dry-bulb temperature',
        mp_hs_rh:    'Relative humidity',
        mp_hs_work:  'Work intensity',
        mp_hs_accl:  'Acclimatized (≥5 days exposure)',
        mp_hs_light: 'Light (office, slow walk)',
        mp_hs_mod:   'Moderate (steady walk, brazing)',
        mp_hs_heavy: 'Heavy (lift equipment, dig)',
        mp_hs_vh:    'Very heavy (demolition)',
        mp_hs_wbgt:  'Estimated WBGT',
        mp_hs_action:'Action level',
        mp_hs_normal:'Normal — no restrictions',
        mp_hs_caut:  'Caution — increase hydration',
        mp_hs_modr:  'Moderate — 15 min rest/hr · shade',
        mp_hs_sev:   'Severe — 30 min rest/hr · buddy required',
        mp_hs_extr:  'Extreme — STOP outdoor work',
        mp_hs_water: 'Hydration',
        mp_hs_water_d: '1 cup (8 oz) every 15–20 min · 1 qt/hr minimum\nElectrolytes if >2 consecutive hr\nCOLD water (50–60°F), NO energy drinks or alcohol',
        mp_hs_signs: 'Danger signs · STOP work',
        mp_hs_signs_d: '• Confusion, loss of coordination\n• Stop sweating (heat stroke)\n• Hot dry or very red skin\n• Vomiting, seizures\n• Pulse >140 bpm at rest\n→ Call 911, cool with water/ice',
        mp_heatStress_case: 'Case: Brazing in Houston attic · 95°F outside · attic ~130°F · tech not acclimatized · week 1.',
        mp_heatStress_tip:  'Tip: New workers are 35× more likely to suffer heat stroke in the first 14 days. OSHA requires gradual acclimatization — 20% day 1, 40% day 2, etc.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'heatStress');
      var T = num(ins.temp, 92);
      var RH = num(ins.rh, 65);
      var work = ins.work || 'mod';
      var accl = isOn(ins.accl);
      // Simplified wet-bulb approximation (Stull 2011) — T in °C
      var Tc = (T - 32) * 5/9;
      var Tw = Tc * Math.atan(0.151977 * Math.sqrt(RH + 8.313659))
             + Math.atan(Tc + RH)
             - Math.atan(RH - 1.676331)
             + 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH)
             - 4.686035;
      var TwF = Tw * 9/5 + 32;
      // Indoor (no solar) WBGT ≈ 0.7*Twb + 0.3*Tdb
      var wbgtF = 0.7 * TwF + 0.3 * T;
      // Thresholds shift by work intensity + acclimatization (ACGIH TLV approximate °F)
      var thresholds = {
        light:  { base: 86, low: 83 },
        mod:    { base: 82, low: 80 },
        heavy:  { base: 79, low: 77 },
        vh:     { base: 77, low: 75 }
      };
      var thr = thresholds[work] || thresholds.mod;
      var cutoff = accl ? thr.base : thr.low;
      var action, color, keyL;
      if (wbgtF < 80)       { action='normal'; color='#16A34A'; keyL='mp_hs_normal'; }
      else if (wbgtF < 85)  { action='caut';   color='#84CC16'; keyL='mp_hs_caut';   }
      else if (wbgtF < 88)  { action='modr';   color='#F59E0B'; keyL='mp_hs_modr';   }
      else if (wbgtF < 91)  { action='sev';    color='#EA580C'; keyL='mp_hs_sev';    }
      else                  { action='extr';   color='#DC2626'; keyL='mp_hs_extr';   }
      var waterD = String(t('mp_hs_water_d','')).replace(/\n/g,'<br>');
      var signsD = String(t('mp_hs_signs_d','')).replace(/\n/g,'<br>');
      var workOpts = [
        ['light','mp_hs_light'], ['mod','mp_hs_mod'], ['heavy','mp_hs_heavy'], ['vh','mp_hs_vh']
      ];
      var opts = '';
      for (var i=0;i<workOpts.length;i++){
        opts += '<option value="' + workOpts[i][0] + '" ' + (work===workOpts[i][0]?'selected':'') + '>' + esc(t(workOpts[i][1],'')) + '</option>';
      }
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('heatStress','mp_hs_title','mp_hs_sub','🌡',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_hs_temp','Temperatura')) + '</span><span class="mp-unit">°F</span></div>' +
              '<input type="number" class="mp-in" data-in="heatStress.temp" value="' + T + '" step="1" />' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_hs_rh','Humedad')) + '</span><span class="mp-unit">%</span></div>' +
              '<input type="number" class="mp-in" data-in="heatStress.rh" value="' + RH + '" step="1" />' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_hs_work','Intensidad')) + '</span></div>' +
              '<select class="mp-in" data-in="heatStress.work">' + opts + '</select>' +
            '</div>' +
            '<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;margin-top:6px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;cursor:pointer;">' +
              '<input type="checkbox" class="mp-in" data-in="heatStress.accl" ' + (accl?'checked':'') + ' style="width:18px;height:18px;" />' +
              '<span style="font-size:13px;color:#111;">' + esc(t('mp_hs_accl','')) + '</span>' +
            '</label>' +
          '</div>' +
          '<div class="mp-res" style="border:2px solid ' + color + ';">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_hs_wbgt','WBGT')) + '</div>' +
            '<div class="mp-res-main" style="color:' + color + ' !important;">' + fmt(wbgtF,1) + '<span class="mp-res-unit">°F</span></div>' +
            '<div class="mp-res-desc" style="color:' + color + ' !important;font-weight:700;">' + esc(t(keyL,'')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(ES()?'Bulbo húmedo':'Wet bulb') + '</div><div class="mp-res-val">' + fmt(TwF,1) + ' °F</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Umbral (' + (accl?'aclim':'no-aclim') + ')':'Threshold (' + (accl?'accl':'non-accl') + ')') + '</div><div class="mp-res-val">' + cutoff + ' °F</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_hs_water','Hidratación')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.7;padding:10px 12px;background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 8px 8px 0;">' + waterD + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_hs_signs','Señales peligro')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.7;padding:10px 12px;background:#FEE2E2;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;">' + signsD + '</div>' +
          '</div>' +
          exampleTip('mp_heatStress_case','mp_heatStress_tip')
        );
      }
      return '';
    }
  };

  // ── Tool 6: Cold Stress / Wind Chill ─────────────────────────────────
  window.MP_CALCS['coldStress'] = {
    i18n: {
      es: {
        mp_cs2_title: 'Estrés por Frío — Wind Chill',
        mp_cs2_sub:   'NWS Wind Chill · OSHA Cold Stress · NIOSH',
        mp_cs2_temp:  'Temperatura del aire',
        mp_cs2_wind:  'Velocidad del viento',
        mp_cs2_wc:    'Sensación térmica (Wind Chill)',
        mp_cs2_risk:  'Nivel de riesgo',
        mp_cs2_no:    'Sin riesgo — operación normal',
        mp_cs2_light: 'Leve — ropa térmica recomendada',
        mp_cs2_mod:   'Moderado — congelación en 30 min de piel expuesta',
        mp_cs2_sev:   'Severo — congelación en 10 min',
        mp_cs2_extr:  'Extremo — congelación en <5 min · DETENER',
        mp_cs2_layers: 'Capas recomendadas',
        mp_cs2_limits: 'Límite de exposición exterior',
        mp_cs2_l_base:  'Base: térmica que absorba sudor (merino/poliester), NO algodón',
        mp_cs2_l_mid:   'Media: fleece o lana — aísla aún mojada',
        mp_cs2_l_outer: 'Exterior: shell impermeable + cortavientos',
        mp_cs2_l_acc:   'Accesorios: balaclava · guantes térmicos con liner · botas bota térmica',
        mp_cs2_signs:   'Señales congelación / hipotermia',
        mp_cs2_signs_d: '• Piel blanca cerosa o gris (congelación)\n• Adormecimiento, hormigueo\n• Temblores fuertes (hipotermia leve)\n• Confusión, habla lenta (hipotermia moderada)\n• Parada de temblores (hipotermia severa — 911)',
        mp_coldStress_case: 'Caso: Servicio de RTU en techo de Chicago · 10°F · viento 25 mph · guantes delgados.',
        mp_coldStress_tip:  'Tip: El WC es la "temperatura equivalente" — la piel se congela más rápido con viento. A 10°F + 25 mph el WC es -10°F → congelación en 10 min.'
      },
      en: {
        mp_cs2_title: 'Cold Stress — Wind Chill',
        mp_cs2_sub:   'NWS Wind Chill · OSHA Cold Stress · NIOSH',
        mp_cs2_temp:  'Air temperature',
        mp_cs2_wind:  'Wind speed',
        mp_cs2_wc:    'Wind chill',
        mp_cs2_risk:  'Risk level',
        mp_cs2_no:    'No threat — normal operation',
        mp_cs2_light: 'Light — thermal clothing recommended',
        mp_cs2_mod:   'Moderate — frostbite in 30 min on exposed skin',
        mp_cs2_sev:   'Severe — frostbite in 10 min',
        mp_cs2_extr:  'Extreme — frostbite in <5 min · STOP',
        mp_cs2_layers: 'Recommended layers',
        mp_cs2_limits: 'Outdoor exposure limit',
        mp_cs2_l_base:  'Base: moisture-wicking (merino/polyester), NOT cotton',
        mp_cs2_l_mid:   'Mid: fleece or wool — insulates even when wet',
        mp_cs2_l_outer: 'Outer: waterproof shell + windbreak',
        mp_cs2_l_acc:   'Accessories: balaclava · thermal gloves with liner · insulated boots',
        mp_cs2_signs:   'Frostbite / hypothermia signs',
        mp_cs2_signs_d: '• White waxy or gray skin (frostbite)\n• Numbness, tingling\n• Strong shivering (mild hypothermia)\n• Confusion, slurred speech (moderate)\n• Shivering stops (severe hypothermia — 911)',
        mp_coldStress_case: 'Case: Chicago rooftop RTU service · 10°F · 25 mph wind · thin gloves.',
        mp_coldStress_tip:  'Tip: WC is the "equivalent temperature" — skin freezes faster with wind. At 10°F + 25 mph WC is -10°F → frostbite in 10 min.'
      }
    },
    render: function(state, helpers){
      var ins = getIn(state,'coldStress');
      var T = num(ins.temp, 15);
      var V = num(ins.wind, 15);
      // NWS formula (requires T in °F and V in mph; valid for V ≥ 3 mph, T ≤ 50°F)
      var wc;
      if (V < 3) wc = T;
      else {
        var Vp = Math.pow(V, 0.16);
        wc = 35.74 + 0.6215 * T - 35.75 * Vp + 0.4275 * T * Vp;
      }
      var risk, color, keyR, limit;
      if (wc > 32)         { risk='no';    color='#16A34A'; keyR='mp_cs2_no';    limit=(ES()?'sin límite':'no limit'); }
      else if (wc >= 15)   { risk='light'; color='#84CC16'; keyR='mp_cs2_light'; limit='4 hr'; }
      else if (wc >= -19)  { risk='mod';   color='#F59E0B'; keyR='mp_cs2_mod';   limit='2 hr · '+(ES()?'30 min descanso':'30 min rest'); }
      else if (wc >= -39)  { risk='sev';   color='#EA580C'; keyR='mp_cs2_sev';   limit='40 min · '+(ES()?'calentarse':'warm up'); }
      else                 { risk='extr';  color='#DC2626'; keyR='mp_cs2_extr';  limit=(ES()?'DETENER':'STOP'); }
      var signsD = String(t('mp_cs2_signs_d','')).replace(/\n/g,'<br>');
      var H = h();
      if (H.renderCalcShell) {
        return H.renderCalcShell('coldStress','mp_cs2_title','mp_cs2_sub','❄',
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_cs2_temp','Temperatura')) + '</span><span class="mp-unit">°F</span></div>' +
              '<input type="number" class="mp-in" data-in="coldStress.temp" value="' + T + '" step="1" />' +
            '</div>' +
            '<div class="mp-ig">' +
              '<div class="mp-lbl"><span>' + esc(t('mp_cs2_wind','Viento')) + '</span><span class="mp-unit">mph</span></div>' +
              '<input type="number" class="mp-in" data-in="coldStress.wind" value="' + V + '" step="1" />' +
            '</div>' +
          '</div>' +
          '<div class="mp-res" style="border:2px solid ' + color + ';">' +
            '<div class="mp-res-lbl">◆ ' + esc(t('mp_cs2_wc','Wind chill')) + '</div>' +
            '<div class="mp-res-main" style="color:' + color + ' !important;">' + fmt(wc,0) + '<span class="mp-res-unit">°F</span></div>' +
            '<div class="mp-res-desc" style="color:' + color + ' !important;font-weight:700;">' + esc(t(keyR,'')) + '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(ES()?'Aire':'Air') + '</div><div class="mp-res-val">' + fmt(T,0) + ' °F</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Viento':'Wind') + '</div><div class="mp-res-val">' + fmt(V,0) + ' mph</div></div>' +
            '</div>' +
            '<div class="mp-res-grid">' +
              '<div><div class="mp-res-item">' + esc(t('mp_cs2_limits','Límite')) + '</div><div class="mp-res-val">' + esc(limit) + '</div></div>' +
              '<div><div class="mp-res-item">' + esc(ES()?'Riesgo':'Risk') + '</div><div class="mp-res-val" style="color:' + color + ' !important;">' + (risk==='no'?'OK':risk.toUpperCase()) + '</div></div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_cs2_layers','Capas')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.8;padding:10px 12px;background:#EFF6FF;border-left:4px solid #3B82F6;border-radius:0 8px 8px 0;">' +
              '<strong>1.</strong> ' + esc(t('mp_cs2_l_base','')) + '<br>' +
              '<strong>2.</strong> ' + esc(t('mp_cs2_l_mid','')) + '<br>' +
              '<strong>3.</strong> ' + esc(t('mp_cs2_l_outer','')) + '<br>' +
              '<strong>+</strong> ' + esc(t('mp_cs2_l_acc','')) +
            '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_cs2_signs','Señales')) + '</div>' +
            '<div style="font-size:13px;color:#111;line-height:1.7;padding:10px 12px;background:#FEE2E2;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;">' + signsD + '</div>' +
          '</div>' +
          '<div class="mp-sec">' +
            '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(ES()?'Fórmula NWS':'NWS Formula') + '</div>' +
            '<div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#111;line-height:1.6;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;">' +
              'WC = 35.74 + 0.6215·T − 35.75·V^0.16 + 0.4275·T·V^0.16<br>' +
              '(T °F · V mph · válido V ≥ 3 mph, T ≤ 50°F)' +
            '</div>' +
          '</div>' +
          exampleTip('mp_coldStress_case','mp_coldStress_tip')
        );
      }
      return '';
    }
  };

})();
