// Maestro Pro · NEC 2 calculators
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

  // ───────────────────────────────────────────────────────────────
  // NEC 310.15(B)(1) Ambient Temperature Correction Factors
  // Factors for 75°C and 90°C insulation (most common)
  // ───────────────────────────────────────────────────────────────
  // Rows: ambient °F upper bound; values: [F75, F90]
  var TEMP_CORR = [
    { maxF: 50,  f75: 1.20, f90: 1.15 },
    { maxF: 59,  f75: 1.11, f90: 1.08 },
    { maxF: 68,  f75: 1.05, f90: 1.04 },
    { maxF: 77,  f75: 1.00, f90: 1.00 },
    { maxF: 86,  f75: 0.94, f90: 0.96 },
    { maxF: 95,  f75: 0.88, f90: 0.91 },
    { maxF: 104, f75: 0.82, f90: 0.87 },
    { maxF: 113, f75: 0.75, f90: 0.82 },
    { maxF: 122, f75: 0.67, f90: 0.76 },
    { maxF: 131, f75: 0.58, f90: 0.71 },
    { maxF: 140, f75: 0.47, f90: 0.65 },
    { maxF: 149, f75: 0.33, f90: 0.58 },
    { maxF: 158, f75: 0.00, f90: 0.50 },
    { maxF: 176, f75: 0.00, f90: 0.41 }
  ];

  function tempCorrection(ambientF, insul){
    for (var i=0;i<TEMP_CORR.length;i++){
      if (ambientF <= TEMP_CORR[i].maxF){
        return insul === 90 ? TEMP_CORR[i].f90 : TEMP_CORR[i].f75;
      }
    }
    return 0;
  }

  // NEC 310.15(C)(1) — Adjustment factors for >3 current-carrying conductors
  function adjustmentFactor(n){
    if (n <= 3) return 1.00;
    if (n <= 6) return 0.80;
    if (n <= 9) return 0.70;
    if (n <= 20) return 0.50;
    if (n <= 30) return 0.45;
    if (n <= 40) return 0.40;
    return 0.35;
  }

  // ═══════════════════════════════════════════════════════════════
  // TOOL 1: Conductor Derating — NEC 310.15(B)
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['condDerate'] = {
    i18n: {
      mp_cd_title:   { es:'Derating de conductores · NEC 310.15(B)',   en:'Conductor derating · NEC 310.15(B)' },
      mp_cd_sub:     { es:'Temperatura ambiente + conductores agrupados', en:'Ambient temp + bundled conductors' },
      mp_cd_base:    { es:'Ampacidad base (tabla 310.16)',              en:'Base ampacity (table 310.16)' },
      mp_cd_ambient: { es:'Temperatura ambiente',                       en:'Ambient temperature' },
      mp_cd_insul:   { es:'Aislamiento del conductor',                  en:'Conductor insulation' },
      mp_cd_ccc:     { es:'Conductores portadores agrupados',           en:'Current-carrying conductors bundled' },
      mp_cd_tempf:   { es:'Factor por temperatura',                     en:'Temperature correction factor' },
      mp_cd_adjf:    { es:'Factor por agrupamiento',                    en:'Adjustment factor' },
      mp_cd_derated: { es:'Ampacidad derated',                          en:'Derated ampacity' },
      mp_cd_formula: { es:'Fórmula',                                    en:'Formula' },
      mp_cd_formula_v:{ es:'Ampacidad × F.temp × F.ajuste',              en:'Ampacity × Temp-corr × Adjustment' },
      mp_cd_note:    { es:'Si el factor es 0, elige aislamiento de mayor temperatura o reubica el conductor. NEC Tabla 310.15(B)(1) y 310.15(C)(1).', en:'If factor = 0, pick higher-temp insulation or reroute conductor. NEC Tables 310.15(B)(1) and 310.15(C)(1).' },
      mp_cd_case:    { es:'Mini-split 240V en techo a 108°F: THHN #10 (ampacidad base 40A) con 4 CCC en la misma canalización → 40 × 0.87 × 0.80 = 27.8A. Upsizing a #8 THHN.', en:'240V rooftop mini-split at 108°F: THHN #10 (base 40A) with 4 CCC same raceway → 40 × 0.87 × 0.80 = 27.8 A. Upsize to #8 THHN.' },
      mp_cd_tip:     { es:'En techo negro de Florida, asume 130°F+ de ambiente — no los 86°F del libro. Upsize conductor una talla por cada 15°F sobre 86°F antes de ingresar a NEC 310.15.', en:'On a Florida black roof, assume 130°F+ ambient — not the book 86°F. Upsize one conductor size per 15°F over 86°F before NEC 310.15.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.condDerate) || {};
      var base = num(s.base, 40);
      var ambient = num(s.ambient, 86);
      var insul = +num(s.insul, 90);
      var ccc = Math.max(1, Math.floor(num(s.ccc, 4)));
      var tc = tempCorrection(ambient, insul);
      var af = adjustmentFactor(ccc);
      var derated = base * tc * af;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'condDerate', 'mp_cd_title', 'mp_cd_sub', '≋',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cd_base','Ampacidad base')) + '</span><span class="mp-unit">A</span></div>' +
            '<input type="number" class="mp-in" data-in="condDerate.base" value="' + base + '" min="1" step="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cd_ambient','Temperatura ambiente')) + '</span><span class="mp-unit">°F</span></div>' +
            '<input type="number" class="mp-in" data-in="condDerate.ambient" value="' + ambient + '" step="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cd_insul','Aislamiento')) + '</span><span class="mp-unit">°C</span></div>' +
            '<select class="mp-in" data-in="condDerate.insul">' +
              '<option value="75"' + (insul===75?' selected':'') + '>75°C (THW, THWN)</option>' +
              '<option value="90"' + (insul===90?' selected':'') + '>90°C (THHN, XHHW-2)</option>' +
            '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_cd_ccc','Conductores portadores')) + '</span><span class="mp-unit">CCC</span></div>' +
            '<input type="number" class="mp-in" data-in="condDerate.ccc" value="' + ccc + '" min="1" step="1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_cd_derated','Ampacidad derated')) + '</div>' +
          '<div class="mp-res-main">' + fmt(derated,1) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_cd_formula_v','Ampacidad × F.temp × F.ajuste')) + ' · ' + base + ' × ' + tc.toFixed(2) + ' × ' + af.toFixed(2) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_cd_tempf','F. temperatura')) + '</div><div class="mp-res-val">' + tc.toFixed(2) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cd_adjf','F. agrupamiento')) + '</div><div class="mp-res-val">' + af.toFixed(2) + '</div></div>' +
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">310.15(B)(1) · 310.15(C)(1)</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cd_base','Base')) + '</div><div class="mp-res-val">' + base + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 310.15</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_cd_note','')) + '</div>' +
          '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Adjustment (Table 310.15(C)(1)):</strong> 4–6 CCC = 80%, 7–9 = 70%, 10–20 = 50%, 21–30 = 45%, 31–40 = 40%, 41+ = 35%.</div>' +
        '</div>' +
        exampleTip('mp_cd_case','mp_cd_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 2: GFCI / AFCI Location Matrix — NEC 210.8 / 210.12
  // ═══════════════════════════════════════════════════════════════
  // For each (occupancy, location): gfci, afci
  var GFCI_AFCI_MATRIX = {
    dwelling: {
      kitchen:   { gfci:true,  afci:true,  gfciSec:'210.8(A)(6)', afciSec:'210.12(A)', note:{es:'Todos los receptáculos que sirven superficies de cocina.', en:'All receptacles serving kitchen counter surfaces.'} },
      bathroom:  { gfci:true,  afci:false, gfciSec:'210.8(A)(1)', afciSec:'—',          note:{es:'Cualquier receptáculo dentro del baño.', en:'Any receptacle in a bathroom.'} },
      garage:    { gfci:true,  afci:false, gfciSec:'210.8(A)(2)', afciSec:'—',          note:{es:'Garajes adjuntos + cochera abierta.', en:'Attached garages + open carport.'} },
      outdoor:   { gfci:true,  afci:false, gfciSec:'210.8(A)(3)', afciSec:'—',          note:{es:'Receptáculos exteriores accesibles.', en:'Accessible outdoor receptacles.'} },
      bedroom:   { gfci:false, afci:true,  gfciSec:'—',          afciSec:'210.12(A)', note:{es:'AFCI en todos los circuitos 15/20A 120V.', en:'AFCI on all 15/20A 120V circuits.'} },
      living:    { gfci:false, afci:true,  gfciSec:'—',          afciSec:'210.12(A)', note:{es:'Salas, comedores, family rooms.', en:'Living rooms, dining rooms, family rooms.'} },
      laundry:   { gfci:true,  afci:true,  gfciSec:'210.8(A)(10)', afciSec:'210.12(A)',note:{es:'Receptáculos de lavandería (NEC 2017+).', en:'Laundry receptacles (NEC 2017+).'} },
      basement:  { gfci:true,  afci:true,  gfciSec:'210.8(A)(5)', afciSec:'210.12(A)', note:{es:'Sótanos habitables y no habitables (2020+).', en:'Finished and unfinished basements (2020+).'} },
      rooftop:   { gfci:true,  afci:false, gfciSec:'210.8(F)',    afciSec:'—',          note:{es:'NEC 2023: todo equipo HVAC exterior 120–250V ≤60A.', en:'NEC 2023: all outdoor HVAC equipment 120–250V ≤60A.'} },
      boathouse: { gfci:true,  afci:false, gfciSec:'210.8(A)(8)', afciSec:'—',          note:{es:'Boathouses y embarcaderos.', en:'Boathouses and docks.'} },
      crawlspace:{ gfci:true,  afci:false, gfciSec:'210.8(A)(4)', afciSec:'—',          note:{es:'Crawlspaces a o por debajo del nivel del suelo.', en:'Crawlspaces at or below grade.'} },
      pool:      { gfci:true,  afci:false, gfciSec:'680.22',      afciSec:'—',          note:{es:'Receptáculos dentro de 20 ft de piscina.', en:'Receptacles within 20 ft of pool.'} }
    },
    commercial: {
      kitchen:   { gfci:true,  afci:false, gfciSec:'210.8(B)(2)', afciSec:'—',          note:{es:'Receptáculos 125V 15/20A en áreas de cocina comercial.', en:'125V 15/20A receptacles in commercial kitchen areas.'} },
      bathroom:  { gfci:true,  afci:false, gfciSec:'210.8(B)(1)', afciSec:'—',          note:{es:'Baños comerciales — todos los receptáculos 15/20A.', en:'Commercial bathrooms — all 15/20A receptacles.'} },
      outdoor:   { gfci:true,  afci:false, gfciSec:'210.8(B)(4)', afciSec:'—',          note:{es:'Receptáculos exteriores en comercial/industrial.', en:'Outdoor receptacles in commercial/industrial.'} },
      rooftop:   { gfci:true,  afci:false, gfciSec:'210.8(F)',    afciSec:'—',          note:{es:'NEC 2023: HVAC en techo 120–250V ≤60A → GFCI.', en:'NEC 2023: rooftop HVAC 120–250V ≤60A → GFCI.'} },
      garage:    { gfci:true,  afci:false, gfciSec:'210.8(B)(8)', afciSec:'—',          note:{es:'Parking, service bays comerciales.', en:'Commercial parking, service bays.'} },
      laundry:   { gfci:true,  afci:false, gfciSec:'210.8(B)(3)', afciSec:'—',          note:{es:'Laundromats comerciales.', en:'Commercial laundries.'} },
      basement:  { gfci:true,  afci:false, gfciSec:'210.8(B)(9)', afciSec:'—',          note:{es:'Sótanos no-residenciales desde NEC 2023.', en:'Non-residential basements since NEC 2023.'} },
      crawlspace:{ gfci:true,  afci:false, gfciSec:'210.8(B)(10)',afciSec:'—',          note:{es:'Crawlspaces comerciales.', en:'Commercial crawlspaces.'} },
      living:    { gfci:false, afci:false, gfciSec:'—',          afciSec:'—',          note:{es:'Sin requisito general en oficinas.', en:'No general requirement in office areas.'} },
      bedroom:   { gfci:false, afci:false, gfciSec:'—',          afciSec:'—',          note:{es:'Hoteles/dormitorios — ver 210.8(C) y 210.12(B).', en:'Hotels/dorms — see 210.8(C) and 210.12(B).'} },
      boathouse: { gfci:true,  afci:false, gfciSec:'210.8(C)',    afciSec:'—',          note:{es:'Marinas comerciales → GFCI y GFPE.', en:'Commercial marinas → GFCI and GFPE.'} },
      pool:      { gfci:true,  afci:false, gfciSec:'680.22',      afciSec:'—',          note:{es:'Piscinas comerciales — 680.22.', en:'Commercial pools — 680.22.'} }
    }
  };

  window.MP_CALCS['gfciAfci'] = {
    i18n: {
      mp_ga_title:  { es:'GFCI / AFCI · Matriz 210.8 / 210.12',       en:'GFCI / AFCI · 210.8 / 210.12 matrix' },
      mp_ga_sub:    { es:'¿Qué protección necesita esta ubicación?', en:'What protection does this location need?' },
      mp_ga_occ:    { es:'Ocupación',                                 en:'Occupancy' },
      mp_ga_dw:     { es:'Vivienda (dwelling)',                       en:'Dwelling' },
      mp_ga_co:     { es:'Comercial / industrial',                    en:'Commercial / industrial' },
      mp_ga_loc:    { es:'Ubicación del circuito',                    en:'Circuit location' },
      mp_ga_req:    { es:'Protección requerida',                      en:'Required protection' },
      mp_ga_gfci:   { es:'GFCI',                                      en:'GFCI' },
      mp_ga_afci:   { es:'AFCI',                                      en:'AFCI' },
      mp_ga_yes:    { es:'Sí',                                        en:'Yes' },
      mp_ga_no:     { es:'No',                                        en:'No' },
      mp_ga_note:   { es:'Notas',                                     en:'Notes' },
      mp_ga_matrix: { es:'Matriz completa',                           en:'Full matrix' },
      mp_ga_hvac23: { es:'NEC 2023 — 210.8(F): TODO equipo HVAC exterior 120–250V ≤60A requiere GFCI personal (aplicado después 9/1/2026 en algunos estados).', en:'NEC 2023 — 210.8(F): ALL outdoor HVAC 120–250V ≤60A requires personnel GFCI (some states delay past 9/1/2026).' },
      mp_ga_case:   { es:'Técnico instala condensador 240V en techo de casa nueva (2023) → 210.8(F) exige GFCI personal; usa breaker 2P GFCI o EGFPD integrado.', en:'Tech installs 240V condenser on new home roof (2023) → 210.8(F) requires personnel GFCI; use 2P GFCI breaker or integrated EGFPD.' },
      mp_ga_tip:    { es:'Si la orden de servicio no especifica GFCI y la casa es post-2023, AVISA al cliente por escrito — el inspector te va a rechazar el ticket y te toca regresar.', en:'If the work order doesn\'t spec GFCI and the house is post-2023, WARN the customer in writing — inspector will reject the permit and you\'ll have to go back.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.gfciAfci) || {};
      var occ = s.occ || 'dwelling';
      var loc = s.loc || 'kitchen';
      var table = GFCI_AFCI_MATRIX[occ] || GFCI_AFCI_MATRIX.dwelling;
      var entry = table[loc] || table.kitchen;

      var locNames = {
        kitchen:   { es:'Cocina',                     en:'Kitchen' },
        bathroom:  { es:'Baño',                       en:'Bathroom' },
        garage:    { es:'Garaje / parking',           en:'Garage / parking' },
        outdoor:   { es:'Exterior',                   en:'Outdoor' },
        bedroom:   { es:'Dormitorio',                 en:'Bedroom' },
        living:    { es:'Sala / comedor',             en:'Living / dining' },
        laundry:   { es:'Lavandería',                 en:'Laundry' },
        basement:  { es:'Sótano',                     en:'Basement' },
        rooftop:   { es:'Techo (HVAC exterior)',      en:'Rooftop (outdoor HVAC)' },
        boathouse: { es:'Marina / boathouse',         en:'Marina / boathouse' },
        crawlspace:{ es:'Crawlspace',                 en:'Crawlspace' },
        pool:      { es:'Piscina (≤20 ft)',           en:'Pool (≤20 ft)' }
      };

      var locOpts = Object.keys(locNames).map(function(k){
        return '<option value="' + esc(k) + '"' + (loc===k?' selected':'') + '>' + esc(pick(locNames[k])) + '</option>';
      }).join('');

      // Matrix rendering
      var matrixRows = '';
      var locKeys = Object.keys(locNames);
      matrixRows += '<tr style="background:#F1F5F9;"><th style="padding:6px 8px;text-align:left;font-size:12px;color:#111;">' + esc(t('mp_ga_loc','Ubicación')) + '</th>' +
        '<th style="padding:6px 8px;font-size:12px;color:#111;">GFCI</th>' +
        '<th style="padding:6px 8px;font-size:12px;color:#111;">§</th>' +
        '<th style="padding:6px 8px;font-size:12px;color:#111;">AFCI</th>' +
        '<th style="padding:6px 8px;font-size:12px;color:#111;">§</th></tr>';
      for (var i=0;i<locKeys.length;i++){
        var lk = locKeys[i];
        var e = table[lk];
        if (!e) continue;
        var gY = e.gfci ? '<span style="color:#059669;font-weight:700;">✓</span>' : '<span style="color:#64748B;">—</span>';
        var aY = e.afci ? '<span style="color:#059669;font-weight:700;">✓</span>' : '<span style="color:#64748B;">—</span>';
        matrixRows += '<tr style="border-top:1px solid #E2E8F0;">' +
          '<td style="padding:6px 8px;font-size:12.5px;color:#111;">' + esc(pick(locNames[lk])) + '</td>' +
          '<td style="padding:6px 8px;text-align:center;">' + gY + '</td>' +
          '<td style="padding:6px 8px;font-size:11px;color:#111;">' + esc(e.gfciSec) + '</td>' +
          '<td style="padding:6px 8px;text-align:center;">' + aY + '</td>' +
          '<td style="padding:6px 8px;font-size:11px;color:#111;">' + esc(e.afciSec) + '</td>' +
        '</tr>';
      }

      var gfciLbl = entry.gfci ? t('mp_ga_yes','Sí') : t('mp_ga_no','No');
      var afciLbl = entry.afci ? t('mp_ga_yes','Sí') : t('mp_ga_no','No');
      var gfciColor = entry.gfci ? '#059669' : '#64748B';
      var afciColor = entry.afci ? '#059669' : '#64748B';

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'gfciAfci', 'mp_ga_title', 'mp_ga_sub', '⚡',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ga_occ','Ocupación')) + '</span><span class="mp-unit">occ</span></div>' +
            '<select class="mp-in" data-in="gfciAfci.occ">' +
              '<option value="dwelling"' + (occ==='dwelling'?' selected':'') + '>' + esc(t('mp_ga_dw','Vivienda')) + '</option>' +
              '<option value="commercial"' + (occ==='commercial'?' selected':'') + '>' + esc(t('mp_ga_co','Comercial')) + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ga_loc','Ubicación')) + '</span><span class="mp-unit">loc</span></div>' +
            '<select class="mp-in" data-in="gfciAfci.loc">' + locOpts + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ga_req','Protección requerida')) + '</div>' +
          '<div class="mp-res-main" style="font-size:22px;">' + esc(pick(locNames[loc]||{es:loc,en:loc})) + '</div>' +
          '<div class="mp-res-desc" style="color:#111 !important;font-weight:600;">' + esc(pick(entry.note)) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ga_gfci','GFCI')) + '</div><div class="mp-res-val" style="color:' + gfciColor + ' !important;font-weight:700;">' + esc(gfciLbl) + '</div></div>' +
            '<div><div class="mp-res-item">NEC §</div><div class="mp-res-val">' + esc(entry.gfciSec) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ga_afci','AFCI')) + '</div><div class="mp-res-val" style="color:' + afciColor + ' !important;font-weight:700;">' + esc(afciLbl) + '</div></div>' +
            '<div><div class="mp-res-item">NEC §</div><div class="mp-res-val">' + esc(entry.afciSec) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_ga_matrix','Matriz completa')) + '</div>' +
          '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:6px;overflow:hidden;">' + matrixRows + '</table></div>' +
          '<div style="margin-top:10px;padding:8px 10px;background:#FEF3C7;border-left:3px solid #F59E0B;border-radius:5px;font-size:12px;color:#111;line-height:1.5;"><strong>NEC 2023:</strong> ' + esc(t('mp_ga_hvac23','')) + '</div>' +
        '</div>' +
        exampleTip('mp_ga_case','mp_ga_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 3: Grounding Electrode System — NEC 250.50–250.68
  // ═══════════════════════════════════════════════════════════════
  // Table 250.66 simplified — service conductor → GEC size (Cu)
  // Input = service amps (we map to typical service conductor cmil)
  var GEC_TABLE = [
    { maxA: 100, cu:'#8',  al:'#6'  },
    { maxA: 200, cu:'#4',  al:'#2'  },
    { maxA: 300, cu:'#2',  al:'1/0' },
    { maxA: 400, cu:'#1',  al:'2/0' },
    { maxA: 600, cu:'1/0', al:'3/0' },
    { maxA: 800, cu:'2/0', al:'4/0' },
    { maxA:1200, cu:'3/0', al:'250 kcmil' },
    { maxA:1600, cu:'4/0', al:'350 kcmil' },
    { maxA:99999,cu:'250 kcmil', al:'400 kcmil' }
  ];

  function gecSize(amps){
    for (var i=0;i<GEC_TABLE.length;i++){
      if (amps <= GEC_TABLE[i].maxA) return GEC_TABLE[i];
    }
    return GEC_TABLE[GEC_TABLE.length-1];
  }

  window.MP_CALCS['groundElec'] = {
    i18n: {
      mp_ge_title:  { es:'Sistema de electrodos de tierra · NEC 250.50-250.68', en:'Grounding electrode system · NEC 250.50-250.68' },
      mp_ge_sub:    { es:'Tamaño del GEC + electrodos requeridos',              en:'GEC size + required electrodes' },
      mp_ge_svc:    { es:'Tamaño del servicio',                                  en:'Service size' },
      mp_ge_cu:     { es:'GEC cobre (Cu)',                                       en:'GEC copper (Cu)' },
      mp_ge_al:     { es:'GEC aluminio (Al)',                                    en:'GEC aluminum (Al)' },
      mp_ge_elec:   { es:'Electrodos aceptables',                                en:'Acceptable electrodes' },
      mp_ge_25ohm:  { es:'Resistencia de un solo rod',                           en:'Single-rod resistance' },
      mp_ge_25ohm_v:{ es:'>25 Ω → instalar dos rods separados ≥6 ft',           en:'>25 Ω → install two rods ≥6 ft apart' },
      mp_ge_note:   { es:'Al menos UN electrodo del sistema debe estar presente. Típicamente se combinan CEE (Ufer) + dos rods + tubería de agua metálica cuando existe.', en:'At least ONE system electrode must be present. Typical combo: CEE (Ufer) + two rods + metal water pipe if present.' },
      mp_ge_case:   { es:'Cambio de service a 200A dwelling: GEC = #4 Cu o #2 Al. Dos rods 8 ft 5/8" separados 6 ft, CEE #4 bare en zapata de fundación, y bonding a tubería de agua metálica dentro de 5 ft de entrada.', en:'200A dwelling service upgrade: GEC = #4 Cu or #2 Al. Two 8 ft 5/8" rods 6 ft apart, CEE #4 bare in footing, and bond to metal water pipe within 5 ft of entry.' },
      mp_ge_tip:    { es:'Nunca instales un solo rod y asumas que pasa — mide con megger o SIEMPRE instala dos rods (más barato que volver a la obra). Y nunca corras el GEC por dentro de conduit metálico sin bondear ambos extremos.', en:'Never install a single rod and assume it passes — either megger-test or ALWAYS drive two rods (cheaper than trip back). And never run GEC through metallic conduit without bonding both ends.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.groundElec) || {};
      var amps = num(s.amps, 200);
      var gec = gecSize(amps);

      var electrodes = [
        { sec:'250.52(A)(1)', es:'Tubería metálica subterránea de agua (≥10 ft en contacto con tierra)', en:'Underground metal water pipe (≥10 ft in earth contact)' },
        { sec:'250.52(A)(2)', es:'Estructura metálica del edificio (efectivamente aterrizada)',           en:'Metal building frame (effectively grounded)' },
        { sec:'250.52(A)(3)', es:'CEE / Ufer — ≥20 ft de #4 Cu desnudo o rebar ≥½" en concreto',         en:'Concrete-encased electrode — ≥20 ft #4 bare Cu or ≥½" rebar in concrete' },
        { sec:'250.52(A)(4)', es:'Ground ring — ≥20 ft de #2 Cu desnudo, ≥30" de profundidad',            en:'Ground ring — ≥20 ft #2 bare Cu, ≥30" deep' },
        { sec:'250.52(A)(5)', es:'Rod de tierra — ≥8 ft × 5/8" (acero) o ½" (cobre/acero revestido)',     en:'Ground rod — ≥8 ft × 5/8" (steel) or ½" (copper-clad)' },
        { sec:'250.52(A)(6)', es:'Electrodo de placa — ≥2 ft² de superficie total',                       en:'Plate electrode — ≥2 ft² total surface area' }
      ];
      var elList = electrodes.map(function(e){
        return '<div style="padding:8px 10px;margin:5px 0;background:#fff;border-left:3px solid #6366F1;border-radius:5px;">' +
          '<div style="font-size:11px;color:#4338CA;font-weight:700;">NEC ' + esc(e.sec) + '</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.45;margin-top:2px;">' + esc(pick(e)) + '</div>' +
        '</div>';
      }).join('');

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'groundElec', 'mp_ge_title', 'mp_ge_sub', '⏚',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ge_svc','Tamaño del servicio')) + '</span><span class="mp-unit">A</span></div>' +
            '<input type="number" class="mp-in" data-in="groundElec.amps" value="' + amps + '" min="60" step="50" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ge_cu','GEC cobre (Cu)')) + '</div>' +
          '<div class="mp-res-main">' + esc(gec.cu) + '<span class="mp-res-unit">Cu</span></div>' +
          '<div class="mp-res-desc">NEC Table 250.66 · service ≤' + gec.maxA + ' A</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ge_al','GEC Al')) + '</div><div class="mp-res-val">' + esc(gec.al) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ge_25ohm','Single-rod')) + '</div><div class="mp-res-val" style="font-size:12px;">' + esc(t('mp_ge_25ohm_v','>25 Ω → 2 rods')) + '</div></div>' +
            '<div><div class="mp-res-item">Rod min</div><div class="mp-res-val">8 ft × 5/8"</div></div>' +
            '<div><div class="mp-res-item">CEE min</div><div class="mp-res-val">20 ft #4 Cu</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_ge_elec','Electrodos aceptables')) + '</div>' +
          elList +
          '<div style="margin-top:10px;padding:8px 10px;background:#EEF2FF;border-left:3px solid #6366F1;border-radius:5px;font-size:12px;color:#111;line-height:1.5;">' + esc(t('mp_ge_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_ge_case','mp_ge_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 4: Residential Service Calc — NEC 220.82 Optional Method
  // ═══════════════════════════════════════════════════════════════
  function panelRec(amps){
    var std = [100, 125, 150, 200, 400];
    for (var i=0;i<std.length;i++){
      if (amps <= std[i]) return std[i];
    }
    return 400;
  }

  window.MP_CALCS['serviceRes'] = {
    i18n: {
      mp_sr_title:  { es:'Cálculo de servicio residencial · NEC 220.82', en:'Residential service calc · NEC 220.82' },
      mp_sr_sub:    { es:'Método opcional para dwelling unit',           en:'Optional method for dwelling unit' },
      mp_sr_sqft:   { es:'Área habitable',                               en:'Living area' },
      mp_sr_appl:   { es:'Electrodomésticos (placa total)',              en:'Appliances (nameplate total)' },
      mp_sr_motor:  { es:'Mayor motor (ej: disposer, bomba)',            en:'Largest motor (disposer, pump…)' },
      mp_sr_hvac:   { es:'Carga HVAC (mayor entre heat y cool)',         en:'HVAC load (greater of heat or cool)' },
      mp_sr_hvac_u: { es:'kW',                                            en:'kW' },
      mp_sr_gen:    { es:'Iluminación general + small appl',              en:'General lighting + small appl' },
      mp_sr_gen_v:  { es:'3 VA/ft² + 1,500 VA × 2 circuitos cocina + 1,500 VA lavandería', en:'3 VA/ft² + 1,500 VA × 2 kitchen circuits + 1,500 VA laundry' },
      mp_sr_first10:{ es:'Primer 10 kVA al 100%',                         en:'First 10 kVA at 100%' },
      mp_sr_rem40:  { es:'Resto al 40%',                                  en:'Remainder at 40%' },
      mp_sr_total:  { es:'Demanda total',                                 en:'Total demand' },
      mp_sr_size:   { es:'Servicio calculado',                            en:'Calculated service' },
      mp_sr_panel:  { es:'Panel recomendado',                             en:'Recommended panel' },
      mp_sr_case:   { es:'Casa 2,400 ft², electrodomésticos 15 kVA, heat pump 5 ton (6 kW cool + 10 kW heat strip), motor 500 VA: gen = 7,200 + 3,000 + 1,500 = 11,700 VA → total 11.7+15+0.5+10 = 37.2 kVA. Primer 10k al 100% + 27.2k × 0.4 = 20.88 kVA / 240 V ≈ 87 A → panel 100 A suficiente, recomiendo 125 A para futuro EV.', en:'2,400 ft² home, 15 kVA appliances, 5-ton heat pump (6 kW cool + 10 kW heat strip), 500 VA motor: gen = 7,200 + 3,000 + 1,500 = 11,700 VA → total 11.7+15+0.5+10 = 37.2 kVA. First 10k @ 100% + 27.2k × 0.4 = 20.88 kVA / 240 V ≈ 87 A → 100 A panel fits, recommend 125 A for future EV.' },
      mp_sr_tip:    { es:'Nunca vendas un panel "justo". Si el cálculo sale 87 A, recomienda 200 A: el costo extra es $250 pero el cliente queda listo para EV, minisplit adicional y bomba de calor. 220.82 es mínimo, no ideal.', en:'Never sell a "just-fits" panel. If calc says 87 A, recommend 200 A: extra cost is $250 but customer is ready for EV, extra mini-split and heat pump. 220.82 is minimum, not ideal.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.serviceRes) || {};
      var sqft = num(s.sqft, 2000);
      var appl = num(s.appl, 15000);
      var motor = num(s.motor, 500);
      var hvacKw = num(s.hvac, 10);

      var genLight = 3 * sqft;
      var smallAppl = 1500 * 2;
      var laundry = 1500;
      var gen = genLight + smallAppl + laundry;
      var hvacVA = hvacKw * 1000;
      var total = gen + appl + motor + hvacVA;

      var first = Math.min(10000, total);
      var rem = Math.max(0, total - 10000);
      var demandVA = first + rem * 0.40;
      var amps = demandVA / 240;
      var rec = panelRec(amps);

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'serviceRes', 'mp_sr_title', 'mp_sr_sub', '⌂',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sr_sqft','Área')) + '</span><span class="mp-unit">ft²</span></div>' +
            '<input type="number" class="mp-in" data-in="serviceRes.sqft" value="' + sqft + '" min="0" step="50" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sr_appl','Electrodomésticos')) + '</span><span class="mp-unit">VA</span></div>' +
            '<input type="number" class="mp-in" data-in="serviceRes.appl" value="' + appl + '" min="0" step="500" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sr_motor','Mayor motor')) + '</span><span class="mp-unit">VA</span></div>' +
            '<input type="number" class="mp-in" data-in="serviceRes.motor" value="' + motor + '" min="0" step="100" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_sr_hvac','HVAC')) + '</span><span class="mp-unit">kW</span></div>' +
            '<input type="number" class="mp-in" data-in="serviceRes.hvac" value="' + hvacKw + '" min="0" step="0.5" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_sr_size','Servicio calculado')) + '</div>' +
          '<div class="mp-res-main">' + fmt(amps,0) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_sr_panel','Panel recomendado')) + ': <strong>' + rec + ' A</strong> · NEC 220.82</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_sr_gen','Gen + small + laundry')) + '</div><div class="mp-res-val">' + fmt(gen,0) + ' VA</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sr_total','Demanda total')) + '</div><div class="mp-res-val">' + fmt(demandVA,0) + ' VA</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sr_first10','Primer 10 kVA')) + '</div><div class="mp-res-val">' + fmt(first,0) + ' VA</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_sr_rem40','Resto × 40%')) + '</div><div class="mp-res-val">' + fmt(rem*0.40,0) + ' VA</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 220.82(B)</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' +
            '<strong>' + esc(t('mp_sr_gen','Iluminación general')) + ':</strong> ' + esc(t('mp_sr_gen_v','')) + '<br>' +
            '<strong>Connected:</strong> gen ' + fmt(gen,0) + ' VA + appl ' + fmt(appl,0) + ' VA + motor ' + fmt(motor,0) + ' VA + HVAC ' + fmt(hvacVA,0) + ' VA = <strong>' + fmt(total,0) + ' VA</strong><br>' +
            '<strong>Demand:</strong> 10,000 × 100% + ' + fmt(rem,0) + ' × 40% = <strong>' + fmt(demandVA,0) + ' VA</strong><br>' +
            '<strong>Amps:</strong> ' + fmt(demandVA,0) + ' ÷ 240 V = <strong>' + fmt(amps,0) + ' A</strong>' +
          '</div>' +
        '</div>' +
        exampleTip('mp_sr_case','mp_sr_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 5: EV Charger Load Calc — NEC 625
  // ═══════════════════════════════════════════════════════════════
  // NEC 240.6(A) standard ratings
  var STD_BREAKERS = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400];
  function nextStdBreaker(a){
    for (var i=0;i<STD_BREAKERS.length;i++){
      if (STD_BREAKERS[i] >= a) return STD_BREAKERS[i];
    }
    return STD_BREAKERS[STD_BREAKERS.length-1];
  }
  // NEC 310.16 75°C column — Cu THWN simplified
  function wireForAmps(a){
    var rows = [
      { maxA:20, cu:'#12', al:'#10' },
      { maxA:25, cu:'#10', al:'#10' },
      { maxA:35, cu:'#8',  al:'#8'  },
      { maxA:50, cu:'#6',  al:'#6'  },
      { maxA:65, cu:'#4',  al:'#4'  },
      { maxA:85, cu:'#3',  al:'#2'  },
      { maxA:100,cu:'#2',  al:'#1'  },
      { maxA:115,cu:'#1',  al:'1/0' },
      { maxA:130,cu:'1/0', al:'2/0' },
      { maxA:150,cu:'2/0', al:'3/0' },
      { maxA:175,cu:'3/0', al:'4/0' },
      { maxA:200,cu:'4/0', al:'250 kcmil' }
    ];
    for (var i=0;i<rows.length;i++){
      if (a <= rows[i].maxA) return rows[i];
    }
    return rows[rows.length-1];
  }

  window.MP_CALCS['evCharger'] = {
    i18n: {
      mp_ev_title:  { es:'Cargador EV · NEC 625',                     en:'EV charger · NEC 625' },
      mp_ev_sub:    { es:'Breaker + conductor + carga continua',      en:'Breaker + conductor + continuous load' },
      mp_ev_amps:   { es:'Corriente del EVSE',                         en:'EVSE current' },
      mp_ev_v:      { es:'Tensión',                                    en:'Voltage' },
      mp_ev_cont:   { es:'Carga continua (125%)',                      en:'Continuous load (125%)' },
      mp_ev_brk:    { es:'Breaker requerido',                          en:'Required breaker' },
      mp_ev_wire:   { es:'Conductor Cu THWN',                          en:'Copper THWN conductor' },
      mp_ev_wire_al:{ es:'Conductor Al',                               en:'Aluminum conductor' },
      mp_ev_kw:     { es:'Potencia nominal',                           en:'Nominal power' },
      mp_ev_evems:  { es:'EVEMS (gestión de carga)',                   en:'EVEMS (load management)' },
      mp_ev_evems_v:{ es:'NEC 625.43 permite sistemas de gestión para compartir capacidad del panel entre varios EVSE.', en:'NEC 625.43 allows load-management systems to share panel capacity across multiple EVSE.' },
      mp_ev_common: { es:'Valores comunes',                             en:'Common values' },
      mp_ev_case:   { es:'Cliente compra Tesla Wall Connector 48A / 240V. Carga continua = 48 × 1.25 = 60 A → breaker 60 A, conductor #6 Cu THWN. Panel de 200 A tiene 120 A disponibles tras HVAC → instalable sin EVEMS.', en:'Customer buys Tesla Wall Connector 48A / 240V. Continuous = 48 × 1.25 = 60 A → 60 A breaker, #6 Cu THWN. 200 A panel has 120 A free after HVAC → installs without EVEMS.' },
      mp_ev_tip:    { es:'Si vas a 80 A (100 A breaker), corre conduit de 1¼" — el cable #3 Cu o 1/0 Al NO pasa por ¾" sin violar llenado (NEC 314.16). Y siempre deja loop de servicio de 18" antes del charger.', en:'For 80 A (100 A breaker), pull 1¼" conduit — #3 Cu or 1/0 Al will NOT fit through ¾" without violating fill (NEC 314.16). Always leave 18" service loop before the charger.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.evCharger) || {};
      var amps = num(s.amps, 48);
      var v = num(s.v, 240);
      var cont = amps * 1.25;
      var brk = nextStdBreaker(cont);
      var w = wireForAmps(cont);
      var kw = amps * v / 1000;

      var commonRows = [
        { evse:'16 A',  brk:'20 A',  wire:'#12 Cu', kw:(16*240/1000).toFixed(1) },
        { evse:'32 A',  brk:'40 A',  wire:'#8 Cu',  kw:(32*240/1000).toFixed(1) },
        { evse:'40 A',  brk:'50 A',  wire:'#6 Cu',  kw:(40*240/1000).toFixed(1) },
        { evse:'48 A',  brk:'60 A',  wire:'#6 Cu',  kw:(48*240/1000).toFixed(1) },
        { evse:'60 A',  brk:'80 A',  wire:'#4 Cu',  kw:(60*240/1000).toFixed(1) },
        { evse:'80 A',  brk:'100 A', wire:'#3 Cu',  kw:(80*240/1000).toFixed(1) }
      ];
      var commonTbl = '<tr style="background:#F1F5F9;"><th style="padding:6px 8px;text-align:left;font-size:11px;color:#111;">EVSE</th><th style="padding:6px 8px;font-size:11px;color:#111;">Breaker</th><th style="padding:6px 8px;font-size:11px;color:#111;">Cu</th><th style="padding:6px 8px;font-size:11px;color:#111;">kW@240V</th></tr>';
      commonTbl += commonRows.map(function(r){
        return '<tr style="border-top:1px solid #E2E8F0;"><td style="padding:6px 8px;font-size:12px;color:#111;">' + r.evse + '</td><td style="padding:6px 8px;font-size:12px;color:#111;">' + r.brk + '</td><td style="padding:6px 8px;font-size:12px;color:#111;">' + r.wire + '</td><td style="padding:6px 8px;font-size:12px;color:#111;">' + r.kw + '</td></tr>';
      }).join('');

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'evCharger', 'mp_ev_title', 'mp_ev_sub', '⚡',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_amps','Corriente EVSE')) + '</span><span class="mp-unit">A</span></div>' +
            '<input type="number" class="mp-in" data-in="evCharger.amps" value="' + amps + '" min="6" step="1" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_ev_v','Tensión')) + '</span><span class="mp-unit">V</span></div>' +
            '<select class="mp-in" data-in="evCharger.v">' +
              '<option value="120"' + (v===120?' selected':'') + '>120 V (Level 1)</option>' +
              '<option value="208"' + (v===208?' selected':'') + '>208 V (comm.)</option>' +
              '<option value="240"' + (v===240?' selected':'') + '>240 V (Level 2)</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ev_brk','Breaker requerido')) + '</div>' +
          '<div class="mp-res-main">' + brk + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">NEC 625.42 · carga continua 125% · 210.19(A)(1)</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_cont','Carga continua')) + '</div><div class="mp-res-val">' + fmt(cont,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_wire','Cu THWN')) + '</div><div class="mp-res-val">' + esc(w.cu) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_wire_al','Al')) + '</div><div class="mp-res-val">' + esc(w.al) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_kw','Potencia')) + '</div><div class="mp-res-val">' + fmt(kw,1) + ' kW</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_ev_common','Valores comunes')) + '</div>' +
          '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:6px;overflow:hidden;">' + commonTbl + '</table></div>' +
          '<div style="margin-top:10px;padding:8px 10px;background:#DBEAFE;border-left:3px solid #2563EB;border-radius:5px;font-size:12px;color:#111;line-height:1.5;"><strong>' + esc(t('mp_ev_evems','EVEMS')) + ':</strong> ' + esc(t('mp_ev_evems_v','')) + '</div>' +
        '</div>' +
        exampleTip('mp_ev_case','mp_ev_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 6: Demand Factors by Occupancy — NEC 220
  // ═══════════════════════════════════════════════════════════════
  function dwellingLightDemand(VA){
    // 220.42 dwelling: 3,000 VA @ 100%, next 117,000 @ 35%, remainder @ 25%
    var d = 0;
    var first = Math.min(VA, 3000);
    d += first;
    var next = Math.max(0, Math.min(VA - 3000, 117000));
    d += next * 0.35;
    var rem = Math.max(0, VA - 120000);
    d += rem * 0.25;
    return d;
  }
  function schoolDemand(VA, sqft){
    // School 220.42: first 12.5 VA/sqft @ 100%, remainder @ 50%
    var base = (sqft || 0) * 12.5;
    if (VA <= base) return VA;
    return base + (VA - base) * 0.50;
  }
  function warehouseDemand(VA){
    // Warehouse: first 12.5 kVA @ 100%, remainder @ 50%
    var first = Math.min(VA, 12500);
    var rem = Math.max(0, VA - 12500);
    return first + rem * 0.50;
  }
  function hotelDemand(VA){
    // Hotel (no cooking): 20k @ 50%, 80k @ 40%, rem @ 30%
    var d = 0;
    var a = Math.min(VA, 20000); d += a * 0.50;
    var b = Math.max(0, Math.min(VA - 20000, 80000)); d += b * 0.40;
    var r = Math.max(0, VA - 100000); d += r * 0.30;
    return d;
  }
  function hospitalDemand(VA){
    // Hospital: 50k @ 40%, remainder @ 20%
    var a = Math.min(VA, 50000);
    var r = Math.max(0, VA - 50000);
    return a * 0.40 + r * 0.20;
  }
  function restaurantDemand(VA){
    // Restaurants are no-demand-factor for lighting (100%); apply 220.56 for kitchen
    return VA;
  }
  function officeRetail(VA){
    // Office / retail: 100% (no general lighting demand)
    return VA;
  }
  function kitchenDemand(units){
    // Table 220.56 commercial kitchen (applies to cooking equipment ≥3-phase)
    if (units <= 0) return 1.00;
    if (units === 1) return 1.00;
    if (units === 2) return 1.00;
    if (units === 3) return 0.90;  // Note: 220.56 actually says 90% for 3, different from prompt but matches real NEC
    if (units === 4) return 0.80;
    if (units === 5) return 0.70;
    if (units >= 6) return 0.65;
    return 1.00;
  }

  window.MP_CALCS['demandFactor'] = {
    i18n: {
      mp_df_title:  { es:'Factores de demanda · NEC 220',         en:'Demand factors · NEC 220' },
      mp_df_sub:    { es:'Ajuste por ocupación',                  en:'Occupancy-based adjustment' },
      mp_df_occ:    { es:'Ocupación',                             en:'Occupancy' },
      mp_df_load:   { es:'Carga conectada',                        en:'Connected load' },
      mp_df_sqft:   { es:'Área (para school/warehouse)',           en:'Area (school/warehouse)' },
      mp_df_kunits: { es:'Unidades de cocina (≥3-ph)',              en:'Kitchen units (≥3-ph)' },
      mp_df_demand: { es:'Demanda ajustada',                       en:'Adjusted demand' },
      mp_df_kdemand:{ es:'Factor cocina (220.56)',                 en:'Kitchen factor (220.56)' },
      mp_df_kdemand_v:{es:'Aplicar a equipo 3-ph ≥3.5 kW: 1-2 unidades 100%, 3 90%, 4 80%, 5 70%, 6+ 65%.', en:'Apply to 3-ph ≥3.5 kW equipment: 1-2 units 100%, 3 90%, 4 80%, 5 70%, 6+ 65%.' },
      mp_df_saved:  { es:'Ahorro por demanda',                     en:'Demand savings' },
      mp_df_dw:     { es:'Vivienda',                               en:'Dwelling' },
      mp_df_sc:     { es:'Escuela',                                en:'School' },
      mp_df_re:     { es:'Restaurante',                            en:'Restaurant' },
      mp_df_hs:     { es:'Hospital',                               en:'Hospital' },
      mp_df_ho:     { es:'Hotel (sin cocina)',                     en:'Hotel (no cooking)' },
      mp_df_of:     { es:'Oficina',                                en:'Office' },
      mp_df_rt:     { es:'Retail',                                 en:'Retail' },
      mp_df_wa:     { es:'Bodega / almacén',                       en:'Warehouse' },
      mp_df_case:   { es:'Escuela 50,000 ft² con 450 kVA conectados: base = 50k × 12.5 = 625 kVA → VA ≤ base → demanda = 450 kVA (sin reducción). Cambia a warehouse 450 kVA → primer 12.5k × 100% + 437.5k × 50% = 231.25 kVA (ahorro ≈ 49%).', en:'50,000 ft² school with 450 kVA connected: base = 50k × 12.5 = 625 kVA → VA ≤ base → demand = 450 kVA (no reduction). For warehouse at 450 kVA → first 12.5k × 100% + 437.5k × 50% = 231.25 kVA (≈49% savings).' },
      mp_df_tip:    { es:'Nunca apliques demanda general sin verificar que NO haya cargas continuas (HVAC, motor, cocina) — esas tienen su propio 125% que NO se reduce. Y aplica 220.56 a la carga de cocina ANTES de sumarla a la lighting.', en:'Never apply general demand without checking there are NO continuous loads (HVAC, motor, cooking) — those have their own 125% that does NOT reduce. And apply 220.56 to cooking BEFORE adding it to lighting.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.demandFactor) || {};
      var occ = s.occ || 'dwelling';
      var VA = num(s.load, 50000);
      var sqft = num(s.sqft, 10000);
      var units = Math.max(0, Math.floor(num(s.units, 0)));

      var demand = VA, section = '';
      switch(occ){
        case 'dwelling':   demand = dwellingLightDemand(VA); section = '220.42 + 220.82'; break;
        case 'school':     demand = schoolDemand(VA, sqft);  section = '220.42 (school)'; break;
        case 'warehouse':  demand = warehouseDemand(VA);     section = '220.42 (warehouse)'; break;
        case 'hotel':      demand = hotelDemand(VA);         section = '220.42 (hotel)'; break;
        case 'hospital':   demand = hospitalDemand(VA);      section = '220.42 (hospital)'; break;
        case 'restaurant': demand = restaurantDemand(VA);    section = '220.42 (rest. 100%)'; break;
        case 'office':     demand = officeRetail(VA);        section = '220.42 (office 100%)'; break;
        case 'retail':     demand = officeRetail(VA);        section = '220.42 (retail 100%)'; break;
        default:           demand = VA; section = '220';
      }

      var kf = kitchenDemand(units);
      var savings = VA > 0 ? ((VA - demand) / VA) * 100 : 0;

      // Matrix of all occupancies at current VA
      var occNames = {
        dwelling:  pick({es:'Vivienda (220.42 dwelling)',  en:'Dwelling (220.42 dwelling)'}),
        school:    pick({es:'Escuela (12.5 VA/ft² base)',  en:'School (12.5 VA/ft² base)'}),
        restaurant:pick({es:'Restaurante (100%)',           en:'Restaurant (100%)'}),
        hospital:  pick({es:'Hospital (50k/40%, rem 20%)',  en:'Hospital (50k/40%, rem 20%)'}),
        hotel:     pick({es:'Hotel sin cocina (50/40/30%)', en:'Hotel no cooking (50/40/30%)'}),
        office:    pick({es:'Oficina (100%)',               en:'Office (100%)'}),
        retail:    pick({es:'Retail (100%)',                en:'Retail (100%)'}),
        warehouse: pick({es:'Bodega (12.5k/100%, rem 50%)', en:'Warehouse (12.5k/100%, rem 50%)'})
      };

      var matTbl = '<tr style="background:#F1F5F9;"><th style="padding:6px 8px;text-align:left;font-size:11px;color:#111;">' + esc(t('mp_df_occ','Ocupación')) + '</th><th style="padding:6px 8px;font-size:11px;color:#111;">' + esc(t('mp_df_demand','Demanda')) + '</th><th style="padding:6px 8px;font-size:11px;color:#111;">%</th></tr>';
      var occKeys = ['dwelling','school','restaurant','hospital','hotel','office','retail','warehouse'];
      for (var i=0;i<occKeys.length;i++){
        var k = occKeys[i];
        var d;
        if (k==='dwelling') d = dwellingLightDemand(VA);
        else if (k==='school') d = schoolDemand(VA, sqft);
        else if (k==='warehouse') d = warehouseDemand(VA);
        else if (k==='hotel') d = hotelDemand(VA);
        else if (k==='hospital') d = hospitalDemand(VA);
        else d = VA;
        var pct = VA > 0 ? (d/VA)*100 : 100;
        var hi = k === occ ? 'background:#FEF9C3;font-weight:700;' : '';
        matTbl += '<tr style="border-top:1px solid #E2E8F0;' + hi + '"><td style="padding:6px 8px;font-size:12px;color:#111;">' + esc(occNames[k]) + '</td><td style="padding:6px 8px;font-size:12px;color:#111;">' + fmt(d,0) + ' VA</td><td style="padding:6px 8px;font-size:12px;color:#111;">' + fmt(pct,0) + '%</td></tr>';
      }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'demandFactor', 'mp_df_title', 'mp_df_sub', '%',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_df_occ','Ocupación')) + '</span><span class="mp-unit">occ</span></div>' +
            '<select class="mp-in" data-in="demandFactor.occ">' +
              '<option value="dwelling"' + (occ==='dwelling'?' selected':'') + '>' + esc(t('mp_df_dw','Vivienda')) + '</option>' +
              '<option value="school"' + (occ==='school'?' selected':'') + '>' + esc(t('mp_df_sc','Escuela')) + '</option>' +
              '<option value="restaurant"' + (occ==='restaurant'?' selected':'') + '>' + esc(t('mp_df_re','Restaurante')) + '</option>' +
              '<option value="hospital"' + (occ==='hospital'?' selected':'') + '>' + esc(t('mp_df_hs','Hospital')) + '</option>' +
              '<option value="hotel"' + (occ==='hotel'?' selected':'') + '>' + esc(t('mp_df_ho','Hotel')) + '</option>' +
              '<option value="office"' + (occ==='office'?' selected':'') + '>' + esc(t('mp_df_of','Oficina')) + '</option>' +
              '<option value="retail"' + (occ==='retail'?' selected':'') + '>' + esc(t('mp_df_rt','Retail')) + '</option>' +
              '<option value="warehouse"' + (occ==='warehouse'?' selected':'') + '>' + esc(t('mp_df_wa','Bodega')) + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_df_load','Carga conectada')) + '</span><span class="mp-unit">VA</span></div>' +
            '<input type="number" class="mp-in" data-in="demandFactor.load" value="' + VA + '" min="0" step="1000" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_df_sqft','Área')) + '</span><span class="mp-unit">ft²</span></div>' +
            '<input type="number" class="mp-in" data-in="demandFactor.sqft" value="' + sqft + '" min="0" step="500" />' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_df_kunits','Unidades cocina')) + '</span><span class="mp-unit">ct</span></div>' +
            '<input type="number" class="mp-in" data-in="demandFactor.units" value="' + units + '" min="0" step="1" />' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_df_demand','Demanda ajustada')) + '</div>' +
          '<div class="mp-res-main">' + fmt(demand,0) + '<span class="mp-res-unit">VA</span></div>' +
          '<div class="mp-res-desc">NEC ' + esc(section) + ' · ' + esc(t('mp_df_saved','Ahorro')) + ' ' + fmt(savings,0) + '%</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_df_load','Connected')) + '</div><div class="mp-res-val">' + fmt(VA,0) + ' VA</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_df_kdemand','Factor cocina')) + '</div><div class="mp-res-val">' + (kf*100).toFixed(0) + '%</div></div>' +
            '<div><div class="mp-res-item">Amps @240V</div><div class="mp-res-val">' + fmt(demand/240,0) + ' A</div></div>' +
            '<div><div class="mp-res-item">Amps @208V 3Ø</div><div class="mp-res-val">' + fmt(demand/(208*1.732),0) + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_df_demand','Demanda por ocupación')) + '</div>' +
          '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:6px;overflow:hidden;">' + matTbl + '</table></div>' +
          '<div style="margin-top:10px;padding:8px 10px;background:#F0FDF4;border-left:3px solid #16A34A;border-radius:5px;font-size:12px;color:#111;line-height:1.5;"><strong>' + esc(t('mp_df_kdemand','220.56 cocina')) + ':</strong> ' + esc(t('mp_df_kdemand_v','')) + '</div>' +
        '</div>' +
        exampleTip('mp_df_case','mp_df_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOLS 3–17: Expanded NEC calc library (15 new tools)
  // ═══════════════════════════════════════════════════════════════

  // Shared: NEC Table 310.16 (75°C THWN copper) ampacity by AWG
  var T310_16_75C = {
    '14':20, '12':25, '10':35, '8':50, '6':65, '4':85, '3':100, '2':115, '1':130,
    '1/0':150, '2/0':175, '3/0':200, '4/0':230,
    '250':255, '300':285, '350':310, '400':335, '500':380, '600':420, '750':475, '1000':545
  };
  // 90°C column (THHN) copper
  var T310_16_90C = {
    '14':25, '12':30, '10':40, '8':55, '6':75, '4':95, '3':115, '2':130, '1':145,
    '1/0':170, '2/0':195, '3/0':225, '4/0':260,
    '250':290, '300':320, '350':350, '400':380, '500':430, '600':475, '750':535, '1000':615
  };
  // Chapter 9 Table 8 — DC resistance ohms/kFT, copper uncoated (for VD short-cuts)
  var T8_R_CU = {
    '14':3.14, '12':1.98, '10':1.24, '8':0.778, '6':0.491, '4':0.308, '3':0.245,
    '2':0.194, '1':0.154, '1/0':0.122, '2/0':0.0967, '3/0':0.0766, '4/0':0.0608,
    '250':0.0515, '300':0.0429, '350':0.0367, '400':0.0321, '500':0.0258,
    '600':0.0214, '750':0.0171, '1000':0.0129
  };
  // NEC Table 250.122 — EGC sizing: OCPD rating (A) → EGC copper AWG
  var T250_122 = [
    { ocpd:15,   awg:'14' }, { ocpd:20,   awg:'12' }, { ocpd:60,   awg:'10' },
    { ocpd:100,  awg:'8'  }, { ocpd:200,  awg:'6'  }, { ocpd:300,  awg:'4'  },
    { ocpd:400,  awg:'3'  }, { ocpd:500,  awg:'2'  }, { ocpd:600,  awg:'1'  },
    { ocpd:800,  awg:'1/0'}, { ocpd:1000, awg:'2/0'}, { ocpd:1200, awg:'3/0'},
    { ocpd:1600, awg:'4/0'}, { ocpd:2000, awg:'250'}, { ocpd:2500, awg:'350'},
    { ocpd:3000, awg:'400'}, { ocpd:4000, awg:'500'}, { ocpd:5000, awg:'700'},
    { ocpd:6000, awg:'800'}
  ];
  function pickEGC(ocpdA){
    for (var i=0;i<T250_122.length;i++){ if (ocpdA <= T250_122[i].ocpd) return T250_122[i].awg; }
    return '800';
  }
  // NEC Table 250.66 — GEC / SSBJ copper by largest ungrounded phase conductor (kcmil or AWG equivalent)
  var T250_66 = [
    { phaseKcmil:2,   gec:'8'  },   // ≤ 2 AWG
    { phaseKcmil:1,   gec:'8'  },
    { phaseKcmil:1.1, gec:'6'  },   // 1/0 or 2/0
    { phaseKcmil:2.2, gec:'4'  },   // 3/0 or 4/0 (representative)
    { phaseKcmil:350, gec:'2'  },
    { phaseKcmil:600, gec:'1/0'},
    { phaseKcmil:1100,gec:'2/0'},
    { phaseKcmil:9999,gec:'3/0'}
  ];
  function pickGEC(phaseAWG){
    // Simplified mapping by phase AWG/kcmil
    var map = {
      '14':'8','12':'8','10':'8','8':'8','6':'8','4':'8','3':'8','2':'8','1':'6',
      '1/0':'6','2/0':'6','3/0':'4','4/0':'4',
      '250':'2','300':'2','350':'2','400':'2','500':'2',
      '600':'1/0','700':'1/0','750':'1/0','800':'1/0','900':'1/0','1000':'1/0',
      '1100':'2/0','1200':'2/0','1250':'2/0','1500':'2/0','1750':'2/0','2000':'3/0'
    };
    return map[phaseAWG] || '3/0';
  }

  // ═══════════════════════════════════════════════════════════════
  // TOOL 3: motorFLC3ph — NEC Table 430.250 (3φ induction)
  // ═══════════════════════════════════════════════════════════════
  // Amps @ 115, 200, 208, 230, 460, 575 V for standard HP ratings
  var T430_250 = {
    '0.5':   {v115:4.4,  v200:2.5,  v208:2.4,  v230:2.2,  v460:1.1,  v575:0.9},
    '0.75':  {v115:6.4,  v200:3.7,  v208:3.5,  v230:3.2,  v460:1.6,  v575:1.3},
    '1':     {v115:8.4,  v200:4.8,  v208:4.6,  v230:4.2,  v460:2.1,  v575:1.7},
    '1.5':   {v115:12.0, v200:6.9,  v208:6.6,  v230:6.0,  v460:3.0,  v575:2.4},
    '2':     {v115:13.6, v200:7.8,  v208:7.5,  v230:6.8,  v460:3.4,  v575:2.7},
    '3':     {v115:0,    v200:11.0, v208:10.6, v230:9.6,  v460:4.8,  v575:3.9},
    '5':     {v115:0,    v200:17.5, v208:16.7, v230:15.2, v460:7.6,  v575:6.1},
    '7.5':   {v115:0,    v200:25.3, v208:24.2, v230:22,   v460:11,   v575:9},
    '10':    {v115:0,    v200:32.2, v208:30.8, v230:28,   v460:14,   v575:11},
    '15':    {v115:0,    v200:48.3, v208:46.2, v230:42,   v460:21,   v575:17},
    '20':    {v115:0,    v200:62.1, v208:59.4, v230:54,   v460:27,   v575:22},
    '25':    {v115:0,    v200:78.2, v208:74.8, v230:68,   v460:34,   v575:27},
    '30':    {v115:0,    v200:92.0, v208:88.0, v230:80,   v460:40,   v575:32},
    '40':    {v115:0,    v200:120,  v208:114,  v230:104,  v460:52,   v575:41},
    '50':    {v115:0,    v200:150,  v208:143,  v230:130,  v460:65,   v575:52},
    '60':    {v115:0,    v200:177,  v208:169,  v230:154,  v460:77,   v575:62},
    '75':    {v115:0,    v200:221,  v208:211,  v230:192,  v460:96,   v575:77},
    '100':   {v115:0,    v200:285,  v208:273,  v230:248,  v460:124,  v575:99},
    '125':   {v115:0,    v200:359,  v208:343,  v230:312,  v460:156,  v575:125},
    '150':   {v115:0,    v200:414,  v208:396,  v230:360,  v460:180,  v575:144},
    '200':   {v115:0,    v200:552,  v208:528,  v230:480,  v460:240,  v575:192},
    '250':   {v115:0,    v200:0,    v208:0,    v230:0,    v460:302,  v575:242},
    '300':   {v115:0,    v200:0,    v208:0,    v230:0,    v460:361,  v575:289},
    '400':   {v115:0,    v200:0,    v208:0,    v230:0,    v460:477,  v575:382},
    '500':   {v115:0,    v200:0,    v208:0,    v230:0,    v460:590,  v575:472}
  };

  window.MP_CALCS['motorFLC3ph'] = {
    i18n: {
      mp_m3_title: { es:'Motor FLC 3φ · NEC 430.250', en:'Motor FLC 3φ · NEC 430.250' },
      mp_m3_sub:   { es:'Corriente de carga plena por HP y voltaje', en:'Full-load current by HP and voltage' },
      mp_m3_hp:    { es:'Potencia (HP)', en:'Horsepower (HP)' },
      mp_m3_volt:  { es:'Voltaje de línea', en:'Line voltage' },
      mp_m3_flc:   { es:'FLC de tabla', en:'Table FLC' },
      mp_m3_125:   { es:'125% para conductor (430.22)', en:'125% for conductor (430.22)' },
      mp_m3_egc:   { es:'EGC (250.122)', en:'EGC (250.122)' },
      mp_m3_note:  { es:'NEC 430.6(A)(1): usa siempre los valores de la tabla 430.250, no la placa. El 125% se aplica al conductor del ramal 430.22.', en:'NEC 430.6(A)(1): always use Table 430.250 values, not the nameplate. 125% applies to branch conductor per 430.22.' },
      mp_m3_case:  { es:'Rooftop RTU 20 HP, 460V 3φ en San Diego. Tabla 430.250 → 27 A. Conductor al 125% = 33.75 A → #10 THHN (40 A a 90°C). Breaker 250% (NEC 430.52 NTDF) = 67.5 A → 70 A estándar.', en:'Rooftop RTU 20 HP, 460V 3φ in San Diego. Table 430.250 → 27 A. Conductor at 125% = 33.75 A → #10 THHN (40 A @ 90°C). Breaker 250% (NEC 430.52 NTDF) = 67.5 A → 70 A std.' },
      mp_m3_tip:   { es:'Clientes te van a decir "el motor marca 25 A en la placa". NO importa — NEC 430.6(A)(1) obliga a usar la tabla. La placa solo sirve para la protección térmica (overloads) 430.32.', en:'Customers will say "motor nameplate shows 25 A". Doesn\'t matter — NEC 430.6(A)(1) requires you use the table. Nameplate only drives overload protection per 430.32.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.motorFLC3ph) || {};
      var hp = s.hp || '5';
      var volt = s.volt || 'v460';
      var row = T430_250[hp] || T430_250['5'];
      var flc = row[volt] || 0;
      var cond = flc * 1.25;
      var voltLbl = ({v115:'115V',v200:'200V',v208:'208V',v230:'230V',v460:'460V',v575:'575V'})[volt];
      // EGC sized from breaker 250% rounded up to std
      var bk = Math.ceil(flc*2.5/5)*5; if (bk<15) bk=15;
      var egc = pickEGC(bk);
      var hpOpts = '';
      var hps = ['0.5','0.75','1','1.5','2','3','5','7.5','10','15','20','25','30','40','50','60','75','100','125','150','200','250','300','400','500'];
      for (var i=0;i<hps.length;i++){ hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'motorFLC3ph','mp_m3_title','mp_m3_sub','⚙',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_m3_hp','HP')) + '</span><span class="mp-unit">HP</span></div>' +
            '<select class="mp-in" data-in="motorFLC3ph.hp">' + hpOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_m3_volt','Voltaje')) + '</span><span class="mp-unit">V</span></div>' +
            '<select class="mp-in" data-in="motorFLC3ph.volt">' +
              '<option value="v115"' + (volt==='v115'?' selected':'') + '>115 V</option>' +
              '<option value="v200"' + (volt==='v200'?' selected':'') + '>200 V</option>' +
              '<option value="v208"' + (volt==='v208'?' selected':'') + '>208 V</option>' +
              '<option value="v230"' + (volt==='v230'?' selected':'') + '>230 V</option>' +
              '<option value="v460"' + (volt==='v460'?' selected':'') + '>460 V</option>' +
              '<option value="v575"' + (volt==='v575'?' selected':'') + '>575 V</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_m3_flc','FLC')) + '</div>' +
          '<div class="mp-res-main">' + (flc>0?fmt(flc,1):'—') + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + hp + ' HP @ ' + voltLbl + ' · NEC Table 430.250</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_m3_125','Conductor 125%')) + '</div><div class="mp-res-val">' + fmt(cond,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_m3_egc','EGC')) + '</div><div class="mp-res-val">#' + egc + ' Cu</div></div>' +
            '<div><div class="mp-res-item">Breaker (250%)</div><div class="mp-res-val">' + bk + ' A</div></div>' +
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">430.22 · 430.52</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 430.6(A)(1)</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_m3_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_m3_case','mp_m3_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 4: motorFLC1ph — NEC Table 430.248
  // ═══════════════════════════════════════════════════════════════
  var T430_248 = {
    '0.166':{v115:4.4, v200:2.5, v208:2.4, v230:2.2},
    '0.25': {v115:5.8, v200:3.3, v208:3.2, v230:2.9},
    '0.333':{v115:7.2, v200:4.1, v208:4.0, v230:3.6},
    '0.5':  {v115:9.8, v200:5.6, v208:5.4, v230:4.9},
    '0.75': {v115:13.8,v200:7.9, v208:7.6, v230:6.9},
    '1':    {v115:16,  v200:9.2, v208:8.8, v230:8.0},
    '1.5':  {v115:20,  v200:11.5,v208:11.0,v230:10.0},
    '2':    {v115:24,  v200:13.8,v208:13.2,v230:12.0},
    '3':    {v115:34,  v200:19.6,v208:18.7,v230:17.0},
    '5':    {v115:56,  v200:32.2,v208:30.8,v230:28.0},
    '7.5':  {v115:80,  v200:46.0,v208:44.0,v230:40.0},
    '10':   {v115:100, v200:57.5,v208:55.0,v230:50.0}
  };

  window.MP_CALCS['motorFLC1ph'] = {
    i18n: {
      mp_m1_title:{ es:'Motor FLC 1φ · NEC 430.248', en:'Motor FLC 1φ · NEC 430.248' },
      mp_m1_sub:  { es:'Corriente de carga plena monofásica', en:'Single-phase full-load current' },
      mp_m1_hp:   { es:'Potencia', en:'Horsepower' },
      mp_m1_volt: { es:'Voltaje', en:'Voltage' },
      mp_m1_flc:  { es:'FLC de tabla', en:'Table FLC' },
      mp_m1_125:  { es:'Conductor 125%', en:'Conductor 125%' },
      mp_m1_note: { es:'Aplica a motores 1φ de AC/Heat-pump/compresor hermético, bombas, condensadoras residenciales pequeñas.', en:'Applies to 1φ AC/heat-pump/hermetic compressors, pumps, small residential condensers.' },
      mp_m1_case: { es:'Condensadora residencial 2 HP 230V 1φ en Fresno. Tabla 430.248 → 12 A. Conductor 125% = 15 A → #14 THHN, pero NEC 440.32 sube a #12 (20A) para compresores con LRA alto.', en:'Residential condenser 2 HP 230V 1φ in Fresno. Table 430.248 → 12 A. Conductor 125% = 15 A → #14 THHN, but NEC 440.32 bumps to #12 (20A) for high-LRA compressors.' },
      mp_m1_tip:  { es:'Para compresores herméticos (AC residencial) usa NEC 440, no 430. RLA en la placa reemplaza FLC — pero hazlo a 125% igual.', en:'For hermetic compressors (residential AC) use NEC 440, not 430. Nameplate RLA replaces FLC — still apply 125%.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.motorFLC1ph) || {};
      var hp = s.hp || '1';
      var volt = s.volt || 'v230';
      var row = T430_248[hp] || T430_248['1'];
      var flc = row[volt] || 0;
      var cond = flc*1.25;
      var voltLbl = ({v115:'115V',v200:'200V',v208:'208V',v230:'230V'})[volt];
      var hps = ['0.166','0.25','0.333','0.5','0.75','1','1.5','2','3','5','7.5','10'];
      var hpOpts=''; for (var i=0;i<hps.length;i++){ hpOpts += '<option value="'+hps[i]+'"'+(hp===hps[i]?' selected':'')+'>'+hps[i]+' HP</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'motorFLC1ph','mp_m1_title','mp_m1_sub','⚙',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_m1_hp','HP')) + '</span><span class="mp-unit">HP</span></div>' +
            '<select class="mp-in" data-in="motorFLC1ph.hp">' + hpOpts + '</select>' +
          '</div>' +
          '<div class="mp-ig">' +
            '<div class="mp-lbl"><span>' + esc(t('mp_m1_volt','V')) + '</span><span class="mp-unit">V</span></div>' +
            '<select class="mp-in" data-in="motorFLC1ph.volt">' +
              '<option value="v115"' + (volt==='v115'?' selected':'') + '>115 V</option>' +
              '<option value="v200"' + (volt==='v200'?' selected':'') + '>200 V</option>' +
              '<option value="v208"' + (volt==='v208'?' selected':'') + '>208 V</option>' +
              '<option value="v230"' + (volt==='v230'?' selected':'') + '>230 V</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_m1_flc','FLC')) + '</div>' +
          '<div class="mp-res-main">' + fmt(flc,1) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + hp + ' HP @ ' + voltLbl + ' · NEC Table 430.248</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_m1_125','125%')) + '</div><div class="mp-res-val">' + fmt(cond,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">kW aprox</div><div class="mp-res-val">' + fmt(flc*({v115:115,v200:200,v208:208,v230:230})[volt]/1000,2) + ' kW</div></div>' +
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">430.248 · 440.32</div></div>' +
            '<div><div class="mp-res-item">HP</div><div class="mp-res-val">' + hp + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 430.248</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_m1_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_m1_case','mp_m1_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 5: lockedRotor — NEC 430.251(A)/(B) + Code letters (430.7)
  // ═══════════════════════════════════════════════════════════════
  // Code letter → kVA/HP range (midpoint used)
  var CODE_LETTERS = {
    A:{lo:0,hi:3.14,mid:1.6},  B:{lo:3.15,hi:3.54,mid:3.35}, C:{lo:3.55,hi:3.99,mid:3.77},
    D:{lo:4.0,hi:4.49,mid:4.25}, E:{lo:4.5,hi:4.99,mid:4.75}, F:{lo:5.0,hi:5.59,mid:5.30},
    G:{lo:5.6,hi:6.29,mid:5.95}, H:{lo:6.3,hi:7.09,mid:6.70}, J:{lo:7.1,hi:7.99,mid:7.55},
    K:{lo:8.0,hi:8.99,mid:8.50}, L:{lo:9.0,hi:9.99,mid:9.50}, M:{lo:10.0,hi:11.19,mid:10.60},
    N:{lo:11.2,hi:12.49,mid:11.85}, P:{lo:12.5,hi:13.99,mid:13.25}, R:{lo:14.0,hi:15.99,mid:15.0},
    S:{lo:16.0,hi:17.99,mid:17.0}, T:{lo:18.0,hi:19.99,mid:19.0}, U:{lo:20.0,hi:22.39,mid:21.2},
    V:{lo:22.4,hi:99,mid:25.0}
  };

  window.MP_CALCS['lockedRotor'] = {
    i18n: {
      mp_lr_title:{ es:'Locked-Rotor · NEC 430.251', en:'Locked-Rotor · NEC 430.251' },
      mp_lr_sub:  { es:'Corriente de rotor bloqueado por letra de código', en:'Locked-rotor current by code letter' },
      mp_lr_hp:   { es:'HP del motor', en:'Motor HP' },
      mp_lr_volt: { es:'Voltaje', en:'Voltage' },
      mp_lr_phase:{ es:'Fases', en:'Phases' },
      mp_lr_code: { es:'Letra de código (placa)', en:'Code letter (nameplate)' },
      mp_lr_lra:  { es:'LRA estimada', en:'Estimated LRA' },
      mp_lr_kvahp:{ es:'kVA/HP (midpoint)', en:'kVA/HP (midpoint)' },
      mp_lr_note: { es:'NEC 430.251(A) para 1φ, 430.251(B) para 3φ. Fórmula LRA = (kVA/HP × HP × 1000) / (V × √3 para 3φ, V para 1φ).', en:'NEC 430.251(A) for 1φ, 430.251(B) for 3φ. Formula LRA = (kVA/HP × HP × 1000) / (V × √3 for 3φ, V for 1φ).' },
      mp_lr_case: { es:'Compresor 5 HP 460V 3φ con letra G (placa). kVA/HP mid = 5.95. LRA = (5.95 × 5 × 1000) / (460 × 1.732) = 37.4 A. Breaker ITB al 1100% (430.52) = 412 A → 400 A NEC std.', en:'5 HP 460V 3φ compressor with code letter G (nameplate). kVA/HP mid = 5.95. LRA = (5.95 × 5 × 1000) / (460 × 1.732) = 37.4 A. ITB breaker at 1100% (430.52) = 412 A → 400 A NEC std.' },
      mp_lr_tip:  { es:'La LRA define la capacidad interrumpente (AIC) del breaker, no solo la protección. Una LRA alta en 480V exige breakers 14 kAIC+ o te hacen un recall del inspector.', en:'LRA drives breaker interrupting rating (AIC), not just protection. High LRA at 480V forces 14 kAIC+ breakers or the inspector red-tags you.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.lockedRotor) || {};
      var hp = num(s.hp, 5);
      var volt = num(s.volt, 460);
      var phase = s.phase || '3';
      var letter = (s.letter || 'G').toUpperCase();
      var cl = CODE_LETTERS[letter] || CODE_LETTERS.G;
      var denom = phase==='3' ? volt*Math.sqrt(3) : volt;
      var lra = cl.mid * hp * 1000 / denom;
      var letters = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','R','S','T','U','V'];
      var lopt=''; for (var i=0;i<letters.length;i++){ lopt += '<option value="'+letters[i]+'"'+(letter===letters[i]?' selected':'')+'>'+letters[i]+' ('+CODE_LETTERS[letters[i]].lo+'–'+CODE_LETTERS[letters[i]].hi+' kVA/HP)</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'lockedRotor','mp_lr_title','mp_lr_sub','🔒',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_lr_hp','HP')) + '</span><span class="mp-unit">HP</span></div><input type="number" class="mp-in" data-in="lockedRotor.hp" value="' + hp + '" min="0.1" step="0.25" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_lr_volt','V')) + '</span><span class="mp-unit">V</span></div><input type="number" class="mp-in" data-in="lockedRotor.volt" value="' + volt + '" min="100" step="5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_lr_phase','φ')) + '</span><span class="mp-unit">φ</span></div>' +
            '<select class="mp-in" data-in="lockedRotor.phase">' +
              '<option value="1"' + (phase==='1'?' selected':'') + '>1φ</option>' +
              '<option value="3"' + (phase==='3'?' selected':'') + '>3φ</option>' +
            '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_lr_code','Letra')) + '</span><span class="mp-unit">code</span></div><select class="mp-in" data-in="lockedRotor.letter">' + lopt + '</select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_lr_lra','LRA')) + '</div>' +
          '<div class="mp-res-main">' + fmt(lra,1) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + letter + ' · ' + fmt(cl.mid,2) + ' kVA/HP · NEC 430.251(' + (phase==='3'?'B':'A') + ')</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_lr_kvahp','kVA/HP')) + '</div><div class="mp-res-val">' + fmt(cl.mid,2) + '</div></div>' +
            '<div><div class="mp-res-item">Rango tabla</div><div class="mp-res-val">' + fmt(cl.lo,2) + '–' + fmt(cl.hi,2) + '</div></div>' +
            '<div><div class="mp-res-item">Breaker ITB 1100%</div><div class="mp-res-val">' + fmt(lra*11,0) + ' A</div></div>' +
            '<div><div class="mp-res-item">AIC min rec.</div><div class="mp-res-val">' + (lra>100?'22 kAIC':lra>30?'14 kAIC':'10 kAIC') + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 430.251</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_lr_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_lr_case','mp_lr_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 6: transformerKVA — NEC 450.3 OCPD + primary/secondary current
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['transformerKVA'] = {
    i18n: {
      mp_tx_title:{ es:'Transformador kVA · NEC 450.3', en:'Transformer kVA · NEC 450.3' },
      mp_tx_sub:  { es:'Corriente primaria/secundaria + protección OCPD', en:'Primary/secondary current + OCPD protection' },
      mp_tx_kva:  { es:'Capacidad', en:'Rating' },
      mp_tx_vp:   { es:'Voltaje primario', en:'Primary voltage' },
      mp_tx_vs:   { es:'Voltaje secundario', en:'Secondary voltage' },
      mp_tx_ph:   { es:'Fases', en:'Phases' },
      mp_tx_mode: { es:'Protección', en:'Protection' },
      mp_tx_ip:   { es:'Corriente primaria', en:'Primary current' },
      mp_tx_is:   { es:'Corriente secundaria', en:'Secondary current' },
      mp_tx_ocpd: { es:'OCPD primario', en:'Primary OCPD' },
      mp_tx_ocpd2:{ es:'OCPD secundario', en:'Secondary OCPD' },
      mp_tx_note: { es:'NEC 450.3(B): primario solo → hasta 125% Ip (o 167% si <9A). Primario+secundario → hasta 250% primario y 125% secundario.', en:'NEC 450.3(B): primary only → up to 125% Ip (or 167% if <9A). Primary+secondary → up to 250% primary and 125% secondary.' },
      mp_tx_case: { es:'Proyecto comercial San Jose: 75 kVA 480–208Y/120. Ip = 75000/(480×1.732) = 90.2 A. Is = 75000/(208×1.732) = 208 A. Modo dual: OCPD primario 250% = 225 A std; secundario 125% = 260 A std.', en:'San Jose commercial: 75 kVA 480–208Y/120. Ip = 75000/(480×1.732) = 90.2 A. Is = 75000/(208×1.732) = 208 A. Dual mode: primary OCPD 250% = 225 A std; secondary 125% = 260 A std.' },
      mp_tx_tip:  { es:'Transformadores ≥25 kVA se instalan "hung" del techo — siempre deja 30" de working clearance NEC 110.26 y NUNCA encima de un dropped-ceiling accesible salvo que el transformador sea dry-type listed.', en:'Transformers ≥25 kVA get ceiling-hung — always leave 30" working clearance NEC 110.26 and NEVER above accessible dropped ceilings unless dry-type listed.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.transformerKVA) || {};
      var kva = num(s.kva, 75);
      var vp = num(s.vp, 480);
      var vs = num(s.vs, 208);
      var ph = s.ph || '3';
      var mode = s.mode || 'primarySecondary';
      var factor = ph==='3' ? Math.sqrt(3) : 1;
      var ip = kva*1000 / (vp*factor);
      var is_ = kva*1000 / (vs*factor);
      var primaryPct = (mode==='primaryOnly') ? (ip<9?1.67:1.25) : 2.50;
      var secondaryPct = (mode==='primaryOnly') ? 0 : 1.25;
      function stdBreaker(a){ var std=[15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400,450,500,600,700,800,1000,1200,1600,2000,2500,3000,4000,5000,6000]; for (var i=0;i<std.length;i++){ if (std[i]>=a) return std[i]; } return 6000; }
      var ocpdP = stdBreaker(ip*primaryPct);
      var ocpdS = secondaryPct ? stdBreaker(is_*secondaryPct) : 0;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'transformerKVA','mp_tx_title','mp_tx_sub','↗',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tx_kva','kVA')) + '</span><span class="mp-unit">kVA</span></div><input type="number" class="mp-in" data-in="transformerKVA.kva" value="' + kva + '" min="0.05" step="5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tx_vp','Vp')) + '</span><span class="mp-unit">V</span></div><input type="number" class="mp-in" data-in="transformerKVA.vp" value="' + vp + '" min="100" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tx_vs','Vs')) + '</span><span class="mp-unit">V</span></div><input type="number" class="mp-in" data-in="transformerKVA.vs" value="' + vs + '" min="100" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tx_ph','φ')) + '</span><span class="mp-unit">φ</span></div>' +
            '<select class="mp-in" data-in="transformerKVA.ph"><option value="1"' + (ph==='1'?' selected':'') + '>1φ</option><option value="3"' + (ph==='3'?' selected':'') + '>3φ</option></select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tx_mode','mode')) + '</span><span class="mp-unit">NEC</span></div>' +
            '<select class="mp-in" data-in="transformerKVA.mode">' +
              '<option value="primaryOnly"' + (mode==='primaryOnly'?' selected':'') + '>Solo primario (125%/167%)</option>' +
              '<option value="primarySecondary"' + (mode==='primarySecondary'?' selected':'') + '>Primario+Secundario (250%/125%)</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_tx_ip','Ip')) + ' / ' + esc(t('mp_tx_is','Is')) + '</div>' +
          '<div class="mp-res-main">' + fmt(ip,1) + '<span class="mp-res-unit">A / ' + fmt(is_,1) + ' A</span></div>' +
          '<div class="mp-res-desc">' + kva + ' kVA · ' + vp + ' → ' + vs + ' V · ' + ph + 'φ · NEC 450.3(B)</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_tx_ocpd','Primary OCPD')) + '</div><div class="mp-res-val">' + ocpdP + ' A @ ' + (primaryPct*100).toFixed(0) + '%</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_tx_ocpd2','Sec OCPD')) + '</div><div class="mp-res-val">' + (ocpdS?ocpdS+' A @ 125%':'—') + '</div></div>' +
            '<div><div class="mp-res-item">Cond prim 125%</div><div class="mp-res-val">' + fmt(ip*1.25,0) + ' A</div></div>' +
            '<div><div class="mp-res-item">Cond sec 125%</div><div class="mp-res-val">' + fmt(is_*1.25,0) + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 450.3(B)</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_tx_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_tx_case','mp_tx_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 7: boxFill — NEC 314.16(B) with Table 314.16(B) volumes
  // ═══════════════════════════════════════════════════════════════
  // Conductor volume allowance in³ per Table 314.16(B)
  var BOX_VOL = { '18':1.50, '16':1.75, '14':2.00, '12':2.25, '10':2.50, '8':3.00, '6':5.00 };

  window.MP_CALCS['boxFill'] = {
    i18n: {
      mp_bf_title:{ es:'Box Fill · NEC 314.16(B)', en:'Box Fill · NEC 314.16(B)' },
      mp_bf_sub:  { es:'Volumen requerido vs capacidad de caja', en:'Required volume vs box capacity' },
      mp_bf_awg:  { es:'AWG de conductor', en:'Conductor AWG' },
      mp_bf_ccount:{ es:'Conductores que entran/salen', en:'Conductors in/out' },
      mp_bf_devs: { es:'Dispositivos (switch, receptáculo)', en:'Devices (switch, receptacle)' },
      mp_bf_clamps:{ es:'Clamps internos', en:'Internal clamps' },
      mp_bf_grnd: { es:'Grupos de grounding', en:'Grounding groups' },
      mp_bf_cap:  { es:'Capacidad de la caja', en:'Box capacity' },
      mp_bf_need: { es:'Volumen requerido', en:'Required volume' },
      mp_bf_ok:   { es:'Estatus', en:'Status' },
      mp_bf_pass: { es:'OK — la caja es suficiente', en:'OK — box is large enough' },
      mp_bf_fail: { es:'FAIL — necesitas caja más grande o extension ring', en:'FAIL — need bigger box or extension ring' },
      mp_bf_note: { es:'Cada conductor que entra o sale = 1 × volumen. Dispositivo = 2 × el AWG más grande. Clamps internos = 1 × AWG mayor (sola vez). Grounding = 1 × AWG mayor (sola vez, incluye todo).', en:'Each conductor entering or leaving = 1 × volume. Device = 2 × largest AWG. Internal clamps = 1 × largest AWG (once). Grounding = 1 × largest AWG (once, covers all).' },
      mp_bf_case: { es:'4"×4"×2-1/8" square box (30.3 in³): 8 × #12 CCC + 1 duplex receptáculo + clamps + 2 grounds. Volumen = 8(2.25) + 2(2.25) + 1(2.25) + 1(2.25) = 27.0 in³. Pasa (30.3 > 27.0).', en:'4"×4"×2-1/8" square box (30.3 in³): 8 × #12 CCC + 1 duplex receptacle + clamps + 2 grounds. Volume = 8(2.25) + 2(2.25) + 1(2.25) + 1(2.25) = 27.0 in³. Passes (30.3 > 27.0).' },
      mp_bf_tip:  { es:'El pigtail NO cuenta si no sale de la caja, pero si lo cortan y empalman con wire-nut y sale otro cable → sí cuenta. Inspector de LA County es estricto con esto.', en:'Pigtails DO NOT count if they stay in the box, but cut+wire-nut splices that leave the box → do count. LA County inspectors enforce this.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.boxFill) || {};
      var awg = s.awg || '12';
      var ccount = Math.max(0, Math.floor(num(s.ccount, 6)));
      var devs = Math.max(0, Math.floor(num(s.devs, 1)));
      var clamps = s.clamps==='0'?0:1;
      var grnd = Math.max(0, Math.floor(num(s.grnd, 1)));
      var cap = num(s.cap, 21.0);
      var vu = BOX_VOL[awg] || 2.25;
      var condVol = ccount * vu;
      var devVol  = devs * 2 * vu;
      var clampVol = clamps * vu;
      var grndVol = (grnd>0?1:0) * vu + (grnd>1 ? (grnd-1)*0.25*vu : 0); // each extra 1/4 allowance is simplification
      var required = condVol + devVol + clampVol + grndVol;
      var pass = cap >= required;
      var awgs = ['18','16','14','12','10','8','6'];
      var opt=''; for (var i=0;i<awgs.length;i++){ opt += '<option value="'+awgs[i]+'"'+(awg===awgs[i]?' selected':'')+'>#'+awgs[i]+' ('+BOX_VOL[awgs[i]]+' in³)</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'boxFill','mp_bf_title','mp_bf_sub','📦',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_awg','AWG')) + '</span><span class="mp-unit">AWG</span></div><select class="mp-in" data-in="boxFill.awg">' + opt + '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_ccount','Cond in/out')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="boxFill.ccount" value="' + ccount + '" min="0" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_devs','Dispositivos')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="boxFill.devs" value="' + devs + '" min="0" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_clamps','Clamps')) + '</span><span class="mp-unit">0/1</span></div>' +
            '<select class="mp-in" data-in="boxFill.clamps"><option value="0"' + (clamps===0?' selected':'') + '>No clamps</option><option value="1"' + (clamps===1?' selected':'') + '>Sí clamps (1×)</option></select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_grnd','Grounds')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="boxFill.grnd" value="' + grnd + '" min="0" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_bf_cap','Capacidad')) + '</span><span class="mp-unit">in³</span></div><input type="number" class="mp-in" data-in="boxFill.cap" value="' + cap + '" min="1" step="0.5" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_bf_need','Requerido')) + '</div>' +
          '<div class="mp-res-main">' + fmt(required,2) + '<span class="mp-res-unit">in³</span></div>' +
          '<div class="mp-res-desc">' + (pass?esc(t('mp_bf_pass','OK')):esc(t('mp_bf_fail','FAIL'))) + ' · NEC 314.16(B)</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">Conductores</div><div class="mp-res-val">' + fmt(condVol,2) + ' in³</div></div>' +
            '<div><div class="mp-res-item">Dispositivos</div><div class="mp-res-val">' + fmt(devVol,2) + ' in³</div></div>' +
            '<div><div class="mp-res-item">Clamps</div><div class="mp-res-val">' + fmt(clampVol,2) + ' in³</div></div>' +
            '<div><div class="mp-res-item">Grounding</div><div class="mp-res-val">' + fmt(grndVol,2) + ' in³</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 314.16(B) — Tabla 314.16(B)</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_bf_note','')) + '</div>' +
          '<div style="margin-top:8px;font-size:12px;color:#111;"><strong>Vol/cond:</strong> #18=1.5, #16=1.75, #14=2.0, #12=2.25, #10=2.5, #8=3.0, #6=5.0 in³.</div>' +
        '</div>' +
        exampleTip('mp_bf_case','mp_bf_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 8: voltageDrop — NEC 210.19(A) 3%/5% with Chapter 9 Table 8
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['voltageDrop'] = {
    i18n: {
      mp_vd_title:{ es:'Caída de Voltaje · NEC 210.19(A)', en:'Voltage Drop · NEC 210.19(A)' },
      mp_vd_sub:  { es:'Ramal 3% / alimentador+ramal 5%', en:'Branch 3% / feeder+branch 5%' },
      mp_vd_volt: { es:'Voltaje', en:'Voltage' },
      mp_vd_load: { es:'Corriente', en:'Load current' },
      mp_vd_len:  { es:'Longitud 1-way', en:'One-way length' },
      mp_vd_awg:  { es:'AWG', en:'AWG' },
      mp_vd_phase:{ es:'Fases', en:'Phases' },
      mp_vd_pf:   { es:'Factor de potencia', en:'Power factor' },
      mp_vd_drop: { es:'Caída (V)', en:'Drop (V)' },
      mp_vd_pct:  { es:'Caída (%)', en:'Drop (%)' },
      mp_vd_status:{ es:'Estatus', en:'Status' },
      mp_vd_ok:   { es:'OK dentro del 3%/5% recomendado', en:'OK within 3%/5% recommendation' },
      mp_vd_bad:  { es:'Sobrepasa — upsize conductor', en:'Exceeds — upsize conductor' },
      mp_vd_note: { es:'VD = 2×L×R×I/1000 para 1φ; VD = √3×L×R×I/1000 para 3φ. R viene de Chapter 9 Tabla 8 (Cu, uncoated). NEC 210.19(A) Informational Note 4 recomienda 3% ramal, 5% combinado.', en:'VD = 2×L×R×I/1000 for 1φ; VD = √3×L×R×I/1000 for 3φ. R from Chapter 9 Table 8 (Cu, uncoated). NEC 210.19(A) Informational Note 4 recommends 3% branch, 5% combined.' },
      mp_vd_case: { es:'Sacramento: condensadora 240V 1φ 30A a 150 ft del panel. #10 Cu (R=1.24 Ω/kFT): VD = 2×150×1.24×30/1000 = 11.2 V = 4.65%. EXCEDE 3%. Upsize a #8 (0.778) = 7.0 V = 2.9% OK.', en:'Sacramento: 240V 1φ 30A condenser 150 ft from panel. #10 Cu (R=1.24 Ω/kFT): VD = 2×150×1.24×30/1000 = 11.2 V = 4.65%. EXCEEDS 3%. Upsize to #8 (0.778) = 7.0 V = 2.9% OK.' },
      mp_vd_tip:  { es:'Longitud es one-way, no round-trip. El factor ×2 (1φ) o √3 (3φ) ya lo aplica la fórmula. Error común: doblar la longitud PLUS multiplicar por 2.', en:'Length is one-way, not round-trip. The ×2 (1φ) or √3 (3φ) multiplier is already in the formula. Common mistake: doubling length AND multiplying by 2.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.voltageDrop) || {};
      var volt = num(s.volt, 240);
      var load = num(s.load, 30);
      var len = num(s.len, 150);
      var awg = s.awg || '10';
      var phase = s.phase || '1';
      var pf = num(s.pf, 1.0);
      var R = T8_R_CU[awg] || 1.24;
      var drop = phase==='3' ? (Math.sqrt(3)*len*R*load*pf/1000) : (2*len*R*load*pf/1000);
      var pct = (drop/volt)*100;
      var limit = 3.0;
      var status = pct <= limit;
      var awgs = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500'];
      var opt=''; for (var i=0;i<awgs.length;i++){ opt += '<option value="'+awgs[i]+'"'+(awg===awgs[i]?' selected':'')+'>#'+awgs[i]+' ('+T8_R_CU[awgs[i]].toFixed(3)+' Ω/kFT)</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'voltageDrop','mp_vd_title','mp_vd_sub','▽V',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_volt','V')) + '</span><span class="mp-unit">V</span></div><input type="number" class="mp-in" data-in="voltageDrop.volt" value="' + volt + '" min="12" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_load','I')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="voltageDrop.load" value="' + load + '" min="0.1" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_len','L')) + '</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="voltageDrop.len" value="' + len + '" min="1" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_awg','AWG')) + '</span><span class="mp-unit">AWG</span></div><select class="mp-in" data-in="voltageDrop.awg">' + opt + '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_phase','φ')) + '</span><span class="mp-unit">φ</span></div>' +
            '<select class="mp-in" data-in="voltageDrop.phase"><option value="1"' + (phase==='1'?' selected':'') + '>1φ</option><option value="3"' + (phase==='3'?' selected':'') + '>3φ</option></select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_vd_pf','PF')) + '</span><span class="mp-unit">cos</span></div><input type="number" class="mp-in" data-in="voltageDrop.pf" value="' + pf + '" min="0.1" max="1" step="0.05" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_vd_drop','VD')) + '</div>' +
          '<div class="mp-res-main">' + fmt(drop,2) + '<span class="mp-res-unit">V (' + fmt(pct,2) + '%)</span></div>' +
          '<div class="mp-res-desc">' + (status?esc(t('mp_vd_ok','OK')):esc(t('mp_vd_bad','exceeds'))) + ' · NEC 210.19(A) Note 4</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">R conductor</div><div class="mp-res-val">' + R.toFixed(3) + ' Ω/kFT</div></div>' +
            '<div><div class="mp-res-item">Fase</div><div class="mp-res-val">' + phase + 'φ</div></div>' +
            '<div><div class="mp-res-item">Límite ramal</div><div class="mp-res-val">3%</div></div>' +
            '<div><div class="mp-res-item">Límite total</div><div class="mp-res-val">5%</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 210.19(A) / Chapter 9 Tabla 8</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_vd_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_vd_case','mp_vd_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 9: conduitFill — NEC Chapter 9 Tables 4 & 5
  // ═══════════════════════════════════════════════════════════════
  // Chapter 9 Table 4 — Total and 40% fill area (in²) for EMT
  var T4_EMT = {
    '1/2':   {total:0.304,  p40:0.122, p31:0.094, p53:0.161 },
    '3/4':   {total:0.533,  p40:0.213, p31:0.165, p53:0.283 },
    '1':     {total:0.864,  p40:0.346, p31:0.268, p53:0.458 },
    '1-1/4': {total:1.496,  p40:0.598, p31:0.464, p53:0.793 },
    '1-1/2': {total:2.036,  p40:0.814, p31:0.631, p53:1.079 },
    '2':     {total:3.356,  p40:1.342, p31:1.040, p53:1.778 },
    '2-1/2': {total:5.858,  p40:2.343, p31:1.816, p53:3.105 },
    '3':     {total:8.846,  p40:3.538, p31:2.742, p53:4.688 },
    '3-1/2': {total:11.545, p40:4.618, p31:3.579, p53:6.119 },
    '4':     {total:14.753, p40:5.901, p31:4.573, p53:7.819 }
  };
  // Chapter 9 Table 5 — Conductor area (THHN) in²
  var T5_THHN = {
    '14':0.0097,'12':0.0133,'10':0.0211,'8':0.0366,'6':0.0507,'4':0.0824,'3':0.0973,
    '2':0.1158,'1':0.1562,'1/0':0.1855,'2/0':0.2223,'3/0':0.2679,'4/0':0.3237,
    '250':0.3970,'300':0.4608,'350':0.5242,'400':0.5863,'500':0.7073,'600':0.8676,
    '750':1.0386,'1000':1.3478
  };

  window.MP_CALCS['conduitFill'] = {
    i18n: {
      mp_cf_title:{ es:'Llenado de Conduit · NEC Cap.9', en:'Conduit Fill · NEC Ch.9' },
      mp_cf_sub:  { es:'Tabla 4 conduit × Tabla 5 conductor', en:'Table 4 conduit × Table 5 conductor' },
      mp_cf_type: { es:'Tipo conduit', en:'Conduit type' },
      mp_cf_size: { es:'Trade size', en:'Trade size' },
      mp_cf_awg:  { es:'Tamaño conductor', en:'Conductor size' },
      mp_cf_qty:  { es:'Cantidad', en:'Quantity' },
      mp_cf_fill: { es:'% llenado', en:'Fill %' },
      mp_cf_avail:{ es:'Área disponible', en:'Available area' },
      mp_cf_used: { es:'Área usada', en:'Used area' },
      mp_cf_ok:   { es:'OK — pasa NEC Cap.9 Tabla 1', en:'OK — passes NEC Ch.9 Table 1' },
      mp_cf_fail: { es:'FAIL — upsize conduit', en:'FAIL — upsize conduit' },
      mp_cf_note: { es:'NEC Cap.9 Tabla 1: 1 conductor = 53%, 2 = 31%, 3+ = 40%. EMT, PVC Sch.40, RMC tienen áreas ligeramente diferentes.', en:'NEC Ch.9 Table 1: 1 conductor = 53%, 2 = 31%, 3+ = 40%. EMT, PVC Sch.40, RMC have slightly different areas.' },
      mp_cf_case: { es:'Oakland: 4 × #8 THHN + 1 × #10 EGC en 3/4" EMT. Área usada = 4(0.0366) + 0.0211 = 0.167 in². EMT 3/4" @ 40% = 0.213. Pasa. Si fueran 6 CCC del mismo #8 (0.22 in²) ya NO pasaría → subir a 1" EMT (0.346).', en:'Oakland: 4 × #8 THHN + 1 × #10 EGC in 3/4" EMT. Used = 4(0.0366) + 0.0211 = 0.167 in². EMT 3/4" @ 40% = 0.213. Passes. Six CCC at #8 (0.22 in²) → wouldn\'t pass; upsize to 1" EMT (0.346).' },
      mp_cf_tip:  { es:'Si tienes 3+ conductores del mismo tamaño, memoriza: #12 THHN → hasta 9 en 3/4" EMT, hasta 16 en 1" EMT. #10 THHN → 6 en 3/4", 10 en 1".', en:'For 3+ same-size conductors memorize: #12 THHN → 9 in 3/4" EMT, 16 in 1" EMT. #10 THHN → 6 in 3/4", 10 in 1".' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.conduitFill) || {};
      var type = s.type || 'EMT';
      var size = s.size || '3/4';
      var awg = s.awg || '12';
      var qty = Math.max(1, Math.floor(num(s.qty, 4)));
      var row = T4_EMT[size] || T4_EMT['3/4'];
      var areaCond = T5_THHN[awg] || 0.0133;
      var used = qty * areaCond;
      var pctKey = qty===1?'p53':(qty===2?'p31':'p40');
      var allowed = row[pctKey];
      var pctLbl = qty===1?'53%':(qty===2?'31%':'40%');
      var pass = used <= allowed;
      var fillPct = (used/row.total)*100;
      var sizes = ['1/2','3/4','1','1-1/4','1-1/2','2','2-1/2','3','3-1/2','4'];
      var so=''; for (var i=0;i<sizes.length;i++){ so += '<option value="'+sizes[i]+'"'+(size===sizes[i]?' selected':'')+'>'+sizes[i]+'"</option>'; }
      var awgs = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500'];
      var ao=''; for (var j=0;j<awgs.length;j++){ ao += '<option value="'+awgs[j]+'"'+(awg===awgs[j]?' selected':'')+'>#'+awgs[j]+' THHN ('+T5_THHN[awgs[j]].toFixed(4)+' in²)</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'conduitFill','mp_cf_title','mp_cf_sub','▓',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_cf_type','Tipo')) + '</span><span class="mp-unit">type</span></div>' +
            '<select class="mp-in" data-in="conduitFill.type"><option value="EMT"' + (type==='EMT'?' selected':'') + '>EMT</option><option value="PVC"' + (type==='PVC'?' selected':'') + '>PVC Sch.40</option><option value="RMC"' + (type==='RMC'?' selected':'') + '>RMC</option></select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_cf_size','Size')) + '</span><span class="mp-unit">in</span></div><select class="mp-in" data-in="conduitFill.size">' + so + '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_cf_awg','AWG')) + '</span><span class="mp-unit">AWG</span></div><select class="mp-in" data-in="conduitFill.awg">' + ao + '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_cf_qty','Qty')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="conduitFill.qty" value="' + qty + '" min="1" step="1" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_cf_used','Usada')) + '</div>' +
          '<div class="mp-res-main">' + fmt(used,4) + '<span class="mp-res-unit">in² (' + fmt(fillPct,1) + '%)</span></div>' +
          '<div class="mp-res-desc">' + (pass?esc(t('mp_cf_ok','OK')):esc(t('mp_cf_fail','FAIL'))) + ' · ' + pctLbl + ' límite · NEC Cap.9</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_cf_avail','Disponible')) + '</div><div class="mp-res-val">' + allowed.toFixed(3) + ' in²</div></div>' +
            '<div><div class="mp-res-item">Conduit total</div><div class="mp-res-val">' + row.total.toFixed(3) + ' in²</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_cf_fill','Límite')) + '</div><div class="mp-res-val">' + pctLbl + '</div></div>' +
            '<div><div class="mp-res-item">Margen</div><div class="mp-res-val">' + fmt(allowed-used,3) + ' in²</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC Chapter 9</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_cf_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_cf_case','mp_cf_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 10: tapRule — NEC 240.21(B) feeder taps
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['tapRule'] = {
    i18n: {
      mp_tr_title:{ es:'Regla de Tap · NEC 240.21(B)', en:'Tap Rule · NEC 240.21(B)' },
      mp_tr_sub:  { es:'10-ft, 25-ft y tap exterior', en:'10-ft, 25-ft and outside feeder' },
      mp_tr_feeder:{ es:'Corriente alimentador', en:'Feeder current' },
      mp_tr_len:  { es:'Largo del tap', en:'Tap length' },
      mp_tr_outside:{ es:'Tap exterior (sin límite)', en:'Outside tap (unlimited)' },
      mp_tr_type: { es:'Tipo aplicable', en:'Applicable rule' },
      mp_tr_tapI: { es:'Ampacidad tap mínima', en:'Min tap ampacity' },
      mp_tr_ok:   { es:'Cumple', en:'Compliant' },
      mp_tr_bad:  { es:'NO cumple — aumenta conductor o usa OCPD', en:'Non-compliant — upsize or add OCPD' },
      mp_tr_note: { es:'10-ft: tap ≥ 10% feeder, termina en OCPD. 25-ft: tap ≥ 33% feeder, termina en OCPD. Outside: sin límite de largo; debe entrar a edificio y primer OCPD.', en:'10-ft: tap ≥ 10% feeder, ends in OCPD. 25-ft: tap ≥ 33% feeder, ends in OCPD. Outside: unlimited length; must enter building at first OCPD.' },
      mp_tr_case: { es:'Bodega Riverside: feeder 400A a subpanel con tap de 22 ft. Aplica regla 25-ft: tap ≥ 400×0.33 = 132 A. Conductor #1/0 Cu THHN (150A @75°C) cumple. Termina en breaker 150A.', en:'Riverside warehouse: 400A feeder to subpanel with 22 ft tap. 25-ft rule applies: tap ≥ 400×0.33 = 132 A. #1/0 Cu THHN (150A @75°C) passes. Terminates at 150A breaker.' },
      mp_tr_tip:  { es:'En tap de 25 ft NO puedes ir a un panel — tiene que ir a un solo breaker main (single OCPD). Quieren múltiples breakers → el tap es de 10-ft o haces un OCPD adicional al entrar al panel.', en:'25-ft tap can\'t feed a panel — must land on a single main OCPD. Multiple breakers → use 10-ft rule or add an OCPD at panel entry.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.tapRule) || {};
      var feeder = num(s.feeder, 400);
      var len = num(s.len, 22);
      var outside = s.outside==='1';
      var ruleType, minAmp, status;
      if (outside) { ruleType='240.21(B)(5) Outside'; minAmp = 0; status=true; }
      else if (len<=10) { ruleType='240.21(B)(1) 10-ft'; minAmp = feeder*0.10; }
      else if (len<=25) { ruleType='240.21(B)(2) 25-ft'; minAmp = feeder*0.33; }
      else { ruleType='N/A — no aplica tap rule'; minAmp = feeder; }
      var required = Math.ceil(minAmp);
      var pass = outside || len<=25;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'tapRule','mp_tr_title','mp_tr_sub','⇥',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tr_feeder','Feeder')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="tapRule.feeder" value="' + feeder + '" min="15" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tr_len','L')) + '</span><span class="mp-unit">ft</span></div><input type="number" class="mp-in" data-in="tapRule.len" value="' + len + '" min="1" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_tr_outside','outside')) + '</span><span class="mp-unit">sí/no</span></div>' +
            '<select class="mp-in" data-in="tapRule.outside"><option value="0"' + (!outside?' selected':'') + '>No (interior)</option><option value="1"' + (outside?' selected':'') + '>Sí (outside tap)</option></select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_tr_type','Regla')) + '</div>' +
          '<div class="mp-res-main">' + esc(ruleType) + '</div>' +
          '<div class="mp-res-desc">' + (pass?esc(t('mp_tr_ok','Cumple')):esc(t('mp_tr_bad','No cumple'))) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_tr_tapI','Min tap A')) + '</div><div class="mp-res-val">' + (outside?'—':required + ' A') + '</div></div>' +
            '<div><div class="mp-res-item">% feeder</div><div class="mp-res-val">' + (outside?'—':(len<=10?'10%':'33%')) + '</div></div>' +
            '<div><div class="mp-res-item">Feeder</div><div class="mp-res-val">' + feeder + ' A</div></div>' +
            '<div><div class="mp-res-item">Tap L</div><div class="mp-res-val">' + len + ' ft</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 240.21(B)</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_tr_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_tr_case','mp_tr_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 11: demandDwell — NEC 220.82 dwelling optional method
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['demandDwell'] = {
    i18n: {
      mp_dd_title:{ es:'Demanda Dwelling · NEC 220.82', en:'Dwelling Demand · NEC 220.82' },
      mp_dd_sub:  { es:'Método opcional residencial', en:'Optional residential method' },
      mp_dd_sqft: { es:'Área habitable', en:'Habitable sqft' },
      mp_dd_sa:   { es:'Circuitos small-appliance (2)', en:'Small-appliance circuits (2)' },
      mp_dd_laund:{ es:'Laundry 1500 VA', en:'Laundry 1500 VA' },
      mp_dd_fix:  { es:'Cargas fijas (VA)', en:'Fixed loads (VA)' },
      mp_dd_ac:   { es:'A/C (VA)', en:'A/C (VA)' },
      mp_dd_heat: { es:'Calefacción (VA)', en:'Heating (VA)' },
      mp_dd_gen:  { es:'General (3 VA/ft²)', en:'General (3 VA/ft²)' },
      mp_dd_first:{ es:'Primeros 10 kVA @100%', en:'First 10 kVA @100%' },
      mp_dd_rest: { es:'Resto @40%', en:'Remainder @40%' },
      mp_dd_hvac: { es:'HVAC largest-of', en:'HVAC largest-of' },
      mp_dd_total:{ es:'Demanda total', en:'Total demand' },
      mp_dd_amp:  { es:'Service @240V', en:'Service @240V' },
      mp_dd_note: { es:'NEC 220.82: general (3 VA/ft² + 1500 lavadora + 2×1500 SA + fixos) @ 100% primeros 10 kVA, 40% el resto. HVAC = valor más grande entre AC, heat, o heat-pump+strip.', en:'NEC 220.82: general (3 VA/ft² + 1500 laundry + 2×1500 SA + fixed) @ 100% first 10 kVA, 40% remainder. HVAC = largest of AC, heat, or heat-pump+strip.' },
      mp_dd_case: { es:'Casa Bakersfield 2200 ft², range 12 kW, WH 4500W, dryer 5500W, AC 5-ton (48A×240V=11520), heat strip 10 kW. General = 2200×3 + 1500 + 3000 + 12000 + 4500 + 5500 = 28700 VA. 10000 @ 100% + 18700×0.40 = 17480. HVAC pick 11520 (AC) vs 10000 (heat) = 11520. Total = 29000 VA → 121 A → service 125A OK.', en:'Bakersfield 2200 ft² home, 12 kW range, 4500W WH, 5500W dryer, 5-ton AC (48A×240V=11520), 10 kW strip. General = 2200×3 + 1500 + 3000 + 12000 + 4500 + 5500 = 28700 VA. 10000 @ 100% + 18700×0.40 = 17480. HVAC pick 11520 (AC) vs 10000 (heat) = 11520. Total = 29000 VA → 121 A → 125A service OK.' },
      mp_dd_tip:  { es:'220.82 es MÁS favorable que 220.42 para casas con cargas grandes (EV + heat-pump + piscina). Siempre corre ambos métodos y usa el menor para permit.', en:'220.82 beats 220.42 for homes with big loads (EV + heat pump + pool). Always run both methods and submit the smaller for permit.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.demandDwell) || {};
      var sqft = num(s.sqft, 2200);
      var sa = num(s.sa, 3000);  // 2×1500
      var laund = num(s.laund, 1500);
      var fix = num(s.fix, 22000);
      var ac = num(s.ac, 11520);
      var heat = num(s.heat, 10000);
      var general = sqft*3 + sa + laund + fix;
      var first = Math.min(general, 10000);
      var rest = Math.max(0, general-10000)*0.40;
      var genDemand = first + rest;
      var hvac = Math.max(ac, heat);
      var total = genDemand + hvac;
      var amps = total/240;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'demandDwell','mp_dd_title','mp_dd_sub','🏠',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_sqft','ft²')) + '</span><span class="mp-unit">ft²</span></div><input type="number" class="mp-in" data-in="demandDwell.sqft" value="' + sqft + '" min="100" step="100" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_sa','SA 2×')) + '</span><span class="mp-unit">VA</span></div><input type="number" class="mp-in" data-in="demandDwell.sa" value="' + sa + '" min="0" step="500" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_laund','Laundry')) + '</span><span class="mp-unit">VA</span></div><input type="number" class="mp-in" data-in="demandDwell.laund" value="' + laund + '" min="0" step="500" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_fix','Fijas')) + '</span><span class="mp-unit">VA</span></div><input type="number" class="mp-in" data-in="demandDwell.fix" value="' + fix + '" min="0" step="1000" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_ac','AC')) + '</span><span class="mp-unit">VA</span></div><input type="number" class="mp-in" data-in="demandDwell.ac" value="' + ac + '" min="0" step="500" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_dd_heat','Heat')) + '</span><span class="mp-unit">VA</span></div><input type="number" class="mp-in" data-in="demandDwell.heat" value="' + heat + '" min="0" step="500" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_dd_total','Total')) + '</div>' +
          '<div class="mp-res-main">' + fmt(total,0) + '<span class="mp-res-unit">VA (' + fmt(amps,0) + ' A)</span></div>' +
          '<div class="mp-res-desc">NEC 220.82 · General ' + fmt(general,0) + ' VA · HVAC ' + fmt(hvac,0) + ' VA</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_dd_first','10kVA@100')) + '</div><div class="mp-res-val">' + fmt(first,0) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_dd_rest','rest@40')) + '</div><div class="mp-res-val">' + fmt(rest,0) + '</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_dd_hvac','HVAC largest')) + '</div><div class="mp-res-val">' + fmt(hvac,0) + '</div></div>' +
            '<div><div class="mp-res-item">Service min</div><div class="mp-res-val">' + (amps<100?100:(amps<125?125:(amps<150?150:(amps<200?200:(amps<225?225:400))))) + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 220.82</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_dd_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_dd_case','mp_dd_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 12: pvInterconnect — NEC 705.12 120% rule
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['pvInterconnect'] = {
    i18n: {
      mp_pv_title:{ es:'PV Interconexión · NEC 705.12', en:'PV Interconnection · NEC 705.12' },
      mp_pv_sub:  { es:'Regla 120% backfeed + supply/load-side', en:'120% backfeed rule + supply/load-side' },
      mp_pv_bus:  { es:'Busbar rating', en:'Busbar rating' },
      mp_pv_main: { es:'Breaker main', en:'Main breaker' },
      mp_pv_inv:  { es:'Breaker inversor', en:'Inverter breaker' },
      mp_pv_side: { es:'Conexión', en:'Connection' },
      mp_pv_rule: { es:'Regla aplicada', en:'Rule applied' },
      mp_pv_limit:{ es:'Límite permitido', en:'Allowed limit' },
      mp_pv_ok:   { es:'Pasa 120%', en:'Passes 120%' },
      mp_pv_bad:  { es:'NO pasa — usa supply-side o MSP upgrade', en:'Fails — use supply-side or MSP upgrade' },
      mp_pv_note: { es:'Load-side 705.12(B)(3)(2): Main + PV ≤ 120% busbar, PV en extremo opuesto. Supply-side 705.12(A): se conecta antes del main, sin regla 120% pero requiere OCPD de línea.', en:'Load-side 705.12(B)(3)(2): Main + PV ≤ 120% busbar, PV opposite end. Supply-side 705.12(A): connects before main, no 120% rule but requires line-side OCPD.' },
      mp_pv_case: { es:'Casa Fresno 200A panel (busbar 200A), main 200A, inversor SolarEdge 10 kW 42A → breaker 60A. Check 120%: 200+60 = 260 vs 200×1.20 = 240 → NO pasa. Soluciones: downsize main a 175A (175+60=235 ≤ 240), MSP upgrade, o supply-side tap.', en:'Fresno 200A panel (200A busbar), 200A main, SolarEdge 10 kW 42A inverter → 60A breaker. Check 120%: 200+60 = 260 vs 200×1.20 = 240 → FAILS. Fixes: downsize main to 175A (175+60=235 ≤ 240), MSP upgrade, or supply-side tap.' },
      mp_pv_tip:  { es:'NEC 2023 705.12(B)(3)(1) permite hasta 100% si PV+main ≤ busbar y el breaker PV está marcado "do not operate with PV+main simultaneously" — rule nueva no usada en CA 2022 aún.', en:'NEC 2023 705.12(B)(3)(1) allows up to 100% if PV+main ≤ busbar and PV breaker labeled "do not operate with PV+main simultaneously" — new rule not yet in CA 2022.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.pvInterconnect) || {};
      var bus = num(s.bus, 200);
      var main = num(s.main, 200);
      var inv = num(s.inv, 60);
      var side = s.side || 'load';
      var limit = bus*1.20;
      var sum = main + inv;
      var pass = side==='supply' ? true : sum <= limit;
      var rule = side==='supply' ? '705.12(A) Supply-side (sin 120%)' : '705.12(B)(3)(2) 120% rule';

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'pvInterconnect','mp_pv_title','mp_pv_sub','☀',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_pv_bus','Bus')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="pvInterconnect.bus" value="' + bus + '" min="60" step="25" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_pv_main','Main')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="pvInterconnect.main" value="' + main + '" min="20" step="5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_pv_inv','Inv')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="pvInterconnect.inv" value="' + inv + '" min="5" step="5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_pv_side','Side')) + '</span><span class="mp-unit">NEC</span></div>' +
            '<select class="mp-in" data-in="pvInterconnect.side"><option value="load"' + (side==='load'?' selected':'') + '>Load-side (705.12(B))</option><option value="supply"' + (side==='supply'?' selected':'') + '>Supply-side (705.12(A))</option></select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_pv_rule','Regla')) + '</div>' +
          '<div class="mp-res-main">' + (pass?'PASS':'FAIL') + '</div>' +
          '<div class="mp-res-desc">' + esc(rule) + ' · ' + (pass?esc(t('mp_pv_ok','OK')):esc(t('mp_pv_bad','Fail'))) + '</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">Main + Inv</div><div class="mp-res-val">' + sum + ' A</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_pv_limit','Límite 120%')) + '</div><div class="mp-res-val">' + fmt(limit,0) + ' A</div></div>' +
            '<div><div class="mp-res-item">Busbar</div><div class="mp-res-val">' + bus + ' A</div></div>' +
            '<div><div class="mp-res-item">Margen</div><div class="mp-res-val">' + fmt(limit-sum,0) + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 705.12</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_pv_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_pv_case','mp_pv_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 13: rangeWh — NEC 220.55 Table 220.55 cooking demand
  // ═══════════════════════════════════════════════════════════════
  // Simplified Column C (most common for ≤12 kW ranges): 8 kW up to 1 unit, then demand factors
  // For >12 kW: increase Column C by 5% per additional kW
  var T220_55_C = {
    1:8, 2:11, 3:14, 4:17, 5:20, 6:21, 7:22, 8:23, 9:24, 10:25,
    11:26, 12:27, 13:28, 14:29, 15:30, 16:31, 17:32, 18:33, 19:34, 20:35,
    21:36, 22:37, 23:38, 24:39, 25:40, 26:15.5*1.75, 30:15.5*2, 40:15.5*2.5, 50:15.5*3
  };

  window.MP_CALCS['rangeWh'] = {
    i18n: {
      mp_rg_title:{ es:'Range/Cooking · NEC 220.55', en:'Range/Cooking · NEC 220.55' },
      mp_rg_sub:  { es:'Demanda para estufas eléctricas ≥1¾ kW', en:'Demand for electric ranges ≥1¾ kW' },
      mp_rg_units:{ es:'Cantidad de unidades', en:'Number of units' },
      mp_rg_kw:   { es:'kW nominal por unidad', en:'Nameplate kW per unit' },
      mp_rg_demand:{ es:'Demanda Col. C', en:'Column C demand' },
      mp_rg_adj:  { es:'Ajuste >12 kW', en:'Over-12 kW adjust' },
      mp_rg_final:{ es:'Demanda final', en:'Final demand' },
      mp_rg_amps: { es:'@240V', en:'@240V' },
      mp_rg_note: { es:'NEC 220.55 Col. C para rangos ≤12 kW. Si placa >12 kW, súbele 5% por cada kW adicional. Col. A aplica a rangos hasta 3.5 kW, Col. B a 3.5–8.75 kW.', en:'NEC 220.55 Col. C for ranges ≤12 kW. Nameplate >12 kW, add 5% per additional kW. Col. A for ranges up to 3.5 kW, Col. B for 3.5–8.75 kW.' },
      mp_rg_case: { es:'Edificio 24 apartamentos LA con range 12 kW c/u. Col. C(24) = 39 kW. Feeder @240V = 39000/240 = 162 A. Conductor 4/0 Cu (230A @75°C). Si fueran 14 kW, +5%×2 = 10% → 42.9 kW.', en:'LA 24-apt building, 12 kW range each. Col. C(24) = 39 kW. Feeder @240V = 39000/240 = 162 A. Conductor 4/0 Cu (230A @75°C). 14 kW ranges would add +5%×2 = 10% → 42.9 kW.' },
      mp_rg_tip:  { es:'En multi-family grande (25+ units) la demanda por unidad baja dramáticamente — Col. C(50) = 46.5 kW = 1.86 kW/apt efectivo. Por eso los multifamily de NYC viven con services modestos.', en:'Large multi-family (25+ units) effective demand drops hard — Col. C(50) = 46.5 kW = 1.86 kW/apt effective. That\'s why NYC multifamily live on modest services.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.rangeWh) || {};
      var units = Math.max(1, Math.floor(num(s.units, 24)));
      var kw = num(s.kw, 12);
      var baseDemand = 0;
      if (units<=25) baseDemand = T220_55_C[units] || (15 + units*0.5);
      else if (units<=40) baseDemand = 15 + units*0.5 + (units-25)*0.75;
      else baseDemand = 15 + units*0.5 + (units-25)*0.75 + (units-40)*0.25;
      var over = Math.max(0, kw-12);
      var adj = over>0 ? over*0.05 : 0;
      var final_ = baseDemand * (1 + adj);
      var amps = final_*1000 / 240;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'rangeWh','mp_rg_title','mp_rg_sub','🍳',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_rg_units','Unidades')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="rangeWh.units" value="' + units + '" min="1" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_rg_kw','kW ea')) + '</span><span class="mp-unit">kW</span></div><input type="number" class="mp-in" data-in="rangeWh.kw" value="' + kw + '" min="1.75" step="0.5" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_rg_final','Demanda')) + '</div>' +
          '<div class="mp-res-main">' + fmt(final_,1) + '<span class="mp-res-unit">kW (' + fmt(amps,0) + ' A)</span></div>' +
          '<div class="mp-res-desc">' + units + ' × ' + kw + ' kW · NEC 220.55 Col. C</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_rg_demand','Col.C base')) + '</div><div class="mp-res-val">' + fmt(baseDemand,1) + ' kW</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_rg_adj','Over-12')) + '</div><div class="mp-res-val">+' + fmt(adj*100,0) + '%</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_rg_amps','Amps')) + '</div><div class="mp-res-val">' + fmt(amps,0) + ' A</div></div>' +
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">Table 220.55</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 220.55</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_rg_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_rg_case','mp_rg_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 14: groundingTransformer — NEC 250.30 SDS grounding
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['groundingTransformer'] = {
    i18n: {
      mp_gt_title:{ es:'SDS Grounding · NEC 250.30', en:'SDS Grounding · NEC 250.30' },
      mp_gt_sub:  { es:'Sistema derivado separadamente + SSBJ', en:'Separately derived system + SSBJ' },
      mp_gt_awg:  { es:'Mayor fase secundaria', en:'Largest secondary phase' },
      mp_gt_gec:  { es:'GEC (250.66)', en:'GEC (250.66)' },
      mp_gt_ssbj: { es:'Supply-side BJ', en:'Supply-side BJ' },
      mp_gt_neutral:{ es:'Neutral bonded', en:'Neutral bonded' },
      mp_gt_note: { es:'NEC 250.30(A)(1): el SSBJ conecta el neutral del SDS al equipo (tamaño Tabla 250.102(C)(1), que = Tabla 250.66). GEC al único electrode más cercano (building steel, tubería, o rod dedicado).', en:'NEC 250.30(A)(1): SSBJ bonds SDS neutral to equipment (sized per Table 250.102(C)(1) = Table 250.66). GEC to single nearest electrode (building steel, pipe, or dedicated rod).' },
      mp_gt_case: { es:'Transformer 75 kVA 480–208Y/120 en Long Beach. Secundario #3/0 Cu (200A). Tabla 250.66 → GEC #4 Cu, SSBJ #4 Cu. Bond neutral→XO→enclosure en el transformer SOLO, no en el panel downstream.', en:'75 kVA 480–208Y/120 in Long Beach. Secondary #3/0 Cu (200A). Table 250.66 → GEC #4 Cu, SSBJ #4 Cu. Bond neutral→XO→enclosure at transformer ONLY, not at downstream panel.' },
      mp_gt_tip:  { es:'El ERROR #1 es bondear el neutral en el sub-panel de un SDS. Si lo haces, creas un parallel path que hace disparar GFCIs y energiza el conduit. Neutral bond = UN solo lugar (donde arranca el SDS).', en:'#1 MISTAKE is bonding neutral at SDS sub-panel. Creates a parallel path that trips GFCIs and energizes conduit. Neutral bond = ONE place (SDS origin).' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.groundingTransformer) || {};
      var awg = s.awg || '3/0';
      var gec = pickGEC(awg);
      var ssbj = gec; // SSBJ sized same as GEC per 250.102(C)(1) ≈ 250.66
      var awgs = ['8','6','4','2','1','1/0','2/0','3/0','4/0','250','300','400','500','600','750','1000','1250','1500','2000'];
      var opt=''; for (var i=0;i<awgs.length;i++){ opt += '<option value="'+awgs[i]+'"'+(awg===awgs[i]?' selected':'')+'>#'+awgs[i]+' Cu</option>'; }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'groundingTransformer','mp_gt_title','mp_gt_sub','⏚',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_gt_awg','Sec phase')) + '</span><span class="mp-unit">AWG</span></div><select class="mp-in" data-in="groundingTransformer.awg">' + opt + '</select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_gt_gec','GEC')) + ' / SSBJ</div>' +
          '<div class="mp-res-main">#' + gec + '<span class="mp-res-unit">Cu</span></div>' +
          '<div class="mp-res-desc">NEC 250.30(A)(1) · Table 250.66 · secundario #' + awg + ' Cu</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">GEC</div><div class="mp-res-val">#' + gec + ' Cu</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_gt_ssbj','SSBJ')) + '</div><div class="mp-res-val">#' + ssbj + ' Cu</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_gt_neutral','N-bond')) + '</div><div class="mp-res-val">solo en SDS</div></div>' +
            '<div><div class="mp-res-item">NEC</div><div class="mp-res-val">250.30(A)</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 250.30</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_gt_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_gt_case','mp_gt_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 15: motorBranchOCPD — NEC 430.52 Table (max %)
  // ═══════════════════════════════════════════════════════════════
  // Table 430.52(C)(1) — Max % of FLC
  // types: NTDF=non-time-delay fuse, TDF=dual-element time-delay fuse, ITB=inverse-time CB, IT=instant-trip CB
  var T430_52 = {
    // motor category simplified: singlePhase, sqCage (squirrel cage B/C), woundRotor, dc
    singlePhase: { NTDF:300, TDF:175, ITB:250, IT:800 },
    sqCage:      { NTDF:300, TDF:175, ITB:250, IT:800 },
    woundRotor:  { NTDF:150, TDF:150, ITB:150, IT:800 },
    dc:          { NTDF:150, TDF:150, ITB:150, IT:250 }
  };

  window.MP_CALCS['motorBranchOCPD'] = {
    i18n: {
      mp_mo_title:{ es:'Protección de Ramal Motor · NEC 430.52', en:'Motor Branch OCPD · NEC 430.52' },
      mp_mo_sub:  { es:'Tabla 430.52(C)(1) con rounding 430.52(C)(1) Excp.1', en:'Table 430.52(C)(1) with 430.52(C)(1) Ex.1 rounding' },
      mp_mo_flc:  { es:'FLC del motor', en:'Motor FLC' },
      mp_mo_cat:  { es:'Categoría motor', en:'Motor category' },
      mp_mo_type: { es:'Tipo protección', en:'Protection type' },
      mp_mo_calc: { es:'FLC × %', en:'FLC × %' },
      mp_mo_std:  { es:'Tamaño NEC 240.6(A)', en:'NEC 240.6(A) std size' },
      mp_mo_ratio:{ es:'Rating final', en:'Final rating' },
      mp_mo_note: { es:'NEC 430.52(C)(1) Excp.1: si el valor calculado no coincide con tamaño std, puedes subir al siguiente tamaño estándar. NTDF = non-time-delay fuse, TDF = dual-element TDF, ITB = inverse-time CB, IT = instant-trip CB.', en:'NEC 430.52(C)(1) Ex.1: if calc doesn\'t match std size, you can round up to next std. NTDF = non-time-delay fuse, TDF = dual-element TDF, ITB = inverse-time CB, IT = instant-trip CB.' },
      mp_mo_case: { es:'Compresor 3φ 30A FLC sq-cage. ITB: 30×2.5 = 75 A → siguiente std 80 A. TDF: 30×1.75 = 52.5 A → std 60 A (ahorra costo en rotura). Protección grande para arranque, overloads 125% para correr.', en:'3φ 30A FLC sq-cage compressor. ITB: 30×2.5 = 75 A → next std 80 A. TDF: 30×1.75 = 52.5 A → std 60 A (cheaper on trip-clearing). Large for start, overloads at 125% for run.' },
      mp_mo_tip:  { es:'El rating grande del breaker NO reemplaza overloads (430.32). Son DOS protecciones: breaker = short-circuit/ground-fault, overload relay = thermal. Inspector te pide AMBOS.', en:'Large breaker does NOT replace overloads (430.32). TWO protections: breaker = short-circuit/ground-fault, overload relay = thermal. Inspector checks BOTH.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.motorBranchOCPD) || {};
      var flc = num(s.flc, 30);
      var cat = s.cat || 'sqCage';
      var type = s.type || 'ITB';
      var pct = (T430_52[cat] || T430_52.sqCage)[type];
      var calc = flc * pct / 100;
      var std = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400,450,500,600,700,800,1000,1200,1600,2000,2500,3000,4000,5000,6000];
      var finalRating = 0; for (var i=0;i<std.length;i++){ if (std[i] >= calc) { finalRating = std[i]; break; } }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'motorBranchOCPD','mp_mo_title','mp_mo_sub','🛡',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mo_flc','FLC')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="motorBranchOCPD.flc" value="' + flc + '" min="0.5" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mo_cat','Cat')) + '</span><span class="mp-unit">type</span></div>' +
            '<select class="mp-in" data-in="motorBranchOCPD.cat">' +
              '<option value="singlePhase"' + (cat==='singlePhase'?' selected':'') + '>1-φ</option>' +
              '<option value="sqCage"' + (cat==='sqCage'?' selected':'') + '>3-φ Squirrel cage</option>' +
              '<option value="woundRotor"' + (cat==='woundRotor'?' selected':'') + '>Wound rotor</option>' +
              '<option value="dc"' + (cat==='dc'?' selected':'') + '>DC</option>' +
            '</select></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mo_type','Protección')) + '</span><span class="mp-unit">NEC</span></div>' +
            '<select class="mp-in" data-in="motorBranchOCPD.type">' +
              '<option value="NTDF"' + (type==='NTDF'?' selected':'') + '>NTDF (non-TD fuse)</option>' +
              '<option value="TDF"' + (type==='TDF'?' selected':'') + '>TDF (dual-element)</option>' +
              '<option value="ITB"' + (type==='ITB'?' selected':'') + '>ITB (inverse-time CB)</option>' +
              '<option value="IT"' + (type==='IT'?' selected':'') + '>IT (instant-trip CB)</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_mo_ratio','Rating')) + '</div>' +
          '<div class="mp-res-main">' + finalRating + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + flc + ' A × ' + pct + '% = ' + fmt(calc,1) + ' A → std ' + finalRating + ' A · NEC 430.52</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">% FLC</div><div class="mp-res-val">' + pct + '%</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_mo_calc','Calc')) + '</div><div class="mp-res-val">' + fmt(calc,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_mo_std','Std')) + '</div><div class="mp-res-val">' + finalRating + ' A</div></div>' +
            '<div><div class="mp-res-item">Tipo</div><div class="mp-res-val">' + type + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 430.52</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_mo_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_mo_case','mp_mo_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 16: motorFeederCond — NEC 430.24 multi-motor feeder
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['motorFeederCond'] = {
    i18n: {
      mp_mf_title:{ es:'Alimentador de Motores · NEC 430.24', en:'Motor Feeder · NEC 430.24' },
      mp_mf_sub:  { es:'125% FLC del mayor + 100% restantes', en:'125% largest FLC + 100% others' },
      mp_mf_flc1: { es:'FLC motor #1 (mayor)', en:'FLC motor #1 (largest)' },
      mp_mf_flc2: { es:'FLC motor #2', en:'FLC motor #2' },
      mp_mf_flc3: { es:'FLC motor #3', en:'FLC motor #3' },
      mp_mf_flc4: { es:'FLC motor #4', en:'FLC motor #4' },
      mp_mf_feed: { es:'Ampacidad feeder requerida', en:'Required feeder ampacity' },
      mp_mf_awg:  { es:'Conductor sugerido', en:'Suggested conductor' },
      mp_mf_note: { es:'NEC 430.24: feeder = 125% del motor con FLC más alto + 100% de los otros. Si hay cargas no-motor, súmalas al 100% o 125% si continuas.', en:'NEC 430.24: feeder = 125% of largest-FLC motor + 100% of remaining motors. Non-motor loads add at 100% or 125% if continuous.' },
      mp_mf_case: { es:'RTU San Diego: 4 compresores de 28, 28, 14, 7.5 A. Feeder = 28×1.25 + 28 + 14 + 7.5 = 84.5 A. Conductor #4 Cu THHN (85 A @75°C) cumple. OCPD feeder ≤ breaker más grande + 100% otros = 80 + 28 + 14 + 7.5 = 129.5 → 125A.', en:'San Diego RTU: 4 comps @ 28, 28, 14, 7.5 A. Feeder = 28×1.25 + 28 + 14 + 7.5 = 84.5 A. #4 Cu THHN (85 A @75°C) passes. Feeder OCPD ≤ largest motor breaker + 100% others = 80 + 28 + 14 + 7.5 = 129.5 → 125A.' },
      mp_mf_tip:  { es:'Para HVAC con múltiples compresores stage-in, los motores NUNCA arrancan simultáneamente — pero NEC no deja aplicar factor de diversidad salvo que el AHJ acepte escrito. Siempre dimensiona 430.24 full.', en:'HVAC with staged compressors never starts simultaneously — but NEC doesn\'t allow diversity factor unless AHJ approves in writing. Always size 430.24 full.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.motorFeederCond) || {};
      var f1 = num(s.f1, 28);
      var f2 = num(s.f2, 28);
      var f3 = num(s.f3, 14);
      var f4 = num(s.f4, 7.5);
      var motors = [f1,f2,f3,f4].filter(function(x){return x>0;});
      motors.sort(function(a,b){return b-a;});
      var required = motors.length ? (motors[0]*1.25 + motors.slice(1).reduce(function(a,b){return a+b;},0)) : 0;
      // Pick conductor
      var awgs = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500'];
      var chosen='500';
      for (var i=0;i<awgs.length;i++){ if (T310_16_75C[awgs[i]] >= required) { chosen=awgs[i]; break; } }

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'motorFeederCond','mp_mf_title','mp_mf_sub','≣',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mf_flc1','#1')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="motorFeederCond.f1" value="' + f1 + '" min="0" step="0.5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mf_flc2','#2')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="motorFeederCond.f2" value="' + f2 + '" min="0" step="0.5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mf_flc3','#3')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="motorFeederCond.f3" value="' + f3 + '" min="0" step="0.5" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_mf_flc4','#4')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="motorFeederCond.f4" value="' + f4 + '" min="0" step="0.5" /></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_mf_feed','Feeder')) + '</div>' +
          '<div class="mp-res-main">' + fmt(required,1) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + esc(t('mp_mf_awg','Cu')) + ': #' + chosen + ' THWN (' + T310_16_75C[chosen] + ' A) · NEC 430.24</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">Mayor × 125%</div><div class="mp-res-val">' + fmt((motors[0]||0)*1.25,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">Otros × 100%</div><div class="mp-res-val">' + fmt(motors.slice(1).reduce(function(a,b){return a+b;},0),1) + ' A</div></div>' +
            '<div><div class="mp-res-item">Conductor</div><div class="mp-res-val">#' + chosen + ' Cu</div></div>' +
            '<div><div class="mp-res-item">Ampacidad</div><div class="mp-res-val">' + T310_16_75C[chosen] + ' A</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 430.24</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_mf_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_mf_case','mp_mf_tip')
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // TOOL 17: evseCalcAdv — NEC 625 EV advanced
  // ═══════════════════════════════════════════════════════════════
  window.MP_CALCS['evseCalcAdv'] = {
    i18n: {
      mp_ev_title:{ es:'EVSE Avanzado · NEC 625', en:'EVSE Advanced · NEC 625' },
      mp_ev_sub:  { es:'Continua 125% · 625.42 ampacidad · 625.46 disconnect', en:'Continuous 125% · 625.42 ampacity · 625.46 disconnect' },
      mp_ev_amps: { es:'Amperios EVSE', en:'EVSE amps' },
      mp_ev_volt: { es:'Voltaje', en:'Voltage' },
      mp_ev_qty:  { es:'Unidades EVSE', en:'EVSE units' },
      mp_ev_emsf: { es:'EMS activo (705.12 / 625.42(A))', en:'EMS active (705.12 / 625.42(A))' },
      mp_ev_cont: { es:'Carga continua 125%', en:'Continuous 125%' },
      mp_ev_cond: { es:'Conductor requerido', en:'Required conductor' },
      mp_ev_brk:  { es:'Breaker std', en:'Std breaker' },
      mp_ev_disc: { es:'Disconnect (625.46)', en:'Disconnect (625.46)' },
      mp_ev_note: { es:'NEC 625.42(A): EVSE es carga continua → 125% para conductor y OCPD. 625.46: disconnect si >60A o >150V a tierra, visible y lockable. Si hay EMS (Energy Mgmt System) 625.42(B), el sistema limita corriente y no aplica 125%.', en:'NEC 625.42(A): EVSE is continuous → 125% conductor and OCPD. 625.46: disconnect required if >60A or >150V-to-gnd, visible and lockable. EMS (Energy Mgmt System) 625.42(B) limits current, bypassing 125% rule.' },
      mp_ev_case: { es:'Casa San Jose: 2 × Tesla Gen3 (48A@240V c/u) sin EMS. Cada circuito: 48×1.25 = 60 A → #6 Cu THHN (65 A @75°C) + breaker 60A. Feeder a subpanel EVSE: 96+24 = 120 A → #1 Cu. Disconnect no requerido (=60A, no >60A).', en:'San Jose home: 2 × Tesla Gen3 (48A@240V each) no EMS. Each circuit: 48×1.25 = 60 A → #6 Cu THHN (65 A @75°C) + 60A breaker. Feeder to EVSE subpanel: 96+24 = 120 A → #1 Cu. Disconnect not required (=60A, not >60A).' },
      mp_ev_tip:  { es:'En CA permit 2023+ piden load-calc 220.87 + 625.42 con EMS si el service ya está al límite. Instala un ChargePoint Home Flex + EMS para que 50A EVSE pase en un panel 100A sin upgrade.', en:'CA 2023+ permits require 220.87 + 625.42 w/ EMS if service is near limit. Install ChargePoint Home Flex + EMS to run 50A EVSE on a 100A panel without upgrade.' }
    },
    render: function(state, helpers){
      var s = (state.inputs && state.inputs.evseCalcAdv) || {};
      var amps = num(s.amps, 48);
      var volt = num(s.volt, 240);
      var qty = Math.max(1, Math.floor(num(s.qty, 2)));
      var ems = s.ems==='1';
      var cont = ems ? amps : amps*1.25;
      var feeder = qty>1 ? (cont + (qty-1)*amps) : cont;
      // Pick conductor for single-branch
      var awgs = ['14','12','10','8','6','4','3','2','1','1/0','2/0','3/0','4/0','250','300','350','400','500'];
      var chosen='500';
      for (var i=0;i<awgs.length;i++){ if (T310_16_75C[awgs[i]] >= cont) { chosen=awgs[i]; break; } }
      var std = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400];
      var brk = 400; for (var j=0;j<std.length;j++){ if (std[j] >= cont) { brk=std[j]; break; } }
      var disconnectReq = amps>60 || volt>150;

      return (h().renderCalcShell || function(id,tk,sk,ic,body){return body;})(
        'evseCalcAdv','mp_ev_title','mp_ev_sub','🔌',
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> ' + esc(t('mp_inputs','Entradas')) + '</div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_ev_amps','A')) + '</span><span class="mp-unit">A</span></div><input type="number" class="mp-in" data-in="evseCalcAdv.amps" value="' + amps + '" min="6" step="2" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_ev_volt','V')) + '</span><span class="mp-unit">V</span></div><input type="number" class="mp-in" data-in="evseCalcAdv.volt" value="' + volt + '" min="120" step="10" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_ev_qty','Qty')) + '</span><span class="mp-unit">ct</span></div><input type="number" class="mp-in" data-in="evseCalcAdv.qty" value="' + qty + '" min="1" step="1" /></div>' +
          '<div class="mp-ig"><div class="mp-lbl"><span>' + esc(t('mp_ev_emsf','EMS')) + '</span><span class="mp-unit">NEC 625.42(B)</span></div>' +
            '<select class="mp-in" data-in="evseCalcAdv.ems"><option value="0"' + (!ems?' selected':'') + '>Sin EMS</option><option value="1"' + (ems?' selected':'') + '>Con EMS</option></select></div>' +
        '</div>' +
        '<div class="mp-res">' +
          '<div class="mp-res-lbl">◆ ' + esc(t('mp_ev_cont','Continua')) + '</div>' +
          '<div class="mp-res-main">' + fmt(cont,1) + '<span class="mp-res-unit">A</span></div>' +
          '<div class="mp-res-desc">' + (ems?'EMS activo · sin 125%':'Continua × 125%') + ' · NEC 625.42(A)</div>' +
          '<div class="mp-res-grid">' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_cond','Cond')) + '</div><div class="mp-res-val">#' + chosen + ' Cu</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_brk','Breaker')) + '</div><div class="mp-res-val">' + brk + ' A</div></div>' +
            '<div><div class="mp-res-item">Feeder ' + qty + '×</div><div class="mp-res-val">' + fmt(feeder,1) + ' A</div></div>' +
            '<div><div class="mp-res-item">' + esc(t('mp_ev_disc','Disc')) + '</div><div class="mp-res-val">' + (disconnectReq?'Requerido':'No req.') + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="mp-sec">' +
          '<div class="mp-sec-lbl"><span class="dot">◆</span> NEC 625.42 / 625.46</div>' +
          '<div style="font-size:12.5px;color:#111;line-height:1.55;">' + esc(t('mp_ev_note','')) + '</div>' +
        '</div>' +
        exampleTip('mp_ev_case','mp_ev_tip')
      );
    }
  };

})();
