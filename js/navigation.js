    // Dynamic theme-color per screen for mobile browsers
    var SCREEN_THEME_COLORS = {
      dashboardScreen: '#040d1a',
      loginScreen: '#040d1a',
      registerScreen: '#FFFFFF',
      landingPageScreen: '#FFFFFF',
      desafioScreen: '#040d1a',
      desafioPlayScreen: '#040d1a',
      desafioQuizScreen: '#040d1a',
      adminDashboardScreen: '#FFFFFF',
      adminLoginScreen: '#FFFFFF',
      techChatScreen: '#0f172a',
      liveStreamingScreen: '#FFFFFF',
      acvoltCertScreen: '#FFFFFF',
      acvoltCourseScreen: '#FFFFFF',
      acvoltLessonScreen: '#FFFFFF',
      videoTutorialesScreen: '#FFFFFF',
      studentExamsScreen: '#FFFFFF',
      studentProgressScreen: '#FFFFFF',
      miPerfilScreen: '#FFFFFF',
      membresiasScreen: '#FFFFFF',
      radioPodcastScreen: '#FFFFFF',
      herramientasScreen: '#FFFFFF',
      bluetoothToolsScreen: '#FFFFFF',
      manifoldScreen: '#FFFFFF',
      multimeterScreen: '#FFFFFF',
      manometerHvacScreen: '#FFFFFF',
      anemometerHvacScreen: '#FFFFFF',
      heatingScreen: '#FFFFFF',
      commercialHvacScreen: '#FFFFFF',
      partsFinderScreen: '#FFFFFF',
      maestroInvoicesScreen: '#FFFFFF',
      top10RachaScreen: '#FFFFFF',
      friendsScreen: '#FFFFFF',
      jobBoardScreen: '#FFFFFF',
      marketplaceScreen: '#FFFFFF',
      preDepartureScreen: '#FFFFFF',
      ductDesignerScreen: '#FFFFFF',
      maestroBenderScreen: '#1B2845',
      maestroProScreen: '#1B2845'
    };

    function _updateThemeColor(screenId) {
      var color = SCREEN_THEME_COLORS[screenId] || '#FFFFFF';
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', color);
    }

    // Loading shimmer for lazy-loaded screens
    function _showScreenShimmer(screen) {
      if (screen.querySelector('.maestro-shimmer')) return;
      if (screen.children.length > 2) return; // Already has content
      var shimmer = document.createElement('div');
      shimmer.className = 'maestro-shimmer';
      shimmer.style.cssText = 'padding:20px;display:flex;flex-direction:column;gap:12px;width:100%;';
      for (var i = 0; i < 4; i++) {
        var bar = document.createElement('div');
        bar.style.cssText = 'height:' + (i === 0 ? '24' : '16') + 'px;background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:200% 100%;animation:maestroShimmer 1.5s infinite;border-radius:8px;width:' + (100 - i * 15) + '%;';
        shimmer.appendChild(bar);
      }
      screen.appendChild(shimmer);
      // Remove after scripts load
      setTimeout(function() {
        if (shimmer.parentNode) shimmer.parentNode.removeChild(shimmer);
      }, 5000);
    }

    // Lazy-load mapping: screen → scripts to load on demand
    var SCREEN_SCRIPTS = {
      desafioScreen: ['js/desafio-questions-c1.js', 'js/desafio.js', 'js/ai-maestro-mario.js'],
      desafioQuizScreen: ['js/desafio-questions-c1.js', 'js/desafio.js', 'js/ai-maestro-mario.js'],
      techChatScreen: ['js/tech-chat.js'],
      sugerenciasScreen: ['js/tech-chat.js'],
      liveStreamingScreen: ['js/live-streaming.js'],
      radioPodcastScreen: ['js/radio-podcast.js'],
      acvoltCertScreen: ['js/acvolt-certification.js'],
      acvoltCourseScreen: ['js/acvolt-certification.js'],
      acvoltLessonScreen: ['js/acvolt-certification.js'],
      videoTutorialesScreen: ['js/admin/tutorial-videos.js', 'js/video-tutoriales.js'],
      studentExamsScreen: ['js/student-exams.js'],
      studentGradesScreen: ['js/student-grades.js'],
      studentUploadScreen: ['js/student-upload.js'],
      studentProgressScreen: ['js/progress-dashboard.js'],
      studentCalendarScreen: ['js/admin/ambassadors.js'],
      membresiasScreen: ['js/membresias.js'],
      referidosScreen: ['js/admin/ambassadors.js'],
      zoomClassesScreen: ['js/crm/zoom-recordings.js', 'js/crm/zm-navigation.js'],
      chakaTipsScreen: ['js/chaka-tips.js'],
      attendanceScreen: ['js/admin/class-schedule.js'],
      miPerfilScreen: ['js/student-grades.js', 'js/student-upload.js', 'js/student-exams.js'],
      adminLoginScreen: ['js/admin/hash-passwords.js', 'js/admin/student-success.js'],
      adminDashboardScreen: '_admin',
      adminTechnicianProfileScreen: '_admin',
      friendsScreen: ['js/social-system.js'],
      jobBoardScreen: ['js/social-system.js', 'js/job-board.js'],
      marketplaceScreen: ['js/marketplace.js'],
      preDepartureScreen: ['js/pre-departure-checklist.js'],
      ductDesignerScreen: ['js/duct-designer.js'],
      maestroBenderScreen: ['js/maestro-bender.js'],
      maestroProScreen: ['js/maestro-pro.js','js/mp-calcs/math.js','js/mp-calcs/math2.js','js/mp-calcs/elec.js','js/mp-calcs/elec2.js','js/mp-calcs/hvac.js','js/mp-calcs/hvac2.js','js/mp-calcs/refrig.js','js/mp-calcs/refrig2.js','js/mp-calcs/nec.js','js/mp-calcs/nec2.js','js/mp-calcs/safe.js','js/mp-calcs/safe2.js','js/mp-calcs/energy-code.js','js/mp-calcs/mechanical.js'],
      contractorZoneScreen: ['js/contractor-zone/questions-law.js','js/contractor-zone/questions-c20.js','js/contractor-zone/questions-c38.js','js/contractor-zone/questions-c10.js','js/contractor-zone/bloque-1.js','js/contractor-zone/bloque-2.js','js/contractor-zone/bloque-3.js','js/contractor-zone/bloque-4.js','js/contractor-zone/bloque-5.js','js/contractor-zone/bloque-6.js','js/contractor-zone/bloque-7.js','js/contractor-zone/bloque-8.js','js/contractor-zone/bloque-9.js','js/contractor-zone/bloque-10.js','js/contractor-zone/bloque-11.js','js/contractor-zone/bloque-12.js','js/contractor-zone/bloque-13.js','js/contractor-zone/cslb-kit.js','js/contractor-zone/templates.js','js/contractor-zone/contractor-zone.js','js/jornal-pro.js'],
      jornalProScreen: ['js/jornal-pro.js'],
      herramientasScreen: ['js/herramientas-pt-data.js', 'js/herramientas.js', 'js/ble-manager.js'],
      bluetoothToolsScreen: ['js/ble-manager.js'],
      manifoldScreen: ['js/herramientas-pt-data.js', 'js/herramientas.js', 'js/ble-manager.js'],
      multimeterScreen: ['js/herramientas-pt-data.js', 'js/herramientas.js', 'js/ble-manager.js'],
      manometerHvacScreen: ['js/manometer-hvac.js', 'js/ble-manager.js'],
      partsFinderScreen: ['js/parts-finder-data.js', 'js/parts-finder.js'],
      anemometerHvacScreen: ['js/anemometer-hvac.js', 'js/ble-manager.js'],
      heatingScreen: ['js/herramientas-pt-data.js', 'js/herramientas-heating.js', 'js/ble-manager.js'],
      commercialHvacScreen: ['js/herramientas-pt-data.js', 'js/commercial-hvac.js', 'js/ble-manager.js'],
      diagnosticosScreen: ['js/diag-hub.js'],
      lavadoraDiagScreen: ['js/lavadora-diag.js', 'js/ble-manager.js'],
      secadoraDiagScreen: ['js/secadora-diag.js', 'js/ble-manager.js'],
      refriDomDiagScreen: ['js/refrigerador-domestico-diag.js', 'js/ble-manager.js'],
      acWindowDiagScreen: ['js/ac-window-diag.js', 'js/ble-manager.js'],
      acMobileDiagScreen: ['js/ac-mobile-diag.js', 'js/ble-manager.js'],
      miniSplitDiagScreen: ['js/minisplit-diag.js', 'js/ble-manager.js'],
      waterHeaterDiagScreen: ['js/water-heater-diag.js', 'js/ble-manager.js'],
      mainPanelDiagScreen: ['js/main-panel-diag.js', 'js/ble-manager.js'],
      subpanelDiagScreen: ['js/subpanel-diag.js', 'js/ble-manager.js'],
      solarDiagScreen: ['js/solar-diag.js', 'js/ble-manager.js'],
      generatorDiagScreen: ['js/generator-diag.js', 'js/ble-manager.js'],
      reeferDiagScreen:    ['js/reefer-diag.js', 'js/ble-manager.js'],
      rackingDiagScreen:   ['js/racking-diag.js', 'js/ble-manager.js'],
      gelatoDiagScreen:    ['js/gelato-diag.js', 'js/ble-manager.js'],
      meghometerScreen:    ['js/meghometer.js'],
      walkinDiagScreen: ['js/herramientas-pt-data.js', 'js/walkin-diag.js', 'js/ble-manager.js'],
      icemachineDiagScreen: ['js/herramientas-pt-data.js', 'js/icemachine-diag.js', 'js/ble-manager.js'],
      coldtableDiagScreen: ['js/herramientas-pt-data.js', 'js/coldtable-diag.js', 'js/refrig-common-zone.js', 'js/ble-manager.js'],
      reachinDiagScreen: ['js/herramientas-pt-data.js', 'js/reachin-diag.js', 'js/refrig-common-zone.js', 'js/ble-manager.js'],
      epa608StudyScreen: ['js/social-system.js', 'js/epa608-questions.js', 'js/epa608-study.js', 'js/study-together.js'],
      a2lStudyScreen: ['js/social-system.js', 'js/a2l-questions.js', 'js/a2l-study.js', 'js/study-together.js'],
      oshaStudyScreen: ['js/social-system.js', 'js/osha-questions.js', 'js/osha-study.js', 'js/study-together.js'],
      calefaccionStudyScreen: ['js/social-system.js', 'js/calefaccion-questions.js', 'js/calefaccion-study.js', 'js/study-together.js'],
      refriStudyScreen: ['js/social-system.js', 'js/refri-questions.js', 'js/refri-study.js', 'js/study-together.js'],
      nateStudyScreen: ['js/social-system.js', 'js/nate-questions.js', 'js/nate-study.js', 'js/study-together.js'],
      etStudyScreen: ['js/social-system.js', 'js/study-together.js'],  // et-study loaded via <script defer> in index.html
      nateSeniorStudyScreen: ['js/social-system.js', 'js/study-together.js'],  // nate-senior loaded via <script defer> in index.html
      videoLessonsScreen: [] // video-lessons.js already loaded via <script defer> in index.html
    };

    // Direct tool navigation — dashboard cards → herramientas tool
    window._htDirectTool = function(toolId) {
      window._htPendingTool = toolId;
      showScreen('herramientasScreen');
    };

    // Smart back for tool-screen ‹ arrows.
    // If the user arrived from Dashboard (not from herramientasScreen),
    // return straight to Dashboard. Otherwise fall back to herramientasScreen.
    window._toolBack = function(fallback) {
      var prev = window._previousScreenId;
      var target = (prev && prev !== 'herramientasScreen') ? prev : (fallback || 'herramientasScreen');
      if (!prev) target = fallback || 'dashboardScreen';
      try { showScreen(target); } catch(e) { showScreen('dashboardScreen'); }
    };

    // ── Inline BLE connection bar + LIVE/Simulator mode ──
    // Compact bar at top of each tool screen. States:
    //   Idle (gray):     "BLE [Escanear]"
    //   Scanning (blue): "Escaneando... [Parar]"
    //   LIVE (green):    "[Device] EN VIVO [Desconectar]"
    // LIVE mode: green badge, BLE fields read-only, auto-populate active
    // Simulator mode: manual input, default

    // Screen → which FP probe categories are relevant
    var _bleAllCats = ['pressure', 'pipeclamp', 'psychrometer', 'multimeter', 'manifold', 'staticpressure', 'scale', 'vacuum'];
    var _bleToolbarContextMap = {
      // Standalone screens — show ALL devices for full diagnostic
      manifoldScreen: _bleAllCats,
      manometerHvacScreen: _bleAllCats,
      multimeterScreen: _bleAllCats,
      anemometerHvacScreen: _bleAllCats,
      heatingScreen: _bleAllCats,
      commercialHvacScreen: _bleAllCats,
      walkinDiagScreen: _bleAllCats,
      icemachineDiagScreen: _bleAllCats,
      coldtableDiagScreen: _bleAllCats,
      reachinDiagScreen: _bleAllCats,
      lavadoraDiagScreen:    ['multimeter'],
      secadoraDiagScreen:    ['multimeter'],
      refriDomDiagScreen:    _bleAllCats,
      acWindowDiagScreen:    _bleAllCats,
      acMobileDiagScreen:    _bleAllCats,
      miniSplitDiagScreen:   _bleAllCats,
      waterHeaterDiagScreen: ['multimeter'],
      mainPanelDiagScreen:   ['multimeter'],
      subpanelDiagScreen:    ['multimeter'],
      solarDiagScreen:       ['multimeter'],
      generatorDiagScreen:   ['multimeter'],
      reeferDiagScreen:      _bleAllCats,
      rackingDiagScreen:     _bleAllCats,
      gelatoDiagScreen:      _bleAllCats,
      // herramientas sub-tools — scoped to relevant categories
      ptchart: ['pressure', 'manifold'],
      manifold: ['pressure', 'manifold', 'pipeclamp', 'psychrometer'],
      shsc: ['pressure', 'pipeclamp', 'manifold'],
      multimeter: ['multimeter'],
      ductulator: ['psychrometer', 'staticpressure'],
      psychart: ['psychrometer'],
      refcharge: ['pressure', 'pipeclamp', 'scale', 'manifold'],
      linesize: ['pressure'],
      converter: ['pressure', 'pipeclamp', 'psychrometer'],
      powerwheel: ['multimeter'],
      wiresizing: ['multimeter'],
      elecload: ['multimeter'],
      sysanalyzer: _bleAllCats,
      troubleshoot: _bleAllCats
    };

    // ═══════════════════════════════════════════════════════════════
    // BLE AUTO-POPULATE: Fill tool input fields from Fieldpiece data
    // ═══════════════════════════════════════════════════════════════
    // Sets input value + dispatches 'input' event to trigger recalc
    function _bleSetField(id, val) {
      var el = document.getElementById(id);
      if (!el) return false;
      var rounded = Math.round(val * 10) / 10;
      // Don't update if user is focused (typing) on this field
      if (document.activeElement === el) return false;
      el.value = rounded;
      // Directly inject into _htMMData so _mmGv() reads it immediately
      if (window._htMMData) window._htMMData[id] = rounded;
      // Also fire input event for any other listeners
      try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch(e) {}
      // Visual indicator: green glow for BLE auto-fill
      el.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
      el.style.borderColor = 'rgba(74,222,128,0.4)';
      return true;
    }

    // Track SC680 mode to clear stale fields on mode change
    var _sc680PrevMode = null;
    // Fields auto-populated per SC680 mode → clear them when mode changes
    var _sc680ModeFieldMap = {
      VAC: ['mmVmeas','mmWV','mmV24','htPWV'],
      VDC: ['mmVdc','htPWV'],
      Ohms: ['mmOhms','mmCS','mmCR','mmSR','htPWR'],
      Continuity: ['mmCont'],
      Diode: ['mmDiode'],
      uF: ['mmCapM','mmCapFM'],
      Hz: ['mmFreq'],
      PF: ['mmWPF'],
      Temp: ['mmTemp1','mmTemp2'],
      Amps_AC: ['mmAMeas','mmWA','htPWI'],
      NCV: [],
      '3Phase': ['mmL12','mmL23','mmL13','mmA1','mmA2','mmA3']
    };

    function _bleClearField(id) {
      var el = document.getElementById(id);
      if (!el || document.activeElement === el) return;
      el.value = '';
      el.style.boxShadow = '';
      el.style.borderColor = '';
      if (window._htMMData && window._htMMData[id] !== undefined) delete window._htMMData[id];
    }

    // Auto-populate fields based on current tool context
    window._bleAutoPopulate = function(toolId) {
      var fp = window._fpDevices;
      if (!fp || Object.keys(fp).length === 0) return;

      // Detect SC680 mode change → clear old fields
      var currentMeterMode = null;
      for (var _mid in fp) {
        if (fp[_mid].probeCategory === 'multimeter' && !fp[_mid]._stale && fp[_mid].meterMode) {
          currentMeterMode = fp[_mid].meterMode;
          // Also check CH2
          if (fp[_mid].ch2Mode) currentMeterMode += '+' + fp[_mid].ch2Mode;
          break;
        }
      }
      if (_sc680PrevMode && currentMeterMode && _sc680PrevMode !== currentMeterMode) {
        // Mode changed — clear fields from ALL previous modes
        for (var mk in _sc680ModeFieldMap) {
          var fields = _sc680ModeFieldMap[mk];
          for (var fi = 0; fi < fields.length; fi++) _bleClearField(fields[fi]);
        }
      }
      _sc680PrevMode = currentMeterMode;

      // Collect live (non-stale) readings by category
      // Hoist fp_* prefixed fields up onto the device object so both the
      // Swift-parsed ble-data path (plain keys) and the ble-beacon-data raw
      // path (fp_* prefixed from Swift's beacon payload) produce the same
      // shape. Without this, one path's devices disappear from the filter.
      var _fpHoist = function(d) {
        if (!d) return d;
        if (d.probeCategory === undefined && d.fp_probeCategory !== undefined) d.probeCategory = d.fp_probeCategory;
        if (d.probeName === undefined && d.fp_probeName !== undefined) d.probeName = d.fp_probeName;
        if (d.deviceIdStr === undefined && d.fp_deviceIdStr !== undefined) d.deviceIdStr = d.fp_deviceIdStr;
        if (d.dryBulbF === undefined && d.fp_dryBulbF !== undefined) d.dryBulbF = d.fp_dryBulbF;
        if (d.wetBulbF === undefined && d.fp_wetBulbF !== undefined) d.wetBulbF = d.fp_wetBulbF;
        if (d.dewPointF === undefined && d.fp_dewPointF !== undefined) d.dewPointF = d.fp_dewPointF;
        if (d.relativeHumidity === undefined && d.fp_relativeHumidity !== undefined) d.relativeHumidity = d.fp_relativeHumidity;
        if (d.temperatureF === undefined && d.fp_temperatureF !== undefined) d.temperatureF = d.fp_temperatureF;
        if (d.pressurePSI === undefined && d.fp_pressurePSI !== undefined) d.pressurePSI = d.fp_pressurePSI;
        if (d.highPSI === undefined && d.fp_highPSI !== undefined) d.highPSI = d.fp_highPSI;
        if (d.lowPSI === undefined && d.fp_lowPSI !== undefined) d.lowPSI = d.fp_lowPSI;
        if (d.suctionTempF === undefined && d.fp_suctionTempF !== undefined) d.suctionTempF = d.fp_suctionTempF;
        if (d.liquidTempF === undefined && d.fp_liquidTempF !== undefined) d.liquidTempF = d.fp_liquidTempF;
        if (d.superheatF === undefined && d.fp_superheatF !== undefined) d.superheatF = d.fp_superheatF;
        if (d.subcoolingF === undefined && d.fp_subcoolingF !== undefined) d.subcoolingF = d.fp_subcoolingF;
        if (d.returnInWC === undefined && d.fp_returnInWC !== undefined) d.returnInWC = d.fp_returnInWC;
        if (d.supplyInWC === undefined && d.fp_supplyInWC !== undefined) d.supplyInWC = d.fp_supplyInWC;
        if (d.totalESP === undefined && d.fp_totalESP !== undefined) d.totalESP = d.fp_totalESP;
        if (d.meterMode === undefined && d.fp_meterMode !== undefined) d.meterMode = d.fp_meterMode;
        if (d.meterValue === undefined && d.fp_meterValue !== undefined) d.meterValue = d.fp_meterValue;
        if (d.voltageAC === undefined && d.fp_voltageAC !== undefined) d.voltageAC = d.fp_voltageAC;
        if (d.voltageDC === undefined && d.fp_voltageDC !== undefined) d.voltageDC = d.fp_voltageDC;
        if (d.ampsAC === undefined && d.fp_ampsAC !== undefined) d.ampsAC = d.fp_ampsAC;
        if (d.capacitanceUF === undefined && d.fp_capacitanceUF !== undefined) d.capacitanceUF = d.fp_capacitanceUF;
        if (d.resistanceOhms === undefined && d.fp_resistanceOhms !== undefined) d.resistanceOhms = d.fp_resistanceOhms;
        if (d.frequencyHz === undefined && d.fp_frequencyHz !== undefined) d.frequencyHz = d.fp_frequencyHz;
        if (d.powerFactor === undefined && d.fp_powerFactor !== undefined) d.powerFactor = d.fp_powerFactor;
        if (d.watts === undefined && d.fp_watts !== undefined) d.watts = d.fp_watts;
        return d;
      };
      var pressures = [], pipeClamps = [], psychros = [], manifolds = [], statics = [], scales = [], meters = [];
      for (var id in fp) {
        var d = _fpHoist(fp[id]);
        if (d._stale) continue;
        if (d.probeCategory === 'pressure' && d.pressurePSI !== undefined) pressures.push(d);
        if (d.probeCategory === 'pipeclamp' && d.temperatureF !== undefined) pipeClamps.push(d);
        if (d.probeCategory === 'psychrometer' && d.dryBulbF !== undefined) psychros.push(d);
        if (d.probeCategory === 'manifold' && d.highPSI !== undefined) manifolds.push(d);
        if (d.probeCategory === 'staticpressure') statics.push(d);
        if (d.probeCategory === 'scale') scales.push(d);
        if (d.probeCategory === 'multimeter' && d.meterMode) meters.push(d);
      }

      // Sort: pressure high→low, pipe clamps warm→cold, psychros warm→cold
      pressures.sort(function(a,b) { return b.pressurePSI - a.pressurePSI; });
      pipeClamps.sort(function(a,b) { return b.temperatureF - a.temperatureF; });
      psychros.sort(function(a,b) { return b.dryBulbF - a.dryBulbF; });

      // SM480V manifold provides HP/LP/temps directly — use as fallback for probes
      var sman = manifolds.length > 0 ? manifolds[0] : null;

      var hiPSI = pressures.length >= 1 ? pressures[0].pressurePSI : (sman ? sman.highPSI : null);
      var loPSI = pressures.length >= 2 ? pressures[pressures.length - 1].pressurePSI : (sman ? sman.lowPSI : null);
      // If only 1 pressure probe, use it for both (equalized system)
      if (pressures.length === 1) loPSI = hiPSI;

      // Pipe clamps: warmer = liquid line, colder = suction line
      // SM480V suction/liquid temps as fallback
      var liquidT = pipeClamps.length >= 1 ? pipeClamps[0].temperatureF : (sman ? sman.liquidTempF : null);
      var suctionT = pipeClamps.length >= 2 ? pipeClamps[1].temperatureF : (sman ? sman.suctionTempF : null);
      if (pipeClamps.length === 1) suctionT = liquidT;

      // Psychros: warmer = return air, colder = supply air
      // JL3RH sends: dryBulbF, wetBulbF, dewPointF, relativeHumidity, battery
      var returnDB = psychros.length >= 1 ? psychros[0].dryBulbF : null;
      var supplyDB = psychros.length >= 2 ? psychros[1].dryBulbF : null;
      var returnWB = psychros.length >= 1 ? psychros[0].wetBulbF : null;
      var returnRH = psychros.length >= 1 ? psychros[0].relativeHumidity : null;
      var returnDP = psychros.length >= 1 ? (psychros[0].dewPointF !== undefined ? psychros[0].dewPointF : null) : null;
      var supplyWB = psychros.length >= 2 ? psychros[1].wetBulbF : null;
      var supplyRH = psychros.length >= 2 ? psychros[1].relativeHumidity : null;
      var supplyDP = psychros.length >= 2 ? (psychros[1].dewPointF !== undefined ? psychros[1].dewPointF : null) : null;

      // SM480V superheat/subcooling direct
      var smanSH = sman ? sman.superheatF : null;
      var smanSC = sman ? sman.subcoolingF : null;

      // Static pressure
      var staticDev = statics.length > 0 ? statics[0] : null;

      // Scale
      var scaleDev = scales.length > 0 ? scales[0] : null;

      // SC680 Multimeter — decoded readings
      var meterDev = meters.length > 0 ? meters[0] : null;

      // ── MANIFOLD / DIAGNÓSTICO HVACR ──
      if (toolId === 'manifold' || toolId === 'manifoldScreen') {
        // Pressures: set input + slider + sync
        if (hiPSI !== null) {
          var hiInp = document.getElementById('htMfHiInput');
          var hiSlr = document.getElementById('htMfHiPsi');
          var hiLCD = document.getElementById('htMfHiLCD');
          var hiR = Math.round(hiPSI * 10) / 10;
          if (hiInp && document.activeElement !== hiInp) { hiInp.value = hiR; hiInp.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)'; hiInp.style.borderColor = 'rgba(74,222,128,0.4)'; }
          if (hiSlr) hiSlr.value = hiR;
          if (hiLCD) { hiLCD.textContent = hiR.toFixed(1); hiLCD.style.textShadow = '0 0 16px rgba(74,222,128,0.6)'; }
        }
        if (loPSI !== null) {
          var loInp = document.getElementById('htMfLoInput');
          var loSlr = document.getElementById('htMfLoPsi');
          var loLCD = document.getElementById('htMfLoLCD');
          var loR = Math.round(loPSI * 10) / 10;
          if (loInp && document.activeElement !== loInp) { loInp.value = loR; loInp.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)'; loInp.style.borderColor = 'rgba(74,222,128,0.4)'; }
          if (loSlr) loSlr.value = loR;
          if (loLCD) { loLCD.textContent = loR.toFixed(1); loLCD.style.textShadow = '0 0 16px rgba(74,222,128,0.6)'; }
        }
        if (suctionT !== null) _bleSetField('htMfSuctionT', suctionT);
        if (liquidT !== null) _bleSetField('htMfLiquidT', liquidT);
        // Psychrometer → Indoor Return (warmer probe)
        if (returnDB !== null) _bleSetField('htMfIndoorT', returnDB);
        if (returnWB !== null) _bleSetField('htMfWetBulb', returnWB);
        if (returnRH !== null) _bleSetField('htMfRH', returnRH);
        // Psychrometer → Supply Air (colder probe)
        if (supplyDB !== null) _bleSetField('htMfSupplyT', supplyDB);
        // JL3RH dew point → direct display update
        if (returnDP !== null) {
          var dpEl = document.getElementById('htMfDewPoint');
          if (dpEl) { dpEl.textContent = returnDP.toFixed(1) + '\u00B0F'; dpEl.style.color = '#a78bfa'; }
        }
        // JL3RH indoor RH → direct display update
        if (returnRH !== null) {
          var irhEl = document.getElementById('htMfIndoorRH');
          if (irhEl) { irhEl.textContent = returnRH.toFixed(1) + '%'; irhEl.style.color = (returnRH >= 30 && returnRH <= 55) ? '#22d3ee' : '#f87171'; }
        }
        // SC680 Electrical → Diagnóstico HVACR electrical section
        if (meterDev) {
          var elecStatus = document.getElementById('htMfElecStatus');
          if (elecStatus) { elecStatus.textContent = 'EN VIVO \u2022 SC680'; elecStatus.style.color = '#4ade80'; }
          if (meterDev.voltageAC !== undefined) _bleSetField('htMfVoltage', meterDev.voltageAC);
          else if (meterDev.voltageDC !== undefined) _bleSetField('htMfVoltage', meterDev.voltageDC);
          if (meterDev.ampsAC !== undefined) _bleSetField('htMfAmps', meterDev.ampsAC);
          if (meterDev.capacitanceUF !== undefined) _bleSetField('htMfCapuF', meterDev.capacitanceUF);
          if (meterDev.resistanceOhms !== undefined && typeof meterDev.resistanceOhms === 'number') _bleSetField('htMfOhms', meterDev.resistanceOhms);
          if (meterDev.temperatureF !== undefined) _bleSetField('htMfTempF', meterDev.temperatureF);
          // Calculated watts
          if (meterDev.voltageAC !== undefined && meterDev.ampsAC !== undefined) {
            var w = meterDev.voltageAC * meterDev.ampsAC;
            if (meterDev.powerFactor !== undefined) w *= (meterDev.powerFactor / 100);
            _bleSetField('htMfWatts', Math.round(w));
          } else if (meterDev.watts !== undefined) {
            _bleSetField('htMfWatts', meterDev.watts);
          }
        }
        // SMAN manifold direct temps (suction/liquid line from beacon)
        if (sman) {
          if (sman.suctionTempF !== undefined && suctionT === null) _bleSetField('htMfSuctionT', sman.suctionTempF);
          if (sman.liquidTempF !== undefined && liquidT === null) _bleSetField('htMfLiquidT', sman.liquidTempF);
        }
        // Outdoor temp fallback from GPS weather if no BLE source
        if (!document.getElementById('htMfOutdoorT') || !document.getElementById('htMfOutdoorT').value) {
          var wx = window.MaestroWeather;
          if (wx && wx.tempF !== null && wx.tempF !== undefined) {
            _bleSetField('htMfOutdoorT', wx.tempF);
          }
        }
        // JL3RH Psychrometer live panel — show ALL data from probe
        if (psychros.length > 0) {
          var psyPanel = document.getElementById('htMfPsyLive');
          var psyGrid = document.getElementById('htMfPsyLiveGrid');
          var psyBat = document.getElementById('htMfPsyBat');
          if (psyPanel && psyGrid) {
            psyPanel.style.display = 'block';
            var rp = psychros[0]; // Return air probe (warmer)
            var sp = psychros.length >= 2 ? psychros[1] : null; // Supply air probe
            if (psyBat && rp.battery !== undefined) { psyBat.textContent = rp.battery + '%'; psyBat.style.color = rp.battery > 20 ? '#a855f7' : '#f87171'; }
            var pg = '';
            var _psyCell = function(label, val, unit, color) {
              return '<div style="text-align:center;background:#050a12;border-radius:8px;padding:5px 3px;border:1px solid rgba(168,85,247,0.1);">'
                + '<div style="font-size:6px;color:#64748b;font-weight:700;letter-spacing:0.3px;">' + label + '</div>'
                + '<div style="font-size:13px;font-weight:900;color:' + color + ';font-family:monospace;">' + val + '</div>'
                + '<div style="font-size:6px;color:#475569;">' + unit + '</div></div>';
            };
            // Return air row
            pg += _psyCell('RETURN DB', rp.dryBulbF !== undefined ? rp.dryBulbF.toFixed(1) : '--', '\u00B0F', '#34d399');
            pg += _psyCell('RETURN WB', rp.wetBulbF !== undefined ? rp.wetBulbF.toFixed(1) : '--', '\u00B0F', '#22d3ee');
            pg += _psyCell('RETURN RH', rp.relativeHumidity !== undefined ? rp.relativeHumidity.toFixed(1) : '--', '%', '#60a5fa');
            pg += _psyCell('DEW POINT', rp.dewPointF !== undefined ? rp.dewPointF.toFixed(1) : '--', '\u00B0F', '#a78bfa');
            if (sp) {
              pg += _psyCell('SUPPLY DB', sp.dryBulbF !== undefined ? sp.dryBulbF.toFixed(1) : '--', '\u00B0F', '#38bdf8');
              pg += _psyCell('SUPPLY WB', sp.wetBulbF !== undefined ? sp.wetBulbF.toFixed(1) : '--', '\u00B0F', '#0ea5e9');
            } else {
              // Single probe — show grains + enthalpy estimate
              if (rp.relativeHumidity !== undefined && rp.dryBulbF !== undefined) {
                var _tC = (rp.dryBulbF - 32) * 5 / 9;
                var _es = 6.112 * Math.exp(17.67 * _tC / (_tC + 243.5));
                var _e = (rp.relativeHumidity / 100) * _es;
                var _W = 0.62198 * (_e * 0.0145038) / (14.696 - _e * 0.0145038);
                var _gr = _W * 7000;
                var _h = 0.240 * rp.dryBulbF + _W * (1061 + 0.444 * rp.dryBulbF);
                pg += _psyCell('GRAINS/lb', _gr.toFixed(1), 'gr', '#fb923c');
                pg += _psyCell('ENTALP\u00CDA', _h.toFixed(1), 'BTU/lb', '#c084fc');
              }
            }
            psyGrid.innerHTML = pg;
          }
        }
        // ── AIR ANALYSIS PANEL AUTO-POPULATE ──
        // Entering (Return) air from psychros[0]
        if (returnDB !== null) _bleSetField('htMfAirEnterDB', returnDB);
        if (returnWB !== null) _bleSetField('htMfAirEnterWB', returnWB);
        if (returnDP !== null) _bleSetField('htMfAirEnterDP', returnDP);
        if (returnRH !== null) _bleSetField('htMfAirEnterRH', returnRH);
        // Leaving (Supply) air from psychros[1]
        if (supplyDB !== null) _bleSetField('htMfAirLeaveDB', supplyDB);
        if (supplyWB !== null) _bleSetField('htMfAirLeaveWB', supplyWB);
        if (supplyDP !== null) _bleSetField('htMfAirLeaveDP', supplyDP);
        if (supplyRH !== null) _bleSetField('htMfAirLeaveRH', supplyRH);
        // Static pressure probe → Pressure WC entering/leaving
        if (staticDev) {
          if (staticDev.returnInWC !== undefined) _bleSetField('htMfAirEnterWC', staticDev.returnInWC);
          if (staticDev.supplyInWC !== undefined) _bleSetField('htMfAirLeaveWC', staticDev.supplyInWC);
          // Direct total ESP if available
          if (staticDev.totalESP !== undefined) {
            var espEl = document.getElementById('htMfTotalESP');
            if (espEl) { espEl.textContent = staticDev.totalESP.toFixed(3); espEl.style.color = '#4ade80'; }
          }
        }
        // Update air status indicator
        var airStat = document.getElementById('htMfAirStatus');
        if (airStat && (psychros.length > 0 || (staticDev && staticDev.totalESP !== undefined))) {
          airStat.textContent = 'EN VIVO \u2022 BLE';
          airStat.style.color = '#4ade80';
        }
        // Trigger enthalpy + totals calculation
        if (typeof window._htMfAirCalc === 'function') window._htMfAirCalc();
        if (typeof window._htMfUpdate === 'function') window._htMfUpdate();
      }

      // ── SUPERHEAT / SUBCOOLING ──
      if (toolId === 'shsc') {
        if (loPSI !== null) _bleSetField('htSHPres', loPSI);
        if (suctionT !== null) _bleSetField('htSHTemp', suctionT);
        if (hiPSI !== null) _bleSetField('htSCPres', hiPSI);
        if (liquidT !== null) _bleSetField('htSCTemp', liquidT);
        if (typeof _htSHCalc === 'function') _htSHCalc();
      }

      // ── SYSTEM ANALYZER ──
      if (toolId === 'sysanalyzer') {
        if (loPSI !== null) _bleSetField('htSASucP', loPSI);
        if (hiPSI !== null) _bleSetField('htSADisP', hiPSI);
        if (suctionT !== null) _bleSetField('htSASucT', suctionT);
        if (liquidT !== null) _bleSetField('htSALiqT', liquidT);
        if (returnDB !== null) _bleSetField('htSAInT', returnDB);
        // Outdoor temp from supply psychrometer if available
        if (supplyDB !== null) _bleSetField('htSAOutT', supplyDB);
        if (typeof _htSACalc === 'function') _htSACalc();
      }

      // ── PSYCHROMETRIC CHART ──
      if (toolId === 'psychart') {
        if (returnDB !== null) _bleSetField('htPsyDB', returnDB);
        if (returnWB !== null) _bleSetField('htPsyWB', returnWB);
        if (returnRH !== null) _bleSetField('htPsyRH', returnRH);
        if (typeof _htPsyCalc === 'function') _htPsyCalc();
      }

      // ── PT CHART — quick lookup by pressure ──
      if (toolId === 'ptchart') {
        if (hiPSI !== null) _bleSetField('htPsigSearch', hiPSI);
        if (typeof _htSearchPsig === 'function') _htSearchPsig();
      }

      // ── MULTIMETER ──
      if (toolId === 'multimeter' || toolId === 'multimeterScreen') {
        if (suctionT !== null) _bleSetField('mmTemp1', suctionT);
        if (liquidT !== null) _bleSetField('mmTemp2', liquidT);
        // SC680 decoded values → auto-populate by mode
        if (meterDev) {
          // Auto-switch dial mode to match SC680's current mode
          var _modeMap = {VAC:'vac',VDC:'vdc',Amps_AC:'aac',Ohms:'ohm',Continuity:'cont',Diode:'diode',uF:'uf',Hz:'hz',Temp:'temp',PF:'watt',NCV:'ncv','3Phase':'ph3',MegOhm:'mohm'};
          var targetMode = _modeMap[meterDev.meterMode] || null;
          if (targetMode && window._htMMMode !== targetMode && typeof window._htMMSetMode === 'function') {
            window._htMMSetMode(targetMode);
          }
          // VAC → Medido V + Watt calc V
          if (meterDev.voltageAC !== undefined) {
            _bleSetField('mmVmeas', meterDev.voltageAC);
            _bleSetField('mmWV', meterDev.voltageAC);
            if (meterDev.voltageAC < 30) _bleSetField('mmV24', meterDev.voltageAC);
          }
          // VDC → DC voltage
          if (meterDev.voltageDC !== undefined) _bleSetField('mmVdc', meterDev.voltageDC);
          // Ohms
          if (meterDev.resistanceOhms !== undefined && typeof meterDev.resistanceOhms === 'number') {
            _bleSetField('mmOhms', meterDev.resistanceOhms);
          }
          // Capacitance
          if (meterDev.capacitanceUF !== undefined) {
            if (meterDev.capacitanceUF > 20) {
              _bleSetField('mmCapM', meterDev.capacitanceUF);
            } else {
              _bleSetField('mmCapFM', meterDev.capacitanceUF);
            }
          }
          // Amps AC (clamp CH2)
          if (meterDev.ampsAC !== undefined) {
            _bleSetField('mmAMeas', meterDev.ampsAC);
            _bleSetField('mmWA', meterDev.ampsAC);
          }
          // Frequency
          if (meterDev.frequencyHz !== undefined) _bleSetField('mmFreq', meterDev.frequencyHz);
          // Micro-amps (flame sensor)
          if (meterDev.microAmps !== undefined) _bleSetField('mmUA', meterDev.microAmps);
          // Power Factor
          if (meterDev.powerFactor !== undefined) _bleSetField('mmWPF', meterDev.powerFactor / 100);
          // Temperature
          if (meterDev.temperatureF !== undefined) _bleSetField('mmTemp1', meterDev.temperatureF);
          if (meterDev.temperatureF_CH2 !== undefined) _bleSetField('mmTemp2', meterDev.temperatureF_CH2);
          // Direct LCD display update — always show live value regardless of input fields
          var vEl = document.getElementById('htMMVal');
          var uEl = document.getElementById('htMMUnit');
          var stEl = document.getElementById('htMMStatus');
          if (vEl && meterDev.meterValue !== undefined && !meterDev.meterIsOL) {
            vEl.textContent = (typeof meterDev.meterValue === 'number') ? meterDev.meterValue.toFixed(1) : meterDev.meterValue;
            vEl.style.color = '#4ade80';
          } else if (vEl && meterDev.meterIsOL) {
            vEl.textContent = 'OL';
            vEl.style.color = '#f87171';
          }
          if (uEl && meterDev.meterUnit) uEl.textContent = meterDev.meterUnit;
          if (stEl) stEl.textContent = 'EN VIVO \u2022 SC680 BLE';
        }
        if (typeof _htMMCalcMode === 'function') _htMMCalcMode();
        // Update SC680 BLE live dashboard panel
        if (typeof window._mmUpdateBLELive === 'function') window._mmUpdateBLELive();
      }

      // ── POWER WHEEL ──
      if (toolId === 'powerwheel') {
        if (meterDev) {
          if (meterDev.voltageAC !== undefined) _bleSetField('htPWV', meterDev.voltageAC);
          if (meterDev.voltageDC !== undefined) _bleSetField('htPWV', meterDev.voltageDC);
          if (meterDev.ampsAC !== undefined) _bleSetField('htPWI', meterDev.ampsAC);
          if (meterDev.resistanceOhms !== undefined && typeof meterDev.resistanceOhms === 'number') _bleSetField('htPWR', meterDev.resistanceOhms);
        }
        if (typeof _htPWCalc === 'function') _htPWCalc();
      }

      // ── REFRIGERANT CHARGE ──
      if (toolId === 'refcharge') {
        // Temperature for recovery estimator
        if (returnDB !== null) _bleSetField('htRCRecTemp', returnDB);
        if (scaleDev && scaleDev.weightLbs !== undefined) _bleSetField('htRCWeight', scaleDev.weightLbs);
      }

      // ── WIRE SIZING — SC680 voltage/amps ──
      if (toolId === 'wiresizing') {
        if (meterDev) {
          if (meterDev.voltageAC !== undefined) _bleSetField('htWSVoltage', meterDev.voltageAC);
          if (meterDev.ampsAC !== undefined) _bleSetField('htWSAmps', meterDev.ampsAC);
        }
      }

      // ── ELECTRICAL LOAD — SC680 voltage ──
      if (toolId === 'elecload') {
        if (meterDev) {
          if (meterDev.voltageAC !== undefined) _bleSetField('htELVoltage', meterDev.voltageAC);
        }
      }

      // ── SYSTEM ANALYZER — SC680 amps feed ──
      if (toolId === 'sysanalyzer') {
        if (meterDev && meterDev.ampsAC !== undefined) _bleSetField('htSAAmps', meterDev.ampsAC);
      }

      // ── TROUBLESHOOT — SC680 voltage/amps/ohms/cap ──
      if (toolId === 'troubleshoot') {
        if (meterDev) {
          if (meterDev.voltageAC !== undefined) _bleSetField('htTSVoltage', meterDev.voltageAC);
          if (meterDev.ampsAC !== undefined) _bleSetField('htTSAmps', meterDev.ampsAC);
          if (meterDev.resistanceOhms !== undefined && typeof meterDev.resistanceOhms === 'number') _bleSetField('htTSResistance', meterDev.resistanceOhms);
          if (meterDev.capacitanceUF !== undefined) _bleSetField('htTSCapacitance', meterDev.capacitanceUF);
        }
      }

      // ── MANOMETER HVAC — FP4258 static pressure auto-populate ──
      // Per memoria feedback_ble_tools: todas las herramientas HVAC integran
      // Fieldpiece BLE. Único hueco real verificado en el audit 2026-05-06.
      // Cubre el tab 2 (Static Pressure) — los otros tabs (Gas Valve, LPS, CFM,
      // Duct Area, Clock Meter, System Perf) no tienen probe Fieldpiece equivalente.
      // Sliders mhSPSupSlider / mhSPRetSlider solo existen cuando el tab está
      // activo, así getElementById regresa null fuera de ahí — degradación graceful.
      if (toolId === 'manometerHvacScreen' || toolId === 'manometerhvac') {
        if (staticDev) {
          // Tab 2: Static Pressure — supply (+) y return (-) sliders
          if (staticDev.supplyInWC !== undefined) {
            var mhSpSup = document.getElementById('mhSPSupSlider');
            if (mhSpSup && document.activeElement !== mhSpSup) {
              var supVal = Math.max(0, Math.min(1.5, staticDev.supplyInWC));
              mhSpSup.value = supVal;
              mhSpSup.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
              mhSpSup.style.accentColor = '#4ade80';
            }
          }
          if (staticDev.returnInWC !== undefined) {
            var mhSpRet = document.getElementById('mhSPRetSlider');
            if (mhSpRet && document.activeElement !== mhSpRet) {
              // Return reportado como negativo por la probe; slider es absoluto 0-1.5
              var retVal = Math.max(0, Math.min(1.5, Math.abs(staticDev.returnInWC)));
              mhSpRet.value = retVal;
              mhSpRet.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
              mhSpRet.style.accentColor = '#4ade80';
            }
          }
          // Trigger el recalc de TESP, fricción, status badge — la función
          // existe sólo si el tab Static Pressure está montado.
          if (typeof window._mhUpdateSP === 'function') window._mhUpdateSP();
        }
        // Tab 0 (Gas Valve) y Tab 1 (LPS) usan inWC range bajo (0-14"WC).
        // Fieldpiece JL3PR / SM480V reportan psig en decenas/cientos — la
        // conversión psig→inWC pondría valores fuera del slider range. Skip
        // intencional para evitar lecturas incorrectas.
      }

      // ── HEATING SCREEN — Calefacción System Performance ──
      if (toolId === 'heatingScreen') {
        // SM480V / pressure probes → pressures + slider + LCD sync
        if (hiPSI !== null) {
          var hHiInp = document.getElementById('htHeatHiInput');
          var hHiSlr = document.getElementById('htHeatHiPsi');
          var hHiLCD = document.getElementById('htHeatHiLCD');
          var hHiR = Math.round(hiPSI * 10) / 10;
          if (hHiInp && document.activeElement !== hHiInp) { hHiInp.value = hHiR; hHiInp.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)'; hHiInp.style.borderColor = 'rgba(74,222,128,0.4)'; }
          if (hHiSlr) hHiSlr.value = hHiR;
          if (hHiLCD) { hHiLCD.textContent = hHiR.toFixed(1); hHiLCD.style.textShadow = '0 0 16px rgba(74,222,128,0.6)'; }
        }
        if (loPSI !== null) {
          var hLoInp = document.getElementById('htHeatLoInput');
          var hLoSlr = document.getElementById('htHeatLoPsi');
          var hLoLCD = document.getElementById('htHeatLoLCD');
          var hLoR = Math.round(loPSI * 10) / 10;
          if (hLoInp && document.activeElement !== hLoInp) { hLoInp.value = hLoR; hLoInp.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)'; hLoInp.style.borderColor = 'rgba(74,222,128,0.4)'; }
          if (hLoSlr) hLoSlr.value = hLoR;
          if (hLoLCD) { hLoLCD.textContent = hLoR.toFixed(1); hLoLCD.style.textShadow = '0 0 16px rgba(74,222,128,0.6)'; }
        }
        // Pipe clamps → suction + liquid line temps
        if (suctionT !== null) _bleSetField('htHeatSuctionT', suctionT);
        if (liquidT !== null) _bleSetField('htHeatLiquidT', liquidT);
        // JL3RH psychrometer → air analysis + indoor/supply temps
        if (returnDB !== null) { _bleSetField('htHeatIndoorT', returnDB); _bleSetField('htHeatAirEnterDB', returnDB); }
        if (returnWB !== null) _bleSetField('htHeatAirEnterWB', returnWB);
        if (returnRH !== null) _bleSetField('htHeatAirEnterRH', returnRH);
        if (supplyDB !== null) { _bleSetField('htHeatSupplyT', supplyDB); _bleSetField('htHeatAirLeaveDB', supplyDB); }
        if (supplyWB !== null) _bleSetField('htHeatAirLeaveWB', supplyWB);
        if (supplyRH !== null) _bleSetField('htHeatAirLeaveRH', supplyRH);
        // Static pressure → air analysis ESP fields
        if (staticDev) {
          if (staticDev.pressureWC !== undefined) _bleSetField('htHeatAirEnterWC', Math.abs(staticDev.pressureWC));
          if (staticDev.pressureWC_CH2 !== undefined) _bleSetField('htHeatAirLeaveWC', Math.abs(staticDev.pressureWC_CH2));
        }
        // SC680 multimeter → electrical section
        if (meterDev) {
          if (meterDev.voltageAC !== undefined) _bleSetField('htHeatVoltage', meterDev.voltageAC);
          if (meterDev.ampsAC !== undefined) _bleSetField('htHeatAmps', meterDev.ampsAC);
          if (meterDev.capacitanceUF !== undefined) _bleSetField('htHeatCapuF', meterDev.capacitanceUF);
          if (meterDev.resistanceOhms !== undefined && typeof meterDev.resistanceOhms === 'number') _bleSetField('htHeatOhms', meterDev.resistanceOhms);
          if (meterDev.temperatureF !== undefined) _bleSetField('htHeatTempF', meterDev.temperatureF);
          // Calculate watts if V and A available
          var hV = meterDev.voltageAC, hA = meterDev.ampsAC;
          if (hV !== undefined && hA !== undefined) _bleSetField('htHeatWatts', Math.round(hV * hA));
          // Micro-amps → flame sensor (for gas heat diagnostics)
          if (meterDev.microAmps !== undefined) {
            var flameEl = document.getElementById('htHeatFlameUA');
            if (flameEl) { flameEl.value = meterDev.microAmps.toFixed(1); flameEl.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)'; }
          }
          // Update BLE status
          var hElecSt = document.getElementById('htHeatElecStatus');
          if (hElecSt) { hElecSt.innerHTML = '<span style="color:#4ade80;">EN VIVO \u2022 SC680</span>'; }
        }
        // SDMN6 manometer → draft / gas pressure (static pressure probes)
        if (staticDev) {
          // SDMN6 P1 → draft measurement
          if (staticDev.pressureWC !== undefined) {
            var draftEl = document.getElementById('htHeatDraft');
            if (draftEl && document.activeElement !== draftEl) {
              draftEl.value = staticDev.pressureWC.toFixed(3);
              draftEl.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
            }
          }
          // SDMN6 P2 → gas manifold pressure
          if (staticDev.pressureWC_CH2 !== undefined) {
            var gasPEl = document.getElementById('htHeatGasPressure');
            if (gasPEl && document.activeElement !== gasPEl) {
              gasPEl.value = Math.abs(staticDev.pressureWC_CH2).toFixed(2);
              gasPEl.style.boxShadow = '0 0 6px rgba(74,222,128,0.5)';
            }
          }
        }
        // Trigger recalculation
        if (typeof window._htHeatUpdate === 'function') window._htHeatUpdate();
        if (typeof window._htHeatAirCalc === 'function') window._htHeatAirCalc();
        if (typeof window._htHeatCOUpdate === 'function') window._htHeatCOUpdate();
      }
    };

    // Track LIVE mode state per screen + which device is "linked"
    // ═══════════════════════════════════════════════════════════════
    // BLE BAR: Multi-device inline connection + LIVE mode + Reports
    // ═══════════════════════════════════════════════════════════════
    var _bleLiveScreens = {};
    var _bleLinkedDevices = {}; // contextKey → { uuid: true, uuid2: true }

    var _bleFriendlyName = {
      // Fieldpiece Job Link probes
      JL3PR: 'Sonda de Presi\u00F3n', JL3PC: 'Pipe Clamp (Temp. Tubo)',
      JL3RH: 'Psicr\u00F3metro (Humedad)', JL3KM3: 'Termopar Tipo K',
      JL2: 'Job Link Probe',
      // Manifolds
      SM480V: 'Manifold Digital', SMAN360: 'Manifold Digital',
      SMAN460: 'Manifold Inal\u00E1mbrico', SMAN: 'Manifold Digital',
      // Meters & sensors
      SC680: 'Mult\u00EDmetro Inal\u00E1mbrico', SC480: 'Amper\u00EDmetro',
      SC260: 'Amper\u00EDmetro Compacto', SC440: 'Amper\u00EDmetro',
      SC660: 'Amper\u00EDmetro', SDP2: 'Man\u00F3metro Diferencial',
      SDP: 'Man\u00F3metro Diferencial',
      SVG3: 'Vacu\u00F3metro Digital', SVG: 'Vacu\u00F3metro Digital',
      SRS3: 'B\u00E1scula de Refrigerante', SRS: 'B\u00E1scula de Refrigerante',
      SSX34: 'Superheat/Subcooling', ATH5: 'Temp/Humedad Aire',
      ATH4: 'Temp/Humedad Aire', HPG2: 'Man\u00F3metro de Alta',
      // Combustion & CO
      'FP-424B': 'Analizador de Combusti\u00F3n', 'FP-424': 'Analizador de Combusti\u00F3n',
      SOX3: 'Analizador de Combusti\u00F3n', CAT85: 'Analizador de Combusti\u00F3n',
      'FP-4258': 'Presi\u00F3n Est\u00E1tica',
      // Testo
      T557: 'Manifold Testo 557', T550: 'Manifold Testo 550'
    };
    var _bleCatIcon = {
      multimeter: '\uD83D\uDD0C', manifold: '\uD83D\uDD34', pressure: '\uD83D\uDCA8',
      pipeclamp: '\uD83C\uDF21', psychrometer: '\uD83C\uDF2B', staticpressure: '\uD83C\uDF2C',
      scale: '\u2696', vacuum: '\uD83C\uDF0A'
    };

    window._injectBLEToolbar = _injectBLEBar;
    window._injectBLEBar = _injectBLEBar;
    function _injectBLEBar(screenId, toolId) {
      if (typeof MaestroBLE === 'undefined') {
        if (window.MaestroLoader) {
          MaestroLoader.load(['js/ble-manager.js']).then(function() { _injectBLEBar(screenId, toolId); });
        }
        return;
      }
      setTimeout(function() {
        var scr = document.getElementById(screenId);
        if (!scr) return;
        var old = scr.querySelector('.ble-bar-wrap');
        if (old) old.remove();
        old = scr.querySelector('.ble-bar');
        if (old) old.remove();
        old = scr.querySelector('.ble-toolbar');
        if (old) old.remove();
        var toolRoot = scr.firstElementChild || scr;
        var stickyHeader = toolRoot.querySelector('[style*="sticky"]');

        var barId = 'bleBar_' + screenId;
        var listId = 'bleList_' + screenId;
        var contextKey = toolId || screenId;
        var showCats = _bleToolbarContextMap[contextKey] || null;
        if (!_bleLinkedDevices[contextKey]) _bleLinkedDevices[contextKey] = {};

        var wrap = document.createElement('div');
        wrap.className = 'ble-bar-wrap';
        wrap.style.cssText = 'margin:6px 12px;z-index:5;';
        var bar = document.createElement('div');
        bar.className = 'ble-bar';
        bar.id = barId;
        bar.style.cssText = 'background:rgba(15,23,42,0.95);border:1px solid rgba(100,116,139,0.25);border-radius:10px;padding:6px 12px;display:flex;align-items:center;gap:6px;min-height:32px;flex-wrap:wrap;';
        var list = document.createElement('div');
        list.id = listId;
        list.style.cssText = 'display:none;background:rgba(15,23,42,0.97);border:1px solid rgba(96,165,250,0.2);border-top:none;border-radius:0 0 10px 10px;padding:0;max-height:220px;overflow-y:auto;';
        wrap.appendChild(bar);
        wrap.appendChild(list);

        // All FP devices matching this screen
        function _findMatchedDevices() {
          var fp = window._fpDevices;
          if (!fp) return [];
          var r = [];
          for (var uid in fp) {
            var d = fp[uid];
            if (d._stale) continue;
            if (!showCats || showCats.indexOf(d.probeCategory) !== -1) r.push(d);
          }
          return r;
        }
        // Linked (live) devices
        function _getLinkedDevices() {
          var linked = _bleLinkedDevices[contextKey];
          if (!linked) return [];
          var fp = window._fpDevices;
          if (!fp) return [];
          var r = [];
          for (var uid in linked) {
            if (fp[uid] && !fp[uid]._stale) r.push(fp[uid]);
          }
          return r;
        }
        function _isLinked(uid) { return !!(_bleLinkedDevices[contextKey] && _bleLinkedDevices[contextKey][uid]); }
        function _getGATTDevices() {
          var devs = MaestroBLE.getDevices ? MaestroBLE.getDevices() : [];
          var _hvacPrefixes = ['T557','T550','Testo','testo','Fieldpiece','FP-','JL3','JL2','SMAN','SRS','SDP','SC6','SC4','SM4','SVG','Mastercool','Yellow Jacket','YJ-','Supco','Nest','ecobee','Honeywell','Resideo','Sensi','Emerson','Carrier','Bryant','Lennox','Daikin','Mitsubishi'];
          return devs.filter(function(d) {
            if (!d.name || d.name === 'Unknown') return false;
            if (d.isKnownTool || d.isFieldpiece || d.hasTestoService) return true;
            var n = d.name.toLowerCase();
            for (var i = 0; i < _hvacPrefixes.length; i++) {
              if (n.indexOf(_hvacPrefixes[i].toLowerCase()) !== -1) return true;
            }
            return false;
          });
        }
        function _isScanning() { return MaestroBLE.isScanning ? MaestroBLE.isScanning() : (MaestroBLE._scanning || false); }

        // Device info one-liner
        // Fix #9: Guard .toFixed() calls against undefined/NaN values after sanitization
        function _safeFixed(val, digits) {
          if (val === undefined || val === null || typeof val !== 'number' || !isFinite(val)) return '--';
          return val.toFixed(digits);
        }
        function _devInfo(d) {
          if (d.meterMode) return d.meterMode + (d.meterValue !== undefined && !d.meterIsOL ? ' ' + _safeFixed(d.meterValue, 1) + (d.meterUnit || '') : d.meterIsOL ? ' OL' : '');
          if (d.highPSI !== undefined) return _safeFixed(d.highPSI, 0) + '/' + _safeFixed(d.lowPSI || 0, 0) + ' PSI';
          if (d.pressurePSI !== undefined) return _safeFixed(d.pressurePSI, 0) + ' PSI';
          if (d.temperatureF !== undefined) return _safeFixed(d.temperatureF, 1) + '\u00B0F';
          if (d.dryBulbF !== undefined) return _safeFixed(d.dryBulbF, 1) + '\u00B0F DB' + (d.relativeHumidity ? ' / ' + _safeFixed(d.relativeHumidity, 0) + '% RH' : '');
          if (d.weightLbs !== undefined) return _safeFixed(d.weightLbs, 1) + ' lb';
          if (d.totalESP !== undefined) return _safeFixed(d.totalESP, 2) + ' inWC';
          return '';
        }

        // ── Render device list ──
        function _renderDeviceList() {
          var el = document.getElementById(listId);
          if (!el) return;
          var fpDevices = _findMatchedDevices();
          var gattDevices = _getGATTDevices();
          if (fpDevices.length === 0 && gattDevices.length === 0) {
            el.style.display = _isScanning() ? 'block' : 'none';
            if (_isScanning()) {
              var _sT = (window._t ? window._t('ble_searching', 'Buscando dispositivos...') : 'Buscando dispositivos...');
              el.innerHTML = '<div style="padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;text-align:center;">' + _sT + '</div>';
            }
            return;
          }
          var h = '';
          // "Conectar Todos" button if >1 unlinked
          var unlinkedCount = 0;
          for (var ci = 0; ci < fpDevices.length; ci++) { if (!_isLinked(fpDevices[ci]._uuid || ('fp_' + ci))) unlinkedCount++; }
          if (unlinkedCount > 1) {
            h += '<div style="padding:8px 14px;border-bottom:1px solid rgba(100,116,139,0.15);text-align:center;">';
            h += '<button onclick="window._bleBarLinkAll(\'' + contextKey.replace(/'/g, "\\'") + '\')" style="background:linear-gradient(135deg,#FF6B35,#e55a2b);color:#fff;border:none;padding:5px 18px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">Conectar Todos (' + fpDevices.length + ')</button>';
            h += '</div>';
          }
          for (var i = 0; i < fpDevices.length; i++) {
            var d = fpDevices[i];
            var uid = d._uuid || ('fp_' + i);
            var name = _bleFriendlyName[d.probeName] || d.probeName || d.probeCategory;
            var shortId = (d._uuid || '').slice(-4).toUpperCase();
            var linked = _isLinked(uid);
            var info = _devInfo(d);
            var icon = _bleCatIcon[d.probeCategory] || '\uD83D\uDCF6';
            h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid rgba(100,116,139,0.1);">';
            h += '<span style="font-size:14px;flex-shrink:0;">' + icon + '</span>';
            h += '<div style="flex:1;min-width:0;">';
            h += '<div style="font-size:11px;font-weight:600;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + (shortId ? ' <span style="color:#64748b;font-weight:400;">#' + shortId + '</span>' : '') + '</div>';
            if (info) h += '<div style="font-size:9px;color:#94a3b8;margin-top:1px;">' + info + '</div>';
            h += '</div>';
            if (linked) {
              h += '<span style="background:rgba(74,222,128,0.15);color:#4ade80;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;">EN VIVO</span>';
              h += '<button onclick="window._bleBarUnlinkOne(\'' + contextKey.replace(/'/g, "\\'") + '\',\'' + uid.replace(/'/g, "\\'") + '\')" style="background:none;border:1px solid rgba(100,116,139,0.2);color:#64748b;padding:2px 6px;border-radius:4px;font-size:8px;cursor:pointer;">x</button>';
            } else {
              h += '<button onclick="window._bleBarLink(\'' + contextKey.replace(/'/g, "\\'") + '\',\'' + uid.replace(/'/g, "\\'") + '\')" style="background:linear-gradient(135deg,#FF6B35,#e55a2b);color:#fff;border:none;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:700;cursor:pointer;">Conectar</button>';
            }
            h += '</div>';
          }
          // GATT devices
          for (var gi = 0; gi < gattDevices.length; gi++) {
            var gd = gattDevices[gi];
            var _connDevs = (MaestroBLE.getConnectedDevices && MaestroBLE.getConnectedDevices()) || {};
            var isConn = !!_connDevs[gd.uuid] || (MaestroBLE.getConnected() && MaestroBLE.getConnected().uuid === gd.uuid);
            h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid rgba(100,116,139,0.1);">';
            h += '<span style="font-size:14px;flex-shrink:0;">\uD83D\uDCF6</span>';
            h += '<div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:#e2e8f0;">' + (gd.name || 'Dispositivo') + '</div></div>';
            h += isConn ? '<span style="background:rgba(74,222,128,0.15);color:#4ade80;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;">Conectado</span>'
                        : '<button onclick="MaestroBLE.connect(\'' + gd.uuid + '\')" style="background:linear-gradient(135deg,#FF6B35,#e55a2b);color:#fff;border:none;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:700;cursor:pointer;">Conectar</button>';
            h += '</div>';
          }
          el.innerHTML = h;
          el.style.display = h ? 'block' : 'none';
        }

        // ── Render bar header ──
        function _renderBar() {
          var el = document.getElementById(barId);
          if (!el) return false;
          var linkedDevs = _getLinkedDevices();
          var scanning = _isScanning();
          var allMatched = _findMatchedDevices();
          var liveCount = linkedDevs.length;

          if (liveCount > 0) {
            // ── LIVE state: green — single or multi ──
            el.style.borderColor = 'rgba(74,222,128,0.4)';
            var h = '<div style="width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80;flex-shrink:0;"></div>';
            if (liveCount === 1) {
              var d = linkedDevs[0];
              var dn = _bleFriendlyName[d.probeName] || d.probeName || 'Dispositivo';
              var sid = (d._uuid || '').slice(-4).toUpperCase();
              h += '<span style="color:#e2e8f0;font-size:11px;font-weight:600;flex:1;">' + dn + (sid ? ' #' + sid : '') + ' \u00B7 ' + (_devInfo(d) || '') + '</span>';
            } else {
              // Multi-device summary
              var names = [];
              for (var li = 0; li < linkedDevs.length; li++) names.push(linkedDevs[li].probeName || linkedDevs[li].probeCategory);
              h += '<span style="color:#e2e8f0;font-size:11px;font-weight:600;flex:1;">' + liveCount + ' herramientas: ' + names.join(', ') + '</span>';
            }
            h += '<span style="background:rgba(74,222,128,0.15);color:#4ade80;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:0.5px;">EN VIVO</span>';
            // Toggle expand/collapse device list
            h += '<button onclick="window._bleBarToggleList(\'' + listId + '\',\'' + barId + '\')" style="background:none;border:1px solid rgba(100,116,139,0.3);color:#94a3b8;padding:3px 8px;border-radius:6px;font-size:9px;cursor:pointer;">\u25BC</button>';
            // Report button
            h += '<button onclick="window._bleGenerateReport()" style="background:linear-gradient(135deg,#22d3ee,#0891b2);color:#fff;border:none;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:700;cursor:pointer;">Reporte</button>';
            el.innerHTML = h;
            el.style.borderRadius = '10px';
            // Keep list hidden unless toggled
            if (!_bleLiveScreens[contextKey]) {
              _bleLiveScreens[contextKey] = true;
              _bleLiveSetFieldsReadOnly(screenId, true);
            }
          } else if (scanning || allMatched.length > 0) {
            // ── Scanning / Devices found: blue ──
            el.style.borderColor = 'rgba(96,165,250,0.4)';
            var statusTxt = scanning ? 'Escaneando...' : (allMatched.length + ' dispositivo' + (allMatched.length > 1 ? 's' : '') + ' encontrado' + (allMatched.length > 1 ? 's' : ''));
            el.innerHTML =
              '<div style="width:8px;height:8px;border-radius:50%;background:#60a5fa;flex-shrink:0;' + (scanning ? 'box-shadow:0 0 6px #60a5fa;animation:blePulse 1.2s ease-in-out infinite;' : 'box-shadow:0 0 4px #60a5fa;') + '"></div>' +
              '<span style="color:#ffffff;font-size:14px;font-weight:700;flex:1;">' + statusTxt + '</span>' +
              (scanning ? '<button onclick="window._bleBarStopScan()" style="background:#ffffff;border:1px solid rgba(96,165,250,0.6);color:#111111;padding:5px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Parar</button>'
                        : '<button onclick="window._bleBarStartScan()" style="background:#ffffff;border:1px solid rgba(96,165,250,0.6);color:#111111;padding:5px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Buscar</button>');
            el.style.borderRadius = '10px 10px 0 0';
            _renderDeviceList();
            if (_bleLiveScreens[contextKey]) {
              _bleLiveScreens[contextKey] = false;
              _bleLiveSetFieldsReadOnly(screenId, false);
            }
          } else {
            // ── Idle state: cyan BLE bar — prominent, auto-scan ready ──
            // On Android web (non-native), Fieldpiece beacons can't be parsed
            // by Web Bluetooth — force help button so users know why.
            var _bleNative = typeof MaestroBLE !== 'undefined' && MaestroBLE.getMode && MaestroBLE.getMode() === 'native';
            var _bleAndroidWeb = typeof MaestroBLE !== 'undefined' && MaestroBLE.isAndroid && MaestroBLE.isAndroid() && !_bleNative;
            var _bleAvail = typeof MaestroBLE !== 'undefined' && MaestroBLE.isAvailable && MaestroBLE.isAvailable() && !_bleAndroidWeb;
            el.style.borderColor = 'rgba(34,211,238,0.35)';
            el.innerHTML =
              '<div style="width:8px;height:8px;border-radius:50%;background:#22d3ee;flex-shrink:0;"></div>' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22d3ee" stroke-width="2" style="flex-shrink:0;"><path d="M6.5 6.5l11 11M6.5 17.5l11-11M12 2v20"/></svg>' +
              '<span style="color:#94a3b8;font-size:11px;font-weight:600;flex:1;">Bluetooth HVAC Tools</span>' +
              (_bleAvail
                ? '<button onclick="window._bleBarStartScan()" style="background:linear-gradient(135deg,#22d3ee,#0891b2);color:#fff;border:none;padding:4px 14px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">Buscar</button>'
                : '<button onclick="window._bleShowHelp()" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">\u00BFPor qu\u00E9 no funciona?</button>');
            el.style.borderRadius = '10px';
            var listEl2 = document.getElementById(listId);
            if (listEl2) listEl2.style.display = 'none';
            if (_bleLiveScreens[contextKey]) {
              _bleLiveScreens[contextKey] = false;
              _bleLiveSetFieldsReadOnly(screenId, false);
            }
          }
          return liveCount > 0;
        }

        // Insert into DOM
        if (stickyHeader && stickyHeader.parentNode) {
          stickyHeader.parentNode.insertBefore(wrap, stickyHeader.nextSibling);
        } else {
          toolRoot.insertBefore(wrap, toolRoot.children[1] || toolRoot.firstChild);
        }
        if (!document.getElementById('blePulseCSS')) {
          var style = document.createElement('style');
          style.id = 'blePulseCSS';
          style.textContent = '@keyframes blePulse{0%,100%{opacity:1}50%{opacity:0.3}}';
          document.head.appendChild(style);
        }

        _renderBar();

        // Auto-scan on first appearance if BLE is available and not already scanning
        if (MaestroBLE.isAvailable && MaestroBLE.isAvailable() && !_isScanning() && _findMatchedDevices().length === 0) {
          setTimeout(function() { try { MaestroBLE.scan(); } catch(e) {} }, 600);
        }

        // Data listener
        var _onData = function(d) {
          if (!document.getElementById(barId)) { MaestroBLE.off('data', _onData); return; }
          // Auto-link Fieldpiece beacon devices (no manual tap needed)
          if (d.source === 'fieldpiece' && d.uuid) {
            if (!_bleLinkedDevices[contextKey]) _bleLinkedDevices[contextKey] = {};
            if (!_bleLinkedDevices[contextKey][d.uuid]) {
              _bleLinkedDevices[contextKey][d.uuid] = true;
            }
          }
          _renderBar();
          // Always auto-populate when Fieldpiece data arrives OR linked devices exist
          if (typeof window._bleAutoPopulate === 'function') {
            if (d.source === 'fieldpiece' || _getLinkedDevices().length > 0 || MaestroBLE.getConnected()) {
              window._bleAutoPopulate(toolId || screenId);
            }
          }
        };
        MaestroBLE.on('data', _onData);
        var _onDevice = function() {
          if (!document.getElementById(barId)) { MaestroBLE.off('device', _onDevice); return; }
          _renderDeviceList();
        };
        MaestroBLE.on('device', _onDevice);
        var _onScanState = function() {
          if (!document.getElementById(barId)) { MaestroBLE.off('scanning', _onScanState); return; }
          _renderBar();
        };
        MaestroBLE.on('scanning', _onScanState);
        var _staleInterval = setInterval(function() {
          if (!document.getElementById(barId)) { clearInterval(_staleInterval); return; }
          var wasLive = _bleLiveScreens[contextKey];
          _renderBar();
          if (wasLive && !_bleLiveScreens[contextKey]) _bleLiveSetFieldsReadOnly(screenId, false);
        }, 1000);
        var _onConn = function() { clearInterval(_staleInterval); _injectBLEBar(screenId, toolId); MaestroBLE.off('connected', _onConn); };
        var _onDisc = function() {
          clearInterval(_staleInterval);
          _bleLiveScreens[contextKey] = false;
          _bleLiveSetFieldsReadOnly(screenId, false);
          _injectBLEBar(screenId, toolId);
          MaestroBLE.off('disconnected', _onDisc);
        };
        MaestroBLE.on('connected', _onConn);
        MaestroBLE.on('disconnected', _onDisc);
      }, 400);
    }

    function _bleLiveSetFieldsReadOnly(screenId, readOnly) {
      var scr = document.getElementById(screenId);
      if (!scr) return;
      var inputs = scr.querySelectorAll('input[type="number"], input[type="text"], input[type="tel"]');
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (readOnly) {
          if (inp.value && inp.value !== '0' && inp.value !== '') {
            inp.dataset.bleLocked = '1'; inp.readOnly = true;
            inp.style.opacity = '0.85'; inp.style.borderColor = 'rgba(74,222,128,0.3)';
          }
        } else {
          if (inp.dataset.bleLocked === '1') {
            delete inp.dataset.bleLocked; inp.readOnly = false;
            inp.style.opacity = ''; inp.style.borderColor = '';
          }
        }
      }
    }

    // ── Global BLE bar helpers ──
    window._bleBarStartScan = function() { if (typeof MaestroBLE !== 'undefined') MaestroBLE.scan(); };
    window._bleBarStopScan = function() { if (typeof MaestroBLE !== 'undefined') MaestroBLE.stopScan(); };

    // Show diagnostic help when BLE unavailable — explains platform-specific reason
    window._bleShowHelp = function() {
      var diag = (typeof MaestroBLE !== 'undefined' && MaestroBLE.getDiagnostic)
        ? MaestroBLE.getDiagnostic()
        : { title: 'Bluetooth', message: 'No disponible en este navegador.', action: null };
      var actionBtn = diag.action && diag.actionUrl
        ? '<a href="' + diag.actionUrl + '" target="_blank" rel="noopener" style="display:inline-block;background:linear-gradient(135deg,#E8591C,#c54911);color:#fff;padding:10px 20px;border-radius:8px;font-weight:700;text-decoration:none;margin-top:12px;">' + diag.action + '</a>'
        : '';
      var platformTag = diag.platform
        ? '<div style="margin-top:10px;font-size:10px;color:#64748b;font-family:monospace;">[' + diag.platform + ']</div>'
        : '';
      var overlay = document.createElement('div');
      overlay.id = '_bleHelpOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:14px;padding:22px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.4);">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
            '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;">\u26A0</div>' +
            '<h3 style="margin:0;color:#111;font-size:17px;font-weight:800;">' + diag.title + '</h3>' +
          '</div>' +
          '<p style="margin:0;color:#111;font-size:14px;line-height:1.5;">' + diag.message + '</p>' +
          actionBtn +
          platformTag +
          '<button onclick="document.getElementById(\'_bleHelpOverlay\').remove()" style="display:block;width:100%;margin-top:14px;background:#f3f4f6;border:none;padding:10px;border-radius:8px;font-weight:700;color:#111;font-size:13px;cursor:pointer;">Cerrar</button>' +
        '</div>';
      overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    };

    // Link one device
    window._bleBarLink = function(contextKey, uid) {
      if (!_bleLinkedDevices[contextKey]) _bleLinkedDevices[contextKey] = {};
      _bleLinkedDevices[contextKey][uid] = true;
      // Trigger beacon mode + connected state so SC680/SM480V/JL3 etc. flip
      // from "Conectar" to "EN VIVO" immediately and the 9s rescan keeps
      // their advertisement data flowing.
      if (typeof MaestroBLE !== 'undefined' && MaestroBLE.connect) {
        try { MaestroBLE.connect(uid); } catch(e) {}
      }
    };
    // Unlink one device
    window._bleBarUnlinkOne = function(contextKey, uid) {
      if (_bleLinkedDevices[contextKey]) delete _bleLinkedDevices[contextKey][uid];
    };
    // Link ALL matched devices.
    // For Fieldpiece beacons we call MaestroBLE.connect(uid) per device so each
    // registers in _connectedDevices and fires the 'connected' event (drives the
    // "Conectado" badge). enableBeaconMode() first guarantees scan + 9s rescan
    // are running before any connect() lands, so beacons don't go stale.
    window._bleBarLinkAll = function(contextKey) {
      var fp = window._fpDevices;
      if (!fp) return;
      var showCats = _bleToolbarContextMap[contextKey] || null;
      if (!_bleLinkedDevices[contextKey]) _bleLinkedDevices[contextKey] = {};
      if (typeof MaestroBLE !== 'undefined' && MaestroBLE.enableBeaconMode) {
        try { MaestroBLE.enableBeaconMode(); } catch(e) {}
      }
      for (var uid in fp) {
        if (fp[uid]._stale) continue;
        if (!showCats || showCats.indexOf(fp[uid].probeCategory) !== -1) {
          _bleLinkedDevices[contextKey][uid] = true;
          if (typeof MaestroBLE !== 'undefined' && MaestroBLE.connect) {
            try { MaestroBLE.connect(uid); } catch(e) {}
          }
        }
      }
    };
    // Unlink all
    window._bleBarUnlinkAll = function(contextKey, screenId) {
      _bleLinkedDevices[contextKey] = {};
      _bleLiveScreens[contextKey] = false;
      if (screenId) _bleLiveSetFieldsReadOnly(screenId, false);
      if (typeof MaestroBLE !== 'undefined' && MaestroBLE.getConnected()) MaestroBLE.disconnect();
    };
    // Toggle device list visibility
    window._bleBarToggleList = function(listId, barId) {
      var el = document.getElementById(listId);
      if (!el) return;
      if (el.style.display === 'none' || !el.style.display) {
        el.style.display = 'block';
        // Re-render to show current state
        var barEl = document.getElementById(barId);
        if (barEl) barEl.style.borderRadius = '10px 10px 0 0';
      } else {
        el.style.display = 'none';
        var barEl2 = document.getElementById(barId);
        if (barEl2) barEl2.style.borderRadius = '10px';
      }
    };
    // Backward compat
    window._bleBarScan = window._bleBarStartScan;
    window._bleBarDisconnect = function(screenId) { window._bleBarUnlinkAll(screenId, screenId); };

    // ═══════════════════════════════════════════════════════════════
    // DIAGNOSTIC REPORT GENERATOR — from all live BLE data
    // ═══════════════════════════════════════════════════════════════
    window._bleGenerateReport = function() {
      var fp = window._fpDevices;
      if (!fp || Object.keys(fp).length === 0) { window.showToast((window._t ? window._t('ble_no_devices', 'No hay dispositivos conectados') : 'No hay dispositivos conectados'), 'warning'); return; }

      var now = new Date();
      var dateStr = now.toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' });
      var timeStr = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
      var techName = localStorage.getItem('tecnico_nombre') || localStorage.getItem('studentName') || 'T\u00E9cnico';

      // Collect all readings by category
      var pressures = [], pipeClamps = [], psychros = [], manifolds = [], meters = [], statics = [], scales = [];
      for (var uid in fp) {
        var d = fp[uid];
        if (d._stale) continue;
        if (d.probeCategory === 'pressure') pressures.push(d);
        if (d.probeCategory === 'pipeclamp') pipeClamps.push(d);
        if (d.probeCategory === 'psychrometer') psychros.push(d);
        if (d.probeCategory === 'manifold') manifolds.push(d);
        if (d.probeCategory === 'multimeter') meters.push(d);
        if (d.probeCategory === 'staticpressure') statics.push(d);
        if (d.probeCategory === 'scale') scales.push(d);
      }
      pressures.sort(function(a,b){ return b.pressurePSI - a.pressurePSI; });
      pipeClamps.sort(function(a,b){ return b.temperatureF - a.temperatureF; });

      // Build report HTML
      var r = '';
      var _sec = function(title) { return '<div style="font-size:13px;font-weight:700;color:#E8591C;margin:14px 0 6px;border-bottom:1px solid #E7E5DE;padding-bottom:4px;">' + title + '</div>'; };
      var _row = function(label, val, unit) { return val !== undefined && val !== null ? '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px;"><span style="color:#6B6B66;font-weight:500;">' + label + '</span><span style="color:#0F0F0F;font-weight:600;">' + val + ' <span style="color:#6B6B66;font-weight:400;">' + (unit || '') + '</span></span></div>' : ''; };

      r += '<div style="text-align:center;margin-bottom:12px;">';
      r += '<div style="font-size:18px;font-weight:800;color:#FF6B35;">REPORTE DIAGN\u00D3STICO HVAC</div>';
      r += '<div style="font-size:11px;color:#57574F;margin-top:4px;">' + dateStr + ' \u00B7 ' + timeStr + '</div>';
      r += '<div style="font-size:12px;color:#3D3D3A;margin-top:2px;">T\u00E9cnico: ' + techName + '</div>';
      r += '<div style="font-size:10px;color:#64748b;margin-top:2px;">' + Object.keys(fp).length + ' herramientas conectadas</div>';
      r += '</div>';

      // ── Pressures ──
      if (pressures.length > 0 || manifolds.length > 0) {
        r += _sec('PRESIONES');
        var hp = pressures.length >= 1 ? pressures[0].pressurePSI : (manifolds.length > 0 ? manifolds[0].highPSI : null);
        var lp = pressures.length >= 2 ? pressures[pressures.length-1].pressurePSI : (manifolds.length > 0 ? manifolds[0].lowPSI : null);
        r += _row('High Side (HP)', hp !== null ? hp.toFixed(1) : null, 'PSI');
        r += _row('Low Side (LP)', lp !== null ? lp.toFixed(1) : null, 'PSI');
        if (manifolds.length > 0) {
          var m = manifolds[0];
          r += _row('SM480V HP', m.highPSI !== undefined ? m.highPSI.toFixed(1) : null, 'PSI');
          r += _row('SM480V LP', m.lowPSI !== undefined ? m.lowPSI.toFixed(1) : null, 'PSI');
        }
      }

      // ── Temperatures ──
      if (pipeClamps.length > 0 || manifolds.length > 0 || psychros.length > 0) {
        r += _sec('TEMPERATURAS');
        if (pipeClamps.length >= 1) r += _row('Liquid Line', pipeClamps[0].temperatureF.toFixed(1), '\u00B0F');
        if (pipeClamps.length >= 2) r += _row('Suction Line', pipeClamps[1].temperatureF.toFixed(1), '\u00B0F');
        if (manifolds.length > 0) {
          var m2 = manifolds[0];
          if (m2.liquidTempF !== undefined) r += _row('SM480V Liquid', m2.liquidTempF.toFixed(1), '\u00B0F');
          if (m2.suctionTempF !== undefined) r += _row('SM480V Suction', m2.suctionTempF.toFixed(1), '\u00B0F');
        }
        if (psychros.length >= 1) {
          r += _row('Return Air (DB)', psychros[0].dryBulbF.toFixed(1), '\u00B0F');
          if (psychros[0].wetBulbF) r += _row('Return Air (WB)', psychros[0].wetBulbF.toFixed(1), '\u00B0F');
          if (psychros[0].relativeHumidity) r += _row('Humedad Relativa', psychros[0].relativeHumidity.toFixed(0), '%');
        }
        if (psychros.length >= 2) {
          r += _row('Supply Air (DB)', psychros[1].dryBulbF.toFixed(1), '\u00B0F');
          var dt = Math.abs(psychros[0].dryBulbF - psychros[1].dryBulbF);
          r += _row('\u0394T (Split)', dt.toFixed(1), '\u00B0F');
        }
      }

      // ── SH / SC / System Analysis ──
      var cv = window._htMfCalcValues;
      if (cv && (cv.sh !== null || cv.sc !== null)) {
        r += _sec('AN\u00C1LISIS DEL SISTEMA');
        var mdLabel = (cv.meteringDevice || 'txv').toUpperCase();
        r += _row('Refrigerante', cv.refrigerant || null, '');
        r += _row('Metering Device', mdLabel, '');
        r += _row('Superheat (SH)', cv.sh !== null ? cv.sh.toFixed(1) : null, '\u00B0F');
        r += _row('Subcooling (SC)', cv.sc !== null ? cv.sc.toFixed(1) : null, '\u00B0F');
        r += _row('Comp. Ratio', cv.cr !== null ? cv.cr.toFixed(2) + ':1' : null, '');
        r += _row('Evap Sat', cv.evapSat !== null ? cv.evapSat.toFixed(1) : null, '\u00B0F');
        r += _row('Cond Sat', cv.condSat !== null ? cv.condSat.toFixed(1) : null, '\u00B0F');
        r += _row('Cond. Split', cv.condSplit !== null ? cv.condSplit.toFixed(1) : null, '\u00B0F');
        r += _row('Evap. Split', cv.evapSplit !== null ? cv.evapSplit.toFixed(1) : null, '\u00B0F');
        r += _row('TD', cv.td !== null ? cv.td.toFixed(1) : null, '\u00B0F');
        if (cv.indoorT !== null && cv.supplyT !== null) r += _row('Delta-T', (cv.indoorT - cv.supplyT).toFixed(1), '\u00B0F');
      } else if (manifolds.length > 0 && (manifolds[0].superheatF !== undefined || manifolds[0].subcoolingF !== undefined)) {
        r += _sec('SUPERHEAT / SUBCOOLING');
        r += _row('Superheat', manifolds[0].superheatF !== undefined ? manifolds[0].superheatF.toFixed(1) : null, '\u00B0F');
        r += _row('Subcooling', manifolds[0].subcoolingF !== undefined ? manifolds[0].subcoolingF.toFixed(1) : null, '\u00B0F');
      }

      // ── Electrical (SC680) ──
      if (meters.length > 0) {
        r += _sec('EL\u00C9CTRICO (SC680)');
        for (var mi = 0; mi < meters.length; mi++) {
          var mt = meters[mi];
          var mLabel = (_bleFriendlyName[mt.probeName] || mt.probeName || 'Meter') + ' #' + ((mt._uuid || '').slice(-4).toUpperCase());
          if (mt.meterMode && mt.meterValue !== undefined) {
            if (mt.meterIsOL) {
              r += _row(mt.meterMode + ' (CH1)', 'OL', '');
            } else {
              r += _row(mt.meterMode + ' (CH1)', mt.meterValue.toFixed(2), mt.meterUnit || '');
            }
          }
          if (mt.voltageAC !== undefined) r += _row('Voltage AC', mt.voltageAC.toFixed(1), 'V');
          if (mt.voltageDC !== undefined) r += _row('Voltage DC', mt.voltageDC.toFixed(1), 'V');
          if (mt.ampsAC !== undefined) r += _row('Amps AC', mt.ampsAC.toFixed(2), 'A');
          if (mt.resistanceOhms !== undefined) r += _row('Resistencia', mt.resistanceOhms.toFixed(1), '\u03A9');
          if (mt.capacitanceUF !== undefined) r += _row('Capacitancia', mt.capacitanceUF.toFixed(1), '\u00B5F');
          if (mt.frequencyHz !== undefined) r += _row('Frecuencia', mt.frequencyHz.toFixed(1), 'Hz');
          if (mt.powerFactor !== undefined) r += _row('Power Factor', mt.powerFactor.toFixed(2), '');
          if (mt.microAmps !== undefined) r += _row('Flame Sensor', mt.microAmps.toFixed(1), '\u00B5A');
          if (mt.temperatureF !== undefined) r += _row('Temperatura', mt.temperatureF.toFixed(1), '\u00B0F');
          if (mt.ch2Mode && mt.ch2Value !== undefined && !mt.ch2IsOL) r += _row(mt.ch2Mode + ' (CH2)', mt.ch2Value.toFixed(2), mt.ch2Unit || '');
        }
      }

      // ── Static Pressure ──
      if (statics.length > 0) {
        r += _sec('PRESI\u00D3N EST\u00C1TICA');
        var sp = statics[0];
        if (sp.supplyInWC !== undefined) r += _row('Supply', sp.supplyInWC.toFixed(3), 'inWC');
        if (sp.returnInWC !== undefined) r += _row('Return', sp.returnInWC.toFixed(3), 'inWC');
        if (sp.totalESP !== undefined) r += _row('Total ESP', sp.totalESP.toFixed(3), 'inWC');
      }

      // ── Scale ──
      if (scales.length > 0) {
        r += _sec('B\u00C1SCULA DE REFRIGERANTE');
        var scl = scales[0];
        if (scl.weightLbs !== undefined) r += _row('Peso Actual', scl.weightLbs.toFixed(2), 'lb');
        if (scl.chargeTargetLbs !== undefined && scl.chargeTargetLbs < 600) r += _row('Target de Carga', scl.chargeTargetLbs.toFixed(2), 'lb');
      }

      // ── Outdoor Conditions ──
      var wx = window.MaestroWeather;
      if (wx && wx.tempF !== null && wx.tempF !== undefined) {
        r += _sec('CONDICIONES EXTERIORES');
        r += _row('Temperatura', wx.tempF.toFixed(1), '\u00B0F');
        if (wx.rhPct !== null && wx.rhPct !== undefined) r += _row('Humedad', Math.round(wx.rhPct), '%RH');
        if (wx.windMph !== null && wx.windMph !== undefined) r += _row('Viento', wx.windMph.toFixed(0), 'mph');
        if (wx.city) r += _row('Ubicaci\u00F3n', wx.city, '');
      }

      // ── Connected tools list ──
      r += _sec('HERRAMIENTAS CONECTADAS');
      for (var ruid in fp) {
        var rd = fp[ruid];
        if (rd._stale) continue;
        var rname = _bleFriendlyName[rd.probeName] || rd.probeName || rd.probeCategory;
        var rsid = (rd._uuid || '').slice(-4).toUpperCase();
        r += '<div style="font-size:10px;color:#6B6B66;font-weight:500;padding:2px 0;">' + (_bleCatIcon[rd.probeCategory] || '') + ' ' + rname + (rsid ? ' #' + rsid : '') + '</div>';
      }

      // Show report modal
      var oldOverlay = document.getElementById('bleReportOverlay');
      if (oldOverlay) oldOverlay.remove();
      var overlay = document.createElement('div');
      overlay.id = 'bleReportOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
      overlay.innerHTML =
        '<div style="background:#FFFFFF;border:1px solid #E7E5DE;border-radius:16px;max-width:420px;width:100%;max-height:85vh;overflow-y:auto;padding:20px;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);">' +
          r +
          '<div style="display:flex;gap:8px;margin-top:16px;justify-content:center;">' +
            '<button onclick="window._bleCopyReport()" style="background:linear-gradient(135deg,#FF6B35,#e55a2b);color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Copiar Texto</button>' +
            '<button onclick="document.getElementById(\'bleReportOverlay\').remove()" style="background:#FAFAF7;border:1px solid #E7E5DE;color:#0F0F0F;padding:8px 20px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">Cerrar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    };

    // Copy report as plain text
    window._bleCopyReport = function() {
      var fp = window._fpDevices;
      if (!fp) return;
      var now = new Date();
      var lines = ['REPORTE DIAGN\u00D3STICO HVAC', now.toLocaleString('es-MX'), 'T\u00E9cnico: ' + (localStorage.getItem('tecnico_nombre') || ''), ''];
      for (var uid in fp) {
        var d = fp[uid];
        if (d._stale) continue;
        var name = (_bleFriendlyName[d.probeName] || d.probeName || d.probeCategory);
        lines.push('--- ' + name + ' #' + ((d._uuid || '').slice(-4).toUpperCase()) + ' ---');
        if (d.highPSI !== undefined) lines.push('  HP: ' + d.highPSI.toFixed(1) + ' PSI');
        if (d.lowPSI !== undefined) lines.push('  LP: ' + d.lowPSI.toFixed(1) + ' PSI');
        if (d.superheatF !== undefined) lines.push('  Superheat: ' + d.superheatF.toFixed(1) + '\u00B0F');
        if (d.subcoolingF !== undefined) lines.push('  Subcooling: ' + d.subcoolingF.toFixed(1) + '\u00B0F');
        if (d.suctionTempF !== undefined) lines.push('  Suction Temp: ' + d.suctionTempF.toFixed(1) + '\u00B0F');
        if (d.liquidTempF !== undefined) lines.push('  Liquid Temp: ' + d.liquidTempF.toFixed(1) + '\u00B0F');
        if (d.pressurePSI !== undefined) lines.push('  Presi\u00F3n: ' + d.pressurePSI.toFixed(1) + ' PSI');
        if (d.temperatureF !== undefined) lines.push('  Temperatura: ' + d.temperatureF.toFixed(1) + '\u00B0F');
        if (d.dryBulbF !== undefined) lines.push('  Dry Bulb: ' + d.dryBulbF.toFixed(1) + '\u00B0F');
        if (d.wetBulbF !== undefined) lines.push('  Wet Bulb: ' + d.wetBulbF.toFixed(1) + '\u00B0F');
        if (d.relativeHumidity !== undefined) lines.push('  RH: ' + d.relativeHumidity.toFixed(0) + '%');
        if (d.meterMode) lines.push('  Mode: ' + d.meterMode + (d.meterValue !== undefined ? ' = ' + d.meterValue.toFixed(2) + ' ' + (d.meterUnit || '') : ''));
        if (d.voltageAC !== undefined) lines.push('  VAC: ' + d.voltageAC.toFixed(1) + ' V');
        if (d.ampsAC !== undefined) lines.push('  AAC: ' + d.ampsAC.toFixed(2) + ' A');
        if (d.resistanceOhms !== undefined) lines.push('  Ohms: ' + d.resistanceOhms.toFixed(1) + ' \u03A9');
        if (d.capacitanceUF !== undefined) lines.push('  Cap: ' + d.capacitanceUF.toFixed(1) + ' \u00B5F');
        if (d.frequencyHz !== undefined) lines.push('  Hz: ' + d.frequencyHz.toFixed(1));
        if (d.microAmps !== undefined) lines.push('  Flame: ' + d.microAmps.toFixed(1) + ' \u00B5A');
        if (d.totalESP !== undefined) lines.push('  ESP: ' + d.totalESP.toFixed(3) + ' inWC');
        if (d.weightLbs !== undefined) lines.push('  Peso: ' + d.weightLbs.toFixed(2) + ' lb');
        lines.push('');
      }
      lines.push('Generado por Maestro HVACR');
      var text = lines.join('\n');
      var _rcLong = (window._t ? window._t('ble_report_copied', 'Reporte copiado al portapapeles') : 'Reporte copiado al portapapeles');
      var _rcShort = (window._t ? window._t('ble_report_copied_short', 'Reporte copiado') : 'Reporte copiado');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { window.showToast(_rcLong, 'success'); });
      } else {
        var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        window.showToast(_rcShort, 'success');
      }
    };

    // Bottom nav highlighting (moved from push-notifications.js for Tier 1 availability)
    window.updateBottomNav = function(screenId) {
      document.querySelectorAll('.mobile-bottom-nav .bnav-item').forEach(function(item) {
        item.classList.toggle('active', item.dataset.screen === screenId);
      });
    };

    // Formula toggle — defined once globally (was previously inside showScreen causing re-creation on every navigation)
    window.toggleFormula = function(id) {
      var el = document.getElementById(id);
      var arrow = document.getElementById(id + '_arrow');
      if (!el) return;
      if (el.style.display === 'none') {
        el.style.display = 'block';
        if (arrow) arrow.textContent = '▼';
      } else {
        el.style.display = 'none';
        if (arrow) arrow.textContent = '▶';
      }
    };

    async function init() {
      if (_initCalled) return;
      _initCalled = true;
      loadProgress();
      loadVideoProgress();
      renderLevels();

      // checkStaleAttendance removed — check-in obligatorio ya no se usa

      // ============================================
      // DETECT PASSWORD RECOVERY TOKEN IN URL
      // Supports both methods:
      // 1. Hash fragment: #access_token=xxx&type=recovery (implicit flow)
      // 2. Query params: ?token_hash=xxx&type=recovery (PKCE flow)
      // ============================================
      var isRecovery = false;
      var tokenHash = null;
      
      // Method 1: Check hash fragment
      var hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        isRecovery = true;
        console.log('[MaestroAC] Recovery detected via hash fragment');
      }
      
      // Method 2: Check query parameters (PKCE flow - more reliable on Chrome/iPhone)
      var queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('type') === 'recovery') {
        isRecovery = true;
        tokenHash = queryParams.get('token_hash');
        console.log('[MaestroAC] Recovery detected via query params, token_hash:', tokenHash ? 'present' : 'missing');
      }
      
      if (isRecovery) {
        console.log('[MaestroAC] Showing password reset form');
        
        // If we have a token_hash (PKCE flow), verify it first
        if (tokenHash && supabaseClient) {
          try {
            var { data, error } = await supabaseClient.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery'
            });
            if (error) {
              console.error('[MaestroAC] Token verification error:', error.message);
            } else {
              console.log('[MaestroAC] Token verified successfully');
            }
          } catch(e) {
            console.error('[MaestroAC] Token verification exception:', e);
          }
        }
        
        // Show reset password form
        setTimeout(function() {
          showScreen('loginScreen');
          var loginCard = document.querySelector('#loginScreen .card');
          if (loginCard) loginCard.style.display = 'none';
          var resetBox = document.getElementById('resetPasswordBox');
          if (resetBox) resetBox.style.display = 'block';
          // Clean URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 800);
      }

      // Check for Supabase Auth callback (email confirmation redirect)
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session && session.user) {
            const email = session.user.email;
            localStorage.setItem('tecnico_authenticated', 'true');
            localStorage.setItem('tecnico_email', email);
            // Also populate tecnico_user from maestroac_users if available
            const initUsers = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
            if (initUsers[email] && initUsers[email].nombre && !localStorage.getItem('tecnico_user')) {
                localStorage.setItem('tecnico_user', JSON.stringify({
                    nombre: initUsers[email].nombre,
                    email: email,
                    telefono: initUsers[email].telefono || '',
                    ciudad: initUsers[email].ciudad || '',
                    estado: initUsers[email].estado || '',
                    experiencia: initUsers[email].experiencia || '',
                    registrationDate: initUsers[email].registrationDate
                }));
            }
            
            // Mark as verified locally
            const users = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
            if (users[email]) {
              users[email].verified = true;
              localStorage.setItem('maestroac_users', JSON.stringify(users));
            }
          }
        } catch(e) { console.log('[MaestroAC] Session check:', e); }
      }

      // Check authentication status
      console.log('[MaestroAC] Checking auth... authenticated:', isAuthenticated(), 'email:', localStorage.getItem('tecnico_email'));
      if (isAuthenticated()) {
        console.log('[MaestroAC] User authenticated — loading profile...');
        const email = localStorage.getItem('tecnico_email');
        const users = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
        if (users[email] && users[email].nombre) {
          var _eu2 = {}; try { _eu2 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
          currentUser = {
            nombre: users[email].nombre,
            email: email,
            telefono: users[email].telefono || _eu2.telefono || '',
            ciudad: users[email].ciudad || _eu2.ciudad || '',
            estado: users[email].estado || _eu2.estado || '',
            experiencia: users[email].experiencia || '',
            registrationDate: users[email].registrationDate
          };
          // Sync tecnico_user so handleComenzar finds it
          localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
          localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
          loadUserProgress(email);
        } else if (email && supabaseClient) {
          // No local data - try loading from Supabase users table (new device)
          try {
            const { data: userRows } = await supabaseClient.from('users').select('*').eq('email', email).limit(1);
            const userData = userRows && userRows.length > 0 ? userRows[0] : null;
            if (userData && userData.nombre) {
              var _eu3 = {}; try { _eu3 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
              currentUser = {
                nombre: userData.nombre,
                email: email,
                telefono: userData.telefono || _eu3.telefono || '',
                ciudad: userData.ciudad || _eu3.ciudad || '',
                estado: userData.estado || _eu3.estado || '',
                experiencia: userData.experiencia || '',
                registrationDate: userData.fecha_registro
              };
              // Cache locally for future loads
              users[email] = { ...currentUser, password: '(supabase-auth)', verified: true };
              localStorage.setItem('maestroac_users', JSON.stringify(users));
              localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
              localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
              loadUserProgress(email);
            }
          } catch(e) { console.log('[MaestroAC] Load user on init:', e); }
        }
        // Reveal admin links if user is staff (cached auth path)
        if (email && typeof revealAdminLinksIfStaff === 'function') revealAdminLinksIfStaff(email);
        var _postLoginInit = function() {
          if(!localStorage.getItem('maestroac_goto_screen')){showScreen('dashboardScreen');}else{var _gs=localStorage.getItem('maestroac_goto_screen');localStorage.removeItem('maestroac_goto_screen');sessionCheckedIn=true;var _dl=document.getElementById('deepLinkLoader');if(_dl)_dl.remove();if(_gs && !document.getElementById(_gs)){_gs='dashboardScreen';}showScreen(_gs);}
          if (typeof showLoginToasts === 'function') showLoginToasts();
          setTimeout(function() { if (typeof _dsCheckCertNotifications === 'function') _dsCheckCertNotifications(); }, 2000);
          if (window.MaestroLoader) MaestroLoader.load(['js/live-streaming.js']).then(function() {
            setTimeout(function() { if (typeof subscribeToLiveStreamStatus === 'function') subscribeToLiveStreamStatus(); }, 1000);
          });
        };
        // Web access gate + Onboarding gate
        var _afterWebGate1 = function() {
          if (typeof checkOnboardingGate === 'function') {
            checkOnboardingGate(_postLoginInit);
          } else {
            _postLoginInit();
          }
        };
        if (typeof _checkWebAccessGate === 'function') {
          _checkWebAccessGate(localStorage.getItem('tecnico_email') || '', _afterWebGate1);
        } else {
          _afterWebGate1();
        }
      } else {
        // localStorage doesn't have auth — but maybe Supabase still has an active session
        console.log('[MaestroAC] Not authenticated via localStorage, trying recoverSession...');
        var recovered = false;
        try {
          recovered = await recoverSession();
        } catch(recErr) {
          console.error('[MaestroAC] recoverSession crashed:', recErr);
        }
        console.log('[MaestroAC] recoverSession result:', recovered);
        if (recovered) {
          const email = localStorage.getItem('tecnico_email');
          if (email) loadUserProgress(email);
          // Reveal admin links if user is staff (recover path)
          if (email && typeof revealAdminLinksIfStaff === 'function') revealAdminLinksIfStaff(email);
          console.log('[MaestroAC] Session auto-recovered! Redirecting to welcome.');
          var _postRecoverInit = function() {
            if(!localStorage.getItem('maestroac_goto_screen')){showScreen('dashboardScreen');}else{var _gs=localStorage.getItem('maestroac_goto_screen');localStorage.removeItem('maestroac_goto_screen');sessionCheckedIn=true;var _dl=document.getElementById('deepLinkLoader');if(_dl)_dl.remove();if(_gs && !document.getElementById(_gs)){_gs='dashboardScreen';}showScreen(_gs);}
            if (typeof showLoginToasts === 'function') showLoginToasts();
            setTimeout(function() { if (typeof _dsCheckCertNotifications === 'function') _dsCheckCertNotifications(); }, 2000);
            if (window.MaestroLoader) MaestroLoader.load(['js/live-streaming.js']).then(function() {
              setTimeout(function() { if (typeof subscribeToLiveStreamStatus === 'function') subscribeToLiveStreamStatus(); }, 1000);
            });
          };
          var _afterWebGate2 = function() {
            if (typeof checkOnboardingGate === 'function') {
              checkOnboardingGate(_postRecoverInit);
            } else {
              _postRecoverInit();
            }
          };
          if (typeof _checkWebAccessGate === 'function') {
            _checkWebAccessGate(email || '', _afterWebGate2);
          } else {
            _afterWebGate2();
          }
        } else {
          showScreen('loginScreen');
          console.log('[MaestroAC] Not authenticated, showing login screen');
        }
      }

      // Register form handler (profile creation form)
      const regForm = document.getElementById('registerForm');
      if (regForm) {
        regForm.addEventListener('submit', function(e) {
          e.preventDefault();
          registerUser();
        });
      }
    }

    // Safety net: if no screen is visible after 5 seconds, force show login
    setTimeout(function() {
      var activeScreen = document.querySelector('.screen.active');
      if (!activeScreen) {
        console.warn('[MaestroAC] No active screen after timeout — forcing login screen');
        showScreen('loginScreen');
      }
    }, 5000);

    // Show resume banner on welcome screen — DISABLED (quiz auto-resumes from levels screen instead)
    function showResumeBanner(savedState) {
      return;
    }

    // Resume from the welcome screen banner
    function resumeFromBanner() {
      const banner = document.getElementById('resumeBanner');
      if (banner) {
        banner.style.display = 'none';
      }
      resumeQuiz();
    }

    // Dismiss the resume banner and clear the saved state
    function dismissResumeBanner() {
      const banner = document.getElementById('resumeBanner');
      if (banner) {
        banner.style.display = 'none';
      }
      clearLastQuizState();
    }

        // === DEEP-LINK FROM APP.HTML ===
    // Deep-link handled in init() - do NOT remove goto_screen here

    // Browser back button support — flag to prevent pushState loop
    var _navFromPopstate = false;

function showScreen(screenId) {
      // Premium iOS feel — fire a selection tick on every navigation.
      try { if (window.Haptics && window.Haptics.selection) window.Haptics.selection(); } catch (e) {}
      // Smart back navigation — if a back button called us with 'dashboardScreen'
      // but the nav stack has depth, pop ONE level instead of jumping home.
      // This covers both data-nav and inline onclick back buttons.
      try {
        var _ev = window.event;
        if (screenId === 'dashboardScreen' && _ev && _ev.target) {
          var _trg = _ev.target;
          var _back = _trg.closest && _trg.closest('.btn-nav-back, .back-btn, .back-home-btn, .btn-back, [data-back]');
          if (_back && window._navStack && window._navStack.length > 1) {
            var _prev = window._navStack[window._navStack.length - 2];
            if (_prev && _prev !== 'dashboardScreen') { screenId = _prev; }
          }
        }
      } catch (e) {}
      // Ensure sunlight-legibility CSS is injected (idempotent, guarded).
      if (typeof _ensureAppLegibility === 'function') _ensureAppLegibility();
      // Track origin screen for study module "Volver" buttons
      if (screenId.indexOf('StudyScreen') !== -1) {
        var _prev = document.querySelector('.screen.active');
        if (_prev && _prev.id.indexOf('StudyScreen') === -1) { window._studyReturnScreen = _prev.id; }
      }
      // Redirect old levels screen to Desafío
      if (screenId === 'levelsScreen') { screenId = 'desafioScreen'; }

    // Native store shells (iOS App Store + Google Play) hide external
    // payment screens — both Apple 3.1.1 and Google Play Billing 4.1
    // forbid linking to outside commerce. Web (maestrohvacr.com) keeps
    // them so students can pay via Stripe.
    if ((window.isIOSAppStore || window.isAndroidPlayStore) && (screenId === 'membresiasScreen' || screenId === 'referidosScreen' || screenId === 'misPagosScreen')) {
      showScreen('dashboardScreen');
      return;
    }

      // Track screen view for analytics
      if (typeof MaestroAnalytics !== 'undefined') { try { MaestroAnalytics.trackScreen(screenId); } catch(e) { console.warn('[Navigation]', e.message || e); } }

      if (typeof studyTimerInterval !== 'undefined' && studyTimerInterval) {
        var activeScreen = document.querySelector('.screen.active');
        if (activeScreen && (activeScreen.id === 'quizScreen' || activeScreen.id === 'quizOnlyScreen') && screenId !== 'quizScreen' && screenId !== 'quizOnlyScreen') {}
      }
      // Lazy-load scripts for this screen
      var _scripts = SCREEN_SCRIPTS[screenId];
      if (_scripts === '_admin' && window.MaestroLoader) {
        // Load full admin + CRM bundle for admin dashboard
        MaestroLoader.load([
          'js/admin/hash-passwords.js',
          'js/admin/student-success.js',
          'js/admin/create-user.js',
          'js/admin/class-schedule.js',
          'js/admin/finanzas.js',
          'js/admin/inactivity-alerts.js',
          'js/admin/onboarding.js',
          'js/admin/progress-emails.js',
          'js/admin/ambassadors.js',
          'js/admin/analytics.js',
          'js/admin/pdf-reports.js',
          'js/admin/admin-certs.js',
          'js/admin/gatekeeper.js',
          'js/admin/tutorial-videos.js',
          'js/admin/soporte-admin.js',
          'js/admin/game-analytics.js',
          'js/admin/desafio-admin.js',
          'js/admin/live-stream-admin.js',
          'js/admin/live-stream-console.js',
          'js/admin/acvolt-school-admin.js',
          'js/admin/api-billing-dashboard.js',
          'js/admin/admin-inbox.js',
          'js/admin/admin-diagnostic.js',
          'js/admin/ai-command-center.js',
          'js/admin/user-monitor.js',
          'js/admin/admin-books-exams.js',
          'js/admin/error-monitor.js',
          'js/admin/web-vitals-dashboard.js',
          'js/crm/student-roster.js',
          'js/crm/email-system.js',
          'js/crm/zoom-recordings.js',
          'js/crm/zm-navigation.js',
          'js/crm/zoom-summaries.js',
          'js/crm/educational-material.js',
          'js/crm/acvolt-market.js',
          'js/crm/question-bank.js',
          'js/crm/ai-question-review.js',
          'js/crm/admin-ai-assistant.js',
          'js/crm/exams-management.js',
          'js/crm/live-performance.js',
          'js/crm/mobile-nav.js',
          'registered-students-data.js',
          'whatsapp-audit-data.js',
          'invoice2go-audit-data.js',
          'failed-payments-data.js',
          'pipeline.js',
          'fixes-workbooks-exams-calendar.js'
        ]).then(function() {
          // Initialize admin dashboard AFTER all scripts are loaded
          console.log('[MaestroAC] Admin scripts loaded, initializing dashboard...');
          try { renderAdminDashboard(); } catch(e) { console.warn('renderAdminDashboard:', e); }
          try { loadAdminAttendance(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadFinanzasData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadInactivityAlerts(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadCalendarData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadReferidosData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadW9Reviews(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAmbassadorPayments(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAnalytics(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAdminCertificates(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { renderLevelPerformanceChart(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAttendanceData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          // Onboarding disabled — was firing for admin users without student progress
          // try { checkShowOnboarding(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAdminStudentActivity(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAdminExamRequests(); } catch(e) { console.warn('[Navigation]', e.message || e); }
          try { loadAdminInbox(); } catch(e) { console.warn('[Navigation]', e.message || e); }
        });
        MaestroLoader.loadCSS('pipeline.css');
      } else if (_scripts && window.MaestroLoader) {
        MaestroLoader.load(_scripts).then(function() {
          // After lazy scripts load, call init if available
          if (screenId === 'partsFinderScreen' && typeof initPartsFinder === 'function') { initPartsFinder(); }
          // Ensure Gamification is initialized for study screens (XP tracking)
          if (window.Gamification && typeof window.Gamification.init === 'function') window.Gamification.init();
          if (screenId === 'epa608StudyScreen' && typeof initEpa608Study === 'function') { initEpa608Study(); }
          if (screenId === 'a2lStudyScreen' && typeof initA2lStudy === 'function') { initA2lStudy(); }
          if (screenId === 'oshaStudyScreen' && typeof initOshaStudy === 'function') { initOshaStudy(); }
          if (screenId === 'calefaccionStudyScreen' && typeof initCalefaccionStudy === 'function') { initCalefaccionStudy(); }
          if (screenId === 'refriStudyScreen' && typeof initRefriStudy === 'function') { initRefriStudy(); }
          if (screenId === 'nateStudyScreen' && typeof initNateStudy === 'function') { initNateStudy(); }
          if (screenId === 'etStudyScreen' && typeof initEtStudy === 'function') { initEtStudy(); }
          if (screenId === 'nateSeniorStudyScreen' && typeof initNateSeniorStudy === 'function') { initNateSeniorStudy(); }
          // Voice chat is handled globally in showScreen() — no per-study-screen call needed
          // Study Together — auto-enter for study screens
          if (screenId.indexOf('StudyScreen') !== -1 && window.StudyTogether) { window.StudyTogether.enter(screenId); }
          // Social presence — EN VIVO is now driven by voice chat connection (global)
          // Friends screen init
          if (screenId === 'friendsScreen' && window.SocialSystem) { window.SocialSystem.initFriendsScreen(); }
          // Job board init
          if (screenId === 'jobBoardScreen' && typeof window.initJobBoard === 'function') { window.initJobBoard(); }
          if (screenId === 'marketplaceScreen' && typeof window.initMarketplace === 'function') { window.initMarketplace(); }
          if (screenId === 'ductDesignerScreen' && typeof window.initDuctDesigner === 'function') { window.initDuctDesigner(); }
          if (screenId === 'maestroBenderScreen' && typeof window.initMaestroBender === 'function') { window.initMaestroBender(); }
          if (screenId === 'maestroProScreen' && typeof window.initMaestroPro === 'function') { window.initMaestroPro(); }
          if (screenId === 'chakaTipsScreen' && typeof window.initChakaTips === 'function') { window.initChakaTips(); }
          if (screenId === 'contractorZoneScreen' && typeof window.initContractorZone === 'function') { window.initContractorZone(); }
          if (screenId === 'jornalProScreen' && typeof window.initJornalPro === 'function') { window.initJornalPro(); }
          if (screenId === 'preDepartureScreen' && typeof window.initPreDepartureChecklist === 'function') { window.initPreDepartureChecklist(window._pdcInstallMode ? 'install' : window._pdcStockMode ? 'stock' : window._pdcOnsiteMode ? 'onsite' : window._pdcToolsOnly ? 'tools' : 'full'); }
          if (screenId === 'videoTutorialesScreen' && typeof initVideoTutoriales === 'function') { try { initVideoTutoriales(); } catch(e) { console.warn('[Navigation] initVideoTutoriales:', e.message || e); } }
          // Diag hub + residential / electrical / commercial diag modules (Mario 2026-05-12)
          if (screenId === 'diagnosticosScreen' && window.DiagHub) { try { window.DiagHub.render(); } catch(e) {} }
          if (screenId === 'lavadoraDiagScreen'    && window.LavadoraDiag)    { try { window.LavadoraDiag.render(); } catch(e) {} }
          if (screenId === 'secadoraDiagScreen'    && window.SecadoraDiag)    { try { window.SecadoraDiag.render(); } catch(e) {} }
          if (screenId === 'refriDomDiagScreen'    && window.RefriDomDiag)    { try { window.RefriDomDiag.render(); } catch(e) {} }
          if (screenId === 'acWindowDiagScreen'    && window.AcWindowDiag)    { try { window.AcWindowDiag.render(); } catch(e) {} }
          if (screenId === 'acMobileDiagScreen'    && window.AcMobileDiag)    { try { window.AcMobileDiag.render(); } catch(e) {} }
          if (screenId === 'miniSplitDiagScreen'   && window.MiniSplitDiag)   { try { window.MiniSplitDiag.render(); } catch(e) {} }
          if (screenId === 'waterHeaterDiagScreen' && window.WaterHeaterDiag) { try { window.WaterHeaterDiag.render(); } catch(e) {} }
          if (screenId === 'mainPanelDiagScreen'   && window.MainPanelDiag)   { try { window.MainPanelDiag.render(); } catch(e) {} }
          if (screenId === 'subpanelDiagScreen'    && window.SubpanelDiag)    { try { window.SubpanelDiag.render(); } catch(e) {} }
          if (screenId === 'solarDiagScreen'       && window.SolarDiag)       { try { window.SolarDiag.render(); } catch(e) {} }
          if (screenId === 'generatorDiagScreen'   && window.GeneratorDiag)   { try { window.GeneratorDiag.render(); } catch(e) {} }
          if (screenId === 'coldtableDiagScreen'   && window.ColdTableDiag)   { try { window.ColdTableDiag.render(); } catch(e) {} }
          if (screenId === 'walkinDiagScreen'      && window.WalkinDiag)      { try { window.WalkinDiag.render(); } catch(e) {} }
          if (screenId === 'icemachineDiagScreen'  && window.IceMachineDiag)  { try { window.IceMachineDiag.render(); } catch(e) {} }
          if (screenId === 'reachinDiagScreen'     && window.ReachInDiag)     { try { window.ReachInDiag.render(); } catch(e) {} }
          if (screenId === 'reeferDiagScreen'      && window.ReeferDiag)      { try { window.ReeferDiag.render(); } catch(e) {} }
          if (screenId === 'rackingDiagScreen'     && window.RackingDiag)     { try { window.RackingDiag.render(); } catch(e) {} }
          if (screenId === 'gelatoDiagScreen'      && window.GelatoDiag)      { try { window.GelatoDiag.render(); } catch(e) {} }
          if (screenId === 'meghometerScreen'      && window.Meghometer)      { try { window.Meghometer.render('meghometerScreen'); } catch(e) {} }
          // Inject BLE bar after all scripts (including ble-manager.js) are loaded
          if (typeof _injectBLEBar === 'function') {
            if (screenId === 'manifoldScreen') _injectBLEBar('manifoldScreen');
            if (screenId === 'multimeterScreen') _injectBLEBar('multimeterScreen');
            if (screenId === 'manometerHvacScreen') _injectBLEBar('manometerHvacScreen');
            if (screenId === 'anemometerHvacScreen') _injectBLEBar('anemometerHvacScreen');
            // Mario 2026-05-09: BLE toolbar también en los 6 modales nuevos
            if (screenId === 'heatingScreen') _injectBLEBar('heatingScreen');
            if (screenId === 'commercialHvacScreen') _injectBLEBar('commercialHvacScreen');
            if (screenId === 'walkinDiagScreen') _injectBLEBar('walkinDiagScreen');
            if (screenId === 'icemachineDiagScreen') _injectBLEBar('icemachineDiagScreen');
            if (screenId === 'coldtableDiagScreen') _injectBLEBar('coldtableDiagScreen');
            if (screenId === 'reachinDiagScreen') _injectBLEBar('reachinDiagScreen');
            if (screenId === 'lavadoraDiagScreen') _injectBLEBar('lavadoraDiagScreen');
          }
        });
      }

      // Admin auth guard — prevent unauthenticated access to admin screens
      if ((screenId === 'adminDashboardScreen' || screenId === 'adminTechnicianProfileScreen') && (typeof isAdminAuthenticated !== 'function' || !isAdminAuthenticated())) {
        showScreen('adminLoginScreen');
        return;
      }
      // Student session validation — try to refresh Supabase session in background
      // IMPORTANT: Do NOT kick students out if refresh fails — many use localStorage-only auth
      if (screenId !== 'loginScreen' && screenId !== 'registerScreen' && screenId !== 'landingPageScreen' && screenId !== 'adminLoginScreen') {
        if (typeof AuthManager !== 'undefined' && AuthManager.getSession && !AuthManager.getSession()) {
          if (localStorage.getItem('tecnico_authenticated') === 'true' && typeof AuthManager.refreshSession === 'function') {
            AuthManager.refreshSession().catch(function() {});
          }
        }
      }
      // Check-in is now automatic on login — no screen guard needed
      // Stop Maestro Mario when leaving Desafío screens
      var _prevScreen = document.querySelector('.screen.active');
      if (_prevScreen && (_prevScreen.id === 'desafioScreen' || _prevScreen.id === 'desafioQuizScreen' || _prevScreen.id === 'desafioPlayScreen') && screenId !== 'desafioScreen' && screenId !== 'desafioQuizScreen' && screenId !== 'desafioPlayScreen') {
        if (typeof window._dsCleanup === 'function') window._dsCleanup();
        else if (typeof window._dsStopMario === 'function') window._dsStopMario();
      }
      // Clean up BLE listeners when leaving Bluetooth tools
      if (_prevScreen && _prevScreen.id === 'bluetoothToolsScreen' && screenId !== 'bluetoothToolsScreen') {
        if (typeof window._bleToolsCleanup === 'function') window._bleToolsCleanup();
      }
      // Clean up group chat realtime subscription when leaving chat room
      if (_prevScreen && _prevScreen.id === 'groupChatRoomScreen' && screenId !== 'groupChatRoomScreen') {
        if (typeof gcCleanupRoom === 'function') gcCleanupRoom();
      }
      // Voice chat — only show if user manually activated it
      // (no longer auto-shows on every screen)
      // Study Together — auto-leave when exiting study screen
      if (_prevScreen && _prevScreen.id.indexOf('StudyScreen') !== -1 && window.StudyTogether) {
        window.StudyTogether.leave();
      }
      // Social presence — update on screen change
      if (window.SocialSystem) { window.SocialSystem.updatePresence(screenId); }
      // Remember scroll position of the screen we're leaving, so returning
      // to it drops the user back on the same card instead of the top.
      window._screenScrollPos = window._screenScrollPos || {};
      if (_prevScreen && _prevScreen.id && _prevScreen.id !== screenId) {
        window._screenScrollPos[_prevScreen.id] = window.scrollY || window.pageYOffset || 0;
        // Track previous screen for smart back navigation from tool screens.
        // A tool opened from the Dashboard should return to Dashboard, not
        // funnel through herramientasScreen.
        window._previousScreenId = _prevScreen.id;
      }
      // ── iOS push/pop direction tracking ───────────────────────────────
      // Maintain a simple nav stack so we know whether the user is going
      // deeper (push, slide from right) or going back (pop, slide from left).
      window._navStack = window._navStack || ['dashboardScreen'];
      var _navDir = 'push';
      var _stackIdx = window._navStack.indexOf(screenId);
      if (_stackIdx !== -1 && _stackIdx < window._navStack.length - 1) {
        _navDir = 'pop';
        window._navStack = window._navStack.slice(0, _stackIdx + 1);
      } else if (screenId === 'dashboardScreen') {
        _navDir = 'pop';
        window._navStack = ['dashboardScreen'];
      } else if (window._navStack[window._navStack.length - 1] !== screenId) {
        window._navStack.push(screenId);
      }

      document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.style.removeProperty('display'); s.style.removeProperty('flex-direction'); });
      // Mario v8.35: only show dashboard FABs (avatar, lv badge, HVACR TOOLS,
      // HomeWarrior) when on dashboard. Off-dashboard hides them to keep
      // sub-screens uncluttered.
      try { document.body.classList.toggle('on-dashboard', screenId === 'dashboardScreen'); } catch(_) {}
      var targetScreen = document.getElementById(screenId);
      if (!targetScreen) { console.error('[MaestroAC] Screen not found: ' + screenId); if(screenId !== 'dashboardScreen') showScreen('dashboardScreen'); return; }
      // Scroll restore: when returning to a screen the user had scrolled,
      // suppress the screenFadeIn animation (which slides cards up 8px and
      // fades them in) and set scroll position *before* the screen becomes
      // visible. This avoids both the "flash at top" and the card-jump
      // glitch. First visits keep the normal fade-in.
      var _savedScroll = (window._screenScrollPos && window._screenScrollPos[screenId]) || 0;
      var _htmlEl = document.documentElement;
      var _prevScrollBehavior = _htmlEl.style.scrollBehavior;
      if (_savedScroll > 0) {
        _htmlEl.style.scrollBehavior = 'auto';
        targetScreen.style.animation = 'none';
        targetScreen.style.opacity = '0';
        // Kill child stagger animations (profile-nav-card .cardIn etc.) so
        // returning to a scrolled screen doesn't trigger a card-by-card jump.
        targetScreen.classList.add('no-child-anim');
      }
      targetScreen.classList.add('active');
      targetScreen.style.display = 'flex';
      targetScreen.style.flexDirection = 'column';
      // Force layout so the document has the target screen's height, then
      // jump the window to the saved offset synchronously (no visible flash).
      void targetScreen.offsetHeight;
      try { window.scrollTo(0, _savedScroll); } catch(_e) {}
      if (_savedScroll > 0) {
        // Fade in at the saved position with opacity only (no transform),
        // so cards don't appear to slide into place.
        requestAnimationFrame(function() {
          try { window.scrollTo(0, _savedScroll); } catch(_e) {}
          targetScreen.style.transition = 'opacity 200ms cubic-bezier(0.32,0.72,0,1)';
          targetScreen.style.opacity = '1';
          _htmlEl.style.scrollBehavior = _prevScrollBehavior;
          setTimeout(function() {
            targetScreen.style.removeProperty('transition');
            targetScreen.style.removeProperty('opacity');
            targetScreen.style.removeProperty('animation');
            targetScreen.classList.remove('no-child-anim');
          }, 220);
        });
      } else {
        // Fresh navigation — apply an iOS push/pop horizontal slide on the
        // incoming screen. Skips when returning to a scrolled state (above).
        // Respect prefers-reduced-motion via CSS @media rule (no-op there).
        var _animName = _navDir === 'pop' ? 'iosSlideInLeft' : 'iosSlideInRight';
        targetScreen.style.animation = _animName + ' 340ms cubic-bezier(0.32,0.72,0,1) both';
        setTimeout(function() { try { targetScreen.style.removeProperty('animation'); } catch (e) {} }, 360);
      }
      // Render language toggle on profile screen
      if (typeof window._showLangToggle === 'function') window._showLangToggle();
      // Hide student-only floating UI in admin mode and full-screen tools
      var _isAdminScreen = (screenId === 'adminDashboardScreen' || screenId === 'adminTechnicianProfileScreen');
      var _isToolScreen = (screenId === 'herramientasScreen' || screenId === 'manifoldScreen' || screenId === 'multimeterScreen' || screenId === 'manometerHvacScreen' || screenId === 'anemometerHvacScreen' || screenId === 'heatingScreen' || screenId === 'commercialHvacScreen' || screenId === 'bluetoothToolsScreen' || screenId === 'maestroInvoicesScreen');
      var _dashAvatar = document.getElementById('dashProfileAvatar');
      var _dashMic = document.getElementById('dashMicBtn');
      var _dashXp = document.getElementById('dashXpBadge');
      if (_isAdminScreen || _isToolScreen) {
        if (_dashAvatar) _dashAvatar.style.setProperty('display', 'none', 'important');
        if (_dashMic) _dashMic.style.setProperty('display', 'none', 'important');
        if (_dashXp) _dashXp.style.setProperty('display', 'none', 'important');
      } else {
        if (_dashAvatar) _dashAvatar.style.removeProperty('display');
        if (_dashMic) _dashMic.style.removeProperty('display');
        if (_dashXp) _dashXp.style.removeProperty('display');
      }
      // Keep voice chat connection alive across screens
      if (window.StudyVoiceChat && window.StudyVoiceChat.isConnected && window.StudyVoiceChat.isConnected()) {
        // Update screen tracking for presence without re-rendering
        if (typeof window._vcUpdateScreenId === 'function') window._vcUpdateScreenId(screenId);
      }
      // Dynamic theme-color for mobile browsers
      _updateThemeColor(screenId);
      // Show shimmer for lazy-loaded screens while scripts load
      if (SCREEN_SCRIPTS[screenId] && SCREEN_SCRIPTS[screenId] !== '_admin') {
        _showScreenShimmer(targetScreen);
        // Remove shimmer when scripts finish loading
        window.addEventListener('maestro:loaded', function _removeShimmer() {
          var sh = targetScreen.querySelector('.maestro-shimmer');
          if (sh) sh.parentNode.removeChild(sh);
          window.removeEventListener('maestro:loaded', _removeShimmer);
        });
      }
      // Accessibility: move focus to target screen
      var _heading = targetScreen.querySelector('h1, h2, h3, .screen-title');
      if (_heading) { _heading.setAttribute('tabindex', '-1'); _heading.focus({ preventScroll: true }); }
      else { targetScreen.setAttribute('tabindex', '-1'); targetScreen.focus({ preventScroll: true }); }
      // Auto-fill saved email on login screen
      if (screenId === 'loginScreen') {
        var savedEmail = localStorage.getItem('tecnico_email');
        var emailInput = document.getElementById('loginEmail');
        if (savedEmail && emailInput && !emailInput.value) {
          emailInput.value = savedEmail;
          // Focus password field since email is pre-filled
          var passInput = document.getElementById('loginPassword');
          if (passInput) setTimeout(function(){ passInput.focus(); }, 100);
        }
      }
      // Toggle between dashboard frame and main app frame (HVAC feed removed Build 28)
      var mainFrame = document.getElementById('mainAppFrame');
      if (mainFrame) {
        if (screenId === 'dashboardScreen') {
          mainFrame.style.display = 'none';
          // Safety: ensure watching-stream class is off so the global EN VIVO pill is visible on dashboard.
          document.body.classList.remove('ls-watching-stream');
          // Force re-check for live streams each time dashboard opens so the floating pill shows here, not only inside Clases en Vivo.
          if (window.MaestroLoader && typeof checkLiveStreamsFab !== 'function') {
            MaestroLoader.load(['js/live-streaming.js']).then(function() {
              if (typeof checkLiveStreamsFab === 'function') checkLiveStreamsFab();
              if (typeof subscribeToLiveStreamStatus === 'function') subscribeToLiveStreamStatus();
            });
          } else if (typeof checkLiveStreamsFab === 'function') {
            checkLiveStreamsFab();
          }
          if (typeof loadMarketProducts === 'function') loadMarketProducts();
          if (typeof _checkResumeQuizCard === 'function') _checkResumeQuizCard();
          if (typeof _updateStreakBadge === 'function') _updateStreakBadge();
          if (typeof loadHvacFeedBubble === 'function') loadHvacFeedBubble();
          if (typeof initWeatherWidget === 'function') initWeatherWidget();
          if (window.Gamification && typeof window.Gamification.init === 'function') window.Gamification.init();
          if (window.StudyVoiceChat && typeof window.StudyVoiceChat.getDashboardCounts === 'function') window.StudyVoiceChat.getDashboardCounts();
          if (typeof window._refreshDashXp === 'function') window._refreshDashXp();
          // Social System — init + render dashboard widgets
          if (window.SocialSystem) { window.SocialSystem.init(); window.SocialSystem.renderDashboard(); }
          else if (window.MaestroLoader) { MaestroLoader.load(['js/social-system.js']).then(function(){ if (window.SocialSystem) { window.SocialSystem.init(); window.SocialSystem.renderDashboard(); } }); }
          // Onboarding Tour — show once for new social features
          if (window.OnboardingTour) { window.OnboardingTour.startIfNeeded(); }
          else if (window.MaestroLoader) { MaestroLoader.load(['js/onboarding-tour.js']).then(function(){ if (window.OnboardingTour) window.OnboardingTour.startIfNeeded(); }); }
          // Radio only starts when user taps the dashRadioWidget (no autoplay)
          // Show call button below radio
          var _rcall = document.getElementById('dashRadioCall');
          if (_rcall) _rcall.style.display = 'block';
        } else {
          mainFrame.style.display = '';
        }
      }
      // Top 10 leaderboard screen — render full leaderboard on open
      if (screenId === 'top10RachaScreen' && window.Gamification && typeof window.Gamification.renderFullLeaderboard === 'function') {
        window.Gamification.renderFullLeaderboard('top10FullList');
      }
      // Dashboard radio widget + podcast pill + call button — show on dashboard only
      var _drw = document.getElementById('dashRadioWidget');
      var _drc = document.getElementById('dashRadioCall');
      var _dpp = document.getElementById('dashPodcastPill');
      if (_drw) {
        if (screenId === 'dashboardScreen' && !window._lsaBroadcastActive) {
          if (typeof _syncDashRadio === 'function') { _drw.style.display = 'flex'; _syncDashRadio(); }
          else if (window.MaestroLoader) { MaestroLoader.load(['js/radio-podcast.js']).then(function(){ _drw.style.display = 'flex'; if (typeof _syncDashRadio === 'function') _syncDashRadio(); }); }
          else { _drw.style.display = 'flex'; }
          if (_drc) _drc.style.display = 'block';
          if (_dpp) _dpp.style.display = 'flex';
        } else {
          _drw.style.display = 'none';
          if (_drc) _drc.style.display = 'none';
          if (_dpp) _dpp.style.display = 'none';
        }
      }
      // Weather widget — show on dashboard only
      var _ww = document.getElementById('weatherWidget');
      if (_ww) _ww.style.display = screenId === 'dashboardScreen' ? '' : 'none';
      // Remove deep-link CSS that hides loginScreen with !important
      if (screenId === 'loginScreen') {
        var dl = document.getElementById('deepLinkLoader');
        if (dl) dl.remove();
        document.querySelectorAll('style').forEach(function(s) {
          if (s.textContent.includes('#loginScreen{display:none') || s.textContent.includes('#dashboardScreen{display:none')) s.remove();
        });
        targetScreen.style.display = 'flex';
        targetScreen.style.flexDirection = 'column';
      }
      // Save current screen for "back to app" navigation
      localStorage.setItem('maestroac_last_screen', screenId);

      // Push to browser history for back button support
      try {
        if (!_navFromPopstate && window.history && window.history.pushState) {
          var currentState = window.history.state;
          if (!currentState || currentState.screen !== screenId) {
            window.history.pushState({ screen: screenId }, '', '#' + screenId);
          }
        }
      } catch(e) { console.warn('[Navigation]', e.message || e); }

      // --- Screen event tracking ---
      (function trackScreenEvent() {
        var email = localStorage.getItem('tecnico_email');
        if (!email || !screenId || !supabaseClient || screenId === 'loginScreen' || screenId === 'registerScreen' || screenId === 'adminLoginScreen') return;

        // Update duration of previous screen
        if (window._lastScreenEvent) {
          var dur = Math.round((Date.now() - window._lastScreenEvent.ts) / 1000);
          if (dur > 0 && dur < 3600 && window._lastScreenEvent.id) {
            supabaseClient.from('screen_events')
              .update({ duration_sec: dur })
              .eq('id', window._lastScreenEvent.id)
              .then(function(){}).catch(function(){});
          }
        }

        // Insert new screen event
        var sessionId = window._screenSessionId || (window._screenSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2,6));
        supabaseClient.from('screen_events')
          .insert({ user_email: email, screen_id: screenId, session_id: sessionId })
          .select('id').single()
          .then(function(res) {
            if (res.data) window._lastScreenEvent = { id: res.data.id, ts: Date.now() };
          }).catch(function(){});
      })();

      // Hide "back to app" button on login/register screens
      var backBtn = document.getElementById('backToAppBtn');
      if (backBtn) {
        if (screenId === 'loginScreen' || screenId === 'registerScreen' || screenId === 'adminLoginScreen') {
          backBtn.style.display = 'none';
        }
      }
    
      // Auto-load profile data when profile screen opens

      // Auto-load student exams and performance
      if (screenId === 'studentExamsScreen') {
        if (typeof loadStudentExamsScreen === 'function') { loadStudentExamsScreen(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/student-exams.js']).then(function(){ try { loadStudentExamsScreen(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'studentProgressScreen') {
        if (typeof loadProgressDashboard === 'function') { loadProgressDashboard(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/progress-dashboard.js']).then(function(){ try { loadProgressDashboard(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }

      if (screenId === 'miPerfilScreen') {
        try { loadProfileData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
        try { if (typeof loadStudyActivity === 'function') loadStudyActivity(); } catch(e) { console.warn('[Navigation]', e.message || e); }
      }
      if (screenId === 'welcomeScreen' || screenId === 'dashboardScreen') {
        try { updateFreeUserProgress(); } catch(e) { console.warn('[Navigation]', e.message || e); }
        // Auto-load calendar for class notifications
        try { if (typeof liveClasses !== 'undefined' && liveClasses.length === 0 && typeof loadCalendarData === 'function') loadCalendarData(); } catch(e) { console.warn('[Navigation]', e.message || e); }
        setTimeout(function(){ try { checkClassReminders(); } catch(e) { console.warn('[Navigation]', e.message || e); } }, 3000);
        // Radio: no longer auto-starts — user taps play manually
        // (auto-start caused audio bleed into live broadcasts)
      }
      // Auto-load admin data when admin dashboard opens
      
      if (screenId === 'desafioScreen' || screenId === 'desafioQuizScreen') {
        if (screenId === 'desafioScreen') {
          if (typeof initDesafio === 'function') { initDesafio(); }
          else if (window.MaestroLoader) {
            MaestroLoader.load(['js/desafio-questions-c1.js','js/desafio.js','js/ai-maestro-mario.js']).then(function(){ try { initDesafio(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
          }
        }
      } else {
        // Hide floating Mario when leaving desafío screens
        var mf = document.getElementById('dsMarioFloat');
        if (mf) mf.style.display = 'none';
      }
      if (screenId === 'radioPodcastScreen') {
        if (typeof initPodcastProgress === 'function') { initPodcastProgress(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/radio-podcast.js']).then(function(){ try { initPodcastProgress(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'referidosScreen') {
        if (typeof initReferidosScreen === 'function') { initReferidosScreen(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/admin/ambassadors.js']).then(function(){ try { initReferidosScreen(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'studentCalendarScreen') {
        if (typeof loadCalendarData === 'function') { loadCalendarData(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/admin/ambassadors.js']).then(function(){
            try { loadCalendarData(); } catch(e){ console.error('[Nav] loadCalendarData error:', e); }
          }).catch(function(e){ console.error('[Nav] Failed to load ambassadors.js:', e); });
        }
        // Safety net: clear spinner after 8s even if everything fails
        setTimeout(function(){
          var cl = document.getElementById('studentClassList');
          if (cl && cl.querySelector('.mc-loading')) {
            cl.innerHTML = '<div style="text-align:center;color:#64748b;padding:30px;"><div style="font-size:30px;margin-bottom:8px;">📅</div><p>' + _t('nav_schedule_below', 'Horario regular disponible abajo') + '</p></div>';
          }
        }, 8000);
      }
      if (screenId === 'techChatScreen') {
        if (typeof initTechChat === 'function') { initTechChat(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/tech-chat.js']).then(function(){ try { initTechChat(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'liveStreamingScreen') {
        if (typeof initLiveStreaming === 'function') { initLiveStreaming(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/live-streaming.js']).then(function(){ try { initLiveStreaming(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'sugerenciasScreen') {
        if (typeof initSugerencias === 'function') { initSugerencias(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/tech-chat.js']).then(function(){ try { initSugerencias(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'acvoltCertScreen' || screenId === 'acvoltCourseScreen' || screenId === 'acvoltLessonScreen') {
        if (typeof initAcvoltCert === 'function') { initAcvoltCert(screenId); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/acvolt-certification.js']).then(function(){ try { initAcvoltCert(screenId); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
        // Track course engagement — Mario 2026-05-19 plan 100k
        try { if (typeof trackConversion === 'function') trackConversion('course_started', { screen: screenId }); } catch(_) {}
      }
      if (screenId === 'videoTutorialesScreen') {
        if (typeof initVideoTutoriales === 'function') { initVideoTutoriales(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/admin/tutorial-videos.js','js/video-tutoriales.js']).then(function(){ try { initVideoTutoriales(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      // Build 28 — Daily Video player on dashboard (auto-load + render every visit)
      if (screenId === 'dashboardScreen') {
        var _dvc = document.getElementById('dailyVideoContainer');
        var _renderDV = function () {
          if (!window.DailyVideos) { console.warn('[DailyVideos] module not loaded'); return; }
          try { window.DailyVideos.renderDailyPlayer('dailyVideoContainer'); } catch (e) { console.warn('[DailyVideos] player error:', e.message || e); }
          try { window.DailyVideos.renderCategoryBanners('dailyCategoriesContainer'); } catch (e) { console.warn('[DailyVideos] categories error:', e.message || e); }
        };
        if (_dvc) {
          if (window.DailyVideos) _renderDV();
          else if (window.MaestroLoader) { MaestroLoader.load(['js/daily-videos.js']).then(_renderDV).catch(function(e){ console.warn('[DailyVideos] load fail:', e); }); }
        }
        // Build 28 — Auto-open How To Use This App on first visit (chaka onboarding)
        try {
          var _howtoSeen = localStorage.getItem('maestro_howto_seen_v2');
          console.log('[howto] dashboardScreen handler — seen flag:', _howtoSeen);
          if (!_howtoSeen) {
            setTimeout(function () {
              if (!localStorage.getItem('maestro_howto_seen_v2')) {
                console.log('[howto] auto-opening modal (first visit)');
                localStorage.setItem('maestro_howto_seen_v2', '1');
                if (typeof showScreen === 'function') showScreen('howToUseScreen');
              }
            }, 1500);
          }
        } catch (e) { console.warn('[howto] auto-open error:', e); }
      }
      // Build 28 — Videoteca Histórica
      if (screenId === 'videotecaScreen') {
        var _vlib = function () { try { window.DailyVideos.renderLibrary('videotecaContainer'); } catch (e) { console.warn('[Navigation]', e.message || e); } };
        if (window.DailyVideos) _vlib();
        else if (window.MaestroLoader) MaestroLoader.load(['js/daily-videos.js']).then(_vlib);
      }
      // Build 28 — How To Use This App tutorial gallery
      if (screenId === 'howToUseScreen') {
        var _hto = function () { try { window.HowToUse.render('howToListContainer'); } catch (e) { console.warn('[Navigation] howto', e.message || e); } };
        if (window.HowToUse) _hto();
        else if (window.MaestroLoader) MaestroLoader.load(['js/how-to-use.js']).then(_hto).catch(function(e){ console.warn('[howto] load fail', e); });
      }
      // Build 28 — Videos Feed (TikTok-style vertical scroll). Standard $59.99+ only.
      if (screenId === 'videosFeedScreen') {
        // Native-store paywall gate: requirePremium opens the paywall and returns
        // false for non-paying iOS / Android users. Plain web passes through.
        if (typeof window.requirePremium === 'function' && !window.requirePremium('videos-feed')) {
          // Bounce back so the user doesn't get stuck on an empty screen
          // behind the paywall.
          setTimeout(function () { try { showScreen('dashboardScreen'); } catch (_) {} }, 50);
          return;
        }
        var _vfRender = function () { try { window.VideosFeed.render(); } catch (e) { console.warn('[Navigation] videos-feed', e.message || e); } };
        if (window.VideosFeed) _vfRender();
        else if (window.MaestroLoader) MaestroLoader.load(['js/videos-feed.js']).then(_vfRender).catch(function(e){ console.warn('[videos-feed] load fail', e); });
      }
      if (screenId === 'herramientasScreen') {
        if (typeof initHerramientas === 'function') { initHerramientas(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/herramientas-pt-data.js','js/herramientas.js']).then(function(){ try { initHerramientas(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
      }
      if (screenId === 'manifoldScreen') {
        if (typeof initManifoldScreen === 'function') { initManifoldScreen(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/herramientas-pt-data.js','js/herramientas.js']).then(function(){ try { initManifoldScreen(); } catch(e) { console.warn('[Navigation]', e.message || e); } });
        }
        _injectBLEBar('manifoldScreen');
      }
      if (screenId === 'multimeterScreen') {
        if (typeof initMultimeterScreen === 'function') { try { initMultimeterScreen(); } catch(e) { console.error('multimeter init error:', e); } }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/herramientas-pt-data.js','js/herramientas.js']).then(function(){ try { initMultimeterScreen(); } catch(e) { console.error('multimeter init error:', e); } });
        }
        _injectBLEBar('multimeterScreen');
      }
      if (screenId === 'manometerHvacScreen') {
        if (typeof initManometerHvac === 'function') { initManometerHvac(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/manometer-hvac.js']).then(function(){ try { initManometerHvac(); } catch(e) { console.warn('[Navigation] manometerHvac init error:', e); } });
        }
        _injectBLEBar('manometerHvacScreen');
      }
      if (screenId === 'anemometerHvacScreen') {
        if (typeof initAnemometerHvac === 'function') { initAnemometerHvac(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/anemometer-hvac.js']).then(function(){ try { initAnemometerHvac(); } catch(e) { console.warn('[Navigation] anemometerHvac init error:', e); } });
        }
        _injectBLEBar('anemometerHvacScreen');
      }
      if (screenId === 'heatingScreen') {
        if (typeof initHeatingScreen === 'function') { initHeatingScreen(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/herramientas-pt-data.js','js/herramientas-heating.js']).then(function(){ try { initHeatingScreen(); } catch(e) { console.warn('[Navigation] heatingScreen init error:', e); } });
        }
        _injectBLEBar('heatingScreen');
      }
      if (screenId === 'commercialHvacScreen') {
        if (typeof initCommercialHvacScreen === 'function') { initCommercialHvacScreen(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/herramientas-pt-data.js','js/commercial-hvac.js']).then(function(){ try { initCommercialHvacScreen(); } catch(e) { console.warn('[Navigation] commercialHvac init error:', e); } });
        }
        _injectBLEBar('commercialHvacScreen');
      }
      if (screenId === 'bluetoothToolsScreen') {
        if (typeof initBluetoothTools === 'function') { initBluetoothTools(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/ble-manager.js']).then(function(){ try { initBluetoothTools(); } catch(e) { console.warn('[Navigation] bluetoothTools init error:', e); } });
        }
      }
      // VIP gate — Estudio y Certificaciones (EPA, OSHA, NATE, A2L, Refri, Calefacción modules
      // are individually paywalled but the entry screen needs to be gated too)
      if (screenId === 'studySectionsScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('study-sections')) {
          showScreen('dashboardScreen');
          return;
        }
      }
      if (screenId === 'certOficialesScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('cert-oficiales')) {
          showScreen('dashboardScreen');
          return;
        }
      }
      // School-restricted screens (videoLessons + zoomClasses + attendance):
      // gated for app-store users; school students reach these via PWA only.
      if (screenId === 'videoLessonsScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('video-lessons')) {
          setTimeout(function () { try { showScreen('dashboardScreen'); } catch (_) {} }, 50);
          return;
        }
      }
      if (screenId === 'zoomClassesScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('zoom-classes')) {
          setTimeout(function () { try { showScreen('dashboardScreen'); } catch (_) {} }, 50);
          return;
        }
      }
      if (screenId === 'attendanceScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('attendance')) {
          setTimeout(function () { try { showScreen('dashboardScreen'); } catch (_) {} }, 50);
          return;
        }
      }
      if (screenId === 'maestroInvoicesScreen') {
        if (typeof requirePremium === 'function' && !requirePremium('maestro-invoices')) {
          showScreen('dashboardScreen');
          return;
        }
        var _crmIframe = document.getElementById('tradeMasterCrmIframe');
        if (_crmIframe) {
          var _crmBase = _crmIframe.getAttribute('data-src') || 'https://crm.trademastersusa.org/';
          // Always build URL with latest student profile data
          try {
            var _crmUser = JSON.parse(localStorage.getItem('tecnico_user') || '{}');
            var _crmEmail = _crmUser.email || localStorage.getItem('tecnico_email') || '';
            var _crmName = _crmUser.nombre || '';
            var _crmPhone = _crmUser.telefono || '';
            var _crmCity = _crmUser.ciudad || '';
            var _crmState = _crmUser.estado || '';
            if (_crmEmail) {
              _crmBase += (_crmBase.indexOf('?') === -1 ? '?' : '&') + 'embed=maestro&email=' + encodeURIComponent(_crmEmail);
              if (_crmName) _crmBase += '&name=' + encodeURIComponent(_crmName);
              if (_crmPhone) _crmBase += '&phone=' + encodeURIComponent(_crmPhone);
              if (_crmCity) _crmBase += '&city=' + encodeURIComponent(_crmCity);
              if (_crmState) _crmBase += '&state=' + encodeURIComponent(_crmState);
            }
          } catch(e) { console.warn('[CRM] user info:', e); }
          // Only reload if profile data changed (new URL differs from current)
          if (_crmIframe.src !== _crmBase) {
            _crmIframe.src = _crmBase;
          }
        }
      }
      if (screenId === 'homeWarriorScreen') {
        // Native screen — content rendered by js/homewarrior.js when user
        // taps a section in the drawer (openHomeWarriorSection). No iframe.
        // No requirePremium gate in v1 — free for all Maestro users.
      }
      if (screenId === 'partsFinderScreen') {
        if (typeof initPartsFinder === 'function') { initPartsFinder(); }
        else if (window.MaestroLoader) {
          MaestroLoader.load(['js/parts-finder-data.js', 'js/parts-finder.js']).then(function(){
            // Re-read globals after data script loads
            try { initPartsFinder(); } catch(e) { console.warn('[Navigation] partsFinder init error:', e); }
          });
        } else {
          // Fallback: poll for initPartsFinder
          var _pfPoll = setInterval(function() {
            if (typeof initPartsFinder === 'function') { clearInterval(_pfPoll); initPartsFinder(); }
          }, 200);
          setTimeout(function() { clearInterval(_pfPoll); }, 5000);
        }
      }
      // Admin dashboard init is now in MaestroLoader.load().then() callback above
    }

    // --- Capture duration of last screen on page unload ---
    window.addEventListener('beforeunload', function() {
      if (window._lastScreenEvent) {
        var dur = Math.round((Date.now() - window._lastScreenEvent.ts) / 1000);
        if (dur > 0 && dur < 3600 && window._lastScreenEvent.id && supabaseClient) {
          supabaseClient.from('screen_events')
            .update({ duration_sec: dur })
            .eq('id', window._lastScreenEvent.id)
            .then(function(){}).catch(function(){});
        }
      }
    });

    // Handle the "Comenzar" button - check if profile exists
    async function handleComenzar() {
      let savedUser = localStorage.getItem('tecnico_user');
      if (!savedUser) savedUser = localStorage.getItem('tecnico_user_backup');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user && user.nombre) {
            // User already has a profile, go directly to levels
            currentUser = user;
            // Re-save to ensure both keys have data
            localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
            localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
            // Sync with Supabase on login
            supabaseRegisterUser(currentUser).then(async (id) => {
              if (id) {
                console.log('[MaestroAC] Connected to Supabase user:', id);
                // Load cloud data and merge if newer
                const cloudData = await supabaseLoadUserData();
                if (cloudData && cloudData.progress) {
                  cloudData.progress.forEach(p => {
                    if (progress[p.nivel] && p.completed > progress[p.nivel].completed) {
                      progress[p.nivel].completed = p.completed;
                      progress[p.nivel].score = p.score;
                    }
                  });
                  saveProgress();
                  renderLevels();
                }
              }
            }).catch(function(e){ console.error('[MaestroAC] Sync error:', e); });
            var _ug1 = document.getElementById('userGreeting');
            if (_ug1) _ug1.textContent = _t('hi_greeting') + ', ' + (currentUser.nombre || _t('student')).split(' ')[0];
            showNotifBell();
            showScreen('levelsScreen');
            return;
          }
        } catch(e) {
          console.error('Error loading saved user:', e);
        }
      }
      // Fallback: check maestroac_users (Supabase Auth registered users)
      const authEmail = localStorage.getItem('tecnico_email');
      if (authEmail) {
          const allUsers = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
          const authUser = allUsers[authEmail];
          if (authUser && authUser.nombre) {
              var _eu4 = {}; try { _eu4 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
              currentUser = {
                  nombre: authUser.nombre,
                  email: authEmail,
                  telefono: authUser.telefono || _eu4.telefono || '',
                  ciudad: authUser.ciudad || _eu4.ciudad || '',
                  estado: authUser.estado || _eu4.estado || '',
                  experiencia: authUser.experiencia || '',
                  registrationDate: authUser.registrationDate
              };
              localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
              localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
              // Restore progress from Supabase if localStorage was cleared
              supabaseRegisterUser(currentUser).then(async (id) => {
                if (id) {
                  const cloudData = await supabaseLoadUserData();
                  if (cloudData && cloudData.progress) {
                    cloudData.progress.forEach(p => {
                      if (progress[p.nivel] && p.completed > progress[p.nivel].completed) {
                        progress[p.nivel].completed = p.completed;
                        progress[p.nivel].score = p.score;
                      }
                    });
                    saveProgress();
                  }
                  if (cloudData && cloudData.certificates && cloudData.certificates.length > 0) {
                    cloudData.certificates.forEach(c => {
                      let exists = certificates.some(lc => lc.level === c.nivel || lc.nivel === c.nivel);
                      if (!exists) certificates.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, date: c.fecha_obtenido });
                    });
                    saveCertificates();
                  }
                  renderLevels();
                }
              }).catch(function(e){ console.error('[MaestroAC] Sync error:', e); });
              var _ug2 = document.getElementById('userGreeting');
              if (_ug2) _ug2.textContent = _t('hi_greeting') + ', ' + (currentUser.nombre || _t('student')).split(' ')[0];
              showNotifBell();
              showScreen('levelsScreen');
              return;
          }
      }
      // No valid profile found anywhere, try Supabase users table as last resort
      if (authEmail && supabaseClient) {
          try {
              const { data: userRows } = await supabaseClient.from('users').select('*').eq('email', authEmail).limit(1);
              const techData = userRows && userRows.length > 0 ? userRows[0] : null;
              if (techData && techData.nombre) {
                  var _eu5 = {}; try { _eu5 = JSON.parse(localStorage.getItem('tecnico_user') || '{}'); } catch(e) {}
                  currentUser = {
                      nombre: techData.nombre,
                      email: authEmail,
                      telefono: techData.telefono || _eu5.telefono || '',
                      ciudad: techData.ciudad || _eu5.ciudad || '',
                      estado: techData.estado || _eu5.estado || '',
                      experiencia: techData.experiencia || '',
                      registrationDate: techData.fecha_registro
                  };
                  // Cache locally for future loads
                  const cacheUsers = JSON.parse(localStorage.getItem('maestroac_users') || '{}');
                  cacheUsers[authEmail] = { ...currentUser, password: '(supabase-auth)', verified: true };
                  localStorage.setItem('maestroac_users', JSON.stringify(cacheUsers));
                  localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
                  localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
                  // Restore progress from Supabase
                  supabaseRegisterUser(currentUser).then(async (id) => {
                    if (id) {
                      const cloudData = await supabaseLoadUserData();
                      if (cloudData && cloudData.progress) {
                        cloudData.progress.forEach(p => {
                          if (progress[p.nivel] && p.completed > progress[p.nivel].completed) {
                            progress[p.nivel].completed = p.completed;
                            progress[p.nivel].score = p.score;
                          }
                        });
                        saveProgress();
                      }
                      if (cloudData && cloudData.certificates && cloudData.certificates.length > 0) {
                        cloudData.certificates.forEach(c => {
                          let exists = certificates.some(lc => lc.level === c.nivel || lc.nivel === c.nivel);
                          if (!exists) certificates.push({ level: c.nivel, nivel: c.nivel, score: c.score, totalQuestions: c.total_questions, percentage: c.porcentaje, certificateNumber: c.certificate_number, date: c.fecha_obtenido });
                        });
                        saveCertificates();
                      }
                      renderLevels();
                    }
                  }).catch(function(e){ console.error('[MaestroAC] Sync error:', e); });
                  var _ug3 = document.getElementById('userGreeting');
                  if (_ug3) _ug3.textContent = _t('hi_greeting') + ', ' + (currentUser.nombre || _t('student')).split(' ')[0];
                  showNotifBell();
                  showScreen('levelsScreen');
                  return;
              }
          } catch(e) { console.log('[MaestroAC] Supabase fallback in Comenzar:', e); }
      }
      showScreen('registerScreen');
    }

    function registerUser() {
      var _gv = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
      currentUser = {
        nombre: _gv('nombre'),
        email: _gv('email'),
        telefono: _gv('telefono'),
        ciudad: _gv('ciudad'),
        estado: _gv('estado'),
        epa: _gv('epa'),
        nate: _gv('nate'),
        esco: _gv('esco')
      };
      // Auto-generate student ID
      if (!currentUser.studentId) {
        currentUser.studentId = generateStudentId();
        currentUser.studentIdDate = new Date().toISOString();
      }
      // Save with backup to prevent data loss
      localStorage.setItem('tecnico_user', JSON.stringify(currentUser));
      localStorage.setItem('tecnico_user_backup', JSON.stringify(currentUser));
      // Register in Supabase
      supabaseRegisterUser(currentUser).then(id => {
        if (id) console.log('[MaestroAC] User registered in Supabase:', id);
      });
      var _ug4 = document.getElementById('userGreeting');
      if (_ug4) _ug4.textContent = _t('hi_greeting') + ', ' + (currentUser.nombre || _t('student')).split(' ')[0];
      addNotification('register', '👤 ' + _t('notif_welcome_user').replace('{name}', (currentUser.nombre || _t('student')).split(' ')[0]), '👤');
      showNotifBell();
      showScreen('levelsScreen');
    }

    // === TIER SELECTION MODAL ===
    // ── ID Verification Block Modal ──
    function _showIdVerificationBlock(msg) {
      var existing = document.getElementById('idVerificationBlockModal');
      if (existing) existing.remove();

      var overlay = document.createElement('div');
      overlay.id = 'idVerificationBlockModal';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
      var idStatus = localStorage.getItem('maestroac_id_status') || 'none';
      var btnHtml = idStatus === 'pending'
        ? '<button onclick="document.getElementById(\'idVerificationBlockModal\').remove();showScreen(\'dashboardScreen\')" style="width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;font-weight:700;font-size:15px;cursor:pointer;">' + _t('understood') + '</button>'
        : '<button onclick="document.getElementById(\'idVerificationBlockModal\').remove();if(typeof _showIdUploadModal===\'function\')_showIdUploadModal();else showScreen(\'dashboardScreen\')" style="width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-weight:700;font-size:15px;cursor:pointer;">\uD83E\uDEAA ' + _t('id_upload_btn') + '</button>' +
          '<button onclick="document.getElementById(\'idVerificationBlockModal\').remove();showScreen(\'dashboardScreen\')" style="width:100%;padding:10px;border:none;background:transparent;color:#6B6B66;font-size:13px;cursor:pointer;margin-top:8px;">' + _t('back_to_home') + '</button>';

      overlay.innerHTML =
        '<div style="background:#FFFFFF;border-radius:16px;padding:32px;max-width:400px;width:100%;border:1px solid #E7E5DE;box-shadow:0 1px 2px rgba(17,17,17,0.04),0 8px 24px -8px rgba(17,17,17,0.08);text-align:center;">' +
          '<div style="font-size:48px;margin-bottom:16px;">\uD83E\uDEAA</div>' +
          '<h3 style="color:#0F0F0F;margin:0 0 12px;font-size:20px;">' + _t('id_required') + '</h3>' +
          '<p style="color:#6B6B66;font-weight:500;font-size:14px;margin:0 0 24px;line-height:1.5;">' + msg + '</p>' +
          btnHtml +
        '</div>';
      document.body.appendChild(overlay);
    }

    // ── Language Toggle ──
    // Dual-pill (ES / EN) switcher. Active side highlighted in gold.
    // Same look as #globalLangSwitcher in index.html for consistency.
    window._showLangToggle = function() {
      var currentLang = window._lang || 'es';

      // Dashboard dual-pill toggle
      var dash = document.getElementById('dashLangToggle');
      if (dash) {
        var esOn = currentLang === 'es' ? 'background:linear-gradient(135deg,#E8C97A,#C9A961);color:#0a1830;box-shadow:0 2px 8px rgba(232,201,122,0.5);' : 'background:transparent;color:rgba(255,255,255,0.6);';
        var enOn = currentLang === 'en' ? 'background:linear-gradient(135deg,#E8C97A,#C9A961);color:#0a1830;box-shadow:0 2px 8px rgba(232,201,122,0.5);' : 'background:transparent;color:rgba(255,255,255,0.6);';
        dash.innerHTML =
          '<div style="display:inline-flex;align-items:center;background:rgba(15,30,55,0.6);border:1.5px solid rgba(232,201,122,0.4);border-radius:999px;padding:3px;gap:0;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);">' +
            '<button type="button" onclick="if(window._glsPick)window._glsPick(\'es\');else window._toggleLanguage()" style="' + esOn + 'border:none;cursor:pointer;padding:6px 13px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:0.4px;display:inline-flex;align-items:center;gap:4px;transition:all 180ms ease;">🇲🇽 ES</button>' +
            '<button type="button" onclick="if(window._glsPick)window._glsPick(\'en\');else window._toggleLanguage()" style="' + enOn + 'border:none;cursor:pointer;padding:6px 13px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:0.4px;display:inline-flex;align-items:center;gap:4px;transition:all 180ms ease;">🇺🇸 EN</button>' +
          '</div>';
      }

      // Profile screen toggle (legacy text)
      var flag = currentLang === 'es' ? '🇺🇸' : '🇲🇽';
      var btnText = currentLang === 'es' ? 'English' : 'Español';

      // Profile toggle
      var container = document.getElementById('langToggleContainer');
      if (container) {
        var label = typeof _t === 'function' ? _t('lang_label') : 'Idioma';
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);">' +
          '<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">🌐</span><span style="color:#e2e8f0;font-size:14px;font-weight:600;">' + label + '</span></div>' +
          '<button onclick="window._toggleLanguage()" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">' + flag + ' ' + btnText + '</button>' +
        '</div>';
      }
    };

    window._toggleLanguage = function() {
      var newLang = (window._lang === 'es') ? 'en' : 'es';
      if (typeof _setLang === 'function') _setLang(newLang);
      // Re-render current screen
      var active = document.querySelector('.screen.active');
      if (active) showScreen(active.id);
    };

    // Re-render lang toggle when language changes
    window.addEventListener('maestro:langchange', function() {
      if (typeof window._showLangToggle === 'function') window._showLangToggle();
    });

    // Browser back button support — navigate to previous screen on popstate
    window.addEventListener('popstate', function(e) {
      if (e.state && e.state.screen) {
        _navFromPopstate = true;
        showScreen(e.state.screen);
        _navFromPopstate = false;
      }
    });
