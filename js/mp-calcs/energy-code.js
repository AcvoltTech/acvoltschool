// Maestro Pro · Energy Code calculators (Title 24, ASHRAE 62.1/62.2/90.1, IECC, HERS)
// 10 tools: ashrae621, ashrae622, ashrae901Eff, title24Hvac, ductLeakage,
//           refCharge, iecc402, economizer, demandResp, capacityRatio
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

  // Premium dark-navy card palette (shared across all 10 energy calcs)
  // solid colors only, no rgba translucency
  var NAVY_BG   = 'background:linear-gradient(135deg,#1B2845 0%,#2A3A60 100%);border:2px solid #10B981;border-radius:14px;padding:16px;margin:12px 0;color:#FFFFFF;';
  var EMERALD   = '#10B981';
  var EMERALD_D = '#059669';
  var WHITE     = '#FFFFFF';
  var PALE      = '#D1FAE5';
  var DIVIDER   = '#334466';

  function card(inner){
    return '<div style="'+NAVY_BG+'">'+inner+'</div>';
  }
  function resultBig(label, value, unit, sub){
    return '<div style="font-size:12.5px;color:'+PALE+';text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin-bottom:6px;">'+esc(label)+'</div>'+
           '<div style="font-size:34px;color:'+EMERALD+';font-weight:800;line-height:1;">'+esc(value)+' <span style="font-size:16px;color:'+WHITE+';font-weight:600;">'+esc(unit||'')+'</span></div>'+
           (sub?'<div style="font-size:13px;color:'+WHITE+';margin-top:6px;font-weight:500;">'+sub+'</div>':'');
  }
  function kv(label, value){
    return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid '+DIVIDER+';font-size:13px;">'+
             '<span style="color:'+PALE+';font-weight:600;">'+esc(label)+'</span>'+
             '<span style="color:'+EMERALD+';font-weight:700;">'+value+'</span>'+
           '</div>';
  }
  function inputRow(label, unit, binding, val, step, min){
    return '<div style="margin:10px 0;">'+
             '<div style="display:flex;justify-content:space-between;font-size:12.5px;color:'+PALE+';font-weight:600;margin-bottom:5px;"><span>'+esc(label)+'</span><span style="color:'+WHITE+';">'+esc(unit||'')+'</span></div>'+
             '<input type="number" class="mp-in" data-in="'+binding+'" value="'+val+'" step="'+(step==null?'1':step)+'"'+(min==null?'':' min="'+min+'"')+' style="width:100%;background:#0F1A30;border:1.5px solid '+DIVIDER+';color:'+WHITE+';padding:10px;border-radius:8px;font-size:15px;font-weight:600;" />'+
           '</div>';
  }
  function selectRow(label, binding, val, options){
    var o = '';
    for (var i=0;i<options.length;i++){
      var op = options[i];
      o += '<option value="'+esc(op.v)+'"'+(String(val)===String(op.v)?' selected':'')+'>'+esc(op.label)+'</option>';
    }
    return '<div style="margin:10px 0;">'+
             '<div style="font-size:12.5px;color:'+PALE+';font-weight:600;margin-bottom:5px;">'+esc(label)+'</div>'+
             '<select class="mp-in" data-in="'+binding+'" style="width:100%;background:#0F1A30;border:1.5px solid '+DIVIDER+';color:'+WHITE+';padding:10px;border-radius:8px;font-size:14px;font-weight:600;">'+o+'</select>'+
           '</div>';
  }
  function sectionLbl(label){
    return '<div style="font-size:11.5px;color:'+EMERALD+';font-weight:800;letter-spacing:1.2px;text-transform:uppercase;margin:14px 0 6px;">◆ '+esc(label)+'</div>';
  }
  function codeNote(txt){
    return '<div style="background:#0F1A30;border-left:3px solid '+EMERALD+';padding:10px 12px;margin:12px 0;font-size:12.5px;color:'+WHITE+';line-height:1.55;border-radius:6px;">'+txt+'</div>';
  }
  function statusPill(ok, okLabel, badLabel){
    var color = ok ? '#10B981' : '#F59E0B';
    var bg    = ok ? '#064E3B' : '#78350F';
    var label = ok ? okLabel : badLabel;
    return '<div style="display:inline-block;background:'+bg+';color:'+color+';padding:6px 12px;border-radius:999px;font-size:12.5px;font-weight:800;letter-spacing:0.5px;margin-top:8px;border:1.5px solid '+color+';">'+esc(label)+'</div>';
  }

  // ═══════════════════════════════════════════════════════════════
  // 1) ASHRAE 62.1-2022 Outdoor Air — Table 6-1 (partial real data)
  // Rp = CFM/person, Ra = CFM/ft²
  // ═══════════════════════════════════════════════════════════════
  var ASHRAE621_ZONES = {
    office:    { es:'Oficina',              en:'Office space',            Rp:5,  Ra:0.06, Ez:1.0 },
    conf:      { es:'Sala de conferencias', en:'Conference room',         Rp:5,  Ra:0.06, Ez:1.0 },
    classroom: { es:'Salón de clases 9+',   en:'Classroom age 9+',        Rp:10, Ra:0.12, Ez:1.0 },
    classK8:   { es:'Salón K-8',            en:'Classroom K-8',           Rp:10, Ra:0.12, Ez:1.0 },
    lecture:   { es:'Auditorio',            en:'Lecture hall',            Rp:7.5,Ra:0.06, Ez:1.0 },
    retail:    { es:'Comercio ventas',      en:'Retail sales',            Rp:7.5,Ra:0.12, Ez:1.0 },
    restaurant:{ es:'Restaurante/comedor',  en:'Restaurant dining',       Rp:7.5,Ra:0.18, Ez:1.0 },
    gym:       { es:'Gimnasio',             en:'Gym / aerobics room',     Rp:20, Ra:0.06, Ez:1.0 },
    lobby:     { es:'Lobby',                en:'Lobby',                   Rp:5,  Ra:0.06, Ez:1.0 },
    corridor:  { es:'Pasillo',              en:'Corridor',                Rp:0,  Ra:0.06, Ez:1.0 },
    storage:   { es:'Almacén',              en:'Storage room',            Rp:0,  Ra:0.12, Ez:1.0 },
    hospPat:   { es:'Cuarto de paciente',   en:'Hospital patient room',   Rp:25, Ra:0.06, Ez:1.0 },
    bar:       { es:'Bar',                  en:'Bars / cocktail lounge',  Rp:7.5,Ra:0.18, Ez:1.0 }
  };

  window.MP_CALCS['ashrae621'] = {
    i18n: {
      mp_621_title:{es:'ASHRAE 62.1-2022 · Aire Exterior',en:'ASHRAE 62.1-2022 · Outdoor Air'},
      mp_621_sub:  {es:'CFM por persona + por ft² (Tabla 6-1)',en:'CFM per person + per ft² (Table 6-1)'},
      mp_621_zone: {es:'Tipo de zona',en:'Zone type'},
      mp_621_pz:   {es:'Personas (Pz)',en:'People (Pz)'},
      mp_621_az:   {es:'Área piso (Az)',en:'Floor area (Az)'},
      mp_621_ez:   {es:'Eficiencia distribución (Ez)',en:'Distribution effectiveness (Ez)'},
      mp_621_rp:   {es:'Rp (persona)',en:'Rp (per person)'},
      mp_621_ra:   {es:'Ra (área)',en:'Ra (per area)'},
      mp_621_vbz:  {es:'Vbz (breathing zone)',en:'Vbz (breathing zone)'},
      mp_621_voz:  {es:'Voz (outdoor required)',en:'Voz (outdoor required)'},
      mp_621_formula:{es:'Voz = (Rp·Pz + Ra·Az) / Ez',en:'Voz = (Rp·Pz + Ra·Az) / Ez'},
      mp_621_case: {es:'Oficina CA 2026, 30 personas, 2,500 ft², Ez=1.0 → Vbz = 5·30 + 0.06·2500 = 150+150 = 300 CFM. Voz = 300 CFM mínimo por Title 24.',en:'CA 2026 office, 30 people, 2,500 ft², Ez=1.0 → Vbz = 5·30 + 0.06·2500 = 150+150 = 300 CFM. Voz = 300 CFM min per Title 24.'},
      mp_621_tip:  {es:'Tip Chaka: Si el sistema es VAV con ceiling supply caliente (>15°F sobre espacio), Ez baja a 0.8 y Voz sube 25%. Verifica Ez en Tabla 6-2.',en:'Chaka Tip: On a VAV with warm ceiling supply (>15°F over room), Ez drops to 0.8 and Voz rises 25%. Check Ez in Table 6-2.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ashrae621) || {};
      var zone = s.zone || 'office';
      var Z = ASHRAE621_ZONES[zone] || ASHRAE621_ZONES.office;
      var Pz = num(s.Pz, 30);
      var Az = num(s.Az, 2500);
      var Ez = num(s.Ez, 1.0); if (Ez<=0) Ez=1.0;
      var Vbz = Z.Rp * Pz + Z.Ra * Az;
      var Voz = Vbz / Ez;
      var L = lang();
      var zoneOpts = [];
      for (var k in ASHRAE621_ZONES){ zoneOpts.push({ v:k, label: ASHRAE621_ZONES[k][L] || ASHRAE621_ZONES[k].en }); }

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_621_zone','Tipo de zona'), 'ashrae621.zone', zone, zoneOpts) +
        inputRow(t('mp_621_pz','Personas (Pz)'), '#', 'ashrae621.Pz', Pz, '1', '0') +
        inputRow(t('mp_621_az','Área piso (Az)'), 'ft²', 'ashrae621.Az', Az, '10', '0') +
        inputRow(t('mp_621_ez','Eficiencia distribución (Ez)'), '', 'ashrae621.Ez', Ez, '0.05', '0.5') +

        sectionLbl(t('mp_621_voz','Voz requerido')) +
        resultBig(t('mp_621_voz','Voz requerido'), fmt(Voz,0), 'CFM', esc(t('mp_621_formula',''))+' · '+Z.Rp+'·'+Pz+' + '+Z.Ra+'·'+Az+' ÷ '+Ez.toFixed(2)) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_621_rp','Rp'), Z.Rp+' CFM/person') +
          kv(t('mp_621_ra','Ra'), Z.Ra+' CFM/ft²') +
          kv(t('mp_621_vbz','Vbz'), fmt(Vbz,0)+' CFM') +
          kv('ASHRAE 62.1', 'Table 6-1 · 2022 ed.') +
        '</div>' +

        codeNote('<strong>ASHRAE 62.1-2022 §6.2.2.1:</strong> Vbz = Rp·Pz + Ra·Az (breathing zone). Voz = Vbz ÷ Ez. Ez per Table 6-2: ceiling supply cool=1.0, warm >15°F over room=0.8, floor supply cool=1.0, floor warm=0.7, makeup air drawn opposite direction to supply=0.8.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Table 6-1 · Otras ocupaciones frecuentes</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Oficina abierta: Rp 5 · Ra 0.06 · OccDens 5/1000 ft²<br/>'+
            '• Sala conferencia: Rp 5 · Ra 0.06 · OccDens 50/1000 ft²<br/>'+
            '• Salón clases 9+: Rp 10 · Ra 0.12 · OccDens 35/1000 ft²<br/>'+
            '• Restaurante dining: Rp 7.5 · Ra 0.18 · OccDens 70/1000 ft²<br/>'+
            '• Cuarto paciente hosp: Rp 25 · Ra 0.06 · OccDens 10/1000 ft²<br/>'+
            '• Gimnasio aerobics: Rp 20 · Ra 0.06 · OccDens 40/1000 ft²<br/>'+
            '• Sala espera lobby: Rp 5 · Ra 0.06 · OccDens 30/1000 ft²'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Ez zone air distribution effectiveness (Table 6-2)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Ceiling supply cool air (any): Ez = 1.0<br/>'+
            '• Ceiling supply warm air &lt;15°F over room, ceiling return: Ez = 1.0<br/>'+
            '• Ceiling supply warm air ≥15°F over room: Ez = 0.8<br/>'+
            '• Floor supply cool air, ceiling return: Ez = 1.0<br/>'+
            '• Floor supply warm air, floor return: Ez = 1.0<br/>'+
            '• Floor supply warm air, ceiling return: Ez = 0.7<br/>'+
            '• Makeup air opposite direction: Ez = 0.8<br/>'+
            '• Displacement ventilation verified: Ez = 1.2'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">DCV · Demand-Controlled Ventilation trigger</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Required per T24 §120.1(c) if OccDens &gt;40/1000 ft² AND cap ≥10k CFM<br/>'+
            '• CO2 sensor resets OA damper 800-1200 ppm typical band<br/>'+
            '• Sensor accuracy ±75 ppm, calibrated annually (NDIR photonics)<br/>'+
            '• Minimum OA = Ra·Az (area term) always on regardless of occupancy<br/>'+
            '• People term Rp·Pz scales with measured CO2<br/>'+
            '• Saves 15-30% reheat energy in high-turnover spaces'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_621_case','mp_621_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 2) ASHRAE 62.2-2022 Residential Ventilation
  // Equation 4.1a: Qfan = 0.03·Afloor + 7.5·(Nbr+1)  (raw)
  // Effective: Qfan_eff = Qfan - Qinf (ASHRAE 62.2 2022 infiltration credit)
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['ashrae622'] = {
    i18n: {
      mp_622_title:{es:'ASHRAE 62.2-2022 · Residencial',en:'ASHRAE 62.2-2022 · Residential'},
      mp_622_sub:  {es:'Ventilación whole-house MVHR',en:'Whole-house MVHR ventilation'},
      mp_622_af:   {es:'Área piso',en:'Floor area'},
      mp_622_nbr:  {es:'Dormitorios',en:'Bedrooms'},
      mp_622_nlA:  {es:'NL (infiltración)',en:'NL (infiltration)'},
      mp_622_wsf:  {es:'WSF (factor sitio)',en:'WSF (weather/shield factor)'},
      mp_622_qtot: {es:'Qtotal requerido',en:'Qtotal required'},
      mp_622_qinf: {es:'Qinf (crédito infiltración)',en:'Qinf (infiltration credit)'},
      mp_622_qfan: {es:'Qfan (ventilador mecánico)',en:'Qfan (mechanical)'},
      mp_622_eq:   {es:'Qtot = 0.03·A + 7.5·(Nbr+1)',en:'Qtot = 0.03·A + 7.5·(Nbr+1)'},
      mp_622_case: {es:'Casa CA 2026: 2,000 ft², 3 dormitorios → Qtot = 0.03·2000 + 7.5·4 = 60+30 = 90 CFM. Con NL=0.4 blower door, Qinf≈20 CFM, Qfan=70 CFM continuo ERV.',en:'CA 2026 home: 2,000 ft², 3 bdrm → Qtot = 0.03·2000 + 7.5·4 = 60+30 = 90 CFM. With NL=0.4 blower door, Qinf≈20 CFM, Qfan=70 CFM continuous ERV.'},
      mp_622_tip:  {es:'Tip Chaka: Title 24 2025+ exige ERV/HRV con ≥60% recuperación sensible en CZ1–16. No instales baño-fan solo — el HERS rater te reprueba.',en:'Chaka Tip: Title 24 2025+ requires ERV/HRV with ≥60% sensible recovery in CZ1–16. A bath fan alone fails HERS verification.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ashrae622) || {};
      var Af = num(s.Af, 2000);
      var Nbr = num(s.Nbr, 3);
      var NL = num(s.NL, 0.4);
      var WSF = num(s.WSF, 0.7);
      var Qtot = 0.03 * Af + 7.5 * (Nbr + 1);
      // 62.2-2022 infiltration credit: Qinf = (NL · WSF · Afloor) / 7.3
      var Qinf = (NL * WSF * Af) / 7.3;
      var Qfan = Qtot - (2/3) * Qinf; // 62.2-2022 applies 2/3 credit ratio
      if (Qfan < 0) Qfan = 0;

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        inputRow(t('mp_622_af','Área piso'), 'ft²', 'ashrae622.Af', Af, '50', '400') +
        inputRow(t('mp_622_nbr','Dormitorios'), '#', 'ashrae622.Nbr', Nbr, '1', '0') +
        inputRow(t('mp_622_nlA','NL (infiltración)'), '', 'ashrae622.NL', NL, '0.05', '0') +
        inputRow(t('mp_622_wsf','WSF (factor sitio)'), '', 'ashrae622.WSF', WSF, '0.05', '0.3') +

        sectionLbl(t('mp_622_qfan','Qfan mecánico')) +
        resultBig(t('mp_622_qfan','Qfan (mecánico)'), fmt(Qfan,0), 'CFM', esc(t('mp_622_eq','')) + ' · ERV/HRV continuo') +

        '<div style="margin-top:12px;">'+
          kv(t('mp_622_qtot','Qtot requerido'), fmt(Qtot,0)+' CFM') +
          kv(t('mp_622_qinf','Qinf crédito'), fmt(Qinf,0)+' CFM') +
          kv('ASHRAE 62.2', 'Eq. 4.1a · 2022 ed.') +
          kv('Title 24', '§150.0(o) — ERV ≥60% SRE') +
        '</div>' +

        codeNote('<strong>ASHRAE 62.2-2022 §4.1:</strong> Qtot = 0.03·Afloor + 7.5·(Nbr+1). NL = Normalized Leakage from blower door (ACH50·H^0.3 / 1000). WSF from Table 4.2 (climate/shield). 2025 Title 24 requires heat-recovery (ERV/HRV) balanced ventilation in all residential new construction and major alterations. Local exhaust per §5: bathrooms ≥50 CFM on-demand or 20 CFM continuous; kitchens ≥100 CFM on-demand or 25 CFM continuous.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Quick sizing table</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• 1,000 ft² 2BR → Qtot 30+22.5 = 52.5 CFM<br/>'+
            '• 1,500 ft² 3BR → Qtot 45+30 = 75 CFM<br/>'+
            '• 2,000 ft² 3BR → Qtot 60+30 = 90 CFM<br/>'+
            '• 2,500 ft² 4BR → Qtot 75+37.5 = 112.5 CFM<br/>'+
            '• 3,000 ft² 4BR → Qtot 90+37.5 = 127.5 CFM<br/>'+
            '• 4,000 ft² 5BR → Qtot 120+45 = 165 CFM<br/>'+
            '• Panasonic WhisperGreen Select ajustable 50-130 CFM cumple todo residencial'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">WSF Table 4.2 · climate / shielding factors</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• CA CZ1-2 coastal, shielded: WSF 0.55<br/>'+
            '• CA CZ3-5 mild coast, moderate: WSF 0.65<br/>'+
            '• CA CZ6-9 LA basin, normal: WSF 0.70<br/>'+
            '• CA CZ10-13 inland valley, exposed: WSF 0.75<br/>'+
            '• CA CZ14-15 desert, very exposed: WSF 0.85<br/>'+
            '• CA CZ16 alpine, very exposed: WSF 0.90<br/>'+
            '• Multifamily units above ground floor → WSF × 1.1<br/>'+
            '• Manufactured home on piers → WSF × 1.2'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Balanced vs exhaust-only decision</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Exhaust-only — cheapest, bath fan + continuous timer, fails T24 2022<br/>'+
            '• Supply-only — positive pressure, mold risk in humid CZs<br/>'+
            '• Balanced ERV — heat + latent recovery, 72-85% SRE typical<br/>'+
            '• Balanced HRV — heat only, cold-dry climates CZ16<br/>'+
            '• T24 2022+ requires balanced heat-recovery in ALL CZs<br/>'+
            '• Panasonic Intelli-Balance 100: $650 · Zehnder CA-200: $2,400<br/>'+
            '• Duct ERV central with HVAC or dedicated stand-alone system'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_622_case','mp_622_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 3) ASHRAE 90.1-2022 Table 6.8.1 Minimum Efficiency (real data)
  // ═══════════════════════════════════════════════════════════════
  var ASHRAE901_EFF = {
    ac_split_lt65:  { es:'A/C split <65 kBtu/h',      en:'AC split <65 kBtu/h',       m:'SEER2', v:14.3,  alt:{ EER2:11.7 } },
    ac_split_6590:  { es:'A/C single 65–135 kBtu/h',  en:'AC single 65–135 kBtu/h',   m:'IEER',  v:14.8,  alt:{ EER2:11.2 } },
    ac_split_135240:{ es:'A/C 135–240 kBtu/h',        en:'AC 135–240 kBtu/h',         m:'IEER',  v:14.2,  alt:{ EER2:11.0 } },
    ac_gt240:       { es:'A/C ≥240 kBtu/h',           en:'AC ≥240 kBtu/h',            m:'IEER',  v:13.2,  alt:{ EER2:10.0 } },
    hp_split_lt65:  { es:'Heat pump <65 kBtu/h',      en:'Heat pump <65 kBtu/h',      m:'SEER2', v:14.3,  alt:{ HSPF2:7.5 } },
    hp_split_6590:  { es:'Heat pump 65–135 kBtu/h',   en:'Heat pump 65–135 kBtu/h',   m:'IEER',  v:14.1,  alt:{ COPh:3.3 } },
    furnace_res:    { es:'Gas furnace residencial',   en:'Gas furnace residential',   m:'AFUE',  v:95.0,  alt:{ note:'CA 2026' } },
    furnace_comm:   { es:'Gas furnace comercial <225',en:'Gas furnace commercial <225',m:'Et',   v:81.0,  alt:{ note:'thermal efficiency' } },
    boiler_hw:      { es:'Caldera agua caliente <300',en:'Boiler hot-water <300',     m:'Et',    v:84.0,  alt:{ note:'%' } },
    wh_gas_tank:    { es:'Calentador gas tanque',     en:'Gas storage water heater',  m:'UEF',   v:0.64,  alt:{ note:'≤55 gal' } },
    wh_hp_res:      { es:'HPWH residencial',          en:'Heat pump water heater',    m:'UEF',   v:3.3,   alt:{ note:'≥55 gal' } },
    chiller_air:    { es:'Chiller enfriado aire <150',en:'Air-cooled chiller <150',   m:'IPLV',  v:14.6,  alt:{ EER:10.1 } }
  };

  window.MP_CALCS['ashrae901Eff'] = {
    i18n: {
      mp_901_title:{es:'ASHRAE 90.1-2022 · Eficiencia mínima',en:'ASHRAE 90.1-2022 · Min Efficiency'},
      mp_901_sub:  {es:'Tabla 6.8.1 — AFUE/SEER2/IEER/COP',en:'Table 6.8.1 — AFUE/SEER2/IEER/COP'},
      mp_901_eq:   {es:'Tipo de equipo',en:'Equipment type'},
      mp_901_actual:{es:'Eficiencia medida',en:'Measured efficiency'},
      mp_901_req:  {es:'Mínimo requerido',en:'Required minimum'},
      mp_901_metric:{es:'Métrica',en:'Metric'},
      mp_901_status:{es:'Cumplimiento',en:'Compliance'},
      mp_901_ok:   {es:'CUMPLE 90.1-2022',en:'COMPLIES 90.1-2022'},
      mp_901_bad:  {es:'NO CUMPLE — upgrade required',en:'FAILS — upgrade required'},
      mp_901_case: {es:'RTU 10-ton (120 kBtu/h) en bodega CA 2026 · instalador propone 12.5 IEER. Mínimo 90.1-2022 = 14.8 IEER → no cumple. Subir a 15.0 IEER para T24.',en:'10-ton RTU (120 kBtu/h) CA 2026 warehouse · contractor specs 12.5 IEER. 90.1-2022 min = 14.8 IEER → fails. Spec 15.0 IEER min per T24.'},
      mp_901_tip:  {es:'Tip Chaka: Title 24 2025 adopta 90.1-2022 pero con modificaciones CA. Si la placa muestra SEER viejo (no SEER2), multiplica por 0.95 para estimar SEER2.',en:'Chaka Tip: Title 24 2025 adopts 90.1-2022 with CA amendments. If nameplate shows old SEER (not SEER2), multiply by 0.95 to estimate SEER2.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ashrae901Eff) || {};
      var eq = s.eq || 'ac_split_lt65';
      var E = ASHRAE901_EFF[eq] || ASHRAE901_EFF.ac_split_lt65;
      var actual = num(s.actual, E.v);
      var ok = actual >= E.v;
      var L = lang();
      var opts = [];
      for (var k in ASHRAE901_EFF){ opts.push({ v:k, label: ASHRAE901_EFF[k][L] || ASHRAE901_EFF[k].en }); }

      // build alt-metric display
      var altStr = '';
      for (var ak in E.alt){ if (ak!=='note') altStr += ak+'≥'+E.alt[ak]+' · '; }
      altStr += (E.alt.note || '');

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_901_eq','Tipo de equipo'), 'ashrae901Eff.eq', eq, opts) +
        inputRow(t('mp_901_actual','Eficiencia medida')+' ('+E.m+')', E.m, 'ashrae901Eff.actual', actual, '0.1', '0') +

        sectionLbl(t('mp_901_status','Cumplimiento')) +
        resultBig(t('mp_901_req','Mínimo requerido'), E.v.toFixed(1), E.m, statusPill(ok, t('mp_901_ok','CUMPLE'), t('mp_901_bad','NO CUMPLE'))) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_901_metric','Métrica primaria'), E.m) +
          kv(t('mp_901_actual','Medida'), actual.toFixed(1)+' '+E.m) +
          kv(t('mp_901_req','Mínimo'), E.v.toFixed(1)+' '+E.m) +
          kv('ASHRAE 90.1', 'Table 6.8.1 · 2022') +
          kv('Alternativa', altStr) +
        '</div>' +

        codeNote('<strong>ASHRAE 90.1-2022 Table 6.8.1 / 6.8.1A:</strong> Mandatory minimums adopted by IECC 2021 and CA Title 24 2025. California Title 24 Part 6 (2022 code cycle) exceeds 90.1 in several categories. Federal DOE tests use SEER2/EER2/HSPF2 since Jan 2023. 90.1-2022 adds §6.4.5 fault detection and §6.4.3.9 ventilation system energy recovery (ERV).') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Federal minimums effective Jan 1, 2023 (SEER2/HSPF2)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Split AC <65 kBtu/h: North SEER2 13.4 · South SEER2 14.3 EER2 11.7<br/>'+
            '• Packaged AC <65 kBtu/h: SEER2 13.4 EER2 10.6<br/>'+
            '• Split HP <65 kBtu/h: SEER2 14.3 HSPF2 7.5<br/>'+
            '• Packaged HP <65 kBtu/h: SEER2 13.4 HSPF2 6.7<br/>'+
            '• AC single-pkg 65-135 kBtu/h: EER 11.2 IEER 14.8<br/>'+
            '• HP single-pkg 65-135 kBtu/h: EER 11.0 IEER 14.1 COPh 3.3<br/>'+
            '• CA-specific: all residential HP ≥SEER2 15.0 HSPF2 8.1 (CEE Tier 2)'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">SEER → SEER2 conversion (approx)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• SEER2 ≈ SEER × 0.95 (for single-package)<br/>'+
            '• SEER2 ≈ SEER × 0.96 (for split systems)<br/>'+
            '• EER2 ≈ EER × 0.96<br/>'+
            '• HSPF2 ≈ HSPF × 0.85<br/>'+
            '• Example: SEER 16 → SEER2 ≈ 15.2 · HSPF 9.0 → HSPF2 ≈ 7.65<br/>'+
            '• New test method M1 uses higher external static (0.5 vs 0.1 in WC) — realistic duct loads'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_901_case','mp_901_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 4) Title 24 Part 6 2022 HVAC Prescriptive (CA) — real requirements
  // ═══════════════════════════════════════════════════════════════
  var T24_CZ = {
    '1':  { es:'CZ1 Costa norte (Crescent City)',          en:'CZ1 North coast',           HDD:4400, CDD:100,  ductR:8  },
    '2':  { es:'CZ2 Napa/Santa Rosa',                       en:'CZ2 Napa/Santa Rosa',       HDD:3000, CDD:400,  ductR:8  },
    '3':  { es:'CZ3 Bay Area costa',                        en:'CZ3 Bay Area coast',        HDD:2600, CDD:200,  ductR:6  },
    '4':  { es:'CZ4 San Jose',                              en:'CZ4 San Jose',              HDD:2500, CDD:600,  ductR:6  },
    '5':  { es:'CZ5 Santa Maria',                           en:'CZ5 Santa Maria',           HDD:2500, CDD:150,  ductR:6  },
    '6':  { es:'CZ6 LA costa',                              en:'CZ6 LA coast',              HDD:1500, CDD:600,  ductR:6  },
    '7':  { es:'CZ7 San Diego',                             en:'CZ7 San Diego',             HDD:1200, CDD:650,  ductR:6  },
    '8':  { es:'CZ8 El Monte / LA inland',                  en:'CZ8 LA inland',             HDD:1700, CDD:1300, ductR:6  },
    '9':  { es:'CZ9 Pasadena / Burbank',                    en:'CZ9 Pasadena',              HDD:1900, CDD:1500, ductR:6  },
    '10': { es:'CZ10 Riverside',                            en:'CZ10 Riverside',            HDD:2100, CDD:1900, ductR:8  },
    '11': { es:'CZ11 Red Bluff',                            en:'CZ11 Red Bluff',            HDD:3200, CDD:1800, ductR:8  },
    '12': { es:'CZ12 Sacramento',                           en:'CZ12 Sacramento',           HDD:2700, CDD:1600, ductR:8  },
    '13': { es:'CZ13 Fresno',                               en:'CZ13 Fresno',               HDD:2600, CDD:2100, ductR:8  },
    '14': { es:'CZ14 Palmdale / Mojave',                    en:'CZ14 Mojave',               HDD:3500, CDD:2400, ductR:8  },
    '15': { es:'CZ15 Palm Springs / Indio',                 en:'CZ15 Palm Springs',         HDD:1200, CDD:4300, ductR:8  },
    '16': { es:'CZ16 Blue Canyon / Truckee',                en:'CZ16 Blue Canyon',          HDD:5900, CDD:300,  ductR:8  }
  };

  window.MP_CALCS['title24Hvac'] = {
    i18n: {
      mp_t24_title:{es:'Title 24 Part 6 · 2022 Prescriptivo',en:'Title 24 Part 6 · 2022 Prescriptive'},
      mp_t24_sub:  {es:'CA HVAC dimensionado + ducto',en:'CA HVAC sizing + duct'},
      mp_t24_cz:   {es:'Zona climática CA',en:'CA climate zone'},
      mp_t24_load: {es:'Carga Manual J (diseño)',en:'Manual J design load'},
      mp_t24_installed:{es:'Capacidad instalada',en:'Installed capacity'},
      mp_t24_ratio:{es:'Capacity ratio',en:'Capacity ratio'},
      mp_t24_ductR:{es:'R-value ducto requerido',en:'Required duct R-value'},
      mp_t24_status:{es:'Cumplimiento 150.1',en:'150.1 compliance'},
      mp_t24_hers: {es:'HERS verifications required',en:'HERS verifications required'},
      mp_t24_case: {es:'Casa Fresno CZ13, 2,200 ft², Manual J = 28,000 BTU/h. Instalado 3-ton (36k) → ratio 1.29 → NO cumple (límite 1.15 con AC, 1.25 con HP). Baja a 2.5-ton.',en:'Fresno CZ13 home, 2,200 ft², Manual J = 28,000 BTU/h. Installed 3-ton (36k) → ratio 1.29 → FAILS (limit 1.15 AC, 1.25 HP). Downsize to 2.5-ton.'},
      mp_t24_tip:  {es:'Tip Chaka: Si el sistema queda 1.05–1.15 ratio, usa variable-capacity (inverter) para evitar short-cycling y pasar HERS CF2R.',en:'Chaka Tip: If ratio lands 1.05–1.15, spec variable-capacity inverter to avoid short-cycling and pass HERS CF2R.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.title24Hvac) || {};
      var cz = s.cz || '13';
      var Z = T24_CZ[cz] || T24_CZ['13'];
      var load = num(s.load, 28000);
      var installed = num(s.installed, 36000);
      var sysType = s.sysType || 'ac';
      var limit = (sysType==='hp') ? 1.25 : 1.15;
      var ratio = installed / (load || 1);
      var ok = ratio >= 0.90 && ratio <= limit;
      var L = lang();
      var czOpts = [];
      for (var k in T24_CZ){ czOpts.push({ v:k, label: T24_CZ[k][L] || T24_CZ[k].en }); }

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_t24_cz','Zona climática'), 'title24Hvac.cz', cz, czOpts) +
        selectRow(t('mp_t24_status','Sistema'), 'title24Hvac.sysType', sysType, [
          { v:'ac', label:(L==='es'?'A/C (límite 1.15×)':'AC (limit 1.15×)') },
          { v:'hp', label:(L==='es'?'Heat pump (1.25×)':'Heat pump (1.25×)') }
        ]) +
        inputRow(t('mp_t24_load','Carga Manual J'), 'BTU/h', 'title24Hvac.load', load, '500', '5000') +
        inputRow(t('mp_t24_installed','Capacidad instalada'), 'BTU/h', 'title24Hvac.installed', installed, '500', '5000') +

        sectionLbl(t('mp_t24_ratio','Capacity ratio')) +
        resultBig(t('mp_t24_ratio','Capacity ratio'), ratio.toFixed(2)+'×', '',
                  statusPill(ok, (L==='es'?'CUMPLE 150.1(c)':'PASSES 150.1(c)'), (L==='es'?'NO CUMPLE — reduce':'FAILS — downsize'))) +

        '<div style="margin-top:12px;">'+
          kv('CZ '+cz+' HDD65', Z.HDD) +
          kv('CZ '+cz+' CDD65', Z.CDD) +
          kv(t('mp_t24_ductR','R-ducto en ático'), 'R-'+Z.ductR+' min (§150.0(m))') +
          kv(t('mp_t24_status','Límite'), limit.toFixed(2)+'×') +
          kv(t('mp_t24_hers','HERS'), 'CF3R: duct leak + refrig charge') +
        '</div>' +

        codeNote('<strong>Title 24 2022 §150.1(c)2A:</strong> Installed cooling ≤1.15× Manual J (AC) or 1.25× (HP). §150.0(m): Duct R-6 (CZ3-9) or R-8 (CZ1-2, 10-16) in unconditioned space. §RA3.1: Manual J + D + S mandatory. HERS CF3R verifies duct leakage ≤6% and refrigerant charge at startup. §150.1(c)8: Heat pumps mandatory for new construction in most CZs starting 2023.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">T24 2022 prescriptive by CZ (residential)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• CZ1 costa norte — HP preferred, ceiling R-38, wall R-21+R-5ci<br/>'+
            '• CZ2-5 mild — ceiling R-30, wall R-15+R-5ci, window U-0.30 SHGC-0.25<br/>'+
            '• CZ6-8 LA basin — ceiling R-30, wall R-13+R-5ci, window U-0.30<br/>'+
            '• CZ9-10 inland valley — ceiling R-38, wall R-21+R-5ci, AC SEER2≥15.0<br/>'+
            '• CZ11-13 Central Valley — ceiling R-38, wall R-21+R-5ci, HP SEER2≥15.0 HSPF2≥7.8<br/>'+
            '• CZ14-15 desert — ceiling R-38, wall R-21+R-5ci, AC SEER2≥15.2 EER2≥12.2<br/>'+
            '• CZ16 alpine — ceiling R-49, wall R-21+R-5ci, HP sized for 99% heating design'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">HERS CF3R verifications · what your rater checks</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• MCH-01-H: equipment efficiency nameplate match<br/>'+
            '• MCH-04-H: furnace/boiler combustion safety<br/>'+
            '• MCH-20-H: duct leakage 25 Pa blower test<br/>'+
            '• MCH-22-H: forced-air register airflow ≥350 CFM/ton<br/>'+
            '• MCH-23-H: fan watt draw ≤0.58 W/CFM<br/>'+
            '• MCH-24-H: IAQ whole-house ventilation per 62.2<br/>'+
            '• MCH-25-H: refrigerant charge standard / weigh-in<br/>'+
            '• MCH-27-H: thermostat schedule programming'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_t24_case','mp_t24_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 5) Duct Leakage HERS — T24 §150.0(m)11 · 6% total, 4% to outdoors
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['ductLeakage'] = {
    i18n: {
      mp_dl_title:{es:'Duct Leakage HERS',en:'HERS Duct Leakage'},
      mp_dl_sub:  {es:'Title 24 §150.0(m)11 + CF3R',en:'Title 24 §150.0(m)11 + CF3R'},
      mp_dl_nom:  {es:'CFM nominal sistema (400×ton)',en:'System nominal CFM (400×ton)'},
      mp_dl_leak25:{es:'Fuga medida @25 Pa',en:'Measured leakage @25 Pa'},
      mp_dl_scope:{es:'Alcance del test',en:'Test scope'},
      mp_dl_pctTot:{es:'% del flujo total',en:'% of total airflow'},
      mp_dl_limit:{es:'Límite T24',en:'T24 limit'},
      mp_dl_status:{es:'HERS pasa',en:'HERS passes'},
      mp_dl_case: {es:'Furnace 3-ton, CFM nominal 1,200. Duct blaster @25 Pa = 65 CFM25 total → 5.4% → PASS (<6%). Sistema nuevo requiere <5% si es alteration.',en:'3-ton furnace, 1,200 CFM nominal. Duct blaster @25 Pa = 65 CFM25 total → 5.4% → PASS (<6%). New systems require <5% for alterations.'},
      mp_dl_tip:  {es:'Tip Chaka: Antes del blower test, sella boot-to-drywall con mastic DP1010, no tape foil. Tape pierde en 18 meses en ático caliente CA.',en:'Chaka Tip: Before the blower test, seal boot-to-drywall with DP1010 mastic — not foil tape. Tape fails in 18 months in a CA hot attic.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.ductLeakage) || {};
      var nom = num(s.nom, 1200);
      var leak25 = num(s.leak25, 65);
      var scope = s.scope || 'total';
      var pct = (leak25 / (nom || 1)) * 100;
      var limit = scope === 'outdoors' ? 4.0 : 6.0;
      var ok = pct <= limit;
      var L = lang();

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        inputRow(t('mp_dl_nom','CFM nominal'), 'CFM', 'ductLeakage.nom', nom, '50', '200') +
        inputRow(t('mp_dl_leak25','Fuga medida @25 Pa'), 'CFM25', 'ductLeakage.leak25', leak25, '1', '0') +
        selectRow(t('mp_dl_scope','Alcance'), 'ductLeakage.scope', scope, [
          { v:'total',    label:(L==='es'?'Fuga total (límite 6%)':'Total leakage (6% limit)') },
          { v:'outdoors', label:(L==='es'?'Solo a exterior (4%)':'To outdoors only (4%)') }
        ]) +

        sectionLbl(t('mp_dl_pctTot','% del flujo')) +
        resultBig(t('mp_dl_pctTot','% del flujo total'), pct.toFixed(1)+'%', '',
                  statusPill(ok, t('mp_dl_status','HERS PASS'), 'HERS FAIL · seal and retest')) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_dl_leak25','CFM25'), fmt(leak25,0)+' CFM') +
          kv(t('mp_dl_nom','Nominal'), fmt(nom,0)+' CFM') +
          kv(t('mp_dl_limit','Límite'), limit.toFixed(0)+'% ('+scope+')') +
          kv('Title 24', '§150.0(m)11 + §150.2(b)') +
          kv('HERS form', 'CF3R-MCH-20-H') +
        '</div>' +

        codeNote('<strong>Title 24 §150.0(m)11:</strong> New systems ≤6% total CFM25 OR ≤4% to outdoors. Alterations with >40 ft replaced ductwork: ≤10% or smoke-test all joints. §RA3.1.4.3 details duct blaster protocol. HERS rater signs CF3R before final inspection. §150.0(m)10 mastic sealing mandatory on all joints; tape alone fails.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Duct blaster test procedure (RA3.1.4.3)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '1. Seal all supply + return registers with masking plastic<br/>'+
            '2. Mount duct blaster fan at air handler cabinet or largest return<br/>'+
            '3. Pressurize system to +25 Pa relative to conditioned space<br/>'+
            '4. Record fan flow in CFM25 — this IS total leakage<br/>'+
            '5. For "to outdoors" test: pressurize house to same 25 Pa simultaneously<br/>'+
            '6. Calibration within 12 months, accuracy ±3% per Minneapolis Duct Blaster 3<br/>'+
            '7. Weather: outdoor temp 50-100°F, wind &lt;15 mph, no precip'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Sealing checklist · find leaks fast</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Plenum-to-AH connection — #1 offender<br/>'+
            '• Boot-to-drywall at every register<br/>'+
            '• Return filter grille frame to framing cavity<br/>'+
            '• Flex duct inner liner pinch at collar<br/>'+
            '• Sheet metal seams on trunk line<br/>'+
            '• Mastic type: DP1010 water-based, 1/16" thick, reinforced with mesh on gaps >1/4"<br/>'+
            '• UL 181A-M tape OK for flex-to-collar only, never alone'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Alteration test thresholds (T24 §150.2(b))</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Condenser-only replacement + no duct work: no leakage test required<br/>'+
            '• Air handler + any duct changes: ≤15% CFM25 OR smoke-seal all accessible<br/>'+
            '• ≥40 linear ft ducts replaced: ≤10% CFM25 total<br/>'+
            '• Complete duct replacement: ≤6% total or ≤4% to outdoors (as new)<br/>'+
            '• Any change of equipment type (AC→HP): full HERS CF3R re-verification<br/>'+
            '• Equipment relocation same home: smoke-seal exempted joints OR test'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Troubleshooting · my test keeps failing</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• 12-15% leakage → likely missed plenum-to-furnace joint<br/>'+
            '• 8-12% → return drop-box in bottom-return configs<br/>'+
            '• 6-8% → flex inner liner at collar, sheet-metal transitions<br/>'+
            '• 4-6% → small nicks in flex insulation, boot gaps<br/>'+
            '• &lt;4% → within gauge accuracy, stop sealing<br/>'+
            '• Remember: pressurization test can pass even if depressurization fails<br/>'+
            '• HERS rater calls which direction · document both if you can'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_dl_case','mp_dl_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 6) Refrigerant Charge HERS — T24 RA3.2 superheat/subcool verification
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['refCharge'] = {
    i18n: {
      mp_rc_title:{es:'Refrigerant Charge HERS',en:'HERS Refrigerant Charge'},
      mp_rc_sub:  {es:'T24 RA3.2 — Standard/Weigh-in',en:'T24 RA3.2 — Standard/Weigh-in'},
      mp_rc_mode: {es:'Método',en:'Method'},
      mp_rc_shA:  {es:'Superheat actual',en:'Actual superheat'},
      mp_rc_shT:  {es:'Superheat objetivo',en:'Target superheat'},
      mp_rc_scA:  {es:'Subcool actual',en:'Actual subcool'},
      mp_rc_scT:  {es:'Subcool objetivo (placa)',en:'Target subcool (nameplate)'},
      mp_rc_dev:  {es:'Desviación',en:'Deviation'},
      mp_rc_ok:   {es:'CUMPLE HERS ±3°F',en:'PASSES HERS ±3°F'},
      mp_rc_bad:  {es:'FUERA DE RANGO — recargar',en:'OUT OF RANGE — adjust charge'},
      mp_rc_case: {es:'Daikin inverter CZ9, TXV: subcool placa 10°F, medido 7°F → desv −3°F → PASS borderline. Sube ~4 oz R-410A y revérifica después de 15 min estable.',en:'Daikin inverter CZ9, TXV: nameplate SC 10°F, measured 7°F → Δ −3°F → borderline PASS. Add ~4 oz R-410A and retest after 15 min steady state.'},
      mp_rc_tip:  {es:'Tip Chaka: T24 2025 permite FDD (Fault Detection) en lugar de test manual — si el equipo tiene FDD integrado, printea el log y pega en CF3R. Ahorra 30 min.',en:'Chaka Tip: T24 2025 accepts built-in FDD (Fault Detection) in lieu of manual test — print the equipment log and staple to CF3R. Saves 30 min.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.refCharge) || {};
      var mode = s.mode || 'txv';
      var shA = num(s.shA, 12);
      var shT = num(s.shT, 10);
      var scA = num(s.scA, 7);
      var scT = num(s.scT, 10);
      var dev, metric, okRange = 3;
      if (mode === 'txv') { dev = scA - scT; metric = 'SC'; }
      else { dev = shA - shT; metric = 'SH'; }
      var ok = Math.abs(dev) <= okRange;
      var L = lang();

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_rc_mode','Método'), 'refCharge.mode', mode, [
          { v:'txv', label:(L==='es'?'TXV/EEV — medir subcool':'TXV/EEV — measure subcool') },
          { v:'fix', label:(L==='es'?'Orificio fijo — medir superheat':'Fixed orifice — measure superheat') }
        ]) +
        (mode==='txv' ?
          inputRow(t('mp_rc_scA','Subcool actual'), '°F', 'refCharge.scA', scA, '0.5', '0') +
          inputRow(t('mp_rc_scT','Subcool placa'), '°F', 'refCharge.scT', scT, '0.5', '0')
        :
          inputRow(t('mp_rc_shA','Superheat actual'), '°F', 'refCharge.shA', shA, '0.5', '0') +
          inputRow(t('mp_rc_shT','Superheat objetivo'), '°F', 'refCharge.shT', shT, '0.5', '0')
        ) +

        sectionLbl(t('mp_rc_dev','Desviación')) +
        resultBig(t('mp_rc_dev','Desviación'), (dev>=0?'+':'')+dev.toFixed(1)+'°F', metric,
                  statusPill(ok, t('mp_rc_ok','PASS HERS ±3°F'), t('mp_rc_bad','OUT OF RANGE'))) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_rc_mode','Método'), mode==='txv' ? 'TXV/EEV (subcool)' : 'Fixed orifice (SH)') +
          kv('Target', mode==='txv' ? scT.toFixed(1)+'°F SC' : shT.toFixed(1)+'°F SH') +
          kv('Actual',  mode==='txv' ? scA.toFixed(1)+'°F SC' : shA.toFixed(1)+'°F SH') +
          kv('Title 24', '§RA3.2 · tolerance ±3°F') +
          kv('HERS form', 'CF3R-MCH-25-H') +
        '</div>' +

        codeNote('<strong>T24 §RA3.2.3 Standard Charge:</strong> Steady-state 15 min at outdoor ≥55°F. TXV: subcool within ±3°F of nameplate. Fixed orifice: superheat within ±3°F of target SH table (RA3.2-2). Record with gauges calibrated ±0.5%. Alternative §RA3.2.2 Weigh-in method for new installs — charge by nameplate weight + line length correction.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Test prerequisites (all must be true)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Outdoor dry-bulb 55-115°F · indoor WB 50-75°F<br/>'+
            '• Return air <80°F DB to prevent test-only high superheat<br/>'+
            '• Filter clean · evaporator clean · condenser coil clean<br/>'+
            '• 400 ±50 CFM per ton supply airflow verified<br/>'+
            '• Refrigerant line insulation R-4 continuous (2022 code)<br/>'+
            '• TXV sensing bulb strapped at 4 o&#39;clock on suction line<br/>'+
            '• Run at least 15 min continuous at highest available stage'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Weigh-in method · line-length correction</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Base charge from OEM plate (e.g. 3-ton = 5 lb 12 oz R-410A typ)<br/>'+
            '• Add for line set > 15 ft: R-410A = 0.6 oz/ft on liquid line<br/>'+
            '• Add for line set > 15 ft: R-32 = 0.4 oz/ft on liquid line<br/>'+
            '• Evacuate to ≤500 microns and decay &lt;50 μm in 10 min<br/>'+
            '• Use digital scale ±0.1 oz · purge recovery tank to tare<br/>'+
            '• Record manufacturer, model, serial, refrigerant, total weight on CF3R-MCH-25-H'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Target superheat table (fixed-orifice) · indoor DB vs outdoor DB</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• OA 75°F, return 80°F 50% RH → target SH 18°F<br/>'+
            '• OA 85°F, return 80°F 50% RH → target SH 12°F<br/>'+
            '• OA 95°F, return 80°F 50% RH → target SH 8°F<br/>'+
            '• OA 105°F, return 80°F 50% RH → target SH 5°F<br/>'+
            '• OA 115°F, return 80°F 50% RH → target SH 3°F<br/>'+
            '• Higher indoor WB (humid) → higher target SH<br/>'+
            '• Lower indoor WB (dry climate) → lower target SH<br/>'+
            '• Full table in T24 RA3.2-2 · also on OEM sticker in some units'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Inverter / variable-speed charge verification</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Inverter ALWAYS modulates — steady state harder to hit<br/>'+
            '• Lock unit to 100% cooling via service DIP or app test mode<br/>'+
            '• Allow 20-30 min after lock for pressures/temps to settle<br/>'+
            '• Most inverters report SH/SC on the control board · use that<br/>'+
            '• If OEM provides FDD log, T24 2025 accepts it in lieu of manual<br/>'+
            '• Document FDD model + firmware version on CF3R-MCH-25-H'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_rc_case','mp_rc_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 7) IECC 2021 Table R402.1.3 — U-factor by climate zone (real)
  // ═══════════════════════════════════════════════════════════════
  var IECC_U = {
    '1': { ceil:0.035, frameWall:0.084, massWall:0.197, floor:0.064, slab:'none',    window:0.50, sgr:0.25 },
    '2': { ceil:0.030, frameWall:0.084, massWall:0.165, floor:0.064, slab:'none',    window:0.40, sgr:0.25 },
    '3': { ceil:0.030, frameWall:0.060, massWall:0.098, floor:0.047, slab:'none',    window:0.30, sgr:0.25 },
    '4': { ceil:0.026, frameWall:0.060, massWall:0.098, floor:0.047, slab:'R-10',    window:0.30, sgr:0.40 },
    '5': { ceil:0.026, frameWall:0.045, massWall:0.082, floor:0.033, slab:'R-10',    window:0.30, sgr:0.40 },
    '6': { ceil:0.026, frameWall:0.045, massWall:0.060, floor:0.033, slab:'R-10',    window:0.30, sgr:0.40 },
    '7': { ceil:0.026, frameWall:0.045, massWall:0.057, floor:0.028, slab:'R-10',    window:0.30, sgr:0.40 },
    '8': { ceil:0.026, frameWall:0.045, massWall:0.057, floor:0.028, slab:'R-10',    window:0.30, sgr:0.40 }
  };

  window.MP_CALCS['iecc402'] = {
    i18n: {
      mp_iecc_title:{es:'IECC 2021 R402 · Envelope',en:'IECC 2021 R402 · Envelope'},
      mp_iecc_sub:  {es:'U-factor por zona climática',en:'U-factor by climate zone'},
      mp_iecc_cz:   {es:'Zona climática IECC',en:'IECC climate zone'},
      mp_iecc_elem: {es:'Elemento',en:'Element'},
      mp_iecc_actualU:{es:'U-factor propuesto',en:'Proposed U-factor'},
      mp_iecc_reqU:  {es:'U-factor máximo',en:'Max U-factor'},
      mp_iecc_status:{es:'Cumplimiento',en:'Compliance'},
      mp_iecc_ok:   {es:'CUMPLE R402.1.3',en:'PASSES R402.1.3'},
      mp_iecc_bad:  {es:'EXCEDE — mejora aislamiento',en:'EXCEEDS — improve insulation'},
      mp_iecc_case: {es:'Casa Dallas CZ3, pared frame propuesta U-0.070 → máximo IECC 2021 es U-0.060 → FAIL. Subir a R-20 cavidad + R-5 CI continuous.',en:'Dallas CZ3 home, frame wall proposed U-0.070 → IECC 2021 max is U-0.060 → FAIL. Upgrade to R-20 cavity + R-5 continuous CI.'},
      mp_iecc_tip:  {es:'Tip Chaka: U-factor dominante es fenestration. Si SHGC de ventana >0.25 en CZ1-3, pierdes U-compliance — busca low-SHGC tinted glass.',en:'Chaka Tip: Window U dominates. If window SHGC >0.25 in CZ1-3, U-compliance fails — spec low-SHGC tinted glass.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.iecc402) || {};
      var cz = s.cz || '4';
      var elem = s.elem || 'frameWall';
      var Z = IECC_U[cz] || IECC_U['4'];
      var reqU = Z[elem];
      var propU = num(s.propU, (typeof reqU==='number'?reqU:0.3));
      var ok = typeof reqU==='number' ? (propU <= reqU) : true;
      var L = lang();
      var elemLabels = {
        ceil:      { es:'Techo',                  en:'Ceiling' },
        frameWall: { es:'Pared frame',            en:'Frame wall' },
        massWall:  { es:'Pared mass (bloque)',    en:'Mass wall (CMU)' },
        floor:     { es:'Piso sobre no-cond',     en:'Floor over unconditioned' },
        window:    { es:'Ventana (fenestration)', en:'Window (fenestration)' }
      };
      var elemOpts = [];
      for (var k in elemLabels){ elemOpts.push({ v:k, label: elemLabels[k][L] }); }
      var czOpts = [];
      for (var cz2 in IECC_U){ czOpts.push({ v:cz2, label: 'CZ '+cz2 }); }

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_iecc_cz','Zona climática IECC'), 'iecc402.cz', cz, czOpts) +
        selectRow(t('mp_iecc_elem','Elemento'), 'iecc402.elem', elem, elemOpts) +
        inputRow(t('mp_iecc_actualU','U-factor propuesto'), 'BTU/h·ft²·°F', 'iecc402.propU', propU, '0.001', '0') +

        sectionLbl(t('mp_iecc_status','Cumplimiento')) +
        resultBig(t('mp_iecc_reqU','U-factor máximo'), (typeof reqU==='number'?reqU.toFixed(3):'n/a'), 'BTU/h·ft²·°F',
                  statusPill(ok, t('mp_iecc_ok','PASS R402.1.3'), t('mp_iecc_bad','FAIL — improve'))) +

        '<div style="margin-top:12px;">'+
          kv('CZ '+cz+' ceiling U', Z.ceil.toFixed(3)) +
          kv('CZ '+cz+' frame wall U', Z.frameWall.toFixed(3)) +
          kv('CZ '+cz+' mass wall U', Z.massWall.toFixed(3)) +
          kv('CZ '+cz+' floor U', Z.floor.toFixed(3)) +
          kv('CZ '+cz+' slab R', String(Z.slab)) +
          kv('CZ '+cz+' window U', Z.window.toFixed(2)) +
          kv('CZ '+cz+' SHGC max', Z.sgr.toFixed(2)) +
          kv('IECC', 'Table R402.1.3 · 2021') +
        '</div>' +

        codeNote('<strong>IECC 2021 R402.1.3:</strong> U-factor alternative to R-value method. Fenestration SHGC per R402.1.4 (CZ1-3=0.25, CZ4-8=0.40). Mandatory air sealing ≤3 ACH50 (CZ3-8) or ≤5 ACH50 (CZ1-2). R403.3 duct insulation R-8 supply in unconditioned attic / R-6 elsewhere. R406 ERI alternative path available when prescriptive exceeds budget.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Typical assemblies that hit IECC U-max</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• CZ3 frame wall U-0.060 → 2×6 R-20 cavity + R-5 CI XPS<br/>'+
            '• CZ4 frame wall U-0.060 → 2×6 R-20 + R-5 CI (same as CZ3)<br/>'+
            '• CZ5 frame wall U-0.045 → 2×6 R-20 + R-10 CI polyiso<br/>'+
            '• CZ6-8 frame wall U-0.045 → 2×6 R-20 + R-10 CI + advanced framing<br/>'+
            '• CZ4-5 ceiling U-0.026 → R-49 blown fiberglass/cellulose attic<br/>'+
            '• CZ6-8 ceiling U-0.026 → R-60 with raised-heel truss<br/>'+
            '• Mass wall CZ5: 8" CMU + R-13 CI exterior'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">IECC 2021 mandatory provisions (R402.4)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• R402.4.1.2 blower door ≤3 ACH50 (CZ3-8) or 5 ACH50 (CZ1-2)<br/>'+
            '• R402.4.3 sealed fireplaces (gasketed doors + outdoor combustion air)<br/>'+
            '• R402.4.4 recessed cans IC-rated air-tight<br/>'+
            '• R402.5 maximum fenestration U-factor in any addition<br/>'+
            '• R403.1.1 programmable thermostat for forced-air<br/>'+
            '• R403.6 mechanical ventilation per ASHRAE 62.2<br/>'+
            '• R404.1 high-efficiency lighting ≥90% of all fixtures'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_iecc_case','mp_iecc_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 8) Economizer Required — T24 §140.4(e) + ASHRAE 90.1 §6.5.1
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['economizer'] = {
    i18n: {
      mp_eco_title:{es:'Economizer Requerido',en:'Economizer Required?'},
      mp_eco_sub:  {es:'T24 §140.4(e) + 90.1 §6.5.1',en:'T24 §140.4(e) + 90.1 §6.5.1'},
      mp_eco_cap:  {es:'Capacidad enfriamiento',en:'Cooling capacity'},
      mp_eco_cz:   {es:'Zona climática CA',en:'CA climate zone'},
      mp_eco_type: {es:'Tipo edificio',en:'Building type'},
      mp_eco_req:  {es:'¿Requerido?',en:'Required?'},
      mp_eco_yes:  {es:'SÍ — economizer mandatory',en:'YES — economizer mandatory'},
      mp_eco_no:   {es:'NO requerido (exempt)',en:'NOT required (exempt)'},
      mp_eco_hiLimit:{es:'Control high-limit',en:'High-limit control'},
      mp_eco_case: {es:'RTU 8-ton (96 kBtu/h) oficina CZ9 (Pasadena). Título 24 exige economizer para cualquier ≥54 kBtu/h no-residencial → SÍ requerido. Diferencial sech-bulb <75°F high-limit.',en:'8-ton RTU (96 kBtu/h) office CZ9 (Pasadena). Title 24 requires economizer for any ≥54 kBtu/h non-residential → YES required. Dry-bulb <75°F high-limit.'},
      mp_eco_tip:  {es:'Tip Chaka: En CZ1-5 y CZ11-16 el high-limit de Title 24 es fixed dry-bulb 75°F. En CZ6-10 y 13-15 usa differential enthalpy para evitar "overventing" en días húmedos.',en:'Chaka Tip: CZ1-5 and CZ11-16 use fixed dry-bulb 75°F high-limit. CZ6-10 and 13-15 use differential enthalpy to avoid over-venting on humid days.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.economizer) || {};
      var capBtu = num(s.cap, 96000);
      var cz = s.cz || '9';
      var btype = s.btype || 'office';
      // T24 2022 §140.4(e): economizer required if cooling cap ≥54,000 Btu/h non-residential,
      // exempt: CZ1 (no cooling), hospitals in CZ13-15 special, computer rooms <240 kBtu/h exempt
      var exemptByType = (btype === 'dataCenterSmall' && capBtu < 240000);
      var exemptByCz = (cz === '1');
      var required = capBtu >= 54000 && !exemptByType && !exemptByCz;
      // high-limit by CZ
      var hiLimit;
      if (['1','3','5','11','12','14','16'].indexOf(cz) >= 0) hiLimit = (lang()==='es'?'Fixed DB 75°F':'Fixed dry-bulb 75°F');
      else if (['2','4'].indexOf(cz) >= 0) hiLimit = (lang()==='es'?'Diferencial DB':'Differential dry-bulb');
      else hiLimit = (lang()==='es'?'Diferencial entalpía':'Differential enthalpy');

      var czOpts = [];
      for (var k=1;k<=16;k++) czOpts.push({ v:String(k), label:'CZ '+k });
      var L = lang();

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_eco_cz','Zona climática'), 'economizer.cz', cz, czOpts) +
        selectRow(t('mp_eco_type','Tipo edificio'), 'economizer.btype', btype, [
          { v:'office',          label:(L==='es'?'Oficina':'Office') },
          { v:'retail',          label:(L==='es'?'Comercio':'Retail') },
          { v:'school',          label:(L==='es'?'Escuela':'School') },
          { v:'restaurant',      label:(L==='es'?'Restaurante':'Restaurant') },
          { v:'warehouse',       label:(L==='es'?'Bodega':'Warehouse') },
          { v:'dataCenterSmall', label:(L==='es'?'Data center <20 ton':'Data center <20 ton') }
        ]) +
        inputRow(t('mp_eco_cap','Capacidad enfriamiento'), 'BTU/h', 'economizer.cap', capBtu, '1000', '0') +

        sectionLbl(t('mp_eco_req','¿Requerido?')) +
        resultBig(t('mp_eco_req','Economizer'), required?'SÍ / YES':'NO', '',
                  statusPill(!required || required, required?t('mp_eco_yes',''):t('mp_eco_no',''), '')) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_eco_cap','Capacidad'), fmt(capBtu/12000,1)+' ton ('+fmt(capBtu,0)+' BTU/h)') +
          kv('Umbral T24', '≥54,000 BTU/h (4.5 ton)') +
          kv(t('mp_eco_hiLimit','High-limit'), hiLimit) +
          kv('T24 §140.4(e)', '2022 ed.') +
          kv('ASHRAE 90.1', '§6.5.1 · 33,000–54,000 Btu/h depending on CZ') +
        '</div>' +

        codeNote('<strong>T24 2022 §140.4(e):</strong> Economizers mandatory for cooling ≥54,000 Btu/h non-residential. Exemptions §140.4(e)2: computer rooms <240 kBtu/h, systems with condenser heat recovery, special humidity-controlled spaces. High-limit controls per Table 140.4-A (fixed DB, differential DB, or enthalpy by CZ). Fault detection (FDD) mandatory on new RTUs per §120.2(i) starting 2022.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">High-limit control by CA climate zone</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• CZ1, 3, 5, 11, 12, 14, 16 — Fixed dry-bulb 75°F<br/>'+
            '• CZ2, 4 — Differential dry-bulb (OA < RA temp)<br/>'+
            '• CZ6, 8, 9, 10, 13, 15 — Differential enthalpy + fixed DB 75°F<br/>'+
            '• CZ7 — Fixed dry-bulb 75°F plus fixed enthalpy 28 Btu/lb<br/>'+
            '• Sensor accuracy per §120.2: ±2°F DB, ±2% RH, ±1 Btu/lb enthalpy'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Economizer damper & control requirements</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• OA damper leakage ≤3 CFM/ft² @1.0" WC (§120.2(a))<br/>'+
            '• Damper actuator spring-return on power loss (fail-closed)<br/>'+
            '• Minimum OA position commissioned per balancing report<br/>'+
            '• Integrated economizer (not non-integrated) for cooling ≥75 kBtu/h<br/>'+
            '• Barometric relief or powered exhaust required ≥65 kBtu/h'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Commissioning checklist · economizer startup</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '1. Verify OA damper fully closes on power-off (fail-closed spring)<br/>'+
            '2. Cycle damper full stroke 0→100% and back, check binding<br/>'+
            '3. Force economizer mode via BAS, measure OA intake CFM with flow hood<br/>'+
            '4. Force high-limit lockout, verify return to mechanical cooling<br/>'+
            '5. Test mixed-air low-limit (typically 55°F) preventing coil freeze<br/>'+
            '6. Calibrate OA sensor at ambient vs handheld psychrometer<br/>'+
            '7. Document all setpoints on CF3R-MCH-05 or equivalent<br/>'+
            '8. Enable FDD diagnostics per §120.2(i) reporting faults to BAS'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Common failure modes · why economizers die</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Actuator stripped gear — stuck at 100% OA or 0%<br/>'+
            '• Sensor drift — reports 75°F when actual 95°F, damper opens in heat<br/>'+
            '• Linkage slipped — damper indication doesn\u2019t match actual blade<br/>'+
            '• Mixed-air sensor failed — low-limit not enforced, coil freeze<br/>'+
            '• Wiring short to rooftop conduit — EconoMizer relay chatter<br/>'+
            '• FDD needs annual recalibration per ASHRAE 62.1-2022 §7.2'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_eco_case','mp_eco_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 9) Demand Response — T24 §120.2(j) + CTA-2045
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['demandResp'] = {
    i18n: {
      mp_dr_title:{es:'Demand Response · CTA-2045',en:'Demand Response · CTA-2045'},
      mp_dr_sub:  {es:'T24 §120.2(j) + §150.0(q)',en:'T24 §120.2(j) + §150.0(q)'},
      mp_dr_eq:   {es:'Tipo equipo',en:'Equipment type'},
      mp_dr_size: {es:'Capacidad / tamaño',en:'Capacity / size'},
      mp_dr_req:  {es:'¿DR requerido?',en:'DR required?'},
      mp_dr_proto:{es:'Protocolo',en:'Protocol'},
      mp_dr_yes:  {es:'SÍ — CTA-2045-B requerido',en:'YES — CTA-2045-B required'},
      mp_dr_no:   {es:'NO requerido',en:'NOT required'},
      mp_dr_case: {es:'HPWH 80-gal CZ12 Sacramento · T24 2022 §150.0(q) exige puerto CTA-2045-B factory o retrofit → SÍ. Verifica etiqueta JA13 en placa.',en:'80-gal HPWH CZ12 Sacramento · T24 2022 §150.0(q) mandates factory or retrofit CTA-2045-B port → YES. Verify JA13 label on nameplate.'},
      mp_dr_tip:  {es:'Tip Chaka: CTA-2045-B usa módulo plug-in (UCM). Asegura que el breaker del HPWH tenga 2 pies de holgura para el cable del UCM — PG&E audit los checa en CF2R.',en:'Chaka Tip: CTA-2045-B uses a plug-in module (UCM). Leave 2 ft slack at the HPWH breaker for the UCM cable — PG&E audit checks this on CF2R.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.demandResp) || {};
      var eq = s.eq || 'hpwh';
      var size = num(s.size, 80);
      var required, proto;
      // T24 §150.0(q): HPWH ≥55 gal must have CTA-2045-B port (2022 code)
      // T24 §120.2(j): thermostats for central HVAC must support OpenADR 2.0a
      if (eq === 'hpwh')      { required = size >= 55; proto = 'CTA-2045-B (ANSI/CTA-2045-B)'; }
      else if (eq === 'tstat'){ required = true;      proto = 'OpenADR 2.0a'; }
      else if (eq === 'ev')   { required = size >= 40; proto = 'ISO 15118 / OCPP 2.0.1'; }
      else                    { required = false;     proto = 'n/a'; }
      var L = lang();

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_dr_eq','Tipo equipo'), 'demandResp.eq', eq, [
          { v:'hpwh',  label:(L==='es'?'Heat pump water heater':'Heat pump water heater') },
          { v:'tstat', label:(L==='es'?'Termostato HVAC central':'Central HVAC thermostat') },
          { v:'ev',    label:(L==='es'?'EV charger L2':'EV charger L2') },
          { v:'pool',  label:(L==='es'?'Bomba de piscina':'Pool pump') }
        ]) +
        inputRow(t('mp_dr_size','Capacidad / tamaño'), (eq==='hpwh'?'gal':eq==='ev'?'A':eq==='pool'?'HP':'n/a'), 'demandResp.size', size, '1', '0') +

        sectionLbl(t('mp_dr_req','¿Requerido?')) +
        resultBig(t('mp_dr_req','DR'), required?'SÍ / YES':'NO', '',
                  statusPill(required, required?t('mp_dr_yes',''):t('mp_dr_no',''), '')) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_dr_proto','Protocolo'), proto) +
          kv(t('mp_dr_eq','Equipo'), eq) +
          kv(t('mp_dr_size','Tamaño'), size.toFixed(0)) +
          kv('T24', '§120.2(j) · §150.0(q) · §150.0(n)') +
          kv('CF2R', 'HERS verification · PG&E/SCE audit') +
        '</div>' +

        codeNote('<strong>T24 2022 §150.0(q):</strong> HPWH ≥55 gal require CTA-2045-B port (factory or retrofit). §120.2(j): non-residential central HVAC thermostats must support OpenADR 2.0a for peak event curtailment. §150.0(n): L2 EV chargers ≥40 A must support ISO 15118 smart-charging. §110.12 mandates device manufacturer certification to CEC appliance database.') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">CTA-2045-B message set · how utility signals flow</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Shed — reduce demand (utility peak event, 1-4 hours)<br/>'+
            '• Load-up — pre-heat water ahead of shed window<br/>'+
            '• End Shed — resume normal operation<br/>'+
            '• Critical Peak — maximum reduction (rarely used)<br/>'+
            '• Grid Emergency — instantaneous shed (&lt;5 s)<br/>'+
            '• Consumer Override — user opt-out for this event<br/>'+
            '• Present Price — real-time rate display<br/>'+
            '• Communication Standard — ZigBee SEP 2.0 or Wi-Fi + MQTT'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">CA utility incentive programs (2026)</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• TECH Clean CA — $1,000-$3,100 per HP conversion<br/>'+
            '• SGIP Resiliency — battery + HP bundle, income-qualified $850/kWh<br/>'+
            '• PG&E ConnectedSolutions — $100/yr per thermostat for DR enrollment<br/>'+
            '• SCE Flex Alert — real-time curtailment $0.25/kWh peak credit<br/>'+
            '• SDG&E SmartAC — $50 sign-up + $40/yr for DR-enabled tstat<br/>'+
            '• CVRP / CVAP — $1,000-$7,500 for EV + L2 charger bundle<br/>'+
            '• IRA 25C federal tax credit — 30% up to $2,000 for HP (2026)'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">OpenADR 2.0a vs 2.0b · which one for what</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• 2.0a — simple VTN→VEN broadcast, fits small commercial thermostats<br/>'+
            '• 2.0b — bidirectional report-back, needed for AMI-scale residential<br/>'+
            '• T24 §120.2(j) requires 2.0a MINIMUM on all central HVAC tstats<br/>'+
            '• 2.0b needed for settlement-grade DR revenue programs<br/>'+
            '• OADR 3.0 in CTS testing for behind-the-meter IEEE 2030.5 bridge<br/>'+
            '• Certified products list: openadr.org/certification'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_dr_case','mp_dr_tip');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 10) Capacity Ratio — T24 §150.1(c)2A (installed/design)
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['capacityRatio'] = {
    i18n: {
      mp_cr_title:{es:'Capacity Ratio · T24 150.1',en:'Capacity Ratio · T24 150.1'},
      mp_cr_sub:  {es:'Installed ÷ Design Manual J',en:'Installed ÷ Design Manual J'},
      mp_cr_des:  {es:'Diseño (Manual J)',en:'Design (Manual J)'},
      mp_cr_ins:  {es:'Capacidad instalada',en:'Installed capacity'},
      mp_cr_sys:  {es:'Sistema',en:'System'},
      mp_cr_ratio:{es:'Ratio',en:'Ratio'},
      mp_cr_lo:   {es:'Límite inferior',en:'Lower limit'},
      mp_cr_hi:   {es:'Límite superior',en:'Upper limit'},
      mp_cr_ok:   {es:'CUMPLE',en:'PASSES'},
      mp_cr_bad:  {es:'FUERA DE RANGO',en:'OUT OF RANGE'},
      mp_cr_case: {es:'Tract home CZ15 Palm Springs, Manual J cooling = 38,500 BTU/h. HP instalado 48,000 (4-ton) → ratio 1.25 → EN límite exacto para HP. Subir a 5-ton falla; bajar a 3.5-ton (42k) ratio 1.09 ideal.',en:'CZ15 Palm Springs tract, Manual J cooling = 38,500 BTU/h. Installed 4-ton HP (48k) → ratio 1.25 → exactly at HP limit. 5-ton fails; 3.5-ton (42k) ratio 1.09 ideal.'},
      mp_cr_tip:  {es:'Tip Chaka: Cuando el ratio está 1.00–1.15 ideal — no oversize. Oversizing corta ciclos, destruye latent removal y te hunde el HERS CF2R.',en:'Chaka Tip: Ideal ratio is 1.00–1.15 — do not oversize. Oversizing short-cycles, kills latent removal, and sinks your HERS CF2R.'}
    },
    render: function(state){
      var s = (state.inputs && state.inputs.capacityRatio) || {};
      var des = num(s.des, 38500);
      var ins = num(s.ins, 48000);
      var sys = s.sys || 'hp';
      var hi = (sys==='hp') ? 1.25 : 1.15;
      var lo = 0.90;
      var ratio = ins / (des || 1);
      var ok = ratio >= lo && ratio <= hi;
      var L = lang();

      return card(
        sectionLbl(t('mp_inputs','Entradas')) +
        selectRow(t('mp_cr_sys','Sistema'), 'capacityRatio.sys', sys, [
          { v:'ac', label:(L==='es'?'A/C solo cooling (1.15×)':'AC cooling-only (1.15×)') },
          { v:'hp', label:(L==='es'?'Heat pump (1.25×)':'Heat pump (1.25×)') }
        ]) +
        inputRow(t('mp_cr_des','Diseño Manual J'), 'BTU/h', 'capacityRatio.des', des, '500', '1000') +
        inputRow(t('mp_cr_ins','Capacidad instalada'), 'BTU/h', 'capacityRatio.ins', ins, '500', '1000') +

        sectionLbl(t('mp_cr_ratio','Ratio')) +
        resultBig(t('mp_cr_ratio','Ratio'), ratio.toFixed(2)+'×', '',
                  statusPill(ok, t('mp_cr_ok','PASSES 150.1'), t('mp_cr_bad','OUT OF RANGE'))) +

        '<div style="margin-top:12px;">'+
          kv(t('mp_cr_lo','Límite inferior'), lo.toFixed(2)+'×') +
          kv(t('mp_cr_hi','Límite superior'), hi.toFixed(2)+'× ('+(sys==='hp'?'HP':'AC')+')') +
          kv(t('mp_cr_des','Diseño'), fmt(des,0)+' BTU/h') +
          kv(t('mp_cr_ins','Instalado'), fmt(ins,0)+' BTU/h ('+fmt(ins/12000,2)+' ton)') +
          kv('T24', '§150.1(c)2A · 2022') +
          kv('HERS', 'CF3R-MCH-01-H sign-off') +
        '</div>' +

        codeNote('<strong>T24 §150.1(c)2A:</strong> Installed cooling capacity ≤1.15× Manual J (AC) or ≤1.25× (heat pump). Minimum 0.90× to ensure comfort. Heat pump heating capacity tested at 47°F rating per AHRI 210/240. HERS rater verifies Manual J + S + D on CF3R. Low-ambient operation per §150.1(c)2B: HP must deliver ≥70% of rated at design heating temp (CZ1-2, 11-16).') +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Ratio guidance · where to land</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• 0.95–1.05 — IDEAL, maximum comfort + dehumidification<br/>'+
            '• 1.05–1.15 — ACCEPTABLE AC, margin for hot days<br/>'+
            '• 1.15–1.25 — HP only, short-cycling risk with single-stage<br/>'+
            '• >1.25 — FAILS T24, sized on rule-of-thumb not Manual J<br/>'+
            '• <0.90 — undersized, occupant complaints in peak weather<br/>'+
            '• Variable-capacity inverter units effectively "resize" = ratio 0.3–1.0 modulation'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Common oversizing pitfalls</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Using "500 sf per ton" rule — always oversizes<br/>'+
            '• Defaulting to replacement of existing ton without new Manual J<br/>'+
            '• Ignoring window upgrades (low-E drops cooling load 20-30%)<br/>'+
            '• Not accounting for tight envelope post-weatherization<br/>'+
            '• Treating latent load separately — ASHRAE 55 needs SHR 0.70-0.75'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Manual J short-form inputs you cannot skip</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Climate design temps (ACCA outdoor 99%/1% per ZIP)<br/>'+
            '• Indoor design 75°F cooling / 70°F heating · RH 50%<br/>'+
            '• Infiltration from blower door ACH50 ÷ 20 to get natural ACH<br/>'+
            '• Internal gains 230 W per occupant sensible + 200 W appliances<br/>'+
            '• Glazing U and SHGC from NFRC label — not ASHRAE defaults<br/>'+
            '• Duct loss 10% if in conditioned, 15% if unconditioned, 25% if outside<br/>'+
            '• Direction/shading/overhangs per window · ACCA SRG rules'+
          '</div>'+
        '</div>' +

        '<div style="margin-top:12px;background:#0F1A30;border:1.5px solid '+DIVIDER+';border-radius:10px;padding:12px;">'+
          '<div style="font-size:12px;color:'+EMERALD+';font-weight:800;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Manual S equipment selection logic</div>'+
          '<div style="font-size:12px;color:'+WHITE+';line-height:1.7;">'+
            '• Select at design OA temp not 95°F catalog · use AHRI extended tables<br/>'+
            '• Total capacity ≥100% sensible + latent at design RH setpoint<br/>'+
            '• Sensible capacity ≥95% Manual J sensible at 80°F DB / 67°F WB<br/>'+
            '• Latent capacity sized for 70-75% SHR in humid zones<br/>'+
            '• Airflow 350-400 CFM per ton cooling, 400-450 dry climates<br/>'+
            '• Heat pump heating cap ≥100% Manual J at balance point (not 47°F)'+
          '</div>'+
        '</div>'
      ) + exampleTip('mp_cr_case','mp_cr_tip');
    }
  };

})();
